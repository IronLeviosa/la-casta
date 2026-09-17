/**
 * Etapa 5 (--red): la `cita` de cada fuente aparece en el texto de la fuente.
 *
 * - El texto se obtiene con el corpus (`pnpm fuente`): así toda nota leída queda
 *   guardada una sola vez y el validador reusa lo mismo que leyó el investigador.
 * - Notas y documentos: `buscarCita` sobre texto normalizado. Exacta ⇒ ok;
 *   similitud ≥ 0.90 ⇒ aviso "cita aproximada"; menor ⇒ error.
 * - Video: se transcribe y se busca en una ventana de ±90 s alrededor de
 *   `marca_tiempo`, con umbral 0.85 (errores de ASR).
 * - Fuente no descargable (403, paywall, redes, video sin descarga) ⇒ se exige
 *   `verificacion: manual`; si no la tiene, es error.
 * - Las fuentes ya marcadas `verificacion: manual` no se descargan.
 *
 * El resultado de cada (url, cita, marca_tiempo) se cachea en `.cache/citas.json`
 * para no volver a bajar y transcribir en cada corrida.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { buscarCita } from '../lib/texto.ts';
import { sha256 } from '../lib/hash.ts';
import { esVideo } from '../lib/url.ts';
import { recorrerFuentes, type Contenido, type FuenteMinima } from '../lib/contenido.ts';
import { resultadoVacio, type ResultadoEtapa } from './tipos.ts';

/** Umbral de similitud para "cita aproximada" en texto escrito. */
export const UMBRAL_NOTA = 0.9;
/** Umbral en transcripciones (los errores de ASR bajan la similitud). */
export const UMBRAL_TRANSCRIPCION = 0.85;
/** Ventana alrededor de marca_tiempo, en segundos. */
export const VENTANA_SEGUNDOS = 90;

/** Texto de una fuente, tal como lo devuelve el corpus. */
export interface TextoFuente {
  /** Texto plano de la nota o documento (o de la transcripción, si es video). */
  texto: string;
  /** Id de la transcripción en el corpus, si la fuente es video. */
  transcripcion?: string | null;
  tipo?: string;
  /**
   * true si el HTML de la nota parece un armazón de JavaScript (`Nota.armazon_js`,
   * scripts/corpus/fuente.ts). Solo cambia el mensaje de un "cita no encontrada" (la explica);
   * no cambia el umbral de similitud ni evita que una cita que sí aparece pase.
   */
  armazonJs?: boolean;
  /** "texto extraído de N caracteres, M scripts", para ese mensaje. */
  armazonJsDetalle?: string;
}

/** Obtiene el texto de una fuente. Debe lanzar si no se puede descargar. */
export type ObtenerTexto = (fuente: FuenteMinima) => Promise<TextoFuente>;

/** Devuelve la transcripción guardada (segmentos con marcas de tiempo) o null. */
export type ObtenerTranscripcion = (id: string) => Promise<TranscripcionMinima | null> | TranscripcionMinima | null;

export interface SegmentoMinimo {
  inicio: number;
  fin: number;
  texto: string;
}

export interface TranscripcionMinima {
  duracion: number;
  segmentos: SegmentoMinimo[];
  texto: string;
}

export interface OpcionesCitas {
  /** Carpeta de caché (por defecto `<root>/.cache`). */
  cacheDir?: string;
  /** No usar ni escribir la caché. */
  sinCache?: boolean;
  modoInbox?: boolean;
  /** Inyectable en tests; por defecto usa el corpus (`scripts/corpus/fuente.ts`). */
  obtenerTexto?: ObtenerTexto;
  /** Inyectable en tests; por defecto lee `<CORPUS_DIR>/transcripciones/<id>.json`. */
  obtenerTranscripcion?: ObtenerTranscripcion;
  progreso?: (mensaje: string) => void;
  /** Verificar como mucho N citas (diagnóstico). */
  limite?: number;
}

export interface ResultadoCitas extends ResultadoEtapa {
  verificadas: number;
  exactas: number;
  aproximadas: number;
  manuales: number;
  desdeCache: number;
}

// ---------------------------------------------------------------------------
// Caché
// ---------------------------------------------------------------------------

export type EstadoCita = 'exacta' | 'aproximada' | 'no_encontrada' | 'no_descargable';

