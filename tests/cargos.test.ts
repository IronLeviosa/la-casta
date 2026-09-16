/**
 * El contador de la sección de vetos cuenta meses de presidencia, no de cualquier cargo. La ficha
 * de Astori decía «394 meses de mandato sin vetos registrados» sumando Senado, ministerio y
 * vicepresidencia (2026-09-16): un cero sobre cargos que no vetan se lee como conducta y es tiempo
 * en un cargo que no tiene esa facultad.
 */
import { describe, expect, it } from 'vitest';
import { mesesDePresidencia, tipoDeCargo } from '../src/lib/cargos.ts';
import { completarFecha } from '../src/schemas/base.ts';

const hoy = new Date('2026-09-16');

describe('mesesDePresidencia()', () => {
  it('suma solo los mandatos presidenciales', () => {
    const mandatos = [
      { cargo: 'Senador de la República', desde: '1990-02-15', hasta: '2005-03-01' },
      { cargo: 'Presidente de la República', desde: '2005-03-01', hasta: '2010-03-01' },
      { cargo: 'Ministro de Economía y Finanzas', desde: '2015-03-01', hasta: '2020-03-01' },
    ];
    expect(mesesDePresidencia(mandatos, completarFecha, hoy)).toBe(60);
  });

  it('devuelve 0 para quien nunca fue presidente, aunque tenga décadas de mandato', () => {
    const mandatos = [
      { cargo: 'Senador de la República', desde: '1990-02-15', hasta: '2005-03-01' },
      { cargo: 'Vicepresidente de la República', desde: '2010-03-01', hasta: '2015-03-01' },
      { cargo: 'Ministro de Economía y Finanzas', desde: '2015-03-01', hasta: '2020-03-01' },
    ];
    expect(mesesDePresidencia(mandatos, completarFecha, hoy)).toBe(0);
  });

  it('cierra en hoy un mandato presidencial abierto y acepta fechas con precisión de año', () => {
    expect(mesesDePresidencia([{ cargo: 'Presidente de la República', desde: '2025-03-01' }], completarFecha, hoy)).toBe(18);
    // '2000' se completa a 2000-01-01 y '2004' a 2004-12-31.
    expect(mesesDePresidencia([{ cargo: 'Presidenta de la República', desde: '2000', hasta: '2004' }], completarFecha, hoy)).toBe(59);
  });

  it('no cuenta una presidencia suplente ni un cargo que no clasifica como presidencia', () => {
    expect(tipoDeCargo('Presidente de la República (suplente)')).toBe('presidencia');
    expect(mesesDePresidencia([{ cargo: 'Presidente de la República (suplente)', desde: '2010-03-01', hasta: '2010-04-01' }], completarFecha, hoy)).toBe(0);
    expect(mesesDePresidencia([{ cargo: 'Presidente de la Cámara de Senadores', desde: '2010-03-01', hasta: '2011-03-01' }], completarFecha, hoy)).toBe(0);
  });
});
