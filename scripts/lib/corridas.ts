/**
 * Corridas (data/corridas/<id>/): convención de ids, artefactos obligatorios,
 * hashes de instrucciones (agentes.json). Lo comparten validar, promover y auditar.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { sha256 } from './hash.ts';
import { git, tieneCommits } from './git.ts';
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
  /** true si la carpeta solo tiene brief.md: corrida planificada que nunca se ejecutó. */
  soloBrief: boolean;
  existe: boolean;
  faltantes: string[];
  diffVacio: boolean;
}

/** Verifica que la corrida tenga sus artefactos. `razones.md` se exige solo si el diff no es vacío. */
export function verificarArtefactos(corridaDir: string): EstadoArtefactos {
  if (!existsSync(corridaDir)) return { existe: false, faltantes: [...ARTEFACTOS], diffVacio: true, soloBrief: false };
  // Una carpeta que tiene el brief y nada más es una corrida planificada que nunca se ejecutó. Es
  // un estado legítimo y vale la pena que quede público: el brief muestra qué se pensaba buscar. Lo
  // que no puede es contarse como corrida incompleta, porque entonces el aviso queda encendido para
  // siempre y deja de distinguirse de una corrida que sí corrió y perdió un artefacto.
  const soloBrief =
    existsSync(path.join(corridaDir, 'brief.md')) &&
    ARTEFACTOS.every((a) => a === 'brief.md' || !existsSync(path.join(corridaDir, a)));
  const faltantes: string[] = [];
  const diffRuta = path.join(corridaDir, 'edicion.diff');
  const diffVacio = !existsSync(diffRuta) || readFileSync(diffRuta, 'utf8').trim() === '';
  for (const a of ARTEFACTOS) {
    if (a === 'razones.md' && diffVacio) continue;
    const ruta = path.join(corridaDir, a);
    if (!existsSync(ruta)) faltantes.push(a);
    else if (a === 'crudo' && !statSync(ruta).isDirectory()) faltantes.push(a);
  }
  return { existe: true, faltantes: soloBrief ? [] : faltantes, diffVacio, soloBrief };
}

// ---------------------------------------------------------------------------
// Corrida de un script sin agente ni investigador (`pnpm reverificar --escribir`, `pnpm lote
// fusionar`): una corrección mecánica todavía necesita el rastro público de `data/corridas/<id>/`
// (CLAUDE.md, "Procedencia obligatoria"), aunque no haya brief de investigación ni crítico.
// ---------------------------------------------------------------------------

export interface OpcionesCorridaScript {
  /** Fecha de la corrida (YYYY-MM-DD). */
  fecha: string;
  /** Va después de la fecha: "reverificacion", o "fusion-<queda>". */
  sufijo: string;
  /** Cuerpo de brief.md ya armado (markdown): qué hizo el script, con qué versión, sobre qué registros y con qué resultado. */
  brief: string;
  /** Líneas ya en JSON de consultas.jsonl (una por URL leída); [] si el script no leyó ninguna. */
  consultas: string[];
  /** Motivo por el que no hay crítico, para critica.md ("corrección mecánica: sin crítica; ver brief.md" y por qué). */
  motivoSinCritica: string;
  /** Motivo por el que no hay edición de criterio, para razones.md. */
  motivoSinRazones: string;
}

export interface CorridaScriptEscrita {
  id: string;
  dir: string;
}

/**
 * Crea `data/corridas/<fecha>-<sufijo>/` para una corrida sin agente ni investigador, con
 * `brief.md`, `consultas.jsonl`, `critica.md` y `razones.md` ya escritos: los cuatro artefactos que
 * `pnpm promover` no arma solo (`crudo/`, `agentes.json` y `edicion.diff` los escribe `promover`
 * al aplicar la corrección). Con esto, `verificarArtefactos` no marca la corrida como incompleta
 * aunque nunca haya pasado por un crítico ni un editor.
 *
 * Si `data/corridas/<fecha>-<sufijo>` ya existe (de una corrida anterior, con cualquier contenido),
 * prueba `-2`, `-3`, … hasta encontrar una carpeta libre: nunca pisa una corrida ya escrita.
 */
