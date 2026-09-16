/**
 * Descubrimiento de notas por el sitemap del propio medio.
 *
 * Por que existe: el buscador que usan los agentes no devuelve resultados de elpais.com.uy. No es
 * una decision del diario —su robots.txt dice `Allow: /` para todos los bots, y sirve el contenido
 * completo con codigo 200 a ClaudeBot, a GPTBot y a Googlebot por igual, verificado byte por byte—
 * sino una exclusion del lado del buscador. El efecto practico era que el diario tradicional mas
 * grande del pais tenia CERO notas en un corpus de 638: los agentes lo buscaban con `site:`,
 * recibian cero resultados, y anotaban "sin cobertura", que es indistinguible de que no exista.
 *
 * Leer el sitemap es el camino que el propio medio publica para ser indexado. No reemplaza al
 * buscador: lo complementa donde el buscador es ciego, y sirve para cualquier medio con sitemap.
 *
 * Lo unico que el robots.txt de El Pais prohibe es `/search`, su buscador interno, y por eso esa
 * via queda descartada a proposito. `urlPermitida` hace cumplir los Disallow que declare el medio.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { descargar } from './http.ts';
import { CACHE_DIR } from './rutas.ts';
import { log } from './log.ts';

const CACHE_SITEMAPS = path.join(CACHE_DIR, 'sitemaps');

export interface Robots {
  sitemaps: string[];
  disallow: string[];
}

/** Lee robots.txt: de donde salen los sitemaps y que rutas pidio el medio que no toquemos. */
export async function leerRobots(origen: string): Promise<Robots> {
  const sitemaps: string[] = [];
  const disallow: string[] = [];
  try {
    const d = await descargar(new URL('/robots.txt', origen).toString());
    let enComodin = false;
    for (const linea of d.buffer.toString('utf8').split(/\r?\n/)) {
      const l = linea.trim();
      const sm = /^sitemap:\s*(\S+)/i.exec(l);
      if (sm) {
        sitemaps.push(sm[1]);
        continue;
      }
      const ua = /^user-agent:\s*(\S+)/i.exec(l);
      if (ua) {
        enComodin = ua[1] === '*';
        continue;
      }
      const da = /^disallow:\s*(\S*)/i.exec(l);
      if (da && enComodin && da[1]) disallow.push(da[1]);
    }
  } catch (e) {
    log.debug(`sin robots.txt en ${origen}: ${(e as Error).message}`);
  }
  return { sitemaps, disallow };
}

/** Respeta los Disallow declarados para `*`. Un medio que pide que no entremos a algo, no se toca. */
export function urlPermitida(url: string, robots: Robots): boolean {
  let ruta: string;
  try {
    ruta = new URL(url).pathname;
  } catch {
    return false;
  }
  return !robots.disallow.some((d) => ruta.startsWith(d));
}

async function bajarConCache(url: string): Promise<string> {
  mkdirSync(CACHE_SITEMAPS, { recursive: true });
  const f = path.join(CACHE_SITEMAPS, createHash('sha1').update(url).digest('hex') + '.xml');
  if (existsSync(f)) return readFileSync(f, 'utf8');
  const d = await descargar(url);
  const texto = d.buffer.toString('utf8');
  writeFileSync(f, texto, 'utf8');
  return texto;
}

const etiquetas = (xml: string, tag: string): string[] =>
  [...xml.matchAll(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'gi'))].map((m) => m[1].trim());

/** Un `<sitemapindex>` lista otros sitemaps; un `<urlset>` lista notas. */
export function esIndice(xml: string): boolean {
  return /<sitemapindex/i.test(xml);
}

/** Primer mes del que puede haber un sitemap real, y el mes siguiente al de hoy (ver `mesDeUrl`). */
const PRIMER_MES_VALIDO = '1990-01';

/** "YYYY-MM" del mes siguiente al de `fecha`, para no rechazar un sitemap generado con reloj adelantado. */
function mesSiguienteA(fecha: Date): string {
  const anio = fecha.getUTCFullYear();
  const mesActual = fecha.getUTCMonth() + 1; // 1-12
  const [anioSiguiente, mesSiguiente] = mesActual === 12 ? [anio + 1, 1] : [anio, mesActual + 1];
  return `${anioSiguiente}-${String(mesSiguiente).padStart(2, '0')}`;
}

