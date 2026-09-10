/**
 * `pnpm exec tsx tests/fixtures/sellar.ts`
 *
 * Recalcula los hashes de la fixture `ok/` con el mismo código que usa el
 * proyecto, para que el fixture no dependa de valores copiados a mano:
 *
 *   - `procedencia.brief_sha` = SHA-256 de `data/corridas/<id>/brief.md`
 *   - `procedencia.agente_sha` = el hash que declara `agentes.json`
 *   - `procedencia.script_sha` = el hash que declara `agentes.json.scripts` (procedencia por script)
 *
 * Es idempotente: si nada cambió, no reescribe nada. Hay que correrlo después
 * de editar `brief.md` o cualquier registro con aprobación.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { hashDeArchivo, type AgentesJson } from '../../scripts/lib/corridas.ts';
import { sha256 } from '../../scripts/lib/hash.ts';
import { listarArchivos } from '../../scripts/validadores/esquema.ts';

export const CORRIDA = '2020-05-01-lacalle-pou-economia-impuestos';
/** Hash sintético del archivo de instrucciones del agente en la corrida del fixture. */
export const AGENTE_SHA = sha256('investigador-fixture');
/** Hash sintético de un script con procedencia (no corresponde a un archivo real en scripts/). */
export const SCRIPT_SHA = sha256('script-fixture');

export function sellar(dirFixture: string): { cambios: string[] } {
  const cambios: string[] = [];
  const escribirSiCambia = (rel: string, texto: string): void => {
    const ruta = path.join(dirFixture, ...rel.split('/'));
    let previo = '';
    try {
      previo = readFileSync(ruta, 'utf8');
    } catch {
      previo = '';
    }
    if (previo !== texto) {
      writeFileSync(ruta, texto, 'utf8');
      cambios.push(rel);
    }
  };

  const briefSha = hashDeArchivo(path.join(dirFixture, 'data', 'corridas', CORRIDA, 'brief.md'));

  // `scripts` de agentes.json (procedencia por script): si la fixture ya declara alguno -placeholder
  // o hash viejo-, se preserva su forma (archivo, insumos) y solo se normaliza el sha256 a
  // SCRIPT_SHA, igual que agente_sha con AGENTE_SHA. Una fixture sin registros por script no
  // declara `scripts`, y este bloque no agrega nada.
  const rutaAgentesJson = path.join(dirFixture, 'data', 'corridas', CORRIDA, 'agentes.json');
  let scriptsPrevios: NonNullable<AgentesJson['scripts']> | undefined;
  if (existsSync(rutaAgentesJson)) {
    try {
      const previo = JSON.parse(readFileSync(rutaAgentesJson, 'utf8')) as AgentesJson;
      if (previo.scripts && Object.keys(previo.scripts).length) scriptsPrevios = previo.scripts;
    } catch {
      /* agentes.json todavía no existe o no es JSON válido: nada que preservar. */
    }
  }
  const scripts = scriptsPrevios
    ? Object.fromEntries(Object.entries(scriptsPrevios).map(([nombre, info]) => [nombre, { ...info, sha256: SCRIPT_SHA }]))
    : undefined;

  // agentes.json de la corrida.
  const agentes: AgentesJson = {
    commit: null,
    generado: '2020-05-01T12:00:00.000Z',
    archivos: { 'CLAUDE.md': sha256('claude-md-fixture'), '.claude/agents/investigador.md': AGENTE_SHA },
    agentes: { investigador: { archivo: '.claude/agents/investigador.md', sha256: AGENTE_SHA, modelo: 'modelo-de-prueba' } },
    ...(scripts ? { scripts } : {}),
  };
  escribirSiCambia(`data/corridas/${CORRIDA}/agentes.json`, JSON.stringify(agentes, null, 2) + '\n');

  // Hashes de procedencia en todos los YAML de content/.
  for (const ruta of listarArchivos(path.join(dirFixture, 'content'), 'yaml')) {
    const texto = readFileSync(ruta, 'utf8');
    const nuevo = texto
      .replace(/(agente_sha: )(?:AGENTE_SHA|[a-f0-9]{64})/g, `$1${AGENTE_SHA}`)
      .replace(/(brief_sha: )(?:BRIEF_SHA|[a-f0-9]{64})/g, `$1${briefSha}`)
      .replace(/(script_sha: )(?:SCRIPT_SHA|[a-f0-9]{64})/g, `$1${SCRIPT_SHA}`);
    if (nuevo !== texto) {
      writeFileSync(ruta, nuevo, 'utf8');
      cambios.push(path.relative(dirFixture, ruta));
    }
  }

  return { cambios };
}

const esEntrada = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (esEntrada) {
  const dir = path.resolve(process.argv[2] ?? path.join(path.dirname(fileURLToPath(import.meta.url)), 'ok'));
  const { cambios } = sellar(dir);
  console.log(cambios.length ? `Sellado ${dir}:\n  ${cambios.join('\n  ')}` : `Sin cambios en ${dir}.`);
}
