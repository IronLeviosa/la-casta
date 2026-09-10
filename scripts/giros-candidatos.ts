#!/usr/bin/env tsx
/**
 * `pnpm giros:candidatos <politico> [--tema <slug>] [--inbox <dir>] [--n 15] [--json] [--escribir <dir-inbox>]`
 *
 * Plan 2026-09, fase 4, ítem 4.1. Lo que arregla: `docs/colecciones/giros.md` le pide al
 * investigador dejar en `notas.md` los pares de declaraciones que parecen un giro, y hoy eso
 * significa releer a mano las declaraciones publicadas de la persona (195 en la corrida que
 * originó este ítem, 9 giros armados) buscando dos que hablen de lo mismo y se contradigan.
 * Esto arma esa lista ordenada; el investigador y el editor deciden con las citas, este script
 * solo acota dónde mirar.
 *
 * Fuentes de declaraciones:
 *   - `content/declaraciones/<politico>/*.yaml`, ya publicadas.
 *   - con `--inbox <dir>`, además `<dir>/declaraciones.yaml` (crudo del investigador, sin
 *     `revision` ni `procedencia` todavía). El id es provisorio: `<politico>/<fecha>-<slug>`,
 *     con la misma derivación que usa `promover` (`derivarId` en `scripts/lib/inbox.ts`), para
 *     que si el par se confirma el editor pueda citar ese id sin inventarlo de nuevo.
 *
 * Se descartan los pares que ya son un giro publicado (`content/giros/<politico>/`, por
 * `declaracion_antes` + `declaracion_despues` exactos) y los que no llegan a 60 días de
 * diferencia: por debajo de eso no hay "antes" y "después" que comparar, hay la misma posición
 * dicha dos veces en la misma semana.
 *
 * El puntaje es texto contra texto — nunca lee `politico` más allá de para agrupar, y no existe
 * campo `partido` en una declaración. Compara `cita` + `resumen` de las dos declaraciones con
 * Jaccard sobre tokens normalizados (`scripts/lib/texto.ts`, sin tildes, sin palabras vacías) y
 * suma dos bonos chicos, no una probabilidad calibrada: uno cuando una de las dos declaraciones
 * tiene una marca de negación o promesa absoluta y la otra no (asimetría: "no vamos a" seguido,
 * meses después, de la misma frase sin el "no"), y otro cuando el contexto pasa de campaña a
 * gobierno. Nada de esto reemplaza leer las dos citas enteras: un puntaje alto puede ser el mismo
 * anuncio repetido dos veces, y uno bajo puede ser el giro más claro de la corrida si las dos
 * citas son cortas y comparten pocas palabras.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';
import { derivarId } from './lib/inbox.ts';
import { log, parsearArgs } from './lib/log.ts';
import { RAIZ } from './lib/rutas.ts';
import { normalizar, recortar } from './lib/texto.ts';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export interface DeclaracionCandidata {
  id: string;
  tema: string;
  fecha: string;
  contexto?: string;
  cita: string;
  resumen: string;
  titulo?: string;
  origen: 'publicada' | 'inbox';
}

export interface ParCandidato {
  antes: DeclaracionCandidata;
  despues: DeclaracionCandidata;
  puntaje: number;
  terminosComunes: string[];
  senales: string[];
}

export interface OpcionesGirosCandidatos {
  /** Restringe a declaraciones de este tema o su tema padre/hijo (misma regla que el emparejado). */
  tema?: string;
  /** Carpeta de una corrida del inbox con `declaraciones.yaml` (crudo, sin promover). */
  inboxDir?: string;
  /** Cuántos pares devolver, orden descendente de puntaje. */
  n?: number;
}

// ---------------------------------------------------------------------------
// Carga
// ---------------------------------------------------------------------------

