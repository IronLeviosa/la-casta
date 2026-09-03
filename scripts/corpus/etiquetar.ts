/**
 * Etiquetado del corpus.
 *   1. Determinista, sin tokens: alias de content/politicos, content/temas, content/eventos y data/alias.yaml.
 *   2. Haiku via `claude -p --agent etiquetador` (sin API keys): confirma, agrega temas/eventos, resumen.
 *      `etiquetarConHaiku(nota)` solo encola el trabajo; `ejecutarEtiquetadoConClaude(id)` lo corre el worker.
 */
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { hostname } from 'node:os';
import { parse as parseYaml, stringify as aYaml } from 'yaml';
import { RAIZ, RUTAS_CONTENIDO, RUTAS_CORPUS } from '../lib/rutas.ts';
import { posicionesDeAlias } from '../lib/texto.ts';
import { buscarClaude, ejecutarSync } from '../lib/ejecutable.ts';
import { log, parsearArgs } from '../lib/log.ts';
import { etiquetasVacias, type Etiquetas, type Mencion, type Nota, type OrigenEtiqueta } from './tipos.ts';
import { agregarTrabajo, listarTrabajos } from '../cola.ts';

export interface EntradaTaxonomia {
  slug: string;
  nombre: string;
  alias: string[];
  /** Para politicos: partido; para eventos: temas enlazados. */
  partido?: string;
  temas?: string[];
  /** Para eventos, rango de fechas (filtra falsos positivos si la nota tiene fecha). */
  inicio?: string;
  fin?: string;
}

export interface Taxonomia {
  politicos: EntradaTaxonomia[];
  partidos: EntradaTaxonomia[];
  temas: EntradaTaxonomia[];
  eventos: EntradaTaxonomia[];
}

function leerYaml(ruta: string): Record<string, unknown> | null {
  try {
    const d = parseYaml(readFileSync(ruta, 'utf8'));
    return d && typeof d === 'object' ? (d as Record<string, unknown>) : null;
  } catch (e) {
    log.aviso(`YAML ilegible ${relative(RAIZ, ruta)}: ${(e as Error).message}`);
    return null;
  }
}

function* archivosYaml(carpeta: string): Generator<string> {
  if (!existsSync(carpeta)) return;
  for (const f of readdirSync(carpeta).sort()) {
    const ruta = join(carpeta, f);
    if (statSync(ruta).isDirectory()) yield* archivosYaml(ruta);
    else if (/\.ya?ml$/i.test(f)) yield ruta;
  }
}

function comoLista(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(String).map((s) => s.trim()).filter(Boolean);
  if (typeof v === 'string' && v.trim()) return [v.trim()];
  return [];
}

function slugDeArchivo(ruta: string, base: string): string {
  return relative(base, ruta).replace(/\.ya?ml$/i, '').split(sep).join('/').replace(/\/(index|_index)$/, '');
}

/** Lee una coleccion de YAML (recursiva) y devuelve entradas con slug + alias. */
function leerColeccion(carpeta: string): EntradaTaxonomia[] {
  const salida: EntradaTaxonomia[] = [];
  for (const ruta of archivosYaml(carpeta)) {
    const d = leerYaml(ruta);
    if (!d) continue;
    const slug = String(d.slug ?? d.id ?? slugDeArchivo(ruta, carpeta));
    const nombre = String(d.nombre ?? d.titulo ?? d.name ?? slug);
    const alias = [...new Set([nombre, ...comoLista(d.alias), ...comoLista(d.aliases)])];
    salida.push({
      slug,
      nombre,
      alias,
      partido: typeof d.partido === 'string' ? d.partido : undefined,
      temas: comoLista(d.temas),
      inicio: typeof d.inicio === 'string' ? d.inicio : typeof d.fecha_inicio === 'string' ? d.fecha_inicio : undefined,
      fin: typeof d.fin === 'string' ? d.fin : typeof d.fecha_fin === 'string' ? d.fecha_fin : undefined,
    });
  }
  return salida;
}

