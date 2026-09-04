/**
 * pnpm doctor  -> verifica herramientas y dependencias en esta maquina, con el comando de instalacion
 * para el sistema actual (winget / brew / apt) por cada cosa que falte.
 */
import { existsSync } from 'node:fs';
import { CORPUS_DIR, RAIZ, VENV_PYTHON } from './lib/rutas.ts';
import { buscarClaude, buscarEjecutable, ejecutarSync } from './lib/ejecutable.ts';
import { esRepoGit, tieneRemoto } from './lib/git.ts';
import { comoInstalarOcr, ocrDisponible } from './lib/ocr.ts';
import { soportaFts5 } from './corpus/indexar.ts';

type SO = 'win32' | 'darwin' | 'linux';
const so: SO = process.platform === 'win32' ? 'win32' : process.platform === 'darwin' ? 'darwin' : 'linux';

interface Chequeo {
  nombre: string;
  ok: boolean;
  detalle: string;
  arreglo?: string;
  /** false = solo aviso, no falla el doctor */
  critico?: boolean;
}

const instalar = (win: string, mac: string, linux: string) => ({ win32: win, darwin: mac, linux })[so];

function version(ejecutable: string | null, args: string[], timeoutMs = 20_000): string | null {
  if (!ejecutable) return null;
  const r = ejecutarSync(ejecutable, args, { timeoutMs });
  const salida = (r.stdout || r.stderr).trim().split(/\r?\n/)[0].trim();
  return r.ok ? salida : null;
}

/** Detalle de un ejecutable: version si responde, la ruta si esta pero no responde, o el faltante. */
function detalleEjecutable(bin: string | null, v: string | null): string {
  if (!bin) return 'no esta en PATH';
  return v ?? `${bin} (esta, pero no respondio --version a tiempo)`;
}

