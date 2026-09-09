/**
 * pnpm corpus:estadisticas
 *
 * Cuenta qué material se procesó: cuántas fuentes se leyeron, de qué tipo (nota, PDF, planilla,
 * video, audio), de qué medios, cuánto texto (y una estimación de tokens), y a qué políticos,
 * partidos, temas, eventos y empresas públicas se asocian. Escribe `data/corpus-estadisticas.json`,
 * que es público y alimenta la página «Datos procesados» del sitio: el corpus en sí es privado
 * (texto completo de notas con derechos), pero cuánto y qué se leyó, no.
 *
 * Lo que no se puede contar de forma honesta se dice: los tokens son una estimación (unos cuatro
 * caracteres por token) del texto que entró al corpus, no lo que consumieron los agentes, que el
 * sitio no registra.
 */
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import YAML from 'yaml';
import { CORPUS_DIR, RAIZ } from '../lib/rutas.ts';

const corpus = CORPUS_DIR;
const rootDir = RAIZ;
const db = new DatabaseSync(path.join(corpus, 'indice.db'), { readOnly: true });
const hoy = new Date().toISOString().slice(0, 10);

const total = db.prepare('select count(*) as n, coalesce(sum(largo),0) as chars from notas').get() as { n: number; chars: number };
const porTipo = db.prepare('select coalesce(tipo, ?) as tipo, count(*) as n, coalesce(sum(largo),0) as chars from notas group by tipo order by n desc').all('sin tipo') as { tipo: string; n: number; chars: number }[];
/* Publicador a efectos de la cuenta: «parlamento» junta el sitio del Parlamento (fichas de legisladores,
   unos pocos KB cada una) con los diarios de sesiones de la Hemeroteca (100 a 650 mil caracteres cada
   uno). Un lector preguntó por qué esa barra era cien veces la siguiente: se separan por host, con un
   id propio para la Hemeroteca, sin tocar el medio del corpus ni el de los registros. */
function medioEstadistico(medio: string | null, url: string): string {
  const m = medio ?? 'sin medio';
  if (m !== 'parlamento') return m;
  try {
    const host = new URL(url).hostname;
    if (host === 'biblioteca.parlamento.gub.uy') return 'hemeroteca-parlamento';
    if (host === 'infolegislativa.parlamento.gub.uy') return 'infolegislativa-parlamento';
  } catch {
    /* url rara */
  }
  return m;
}
const porMedioMapa = new Map<string, { n: number; chars: number }>();
for (const r of db.prepare('select medio, url, coalesce(largo,0) as largo from notas').all() as { medio: string | null; url: string; largo: number }[]) {
  const k = medioEstadistico(r.medio, r.url);
  const acc = porMedioMapa.get(k) ?? { n: 0, chars: 0 };
  acc.n++;
  acc.chars += r.largo;
  porMedioMapa.set(k, acc);
}
const porMedio = [...porMedioMapa.entries()].map(([medio, x]) => ({ medio, ...x })).sort((a, b) => b.n - a.n).slice(0, 60);
/* Lo que entró por barridos mecánicos (diarios de sesiones y repartidos leídos por scripts, sin pasar
   por ningún modelo) se cuenta aparte: un lector leyó «tokens» como gasto de modelos y no lo es. */
const MECANICOS = new Set(['hemeroteca-parlamento', 'infolegislativa-parlamento']);
const mecanico = { n: 0, chars: 0 };
for (const [k, x] of porMedioMapa) if (MECANICOS.has(k)) { mecanico.n += x.n; mecanico.chars += x.chars; }
const porDia = db.prepare("select substr(retrieved_at, 1, 10) as dia, count(*) as n, coalesce(sum(largo),0) as chars from notas where retrieved_at is not null group by dia order by dia").all() as { dia: string; n: number; chars: number }[];
const porPolitico = db.prepare('select politico, count(distinct nota) as n from menciones group by politico order by n desc').all() as { politico: string; n: number }[];
const porTema = db.prepare('select tema, count(distinct nota) as n from nota_tema group by tema order by n desc').all() as { tema: string; n: number }[];
const porEvento = db.prepare('select evento, count(distinct nota) as n from nota_evento group by evento order by n desc').all() as { evento: string; n: number }[];
const porPartido = db.prepare('select partido, count(distinct nota) as n from nota_partido group by partido order by n desc').all() as { partido: string; n: number }[];

