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
 *
 * Todos los archivos del inbox son listas YAML de nivel superior: `n` es el
 * índice (base 0) dentro de esa lista.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';
import { COLECCIONES, definicionDeColeccion, type NombreColeccion } from '../src/schemas/comunes';
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

function leerListaInbox(dirInbox: string, coleccion: string): any[] {
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

interface ItemResumenCritica {
  registro: string;
  severidad: string;
  tipo: string;
  [k: string]: unknown;
}

/** Bloque ```yaml``` que sigue a `## Resumen`, formato nuevo de `.claude/agents/critico.md`. */
function extraerBloqueResumen(texto: string): ItemResumenCritica[] | null {
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

interface EncabezadoViejo {
  titulo: string;
  severidad: string | null;
  inicio: number;
  fin: number;
}

/** Críticas viejas, sin bloque `## Resumen`: cada `### ` con la primera línea `severidad:` que sigue. */
function extraerEncabezadosViejo(texto: string): EncabezadoViejo[] {
  const lineas = texto.split(/\r?\n/);
  const encabezados: { titulo: string; inicio: number }[] = [];
  lineas.forEach((l, i) => {
    if (/^### /.test(l)) encabezados.push({ titulo: l.replace(/^### /, '').trim(), inicio: i });
  });
  return encabezados.map((h, idx) => {
    const fin = idx + 1 < encabezados.length ? encabezados[idx + 1]!.inicio : lineas.length;
    let severidad: string | null = null;
    for (let j = h.inicio + 1; j < fin; j++) {
      if (/^#{1,2}\s/.test(lineas[j]!)) break;
      const m = /severidad:\s*\*{0,2}([a-záéíóúñ_]+)\*{0,2}/i.exec(lineas[j]!);
      if (m) {
        severidad = m[1]!.toLowerCase();
        break;
      }
    }
    return { titulo: h.titulo, severidad, inicio: h.inicio, fin };
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
      nada más). --prosa agrega el bloque de objeción de cada uno.`;

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
      default:
        throw new Error(`Subcomando desconocido: "${sub}". Válidos: ver, fijar, resumen, objeciones.`);
    }
    process.exit(0);
  } catch (e) {
    log.error((e as Error).message);
    process.exit(1);
  }
}

const esEntrada = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (esEntrada) main();
