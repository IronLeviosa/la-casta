import { z } from 'astro/zod';
import { FechaISO, Revision, crearFuenteSchema, type Opciones } from './base';

/** Número de ley uruguaya en la forma que usa IMPO: `18.331`, `9.155`. */
export const NumeroLey = z
  .string()
  .regex(/^\d{1,2}\.\d{3}$/, 'Número de ley en la forma 18.331 (uno o dos dígitos, punto, tres dígitos)')
  .describe('Número de la ley tal como se escribe y se cita: "18.331". El id del archivo es el mismo con guion ("18-331").');

/**
 * Artículo concreto en el que se apoya el sitio.
 *
 * `resumen` es interpretación nuestra en lenguaje llano; `cita` es el texto
 * literal del artículo, para que el lector pueda comparar una cosa con la otra
 * sin salir de la página.
 */
export const ArticuloLey = z
  .object({
    numero: z
      .string()
      .min(1)
      .describe('Identificador del artículo tal como aparece en la norma (ej. "18", "9 bis", "12.1", "336 del Código Penal").'),
    resumen: z
      .string()
      .min(1)
      .describe('Qué dice ese artículo, en una o dos oraciones de lenguaje llano. Es interpretación nuestra, no el texto de la norma.'),
    cita: z
      .string()
      .min(20, 'La cita debe tener al menos 20 caracteres y ser textual')
      .describe('Texto literal del artículo, copiado del original (mínimo 20 caracteres). Es lo que respalda el resumen.'),
  })
  .strict()
  .describe('Artículo puntual de la ley en el que se apoya algún registro o página del sitio, con su resumen llano y su texto literal.');

export type ArticuloLeyT = z.infer<typeof ArticuloLey>;

/**
 * Ley citada por el sitio.
 *
 * Existe para que una referencia como "ley 18.331" deje de ser una sigla opaca:
 * el lector ve de qué se trata sin abrir nada y, si quiere, va al texto oficial.
 * El `resumen` es una afirmación como cualquier otra del sitio (una
 * interpretación nuestra), así que exige `fuentes` con cita textual de la norma.
 */
export function crearLeySchema({ ref }: Opciones) {
  const Fuente = crearFuenteSchema({ ref });
  return z
    .object({
      numero: NumeroLey,
      titulo: z
        .string()
        .min(1)
        .describe('Nombre oficial de la ley tal como lo publica IMPO (ej. "Ley de protección de datos personales").'),
      nombre_comun: z
        .string()
        .min(1)
        .optional()
        .describe('Nombre con el que se la conoce, si tiene uno distinto del oficial (ej. "Ley Cristal", "Ley de Prensa").'),
      fecha: FechaISO.describe('Fecha de promulgación de la ley (YYYY-MM-DD).'),
      resumen: z
        .string()
        .min(1)
        .describe('Qué hace la ley, a quién alcanza y por qué importa acá: de dos a cuatro oraciones en español llano, sin jerga jurídica y sin copiar el articulado. Es interpretación nuestra; el texto oficial está en url_impo.'),
      articulos: z
        .array(ArticuloLey)
        .optional()
        .describe('Artículos concretos en los que se apoya el sitio, cada uno con su resumen llano y su texto literal.'),
      url_impo: z
        .url()
        .describe('URL del texto oficial en IMPO (impo.com.uy). Es el enlace que se ofrece al lector para leer la norma completa.'),
      fuentes: z
        .array(Fuente)
        .min(1, 'Se requiere al menos una fuente con cita textual de la norma')
        .describe('Fuentes que respaldan el resumen: al menos una, con `cita` copiada literalmente del texto de la ley.'),
      revision: Revision,
    })
    .strict()
    .describe('Ley citada por el sitio, con un resumen propio en lenguaje llano y el enlace al texto oficial. El id del archivo es el número con guion (ej. 18-331).');
}

export type Ley = z.infer<ReturnType<typeof crearLeySchema>>;
