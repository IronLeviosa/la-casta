/**
 * pnpm dato <serie> [--anio AAAA] [--mes AAAA-MM] [--fecha AAAA-MM-DD] [--json]
 * pnpm dato --lista
 *
 * Lee la definición de una serie oficial en docs/fuentes-oficiales/series.yaml, baja (o toma del
 * corpus) el documento con la misma maquinaria de `pnpm fuente` (reusa `obtenerNota`, no la
 * duplica), ubica la fila o el valor del período pedido y devuelve: el valor con su unidad y
 * período, la línea citable exacta (la fila tal como la imprime `pnpm fuente`, lista para `cita`),
 * la URL, el medio que corresponde y un bloque YAML para pegar en `dato_real.fuentes[]`.
 *
 * Por qué existe: docs/colecciones/chequeos.md exige documento oficial en `dato_real` para
 * cualquier calificación que no sea `discutible`; 22 de 32 chequeos publicados se quedaron ahí por
 * falta de ese documento. Casi siempre el dato sale de la misma decena de series (tipo de cambio,
 * IPC, desempleo, combustibles, recaudación, deuda, resultado fiscal). Esta herramienta evita que
 * cada chequeo repita la búsqueda de la URL y el mapeo de columnas.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';
import { RAIZ, RUTAS_CONTENIDO } from './lib/rutas.ts';
import { log, parsearArgs } from './lib/log.ts';
import { obtenerNota, slugDeMedio } from './corpus/fuente.ts';

// ----- Definición de una serie oficial -----

export type Frecuencia = 'mensual' | 'anual' | 'diaria' | 'semanal';
export type TipoSerie = 'api_json' | 'planilla' | 'csv' | 'pdf' | 'html';

/**
 * Cómo se identifica el período dentro del documento (independiente de `como_leer`, que es la
 * misma información en prosa para quien lee el archivo a mano). Ver el encabezado de
 * `docs/fuentes-oficiales/series.yaml` para el detalle de cada uno.
 */
export type FormatoPeriodo =
  | 'fecha_iso' // la columna de período trae una fecha ISO completa (o el 1° del mes)
  | 'anio_mes_columnas' // dos columnas iniciales: año y mes (número, abreviatura o nombre)
  | 'anio_bloque_mes' // una fila solo con el año, después una fila por mes (formato INE/ECH)
  | 'mes_abrev_en_anio2' // "Mar-22": abreviatura de mes en inglés + 2 dígitos de año (formato ANP)
  | 'ninguno'; // el documento ya es de un único período (va en la URL); solo hace falta el filtro

export interface SerieOficial {
  id: string;
  organismo: string;
  nombre: string;
  unidad: string;
  frecuencia: Frecuencia;
  url?: string;
  tipo?: TipoSerie;
  como_leer?: string;
  desde: string;
  ejemplo: string;
  verificado: string;
  /** Sin URL estable o solo PDF de formato irregular: se busca a mano, `pnpm dato` no lo intenta. */
  manual?: boolean;
  como_buscar?: string;
  // --- Campos que no pide el ítem 3.2, pero que usa esta herramienta para no repetir a mano lo
  // que ya describe `como_leer`. Si un campo de acá contradice a `como_leer`, vale `como_leer`. ---
  formato_periodo?: FormatoPeriodo;
  /** Columna (0-based) donde vive el período, para `fecha_iso`. Por defecto 0. */
  columna_periodo?: number;
  /** Delimitador de columnas de una fila ya localizada: 'tab' | ';' | ',' | 'espacios' (2+ espacios). */
  separador?: string;
  /** Si el separador es ',' y hay campos entre comillas con comas adentro (CSV de verdad). */
  separador_respeta_comillas?: boolean;
  /** Columna (0-based) con el valor a reportar. */
  columna?: number;
  /** Subcadena literal que además tiene que aparecer en la fila (moneda, combustible, producto...). */
  filtro?: string;
  /** Cómo formatear `{fecha}` al armar la URL. Por defecto, ISO (AAAA-MM-DD). */
  formato_fecha_url?: 'dd/mm/aaaa';
  /** La URL es un índice (API de metadatos): seguir el recurso de este `format` para los datos reales. */
  sigue_recurso_formato?: string;
  /** Slug de medio a usar tal cual (cuando `slugDeMedio` no tiene ficha en content/medios/). */
  medio?: string;
}

