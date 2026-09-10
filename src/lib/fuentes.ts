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

/**
 * Agrupa por publicador las fuentes en texto libre de las series de un gráfico (`Serie.fuente` en
 * `src/schemas/base.ts`), para que un mismo publicador citado por varias series de un mismo
 * gráfico (URSEA en tres series, ANP en dos) aparezca una sola vez al pie, no una vez por serie.
 *
 * Es la misma idea que agrupa la lista de fuentes de una ficha por medio en `FuentesCompactas`
 * (un publicador, una línea, los documentos plegados), aplicada a texto libre en vez de a `Fuente[]`
 * estructuradas: acá no hay `medio.id`, así que el publicador es el nombre antes de la primera coma
 * o paréntesis («ANP» de «ANP, Série Histórica…»). Entre dos citas del mismo publicador se conserva
 * la más completa (la de mayor longitud), nunca las dos: el chequeo de combustibles contra Brasil
 * citaba «ANP, Série Histórica…» en dos series con un paréntesis de diferencia y las imprimía dos
 * veces.
 */
export function agruparFuentesDeSeries(fuentes: readonly string[]): string[] {
  const porPublicador = new Map<string, string>();
  const orden: string[] = [];
  for (const cruda of fuentes) {
    const texto = cruda.trim().replace(/[.;]+$/, '');
    if (!texto) continue;
    const clave = (texto.match(/^([^,(]+)/)?.[1] ?? texto).trim().toLowerCase();
    const actual = porPublicador.get(clave);
    if (!actual) orden.push(clave);
    if (!actual || texto.length > actual.length) porPublicador.set(clave, texto);
  }
  return orden.map((clave) => porPublicador.get(clave)!);
}

/**
 * Une una lista de frases (fuentes ya agrupadas, notas) con «; » y un solo punto final, sin
 * arrastrar el punto o el «;» que cada frase pueda traer ya puesto. Sin esto, una fuente que ya
 * termina en «.» y el punto final que agrega la plantilla quedan como «..», y una frase vacía en
 * el medio deja «; ;».
 */
export function unirConPunto(frases: readonly string[]): string {
  const limpias = frases.map((f) => f.trim().replace(/[.;]+$/, '')).filter(Boolean);
  return limpias.length ? `${limpias.join('; ')}.` : '';
}
