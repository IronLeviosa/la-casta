/**
 * pnpm cobertura:corpus <id-de-corrida> [--inbox <dir>] [--escribir] [--json]
 *
 * Mide cuánto de lo que el corpus ya tenía sobre una corrida (político + tema del brief, dentro
 * del período a cubrir) quedó sin abrir. Busca en el corpus con `buscar` (político + cada alias
 * del tema, unidas por URL) y compara contra las URLs que `consultas.jsonl` registra como leídas
 * (tipo "fuente"), normalizadas con `canonicalizar` para que no cuenten como distintas dos formas
 * de la misma URL.
 *
 * «El mismo esfuerzo para todos» (Regla 0) es una promesa hasta que hay un número: esto es ese
 * número. No mide si el investigador citó bien lo que abrió, solo si dejó algo del corpus sin
 * mirar.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { RAIZ, RUTAS_CORPUS } from '../lib/rutas.ts';
import { carpetaCorrida } from '../lib/corridas.ts';
import { canonicalizar } from '../lib/url.ts';
import { log, parsearArgs } from '../lib/log.ts';
import { buscar, type ResultadoBusqueda } from './buscar.ts';

// ---------------------------------------------------------------------------
// Parseo del brief: político, tema, alias del tema y período a cubrir.
// ---------------------------------------------------------------------------

export interface BriefCobertura {
  politico: string | null;
  tema: string | null;
  temaAlias: string[];
  desde: string | null;
  hasta: string | null;
}

/** Líneas de la sección cuyo título matchea `tituloRegex`, hasta el próximo `## ` o el final. */
function bloqueDeSeccion(md: string, tituloRegex: RegExp): string | null {
  const lineas = md.split(/\r?\n/);
  const inicio = lineas.findIndex((l) => tituloRegex.test(l.trim()));
  if (inicio < 0) return null;
  let fin = lineas.length;
  for (let i = inicio + 1; i < lineas.length; i++) {
    if (/^##\s/.test(lineas[i])) {
      fin = i;
      break;
    }
  }
  return lineas.slice(inicio, fin).join('\n');
}

/**
 * Parseo mecánico de `brief.md` (formato de `scripts/brief.ts`): sección "## 1. Político" con
 * `- slug:` y `- período a cubrir: desde ... (AAAA) hasta hoy (AAAA-MM-DD)...`, y sección
 * "## 2. Tema" con `- slug:` y `- alias: a, b, c`. Un brief sin sección de Tema (vetos, fichas,
 * corridas multi-candidato) devuelve `tema: null` y `temaAlias: []`; quien llama decide cómo
 * buscar sin tema en vez de fallar.
 */
export function parsearBrief(contenido: string): BriefCobertura {
  const bloquePolitico = bloqueDeSeccion(contenido, /^##\s*1\.\s*Pol[ií]tico\b/i) ?? '';
  const bloqueTema = bloqueDeSeccion(contenido, /^##\s*2\.\s*Tema\b/i);

  const politico = /^-\s*slug:\s*`([^`]+)`/m.exec(bloquePolitico)?.[1]?.trim() ?? null;

  let tema: string | null = null;
  let temaAlias: string[] = [];
  if (bloqueTema) {
    tema = /^-\s*slug:\s*`([^`]+)`/m.exec(bloqueTema)?.[1]?.trim() ?? null;
    const lineaAlias = /^-\s*alias:\s*(.+)$/m.exec(bloqueTema)?.[1] ?? '';
    temaAlias = lineaAlias
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !/^ningun[oa]$/i.test(s));
  }

  let desde: string | null = null;
  let hasta: string | null = null;
  const lineaPeriodo = /^-\s*per[ií]odo a cubrir:\s*(.+)$/m.exec(bloquePolitico)?.[1] ?? '';
  const mCompleto = /\((\d{4})\)\s*hasta hoy\s*\((\d{4}-\d{2}-\d{2})\)/i.exec(lineaPeriodo);
  if (mCompleto) {
    desde = `${mCompleto[1]}-01-01`;
    hasta = mCompleto[2];
  } else {
    // Formato no reconocido del todo: al menos rescatamos el "hasta hoy (fecha)" si está.
    const mHasta = /hasta hoy\s*\((\d{4}-\d{2}-\d{2})\)/i.exec(lineaPeriodo);
    if (mHasta) hasta = mHasta[1];
  }

  return { politico, tema, temaAlias, desde, hasta };
}

