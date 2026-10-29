/**
 * Reglas de presentación para el lector, compartidas por dos herramientas que miden lo mismo en
 * dos momentos distintos: `scripts/validadores/presentacion.ts` (etapa del validador, sobre el
 * YAML crudo, antes de publicar) y `scripts/revisar-paginas.ts` (sobre el sitio construido,
 * después). docs/colecciones/presentacion.md, "Texto para el lector, no para el rastro", y plan
 * 2026-09, ítem 2.4: "Comparte módulo con revisar:paginas, que hoy mide lo mismo sobre el sitio
 * construido, cuando ya es tarde".
 *
 * Antes las expresiones regulares de narración de proceso vivían solo en revisar-paginas.ts, así
 * que un registro con "en esta corrida..." pasaba el validador del inbox y recién se detectaba
 * después de promover, archivar y construir el sitio. Un solo lugar para las reglas hace que las
 * dos herramientas midan exactamente lo mismo.
 */
import type { NombreColeccion } from '../../src/schemas/comunes';

// ---------------------------------------------------------------------------
// Narración de proceso
// ---------------------------------------------------------------------------

/**
 * Marcas de que el texto describe la corrida en vez de describir el hecho para el lector: ids de
 * corridas, «vuelta 2», nombres de archivo internos, roles del pipeline. Común a las dos
 * herramientas para que un cambio acá valga para las dos.
 */
