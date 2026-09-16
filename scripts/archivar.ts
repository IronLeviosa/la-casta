/**
 * `pnpm archivar [--limite N] [--todas] [--inbox <dir>] [--json]`
 *
 * Pide a la Wayback Machine (Save Page Now) una copia de cada URL citada en `content/` o, con
 * `--inbox <dir>`, en ese lote, que todavía no tenga `archived_url` en `data/fuentes-ledger.json`,
 * y anota el resultado en el ledger. Antes de pedir nada, mira si la nota del corpus ya trae
 * `archived_url` (la consiguió `pnpm fuente` al leerla): si la trae, la usa y no pide de nuevo
 * (docs/plan-fuentes-lentas.md, D2). Una petición real cada 3 segundos: Save Page Now limita por
 * IP y apurarlo hace que devuelva 429 para todo; ante un 429 o un 520 de Save Page Now, la corrida
 * se corta entera (D4): con un límite por IP, insistir URL por URL solo lo alarga.
 *
 * Es lo que hace que el sitio sobreviva a que un diario borre o edite una nota:
 * el permalink muestra el original y, si cayó, la copia archivada.
 */
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { cargarContenido, type Registro } from './lib/contenido.ts';
import { recorrerFuentes } from './lib/contenido.ts';
import { idDeUrl } from './lib/hash.ts';
import { cargarInbox } from './lib/inbox.ts';
import { escribirLedger, leerLedger, type EntradaLedger, type Ledger } from './lib/ledger.ts';
import { log, parsearArgs } from './lib/log.ts';
import { RAIZ, RUTAS_CORPUS } from './lib/rutas.ts';
import { archivar as pedirArchivo, type ResultadoArchivo } from './lib/wayback.ts';

/** Save Page Now limita por IP: una petición cada 3 s. */
export const ESPERA_MS = 3000;

/** Save Page Now espera al origen; 40 s (el default de `archivar`) no le alcanza a una página de
 * 30 s. `pnpm fuente` sigue con 40 (no puede bloquear a un agente 90 s por nota); esta corrida, que
 * no tiene a nadie esperando, sí puede pagar el costo (docs/plan-fuentes-lentas.md, D2). */
export const TIMEOUT_ARCHIVAR_MS = 90_000;

export interface OpcionesArchivar {
  rootDir?: string;
  ledgerPath?: string;
  /** Carpeta de un lote del inbox: si viene, las URL salen de ahí en vez de content/. */
  inboxDir?: string;
  /** Archivar como mucho N URLs en esta corrida (0 lista las pendientes sin pedir nada). */
  limite?: number;
  /** Reintentar también las que ya tienen copia (por defecto, no). */
  todas?: boolean;
  espera?: number;
  /** Inyectable en tests. */
  pedir?: (url: string) => Promise<ResultadoArchivo>;
  /** `archived_url` de la nota del corpus para esa URL, si la tiene (D2). Inyectable en tests;
   * por defecto lee `<CORPUS_DIR>/notas/<idDeUrl(url)>.json`, la misma nota que usa la etapa
   * `citas` (mismo `idDeUrl`, misma carpeta). */
  archivedUrlDelCorpus?: (url: string) => string | null;
  progreso?: (mensaje: string) => void;
}

export interface ResultadoArchivarTodo {
  pendientes: number;
  intentadas: number;
  archivadas: number;
  fallidas: { url: string; error?: string }[];
  ledger: Ledger;
  /** Todas las URL que hoy necesitan copia (sin recortar por `--limite`), ordenadas: las primeras
   * `intentadas` son las que esta corrida ya procesó (de corpus o pedidas); el resto quedan para
   * la próxima. Con `--limite 0` es la lista completa, sin pedir nada (D2). */
  urlsPendientes: string[];
  /** Si Save Page Now devolvió 429/520 (límite por IP) y la corrida se cortó antes de terminar
   * `aHacer`: el mensaje para el agente, no un error (D4). */
  limitada?: string;
}

