/**
 * `pnpm lote <subcomando> ...`
 *
 * Mira y edita un registro de un YAML del inbox sin cargar el archivo entero
 * (plan-2026-09, fase 1.4): un archivo del inbox puede pesar cientos de KB y
 * hasta ahora la única forma de mirar un registro era `Read` por tramos.
 * También resume una ficha ya publicada y lista las objeciones de una
 * crítica. Subcomandos:
 *
 *   ver       <dir-inbox> <coleccion> <n> [--completo] [--campo <ruta>]
 *   fijar     <dir-inbox> <coleccion> <n> <ruta> --valor <texto> | --desde-archivo <ruta>
 *   resumen   <coleccion>/<slug> [--archivo <ruta>]
 *   objeciones <ruta-a-critica.md> [<registro>] [--prosa]
 *   fusionar  <slug-a> <slug-b> --queda <slug> [--fecha YYYY-MM-DD] [--inbox <dir>] [--simulacion]
 *   fusionar  --pendientes
 *
 * Todos los archivos del inbox son listas YAML de nivel superior: `n` es el
 * índice (base 0) dentro de esa lista.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';
import { COLECCIONES, definicionDeColeccion, type NombreColeccion } from '../src/schemas/comunes';
import { completarFecha } from '../src/schemas/base';
import { aPosix, validarContraEsquema } from './lib/contenido.ts';
import { escribirCorridaDeScript, hashDeArchivo } from './lib/corridas.ts';
import { log, parsearArgs } from './lib/log.ts';
import { RAIZ } from './lib/rutas.ts';

// ---------------------------------------------------------------------------
// Rutas con corchetes: "finanzas[3].nota" -> ['finanzas', 3, 'nota']
// ---------------------------------------------------------------------------

export type Segmento = string | number;

/** Parsea `clave.otra[3].campo` en una lista de claves de objeto e índices de lista. */
export function parsearRutaCampo(ruta: string): Segmento[] {
  const tokens: Segmento[] = [];
  const re = /([^.[\]]+)|\[(\d+)\]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(ruta))) tokens.push(m[1] !== undefined ? m[1] : Number(m[2]));
  if (!tokens.length) throw new Error(`Ruta de campo vacía: "${ruta}".`);
  return tokens;
}

function etiquetaSegmento(s: Segmento): string {
  return typeof s === 'number' ? `[${s}]` : `.${s}`;
}

/** Lee `obj` siguiendo `tokens`; lanza con la ruta parcial si algo en el medio no existe. */
export function obtenerPorRuta(obj: unknown, tokens: Segmento[]): unknown {
  let actual: any = obj;
  let vista = '';
  for (const t of tokens) {
    if (actual === undefined || actual === null) {
      throw new Error(`La ruta "${vista || '(raíz)'}" no existe (se detuvo antes de "${etiquetaSegmento(t)}").`);
    }
    actual = actual[t as any];
    vista += etiquetaSegmento(t);
  }
  return actual;
}

/** Escribe `valor` en `obj` siguiendo `tokens`, creando objetos/listas intermedios que falten. */
export function asignarPorRuta(obj: Record<string, any>, tokens: Segmento[], valor: unknown): void {
  let actual: any = obj;
  for (let i = 0; i < tokens.length - 1; i++) {
    const t = tokens[i]!;
    if (actual[t as any] === undefined || actual[t as any] === null) {
      actual[t as any] = typeof tokens[i + 1] === 'number' ? [] : {};
    }
    actual = actual[t as any];
  }
  actual[tokens[tokens.length - 1] as any] = valor;
}

// ---------------------------------------------------------------------------
// Resumen de series largas (`lote ver` sin --completo)
// ---------------------------------------------------------------------------

/** Campos de un ítem de `finanzas[]` que no son "un campo con su usd": se omiten del resumen. */
const CAMPOS_FINANZAS_OMITIDOS = new Set(['anio', 'concepto', 'nota', 'fuentes', 'segmentos']);

function resumirFinanzas(items: any[]): string[] {
  return items.map((item) => {
    if (!item || typeof item !== 'object') return String(item);
    const partes: string[] = [];
    for (const [k, v] of Object.entries(item)) {
      if (CAMPOS_FINANZAS_OMITIDOS.has(k)) continue;
      if (v && typeof v === 'object' && !Array.isArray(v) && 'usd' in (v as Record<string, unknown>)) {
        partes.push(`${k}=${(v as Record<string, unknown>).usd}`);
      } else if (v && typeof v === 'object') {
        continue; // objeto sin `usd`: no es una serie financiera reconocida, se deja fuera del resumen
      } else {
        partes.push(`${k}=${v}`);
      }
    }
    if (Array.isArray(item.segmentos) && item.segmentos.length) {
      partes.push(`segmentos: ${item.segmentos.map((s: any) => (s && typeof s === 'object' ? (s.nombre ?? '?') : s)).join(', ')}`);
    }
    return `${item.anio ?? '?'}: ${partes.length ? partes.join(', ') : '(sin campos)'}`;
  });
}

function resumirNombres(items: any[]): string[] {
  return items.map((s) => (s && typeof s === 'object' ? String(s.nombre ?? '(sin nombre)') : String(s)));
}

function resumirHitos(items: any[]): string[] {
  return items.map((h) => `${h?.fecha ?? '????-??-??'} · ${h?.titulo ?? '(sin título)'} · ${h?.tipo ?? '(sin tipo)'}`);
}

function resumirSeriePrecios(items: any[]): string {
  const anios = items.map((i) => Number(i?.anio)).filter((n) => Number.isFinite(n));
  const productos = [...new Set(items.map((i) => i?.producto).filter((p) => p !== undefined && p !== null))];
  if (!anios.length) return `${items.length} ítems`;
  const min = Math.min(...anios);
  const max = Math.max(...anios);
  const presentes = new Set(anios);
  const huecos: number[] = [];
  for (let a = min; a <= max; a++) if (!presentes.has(a)) huecos.push(a);
  return `${items.length} ítems, productos ${productos.join(', ') || '(sin producto)'}, años ${min}-${max}, huecos: ${huecos.length ? huecos.join(', ') : 'ninguno'}`;
}

function resumirFuentes(items: any[]): string {
  const conteo = new Map<string, number>();
  for (const f of items) {
    const medio = f && typeof f === 'object' && f.medio !== undefined ? String(f.medio) : '(sin medio)';
    conteo.set(medio, (conteo.get(medio) ?? 0) + 1);
  }
  return `${items.length} fuentes: ${[...conteo.entries()].map(([medio, n]) => `${medio} ×${n}`).join(', ')}`;
}

function resumirValor(valor: unknown, clave: string, rutaPadre: string): unknown {
  if (Array.isArray(valor)) {
    if (clave === 'finanzas') return resumirFinanzas(valor);
    if (clave === 'segmentos') return resumirNombres(valor);
    if (clave === 'hitos') return resumirHitos(valor);
    if (clave === 'series' && (rutaPadre === 'precios_vs_paridad' || rutaPadre.endsWith('.precios_vs_paridad'))) return resumirSeriePrecios(valor);
    if (clave === 'fuentes' && valor.length > 3) return resumirFuentes(valor);
    const rutaCompleta = rutaPadre ? `${rutaPadre}.${clave}` : clave;
    return valor.map((v) => (v && typeof v === 'object' ? resumirObjeto(v as Record<string, unknown>, rutaCompleta) : v));
  }
  if (valor && typeof valor === 'object') {
    const rutaCompleta = rutaPadre ? `${rutaPadre}.${clave}` : clave;
    return resumirObjeto(valor as Record<string, unknown>, rutaCompleta);
  }
  return valor;
}

