import { z } from 'astro/zod';
import { Revision, crearFuenteSchema, crearProcedenciaSchema, type Opciones } from './base';

/**
 * Una serie oficial que el sitio necesita como denominador o como referencia (el PIB a precios
 * corrientes para decir qué porcentaje de la economía recauda cada impuesto; mañana, población
 * o inflación), cargada punto por punto desde el documento oficial que la publica.
 *
 * Existe porque un porcentaje del PIB es una afirmación con dos fuentes: el numerador y el
 * denominador. Las cifras del numerador viven en su ficha (recaudación de un impuesto, balance
 * de una empresa) y las del denominador vivían en ningún lado. Cada punto cita la fila o el
 * renglón del que sale, y `validar --red` lo coteja como cualquier otra cita; la escribe un
 * script con procedencia por script, nunca un agente a mano.
 */
export function crearSerieSchema(op: Opciones) {
  const Fuente = crearFuenteSchema(op);
  const fuentes = z.array(Fuente).min(1, 'Se requiere al menos una fuente');

  const Punto = z
    .object({
      periodo: z.string().regex(/^\d{4}(-\d{2})?$/, 'AAAA o AAAA-MM').describe('Año (AAAA) o mes (AAAA-MM) al que corresponde el valor.'),
      valor: z.number().describe('El valor tal como lo publica la fuente, en `unidad`.'),
      fuentes,
    })
    .strict();

  return z
    .object({
      nombre: z.string().min(3).describe('Qué mide (ej. «PIB a precios corrientes»).'),
      unidad: z.string().min(1).describe('Unidad de `valor` (ej. «pesos uruguayos corrientes»).'),
      organismo: z.string().min(2).describe('Quién la produce (BCU, INE, Banco Mundial a partir del BCU…).'),
      frecuencia: z.enum(['anual', 'mensual']),
      descripcion: z.string().min(20).optional().describe('Una o dos oraciones para el lector: qué es exactamente y de dónde sale.'),
      puntos: z.array(Punto).min(1),
      fuentes: z.array(Fuente).default([]),
      revision: Revision,
      procedencia: crearProcedenciaSchema(op),
    })
    .strict()
    .superRefine((s, ctx) => {
      const vistos = new Set<string>();
      s.puntos.forEach((p, i) => {
        if (vistos.has(p.periodo)) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['puntos', i], message: `Período ${p.periodo} repetido.` });
        vistos.add(p.periodo);
        if (s.frecuencia === 'anual' && p.periodo.length !== 4) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['puntos', i, 'periodo'], message: 'Una serie anual lleva períodos AAAA.' });
      });
    });
}