// ---------------------------------------------------------------------------
// consultas.jsonl: URLs que el lote ya abrió (tipo "fuente").
// ---------------------------------------------------------------------------

interface EntradaConsulta {
  t?: string;
  tipo?: string;
  q?: string;
  resultado?: string;
}

export function leerUrlsAbiertas(contenidoJsonl: string): string[] {
  const urls: string[] = [];
  for (const linea of contenidoJsonl.split(/\r?\n/)) {
    const l = linea.trim();
    if (!l) continue;
    let obj: EntradaConsulta;
    try {
      obj = JSON.parse(l) as EntradaConsulta;
    } catch {
      continue; // línea corrupta: no corta la corrida, solo no cuenta.
    }
    if (obj && obj.tipo === 'fuente' && typeof obj.q === 'string' && obj.q) urls.push(obj.q);
  }
  return urls;
}

// ---------------------------------------------------------------------------
// Comparación pura: notas del corpus vs. URLs abiertas.
// ---------------------------------------------------------------------------

export interface NotaCorpus {
  url: string;
  fecha: string | null;
  medio: string | null;
  titulo: string | null;
  rank: number;
}

export interface ResultadoCobertura {
  total: number;
  abiertas: number;
  sinAbrir: number;
  /** 0-100, redondeado a un decimal. 100 cuando `total` es 0 (nada que cubrir). */
  porcentaje: number;
  /** Las no abiertas, ordenadas por rank (mejor primero) y recortadas a `tope`. */
  notasSinAbrir: NotaCorpus[];
}

/**
 * Compara notas del corpus contra URLs abiertas, canonicalizando ambos lados (la misma nota puede
 * llegar con `http://`, `www.` o parámetros de tracking distintos según de dónde salió). Dedupea
 * las notas por URL canónica quedándose con el mejor rank (BM25: menor es más relevante).
 */
export function compararCobertura(notas: NotaCorpus[], urlsAbiertas: string[], opciones: { tope?: number } = {}): ResultadoCobertura {
  const tope = opciones.tope ?? 20;
  const abiertasSet = new Set(urlsAbiertas.map((u) => canonicalizar(u)));

  const porUrl = new Map<string, NotaCorpus>();
  for (const n of notas) {
    const url = canonicalizar(n.url);
    const previa = porUrl.get(url);
    if (!previa || n.rank < previa.rank) porUrl.set(url, { ...n, url });
  }

  const unicas = [...porUrl.values()];
  const sinAbrir = unicas.filter((n) => !abiertasSet.has(n.url)).sort((a, b) => a.rank - b.rank);
  const total = unicas.length;
  const abiertas = total - sinAbrir.length;
  const porcentaje = total === 0 ? 100 : Math.round((abiertas / total) * 1000) / 10;

  return { total, abiertas, sinAbrir: sinAbrir.length, porcentaje, notasSinAbrir: sinAbrir.slice(0, tope) };
}

// ---------------------------------------------------------------------------
// Búsqueda en el corpus real (político + cada alias del tema, unidas por URL/id de nota).
// ---------------------------------------------------------------------------

const LIMITE_POR_CONSULTA = 100;

function recolectarNotasDelCorpus(politico: string, temaAlias: string[], desde: string | null, hasta: string | null): NotaCorpus[] {
  const filtrosBase = { politico, desde: desde ?? undefined, hasta: hasta ?? undefined, limite: LIMITE_POR_CONSULTA };
  // Sin tema (vetos, fichas): una sola consulta por político y período, sin texto (ordena por fecha).
  const terminos = temaAlias.length ? temaAlias : [''];
  const vistas = new Map<string, ResultadoBusqueda>();
  for (const termino of terminos) {
    const resultados = buscar(termino, filtrosBase);
    for (const r of resultados) {
      const anterior = vistas.get(r.id);
      if (!anterior || r.rank < anterior.rank) vistas.set(r.id, r);
    }
  }
  return [...vistas.values()].map((r) => ({ url: r.url, fecha: r.fecha, medio: r.medio, titulo: r.titulo, rank: r.rank }));
}

