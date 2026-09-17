#!/usr/bin/env tsx
/**
 * `pnpm catalogo:reintentar [--trabajo <id>]... [--todos] [--tamano 190] [--simulacion]`
 *
 * Defecto real, 2026-09-16 desde las 00:12 UTC: el DNS de la red devolvió 127.0.1.1 para los
 * diarios uruguayos y 1.291 notas de 8 trabajos `catalogar` terminaron con `fetch failed`. Quedaron
 * en `progreso.errores[] {url, motivo}` del trabajo ya movido a `hechos/`, con el cursor avanzado
 * igual (`docs/plan-catalogo.md`, "Rendimiento"). Este comando no reintenta esos trabajos en el
 * lugar: arma trabajos `catalogar` nuevos, en `pendientes/`, solo con las URL que de verdad valen
 * la pena reintentar.
 *
 * 1. Junta `progreso.errores` de los trabajos `catalogar` de `hechos/` que se le pidan (por id
 *    completo o por el sufijo hex de 8 caracteres que ya trae cada id, `<timestamp>-<hex>`) o de
 *    todos con `--todos`.
 * 2. Separa los que son de red (`esMotivoDeRed` de `catalogar.ts`: fetch failed, ECONNREFUSED,
 *    ENOTFOUND, ETIMEDOUT, EAI_AGAIN, socket hang up, HTTP 5xx/429 — todos transitorios, ya
 *    sobrevivieron los reintentos con backoff de `fetchConTimeout`) de los que no (armazón JS, 404,
 *    documento sin texto: la misma URL da el mismo resultado mañana, reintentarla es tirar tokens).
 * 3. Deduplica por URL canónica y saca las que el corpus ya tiene catalogadas con la versión
 *    vigente del etiquetador (`necesitaCatalogar`, el mismo criterio que ya usa `catalogar.ts` para
 *    `omitidas_ya_catalogadas`): puede pasar que la URL se haya bajado bien en un trabajo distinto
 *    mientras este fallaba.
 * 4. Arma trabajos `catalogar` nuevos con los mismos `params` (`medio`, `desde`, `hasta`) del
 *    trabajo de origen, en lotes de `--tamano` URL (190 por defecto), `creado_por: catalogo:reintentar`
 *    y `params.reintento_de` con los ids de origen — mismas funciones de cola que usa
 *    `catalogo-descubrir.ts` (`agregarTrabajo`), no un YAML armado a mano.
 *
 * `--simulacion` no escribe nada: solo imprime cuántas URL hay por motivo, cuántas ya estaban
 * catalogadas y cuántos trabajos se crearían. No se corre sin `--simulacion` mientras la red de
 * verdad esté caída: encolar de más solo hace que un worker los tome y vuelva a fallar igual.
 */
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { agregarTrabajo, guardarTrabajo, listarTrabajos } from '../cola.ts';
import { idDeUrl } from '../lib/hash.ts';
import { log, parsearArgs } from '../lib/log.ts';
import { esMotivoDeRed, motivoCorto, type ParamsCatalogar, type ProgresoCatalogar } from './catalogar.ts';
import { leerNota, necesitaCatalogar } from './etiquetar.ts';
import type { Nota, Trabajo } from './tipos.ts';

export const TAMANO_LOTE_REINTENTO_POR_DEFECTO = 190;

/**
 * true si `id` (el id completo que asigna `agregarTrabajo`, `<timestamp>-<hex8>`) es el trabajo que
 * pide `buscado`: completo, o solo el sufijo hex de 8 caracteres después del último guion (lo que
 * trae el enunciado de este comando: "7f4843e8, a4521760, …").
 */
export function coincideConId(id: string, buscado: string): boolean {
  return id === buscado || id.endsWith(`-${buscado}`);
}

/** Separa los ids pedidos en los trabajos `catalogar` de `hechos/` que coinciden y los que no se
 * encontraron (para avisar de cada uno, no para abortar el comando entero). */
export function seleccionarTrabajos(trabajos: Trabajo[], idsPedidos: string[]): { encontrados: Trabajo[]; noEncontrados: string[] } {
  const encontrados: Trabajo[] = [];
  const noEncontrados: string[] = [];
  for (const id of idsPedidos) {
    const t = trabajos.find((tr) => coincideConId(tr.id, id));
    if (t) encontrados.push(t);
    else noEncontrados.push(id);
  }
  return { encontrados, noEncontrados };
}

export interface ErrorConOrigen {
  url: string;
  motivo: string;
  /** Id del trabajo `catalogar` en cuyo `progreso.errores` apareció. */
  origen: string;
}

/** Todos los `progreso.errores` de una lista de trabajos `catalogar`, con el id del trabajo de origen. */
export function erroresDeTrabajos(trabajos: Trabajo[]): ErrorConOrigen[] {
  const salida: ErrorConOrigen[] = [];
  for (const t of trabajos) {
    const progreso = (t.params as ParamsCatalogar | undefined)?.progreso as ProgresoCatalogar | undefined;
    for (const e of progreso?.errores ?? []) salida.push({ url: e.url, motivo: e.motivo, origen: t.id });
  }
  return salida;
}

