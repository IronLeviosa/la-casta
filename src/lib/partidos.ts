/**
 * Colores de partido para los gráficos del sitio.
 *
 * La fuente única es `data/alias.yaml`, el mismo archivo que usa el etiquetador
 * del corpus: ahí está el nombre canónico de cada partido y, desde ahora, su
 * `color`. Se lee con `?raw` para que quede resuelto en tiempo de build (el
 * sitio es estático y no lee archivos en el navegador).
 *
 * Regla de accesibilidad que este módulo asume y las páginas deben respetar: el
 * color nunca es el único canal. Toda banda, punto o barra coloreada lleva
 * además el nombre del partido escrito. Los colores del YAML están elegidos
 * oscuros para que el texto blanco encima llegue a 4.5:1.
 */
import { parse } from 'yaml';
import aliasYaml from '../../data/alias.yaml?raw';

/** Color de reserva para un partido sin `color` declarado (o desconocido). */
export const COLOR_SIN_PARTIDO = '#57544c';

interface PartidoYaml {
  nombre?: string;
  sigla?: string;
  color?: string;
}

function cargar(): Map<string, string> {
  const datos = parse(aliasYaml) as { partidos?: PartidoYaml[] } | null;
  const mapa = new Map<string, string>();
  for (const p of datos?.partidos ?? []) {
    if (!p?.nombre || !p.color) continue;
    mapa.set(p.nombre, p.color);
    if (p.sigla) mapa.set(p.sigla, p.color);
  }
  return mapa;
}

const COLORES = cargar();

/** Color declarado del partido, o el color de reserva si no hay ninguno. */
export function colorDePartido(partido: string | undefined | null): string {
  if (!partido) return COLOR_SIN_PARTIDO;
  return COLORES.get(partido) ?? COLOR_SIN_PARTIDO;
}
