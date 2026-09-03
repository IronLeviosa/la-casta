/**
 * Cola de trabajos por git, sin puertos abiertos.
 *
 *   pnpm cola:agregar <tipo> [valor] [--clave valor ...]
 *   pnpm cola:ver [--todos]
 *
 * Archivos: ${CORPUS_DIR}/cola/<timestamp>-<id>.yaml (pendientes),
 *           cola/en_curso/, cola/hechos/, cola/errores/ (movidos por el worker).
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

export const TIPOS_TRABAJO: TipoTrabajo[] = ['transcribir', 'verificar_fuentes', 'detective', 'etiquetar', 'reetiquetar', 'sync'];

/** Nombre del primer parametro posicional segun el tipo. */
const PARAMETRO_PRINCIPAL: Partial<Record<TipoTrabajo, string>> = {
  transcribir: 'url',
  etiquetar: 'nota',
  reetiquetar: 'politico',
  detective: 'politico',
  verificar_fuentes: 'archivo',
};

export const CARPETAS_ESTADO: Record<EstadoTrabajo, string> = {
  pendiente: RUTAS_CORPUS.cola,
  en_curso: join(RUTAS_CORPUS.cola, 'en_curso'),
  hecho: join(RUTAS_CORPUS.cola, 'hechos'),
  error: join(RUTAS_CORPUS.cola, 'errores'),
};

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

/** Cambia el estado moviendo el archivo entre carpetas. Devuelve la ruta nueva. */
export function moverTrabajo(trabajo: Trabajo, estado: EstadoTrabajo, cambios: Partial<Trabajo> = {}): string {
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
    for (const t of todo) {
      const quien = t.tomado_por ? ` · ${t.tomado_por}` : '';
      process.stdout.write(`${t.estado.padEnd(9)} ${t.id}  ${t.tipo.padEnd(17)} ${resumenParams(t.params)}${quien}${t.error ? `\n          error: ${t.error}` : ''}\n`);
    }
    return;
  }
  process.stderr.write('Uso: pnpm cola:agregar <tipo> [valor] | pnpm cola:ver [--todos] [--json]\n');
  process.exit(2);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
