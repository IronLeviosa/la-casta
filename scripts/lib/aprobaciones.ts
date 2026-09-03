/**
 * Aprobaciones humanas: hash canónico de un registro y lectura de
 * data/aprobaciones.json. Lo comparten `pnpm aprobar` (escribe) y el
 * validador (lee). Ningún agente escribe este archivo.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { stringify as stringifyYaml } from 'yaml';
import { sha256 } from './hash.ts';

export interface Aprobacion {
  /** Id del registro (ruta relativa a la colección, sin extensión). */
  id: string;
  coleccion: string;
  /** SHA-256 de la forma canónica del registro. */
  hash: string;
  por: string;
  fecha: string;
}

/** Copia profunda con claves ordenadas (arrays conservan orden). */
export function ordenarClaves<T>(v: T): T {
  if (Array.isArray(v)) return v.map(ordenarClaves) as unknown as T;
  if (v && typeof v === 'object' && !(v instanceof Date)) {
    const salida: Record<string, unknown> = {};
    for (const k of Object.keys(v as object).sort()) salida[k] = ordenarClaves((v as Record<string, unknown>)[k]);
    return salida as T;
  }
  return v;
}

/**
 * Forma canónica de un registro para aprobar: claves ordenadas, sin
 * `revision.notas_internas` (las notas del editor no cambian lo publicado).
 */
export function yamlCanonico(crudo: Record<string, unknown>): string {
  const copia = ordenarClaves(structuredClone(crudo)) as Record<string, any>;
  if (copia.revision && typeof copia.revision === 'object') {
    delete copia.revision.notas_internas;
  }
  return stringifyYaml(copia, { sortMapEntries: true, lineWidth: 0 });
}

export function hashCanonico(crudo: Record<string, unknown>): string {
  return sha256(yamlCanonico(crudo));
}

export function leerAprobaciones(ruta: string): Aprobacion[] {
  if (!existsSync(ruta)) return [];
  const texto = readFileSync(ruta, 'utf8').trim();
  if (!texto) return [];
  const datos = JSON.parse(texto);
  if (!Array.isArray(datos)) throw new Error(`${ruta} debe contener una lista JSON.`);
  return datos as Aprobacion[];
}

export function escribirAprobaciones(ruta: string, aprobaciones: Aprobacion[]): void {
  writeFileSync(ruta, JSON.stringify(aprobaciones, null, 2) + '\n', 'utf8');
}

/** Última aprobación registrada para un registro, o undefined. */
export function ultimaAprobacion(aprobaciones: Aprobacion[], coleccion: string, id: string): Aprobacion | undefined {
  const propias = aprobaciones.filter((a) => a.coleccion === coleccion && a.id === id);
  return propias.length ? propias[propias.length - 1] : undefined;
}

/** Ids de aprobaciones para un hash exacto (sirve para ver si el hash actual ya fue aprobado). */
export function estaAprobado(aprobaciones: Aprobacion[], coleccion: string, id: string, hash: string): boolean {
  return aprobaciones.some((a) => a.coleccion === coleccion && a.id === id && a.hash === hash);
}
