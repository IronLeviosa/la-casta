/**
 * pnpm revisar:paginas [--dist <carpeta>] [--solo <fragmento de ruta>] [--avisos] [--laxo]
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
 *     mandatos sin banda a escala; secciones vacías con explicación larga sin plegar; y ningún
 *     visual dentro de un desplegable cerrado: lo que se pliega es texto.
 *  6. Lo que un visual ya muestra, repetido en listas debajo (los mismos enlaces): «otra vez una
 *     pantalla de texto».
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
import { MARCADORES_PROCESO } from './lib/presentacion.ts';

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
const PAGINAS_DE_PROCESO = [/^correcciones/, /^investigaciones/, /^sobre/, /^metodologia/, /^datos/, /^auditoria/, /^reclamos/, /^replica/, /^probable/, /^sesgo-de-medios/, /^discrepancias/, /^cobertura/, /^privacidad/, /^leyes/];
/* Bloques que muestran procedencia o historial a propósito, y bloques que ya van plegados. */
const CLASES_EXCLUIDAS = ['procedencia', 'historial', 'fuentes', 'metodo', 'notas-tabla', 'compartir', 'lt-fuentes'];
/* Las expresiones regulares viven en scripts/lib/presentacion.ts, compartidas con la etapa
   `presentacion` del validador (scripts/validadores/presentacion.ts), para que las dos
   herramientas midan exactamente lo mismo en el YAML crudo y en el sitio construido. */

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
/* Lo que el lector ve de un bloque: sin los globos ni las tarjetas que solo aparecen al pasar el
   cursor (un chequeo marcado dentro de una cita agrega 600 caracteres ocultos por marca). */
const textoVisible = (el: Element) => {
  const copia = el.cloneNode(true) as Element;
  for (const oculto of copia.querySelectorAll('[role="tooltip"], .globo, .lt-tarjeta, .ref-ley-tarjeta, .visualmente-oculto')) oculto.remove();
  return texto(copia);
};
const dentroDe = (el: Element, selector: string) => !!el.closest(selector);
const excluido = (el: Element) => CLASES_EXCLUIDAS.some((c) => dentroDe(el, `.${c}`)) || dentroDe(el, 'details') || dentroDe(el, 'nav') || dentroDe(el, 'footer') || dentroDe(el, 'header');
/* La narración de proceso sigue siendo texto para el lector aunque esté plegada: un desplegable no
   la exime. (Lo largo sí queda eximido dentro de un desplegable: plegarlo es justamente la regla.) */
