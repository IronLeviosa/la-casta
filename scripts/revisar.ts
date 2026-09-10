/**
 * `pnpm revisar <inbox-dir> antes|despues [opciones]`
 *
 * Corre la cadena mecánica de `/revisar` (docs/plan-2026-09.md, fase 1, ítem 1.3) en dos
 * mitades, para que el orquestador (un chat en un modelo caro) no lea salidas largas ni
 * ejecute los pasos mecánicos a mano: lee un resumen de 20 a 30 líneas y lanza los agentes
 * de criterio (crítico, editor) él mismo.
 *
 * `pnpm revisar <inbox-dir> antes [--corrida <id>] [--lote <nombre>]`
 *   0. Prechequeos: existe `data/corridas/<id>/brief.md`; con `--lote`, crea
 *      `data/corridas/<id>-<lote>/` y copia el brief ahí si falta; el brief de la carpeta
 *      de trabajo no cambió desde que se promovió algo con él; ningún id derivado del lote
 *      colisiona con uno ya publicado en `content/`.
 *   1. `pnpm validar --inbox <dir> --breve`.
 *   1b. Congela el crudo (`pnpm promover <dir> --corrida <id> --solo-crudo`), pero solo si
 *       `crudo/` no existe todavía: si ya existe es la foto del investigador y no se pisa,
 *       aunque el editor ya haya pasado por el lote.
 *   Termina imprimiendo qué lanzar ahora (crítico, después editor) con el prompt exacto de
 *   `.claude/commands/revisar.md`.
 *
 * `pnpm revisar <inbox-dir> despues [--corrida <id>] [--modelo <id>] [--sin-archivar] [--sin-build]`
 *   a. Verifica `critica.md`, y `razones.md` si el editor tocó el crudo.
 *   b. `pnpm validar --inbox <dir> --red --breve`.
 *   c. `pnpm promover <dir> --corrida <id> --modelo <modelo>` (modelo: `--modelo`, si no
 *      `agentes.json` de la corrida, si no error: `pnpm agentes --json` no filtra por corrida).
 *   d. `pnpm archivar` (salvo `--sin-archivar`).
 *   e. `pnpm validar --red --breve` sobre todo `content/`.
 *   f. `pnpm build`, salida a `.cache/revisar-<id>.log`, código de salida verificado (nunca
 *      por tubería), salvo `--sin-build`.
 *   g. Registros promovidos por colección y tier, y los que quedaron en `probable` con el
 *      motivo que usa la página `/probable/` (src/lib/probable.ts).
 *   h. Propone el mensaje de commit `<resumen> [corrida <id>]`. No commitea.
 *
 * Toda la salida cabe en 20 a 30 líneas; el detalle largo (el build completo) va al log en
 * `.cache/`. Cada paso imprime `✔ <paso>` o `✘ <paso>: <motivo>` y se corta en el primer
 * fallo. Códigos de salida: 0 ok · 1 fallo de contenido (con la lista) · 2 fallo de
 * infraestructura.
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { aPosix, cargarContenido } from './lib/contenido.ts';
import { buscarEjecutable, ejecutarSync } from './lib/ejecutable.ts';
import { derivarId, leerArchivosInbox } from './lib/inbox.ts';
import { log, parsearArgs } from './lib/log.ts';
import { carpetaCorrida, hashDelBrief, idCorridaDesdeInbox, leerAgentesJson, PATRON_ID_CORRIDA } from './lib/corridas.ts';
import { RAIZ } from './lib/rutas.ts';
import { archivarTodo } from './archivar.ts';
import { promover } from './promover.ts';
import { lineasBreve, validar } from './validar.ts';
import { motivosProbable } from '../src/lib/probable.ts';
import { definicionDeColeccion, type NombreColeccion } from '../src/schemas/comunes';

/** Segmento de id válido para `--lote`: minúsculas y guiones, igual que el resto de un id de corrida. */
const PATRON_LOTE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export interface ResultadoMitad {
  /** 0 ok · 1 fallo de contenido · 2 fallo de infraestructura. */
  codigo: 0 | 1 | 2;
  lineas: string[];
}

