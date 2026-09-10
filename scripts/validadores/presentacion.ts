/**
 * Etapa: presentación para el lector (docs/colecciones/presentacion.md; plan 2026-09, ítem 2.4).
 *
 * Corre sobre content/ y, en modo --inbox, también sobre la corrida: revisa lo que hoy solo ve
 * `pnpm revisar:paginas` sobre el sitio ya construido, cuando corregirlo ya cuesta un lote de
 * correcciones de tipo `presentacion`.
 *
 * - `titulo` (declaraciones, chequeos, analisis, vetos): 8 a 110 caracteres, sin empezar con el
 *   nombre de la persona (eso va en el resumen, no en el título).
 * - `analisis` y `dato_real.valor` (chequeos, giros, afirmaciones de analisis): ningún párrafo de
 *   más de 80 palabras, ni más de 350 en total.
 * - `resumen` (declaraciones, empresas, casos, analisis): párrafos de menos de 1500 caracteres.
 * - `concepto`, `nota` (finanzas, segmentos, gráficos) y `detalle`/`descripcion` de un hito: una
 *   sola oración (heurística: como mucho un terminador de oración y menos de 220 caracteres).
 * - `grafico.nota` y `grafico.series[].fuente`: sin la misma fuente repetida entre series del
 *   mismo gráfico, ni "；；" o ".." (plan, ítem 2.7, la parte de datos).
 * - Narración de proceso en todo campo que la página imprime: expresiones regulares y campos en
 *   scripts/lib/presentacion.ts, compartido con revisar-paginas.ts.
 * - Un chequeo con tres o más cifras con año en `dato_real.valor` y sin `grafico`: aviso "serie
 *   sin gráfico" (siempre aviso, incluso en --inbox o --estricto: es una sugerencia, no un defecto
 *   que haya que corregir antes de publicar).
 *
 * Severidad: en --inbox, todo lo anterior (salvo "serie sin gráfico") es error, porque el lote no
 * sale del inbox así. En content/, aviso, salvo con --estricto, que lo vuelve error.
 */
import { parrafos } from '../../src/lib/formato.ts';
import { normalizar } from '../lib/texto.ts';
import type { Contenido } from '../lib/contenido.ts';
import { contarPalabras, contarTerminadores, detectarProceso, extraerCampos } from '../lib/presentacion.ts';
import { resultadoVacio, type Problema, type ResultadoEtapa } from './tipos.ts';

export interface OpcionesPresentacion {
  modoInbox?: boolean;
  /** En content/, convierte los avisos de esta etapa en errores. Sin efecto en --inbox (ya son error). */
  estricto?: boolean;
}

const LARGO_TITULO_MIN = 8;
const LARGO_TITULO_MAX = 110;
const PALABRAS_PARRAFO_ANALISIS = 80;
const PALABRAS_ANALISIS_TOTAL = 350;
const LARGO_RESUMEN_PARRAFO = 1500;
const LARGO_UNA_ORACION = 220;
/** Concatenación mal hecha entre publicadores o fuentes: dos puntos y coma o dos puntos seguidos. */
const PATRON_SUCIO = /;;|\.\./;
const HAY_ANIO = /\b(?:19|20)\d{2}\b/;
const TODOS_LOS_ANIOS = /\b(?:19|20)\d{2}\b/g;
const MINIMO_CIFRAS_PARA_SERIE = 3;

/**
 * Cuenta "cifras con año" en un texto libre: oraciones que mencionan un año (19xx/20xx) y, además
 * del año, alguna otra cifra ("39,2 en 2019", "cayó 18 % en abril de 2020"). Se cuenta por oración
 * (separada por . ! ?) para no emparejar el año de una frase con la cifra de la siguiente; una
 * distancia fija en caracteres no sirve porque el texto es prosa, no una tabla, y las palabras de
 * por medio ("en", "durante", "interanual") varían de largo.
 */
function contarCifrasConAnio(texto: string): number {
  const oraciones = texto.split(/(?<=[.!?])\s+/);
  let total = 0;
  for (const oracion of oraciones) {
    if (!HAY_ANIO.test(oracion)) continue;
    const sinAnios = oracion.replace(TODOS_LOS_ANIOS, '');
    if (/\d/.test(sinAnios)) total++;
  }
  return total;
}

