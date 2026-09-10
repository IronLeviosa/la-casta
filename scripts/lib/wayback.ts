/**
 * Archivo en Wayback Machine. Todo no fatal: si falla, devolvemos null y seguimos.
 *
 * Todos los pedidos a `web.archive.org`/`archive.org` pasan por `fetchWayback`: ese host limita
 * por IP y, en una revalidación masiva con varias URLs en paralelo, devuelve 429 para casi todo
 * (2026-09-10: 64 fuentes vivas quedaron marcadas como caídas por 429 y timeouts de Wayback en una
 * sola corrida de `pnpm validar --red`). `fetchWayback` limita la concurrencia global del proceso a
 * `CONCURRENCIA_WAYBACK` pedidos en vuelo y reintenta dos veces con espera creciente ante 429/5xx.
 */
import { fetchConTimeout, type OpcionesHttp } from './http.ts';
import { log } from './log.ts';

export interface ResultadoArchivo {
  archived_url: string | null;
  /** 'guardado' si Save Page Now respondio; 'existente' si ya habia snapshot; 'ninguno' si no. */
  origen: 'guardado' | 'existente' | 'ninguno';
  error?: string;
}

/** Pedidos simultaneos como mucho a web.archive.org/archive.org, sin importar desde donde se pidan. */
const CONCURRENCIA_WAYBACK = 2;
let enVueloWayback = 0;
const colaWayback: Array<() => void> = [];

async function conCupoWayback<T>(tarea: () => Promise<T>): Promise<T> {
  if (enVueloWayback >= CONCURRENCIA_WAYBACK) {
    await new Promise<void>((resolver) => colaWayback.push(resolver));
  }
  enVueloWayback++;
  try {
    return await tarea();
  } finally {
    enVueloWayback--;
    colaWayback.shift()?.();
  }
}

/**
 * `fetchConTimeout` con el cupo de concurrencia de Wayback y dos reintentos con espera creciente
 * ante 429/5xx (el backoff exponencial ya lo da `fetchConTimeout`; acá solo se sube el default de
 * reintentos de 1 a 2 para este host en particular).
 */
export function fetchWayback(url: string, opciones: OpcionesHttp = {}): Promise<Response> {
  return conCupoWayback(() => fetchConTimeout(url, { reintentos: 2, ...opciones }));
}

/** Consulta la Availability API: ultimo snapshot disponible. */
export async function snapshotDisponible(url: string): Promise<string | null> {
  try {
    const r = await fetchWayback(`https://archive.org/wayback/available?url=${encodeURIComponent(url)}`, {
      timeoutMs: 15_000,
    });
    if (!r.ok) return null;
    const datos = (await r.json()) as { archived_snapshots?: { closest?: { available?: boolean; url?: string } } };
    const cercano = datos.archived_snapshots?.closest;
    if (cercano?.available && cercano.url) return cercano.url.replace(/^http:/, 'https:');
  } catch (e) {
    log.debug(`availability fallo: ${(e as Error).message}`);
  }
  return null;
}

/**
 * Pide a Wayback que guarde la pagina (GET https://web.archive.org/save/<url>) y luego
 * consulta la disponibilidad. Nunca lanza.
 */
export async function archivar(url: string, opciones: { timeoutMs?: number } = {}): Promise<ResultadoArchivo> {
  const timeoutMs = opciones.timeoutMs ?? 40_000;
  let error: string | undefined;
  let guardado: string | null = null;
  try {
    const r = await fetchWayback(`https://web.archive.org/save/${url}`, { timeoutMs });
    // SPN2 responde 200 con la pagina archivada; la URL final o el header Content-Location traen el snapshot.
    const loc = r.headers.get('content-location') || r.headers.get('location');
    if (r.ok && loc) guardado = loc.startsWith('http') ? loc : `https://web.archive.org${loc}`;
    else if (r.ok && /web\.archive\.org\/web\/\d+/.test(r.url)) guardado = r.url;
    else if (!r.ok) error = `save devolvio HTTP ${r.status}`;
  } catch (e) {
    error = `save fallo: ${(e as Error).message}`;
  }
  if (guardado) return { archived_url: guardado, origen: 'guardado' };

  const existente = await snapshotDisponible(url);
  if (existente) return { archived_url: existente, origen: 'existente', error };
  return { archived_url: null, origen: 'ninguno', error: error ?? 'sin snapshot' };
}
