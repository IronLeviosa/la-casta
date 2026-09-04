/**
 * Plugin de rehype que convierte las referencias a leyes del Markdown de
 * `content/paginas/` en la tarjeta de `Ley.astro`.
 *
 * Por qué un plugin y no HTML escrito a mano en cada página: una referencia como
 * "ley 18.331" aparece en prosa, en medio de una oración, y va a seguir
 * apareciendo. Si la marca la tiene que poner quien escribe, funciona solo donde
 * alguien se acordó. Como transformación, funciona en todas.
 *
 * Qué hace, en concreto: recorre el árbol HTML ya generado, busca en los nodos de
 * texto las formas descritas en `RE_REFERENCIA` (`src/lib/leyes.ts`) y reemplaza
 * cada una por el mismo marcado que emite `Ley.astro`. Los resúmenes se leen de
 * `content/leyes/*.yaml` una sola vez, al construir el sitio.
 *
 * Qué no toca:
 *   - texto dentro de enlaces (`a`), porque anidar enlaces es HTML inválido;
 *   - `code`, `pre`, `kbd`, `samp`, donde el texto es literal;
 *   - títulos (`h1` a `h6`), donde una tarjeta flotante estorba;
 *   - lo que ya está dentro de una tarjeta.
 *
 * Un número de ley que no tenga archivo en `content/leyes/` se deja tal cual: la
 * página no se rompe, simplemente no hay tarjeta.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import { NOTA_TARJETA, idDeNumero, partesDeTarjeta, referenciasEn, type LeyMinima } from './leyes.ts';
import { ruta } from './ruta.ts';

// ---------------------------------------------------------------------------
// hast mínimo (sin dependencias: el árbol que recibe un plugin de rehype)
// ---------------------------------------------------------------------------

interface NodoTexto {
  type: 'text';
  value: string;
  /** Un nodo de texto no tiene hijos; se declara para poder leer `nodo.children` sobre la unión. */
  children?: undefined;
}
interface NodoElemento {
  type: 'element';
  tagName: string;
  properties?: Record<string, unknown>;
  children: Nodo[];
}
interface NodoOtro {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: Nodo[];
  value?: string;
}
type Nodo = NodoTexto | NodoElemento | NodoOtro;

function esTexto(n: Nodo): n is NodoTexto {
  return n.type === 'text' && typeof (n as NodoTexto).value === 'string';
}
function esElemento(n: Nodo): n is NodoElemento {
  return n.type === 'element' && typeof (n as NodoElemento).tagName === 'string';
}

function elemento(tagName: string, properties: Record<string, unknown>, children: Nodo[] = []): NodoElemento {
  return { type: 'element', tagName, properties, children };
}
function texto(value: string): NodoTexto {
  return { type: 'text', value };
}

