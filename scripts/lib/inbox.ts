/**
 * Corridas del inbox (`inbox/<politico>/<tema>/<fecha>/`): lectura de los YAML
 * con listas de registros, normalización mecánica (campos `_`, marca_tiempo
 * numérica, sinónimos del investigador), derivación de ids y snapshot del crudo.
 * Lo comparten `pnpm validar --inbox` y `pnpm promover`.
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import type { NombreColeccion } from '../../src/schemas/comunes';
import { etiquetaLegalDesdeEtapa } from '../../src/schemas/comunes';
import { aPosix, slugificar, validarContraEsquema, type Registro } from './contenido.ts';
import type { Problema } from '../validadores/tipos.ts';

/** Archivo del inbox → colección destino. */
export const ARCHIVOS_INBOX: Record<string, NombreColeccion> = {
  declaraciones: 'declaraciones',
  promesas: 'promesas',
  menciones: 'menciones',
  giros: 'giros',
  chequeos: 'chequeos',
  casos: 'casos',
  cobertura: 'cobertura',
  patrimonio: 'patrimonio',
  intervenciones: 'intervenciones',
};

/** Agente que escribe cada colección por defecto (se puede sobreescribir con `_investigacion.agente`). */
export const AGENTE_POR_COLECCION: Partial<Record<NombreColeccion, string>> = {
  declaraciones: 'investigador',
  promesas: 'investigador',
  menciones: 'investigador',
  patrimonio: 'investigador',
  giros: 'revisar',
  chequeos: 'revisar',
  casos: 'revisar',
  cobertura: 'critico',
  intervenciones: 'clasificador',
};

/** Procedencia provisoria que se inyecta solo para validar el inbox (nunca se escribe). */
export const PROCEDENCIA_PROVISORIA = {
  corrida: 'inbox',
  agente: 'investigador',
  agente_sha: '0'.repeat(64),
  modelo: 'pendiente',
  brief_sha: '0'.repeat(64),
  fecha: '2000-01-01',
};

/** Quita recursivamente las claves que empiezan con `_`. */
export function quitarCamposGuion<T>(v: T): T {
  if (Array.isArray(v)) return v.map(quitarCamposGuion) as unknown as T;
  if (v && typeof v === 'object' && !(v instanceof Date)) {
    const salida: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
      if (k.startsWith('_')) continue;
      salida[k] = quitarCamposGuion(val);
    }
    return salida as T;
  }
  return v;
}

/** 754 → "12:34"; 3725 → "1:02:05"; deja los strings como están. */
export function formatearMarcaTiempo(v: unknown): unknown {
  if (typeof v !== 'number' || !Number.isFinite(v) || v < 0) return v;
  const s = Math.floor(v);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  return (h ? `${h}:${String(m).padStart(2, '0')}` : String(m)) + `:${String(r).padStart(2, '0')}`;
}

function normalizarFuentesEnProfundidad(v: unknown): void {
  if (Array.isArray(v)) {
    v.forEach(normalizarFuentesEnProfundidad);
    return;
  }
  if (v && typeof v === 'object') {
    const o = v as Record<string, unknown>;
    if ('marca_tiempo' in o) o.marca_tiempo = formatearMarcaTiempo(o.marca_tiempo);
    for (const val of Object.values(o)) normalizarFuentesEnProfundidad(val);
  }
}

/**
 * Normalización mecánica de un registro del inbox (la misma en validar y promover):
 * quita campos `_`, marca_tiempo numérica → texto, `evidencias_candidatas` → `evidencias`,
 * `mencionado` → `referente`. Con `placeholders` agrega lo que el editor todavía no asignó
 * (revision, procedencia, estado de promesa, etiqueta_legal) solo para poder validar.
 */
