/**
 * Corridas (data/corridas/<id>/): convención de ids, artefactos obligatorios,
 * hashes de instrucciones (agentes.json). Lo comparten validar, promover y auditar.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { sha256 } from './hash.ts';
import { git } from './git.ts';
import { aPosix } from './contenido.ts';

/** Los siete artefactos de una corrida. `razones.md` solo es obligatorio si `edicion.diff` no está vacío. */
export const ARTEFACTOS = ['brief.md', 'agentes.json', 'consultas.jsonl', 'crudo', 'critica.md', 'edicion.diff', 'razones.md'] as const;

export const PATRON_ID_CORRIDA = /^\d{4}-\d{2}-\d{2}-[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function idCorrida(fecha: string, politico: string, tema: string): string {
  return `${fecha}-${politico}-${tema.replace(/\//g, '-')}`;
}

/**
 * Deriva el id de corrida de una carpeta del inbox: `inbox/<politico>/<tema>/<YYYY-MM-DD>`
 * (el tema puede venir con `-` o como subcarpetas). Devuelve null si no tiene esa forma.
 */
export function idCorridaDesdeInbox(inboxDir: string): string | null {
  const partes = aPosix(path.resolve(inboxDir)).split('/').filter(Boolean);
  const i = partes.lastIndexOf('inbox');
  const resto = i >= 0 ? partes.slice(i + 1) : partes.slice(-3);
  if (resto.length < 3) return null;
  const fecha = resto[resto.length - 1];
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return null;
  const politico = resto[0];
  const tema = resto.slice(1, -1).join('-');
  const id = idCorrida(fecha, politico, tema);
  return PATRON_ID_CORRIDA.test(id) ? id : null;
}

export function carpetaCorrida(rootDir: string, id: string): string {
  return path.join(rootDir, 'data', 'corridas', id);
}

export function listarCorridas(rootDir: string): string[] {
  const base = path.join(rootDir, 'data', 'corridas');
  if (!existsSync(base)) return [];
  return readdirSync(base)
    .filter((n) => PATRON_ID_CORRIDA.test(n) && statSync(path.join(base, n)).isDirectory())
    .sort();
}

export interface EstadoArtefactos {
  existe: boolean;
  faltantes: string[];
  diffVacio: boolean;
}

/** Verifica que la corrida tenga sus artefactos. `razones.md` se exige solo si el diff no es vacío. */
export function verificarArtefactos(corridaDir: string): EstadoArtefactos {
  if (!existsSync(corridaDir)) return { existe: false, faltantes: [...ARTEFACTOS], diffVacio: true };
  const faltantes: string[] = [];
  const diffRuta = path.join(corridaDir, 'edicion.diff');
  const diffVacio = !existsSync(diffRuta) || readFileSync(diffRuta, 'utf8').trim() === '';
  for (const a of ARTEFACTOS) {
    if (a === 'razones.md' && diffVacio) continue;
    const ruta = path.join(corridaDir, a);
    if (!existsSync(ruta)) faltantes.push(a);
    else if (a === 'crudo' && !statSync(ruta).isDirectory()) faltantes.push(a);
  }
  return { existe: true, faltantes, diffVacio };
}

// ---------------------------------------------------------------------------
// agentes.json
// ---------------------------------------------------------------------------

export interface AgentesJson {
  /** Commit HEAD al momento de promover (null si el repo no tiene commits). */
  commit: string | null;
  generado: string;
  /** Ruta relativa → SHA-256 del contenido en ese momento. */
  archivos: Record<string, string>;
  /** Agente → archivo de instrucciones, hash y modelo reportado. */
  agentes: Record<string, { archivo: string; sha256: string; modelo?: string }>;
}

/** Archivos de instrucciones que se hashean: CLAUDE.md, .claude/agents/*.md, .claude/commands/*.md. */
export function archivosDeInstrucciones(rootDir: string): string[] {
  const salida: string[] = [];
  if (existsSync(path.join(rootDir, 'CLAUDE.md'))) salida.push('CLAUDE.md');
  for (const sub of ['agents', 'commands']) {
    const dir = path.join(rootDir, '.claude', sub);
    if (!existsSync(dir)) continue;
    for (const n of readdirSync(dir).sort()) if (n.endsWith('.md')) salida.push(`.claude/${sub}/${n}`);
  }
  return salida;
}

export function hashDeArchivo(ruta: string): string {
  return sha256(readFileSync(ruta));
}

export function hashesDeInstrucciones(rootDir: string): Record<string, string> {
  const salida: Record<string, string> = {};
  for (const rel of archivosDeInstrucciones(rootDir)) salida[rel] = hashDeArchivo(path.join(rootDir, ...rel.split('/')));
  return salida;
}

/** Ruta relativa del archivo de instrucciones de un agente (.claude/agents/<a>.md o .claude/commands/<a>.md), o null. */
export function archivoDeAgente(rootDir: string, agente: string): string | null {
  for (const sub of ['agents', 'commands']) {
    const rel = `.claude/${sub}/${agente}.md`;
    if (existsSync(path.join(rootDir, ...rel.split('/')))) return rel;
  }
  return null;
}

export function commitActual(rootDir: string): string | null {
  const r = git(['rev-parse', 'HEAD'], rootDir);
  return r.ok ? r.stdout : null;
}

export function leerAgentesJson(corridaDir: string): AgentesJson | null {
  const ruta = path.join(corridaDir, 'agentes.json');
  if (!existsSync(ruta)) return null;
  try {
    return JSON.parse(readFileSync(ruta, 'utf8')) as AgentesJson;
  } catch {
    return null;
  }
}

/** SHA-256 de `data/corridas/<id>/brief.md`, o null si no existe. */
export function hashDelBrief(corridaDir: string): string | null {
  const ruta = path.join(corridaDir, 'brief.md');
  return existsSync(ruta) ? hashDeArchivo(ruta) : null;
}
