/**
 * fetch con timeout, reintentos y User-Agent propio.
 */
import { log } from './log.ts';

export const USER_AGENT = 'LaCasta/0.1 (+https://lacasta.uy; verificacion de fuentes)';

export interface OpcionesHttp {
  timeoutMs?: number;
  reintentos?: number;
  headers?: Record<string, string>;
  metodo?: 'GET' | 'HEAD';
}

export class ErrorHttp extends Error {
  constructor(public url: string, public estado: number, mensaje?: string) {
    super(mensaje ?? `HTTP ${estado} al pedir ${url}`);
  }
}

function esperar(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/** fetch con AbortController; reintenta en errores de red y 5xx/429 con backoff. */
export async function fetchConTimeout(url: string, opciones: OpcionesHttp = {}): Promise<Response> {
  const { timeoutMs = 20_000, reintentos = 2, headers = {}, metodo = 'GET' } = opciones;
  let ultimoError: unknown;
  for (let intento = 0; intento <= reintentos; intento++) {
    const control = new AbortController();
    const temporizador = setTimeout(() => control.abort(), timeoutMs);
    try {
      const r = await fetch(url, {
        method: metodo,
        redirect: 'follow',
        signal: control.signal,
        headers: {
          'User-Agent': USER_AGENT,
          Accept: 'text/html,application/xhtml+xml,application/pdf,application/json;q=0.9,*/*;q=0.8',
          'Accept-Language': 'es-UY,es;q=0.9,en;q=0.5',
          ...headers,
        },
      });
      if ((r.status >= 500 || r.status === 429) && intento < reintentos) {
        ultimoError = new ErrorHttp(url, r.status);
        log.debug(`HTTP ${r.status} en ${url}, reintento ${intento + 1}`);
        await esperar(1000 * 2 ** intento);
        continue;
      }
      return r;
    } catch (e) {
      ultimoError = e;
      if (intento < reintentos) {
        log.debug(`fallo de red en ${url}: ${(e as Error).message}, reintento ${intento + 1}`);
        await esperar(1000 * 2 ** intento);
        continue;
      }
    } finally {
      clearTimeout(temporizador);
    }
  }
  throw ultimoError instanceof Error ? ultimoError : new Error(String(ultimoError));
}

export interface Descarga {
  buffer: Buffer;
  contentType: string;
  estado: number;
  urlFinal: string;
}

/** Baja un recurso completo. Lanza ErrorHttp si el estado no es 2xx. */
export async function descargar(url: string, opciones: OpcionesHttp = {}): Promise<Descarga> {
  const r = await fetchConTimeout(url, { timeoutMs: 45_000, ...opciones });
  if (!r.ok) throw new ErrorHttp(url, r.status);
  const buffer = Buffer.from(await r.arrayBuffer());
  return {
    buffer,
    contentType: (r.headers.get('content-type') ?? '').toLowerCase(),
    estado: r.status,
    urlFinal: r.url || url,
  };
}
