/**
 * Procedencia por script (docs/plan-2026-09.md, "Decisiones del mantenedor" 1 y ítem 1.7;
 * CLAUDE.md, "Procedencia obligatoria"): un registro generado por un script sin agente ni modelo,
 * como el generador de fichas de suplentes o el extractor de balances.
 *
 * Reusa la corrida de `tests/fixtures/ok/` (ya completa, con sus siete artefactos) y le agrega:
 *   - una clave `scripts` en su `agentes.json`, con el script y su SHA-256;
 *   - una declaración nueva cuya `procedencia` es {corrida, script, script_sha, brief_sha, fecha}.
 *
 * `sellar()` (tests/fixtures/sellar.ts) calcula los hashes reales, igual que hace con
 * `agente_sha`/`brief_sha` para la procedencia por corrida.
 */
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';
import { afterAll, describe, expect, it } from 'vitest';
import { validar } from '../scripts/validar.ts';
import { promover } from '../scripts/promover.ts';
import { hashDeArchivo, type AgentesJson } from '../scripts/lib/corridas.ts';
import { FIXTURE_OK } from './ayuda.ts';
import { CORRIDA, sellar } from './fixtures/sellar.ts';

const OPCIONES = { escribirSimetria: false as const };
/** Script de fixture: no existe de verdad en scripts/, solo hace falta que agentes.json lo declare. */
const NOMBRE_SCRIPT = 'generar-suplentes-fixture.ts';
const ARCHIVO_REGISTRO = ['content', 'declaraciones', 'lacalle-pou', '2020-06-10-script-fixture.yaml'];

const temporales: string[] = [];
afterAll(() => {
  for (const d of temporales.splice(0)) rmSync(d, { recursive: true, force: true });
});

/**
 * Copia la fixture buena, declara `NOMBRE_SCRIPT` en agentes.json de la corrida existente y agrega
 * una declaración nueva con procedencia por script. `scriptEnRegistro` permite que el registro
 * apunte a un script distinto del declarado en agentes.json (caso malo: "no figura").
 */
function prepararFixtureScript(scriptEnRegistro: string = NOMBRE_SCRIPT): string {
  const destino = mkdtempSync(path.join(tmpdir(), 'la-casta-script-'));
  temporales.push(destino);
  cpSync(FIXTURE_OK, destino, { recursive: true });

  const rutaAgentesJson = path.join(destino, 'data', 'corridas', CORRIDA, 'agentes.json');
  const agentesJson = JSON.parse(readFileSync(rutaAgentesJson, 'utf8')) as AgentesJson;
  agentesJson.scripts = { [NOMBRE_SCRIPT]: { archivo: `scripts/${NOMBRE_SCRIPT}`, sha256: '0'.repeat(64) } };
  writeFileSync(rutaAgentesJson, JSON.stringify(agentesJson, null, 2) + '\n', 'utf8');

  const yaml = `politico: lacalle-pou
tema: economia/impuestos
fecha: 2020-06-10
contexto: gobierno
cargo_en_ese_momento: Presidente de la República
cita: >-
  Frase de prueba generada por un script de fixture para procedencia por script, con más de veinte caracteres.
resumen: Registro sintético para probar la procedencia por script.
evidencia:
  nivel: textual
  fuentes:
    - url: https://ejemplo.uy/script-fixture
      medio: el-pais
      fecha: 2020-06-10
      tipo: documento_oficial
      titulo: Documento de prueba
      cita: >-
        Frase de prueba generada por un script de fixture para procedencia por script, con más de veinte caracteres.
      retrieved_at: 2020-06-10
revision:
  tier: publicado
procedencia:
  corrida: ${CORRIDA}
  script: ${scriptEnRegistro}
  script_sha: SCRIPT_SHA
  brief_sha: BRIEF_SHA
  fecha: 2020-05-01
`;
  writeFileSync(path.join(destino, ...ARCHIVO_REGISTRO), yaml, 'utf8');

  // Calcula script_sha y brief_sha reales (sellar() ya sabe hacerlo también para `scripts`).
  sellar(destino);
  return destino;
}

