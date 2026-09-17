/**
 * `obtenerNota` sobre una nota HTML ya guardada cuyo HTML cacheado parece un armazón de
 * JavaScript (`pareceArmazonJs`, scripts/corpus/fuente.ts). Hasta el 2026-09-15 esto tiraba y
 * `pnpm validar --red` lo convertía en "fuente no descargable" -> error, aunque el heurístico
 * tiene falsos positivos: 194 de 280 fuentes de parlamento.gub.uy que lo disparaban el
 * 2026-09-16 sí tenían la cita en el texto corto ya guardado (`content/politicos/aita-ubaldo.yaml`,
 * fuente `.../legisladores/12650/legislaturas-actuo`, es uno de esos casos). Ahora `obtenerNota`
 * devuelve la nota igual, marcada (`armazon_js: true`), y es `validarCitas` quien decide si la
 * cita aparece (tests/citas.test.ts).
 *
 * Corre sobre un `CORPUS_DIR` temporal, nunca el corpus real: hay workers corriendo sobre
 * `../la-casta-corpus/` y este archivo no debe tocarlo. `process.env.CORPUS_DIR` se fija antes de
 * importar `scripts/lib/rutas.ts` (y todo lo que lo usa), así que esos imports son dinámicos: un
 * `import` estático de `scripts/corpus/fuente.ts` ya habría evaluado `rutas.ts` con el
 * `CORPUS_DIR` de siempre.
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { gzipSync } from 'node:zlib';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { idDeUrl } from '../scripts/lib/hash.ts';
import { etiquetasVacias, type Nota } from '../scripts/corpus/tipos.ts';

const CORPUS_TMP = mkdtempSync(path.join(tmpdir(), 'la-casta-corpus-armazon-js-'));

const URL_FIXTURE = 'https://parlamento.gub.uy/fixture/legislador-armazon-test';
const ID = idDeUrl(URL_FIXTURE);
const CITA = 'Representante Nacional por el Lema PARTIDO FRENTE AMPLIO - Legislatura XLIX';

function notaHtmlCorta(texto: string): Nota {
  return {
    id: ID,
    url: URL_FIXTURE,
    url_canonica: URL_FIXTURE,
    medio: 'parlamento',
    fecha: null,
    titulo: null,
    autor: null,
    tipo: 'html',
    texto,
    retrieved_at: '2026-09-01T00:00:00.000Z',
    archived_url: null,
    text_sha256: '0',
    etiquetas: etiquetasVacias(),
    resumen: null,
  };
}

/** El mismo shape de armazón JS (Angular/React) que dispara `pareceArmazonJs` en tests/fuente.test.ts. */
function htmlArmazon(): string {
  return (
    '<!doctype html><html><head><title>Parlamento</title></head><body><app-root></app-root>' +
    '<script src="runtime.js"></script><script src="polyfills.js"></script><script src="main.js"></script>' +
    '<!-- relleno -->'.repeat(400) +
    '</body></html>'
  );
}

let RUTAS_CORPUS: typeof import('../scripts/lib/rutas.ts').RUTAS_CORPUS;
let obtenerNota: typeof import('../scripts/corpus/fuente.ts').obtenerNota;
let pareceArmazonJs: typeof import('../scripts/corpus/fuente.ts').pareceArmazonJs;

beforeAll(async () => {
  process.env.CORPUS_DIR = CORPUS_TMP;
  ({ RUTAS_CORPUS } = await import('../scripts/lib/rutas.ts'));
  // Guarda de seguridad: si por cache de módulos `rutas.ts` ya se había evaluado con el
  // CORPUS_DIR real (hay workers corriendo sobre ../la-casta-corpus/), preferimos que el test
  // falle a escribir ahí. No debería pasar (vitest resetea módulos por archivo con `isolate`
  // por defecto), pero el costo de estar mal acá es alto.
  if (!path.resolve(RUTAS_CORPUS.raiz).startsWith(path.resolve(CORPUS_TMP))) {
    throw new Error(`CORPUS_DIR no se redirigió al temporal (quedó en ${RUTAS_CORPUS.raiz}); abortando para no tocar el corpus real.`);
  }
  ({ obtenerNota, pareceArmazonJs } = await import('../scripts/corpus/fuente.ts'));
  mkdirSync(RUTAS_CORPUS.notas, { recursive: true });
});

afterAll(() => {
  rmSync(CORPUS_TMP, { recursive: true, force: true });
});

describe('obtenerNota sobre una nota previa que parece armazón JS', () => {
  it('el HTML de fixture sí dispara el heurístico (control del test)', () => {
    expect(pareceArmazonJs(CITA, htmlArmazon())).toBe(true);
  });

  it('no tira: devuelve la nota marcada en vez de lanzar', async () => {
    writeFileSync(path.join(RUTAS_CORPUS.notas, `${ID}.json`), JSON.stringify(notaHtmlCorta(CITA)));
    writeFileSync(path.join(RUTAS_CORPUS.notas, `${ID}.html.gz`), gzipSync(Buffer.from(htmlArmazon(), 'utf8')));

    const r = await obtenerNota(URL_FIXTURE, { sinArchivo: true, sinHaiku: true });

    expect(r.nueva).toBe(false);
    expect(r.nota.texto).toBe(CITA);
    expect(r.nota.armazon_js).toBe(true);
    expect(r.nota.armazon_js_detalle).toMatch(/^texto extraído de \d+ caracteres, \d+ scripts$/);
  });

  it('una nota previa que no parece armazón JS no lleva la marca', async () => {
    const url = 'https://parlamento.gub.uy/fixture/nota-normal-test';
    const id = idDeUrl(url);
    const textoLargo = 'Un párrafo largo y legible de una nota real. '.repeat(30);
    writeFileSync(
      path.join(RUTAS_CORPUS.notas, `${id}.json`),
      JSON.stringify({ ...notaHtmlCorta(textoLargo), id, url, url_canonica: url }),
    );
    writeFileSync(path.join(RUTAS_CORPUS.notas, `${id}.html.gz`), gzipSync(Buffer.from(`<html><body><article>${textoLargo}</article></body></html>`, 'utf8')));

    const r = await obtenerNota(url, { sinArchivo: true, sinHaiku: true });

    expect(r.nota.armazon_js).toBeUndefined();
  });

  it('sin HTML cacheado (nota vieja sin .html.gz), tampoco tira', async () => {
    const url = 'https://parlamento.gub.uy/fixture/sin-html-cacheado-test';
    const id = idDeUrl(url);
    writeFileSync(path.join(RUTAS_CORPUS.notas, `${id}.json`), JSON.stringify({ ...notaHtmlCorta(CITA), id, url, url_canonica: url }));
    expect(existsSync(path.join(RUTAS_CORPUS.notas, `${id}.html.gz`))).toBe(false);

    const r = await obtenerNota(url, { sinArchivo: true, sinHaiku: true });

    expect(r.nota.armazon_js).toBeUndefined();
    expect(r.nota.texto).toBe(CITA);
  });
});
