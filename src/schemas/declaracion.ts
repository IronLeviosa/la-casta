import { z } from 'astro/zod';
import { FechaISO, Revision, crearEvidenciaSchema, crearProcedenciaSchema, listaEventos, type Opciones } from './base';

export const ContextoDeclaracion = z
  .enum(['campaña', 'gobierno', 'oposicion', 'entrevista', 'parlamento', 'redes'])
  .describe('Contexto en que se dijo: campaña, gobierno, oposicion, entrevista, parlamento o redes.');

export function crearDeclaracionSchema(op: Opciones) {
  const { ref } = op;
  return z
    .object({
      politico: ref('politicos').describe('Quién lo dijo (id de content/politicos).'),
      tema: ref('temas').describe('Tema principal (id de content/temas, ej. economia/impuestos).'),
      eventos: listaEventos(op).optional(),
      fecha: FechaISO.describe('Fecha de la declaración (YYYY-MM-DD).'),
      contexto: ContextoDeclaracion,
      cargo_en_ese_momento: z.string().min(1).describe('Cargo que ocupaba al decirlo (ej. candidato presidencial, Presidente de la República).'),
      cita: z.string().min(20).describe('Cita textual de la declaración (mínimo 20 caracteres), tal como aparece en la fuente.'),
      resumen: z.string().min(1).describe('Qué afirma o promete, en una oración neutral.'),
      evidencia: crearEvidenciaSchema(op),
      revision: Revision,
      procedencia: crearProcedenciaSchema(op),
    })
    .strict()
    .describe('Declaración pública de un político sobre un tema, con cita textual y evidencia.');
}

export type Declaracion = z.infer<ReturnType<typeof crearDeclaracionSchema>>;
