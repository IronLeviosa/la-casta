/**
 * Busqueda de ejecutables en PATH (con PATHEXT en Windows) y spawn sin shell.
 */
import { existsSync, readdirSync, statSync } from 'node:fs';
import { delimiter, join } from 'node:path';
import { homedir } from 'node:os';
import { spawn, spawnSync, type SpawnOptions } from 'node:child_process';

const ESWIN = process.platform === 'win32';

/** Devuelve la ruta completa de un ejecutable en PATH, o null. */
export function buscarEjecutable(nombre: string): string | null {
  if (nombre.includes('/') || nombre.includes('\\')) return existsSync(nombre) ? nombre : null;
  const extensiones = ESWIN ? (process.env.PATHEXT ?? '.EXE;.CMD;.BAT;.COM').split(';') : [''];
  for (const dir of (process.env.PATH ?? '').split(delimiter)) {
    if (!dir) continue;
    for (const ext of extensiones) {
      const candidato = join(dir, nombre + (ESWIN && nombre.toLowerCase().endsWith(ext.toLowerCase()) ? '' : ext));
      try {
        if (existsSync(candidato) && statSync(candidato).isFile()) return candidato;
      } catch {
        /* sin permiso: seguir */
      }
    }
  }
  return null;
}

/**
 * Ubica el CLI de Claude Code: env CLAUDE_BIN, PATH, y despues las rutas conocidas
 * de la app de escritorio (macOS) o de npm global.
 */
export function buscarClaude(): string | null {
  const env = process.env.CLAUDE_BIN;
  if (env && existsSync(env)) return env;
  const enPath = buscarEjecutable('claude');
  if (enPath) return enPath;
  const home = homedir();
  const candidatos: string[] = [join(home, '.claude', 'local', 'claude'), join(home, '.claude', 'local', 'node_modules', '.bin', 'claude')];
  if (process.platform === 'darwin') {
    const base = join(home, 'Library', 'Application Support', 'Claude', 'claude-code');
    if (existsSync(base)) {
      const versiones = readdirSync(base).filter((v) => /^\d+\.\d+/.test(v)).sort(compararVersiones).reverse();
      for (const v of versiones) candidatos.push(join(base, v, 'claude.app', 'Contents', 'MacOS', 'claude'));
    }
  } else if (ESWIN) {
    const local = process.env.LOCALAPPDATA ?? join(home, 'AppData', 'Local');
    const roaming = process.env.APPDATA ?? join(home, 'AppData', 'Roaming');
    candidatos.push(join(roaming, 'npm', 'claude.cmd'), join(local, 'Programs', 'claude', 'claude.exe'), join(local, 'AnthropicClaude', 'claude.exe'));
    const base = join(roaming, 'Claude', 'claude-code');
    if (existsSync(base)) {
      for (const v of readdirSync(base).sort(compararVersiones).reverse()) candidatos.push(join(base, v, 'claude.exe'));
    }
  } else {
    candidatos.push(join(home, '.local', 'bin', 'claude'), '/usr/local/bin/claude');
  }
  for (const c of candidatos) if (existsSync(c)) return c;
  return null;
}

function compararVersiones(a: string, b: string): number {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (d) return d;
  }
  return 0;
}

/** En Windows, los .cmd/.bat solo corren via cmd.exe; lo envolvemos sin usar shell:true. */
function prepararComando(ejecutable: string, args: string[]): [string, string[]] {
  if (ESWIN && /\.(cmd|bat)$/i.test(ejecutable)) {
    return [process.env.ComSpec ?? 'cmd.exe', ['/d', '/s', '/c', `"${ejecutable}" ${args.map(escaparCmd).join(' ')}`]];
  }
  return [ejecutable, args];
}

function escaparCmd(a: string): string {
  return /[\s"&|<>^]/.test(a) ? `"${a.replace(/"/g, '\\"')}"` : a;
}

export interface ResultadoEjecucion {
  ok: boolean;
  codigo: number;
  stdout: string;
  stderr: string;
}

export function ejecutarSync(ejecutable: string, args: string[], opciones: { cwd?: string; entrada?: string; timeoutMs?: number; env?: NodeJS.ProcessEnv } = {}): ResultadoEjecucion {
  const [cmd, argumentos] = prepararComando(ejecutable, args);
  const r = spawnSync(cmd, argumentos, {
    cwd: opciones.cwd,
    input: opciones.entrada,
    timeout: opciones.timeoutMs,
    shell: false,
    encoding: 'utf8',
    windowsHide: true,
    maxBuffer: 64 * 1024 * 1024,
    env: opciones.env ?? process.env,
  });
  return { ok: r.status === 0, codigo: r.status ?? -1, stdout: (r.stdout ?? '').toString(), stderr: (r.stderr ?? '').toString() };
}

/** Ejecuta mostrando stderr en vivo (progreso de yt-dlp, Whisper) y devuelve stdout completo. */
export function ejecutar(ejecutable: string, args: string[], opciones: { cwd?: string; mostrarStderr?: boolean; env?: NodeJS.ProcessEnv; spawn?: SpawnOptions } = {}): Promise<ResultadoEjecucion> {
  const [cmd, argumentos] = prepararComando(ejecutable, args);
  return new Promise((resolver) => {
    const hijo = spawn(cmd, argumentos, { cwd: opciones.cwd, shell: false, windowsHide: true, env: opciones.env ?? process.env, stdio: ['ignore', 'pipe', 'pipe'], ...opciones.spawn });
    let stdout = '';
    let stderr = '';
    hijo.stdout?.on('data', (d) => (stdout += d.toString()));
    hijo.stderr?.on('data', (d) => {
      const s = d.toString();
      stderr += s;
      if (opciones.mostrarStderr) process.stderr.write(s);
    });
    hijo.on('error', (e) => resolver({ ok: false, codigo: -1, stdout, stderr: stderr + '\n' + e.message }));
    hijo.on('close', (codigo) => resolver({ ok: codigo === 0, codigo: codigo ?? -1, stdout, stderr }));
  });
}
