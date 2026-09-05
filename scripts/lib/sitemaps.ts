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

/**
 * Muchos medios nombran sus sitemaps mensuales `sitemap-YYYYMM.xml` (El Pais lo hace, 276 archivos
 * desde 2003-03). Cuando el nombre codifica el mes, se puede recortar el rango sin bajar todo.
 */
export function mesDeUrl(url: string): string | null {
  const m = /(\d{4})[-_]?(\d{2})(?!\d)/.exec(url.split('/').pop() ?? '');
  if (!m) return null;
  const [, a, mes] = m;
  const n = Number(mes);
  if (n < 1 || n > 12) return null;
  return `${a}-${mes}`;
}

export interface Candidata {
  url: string;
  lastmod: string | null;
}

/**
 * Devuelve las URLs de un medio entre dos meses (`YYYY-MM`), filtradas por `terminos` contra el
 * slug. El filtro por slug es grueso a proposito: descarta el 98% del ruido sin bajar cada nota,
 * y lo que pase queda para que el investigador lo lea con `pnpm fuente` y decida.
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
    if (esIndice(xml)) {
      for (const bloque of etiquetas(xml, 'sitemap')) {
        const loc = etiquetas(bloque, 'loc')[0];
        if (loc && enRango(mesDeUrl(loc))) pendientes.push(loc);
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
      candidatas.push({ url: loc, lastmod });
      if (candidatas.length >= limite) break;
    }
  }
  return { candidatas, sitemapsLeidos, urlsVistas };
}