function resumirObjeto(obj: Record<string, unknown>, rutaPadre: string): Record<string, unknown> {
  const salida: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) salida[k] = resumirValor(v, k, rutaPadre);
  return salida;
}

/** Resume `finanzas[]`, `segmentos[]`, `precios_vs_paridad.series[]`, `hitos[]` y `fuentes[]` largas de un registro. */
export function resumirRegistro(registro: Record<string, unknown>): Record<string, unknown> {
  return resumirObjeto(registro, '');
}

// ---------------------------------------------------------------------------
// `pnpm lote ver`
// ---------------------------------------------------------------------------

export function leerListaInbox(dirInbox: string, coleccion: string): any[] {
  const archivo = path.resolve(dirInbox, `${coleccion}.yaml`);
  if (!existsSync(archivo)) throw new Error(`No existe ${archivo}.`);
  const datos = parseYaml(readFileSync(archivo, 'utf8'));
  if (datos === null || datos === undefined) return [];
  if (!Array.isArray(datos)) {
    throw new Error(`${archivo} no es una lista YAML de nivel superior: todos los archivos del inbox son listas de registros.`);
  }
  return datos;
}

function validarIndice(lista: any[], n: number, archivo: string): void {
  if (!Number.isInteger(n) || n < 0 || n >= lista.length) {
    throw new Error(`Índice ${n} fuera de rango: ${archivo} tiene ${lista.length} registro(s) (0 a ${Math.max(0, lista.length - 1)}).`);
  }
}

export interface OpcionesVer {
  completo?: boolean;
  campo?: string;
}

export function ver(dirInbox: string, coleccion: string, n: number, opciones: OpcionesVer = {}): string {
  const archivo = path.resolve(dirInbox, `${coleccion}.yaml`);
  const lista = leerListaInbox(dirInbox, coleccion);
  validarIndice(lista, n, archivo);
  const registro = lista[n];

  if (opciones.campo) {
    const tokens = parsearRutaCampo(opciones.campo);
    const valor = obtenerPorRuta(registro, tokens);
    if (valor === undefined) return '(sin valor)';
    return typeof valor === 'object' && valor !== null ? stringifyYaml(valor, { lineWidth: 100 }).trimEnd() : String(valor);
  }

  const salida = opciones.completo ? registro : resumirRegistro(registro as Record<string, unknown>);
  return stringifyYaml(salida, { lineWidth: 100 }).trimEnd();
}

// ---------------------------------------------------------------------------
// `pnpm lote fijar`
// ---------------------------------------------------------------------------

/** true si el YAML tiene algún `#` de comentario (heurística: fuera de comillas, precedido de espacio o al inicio). */
function tieneComentarios(texto: string): boolean {
  for (const linea of texto.split(/\r?\n/)) {
    const limpia = linea.replace(/"(?:[^"\\]|\\.)*"/g, '').replace(/'(?:[^'\\]|'')*'/g, '');
    if (/(^|\s)#/.test(limpia)) return true;
  }
  return false;
}

export interface OpcionesFijar {
  valor?: string;
  desdeArchivo?: string;
}

export interface ResultadoFijar {
  archivo: string;
  antes: unknown;
  despues: unknown;
  comentariosPerdidos: boolean;
}

export function fijar(dirInbox: string, coleccion: string, n: number, ruta: string, opciones: OpcionesFijar = {}): ResultadoFijar {
  const archivo = path.resolve(dirInbox, `${coleccion}.yaml`);
  if (!existsSync(archivo)) throw new Error(`No existe ${archivo}.`);
  const texto = readFileSync(archivo, 'utf8');
  const lista = parseYaml(texto);
  if (!Array.isArray(lista)) {
    throw new Error(`${archivo} no es una lista YAML de nivel superior: todos los archivos del inbox son listas de registros.`);
  }
  validarIndice(lista, n, archivo);

  if (opciones.valor === undefined && opciones.desdeArchivo === undefined) {
    throw new Error('Falta el valor: pasá --valor <texto> o --desde-archivo <ruta>.');
  }
  let valorNuevo: unknown;
  if (opciones.desdeArchivo !== undefined) {
    const origen = path.resolve(opciones.desdeArchivo);
    if (!existsSync(origen)) throw new Error(`No existe el archivo de origen: ${origen}`);
    valorNuevo = readFileSync(origen, 'utf8').replace(/\r?\n$/, '');
  } else {
    valorNuevo = parseYaml(opciones.valor!);
  }

  const tokens = parsearRutaCampo(ruta);
  const registro = lista[n];
  let antes: unknown;
  try {
    antes = obtenerPorRuta(registro, tokens);
  } catch {
    antes = undefined;
  }
  asignarPorRuta(registro, tokens, valorNuevo);
  writeFileSync(archivo, stringifyYaml(lista, { lineWidth: 100 }), 'utf8');

  return { archivo, antes, despues: valorNuevo, comentariosPerdidos: tieneComentarios(texto) };
}

// ---------------------------------------------------------------------------
// `pnpm lote resumen`
// ---------------------------------------------------------------------------

function tamanoDeValor(v: unknown): string {
  if (Array.isArray(v)) return `${v.length} ítem(s)`;
  if (v && typeof v === 'object') return `${Object.keys(v).length} clave(s)`;
  if (typeof v === 'string') return `${v.length} caracter(es)`;
  return String(v);
}

function resumenGenerico(registro: Record<string, unknown>): string[] {
  return Object.entries(registro).map(([k, v]) => `${k}: ${tamanoDeValor(v)}`);
}

function aniosDeCampo(finanzas: any[], campo: string): number[] {
  return finanzas
    .filter((f) => f && typeof f === 'object' && f[campo] !== undefined)
    .map((f) => Number(f.anio))
    .filter((n) => Number.isFinite(n))
    .sort((a, b) => a - b);
}

function huecosDe(anios: number[]): number[] {
  if (anios.length < 2) return [];
  const [min, max] = [anios[0]!, anios[anios.length - 1]!];
  const presentes = new Set(anios);
  const huecos: number[] = [];
  for (let a = min; a <= max; a++) if (!presentes.has(a)) huecos.push(a);
  return huecos;
}

function resumenEmpresa(registro: Record<string, any>): string[] {
  const lineas: string[] = [];
  const finanzas = Array.isArray(registro.finanzas) ? registro.finanzas : [];
  lineas.push(`finanzas: ${finanzas.length} año(s)${finanzas.length ? ` (${finanzas.map((f: any) => f.anio).join(', ')})` : ''}`);
  const camposFinancieros = [...new Set(finanzas.flatMap((f: any) => Object.keys(f ?? {})))].filter(
    (k): k is string => typeof k === 'string' && !CAMPOS_FINANZAS_OMITIDOS.has(k),
  );
  for (const campo of camposFinancieros) {
    const anios = aniosDeCampo(finanzas, campo);
    const huecos = huecosDe(anios);
    lineas.push(`  ${campo}: ${anios.join(', ') || '(sin datos)'}${huecos.length ? ` — huecos: ${huecos.join(', ')}` : ''}`);
  }
  const aniosSegmentos = finanzas.filter((f: any) => Array.isArray(f.segmentos) && f.segmentos.length).map((f: any) => f.anio);
  lineas.push(`segmentos: años ${aniosSegmentos.join(', ') || '(ninguno)'}`);

  const series = registro.precios_vs_paridad?.series;
  if (Array.isArray(series) && series.length) {
    const porProducto = new Map<string, number[]>();
    for (const it of series) {
      const p = String(it?.producto ?? '(sin producto)');
      const lista = porProducto.get(p) ?? [];
      const a = Number(it?.anio);
      if (Number.isFinite(a)) lista.push(a);
      porProducto.set(p, lista);
    }
    for (const [producto, anios] of porProducto) {
      anios.sort((a, b) => a - b);
      lineas.push(`precios_vs_paridad[${producto}]: años ${anios.join(', ')}`);
    }
  } else {
    lineas.push('precios_vs_paridad: sin series');
  }
  lineas.push(`hitos: ${Array.isArray(registro.hitos) ? registro.hitos.length : 0}`);
  lineas.push(`comparaciones: ${Array.isArray(registro.comparaciones) ? registro.comparaciones.length : 0}`);
  return lineas;
}