// ---------------------------------------------------------------------------
// notas.md: agregar o reemplazar la sección "## cobertura_corpus".
// ---------------------------------------------------------------------------

function formatearSeccionNotas(brief: BriefCobertura, r: ResultadoCobertura): string {
  const periodo = brief.desde && brief.hasta ? `${brief.desde} → ${brief.hasta}` : '(período no reconocido en el brief)';
  const temaTxt = brief.tema ? `${brief.tema} (o sus alias)` : '(brief sin sección de Tema: solo por político)';
  const lineas: string[] = [];
  lineas.push('## cobertura_corpus');
  lineas.push('');
  lineas.push(
    `Comparación automática (\`pnpm cobertura:corpus\`) entre las notas del corpus que mencionan a ` +
      `\`${brief.politico}\` sobre ${temaTxt} entre ${periodo}, y las URLs que este lote registró como abiertas en \`consultas.jsonl\`.`,
  );
  lineas.push('');
  lineas.push(`- notas del corpus que coinciden: ${r.total}`);
  lineas.push(`- abiertas: ${r.abiertas}`);
  lineas.push(`- sin abrir: ${r.sinAbrir}`);
  lineas.push(`- cobertura del corpus: ${r.abiertas} de ${r.total} notas abiertas (${r.porcentaje.toFixed(1)} %)`);
  if (r.notasSinAbrir.length) {
    lineas.push('');
    lineas.push(`Sin abrir (hasta ${r.notasSinAbrir.length}, por relevancia):`);
    for (const n of r.notasSinAbrir) lineas.push(`- ${n.fecha ?? '????-??-??'} · ${n.medio ?? '?'} · ${n.titulo ?? '(sin título)'} — ${n.url}`);
  }
  return lineas.join('\n');
}

