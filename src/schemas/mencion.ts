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
      referente: ref('referentes').optional().describe('A quién o qué menciona, si es un referente (id de content/referentes). Exactamente uno de referente o politico_mencionado.'),
      politico_mencionado: ref('politicos').optional().describe('A quién menciona, si es otro político cubierto por el sitio (id de content/politicos). Exactamente uno de referente o politico_mencionado.'),
      fecha: FechaISO.describe('Fecha de la mención (YYYY-MM-DD).'),
      contexto: ContextoDeclaracion,
      sentido: SentidoMencion,
      cita: z.string().min(20).describe('Cita textual donde aparece la mención (mínimo 20 caracteres).'),
      evidencia: crearEvidenciaSchema(op),
      revision: Revision,
      procedencia: crearProcedenciaSchema(op),
    })
    .strict()
    .refine((m) => Boolean(m.referente) !== Boolean(m.politico_mencionado), {
      message: 'Debe tener exactamente uno de referente o politico_mencionado.',
      path: ['referente'],
    })
    .describe('Mención de un referente o de otro político por parte de un político, con cita y evidencia.');
}

export type Mencion = z.infer<ReturnType<typeof crearMencionSchema>>;
