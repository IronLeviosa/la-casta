/**
 * Envoltorio de git con spawn (sin shell). Todas las operaciones del corpus y del worker pasan por aca.
 */
import { spawnSync } from 'node:child_process';
import { buscarEjecutable } from './ejecutable.ts';

// En Windows, spawn sin shell solo encuentra .exe: resolvemos la ruta completa una vez
// (buscarEjecutable respeta PATHEXT). Si no aparece, dejamos 'git' y que falle con su error.
let gitBin: string | null = null;
function ejecutableGit(): string {
  gitBin ??= buscarEjecutable('git') ?? 'git';
  return gitBin;
}

export interface ResultadoGit {
  ok: boolean;
  codigo: number;
  stdout: string;
  stderr: string;
}

export function git(args: string[], cwd: string): ResultadoGit {
  const r = spawnSync(ejecutableGit(), args, { cwd, shell: false, encoding: 'utf8', windowsHide: true });
  return {
    ok: r.status === 0,
    codigo: r.status ?? -1,
    stdout: (r.stdout ?? '').toString().trim(),
    stderr: (r.stderr ?? '').toString().trim(),
  };
}

/**
 * Contenido exacto de un archivo en un commit, sin recortar nada.
 *
 * `git()` hace `.trim()` sobre la salida, que es lo que quiere casi todo el que la llama: nadie
 * quiere el salto de línea final de un `rev-parse`. Pero para hashear el contenido de un archivo
 * ese recorte es fatal: le come el `\n` final y el SHA-256 deja de coincidir con el que guardó
 * `pnpm promover`, que sí hasheó el archivo entero. La verificación de hashes de instrucciones
 * quedaba en rojo permanente por dos bytes.
 *
 * Devuelve el contenido como Buffer para no depender de la codificación al medir el hash.
 */
export function contenidoEnCommit(rootDir: string, commit: string, archivo: string): Buffer | null {
  const r = spawnSync(ejecutableGit(), ['cat-file', '-p', `${commit}:${archivo}`], {
    cwd: rootDir,
    shell: false,
    encoding: 'buffer',
    windowsHide: true,
  });
  return r.status === 0 && r.stdout ? Buffer.from(r.stdout) : null;
}

export function esRepoGit(cwd: string): boolean {
  return git(['rev-parse', '--is-inside-work-tree'], cwd).ok;
}

export function tieneRemoto(cwd: string): boolean {
  const r = git(['remote'], cwd);
  return r.ok && r.stdout.length > 0;
}

export function tieneCommits(cwd: string): boolean {
  return git(['rev-parse', '--verify', 'HEAD'], cwd).ok;
}

export function ramaActual(cwd: string): string {
  const r = git(['rev-parse', '--abbrev-ref', 'HEAD'], cwd);
  return r.ok ? r.stdout : 'main';
}

/** Lista de archivos con cambios (staged o no) segun `git status --porcelain`. */
export function cambios(cwd: string): { ruta: string; estado: string }[] {
  const r = git(['status', '--porcelain', '--untracked-files=all'], cwd);
  if (!r.ok || !r.stdout) return [];
  return r.stdout.split(/\r?\n/).filter(Boolean).map((l) => ({ estado: l.slice(0, 2).trim(), ruta: l.slice(3).trim() }));
}

/** git add -A + commit. Devuelve false si no habia nada que commitear. */
export function commitTodo(cwd: string, mensaje: string): boolean {
  git(['add', '-A'], cwd);
  const r = git(['commit', '-q', '-m', mensaje], cwd);
  return r.ok;
}

/** pull --rebase si hay remoto. Devuelve {ok, mensaje}. */
export function pull(cwd: string): { ok: boolean; mensaje: string } {
  if (!tieneRemoto(cwd)) return { ok: true, mensaje: 'sin remoto' };
  if (!tieneCommits(cwd)) return { ok: true, mensaje: 'sin commits' };
  const r = git(['pull', '--rebase', '--autostash', '-q'], cwd);
  return { ok: r.ok, mensaje: r.ok ? 'ok' : r.stderr || r.stdout };
}

export function push(cwd: string): { ok: boolean; mensaje: string } {
  if (!tieneRemoto(cwd)) return { ok: true, mensaje: 'sin remoto' };
  const rama = ramaActual(cwd);
  const r = git(['push', '-q', '-u', 'origin', rama], cwd);
  return { ok: r.ok, mensaje: r.ok ? 'ok' : r.stderr || r.stdout };
}

/**
 * Busca en el historial un commit donde `archivo` tenga exactamente ese contenido.
 *
 * Sirve para distinguir dos cosas que se ven igual en un audit y no lo son: que las instrucciones
 * de una corrida se hayan commiteado *después* de promover —benigno, el texto existe y cualquiera
 * lo puede leer— y que la versión que recibió el agente no exista en ningún commit, que es un
 * agujero de auditabilidad real y no recuperable.
 *
 * Devuelve el commit donde aparece, o null si ese contenido no está en ninguna parte del historial.
 */
export function commitConContenido(rootDir: string, archivo: string, sha256Esperado: string, hashear: (t: Buffer) => string): string | null {
  const log = git(['log', '--format=%H', '--', archivo], rootDir);
  if (!log.ok) return null;
  for (const commit of log.stdout.split('\n').filter(Boolean)) {
    const blob = contenidoEnCommit(rootDir, commit, archivo);
    if (blob && hashear(blob) === sha256Esperado) return commit;
  }
  return null;
}
