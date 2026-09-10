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
import { closeSync, existsSync, mkdirSync, openSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { cpus } from 'node:os';
import { spawn, type ChildProcess } from 'node:child_process';
import { sha256 } from './hash.ts';
import { CACHE_DIR, RAIZ } from './rutas.ts';
import { buscarEjecutable, ejecutar, ejecutarSync, prepararComando } from './ejecutable.ts';
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
  /**
   * Cantidad de paginas del PDF, si el que llama ya la sabe (pdf-parse la da). Con ella el OCR
   * va pagina por pagina con cache en `.cache/ocr/<sha>/pN.txt`: si la lectura se corta por el
   * tope de tiempo de un agente (2 minutos matan a pdftoppm con codigo 143), la siguiente llamada
   * retoma desde la ultima pagina leida en vez de empezar de cero.
   */
  totalPaginas?: number;
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

  const limite = opciones.paralelo ?? Math.max(1, Math.min(4, Math.floor((cpus().length || 2) / 2)));

  // Con la cantidad de paginas conocida, el OCR va pagina por pagina con cache por pagina: una
  // lectura cortada a la mitad no se pierde, y la llamada siguiente sigue desde donde quedo.
  if (!parcial && opciones.totalPaginas && opciones.totalPaginas > 0) {
    const numeros = Array.from({ length: opciones.totalPaginas }, (_, i) => i + 1);
    const yaLeidas = numeros.filter((n) => existsSync(join(CACHE_OCR, sha, `p${n}.txt`))).length;
    log.info(`OCR ${numeros.length} pagina(s) a ${dpi} dpi con tesseract -l ${idioma} --psm ${psm} (${limite} en paralelo${yaLeidas ? `, ${yaLeidas} ya en cache` : ''})`);
    const mapa = await ocrPaginas(rutaPdf, numeros, { ...opciones, paralelo: limite });
    const texto = numeros.map((n) => mapa.get(n) ?? '').join(`\n${SEPARADOR_PAGINA}\n`).trim();
    if (mapa.size === numeros.length) writeFileSync(cacheTexto, texto, 'utf8');
    else log.aviso(`OCR incompleto: ${mapa.size} de ${numeros.length} pagina(s); volver a llamar retoma desde las que faltan`);
    return { texto, paginas: numeros.length, backend: 'tesseract', duracionMs: Date.now() - arranque, desdeCache: false, sha256: sha };
  }

  // Sin cantidad de paginas (o con `maxPaginas`), se rasteriza el documento entero de una vez en
  // una subcarpeta propia, para no pisar el cache por pagina que `ocrPaginas` deja al lado.
  const carpeta = join(CACHE_OCR, sha, 'todo');
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

/** Caracteres no blancos de una página; el mismo umbral que usa `pareceEscaneado`. */
function utilesDePagina(t: string): number {
  return t.replace(/\s+/g, '').length;
}

/**
 * Páginas (numeradas desde 1) de un PDF mixto sin texto útil (menos de `minimo` caracteres no
 * blancos): las que un extractor digital dejó vacías porque esa página en particular es un
 * escaneo. `[]` si `porPagina` no tiene una entrada por página (no se puede decidir). Factorizado
 * para que `textoMixtoPorOcr` (extraer.ts) y el chequeo de OCR en segundo plano usen exactamente
 * el mismo criterio: si difieren, una llamada ve un documento "mixto" y la otra "todo escaneado".
 */
export function paginasSinTexto(porPagina: string[], paginas: number, minimo = 50): number[] {
  const cuerpo = porPagina.length > paginas ? porPagina.slice(0, paginas) : porPagina;
  if (cuerpo.length !== paginas) return [];
  return cuerpo.map((p, i) => (utilesDePagina(p) < minimo ? i + 1 : -1)).filter((i) => i > 0);
}

// ---------------------------------------------------------------------------
// OCR en segundo plano (plan 2026-09, ítem 1.9).
//
// Un escaneo de 35 páginas tarda ~3 minutos y uno de 100, ~8: por encima de los 2 minutos que la
// herramienta Bash de los agentes le da a un proceso antes de matarlo con código 143. La lectura
// por página ya quedaba en caché (arriba), pero el proceso que hacía tesseract era el mismo que
// `pnpm fuente`: si lo mataban a los 2 minutos, tesseract moría con él y el progreso parcial no
// servía porque nadie lo retomaba solo.
//
// La solución: cuando hace falta OCR y no está completo en caché, `pnpm fuente` lanza un proceso
// hijo *desacoplado* (`detached: true` + `unref()`, sin heredar stdio) que sigue vivo aunque el
// padre muera, y va guardando cada página en el mismo caché de siempre. `pnpm fuente` devuelve
// enseguida el progreso con código de salida 3; la llamada siguiente lee el caché donde haya
// quedado, o el texto completo si ya terminó. Un archivo de lock (`<sha>.lock.json`, con pid y
// hora) evita lanzar dos OCR del mismo documento a la vez.
// ---------------------------------------------------------------------------

export interface ProgresoOcr {
  /** sha256 del PDF (clave del caché: `.cache/ocr/<sha>/pN.txt`). */
  sha: string;
  /** Páginas de `numeros` que ya están en caché. */
  listas: number;
  /** Total de páginas que hacen falta para este documento. */
  total: number;
}

/** El PDF necesita OCR, no está completo en caché, y ya se lanzó (o ya había) un proceso en segundo plano. */
export class OcrEnCursoError extends Error {
  constructor(public progreso: ProgresoOcr) {
    super(`OCR en curso: ${progreso.listas} de ${progreso.total} página(s) lista(s)`);
    this.name = 'OcrEnCursoError';
  }
}

/** Segundos estimados por página, para el "volvé a llamar en ~K minutos" (medido: 2 a 6 s/página). */
const SEGUNDOS_POR_PAGINA_ESTIMADO = 5;

/** Mensaje para el modo de una sola URL: progreso y cuánto conviene esperar antes de reintentar. */
export function mensajeOcrEnCurso(p: ProgresoOcr): string {
  const faltan = Math.max(0, p.total - p.listas);
  const minutos = Math.max(1, Math.ceil((faltan * SEGUNDOS_POR_PAGINA_ESTIMADO) / 60));
  return `OCR en curso: ${p.listas} de ${p.total} páginas listas; volvé a llamar en ~${minutos} minuto(s).`;
}

function rutaLockOcr(sha: string): string {
  return join(CACHE_OCR, `${sha}.lock.json`);
}

interface LockOcr {
  pid: number;
  iniciado: string;
}

/** true si un proceso con ese pid sigue vivo. `kill(pid, 0)` no manda ninguna señal, solo pregunta. */
function pidVivo(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch (e) {
    // EPERM: el proceso existe pero no es nuestro para señalizarlo (igual cuenta como vivo).
    return (e as NodeJS.ErrnoException).code === 'EPERM';
  }
}

/**
 * Lock de un OCR en curso para `sha`, si hay uno vivo. Un lock de un proceso que ya murió (se
 * cerró la terminal, se reinició la máquina) no puede bloquear el reintento para siempre: se borra
 * y se trata como si no hubiera lock.
 */
export function ocrEnCurso(sha: string): LockOcr | null {
  const ruta = rutaLockOcr(sha);
  if (!existsSync(ruta)) return null;
  try {
    const lock = JSON.parse(readFileSync(ruta, 'utf8')) as LockOcr;
    if (typeof lock.pid === 'number' && pidVivo(lock.pid)) return lock;
  } catch {
    /* lock corrupto: se trata como huerfano */
  }
  rmSync(ruta, { force: true });
  return null;
}

/** Cuántas de `numeros` ya tienen su `.txt` en el caché por página de `sha`. */
function paginasEnCache(sha: string, numeros: number[]): number {
  return numeros.filter((n) => existsSync(join(CACHE_OCR, sha, `p${n}.txt`))).length;
}

const ESWIN_LOCAL = process.platform === 'win32';
const SCRIPT_TRABAJADOR = join(RAIZ, 'scripts', 'lib', 'ocr-trabajador.ts');

/** `node_modules/.bin/tsx` del propio proyecto; si no está (instalación rara), se busca en PATH. */
function tsxLocal(): string {
  const local = join(RAIZ, 'node_modules', '.bin', ESWIN_LOCAL ? 'tsx.cmd' : 'tsx');
  return existsSync(local) ? local : buscarEjecutable('tsx') ?? 'tsx';
}

/** Inyectable en tests: por defecto, `spawn` de verdad. */
export type SpawnDesacoplado = (cmd: string, args: string[]) => Pick<ChildProcess, 'pid' | 'unref'>;

function spawnReal(cmd: string, args: string[]): Pick<ChildProcess, 'pid' | 'unref'> {
  mkdirSync(CACHE_OCR, { recursive: true });
  // El log del trabajador queda en el caché, no en la consola del padre (que puede haber muerto
  // para cuando el trabajador escribe algo): así queda algo para diagnosticar un OCR que no avanza.
  const logFd = openSync(join(CACHE_OCR, 'trabajador.log'), 'a');
  const hijo = spawn(cmd, args, { detached: true, stdio: ['ignore', logFd, logFd], windowsHide: true, cwd: RAIZ });
  closeSync(logFd);
  return hijo;
}

/**
 * Lanza el OCR de `rutaPdf` (páginas `numeros`) en un proceso hijo desacoplado del padre: sigue
 * vivo aunque el proceso que llamó a `pnpm fuente` termine o lo maten (en Windows y en Linux).
 * Escribe el lock antes de soltar el proceso.
 */
export function lanzarOcrSegundoPlano(rutaPdf: string, sha: string, numeros: number[], spawnFn: SpawnDesacoplado = spawnReal): void {
  const [cmd, args] = prepararComando(tsxLocal(), [SCRIPT_TRABAJADOR, rutaPdf, numeros.join(',')]);
  const hijo = spawnFn(cmd, args);
  hijo.unref();
  if (hijo.pid === undefined) {
    // No se pudo lanzar (tsx no encontrado, permisos): sin pid no hay lock que escribir; la
    // próxima llamada lo vuelve a intentar en vez de quedar bloqueada por un lock fantasma.
    log.aviso('no se pudo lanzar el OCR en segundo plano (sin pid del proceso hijo)');
    return;
  }
  mkdirSync(CACHE_OCR, { recursive: true });
  writeFileSync(rutaLockOcr(sha), JSON.stringify({ pid: hijo.pid, iniciado: new Date().toISOString() } satisfies LockOcr));
}

/**
 * Si `numeros` (las páginas que hacen falta OCRear) no está completo en caché, lanza el OCR en
 * segundo plano (si no hay uno ya en curso para el mismo PDF) y devuelve el progreso. `null` si no
 * hace falta esperar: ya está todo en caché, y el llamador sigue por el camino sincrónico de
 * siempre (que en ese caso es prácticamente instantáneo: solo lee archivos).
 */
export function chequearOcrEnSegundoPlano(buffer: Buffer, numeros: number[], spawnFn?: SpawnDesacoplado): ProgresoOcr | null {
  if (numeros.length === 0) return null;
  const sha = sha256(buffer);
  mkdirSync(CACHE_OCR, { recursive: true });
  const rutaPdf = join(CACHE_OCR, `${sha}.pdf`);
  if (!existsSync(rutaPdf)) writeFileSync(rutaPdf, buffer);
  const listas = paginasEnCache(sha, numeros);
  if (listas === numeros.length) return null;
  if (!ocrEnCurso(sha)) lanzarOcrSegundoPlano(rutaPdf, sha, numeros, spawnFn);
  return { sha, listas, total: numeros.length };
}
