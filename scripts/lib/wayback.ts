/**
 * Archivo en Wayback Machine. Todo no fatal: si falla, devolvemos null y seguimos.
 */
import { fetchConTimeout } from './http.ts';
import { log } from './log.ts';

export interface ResultadoArchivo {
  archived_url: string | null;
  /** 'guardado' si Save Page Now respondio; 'existente' si ya habia snapshot; 'ninguno' si no. */
  origen: 'guardado' | 'existente' | 'ninguno';
  error?: string;
}

/** Consulta la Availability API: ultimo snapshot disponible. */
export async function snapshotDisponible(url: string): Promise<string | null> {
  try {
    const r = await fetchConTimeout(`https://archive.org/wayback/available?url=${encodeURIComponent(url)}`, {
      timeoutMs: 15_000,
      reintentos: 1,
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
    const r = await fetchConTimeout(`https://web.archive.org/save/${url}`, { timeoutMs, reintentos: 0 });
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
