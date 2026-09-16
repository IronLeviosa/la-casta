/**
 * `src/lib/redirecciones.ts`: la función que enumera los `de` de todas las correcciones con
 * `reemplaza` en pares y arma la ruta vieja de cada uno (docs/plan-correcciones-id.md), que
 * `src/pages/[...idViejo].astro` usa en su `getStaticPaths`. Se prueba la función pura, sin
 * construir el sitio (el plan lo dice explícitamente: "build de un fixture no hace falta").
 */
import { describe, expect, it } from 'vitest';
import { filasDeRedireccion, paresDeReemplazo, sinBaseNiBarra, type CorreccionMinima } from '../src/lib/redirecciones';
import { base } from '../src/lib/ruta';

function correccion(id: string, overrides: Partial<CorreccionMinima['data']> = {}): CorreccionMinima {
  return {
    id,
    data: {
      revision: { tier: 'publicado' },
      fecha: '2026-09-16',
      motivo: 'motivo de prueba',
      afecta: [],
      ...overrides,
    },
  };
}

describe('sinBaseNiBarra', () => {
  // El `base()` vigente depende de cómo se ejecute (bajo vitest, `import.meta.env.BASE_URL` lo
  // pone Vite, no `astro.config.mjs`): en vez de asumir cuál es, se arma la entrada a partir del
  // `base()` real y se comprueba que la función lo saque, sea cual sea.
  it('saca el base del sitio y la barra final', () => {
    const conBase = `${base()}politicos/batlle/declaraciones/2016-09-21-x/`;
    expect(sinBaseNiBarra(conBase)).toBe('politicos/batlle/declaraciones/2016-09-21-x');
  });

  it('es un no-op sobre una ruta que ya no tiene barra final', () => {
    const conBase = `${base()}empresas/ancap`;
    expect(sinBaseNiBarra(conBase)).toBe('empresas/ancap');
  });
});

describe('paresDeReemplazo', () => {
  const DE = 'declaraciones/batlle/2016-10-24-impuestos-empezaran-cobrarse-enero-2017';
  const A = 'declaraciones/batlle/2016-09-21-impuestos-empezaran-cobrarse-enero-2017';

  it('ignora una corrección con reemplaza en string (fusión, no cambio de id)', () => {
    const c = correccion('2026-01-01-fusion', { reemplaza: 'politicos/ana-test' });
    expect(paresDeReemplazo([c])).toEqual([]);
  });

  it('ignora una corrección sin reemplaza', () => {
    expect(paresDeReemplazo([correccion('2026-01-01-sin-reemplazo')])).toEqual([]);
  });

  it('ignora una corrección en probable (no se sirve todavía)', () => {
    const c = correccion('2026-01-01-probable', { reemplaza: [{ de: DE, a: A }] });
    c.data.revision.tier = 'probable';
    expect(paresDeReemplazo([c])).toEqual([]);
  });

  it('junta los pares de una corrección con reemplaza en lista', () => {
    const c = correccion('2026-09-16-fecha-batlle-entrevista', { reemplaza: [{ de: DE, a: A }] });
    const pares = paresDeReemplazo([c]);
    expect(pares).toHaveLength(1);
    expect(pares[0]).toMatchObject({ de: DE, a: A });
    expect(pares[0]!.correccion.id).toBe(c.id);
  });

  it('junta los pares de varias correcciones', () => {
    const c1 = correccion('2026-01-01-uno', { reemplaza: [{ de: DE, a: A }] });
    const c2 = correccion('2026-01-02-dos', {
      reemplaza: [{ de: 'chequeos/batlle/2016-10-24-x', a: 'chequeos/batlle/2016-09-21-x' }],
    });
    expect(paresDeReemplazo([c1, c2])).toHaveLength(2);
  });
});

describe('filasDeRedireccion', () => {
  it('arma la ruta vieja de una declaración (colección "por político")', () => {
    const c = correccion('2026-09-16-fecha-batlle-entrevista', {
      reemplaza: [
        {
          de: 'declaraciones/batlle/2016-10-24-impuestos-empezaran-cobrarse-enero-2017',
          a: 'declaraciones/batlle/2016-09-21-impuestos-empezaran-cobrarse-enero-2017',
        },
      ],
    });
    const filas = filasDeRedireccion([c]);
    expect(filas).toHaveLength(1);
    expect(filas[0]!.rutaVieja).toBe('politicos/batlle/declaraciones/2016-10-24-impuestos-empezaran-cobrarse-enero-2017');
    expect(filas[0]!.a).toBe('declaraciones/batlle/2016-09-21-impuestos-empezaran-cobrarse-enero-2017');
    expect(filas[0]!.correccion.id).toBe(c.id);
  });

  it('arma la ruta vieja de una colección sin política (empresas)', () => {
    const c = correccion('2026-09-16-slug-ancap', { reemplaza: [{ de: 'empresas/ancap-vieja', a: 'empresas/ancap' }] });
    const filas = filasDeRedireccion([c]);
    expect(filas[0]!.rutaVieja).toBe('empresas/ancap-vieja');
  });

  it('una fila por cada par, aunque varios pares vengan de la misma corrección', () => {
    const c = correccion('2026-09-16-fecha-batlle-entrevista', {
      reemplaza: [
        { de: 'declaraciones/batlle/2016-10-24-a', a: 'declaraciones/batlle/2016-09-21-a' },
        { de: 'chequeos/batlle/2016-10-24-b', a: 'chequeos/batlle/2016-09-21-b' },
      ],
    });
    expect(filasDeRedireccion([c])).toHaveLength(2);
  });
});
