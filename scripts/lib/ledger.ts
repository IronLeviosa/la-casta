/**
 * data/fuentes-ledger.json: estado de cada URL citada en content/.
 * Lo escribe la máquina (`pnpm validar --red`, `pnpm archivar`); no se edita a mano.
 * Formato: objeto URL → entrada, ordenado por URL, una entrada por línea.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { ordenarClaves } from './aprobaciones.ts';

export interface EntradaLedger {
  /** Código HTTP de la última verificación (0 si falló la red). */
  http: number;
  /** true si la fuente responde 2xx o tiene copia archivada. */
  ok: boolean;
  archived_url: string | null;
  /** ISO 8601 de la última verificación. */
  checked_at: string;
  /** SHA-256 del texto extraído, si se descargó el cuerpo. */
  text_sha256?: string;
  /** Detalle del último fallo (para diagnóstico). */
  error?: string;
}

export type Ledger = Record<string, EntradaLedger>;

export function leerLedger(ruta: string): Ledger {
  if (!existsSync(ruta)) return {};
  const texto = readFileSync(ruta, 'utf8').trim();
  if (!texto) return {};
  const datos = JSON.parse(texto);
  if (!datos || typeof datos !== 'object' || Array.isArray(datos)) throw new Error(`${ruta} debe contener un objeto JSON (url → entrada).`);
  return datos as Ledger;
}

/** Serializa ordenado por URL, claves de cada entrada ordenadas, una entrada por línea. */
export function serializarLedger(ledger: Ledger): string {
  const urls = Object.keys(ledger).sort();
  if (!urls.length) return '{}\n';
  const lineas = urls.map((u) => `  ${JSON.stringify(u)}: ${JSON.stringify(ordenarClaves(ledger[u]))}`);
  return `{\n${lineas.join(',\n')}\n}\n`;
}

/** Escribe el ledger. Lanza si no puede (el llamador lo convierte en fallo de infraestructura). */
export function escribirLedger(ruta: string, ledger: Ledger): void {
  mkdirSync(path.dirname(ruta), { recursive: true });
  writeFileSync(ruta, serializarLedger(ledger), 'utf8');
}
