/**
 * pnpm sesion <crr|css> <AAAA-MM-DD> [--json] [--tomo <t> --numero <n> | --legislador <id>]
 *
 * URLs estables de un diario de sesiones por fecha (docs/fuentes-oficiales/parlamento.md). Existe
 * porque los enlaces del buscador de `parlamento.gub.uy` (`infolegislativa.../temporales/<uuid>.pdf`)
 * caducan en horas, y la Hemeroteca (`biblioteca.parlamento.gub.uy/Publicaciones/sesiones<camara>/`)
 * no deja listar su carpeta (403): el número de diario dentro de una fecha no se puede adivinar.
 * Tres índices, en este orden: (1) el CSV de diputados.gub.uy (solo Representantes, desde 2014-03,
 * cacheado 24 h en `.cache/`); (2) el CDX de Wayback sobre la Hemeroteca, cualquier cámara y año,
 * con cobertura pareja pero no exhaustiva; (3) la colección `uruguay-diario-sesiones` de archive.org,
 * que tiene diarios que Wayback nunca capturó (el Senado 1990-2001, por ejemplo) pero indexa por
 * tomo/número, no por fecha, así que hace falta `--tomo/--numero` a mano o `--legislador <id>` para
 * sacarlos del endpoint de actuación legislativa de esa persona. Sin ninguna de las dos opciones,
 * este tercer índice ni se prueba. Imprime todo lo que encuentra; si no encuentra nada, sale con
 * código 1 y dice qué se probó y cómo seguir a mano.
 */
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CACHE_DIR } from '../lib/rutas.ts';
import { fetchConTimeout } from '../lib/http.ts';
import { fetchWayback } from '../lib/wayback.ts';
import { log, parsearArgs } from '../lib/log.ts';

export type Camara = 'crr' | 'css';

const NOMBRE_CAMARA: Record<Camara, string> = { crr: 'Cámara de Representantes', css: 'Cámara de Senadores' };
// Carpeta de la Hemeroteca por cámara (docs/fuentes-oficiales/parlamento.md).
const CARPETA_HEMEROTECA: Record<Camara, string> = { crr: 'sesionescrr', css: 'sesionescss' };

const CSV_DIPUTADOS = 'https://documentos.diputados.gub.uy/docs/DAdiarioSesiones.csv';
const CSV_DESDE = '2014-03-01'; // cobertura verificada del CSV: solo Representantes, desde acá (2026-09-15)
const RUTA_CACHE_CSV = join(CACHE_DIR, 'sesiones', 'DAdiarioSesiones.csv');
const CACHE_CSV_HORAS = 24;

export interface FilaCsv {
  legislatura: string;
  periodo: string;
  tipo: string;
  sesion: string;
  sesionTipo: string;
  fecha: string; // normalizada a AAAA-MM-DD (el CSV mezcla "2026/07/14" y "2014-03-12 00:00:00")
  diario: string;
  url: string;
}

/** "2026/07/14" o "2014-03-12 00:00:00" (cualquier separador de fecha) -> "AAAA-MM-DD", o null. */
export function normalizarFechaCsv(valor: string): string | null {
  const m = valor.trim().match(/^(\d{4})[/-](\d{2})[/-](\d{2})/);
  return m ? `${m[1]}-${m[2]}-${m[3]}` : null;
}

/** Una fila de datos del CSV (sin encabezado). null si faltan campos o la fecha no parsea. */
export function parsearFilaCsv(linea: string): FilaCsv | null {
  const campos = linea.split(',');
  if (campos.length < 8) return null;
  const [legislatura, periodo, tipo, sesion, sesionTipo, fechaCruda, diario, ...resto] = campos;
  const fecha = normalizarFechaCsv(fechaCruda);
  if (!fecha || !diario) return null;
  return { legislatura, periodo, tipo, sesion, sesionTipo, fecha, diario: diario.trim(), url: resto.join(',').trim() };
}

/** El CSV entero (con encabezado): filas válidas, en el orden en que vinieron. */
export function parsearCsv(contenido: string): FilaCsv[] {
  const filas: FilaCsv[] = [];
  for (const linea of contenido.split(/\r?\n/).slice(1)) {
    const fila = linea.trim() ? parsearFilaCsv(linea) : null;
    if (fila) filas.push(fila);
  }
  return filas;
}

