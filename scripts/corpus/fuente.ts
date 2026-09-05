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
import { clasificar, pareceSenuelo, registrarLectura } from '../lib/lecturas.ts';
import { extraerHtml, extraerPdf, type Extraccion } from '../lib/extraer.ts';
import { archivar } from '../lib/wayback.ts';
import { log, parsearArgs, silenciar } from '../lib/log.ts';
import { normalizar, normalizarConMapa, posicionesDeAlias, recortar } from '../lib/texto.ts';
import { cargarTaxonomia, etiquetarPorAlias, etiquetarConHaiku, guardarNota, leerNota, type Taxonomia } from './etiquetar.ts';
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
/** Caracteres de reemplazo: la marca de que se decodifico con el charset equivocado. */
function rotos(texto: string): number {
  let n = 0;
  for (const c of texto) if (c === '\uFFFD') n += 1;
  return n;
}

/**
 * Cuenta secuencias de mojibake: texto UTF-8 leido como si fuera de un byte por caracter.
 *
 * Hace falta porque contar solo caracteres de reemplazo no alcanza para elegir la codificacion. Un
 * charset de un byte (latin1, windows-1252) mapea casi cualquier byte a algun caracter, asi que
 * nunca produce reemplazos y siempre puntua cero. Basta un byte invalido en una pagina de 300 KB
 * para que UTF-8 puntue peor que cero y pierda contra una lectura corrupta.
 *
 * Es exactamente lo que paso con el articulo de Wikipedia de un candidato: la pagina se guardo con
 * "Ãlvaro" en vez de "Álvaro", el investigador no pudo citarla y tuvo que reconstruir toda la
 * trayectoria con prensa.
 *
 * Las secuencias que se cuentan son las que produce leer UTF-8 como un byte por caracter: los
 * bytes iniciales C2-C3 y E2 seguidos de un byte de continuacion caen en Ã, Â y â.
 */
function mojibake(texto: string): number {
  return (texto.match(/[ÃÂ][\u0080-\u00bf]|â€[\u0080-\u00bf]|Ã[\u0081\u00a9\u00ad\u00b3\u00ba\u00b1]/g) ?? []).length;
}

/**
 * Decodifica el HTML al texto que realmente escribio el medio.
 *
 * No alcanza con creerle al primer `charset` que aparece. Una nota vieja de El Pais archivada en
 * Wayback trae tres: dos de la envoltura que inyecta el propio Wayback, en utf-8, y el del cuerpo
 * original, en iso-8859-1. Tomando el primero, un cuerpo latin1 se decodifica como utf-8 y todas
 * las vocales acentuadas salen rotas. Eso llego a una cita publicada, y es el tipo de error que el
 * validador de citas no puede atrapar porque la cita rota coincide con el texto rota que guardamos.
 *
 * Por eso se prueban los candidatos y gana el que produce menos caracteres de reemplazo.
 */
