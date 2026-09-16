/**
 * Medición de rendimiento del catálogo (docs/plan-catalogo.md, piloto 0): cada trabajo `catalogar`
 * agrega una fila acá con segundos y tokens por nota, para poder extrapolar de un mes de un medio
 * a cinco años de seis medios (y de ahí a toda la historia) antes de decidir si el catálogo total
 * se paga. Es público (`data/catalogo/`, ver CLAUDE.md): es el rastro de qué se barrió y a qué
 * costo, no el crudo de ninguna nota.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { RUTAS_CATALOGO } from '../lib/rutas.ts';

export interface FilaRendimiento {
  trabajo: string;
  medio: string | null;
  desde: string | null;
  hasta: string | null;
  notas: number;
  segundos_por_nota: number;
  tokens_entrada_por_nota: number;
  tokens_salida_por_nota: number;
  modo_lote: boolean;
  trabajadores: number;
  fecha: string;
  /** Campos nuevos (docs/plan-catalogo.md, "Rendimiento", 2026-09-16): opcionales para no romper
   * las filas viejas de `data/catalogo/rendimiento.json`, escritas antes de que existieran. */
  /** `duration_api_ms` acumulado de las llamadas de esta corrida, por nota (segundos). */
  segundos_api_por_nota?: number;
  /** `usage.output_tokens_details.thinking_tokens` acumulado, por nota. */
  tokens_pensamiento_por_nota?: number;
  tokens_cache_leidos_por_nota?: number;
  tokens_cache_creados_por_nota?: number;
  /** Valor efectivo de `MAX_THINKING_TOKENS` con el que corrieron las llamadas de esta fila. */
  pensamiento?: string;
}

/** Lee las filas ya guardadas; `[]` si el archivo no existe o quedó corrupto (no es fatal). */
export function leerRendimiento(ruta: string = RUTAS_CATALOGO.rendimiento): FilaRendimiento[] {
  if (!existsSync(ruta)) return [];
  try {
    const datos = JSON.parse(readFileSync(ruta, 'utf8'));
    return Array.isArray(datos) ? (datos as FilaRendimiento[]) : [];
  } catch {
    return [];
  }
}

/** Agrega una fila al final de `data/catalogo/rendimiento.json` (crea la carpeta si hace falta). */
export function registrarRendimiento(fila: FilaRendimiento, ruta: string = RUTAS_CATALOGO.rendimiento): void {
  const filas = leerRendimiento(ruta);
  filas.push(fila);
  mkdirSync(dirname(ruta), { recursive: true });
  writeFileSync(ruta, JSON.stringify(filas, null, 1) + '\n', 'utf8');
}
