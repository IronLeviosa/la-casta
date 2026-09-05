/**
 * Formato de fechas y números en español rioplatense (es-UY).
 * Todo es determinista: no depende de la zona horaria de la máquina de build.
 */

const MESES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
] as const;

const MESES_CORTOS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'set', 'oct', 'nov', 'dic'] as const;

function partes(iso: string): { a: number; m: number; d: number } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return null;
  return { a: Number(m[1]), m: Number(m[2]), d: Number(m[3]) };
}

/** "1 de marzo de 2020" */
export function fechaLarga(iso: string | undefined | null): string {
  if (!iso) return '';
  const p = partes(iso);
  if (!p) return iso;
  return `${p.d} de ${MESES[p.m - 1]} de ${p.a}`;
}

/**
 * Fecha con la precisión que tenga: "1990", "marzo de 1990" o "5 de marzo de 1990".
 *
 * Se usa donde el dato puede venir incompleto —los mandatos, sobre todo los viejos— porque escribir
 * "1 de enero de 1990" cuando la fuente solo dice "1990" inventa una precisión que nadie documentó,
 * y quien lee no tiene forma de saber cuál de las dos cosas está mirando.
 */
export function fechaParcialLarga(fecha: string | undefined | null): string {
  if (!fecha) return '';
  if (/^\d{4}$/.test(fecha)) return fecha;
  const m = /^(\d{4})-(\d{2})$/.exec(fecha);
  if (m) return `${MESES[Number(m[2]) - 1]} de ${m[1]}`;
  return fechaLarga(fecha);
}

/** "1 mar 2020" */
export function fechaCorta(iso: string | undefined | null): string {
  if (!iso) return '';
  const p = partes(iso);
  if (!p) return iso;
  return `${p.d} ${MESES_CORTOS[p.m - 1]} ${p.a}`;
}

/** "marzo de 2020" */
export function mesAnio(iso: string): string {
  const p = partes(iso);
  if (!p) return iso;
  return `${MESES[p.m - 1]} de ${p.a}`;
}

export function anio(iso: string): number {
  const p = partes(iso);
  return p ? p.a : Number.NaN;
}

/** Diferencia en años (decimal) entre dos fechas ISO. */
export function aniosEntre(desde: string, hasta: string): number {
  const ms = Date.parse(hasta) - Date.parse(desde);
  return ms / (365.25 * 24 * 3600 * 1000);
}

