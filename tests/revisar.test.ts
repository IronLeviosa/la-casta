/**
 * Prechequeos de `pnpm revisar <inbox-dir> antes` (docs/plan-2026-09.md, fase 1, ítem 1.3):
 * colisión de `_slug` contra `content/`, brief que cambió después de promover, y que el crudo
 * ya congelado no se pisa aunque el editor ya haya pasado por el lote. La cadena completa
 * (validar, promover, archivar, build) se prueba a mano; acá solo las funciones puras que
 * deciden si hay que cortar antes de gastar esos pasos.
 */
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { promover } from '../scripts/promover.ts';
import { chequearBriefExiste, chequearBriefNoCambio, colisionesDeSlug, crudoYaCongelado, diffProbablementeNoVacio, prepararCarpetaDeLote, resolverModeloInvestigador } from '../scripts/revisar.ts';
import { FIXTURE_OK, limpiarFixtures, prepararFixture } from './ayuda.ts';

const temporales: string[] = [];
function dirTemporal(): string {
  const dir = mkdtempSync(path.join(tmpdir(), 'revisar-'));
  temporales.push(dir);
  return dir;
}
afterAll(() => {
  limpiarFixtures();
  for (const d of temporales.splice(0)) rmSync(d, { recursive: true, force: true });
});

const CORRIDA_FIXTURE = '2020-05-01-lacalle-pou-economia-impuestos';

describe('chequearBriefExiste()', () => {
  it('ok cuando data/corridas/<id>/brief.md existe', () => {
    const raiz = prepararFixture();
    expect(chequearBriefExiste(raiz, CORRIDA_FIXTURE).ok).toBe(true);
  });

  it('falla con un motivo claro cuando falta el brief', () => {
    const raiz = dirTemporal();
    const r = chequearBriefExiste(raiz, '2026-01-01-alguien-tema');
    expect(r.ok).toBe(false);
    expect(r.motivo).toMatch(/brief\.md/);
  });
});

describe('prepararCarpetaDeLote()', () => {
  it('sin --lote, la carpeta de trabajo es la de la corrida misma', () => {
    const raiz = prepararFixture();
    const r = prepararCarpetaDeLote(raiz, CORRIDA_FIXTURE);
    expect(r.corridaId).toBe(CORRIDA_FIXTURE);
    expect(r.briefCopiado).toBe(false);
  });

  it('con --lote, crea data/corridas/<id>-<lote>/ y copia el brief una sola vez', () => {
    const raiz = prepararFixture();
    const primero = prepararCarpetaDeLote(raiz, CORRIDA_FIXTURE, 'lote1');
    expect(primero.corridaId).toBe(`${CORRIDA_FIXTURE}-lote1`);
    expect(primero.briefCopiado).toBe(true);

    // Una segunda llamada (como si /revisar antes se corriera de nuevo) no vuelve a copiar.
    const segundo = prepararCarpetaDeLote(raiz, CORRIDA_FIXTURE, 'lote1');
    expect(segundo.briefCopiado).toBe(false);
  });
});

describe('chequearBriefNoCambio()', () => {
  it('ok cuando el brief no cambió desde que se promovió', () => {
    const raiz = prepararFixture();
    expect(chequearBriefNoCambio(raiz, CORRIDA_FIXTURE)).toEqual({ ok: true });
  });

  it('falla cuando el brief.md de la corrida ya promovida cambió', () => {
    const raiz = prepararFixture();
    const briefPath = path.join(raiz, 'data', 'corridas', CORRIDA_FIXTURE, 'brief.md');
    writeFileSync(briefPath, '# Brief cambiado a mano después de promover\n');
    const r = chequearBriefNoCambio(raiz, CORRIDA_FIXTURE);
    expect(r.ok).toBe(false);
    expect(r.motivo).toMatch(/brief\.md cambió después de promover/);
  });

  it('ok cuando todavía no se promovió nada con ese id (nada que comparar)', () => {
    const raiz = prepararFixture();
    // Ninguna corrida real usa este id: no hay procedencia que apunte a él.
    expect(chequearBriefNoCambio(raiz, '2020-05-01-otra-corrida-sin-uso').ok).toBe(true);
  });
});

describe('colisionesDeSlug()', () => {
  it('detecta un _slug del lote que ya existe en content/', () => {
    const raiz = prepararFixture();
    const inboxDir = dirTemporal();
    // El mismo político + fecha + _slug que content/declaraciones/lacalle-pou/2019-10-15-no-subir-impuestos.yaml.
    writeFileSync(
      path.join(inboxDir, 'declaraciones.yaml'),
      '- politico: lacalle-pou\n' + '  fecha: 2019-10-15\n' + '  _slug: no-subir-impuestos\n' + '  cita: "Otra cita cualquiera."\n' + '  resumen: "Otro resumen cualquiera."\n',
    );
    const colisiones = colisionesDeSlug(raiz, inboxDir);
    expect(colisiones).toHaveLength(1);
    expect(colisiones[0]).toMatchObject({ coleccion: 'declaraciones', id: 'lacalle-pou/2019-10-15-no-subir-impuestos' });
  });

  it('sin colisión cuando el id derivado es nuevo', () => {
    const raiz = prepararFixture();
    const inboxDir = dirTemporal();
    writeFileSync(
      path.join(inboxDir, 'declaraciones.yaml'),
      '- politico: lacalle-pou\n' + '  fecha: 2024-01-01\n' + '  _slug: promesa-completamente-nueva\n' + '  cita: "Una cita nueva."\n' + '  resumen: "Un resumen nuevo."\n',
    );
    expect(colisionesDeSlug(raiz, inboxDir)).toEqual([]);
  });

  it('una hipótesis no se promueve, así que tampoco puede colisionar', () => {
    const raiz = prepararFixture();
    const inboxDir = dirTemporal();
    writeFileSync(
      path.join(inboxDir, 'declaraciones.yaml'),
      '- politico: lacalle-pou\n' +
        '  fecha: 2019-10-15\n' +
        '  _slug: no-subir-impuestos\n' +
        '  cita: "Otra cita cualquiera."\n' +
        '  resumen: "Otro resumen cualquiera."\n' +
        '  revision:\n' +
        '    tier: hipotesis\n',
    );
    expect(colisionesDeSlug(raiz, inboxDir)).toEqual([]);
  });
});

