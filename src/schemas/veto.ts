import { z } from 'astro/zod';
import { FechaISO, Revision, crearEvidenciaSchema, crearFuenteSchema, crearProcedenciaSchema, type Opciones } from './base';

export const AlcanceVeto = z
  .enum(['total', 'parcial'])
  .describe('total: el Poder Ejecutivo observa el proyecto entero. parcial: observa artículos determinados y el resto puede promulgarse.');

/**
 * Qué pasó después del veto.
 *
 * El veto no es la última palabra: la Asamblea General puede levantarlo con la mayoría especial
 * que fija la Constitución. Por eso un veto sin desenlace registrado cuenta la mitad de la
 * historia, y el desenlace se documenta con el mismo rigor que el veto.
 */
export const ResultadoVeto = z
  .enum(['observaciones_aceptadas', 'veto_levantado', 'pendiente', 'sin_datos'])
  .describe(
    'observaciones_aceptadas: el veto quedó firme y el proyecto no se promulgó como venía. ' +
      'veto_levantado: la Asamblea General reunió la mayoría necesaria y la ley se promulgó igual. ' +
      'pendiente: el plazo todavía corre o la Asamblea no se pronunció. ' +
      'sin_datos: no se encontró fuente del desenlace; nunca se adivina.',
  );

export function crearVetoSchema(op: Opciones) {
  const { ref } = op;
  const Fuente = crearFuenteSchema(op);
  const Evidencia = crearEvidenciaSchema(op);

  return z
    .object({
      politico: ref('politicos').describe('Presidente que firmó el veto (id de content/politicos).'),
      tema: ref('temas').describe('Tema principal del proyecto vetado (id de content/temas).'),
      titulo: z.string().min(1).describe('Cómo se conoce el proyecto o la ley vetada, en lenguaje llano.'),
      ley: ref('leyes').optional().describe('Ficha de la ley en content/leyes/, si el proyecto llegó a ser ley y está fichada.'),
      numero_ley: z
        .string()
        .optional()
        .describe('Número de la ley o del proyecto tal como se cita ("18.987"). Puede faltar: un proyecto vetado antes de promulgarse no siempre tiene número de ley.'),
      fecha: FechaISO.describe('Fecha en que el Poder Ejecutivo comunicó las observaciones (YYYY-MM-DD).'),
      alcance: AlcanceVeto,
      articulos_observados: z
        .array(z.string().min(1))
        .optional()
        .describe('Artículos observados cuando el alcance es parcial, como se numeran en el proyecto.'),
      fundamento: z
        .string()
        .min(1)
        .describe('Qué argumentó el Poder Ejecutivo para vetar, en una o dos oraciones de lenguaje llano y sin adjetivos. Se apoya en `evidencia`.'),
      resultado: z
        .object({
          estado: ResultadoVeto,
          fecha: FechaISO.optional().describe('Fecha en que la Asamblea General se pronunció, si se pronunció.'),
          detalle: z.string().min(1).describe('Qué pasó, en una oración: si se levantó el veto, con qué votos; si quedó firme, por qué.'),
          fuentes: z.array(Fuente).describe('Fuentes del desenlace. Vacío solo si el estado es `pendiente` o `sin_datos`, y eso se dice en `detalle`.'),
        })
        .strict()
        .describe('Desenlace parlamentario del veto. Un veto sin desenlace documentado no llega a tier publicado.'),
      analisis: z
        .string()
        .min(1)
        .describe('Qué se vetó, con qué argumento, qué pasó después y qué dijo el presidente al respecto. Sin verbos de intención: no se sabe por qué lo hizo, se sabe qué hizo.'),
      evidencia: Evidencia,
      revision: Revision,
      procedencia: crearProcedenciaSchema(op),
    })
    .strict()
    .superRefine((v, ctx) => {
      if (v.alcance === 'parcial' && (!v.articulos_observados || v.articulos_observados.length === 0)) {
        ctx.addIssue({ code: 'custom', path: ['articulos_observados'], message: 'Un veto parcial tiene que decir qué artículos se observaron.' });
      }
      if ((v.resultado.estado === 'observaciones_aceptadas' || v.resultado.estado === 'veto_levantado') && v.resultado.fuentes.length === 0) {
        ctx.addIssue({ code: 'custom', path: ['resultado', 'fuentes'], message: 'Un desenlace afirmado necesita al menos una fuente; si no la hay, el estado es sin_datos.' });
      }
      if (v.revision.tier === 'publicado' && (v.resultado.estado === 'sin_datos' || v.resultado.estado === 'pendiente') && v.resultado.fuentes.length === 0) {
        ctx.addIssue({
          code: 'custom',
          path: ['resultado', 'estado'],
          message: 'Un veto sin desenlace documentado no va a tier publicado: bajalo a probable hasta conseguir la fuente del desenlace.',
        });
      }
    })
    .describe(
      'Veto presidencial: el Poder Ejecutivo observa un proyecto ya aprobado por el Parlamento. Es la facultad por la que una sola persona ' +
        'puede frenar lo que votaron las dos cámaras, y por eso se registra con su fundamento y su desenlace.',
    );
}

export type Veto = z.infer<ReturnType<typeof crearVetoSchema>>;
