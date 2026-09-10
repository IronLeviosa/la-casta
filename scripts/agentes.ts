// Reporte de consumo de tokens por agente de esta máquina.
// Uso: pnpm agentes [--json] [--todas-las-sesiones] [--proyecto <slug>] [--corrida <id>]
//      pnpm agentes --modelo-de <tipo> --corrida <id>
//
// Lee los transcriptos de Claude Code: la sesión principal en
// ~/.claude/projects/<slug>/<sesion>.jsonl y los subagentes en el archivo que
// esa sesión registra como output_file. Suma el uso por agente y lo cruza con
// la descripción y el tipo de agente con que se lanzó.
//
// No hay precios acá a propósito: cambian y no queremos números inventados en
// un proyecto que se trata de no inventar números. La columna "relativo" usa
// las proporciones publicadas de la API (salida 5x la entrada, escritura de
// caché 1.25x, lectura de caché 0.1x) para ordenar por lo que realmente pesa.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parsearArgs } from './lib/log.ts';

type Uso = { entrada: number; salida: number; cacheEscrito: number; cacheLeido: number };
type Fila = Uso & {
  agente: string;
  descripcion: string;
  tipo: string;
  modelos: Set<string>;
  /** Uso desglosado por modelo: una sesión puede cambiar de modelo a mitad de camino. */
  porModelo: Map<string, Uso>;
  turnos: number;
  /** Máximo de (entrada + caché leído + caché escrito) visto en un solo mensaje del asistente. */
  contextoPico: number;
  archivo?: string;
  /** Id de corrida con el que se filtró esta fila (solo cuando se pidió `--corrida`). */
  corrida?: string;
};

/** Lanzamiento de un subagente: lo que la sesión principal registró de la llamada a `Agent`. */
export interface Lanzamiento {
  descripcion: string;
  tipo: string;
  archivo?: string;
}

const PESOS = { entrada: 1, salida: 5, cacheEscrito: 1.25, cacheLeido: 0.1 };

function usoVacio(): Uso {
  return { entrada: 0, salida: 0, cacheEscrito: 0, cacheLeido: 0 };
}

function sumar(dest: Uso, u: Record<string, unknown> | undefined): void {
  if (!u) return;
  dest.entrada += Number(u.input_tokens ?? 0);
  dest.salida += Number(u.output_tokens ?? 0);
  dest.cacheEscrito += Number(u.cache_creation_input_tokens ?? 0);
  dest.cacheLeido += Number(u.cache_read_input_tokens ?? 0);
}

function total(u: Uso): number {
  return u.entrada + u.salida + u.cacheEscrito + u.cacheLeido;
}

function relativo(u: Uso): number {
  return (
    u.entrada * PESOS.entrada +
    u.salida * PESOS.salida +
    u.cacheEscrito * PESOS.cacheEscrito +
    u.cacheLeido * PESOS.cacheLeido
  );
}

function* lineasJson(archivo: string): Generator<Record<string, any>> {
  let texto: string;
  try {
    texto = fs.readFileSync(archivo, 'utf8');
  } catch {
    return;
  }
  for (const linea of texto.split('\n')) {
    if (!linea.trim()) continue;
    try {
      yield JSON.parse(linea);
    } catch {
      /* línea incompleta: el transcripto puede estar escribiéndose ahora */
    }
  }
}

/**
 * Recorre un transcripto y devuelve el uso acumulado, los modelos vistos y los turnos.
 *
 * Un mismo mensaje del asistente puede aparecer en más de una línea del transcripto: Claude Code
 * escribe una línea por bloque de contenido (pensamiento, uso de herramienta, texto...), y todas
 * comparten `message.id`. Los campos de entrada y de caché son estables dentro de un mismo mensaje
 * (se calculan una vez, antes de generar nada); el de salida crece con cada bloque hasta el número
 * final en la última línea del grupo. Sumar línea por línea, como si cada una fuera un turno
 * distinto, contaba el mismo mensaje tantas veces como bloques tuviera: turnos y tokens de entrada
 * y caché quedaban inflados por eso. Por eso acá se agrupa por `message.id` y se usa una sola vez
 * el uso de la última línea de cada grupo (la que ya trae los números finales de ese mensaje).
 */
