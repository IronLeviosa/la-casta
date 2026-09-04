/**
 * Lectura de las corridas hechas, para que el sitio pueda distinguir "no investigado"
 * de "investigado y no hay nada". Las dos se ven iguales y confundirlas se lee como
 * cobertura desigual, que es justo lo que la Regla 0 quiere evitar.
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fechaInvestigacion, leerCorridas } from '../src/lib/corridas.ts';

const POLITICOS = ['lacalle-pou', 'orsi', 'vazquez', 'mujica', 'batlle'];
let raiz: string;

beforeAll(() => {
  raiz = fs.mkdtempSync(path.join(os.tmpdir(), 'corridas-'));
  for (const id of [
    '2026-09-04-lacalle-pou-economia-impuestos',
    '2026-09-04-lacalle-pou-vetos',
    '2026-09-04-orsi-vetos',
    '2026-09-01-orsi-economia-impuestos',
    '2026-09-04-orsi-transparencia-corrupcion',
    'README.md-no-es-carpeta',
  ]) {
    fs.mkdirSync(path.join(raiz, 'data', 'corridas', id), { recursive: true });
    // agentes.json lo escribe `pnpm promover`: marca que la corrida se ejecutó de verdad.
    fs.writeFileSync(path.join(raiz, 'data', 'corridas', id, 'agentes.json'), '{}');
  }
  // Una corrida planificada: tiene brief pero nadie la corrió.
  fs.mkdirSync(path.join(raiz, 'data', 'corridas', '2026-09-04-vazquez-economia-impuestos'), { recursive: true });
  fs.writeFileSync(path.join(raiz, 'data', 'corridas', '2026-09-04-vazquez-economia-impuestos', 'brief.md'), '# brief\n');
  fs.writeFileSync(path.join(raiz, 'data', 'corridas', 'README.md'), '# no es una corrida\n');
});
afterAll(() => fs.rmSync(raiz, { recursive: true, force: true }));

describe('leerCorridas', () => {
  it('parte bien el slug del político aunque tenga guiones', () => {
    const c = leerCorridas(POLITICOS, raiz);
    const lp = c.filter((x) => x.politico === 'lacalle-pou');
    expect(lp.map((x) => x.objeto).sort()).toEqual(['economia-impuestos', 'vetos']);
  });

  it('ignora lo que no es una carpeta con forma de corrida', () => {
    const ids = leerCorridas(POLITICOS, raiz).map((c) => c.id);
    expect(ids).not.toContain('README.md');
    expect(ids).not.toContain('README.md-no-es-carpeta');
  });

  it('una corrida con brief pero sin ejecutar no cuenta como investigación', () => {
    // Es el caso que hacia mentir al sitio: decir "se investigó y no hay nada" sobre algo
    // que solo estaba planificado.
    const c = leerCorridas(POLITICOS, raiz);
    expect(c.some((x) => x.politico === 'vazquez')).toBe(false);
    expect(fechaInvestigacion(c, 'vazquez', 'economia-impuestos')).toBeNull();
  });

  it('devuelve vacío si no existe la carpeta', () => {
    expect(leerCorridas(POLITICOS, path.join(raiz, 'no-existe'))).toEqual([]);
  });
});

describe('fechaInvestigacion', () => {
  const corridas = () => leerCorridas(POLITICOS, raiz);

  it('dice cuándo se investigaron los vetos de alguien', () => {
    expect(fechaInvestigacion(corridas(), 'orsi', 'vetos')).toBe('2026-09-04');
  });

  it('devuelve null para quien no fue investigado', () => {
    expect(fechaInvestigacion(corridas(), 'mujica', 'vetos')).toBeNull();
  });

  it('una corrida de un subtema cuenta como cobertura del tema padre', () => {
    expect(fechaInvestigacion(corridas(), 'orsi', 'economia')).toBe('2026-09-01');
  });

  it('con varias corridas devuelve la más reciente', () => {
    fs.mkdirSync(path.join(raiz, 'data', 'corridas', '2026-09-10-orsi-vetos'), { recursive: true });
    fs.writeFileSync(path.join(raiz, 'data', 'corridas', '2026-09-10-orsi-vetos', 'agentes.json'), '{}');
    expect(fechaInvestigacion(leerCorridas(POLITICOS, raiz), 'orsi', 'vetos')).toBe('2026-09-10');
    fs.rmSync(path.join(raiz, 'data', 'corridas', '2026-09-10-orsi-vetos'), { recursive: true });
  });

  it('no confunde un objeto con otro que empieza igual', () => {
    expect(fechaInvestigacion(corridas(), 'orsi', 'veto')).toBeNull();
  });
});
