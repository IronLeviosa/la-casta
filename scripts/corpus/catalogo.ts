#!/usr/bin/env tsx
/**
 * `pnpm catalogo <politico> [--desde AAAA-MM] [--hasta AAAA-MM] [--tema <slug>] [--json]`
 *
 * Etapa C del catálogo (docs/plan-catalogo.md): informe por persona, mecánico, sobre lo que ya
 * dejaron las dos pasadas de Haiku (etapa B, `catalogar.ts`/`etiquetar.ts`/`extraer-afirmaciones.ts`)
 * en el índice y en las notas del corpus. No llama a ningún modelo ni toca la red.
 *
 * Junta, para el político pedido:
 *   - toda afirmación suya (`catalogo.afirmaciones[].politico === politico`, en cualquier nota);
 *   - además, las notas donde quedó `central` o `secundaria` (`catalogo.relevancia`) aunque el
 *     extractor no le haya sacado ninguna afirmación atribuible: son cobertura, no se pierden.
 *
 * El índice (`indice.db`) solo tiene la lista de notas candidatas (`menciones` ∪ `afirmaciones`
 * por político): ni `catalogo.relevancia` ni `catalogo.dato`/`atribucion` de cada afirmación están
 * en una tabla SQL, así que el detalle sale de leer cada nota candidata (`leerNotaDeCarpeta`). Con
 * el piloto de hoy (~1.400 notas catalogadas) es una lectura de archivos chica; si el catálogo total
 * escala a toda la historia, esto es lo primero que pediría una tabla nueva en `indexar.ts` (no se
 * toca acá: otro agente puede estar corriendo el worker sobre el índice real ahora mismo).
 *
 * Agrupa por tema:
 *   - una afirmación entra por su propio `tema` (el que le puso el extractor), no por el tema
 *     general de la nota: es más preciso. Si ese tema no está en la taxonomía vigente (typo,
 *     alucinación, o vino vacío), cae en el balde `sin-tema` y cuenta en `afirmaciones_sin_tema_valido`.
 *   - una nota de cobertura (central/secundaria, sin ninguna afirmación atribuible a este político)
 *     no tiene un tema propio: se reparte por los temas generales de la nota (`etiquetas.temas`,
 *     la etiqueta de tópico que ya tenía antes del catálogo), o a `sin-tema` si no tiene ninguno
 *     válido. Nunca puede coincidir con una nota que sí tiene afirmaciones (son conjuntos disjuntos:
 *     cobertura es exactamente "sin afirmaciones"), así que no hay riesgo de contarla dos veces
 *     dentro del mismo tema.
 *
 * Lotes: por tema, tramos cronológicos de como mucho 40 notas y 30 afirmaciones `dato`/`promesa`
 * (`armarLotesDeTema`); una nota de `posicion`/`mencion_a` viaja en el lote de su tema sin contar
 * para ese tope. Partir por período es simplemente cortar la lista cronológica cuando el próximo
 * ítem haría pasarse alguno de los dos topes.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { RAIZ, RUTAS_CATALOGO, RUTAS_CORPUS } from '../lib/rutas.ts';
import { log, parsearArgs } from '../lib/log.ts';
import { abrirIndice, type Indice } from './indexar.ts';
import { cargarTaxonomia } from './etiquetar.ts';
import type { Nota, Relevancia, TipoAfirmacion } from './tipos.ts';

// ---------------------------------------------------------------------------
// Constantes del reparto en lotes (docs/plan-catalogo.md, etapa C)
// ---------------------------------------------------------------------------

export const MAX_NOTAS_POR_LOTE = 40;
export const MAX_DATOS_POR_LOTE = 30;
/** Balde para una afirmación con tema inválido/ausente, o una nota de cobertura sin ningún tema válido. */
export const SIN_TEMA = 'sin-tema';

// ---------------------------------------------------------------------------
// Forma intermedia, pura: lo que le hace falta al informe de cada nota candidata.
// ---------------------------------------------------------------------------

export interface AfirmacionParaInforme {
  cita: string;
  tipo: TipoAfirmacion;
  /** El tema tal cual lo dejó el extractor, sin validar todavía contra la taxonomía. */
  tema: string;
  dato: { que: string; valor: string; periodo?: string | null } | null;
  atribucion: 'directa' | 'indirecta';
  fecha_dicho: string | null;
}

