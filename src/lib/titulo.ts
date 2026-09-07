/**
 * Título corto para una página de registro, cuando el editor no escribió uno.
 *
 * Es un parche, y conviene que se note como tal: el título de verdad lo escribe el editor en el
 * campo `titulo`. Pero 84 declaraciones publicadas no lo tienen, y hasta que se les escriba, la
 * alternativa era seguir mostrando el resumen entero como título: siete líneas en pantalla.
 *
 * Toma la primera oración del resumen y, si sigue siendo larga, la corta en el último límite de
 * palabra antes del máximo. Nunca corta a mitad de palabra ni deja una coma colgando.
 */
export function tituloCorto(titulo: string | undefined, resumen: string, maximo = 92): string {
  if (titulo && titulo.trim()) return titulo.trim();
  const limpio = resumen.replace(/\s+/g, ' ').trim();
  // Primera oración: hasta el primer punto seguido de espacio o fin, sin comerse abreviaturas
  // como "USD 1.700" (punto entre dígitos) ni "Dr." (punto tras mayúscula sola).
  const m = /^(.+?[.;])(\s|$)/.exec(limpio.replace(/(\d)\.(\d)/g, '$1․$2'));
  let frase = (m ? m[1] : limpio).replace(/․/g, '.');
  if (/\b[A-Z][a-z]?\.$/.test(frase)) frase = limpio; // era una abreviatura, no un cierre
  if (frase.length <= maximo) return frase.replace(/[.;]$/, '');
  const corte = frase.lastIndexOf(' ', maximo - 1);
  return frase.slice(0, corte > 40 ? corte : maximo).replace(/[,;:\s]+$/, '') + '…';
}
