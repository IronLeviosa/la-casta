/**
 * `pnpm auditar [--red] [--muestra N] [--semilla S] [--json]`
 *
 * Parte mecánica de la auditoría por terceros descrita en `AUDITORIA.md` y en
 * `.claude/commands/auditar.md`. Pensado para correrse sobre un clon limpio, sin
 * contexto previo y sin acceso al corpus privado.
 *
 *   1. procedencia    todo registro tiene corrida (o corrección) y la corrida existe
 *   2. artefactos     las corridas tienen sus siete artefactos
 *   3. hashes         agentes.json vs. `git show <commit>:<archivo>`; agente_sha y brief_sha
 *   4. diffs          edicion.diff no vacío ⇒ razones.md; se marcan los cambios sensibles
 *   5. simetria       cobertura y severidad por partido y por político
 *   6. instrucciones  menciones de partidos y personas en CLAUDE.md, agentes, comandos y briefs
 *   7. citas (--red)  muestra aleatoria re-verificada contra la fuente
 *
 * Las verificaciones 4 y 6 imprimen lo que hay que leer: decidir si un cambio
 * está explicado o si una instrucción es asimétrica es trabajo de una persona
 * (o del comando `/auditar`), no de un grep.
 */
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';
import { cargarContenido, construirContenido, COLECCIONES_REFERENCIA, type Contenido, type Registro } from './lib/contenido.ts';
import { archivosDeInstrucciones, carpetaCorrida, hashDelBrief, leerAgentesJson, listarCorridas, verificarArtefactos } from './lib/corridas.ts';
import { sha256 } from './lib/hash.ts';
import { git, tieneCommits } from './lib/git.ts';
import { log, parsearArgs } from './lib/log.ts';
import { RAIZ, RUTAS_CONTENIDO } from './lib/rutas.ts';
import { calcularSimetria, informeSimetria, tabla, type ResumenSimetria } from './validadores/simetria.ts';
import { validarCitas, type OpcionesCitas } from './validadores/citas.ts';

/** Campos donde un cambio sin razón escrita es el hallazgo más grave posible. */
export const CAMPOS_SENSIBLES = ['cita', 'cambio', 'explicacion', 'calificacion', 'estado', 'tier', 'etiqueta_legal', 'nivel'];

export interface Hallazgo {
  /** Dónde está: archivo, corrida o registro. */
  donde: string;
  detalle: string;
}

export interface Verificacion {
  numero: number;
  nombre: string;
  /** pasa: cero hallazgos · observaciones: hay algo que leer · falla: hallazgo duro. */
  veredicto: 'pasa' | 'observaciones' | 'falla';
  resumen: string;
  hallazgos: Hallazgo[];
}

export interface InformeAuditoria {
  commit: string | null;
  fecha: string;
  registros: number;
  corridas: string[];
  verificaciones: Verificacion[];
  simetria: ResumenSimetria;
  /** Semilla usada para la muestra de citas (repetible). */
  semilla: number;
  ok: boolean;
}

export interface OpcionesAuditar {
  rootDir?: string;
  red?: boolean;
  muestra?: number;
  semilla?: number;
  citas?: Pick<OpcionesCitas, 'obtenerTexto' | 'obtenerTranscripcion' | 'sinCache'>;
  progreso?: (mensaje: string) => void;
}

/** PRNG determinista (mulberry32): con la misma semilla, la misma muestra. */
function generador(semilla: number): () => number {
  let a = semilla >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function mezclar<T>(items: T[], aleatorio: () => number): T[] {
  const copia = [...items];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(aleatorio() * (i + 1));
    [copia[i], copia[j]] = [copia[j]!, copia[i]!];
  }
  return copia;
}

function veredicto(hallazgos: Hallazgo[], duros: boolean): Verificacion['veredicto'] {
  if (!hallazgos.length) return 'pasa';
  return duros ? 'falla' : 'observaciones';
}

