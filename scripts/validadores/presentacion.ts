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
 *
 * Modo corrección ("no peor que lo publicado"): un lote de corrección (`correcciones.yaml` en el
 * `--inbox`, con la misma detección que usa `pnpm promover <dir> --correccion`: un registro de
 * `correcciones` en el propio lote, o la opción `--correccion <id>`) trae, por cada id de
 * `afecta[]`, una copia entera del registro publicado con el cambio puntual de la corrección
 * adentro. Pedirle que esa copia entera cumpla reglas de presentación posteriores a cuando se
 * publicó (una corrección de una frase no reescribe la ficha) rompía el lote con hallazgos que no
 * tienen nada que ver con lo que la corrección cambia (docs/colecciones/correcciones.md).
 *
 * Por eso, para cada registro del lote cuyo id está en `afecta[]`, se calculan los hallazgos del
 * registro publicado (en content/) y los del registro del lote con las mismas reglas de abajo; un
 * hallazgo del lote que ya existía en el publicado (misma regla y mismo campo, sin el índice de
 * lista) pasa de error a aviso, con "ya estaba así en lo publicado". Los hallazgos nuevos siguen
 * cortando. Los registros de `agrega[]` (nuevos, sin versión publicada previa) se validan enteros,
 * como cualquier registro fuera de una corrección.
 */
import { parrafos } from '../../src/lib/formato.ts';
import { normalizar } from '../lib/texto.ts';
import type { Contenido, Registro } from '../lib/contenido.ts';
import { CAMPOS_DEL_EDITOR } from '../lib/inbox.ts';
import { contarPalabras, contarTerminadores, detectarProceso, extraerCampos, type CampoTexto, type CamposPresentacion } from '../lib/presentacion.ts';
import { resultadoVacio, type Problema, type ResultadoEtapa } from './tipos.ts';

export interface OpcionesPresentacion {
  modoInbox?: boolean;
  /** En content/, convierte los avisos de esta etapa en errores. Sin efecto en --inbox (ya son error). */
  estricto?: boolean;
  /**
   * Id de una corrección (derivado, `<fecha>-<slug>`) para desambiguar cuando el lote trae más de
   * una en `correcciones.yaml`, o para activar el modo corrección aunque el lote no traiga el
   * registro de corrección (ya publicada en content/correcciones/). `true` (el lote trae una sola
   * corrección, sin necesidad de elegir) tiene el mismo efecto que pasar su id. Mismo criterio que
   * `pnpm promover --correccion`.
   */
  correccion?: string | true;
}

