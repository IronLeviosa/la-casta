/**
 * Ledger de lecturas de fuentes: que se pudo leer, que no, y por que.
 *
 * Hermano de `data/fuentes-ledger.json`. Ese registra la salud de las fuentes que **si** usamos;
 * este registra los intentos que **no** llegaron a nota. La asimetria importaba: hasta ahora, una
 * nota que no se podia leer no dejaba rastro en ningun lado. El investigador recibia un rechazo,
 * citaba otra cosa y seguia, y nadie podia contar cuanto se estaba perdiendo ni de que medios.
 *
 * El caso que motivo esto: lr21.com.uy (La Republica, alineamiento progresista) devolvia 403 al
 * cliente HTTP del proyecto en el 100% de los intentos. Un medio entero quedaba afuera de la base
 * de evidencia y la unica forma de descubrirlo fue parsear a mano la prosa libre del campo
 * `resultado` de los `consultas.jsonl`. Por eso `resultado` aca es un enum y no texto: para que la
 * pregunta "que porcentaje de lecturas se nos bloquea, y de que medios" se responda sola.
 *
 * Lo escribe la maquina (`pnpm fuente`). Como `data/aprobaciones.json` y `data/fuentes-ledger.json`,
 * ningun agente lo edita a mano.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { RAIZ } from './rutas.ts';

export const RUTA_LECTURAS = path.join(RAIZ, 'data', 'lecturas-ledger.json');

/**
 * `senuelo` es el caso que no se ve venir: el servidor contesta 200 y la pagina baja bien, pero el
 * cuerpo es el aviso de suscripcion en vez de la nota. El Observador devuelve 60 caracteres asi.
 * Sin esta etiqueta, el corpus guarda el señuelo como si fuera la nota y un registro puede citarlo.
 */
export type ResultadoLectura =
  | 'ok'
  | 'senuelo'
  | 'http_403'
  | 'http_404'
  | 'http_5xx'
  | 'timeout'
  | 'red'
  | 'otro';

export interface EntradaLectura {
  resultado: ResultadoLectura;
  detalle?: string;
  dominio: string;
  bytes: number;
  intentos: number;
  primer_intento: string;
  ultimo_intento: string;
}

export type Lecturas = Record<string, EntradaLectura>;

/** Clasifica un fallo en el enum. `estado` es el codigo HTTP si lo hubo. */
export function clasificar(estado: number | null, mensaje: string): ResultadoLectura {
  if (estado === 403) return 'http_403';
  if (estado === 404) return 'http_404';
  if (estado !== null && estado >= 500) return 'http_5xx';
  const m = mensaje.toLowerCase();
  if (m.includes('abort') || m.includes('timeout')) return 'timeout';
  if (m.includes('fetch failed') || m.includes('enotfound') || m.includes('econnrefused')) return 'red';
  return 'otro';
}

/**
 * Un cuerpo muy corto que ademas habla de suscripcion es un muro, no una nota. El umbral es
 * deliberadamente bajo: una nota real de 400 caracteres es rarisima, y preferimos marcar de menos
 * antes que ensuciar el ledger con notas breves legitimas (un cable de agencia, un fallo judicial).
 */
export function pareceSenuelo(texto: string): boolean {
  if (texto.length > 400) return false;
  return /suscr[ií]b|suscripci[oó]n|reg[ií]strate|contenido exclusivo|solo para suscriptores/i.test(texto);
}

export function leerLecturas(): Lecturas {
  if (!existsSync(RUTA_LECTURAS)) return {};
  try {
    return JSON.parse(readFileSync(RUTA_LECTURAS, 'utf8')) as Lecturas;
  } catch {
    return {};
  }
}

/** Anota un intento de lectura. Acumula `intentos` si la URL ya estaba. */
export function registrarLectura(
  url: string,
  resultado: ResultadoLectura,
  opciones: { detalle?: string; bytes?: number } = {},
): void {
  const lecturas = leerLecturas();
  const ahora = new Date().toISOString();
  let dominio = '';
  try {
    dominio = new URL(url).hostname.replace(/^www\./, '');
  } catch {
    dominio = '?';
  }
  const previa = lecturas[url];
  lecturas[url] = {
    resultado,
    ...(opciones.detalle ? { detalle: opciones.detalle } : {}),
    dominio,
    bytes: opciones.bytes ?? 0,
    intentos: (previa?.intentos ?? 0) + 1,
    primer_intento: previa?.primer_intento ?? ahora,
    ultimo_intento: ahora,
  };
  const ordenado: Lecturas = {};
  for (const k of Object.keys(lecturas).sort()) ordenado[k] = lecturas[k];
  mkdirSync(path.dirname(RUTA_LECTURAS), { recursive: true });
  writeFileSync(RUTA_LECTURAS, JSON.stringify(ordenado, null, 2) + '\n', 'utf8');
}

/** Resumen por dominio, para `pnpm auditar`. */
export function resumenPorDominio(lecturas: Lecturas = leerLecturas()) {
  const por = new Map<string, { ok: number; fallidas: number; motivos: Map<ResultadoLectura, number> }>();
  for (const e of Object.values(lecturas)) {
    const d = por.get(e.dominio) ?? { ok: 0, fallidas: 0, motivos: new Map() };
    if (e.resultado === 'ok') d.ok += 1;
    else {
      d.fallidas += 1;
      d.motivos.set(e.resultado, (d.motivos.get(e.resultado) ?? 0) + 1);
    }
    por.set(e.dominio, d);
  }
  return por;
}