/** data/alias.yaml: acepta `{politicos: {slug: [alias]}}` o `{politicos: [{slug, alias}]}`; idem partidos. */
function leerAliasExtra(): { politicos: EntradaTaxonomia[]; partidos: EntradaTaxonomia[] } {
  const salida = { politicos: [] as EntradaTaxonomia[], partidos: [] as EntradaTaxonomia[] };
  if (!existsSync(RUTAS_CONTENIDO.alias)) return salida;
  const d = leerYaml(RUTAS_CONTENIDO.alias);
  if (!d) return salida;
  for (const clave of ['politicos', 'partidos'] as const) {
    const v = d[clave];
    if (Array.isArray(v)) {
      for (const e of v as Record<string, unknown>[]) {
        if (!e || typeof e !== 'object' || !e.slug) continue;
        salida[clave].push({ slug: String(e.slug), nombre: String(e.nombre ?? e.slug), alias: [...comoLista(e.nombre), ...comoLista(e.alias)], partido: typeof e.partido === 'string' ? e.partido : undefined });
      }
    } else if (v && typeof v === 'object') {
      for (const [slug, alias] of Object.entries(v as Record<string, unknown>)) {
        const a = Array.isArray(alias) ? comoLista(alias) : alias && typeof alias === 'object' ? comoLista((alias as Record<string, unknown>).alias) : comoLista(alias);
        const nombre = alias && typeof alias === 'object' && !Array.isArray(alias) ? String((alias as Record<string, unknown>).nombre ?? slug) : slug;
        salida[clave].push({ slug, nombre, alias: [...new Set([nombre !== slug ? nombre : '', ...a].filter(Boolean))] });
      }
    }
  }
  return salida;
}

function fusionarEntradas(...listas: EntradaTaxonomia[][]): EntradaTaxonomia[] {
  const porSlug = new Map<string, EntradaTaxonomia>();
  for (const lista of listas) {
    for (const e of lista) {
      const previa = porSlug.get(e.slug);
      if (!previa) porSlug.set(e.slug, { ...e, alias: [...e.alias] });
      else {
        previa.alias = [...new Set([...previa.alias, ...e.alias])];
        previa.partido ??= e.partido;
        previa.temas = [...new Set([...(previa.temas ?? []), ...(e.temas ?? [])])];
      }
    }
  }
  return [...porSlug.values()];
}

let taxonomiaCache: Taxonomia | null = null;

/** Carga (y cachea) la taxonomia desde content/ y data/alias.yaml. Si las carpetas estan vacias, listas vacias. */
export function cargarTaxonomia(forzar = false): Taxonomia {
  if (taxonomiaCache && !forzar) return taxonomiaCache;
  const extra = leerAliasExtra();
  taxonomiaCache = {
    politicos: fusionarEntradas(leerColeccion(RUTAS_CONTENIDO.politicos), extra.politicos),
    partidos: extra.partidos,
    temas: leerColeccion(RUTAS_CONTENIDO.temas),
    eventos: leerColeccion(RUTAS_CONTENIDO.eventos),
  };
  return taxonomiaCache;
}

/**
 * Etiquetado determinista por alias. Sin red, sin tokens.
 * `titulo` cuenta para detectar la etiqueta (un video puede nombrar al politico solo en el titulo),
 * pero las `menciones` con posicion se calculan solo sobre `texto`.
 */
