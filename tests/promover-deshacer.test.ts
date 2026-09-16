/**
 * `pnpm promover --deshacer <id-corrida> [--simulacion]` (scripts/promover.ts): deshace lo que esa
 * corrida promovió y todavía no se commiteó, sin arriesgarse a tocar nada que git ya tenga.
 *
 * Nace del defecto real de la corrida de Astori (2026-09-16): `validar --inbox --red` daba 0
 * errores, `promover` escribía 41 registros en content/, y el chequeo de `content/` que corre
 * después (misma regla de evidencia, sin la relajación del inbox) rechazaba uno de ellos. No había
 * forma de deshacer esa promoción salvo borrar a mano con git, arriesgando llevarse por delante el
 * contenido de otra corrida que hubiera promovido en paralelo.
 *
 * Estos tests arman un repo git real en un directorio temporal (mismo patrón de raíz mínima que
 * tests/promover-correccion.test.ts: brief.md + un script de fixture en scripts/, sin agente ni
 * modelo por procedencia de script), para poder distinguir de verdad "sin commitear" de "ya
 * commiteado".
 */
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { stringify as stringifyYaml } from 'yaml';
import { afterAll, describe, expect, it } from 'vitest';
import { deshacerPromocion, promover } from '../scripts/promover.ts';
import { git } from '../scripts/lib/git.ts';

const temporales: string[] = [];
afterAll(() => {
  for (const d of temporales.splice(0)) rmSync(d, { recursive: true, force: true });
});

/** Registro de `declaraciones` válido, con procedencia por script (sin agente ni modelo obligatorios). */
function declaracionValida(politico: string, slug: string): Record<string, unknown> {
  return {
    _slug: slug,
    _investigacion: { script: 'generar-suplentes.ts' },
    politico,
    tema: 'economia/impuestos',
    fecha: '2020-01-01',
    contexto: 'gobierno',
    cargo_en_ese_momento: 'Presidente de la República',
    cita: 'Cita de prueba de más de veinte caracteres para pasar la validación del esquema.',
    resumen: 'Registro de prueba para pnpm promover --deshacer.',
    evidencia: {
      nivel: 'textual',
      fuentes: [
        {
          url: 'https://ejemplo.uy/prueba',
          medio: 'el-pais',
          fecha: '2020-01-01',
          tipo: 'documento_oficial',
          titulo: 'Documento de prueba',
          cita: 'Cita de prueba de más de veinte caracteres para pasar la validación del esquema.',
          retrieved_at: '2020-01-01',
        },
      ],
    },
    revision: { tier: 'publicado' },
  };
}

/** Raíz mínima con repo git: brief.md y scripts/generar-suplentes.ts ya commiteados. */
function prepararRaizGit(corridaId: string): { raiz: string; inboxDir: string } {
  const raiz = mkdtempSync(path.join(tmpdir(), 'la-casta-deshacer-'));
  temporales.push(raiz);

  mkdirSync(path.join(raiz, 'data', 'corridas', corridaId), { recursive: true });
  writeFileSync(path.join(raiz, 'data', 'corridas', corridaId, 'brief.md'), '# brief de prueba\n', 'utf8');
  mkdirSync(path.join(raiz, 'scripts'), { recursive: true });
  writeFileSync(path.join(raiz, 'scripts', 'generar-suplentes.ts'), '// script de fixture\n', 'utf8');
  mkdirSync(path.join(raiz, 'content'), { recursive: true });

  git(['init', '-q'], raiz);
  git(['config', 'user.email', 'test@example.com'], raiz);
  git(['config', 'user.name', 'Test'], raiz);
  git(['add', '-A'], raiz);
  git(['commit', '-q', '-m', 'inicial'], raiz);

  const inboxDir = path.join(raiz, 'inbox-src');
  mkdirSync(inboxDir, { recursive: true });
  return { raiz, inboxDir };
}

