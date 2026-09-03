import { z } from 'astro/zod';
import { FechaISO, Revision, Sha256, crearFuenteSchema, crearProcedenciaSchema, type Opciones } from './base';

export const TipoIntervencion = z
  .enum(['entrevista', 'discurso', 'conferencia', 'parlamento', 'cadena'])
  .describe('Tipo: entrevista, discurso, conferencia (de prensa), parlamento (sesión) o cadena (nacional).');

export const FormatoIntervencion = z
  .enum(['con_preguntas', 'sin_preguntas'])
  .describe('con_preguntas habilita el índice de evasión; sin_preguntas solo el índice de sustancia.');

export const ClaseSegmento = z
  .enum(['hecho_verificable', 'propuesta_concreta', 'posicion', 'argumento', 'ataque', 'evasion', 'retorica', 'otro'])
  .describe('Rúbrica de sustancia: hecho_verificable, propuesta_concreta, posicion, argumento, ataque, evasion (solo con_preguntas), retorica u otro.');

export const SubtipoEvasion = z
  .enum([
    'ignora',
    'cuestiona_la_pregunta',
    'ataca_al_entrevistador',
    'punto_politico',
    'respuesta_incompleta',
    'repite_respuesta_previa',
    'declara_no_poder_responder',
    'otro',
  ])
  .describe('Subtipo de no-respuesta según la tipología de Bull y Mayer (1993).');

export const Respuesta = z
  .enum(['respondida', 'parcial', 'no_respondida'])
  .describe('Solo en pares pregunta-respuesta: respondida, parcial o no_respondida.');

export function crearIntervencionSchema(op: Opciones) {
  const { ref } = op;
  const Fuente = crearFuenteSchema(op);

  const Etiquetador = z
    .object({
      modelo: z.string().min(1).describe('Modelo que etiquetó a ciegas (ej. sonnet, opus).'),
      clase: ClaseSegmento,
    })
    .strict();

  const Segmento = z
    .object({
      inicio: z.number().nonnegative().describe('Posición inicial del segmento en la transcripción (segundos o índice de palabra, según transcripcion_ref).'),
      fin: z.number().nonnegative().describe('Posición final del segmento.'),
      texto: z.string().min(1).describe('Texto del segmento (oración o turno).'),
      palabras: z.number().int().positive().describe('Cantidad de palabras del segmento.'),
      clase: ClaseSegmento,
      especificidad: z.number().int().min(1).max(3).optional().describe('Solo propuesta_concreta: 1 (vaga) a 3 (qué, cuándo, cómo, con qué recursos).'),
      subtipo_evasion: SubtipoEvasion.optional(),
      respuesta: Respuesta.optional(),
      etiquetadores: z.array(Etiquetador).min(2).describe('Etiquetas independientes de cada modelo (mínimo 2) para calcular kappa.'),
    })
    .strict()
    .superRefine((s, ctx) => {
      if (s.fin < s.inicio) ctx.addIssue({ code: 'custom', path: ['fin'], message: 'fin debe ser mayor o igual a inicio.' });
      if (s.clase === 'evasion' && !s.subtipo_evasion) {
        ctx.addIssue({ code: 'custom', path: ['subtipo_evasion'], message: 'Un segmento evasion requiere subtipo_evasion.' });
      }
    })
    .describe('Segmento clasificado de la intervención.');

  return z
    .object({
      politico: ref('politicos').describe('Quién habla (id de content/politicos).'),
      fecha: FechaISO.describe('Fecha de la intervención (YYYY-MM-DD).'),
      tipo: TipoIntervencion,
      formato: FormatoIntervencion,
      titulo: z.string().min(1).describe('Título descriptivo (ej. Entrevista en En Perspectiva).'),
      fuente: Fuente.describe('Video o diario de sesiones de donde sale la transcripción.'),
      transcripcion_ref: Sha256.describe('Hash de la transcripción completa en el corpus (.cache/transcripciones/<hash>.json).'),
      palabras: z.number().int().positive().describe('Total de palabras pronunciadas por el político.'),
      segmentos: z.array(Segmento).min(1).describe('Segmentos clasificados (mínimo 1).'),
      kappa: z.number().min(-1).max(1).describe('Kappa de Cohen entre los dos etiquetadores; si < 0,6 no se publica.'),
      chequeo_exhaustivo: z
        .boolean()
        .default(false)
        .describe('true si todas las oraciones hecho_verificable pasaron por el Veracímetro (habilita el ratio de mentiras).'),
      revision: Revision,
      procedencia: crearProcedenciaSchema(op),
    })
    .strict()
    .superRefine((i, ctx) => {
      if (i.formato === 'sin_preguntas') {
        i.segmentos.forEach((s, k) => {
          if (s.clase === 'evasion' || s.respuesta) {
            ctx.addIssue({ code: 'custom', path: ['segmentos', k, 'clase'], message: 'evasion y respuesta solo aplican a formato con_preguntas.' });
          }
        });
      }
      if (i.revision.tier === 'publicado' && i.kappa < 0.6) {
        ctx.addIssue({ code: 'custom', path: ['kappa'], message: 'No se publica una intervención con kappa < 0,6.' });
      }
    })
    .describe('Intervención transcrita y clasificada segmento a segmento, base del índice de sustancia y de evasión.');
}

export type Intervencion = z.infer<ReturnType<typeof crearIntervencionSchema>>;
