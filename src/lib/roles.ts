/**
 * Cómo se reconoce un cargo a partir de su texto.
 *
 * Vive aparte de `contenido.ts` para que se pueda probar sin Astro, y porque acá hay una trampa
 * concreta: "Vicepresidente de la República" **contiene** la cadena "presidente de la república".
 * Un filtro ingenuo mete a los vices entre los presidentes, y como hasta ahora el sitio solo tenía
 * presidentes cargados, el error no se veía. Al cargar los vices habría aparecido en la línea de
 * tiempo del home, mezclados con los presidentes y sin que nadie lo notara enseguida.
 */
export const ES_PRESIDENTE = /^\s*presidente de la rep/i;
export const ES_VICEPRESIDENTE = /^\s*vice\s*presidente de la rep/i;
export const ES_SENADOR = /^\s*senador/i;
export const ES_DIPUTADO = /^\s*(diputad|represent)/i;
