/**
 * `pnpm corpus:borrar` sobre un corpus temporal y un `content/` temporal (nunca el real): borra una
 * nota sin citas (archivos, filas de índice, trabajos pendientes de cola, línea en borradas.jsonl),
 * se niega si `content/` la cita o si el catálogo ya sacó afirmaciones de ella, y `--simulacion` no
 * toca nada. Caso real que motiva el comando (2026-09-16): una URL armada a mano por el crítico que
 * devolvió una nota ajena, sin ningún registro que la citara, con un trabajo `catalogar` encolado.
 */
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { borrarNota } from '../scripts/corpus/borrar.ts';
import { abrirIndice, indexarNota } from '../scripts/corpus/indexar.ts';
import { etiquetasVacias, type Nota } from '../scripts/corpus/tipos.ts';

function notaDePrueba(id: string, extra: Partial<Nota> = {}): Nota {
  return {
    id,
    url: `https://montevideo.com.uy/nota-${id}`,
    url_canonica: `https://montevideo.com.uy/nota-${id}`,
    medio: 'montevideo-portal',
    fecha: '2026-08-01',
    titulo: 'Nota de prueba',
    autor: null,
    tipo: 'html',
    texto: 'texto de prueba, no importa el contenido para este test',
    retrieved_at: '2026-08-01T00:00:00.000Z',
    archived_url: null,
    text_sha256: '0',
    etiquetas: etiquetasVacias(),
    resumen: null,
    ...extra,
  };
}

function armarCorpus(): string {
  const carpeta = mkdtempSync(join(tmpdir(), 'la-casta-borrar-corpus-'));
  mkdirSync(join(carpeta, 'notas'), { recursive: true });
  mkdirSync(join(carpeta, 'cola', 'en_curso'), { recursive: true });
  return carpeta;
}

function escribirNota(carpetaCorpus: string, nota: Nota): void {
  writeFileSync(join(carpetaCorpus, 'notas', `${nota.id}.json`), JSON.stringify(nota, null, 1), 'utf8');
}

