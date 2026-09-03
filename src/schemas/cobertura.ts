import { z } from 'astro/zod';
import { FechaISO, Revision, crearProcedenciaSchema, type Opciones } from './base';

export const Tono = z
  .enum(['favorable', 'neutral', 'desfavorable'])
  .describe('Tono de la nota hacia el político o partido afectado: favorable, neutral o desfavorable.');

export function crearCoberturaSchema(op: Opciones) {
  const { ref } = op;
  return z
    .object({
      medio: ref('medios').describe('Medio que publicó la nota (id de content/medios).'),
      url: z.url().describe('URL de la nota.'),
      titulo: z.string().min(1).describe('Titular textual de la nota (para "misma noticia, distintos títulos").'),
      fecha: FechaISO.describe('Fecha de publicación (YYYY-MM-DD).'),
      evento: ref('eventos').describe('Hecho cubierto (id de content/eventos).'),
      politico: ref('politicos').optional().describe('Político afectado por la nota, si lo hay.'),
      partido: z.string().min(1).optional().describe('Partido afectado (nombre canónico de data/alias.yaml), si lo hay.'),
      tono: Tono,
      justificacion: z.string().min(1).describe('Una oración que cita la nota y explica el tono asignado.'),
      revision: Revision,
      procedencia: crearProcedenciaSchema(op),
    })
    .strict()
    .superRefine((c, ctx) => {
      if (!c.politico && !c.partido) {
        ctx.addIssue({ code: 'custom', path: ['politico'], message: 'Se requiere politico o partido afectado.' });
      }
    })
    .describe('Registro de cobertura: tono de una nota de prensa hacia un político o partido, asignado por IA y revisable nota por nota.');
}

export type Cobertura = z.infer<ReturnType<typeof crearCoberturaSchema>>;
