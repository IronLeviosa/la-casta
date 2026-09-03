/**
 * pnpm transcribir <url|archivo> [--modelo large-v3-turbo] [--forzar] [--json]
 *
 * yt-dlp -> wav 16 kHz mono en .cache/audio/<sha1>.wav -> scripts/py/transcribir.py (venv)
 * -> ${CORPUS_DIR}/transcripciones/<sha1>.json
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync, statSync } from 'node:fs';
import { basename, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { asegurarCarpeta, asegurarCorpus, CACHE_AUDIO, RUTAS_CORPUS, SCRIPT_TRANSCRIBIR_PY, VENV_PYTHON } from './lib/rutas.ts';
import { sha1 } from './lib/hash.ts';
import { canonicalizar, esYoutube } from './lib/url.ts';
import { buscarEjecutable, ejecutar } from './lib/ejecutable.ts';
import { log, parsearArgs } from './lib/log.ts';
import { buscarCita, type ResultadoCita } from './lib/texto.ts';
import type { Segmento, Transcripcion } from './corpus/tipos.ts';

export const MODELO_POR_DEFECTO = 'large-v3-turbo';

export interface OpcionesTranscripcion {
  modelo?: string;
  idioma?: string;
  forzar?: boolean;
  /** Muestra el progreso de yt-dlp/Whisper en stderr. */
  verboso?: boolean;
}

function esUrl(s: string): boolean {
  return /^https?:\/\//i.test(s);
}

/** Id estable: sha1 de la URL canonica, o de la ruta absoluta para archivos locales. */
export function idDeFuente(fuente: string): string {
  return esUrl(fuente) ? sha1(canonicalizar(fuente)) : sha1('file:' + resolve(fuente));
}

export function rutaTranscripcion(id: string): string {
  return join(RUTAS_CORPUS.transcripciones, `${id}.json`);
}

export function leerTranscripcion(id: string): Transcripcion | null {
  const ruta = rutaTranscripcion(id);
  return existsSync(ruta) ? (JSON.parse(readFileSync(ruta, 'utf8')) as Transcripcion) : null;
}

interface InfoVideo {
  titulo: string | null;
  canal: string | null;
  fecha: string | null;
  duracion: number | null;
  url: string | null;
}