export function etiquetarPorAlias(texto: string, fechaNota?: string | null, taxonomia = cargarTaxonomia(), titulo?: string | null): Etiquetas {
  const e = etiquetasVacias();
  const menciones: Mencion[] = [];
  const conTitulo = titulo && titulo.trim() ? `${titulo.trim()}\n${texto}` : texto;
  for (const p of taxonomia.politicos) {
    const pos = posicionesDeAlias(texto, p.alias);
    if (!pos.length && !posicionesDeAlias(conTitulo, p.alias).length) continue;
    e.politicos.push(p.slug);
    e.origen[p.slug] = 'alias';
    for (const x of pos) menciones.push({ politico: p.slug, posicion: x });
  }
  for (const p of taxonomia.partidos) {
    if (posicionesDeAlias(conTitulo, p.alias).length) {
      e.partidos.push(p.slug);
      e.origen[p.slug] = 'alias';
    }
  }
  for (const t of taxonomia.temas) {
    if (posicionesDeAlias(conTitulo, t.alias.filter((a) => a !== t.slug)).length) {
      e.temas.push(t.slug);
      e.origen[t.slug] = 'alias';
    }
  }
  for (const ev of taxonomia.eventos) {
    if (!posicionesDeAlias(conTitulo, ev.alias.filter((a) => a !== ev.slug)).length) continue;
    // Si la nota es anterior al inicio del evento, es otro asunto con nombre parecido.
    if (fechaNota && ev.inicio && fechaNota < ev.inicio.slice(0, 10)) continue;
    e.eventos.push(ev.slug);
    e.origen[ev.slug] = 'alias';
  }
  e.menciones = menciones.sort((a, b) => a.posicion - b.posicion);
  return e;
}

/** Suma etiquetas nuevas a las existentes (sin duplicar) marcando el origen. */
export function fusionarEtiquetas(base: Etiquetas, nuevas: Partial<Etiquetas>, origen: OrigenEtiqueta): Etiquetas {
  const salida: Etiquetas = { ...etiquetasVacias(), ...base, origen: { ...base.origen } };
  for (const clave of ['politicos', 'partidos', 'temas', 'eventos'] as const) {
    for (const slug of nuevas[clave] ?? []) {
      if (!salida[clave].includes(slug)) {
        salida[clave].push(slug);
        salida.origen[slug] = origen;
      }
    }
  }
  if (nuevas.menciones?.length) {
    const vistas = new Set(salida.menciones.map((m) => `${m.politico}@${m.posicion}`));
    for (const m of nuevas.menciones) if (!vistas.has(`${m.politico}@${m.posicion}`)) salida.menciones.push(m);
    salida.menciones.sort((a, b) => a.posicion - b.posicion);
  }
  if (nuevas.fechas_mencionadas?.length) salida.fechas_mencionadas = [...new Set([...(salida.fechas_mencionadas ?? []), ...nuevas.fechas_mencionadas])];
  return salida;
}

// ---------------------------------------------------------------------------
// Haiku via Claude Code (sin API keys en este proyecto)
// ---------------------------------------------------------------------------

/**
 * No llama a ninguna API: encola un trabajo `etiquetar` que el worker corre con `claude -p`.
 * Devuelve el id del trabajo, o null si no se pudo encolar (no fatal).
 */
export function etiquetarConHaiku(nota: Pick<Nota, 'id'>): string | null {
  try {
    // Si ya hay un trabajo pendiente para esta nota (por ejemplo tras `pnpm fuente --forzar`),
    // no encolamos otro: el etiquetado cuesta tokens y el resultado seria el mismo.
    const pendiente = listarTrabajos('pendiente').find((t) => t.tipo === 'etiquetar' && t.params?.nota === nota.id);
    if (pendiente) {
      log.debug(`ya hay un etiquetado pendiente para ${nota.id} (${pendiente.id})`);
      return pendiente.id;
    }
    const t = agregarTrabajo('etiquetar', { nota: nota.id });
    return t.id;
  } catch (e) {
    log.aviso(`no se pudo encolar el etiquetado de ${nota.id}: ${(e as Error).message}`);
    return null;
  }
}

const RUTA_AGENTE = join(RUTAS_CONTENIDO.agentes, 'etiquetador.md');
const MAX_CHARS_TEXTO = 14_000;

