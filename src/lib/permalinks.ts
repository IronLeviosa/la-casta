/**
 * Permalinks: id de un registro → URL del sitio.
 *
 * Los ids son rutas de archivo (ej. `lacalle-pou/2019-10-15-no-subir-impuestos`).
 * Las colecciones "por político" (declaraciones, giros, promesas, chequeos,
 * intervenciones) viven bajo `/politicos/<slug>/<coleccion>/<resto>/`.
 * Las colecciones sin página propia (referentes, menciones, patrimonio,
 * cobertura) apuntan al ancla de la página que las muestra.
 */
import type { NombreColeccion } from '../schemas/base';
import { ruta, urlAbsoluta } from './ruta';

export type ColeccionConPermalink = Exclude<NombreColeccion, never>;

/** Separa un id `politico/resto` en sus dos partes. */
export function partirId(id: string): { politico: string; resto: string } {
  const i = id.indexOf('/');
  if (i < 0) return { politico: id, resto: '' };
  return { politico: id.slice(0, i), resto: id.slice(i + 1) };
}

const CON_POLITICO = new Set<NombreColeccion>(['declaraciones', 'giros', 'promesas', 'chequeos', 'intervenciones']);

/** Ruta del sitio (con base y barra final) del registro `id` de `coleccion`. */
export function urlDe(coleccion: NombreColeccion, id: string): string {
  if (CON_POLITICO.has(coleccion)) {
    const { politico, resto } = partirId(id);
    return ruta(`/politicos/${politico}/${coleccion}/${resto}/`);
  }
  switch (coleccion) {
    case 'politicos':
      return ruta(`/politicos/${id}/`);
    case 'temas':
      return ruta(`/temas/${id}/`);
    case 'medios':
      return ruta(`/medios/${id}/`);
    case 'eventos':
      return ruta(`/eventos/${id}/`);
    case 'casos':
      return ruta(`/casos/${id}/`);
    case 'paginas':
      return ruta(`/${id}/`);
    case 'correcciones':
      return ruta(`/correcciones/#${anclaDe(id)}`);
    case 'patrimonio':
      return ruta(`/politicos/${partirId(id).politico}/#patrimonio`);
    case 'menciones':
      return ruta(`/politicos/${partirId(id).politico}/#referentes`);
    case 'referentes':
      return ruta(`/politicos/#referentes`);
    case 'cobertura':
      return ruta(`/medios/${partirId(id).politico}/#cobertura`);
    default: {
      // Las colecciones por político ya salieron arriba; esto solo existe para
      // que agregar una colección nueva sin permalink no pase inadvertido.
      const { politico, resto } = partirId(id);
      return ruta(`/politicos/${politico}/${coleccion}/${resto}/`);
    }
  }
}

/** Id completo `<coleccion>/<id>` (formato de `correcciones.afecta`) → ruta del sitio. */
export function urlDeIdCompleto(idCompleto: string): string | null {
  const i = idCompleto.indexOf('/');
  if (i < 0) return null;
  const coleccion = idCompleto.slice(0, i) as NombreColeccion;
  const id = idCompleto.slice(i + 1);
  try {
    return urlDe(coleccion, id);
  } catch {
    return null;
  }
}

/** Convierte un id en un ancla HTML válida. */
export function anclaDe(id: string): string {
  return id.replaceAll('/', '--');
}

/**
 * URL canónica absoluta (origen + base) a partir de una ruta interna.
 * `ruta()` es idempotente, así que sirve tanto para `/sobre/` como para un
 * `Astro.url.pathname`, que ya viene con el base adentro.
 */
export function absoluta(p: string, site?: URL | string): string {
  if (!site) return urlAbsoluta(p);
  return new URL(ruta(p), String(site)).toString();
}

/** Nombre de la colección para mostrar en singular y plural. */
export const NOMBRE_COLECCION: Record<NombreColeccion, { singular: string; plural: string }> = {
  politicos: { singular: 'político', plural: 'políticos' },
  temas: { singular: 'tema', plural: 'temas' },
  medios: { singular: 'medio', plural: 'medios' },
  eventos: { singular: 'evento', plural: 'eventos' },
  referentes: { singular: 'referente', plural: 'referentes' },
  declaraciones: { singular: 'declaración', plural: 'declaraciones' },
  giros: { singular: 'giro', plural: 'giros' },
  promesas: { singular: 'promesa', plural: 'promesas' },
  casos: { singular: 'caso', plural: 'casos' },
  chequeos: { singular: 'chequeo', plural: 'chequeos' },
  cobertura: { singular: 'registro de cobertura', plural: 'registros de cobertura' },
  intervenciones: { singular: 'intervención', plural: 'intervenciones' },
  patrimonio: { singular: 'declaración patrimonial', plural: 'declaraciones patrimoniales' },
  menciones: { singular: 'mención', plural: 'menciones' },
  correcciones: { singular: 'corrección', plural: 'correcciones' },
  paginas: { singular: 'página', plural: 'páginas' },
};
