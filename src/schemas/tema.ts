import { z } from 'astro/zod';
import { Revision, type Opciones } from './base';

export function crearTemaSchema({ ref }: Opciones) {
  return z
    .object({
      nombre: z.string().min(1).describe('Nombre del tema para mostrar (ej. Impuestos).'),
      padre: ref('temas').optional().describe('Tema padre en la jerarquía (ej. economia para economia/impuestos). Vacío en temas raíz.'),
      alias: z
        .array(z.string().min(1))
        .min(1)
        .describe('Palabras y frases que disparan el tema al etiquetar notas (ej. "IPC", "suba de precios" para inflación).'),
      descripcion: z.string().min(1).describe('Qué cubre el tema, en una o dos oraciones, para que el etiquetador y el lector lo apliquen igual.'),
      revision: Revision,
    })
    .strict()
    .describe('Tema de la taxonomía jerárquica; el id es la ruta (ej. economia/impuestos).');
}

export type Tema = z.infer<ReturnType<typeof crearTemaSchema>>;