export interface ResultadoPresentacion extends ResultadoEtapa {
  /** true si el lote (o `--correccion`) activó el modo corrección. */
  modoCorreccion: boolean;
  /** Hallazgos del lote que ya estaban en lo publicado y por eso pasaron de error a aviso. */
  heredados: number;
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

/**
 * En el inbox, `analisis` (chequeos), `fundamentacion` (promesas) y `veredicto` (analisis) los
 * escribe el editor en /revisar; hasta entonces `cargarInbox` los rellena con un marcador para que
 * el esquema valide, y ese marcador no es texto de nadie: no se juzga. Se saltea solo si el crudo
 * no trae el campo; lo que el investigador sí escribió se revisa como todo lo demás.
 */
function sinCamposDelEditor(campos: CamposPresentacion, reg: Registro): CamposPresentacion {
  if (!reg.enInbox) return campos;
  const crudo = (reg.crudo ?? {}) as Record<string, unknown>;
  const delEditor = (CAMPOS_DEL_EDITOR[reg.coleccion] ?? []).filter((c) => crudo[c] === undefined);
  if (delEditor.length === 0) return campos;
  const filtrar = (lista: CampoTexto[]) => lista.filter((t) => !delEditor.includes(t.campo.split('.')[0]));
  return {
    ...campos,
    titulos: filtrar(campos.titulos),
    resumenes: filtrar(campos.resumenes),
    analisisParrafos: filtrar(campos.analisisParrafos),
    unaOracion: filtrar(campos.unaOracion),
    textoLector: filtrar(campos.textoLector),
  };
}

/** Un hallazgo de presentación, sin archivo ni severidad todavía (eso lo decide quien lo recibe). */
interface Hallazgo {
  /** Identifica qué chequeo lo produjo (para el modo corrección: "misma regla y mismo campo"). */
  regla: string;
  campo: string;
  mensaje: string;
}

/**
 * Quita los índices de lista de una ruta de campo ("afirmaciones.2.analisis" →
 * "afirmaciones.analisis"), para comparar por campo sin importar la posición: en modo corrección,
 * un `agrega`/reordenamiento de lista no tiene por qué correr los índices de lo que ya estaba.
 */
function campoSinIndice(campo: string): string {
  return campo
    .split('.')
    .filter((seg) => !/^\d+$/.test(seg))
    .join('.');
}

/** Clave (regla, campo sin índice) para comparar hallazgos entre el lote y lo publicado. */
function claveHallazgo(h: Hallazgo): string {
  return `${h.regla}::${campoSinIndice(h.campo)}`;
}

/**
 * Los seis chequeos de esta etapa que dependen solo del propio registro (título, análisis, resumen,
 * una oración, gráficos, narración de proceso), sin archivo ni severidad: la comparte el chequeo
 * normal (severidad según --inbox/--estricto) y el modo corrección (compara lote vs. publicado). El
 * séptimo chequeo ("serie sin gráfico") es siempre aviso y no participa del modo corrección: vive
 * aparte, en `validarPresentacion`.
 */
function calcularHallazgos(campos: CamposPresentacion, nombres: string[]): Hallazgo[] {
  const hallazgos: Hallazgo[] = [];

  // 1. Título: largo y sin empezar con el nombre de la persona.
  for (const t of campos.titulos) {
    const largo = t.texto.trim().length;
    if (largo < LARGO_TITULO_MIN || largo > LARGO_TITULO_MAX) {
      hallazgos.push({
        regla: 'titulo_largo',
        campo: t.campo,
        mensaje: `Título de ${largo} caracteres: se espera entre ${LARGO_TITULO_MIN} y ${LARGO_TITULO_MAX} ("${t.texto.slice(0, 60)}${t.texto.length > 60 ? '…' : ''}").`,
      });
    }
    const normalizado = normalizar(t.texto);
    if (nombres.some((n) => normalizado.startsWith(normalizar(n)))) {
      hallazgos.push({
        regla: 'titulo_nombre',
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
        hallazgos.push({
          regla: 'analisis_parrafo_largo',
          campo: a.campo,
          mensaje: `Párrafo de ${n} palabras (máximo ${PALABRAS_PARRAFO_ANALISIS}): «${p.slice(0, 70)}…».`,
        });
      }
    }
    if (total > PALABRAS_ANALISIS_TOTAL) {
      hallazgos.push({ regla: 'analisis_total_largo', campo: a.campo, mensaje: `${total} palabras en total (máximo ${PALABRAS_ANALISIS_TOTAL}).` });
    }
  }

  // 3. Resumen en párrafos de menos de 1500 caracteres.
  for (const rsm of campos.resumenes) {
    for (const p of parrafos(rsm.texto)) {
      if (p.length >= LARGO_RESUMEN_PARRAFO) {
        hallazgos.push({
          regla: 'resumen_parrafo_largo',
          campo: rsm.campo,
          mensaje: `Párrafo de ${p.length} caracteres (máximo ${LARGO_RESUMEN_PARRAFO}): «${p.slice(0, 70)}…».`,
        });
      }
    }
  }

  // 4. Una oración: concepto, nota (finanzas, segmentos), detalle/descripcion de hito. La nota de un
  //    gráfico admite dos (mantenedor, 2026-09-17; docs/colecciones/presentacion.md, punto 7): la
  //    segunda suele decir qué falta o de dónde sale la serie, y partirla en metodo la escondía.
  for (const u of campos.unaOracion) {
    const esNotaDeGrafico = /(^|\.)grafico(s\.\d+)?\.nota$/.test(u.campo);
    const maxOraciones = esNotaDeGrafico ? 2 : 1;
    const maxLargo = LARGO_UNA_ORACION * maxOraciones;
    const terminadores = contarTerminadores(u.texto);
    if (terminadores > maxOraciones) {
      hallazgos.push({
        regla: 'una_oracion_terminadores',
        campo: u.campo,
        mensaje: esNotaDeGrafico
          ? `Más de dos oraciones (${terminadores} terminadores de oración): «${u.texto.slice(0, 80)}…». El método y las advertencias largas van en metodo.`
          : `No parece una sola oración (${terminadores} terminadores de oración): «${u.texto.slice(0, 80)}…». Lo largo va al resumen o se saca.`,
      });
    }
    if (u.texto.length >= maxLargo) {
      hallazgos.push({
        regla: 'una_oracion_largo',
        campo: u.campo,
        mensaje: `${u.texto.length} caracteres (máximo ${maxLargo} para ${esNotaDeGrafico ? 'dos oraciones' : 'una oración'}).`,
      });
    }
  }

  // 5. Gráficos: nota o fuente con concatenación sucia, o la misma fuente repetida entre series.
  for (const g of campos.graficos) {
    if (g.nota && PATRON_SUCIO.test(g.nota)) {
      hallazgos.push({ regla: 'grafico_nota_sucia', campo: `${g.campo}.nota`, mensaje: `nota con "${PATRON_SUCIO.exec(g.nota)![0]}": parece una concatenación mal hecha.` });
    }
    const vistas = new Map<string, number>();
    for (const s of g.series) {
      if (PATRON_SUCIO.test(s.fuente)) {
        hallazgos.push({ regla: 'grafico_fuente_sucia', campo: `${s.campo}.fuente`, mensaje: `fuente con "${PATRON_SUCIO.exec(s.fuente)![0]}": parece una concatenación mal hecha.` });
      }
      vistas.set(s.fuente, (vistas.get(s.fuente) ?? 0) + 1);
    }
    for (const [fuente, n] of vistas) {
      if (n > 1) {
        hallazgos.push({
          regla: 'grafico_fuente_repetida',
          campo: `${g.campo}.series`,
          mensaje: `La misma fuente ("${fuente}") se repite en ${n} series: un publicador, una línea (docs/colecciones/presentacion.md, punto 4).`,
        });
      }
    }
  }

  // 6. Narración de proceso en todo campo que la página imprime.
  for (const t of campos.textoLector) {
    const m = detectarProceso(t.texto);
    if (m) {
      const inicio = Math.max(0, (m.index ?? 0) - 30);
      hallazgos.push({
        regla: 'proceso_narracion',
        campo: t.campo,
        mensaje: `Narración de proceso en texto para el lector: «…${t.texto.slice(inicio, (m.index ?? 0) + 50)}…». Eso va en razones.md o data/corridas/, nunca en el registro.`,
      });
    }
  }

  return hallazgos;
}

/**
 * Ids (`<coleccion>/<id>`) que un lote de corrección declara en `afecta[]`, con la misma detección
 * que `pnpm promover <dir> --correccion`: un registro de la colección `correcciones` en el propio
 * lote (`enInbox: true`), desambiguado por `opciones.correccion` si el lote trae más de uno, o esa
 * misma opción apuntando a una corrección ya publicada en `content/correcciones/` cuando el lote no
 * trae ninguna. Sin ninguna de las dos señales, el modo corrección no se activa.
 *
 * Exportada para que `citas` y `fuentes` (--red) apliquen el mismo "no peor que lo publicado" que
 * esta etapa: un error sobre una cita o una url que un registro de `afecta[]` ya tenía, sin cambios,
 * en su versión publicada, pasa a aviso (docs/colecciones/correcciones.md).
 */
export function idsAfectadosPorCorreccion(contenido: Contenido, opciones: { correccion?: string | true }): { activa: boolean; afecta: Set<string> } {
  const delLote = contenido.de('correcciones').filter((r) => r.enInbox);
  let elegidos = delLote;
  if (typeof opciones.correccion === 'string') {
    const filtrados = delLote.filter((r) => r.id === opciones.correccion);
    if (filtrados.length > 0) {
      elegidos = filtrados;
    } else {
      const publicada = contenido.obtener('correcciones', opciones.correccion);
      elegidos = publicada ? [publicada] : [];
    }
  }
  const activa = delLote.length > 0 || opciones.correccion !== undefined;
  const afecta = new Set<string>();
  for (const r of elegidos) {
    const lista = Array.isArray(r.datos.afecta) ? (r.datos.afecta as unknown[]) : [];
    for (const id of lista) if (typeof id === 'string') afecta.add(id);
  }
  return { activa, afecta };
}

export function validarPresentacion(contenido: Contenido, opciones: OpcionesPresentacion = {}): ResultadoPresentacion {
  const r: ResultadoPresentacion = { ...resultadoVacio(), modoCorreccion: false, heredados: 0 };
  const modoInbox = opciones.modoInbox === true;
  // Dónde caen los problemas de esta etapa (salvo "serie sin gráfico", que siempre es aviso): en
  // --inbox, error siempre; en content/, aviso salvo --estricto.
  const destino: Problema[] = modoInbox || opciones.estricto ? r.errores : r.avisos;

  const { activa: modoCorreccion, afecta } = idsAfectadosPorCorreccion(contenido, opciones);
  r.modoCorreccion = modoCorreccion;

  const nombresDePersona = (idPolitico: unknown): string[] => {
    if (typeof idPolitico !== 'string') return [];
    const d = contenido.obtener('politicos', idPolitico)?.datos;
    if (!d) return [];
    return [d.nombre_corto, d.nombre].filter((n): n is string => typeof n === 'string' && n.length > 0);
  };

  for (const reg of contenido.registros) {
    if (modoInbox && !reg.enInbox) continue; // en modo inbox solo se juzga la corrida
    const d = reg.datos;
    const campos = sinCamposDelEditor(extraerCampos(reg.coleccion, d), reg);
    const nombres = nombresDePersona(d.politico);
    const hallazgos = calcularHallazgos(campos, nombres);

    // Modo corrección: si este registro del lote está en `afecta[]`, sus hallazgos se comparan
    // contra los del registro publicado (mismo id, `enInbox: false`); los que ya estaban ahí pasan
    // a aviso. Un registro de `agrega[]` no tiene publicado con el que compararse (el `find` no
    // encuentra nada) y se valida entero, como cualquier registro fuera de una corrección.
    const idCompleto = `${reg.coleccion}/${reg.id}`;
    const publicado = modoCorreccion && afecta.has(idCompleto) ? contenido.registros.find((p) => !p.enInbox && p.coleccion === reg.coleccion && p.id === reg.id) : undefined;

    if (publicado) {
      const camposPublicado = sinCamposDelEditor(extraerCampos(publicado.coleccion, publicado.datos), publicado);
      const hallazgosPublicado = calcularHallazgos(camposPublicado, nombresDePersona(publicado.datos.politico));
      const clavesPublicado = new Set(hallazgosPublicado.map(claveHallazgo));
      for (const h of hallazgos) {
        if (clavesPublicado.has(claveHallazgo(h))) {
          r.avisos.push({ archivo: reg.archivo, campo: h.campo, mensaje: `${h.mensaje} (ya estaba así en lo publicado)`, regla: h.regla });
          r.heredados++;
        } else {
          destino.push({ archivo: reg.archivo, campo: h.campo, mensaje: h.mensaje, regla: h.regla });
        }
      }
    } else {
      for (const h of hallazgos) destino.push({ archivo: reg.archivo, campo: h.campo, mensaje: h.mensaje, regla: h.regla });
    }

    // 7. Serie sin gráfico: siempre aviso, es una sugerencia; no participa del modo corrección.
    if (reg.coleccion === 'chequeos' && typeof d.dato_real?.valor === 'string' && !d.grafico) {
      const cifras = contarCifrasConAnio(d.dato_real.valor);
      if (cifras >= MINIMO_CIFRAS_PARA_SERIE) {
        r.avisos.push({
          archivo: reg.archivo,
          campo: 'dato_real.valor',
          mensaje: `serie sin gráfico: ${cifras} cifras con año en el texto y sin \`grafico\`; un gráfico se lee de un vistazo y esto cuesta párrafos.`,
          regla: 'serie_sin_grafico',
        });
      }
    }
  }

  return r;
}
