import { z } from 'astro/zod';
import { Revision, type Opciones } from './base';

export const TipoReferente = z
  .enum(['persona', 'organizacion', 'obra', 'corriente'])
  .describe('Tipo de referente: persona, organizacion, obra (libro, documento) o corriente (escuela de pensamiento).');

export function crearReferenteSchema(_op: Opciones) {
  return z
    .object({
      nombre: z.string().min(1).describe('Nombre del referente (ej. José Batlle y Ordóñez, Milton Friedman).'),
      tipo: TipoReferente,
      wikidata: z.string().regex(/^Q\d+$/, 'QID de Wikidata').optional().describe('Identificador de Wikidata (QID), si existe.'),
      alias: z.array(z.string().min(1)).min(1).describe('Formas en que se lo nombra en la prensa.'),
      descripcion: z.string().min(1).describe('Quién o qué es, en una o dos oraciones neutrales.'),
      revision: Revision,
    })
    .strict()
    .describe('Referente citado por políticos (persona, organización, obra o corriente).');
}

export type Referente = z.infer<ReturnType<typeof crearReferenteSchema>>;
