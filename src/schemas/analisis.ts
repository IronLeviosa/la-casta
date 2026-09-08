import { z } from 'astro/zod';
import { FechaISO, Revision, crearFuenteSchema, crearGraficoSchema, crearImagenSchema, crearProcedenciaSchema, type Opciones } from './base';
import { Calificacion } from './chequeo';

/**
 * Un análisis hecho por un tercero (un centro de estudios, una consultora, un medio, un
 * sindicato, una cámara) sobre una empresa pública o un político, verificado afirmación por
 * afirmación contra los documentos oficiales.
 *
 * Existe porque la tabla de comparaciones de una ficha de empresa mostraba cuatro filas que
 * salían de la misma nota, cada una con un párrafo, y un lector dijo lo obvio: ese análisis
 * merece una página propia, y la tabla una sola fila que lleve a ella. La página no reproduce el
 * análisis: dice quién lo hizo, dónde se publicó, qué afirma, y qué dicen los documentos
 * oficiales sobre cada cifra, con las mismas cuatro calificaciones del Veracímetro y la misma
 * regla dura (verde, lima y rojo solo con documento oficial o diario de sesiones).
 *
 * Regla 0: el mismo umbral para el análisis que favorece a alguien y para el que lo perjudica; el
 * vínculo del autor con un partido o un gobierno se registra como dato con fuente, en
 * `autor_es`, no como adjetivo.
 */
export function crearAnalisisSchema(op: Opciones) {
  const { ref } = op;
  const Fuente = crearFuenteSchema(op);
  const fuentes = z.array(Fuente).min(1, 'Se requiere al menos una fuente');
  const Grafico = crearGraficoSchema();

  const Afirmacion = z
    .object({
      afirmacion: z.string().min(10).describe('Qué afirma el análisis, como dato concreto (cifra, fecha, comparación).'),
      fragmento: z.string().min(10).optional().describe('El tramo literal del análisis donde lo dice.'),
      calificacion: Calificacion,
      dato_real: z
        .object({
          valor: z.string().min(10).describe('Qué dice el documento oficial, en párrafos cortos con el veredicto en el primero.'),
          fuentes,
        })
        .strict(),
      analisis: z.string().min(20).max(1500).optional().describe('Por qué esa calificación, en dos o tres oraciones.'),
      grafico: Grafico.optional(),
    })
    .strict()
    .superRefine((a, ctx) => {
      if (a.calificacion !== 'discutible') {
        const tieneOficial = a.dato_real.fuentes.some((f) => f.tipo === 'documento_oficial' || f.tipo === 'diario_de_sesiones');
        if (!tieneOficial) {
          ctx.addIssue({
            code: 'custom',
            path: ['dato_real', 'fuentes'],
            message: `Una calificación "${a.calificacion}" exige al menos una fuente de tipo documento_oficial o diario_de_sesiones en dato_real; con prensa sola solo se puede calificar "discutible".`,
          });
        }
      }
    });

  return z
    .object({
      titulo: z.string().min(10).max(160).describe('Qué analiza y de quién, para el lector (ej. «Sobreprecio de los combustibles frente a la paridad, 2010-2019, según el CED»).'),
      empresa: ref('empresas').optional().describe('La empresa pública sobre la que trata, si es una.'),
      politico: ref('politicos').optional().describe('El político sobre el que trata, si es uno.'),
      tema: ref('temas').optional(),
      autor: z.string().min(2).describe('Quién hizo el análisis (organismo, centro de estudios, consultora, periodista).'),
      autor_es: z.string().min(10).optional().describe('Qué es el autor y qué vínculos documentados tiene, como dato con fuente en `fuentes`, sin adjetivos.'),
      fecha: FechaISO.describe('Fecha de publicación del análisis (YYYY-MM-DD).'),
      publicado: Fuente.describe('Dónde se publicó el análisis: la nota, el informe o el PDF, con una cita de su título o primera oración.'),
      resumen: z.string().min(40).describe('Qué sostiene el análisis, en párrafos cortos y sin adjetivos propios.'),
      metodo: z.string().min(20).optional().describe('El método tal como lo describe el autor, si lo describe.'),
      afirmaciones: z.array(Afirmacion).min(1).describe('Cada dato concreto del análisis, verificado contra el documento oficial.'),
      veredicto: z.string().min(20).describe('Síntesis del editor: cuántas afirmaciones quedaron en cada calificación y qué cambia eso en la conclusión del análisis.'),
      graficos: z.array(Grafico).max(3).default([]),
      imagenes: z.array(crearImagenSchema()).default([]),
      fuentes: z.array(Fuente).default([]).describe('Fuentes que no calzan en una afirmación (sobre el autor, el contexto).'),
      revision: Revision,
      procedencia: crearProcedenciaSchema(op),
    })
    .strict()
    .refine((a) => a.empresa !== undefined || a.politico !== undefined, 'Un análisis es sobre una empresa pública o sobre un político: falta `empresa` o `politico`.')
    .describe('Análisis de un tercero sobre una empresa o un político, verificado afirmación por afirmación contra documentos oficiales.');
}

export type Analisis = z.infer<ReturnType<typeof crearAnalisisSchema>>;