/* Empresas públicas: el medio que publica sus documentos apunta a la ficha con `empresa:`. */
const empresaDeMedio = new Map<string, string>();
for (const f of readdirSync(path.join(rootDir, 'content', 'medios'))) {
  if (!f.endsWith('.yaml')) continue;
  const m = YAML.parse(readFileSync(path.join(rootDir, 'content', 'medios', f), 'utf8'));
  if (m?.empresa) empresaDeMedio.set(f.replace(/\.yaml$/, ''), typeof m.empresa === 'string' ? m.empresa : m.empresa.id);
}
const porEmpresa = new Map<string, { n: number; chars: number }>();
for (const r of db.prepare('select medio, count(*) as n, coalesce(sum(largo),0) as chars from notas group by medio').all() as { medio: string; n: number; chars: number }[]) {
  const e = empresaDeMedio.get(r.medio ?? '');
  if (!e) continue;
  const acc = porEmpresa.get(e) ?? { n: 0, chars: 0 };
  acc.n += r.n;
  acc.chars += r.chars;
  porEmpresa.set(e, acc);
}

/* Archivos en disco: cuánto pesa lo bajado, por extensión (el JSON es el texto extraído; el PDF,
   la planilla y el zip son el original). */
const porExtension = new Map<string, { n: number; bytes: number }>();
const dirNotas = path.join(corpus, 'notas');
for (const f of readdirSync(dirNotas)) {
  const ext = path.extname(f).replace('.', '') || 'sin extensión';
  const acc = porExtension.get(ext) ?? { n: 0, bytes: 0 };
  acc.n++;
  acc.bytes += statSync(path.join(dirNotas, f)).size;
  porExtension.set(ext, acc);
}
const dirTrans = path.join(corpus, 'transcripciones');
const transcripciones = existsSync(dirTrans) ? readdirSync(dirTrans).filter((f) => f.endsWith('.json')) : [];
let segundosTranscriptos = 0;
for (const f of transcripciones) {
  try {
    const t = JSON.parse(readFileSync(path.join(dirTrans, f), 'utf8'));
    const segs = t.segments ?? t.segmentos ?? [];
    const fin = segs.length ? Number(segs[segs.length - 1].end ?? segs[segs.length - 1].fin ?? 0) : Number(t.duracion ?? t.duration ?? 0);
    segundosTranscriptos += Number.isFinite(fin) ? fin : 0;
  } catch {
    /* transcripción incompleta */
  }
}

/* Lecturas: el ledger público de todo lo que `pnpm fuente` intentó leer, con su resultado. */
const ledgerRuta = path.join(rootDir, 'data', 'lecturas-ledger.json');
const ledger = existsSync(ledgerRuta) ? (JSON.parse(readFileSync(ledgerRuta, 'utf8')) as Record<string, { resultado: string; dominio: string; bytes: number; intentos: number }>) : {};
const lecturas = Object.values(ledger);
const porResultado = new Map<string, number>();
const porDominio = new Map<string, { n: number; bytes: number; fallidas: number }>();
for (const l of lecturas) {
  porResultado.set(l.resultado, (porResultado.get(l.resultado) ?? 0) + 1);
  const acc = porDominio.get(l.dominio) ?? { n: 0, bytes: 0, fallidas: 0 };
  acc.n++;
  acc.bytes += l.bytes ?? 0;
  if (l.resultado !== 'ok') acc.fallidas++;
  porDominio.set(l.dominio, acc);
}

