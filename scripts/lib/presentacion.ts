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
 * Cuenta los terminadores de oración (. ! ?) sin contar el punto decimal de un número ("12.5") ni
 * repetir puntuación seguida ("...", "?!") como más de un terminador. Heurística, no gramática: un
 * texto de "una sola oración" tiene a lo sumo uno.
 */
export function contarTerminadores(texto: string): number {
  const m = texto.match(/(?<!\d)[.!?]+(?!\d)/g);
  return m ? m.length : 0;
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
  /** `concepto`, `nota` (finanzas, segmentos) y `detalle`/`descripcion` de un hito: una oración. */
  unaOracion: CampoTexto[];
  /** Todo campo que la página imprime, para narración de proceso (docs/colecciones/presentacion.md,
   * "Texto para el lector, no para el rastro"). Superconjunto de los anteriores (sin
   * `dato_real.valor`) más `cobertura.texto`, `texto` de un argumento, `motivo` de una corrección
   * y `fundamentacion`. */
  textoLector: CampoTexto[];
  /** Gráficos del registro (chequeos.grafico/graficos[], analisis.afirmaciones[].grafico y
   * analisis.graficos[]), para el chequeo de fuentes repetidas o sucias. */
  graficos: CampoGrafico[];
}

function agregar(lista: CampoTexto[], campo: string, valor: unknown): void {
  if (typeof valor === 'string' && valor.trim()) lista.push({ campo, texto: valor });
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
        agregar(unaOracion, `finanzas.${i}.nota`, f?.nota);
        agregar(textoLector, `finanzas.${i}.nota`, f?.nota);
        for (const campo of CAMPOS_MONTO) {
          agregar(unaOracion, `finanzas.${i}.${campo}.concepto`, f?.[campo]?.concepto);
          agregar(textoLector, `finanzas.${i}.${campo}.concepto`, f?.[campo]?.concepto);
        }
        (Array.isArray(f?.segmentos) ? f.segmentos : []).forEach((s: any, j: number) => {
          agregar(unaOracion, `finanzas.${i}.segmentos.${j}.nota`, s?.nota);
          agregar(textoLector, `finanzas.${i}.segmentos.${j}.nota`, s?.nota);
          agregar(unaOracion, `finanzas.${i}.segmentos.${j}.resultado.concepto`, s?.resultado?.concepto);
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

  // titulo/resumen/analisis van también a narración de proceso: son texto para el lector.
  textoLector.push(...titulos, ...resumenes, ...analisisParrafos.filter((c) => !c.campo.includes('dato_real')));

  // Gráficos, en cualquier profundidad (chequeos, analisis): nota es texto para el lector.
  recorrerGraficos(datos, (g, ruta) => {
    graficos.push({ campo: ruta, nota: g.nota, series: g.series.map((s, i) => ({ ...s, campo: `${ruta}.series.${i}` })) });
    if (typeof g.nota === 'string' && g.nota.trim()) {
      unaOracion.push({ campo: `${ruta}.nota`, texto: g.nota });
      textoLector.push({ campo: `${ruta}.nota`, texto: g.nota });
    }
  });

  return { titulos, resumenes, analisisParrafos, unaOracion, textoLector, graficos };
}
