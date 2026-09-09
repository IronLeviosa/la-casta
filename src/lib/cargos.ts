/**
 * Tipo de cargo público a partir de su nombre, para colorear la banda de mandatos: todas las
 * presidencias del mismo color, las intendencias de otro, y así. Los colores son fijos en todo el
 * sitio, para que el lector los aprenda una vez. Un lector lo pidió al ver la banda de Vázquez
 * (intendencia y dos presidencias del mismo azul).
 */
export type TipoCargo =
  | 'presidencia'
  | 'vicepresidencia'
  | 'senado'
  | 'diputados'
  | 'intendencia'
  | 'ministerio'
  | 'empresa_publica'
  | 'departamental'
  | 'otro';

const REGLAS: [TipoCargo, RegExp][] = [
  ['presidencia', /^presiden(te|ta|cia)\s+de\s+la\s+rep[uú]blica/i],
  ['vicepresidencia', /^vicepresiden(te|ta)\s+de\s+la\s+rep[uú]blica/i],
  ['senado', /^senador/i],
  ['diputados', /representante\s+nacional|diputad|c[aá]mara\s+de\s+representantes/i],
  ['intendencia', /^intendent/i],
  ['ministerio', /^ministr/i],
  ['empresa_publica', /administraci[oó]n\s+nacional|\bANCAP\b|\bANTEL\b|\bUTE\b|\bOSE\b|\bANP\b|\bBROU\b|\bBSE\b|\bBHU\b|\bAFE\b|ente\s+aut[oó]nomo|servicio\s+descentralizado/i],
  ['departamental', /^edil|junta\s+departamental|\bde\s+montevideo$|intendencia\s+de/i],
];

export function tipoDeCargo(cargo: string): TipoCargo {
  for (const [tipo, re] of REGLAS) if (re.test(cargo)) return tipo;
  return 'otro';
}

export const NOMBRE_TIPO_CARGO: Record<TipoCargo, string> = {
  presidencia: 'Presidencia',
  vicepresidencia: 'Vicepresidencia',
  senado: 'Senado',
  diputados: 'Cámara de Representantes',
  intendencia: 'Intendencia',
  ministerio: 'Ministerio',
  empresa_publica: 'Empresa o ente público',
  departamental: 'Gobierno departamental',
  otro: 'Otro cargo público',
};

/* Los mismos colores que usa la línea de tiempo por tema (lt-c1…), para no sumar paletas. */
export const COLOR_TIPO_CARGO: Record<TipoCargo, string> = {
  presidencia: '#1f77b4',
  vicepresidencia: '#6baed6',
  senado: '#2ca02c',
  diputados: '#9467bd',
  intendencia: '#ff7f0e',
  ministerio: '#d62728',
  empresa_publica: '#8c564b',
  departamental: '#e377c2',
  otro: '#7f7f7f',
};

/** Si el cargo es una suplencia (se dibuja rayado, del color del cargo). */
export const esSuplencia = (cargo: string) => /suplente|suplencia/i.test(cargo);
