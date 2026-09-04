// Reporte de consumo de tokens por agente de esta máquina.
// Uso: pnpm agentes [--json] [--todas-las-sesiones] [--proyecto <slug>]
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

type Uso = { entrada: number; salida: number; cacheEscrito: number; cacheLeido: number };
type Fila = Uso & {
  agente: string;
  descripcion: string;
  tipo: string;
  modelos: Set<string>;
  turnos: number;
  archivo?: string;
};

const PESOS = { entrada: 1, salida: 5, cacheEscrito: 1.25, cacheLeido: 0.1 };

const args = process.argv.slice(2);
const comoJson = args.includes('--json');
const todas = args.includes('--todas-las-sesiones');
const idxProyecto = args.indexOf('--proyecto');
const proyectoPedido = idxProyecto >= 0 ? args[idxProyecto + 1] : null;

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

/** Recorre un transcripto y devuelve el uso acumulado y los modelos vistos. */
function usoDeTranscripto(archivo: string): { uso: Uso; modelos: Set<string>; turnos: number } {
  const uso = usoVacio();
  const modelos = new Set<string>();
  let turnos = 0;
  for (const ev of lineasJson(archivo)) {
    const msg = ev?.message;
    if (ev?.type !== 'assistant' || !msg) continue;
    if (msg.usage) {
      sumar(uso, msg.usage);
      turnos += 1;
    }
    if (typeof msg.model === 'string' && msg.model !== '<synthetic>') modelos.add(msg.model);
  }
  return { uso, modelos, turnos };
}

function carpetaProyectos(): string {
  return path.join(os.homedir(), '.claude', 'projects');
}

function slugDelProyecto(): string {
  return process.cwd().replace(/[/\\. ]/g, '-');
}

function sesiones(): string[] {
  const base = carpetaProyectos();
  const slug = proyectoPedido ?? slugDelProyecto();
  const dir = path.join(base, slug);
  if (!fs.existsSync(dir)) {
    console.error(`No encontré transcriptos en ${dir}.`);
    console.error(`Proyectos disponibles:\n  ${fs.existsSync(base) ? fs.readdirSync(base).join('\n  ') : '(ninguno)'}`);
    process.exit(2);
  }
  const jsonl = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.jsonl'))
    .map((f) => path.join(dir, f))
    .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
  if (jsonl.length === 0) {
    console.error(`No hay archivos .jsonl en ${dir}.`);
    process.exit(2);
  }
  return todas ? jsonl : [jsonl[0]];
}

/** Extrae, de la sesión principal, cada llamada a Agent con su descripción y su output_file. */
function lanzamientos(archivoSesion: string): Map<string, { descripcion: string; tipo: string; archivo?: string }> {
  const porToolUseId = new Map<string, { descripcion: string; tipo: string }>();
  const porAgente = new Map<string, { descripcion: string; tipo: string; archivo?: string }>();

  for (const ev of lineasJson(archivoSesion)) {
    const contenido = ev?.message?.content;
    if (!Array.isArray(contenido)) continue;

    for (const bloque of contenido) {
      if (bloque?.type === 'tool_use' && bloque?.name === 'Agent') {
        porToolUseId.set(bloque.id, {
          descripcion: String(bloque.input?.description ?? '(sin descripción)'),
          tipo: String(bloque.input?.subagent_type ?? bloque.input?.model ?? 'general'),
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

const filas: Fila[] = [];

for (const sesion of sesiones()) {
  const { uso, modelos, turnos } = usoDeTranscripto(sesion);
  filas.push({
    agente: path.basename(sesion, '.jsonl').slice(0, 8),
    descripcion: 'sesión principal (chat)',
    tipo: 'principal',
    modelos,
    turnos,
    archivo: sesion,
    ...uso,
  });

  for (const [id, meta] of lanzamientos(sesion)) {
    if (!meta.archivo || !fs.existsSync(meta.archivo)) {
      filas.push({ agente: id.slice(0, 8), descripcion: meta.descripcion, tipo: meta.tipo, modelos: new Set(), turnos: 0, ...usoVacio() });
      continue;
    }
    const r = usoDeTranscripto(meta.archivo);
    filas.push({
      agente: id.slice(0, 8),
      descripcion: meta.descripcion,
      tipo: meta.tipo,
      modelos: r.modelos,
      turnos: r.turnos,
      archivo: meta.archivo,
      ...r.uso,
    });
  }
}

filas.sort((a, b) => relativo(b) - relativo(a));

if (comoJson) {
  console.log(
    JSON.stringify(
      filas.map((f) => ({
        agente: f.agente,
        descripcion: f.descripcion,
        tipo: f.tipo,
        modelos: [...f.modelos],
        turnos: f.turnos,
        entrada: f.entrada,
        salida: f.salida,
        cache_escrito: f.cacheEscrito,
        cache_leido: f.cacheLeido,
        total: total(f),
        relativo: Math.round(relativo(f)),
      })),
      null,
      2,
    ),
  );
  process.exit(0);
}

const n = (v: number) => v.toLocaleString('es-UY');
const modeloCorto = (m: Set<string>) =>
  [...m]
    .map((x) => x.replace(/^claude-/, '').replace(/-\d{8}$/, ''))
    .join(', ') || '—';

const cols = [
  { t: 'agente', v: (f: Fila) => f.agente },
  { t: 'función', v: (f: Fila) => f.descripcion.slice(0, 34) },
  { t: 'tipo', v: (f: Fila) => f.tipo.slice(0, 12) },
  { t: 'modelo', v: (f: Fila) => modeloCorto(f.modelos).slice(0, 16) },
  { t: 'turnos', v: (f: Fila) => String(f.turnos) },
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

console.log('\nConsumo de tokens por agente' + (todas ? ' (todas las sesiones del proyecto)' : ' (sesión actual)') + '\n');
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
console.log(
  '\nLa columna "relativo" pesa cada tipo de token por su costo proporcional publicado\n' +
    '(salida 5x la entrada, escritura de caché 1.25x, lectura de caché 0.1x) y sirve para\n' +
    'ordenar por lo que realmente consume. No son pesos ni dólares.\n' +
    'Un agente en 0 es uno que murió antes de su primer turno (típicamente por límite de uso).',
);
