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

export type ColeccionConPermalink = Exclude<NombreColeccion, never>;

/** Separa un id `politico/resto` en sus dos partes. */
export function partirId(id: string): { politico: string; resto: string } {
  const i = id.indexOf('/');
  if (i < 0) return { politico: id, resto: '' };
  return { politico: id.slice(0, i), resto: id.slice(i + 1) };
}

const CON_POLITICO = new Set<NombreColeccion>(['declaraciones', 'giros', 'promesas', 'chequeos', 'intervenciones']);

/** URL absoluta (con barra final) del registro `id` de `coleccion`. */
export function urlDe(coleccion: NombreColeccion, id: string): string {
  if (CON_POLITICO.has(coleccion)) {
    const { politico, resto } = partirId(id);
    return `/politicos/${politico}/${coleccion}/${resto}/`;
  }
  switch (coleccion) {
    case 'politicos':
      return `/politicos/${id}/`;
    case 'temas':
      return `/temas/${id}/`;
    case 'medios':
      return `/medios/${id}/`;
    case 'eventos':
      return `/eventos/${id}/`;
    case 'casos':
      return `/casos/${id}/`;
    case 'paginas':
      return `/${id}/`;
    case 'correcciones':
      return `/correcciones/#${anclaDe(id)}`;
    case 'patrimonio':
      return `/politicos/${partirId(id).politico}/#patrimonio`;
    case 'menciones':
      return `/politicos/${partirId(id).politico}/#referentes`;
    case 'referentes':
      return `/politicos/#referentes`;
    case 'cobertura':
      return `/medios/${partirId(id).politico}/#cobertura`;
    default: {
      // Las colecciones por político ya salieron arriba; esto solo existe para
      // que agregar una colección nueva sin permalink no pase inadvertido.
      const { politico, resto } = partirId(id);
      return `/politicos/${politico}/${coleccion}/${resto}/`;
    }
  }
}

/** Id completo `<coleccion>/<id>` (formato de `correcciones.afecta`) → URL. */
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

/** URL canónica absoluta a partir de una ruta. */
export function absoluta(ruta: string, site: URL | string | undefined): string {
  const base = site ? String(site) : 'https://lacasta.uy';
  return new URL(ruta, base).toString();
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