export interface EntradaCache {
  estado: EstadoCita;
  similitud: number;
  extracto?: string;
  detalle?: string;
  fecha: string;
  /** Solo con estado 'no_encontrada': la fuente parece un armazón de JavaScript. Cambia el
   *  mensaje de error de `validarCitas`, no la clasificación. */
  armazonJs?: boolean;
  armazonJsDetalle?: string;
}

type Cache = Record<string, EntradaCache>;

export function claveDeCita(fuente: FuenteMinima): string {
  return sha256(`${fuente.url} ${fuente.cita} ${fuente.marca_tiempo ?? ''}`);
}

function leerCache(ruta: string): Cache {
  if (!existsSync(ruta)) return {};
  try {
    const datos = JSON.parse(readFileSync(ruta, 'utf8'));
    return datos && typeof datos === 'object' && !Array.isArray(datos) ? (datos as Cache) : {};
  } catch {
    return {};
  }
}

function escribirCache(ruta: string, cache: Cache): void {
  try {
    mkdirSync(path.dirname(ruta), { recursive: true });
    const claves = Object.keys(cache).sort();
    const cuerpo = claves.map((k) => `  ${JSON.stringify(k)}: ${JSON.stringify(cache[k])}`).join(',\n');
    writeFileSync(ruta, claves.length ? `{\n${cuerpo}\n}\n` : '{}\n', 'utf8');
  } catch {
    /* la caché es una optimización: si no se puede escribir, seguimos */
  }
}

// ---------------------------------------------------------------------------
// Implementación real: corpus + transcripciones
// ---------------------------------------------------------------------------

/** Obtiene el texto con `pnpm fuente` (corpus privado). Import perezoso: sin --red no se carga. */
export const obtenerTextoDelCorpus: ObtenerTexto = async (fuente) => {
  const { obtenerNota } = await import('../corpus/fuente.ts');
  const { nota } = await obtenerNota(fuente.url, { sinHaiku: true });
  return {
    texto: nota.texto ?? '',
    transcripcion: nota.transcripcion ?? null,
    tipo: nota.tipo,
    armazonJs: nota.armazon_js === true,
    armazonJsDetalle: nota.armazon_js_detalle,
  };
};

export const obtenerTranscripcionDelCorpus: ObtenerTranscripcion = async (id) => {
  const { leerTranscripcion } = await import('../transcribir.ts');
  return leerTranscripcion(id);
};

/** Busca la cita en una transcripción, restringida a ±ventana alrededor de la marca. */
async function buscarEnTranscripcion(
  transcripcion: TranscripcionMinima,
  cita: string,
  marca: string | undefined,
): Promise<{ similitud: number; exacta: boolean; extracto: string }> {
  const { buscarCitaEnTranscripcion } = await import('../transcribir.ts');
  const r = buscarCitaEnTranscripcion(
    transcripcion as unknown as Parameters<typeof buscarCitaEnTranscripcion>[0],
    cita,
    marca ?? null,
    VENTANA_SEGUNDOS,
    UMBRAL_TRANSCRIPCION,
  );
  return { similitud: r.similitud, exacta: r.exacta, extracto: r.extracto };
}

// ---------------------------------------------------------------------------

interface UsoFuente {
  archivo: string;
  campo: string;
  publicado: boolean;
}

/** true si el error de descarga indica "no se puede bajar" (paywall, 403, video protegido). */
function esNoDescargable(e: unknown): boolean {
  const m = String((e as Error)?.message ?? e);
  return /HTTP (401|402|403|404|410|429|451)|paywall|yt-dlp|no se pudo|sin acceso|Sign in|forbidden/i.test(m);
}

