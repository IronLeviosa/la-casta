import { z } from 'astro/zod';
import { FechaParcial, Revision, crearFuenteSchema, crearImagenSchema, crearProcedenciaSchema, type Opciones } from './base';

export const TipoEmpresa = z
  .enum(['empresa_publica', 'ente_autonomo', 'servicio_descentralizado', 'sociedad_estatal'])
  .describe('Forma jurídica: empresa_publica (ANCAP, UTE, OSE, ANTEL), ente_autonomo, servicio_descentralizado o sociedad_estatal (sociedad anónima de propiedad estatal).');

/**
 * Una empresa pública o un ente del Estado, como sujeto.
 *
 * Existe porque el lector es dueño de estas empresas, en el sentido literal: se financian y se
 * capitalizan con plata de todos, y sus ganancias van al Estado. La ficha responde lo que un dueño
 * preguntaría: qué hace, cómo le va año por año, qué pasa con las ganancias, con qué ley tiene el
 * negocio reservado si lo tiene, y qué dicen a favor y en contra de ese diseño.
 *
 * Regla 0 en esta colección: las cifras se registran como cifras, con su documento (estados
 * contables auditados, Rendición de Cuentas, URSEA), sin adjetivos ni verbos de intención; y si
 * la empresa tiene un monopolio, los argumentos a favor y en contra se documentan con el mismo
 * esfuerzo, cada uno en palabras de quien lo sostiene y con su fuente. El esquema lo exige: un
 * monopolio sin argumentos de los dos lados no valida.
 */
export function crearEmpresaSchema(op: Opciones) {
  const Fuente = crearFuenteSchema(op);
  const fuentes = z.array(Fuente).min(1, 'Se requiere al menos una fuente');

  const Argumento = z
    .object({
      texto: z.string().min(20).describe('Una idea, en palabras de quien la sostiene o resumida sin adjetivos.'),
      quien: z.string().min(1).describe('Quién lo sostiene: organismo, partido, persona, informe.'),
      fuentes,
    })
    .strict();

  const Monto = z
    .object({
      pesos: z.number().optional().describe('Monto en pesos uruguayos, tal como figura en el documento.'),
      usd: z.number().optional().describe('Monto en dólares (millones si la unidad lo dice), tal como figura o convertido con el tipo de cambio declarado.'),
      unidad: z.enum(['unidades', 'miles', 'millones']).default('millones').describe('Unidad de los montos: unidades, miles o millones.'),
      tipo_cambio: z.enum(['cierre', 'promedio']).optional().describe('Convención usada para pasar de pesos a dólares, si se convirtió.'),
      concepto: z.string().optional().describe('Qué es exactamente (aportes a Rentas Generales, dividendos, capitalización por ley N…).'),
      fuentes,
    })
    .strict()
    .refine((m) => m.pesos !== undefined || m.usd !== undefined, 'Un monto lleva pesos o usd.');

  const Anio = z
    .object({
      anio: z.number().int().min(1900).max(2100),
      resultado_ejercicio: Monto.optional().describe('Resultado del ejercicio según los estados contables auditados.'),
      transferencias_al_estado: Monto.optional().describe('Lo que la empresa le pasó al Estado ese año (Rentas Generales, dividendos), si consta.'),
      capitalizaciones_del_estado: Monto.optional().describe('Lo que el Estado puso en la empresa ese año, si consta.'),
      deuda_financiera: Monto.optional().describe('Deuda financiera al cierre, si consta.'),
      nota: z.string().optional(),
    })
    .strict();

  const SerieParidad = z
    .object({
      anio: z.number().int().min(1900).max(2100),
      nafta_usd_millones: z.number().optional(),
      gasoil_usd_millones: z.number().optional(),
      fuentes,
    })
    .strict();

  const Comparacion = z
    .object({
      con: z.string().min(1).describe('Con quién se compara (Petrobras, ENAP, Petropar…).'),
      indicador: z.string().min(1).describe('Qué se compara (margen de refinación, precio al público, costo por barril…).'),
      valor_propio: z.string().min(1).describe('El valor de esta empresa, con unidad.'),
      valor_par: z.string().min(1).describe('El valor del par, con unidad.'),
      periodo: z.string().min(1),
      fuentes,
    })
    .strict()
    .describe('Solo comparaciones que una fuente hace; nada calculado por el sitio.');

  return z
    .object({
      nombre: z.string().min(1).describe('Nombre corto (ANCAP).'),
      nombre_completo: z.string().min(1).optional(),
      tipo: TipoEmpresa,
      alias: z.array(z.string().min(1)).default([]),
      creacion: z
        .object({ fecha: FechaParcial, norma: z.string().min(1), fuentes })
        .strict()
        .optional()
        .describe('Cuándo y con qué norma se creó.'),
      que_hace: z.string().min(20).describe('Qué hace, en dos a cuatro oraciones neutrales respaldadas por que_hace_fuentes.'),
      que_hace_fuentes: fuentes,
      monopolio: z
        .object({
          tiene: z.boolean(),
          alcance: z.string().optional().describe('Qué actividades tiene reservadas por ley, con sus modificaciones.'),
          normas: z.array(z.object({ norma: z.string().min(1), fuentes }).strict()).default([]),
          argumentos_a_favor: z.array(Argumento).default([]),
          argumentos_en_contra: z.array(Argumento).default([]),
        })
        .strict()
        .optional(),
      finanzas: z.array(Anio).default([]).describe('Un ítem por año, con lo que conste de cada cosa.'),
      precios_vs_paridad: z
        .object({
          descripcion: z.string().min(20),
          series: z.array(SerieParidad).default([]),
        })
        .strict()
        .optional()
        .describe('Diferencia entre precio de venta y precio de paridad de importación, solo con fuente oficial o cálculo publicado con autor.'),
      comparaciones: z.array(Comparacion).default([]),
      resumen: z
        .string()
        .min(20)
        .optional()
        .describe('Para el lector, en párrafos: cómo le va a su empresa. Lo escribe el editor a partir de los datos de la ficha, sin adjetivos.'),
      fuentes: z.array(Fuente).default([]).describe('Fuentes generales que no calzan en un campo.'),
      imagenes: z.array(crearImagenSchema()).default([]).describe('Imágenes con licencia libre (la planta, un documento), con crédito.'),
      revision: Revision,
      procedencia: crearProcedenciaSchema(op),
    })
    .strict()
    .superRefine((e, ctx) => {
      if (e.monopolio?.tiene) {
        if (e.monopolio.argumentos_a_favor.length === 0 || e.monopolio.argumentos_en_contra.length === 0) {
          ctx.addIssue({
            code: 'custom',
            path: ['monopolio'],
            message:
              'Una empresa con monopolio lleva al menos un argumento a favor y uno en contra, cada uno con quién lo sostiene y su fuente: documentar un solo lado no es documentar.',
          });
        }
      }
      const anios = e.finanzas.map((f) => f.anio);
      if (new Set(anios).size !== anios.length) {
        ctx.addIssue({ code: 'custom', path: ['finanzas'], message: 'Hay años repetidos en finanzas.' });
      }
    })
    .describe('Empresa pública o ente del Estado: qué hace, cómo le va año por año, su monopolio si lo tiene, con argumentos de los dos lados.');
}

export type Empresa = z.infer<ReturnType<typeof crearEmpresaSchema>>;
