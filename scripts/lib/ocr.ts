/**
 * OCR de PDF escaneados (sin capa de texto) con poppler + Tesseract.
 *
 * Cadena: `pdftoppm -png -r <dpi>` rasteriza cada pagina a PNG en
 * `.cache/ocr/<sha256 del pdf>/`, y `tesseract <png> - -l spa --psm 3`
 * devuelve el texto de esa pagina por stdout. Las paginas se unen con `\f`
 * (separador de pagina de toda la vida), que es lo que despues permite contar
 * paginas y ubicar una cita.
 *
 * El texto queda cacheado en `.cache/ocr/<sha256>.txt`: el mismo PDF no se
 * vuelve a OCRear nunca (es lo caro: ~2 a 6 s por pagina).
 *
 * Los dos ejecutables se buscan con `buscarEjecutable`, que respeta PATHEXT,
 * asi que en Windows encuentra `tesseract.exe` y `pdftoppm.exe` sin cambios.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { cpus } from 'node:os';
import { sha256 } from './hash.ts';
import { CACHE_DIR } from './rutas.ts';
import { buscarEjecutable, ejecutar, ejecutarSync } from './ejecutable.ts';
import { log } from './log.ts';

export const CACHE_OCR = join(CACHE_DIR, 'ocr');

/**
 * Modelos de idioma propios del proyecto. Tesseract busca los `.traineddata` en su carpeta de
 * instalación, que en Windows está en Program Files y no se puede escribir sin permisos; el
 * modelo español (`spa.traineddata`, del repositorio oficial tesseract-ocr/tessdata) vive acá y
 * se le pasa con `--tessdata-dir` cuando el idioma pedido está en esta carpeta.
 */
export const TESSDATA_LOCAL = join(CACHE_DIR, 'tessdata');
const tessdataLocalTiene = (idioma: string): boolean => existsSync(join(TESSDATA_LOCAL, `${idioma}.traineddata`));
/** Argumentos extra para apuntar a la carpeta local cuando el idioma está ahí. */
const argsTessdata = (idioma: string): string[] => (tessdataLocalTiene(idioma) ? ['--tessdata-dir', TESSDATA_LOCAL] : []);

/** Separador de pagina en el texto devuelto (form feed, U+000C). */
export const SEPARADOR_PAGINA = '\f';

const ESWIN = process.platform === 'win32';
const NOMBRE_TESSERACT = ESWIN ? 'tesseract.exe' : 'tesseract';
const NOMBRE_PDFTOPPM = ESWIN ? 'pdftoppm.exe' : 'pdftoppm';

export interface OpcionesOcr {
  /** Idioma de Tesseract (traineddata). Por defecto `spa`. */
  idioma?: string;
  /** Resolucion de rasterizado. 300 es el minimo razonable para 10-12 pt. */
  dpi?: number;
  /** Corta despues de N paginas (para probar rapido un PDF largo). */
  maxPaginas?: number;
  /**
   * Modo de segmentacion de pagina de Tesseract. Por defecto 3 (automatico).
   * Medido sobre la declaracion jurada 2020 de la JUTEP (formulario con tablas):
   * `--psm 3` y `--psm 4` leen "TOTAL ACTIVO $18.738.364,26"; `--psm 6` (bloque
   * uniforme de texto) se come la cifra entera y `--psm 11/12` la leen mal
   * ("13.738.364,26"). En formularios oficiales conviene la segmentacion automatica.
   */
  psm?: number;
  /** Ignora el cache y vuelve a OCRear. */
  forzar?: boolean;
  /** Paginas OCReadas en paralelo. Por defecto la mitad de los nucleos, tope 4. */
  paralelo?: number;
  /** Borra los PNG intermedios al terminar (por defecto si). */
  limpiarPng?: boolean;
}

export interface ResultadoOcr {
  texto: string;
  paginas: number;
  backend: 'tesseract';
  duracionMs: number;
  /** true si el texto vino de `.cache/ocr/<sha>.txt` y no se corrio Tesseract. */
  desdeCache: boolean;
  sha256: string;
}

export interface DisponibilidadOcr {
  ok: boolean;
  tesseract: string | null;
  pdftoppm: string | null;
  /** Idiomas que reporta `tesseract --list-langs`, o null si no se pudo preguntar. */
  idiomas: string[] | null;
}

/** Idiomas instalados de Tesseract (`--list-langs`), o null si el binario no responde. */
export function idiomasTesseract(binario?: string | null): string[] | null {
  const bin = binario ?? buscarEjecutable(NOMBRE_TESSERACT);
  if (!bin) return null;
  const listar = (args: string[]): string[] => {
    const r = ejecutarSync(bin, ['--list-langs', ...args], { timeoutMs: 20_000 });
    return `${r.stdout}\n${r.stderr}`
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l && !/^List of available languages/i.test(l));
  };
  // Los de la instalación más los de la carpeta local del proyecto.
  const lineas = [...new Set([...listar([]), ...(existsSync(TESSDATA_LOCAL) ? listar(['--tessdata-dir', TESSDATA_LOCAL]) : [])])];
  return lineas.length ? lineas : null;
}