export const MARCADORES_PROCESO: RegExp[] = [
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

/**
 * Marcas que casi siempre son narración de proceso pero tienen una lectura legítima, así que
 * avisan en vez de cortar: «esta sesión» puede ser la sesión del agente (proceso) o una sesión
 * parlamentaria citada (hecho; entonces va con fecha y cámara). Lo pidió el crítico de la lectura
 * de Batlle (2026-09-16) tras verla en un chequeo; el barrido sobre todo `content/` es simétrico.
 */
export const MARCADORES_PROCESO_AVISO: RegExp[] = [/esta sesión/i, /en esta investigación/i, /no (se )?pud[eo] abrir/i];

/** Primer marcador de proceso que aparece en `texto`, o null si no hay ninguno. */
export function detectarProceso(texto: string): RegExpExecArray | null {
  for (const re of MARCADORES_PROCESO) {
    const m = re.exec(texto);
    if (m) return m;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Medidas de texto (heurísticas de docs/colecciones/presentacion.md)
// ---------------------------------------------------------------------------

/** Cantidad de palabras de un párrafo (separadas por espacio en blanco). */
export function contarPalabras(texto: string): number {
  const t = texto.trim();
  return t ? t.split(/\s+/).length : 0;
}

/**
 * Abreviaturas cuyo punto no termina una oración (en minúscula y sin el punto; se comparan sin
 * distinguir mayúsculas, así que «Art.» y «art.» son la misma). Lista conservadora, a propósito:
 * una abreviatura que también es una palabra que cierra oraciones («ley», «etc.») no va. Las
 * primeras salen del español corriente de las citas legales y de los títulos de cargo; `prev`,
 * `cap`, `imp`, `integrac`, `distrib`, `aprox` y `depto` las trae el texto de las fichas de
 * empresas públicas («Vida Prev.», «Cap. por inversiones», «Integrac. (rescate)»). Una
 * abreviatura al final del texto sí cierra la oración; ver `contarTerminadores`.
 */
export const ABREVIATURAS_SIN_FIN_DE_ORACION: ReadonlySet<string> = new Set([
  'art', 'arts', 'inc', 'lit', 'num', 'núm', 'nº', 'n°', 'nro', 'pág', 'págs', 'cap', 'dec', 'res',
  'prev', 'gral', 'dr', 'dra', 'sr', 'sra', 'ltda', 'cía', 'ing', 'esc', 'cr', 'cra', 'lic', 'prof',
  'pres', 'vicepres', 'dpto', 'depto', 'ee', 'imp', 'integrac', 'distrib', 'aprox',
]);

/**
 * ¿El punto (o grupo de puntos) de `texto[ini, fin)` termina una oración? Solo para grupos de
 * puntos: «!» y «?» no pasan por acá. No termina si lo que sigue, saltando los cierres pegados al
 * punto (comillas, paréntesis), empieza con minúscula («Cap. por inversiones», «ose.com.uy») o con
 * una coma, punto y coma, dos puntos o signo ordinal («N.° 81»); ni si lo que lo precede es una
 * letra mayúscula sola en cadena con otra (sigla con puntos: «S.A.», «S. A.», «M.V.O.T.M.A.»,
 * «U.I.»: la letra viene después de un punto o la sigue otra letra mayúscula con su punto) o una
 * abreviatura de `ABREVIATURAS_SIN_FIN_DE_ORACION`. Una letra mayúscula sola fuera de una cadena
 * («$ 582,8 M. El Estado…») sí termina oración. Una oración nueva empieza con mayúscula, dígito,
 * comilla o paréntesis, y el punto de un texto que se acaba ahí cierra la oración aunque sea el
 * de una sigla o una abreviatura.
 */
function terminaOracionElPunto(texto: string, ini: number, fin: number): boolean {
  let j = fin;
  while (j < texto.length && /["»”’')\]]/.test(texto[j])) j++;
  const resto = texto.slice(j).trimStart();
  if (resto === '') return true;
  if (/^\p{Ll}/u.test(resto) || /^[,;:°º]/.test(resto)) return false;
  const palabra = /([\p{L}º°ª]+)$/u.exec(texto.slice(0, ini))?.[1];
  if (palabra) {
    const mayusculaSola = palabra.length === 1 && palabra === palabra.toUpperCase() && palabra !== palabra.toLowerCase();
    if (mayusculaSola && (texto[ini - 2] === '.' || /^\s?\p{Lu}\./u.test(texto.slice(fin)))) return false;
    if (ABREVIATURAS_SIN_FIN_DE_ORACION.has(palabra.toLowerCase())) return false;
  }
  return true;
}

/**
 * Cuenta los terminadores de oración (. ! ?) sin contar el punto decimal de un número ("12.5") ni
 * repetir puntuación seguida ("...", "?!") como más de un terminador. Heurística, no gramática: un
 * texto de "una sola oración" tiene a lo sumo uno. Los puntos de siglas («S.A.», «M.V.O.T.M.A.»),
 * de abreviaturas conocidas («art. 190», «Vida Prev.») y los seguidos de minúscula no terminan
 * oración (`terminaOracionElPunto`); un punto seguido de espacio y mayúscula sigue contando. «!» y
 * «?» cuentan siempre.
 */
export function contarTerminadores(texto: string): number {
  let n = 0;
  for (const m of texto.matchAll(/(?<!\d)[.!?]+(?!\d)/g)) {
    if (/^\.+$/.test(m[0]) && !terminaOracionElPunto(texto, m.index, m.index + m[0].length)) continue;
    n++;
  }
  return n;
}

// ---------------------------------------------------------------------------
// Gráficos: recorrido genérico (misma forma que recorrerFuentes/recorrerEvidencias)
// ---------------------------------------------------------------------------

export interface SerieMinima {
  fuente: string;
}

export interface GraficoMinimo {
  nota?: string;
  series: SerieMinima[];
}

function esGraficoMinimo(v: unknown): v is GraficoMinimo {
  return (
    !!v &&
    typeof v === 'object' &&
    Array.isArray((v as any).series) &&
    (v as any).series.length > 0 &&
    (v as any).series.every((s: any) => s && typeof s === 'object' && typeof s.fuente === 'string')
  );
}

/** Recorre `datos` y llama a `cb` por cada objeto con forma de Gráfico (crearGraficoSchema). */
export function recorrerGraficos(datos: unknown, cb: (grafico: GraficoMinimo, ruta: string) => void, ruta = ''): void {
  if (!datos || typeof datos !== 'object') return;
  if (Array.isArray(datos)) {
    datos.forEach((v, i) => recorrerGraficos(v, cb, ruta ? `${ruta}.${i}` : String(i)));
    return;
  }
  if (esGraficoMinimo(datos)) {
    cb(datos, ruta || '(raíz)');
    return; // un gráfico no anida otro gráfico.
  }
  for (const [k, v] of Object.entries(datos)) recorrerGraficos(v, cb, ruta ? `${ruta}.${k}` : k);
}

// ---------------------------------------------------------------------------
// Campos por colección
// ---------------------------------------------------------------------------

export interface CampoTexto {
  /** Ruta del campo dentro del registro, con puntos (ej. "afirmaciones.0.analisis"). */
  campo: string;
  texto: string;
  /**
   * Solo en `unaOracion`: qué nota al pie es, para el margen que le toca (hasta dos oraciones y
   * 440 caracteres en vez de una y 220). `tabla`: `concepto` y `nota` de las filas de finanzas y
   * de segmentos; `grafico`: la `nota` de un gráfico. Sin marca (hitos de empresas, `descripcion`
   * de un hito de caso), una oración.
   */
  notaDe?: 'tabla' | 'grafico';
}

export interface CampoGrafico {
  /** Ruta del gráfico dentro del registro. */
  campo: string;
  nota?: string;
  series: (SerieMinima & { campo: string })[];
}

export interface CamposPresentacion {
  /** `titulo` (declaraciones, chequeos, analisis, vetos): 8-110 caracteres, sin nombre de persona. */
  titulos: CampoTexto[];
  /** `resumen` (declaraciones, empresas, casos, analisis): párrafos de menos de 1500 caracteres. */
  resumenes: CampoTexto[];
  /** `analisis` y `dato_real.valor` (chequeos, giros, afirmaciones de analisis): párrafos de hasta
   * 80 palabras, 350 en total. */
  analisisParrafos: CampoTexto[];
  /** `concepto`, `nota` (finanzas, segmentos) y `detalle`/`descripcion` de un hito: una oración;
   * las notas de tabla (`notaDe: 'tabla'`) y de gráfico (`'grafico'`) admiten dos. */
  unaOracion: CampoTexto[];
  /** Todo campo que la página imprime, para narración de proceso (docs/colecciones/presentacion.md,
   * "Texto para el lector, no para el rastro"). Superconjunto de los anteriores, `dato_real.valor`
   * incluido (la página lo imprime tal cual: tres chequeos de Astori con «dentro del tiempo de esta
   * corrida» pasaron el inbox y los atajó recién revisar:paginas, 2026-09-16), más `cobertura.texto`,
   * `texto` de un argumento, `motivo` de una corrección y `fundamentacion`. */
  textoLector: CampoTexto[];
  /** Gráficos del registro (chequeos.grafico/graficos[], analisis.afirmaciones[].grafico y
   * analisis.graficos[]), para el chequeo de fuentes repetidas o sucias. */
  graficos: CampoGrafico[];
}

function agregar(lista: CampoTexto[], campo: string, valor: unknown, notaDe?: CampoTexto['notaDe']): void {
  if (typeof valor === 'string' && valor.trim()) lista.push(notaDe ? { campo, texto: valor, notaDe } : { campo, texto: valor });
}

/**
 * Junta, por colección, los campos de texto que la página imprime y que estas reglas de
 * presentación tienen que revisar. Explícito por colección (en vez de recorrer por nombre de
 * clave) para no confundir, por ejemplo, el `texto` de un argumento de empresa con el `texto` de
 * una promesa, que tiene sus propias reglas (fundamentacion, no esta lista de "una oración").
 */
export function extraerCampos(coleccion: NombreColeccion, datos: Record<string, any>): CamposPresentacion {
  const titulos: CampoTexto[] = [];
  const resumenes: CampoTexto[] = [];
  const analisisParrafos: CampoTexto[] = [];
  const unaOracion: CampoTexto[] = [];
  const textoLector: CampoTexto[] = [];
  const graficos: CampoGrafico[] = [];

  switch (coleccion) {
    case 'declaraciones':
      agregar(titulos, 'titulo', datos.titulo);
      agregar(resumenes, 'resumen', datos.resumen);
      break;
    case 'chequeos':
      agregar(titulos, 'titulo', datos.titulo);
      agregar(analisisParrafos, 'analisis', datos.analisis);
      agregar(analisisParrafos, 'dato_real.valor', datos.dato_real?.valor);
      break;
    case 'vetos':
      agregar(titulos, 'titulo', datos.titulo);
      break;
    case 'giros':
      agregar(analisisParrafos, 'analisis', datos.analisis);
      break;
    case 'politicos':
      agregar(textoLector, 'cobertura.texto', datos.cobertura?.texto);
      break;
    case 'casos':
      agregar(resumenes, 'resumen', datos.resumen);
      (Array.isArray(datos.estado_judicial) ? datos.estado_judicial : []).forEach((h: any, i: number) => {
        agregar(unaOracion, `estado_judicial.${i}.descripcion`, h?.descripcion);
        agregar(textoLector, `estado_judicial.${i}.descripcion`, h?.descripcion);
      });
      break;
    case 'promesas':
      agregar(textoLector, 'fundamentacion', datos.fundamentacion);
      break;
    case 'correcciones':
      agregar(textoLector, 'motivo', datos.motivo);
      break;
    case 'empresas': {
      agregar(resumenes, 'resumen', datos.resumen);
      const CAMPOS_MONTO = ['resultado_ejercicio', 'transferencias_al_estado', 'impuestos_pagados', 'capitalizaciones_del_estado', 'deuda_financiera'] as const;
      (Array.isArray(datos.finanzas) ? datos.finanzas : []).forEach((f: any, i: number) => {
        agregar(unaOracion, `finanzas.${i}.nota`, f?.nota, 'tabla');
        agregar(textoLector, `finanzas.${i}.nota`, f?.nota);
        for (const campo of CAMPOS_MONTO) {
          agregar(unaOracion, `finanzas.${i}.${campo}.concepto`, f?.[campo]?.concepto, 'tabla');
          agregar(textoLector, `finanzas.${i}.${campo}.concepto`, f?.[campo]?.concepto);
        }
        (Array.isArray(f?.segmentos) ? f.segmentos : []).forEach((s: any, j: number) => {
          agregar(unaOracion, `finanzas.${i}.segmentos.${j}.nota`, s?.nota, 'tabla');
          agregar(textoLector, `finanzas.${i}.segmentos.${j}.nota`, s?.nota);
          agregar(unaOracion, `finanzas.${i}.segmentos.${j}.resultado.concepto`, s?.resultado?.concepto, 'tabla');
          agregar(textoLector, `finanzas.${i}.segmentos.${j}.resultado.concepto`, s?.resultado?.concepto);
        });
      });
      (Array.isArray(datos.hitos) ? datos.hitos : []).forEach((h: any, i: number) => {
        agregar(unaOracion, `hitos.${i}.detalle`, h?.detalle);
        agregar(textoLector, `hitos.${i}.detalle`, h?.detalle);
      });
      for (const quien of ['argumentos_a_favor', 'argumentos_en_contra'] as const) {
        (Array.isArray(datos.monopolio?.[quien]) ? datos.monopolio[quien] : []).forEach((a: any, i: number) => {
          agregar(textoLector, `monopolio.${quien}.${i}.texto`, a?.texto);
        });
      }
      break;
    }
    case 'analisis':
      agregar(titulos, 'titulo', datos.titulo);
      agregar(resumenes, 'resumen', datos.resumen);
      (Array.isArray(datos.afirmaciones) ? datos.afirmaciones : []).forEach((a: any, i: number) => {
        agregar(analisisParrafos, `afirmaciones.${i}.analisis`, a?.analisis);
        agregar(analisisParrafos, `afirmaciones.${i}.dato_real.valor`, a?.dato_real?.valor);
      });
      break;
  }

  // titulo/resumen/analisis y dato_real.valor van también a narración de proceso: son texto para
  // el lector, y lo que el validador no ataca acá lo ataca revisar:paginas con el lote ya en content/.
  textoLector.push(...titulos, ...resumenes, ...analisisParrafos);

  // Gráficos, en cualquier profundidad (chequeos, analisis): nota es texto para el lector.
  recorrerGraficos(datos, (g, ruta) => {
    graficos.push({ campo: ruta, nota: g.nota, series: g.series.map((s, i) => ({ ...s, campo: `${ruta}.series.${i}` })) });
    if (typeof g.nota === 'string' && g.nota.trim()) {
      unaOracion.push({ campo: `${ruta}.nota`, texto: g.nota, notaDe: 'grafico' });
      textoLector.push({ campo: `${ruta}.nota`, texto: g.nota });
    }
  });

  return { titulos, resumenes, analisisParrafos, unaOracion, textoLector, graficos };
}