describe('deshacerPromocion(): borra lo que promover() acaba de escribir y sigue sin commitear', () => {
  it('borra el registro de content/ y agentes.json/edicion.diff; deja crudo/ y brief.md', () => {
    const corridaId = '2020-08-01-testpol-deshacer-1';
    const { raiz, inboxDir } = prepararRaizGit(corridaId);
    writeFileSync(path.join(inboxDir, 'declaraciones.yaml'), stringifyYaml([declaracionValida('testpol', 'prueba-1')]), 'utf8');

    const p = promover(inboxDir, { rootDir: raiz, corrida: corridaId });
    expect(p.errores).toEqual([]);
    expect(p.promovidos).toHaveLength(1);
    const destinoAbs = path.join(raiz, ...p.promovidos[0]!.destino.split('/'));
    expect(existsSync(destinoAbs)).toBe(true);

    const r = deshacerPromocion(corridaId, { rootDir: raiz });

    expect(r.simulado).toBe(false);
    expect(r.contenido).toEqual([p.promovidos[0]!.destino]);
    expect(r.artefactos.slice().sort()).toEqual([`data/corridas/${corridaId}/agentes.json`, `data/corridas/${corridaId}/edicion.diff`].sort());

    // Se borró de verdad.
    expect(existsSync(destinoAbs)).toBe(false);
    expect(existsSync(path.join(raiz, 'data', 'corridas', corridaId, 'agentes.json'))).toBe(false);
    expect(existsSync(path.join(raiz, 'data', 'corridas', corridaId, 'edicion.diff'))).toBe(false);

    // Nunca toca el rastro de investigación ni el brief.
    expect(existsSync(path.join(raiz, 'data', 'corridas', corridaId, 'crudo', 'declaraciones.yaml'))).toBe(true);
    expect(existsSync(path.join(raiz, 'data', 'corridas', corridaId, 'brief.md'))).toBe(true);
  });

  it('--simulacion lista qué borraría, sin borrar nada', () => {
    const corridaId = '2020-08-02-testpol-deshacer-2';
    const { raiz, inboxDir } = prepararRaizGit(corridaId);
    writeFileSync(path.join(inboxDir, 'declaraciones.yaml'), stringifyYaml([declaracionValida('testpol', 'prueba-2')]), 'utf8');
    const p = promover(inboxDir, { rootDir: raiz, corrida: corridaId });
    const destinoAbs = path.join(raiz, ...p.promovidos[0]!.destino.split('/'));
    const agentesAbs = path.join(raiz, 'data', 'corridas', corridaId, 'agentes.json');

    const r = deshacerPromocion(corridaId, { rootDir: raiz, simulacion: true });

    expect(r.simulado).toBe(true);
    expect(r.contenido).toEqual([p.promovidos[0]!.destino]);
    expect(r.artefactos.length).toBeGreaterThan(0);
    // Nada se borró de verdad.
    expect(existsSync(destinoAbs)).toBe(true);
    expect(existsSync(agentesAbs)).toBe(true);
  });

  it('rechaza deshacer si el contenido de la corrida ya se commiteó, y no borra nada', () => {
    const corridaId = '2020-08-03-testpol-deshacer-3';
    const { raiz, inboxDir } = prepararRaizGit(corridaId);
    writeFileSync(path.join(inboxDir, 'declaraciones.yaml'), stringifyYaml([declaracionValida('testpol', 'prueba-3')]), 'utf8');
    const p = promover(inboxDir, { rootDir: raiz, corrida: corridaId });
    const destinoRel = p.promovidos[0]!.destino;

    // Alguien (u otro proceso) ya commiteó el registro publicado antes de que se pidiera deshacer.
    git(['add', destinoRel], raiz);
    git(['commit', '-q', '-m', 'commit manual de prueba'], raiz);

    let mensaje = '';
    try {
      deshacerPromocion(corridaId, { rootDir: raiz });
      throw new Error('no debería llegar acá: tenía que rechazar el borrado');
    } catch (e) {
      mensaje = (e as Error).message;
    }
    expect(mensaje).toMatch(/no toca nada commiteado/);
    expect(mensaje).toContain(destinoRel);

    // No se borró nada, ni siquiera lo que sí estaba sin commitear (agentes.json, edicion.diff).
    expect(existsSync(path.join(raiz, ...destinoRel.split('/')))).toBe(true);
    expect(existsSync(path.join(raiz, 'data', 'corridas', corridaId, 'agentes.json'))).toBe(true);
    expect(existsSync(path.join(raiz, 'data', 'corridas', corridaId, 'edicion.diff'))).toBe(true);
  });

  it('rechaza deshacer si agentes.json ya se commiteó, y no borra el resto', () => {
    const corridaId = '2020-08-04-testpol-deshacer-4';
    const { raiz, inboxDir } = prepararRaizGit(corridaId);
    writeFileSync(path.join(inboxDir, 'declaraciones.yaml'), stringifyYaml([declaracionValida('testpol', 'prueba-4')]), 'utf8');
    const p = promover(inboxDir, { rootDir: raiz, corrida: corridaId });
    const destinoAbs = path.join(raiz, ...p.promovidos[0]!.destino.split('/'));

    git(['add', `data/corridas/${corridaId}/agentes.json`], raiz);
    git(['commit', '-q', '-m', 'commit manual de agentes.json'], raiz);

    expect(() => deshacerPromocion(corridaId, { rootDir: raiz })).toThrow(/agentes\.json/);
    expect(existsSync(destinoAbs)).toBe(true);
  });

  it('sin nada para deshacer (corrida sin promociones pendientes), no borra ni falla', () => {
    const corridaId = '2020-08-05-testpol-deshacer-vacio';
    const { raiz } = prepararRaizGit(corridaId);
    const r = deshacerPromocion(corridaId, { rootDir: raiz });
    expect(r.contenido).toEqual([]);
    expect(r.artefactos).toEqual([]);
  });

  it('rechaza un id de corrida con formato inválido', () => {
    const raiz = mkdtempSync(path.join(tmpdir(), 'la-casta-deshacer-'));
    temporales.push(raiz);
    git(['init', '-q'], raiz);
    expect(() => deshacerPromocion('no-es-un-id-valido', { rootDir: raiz })).toThrow(/Id de corrida inválido/);
  });

  it('rechaza correr fuera de un repositorio git', () => {
    const raiz = mkdtempSync(path.join(tmpdir(), 'la-casta-deshacer-sin-git-'));
    temporales.push(raiz);
    expect(() => deshacerPromocion('2020-08-06-testpol-deshacer', { rootDir: raiz })).toThrow(/repositorio git/);
  });
});
