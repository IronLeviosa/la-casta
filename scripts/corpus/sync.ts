/**
 * pnpm corpus:sync   -> en CORPUS_DIR: git add -A, commit "corpus: <n> notas nuevas, <m> actualizadas", pull --rebase, push.
 * Sin remoto: solo commitea y avisa.
 */
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { asegurarCorpus, CORPUS_DIR } from '../lib/rutas.ts';
import { cambios, commitTodo, pull, push, tieneRemoto } from '../lib/git.ts';
import { log } from '../lib/log.ts';

export interface ResultadoSync {
  nuevas: number;
  actualizadas: number;
  otros: number;
  commit: boolean;
  pull: string;
  push: string;
  remoto: boolean;
}

export function mensajeCommit(nuevas: number, actualizadas: number, otros: number): string {
  const partes = [`corpus: ${nuevas} notas nuevas, ${actualizadas} actualizadas`];
  if (otros) partes.push(`${otros} otros archivos`);
  return partes.join(', ');
}

export function sync(opciones: { mensaje?: string } = {}): ResultadoSync {
  asegurarCorpus();
  const lista = cambios(CORPUS_DIR);
  const esNota = (r: string) => /^notas\/[0-9a-f]{40}\.json$/.test(r.replace(/\\/g, '/'));
  const nuevas = lista.filter((c) => esNota(c.ruta) && (c.estado === '??' || c.estado === 'A')).length;
  const actualizadas = lista.filter((c) => esNota(c.ruta) && c.estado !== '??' && c.estado !== 'A').length;
  const otros = lista.length - nuevas - actualizadas;

  let commit = false;
  if (lista.length) {
    commit = commitTodo(CORPUS_DIR, opciones.mensaje ?? mensajeCommit(nuevas, actualizadas, otros));
    if (commit) log.ok(`commit: ${mensajeCommit(nuevas, actualizadas, otros)}`);
    else log.aviso('git commit fallo (¿user.name/user.email sin configurar?)');
  } else {
    log.info('nada nuevo que commitear');
  }

  const remoto = tieneRemoto(CORPUS_DIR);
  if (!remoto) {
    log.aviso(`el corpus en ${CORPUS_DIR} no tiene remoto todavia: agregalo con \`git remote add origin <url privada>\` y volve a correr sync`);
    return { nuevas, actualizadas, otros, commit, pull: 'sin remoto', push: 'sin remoto', remoto };
  }
  const p = pull(CORPUS_DIR);
  if (!p.ok) log.error(`pull --rebase fallo: ${p.mensaje}`);
  else log.info('pull --rebase ok');
  const q = p.ok ? push(CORPUS_DIR) : { ok: false, mensaje: 'no se hizo push porque fallo el pull' };
  if (q.ok) log.ok('push ok');
  else log.error(`push fallo: ${q.mensaje}`);
  return { nuevas, actualizadas, otros, commit, pull: p.mensaje, push: q.mensaje, remoto };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const r = sync();
  process.exit(r.remoto && (r.pull !== 'ok' || r.push !== 'ok') ? 1 : 0);
}
