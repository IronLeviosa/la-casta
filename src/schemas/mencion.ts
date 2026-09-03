import { z } from 'astro/zod';
import { FechaISO, Revision, crearEvidenciaSchema, crearProcedenciaSchema, type Opciones } from './base';
import { ContextoDeclaracion } from './declaracion';

export const SentidoMencion = z
  .enum(['positivo', 'negativo', 'neutral'])
  .describe('Cómo se refirió al referente: positivo (lo reivindica o cita como autoridad), negativo (lo critica) o neutral.');

export function crearMencionSchema(op: Opciones) {
  const { ref } = op;
  return z
    .object({
      politico: ref('politicos').describe('Quién menciona (id de content/politicos).'),
      referente: ref('referentes').describe('A quién o qué menciona (id de content/referentes).'),
      fecha: FechaISO.describe('Fecha de la mención (YYYY-MM-DD).'),
      contexto: ContextoDeclaracion,
      sentido: SentidoMencion,
      cita: z.string().min(20).describe('Cita textual donde aparece la mención (mínimo 20 caracteres).'),
      evidencia: crearEvidenciaSchema(op),
      revision: Revision,
      procedencia: crearProcedenciaSchema(op),
    })
    .strict()
    .describe('Mención de un referente por parte de un político, con cita y evidencia.');
}

export type Mencion = z.infer<ReturnType<typeof crearMencionSchema>>;
