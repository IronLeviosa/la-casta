/**
 * Referencias a leyes: cómo se detectan en el texto y qué se muestra en la tarjeta.
 *
 * Hay dos consumidores de este módulo y tienen que producir exactamente el mismo
 * HTML, porque el CSS vive una sola vez en `global.css` (bloque `.ref-ley`):
 *
 *   - `src/components/Ley.astro`, para las páginas .astro;
 *   - `src/lib/rehype-leyes.ts`, que transforma el Markdown de `content/paginas/`.
 *
 * Por eso la forma de la tarjeta (qué partes tiene y con qué texto) se decide acá
 * una sola vez, en `partesDeTarjeta()`, y cada consumidor solo la pinta.
 */

/** Datos de una ley que necesita la tarjeta (subconjunto del esquema `leyes`). */
export interface LeyMinima {
  numero: string;
  titulo: string;
  nombre_comun?: string;
  fecha: string;
  resumen: string;
  articulos?: { numero: string; resumen: string; cita: string }[];
  url_impo: string;
}

/** Id de archivo/URL a partir del número: `18.331` → `18-331`. */
export function idDeNumero(numero: string): string {
  return numero.replace(/\./g, '-');
}

/** Número a partir del id: `18-331` → `18.331`. */
export function numeroDeId(id: string): string {
  return id.replace(/-/g, '.');
}

/**
 * Clave de comparación de un artículo: minúsculas, sin acentos, espacios
 * colapsados y sin la palabra "artículo". Así `Art. 9 bis`, `artículo 9 BIS` y
 * `9 bis` caen todos en la misma clave.
 */
export function claveArticulo(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\bart(?:iculo|\.)?\s*/g, '')
    .replace(/[º°]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Busca en la ley el artículo que corresponde a una referencia como "9 bis". */
export function buscarArticulo(ley: LeyMinima, referencia: string | undefined) {
  if (!referencia) return undefined;
  const clave = claveArticulo(referencia);
  return ley.articulos?.find((a) => claveArticulo(a.numero) === clave);
}

/**
 * Expresión que encuentra referencias a leyes dentro de un texto corrido.
 *
 * Cubre las cuatro formas que aparecen en el sitio:
 *
 *   Código Penal, art. 336        → grupo `cpNumeroDespues`
 *   art. 336 del Código Penal     → grupo `cpNumeroAntes`
 *   ley 18.331 · ley N° 18.331    → grupos `numero` (+ `articulo` si lo trae)
 *   la 19.797                     → idem, para la forma elíptica ("modificada por la 19.797")
 *
 * El artículo del Código Penal no vive en una ley propia: se resuelve contra la
 * ley que le dio su redacción vigente (`LEY_DEL_CODIGO_PENAL`).
 */
export const RE_REFERENCIA =
  /\b(?:c[oó]digo\s+penal\s*,?\s*art(?:[íi]culo|\.)?\s*(?<cpNumeroDespues>\d{1,3}(?:\s*bis)?)|art(?:[íi]culo|\.)?\s*(?<cpNumeroAntes>\d{1,3}(?:\s*bis)?)\s+del\s+c[oó]digo\s+penal|(?:leyes|ley|las|la)\s+(?:n[.°ºo]{0,2}\s*)?(?<numero>\d{1,2}\.\d{3})(?:\s*[,(]?\s*art(?:[íi]culo|\.)?\s*(?<articulo>\d{1,3}(?:\s*bis)?|\d{1,2}\.\d)\s*\)?)?)/gi;

/** Ley que le dio al artículo 336 del Código Penal su redacción vigente. */
export const LEY_DEL_CODIGO_PENAL = '18.515';

export interface Referencia {
  /** Texto exacto que se encontró, y que queda como texto del enlace. */
  texto: string;
  /** Número de la ley a la que apunta (`18.331`). */
  numero: string;
  /** Artículo puntual, si la referencia lo nombra (`9 bis`, `336 del Código Penal`). */
  articulo?: string;
  inicio: number;
  fin: number;
}

/** Todas las referencias a leyes de un texto, en orden de aparición. */
export function referenciasEn(texto: string): Referencia[] {
  const salida: Referencia[] = [];
  RE_REFERENCIA.lastIndex = 0;
  for (const m of texto.matchAll(RE_REFERENCIA)) {
    const g = m.groups ?? {};
    const cp = g.cpNumeroDespues ?? g.cpNumeroAntes;
    const numero = cp ? LEY_DEL_CODIGO_PENAL : g.numero;
    if (!numero) continue;
    salida.push({
      texto: m[0],
      numero,
      articulo: cp ? `${cp.replace(/\s+/g, ' ')} del Código Penal` : g.articulo,
      inicio: m.index,
      fin: m.index + m[0].length,
    });
  }
  return salida;
}

/** Fecha ISO a "11 de agosto de 2008" (sin depender de la zona horaria). */
const MESES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'setiembre',
  'octubre',
  'noviembre',
  'diciembre',
];
export function fechaEnPalabras(iso: string): string {
  const [a, m, d] = iso.split('-');
  const mes = MESES[Number(m) - 1] ?? m;
  return `${Number(d)} de ${mes} de ${a}`;
}

export interface PartesTarjeta {
  /** Texto del enlace disparador. */
  etiqueta: string;
  /** Línea superior: número y fecha de promulgación. */
  cabecera: string;
  /** Nombre de la ley (el común si lo tiene, si no el oficial). */
  titulo: string;
  resumen: string;
  /** Encabezado del bloque de artículo, si la referencia nombra uno. */
  articuloTitulo?: string;
  articuloResumen?: string;
  hrefFicha: string;
  hrefImpo: string;
  /** Id del elemento de la tarjeta, para `aria-describedby`. */
  idTarjeta: string;
}

/**
 * Todo lo que muestra la tarjeta, decidido en un solo lugar.
 *
 * `hrefFicha` llega ya resuelto por quien llama (`ruta()` necesita el base del
 * sitio, y este módulo lo consumen tanto Astro como el plugin de Markdown).
 */
export function partesDeTarjeta(opciones: {
  ley: LeyMinima;
  etiqueta: string;
  articulo?: string;
  hrefFicha: string;
  idTarjeta: string;
}): PartesTarjeta {
  const { ley, etiqueta, articulo, hrefFicha, idTarjeta } = opciones;
  const art = buscarArticulo(ley, articulo);
  return {
    etiqueta,
    cabecera: `Ley ${ley.numero} · ${fechaEnPalabras(ley.fecha)}`,
    titulo: ley.nombre_comun ?? ley.titulo,
    resumen: ley.resumen,
    articuloTitulo: art ? `Artículo ${art.numero}` : undefined,
    articuloResumen: art?.resumen,
    hrefFicha,
    hrefImpo: ley.url_impo,
    idTarjeta,
  };
}

/** Aviso al pie de cada tarjeta: el resumen es nuestro, el texto oficial no. */
export const NOTA_TARJETA = 'Resumen nuestro, en lenguaje llano. El texto oficial manda.';
