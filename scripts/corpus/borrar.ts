/**
 * pnpm corpus:borrar <id> --motivo "<texto>" [--simulacion]
 *
 * Saca una nota completa del corpus: `notas/<id>.*` (json, html.gz, pdf, xlsx, zip, txt.gz…), su
 * transcripción en `transcripciones/<id>.json` si la tiene, sus filas del índice (`indice.db`) y
 * los trabajos pendientes de `cola/` cuyo `params` la referencia por id o por URL (un trabajo
 * `en_curso/` no se toca, solo se avisa: puede haber un worker vivo sobre él).
 *
 * Se niega si algún registro de `content/` cita la URL de la nota, o si el catálogo ya sacó
 * afirmaciones de ella (`nota.catalogo.afirmaciones`): en ese caso imprime quién la cita y sale
 * con 1. No existe `--forzar`; una nota citada no se borra.
 *
 * Caso real (2026-09-16): un crítico armó a mano una URL de Montevideo Portal que devolvió una nota
 * de otro tema (incendios en Australia); nadie la citó, pero había quedado con un trabajo
 * `catalogar` encolado y no había forma de sacarla del corpus.
 *
 * Deja constancia en `<CORPUS_DIR>/borradas.jsonl` (una línea JSON por borrado: fecha, id, url,
 * medio, motivo, quien) para que un id borrado no vuelva a entrar sin que se sepa. Por ahora ningún
 * comando lee ese archivo; la idea es que `pnpm fuente` lo consulte más adelante para no volver a
 * bajar una URL que ya se decidió que no sirve.
 */