export function escribirCorridaDeScript(rootDir: string, opciones: OpcionesCorridaScript): CorridaScriptEscrita {
  let id = `${opciones.fecha}-${opciones.sufijo}`;
  for (let n = 2; existsSync(carpetaCorrida(rootDir, id)); n++) id = `${opciones.fecha}-${opciones.sufijo}-${n}`;

  const dir = carpetaCorrida(rootDir, id);
  mkdirSync(dir, { recursive: true });
  const conSalto = (s: string): string => (s.endsWith('\n') ? s : `${s}\n`);

  writeFileSync(path.join(dir, 'brief.md'), conSalto(opciones.brief), 'utf8');
  writeFileSync(path.join(dir, 'consultas.jsonl'), opciones.consultas.length ? `${opciones.consultas.join('\n')}\n` : '', 'utf8');
  writeFileSync(path.join(dir, 'critica.md'), conSalto(`# Sin crítico\n\n${opciones.motivoSinCritica}`), 'utf8');
  writeFileSync(path.join(dir, 'razones.md'), conSalto(`Sin ediciones de criterio: ${opciones.motivoSinRazones}`), 'utf8');

  return { id, dir };
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
  /**
   * Archivos de instrucciones que al momento de promover diferían de `commit`, es decir, estaban
   * editados y sin commitear. Su hash queda registrado igual, pero no hay ninguna versión pública
   * contra la cual verificarlo: un tercero no puede reconstruir las instrucciones que el agente
   * realmente recibió. Sin este campo, esa situación es indistinguible de un hash adulterado.
   */
  archivos_sin_commitear?: string[];
  /** Agente → archivo de instrucciones, hash y modelo reportado. */
  agentes: Record<string, { archivo: string; sha256: string; modelo?: string }>;
  /**
   * Script (sin agente) → su archivo dentro de scripts/, su SHA-256 y el de sus insumos
   * (inventario, extraidas.jsonl, etc.), para los registros con procedencia por script.
   * Ausente en las corridas que no promovieron ningún registro de ese tipo.
   */
  scripts?: Record<string, { archivo: string; sha256: string; insumos?: Record<string, string> }>;
}

/**
 * Archivos de instrucciones que se hashean: CLAUDE.md, .claude/agents/*.md, .claude/commands/*.md
 * y docs/colecciones/*.md (las reglas por colección que el brief copia y que editor y crítico leen).
 */
export function archivosDeInstrucciones(rootDir: string): string[] {
  const salida: string[] = [];
  if (existsSync(path.join(rootDir, 'CLAUDE.md'))) salida.push('CLAUDE.md');
  for (const sub of ['agents', 'commands']) {
    const dir = path.join(rootDir, '.claude', sub);
    if (!existsSync(dir)) continue;
    for (const n of readdirSync(dir).sort()) if (n.endsWith('.md')) salida.push(`.claude/${sub}/${n}`);
  }
  const colecciones = path.join(rootDir, 'docs', 'colecciones');
  if (existsSync(colecciones)) {
    for (const n of readdirSync(colecciones).sort()) if (n.endsWith('.md')) salida.push(`docs/colecciones/${n}`);
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

/**
 * Archivos de instrucciones cuyo contenido en el árbol de trabajo no coincide con el de HEAD.
 * Lista vacía si el repo no tiene commits: ahí no hay contra qué comparar y no es un hallazgo.
 */
export function instruccionesSinCommitear(rootDir: string): string[] {
  if (!tieneCommits(rootDir)) return [];
  const sucios: string[] = [];
  for (const rel of archivosDeInstrucciones(rootDir)) {
    const r = git(['diff', '--quiet', 'HEAD', '--', rel], rootDir);
    if (!r.ok) sucios.push(rel);
  }
  return sucios;
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