/** Etiquetas dentro de las cuales no se transforma nada. */
const OPACAS = new Set(['a', 'code', 'pre', 'kbd', 'samp', 'script', 'style', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']);

// ---------------------------------------------------------------------------
// Carga de content/leyes/
// ---------------------------------------------------------------------------

/** Lee `content/leyes/*.yaml` y devuelve el mapa `numero → ley`. */
export function cargarLeyes(carpeta: string): Map<string, LeyMinima> {
  const mapa = new Map<string, LeyMinima>();
  if (!existsSync(carpeta)) return mapa;
  for (const archivo of readdirSync(carpeta)) {
    if (!archivo.endsWith('.yaml')) continue;
    const datos = parseYaml(readFileSync(path.join(carpeta, archivo), 'utf8')) as (LeyMinima & { revision?: { tier?: string } }) | null;
    if (!datos || typeof datos.numero !== 'string') continue;
    // Solo se enlaza lo publicado: una ley en tier probable no tiene página servida.
    if (datos.revision?.tier !== 'publicado') continue;
    mapa.set(datos.numero, datos);
  }
  return mapa;
}

// ---------------------------------------------------------------------------
// Marcado de la tarjeta
// ---------------------------------------------------------------------------

/**
 * Construye el marcado de una referencia. Es el mismo que emite `Ley.astro`;
 * si cambia uno tiene que cambiar el otro (y el bloque `.ref-ley` de global.css).
 */
function tarjeta(ley: LeyMinima, etiqueta: string, articulo: string | undefined, n: number): NodoElemento {
  const id = idDeNumero(ley.numero);
  const idTarjeta = `ley-${id}-${n}`;
  const p = partesDeTarjeta({ ley, etiqueta, articulo, hrefFicha: ruta(`/leyes/${id}/`), idTarjeta });

  const cuerpo: Nodo[] = [
    elemento('span', { className: ['ref-ley-cab'] }, [texto(p.cabecera)]),
    elemento('span', { className: ['ref-ley-titulo'] }, [texto(p.titulo)]),
    elemento('span', { className: ['ref-ley-resumen'] }, [texto(p.resumen)]),
  ];
  if (p.articuloTitulo && p.articuloResumen) {
    cuerpo.push(
      elemento('span', { className: ['ref-ley-art'] }, [
        elemento('b', {}, [texto(`${p.articuloTitulo}. `)]),
        texto(p.articuloResumen),
      ]),
    );
  }
  cuerpo.push(
    elemento('span', { className: ['ref-ley-pie'] }, [
      elemento('a', { href: p.hrefFicha }, [texto('Ficha en el sitio')]),
      elemento('a', { href: p.hrefImpo, rel: ['external', 'nofollow'] }, [texto('Texto oficial (IMPO)')]),
    ]),
    elemento('span', { className: ['ref-ley-nota'] }, [texto(NOTA_TARJETA)]),
  );

  return elemento('span', { className: ['ref-ley'] }, [
    elemento('a', { className: ['ref-ley-ancla'], href: p.hrefFicha, 'aria-describedby': idTarjeta }, [texto(p.etiqueta)]),
    elemento('span', { className: ['ref-ley-tarjeta'], id: idTarjeta, role: 'note' }, cuerpo),
  ]);
}

// ---------------------------------------------------------------------------
// Plugin
// ---------------------------------------------------------------------------

export interface OpcionesRehypeLeyes {
  /** Carpeta de la colección (por defecto `content/leyes` desde la raíz del proceso). */
  carpeta?: string;
  /** Mapa ya cargado (para tests). */
  leyes?: Map<string, LeyMinima>;
}

/** Memoria por carpeta: unified instancia un procesador por archivo Markdown. */
const cache = new Map<string, Map<string, LeyMinima>>();
function leyesDe(carpeta: string): Map<string, LeyMinima> {
  let m = cache.get(carpeta);
  if (!m) {
    m = cargarLeyes(carpeta);
    cache.set(carpeta, m);
  }
  return m;
}

/**
 * Attacher de unified: va en `markdown.rehypePlugins` **sin invocar**
 * (`rehypePlugins: [rehypeLeyes]`, o `[[rehypeLeyes, opciones]]` con opciones).
 * unified llama al attacher y usa lo que devuelve como transformación; si se le
 * pasa `rehypeLeyes()` ya invocado, unified toma la transformación por attacher
 * y la llama sin árbol, así que no hace nada.
 */
export function rehypeLeyes(opciones: OpcionesRehypeLeyes = {}) {
  const leyes = opciones.leyes ?? leyesDe(opciones.carpeta ?? path.join(process.cwd(), 'content', 'leyes'));

  return function transformar(arbol: Nodo): void {
    if (leyes.size === 0) return;
    let n = 0;

    const recorrer = (nodo: Nodo): void => {
      const hijos = nodo.children;
      if (!Array.isArray(hijos)) return;

      const nuevos: Nodo[] = [];
      let cambio = false;

      for (const hijo of hijos) {
        if (esTexto(hijo)) {
          const valor = hijo.value;
          const referencias = referenciasEn(valor).filter((r) => leyes.has(r.numero));
          if (referencias.length === 0) {
            nuevos.push(hijo);
            continue;
          }
          cambio = true;
          let cursor = 0;
          for (const r of referencias) {
            if (r.inicio > cursor) nuevos.push(texto(valor.slice(cursor, r.inicio)));
            nuevos.push(tarjeta(leyes.get(r.numero)!, r.texto, r.articulo, n++));
            cursor = r.fin;
          }
          if (cursor < valor.length) nuevos.push(texto(valor.slice(cursor)));
          continue;
        }

        nuevos.push(hijo);
        if (esElemento(hijo)) {
          const clases = hijo.properties?.className;
          const esTarjeta = Array.isArray(clases) && clases.includes('ref-ley');
          if (!OPACAS.has(hijo.tagName) && !esTarjeta) recorrer(hijo);
        }
      }

      if (cambio) nodo.children = nuevos;
    };

    recorrer(arbol);
  };
}

export default rehypeLeyes;
