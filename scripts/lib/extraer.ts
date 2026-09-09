/**
 * Extraccion de texto y metadatos de HTML (Readability sobre linkedom) y PDF (pdf-parse).
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseHTML } from 'linkedom';
import { Readability } from '@mozilla/readability';
import { sha256 } from './hash.ts';
import { CACHE_OCR, ocrPaginas, ocrPdf, pareceEscaneado } from './ocr.ts';
import { log } from './log.ts';

export interface Extraccion {
  titulo: string | null;
  autor: string | null;
  fecha: string | null; // YYYY-MM-DD si se pudo
  texto: string;
  descripcion: string | null;
  medioNombre: string | null;
  /** true si el texto salio de OCR (PDF escaneado, sin capa de texto). */
  ocr?: boolean;
  /** Paginas del PDF, cuando se conoce. */
  paginas?: number;
}

/** Normaliza una fecha cualquiera a YYYY-MM-DD (o null). */
export function fechaISO(valor: string | null | undefined): string | null {
  if (!valor) return null;
  const v = valor.trim();
  const m = v.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  const m2 = v.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})/);
  if (m2) return `${m2[3]}-${m2[2].padStart(2, '0')}-${m2[1].padStart(2, '0')}`;
  const d = new Date(v);
  if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  return null;
}

type Doc = ReturnType<typeof parseHTML>['document'];

function meta(document: Doc, selectores: string[]): string | null {
  for (const s of selectores) {
    const el = document.querySelector(s);
    const v = el?.getAttribute('content') ?? el?.getAttribute('datetime') ?? el?.textContent;
    if (v && v.trim()) return v.trim();
  }
  return null;
}

/** Busca fecha, autor y titulo en JSON-LD (NewsArticle) si existe. */
function jsonLd(document: Doc): { fecha?: string; autor?: string; titulo?: string; medio?: string } {
  const salida: { fecha?: string; autor?: string; titulo?: string; medio?: string } = {};
  for (const s of document.querySelectorAll('script[type="application/ld+json"]')) {
    try {
      const datos = JSON.parse(s.textContent ?? '');
      const lista = Array.isArray(datos) ? datos : datos['@graph'] ? datos['@graph'] : [datos];
      for (const d of lista) {
        const tipo = String(d?.['@type'] ?? '');
        if (!/Article|NewsArticle|Report|BlogPosting|WebPage|VideoObject/i.test(tipo)) continue;
        salida.fecha ??= d.datePublished ?? d.dateCreated ?? d.uploadDate;
        const a = d.author;
        const nombreAutor = Array.isArray(a) ? a.map((x: { name?: string }) => x?.name).filter(Boolean).join(', ') : a?.name ?? (typeof a === 'string' ? a : undefined);
        if (nombreAutor) salida.autor ??= nombreAutor;
        salida.titulo ??= d.headline ?? d.name;
        salida.medio ??= d.publisher?.name;
      }
    } catch {
      /* JSON-LD roto: ignorar */
    }
  }
  return salida;
}

/**
 * Listado de adjuntos descargables (PDF y ofimatica) con su titulo visible.
 * En gub.uy la publicacion es la lista de PDF: Readability se queda solo con el copete,
 * asi que los adjuntos se agregan al final del texto para que queden en el corpus y se etiqueten.
 */
