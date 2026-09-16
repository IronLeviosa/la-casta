/**
 * Partes puras de `pnpm descubrir`: ordenar candidatas por relevancia y recortar la salida.
 *
 * Motivo: un rango amplio con varios `--terminos` devolvía 400+ URLs (55.000-61.000 caracteres),
 * que Claude Code vuelca a un archivo y el agente relee entero pagando el costo dos veces, cuando
 * un investigador de verdad usa 20. Estas pruebas cuidan que el orden por relevancia y el corte a
 * 40 (por defecto) sean deterministas, sin red de por medio.
 */
import { describe, expect, it } from 'vitest';
import { type Candidata, ordenarCandidatas, recortar, relevanciaCandidata } from '../scripts/lib/sitemaps.ts';

const c = (url: string, lastmod: string | null = null, titulo: string | null = null): Candidata => ({ url, lastmod, titulo });

describe('relevanciaCandidata()', () => {
  it('sin términos, la relevancia es siempre 0', () => {
    expect(relevanciaCandidata(c('https://x.uy/astori-impuestos'), [])).toBe(0);
  });

  it('cuenta términos que aparecen en la URL decodificada', () => {
    expect(relevanciaCandidata(c('https://x.uy/2019/astori-irpf'), ['astori', 'irpf', 'ancap'])).toBe(2);
  });

  it('decodifica %xx antes de buscar', () => {
    expect(relevanciaCandidata(c('https://x.uy/astori-%C3%ADass'), ['íass'])).toBe(1);
  });

  it('un término que aparece en la URL y en el título cuenta una sola vez (unión, no suma)', () => {
    expect(relevanciaCandidata(c('https://x.uy/astori', null, 'Astori habla de Astori'), ['astori'])).toBe(1);
  });

  it('un término solo en el título también cuenta', () => {
    expect(relevanciaCandidata(c('https://x.uy/nota-123', null, 'Astori y el IRPF'), ['astori', 'irpf'])).toBe(2);
  });

  it('es insensible a mayúsculas', () => {
    expect(relevanciaCandidata(c('https://x.uy/Astori-IRPF'), ['astori', 'irpf'])).toBe(2);
  });
});

describe('ordenarCandidatas()', () => {
  it('ordena por cantidad de términos de mayor a menor', () => {
    const sinTerminos = c('https://x.uy/otra-cosa', '2020-01-01');
    const unTermino = c('https://x.uy/astori-viaje', '2020-01-01');
    const dosTerminos = c('https://x.uy/astori-irpf', '2020-01-01');
    const orden = ordenarCandidatas([sinTerminos, unTermino, dosTerminos], ['astori', 'irpf']);
    expect(orden.map((x) => x.url)).toEqual([dosTerminos.url, unTermino.url, sinTerminos.url]);
  });

  it('a igual relevancia, ordena por fecha más reciente primero', () => {
    const vieja = c('https://x.uy/astori-2015', '2015-03-01');
    const nueva = c('https://x.uy/astori-2020', '2020-06-01');
    const orden = ordenarCandidatas([vieja, nueva], ['astori']);
    expect(orden.map((x) => x.url)).toEqual([nueva.url, vieja.url]);
  });

  it('sin lastmod queda al final del empate', () => {
    const conFecha = c('https://x.uy/astori-a', '2020-01-01');
    const sinFecha = c('https://x.uy/astori-b', null);
    const orden = ordenarCandidatas([sinFecha, conFecha], ['astori']);
    expect(orden.map((x) => x.url)).toEqual([conFecha.url, sinFecha.url]);
  });

  it('sin términos, el orden queda solo por fecha reciente', () => {
    const vieja = c('https://x.uy/a', '2015-01-01');
    const nueva = c('https://x.uy/b', '2021-01-01');
    expect(ordenarCandidatas([vieja, nueva], []).map((x) => x.url)).toEqual([nueva.url, vieja.url]);
  });

  it('no muta el arreglo original', () => {
    const original = [c('https://x.uy/a', '2015-01-01'), c('https://x.uy/b', '2021-01-01')];
    const copia = [...original];
    ordenarCandidatas(original, []);
    expect(original).toEqual(copia);
  });
});

describe('recortar()', () => {
  const candidatas = Array.from({ length: 100 }, (_, i) => c(`https://x.uy/nota-${i}`));

  it('por defecto se queda con las primeras 40 y avisa que truncó', () => {
    const { mostradas, truncado } = recortar(candidatas);
    expect(mostradas).toHaveLength(40);
    expect(truncado).toBe(true);
  });

  it('--maximo cambia el corte', () => {
    const { mostradas, truncado } = recortar(candidatas, { maximo: 10 });
    expect(mostradas).toHaveLength(10);
    expect(truncado).toBe(true);
  });

  it('--todas devuelve todo sin truncar', () => {
    const { mostradas, truncado } = recortar(candidatas, { todas: true });
    expect(mostradas).toHaveLength(100);
    expect(truncado).toBe(false);
  });

  it('si hay menos candidatas que el máximo, no trunca', () => {
    const pocas = candidatas.slice(0, 5);
    const { mostradas, truncado } = recortar(pocas, { maximo: 40 });
    expect(mostradas).toHaveLength(5);
    expect(truncado).toBe(false);
  });
});