/** Baja el CSV de diputados.gub.uy con caché de 24 h en `.cache/sesiones/`. */
async function csvDiputados(): Promise<string> {
  mkdirSync(join(CACHE_DIR, 'sesiones'), { recursive: true });
  if (existsSync(RUTA_CACHE_CSV) && (Date.now() - statSync(RUTA_CACHE_CSV).mtimeMs) / 3_600_000 < CACHE_CSV_HORAS) {
    return readFileSync(RUTA_CACHE_CSV, 'utf8');
  }
  try {
    const r = await fetchConTimeout(CSV_DIPUTADOS, { timeoutMs: 30_000 });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const texto = await r.text();
    writeFileSync(RUTA_CACHE_CSV, texto, 'utf8');
    return texto;
  } catch (e) {
    if (!existsSync(RUTA_CACHE_CSV)) throw e;
    log.aviso(`${CSV_DIPUTADOS} no respondió (${(e as Error).message}); se usa la copia en caché, puede estar vieja`);
    return readFileSync(RUTA_CACHE_CSV, 'utf8');
  }
}

/** URL del índice CDX de Wayback para `<prefijo>*` en la carpeta de la Hemeroteca de esa cámara. */
export function comandoCdx(camara: Camara, prefijo: string): string {
  return `http://web.archive.org/cdx/search/cdx?url=biblioteca.parlamento.gub.uy/Publicaciones/${CARPETA_HEMEROTECA[camara]}/${prefijo}*&output=txt&fl=original&collapse=urlkey`;
}

/** Fecha y número de diario de una URL estable de la Hemeroteca; null si no matchea el patrón. */
export function parsearUrlHemeroteca(url: string): { fecha: string; numero: string } | null {
  const m = decodeURIComponent(url).match(/\/(\d{4}-\d{2}-\d{2})\s*-\s*DIARIO DE SESIONES.*\((\d+)\)\.pdf\s*$/i);
  return m ? { fecha: m[1], numero: m[2] } : null;
}

/** Consulta CDX ya resuelta: una URL por línea (`output=txt&fl=original`). */
async function cdx(camara: Camara, prefijo: string): Promise<string[]> {
  const r = await fetchWayback(comandoCdx(camara, prefijo), { timeoutMs: 30_000 });
  if (!r.ok) return [];
  return (await r.text()).split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
}

export interface FuenteSesion { origen: 'csv' | 'cdx' | 'archive'; url: string; diario?: string; tomo?: number }
/** `intentos`: qué se probó, en orden, para el mensaje de error si no hay resultados. */
export interface ResultadoSesion { fuentes: FuenteSesion[]; intentos: string[] }

// --- archive.org: colección `uruguay-diario-sesiones` (docs/fuentes-oficiales/parlamento.md) ---

const URL_ACTUACION = (id: string) =>
  `https://parlamento.gub.uy/camarasycomisiones/legisladores/${id}/actuacion-legislador/json?_format=json`;

export interface FilaActuacion { Fecha: string; Texto: string; [clave: string]: unknown }
export interface CandidatoArchive { tomo?: number; numero: number }

/** "DD-MM-YYYY" (formato del endpoint de actuación legislativa) -> "AAAA-MM-DD", o null. */
export function normalizarFechaActuacion(valor: string): string | null {
  const m = valor.trim().match(/^(\d{2})-(\d{2})-(\d{4})$/);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : null;
}

/**
 * Saca tomo y número de diario del campo `Texto` de una fila de actuación legislativa, del tipo
 * `… <a href="…">tomo 68 pag.5 d.s.41</A>`. Tomo 0 significa "no consta" (algunas filas viejas lo
 * traen así) y se devuelve tal cual: quien llama decide qué hacer (para Senado, se descarta antes
 * de armar el identificador, porque sin tomo no hay `UruguayDiarioSesiones_CS_<tomo>_<numero>`).
 */
export function parsearActuacion(texto: string): { tomo: number; numero: number } | null {
  const m = texto.match(/tomo\s+(\d+)[\s\S]*?d\.?\s*s\.?\s*(\d+)/i);
  return m ? { tomo: Number(m[1]), numero: Number(m[2]) } : null;
}

/** Descarta candidatos repetidos (mismo tomo y número), conserva el orden de aparición. */
export function deduplicarCandidatosArchive(candidatos: CandidatoArchive[]): CandidatoArchive[] {
  const vistos = new Set<string>();
  const resultado: CandidatoArchive[] = [];
  for (const c of candidatos) {
    const clave = `${c.tomo ?? ''}|${c.numero}`;
    if (!vistos.has(clave)) {
      vistos.add(clave);
      resultado.push(c);
    }
  }
  return resultado;
}

/**
 * Identificador de archive.org (colección `uruguay-diario-sesiones`). Senadores rellena tomo y
 * número a 3 dígitos (`UruguayDiarioSesiones_CS_068_041`); Representantes no lleva tomo y el
 * número va sin rellenar (`UruguayDiarioSesiones_CR_3548`). Tira si a css le falta el tomo: eso se
 * filtra antes de llegar acá (tomo 0 = desconocido).
 */