const fmtEntero = new Intl.NumberFormat('es-UY', { maximumFractionDigits: 0 });
const fmtDecimal = new Intl.NumberFormat('es-UY', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const fmtDos = new Intl.NumberFormat('es-UY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Número entero con separador de miles es-UY (punto). */
export function numero(n: number): string {
  if (!Number.isFinite(n)) return '—';
  return fmtEntero.format(n);
}

/** Número con un decimal. */
export function decimal(n: number, decimales: 1 | 2 = 1): string {
  if (!Number.isFinite(n)) return '—';
  return (decimales === 2 ? fmtDos : fmtDecimal).format(n);
}

/** 0.234 → "23,4 %" */
export function porcentaje(fraccion: number, decimales: 0 | 1 = 1): string {
  if (!Number.isFinite(fraccion)) return '—';
  const v = fraccion * 100;
  return `${decimales === 0 ? fmtEntero.format(v) : fmtDecimal.format(v)} %`;
}

/** Monto con moneda: "US$ 593.000", "$ 1.200.000", "UI 120.000". */
export function monto(n: number, moneda: 'UYU' | 'USD' | 'UI'): string {
  const simbolo = moneda === 'USD' ? 'US$' : moneda === 'UYU' ? '$' : 'UI';
  const signo = n < 0 ? '−' : '';
  return `${signo}${simbolo} ${fmtEntero.format(Math.abs(n))}`;
}

/** Texto en singular o plural según n. */
export function plural(n: number, singular: string, pluralTxt: string): string {
  return n === 1 ? singular : pluralTxt;
}

/** Recorta un texto a `max` caracteres en un límite de palabra, con elipsis. */
export function recortar(texto: string, max = 220): string {
  if (texto.length <= max) return texto;
  const corte = texto.lastIndexOf(' ', max);
  return `${texto.slice(0, corte > 40 ? corte : max).trimEnd()}…`;
}

/** Etiquetas legibles para los enums del modelo. */
export const ETIQUETAS: Record<string, string> = {
  // niveles de evidencia
  textual: 'Textual',
  reportado: 'Reportado',
  inferencia: 'Inferencia',
  // tiers
  publicado: 'Publicado',
  probable: 'Probable',
  hipotesis: 'Hipótesis',
  // giros
  sin_cambio: 'Sin cambio',
  cambio_parcial: 'Cambio parcial',
  cambio_total: 'Cambio total',
  reconocido_explicitamente: 'Reconocido explícitamente',
  justificado_por_contexto: 'Justificado por contexto',
  sin_explicacion: 'Sin explicación',
  // promesas
  cumplida: 'Cumplida',
  en_proceso_adelantada: 'En proceso, adelantada',
  en_proceso_demorada: 'En proceso, demorada',
  incumplida: 'Incumplida',
  ley: 'Ley',
  decreto: 'Decreto',
  accion_de_gobierno: 'Acción de gobierno',
  dato_oficial: 'Dato oficial',
  declaracion: 'Declaración',
  omision: 'Omisión',
  a_favor: 'A favor',
  en_contra: 'En contra',
  neutral: 'Neutral',
  // chequeos
  verdadero: 'Verdadero',
  discutible: 'Discutible',
  falso: 'Falso',
  // casos
  corrupcion: 'Corrupción',
  acoso_sexual: 'Acoso sexual',
  delito_grave: 'Delito grave',
  conducta_personal: 'Conducta personal',
  otro: 'Otro',
  imputado: 'Imputado',
  bajo_su_mando: 'Bajo su mando',
  mencionado: 'Mencionado',
  denuncia: 'Denuncia',
  investigacion: 'Investigación',
  formalizacion: 'Formalización',
  condena: 'Condena',
  absolucion: 'Absolución',
  archivo: 'Archivo',
  formalizado: 'Formalizado',
  cerrado_sin_condena: 'Cerrado sin condena',
  // políticos
  en_cargo: 'En el cargo',
  fuera_de_cargo: 'Fuera del cargo',
  en_prision: 'Privado de libertad',
  fallecido: 'Fallecido',
  fin_de_mandato: 'fin de mandato',
  renuncia: 'renuncia',
  renuncia_forzada: 'renuncia forzada',
  destitucion: 'destitución',
  fallecimiento: 'fallecimiento',
  // contexto de declaración
  campaña: 'Campaña',
  gobierno: 'Gobierno',
  oposicion: 'Oposición',
  entrevista: 'Entrevista',
  parlamento: 'Parlamento',
  redes: 'Redes',
  // tipos de fuente
  video: 'Video',
  nota: 'Nota de prensa',
  documento_oficial: 'Documento oficial',
  diario_de_sesiones: 'Diario de sesiones',
  // medios
  diario: 'Diario',
  semanario: 'Semanario',
  portal: 'Portal',
  tv: 'Televisión',
  radio: 'Radio',
  agencia: 'Agencia',
  estatal: 'Estatal',
  enciclopedia: 'Enciclopedia',
  oficialista_tradicional: 'Vínculo con partidos tradicionales',
  progresista: 'Progresista',
  independiente: 'Independiente',
  sin_datos: 'Sin datos',
  // cobertura
  favorable: 'Favorable',
  desfavorable: 'Desfavorable',
  // intervenciones
  discurso: 'Discurso',
  conferencia: 'Conferencia de prensa',
  cadena: 'Cadena nacional',
  con_preguntas: 'Con preguntas',
  sin_preguntas: 'Sin preguntas',
  hecho_verificable: 'Hecho verificable',
  propuesta_concreta: 'Propuesta concreta',
  posicion: 'Posición',
  argumento: 'Argumento',
  ataque: 'Ataque',
  evasion: 'Evasión',
  retorica: 'Retórica',
  ignora: 'Ignora la pregunta',
  cuestiona_la_pregunta: 'Cuestiona la pregunta',
  ataca_al_entrevistador: 'Ataca al entrevistador',
  punto_politico: 'Hace un punto político',
  respuesta_incompleta: 'Respuesta incompleta',
  repite_respuesta_previa: 'Repite una respuesta previa',
  declara_no_poder_responder: 'Declara no poder responder',
  respondida: 'Respondida',
  parcial: 'Parcial',
  no_respondida: 'No respondida',
  // patrimonio
  herencia: 'Herencia',
  venta: 'Venta',
  compra: 'Compra',
  donacion: 'Donación',
  revaluo: 'Revalúo',
  // correcciones
  error_factual: 'Error factual',
  fuente_caida: 'Fuente caída',
  replica: 'Réplica',
  cambio_de_rating: 'Cambio de calificación',
  // menciones
  positivo: 'Positivo',
  negativo: 'Negativo',
};

export function etiqueta(valor: string | undefined | null): string {
  if (!valor) return '';
  return ETIQUETAS[valor] ?? valor.replaceAll('_', ' ');
}
