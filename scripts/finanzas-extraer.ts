#!/usr/bin/env tsx
/**
 * `pnpm finanzas:extraer <empresa-slug> [--desde YYYY] [--hasta YYYY] [--anio YYYY] [--sin-modelo]
 *                        [--fecha YYYY-MM-DD]`
 *
 * Plan 2026-09, fase 3, ítem 3.1. Lo que arregla: los investigadores de "serie histórica" hicieron
 * más de 40 llamadas seguidas a `pnpm fuente` por empresa, copiando a mano cifras de balances año
 * por año con un modelo caro por turno (ver `inbox/empresas/ancap/2026-09-08-serie-historica/`,
 * hecho con un `investigador` de verdad). Eso es extracción de tablas, no investigación: un script con
 * heurísticas por expresión regular hace el trabajo mecánico, y solo pide a Haiku el renglón que la
 * heurística no puede resolver sola (una tabla irregular, un renglón partido en dos notas).
 *
 * Continúa la serie de una empresa que **ya tiene ficha** en `content/empresas/<slug>.yaml`: no
 * crea una ficha nueva (eso sigue siendo trabajo de un investigador, con `que_hace`, `monopolio`,
 * `hitos`...). Por eso la salida es un delta chico: `_slug`, `_investigacion` (procedencia de
 * script, `docs/plan-2026-09.md` "Decisiones del mantenedor" 1 y CLAUDE.md "Procedencia
 * obligatoria") y `finanzas[]` con los años que esta corrida pudo extraer.
 *
 * Pipeline (docs/colecciones/empresas.md, docs/diccionario-empresas.md):
 *   1. `content/medios/*.yaml` con `empresa: <slug>` da los dominios de la propia empresa; si el
 *      nombre sugiere banco o aseguradora, se agrega `www.bcu.gub.uy` (el regulador publica los
 *      estados contables de bancos y aseguradoras desde 2005). `pnpm inventario <dominio> --filtro
 *      "estados financieros|estados contables|balance|memoria"` (subproceso: `inventario.ts` corre
 *      su propio `main()` al importarse, así que no se importa, se invoca como el resto de los
 *      agentes) lista los PDF; el listado combinado es el insumo `_inventario.jsonl`.
 *   2. Por año objetivo se elige el mejor documento (más completo, más reciente, "en_sitio_hoy")
 *      con `obtenerNota` de `scripts/corpus/fuente.ts` (importado: ya decide corpus vs. descarga,
 *      OCR y `slugDeMedio`). Un año sin balance propio se resuelve con la columna comparativa del
 *      balance siguiente (diccionario, regla 4). Un escaneo sin capa de texto o sin OCR disponible
 *      en esta máquina se anota "OCR pendiente" y no bloquea el resto de los años: la corrida se
 *      puede volver a lanzar más tarde.
 *   3. Sobre el texto tal como lo devuelve `pnpm fuente` (`nota.texto` completo, no el recorte de
 *      6000 caracteres de la CLI) se ubican los renglones del diccionario con expresiones
 *      regulares por sinónimo y columna de año (`ubicarRenglones`, `ubicarCotizacion`, funciones
 *      puras y probadas). Cada cifra lleva como `cita` la línea (o el tramo de líneas) exacto y
 *      contiguo de donde salió, para que `validar --red` la coteje.
 *   4. Lo que la heurística no encuentra o encuentra más de una vez (una tabla que separa "deudas
 *      corrientes" de "no corrientes" en dos notas, un renglón partido de forma rara) se manda a
 *      Haiku por documento, con el mismo mecanismo que `etiquetarConHaiku` /
 *      `ejecutarEtiquetadoConClaude` de `scripts/corpus/etiquetar.ts` (`claude -p --model haiku
 *      --append-system-prompt`, sin API keys): un JSON con esquema fijo, celda por celda. La cita
 *      que devuelve se verifica literal contra el texto; si no aparece, se descarta. Cada celda que
 *      salió de ahí queda marcada `_modelo: <id>` (campo `_`, lo saca `quitarCamposGuion` antes de
 *      cualquier validación) y `_investigacion.modelo` se completa una sola vez para toda la corrida.
 *   5. `usd = pesos / cotización` se deriva siempre acá (nunca se toma un usd suelto de Haiku), así
 *      que cierra por construcción; `cierraUsd` y `cierraSumaSegmentos` son las funciones de
 *      chequeo, probadas por separado, listas para el día que haya un total contra el que cotejar
 *      una suma de segmentos. Lo que no cierra no entra al YAML y se anota en `notas.md`.
 *   6. Huecos declarados, nunca omitidos: `notas.md` lleva `## anios_sin_dato` (año, campo, motivo:
 *      sin documento, sin renglón, OCR pendiente, no cierra) y `## cobertura_del_periodo`.
 *
 * Nota sobre el esquema: la ficha de una empresa exige `nombre`, `tipo`, `que_hace` y
 * `que_hace_fuentes` (sin default), y este script no los repite porque ya están publicados. Para
 * que `pnpm validar --inbox` pueda validar el delta solo, `scripts/lib/inbox.ts` los toma prestados
 * de `content/empresas/<slug>.yaml` **solo para validar** (mismo mecanismo que ya usa para
 * `revision`/`procedencia`); `pnpm promover` sigue exigiéndolos tal cual, así que este delta no se
 * promueve solo — el volcado a la ficha publicada lo sigue haciendo el editor a mano.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';
import { RAIZ, CACHE_DIR, RUTAS_CONTENIDO } from './lib/rutas.ts';
import { hoyISO } from './lib/contenido.ts';
import { log, parsearArgs } from './lib/log.ts';
import { hostDe } from './lib/url.ts';
import { buscarClaude, buscarEjecutable, ejecutarSync } from './lib/ejecutable.ts';
import { obtenerNota, slugDeMedio } from './corpus/fuente.ts';

// ---------------------------------------------------------------------------
// Números y texto (funciones puras)
// ---------------------------------------------------------------------------

/**
 * Convierte un token con la convención uruguaya (punto = separador de miles, coma = decimal,
 * paréntesis o "-" al frente = negativo) a un `number` de JavaScript.
 */