export function validarPresentacion(contenido: Contenido, opciones: OpcionesPresentacion = {}): ResultadoEtapa {
  const r = resultadoVacio();
  const modoInbox = opciones.modoInbox === true;
  // Dónde caen los problemas de esta etapa (salvo "serie sin gráfico", que siempre es aviso): en
  // --inbox, error siempre; en content/, aviso salvo --estricto.
  const destino: Problema[] = modoInbox || opciones.estricto ? r.errores : r.avisos;

  const nombresDePersona = (idPolitico: unknown): string[] => {
    if (typeof idPolitico !== 'string') return [];
    const d = contenido.obtener('politicos', idPolitico)?.datos;
    if (!d) return [];
    return [d.nombre_corto, d.nombre].filter((n): n is string => typeof n === 'string' && n.length > 0);
  };

  for (const reg of contenido.registros) {
    if (modoInbox && !reg.enInbox) continue; // en modo inbox solo se juzga la corrida
    const d = reg.datos;
    const campos = extraerCampos(reg.coleccion, d);
    const nombres = nombresDePersona(d.politico);

    // 1. Título: largo y sin empezar con el nombre de la persona.
    for (const t of campos.titulos) {
      const largo = t.texto.trim().length;
      if (largo < LARGO_TITULO_MIN || largo > LARGO_TITULO_MAX) {
        destino.push({
          archivo: reg.archivo,
          campo: t.campo,
          mensaje: `Título de ${largo} caracteres: se espera entre ${LARGO_TITULO_MIN} y ${LARGO_TITULO_MAX} ("${t.texto.slice(0, 60)}${t.texto.length > 60 ? '…' : ''}").`,
        });
      }
      const normalizado = normalizar(t.texto);
      if (nombres.some((n) => normalizado.startsWith(normalizar(n)))) {
        destino.push({
          archivo: reg.archivo,
          campo: t.campo,
          mensaje: `El título empieza con el nombre de la persona ("${t.texto.slice(0, 50)}…"): eso va en el resumen; el título dice qué afirma, promete o niega.`,
        });
      }
    }

    // 2. Análisis (y dato_real.valor) en párrafos cortos.
    for (const a of campos.analisisParrafos) {
      const ps = parrafos(a.texto);
      let total = 0;
      for (const p of ps) {
        const n = contarPalabras(p);
        total += n;
        if (n > PALABRAS_PARRAFO_ANALISIS) {
          destino.push({
            archivo: reg.archivo,
            campo: a.campo,
            mensaje: `Párrafo de ${n} palabras (máximo ${PALABRAS_PARRAFO_ANALISIS}): «${p.slice(0, 70)}…».`,
          });
        }
      }
      if (total > PALABRAS_ANALISIS_TOTAL) {
        destino.push({ archivo: reg.archivo, campo: a.campo, mensaje: `${total} palabras en total (máximo ${PALABRAS_ANALISIS_TOTAL}).` });
      }
    }

    // 3. Resumen en párrafos de menos de 1500 caracteres.
    for (const rsm of campos.resumenes) {
      for (const p of parrafos(rsm.texto)) {
        if (p.length >= LARGO_RESUMEN_PARRAFO) {
          destino.push({
            archivo: reg.archivo,
            campo: rsm.campo,
            mensaje: `Párrafo de ${p.length} caracteres (máximo ${LARGO_RESUMEN_PARRAFO}): «${p.slice(0, 70)}…».`,
          });
        }
      }
    }

    // 4. Una oración: concepto, nota (finanzas, segmentos, gráficos), detalle/descripcion de hito.
    for (const u of campos.unaOracion) {
      const terminadores = contarTerminadores(u.texto);
      if (terminadores > 1) {
        destino.push({
          archivo: reg.archivo,
          campo: u.campo,
          mensaje: `No parece una sola oración (${terminadores} terminadores de oración): «${u.texto.slice(0, 80)}…». Lo largo va al resumen o se saca.`,
        });
      }
      if (u.texto.length >= LARGO_UNA_ORACION) {
        destino.push({ archivo: reg.archivo, campo: u.campo, mensaje: `${u.texto.length} caracteres (máximo ${LARGO_UNA_ORACION} para una oración).` });
      }
    }

    // 5. Gráficos: nota o fuente con concatenación sucia, o la misma fuente repetida entre series.
    for (const g of campos.graficos) {
      if (g.nota && PATRON_SUCIO.test(g.nota)) {
        destino.push({ archivo: reg.archivo, campo: `${g.campo}.nota`, mensaje: `nota con "${PATRON_SUCIO.exec(g.nota)![0]}": parece una concatenación mal hecha.` });
      }
      const vistas = new Map<string, number>();
      for (const s of g.series) {
        if (PATRON_SUCIO.test(s.fuente)) {
          destino.push({ archivo: reg.archivo, campo: `${s.campo}.fuente`, mensaje: `fuente con "${PATRON_SUCIO.exec(s.fuente)![0]}": parece una concatenación mal hecha.` });
        }
        vistas.set(s.fuente, (vistas.get(s.fuente) ?? 0) + 1);
      }
      for (const [fuente, n] of vistas) {
        if (n > 1) {
          destino.push({ archivo: reg.archivo, campo: `${g.campo}.series`, mensaje: `La misma fuente ("${fuente}") se repite en ${n} series: un publicador, una línea (docs/colecciones/presentacion.md, punto 4).` });
        }
      }
    }

    // 6. Narración de proceso en todo campo que la página imprime.
    for (const t of campos.textoLector) {
      const m = detectarProceso(t.texto);
      if (m) {
        const inicio = Math.max(0, (m.index ?? 0) - 30);
        destino.push({
          archivo: reg.archivo,
          campo: t.campo,
          mensaje: `Narración de proceso en texto para el lector: «…${t.texto.slice(inicio, (m.index ?? 0) + 50)}…». Eso va en razones.md o data/corridas/, nunca en el registro.`,
        });
      }
    }

    // 7. Serie sin gráfico: siempre aviso, es una sugerencia.
    if (reg.coleccion === 'chequeos' && typeof d.dato_real?.valor === 'string' && !d.grafico) {
      const cifras = contarCifrasConAnio(d.dato_real.valor);
      if (cifras >= MINIMO_CIFRAS_PARA_SERIE) {
        r.avisos.push({
          archivo: reg.archivo,
          campo: 'dato_real.valor',
          mensaje: `serie sin gráfico: ${cifras} cifras con año en el texto y sin \`grafico\`; un gráfico se lee de un vistazo y esto cuesta párrafos.`,
        });
      }
    }
  }

  return r;
}
