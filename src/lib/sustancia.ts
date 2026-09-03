/**
 * Índice de sustancia, índice de evasión y ratio de mentiras.
 *
 * Se calculan en build a partir de `intervenciones` (tier publicado) y
 * `chequeos`. Se publican recién con n ≥ 10 intervenciones y ≥ 10 000
 * palabras por político; antes, "muestra insuficiente".
 *
 * - Sustancia = fracción de palabras en hecho_verificable + propuesta_concreta
 *   (ponderada por especificidad 1..3 → 1/3..1) + argumento. Se muestra la
 *   distribución completa por clase, nunca un número solo.
 * - Evasión (solo formato con_preguntas): preguntas no respondidas o
 *   parcialmente respondidas sobre preguntas hechas, con desglose por subtipo
 *   de Bull y Mayer (1993).
 * - Ratio de mentiras, con dos denominadores y solo sobre intervenciones
 *   chequeadas exhaustivamente: falsos por 1000 palabras y falsos sobre
 *   afirmaciones chequeadas.
 * - Intervalo de confianza bootstrap al 95 % remuestreando intervenciones
 *   (B = 1000, generador determinista para que el build sea reproducible).
 */

export const CLASES = [
  'hecho_verificable',
  'propuesta_concreta',
  'argumento',
  'posicion',
  'retorica',
  'ataque',
  'evasion',
  'otro',
] as const;
export type Clase = (typeof CLASES)[number];

export const CLASES_SUSTANCIA: readonly Clase[] = ['hecho_verificable', 'propuesta_concreta', 'argumento'];

export const MINIMO_INTERVENCIONES = 10;
export const MINIMO_PALABRAS = 10_000;

export interface SegmentoMinimo {
  palabras: number;
  clase: Clase;
  especificidad?: number;
  subtipo_evasion?: string;
  respuesta?: 'respondida' | 'parcial' | 'no_respondida';
}

export interface IntervencionMinima {
  id: string;
  fecha: string;
  formato: 'con_preguntas' | 'sin_preguntas';
  palabras: number;
  segmentos: SegmentoMinimo[];
  kappa: number;
  chequeo_exhaustivo: boolean;
}

export interface ChequeoMinimo {
  calificacion: 'verdadero' | 'discutible' | 'falso';
  exhaustivo: boolean;
  declaracion?: string;
}

export interface IntervaloConfianza {
  inferior: number;
  superior: number;
}

export interface DistribucionClase {
  clase: Clase;
  palabras: number;
  fraccion: number;
}

export interface ResumenSustancia {
  suficiente: boolean;
  nIntervenciones: number;
  palabras: number;
  faltan: { intervenciones: number; palabras: number };
  distribucion: DistribucionClase[];
  indice: number;
  ic: IntervaloConfianza;
  kappaPromedio: number;
  evasion: ResumenEvasion | null;
  mentiras: ResumenMentiras;
}

export interface ResumenEvasion {
  nIntervenciones: number;
  preguntas: number;
  respondidas: number;
  parciales: number;
  noRespondidas: number;
  /** (parciales + no respondidas) / preguntas */
  indice: number;
  ic: IntervaloConfianza;
  subtipos: { subtipo: string; n: number }[];
}

export interface ResumenMentiras {
  /** Intervenciones chequeadas exhaustivamente. */
  nIntervenciones: number;
  palabras: number;
  chequeos: number;
  falsos: number;
  /** falsos por cada 1000 palabras; NaN si no hay palabras. */
  porMilPalabras: number;
  /** falsos / chequeos exhaustivos; NaN si no hay chequeos. */
  porAfirmacion: number;
}