async function bajarAudio(url: string, id: string, verboso: boolean): Promise<{ wav: string; info: InfoVideo }> {
  const ytdlp = buscarEjecutable('yt-dlp');
  if (!ytdlp) throw new Error('yt-dlp no esta en PATH (corre `pnpm doctor`)');
  asegurarCarpeta(CACHE_AUDIO);
  const wav = join(CACHE_AUDIO, `${id}.wav`);
  const infoRuta = join(CACHE_AUDIO, `${id}.info.json`);
  if (!existsSync(wav) || statSync(wav).size === 0) {
    const base = [
      '--no-playlist',
      '--no-warnings',
      '--extract-audio',
      '--audio-format', 'wav',
      '--postprocessor-args', 'ffmpeg:-ar 16000 -ac 1',
      '--write-info-json',
      '--no-write-playlist-metafiles',
      '--output', join(CACHE_AUDIO, `${id}.%(ext)s`),
    ];
    // YouTube pide un runtime JS para algunos formatos; node esta seguro porque estamos corriendo en el.
    if (buscarEjecutable('node')) base.push('--js-runtimes', 'node');
    if (!verboso) base.push('--quiet', '--no-progress');
    // Argumentos extra del usuario (p. ej. --cookies-from-browser firefox), separados por espacio.
    const extra = (process.env.YTDLP_ARGS ?? '').split(/\s+/).filter(Boolean);

    // YouTube (experimento SABR) devuelve 403 en los formatos DASH del cliente por defecto.
    // Medido en esta maquina con yt-dlp 2026.06.09, sin cookies ni PO token:
    //   default      403 Forbidden
    //   web_embedded OK  -> formato 251 (opus, solo audio, ~1.7 MB para 2:26)  <- el mejor
    //   mweb         OK  -> formato 18 (mp4 progresivo con video, ~11 MB)
    //   android      OK  -> mp4 progresivo (~11 MB)
    //   ios / web_safari  "Requested format is not available"
    //   tv                "The page needs to be reloaded"
    // Como igual pasamos todo a wav 16 kHz mono, alcanza con que el formato traiga audio.
    // Para YouTube probamos primero los clientes que funcionan y dejamos el default al final.
    const estrategias: { nombre: string; args: string[] }[] = [];
    if (esYoutube(url)) {
      estrategias.push(
        { nombre: 'cliente web_embedded, solo audio', args: ['--extractor-args', 'youtube:player_client=web_embedded', '-f', 'bestaudio/best'] },
        { nombre: 'cliente mweb, progresivo', args: ['--extractor-args', 'youtube:player_client=mweb', '-f', 'bestaudio/best[height<=480]/best'] },
        { nombre: 'cliente android', args: ['--extractor-args', 'youtube:player_client=android', '-f', 'bestaudio/best[height<=480]/best'] },
      );
    }
    estrategias.push({ nombre: 'cliente por defecto, bestaudio', args: ['-f', 'bestaudio/best'] });

    log.info(`bajando audio con yt-dlp: ${url}`);
    let ultimo = '';
    for (const e of estrategias) {
      const r = await ejecutar(ytdlp, [...base, ...extra, ...e.args, url], { mostrarStderr: verboso });
      if (r.ok && existsSync(wav) && statSync(wav).size > 0) break;
      ultimo = (r.stderr || r.stdout).trim().split('\n').filter((l) => /ERROR|error/.test(l)).slice(-2).join(' | ') || `codigo ${r.codigo}`;
      log.aviso(`yt-dlp (${e.nombre}) fallo: ${ultimo}`);
    }
    if (!existsSync(wav) || statSync(wav).size === 0) {
      throw new Error(
        `yt-dlp no pudo bajar el audio: ${ultimo}. ` +
          'Opciones, en este orden: (1) probar otro cliente con YTDLP_ARGS="--extractor-args youtube:player_client=tv_simply"; ' +
          '(2) si el video pide sesion, YTDLP_ARGS="--cookies-from-browser firefox" (lo corre una persona, no un agente); ' +
          '(3) actualizar yt-dlp a mano (ningun script actualiza herramientas globales solo). ' +
          'Si nada funciona, la fuente va con `verificacion: manual`.',
      );
    }
  } else {
    log.info('audio ya en cache');
  }
  let info: InfoVideo = { titulo: null, canal: null, fecha: null, duracion: null, url: null };
  if (existsSync(infoRuta)) {
    try {
      const j = JSON.parse(readFileSync(infoRuta, 'utf8')) as Record<string, unknown>;
      const f = typeof j.upload_date === 'string' && /^\d{8}$/.test(j.upload_date) ? `${j.upload_date.slice(0, 4)}-${j.upload_date.slice(4, 6)}-${j.upload_date.slice(6, 8)}` : null;
      info = {
        titulo: (j.title as string) ?? null,
        canal: (j.channel as string) ?? (j.uploader as string) ?? null,
        fecha: f,
        duracion: typeof j.duration === 'number' ? j.duration : null,
        url: (j.webpage_url as string) ?? null,
      };
    } catch {
      /* info.json ilegible: seguimos sin metadatos */
    }
  }
  return { wav, info };
}

/** Convierte un archivo local a wav 16 kHz mono en la cache (si ya es wav lo usa igual, para normalizar). */
async function convertirLocal(archivo: string, id: string, verboso: boolean): Promise<string> {
  const ffmpeg = buscarEjecutable('ffmpeg');
  if (!ffmpeg) throw new Error('ffmpeg no esta en PATH (corre `pnpm doctor`)');
  asegurarCarpeta(CACHE_AUDIO);
  const wav = join(CACHE_AUDIO, `${id}.wav`);
  if (existsSync(wav) && statSync(wav).size > 0) return wav;
  log.info(`convirtiendo ${basename(archivo)} a wav 16 kHz mono`);
  const r = await ejecutar(ffmpeg, ['-y', '-hide_banner', '-loglevel', 'error', '-i', archivo, '-vn', '-ar', '16000', '-ac', '1', '-c:a', 'pcm_s16le', wav], { mostrarStderr: verboso });
  if (!r.ok) throw new Error(`ffmpeg fallo: ${r.stderr.trim().split('\n').slice(-2).join(' | ')}`);
  return wav;
}

interface SalidaPython {
  backend: string;
  modelo: string;
  duracion: number;
  idioma: string;
  segundos_proceso?: number;
  segmentos: Segmento[];
}

