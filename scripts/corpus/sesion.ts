/**
 * pnpm sesion <crr|css> <AAAA-MM-DD> [--json] [--tomo <t> --numero <n> | --legislador <id>]
 *
 * URLs estables de un diario de sesiones por fecha (docs/fuentes-oficiales/parlamento.md). Existe
 * porque los enlaces del buscador de `parlamento.gub.uy` (`infolegislativa.../temporales/<uuid>.pdf`)
 * caducan en horas, y la Hemeroteca (`biblioteca.parlamento.gub.uy/Publicaciones/sesiones<camara>/`)
 * no deja listar su carpeta (403): el número de diario dentro de una fecha no se puede adivinar.
 * Cuatro índices, en este orden: (1) el CSV de diputados.gub.uy (solo Representantes, desde 2014-03,
 * cacheado 24 h en `.cache/`); (2) el CDX de Wayback sobre la Hemeroteca, cualquier cámara y año,
 * con cobertura pareja pero no exhaustiva; (3) `data/diarios-archive.json` (`pnpm sesion:indexar`),
 * el índice fecha → ítem de la colección `uruguay-diario-sesiones` de archive.org, que se prueba
 * solo, sin opciones; (4) esa misma colección a mano, con `--tomo/--numero` o `--legislador <id>`
 * para sacarlos del endpoint de actuación legislativa de esa persona, para cuando el índice no
 * tiene el ítem (todavía no se corrió `pnpm sesion:indexar`, o el ítem quedó `sin_fecha`/`sin_ocr`).
 * Todo candidato de archive.org, venga del índice o a mano, pasa por la misma verificación de
 * cabecera antes de darse por bueno. Imprime todo lo que encuentra; si no encuentra nada, sale con
 * código 1 y dice qué se probó y cómo seguir a mano.
 */
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CACHE_DIR } from '../lib/rutas.ts';
import { fetchConTimeout } from '../lib/http.ts';
import { fetchWayback } from '../lib/wayback.ts';
import { log, parsearArgs } from '../lib/log.ts';
import { leerIndice, RUTA_INDICE, type IndiceDiarios } from '../lib/indice-diarios.ts';

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

export interface FuenteSesion {
  origen: 'csv' | 'cdx' | 'archive';
  url: string;
  diario?: string;
  tomo?: number;
  /** Solo `archive`: la cabecera del OCR confirmó (o no) que el identificador es el de esta fecha. */
  verificada?: boolean;
  /** Solo `archive` con `verificada: true`: la fecha tal como matcheó en la cabecera. */
  fecha_cabecera?: string;
}
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

/**
 * Candidatos tomo/número de `data/diarios-archive.json` cuyas `fechas` incluyen `fecha`, para esa
 * cámara (`css` → `CS`, `crr` → `CR`). Pura: recibe el índice ya leído. El índice acelera, no
 * reemplaza el cotejo de cabecera que hace `buscarSesion` con cada candidato.
 */
export function candidatosDelIndice(indice: IndiceDiarios | null, camara: Camara, fecha: string): CandidatoArchive[] {
  if (!indice) return [];
  const camaraArchive = camara === 'css' ? 'CS' : 'CR';
  const candidatos: CandidatoArchive[] = [];
  for (const item of Object.values(indice.items)) {
    if (item.camara !== camaraArchive || !item.fechas.includes(fecha)) continue;
    candidatos.push({ tomo: item.tomo, numero: item.numero });
  }
  return candidatos;
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

const MESES: Record<string, number> = {
  ENERO: 1, FEBRERO: 2, MARZO: 3, ABRIL: 4, MAYO: 5, JUNIO: 6, JULIO: 7,
  AGOSTO: 8, SETIEMBRE: 9, SEPTIEMBRE: 9, OCTUBRE: 10, NOVIEMBRE: 11, DICIEMBRE: 12,
};

/** Saca tildes de vocales para tolerar ruido de OCR en la cabecera (los meses no llevan más acentos que esos). */
function sinTildes(texto: string): string {
  return texto
    .replace(/[áàäâ]/gi, 'a')
    .replace(/[éèëê]/gi, 'e')
    .replace(/[íìïî]/gi, 'i')
    .replace(/[óòöô]/gi, 'o')
    .replace(/[úùüû]/gi, 'u');
}

/**
 * Fechas en español de la cabecera de un diario de sesiones («23 DE MAYO DE 2001», «26 Y 27 DE
 * MARZO DE 1990» → dos fechas, «1º DE MARZO DE 1995»). Pura, no toca la red: la usa
 * `cabeceraArchive` sobre el `_djvu.txt` de archive.org para confirmar que el identificador
 * (tomo/número) corresponde a la fecha pedida antes de citarlo. Tolera mayúsculas/minúsculas,
 * tildes perdidas por el OCR y variantes del ordinal («1º», «1°», «1o»). Devuelve ISO
 * (AAAA-MM-DD) en el orden en que aparecen las fechas en el texto; lista vacía si no encuentra
 * ninguna.
 */
export function fechasDeCabecera(texto: string): string[] {
  const limpio = sinTildes(texto).toUpperCase();
  const dia = '\\d{1,2}[º°O]?';
  const listaDias = `${dia}(?:\\s*[,Y]\\s*${dia})*`;
  const patronMeses = Object.keys(MESES).join('|');
  const re = new RegExp(`(${listaDias})\\s+DE\\s+(${patronMeses})\\s+DE\\s+(\\d{4})`, 'g');
  const resultado: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(limpio))) {
    const [, dias, mesTexto, anio] = m;
    const mes = String(MESES[mesTexto]).padStart(2, '0');
    for (const diaCrudo of dias.split(/\s*[,Y]\s*/)) {
      const numero = diaCrudo.replace(/[º°O]/g, '').trim().padStart(2, '0');
      if (numero) resultado.push(`${anio}-${mes}-${numero}`);
    }
  }
  return resultado;
}

