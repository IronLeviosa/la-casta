/**
 * pnpm worker [--intervalo 60] [--una-vez] [--tipo <tipo>] [--ayuda]
 *
 * Bucle: pull --rebase en CORPUS_DIR, tomar el trabajo pendiente de mayor prioridad (moviendolo a
 * cola/en_curso y commiteando+pusheando para que otro worker no lo tome), ejecutar el handler
 * por tipo, escribir el resultado, commitear, pushear, dormir. La prioridad entre tipos (precarga
 * antes que etiquetar, ver `ORDEN_PRIORIDAD` en cola.ts) evita que unos miles de `etiquetar`
 * viejos tapen trabajos mas urgentes y chicos.
 */
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { hostname } from 'node:os';
import { asegurarCorpus, CORPUS_DIR } from './lib/rutas.ts';
import { commitTodo, git, pull, push, ramaActual, tieneRemoto } from './lib/git.ts';
import { log, parsearArgs } from './lib/log.ts';
import { intentosDe, listarTrabajos, moverTrabajo, TIPOS_TRABAJO, tomarTrabajo as tomarTrabajoDeCola } from './cola.ts';
import type { Trabajo, TipoTrabajo } from './corpus/tipos.ts';

/** Errores de red o de un servidor caído: vale la pena reintentar antes de mandarlo a errores/. */
const ERROR_TRANSITORIO = /ECONNRESET|ETIMEDOUT|ENOTFOUND|EAI_AGAIN|fetch failed|HTTP (5\d\d|429)|socket hang up|timeout/i;

/** Cuántas veces reintentamos un trabajo con error transitorio antes de darlo por perdido. */
const MAX_INTENTOS_TRANSITORIOS = 2;

type Handler = (trabajo: Trabajo, contexto: { detener: () => boolean }) => Promise<unknown>;

const YO = hostname();

const handlers: Partial<Record<Trabajo['tipo'], Handler>> = {
  async transcribir(t) {
    const { transcribir } = await import('./transcribir.ts');
    const url = String(t.params.url ?? t.params.archivo ?? '');
    if (!url) throw new Error('falta params.url');
    const tr = await transcribir(url, { modelo: typeof t.params.modelo === 'string' ? t.params.modelo : undefined, forzar: t.params.forzar === true });
    return { id: tr.id, duracion: tr.duracion, segmentos: tr.segmentos.length, backend: tr.backend, modelo: tr.modelo };
  },
  async etiquetar(t) {
    const { ejecutarEtiquetadoConClaude } = await import('./corpus/etiquetar.ts');
    const nota = String(t.params.nota ?? '');
    if (!nota) throw new Error('falta params.nota');
    return ejecutarEtiquetadoConClaude(nota);
  },
  async sync() {
    const { sync } = await import('./corpus/sync.ts');
    return sync();
  },
  async reetiquetar(t, ctx) {
    // Re-etiquetado determinista de todo el corpus tras un cambio de taxonomia (sin Haiku).
    const { leerNotas, abrirIndice, indexarNota } = await import('./corpus/indexar.ts');
    const { etiquetarPorAlias, fusionarEtiquetas, guardarNota, cargarTaxonomia } = await import('./corpus/etiquetar.ts');
    cargarTaxonomia(true);
    const filtro = typeof t.params.politico === 'string' ? t.params.politico : null;
    const indice = abrirIndice();
    let n = 0;
    try {
      for (const nota of leerNotas()) {
        if (ctx.detener()) break;
        if (filtro && !nota.etiquetas.politicos.includes(filtro)) continue;
        const porAlias = etiquetarPorAlias(nota.texto, nota.fecha, undefined, nota.titulo);
        // Conservamos lo que puso Haiku; rehacemos lo que era por alias.
        const conservadas = { ...nota.etiquetas, politicos: [] as string[], partidos: [] as string[], temas: [] as string[], eventos: [] as string[], menciones: [], origen: {} as Record<string, 'alias' | 'haiku' | 'manual'> };
        for (const clave of ['politicos', 'partidos', 'temas', 'eventos'] as const) {
          for (const s of nota.etiquetas[clave]) {
            if (nota.etiquetas.origen[s] && nota.etiquetas.origen[s] !== 'alias') {
              conservadas[clave].push(s);
              conservadas.origen[s] = nota.etiquetas.origen[s];
            }
          }
        }
        nota.etiquetas = fusionarEtiquetas(porAlias, conservadas, 'haiku');
        for (const [s, o] of Object.entries(conservadas.origen)) nota.etiquetas.origen[s] = o;
        guardarNota(nota);
        indexarNota(indice, nota);
        n++;
      }
    } finally {
      indice.cerrar();
    }
    return { notas_reetiquetadas: n };
  },
  async precargar_diarios(t, ctx) {
    const { precargarDiarios } = await import('./corpus/precarga.ts');
    return precargarDiarios(t.params, { detener: ctx.detener });
  },
  async precargar_presidencia(t, ctx) {
    const { precargarPresidencia } = await import('./corpus/precarga.ts');
    return precargarPresidencia(t.params, { detener: ctx.detener });
  },
  async precargar_inventario(t, ctx) {
    const { precargarInventario } = await import('./corpus/precarga.ts');
    return precargarInventario(t.params, { detener: ctx.detener });
  },
  async catalogar(t, ctx) {
    // Cursor propio (docs/plan-catalogo.md, etapa B): a diferencia de los demás handlers, este
    // reescribe `t.params.progreso` en el YAML del trabajo mientras corre (cada 20 notas y al
    // salir), así que `pnpm cola:reintentar` sobre un trabajo caído reanuda desde ahí y no desde
    // el principio, como sí le pasó a `reetiquetar` (murió a las tres horas sin cursor).
    const { ejecutarCatalogar } = await import('./corpus/catalogar.ts');
    return ejecutarCatalogar(t, ctx);
  },
};