describe('borrarNota()', () => {
  let carpetaCorpus: string;
  let carpetaContent: string;

  afterEach(() => {
    if (carpetaCorpus) rmSync(carpetaCorpus, { recursive: true, force: true });
    if (carpetaContent) rmSync(carpetaContent, { recursive: true, force: true });
  });

  it('borra una nota sin citas: archivos, índice, cola pendiente (no en_curso) y deja constancia en borradas.jsonl', () => {
    carpetaCorpus = armarCorpus();
    carpetaContent = mkdtempSync(join(tmpdir(), 'la-casta-borrar-content-'));
    const nota = notaDePrueba('abc123');
    escribirNota(carpetaCorpus, nota);
    writeFileSync(join(carpetaCorpus, 'notas', 'abc123.html.gz'), Buffer.from('x'));

    const rutaIndice = join(carpetaCorpus, 'indice.db');
    const indice = abrirIndice({ ruta: rutaIndice });
    indexarNota(indice, nota);
    indice.cerrar();

    // Un trabajo pendiente que la referencia por id, y otro que no tiene nada que ver: solo el primero se saca.
    writeFileSync(join(carpetaCorpus, 'cola', '20260901-a.yaml'), 'id: 20260901-a\ntipo: catalogar\nparams:\n  nota: abc123\n');
    writeFileSync(join(carpetaCorpus, 'cola', '20260901-b.yaml'), 'id: 20260901-b\ntipo: etiquetar\nparams:\n  nota: otra-nota\n');
    // Uno en en_curso/ que también la referencia: no se toca, solo se avisa.
    writeFileSync(join(carpetaCorpus, 'cola', 'en_curso', '20260901-c.yaml'), 'id: 20260901-c\ntipo: catalogar\nparams:\n  nota: abc123\n');

    const r = borrarNota('abc123', { motivo: 'URL armada a mano, nota ajena', carpetaCorpus, carpetaContent });

    expect(r.encontrada).toBe(true);
    expect(r.puedeBorrar).toBe(true);
    expect(r.simulacion).toBe(false);
    expect(r.archivos).toHaveLength(2); // json + html.gz
    expect(existsSync(join(carpetaCorpus, 'notas', 'abc123.json'))).toBe(false);
    expect(existsSync(join(carpetaCorpus, 'notas', 'abc123.html.gz'))).toBe(false);

    expect(r.filasIndice).toBeGreaterThan(0);
    const indiceDespues = abrirIndice({ ruta: rutaIndice, soloLectura: true });
    const fila = indiceDespues.db.prepare('SELECT COUNT(*) AS n FROM notas WHERE id = ?').get('abc123') as { n: number };
    indiceDespues.cerrar();
    expect(fila.n).toBe(0);

    expect(r.trabajosPendientesBorrados.map((t) => t.id)).toEqual(['20260901-a']);
    expect(existsSync(join(carpetaCorpus, 'cola', '20260901-a.yaml'))).toBe(false);
    expect(existsSync(join(carpetaCorpus, 'cola', '20260901-b.yaml'))).toBe(true);

    expect(r.trabajosEnCursoAvisados.map((t) => t.id)).toEqual(['20260901-c']);
    expect(existsSync(join(carpetaCorpus, 'cola', 'en_curso', '20260901-c.yaml'))).toBe(true);

    const lineas = readFileSync(join(carpetaCorpus, 'borradas.jsonl'), 'utf8').trim().split('\n');
    expect(lineas).toHaveLength(1);
    const linea = JSON.parse(lineas[0]);
    expect(linea).toMatchObject({ id: 'abc123', url: nota.url, medio: 'montevideo-portal', motivo: 'URL armada a mano, nota ajena' });
    expect(typeof linea.fecha).toBe('string');
    expect(typeof linea.quien).toBe('string');
  });

  it('se niega si un registro de content/ cita la URL de la nota, y no toca nada', () => {
    carpetaCorpus = armarCorpus();
    carpetaContent = mkdtempSync(join(tmpdir(), 'la-casta-borrar-content-'));
    const nota = notaDePrueba('citada1');
    escribirNota(carpetaCorpus, nota);
    mkdirSync(join(carpetaContent, 'declaraciones', 'alguien'), { recursive: true });
    writeFileSync(join(carpetaContent, 'declaraciones', 'alguien', '2026-08-01-algo.yaml'), `url: ${nota.url}\n`);

    const r = borrarNota('citada1', { motivo: 'prueba', carpetaCorpus, carpetaContent });

    expect(r.puedeBorrar).toBe(false);
    expect(r.citadaPorContent).toEqual(['declaraciones/alguien/2026-08-01-algo.yaml']);
    expect(existsSync(join(carpetaCorpus, 'notas', 'citada1.json'))).toBe(true);
  });

  it('se niega si la nota tiene catalogo.afirmaciones, y no toca nada', () => {
    carpetaCorpus = armarCorpus();
    carpetaContent = mkdtempSync(join(tmpdir(), 'la-casta-borrar-content-'));
    const nota = notaDePrueba('conCatalogo', {
      catalogo: {
        version: 'v1',
        modelo: 'haiku',
        fecha: '2026-08-01T00:00:00Z',
        relevancia: {},
        tiene_afirmaciones: true,
        afirmaciones: [
          { politico: 'x', cita: 'una cita de mas de veinte caracteres', posicion: 0, atribucion: 'directa', tipo: 'dato', tema: 't', dato: null, fecha_dicho: null },
        ],
      },
    });
    escribirNota(carpetaCorpus, nota);

    const r = borrarNota('conCatalogo', { motivo: 'prueba', carpetaCorpus, carpetaContent });

    expect(r.puedeBorrar).toBe(false);
    expect(r.citadaPorCatalogo).toBe(true);
    expect(existsSync(join(carpetaCorpus, 'notas', 'conCatalogo.json'))).toBe(true);
  });

  it('--simulacion no toca nada (ni archivos, ni cola, ni borradas.jsonl) pero cuenta lo que haría', () => {
    carpetaCorpus = armarCorpus();
    carpetaContent = mkdtempSync(join(tmpdir(), 'la-casta-borrar-content-'));
    const nota = notaDePrueba('simulada1');
    escribirNota(carpetaCorpus, nota);
    writeFileSync(join(carpetaCorpus, 'cola', '20260901-a.yaml'), 'id: 20260901-a\ntipo: catalogar\nparams:\n  nota: simulada1\n');

    const r = borrarNota('simulada1', { motivo: 'prueba', simulacion: true, carpetaCorpus, carpetaContent });

    expect(r.simulacion).toBe(true);
    expect(r.puedeBorrar).toBe(true);
    expect(r.archivos).toHaveLength(1);
    expect(r.trabajosPendientesBorrados.map((t) => t.id)).toEqual(['20260901-a']);
    expect(existsSync(join(carpetaCorpus, 'notas', 'simulada1.json'))).toBe(true);
    expect(existsSync(join(carpetaCorpus, 'cola', '20260901-a.yaml'))).toBe(true);
    expect(existsSync(join(carpetaCorpus, 'borradas.jsonl'))).toBe(false);
  });

  it('nota inexistente: encontrada en false, no revienta y no toca nada', () => {
    carpetaCorpus = armarCorpus();
    carpetaContent = mkdtempSync(join(tmpdir(), 'la-casta-borrar-content-'));

    const r = borrarNota('no-existe', { motivo: 'prueba', carpetaCorpus, carpetaContent });

    expect(r.encontrada).toBe(false);
    expect(r.puedeBorrar).toBe(false);
    expect(existsSync(join(carpetaCorpus, 'borradas.jsonl'))).toBe(false);
  });
});