import { appendFileSync, existsSync, readdirSync, readFileSync, statSync, unlinkSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { hostname } from 'node:os';
import { parse as parseYaml } from 'yaml';
import { CORPUS_DIR, RAIZ } from '../lib/rutas.ts';
import { log, parsearArgs } from '../lib/log.ts';
import { abrirIndice, quitarNota, type Indice } from './indexar.ts';
import type { Nota } from './tipos.ts';

/** Mismas 8 tablas por-nota que borra `quitarNota()` de `indexar.ts` (más `notas`/`notas_fts`). Si
 * ese esquema gana una tabla nueva, hay que sumarla acá también para que el conteo no mienta. */
const TABLAS_POR_NOTA = ['menciones', 'nota_tema', 'nota_evento', 'nota_partido', 'afirmaciones', 'nota_fecha_mencionada', 'nota_empresa', 'nota_ley'];

/**
 * Todas las rutas de `dir` con extensión `.yaml` o `.md`, recursivo. Copia chica de
 * `listarArchivos` de `validadores/esquema.ts`, sin pasar por Zod: acá no hace falta validar el
 * esquema de cada colección, solo leer el texto crudo para buscar una URL citada.
 */
function listarYamlYMd(dir: string): string[] {
  let entradas: string[];
  try {
    entradas = readdirSync(dir);
  } catch {
    return [];
  }
  const salida: string[] = [];
  for (const nombre of entradas.sort()) {
    const ruta = join(dir, nombre);
    let esDir: boolean;
    try {
      esDir = statSync(ruta).isDirectory();
    } catch {
      continue;
    }
    if (esDir) salida.push(...listarYamlYMd(ruta));
    else if (nombre.endsWith('.yaml') || nombre.endsWith('.md')) salida.push(ruta);
  }
  return salida;
}

/** Rutas relativas (con `/`) de `content/` cuyo texto crudo contiene alguna de `agujas` (id, url, url_canonica). */
function citasEnContenido(carpetaContent: string, agujas: string[]): string[] {
  const citas: string[] = [];
  for (const ruta of listarYamlYMd(carpetaContent)) {
    let texto: string;
    try {
      texto = readFileSync(ruta, 'utf8');
    } catch {
      continue;
    }
    if (agujas.some((a) => !!a && texto.includes(a))) citas.push(relative(carpetaContent, ruta).split('\\').join('/'));
  }
  return citas.sort();
}

interface TrabajoLeido {
  ruta: string;
  id: string;
  tipo: string;
  params: Record<string, unknown>;
}

/** Trabajos `.yaml` de una carpeta de la cola (no baja a subcarpetas: cada estado es su propia carpeta). */
function leerTrabajosDeCarpeta(carpeta: string): TrabajoLeido[] {
  if (!existsSync(carpeta)) return [];
  const salida: TrabajoLeido[] = [];
  for (const f of readdirSync(carpeta).sort()) {
    if (!f.endsWith('.yaml')) continue;
    const ruta = join(carpeta, f);
    try {
      const t = parseYaml(readFileSync(ruta, 'utf8')) as { id?: string; tipo?: string; params?: Record<string, unknown> } | null;
      if (t && typeof t === 'object' && t.id) salida.push({ ruta, id: t.id, tipo: t.tipo ?? '?', params: t.params ?? {} });
    } catch {
      // Trabajo con YAML ilegible: no es parte de este barrido, queda para quien lo mire a mano.
    }
  }
  return salida;
}

/** true si el JSON de `params` contiene, como substring, alguna de `agujas`. */
function refiereA(params: Record<string, unknown>, agujas: string[]): boolean {
  const texto = JSON.stringify(params);
  return agujas.some((a) => !!a && texto.includes(a));
}

function contarFilasDeNota(indice: Indice, id: string): number {
  let n = 0;
  for (const tabla of TABLAS_POR_NOTA) {
    const r = indice.db.prepare(`SELECT COUNT(*) AS n FROM ${tabla} WHERE nota = ?`).get(id) as { n: number };
    n += r.n;
  }
  n += (indice.db.prepare('SELECT COUNT(*) AS n FROM notas WHERE id = ?').get(id) as { n: number }).n;
  n += (
    indice.fts
      ? (indice.db.prepare('SELECT COUNT(*) AS n FROM notas_fts WHERE id = ?').get(id) as { n: number })
      : (indice.db.prepare('SELECT COUNT(*) AS n FROM notas_texto WHERE id = ?').get(id) as { n: number })
  ).n;
  return n;
}

export interface OpcionesBorrar {
  motivo: string;
  simulacion?: boolean;
  /** Carpeta del corpus (con notas/, transcripciones/, cola/, indice.db). Por defecto CORPUS_DIR. */
  carpetaCorpus?: string;
  /** Carpeta content/ del repo público, para buscar citas. Por defecto RAIZ/content. */
  carpetaContent?: string;
}

export interface TrabajoEncontrado {
  id: string;
  tipo: string;
}

export interface ResultadoBorrar {
  id: string;
  /** false si no había `notas/<id>.json`: no hay nada que borrar ni URL para buscar citas. */
  encontrada: boolean;
  url: string | null;
  medio: string | null;
  /** Rutas relativas dentro de `content/` que citan la URL o el id de la nota. */
  citadaPorContent: string[];
  /** true si `nota.catalogo.afirmaciones` no está vacío. */
  citadaPorCatalogo: boolean;
  /** false si está citada (por content/ o por catálogo): ahí no se toca nada, con o sin `simulacion`. */
  puedeBorrar: boolean;
  /** Rutas absolutas borradas (o que se borrarían, en simulación): notas/<id>.* + transcripción. */
  archivos: string[];
  /** Filas de `indice.db` que le correspondían a la nota (se cuentan igual en simulación). */
  filasIndice: number;
  trabajosPendientesBorrados: TrabajoEncontrado[];
  trabajosEnCursoAvisados: TrabajoEncontrado[];
  simulacion: boolean;
}

/**
 * Borra (o, con `simulacion: true`, solo evalúa) una nota del corpus. Nunca borra una nota citada
 * desde `content/` o ya usada por el catálogo: ahí `puedeBorrar` da false y no se toca nada, tenga
 * o no `simulacion`. No existe una opción para forzarlo.
 */
export function borrarNota(id: string, opciones: OpcionesBorrar): ResultadoBorrar {
  const carpetaCorpus = opciones.carpetaCorpus ?? CORPUS_DIR;
  const carpetaContent = opciones.carpetaContent ?? join(RAIZ, 'content');
  const simulacion = opciones.simulacion === true;
  const carpetaNotas = join(carpetaCorpus, 'notas');
  const carpetaTranscripciones = join(carpetaCorpus, 'transcripciones');
  const carpetaCola = join(carpetaCorpus, 'cola');
  const carpetaColaEnCurso = join(carpetaCola, 'en_curso');
  const rutaIndice = join(carpetaCorpus, 'indice.db');
  const rutaBorradas = join(carpetaCorpus, 'borradas.jsonl');

  const rutaNota = join(carpetaNotas, `${id}.json`);
  if (!existsSync(rutaNota)) {
    return {
      id,
      encontrada: false,
      url: null,
      medio: null,
      citadaPorContent: [],
      citadaPorCatalogo: false,
      puedeBorrar: false,
      archivos: [],
      filasIndice: 0,
      trabajosPendientesBorrados: [],
      trabajosEnCursoAvisados: [],
      simulacion,
    };
  }
  const nota = JSON.parse(readFileSync(rutaNota, 'utf8')) as Nota;
  const agujas = [id, nota.url, nota.url_canonica];

  const citadaPorContent = citasEnContenido(carpetaContent, agujas);
  const citadaPorCatalogo = !!(nota.catalogo?.afirmaciones && nota.catalogo.afirmaciones.length > 0);
  const puedeBorrar = citadaPorContent.length === 0 && !citadaPorCatalogo;

  if (!puedeBorrar) {
    return {
      id,
      encontrada: true,
      url: nota.url,
      medio: nota.medio,
      citadaPorContent,
      citadaPorCatalogo,
      puedeBorrar,
      archivos: [],
      filasIndice: 0,
      trabajosPendientesBorrados: [],
      trabajosEnCursoAvisados: [],
      simulacion,
    };
  }

  // notas/<id>.* : json, html.gz, pdf, xlsx, zip, txt.gz... lo que haya quedado de esa descarga.
  const archivos = existsSync(carpetaNotas)
    ? readdirSync(carpetaNotas)
        .filter((f) => f === `${id}.json` || f.startsWith(`${id}.`))
        .sort()
        .map((f) => join(carpetaNotas, f))
    : [];
  if (nota.transcripcion) {
    const rutaTr = join(carpetaTranscripciones, `${nota.transcripcion}.json`);
    if (existsSync(rutaTr)) archivos.push(rutaTr);
  }
  if (!simulacion) for (const a of archivos) unlinkSync(a);

  // Índice: se cuenta antes de tocar nada (vale también para la simulación); se borra solo si no lo es.
  let filasIndice = 0;
  if (existsSync(rutaIndice)) {
    const indice = abrirIndice({ ruta: rutaIndice, soloLectura: simulacion });
    try {
      filasIndice = contarFilasDeNota(indice, id);
      if (!simulacion) quitarNota(indice, id);
    } finally {
      indice.cerrar();
    }
  }

  // Cola: los pendientes que la citan se sacan; en_curso/ solo se avisa (puede haber un worker vivo).
  const pendientes = leerTrabajosDeCarpeta(carpetaCola).filter((t) => refiereA(t.params, agujas));
  const enCurso = leerTrabajosDeCarpeta(carpetaColaEnCurso).filter((t) => refiereA(t.params, agujas));
  if (!simulacion) for (const t of pendientes) unlinkSync(t.ruta);

  if (!simulacion) {
    const linea = JSON.stringify({
      fecha: new Date().toISOString(),
      id,
      url: nota.url,
      medio: nota.medio,
      motivo: opciones.motivo,
      quien: hostname(),
    });
    appendFileSync(rutaBorradas, linea + '\n', 'utf8');
  }

  return {
    id,
    encontrada: true,
    url: nota.url,
    medio: nota.medio,
    citadaPorContent,
    citadaPorCatalogo,
    puedeBorrar,
    archivos,
    filasIndice,
    trabajosPendientesBorrados: pendientes.map((t) => ({ id: t.id, tipo: t.tipo })),
    trabajosEnCursoAvisados: enCurso.map((t) => ({ id: t.id, tipo: t.tipo })),
    simulacion,
  };
}

function main(): void {
  const { posicionales, opciones } = parsearArgs(process.argv.slice(2));
  const id = posicionales[0];
  const motivo = typeof opciones.motivo === 'string' ? opciones.motivo : '';
  const simulacion = opciones.simulacion === true;
  if (!id || !motivo) {
    process.stderr.write('Uso: pnpm corpus:borrar <id> --motivo "<texto>" [--simulacion]\n');
    process.exit(2);
  }

  const r = borrarNota(id, { motivo, simulacion });

  if (!r.encontrada) {
    log.error(`no existe notas/${id}.json en el corpus`);
    process.exit(1);
  }

  if (!r.puedeBorrar) {
    log.error(`${id} está citada: no se borra (no existe --forzar)`);
    for (const c of r.citadaPorContent) process.stdout.write(`  content: ${c}\n`);
    if (r.citadaPorCatalogo) process.stdout.write('  catalogo.afirmaciones de la propia nota\n');
    process.exit(1);
  }

  for (const a of r.archivos) process.stdout.write(`${simulacion ? 'borraría' : 'borrado'}: ${a}\n`);
  for (const t of r.trabajosPendientesBorrados) process.stdout.write(`${simulacion ? 'sacaría de la cola' : 'sacado de la cola'}: ${t.id} (${t.tipo})\n`);
  for (const t of r.trabajosEnCursoAvisados) log.aviso(`${t.id} (${t.tipo}) sigue en_curso/: no se toca, puede haber un worker vivo`);

  log.ok(
    `${simulacion ? 'simulación — ' : ''}${r.archivos.length} archivo(s), ${r.filasIndice} fila(s) de índice, ${r.trabajosPendientesBorrados.length} trabajo(s) de cola` +
      (simulacion ? '. Nada se tocó (correr sin --simulacion para aplicar).' : '. Constancia en borradas.jsonl.'),
  );
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
