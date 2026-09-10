/**
 * Cálculos financieros de una empresa pública, compartidos entre la ficha (tabla y gráfico
 * interactivo) y la tarjeta de resumen de arriba: un solo lugar decide qué es un dólar y qué es un
 * hueco, para que la tarjeta nunca diga un número distinto del que dice el gráfico de abajo.
 *
 * Antes esta cuenta vivía repetida dentro de `src/pages/empresas/[slug].astro`; se movió acá para
 * que la tarjeta de resumen (2.6) reuse exactamente la misma función en vez de recalcular con otro
 * criterio de conversión.
 */

export interface Monto {
  pesos?: number;
  usd?: number;
  unidad: 'unidades' | 'miles' | 'millones';
}

/** Un año de `finanzas[]`: los campos que la tarjeta de resumen puede llegar a mostrar. */
export interface AnioFinanzas {
  anio: number;
  resultado_ejercicio?: Monto;
  transferencias_al_estado?: Monto;
  capitalizaciones_del_estado?: Monto;
  deuda_financiera?: Monto;
}

export interface Punto {
  x: string;
  y: number;
}

const FACTOR: Record<Monto['unidad'], number> = { millones: 1, miles: 1e-3, unidades: 1e-6 };
export const factorUnidad = (unidad: Monto['unidad']): number => FACTOR[unidad];

const fmt = new Intl.NumberFormat('es-UY', { maximumFractionDigits: 1 });

/** USD en millones, redondeado a un decimal; `undefined` si el monto no declara `usd`. */
export function usdMillones(m?: Monto): number | undefined {
  if (m?.usd === undefined) return undefined;
  return Number((m.usd * factorUnidad(m.unidad)).toFixed(1));
}

/** «USD 39,2 M»; si el monto solo declara pesos, «$ 1.200 M»; «—» si no hay monto. */
export function montoTexto(m?: Monto): string {
  if (!m) return '—';
  const um = usdMillones(m);
  if (um !== undefined) return `USD ${fmt.format(um)} M`;
  return `$ ${fmt.format((m.pesos as number) * factorUnidad(m.unidad))} M`;
}

/**
 * Serie {año, USD millones} de un campo a lo largo de `finanzas[]`, saltando los años sin ese dato:
 * un año sin balance es un hueco en la serie, no un cero. Es la misma función que arma los puntos
 * del gráfico interactivo (`puntos()` en la página de empresa); la tarjeta de resumen la reusa para
 * que su mini serie sea exactamente la misma que la del gráfico grande.
 *
 * Genérica en `F` (en vez de fijar `AnioFinanzas`) para que la página de empresa pueda pasarle el
 * año completo del schema (con `fuentes`, `segmentos`, etc.) sin recortarlo antes: solo hace falta
 * `anio` y lo que `tomar` elija leer.
 */
export function puntosSerie<F extends { anio: number }>(finanzas: readonly F[], tomar: (f: F) => Monto | undefined): Punto[] {
  return finanzas.flatMap((f) => {
    const y = usdMillones(tomar(f));
    return y === undefined ? [] : [{ x: String(f.anio), y }];
  });
}

export type ClaveCifra = 'resultado' | 'deuda' | 'transferencias' | 'capitalizaciones';

export interface CifraTarjeta {
  clave: ClaveCifra;
  nombre: string;
  anio: number;
  /** USD millones del último año con dato, para dar contexto al valor (positivo/negativo). */
  valor: number;
  /** Ya formateado con su unidad (p. ej. «USD 39,2 M»). */
  texto: string;
  /** Ancla de la sección donde está la serie completa y la tabla. */
  ancla: string;
  /** Serie completa cargada (todos los años con dato), para la mini gráfica. */
  serie: Punto[];
}

const CAMPOS: { clave: ClaveCifra; nombre: string; tomar: (f: AnioFinanzas) => Monto | undefined }[] = [
  { clave: 'resultado', nombre: 'Resultado del ejercicio', tomar: (f) => f.resultado_ejercicio },
  { clave: 'deuda', nombre: 'Deuda financiera', tomar: (f) => f.deuda_financiera },
  { clave: 'transferencias', nombre: 'Transferido a Rentas Generales', tomar: (f) => f.transferencias_al_estado },
  { clave: 'capitalizaciones', nombre: 'El Estado puso', tomar: (f) => f.capitalizaciones_del_estado },
];

/**
 * Tres o cuatro cifras del último ejercicio cargado, cada una con su serie completa para la mini
 * gráfica: resultado del ejercicio, deuda financiera y transferencias al Estado siempre que el
 * último año tenga el dato; «El Estado puso» (capitalizaciones) solo si hubo capitalización ese
 * año en particular, porque no todos los años tienen y mostrar un cero inventaría un dato que no
 * está. No calcula nada que `puntosSerie`/`usdMillones` no calculen ya: elige qué mostrar, no
 * cuánto vale.
 */
export function cifrasTarjeta(finanzas: readonly AnioFinanzas[], ancla: string): CifraTarjeta[] {
  if (finanzas.length === 0) return [];
  const ordenadas = [...finanzas].sort((a, b) => a.anio - b.anio);
  const ultimo = ordenadas.at(-1)!;
  const cifras: CifraTarjeta[] = [];
  for (const { clave, nombre, tomar } of CAMPOS) {
    const valor = usdMillones(tomar(ultimo));
    if (valor === undefined) continue;
    cifras.push({ clave, nombre, anio: ultimo.anio, valor, texto: montoTexto(tomar(ultimo)), ancla, serie: puntosSerie(ordenadas, tomar) });
  }
  return cifras;
}
