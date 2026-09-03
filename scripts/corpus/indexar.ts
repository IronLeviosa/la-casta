/**
 * Indice SQLite (node:sqlite, sin dependencias) del corpus: ${CORPUS_DIR}/indice.db
 *
 *   pnpm corpus:indexar          reconstruye desde notas/*.json
 *
 * Tablas: notas, notas_fts (FTS5 sobre titulo+texto; si no hay FTS5, notas_texto con LIKE),
 *         menciones(nota, politico, posicion), nota_tema, nota_evento, nota_partido.
 */
import { DatabaseSync } from 'node:sqlite';
import { existsSync, readdirSync, readFileSync, unlinkSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { asegurarCorpus, RUTAS_CORPUS } from '../lib/rutas.ts';
import { log } from '../lib/log.ts';
import type { Nota } from './tipos.ts';

let fts5Cache: boolean | null = null;

/** ¿El SQLite que trae Node soporta FTS5? */
export function soportaFts5(): boolean {
  if (fts5Cache !== null) return fts5Cache;
  try {
    const db = new DatabaseSync(':memory:');
    db.exec("CREATE VIRTUAL TABLE t USING fts5(x, tokenize='unicode61 remove_diacritics 2')");
    db.close();
    fts5Cache = true;
  } catch {
    fts5Cache = false;
  }
  return fts5Cache;
}

const ESQUEMA_BASE = `
CREATE TABLE IF NOT EXISTS notas (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  url_canonica TEXT NOT NULL,
  medio TEXT,
  fecha TEXT,
  titulo TEXT,
  autor TEXT,
  tipo TEXT,
  retrieved_at TEXT,
  text_sha256 TEXT,
  resumen TEXT,
  largo INTEGER
);
CREATE INDEX IF NOT EXISTS notas_fecha ON notas(fecha);
CREATE INDEX IF NOT EXISTS notas_medio ON notas(medio);
CREATE UNIQUE INDEX IF NOT EXISTS notas_url_canonica ON notas(url_canonica);
CREATE TABLE IF NOT EXISTS menciones (nota TEXT NOT NULL, politico TEXT NOT NULL, posicion INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS menciones_politico ON menciones(politico, nota);
CREATE TABLE IF NOT EXISTS nota_tema (nota TEXT NOT NULL, tema TEXT NOT NULL, origen TEXT);
CREATE INDEX IF NOT EXISTS nota_tema_tema ON nota_tema(tema, nota);
CREATE TABLE IF NOT EXISTS nota_evento (nota TEXT NOT NULL, evento TEXT NOT NULL, origen TEXT);
CREATE INDEX IF NOT EXISTS nota_evento_evento ON nota_evento(evento, nota);
CREATE TABLE IF NOT EXISTS nota_partido (nota TEXT NOT NULL, partido TEXT NOT NULL, origen TEXT);
CREATE INDEX IF NOT EXISTS nota_partido_partido ON nota_partido(partido, nota);
`;

const ESQUEMA_FTS = `
CREATE VIRTUAL TABLE IF NOT EXISTS notas_fts USING fts5(
  id UNINDEXED, titulo, texto,
  tokenize='unicode61 remove_diacritics 2'
);
`;

const ESQUEMA_SIN_FTS = `
CREATE TABLE IF NOT EXISTS notas_texto (id TEXT PRIMARY KEY, titulo TEXT, texto TEXT);
`;

export interface Indice {
  db: DatabaseSync;
  fts: boolean;
  cerrar(): void;
}

export function abrirIndice(opciones: { ruta?: string; soloLectura?: boolean } = {}): Indice {
  asegurarCorpus();
  const ruta = opciones.ruta ?? RUTAS_CORPUS.indice;
  const db = new DatabaseSync(ruta, { readOnly: opciones.soloLectura && existsSync(ruta) ? true : false });
  const fts = soportaFts5();
  if (!opciones.soloLectura) {
    db.exec('PRAGMA journal_mode = WAL');
    db.exec(ESQUEMA_BASE);
    db.exec(fts ? ESQUEMA_FTS : ESQUEMA_SIN_FTS);
  }
  return { db, fts, cerrar: () => db.close() };
}

/** Inserta o reemplaza una nota (y sus etiquetas) en el indice. */
export function indexarNota(indice: Indice, nota: Nota): void {
  const { db, fts } = indice;
  db.exec('BEGIN');
  try {
    for (const tabla of ['menciones', 'nota_tema', 'nota_evento', 'nota_partido']) db.prepare(`DELETE FROM ${tabla} WHERE nota = ?`).run(nota.id);
    db.prepare('DELETE FROM notas WHERE id = ?').run(nota.id);
    db.prepare(fts ? 'DELETE FROM notas_fts WHERE id = ?' : 'DELETE FROM notas_texto WHERE id = ?').run(nota.id);

    db.prepare(
      `INSERT INTO notas (id, url, url_canonica, medio, fecha, titulo, autor, tipo, retrieved_at, text_sha256, resumen, largo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(nota.id, nota.url, nota.url_canonica, nota.medio ?? null, nota.fecha ?? null, nota.titulo ?? null, nota.autor ?? null, nota.tipo, nota.retrieved_at, nota.text_sha256, nota.resumen ?? null, nota.texto.length);
    db.prepare(fts ? 'INSERT INTO notas_fts (id, titulo, texto) VALUES (?, ?, ?)' : 'INSERT INTO notas_texto (id, titulo, texto) VALUES (?, ?, ?)').run(nota.id, nota.titulo ?? '', nota.texto);

    const e = nota.etiquetas;
    const insMencion = db.prepare('INSERT INTO menciones (nota, politico, posicion) VALUES (?, ?, ?)');
    const vistas = new Set<string>();
    for (const m of e.menciones ?? []) {
      insMencion.run(nota.id, m.politico, m.posicion);
      vistas.add(m.politico);
    }
    for (const p of e.politicos ?? []) if (!vistas.has(p)) insMencion.run(nota.id, p, -1);
    const insTema = db.prepare('INSERT INTO nota_tema (nota, tema, origen) VALUES (?, ?, ?)');
    for (const t of e.temas ?? []) insTema.run(nota.id, t, e.origen?.[t] ?? null);
    const insEvento = db.prepare('INSERT INTO nota_evento (nota, evento, origen) VALUES (?, ?, ?)');
    for (const ev of e.eventos ?? []) insEvento.run(nota.id, ev, e.origen?.[ev] ?? null);
    const insPartido = db.prepare('INSERT INTO nota_partido (nota, partido, origen) VALUES (?, ?, ?)');
    for (const p of e.partidos ?? []) insPartido.run(nota.id, p, e.origen?.[p] ?? null);
    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
}

export function quitarNota(indice: Indice, id: string): void {
  const { db, fts } = indice;
  for (const tabla of ['menciones', 'nota_tema', 'nota_evento', 'nota_partido']) db.prepare(`DELETE FROM ${tabla} WHERE nota = ?`).run(id);
  db.prepare('DELETE FROM notas WHERE id = ?').run(id);
  db.prepare(fts ? 'DELETE FROM notas_fts WHERE id = ?' : 'DELETE FROM notas_texto WHERE id = ?').run(id);
}

/** Lee todas las notas del corpus (notas/*.json). */
export function* leerNotas(): Generator<Nota> {
  if (!existsSync(RUTAS_CORPUS.notas)) return;
  for (const f of readdirSync(RUTAS_CORPUS.notas).sort()) {
    if (!f.endsWith('.json')) continue;
    try {
      yield JSON.parse(readFileSync(join(RUTAS_CORPUS.notas, f), 'utf8')) as Nota;
    } catch (e) {
      log.aviso(`nota ilegible ${f}: ${(e as Error).message}`);
    }
  }
}

/** Borra y reconstruye el indice completo desde los JSON. Devuelve cuantas notas indexo. */
export function reconstruir(): { notas: number; fts: boolean } {
  asegurarCorpus();
  for (const sufijo of ['', '-wal', '-shm', '-journal']) {
    const r = RUTAS_CORPUS.indice + sufijo;
    // En Windows, borrar un archivo que otro proceso tiene abierto tira EBUSY/EPERM:
    // no es fatal, el esquema usa INSERT OR REPLACE por nota igual.
    try {
      if (existsSync(r)) unlinkSync(r);
    } catch (e) {
      log.aviso(`no pude borrar ${r} (${(e as Error).message}); reconstruyo encima`);
    }
  }
  const indice = abrirIndice();
  let n = 0;
  try {
    for (const nota of leerNotas()) {
      indexarNota(indice, nota);
      n++;
    }
  } finally {
    indice.cerrar();
  }
  return { notas: n, fts: indice.fts };
}

function main(): void {
  const t0 = Date.now();
  const r = reconstruir();
  if (!r.fts) log.aviso('este Node no trae SQLite con FTS5: el indice usa LIKE (mas lento, sin ranking BM25)');
  log.ok(`indice reconstruido: ${r.notas} notas en ${RUTAS_CORPUS.indice} (${((Date.now() - t0) / 1000).toFixed(1)} s, ${r.fts ? 'FTS5' : 'LIKE'})`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