function chequeos(): Chequeo[] {
  const lista: Chequeo[] = [];

  const nodeMajor = Number(process.versions.node.split('.')[0]);
  lista.push({
    nombre: 'Node >= 24',
    ok: nodeMajor >= 24,
    detalle: `v${process.versions.node}`,
    arreglo: instalar('winget install OpenJS.NodeJS.LTS', 'brew install node', 'usar nvm: nvm install 24 (apt trae versiones viejas)'),
  });

  const pnpm = buscarEjecutable('pnpm');
  lista.push({ nombre: 'pnpm', ok: !!pnpm, detalle: detalleEjecutable(pnpm, version(pnpm, ['--version'])), arreglo: 'corepack enable && corepack prepare pnpm@latest --activate  (o npm i -g pnpm)' });

  const gitBin = buscarEjecutable('git');
  lista.push({ nombre: 'git', ok: !!gitBin, detalle: detalleEjecutable(gitBin, version(gitBin, ['--version'])), arreglo: instalar('winget install Git.Git', 'xcode-select --install  (o brew install git)', 'sudo apt install git') });

  const py = buscarEjecutable('python3') ?? buscarEjecutable('python');
  lista.push({ nombre: 'python3', ok: !!py, detalle: detalleEjecutable(py, version(py, ['--version'])), arreglo: instalar('winget install Python.Python.3.12', 'brew install python', 'sudo apt install python3 python3-venv') });

  const crearVenv = so === 'win32' ? 'python -m venv .venv && .venv\\Scripts\\pip install -U pip faster-whisper' : `python3 -m venv .venv && .venv/bin/pip install -U pip ${so === 'darwin' ? 'mlx-whisper ' : ''}faster-whisper`;
  const venvOk = existsSync(VENV_PYTHON);
  lista.push({ nombre: 'venv Python (.venv)', ok: venvOk, detalle: venvOk ? VENV_PYTHON : 'no existe', arreglo: crearVenv });

  if (venvOk) {
    const mlx = ejecutarSync(VENV_PYTHON, ['-c', 'import mlx_whisper, sys; print(getattr(mlx_whisper, "__version__", "ok"))'], { timeoutMs: 60_000 });
    const fw = ejecutarSync(VENV_PYTHON, ['-c', 'import faster_whisper; print(faster_whisper.__version__)'], { timeoutMs: 60_000 });
    const esMacArm = so === 'darwin' && process.arch === 'arm64';
    if (esMacArm) {
      lista.push({ nombre: 'mlx-whisper (Apple Silicon)', ok: mlx.ok, detalle: mlx.ok ? mlx.stdout.trim() : 'no importa', arreglo: '.venv/bin/pip install mlx-whisper', critico: fw.ok ? false : true });
    }
    lista.push({
      nombre: 'faster-whisper' + (esMacArm ? ' (respaldo)' : ''),
      ok: fw.ok,
      detalle: fw.ok ? fw.stdout.trim() : 'no importa',
      arreglo: `${so === 'win32' ? '.venv\\Scripts\\pip' : '.venv/bin/pip'} install faster-whisper`,
      critico: esMacArm ? !mlx.ok : true,
    });
    if (!esMacArm && fw.ok) {
      const cuda = ejecutarSync(VENV_PYTHON, ['-c', 'import ctranslate2; print(ctranslate2.get_cuda_device_count())'], { timeoutMs: 60_000 });
      const n = Number(cuda.stdout.trim() || 0);
      lista.push({ nombre: 'GPU CUDA para faster-whisper', ok: n > 0, detalle: n > 0 ? `${n} dispositivo(s)` : 'sin CUDA: correra en CPU int8 (lento pero funciona; usar --modelo medium o small)', critico: false, arreglo: 'instalar driver NVIDIA + CUDA 12 y cuDNN 9; ver https://github.com/SYSTRAN/faster-whisper#gpu' });
    }
  }

  const ffmpeg = buscarEjecutable('ffmpeg');
  lista.push({ nombre: 'ffmpeg', ok: !!ffmpeg, detalle: detalleEjecutable(ffmpeg, version(ffmpeg, ['-version'])?.split(' Copyright')[0] ?? null), arreglo: instalar('winget install Gyan.FFmpeg', 'brew install ffmpeg', 'sudo apt install ffmpeg') });

  const ytdlp = buscarEjecutable('yt-dlp');
  // yt-dlp distribuido como binario unico (PyInstaller) tarda ~15 s en el primer arranque en frio.
  lista.push({ nombre: 'yt-dlp', ok: !!ytdlp, detalle: detalleEjecutable(ytdlp, version(ytdlp, ['--version'], 90_000)), arreglo: instalar('winget install yt-dlp.yt-dlp', 'brew install yt-dlp', 'sudo apt install yt-dlp  (o pipx install yt-dlp para tener la ultima)') });
  if (ytdlp) {
    // YouTube pide un runtime JS; node sirve.
    lista.push({ nombre: 'runtime JS para yt-dlp (node)', ok: !!buscarEjecutable('node'), detalle: 'yt-dlp usa --js-runtimes node', critico: false, arreglo: 'node debe estar en PATH' });
  }

  // OCR: PDF escaneados de la JUTEP y de organismos publicos (sin capa de texto).
  const ocr = ocrDisponible('spa');
  const arregloOcr = comoInstalarOcr();
  lista.push({
    nombre: 'tesseract (OCR de PDF)',
    ok: !!ocr.tesseract,
    detalle: detalleEjecutable(ocr.tesseract, version(ocr.tesseract, ['--version'])),
    arreglo: arregloOcr,
    critico: false,
  });
  if (ocr.tesseract) {
    const tieneSpa = !ocr.idiomas || ocr.idiomas.includes('spa');
    lista.push({
      nombre: 'tesseract idioma spa',
      ok: tieneSpa,
      detalle: tieneSpa ? `${(ocr.idiomas ?? []).length} idioma(s) instalados, incluido spa` : `instalados: ${(ocr.idiomas ?? []).join(', ') || 'ninguno'}`,
      arreglo: instalar('winget install UB-Mannheim.TesseractOCR y marcar Spanish en el instalador', 'brew install tesseract-lang', 'sudo apt install tesseract-ocr-spa'),
      critico: false,
    });
  }
  lista.push({
    nombre: 'pdftoppm (poppler)',
    ok: !!ocr.pdftoppm,
    detalle: detalleEjecutable(ocr.pdftoppm, version(ocr.pdftoppm, ['-v'])),
    arreglo: instalar('winget install oschwartz10612.Poppler  (o scoop install poppler)', 'brew install poppler', 'sudo apt install poppler-utils'),
    critico: false,
  });

  const claude = buscarClaude();
  lista.push({ nombre: 'claude (Claude Code CLI)', ok: !!claude, detalle: claude ? `${claude}${version(claude, ['--version']) ? ' · ' + version(claude, ['--version']) : ''}` : 'no encontrado (PATH, CLAUDE_BIN, ni rutas conocidas)', arreglo: instalar('winget install Anthropic.ClaudeCode  (o npm i -g @anthropic-ai/claude-code)', 'brew install --cask claude-code  (o npm i -g @anthropic-ai/claude-code)', 'npm i -g @anthropic-ai/claude-code'), critico: false });

  const corpusExiste = existsSync(CORPUS_DIR);
  const corpusGit = corpusExiste && esRepoGit(CORPUS_DIR);
  lista.push({ nombre: 'CORPUS_DIR', ok: corpusExiste, detalle: corpusExiste ? CORPUS_DIR : `${CORPUS_DIR} no existe`, arreglo: `git clone <repo privado la-casta-corpus> "${CORPUS_DIR}"   (o corre pnpm fuente <url>, que lo inicializa vacio)` });
  if (corpusExiste) {
    lista.push({ nombre: 'CORPUS_DIR es repo git', ok: corpusGit, detalle: corpusGit ? (tieneRemoto(CORPUS_DIR) ? 'con remoto' : 'sin remoto (la cola por git no se comparte hasta agregar uno)') : 'no es repo', arreglo: `cd "${CORPUS_DIR}" && git init && git remote add origin <url privada>` });
  }

  const fts = soportaFts5();
  lista.push({ nombre: 'node:sqlite con FTS5', ok: fts, detalle: fts ? 'FTS5 disponible (BM25)' : 'sin FTS5: busqueda con LIKE', critico: false, arreglo: 'usar el Node oficial (nodejs.org) que trae SQLite con FTS5' });

  return lista;
}

function main(): void {
  const lista = chequeos();
  const color = process.stdout.isTTY && !process.env.NO_COLOR;
  const pinta = (c: string, s: string) => (color ? `\x1b[${c}m${s}\x1b[0m` : s);
  // Ojo: `pnpm doctor` es un comando propio de pnpm; el de este repo es `pnpm chequeo` (o `pnpm run doctor`).
  process.stdout.write(`pnpm chequeo · ${so} ${process.arch} · Node ${process.versions.node} · ${RAIZ}\n\n`);
  let fallas = 0;
  for (const c of lista) {
    const icono = c.ok ? pinta('32', '✔') : c.critico === false ? pinta('33', '⚠') : pinta('31', '✘');
    process.stdout.write(`${icono} ${c.nombre.padEnd(34)} ${c.detalle}\n`);
    if (!c.ok && c.arreglo) process.stdout.write(`    → ${c.arreglo}\n`);
    if (!c.ok && c.critico !== false) fallas++;
  }
  process.stdout.write(fallas ? `\n${fallas} problema(s) que bloquean.\n` : '\nTodo listo.\n');
  process.exit(fallas ? 1 : 0);
}

main();