export function identificadorArchive(camara: Camara, candidato: CandidatoArchive): string {
  if (camara === 'css') {
    if (!candidato.tomo) throw new Error('Senadores necesita tomo (mayor a 0) para el identificador de archive.org');
    return `UruguayDiarioSesiones_CS_${String(candidato.tomo).padStart(3, '0')}_${String(candidato.numero).padStart(3, '0')}`;
  }
  return `UruguayDiarioSesiones_CR_${candidato.numero}`;
}

/** Filas de actuación legislativa de una persona (parlamento.gub.uy). */
async function actuacionLegislador(id: string): Promise<FilaActuacion[]> {
  const r = await fetchConTimeout(URL_ACTUACION(id), { timeoutMs: 30_000 });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const datos = (await r.json()) as unknown;
  return Array.isArray(datos) ? (datos as FilaActuacion[]) : [];
}

/** Existe el ítem en archive.org: metadata de uno inexistente viene vacía (`{}`). */
async function existeItemArchive(id: string): Promise<boolean> {
  try {
    const r = await fetchWayback(`https://archive.org/metadata/${id}`, { timeoutMs: 20_000 });
    if (!r.ok) return false;
    const datos = (await r.json()) as Record<string, unknown>;
    return Object.keys(datos).length > 0;
  } catch (e) {
    log.debug(`no se pudo verificar ${id} en archive.org: ${(e as Error).message}`);
    return false;
  }
}

export interface OpcionesBusqueda {
  tomo?: number;
  numero?: number;
  legislador?: string;
}

/** Busca las URLs estables de una fecha en los índices, en el orden documentado arriba. */
export async function buscarSesion(camara: Camara, fecha: string, opciones: OpcionesBusqueda = {}): Promise<ResultadoSesion> {
  const fuentes: FuenteSesion[] = [];
  const intentos: string[] = [];

  if (camara === 'crr' && fecha >= CSV_DESDE) {
    intentos.push(`CSV de diputados.gub.uy (${CSV_DIPUTADOS}), cacheado en ${RUTA_CACHE_CSV}`);
    try {
      for (const f of parsearCsv(await csvDiputados())) {
        if (f.fecha === fecha) fuentes.push({ origen: 'csv', url: f.url, diario: f.diario });
      }
    } catch (e) {
      log.aviso(`no se pudo leer el CSV de diputados.gub.uy: ${(e as Error).message}`);
    }
  }

  intentos.push(`CDX de Wayback sobre la Hemeroteca (${comandoCdx(camara, fecha)})`);
  for (const url of await cdx(camara, fecha)) fuentes.push({ origen: 'cdx', url });

  const candidatos: CandidatoArchive[] = [];
  if (opciones.tomo !== undefined || opciones.numero !== undefined) {
    if (opciones.numero !== undefined) candidatos.push({ tomo: opciones.tomo, numero: opciones.numero });
  }
  if (opciones.legislador) {
    intentos.push(`actuación legislativa de ${opciones.legislador} (${URL_ACTUACION(opciones.legislador)})`);
    try {
      for (const fila of await actuacionLegislador(opciones.legislador)) {
        if (normalizarFechaActuacion(fila.Fecha) !== fecha) continue;
        const datos = parsearActuacion(fila.Texto);
        if (datos) candidatos.push(datos);
      }
    } catch (e) {
      log.aviso(`no se pudo leer la actuación de ${opciones.legislador}: ${(e as Error).message}`);
    }
  }

  for (const candidato of deduplicarCandidatosArchive(candidatos)) {
    if (camara === 'css' && !candidato.tomo) {
      log.aviso(`candidato de archive.org con tomo desconocido (0) para Senadores, d.s. ${candidato.numero}: se descarta`);
      continue;
    }
    const id = identificadorArchive(camara, candidato);
    intentos.push(`archive.org: ${id}`);
    if (await existeItemArchive(id)) {
      fuentes.push({ origen: 'archive', url: `https://archive.org/download/${id}/${id}.pdf`, diario: String(candidato.numero), tomo: candidato.tomo });
    }
  }

  return { fuentes, intentos };
}

