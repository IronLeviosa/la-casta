#!/usr/bin/env tsx
/**
 * Medición de rendimiento del catálogo (docs/plan-catalogo.md, piloto 0): cada trabajo `catalogar`
 * agrega una fila acá con segundos y tokens por nota, para poder extrapolar de un mes de un medio
 * a cinco años de seis medios (y de ahí a toda la historia) antes de decidir si el catálogo total
 * se paga. Es público (`data/catalogo/`, ver CLAUDE.md): es el rastro de qué se barrió y a qué
 * costo, no el crudo de ninguna nota.
 *
 * `pnpm catalogo:rendimiento --reconstruir [--simulacion]`: el apagón de DNS del 2026-09-16 (127.0.1.1
 * para los diarios uruguayos) dejó 8 filas contaminadas — los promedios por nota se habían calculado
 * sobre `notas` (el total de URL del tramo) en vez de sobre las que de verdad se catalogaron, porque
 * casi todas terminaron en `progreso.errores` sin bajarse. `--reconstruir` relee cada trabajo
 * `catalogar` de `hechos/` y recalcula `errores`/`notas_catalogadas` y los promedios de cada fila que
 * todavía tenga su trabajo de origen; una fila sin trabajo (archivado, borrado) queda igual y se avisa.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { listarTrabajos } from '../cola.ts';
import { log, parsearArgs } from '../lib/log.ts';
import { RUTAS_CATALOGO } from '../lib/rutas.ts';
import type { Trabajo } from './tipos.ts';

export interface FilaRendimiento {
  trabajo: string;
  medio: string | null;
  desde: string | null;
  hasta: string | null;
  /** Total de URL que tocó esta corrida del trabajo (bajadas o no): el denominador de antes del
   * 2026-09-16. Nunca se toca en una fila vieja, para no romper el rastro histórico. */
  notas: number;
  segundos_por_nota: number | null;
  tokens_entrada_por_nota: number | null;
  tokens_salida_por_nota: number | null;
  modo_lote: boolean;
  trabajadores: number;
  fecha: string;
  /** Campos nuevos (docs/plan-catalogo.md, "Rendimiento", 2026-09-16): opcionales para no romper
   * las filas viejas de `data/catalogo/rendimiento.json`, escritas antes de que existieran. */
  /** `duration_api_ms` acumulado de las llamadas de esta corrida, por nota (segundos). */
  segundos_api_por_nota?: number | null;
  /** `usage.output_tokens_details.thinking_tokens` acumulado, por nota. */
  tokens_pensamiento_por_nota?: number | null;
  tokens_cache_leidos_por_nota?: number | null;
  tokens_cache_creados_por_nota?: number | null;
  /** Valor efectivo de `MAX_THINKING_TOKENS` con el que corrieron las llamadas de esta fila. */
  pensamiento?: string;
  /** Errores de esta corrida (`progreso.errores` que aportó, no el acumulado del trabajo entero si
   * ya venía de una corrida previa). Ausente = fila de antes del 2026-09-16, nunca se corrigió. */
  errores?: number;
  /** `notas - errores`: el denominador correcto de los promedios por nota. Ausente = ídem. */
  notas_catalogadas?: number;
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

/** Escribe la lista completa de filas (crea la carpeta si hace falta). Reemplaza el archivo entero:
 * lo usan tanto `registrarRendimiento` (agrega una) como `--reconstruir` (reescribe todas). */
export function guardarRendimiento(filas: FilaRendimiento[], ruta: string = RUTAS_CATALOGO.rendimiento): void {
  mkdirSync(dirname(ruta), { recursive: true });
  writeFileSync(ruta, JSON.stringify(filas, null, 1) + '\n', 'utf8');
}

/** Agrega una fila al final de `data/catalogo/rendimiento.json` (crea la carpeta si hace falta). */
export function registrarRendimiento(fila: FilaRendimiento, ruta: string = RUTAS_CATALOGO.rendimiento): void {
  const filas = leerRendimiento(ruta);
  filas.push(fila);
  guardarRendimiento(filas, ruta);
}

/** `total / notasCatalogadas`, o `null` si no hay ninguna nota catalogada (evita un 0 que parezca
 * "instantáneo y gratis" en vez de "no se catalogó nada"). */
export function promedioPorNota(total: number, notasCatalogadas: number): number | null {
  return notasCatalogadas > 0 ? total / notasCatalogadas : null;
}

/** Cuántos errores tuvo un trabajo `catalogar` terminado: `resultado.errores` si ya lo tiene (después
 * de este cambio), o el largo de `params.progreso.errores` para los trabajos de antes. */
