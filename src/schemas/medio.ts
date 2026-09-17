import { z } from 'astro/zod';
import { FechaISO, Revision, crearFuenteSchema, crearProcedenciaSchema, type Opciones } from './base';

export const TipoMedio = z
  .enum(['diario', 'semanario', 'portal', 'tv', 'radio', 'agencia', 'estatal', 'enciclopedia'])
  .describe('Tipo de medio: diario, semanario, portal, tv, radio, agencia, estatal (organismo público) o enciclopedia (obra de referencia).');

export const EtiquetaAlineamiento = z
  .enum(['oficialista_tradicional', 'progresista', 'independiente', 'estatal', 'sin_datos'])
  .describe(
    'oficialista_tradicional: vínculo documentado con los partidos tradicionales (Nacional, Colorado); progresista: vínculo documentado o autodefinición de izquierda / Frente Amplio; independiente: sin vínculo partidario documentado y propiedad sin grupo económico dominante (cooperativa, autogestión); estatal: organismo público; sin_datos: no hay fuente que respalde una etiqueta, nunca se adivina.',
  );

/**
 * Tramo de propiedad con fecha (docs/plan-grupo-por-fecha.md): el grupo de un medio no siempre fue
 * el mismo, y el validador tiene que evaluar "dos fuentes de distinto grupo" con el grupo que el
 * medio tenía **en la fecha de la fuente**, no con el vigente. Sin esto, una nota de El Observador
 * de antes del 5 de mayo de 2022 contaba como "grupo werthein-hochbaum" cuando en esa fecha el
 * dueño todavía era Peirano.
 */
function crearTramoGrupoSchema(op: Opciones) {
  const Fuente = crearFuenteSchema(op);
  return z
    .object({
      grupo: z
        .string()
        .min(1)
        .describe('Grupo de propiedad vigente durante este tramo, o "desconocido" si se buscó y no se encontró quién era el dueño.'),
      desde: FechaISO.describe('Primer día documentado en que este grupo fue dueño del medio (YYYY-MM-DD).'),
      hasta: FechaISO.optional().describe('Último día de este tramo (YYYY-MM-DD). Se omite en el tramo vigente.'),
      fuentes: z
        .array(Fuente)
        .describe('Fuentes que documentan este tramo, misma forma que `propiedad.fuentes`. Vacío solo si `grupo` es "desconocido".'),
    })
    .strict()
    .superRefine((t, ctx) => {
      if (t.grupo !== 'desconocido' && t.fuentes.length === 0) {
        ctx.addIssue({
          code: 'custom',
          path: ['fuentes'],
          message: 'Un tramo con grupo distinto de "desconocido" exige al menos una fuente que lo documente.',
        });
      }
      if (t.hasta && t.hasta < t.desde) {
        ctx.addIssue({ code: 'custom', path: ['hasta'], message: '"hasta" no puede ser anterior a "desde".' });
      }
    })
    .describe('Tramo de propiedad: grupo, desde, hasta (opcional en el tramo vigente) y las fuentes que lo documentan.');
}

export function crearMedioSchema(op: Opciones) {
  const { ref } = op;
  const Fuente = crearFuenteSchema(op);
  const fuentes = z.array(Fuente).min(1, 'Se requiere al menos una fuente').describe('Fuentes que respaldan la descripción (mínimo 1).');
  const TramoGrupo = crearTramoGrupoSchema(op);

  return z
    .object({
      nombre: z.string().min(1).describe('Nombre del medio tal como se muestra (ej. El País).'),
      tipo: TipoMedio,
      grupo: z
        .string()
        .min(1)
        .describe('Familia o grupo de propiedad (ej. scheck-aguirre, fontaina-de-feo). Dos fuentes del mismo grupo cuentan como una para la regla de independencia.'),
      grupo_historial: z
        .array(TramoGrupo)
        .min(1)
        .optional()
        .describe(
          'Tramos de propiedad con fecha, ordenados por `desde` y sin solaparse; opcional (sin esto, `grupo` vale para toda fecha). ' +
            'El validador evalúa cada fuente citada con el grupo del tramo que contiene `fuente.fecha`; fuera de todo tramo, cuenta como ' +
            '"desconocido". El último tramo (el de fecha más tardía) fija el `grupo` vigente, que tiene que coincidir con él.',
        ),
      url: z.url().describe('Sitio web principal del medio.'),
      empresa: ref('empresas')
        .optional()
        .describe('Si este "medio" es en realidad una empresa pública o un ente que publica sus propios documentos, la ficha de la empresa (id de content/empresas). Los enlaces del sitio van ahí.'),
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
      procedencia: crearProcedenciaSchema(op).optional().describe('Opcional en colecciones de referencia; la escribe `pnpm promover` cuando el perfil cambia por una corrección.'),
    })
    .strict()
    .superRefine((m, ctx) => {
      const tramos = m.grupo_historial;
      if (!tramos || tramos.length === 0) return;
      // Ordenados por `desde`, sin fechas repetidas ni fuera de orden: se exige que ya vengan así
      // escritos (no se reordena en silencio), porque un tramo fuera de lugar suele ser un error de
      // tipeo en la fecha, no una intención.
      for (let i = 1; i < tramos.length; i++) {
        if (tramos[i].desde <= tramos[i - 1].desde) {
          ctx.addIssue({
            code: 'custom',
            path: ['grupo_historial', i, 'desde'],
            message: 'Los tramos de `grupo_historial` tienen que estar ordenados por `desde`, sin fechas repetidas.',
          });
        }
      }
      // Sin solaparse: todo tramo salvo el último necesita `hasta`, y `hasta` tiene que ser anterior
      // al `desde` del tramo siguiente.
      for (let i = 0; i < tramos.length - 1; i++) {
        const actual = tramos[i];
        const siguiente = tramos[i + 1];
        if (!actual.hasta) {
          ctx.addIssue({
            code: 'custom',
            path: ['grupo_historial', i, 'hasta'],
            message: 'Todo tramo salvo el último de `grupo_historial` necesita `hasta` (el tramo vigente es el único que puede omitirlo).',
          });
        } else if (actual.hasta >= siguiente.desde) {
          ctx.addIssue({
            code: 'custom',
            path: ['grupo_historial', i, 'hasta'],
            message: 'Los tramos de `grupo_historial` no pueden solaparse: `hasta` tiene que ser anterior al `desde` del tramo siguiente.',
          });
        }
      }
      // `grupo` (el vigente) tiene que ser el del último tramo cronológico.
      const ultimo = tramos[tramos.length - 1];
      if (ultimo.grupo !== m.grupo) {
        ctx.addIssue({
          code: 'custom',
          path: ['grupo'],
          message: `"grupo" ("${m.grupo}") tiene que coincidir con el grupo del último tramo de \`grupo_historial\` ("${ultimo.grupo}"), que es el vigente.`,
        });
      }
    })
    .describe('Perfil de un medio: propiedad y alineamiento, ambos con fuentes.');
}

export type Medio = z.infer<ReturnType<typeof crearMedioSchema>>;
