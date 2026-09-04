/**
 * Kappa de Cohen: acuerdo entre dos calificadores sobre los mismos items,
 * descontando el acuerdo que se esperaría por azar.
 *
 *   kappa = (po - pe) / (1 - pe)
 *
 * `po` es el acuerdo observado y `pe` el esperado si cada calificador repartiera
 * sus categorias al azar con las frecuencias que realmente uso. Sin ese descuento,
 * dos calificadores que ponen "publicado" al 95 % de los registros parecen coincidir
 * casi siempre aunque no esten mirando nada.
 *
 * Lectura habitual (Landis y Koch, 1977): < 0 peor que el azar, 0-0,20 leve,
 * 0,21-0,40 aceptable, 0,41-0,60 moderado, 0,61-0,80 sustancial, 0,81-1 casi total.
 *
 * Casos borde: si los dos calificadores usaron una sola categoria y es la misma,
 * `pe` vale 1 y kappa queda indefinido (0/0). Devolvemos `kappa: null` y el acuerdo
 * observado, en vez de inventar un 1 o un 0.
 */
export interface ResultadoKappa {
  /** null cuando pe = 1 (una sola categoria en ambos): kappa no esta definido. */
  kappa: number | null;
  /** Acuerdo observado, en [0,1]. */
  acuerdo: number;
  /** Acuerdo esperado por azar, en [0,1]. */
  esperado: number;
  n: number;
  /** Categorias vistas, en orden alfabetico. */
  categorias: string[];
  /** matriz[a][b] = cuantos items el calificador A puso en `a` y el B en `b`. */
  matriz: Record<string, Record<string, number>>;
  interpretacion: string;
}

export function interpretarKappa(k: number | null): string {
  if (k === null) return 'indefinido (una sola categoría en ambos)';
  if (k < 0) return 'peor que el azar';
  if (k <= 0.2) return 'leve';
  if (k <= 0.4) return 'aceptable';
  if (k <= 0.6) return 'moderado';
  if (k <= 0.8) return 'sustancial';
  return 'casi total';
}

/** `pares` son las calificaciones de un mismo item por A y por B, en el mismo orden. */
export function kappaDeCohen(pares: [string, string][]): ResultadoKappa {
  const n = pares.length;
  const categorias = [...new Set(pares.flat())].sort();
  const matriz: Record<string, Record<string, number>> = {};
  for (const a of categorias) {
    matriz[a] = {};
    for (const b of categorias) matriz[a][b] = 0;
  }
  if (n === 0) {
    return { kappa: null, acuerdo: 0, esperado: 0, n: 0, categorias, matriz, interpretacion: 'sin items en común' };
  }

  const marginalA: Record<string, number> = {};
  const marginalB: Record<string, number> = {};
  let coinciden = 0;
  for (const [a, b] of pares) {
    matriz[a][b] += 1;
    marginalA[a] = (marginalA[a] ?? 0) + 1;
    marginalB[b] = (marginalB[b] ?? 0) + 1;
    if (a === b) coinciden += 1;
  }

  const acuerdo = coinciden / n;
  let esperado = 0;
  for (const c of categorias) esperado += ((marginalA[c] ?? 0) / n) * ((marginalB[c] ?? 0) / n);

  const kappa = esperado >= 1 ? null : (acuerdo - esperado) / (1 - esperado);
  return { kappa, acuerdo, esperado, n, categorias, matriz, interpretacion: interpretarKappa(kappa) };
}
