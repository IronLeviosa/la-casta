/**
 * `pnpm archivar [--limite N] [--todas] [--json]`
 *
 * Pide a la Wayback Machine (Save Page Now) una copia de cada URL citada en
 * `content/` que todavía no tenga `archived_url` en `data/fuentes-ledger.json`,
 * y anota el resultado en el ledger. Una petición cada 3 segundos: Save Page Now
 * limita por IP y apurarlo hace que devuelva 429 para todo.
 *
 * Es lo que hace que el sitio sobreviva a que un diario borre o edite una nota:
 * el permalink muestra el original y, si cayó, la copia archivada.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { cargarContenido } from './lib/contenido.ts';
import { recorrerFuentes } from './lib/contenido.ts';
import { escribirLedger, leerLedger, type EntradaLedger, type Ledger } from './lib/ledger.ts';
import { log, parsearArgs } from './lib/log.ts';
import { RAIZ } from './lib/rutas.ts';
import { archivar as pedirArchivo, type ResultadoArchivo } from './lib/wayback.ts';

/** Save Page Now limita por IP: una petición cada 3 s. */
export const ESPERA_MS = 3000;

export interface OpcionesArchivar {
  rootDir?: string;
  ledgerPath?: string;
  /** Archivar como mucho N URLs en esta corrida. */
  limite?: number;
  /** Reintentar también las que ya tienen copia (por defecto, no). */
  todas?: boolean;
  espera?: number;
  /** Inyectable en tests. */
  pedir?: (url: string) => Promise<ResultadoArchivo>;
  progreso?: (mensaje: string) => void;
}

export interface ResultadoArchivarTodo {
  pendientes: number;
  intentadas: number;
  archivadas: number;
  fallidas: { url: string; error?: string }[];
  ledger: Ledger;
}

function esperar(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export async function archivarTodo(opciones: OpcionesArchivar = {}): Promise<ResultadoArchivarTodo> {
  const rootDir = path.resolve(opciones.rootDir ?? RAIZ);
  const ledgerPath = opciones.ledgerPath ?? path.join(rootDir, 'data', 'fuentes-ledger.json');
  const pedir = opciones.pedir ?? ((url: string) => pedirArchivo(url));
  const progreso = opciones.progreso ?? (() => {});
  const espera = opciones.espera ?? ESPERA_MS;

  const contenido = cargarContenido(rootDir);
  if (contenido.errores.length) {
    log.aviso(`${contenido.errores.length} archivo(s) no pasan el esquema; se archivan igual las URLs de los que sí.`);
  }

  const ledger = leerLedger(ledgerPath);
  const urls = new Set<string>();
  for (const reg of contenido.registros) {
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
  const fallidas: { url: string; error?: string }[] = [];
  for (const [i, url] of aHacer.entries()) {
    if (i > 0 && espera > 0) await esperar(espera);
    const r = await pedir(url);
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
  }

  escribirLedger(ledgerPath, ledger);
  return { pendientes, intentadas: aHacer.length, archivadas, fallidas, ledger };
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const AYUDA = `pnpm archivar [--limite N] [--todas] [--json]

Pide copia en Wayback de cada URL de content/ sin archived_url en el ledger,
a razón de una cada 3 segundos, y actualiza data/fuentes-ledger.json.

  --limite N   archivar como mucho N URLs en esta corrida
  --todas      reintentar también las que ya tienen copia
  --json       resumen en JSON por stdout`;

async function main(): Promise<void> {
  const { opciones } = parsearArgs(process.argv.slice(2));
  if (opciones.ayuda || opciones.help) {
    console.log(AYUDA);
    process.exit(0);
  }
  const json = opciones.json === true;
  const limite = typeof opciones.limite === 'string' ? Number(opciones.limite) : undefined;
  if (limite !== undefined && (!Number.isFinite(limite) || limite <= 0)) {
    console.error('--limite espera un número positivo.');
    process.exit(2);
  }
  try {
    const r = await archivarTodo({
      limite,
      todas: opciones.todas === true,
      progreso: json ? undefined : (m) => log.info(m),
    });
    if (json) {
      console.log(JSON.stringify({ pendientes: r.pendientes, intentadas: r.intentadas, archivadas: r.archivadas, fallidas: r.fallidas }, null, 2));
    } else {
      log.ok(`${r.archivadas}/${r.intentadas} archivada(s); quedan ${Math.max(0, r.pendientes - r.intentadas)} sin intentar.`);
      for (const f of r.fallidas) log.aviso(`sin archivo: ${f.url}${f.error ? ` (${f.error})` : ''}`);
    }
    process.exit(0);
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
