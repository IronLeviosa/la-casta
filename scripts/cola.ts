/**
 * Cola de trabajos por git, sin puertos abiertos.
 *
 *   pnpm cola:agregar <tipo> [valor] [--clave valor ...]
 *   pnpm cola:ver [--todos]
 *   pnpm cola:reintentar <id> | --todos [--tipo <tipo>]
 *
 * Archivos: ${CORPUS_DIR}/cola/<timestamp>-<id>.yaml (pendientes),
 *           cola/en_curso/, cola/hechos/, cola/errores/ (movidos por el worker).
 *
 * `tomarTrabajo` decide qué trabajo sigue: precarga primero (son pocos y desbloquean al resto),
 * después transcribir, y etiquetar al final porque son miles y de menor urgencia. Dentro de un
 * tipo, el más viejo primero (el nombre del archivo ya es orden cronológico).
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, writeFileSync, unlinkSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { hostname } from 'node:os';
import { randomBytes } from 'node:crypto';
import { parse as parseYaml, stringify as aYaml } from 'yaml';
import { asegurarCorpus, RUTAS_CORPUS } from './lib/rutas.ts';
import { log, parsearArgs } from './lib/log.ts';
import type { EstadoTrabajo, TipoTrabajo, Trabajo } from './corpus/tipos.ts';

export const TIPOS_TRABAJO: TipoTrabajo[] = [
  'transcribir',
  'verificar_fuentes',
  'detective',
  'etiquetar',
  'reetiquetar',
  'sync',
  'precargar_diarios',
  'precargar_presidencia',
  'precargar_inventario',
  'catalogar',
];

/** Nombre del primer parametro posicional segun el tipo. */
const PARAMETRO_PRINCIPAL: Partial<Record<TipoTrabajo, string>> = {
  transcribir: 'url',
  etiquetar: 'nota',
  reetiquetar: 'politico',
  detective: 'politico',
  verificar_fuentes: 'archivo',
  precargar_diarios: 'camara',
  precargar_inventario: 'dominio',
  catalogar: 'medio',
};

export const CARPETAS_ESTADO: Record<EstadoTrabajo, string> = {
  pendiente: RUTAS_CORPUS.cola,
  en_curso: join(RUTAS_CORPUS.cola, 'en_curso'),
  hecho: join(RUTAS_CORPUS.cola, 'hechos'),
  error: join(RUTAS_CORPUS.cola, 'errores'),
};

/**
 * Orden de prioridad por tipo cuando el worker toma trabajo (defecto visto el 2026-09-15: tres
 * `precargar_*` quedaron detrás de ~3.500 `etiquetar` viejos y nunca corrieron). Precarga primero
 * porque son pocos y desbloquean transcripciones; etiquetar al final porque son la mayoría de la
 * cola y lo que menos urge. Lo que no está en la lista (no debería pasar: cubre los 9 tipos) queda
 * al final, después de `etiquetar`.
 */
export const ORDEN_PRIORIDAD: TipoTrabajo[] = [
  'precargar_diarios',
  'precargar_presidencia',
  'precargar_inventario',
  'transcribir',
  'verificar_fuentes',
  'detective',
  'reetiquetar',
  'sync',
  // Catalogar es el nuevo grueso de la cola (miles de URL por medio, piloto 0 de
  // docs/plan-catalogo.md): igual que `etiquetar`, no urge frente a lo que ya venía primero, pero
  // conviene antes que el `etiquetar` viejo (nota por nota) porque ya trae las dos pasadas de Haiku
  // resueltas para muchas notas de una vez.
  'catalogar',
  'etiquetar',
];

