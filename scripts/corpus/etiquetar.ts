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
import { sha256 } from '../lib/hash.ts';
import { buscarClaude, ejecutarSync } from '../lib/ejecutable.ts';
import { log, parsearArgs } from '../lib/log.ts';
import { etiquetasVacias, type Catalogo, type Etiquetas, type LeyMencionada, type Mencion, type Nota, type OrigenEtiqueta, type Relevancia } from './tipos.ts';
import { agregarTrabajo, listarTrabajos } from '../cola.ts';

export interface EntradaTaxonomia {
  slug: string;
  nombre: string;
  alias: string[];
  /**
   * Alias que tambien nombran a otra persona (ej. "Lacalle" = Lacalle Pou o Lacalle Herrera segun
   * la epoca). Quedan fuera de `alias` (no etiquetan solos) pero se exponen aca para que el paso de
   * Haiku o un humano los vea; solo cuentan cuando el texto trae ademas un alias no ambiguo.
   */
  alias_ambiguos?: string[];
  /**
   * Para politicos: primer año en que pudo empezar a tener vida pública, calculado como el año más
   * temprano de un mandato o una candidatura menos 5 (para no perder cobertura de campaña previa al
   * cargo). `undefined` = sin mandatos ni candidaturas con fecha, no hay ventana: se etiqueta igual
   * que antes de esta regla.
   */
  actividad_desde?: number;
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
  /**
   * Opcional (agregado para el catálogo, docs/plan-catalogo.md): slugs de `content/empresas/`.
   * Optativo para no romper los fixtures de `Taxonomia` que ya arman los tests sin esta clave.
   */
  empresas?: EntradaTaxonomia[];
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

export interface FichaPolitico {
  slug: string;
  datos: Record<string, unknown>;
}

/** Lee content/politicos (recursivo) en fichas crudas: slug + YAML ya parseado, sin transformar. */
function leerFichasPoliticos(carpeta: string): FichaPolitico[] {
  const salida: FichaPolitico[] = [];
  for (const ruta of archivosYaml(carpeta)) {
    const d = leerYaml(ruta);
    if (!d) continue;
    salida.push({ slug: String(d.slug ?? d.id ?? slugDeArchivo(ruta, carpeta)), datos: d });
  }
  return salida;
}

/** El año de una fecha ISO o parcial (YYYY, YYYY-MM o YYYY-MM-DD); null si no se puede leer. */
function anioDe(fecha: unknown): number | null {
  if (typeof fecha !== 'string') return null;
  const m = /^(\d{4})/.exec(fecha.trim());
  if (!m) return null;
  const anio = Number(m[1]);
  return Number.isFinite(anio) ? anio : null;
}

/** El primer (más chico) año de una lista de fechas; null si ninguna es legible. */
function primerAnio(fechas: unknown[]): number | null {
  let min: number | null = null;
  for (const f of fechas) {
    const anio = anioDe(f);
    if (anio !== null && (min === null || anio < min)) min = anio;
  }
  return min;
}

/**
 * Construye las entradas de politicos de la taxonomia a partir de las fichas ya leidas (pura, no
 * toca el filesystem). Dos reglas nuevas, pensadas para no tildar a alguien con un alias o en una
 * epoca en la que no pudo ser mencionado:
 *   - `alias_ambiguos` de la ficha (ej. "Lacalle" en lacalle-pou.yaml, que tambien es Lacalle
 *     Herrera) sale de `alias` y va aparte: no etiqueta solo, pero el paso de Haiku o un humano lo
 *     sigue viendo.
 *   - `actividad_desde` = el año mas temprano entre `mandatos[].desde` y `candidaturas[].fecha`,
 *     menos 5 (para cubrir la campaña previa al cargo). Sin ninguna fecha, queda `undefined` y no
 *     hay ventana.
 */
export function taxonomiaDesdeFichas(fichas: FichaPolitico[]): EntradaTaxonomia[] {
  return fichas.map(({ slug, datos: d }) => {
    const nombre = String(d.nombre ?? d.titulo ?? d.name ?? slug);
    const ambiguos = Array.isArray(d.alias_ambiguos)
      ? (d.alias_ambiguos as Record<string, unknown>[])
          .map((a) => (a && typeof a === 'object' ? String(a.alias ?? '').trim() : ''))
          .filter(Boolean)
      : [];
    const descartar = new Set(ambiguos.map((a) => a.toLowerCase()));
    const todos = [...new Set([nombre, ...comoLista(d.alias), ...comoLista(d.aliases)])];
    const alias = todos.filter((a) => !descartar.has(a.toLowerCase()));
    const mandatos = Array.isArray(d.mandatos) ? (d.mandatos as Record<string, unknown>[]) : [];
    const candidaturas = Array.isArray(d.candidaturas) ? (d.candidaturas as Record<string, unknown>[]) : [];
    const anio = primerAnio([...mandatos.map((m) => m?.desde), ...candidaturas.map((c) => c?.fecha)]);
    return {
      slug,
      nombre,
      alias,
      alias_ambiguos: ambiguos.length ? ambiguos : undefined,
      actividad_desde: anio === null ? undefined : anio - 5,
      partido: typeof d.partido === 'string' ? d.partido : undefined,
      temas: comoLista(d.temas),
    };
  });
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
      if (!previa) porSlug.set(e.slug, { ...e, alias: [...e.alias], alias_ambiguos: e.alias_ambiguos ? [...e.alias_ambiguos] : undefined });
      else {
        previa.alias = [...new Set([...previa.alias, ...e.alias])];
        previa.alias_ambiguos = e.alias_ambiguos ? [...new Set([...(previa.alias_ambiguos ?? []), ...e.alias_ambiguos])] : previa.alias_ambiguos;
        previa.partido ??= e.partido;
        previa.temas = [...new Set([...(previa.temas ?? []), ...(e.temas ?? [])])];
        previa.actividad_desde ??= e.actividad_desde;
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
    politicos: fusionarEntradas(taxonomiaDesdeFichas(leerFichasPoliticos(RUTAS_CONTENIDO.politicos)), extra.politicos),
    partidos: extra.partidos,
    temas: leerColeccion(RUTAS_CONTENIDO.temas),
    eventos: leerColeccion(RUTAS_CONTENIDO.eventos),
    empresas: leerColeccion(RUTAS_CONTENIDO.empresas),
  };
  return taxonomiaCache;
}

/**
 * Etiquetado determinista por alias. Sin red, sin tokens.
 * `titulo` cuenta para detectar la etiqueta (un video puede nombrar al politico solo en el titulo),
 * pero las `menciones` con posicion se calculan solo sobre `texto`.
 *
 * Dos reglas evitan falsos positivos con politicos que comparten nombre con otra persona o que
 * todavia no tenian vida publica en la fecha de la nota (ej. un diario de sesiones de 1990
 * etiquetado con "lacalle-pou" por la palabra "Lacalle", que en esa fecha era el padre):
 *   - `p.alias` ya viene sin los `alias_ambiguos` de la ficha (los saca `taxonomiaDesdeFichas`):
 *     un alias ambiguo nunca etiqueta solo, solo cuenta si el texto trae ademas un alias propio.
 *   - Si la nota tiene fecha y `p.actividad_desde` esta definido, una nota de un año anterior no
 *     etiqueta a esa persona por alias (sin `politicos`, sin `menciones`). Sin fecha de nota o sin
 *     ventana (persona sin mandatos ni candidaturas con fecha), se etiqueta igual que antes.
 */
export function etiquetarPorAlias(texto: string, fechaNota?: string | null, taxonomia = cargarTaxonomia(), titulo?: string | null): Etiquetas {
  const e = etiquetasVacias();
  const menciones: Mencion[] = [];
  const conTitulo = titulo && titulo.trim() ? `${titulo.trim()}\n${texto}` : texto;
  const anioNota = fechaNota ? Number(fechaNota.slice(0, 4)) : null;
  for (const p of taxonomia.politicos) {
    if (anioNota !== null && Number.isFinite(anioNota) && p.actividad_desde !== undefined && anioNota < p.actividad_desde) continue;
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

/**
 * Versión del *esquema* de la respuesta del catálogo (`nota.catalogo`), no del archivo de rol.
 * Subirla a mano cuando cambien las claves que `normalizarRespuesta` espera de
 * `politicos_confirmados[].relevancia`, `tiene_afirmaciones`, `fecha_texto`, `empresas` o `leyes`:
 * eso invalida el catálogo ya guardado tanto como un cambio en `.claude/agents/etiquetador.md`.
 */
const ESQUEMA_CATALOGO_VERSION = 'catalogo-v1';

/**
 * `nota.catalogo.version`: sha256 del archivo de rol vigente (o de las instrucciones de emergencia,
 * si no existe) más el esquema de arriba. Dos etiquetados con el mismo rol y el mismo esquema dan
 * la misma versión; cambiar cualquiera de los dos la cambia, y `necesitaCatalogar` usa eso para
 * decidir si una nota ya catalogada hace falta volver a pasarla por Haiku (docs/plan-catalogo.md:
 * "una nota se recataloga solo si cambió la versión, o con --todas").
 */
export function versionCatalogo(): string {
  const rol = existsSync(RUTA_AGENTE) ? readFileSync(RUTA_AGENTE, 'utf8') : INSTRUCCIONES_FALLBACK;
  return sha256(`${rol}\n---esquema---\n${ESQUEMA_CATALOGO_VERSION}`);
}

/** true si a `nota` le falta el catálogo de esta versión (o no tiene catálogo todavía). `todas` fuerza siempre. */
export function necesitaCatalogar(nota: Pick<Nota, 'catalogo'>, opciones: { todas?: boolean } = {}): boolean {
  return opciones.todas === true || nota.catalogo?.version !== versionCatalogo();
}

const INSTRUCCIONES_FALLBACK = `Sos el etiquetador del corpus de La Casta (politica uruguaya). Recibis una nota y la taxonomia vigente.
Devolves SOLO un objeto JSON, sin texto alrededor ni bloques de codigo, con esta forma:
{"temas": ["slug"], "eventos": ["slug"], "partidos": ["slug"],
 "politicos_confirmados": [{"slug": "lacalle-pou", "posiciones": [120, 843], "relevancia": "central"}],
 "tiene_afirmaciones": true, "fecha_texto": null, "empresas": ["slug"],
 "leyes": [{"numero": "19.889", "tipo": "ley", "nombre": "..."}],
 "resumen": "dos lineas neutras en espanol", "fechas_mencionadas": ["YYYY-MM-DD"],
 "propuestas_taxonomia": [{"tipo": "tema", "slug": "economia/deuda-publica", "alias": ["deuda"], "motivo": "..."}]}
Reglas: usa solo slugs de la taxonomia; en politicos_confirmados va la lista final (sacando los falsos positivos
que detecto el paso por alias), cada uno con relevancia central|secundaria|mencion; tiene_afirmaciones es true
solo si hay citas con cifra, fecha, comparacion, promesa o posicion de alguno de esos politicos; fecha_texto es
la fecha que el propio texto declara para si (null si no la dice); empresas y leyes, listas vacias si no aplica;
si falta un tema o evento, proponelo en propuestas_taxonomia y no lo uses como etiqueta.`;

/**
 * Forma de la respuesta. La canonica es la de `.claude/agents/etiquetador.md`
 * (`politicos_confirmados`, `propuestas_taxonomia`); tambien aceptamos las claves planas
 * (`politicos`, `descartar_politicos`, `propuestas`) por si el modelo simplifica.
 *
 * Las claves de acá para abajo son las que agregó el catálogo (docs/plan-catalogo.md, etapa B):
 * `relevancia` dentro de cada político confirmado, `tiene_afirmaciones`, `fecha_texto`, `empresas`
 * y `leyes`. `fechas_mencionadas` ya existía. Todas opcionales: una respuesta del etiquetador
 * "viejo" (sin estas claves, o el fallback sin agente) sigue siendo válida, solo que no llena
 * `nota.catalogo`.
 */
export interface RespuestaEtiquetador {
  politicos_confirmados?: { slug: string; posiciones?: number[]; relevancia?: string }[];
  politicos?: string[];
  descartar_politicos?: string[];
  partidos?: string[];
  temas?: string[];
  eventos?: string[];
  resumen?: string;
  fechas_mencionadas?: string[];
  propuestas_taxonomia?: { tipo: string; slug: string; alias?: string[]; motivo?: string; por_que?: string; desde?: string }[];
  propuestas?: { tipo: string; slug: string; alias?: string[]; motivo?: string; por_que?: string; desde?: string }[];
  tiene_afirmaciones?: boolean;
  fecha_texto?: string | null;
  empresas?: string[];
  leyes?: { numero: string; tipo?: string; nombre?: string }[];
}

const RELEVANCIAS_VALIDAS: Relevancia[] = ['central', 'secundaria', 'mencion'];

function comoRelevancia(v: unknown): Relevancia | null {
  return typeof v === 'string' && (RELEVANCIAS_VALIDAS as string[]).includes(v) ? (v as Relevancia) : null;
}

/** `AAAA`, `AAAA-MM` o `AAAA-MM-DD`; lo mismo que ya exigía `fechas_mencionadas`. */
function comoFecha(v: unknown): string | null {
  return typeof v === 'string' && /^\d{4}(-\d{2}){0,2}$/.test(v) ? v : null;
}

/** `leyes` del etiquetador (catálogo): descarta las que no traen número, que es el único id. */
function comoLeyes(v: unknown): LeyMencionada[] {
  if (!Array.isArray(v)) return [];
  const salida: LeyMencionada[] = [];
  for (const e of v as Record<string, unknown>[]) {
    const numero = typeof e?.numero === 'string' ? e.numero.trim() : '';
    if (!numero) continue;
    const tipo = e?.tipo === 'decreto' ? 'decreto' : 'ley';
    const nombre = typeof e?.nombre === 'string' && e.nombre.trim() ? e.nombre.trim() : undefined;
    salida.push({ numero, tipo, ...(nombre ? { nombre } : {}) });
  }
  return salida;
}

/**
 * Une las dos formas posibles de la respuesta en una sola estructura. Exportada (además de para
 * `ejecutarEtiquetadoConClaude`) para poder probar el parseo de las claves del catálogo
 * (`relevancia`, `tiene_afirmaciones`, `fecha_texto`, `empresas`, `leyes`) con un JSON de ejemplo,
 * sin invocar `claude -p` ni tocar el corpus.
 */
export function normalizarRespuesta(r: RespuestaEtiquetador): {
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
  /** slug de político -> relevancia, solo de los que trajeron una relevancia válida. */
  relevancia: Record<string, Relevancia>;
  tieneAfirmaciones: boolean;
  fechaTexto: string | null;
  empresas: string[];
  leyes: LeyMencionada[];
} {
  const confirmados = Array.isArray(r.politicos_confirmados) ? r.politicos_confirmados : null;
  const politicos = confirmados ? confirmados.map((p) => String(p?.slug ?? '')).filter(Boolean) : comoLista(r.politicos);
  const menciones: Mencion[] = [];
  const relevancia: Record<string, Relevancia> = {};
  for (const p of confirmados ?? []) {
    if (!p?.slug) continue;
    for (const pos of Array.isArray(p.posiciones) ? p.posiciones : []) {
      if (Number.isFinite(pos) && pos >= 0) menciones.push({ politico: String(p.slug), posicion: Math.trunc(Number(pos)) });
    }
    // Sin relevancia declarada (etiquetador viejo, o el modelo la omitió), se asume "secundaria":
    // el propio rol dice que ante la duda es preferible una pasada más del extractor que perder
    // una afirmación, y "sin relevancia" es justo esa duda.
    relevancia[String(p.slug)] = comoRelevancia(p.relevancia) ?? 'secundaria';
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
    relevancia,
    tieneAfirmaciones: r.tiene_afirmaciones === true,
    fechaTexto: comoFecha(r.fecha_texto),
    empresas: comoLista(r.empresas),
    leyes: comoLeyes(r.leyes),
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
    `Empresas:\n${lista(taxonomia.empresas ?? [])}`,
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
  /** Cuánto tardó esta llamada a Haiku (medición del catálogo, docs/plan-catalogo.md). */
  segundos: number;
  /** Tokens de la llamada: si `--output-format json` no trae `usage`, quedan en 0 (no es fatal). */
  tokens_entrada: number;
  tokens_salida: number;
  /** El catálogo que quedó guardado en la nota (relevancia, tiene_afirmaciones, etc.), o null si
   * la respuesta no traía ninguna de esas claves (etiquetador viejo, o fallback sin agente). */
  catalogo: Catalogo | null;
}

interface AplicacionRespuesta {
  agregadas: string[];
  descartadas: string[];
  propuestas: number;
}

/**
 * Aplica una `RespuestaEtiquetador` ya parseada a una nota: confirma/descarta políticos, fusiona
 * temas/eventos/partidos, arma `nota.catalogo` y anota `etiquetado_haiku`. Muta `nota` in place y
 * no toca disco ni el índice (eso lo hacen `ejecutarEtiquetadoConClaude` y
 * `ejecutarEtiquetadoLoteConClaude`, cada uno decide cuándo guardar). Separada para que el modo
 * lote reuse exactamente la misma lógica de interpretación por cada nota del array de respuesta,
 * en vez de reimplementarla.
 */
function aplicarRespuestaANota(nota: Nota, respuesta: RespuestaEtiquetador, taxonomia: Taxonomia, modelo: string): AplicacionRespuesta {
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

  // Catálogo (docs/plan-catalogo.md, etapa B): solo si la respuesta trajo algo de esto (un
  // etiquetador viejo, o el fallback sin agente, no lo trae, y entonces `nota.catalogo` queda
  // como estaba). `relevancia` se guarda solo de los políticos que quedaron confirmados: uno
  // descartado en esta misma vuelta no debería seguir figurando como central de la anterior.
  const huboClavesDeCatalogo =
    respuesta.tiene_afirmaciones !== undefined ||
    respuesta.fecha_texto !== undefined ||
    Array.isArray(respuesta.empresas) ||
    Array.isArray(respuesta.leyes) ||
    (respuesta.politicos_confirmados ?? []).some((p) => p?.relevancia !== undefined);
  if (huboClavesDeCatalogo) {
    const validosEmpresas = new Set((taxonomia.empresas ?? []).map((e) => e.slug));
    nota.catalogo = {
      version: versionCatalogo(),
      modelo,
      fecha: new Date().toISOString(),
      relevancia: Object.fromEntries(confirmados.map((s) => [s, n.relevancia[s] ?? 'secundaria'])),
      tiene_afirmaciones: n.tieneAfirmaciones,
      fecha_texto: n.fechaTexto,
      fechas_mencionadas: [...new Set([...(nota.catalogo?.fechas_mencionadas ?? []), ...n.fechas])],
      empresas: filtrar(n.empresas, validosEmpresas),
      leyes: n.leyes,
      // Si ya había afirmaciones de una pasada 2 anterior, se conservan: esta vuelta solo repite
      // la pasada 1 (p. ej. `--todas` sobre una nota ya extraída, o una versión nueva del rol que
      // no toca el esquema de `extractor`).
      ...(nota.catalogo?.afirmaciones !== undefined ? { afirmaciones: nota.catalogo.afirmaciones, descartadas: nota.catalogo.descartadas } : {}),
    };
  }

  return { agregadas, descartadas, propuestas };
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
  const t0 = Date.now();
  const r = ejecutarSync(claude, args, { cwd: RAIZ, entrada: prompt, timeoutMs: 5 * 60_000 });
  const segundos = (Date.now() - t0) / 1000;

  let textoRespuesta = r.stdout;
  let respuesta: RespuestaEtiquetador | null = null;
  let errorClaude: string | null = null;
  let tokensEntrada = 0;
  let tokensSalida = 0;
  try {
    const envoltorio = JSON.parse(r.stdout) as {
      result?: string;
      structured_output?: unknown;
      is_error?: boolean;
      model?: string;
      usage?: { input_tokens?: number; output_tokens?: number; cache_creation_input_tokens?: number; cache_read_input_tokens?: number };
    };
    // Ojo: con --output-format json, claude sale con codigo 0 aunque `is_error` sea true
    // (por ejemplo "OAuth session expired"). Hay que mirar el campo, no el codigo de salida.
    if (envoltorio.is_error) errorClaude = String(envoltorio.result ?? 'error sin detalle');
    if (envoltorio.structured_output && typeof envoltorio.structured_output === 'object') respuesta = envoltorio.structured_output as RespuestaEtiquetador;
    textoRespuesta = envoltorio.result ?? r.stdout;
    if (envoltorio.model) modelo = envoltorio.model;
    if (envoltorio.usage) {
      // "Entrada" para la medición del catálogo suma lo leído de caché: es lo que de verdad pesa
      // en el prompt de esta llamada (la nota entera), no solo lo que no estaba en caché.
      tokensEntrada = Number(envoltorio.usage.input_tokens ?? 0) + Number(envoltorio.usage.cache_creation_input_tokens ?? 0) + Number(envoltorio.usage.cache_read_input_tokens ?? 0);
      tokensSalida = Number(envoltorio.usage.output_tokens ?? 0);
    }
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

  const { agregadas, descartadas, propuestas } = aplicarRespuestaANota(nota, respuesta, taxonomia, modelo);
  guardarNota(nota);

  const { abrirIndice, indexarNota } = await import('./indexar.ts');
  const indice = abrirIndice();
  try {
    indexarNota(indice, nota);
  } finally {
    indice.cerrar();
  }
  return {
    nota: nota.id,
    agregadas,
    descartadas,
    propuestas,
    resumen: nota.resumen,
    modelo,
    segundos,
    tokens_entrada: tokensEntrada,
    tokens_salida: tokensSalida,
    catalogo: nota.catalogo ?? null,
  };
}

// ---------------------------------------------------------------------------
// Modo lote (docs/plan-catalogo.md): varias notas cortas en un solo pedido a Haiku.
// ---------------------------------------------------------------------------

/** Tope de caracteres para que una nota entre en un lote: el rol pide notas "de menos de 4.000 caracteres". */
const MAX_CHARS_LOTE = 4000;
/** Tamaño por defecto de un lote (docs/plan-catalogo.md: "hasta 5 notas"). */
export const TAMANO_LOTE_POR_DEFECTO = 5;

export interface NotaParaLote {
  id: string;
  texto: string;
}

/**
 * Agrupa notas para el modo lote: las de menos de `MAX_CHARS_LOTE` caracteres se juntan de a
 * `tamano` (5 por defecto); una nota larga va sola, en su propio lote de 1 (el rol dice "las notas
 * largas van de a una": meterla en un lote no ahorra nada porque igual consume su propio contexto,
 * y arriesga a que la respuesta del lote entero se corte). Pura: no decide nada de contenido, solo
 * arma los grupos en el mismo orden recibido, así se puede probar sin claude ni corpus de por medio.
 */
export function armarLotes<T extends NotaParaLote>(notas: T[], opciones: { tamano?: number } = {}): T[][] {
  const tamano = Math.max(1, opciones.tamano ?? TAMANO_LOTE_POR_DEFECTO);
  const lotes: T[][] = [];
  let actual: T[] = [];
  for (const nota of notas) {
    if (nota.texto.length >= MAX_CHARS_LOTE) {
      if (actual.length) {
        lotes.push(actual);
        actual = [];
      }
      lotes.push([nota]);
      continue;
    }
    actual.push(nota);
    if (actual.length >= tamano) {
      lotes.push(actual);
      actual = [];
    }
  }
  if (actual.length) lotes.push(actual);
  return lotes;
}

/** El prompt de un lote: la taxonomía una sola vez, y una nota por bloque `### nota <n>` (formato que pide el rol). */
function armarPromptLote(notas: Nota[], taxonomia: Taxonomia): string {
  const lista = (l: EntradaTaxonomia[]) => (l.length ? l.map((e) => `- ${e.slug}: ${e.nombre}`).join('\n') : '(vacio)');
  const bloques = notas.map((nota, i) => {
    const texto = nota.texto.length > MAX_CHARS_TEXTO ? nota.texto.slice(0, MAX_CHARS_TEXTO) + '\n[… texto recortado …]' : nota.texto;
    return [
      `### nota ${i + 1}`,
      `titulo: ${nota.titulo ?? '?'} · medio: ${nota.medio} · fecha: ${nota.fecha ?? '?'} · id: ${nota.id}`,
      'etiquetas actuales (por alias):',
      JSON.stringify({ politicos: nota.etiquetas.politicos, partidos: nota.etiquetas.partidos, temas: nota.etiquetas.temas, eventos: nota.etiquetas.eventos }),
      '---',
      texto,
    ].join('\n');
  });
  return [
    'TAXONOMIA VIGENTE',
    `Politicos:\n${lista(taxonomia.politicos)}`,
    `Partidos:\n${lista(taxonomia.partidos)}`,
    `Temas:\n${lista(taxonomia.temas)}`,
    `Eventos:\n${lista(taxonomia.eventos)}`,
    `Empresas:\n${lista(taxonomia.empresas ?? [])}`,
    '',
    `MODO LOTE: ${notas.length} nota(s), cada una juzgada sola (lo que dice una no etiqueta a otra).`,
    ...bloques,
    '---',
    `Responde SOLO con un array JSON de ${notas.length} objeto(s), en el mismo orden, cada uno con las claves de siempre.`,
  ].join('\n');
}

/** Primer objeto `[` … `]` de una respuesta que puede traer texto o ```json alrededor. */
export function extraerJsonArray(texto: string): RespuestaEtiquetador[] | null {
  const limpio = texto.replace(/```(?:json)?/gi, '').trim();
  const ini = limpio.indexOf('[');
  const fin = limpio.lastIndexOf(']');
  if (ini < 0 || fin <= ini) return null;
  try {
    const datos = JSON.parse(limpio.slice(ini, fin + 1));
    return Array.isArray(datos) ? (datos as RespuestaEtiquetador[]) : null;
  } catch {
    return null;
  }
}

/**
 * Corre el etiquetador Haiku sobre varias notas en un solo `claude -p` (modo lote): mismo camino
 * que `ejecutarEtiquetadoConClaude` (mismos flags, mismo chequeo de `is_error`), pero el prompt
 * trae `notaIds.length` notas con el formato `### nota <n>` y la respuesta es un array con un
 * objeto por nota, en el mismo orden. Con una sola nota, delega en la versión de a una (no hay
 * ahorro en armar un array de un elemento, y así un lote de tamaño 1 no duplica comportamiento).
 * Tokens y segundos de la llamada se reparten por partes iguales entre las notas del lote: es una
 * aproximación (Haiku no factura por nota), pero deja `segundos_por_nota` de
 * `data/catalogo/rendimiento.json` comparable entre modo lote y modo de a una.
 */
export async function ejecutarEtiquetadoLoteConClaude(notaIds: string[]): Promise<ResultadoEtiquetadoClaude[]> {
  if (notaIds.length <= 1) return notaIds.length ? [await ejecutarEtiquetadoConClaude(notaIds[0])] : [];

  const notas = notaIds.map((id) => {
    const n = leerNota(id);
    if (!n) throw new Error(`no existe la nota ${id} en ${RUTAS_CORPUS.notas}`);
    return n;
  });
  const claude = buscarClaude();
  if (!claude) throw new Error('no encuentro el CLI `claude` (Claude Code). Instalalo o define CLAUDE_BIN.');
  const taxonomia = cargarTaxonomia(true);
  const prompt = armarPromptLote(notas, taxonomia);

  const args = ['-p', '--output-format', 'json', '--tools', '', '--strict-mcp-config'];
  let modelo = 'agente etiquetador';
  if (existsSync(RUTA_AGENTE)) args.push('--agent', 'etiquetador');
  else {
    log.aviso(`no existe ${relative(RAIZ, RUTA_AGENTE)}: uso --model haiku con instrucciones minimas`);
    args.push('--model', 'haiku', '--append-system-prompt', INSTRUCCIONES_FALLBACK);
    modelo = 'haiku (fallback)';
  }
  log.info(`claude -p (${modelo}, lote de ${notas.length}) sobre ${notaIds.join(', ')}`);
  const t0 = Date.now();
  const r = ejecutarSync(claude, args, { cwd: RAIZ, entrada: prompt, timeoutMs: 5 * 60_000 });
  const segundos = (Date.now() - t0) / 1000;

  let textoRespuesta = r.stdout;
  let respuestas: RespuestaEtiquetador[] | null = null;
  let errorClaude: string | null = null;
  let tokensEntrada = 0;
  let tokensSalida = 0;
  try {
    const envoltorio = JSON.parse(r.stdout) as {
      result?: string;
      structured_output?: unknown;
      is_error?: boolean;
      model?: string;
      usage?: { input_tokens?: number; output_tokens?: number; cache_creation_input_tokens?: number; cache_read_input_tokens?: number };
    };
    if (envoltorio.is_error) errorClaude = String(envoltorio.result ?? 'error sin detalle');
    if (Array.isArray(envoltorio.structured_output)) respuestas = envoltorio.structured_output as RespuestaEtiquetador[];
    textoRespuesta = envoltorio.result ?? r.stdout;
    if (envoltorio.model) modelo = envoltorio.model;
    if (envoltorio.usage) {
      tokensEntrada = Number(envoltorio.usage.input_tokens ?? 0) + Number(envoltorio.usage.cache_creation_input_tokens ?? 0) + Number(envoltorio.usage.cache_read_input_tokens ?? 0);
      tokensSalida = Number(envoltorio.usage.output_tokens ?? 0);
    }
  } catch {
    // stdout no era el envoltorio JSON: lo tratamos como texto.
  }
  if (errorClaude) {
    const pista = /auth|oauth|login|credential/i.test(errorClaude) ? ' La sesion de Claude Code de esta maquina no esta autenticada.' : '';
    throw new Error(`claude -p (lote) devolvio error: ${errorClaude}.${pista}`);
  }
  if (!r.ok && !textoRespuesta.trim()) throw new Error(`claude -p (lote) fallo (codigo ${r.codigo}): ${(r.stderr || r.stdout).trim().slice(-600)}`);
  respuestas ??= extraerJsonArray(textoRespuesta);
  if (!respuestas || respuestas.length !== notas.length) {
    throw new Error(`la respuesta del lote no trae un array de ${notas.length} objeto(s): ${textoRespuesta.slice(0, 300)}`);
  }

  const segundosPorNota = segundos / notas.length;
  const tokensEntradaPorNota = tokensEntrada / notas.length;
  const tokensSalidaPorNota = tokensSalida / notas.length;
  const resultados: ResultadoEtiquetadoClaude[] = notas.map((nota, i) => {
    const { agregadas, descartadas, propuestas } = aplicarRespuestaANota(nota, respuestas![i], taxonomia, modelo);
    guardarNota(nota);
    return {
      nota: nota.id,
      agregadas,
      descartadas,
      propuestas,
      resumen: nota.resumen,
      modelo,
      segundos: segundosPorNota,
      tokens_entrada: tokensEntradaPorNota,
      tokens_salida: tokensSalidaPorNota,
      catalogo: nota.catalogo ?? null,
    };
  });

  const { abrirIndice, indexarNota } = await import('./indexar.ts');
  const indice = abrirIndice();
  try {
    for (const nota of notas) indexarNota(indice, nota);
  } finally {
    indice.cerrar();
  }
  return resultados;
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
