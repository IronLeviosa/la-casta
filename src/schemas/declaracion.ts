import { z } from 'astro/zod';
import { FechaISO, Revision, crearEvidenciaSchema, crearImagenSchema, crearProcedenciaSchema, listaEventos, type Opciones } from './base';

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
      /**
       * Una línea que diga de qué va, para el encabezado de la página y las listas.
       *
       * Hasta ahora el título de la página era el `resumen`, que tiene una mediana de 237
       * caracteres: siete líneas de título en pantalla. El lector que entra quiere saber en un
       * segundo de qué se trata, y recién después leer el contexto. Si falta, la página deriva uno
       * de la primera oración del resumen, pero ese es un parche: el editor lo escribe.
       */
      titulo: z.string().min(8).max(110).optional().describe('Título corto (8-110 caracteres): de qué va, en una línea. Lo escribe el editor.'),
      resumen: z.string().min(1).describe('Qué afirma o promete, en una oración neutral. Es el contexto, no el título: dónde, ante quién, respondiendo a qué. Las erratas del medio no van acá (van a notas_internas): al lector le importa qué se dijo, no cómo lo tipeó el diario.'),
      evidencia: crearEvidenciaSchema(op),
      imagenes: z.array(crearImagenSchema()).default([]).describe('Imágenes con licencia libre que aporten (la foto oficial del acto, un recorte del documento).'),
      revision: Revision,
      procedencia: crearProcedenciaSchema(op),
    })
    .strict()
    .describe('Declaración pública de un político sobre un tema, con cita textual y evidencia.');
}

export type Declaracion = z.infer<ReturnType<typeof crearDeclaracionSchema>>;
