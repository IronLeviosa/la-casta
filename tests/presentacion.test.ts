/**
 * Presentación de los chequeos: párrafos, título y gráfico.
 */
import { describe, expect, it } from 'vitest';
import { parrafos } from '../src/lib/formato';
import { crearGraficoSchema } from '../src/schemas/base';

describe('parrafos', () => {
  it('separa por línea en blanco (YAML literal) y colapsa los espacios internos', () => {
    expect(parrafos('Uno dos\ntres.\n\nCuatro   cinco.\n\n\nSeis.')).toEqual(['Uno dos tres.', 'Cuatro cinco.', 'Seis.']);
  });
  it('acepta un salto simple como separador cuando no hay líneas en blanco (YAML plegado)', () => {
    expect(parrafos('Primero.\nSegundo.')).toEqual(['Primero.', 'Segundo.']);
  });
  it('un texto sin saltos es un solo párrafo; vacío es lista vacía', () => {
    expect(parrafos('Solo uno.')).toEqual(['Solo uno.']);
    expect(parrafos('')).toEqual([]);
    expect(parrafos(undefined)).toEqual([]);
  });
});

describe('grafico', () => {
  const Grafico = crearGraficoSchema();
  const base = {
    tipo: 'barras',
    titulo: 'Resultado del ejercicio',
    unidad: 'millones de USD',
    series: [{ nombre: 'Resultado', fuente: 'Estados financieros auditados', puntos: [{ x: '2019', y: 39.2 }, { x: '2020', y: -12.1 }] }],
  };
  it('acepta barras y líneas con al menos una serie con puntos y fuente', () => {
    expect(Grafico.safeParse(base).success).toBe(true);
    expect(Grafico.safeParse({ ...base, tipo: 'lineas' }).success).toBe(true);
    expect(Grafico.parse(base).colorear_por_signo).toBe(false);
  });
  it('rechaza una serie sin fuente, sin puntos, o un tipo desconocido', () => {
    expect(Grafico.safeParse({ ...base, series: [{ nombre: 'x', puntos: [{ x: 'a', y: 1 }] }] }).success).toBe(false);
    expect(Grafico.safeParse({ ...base, series: [{ nombre: 'x', fuente: 'f', puntos: [] }] }).success).toBe(false);
    expect(Grafico.safeParse({ ...base, tipo: 'torta' }).success).toBe(false);
  });
  it('rechaza campos desconocidos', () => {
    expect(Grafico.safeParse({ ...base, color: 'rojo' }).success).toBe(false);
  });
});
