/**
 * Arma el brazo barato del experimento de modelos: una copia del repo, con la misma
 * infraestructura y los mismos briefs, pero con todo el trabajo de los agentes borrado
 * y los roles caros bajados a Sonnet.
 *
 * Uso:
 *   pnpm experimento crear [--brazo barato|caro] [--corrida <id>[,<id>...]]
 *                          [--destino ../la-casta-experimento] [--rama <nombre>]
 *   pnpm experimento estado
 *
 * Dos formas de usarlo, según qué brazo corrió primero:
 *
 *   a) `--corrida <id>` (lo habitual): la rama principal ya tiene esa corrida hecha por un
 *      brazo, y el worktree la borra para que el otro brazo la rehaga sobre exactamente el
 *      mismo brief. Todo lo demás queda intacto, así que el sitio del worktree sigue siendo
 *      el sitio, y `pnpm comparar A B --corrida <id>` compara solo esa corrida.
 *
 *   b) sin `--corrida`: borra toda la salida de los agentes y el brazo nuevo rehace el
 *      trabajo desde cero. Es la versión cara del experimento; casi nunca hace falta.
 *
 * Por qué un worktree de git y no un `git checkout`: el experimento necesita los dos
 * árboles en disco al mismo tiempo para poder compararlos (`pnpm comparar A B`). Un
 * worktree es una segunda carpeta de trabajo sobre el mismo historial; se borra con
 * `git worktree remove` y no deja rastro en el repositorio.
 *
 * Qué NO se borra, y por qué: las colecciones de referencia (politicos, temas, medios,
 * eventos, referentes, leyes, paginas) son entradas del brief, no salida de los agentes.
 * La tabla de medios con su `grupo` decide la regla de dos fuentes; si difiere entre los
 * dos brazos, la comparación deja de medir el modelo y pasa a medir la tabla.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { parsearArgs } from './lib/log.ts';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Salida de los agentes: se borra en el brazo nuevo. */
const COLECCIONES_DE_TRABAJO = [
  'declaraciones',
  'promesas',
  'menciones',
  'giros',
  'chequeos',
  'casos',
  'patrimonio',
  'cobertura',
  'intervenciones',
  'correcciones',
];

/** Entradas del brief: se conservan idénticas, o el experimento mide otra cosa. */
const COLECCIONES_DE_REFERENCIA = ['politicos', 'temas', 'medios', 'eventos', 'referentes', 'leyes', 'paginas'];

/**
 * Rol → modelo en cada brazo. El investigador ya es Sonnet en los dos y el etiquetador ya es
 * Haiku: el experimento no toca la etapa de búsqueda, compara las dos etapas de juicio.
 */
const MODELOS: Record<string, Record<string, string>> = {
  barato: { critico: 'sonnet', editor: 'sonnet', detective: 'sonnet' },
  caro: { critico: 'opus', editor: 'fable', detective: 'opus' },
};
const SUBAGENTE_GENERICO: Record<string, string> = { barato: 'sonnet', caro: 'opus' };

function git(args: string[], cwd = RAIZ): string {
  return execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
}

function arbolLimpio(): boolean {
  return git(['status', '--porcelain']).trim() === '';
}