/** Estado de las herramientas de OCR en esta maquina (lo usa `pnpm chequeo`). */
export function ocrDisponible(idioma = 'spa'): DisponibilidadOcr {
  const tess = buscarEjecutable(NOMBRE_TESSERACT);
  const ppm = buscarEjecutable(NOMBRE_PDFTOPPM);
  const idiomas = tess ? idiomasTesseract(tess) : null;
  const tieneIdioma = !idiomas || idiomas.includes(idioma);
  return { ok: !!tess && !!ppm && tieneIdioma, tesseract: tess, pdftoppm: ppm, idiomas };
}

/** Comandos de instalacion por sistema, para el mensaje de error y para el doctor. */
export function comoInstalarOcr(): string {
  if (ESWIN) return 'winget install UB-Mannheim.TesseractOCR  +  poppler (winget install oschwartz10612.Poppler o scoop install poppler)';
  if (process.platform === 'darwin') return 'brew install tesseract tesseract-lang poppler';
  return 'sudo apt install tesseract-ocr tesseract-ocr-spa poppler-utils';
}

export class ErrorOcr extends Error {
  constructor(mensaje: string) {
    super(`${mensaje}\n   → instalar: ${comoInstalarOcr()}`);
    this.name = 'ErrorOcr';
  }
}

/** Ordena `pagina-1.png`, `pagina-2.png`, … por numero y no alfabeticamente (10 antes que 2). */
function ordenarPorNumero(archivos: string[]): string[] {
  const numero = (f: string) => Number(/-(\d+)\.[a-z]+$/i.exec(f)?.[1] ?? 0);
  return [...archivos].sort((a, b) => numero(a) - numero(b));
}

/** Corre `tarea` sobre `items` con como mucho `limite` en vuelo; conserva el orden de salida. */
async function enParalelo<T, R>(items: T[], limite: number, tarea: (item: T, indice: number) => Promise<R>): Promise<R[]> {
  const salida = new Array<R>(items.length);
  let siguiente = 0;
  const trabajadores = Array.from({ length: Math.max(1, Math.min(limite, items.length)) }, async () => {
    for (;;) {
      const i = siguiente++;
      if (i >= items.length) return;
      salida[i] = await tarea(items[i], i);
    }
  });
  await Promise.all(trabajadores);
  return salida;
}

/**
 * OCR de un PDF entero. Devuelve el texto con las paginas separadas por `\f`.
 * Lanza `ErrorOcr` si falta tesseract, pdftoppm o el idioma pedido.
 */
export async function ocrPdf(rutaPdf: string, opciones: OpcionesOcr = {}): Promise<ResultadoOcr> {
  const idioma = opciones.idioma ?? 'spa';
  const dpi = opciones.dpi ?? 300;
  const psm = opciones.psm ?? 3;
  const arranque = Date.now();

  if (!existsSync(rutaPdf)) throw new ErrorOcr(`no existe el PDF ${rutaPdf}`);
  const bytes = readFileSync(rutaPdf);
  const sha = sha256(bytes);

  mkdirSync(CACHE_OCR, { recursive: true });
  // El cache guarda el documento entero: una corrida con `maxPaginas` ni lo lee ni lo escribe,
  // para no dejar un texto truncado como si fuera el PDF completo.
  const parcial = !!opciones.maxPaginas && opciones.maxPaginas > 0;
  const cacheTexto = join(CACHE_OCR, `${sha}.txt`);
  if (!opciones.forzar && !parcial && existsSync(cacheTexto)) {
    const texto = readFileSync(cacheTexto, 'utf8');
    return { texto, paginas: texto.split(SEPARADOR_PAGINA).length, backend: 'tesseract', duracionMs: Date.now() - arranque, desdeCache: true, sha256: sha };
  }

  const disponible = ocrDisponible(idioma);
  if (!disponible.pdftoppm) throw new ErrorOcr('falta `pdftoppm` (poppler) para rasterizar el PDF');
  if (!disponible.tesseract) throw new ErrorOcr('falta `tesseract` para hacer OCR');
  if (disponible.idiomas && !disponible.idiomas.includes(idioma)) {
    throw new ErrorOcr(`tesseract no tiene el idioma "${idioma}" (tiene: ${disponible.idiomas.slice(0, 12).join(', ')}…)`);
  }

  const carpeta = join(CACHE_OCR, sha);
  rmSync(carpeta, { recursive: true, force: true });
  mkdirSync(carpeta, { recursive: true });
  const prefijo = join(carpeta, 'pagina');

  const argsPpm = ['-png', '-r', String(dpi)];
  if (opciones.maxPaginas && opciones.maxPaginas > 0) argsPpm.push('-f', '1', '-l', String(opciones.maxPaginas));
  argsPpm.push(rutaPdf, prefijo);
  const rast = await ejecutar(disponible.pdftoppm, argsPpm);
  if (!rast.ok) throw new ErrorOcr(`pdftoppm fallo (codigo ${rast.codigo}): ${rast.stderr.trim().slice(0, 300)}`);

  const pngs = ordenarPorNumero(readdirSync(carpeta).filter((f) => f.toLowerCase().endsWith('.png'))).map((f) => join(carpeta, f));
  if (!pngs.length) throw new ErrorOcr('pdftoppm no genero ninguna imagen (¿PDF cifrado o vacio?)');

  const limite = opciones.paralelo ?? Math.max(1, Math.min(4, Math.floor((cpus().length || 2) / 2)));
  log.info(`OCR ${pngs.length} pagina(s) a ${dpi} dpi con tesseract -l ${idioma} --psm ${psm} (${limite} en paralelo)`);

  const paginas = await enParalelo(pngs, limite, async (png, i) => {
    const r = await ejecutar(disponible.tesseract as string, [png, '-', '-l', idioma, '--psm', String(psm), '-c', 'preserve_interword_spaces=1', ...argsTessdata(idioma)]);
    if (!r.ok) {
      log.aviso(`tesseract fallo en la pagina ${i + 1} (codigo ${r.codigo}): ${r.stderr.trim().slice(0, 200)}`);
      return '';
    }
    return r.stdout.replace(/\r\n/g, '\n').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  });

  const texto = paginas.join(`\n${SEPARADOR_PAGINA}\n`).trim();
  if (!parcial) writeFileSync(cacheTexto, texto, 'utf8');
  if (opciones.limpiarPng !== false) rmSync(carpeta, { recursive: true, force: true });

  return { texto, paginas: pngs.length, backend: 'tesseract', duracionMs: Date.now() - arranque, desdeCache: false, sha256: sha };
}

