/**
 * Kappa de Cohen. Sirve para dos comparaciones del proyecto: los dos clasificadores
 * de sustancia (Sonnet y Opus a ciegas) y los dos brazos del experimento de modelos.
 */
import { describe, expect, it } from 'vitest';
import { kappaDeCohen } from '../scripts/lib/kappa.ts';

describe('kappa de Cohen', () => {
  it('acuerdo perfecto con dos categorías usadas da 1', () => {
    const r = kappaDeCohen([
      ['publicado', 'publicado'],
      ['probable', 'probable'],
      ['publicado', 'publicado'],
      ['probable', 'probable'],
    ]);
    expect(r.kappa).toBe(1);
    expect(r.acuerdo).toBe(1);
    expect(r.interpretacion).toBe('casi total');
  });

  it('descuenta el acuerdo por azar: coincidir siempre en la categoría dominante no es mérito', () => {
    // 9 de 10 coinciden, pero los dos ponen casi siempre "publicado".
    const pares: [string, string][] = Array.from({ length: 9 }, () => ['publicado', 'publicado'] as [string, string]);
    pares.push(['probable', 'publicado']);
    const r = kappaDeCohen(pares);
    expect(r.acuerdo).toBeCloseTo(0.9, 6);
    expect(r.kappa).toBeLessThan(0.2); // acuerdo alto, kappa leve
  });

  it('devuelve null cuando los dos usaron una sola categoría', () => {
    const r = kappaDeCohen([
      ['publicado', 'publicado'],
      ['publicado', 'publicado'],
    ]);
    expect(r.kappa).toBeNull();
    expect(r.interpretacion).toContain('indefinido');
  });

  it('desacuerdo total sobre dos categorías balanceadas da kappa negativo', () => {
    const r = kappaDeCohen([
      ['publicado', 'probable'],
      ['probable', 'publicado'],
      ['publicado', 'probable'],
      ['probable', 'publicado'],
    ]);
    expect(r.kappa).toBe(-1);
    expect(r.interpretacion).toBe('peor que el azar');
  });

  it('coincide con el valor clásico de un ejemplo conocido', () => {
    // Matriz 2x2: 20 sí/sí, 5 sí/no, 10 no/sí, 15 no/no (n = 50).
    // po = 0,70; pe = (25/50)(30/50) + (25/50)(20/50) = 0,50; kappa = 0,40.
    const pares: [string, string][] = [
      ...Array.from({ length: 20 }, () => ['si', 'si'] as [string, string]),
      ...Array.from({ length: 5 }, () => ['si', 'no'] as [string, string]),
      ...Array.from({ length: 10 }, () => ['no', 'si'] as [string, string]),
      ...Array.from({ length: 15 }, () => ['no', 'no'] as [string, string]),
    ];
    const r = kappaDeCohen(pares);
    expect(r.acuerdo).toBeCloseTo(0.7, 6);
    expect(r.esperado).toBeCloseTo(0.5, 6);
    expect(r.kappa).toBeCloseTo(0.4, 6);
  });

  it('sin items en común no inventa un número', () => {
    const r = kappaDeCohen([]);
    expect(r.kappa).toBeNull();
    expect(r.n).toBe(0);
  });
});
