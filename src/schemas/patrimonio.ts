import { z } from 'astro/zod';
import { FechaISO, Revision, crearEvidenciaSchema, crearProcedenciaSchema, type Opciones } from './base';

export const Moneda = z.enum(['UYU', 'USD', 'UI']).describe('Moneda original de la declaración: UYU (pesos), USD (dólares) o UI (unidades indexadas).');

export const TipoEventoPatrimonial = z
  .enum(['herencia', 'venta', 'compra', 'donacion', 'revaluo', 'otro'])
  .describe(
    'Evento declarado que explica una variación. El tipo decide, mecánicamente y por igual para todas las personas, si el evento entra a la banda explicable: `herencia`, `donacion` y `revaluo` cambian el patrimonio neto y entran con su signo; `venta` y `compra` solo cambian su composición (el dinero de una venta reemplaza un bien que ya estaba declarado) y entran con 0; `otro` no dice qué efecto tiene y entra con 0. Ver EFECTO_EVENTO en src/lib/patrimonio.ts.',
  );

export const PeriodicidadIngresos = z
  .enum(['mensual', 'anual'])
  .describe(
    'Periodicidad con la que está escrito `ingresos` en ESTE registro. El formulario de la JUTEP pide "Sueldos líquidos (deducidas las cargas legales) vigentes a la fecha de la declaración jurada" y el art. 12.2 de la ley 17.060 define la síntesis como "un resumen del promedio mensual de sus ingresos de los últimos doce meses": la cifra publicada es mensual, así que casi siempre corresponde `mensual`. El campo existe para que se pueda cargar el número literal del documento, que es el que aparece en la `cita` y el que permite verificarla; anualizar en el registro reemplazaría el dato declarado por una cuenta nuestra y rompería la verificación de la cita. La anualización la hace la biblioteca en build (× 12, sin aguinaldo) y queda publicada como supuesto.',
  );

export function crearPatrimonioSchema(op: Opciones) {
  const { ref } = op;
  const Evidencia = crearEvidenciaSchema(op);

  const InconsistenciaActivo = z
    .object({
      suma_subtotales: z
        .number()
        .nonnegative()
        .describe('Suma de los subtotales de activo escritos en el propio formulario (depósitos, efectivo, inmuebles, vehículos, semovientes, participaciones y otros bienes), leída del documento.'),
      total_escrito: z.number().nonnegative().describe('Cifra escrita en el casillero TOTAL ACTIVO del formulario. Es la que carga `activo`, porque el campo es "lo declarado".'),
      diferencia: z.number().describe('`total_escrito` − `suma_subtotales`, en la moneda del registro. Positiva si el total escrito es mayor que la suma de sus partes.'),
      nota: z
        .string()
        .min(1)
        .describe('Descripción de la aritmética, sin verbo de acción atribuido al declarante y sin conclusión sobre legalidad. Dice a qué equivale la diferencia y, cuando corresponde, cita lo que la propia JUTEP dijo públicamente sobre este patrón de llenado.'),
    })
    .strict()
    .describe(
      'Se completa, con la misma regla mecánica para todas las personas, cada vez que la suma de los subtotales de activo escritos en el formulario NO coincide con la cifra escrita en TOTAL ACTIVO. La regla es aritmética y no admite excepciones: si la diferencia es distinta de cero, el campo va, sea de dos centavos o del tamaño de un sueldo. No es un hallazgo sobre una persona: es una propiedad del documento, y en el formulario de papel de la JUTEP la propia Junta describió públicamente el caso en que la diferencia coincide con los ingresos declarados. Ver src/lib/patrimonio.ts para cómo se publica el rango entre las dos lecturas.',
    );

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
      ingresos: z
        .number()
        .nonnegative()
        .describe(
          'Ingresos declarados, en moneda original y con el número literal del formulario. La periodicidad la dice `ingresos_periodicidad`; el formulario de la JUTEP publica un ingreso mensual líquido. Se carga el número tal como está escrito porque es el que respalda la `cita` y el que hace verificable el registro.',
        ),
      ingresos_periodicidad: PeriodicidadIngresos,
      moneda: Moneda,
      tipo_cambio_bcu: z.number().positive().describe('Cotización UYU por USD del BCU a la fecha de la declaración.'),
      ui_a_la_fecha: z.number().positive().describe('Valor de la Unidad Indexada en UYU a la fecha, según BCU.'),
      eventos_declarados: z.array(EventoDeclarado).default([]).describe('Herencias, ventas, compras, donaciones o revalúos declarados.'),
      inconsistencia_activo: InconsistenciaActivo.optional(),
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
      const inc = p.inconsistencia_activo;
      if (inc) {
        if (Math.abs(inc.total_escrito - inc.suma_subtotales - inc.diferencia) > 0.005) {
          ctx.addIssue({ code: 'custom', path: ['inconsistencia_activo', 'diferencia'], message: 'diferencia debe ser igual a total_escrito − suma_subtotales.' });
        }
        if (Math.abs(inc.total_escrito - p.activo) > 0.005) {
          ctx.addIssue({ code: 'custom', path: ['inconsistencia_activo', 'total_escrito'], message: 'total_escrito debe ser el mismo número que `activo`: el registro carga siempre la cifra literal del formulario.' });
        }
        if (inc.diferencia === 0) {
          ctx.addIssue({ code: 'custom', path: ['inconsistencia_activo'], message: 'Si la diferencia es cero no hay inconsistencia: el campo se omite.' });
        }
      }
    })
    .describe('Declaración jurada patrimonial pública ante la JUTEP; el análisis de saltos se calcula en build, no se guarda.');
}

export type Patrimonio = z.infer<ReturnType<typeof crearPatrimonioSchema>>;