export function usoDeTranscripto(archivo: string): {
  uso: Uso;
  modelos: Set<string>;
  porModelo: Map<string, Uso>;
  turnos: number;
  contextoPico: number;
  /** Modelo de la última línea del asistente con `model`, en el orden del transcripto. */
  ultimoModelo: string | null;
} {
  const modelos = new Set<string>();
  let ultimoModelo: string | null = null;
  const porMensaje = new Map<string, { modelo: string | null; usage: Record<string, unknown> }>();
  let sinId = 0;

  for (const ev of lineasJson(archivo)) {
    const msg = ev?.message;
    if (ev?.type !== 'assistant' || !msg) continue;
    const modelo = typeof msg.model === 'string' && msg.model !== '<synthetic>' ? msg.model : null;
    if (modelo) {
      modelos.add(modelo);
      ultimoModelo = modelo;
    }
    if (!msg.usage) continue;
    // `message.id` identifica el mensaje; una línea sin id (no debería pasar en un transcripto
    // real) se cuenta como su propio turno en vez de perderse.
    const id = typeof msg.id === 'string' ? msg.id : `(sin id ${sinId++})`;
    porMensaje.set(id, { modelo, usage: msg.usage });
  }

  const uso = usoVacio();
  const porModelo = new Map<string, Uso>();
  let contextoPico = 0;
  for (const { modelo, usage } of porMensaje.values()) {
    sumar(uso, usage);
    const clave = modelo ?? '—';
    if (!porModelo.has(clave)) porModelo.set(clave, usoVacio());
    sumar(porModelo.get(clave)!, usage);
    const contexto = Number(usage.input_tokens ?? 0) + Number(usage.cache_read_input_tokens ?? 0) + Number(usage.cache_creation_input_tokens ?? 0);
    if (contexto > contextoPico) contextoPico = contexto;
  }

  return { uso, modelos, porModelo, turnos: porMensaje.size, contextoPico, ultimoModelo };
}

function carpetaProyectos(): string {
  return path.join(os.homedir(), '.claude', 'projects');
}

function slugDelProyecto(): string {
  // El `:` de la unidad en Windows también es separador: sin él, C:\Users\... queda
  // como `C:-Users-...` y no encuentra la carpeta, que se llama `C--Users-...`.
  return process.cwd().replace(/[/\\.: ]/g, '-');
}

function listaDeSesiones(proyectoPedido: string | null): string[] {
  const base = carpetaProyectos();
  const slug = proyectoPedido ?? slugDelProyecto();
  const dir = path.join(base, slug);
  if (!fs.existsSync(dir)) {
    console.error(`No encontré transcriptos en ${dir}.`);
    console.error(`Proyectos disponibles:\n  ${fs.existsSync(base) ? fs.readdirSync(base).join('\n  ') : '(ninguno)'}`);
    process.exit(2);
  }
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.jsonl'))
    .map((f) => path.join(dir, f))
    .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
}

/** Extrae, de la sesión principal, cada llamada a Agent con su descripción y su output_file. */
export function lanzamientos(archivoSesion: string): Map<string, Lanzamiento> {
  const porToolUseId = new Map<string, { descripcion: string; tipo: string }>();
  const porAgente = new Map<string, Lanzamiento>();

  for (const ev of lineasJson(archivoSesion)) {
    const contenido = ev?.message?.content;
    if (!Array.isArray(contenido)) continue;

    for (const bloque of contenido) {
      if (bloque?.type === 'tool_use' && bloque?.name === 'Agent') {
        porToolUseId.set(bloque.id, {
          descripcion: String(bloque.input?.description ?? '(sin descripción)'),
          // Un agente sin tipo es genérico; si además se le fijó modelo, se muestra para que se vea
          // quién eligió ese modelo (el archivo del agente o la llamada).
          tipo: String(bloque.input?.subagent_type ?? (bloque.input?.model ? `general:${bloque.input.model}` : 'general')),
        });
      }
      if (bloque?.type === 'tool_result' && porToolUseId.has(bloque.tool_use_id)) {
        const meta = porToolUseId.get(bloque.tool_use_id)!;
        const texto =
          typeof bloque.content === 'string'
            ? bloque.content
            : Array.isArray(bloque.content)
              ? bloque.content.map((c: any) => c?.text ?? '').join('\n')
              : '';
        const id = texto.match(/agentId:\s*([A-Za-z0-9_-]+)/)?.[1];
        const archivo = texto.match(/output_file:\s*(\S+)/)?.[1];
        if (id) porAgente.set(id, { ...meta, archivo });
      }
    }
  }
  return porAgente;
}