const INSTRUCCIONES_FALLBACK = `Sos el etiquetador del corpus de La Casta (politica uruguaya). Recibis una nota y la taxonomia vigente.
Devolves SOLO un objeto JSON, sin texto alrededor ni bloques de codigo, con esta forma:
{"temas": ["slug"], "eventos": ["slug"], "partidos": ["slug"],
 "politicos_confirmados": [{"slug": "lacalle-pou", "posiciones": [120, 843]}],
 "resumen": "dos lineas neutras en espanol", "fechas_mencionadas": ["YYYY-MM-DD"],
 "propuestas_taxonomia": [{"tipo": "tema", "slug": "economia/deuda-publica", "alias": ["deuda"], "motivo": "..."}]}
Reglas: usa solo slugs de la taxonomia; en politicos_confirmados va la lista final (sacando los falsos positivos
que detecto el paso por alias); si falta un tema o evento, proponelo en propuestas_taxonomia y no lo uses como etiqueta.`;

/**
 * Forma de la respuesta. La canonica es la de `.claude/agents/etiquetador.md`
 * (`politicos_confirmados`, `propuestas_taxonomia`); tambien aceptamos las claves planas
 * (`politicos`, `descartar_politicos`, `propuestas`) por si el modelo simplifica.
 */
export interface RespuestaEtiquetador {
  politicos_confirmados?: { slug: string; posiciones?: number[] }[];
  politicos?: string[];
  descartar_politicos?: string[];
  partidos?: string[];
  temas?: string[];
  eventos?: string[];
  resumen?: string;
  fechas_mencionadas?: string[];
  propuestas_taxonomia?: { tipo: string; slug: string; alias?: string[]; motivo?: string; por_que?: string; desde?: string }[];
  propuestas?: { tipo: string; slug: string; alias?: string[]; motivo?: string; por_que?: string; desde?: string }[];
}

/** Une las dos formas posibles de la respuesta en una sola estructura. */
function normalizarRespuesta(r: RespuestaEtiquetador): {
  politicos: string[];
  menciones: Mencion[];
  /** null = el modelo no se pronuncio sobre los politicos; [] = dijo que ninguno vale. */
  confirmoPoliticos: boolean;
  descartar: string[];
  partidos: string[];
  temas: string[];
  eventos: string[];
  resumen: string | null;
  fechas: string[];
  propuestas: { tipo: string; slug: string; alias?: string[]; motivo?: string; desde?: string }[];
} {
  const confirmados = Array.isArray(r.politicos_confirmados) ? r.politicos_confirmados : null;
  const politicos = confirmados ? confirmados.map((p) => String(p?.slug ?? '')).filter(Boolean) : comoLista(r.politicos);
  const menciones: Mencion[] = [];
  for (const p of confirmados ?? []) {
    if (!p?.slug) continue;
    for (const pos of Array.isArray(p.posiciones) ? p.posiciones : []) {
      if (Number.isFinite(pos) && pos >= 0) menciones.push({ politico: String(p.slug), posicion: Math.trunc(Number(pos)) });
    }
  }
  const propuestas = [...(r.propuestas_taxonomia ?? []), ...(r.propuestas ?? [])]
    .filter((p) => p && p.slug && p.tipo)
    .map((p) => ({ tipo: String(p.tipo), slug: String(p.slug), alias: comoLista(p.alias), motivo: String(p.motivo ?? p.por_que ?? ''), desde: p.desde ? String(p.desde) : undefined }));
  return {
    politicos,
    menciones,
    confirmoPoliticos: confirmados !== null,
    descartar: comoLista(r.descartar_politicos),
    partidos: comoLista(r.partidos),
    temas: comoLista(r.temas),
    eventos: comoLista(r.eventos),
    resumen: typeof r.resumen === 'string' && r.resumen.trim() ? r.resumen.trim() : null,
    fechas: comoLista(r.fechas_mencionadas).filter((f) => /^\d{4}(-\d{2}){0,2}$/.test(f)),
    propuestas,
  };
}