/** Antes de "REPUBLICA": después arranca el cuerpo del diario (sumario, citación, discusión), donde
 * aparecen otras fechas (la citación siempre trae la del día anterior) que no son la de la sesión y
 * ensuciarían la comparación —incluso podrían coincidir de casualidad con la fecha pedida y hacer
 * pasar por buena una cabecera que en realidad dice otra cosa (verificado 2026-09-16 sobre
 * UruguayDiarioSesiones_CS_407_103: el cuerpo trae "Montevideo, 22 de mayo de 2001" a metros del
 * "23 DE MAYO DE 2001" real de la cabecera). Sin el marcador (OCR raro), un prefijo corto: mejor no
 * reconocer la fecha (`verificada: false`) que arriesgar un falso positivo. */
export function recortarCabecera(texto: string): string {
  const idx = texto.search(/REPUBLICA/i);
  return idx >= 0 ? texto.slice(0, idx) : texto.slice(0, 200);
}

export const RANGO_CABECERA = 'bytes=0-2999';

/**
 * Cabecera real (recortada con `recortarCabecera`) de los primeros ~3000 bytes del OCR
 * (`<id>_djvu.txt`) de un ítem de archive.org: número de diario, tomo y la fecha en letras. `null`
 * si el archivo no existe o falla la red: quien llama lo trata como "fecha sin confirmar", no como
 * error fatal.
 */
async function cabeceraArchive(id: string): Promise<string | null> {
  try {
    const r = await fetchWayback(`https://archive.org/download/${id}/${id}_djvu.txt`, {
      timeoutMs: 20_000,
      headers: { Range: RANGO_CABECERA },
    });
    if (!r.ok) return null;
    return recortarCabecera(await r.text());
  } catch (e) {
    log.debug(`no se pudo leer la cabecera OCR de ${id}: ${(e as Error).message}`);
    return null;
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
  if (opciones.tomo === undefined && opciones.numero === undefined && !opciones.legislador) {
    intentos.push(`índice data/diarios-archive.json (pnpm sesion:indexar)`);
    const indice = leerIndice(RUTA_INDICE);
    if (indice) {
      const candidatosIndice = candidatosDelIndice(indice, camara, fecha);
      candidatos.push(...candidatosIndice);
    } else {
      const mensaje =
        'data/diarios-archive.json no existe: `pnpm sesion:indexar` lo construye (una corrida, ' +
        '30 a 40 minutos de red, sin tokens). Sin él, la colección de archive.org solo se prueba ' +
        'con --tomo/--numero o --legislador <id>.';
      log.aviso(mensaje);
      intentos.push(mensaje);
    }
  }
  if (opciones.legislador) {
    intentos.push(`actuación legislativa de ${opciones.legislador} (${URL_ACTUACION(opciones.legislador)})`);
    try {
      const filas = await actuacionLegislador(opciones.legislador);
      if (filas.length === 0) {
        // El endpoint devuelve [] entero (no filtrado por fecha) para legisladores que no están en
        // la legislatura actual (verificado 2026-09-16 con Danilo Astori, id 479: [] con o sin
        // Fechadesde/Fechahasta/Legislatura). Para esos, tomo y número salen de otro lado.
        intentos.push(
          `el endpoint de actuación legislativa no devolvió ninguna fila para el id ${opciones.legislador} ` +
            '(pasa con legisladores que no están en la legislatura actual, aunque hayan participado de la sesión); ' +
            'para ellos hace falta --tomo <t> --numero <n> directo, sacados del diario mismo o de un índice',
        );
      }
      for (const fila of filas) {
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
    if (!(await existeItemArchive(id))) continue;

    const textoCabecera = await cabeceraArchive(id);
    const fechasCabecera = textoCabecera ? fechasDeCabecera(textoCabecera) : [];
    if (fechasCabecera.length > 0 && !fechasCabecera.includes(fecha)) {
      const mensaje =
        `archive.org ${id}: la cabecera dice ${fechasCabecera.join(' y ')}, no ${fecha}: identificador equivocado`;
      log.aviso(mensaje);
      intentos.push(mensaje);
      continue;
    }
    const verificada = fechasCabecera.includes(fecha);
    if (!verificada) log.aviso(`archive.org ${id}: fecha sin confirmar en la cabecera`);
    fuentes.push({
      origen: 'archive',
      url: `https://archive.org/download/${id}/${id}.pdf`,
      diario: String(candidato.numero),
      tomo: candidato.tomo,
      verificada,
      ...(verificada ? { fecha_cabecera: fecha } : {}),
    });
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
  '  Sin --tomo/--numero/--legislador, además del CSV y Wayback se prueba solo `data/diarios-archive.json`\n' +
  '  (pnpm sesion:indexar), el índice fecha → ítem de archive.org.\n' +
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
    let linea = `[${f.origen}]${f.tomo ? ` tomo ${f.tomo}` : ''}${f.diario ? ` diario ${f.diario}` : ''}`;
    if (f.origen === 'archive') linea += f.verificada ? ` (cabecera: ${f.fecha_cabecera})` : ' (cabecera sin confirmar)';
    process.stdout.write(`${linea} ${f.url}\n`);
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
