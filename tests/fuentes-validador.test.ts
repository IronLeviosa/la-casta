/**
 * `crearVerificadorReal()` (scripts/validadores/fuentes.ts), con `fetch` inyectado: D1 de
 * docs/plan-fuentes-lentas.md (un abort no es un 404: un último GET de 60 s antes de rendirse,
 * salvo para hosts que no dicen "no hay servidor" y salvo Wayback, que ya tiene su propio cupo).
 *
 * `fetchConTimeout`/`fetchWayback` usan el `fetch` global, así que se reemplaza acá con uno de
 * cola: cada llamada al origen bajo prueba (incluida la que hace `fetchConTimeout` sola, con
 * "www." delante, si el origen no lo tenía y todos los intentos fallaron por red) consume la
 * siguiente entrada de la cola. Solo la consulta de disponibilidad de Wayback y la de conectividad
 * de `comprobarRed` (ambas contra `.../wayback/available`) quedan afuera, con un 200 vacío fijo:
 * no son lo que este archivo prueba.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { crearVerificadorReal, TIMEOUT_LARGO_MS } from '../scripts/validadores/fuentes.ts';

type Accion = Response | Error;

function respuestaVacia(estado: number): Response {
  return new Response('', { status: estado });
}

function fetchDeCola(acciones: Accion[]): { fetch: typeof fetch; llamadas: { url: string; metodo: string }[] } {
  const restante = [...acciones];
  const llamadas: { url: string; metodo: string }[] = [];
  const falso = (async (input: unknown, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : (input as Request).url ?? String(input);
    if (url.includes('/wayback/available')) return respuestaVacia(200);
    llamadas.push({ url, metodo: init?.method ?? 'GET' });
    const siguiente = restante.shift();
    if (siguiente === undefined) throw new Error(`fetch inesperado (sin más respuestas en cola) a ${url}`);
    if (siguiente instanceof Error) throw siguiente;
    return siguiente;
  }) as unknown as typeof fetch;
  return { fetch: falso, llamadas };
}

let fetchOriginal: typeof fetch;
function stubFetch(acciones: Accion[]) {
  fetchOriginal = globalThis.fetch;
  const { fetch: falso, llamadas } = fetchDeCola(acciones);
  globalThis.fetch = falso;
  return llamadas;
}
afterEach(() => {
  globalThis.fetch = fetchOriginal;
});

const ABORT = () => new DOMException('This operation was aborted', 'AbortError');

describe('crearVerificadorReal(): D1, un abort no es un 404', () => {
  it('dos abort en HEAD (timeoutMs, reintentos:1) y un 200 en el GET largo dan HTTP 200', async () => {
    // Host con "www." para no enredar el test con el propio fallback a www. de fetchConTimeout
    // (esFalloDeRed también matchea "abort", y ya lo tiene puesto: sin esto, el 3er intento sería
    // ese fallback y no el GET largo de D1).
    const origen = 'https://www.impo.com.uy/bases/leyes/17296-2001';
    const llamadas = stubFetch([ABORT(), ABORT(), respuestaVacia(200)]);
    const verificar = crearVerificadorReal(15_000);
    const r = await verificar(origen);
    expect(r.http).toBe(200);
    expect(r.error).toBeUndefined();
    expect(llamadas).toHaveLength(3); // HEAD, HEAD, y el GET largo de D1
    expect(llamadas[0]!.metodo).toBe('HEAD');
    expect(llamadas[2]!.metodo).toBe('GET');
  });

  it('ECONNREFUSED no dispara el reintento largo: se rinde con HTTP 0', async () => {
    // También con "www." (mismo motivo que arriba), para que las dos llamadas contadas sean las
    // de fetchConTimeout y no un tercer intento por el propio fallback de esa función.
    const origen = 'https://www.no-existe-este-host.uy/pagina';
    const conexionRechazada = Object.assign(new Error('fetch failed'), { cause: { code: 'ECONNREFUSED' } });
    const llamadas = stubFetch([conexionRechazada, conexionRechazada]);
    const verificar = crearVerificadorReal(15_000);
    const r = await verificar(origen);
    expect(r.http).toBe(0);
    expect(r.error).toMatch(/ECONNREFUSED|fetch failed/);
    // Solo los dos intentos de fetchConTimeout (reintentos:1); nada de un tercero.
    expect(llamadas).toHaveLength(2);
    expect(llamadas.every((l) => l.metodo === 'HEAD')).toBe(true);
  });

  it('un host de Wayback tampoco dispara el reintento largo', async () => {
    const origen = 'https://web.archive.org/web/20200101000000/https://ejemplo.uy/nota';
    // fetchWayback: sin override de reintentos ⇒ el default de fetchConTimeout ahí es 2 (3
    // intentos), y como el host no tiene "www.", agotados esos tres, fetchConTimeout intenta una
    // vez más con "www.web.archive.org" antes de rendirse (mecanismo genérico, no de D1): un
    // cuarto abort para que también falle y quede claro que ninguno fue el GET largo.
    const llamadas = stubFetch([ABORT(), ABORT(), ABORT(), ABORT()]);
    const verificar = crearVerificadorReal(15_000);
    const r = await verificar(origen);
    expect(r.http).toBe(0);
    expect(llamadas).toHaveLength(4);
    // Ninguno es el GET largo de D1 (que solo se usa para hosts que no son Wayback): todos HEAD.
    expect(llamadas.every((l) => l.metodo === 'HEAD')).toBe(true);
  });
});

it('exporta TIMEOUT_LARGO_MS en 60 segundos (D1, motivo: IMPO Ley 17.296, 31 s medidos con curl)', () => {
  expect(TIMEOUT_LARGO_MS).toBe(60_000);
});
