/**
 * Normalizacion de texto y busqueda aproximada de citas.
 * Se usa tanto para notas (Readability/PDF) como para transcripciones Whisper.
 */
import { distance } from 'fastest-levenshtein';

const MAPA_PUNTUACION: Record<string, string> = {
  '‘': "'", '’': "'", '‚': "'", '‛': "'", '′': "'", '´': "'", '`': "'",
  '“': '"', '”': '"', '„': '"', '‟': '"', '«': '"', '»': '"', '″': '"',
  '‐': '-', '‑': '-', '‒': '-', '–': '-', '—': '-', '―': '-', '−': '-',
  '…': '...', ' ': ' ', ' ': ' ', ' ': ' ', ' ': ' ', '　': ' ',
  '​': '', '‌': '', '‍': '', '﻿': '', '­': '',
};

export interface TextoNormalizado {
  texto: string;
  /** mapa[i] = indice en el texto original del caracter i del texto normalizado. */
  mapa: Int32Array;
}

/**
 * Normaliza conservando un mapa de posiciones hacia el original:
 * NFD y sin diacriticos, minusculas, comillas y guiones unificados, espacios colapsados.
 */
export function normalizarConMapa(original: string): TextoNormalizado {
  const salida: string[] = [];
  const mapa: number[] = [];
  let ultimoEspacio = true; // para recortar espacios al inicio
  // Iteramos por code points para no partir pares sustitutos.
  let indice = 0;
  for (const ch of original) {
    const i = indice;
    indice += ch.length;
    let reemplazo: string;
    if (ch in MAPA_PUNTUACION) reemplazo = MAPA_PUNTUACION[ch];
    else if (/\s/.test(ch)) reemplazo = ' ';
    else {
      const nfd = ch.normalize('NFD').replace(/[̀-ͯ]/g, '');
      reemplazo = (nfd || '').toLowerCase();
    }
    for (const r of reemplazo) {
      if (r === ' ') {
        if (ultimoEspacio) continue;
        ultimoEspacio = true;
      } else {
        ultimoEspacio = false;
      }
      salida.push(r);
      mapa.push(i);
    }
  }
  while (salida.length && salida[salida.length - 1] === ' ') {
    salida.pop();
    mapa.pop();
  }
  return unirPalabrasCortadas(salida, mapa);
}

/**
 * Une las palabras que un PDF partio al final de la linea.
 *
 * Al extraer texto de un PDF, "votacion" cortada entre dos lineas vuelve como "vota- cion". La
 * cita que el agente copia de la pagina dice "votacion", y la comparacion falla por un guion que
 * nunca estuvo en lo que se publico. Paso en dos citas de diarios de sesion de la Asamblea
 * General, que son de las mejores fuentes que tiene el proyecto.
 *
 * Se borra el guion solo en el caso del corte: letra, guion, espacio, letra. Un guion entre
 * espacios ("el veto - dijo - fue") o en un rango ("7 - 20") no cumple el patron y queda.
 *
 * La regla es agresiva a proposito y eso es seguro: la normalizacion se aplica igual a la cita y
 * al texto de la fuente, asi que un caso raro como "Ejecutivo- Asamblea" se normaliza igual de los
 * dos lados y la comparacion sigue funcionando. El riesgo de una regla asi no son los falsos
 * negativos sino las colisiones, y para eso el umbral de similitud sigue siendo el que decide.
 */
function unirPalabrasCortadas(salida: string[], mapa: number[]): TextoNormalizado {
  const texto: string[] = [];
  const posiciones: number[] = [];
  const esLetra = (c: string | undefined) => Boolean(c && /\p{L}/u.test(c));
  for (let i = 0; i < salida.length; i++) {
    if (
      salida[i] === '-' &&
      esLetra(salida[i - 1]) &&
      salida[i + 1] === ' ' &&
      esLetra(salida[i + 2])
    ) {
      i += 1; // saltear el guion y el espacio que lo sigue
      continue;
    }
    texto.push(salida[i]);
    posiciones.push(mapa[i]);
  }
  return { texto: texto.join(''), mapa: Int32Array.from(posiciones) };
}

export function normalizar(texto: string): string {
  return normalizarConMapa(texto).texto;
}

export interface ResultadoCita {
  /** true si la cita normalizada aparece literal en el texto normalizado. */
  exacta: boolean;
  /** 1 - distancia/longitud, en [0,1]. 1 si es exacta. */
  similitud: number;
  /** Posicion (en el texto ORIGINAL) del inicio del mejor tramo, o -1. */
  posicion: number;
  /** Fin (exclusivo) en el texto original del mejor tramo, o -1. */
  fin: number;
  /** Tramo del texto original que mejor coincide. */
  extracto: string;
}