export interface NotaParaInforme {
  id: string;
  medio: string | null;
  fecha: string | null;
  url: string;
  /** `etiquetas.temas` de la nota, crudos (tópico general, no el de cada afirmación). */
  temasNota: string[];
  /** Relevancia que le puso el etiquetador a este político en esta nota (`undefined` = ni se pronunció). */
  relevancia?: Relevancia;
  /** Solo las afirmaciones de `catalogo.afirmaciones` atribuidas a este político. */
  afirmaciones: AfirmacionParaInforme[];
}

/** Pura: arma la forma intermedia de una `Nota` del corpus para un político dado. */
export function notaParaInforme(nota: Nota, politico: string): NotaParaInforme {
  return {
    id: nota.id,
    medio: nota.medio ?? null,
    fecha: nota.fecha ?? null,
    url: nota.url_canonica || nota.url,
    temasNota: nota.etiquetas?.temas ?? [],
    relevancia: nota.catalogo?.relevancia?.[politico],
    afirmaciones: (nota.catalogo?.afirmaciones ?? [])
      .filter((a) => a.politico === politico)
      .map((a) => ({ cita: a.cita, tipo: a.tipo, tema: a.tema, dato: a.dato, atribucion: a.atribucion, fecha_dicho: a.fecha_dicho })),
  };
}

// ---------------------------------------------------------------------------
// Filtro de fecha (--desde/--hasta, AAAA-MM): admite fechas de nota más finas (AAAA-MM-DD) o más
// gruesas (solo AAAA, cuando el etiquetador no pudo precisar más). Una fecha de solo año se toma
// como si cubriera los doce meses, para no descartar de más una nota que capaz sí cae en el rango.
// ---------------------------------------------------------------------------

function partesFecha(fecha: string): { anio: number; mes: number | null } | null {
  const m = /^(\d{4})(?:-(\d{2}))?/.exec(fecha);
  if (!m) return null;
  return { anio: Number(m[1]), mes: m[2] ? Number(m[2]) : null };
}

/** [clave mínima, clave máxima] de meses (AAAAMM) que cubre esta fecha. */
function rangoDeFecha(fecha: string): [number, number] | null {
  const p = partesFecha(fecha);
  if (!p) return null;
  const claveExacta = p.anio * 100 + (p.mes ?? 0);
  return p.mes ? [claveExacta, claveExacta] : [p.anio * 100 + 1, p.anio * 100 + 12];
}

/** true si `fecha` cae dentro de [`desde`, `hasta`] (AAAA-MM); sin ninguno de los dos, siempre true. */
export function dentroDeRango(fecha: string | null, desde?: string, hasta?: string): boolean {
  if (!desde && !hasta) return true;
  if (!fecha) return false;
  const rango = rangoDeFecha(fecha);
  if (!rango) return false;
  const [minC, maxC] = rango;
  if (desde) {
    const d = partesFecha(desde);
    const desdeClave = d ? d.anio * 100 + (d.mes ?? 1) : null;
    if (desdeClave !== null && maxC < desdeClave) return false;
  }
  if (hasta) {
    const h = partesFecha(hasta);
    const hastaClave = h ? h.anio * 100 + (h.mes ?? 12) : null;
    if (hastaClave !== null && minC > hastaClave) return false;
  }
  return true;
}

// ---------------------------------------------------------------------------
// Validación de tema contra la taxonomía vigente.
// ---------------------------------------------------------------------------

export function resolverTema(tema: string | null | undefined, temasValidos: Set<string>): string {
  return tema && temasValidos.has(tema) ? tema : SIN_TEMA;
}

/** Temas válidos de una nota de cobertura; si ninguno vale, cae en `sin-tema` (no se pierde). */
export function temasDeNota(temasNota: string[], temasValidos: Set<string>): string[] {
  const validos = temasNota.filter((t) => temasValidos.has(t));
  return validos.length ? validos : [SIN_TEMA];
}

function compararFechas(a: string | null, b: string | null): number {
  if (a === b) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  return a.localeCompare(b);
}

// ---------------------------------------------------------------------------
// Forma de salida del informe.
// ---------------------------------------------------------------------------

