import { z } from 'astro/zod';
import { FechaISO } from './base';

/** Frontmatter de las páginas de prosa en content/paginas/*.md. */
export const PaginaSchema = z
  .object({
    titulo: z.string().min(1).describe('Título de la página.'),
    descripcion: z.string().min(1).optional().describe('Descripción corta para meta tags y listados.'),
    actualizado: FechaISO.describe('Fecha de la última actualización (YYYY-MM-DD).'),
  })
  .strict()
  .describe('Página de prosa (metodología, sobre, réplica).');

export type Pagina = z.infer<typeof PaginaSchema>;
