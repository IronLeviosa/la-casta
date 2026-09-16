/**
 * `pnpm corpus:reextraer` sobre un corpus temporal (nunca el real): una nota cuyo texto guardado
 * quedó mucho más corto que lo que da el extractor vigente sobre el mismo HTML (el caso real que
 * motiva el comando: notas viejas de antes del multi-bloque/JSON-LD, 2026-09-16), una nota sin
 * cambio relevante, y la red de que nunca achica un texto al escribir.
 */
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';
import { afterEach, describe, expect, it } from 'vitest';
import { extraerHtml } from '../scripts/lib/extraer.ts';
import { sha256 } from '../scripts/lib/hash.ts';
import { compararExtraccion, htmlCacheadoDe, pasaFiltro, reextraerCorpus } from '../scripts/corpus/reextraer.ts';
import { etiquetasVacias, type Nota } from '../scripts/corpus/tipos.ts';

function notaDePrueba(id: string, extra: Partial<Nota> = {}): Nota {
  return {
    id,
    url: `https://x.uy/${id}`,
    url_canonica: `https://x.uy/${id}`,
    medio: 'x',
    fecha: '2026-08-01',
    titulo: 'Titulo de prueba',
    autor: null,
    tipo: 'html',
    texto: '',
    retrieved_at: '2026-08-01T00:00:00.000Z',
    archived_url: null,
    text_sha256: '',
    etiquetas: etiquetasVacias(),
    resumen: null,
    ...extra,
  };
}

// Un solo <article> sin partir: Readability lo toma entero. Bastante más largo que los textos
// "viejos" que se usan en los tests de abajo, para superar con margen el umbral de 15%.
const HTML_LARGO = `<html><head><title>t</title></head><body><article>${'<p>Un parrafo con bastante texto de relleno para que Readability lo tome como el cuerpo principal de la nota, repetido varias veces para superar el umbral de caracteres. </p>'.repeat(20)}</article></body></html>`;

const HTML_CHICO = '<html><body><article><p>Un parrafo bastante mas corto que el texto guardado.</p></article></body></html>';

function escribirNotaConHtml(carpeta: string, nota: Nota, html: string): void {
  writeFileSync(join(carpeta, `${nota.id}.json`), JSON.stringify(nota, null, 1), 'utf8');
  writeFileSync(join(carpeta, `${nota.id}.html.gz`), gzipSync(Buffer.from(html, 'utf8')));
}

describe('pasaFiltro()', () => {
  it('filtra por medio', () => {
    expect(pasaFiltro({ medio: 'el-pais', fecha: null }, { medio: 'el-observador' })).toBe(false);
    expect(pasaFiltro({ medio: 'el-observador', fecha: null }, { medio: 'el-observador' })).toBe(true);
  });

  it('filtra por rango de mes (AAAA-MM), inclusive en los dos extremos', () => {
    expect(pasaFiltro({ medio: 'x', fecha: '2026-08-15' }, { desde: '2026-08', hasta: '2026-08' })).toBe(true);
    expect(pasaFiltro({ medio: 'x', fecha: '2026-07-31' }, { desde: '2026-08' })).toBe(false);
    expect(pasaFiltro({ medio: 'x', fecha: '2026-09-01' }, { hasta: '2026-08' })).toBe(false);
  });

  it('sin fecha en la nota, pasa cualquier filtro de fechas', () => {
    expect(pasaFiltro({ medio: 'x', fecha: null }, { desde: '2026-08', hasta: '2026-08' })).toBe(true);
  });
});

describe('compararExtraccion()', () => {
  it('calcula el cambio porcentual contra el texto guardado', () => {
    const nota = notaDePrueba('a', { texto: 'x'.repeat(100) });
    const c = compararExtraccion(nota, HTML_LARGO);
    expect(c.largoViejo).toBe(100);
    expect(c.largoNuevo).toBeGreaterThan(115);
    expect(c.cambioPct).toBeCloseTo((c.largoNuevo - 100) / 100, 5);
  });

  it('texto viejo vacío y nuevo con contenido: 100% de cambio', () => {
    const nota = notaDePrueba('b', { texto: '' });
    expect(compararExtraccion(nota, HTML_LARGO).cambioPct).toBe(1);
  });
});