export interface AfirmacionInformeSalida {
  nota: { id: string; medio: string | null; fecha: string | null; url: string };
  cita: string;
  tipo: TipoAfirmacion;
  dato: { que: string; valor: string; periodo?: string | null } | null;
  atribucion: 'directa' | 'indirecta';
  /** `fecha_dicho` si vino, si no la fecha de la nota: la que ordena y agrupa. */
  fecha: string | null;
}

export interface NotaCoberturaSalida {
  id: string;
  medio: string | null;
  fecha: string | null;
  url: string;
  relevancia: Relevancia;
}

export interface ResumenTema {
  notas: number;
  por_tipo: Record<TipoAfirmacion, number>;
  primer_dicho: string | null;
  ultimo_dicho: string | null;
  medios_distintos: number;
}

export interface TemaCatalogo {
  afirmaciones: AfirmacionInformeSalida[];
  notas_cobertura: NotaCoberturaSalida[];
  resumen: ResumenTema;
}

export interface LoteCatalogo {
  tema: string;
  periodo: { desde: string; hasta: string };
  notas: number;
  nota_ids: string[];
  datos: number;
  promesas: number;
  posiciones: number;
  menciones_a: number;
}

export interface InformeCatalogo {
  politico: string;
  generado: string;
  filtros: { desde: string | null; hasta: string | null; tema: string | null };
  notas_totales: number;
  afirmaciones_totales: number;
  /** Señal de calidad de TODO el político (no se recorta con --tema): cuántas afirmaciones traían
   * un tema fuera de la taxonomía vigente. */
  afirmaciones_sin_tema_valido: number;
  medios_distintos: number;
  temas: Record<string, TemaCatalogo>;
  lotes: LoteCatalogo[];
}

// ---------------------------------------------------------------------------
// Reparto en lotes de un tema (cronológico, con los dos topes del plan).
// ---------------------------------------------------------------------------

interface ItemNotaLote {
  id: string;
  fecha: string | null;
  datos: number;
  promesas: number;
  posiciones: number;
  menciones_a: number;
}

/**
 * Arma los lotes propuestos de un tema: junta afirmaciones y notas de cobertura por nota (una nota
 * puede tener varias afirmaciones de este tema; se queda con la fecha más temprana de las suyas
 * como fecha representativa), ordena cronológicamente y corta en tramos nuevos apenas el próximo
 * ítem haría pasarse de `MAX_NOTAS_POR_LOTE` notas o de `MAX_DATOS_POR_LOTE` afirmaciones
 * `dato`+`promesa` acumuladas (una nota con `posicion`/`mencion_a` solamente no empuja ese segundo
 * tope, pero sí cuenta para el de notas). Una sola nota que por sí sola ya supere el tope de datos
 * no se puede partir: queda sola en su propio lote, pasado el tope.
 */
export function armarLotesDeTema(tema: string, afirmaciones: AfirmacionInformeSalida[], cobertura: NotaCoberturaSalida[]): LoteCatalogo[] {
  const porNota = new Map<string, ItemNotaLote>();
  const item = (id: string, fecha: string | null): ItemNotaLote => {
    let it = porNota.get(id);
    if (!it) {
      it = { id, fecha, datos: 0, promesas: 0, posiciones: 0, menciones_a: 0 };
      porNota.set(id, it);
    } else if (fecha && (!it.fecha || fecha < it.fecha)) {
      it.fecha = fecha;
    }
    return it;
  };
  for (const a of afirmaciones) {
    const it = item(a.nota.id, a.fecha);
    if (a.tipo === 'dato') it.datos++;
    else if (a.tipo === 'promesa') it.promesas++;
    else if (a.tipo === 'posicion') it.posiciones++;
    else if (a.tipo === 'mencion_a') it.menciones_a++;
  }
  for (const n of cobertura) item(n.id, n.fecha);

  const items = [...porNota.values()].sort((a, b) => compararFechas(a.fecha, b.fecha));

  const lotes: LoteCatalogo[] = [];
  let actual: ItemNotaLote[] = [];
  let datosPromesasActual = 0;
  const cerrar = (): void => {
    if (!actual.length) return;
    const fechas = actual.map((i) => i.fecha).filter((f): f is string => Boolean(f)).sort();
    lotes.push({
      tema,
      periodo: { desde: fechas[0] ?? '', hasta: fechas[fechas.length - 1] ?? '' },
      notas: actual.length,
      nota_ids: actual.map((i) => i.id),
      datos: actual.reduce((s, i) => s + i.datos, 0),
      promesas: actual.reduce((s, i) => s + i.promesas, 0),
      posiciones: actual.reduce((s, i) => s + i.posiciones, 0),
      menciones_a: actual.reduce((s, i) => s + i.menciones_a, 0),
    });
    actual = [];
    datosPromesasActual = 0;
  };
  for (const it of items) {
    const aporte = it.datos + it.promesas;
    const superariaNotas = actual.length + 1 > MAX_NOTAS_POR_LOTE;
    const superariaDatos = actual.length > 0 && datosPromesasActual + aporte > MAX_DATOS_POR_LOTE;
    if (superariaNotas || superariaDatos) cerrar();
    actual.push(it);
    datosPromesasActual += aporte;
  }
  cerrar();
  return lotes;
}

