/**
 * `pnpm nuevo <coleccion> [<politico>] <slug>`
 *
 * Genera el esqueleto de un registro a partir del esquema Zod de su colección:
 * cada campo obligatorio con un valor `# TODO` y, arriba, la descripción del
 * esquema (`.describe()`), que es la documentación de verdad del modelo de datos.
 * Los campos opcionales quedan comentados para que se vean sin estorbar.
 *
 * No sobreescribe nunca. Los registros que salen de una corrida no se crean así:
 * entran por `inbox/` y `pnpm promover` (que es quien escribe `procedencia`).
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { COLECCIONES, definicionDeColeccion, esquemasPorColeccion, type NombreColeccion } from '../src/schemas/comunes';
import { hoyISO } from './lib/contenido.ts';
import { log, parsearArgs } from './lib/log.ts';
import { RAIZ } from './lib/rutas.ts';

/** Colecciones cuyo id empieza por `<politico>/`. */
const CON_CARPETA: Partial<Record<NombreColeccion, string>> = {
  declaraciones: 'politico',
  giros: 'politico',
  promesas: 'politico',
  chequeos: 'politico',
  intervenciones: 'politico',
  patrimonio: 'politico',
  menciones: 'politico',
  cobertura: 'medio',
};

type Cualquiera = {
  def?: Record<string, any>;
  description?: string;
};

interface Desenvuelto {
  esquema: Cualquiera;
  opcional: boolean;
  valorPorDefecto?: unknown;
  descripcion?: string;
}

/** Quita optional/default/nullable/pipe y devuelve el esquema útil más su descripción. */
function desenvolver(s: Cualquiera): Desenvuelto {
  let actual = s;
  let opcional = false;
  let valorPorDefecto: unknown;
  let descripcion = s.description;
  for (let i = 0; i < 10; i++) {
    const def = actual?.def;
    if (!def) break;
    const t = def.type as string | undefined;
    if (t === 'optional' || t === 'nullable' || t === 'readonly' || t === 'nonoptional') {
      opcional = opcional || t === 'optional' || t === 'nullable';
      actual = def.innerType;
    } else if (t === 'default' || t === 'prefault') {
      opcional = true;
      valorPorDefecto = typeof def.defaultValue === 'function' ? def.defaultValue() : def.defaultValue;
      actual = def.innerType;
    } else if (t === 'pipe') {
      actual = def.out?.def ? def.out : def.in;
    } else {
      break;
    }
    if (actual?.description) descripcion = actual.description;
  }
  return { esquema: actual, opcional, valorPorDefecto, descripcion };
}

function tipoDe(s: Cualquiera): string {
  return (s?.def?.type as string) ?? 'unknown';
}

function valoresDeEnum(s: Cualquiera): string[] {
  const entries = s.def?.entries;
  if (entries && typeof entries === 'object') return Object.values(entries).map(String);
  const values = s.def?.values;
  return Array.isArray(values) ? values.map(String) : [];
}

/** Valor escalar de ejemplo según el tipo y la descripción. */
function placeholder(s: Cualquiera, descripcion: string | undefined, conocidos: Record<string, string>): string {
  const t = tipoDe(s);
  if (t === 'enum') {
    const vals = valoresDeEnum(s);
    return vals.length ? vals[0]! : '""';
  }
  if (t === 'literal') {
    const v = s.def?.values ?? [s.def?.value];
    return JSON.stringify(String(Array.isArray(v) ? v[0] : v));
  }
  if (t === 'number' || t === 'int') return '0';
  if (t === 'boolean') return 'false';
  const d = (descripcion ?? '').toLowerCase();
  if (/yyyy-mm-dd/.test(d)) return conocidos.fecha ?? hoyISO();
  if (/url/.test(d)) return 'https://';
  if (/sha-256/.test(d)) return '"' + '0'.repeat(64) + '"';
  if (/h:mm:ss/.test(d)) return '"00:00"';
  return '""';
}

function comentario(texto: string | undefined, sangria: string, ancho = 100): string[] {
  if (!texto) return [];
  const palabras = texto.replace(/\s+/g, ' ').trim().split(' ');
  const lineas: string[] = [];
  let actual = '';
  for (const p of palabras) {
    if ((actual + ' ' + p).length + sangria.length + 2 > ancho && actual) {
      lineas.push(actual);
      actual = p;
    } else {
      actual = actual ? `${actual} ${p}` : p;
    }
  }
  if (actual) lineas.push(actual);
  return lineas.map((l) => `${sangria}# ${l}`);
}