const CAMPOS_REQUERIDOS = ['id', 'organismo', 'nombre', 'unidad', 'frecuencia', 'desde', 'ejemplo', 'verificado'] as const;

/** Parsea y valida el contenido de series.yaml. Función pura: no toca disco. */
export function parsearSeries(contenidoYaml: string): SerieOficial[] {
  const doc = parseYaml(contenidoYaml) as { series?: unknown } | null;
  if (!doc || !Array.isArray(doc.series)) {
    throw new Error('series.yaml debe tener una clave "series" con una lista de series.');
  }
  const vistos = new Set<string>();
  return doc.series.map((s, i) => {
    const serie = s as Record<string, unknown>;
    const etiqueta = typeof serie.id === 'string' ? serie.id : `#${i}`;
    for (const campo of CAMPOS_REQUERIDOS) {
      const v = serie[campo];
      if (v === undefined || v === null || v === '') {
        throw new Error(`series.yaml: la serie "${etiqueta}" no tiene el campo obligatorio "${campo}".`);
      }
    }
    const id = String(serie.id);
    if (vistos.has(id)) throw new Error(`series.yaml: el id "${id}" está repetido.`);
    vistos.add(id);
    if (!serie.manual && !serie.url) {
      throw new Error(`series.yaml: la serie "${id}" no es manual y no tiene "url".`);
    }
    if (serie.manual && !serie.como_buscar) {
      throw new Error(`series.yaml: la serie "${id}" es manual y no tiene "como_buscar".`);
    }
    return serie as unknown as SerieOficial;
  });
}

const RUTA_SERIES_POR_DEFECTO = join(RAIZ, 'docs', 'fuentes-oficiales', 'series.yaml');

export function cargarSeries(ruta: string = RUTA_SERIES_POR_DEFECTO): SerieOficial[] {
  return parsearSeries(readFileSync(ruta, 'utf8'));
}

export function listarSeries(series: SerieOficial[]): string {
  return series
    .map((s) => `${s.id.padEnd(42)} ${(s.manual ? '[manual]' : s.frecuencia).padEnd(9)} ${s.organismo} — ${s.nombre}`)
    .join('\n');
}

// ----- Período pedido por línea de comandos -----

export interface Periodo {
  anio?: number;
  mes?: number; // 1-12
  dia?: number;
}

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

export function isoFecha(anio: number, mes: number, dia: number): string {
  return `${anio}-${pad2(mes)}-${pad2(dia)}`;
}

/** Nivel de precisión del período: 0 nada, 1 año, 2 año+mes, 3 fecha completa. */
function nivel(periodo: Periodo): 0 | 1 | 2 | 3 {
  if (periodo.dia !== undefined) return 3;
  if (periodo.mes !== undefined) return 2;
  if (periodo.anio !== undefined) return 1;
  return 0;
}

function nivelRequerido(frecuencia: Frecuencia): 1 | 2 | 3 {
  if (frecuencia === 'anual') return 1;
  if (frecuencia === 'mensual') return 2;
  return 3; // diaria, semanal
}

/** Lee `--anio`, `--mes` o `--fecha` de las opciones ya parseadas por `parsearArgs`. */
export function parsearPeriodo(opciones: Record<string, string | boolean>): Periodo {
  if (typeof opciones.fecha === 'string') {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(opciones.fecha.trim());
    if (!m) throw new Error(`--fecha debe ser AAAA-MM-DD; recibí "${opciones.fecha}".`);
    return { anio: Number(m[1]), mes: Number(m[2]), dia: Number(m[3]) };
  }
  if (typeof opciones.mes === 'string') {
    const m = /^(\d{4})-(\d{2})$/.exec(opciones.mes.trim());
    if (!m) throw new Error(`--mes debe ser AAAA-MM; recibí "${opciones.mes}".`);
    return { anio: Number(m[1]), mes: Number(m[2]) };
  }
  if (opciones.anio !== undefined && typeof opciones.anio !== 'boolean') {
    const n = Number(opciones.anio);
    if (!Number.isInteger(n)) throw new Error(`--anio debe ser un año; recibí "${opciones.anio}".`);
    return { anio: n };
  }
  return {};
}

