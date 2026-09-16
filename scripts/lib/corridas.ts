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
  /**
   * `generado` de `instrucciones.json` cuando esta corrida tenía instrucciones congeladas al
   * armar el brief (defecto 2 del piloto de Astori, 2026-09-16). Ausente en una corrida anterior
   * al congelado: ahí `archivos` es el hash vigente al promover, como siempre fue.
   */
  instrucciones_congeladas?: string;
  /**
   * Archivos de instrucciones cuyo hash al promover no coincide con el que quedó congelado en
   * `instrucciones.json`: alguien tocó una regla mientras la corrida seguía abierta (regla 15 de
   * CLAUDE.md, "una regla agregada después dispara una vuelta completa"). No bloquea nada: los
   * agentes ya leyeron la versión congelada, y esto lo deja escrito para que nadie confunda una
   * regla cambiada a mitad de camino con una que rigió desde el principio.
   */
  archivos_cambiados_durante_la_corrida?: string[];
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

/**
 * Extensiones de texto: se hashean con el fin de línea normalizado a LF. Los binarios (PDF, vía
 * scripts/lib/ocr.ts y ocr-trabajador.ts) no pasan por esta función y no se normalizan.
 */
const EXTENSIONES_DE_TEXTO = new Set(['.md', '.yaml', '.yml', '.json', '.jsonl', '.txt', '.ts', '.astro', '.csv']);

/**
 * Hash de un archivo para procedencia (brief_sha, agente_sha, script_sha, hashes de instrucciones).
 *
 * Para archivos de texto, normaliza CRLF y CR sueltos a LF antes de hashear, así el hash es
 * siempre el del blob que git guarda (`.gitattributes` fuerza `text=auto eol=lf`), sin importar en
 * qué sistema operativo se escribió el archivo. Sin esto, un archivo escrito con CRLF en Windows
 * queda con un hash que ningún checkout limpio puede reproducir: pasó de verdad con
 * `data/corridas/2026-09-16-batlle-economia-impuestos/brief.md`, escrito con CRLF por una
 * herramienta en Windows, cuyos 51 registros promovidos quedaron con un `brief_sha` que no
 * coincide con el brief que ve cualquier otra máquina (`pnpm promover --resellar` lo repara).
 */
export function hashDeArchivo(ruta: string): string {
  return hashDeContenido(readFileSync(ruta), ruta);
}

/**
 * Mismo cálculo que `hashDeArchivo`, pero sobre un buffer ya leído (por ejemplo, el contenido de
 * un archivo en un commit puntual vía `git cat-file`, sin pasar por el árbol de trabajo actual).
 * `ruta` solo se usa para decidir la extensión (texto vs. binario); no hace falta que exista en
 * disco. La usa `pnpm promover --resellar` para recalcular el hash de un archivo de agente o de
 * script tal como estaba en el commit que quedó congelado en `agentes.json`, no como está hoy: un
 * archivo de instrucciones se sigue editando después de que la corrida promovió, y comparar contra
 * el árbol de trabajo actual confundiría una edición real y posterior con el defecto de CRLF.
 */
export function hashDeContenido(buffer: Buffer, ruta: string): string {
  if (!EXTENSIONES_DE_TEXTO.has(path.extname(ruta).toLowerCase())) return sha256(buffer);
  const normalizado = buffer.toString('utf8').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  return sha256(Buffer.from(normalizado, 'utf8'));
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

// ---------------------------------------------------------------------------
// instrucciones.json: instrucciones congeladas al armar el brief
// ---------------------------------------------------------------------------

export interface InstruccionesCongeladas {
  /** Commit HEAD al momento de armar el brief (null si el repo no tiene commits). */
  commit: string | null;
  generado: string;
  /** Ruta relativa → SHA-256 del contenido en ese momento (mismo cálculo que agentes.json.archivos). */
  archivos: Record<string, string>;
  archivos_sin_commitear?: string[];
}

/**
 * `pnpm brief` congela acá los hashes de instrucciones que el agente va a leer, antes de lanzarlo.
 * Sin esto, `agentes.json` (que escribe `pnpm promover` recién al final de la corrida) registra las
 * instrucciones vigentes al momento de promover, no las que el agente realmente leyó al empezar: si
 * una regla cambia mientras la corrida sigue abierta —pasó de verdad con la corrida de Astori,
 * 2026-09-16: un commit tocó `docs/colecciones/` y los roles mientras esa corrida seguía corriendo—
 * `agentes.json` queda describiendo reglas que ningún agente de esa corrida llegó a leer.
 *
 * No se escribe `agentes.json` acá: `src/lib/corridas.ts` (el sitio) usa su existencia como "la
 * corrida se ejecutó", y una corrida recién planificada (solo brief) no corrió todavía.
 */
export function escribirInstruccionesCongeladas(rootDir: string, corridaDir: string): InstruccionesCongeladas {
  const congeladas: InstruccionesCongeladas = {
    commit: commitActual(rootDir),
    generado: new Date().toISOString(),
    archivos: hashesDeInstrucciones(rootDir),
    archivos_sin_commitear: instruccionesSinCommitear(rootDir),
  };
  mkdirSync(corridaDir, { recursive: true });
  writeFileSync(path.join(corridaDir, 'instrucciones.json'), JSON.stringify(congeladas, null, 2) + '\n', 'utf8');
  return congeladas;
}

/** `data/corridas/<id>/instrucciones.json`, o null si no existe o no es JSON válido (corrida anterior al congelado). */
export function leerInstruccionesCongeladas(corridaDir: string): InstruccionesCongeladas | null {
  const ruta = path.join(corridaDir, 'instrucciones.json');
  if (!existsSync(ruta)) return null;
  try {
    return JSON.parse(readFileSync(ruta, 'utf8')) as InstruccionesCongeladas;
  } catch {
    return null;
  }
}
