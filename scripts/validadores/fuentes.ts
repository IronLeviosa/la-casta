/**
 * Etapa 4 (--red): estado HTTP de cada URL citada y copia en Wayback.
 *
 * Por cada URL única: HEAD (o GET si el servidor rechaza HEAD) con timeout de
 * 15 s y el User-Agent del proyecto. 2xx ⇒ ok. Si no, consulta la Availability
 * API de Wayback; con snapshot ⇒ ok (archivada). Actualiza el ledger
 * `{http, ok, archived_url, checked_at}`. Una URL de un registro publicado sin
 * respuesta ni archivo es error. Sin red ⇒ fallo de infraestructura (código 2).
 */
import path from 'node:path';
import { fetchConTimeout } from '../lib/http.ts';
import { snapshotDisponible, fetchWayback } from '../lib/wayback.ts';
import { hostDe } from '../lib/url.ts';
import { recorrerFuentes, type Contenido } from '../lib/contenido.ts';
import { escribirLedger, leerLedger, type EntradaLedger, type Ledger } from '../lib/ledger.ts';
import { ErrorInfraestructura, resultadoVacio, type ResultadoEtapa } from './tipos.ts';

/** true si la URL se sirve desde el propio Wayback (una cita que solo sobrevive archivada, o la
 * consulta de disponibilidad). Esas piden pasar por `fetchWayback`: cupo de concurrencia 2 y dos
 * reintentos con espera creciente, porque el host limita por IP y no por la fuente citada. */
function esHostWayback(url: string): boolean {
  const h = hostDe(url);
  return h === 'web.archive.org' || h === 'archive.org';
}

export interface EstadoUrl {
  http: number;
  archived_url: string | null;
  error?: string;
}

/** Función inyectable (tests) que verifica una URL. */
export type VerificadorUrl = (url: string, previa?: EntradaLedger) => Promise<EstadoUrl>;

export interface OpcionesFuentes {
  ledgerPath?: string;
  modoInbox?: boolean;
  verificarUrl?: VerificadorUrl;
  timeoutMs?: number;
  concurrencia?: number;
  /** Informe de progreso (stderr). */
  progreso?: (mensaje: string) => void;
}

let redComprobada = false;

/** Una sola comprobación de conectividad por proceso. Lanza ErrorInfraestructura si no hay red. */
export async function comprobarRed(): Promise<void> {
  if (redComprobada) return;
  try {
    await fetchConTimeout('https://archive.org/wayback/available?url=example.com', { metodo: 'HEAD', timeoutMs: 10_000, reintentos: 1 });
    redComprobada = true;
  } catch (e) {
    throw new ErrorInfraestructura(`Sin conexión a la red (no responde archive.org): ${(e as Error).message}`);
  }
}

function esErrorDeRed(e: unknown): boolean {
  const m = String((e as Error)?.message ?? e) + String((e as any)?.cause?.code ?? '');
  return /ENOTFOUND|EAI_AGAIN|ECONNREFUSED|ENETUNREACH|EHOSTUNREACH|fetch failed|aborted/i.test(m);
}

/** Verificación real: HEAD → GET si hace falta → Wayback availability. */
export function crearVerificadorReal(timeoutMs = 15_000): VerificadorUrl {
  return async (url, previa) => {
    let http = 0;
    let error: string | undefined;
    // Una cita puede apuntar directo a una captura de web.archive.org (la fuente original ya no
    // existe); esos pedidos van por el cupo y los reintentos de Wayback, no por los genéricos.
    const wayback = esHostWayback(url);
    const fetcher = wayback ? fetchWayback : fetchConTimeout;
    try {
      let r = await fetcher(url, { metodo: 'HEAD', timeoutMs, ...(wayback ? {} : { reintentos: 1 }) });
      if (r.status === 405 || r.status === 403 || r.status === 501 || r.status === 400) {
        r = await fetcher(url, { metodo: 'GET', timeoutMs, ...(wayback ? {} : { reintentos: 1 }) });
        // No hace falta leer el cuerpo; cancelar la descarga.
        try {
          await r.body?.cancel();
        } catch {
          /* ignorar */
        }
      }
      http = r.status;
    } catch (e) {
      error = (e as Error).message;
      if (esErrorDeRed(e)) await comprobarRed(); // lanza si es la red local
    }
    let archived_url = previa?.archived_url ?? null;
    if (!archived_url) archived_url = await snapshotDisponible(url);
    return { http, archived_url, error };
  };
}

async function enParalelo<T>(items: T[], n: number, fn: (item: T) => Promise<void>): Promise<void> {
  let i = 0;
  const trabajadores = Array.from({ length: Math.max(1, Math.min(n, items.length)) }, async () => {
    while (i < items.length) {
      const item = items[i++];
      await fn(item);
    }
  });
  await Promise.all(trabajadores);
}

export interface ResultadoFuentes extends ResultadoEtapa {
  ledger: Ledger;
  verificadas: number;
  /** URLs cuya verificación de hoy no se pudo completar (red caída o límite de Wayback) y se
   * conservó el estado anterior: no son fuentes caídas, son fuentes sin comprobar hoy. */
  noComprobadas: number;
  /** URLs que esta corrida marcó `ok: false` en el ledger (fuentes caídas de verdad). */
  caidas: number;
}