// ---------------------------------------------------------------------------
// 1 y 2. Procedencia y artefactos
// ---------------------------------------------------------------------------

function auditarProcedencia(contenido: Contenido, rootDir: string): { procedencia: Verificacion; artefactos: Verificacion; corridasUsadas: Set<string> } {
  const sinProcedencia: Hallazgo[] = [];
  const corridasUsadas = new Set<string>();
  let conCorreccion = 0;

  for (const reg of contenido.registros) {
    if (COLECCIONES_REFERENCIA.has(reg.coleccion)) continue;
    const p = reg.datos.procedencia;
    if (!p) {
      sinProcedencia.push({ donde: reg.archivo, detalle: 'sin bloque procedencia.' });
      continue;
    }
    if (p.tipo === 'correccion') {
      conCorreccion++;
      if (!contenido.obtener('correcciones', p.correccion)) {
        sinProcedencia.push({ donde: reg.archivo, detalle: `procedencia.tipo: correccion apunta a "${p.correccion}", que no existe en content/correcciones/.` });
      }
      continue;
    }
    corridasUsadas.add(p.corrida);
    if (!existsSync(carpetaCorrida(rootDir, p.corrida))) {
      sinProcedencia.push({ donde: reg.archivo, detalle: `la corrida "${p.corrida}" no existe en data/corridas/.` });
    }
  }

  const faltantes: Hallazgo[] = [];
  for (const id of listarCorridas(rootDir)) {
    const est = verificarArtefactos(carpetaCorrida(rootDir, id));
    if (est.faltantes.length) faltantes.push({ donde: `data/corridas/${id}/`, detalle: `faltan: ${est.faltantes.join(', ')}.` });
  }

  const conProcedencia = contenido.registros.filter((r) => !COLECCIONES_REFERENCIA.has(r.coleccion)).length;
  return {
    corridasUsadas,
    procedencia: {
      numero: 1,
      nombre: 'Procedencia',
      veredicto: veredicto(sinProcedencia, true),
      resumen: `${conProcedencia - sinProcedencia.length}/${conProcedencia} registro(s) con cadena completa (${conCorreccion} por corrección, ${corridasUsadas.size} corrida(s) referenciadas).`,
      hallazgos: sinProcedencia,
    },
    artefactos: {
      numero: 2,
      nombre: 'Artefactos de corrida',
      veredicto: veredicto(faltantes, true),
      resumen: `${listarCorridas(rootDir).length} corrida(s) en data/corridas/.`,
      hallazgos: faltantes,
    },
  };
}

// ---------------------------------------------------------------------------
// 3. Hashes de instrucciones
// ---------------------------------------------------------------------------

/** Commit que introdujo la corrida (el primero que tocó su carpeta). */
function commitDeCorrida(rootDir: string, id: string): string | null {
  if (!tieneCommits(rootDir)) return null;
  const r = git(['log', '--reverse', '--format=%H', '--', `data/corridas/${id}`], rootDir);
  if (!r.ok || !r.stdout) return null;
  return r.stdout.split(/\r?\n/)[0] ?? null;
}

function hashEnCommit(rootDir: string, commit: string, archivo: string): string | null {
  const r = git(['show', `${commit}:${archivo}`], rootDir);
  if (!r.ok) return null;
  // git() recorta la salida; para el hash hay que leer el blob tal cual.
  const crudo = git(['cat-file', '-p', `${commit}:${archivo}`], rootDir);
  return crudo.ok ? sha256(crudo.stdout) : null;
}