let pedidosDeParada = 0;
let durmiendo: { resolver: () => void } | null = null;

function instalarCtrlC(): void {
  const manejar = () => {
    pedidosDeParada++;
    if (pedidosDeParada === 1) {
      log.aviso('Ctrl+C: termino el trabajo actual y salgo (otra vez para forzar)');
      durmiendo?.resolver();
    } else {
      log.error('salida forzada');
      process.exit(130);
    }
  };
  process.on('SIGINT', manejar);
  process.on('SIGTERM', manejar);
}

function dormir(ms: number): Promise<void> {
  return new Promise((resolver) => {
    const t = setTimeout(() => {
      durmiendo = null;
      resolver();
    }, ms);
    durmiendo = {
      resolver: () => {
        clearTimeout(t);
        durmiendo = null;
        resolver();
      },
    };
  });
}

/** commit + push con reintentos: si el push es rechazado, pull --rebase y de nuevo. */
function commitYPush(mensaje: string, intentos = 3): 'ok' | 'conflicto' | 'error' {
  commitTodo(CORPUS_DIR, mensaje);
  if (!tieneRemoto(CORPUS_DIR)) return 'ok';
  for (let i = 0; i < intentos; i++) {
    const p = push(CORPUS_DIR);
    if (p.ok) return 'ok';
    log.aviso(`push rechazado (${i + 1}/${intentos}): ${p.mensaje.split('\n')[0]}`);
    const r = git(['pull', '--rebase', '-q'], CORPUS_DIR);
    if (!r.ok) {
      // Conflicto: otro worker toco el mismo archivo. Abortamos y volvemos al estado remoto.
      git(['rebase', '--abort'], CORPUS_DIR);
      git(['reset', '--hard', `origin/${ramaActual(CORPUS_DIR)}`], CORPUS_DIR);
      return 'conflicto';
    }
  }
  return 'error';
}

/**
 * Toma el pendiente de mayor prioridad (ver `ordenarPorPrioridad` en cola.ts), filtrado por tipo
 * si se pidio `--tipo`. Devuelve null si no hay o si otro worker gano la carrera.
 */
function tomarTrabajo(tipo?: TipoTrabajo): Trabajo | null {
  const t = tomarTrabajoDeCola({ tipo });
  if (!t) return null;
  const r = commitYPush(`cola: ${YO} toma ${t.id} (${t.tipo})`);
  if (r === 'conflicto') {
    log.aviso(`otro worker tomo ${t.id}; reintento con el siguiente`);
    return null;
  }
  if (r === 'error') log.aviso('no pude pushear la toma del trabajo; sigo igual (sin remoto confiable)');
  return t;
}

