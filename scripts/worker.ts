/**
 * pnpm worker [--intervalo 60] [--una-vez]
 *
 * Bucle: pull --rebase en CORPUS_DIR, tomar el trabajo pendiente mas viejo (moviendolo a
 * cola/en_curso y commiteando+pusheando para que otro worker no lo tome), ejecutar el handler
 * por tipo, escribir el resultado, commitear, pushear, dormir.
 */
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { hostname } from 'node:os';
import { asegurarCorpus, CORPUS_DIR } from './lib/rutas.ts';
import { commitTodo, git, pull, push, ramaActual, tieneRemoto } from './lib/git.ts';
import { log, parsearArgs } from './lib/log.ts';
import { listarTrabajos, moverTrabajo } from './cola.ts';
import type { Trabajo } from './corpus/tipos.ts';

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

/** Toma el pendiente mas viejo. Devuelve null si no hay o si otro worker gano la carrera. */
function tomarTrabajo(): Trabajo | null {
  const pendientes = listarTrabajos('pendiente');
  if (!pendientes.length) return null;
  const t = pendientes[0];
  moverTrabajo(t, 'en_curso', { tomado_por: YO, tomado: new Date().toISOString() });
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
      moverTrabajo(t, 'error', { error: msg.slice(0, 2000), terminado: new Date().toISOString() });
      log.error(`${t.id} (${t.tipo}) fallo: ${msg.split('\n')[0]}`);
    }
  }
  const r = commitYPush(`cola: ${t.id} ${t.estado} (${t.tipo}) en ${YO}`);
  if (r !== 'ok') log.aviso(`no pude pushear el resultado de ${t.id} (${r}); queda commiteado localmente`);
}

export async function correrWorker(opciones: { intervaloSeg?: number; unaVez?: boolean } = {}): Promise<void> {
  const intervalo = Math.max(5, opciones.intervaloSeg ?? 60) * 1000;
  // Todo lo que corre el worker es un agente, no una persona: los hijos (yt-dlp, ffmpeg,
  // Python, `claude -p` y lo que ese lance) heredan process.env, asi que con marcarlo aca
  // alcanza para que `pnpm aprobar` se niegue a correr debajo del worker.
  process.env.LA_CASTA_AGENTE = '1';
  asegurarCorpus();
  instalarCtrlC();
  const detener = () => pedidosDeParada > 0;
  log.info(`worker ${YO} sobre ${CORPUS_DIR} · intervalo ${intervalo / 1000} s · remoto: ${tieneRemoto(CORPUS_DIR) ? 'si' : 'no (solo local)'}`);

  while (!detener()) {
    const p = pull(CORPUS_DIR);
    if (!p.ok) log.aviso(`pull fallo: ${p.mensaje.split('\n')[0]}`);
    let hechos = 0;
    // Vaciamos la cola antes de dormir; reintentamos cuando otro worker nos gana un trabajo.
    for (let intentos = 0; !detener() && intentos < 20; intentos++) {
      const t = tomarTrabajo();
      if (!t) {
        if (listarTrabajos('pendiente').length === 0) break;
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
    if (detener()) break;
    log.debug(`durmiendo ${intervalo / 1000} s`);
    await dormir(intervalo);
  }
  log.info('worker detenido');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { opciones } = parsearArgs(process.argv.slice(2));
  correrWorker({
    intervaloSeg: typeof opciones.intervalo === 'string' ? Number(opciones.intervalo) : undefined,
    unaVez: opciones['una-vez'] === true,
  }).catch((e) => {
    log.error((e as Error).message);
    process.exit(1);
  });
}
