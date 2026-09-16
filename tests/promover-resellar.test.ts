/**
 * `pnpm promover --resellar <id-corrida> [--simulacion]` (scripts/promover.ts): repara
 * mecánicamente `brief_sha`/`agente_sha`/`script_sha` cuando el archivo que se hasheó (brief.md,
 * un archivo de agente, un script) se escribió alguna vez con CRLF y el hash guardado en
 * `content/` quedó siendo el de esa copia — el mismo defecto real de
 * `data/corridas/2026-09-16-batlle-economia-impuestos/brief.md`.
 *
 * `agente_sha`/`script_sha` se cotejan contra el contenido que ese archivo tenía en el commit que
 * `agentes.json.commit` dejó congelado, no contra el árbol de trabajo actual: un archivo de agente
 * sigue editándose después de que la corrida promovió (es lo normal), y la primera versión de este
 * mismo test —recalculando contra el archivo tal como está hoy— lo demostró: contra el
 * `.claude/agents/investigador.md` real de este repo (editado muchas veces desde cualquier corrida
 * vieja) devolvía 51 diferencias de `agente_sha` que no tenían nada que ver con CRLF, solo con que
 * el archivo cambió después. Por eso acá se arma un repo git de verdad (mismo patrón que
 * tests/promover-deshacer.test.ts) y se congela `agentes.json.commit` en el commit donde se
 * committeó `investigador.md`.
 *
 * No pasa por `promover()`: arma el registro de `content/` a mano (mismo patrón que
 * tests/procedencia-script.test.ts) para poder afirmar que el reemplazo toca una única línea de
 * cada campo, byte a byte, sin re-serializar el YAML.
 */
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import { afterAll, describe, expect, it } from 'vitest';
import { resellarCorrida } from '../scripts/promover.ts';
import { hashDeArchivo, type AgentesJson } from '../scripts/lib/corridas.ts';
import { git } from '../scripts/lib/git.ts';
import { sha256 } from '../scripts/lib/hash.ts';

const temporales: string[] = [];
afterAll(() => {
  for (const d of temporales.splice(0)) rmSync(d, { recursive: true, force: true });
});

const CORRIDA = '2020-08-10-testpol-resellar';
const ARCHIVO_REGISTRO = ['content', 'declaraciones', 'testpol', '2020-08-10-prueba.yaml'];

/** Texto del registro; `briefSha`/`agenteSha` son los valores que va a llevar `procedencia`. */
function textoRegistro(briefSha: string, agenteSha: string): string {
  return `politico: testpol
tema: economia/impuestos
fecha: 2020-08-10
contexto: gobierno
cargo_en_ese_momento: Presidente de la República
cita: Cita de prueba de más de veinte caracteres para pasar la validación del esquema.
resumen: Registro de prueba para pnpm promover --resellar.
evidencia:
  nivel: textual
  fuentes:
    - url: https://ejemplo.uy/resellar
      medio: el-pais
      fecha: 2020-08-10
      tipo: documento_oficial
      titulo: Documento de prueba
      cita: Cita de prueba de más de veinte caracteres para pasar la validación del esquema.
      retrieved_at: 2020-08-10
revision:
  tier: publicado
procedencia:
  corrida: ${CORRIDA}
  agente: investigador
  agente_sha: ${agenteSha}
  modelo: claude-sonnet-5
  brief_sha: ${briefSha}
  fecha: 2020-08-10
`;
}

/**
 * Raíz mínima con repo git: brief.md y .claude/agents/investigador.md reales, este último
 * commiteado (para que `contenidoEnCommit` pueda recuperar su versión histórica). agentes.json y
 * el registro de content/ quedan con los hashes "viejos" —los que hubiera dejado la copia con
 * CRLF de cada archivo, antes de que existiera la normalización— y `agentes.json.commit` apunta al
 * commit donde `investigador.md` quedó con su contenido real (sin CRLF: git ya lo normalizó).
 */
