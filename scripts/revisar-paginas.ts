/**
 * pnpm revisar:paginas [--dist <carpeta>] [--solo <fragmento de ruta>] [--avisos]
 *
 * Revisa el sitio construido (`dist/`) página por página, como lo vería un lector, y falla si
 * encuentra lo que un lector ya señaló varias veces y los agentes volvieron a hacer:
 *
 *  1. Narración de proceso en texto para el lector (ids de corridas, «en esta corrida», «vuelta 2»,
 *     `notas.md`, `inbox`, nombres de archivo, «el editor», «el crítico»): eso vive en
 *     `data/corridas/`, no en la página.
 *  2. Bloques de texto largos sin plegar (un párrafo de más de 1.500 caracteres fuera de un
 *     `<details>`): «una página entera de texto que no dice nada». Aviso desde 800.
 *  3. Listas de renglones iguales (ocho o más ítems que empiezan igual): lo repetido se condensa.
 *  4. Contadores sin enlace («Hay 7 registros… en estado probable» sin `<a>`): un contador
 *     enlaza a lo que cuenta.
 *  5. Fichas sin su ayuda visual: una empresa sin gráfico o sin línea de tiempo; una persona con
 *     mandatos sin banda a escala; secciones vacías con explicación larga sin plegar.
 *
 * El crítico y el editor trabajan sobre YAML y no ven la página; este es el único chequeo que la
 * ve. Corre al final de `pnpm build` (así también en CI) y desde el chat antes de commitear.
 * Lo que no puede medir un HTML sin dibujarlo (superposiciones) se mide en el navegador con el
 * fragmento de `docs/revision-visual.md`.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { parseHTML } from 'linkedom';
import { parsearArgs } from './lib/log.ts';

interface Hallazgo {
  pagina: string;
  regla: string;
  nivel: 'error' | 'aviso';
  detalle: string;
}

const { opciones } = parsearArgs(process.argv.slice(2));
const dist = String(opciones.dist ?? 'dist');
const solo = opciones.solo ? String(opciones.solo) : undefined;
const mostrarAvisos = opciones.avisos === true;
if (!existsSync(dist)) {
  console.error(`No existe ${dist}: corré pnpm build primero.`);
  process.exit(1);
}

/* Páginas que hablan del proceso o son texto legal a propósito: no se les aplican las reglas 1 y 2. */
const PAGINAS_DE_PROCESO = [/^correcciones/, /^investigaciones/, /^sobre/, /^metodologia/, /^datos/, /^auditoria/, /^firmas/, /^reclamos/, /^replica/, /^probable/, /^sesgo-de-medios/, /^discrepancias/, /^cobertura/, /^privacidad/, /^leyes/];
/* Bloques que muestran procedencia o historial a propósito, y bloques que ya van plegados. */
const CLASES_EXCLUIDAS = ['procedencia', 'historial', 'fuentes', 'metodo', 'notas-tabla', 'compartir', 'lt-fuentes'];
const MARCADORES_PROCESO = [
  /\bcorrida\b[^.]{0,40}\b20\d\d-\d\d-\d\d/i,
  /\b(en )?esta corrida\b/i,
  /\bvuelta \d\b/i,
  /\binbox\b/i,
  /\bnotas\.md\b/i,
  /\brazones\.md\b/i,
  /\b[\w-]+\.ya?ml\b/i,
  /\b[\w-]+\.jsonl\b/i,
  /\b_slug\b/,
  /\bpnpm\b/,
  /--red\b/,
  /\bel investigador\b|\bel editor\b|\bel crítico\b|\bel resolvedor\b/i,
];

function listarHtml(carpeta: string): string[] {
  const salida: string[] = [];
  for (const nombre of readdirSync(carpeta)) {
    const ruta = join(carpeta, nombre);
    if (statSync(ruta).isDirectory()) salida.push(...listarHtml(ruta));
    else if (nombre.endsWith('.html')) salida.push(ruta);
  }
  return salida;
}

const texto = (el: Element | null | undefined) => (el?.textContent ?? '').replace(/\s+/g, ' ').trim();
const dentroDe = (el: Element, selector: string) => !!el.closest(selector);
const excluido = (el: Element) => CLASES_EXCLUIDAS.some((c) => dentroDe(el, `.${c}`)) || dentroDe(el, 'details') || dentroDe(el, 'nav') || dentroDe(el, 'footer') || dentroDe(el, 'header');

const hallazgos: Hallazgo[] = [];
const paginas = listarHtml(dist).filter((p) => !solo || p.includes(solo));