/** Cuenta una lista de errores por `motivoCorto` (misma clasificación que `errores_por_motivo` de
 * `catalogar.ts`), para el resumen que imprime este comando. */
export function contarPorMotivo(errores: { motivo: string }[]): Record<string, number> {
  const salida: Record<string, number> = {};
  for (const e of errores) {
    const clave = motivoCorto(e.motivo);
    salida[clave] = (salida[clave] ?? 0) + 1;
  }
  return salida;
}

/**
 * Separa `urls` en las que el corpus ya tiene catalogadas con la versión vigente del etiquetador
 * (mismo criterio que decide `omitidas_ya_catalogadas` en `catalogar.ts`) y las que de verdad hace
 * falta reencolar. `leerNotaFn` inyectable (por defecto `leerNota` de `etiquetar.ts`) para no tocar
 * disco en los tests.
 */
export function filtrarYaCatalogadas(urls: string[], leerNotaFn: (id: string) => Pick<Nota, 'catalogo'> | null = leerNota): { pendientes: string[]; yaCatalogadas: string[] } {
  const pendientes: string[] = [];
  const yaCatalogadas: string[] = [];
  for (const url of urls) {
    const nota = leerNotaFn(idDeUrl(url));
    if (nota && !necesitaCatalogar(nota)) yaCatalogadas.push(url);
    else pendientes.push(url);
  }
  return { pendientes, yaCatalogadas };
}

/** Reparte `lista` en tramos contiguos de a lo sumo `tamano` elementos (a diferencia de `repartir()`
 * de `catalogo-descubrir.ts`, que reparte parejo en N partes: acá el tamaño de cada trabajo nuevo
 * es el dato fijo, y la cantidad de trabajos sale de dividir). */
export function enLotesDe<T>(lista: T[], tamano: number): T[][] {
  const n = Math.max(1, Math.trunc(tamano) || TAMANO_LOTE_REINTENTO_POR_DEFECTO);
  const lotes: T[][] = [];
  for (let i = 0; i < lista.length; i += n) lotes.push(lista.slice(i, i + n));
  return lotes;
}

interface ParamsOrigen {
  medio?: string;
  desde?: string;
  hasta?: string;
}

function paramsOrigenDe(t: Trabajo): ParamsOrigen {
  const p = t.params as ParamsCatalogar;
  return { medio: p.medio, desde: p.desde, hasta: p.hasta };
}

export interface GrupoDeReintento {
  params: ParamsOrigen;
  urls: string[];
  /** Ids de los trabajos de origen que aportaron alguna URL de este grupo (`params.reintento_de`). */
  origenes: string[];
}

export interface PlanDeReintento {
  /** Todos los errores de los trabajos seleccionados, agrupados por motivo corto (de red y no). */
  porMotivo: Record<string, number>;
  /** URL de red únicas (deduplicadas por URL canónica), antes de sacar las ya catalogadas. */
  urlsDeRed: number;
  yaCatalogadas: number;
  /** Las que de verdad se van a reencolar, ya agrupadas por (medio, desde, hasta) de origen. */
  grupos: GrupoDeReintento[];
}

/**
 * Arma el plan completo (pasos 1 a 4 del comentario de arriba) sin tocar la cola: pura salvo por
 * `leerNotaFn`, que por defecto sí lee el corpus real (`leerNota`) pero se puede inyectar en los
 * tests. Cuando una URL de red aparece en más de un trabajo de origen (raro: la misma URL falló en
 * dos corridas distintas), el grupo se arma con los `params` del primer origen y junta todos los
 * ids en `origenes` — los `medio`/`desde`/`hasta` de un mismo barrido no deberían diferir entre sí.
 */
export function planificarReintento(trabajos: Trabajo[], opciones: { leerNotaFn?: (id: string) => Pick<Nota, 'catalogo'> | null } = {}): PlanDeReintento {
  const errores = erroresDeTrabajos(trabajos);
  const porMotivo = contarPorMotivo(errores);
  const deRed = errores.filter((e) => esMotivoDeRed(e.motivo));

  const porUrlCanonica = new Map<string, { url: string; origenes: Set<string> }>();
  for (const e of deRed) {
    const id = idDeUrl(e.url);
    let x = porUrlCanonica.get(id);
    if (!x) {
      x = { url: e.url, origenes: new Set() };
      porUrlCanonica.set(id, x);
    }
    x.origenes.add(e.origen);
  }
  const urlsUnicas = [...porUrlCanonica.values()].map((x) => x.url);
  const { pendientes, yaCatalogadas } = filtrarYaCatalogadas(urlsUnicas, opciones.leerNotaFn);

  const trabajosPorId = new Map(trabajos.map((t) => [t.id, t]));
  const grupos = new Map<string, GrupoDeReintento>();
  for (const url of pendientes) {
    const info = porUrlCanonica.get(idDeUrl(url))!;
    const primerOrigen = [...info.origenes][0];
    const trabajoOrigen = trabajosPorId.get(primerOrigen);
    const params = trabajoOrigen ? paramsOrigenDe(trabajoOrigen) : {};
    const clave = JSON.stringify(params);
    let g = grupos.get(clave);
    if (!g) {
      g = { params, urls: [], origenes: [] };
      grupos.set(clave, g);
    }
    g.urls.push(url);
    for (const o of info.origenes) if (!g.origenes.includes(o)) g.origenes.push(o);
  }

  return { porMotivo, urlsDeRed: urlsUnicas.length, yaCatalogadas: yaCatalogadas.length, grupos: [...grupos.values()] };
}

