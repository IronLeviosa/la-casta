/**
 * pnpm sesion <crr|css> <AAAA-MM-DD> [--json]
 *
 * URLs estables de un diario de sesiones por fecha (docs/fuentes-oficiales/parlamento.md). Existe
 * porque los enlaces del buscador de `parlamento.gub.uy` (`infolegislativa.../temporales/<uuid>.pdf`)
 * caducan en horas, y la Hemeroteca (`biblioteca.parlamento.gub.uy/Publicaciones/sesiones<camara>/`)
 * no deja listar su carpeta (403): el número de diario dentro de una fecha no se puede adivinar.
 * Dos índices, en este orden: (1) el CSV de diputados.gub.uy (solo Representantes, desde 2014-03,
 * cacheado 24 h en `.cache/`); (2) el CDX de Wayback sobre la Hemeroteca, cualquier cámara y año,
 * con cobertura pareja pero no exhaustiva. Imprime todo lo que encuentra en ambos; si no encuentra
 * nada, sale con código 1 y dice qué se probó y cómo construir la URL a mano.
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

export interface FuenteSesion { origen: 'csv' | 'cdx'; url: string; diario?: string }
/** `intentos`: qué se probó, en orden, para el mensaje de error si no hay resultados. */
export interface ResultadoSesion { fuentes: FuenteSesion[]; intentos: string[] }

/** Busca las URLs estables de una fecha en los dos índices, en el orden documentado arriba. */
export async function buscarSesion(camara: Camara, fecha: string): Promise<ResultadoSesion> {
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

const USO = 'Uso: pnpm sesion <crr|css> <AAAA-MM-DD> [--json]\n';

async function main(): Promise<number> {
  const { posicionales, opciones } = parsearArgs(process.argv.slice(2));
  const camara = posicionales[0];
  const fecha = posicionales[1];
  if ((camara !== 'crr' && camara !== 'css') || !fecha || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    process.stderr.write(USO);
    return 2;
  }
  const json = opciones.json === true;
  const { fuentes, intentos } = await buscarSesion(camara, fecha);
  if (fuentes.length === 0) {
    const pista = await pistaCercana(camara, fecha);
    const mensaje =
      `sin resultados para ${NOMBRE_CAMARA[camara]} el ${fecha}. Se probó:\n` +
      intentos.map((i) => `  - ${i}`).join('\n') +
      `\n${pista}`;
    if (json) process.stdout.write(JSON.stringify({ camara, fecha, fuentes: [], error: mensaje }) + '\n');
    else process.stderr.write(mensaje + '\n');
    return 1;
  }

  if (json) {
    process.stdout.write(JSON.stringify({ camara, fecha, fuentes }, null, 1) + '\n');
    return 0;
  }
  for (const f of fuentes) process.stdout.write(`[${f.origen}]${f.diario ? ` diario ${f.diario}` : ''} ${f.url}\n`);
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
