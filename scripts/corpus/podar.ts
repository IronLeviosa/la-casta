/**
 * pnpm corpus:podar [--aplicar] [--hosts a,b,c]
 *
 * Borra del corpus los PDF originales que ya no hacen falta: los que tienen su texto extraído en el
 * JSON de la nota (más de 1.000 caracteres) y vienen de un publicador con URL estable, del que el
 * PDF se puede volver a bajar igual (la Hemeroteca del Parlamento, el sistema de información
 * legislativa, las capturas de Wayback). El texto es lo que citan los registros y lo que coteja
 * `pnpm validar --red`; el PDF escaneado pesa cien veces más y no lo lee nada después de extraído
 * (`pnpm fuente --ocr` vuelve a bajar el original). Los PDF de sitios que pueden cambiar o
 * desaparecer (empresas públicas, ministerios, prensa) se conservan. Sin `--aplicar`, solo cuenta.
 */
import { existsSync, readdirSync, readFileSync, statSync, unlinkSync } from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { CORPUS_DIR, RAIZ } from '../lib/rutas.ts';
import { log, parsearArgs } from '../lib/log.ts';

const { opciones } = parsearArgs(process.argv.slice(2));
const aplicar = opciones.aplicar === true;
const HOSTS_ESTABLES = new Set(
  typeof opciones.hosts === 'string' ? opciones.hosts.split(',').map((h) => h.trim()) : ['biblioteca.parlamento.gub.uy', 'infolegislativa.parlamento.gub.uy', 'web.archive.org'],
);
const MINIMO_TEXTO = 1000;

const db = new DatabaseSync(path.join(CORPUS_DIR, 'indice.db'), { readOnly: true });
const notas = db.prepare('select id, url, coalesce(largo, 0) as largo from notas').all() as { id: string; url: string; largo: number }[];
const dir = path.join(CORPUS_DIR, 'notas');
const porHost = new Map<string, { n: number; bytes: number }>();
let borrables = 0;
let bytes = 0;
let conservados = 0;
let sinTexto = 0;
for (const n of notas) {
  const pdf = path.join(dir, `${n.id}.pdf`);
  if (!existsSync(pdf)) continue;
  let host = '?';
  try {
    host = new URL(n.url).hostname;
  } catch {
    /* url rara */
  }
  const json = path.join(dir, `${n.id}.json`);
  const texto = existsSync(json) ? (JSON.parse(readFileSync(json, 'utf8')).texto ?? '') : '';
  if (texto.length < MINIMO_TEXTO) {
    sinTexto++;
    continue;
  }
  if (!HOSTS_ESTABLES.has(host)) {
    conservados++;
    continue;
  }
  const tam = statSync(pdf).size;
  const acc = porHost.get(host) ?? { n: 0, bytes: 0 };
  acc.n++;
  acc.bytes += tam;
  porHost.set(host, acc);
  borrables++;
  bytes += tam;
  if (aplicar) unlinkSync(pdf);
}
for (const [h, a] of [...porHost.entries()].sort((x, y) => y[1].bytes - x[1].bytes)) log.info(`${h}: ${a.n} PDF, ${(a.bytes / 1e9).toFixed(2)} GB`);
log.info(`Conservados por venir de sitios que pueden cambiar: ${conservados}. Conservados por no tener texto extraído suficiente: ${sinTexto}.`);
if (aplicar) log.ok(`Borrados ${borrables} PDF (${(bytes / 1e9).toFixed(2)} GB). El texto de cada uno sigue en su JSON; el original se vuelve a bajar con pnpm fuente --forzar.`);
else log.ok(`Simulación: se borrarían ${borrables} PDF (${(bytes / 1e9).toFixed(2)} GB). Corré con --aplicar para hacerlo.`);

/* La copia del PDF que guarda el OCR reanudable (`.cache/ocr/<sha>.pdf`) tampoco hace falta una vez
   que las páginas quedaron leídas (`.cache/ocr/<sha>/p<N>.txt`): si hay que volver a pasar el OCR,
   `pnpm fuente --ocr` vuelve a bajar el original y lo guarda de nuevo. */
const cacheOcr = path.join(RAIZ, '.cache', 'ocr');
if (existsSync(cacheOcr)) {
  let nOcr = 0;
  let bytesOcr = 0;
  for (const f of readdirSync(cacheOcr)) {
    if (!f.endsWith('.pdf')) continue;
    const ruta = path.join(cacheOcr, f);
    bytesOcr += statSync(ruta).size;
    nOcr++;
    if (aplicar) unlinkSync(ruta);
  }
  log.info(`${aplicar ? 'Borradas' : 'Se borrarían'} ${nOcr} copias de PDF del caché de OCR (${(bytesOcr / 1e9).toFixed(2)} GB); las páginas ya leídas quedan.`);
}