/** Cuántas URL para reencolar tiene un plan (suma de todos los grupos), y cuántos trabajos nuevos
 * saldrían con un tamaño de lote dado — lo que imprime `--simulacion`. */
export function pendientesDe(plan: PlanDeReintento): number {
  return plan.grupos.reduce((acc, g) => acc + g.urls.length, 0);
}

export function trabajosACrearDe(plan: PlanDeReintento, tamano: number): number {
  return plan.grupos.reduce((acc, g) => acc + enLotesDe(g.urls, tamano).length, 0);
}

/** Extrae los valores de `--trabajo` (repetible) de `argv` directamente: `parsearArgs` guarda un
 * único valor por clave, así que una opción que se repite necesita su propio parseo. */
export function extraerTrabajoIds(argv: string[]): string[] {
  const ids: string[] = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--trabajo') {
      const v = argv[i + 1];
      if (v !== undefined && !v.startsWith('--')) {
        ids.push(v);
        i++;
      }
    } else if (a.startsWith('--trabajo=')) {
      ids.push(a.slice('--trabajo='.length));
    }
  }
  return ids;
}

const USO = 'Uso: pnpm catalogo:reintentar [--trabajo <id>]... [--todos] [--tamano 190] [--simulacion]\n';

export async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const idsPedidos = extraerTrabajoIds(argv);
  const { opciones } = parsearArgs(argv);
  if (!opciones.todos && !idsPedidos.length) {
    process.stderr.write(USO);
    process.exit(2);
  }
  const tamano = opciones.tamano ? Number(opciones.tamano) : TAMANO_LOTE_REINTENTO_POR_DEFECTO;
  const simulacion = opciones.simulacion === true;

  const hechos = listarTrabajos('hecho').filter((t) => t.tipo === 'catalogar');
  let seleccionados: Trabajo[];
  if (opciones.todos) {
    seleccionados = hechos;
    if (idsPedidos.length) log.aviso('--todos ignora los --trabajo sueltos: se usan todos los catalogar de hechos/');
  } else {
    const { encontrados, noEncontrados } = seleccionarTrabajos(hechos, idsPedidos);
    for (const id of noEncontrados) log.aviso(`no encontré un trabajo catalogar terminado con id o sufijo "${id}" en hechos/`);
    seleccionados = encontrados;
  }
  if (!seleccionados.length) {
    log.error('ningún trabajo catalogar para reintentar');
    process.exit(1);
  }
  log.info(`${seleccionados.length} trabajo(s) catalogar seleccionado(s): ${seleccionados.map((t) => t.id).join(', ')}`);

  const plan = planificarReintento(seleccionados);

  for (const [motivo, n] of Object.entries(plan.porMotivo).sort(([, a], [, b]) => b - a)) log.info(`  ${motivo}: ${n}`);
  const pendientes = pendientesDe(plan);
  log.ok(`${plan.urlsDeRed} URL de red única(s) (reintentables) · ${plan.yaCatalogadas} ya catalogada(s) · ${pendientes} para reencolar`);

  if (simulacion) {
    log.info(`--simulacion: no se escribe nada (se crearían ${trabajosACrearDe(plan, tamano)} trabajo(s) de hasta ${tamano} URL)`);
    return;
  }

  let creados = 0;
  for (const g of plan.grupos) {
    for (const chunk of enLotesDe(g.urls, tamano)) {
      const params: Record<string, unknown> = { urls: chunk, reintento_de: g.origenes };
      if (g.params.medio !== undefined) params.medio = g.params.medio;
      if (g.params.desde !== undefined) params.desde = g.params.desde;
      if (g.params.hasta !== undefined) params.hasta = g.params.hasta;
      const t = agregarTrabajo('catalogar', params);
      t.creado_por = 'catalogo:reintentar';
      guardarTrabajo(t);
      creados++;
      log.ok(`trabajo ${t.id} (catalogar) encolado con ${chunk.length} URL, reintento de ${g.origenes.join(', ')}`);
    }
  }
  log.ok(`${creados} trabajo(s) nuevo(s) encolado(s)`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    log.error((e as Error).message);
    process.exit(1);
  });
}