export async function validarFuentes(contenido: Contenido, opciones: OpcionesFuentes = {}): Promise<ResultadoFuentes> {
  const r = resultadoVacio();
  const ledgerPath = opciones.ledgerPath ?? path.join(contenido.rootDir, 'data', 'fuentes-ledger.json');
  const modoInbox = opciones.modoInbox === true;
  const verificar = opciones.verificarUrl ?? crearVerificadorReal(opciones.timeoutMs);
  const progreso = opciones.progreso ?? (() => {});

  let ledger: Ledger;
  try {
    ledger = leerLedger(ledgerPath);
  } catch (e) {
    throw new ErrorInfraestructura(`No se pudo leer el ledger ${ledgerPath}: ${(e as Error).message}`);
  }

  // URL → registros que la usan (para saber si alguno está publicado).
  const usos = new Map<string, { archivo: string; campo: string; publicado: boolean }[]>();
  for (const reg of contenido.registros) {
    if (modoInbox && !reg.enInbox) continue;
    const publicado = reg.datos.revision?.tier === 'publicado';
    recorrerFuentes(reg.datos, (f, ruta) => {
      if (!usos.has(f.url)) usos.set(f.url, []);
      usos.get(f.url)!.push({ archivo: reg.archivo, campo: `${ruta}.url`, publicado });
    });
  }

  const urls = [...usos.keys()].sort();
  if (!opciones.verificarUrl && urls.length) await comprobarRed();

  let hechas = 0;
  let noComprobadas = 0;
  let caidas = 0;
  await enParalelo(urls, opciones.concurrencia ?? 4, async (url) => {
    const previa = ledger[url];
    const estado = await verificar(url, previa);
    // Un fallo de red (HTTP 0: timeout, conexión cortada) no dice nada sobre si la fuente existe.
    // Si el ledger ya la tenía verificada, se conserva esa verificación y se anota el intento
    // fallido; si no, queda registrada como no comprobada, y `tiers` la trata como aviso, no como
    // fuente caída (2026-09-10: 1.344 URL revalidadas de golpe dejaron 55 capturas de Wayback como
    // «caídas» que respondían 200 un minuto después).
    //
    // Lo mismo vale para un 404 o un 429 de web.archive.org sobre una cita que solo sobrevive
    // archivada: ese código lo devuelve el límite de pedidos por IP de Wayback, no la desaparición
    // del documento (64 fuentes vivas quedaron marcadas «caídas» así en una revalidación masiva).
    const esRebote429o404DeWayback = (estado.http === 404 || estado.http === 429) && esHostWayback(url);
    if ((estado.http === 0 || esRebote429o404DeWayback) && previa?.ok) {
      const motivo = estado.http === 0 ? estado.error : `web.archive.org devolvió HTTP ${estado.http}`;
      ledger[url] = { ...previa, ultimo_fallo: new Date().toISOString(), error: motivo };
      hechas++;
      noComprobadas++;
      progreso(`[${hechas}/${urls.length}] ok  (no se pudo comprobar hoy${motivo ? `: ${motivo}` : ''}, se conserva la verificación de ${previa.checked_at.slice(0, 10)}) ${url}`);
      return;
    }
    const ok = (estado.http >= 200 && estado.http < 300) || !!estado.archived_url;
    const entrada: EntradaLedger = {
      http: estado.http,
      ok,
      archived_url: estado.archived_url,
      checked_at: new Date().toISOString(),
    };
    if (previa?.text_sha256) entrada.text_sha256 = previa.text_sha256;
    if (estado.error) entrada.error = estado.error;
    ledger[url] = entrada;
    hechas++;
    if (!ok) caidas++;
    progreso(`[${hechas}/${urls.length}] ${ok ? 'ok ' : 'NO '} ${estado.http} ${estado.archived_url ? 'archivada' : 'sin archivo'} ${url}`);
    if (!ok) {
      for (const uso of usos.get(url)!) {
        const mensaje = `Fuente no responde (HTTP ${estado.http}${estado.error ? `, ${estado.error}` : ''}) y no tiene copia en Wayback: ${url}. Corré pnpm archivar; si sigue caída, bajá el tier o marcá verificacion: manual.`;
        (uso.publicado ? r.errores : r.avisos).push({ archivo: uso.archivo, campo: uso.campo, mensaje });
      }
    } else if (!(estado.http >= 200 && estado.http < 300)) {
      for (const uso of usos.get(url)!) {
        r.avisos.push({ archivo: uso.archivo, campo: uso.campo, mensaje: `El original no responde (HTTP ${estado.http}); se usa la copia archivada ${estado.archived_url}.` });
      }
    }
  });

  if (!modoInbox) {
    try {
      escribirLedger(ledgerPath, ledger);
    } catch (e) {
      throw new ErrorInfraestructura(`No se pudo escribir el ledger ${ledgerPath}: ${(e as Error).message}`);
    }
  }

  return { ...r, ledger, verificadas: urls.length, noComprobadas, caidas };
}
