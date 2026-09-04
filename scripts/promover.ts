/**
 * `pnpm promover <inbox-run-dir> [--corrida <id>] [--modelo <id>] [--solo-crudo] [--simulacion]`
 *
 * Único camino de `inbox/` a `content/`. Por cada registro de las listas YAML de
 * la corrida:
 *
 *   1. quita los campos `_` (los del investigador), normaliza marcas de tiempo;
 *   2. le asigna id según la convención de su colección (fecha + slug);
 *   3. le escribe `procedencia` {corrida, agente, agente_sha, modelo, brief_sha, fecha};
 *   4. lo valida contra su esquema y lo escribe en `content/<coleccion>/<id>.yaml`,
 *      **sin sobreescribir nunca** un archivo existente.
 *
 * Y deja el rastro de la corrida en `data/corridas/<id>/`: `crudo/` (lo que
 * escribió el investigador, antes de tocarlo), `consultas.jsonl`, `agentes.json`
 * (hashes de CLAUDE.md y de todos los agentes y comandos) y `edicion.diff`
 * (crudo vs. lo que se promueve). Si el diff no es vacío, exige `razones.md`.
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { stringify as stringifyYaml } from 'yaml';
import { definicionDeColeccion, type NombreColeccion } from '../src/schemas/comunes';
import { aPosix, validarContraEsquema } from './lib/contenido.ts';
import {
  archivoDeAgente,
  carpetaCorrida,
  commitActual,
  hashDeArchivo,
  hashesDeInstrucciones,
  idCorridaDesdeInbox,
  PATRON_ID_CORRIDA,
  type AgentesJson,
} from './lib/corridas.ts';
import { diffUnificado } from './lib/diff.ts';
import { AGENTE_POR_COLECCION, asegurarCrudo, derivarId, leerArchivosInbox, normalizarRegistroInbox } from './lib/inbox.ts';
import { log, parsearArgs } from './lib/log.ts';
import { RAIZ } from './lib/rutas.ts';
import type { Problema } from './validadores/tipos.ts';

export interface OpcionesPromover {
  rootDir?: string;
  /** Id de la corrida; si falta, se deriva de la ruta del inbox. */
  corrida?: string;
  /** Modelo a usar cuando un registro no trae `_investigacion.modelo`. */
  modelo?: string;
  /** Calcular todo sin escribir nada. */
  simulacion?: boolean;
  /** Congelar crudo/ y consultas.jsonl y salir, sin promover: se corre antes de que edite el editor. */
  soloCrudo?: boolean;
}

export interface RegistroPromovido {
  coleccion: NombreColeccion;
  id: string;
  /** Ruta destino relativa a la raíz. */
  destino: string;
  origen: string;
  agente: string;
  modelo: string;
}

export interface ResultadoPromover {
  corrida: string;
  corridaDir: string;
  promovidos: RegistroPromovido[];
  errores: Problema[];
  /** Diff crudo → promovido (vacío si el editor no tocó nada). */
  diff: string;
  /** true si solo se congeló el crudo y no se promovió nada. */
  soloCrudo?: boolean;
  /** Artefactos escritos en data/corridas/<id>/. */
  artefactos: string[];
  /** true si no se escribió nada (simulación o errores). */
  simulado: boolean;
}

function yamlDeRegistro(datos: Record<string, unknown>): string {
  return stringifyYaml(datos, { lineWidth: 100 });
}

/** Representación estable de una lista de registros, para el diff. */
function yamlDeLista(items: Record<string, unknown>[]): string {
  return items.length ? stringifyYaml(items, { lineWidth: 100, sortMapEntries: true }) : '';
}

/** Copia sin `procedencia` (la escribe la máquina; no es una edición del editor). */
function sinProcedencia(datos: Record<string, any>): Record<string, any> {
  const copia = structuredClone(datos);
  delete copia.procedencia;
  return copia;
}

