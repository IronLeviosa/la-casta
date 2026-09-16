import { z } from 'astro/zod';
import { FechaParcial, Revision, crearFuenteSchema, crearImagenSchema, crearProcedenciaSchema, type Opciones } from './base';

export const TipoImpuesto = z
  .enum(['consumo', 'renta', 'patrimonio', 'seguridad_social', 'comercio_exterior', 'otro'])
  .describe('Qué grava, a grandes rasgos: consumo (IVA, IMESI), renta (IRAE, IRPF, IASS), patrimonio, seguridad_social (aportes al BPS), comercio_exterior, otro.');

export const Recaudador = z
  .enum(['dgi', 'bps', 'aduana', 'otro'])
  .describe('Organismo que lo cobra: dgi, bps (contribuciones especiales de seguridad social), aduana, otro.');

/**
 * Tipos de hito de un impuesto: la leyenda por la que el lector filtra la línea de tiempo. Un
 * cambio de tasa y un cambio de alcance son cosas distintas para quien paga, y la página las
 * distingue por color; deducirlo del título se equivoca, así que el investigador lo declara.
 */
export const TIPOS_HITO_IMPUESTO = ['creacion', 'tasa_sube', 'tasa_baja', 'alcance_amplia', 'alcance_reduce', 'reforma', 'derogacion', 'otro'] as const;
export const TipoHitoImpuesto = z
  .enum(TIPOS_HITO_IMPUESTO)
  .describe('creacion | tasa_sube | tasa_baja | alcance_amplia (más gente o más cosas pagan) | alcance_reduce | reforma (cambia el diseño) | derogacion | otro.');

export const EfectoRecaudacion = z
  .enum(['mas', 'menos', 'igual_otras_personas', 'sin_dato'])
  .describe('Qué pasó con lo recaudado según la fuente que lo estimó: mas, menos, igual_otras_personas (misma plata, la pagan otros), sin_dato.');

/**
 * Un tributo, como sujeto: qué grava, quién lo paga y quién no, cómo cambió y quién lo cambió,
 * y cuánto recauda año por año contra el tamaño de la economía.
 *
 * Existe porque los impuestos se cambian por ley con una votación y una explicación pública de
 * quien los impulsa, y el lector los paga sin ver ni la votación ni la explicación. La ficha
 * pone las tres cosas juntas: el cambio (qué tasa, qué alcance, contra cómo era antes), quién lo
 * impulsó (el gobierno o el partido que mandó el proyecto, con la votación si consta) y por qué
 * dijeron que lo hacían, en sus palabras y con fuente.
 *
 * Regla 0 en esta colección: el mismo esquema para todos los tributos y todos los gobiernos. Las
 * justificaciones se registran en palabras de quien las dio, con la misma búsqueda para el
 * impuesto que creó un partido y para el que creó otro; `efecto_recaudacion` sale de una fuente
 * que lo estimó, nunca del sitio. Las cifras de recaudación las escribe un script desde la
 * planilla oficial de la DGI, con la fila citada, y el sitio calcula el porcentaje del PIB con
 * la serie oficial del PIB (`content/series/`).
 */
