/**
 * Rutas del proyecto y del corpus privado. Todo con node:path para que
 * funcione igual en Windows, Linux y macOS.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { buscarEjecutable } from './ejecutable.ts';

/** Raíz del repo público (carpeta que contiene package.json). */
export const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

/** Lee `.env` de la raíz sin depender de dotenv. Las variables de entorno reales tienen prioridad. */
export function leerEnv(): Record<string, string> {
  const salida: Record<string, string> = {};
  const archivo = join(RAIZ, '.env');
  if (existsSync(archivo)) {
    for (const linea of readFileSync(archivo, 'utf8').split(/\r?\n/)) {
      const l = linea.trim();
      if (!l || l.startsWith('#')) continue;
      const i = l.indexOf('=');
      if (i < 0) continue;
      const clave = l.slice(0, i).trim();
      let valor = l.slice(i + 1).trim();
      if ((valor.startsWith('"') && valor.endsWith('"')) || (valor.startsWith("'") && valor.endsWith("'"))) {
        valor = valor.slice(1, -1);
      }
      salida[clave] = valor;
    }
  }
  for (const [k, v] of Object.entries(process.env)) if (v !== undefined) salida[k] = v;
  return salida;
}

function expandirHome(p: string): string {
  return p.startsWith('~') ? join(homedir(), p.slice(1)) : p;
}

/** Carpeta del corpus privado (repo aparte). `CORPUS_DIR` en `.env`, o `../la-casta-corpus`. */
export const CORPUS_DIR: string = (() => {
  const v = leerEnv().CORPUS_DIR;
  if (v && v.trim()) {
    const p = expandirHome(v.trim());
    return isAbsolute(p) ? p : resolve(RAIZ, p);
  }
  return resolve(RAIZ, '..', 'la-casta-corpus');
})();

export const RUTAS_CORPUS = {
  raiz: CORPUS_DIR,
  notas: join(CORPUS_DIR, 'notas'),
  pistas: join(CORPUS_DIR, 'pistas'),
  cola: join(CORPUS_DIR, 'cola'),
  transcripciones: join(CORPUS_DIR, 'transcripciones'),
  indice: join(CORPUS_DIR, 'indice.db'),
  propuestasTaxonomia: join(CORPUS_DIR, 'propuestas-taxonomia.yaml'),
} as const;

/** Caché local (gitignored): audio descargado, etc. */
export const CACHE_DIR = join(RAIZ, '.cache');
export const CACHE_AUDIO = join(CACHE_DIR, 'audio');

/** Python del venv del proyecto, según plataforma. */
export const VENV_PYTHON =
  process.platform === 'win32'
    ? join(RAIZ, '.venv', 'Scripts', 'python.exe')
    : join(RAIZ, '.venv', 'bin', 'python');

export const SCRIPT_TRANSCRIBIR_PY = join(RAIZ, 'scripts', 'py', 'transcribir.py');

export const RUTAS_CONTENIDO = {
  politicos: join(RAIZ, 'content', 'politicos'),
  temas: join(RAIZ, 'content', 'temas'),
  eventos: join(RAIZ, 'content', 'eventos'),
  medios: join(RAIZ, 'content', 'medios'),
  alias: join(RAIZ, 'data', 'alias.yaml'),
  agentes: join(RAIZ, '.claude', 'agents'),
} as const;

export function asegurarCarpeta(p: string): string {
  if (!existsSync(p)) mkdirSync(p, { recursive: true });
  return p;
}

const README_CORPUS = `# la-casta-corpus (PRIVADO)

Corpus privado del proyecto La Casta. **No publicar.** Contiene texto completo de
notas de prensa, documentos y transcripciones de terceros, guardados para
verificacion de citas y busqueda offline (ley 9.739 de derechos de autor: el
texto completo no puede ir al repo publico).

Estructura:

- \`notas/<sha1(url canonica)>.json\`: texto extraido + metadatos + etiquetas.
- \`notas/<sha1>.html.gz\`: HTML crudo comprimido, por si cambia el extractor.
- \`transcripciones/<sha1>.json\`: transcripciones Whisper con marcas de tiempo.
- \`pistas/<politico>.yaml\`: pistas cruzadas vistas al investigar a otro.
- \`cola/<timestamp>-<id>.yaml\`: cola de trabajos que corre \`pnpm worker\`.
- \`propuestas-taxonomia.yaml\`: temas/eventos nuevos propuestos por el etiquetador.
- \`indice.db\`: indice SQLite FTS5 (reconstruible con \`pnpm corpus:indexar\`).

Se sincroniza con \`pnpm corpus:sync\` desde el repo publico.
`;

/**
 * Crea la estructura del corpus si falta (carpetas, README, propuestas y `git init`).
 * Devuelve true si tuvo que inicializar algo.
 */
export function asegurarCorpus(): boolean {
  let creado = false;
  if (!existsSync(CORPUS_DIR)) {
    mkdirSync(CORPUS_DIR, { recursive: true });
    creado = true;
  }
  for (const carpeta of [RUTAS_CORPUS.notas, RUTAS_CORPUS.pistas, RUTAS_CORPUS.cola, RUTAS_CORPUS.transcripciones]) {
    if (!existsSync(carpeta)) {
      mkdirSync(carpeta, { recursive: true });
      // .gitkeep para que git conserve la carpeta vacia
      writeFileSync(join(carpeta, '.gitkeep'), '');
      creado = true;
    }
  }
  const readme = join(CORPUS_DIR, 'README.md');
  if (!existsSync(readme)) {
    writeFileSync(readme, README_CORPUS);
    creado = true;
  }
  if (!existsSync(RUTAS_CORPUS.propuestasTaxonomia)) {
    writeFileSync(RUTAS_CORPUS.propuestasTaxonomia, '# Propuestas de temas y eventos nuevos (las revisa el editor)\npropuestas: []\n');
    creado = true;
  }
  const gitignore = join(CORPUS_DIR, '.gitignore');
  if (!existsSync(gitignore)) {
    writeFileSync(gitignore, 'indice.db\nindice.db-*\n.DS_Store\n');
    creado = true;
  }
  if (!existsSync(join(CORPUS_DIR, '.git'))) {
    // spawn sin shell: en Windows hay que dar la ruta completa (PATHEXT), por eso buscarEjecutable.
    const gitBin = buscarEjecutable('git') ?? 'git';
    const r = spawnSync(gitBin, ['init', '-b', 'main'], { cwd: CORPUS_DIR, shell: false, encoding: 'utf8', windowsHide: true });
    if (r.status !== 0) {
      // git viejo sin -b
      spawnSync(gitBin, ['init'], { cwd: CORPUS_DIR, shell: false, encoding: 'utf8', windowsHide: true });
    }
    creado = true;
  }
  return creado;
}