function resumenPolitico(registro: Record<string, any>): string[] {
  const mandatos = Array.isArray(registro.mandatos) ? registro.mandatos : [];
  if (!mandatos.length) return ['mandatos: ninguno'];
  return mandatos.map((m: any) => `${m?.cargo ?? '(sin cargo)'} · ${m?.desde ?? '?'} – ${m?.hasta ?? '(en curso)'}`);
}

/** Encuentra el registro `slug` dentro de una lista del inbox (por `_slug`, o el único ítem si hay uno solo). */
function extraerRegistroDeInbox(datos: unknown, slug: string): Record<string, any> {
  if (!Array.isArray(datos)) {
    if (datos && typeof datos === 'object') return datos as Record<string, any>;
    throw new Error('El archivo no contiene un registro ni una lista de registros.');
  }
  const ultimoSegmento = slug.split('/').pop();
  const porSlug = datos.find((it) => it && typeof it === 'object' && (it._slug === slug || it._slug === ultimoSegmento));
  if (porSlug) return porSlug;
  if (datos.length === 1) return datos[0];
  const disponibles = datos.map((it) => (it && typeof it === 'object' ? (it._slug ?? '(sin _slug)') : String(it))).join(', ');
  throw new Error(`No se encontró "${slug}" en la lista del inbox (_slug disponibles: ${disponibles}).`);
}

export interface OpcionesResumen {
  archivo?: string;
  rootDir?: string;
}

export function resumen(objetivo: string, opciones: OpcionesResumen = {}): string {
  const idx = objetivo.indexOf('/');
  if (idx < 0) throw new Error(`Formato esperado: <coleccion>/<slug>. Recibido: "${objetivo}".`);
  const nombreColeccion = objetivo.slice(0, idx);
  const slug = objetivo.slice(idx + 1);
  if (!slug) throw new Error(`Falta el slug: "${objetivo}".`);
  if (!COLECCIONES.some((c) => c.nombre === nombreColeccion)) {
    throw new Error(`Colección desconocida: "${nombreColeccion}". Válidas: ${COLECCIONES.map((c) => c.nombre).join(', ')}.`);
  }
  const coleccion = nombreColeccion as NombreColeccion;

  let registro: Record<string, any>;
  if (opciones.archivo) {
    const rutaArchivo = path.resolve(opciones.archivo);
    if (!existsSync(rutaArchivo)) throw new Error(`No existe ${rutaArchivo}.`);
    registro = extraerRegistroDeInbox(parseYaml(readFileSync(rutaArchivo, 'utf8')), slug);
  } else {
    const rootDir = path.resolve(opciones.rootDir ?? RAIZ);
    const def = definicionDeColeccion(coleccion);
    const rutaArchivo = path.join(rootDir, ...def.carpeta.split('/'), `${slug}.${def.extension}`);
    if (!existsSync(rutaArchivo)) {
      throw new Error(`No existe ${path.relative(rootDir, rutaArchivo)}. Si es un YAML del inbox todavía sin promover, usá --archivo <ruta>.`);
    }
    const datos = parseYaml(readFileSync(rutaArchivo, 'utf8'));
    registro = Array.isArray(datos) ? extraerRegistroDeInbox(datos, slug) : datos;
  }

  let lineas: string[];
  if (coleccion === 'empresas') lineas = resumenEmpresa(registro);
  else if (coleccion === 'politicos') lineas = resumenPolitico(registro);
  else lineas = resumenGenerico(registro);
  return lineas.join('\n');
}

// ---------------------------------------------------------------------------
// `pnpm lote objeciones`
// ---------------------------------------------------------------------------

export interface ItemResumenCritica {
  registro: string;
  severidad: string;
  tipo: string;
  [k: string]: unknown;
}