export function crearImpuestoSchema(op: Opciones) {
  const { ref } = op;
  const Fuente = crearFuenteSchema(op);
  const fuentes = z.array(Fuente).min(1, 'Se requiere al menos una fuente');

  const Norma = z
    .object({
      fecha: FechaParcial,
      norma: z.string().min(3).describe('Ley, decreto o artículo del Texto Ordenado que lo dispone (ej. «Ley 18.083, art. 1»).'),
      ley: ref('leyes').optional().describe('La ley en content/leyes/, si está cargada.'),
      fuentes,
    })
    .strict();

  const Justificacion = z
    .object({
      quien: z.string().min(2).describe('Quién dio la explicación: nombre y cargo o rol (ministro de Economía, senador del partido X, exposición de motivos del Poder Ejecutivo).'),
      politico: ref('politicos').optional().describe('Su ficha, si la tiene.'),
      cita: z.string().min(20).describe('Sus palabras, literales y contiguas: por qué y para qué decían que lo hacían.'),
      fuentes,
    })
    .strict();

  const ImpulsadoPor = z
    .object({
      quien: z.string().min(2).describe('Quién mandó o empujó el proyecto: «Poder Ejecutivo (gobierno de X, partido Y)» o «bancada del partido Y», tal como consta en el documento.'),
      politico: ref('politicos').optional().describe('El presidente o legislador que lo firmó o presentó, si tiene ficha.'),
      fuentes,
    })
    .strict();

  const Hito = z
    .object({
      fecha: FechaParcial,
      titulo: z.string().min(5).max(120).describe('Una línea: qué cambió (ej. «La tasa básica del IVA baja de 23 % a 22 %»).'),
      detalle: z.string().max(400).optional().describe('Una o dos oraciones, si el título no alcanza.'),
      tipo: TipoHitoImpuesto,
      norma: z.string().min(3).optional().describe('La norma que lo dispone (ej. «Ley 18.083, art. 1»).'),
      ley: ref('leyes').optional(),
      votacion: ref('votaciones').optional().describe('La votación en content/votaciones/, si está cargada; es cómo se ve quién votó qué.'),
      impulsado_por: ImpulsadoPor.optional(),
      alcance_antes: z.string().min(10).optional().describe('Quién pagaba y cuánto antes del cambio, en una o dos oraciones con fuente en `fuentes`.'),
      alcance_despues: z.string().min(10).optional().describe('Quién paga y cuánto después del cambio: qué diferencia hay con lo de antes.'),
      efecto_recaudacion: EfectoRecaudacion.optional(),
      justificaciones: z.array(Justificacion).default([]).describe('Por qué y para qué dijeron que lo hacían, en palabras de quienes lo impulsaron.'),
      fuentes,
    })
    .strict();

  const Recaudado = z
    .object({
      anio: z.number().int().min(1900).max(2100),
      pesos: z.number().describe('Pesos uruguayos corrientes de ese año, en unidades, tal como los publica la planilla oficial (puede ser negativo: devoluciones).'),
      componente: z.string().min(2).optional().describe('Cuando la planilla desagrega el tributo (IRPF categoría I y II, adicionales del IMEBA): la columna de donde sale este monto.'),
      fuentes,
    })
    .strict();

  return z
    .object({
      nombre: z.string().min(3).describe('Nombre completo del tributo (ej. Impuesto al Valor Agregado).'),
      sigla: z.string().min(2).max(24).optional().describe('IVA, IMESI, IRAE… como lo nombra la DGI.'),
      tipo: TipoImpuesto,
      recaudador: Recaudador,
      vigente: z.boolean().default(true).describe('false si fue derogado; entonces `derogacion` dice cuándo y por qué norma.'),
      creacion: Norma.optional().describe('Cuándo y por qué norma se creó.'),
      derogacion: Norma.optional().describe('Cuándo y por qué norma dejó de existir.'),
      que_grava: z.string().min(20).optional().describe('Dos a cuatro oraciones neutrales: qué hecho o qué cosa paga este impuesto y con qué tasa general.'),
      que_grava_fuentes: z.array(Fuente).default([]).describe('Las fuentes de `que_grava`; obligatorias si `que_grava` viene.'),
      alcance: z
        .object({
          quien_paga: z.string().min(10).describe('Quiénes lo pagan hoy, con las franjas o mínimos que fija la norma.'),
          quien_no: z.string().min(10).optional().describe('Quiénes quedan afuera (exonerados, por debajo del mínimo, empresas si recae en consumidores).'),
          fuentes,
        })
        .strict()
        .optional(),
      hitos: z.array(Hito).default([]).describe('La historia del tributo: cada cambio con quién lo impulsó, cómo se votó y por qué dijeron que lo hacían.'),
      recaudacion: z.array(Recaudado).default([]).describe('Un ítem por año (y por componente si la planilla desagrega), en pesos corrientes, con la fila oficial citada.'),
      resumen: z.string().optional().describe('Párrafos del editor para el lector: qué muestra la ficha y qué cambió, con las cifras y sin adjetivos.'),
      fuentes: z.array(Fuente).default([]).describe('Fuentes generales de la ficha.'),
      imagenes: z.array(crearImagenSchema(op)).default([]),
      revision: Revision,
      procedencia: crearProcedenciaSchema(op),
    })
    .strict()
    .superRefine((imp, ctx) => {
      if (imp.que_grava && imp.que_grava_fuentes.length === 0) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['que_grava_fuentes'], message: '`que_grava` lleva al menos una fuente en `que_grava_fuentes`.' });
      }
      if (!imp.vigente && !imp.derogacion) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['derogacion'], message: 'Un tributo con `vigente: false` dice en `derogacion` cuándo y por qué norma dejó de existir.' });
      }
      if (imp.recaudacion.length === 0 && imp.hitos.length === 0 && !imp.que_grava) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['recaudacion'], message: 'Una ficha vacía no se publica: hace falta `recaudacion[]`, `hitos[]` o `que_grava`.' });
      }
      const vistos = new Set<string>();
      imp.recaudacion.forEach((r, i) => {
        const clave = `${r.anio}|${r.componente ?? ''}`;
        if (vistos.has(clave)) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['recaudacion', i], message: `Año ${r.anio}${r.componente ? ` (${r.componente})` : ''} repetido en recaudacion[].` });
        vistos.add(clave);
      });
    });
}

export type TipoHitoImpuesto = (typeof TIPOS_HITO_IMPUESTO)[number];
