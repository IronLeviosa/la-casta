/**
 * pnpm corpus:buscar "<consulta>" [--politico x] [--tema y] [--evento z] [--partido p]
 *                    [--desde YYYY-MM-DD] [--hasta YYYY-MM-DD] [--medio m] [--limite 20] [--json] [--crudo]
 *
 * Ranking BM25 de FTS5. Con --crudo la consulta se pasa tal cual a MATCH (operadores AND/OR/NOT, "frases", prefijo*).
 */
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { abrirIndice } from './indexar.ts';
import { log, parsearArgs } from '../lib/log.ts';
import { normalizar, recortar } from '../lib/texto.ts';

export interface FiltrosBusqueda {
  politico?: string;
  tema?: string;
  evento?: string;
  partido?: string;
  desde?: string;
  hasta?: string;
  medio?: string;
  limite?: number;
  /** No envolver terminos: usar sintaxis FTS5 directa. */
  crudo?: boolean;
}

export interface ResultadoBusqueda {
  id: string;
  url: string;
  fecha: string | null;
  medio: string | null;
  titulo: string | null;
  tipo: string | null;
  snippet: string;
  rank: number;
}

/** Envuelve cada termino entre comillas para que FTS5 no interprete puntuacion; los temas con "/" tambien. */
function prepararConsulta(consulta: string): string {
  const terminos = consulta
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);
  return terminos.map((t) => `"${t.replace(/"/g, '""')}"`).join(' ');
}

export function buscar(consulta: string, filtros: FiltrosBusqueda = {}): ResultadoBusqueda[] {
  const indice = abrirIndice({ soloLectura: true });
  try {
    const { db, fts } = indice;
    const limite = Math.max(1, Math.min(500, filtros.limite ?? 20));
    const condiciones: string[] = [];
    const params: (string | number)[] = [];
    const q = consulta.trim();

    if (filtros.politico) {
      condiciones.push('EXISTS (SELECT 1 FROM menciones m WHERE m.nota = n.id AND m.politico = ?)');
      params.push(filtros.politico);
    }
    if (filtros.tema) {
      // Un tema padre ("economia") incluye a sus hijos ("economia/impuestos").
      condiciones.push('EXISTS (SELECT 1 FROM nota_tema t WHERE t.nota = n.id AND (t.tema = ? OR t.tema LIKE ?))');
      params.push(filtros.tema, `${filtros.tema}/%`);
    }
    if (filtros.evento) {
      condiciones.push('EXISTS (SELECT 1 FROM nota_evento e WHERE e.nota = n.id AND e.evento = ?)');
      params.push(filtros.evento);
    }
    if (filtros.partido) {
      condiciones.push('EXISTS (SELECT 1 FROM nota_partido p WHERE p.nota = n.id AND p.partido = ?)');
      params.push(filtros.partido);
    }
    if (filtros.desde) {
      condiciones.push('n.fecha >= ?');
      params.push(filtros.desde);
    }
    if (filtros.hasta) {
      condiciones.push('n.fecha <= ?');
      params.push(filtros.hasta + (filtros.hasta.length === 10 ? '' : ''));
    }
    if (filtros.medio) {
      condiciones.push('n.medio = ?');
      params.push(filtros.medio);
    }

    let sql: string;
    let paramsFinal: (string | number)[];
    if (q && fts) {
      const match = filtros.crudo ? q : prepararConsulta(q);
      sql = `SELECT n.id, n.url, n.fecha, n.medio, n.titulo, n.tipo, bm25(notas_fts, 0, 2.0, 1.0) AS rank,
                    snippet(notas_fts, 2, '[', ']', '…', 18) AS snippet
             FROM notas_fts JOIN notas n ON n.id = notas_fts.id
             WHERE notas_fts MATCH ?${condiciones.length ? ' AND ' + condiciones.join(' AND ') : ''}
             ORDER BY rank LIMIT ?`;
      paramsFinal = [match, ...params, limite];
    } else if (q) {
      // Sin FTS5: LIKE sobre el texto normalizado (sin ranking).
      const terminos = normalizar(q).split(/\s+/).filter(Boolean);
      const likes = terminos.map(() => '(lower(t.texto) LIKE ? OR lower(t.titulo) LIKE ?)');
      const likeParams = terminos.flatMap((t) => [`%${t}%`, `%${t}%`]);
      sql = `SELECT n.id, n.url, n.fecha, n.medio, n.titulo, n.tipo, 0 AS rank, substr(t.texto, 1, 240) AS snippet
             FROM notas_texto t JOIN notas n ON n.id = t.id
             WHERE ${likes.join(' AND ')}${condiciones.length ? ' AND ' + condiciones.join(' AND ') : ''}
             ORDER BY n.fecha DESC LIMIT ?`;
      paramsFinal = [...likeParams, ...params, limite];
    } else {
      sql = `SELECT n.id, n.url, n.fecha, n.medio, n.titulo, n.tipo, 0 AS rank, COALESCE(n.resumen, '') AS snippet
             FROM notas n${condiciones.length ? ' WHERE ' + condiciones.join(' AND ') : ''}
             ORDER BY n.fecha DESC LIMIT ?`;
      paramsFinal = [...params, limite];
    }
    const filas = db.prepare(sql).all(...paramsFinal) as unknown as ResultadoBusqueda[];
    return filas.map((f) => ({ ...f, snippet: recortar(String(f.snippet ?? ''), 240) }));
  } finally {
    indice.cerrar();
  }
}

function main(): void {
  const { posicionales, opciones } = parsearArgs(process.argv.slice(2));
  const consulta = posicionales.join(' ');
  const str = (k: string) => (typeof opciones[k] === 'string' ? (opciones[k] as string) : undefined);
  const filtros: FiltrosBusqueda = {
    politico: str('politico'),
    tema: str('tema'),
    evento: str('evento'),
    partido: str('partido'),
    desde: str('desde'),
    hasta: str('hasta'),
    medio: str('medio'),
    limite: str('limite') ? Number(str('limite')) : undefined,
    crudo: opciones.crudo === true,
  };
  if (!consulta && !Object.values(filtros).some((v) => v !== undefined && v !== false)) {
    process.stderr.write('Uso: pnpm corpus:buscar "<consulta>" [--politico x] [--tema y] [--evento z] [--desde YYYY-MM-DD] [--hasta YYYY-MM-DD] [--medio m] [--limite 20] [--json]\n');
    process.exit(2);
  }
  let resultados: ResultadoBusqueda[];
  try {
    resultados = buscar(consulta, filtros);
  } catch (e) {
    log.error(`busqueda fallo: ${(e as Error).message}`);
    process.exit(1);
  }
  if (opciones.json) {
    process.stdout.write(JSON.stringify(resultados, null, 1) + '\n');
    return;
  }
  if (!resultados.length) {
    process.stdout.write('sin resultados en el corpus\n');
    return;
  }
  for (const r of resultados) {
    process.stdout.write(`${r.id.slice(0, 10)}  ${r.fecha ?? '????-??-??'}  ${(r.medio ?? '?').padEnd(18)}  ${r.titulo ?? r.url}\n`);
    if (r.snippet) process.stdout.write(`            ${r.snippet}\n`);
  }
  process.stderr.write(`${resultados.length} resultado(s)\n`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