function armarPrompt(nota: Nota, taxonomia: Taxonomia): string {
  const texto = nota.texto.length > MAX_CHARS_TEXTO ? nota.texto.slice(0, MAX_CHARS_TEXTO) + '\n[… texto recortado …]' : nota.texto;
  const lista = (l: EntradaTaxonomia[]) => (l.length ? l.map((e) => `- ${e.slug}: ${e.nombre}`).join('\n') : '(vacio)');
  return [
    'TAXONOMIA VIGENTE',
    `Politicos:\n${lista(taxonomia.politicos)}`,
    `Partidos:\n${lista(taxonomia.partidos)}`,
    `Temas:\n${lista(taxonomia.temas)}`,
    `Eventos:\n${lista(taxonomia.eventos)}`,
    '',
    'ETIQUETAS ACTUALES (por alias, pueden tener falsos positivos)',
    JSON.stringify({ politicos: nota.etiquetas.politicos, partidos: nota.etiquetas.partidos, temas: nota.etiquetas.temas, eventos: nota.etiquetas.eventos }),
    '',
    'NOTA',
    `id: ${nota.id}`,
    `medio: ${nota.medio} · fecha: ${nota.fecha ?? '?'} · titulo: ${nota.titulo ?? '?'} · url: ${nota.url_canonica}`,
    '---',
    texto,
    '---',
    'Responde SOLO con el objeto JSON pedido.',
  ].join('\n');
}