/** Genera las líneas YAML de un esquema objeto. */
function lineasDeObjeto(esquema: Cualquiera, nivel: number, conocidos: Record<string, string>, profundidadMax = 5): string[] {
  const sangria = '  '.repeat(nivel);
  const shape = (esquema.def?.shape ?? {}) as Record<string, Cualquiera>;
  const salida: string[] = [];

  for (const [clave, bruto] of Object.entries(shape)) {
    const { esquema: campo, opcional, valorPorDefecto, descripcion } = desenvolver(bruto);
    const t = tipoDe(campo);
    const etiquetaOpcional = opcional ? '(opcional) ' : '';
    const prefijo = opcional ? `${sangria}# ` : sangria;

    const desc = descripcion ? `${etiquetaOpcional}${descripcion}` : etiquetaOpcional || undefined;
    const comentarios = comentario(desc, sangria);
    if (t === 'enum') {
      comentarios.push(...comentario(`valores: ${valoresDeEnum(campo).join(' | ')}`, sangria));
    }

    // Valor ya conocido (lo pasó el CLI): se completa y no se marca TODO.
    if (conocidos[clave] !== undefined && (t === 'string' || t === 'enum' || t === 'pipe' || t === 'custom')) {
      salida.push(...comentarios, `${prefijo}${clave}: ${conocidos[clave]}`);
      continue;
    }

    if (t === 'object' && nivel < profundidadMax) {
      salida.push(...comentarios, `${prefijo}${clave}:`);
      const hijas = lineasDeObjeto(campo, nivel + 1, conocidos, profundidadMax);
      salida.push(...(opcional ? hijas.map((l) => (l.trim() ? `# ${l}` : l)) : hijas));
      continue;
    }

    if (t === 'array' && nivel < profundidadMax) {
      const { esquema: elemento, descripcion: descElemento } = desenvolver(campo.def?.element ?? {});
      salida.push(...comentarios, `${prefijo}${clave}:`);
      const sangriaItem = '  '.repeat(nivel + 1);
      let hijas: string[];
      if (tipoDe(elemento) === 'object') {
        const cuerpo = lineasDeObjeto(elemento, nivel + 2, conocidos, profundidadMax);
        // El guion del ítem va en la primera línea que no sea comentario, para que el YAML parsee.
        const primera = cuerpo.findIndex((l) => l.trim() && !l.trim().startsWith('#'));
        hijas = cuerpo.map((l, i) => {
          if (i < primera) return `${sangriaItem}  ${l.trim()}`;
          if (i === primera) return `${sangriaItem}- ${l.trim()}`;
          return l;
        });
      } else {
        hijas = [...comentario(descElemento, sangriaItem), `${sangriaItem}- ${placeholder(elemento, descElemento, conocidos)}  # TODO`];
      }
      salida.push(...(opcional ? hijas.map((l) => (l.trim() ? `# ${l}` : l)) : hijas));
      continue;
    }

    if (t === 'union') {
      const opciones = (campo.def?.options ?? []) as Cualquiera[];
      const primera = desenvolver(opciones[0] ?? {});
      salida.push(...comentarios, `${prefijo}${clave}:`);
      const hijas = tipoDe(primera.esquema) === 'object' ? lineasDeObjeto(primera.esquema, nivel + 1, conocidos, profundidadMax) : [`${'  '.repeat(nivel + 1)}# TODO`];
      salida.push(...(opcional ? hijas.map((l) => (l.trim() ? `# ${l}` : l)) : hijas));
      continue;
    }

    const valor = valorPorDefecto !== undefined ? JSON.stringify(valorPorDefecto) : placeholder(campo, descripcion, conocidos);
    const marca = opcional ? '' : '  # TODO';
    salida.push(...comentarios, `${prefijo}${clave}: ${valor}${marca}`);
  }
  return salida;
}

export interface OpcionesNuevo {
  rootDir?: string;
  /** Sobrescribir el destino calculado. */
  destino?: string;
  /** Devolver el texto sin escribir. */
  simulacion?: boolean;
}

export interface ResultadoNuevo {
  coleccion: NombreColeccion;
  id: string;
  destino: string;
  contenido: string;
  escrito: boolean;
}