/** Diario más cercano (antes y/o después) dentro del mismo año, para contar a mano desde ahí. */
async function pistaCercana(camara: Camara, fecha: string): Promise<string> {
  const anio = fecha.slice(0, 4);
  const urls = await cdx(camara, anio).catch(() => [] as string[]);
  const fechas = urls
    .map(parsearUrlHemeroteca)
    .filter((x): x is { fecha: string; numero: string } => x !== null)
    .sort((a, b) => a.fecha.localeCompare(b.fecha));
  if (fechas.length === 0) {
    return (
      `Wayback no tiene ninguna captura de ${CARPETA_HEMEROTECA[camara]}/${anio}-* para usar de referencia. ` +
      'Revisá el inventario oficial (biblioteca.parlamento.gub.uy/File/Biblioteca/DiariosdeSesionesDisponibles.pdf) ' +
      'o navegá el timeline de la Hemeroteca a mano.'
    );
  }
  const anterior = [...fechas].reverse().find((f) => f.fecha <= fecha);
  const posterior = fechas.find((f) => f.fecha >= fecha);
  const partes: string[] = [];
  if (anterior) partes.push(`el más cercano anterior en Wayback es ${anterior.fecha} (diario nº ${anterior.numero})`);
  if (posterior) partes.push(`el más cercano posterior es ${posterior.fecha} (diario nº ${posterior.numero})`);
  return (
    `${partes.join('; ')}. El número de diario es consecutivo dentro de una legislatura: contando sesiones ` +
    `desde ahí hasta ${fecha} se arma la URL a mano con el patrón de docs/fuentes-oficiales/parlamento.md.`
  );
}

const USO =
  'Uso: pnpm sesion <crr|css> <AAAA-MM-DD> [--json] [--tomo <t> --numero <n> | --legislador <id>]\n' +
  '  --tomo/--numero: identificador directo en archive.org (css necesita los dos; crr solo --numero).\n' +
  '  --legislador <id>: saca tomo y d.s. del endpoint de actuación de esa persona en parlamento.gub.uy.\n';

async function main(): Promise<number> {
  const { posicionales, opciones } = parsearArgs(process.argv.slice(2));
  const camara = posicionales[0];
  const fecha = posicionales[1];
  if ((camara !== 'crr' && camara !== 'css') || !fecha || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    process.stderr.write(USO);
    return 2;
  }
  const json = opciones.json === true;
  const legislador = typeof opciones.legislador === 'string' ? opciones.legislador : undefined;
  const tomo = opciones.tomo !== undefined ? Number(opciones.tomo) : undefined;
  const numero = opciones.numero !== undefined ? Number(opciones.numero) : undefined;
  if ((tomo !== undefined && !Number.isFinite(tomo)) || (numero !== undefined && !Number.isFinite(numero))) {
    process.stderr.write('--tomo y --numero van con un número entero\n' + USO);
    return 2;
  }
  if (camara === 'css' && ((tomo !== undefined) !== (numero !== undefined))) {
    process.stderr.write('para css, --tomo y --numero van juntos\n' + USO);
    return 2;
  }
  const usoArchivoDirecto = tomo !== undefined || numero !== undefined || legislador !== undefined;

  const { fuentes, intentos } = await buscarSesion(camara, fecha, { tomo, numero, legislador });
  if (fuentes.length === 0) {
    const pista = await pistaCercana(camara, fecha);
    let mensaje =
      `sin resultados para ${NOMBRE_CAMARA[camara]} el ${fecha}. Se probó:\n` +
      intentos.map((i) => `  - ${i}`).join('\n') +
      `\n${pista}`;
    if (!usoArchivoDirecto) {
      mensaje +=
        '\nPara sesiones que Wayback nunca capturó (el Senado entre 1990 y 2001, por ejemplo), probá la ' +
        'colección `uruguay-diario-sesiones` de archive.org con `pnpm sesion ' + camara + ' ' + fecha +
        ' --legislador <id>` (el id de la página de esa persona en parlamento.gub.uy/camarasycomisiones/legisladores/<id>) ' +
        'o, si ya sabés el tomo y el número de diario, con `--tomo <t> --numero <n>`. El tomo y el "d.s." de una fecha ' +
        'están en el endpoint de actuación legislativa (…/actuacion-legislador/json?_format=json) de esa persona.';
    }
    if (json) process.stdout.write(JSON.stringify({ camara, fecha, fuentes: [], error: mensaje }) + '\n');
    else process.stderr.write(mensaje + '\n');
    return 1;
  }

  if (json) {
    process.stdout.write(JSON.stringify({ camara, fecha, fuentes }, null, 1) + '\n');
    return 0;
  }
  for (const f of fuentes) {
    process.stdout.write(`[${f.origen}]${f.tomo ? ` tomo ${f.tomo}` : ''}${f.diario ? ` diario ${f.diario}` : ''} ${f.url}\n`);
  }
  return 0;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main()
    .then((codigo) => { process.exitCode = codigo; })
    .catch((e) => {
      log.error((e as Error).message);
      process.exitCode = 1;
    });
}
