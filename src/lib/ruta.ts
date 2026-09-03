/**
 * Rutas conscientes del `base` del sitio.
 *
 * El sitio se publica hoy en un subdirectorio (GitHub Pages de proyecto,
 * `https://ironleviosa.github.io/la-casta/`) y mañana en la raíz de un dominio
 * propio (`https://lacasta.uy/`). Para que mudarlo sea un solo cambio de
 * configuración, ninguna ruta del código se escribe a mano: todas pasan por
 * `ruta()`, que antepone el `base` vigente.
 *
 * De dónde sale el `base`, en orden:
 *
 *   1. `import.meta.env.BASE_URL` — lo inyecta Astro/Vite al construir el
 *      sitio. Es la fuente autorizada mientras corre `astro build` o `astro dev`.
 *   2. `process.env.BASE_PATH` — los scripts de `scripts/` corren bajo `tsx`,
 *      donde `import.meta.env` no existe. Ahí vale la variable de entorno.
 *   3. Los valores por defecto de abajo, que son los mismos que usa
 *      `astro.config.mjs` (de ahí los importa).
 *
 * Para mudar al dominio propio alcanza con exportar dos variables:
 *
 *     SITE_URL=https://lacasta.uy BASE_PATH=/
 */

/** Valores por defecto: subdirectorio de GitHub Pages. Los lee `astro.config.mjs`. */
export const SITIO_POR_DEFECTO = 'https://ironleviosa.github.io';
export const BASE_POR_DEFECTO = '/la-casta';

/** `import.meta.env` cuando existe (Astro/Vite); `{}` bajo `tsx` o Node pelado. */
function entornoVite(): Record<string, string | undefined> {
  const meta = import.meta as ImportMeta & { env?: Record<string, string | undefined> };
  return meta.env ?? {};
}

/** `process.env` cuando existe. */
function entornoNode(): Record<string, string | undefined> {
  return typeof process !== 'undefined' && process.env ? process.env : {};
}

/** Normaliza un base a la forma `/` o `/algo/` (siempre con barra final). */
function normalizarBase(valor: string | undefined | null): string {
  const v = (valor ?? '').trim();
  if (!v || v === '/') return '/';
  const conInicio = v.startsWith('/') ? v : `/${v}`;
  return conInicio.endsWith('/') ? conInicio : `${conInicio}/`;
}

/** Base vigente, siempre con barra final (`/` o `/la-casta/`). */
export function base(): string {
  const vite = entornoVite();
  if (vite.BASE_URL != null) return normalizarBase(vite.BASE_URL);
  return normalizarBase(entornoNode().BASE_PATH ?? BASE_POR_DEFECTO);
}

/** Origen del sitio, sin barra final (`https://lacasta.uy`). */
export function sitio(): string {
  const vite = entornoVite();
  const s = vite.SITE ?? entornoNode().SITE_URL ?? SITIO_POR_DEFECTO;
  return String(s).replace(/\/+$/, '');
}

/** ¿La ruta ya es una URL completa (`https:`, `mailto:`) o protocol-relative? */
function esExterna(p: string): boolean {
  return p.startsWith('//') || /^[a-z][a-z0-9+.\-]*:/i.test(p);
}

/**
 * Ruta interna con el `base` del sitio antepuesto.
 *
 * Es idempotente (`ruta(ruta(x)) === ruta(x)`) y deja pasar sin tocar las
 * anclas (`#giros`) y las URLs externas.
 *
 *     ruta('/')          → '/la-casta/'
 *     ruta('/sobre/')    → '/la-casta/sobre/'
 *     ruta('#giros')     → '#giros'
 */
export function ruta(p: string): string {
  if (!p) return base();
  if (p.startsWith('#') || esExterna(p)) return p;
  const b = base();
  const abs = p.startsWith('/') ? p : `/${p}`;
  if (b === '/') return abs;
  const prefijo = b.slice(0, -1); // '/la-casta'
  if (abs === prefijo || abs.startsWith(b)) return abs; // ya lleva el base
  return prefijo + abs;
}

/**
 * URL absoluta (origen + base + ruta) de una ruta interna. Para canónicas,
 * Open Graph, JSON-LD y datos abiertos.
 */
export function urlAbsoluta(p: string): string {
  const r = ruta(p);
  if (esExterna(r)) return r;
  return new URL(r, `${sitio()}/`).toString();
}
