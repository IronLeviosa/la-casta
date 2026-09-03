import { z } from 'astro/zod';
import { FechaISO, Revision, crearEvidenciaSchema, crearProcedenciaSchema, listaEventos, listaTemas, type Opciones } from './base';

export const TipoCaso = z
  .enum(['corrupcion', 'acoso_sexual', 'delito_grave', 'conducta_personal', 'otro'])
  .describe('Tipo de caso: corrupcion, acoso_sexual, delito_grave, conducta_personal u otro.');

export const RolInvolucrado = z
  .enum(['imputado', 'bajo_su_mando', 'mencionado'])
  .describe('Rol del político: imputado (procesado o formalizado), bajo_su_mando (el hecho ocurrió en su área de responsabilidad) o mencionado.');

export const EtapaJudicial = z
  .enum(['denuncia', 'investigacion', 'formalizacion', 'condena', 'absolucion', 'archivo'])
  .describe('Etapa judicial: denuncia, investigacion, formalizacion, condena, absolucion o archivo.');

export const EtiquetaLegal = z
  .enum(['denuncia', 'formalizado', 'condena', 'cerrado_sin_condena'])
  .describe('Etiqueta derivada de la última etapa: denuncia (denuncia o investigacion), formalizado, condena, cerrado_sin_condena (absolucion o archivo). El validador la recalcula y falla si no coincide.');

export function etiquetaLegalDesdeEtapa(etapa: z.infer<typeof EtapaJudicial>): z.infer<typeof EtiquetaLegal> {
  switch (etapa) {
    case 'denuncia':
    case 'investigacion':
      return 'denuncia';
    case 'formalizacion':
      return 'formalizado';
    case 'condena':
      return 'condena';
    case 'absolucion':
    case 'archivo':
      return 'cerrado_sin_condena';
  }
}

export function crearCasoSchema(op: Opciones) {
  const { ref } = op;
  const Evidencia = crearEvidenciaSchema(op);

  const Involucrado = z
    .object({
      politico: ref('politicos').describe('Político involucrado (id de content/politicos).'),
      rol: RolInvolucrado,
    })
    .strict();

  const Hito = z
    .object({
      fecha: FechaISO.describe('Fecha del hito judicial (YYYY-MM-DD).'),
      etapa: EtapaJudicial,
      descripcion: z.string().min(1).describe('Qué resolvió quién (fiscalía, juzgado), en una oración.'),
      evidencia: Evidencia,
    })
    .strict()
    .describe('Hito de la línea de tiempo judicial.');

  return z
    .object({
      nombre: z.string().min(1).describe('Nombre público del caso (ej. Caso Astesiano).'),
      tipo: TipoCaso,
      temas: listaTemas(op).optional(),
      eventos: listaEventos(op).optional(),
      involucrados: z.array(Involucrado).min(1).describe('Políticos involucrados y su rol (mínimo 1).'),
      resumen: z.string().min(1).describe('Qué se investiga o se juzgó, en lenguaje descriptivo, sin calificativos.'),
      estado_judicial: z
        .array(Hito)
        .min(1)
        .describe('Línea de tiempo judicial en orden cronológico ascendente (mínimo 1 hito).'),
      etiqueta_legal: EtiquetaLegal,
      revision: Revision,
      procedencia: crearProcedenciaSchema(op),
    })
    .strict()
    .superRefine((c, ctx) => {
      for (let i = 1; i < c.estado_judicial.length; i++) {
        if (c.estado_judicial[i]!.fecha < c.estado_judicial[i - 1]!.fecha) {
          ctx.addIssue({ code: 'custom', path: ['estado_judicial', i, 'fecha'], message: 'La línea de tiempo judicial debe ser ascendente.' });
        }
      }
      const ultima = c.estado_judicial[c.estado_judicial.length - 1]!;
      const esperada = etiquetaLegalDesdeEtapa(ultima.etapa);
      if (c.etiqueta_legal !== esperada) {
        ctx.addIssue({
          code: 'custom',
          path: ['etiqueta_legal'],
          message: `etiqueta_legal debe derivarse de la última etapa (${ultima.etapa} ⇒ ${esperada}).`,
        });
      }
    })
    .describe('Caso judicial o de integridad; solo reproduce lo que ya está en fuentes públicas y requiere aprobación humana.');
}

export type Caso = z.infer<ReturnType<typeof crearCasoSchema>>;