export function parsearNumeroUY(token: string): number {
  let t = token.trim();
  let negativo = false;
  if (t.startsWith('(') && t.endsWith(')')) {
    negativo = true;
    t = t.slice(1, -1).trim();
  }
  if (t.startsWith('-')) {
    negativo = true;
    t = t.slice(1).trim();
  }
  t = t.replace(/\./g, '').replace(',', '.');
  const n = Number(t);
  if (!Number.isFinite(n)) throw new Error(`no es un número válido: "${token}"`);
  return negativo ? -n : n;
}

export interface LineaInfo {
  texto: string;
  inicio: number;
  fin: number;
}

/** Divide `texto` en líneas conservando el carácter donde empieza y termina cada una. */
export function indexarLineas(texto: string): LineaInfo[] {
  const lineas: LineaInfo[] = [];
  let pos = 0;
  for (const l of texto.split('\n')) {
    lineas.push({ texto: l, inicio: pos, fin: pos + l.length });
    pos += l.length + 1;
  }
  return lineas;
}

// Monto: números de al menos 4 cifras (un separador de miles), para no confundir un pesos con un
// número de nota ("10a", "13.3", "3-12"). Cotización: decimal chico con coma, como lo declara el
// balance ("21,424", "29,34").
const NUM_MONTO = /\(?-?\d{1,3}(?:\.\d{3})+\)?/;
const NUM_COTIZACION = /\d{1,3},\d{2,4}/;

function global(re: RegExp): RegExp {
  return new RegExp(re.source, 'g');
}

/**
 * Cuántas líneas desde la que trae la etiqueta se admiten antes de rendirse. 6 porque la nota real
 * de "Aportes de Gobierno Central" del balance 2016 de Correo pone el monto recién en la quinta
 * línea después del título de la nota (una oración de trámite legal en el medio): con una ventana
 * de 4 esa nota nunca se encuentra.
 */
const VENTANA_MAX_LINEAS = 6;

export interface CandidatoRenglon {
  /** Substring literal y contiguo de `texto` (label + tramo hasta el número), para citar. */
  cita: string;
  /** Valores en el orden en que aparecen: columna del año propio primero, comparativa después. */
  valores: number[];
  /** true si el candidato es una afirmación explícita de "no hubo" (transferencias, subsidios). */
  ceroExplicito?: boolean;
  inicio: number;
  fin: number;
}

/**
 * Busca, avanzando línea por línea, ventanas donde `etiquetaRegex` matchea el texto acumulado
 * (label que puede partirse en dos líneas por el ancho de columna del PDF) y que terminan en la
 * primera línea de esa ventana con un número (`numeroRegex`) o con una frase de cero explícito
 * (`ceroRegex`). Extiende un renglón más si la línea siguiente es una en blanco seguida de una
 * línea que es *solo* un número: `pdf-parse` a veces empuja la columna comparativa a su propia
 * línea, separada del resto de la fila por una línea vacía (visto en los balances de Correo).
 */
function buscarCandidatos(texto: string, lineas: LineaInfo[], etiquetaRegex: RegExp, numeroRegex: RegExp, ceroRegex?: RegExp): CandidatoRenglon[] {
  const candidatos: CandidatoRenglon[] = [];
  let i = 0;
  while (i < lineas.length) {
    if (!lineas[i].texto.trim()) {
      i++;
      continue;
    }
    let acumulado = '';
    let finIdx = -1;
    let esCero = false;
    // La etiqueta tiene que empezar casi al principio de la ventana (la propia línea `i`, con un
    // margen chico por un número de nota delante, "13.3 Aportes..."), NUNCA en una línea que la
    // ventana sumó después. Sin este tope, `etiquetaRegex.test(acumulado)` da `true` en cuanto la
    // ventana crece lo bastante para alcanzar OTRA aparición de la frase más adelante en el
    // documento, y arma una cita que arranca en una línea sin ninguna relación (visto de verdad:
    // una ventana que empezaba en "Impuesto a la renta" terminó citando el "Resultado del
    // ejercicio" de dos renglones más abajo). El margen es una constante chica, no proporcional al
    // largo de la línea `i`: si fuera "largo de la línea i + margen", una línea `i` larga sin
    // relación (por ejemplo la propia "Impuesto a la renta … (106.200)") deja pasar igual una
    // coincidencia que en realidad arrancó en la línea siguiente.
    const ANCLA_MAX = 24;
    for (let k = i; k < Math.min(i + VENTANA_MAX_LINEAS, lineas.length); k++) {
      const t = lineas[k].texto.trim();
      if (t) acumulado += (acumulado ? ' ' : '') + t;
      const coincidencia = etiquetaRegex.exec(acumulado);
      if (!coincidencia || coincidencia.index > ANCLA_MAX) continue;
      if (ceroRegex && ceroRegex.test(acumulado)) {
        finIdx = k;
        esCero = true;
        break;
      }
      if (numeroRegex.test(lineas[k].texto)) {
        finIdx = k;
        break;
      }
    }
    if (finIdx < 0) {
      i++;
      continue;
    }
    if (!esCero) {
      // Columna comparativa empujada a su propia línea por una línea en blanco.
      for (let k = finIdx + 1; k < Math.min(finIdx + 3, lineas.length); k++) {
        const t = lineas[k].texto.trim();
        if (t === '') continue;
        if (new RegExp(`^${NUM_MONTO.source}$`).test(t) || new RegExp(`^${NUM_COTIZACION.source}$`).test(t)) finIdx = k;
        break;
      }
    }
    const cita = texto.slice(lineas[i].inicio, lineas[finIdx].fin);
    if (esCero) {
      candidatos.push({ cita, valores: [0], ceroExplicito: true, inicio: lineas[i].inicio, fin: lineas[finIdx].fin });
    } else {
      const valores: number[] = [];
      const re = global(numeroRegex);
      let m: RegExpExecArray | null;
      while ((m = re.exec(cita))) valores.push(parsearNumeroUY(m[0]));
      if (valores.length) candidatos.push({ cita, valores, inicio: lineas[i].inicio, fin: lineas[finIdx].fin });
    }
    i = finIdx + 1;
  }
  return candidatos;
}