/** Lanza si el período pedido no alcanza la precisión que exige la frecuencia de la serie. */
export function validarPeriodoParaSerie(serie: SerieOficial, periodo: Periodo): void {
  const requerido = nivelRequerido(serie.frecuencia);
  if (nivel(periodo) >= requerido) return;
  const flag = requerido === 1 ? '--anio AAAA' : requerido === 2 ? '--mes AAAA-MM (o --fecha AAAA-MM-DD)' : '--fecha AAAA-MM-DD';
  throw new Error(`la serie "${serie.id}" es ${serie.frecuencia}: usá ${flag}.`);
}

/** La fecha que va en `dato_real.fuentes[].fecha`: el día exacto si se pidió, si no el 1° del mes o del año. */
export function fechaDeCita(periodo: Periodo): string {
  if (periodo.dia !== undefined) return isoFecha(periodo.anio!, periodo.mes!, periodo.dia);
  if (periodo.mes !== undefined) return isoFecha(periodo.anio!, periodo.mes!, 1);
  if (periodo.anio !== undefined) return isoFecha(periodo.anio!, 1, 1);
  throw new Error('fechaDeCita: período vacío.');
}

// ----- Construcción de la URL a partir de la plantilla ({fecha} / {anio}) -----

export function construirUrl(serie: SerieOficial, periodo: Periodo): string {
  if (!serie.url) throw new Error(`la serie "${serie.id}" no tiene "url" (¿es manual?).`);
  let url = serie.url;
  if (url.includes('{fecha}')) {
    if (periodo.dia === undefined) {
      throw new Error(`la serie "${serie.id}" arma la URL con una fecha exacta: usá --fecha AAAA-MM-DD.`);
    }
    const fecha =
      serie.formato_fecha_url === 'dd/mm/aaaa'
        ? `${pad2(periodo.dia)}/${pad2(periodo.mes!)}/${periodo.anio}`
        : isoFecha(periodo.anio!, periodo.mes!, periodo.dia);
    url = url.replaceAll('{fecha}', fecha);
  }
  if (url.includes('{anio}')) {
    if (periodo.anio === undefined) throw new Error(`la serie "${serie.id}" arma la URL con un año: usá --anio AAAA.`);
    url = url.replaceAll('{anio}', String(periodo.anio));
  }
  return url;
}

// ----- Indirección de un índice CKAN (package_show) al recurso real -----

/**
 * `result.resources[]` de la respuesta de `package_show` de CKAN (catalogodatos.gub.uy): el id del
 * recurso cambia cada vez que el organismo resube el dataset, así que la única URL estable es esta
 * API de metadatos. Devuelve la `url` del primer recurso cuyo `format` coincide (sin distinguir
 * mayúsculas), o `null` si no está.
 */
export function extraerUrlDeRecurso(jsonTexto: string, formato: string): string | null {
  let datos: unknown;
  try {
    datos = JSON.parse(jsonTexto);
  } catch {
    return null;
  }
  const resultado = (datos as { result?: { resources?: unknown } } | undefined)?.result;
  const recursos = resultado?.resources;
  if (!Array.isArray(recursos)) return null;
  const objetivo = formato.toLowerCase();
  for (const r of recursos) {
    const rec = r as { format?: unknown; url?: unknown };
    if (typeof rec.format === 'string' && rec.format.toLowerCase() === objetivo && typeof rec.url === 'string') {
      return rec.url;
    }
  }
  return null;
}

// ----- División de una fila ya localizada en columnas -----

export function dividirCeldas(linea: string, separador: string, respetaComillas = false): string[] {
  if (separador === 'espacios') return linea.trim().split(/\s{2,}/);
  const sep = separador === 'tab' ? '\t' : separador;
  if (!respetaComillas) return linea.split(sep);
  const celdas: string[] = [];
  let actual = '';
  let dentro = false;
  for (let i = 0; i < linea.length; i++) {
    const c = linea[i];
    if (c === '"') {
      if (dentro && linea[i + 1] === '"') {
        actual += '"';
        i++;
      } else {
        dentro = !dentro;
      }
    } else if (c === sep && !dentro) {
      celdas.push(actual);
      actual = '';
    } else {
      actual += c;
    }
  }
  celdas.push(actual);
  return celdas;
}