describe('crudo ya congelado no se pisa', () => {
  it('crudoYaCongelado() detecta que ya hay una foto y no hace falta congelar de nuevo', () => {
    const raiz = dirTemporal();
    const id = '2026-01-01-alguien-tema';
    mkdirSync(path.join(raiz, 'data', 'corridas', id, 'crudo'), { recursive: true });
    expect(crudoYaCongelado(raiz, id)).toBe(true);
    expect(crudoYaCongelado(raiz, '2026-01-01-otra-sin-crudo')).toBe(false);
  });

  it('promover --solo-crudo nunca pisa el crudo ya congelado, aunque el editor haya cambiado el inbox', () => {
    const raiz = dirTemporal();
    const id = '2026-01-01-alguien-tema';
    const corridaDir = path.join(raiz, 'data', 'corridas', id);
    const crudoDir = path.join(corridaDir, 'crudo');
    mkdirSync(crudoDir, { recursive: true });
    writeFileSync(path.join(corridaDir, 'brief.md'), '# brief\n');
    const original = '- politico: alguien\n  fecha: 2026-01-01\n  cita: "Versión del investigador."\n';
    writeFileSync(path.join(crudoDir, 'declaraciones.yaml'), original);

    // El inbox ahora tiene la versión editada (como si el editor ya hubiera pasado).
    const inboxDir = dirTemporal();
    writeFileSync(path.join(inboxDir, 'declaraciones.yaml'), '- politico: alguien\n  fecha: 2026-01-01\n  cita: "Versión editada por el editor."\n');

    expect(crudoYaCongelado(raiz, id)).toBe(true);
    // Alguien vuelve a correr "antes" (o promover --solo-crudo a mano) sobre el mismo id.
    const r = promover(inboxDir, { rootDir: raiz, corrida: id, soloCrudo: true });
    expect(r.soloCrudo).toBe(true);
    const despues = readFileSync(path.join(crudoDir, 'declaraciones.yaml'), 'utf8');
    expect(despues).toBe(original);
  });
});

describe('diffProbablementeNoVacio()', () => {
  it('vacío cuando el inbox es idéntico byte a byte al crudo', () => {
    const raiz = dirTemporal();
    const corridaDir = path.join(raiz, 'data', 'corridas', 'x');
    mkdirSync(path.join(corridaDir, 'crudo'), { recursive: true });
    const contenido = '- a: 1\n';
    writeFileSync(path.join(corridaDir, 'crudo', 'declaraciones.yaml'), contenido);
    const inboxDir = dirTemporal();
    writeFileSync(path.join(inboxDir, 'declaraciones.yaml'), contenido);
    expect(diffProbablementeNoVacio(inboxDir, corridaDir)).toBe(false);
  });

  it('no vacío cuando el editor cambió un archivo del lote', () => {
    const raiz = dirTemporal();
    const corridaDir = path.join(raiz, 'data', 'corridas', 'x');
    mkdirSync(path.join(corridaDir, 'crudo'), { recursive: true });
    writeFileSync(path.join(corridaDir, 'crudo', 'declaraciones.yaml'), '- a: 1\n');
    const inboxDir = dirTemporal();
    writeFileSync(path.join(inboxDir, 'declaraciones.yaml'), '- a: 2\n');
    expect(diffProbablementeNoVacio(inboxDir, corridaDir)).toBe(true);
  });

  it('no vacío cuando no hay crudo/ para comparar (no se puede asegurar que esté vacío)', () => {
    const raiz = dirTemporal();
    const corridaDir = path.join(raiz, 'data', 'corridas', 'sin-crudo');
    const inboxDir = dirTemporal();
    expect(diffProbablementeNoVacio(inboxDir, corridaDir)).toBe(true);
  });
});

describe('resolverModeloInvestigador()', () => {
  it('usa --modelo si viene', () => {
    expect(resolverModeloInvestigador('no/importa', 'claude-sonnet-5')).toEqual({ modelo: 'claude-sonnet-5' });
  });

  it('si no, lee agentes.investigador.modelo de agentes.json de la corrida', () => {
    const dir = dirTemporal();
    writeFileSync(path.join(dir, 'agentes.json'), JSON.stringify({ agentes: { investigador: { archivo: '.claude/agents/investigador.md', sha256: '0'.repeat(64), modelo: 'claude-sonnet-5' } } }));
    expect(resolverModeloInvestigador(dir)).toEqual({ modelo: 'claude-sonnet-5' });
  });

  it('sin --modelo y sin agentes.json, error claro', () => {
    const dir = dirTemporal();
    const r = resolverModeloInvestigador(dir);
    expect(r.modelo).toBeUndefined();
    expect(r.motivo).toMatch(/--modelo/);
  });
});

// Confirma que la fixture compartida no cambió de forma incompatible con estos tests.
describe('fixture compartida', () => {
  it('tests/fixtures/ok trae la corrida de ejemplo que usan estos tests', () => {
    expect(FIXTURE_OK).toMatch(/fixtures[\\/]ok$/);
  });
});
