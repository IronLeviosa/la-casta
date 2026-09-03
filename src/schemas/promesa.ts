import { z } from 'astro/zod';
import { FechaISO, Revision, crearEvidenciaSchema, crearProcedenciaSchema, type Opciones } from './base';

export const EstadoPromesa = z
  .enum(['cumplida', 'en_proceso_adelantada', 'en_proceso_demorada', 'incumplida'])
  .describe('Escala de Chequeado / la diaria Verifica: cumplida, en_proceso_adelantada, en_proceso_demorada o incumplida.');

export const TipoEvidenciaPromesa = z
  .enum(['ley', 'decreto', 'accion_de_gobierno', 'dato_oficial', 'declaracion', 'omision'])
  .describe('Tipo de hecho que afecta la promesa: ley, decreto, accion_de_gobierno, dato_oficial, declaracion u omision.');

export const Efecto = z
  .enum(['a_favor', 'en_contra', 'neutral'])
  .describe('Efecto del hecho sobre el cumplimiento: a_favor, en_contra o neutral.');

export function crearPromesaSchema(op: Opciones) {
  const { ref } = op;
  const Evidencia = crearEvidenciaSchema(op);

  const Hecho = z
    .object({
      fecha: FechaISO.describe('Fecha del hecho (YYYY-MM-DD); debe ser posterior o igual a fecha_promesa.'),
      tipo: TipoEvidenciaPromesa,
      efecto: Efecto,
      descripcion: z.string().min(1).describe('Qué pasó, en una oración.'),
      evidencia: Evidencia,
    })
    .strict()
    .describe('Hecho posterior que afecta el cumplimiento de la promesa.');

  return z
    .object({
      politico: ref('politicos').describe('Quién prometió (id de content/politicos).'),
      tema: ref('temas').describe('Tema de la promesa (id de content/temas).'),
      texto: z.string().min(1).describe('La promesa en palabras del político, textual o resumida sin cambiar el sentido.'),
      fecha_promesa: FechaISO.describe('Fecha en que se hizo la promesa (YYYY-MM-DD).'),
      origen: Evidencia.describe('Evidencia de que la promesa se hizo (cita en fuente).'),
      estado: EstadoPromesa,
      fundamentacion: z.string().min(1).describe('Por qué se asigna ese estado, apoyándose en las evidencias listadas.'),
      evidencias: z.array(Hecho).describe('Hechos posteriores a la promesa, en orden cronológico.'),
      revision: Revision,
      procedencia: crearProcedenciaSchema(op),
    })
    .strict()
    .superRefine((p, ctx) => {
      p.evidencias.forEach((h, i) => {
        if (h.fecha < p.fecha_promesa) {
          ctx.addIssue({ code: 'custom', path: ['evidencias', i, 'fecha'], message: 'La evidencia no puede ser anterior a fecha_promesa.' });
        }
      });
    })
    .describe('Promesa de campaña o gestión con su estado de cumplimiento y los hechos que lo fundamentan.');
}

export type Promesa = z.infer<ReturnType<typeof crearPromesaSchema>>;