// ----- Ubicación de la fila del período pedido -----

export interface FilaUbicada {
  linea: string;
  celdas: string[];
}

const MESES_ES_COMPLETO: readonly (string | readonly string[])[] = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto',
  ['setiembre', 'septiembre'], 'octubre', 'noviembre', 'diciembre',
];
const MESES_ES_ABREV: readonly (string | readonly string[])[] = [
  'ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', ['set', 'sep'], 'oct', 'nov', 'dic',
];
const MESES_EN_ABREV = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

function coincideAlguno(valor: string, candidatos: string | readonly string[]): boolean {
  const c = valor.trim().toLowerCase();
  return Array.isArray(candidatos) ? candidatos.includes(c) : candidatos === c;
}

/** Nombre del mes en español, con mayúscula inicial, tal como lo imprimen las series del INE. */
export function tituloMes(mes: number): string {
  const nombre = MESES_ES_COMPLETO[mes - 1];
  const base = Array.isArray(nombre) ? nombre[0] : nombre;
  return base.charAt(0).toUpperCase() + base.slice(1);
}

function mesCoincideNumeroONombre(celda: string, mes: number): boolean {
  const c = celda.trim().toLowerCase();
  if (c === String(mes) || c === pad2(mes)) return true;
  if (coincideAlguno(c, MESES_ES_ABREV[mes - 1])) return true;
  if (coincideAlguno(c, MESES_ES_COMPLETO[mes - 1])) return true;
  return false;
}

function celdaCoincideFechaIso(celda: string, periodo: Periodo, frecuencia: Frecuencia): boolean {
  const c = celda.trim();
  if (frecuencia === 'anual') return c.startsWith(`${periodo.anio}-`);
  if (frecuencia === 'mensual') return periodo.mes !== undefined && c.startsWith(`${periodo.anio}-${pad2(periodo.mes)}`);
  return periodo.dia !== undefined && c === isoFecha(periodo.anio!, periodo.mes!, periodo.dia);
}

function pasaFiltro(linea: string, serie: SerieOficial): boolean {
  return !serie.filtro || linea.includes(serie.filtro);
}

function ubicarPorFechaIso(lineas: string[], serie: SerieOficial, periodo: Periodo): FilaUbicada | null {
  const colPeriodo = serie.columna_periodo ?? 0;
  const separador = serie.separador ?? 'tab';
  for (const linea of lineas) {
    if (!pasaFiltro(linea, serie)) continue;
    const celdas = dividirCeldas(linea, separador, serie.separador_respeta_comillas);
    const celda = celdas[colPeriodo];
    if (celda !== undefined && celdaCoincideFechaIso(celda, periodo, serie.frecuencia)) return { linea, celdas };
  }
  return null;
}

function ubicarPorAnioMesColumnas(lineas: string[], serie: SerieOficial, periodo: Periodo): FilaUbicada | null {
  if (periodo.mes === undefined) throw new Error(`la serie "${serie.id}" necesita --mes AAAA-MM.`);
  const separador = serie.separador ?? ';';
  for (const linea of lineas) {
    if (!pasaFiltro(linea, serie)) continue;
    const celdas = dividirCeldas(linea, separador, serie.separador_respeta_comillas);
    if ((celdas[0] ?? '').trim() === String(periodo.anio) && mesCoincideNumeroONombre(celdas[1] ?? '', periodo.mes)) {
      return { linea, celdas };
    }
  }
  return null;
}