interface ChequeoPrevio {
  ok: boolean;
  motivo?: string;
}

// ---------------------------------------------------------------------------
// Prechequeos (0)
// ---------------------------------------------------------------------------

/** `data/corridas/<corridaBase>/brief.md` tiene que existir: sin brief no se edita nada. */
export function chequearBriefExiste(rootDir: string, corridaBase: string): ChequeoPrevio {
  const ruta = path.join(carpetaCorrida(rootDir, corridaBase), 'brief.md');
  return existsSync(ruta) ? { ok: true } : { ok: false, motivo: `falta data/corridas/${corridaBase}/brief.md: no se edita nada que no tenga brief registrado.` };
}

/**
 * Con `--lote`, la carpeta de trabajo es `data/corridas/<corridaBase>-<lote>/` y el brief se
 * copia ahí una sola vez (si ya existe, es porque un `antes` anterior ya lo hizo: no se pisa).
 * Sin `--lote`, la carpeta de trabajo es la de la corrida misma.
 */
export function prepararCarpetaDeLote(rootDir: string, corridaBase: string, lote?: string): { corridaId: string; corridaDir: string; briefCopiado: boolean } {
  if (!lote) return { corridaId: corridaBase, corridaDir: carpetaCorrida(rootDir, corridaBase), briefCopiado: false };
  const corridaId = `${corridaBase}-${lote}`;
  const corridaDir = carpetaCorrida(rootDir, corridaId);
  mkdirSync(corridaDir, { recursive: true });
  const briefLote = path.join(corridaDir, 'brief.md');
  let briefCopiado = false;
  if (!existsSync(briefLote)) {
    copyFileSync(path.join(carpetaCorrida(rootDir, corridaBase), 'brief.md'), briefLote);
    briefCopiado = true;
  }
  return { corridaId, corridaDir, briefCopiado };
}

/**
 * El brief de `corridaId` no cambió desde que se promovió algo con él. `agentes.json` no guarda
 * el hash del brief (solo el de CLAUDE.md, los roles y `docs/colecciones/`): la referencia
 * autoritativa es `procedencia.brief_sha` de cada registro ya publicado con esta corrida, la
 * misma comparación que hace `pnpm auditar` (verificación 3) después de publicado. Acá se hace
 * antes, para no dejar seguir editando sobre un brief que ya no es el que se prometió.
 */
export function chequearBriefNoCambio(rootDir: string, corridaId: string): ChequeoPrevio {
  const corridaDir = carpetaCorrida(rootDir, corridaId);
  const briefActual = hashDelBrief(corridaDir);
  if (!briefActual) return { ok: true }; // sin brief.md todavía: lo reporta chequearBriefExiste
  let contenido;
  try {
    contenido = cargarContenido(rootDir);
  } catch (e) {
    return { ok: false, motivo: `no se pudo leer content/ para comparar el brief: ${(e as Error).message}` };
  }
  for (const r of contenido.registros) {
    const p = r.datos?.procedencia as Record<string, unknown> | undefined;
    if (!p || p.tipo === 'correccion' || p.corrida !== corridaId || !p.brief_sha) continue;
    if (p.brief_sha !== briefActual) {
      return {
        ok: false,
        motivo:
          `data/corridas/${corridaId}/brief.md cambió después de promover: ${r.archivo} quedó con brief_sha ` +
          `${String(p.brief_sha).slice(0, 12)}…, y el brief de ahora hashea ${briefActual.slice(0, 12)}….`,
      };
    }
  }
  return { ok: true };
}

export interface ColisionSlug {
  coleccion: NombreColeccion;
  id: string;
  destino: string;
  origen: string;
}

