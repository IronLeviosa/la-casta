/**
 * Análisis mecánico de las declaraciones juradas patrimoniales públicas
 * (JUTEP, ley 17.060). Se calcula en build y se publica con sus supuestos;
 * nunca se guarda como afirmación en `content/`.
 *
 * Para cada par de declaraciones consecutivas:
 *   salto      = neto_t − neto_{t−1}                       (en UI, para descontar inflación)
 *   explicable = ahorro + rendimiento + eventos que aportan patrimonio
 *   residuo    = salto − explicable
 *
 * Un residuo positivo no es una acusación: es "variación no explicada por lo
 * declarado", y se muestra junto a las explicaciones que dio la persona.
 *
 * ------------------------------------------------------------------------
 * MÉTRICA PRINCIPAL: la tasa de ahorro de equilibrio
 * ------------------------------------------------------------------------
 * El residuo depende de una tasa de ahorro elegida a dedo, y una tasa fija no
 * es neutral entre personas con ingresos y patrimonios iniciales distintos: el
 * mismo 30 % le concede a una persona de sueldo alto y patrimonio chico mucho
 * más ahorro *como fracción de su patrimonio* que a una de sueldo bajo y
 * patrimonio grande. Comparar residuos calculados con una tasa fija compara,
 * en parte, el supuesto.
 *
 * La tasa de ahorro de equilibrio no tiene ese problema: es la tasa que haría
 * el residuo exactamente cero, o sea la fracción del ingreso declarado que la
 * persona tendría que haber ahorrado, todos los meses del tramo, para que la
 * variación quede explicada. Se despeja de la misma ecuación:
 *
 *   salto = s* · ingresoAnualUI · años + rendimiento + eventosQueAportan
 *   s*    = (salto − rendimiento − eventosQueAportan) / (ingresoAnualUI · años)
 *
 * No depende de la tasa elegida, no depende del largo de la ventana y se
 * calcula igual para todos. Se lee directo: s* > 1 significa que ni ahorrando
 * el 100 % del ingreso declarado alcanzaría; s* < 0 significa que el residuo
 * es negativo con cualquier tasa de ahorro no negativa.
 *
 * El residuo con banda queda como métrica secundaria, y cada tramo trae
 * `signoRobusto`: falso cuando el signo del residuo cambia dentro de la banda
 * de supuestos publicada. Un tramo con `signoRobusto: false` no puede
 * presentarse como si el signo fuera un hecho.
 *
 * ------------------------------------------------------------------------
 * Supuestos (publicados en el sitio, ver SUPUESTOS)
 * ------------------------------------------------------------------------
 *   - `ingresos` se normaliza a anual según `ingresos_periodicidad`. El
 *     formulario de la JUTEP pide "Sueldos líquidos (deducidas las cargas
 *     legales) vigentes a la fecha", y el art. 12.2 de la ley 17.060 define la
 *     síntesis como "un resumen del promedio mensual de sus ingresos de los
 *     últimos doce meses": el campo es mensual. Se anualiza multiplicando por
 *     12, sin aguinaldo. No contar el aguinaldo achica la banda explicable y
 *     por lo tanto agranda el residuo: es el sentido que perjudica al cálculo,
 *     no a la persona, y queda dicho.
 *   - Ingreso del tramo: promedio de los ingresos anuales en UI de las dos
 *     declaraciones que lo delimitan (regla del trapecio sobre una serie que
 *     solo se observa en los extremos). Es simétrico y no privilegia ninguno
 *     de los dos puntos.
 *   - Tasa de ahorro sobre el ingreso líquido declarado: 30 % (banda 15 %–45 %).
 *     No se le aplica ningún descuento adicional por impuestos: la cifra del
 *     formulario ya es líquida, y descontarle IRPF otra vez sería contar el
 *     mismo impuesto dos veces.
 *   - Rendimiento real anual del patrimonio previo: 3 % (banda 1 %–5 %).
 *   - Eventos declarados: solo entran a la banda explicable los que **aportan**
 *     patrimonio (ver EFECTO_EVENTO). Los que solo **rotan** su composición
 *     entran con 0 y se muestran aparte.
 *   - Todo se convierte a UI con la cotización BCU de cada declaración; los
 *     montos en USD se pasan por el tipo de cambio BCU de esa fecha.
 */
import { aniosEntre } from './formato';

export const SUPUESTOS = {
  tasaAhorro: 0.3,
  tasaAhorroMin: 0.15,
  tasaAhorroMax: 0.45,
  rendimiento: 0.03,
  rendimientoMin: 0.01,
  rendimientoMax: 0.05,
  /** Meses por año usados para anualizar un ingreso mensual. Sin aguinaldo, a propósito. */
  mesesPorAnio: 12,
} as const;