export function normalizarRegistroInbox(coleccion: NombreColeccion, crudo: Record<string, any>, placeholders: boolean): Record<string, any> {
  const r = quitarCamposGuion(structuredClone(crudo)) as Record<string, any>;
  normalizarFuentesEnProfundidad(r);
  if (coleccion === 'promesas' && r.evidencias === undefined && Array.isArray(r.evidencias_candidatas)) {
    r.evidencias = r.evidencias_candidatas;
  }
  delete r.evidencias_candidatas;
  if (coleccion === 'menciones' && r.referente === undefined && typeof r.mencionado === 'string') {
    r.referente = r.mencionado;
  }
  delete r.mencionado;

  if (placeholders) {
    r.revision ??= { tier: 'probable' };
    r.procedencia ??= { ...PROCEDENCIA_PROVISORIA };
    if (coleccion === 'promesas') {
      r.estado ??= 'en_proceso_demorada';
      r.fundamentacion ??= '(pendiente: la asigna el editor en /revisar)';
      r.evidencias ??= [];
    }
    if (coleccion === 'casos' && r.etiqueta_legal === undefined && Array.isArray(r.estado_judicial) && r.estado_judicial.length) {
      const ultima = r.estado_judicial[r.estado_judicial.length - 1]?.etapa;
      try {
        r.etiqueta_legal = etiquetaLegalDesdeEtapa(ultima);
      } catch {
        /* etapa inválida: la reporta el esquema */
      }
    }
  }
  return r;
}

function fechaDeIdDeclaracion(id: unknown): string | null {
  if (typeof id !== 'string') return null;
  const m = /\/(\d{4}-\d{2}-\d{2})-/.exec(id);
  return m ? m[1] : null;
}

/**
 * Id del registro según la convención de su colección. Respeta `_id` o `_slug`
 * del crudo si vienen; si no, lo deriva de fecha + slug del texto principal.
 * Evita colisiones dentro de la corrida con sufijos -2, -3…
 */
export function derivarId(coleccion: NombreColeccion, crudo: Record<string, any>, usados: Set<string>): string {
  const p = typeof crudo.politico === 'string' ? crudo.politico : 'sin-politico';
  const slugExplicito = typeof crudo._slug === 'string' ? slugificar(crudo._slug, 12) : null;
  let id: string;
  if (typeof crudo._id === 'string' && crudo._id.trim()) {
    id = crudo._id.trim();
  } else {
    switch (coleccion) {
      case 'declaraciones':
        id = `${p}/${crudo.fecha}-${slugExplicito ?? slugificar(String(crudo.resumen ?? crudo.cita ?? ''))}`;
        break;
      case 'promesas':
        id = `${p}/${slugExplicito ?? slugificar(String(crudo.texto ?? ''))}`;
        break;
      case 'menciones':
        id = `${p}/${crudo.fecha}-${slugExplicito ?? slugificar(String(crudo.referente ?? crudo.mencionado ?? ''))}`;
        break;
      case 'giros': {
        const tema = String(crudo.tema ?? '').split('/').pop() ?? '';
        const fechaDespues = fechaDeIdDeclaracion(crudo.declaracion_despues);
        id = `${p}/${slugExplicito ?? slugificar(`${tema} ${fechaDespues ? fechaDespues.slice(0, 4) : ''}`)}`;
        break;
      }
      case 'chequeos':
        id = `${p}/${crudo.fecha}-${slugExplicito ?? slugificar(String(crudo.afirmacion ?? ''))}`;
        break;
      case 'casos':
        id = slugExplicito ?? slugificar(String(crudo.nombre ?? '').replace(/^caso\s+/i, ''));
        break;
      case 'cobertura':
        id = `${crudo.medio}/${crudo.fecha}-${slugExplicito ?? slugificar(String(crudo.titulo ?? ''))}`;
        break;
      case 'patrimonio':
        id = `${p}/${crudo.fecha}`;
        break;
      case 'intervenciones':
        id = `${p}/${crudo.fecha}-${slugExplicito ?? slugificar(String(crudo.titulo ?? ''))}`;
        break;
      default:
        id = slugExplicito ?? slugificar(JSON.stringify(crudo).slice(0, 60));
    }
  }
  if (id.endsWith('-') || id.endsWith('/')) id += 'sin-titulo';
  let candidato = id;
  for (let n = 2; usados.has(candidato); n++) candidato = `${id}-${n}`;
  usados.add(candidato);
  return candidato;
}

