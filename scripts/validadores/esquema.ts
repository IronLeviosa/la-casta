/**
 * Etapa 1 del validador: cada YAML de content/ pasa su esquema Zod y el
 * nombre de archivo cumple el patrón de id de su colección.
 *
 * Uso como módulo:   const { errores } = validarEsquemas(rootDir)
 * Uso directo:       tsx scripts/validadores/esquema.ts [rootDir]
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import { z } from 'astro/zod';
import { COLECCIONES, esquemasPorColeccion, type DefinicionColeccion } from '../../src/schemas/comunes';

export interface ErrorEsquema {
  /** Ruta del archivo relativa a rootDir, con separadores `/`. */
  archivo: string;
  /** Ruta del campo con puntos (ej. mandatos.0.fuentes), o "(archivo)" si el problema es el nombre o el parseo. */
  campo: string;
  /** Mensaje en español, incluyendo la descripción del campo cuando existe. */
  mensaje: string;
}

export interface ResultadoEsquemas {
  errores: ErrorEsquema[];
  /** Cantidad de archivos revisados. */
  archivos: number;
}

// ---------------------------------------------------------------------------

export function listarArchivos(dir: string, extension: string): string[] {
  let entradas: string[];
  try {
    entradas = readdirSync(dir);
  } catch {
    return [];
  }
  const salida: string[] = [];
  for (const nombre of entradas.sort()) {
    const ruta = path.join(dir, nombre);
    if (statSync(ruta).isDirectory()) salida.push(...listarArchivos(ruta, extension));
    else if (nombre.endsWith(`.${extension}`)) salida.push(ruta);
  }
  return salida;
}

function aPosix(p: string): string {
  return p.split(path.sep).join('/');
}

/** Separa el frontmatter YAML de un .md; devuelve null si no hay frontmatter. */
export function frontmatter(texto: string): string | null {
  const m = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(texto);
  return m ? m[1]! : null;
}

// ---------------------------------------------------------------------------
// Descripción del campo que falló (para mensajes útiles)
// ---------------------------------------------------------------------------

type Cualquiera = z.ZodType & { def?: Record<string, unknown>; description?: string };

function desenvolver(s: Cualquiera | undefined): Cualquiera | undefined {
  let actual = s;
  for (let i = 0; i < 8 && actual; i++) {
    const def = actual.def;
    if (!def) return actual;
    const t = def.type as string | undefined;
    if (t === 'optional' || t === 'nullable' || t === 'default' || t === 'readonly' || t === 'nonoptional') {
      actual = def.innerType as Cualquiera;
    } else if (t === 'pipe') {
      actual = def.in as Cualquiera;
    } else {
      return actual;
    }
  }
  return actual;
}

/** Recorre el esquema por la ruta del issue y devuelve la descripción más específica que encuentra. */
function descripcionEnRuta(esquema: Cualquiera, ruta: PropertyKey[]): string | undefined {
  let actual: Cualquiera | undefined = desenvolver(esquema);
  let descripcion = actual?.description;
  for (const clave of ruta) {
    if (!actual) break;
    const def = actual.def ?? {};
    const t = def.type as string | undefined;
    let siguiente: Cualquiera | undefined;
    if (t === 'object') {
      siguiente = (def.shape as Record<string, Cualquiera>)[String(clave)];
    } else if (t === 'array') {
      siguiente = def.element as Cualquiera;
    } else if (t === 'union') {
      // Probar la misma clave en cada opción y quedarse con la primera que la tenga.
      for (const opcion of def.options as Cualquiera[]) {
        const o = desenvolver(opcion);
        const shape = (o?.def?.shape as Record<string, Cualquiera> | undefined) ?? {};
        if (shape[String(clave)]) {
          siguiente = shape[String(clave)];
          break;
        }
      }
    }
    if (!siguiente) break;
    if (siguiente.description) descripcion = siguiente.description;
    actual = desenvolver(siguiente);
    if (actual?.description) descripcion = actual.description;
  }
  return descripcion;
}