describe('procedencia por script', () => {
  it('un registro con procedencia por script válida pasa validar()', async () => {
    const raiz = prepararFixtureScript();
    const r = await validar({ rootDir: raiz, ...OPCIONES });
    expect(r.errores).toEqual([]);
    expect(r.codigo).toBe(0);
  });

  it('script_sha distinto del que declara agentes.json falla', async () => {
    const raiz = prepararFixtureScript();
    // Sellado ya dejó el script_sha correcto: lo pisamos por uno con forma válida pero distinto.
    const archivo = path.join(raiz, ...ARCHIVO_REGISTRO);
    const texto = readFileSync(archivo, 'utf8');
    const alterado = texto.replace(/(script_sha: )[a-f0-9]{64}/, `$1${'f'.repeat(64)}`);
    expect(alterado).not.toBe(texto);
    writeFileSync(archivo, alterado, 'utf8');

    const r = await validar({ rootDir: raiz, ...OPCIONES });
    expect(r.codigo).toBe(1);
    expect(r.errores.some((e) => e.campo === 'procedencia.script_sha' && e.mensaje.includes('script_sha no coincide'))).toBe(true);
  });

  it('un script que no figura en agentes.json falla', async () => {
    const raiz = prepararFixtureScript('script-no-declarado.ts');
    const r = await validar({ rootDir: raiz, ...OPCIONES });
    expect(r.codigo).toBe(1);
    expect(r.errores.some((e) => e.campo === 'procedencia.script' && e.mensaje.includes('no figura'))).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// promover(): escribe la procedencia por script de punta a punta.
// ---------------------------------------------------------------------------

/** Arma una raíz de proyecto mínima (sin git) con un inbox, un script y un insumo. */
function prepararRaizPromoverScript(corridaId: string): { raiz: string; corridaDir: string; inboxDir: string } {
  const raiz = mkdtempSync(path.join(tmpdir(), 'la-casta-promover-script-'));
  temporales.push(raiz);

  const corridaDir = path.join(raiz, 'data', 'corridas', corridaId);
  mkdirSync(corridaDir, { recursive: true });
  writeFileSync(path.join(corridaDir, 'brief.md'), '# brief de prueba para promover con script\n', 'utf8');

  // El script referenciado por _investigacion.script tiene que existir de verdad en scripts/.
  mkdirSync(path.join(raiz, 'scripts'), { recursive: true });
  writeFileSync(path.join(raiz, 'scripts', 'generar-suplentes.ts'), '// script de fixture para procedencia por script\n', 'utf8');

  // Insumo del script (ej. un inventario o extraidas.jsonl): su hash queda en agentes.json.scripts.
  writeFileSync(path.join(raiz, 'data', 'insumo-fixture.json'), '[{"id":"1"}]\n', 'utf8');

  const inboxDir = path.join(raiz, 'inbox-src');
  mkdirSync(inboxDir, { recursive: true });
  return { raiz, corridaDir, inboxDir };
}

function declaracionCrudaDeEjemplo(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    politico: 'lacalle-pou',
    tema: 'economia/impuestos',
    fecha: '2020-07-01',
    contexto: 'gobierno',
    cargo_en_ese_momento: 'Presidente de la República',
    cita: 'Cita de prueba generada por un script, con más de veinte caracteres.',
    resumen: 'Registro generado por un script, sin agente ni modelo.',
    evidencia: {
      nivel: 'textual',
      fuentes: [
        {
          url: 'https://ejemplo.uy/promover-script-fixture',
          medio: 'el-pais',
          fecha: '2020-07-01',
          tipo: 'documento_oficial',
          titulo: 'Documento de prueba',
          cita: 'Cita de prueba generada por un script, con más de veinte caracteres.',
          retrieved_at: '2020-07-01',
        },
      ],
    },
    revision: { tier: 'publicado' },
    _investigacion: { script: 'generar-suplentes.ts', insumos: ['data/insumo-fixture.json'] },
    ...overrides,
  };
}

describe('promover() escribe procedencia por script', () => {
  it('escribe procedencia por script y agentes.json.scripts, sin exigir agente ni modelo', () => {
    const corridaId = '2020-07-01-lacalle-pou-economia-impuestos';
    const { raiz, corridaDir, inboxDir } = prepararRaizPromoverScript(corridaId);
    writeFileSync(path.join(inboxDir, 'declaraciones.yaml'), stringifyYaml([declaracionCrudaDeEjemplo()]), 'utf8');

    const r = promover(inboxDir, { rootDir: raiz, corrida: corridaId });

    expect(r.errores).toEqual([]);
    expect(r.promovidos).toHaveLength(1);

    const scriptShaEsperado = hashDeArchivo(path.join(raiz, 'scripts', 'generar-suplentes.ts'));
    const insumoShaEsperado = hashDeArchivo(path.join(raiz, 'data', 'insumo-fixture.json'));
    const briefShaEsperado = hashDeArchivo(path.join(corridaDir, 'brief.md'));

    const destino = path.join(raiz, ...r.promovidos[0]!.destino.split('/'));
    const escrito = parseYaml(readFileSync(destino, 'utf8'));
    expect(escrito.procedencia).toEqual({
      corrida: corridaId,
      script: 'generar-suplentes.ts',
      script_sha: scriptShaEsperado,
      brief_sha: briefShaEsperado,
      fecha: corridaId.slice(0, 10),
    });

    const agentesJson = JSON.parse(readFileSync(path.join(corridaDir, 'agentes.json'), 'utf8')) as AgentesJson;
    expect(agentesJson.scripts).toEqual({
      'generar-suplentes.ts': {
        archivo: 'scripts/generar-suplentes.ts',
        sha256: scriptShaEsperado,
        insumos: { 'data/insumo-fixture.json': insumoShaEsperado },
      },
    });
    expect(agentesJson.agentes).toEqual({});
  });

  it('con _investigacion.modelo agrega la celda puntual salida de un modelo', () => {
    const corridaId = '2020-07-02-lacalle-pou-economia-impuestos';
    const { raiz, inboxDir } = prepararRaizPromoverScript(corridaId);
    writeFileSync(
      path.join(inboxDir, 'declaraciones.yaml'),
      stringifyYaml([declaracionCrudaDeEjemplo({ _investigacion: { script: 'generar-suplentes.ts', modelo: 'claude-haiku-fixture' } })]),
      'utf8',
    );

    const r = promover(inboxDir, { rootDir: raiz, corrida: corridaId });

    expect(r.errores).toEqual([]);
    const destino = path.join(raiz, ...r.promovidos[0]!.destino.split('/'));
    const escrito = parseYaml(readFileSync(destino, 'utf8'));
    expect(escrito.procedencia.modelo).toBe('claude-haiku-fixture');
  });

  it('rechaza un script que no existe en scripts/ con un mensaje claro', () => {
    const corridaId = '2020-07-03-lacalle-pou-economia-impuestos';
    const { raiz, inboxDir } = prepararRaizPromoverScript(corridaId);
    writeFileSync(
      path.join(inboxDir, 'declaraciones.yaml'),
      stringifyYaml([declaracionCrudaDeEjemplo({ _investigacion: { script: 'no-existe.ts' } })]),
      'utf8',
    );

    const r = promover(inboxDir, { rootDir: raiz, corrida: corridaId });

    expect(r.promovidos).toHaveLength(0);
    expect(r.errores.some((e) => e.campo === '_investigacion.script' && e.mensaje.includes('vive en scripts/'))).toBe(true);
  });

  it('rechaza un script que se sale de scripts/ hacia .cache/', () => {
    const corridaId = '2020-07-04-lacalle-pou-economia-impuestos';
    const { raiz, inboxDir } = prepararRaizPromoverScript(corridaId);
    mkdirSync(path.join(raiz, '.cache'), { recursive: true });
    writeFileSync(path.join(raiz, '.cache', 'evadido.ts'), '// no debería poder referenciarse\n', 'utf8');
    writeFileSync(
      path.join(inboxDir, 'declaraciones.yaml'),
      stringifyYaml([declaracionCrudaDeEjemplo({ _investigacion: { script: '../.cache/evadido.ts' } })]),
      'utf8',
    );

    const r = promover(inboxDir, { rootDir: raiz, corrida: corridaId });

    expect(r.promovidos).toHaveLength(0);
    expect(r.errores.some((e) => e.campo === '_investigacion.script' && e.mensaje.includes('vive en scripts/'))).toBe(true);
  });
});