function crear(destino: string, rama: string, brazo: string, corridas: string[]): void {
  if (!MODELOS[brazo]) {
    console.error(`Brazo desconocido "${brazo}". Valores: barato, caro.`);
    process.exit(1);
  }
  if (!arbolLimpio()) {
    console.error('El árbol de trabajo tiene cambios sin commitear.\n');
    console.error('Los dos brazos tienen que compartir exactamente la misma infraestructura: si el');
    console.error('brazo nuevo arranca con cambios que el otro no tuvo, la comparación mide las dos');
    console.error('cosas mezcladas y no se puede saber cuál explica la diferencia.\n');
    console.error('Commiteá lo que haya en main y volvé a correr esto. Cambios pendientes:');
    console.error(git(['status', '--short']));
    process.exit(1);
  }
  if (fs.existsSync(destino)) {
    console.error(`Ya existe ${destino}. Borralo con \`git worktree remove ${destino}\` o pasá otro --destino.`);
    process.exit(1);
  }

  const commit = git(['rev-parse', 'HEAD']);
  console.log(`Creando el brazo ${brazo} desde ${commit.slice(0, 8)}…`);
  git(['worktree', 'add', '-b', rama, destino]);

  // 1. Borrar la salida de los agentes que el brazo nuevo va a rehacer. Con --corrida, solo
  //    los registros de esas corridas; sin --corrida, todo.
  let borrados = 0;
  for (const col of COLECCIONES_DE_TRABAJO) {
    const dir = path.join(destino, 'content', col);
    if (!fs.existsSync(dir)) continue;
    for (const archivo of listarArchivos(dir)) {
      if (corridas.length > 0 && !corridaDe(archivo, corridas)) continue;
      fs.rmSync(archivo);
      borrados += 1;
    }
    limpiarVacias(dir);
  }

  // 2. Las corridas conservan solo el brief: es el prompt exacto que recibió el otro brazo, y
  //    el nuevo tiene que recibir ese mismo texto para que la comparación valga.
  const dirCorridas = path.join(destino, 'data', 'corridas');
  let briefs = 0;
  if (fs.existsSync(dirCorridas)) {
    for (const id of fs.readdirSync(dirCorridas)) {
      const dir = path.join(dirCorridas, id);
      if (!fs.statSync(dir).isDirectory()) continue;
      if (corridas.length > 0 && !corridas.includes(id)) continue;
      for (const f of fs.readdirSync(dir)) {
        if (f === 'brief.md') {
          briefs += 1;
          continue;
        }
        fs.rmSync(path.join(dir, f), { recursive: true, force: true });
      }
    }
  }

  // 3. Las aprobaciones son hashes de registros; las de los registros borrados ya no aplican.
  //    Con --corrida se conservan las demás, así que solo se vacían en el borrado total.
  if (corridas.length === 0) {
    fs.writeFileSync(path.join(destino, 'data', 'aprobaciones.json'), '[]\n');
  }

  // 4. Fijar el modelo de cada rol de juicio.
  const cambiados: string[] = [];
  for (const [agente, modelo] of Object.entries(MODELOS[brazo])) {
    const p = path.join(destino, '.claude', 'agents', `${agente}.md`);
    if (!fs.existsSync(p)) continue;
    const antes = fs.readFileSync(p, 'utf8');
    const previo = antes.match(/^model:\s*(\S+)\s*$/m)?.[1];
    if (previo === modelo) continue;
    fs.writeFileSync(p, antes.replace(/^model:\s*\S+\s*$/m, `model: ${modelo}`));
    cambiados.push(`${agente}: ${previo} → ${modelo}`);
  }
  fs.writeFileSync(
    path.join(destino, '.claude', 'settings.json'),
    JSON.stringify({ env: { CLAUDE_CODE_SUBAGENT_MODEL: SUBAGENTE_GENERICO[brazo] } }, null, 2) + '\n',
  );

  const env = path.join(RAIZ, '.env');
  if (fs.existsSync(env)) fs.copyFileSync(env, path.join(destino, '.env'));

  console.log(`\nBrazo ${brazo} listo en ${destino} (rama ${rama}).`);
  console.log(`  registros borrados para rehacer: ${borrados}`);
  console.log(`  briefs conservados:              ${briefs}`);
  if (corridas.length > 0) console.log(`  corridas a rehacer:              ${corridas.join(', ')}`);
  else console.log(`  colecciones de referencia intactas: ${COLECCIONES_DE_REFERENCIA.join(', ')}`);
  for (const c of cambiados) console.log(`  modelo ${c}`);
  console.log(`  subagentes genéricos: ${SUBAGENTE_GENERICO[brazo]}`);
  console.log('\nPasos siguientes:');
  console.log(`  1. cd ${destino} && pnpm install`);
  console.log(`  2. Abrir una sesión de Claude Code ahí. /investigar y /revisar por cada corrida,`);
  console.log(`     usando el brief.md que ya está en data/corridas/.`);
  console.log(`  3. Comparar: pnpm comparar ${RAIZ} ${destino}${corridas.length ? ` --corrida ${corridas[0]}` : ''}`);
  console.log(`\nPara deshacer todo: git worktree remove ${destino} && git branch -D ${rama}`);
}

/** Todos los archivos de una carpeta, recursivo. */
function listarArchivos(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).flatMap((f) => {
    const p = path.join(dir, f);
    return fs.statSync(p).isDirectory() ? listarArchivos(p) : [p];
  });
}

/** Borra las subcarpetas que quedaron vacías después de sacar registros. */
function limpiarVacias(dir: string): void {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (!fs.statSync(p).isDirectory()) continue;
    limpiarVacias(p);
    if (fs.readdirSync(p).length === 0) fs.rmdirSync(p);
  }
}

/** true si el registro declara una `procedencia.corrida` de la lista. */
function corridaDe(archivo: string, corridas: string[]): boolean {
  const texto = fs.readFileSync(archivo, 'utf8');
  const m = texto.match(/^\s*corrida:\s*(\S+)\s*$/m);
  return m ? corridas.includes(m[1]) : false;
}

function contarArchivos(p: string): number {
  if (!fs.existsSync(p)) return 0;
  if (!fs.statSync(p).isDirectory()) return 1;
  return fs.readdirSync(p).reduce((n, f) => n + contarArchivos(path.join(p, f)), 0);
}

function estado(): void {
  const worktrees = git(['worktree', 'list']);
  console.log(worktrees);
  console.log(`\nárbol limpio: ${arbolLimpio() ? 'sí' : 'no'}`);
}

function main(): void {
  const { posicionales, opciones } = parsearArgs(process.argv.slice(2));
  const orden = posicionales[0];
  if (orden === 'crear') {
    const brazo = typeof opciones.brazo === 'string' ? opciones.brazo : 'barato';
    const corridas = typeof opciones.corrida === 'string' ? opciones.corrida.split(',').map((c) => c.trim()).filter(Boolean) : [];
    const porDefecto = corridas.length > 0 ? `la-casta-${brazo}` : 'la-casta-experimento';
    const destino = path.resolve(typeof opciones.destino === 'string' ? opciones.destino : path.join(RAIZ, '..', porDefecto));
    crear(destino, typeof opciones.rama === 'string' ? opciones.rama : `experimento-${brazo}`, brazo, corridas);
    return;
  }
  if (orden === 'estado') {
    estado();
    return;
  }
  process.stderr.write(
    'Uso: pnpm experimento crear [--brazo barato|caro] [--corrida <id>[,<id>...]]\n' +
      '                            [--destino <ruta>] [--rama <nombre>]\n' +
      '     pnpm experimento estado\n\n' +
      '  --brazo    qué modelos usa el brazo nuevo. barato: crítico, editor y detective en\n' +
      '             Sonnet. caro: crítico y detective en Opus, editor en Fable. Por defecto barato.\n' +
      '  --corrida  ids de corrida que el brazo nuevo va a rehacer. Se borran solo esos registros\n' +
      '             y se conserva su brief.md; el resto del sitio queda intacto. Sin esta opción,\n' +
      '             se borra toda la salida de los agentes.\n',
  );
  process.exit(2);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
