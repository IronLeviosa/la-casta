/**
 * Etiquetado por alias: dos reglas para no ensuciar `pnpm corpus:buscar --politico` con falsos
 * positivos por nombre compartido o por anacronismo.
 *
 * Caso real que las motiva: un diario de sesiones del Senado de marzo de 1990 quedó etiquetado con
 * `lacalle-pou`, `delgado` y `orsi`. En 1990 "Lacalle" era Luis Alberto Lacalle Herrera (el padre,
 * presidente electo ese año) y ni Álvaro Delgado ni Yamandú Orsi tenían vida pública. Estas pruebas
 * son herméticas: arman su propia `Taxonomia` y sus propias fichas, sin tocar `content/`.
 */
import { describe, expect, it } from 'vitest';
import { etiquetarPorAlias, taxonomiaDesdeFichas, type EntradaTaxonomia, type FichaPolitico, type Taxonomia } from '../scripts/corpus/etiquetar.ts';
import { etiquetasVacias } from '../scripts/corpus/tipos.ts';

/** Taxonomia minima con un solo politico, para no repetir partidos/temas/eventos vacios. */
function taxonomiaCon(politico: Partial<EntradaTaxonomia> & { slug: string; alias: string[] }): Taxonomia {
  return {
    politicos: [{ nombre: politico.slug, temas: [], ...politico }],
    partidos: [],
    temas: [],
    eventos: [],
  };
}

describe('etiquetarPorAlias() — ventana de fechas', () => {
  it('no etiqueta a alguien cuya alias es ambiguo si el texto no trae un alias propio (1990)', () => {
    // "Lacalle" ya no esta en `alias` (lo saco taxonomiaDesdeFichas): a nivel de etiquetarPorAlias
    // esto se ve como que el alias ambiguo simplemente no forma parte de la lista.
    const taxonomia = taxonomiaCon({ slug: 'lacalle-pou', alias: ['Lacalle Pou', 'Luis Lacalle Pou'], actividad_desde: 1995 });
    const r1990 = etiquetarPorAlias('El senador Lacalle habló en la sesión de hoy.', '1990-03-05', taxonomia);
    expect(r1990.politicos).not.toContain('lacalle-pou');
    expect(r1990.menciones).toEqual([]);
  });

  it('etiqueta con el alias no ambiguo "Lacalle Pou" en una nota de 2020', () => {
    const taxonomia = taxonomiaCon({ slug: 'lacalle-pou', alias: ['Lacalle Pou', 'Luis Lacalle Pou'], actividad_desde: 1995 });
    const r2020 = etiquetarPorAlias('El presidente Lacalle Pou habló hoy.', '2020-05-01', taxonomia);
    expect(r2020.politicos).toContain('lacalle-pou');
    expect(r2020.menciones.some((m) => m.politico === 'lacalle-pou')).toBe(true);
  });

  it('"Lacalle" solo, en 2020, tampoco etiqueta a lacalle-pou (alias ambiguo, no por fecha)', () => {
    const taxonomia = taxonomiaCon({ slug: 'lacalle-pou', alias: ['Lacalle Pou', 'Luis Lacalle Pou'], actividad_desde: 1995 });
    const r = etiquetarPorAlias('Lacalle dio una conferencia de prensa.', '2020-05-01', taxonomia);
    expect(r.politicos).not.toContain('lacalle-pou');
  });

  it('con actividad_desde = 2000, una nota de 1990 no etiqueta y una de 2001 sí', () => {
    // actividad_desde = primer mandato (2005) - 5 = 2000.
    const taxonomia = taxonomiaCon({ slug: 'alguien', alias: ['Alguien'], actividad_desde: 2000 });
    const r1990 = etiquetarPorAlias('Alguien dijo algo.', '1990-01-01', taxonomia);
    expect(r1990.politicos).not.toContain('alguien');
    expect(r1990.menciones).toEqual([]);

    const r2001 = etiquetarPorAlias('Alguien dijo algo.', '2001-01-01', taxonomia);
    expect(r2001.politicos).toContain('alguien');
  });

  it('sin mandatos ni candidaturas con fecha (actividad_desde undefined), se etiqueta sin importar la fecha de la nota', () => {
    const taxonomia = taxonomiaCon({ slug: 'sin-fechas', alias: ['Sin Fechas'], actividad_desde: undefined });
    const r1900 = etiquetarPorAlias('Sin Fechas participó del debate.', '1900-01-01', taxonomia);
    expect(r1900.politicos).toContain('sin-fechas');
  });

  it('una nota sin fecha se etiqueta por alias no ambiguo como si fuera de hoy', () => {
    const taxonomia = taxonomiaCon({ slug: 'lacalle-pou', alias: ['Lacalle Pou'], actividad_desde: 1995 });
    const r = etiquetarPorAlias('Lacalle Pou habló.', null, taxonomia);
    expect(r.politicos).toContain('lacalle-pou');
  });

  it('devuelve etiquetas vacías si el texto no menciona a nadie de la taxonomía', () => {
    const taxonomia = taxonomiaCon({ slug: 'lacalle-pou', alias: ['Lacalle Pou'], actividad_desde: 1995 });
    const r = etiquetarPorAlias('Una nota sin ningún nombre relevante.', '2020-01-01', taxonomia);
    expect(r).toEqual(etiquetasVacias());
  });
});

