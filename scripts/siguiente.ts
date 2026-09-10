/**
 * `pnpm siguiente`: convierte la Regla 0/12 (barrido simétrico) en cola de trabajo.
 *
 * Ítem 2.3 de la fase 2 de `docs/plan-2026-09.md`: propone las próximas corridas de
 * investigación como los pares persona-tema que más reducen la asimetría de cobertura
 * (307 fichas, 7 con registros; Barandiarán 132 contra Mujica 3).
 *
 * El ranking, en este orden y sin excepción:
 *  1. Un tema ya investigado (con o sin hallazgos) para alguna persona se completa para
 *     todas las personas con mandato solapado con el período de ese tema, antes de abrir
 *     un tema nuevo. El "período del tema" y el "mandato solapado" son el mismo cálculo
 *     que hace `calcularResumen` en `src/lib/cobertura.ts` y que queda escrito en
 *     `data/simetria.json` (campo `temas`): si el tema no tiene ningún registro todavía,
 *     su período es desconocido y entonces cualquier persona con algún mandato cuenta como
 *     solapada (mismo `fallback` que usa `calcularResumen`).
 *  2. Entre personas: cargo (presidentes y vicepresidentes primero, después senadores,
 *     después diputados titulares, después suplentes) y dentro del cargo, alfabético por
 *     slug. Nunca por partido ni por cantidad de registros.
 *  3. Entre temas: primero el que más personas tiene investigadas (el más avanzado); a
 *     igualdad, alfabético. Como un tema sin nadie investigado tiene cero, esto ya deja los
 *     temas nunca abiertos al final, sin necesidad de una regla aparte para la 1.
 *  4. Una combinación ya investigada (con o sin hallazgos, es decir con una corrida en
 *     `data/corridas/`) no se propone. Esto es lo que separa "sin cobertura" (`sin_cubrir`
 *     de `data/simetria.json`, que solo mira si hay registros) de "sin investigar": una
 *     persona investigada sin hallazgos sigue apareciendo en `sin_cubrir` pero no se
 *     vuelve a proponer.
 *
 * "Investigada" se calcula con `calcularCobertura` (corridas en `data/corridas/`, las mismas
 * que arma `/cobertura/`); el "período del tema" se lee de `data/simetria.json` (si no
 * existe, avisa y usa el fallback sin período para todos los temas).
 */
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  alcanza,
  calcularCobertura,
  listarCorridas,
  raizRepo,
  seSuperponen,
  type Corrida,
  type EntradaCobertura,
  type EstadoTema,
  type MandatoMinimo,
  type TemaMinimo,
} from '../src/lib/cobertura.ts';
import { ES_DIPUTADO, ES_PRESIDENTE, ES_SENADOR, ES_VICEPRESIDENTE } from '../src/lib/roles.ts';
import { cargarContenido } from './lib/contenido.ts';
import { entradaDesdeContenido } from './validadores/simetria.ts';
import { log, parsearArgs } from './lib/log.ts';

// ---------------------------------------------------------------------------
// Cargo: la única variable de orden entre personas (regla 2). Nunca partido.
// ---------------------------------------------------------------------------