/**
 * Ids que el lote del inbox derivaría (misma derivación que `promover`: `derivarId` de
 * `scripts/lib/inbox.ts`, que ya la exporta) y que ya existen en `content/`. `promover` aborta
 * el lote entero si encuentra una de estas, así que conviene saberlo antes de lanzar al crítico
 * y al editor, no después de que ya trabajaron sobre el lote.
 */
export function colisionesDeSlug(rootDir: string, inboxDir: string): ColisionSlug[] {
  const archivos = leerArchivosInbox(inboxDir);
  const usados = new Set<string>();
  const colisiones: ColisionSlug[] = [];
  for (const archivo of archivos) {
    archivo.items.forEach((item, n) => {
      if (!item || typeof item !== 'object' || Array.isArray(item)) return;
      // Una hipótesis no se promueve (va a hipotesis/, privado): tampoco puede colisionar.
      if ((item.revision as Record<string, unknown> | undefined)?.tier === 'hipotesis') return;
      const id = derivarId(archivo.coleccion, item, usados);
      const def = definicionDeColeccion(archivo.coleccion);
      const destinoRel = `${def.carpeta}/${id}.${def.extension}`;
      if (existsSync(path.join(rootDir, ...destinoRel.split('/')))) {
        colisiones.push({ coleccion: archivo.coleccion, id, destino: destinoRel, origen: `${archivo.nombre}#${n}` });
      }
    });
  }
  return colisiones;
}

/** true si ya hay una foto congelada del crudo de esta corrida: no hay que congelar de nuevo. */
export function crudoYaCongelado(rootDir: string, corridaId: string): boolean {
  return existsSync(path.join(carpetaCorrida(rootDir, corridaId), 'crudo'));
}

// ---------------------------------------------------------------------------
// Prechequeos de "despues"
// ---------------------------------------------------------------------------

/**
 * Proxy barato (comparación de bytes, sin normalizar por esquema) de si `edicion.diff` va a
 * salir vacío cuando corra `promover`: alcanza para decidir si hace falta `razones.md` antes de
 * pagar el costo de `validar --red` y de `promover` mismo. La comparación autoritativa —contra el
 * registro normalizado, no contra el YAML crudo— la sigue haciendo `promover` (sección 5), que es
 * quien realmente bloquea si falta.
 */
export function diffProbablementeNoVacio(inboxDir: string, corridaDir: string): boolean {
  const crudoDir = path.join(corridaDir, 'crudo');
  if (!existsSync(crudoDir)) return true;
  for (const nombre of readdirSync(inboxDir)) {
    if (!/\.ya?ml$/i.test(nombre)) continue;
    const archivoCrudo = path.join(crudoDir, nombre);
    if (!existsSync(archivoCrudo)) return true;
    if (readFileSync(path.join(inboxDir, nombre), 'utf8') !== readFileSync(archivoCrudo, 'utf8')) return true;
  }
  return false;
}

/**
 * Modelo del investigador para `promover --modelo`, cuando no viene por `--modelo`:
 *   1. `agentes.json` de la corrida (`agentes.investigador.modelo`), si ya se promovió algo.
 *   2. `pnpm agentes --json`: NO filtra por corrida (scripts/agentes.ts reporta lanzamientos de
 *      `Agent` de la sesión actual de Claude Code, sin ningún campo que los ligue a un id de
 *      corrida), así que no hay de dónde derivarlo ahí sin adivinar. Se salta directo al error.
 */
export function resolverModeloInvestigador(corridaDir: string, modeloFlag?: string): { modelo?: string; motivo?: string } {
  if (modeloFlag) return { modelo: modeloFlag };
  const modelo = leerAgentesJson(corridaDir)?.agentes?.investigador?.modelo;
  if (modelo) return { modelo };
  return {
    motivo:
      'falta --modelo: agentes.json de la corrida no tiene agentes.investigador.modelo (¿primera promoción de este lote?), ' +
      'y pnpm agentes --json no permite filtrar por corrida. Pasá --modelo <id> a mano.',
  };
}