/** Bytes iniciales de un archivo hasta el primer salto de línea, sin cargarlo entero: alcanza para
 * mirar la primera línea de un transcripto que puede pesar varios MB. Si esa línea es más larga que
 * el bloque leído (un prompt con un adjunto grande, poco común), devuelve el bloque igual: mejor
 * buscar en un prefijo largo que leer el archivo completo para esto. */
function primeraLineaCruda(archivo: string): string {
  try {
    const bloque = Buffer.alloc(1048576);
    const fd = fs.openSync(archivo, 'r');
    let leidos: number;
    try {
      leidos = fs.readSync(fd, bloque, 0, bloque.length, 0);
    } finally {
      fs.closeSync(fd);
    }
    const texto = bloque.toString('utf8', 0, leidos);
    const fin = texto.indexOf('\n');
    return fin === -1 ? texto : texto.slice(0, fin);
  } catch {
    return '';
  }
}

/** Texto del prompt inicial de un transcripto: el `message.content` de su primera línea (un string,
 * o bloques con `text`). Si esa línea no parsea como JSON (quedó truncada por el límite de lectura,
 * o el evento tiene otra forma), busca directamente en el texto crudo: sigue sirviendo para
 * encontrar un id de corrida, solo que sin el filtrado extra de quedarse nada más que con el
 * contenido del mensaje. */
function textoInicial(archivo: string): string {
  const cruda = primeraLineaCruda(archivo);
  try {
    const contenido = JSON.parse(cruda)?.message?.content;
    if (typeof contenido === 'string') return contenido;
    if (Array.isArray(contenido)) return contenido.map((b: any) => (typeof b?.text === 'string' ? b.text : '')).join('\n');
  } catch {
    /* línea truncada o con otra forma: se busca en el texto crudo */
  }
  return cruda;
}

/**
 * true si la descripción con la que se lanzó el agente, o el prompt inicial de su propio
 * transcripto, mencionan el id de corrida. El orquestador pone `Corrida: <id>` al principio del
 * prompt de todo subagente que lanza (`.claude/commands/investigar.md`, `.claude/commands/revisar.md`),
 * así que ese texto queda en la primera línea del transcripto del subagente aunque la descripción
 * corta que ve la sesión principal no lo mencione.
 */
export function corridaCoincide(lanzamiento: Lanzamiento, corridaId: string): boolean {
  if (lanzamiento.descripcion.includes(corridaId)) return true;
  if (!lanzamiento.archivo) return false;
  return textoInicial(lanzamiento.archivo).includes(corridaId);
}

/**
 * Busca, en una lista de sesiones (de la más reciente a la más vieja), el último agente de `tipo`
 * cuya descripción o transcripto mencionen `corridaId`, y devuelve el modelo real con el que corrió
 * (`message.model` de su transcripción, el último visto). null si ninguna sesión tiene un agente
 * así. Puro respecto del sistema de archivos elegido: recibe la lista de sesiones ya resuelta, para
 * poder probarlo con fixtures sin tocar `~/.claude/projects`.
 */