/** Descarta candidatos cuyo rango de caracteres se solapa con uno ya aceptado (mismo hallazgo, dos sinónimos). */
function deduplicarPorSolape<T extends { inicio: number; fin: number }>(candidatos: T[]): T[] {
  const ordenados = [...candidatos].sort((a, b) => a.inicio - b.inicio);
  const salida: T[] = [];
  for (const c of ordenados) {
    const ultimo = salida[salida.length - 1];
    if (ultimo && c.inicio < ultimo.fin) continue;
    salida.push(c);
  }
  return salida;
}

export const CLAVES_MONTO = ['resultado_ejercicio', 'impuestos_pagados', 'transferencias_al_estado', 'capitalizaciones_del_estado', 'deuda_financiera'] as const;
export type ClaveMonto = (typeof CLAVES_MONTO)[number];

/**
 * Sinónimos por renglón, según `docs/diccionario-empresas.md`. `impuestos_pagados` busca solo el
 * **total** de tributos (nunca un impuesto suelto): cargar el IRAE mínimo como si fuera el total
 * fue justo el error de la primera tanda que el diccionario existe para evitar, así que cuando no
 * hay total la heurística declara "sin renglón" en vez de adivinar.
 */
const SINONIMOS: Record<ClaveMonto, RegExp[]> = {
  // "(?!\s+antes)": el estado de resultados de Correo trae, en el mismo cuadro, "Resultado del
  // ejercicio antes del impuesto a la renta" (subtotal previo) y "Resultado del ejercicio" (el
  // renglón final, después de impuestos, que es el que pide docs/diccionario-empresas.md). Sin la
  // exclusión, el primero se toma como si fuera el segundo.
  resultado_ejercicio: [/resultado\s+(del|integral\s+del)\s+ejercicio(?!\s+antes)/i],
  impuestos_pagados: [/total\s+(de\s+)?(los\s+)?(impuestos|tributos)\b/i, /^literal\s+e\b/i, /impuestos\s+y\s+tasas.{0,20}total/i],
  transferencias_al_estado: [/transferencias?\s+a\s+rentas\s+generales/i, /versi[oó]n\s+de\s+resultados/i, /vers[oó]\s+a\s+rentas\s+generales/i],
  capitalizaciones_del_estado: [/aportes?\s+(de\s+)?gobierno\s+central/i, /subsidios?\s+recibidos?\s+de\s+rentas\s+generales/i, /aporte\s+de\s+rentas\s+generales/i, /capitalizaci[oó]n(es)?\s+del\s+estado/i],
  deuda_financiera: [/deudas?\s+financieras?\b/i, /pasivos?\s+financieros?\b/i],
};

/** Frases de "no hubo", que valen como el valor 0 con cita en vez de un número. */
const CERO_EXPLICITO: Partial<Record<ClaveMonto, RegExp>> = {
  transferencias_al_estado: /no\s+(se\s+hicieron|existen|hubo)\b.*(transferencias|subsidios\s+cruzados)/i,
  capitalizaciones_del_estado: /no\s+(recibi[oó]|hubo|existieron)\b.*(subsidios?|aportes?|capitalizaci)/i,
};

/** Ubica, para cada renglón del diccionario, los candidatos que aparecen en `texto` (0, 1 o más). */
export function ubicarRenglones(texto: string): Record<ClaveMonto, CandidatoRenglon[]> {
  const lineas = indexarLineas(texto);
  const salida = {} as Record<ClaveMonto, CandidatoRenglon[]>;
  for (const clave of CLAVES_MONTO) {
    let candidatos: CandidatoRenglon[] = [];
    for (const etiqueta of SINONIMOS[clave]) candidatos = candidatos.concat(buscarCandidatos(texto, lineas, etiqueta, NUM_MONTO, CERO_EXPLICITO[clave]));
    salida[clave] = deduplicarPorSolape(candidatos);
  }
  return salida;
}

const ETIQUETAS_COTIZACION = [/d[oó]lar\s+estadounidense/i, /tipo\s+de\s+cambio\s+de\s+cierre/i, /interbancario\s+comprador/i, /us\$?\s*eeuu/i];

/** Ubica la(s) nota(s) de cotización de cierre (pesos por dólar) del documento. */
export function ubicarCotizacion(texto: string): CandidatoRenglon[] {
  const lineas = indexarLineas(texto);
  let candidatos: CandidatoRenglon[] = [];
  for (const etiqueta of ETIQUETAS_COTIZACION) candidatos = candidatos.concat(buscarCandidatos(texto, lineas, etiqueta, NUM_COTIZACION));
  return deduplicarPorSolape(candidatos);
}

/** Unidad en la que el propio documento declara sus cifras ("expresado en miles de pesos", etc.). */
export function detectarUnidadDocumento(texto: string): 'unidades' | 'miles' | 'millones' {
  const cabeza = texto.slice(0, 6000);
  if (/(cifras?|montos?|valores?).{0,25}expresad[ao]s?.{0,10}en\s+millones|expresad[ao]s?\s+en\s+millones/i.test(cabeza)) return 'millones';
  if (/(cifras?|montos?|valores?).{0,25}expresad[ao]s?.{0,10}en\s+miles|expresad[ao]s?\s+en\s+miles|en\s+miles\s+de\s+pesos/i.test(cabeza)) return 'miles';
  return 'unidades';
}

