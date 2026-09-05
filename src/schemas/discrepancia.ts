import { z } from 'astro/zod';
import { FechaISO, Revision, crearEvidenciaSchema, crearFuenteSchema, crearProcedenciaSchema, type Opciones } from './base';

export const TipoDiscrepancia = z
  .enum(['dato_erroneo', 'atribucion_incorrecta', 'contexto_omitido', 'titular_no_respaldado', 'cita_alterada'])
  .describe(
    'dato_erroneo: una cifra, fecha o norma que no coincide con la fuente primaria. ' +
      'atribucion_incorrecta: le pone a alguien una afirmación que en la fuente dijo otro. ' +
      'contexto_omitido: lo publicado es cierto pero omite algo del mismo documento que cambia lo que significa. ' +
      'titular_no_respaldado: el titular afirma más de lo que sostiene el cuerpo de la nota. ' +
      'cita_alterada: la cita entre comillas no coincide con lo que dice el registro primario.',
  );

/**
 * Distancia entre lo que publicó un medio y lo que dice la fuente primaria.
 *
 * Existe porque el sitio ya mide el sesgo de los medios por tono y por propiedad, y le falta la
 * dimensión más comprobable: si lo que publican coincide con el documento. Cuando el pipeline
 * encuentra una diferencia yendo al original, ese hallazgo hoy se pierde en las razones de una
 * corrida; acá queda como registro consultable.
 *
 * Tres reglas que la Regla 0 impone sobre esta colección, y que valen más que el resto del esquema:
 *
 * 1. **Solo se registra contra una fuente primaria.** Un desacuerdo entre dos medios no es una
 *    discrepancia: es un desacuerdo. Hace falta el documento oficial, el diario de sesiones o el
 *    video que decide cuál dice lo que el original dice. Sin eso, va a `hipotesis/`.
 * 2. **Sin verbos de intención.** No se sabe si el medio se equivocó, copió mal o mintió, y el
 *    esquema no tiene campo para eso a propósito. Se registra qué publicó y qué dice el original.
 * 3. **El mismo umbral para todos.** Un error del medio que cubre favorablemente a alguien pesa
 *    igual que el del medio que lo cubre en contra. `pnpm auditar` compara la cantidad de
 *    discrepancias por medio contra la cantidad de veces que ese medio fue citado, porque contar
 *    errores sin contar citas castiga al medio que más se usa.
 */
export function crearDiscrepanciaSchema(op: Opciones) {
  const { ref } = op;
  const Fuente = crearFuenteSchema(op);

  return z
    .object({
      medio: ref('medios').describe('Medio que publicó lo que no coincide (id de content/medios).'),
      fecha: FechaISO.describe('Fecha de la publicación con la discrepancia (YYYY-MM-DD).'),
      tipo: TipoDiscrepancia,
      tema: ref('temas').optional().describe('Tema del asunto, si aplica.'),
      politico: ref('politicos').optional().describe('Político del que trataba la nota, si aplica.'),
      publicado: z
        .object({
          url: z.url().describe('URL de la nota.'),
          titulo: z.string().min(1),
          cita: z.string().min(20).describe('Copia literal y contigua de lo que publicó el medio. Es la mitad de la comparación.'),
          retrieved_at: FechaISO,
        })
        .strict()
        .describe('Lo que publicó el medio, en sus palabras.'),
      fuente_primaria: z
        .object({
          cita: z.string().min(20).describe('Copia literal y contigua del documento original que no coincide con lo publicado.'),
          fuentes: z
            .array(Fuente)
            .min(1)
            .describe('El registro primario: documento oficial, diario de sesiones o video. Una nota de otro medio no alcanza.'),
        })
        .strict()
        .describe('Lo que dice el original.'),
      analisis: z
        .string()
        .min(1)
        .describe('En qué difieren las dos citas y qué cambia esa diferencia, en lenguaje llano. Sin verbos de intención: no se sabe por qué difieren.'),
      detectada_en: z
        .string()
        .min(1)
        .describe('Id de la corrida donde apareció el hallazgo, para poder reconstruir cómo se encontró.'),
      evidencia: crearEvidenciaSchema(op),
      revision: Revision,
      procedencia: crearProcedenciaSchema(op),
    })
    .strict()
    .superRefine((d, ctx) => {
      const primarios = new Set(['documento_oficial', 'diario_de_sesiones', 'video']);
      if (!d.fuente_primaria.fuentes.some((f) => primarios.has(f.tipo))) {
        ctx.addIssue({
          code: 'custom',
          path: ['fuente_primaria', 'fuentes'],
          message:
            'Una discrepancia se registra contra un registro primario (documento_oficial, diario_de_sesiones o video). ' +
            'Dos medios que se contradicen entre sí no son una discrepancia; eso va a hipotesis/.',
        });
      }
    })
    .describe('Diferencia comprobable entre lo que publicó un medio y lo que dice la fuente primaria del mismo hecho.');
}

export type Discrepancia = z.infer<ReturnType<typeof crearDiscrepanciaSchema>>;
