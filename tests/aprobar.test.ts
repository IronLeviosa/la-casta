/**
 * La compuerta humana, de punta a punta: `pnpm aprobar` escribe un hash que el
 * validador acepta, y cualquier edición posterior lo invalida sola.
 */
import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { aprobar } from '../scripts/aprobar.ts';
import { validar } from '../scripts/validar.ts';
import { limpiarFixtures, prepararFixture } from './ayuda.ts';

afterAll(limpiarFixtures);

const CASO = 'content/casos/caso-de-prueba.yaml';
const OPCIONES = { escribirSimetria: false as const };

describe('aprobar()', () => {
  it('escribe un hash que el validador acepta', async () => {
    const raiz = prepararFixture();
    rmSync(path.join(raiz, 'data', 'aprobaciones.json'));

    const sinAprobar = await validar({ rootDir: raiz, ...OPCIONES });
    expect(sinAprobar.codigo).toBe(1);
    expect(sinAprobar.errores.map((e) => e.mensaje).join('\n')).toContain('Sin aprobación humana');

    const r = aprobar(path.join(raiz, CASO), { por: 'Mantenedor', fecha: '2020-05-02' });
    expect(r.yaAprobado).toBe(false);
    expect(r.aprobacion.coleccion).toBe('casos');
    expect(r.aprobacion.id).toBe('caso-de-prueba');

    const aprobado = await validar({ rootDir: raiz, ...OPCIONES });
    expect(aprobado.errores).toEqual([]);
    expect(aprobado.codigo).toBe(0);
  });

  it('una edición posterior invalida la aprobación', async () => {
    const raiz = prepararFixture();
    const ruta = path.join(raiz, CASO);
    writeFileSync(ruta, readFileSync(ruta, 'utf8').replace('tipo: corrupcion', 'tipo: delito_grave'), 'utf8');

    const r = await validar({ rootDir: raiz, ...OPCIONES });
    expect(r.codigo).toBe(1);
    expect(r.errores.map((e) => e.mensaje).join('\n')).toContain('Aprobación desactualizada');
  });

  it('las notas internas del editor no cambian el hash', () => {
    const raiz = prepararFixture();
    const ruta = path.join(raiz, CASO);
    const antes = aprobar(ruta, { simulacion: true }).aprobacion.hash;
    writeFileSync(ruta, readFileSync(ruta, 'utf8').replace('  tier: publicado', '  tier: publicado\n  notas_internas: revisar la fuente 2 el mes que viene'), 'utf8');
    const despues = aprobar(ruta, { simulacion: true }).aprobacion.hash;
    expect(despues).toBe(antes);
  });

  it('ningún agente puede aprobar', () => {
    const raiz = prepararFixture();
    const previo = process.env.LA_CASTA_AGENTE;
    process.env.LA_CASTA_AGENTE = 'investigador';
    try {
      expect(() => aprobar(path.join(raiz, CASO))).toThrow(/ningún agente/);
    } finally {
      if (previo === undefined) delete process.env.LA_CASTA_AGENTE;
      else process.env.LA_CASTA_AGENTE = previo;
    }
  });
});
