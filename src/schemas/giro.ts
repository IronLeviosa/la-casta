import { z } from 'astro/zod';
import { Revision, crearEvidenciaSchema, crearProcedenciaSchema, type Opciones } from './base';

export const Cambio = z
  .enum(['sin_cambio', 'cambio_parcial', 'cambio_total'])
  .describe('Escala tipo Flip-O-Meter: sin_cambio, cambio_parcial o cambio_total. Los sin_cambio también se publican.');

export const Explicacion = z
  .enum(['reconocido_explicitamente', 'justificado_por_contexto', 'sin_explicacion'])
  .describe('Cómo explicó el cambio: reconocido_explicitamente (dijo que cambió), justificado_por_contexto (adujo circunstancias) o sin_explicacion.');

export function crearGiroSchema(op: Opciones) {
  const { ref } = op;
  return z
    .object({
      politico: ref('politicos').describe('Político del giro (id de content/politicos); debe coincidir con el de ambas declaraciones.'),
      tema: ref('temas').describe('Tema del giro (id de content/temas).'),
      declaracion_antes: ref('declaraciones').describe('Declaración anterior (id de content/declaraciones).'),
      declaracion_despues: ref('declaraciones').describe('Declaración posterior (id de content/declaraciones); su fecha debe ser mayor que la anterior.'),
      cambio: Cambio,
      explicacion: Explicacion,
      analisis: z.string().min(1).describe('Comparación de ambas citas, con el contexto de cada una, sin adjetivos.'),
      evidencia_explicacion: crearEvidenciaSchema(op)
        .optional()
        .describe('Evidencia de la explicación dada (obligatoria si explicacion ≠ sin_explicacion).'),
      revision: Revision,
      procedencia: crearProcedenciaSchema(op),
    })
    .strict()
    .superRefine((g, ctx) => {
      if (g.explicacion !== 'sin_explicacion' && !g.evidencia_explicacion) {
        ctx.addIssue({
          code: 'custom',
          path: ['evidencia_explicacion'],
          message: 'Si la explicación fue reconocida o justificada, se requiere evidencia_explicacion.',
        });
      }
    })
    .describe('Giro: dos declaraciones del mismo político sobre un tema, calificadas por cambio y explicación. Los cambio_total + sin_explicacion requieren aprobación humana.');
}

export type Giro = z.infer<ReturnType<typeof crearGiroSchema>>;