const excluidoDeProceso = (el: Element) =>
  CLASES_EXCLUIDAS.filter((c) => c !== 'notas-tabla').some((c) => dentroDe(el, `.${c}`)) || dentroDe(el, 'nav') || dentroDe(el, 'footer') || dentroDe(el, 'header');

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
      if (excluidoDeProceso(el)) continue;
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
      const t = textoVisible(el);
      const n = t.length;
      if (n > 1500) anotar('bloque-largo', 'error', `párrafo de ${n} caracteres sin plegar: «${t.slice(0, 80)}…»`);
      else if (n > 800) anotar('bloque-largo', 'aviso', `párrafo de ${n} caracteres: «${t.slice(0, 80)}…»`);
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
    // Siete cargos distintos son siete renglones legítimos; lo que se condensa es el mismo cargo
    // repetido (veintiocho suplencias de un día).
    const cargos = [...main.querySelectorAll('.mandatos > li > strong')].map((s) => texto(s));
    const repeticiones = new Map<string, number>();
    for (const c of cargos) repeticiones.set(c, (repeticiones.get(c) ?? 0) + 1);
    for (const [cargo, veces] of repeticiones) if (veces >= 4) anotar('lista-repetida', 'error', `${veces} renglones del mismo cargo («${cargo}»): se condensan en una oración con banda a escala y lista plegada`);
    if (cargos.length >= 2 && !main.querySelector('.banda-mandatos')) anotar('sin-banda-mandatos', 'aviso', 'varios mandatos sin banda a escala');
  }
  // Ningún visual va plegado: la línea de tiempo, el gráfico, la banda de mandatos y el hemiciclo
  // se ven al abrir la página (son lo más fácil de interpretar y lo que descarga el texto); lo que
  // se pliega es texto. Un lector abrió la ficha de ANCAP con la línea de tiempo bajo «Ver la línea
  // de tiempo completa» y pidió que ningún elemento visual quedara escondido (2026-09-10).
  for (const visual of main.querySelectorAll('.lt, .grafico, .linea-mandato, .hemiciclo, figure svg, canvas')) {
    const plegado = visual.closest('details:not([open])');
    if (!plegado) continue;
    const nombre = visual.id || visual.className || visual.tagName.toLowerCase();
    anotar('visual-plegado', 'error', `${nombre} dentro de un desplegable («${texto(plegado.querySelector('summary')).slice(0, 60)}»): los visuales se ven al abrir la página; lo que se pliega es texto`);
  }
  for (const el of main.querySelectorAll('.vacio')) {
    if (dentroDe(el, 'details')) continue;
    const t = [...el.children].filter((c) => c.tagName !== 'DETAILS').map((c) => texto(c)).join(' ') || texto(el);
    if (t.length > 400) anotar('vacio-largo', 'aviso', `sección vacía con ${t.length} caracteres de explicación sin plegar`);
  }

  // 6. Lo que un visual ya muestra, repetido en texto debajo: una línea de tiempo (o un gráfico)
  //    seguida, hasta el próximo título, de listas o tablas cuyos enlaces son los mismos que los del
  //    visual. Un lector lo describió como «otra vez una pantalla de texto» y como «tres clics para
  //    llegar a la información».
  for (const visual of main.querySelectorAll('.lt, figure, .grafico')) {
    const propios = new Set([...visual.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')));
    if (propios.size < 5) continue;
    const repetidos = new Set<string>();
    let total = 0;
    for (let el = visual.nextElementSibling; el && !/^H[1-6]$/.test(el.tagName); el = el.nextElementSibling) {
      for (const a of el.querySelectorAll('ul a[href], ol a[href], table a[href], details a[href]')) {
        total++;
        const h = a.getAttribute('href');
        if (h && propios.has(h)) repetidos.add(h);
      }
    }
    if (total >= 5 && repetidos.size >= Math.ceil(propios.size * 0.8)) {
      anotar('duplicado-tras-visual', 'error', `${repetidos.size} de los ${propios.size} enlaces del visual (${visual.id || visual.className}) se repiten en una lista debajo: el detalle va en la tarjeta del punto y en la página del registro`);
    }
  }
}

const errores = hallazgos.filter((h) => h.nivel === 'error');
const avisos = hallazgos.filter((h) => h.nivel === 'aviso');
/* Todo error corta el build. Las reglas de contenido (narración de proceso, bloques largos) se
   incorporaron con `--estricto` opcional mientras el contenido viejo se corregía por correcciones de
   presentación (lotes del 2026-09-09); con esa lista en cero, el modo estricto es el de siempre y
   `--laxo` queda solo para ver cuánto falta cuando entra contenido nuevo con problemas. */
const SIEMPRE_FATALES = new Set(['lista-repetida', 'contador-sin-enlace', 'sin-grafico', 'duplicado-tras-visual', 'visual-plegado']);
const estricto = opciones.laxo !== true;
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
  console.log(`\nPendientes de contenido (${pendientes.length} en ${porPagina.length} páginas; cortan el build sin --laxo): narración de proceso o bloques largos escritos en los registros. Se corrigen con una corrección de tipo presentacion.`);
  for (const [p, n] of porPagina.slice(0, 15)) console.log(`  ${p}  ${n}`);
  if (porPagina.length > 15) console.log(`  … y ${porPagina.length - 15} páginas más (pnpm revisar:paginas para el detalle)`);
  if (estricto) imprimir(pendientes);
}
if (avisos.length && mostrarAvisos) {
  console.log(`\nAvisos de presentación (${avisos.length})`);
  imprimir(avisos);
}
const porRegla = [...errores.reduce((m, h) => m.set(h.regla, (m.get(h.regla) ?? 0) + 1), new Map<string, number>()).entries()].map(([r, n]) => `${r} ${n}`).join(', ');
console.log(`\n${fatales.length ? '✘' : '✔'} revisar:paginas: ${paginas.length} página(s), ${fatales.length} error(es) que cortan${porRegla ? ` (${porRegla})` : ''}, ${pendientes.length} pendiente(s) de contenido, ${avisos.length} aviso(s)${mostrarAvisos ? '' : ' (--avisos para verlos)'}.`);
process.exit(fatales.length ? 1 : 0);