/** Arma una candidata a partir de un YAML crudo (publicado o de inbox); null si le falta lo esencial. */
function aCandidata(id: string, crudo: Record<string, any>, origen: 'publicada' | 'inbox'): DeclaracionCandidata | null {
  if (!crudo || typeof crudo !== 'object') return null;
  const tema = typeof crudo.tema === 'string' ? crudo.tema : '';
  const fecha = typeof crudo.fecha === 'string' ? crudo.fecha : '';
  const cita = typeof crudo.cita === 'string' ? crudo.cita : '';
  if (!tema || !fecha || !cita) return null;
  return {
    id,
    tema,
    fecha,
    contexto: typeof crudo.contexto === 'string' ? crudo.contexto : undefined,
    cita,
    resumen: typeof crudo.resumen === 'string' ? crudo.resumen : '',
    titulo: typeof crudo.titulo === 'string' ? crudo.titulo : undefined,
    origen,
  };
}

/** Declaraciones publicadas de `content/declaraciones/<politico>/`. */
function cargarPublicadas(rootDir: string, politico: string): DeclaracionCandidata[] {
  const dir = path.join(rootDir, 'content', 'declaraciones', politico);
  if (!existsSync(dir)) return [];
  const salida: DeclaracionCandidata[] = [];
  for (const nombre of readdirSync(dir).sort()) {
    if (!/\.ya?ml$/i.test(nombre)) continue;
    const ruta = path.join(dir, nombre);
    let crudo: Record<string, any>;
    try {
      crudo = parseYaml(readFileSync(ruta, 'utf8')) as Record<string, any>;
    } catch (e) {
      log.aviso(`${ruta}: YAML inválido, se saltea (${(e as Error).message}).`);
      continue;
    }
    const id = `${politico}/${nombre.replace(/\.ya?ml$/i, '')}`;
    const c = aCandidata(id, crudo, 'publicada');
    if (c) salida.push(c);
    else log.aviso(`${ruta}: sin tema, fecha o cita; se saltea.`);
  }
  return salida;
}

/** Declaraciones crudas de `<inboxDir>/declaraciones.yaml`, con id provisorio (misma derivación que `promover`). */
function cargarDeInbox(inboxDir: string, politico: string, usados: Set<string>): DeclaracionCandidata[] {
  const ruta = path.join(inboxDir, 'declaraciones.yaml');
  if (!existsSync(ruta)) {
    log.aviso(`no existe ${ruta}; se listan solo las declaraciones publicadas.`);
    return [];
  }
  const datos = parseYaml(readFileSync(ruta, 'utf8'));
  if (datos === null || datos === undefined) return [];
  if (!Array.isArray(datos)) throw new Error(`${ruta}: se esperaba una lista YAML de declaraciones.`);
  const salida: DeclaracionCandidata[] = [];
  for (const crudo of datos as Record<string, any>[]) {
    if (!crudo || typeof crudo !== 'object') continue;
    if (String(crudo.politico ?? '') !== politico) continue; // esta corrida trae otra persona
    if (!crudo.fecha) {
      log.aviso(`${ruta}: un registro sin fecha; se saltea (no se le puede derivar id).`);
      continue;
    }
    const id = derivarId('declaraciones', crudo, usados);
    const c = aCandidata(id, crudo, 'inbox');
    if (c) salida.push(c);
    else log.aviso(`${ruta}: ${id} sin tema o cita; se saltea.`);
  }
  return salida;
}

/** Pares ya publicados como giro (`declaracion_antes|declaracion_despues`), para no repetirlos. */
function cargarGirosPublicados(rootDir: string, politico: string): Set<string> {
  const dir = path.join(rootDir, 'content', 'giros', politico);
  const set = new Set<string>();
  if (!existsSync(dir)) return set;
  for (const nombre of readdirSync(dir).sort()) {
    if (!/\.ya?ml$/i.test(nombre)) continue;
    let crudo: Record<string, any>;
    try {
      crudo = parseYaml(readFileSync(path.join(dir, nombre), 'utf8')) as Record<string, any>;
    } catch {
      continue; // un giro roto no es asunto de este script; lo dice pnpm validar
    }
    if (crudo?.declaracion_antes && crudo?.declaracion_despues) {
      set.add(`${crudo.declaracion_antes}|${crudo.declaracion_despues}`);
    }
  }
  return set;
}