export async function validarCitas(contenido: Contenido, opciones: OpcionesCitas = {}): Promise<ResultadoCitas> {
  const r = resultadoVacio();
  const modoInbox = opciones.modoInbox === true;
  const cacheDir = opciones.cacheDir ?? path.join(contenido.rootDir, '.cache');
  const rutaCache = path.join(cacheDir, 'citas.json');
  const cache = opciones.sinCache ? {} : leerCache(rutaCache);
  const obtenerTexto = opciones.obtenerTexto ?? obtenerTextoDelCorpus;
  const obtenerTranscripcion = opciones.obtenerTranscripcion ?? obtenerTranscripcionDelCorpus;
  const progreso = opciones.progreso ?? (() => {});

  // Una entrada por (url + cita + marca): la misma cita en dos registros se verifica una vez.
  const pendientes = new Map<string, { fuente: FuenteMinima; usos: UsoFuente[] }>();
  let manuales = 0;
  for (const reg of contenido.registros) {
    if (modoInbox && !reg.enInbox) continue;
    const publicado = reg.datos.revision?.tier === 'publicado';
    recorrerFuentes(reg.datos, (f, ruta) => {
      if (f.verificacion === 'manual') {
        manuales++;
        return;
      }
      const clave = claveDeCita(f);
      if (!pendientes.has(clave)) pendientes.set(clave, { fuente: f, usos: [] });
      pendientes.get(clave)!.usos.push({ archivo: reg.archivo, campo: `${ruta}.cita`, publicado });
    });
  }

  let claves = [...pendientes.keys()].sort();
  if (opciones.limite !== undefined) claves = claves.slice(0, opciones.limite);

  let exactas = 0;
  let aproximadas = 0;
  let desdeCache = 0;
  let hechas = 0;

  for (const clave of claves) {
    const { fuente, usos } = pendientes.get(clave)!;
    let entrada = opciones.sinCache ? undefined : cache[clave];
    if (entrada) desdeCache++;

    if (!entrada) {
      entrada = await verificarUna(fuente, obtenerTexto, obtenerTranscripcion);
      cache[clave] = entrada;
    }
    hechas++;
    progreso(`[${hechas}/${claves.length}] ${entrada.estado} (${entrada.similitud.toFixed(2)}) ${fuente.url}`);

    if (entrada.estado === 'exacta') {
      exactas++;
      continue;
    }
    if (entrada.estado === 'aproximada') {
      aproximadas++;
      // Un documento oficial o un diario de sesiones es texto fijo: la cita literal siempre se
      // puede copiar, así que en un registro publicado «aproximada» es error, no aviso. Un
      // crítico encontró citas de balances con fechas reescritas («al 31/12/17» por «al 31 de
      // diciembre de 2017») que pasaban como avisos; la prensa (que cambia) y las
      // transcripciones (que tienen ruido) siguen con aviso.
      const textoFijo = fuente.tipo === 'documento_oficial' || fuente.tipo === 'diario_de_sesiones';
      for (const uso of usos) {
        const mensaje = `Cita aproximada (similitud ${entrada.similitud.toFixed(2)}): el texto de la fuente dice "${recorte(entrada.extracto ?? '')}". Revisala y copiala literal.`;
        if (textoFijo && uso.publicado) {
          r.errores.push({ archivo: uso.archivo, campo: uso.campo, mensaje: `${mensaje} En un documento oficial publicado la cita tiene que ser exacta.` });
        } else {
          r.avisos.push({ archivo: uso.archivo, campo: uso.campo, mensaje });
        }
      }
      continue;
    }
    if (entrada.estado === 'no_descargable') {
      // Sin descarga posible: se exige verificacion: manual (que además pide aprobación humana).
      for (const uso of usos) {
        r.errores.push({
          archivo: uso.archivo,
          campo: uso.campo.replace(/\.cita$/, '.verificacion'),
          mensaje: `No se pudo descargar la fuente (${entrada.detalle ?? 'sin detalle'}): ${fuente.url}. Si es TV sin descarga, red social o paywall, marcá verificacion: manual (requiere aprobación humana); si no, corregí la URL.`,
        });
      }
      continue;
    }
    // El heurístico de armazón JS explica el fallo, no lo crea: solo cambia el mensaje cuando
    // `buscarCita` ya dijo que la cita no está.
    const mensaje = entrada.armazonJs
      ? `Cita no encontrada; la página parece armarse con JavaScript (${entrada.armazonJsDetalle ?? 'sin detalle'}): ${fuente.url}. Buscá el endpoint de datos del sitio o la versión archivada en Wayback.`
      : `Cita no encontrada en la fuente (similitud ${entrada.similitud.toFixed(2)}, umbral ${fuente.tipo === 'video' ? UMBRAL_TRANSCRIPCION : UMBRAL_NOTA}): ${fuente.url}. Lo más parecido que hay es "${recorte(entrada.extracto ?? '')}".`;
    for (const uso of usos) {
      r.errores.push({ archivo: uso.archivo, campo: uso.campo, mensaje });
    }
  }

  if (!opciones.sinCache) escribirCache(rutaCache, cache);

  return { ...r, verificadas: claves.length, exactas, aproximadas, manuales, desdeCache };
}

