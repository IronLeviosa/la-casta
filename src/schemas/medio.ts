import { z } from 'astro/zod';
import { Revision, crearFuenteSchema, type Opciones } from './base';

export const TipoMedio = z
  .enum(['diario', 'semanario', 'portal', 'tv', 'radio', 'agencia', 'estatal', 'enciclopedia'])
  .describe('Tipo de medio: diario, semanario, portal, tv, radio, agencia, estatal (organismo público) o enciclopedia (obra de referencia).');

export const EtiquetaAlineamiento = z
  .enum(['oficialista_tradicional', 'progresista', 'independiente', 'estatal', 'sin_datos'])
  .describe(
    'oficialista_tradicional: vínculo documentado con los partidos tradicionales (Nacional, Colorado); progresista: vínculo documentado o autodefinición de izquierda / Frente Amplio; independiente: sin vínculo partidario documentado y propiedad sin grupo económico dominante (cooperativa, autogestión); estatal: organismo público; sin_datos: no hay fuente que respalde una etiqueta, nunca se adivina.',
  );

export function crearMedioSchema(op: Opciones) {
  const Fuente = crearFuenteSchema(op);
  const fuentes = z.array(Fuente).min(1, 'Se requiere al menos una fuente').describe('Fuentes que respaldan la descripción (mínimo 1).');

  return z
    .object({
      nombre: z.string().min(1).describe('Nombre del medio tal como se muestra (ej. El País).'),
      tipo: TipoMedio,
      grupo: z
        .string()
        .min(1)
        .describe('Familia o grupo de propiedad (ej. scheck-aguirre, fontaina-de-feo). Dos fuentes del mismo grupo cuentan como una para la regla de independencia.'),
      url: z.url().describe('Sitio web principal del medio.'),
      dominios: z
        .array(z.url())
        .optional()
        .describe(
          'Otros dominios o rutas del mismo medio, para que una URL publicada ahí se le atribuya. ' +
            'Presidencia publica en gub.uy/presidencia y también en medios.presidencia.gub.uy; sin esto, ' +
            'el segundo host queda sin medio y la fuente no se puede citar. Lo lee scripts/corpus/fuente.ts.',
        ),
      alias: z.array(z.string().min(1)).optional().describe('Otros nombres con los que se cita (ej. Canal 10 para Subrayado).'),
      propiedad: z
        .object({
          descripcion: z.string().min(1).describe('Quién es dueño y desde cuándo, en una o dos oraciones, sin adjetivos.'),
          fuentes,
        })
        .strict()
        .describe('Propiedad del medio con fuentes.'),
      alineamiento: z
        .object({
          etiqueta: EtiquetaAlineamiento,
          justificacion: z.string().min(1).describe('Por qué esa etiqueta, citando la fuente; si es sin_datos, decir qué se buscó y no se encontró.'),
          fuentes,
        })
        .strict()
        .describe('Alineamiento editorial documentado, con fuentes.'),
      revision: Revision,
    })
    .strict()
    .describe('Perfil de un medio: propiedad y alineamiento, ambos con fuentes.');
}

export type Medio = z.infer<ReturnType<typeof crearMedioSchema>>;
