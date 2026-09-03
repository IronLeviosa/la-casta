import { z } from 'astro/zod';
import { FechaISO, Revision, crearEvidenciaSchema, crearProcedenciaSchema, type Opciones } from './base';

export const Moneda = z.enum(['UYU', 'USD', 'UI']).describe('Moneda original de la declaración: UYU (pesos), USD (dólares) o UI (unidades indexadas).');

export const TipoEventoPatrimonial = z
  .enum(['herencia', 'venta', 'compra', 'donacion', 'revaluo', 'otro'])
  .describe('Evento declarado que explica una variación: herencia, venta, compra, donacion, revaluo u otro.');

export function crearPatrimonioSchema(op: Opciones) {
  const { ref } = op;
  const Evidencia = crearEvidenciaSchema(op);

  const EventoDeclarado = z
    .object({
      tipo: TipoEventoPatrimonial,
      monto: z.number().describe('Monto en la moneda original (positivo si aumenta el patrimonio, negativo si lo reduce).'),
      descripcion: z.string().min(1).describe('Qué se declaró, en una oración (ej. venta de casa en Canelones).'),
    })
    .strict();

  return z
    .object({
      politico: ref('politicos').describe('Declarante (id de content/politicos).'),
      fecha: FechaISO.describe('Fecha de la declaración jurada (YYYY-MM-DD).'),
      cargo: z.string().min(1).describe('Cargo por el que declara (ej. Presidente de la República, candidato proclamado).'),
      activo: z.number().nonnegative().describe('Total de activos declarados, en moneda original.'),
      pasivo: z.number().nonnegative().describe('Total de pasivos declarados, en moneda original.'),
      neto: z.number().describe('Patrimonio neto declarado (activo − pasivo), en moneda original.'),
      ingresos: z.number().nonnegative().describe('Ingresos anuales declarados, en moneda original.'),
      moneda: Moneda,
      tipo_cambio_bcu: z.number().positive().describe('Cotización UYU por USD del BCU a la fecha de la declaración.'),
      ui_a_la_fecha: z.number().positive().describe('Valor de la Unidad Indexada en UYU a la fecha, según BCU.'),
      eventos_declarados: z.array(EventoDeclarado).default([]).describe('Herencias, ventas, compras, donaciones o revalúos declarados.'),
      evidencia: Evidencia.describe('PDF de la JUTEP como documento_oficial (obligatorio) más prensa si la hay.'),
      revision: Revision,
      procedencia: crearProcedenciaSchema(op),
    })
    .strict()
    .superRefine((p, ctx) => {
      if (Math.abs(p.activo - p.pasivo - p.neto) > 1) {
        ctx.addIssue({ code: 'custom', path: ['neto'], message: 'neto debe ser igual a activo − pasivo.' });
      }
      if (!p.evidencia.fuentes.some((f) => f.tipo === 'documento_oficial')) {
        ctx.addIssue({ code: 'custom', path: ['evidencia', 'fuentes'], message: 'Se requiere la declaración de la JUTEP como fuente documento_oficial.' });
      }
    })
    .describe('Declaración jurada patrimonial pública ante la JUTEP; el análisis de saltos se calcula en build, no se guarda.');
}

export type Patrimonio = z.infer<ReturnType<typeof crearPatrimonioSchema>>;
