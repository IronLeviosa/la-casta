/**
 * pnpm inventario <dominio> [--desde <año>] [--hasta <año>] [--filtro <regex>] [--todos] [--json]
 *
 * Lista todos los PDF (y planillas) que un sitio publicó alguna vez, según el índice CDX de
 * Wayback, más los que el sitio lista hoy en su sitemap. Sirve para armar la tabla de cobertura
 * de una empresa antes de investigar, y para que «no existe documento público» sea una afirmación
 * verificada: los balances 2000-2003 de ANCAP y los de 2004-2006 de ANP estaban ahí y dos lotes
 * los declararon inexistentes.
 *
 * Un dominio con archivo largo puede traer cientos de documentos: por defecto la salida es un
 * resumen (`resumirInventario`) con una línea por año —o por mes si `--desde`/`--hasta` piden un
 * único año— y las 60 URL más recientes; `--todos` imprime la lista completa como antes, y
 * `--filtro` (que ya acota la búsqueda) lista todas las coincidencias sin recortar, porque
 * normalmente son pocas.
 *
 * El detalle completo siempre queda en `.cache/inventarios/<dominio>.jsonl` (una línea por URL:
 * url, url_archivada, primera y última captura, tamaño). La URL archivada es la que se cita cuando
 * el original ya no responde.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CACHE_DIR } from '../lib/rutas.ts';
import { log, parsearArgs } from '../lib/log.ts';

export interface Captura {
  url: string;
  timestamp: string;
  estado: string;
  tamano: number;
}

/**
 * Índice CDX de Wayback para `<dominio>/*` con un mimetype dado. `dominio` es solo un prefijo de
 * URL (sin esquema): puede ser un host (`bcu.gub.uy`) o un host con ruta (`www.gub.uy/presidencia/
 * comunicacion/noticias`) para acotar a una sección, que es como lo reusa `precarga.ts` para las
 * notas de Presidencia sin reimplementar la consulta.
 */
export async function cdx(dominio: string, filtroMime: string): Promise<Captura[]> {
  const u = new URL('http://web.archive.org/cdx/search/cdx');
  u.searchParams.set('url', `${dominio}/*`);
  u.searchParams.set('output', 'json');
  u.searchParams.set('fl', 'original,timestamp,statuscode,length');
  u.searchParams.set('filter', `mimetype:${filtroMime}`);
  u.searchParams.set('collapse', 'urlkey');
  // AbortController con clearTimeout y no AbortSignal.timeout: en Windows, un temporizador de
  // aborto que sigue vivo al salir del proceso dispara una asercion de libuv (UV_HANDLE_CLOSING)
  // y deja el inventario truncado; paso dos veces con respuestas CDX grandes (bcu, antel).
  const control = new AbortController();
  const temporizador = setTimeout(() => control.abort(), 180_000);
  try {
    const r = await fetch(u, { signal: control.signal });
    if (!r.ok) throw new Error(`CDX respondió HTTP ${r.status}`);
    const filas = (await r.json()) as string[][];
    return filas.slice(1).map(([url, timestamp, estado, tamano]) => ({ url, timestamp, estado, tamano: Number(tamano) || 0 }));
  } finally {
    clearTimeout(temporizador);
  }
}

async function sitemap(dominio: string): Promise<string[]> {
  const urls: string[] = [];
  for (const candidato of [`https://${dominio}/sitemap.xml`, `https://www.${dominio}/sitemap.xml`]) {
    const control = new AbortController();
    const temporizador = setTimeout(() => control.abort(), 30_000);
    try {
      const r = await fetch(candidato, { signal: control.signal });
      if (!r.ok) continue;
      const xml = await r.text();
      for (const m of xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)) urls.push(m[1]);
      if (urls.length) break;
    } catch {
      /* sin sitemap */
    } finally {
      clearTimeout(temporizador);
    }
  }
  return urls.filter((u) => /\.(pdf|xlsx?|csv|zip)(\?|$)/i.test(u));
}