// ---------------------------------------------------------------------------
// El informe completo: pura, no toca disco ni el índice (eso lo hace `recolectarNotas` más abajo).
// ---------------------------------------------------------------------------

interface AcumuladorTema {
  afirmaciones: AfirmacionInformeSalida[];
  cobertura: Map<string, NotaCoberturaSalida>;
}

export function armarInforme(
  politico: string,
  notas: NotaParaInforme[],
  temasValidos: Set<string>,
  opciones: { desde?: string; hasta?: string; tema?: string } = {},
): InformeCatalogo {
  const porTema = new Map<string, AcumuladorTema>();
  const obtener = (tema: string): AcumuladorTema => {
    let a = porTema.get(tema);
    if (!a) {
      a = { afirmaciones: [], cobertura: new Map() };
      porTema.set(tema, a);
    }
    return a;
  };

  for (const nota of notas) {
    if (nota.afirmaciones.length > 0) {
      for (const af of nota.afirmaciones) {
        const fecha = af.fecha_dicho ?? nota.fecha;
        if (!dentroDeRango(fecha, opciones.desde, opciones.hasta)) continue;
        const tema = resolverTema(af.tema, temasValidos);
        obtener(tema).afirmaciones.push({
          nota: { id: nota.id, medio: nota.medio, fecha: nota.fecha, url: nota.url },
          cita: af.cita,
          tipo: af.tipo,
          dato: af.dato,
          atribucion: af.atribucion,
          fecha,
        });
      }
    } else if (nota.relevancia === 'central' || nota.relevancia === 'secundaria') {
      if (!dentroDeRango(nota.fecha, opciones.desde, opciones.hasta)) continue;
      for (const tema of temasDeNota(nota.temasNota, temasValidos)) {
        obtener(tema).cobertura.set(nota.id, { id: nota.id, medio: nota.medio, fecha: nota.fecha, url: nota.url, relevancia: nota.relevancia });
      }
    }
  }

  // Señal de calidad de todo el político (docs/plan-catalogo.md: "cuántas afirmaciones no tienen
  // tema válido" en el informe corto): se mide ANTES de aplicar --tema, no es parte del recorte.
  const afirmacionesSinTemaValido = porTema.get(SIN_TEMA)?.afirmaciones.length ?? 0;

  const clavesTemas = opciones.tema ? (porTema.has(opciones.tema) ? [opciones.tema] : []) : [...porTema.keys()];

  const temas: Record<string, TemaCatalogo> = {};
  const lotes: LoteCatalogo[] = [];
  const notasUnicas = new Set<string>();
  const mediosGlobales = new Set<string>();
  let afirmacionesTotales = 0;

  for (const tema of clavesTemas) {
    const acc = porTema.get(tema)!;
    const afirmacionesOrdenadas = [...acc.afirmaciones].sort((a, b) => compararFechas(a.fecha, b.fecha));
    const coberturaOrdenada = [...acc.cobertura.values()].sort((a, b) => compararFechas(a.fecha, b.fecha));

    const porTipo: Record<TipoAfirmacion, number> = { dato: 0, promesa: 0, posicion: 0, mencion_a: 0 };
    const mediosTema = new Set<string>();
    const fechasTema: string[] = [];
    const notasTema = new Set<string>();
    for (const a of afirmacionesOrdenadas) {
      porTipo[a.tipo]++;
      if (a.nota.medio) {
        mediosTema.add(a.nota.medio);
        mediosGlobales.add(a.nota.medio);
      }
      if (a.fecha) fechasTema.push(a.fecha);
      notasTema.add(a.nota.id);
      notasUnicas.add(a.nota.id);
    }
    for (const n of coberturaOrdenada) {
      if (n.medio) {
        mediosTema.add(n.medio);
        mediosGlobales.add(n.medio);
      }
      if (n.fecha) fechasTema.push(n.fecha);
      notasTema.add(n.id);
      notasUnicas.add(n.id);
    }
    fechasTema.sort();
    afirmacionesTotales += afirmacionesOrdenadas.length;

    temas[tema] = {
      afirmaciones: afirmacionesOrdenadas,
      notas_cobertura: coberturaOrdenada,
      resumen: {
        notas: notasTema.size,
        por_tipo: porTipo,
        primer_dicho: fechasTema[0] ?? null,
        ultimo_dicho: fechasTema[fechasTema.length - 1] ?? null,
        medios_distintos: mediosTema.size,
      },
    };

    lotes.push(...armarLotesDeTema(tema, afirmacionesOrdenadas, coberturaOrdenada));
  }

  // Ordenados por cantidad de "dato" primero (docs/plan-catalogo.md: "el Veracímetro primero");
  // el resto de las claves es solo para que el orden sea estable en los tests.
  lotes.sort((a, b) => b.datos - a.datos || a.tema.localeCompare(b.tema) || a.periodo.desde.localeCompare(b.periodo.desde));

  return {
    politico,
    generado: new Date().toISOString(),
    filtros: { desde: opciones.desde ?? null, hasta: opciones.hasta ?? null, tema: opciones.tema ?? null },
    notas_totales: notasUnicas.size,
    afirmaciones_totales: afirmacionesTotales,
    afirmaciones_sin_tema_valido: afirmacionesSinTemaValido,
    medios_distintos: mediosGlobales.size,
    temas,
    lotes,
  };
}