/** Pasa un valor crudo (tal como lo declara el documento) a millones, redondeado a un decimal. */
export function convertirAMillones(valorCrudo: number, unidadDocumento: 'unidades' | 'miles' | 'millones'): number {
  const divisor = unidadDocumento === 'unidades' ? 1_000_000 : unidadDocumento === 'miles' ? 1_000 : 1;
  return Math.round((valorCrudo / divisor) * 10) / 10;
}

// ---------------------------------------------------------------------------
// Chequeos aritméticos (funciones puras)
// ---------------------------------------------------------------------------

/** `usd = pesos / cotización`, con tolerancia relativa (0,5 % por defecto). */
export function cierraUsd(pesosMillones: number, cotizacion: number, usd: number, tolerancia = 0.005): boolean {
  if (!Number.isFinite(pesosMillones) || !Number.isFinite(cotizacion) || !Number.isFinite(usd) || cotizacion === 0) return false;
  const esperado = pesosMillones / cotizacion;
  const desvio = Math.abs(esperado - usd) / Math.max(Math.abs(usd), 1e-9);
  return desvio <= tolerancia;
}

/** Suma de segmentos contra el total, con tolerancia relativa (2 % por defecto). */
export function cierraSumaSegmentos(segmentos: number[], total: number, tolerancia = 0.02): boolean {
  if (!Number.isFinite(total)) return false;
  const suma = segmentos.reduce((a, b) => a + b, 0);
  const desvio = Math.abs(suma - total) / Math.max(Math.abs(total), 1e-9);
  return desvio <= tolerancia;
}

// ---------------------------------------------------------------------------
// Año del documento a partir del nombre de archivo
// ---------------------------------------------------------------------------

/**
 * Año del ejercicio a partir del nombre del PDF, no de la URL entera. `inventario.ts` toma el
 * primer `(19|20)\d{2}` de toda la URL, y en `correo.com.uy` eso agarra el id de carpeta del CMS
 * ("documents/20182/109433/EstadosContables2009_compilado.pdf" quedaba fechado 2018 en vez de
 * 2009). Acá se aísla primero el segmento que termina en ".pdf" (algunos sitios, como este,
 * agregan un UUID como último tramo de la ruta, después del nombre con extensión) y se buscan
 * patrones típicos de estos nombres antes de caer al primer año suelto.
 */