export function formatearIssue(issue: z.core.$ZodIssue, esquema: Cualquiera): { campo: string; mensaje: string } {
  const ruta = issue.path.map(String);
  const campo = ruta.length ? ruta.join('.') : '(raíz)';
  let mensaje = issue.message;
  if (issue.code === 'unrecognized_keys') {
    mensaje = `Campo(s) no reconocido(s): ${(issue as { keys: string[] }).keys.join(', ')}.`;
  } else if ((issue.code === 'invalid_type' || issue.code === 'invalid_union') && (issue as { input?: unknown }).input === undefined) {
    // En una unión (por ejemplo `procedencia`) Zod dice solo "Invalid input"; el caso
    // real casi siempre es que el campo no está.
    mensaje = 'Campo obligatorio ausente.';
  } else if (issue.code === 'invalid_value') {
    const valores = (issue as { values?: unknown[] }).values;
    if (valores) mensaje = `Valor inválido; se esperaba uno de: ${valores.map(String).join(' | ')}.`;
  }
  const desc = descripcionEnRuta(esquema, issue.path);
  if (desc) mensaje = `${mensaje} — ${desc}`;
  return { campo, mensaje };
}

// ---------------------------------------------------------------------------

function validarColeccion(rootDir: string, def: DefinicionColeccion, errores: ErrorEsquema[]): number {
  const base = path.join(rootDir, def.carpeta);
  const archivos = listarArchivos(base, def.extension);
  const esquema = esquemasPorColeccion[def.nombre] as unknown as Cualquiera;

  for (const ruta of archivos) {
    const relativo = aPosix(path.relative(rootDir, ruta));
    const id = aPosix(path.relative(base, ruta)).replace(new RegExp(`\\.${def.extension}$`), '');

    if (!def.patronId.test(id)) {
      errores.push({
        archivo: relativo,
        campo: '(archivo)',
        mensaje: `El nombre no cumple el patrón de la colección "${def.nombre}" (${def.patronId.source}); ejemplo válido: ${def.ejemplo}.`,
      });
    }

    let datos: unknown;
    try {
      const texto = readFileSync(ruta, 'utf8');
      if (def.extension === 'md') {
        const fm = frontmatter(texto);
        if (fm === null) {
          errores.push({ archivo: relativo, campo: '(archivo)', mensaje: 'La página no tiene frontmatter YAML entre líneas ---.' });
          continue;
        }
        datos = parseYaml(fm);
      } else {
        datos = parseYaml(texto);
      }
    } catch (e) {
      errores.push({ archivo: relativo, campo: '(archivo)', mensaje: `YAML inválido: ${(e as Error).message}` });
      continue;
    }

    if (datos === null || typeof datos !== 'object') {
      errores.push({ archivo: relativo, campo: '(raíz)', mensaje: 'El archivo debe contener un objeto YAML con los campos del esquema.' });
      continue;
    }

    const resultado = esquema.safeParse(datos);
    if (!resultado.success) {
      for (const issue of resultado.error.issues) {
        const { campo, mensaje } = formatearIssue(issue, esquema);
        errores.push({ archivo: relativo, campo, mensaje });
      }
    }
  }
  return archivos.length;
}

/**
 * Valida todos los archivos de content/ contra sus esquemas.
 * @param rootDir raíz del repo (donde está content/).
 */
export function validarEsquemas(rootDir: string): ResultadoEsquemas {
  const errores: ErrorEsquema[] = [];
  let archivos = 0;
  for (const def of COLECCIONES) {
    archivos += validarColeccion(rootDir, def, errores);
  }
  return { errores, archivos };
}

// ---------------------------------------------------------------------------

function main(): void {
  const rootDir = path.resolve(process.argv[2] ?? process.cwd());
  const { errores, archivos } = validarEsquemas(rootDir);
  if (errores.length === 0) {
    console.log(`esquema: ${archivos} archivo(s) válidos.`);
    process.exit(0);
  }
  console.error(`esquema: ${errores.length} error(es) en ${archivos} archivo(s):`);
  for (const e of errores) {
    console.error(`  ${e.archivo}\n    ${e.campo}: ${e.mensaje}`);
  }
  process.exit(1);
}

const esEntrada = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (esEntrada) main();