function prepararRaiz(): { raiz: string; briefShaNuevo: string; agenteShaNuevo: string; briefShaViejo: string; agenteShaViejo: string } {
  const raiz = mkdtempSync(path.join(tmpdir(), 'la-casta-resellar-'));
  temporales.push(raiz);

  const corridaDir = path.join(raiz, 'data', 'corridas', CORRIDA);
  mkdirSync(corridaDir, { recursive: true });
  const briefTextoLF = '# Brief de prueba para resellar\n\nAlgún contenido de ejemplo.\n';
  writeFileSync(path.join(corridaDir, 'brief.md'), briefTextoLF, 'utf8');

  mkdirSync(path.join(raiz, '.claude', 'agents'), { recursive: true });
  const agenteTextoLF = '# Investigador de prueba\n\nInstrucciones de ejemplo.\n';
  writeFileSync(path.join(raiz, '.claude', 'agents', 'investigador.md'), agenteTextoLF, 'utf8');

  git(['init', '-q'], raiz);
  git(['config', 'user.email', 'test@example.com'], raiz);
  git(['config', 'user.name', 'Test'], raiz);
  git(['add', '-A'], raiz);
  git(['commit', '-q', '-m', 'inicial'], raiz);
  const commit = git(['rev-parse', 'HEAD'], raiz).stdout;
  expect(commit).toMatch(/^[0-9a-f]{40}$/);

  // El hash "nuevo" es el que da hashDeArchivo() hoy (ya normalizado, y lo que da recalcular desde
  // el commit). El "viejo" es el que daba hashear la copia con CRLF antes de que existiera esa
  // normalización: el defecto real, que nunca llegó a commitearse (git normalizó a LF al agregar).
  const briefShaNuevo = hashDeArchivo(path.join(corridaDir, 'brief.md'));
  const agenteShaNuevo = hashDeArchivo(path.join(raiz, '.claude', 'agents', 'investigador.md'));
  const briefShaViejo = sha256(Buffer.from(briefTextoLF.replace(/\n/g, '\r\n'), 'utf8'));
  const agenteShaViejo = sha256(Buffer.from(agenteTextoLF.replace(/\n/g, '\r\n'), 'utf8'));
  expect(briefShaViejo).not.toBe(briefShaNuevo);
  expect(agenteShaViejo).not.toBe(agenteShaNuevo);

  const agentesJson: AgentesJson = {
    commit,
    generado: '2020-08-10T12:00:00.000Z',
    archivos: { '.claude/agents/investigador.md': agenteShaViejo },
    agentes: { investigador: { archivo: '.claude/agents/investigador.md', sha256: agenteShaViejo, modelo: 'claude-sonnet-5' } },
  };
  writeFileSync(path.join(corridaDir, 'agentes.json'), JSON.stringify(agentesJson, null, 2) + '\n', 'utf8');

  mkdirSync(path.join(raiz, ...ARCHIVO_REGISTRO.slice(0, -1)), { recursive: true });
  writeFileSync(path.join(raiz, ...ARCHIVO_REGISTRO), textoRegistro(briefShaViejo, agenteShaViejo), 'utf8');

  return { raiz, briefShaNuevo, agenteShaNuevo, briefShaViejo, agenteShaViejo };
}

