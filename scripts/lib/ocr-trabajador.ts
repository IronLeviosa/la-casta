/**
 * Proceso hijo desacoplado que hace el OCR de un PDF página por página y lo guarda en el caché
 * existente (`.cache/ocr/<sha>/pN.txt`). Lo lanza `lanzarOcrSegundoPlano` (scripts/lib/ocr.ts)
 * desde `pnpm fuente` cuando un escaneo no entra en los 2 minutos que la herramienta Bash de los
 * agentes le da al proceso padre antes de matarlo con código 143 (plan 2026-09, ítem 1.9).
 *
 * Este proceso sigue vivo aunque el padre muera: cada página que termina queda en el mismo caché
 * por página que ya usa el camino sincrónico, así que una llamada posterior a `pnpm fuente` (del
 * mismo agente u otro) retoma el progreso sin importar quién lo escribió.
 *
 * Uso: tsx scripts/lib/ocr-trabajador.ts <ruta-del-pdf> <n1,n2,n3,...>
 */
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sha256 } from './hash.ts';
import { CACHE_OCR, ocrPaginas } from './ocr.ts';

async function main(): Promise<void> {
  const [rutaPdf, listaPaginas] = process.argv.slice(2);
  if (!rutaPdf || !existsSync(rutaPdf)) {
    process.stderr.write(`ocr-trabajador: no existe el PDF "${rutaPdf}"\n`);
    process.exitCode = 1;
    return;
  }
  const numeros = (listaPaginas ?? '')
    .split(',')
    .map((n) => Number(n.trim()))
    .filter((n) => Number.isFinite(n) && n > 0);
  const sha = sha256(readFileSync(rutaPdf));
  const rutaLock = join(CACHE_OCR, `${sha}.lock.json`);
  try {
    await ocrPaginas(rutaPdf, numeros);
  } catch (e) {
    try {
      mkdirSync(CACHE_OCR, { recursive: true });
      writeFileSync(join(CACHE_OCR, `${sha}.error.log`), `${new Date().toISOString()} ${(e as Error).stack ?? (e as Error).message}\n`, { flag: 'a' });
    } catch {
      /* nada mas que hacer: sin caché no hay donde escribir el error */
    }
  } finally {
    // Se borra el lock haya terminado bien o mal: un lock que sobrevive a su proceso bloquearía
    // reintentos para siempre. Si falló, la próxima llamada ve las páginas que faltan y reintenta.
    try {
      rmSync(rutaLock, { force: true });
    } catch {
      /* nada que hacer */
    }
  }
}

const esEntrada = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (esEntrada) {
  main();
}