/**
 * Muchos medios nombran sus sitemaps mensuales `sitemap-YYYYMM.xml` (El Pais lo hace, 276 archivos
 * desde 2003-03). Cuando el nombre codifica el mes, se puede recortar el rango sin bajar todo.
 *
 * El barrido de `docs/fuentes-prensa.md` (2026-09-16) encontró falsos positivos: un ID de nota
 * como `.../38270413` matchea la misma regex y da "año 3827, mes 04", que ordena después de
 * cualquier `--hasta` real y termina incluido igual. Un mes de sitemap real cae entre 1990-01 (no
 * hay sitemaps más viejos que la Web) y el mes que viene del reloj de esta máquina (por si el
 * sitemap se generó con el reloj un poco adelantado); lo que caiga fuera de ese rango no es una
 * fecha, es un número que coincidió con el patrón.
 */
export function mesDeUrl(url: string, ahora: Date = new Date()): string | null {
  const m = /(\d{4})[-_]?(\d{2})(?!\d)/.exec(url.split('/').pop() ?? '');
  if (!m) return null;
  const [, a, mes] = m;
  const n = Number(mes);
  if (n < 1 || n > 12) return null;
  const candidato = `${a}-${mes}`;
  if (candidato < PRIMER_MES_VALIDO || candidato > mesSiguienteA(ahora)) return null;
  return candidato;
}

export interface Candidata {
  url: string;
  lastmod: string | null;
  /** `news:title` o `title` del bloque `<url>`, cuando el sitemap lo trae (no todos lo hacen). */
  titulo?: string | null;
}

/**
 * Cuantos `terminos` aparecen en la URL decodificada o, si el sitemap trajo titulo, en el titulo.
 * Cada termino cuenta una vez (union, no suma URL+titulo) para no premiar doble a la nota que
 * repite la misma palabra en los dos lugares frente a la que toca dos temas distintos.
 */
export function relevanciaCandidata(c: Candidata, terminos: string[]): number {
  if (!terminos.length) return 0;
  let url: string;
  try {
    url = decodeURIComponent(c.url).toLowerCase();
  } catch {
    url = c.url.toLowerCase();
  }
  const titulo = c.titulo ? c.titulo.toLowerCase() : '';
  let n = 0;
  for (const t of terminos) {
    if (!t) continue;
    const tt = t.toLowerCase();
    if (url.includes(tt) || titulo.includes(tt)) n += 1;
  }
  return n;
}

/**
 * Ordena candidatas por relevancia (cuantos `terminos` aparecen en la URL/titulo, de mayor a
 * menor) y, a igualdad, por `lastmod` mas reciente primero; sin `lastmod` queda al final del
 * empate. Con `terminos` vacio la relevancia es 0 para todas y el orden queda solo por fecha.
 */
export function ordenarCandidatas(candidatas: Candidata[], terminos: string[]): Candidata[] {
  return [...candidatas].sort((a, b) => {
    const dif = relevanciaCandidata(b, terminos) - relevanciaCandidata(a, terminos);
    if (dif !== 0) return dif;
    const la = a.lastmod ?? '';
    const lb = b.lastmod ?? '';
    return lb.localeCompare(la);
  });
}

export interface OpcionesRecorte {
  maximo?: number;
  todas?: boolean;
}

export interface ResultadoRecorte {
  mostradas: Candidata[];
  truncado: boolean;
}

/** Se queda con las primeras `maximo` (40 por omision) salvo que `todas` pida la lista entera. */
export function recortar(candidatas: Candidata[], opciones: OpcionesRecorte = {}): ResultadoRecorte {
  const { maximo = 40, todas = false } = opciones;
  if (todas) return { mostradas: candidatas, truncado: false };
  const mostradas = candidatas.slice(0, Math.max(0, maximo));
  return { mostradas, truncado: mostradas.length < candidatas.length };
}

