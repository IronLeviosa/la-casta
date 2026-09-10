/**
 * Cifras del último ejercicio para la tarjeta de resumen de una empresa (2.6): no calcula nada que
 * el gráfico interactivo de la ficha no calcule ya, solo elige qué mostrar arriba.
 */
import { describe, expect, it } from 'vitest';
import { cifrasTarjeta, montoTexto, puntosSerie, usdMillones, type AnioFinanzas } from '../src/lib/finanzas';

const ANCAP_LIKE: AnioFinanzas[] = [
  { anio: 2020, resultado_ejercicio: { usd: -12.4, unidad: 'millones' }, deuda_financiera: { usd: 300, unidad: 'millones' } },
  { anio: 2021, resultado_ejercicio: { usd: 5.1, unidad: 'millones' }, deuda_financiera: { usd: 280, unidad: 'millones' }, transferencias_al_estado: { usd: 10, unidad: 'millones' } },
  // 2022 no tiene balance: hueco declarado, no un año con ceros.
  {
    anio: 2023,
    resultado_ejercicio: { usd: 39.2, unidad: 'millones' },
    deuda_financiera: { usd: 260, unidad: 'millones' },
    transferencias_al_estado: { usd: 15, unidad: 'millones' },
    capitalizaciones_del_estado: { usd: 8, unidad: 'millones' },
  },
];

describe('cifrasTarjeta', () => {
  it('toma el último año con dato para cada campo, no el último de finanzas[] a secas', () => {
    const cifras = cifrasTarjeta(ANCAP_LIKE, 'resultados');
    expect(cifras.every((c) => c.anio === 2023)).toBe(true);
  });

  it('incluye resultado, deuda y transferencias, y capitalizaciones solo si el último año la tuvo', () => {
    const cifras = cifrasTarjeta(ANCAP_LIKE, 'resultados');
    expect(cifras.map((c) => c.clave)).toEqual(['resultado', 'deuda', 'transferencias', 'capitalizaciones']);
  });

  it('sin capitalización en el último año, la tarjeta no inventa un cero: la cifra no aparece', () => {
    const sinCapitalizacion = ANCAP_LIKE.map((f) => (f.anio === 2023 ? { ...f, capitalizaciones_del_estado: undefined } : f));
    const cifras = cifrasTarjeta(sinCapitalizacion, 'resultados');
    expect(cifras.map((c) => c.clave)).toEqual(['resultado', 'deuda', 'transferencias']);
  });

  it('cada cifra enlaza a la sección que recibe como parámetro, y trae texto y valor consistentes con montoTexto/usdMillones', () => {
    const cifras = cifrasTarjeta(ANCAP_LIKE, 'resultados');
    for (const c of cifras) {
      expect(c.ancla).toBe('resultados');
      expect(c.texto).toContain('USD');
    }
    const resultado = cifras.find((c) => c.clave === 'resultado')!;
    expect(resultado.valor).toBe(39.2);
    expect(resultado.texto).toBe(montoTexto({ usd: 39.2, unidad: 'millones' }));
  });

  it('la serie de cada cifra es la serie completa (con huecos como ausencia de punto, no como cero)', () => {
    const cifras = cifrasTarjeta(ANCAP_LIKE, 'resultados');
    const resultado = cifras.find((c) => c.clave === 'resultado')!;
    expect(resultado.serie).toEqual(puntosSerie(ANCAP_LIKE, (f) => f.resultado_ejercicio));
    expect(resultado.serie.map((p) => p.x)).toEqual(['2020', '2021', '2023']);
    expect(resultado.serie.some((p) => p.x === '2022')).toBe(false);
  });

  it('una empresa sin finanzas cargadas no muestra tarjeta (lista vacía)', () => {
    expect(cifrasTarjeta([], 'resultados')).toEqual([]);
  });

  it('usdMillones respeta la unidad declarada (miles, millones, unidades)', () => {
    expect(usdMillones({ usd: 39200, unidad: 'miles' })).toBe(39.2);
    expect(usdMillones({ usd: 39_200_000, unidad: 'unidades' })).toBe(39.2);
    expect(usdMillones({ pesos: 100, unidad: 'millones' })).toBeUndefined();
  });
});