function auditarHashes(contenido: Contenido, rootDir: string): Verificacion {
  const hallazgos: Hallazgo[] = [];
  const corridas = listarCorridas(rootDir);
  const hayGit = tieneCommits(rootDir);
  let comparadosContraGit = 0;

  for (const id of corridas) {
    const dir = carpetaCorrida(rootDir, id);
    const agentes = leerAgentesJson(dir);
    if (!agentes) {
      hallazgos.push({ donde: `data/corridas/${id}/agentes.json`, detalle: 'no existe o no es JSON válido.' });
      continue;
    }
    const commit = agentes.commit ?? commitDeCorrida(rootDir, id);
    if (hayGit && commit) {
      for (const [archivo, hashGuardado] of Object.entries(agentes.archivos ?? {})) {
        const enGit = hashEnCommit(rootDir, commit, archivo);
        if (enGit === null) {
          hallazgos.push({ donde: `data/corridas/${id}`, detalle: `no se pudo leer ${archivo} en el commit ${commit.slice(0, 8)} (¿archivo agregado después?).` });
          continue;
        }
        comparadosContraGit++;
        if (enGit !== hashGuardado) {
          hallazgos.push({
            donde: `data/corridas/${id}/agentes.json`,
            detalle: `${archivo}: agentes.json dice ${hashGuardado.slice(0, 12)}… y en el commit ${commit.slice(0, 8)} es ${enGit.slice(0, 12)}….`,
          });
        }
      }
    }
  }

  // procedencia.agente_sha y brief_sha de cada registro contra su corrida.
  for (const reg of contenido.registros) {
    const p = reg.datos.procedencia;
    if (!p || p.tipo === 'correccion') continue;
    const dir = carpetaCorrida(rootDir, p.corrida);
    if (!existsSync(dir)) continue;
    const brief = hashDelBrief(dir);
    if (brief && brief !== p.brief_sha) {
      hallazgos.push({ donde: reg.archivo, detalle: `brief_sha ${String(p.brief_sha).slice(0, 12)}… ≠ SHA-256 de data/corridas/${p.corrida}/brief.md (${brief.slice(0, 12)}…).` });
    }
    const agentes = leerAgentesJson(dir);
    const ag = agentes?.agentes?.[p.agente];
    if (agentes && !ag) {
      hallazgos.push({ donde: reg.archivo, detalle: `el agente "${p.agente}" no figura en agentes.json de la corrida ${p.corrida}.` });
    } else if (ag && ag.sha256 !== p.agente_sha) {
      hallazgos.push({ donde: reg.archivo, detalle: `agente_sha ${String(p.agente_sha).slice(0, 12)}… ≠ hash de ${ag.archivo} en agentes.json (${ag.sha256.slice(0, 12)}…).` });
    }
  }

  const nota = hayGit ? `${comparadosContraGit} hash(es) recalculados desde git` : 'el clon todavía no tiene commits: no se pudo recalcular contra git';
  return {
    numero: 3,
    nombre: 'Hashes de instrucciones',
    veredicto: veredicto(hallazgos, true),
    resumen: `${corridas.length} corrida(s); ${nota}.`,
    hallazgos,
  };
}

// ---------------------------------------------------------------------------
// 4. Diffs explicados
// ---------------------------------------------------------------------------

