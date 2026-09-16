/**
 * Cambio de id en pares (`reemplaza: {de, a}[]`, docs/plan-correcciones-id.md).
 *
 * `promover --correccion` retira de `content/` cada `de` y deja `a` en su lugar. La URL vieja no
 * puede quedar muerta: `src/pages/[...idViejo].astro` genera, en cada una, una página mínima que
 * redirige a la nueva. Esta función es la parte que se puede probar sin construir el sitio: qué
 * URLs viejas hay que redirigir y a cuáles nuevas.
 */
import { urlDe } from './permalinks';
import { base } from './ruta';
import type { NombreColeccion } from '../schemas/comunes';

/** Forma mínima de una entrada de `correcciones` que necesita esta función (evita acoplar a `astro:content`). */
export interface CorreccionMinima {
  id: string;
  data: {
    revision: { tier: string };
    fecha: string;
    motivo: string;
    afecta: string[];
    reemplaza?: string | { de: string; a: string }[];
  };
}

export interface ParDeCorreccion {
  de: string;
  a: string;
  correccion: CorreccionMinima;
}

/** Todos los pares `{de, a}` de las correcciones publicadas con `reemplaza` en lista. */
export function paresDeReemplazo(correcciones: CorreccionMinima[]): ParDeCorreccion[] {
  const salida: ParDeCorreccion[] = [];
  for (const c of correcciones) {
    if (c.data.revision.tier !== 'publicado' || !Array.isArray(c.data.reemplaza)) continue;
    for (const par of c.data.reemplaza) salida.push({ de: par.de, a: par.a, correccion: c });
  }
  return salida;
}

/**
 * La ruta interna que arma `urlDe`/`ruta()`, sin el `base` del sitio ni la barra final: lo que
 * necesita `params` de una ruta `[...resto]` (Astro antepone el `base` solo al servir).
 */
export function sinBaseNiBarra(rutaConBase: string): string {
  const b = base();
  const sinBase = rutaConBase.startsWith(b) ? rutaConBase.slice(b.length) : rutaConBase.replace(/^\//, '');
  return sinBase.replace(/\/$/, '');
}

export interface FilaRedireccion {
  /** Ruta interna vieja, sin base ni barras en los extremos (para `params.idViejo`). */
  rutaVieja: string;
  /** Id completo `<coleccion>/<id>` del registro nuevo. */
  a: string;
  correccion: CorreccionMinima;
}

/** Una fila por cada URL vieja que hay que redirigir, con a qué id nuevo y por qué corrección. */
export function filasDeRedireccion(correcciones: CorreccionMinima[]): FilaRedireccion[] {
  return paresDeReemplazo(correcciones).map(({ de, a, correccion }) => {
    const [coleccionDe, ...resto] = de.split('/');
    const rutaVieja = sinBaseNiBarra(urlDe(coleccionDe as NombreColeccion, resto.join('/')));
    return { rutaVieja, a, correccion };
  });
}
