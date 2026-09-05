import { z } from 'astro/zod';
import { FechaISO, Revision, crearFuenteSchema, crearProcedenciaSchema, listaTemas, type Opciones } from './base';

export function crearEventoSchema(op: Opciones) {
  const { ref } = op;
  const Fuente = crearFuenteSchema(op);

  return z
    .object({
      nombre: z.string().min(1).describe('Nombre del evento para mostrar (ej. Caso Astesiano).'),
      alias: z.array(z.string().min(1)).min(1).describe('Frases con las que la prensa nombra el evento; disparan la etiqueta al ingresar notas al corpus.'),
      desde: FechaISO.describe('Inicio del evento (YYYY-MM-DD).'),
      hasta: FechaISO.optional().describe('Fin del evento (YYYY-MM-DD). Vacío si sigue abierto.'),
      temas: listaTemas(op).min(1).describe('Temas de la taxonomía relacionados (mínimo 1).'),
      politicos: z.array(ref('politicos')).describe('Políticos involucrados (ids de content/politicos). Puede ser vacío.'),
      casos: z.array(ref('casos')).default([]).describe('Casos judiciales asociados (ids de content/casos).'),
      resumen: z.string().min(1).describe('Qué pasó, en dos a cuatro oraciones descriptivas; cada afirmación debe estar en las fuentes.'),
      fuentes: z.array(Fuente).min(1, 'Se requiere al menos una fuente').describe('Fuentes que respaldan el resumen (mínimo 1).'),
      revision: Revision,
      procedencia: crearProcedenciaSchema(op).optional().describe('Opcional en colecciones de referencia; obligatoria cuando el registro sale de una corrida.'),
    })
    .strict()
    .superRefine((e, ctx) => {
      if (e.hasta && e.hasta < e.desde) {
        ctx.addIssue({ code: 'custom', path: ['hasta'], message: 'hasta debe ser posterior a desde.' });
      }
    })
    .describe('Evento fechado que sirve de eje de navegación junto a personas y temas.');
}

export type Evento = z.infer<ReturnType<typeof crearEventoSchema>>;