export function adjuntosDescargables(document: Doc, url: string): { titulo: string; url: string }[] {
  const salida: { titulo: string; url: string }[] = [];
  const vistos = new Set<string>();
  for (const a of document.querySelectorAll('a[href]')) {
    const href = a.getAttribute('href') ?? '';
    const esDescarga = a.hasAttribute('download') || /\.(pdf|docx?|xlsx?|pptx?|csv|odt|ods)(\?|#|$)/i.test(href);
    if (!esDescarga) continue;
    let absoluta: string;
    try {
      absoluta = new URL(href, url).toString();
    } catch {
      continue;
    }
    if (vistos.has(absoluta)) continue;
    vistos.add(absoluta);
    const titulo = (a.getAttribute('aria-label') ?? a.textContent ?? '').replace(/\s+/g, ' ').trim().replace(/^Descargar:\s*/i, '');
    salida.push({ titulo: titulo || decodeURIComponent(absoluta.split('/').pop() ?? ''), url: absoluta });
    if (salida.length >= 50) break;
  }
  return salida;
}

export function extraerHtml(html: string, url: string): Extraccion {
  const { document } = parseHTML(html);
  const ld = jsonLd(document);

  let articulo: ReturnType<Readability['parse']> = null;
  try {
    // Readability muta el DOM: parseamos una copia para que las metas sigan disponibles.
    const copia = parseHTML(html).document;
    // linkedom no define document.location; Readability lo usa para resolver enlaces relativos.
    Object.defineProperty(copia, 'documentURI', { value: url, configurable: true });
    articulo = new Readability(copia as unknown as Document, { charThreshold: 200 }).parse();
  } catch {
    articulo = null;
  }

  let texto = (articulo?.textContent ?? '').trim();
  if (!texto) {
    for (const s of document.querySelectorAll('script,style,noscript,nav,header,footer,aside,form')) s.remove();
    texto = (document.body?.textContent ?? '').trim();
  }
  texto = texto.replace(/[ \t ]+/g, ' ').replace(/\s*\n\s*\n\s*/g, '\n\n').replace(/[ \t]*\n[ \t]*/g, '\n').trim();

  const adjuntos = adjuntosDescargables(document, url);
  if (adjuntos.length) {
    texto += '\n\nDescargas:\n' + adjuntos.map((a) => `- ${a.titulo} — ${a.url}`).join('\n');
  }

  const fechaCruda =
    ld.fecha ??
    meta(document, [
      'meta[property="article:published_time"]',
      'meta[name="article:published_time"]',
      'meta[name="pubdate"]',
      'meta[name="publishdate"]',
      'meta[name="date"]',
      'meta[name="DC.date.issued"]',
      'meta[name="dc.date"]',
      'meta[itemprop="datePublished"]',
      'meta[property="og:published_time"]',
      'time[datetime]',
      'time[pubdate]',
    ]);

  const autor =
    ld.autor ??
    meta(document, ['meta[name="author"]', 'meta[property="article:author"]', 'meta[name="dc.creator"]', '[rel="author"]', '.author', '.autor']) ??
    articulo?.byline ??
    null;

  const titulo = articulo?.title || ld.titulo || meta(document, ['meta[property="og:title"]', 'meta[name="twitter:title"]']) || document.querySelector('title')?.textContent?.trim() || null;

  return {
    titulo: titulo ? titulo.replace(/\s+/g, ' ').trim() : null,
    autor: autor ? autor.replace(/\s+/g, ' ').trim().slice(0, 200) : null,
    fecha: fechaISO(fechaCruda),
    texto,
    descripcion: articulo?.excerpt ?? meta(document, ['meta[property="og:description"]', 'meta[name="description"]']),
    medioNombre: ld.medio ?? meta(document, ['meta[property="og:site_name"]', 'meta[name="application-name"]']) ?? null,
  };
}

/**
 * `forzarOcr`: vuelve a leer el PDF con Tesseract aunque traiga capa de texto. Sirve para los
 * escaneos cuyo OCR de origen es malo (los diarios de sesiones de los 90 de la Biblioteca del
 * Parlamento traen «SE~OR BARANDIARAN» y «sef'íor»): el texto que queda en el corpus es el que
 * se cita, así que conviene que sea el mejor que se pueda producir.
 */
export async function extraerPdf(buffer: Buffer, op: { forzarOcr?: boolean } = {}): Promise<Extraccion> {
  const { PDFParse } = await import('pdf-parse');
  const parser = new PDFParse({ data: new Uint8Array(buffer) });
  try {
    const [texto, info] = await Promise.all([parser.getText(), parser.getInfo().catch(() => null)]);
    const i = (info?.info ?? {}) as Record<string, unknown>;
    const fechas = (info as { dates?: { CreationDate?: unknown } } | null)?.dates;
    const fecha = fechas?.CreationDate instanceof Date ? fechas.CreationDate.toISOString().slice(0, 10) : null;
    // pdf-parse separa paginas con "-- 3 of 8 --": molesta al buscar citas que cruzan pagina.
    const crudo = texto.text ?? '';
    const limpiar = (t: string) => t.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
    const plano = limpiar(crudo.replace(/--\s*\d+\s+of\s+\d+\s*--/g, '\n\n'));
    const paginas = texto.total || info?.total || 1;
    // Un PDF mixto (notas con texto digital y los estados primarios escaneados, como los balances
    // viejos de OSE) no dispara el OCR entero porque el promedio de caracteres por página lo
    // esconde; se mira página por página y se reemplazan solo las que no traen texto.
    const porPagina = crudo.split(/--\s*\d+\s+of\s+\d+\s*--/).map(limpiar);
    const conOcr = op.forzarOcr
      ? await textoPorOcr(buffer, '', paginas)
      : pareceEscaneado(plano, paginas)
        ? await textoPorOcr(buffer, plano, paginas)
        : await textoMixtoPorOcr(buffer, porPagina, paginas);
    return {
      titulo: typeof i.Title === 'string' && i.Title.trim() ? i.Title.trim() : null,
      autor: typeof i.Author === 'string' && i.Author.trim() ? i.Author.trim() : null,
      fecha,
      texto: conOcr ?? plano,
      descripcion: typeof i.Subject === 'string' ? i.Subject : null,
      medioNombre: null,
      ocr: conOcr !== null,
      paginas,
    };
  } finally {
    await parser.destroy().catch(() => {});
  }
}

/**
 * Respaldo por OCR cuando el PDF no trae capa de texto (menos de ~50 caracteres
 * utiles por pagina): guarda el PDF en `.cache/ocr/<sha256>.pdf` y lo pasa por
 * poppler + Tesseract. Devuelve null si el OCR no esta disponible o no aporto
 * mas texto que la extraccion normal; el llamador se queda con lo que tenia.
 */
/**
 * OCR solo de las páginas sin texto de un PDF mixto. Si ninguna página está vacía, o todas lo
 * están (eso lo maneja `textoPorOcr`), o el conteo de páginas del OCR no coincide, devuelve
 * null y el llamador se queda con el texto digital. El OCR corre sobre el documento entero
 * (queda cacheado por hash) y después se mezcla página por página.
 */
async function textoMixtoPorOcr(buffer: Buffer, porPagina: string[], paginas: number, minimo = 50): Promise<string | null> {
  const utiles = (t: string) => t.replace(/\s+/g, '').length;
  const cuerpo = porPagina.length > paginas ? porPagina.slice(0, paginas) : porPagina;
  if (cuerpo.length !== paginas) return null;
  const vacias = cuerpo.map((p, i) => (utiles(p) < minimo ? i : -1)).filter((i) => i >= 0);
  if (vacias.length === 0 || vacias.length === cuerpo.length) return null;
  // Una o dos páginas vacías en un documento largo son portadas o páginas en blanco, no un
  // escaneo; y más de 80 páginas escaneadas ya no es un documento mixto sino uno escaneado con
  // notas digitales, que se deja para `--forzar` explícito. Solo se leen las páginas vacías.
  const TOPE = 80;
  if (vacias.length < 3 && paginas > 20) return null;
  if (vacias.length > TOPE) {
    log.aviso(`PDF mixto con ${vacias.length} pagina(s) sin texto: por encima del tope de ${TOPE}, se deja el texto digital`);
    return null;
  }
  try {
    mkdirSync(CACHE_OCR, { recursive: true });
    const ruta = join(CACHE_OCR, `${sha256(buffer)}.pdf`);
    writeFileSync(ruta, buffer);
    log.info(`PDF mixto: ${vacias.length} de ${paginas} pagina(s) sin texto: pasando solo esas por OCR`);
    const arranque = Date.now();
    const leidas = await ocrPaginas(ruta, vacias.map((i) => i + 1));
    const mezcla = cuerpo.map((p, i) => {
      const t = leidas.get(i + 1);
      return t !== undefined && utiles(t) > utiles(p) ? t : p;
    });
    log.ok(`OCR tesseract sobre ${leidas.size} de ${vacias.length} pagina(s) escaneada(s) en ${((Date.now() - arranque) / 1000).toFixed(1)} s`);
    return mezcla.join('\n\n').replace(/\n{3,}/g, '\n\n').trim();
  } catch (e) {
    log.aviso(`OCR no disponible: ${(e as Error).message}`);
    return null;
  }
}

async function textoPorOcr(buffer: Buffer, plano: string, paginas: number): Promise<string | null> {
  try {
    mkdirSync(CACHE_OCR, { recursive: true });
    const ruta = join(CACHE_OCR, `${sha256(buffer)}.pdf`);
    writeFileSync(ruta, buffer);
    log.info(`PDF sin capa de texto (${plano.length} chars en ${paginas} pagina(s)): pasando a OCR`);
    const r = await ocrPdf(ruta);
    if (r.texto.replace(/\s+/g, '').length <= plano.replace(/\s+/g, '').length) return null;
    log.ok(`OCR ${r.backend}: ${r.texto.length} chars en ${r.paginas} pagina(s)${r.desdeCache ? ' (cache)' : ` en ${(r.duracionMs / 1000).toFixed(1)} s`}`);
    return r.texto;
  } catch (e) {
    log.aviso(`OCR no disponible: ${(e as Error).message}`);
    return null;
  }
}