/** Formato "año en su propia fila, después una fila por mes" (series históricas del INE/ECH). */
function ubicarEnBloqueAnio(lineas: string[], serie: SerieOficial, periodo: Periodo): FilaUbicada | null {
  if (periodo.mes === undefined) throw new Error(`la serie "${serie.id}" necesita --mes AAAA-MM.`);
  const separador = serie.separador ?? 'tab';
  const objetivo = tituloMes(periodo.mes);
  const objetivoAlt = periodo.mes === 9 ? 'Septiembre' : null;
  let anioActual: string | null = null;
  for (const linea of lineas) {
    const celdas = dividirCeldas(linea, separador, false);
    const primera = (celdas[0] ?? '').trim();
    if (/^\d{4}$/.test(primera)) {
      anioActual = primera;
      continue;
    }
    if (anioActual !== String(periodo.anio)) continue;
    // Quita la nota al pie final, tipo "Enero (2)"; un rango ("Enero - Marzo/06") no debe matchear.
    const sinNota = primera.replace(/\s*\([^)]*\)\s*$/, '').trim();
    if (sinNota === objetivo || (objetivoAlt && sinNota === objetivoAlt)) {
      if (!pasaFiltro(linea, serie)) continue;
      return { linea, celdas };
    }
  }
  return null;
}

function ubicarPorMesAbrevEnAnio2(lineas: string[], serie: SerieOficial, periodo: Periodo): FilaUbicada | null {
  if (periodo.mes === undefined) throw new Error(`la serie "${serie.id}" necesita --mes AAAA-MM.`);
  const separador = serie.separador ?? 'tab';
  const yy = pad2(periodo.anio! % 100);
  const abrev = MESES_EN_ABREV[periodo.mes - 1];
  const objetivo = `${abrev.charAt(0).toUpperCase()}${abrev.slice(1)}-${yy}`;
  for (const linea of lineas) {
    const celdas = dividirCeldas(linea, separador, false);
    if ((celdas[0] ?? '').trim() !== objetivo) continue;
    if (!pasaFiltro(linea, serie)) continue;
    return { linea, celdas };
  }
  return null;
}

function ubicarSoloPorFiltro(lineas: string[], serie: SerieOficial): FilaUbicada | null {
  if (!serie.filtro) throw new Error(`la serie "${serie.id}" no tiene "filtro" y su formato_periodo es "ninguno".`);
  const separador = serie.separador ?? 'tab';
  for (const linea of lineas) {
    if (!linea.includes(serie.filtro)) continue;
    return { linea, celdas: dividirCeldas(linea, separador, false) };
  }
  return null;
}

/** Punto de entrada de la ubicación de fila: despacha según `serie.formato_periodo`. Función pura. */
export function ubicarFila(texto: string, serie: SerieOficial, periodo: Periodo): FilaUbicada | null {
  const lineas = texto.split(/\r?\n/);
  switch (serie.formato_periodo) {
    case 'fecha_iso':
      return ubicarPorFechaIso(lineas, serie, periodo);
    case 'anio_mes_columnas':
      return ubicarPorAnioMesColumnas(lineas, serie, periodo);
    case 'anio_bloque_mes':
      return ubicarEnBloqueAnio(lineas, serie, periodo);
    case 'mes_abrev_en_anio2':
      return ubicarPorMesAbrevEnAnio2(lineas, serie, periodo);
    case 'ninguno':
    default:
      return ubicarSoloPorFiltro(lineas, serie);
  }
}

/**
 * Cuando no se encontró el período pedido: junta los períodos que sí aparecen (según el mismo
 * `formato_periodo`) y devuelve el primero y el último, para poder decir "no está, pero el
 * documento cubre de X a Y" en vez de un genérico "no encontrado".
 */
