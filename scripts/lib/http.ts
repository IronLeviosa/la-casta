/**
 * fetch con timeout, reintentos y User-Agent propio.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, unlinkSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { buscarEjecutable } from './ejecutable.ts';
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

/**
 * Reintento por curl para los 403 que no dependen del User-Agent.
 *
 * Algunos WAF (lr21.com.uy es el caso comprobado) distinguen el cliente y no el User-Agent. Medido
 * en prueba controlada, alternando los dos clientes sobre las mismas URLs con el mismo UA y pocos
 * segundos de diferencia: 12 de 12 intentos con el `fetch` de Node dieron 403 y 12 de 12 con curl
 * dieron 200. Cambiar el UA no mueve nada (probado con el del proyecto, uno de navegador y
 * ninguno: 403 en los tres casos). El mecanismo exacto no esta verificado —la hipotesis razonable
 * es la huella TLS/HTTP2, pero no lo comprobamos—; lo que si esta medido es que depende del
 * cliente. Sin esto, un medio entero (La Republica, alineamiento progresista) queda afuera de la
 * base de evidencia por como se conecta nuestro cliente HTTP, que no es una razon editorial ni un
 * cobro.
 *
 * Se manda el mismo USER_AGENT de siempre: el proyecto sigue diciendo quien es. Esto no abre
 * paywalls —un muro real devuelve 200 con un cuerpo de señuelo y curl recibe lo mismo— y solo se
 * intenta ante un 403, que es el codigo de "no te dejo pasar", nunca ante 402 ni 404.
 */
function descargarConCurl(url: string, timeoutMs: number): Descarga | null {
  const curl = buscarEjecutable('curl');
  if (!curl) return null;
  const tmp = path.join(os.tmpdir(), `lacasta-curl-${randomUUID()}`);
  try {
    const r = spawnSync(
      curl,
      ['-sSL', '--max-time', String(Math.ceil(timeoutMs / 1000)), '-A', USER_AGENT,
       '-H', 'Accept-Language: es-UY,es;q=0.9,en;q=0.5', '-o', tmp,
       '-w', '%{http_code}\t%{content_type}\t%{url_effective}', url],
      { encoding: 'utf8', windowsHide: true, maxBuffer: 1024 * 1024 },
    );
    if (r.status !== 0 || !existsSync(tmp)) return null;
    const [codigo, contentType = '', urlFinal = url] = (r.stdout ?? '').trim().split('\t');
    const estado = Number(codigo);
    if (!Number.isFinite(estado) || estado < 200 || estado >= 300) return null;
    return { buffer: readFileSync(tmp), contentType: contentType.toLowerCase(), estado, urlFinal };
  } catch {
    return null;
  } finally {
    try { if (existsSync(tmp)) unlinkSync(tmp); } catch { /* nada que hacer */ }
  }
}

/** Baja un recurso completo. Lanza ErrorHttp si el estado no es 2xx. */
export async function descargar(url: string, opciones: OpcionesHttp = {}): Promise<Descarga> {
  const timeoutMs = opciones.timeoutMs ?? 45_000;
  const r = await fetchConTimeout(url, { timeoutMs: 45_000, ...opciones });
  if (r.status === 403) {
    const porCurl = descargarConCurl(url, timeoutMs);
    if (porCurl) {
      log.debug(`403 con fetch en ${url}; recuperado por curl (${porCurl.buffer.length} bytes)`);
      return porCurl;
    }
  }
  if (!r.ok) throw new ErrorHttp(url, r.status);
  const buffer = Buffer.from(await r.arrayBuffer());
  return {
    buffer,
    contentType: (r.headers.get('content-type') ?? '').toLowerCase(),
    estado: r.status,
    urlFinal: r.url || url,
  };
}