async function correrWhisper(wav: string, salidaJson: string, modelo: string, idioma: string, verboso: boolean): Promise<SalidaPython> {
  if (!existsSync(VENV_PYTHON)) {
    throw new Error(`no existe el venv de Python (${VENV_PYTHON}). Crealo con: python3 -m venv .venv && .venv/bin/pip install mlx-whisper faster-whisper (corre \`pnpm doctor\`)`);
  }
  log.info(`transcribiendo con Whisper (${modelo})…`);
  const r = await ejecutar(VENV_PYTHON, [SCRIPT_TRANSCRIBIR_PY, '--audio', wav, '--salida', salidaJson, '--modelo', modelo, '--idioma', idioma], {
    mostrarStderr: verboso,
    env: { ...process.env, PYTHONIOENCODING: 'utf-8', PYTHONUNBUFFERED: '1' },
  });
  if (!r.ok || !existsSync(salidaJson)) {
    throw new Error(`transcribir.py fallo (codigo ${r.codigo}): ${r.stderr.trim().split('\n').slice(-4).join(' | ')}`);
  }
  return JSON.parse(readFileSync(salidaJson, 'utf8')) as SalidaPython;
}

/**
 * Transcribe una URL (yt-dlp) o un archivo local. Reusa `transcripciones/<id>.json` si ya existe.
 */
export async function transcribir(fuente: string, opciones: OpcionesTranscripcion = {}): Promise<Transcripcion> {
  const { modelo = MODELO_POR_DEFECTO, idioma = 'es', forzar = false, verboso = false } = opciones;
  asegurarCorpus();
  const id = idDeFuente(fuente);
  if (!forzar) {
    const previa = leerTranscripcion(id);
    if (previa) {
      log.info(`transcripcion ya en corpus: ${id}`);
      return previa;
    }
  }

  let wav: string;
  let info: InfoVideo = { titulo: null, canal: null, fecha: null, duracion: null, url: null };
  if (esUrl(fuente)) {
    ({ wav, info } = await bajarAudio(fuente, id, verboso));
  } else {
    const abs = resolve(fuente);
    if (!existsSync(abs)) throw new Error(`no existe el archivo ${abs}`);
    wav = await convertirLocal(abs, id, verboso);
    info.titulo = basename(abs, extname(abs));
  }

  const crudo = join(CACHE_AUDIO, `${id}.whisper.json`);
  const t0 = Date.now();
  const salida = await correrWhisper(wav, crudo, modelo, idioma, verboso);
  const segmentos = salida.segmentos.map((s) => ({ inicio: s.inicio, fin: s.fin, texto: s.texto.trim() })).filter((s) => s.texto);

  const transcripcion: Transcripcion = {
    id,
    url: esUrl(fuente) ? fuente : null,
    url_canonica: esUrl(fuente) ? canonicalizar(fuente) : null,
    archivo: esUrl(fuente) ? null : resolve(fuente),
    titulo: info.titulo,
    canal: info.canal,
    fecha: info.fecha,
    duracion: salida.duracion || info.duracion || (segmentos.at(-1)?.fin ?? 0),
    backend: salida.backend,
    modelo: salida.modelo,
    idioma: salida.idioma,
    transcrito_en: new Date().toISOString(),
    segundos_proceso: salida.segundos_proceso ?? Math.round((Date.now() - t0) / 100) / 10,
    segmentos,
    texto: segmentos.map((s) => s.texto).join(' '),
  };
  mkdirSync(RUTAS_CORPUS.transcripciones, { recursive: true });
  writeFileSync(rutaTranscripcion(id), JSON.stringify(transcripcion, null, 1), 'utf8');
  log.ok(`transcripcion guardada: ${rutaTranscripcion(id)}`);
  return transcripcion;
}

/** "1:23", "01:02:03", "83", "83s" -> segundos. */
export function parsearMarcaTiempo(v: string | number | null | undefined): number | null {
  if (v === null || v === undefined || v === '') return null;
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;
  const s = String(v).trim().toLowerCase().replace(/s$/, '');
  if (/^\d+(\.\d+)?$/.test(s)) return Number(s);
  const partes = s.split(':').map(Number);
  if (partes.some((p) => Number.isNaN(p))) return null;
  return partes.reduce((acc, p) => acc * 60 + p, 0);
}