export function nuevo(coleccion: string, partes: string[], opciones: OpcionesNuevo = {}): ResultadoNuevo {
  if (!COLECCIONES.some((c) => c.nombre === coleccion)) {
    throw new Error(`Colección desconocida: "${coleccion}". Válidas: ${COLECCIONES.map((c) => c.nombre).join(', ')}.`);
  }
  const nombre = coleccion as NombreColeccion;
  const def = definicionDeColeccion(nombre);
  const rootDir = path.resolve(opciones.rootDir ?? RAIZ);

  const campoCarpeta = CON_CARPETA[nombre];
  let carpeta: string | undefined;
  let slug: string;
  if (campoCarpeta) {
    if (partes.length < 2) throw new Error(`La colección ${nombre} necesita dos argumentos: pnpm nuevo ${nombre} <${campoCarpeta}> <slug>. Ejemplo: ${def.ejemplo}.`);
    [carpeta, slug] = [partes[0]!, partes.slice(1).join('-')];
  } else {
    if (!partes.length) throw new Error(`Falta el slug: pnpm nuevo ${nombre} <slug>. Ejemplo: ${def.ejemplo}.`);
    slug = partes.join('-');
  }

  const id = carpeta ? `${carpeta}/${slug}` : slug;
  const destinoRel = `${def.carpeta}/${id}.${def.extension}`;
  const destino = opciones.destino ?? path.join(rootDir, ...destinoRel.split('/'));

  // Si el slug empieza con una fecha (convención de ids), esa es la fecha del registro.
  const fechaDelSlug = /^(\d{4}-\d{2}-\d{2})/.exec(slug)?.[1];
  // tier: nunca se arranca en "publicado"; publicar exige pasar todo el validador y, a veces, aprobación humana.
  const conocidos: Record<string, string> = { fecha: fechaDelSlug ?? hoyISO(), tier: 'probable' };
  if (campoCarpeta && carpeta) conocidos[campoCarpeta] = carpeta;

  const esquema = esquemasPorColeccion[nombre] as unknown as Cualquiera;
  const { esquema: raiz, descripcion } = desenvolver(esquema);
  const cabecera = [
    `# ${destinoRel}`,
    ...comentario(descripcion, ''),
    `# Completá cada "# TODO". Los campos comentados son opcionales.`,
    `# Después: pnpm validar (y pnpm validar --red para verificar fuentes y citas).`,
    '',
  ];
  const cuerpo = lineasDeObjeto(raiz, 0, conocidos);
  const contenido = [...cabecera, ...cuerpo, ''].join('\n');

  if (!def.patronId.test(id)) {
    throw new Error(`El id "${id}" no cumple el patrón de ${nombre} (${def.patronId.source}); ejemplo válido: ${def.ejemplo}.`);
  }
  if (existsSync(destino)) throw new Error(`Ya existe ${destinoRel}: pnpm nuevo no sobreescribe.`);

  if (!opciones.simulacion) {
    mkdirSync(path.dirname(destino), { recursive: true });
    writeFileSync(destino, contenido, 'utf8');
  }
  return { coleccion: nombre, id, destino: destinoRel, contenido, escrito: !opciones.simulacion };
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const AYUDA = `pnpm nuevo <coleccion> [<politico|medio>] <slug>

Crea el esqueleto de un registro con la descripción de cada campo del esquema.

Colecciones: ${COLECCIONES.map((c) => c.nombre).join(', ')}

Ejemplos:
  pnpm nuevo medios busqueda
  pnpm nuevo declaraciones lacalle-pou 2019-10-15-no-subir-impuestos
  pnpm nuevo casos astesiano

  --simulacion   imprime el esqueleto sin escribirlo`;

function main(): void {
  const { posicionales, opciones } = parsearArgs(process.argv.slice(2));
  if (posicionales.length < 2 || opciones.ayuda || opciones.help) {
    console.log(AYUDA);
    process.exit(posicionales.length < 2 ? 1 : 0);
  }
  try {
    const r = nuevo(posicionales[0]!, posicionales.slice(1), { simulacion: opciones.simulacion === true });
    if (!r.escrito) {
      console.log(r.contenido);
      process.exit(0);
    }
    log.ok(`Creado ${r.destino}. Completá los "# TODO" y corré pnpm validar.`);
    process.exit(0);
  } catch (e) {
    log.error((e as Error).message);
    process.exit(1);
  }
}

const esEntrada = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (esEntrada) main();
