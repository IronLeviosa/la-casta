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
