import { z } from 'astro/zod';
import { FechaISO, NOMBRES_COLECCIONES, Revision, crearFuenteSchema, type Opciones } from './base';

export const TipoCorreccion = z
  .enum(['error_factual', 'fuente_caida', 'replica', 'cambio_de_rating'])
  .describe('Tipo de corrección: error_factual, fuente_caida, replica (derecho de réplica) o cambio_de_rating.');

const patronIdCompleto = new RegExp(`^(${NOMBRES_COLECCIONES.join('|')})/[a-z0-9][a-z0-9/-]*$`);

export function crearCorreccionSchema(op: Opciones) {
  const Fuente = crearFuenteSchema(op);
  return z
    .object({
      fecha: FechaISO.describe('Fecha de la corrección (YYYY-MM-DD).'),
      tipo: TipoCorreccion,
      afecta: z
        .array(z.string().regex(patronIdCompleto, 'Id completo: <coleccion>/<id>, ej. giros/lacalle-pou/iva-tarjeta-2020'))
        .min(1)
        .describe('Ids completos de los registros afectados, con prefijo de colección (ej. declaraciones/lacalle-pou/2019-10-15-no-subir-impuestos).'),
      motivo: z.string().min(1).describe('Qué estaba mal y qué se cambió, en lenguaje llano.'),
      solicitante: z.string().min(1).optional().describe('Quién pidió la corrección (ej. reclamo #12, réplica de X, detección interna).'),
      reemplaza: z.string().regex(patronIdCompleto).optional().describe('Si un registro fue reemplazado por otro, id completo del nuevo registro.'),
      fuentes: z.array(Fuente).optional().describe('Fuentes que respaldan la corrección, si las hay.'),
      revision: Revision,
    })
    .strict()
    .describe('Corrección publicada: qué registros afecta, por qué y quién la pidió. Los ids nunca se renombran; los cambios van por acá.');
}

export type Correccion = z.infer<ReturnType<typeof crearCorreccionSchema>>;