/** Extrae el primer objeto JSON de una respuesta que puede traer texto o ```json alrededor. */
export function extraerJson(texto: string): RespuestaEtiquetador | null {
  const limpio = texto.replace(/```(?:json)?/gi, '').trim();
  const ini = limpio.indexOf('{');
  const fin = limpio.lastIndexOf('}');
  if (ini < 0 || fin <= ini) return null;
  try {
    return JSON.parse(limpio.slice(ini, fin + 1)) as RespuestaEtiquetador;
  } catch {
    return null;
  }
}

export function leerNota(id: string): Nota | null {
  const ruta = join(RUTAS_CORPUS.notas, `${id}.json`);
  return existsSync(ruta) ? (JSON.parse(readFileSync(ruta, 'utf8')) as Nota) : null;
}

export function guardarNota(nota: Nota): string {
  const ruta = join(RUTAS_CORPUS.notas, `${nota.id}.json`);
  writeFileSync(ruta, JSON.stringify(nota, null, 1), 'utf8');
  return ruta;
}

interface PropuestaNormalizada {
  tipo: string;
  slug: string;
  alias?: string[];
  motivo?: string;
  desde?: string;
}

function registrarPropuestas(notaId: string, propuestas: PropuestaNormalizada[]): number {
  if (!propuestas?.length) return 0;
  let datos: { propuestas: Record<string, unknown>[] } = { propuestas: [] };
  if (existsSync(RUTAS_CORPUS.propuestasTaxonomia)) {
    const d = leerYaml(RUTAS_CORPUS.propuestasTaxonomia);
    if (d && Array.isArray(d.propuestas)) datos = { propuestas: d.propuestas as Record<string, unknown>[] };
  }
  let nuevas = 0;
  for (const p of propuestas) {
    if (!p?.slug || !p?.tipo) continue;
    const existente = datos.propuestas.find((x) => x.slug === p.slug && x.tipo === p.tipo);
    if (existente) {
      const notas = Array.isArray(existente.notas) ? (existente.notas as string[]) : [];
      if (!notas.includes(notaId)) notas.push(notaId);
      existente.notas = notas;
    } else {
      datos.propuestas.push({
        tipo: p.tipo,
        slug: p.slug,
        alias: p.alias ?? [],
        motivo: p.motivo ?? '',
        ...(p.desde ? { desde: p.desde } : {}),
        notas: [notaId],
        propuesta: new Date().toISOString().slice(0, 10),
        estado: 'pendiente',
      });
      nuevas++;
    }
  }
  writeFileSync(RUTAS_CORPUS.propuestasTaxonomia, '# Propuestas de temas y eventos nuevos (las revisa el editor)\n' + aYaml(datos, { lineWidth: 0 }), 'utf8');
  return nuevas;
}

export interface ResultadoEtiquetadoClaude {
  nota: string;
  agregadas: string[];
  descartadas: string[];
  propuestas: number;
  resumen: string | null;
  modelo: string;
}

/**
 * Corre el etiquetador Haiku con Claude Code en modo no interactivo. Sin API keys:
 * usa la sesion de Claude Code de la maquina.
 *
 *   claude -p --output-format json --tools "" --strict-mcp-config --agent etiquetador
 *
 * Verificado contra `claude --help` de la version 2.1.258: existen `-p`, `--agent`,
 * `--model`, `--tools`, `--output-format`, `--append-system-prompt`, `--strict-mcp-config`
 * y `--json-schema`. **No existe `--max-turns`** (estaba en una version previa de este
 * archivo y hacia fallar el comando entero). `--tools ""` deja al agente sin herramientas:
 * en modo no interactivo no hay nadie para contestar un pedido de permiso, y el prompt ya
 * trae la nota entera, asi que no necesita leer archivos.
 *
 * Si no existe `.claude/agents/etiquetador.md`, cae a `--model haiku` con instrucciones minimas.
 * Fusiona la respuesta en la nota con `origen: haiku` y reindexa.
 */
export async function ejecutarEtiquetadoConClaude(notaId: string): Promise<ResultadoEtiquetadoClaude> {
  const nota = leerNota(notaId);
  if (!nota) throw new Error(`no existe la nota ${notaId} en ${RUTAS_CORPUS.notas}`);
  const claude = buscarClaude();
  if (!claude) throw new Error('no encuentro el CLI `claude` (Claude Code). Instalalo o define CLAUDE_BIN.');
  const taxonomia = cargarTaxonomia(true);
  const prompt = armarPrompt(nota, taxonomia);

  const args = ['-p', '--output-format', 'json', '--tools', '', '--strict-mcp-config'];
  let modelo = 'agente etiquetador';
  if (existsSync(RUTA_AGENTE)) args.push('--agent', 'etiquetador');
  else {
    log.aviso(`no existe ${relative(RAIZ, RUTA_AGENTE)}: uso --model haiku con instrucciones minimas`);
    args.push('--model', 'haiku', '--append-system-prompt', INSTRUCCIONES_FALLBACK);
    modelo = 'haiku (fallback)';
  }
  log.info(`claude -p (${modelo}) sobre ${notaId} (${nota.texto.length} chars)`);
  const r = ejecutarSync(claude, args, { cwd: RAIZ, entrada: prompt, timeoutMs: 5 * 60_000 });

  let textoRespuesta = r.stdout;
  let respuesta: RespuestaEtiquetador | null = null;
  let errorClaude: string | null = null;
  try {
    const envoltorio = JSON.parse(r.stdout) as { result?: string; structured_output?: unknown; is_error?: boolean; model?: string };
    // Ojo: con --output-format json, claude sale con codigo 0 aunque `is_error` sea true
    // (por ejemplo "OAuth session expired"). Hay que mirar el campo, no el codigo de salida.
    if (envoltorio.is_error) errorClaude = String(envoltorio.result ?? 'error sin detalle');
    if (envoltorio.structured_output && typeof envoltorio.structured_output === 'object') respuesta = envoltorio.structured_output as RespuestaEtiquetador;
    textoRespuesta = envoltorio.result ?? r.stdout;
    if (envoltorio.model) modelo = envoltorio.model;
  } catch {
    // stdout no era el envoltorio JSON: lo tratamos como texto.
  }
  if (errorClaude) {
    const pista = /auth|oauth|login|credential/i.test(errorClaude)
      ? ' La sesion de Claude Code de esta maquina no esta autenticada: la tiene que abrir una persona (`claude` interactivo, o `claude setup-token` para el servidor). Ningun script hace login solo.'
      : '';
    throw new Error(`claude -p devolvio error: ${errorClaude}.${pista}`);
  }
  if (!r.ok && !textoRespuesta.trim()) throw new Error(`claude -p fallo (codigo ${r.codigo}): ${(r.stderr || r.stdout).trim().slice(-600)}`);
  respuesta ??= extraerJson(textoRespuesta);
  if (!respuesta) throw new Error(`la respuesta del etiquetador no trae JSON: ${textoRespuesta.slice(0, 300)}`);

  const n = normalizarRespuesta(respuesta);
  const validos = {
    politicos: new Set(taxonomia.politicos.map((p) => p.slug)),
    partidos: new Set(taxonomia.partidos.map((p) => p.slug)),
    temas: new Set(taxonomia.temas.map((t) => t.slug)),
    eventos: new Set(taxonomia.eventos.map((e) => e.slug)),
  };
  const filtrar = (lista: string[], conjunto: Set<string>) => lista.filter((s) => conjunto.has(s));
  const antes = new Set([...nota.etiquetas.politicos, ...nota.etiquetas.partidos, ...nota.etiquetas.temas, ...nota.etiquetas.eventos]);

  // El agente devuelve la lista final de politicos: lo que detecto el alias y el no confirmo
  // es falso positivo. Si no se pronuncio (sin `politicos_confirmados`), solo saca los que
  // liste explicitamente en `descartar_politicos`.
  const confirmados = filtrar(n.politicos, validos.politicos);
  const descartadas = n.confirmoPoliticos
    ? nota.etiquetas.politicos.filter((s) => !confirmados.includes(s))
    : n.descartar.filter((s) => nota.etiquetas.politicos.includes(s));
  for (const s of descartadas) {
    nota.etiquetas.politicos = nota.etiquetas.politicos.filter((p) => p !== s);
    nota.etiquetas.menciones = nota.etiquetas.menciones.filter((m) => m.politico !== s);
    delete nota.etiquetas.origen[s];
  }
  nota.etiquetas = fusionarEtiquetas(
    nota.etiquetas,
    {
      politicos: confirmados,
      partidos: filtrar(n.partidos, validos.partidos),
      temas: filtrar(n.temas, validos.temas),
      eventos: filtrar(n.eventos, validos.eventos),
      menciones: n.menciones.filter((m) => confirmados.includes(m.politico)),
      fechas_mencionadas: n.fechas,
    },
    'haiku',
  );
  if (n.resumen) nota.resumen = n.resumen;
  const agregadas = [...nota.etiquetas.politicos, ...nota.etiquetas.partidos, ...nota.etiquetas.temas, ...nota.etiquetas.eventos].filter((s) => !antes.has(s));
  const propuestas = registrarPropuestas(nota.id, n.propuestas);
  (nota as Nota & { etiquetado_haiku?: unknown }).etiquetado_haiku = { fecha: new Date().toISOString(), modelo, maquina: hostname() };
  guardarNota(nota);

  const { abrirIndice, indexarNota } = await import('./indexar.ts');
  const indice = abrirIndice();
  try {
    indexarNota(indice, nota);
  } finally {
    indice.cerrar();
  }
  return { nota: nota.id, agregadas, descartadas, propuestas, resumen: nota.resumen, modelo };
}

async function main(): Promise<void> {
  const { posicionales, opciones } = parsearArgs(process.argv.slice(2));
  const [comando, id] = posicionales;
  if (comando === 'alias' && id) {
    const nota = leerNota(id);
    if (!nota) throw new Error(`no existe la nota ${id}`);
    process.stdout.write(JSON.stringify(etiquetarPorAlias(nota.texto, nota.fecha, undefined, nota.titulo), null, 1) + '\n');
    return;
  }
  if (comando === 'haiku' && id) {
    const r = await ejecutarEtiquetadoConClaude(id);
    process.stdout.write(JSON.stringify(r, null, 1) + '\n');
    return;
  }
  if (comando === 'taxonomia') {
    const t = cargarTaxonomia(true);
    process.stdout.write(opciones.json ? JSON.stringify(t, null, 1) + '\n' : `politicos ${t.politicos.length} · partidos ${t.partidos.length} · temas ${t.temas.length} · eventos ${t.eventos.length}\n`);
    return;
  }
  process.stderr.write('Uso: tsx scripts/corpus/etiquetar.ts alias <notaId> | haiku <notaId> | taxonomia [--json]\n');
  process.exit(2);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    log.error((e as Error).message);
    process.exit(1);
  });
}