/** Bloque ```yaml``` que sigue a `## Resumen`, formato nuevo de `.claude/agents/critico.md`. */
export function extraerBloqueResumen(texto: string): ItemResumenCritica[] | null {
  const lineas = texto.split(/\r?\n/);
  const idx = lineas.findIndex((l) => l.trim() === '## Resumen');
  if (idx === -1) return null;
  let i = idx + 1;
  while (i < lineas.length && lineas[i]!.trim() === '') i++;
  if (i >= lineas.length || lineas[i]!.trim() !== '```yaml') return null;
  let fin = i + 1;
  while (fin < lineas.length && lineas[fin]!.trim() !== '```') {
    if (/^##\s/.test(lineas[fin]!)) return null; // se salió de la sección sin cerrar el fence
    fin++;
  }
  if (fin >= lineas.length) return null;
  try {
    const datos = parseYaml(lineas.slice(i + 1, fin).join('\n'));
    return Array.isArray(datos) ? (datos as ItemResumenCritica[]) : null;
  } catch {
    return null;
  }
}

export interface EncabezadoViejo {
  titulo: string;
  severidad: string | null;
  /** `tipo:` de la misma sección, en minúsculas; solo el primero si hay varios separados por coma. */
  tipo: string | null;
  /** Primer segmento de `titulo` antes del guión largo (" — "): el identificador de registro. */
  registro: string;
  inicio: number;
  fin: number;
}

/** Críticas viejas, sin bloque `## Resumen`: cada `### ` con la primera línea `severidad:` que sigue. */
export function extraerEncabezadosViejo(texto: string): EncabezadoViejo[] {
  const lineas = texto.split(/\r?\n/);
  const encabezados: { titulo: string; inicio: number }[] = [];
  lineas.forEach((l, i) => {
    if (/^### /.test(l)) encabezados.push({ titulo: l.replace(/^### /, '').trim(), inicio: i });
  });
  return encabezados.map((h, idx) => {
    const fin = idx + 1 < encabezados.length ? encabezados[idx + 1]!.inicio : lineas.length;
    let severidad: string | null = null;
    // Busca severidad y tipo en el mismo tramo; no corta al hallar severidad para no perderse el
    // `tipo:` que casi siempre viene en la línea siguiente (formato de .claude/agents/critico.md).
    let tipo: string | null = null;
    for (let j = h.inicio + 1; j < fin; j++) {
      if (/^#{1,2}\s/.test(lineas[j]!)) break;
      if (severidad === null) {
        const m = /severidad:\s*\*{0,2}([a-záéíóúñ_]+)\*{0,2}/i.exec(lineas[j]!);
        if (m) severidad = m[1]!.toLowerCase();
      }
      if (tipo === null) {
        const m = /tipo:\s*\*{0,2}([a-záéíóúñ_]+)/i.exec(lineas[j]!);
        if (m) tipo = m[1]!.toLowerCase();
      }
      if (severidad !== null && tipo !== null) break;
    }
    const registro = limpiarMarcado(h.titulo.split(/\s+—\s+/)[0] ?? h.titulo);
    return { titulo: h.titulo, severidad, tipo, registro, inicio: h.inicio, fin };
  });
}

function limpiarMarcado(s: string): string {
  return s.replace(/[`*]/g, '').trim();
}

function extraerBloqueProsa(texto: string, identificador: string): string | null {
  const lineas = texto.split(/\r?\n/);
  const objetivo = limpiarMarcado(identificador);
  let inicio = -1;
  for (let i = 0; i < lineas.length; i++) {
    if (/^###\s/.test(lineas[i]!)) {
      const titulo = limpiarMarcado(lineas[i]!.replace(/^###\s/, ''));
      if (titulo === objetivo || titulo.startsWith(objetivo)) {
        inicio = i;
        break;
      }
    }
  }
  if (inicio === -1) return null;
  let fin = inicio + 1;
  while (fin < lineas.length && !/^#{1,3}\s/.test(lineas[fin]!)) fin++;
  return lineas.slice(inicio, fin).join('\n').trimEnd();
}

export interface OpcionesObjeciones {
  prosa?: boolean;
}

export function objeciones(rutaCritica: string, registro?: string, opciones: OpcionesObjeciones = {}): string {
  const ruta = path.resolve(rutaCritica);
  if (!existsSync(ruta)) throw new Error(`No existe ${ruta}.`);
  const texto = readFileSync(ruta, 'utf8');
  const salida: string[] = [];

  const bloque = extraerBloqueResumen(texto);
  if (bloque) {
    const conObjecion = bloque.filter((it) => it.severidad !== 'sin_objecion');
    const filtrados = registro ? conObjecion.filter((it) => it.registro === registro) : conObjecion;
    if (registro && !filtrados.length) {
      salida.push(`Sin objeción registrada para "${registro}" (no aparece en el Resumen, o su severidad es sin_objecion).`);
    }
    for (const it of filtrados) {
      salida.push(`${it.registro} — ${it.severidad} (${it.tipo})`);
      if (opciones.prosa) {
        salida.push(extraerBloqueProsa(texto, it.registro) ?? `  (no se encontró el bloque de prosa de "${it.registro}")`);
      }
    }
    return salida.join('\n');
  }

  salida.push('Esta crítica no tiene bloque `## Resumen` en YAML (formato viejo); encabezados `### ` con su severidad:');
  const encabezados = extraerEncabezadosViejo(texto);
  const filtrados = registro
    ? encabezados.filter((h) => limpiarMarcado(h.titulo).toLowerCase().includes(limpiarMarcado(registro).toLowerCase()))
    : encabezados;
  if (!filtrados.length) salida.push(registro ? `Ningún encabezado coincide con "${registro}".` : '(sin encabezados ### en el archivo)');
  for (const h of filtrados) {
    salida.push(`${h.titulo} — severidad: ${h.severidad ?? '(sin severidad)'}`);
    if (opciones.prosa) salida.push(texto.split(/\r?\n/).slice(h.inicio, h.fin).join('\n').trimEnd());
  }
  return salida.join('\n');
}

// ---------------------------------------------------------------------------
// `pnpm lote fusionar` (plan-2026-09, ítem 2.8)
//
// Une dos fichas de content/politicos/ que documentan a la misma persona
// (regla 8 de docs/colecciones/politicos.md: "quien fue diputado y hoy es
// senador, o al revés, tiene una sola ficha"). No escribe nunca en content/:
// deja la ficha fusionada y una corrección válida en inbox/correcciones/<fecha>/,
// listas para que alguien corra `pnpm promover ... --correccion <id>` (regla 7:
// "una persona con dos fichas... se resuelve con una corrección, no con una
// tercera ficha" — los ids nunca se renombran).
// ---------------------------------------------------------------------------

interface OrigenFicha {
  datos: Record<string, any>;
  /** Descripción legible de dónde salió, para el mensaje y el motivo de la corrección. */
  origen: string;
}

function rutaFichaContent(rootDir: string, slug: string): string {
  return path.join(rootDir, 'content', 'politicos', `${slug}.yaml`);
}

function leerFichaContent(rootDir: string, slug: string): Record<string, any> | null {
  const archivo = rutaFichaContent(rootDir, slug);
  if (!existsSync(archivo)) return null;
  const datos = parseYaml(readFileSync(archivo, 'utf8'));
  if (!datos || typeof datos !== 'object' || Array.isArray(datos)) {
    throw new Error(`content/politicos/${slug}.yaml no es un objeto YAML de una sola ficha.`);
  }
  return datos as Record<string, any>;
}

function leerFichaDeInbox(inboxDir: string, slug: string): Record<string, any> | null {
  const lista = leerListaInbox(inboxDir, 'politicos');
  const item = lista.find((it) => it && typeof it === 'object' && it._slug === slug);
  return (item as Record<string, any> | undefined) ?? null;
}

/**
 * Resuelve las dos fichas a fusionar. Cuando `slugA === slugB` (el caso real de las 16 fusiones
 * de senadores/diputados: la misma persona, mismo slug, una ficha ya publicada y otra todavía en
 * el inbox de la otra cámara) no alcanza con "probar content, si no probar inbox" para cada slug
 * por separado, porque las dos búsquedas encontrarían la misma fuente y se fusionaría la ficha
 * consigo misma: hay que tomar una de cada lado. Cuando los slugs son distintos (una colisión de
 * identidad real, con dos ids), cada uno se resuelve de forma independiente.
 */
function resolverParFichas(rootDir: string, slugA: string, slugB: string, inboxDir?: string): { fichaA: OrigenFicha; fichaB: OrigenFicha } {
  const sinInbox = () => (inboxDir ? '' : ' (no se pasó --inbox)');
  if (slugA === slugB) {
    const deContent = leerFichaContent(rootDir, slugA);
    const deInbox = inboxDir ? leerFichaDeInbox(inboxDir, slugA) : null;
    if (deContent && deInbox) {
      return {
        fichaA: { datos: deContent, origen: `content/politicos/${slugA}.yaml` },
        fichaB: { datos: deInbox, origen: `${aPosix(path.relative(rootDir, inboxDir!))}/politicos.yaml (_slug: ${slugA})` },
      };
    }
    if (deContent && !deInbox) {
      throw new Error(
        `slug-a y slug-b son el mismo id ("${slugA}") y ya está publicado en content/politicos/${slugA}.yaml, pero no se encontró una segunda ficha${sinInbox()}. Pasá --inbox <dir> con la carpeta que tiene la ficha pendiente (ej. inbox/senadores/fusion).`,
      );
    }
    if (!deContent && deInbox) {
      throw new Error(`slug-a y slug-b son el mismo id ("${slugA}") pero no está publicado en content/politicos/, y en --inbox solo hay una versión: no hay dos fichas para fusionar.`);
    }
    throw new Error(`No se encontró "${slugA}" ni en content/politicos/ ni en --inbox${sinInbox()}.`);
  }
  const resolverUna = (slug: string): OrigenFicha => {
    const deContent = leerFichaContent(rootDir, slug);
    if (deContent) return { datos: deContent, origen: `content/politicos/${slug}.yaml` };
    if (inboxDir) {
      const deInbox = leerFichaDeInbox(inboxDir, slug);
      if (deInbox) return { datos: deInbox, origen: `${aPosix(path.relative(rootDir, inboxDir))}/politicos.yaml (_slug: ${slug})` };
    }
    throw new Error(`No se encontró "${slug}" ni en content/politicos/ ni en --inbox${sinInbox()}.`);
  };
  return { fichaA: resolverUna(slugA), fichaB: resolverUna(slugB) };
}

/** Clave de dedupe de un mandato: cargo, desde y hasta exactos (tal como pide el ítem 2.8). */
function claveMandato(m: Record<string, any>): string {
  return `${m?.cargo} ${m?.desde} ${m?.hasta ?? ''}`;
}

function dedupFuentesPorUrl(fuentes: any[]): any[] {
  const vistas = new Set<string>();
  const salida: any[] = [];
  for (const f of fuentes) {
    const clave = f && typeof f === 'object' && f.url ? String(f.url) : JSON.stringify(f);
    if (vistas.has(clave)) continue;
    vistas.add(clave);
    salida.push(f);
  }
  return salida;
}

/** Fin de un mandato para ordenar: 9999-12-31 si sigue abierto, para que quede último entre empates de `desde`. */
function finParaOrden(m: Record<string, any>): string {
  return typeof m.hasta === 'string' ? completarFecha(m.hasta, 'fin') : '9999-12-31';
}

/**
 * Une `mandatos[]` de las dos fichas: deduplica por (cargo, desde, hasta) exactos y conserva las
 * fuentes de las dos ocurrencias cuando un mandato aparece en ambas. Devuelve la lista ordenada
 * cronológicamente por `desde` (y por `hasta` en los empates), como aparecen las fichas ya publicadas.
 */
export function unirMandatos(mandatosA: any[] = [], mandatosB: any[] = []): any[] {
  const mapa = new Map<string, Record<string, any>>();
  for (const m of [...mandatosA, ...mandatosB]) {
    if (!m || typeof m !== 'object') continue;
    const clave = claveMandato(m);
    const existente = mapa.get(clave);
    if (existente) {
      existente.fuentes = dedupFuentesPorUrl([...(existente.fuentes ?? []), ...(m.fuentes ?? [])]);
    } else {
      mapa.set(clave, { ...m, fuentes: dedupFuentesPorUrl([...(m.fuentes ?? [])]) });
    }
  }
  return [...mapa.values()].sort((x, y) => {
    const dx = completarFecha(x.desde, 'inicio');
    const dy = completarFecha(y.desde, 'inicio');
    if (dx !== dy) return dx < dy ? -1 : 1;
    const hx = finParaOrden(x);
    const hy = finParaOrden(y);
    return hx < hy ? -1 : hx > hy ? 1 : 0;
  });
}

/** Une `alias[]` de las dos fichas, sin duplicados, conservando el orden de aparición. */
export function unirAlias(aliasA: string[] = [], aliasB: string[] = []): string[] {
  const vistos = new Set<string>();
  const salida: string[] = [];
  for (const alias of [...aliasA, ...aliasB]) {
    if (typeof alias === 'string' && !vistos.has(alias)) {
      vistos.add(alias);
      salida.push(alias);
    }
  }
  return salida;
}

function unirAliasAmbiguos(a: any[] = [], b: any[] = []): any[] {
  const mapa = new Map<string, any>();
  for (const it of [...a, ...b]) {
    if (it && typeof it === 'object' && typeof it.alias === 'string' && !mapa.has(it.alias)) mapa.set(it.alias, it);
  }
  return [...mapa.values()];
}

function unirCandidaturas(a: any[] = [], b: any[] = []): any[] {
  const mapa = new Map<string, Record<string, any>>();
  for (const c of [...a, ...b]) {
    if (!c || typeof c !== 'object') continue;
    const clave = `${c.cargo} ${c.fecha} ${c.lema}`;
    const existente = mapa.get(clave);
    if (existente) existente.fuentes = dedupFuentesPorUrl([...(existente.fuentes ?? []), ...(c.fuentes ?? [])]);
    else mapa.set(clave, { ...c, fuentes: dedupFuentesPorUrl([...(c.fuentes ?? [])]) });
  }
  return [...mapa.values()];
}

/** Representación estable (claves ordenadas) para comparar dos `estado_actual` por igualdad de contenido. */
function claveEstable(v: unknown): string {
  if (Array.isArray(v)) return `[${v.map(claveEstable).join(',')}]`;
  if (v && typeof v === 'object') {
    const o = v as Record<string, unknown>;
    return `{${Object.keys(o)
      .sort()
      .map((k) => `${JSON.stringify(k)}:${claveEstable(o[k])}`)
      .join(',')}}`;
  }
  return JSON.stringify(v);
}

/** "Qué tan reciente" es un estado_actual, para decidir cuál de los dos vale: en_cargo es siempre el más nuevo (sigue abierto). */
function recenciaEstado(estado: any): number {
  if (!estado || typeof estado !== 'object') return -Infinity;
  if (estado.situacion === 'en_cargo') return Infinity;
  const fecha = estado.salida?.fecha ?? estado.prision?.desde;
  return typeof fecha === 'string' ? Date.parse(fecha) : -Infinity;
}

interface ResultadoEstado {
  estado: any;
  /** Mensaje para avisar cuando las dos fichas traían un estado_actual distinto, o null si coinciden. */
  avisoDiferencia: string | null;
}

/**
 * Recalcula estado_actual "a partir del mandato más reciente": en vez de rearmarlo desde cero, se
 * eligen entre los dos `estado_actual` ya válidos de cada ficha (cada uno consistente con sus
 * propios mandatos) el que corresponde al mandato más nuevo. Si difieren, se dice cuál ganó y por qué.
 */
function elegirEstadoActual(estadoQueda: any, estadoOtra: any): ResultadoEstado {
  if (claveEstable(estadoQueda) === claveEstable(estadoOtra)) return { estado: estadoQueda, avisoDiferencia: null };
  const recQueda = recenciaEstado(estadoQueda);
  const recOtra = recenciaEstado(estadoOtra);
  const ganaQueda = recQueda >= recOtra;
  return {
    estado: ganaQueda ? estadoQueda : estadoOtra,
    avisoDiferencia:
      `estado_actual difiere entre las dos fichas (situacion: "${estadoQueda?.situacion ?? '?'}" vs "${estadoOtra?.situacion ?? '?'}"): ` +
      `se usó el de ${ganaQueda ? 'la ficha que queda' : 'la otra ficha'}, por tener la fecha más nueva.`,
  };
}

/** `valorQueda` salvo que esté vacío (undefined, null, '' o []), en cuyo caso se usa `valorOtra`. */
function elegirCampo<T>(valorQueda: T | undefined | null, valorOtra: T | undefined | null): T | undefined {
  const vacio = (v: unknown) => v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0);
  return !vacio(valorQueda) ? (valorQueda as T) : (valorOtra as T | undefined);
}

const ORDEN_TIER: Record<string, number> = { hipotesis: 0, probable: 1, publicado: 2 };

/** Tier más cauteloso de los dos (si una ficha estaba en `probable`, la fusión no la sube a `publicado` sola). */
function unirRevision(a: any, b: any): Record<string, unknown> {
  const tierA = typeof a?.tier === 'string' ? a.tier : 'publicado';
  const tierB = typeof b?.tier === 'string' ? b.tier : 'publicado';
  const tier = (ORDEN_TIER[tierA] ?? 2) <= (ORDEN_TIER[tierB] ?? 2) ? tierA : tierB;
  const salida: Record<string, unknown> = { tier };
  const quefalta = [a?.que_falta, b?.que_falta].filter((x): x is string => typeof x === 'string' && x.length > 0);
  if (quefalta.length) salida.que_falta = [...new Set(quefalta)].join(' ');
  const notas = [a?.notas_internas, b?.notas_internas].filter((x): x is string => typeof x === 'string' && x.length > 0);
  if (notas.length) salida.notas_internas = [...new Set(notas)].join(' ');
  return salida;
}

/**
 * Avisa si algún alias de la ficha fusionada también aparece en OTRA ficha de content/politicos/
 * (regla 7: "un alias compartido por dos personas... se retira de las dos fichas"). No decide nada
 * por su cuenta: solo señala el caso para que alguien lo revise antes de fusionar.
 */
function buscarColisionesAlias(rootDir: string, aliasFinal: string[], excluirSlugs: Set<string>): string[] {
  const avisos: string[] = [];
  const dir = path.join(rootDir, 'content', 'politicos');
  if (!existsSync(dir)) return avisos;
  for (const archivo of readdirSync(dir)) {
    if (!archivo.endsWith('.yaml')) continue;
    const slug = archivo.slice(0, -'.yaml'.length);
    if (excluirSlugs.has(slug)) continue;
    let datos: any;
    try {
      datos = parseYaml(readFileSync(path.join(dir, archivo), 'utf8'));
    } catch {
      continue;
    }
    if (!datos || typeof datos !== 'object') continue;
    const aliasDeEsa = new Set<string>([
      ...(Array.isArray(datos.alias) ? datos.alias : []),
      ...(Array.isArray(datos.alias_ambiguos) ? datos.alias_ambiguos.map((x: any) => x?.alias).filter((x: unknown): x is string => typeof x === 'string') : []),
    ]);
    for (const alias of aliasFinal) {
      if (aliasDeEsa.has(alias)) avisos.push(`El alias "${alias}" también aparece en content/politicos/${slug}.yaml: revisar antes de fusionar (regla 7, alias compartido).`);
    }
  }
  return avisos;
}

export interface OpcionesFusionar {
  /** Slug que sobrevive a la fusión: tiene que ser slug-a o slug-b (los ids no se renombran a un tercero). */
  queda: string;
  /** Fecha de la corrección (YYYY-MM-DD); por defecto la fecha de hoy. */
  fecha?: string;
  /** Carpeta del inbox donde buscar la ficha que todavía no está en content/politicos/. */
  inboxDir?: string;
  /** Raíz del repo (por defecto RAIZ); para pruebas. */
  rootDir?: string;
  /** Calcula todo sin escribir nada. */
  simulacion?: boolean;
}

export interface ResultadoFusionar {
  queda: string;
  /** El otro slug, si es distinto de `queda` (colisión de identidad real con dos ids). null si slug-a === slug-b. */
  descartado: string | null;
  ficha: Record<string, any>;
  correccion: Record<string, any>;
  origenA: string;
  origenB: string;
  /** Avisos para revisar a mano: alias compartido con una tercera ficha, estado_actual en conflicto. */
  avisos: string[];
  /** Ruta (relativa a rootDir) de inbox/correcciones/<fecha>/politicos.yaml. */
  archivoFicha: string;
  /** Ruta (relativa a rootDir) de inbox/correcciones/<fecha>/correcciones.yaml. */
  archivoCorreccion: string;
  /** true si se escribió (false en --simulacion). */
  escrito: boolean;
  /** Id de data/corridas/<id>/ escrita para esta fusión (undefined en --simulacion, o si scripts/lote.ts no existe bajo rootDir). */
  corridaId?: string;
  /** Comando exacto para aplicar la corrección: valida, la escribe en content/correcciones/ y aplica afecta/agrega. */
  comandoPromover: string;
}

export function fusionar(slugA: string, slugB: string, opciones: OpcionesFusionar): ResultadoFusionar {
  const rootDir = path.resolve(opciones.rootDir ?? RAIZ);
  const queda = opciones.queda;
  if (queda !== slugA && queda !== slugB) {
    throw new Error(
      `--queda "${queda}" tiene que ser uno de los dos ids fusionados ("${slugA}" o "${slugB}"): los ids no se renombran a un tercero ` +
        `(docs/colecciones/politicos.md, regla 7: "una persona con dos fichas es un error que se resuelve con una corrección, no con una tercera ficha").`,
    );
  }
  const inboxDir = opciones.inboxDir ? path.resolve(opciones.inboxDir) : undefined;
  const { fichaA, fichaB } = resolverParFichas(rootDir, slugA, slugB, inboxDir);

  const quedaEsA = queda === slugA;
  const fichaQueda = quedaEsA ? fichaA : fichaB;
  const fichaOtra = quedaEsA ? fichaB : fichaA;
  const descartado = slugA === slugB ? null : quedaEsA ? slugB : slugA;

  const avisos: string[] = [];

  const mandatos = unirMandatos(fichaQueda.datos.mandatos, fichaOtra.datos.mandatos);
  const alias = unirAlias(fichaQueda.datos.alias, fichaOtra.datos.alias);
  const aliasAmbiguos = unirAliasAmbiguos(fichaQueda.datos.alias_ambiguos, fichaOtra.datos.alias_ambiguos);
  const candidaturas = unirCandidaturas(fichaQueda.datos.candidaturas, fichaOtra.datos.candidaturas);

  avisos.push(...buscarColisionesAlias(rootDir, alias, new Set([slugA, slugB])));

  const { estado, avisoDiferencia } = elegirEstadoActual(fichaQueda.datos.estado_actual, fichaOtra.datos.estado_actual);
  if (avisoDiferencia) avisos.push(avisoDiferencia);
  const cambioSituacion = fichaQueda.datos.estado_actual?.situacion !== estado?.situacion;

  const revision = unirRevision(fichaQueda.datos.revision, fichaOtra.datos.revision);

  const ficha: Record<string, any> = { _slug: queda };
  ficha.nombre = elegirCampo(fichaQueda.datos.nombre, fichaOtra.datos.nombre);
  ficha.nombre_corto = elegirCampo(fichaQueda.datos.nombre_corto, fichaOtra.datos.nombre_corto);
  ficha.partido = elegirCampo(fichaQueda.datos.partido, fichaOtra.datos.partido);
  const wikidata = elegirCampo(fichaQueda.datos.wikidata, fichaOtra.datos.wikidata);
  if (wikidata) ficha.wikidata = wikidata;
  const foto = elegirCampo(fichaQueda.datos.foto, fichaOtra.datos.foto);
  if (foto) ficha.foto = foto;
  ficha.alias = alias;
  if (aliasAmbiguos.length) ficha.alias_ambiguos = aliasAmbiguos;
  ficha.mandatos = mandatos;
  if (candidaturas.length) ficha.candidaturas = candidaturas;
  ficha.estado_actual = estado;
  const cobertura = fichaQueda.datos.cobertura ?? fichaOtra.datos.cobertura;
  if (cobertura) ficha.cobertura = cobertura;
  ficha.revision = revision;
  // Procedencia por script (CLAUDE.md, "Procedencia obligatoria"): la fusión no es un agente ni sale
  // de un modelo, así que sin esto `pnpm promover` exigiría `_investigacion.modelo` para nada, ya
  // que en modo `--correccion` la procedencia final igual queda `{tipo: correccion, correccion}`
  // (ver scripts/promover.ts). `quitarCamposGuion` lo saca antes de escribir en content/, como a
  // `_slug`.
  ficha._investigacion = { script: 'lote.ts' };

  const { _slug, _investigacion, ...fichaSinSlug } = ficha;
  const validacionFicha = validarContraEsquema('politicos', fichaSinSlug, `politicos/${queda} (fusión)`);
  if (!validacionFicha.datos) {
    throw new Error(
      `La ficha fusionada de "${queda}" no valida contra src/schemas/politico.ts:\n${validacionFicha.errores.map((e) => `  ${e.campo}: ${e.mensaje}`).join('\n')}`,
    );
  }

  // ---------------------------------------------------------------------
  // Corrección: `afecta` es lo que ya existe en content/ y cambia; `agrega`, lo que no existía.
  // `tipo` se elige según lo que de verdad cambió: si el mandato nuevo mueve `estado_actual.situacion`,
  // la ficha publicada estaba afirmando algo que ya no es cierto (error_factual); si solo faltaban
  // mandatos de la otra cámara sin tocar la situación vigente, no había ningún dato falso, solo
  // trayectoria incompleta (contexto_omitido). Ninguno de los dos nombra bien "dos fichas de una
  // persona"; `presentacion` queda descartado a propósito (esto no es un cambio de forma).
  // ---------------------------------------------------------------------
  const fecha = opciones.fecha ?? new Date().toISOString().slice(0, 10);
  const quedaPublicada = existsSync(rutaFichaContent(rootDir, queda));
  const descartadoPublicado = descartado ? existsSync(rutaFichaContent(rootDir, descartado)) : false;

  const afecta: string[] = [];
  const agrega: string[] = [];
  if (quedaPublicada) afecta.push(`politicos/${queda}`);
  else agrega.push(`politicos/${queda}`);
  if (descartado && descartadoPublicado) afecta.push(`politicos/${descartado}`);

  const tipo: 'error_factual' | 'contexto_omitido' = cambioSituacion ? 'error_factual' : 'contexto_omitido';

  let motivo = descartado
    ? `La misma persona tenía dos fichas con ids distintos ("${slugA}" y "${slugB}"); quedan unificadas en "${queda}" con todos sus mandatos y las fuentes de las dos.`
    : 'La misma persona tenía dos fichas, una por cada cámara; quedan unificadas con todos sus mandatos y las fuentes de las dos.';
  if (cambioSituacion) {
    motivo += ` El estado publicado decía "${fichaQueda.datos.estado_actual?.situacion ?? '?'}" y, con el mandato que faltaba, pasa a "${estado?.situacion ?? '?'}".`;
  }

  const correccion: Record<string, any> = { fecha, tipo, desenlace: 'aceptada', afecta, motivo };
  if (agrega.length) correccion.agrega = agrega;
  if (descartado && descartadoPublicado) correccion.reemplaza = `politicos/${queda}`;
  correccion.revision = { tier: 'publicado' };

  const validacionCorreccion = validarContraEsquema('correcciones', correccion, `correcciones (fusión de ${queda})`);
  if (!validacionCorreccion.datos) {
    throw new Error(`La corrección generada no valida contra src/schemas/correccion.ts:\n${validacionCorreccion.errores.map((e) => `  ${e.campo}: ${e.mensaje}`).join('\n')}`);
  }
  // `_slug` no es parte del esquema de correcciones (se valida sin él, arriba): es el mismo
  // convenio que `<fecha>-<_slug>` de las correcciones publicadas, y lo usa `pnpm promover <dir>
  // --correccion <id>` para encontrar este registro en correcciones.yaml sin tener que adivinarlo.
  const slugCorreccion = `fusion-${queda}`;
  const idCorreccion = `${fecha}-${slugCorreccion}`;
  const correccionConSlug: Record<string, any> = { _slug: slugCorreccion, ...correccion };

  const dirCorreccion = path.join(rootDir, 'inbox', 'correcciones', fecha);
  const archivoFicha = path.join(dirCorreccion, 'politicos.yaml');
  const archivoCorreccion = path.join(dirCorreccion, 'correcciones.yaml');

  let escrito = false;
  let corridaId: string | undefined;
  if (!opciones.simulacion) {
    mkdirSync(dirCorreccion, { recursive: true });

    const listaFichas = existsSync(archivoFicha) ? (parseYaml(readFileSync(archivoFicha, 'utf8')) ?? []) : [];
    if (!Array.isArray(listaFichas)) throw new Error(`${archivoFicha} existe y no es una lista YAML.`);
    listaFichas.push(ficha);
    writeFileSync(archivoFicha, stringifyYaml(listaFichas, { lineWidth: 100 }), 'utf8');

    const listaCorrecciones = existsSync(archivoCorreccion) ? (parseYaml(readFileSync(archivoCorreccion, 'utf8')) ?? []) : [];
    if (!Array.isArray(listaCorrecciones)) throw new Error(`${archivoCorreccion} existe y no es una lista YAML.`);
    listaCorrecciones.push(correccionConSlug);
    writeFileSync(archivoCorreccion, stringifyYaml(listaCorrecciones, { lineWidth: 100 }), 'utf8');
    escrito = true;

    // Corrida (CLAUDE.md, "Procedencia obligatoria"): sin ella, `pnpm promover ... --correccion`
    // no tiene dónde escribir el rastro y se niega (exige data/corridas/<id>/brief.md). Guardado
    // detrás de existsSync porque algunos árboles de prueba no tienen scripts/lote.ts; en el repo
    // real siempre está (es este mismo archivo).
    const scriptAbs = path.join(rootDir, 'scripts', 'lote.ts');
    if (existsSync(scriptAbs)) {
      const scriptSha = hashDeArchivo(scriptAbs);
      const brief = [
        `# Corrida mecánica: fusión de fichas de política/politicos`,
        '',
        `Generada por \`pnpm lote fusionar ${slugA} ${slugB} --queda ${queda}\` (scripts/lote.ts, sha256 ${scriptSha}) el ${fecha}.`,
        '',
        'Qué hizo: unió mandatos, alias, alias_ambiguos y candidaturas de dos fichas de la misma persona ' +
          '(docs/colecciones/politicos.md, regla 7/8) en una sola, deduplicando mandatos por cargo+desde+hasta ' +
          'y fuentes por URL. No agrega ninguna fuente nueva: reordena y fusiona las que ya traía cada ficha.',
        '',
        `Fuente A: ${fichaA.origen}`,
        `Fuente B: ${fichaB.origen}`,
        '',
        `Resultado: queda "${queda}"${descartado ? ` (se retira "${descartado}")` : ''}, tipo de corrección "${tipo}".` +
          (avisos.length ? ` Avisos: ${avisos.join(' ')}` : ' Sin avisos.'),
        '',
        'Sin agente investigador ni crítico: es una fusión mecánica de dos fichas ya publicadas o ya cargadas, sin ningún dato nuevo. Ver critica.md.',
      ].join('\n');
      const corrida = escribirCorridaDeScript(rootDir, {
        fecha,
        sufijo: `fusion-${queda}`,
        brief,
        consultas: [],
        motivoSinCritica:
          'Corrección mecánica: sin crítica; ver brief.md. La fusión no incorpora ninguna fuente nueva ni afirma nada que las dos fichas no afirmaran ya por separado; solo unifica mandatos, alias y candidaturas ya publicados o ya cargados.',
        motivoSinRazones: 'corrección mecánica generada por script (pnpm lote fusionar); ver brief.md.',
      });
      corridaId = corrida.id;
    }
  }

  return {
    queda,
    descartado,
    ficha,
    correccion: correccionConSlug,
    origenA: fichaA.origen,
    origenB: fichaB.origen,
    avisos,
    archivoFicha: aPosix(path.relative(rootDir, archivoFicha)),
    archivoCorreccion: aPosix(path.relative(rootDir, archivoCorreccion)),
    escrito,
    corridaId,
    comandoPromover: `pnpm promover ${aPosix(path.relative(rootDir, dirCorreccion))} --correccion ${idCorreccion}${corridaId ? ` --corrida ${corridaId}` : ''}`,
  };
}

export interface FusionPendiente {
  slug: string;
  inboxDir: string;
  comando: string;
}

/** Lista las fusiones anotadas en inbox/senadores/fusion e inbox/diputados/fusion (ítem 2.8, 16 en total). */
export function fusionesPendientes(rootDir: string = RAIZ): FusionPendiente[] {
  const carpetas = ['inbox/senadores/fusion', 'inbox/diputados/fusion'];
  const salida: FusionPendiente[] = [];
  for (const carpeta of carpetas) {
    const archivo = path.join(rootDir, ...carpeta.split('/'), 'politicos.yaml');
    if (!existsSync(archivo)) continue;
    const datos = parseYaml(readFileSync(archivo, 'utf8'));
    if (!Array.isArray(datos)) continue;
    for (const item of datos) {
      const slug = item && typeof item === 'object' ? item._slug : undefined;
      if (typeof slug !== 'string') continue;
      salida.push({ slug, inboxDir: carpeta, comando: `pnpm lote fusionar ${slug} ${slug} --queda ${slug} --inbox ${carpeta}` });
    }
  }
  return salida;
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const AYUDA = `pnpm lote <subcomando> ...

  ver <dir-inbox> <coleccion> <n> [--completo] [--campo <ruta.con.puntos>]
      Registro n (base 0) de <dir-inbox>/<coleccion>.yaml, con las series largas
      resumidas. --completo lo imprime entero; --campo imprime solo ese campo, completo.

  fijar <dir-inbox> <coleccion> <n> <ruta.con.puntos> --valor <texto> | --desde-archivo <ruta>
      Escribe ese campo (índices de lista con corchetes: finanzas[3].nota) y reescribe
      el YAML. El valor de --valor se interpreta como YAML; --desde-archivo toma el
      contenido tal cual (para textos largos). Imprime el campo antes y después.

  resumen <coleccion>/<slug> [--archivo <ruta>]
      Resumen corto de una ficha de content/<coleccion>/<slug>.yaml (o de --archivo,
      un YAML del inbox): series cargadas, huecos, cantidades.

  objeciones <ruta-a-critica.md> [<registro>] [--prosa]
      Registros con objeción del bloque \`## Resumen\` de una critica.md (o el pedido
      nada más). --prosa agrega el bloque de objeción de cada uno.

  fusionar <slug-a> <slug-b> --queda <slug> [--fecha YYYY-MM-DD] [--inbox <dir>] [--simulacion]
      Une dos fichas de la misma persona (content/politicos/, o del inbox con --inbox si
      alguna todavía no está publicada): mandatos deduplicados por cargo+desde+hasta,
      alias sin duplicados, identidad de la ficha que queda salvo que esté vacía,
      estado_actual recalculado. No escribe en content/: deja la ficha y una corrección
      en inbox/correcciones/<fecha>/. --simulacion imprime todo sin escribir nada.

  fusionar --pendientes
      Lista las fusiones anotadas en inbox/senadores/fusion e inbox/diputados/fusion,
      con el comando exacto para cada una.`;

function main(): void {
  const { posicionales, opciones } = parsearArgs(process.argv.slice(2));
  const [sub, ...resto] = posicionales;
  if (!sub || opciones.ayuda || opciones.help) {
    console.log(AYUDA);
    process.exit(sub ? 0 : 1);
  }
  try {
    switch (sub) {
      case 'ver': {
        const [dir, coleccion, nStr] = resto;
        if (!dir || !coleccion || nStr === undefined) throw new Error('Uso: pnpm lote ver <dir-inbox> <coleccion> <n>');
        console.log(
          ver(dir, coleccion, Number(nStr), {
            completo: opciones.completo === true,
            campo: typeof opciones.campo === 'string' ? opciones.campo : undefined,
          }),
        );
        break;
      }
      case 'fijar': {
        const [dir, coleccion, nStr, ruta] = resto;
        if (!dir || !coleccion || nStr === undefined || !ruta) {
          throw new Error('Uso: pnpm lote fijar <dir-inbox> <coleccion> <n> <ruta.con.puntos> --valor <texto>');
        }
        const r = fijar(dir, coleccion, Number(nStr), ruta, {
          valor: typeof opciones.valor === 'string' ? opciones.valor : undefined,
          desdeArchivo: typeof opciones['desde-archivo'] === 'string' ? opciones['desde-archivo'] : undefined,
        });
        const comoTexto = (v: unknown) =>
          v === undefined ? '(sin valor)' : typeof v === 'object' && v !== null ? stringifyYaml(v, { lineWidth: 100 }).trimEnd() : String(v);
        console.log('antes:');
        console.log(comoTexto(r.antes));
        console.log('después:');
        console.log(comoTexto(r.despues));
        if (r.comentariosPerdidos) log.aviso(`${r.archivo} tenía comentarios (#): se pierden al reescribir con el parser de YAML.`);
        log.ok(`escrito ${r.archivo}`);
        break;
      }
      case 'resumen': {
        const [objetivo] = resto;
        if (!objetivo) throw new Error('Uso: pnpm lote resumen <coleccion>/<slug> [--archivo <ruta>]');
        console.log(resumen(objetivo, { archivo: typeof opciones.archivo === 'string' ? opciones.archivo : undefined }));
        break;
      }
      case 'objeciones': {
        const [rutaCritica, registro] = resto;
        if (!rutaCritica) throw new Error('Uso: pnpm lote objeciones <ruta-a-critica.md> [<registro>] [--prosa]');
        console.log(objeciones(rutaCritica, registro, { prosa: opciones.prosa === true }));
        break;
      }
      case 'fusionar': {
        if (opciones.pendientes === true) {
          const lista = fusionesPendientes();
          if (!lista.length) {
            console.log('No hay fusiones pendientes en inbox/senadores/fusion ni inbox/diputados/fusion.');
            break;
          }
          console.log(`${lista.length} fusión(es) pendiente(s):`);
          for (const f of lista) console.log(`  ${f.comando}`);
          break;
        }
        const [slugA, slugB] = resto;
        if (!slugA || !slugB) {
          throw new Error(
            'Uso: pnpm lote fusionar <slug-a> <slug-b> --queda <slug> [--fecha YYYY-MM-DD] [--inbox <dir>] [--simulacion]\n' +
              '   o: pnpm lote fusionar --pendientes',
          );
        }
        if (typeof opciones.queda !== 'string' || !opciones.queda) {
          throw new Error('Falta --queda <slug>: el id que sobrevive a la fusión (tiene que ser slug-a o slug-b).');
        }
        const r = fusionar(slugA, slugB, {
          queda: opciones.queda,
          fecha: typeof opciones.fecha === 'string' ? opciones.fecha : undefined,
          inboxDir: typeof opciones.inbox === 'string' ? opciones.inbox : undefined,
          simulacion: opciones.simulacion === true,
        });
        console.log(`ficha fusionada — queda: ${r.queda}${r.descartado ? ` (se retira: ${r.descartado})` : ''}`);
        console.log(`  fuente A: ${r.origenA}`);
        console.log(`  fuente B: ${r.origenB}`);
        console.log('');
        console.log(stringifyYaml(r.ficha, { lineWidth: 100 }).trimEnd());
        console.log('');
        console.log('corrección:');
        console.log(stringifyYaml(r.correccion, { lineWidth: 100 }).trimEnd());
        for (const a of r.avisos) log.aviso(a);
        if (r.escrito) log.ok(`escrito ${r.archivoFicha} y ${r.archivoCorreccion}`);
        else log.info('--simulacion: no se escribió nada.');
        if (r.corridaId) log.ok(`corrida mecánica: data/corridas/${r.corridaId}/ (sin agente ni crítico: brief.md, consultas.jsonl, critica.md y razones.md ya escritos).`);
        console.log(`para aplicar (valida y escribe content/correcciones/, después afecta/agrega): ${r.comandoPromover}`);
        break;
      }
      default:
        throw new Error(`Subcomando desconocido: "${sub}". Válidos: ver, fijar, resumen, objeciones, fusionar.`);
    }
    process.exit(0);
  } catch (e) {
    log.error((e as Error).message);
    process.exit(1);
  }
}

const esEntrada = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (esEntrada) main();
