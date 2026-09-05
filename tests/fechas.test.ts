/**
 * Fechas con precisión parcial en los mandatos.
 *
 * El esquema acepta `1990`, `1990-03` y `1990-03-05` porque exigir día exacto no hacía el dato más
 * preciso: lo hacía desaparecer, y no parejo — se perdía lo más viejo y lo menos cubierto por la
 * prensa. Lo que estas pruebas cuidan es que aceptar la imprecisión no la propague: al comparar se
 * completan los extremos, y al mostrar se dice solo lo que la fuente dijo.
 */
import { describe, expect, it } from 'vitest';
import { completarFecha, precisionFecha } from '../src/schemas/base.ts';
import { fechaParcialLarga } from '../src/lib/formato.ts';

describe('completarFecha()', () => {
  it('un año abarca desde su primer día hasta el último', () => {
    expect(completarFecha('1990', 'inicio')).toBe('1990-01-01');
    expect(completarFecha('1990', 'fin')).toBe('1990-12-31');
  });

  it('un mes abarca desde su primer día hasta el último, contando los de 28, 30 y 31', () => {
    expect(completarFecha('1990-03', 'inicio')).toBe('1990-03-01');
    expect(completarFecha('1990-03', 'fin')).toBe('1990-03-31');
    expect(completarFecha('1990-04', 'fin')).toBe('1990-04-30');
    expect(completarFecha('1990-02', 'fin')).toBe('1990-02-28');
    expect(completarFecha('2020-02', 'fin')).toBe('2020-02-29');
  });

  it('una fecha completa se devuelve igual', () => {
    expect(completarFecha('1990-03-05', 'inicio')).toBe('1990-03-05');
    expect(completarFecha('1990-03-05', 'fin')).toBe('1990-03-05');
  });

  it('ordena el año antes que un día de ese mismo año', () => {
    // Comparar los textos crudos deja "1990" después de "1990-03-05" en algunos órdenes; el punto
    // de completar es que un mandato que empieza "en 1990" no se dibuje después de uno de marzo.
    const a = completarFecha('1990', 'inicio');
    const b = completarFecha('1990-03-05', 'inicio');
    expect(a < b).toBe(true);
  });
});

describe('precisionFecha()', () => {
  it('distingue año, mes y día', () => {
    expect(precisionFecha('1990')).toBe('anio');
    expect(precisionFecha('1990-03')).toBe('mes');
    expect(precisionFecha('1990-03-05')).toBe('dia');
  });
});

describe('fechaParcialLarga()', () => {
  it('no inventa precisión que la fuente no tiene', () => {
    expect(fechaParcialLarga('1990')).toBe('1990');
    expect(fechaParcialLarga('1990-03')).toBe('marzo de 1990');
    expect(fechaParcialLarga('1990-03-05')).toBe('5 de marzo de 1990');
  });

  it('con vacío devuelve vacío', () => {
    expect(fechaParcialLarga(null)).toBe('');
    expect(fechaParcialLarga(undefined)).toBe('');
  });
});
