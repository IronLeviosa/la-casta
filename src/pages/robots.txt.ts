/**
 * `robots.txt` generado en el build.
 *
 * Antes era un archivo estático en `public/`, pero las rutas que excluye
 * dependen del `base` del sitio: bajo GitHub Pages de proyecto la sección
 * reservada es `/la-casta/probable/`, y en el dominio propio `/probable/`.
 * Un `Disallow` con el prefijo equivocado no excluye nada.
 */
import type { APIRoute } from 'astro';
import { ruta, urlAbsoluta } from '../lib/ruta';

const cuerpo = () => `# La Casta — ${urlAbsoluta('/')}
# Todo el contenido publicado es indexable. La sección ${ruta('/probable/')} reúne
# registros que todavía no cumplen todas las reglas de publicación y se
# excluye a propósito (además de llevar noindex en cada página).

User-agent: *
Allow: ${ruta('/')}
Disallow: ${ruta('/probable/')}
`;

export const GET: APIRoute = () =>
  new Response(cuerpo(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
