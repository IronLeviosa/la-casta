/**
 * Gráficos de la página «Datos procesados», compartidos entre la construcción del sitio (el
 * estado sin filtros) y el navegador (cada vez que el lector filtra). Un solo dibujante para
 * que lo que se ve con y sin JavaScript sea lo mismo: cifras entre categorías → barras
 * horizontales con el nombre enlazado a su ficha; cifras en el tiempo → barras por día.
 * Sin librerías: HTML y SVG.
 */

export interface FilaBarra {
  clave: string;
  nombre: string;
  href?: string;
  valor: number;
  /** Texto chico a la derecha del valor («1.962 fuentes»). */
  detalle?: string;
}

export interface Dia {
  dia: string;
  n: number;
  chars: number;
}

/** Fila compacta de `data/corpus-notas.json`: tipo, medio, empresa, caracteres, día, políticos, temas, eventos. */
export interface NotaCompacta {
  t: string;
  m: string;
  e?: string;
  c: number;
  d: string;
  p: string[];
  x: string[];
  v: string[];
}

export const M = (n: number): string => (n >= 1e6 ? `${(n / 1e6).toFixed(1)} M` : n >= 1e3 ? `${(n / 1e3).toFixed(0)} mil` : String(Math.round(n)));
export const enteros = (n: number): string => Math.round(n).toLocaleString('es-UY');
export const tokens = (chars: number): number => Math.round(chars / 4);

const esc = (s: string): string => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Barras horizontales: una por fila, largo proporcional al máximo, nombre enlazado si hay ficha. */
export function barrasHorizontales(filas: FilaBarra[], formato: (n: number) => string = enteros, opciones: { max?: number; vacio?: string } = {}): string {
  if (filas.length === 0) return `<p class="vacio chico">${esc(opciones.vacio ?? 'Nada que mostrar con estos filtros.')}</p>`;
  const max = Math.max(1, opciones.max ?? Math.max(...filas.map((f) => f.valor)));
  return `<ol class="hbar">${filas
    .map((f) => {
      const nombre = f.href ? `<a href="${esc(f.href)}">${esc(f.nombre)}</a>` : esc(f.nombre);
      const ancho = Math.max(0.5, (f.valor / max) * 100).toFixed(1);
      return `<li><span class="k">${nombre}</span><span class="b"><i style="width:${ancho}%"></i></span><span class="v">${esc(formato(f.valor))}${f.detalle ? `<small> ${esc(f.detalle)}</small>` : ''}</span></li>`;
    })
    .join('')}</ol>`;
}

/** Escala «bonita» del eje vertical: tres o cuatro marcas redondas que cubren el máximo. */
function paso(max: number): number {
  const bruto = max / 3;
  const pot = 10 ** Math.floor(Math.log10(bruto || 1));
  const n = bruto / pot;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * pot;
}