/** Ordena por prioridad de tipo y, dentro de un tipo, por antigüedad (id = orden cronológico). */
export function ordenarPorPrioridad(trabajos: Trabajo[]): Trabajo[] {
  const prioridad = (t: Trabajo) => {
    const i = ORDEN_PRIORIDAD.indexOf(t.tipo);
    return i === -1 ? ORDEN_PRIORIDAD.length : i;
  };
  return [...trabajos].sort((a, b) => prioridad(a) - prioridad(b) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}

function marcaTiempoCompacta(d = new Date()): string {
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

export function rutaDeTrabajo(trabajo: Trabajo): string {
  return join(CARPETAS_ESTADO[trabajo.estado], `${trabajo.id}.yaml`);
}

export function agregarTrabajo(tipo: TipoTrabajo, params: Record<string, unknown> = {}): Trabajo {
  if (!TIPOS_TRABAJO.includes(tipo)) throw new Error(`tipo de trabajo desconocido: ${tipo} (validos: ${TIPOS_TRABAJO.join(', ')})`);
  asegurarCorpus();
  const trabajo: Trabajo = {
    id: `${marcaTiempoCompacta()}-${randomBytes(4).toString('hex')}`,
    tipo,
    params,
    estado: 'pendiente',
    creado_por: hostname(),
    creado: new Date().toISOString(),
  };
  guardarTrabajo(trabajo);
  return trabajo;
}

export function guardarTrabajo(trabajo: Trabajo): string {
  const ruta = rutaDeTrabajo(trabajo);
  mkdirSync(CARPETAS_ESTADO[trabajo.estado], { recursive: true });
  writeFileSync(ruta, aYaml(trabajo, { lineWidth: 0 }), 'utf8');
  return ruta;
}

export function leerTrabajo(ruta: string): Trabajo | null {
  try {
    const t = parseYaml(readFileSync(ruta, 'utf8')) as Trabajo;
    if (!t || typeof t !== 'object' || !t.id) return null;
    if (!t.estado) t.estado = 'pendiente';
    return t;
  } catch {
    return null;
  }
}

/** Lista trabajos de un estado, ordenados por nombre (= por fecha de creacion). */
export function listarTrabajos(estado: EstadoTrabajo = 'pendiente'): Trabajo[] {
  const carpeta = CARPETAS_ESTADO[estado];
  if (!existsSync(carpeta)) return [];
  return readdirSync(carpeta)
    .filter((f) => f.endsWith('.yaml'))
    .sort()
    .map((f) => leerTrabajo(join(carpeta, f)))
    .filter((t): t is Trabajo => t !== null && t.estado === estado);
}

/**
 * Cambia el estado moviendo el archivo entre carpetas. Devuelve la ruta nueva.
 *
 * `intentos` (contador de reintentos) no está declarado en la interfaz `Trabajo` de
 * `corpus/tipos.ts`: es un campo opcional más que el YAML guarda igual, tipado acá con una
 * intersección en vez de tocar ese archivo para esta tanda de cambios.
 */
export function moverTrabajo(trabajo: Trabajo, estado: EstadoTrabajo, cambios: Partial<Trabajo> & { intentos?: number } = {}): string {
  const origen = rutaDeTrabajo(trabajo);
  Object.assign(trabajo, cambios, { estado });
  const destino = rutaDeTrabajo(trabajo);
  mkdirSync(CARPETAS_ESTADO[estado], { recursive: true });
  if (existsSync(origen) && origen !== destino) renameSync(origen, destino);
  writeFileSync(destino, aYaml(trabajo, { lineWidth: 0 }), 'utf8');
  return destino;
}

export function borrarTrabajo(trabajo: Trabajo): void {
  const ruta = rutaDeTrabajo(trabajo);
  if (existsSync(ruta)) unlinkSync(ruta);
}

/** Cuántas veces ya se reintentó este trabajo (0 si nunca falló). */
export function intentosDe(t: Trabajo): number {
  return (t as Trabajo & { intentos?: number }).intentos ?? 0;
}

/**
 * Toma el trabajo pendiente de mayor prioridad (más viejo dentro del tipo con más prioridad) y lo
 * marca `en_curso`. Con `{ tipo }` solo mira los pendientes de ese tipo. Devuelve null si no hay
 * ninguno que tomar.
 */
export function tomarTrabajo(opciones: { tipo?: TipoTrabajo } = {}): Trabajo | null {
  let pendientes = listarTrabajos('pendiente');
  if (opciones.tipo) pendientes = pendientes.filter((t) => t.tipo === opciones.tipo);
  if (!pendientes.length) return null;
  const [t] = ordenarPorPrioridad(pendientes);
  moverTrabajo(t, 'en_curso', { tomado_por: hostname(), tomado: new Date().toISOString() });
  return t;
}

/**
 * Contenido que debe quedar al reencolar un trabajo (desde errores/, o desde en_curso/ si el
 * worker lo reintenta solo): sin las marcas de la corrida anterior y con el contador al día. Pura
 * (no toca disco ni `estado`, eso lo hace `moverTrabajo`) para poder probarla sin CORPUS_DIR.
 */
export function trabajoReintentado(t: Trabajo): Trabajo & { intentos: number } {
  const { error, terminado, tomado_por, tomado, ...resto } = t;
  return { ...resto, intentos: intentosDe(t) + 1 };
}

/** Reencola un trabajo (de errores/ típicamente) como pendiente. Devuelve la ruta nueva. */
export function reencolar(t: Trabajo): string {
  const nuevo = trabajoReintentado(t);
  // Borrado genérico de claves (con `any`: TS no deja `delete` sobre un índice tipado sin `?`)
  // para reconstruir el objeto tal cual `nuevo`, con las claves de la corrida anterior afuera.
  for (const clave of Object.keys(t)) delete (t as any)[clave];
  Object.assign(t, nuevo);
  return moverTrabajo(t, 'pendiente');
}

function resumenParams(p: Record<string, unknown>): string {
  return Object.entries(p)
    .map(([k, v]) => `${k}=${typeof v === 'string' ? v : JSON.stringify(v)}`)
    .join(' ');
}

function main(): void {
  const { posicionales, opciones } = parsearArgs(process.argv.slice(2));
  const [comando, ...resto] = posicionales;
  if (comando === 'agregar') {
    const tipo = resto[0] as TipoTrabajo;
    if (!tipo) {
      process.stderr.write(`Uso: pnpm cola:agregar <${TIPOS_TRABAJO.join('|')}> [valor] [--clave valor]\n`);
      process.exit(2);
    }
    const params: Record<string, unknown> = {};
    const principal = PARAMETRO_PRINCIPAL[tipo];
    if (resto[1] !== undefined) {
      if (principal) params[principal] = resto[1];
      else params.valores = resto.slice(1);
    }
    if (resto.length > 2 && principal) params.extra = resto.slice(2);
    for (const [k, v] of Object.entries(opciones)) if (k !== 'json') params[k] = v;
    const t = agregarTrabajo(tipo, params);
    log.ok(`trabajo ${t.id} (${t.tipo}) encolado en ${rutaDeTrabajo(t)}`);
    log.info('recorda hacer `pnpm corpus:sync` para que lo vea el worker de la otra maquina');
    if (opciones.json) process.stdout.write(JSON.stringify(t) + '\n');
    return;
  }
  if (comando === 'ver') {
    const estados: EstadoTrabajo[] = opciones.todos ? ['pendiente', 'en_curso', 'error', 'hecho'] : ['pendiente', 'en_curso', 'error'];
    const todo = estados.flatMap((e) => listarTrabajos(e));
    if (opciones.json) {
      process.stdout.write(JSON.stringify(todo, null, 1) + '\n');
      return;
    }
    if (!todo.length) {
      process.stdout.write('cola vacia\n');
      return;
    }
    const pendientes = todo.filter((t) => t.estado === 'pendiente');
    if (pendientes.length) {
      const conteo = new Map<TipoTrabajo, number>();
      for (const t of pendientes) conteo.set(t.tipo, (conteo.get(t.tipo) ?? 0) + 1);
      const porTipo = ORDEN_PRIORIDAD.filter((tipo) => conteo.has(tipo))
        .map((tipo) => `${tipo}=${conteo.get(tipo)}`)
        .join(' ');
      process.stdout.write(`pendientes por tipo (orden de prioridad): ${porTipo}\n`);
    }
    for (const t of todo) {
      const quien = t.tomado_por ? ` · ${t.tomado_por}` : '';
      process.stdout.write(`${t.estado.padEnd(9)} ${t.id}  ${t.tipo.padEnd(17)} ${resumenParams(t.params)}${quien}${t.error ? `\n          error: ${t.error}` : ''}\n`);
    }
    return;
  }
  if (comando === 'reintentar') {
    const id = resto[0];
    const tipoFiltro = typeof opciones.tipo === 'string' ? (opciones.tipo as TipoTrabajo) : undefined;
    if (tipoFiltro && !TIPOS_TRABAJO.includes(tipoFiltro)) {
      process.stderr.write(`tipo desconocido: ${tipoFiltro} (validos: ${TIPOS_TRABAJO.join(', ')})\n`);
      process.exit(2);
    }
    let candidatos: Trabajo[];
    if (opciones.todos) {
      candidatos = listarTrabajos('error').filter((t) => !tipoFiltro || t.tipo === tipoFiltro);
    } else if (id) {
      const t = listarTrabajos('error').find((tr) => tr.id === id);
      if (!t) {
        log.error(`no encontre ${id} en errores/`);
        process.exit(1);
      }
      if (tipoFiltro && t.tipo !== tipoFiltro) {
        log.error(`${id} es de tipo ${t.tipo}, no ${tipoFiltro}`);
        process.exit(1);
      }
      candidatos = [t];
    } else {
      process.stderr.write('Uso: pnpm cola:reintentar <id> | --todos [--tipo <tipo>]\n');
      process.exit(2);
    }
    for (const t of candidatos) reencolar(t);
    log.ok(`${candidatos.length} trabajo(s) reencolado(s) como pendiente`);
    return;
  }
  if (comando === 'vaciar') {
    // Saca de la cola los pendientes de un tipo. Existe porque la precarga de Presidencia encoló
    // 4.820 transcripciones de video (Whisper local: cientos de horas de máquina) que nadie pidió;
    // la transcripción va por demanda, cuando una corrida necesita citar un video (2026-09-17).
    const tipoFiltro = typeof opciones.tipo === 'string' ? (opciones.tipo as TipoTrabajo) : undefined;
    if (!tipoFiltro || !TIPOS_TRABAJO.includes(tipoFiltro)) {
      process.stderr.write(`Uso: pnpm cola:vaciar --tipo <${TIPOS_TRABAJO.join('|')}> [--simulacion]\n`);
      process.exit(2);
    }
    const pendientes = listarTrabajos('pendiente').filter((t) => t.tipo === tipoFiltro);
    if (opciones.simulacion) {
      log.info(`${pendientes.length} trabajo(s) pendiente(s) de tipo ${tipoFiltro}; con --simulacion no se borra nada`);
      return;
    }
    for (const t of pendientes) borrarTrabajo(t);
    log.ok(`${pendientes.length} trabajo(s) de tipo ${tipoFiltro} sacado(s) de la cola`);
    return;
  }
  process.stderr.write('Uso: pnpm cola:agregar <tipo> [valor] | pnpm cola:ver [--todos] [--json] | pnpm cola:reintentar <id> | --todos [--tipo <tipo>] | pnpm cola:vaciar --tipo <tipo> [--simulacion]\n');
  process.exit(2);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