const salida = {
  generado: hoy,
  nota: 'Cuenta lo que entró al corpus del sitio (fuentes leídas con pnpm fuente) y lo que se intentó leer. Los tokens son una estimación de unos cuatro caracteres por token sobre el texto guardado; no son consumo de modelos: los barridos mecánicos (diarios de sesiones y repartidos leídos por scripts para extraer votaciones y asistencia) no pasan por ningún modelo, y lo que los agentes consumen al leer y razonar el sitio no lo registra.',
  totales: {
    fuentes: total.n,
    caracteres: total.chars,
    tokens_estimados: Math.round(total.chars / 4),
    fuentes_mecanicas: mecanico.n,
    tokens_mecanicos: Math.round(mecanico.chars / 4),
    bytes_en_disco: [...porExtension.values()].reduce((s, x) => s + x.bytes, 0),
    transcripciones: transcripciones.length,
    horas_transcriptas: Math.round((segundosTranscriptos / 3600) * 10) / 10,
    lecturas_intentadas: lecturas.length,
  },
  por_tipo: porTipo.map((t) => ({ ...t, tokens_estimados: Math.round(t.chars / 4) })),
  por_extension: [...porExtension.entries()].map(([ext, x]) => ({ extension: ext, ...x })).sort((a, b) => b.bytes - a.bytes),
  por_medio: porMedio.map((m) => ({ ...m, tokens_estimados: Math.round(m.chars / 4), empresa: empresaDeMedio.get(m.medio) ?? null })),
  por_dia: porDia,
  por_politico: porPolitico,
  por_partido: porPartido,
  por_tema: porTema,
  por_evento: porEvento,
  por_empresa: [...porEmpresa.entries()].map(([empresa, x]) => ({ empresa, ...x, tokens_estimados: Math.round(x.chars / 4) })).sort((a, b) => b.chars - a.chars),
  lecturas: {
    por_resultado: [...porResultado.entries()].map(([resultado, n]) => ({ resultado, n })).sort((a, b) => b.n - a.n),
    por_dominio: [...porDominio.entries()].map(([dominio, x]) => ({ dominio, ...x })).sort((a, b) => b.n - a.n).slice(0, 80),
  },
};
const destino = path.join(rootDir, 'data', 'corpus-estadisticas.json');
writeFileSync(destino, JSON.stringify(salida, null, 1) + '\n', 'utf8');

/* Una fila compacta por fuente, para que la página filtre por político, empresa, evento o tema
   del lado del lector: tipo, medio, largo, día y etiquetas; sin URL ni texto (eso es el corpus). */
const filas = db.prepare('select id, url, tipo, medio, largo, substr(retrieved_at, 1, 10) as dia from notas').all() as { id: string; url: string; tipo: string | null; medio: string | null; largo: number | null; dia: string | null }[];
const pol = new Map<string, string[]>();
for (const r of db.prepare('select nota, politico from menciones').all() as { nota: string; politico: string }[]) (pol.get(r.nota) ?? pol.set(r.nota, []).get(r.nota)!).push(r.politico);
const tem = new Map<string, string[]>();
for (const r of db.prepare('select nota, tema from nota_tema').all() as { nota: string; tema: string }[]) (tem.get(r.nota) ?? tem.set(r.nota, []).get(r.nota)!).push(r.tema);
const eve = new Map<string, string[]>();
for (const r of db.prepare('select nota, evento from nota_evento').all() as { nota: string; evento: string }[]) (eve.get(r.nota) ?? eve.set(r.nota, []).get(r.nota)!).push(r.evento);
const compactas = filas.map((r) => ({
  t: r.tipo ?? '',
  m: medioEstadistico(r.medio, r.url),
  e: empresaDeMedio.get(r.medio ?? '') ?? undefined,
  c: r.largo ?? 0,
  d: r.dia ?? '',
  p: [...new Set(pol.get(r.id) ?? [])],
  x: [...new Set(tem.get(r.id) ?? [])],
  v: [...new Set(eve.get(r.id) ?? [])],
}));
writeFileSync(path.join(rootDir, 'data', 'corpus-notas.json'), JSON.stringify({ generado: hoy, campos: { t: 'tipo', m: 'medio', e: 'empresa', c: 'caracteres', d: 'dia', p: 'politicos', x: 'temas', v: 'eventos' }, notas: compactas }), 'utf8');
console.log(`✔ ${total.n} fuentes, ${(total.chars / 1e6).toFixed(1)} M caracteres (≈ ${(total.chars / 4e6).toFixed(1)} M tokens), ${(salida.totales.bytes_en_disco / 1e9).toFixed(1)} GB en disco, ${transcripciones.length} transcripciones → data/corpus-estadisticas.json`);