/** PRNG determinista (mulberry32) para que el bootstrap sea reproducible. */
function prng(semilla: number): () => number {
  let a = semilla >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pesoSustancia(s: SegmentoMinimo): number {
  if (s.clase === 'propuesta_concreta') return s.palabras * ((s.especificidad ?? 1) / 3);
  if (s.clase === 'hecho_verificable' || s.clase === 'argumento') return s.palabras;
  return 0;
}

function indiceDe(intervenciones: IntervencionMinima[]): number {
  let total = 0;
  let sustancia = 0;
  for (const i of intervenciones) {
    for (const s of i.segmentos) {
      total += s.palabras;
      sustancia += pesoSustancia(s);
    }
  }
  return total > 0 ? sustancia / total : Number.NaN;
}

/**
 * Bootstrap percentil al 95 %: remuestrea las unidades con reposición B veces
 * y toma los percentiles 2,5 y 97,5 del estadístico.
 */
export function bootstrapIC<T>(unidades: T[], estadistico: (muestra: T[]) => number, B = 1000, semilla = 20260903): IntervaloConfianza {
  if (unidades.length === 0) return { inferior: Number.NaN, superior: Number.NaN };
  const rnd = prng(semilla);
  const valores: number[] = [];
  for (let b = 0; b < B; b++) {
    const muestra: T[] = [];
    for (let k = 0; k < unidades.length; k++) muestra.push(unidades[Math.floor(rnd() * unidades.length)]!);
    const v = estadistico(muestra);
    if (Number.isFinite(v)) valores.push(v);
  }
  if (valores.length === 0) return { inferior: Number.NaN, superior: Number.NaN };
  valores.sort((x, y) => x - y);
  const q = (p: number) => valores[Math.min(valores.length - 1, Math.max(0, Math.floor(p * (valores.length - 1))))]!;
  return { inferior: q(0.025), superior: q(0.975) };
}

function evasionDe(intervenciones: IntervencionMinima[]): { preguntas: number; respondidas: number; parciales: number; no: number } {
  let preguntas = 0;
  let respondidas = 0;
  let parciales = 0;
  let no = 0;
  for (const i of intervenciones) {
    if (i.formato !== 'con_preguntas') continue;
    for (const s of i.segmentos) {
      if (!s.respuesta) continue;
      preguntas++;
      if (s.respuesta === 'respondida') respondidas++;
      else if (s.respuesta === 'parcial') parciales++;
      else no++;
    }
  }
  return { preguntas, respondidas, parciales, no };
}

export function resumirSustancia(intervenciones: IntervencionMinima[], chequeos: ChequeoMinimo[]): ResumenSustancia {
  const n = intervenciones.length;
  const palabras = intervenciones.reduce((a, i) => a + i.palabras, 0);
  const suficiente = n >= MINIMO_INTERVENCIONES && palabras >= MINIMO_PALABRAS;

  const porClase = new Map<Clase, number>();
  let totalSeg = 0;
  for (const i of intervenciones) {
    for (const s of i.segmentos) {
      porClase.set(s.clase, (porClase.get(s.clase) ?? 0) + s.palabras);
      totalSeg += s.palabras;
    }
  }
  const distribucion: DistribucionClase[] = CLASES.map((clase) => {
    const p = porClase.get(clase) ?? 0;
    return { clase, palabras: p, fraccion: totalSeg > 0 ? p / totalSeg : 0 };
  });

  const conPreguntas = intervenciones.filter((i) => i.formato === 'con_preguntas');
  let evasion: ResumenEvasion | null = null;
  if (conPreguntas.length > 0) {
    const e = evasionDe(conPreguntas);
    const subtipos = new Map<string, number>();
    for (const i of conPreguntas) {
      for (const s of i.segmentos) {
        if (s.clase === 'evasion' && s.subtipo_evasion) subtipos.set(s.subtipo_evasion, (subtipos.get(s.subtipo_evasion) ?? 0) + 1);
      }
    }
    evasion = {
      nIntervenciones: conPreguntas.length,
      preguntas: e.preguntas,
      respondidas: e.respondidas,
      parciales: e.parciales,
      noRespondidas: e.no,
      indice: e.preguntas > 0 ? (e.parciales + e.no) / e.preguntas : Number.NaN,
      ic: bootstrapIC(conPreguntas, (m) => {
        const x = evasionDe(m);
        return x.preguntas > 0 ? (x.parciales + x.no) / x.preguntas : Number.NaN;
      }),
      subtipos: [...subtipos.entries()].map(([subtipo, n]) => ({ subtipo, n })).sort((a, b) => b.n - a.n),
    };
  }

  const exhaustivas = intervenciones.filter((i) => i.chequeo_exhaustivo);
  const palabrasExh = exhaustivas.reduce((a, i) => a + i.palabras, 0);
  const chequeosExh = chequeos.filter((c) => c.exhaustivo);
  const falsos = chequeosExh.filter((c) => c.calificacion === 'falso').length;
  const mentiras: ResumenMentiras = {
    nIntervenciones: exhaustivas.length,
    palabras: palabrasExh,
    chequeos: chequeosExh.length,
    falsos,
    porMilPalabras: palabrasExh > 0 ? (falsos / palabrasExh) * 1000 : Number.NaN,
    porAfirmacion: chequeosExh.length > 0 ? falsos / chequeosExh.length : Number.NaN,
  };

  return {
    suficiente,
    nIntervenciones: n,
    palabras,
    faltan: { intervenciones: Math.max(0, MINIMO_INTERVENCIONES - n), palabras: Math.max(0, MINIMO_PALABRAS - palabras) },
    distribucion,
    indice: indiceDe(intervenciones),
    ic: bootstrapIC(intervenciones, indiceDe),
    kappaPromedio: n > 0 ? intervenciones.reduce((a, i) => a + i.kappa, 0) / n : Number.NaN,
    evasion,
    mentiras,
  };
}