export function decodificarHtml(buffer: Buffer, contentType: string): string {
  const cabeza = buffer.subarray(0, 8192).toString('latin1');
  const declarados = [
    /charset=["']?([\w-]+)/i.exec(contentType)?.[1],
    // Todos los charset del head, no solo el primero: la envoltura de un archivo web declara el suyo.
    ...[...cabeza.matchAll(/charset=["']?([\w-]+)/gi)].map((m) => m[1]),
  ]
    .filter((c): c is string => Boolean(c))
    .map((c) => c.toLowerCase());
  // windows-1252 siempre se prueba: es el que usan las notas viejas del Rio de la Plata.
  const candidatos = [...new Set([...declarados, 'utf-8', 'windows-1252'])];

  // Se puntuan todos los candidatos y gana el de menor puntaje; en empate gana el primero, que es
  // el que declaro el propio documento. No se corta al encontrar cero reemplazos: un charset de un
  // byte siempre da cero, asi que salir temprano equivale a elegir siempre el mas permisivo.
  let mejor: { texto: string; puntaje: number } | null = null;
  for (const charset of candidatos) {
    let texto: string;
    try {
      texto = new TextDecoder(charset).decode(buffer);
    } catch {
      continue;
    }
    const puntaje = rotos(texto) + mojibake(texto);
    if (puntaje === 0) return texto;
    if (!mejor || puntaje < mejor.puntaje) mejor = { texto, puntaje };
  }
  return mejor?.texto ?? buffer.toString('utf8');
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
      'Uso: pnpm fuente <url> [--buscar "<frase | otra frase>"] [--ventana <n>] [--maximo <n>] [--desde <n>]\n' +
        '                       [--indice] [--politico <slug>] [--tema <slug>] [--completo]\n' +
        '                       [--json] [--forzar] [--sin-archivo] [--sin-haiku] [--solo-meta]\n\n' +
        '  (sin opciones)  hasta 6000 caracteres; si la nota es mas larga, al final va un indice con cada\n' +
        '                  tramo posterior al corte que menciona a los politicos etiquetados (y al tema si\n' +
        '                  pasas --tema), con posicion y extracto, para leer solo lo que importa.\n' +
        '  --desde n       empieza el texto en el caracter n (se combina con --maximo). Es la forma de leer\n' +
        '                  un tramo del indice.\n' +
        '  --buscar        solo ventanas alrededor de cada coincidencia (250 caracteres a cada lado, hasta 3\n' +
        '                  por frase, fusionadas si se solapan). Agrupa todas las frases de una nota con " | ".\n' +
        '  --indice        solo el mapa de menciones, sin texto. Para documentos muy largos.\n' +
        '  --politico s    indexar las menciones de ese slug (por defecto, los politicos etiquetados en la nota).\n' +
        '  --tema s        indexar tambien los alias de ese tema (slug de content/temas/).\n' +
        '  --ventana n     contexto a cada lado de una coincidencia de --buscar (por defecto 250).\n' +
        '  --maximo n      tope de caracteres del texto mostrado (por defecto 6000; 0 = sin tope).\n' +
        '  --completo      vuelca el texto entero sin tope. Usalo solo si de verdad lo necesitas.\n',
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
    registrarLectura(url, clasificar(err instanceof ErrorHttp ? err.estado : null, err.message), { detalle });
    log.error(`no se pudo obtener la fuente: ${detalle}`);
    if (json) process.stdout.write(JSON.stringify({ error: detalle, url }) + '\n');
    process.exit(err instanceof ErrorHttp && err.estado >= 500 ? 2 : 1);
  }
  // Un 200 no garantiza que hayamos leido la nota: un muro de pago la sirve con el aviso de
  // suscripcion como cuerpo. Eso se anota distinto de `ok`, porque el registro que la cite va a
  // necesitar `verificacion: manual` y hoy nada lo advierte.
  const texto = r.nota.texto ?? '';
  registrarLectura(url, pareceSenuelo(texto) ? 'senuelo' : 'ok', { bytes: texto.length });
  if (json) {
    process.stdout.write(JSON.stringify({ ...r.nota, nueva: r.nueva }, null, 1) + '\n');
    return;
  }
  process.stdout.write(resumenNota(r) + '\n');
  if (opciones['solo-meta']) {
    process.stdout.write(`\n${recortar(r.nota.texto, 300)}\n`);
    return;
  }
  process.stdout.write('\n---\n' + presentarTexto(r.nota, opcionesDePresentacion(opciones)) + '\n');
}

/** Opciones de presentación del texto, ya interpretadas desde la línea de comandos. */
export interface OpcionesPresentacion {
  /** Frases separadas por "|": devuelve solo ventanas alrededor de cada coincidencia. */
  buscar?: string;
  /** Caracteres de contexto a cada lado de una coincidencia. */
  ventana?: number;
  /** Tope total de caracteres de texto mostrado; 0 = sin tope. */
  maximo?: number;
  /** Coincidencias máximas por frase en --buscar. */
  coincidencias?: number;
  /** Volcar el texto entero. */
  completo?: boolean;
  /** Solo el índice de menciones, sin texto. */
  indice?: boolean;
  /** Empezar el texto en este carácter (se combina con `maximo`). */
  desde?: number;
  /** Slug del político cuyas menciones se indexan; por defecto, todos los etiquetados en la nota. */
  politico?: string;
  /** Slug de tema cuyos alias también se indexan. */
  tema?: string;
}

const VENTANA_POR_DEFECTO = 250;
const MAXIMO_POR_DEFECTO = 6000;
const COINCIDENCIAS_POR_FRASE = 3;
/** Menciones a menos de esta distancia se agrupan en una sola entrada del índice. */
const AGRUPAR_MENCIONES_A = 300;
/**
 * Largo máximo de un tramo agrupado. Sin este tope, una nota que menciona al político en cada
 * párrafo colapsa en un solo tramo y el índice deja de orientar: dice "está en todos lados",
 * que es justo lo que el lector ya sabía. Con el tope, esa nota devuelve postes cada 2000
 * caracteres, que sí sirven para saltar.
 */
const LARGO_MAXIMO_TRAMO = 2000;
/**
 * El índice es un mapa, no un resumen: tiene que decir dónde mirar y nada más. Medido sobre una
 * nota de 185k caracteres, con 30 entradas de 150 caracteres ocupaba 5700 caracteres, casi tanto
 * como los 6000 de texto que venía a ahorrar. Con estos valores ocupa unos 1400.
 */
const ENTRADAS_MAXIMAS_INDICE = 14;
/** Caracteres de extracto por entrada: los justos para reconocer de qué habla el tramo. */
const EXTRACTO_INDICE = 70;

export function opcionesDePresentacion(opciones: Record<string, unknown>): OpcionesPresentacion {
  const num = (v: unknown): number | undefined => (v === undefined || v === true || v === false ? undefined : Number(v));
  const str = (v: unknown): string | undefined => (typeof v === 'string' ? v : undefined);
  return {
    buscar: str(opciones.buscar),
    ventana: num(opciones.ventana),
    maximo: num(opciones.maximo),
    coincidencias: num(opciones.coincidencias),
    completo: opciones.completo === true,
    indice: opciones.indice === true,
    desde: num(opciones.desde),
    politico: str(opciones.politico),
    tema: str(opciones.tema),
  };
}

/**
 * Decide cuánto texto de la nota se vuelca a la salida.
 *
 * Por qué existe: cada carácter que sale por acá entra al contexto del agente y se
 * relee en todos sus turnos siguientes. Medido sobre las corridas de setiembre de 2026,
 * la lectura de caché fue el 55 % del costo, empujada por notas completas que quedaban
 * en contexto. El recorte por defecto no es ciego: cuando corta, agrega un índice de las
 * menciones que quedaron después del corte, para que el agente sepa dónde mirar y lea
 * ese tramo con `--desde` o `--buscar` en vez de pedir el documento entero.
 */
export function presentarTexto(nota: Nota, opciones: OpcionesPresentacion, taxonomia: Taxonomia = cargarTaxonomia()): string {
  const texto = nota.texto;
  const tope = opciones.maximo ?? MAXIMO_POR_DEFECTO;
  const ruta = rutaNota(nota.id);

  if (opciones.indice) {
    const indice = indiceDeMenciones(nota, 0, opciones, taxonomia) || 'Sin políticos etiquetados en la nota: pasá --politico <slug>.';
    return `${indice}\n\nPara leer un tramo: --desde <carácter> --maximo <n>, o --buscar "<frase del extracto>". Archivo: ${ruta}`;
  }
  if (opciones.buscar) return ventanasDeBusqueda(texto, opciones.buscar, opciones, ruta);
  if (opciones.completo) return texto;

  const desde = Math.max(0, Math.min(opciones.desde ?? 0, texto.length));
  const encabezado = desde > 0 ? `[desde el carácter ${desde} de ${texto.length}]\n…` : '';
  if (tope <= 0) return encabezado + texto.slice(desde);
  const fin = Math.min(texto.length, desde + tope);
  const cuerpo = encabezado + texto.slice(desde, fin);
  if (fin >= texto.length) return cuerpo;
  const indice = indiceDeMenciones(nota, fin, opciones, taxonomia);
  return (
    cuerpo +
    `\n\n… (recortado en el carácter ${fin} de ${texto.length}. Para seguir: --desde ${fin}; ` +
    `para un tramo puntual: --buscar "<frase>"; para todo: --completo. Archivo: ${ruta})` +
    (indice ? `\n\n${indice}` : '')
  );
}

interface Ventana {
  ini: number;
  fin: number;
  /** Frases que cayeron en esta ventana. */
  frases: string[];
  /** Posición, en el texto original, de la primera coincidencia. */
  posicion: number;
}

/**
 * Ventanas de texto alrededor de cada frase buscada. La búsqueda es sobre el texto
 * normalizado (sin tildes, espacios colapsados), pero el recorte es sobre el original:
 * el mapa de `normalizarConMapa` traduce cada índice. Sin ese mapa, el desfase crece
 * con el largo del documento (medido: 400 caracteres en una nota de 185k).
 */
function ventanasDeBusqueda(texto: string, buscar: string, opciones: OpcionesPresentacion, ruta: string): string {
  const frases = buscar.split('|').map((f) => f.trim()).filter(Boolean);
  const ventana = opciones.ventana ?? VENTANA_POR_DEFECTO;
  const porFrase = opciones.coincidencias ?? COINCIDENCIAS_POR_FRASE;
  const tope = opciones.maximo ?? MAXIMO_POR_DEFECTO;
  const t = normalizarConMapa(texto);

  const ventanas: Ventana[] = [];
  const sinCoincidencia: string[] = [];
  for (const frase of frases) {
    const aguja = normalizar(frase);
    if (!aguja) continue;
    let desde = 0;
    let encontradas = 0;
    while (encontradas < porFrase) {
      const i = t.texto.indexOf(aguja, desde);
      if (i < 0) break;
      const oIni = t.mapa[i];
      const oFin = t.mapa[Math.min(i + aguja.length - 1, t.mapa.length - 1)] + 1;
      ventanas.push({ ini: Math.max(0, oIni - ventana), fin: Math.min(texto.length, oFin + ventana), frases: [frase], posicion: oIni });
      desde = i + aguja.length;
      encontradas += 1;
    }
    if (encontradas === 0) sinCoincidencia.push(frase);
  }

  ventanas.sort((a, b) => a.ini - b.ini);
  const fusionadas: Ventana[] = [];
  for (const v of ventanas) {
    const ultima = fusionadas[fusionadas.length - 1];
    if (ultima && v.ini <= ultima.fin) {
      ultima.fin = Math.max(ultima.fin, v.fin);
      for (const f of v.frases) if (!ultima.frases.includes(f)) ultima.frases.push(f);
    } else {
      fusionadas.push({ ...v, frases: [...v.frases] });
    }
  }

  // Tope total: las ventanas que no entran se omiten (y se dice cuántas). Una sola ventana
  // puede superar el tope cuando las coincidencias se encadenan (una frase frecuente en un
  // documento largo); en ese caso se recorta la ventana, no se vuelca entera.
  const partes: string[] = [];
  let usados = 0;
  let omitidas = 0;
  let recortadas = 0;
  for (const v of fusionadas) {
    let cuerpo = texto.slice(v.ini, v.fin);
    if (tope > 0 && cuerpo.length > tope) {
      cuerpo = cuerpo.slice(0, tope);
      recortadas += 1;
    }
    const trozo = `[${v.frases.join(' | ')} · carácter ${v.posicion}]\n${v.ini > 0 ? '…' : ''}${cuerpo}${v.ini + cuerpo.length < texto.length ? '…' : ''}`;
    if (tope > 0 && partes.length > 0 && usados + trozo.length > tope) {
      omitidas += 1;
      continue;
    }
    partes.push(trozo);
    usados += trozo.length;
  }
  for (const f of sinCoincidencia) partes.push(`[${f}] sin coincidencias en esta nota.`);

  let pie = `(${fusionadas.length - omitidas} ventana(s) de ${texto.length} caracteres`;
  if (omitidas > 0) pie += `; ${omitidas} omitida(s) por el tope de ${tope}: subí --maximo o pedí menos frases`;
  if (recortadas > 0) pie += `; ${recortadas} recortada(s) al tope de ${tope} porque las coincidencias se encadenan: pedí frases más específicas o --desde <carácter>`;
  pie += `. Archivo completo: ${ruta}.)`;
  return `${partes.join('\n\n')}\n\n${pie}`;
}

/**
 * Índice de menciones a partir del carácter `desde`: qué políticos (y tema, si se pidió)
 * aparecen en el resto del documento, dónde y con qué extracto. Es determinista y sin
 * tokens: usa los alias de la taxonomía, igual que el etiquetado. Devuelve '' si no hay
 * a quién indexar.
 */
function indiceDeMenciones(nota: Nota, desde: number, opciones: OpcionesPresentacion, taxonomia: Taxonomia): string {
  const texto = nota.texto;
  const grupos: { etiqueta: string; alias: string[] }[] = [];
  if (opciones.politico) {
    const p = taxonomia.politicos.find((x) => x.slug === opciones.politico);
    grupos.push({ etiqueta: opciones.politico, alias: p ? p.alias : [opciones.politico] });
  } else {
    for (const slug of nota.etiquetas?.politicos ?? []) {
      const p = taxonomia.politicos.find((x) => x.slug === slug);
      if (p) grupos.push({ etiqueta: slug, alias: p.alias });
    }
  }
  if (opciones.tema) {
    const t = taxonomia.temas.find((x) => x.slug === opciones.tema);
    grupos.push({ etiqueta: opciones.tema, alias: t ? t.alias.filter((a) => a !== t.slug) : [opciones.tema] });
  }
  if (grupos.length === 0) return '';

  const menciones: { pos: number; etiqueta: string }[] = [];
  for (const g of grupos) {
    for (const pos of posicionesDeAlias(texto, g.alias)) if (pos >= desde) menciones.push({ pos, etiqueta: g.etiqueta });
  }
  const quienes = grupos.map((g) => g.etiqueta).join(', ');
  if (menciones.length === 0) return `Menciones de [${quienes}] desde el carácter ${desde}: ninguna.`;
  menciones.sort((a, b) => a.pos - b.pos);

  const tramos: { pos: number; etiquetas: string[]; ultima: number }[] = [];
  for (const m of menciones) {
    const t = tramos[tramos.length - 1];
    if (t && m.pos - t.ultima <= AGRUPAR_MENCIONES_A && m.pos - t.pos <= LARGO_MAXIMO_TRAMO) {
      t.ultima = m.pos;
      if (!t.etiquetas.includes(m.etiqueta)) t.etiquetas.push(m.etiqueta);
    } else {
      tramos.push({ pos: m.pos, etiquetas: [m.etiqueta], ultima: m.pos });
    }
  }

  const lineas = [`Menciones de [${quienes}] desde el carácter ${desde}: ${tramos.length} tramo(s), ${menciones.length} mención(es). Leé un tramo con --desde <carácter>.`];
  // Con muchos tramos se reparten a lo largo del documento en vez de amontonarse al principio:
  // un índice de las primeras 14 menciones de 120 no dice nada sobre el resto de la nota.
  const paso = Math.max(1, Math.ceil(tramos.length / ENTRADAS_MAXIMAS_INDICE));
  const mostrados = tramos.filter((_, i) => i % paso === 0).slice(0, ENTRADAS_MAXIMAS_INDICE);
  for (const t of mostrados) {
    const extracto = recortar(texto.slice(Math.max(0, t.pos - 25), t.pos + EXTRACTO_INDICE), EXTRACTO_INDICE);
    lineas.push(`  c. ${String(t.pos).padStart(6)}  [${t.etiquetas.join(', ')}]  …${extracto}…`);
  }
  if (tramos.length > mostrados.length) {
    lineas.push(`  … ${tramos.length - mostrados.length} tramo(s) más, repartidos entre medio (se muestra 1 de cada ${paso}).`);
  }
  return lineas.join('\n');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    log.error((e as Error).message);
    process.exit(1);
  });
}

/** Alias exportado para las pruebas, que no deben depender del nombre interno. */
export { decodificarHtml as decodificarHtmlParaPrueba };