describe('reextraerCorpus()', () => {
  let carpeta: string;
  afterEach(() => {
    if (carpeta) rmSync(carpeta, { recursive: true, force: true });
  });

  it('detecta una nota que creció y, sin --escribir, no toca el disco (simulación)', () => {
    carpeta = mkdtempSync(join(tmpdir(), 'la-casta-reextraer-'));
    const nota = notaDePrueba('crece', { medio: 'el-observador', texto: 'Texto viejo, muy corto.' });
    escribirNotaConHtml(carpeta, nota, HTML_LARGO);

    const r = reextraerCorpus({ carpetaNotas: carpeta });

    expect(r.revisadas).toBe(1);
    expect(r.sinHtml).toBe(0);
    expect(r.comparaciones).toHaveLength(1);
    expect(r.comparaciones[0]).toMatchObject({ id: 'crece', medio: 'el-observador' });
    expect(r.comparaciones[0].cambioPct).toBeGreaterThan(0.15);
    expect(r.escritas).toBe(0);

    const resumen = r.resumenPorMedio.find((m) => m.medio === 'el-observador');
    expect(resumen).toMatchObject({ total: 1, crecen: 1, achican: 0, iguales: 0 });

    // Nada se escribió: el JSON en disco sigue con el texto viejo.
    const disco = JSON.parse(readFileSync(join(carpeta, 'crece.json'), 'utf8')) as Nota;
    expect(disco.texto).toBe('Texto viejo, muy corto.');
  });

  it('con --escribir, reemplaza texto/text_sha256/extraccion y conserva el resto de la nota', () => {
    carpeta = mkdtempSync(join(tmpdir(), 'la-casta-reextraer-'));
    const nota = notaDePrueba('crece2', {
      medio: 'el-observador',
      texto: 'corto',
      resumen: 'resumen que no se toca',
      etiquetas: { ...etiquetasVacias(), temas: ['economia'] },
    });
    escribirNotaConHtml(carpeta, nota, HTML_LARGO);
    const rutaIndice = join(carpeta, 'indice.db');

    const r = reextraerCorpus({ carpetaNotas: carpeta, escribir: true, rutaIndice });

    expect(r.escritas).toBe(1);
    const disco = JSON.parse(readFileSync(join(carpeta, 'crece2.json'), 'utf8')) as Nota;
    expect(disco.texto.length).toBeGreaterThan(200);
    expect(disco.text_sha256).toBe(sha256(disco.texto));
    expect(disco.resumen).toBe('resumen que no se toca');
    expect(disco.etiquetas.temas).toEqual(['economia']);
  });

  it('una nota sin cambio relevante (dentro del umbral) no se lista y queda "igual"', () => {
    carpeta = mkdtempSync(join(tmpdir(), 'la-casta-reextraer-'));
    const textoYaVigente = extraerHtml(HTML_LARGO, 'https://x.uy/igual').texto;
    const nota = notaDePrueba('igual', { texto: textoYaVigente });
    escribirNotaConHtml(carpeta, nota, HTML_LARGO);

    const r = reextraerCorpus({ carpetaNotas: carpeta });

    expect(r.comparaciones).toHaveLength(0);
    const resumen = r.resumenPorMedio.find((m) => m.medio === 'x');
    expect(resumen).toMatchObject({ total: 1, crecen: 0, achican: 0, iguales: 1 });
  });

  it('nunca achica un texto al escribir: lo lista pero no lo toca', () => {
    carpeta = mkdtempSync(join(tmpdir(), 'la-casta-reextraer-'));
    const textoViejoLargo = 'x'.repeat(2000);
    const nota = notaDePrueba('achica', { texto: textoViejoLargo });
    escribirNotaConHtml(carpeta, nota, HTML_CHICO);

    const r = reextraerCorpus({ carpetaNotas: carpeta, escribir: true });

    expect(r.comparaciones).toHaveLength(1);
    expect(r.comparaciones[0].cambioPct).toBeLessThan(-0.15);
    expect(r.escritas).toBe(0);

    const disco = JSON.parse(readFileSync(join(carpeta, 'achica.json'), 'utf8')) as Nota;
    expect(disco.texto).toBe(textoViejoLargo);
  });

  it('cuenta las notas sin .html.gz aparte, y no las compara', () => {
    carpeta = mkdtempSync(join(tmpdir(), 'la-casta-reextraer-'));
    writeFileSync(join(carpeta, 'sin-html.json'), JSON.stringify(notaDePrueba('sin-html', { texto: 'algo' })), 'utf8');

    const r = reextraerCorpus({ carpetaNotas: carpeta });

    expect(r.revisadas).toBe(0);
    expect(r.sinHtml).toBe(1);
    expect(r.comparaciones).toHaveLength(0);
  });

  it('filtra por medio antes de comparar', () => {
    carpeta = mkdtempSync(join(tmpdir(), 'la-casta-reextraer-'));
    escribirNotaConHtml(carpeta, notaDePrueba('a', { medio: 'el-pais', texto: 'corto' }), HTML_LARGO);
    escribirNotaConHtml(carpeta, notaDePrueba('b', { medio: 'el-observador', texto: 'corto' }), HTML_LARGO);

    const r = reextraerCorpus({ carpetaNotas: carpeta, medio: 'el-observador' });

    expect(r.revisadas).toBe(1);
    expect(r.comparaciones.map((c) => c.id)).toEqual(['b']);
  });

  it('--limite tope la cantidad de notas comparadas (con HTML y dentro del filtro)', () => {
    carpeta = mkdtempSync(join(tmpdir(), 'la-casta-reextraer-'));
    for (const id of ['a', 'b', 'c']) escribirNotaConHtml(carpeta, notaDePrueba(id, { texto: 'corto' }), HTML_LARGO);

    const r = reextraerCorpus({ carpetaNotas: carpeta, limite: 2 });

    expect(r.revisadas).toBe(2);
  });
});

describe('htmlCacheadoDe()', () => {
  it('devuelve null si no existe el .html.gz', () => {
    const carpeta = mkdtempSync(join(tmpdir(), 'la-casta-reextraer-'));
    try {
      expect(htmlCacheadoDe(carpeta, 'no-existe')).toBeNull();
    } finally {
      rmSync(carpeta, { recursive: true, force: true });
    }
  });

  it('descomprime el HTML guardado', () => {
    const carpeta = mkdtempSync(join(tmpdir(), 'la-casta-reextraer-'));
    try {
      writeFileSync(join(carpeta, 'x.html.gz'), gzipSync(Buffer.from('<html>hola</html>', 'utf8')));
      expect(htmlCacheadoDe(carpeta, 'x')).toBe('<html>hola</html>');
    } finally {
      rmSync(carpeta, { recursive: true, force: true });
    }
  });
});