function auditarDiffs(rootDir: string): Verificacion {
  const hallazgos: Hallazgo[] = [];
  let conDiff = 0;
  let hunks = 0;

  for (const id of listarCorridas(rootDir)) {
    const dir = carpetaCorrida(rootDir, id);
    const rutaDiff = path.join(dir, 'edicion.diff');
    if (!existsSync(rutaDiff)) continue;
    const diff = readFileSync(rutaDiff, 'utf8');
    if (!diff.trim()) continue;
    conDiff++;
    const lineas = diff.split(/\r?\n/);
    const propios = lineas.filter((l) => l.startsWith('@@')).length;
    hunks += propios;

    const rutaRazones = path.join(dir, 'razones.md');
    const razones = existsSync(rutaRazones) ? readFileSync(rutaRazones, 'utf8').trim() : '';
    const critica = existsSync(path.join(dir, 'critica.md')) ? readFileSync(path.join(dir, 'critica.md'), 'utf8').trim() : '';
    if (!razones) {
      hallazgos.push({ donde: `data/corridas/${id}`, detalle: `edicion.diff tiene ${propios} bloque(s) de cambios y razones.md está vacío o no existe.` });
    }

    // Cambios en campos sensibles: hay que leerlos uno por uno.
    const sensibles = lineas.filter((l) => /^[-+]/.test(l) && !/^[-+][-+]/.test(l) && CAMPOS_SENSIBLES.some((c) => new RegExp(`(^|\\s)${c}:`).test(l)));
    if (sensibles.length) {
      hallazgos.push({
        donde: `data/corridas/${id}/edicion.diff`,
        detalle: `${sensibles.length} línea(s) cambian campos sensibles (${CAMPOS_SENSIBLES.join(', ')}); hay que leer razones.md (${razones.length} caracteres) y critica.md (${critica.length}) para confirmar que están explicadas.`,
      });
    }
  }

  return {
    numero: 4,
    nombre: 'Diffs explicados',
    veredicto: hallazgos.some((h) => h.detalle.includes('razones.md está vacío')) ? 'falla' : veredicto(hallazgos, false),
    resumen: `${conDiff} corrida(s) con edicion.diff no vacío, ${hunks} bloque(s) de cambio.`,
    hallazgos,
  };
}

// ---------------------------------------------------------------------------
// 6. Instrucciones asimétricas
// ---------------------------------------------------------------------------

/** Nombres a buscar: partidos de data/alias.yaml + alias de content/politicos. */
export function nombresVigilados(rootDir: string, contenido: Contenido): string[] {
  const nombres = new Set<string>();
  const alias = path.join(rootDir, 'data', 'alias.yaml');
  if (existsSync(alias)) {
    try {
      const datos = parseYaml(readFileSync(alias, 'utf8')) as { partidos?: { nombre?: string; sigla?: string; alias?: string[] }[] };
      for (const p of datos?.partidos ?? []) {
        if (p.nombre) nombres.add(p.nombre);
        for (const a of p.alias ?? []) if (a.length > 3) nombres.add(a);
      }
    } catch {
      /* alias.yaml roto: lo reporta el validador del corpus */
    }
  }
  for (const p of contenido.de('politicos')) {
    for (const a of (p.datos.alias ?? []) as string[]) if (a.length > 3) nombres.add(a);
    if (p.datos.nombre_corto) nombres.add(String(p.datos.nombre_corto));
  }
  return [...nombres].sort((a, b) => b.length - a.length);
}

function archivosDeInstruccionesYBriefs(rootDir: string): string[] {
  const salida = archivosDeInstrucciones(rootDir);
  for (const id of listarCorridas(rootDir)) {
    const rel = `data/corridas/${id}/brief.md`;
    if (existsSync(path.join(rootDir, ...rel.split('/')))) salida.push(rel);
  }
  return salida;
}

function auditarInstrucciones(rootDir: string, contenido: Contenido): Verificacion {
  const nombres = nombresVigilados(rootDir, contenido);
  const hallazgos: Hallazgo[] = [];
  const archivos = archivosDeInstruccionesYBriefs(rootDir);
  let lineasConNombre = 0;

  for (const rel of archivos) {
    const texto = readFileSync(path.join(rootDir, ...rel.split('/')), 'utf8');
    texto.split(/\r?\n/).forEach((linea, i) => {
      const encontrados = nombres.filter((n) => new RegExp(`(?<![\\p{L}])${n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\p{L}])`, 'iu').test(linea));
      if (!encontrados.length) return;
      lineasConNombre++;
      hallazgos.push({ donde: `${rel}:${i + 1}`, detalle: `${encontrados.slice(0, 3).join(', ')} — ${linea.trim().slice(0, 160)}` });
    });
  }

  return {
    numero: 6,
    nombre: 'Instrucciones que nombran partidos o personas',
    veredicto: hallazgos.length ? 'observaciones' : 'pasa',
    resumen: `${lineasConNombre} línea(s) en ${archivos.length} archivo(s) de instrucciones nombran a un partido o persona. Nombrar no es asimetría: pedir un tratamiento distinto sí. Hay que leerlas en contexto.`,
    hallazgos,
  };
}

