/**
 * Carga de content/ (y opcionalmente de una corrida del inbox) en memoria,
 * ya validada por esquema, para que las etapas 2 a 6 trabajen sobre los
 * mismos registros. También: recorrido genérico de fuentes y evidencias,
 * slugs y utilidades de fecha que comparten validador, promover y exportar.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import { COLECCIONES, esquemasPorColeccion, type DefinicionColeccion, type NombreColeccion } from '../../src/schemas/comunes';
import { formatearIssue, frontmatter, listarArchivos } from '../validadores/esquema.ts';
import type { Problema } from '../validadores/tipos.ts';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export interface Registro {
  coleccion: NombreColeccion;
  /** Id = ruta relativa a la carpeta de la colección sin extensión (ej. lacalle-pou/2019-10-15-no-subir-impuestos). */
  id: string;
  /** Ruta para mensajes: relativa a la raíz, o `inbox/...#n` si viene del inbox. */
  archivo: string;
  /** Datos validados por el esquema (con defaults aplicados). */
  datos: Record<string, any>;
  /** Datos tal cual se leyeron del YAML (sin defaults; para hashes de aprobación). */
  crudo: Record<string, any>;
  /** true si el registro viene de la corrida del inbox (modo --inbox). */
  enInbox: boolean;
}

export interface Contenido {
  rootDir: string;
  registros: Registro[];
  /** Errores de esquema o parseo encontrados al cargar. */
  errores: Problema[];
  /** Cantidad de archivos leídos de content/. */
  archivos: number;
  obtener(coleccion: NombreColeccion, id: string): Registro | undefined;
  de(coleccion: NombreColeccion): Registro[];
}

/** Forma mínima de una Fuente para el recorrido genérico. */
export interface FuenteMinima {
  url: string;
  medio: string;
  fecha: string;
  tipo: string;
  cita: string;
  titulo?: string;
  marca_tiempo?: string;
  archived_url?: string;
  retrieved_at?: string;
  verificacion?: 'automatica' | 'manual';
  transcripcion_extracto?: string;
}

export interface EvidenciaMinima {
  nivel: 'textual' | 'reportado' | 'inferencia';
  fuentes: FuenteMinima[];
  cadena?: string[];
}

/** Colecciones de referencia (no exigen procedencia ni entran en las estadísticas). */
export const COLECCIONES_REFERENCIA: ReadonlySet<NombreColeccion> = new Set(COLECCIONES.filter((c) => c.referencia).map((c) => c.nombre));

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------

export function aPosix(p: string): string {
  return p.split(path.sep).join('/');
}

export function esFuente(v: unknown): v is FuenteMinima {
  return !!v && typeof v === 'object' && typeof (v as any).url === 'string' && typeof (v as any).cita === 'string' && typeof (v as any).medio === 'string';
}

export function esEvidencia(v: unknown): v is EvidenciaMinima {
  return !!v && typeof v === 'object' && typeof (v as any).nivel === 'string' && Array.isArray((v as any).fuentes);
}

/** Recorre recursivamente `datos` y llama a `cb` por cada objeto con forma de Fuente. */
export function recorrerFuentes(datos: unknown, cb: (fuente: FuenteMinima, ruta: string) => void, ruta = ''): void {
  if (!datos || typeof datos !== 'object') return;
  if (Array.isArray(datos)) {
    datos.forEach((v, i) => recorrerFuentes(v, cb, ruta ? `${ruta}.${i}` : String(i)));
    return;
  }
  if (esFuente(datos)) {
    cb(datos, ruta || '(raíz)');
    return;
  }
  for (const [k, v] of Object.entries(datos)) recorrerFuentes(v, cb, ruta ? `${ruta}.${k}` : k);
}

/** Recorre recursivamente `datos` y llama a `cb` por cada objeto con forma de Evidencia (nivel + fuentes). */
export function recorrerEvidencias(datos: unknown, cb: (evidencia: EvidenciaMinima, ruta: string) => void, ruta = ''): void {
  if (!datos || typeof datos !== 'object') return;
  if (Array.isArray(datos)) {
    datos.forEach((v, i) => recorrerEvidencias(v, cb, ruta ? `${ruta}.${i}` : String(i)));
    return;
  }
  if (esEvidencia(datos)) {
    cb(datos, ruta || '(raíz)');
    return;
  }
  for (const [k, v] of Object.entries(datos)) recorrerEvidencias(v, cb, ruta ? `${ruta}.${k}` : k);
}

/** Todas las URLs de fuentes de un registro, sin repetir. */
export function urlsDeRegistro(datos: unknown): string[] {
  const s = new Set<string>();
  recorrerFuentes(datos, (f) => s.add(f.url));
  return [...s];
}

const PALABRAS_VACIAS = new Set(['de', 'del', 'la', 'las', 'el', 'los', 'un', 'una', 'unos', 'unas', 'y', 'o', 'a', 'al', 'en', 'que', 'con', 'por', 'para', 'se', 'su', 'sus', 'lo', 'e', 'u']);

