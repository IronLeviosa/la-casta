/**
 * Jerarquía de fuentes, en un solo lugar, para que toda página la aplique igual.
 *
 * La regla la fijó un lector sobre la página de una conferencia de prensa: dos notas de diarios
 * distintos no son dos fuentes de lo que se dijo, son dos trabajos periodísticos sobre la fuente,
 * que es la conferencia. Toda lista de fuentes del sitio se parte en dos bloques, en este orden:
 *
 * 1. Registros primarios y documentos oficiales: el video o audio del hecho, el texto oficial,
 *    el diario de sesiones, el balance auditado, la planilla del regulador, la ley. Lo que dice
 *    el documento.
 * 2. Cobertura de prensa y análisis de terceros: notas, columnas, informes de un centro de
 *    estudios, publicaciones en redes. Cómo lo contaron y analizaron otros.
 *
 * Se aplicó primero en las páginas de declaraciones y chequeos, y después se olvidó en un
 * componente nuevo (la lista compacta de la ficha de empresa). Por eso vive acá y no en cada
 * componente: un componente que lista fuentes importa esta función o está mal.
 */
import type { Fuente } from './tipos';

/** Tipos de fuente que son registro primario por definición. */
export const TIPOS_PRIMARIOS = new Set<Fuente['tipo']>(['video', 'documento_oficial', 'diario_de_sesiones']);

export const medioIdDe = (f: Fuente): string => (typeof f.medio === 'string' ? f.medio : f.medio.id);

/**
 * Una fuente es primaria si su tipo lo es, o si la publica un organismo público (medio de tipo
 * `estatal`): el balance que la empresa publica en su sitio es documento, no cobertura, aunque
 * el registro lo haya cargado como `nota`.
 */
export function esPrimaria(f: Fuente, tiposMedio: ReadonlyMap<string, string>): boolean {
  return TIPOS_PRIMARIOS.has(f.tipo) || tiposMedio.get(medioIdDe(f)) === 'estatal';
}

export interface Bloques<T> {
  primarias: T[];
  cobertura: T[];
}

/** Parte una lista en los dos bloques de la jerarquía, conservando el orden dentro de cada uno. */
export function partirPorJerarquia<T extends Fuente>(fuentes: readonly T[], tiposMedio: ReadonlyMap<string, string>): Bloques<T> {
  const primarias: T[] = [];
  const cobertura: T[] = [];
  for (const f of fuentes) (esPrimaria(f, tiposMedio) ? primarias : cobertura).push(f);
  return { primarias, cobertura };
}

/** Rótulos de los dos bloques, iguales en todas las páginas. */
export const ROTULOS = {
  primarias: { titulo: 'Registros primarios y documentos oficiales', detalle: 'lo que dice el documento o el registro original' },
  cobertura: { titulo: 'Cobertura de prensa y análisis de terceros', detalle: 'cómo lo contaron y analizaron otros' },
} as const;