// ---------------------------------------------------------------------------
// Tema (mismo tema o tema padre/hijo)
// ---------------------------------------------------------------------------

function raizTema(tema: string): string {
  const i = tema.indexOf('/');
  return i === -1 ? tema : tema.slice(0, i);
}

/** economia/impuestos y economia matchean (uno es la raíz del otro); economia/impuestos y economia/combustibles no. */
export function mismoTemaOPadre(a: string, b: string): boolean {
  if (a === b) return true;
  return raizTema(a) === b || raizTema(b) === a;
}

// ---------------------------------------------------------------------------
// Puntaje: texto contra texto, nunca persona ni partido
// ---------------------------------------------------------------------------

const DIAS_MINIMOS = 60;

/** Palabras funcionales sin peso temático. "no"/"nunca"/"jamás" quedan afuera: son la señal de
 * negación, no un término de solapamiento, y contarlas ahí las duplicaría en las dos cuentas. */
const PALABRAS_VACIAS = new Set([
  'de', 'del', 'la', 'las', 'el', 'los', 'un', 'una', 'unos', 'unas', 'y', 'o', 'u', 'e', 'a', 'al',
  'en', 'que', 'con', 'por', 'para', 'se', 'su', 'sus', 'lo', 'le', 'les', 'me', 'mi', 'mis', 'tu',
  'tus', 'es', 'son', 'fue', 'fueron', 'ser', 'esta', 'estan', 'estaba', 'esto', 'eso', 'ese', 'esa',
  'este', 'aquel', 'aquella', 'como', 'mas', 'pero', 'si', 'no', 'nunca', 'jamas', 'ya', 'muy',
  'sobre', 'entre', 'hasta', 'desde', 'cuando', 'donde', 'porque', 'pues', 'asi', 'tan', 'tanto',
  'todo', 'toda', 'todos', 'todas', 'nos', 'va', 'van', 'vamos', 'ir', 'iba', 'dijo', 'dice',
]);

function tokenizar(texto: string): Set<string> {
  const normal = normalizar(texto);
  const palabras = normal.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  return new Set(palabras.filter((p) => !PALABRAS_VACIAS.has(p)));
}

function jaccard(a: Set<string>, b: Set<string>): { puntaje: number; comunes: string[] } {
  if (a.size === 0 || b.size === 0) return { puntaje: 0, comunes: [] };
  const comunes = [...a].filter((t) => b.has(t));
  const union = new Set([...a, ...b]).size;
  return { puntaje: union === 0 ? 0 : comunes.length / union, comunes };
}

/** Negación o promesa absoluta: "no", "nunca", "jamás", "se terminó", "no vamos a". */
const MARCAS_NEGACION: RegExp[] = [/\bno\b/, /\bnunca\b/, /\bjamas\b/, /\bse termino\b/, /\bno vamos a\b/];

function tieneMarcaDeNegacion(texto: string): boolean {
  const normal = normalizar(texto);
  return MARCAS_NEGACION.some((re) => re.test(normal));
}

/** Bonos chicos, no una probabilidad: separados para que se puedan ajustar sin tocar el resto. */
const BONO_NEGACION = 0.15;
const BONO_CONTEXTO = 0.1;

function diasEntre(antes: string, despues: string): number {
  return Math.round((Date.parse(despues) - Date.parse(antes)) / 86_400_000);
}

/** Puntaje de un par ya ordenado (antes.fecha < despues.fecha). Solo mira cita/resumen/contexto. */
export function calificarPar(antes: DeclaracionCandidata, despues: DeclaracionCandidata): ParCandidato {
  const textoAntes = `${antes.cita} ${antes.resumen}`;
  const textoDespues = `${despues.cita} ${despues.resumen}`;
  const { puntaje: solapamiento, comunes } = jaccard(tokenizar(textoAntes), tokenizar(textoDespues));

  const senales: string[] = [];
  let puntaje = solapamiento;

  if (tieneMarcaDeNegacion(textoAntes) !== tieneMarcaDeNegacion(textoDespues)) {
    puntaje += BONO_NEGACION;
    senales.push('negación');
  }
  if (antes.contexto === 'campaña' && despues.contexto === 'gobierno') {
    puntaje += BONO_CONTEXTO;
    senales.push('contexto');
  }

  const terminosComunes = comunes.sort((a, b) => b.length - a.length || a.localeCompare(b)).slice(0, 8);
  return { antes, despues, puntaje: Math.min(1, puntaje), terminosComunes, senales };
}