async function ejecutar(t: Trabajo, detener: () => boolean): Promise<void> {
  const handler = handlers[t.tipo];
  const inicio = Date.now();
  if (!handler) {
    log.aviso(`handler pendiente para tipo "${t.tipo}"; lo dejo en error para que alguien lo mire`);
    moverTrabajo(t, 'error', { error: `handler pendiente para ${t.tipo}`, terminado: new Date().toISOString() });
  } else {
    try {
      const resultado = await handler(t, { detener });
      moverTrabajo(t, 'hecho', { resultado: resultado ?? null, terminado: new Date().toISOString() });
      log.ok(`${t.id} (${t.tipo}) hecho en ${((Date.now() - inicio) / 1000).toFixed(1)} s`);
    } catch (e) {
      const msg = (e as Error).message ?? String(e);
      const intentos = intentosDe(t);
      if (intentos < MAX_INTENTOS_TRANSITORIOS && ERROR_TRANSITORIO.test(msg)) {
        delete t.tomado_por;
        delete t.tomado;
        moverTrabajo(t, 'pendiente', { intentos: intentos + 1 });
        log.aviso(`${t.id} (${t.tipo}) fallo transitorio (intento ${intentos + 1}/${MAX_INTENTOS_TRANSITORIOS + 1}), vuelve a pendiente: ${msg.split('\n')[0]}`);
      } else {
        moverTrabajo(t, 'error', { error: msg.slice(0, 2000), terminado: new Date().toISOString() });
        log.error(`${t.id} (${t.tipo}) fallo: ${msg.split('\n')[0]}`);
      }
    }
  }
  const r = commitYPush(`cola: ${t.id} ${t.estado} (${t.tipo}) en ${YO}`);
  if (r !== 'ok') log.aviso(`no pude pushear el resultado de ${t.id} (${r}); queda commiteado localmente`);
}

export async function correrWorker(opciones: { intervaloSeg?: number; unaVez?: boolean; hastaVaciar?: boolean; tipo?: TipoTrabajo } = {}): Promise<void> {
  const intervalo = Math.max(5, opciones.intervaloSeg ?? 60) * 1000;
  // Todo lo que corre el worker es un agente, no una persona: los hijos (yt-dlp, ffmpeg,
  // Python, `claude -p` y lo que ese lance) heredan process.env, asi que con marcarlo aca
  // alcanza para que `pnpm aprobar` se niegue a correr debajo del worker.
  process.env.LA_CASTA_AGENTE = '1';
  asegurarCorpus();
  instalarCtrlC();
  const detener = () => pedidosDeParada > 0;
  const filtroTipo = opciones.tipo ? ` · solo tipo ${opciones.tipo}` : '';
  log.info(`worker ${YO} sobre ${CORPUS_DIR} · intervalo ${intervalo / 1000} s · remoto: ${tieneRemoto(CORPUS_DIR) ? 'si' : 'no (solo local)'}${filtroTipo}`);

  while (!detener()) {
    const p = pull(CORPUS_DIR);
    if (!p.ok) log.aviso(`pull fallo: ${p.mensaje.split('\n')[0]}`);
    let hechos = 0;
    // Vaciamos la cola antes de dormir; reintentamos cuando otro worker nos gana un trabajo.
    for (let intentos = 0; !detener() && intentos < 20; intentos++) {
      const t = tomarTrabajo(opciones.tipo);
      if (!t) {
        if (listarTrabajos('pendiente').filter((pend) => !opciones.tipo || pend.tipo === opciones.tipo).length === 0) break;
        continue;
      }
      log.info(`tomo ${t.id} (${t.tipo}) ${JSON.stringify(t.params)}`);
      await ejecutar(t, detener);
      hechos++;
      // --una-vez: un solo trabajo y salgo (sirve para probar y para correr desde un cron).
      if (opciones.unaVez) break;
    }
    if (opciones.unaVez) {
      log.info(`una vez: ${hechos} trabajo(s)`);
      return;
    }
    // --hasta-vaciar: cuando no queda ningún pendiente del tipo, salgo en vez de dormir. Para
    // lanzar varios workers sobre una cola finita (piloto 0, 2026-09-16) sin que queden
    // procesos dormidos para siempre que nadie puede matar desde la sesión que los lanzó.
    if (opciones.hastaVaciar && listarTrabajos('pendiente').filter((pend) => !opciones.tipo || pend.tipo === opciones.tipo).length === 0) {
      log.info(`hasta vaciar: ${hechos} trabajo(s) en esta vuelta, cola vacía, salgo`);
      return;
    }
    if (detener()) break;
    log.debug(`durmiendo ${intervalo / 1000} s`);
    await dormir(intervalo);
  }
  log.info('worker detenido');
}