export interface ArchivoInbox {
  nombre: string;
  coleccion: NombreColeccion;
  ruta: string;
  /** Registros crudos tal cual (con campos `_`). */
  items: Record<string, any>[];
}

/** Lee los YAML de registros de una carpeta del inbox. Lanza si un archivo no es una lista. */
export function leerArchivosInbox(inboxDir: string): ArchivoInbox[] {
  if (!existsSync(inboxDir)) throw new Error(`No existe la carpeta del inbox: ${inboxDir}`);
  const salida: ArchivoInbox[] = [];
  for (const nombre of readdirSync(inboxDir).sort()) {
    const base = nombre.replace(/\.ya?ml$/i, '');
    if (base === nombre) continue;
    const coleccion = ARCHIVOS_INBOX[base];
    if (!coleccion) continue;
    const ruta = path.join(inboxDir, nombre);
    const datos = parseYaml(readFileSync(ruta, 'utf8'));
    if (datos === null || datos === undefined) {
      salida.push({ nombre, coleccion, ruta, items: [] });
      continue;
    }
    if (!Array.isArray(datos)) throw new Error(`${nombre}: se esperaba una lista YAML de registros.`);
    salida.push({ nombre, coleccion, ruta, items: datos as Record<string, any>[] });
  }
  return salida;
}

export interface ResultadoInbox {
  registros: Registro[];
  errores: Problema[];
  archivos: number;
}

/** Carga y valida (con esquema relajado) una corrida del inbox. */
export function cargarInbox(rootDir: string, inboxDir: string): ResultadoInbox {
  const registros: Registro[] = [];
  const errores: Problema[] = [];
  let archivosInbox: ArchivoInbox[];
  try {
    archivosInbox = leerArchivosInbox(inboxDir);
  } catch (e) {
    return { registros, errores: [{ archivo: aPosix(path.relative(rootDir, inboxDir)) || inboxDir, campo: '(archivo)', mensaje: (e as Error).message }], archivos: 0 };
  }
  const usados = new Set<string>();
  for (const a of archivosInbox) {
    const relArchivo = aPosix(path.relative(rootDir, a.ruta));
    a.items.forEach((item, n) => {
      const archivo = `${relArchivo}#${n}`;
      if (!item || typeof item !== 'object' || Array.isArray(item)) {
        errores.push({ archivo, campo: '(registro)', mensaje: 'Cada elemento de la lista debe ser un objeto con los campos del esquema.' });
        return;
      }
      const normalizado = normalizarRegistroInbox(a.coleccion, item, true);
      const v = validarContraEsquema(a.coleccion, normalizado, archivo);
      if (!v.datos) {
        errores.push(...v.errores);
        return;
      }
      const id = derivarId(a.coleccion, item, usados);
      registros.push({ coleccion: a.coleccion, id, archivo, datos: v.datos, crudo: item, enInbox: true });
    });
  }
  return { registros, errores, archivos: archivosInbox.length };
}

/**
 * Copia a `crudo/` de la corrida los archivos del inbox que todavía no están
 * ahí (por archivo, nunca sobreescribe). Así el crudo es lo que escribió el
 * investigador antes de cualquier edición. Devuelve los archivos copiados.
 */
export function asegurarCrudo(inboxDir: string, corridaDir: string): string[] {
  const destino = path.join(corridaDir, 'crudo');
  mkdirSync(destino, { recursive: true });
  const copiados: string[] = [];
  for (const nombre of readdirSync(inboxDir).sort()) {
    if (!/\.(ya?ml|md|jsonl)$/i.test(nombre)) continue;
    const dst = path.join(destino, nombre);
    if (existsSync(dst)) continue;
    copyFileSync(path.join(inboxDir, nombre), dst);
    copiados.push(nombre);
  }
  return copiados;
}