/** Todos los pares válidos (mismo tema o tema padre, 60+ días, no ya publicado), ordenados por puntaje. */
export function generarPares(declaraciones: DeclaracionCandidata[], girosPublicados: Set<string>): ParCandidato[] {
  const ordenadas = [...declaraciones].sort((a, b) => a.fecha.localeCompare(b.fecha) || a.id.localeCompare(b.id));
  const pares: ParCandidato[] = [];
  for (let i = 0; i < ordenadas.length; i++) {
    for (let j = i + 1; j < ordenadas.length; j++) {
      const antes = ordenadas[i];
      const despues = ordenadas[j];
      if (antes.fecha === despues.fecha) continue; // sin orden posible dentro del mismo día
      if (!mismoTemaOPadre(antes.tema, despues.tema)) continue;
      if (diasEntre(antes.fecha, despues.fecha) < DIAS_MINIMOS) continue;
      if (girosPublicados.has(`${antes.id}|${despues.id}`)) continue;
      pares.push(calificarPar(antes, despues));
    }
  }
  pares.sort((a, b) => b.puntaje - a.puntaje || a.antes.id.localeCompare(b.antes.id) || a.despues.id.localeCompare(b.despues.id));
  return pares;
}

// ---------------------------------------------------------------------------
// Función pública
// ---------------------------------------------------------------------------

export function girosCandidatos(rootDir: string, politico: string, opciones: OpcionesGirosCandidatos = {}): ParCandidato[] {
  const publicadas = cargarPublicadas(rootDir, politico);
  const usados = new Set(publicadas.map((d) => d.id));
  const deInbox = opciones.inboxDir ? cargarDeInbox(opciones.inboxDir, politico, usados) : [];
  let todas = [...publicadas, ...deInbox];
  if (opciones.tema) todas = todas.filter((d) => mismoTemaOPadre(d.tema, opciones.tema!));
  const girosPublicados = cargarGirosPublicados(rootDir, politico);
  const pares = generarPares(todas, girosPublicados);
  const n = opciones.n && opciones.n > 0 ? Math.floor(opciones.n) : 15;
  return pares.slice(0, n);
}

// ---------------------------------------------------------------------------
// Presentación
// ---------------------------------------------------------------------------

function tituloRecortado(d: DeclaracionCandidata): string {
  const base = d.titulo && d.titulo.trim() ? d.titulo : d.resumen;
  return recortar(base, 90);
}

function formatearTexto(pares: ParCandidato[], politico: string): string {
  if (pares.length === 0) return `Sin pares candidatos para "${politico}" con los filtros dados.\n`;
  const lineas: string[] = [];
  for (const p of pares) {
    lineas.push(`antes: ${p.antes.id} · ${p.antes.fecha} · ${tituloRecortado(p.antes)}`);
    lineas.push(`después: ${p.despues.id} · ${p.despues.fecha} · ${tituloRecortado(p.despues)}`);
    const terminos = p.terminosComunes.length ? p.terminosComunes.join(', ') : '—';
    const senales = p.senales.length ? p.senales.join('/') : 'ninguna';
    lineas.push(`puntaje: ${p.puntaje.toFixed(2)} · términos comunes: ${terminos} · señales: ${senales}`);
    lineas.push('');
  }
  return lineas.join('\n');
}

function aJson(p: ParCandidato) {
  return {
    antes: { id: p.antes.id, fecha: p.antes.fecha, titulo: tituloRecortado(p.antes) },
    despues: { id: p.despues.id, fecha: p.despues.fecha, titulo: tituloRecortado(p.despues) },
    puntaje: Number(p.puntaje.toFixed(2)),
    terminos_comunes: p.terminosComunes,
    senales: p.senales,
  };
}