/**
 * OCR de páginas sueltas (numeradas desde 1) de un PDF, para un documento mixto: solo se
 * rasterizan y se leen las páginas pedidas, con cache por página en `.cache/ocr/<sha>/pN.txt`.
 * Devuelve un mapa página → texto. Un diario de sesiones de 476 páginas con una sola página en
 * blanco no puede disparar el OCR entero (eso tardaba diez minutos y mataba la lectura).
 */
export async function ocrPaginas(rutaPdf: string, numeros: number[], opciones: OpcionesOcr = {}): Promise<Map<number, string>> {
  const idioma = opciones.idioma ?? 'spa';
  const dpi = opciones.dpi ?? 300;
  const psm = opciones.psm ?? 3;
  const salida = new Map<number, string>();
  if (!numeros.length) return salida;
  if (!existsSync(rutaPdf)) throw new ErrorOcr(`no existe el PDF ${rutaPdf}`);
  const sha = sha256(readFileSync(rutaPdf));
  const carpeta = join(CACHE_OCR, sha);
  mkdirSync(carpeta, { recursive: true });

  const pendientes: number[] = [];
  for (const n of numeros) {
    const cache = join(carpeta, `p${n}.txt`);
    if (!opciones.forzar && existsSync(cache)) salida.set(n, readFileSync(cache, 'utf8'));
    else pendientes.push(n);
  }
  if (!pendientes.length) return salida;

  const disponible = ocrDisponible(idioma);
  if (!disponible.pdftoppm) throw new ErrorOcr('falta `pdftoppm` (poppler) para rasterizar el PDF');
  if (!disponible.tesseract) throw new ErrorOcr('falta `tesseract` para hacer OCR');
  if (disponible.idiomas && !disponible.idiomas.includes(idioma)) throw new ErrorOcr(`tesseract no tiene el idioma "${idioma}"`);

  const limite = opciones.paralelo ?? Math.max(1, Math.min(4, Math.floor((cpus().length || 2) / 2)));
  await enParalelo(pendientes, limite, async (n) => {
    const prefijo = join(carpeta, `sola-${n}`);
    const rast = await ejecutar(disponible.pdftoppm as string, ['-png', '-r', String(dpi), '-f', String(n), '-l', String(n), rutaPdf, prefijo]);
    if (!rast.ok) {
      log.aviso(`pdftoppm fallo en la pagina ${n} (codigo ${rast.codigo})`);
      return;
    }
    const png = readdirSync(carpeta).find((f) => f.startsWith(`sola-${n}`) && f.toLowerCase().endsWith('.png'));
    if (!png) return;
    const r = await ejecutar(disponible.tesseract as string, [join(carpeta, png), '-', '-l', idioma, '--psm', String(psm), '-c', 'preserve_interword_spaces=1', ...argsTessdata(idioma)]);
    rmSync(join(carpeta, png), { force: true });
    if (!r.ok) {
      log.aviso(`tesseract fallo en la pagina ${n} (codigo ${r.codigo})`);
      return;
    }
    const texto = r.stdout.replace(/\r\n/g, '\n').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
    writeFileSync(join(carpeta, `p${n}.txt`), texto, 'utf8');
    salida.set(n, texto);
  });
  return salida;
}

/**
 * Heuristica de "PDF escaneado": menos de `minimo` caracteres no blancos por pagina
 * en promedio. Un PDF con capa de texto real da cientos o miles.
 */
export function pareceEscaneado(texto: string, paginas: number, minimo = 50): boolean {
  const utiles = texto.replace(/\s+/g, '').length;
  const n = Math.max(1, paginas);
  return utiles / n < minimo;
}