export function extremosDisponibles(texto: string, serie: SerieOficial): { primero: string; ultimo: string } | null {
  const lineas = texto.split(/\r?\n/);
  const separador = serie.separador ?? (serie.formato_periodo === 'anio_mes_columnas' ? ';' : 'tab');
  const vistos: string[] = [];
  if (serie.formato_periodo === 'fecha_iso') {
    const col = serie.columna_periodo ?? 0;
    for (const linea of lineas) {
      if (!pasaFiltro(linea, serie)) continue;
      const celda = dividirCeldas(linea, separador, serie.separador_respeta_comillas)[col];
      if (celda && /^\d{4}-\d{2}(-\d{2})?/.test(celda.trim())) vistos.push(celda.trim());
    }
  } else if (serie.formato_periodo === 'anio_mes_columnas') {
    for (const linea of lineas) {
      if (!pasaFiltro(linea, serie)) continue;
      const celdas = dividirCeldas(linea, separador, serie.separador_respeta_comillas);
      if (/^\d{4}$/.test((celdas[0] ?? '').trim()) && (celdas[1] ?? '').trim() !== '') {
        vistos.push(`${celdas[0].trim()}-${celdas[1].trim()}`);
      }
    }
  } else if (serie.formato_periodo === 'anio_bloque_mes') {
    for (const linea of lineas) {
      const primera = (dividirCeldas(linea, separador, false)[0] ?? '').trim();
      if (/^\d{4}$/.test(primera)) vistos.push(primera);
    }
  } else if (serie.formato_periodo === 'mes_abrev_en_anio2') {
    for (const linea of lineas) {
      const primera = (dividirCeldas(linea, separador, false)[0] ?? '').trim();
      if (/^[A-Za-z]{3}-\d{2}$/.test(primera)) vistos.push(primera);
    }
  }
  if (vistos.length === 0) return null;
  return { primero: vistos[0], ultimo: vistos[vistos.length - 1] };
}

// ----- Medio (slug de content/medios/) -----

export interface InfoMedio {
  slug: string;
  tieneFicha: boolean;
}

export function medioDeUrl(urlFinal: string, override?: string): InfoMedio {
  const slug = override ?? slugDeMedio(urlFinal);
  return { slug, tieneFicha: existsSync(join(RUTAS_CONTENIDO.medios, `${slug}.yaml`)) };
}

// ----- Bloque YAML para dato_real.fuentes[] -----

export interface FuenteDatoReal {
  url: string;
  medio: string;
  fecha: string;
  tipo: 'documento_oficial';
  titulo: string;
  cita: string;
  retrieved_at: string;
}

/** El bloque listo para pegar bajo `dato_real.fuentes:` (una lista de un elemento). Función pura. */
export function armarBloqueDatoReal(f: FuenteDatoReal): string {
  return stringifyYaml([
    { url: f.url, medio: f.medio, fecha: f.fecha, tipo: f.tipo, titulo: f.titulo, cita: f.cita, retrieved_at: f.retrieved_at },
  ]);
}

// ----- CLI -----

const USO =
  'Uso: pnpm dato <serie> [--anio AAAA] [--mes AAAA-MM] [--fecha AAAA-MM-DD] [--json]\n' +
  '   o: pnpm dato --lista\n\n' +
  '  --anio/--mes/--fecha  el período pedido; cuál hace falta depende de la frecuencia de la serie\n' +
  '                        (anual -> --anio; mensual -> --mes o --fecha; diaria/semanal -> --fecha).\n' +
  '  --json                imprime un solo objeto JSON en vez de texto.\n' +
  '  --lista               enumera las series de docs/fuentes-oficiales/series.yaml, una por línea.\n';

function formatearSalida(datos: {
  serie: SerieOficial;
  valor: string;
  periodo: Periodo;
  cita: string;
  url: string;
  medio: InfoMedio;
  bloque: string;
}): string {
  const { serie, valor, periodo, cita, url, medio, bloque } = datos;
  const periodoTexto = periodo.dia !== undefined ? isoFecha(periodo.anio!, periodo.mes!, periodo.dia) : periodo.mes !== undefined ? `${periodo.anio}-${pad2(periodo.mes)}` : String(periodo.anio);
  const lineas = [
    `${serie.nombre}`,
    `valor    ${valor} ${serie.unidad}  (${periodoTexto})`,
    `cita     ${cita}`,
    `url      ${url}`,
    `medio    ${medio.slug}${medio.tieneFicha ? '' : '  (sin ficha en content/medios/: revisar antes de usarlo en un chequeo)'}`,
    '',
    'Para dato_real.fuentes[]:',
    bloque.trimEnd(),
  ];
  return lineas.join('\n');
}