for (const archivo of paginas) {
  const ruta = relative(dist, archivo).replace(/\\/g, '/').replace(/\/?index\.html$/, '');
  const html = readFileSync(archivo, 'utf8');
  const { document } = parseHTML(html);
  const main = document.querySelector('main') ?? document.body;
  if (!main) continue;
  const anotar = (regla: string, nivel: Hallazgo['nivel'], detalle: string) => hallazgos.push({ pagina: `/${ruta}/`, regla, nivel, detalle });
  const esDeProceso = PAGINAS_DE_PROCESO.some((re) => re.test(ruta));

  // 1. Narración de proceso en texto para el lector.
  if (!esDeProceso) {
    for (const el of main.querySelectorAll('p, li, td, summary, h1, h2, h3, figcaption')) {
      if (excluido(el)) continue;
      const t = texto(el);
      for (const re of MARCADORES_PROCESO) {
        const m = t.match(re);
        if (m) {
          anotar('narracion-de-proceso', 'error', `«…${t.slice(Math.max(0, (m.index ?? 0) - 40), (m.index ?? 0) + 60)}…»`);
          break;
        }
      }
    }
  }

  // 2. Bloques largos sin plegar.
  if (!esDeProceso) {
    for (const el of main.querySelectorAll('p')) {
      if (excluido(el)) continue;
      const n = texto(el).length;
      if (n > 1500) anotar('bloque-largo', 'error', `párrafo de ${n} caracteres sin plegar: «${texto(el).slice(0, 80)}…»`);
      else if (n > 800) anotar('bloque-largo', 'aviso', `párrafo de ${n} caracteres: «${texto(el).slice(0, 80)}…»`);
    }
  }

  // 3. Listas de renglones iguales.
  for (const lista of main.querySelectorAll('ul, ol')) {
    if (excluido(lista)) continue;
    const items = [...lista.children].filter((li) => li.tagName === 'LI').map((li) => texto(li).slice(0, 30));
    if (items.length < 8) continue;
    const cuentas = new Map<string, number>();
    for (const i of items) cuentas.set(i, (cuentas.get(i) ?? 0) + 1);
    const [repetido, veces] = [...cuentas.entries()].sort((a, b) => b[1] - a[1])[0];
    if (veces >= 8) anotar('lista-repetida', 'error', `${veces} ítems que empiezan igual («${repetido}…»): se condensan en una oración con lista plegada`);
  }

  // 4. Contadores sin enlace.
  for (const el of main.querySelectorAll('p, div')) {
    if (excluido(el) || el.children.length > 6) continue;
    const t = texto(el);
    if (/\b(Hay|hay) \d+ registros?\b/.test(t) && !el.querySelector('a')) anotar('contador-sin-enlace', 'error', `«${t.slice(0, 90)}…» no enlaza a lo que cuenta`);
  }

  // 5. Ayudas visuales y secciones vacías.
  if (/^empresas\/[^/]+$/.test(ruta)) {
    if (!main.querySelector('svg') && !main.querySelector('canvas')) anotar('sin-grafico', 'error', 'ficha de empresa sin gráfico de finanzas');
    if (!main.querySelector('.lt')) anotar('sin-linea-de-tiempo', 'aviso', 'ficha de empresa sin línea de tiempo (¿faltan hitos[]?)');
  }
  if (/^politicos\/[^/]+$/.test(ruta)) {
    const mandatos = main.querySelectorAll('.mandatos > li').length;
    if (mandatos > 6) anotar('lista-repetida', 'error', `${mandatos} mandatos en renglones sueltos: los repetidos se condensan (banda a escala + lista plegada)`);
    if (mandatos >= 2 && !main.querySelector('.banda-mandatos')) anotar('sin-banda-mandatos', 'aviso', 'varios mandatos sin banda a escala');
  }
  for (const el of main.querySelectorAll('.vacio')) {
    if (dentroDe(el, 'details')) continue;
    const t = [...el.children].filter((c) => c.tagName !== 'DETAILS').map((c) => texto(c)).join(' ') || texto(el);
    if (t.length > 400) anotar('vacio-largo', 'aviso', `sección vacía con ${t.length} caracteres de explicación sin plegar`);
  }
}

const errores = hallazgos.filter((h) => h.nivel === 'error');
const avisos = hallazgos.filter((h) => h.nivel === 'aviso');
/* Las reglas estructurales (las produce el código de la página) cortan el build siempre. Las de
   contenido (narración de proceso, bloques largos) cortan con `--estricto`; mientras el contenido
   viejo se corrige por correcciones de presentación, se imprimen como pendientes para que nadie
   las pierda de vista. Cuando esa lista llegue a cero, `--estricto` pasa a ser el modo por defecto. */
const SIEMPRE_FATALES = new Set(['lista-repetida', 'contador-sin-enlace', 'sin-grafico']);
const estricto = opciones.estricto === true;
const fatales = errores.filter((h) => estricto || SIEMPRE_FATALES.has(h.regla));
const pendientes = errores.filter((h) => !fatales.includes(h));
const imprimir = (lista: Hallazgo[]) => {
  for (const h of lista) console.log(`${h.nivel === 'error' ? '✘' : '⚠'} ${h.pagina}  ${h.regla}  ${h.detalle}`);
};
if (fatales.length) {
  console.log(`\nErrores de presentación (${fatales.length})`);
  imprimir(fatales);
}
if (pendientes.length) {
  const porPagina = [...pendientes.reduce((m, h) => m.set(h.pagina, (m.get(h.pagina) ?? 0) + 1), new Map<string, number>()).entries()].sort((a, b) => b[1] - a[1]);
  console.log(`\nPendientes de contenido (${pendientes.length} en ${porPagina.length} páginas; cortan el build con --estricto): narración de proceso o bloques largos escritos en los registros. Se corrigen con una corrección de tipo presentacion.`);
  for (const [p, n] of porPagina.slice(0, 15)) console.log(`  ${p}  ${n}`);
  if (porPagina.length > 15) console.log(`  … y ${porPagina.length - 15} páginas más (pnpm revisar:paginas --estricto para el detalle)`);
  if (estricto) imprimir(pendientes);
}
if (avisos.length && mostrarAvisos) {
  console.log(`\nAvisos de presentación (${avisos.length})`);
  imprimir(avisos);
}
const porRegla = [...errores.reduce((m, h) => m.set(h.regla, (m.get(h.regla) ?? 0) + 1), new Map<string, number>()).entries()].map(([r, n]) => `${r} ${n}`).join(', ');
console.log(`\n${fatales.length ? '✘' : '✔'} revisar:paginas: ${paginas.length} página(s), ${fatales.length} error(es) que cortan${porRegla ? ` (${porRegla})` : ''}, ${pendientes.length} pendiente(s) de contenido, ${avisos.length} aviso(s)${mostrarAvisos ? '' : ' (--avisos para verlos)'}.`);
process.exit(fatales.length ? 1 : 0);