const USO_WORKER = `Uso: pnpm worker [--intervalo <seg>] [--una-vez | --hasta-vaciar] [--tipo <tipo>] [--ayuda]

  --intervalo <seg>  segundos entre vueltas cuando la cola queda vacia (minimo 5; por omision 60)
  --una-vez          toma un solo trabajo y termina (sirve para probar o para correr desde un cron)
  --hasta-vaciar     toma trabajos hasta que no quede ninguno pendiente (del tipo) y termina
  --tipo <tipo>      solo toma trabajos de ese tipo (uno de: ${TIPOS_TRABAJO.join(', ')})
  --ayuda, --help    muestra esta ayuda y termina sin arrancar el bucle

Para cortarlo: Ctrl+C en la misma terminal donde corre (una vez alcanza; termina el trabajo en
curso y sale, dos veces fuerza la salida). Cerrar la ventana de la terminal, o la terminal madre
que lanzo "pnpm worker", NO mata los procesos hijos de Node que pnpm deja corriendo: quedan
huerfanos tomando trabajos. Si pasa, hay que matarlos a mano (Administrador de tareas > node.exe,
o "taskkill /IM node.exe /F" en PowerShell si no hay otro proceso node que te importe).
`;

export interface OpcionesWorkerCLI {
  intervaloSeg?: number;
  unaVez: boolean;
  hastaVaciar?: boolean;
  tipo?: TipoTrabajo;
  ayuda: boolean;
}

export type ResultadoOpcionesWorker = { ok: true; opciones: OpcionesWorkerCLI } | { ok: false; error: string };

const OPCIONES_VALIDAS_WORKER = new Set(['intervalo', 'una-vez', 'hasta-vaciar', 'tipo', 'ayuda', 'help']);

/**
 * Valida los argumentos de `pnpm worker`. Nunca lanza: cualquier opcion desconocida o valor
 * invalido vuelve como `{ ok: false, error }` para que el entry point la reporte y salga sin
 * arrancar el bucle (defecto visto el 2026-09-15: `--ayuda` mal escrito arrancaba el worker igual).
 */
export function parsearOpcionesWorker(argv: string[]): ResultadoOpcionesWorker {
  const { posicionales, opciones } = parsearArgs(argv);
  if (posicionales.length) return { ok: false, error: `argumento(s) no reconocido(s): ${posicionales.join(' ')}` };
  for (const clave of Object.keys(opciones)) {
    if (!OPCIONES_VALIDAS_WORKER.has(clave)) return { ok: false, error: `opcion desconocida: --${clave}` };
  }
  if (opciones.ayuda || opciones.help) return { ok: true, opciones: { unaVez: false, ayuda: true } };

  let intervaloSeg: number | undefined;
  if (opciones.intervalo !== undefined) {
    if (typeof opciones.intervalo !== 'string' || !/^\d+(\.\d+)?$/.test(opciones.intervalo)) {
      return { ok: false, error: `--intervalo necesita un numero de segundos, recibido: ${String(opciones.intervalo)}` };
    }
    intervaloSeg = Number(opciones.intervalo);
  }

  let tipo: TipoTrabajo | undefined;
  if (opciones.tipo !== undefined) {
    if (typeof opciones.tipo !== 'string' || !TIPOS_TRABAJO.includes(opciones.tipo as TipoTrabajo)) {
      return { ok: false, error: `--tipo desconocido: ${String(opciones.tipo)} (validos: ${TIPOS_TRABAJO.join(', ')})` };
    }
    tipo = opciones.tipo as TipoTrabajo;
  }

  return { ok: true, opciones: { intervaloSeg, unaVez: opciones['una-vez'] === true, hastaVaciar: opciones['hasta-vaciar'] === true, tipo, ayuda: false } };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const r = parsearOpcionesWorker(process.argv.slice(2));
  if (!r.ok) {
    process.stderr.write(USO_WORKER + '\n');
    process.stderr.write(`Error: ${r.error}\n`);
    process.exit(2);
  }
  if (r.opciones.ayuda) {
    process.stdout.write(USO_WORKER);
    process.exit(0);
  }
  correrWorker({
    intervaloSeg: r.opciones.intervaloSeg,
    unaVez: r.opciones.unaVez,
    hastaVaciar: r.opciones.hastaVaciar,
    tipo: r.opciones.tipo,
  }).catch((e) => {
    log.error((e as Error).message);
    process.exit(1);
  });
}