/**
 * Busca `cita` en `texto`. Primero literal sobre texto normalizado; si no,
 * ventana deslizante con Levenshtein (fastest-levenshtein). Umbrales sugeridos:
 * >= 0.90 "cita aproximada" en notas, >= 0.85 en transcripciones.
 */
export function buscarCita(texto: string, cita: string): ResultadoCita {
  const t = normalizarConMapa(texto);
  const q = normalizar(cita);
  const vacio: ResultadoCita = { exacta: false, similitud: 0, posicion: -1, fin: -1, extracto: '' };
  if (!q || !t.texto) return vacio;

  const literal = t.texto.indexOf(q);
  if (literal >= 0) {
    const [ini, fin] = rangoOriginal(t, literal, literal + q.length);
    return { exacta: true, similitud: 1, posicion: ini, fin, extracto: texto.slice(ini, fin) };
  }

  const L = q.length;
  const N = t.texto.length;
  if (N < L * 0.5) {
    // El texto es mucho mas corto que la cita: comparamos entero.
    const d = distance(t.texto, q);
    const sim = 1 - d / Math.max(L, N);
    const [ini, fin] = rangoOriginal(t, 0, N);
    return { exacta: false, similitud: Math.max(0, sim), posicion: ini, fin, extracto: texto.slice(ini, fin) };
  }

  // Pasada gruesa: ventanas de largo L con paso ~L/6.
  const paso = Math.max(1, Math.floor(L / 6));
  let mejor = { d: Number.POSITIVE_INFINITY, ini: 0, largo: L };
  for (let i = 0; i <= Math.max(0, N - L); i += paso) {
    const d = distance(t.texto.substr(i, L), q);
    if (d < mejor.d) mejor = { d, ini: i, largo: L };
  }
  if (N < L) {
    const d = distance(t.texto, q);
    if (d < mejor.d) mejor = { d, ini: 0, largo: N };
  }

  // Pasada fina: alrededor del mejor, paso 1, y largos L±15 % (por inserciones/borrados del ASR).
  const desde = Math.max(0, mejor.ini - paso);
  const hasta = Math.min(N - 1, mejor.ini + paso);
  const delta = Math.max(2, Math.round(L * 0.15));
  for (let i = desde; i <= hasta; i++) {
    for (let largo = L - delta; largo <= L + delta; largo += Math.max(1, Math.floor(delta / 4))) {
      if (largo <= 0 || i + largo > N) continue;
      const d = distance(t.texto.substr(i, largo), q);
      if (d < mejor.d) mejor = { d, ini: i, largo };
    }
  }

  // Ajuste a limites de palabra para que el extracto sea legible.
  let ini = mejor.ini;
  let fin = mejor.ini + mejor.largo;
  while (ini > 0 && t.texto[ini - 1] !== ' ' && ini > mejor.ini - 12) ini--;
  while (fin < N && t.texto[fin] !== ' ' && fin < mejor.ini + mejor.largo + 12) fin++;

  const similitud = Math.max(0, 1 - mejor.d / Math.max(L, mejor.largo));
  const [oIni, oFin] = rangoOriginal(t, ini, fin);
  return { exacta: false, similitud, posicion: oIni, fin: oFin, extracto: texto.slice(oIni, oFin) };
}

function rangoOriginal(t: TextoNormalizado, ini: number, fin: number): [number, number] {
  const oIni = t.mapa[Math.min(ini, t.mapa.length - 1)] ?? 0;
  const ultimo = Math.max(ini, fin - 1);
  const oFin = ultimo < t.mapa.length ? t.mapa[ultimo] + 1 : (t.mapa[t.mapa.length - 1] ?? 0) + 1;
  return [oIni, oFin];
}

/** Recorta un texto a `n` caracteres agregando "…". */
export function recortar(texto: string, n = 160): string {
  const limpio = texto.replace(/\s+/g, ' ').trim();
  return limpio.length <= n ? limpio : limpio.slice(0, n - 1) + '…';
}

/**
 * Busca cada alias (normalizado, con limites de palabra) en el texto y devuelve
 * las posiciones en el texto original. Sirve para etiquetado determinista.
 */
export function posicionesDeAlias(texto: string, alias: string[]): number[] {
  const t = normalizarConMapa(texto);
  const posiciones = new Set<number>();
  for (const a of alias) {
    const q = normalizar(a);
    if (q.length < 2) continue;
    const re = new RegExp(`(?<![\\p{L}\\p{N}])${escaparRegex(q)}(?![\\p{L}\\p{N}])`, 'gu');
    let m: RegExpExecArray | null;
    while ((m = re.exec(t.texto)) !== null) {
      posiciones.add(t.mapa[m.index]);
      if (m[0].length === 0) re.lastIndex++;
    }
  }
  return [...posiciones].sort((a, b) => a - b);
}

export function escaparRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