async function ejecutar(argv: string[]): Promise<number> {
  const { posicionales, opciones } = parsearArgs(argv);
  const json = opciones.json === true;

  let series: SerieOficial[];
  try {
    series = cargarSeries();
  } catch (e) {
    log.error((e as Error).message);
    return 1;
  }

  if (opciones.lista === true) {
    process.stdout.write(listarSeries(series) + '\n');
    return 0;
  }

  const id = posicionales[0];
  if (!id) {
    process.stderr.write(USO);
    return 2;
  }
  const serie = series.find((s) => s.id === id);
  if (!serie) {
    log.error(`no existe la serie "${id}". Series disponibles:\n${listarSeries(series)}`);
    return 1;
  }

  if (serie.manual) {
    const bloque = [`${serie.nombre} (${serie.organismo}) no tiene URL automatizable.`, '', 'Cómo buscarla a mano:', serie.como_buscar ?? ''].join('\n');
    if (json) {
      process.stdout.write(JSON.stringify({ id: serie.id, manual: true, organismo: serie.organismo, nombre: serie.nombre, como_buscar: serie.como_buscar }, null, 1) + '\n');
    } else {
      process.stdout.write(bloque + '\n');
    }
    return 0;
  }

  let periodo: Periodo;
  try {
    periodo = parsearPeriodo(opciones);
    validarPeriodoParaSerie(serie, periodo);
  } catch (e) {
    log.error((e as Error).message);
    return 1;
  }

  let urlPedida: string;
  try {
    urlPedida = construirUrl(serie, periodo);
  } catch (e) {
    log.error((e as Error).message);
    return 1;
  }

  let urlFinal = urlPedida;
  try {
    if (serie.sigue_recurso_formato) {
      // `forzar: true`: el id del recurso real cambia cada vez que el organismo resube el
      // dataset (comprobado con catalogodatos-ancap-combustibles), así que este índice no puede
      // servirse desde una copia vieja del corpus o `pnpm dato` seguiría apuntando al recurso de
      // la primera vez que se leyó. El recurso final (con id en la URL) sí se sirve del corpus.
      const indice = await obtenerNota(urlPedida, { forzar: true });
      const urlReal = extraerUrlDeRecurso(indice.nota.texto, serie.sigue_recurso_formato);
      if (!urlReal) {
        log.error(`el índice de "${serie.id}" (${urlPedida}) no trae un recurso de formato "${serie.sigue_recurso_formato}".`);
        return 1;
      }
      urlFinal = urlReal;
    }
  } catch (e) {
    log.error(`no se pudo leer el índice de "${serie.id}": ${(e as Error).message}`);
    return 1;
  }

  let resultado;
  try {
    resultado = await obtenerNota(urlFinal);
  } catch (e) {
    log.error(`no se pudo obtener ${urlFinal}: ${(e as Error).message}`);
    return 1;
  }

  const ubicacion = ubicarFila(resultado.nota.texto, serie, periodo);
  if (!ubicacion) {
    const rango = extremosDisponibles(resultado.nota.texto, serie);
    log.error(`no encontré el período pedido en ${urlFinal}.` + (rango ? ` El documento cubre de ${rango.primero} a ${rango.ultimo}: probá con un período dentro de ese rango.` : ' No pude ubicar qué períodos trae el documento; revisalo a mano.'));
    return 1;
  }

  const valor = (ubicacion.celdas[serie.columna ?? 0] ?? '').trim() || '(columna vacía)';
  const medio = medioDeUrl(resultado.nota.url_canonica, serie.medio);
  const fecha = fechaDeCita(periodo);
  const bloque = armarBloqueDatoReal({
    url: resultado.nota.url_canonica,
    medio: medio.slug,
    fecha,
    tipo: 'documento_oficial',
    titulo: serie.nombre,
    cita: ubicacion.linea.trim(),
    retrieved_at: new Date().toISOString().slice(0, 10),
  });

  if (json) {
    process.stdout.write(
      JSON.stringify(
        { id: serie.id, valor, unidad: serie.unidad, periodo: fecha, cita: ubicacion.linea.trim(), url: resultado.nota.url_canonica, medio: medio.slug, medio_tiene_ficha: medio.tieneFicha, dato_real_fuente: bloque },
        null,
        1,
      ) + '\n',
    );
    return 0;
  }

  process.stdout.write(formatearSalida({ serie, valor, periodo, cita: ubicacion.linea.trim(), url: resultado.nota.url_canonica, medio, bloque }) + '\n');
  return 0;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  ejecutar(process.argv.slice(2)).then((codigo) => process.exit(codigo));
}