// ---------------------------------------------------------------------------
// Índice + notas: lo único que toca disco. Recibe la carpeta de notas explícita (como
// `origenDeMedio(slug, carpetaMedios)` en catalogo-descubrir.ts) para poder probarse contra un
// corpus temporal sin tocar `RUTAS_CORPUS` real.
// ---------------------------------------------------------------------------

/** IDs de nota candidatos para un político: los que lo mencionan, o que ya le sacaron una afirmación. */
export function idsQueMencionan(indice: Indice, politico: string): string[] {
  const filas = indice.db
    .prepare('SELECT DISTINCT nota FROM (SELECT nota FROM menciones WHERE politico = ? UNION SELECT nota FROM afirmaciones WHERE politico = ?)')
    .all(politico, politico) as { nota: string }[];
  return filas.map((f) => f.nota);
}

export function leerNotaDeCarpeta(id: string, carpetaNotas: string): Nota | null {
  const ruta = join(carpetaNotas, `${id}.json`);
  if (!existsSync(ruta)) return null;
  try {
    return JSON.parse(readFileSync(ruta, 'utf8')) as Nota;
  } catch (e) {
    log.aviso(`nota ilegible ${id}.json: ${(e as Error).message}`);
    return null;
  }
}

/** El índice da la lista de candidatas; cada nota se lee de la carpeta para el detalle del catálogo. */
export function recolectarNotas(indice: Indice, politico: string, carpetaNotas: string = RUTAS_CORPUS.notas): NotaParaInforme[] {
  const salida: NotaParaInforme[] = [];
  for (const id of idsQueMencionan(indice, politico)) {
    const nota = leerNotaDeCarpeta(id, carpetaNotas);
    if (nota) salida.push(notaParaInforme(nota, politico));
  }
  return salida;
}

/** Escribe `data/catalogo/<politico>.json` (público: rastro de qué se barrió). Devuelve la ruta. */
export function escribirCatalogo(politico: string, informe: InformeCatalogo, carpeta: string = RUTAS_CATALOGO.carpeta): string {
  mkdirSync(carpeta, { recursive: true });
  const ruta = join(carpeta, `${politico}.json`);
  writeFileSync(ruta, JSON.stringify(informe, null, 1) + '\n', 'utf8');
  return ruta;
}