export function recorte(texto: string, n = 140): string {
  const limpio = texto.replace(/\s+/g, ' ').trim();
  if (!limpio) return '(vacío)';
  return limpio.length <= n ? limpio : limpio.slice(0, n - 1) + '…';
}

/**
 * Cotejo de una sola fuente contra el texto que devuelva `obtenerTexto` (y, si es video,
 * `obtenerTranscripcion`). Es el mismo cotejo que usa `validarCitas` (etapa `citas`, `--red`).
 * Exportada, sin cambiar su comportamiento, para que otros scripts lo reusen en vez de
 * reimplementar los umbrales y la búsqueda en transcripciones (`pnpm reverificar`,
 * docs/plan-2026-09.md ítem 2.2).
 */
export async function verificarUna(fuente: FuenteMinima, obtenerTexto: ObtenerTexto, obtenerTranscripcion: ObtenerTranscripcion): Promise<EntradaCache> {
  const fecha = new Date().toISOString();
  let texto: TextoFuente;
  try {
    texto = await obtenerTexto(fuente);
  } catch (e) {
    const detalle = (e as Error).message;
    if (esNoDescargable(e) || fuente.tipo === 'video' || fuente.tipo === 'redes' || esVideo(fuente.url)) {
      return { estado: 'no_descargable', similitud: 0, detalle, fecha };
    }
    return { estado: 'no_descargable', similitud: 0, detalle, fecha };
  }

  const esUnVideo = fuente.tipo === 'video' || texto.tipo === 'video' || esVideo(fuente.url);
  if (esUnVideo) {
    const idTranscripcion = texto.transcripcion ?? null;
    const transcripcion = idTranscripcion ? await obtenerTranscripcion(idTranscripcion) : null;
    if (transcripcion) {
      const t = await buscarEnTranscripcion(transcripcion, fuente.cita, fuente.marca_tiempo);
      if (t.exacta) return { estado: 'exacta', similitud: 1, extracto: t.extracto, fecha };
      if (t.similitud >= UMBRAL_TRANSCRIPCION) return { estado: 'aproximada', similitud: t.similitud, extracto: t.extracto, fecha };
      return { estado: 'no_encontrada', similitud: t.similitud, extracto: t.extracto, fecha };
    }
    // Sin transcripción: probamos sobre el texto plano que haya devuelto el corpus.
    if (!texto.texto) return { estado: 'no_descargable', similitud: 0, detalle: 'el video no se pudo transcribir', fecha };
    const r = buscarCita(texto.texto, fuente.cita);
    if (r.exacta) return { estado: 'exacta', similitud: 1, extracto: r.extracto, fecha };
    if (r.similitud >= UMBRAL_TRANSCRIPCION) return { estado: 'aproximada', similitud: r.similitud, extracto: r.extracto, fecha };
    return { estado: 'no_encontrada', similitud: r.similitud, extracto: r.extracto, fecha };
  }

  if (!texto.texto || !texto.texto.trim()) {
    return { estado: 'no_descargable', similitud: 0, detalle: 'la fuente no devolvió texto (paywall o página vacía)', fecha };
  }
  const r = buscarCita(texto.texto, fuente.cita);
  if (r.exacta) return { estado: 'exacta', similitud: 1, extracto: r.extracto, fecha };
  if (r.similitud >= UMBRAL_NOTA) return { estado: 'aproximada', similitud: r.similitud, extracto: r.extracto, fecha };
  // La cita de verdad no aparece: si además la página parecía un armazón de JavaScript, se lleva
  // la marca para que el mensaje de más arriba lo explique (no lo reemplaza: sigue siendo un
  // "no encontrada", solo dice por qué es plausible que la fuente no la tenga).
  return { estado: 'no_encontrada', similitud: r.similitud, extracto: r.extracto, fecha, armazonJs: texto.armazonJs, armazonJsDetalle: texto.armazonJsDetalle };
}