// ---------------------------------------------------------------------------
// antes
// ---------------------------------------------------------------------------

export async function antes(inboxDirArg: string, opciones: { rootDir?: string; corrida?: string; lote?: string } = {}): Promise<ResultadoMitad> {
  const rootDir = path.resolve(opciones.rootDir ?? RAIZ);
  const inboxDir = path.resolve(inboxDirArg);
  const lineas: string[] = [];
  const paso = (nombre: string, ok: boolean, motivo?: string): boolean => {
    lineas.push(ok ? `✔ ${nombre}${motivo ? ` — ${motivo}` : ''}` : `✘ ${nombre}: ${motivo ?? 'fallo'}`);
    return ok;
  };

  if (!existsSync(inboxDir)) {
    paso('carpeta del inbox', false, `no existe: ${inboxDirArg}`);
    return { codigo: 2, lineas };
  }

  const corridaBase = opciones.corrida ?? idCorridaDesdeInbox(inboxDir) ?? undefined;
  if (!corridaBase) {
    paso('id de corrida', false, `no se pudo derivar de "${inboxDirArg}"; pasalo con --corrida <YYYY-MM-DD>-<politico>-<tema>.`);
    return { codigo: 2, lineas };
  }
  if (!PATRON_ID_CORRIDA.test(corridaBase)) {
    paso('id de corrida', false, `"${corridaBase}" no cumple <YYYY-MM-DD>-<politico>-<tema>.`);
    return { codigo: 2, lineas };
  }
  if (opciones.lote && !PATRON_LOTE.test(opciones.lote)) {
    paso('--lote', false, `"${opciones.lote}" tiene que ser minúsculas y guiones, como el resto de un id de corrida.`);
    return { codigo: 2, lineas };
  }

  const chequeoBrief = chequearBriefExiste(rootDir, corridaBase);
  if (!paso('brief.md existe', chequeoBrief.ok, chequeoBrief.motivo)) {
    return { codigo: 2, lineas };
  }

  const { corridaId, corridaDir, briefCopiado } = prepararCarpetaDeLote(rootDir, corridaBase, opciones.lote);
  if (opciones.lote) paso(`carpeta del lote (data/corridas/${corridaId}/)`, true, briefCopiado ? 'brief copiado' : 'ya existía');

  const chequeoCambio = chequearBriefNoCambio(rootDir, corridaId);
  if (!paso('brief sin cambios desde que se promovió', chequeoCambio.ok, chequeoCambio.motivo)) {
    return { codigo: 1, lineas };
  }

  const colisiones = colisionesDeSlug(rootDir, inboxDir);
  if (colisiones.length) {
    paso(
      'sin colisión de _slug',
      false,
      `${colisiones.length} id(s) ya existen en content/: ${colisiones
        .slice(0, 5)
        .map((c) => `${c.coleccion}/${c.id}`)
        .join(', ')}${colisiones.length > 5 ? '…' : ''}`,
    );
    return { codigo: 1, lineas };
  }
  paso('sin colisión de _slug', true);

  // 1. Validar el crudo.
  const resValidar = await validar({ rootDir, inboxDir });
  if (resValidar.codigo !== 0) {
    paso('validar --inbox --breve', false, `${resValidar.errores.length} error(es)`);
    lineas.push(...lineasBreve(resValidar.errores));
    if (resValidar.infraestructura) lineas.push(`infraestructura: ${resValidar.infraestructura}`);
    return { codigo: resValidar.codigo, lineas };
  }
  paso('validar --inbox --breve', true, `${resValidar.registros} registro(s), 0 error(es)`);

  // 1b. Congelar el crudo, salvo que ya esté congelado (el editor puede haber pasado ya).
  if (crudoYaCongelado(rootDir, corridaId)) {
    paso('congelar crudo/', true, 'ya estaba (no se pisa)');
  } else {
    try {
      const r = promover(inboxDir, { rootDir, corrida: corridaId, soloCrudo: true });
      paso('congelar crudo/', true, r.artefactos.join(', ') || 'sin archivos nuevos');
    } catch (e) {
      paso('congelar crudo/', false, (e as Error).message);
      return { codigo: 2, lineas };
    }
  }

  const dirRel = aPosix(path.relative(rootDir, inboxDir));
  lineas.push('');
  lineas.push('Lanzar ahora:');
  lineas.push(`  1. critico → carpeta ${dirRel}, destino data/corridas/${corridaId}/critica.md`);
  lineas.push(`     (esperar; contar bloqueos: grep -c "severidad: bloquea" data/corridas/${corridaId}/critica.md)`);
  lineas.push('  2. Después, editor (subagent_type: editor) con el prompt:');
  lineas.push(`     Carpeta: ${dirRel}`);
  lineas.push(`     Corrida: ${corridaId}`);
  lineas.push(`     Crítica: data/corridas/${corridaId}/critica.md`);
  lineas.push('     Correcciones de forma ya hechas en el paso 1: ninguna');
  lineas.push('     Registros que no pasaron validar por falta de cita o fuente: ninguno');
  lineas.push('     Chequeos que volvieron de un corrector: ninguno');

  return { codigo: 0, lineas };
}