export function modeloDeUltimoAgenteEnSesiones(sesiones: string[], tipo: string, corridaId: string): string | null {
  for (const sesion of sesiones) {
    let ultimo: Lanzamiento | undefined;
    for (const lanzamiento of lanzamientos(sesion).values()) {
      if (lanzamiento.tipo === tipo && corridaCoincide(lanzamiento, corridaId)) ultimo = lanzamiento;
    }
    if (ultimo) {
      if (!ultimo.archivo || !fs.existsSync(ultimo.archivo)) return null;
      return usoDeTranscripto(ultimo.archivo).ultimoModelo;
    }
  }
  return null;
}

/** Envoltorio real de `modeloDeUltimoAgenteEnSesiones`: busca en las sesiones del proyecto actual
 * (o `opciones.proyecto`), todas las que haya, no solo la última. Es lo que usan `--modelo-de` y
 * `pnpm promover` cuando al crudo le falta `_investigacion.modelo`. */
export function modeloDeUltimoAgente(tipo: string, corridaId: string, opciones: { proyecto?: string } = {}): string | null {
  const dir = path.join(carpetaProyectos(), opciones.proyecto ?? slugDelProyecto());
  if (!fs.existsSync(dir)) return null;
  const sesiones = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.jsonl'))
    .map((f) => path.join(dir, f))
    .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
  return modeloDeUltimoAgenteEnSesiones(sesiones, tipo, corridaId);
}

const n = (v: number) => v.toLocaleString('es-UY');
const modeloCorto = (m: Set<string>) =>
  [...m]
    .map((x) => x.replace(/^claude-/, '').replace(/-\d{8}$/, ''))
    .join(', ') || '—';

