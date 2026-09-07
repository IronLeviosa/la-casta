import { z } from 'astro/zod';
import { FechaISO, Revision, crearEvidenciaSchema, crearFuenteSchema, crearGraficoSchema, crearImagenSchema, crearProcedenciaSchema, type Opciones } from './base';

export const Calificacion = z
  .enum(['verdadero', 'discutible', 'falso'])
  .describe('Veracímetro: verdadero (verde), discutible (amarillo) o falso (rojo). verdadero y falso exigen al menos una fuente documento_oficial o diario_de_sesiones en dato_real.');

export function crearChequeoSchema(op: Opciones) {
  const { ref } = op;
  const Fuente = crearFuenteSchema(op);

  return z
    .object({
      politico: ref('politicos').describe('Quién hizo la afirmación (id de content/politicos).'),
      declaracion: ref('declaraciones').describe('Declaración de la que sale la afirmación (id de content/declaraciones).'),
      tema: ref('temas').describe('Tema del chequeo (id de content/temas).'),
      fecha: FechaISO.describe('Fecha de la afirmación chequeada (YYYY-MM-DD).'),
      /**
       * Qué se chequea y, si cabe, el veredicto, en una línea para el título de la página. La
       * afirmación recortada no sirve de título: "En marzo de 2022, Lacalle Pou dijo que, por
       * primera vez desde 2001 o 2002 según su propio…" no dice qué se discute. "Combustibles más
       * baratos que en Brasil: cierto para el gasoil, falso para la nafta" sí.
       */
      titulo: z.string().min(8).max(110).optional().describe('Título corto (8-110 caracteres): qué se chequea y, si cabe, el veredicto. Lo escribe el editor.'),
      afirmacion: z.string().min(1).describe('El dato concreto que se chequea: cifra, fecha o hecho. Nunca una opinión.'),
      /**
       * El tramo exacto de la `cita` o del `resumen` de la declaración donde está el dato. La
       * página lo marca con el color de la calificación y le cuelga el globo con el veredicto; sin
       * esto el chequeo quedaba como una tarjeta al pie, lejos de la frase que juzga, y el lector
       * que leía la cifra en la cita no se enteraba de que estaba en duda. El validador exige que
       * aparezca tal cual (salvo espacios) en uno de los dos textos.
       */
      fragmento: z
        .string()
        .min(6)
        .optional()
        .describe('Tramo exacto de la cita o del resumen de la declaración que contiene el dato chequeado; la página lo marca con el color de la calificación.'),
      calificacion: Calificacion,
      dato_real: z
        .object({
          valor: z.string().min(1).describe('El valor correcto según la fuente oficial (con unidad y fecha).'),
          fuentes: z.array(Fuente).min(1).describe('Fuente del dato real (INE, BCU, MEF, Parlamento, Poder Judicial, Corte Electoral, dataset público).'),
        })
        .strict()
        .describe('El dato correcto y su fuente.'),
      analisis: z
        .string()
        .min(1)
        .describe('Comparación entre lo afirmado y el dato real, en párrafos separados por una línea en blanco: el primero resuelve en una o dos oraciones; los siguientes, una idea cada uno.'),
      grafico: crearGraficoSchema().optional().describe('Gráfico con los números de dato_real, cuando el chequeo compara cifras en el tiempo o entre categorías.'),
      imagenes: z.array(crearImagenSchema()).default([]).describe('Imágenes con licencia libre que aporten (un recorte del documento, una foto oficial del hecho).'),
      evidencia: crearEvidenciaSchema(op),
      exhaustivo: z
        .boolean()
        .default(false)
        .describe('true si forma parte del chequeo exhaustivo de una intervención (entra en el ratio de mentiras); false si es un chequeo suelto.'),
      revision: Revision,
      procedencia: crearProcedenciaSchema(op),
    })
    .strict()
    .superRefine((c, ctx) => {
      if (c.calificacion !== 'discutible') {
        // La regla escrita cuenta al Parlamento entre los organismos que habilitan verde o rojo; la
        // versión taquigráfica es tan registro oficial como un decreto. El código decía otra cosa y
        // dejaba en "discutible" un chequeo con el prontuario leído en sala. Se alinea con la regla.
        const tieneOficial = c.dato_real.fuentes.some((f) => f.tipo === 'documento_oficial' || f.tipo === 'diario_de_sesiones');
        if (!tieneOficial) {
          ctx.addIssue({
            code: 'custom',
            path: ['dato_real', 'fuentes'],
            message: `Una calificación "${c.calificacion}" exige al menos una fuente de tipo documento_oficial o diario_de_sesiones en dato_real; con prensa sola solo se puede calificar "discutible".`,
          });
        }
      }
    })
    .describe('Chequeo del Veracímetro: afirmación verificable, calificación, dato real con fuente oficial y análisis.');
}

export type Chequeo = z.infer<ReturnType<typeof crearChequeoSchema>>;