// ---------------------------------------------------------------------------
// despues
// ---------------------------------------------------------------------------

export async function despues(
  inboxDirArg: string,
  opciones: { rootDir?: string; corrida?: string; modelo?: string; sinArchivar?: boolean; sinBuild?: boolean } = {},
): Promise<ResultadoMitad> {
  const rootDir = path.resolve(opciones.rootDir ?? RAIZ);
  const inboxDir = path.resolve(inboxDirArg);
  const lineas: string[] = [];
  const paso = (nombre: string, ok: boolean, motivo?: string): boolean => {
    lineas.push(ok ? `✔ ${nombre}${motivo ? ` — ${motivo}` : ''}` : `✘ ${nombre}: ${motivo ?? 'fallo'}`);
    return ok;
  };

  if (!existsSync(inboxDir)) {
    paso('carpeta del inbox', false, `no existe: ${inboxDirArg}`);
    return { codigo: 2, lineas };
  }
  const corrida = opciones.corrida ?? idCorridaDesdeInbox(inboxDir) ?? undefined;
  if (!corrida) {
    paso('id de corrida', false, `no se pudo derivar de "${inboxDirArg}"; pasalo con --corrida <id>.`);
    return { codigo: 2, lineas };
  }
  const corridaDir = carpetaCorrida(rootDir, corrida);

  // a. critica.md y (si el editor tocó el crudo) razones.md.
  if (!paso('critica.md existe', existsSync(path.join(corridaDir, 'critica.md')), `falta data/corridas/${corrida}/critica.md`)) {
    return { codigo: 1, lineas };
  }
  if (diffProbablementeNoVacio(inboxDir, corridaDir)) {
    const razonesPath = path.join(corridaDir, 'razones.md');
    const hayRazones = existsSync(razonesPath) && readFileSync(razonesPath, 'utf8').trim() !== '';
    if (!paso('razones.md (el editor tocó el crudo)', hayRazones, `falta data/corridas/${corrida}/razones.md con una línea por cada cambio no trivial`)) {
      return { codigo: 1, lineas };
    }
  } else {
    paso('razones.md', true, 'no hace falta: el editor no tocó el crudo');
  }

  // b. Validar con red antes de promover.
  const resInbox = await validar({ rootDir, inboxDir, red: true });
  if (resInbox.codigo !== 0) {
    paso('validar --inbox --red --breve', false, `${resInbox.errores.length} error(es)`);
    lineas.push(...lineasBreve(resInbox.errores));
    if (resInbox.infraestructura) lineas.push(`infraestructura: ${resInbox.infraestructura}`);
    return { codigo: resInbox.codigo, lineas };
  }
  paso('validar --inbox --red --breve', true, `${resInbox.registros} registro(s)`);

  // c. Promover.
  const { modelo, motivo: motivoModelo } = resolverModeloInvestigador(corridaDir, opciones.modelo);
  if (!modelo) {
    paso('modelo del investigador', false, motivoModelo);
    return { codigo: 2, lineas };
  }
  let resProm;
  try {
    resProm = promover(inboxDir, { rootDir, corrida, modelo });
  } catch (e) {
    paso('promover', false, (e as Error).message);
    return { codigo: 2, lineas };
  }
  if (resProm.errores.length) {
    paso('promover', false, `${resProm.errores.length} problema(s)`);
    for (const e of resProm.errores) lineas.push(`  ${e.archivo} · ${e.campo}: ${e.mensaje}`);
    return { codigo: 1, lineas };
  }
  paso('promover', true, `${resProm.promovidos.length} registro(s)`);

  // d. Archivar (Wayback).
  if (opciones.sinArchivar) {
    paso('archivar', true, 'omitido (--sin-archivar)');
  } else {
    try {
      const resArch = await archivarTodo({ rootDir });
      paso('archivar', true, `${resArch.archivadas}/${resArch.intentadas} archivada(s), ${resArch.fallidas.length} sin archivo`);
    } catch (e) {
      paso('archivar', false, (e as Error).message);
      return { codigo: 2, lineas };
    }
  }

  // e. Validar con red todo el contenido.
  const resTodo = await validar({ rootDir, red: true });
  if (resTodo.codigo !== 0) {
    paso('validar --red --breve', false, `${resTodo.errores.length} error(es)`);
    lineas.push(...lineasBreve(resTodo.errores));
    if (resTodo.infraestructura) lineas.push(`infraestructura: ${resTodo.infraestructura}`);
    return { codigo: resTodo.codigo, lineas };
  }
  paso('validar --red --breve', true, `${resTodo.registros} registro(s)`);

  // f. Build.
  if (opciones.sinBuild) {
    paso('build', true, 'omitido (--sin-build)');
  } else {
    const cacheDir = path.join(rootDir, '.cache');
    mkdirSync(cacheDir, { recursive: true });
    const logPath = path.join(cacheDir, `revisar-${corrida}.log`);
    const logRel = aPosix(path.relative(rootDir, logPath));
    const pnpmBin = buscarEjecutable('pnpm') ?? 'pnpm';
    const r = ejecutarSync(pnpmBin, ['build'], { cwd: rootDir, timeoutMs: 10 * 60 * 1000 });
    writeFileSync(logPath, `$ pnpm build\n\n--- stdout ---\n${r.stdout}\n--- stderr ---\n${r.stderr}\n\nsalida: ${r.codigo}\n`, 'utf8');
    if (r.codigo !== 0) {
      paso('build', false, `código ${r.codigo}; log completo en ${logRel}`);
      const cola = (r.stdout + '\n' + r.stderr).trim().split(/\r?\n/).filter(Boolean).slice(-12);
      lineas.push(...cola);
      // -1: spawnSync no pudo ni arrancar el proceso (pnpm ausente, timeout): infraestructura.
      // Cualquier otro código distinto de 0 es astro build / exportar / revisar:paginas fallando
      // sobre contenido real: es lo que tiene que corregir el corrector, no el entorno.
      return { codigo: r.codigo === -1 ? 2 : 1, lineas };
    }
    paso('build', true, `código 0; log en ${logRel}`);
  }

  // g. Resumen de lo promovido y de lo que quedó en probable.
  let contenido;
  try {
    contenido = cargarContenido(rootDir);
  } catch (e) {
    paso('leer content/ para el resumen', false, (e as Error).message);
    return { codigo: 2, lineas };
  }
  const grupoPorMedio = new Map(contenido.de('medios').map((m) => [m.id, String(m.datos.grupo ?? '')]));
  const probablesPorColeccion = new Map<string, Set<string>>();
  for (const r of contenido.registros) {
    if (r.datos?.revision?.tier !== 'probable') continue;
    if (!probablesPorColeccion.has(r.coleccion)) probablesPorColeccion.set(r.coleccion, new Set());
    probablesPorColeccion.get(r.coleccion)!.add(r.id);
  }
  const porTier = new Map<string, number>();
  const enProbable: string[] = [];
  for (const p of resProm.promovidos) {
    const reg = contenido.obtener(p.coleccion, p.id);
    const tier = String(reg?.datos?.revision?.tier ?? 'sin-tier');
    const clave = `${p.coleccion} · ${tier}`;
    porTier.set(clave, (porTier.get(clave) ?? 0) + 1);
    if (tier === 'probable' && reg) {
      const motivos = motivosProbable(p.coleccion, reg.datos, grupoPorMedio, probablesPorColeccion);
      enProbable.push(`  ${p.coleccion}/${p.id}: ${motivos.map((m) => m.texto).join(' ')}`);
    }
  }
  lineas.push('');
  lineas.push('Promovidos:');
  for (const [clave, n] of [...porTier.entries()].sort()) lineas.push(`  ${clave}: ${n}`);
  if (enProbable.length) {
    lineas.push('En probable:');
    lineas.push(...enProbable.slice(0, 8));
    if (enProbable.length > 8) lineas.push(`  … y ${enProbable.length - 8} más (pnpm lote ver, o la página /probable/).`);
  }

  // h. Mensaje de commit propuesto.
  const partes = aPosix(path.relative(rootDir, inboxDir)).split('/');
  const iInbox = partes.indexOf('inbox');
  const politico = iInbox >= 0 ? partes[iInbox + 1] : partes[0];
  const tema = iInbox >= 0 ? partes.slice(iInbox + 2, -1).join('/') : '';
  lineas.push('');
  lineas.push(`Commit sugerido (completá <resumen> con el hallazgo): <resumen> de ${politico}${tema ? ` — ${tema}` : ''} [corrida ${corrida}]`);

  return { codigo: 0, lineas };
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const AYUDA = `pnpm revisar <inbox-dir> antes|despues [opciones]

antes [--corrida <id>] [--lote <nombre>]
  Prechequeos + validar --inbox --breve + congelar crudo/. Termina diciendo qué lanzar.

despues [--corrida <id>] [--modelo <id>] [--sin-archivar] [--sin-build]
  critica.md/razones.md + validar --inbox --red --breve + promover + archivar +
  validar --red --breve + build + resumen de lo promovido. No commitea.

Salidas: 0 ok · 1 fallo de contenido (con la lista) · 2 fallo de infraestructura.`;

async function main(): Promise<void> {
  const { posicionales, opciones } = parsearArgs(process.argv.slice(2));
  const [inboxDir, mitad] = posicionales;
  if (opciones.ayuda || opciones.help) {
    console.log(AYUDA);
    process.exit(0);
  }
  if (!inboxDir || (mitad !== 'antes' && mitad !== 'despues')) {
    console.log(AYUDA);
    process.exit(2);
  }

  const corrida = typeof opciones.corrida === 'string' ? opciones.corrida : undefined;
  const resultado =
    mitad === 'antes'
      ? await antes(inboxDir, { corrida, lote: typeof opciones.lote === 'string' ? opciones.lote : undefined })
      : await despues(inboxDir, {
          corrida,
          modelo: typeof opciones.modelo === 'string' ? opciones.modelo : undefined,
          sinArchivar: opciones['sin-archivar'] === true,
          sinBuild: opciones['sin-build'] === true,
        });

  for (const linea of resultado.lineas) console.log(linea);
  process.exit(resultado.codigo);
}

const esEntrada = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (esEntrada) {
  main().catch((e) => {
    log.error((e as Error).stack ?? (e as Error).message);
    process.exit(2);
  });
}
