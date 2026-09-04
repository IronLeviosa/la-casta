/**
 * Cobertura: cuánto de cada persona miramos, y con qué material.
 *
 * El sitio publica conteos de registros por persona. Un lector que ve 21
 * registros de una persona y 3 de otra concluye que la primera habló más,
 * prometió más o incumplió más. Esa conclusión sería falsa: la diferencia está
 * en qué temas investigamos y en cuánta prensa uruguaya de ese período
 * sobrevive en línea, no en la conducta de nadie. Por la Regla 0 el sitio no
 * puede fabricar esa asimetría con su propia cobertura, así que la mide y la
 * publica junto a los conteos.
 *
 * Este módulo tiene dos mitades:
 *
 *   1. El **motor de simetría**, que antes vivía dentro de
 *      `scripts/validadores/simetria.ts` y ahora es de acá: conteos por
 *      persona y por partido, normalizados por declaración investigada y por
 *      año de mandato, y qué políticos con mandato solapado faltan en cada
 *      tema. El validador sigue siendo su dueño editorial (formatea el
 *      informe y escribe `data/simetria.json`); acá está el cálculo, para que
 *      el sitio y el validador cuenten lo mismo con el mismo código.
 *
 *   2. La **cobertura** propiamente dicha: qué temas se investigaron de cada
 *      persona (una carpeta en `data/corridas/` alcanza, haya producido
 *      registros o no), cuántos registros salieron de cada uno, en qué rango
 *      de fechas están las fuentes que efectivamente se usaron, y cuántos
 *      registros hay por año de mandato.
 *
 * La distinción que hace todo el trabajo es de tres estados, no de dos:
 *
 *   - `sin_investigar`             — todavía no lo miramos. Un cero acá no dice nada de la persona.
 *   - `investigado_sin_hallazgos`  — lo miramos y no encontramos nada publicable. El cero es un resultado.
 *   - `con_registros`              — lo miramos y encontramos.
 *
 * No importa `astro:content` a propósito: lo usan las páginas del sitio y
 * también el validador, que corre bajo `tsx` sin Astro.
 */
import { existsSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ---------------------------------------------------------------------------
// Fechas (las comparte el validador; antes vivían en scripts/lib/contenido.ts)
// ---------------------------------------------------------------------------

export function hoyISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/** true si [d1, h1] y [d2, h2] se superponen (hasta abierto = hoy). */
export function seSuperponen(d1: string, h1: string | undefined, d2: string, h2: string | undefined): boolean {
  const H1 = h1 ?? '9999-12-31';
  const H2 = h2 ?? '9999-12-31';
  return d1 <= H2 && d2 <= H1;
}

/** Diferencia en años (decimal) entre dos fechas ISO. */
export function aniosEntre(desde: string, hasta: string | undefined): number {
  const a = new Date(desde).getTime();
  const b = new Date(hasta ?? hoyISO()).getTime();
  return Math.max(0, (b - a) / (365.25 * 24 * 3600 * 1000));
}

const ES_FECHA = /^\d{4}-\d{2}-\d{2}$/;

export function redondear(n: number, d = 2): number {
  const f = 10 ** d;
  return Math.round(n * f) / f;
}

// ---------------------------------------------------------------------------
// Entrada neutral
//
// Ni `CollectionEntry` (Astro) ni `Registro` (validador): la forma mínima que
// las dos mitades del proyecto pueden construir sin conocerse.
// ---------------------------------------------------------------------------

export interface MandatoMinimo {
  cargo?: string;
  desde: string;
  hasta?: string;
}

export interface PoliticoMinimo {
  id: string;
  nombre?: string;
  partido: string;
  mandatos: MandatoMinimo[];
}

export interface TemaMinimo {
  id: string;
  nombre?: string;
  padre?: string;
}

/** Un registro publicado, reducido a lo que la cobertura necesita contar. */
export interface RegistroMinimo {
  coleccion: string;
  id: string;
  /** Personas implicadas (varias solo en casos). */
  politicos: string[];
  tema?: string;
  /** Fecha del hecho. En giros, la de la declaración posterior. */
  fecha?: string;
  cambio?: unknown;
  explicacion?: unknown;
  calificacion?: unknown;
  etiqueta_legal?: unknown;
  estado?: unknown;
  /** Fechas de las fuentes citadas por el registro. */
  fechas_fuentes?: string[];
}

export interface EntradaSimetria {
  politicos: PoliticoMinimo[];
  registros: RegistroMinimo[];
}

// ---------------------------------------------------------------------------
// Motor de simetría
// ---------------------------------------------------------------------------

export interface Conteos {
  declaraciones: number;
  giros: { total: number; por_cambio: Record<string, number>; por_explicacion: Record<string, number> };
  chequeos: { total: number; por_calificacion: Record<string, number> };
  casos: { total: number; por_etiqueta_legal: Record<string, number> };
  promesas: { total: number; por_estado: Record<string, number> };
  menciones: number;
  /** Años de mandato acumulados (suma de los mandatos de la persona o del partido). */
  anios_mandato: number;
  /** Cantidad de personas agregadas (1 en por_politico). */
  politicos: number;
  normalizado: {
    /** Giros por declaración investigada. */
    giros_por_declaracion: number;
    /** Chequeos "falso" por declaración investigada. */
    falsos_por_declaracion: number;
    /** Promesas incumplidas por declaración investigada. */
    incumplidas_por_declaracion: number;
    /** Casos por declaración investigada. */
    casos_por_declaracion: number;
    /** Declaraciones investigadas por año de mandato. */
    declaraciones_por_anio: number;
  };
}

export interface EstadoTema {
  tema: string;
  desde: string | null;
  hasta: string | null;
  cubiertos: string[];
  /** Políticos con mandato solapado y cero registros en el tema. */
  sin_cubrir: string[];
}

export interface ResumenSimetria {
  generado: string;
  total_registros: number;
  por_partido: Record<string, Conteos>;
  por_politico: Record<string, Conteos>;
  temas: EstadoTema[];
}

export const CAMBIOS = ['sin_cambio', 'cambio_parcial', 'cambio_total'];
export const EXPLICACIONES = ['reconocido_explicitamente', 'justificado_por_contexto', 'sin_explicacion'];
export const CALIFICACIONES = ['verdadero', 'discutible', 'falso'];
export const ETIQUETAS_LEGALES = ['denuncia', 'formalizado', 'condena', 'cerrado_sin_condena'];
export const ESTADOS_PROMESA = ['cumplida', 'en_proceso_adelantada', 'en_proceso_demorada', 'incumplida'];

export function conteosVacios(): Conteos {
  const cero = (claves: string[]) => Object.fromEntries(claves.map((k) => [k, 0]));
  return {
    declaraciones: 0,
    giros: { total: 0, por_cambio: cero(CAMBIOS), por_explicacion: cero(EXPLICACIONES) },
    chequeos: { total: 0, por_calificacion: cero(CALIFICACIONES) },
    casos: { total: 0, por_etiqueta_legal: cero(ETIQUETAS_LEGALES) },
    promesas: { total: 0, por_estado: cero(ESTADOS_PROMESA) },
    menciones: 0,
    anios_mandato: 0,
    politicos: 0,
    normalizado: {
      giros_por_declaracion: 0,
      falsos_por_declaracion: 0,
      incumplidas_por_declaracion: 0,
      casos_por_declaracion: 0,
      declaraciones_por_anio: 0,
    },
  };
}

function cerrarNormalizado(c: Conteos): void {
  const d = c.declaraciones || 0;
  const div = (x: number) => (d > 0 ? redondear(x / d) : 0);
  c.normalizado = {
    giros_por_declaracion: div(c.giros.total),
    falsos_por_declaracion: div(c.chequeos.por_calificacion.falso ?? 0),
    incumplidas_por_declaracion: div(c.promesas.por_estado.incumplida ?? 0),
    casos_por_declaracion: div(c.casos.total),
    declaraciones_por_anio: c.anios_mandato > 0 ? redondear(d / c.anios_mandato) : 0,
  };
  c.anios_mandato = redondear(c.anios_mandato, 1);
}

/**
 * Conteos por persona y por partido, y qué políticos faltan en cada tema.
 * Es el cálculo de la etapa 6 del validador; el formato del informe y la
 * escritura de `data/simetria.json` siguen en `scripts/validadores/simetria.ts`.
 */
export function calcularResumen(entrada: EntradaSimetria): ResumenSimetria {
  const porPolitico = new Map<string, Conteos>();
  const partidoDe = new Map<string, string>();
  const mandatosDe = new Map<string, MandatoMinimo[]>();

  for (const p of entrada.politicos) {
    porPolitico.set(p.id, conteosVacios());
    partidoDe.set(p.id, p.partido || 'sin partido');
    mandatosDe.set(
      p.id,
      p.mandatos.map((m) => ({ desde: m.desde, hasta: m.hasta })),
    );
    const c = porPolitico.get(p.id)!;
    c.politicos = 1;
    for (const m of mandatosDe.get(p.id)!) c.anios_mandato += aniosEntre(m.desde, m.hasta);
  }

  const paraPolitico = (slug: string): Conteos => {
    if (!porPolitico.has(slug)) {
      porPolitico.set(slug, conteosVacios());
      partidoDe.set(slug, 'sin partido');
    }
    return porPolitico.get(slug)!;
  };

  const sumar = (mapa: Record<string, number>, clave: unknown): void => {
    const k = String(clave ?? 'sin_dato');
    mapa[k] = (mapa[k] ?? 0) + 1;
  };

  // Cobertura por tema: quién tiene algo y en qué rango de fechas.
  const cobertura = new Map<string, { politicos: Set<string>; desde: string | null; hasta: string | null }>();
  const anotarTema = (tema: unknown, slug: string, fecha: unknown): void => {
    if (typeof tema !== 'string' || !tema) return;
    if (!cobertura.has(tema)) cobertura.set(tema, { politicos: new Set(), desde: null, hasta: null });
    const c = cobertura.get(tema)!;
    c.politicos.add(slug);
    if (typeof fecha === 'string' && ES_FECHA.test(fecha)) {
      if (!c.desde || fecha < c.desde) c.desde = fecha;
      if (!c.hasta || fecha > c.hasta) c.hasta = fecha;
    }
  };

  let total = 0;
  for (const reg of entrada.registros) {
    const slugs = reg.politicos;
    if (!slugs.length) continue;
    switch (reg.coleccion) {
      case 'declaraciones':
        total++;
        for (const s of slugs) paraPolitico(s).declaraciones++;
        anotarTema(reg.tema, slugs[0]!, reg.fecha);
        break;
      case 'giros':
        total++;
        for (const s of slugs) {
          const c = paraPolitico(s);
          c.giros.total++;
          sumar(c.giros.por_cambio, reg.cambio);
          sumar(c.giros.por_explicacion, reg.explicacion);
        }
        anotarTema(reg.tema, slugs[0]!, reg.fecha);
        break;
      case 'chequeos':
        total++;
        for (const s of slugs) {
          const c = paraPolitico(s);
          c.chequeos.total++;
          sumar(c.chequeos.por_calificacion, reg.calificacion);
        }
        anotarTema(reg.tema, slugs[0]!, reg.fecha);
        break;
      case 'promesas':
        total++;
        for (const s of slugs) {
          const c = paraPolitico(s);
          c.promesas.total++;
          sumar(c.promesas.por_estado, reg.estado);
        }
        anotarTema(reg.tema, slugs[0]!, reg.fecha);
        break;
      case 'casos':
        total++;
        for (const s of slugs) {
          const c = paraPolitico(s);
          c.casos.total++;
          sumar(c.casos.por_etiqueta_legal, reg.etiqueta_legal);
        }
        break;
      case 'menciones':
        total++;
        for (const s of slugs) paraPolitico(s).menciones++;
        break;
      default:
        break;
    }
  }

  // Temas: quién falta.
  const temas: EstadoTema[] = [];
  for (const [tema, c] of [...cobertura.entries()].sort()) {
    const sinCubrir: string[] = [];
    for (const [slug, mandatos] of mandatosDe) {
      if (c.politicos.has(slug)) continue;
      const solapa = c.desde && c.hasta ? mandatos.some((m) => seSuperponen(m.desde, m.hasta, c.desde!, c.hasta!)) : mandatos.length > 0;
      if (solapa) sinCubrir.push(slug);
    }
    temas.push({ tema, desde: c.desde, hasta: c.hasta, cubiertos: [...c.politicos].sort(), sin_cubrir: sinCubrir.sort() });
  }

  // Agregado por partido.
  const porPartido = new Map<string, Conteos>();
  for (const [slug, c] of porPolitico) {
    const partido = partidoDe.get(slug) ?? 'sin partido';
    if (!porPartido.has(partido)) porPartido.set(partido, conteosVacios());
    const p = porPartido.get(partido)!;
    p.declaraciones += c.declaraciones;
    p.menciones += c.menciones;
    p.anios_mandato += c.anios_mandato;
    p.politicos += c.politicos;
    p.giros.total += c.giros.total;
    p.chequeos.total += c.chequeos.total;
    p.casos.total += c.casos.total;
    p.promesas.total += c.promesas.total;
    for (const k of CAMBIOS) p.giros.por_cambio[k]! += c.giros.por_cambio[k] ?? 0;
    for (const k of EXPLICACIONES) p.giros.por_explicacion[k]! += c.giros.por_explicacion[k] ?? 0;
    for (const k of CALIFICACIONES) p.chequeos.por_calificacion[k]! += c.chequeos.por_calificacion[k] ?? 0;
    for (const k of ETIQUETAS_LEGALES) p.casos.por_etiqueta_legal[k]! += c.casos.por_etiqueta_legal[k] ?? 0;
    for (const k of ESTADOS_PROMESA) p.promesas.por_estado[k]! += c.promesas.por_estado[k] ?? 0;
  }

  for (const c of porPolitico.values()) cerrarNormalizado(c);
  for (const c of porPartido.values()) cerrarNormalizado(c);

  const ordenado = <T>(m: Map<string, T>): Record<string, T> => Object.fromEntries([...m.entries()].sort(([a], [b]) => (a < b ? -1 : 1)));

  return {
    generado: new Date().toISOString(),
    total_registros: total,
    por_partido: ordenado(porPartido),
    por_politico: ordenado(porPolitico),
    temas,
  };
}

// ---------------------------------------------------------------------------
// Corridas: qué se investigó, haya salido algo o no
//
// Una carpeta `data/corridas/<fecha>-<politico>-<tema>` es la prueba de que el
// tema se miró. Que no haya registros publicados de esa corrida es un
// resultado ("investigado, sin hallazgos"), no un hueco.
// ---------------------------------------------------------------------------

export interface Corrida {
  id: string;
  fecha: string;
  politico: string;
  /** Id del tema (con `/`), o el fragmento crudo si no coincide con ningún tema conocido. */
  tema: string;
  /** false si el fragmento de tema no corresponde a un tema de la taxonomía. */
  temaConocido: boolean;
}

const PATRON_CORRIDA = /^(\d{4}-\d{2}-\d{2})-(.+)$/;

/** Raíz del repositorio, deducida de la ubicación de este archivo (src/lib/). */
export function raizRepo(): string {
  return path.resolve(fileURLToPath(new URL('../../', import.meta.url)));
}

/**
 * Lee `data/corridas/` y reconstruye político y tema de cada id.
 *
 * El id se arma como `<fecha>-<politico>-<tema con / → ->`, y tanto el slug del
 * político como el del tema llevan guiones, así que el corte no es ambiguo por
 * sintaxis: se resuelve contra las listas conocidas, con el prefijo más largo.
 */
export function listarCorridas(politicos: string[], temas: string[], rootDir = raizRepo()): Corrida[] {
  const base = path.join(rootDir, 'data', 'corridas');
  if (!existsSync(base)) return [];
  const porLargo = [...politicos].sort((a, b) => b.length - a.length);
  const temaPorSlug = new Map(temas.map((t) => [t.replaceAll('/', '-'), t]));
  const salida: Corrida[] = [];
  for (const nombre of readdirSync(base).sort()) {
    if (!statSync(path.join(base, nombre)).isDirectory()) continue;
    const m = PATRON_CORRIDA.exec(nombre);
    if (!m) continue;
    const [, fecha, resto] = m as unknown as [string, string, string];
    const politico = porLargo.find((p) => resto === p || resto.startsWith(`${p}-`));
    if (!politico) continue;
    const crudo = resto.slice(politico.length + 1);
    if (!crudo) continue;
    const tema = temaPorSlug.get(crudo);
    salida.push({ id: nombre, fecha, politico, tema: tema ?? crudo, temaConocido: tema !== undefined });
  }
  return salida;
}

// ---------------------------------------------------------------------------
// Cobertura
// ---------------------------------------------------------------------------

export type EstadoCobertura = 'sin_investigar' | 'investigado_sin_hallazgos' | 'con_registros';

export const TEXTO_ESTADO: Record<EstadoCobertura, string> = {
  sin_investigar: 'Todavía no investigado',
  investigado_sin_hallazgos: 'Investigado, sin hallazgos',
  con_registros: 'Investigado, con registros',
};

/** Una celda de la matriz político × tema. */
export interface CeldaCobertura {
  politico: string;
  tema: string;
  estado: EstadoCobertura;
  corridas: Corrida[];
  /** Fecha de la corrida más reciente, o null. */
  investigadoEl: string | null;
  total: number;
  por_coleccion: Record<string, number>;
}

/** Un período de la persona (un mandato, o el tiempo fuera del cargo). */
export interface PeriodoCobertura {
  etiqueta: string;
  desde: string;
  /** null = abierto (sigue en el cargo, o "hasta hoy"). */
  hasta: string | null;
  /** true si es un mandato; false si es el tiempo fuera del cargo. */
  mandato: boolean;
  anios: number;
  registros: number;
  registros_por_anio: number;
}

export interface RangoFuentes {
  n: number;
  desde: string | null;
  hasta: string | null;
}

export interface CoberturaPolitico {
  politico: string;
  nombre: string;
  partido: string;
  total: number;
  por_coleccion: Record<string, number>;
  celdas: CeldaCobertura[];
  temas_con_registros: string[];
  temas_sin_hallazgos: string[];
  /** Investigados: con registros o sin hallazgos. */
  temas_investigados: string[];
  temas_sin_investigar: string[];
  /** Rango de fechas de las fuentes efectivamente citadas. */
  fuentes: RangoFuentes;
  anios_mandato: number;
  registros_por_anio: number;
  periodos: PeriodoCobertura[];
  corridas: Corrida[];
  /** Fecha de la corrida más reciente de esta persona. */
  ultima_corrida: string | null;
}

export interface ResumenCobertura {
  generado: string;
  /** Temas de la taxonomía, en orden jerárquico (padre, después hijos). */
  temas: TemaMinimo[];
  politicos: CoberturaPolitico[];
  corridas: Corrida[];
  /** Colecciones contadas, en el orden en que se muestran. */
  colecciones: string[];
}

export interface EntradaCobertura extends EntradaSimetria {
  temas: TemaMinimo[];
  corridas: Corrida[];
}

/** Colecciones que se cuentan como "registros sobre una persona". */
export const COLECCIONES_CONTADAS = [
  'declaraciones',
  'giros',
  'promesas',
  'chequeos',
  'casos',
  'menciones',
  'intervenciones',
  'patrimonio',
] as const;

/** Temas ordenados jerárquicamente: cada padre seguido de sus hijos, alfabético. */
export function ordenarTemas(temas: TemaMinimo[]): TemaMinimo[] {
  const porNombre = (a: TemaMinimo, b: TemaMinimo) => (a.nombre ?? a.id).localeCompare(b.nombre ?? b.id, 'es');
  const raices = temas.filter((t) => !t.padre).sort(porNombre);
  const salida: TemaMinimo[] = [];
  const agregar = (t: TemaMinimo): void => {
    salida.push(t);
    for (const h of temas.filter((x) => x.padre === t.id).sort(porNombre)) agregar(h);
  };
  for (const r of raices) agregar(r);
  // Temas huérfanos (padre inexistente): no se pierden.
  for (const t of temas.sort(porNombre)) if (!salida.includes(t)) salida.push(t);
  return salida;
}

/** true si `tema` es `raiz` o un descendiente suyo (misma regla que /temas/<slug>/). */
export function alcanza(raiz: string, tema: string | undefined): boolean {
  return !!tema && (tema === raiz || tema.startsWith(`${raiz}/`));
}

function ceroPorColeccion(): Record<string, number> {
  return Object.fromEntries(COLECCIONES_CONTADAS.map((c) => [c, 0]));
}

/** Rango de fechas de las fuentes citadas por un conjunto de registros. */
function rangoFuentes(registros: RegistroMinimo[]): RangoFuentes {
  let desde: string | null = null;
  let hasta: string | null = null;
  let n = 0;
  for (const r of registros) {
    for (const f of r.fechas_fuentes ?? []) {
      if (!ES_FECHA.test(f)) continue;
      n++;
      if (!desde || f < desde) desde = f;
      if (!hasta || f > hasta) hasta = f;
    }
  }
  return { n, desde, hasta };
}

/** Períodos de una persona: un mandato por banda, más los huecos entre y después. */
function periodosDe(p: PoliticoMinimo, registros: RegistroMinimo[]): PeriodoCobertura[] {
  const mandatos = [...p.mandatos].sort((a, b) => a.desde.localeCompare(b.desde));
  if (!mandatos.length) return [];
  const hoy = hoyISO();
  const bandas: { etiqueta: string; desde: string; hasta: string | null; mandato: boolean }[] = [];

  const primero = mandatos[0]!;
  if (registros.some((r) => r.fecha && r.fecha < primero.desde)) {
    bandas.push({ etiqueta: 'Antes del primer mandato', desde: '0000-01-01', hasta: primero.desde, mandato: false });
  }
  mandatos.forEach((m, i) => {
    const hasta = m.hasta ?? null;
    const anios = `${m.desde.slice(0, 4)}–${hasta ? hasta.slice(0, 4) : 'hoy'}`;
    bandas.push({ etiqueta: `${m.cargo ?? 'Mandato'}, ${anios}`, desde: m.desde, hasta, mandato: true });
    const sig = mandatos[i + 1];
    if (hasta && sig && sig.desde > hasta) bandas.push({ etiqueta: `Fuera del cargo, ${hasta.slice(0, 4)}–${sig.desde.slice(0, 4)}`, desde: hasta, hasta: sig.desde, mandato: false });
  });
  const ultimo = mandatos[mandatos.length - 1]!;
  if (ultimo.hasta && ultimo.hasta < hoy) {
    bandas.push({ etiqueta: `Después del último mandato, desde ${ultimo.hasta.slice(0, 4)}`, desde: ultimo.hasta, hasta: null, mandato: false });
  }

  return bandas.map((b) => {
    const dentro = registros.filter((r) => !!r.fecha && r.fecha >= b.desde && (b.hasta === null || r.fecha < b.hasta));
    const desde = b.desde === '0000-01-01' ? (dentro.map((r) => r.fecha!).sort()[0] ?? b.hasta ?? hoy) : b.desde;
    const anios = redondear(aniosEntre(desde, b.hasta ?? hoy), 1);
    return {
      etiqueta: b.etiqueta,
      desde,
      hasta: b.hasta,
      mandato: b.mandato,
      anios,
      registros: dentro.length,
      registros_por_anio: anios > 0 ? redondear(dentro.length / anios) : 0,
    };
  });
}

/**
 * Cobertura por persona, tema y período.
 *
 * Un tema cuenta como investigado si hay una corrida suya (o de un subtema)
 * para esa persona, produzca registros o no. Los conteos por celda agregan el
 * tema y sus descendientes, igual que hace `/temas/<slug>/`.
 */
export function calcularCobertura(entrada: EntradaCobertura): ResumenCobertura {
  const temas = ordenarTemas(entrada.temas);
  const politicos: CoberturaPolitico[] = [];

  for (const p of entrada.politicos) {
    const mios = entrada.registros.filter((r) => r.politicos.includes(p.id));
    const corridas = entrada.corridas.filter((c) => c.politico === p.id).sort((a, b) => a.id.localeCompare(b.id));

    const celdas: CeldaCobertura[] = temas.map((t) => {
      const deTema = mios.filter((r) => alcanza(t.id, r.tema));
      const corridasTema = corridas.filter((c) => alcanza(t.id, c.tema));
      const por_coleccion = ceroPorColeccion();
      for (const r of deTema) por_coleccion[r.coleccion] = (por_coleccion[r.coleccion] ?? 0) + 1;
      const estado: EstadoCobertura = deTema.length > 0 ? 'con_registros' : corridasTema.length > 0 ? 'investigado_sin_hallazgos' : 'sin_investigar';
      return {
        politico: p.id,
        tema: t.id,
        estado,
        corridas: corridasTema,
        investigadoEl: corridasTema.map((c) => c.fecha).sort().at(-1) ?? null,
        total: deTema.length,
        por_coleccion,
      };
    });

    const por_coleccion = ceroPorColeccion();
    for (const r of mios) por_coleccion[r.coleccion] = (por_coleccion[r.coleccion] ?? 0) + 1;
    const anios_mandato = redondear(
      p.mandatos.reduce((a, m) => a + aniosEntre(m.desde, m.hasta), 0),
      1,
    );

    /* Solo las hojas cuentan para "cuántos temas": si contáramos también los
       padres, un tema investigado sumaría dos y el denominador mentiría. */
    const hojas = celdas.filter((c) => !temas.some((t) => t.padre === c.tema));

    politicos.push({
      politico: p.id,
      nombre: p.nombre ?? p.id,
      partido: p.partido,
      total: mios.length,
      por_coleccion,
      celdas,
      temas_con_registros: hojas.filter((c) => c.estado === 'con_registros').map((c) => c.tema),
      temas_sin_hallazgos: hojas.filter((c) => c.estado === 'investigado_sin_hallazgos').map((c) => c.tema),
      temas_investigados: hojas.filter((c) => c.estado !== 'sin_investigar').map((c) => c.tema),
      temas_sin_investigar: hojas.filter((c) => c.estado === 'sin_investigar').map((c) => c.tema),
      fuentes: rangoFuentes(mios),
      anios_mandato,
      registros_por_anio: anios_mandato > 0 ? redondear(mios.length / anios_mandato) : 0,
      periodos: periodosDe(p, mios),
      corridas,
      ultima_corrida: corridas.map((c) => c.fecha).sort().at(-1) ?? null,
    });
  }

  return {
    generado: new Date().toISOString(),
    temas,
    politicos,
    corridas: entrada.corridas,
    colecciones: [...COLECCIONES_CONTADAS],
  };
}

export function coberturaDe(resumen: ResumenCobertura, slug: string): CoberturaPolitico | undefined {
  return resumen.politicos.find((p) => p.politico === slug);
}

/**
 * Temas investigados en **todas** las personas de la lista. Es el único
 * conjunto donde comparar conteos entre personas significa algo.
 */
export function temasComparables(resumen: ResumenCobertura, slugs: string[]): string[] {
  const fichas = slugs.map((s) => coberturaDe(resumen, s)).filter((f): f is CoberturaPolitico => !!f);
  if (fichas.length < 2) return [];
  const [primera, ...resto] = fichas as [CoberturaPolitico, ...CoberturaPolitico[]];
  return primera.temas_investigados.filter((t) => resto.every((f) => f.temas_investigados.includes(t)));
}

/** Rango de años de los mandatos de una persona, para decir de qué período hablamos. */
export function rangoMandatos(p: PoliticoMinimo): { desde: string; hasta: string } | null {
  if (!p.mandatos.length) return null;
  const desde = p.mandatos.map((m) => m.desde).sort()[0]!;
  const hasta = p.mandatos.some((m) => !m.hasta) ? hoyISO() : p.mandatos.map((m) => m.hasta!).sort().at(-1)!;
  return { desde, hasta };
}

// ---------------------------------------------------------------------------
// Adaptador para las páginas del sitio
//
// Toma las colecciones tal como las devuelve `getCollection` (estructuralmente,
// sin importar `astro:content`, para que este módulo siga sirviendo al
// validador) y arma la entrada neutral.
// ---------------------------------------------------------------------------

interface EntradaColeccion {
  id: string;
  data: Record<string, any>;
}

export interface ColeccionesCobertura {
  politicos: EntradaColeccion[];
  temas: EntradaColeccion[];
  declaraciones?: EntradaColeccion[];
  giros?: EntradaColeccion[];
  promesas?: EntradaColeccion[];
  chequeos?: EntradaColeccion[];
  casos?: EntradaColeccion[];
  menciones?: EntradaColeccion[];
  intervenciones?: EntradaColeccion[];
  patrimonio?: EntradaColeccion[];
}

/** `{ id }` (referencia de Astro) o `'slug'` (YAML crudo) → slug. */
function refId(v: unknown): string | undefined {
  if (typeof v === 'string') return v;
  if (v && typeof v === 'object' && typeof (v as { id?: unknown }).id === 'string') return (v as { id: string }).id;
  return undefined;
}

/** Fechas de todos los objetos con forma de Fuente que cuelgan de un registro. */
export function fechasDeFuentes(datos: unknown, salida: string[] = []): string[] {
  if (!datos || typeof datos !== 'object') return salida;
  if (Array.isArray(datos)) {
    for (const v of datos) fechasDeFuentes(v, salida);
    return salida;
  }
  const o = datos as Record<string, unknown>;
  if (typeof o.url === 'string' && typeof o.cita === 'string' && typeof o.fecha === 'string') {
    salida.push(o.fecha);
    return salida;
  }
  for (const v of Object.values(o)) fechasDeFuentes(v, salida);
  return salida;
}

/** Fecha del hecho de un registro, según su colección. */
function fechaDe(coleccion: string, d: Record<string, any>, fechaGiro?: string): string | undefined {
  switch (coleccion) {
    case 'giros':
      return fechaGiro;
    case 'promesas':
      return typeof d.fecha_promesa === 'string' ? d.fecha_promesa : undefined;
    case 'casos': {
      const etapas = Array.isArray(d.estado_judicial) ? d.estado_judicial : [];
      const fechas = etapas.map((e: { fecha?: string }) => e?.fecha).filter((f: unknown): f is string => typeof f === 'string');
      return fechas.sort()[0];
    }
    default:
      return typeof d.fecha === 'string' ? d.fecha : undefined;
  }
}

function politicosDe(coleccion: string, d: Record<string, any>): string[] {
  if (coleccion === 'casos') {
    const inv = Array.isArray(d.involucrados) ? d.involucrados : [];
    return inv.map((i: { politico?: unknown }) => refId(i?.politico)).filter((s: string | undefined): s is string => !!s);
  }
  const uno = refId(d.politico);
  return uno ? [uno] : [];
}

/** Entrada neutral desde las colecciones de Astro. */
export function entradaDesdeColecciones(cols: ColeccionesCobertura, corridas: Corrida[]): EntradaCobertura {
  const politicos: PoliticoMinimo[] = cols.politicos.map((p) => ({
    id: p.id,
    nombre: p.data.nombre_corto ?? p.data.nombre ?? p.id,
    partido: String(p.data.partido ?? 'sin partido'),
    mandatos: (Array.isArray(p.data.mandatos) ? p.data.mandatos : []).map((m: MandatoMinimo) => ({ cargo: m.cargo, desde: m.desde, hasta: m.hasta })),
  }));
  const temas: TemaMinimo[] = cols.temas.map((t) => ({ id: t.id, nombre: t.data.nombre ?? t.id, padre: refId(t.data.padre) }));

  const fechaDeclaracion = new Map((cols.declaraciones ?? []).map((d) => [d.id, d.data.fecha as string | undefined]));
  const registros: RegistroMinimo[] = [];
  for (const coleccion of COLECCIONES_CONTADAS) {
    for (const e of cols[coleccion] ?? []) {
      const d = e.data;
      const fechaGiro = coleccion === 'giros' ? fechaDeclaracion.get(refId(d.declaracion_despues) ?? '') : undefined;
      registros.push({
        coleccion,
        id: e.id,
        politicos: politicosDe(coleccion, d),
        tema: refId(d.tema),
        fecha: fechaDe(coleccion, d, fechaGiro),
        cambio: d.cambio,
        explicacion: d.explicacion,
        calificacion: d.calificacion,
        etiqueta_legal: d.etiqueta_legal,
        estado: d.estado,
        fechas_fuentes: fechasDeFuentes(d),
      });
    }
  }
  return { politicos, temas, registros, corridas };
}

/** Cobertura completa desde las colecciones de Astro, leyendo `data/corridas/`. */
export function resumenCobertura(cols: ColeccionesCobertura, rootDir = raizRepo()): ResumenCobertura {
  const corridas = listarCorridas(
    cols.politicos.map((p) => p.id),
    cols.temas.map((t) => t.id),
    rootDir,
  );
  return calcularCobertura(entradaDesdeColecciones(cols, corridas));
}