/**
 * Devuelve las URLs de un medio entre dos meses (`YYYY-MM`), filtradas por `terminos` contra el
 * slug. El filtro por slug es grueso a proposito: descarta el 98% del ruido sin bajar cada nota,
 * y lo que pase queda para que el investigador lo lea con `pnpm fuente` y decida. Las candidatas
 * vuelven ya ordenadas por relevancia (`ordenarCandidatas`): la version CLI solo recorta el pie.
 */
export async function descubrir(
  origen: string,
  opciones: { desde?: string; hasta?: string; terminos?: string[]; limite?: number } = {},
): Promise<{ candidatas: Candidata[]; sitemapsLeidos: number; urlsVistas: number }> {
  const { desde, hasta, terminos = [], limite = 500 } = opciones;
  const robots = await leerRobots(origen);
  if (robots.sitemaps.length === 0) return { candidatas: [], sitemapsLeidos: 0, urlsVistas: 0 };

  const enRango = (mes: string | null) => !mes || ((!desde || mes >= desde) && (!hasta || mes <= hasta));
  const rx = terminos.length ? new RegExp(terminos.join('|'), 'i') : null;

  const pendientes = [...robots.sitemaps];
  const candidatas: Candidata[] = [];
  const vistos = new Set<string>();
  let sitemapsLeidos = 0;
  let urlsVistas = 0;

  while (pendientes.length && candidatas.length < limite) {
    const sm = pendientes.shift()!;
    if (vistos.has(sm)) continue;
    vistos.add(sm);
    let xml: string;
    try {
      xml = await bajarConCache(sm);
    } catch (e) {
      log.debug(`no se pudo bajar ${sm}: ${(e as Error).message}`);
      continue;
    }
    sitemapsLeidos += 1;
    // Ceder el event loop entre archivo y archivo. Con el sitemap ya en caché (`bajarConCache`
    // resuelve con una lectura de disco, sin E/S de red) un índice de cientos de archivos corre
    // sin una sola vuelta real al loop de eventos, y un timeout puesto por quien llama a
    // `descubrir()` (`Promise.race` contra un `setTimeout`) no llega a dispararse porque los
    // timers son macrotareas: hace falta ceder con una macrotarea propia para que se intercalen.
    // Es el defecto que el barrido de `docs/fuentes-prensa.md` documentó sin tocar este archivo
    // (8 medios "no respondieron" pese a un tope de 60 s): acá se corrige de verdad.
    await new Promise<void>((resolver) => setImmediate(resolver));
    if (esIndice(xml)) {
      for (const bloque of etiquetas(xml, 'sitemap')) {
        const loc = etiquetas(bloque, 'loc')[0];
        if (!loc) continue;
        // El nombre del archivo manda cuando codifica un mes real (como los `sitemap-YYYYMM.xml`
        // de El País, donde el `<lastmod>` del índice solo dice cuándo se regeneró el archivo, no
        // qué mes de notas contiene). Sin mes en el nombre, el `<lastmod>` del propio índice es lo
        // único que hay para decidir si vale la pena bajarlo.
        const lastmodBloque = etiquetas(bloque, 'lastmod')[0];
        const mes = mesDeUrl(loc) ?? (lastmodBloque ? lastmodBloque.slice(0, 7) : null);
        if (enRango(mes)) pendientes.push(loc);
      }
      continue;
    }
    for (const bloque of etiquetas(xml, 'url')) {
      const loc = etiquetas(bloque, 'loc')[0];
      if (!loc) continue;
      urlsVistas += 1;
      if (!urlPermitida(loc, robots)) continue;
      if (rx && !rx.test(decodeURIComponent(loc))) continue;
      const lastmod = etiquetas(bloque, 'lastmod')[0] ?? null;
      const titulo = etiquetas(bloque, 'news:title')[0] ?? etiquetas(bloque, 'title')[0] ?? null;
      candidatas.push({ url: loc, lastmod, titulo });
      if (candidatas.length >= limite) break;
    }
  }
  return { candidatas: ordenarCandidatas(candidatas, terminos), sitemapsLeidos, urlsVistas };
}