describe('resellarCorrida(): repara brief_sha/agente_sha cuando el archivo original tenía CRLF', () => {
  it('reescribe solo esas dos líneas en el registro, y agente_sha en agentes.json', () => {
    const { raiz, briefShaNuevo, agenteShaNuevo, briefShaViejo, agenteShaViejo } = prepararRaiz();
    const rutaRegistro = path.join(raiz, ...ARCHIVO_REGISTRO);
    const textoOriginal = readFileSync(rutaRegistro, 'utf8');

    const r = resellarCorrida(CORRIDA, { rootDir: raiz });

    expect(r.simulado).toBe(false);
    expect(r.cambios.sort((a, b) => a.campo.localeCompare(b.campo))).toEqual(
      [
        { archivo: 'content/declaraciones/testpol/2020-08-10-prueba.yaml', campo: 'agente_sha', viejo: agenteShaViejo, nuevo: agenteShaNuevo },
        { archivo: 'content/declaraciones/testpol/2020-08-10-prueba.yaml', campo: 'brief_sha', viejo: briefShaViejo, nuevo: briefShaNuevo },
      ].sort((a, b) => a.campo.localeCompare(b.campo)),
    );
    expect(r.agentesJsonCambiado).toBe(true);

    // El registro sigue parseando y los dos campos quedaron con el hash nuevo; el resto, intacto.
    const textoNuevo = readFileSync(rutaRegistro, 'utf8');
    const datos = parseYaml(textoNuevo);
    expect(datos.procedencia.brief_sha).toBe(briefShaNuevo);
    expect(datos.procedencia.agente_sha).toBe(agenteShaNuevo);
    expect(datos.procedencia.corrida).toBe(CORRIDA);
    expect(datos.procedencia.modelo).toBe('claude-sonnet-5');
    expect(datos.cita).toBe('Cita de prueba de más de veinte caracteres para pasar la validación del esquema.');

    // El diff es exactamente esas dos líneas: todas las demás son idénticas byte a byte.
    const lineasOriginal = textoOriginal.split('\n');
    const lineasNuevo = textoNuevo.split('\n');
    expect(lineasNuevo.length).toBe(lineasOriginal.length);
    const lineasDistintas = lineasOriginal.map((l, i) => (l !== lineasNuevo[i] ? i : -1)).filter((i) => i >= 0);
    expect(lineasDistintas).toHaveLength(2);
    for (const i of lineasDistintas) {
      expect(lineasNuevo[i].trimStart()).toMatch(/^(brief_sha|agente_sha): [0-9a-f]{64}$/);
    }

    // agentes.json quedó con el hash nuevo, en 'archivos' y en 'agentes.investigador'.
    const agentesJson = JSON.parse(readFileSync(path.join(raiz, 'data', 'corridas', CORRIDA, 'agentes.json'), 'utf8')) as AgentesJson;
    expect(agentesJson.archivos['.claude/agents/investigador.md']).toBe(agenteShaNuevo);
    expect(agentesJson.agentes.investigador.sha256).toBe(agenteShaNuevo);
    expect(agentesJson.agentes.investigador.modelo).toBe('claude-sonnet-5');
  });

  it('--simulacion informa los mismos cambios sin escribir nada', () => {
    const { raiz } = prepararRaiz();
    const rutaRegistro = path.join(raiz, ...ARCHIVO_REGISTRO);
    const rutaAgentesJson = path.join(raiz, 'data', 'corridas', CORRIDA, 'agentes.json');
    const registroAntes = readFileSync(rutaRegistro, 'utf8');
    const agentesJsonAntes = readFileSync(rutaAgentesJson, 'utf8');

    const r = resellarCorrida(CORRIDA, { rootDir: raiz, simulacion: true });

    expect(r.simulado).toBe(true);
    expect(r.cambios).toHaveLength(2);
    expect(r.agentesJsonCambiado).toBe(true);
    expect(readFileSync(rutaRegistro, 'utf8')).toBe(registroAntes);
    expect(readFileSync(rutaAgentesJson, 'utf8')).toBe(agentesJsonAntes);
  });

  it('sin nada para resellar (los hashes ya coinciden), no toca ningún archivo', () => {
    const { raiz, briefShaNuevo, agenteShaNuevo } = prepararRaiz();
    const rutaRegistro = path.join(raiz, ...ARCHIVO_REGISTRO);
    writeFileSync(rutaRegistro, textoRegistro(briefShaNuevo, agenteShaNuevo), 'utf8');
    const rutaAgentesJson = path.join(raiz, 'data', 'corridas', CORRIDA, 'agentes.json');
    const agentesJson = JSON.parse(readFileSync(rutaAgentesJson, 'utf8')) as AgentesJson;
    agentesJson.archivos['.claude/agents/investigador.md'] = agenteShaNuevo;
    agentesJson.agentes.investigador.sha256 = agenteShaNuevo;
    writeFileSync(rutaAgentesJson, JSON.stringify(agentesJson, null, 2) + '\n', 'utf8');
    const registroAntes = readFileSync(rutaRegistro, 'utf8');
    const agentesJsonAntes = readFileSync(rutaAgentesJson, 'utf8');

    const r = resellarCorrida(CORRIDA, { rootDir: raiz });

    expect(r.cambios).toEqual([]);
    expect(r.agentesJsonCambiado).toBe(false);
    expect(readFileSync(rutaRegistro, 'utf8')).toBe(registroAntes);
    expect(readFileSync(rutaAgentesJson, 'utf8')).toBe(agentesJsonAntes);
  });

  it('un agente editado DESPUÉS de la corrida (motivo real, no CRLF) no dispara un resello: se coteja contra el commit congelado, no contra el árbol de trabajo', () => {
    const { raiz, agenteShaNuevo } = prepararRaiz();
    // Sella primero el registro y agentes.json contra el hash correcto (como si ya se hubiera
    // resellado), y recién después alguien edita investigador.md por una razón real, sin commitear.
    const rutaRegistro = path.join(raiz, ...ARCHIVO_REGISTRO);
    const briefShaNuevo = hashDeArchivo(path.join(raiz, 'data', 'corridas', CORRIDA, 'brief.md'));
    writeFileSync(rutaRegistro, textoRegistro(briefShaNuevo, agenteShaNuevo), 'utf8');
    const rutaAgentesJson = path.join(raiz, 'data', 'corridas', CORRIDA, 'agentes.json');
    const agentesJson = JSON.parse(readFileSync(rutaAgentesJson, 'utf8')) as AgentesJson;
    agentesJson.agentes.investigador.sha256 = agenteShaNuevo;
    agentesJson.archivos['.claude/agents/investigador.md'] = agenteShaNuevo;
    writeFileSync(rutaAgentesJson, JSON.stringify(agentesJson, null, 2) + '\n', 'utf8');

    // Edición real y posterior de investigador.md, sin commitear.
    writeFileSync(path.join(raiz, '.claude', 'agents', 'investigador.md'), '# Investigador de prueba (versión editada después)\n', 'utf8');

    const r = resellarCorrida(CORRIDA, { rootDir: raiz });

    expect(r.cambios).toEqual([]);
    expect(r.agentesJsonCambiado).toBe(false);
  });

  it('sin agentes.json.commit (corrida sin commits), no toca agente_sha por falta de base histórica', () => {
    const { raiz, briefShaViejo, agenteShaViejo } = prepararRaiz();
    const rutaAgentesJson = path.join(raiz, 'data', 'corridas', CORRIDA, 'agentes.json');
    const agentesJson = JSON.parse(readFileSync(rutaAgentesJson, 'utf8')) as AgentesJson;
    agentesJson.commit = null;
    writeFileSync(rutaAgentesJson, JSON.stringify(agentesJson, null, 2) + '\n', 'utf8');

    const r = resellarCorrida(CORRIDA, { rootDir: raiz });

    // brief_sha sigue resellándose (no depende del commit); agente_sha, sin base, queda como está.
    expect(r.cambios).toEqual([{ archivo: 'content/declaraciones/testpol/2020-08-10-prueba.yaml', campo: 'brief_sha', viejo: briefShaViejo, nuevo: hashDeArchivo(path.join(raiz, 'data', 'corridas', CORRIDA, 'brief.md')) }]);
    expect(r.agentesJsonCambiado).toBe(false);
    const datos = parseYaml(readFileSync(path.join(raiz, ...ARCHIVO_REGISTRO), 'utf8'));
    expect(datos.procedencia.agente_sha).toBe(agenteShaViejo);
  });

  it('rechaza un id de corrida con formato inválido', () => {
    const raiz = mkdtempSync(path.join(tmpdir(), 'la-casta-resellar-'));
    temporales.push(raiz);
    expect(() => resellarCorrida('no-es-un-id-valido', { rootDir: raiz })).toThrow(/Id de corrida inválido/);
  });

  it('rechaza una corrida que no existe en data/corridas/', () => {
    const raiz = mkdtempSync(path.join(tmpdir(), 'la-casta-resellar-'));
    temporales.push(raiz);
    expect(() => resellarCorrida('2020-08-11-testpol-no-existe', { rootDir: raiz })).toThrow(/No existe data\/corridas/);
  });
});