// ---------------------------------------------------------------------------
// 7. Muestra de citas (--red)
// ---------------------------------------------------------------------------

async function auditarCitas(contenido: Contenido, opciones: OpcionesAuditar, semilla: number): Promise<Verificacion> {
  const muestra = opciones.muestra ?? 20;
  const candidatos = contenido.registros.filter((r) => !COLECCIONES_REFERENCIA.has(r.coleccion) && r.datos.revision?.tier === 'publicado');
  const elegidos: Registro[] = mezclar(candidatos, generador(semilla)).slice(0, muestra);
  if (!elegidos.length) {
    return { numero: 7, nombre: 'Muestra de citas', veredicto: 'pasa', resumen: 'No hay registros publicados para muestrear.', hallazgos: [] };
  }
  const sub = construirContenido(contenido.rootDir, elegidos, [], elegidos.length);
  const r = await validarCitas(sub, { sinCache: true, progreso: opciones.progreso, ...opciones.citas });
  const hallazgos: Hallazgo[] = [...r.errores, ...r.avisos].map((p) => ({ donde: `${p.archivo} · ${p.campo}`, detalle: p.mensaje }));
  return {
    numero: 7,
    nombre: 'Muestra de citas',
    veredicto: r.errores.length ? 'falla' : veredicto(hallazgos, false),
    resumen: `${elegidos.length} registro(s) muestreados (semilla ${semilla}): ${r.exactas} cita(s) exacta(s), ${r.aproximadas} aproximada(s), ${r.errores.length} no encontrada(s)/no descargable(s).`,
    hallazgos,
  };
}

// ---------------------------------------------------------------------------

export async function auditar(opciones: OpcionesAuditar = {}): Promise<InformeAuditoria> {
  const rootDir = path.resolve(opciones.rootDir ?? RAIZ);
  const semilla = opciones.semilla ?? 20260903;
  const contenido = cargarContenido(rootDir);

  const verificaciones: Verificacion[] = [];
  if (contenido.errores.length) {
    verificaciones.push({
      numero: 0,
      nombre: 'Esquema',
      veredicto: 'falla',
      resumen: `${contenido.errores.length} archivo(s) de content/ no pasan su esquema; corré pnpm validar.`,
      hallazgos: contenido.errores.map((e) => ({ donde: `${e.archivo} · ${e.campo}`, detalle: e.mensaje })),
    });
  }

  const { procedencia, artefactos } = auditarProcedencia(contenido, rootDir);
  verificaciones.push(procedencia, artefactos, auditarHashes(contenido, rootDir), auditarDiffs(rootDir));

  const simetria = calcularSimetria(contenido);
  verificaciones.push({
    numero: 5,
    nombre: 'Simetría',
    veredicto: simetria.temas.some((t) => t.sin_cubrir.length) ? 'observaciones' : 'pasa',
    resumen: `${Object.keys(simetria.por_partido).length} partido(s); ${simetria.temas.filter((t) => t.sin_cubrir.length).length} tema(s) con cobertura desigual.`,
    hallazgos: simetria.temas
      .filter((t) => t.sin_cubrir.length)
      .map((t) => ({ donde: `tema ${t.tema}`, detalle: `cubiertos: ${t.cubiertos.join(', ') || 'ninguno'}; con mandato en el período y sin registros: ${t.sin_cubrir.join(', ')}.` })),
  });

  verificaciones.push(auditarInstrucciones(rootDir, contenido));

  if (opciones.red) {
    verificaciones.push(await auditarCitas(contenido, opciones, semilla));
  } else {
    verificaciones.push({
      numero: 7,
      nombre: 'Muestra de citas',
      veredicto: 'observaciones',
      resumen: 'Omitida: corré pnpm auditar --red para re-verificar una muestra de citas contra la fuente.',
      hallazgos: [],
    });
  }

  return {
    commit: tieneCommits(rootDir) ? git(['rev-parse', 'HEAD'], rootDir).stdout || null : null,
    fecha: new Date().toISOString(),
    registros: contenido.registros.length,
    corridas: listarCorridas(rootDir),
    verificaciones: verificaciones.sort((a, b) => a.numero - b.numero),
    simetria,
    semilla,
    ok: verificaciones.every((v) => v.veredicto !== 'falla'),
  };
}