export interface ResultadoCitaTranscripcion {
  encontrada: boolean;
  exacta: boolean;
  similitud: number;
  /** Segundos de inicio y fin del tramo que mejor coincide (-1 si no hay). */
  inicio: number;
  fin: number;
  /** Texto del tramo mas ~15 s de contexto a cada lado (~30 s en total). */
  extracto: string;
  /** Ventana efectiva en la que se busco. */
  ventana: { desde: number; hasta: number };
}

/**
 * Busca una cita dentro de una transcripcion. Si hay `marcaTiempo`, restringe a ±ventanaSeg.
 * Umbral por defecto 0.85 (errores de ASR).
 */
export function buscarCitaEnTranscripcion(
  transcripcion: Transcripcion,
  cita: string,
  marcaTiempo?: string | number | null,
  ventanaSeg = 90,
  umbral = 0.85,
): ResultadoCitaTranscripcion {
  const marca = parsearMarcaTiempo(marcaTiempo);
  const fin = transcripcion.duracion || transcripcion.segmentos.at(-1)?.fin || 0;
  const ventana = marca === null ? { desde: 0, hasta: fin } : { desde: Math.max(0, marca - ventanaSeg), hasta: Math.min(fin, marca + ventanaSeg) };
  const seleccion = transcripcion.segmentos.filter((s) => s.fin >= ventana.desde && s.inicio <= ventana.hasta);
  const vacio: ResultadoCitaTranscripcion = { encontrada: false, exacta: false, similitud: 0, inicio: -1, fin: -1, extracto: '', ventana };
  if (!seleccion.length) return vacio;

  // Unimos los segmentos con un espacio y guardamos el offset de cada uno para mapear posicion -> tiempo.
  const offsets: number[] = [];
  let texto = '';
  for (const s of seleccion) {
    offsets.push(texto.length);
    texto += (texto ? ' ' : '') + s.texto;
  }
  const r: ResultadoCita = buscarCita(texto, cita);
  if (r.posicion < 0) return { ...vacio, similitud: r.similitud };

  const idxDe = (pos: number) => {
    let i = 0;
    while (i + 1 < offsets.length && offsets[i + 1] <= pos) i++;
    return i;
  };
  const iIni = idxDe(r.posicion);
  const iFin = idxDe(Math.max(r.posicion, r.fin - 1));
  const tIni = seleccion[iIni].inicio;
  const tFin = seleccion[iFin].fin;
  const extracto = transcripcion.segmentos
    .filter((s) => s.fin >= tIni - 15 && s.inicio <= tFin + 15)
    .map((s) => s.texto)
    .join(' ');

  return { encontrada: r.similitud >= umbral, exacta: r.exacta, similitud: r.similitud, inicio: tIni, fin: tFin, extracto, ventana };
}

function formatoTiempo(seg: number): string {
  const s = Math.floor(seg);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  return (h ? `${h}:` : '') + `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
}

async function main(): Promise<void> {
  const { posicionales, opciones } = parsearArgs(process.argv.slice(2));
  const fuente = posicionales[0];
  if (!fuente) {
    process.stderr.write('Uso: pnpm transcribir <url|archivo> [--modelo large-v3-turbo] [--idioma es] [--forzar] [--json]\n');
    process.exit(2);
  }
  const json = opciones.json === true;
  const t0 = Date.now();
  const tr = await transcribir(fuente, {
    modelo: typeof opciones.modelo === 'string' ? opciones.modelo : undefined,
    idioma: typeof opciones.idioma === 'string' ? opciones.idioma : undefined,
    forzar: opciones.forzar === true,
    verboso: !json,
  });
  if (json) {
    process.stdout.write(JSON.stringify(tr, null, 1) + '\n');
    return;
  }
  const seg = ((Date.now() - t0) / 1000).toFixed(1);
  process.stdout.write(`\n${tr.titulo ?? tr.url ?? tr.archivo}\n`);
  process.stdout.write(`id ${tr.id} · ${formatoTiempo(tr.duracion)} de audio · ${tr.segmentos.length} segmentos · ${tr.backend} ${tr.modelo} · ${seg} s\n\n`);
  for (const s of tr.segmentos.slice(0, 12)) process.stdout.write(`[${formatoTiempo(s.inicio)}] ${s.texto}\n`);
  if (tr.segmentos.length > 12) process.stdout.write(`… (${tr.segmentos.length - 12} segmentos mas en ${rutaTranscripcion(tr.id)})\n`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    log.error((e as Error).message);
    process.exit(1);
  });
}
