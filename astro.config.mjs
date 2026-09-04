import { defineConfig } from 'astro/config';
import { BASE_POR_DEFECTO, SITIO_POR_DEFECTO } from './src/lib/ruta.ts';
import { rehypeLeyes } from './src/lib/rehype-leyes.ts';

/**
 * Dónde vive el sitio. Se controla con dos variables de entorno para que mudarlo
 * sea un solo cambio y no una búsqueda y reemplazo por todo el código:
 *
 *   SITE_URL   origen, sin barra final   (por defecto https://ironleviosa.github.io)
 *   BASE_PATH  subdirectorio             (por defecto /la-casta)
 *
 * Hoy el sitio se publica como GitHub Pages de proyecto, o sea en un
 * subdirectorio: https://ironleviosa.github.io/la-casta/. Los workflows no pasan
 * nada, así que usan estos valores por defecto.
 *
 * Para mudarlo al dominio propio, en la raíz:
 *
 *     SITE_URL=https://lacasta.uy BASE_PATH=/ pnpm build
 *
 * (o esas mismas dos variables en el entorno del workflow de deploy).
 *
 * Ninguna ruta del código lleva el base escrito a mano: todas pasan por
 * `ruta()` / `urlAbsoluta()` de `src/lib/ruta.ts`, que leen `import.meta.env`.
 * En el Markdown de `content/paginas/` los enlaces entre páginas van relativos
 * (`[Sobre](../sobre/)`), que es lo mismo con o sin base.
 */
const BASE = process.env.BASE_PATH ?? BASE_POR_DEFECTO;

export default defineConfig({
  site: process.env.SITE_URL ?? SITIO_POR_DEFECTO,
  base: BASE,
  trailingSlash: 'always',
  build: { format: 'directory' },
  /*
   * Las referencias a leyes del Markdown de `content/paginas/` se convierten en
   * tarjetas con el resumen llano de la ley. Va como transformación y no como
   * marcado escrito a mano para que funcione en toda la prosa, no solo donde
   * alguien se acordó de marcarlo. Ver `src/lib/rehype-leyes.ts`.
   *
   * El plugin va **sin invocar**: unified llama al attacher y usa lo que
   * devuelve como transformación. Pasarlo ya invocado (`rehypeLeyes()`) no da
   * error, pero no hace nada.
   *
   * `@astrojs/markdown-remark` figura en las dependencias del proyecto por esto:
   * Astro 7.2 valida `markdown.rehypePlugins` con `coerceLegacyMarkdownPlugins`,
   * que lo resuelve desde la raíz. Sin esa dependencia directa, `astro build`
   * falla al leer esta configuración, aunque el paquete esté como transitivo.
   */
  markdown: {
    rehypePlugins: [rehypeLeyes],
  },
});