/** Barras por día: eje horizontal a escala de fechas, una barra por día con dato, valor arriba. */
export function barrasPorDia(dias: Dia[], serie: 'fuentes' | 'tokens', titulo: string): string {
  const puntos = dias.filter((d) => d.dia).map((d) => ({ dia: d.dia, y: serie === 'fuentes' ? d.n : tokens(d.chars) }));
  if (puntos.length === 0) return `<p class="vacio chico">Sin fuentes con estos filtros.</p>`;
  /* Ancho de referencia pensado para dos gráficos por fila (unos 420 px cada uno): así el texto
     de 11 px se ve a tamaño real y no encogido a la mitad. */
  const W = 420;
  const H = 200;
  /* Margen izquierdo para que «150,0 M» entre entero: un rótulo cortado se lee como otro número. */
  const izq = 62;
  const der = 10;
  const arriba = 30;
  const abajo = 36;
  const maxY = Math.max(1, ...puntos.map((p) => p.y));
  const p = paso(maxY);
  const yMax = Math.ceil(maxY / p) * p || p;
  const dia0 = Date.parse(puntos[0].dia);
  const dia1 = Date.parse(puntos[puntos.length - 1].dia);
  const nDias = Math.max(1, Math.round((dia1 - dia0) / 86_400_000) + 1);
  const anchoUtil = W - izq - der;
  const anchoDia = anchoUtil / nDias;
  const barra = Math.max(2, Math.min(40, anchoDia * 0.7));
  const x = (dia: string) => izq + ((Date.parse(dia) - dia0) / 86_400_000) * anchoDia + anchoDia / 2;
  const y = (v: number) => arriba + (H - arriba - abajo) * (1 - v / yMax);
  const fmt = serie === 'fuentes' ? enteros : M;
  const marcas: number[] = [];
  for (let v = 0; v <= yMax + 1e-9; v += p) marcas.push(v);
  // Rótulos del eje: todos los días si entran (unos 56 px por rótulo), si no uno de cada tantos.
  const cadaN = Math.max(1, Math.ceil(44 / anchoDia));
  const rotulo = (dia: string) => {
    const [a, m, d] = dia.split('-');
    return `${Number(d)}/${Number(m)}${nDias > 300 ? `/${a.slice(2)}` : ''}`;
  };
  const rotulados = puntos.filter((_, i) => i % cadaN === 0 || i === puntos.length - 1);
  const filas = puntos.map((q) => `<tr><td>${esc(q.dia)}</td><td>${esc(fmt(q.y))}</td></tr>`).join('');
  return `<svg viewBox="0 0 ${W} ${H}" class="g-dia" role="img" aria-labelledby="${esc(`t-${serie}`)}"><title id="${esc(`t-${serie}`)}">${esc(titulo)}</title>
${marcas.map((v) => `<line x1="${izq}" x2="${W - der}" y1="${y(v).toFixed(1)}" y2="${y(v).toFixed(1)}" class="reja"/><text x="${izq - 6}" y="${(y(v) + 4).toFixed(1)}" text-anchor="end" class="eje">${esc(fmt(v))}</text>`).join('')}
${puntos.map((q) => `<rect x="${(x(q.dia) - barra / 2).toFixed(1)}" y="${y(q.y).toFixed(1)}" width="${barra.toFixed(1)}" height="${(y(0) - y(q.y)).toFixed(1)}" class="barra"><title>${esc(q.dia)}: ${esc(fmt(q.y))}</title></rect>${nDias <= 40 ? `<text x="${x(q.dia).toFixed(1)}" y="${(y(q.y) - 5).toFixed(1)}" text-anchor="middle" class="valor">${esc(fmt(q.y))}</text>` : ''}`).join('')}
${rotulados.map((q) => `<text x="${x(q.dia).toFixed(1)}" y="${H - abajo + 18}" text-anchor="middle" class="eje">${esc(rotulo(q.dia))}</text>`).join('')}
</svg><table class="visualmente-oculto"><caption>${esc(titulo)}</caption><thead><tr><th scope="col">Día</th><th scope="col">${serie === 'fuentes' ? 'Fuentes' : 'Tokens (estimación)'}</th></tr></thead><tbody>${filas}</tbody></table>`;
}

export interface Agregado {
  n: number;
  chars: number;
}
export interface Agregados {
  fuentes: number;
  chars: number;
  dia: Dia[];
  tipo: [string, Agregado][];
  medio: [string, Agregado][];
  empresa: [string, Agregado][];
  politico: [string, Agregado][];
  tema: [string, Agregado][];
  evento: [string, Agregado][];
}

/** Agrega la lista compacta de fuentes (ya filtrada) por cada eje que la página dibuja. */
export function agregar(notas: NotaCompacta[]): Agregados {
  const mapa = () => new Map<string, Agregado>();
  const suma = (m: Map<string, Agregado>, k: string, c: number) => {
    const a = m.get(k) ?? { n: 0, chars: 0 };
    a.n++;
    a.chars += c;
    m.set(k, a);
  };
  const tipo = mapa(), medio = mapa(), empresa = mapa(), politico = mapa(), tema = mapa(), evento = mapa(), dia = mapa();
  let chars = 0;
  for (const nota of notas) {
    chars += nota.c;
    suma(tipo, nota.t || '', nota.c);
    suma(medio, nota.m || '', nota.c);
    if (nota.e) suma(empresa, nota.e, nota.c);
    if (nota.d) suma(dia, nota.d, nota.c);
    for (const p of nota.p) suma(politico, p, nota.c);
    for (const x of nota.x) suma(tema, x, nota.c);
    for (const v of nota.v) suma(evento, v, nota.c);
  }
  const ordenar = (m: Map<string, Agregado>) => [...m.entries()].sort((a, b) => b[1].n - a[1].n);
  return {
    fuentes: notas.length,
    chars,
    dia: [...dia.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([d, a]) => ({ dia: d, n: a.n, chars: a.chars })),
    tipo: ordenar(tipo),
    medio: ordenar(medio),
    empresa: ordenar(empresa),
    politico: ordenar(politico),
    tema: ordenar(tema),
    evento: ordenar(evento),
  };
}
