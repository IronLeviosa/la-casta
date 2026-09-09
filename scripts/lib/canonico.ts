/**
 * Copia profunda con claves ordenadas (los arrays conservan el orden). La usa el ledger de fuentes
 * para escribir JSON estable entre corridas. Vivía en `aprobaciones.ts`, que se fue con la compuerta
 * humana el 2026-09-09.
 */
export function ordenarClaves<T>(v: T): T {
  if (Array.isArray(v)) return v.map(ordenarClaves) as unknown as T;
  if (v && typeof v === 'object' && !(v instanceof Date)) {
    const salida: Record<string, unknown> = {};
    for (const k of Object.keys(v as object).sort()) salida[k] = ordenarClaves((v as Record<string, unknown>)[k]);
    return salida as T;
  }
  return v;
}