// ---------------------------------------------------------------------------
// Informe corto de consola.
// ---------------------------------------------------------------------------

const NOMBRES_TIPO: Record<TipoAfirmacion, string> = { dato: 'dato', promesa: 'promesa', posicion: 'posición', mencion_a: 'mención' };

export function formatearInformeTexto(informe: InformeCatalogo): string {
  const lineas: string[] = [];
  const alcance = [
    informe.filtros.tema ? `tema ${informe.filtros.tema}` : null,
    informe.filtros.desde || informe.filtros.hasta ? `${informe.filtros.desde ?? '…'} a ${informe.filtros.hasta ?? '…'}` : null,
  ].filter(Boolean);
  lineas.push(`catálogo de ${informe.politico}${alcance.length ? ` (${alcance.join(' · ')})` : ''}`);
  lineas.push(`${informe.notas_totales} nota(s) · ${informe.afirmaciones_totales} afirmación(es) · ${informe.medios_distintos} medio(s) distinto(s)`);
  lineas.push(`${informe.afirmaciones_sin_tema_valido} afirmación(es) sin tema válido`);
  lineas.push('');
  lineas.push('temas:');
  const temasOrdenados = Object.entries(informe.temas).sort(([, a], [, b]) => b.afirmaciones.length - a.afirmaciones.length || b.resumen.notas - a.resumen.notas);
  if (!temasOrdenados.length) lineas.push('  (ninguno)');
  for (const [tema, t] of temasOrdenados) {
    const porTipo = (Object.keys(NOMBRES_TIPO) as TipoAfirmacion[]).map((tp) => `${t.resumen.por_tipo[tp]} ${NOMBRES_TIPO[tp]}`).join(', ');
    lineas.push(`  ${tema}: ${t.afirmaciones.length} afirmación(es) (${porTipo}) · ${t.resumen.notas} nota(s) · ${t.resumen.medios_distintos} medio(s) · ${t.resumen.primer_dicho ?? '?'} a ${t.resumen.ultimo_dicho ?? '?'}`);
  }
  lineas.push('');
  lineas.push('lotes propuestos:');
  if (!informe.lotes.length) lineas.push('  (ninguno)');
  for (const l of informe.lotes) {
    lineas.push(`  ${l.tema} · ${l.periodo.desde || '?'} a ${l.periodo.hasta || '?'} · ${l.notas} nota(s) · ${l.datos} dato(s) · ${l.promesas} promesa(s)`);
  }
  return lineas.join('\n');
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const USO = 'Uso: pnpm catalogo <politico> [--desde AAAA-MM] [--hasta AAAA-MM] [--tema <slug>] [--json]\n';

async function main(): Promise<void> {
  const { posicionales, opciones } = parsearArgs(process.argv.slice(2));
  const politico = posicionales[0];
  if (!politico) {
    process.stderr.write(USO);
    process.exit(2);
  }
  const desde = typeof opciones.desde === 'string' ? opciones.desde : undefined;
  const hasta = typeof opciones.hasta === 'string' ? opciones.hasta : undefined;
  const tema = typeof opciones.tema === 'string' ? opciones.tema : undefined;

  const taxonomia = cargarTaxonomia();
  const temasValidos = new Set(taxonomia.temas.map((t) => t.slug));

  const indice = abrirIndice({ soloLectura: true });
  let notas: NotaParaInforme[];
  try {
    notas = recolectarNotas(indice, politico);
  } finally {
    indice.cerrar();
  }

  const informe = armarInforme(politico, notas, temasValidos, { desde, hasta, tema });
  const ruta = escribirCatalogo(politico, informe);
  log.ok(`escrito ${relative(RAIZ, ruta)} (${informe.notas_totales} nota(s), ${informe.afirmaciones_totales} afirmación(es))`);

  if (opciones.json) process.stdout.write(JSON.stringify(informe, null, 1) + '\n');
  else process.stdout.write(formatearInformeTexto(informe) + '\n');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    log.error((e as Error).message);
    process.exit(1);
  });
}
