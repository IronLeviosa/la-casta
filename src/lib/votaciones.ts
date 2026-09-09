/**
 * Cuentas de una votación que la página muestra y que el registro no repite: cuántos votos hacían
 * falta, por cuántos se decidió, quién votó distinto de su bancada y quién no estaba.
 */
import type { Votacion } from './tipos';

type Datos = Votacion['data'];
type Legislador = Datos['legisladores'][number];

export const NOMBRE_CAMARA: Record<Datos['camara'], string> = {
  representantes: 'Cámara de Representantes',
  senadores: 'Cámara de Senadores',
  asamblea_general: 'Asamblea General',
};

export const NOMBRE_VOTO: Record<Legislador['voto'], string> = {
  afirmativo: 'votó a favor',
  negativo: 'votó en contra',
  presente_sin_votar: 'presente, no votó',
  no_registrado: 'en Sala, no se registró',
  ausente_con_aviso: 'ausente con aviso',
  ausente_sin_aviso: 'ausente sin aviso',
  licencia: 'con licencia',
  sin_dato: 'presente; su voto no consta',
};

export const NOMBRE_REQUERIDO: Record<Datos['resultado']['requerido'], string> = {
  mayoria_simple: 'mayoría de presentes',
  mayoria_absoluta: 'mayoría absoluta de integrantes',
  dos_tercios: 'dos tercios',
  tres_quintos: 'tres quintos',
};

/** Votos afirmativos que exigía la mayoría requerida. */
export function votosRequeridos(r: Datos['resultado']): number {
  switch (r.requerido) {
    case 'mayoria_simple':
      return Math.floor(r.presentes / 2) + 1;
    case 'mayoria_absoluta':
      return Math.floor(r.integrantes / 2) + 1;
    case 'dos_tercios':
      return Math.ceil((2 * r.integrantes) / 3);
    case 'tres_quintos':
      return Math.ceil((3 * r.integrantes) / 5);
  }
}

/** Positivo: votos de sobra sobre el mínimo. Negativo: votos que faltaron. */
export function margen(r: Datos['resultado']): number {
  return r.afirmativos - votosRequeridos(r);
}

export const esAjustada = (r: Datos['resultado']) => Math.abs(margen(r)) <= 3;

const A_FAVOR = new Set(['afirmativo']);
const EN_CONTRA = new Set(['negativo', 'presente_sin_votar']);

/** Legisladores cuyo voto consta y va contra la posición declarada de su bancada. */
export function distintosDeSuBancada(v: Datos): { legislador: Legislador; posicion: string }[] {
  const salida: { legislador: Legislador; posicion: string }[] = [];
  for (const l of v.legisladores) {
    const b = v.bancadas.find((x) => x.partido === l.partido && (!x.sector || x.sector === l.sector)) ?? v.bancadas.find((x) => x.partido === l.partido);
    if (!b || b.posicion === 'libertad_de_accion' || b.posicion === 'dividida' || b.posicion === 'sin_dato') continue;
    if (l.fuente_del_voto === 'sin_dato' || l.fuente_del_voto === 'asistencia') continue;
    const contra = (b.posicion === 'a_favor' && EN_CONTRA.has(l.voto)) || (b.posicion === 'en_contra' && A_FAVOR.has(l.voto));
    if (contra) salida.push({ legislador: l, posicion: b.posicion });
  }
  return salida;
}

export const AUSENCIAS = new Set(['no_registrado', 'ausente_con_aviso', 'ausente_sin_aviso', 'licencia']);

export function ausentes(v: Datos): Legislador[] {
  return v.legisladores.filter((l) => AUSENCIAS.has(l.voto));
}

export interface CuentaBancada {
  partido: string;
  posicion: Datos['bancadas'][number]['posicion'];
  total: number;
  afirmativos: number;
  negativos: number;
  presentes_sin_voto: number;
  ausentes: number;
}

export function cuentasPorBancada(v: Datos): CuentaBancada[] {
  const mapa = new Map<string, CuentaBancada>();
  for (const l of v.legisladores) {
    const c = mapa.get(l.partido) ?? { partido: l.partido, posicion: v.bancadas.find((b) => b.partido === l.partido)?.posicion ?? 'sin_dato', total: 0, afirmativos: 0, negativos: 0, presentes_sin_voto: 0, ausentes: 0 };
    c.total++;
    if (l.voto === 'afirmativo') c.afirmativos++;
    else if (l.voto === 'negativo' || l.voto === 'presente_sin_votar') c.negativos++;
    else if (AUSENCIAS.has(l.voto)) c.ausentes++;
    else c.presentes_sin_voto++;
    mapa.set(l.partido, c);
  }
  return [...mapa.values()].sort((a, b) => b.total - a.total || a.partido.localeCompare(b.partido));
}