export function promover(inboxDir: string, opciones: OpcionesPromover = {}): ResultadoPromover {
  const rootDir = path.resolve(opciones.rootDir ?? RAIZ);
  const dirCorrida = path.resolve(inboxDir);
  if (!existsSync(dirCorrida)) throw new Error(`No existe la carpeta del inbox: ${inboxDir}`);

  const corrida = opciones.corrida ?? idCorridaDesdeInbox(dirCorrida);
  if (!corrida) {
    throw new Error(
      `No se pudo derivar el id de la corrida de "${inboxDir}". Pasalo con --corrida <YYYY-MM-DD>-<politico>-<tema> (el tema con / reemplazado por -).`,
    );
  }
  if (!PATRON_ID_CORRIDA.test(corrida)) {
    throw new Error(`Id de corrida inválido: "${corrida}". Formato: <YYYY-MM-DD>-<politico>-<tema con / → ->.`);
  }
  const fechaCorrida = corrida.slice(0, 10);
  const corridaDir = carpetaCorrida(rootDir, corrida);
  const errores: Problema[] = [];
  const artefactos: string[] = [];

  // -------------------------------------------------------------------------
  // 1. Artefactos: brief.md (tiene que existir de antes), crudo/, consultas.jsonl
  // -------------------------------------------------------------------------
  const briefPath = path.join(corridaDir, 'brief.md');
  if (!existsSync(briefPath)) {
    throw new Error(`Falta data/corridas/${corrida}/brief.md: es el prompt exacto que recibió el agente y sin él no hay procedencia verificable.`);
  }
  const briefSha = hashDeArchivo(briefPath);

  if (!opciones.simulacion) {
    mkdirSync(corridaDir, { recursive: true });
    // El crudo se copia una sola vez: si ya está, es lo que escribió el investigador y no se toca.
    //
    // Cuidado con CUÁNDO se llama a esto. Si la primera vez que corre `promover` es después de
    // que editó el editor, lo que queda congelado como "crudo" ya es la versión editada, el
    // `edicion.diff` sale vacío y nadie puede auditar qué cambió el editor. Por eso `/revisar`
    // corre `pnpm promover <dir> --corrida <id> --solo-crudo` apenas valida el inbox, antes de
    // lanzar al crítico y al editor.
    const copiados = asegurarCrudo(dirCorrida, corridaDir);
    if (copiados.length) artefactos.push(...copiados.map((c) => `crudo/${c}`));

    const consultas = path.join(dirCorrida, 'consultas.jsonl');
    if (existsSync(consultas)) {
      copyFileSync(consultas, path.join(corridaDir, 'consultas.jsonl'));
      artefactos.push('consultas.jsonl');
    }

    if (opciones.soloCrudo) {
      return { corrida, corridaDir, promovidos: [], errores: [], diff: '', artefactos, simulado: false, soloCrudo: true };
    }
  }

  // -------------------------------------------------------------------------
  // 2. Leer el crudo (antes) y el inbox (después)
  // -------------------------------------------------------------------------
  const crudoDir = path.join(corridaDir, 'crudo');
  const archivosCrudo = existsSync(crudoDir) ? leerArchivosInbox(crudoDir) : [];
  const archivosInbox = leerArchivosInbox(dirCorrida);
  if (!archivosInbox.length) {
    throw new Error(`La carpeta ${aPosix(path.relative(rootDir, dirCorrida))} no tiene ningún YAML de registros (declaraciones.yaml, giros.yaml, …).`);
  }

  // -------------------------------------------------------------------------
  // 3. Normalizar, asignar id y procedencia
  // -------------------------------------------------------------------------
  const usados = new Set<string>();
  const finales: { coleccion: NombreColeccion; id: string; datos: Record<string, any>; origen: string; agente: string; modelo: string }[] = [];
  const shaAgente = new Map<string, { archivo: string; sha256: string }>();
  const modelosPorAgente = new Map<string, string>();

  for (const archivo of archivosInbox) {
    const relOrigen = aPosix(path.relative(rootDir, archivo.ruta));
    archivo.items.forEach((item, n) => {
      const origen = `${relOrigen}#${n}`;
      if (!item || typeof item !== 'object' || Array.isArray(item)) {
        errores.push({ archivo: origen, campo: '(registro)', mensaje: 'Cada elemento de la lista debe ser un objeto con los campos del esquema.' });
        return;
      }
      const investigacion = (item._investigacion ?? {}) as Record<string, unknown>;
      const agente = String(investigacion.agente ?? AGENTE_POR_COLECCION[archivo.coleccion] ?? 'investigador');
      const modelo = String(investigacion.modelo ?? opciones.modelo ?? '');
      if (!modelo) {
        errores.push({
          archivo: origen,
          campo: '_investigacion.modelo',
          mensaje: 'Falta el modelo que produjo el registro: agregá `_investigacion: {modelo: <id de modelo>}` al crudo o pasá --modelo <id>. Sin modelo no hay procedencia auditable.',
        });
        return;
      }
      if (!shaAgente.has(agente)) {
        const rel = archivoDeAgente(rootDir, agente);
        if (!rel) {
          errores.push({
            archivo: origen,
            campo: '_investigacion.agente',
            mensaje: `No existe .claude/agents/${agente}.md ni .claude/commands/${agente}.md: el hash de instrucciones del agente es parte de la procedencia.`,
          });
          return;
        }
        shaAgente.set(agente, { archivo: rel, sha256: hashDeArchivo(path.join(rootDir, ...rel.split('/'))) });
      }
      modelosPorAgente.set(agente, modelo);

      const datos = normalizarRegistroInbox(archivo.coleccion, item, false);
      datos.procedencia = {
        corrida,
        agente,
        agente_sha: shaAgente.get(agente)!.sha256,
        modelo,
        brief_sha: briefSha,
        fecha: fechaCorrida,
      };

      const id = derivarId(archivo.coleccion, item, usados);
      const v = validarContraEsquema(archivo.coleccion, datos, origen);
      if (!v.datos) {
        errores.push(...v.errores);
        return;
      }
      finales.push({ coleccion: archivo.coleccion, id, datos, origen, agente, modelo });
    });
  }

  // -------------------------------------------------------------------------
  // 4. edicion.diff: crudo/ vs. lo que se promueve
  // -------------------------------------------------------------------------
  const partesDiff: string[] = [];
  for (const archivo of archivosInbox) {
    const crudo = archivosCrudo.find((c) => c.nombre === archivo.nombre);
    const antes = yamlDeLista((crudo?.items ?? []).map((i) => normalizarRegistroInbox(archivo.coleccion, i, false)));
    const despues = yamlDeLista(finales.filter((f) => f.origen.startsWith(aPosix(path.relative(rootDir, archivo.ruta)) + '#')).map((f) => sinProcedencia(f.datos)));
    const d = diffUnificado(antes, despues, `crudo/${archivo.nombre}`, `content/ (${archivo.coleccion})`);
    if (d) partesDiff.push(d);
  }
  const diff = partesDiff.join('\n');

  if (!opciones.simulacion) {
    writeFileSync(path.join(corridaDir, 'edicion.diff'), diff, 'utf8');
    artefactos.push('edicion.diff');

    const agentes: AgentesJson = {
      commit: commitActual(rootDir),
      generado: new Date().toISOString(),
      archivos: hashesDeInstrucciones(rootDir),
      agentes: Object.fromEntries(
        [...shaAgente.entries()].map(([nombre, info]) => [nombre, { archivo: info.archivo, sha256: info.sha256, modelo: modelosPorAgente.get(nombre) }]),
      ),
    };
    writeFileSync(path.join(corridaDir, 'agentes.json'), JSON.stringify(agentes, null, 2) + '\n', 'utf8');
    artefactos.push('agentes.json');
  }

  // -------------------------------------------------------------------------
  // 5. razones.md obligatorio si el editor tocó algo
  // -------------------------------------------------------------------------
  const razones = path.join(corridaDir, 'razones.md');
  if (diff.trim() && (!existsSync(razones) || readFileSync(razones, 'utf8').trim() === '')) {
    errores.push({
      archivo: `data/corridas/${corrida}/razones.md`,
      campo: '(archivo)',
      mensaje: `El editor cambió el crudo (data/corridas/${corrida}/edicion.diff no está vacío): escribí razones.md con una línea por cada cambio no trivial y volvé a correr pnpm promover.`,
    });
  }

  // -------------------------------------------------------------------------
  // 6. Escribir en content/ (nunca sobreescribe)
  // -------------------------------------------------------------------------
  const promovidos: RegistroPromovido[] = [];
  for (const f of finales) {
    const def = definicionDeColeccion(f.coleccion);
    const destinoRel = `${def.carpeta}/${f.id}.${def.extension}`;
    const destino = path.join(rootDir, ...destinoRel.split('/'));
    if (existsSync(destino)) {
      errores.push({
        archivo: destinoRel,
        campo: '(archivo)',
        mensaje: `Ya existe: promover nunca sobreescribe. Si es una corrección, va por content/correcciones/ con reemplaza:; si es un registro distinto, cambiale el _slug en el crudo.`,
      });
      continue;
    }
    if (!def.patronId.test(f.id)) {
      errores.push({
        archivo: destinoRel,
        campo: '(archivo)',
        mensaje: `El id derivado "${f.id}" no cumple el patrón de la colección ${f.coleccion} (${def.patronId.source}); poné un _slug explícito en el crudo. Ejemplo válido: ${def.ejemplo}.`,
      });
      continue;
    }
    promovidos.push({ coleccion: f.coleccion, id: f.id, destino: destinoRel, origen: f.origen, agente: f.agente, modelo: f.modelo });
  }

  const simulado = opciones.simulacion === true || errores.length > 0;
  if (!simulado) {
    for (const p of promovidos) {
      const f = finales.find((x) => x.coleccion === p.coleccion && x.id === p.id)!;
      const destino = path.join(rootDir, ...p.destino.split('/'));
      mkdirSync(path.dirname(destino), { recursive: true });
      writeFileSync(destino, yamlDeRegistro(f.datos), 'utf8');
    }
  }

  return { corrida, corridaDir, promovidos, errores, diff, artefactos, simulado };
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const AYUDA = `pnpm promover <inbox-run-dir> [--corrida <id>] [--modelo <id>] [--solo-crudo] [--simulacion]

Separa las listas del inbox en un archivo por registro dentro de content/,
les asigna id y procedencia, y deja el rastro en data/corridas/<id>/.

  --corrida <id>   id de la corrida (por defecto se deriva de la ruta del inbox)
  --modelo <id>    modelo para los registros sin _investigacion.modelo
  --solo-crudo     congela crudo/ y consultas.jsonl y sale, sin promover nada.
                   Se corre apenas valida el inbox y ANTES de que edite el editor:
                   si no, lo que queda como "crudo" ya es la version editada y
                   edicion.diff sale vacio.
  --simulacion     muestra qué haría, sin escribir`;

function main(): void {
  const { posicionales, opciones } = parsearArgs(process.argv.slice(2));
  if (!posicionales.length || opciones.ayuda || opciones.help) {
    console.log(AYUDA);
    process.exit(posicionales.length ? 0 : 1);
  }
  try {
    const r = promover(posicionales[0]!, {
      corrida: typeof opciones.corrida === 'string' ? opciones.corrida : undefined,
      modelo: typeof opciones.modelo === 'string' ? opciones.modelo : undefined,
      simulacion: opciones.simulacion === true,
      soloCrudo: opciones['solo-crudo'] === true,
    });
    console.log(`corrida: ${r.corrida}`);
    if (r.artefactos.length) console.log(`artefactos: ${r.artefactos.join(', ')}`);
    if (r.soloCrudo) {
      log.ok(`crudo congelado en data/corridas/${r.corrida}/crudo/. Ahora sí puede editar el editor: lo que cambie va a quedar en edicion.diff.`);
      process.exit(0);
    }
    console.log(r.diff.trim() ? `edicion.diff: ${r.diff.split('\n').length} línea(s) de cambios del editor` : 'edicion.diff: vacío (el editor no tocó el crudo)');
    for (const p of r.promovidos) console.log(`  ${r.simulado ? '(simulado) ' : ''}${p.destino}  ← ${p.origen}  [${p.agente} · ${p.modelo}]`);
    if (r.errores.length) {
      console.log('');
      console.log(`No se promovió nada: ${r.errores.length} problema(s).`);
      for (const e of r.errores) console.log(`  ${e.archivo}\n    ${e.campo}: ${e.mensaje}`);
      process.exit(1);
    }
    log.ok(`${r.promovidos.length} registro(s) ${r.simulado ? 'listos para promover' : 'promovidos'}. Ahora: pnpm validar (y --red), pnpm aprobar donde corresponda, commit con [corrida ${r.corrida}].`);
    process.exit(0);
  } catch (e) {
    log.error((e as Error).message);
    process.exit(1);
  }
}

const esEntrada = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (esEntrada) main();