function main(): void {
  const { opciones } = parsearArgs(process.argv.slice(2));
  const comoJson = opciones.json === true;
  const todas = opciones['todas-las-sesiones'] === true;
  const proyectoPedido = typeof opciones.proyecto === 'string' ? opciones.proyecto : null;
  const corridaPedida = typeof opciones.corrida === 'string' ? opciones.corrida : null;
  const modeloDeTipo = typeof opciones['modelo-de'] === 'string' ? opciones['modelo-de'] : null;

  // --modelo-de <tipo> --corrida <id>: un modo aparte, sin tabla. Imprime solo el id del modelo, o
  // nada y sale con código 1 si no hay ningún agente de ese tipo en esa corrida.
  if (modeloDeTipo) {
    if (!corridaPedida) {
      console.error('--modelo-de necesita --corrida <id>.');
      process.exit(1);
    }
    const modelo = modeloDeUltimoAgente(modeloDeTipo, corridaPedida, { proyecto: proyectoPedido ?? undefined });
    if (!modelo) process.exit(1);
    console.log(modelo);
    process.exit(0);
  }

  const sesiones = listaDeSesiones(proyectoPedido);
  const elegidas = todas ? sesiones : [sesiones[0]!];

  const filas: Fila[] = [];

  for (const sesion of elegidas) {
    // La fila de la sesión principal (el chat) no es "un agente" para --corrida: es el orquestador,
    // y su transcripto entero rara vez menciona una sola corrida puntual en su primera línea.
    if (!corridaPedida) {
      const { uso, modelos, porModelo, turnos, contextoPico } = usoDeTranscripto(sesion);
      filas.push({
        agente: path.basename(sesion, '.jsonl').slice(0, 8),
        descripcion: 'sesión principal (chat)',
        tipo: 'principal',
        modelos,
        porModelo,
        turnos,
        contextoPico,
        archivo: sesion,
        ...uso,
      });
    }

    for (const [id, meta] of lanzamientos(sesion)) {
      if (corridaPedida && !corridaCoincide(meta, corridaPedida)) continue;
      if (!meta.archivo || !fs.existsSync(meta.archivo)) {
        filas.push({
          agente: id.slice(0, 8),
          descripcion: meta.descripcion,
          tipo: meta.tipo,
          modelos: new Set(),
          porModelo: new Map(),
          turnos: 0,
          contextoPico: 0,
          corrida: corridaPedida ?? undefined,
          ...usoVacio(),
        });
        continue;
      }
      const r = usoDeTranscripto(meta.archivo);
      filas.push({
        agente: id.slice(0, 8),
        descripcion: meta.descripcion,
        tipo: meta.tipo,
        modelos: r.modelos,
        porModelo: r.porModelo,
        turnos: r.turnos,
        contextoPico: r.contextoPico,
        archivo: meta.archivo,
        corrida: corridaPedida ?? undefined,
        ...r.uso,
      });
    }
  }

  filas.sort((a, b) => relativo(b) - relativo(a));

  if (comoJson) {
    if (corridaPedida) {
      console.log(
        JSON.stringify(
          filas.map((f) => ({
            agente: f.agente,
            tipo: f.tipo,
            modelos: [...f.modelos],
            turnos: f.turnos,
            relativo: Math.round(relativo(f)),
            corrida: f.corrida ?? corridaPedida,
          })),
          null,
          2,
        ),
      );
      process.exit(0);
    }
    console.log(
      JSON.stringify(
        filas.map((f) => ({
          agente: f.agente,
          descripcion: f.descripcion,
          tipo: f.tipo,
          modelos: [...f.modelos],
          turnos: f.turnos,
          contexto_pico: f.contextoPico,
          entrada: f.entrada,
          salida: f.salida,
          cache_escrito: f.cacheEscrito,
          cache_leido: f.cacheLeido,
          total: total(f),
          relativo: Math.round(relativo(f)),
          por_modelo: Object.fromEntries(
            [...f.porModelo.entries()].map(([m, u]) => [m, { entrada: u.entrada, salida: u.salida, cache_escrito: u.cacheEscrito, cache_leido: u.cacheLeido, relativo: Math.round(relativo(u)) }]),
          ),
        })),
        null,
        2,
      ),
    );
    process.exit(0);
  }

  const cols = [
    { t: 'agente', v: (f: Fila) => f.agente },
    { t: 'función', v: (f: Fila) => f.descripcion.slice(0, 34) },
    { t: 'tipo', v: (f: Fila) => f.tipo.slice(0, 12) },
    { t: 'modelo', v: (f: Fila) => modeloCorto(f.modelos).slice(0, 16) },
    { t: 'turnos', v: (f: Fila) => String(f.turnos) },
    { t: 'contexto pico', v: (f: Fila) => n(f.contextoPico) },
    { t: 'salida', v: (f: Fila) => n(f.salida) },
    { t: 'entrada', v: (f: Fila) => n(f.entrada) },
    { t: 'caché esc.', v: (f: Fila) => n(f.cacheEscrito) },
    { t: 'caché leído', v: (f: Fila) => n(f.cacheLeido) },
    { t: 'relativo', v: (f: Fila) => n(Math.round(relativo(f))) },
  ];

  const filasTexto = filas.map((f) => cols.map((c) => c.v(f)));
  const anchos = cols.map((c, i) => Math.max(c.t.length, ...filasTexto.map((r) => r[i].length)));
  const numerica = (i: number) => i >= 4;
  const pad = (s: string, i: number) => (numerica(i) ? s.padStart(anchos[i]) : s.padEnd(anchos[i]));

  const encabezado =
    '\nConsumo de tokens por agente' +
    (todas ? ' (todas las sesiones del proyecto)' : ' (sesión actual)') +
    (corridaPedida ? ` · corrida ${corridaPedida}` : '') +
    '\n';
  console.log(encabezado);
  console.log(cols.map((c, i) => pad(c.t, i)).join('  '));
  console.log(anchos.map((a) => '-'.repeat(a)).join('  '));
  for (const r of filasTexto) console.log(r.map(pad).join('  '));

  const agregado = filas.reduce(
    (acc, f) => {
      acc.entrada += f.entrada;
      acc.salida += f.salida;
      acc.cacheEscrito += f.cacheEscrito;
      acc.cacheLeido += f.cacheLeido;
      return acc;
    },
    usoVacio(),
  );
  console.log(anchos.map((a) => '-'.repeat(a)).join('  '));
  console.log(
    `${filas.length} agente(s) · salida ${n(agregado.salida)} · entrada ${n(agregado.entrada)} · ` +
      `caché escrito ${n(agregado.cacheEscrito)} · caché leído ${n(agregado.cacheLeido)} · total ${n(total(agregado))}`,
  );
  // Resumen por modelo, turno a turno: si el chat cambió de modelo a mitad de sesión, cada
  // parte se cuenta con el modelo que la generó.
  const porModelo = new Map<string, { agentes: Set<string>; relativo: number }>();
  for (const f of filas) {
    for (const [m, u] of f.porModelo) {
      if (total(u) === 0) continue;
      const clave = modeloCorto(new Set([m]));
      const acc = porModelo.get(clave) ?? { agentes: new Set<string>(), relativo: 0 };
      acc.agentes.add(f.agente);
      acc.relativo += relativo(u);
      porModelo.set(clave, acc);
    }
  }
  const relativoTotal = [...porModelo.values()].reduce((a, b) => a + b.relativo, 0) || 1;
  console.log('\nPor modelo (relativo):');
  for (const [m, acc] of [...porModelo.entries()].sort((a, b) => b[1].relativo - a[1].relativo)) {
    console.log(`  ${m.padEnd(18)} ${String(acc.agentes.size).padStart(3)} agente(s)  ${n(Math.round(acc.relativo)).padStart(12)}  ${(100 * acc.relativo / relativoTotal).toFixed(1).padStart(5)} %`);
  }

  // Regla 14 de CLAUDE.md (mantenedor, 2026-09-07): ningún subagente corre en Fable sin permiso
  // explícito dado en la sesión, y Opus es solo para el crítico (la doble pasada del clasificador,
  // Sonnet y Opus para medir kappa, es la única otra excepción). La sesión principal queda afuera de
  // los dos avisos: el modelo del chat lo elige el mantenedor en cada sesión, no una regla por tipo.
  const fableSinElegir = filas.filter((f) => f.tipo !== 'principal' && [...f.modelos].some((m) => /fable/.test(m)));
  if (fableSinElegir.length > 0) {
    console.log(
      `\nAVISO: ${fableSinElegir.length} agente(s) corrieron en Fable sin permiso explícito ` +
        `(${n(Math.round(fableSinElegir.reduce((a, f) => a + relativo(f), 0)))} relativo):`,
    );
    for (const f of fableSinElegir) console.log(`  ${f.agente}  ${f.tipo.padEnd(14)} ${f.descripcion.slice(0, 50)}`);
    console.log('  Regla 14 de CLAUDE.md: ningún subagente corre en Fable sin permiso explícito del mantenedor dado en la sesión.');
  }

  const opusFueraDelCritico = filas.filter(
    (f) => f.tipo !== 'principal' && f.tipo !== 'critico' && f.tipo !== 'clasificador' && [...f.modelos].some((m) => /opus/.test(m)),
  );
  if (opusFueraDelCritico.length > 0) {
    console.log(
      `\nAVISO: ${opusFueraDelCritico.length} agente(s) corrieron en Opus fuera del crítico ` +
        `(${n(Math.round(opusFueraDelCritico.reduce((a, f) => a + relativo(f), 0)))} relativo):`,
    );
    for (const f of opusFueraDelCritico) console.log(`  ${f.agente}  ${f.tipo.padEnd(14)} ${f.descripcion.slice(0, 50)}`);
    console.log('  Regla 14 de CLAUDE.md: Opus solo para el crítico (y el clasificador en su doble pasada).');
  }

  console.log(
    '\nLa columna "relativo" pesa cada tipo de token por su costo proporcional publicado\n' +
      '(salida 5x la entrada, escritura de caché 1.25x, lectura de caché 0.1x) y sirve para\n' +
      'ordenar por lo que realmente consume. No son pesos ni dólares.\n' +
      'Un agente en 0 es uno que murió antes de su primer turno (típicamente por límite de uso).',
  );
}

const esEntrada = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (esEntrada) main();