describe('taxonomiaDesdeFichas() — construcción de la taxonomía desde las fichas', () => {
  function ficha(datos: Record<string, unknown>): FichaPolitico {
    return { slug: String(datos.slug ?? 'x'), datos };
  }

  it('saca los alias_ambiguos de `alias` pero los deja visibles en `alias_ambiguos`', () => {
    const [entrada] = taxonomiaDesdeFichas([
      ficha({
        slug: 'lacalle-pou',
        nombre: 'Luis Alberto Lacalle Pou',
        alias: ['Lacalle Pou', 'Luis Lacalle Pou', 'Lacalle'],
        alias_ambiguos: [{ alias: 'Lacalle', nota: 'También es el padre, Lacalle Herrera.' }],
        mandatos: [],
      }),
    ]);
    expect(entrada.alias).toEqual(expect.arrayContaining(['Lacalle Pou', 'Luis Lacalle Pou']));
    expect(entrada.alias).not.toContain('Lacalle');
    expect(entrada.alias_ambiguos).toEqual(['Lacalle']);
  });

  it('calcula actividad_desde como el año más temprano entre mandatos y candidaturas, menos 5', () => {
    const [entrada] = taxonomiaDesdeFichas([
      ficha({
        slug: 'delgado',
        nombre: 'Álvaro Delgado',
        alias: ['Delgado'],
        mandatos: [{ cargo: 'Senador', desde: '2015-02-15' }],
        candidaturas: [{ cargo: 'Presidencia', fecha: '2024-10-27' }],
      }),
    ]);
    // La fecha más temprana es el mandato de 2015 (no la candidatura de 2024): 2015 - 5 = 2010.
    expect(entrada.actividad_desde).toBe(2010);
  });

  it('acepta un `desde` con precisión de solo año (FechaParcial)', () => {
    const [entrada] = taxonomiaDesdeFichas([
      ficha({ slug: 'x', nombre: 'X', alias: ['X'], mandatos: [{ cargo: 'Director', desde: '1990' }] }),
    ]);
    expect(entrada.actividad_desde).toBe(1985);
  });

  it('sin mandatos ni candidaturas, actividad_desde queda undefined', () => {
    const [entrada] = taxonomiaDesdeFichas([ficha({ slug: 'sin-fechas', nombre: 'Sin Fechas', alias: ['Sin Fechas'], mandatos: [] })]);
    expect(entrada.actividad_desde).toBeUndefined();
  });

  it('sin alias_ambiguos, el campo queda undefined y `alias` no cambia', () => {
    const [entrada] = taxonomiaDesdeFichas([ficha({ slug: 'orsi', nombre: 'Yamandú Orsi', alias: ['Orsi', 'Yamandú Orsi'], mandatos: [] })]);
    expect(entrada.alias_ambiguos).toBeUndefined();
    expect(entrada.alias).toEqual(expect.arrayContaining(['Orsi', 'Yamandú Orsi']));
  });
});
