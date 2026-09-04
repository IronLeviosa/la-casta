/**
 * pnpm fuente <url> [--json] [--forzar] [--sin-archivo] [--sin-haiku] [--solo-meta]
 *
 * Herramienta unica de lectura: busca la nota en el corpus por URL canonica; si no esta,
 * la baja (HTML -> Readability, PDF -> pdf-parse, video -> transcribir), la guarda en
 * ${CORPUS_DIR}/notas/<sha1>.json (+ .html.gz/.pdf crudo), la etiqueta por alias, pide
 * archivo en Wayback, encola el etiquetado Haiku e indexa.
 */
import { existsSync, readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import { parse as parseYaml } from 'yaml';
import { asegurarCorpus, RUTAS_CONTENIDO, RUTAS_CORPUS } from '../lib/rutas.ts';
import { idDeUrl, sha256 } from '../lib/hash.ts';
import { canonicalizar, esVideo, esYoutube, hostDe } from '../lib/url.ts';
import { descargar, ErrorHttp } from '../lib/http.ts';
import { extraerHtml, extraerPdf, type Extraccion } from '../lib/extraer.ts';
import { archivar } from '../lib/wayback.ts';
import { log, parsearArgs, silenciar } from '../lib/log.ts';
import { normalizar, recortar } from '../lib/texto.ts';
import { etiquetarPorAlias, etiquetarConHaiku, guardarNota, leerNota } from './etiquetar.ts';
import { abrirIndice, indexarNota } from './indexar.ts';
import { transcribir } from '../transcribir.ts';
import type { Nota, TipoNota } from './tipos.ts';

export { archivar } from '../lib/wayback.ts';
export { leerNota, guardarNota } from './etiquetar.ts';

export interface OpcionesFuente {
  /** Volver a bajar aunque este en el corpus. */
  forzar?: boolean;
  sinArchivo?: boolean;
  sinHaiku?: boolean;
  /** Progreso de yt-dlp/Whisper en stderr. */
  verboso?: boolean;
}

export interface ResultadoFuente {
  nota: Nota;
  /** true si se bajo en esta corrida; false si vino del corpus. */
  nueva: boolean;
  archivo?: { origen: string; error?: string };
  trabajoHaiku?: string | null;
}

interface EntradaMedio {
  slug: string;
  host: string;
  /** Prefijo de ruta ("/" si el medio ocupa todo el host). gub.uy hospeda un organismo por prefijo. */
  prefijo: string;
}

let mediosCache: EntradaMedio[] | null = null;

function cargarMedios(): EntradaMedio[] {
  if (mediosCache) return mediosCache;
  const lista: EntradaMedio[] = [];
  if (existsSync(RUTAS_CONTENIDO.medios)) {
    for (const f of readdirSync(RUTAS_CONTENIDO.medios)) {
      if (!/\.ya?ml$/i.test(f)) continue;
      try {
        const d = parseYaml(readFileSync(join(RUTAS_CONTENIDO.medios, f), 'utf8')) as Record<string, unknown>;
        const slug = String(d?.slug ?? d?.id ?? f.replace(/\.ya?ml$/i, ''));
        const dominios = [d?.url, ...(Array.isArray(d?.dominios) ? d.dominios : [])].filter((x): x is string => typeof x === 'string');
        for (const dom of dominios) {
          const completa = dom.includes('://') ? dom : `https://${dom}`;
          const host = hostDe(completa);
          if (!host) continue;
          let prefijo = '/';
          try {
            prefijo = new URL(completa).pathname.replace(/\/+$/, '') || '/';
          } catch {
            /* sin ruta */
          }
          lista.push({ slug, host, prefijo });
        }
      } catch {
        /* yaml roto: ignorar */
      }
    }
  }
  // Prefijos mas largos primero: /junta-transparencia-etica-publica gana sobre / en gub.uy.
  lista.sort((a, b) => b.prefijo.length - a.prefijo.length);
  mediosCache = lista;
  return lista;
}

/**
 * host (+ prefijo de ruta) -> slug de medio, a partir de content/medios/*.yaml (`url` y opcional `dominios`).
 * El prefijo importa porque gub.uy hospeda un organismo distinto por carpeta
 * (`/presidencia/`, `/junta-transparencia-etica-publica/`, ...).
 */
export function slugDeMedio(url: string): string {
  const host = hostDe(url);
  if (esYoutube(url)) {
    const yt = cargarMedios().find((m) => m.host === 'youtube.com');
    return yt?.slug ?? 'youtube';
  }
  let ruta = '/';
  try {
    ruta = new URL(url.includes('://') ? url : `https://${url}`).pathname || '/';
  } catch {
    /* sin ruta */
  }
  const candidatos = cargarMedios().filter((m) => host === m.host || host.endsWith('.' + m.host));
  // Ya vienen ordenados por prefijo descendente: el primero que coincide es el mas especifico.
  for (const m of candidatos) {
    if (m.prefijo === '/' || ruta === m.prefijo || ruta.startsWith(m.prefijo + '/')) return m.slug;
  }
  return host || 'desconocido';
}

function esPdf(contentType: string, url: string, buffer: Buffer): boolean {
  return contentType.includes('application/pdf') || /\.pdf(\?|$)/i.test(url) || buffer.subarray(0, 5).toString('latin1') === '%PDF-';
}

function rutaNota(id: string): string {
  return join(RUTAS_CORPUS.notas, `${id}.json`);
}

async function notaDesdeVideo(url: string, id: string, canonica: string, verboso: boolean): Promise<Nota> {
  const tr = await transcribir(url, { verboso });
  return {
    id,
    url,
    url_canonica: canonica,
    medio: slugDeMedio(canonica),
    fecha: tr.fecha,
    titulo: tr.titulo,
    autor: tr.canal,
    tipo: 'video',
    texto: tr.texto,
    retrieved_at: new Date().toISOString(),
    archived_url: null,
    text_sha256: sha256(tr.texto),
    etiquetas: etiquetarPorAlias(tr.texto, tr.fecha, undefined, tr.titulo),
    resumen: null,
    transcripcion: tr.id,
  };
}

async function notaDesdeWeb(url: string, id: string, canonica: string): Promise<Nota> {
  const d = await descargar(url);
  let ex: Extraccion;
  let tipo: TipoNota;
  mkdirSync(RUTAS_CORPUS.notas, { recursive: true });
  if (esPdf(d.contentType, d.urlFinal, d.buffer)) {
    tipo = 'pdf';
    ex = await extraerPdf(d.buffer);
    writeFileSync(join(RUTAS_CORPUS.notas, `${id}.pdf`), d.buffer);
  } else if (d.contentType.includes('text/plain')) {
    tipo = 'texto';
    const texto = d.buffer.toString('utf8');
    ex = { titulo: null, autor: null, fecha: null, texto, descripcion: null, medioNombre: null };
    writeFileSync(join(RUTAS_CORPUS.notas, `${id}.txt.gz`), gzipSync(d.buffer));
  } else {
    tipo = 'html';
    const html = decodificarHtml(d.buffer, d.contentType);
    ex = extraerHtml(html, d.urlFinal);
    writeFileSync(join(RUTAS_CORPUS.notas, `${id}.html.gz`), gzipSync(Buffer.from(html, 'utf8')));
  }
  if (!ex.texto || ex.texto.length < 200) {
    log.aviso(
      tipo === 'pdf'
        ? `el PDF no trae capa de texto (${ex.texto.length} chars extraidos): es un escaneo. Necesita OCR o \`verificacion: manual\`.`
        : `texto muy corto (${ex.texto.length} chars): paywall, JS o extractor fallido. Revisar a mano.`,
    );
  }
  return {
    id,
    url,
    url_canonica: canonica,
    medio: slugDeMedio(d.urlFinal !== url ? d.urlFinal : canonica),
    fecha: ex.fecha,
    titulo: ex.titulo,
    autor: ex.autor,
    tipo,
    texto: ex.texto,
    retrieved_at: new Date().toISOString(),
    archived_url: null,
    text_sha256: sha256(ex.texto),
    etiquetas: etiquetarPorAlias(ex.texto, ex.fecha, undefined, ex.titulo),
    resumen: null,
    http_estado: d.estado,
    // Deja constancia de que el texto es OCR y no capa de texto del PDF: una cita sacada
    // de aca puede traer errores de reconocimiento y hay que mirarla contra la imagen.
    ...(ex.ocr ? { extraccion: 'ocr' as const } : {}),
  };
}

/** Decodifica segun charset del header o del <meta>; por defecto utf-8. */
function decodificarHtml(buffer: Buffer, contentType: string): string {
  const cabeza = buffer.subarray(0, 4096).toString('latin1');
  const m = /charset=["']?([\w-]+)/i.exec(contentType) ?? /charset=["']?([\w-]+)/i.exec(cabeza);
  const charset = (m?.[1] ?? 'utf-8').toLowerCase();
  try {
    return new TextDecoder(charset).decode(buffer);
  } catch {
    return buffer.toString('utf8');
  }
}

/**
 * Devuelve la nota del corpus para una URL, bajandola si hace falta.
 * Lanza si no se pudo bajar/extraer (el llamador decide si es `verificacion: manual`).
 */
export async function obtenerNota(url: string, opciones: OpcionesFuente = {}): Promise<ResultadoFuente> {
  asegurarCorpus();
  const canonica = canonicalizar(url);
  const id = idDeUrl(url);
  if (!opciones.forzar) {
    const previa = leerNota(id);
    if (previa) return { nota: previa, nueva: false };
  }

  log.info(`bajando ${canonica}`);
  const nota = esVideo(canonica) ? await notaDesdeVideo(url, id, canonica, opciones.verboso ?? false) : await notaDesdeWeb(url, id, canonica);

  // Si ya existia (forzar), conservamos etiquetas Haiku, resumen y archived_url previos.
  const previa = leerNota(id);
  if (previa) {
    nota.archived_url = previa.archived_url;
    nota.resumen = previa.resumen;
    for (const clave of ['politicos', 'partidos', 'temas', 'eventos'] as const) {
      for (const s of previa.etiquetas[clave]) {
        if (previa.etiquetas.origen[s] !== 'alias' && !nota.etiquetas[clave].includes(s)) {
          nota.etiquetas[clave].push(s);
          nota.etiquetas.origen[s] = previa.etiquetas.origen[s];
        }
      }
    }
    if (previa.text_sha256 !== nota.text_sha256) log.aviso('el texto cambio respecto de la version guardada (posible edicion del medio)');
  }

  let archivo: ResultadoFuente['archivo'];
  if (!opciones.sinArchivo && !nota.archived_url) {
    const r = await archivar(canonica);
    nota.archived_url = r.archived_url;
    archivo = { origen: r.origen, error: r.error };
    if (r.archived_url) log.ok(`Wayback: ${r.archived_url}`);
    else log.aviso(`sin archivo Wayback (${r.error ?? 'sin snapshot'}); no es fatal`);
  }

  guardarNota(nota);
  const indice = abrirIndice();
  try {
    indexarNota(indice, nota);
  } finally {
    indice.cerrar();
  }
  const trabajoHaiku = opciones.sinHaiku ? null : etiquetarConHaiku(nota);
  return { nota, nueva: true, archivo, trabajoHaiku };
}

function resumenNota(r: ResultadoFuente): string {
  const n = r.nota;
  const e = n.etiquetas;
  const lineas = [
    `${r.nueva ? 'NUEVA' : 'EN CORPUS'}  ${n.id}`,
    `url     ${n.url_canonica}`,
    `medio   ${n.medio}   fecha ${n.fecha ?? '?'}   tipo ${n.tipo}`,
    `titulo  ${n.titulo ?? '?'}`,
    `autor   ${n.autor ?? '?'}`,
    `texto   ${n.texto.length} chars · sha256 ${n.text_sha256.slice(0, 12)} · bajada ${n.retrieved_at.slice(0, 16)}`,
    `wayback ${n.archived_url ?? 'ninguno'}`,
    `tags    politicos [${e.politicos.join(', ')}] partidos [${e.partidos.join(', ')}] temas [${e.temas.join(', ')}] eventos [${e.eventos.join(', ')}]`,
  ];
  if (n.resumen) lineas.push(`resumen ${n.resumen}`);
  if (r.trabajoHaiku) lineas.push(`haiku   encolado ${r.trabajoHaiku} (lo corre el worker)`);
  lineas.push(`archivo ${rutaNota(n.id)}`);
  return lineas.join('\n');
}

async function main(): Promise<void> {
  const { posicionales, opciones } = parsearArgs(process.argv.slice(2));
  const url = posicionales[0];
  if (!url || !/^https?:\/\//i.test(url)) {
    process.stderr.write(
      'Uso: pnpm fuente <url> [--buscar "<frase>"] [--ventana <n>] [--maximo <n>]\n' +
        '                       [--completo] [--json] [--forzar] [--sin-archivo] [--sin-haiku] [--solo-meta]\n\n' +
        '  --buscar   devuelve solo las ventanas de texto alrededor de cada coincidencia,\n' +
        '             separadas por palabra clave o frase (separá varias con " | ").\n' +
        '             Es la forma barata de leer: evita volcar la nota entera al contexto.\n' +
        '  --ventana  caracteres de contexto a cada lado de la coincidencia (por defecto 400).\n' +
        '  --maximo   tope de caracteres del texto mostrado (por defecto 6000; 0 = sin tope).\n' +
        '  --completo vuelca el texto entero sin tope. Usalo solo si de verdad lo necesitás.\n',
    );
    process.exit(2);
  }
  const json = opciones.json === true;
  if (json) silenciar();
  let r: ResultadoFuente;
  try {
    r = await obtenerNota(url, { forzar: opciones.forzar === true, sinArchivo: opciones['sin-archivo'] === true, sinHaiku: opciones['sin-haiku'] === true, verboso: !json });
  } catch (e) {
    const err = e as Error;
    const detalle = err instanceof ErrorHttp ? `HTTP ${err.estado}` : err.message;
    log.error(`no se pudo obtener la fuente: ${detalle}`);
    if (json) process.stdout.write(JSON.stringify({ error: detalle, url }) + '\n');
    process.exit(err instanceof ErrorHttp && err.estado >= 500 ? 2 : 1);
  }
  if (json) {
    process.stdout.write(JSON.stringify({ ...r.nota, nueva: r.nueva }, null, 1) + '\n');
    return;
  }
  process.stdout.write(resumenNota(r) + '\n');
  if (opciones['solo-meta']) {
    process.stdout.write(`\n${recortar(r.nota.texto, 300)}\n`);
    return;
  }
  process.stdout.write('\n---\n' + presentarTexto(r.nota, opciones) + '\n');
}

/**
 * Decide cuánto texto de la nota se vuelca a la salida.
 *
 * Por qué existe: cada carácter que sale por acá entra al contexto del agente y se
 * relee en todos sus turnos siguientes. Medido sobre las corridas de setiembre de 2026,
 * la lectura de caché fue el 55 % del costo, empujada por notas completas que quedaban
 * en contexto. Con `--buscar` el agente pide solo lo que necesita.
 */
function presentarTexto(nota: Nota, opciones: Record<string, unknown>): string {
  const texto = nota.texto;
  const frases = typeof opciones.buscar === 'string' ? String(opciones.buscar).split('|').map((f) => f.trim()).filter(Boolean) : [];
  const ventana = Number(opciones.ventana ?? 400);

  if (frases.length > 0) {
    const objetivo = normalizar(texto);
    const trozos: string[] = [];
    for (const frase of frases) {
      const aguja = normalizar(frase);
      if (!aguja) continue;
      let desde = 0;
      let encontradas = 0;
      for (;;) {
        const i = objetivo.indexOf(aguja, desde);
        if (i < 0 || encontradas >= 5) break;
        const ini = Math.max(0, i - ventana);
        const fin = Math.min(texto.length, i + aguja.length + ventana);
        trozos.push(`[${frase} · caracter ${i}]\n${ini > 0 ? '…' : ''}${texto.slice(ini, fin)}${fin < texto.length ? '…' : ''}`);
        desde = i + aguja.length;
        encontradas += 1;
      }
      if (encontradas === 0) trozos.push(`[${frase}] sin coincidencias en esta nota.`);
    }
    return (
      trozos.join('\n\n') +
      `\n\n(${trozos.length} ventana(s) de ${texto.length} caracteres. Texto completo en ${rutaNota(nota.id)}; ` +
      'o volvé a correr con --completo.)'
    );
  }

  if (opciones.completo === true) return texto;

  const tope = Number(opciones.maximo ?? 6000);
  if (tope <= 0 || texto.length <= tope) return texto;
  return (
    texto.slice(0, tope) +
    `\n\n… (recortado: ${texto.length} caracteres en total. Para ver el resto sin volcarlo entero, ` +
    `usá --buscar "<frase>"; para el texto completo, --completo. Archivo: ${rutaNota(nota.id)})`
  );
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    log.error((e as Error).message);
    process.exit(1);
  });
}