export type Moneda = 'UYU' | 'USD' | 'UI';

/** Periodicidad con la que está escrito `ingresos` en el registro. */
export type PeriodicidadIngresos = 'mensual' | 'anual';

/**
 * Qué le hace cada tipo de evento declarado al patrimonio neto.
 *
 * `aporta` — el patrimonio neto cambia por el evento: una herencia o una
 *   donación recibida lo aumentan, una donación entregada lo reduce, un revalúo
 *   cambia el valor declarado de un bien que ya se tenía. Estos eventos entran
 *   a la banda explicable con su signo: son variación que la propia persona
 *   declaró y explicó.
 *
 * `rota` — el evento cambia la **composición** del patrimonio, no su tamaño.
 *   Vender una casa es cambiar un inmueble por dinero: el dinero que entra
 *   reemplaza un bien que ya estaba en la declaración anterior, así que el
 *   efecto sobre el neto es cero y sumar el precio de venta entero a la banda
 *   explicable fabricaría una explicación que no existe. La ganancia o pérdida
 *   respecto del valor con que el bien figuraba antes sí sería variación real,
 *   pero no se puede calcular: la parte publicada del formulario tacha padrones
 *   y matrículas, así que no hay forma de identificar qué línea de la
 *   declaración anterior corresponde al bien vendido. Esa diferencia queda
 *   dentro del residuo, y eso está dicho en los supuestos.
 *
 * `sin_clasificar` — `otro` no dice qué le hace al patrimonio. Entra con 0 y se
 *   muestra como anotación. La regla mecánica no puede darle crédito a un
 *   evento cuyo efecto nadie declaró; el arreglo es tipificarlo, no discutirlo.
 *
 * La regla es por tipo de evento y es la misma para todas las personas: nadie
 * mejora ni empeora su residuo por haber declarado, salvo en la medida en que
 * lo declarado efectivamente explique la variación.
 */
export const EFECTO_EVENTO = {
  herencia: 'aporta',
  donacion: 'aporta',
  revaluo: 'aporta',
  venta: 'rota',
  compra: 'rota',
  otro: 'sin_clasificar',
} as const;

export type EfectoEvento = 'aporta' | 'rota' | 'sin_clasificar';

export function efectoDeEvento(tipo: string): EfectoEvento {
  return (EFECTO_EVENTO as Record<string, EfectoEvento>)[tipo] ?? 'sin_clasificar';
}

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
  ingresos_periodicidad: PeriodicidadIngresos;
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
  ingresosPeriodicidad: PeriodicidadIngresos;
  moneda: Moneda;
  netoUYU: number;
  netoUSD: number;
  netoUI: number;
  /** Ingreso anualizado en UI (mensual × 12 si el registro es mensual). */
  ingresosAnualesUI: number;
  eventos: EventoDeclarado[];
}

export interface Salto {
  desde: PuntoPatrimonio;
  hasta: PuntoPatrimonio;
  anios: number;
  dias: number;
  saltoUI: number;
  /** Ingreso anual en UI usado para el tramo: promedio de los dos extremos. */
  ingresosAnualesUI: number;
  ahorroUI: number;
  rendimientoUI: number;
  /** Eventos que cambian el neto y entran a la banda explicable. */
  eventosAportanUI: number;
  /** Eventos que solo cambian la composición del patrimonio; entran con 0. */
  eventosRotanUI: number;
  /** Eventos de tipo `otro`, sin efecto declarado; entran con 0. */
  eventosSinClasificarUI: number;
  explicableUI: number;
  explicableMinUI: number;
  explicableMaxUI: number;
  residuoUI: number;
  /** Residuo con los supuestos más generosos con la persona (ahorro y rendimiento máximos). */
  residuoBandaMinUI: number;
  /** Residuo con los supuestos menos generosos (ahorro y rendimiento mínimos). */
  residuoBandaMaxUI: number;
  /** residuo como fracción del neto anterior (NaN si el neto anterior es 0). */
  residuoRelativo: number;
  /**
   * Tasa de ahorro que haría el residuo exactamente cero, con el rendimiento
   * central. NaN cuando no hay ingreso declarado o el tramo no tiene duración.
   */
  tasaAhorroEquilibrio: number;
  /**
   * `false` cuando el signo del residuo cambia dentro de la banda de supuestos
   * publicada: el tramo no puede presentarse como si el signo fuera un hecho.
   */
  signoRobusto: boolean;
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

/** Ingreso declarado llevado a base anual según la periodicidad del registro. */
export function ingresosAnuales(ingresos: number, periodicidad: PeriodicidadIngresos): number {
  return periodicidad === 'mensual' ? ingresos * SUPUESTOS.mesesPorAnio : ingresos;
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
    ingresosPeriodicidad: d.ingresos_periodicidad,
    moneda: d.moneda,
    netoUYU,
    netoUSD: netoUYU / d.tipo_cambio_bcu,
    netoUI: netoUYU / d.ui_a_la_fecha,
    ingresosAnualesUI: ingresosAnuales(ingresosUYU / d.ui_a_la_fecha, d.ingresos_periodicidad),
    eventos: d.eventos_declarados,
  };
}

