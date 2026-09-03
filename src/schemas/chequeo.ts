import { z } from 'astro/zod';
import { FechaISO, Revision, crearEvidenciaSchema, crearFuenteSchema, crearProcedenciaSchema, type Opciones } from './base';

export const Calificacion = z
  .enum(['verdadero', 'discutible', 'falso'])
  .describe('Veracímetro: verdadero (verde), discutible (amarillo) o falso (rojo). verdadero y falso exigen al menos una fuente documento_oficial.');

export function crearChequeoSchema(op: Opciones) {
  const { ref } = op;
  const Fuente = crearFuenteSchema(op);

  return z
    .object({
      politico: ref('politicos').describe('Quién hizo la afirmación (id de content/politicos).'),
      declaracion: ref('declaraciones').describe('Declaración de la que sale la afirmación (id de content/declaraciones).'),
      tema: ref('temas').describe('Tema del chequeo (id de content/temas).'),
      fecha: FechaISO.describe('Fecha de la afirmación chequeada (YYYY-MM-DD).'),
      afirmacion: z.string().min(1).describe('El dato concreto que se chequea: cifra, fecha o hecho. Nunca una opinión.'),
      calificacion: Calificacion,
      dato_real: z
        .object({
          valor: z.string().min(1).describe('El valor correcto según la fuente oficial (con unidad y fecha).'),
          fuentes: z.array(Fuente).min(1).describe('Fuente del dato real (INE, BCU, MEF, Parlamento, Poder Judicial, Corte Electoral, dataset público).'),
        })
        .strict()
        .describe('El dato correcto y su fuente.'),
      analisis: z.string().min(1).describe('Comparación entre lo afirmado y el dato real, con el contexto que corresponda.'),
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
        const tieneOficial = c.dato_real.fuentes.some((f) => f.tipo === 'documento_oficial');
        if (!tieneOficial) {
          ctx.addIssue({
            code: 'custom',
            path: ['dato_real', 'fuentes'],
            message: `Una calificación "${c.calificacion}" exige al menos una fuente de tipo documento_oficial; con prensa sola solo se puede calificar "discutible".`,
          });
        }
      }
    })
    .describe('Chequeo del Veracímetro: afirmación verificable, calificación, dato real con fuente oficial y análisis.');
}

export type Chequeo = z.infer<ReturnType<typeof crearChequeoSchema>>;