/** Slug en minúsculas sin acentos, con guiones, hasta `maxPalabras` palabras significativas. */
export function slugificar(texto: string, maxPalabras = 6): string {
  const base = texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter((p) => p && !PALABRAS_VACIAS.has(p));
  const palabras = base.slice(0, maxPalabras);
  return palabras.join('-').replace(/^-+|-+$/g, '');
}

/** Año de una fecha ISO (número). */
export function anio(fecha: string): number {
  return Number(fecha.slice(0, 4));
}

export function hoyISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/** true si [d1, h1] y [d2, h2] se superponen (hasta abierto = hoy). */
export function seSuperponen(d1: string, h1: string | undefined, d2: string, h2: string | undefined): boolean {
  const H1 = h1 ?? '9999-12-31';
  const H2 = h2 ?? '9999-12-31';
  return d1 <= H2 && d2 <= H1;
}

/** Diferencia en años (decimal) entre dos fechas ISO. */
export function aniosEntre(desde: string, hasta: string | undefined): number {
  const a = new Date(desde).getTime();
  const b = new Date(hasta ?? hoyISO()).getTime();
  return Math.max(0, (b - a) / (365.25 * 24 * 3600 * 1000));
}

// ---------------------------------------------------------------------------
// Carga
// ---------------------------------------------------------------------------

export function definicionPorCarpeta(coleccion: NombreColeccion): DefinicionColeccion {
  return COLECCIONES.find((c) => c.nombre === coleccion)!;
}

/** Lee un archivo de contenido (yaml o md con frontmatter) y devuelve el objeto crudo. Lanza si no parsea. */
export function leerRegistroCrudo(ruta: string): Record<string, any> {
  const texto = readFileSync(ruta, 'utf8');
  if (ruta.endsWith('.md')) {
    const fm = frontmatter(texto);
    if (fm === null) throw new Error('La página no tiene frontmatter YAML entre líneas ---.');
    return parseYaml(fm) as Record<string, any>;
  }
  return parseYaml(texto) as Record<string, any>;
}

/** Valida `crudo` contra el esquema de la colección; devuelve datos o lista de problemas. */
export function validarContraEsquema(coleccion: NombreColeccion, crudo: unknown, archivo: string): { datos?: Record<string, any>; errores: Problema[] } {
  const esquema = esquemasPorColeccion[coleccion] as any;
  if (crudo === null || typeof crudo !== 'object' || Array.isArray(crudo)) {
    return { errores: [{ archivo, campo: '(raíz)', mensaje: 'El archivo debe contener un objeto YAML con los campos del esquema.' }] };
  }
  const r = esquema.safeParse(crudo);
  if (r.success) return { datos: r.data as Record<string, any>, errores: [] };
  return {
    errores: r.error.issues.map((issue: any) => {
      const { campo, mensaje } = formatearIssue(issue, esquema);
      return { archivo, campo, mensaje };
    }),
  };
}

/**
 * Carga todas las colecciones de `rootDir/content/`. Los archivos que no
 * pasan el esquema quedan en `errores` y no entran en `registros`.
 */
export function cargarContenido(rootDir: string): Contenido {
  const registros: Registro[] = [];
  const errores: Problema[] = [];
  let archivos = 0;

  for (const def of COLECCIONES) {
    const base = path.join(rootDir, def.carpeta);
    for (const ruta of listarArchivos(base, def.extension)) {
      archivos++;
      const archivo = aPosix(path.relative(rootDir, ruta));
      const id = aPosix(path.relative(base, ruta)).replace(new RegExp(`\\.${def.extension}$`), '');
      if (!def.patronId.test(id)) {
        errores.push({
          archivo,
          campo: '(archivo)',
          mensaje: `El nombre no cumple el patrón de la colección "${def.nombre}" (${def.patronId.source}); ejemplo válido: ${def.ejemplo}.`,
        });
      }
      let crudo: Record<string, any>;
      try {
        crudo = leerRegistroCrudo(ruta);
      } catch (e) {
        errores.push({ archivo, campo: '(archivo)', mensaje: `YAML inválido: ${(e as Error).message}` });
        continue;
      }
      const v = validarContraEsquema(def.nombre, crudo, archivo);
      if (!v.datos) {
        errores.push(...v.errores);
        continue;
      }
      registros.push({ coleccion: def.nombre, id, archivo, datos: v.datos, crudo, enInbox: false });
    }
  }
  return construirContenido(rootDir, registros, errores, archivos);
}

export function construirContenido(rootDir: string, registros: Registro[], errores: Problema[], archivos: number): Contenido {
  const indice = new Map<NombreColeccion, Map<string, Registro>>();
  for (const r of registros) {
    if (!indice.has(r.coleccion)) indice.set(r.coleccion, new Map());
    indice.get(r.coleccion)!.set(r.id, r);
  }
  return {
    rootDir,
    registros,
    errores,
    archivos,
    obtener: (c, id) => indice.get(c)?.get(id),
    de: (c) => registros.filter((r) => r.coleccion === c),
  };
}
