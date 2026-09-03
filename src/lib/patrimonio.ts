/**
 * Análisis mecánico de las declaraciones juradas patrimoniales públicas
 * (JUTEP, ley 17.060). Se calcula en build y se publica con sus supuestos;
 * nunca se guarda como afirmación en `content/`.
 *
 * Para cada par de declaraciones consecutivas:
 *   salto      = neto_t − neto_{t−1}                       (en UI, para descontar inflación)
 *   explicable = ahorro + rendimiento + eventos declarados
 *   residuo    = salto − explicable
 *
 * Un residuo positivo no es una acusación: es "variación no explicada por lo
 * declarado", y se muestra junto a las explicaciones que dio la persona.
 *
 * Supuestos (publicados en el sitio, ver SUPUESTOS):
 *   - IRPF estimado sobre ingresos brutos: 20 %.
 *   - Tasa de ahorro sobre ingresos netos: 30 % (banda 15 %–45 %).
 *   - Rendimiento real anual del patrimonio previo: 3 % (banda 1 %–5 %).
 *   - Los ingresos anuales de la declaración anterior se asumen constantes
 *     entre ambas fechas.
 *   - Los eventos declarados en la declaración posterior (herencia, venta,
 *     compra, donación, revalúo) se suman con su signo.
 *   - Todo se convierte a UI con la cotización BCU de cada declaración; los
 *     montos en USD se pasan por el tipo de cambio BCU de esa fecha.
 */
import { aniosEntre } from './formato';

export const SUPUESTOS = {
  irpf: 0.2,
  tasaAhorro: 0.3,
  tasaAhorroMin: 0.15,
  tasaAhorroMax: 0.45,
  rendimiento: 0.03,
  rendimientoMin: 0.01,
  rendimientoMax: 0.05,
} as const;

export type Moneda = 'UYU' | 'USD' | 'UI';

export interface EventoDeclarado {
  tipo: string;
  monto: number;
  descripcion: string;
}

export interface DeclaracionPatrimonial {
  id: string;
  fecha: string;
  cargo: string;
  activo: number;
  pasivo: number;
  neto: number;
  ingresos: number;
  moneda: Moneda;
  tipo_cambio_bcu: number;
  ui_a_la_fecha: number;
  eventos_declarados: EventoDeclarado[];
}

export interface PuntoPatrimonio {
  id: string;
  fecha: string;
  cargo: string;
  netoOriginal: number;
  ingresosOriginal: number;
  moneda: Moneda;
  netoUYU: number;
  netoUSD: number;
  netoUI: number;
  ingresosUI: number;
  eventos: EventoDeclarado[];
}

export interface Salto {
  desde: PuntoPatrimonio;
  hasta: PuntoPatrimonio;
  anios: number;
  saltoUI: number;
  ahorroUI: number;
  rendimientoUI: number;
  eventosUI: number;
  explicableUI: number;
  explicableMinUI: number;
  explicableMaxUI: number;
  residuoUI: number;
  /** residuo como fracción del neto anterior (NaN si el neto anterior es 0). */
  residuoRelativo: number;
}

export interface AnalisisPatrimonio {
  puntos: PuntoPatrimonio[];
  saltos: Salto[];
  supuestos: typeof SUPUESTOS;
}

export function aUYU(monto: number, moneda: Moneda, d: { tipo_cambio_bcu: number; ui_a_la_fecha: number }): number {
  switch (moneda) {
    case 'UYU':
      return monto;
    case 'USD':
      return monto * d.tipo_cambio_bcu;
    case 'UI':
      return monto * d.ui_a_la_fecha;
  }
}

export function puntoDe(d: DeclaracionPatrimonial): PuntoPatrimonio {
  const netoUYU = aUYU(d.neto, d.moneda, d);
  const ingresosUYU = aUYU(d.ingresos, d.moneda, d);
  return {
    id: d.id,
    fecha: d.fecha,
    cargo: d.cargo,
    netoOriginal: d.neto,
    ingresosOriginal: d.ingresos,
    moneda: d.moneda,
    netoUYU,
    netoUSD: netoUYU / d.tipo_cambio_bcu,
    netoUI: netoUYU / d.ui_a_la_fecha,
    ingresosUI: ingresosUYU / d.ui_a_la_fecha,
    eventos: d.eventos_declarados,
  };
}

function explicable(prev: PuntoPatrimonio, _sig: PuntoPatrimonio, anios: number, tasaAhorro: number, rendimiento: number, eventosUI: number) {
  const ahorro = prev.ingresosUI * (1 - SUPUESTOS.irpf) * tasaAhorro * anios;
  const rend = prev.netoUI * ((1 + rendimiento) ** anios - 1);
  return { ahorro, rend, total: ahorro + rend + eventosUI };
}

export function analizarPatrimonio(declaraciones: DeclaracionPatrimonial[]): AnalisisPatrimonio {
  const ordenadas = [...declaraciones].sort((a, b) => a.fecha.localeCompare(b.fecha));
  const puntos = ordenadas.map(puntoDe);
  const saltos: Salto[] = [];
  for (let i = 1; i < puntos.length; i++) {
    const prev = puntos[i - 1]!;
    const sig = puntos[i]!;
    const d = ordenadas[i]!;
    const anios = Math.max(aniosEntre(prev.fecha, sig.fecha), 0);
    const eventosUI = d.eventos_declarados.reduce((acc, e) => acc + aUYU(e.monto, d.moneda, d) / d.ui_a_la_fecha, 0);
    const central = explicable(prev, sig, anios, SUPUESTOS.tasaAhorro, SUPUESTOS.rendimiento, eventosUI);
    const min = explicable(prev, sig, anios, SUPUESTOS.tasaAhorroMin, SUPUESTOS.rendimientoMin, eventosUI);
    const max = explicable(prev, sig, anios, SUPUESTOS.tasaAhorroMax, SUPUESTOS.rendimientoMax, eventosUI);
    const saltoUI = sig.netoUI - prev.netoUI;
    saltos.push({
      desde: prev,
      hasta: sig,
      anios,
      saltoUI,
      ahorroUI: central.ahorro,
      rendimientoUI: central.rend,
      eventosUI,
      explicableUI: central.total,
      explicableMinUI: min.total,
      explicableMaxUI: max.total,
      residuoUI: saltoUI - central.total,
      residuoRelativo: prev.netoUI !== 0 ? (saltoUI - central.total) / Math.abs(prev.netoUI) : Number.NaN,
    });
  }
  return { puntos, saltos, supuestos: SUPUESTOS };
}