export function inferirAnioDeArchivo(url: string): number | null {
  let ruta: string;
  try {
    ruta = decodeURIComponent(new URL(url).pathname);
  } catch {
    ruta = decodeURIComponent(url);
  }
  const segmentos = ruta.split('/');
  const nombre = segmentos.find((s) => /\.pdf$/i.test(s)) ?? segmentos[segmentos.length - 1] ?? '';
  const patrones: RegExp[] = [
    /contables?[-_+]?(\d{4})\b/i,
    /financieros?[-_+]?(\d{4})\b/i,
    /(\d{4})[-_]?compilado/i,
    /al[-_+]?31[-_+]?12[-_+]?(\d{2,4})\b/i,
    /(?:^|[^0-9])((?:19|20)\d{2})(?:[^0-9]|$)/,
  ];
  for (const p of patrones) {
    const m = p.exec(nombre);
    if (!m) continue;
    let n = Number(m[1]);
    if (m[1].length === 2) n += n <= 50 ? 2000 : 1900;
    if (n >= 1990 && n <= 2035) return n;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Inventario: selección del mejor documento por año
// ---------------------------------------------------------------------------

export interface EntradaInventario {
  url: string;
  url_archivada?: string;
  captura?: string;
  anio_probable?: number;
  bytes?: number;
  en_sitio_hoy?: boolean;
  dominio?: string;
}

/** Año corregido de una entrada: primero el nombre del archivo, si no se pudo, el de `inventario.ts`. */
export function anioCorregido(e: EntradaInventario): number | null {
  return inferirAnioDeArchivo(e.url) ?? e.anio_probable ?? null;
}

function puntajeCandidato(e: EntradaInventario): number {
  let p = 0;
  if (/compilado|financiero/i.test(e.url)) p += 100;
  p += Math.min(50, Math.floor((e.bytes ?? 0) / 20_000));
  if (e.en_sitio_hoy) p += 10;
  return p;
}

export interface DocumentoElegido {
  doc: EntradaInventario;
  /** true si se usa la columna comparativa del balance del año siguiente (sin balance propio). */
  comparativo: boolean;
}

/**
 * El mejor documento para `anio`: primero entre los que son del propio año (más completo, más
 * grande, publicado hoy); si no hay ninguno, entre los del año siguiente (columna comparativa,
 * diccionario regla 4). `null` si no hay nada en ninguno de los dos años.
 */
export function elegirDocumentoDelAnio(inventario: EntradaInventario[], anio: number): DocumentoElegido | null {
  const ordenar = (lista: EntradaInventario[]) => [...lista].sort((a, b) => puntajeCandidato(b) - puntajeCandidato(a) || String(b.captura ?? '').localeCompare(String(a.captura ?? '')));
  const propios = ordenar(inventario.filter((e) => anioCorregido(e) === anio));
  if (propios.length) return { doc: propios[0], comparativo: false };
  const siguientes = ordenar(inventario.filter((e) => anioCorregido(e) === anio + 1));
  if (siguientes.length) return { doc: siguientes[0], comparativo: true };
  return null;
}

// ---------------------------------------------------------------------------
// Haiku por documento (mismo mecanismo que scripts/corpus/etiquetar.ts)
// ---------------------------------------------------------------------------

export interface CeldaHaiku {
  renglon: string;
  valor: number;
  unidad: 'unidades' | 'miles' | 'millones';
  cita: string;
}

export interface RespuestaHaikuFinanzas {
  celdas: CeldaHaiku[];
}

/** Extrae el primer objeto JSON `{"celdas": [...]}` de una respuesta que puede traer texto o ```json alrededor. */
export function extraerJsonHaiku(texto: string): RespuestaHaikuFinanzas | null {
  const limpio = texto.replace(/```(?:json)?/gi, '').trim();
  const ini = limpio.indexOf('{');
  const fin = limpio.lastIndexOf('}');
  if (ini < 0 || fin <= ini) return null;
  try {
    const obj = JSON.parse(limpio.slice(ini, fin + 1)) as { celdas?: unknown };
    if (!obj || !Array.isArray(obj.celdas)) return null;
    return { celdas: obj.celdas as CeldaHaiku[] };
  } catch {
    return null;
  }
}

/** La cita que devuelve el modelo tiene que aparecer literal y contigua en el texto que se le dio. */
export function celdaLiteralEnTexto(texto: string, cita: unknown): cita is string {
  return typeof cita === 'string' && cita.trim().length >= 10 && texto.includes(cita);
}

const INSTRUCCIONES_HAIKU_FINANZAS = `Sos un extractor de datos de estados contables de empresas públicas uruguayas para La Casta.
Recibís el texto de un balance y una lista de renglones a buscar. Para cada uno que encuentres,
devolvé el valor tal como figura impreso (sin convertir de unidad), la unidad en que está expresado
el documento entero (unidades, miles o millones de pesos) y la línea EXACTA y LITERAL del texto de
donde sacaste el número (copiada carácter por carácter, nunca resumida ni retipeada).
Si un renglón no aparece, no lo incluyas. Nunca inventes un número.
Devolvé SOLO un objeto JSON, sin texto alrededor ni bloques de código, con esta forma exacta:
{"celdas": [{"renglon": "resultado_ejercicio", "valor": 123456, "unidad": "unidades", "cita": "línea literal"}]}`;

/** Construye el prompt (función pura, sin red) que se le manda a Haiku para un documento y un año. */
export function construirPromptFinanzas(texto: string, anio: number, campos: string[]): string {
  const TOPE = 20_000;
  const recortado = texto.length > TOPE ? texto.slice(0, TOPE) + '\n[… texto recortado …]' : texto;
  return [
    `Balance de una empresa pública uruguaya, ejercicio ${anio}.`,
    `Buscá estos renglones: ${campos.join(', ')}.`,
    '---',
    recortado,
    '---',
    'Responde SOLO con el objeto JSON pedido.',
  ].join('\n');
}

/** Invoca Haiku vía `claude -p` (sin API keys), igual mecanismo que `ejecutarEtiquetadoConClaude`. */
export async function invocarHaikuFinanzas(texto: string, anio: number, campos: string[]): Promise<{ celdas: CeldaHaiku[]; modelo: string } | null> {
  const claude = buscarClaude();
  if (!claude) {
    log.aviso('no se encontró el CLI `claude` (Claude Code): se salta el modelo para este documento.');
    return null;
  }
  const prompt = construirPromptFinanzas(texto, anio, campos);
  const args = ['-p', '--output-format', 'json', '--tools', '', '--strict-mcp-config', '--model', 'haiku', '--append-system-prompt', INSTRUCCIONES_HAIKU_FINANZAS];
  const r = ejecutarSync(claude, args, { cwd: RAIZ, entrada: prompt, timeoutMs: 5 * 60_000 });

  let textoRespuesta = r.stdout;
  let modelo = 'haiku';
  try {
    const envoltorio = JSON.parse(r.stdout) as { result?: string; is_error?: boolean; model?: string };
    if (envoltorio.is_error) {
      log.aviso(`claude -p devolvió error: ${envoltorio.result ?? 'sin detalle'}`);
      return null;
    }
    textoRespuesta = envoltorio.result ?? r.stdout;
    if (envoltorio.model) modelo = envoltorio.model;
  } catch {
    /* stdout no era el envoltorio JSON: se toma como texto */
  }
  if (!r.ok && !textoRespuesta.trim()) {
    log.aviso(`claude -p falló (código ${r.codigo}): ${(r.stderr || r.stdout).trim().slice(-300)}`);
    return null;
  }
  const respuesta = extraerJsonHaiku(textoRespuesta);
  if (!respuesta) {
    log.aviso(`la respuesta de Haiku no trae un JSON usable: ${textoRespuesta.slice(0, 200)}`);
    return null;
  }
  return { celdas: respuesta.celdas, modelo };
}

// ---------------------------------------------------------------------------
// Orquestación (I/O: filesystem, subprocesos, red vía obtenerNota)
// ---------------------------------------------------------------------------

const FILTRO_INVENTARIO = 'estados[-_+]*(financieros|contables)|balance|memoria';
const RE_FILTRO_INVENTARIO = new RegExp(FILTRO_INVENTARIO, 'i');

/**
 * Filtra entradas de inventario por el mismo criterio que `--filtro` de `pnpm inventario`, del lado
 * del cliente. Hace falta porque el respaldo sin red (`obtenerInventarioDeDominio`) puede leer un
 * `.cache/inventarios/<dominio>.jsonl` que quedó de una corrida vieja SIN `--filtro` (con todos los
 * PDF del sitio, no solo los de balances): sin este segundo filtro, un manual sin relación
 * ("Manual_SED.pdf") puede terminar eligiéndose para un año solo porque Wayback lo capturó ese año
 * y nada mejor pasó el filtro.
 */
export function filtrarInventarioPorPalabras(entradas: EntradaInventario[]): EntradaInventario[] {
  return entradas.filter((e) => {
    let ruta: string;
    try {
      ruta = decodeURIComponent(e.url);
    } catch {
      ruta = e.url;
    }
    return RE_FILTRO_INVENTARIO.test(ruta);
  });
}

interface MedioEmpresa {
  slug: string;
  dominios: string[];
  nombre: string;
  alias: string[];
}

/** El `content/medios/*.yaml` cuyo campo `empresa` es `slugEmpresa`, con sus dominios en minúsculas. */
function cargarMedioDeEmpresa(slugEmpresa: string): MedioEmpresa | null {
  const carpeta = RUTAS_CONTENIDO.medios;
  if (!existsSync(carpeta)) return null;
  for (const f of readdirSync(carpeta)) {
    if (!/\.ya?ml$/i.test(f)) continue;
    let d: Record<string, any>;
    try {
      d = parseYaml(readFileSync(join(carpeta, f), 'utf8')) as Record<string, any>;
    } catch {
      continue;
    }
    if (d?.empresa !== slugEmpresa) continue;
    const dominiosCrudos = [d.url, ...(Array.isArray(d.dominios) ? d.dominios : [])].filter((x: unknown): x is string => typeof x === 'string');
    const dominios = [...new Set(dominiosCrudos.map(hostDe).filter(Boolean))];
    return { slug: f.replace(/\.ya?ml$/i, ''), dominios, nombre: String(d.nombre ?? slugEmpresa), alias: Array.isArray(d.alias) ? d.alias.map(String) : [] };
  }
  return null;
}

/** Heurística: nombre/alias con "banco" o "seguro" ⇒ el BCU regula y publica sus estados contables. */
function esBancoOAseguradora(empresa: Record<string, any>, medio: MedioEmpresa): boolean {
  const textos = [empresa.nombre, empresa.nombre_completo, ...(Array.isArray(empresa.alias) ? empresa.alias : []), medio.nombre, ...medio.alias].filter(Boolean).join(' ');
  return /\bbancos?\b|\bseguros?\b/i.test(textos);
}

interface ResultadoInventarioDominio {
  entradas: EntradaInventario[];
  deCache: boolean;
  error?: string;
}

/** `pnpm inventario <dominio> --filtro ...` como subproceso; si falla y hay caché de una corrida anterior, se usa esa. */
function obtenerInventarioDeDominio(dominio: string): ResultadoInventarioDominio {
  const rutaCache = join(CACHE_DIR, 'inventarios', `${dominio}.jsonl`);
  const pnpmBin = buscarEjecutable('pnpm') ?? 'pnpm';
  const r = ejecutarSync(pnpmBin, ['inventario', dominio, '--filtro', FILTRO_INVENTARIO], { cwd: RAIZ, timeoutMs: 180_000 });
  if (!r.ok && !existsSync(rutaCache)) {
    return { entradas: [], deCache: false, error: ((r.stderr || r.stdout).trim().slice(-300) || `pnpm inventario salió con código ${r.codigo}`) };
  }
  if (!existsSync(rutaCache)) return { entradas: [], deCache: false, error: 'sin datos de inventario' };
  const lineas = readFileSync(rutaCache, 'utf8').split('\n').filter(Boolean);
  const crudas = lineas
    .map((l) => {
      try {
        return JSON.parse(l) as EntradaInventario;
      } catch {
        return null;
      }
    })
    .filter((x): x is EntradaInventario => x !== null);
  // Filtrado del lado del cliente además del `--filtro` del subproceso: si vino de un
  // `.cache/inventarios/<dominio>.jsonl` de una corrida vieja SIN `--filtro`, el archivo trae TODOS
  // los PDF del sitio, no solo los de balances.
  return { entradas: filtrarInventarioPorPalabras(crudas), deCache: !r.ok };
}

function esErrorOcr(e: unknown): boolean {
  const msg = e instanceof Error ? e.message : String(e);
  return /ocr|tesseract|pdftoppm|escane/i.test(msg);
}

function aPosixRelativo(ruta: string): string {
  return relative(RAIZ, ruta).split(sep).join('/');
}

const USO = 'Uso: pnpm finanzas:extraer <empresa-slug> [--desde YYYY] [--hasta YYYY] [--anio YYYY] [--sin-modelo] [--fecha YYYY-MM-DD]';

async function main(): Promise<number> {
  const { posicionales, opciones } = parsearArgs(process.argv.slice(2));
  const slug = posicionales[0];
  if (!slug) {
    console.error(USO);
    return 1;
  }
  const anioUnico = typeof opciones.anio === 'string' ? Number(opciones.anio) : undefined;
  let desde = typeof opciones.desde === 'string' ? Number(opciones.desde) : undefined;
  let hasta = typeof opciones.hasta === 'string' ? Number(opciones.hasta) : undefined;
  if (anioUnico !== undefined) {
    desde = anioUnico;
    hasta = anioUnico;
  }
  const sinModelo = opciones['sin-modelo'] === true;
  const fecha = typeof opciones.fecha === 'string' ? opciones.fecha : hoyISO();

  const rutaFicha = join(RAIZ, 'content', 'empresas', `${slug}.yaml`);
  if (!existsSync(rutaFicha)) {
    log.error(`no existe content/empresas/${slug}.yaml. Este script continúa la serie de una empresa que ya tiene ficha; una empresa nueva la carga un investigador (que_hace, monopolio, hitos...).`);
    return 1;
  }
  const empresa = parseYaml(readFileSync(rutaFicha, 'utf8')) as Record<string, any>;
  const medio = cargarMedioDeEmpresa(slug);
  if (!medio) {
    log.error(`no encontré ningún content/medios/*.yaml con "empresa: ${slug}". Hace falta ese medio para saber en qué dominio buscar los balances.`);
    return 1;
  }
  const dominios = [...medio.dominios];
  if (esBancoOAseguradora(empresa, medio) && !dominios.includes('bcu.gub.uy') && !dominios.includes('www.bcu.gub.uy')) dominios.push('www.bcu.gub.uy');
  if (!dominios.length) {
    log.error(`content/medios/${medio.slug}.yaml no declara ningún dominio (url/dominios).`);
    return 1;
  }

  const dirSalida = join(RAIZ, 'inbox', 'empresas', slug, `${fecha}-serie`);
  mkdirSync(dirSalida, { recursive: true });
  log.info(`${slug}: dominios ${dominios.join(', ')}`);

  const inventarioCombinado: EntradaInventario[] = [];
  const dominiosSinInventario: { dominio: string; error: string }[] = [];
  for (const dominio of dominios) {
    const r = obtenerInventarioDeDominio(dominio);
    if (r.error) {
      log.aviso(`inventario de ${dominio}: ${r.error}`);
      dominiosSinInventario.push({ dominio, error: r.error });
      continue;
    }
    if (r.deCache) log.aviso(`inventario de ${dominio}: sin red en esta corrida, uso el archivo cacheado de una corrida anterior (.cache/inventarios/${dominio}.jsonl)`);
    for (const e of r.entradas) inventarioCombinado.push({ ...e, dominio });
  }

  const rutaInsumo = join(dirSalida, '_inventario.jsonl');
  writeFileSync(rutaInsumo, inventarioCombinado.map((e) => JSON.stringify(e)).join('\n') + (inventarioCombinado.length ? '\n' : ''), 'utf8');
  log.ok(`inventario: ${inventarioCombinado.length} documento(s) de ${dominios.length - dominiosSinInventario.length}/${dominios.length} dominio(s). Insumo: ${aPosixRelativo(rutaInsumo)}`);

  const aniosInventario = [...new Set(inventarioCombinado.map(anioCorregido).filter((a): a is number => a !== null))].sort((a, b) => a - b);
  const anioActual = new Date().getFullYear();
  if (desde === undefined) desde = aniosInventario.length ? aniosInventario[0] : anioActual - 5;
  if (hasta === undefined) hasta = aniosInventario.length ? aniosInventario[aniosInventario.length - 1] : anioActual;

  const anios: number[] = [];
  for (let a = desde; a <= hasta; a++) anios.push(a);

  const finanzas: Record<string, any>[] = [];
  const aniosSinDato: { anio: number; campo: string; motivo: string }[] = [];
  const cobertura: { anio: number; estado: string; detalle: string }[] = [];
  // Chequeos aritméticos que no cerraron (cierraUsd/cierraSumaSegmentos) y por eso no entraron al
  // YAML. Con la heurística actual el usd siempre se deriva acá mismo (nunca se toma un usd suelto
  // de otro lado), así que este pipeline no genera un desvío por su cuenta; queda listo para el día
  // que el modelo devuelva pesos y usd por separado, o que se sumen segmentos contra un total.
  const noCierra: string[] = [];
  let modeloUsado: string | null = null;

  for (const anio of anios) {
    const elegido = elegirDocumentoDelAnio(inventarioCombinado, anio);
    if (!elegido) {
      aniosSinDato.push({ anio, campo: '(todos)', motivo: 'sin documento' });
      cobertura.push({ anio, estado: 'sin documento', detalle: 'ningún PDF de estados contables/financieros en el inventario para este año ni para el siguiente (columna comparativa).' });
      continue;
    }
    const { doc, comparativo } = elegido;

    let resultado: Awaited<ReturnType<typeof obtenerNota>>;
    try {
      resultado = await obtenerNota(doc.url, { sinHaiku: true, sinArchivo: true });
    } catch (e) {
      const motivo = esErrorOcr(e) ? 'OCR pendiente' : 'sin documento';
      aniosSinDato.push({ anio, campo: '(todos)', motivo });
      cobertura.push({ anio, estado: motivo, detalle: `${doc.url} — ${(e as Error).message}` });
      continue;
    }
    const texto = resultado.nota.texto ?? '';
    if (texto.length < 200) {
      aniosSinDato.push({ anio, campo: '(todos)', motivo: 'OCR pendiente' });
      cobertura.push({ anio, estado: 'OCR pendiente', detalle: `${doc.url} — texto extraído demasiado corto (${texto.length} caracteres): escaneo sin OCR utilizable en esta máquina, o sin capa de texto.` });
      continue;
    }

    const medioSlug = slugDeMedio(resultado.nota.url_canonica);
    const unidadDoc = detectarUnidadDocumento(texto);
    const candidatosPorCampo = ubicarRenglones(texto);
    const candidatosCotizacion = ubicarCotizacion(texto);
    const idxColumna = comparativo ? 1 : 0;
    const anioDocumento = comparativo ? anio + 1 : anio;

    let cotizacion: number | undefined;
    if (candidatosCotizacion.length === 1 && candidatosCotizacion[0].valores.length > idxColumna) {
      cotizacion = candidatosCotizacion[0].valores[idxColumna];
    }

    const item: Record<string, any> = { anio };
    const faltantes: ClaveMonto[] = [];
    const ambiguos: ClaveMonto[] = [];
    const notaPartes: string[] = [];
    // Una sola oración, sin la URL adentro (ya está en `fuentes[].url` de cada monto; repetirla acá
    // le agrega puntos que el validador de presentación cuenta como más de un terminador de
    // oración y hace fallar `pnpm validar --inbox`).
    if (comparativo) notaPartes.push(`Sin balance propio de ${anio}: se cargó desde la columna comparativa del balance de ${anioDocumento}.`);

    const montoDesdeCandidato = (pesosCrudo: number, cita: string, modelo?: string): Record<string, any> => {
      const pesosMillones = convertirAMillones(pesosCrudo, unidadDoc);
      const monto: Record<string, any> = {
        pesos: pesosMillones,
        unidad: 'millones',
        tipo_cambio: 'cierre',
        fuentes: [
          {
            url: doc.url,
            medio: medioSlug,
            fecha: `${anioDocumento}-12-31`,
            tipo: 'documento_oficial',
            ...(resultado.nota.titulo ? { titulo: resultado.nota.titulo } : {}),
            cita,
            retrieved_at: hoyISO(),
          },
        ],
      };
      if (cotizacion) {
        monto.cotizacion = cotizacion;
        monto.usd = Math.round((pesosMillones / cotizacion) * 10) / 10;
      }
      if (modelo) monto._modelo = modelo;
      return monto;
    };

    for (const campo of CLAVES_MONTO) {
      const candidatos = candidatosPorCampo[campo];
      if (candidatos.length === 0) {
        faltantes.push(campo);
        continue;
      }
      if (candidatos.length > 1) {
        ambiguos.push(campo);
        continue;
      }
      const c = candidatos[0];
      if (c.ceroExplicito) {
        item[campo] = montoDesdeCandidato(0, c.cita);
        continue;
      }
      if (c.valores.length <= idxColumna) {
        ambiguos.push(campo);
        continue;
      }
      item[campo] = montoDesdeCandidato(c.valores[idxColumna], c.cita);
    }

    const pendientes = [...faltantes, ...ambiguos];
    if (pendientes.length && !sinModelo) {
      const haiku = await invocarHaikuFinanzas(texto, anioDocumento, pendientes);
      if (haiku) {
        modeloUsado = haiku.modelo;
        for (const celda of haiku.celdas) {
          if (!pendientes.includes(celda.renglon as ClaveMonto)) continue;
          if (!celdaLiteralEnTexto(texto, celda.cita)) {
            log.aviso(`Haiku: la cita de "${celda.renglon}" (año ${anio}) no aparece literal en el texto; se descarta.`);
            continue;
          }
          if (typeof celda.valor !== 'number' || !Number.isFinite(celda.valor)) continue;
          item[celda.renglon] = montoDesdeCandidato(celda.valor, celda.cita, haiku.modelo);
          const iF = faltantes.indexOf(celda.renglon as ClaveMonto);
          if (iF >= 0) faltantes.splice(iF, 1);
          const iA = ambiguos.indexOf(celda.renglon as ClaveMonto);
          if (iA >= 0) ambiguos.splice(iA, 1);
        }
      }
    }
    for (const campo of faltantes) aniosSinDato.push({ anio, campo, motivo: 'sin renglón' });
    for (const campo of ambiguos) aniosSinDato.push({ anio, campo, motivo: 'sin renglón (heurística encontró más de un candidato y no se pudo confirmar)' });

    if (notaPartes.length) item.nota = notaPartes.join(' ');
    const camposCargados = CLAVES_MONTO.filter((c) => item[c] !== undefined);
    if (camposCargados.length === 0) {
      cobertura.push({ anio, estado: 'sin datos utilizables', detalle: `documento leído (${doc.url}) pero ningún renglón se pudo ubicar.` });
      continue;
    }
    finanzas.push(item);
    cobertura.push({
      anio,
      estado: comparativo ? 'cargado (columna comparativa)' : 'cargado',
      detalle: `${doc.url} — campos: ${camposCargados.join(', ')}${cotizacion ? '' : ' (sin cotización: usd no calculado)'}`,
    });
  }

  // ---- escritura de salida ----
  const investigacion: Record<string, any> = { script: 'finanzas-extraer.ts', insumos: [aPosixRelativo(rutaInsumo)] };
  if (modeloUsado) investigacion.modelo = modeloUsado;
  const registro = { _slug: slug, _investigacion: investigacion, finanzas };
  writeFileSync(join(dirSalida, 'empresas.yaml'), stringifyYaml([registro], { lineWidth: 100 }), 'utf8');

  const notas: string[] = [`# Notas — ${slug}, extracción de finanzas por script (finanzas-extraer.ts, corrida ${fecha})`, ''];
  notas.push('## anios_sin_dato', '');
  if (aniosSinDato.length) {
    notas.push('| Año | Campo | Motivo |', '|---|---|---|');
    for (const a of [...aniosSinDato].sort((x, y) => x.anio - y.anio || x.campo.localeCompare(y.campo))) notas.push(`| ${a.anio} | ${a.campo} | ${a.motivo} |`);
  } else {
    notas.push('Ninguno: todos los años del período pedido tienen los cinco renglones cargados.');
  }
  notas.push('', '## cobertura_del_periodo', '', `Período pedido: ${desde}-${hasta}.`, '', '| Año | Estado | Detalle |', '|---|---|---|');
  for (const c of [...cobertura].sort((x, y) => x.anio - y.anio)) notas.push(`| ${c.anio} | ${c.estado} | ${c.detalle} |`);
  if (noCierra.length) {
    notas.push('', '## no_cierra', '');
    for (const n of noCierra) notas.push(`- ${n}`);
  }
  if (dominiosSinInventario.length) {
    notas.push('', `Dominios sin inventario disponible en esta corrida: ${dominiosSinInventario.map((d) => `${d.dominio} (${d.error})`).join('; ')}. Se puede volver a correr el script para reintentarlos.`);
  }
  writeFileSync(join(dirSalida, 'notas.md'), notas.join('\n') + '\n', 'utf8');

  log.ok(`listo: ${finanzas.length} año(s) con datos en inbox/empresas/${slug}/${fecha}-serie/empresas.yaml (${aniosSinDato.length} hueco(s) declarados en notas.md)${modeloUsado ? ` · modelo usado: ${modeloUsado}` : ''}`);
  return 0;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main()
    .then((codigo) => {
      process.exitCode = codigo;
    })
    .catch((e) => {
      log.error((e as Error).stack ?? (e as Error).message);
      process.exitCode = 1;
    });
}