export interface DocumentoInventario {
  url: string;
  url_archivada: string;
  captura: string;
  anio_probable: number;
  bytes: number;
  en_sitio_hoy: boolean;
}

export interface OpcionesInventario {
  desde?: number;
  hasta?: number;
  filtro?: RegExp;
}

export interface ResultadoInventario {
  lista: DocumentoInventario[];
  /** Cuántos documentos hay en Wayback y en el sitemap actual, antes de filtrar por año/regex. */
  enWayback: number;
  enSitemap: number;
  /** `.cache/inventarios/<dominio>.jsonl`, con `dominio` tal como se pasó (puede incluir ruta). */
  salida: string;
}

/**
 * Arma el inventario de PDF y planillas de `dominio` (CDX de Wayback + sitemap actual) y lo deja
 * en `.cache/inventarios/<dominio>.jsonl`. Extraído de `main()` para que `precarga.ts` (precarga
 * nocturna del corpus, plan 2026-09 ítem 3.3) lo reuse sin repetir la consulta CDX.
 */
export async function construirInventario(dominio: string, opciones: OpcionesInventario = {}): Promise<ResultadoInventario> {
  const { desde, hasta, filtro } = opciones;
  const capturas = [...(await cdx(dominio, 'application/pdf')), ...(await cdx(dominio, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').catch(() => [] as Captura[]))];
  const actuales = await sitemap(dominio);

  const anioDe = (c: Captura) => {
    const m = c.url.match(/(19|20)\d{2}/);
    return m ? Number(m[0]) : Number(c.timestamp.slice(0, 4));
  };
  let lista = capturas.filter((c) => c.estado === '200' || c.estado === '-');
  if (filtro) lista = lista.filter((c) => filtro.test(c.url));
  if (desde) lista = lista.filter((c) => anioDe(c) >= desde);
  if (hasta) lista = lista.filter((c) => anioDe(c) <= hasta);
  lista.sort((a, b) => anioDe(a) - anioDe(b) || a.url.localeCompare(b.url));

  const documentos: DocumentoInventario[] = lista.map((c) => ({
    url: c.url,
    url_archivada: `https://web.archive.org/web/${c.timestamp}id_/${c.url}`,
    captura: c.timestamp,
    anio_probable: anioDe(c),
    bytes: c.tamano,
    en_sitio_hoy: actuales.includes(c.url),
  }));

  const dir = join(CACHE_DIR, 'inventarios');
  mkdirSync(dir, { recursive: true });
  const salida = join(dir, `${dominio}.jsonl`);
  writeFileSync(salida, documentos.map((d) => JSON.stringify(d)).join('\n') + '\n', 'utf8');

  return { lista: documentos, enWayback: capturas.length, enSitemap: actuales.length, salida };
}

export interface OpcionesResumen {
  desde?: number;
  hasta?: number;
  /** Cuántas URL mostrar como máximo cuando no se pide la lista completa (60 por omisión). */
  maximoUrls?: number;
  /** Sin recorte: todas las URL, en el orden de más reciente a más vieja. */
  todos?: boolean;
}

export interface ResumenInventario {
  /** Una línea por año, o por mes si `desde`/`hasta` acotan a un único año. */
  lineasPorPeriodo: string[];
  /** Las URL a listar: todas si `todos`, si no las `maximoUrls` más recientes. */
  mostrados: DocumentoInventario[];
  /** true si `mostrados` deja documentos afuera de la lista. */
  truncado: boolean;
}

const linea = (d: DocumentoInventario): string =>
  `  ${d.captura.slice(0, 8)}  ${Math.round(d.bytes / 1024).toString().padStart(6)} KB  ${decodeURIComponent(d.url)}`;

/**
 * Agrupa `docs` por período y recorta la lista de URL para una salida corta por defecto. Pura:
 * ni imprime ni toca red, para poder probarla sin CDX de por medio.
 */
export function resumirInventario(docs: DocumentoInventario[], opciones: OpcionesResumen = {}): ResumenInventario {
  const { desde, hasta, maximoUrls = 60, todos = false } = opciones;
  const unSoloAnio = desde !== undefined && hasta !== undefined && desde === hasta;

  const grupos = new Map<string, { cantidad: number; bytes: number }>();
  for (const d of docs) {
    const clave = unSoloAnio ? `${d.anio_probable}-${d.captura.slice(4, 6)}` : String(d.anio_probable);
    const g = grupos.get(clave) ?? { cantidad: 0, bytes: 0 };
    g.cantidad += 1;
    g.bytes += d.bytes;
    grupos.set(clave, g);
  }
  const lineasPorPeriodo = [...grupos.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([periodo, { cantidad, bytes }]) => `${periodo}  ${cantidad} documento(s)  ${Math.round(bytes / 1024).toLocaleString('es-UY')} KB`);

  const ordenados = [...docs].sort((a, b) => b.captura.localeCompare(a.captura));
  const mostrados = todos ? ordenados : ordenados.slice(0, maximoUrls);
  return { lineasPorPeriodo, mostrados, truncado: mostrados.length < ordenados.length };
}

async function main(): Promise<number> {
  const { posicionales, opciones } = parsearArgs(process.argv.slice(2));
  const dominio = (posicionales[0] ?? '').replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '');
  if (!dominio) {
    console.error('Uso: pnpm inventario <dominio> [--desde <año>] [--hasta <año>] [--filtro <regex>] [--todos] [--json]');
    console.error('Por omisión resume por año (o por mes si --desde/--hasta piden un solo año) y muestra las 60 URL más recientes.');
    return 1;
  }
  const desde = opciones.desde ? Number(opciones.desde) : undefined;
  const hasta = opciones.hasta ? Number(opciones.hasta) : undefined;
  const filtro = opciones.filtro ? new RegExp(String(opciones.filtro), 'i') : undefined;

  log.info(`Wayback CDX de ${dominio} (PDF y planillas)…`);
  const { lista, enWayback, enSitemap, salida } = await construirInventario(dominio, { desde, hasta, filtro });
  log.info(`${enWayback} documento(s) en Wayback, ${enSitemap} en el sitemap actual`);

  if (opciones.json) {
    console.log(JSON.stringify(lista.map((d) => ({ url: d.url, anio: d.anio_probable, captura: d.captura })), null, 1));
    return 0;
  }

  // Con --filtro la búsqueda ya acotó la lista a las pocas que coinciden: se listan todas. Sin
  // filtro, --todos pide explícitamente el listado completo de siempre.
  const todos = Boolean(opciones.todos) || Boolean(filtro);
  if (todos) {
    let anioActual = -1;
    for (const d of lista) {
      if (d.anio_probable !== anioActual) {
        anioActual = d.anio_probable;
        console.log(`\n${anioActual}`);
      }
      console.log(linea(d));
    }
    console.log(`\n${lista.length} documento(s). Detalle con URL archivada: ${salida}`);
    return 0;
  }

  const { lineasPorPeriodo, mostrados, truncado } = resumirInventario(lista, { desde, hasta });
  for (const l of lineasPorPeriodo) console.log(l);
  console.log('');
  for (const d of mostrados) console.log(linea(d));
  if (truncado) console.log(`\n${lista.length} documento(s) en total; --todos para listarlos todos, --filtro <texto> para acotar.`);
  console.log(`Detalle con URL archivada: ${salida}`);
  return 0;
}

// Guardia de punto de entrada (como el resto de scripts/*.ts): sin esto, cualquier módulo que
// importe `cdx` o `construirInventario` (p. ej. `precarga.ts`, que reusa la consulta CDX para las
// notas de Presidencia) disparaba el CLI entero al importar el archivo, interpretando el primer
// argumento de *ese* proceso como si fuera el dominio de `pnpm inventario`.
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = await main();
}