const RE_SUPLENTE = /\(suplente/i;

export type CargoBase = 'presidente' | 'senador' | 'diputado' | 'otro';
export type EtiquetaCargo = 'presidente' | 'vicepresidente' | 'senador' | 'diputado' | 'suplente' | 'otro';

export interface InfoCargo {
  /** 0 = presidente/vicepresidente, 1 = senador titular, 2 = diputado titular, 3 = suplente, 4 = ningún cargo reconocido. */
  tier: 0 | 1 | 2 | 3 | 4;
  etiqueta: EtiquetaCargo;
  base: CargoBase;
}

const SIN_CARGO_RECONOCIDO: InfoCargo = { tier: 4, etiqueta: 'otro', base: 'otro' };

/**
 * El cargo de mayor jerarquía institucional entre todos los mandatos de una persona
 * (una persona que fue diputada y después senadora ordena por senadora). No mira el
 * partido, la fecha ni cuántos mandatos tuvo: eso violaría la regla 2.
 */
export function cargoDePersona(mandatos: MandatoMinimo[]): InfoCargo {
  let mejor = SIN_CARGO_RECONOCIDO;
  for (const m of mandatos) {
    const cargo = m.cargo ?? '';
    const suplente = RE_SUPLENTE.test(cargo);
    let info: InfoCargo | undefined;
    if (ES_PRESIDENTE.test(cargo)) info = { tier: 0, etiqueta: 'presidente', base: 'presidente' };
    else if (ES_VICEPRESIDENTE.test(cargo)) info = { tier: 0, etiqueta: 'vicepresidente', base: 'presidente' };
    else if (ES_SENADOR.test(cargo)) info = suplente ? { tier: 3, etiqueta: 'suplente', base: 'senador' } : { tier: 1, etiqueta: 'senador', base: 'senador' };
    else if (ES_DIPUTADO.test(cargo)) info = suplente ? { tier: 3, etiqueta: 'suplente', base: 'diputado' } : { tier: 2, etiqueta: 'diputado', base: 'diputado' };
    if (info && info.tier < mejor.tier) mejor = info;
  }
  return mejor;
}

// ---------------------------------------------------------------------------
// Mandato solapado con el período de un tema (regla 1): mismo criterio que
// `calcularResumen` en src/lib/cobertura.ts (`seSuperponen`, y sin período
// conocido, cualquier mandato cuenta).
// ---------------------------------------------------------------------------

export function mandatoSolapaConTema(mandatos: MandatoMinimo[], periodo: EstadoTema | undefined): boolean {
  if (periodo?.desde && periodo?.hasta) {
    return mandatos.some((m) => seSuperponen(m.desde, m.hasta, periodo.desde!, periodo.hasta!));
  }
  return mandatos.length > 0;
}

// ---------------------------------------------------------------------------
// Propuestas
// ---------------------------------------------------------------------------

export interface EntradaSiguiente extends EntradaCobertura {
  /** `temas` de `data/simetria.json` (o un cálculo equivalente): período conocido por tema. */
  temasSimetria: EstadoTema[];
}

export interface OpcionesPropuestas {
  cargo?: CargoBase;
  /** Slug de un tema; incluye también a sus subtemas (mismo criterio que `/temas/<slug>/`). */
  tema?: string;
}

export interface Propuesta {
  politico: string;
  tema: string;
  cargo: EtiquetaCargo;
  motivo: string;
  comandoBrief: string;
  comandoInvestigar: string;
}

export interface ResultadoPropuestas {
  propuestas: Propuesta[];
  /** Combinaciones pendientes por tema (persona-tema sin investigar y con mandato solapado), tema completo, sin recortar por `--n`. */
  restantesPorTema: Map<string, number>;
}

const MOTIVO_TEMA_INICIADO = 'iguala cobertura de tema iniciado';
const MOTIVO_TEMA_NUEVO = 'abre tema todavía sin investigar';

/**
 * Arma la cola de próximas corridas. Puro: no toca el disco (`main`, más abajo, es quien
 * lee `content/`, `data/corridas/` y `data/simetria.json`).
 */
export function construirPropuestas(entrada: EntradaSiguiente, opciones: OpcionesPropuestas = {}): ResultadoPropuestas {
  const cobertura = calcularCobertura(entrada);
  const cargoPorPersona = new Map(entrada.politicos.map((p) => [p.id, cargoDePersona(p.mandatos)]));
  const mandatosPorPersona = new Map(entrada.politicos.map((p) => [p.id, p.mandatos]));
  const periodoPorTema = new Map(entrada.temasSimetria.map((t) => [t.tema, t]));

  // Hojas: mismo criterio que `calcularCobertura` para "cuántos temas" (si contáramos
  // también los padres, un tema investigado sumaría dos y el denominador mentiría).
  const hojas = cobertura.temas.filter((t) => !cobertura.temas.some((x) => x.padre === t.id));

  // Regla 3: cuántas personas tiene investigadas cada tema (con o sin hallazgos).
  const investigadosPorTema = new Map<string, number>(hojas.map((t) => [t.id, 0]));
  for (const p of cobertura.politicos) {
    for (const t of p.temas_investigados) investigadosPorTema.set(t, (investigadosPorTema.get(t) ?? 0) + 1);
  }

  interface Candidato {
    politico: string;
    tema: string;
    cargo: InfoCargo;
    investigadosDelTema: number;
  }
  const candidatos: Candidato[] = [];

  for (const t of hojas) {
    if (opciones.tema && !alcanza(opciones.tema, t.id)) continue;
    const periodo = periodoPorTema.get(t.id);
    const investigadosDelTema = investigadosPorTema.get(t.id) ?? 0;
    for (const p of cobertura.politicos) {
      if (!p.temas_sin_investigar.includes(t.id)) continue; // regla 4
      const mandatos = mandatosPorPersona.get(p.politico) ?? [];
      if (!mandatoSolapaConTema(mandatos, periodo)) continue; // regla 1
      const cargo = cargoPorPersona.get(p.politico) ?? SIN_CARGO_RECONOCIDO;
      if (opciones.cargo && cargo.base !== opciones.cargo) continue;
      candidatos.push({ politico: p.politico, tema: t.id, cargo, investigadosDelTema });
    }
  }

  candidatos.sort((a, b) => {
    if (a.investigadosDelTema !== b.investigadosDelTema) return b.investigadosDelTema - a.investigadosDelTema; // regla 3
    if (a.tema !== b.tema) return a.tema.localeCompare(b.tema, 'es'); // regla 3, empate
    if (a.cargo.tier !== b.cargo.tier) return a.cargo.tier - b.cargo.tier; // regla 2
    return a.politico.localeCompare(b.politico, 'es'); // regla 2, empate
  });

  const restantesPorTema = new Map<string, number>();
  for (const c of candidatos) restantesPorTema.set(c.tema, (restantesPorTema.get(c.tema) ?? 0) + 1);

  const propuestas: Propuesta[] = candidatos.map((c) => ({
    politico: c.politico,
    tema: c.tema,
    cargo: c.cargo.etiqueta,
    motivo: c.investigadosDelTema > 0 ? MOTIVO_TEMA_INICIADO : MOTIVO_TEMA_NUEVO,
    comandoBrief: `pnpm brief ${c.politico} ${c.tema}`,
    comandoInvestigar: `/investigar ${c.politico} ${c.tema}`,
  }));

  return { propuestas, restantesPorTema };
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const CARGOS_VALIDOS: CargoBase[] = ['presidente', 'senador', 'diputado'];

function temasDesdeContenido(contenido: ReturnType<typeof cargarContenido>): TemaMinimo[] {
  return contenido.de('temas').map((r) => ({
    id: r.id,
    nombre: typeof r.datos.nombre === 'string' ? r.datos.nombre : r.id,
    padre: typeof r.datos.padre === 'string' ? r.datos.padre : undefined,
  }));
}

async function main(): Promise<void> {
  const { opciones } = parsearArgs(process.argv.slice(2));

  const n = Number(opciones.n ?? 10);
  if (!Number.isFinite(n) || n < 0) {
    log.error(`--n debe ser un número (recibido: ${opciones.n}).`);
    process.exit(1);
  }
  let cargoFiltro: CargoBase | undefined;
  if (typeof opciones.cargo === 'string') {
    if (!CARGOS_VALIDOS.includes(opciones.cargo as CargoBase)) {
      log.error(`--cargo debe ser uno de ${CARGOS_VALIDOS.join('|')} (recibido: ${opciones.cargo}).`);
      process.exit(1);
    }
    cargoFiltro = opciones.cargo as CargoBase;
  }
  const temaFiltro = typeof opciones.tema === 'string' ? opciones.tema : undefined;
  const comoJson = opciones.json === true;

  const contenido = cargarContenido(raizRepo());
  const { politicos, registros } = entradaDesdeContenido(contenido);
  const temas = temasDesdeContenido(contenido);
  const corridas: Corrida[] = listarCorridas(
    politicos.map((p) => p.id),
    temas.map((t) => t.id),
    contenido.rootDir,
  );

  const rutaSimetria = path.join(contenido.rootDir, 'data', 'simetria.json');
  let temasSimetria: EstadoTema[] = [];
  if (existsSync(rutaSimetria)) {
    temasSimetria = (JSON.parse(readFileSync(rutaSimetria, 'utf8')).temas ?? []) as EstadoTema[];
  } else {
    log.aviso('No existe data/simetria.json (corré `pnpm validar` para generarlo). Sin él, ningún tema tiene período conocido: se propone para cualquier persona con mandato.');
  }

  const { propuestas, restantesPorTema } = construirPropuestas(
    { politicos, temas, registros, corridas, temasSimetria },
    { cargo: cargoFiltro, tema: temaFiltro },
  );

  const seleccion = propuestas.slice(0, n);

  if (comoJson) {
    console.log(
      JSON.stringify(
        seleccion.map((p) => ({
          politico: p.politico,
          tema: p.tema,
          cargo: p.cargo,
          motivo: p.motivo,
          comando: `${p.comandoBrief}\n${p.comandoInvestigar}`,
        })),
        null,
        2,
      ),
    );
    return;
  }

  for (const p of seleccion) {
    console.log(`${p.politico} · ${p.tema} · ${p.motivo}`);
    console.log(`  ${p.comandoBrief}`);
    console.log(`  ${p.comandoInvestigar}`);
  }
  if (!seleccion.length) console.log('(sin combinaciones pendientes con los filtros pedidos)');

  const resumen = [...restantesPorTema.entries()]
    .sort(([a], [b]) => a.localeCompare(b, 'es'))
    .map(([tema, cuantos]) => `${tema}: ${cuantos}`)
    .join(' · ');
  console.log('');
  console.log(`Quedan por tema: ${resumen || '(ninguna)'}`);
}

const esCLI = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));
if (esCLI) {
  main().catch((e) => {
    log.error((e as Error).stack ?? String(e));
    process.exit(1);
  });
}