/** Línea que espera el editor en `## candidatos_giro` de `notas.md` (ver docs/colecciones/giros.md). */
function lineaNotas(p: ParCandidato): string {
  const terminos = p.terminosComunes.length ? p.terminosComunes.join(', ') : 'ninguno';
  const senales = p.senales.length ? p.senales.join(', ') : 'ninguna';
  return `- antes: ${p.antes.id}; después: ${p.despues.id}; por qué: términos comunes ${terminos} — señales ${senales}; falta: leer las dos citas`;
}

/** Agrega los pares al final de la sección `## candidatos_giro` de `<dir>/notas.md` (la crea si falta). */
function escribirEnNotas(dir: string, pares: ParCandidato[]): void {
  mkdirSync(dir, { recursive: true });
  const ruta = path.join(dir, 'notas.md');
  const encabezado = '## candidatos_giro';
  const previo = existsSync(ruta) ? readFileSync(ruta, 'utf8') : '';
  const lineas = previo.length ? previo.split(/\r?\n/) : [];
  const nuevas = pares.map(lineaNotas);
  const idx = lineas.findIndex((l) => l.trim() === encabezado);
  let salida: string[];
  if (idx === -1) {
    salida = [...lineas];
    if (salida.length && salida[salida.length - 1].trim() !== '') salida.push('');
    salida.push(encabezado, '', ...nuevas);
  } else {
    let fin = lineas.length;
    for (let i = idx + 1; i < lineas.length; i++) {
      if (/^##\s+/.test(lineas[i])) {
        fin = i;
        break;
      }
    }
    while (fin > idx + 1 && lineas[fin - 1].trim() === '') fin--;
    salida = [...lineas.slice(0, fin), ...nuevas, ...lineas.slice(fin)];
  }
  writeFileSync(ruta, salida.join('\n').replace(/\n*$/, '\n'));
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function main(): void {
  const { posicionales, opciones } = parsearArgs(process.argv.slice(2));
  const politico = posicionales[0];
  if (!politico) {
    process.stderr.write(
      'Uso: pnpm giros:candidatos <politico> [--tema <slug>] [--inbox <dir>] [--n 15] [--json] [--escribir <dir-inbox>]\n\n' +
        '  Empareja declaraciones publicadas (y, con --inbox, las crudas de esa corrida) de la misma\n' +
        '  persona: mismo tema o tema padre, 60+ días de diferencia, sin repetir un giro ya publicado.\n' +
        '  --tema       restringe a ese tema (o su padre/hijo).\n' +
        '  --inbox      carpeta de una corrida con declaraciones.yaml sin promover.\n' +
        '  --n          cuántos pares devolver (por defecto 15).\n' +
        '  --json       lista de objetos en vez de texto.\n' +
        '  --escribir   agrega los pares a ## candidatos_giro de <dir>/notas.md.\n',
    );
    process.exit(1);
  }

  const tema = typeof opciones.tema === 'string' ? opciones.tema : undefined;
  const inboxDir = typeof opciones.inbox === 'string' ? path.resolve(opciones.inbox) : undefined;
  const n = opciones.n !== undefined ? Number(opciones.n) : undefined;

  const pares = girosCandidatos(RAIZ, politico, { tema, inboxDir, n });

  if (typeof opciones.escribir === 'string') {
    const dir = path.resolve(opciones.escribir);
    if (pares.length === 0) {
      log.aviso('sin pares candidatos; no se tocó notas.md.');
    } else {
      escribirEnNotas(dir, pares);
      log.ok(`agregados ${pares.length} par(es) a ${path.join(dir, 'notas.md')} bajo "## candidatos_giro".`);
    }
  }

  if (opciones.json === true) {
    process.stdout.write(JSON.stringify(pares.map(aJson), null, 1) + '\n');
    return;
  }
  process.stdout.write(formatearTexto(pares, politico));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