/** Suma en UI de los eventos de una declaración, separados por su efecto sobre el neto. */
export function eventosPorEfecto(d: DeclaracionPatrimonial): Record<EfectoEvento, number> {
  const total: Record<EfectoEvento, number> = { aporta: 0, rota: 0, sin_clasificar: 0 };
  for (const e of d.eventos_declarados) {
    total[efectoDeEvento(e.tipo)] += aUYU(e.monto, d.moneda, d) / d.ui_a_la_fecha;
  }
  return total;
}

export interface ParametrosTramo {
  netoPrevioUI: number;
  ingresosAnualesUI: number;
  anios: number;
  eventosAportanUI: number;
}

function explicable(p: ParametrosTramo, tasaAhorro: number, rendimiento: number) {
  const ahorro = p.ingresosAnualesUI * tasaAhorro * p.anios;
  const rend = p.netoPrevioUI * ((1 + rendimiento) ** p.anios - 1);
  return { ahorro, rend, total: ahorro + rend + p.eventosAportanUI };
}

/**
 * Tasa de ahorro que anula el residuo, con el rendimiento central.
 * NaN si no hay ingreso declarado o el tramo no tiene duración: sin denominador
 * la pregunta "qué fracción del ingreso" no tiene respuesta, y se muestra "—".
 */
export function tasaAhorroDeEquilibrio(saltoUI: number, p: ParametrosTramo, rendimiento: number = SUPUESTOS.rendimiento): number {
  const base = p.ingresosAnualesUI * p.anios;
  if (!Number.isFinite(base) || base <= 0) return Number.NaN;
  const rend = p.netoPrevioUI * ((1 + rendimiento) ** p.anios - 1);
  return (saltoUI - rend - p.eventosAportanUI) / base;
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
    const dias = Math.round(anios * 365.25);
    const eventos = eventosPorEfecto(d);
    // Promedio de los dos extremos: la serie de ingresos solo se observa en las
    // dos fechas de declaración, y el promedio no privilegia ninguna de las dos.
    const ingresosAnualesUI = (prev.ingresosAnualesUI + sig.ingresosAnualesUI) / 2;
    const p: ParametrosTramo = {
      netoPrevioUI: prev.netoUI,
      ingresosAnualesUI,
      anios,
      eventosAportanUI: eventos.aporta,
    };
    const central = explicable(p, SUPUESTOS.tasaAhorro, SUPUESTOS.rendimiento);
    const min = explicable(p, SUPUESTOS.tasaAhorroMin, SUPUESTOS.rendimientoMin);
    const max = explicable(p, SUPUESTOS.tasaAhorroMax, SUPUESTOS.rendimientoMax);
    const saltoUI = sig.netoUI - prev.netoUI;
    const residuoUI = saltoUI - central.total;
    // El explicable crece con la tasa de ahorro y con el rendimiento, así que
    // el residuo es máximo en la esquina (mín, mín) y mínimo en la (máx, máx).
    const residuoBandaMaxUI = saltoUI - min.total;
    const residuoBandaMinUI = saltoUI - max.total;
    saltos.push({
      desde: prev,
      hasta: sig,
      anios,
      dias,
      saltoUI,
      ingresosAnualesUI,
      ahorroUI: central.ahorro,
      rendimientoUI: central.rend,
      eventosAportanUI: eventos.aporta,
      eventosRotanUI: eventos.rota,
      eventosSinClasificarUI: eventos.sin_clasificar,
      explicableUI: central.total,
      explicableMinUI: min.total,
      explicableMaxUI: max.total,
      residuoUI,
      residuoBandaMinUI,
      residuoBandaMaxUI,
      residuoRelativo: prev.netoUI !== 0 ? residuoUI / Math.abs(prev.netoUI) : Number.NaN,
      tasaAhorroEquilibrio: tasaAhorroDeEquilibrio(saltoUI, p),
      signoRobusto: Math.sign(residuoBandaMinUI) === Math.sign(residuoBandaMaxUI) && residuoBandaMinUI !== 0,
    });
  }
  return { puntos, saltos, supuestos: SUPUESTOS };
}
