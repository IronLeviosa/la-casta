/**
 * Partir un texto en tramos marcados y no marcados.
 *
 * Existe para que un chequeo del Veracímetro se vea **dentro** de la cita o del resumen donde está
 * el dato, con el color de su calificación, y no solo como una tarjeta más abajo que casi nadie
 * llega a leer. El chequeo declara `fragmento`, el tramo exacto del texto que contiene el dato; acá
 * se localiza y se devuelve el texto en pedazos, para que la página envuelva los marcados.
 *
 * Reglas, todas a propósito:
 * - La comparación es exacta salvo por los espacios (los YAML plegados colapsan saltos de línea).
 *   Si el fragmento no está tal cual, no se marca nada: mejor un chequeo sin marca que una marca
 *   sobre las palabras equivocadas. El validador avisa aparte.
 * - Se toma la primera aparición. Un dato repetido dos veces en el mismo texto se marca una.
 * - Dos fragmentos que se pisan: gana el que empieza antes; el otro se descarta.
 */
export interface Marca<T> {
  fragmento: string;
  dato: T;
}

export interface Parte<T> {
  texto: string;
  /** Presente cuando el tramo corresponde a un fragmento marcado. */
  marca?: T;
}

export function normalizarEspacios(s: string): string {
  return s.replace(/\s+/g, ' ').trim();
}

export function partirEnFragmentos<T>(texto: string, marcas: readonly Marca<T>[]): Parte<T>[] {
  const base = normalizarEspacios(texto);
  const ubicadas = marcas
    .map((m) => {
      const frag = normalizarEspacios(m.fragmento);
      const inicio = frag ? base.indexOf(frag) : -1;
      return { inicio, fin: inicio + frag.length, dato: m.dato };
    })
    .filter((u) => u.inicio >= 0)
    .sort((a, b) => a.inicio - b.inicio);

  const partes: Parte<T>[] = [];
  let cursor = 0;
  for (const u of ubicadas) {
    if (u.inicio < cursor) continue; // se pisa con la anterior
    if (u.inicio > cursor) partes.push({ texto: base.slice(cursor, u.inicio) });
    partes.push({ texto: base.slice(u.inicio, u.fin), marca: u.dato });
    cursor = u.fin;
  }
  if (cursor < base.length) partes.push({ texto: base.slice(cursor) });
  return partes.length ? partes : [{ texto: base }];
}

/** true si el fragmento aparece tal cual (salvo espacios) en alguno de los textos. */
export function fragmentoEsta(fragmento: string, ...textos: (string | undefined)[]): boolean {
  const frag = normalizarEspacios(fragmento);
  if (!frag) return false;
  return textos.some((t) => !!t && normalizarEspacios(t).includes(frag));
}