export function erroresDeTrabajo(trabajo: Trabajo): number {
  const resultado = trabajo.resultado as { errores?: unknown } | null | undefined;
  if (resultado && typeof resultado.errores === 'number') return resultado.errores;
  const progreso = (trabajo.params as { progreso?: { errores?: unknown[] } } | undefined)?.progreso;
  return Array.isArray(progreso?.errores) ? progreso!.errores!.length : 0;
}

/**
 * Recalcula una fila contra su trabajo de origen: `errores`/`notas_catalogadas` con el criterio
 * vigente y cada promedio por nota vuelto a su total absoluto (con el denominador viejo que ya
 * tenía guardado: `notas_catalogadas` si la fila ya se había reconstruido antes, o `notas` la
 * primera vez) y dividido de nuevo por el denominador correcto. Sin `trabajo` (no está en `hechos/`:
 * se movió, se borró) devuelve la fila sin tocar — no hay de dónde sacar el número de errores.
 */
export function reconstruirFila(fila: FilaRendimiento, trabajo: Trabajo | undefined): FilaRendimiento {
  if (!trabajo) return fila;
  const errores = erroresDeTrabajo(trabajo);
  const notasCatalogadas = Math.max(0, fila.notas - errores);
  const denominadorViejo = fila.notas_catalogadas ?? fila.notas;

  const reescalar = <T extends number | null | undefined>(valor: T): T => {
    if (valor === undefined || valor === null) return valor;
    if (denominadorViejo === 0) return valor; // no se puede deshacer una división por cero
    return promedioPorNota(valor * denominadorViejo, notasCatalogadas) as T;
  };

  return {
    ...fila,
    errores,
    notas_catalogadas: notasCatalogadas,
    segundos_por_nota: reescalar(fila.segundos_por_nota),
    tokens_entrada_por_nota: reescalar(fila.tokens_entrada_por_nota),
    tokens_salida_por_nota: reescalar(fila.tokens_salida_por_nota),
    segundos_api_por_nota: reescalar(fila.segundos_api_por_nota),
    tokens_pensamiento_por_nota: reescalar(fila.tokens_pensamiento_por_nota),
    tokens_cache_leidos_por_nota: reescalar(fila.tokens_cache_leidos_por_nota),
    tokens_cache_creados_por_nota: reescalar(fila.tokens_cache_creados_por_nota),
  };
}

export interface ResultadoReconstruccion {
  filas: FilaRendimiento[];
  /** Ids de trabajo cuya fila se pudo recalcular (tenían su YAML en `hechos/`). */
  actualizadas: string[];
  /** Ids de trabajo (de `fila.trabajo`) que no aparecen en `hechos/`: la fila queda como estaba. */
  sinTrabajo: string[];
}

/** `reconstruirFila` sobre todas las filas, con los trabajos ya leídos de la cola (inyectados para
 * no tocar disco en los tests: ver `pnpm cola:ver` / `listarTrabajos('hecho')`). */
export function reconstruirTodas(filas: FilaRendimiento[], trabajos: Trabajo[]): ResultadoReconstruccion {
  const porId = new Map(trabajos.map((t) => [t.id, t]));
  const salida: FilaRendimiento[] = [];
  const actualizadas: string[] = [];
  const sinTrabajo: string[] = [];
  for (const fila of filas) {
    const trabajo = porId.get(fila.trabajo);
    if (!trabajo) {
      sinTrabajo.push(fila.trabajo);
      salida.push(fila);
      continue;
    }
    salida.push(reconstruirFila(fila, trabajo));
    actualizadas.push(fila.trabajo);
  }
  return { filas: salida, actualizadas, sinTrabajo };
}

const USO = 'Uso: pnpm catalogo:rendimiento --reconstruir [--simulacion]\n';

async function main(): Promise<void> {
  const { opciones } = parsearArgs(process.argv.slice(2));
  if (!opciones.reconstruir) {
    process.stderr.write(USO);
    process.exit(2);
  }
  const trabajos = listarTrabajos('hecho').filter((t) => t.tipo === 'catalogar');
  const filas = leerRendimiento();
  const r = reconstruirTodas(filas, trabajos);

  log.info(`${filas.length} fila(s) en total, ${r.actualizadas.length} con su trabajo en hechos/ (recalculadas)`);
  if (r.sinTrabajo.length) {
    log.aviso(`${r.sinTrabajo.length} fila(s) sin su trabajo en hechos/ (no se pudieron reconstruir, quedan igual): ${[...new Set(r.sinTrabajo)].join(', ')}`);
  }

  if (opciones.simulacion) {
    log.info('--simulacion: no se escribe nada');
    return;
  }
  guardarRendimiento(r.filas);
  log.ok(`data/catalogo/rendimiento.json reescrito (${r.filas.length} fila(s), ${r.actualizadas.length} recalculada(s))`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    log.error((e as Error).message);
    process.exit(1);
  });
}