/** Agrega o reemplaza la sección `## cobertura_corpus` al final del markdown. */
export function actualizarSeccionCobertura(md: string, seccionNueva: string): string {
  const lineas = md.split(/\r?\n/);
  const inicio = lineas.findIndex((l) => /^##\s*cobertura_corpus\b/i.test(l.trim()));
  let sinSeccion: string;
  if (inicio < 0) {
    sinSeccion = md;
  } else {
    let fin = lineas.length;
    for (let i = inicio + 1; i < lineas.length; i++) {
      if (/^##\s/.test(lineas[i])) {
        fin = i;
        break;
      }
    }
    sinSeccion = [...lineas.slice(0, inicio), ...lineas.slice(fin)].join('\n');
  }
  const base = sinSeccion.replace(/\s+$/, '');
  return (base ? base + '\n\n' : '') + seccionNueva + '\n';
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function uso(): void {
  process.stderr.write(
    'Uso: pnpm cobertura:corpus <id-de-corrida> [--inbox <dir>] [--escribir] [--json]\n\n' +
      '  <id-de-corrida>  carpeta de data/corridas/ (ej. 2026-09-05-lacalle-pou-economia-combustibles).\n' +
      '  --inbox <dir>    de dónde leer consultas.jsonl si la corrida todavía no se promovió\n' +
      '                   (inbox/<politico>/<tema>/<fecha>). brief.md siempre se lee de data/corridas/.\n' +
      '  --escribir       agrega/reemplaza la sección "## cobertura_corpus" en notas.md.\n' +
      '  --json           salida en JSON por stdout, sin nada más.\n',
  );
}

function main(): void {
  const { posicionales, opciones } = parsearArgs(process.argv.slice(2));
  const corridaId = posicionales[0];
  if (!corridaId) {
    uso();
    process.exit(2);
  }
  const json = opciones.json === true;
  const escribir = opciones.escribir === true;
  const inboxArg = typeof opciones.inbox === 'string' ? opciones.inbox : undefined;

  // El corpus es un repo privado aparte: en una máquina que no lo tiene, `buscar` abriría (o
  // crearía) un índice vacío en silencio. Cortamos acá, antes de tocar nada del corpus.
  if (!existsSync(RUTAS_CORPUS.indice)) {
    log.error(
      `no encuentro el índice del corpus (${RUTAS_CORPUS.indice}). ` +
        `Este repo privado no está clonado en esta máquina, o falta \`pnpm corpus:indexar\`.`,
    );
    process.exit(2);
  }

  const corridaDir = carpetaCorrida(RAIZ, corridaId);
  const briefPath = path.join(corridaDir, 'brief.md');
  if (!existsSync(briefPath)) {
    log.error(`no existe ${briefPath}`);
    process.exit(1);
  }
  const brief = parsearBrief(readFileSync(briefPath, 'utf8'));
  if (!brief.politico) {
    log.error(`no pude leer el político (sección "## 1. Político", "- slug:") de ${briefPath}`);
    process.exit(1);
  }
  if (!brief.tema) log.aviso(`brief sin sección "## 2. Tema": ${briefPath} — cobertura solo por político y período`);
  if (!brief.desde || !brief.hasta) log.aviso(`no pude reconocer "período a cubrir" en ${briefPath}: buscando sin filtro de fecha`);

  let consultasPath = path.join(corridaDir, 'consultas.jsonl');
  let notasPath = path.join(corridaDir, 'notas.md');
  let destinoEscritura = corridaDir;
  if (!existsSync(consultasPath) && inboxArg) {
    const inboxDir = path.resolve(RAIZ, inboxArg);
    consultasPath = path.join(inboxDir, 'consultas.jsonl');
    notasPath = path.join(inboxDir, 'notas.md');
    destinoEscritura = inboxDir;
  }
  if (!existsSync(consultasPath)) {
    log.error(
      `no encuentro consultas.jsonl. Probé ${path.join(corridaDir, 'consultas.jsonl')}` +
        (inboxArg ? ` y ${consultasPath}` : ' (si la corrida no se promovió todavía, pasá --inbox <dir>)'),
    );
    process.exit(1);
  }
  const urlsAbiertas = leerUrlsAbiertas(readFileSync(consultasPath, 'utf8'));

  const notasDelCorpus = recolectarNotasDelCorpus(brief.politico, brief.temaAlias, brief.desde, brief.hasta);
  const resultado = compararCobertura(notasDelCorpus, urlsAbiertas);

  if (escribir) {
    const seccion = formatearSeccionNotas(brief, resultado);
    const previo = existsSync(notasPath) ? readFileSync(notasPath, 'utf8') : '';
    writeFileSync(notasPath, actualizarSeccionCobertura(previo, seccion), 'utf8');
    if (!json) log.ok(`escribí "## cobertura_corpus" en ${notasPath}`);
  }

  if (json) {
    process.stdout.write(
      JSON.stringify(
        {
          corrida: corridaId,
          politico: brief.politico,
          tema: brief.tema,
          tema_alias: brief.temaAlias,
          desde: brief.desde,
          hasta: brief.hasta,
          total: resultado.total,
          abiertas: resultado.abiertas,
          sin_abrir: resultado.sinAbrir,
          porcentaje: resultado.porcentaje,
          notas_sin_abrir: resultado.notasSinAbrir,
        },
        null,
        1,
      ) + '\n',
    );
    return;
  }

  process.stdout.write(`cobertura del corpus — ${corridaId}\n`);
  process.stdout.write(
    `político: ${brief.politico} · tema: ${brief.tema ?? '(sin tema)'} (${brief.temaAlias.length} alias) · período: ${brief.desde ?? '?'} → ${brief.hasta ?? '?'}\n\n`,
  );
  process.stdout.write(`notas del corpus que coinciden: ${resultado.total}\n`);
  process.stdout.write(`abiertas: ${resultado.abiertas}\n`);
  process.stdout.write(`sin abrir: ${resultado.sinAbrir}\n`);
  if (resultado.notasSinAbrir.length) {
    process.stdout.write(`\nsin abrir (hasta ${resultado.notasSinAbrir.length}, por relevancia):\n`);
    for (const n of resultado.notasSinAbrir) {
      process.stdout.write(`${n.fecha ?? '????-??-??'}  ${(n.medio ?? '?').padEnd(18)}  ${n.titulo ?? n.url}\n`);
    }
  }
  process.stdout.write(`\ncobertura del corpus: ${resultado.abiertas} de ${resultado.total} notas abiertas (${resultado.porcentaje.toFixed(1)} %)\n`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