export function informeLegible(informe: InformeAuditoria): string {
  const partes: string[] = [];
  partes.push('Auditoría de La Casta');
  partes.push(`commit: ${informe.commit ?? '(el clon no tiene commits)'}`);
  partes.push(`fecha: ${informe.fecha}`);
  partes.push(`registros: ${informe.registros} · corridas: ${informe.corridas.length}`);
  partes.push('');

  const marca = { pasa: '✔', observaciones: '·', falla: '✘' } as const;
  partes.push(
    tabla(
      ['', 'verificación', 'resumen'],
      informe.verificaciones.map((v) => [marca[v.veredicto], `${v.numero}. ${v.nombre}`, v.resumen]),
    ),
  );

  for (const v of informe.verificaciones) {
    if (!v.hallazgos.length) continue;
    partes.push('');
    partes.push(`${v.numero}. ${v.nombre} — ${v.hallazgos.length} línea(s) para revisar`);
    partes.push(tabla(['dónde', 'qué'], v.hallazgos.slice(0, 200).map((h) => [h.donde, h.detalle.replace(/\s+/g, ' ')])));
    if (v.hallazgos.length > 200) partes.push(`  … y ${v.hallazgos.length - 200} más (usá --json para verlas todas).`);
  }

  partes.push('');
  partes.push(informeSimetria(informe.simetria));
  partes.push('');
  partes.push(
    informe.ok
      ? '✔ Sin hallazgos duros. Las verificaciones 4 y 6 requieren lectura humana: el comando /auditar las hace con Claude.'
      : '✘ Hay hallazgos duros. Cada registro sin cadena de procedencia es una corrección válida: abrí un issue con la plantilla "Corrección".',
  );
  partes.push('');
  partes.push('Límite honesto: esto no prueba que no hubo otra IA. Prueba que cada conclusión tiene prompt público, crudo preservado, diff explicado y copia externa.');
  return partes.join('\n');
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const AYUDA = `pnpm auditar [--red] [--muestra N] [--semilla S] [--json]

Verificaciones mecánicas de AUDITORIA.md sobre este clon.

  --red         re-verifica una muestra de citas contra la fuente (necesita red)
  --muestra N   tamaño de la muestra de citas (por defecto 20)
  --semilla S   semilla de la muestra, para que sea repetible
  --json        informe completo en JSON por stdout

Salidas: 0 sin hallazgos duros · 1 con hallazgos · 2 error de infraestructura.`;

async function main(): Promise<void> {
  const { opciones } = parsearArgs(process.argv.slice(2));
  if (opciones.ayuda || opciones.help) {
    console.log(AYUDA);
    process.exit(0);
  }
  const json = opciones.json === true;
  try {
    const informe = await auditar({
      red: opciones.red === true,
      muestra: typeof opciones.muestra === 'string' ? Number(opciones.muestra) : undefined,
      semilla: typeof opciones.semilla === 'string' ? Number(opciones.semilla) : undefined,
      progreso: json ? undefined : (m) => log.info(m),
    });
    console.log(json ? JSON.stringify(informe, null, 2) : informeLegible(informe));
    process.exit(informe.ok ? 0 : 1);
  } catch (e) {
    log.error(`No se pudo auditar: ${(e as Error).message}`);
    process.exit(2);
  }
}

const esEntrada = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (esEntrada) {
  main().catch((e) => {
    log.error((e as Error).stack ?? (e as Error).message);
    process.exit(2);
  });
}