function esperar(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/** D2: la nota del corpus por esa URL (misma carpeta y el mismo id que usa la etapa `citas` para
 * ubicarla: `idDeUrl(url)` sobre `<CORPUS_DIR>/notas/`), si ya trae `archived_url`. */
function archivedUrlDelCorpusReal(url: string): string | null {
  try {
    const ruta = path.join(RUTAS_CORPUS.notas, `${idDeUrl(url)}.json`);
    if (!existsSync(ruta)) return null;
    const nota = JSON.parse(readFileSync(ruta, 'utf8')) as { archived_url?: string | null };
    return nota.archived_url ?? null;
  } catch {
    return null;
  }
}

/** `save devolvio HTTP 429`/`520` (scripts/lib/wayback.ts, `archivar()`): el límite por IP de Save
 * Page Now, no un fallo de esa URL en particular (D4). */
function esLimiteDeIp(error: string | undefined): boolean {
  return !!error && /save devolvio HTTP (429|520)\b/.test(error);
}

export async function archivarTodo(opciones: OpcionesArchivar = {}): Promise<ResultadoArchivarTodo> {
  const rootDir = path.resolve(opciones.rootDir ?? RAIZ);
  const ledgerPath = opciones.ledgerPath ?? path.join(rootDir, 'data', 'fuentes-ledger.json');
  const pedir = opciones.pedir ?? ((url: string) => pedirArchivo(url, { timeoutMs: TIMEOUT_ARCHIVAR_MS }));
  const archivedDelCorpus = opciones.archivedUrlDelCorpus ?? archivedUrlDelCorpusReal;
  const progreso = opciones.progreso ?? (() => {});
  const espera = opciones.espera ?? ESPERA_MS;

  let registros: Registro[];
  let erroresDeEsquema: number;
  if (opciones.inboxDir) {
    const inbox = cargarInbox(rootDir, path.resolve(opciones.inboxDir));
    registros = inbox.registros;
    erroresDeEsquema = inbox.errores.length;
  } else {
    const contenido = cargarContenido(rootDir);
    registros = contenido.registros;
    erroresDeEsquema = contenido.errores.length;
  }
  if (erroresDeEsquema) {
    log.aviso(`${erroresDeEsquema} archivo(s) no pasan el esquema; se archivan igual las URLs de los que sí.`);
  }

  const ledger = leerLedger(ledgerPath);
  const urls = new Set<string>();
  for (const reg of registros) {
    recorrerFuentes(reg.datos, (f) => {
      // La fuente puede traer su propia copia; entonces no hace falta pedir nada.
      if (f.archived_url && !ledger[f.url]?.archived_url) {
        ledger[f.url] = {
          http: ledger[f.url]?.http ?? null,
          ok: true,
          archived_url: f.archived_url,
          checked_at: ledger[f.url]?.checked_at ?? new Date().toISOString(),
        } satisfies EntradaLedger;
      }
      if (opciones.todas || !ledger[f.url]?.archived_url) urls.add(f.url);
    });
  }

  const lista = [...urls].sort();
  const pendientes = lista.length;
  const aHacer = opciones.limite !== undefined ? lista.slice(0, opciones.limite) : lista;

  let archivadas = 0;
  let procesadas = 0;
  let pedidosHechos = 0;
  let limitada: string | undefined;
  const fallidas: { url: string; error?: string }[] = [];
  for (const [i, url] of aHacer.entries()) {
    // D2: la nota del corpus ya la archivó `pnpm fuente` al leerla; no hace falta pedirle nada a
    // Save Page Now, y esto no cuenta contra la espera de 3 s entre pedidos reales.
    const deCorpus = !opciones.todas ? archivedDelCorpus(url) : null;
    if (deCorpus) {
      const previa = ledger[url];
      const entrada: EntradaLedger = {
        http: previa?.http ?? null,
        ok: true,
        archived_url: deCorpus,
        checked_at: previa?.checked_at ?? new Date().toISOString(),
      };
      if (previa?.text_sha256) entrada.text_sha256 = previa.text_sha256;
      delete entrada.error;
      ledger[url] = entrada;
      archivadas++;
      procesadas++;
      progreso(`[${i + 1}/${aHacer.length}] corpus ${deCorpus} ← ${url}`);
      continue;
    }

    if (pedidosHechos > 0 && espera > 0) await esperar(espera);
    const r = await pedir(url);
    pedidosHechos++;
    procesadas++;
    const previa = ledger[url];
    const entrada: EntradaLedger = {
      http: previa?.http ?? null,
      ok: previa?.ok ?? !!r.archived_url,
      archived_url: r.archived_url,
      checked_at: previa?.checked_at ?? new Date().toISOString(),
    };
    if (previa?.text_sha256) entrada.text_sha256 = previa.text_sha256;
    if (r.archived_url) {
      entrada.ok = true;
      delete entrada.error;
      archivadas++;
    } else {
      entrada.error = r.error;
      fallidas.push({ url, error: r.error });
    }
    ledger[url] = entrada;
    progreso(`[${i + 1}/${aHacer.length}] ${r.archived_url ? `${r.origen} ${r.archived_url}` : `sin archivo (${r.error ?? 'sin snapshot'})`} ← ${url}`);

    // D4: un 429/520 de Save Page Now es el límite por IP, no que esta URL en particular esté
    // mal; seguir pidiendo una por una con el mismo resultado solo alarga la espera de 3 s por
    // cada una sin conseguir nada. Se corta acá; lo que falta queda pendiente para la próxima.
    if (esLimiteDeIp(r.error)) {
      limitada = `Wayback está limitando esta IP (${r.error}); reintentá más tarde. Quedan ${aHacer.length - (i + 1)} URL(s) de esta corrida sin intentar.`;
      break;
    }
  }

  escribirLedger(ledgerPath, ledger);
  return { pendientes, intentadas: procesadas, archivadas, fallidas, ledger, urlsPendientes: lista, limitada };
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const AYUDA = `pnpm archivar [--limite N] [--todas] [--inbox <dir>] [--json]

Pide copia en Wayback de cada URL citada en content/ o, con --inbox <dir>, en
ese lote, sin archived_url en el ledger, a razón de una cada 3 segundos (salvo
las que la nota del corpus ya trae archivadas, que no piden nada), y actualiza
data/fuentes-ledger.json.

  --limite N     archivar como mucho N URLs en esta corrida (0 solo lista las pendientes)
  --todas        reintentar también las que ya tienen copia
  --inbox <dir>  archivar las URL de ese lote del inbox en vez de las de content/
  --json         resumen en JSON por stdout`;

async function main(): Promise<void> {
  const { opciones } = parsearArgs(process.argv.slice(2));
  if (opciones.ayuda || opciones.help) {
    console.log(AYUDA);
    process.exit(0);
  }
  const json = opciones.json === true;
  const limite = typeof opciones.limite === 'string' ? Number(opciones.limite) : undefined;
  if (limite !== undefined && (!Number.isFinite(limite) || limite < 0)) {
    console.error('--limite espera un número (0 o más).');
    process.exit(2);
  }
  const inboxDir = typeof opciones.inbox === 'string' ? opciones.inbox : undefined;
  try {
    const r = await archivarTodo({
      limite,
      todas: opciones.todas === true,
      inboxDir,
      progreso: json ? undefined : (m) => log.info(m),
    });
    if (json) {
      console.log(JSON.stringify({ pendientes: r.pendientes, intentadas: r.intentadas, archivadas: r.archivadas, fallidas: r.fallidas, urlsPendientes: r.urlsPendientes, limitada: r.limitada }, null, 2));
    } else {
      log.ok(`${r.archivadas}/${r.intentadas} archivada(s); quedan ${Math.max(0, r.pendientes - r.intentadas)} sin intentar.`);
      for (const f of r.fallidas) log.aviso(`sin archivo: ${f.url}${f.error ? ` (${f.error})` : ''}`);
      // Lo que esta corrida no llegó a tocar (por --limite, o porque D4 cortó ante un 429/520).
      for (const url of r.urlsPendientes.slice(r.intentadas)) log.info(`pendiente: ${url}`);
      if (r.limitada) log.error(r.limitada);
    }
    process.exit(r.limitada ? 2 : 0);
  } catch (e) {
    log.error(`No se pudo archivar: ${(e as Error).message}`);
    process.exit(2);
  }
}

const esEntrada = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (esEntrada) {
  main().catch((e) => {
    log.error((e as Error).message);
    process.exit(2);
  });
}
