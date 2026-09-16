/**
 * Etapa 2: referencias cruzadas y coherencia entre registros.
 *
 * - Toda referencia (politico, tema, medio, evento, declaracion, referente, caso,
 *   correccion, padre de tema) apunta a un registro existente (en content/ o,
 *   en modo --inbox, dentro de la misma corrida).
 * - Giros: mismo político en ambas declaraciones y en el giro, antes ≠ después,
 *   fecha(antes) < fecha(después).
 * - Chequeos: la declaración chequeada es del mismo político, y `fragmento` aparece tal cual en
 *   su cita o su resumen (si no, la página no lo puede marcar).
 * - Promesas: evidencias fechadas ≥ fecha_promesa.
 * - Casos: línea de tiempo ascendente y etiqueta_legal derivada de la última etapa.
 * - Convenciones de id: carpeta == politico (o medio en cobertura), fecha del id == fecha.
 * - Temas: padre coherente con la ruta del id.
 */
import { etiquetaLegalDesdeEtapa, type NombreColeccion } from '../../src/schemas/comunes';
import { intervaloDeFecha } from '../../src/schemas/base';
import { fragmentoEsta } from '../../src/lib/fragmentos';
import { recorrerFuentes, type Contenido, type Registro } from '../lib/contenido.ts';
import { resultadoVacio, type Problema, type ResultadoEtapa } from './tipos.ts';

/**
 * Campos de referencia directa por colección: campo → colección destino (`[]` = lista).
 * Exportado para `scripts/lote.ts` (D4, docs/plan-fechas.md): cuando `fijar` cambia el id de un
 * registro, recorre este mismo mapa para saber qué campos de qué colecciones pueden apuntarle.
 */
export const REFERENCIAS: Partial<Record<NombreColeccion, Record<string, NombreColeccion>>> = {
  temas: { padre: 'temas' },
  eventos: { 'temas[]': 'temas', 'politicos[]': 'politicos', 'casos[]': 'casos' },
  medios: { empresa: 'empresas' },
  analisis: { empresa: 'empresas', politico: 'politicos', tema: 'temas' },
  declaraciones: { politico: 'politicos', tema: 'temas', 'eventos[]': 'eventos' },
  giros: { politico: 'politicos', tema: 'temas', declaracion_antes: 'declaraciones', declaracion_despues: 'declaraciones' },
  promesas: { politico: 'politicos', tema: 'temas' },
  casos: { 'temas[]': 'temas', 'eventos[]': 'eventos', 'involucrados[].politico': 'politicos' },
  chequeos: { politico: 'politicos', declaracion: 'declaraciones', tema: 'temas' },
  cobertura: { medio: 'medios', evento: 'eventos', politico: 'politicos' },
  intervenciones: { politico: 'politicos' },
  patrimonio: { politico: 'politicos' },
  menciones: { politico: 'politicos', referente: 'referentes' },
};

/** Colecciones cuyo id empieza por `<politico>/`. */
const CON_CARPETA_POLITICO: ReadonlySet<NombreColeccion> = new Set(['declaraciones', 'giros', 'promesas', 'chequeos', 'intervenciones', 'patrimonio', 'menciones']);

/** Colecciones cuyo id lleva la fecha del registro (`<carpeta>/<YYYY-MM-DD>-<slug>` o `<carpeta>/<YYYY-MM-DD>`). */
const CON_FECHA_EN_ID: Partial<Record<NombreColeccion, string>> = {
  declaraciones: 'fecha',
  chequeos: 'fecha',
  menciones: 'fecha',
  intervenciones: 'fecha',
  cobertura: 'fecha',
  patrimonio: 'fecha',
  correcciones: 'fecha',
};

/**
 * Colecciones con `fecha_precision` (docs/plan-fechas.md, D1): declaraciones, menciones y
 * chequeos guardan la fecha de enunciación en `fecha`; promesas, en `fecha_promesa`. Giros no
 * tienen fecha propia (comparan las de sus dos declaraciones); `seguimiento.fecha` y las fuentes no
 * llevan precisión declarada, esas quedan afuera a propósito.
 */
const FECHA_ENUNCIACION: Partial<Record<NombreColeccion, string>> = {
  declaraciones: 'fecha',
  menciones: 'fecha',
  chequeos: 'fecha',
  promesas: 'fecha_promesa',
};

/** Campo de evidencia de cada colección de FECHA_ENUNCIACION, donde puede estar la fuente que documenta la cota de un `fecha_precision: antes_de`. */
const EVIDENCIA_ENUNCIACION: Partial<Record<NombreColeccion, string>> = {
  declaraciones: 'evidencia',
  menciones: 'evidencia',
  chequeos: 'evidencia',
  promesas: 'origen',
};

function obtenerRuta(obj: any, ruta: string[]): { valor: unknown; campo: string }[] {
  // Expande `campo[]` y `campo[].sub` en todos los elementos.
  let actuales: { valor: any; campo: string }[] = [{ valor: obj, campo: '' }];
  for (const paso of ruta) {
    const lista = paso.endsWith('[]');
    const clave = lista ? paso.slice(0, -2) : paso;
    const siguientes: { valor: any; campo: string }[] = [];
    for (const a of actuales) {
      if (!a.valor || typeof a.valor !== 'object') continue;
      const v = a.valor[clave];
      const campoBase = a.campo ? `${a.campo}.${clave}` : clave;
      if (v === undefined) continue;
      if (lista) {
        if (Array.isArray(v)) v.forEach((x, i) => siguientes.push({ valor: x, campo: `${campoBase}.${i}` }));
      } else {
        siguientes.push({ valor: v, campo: campoBase });
      }
    }
    actuales = siguientes;
  }
  return actuales;
}

export function validarReferencias(contenido: Contenido): ResultadoEtapa {
  const r = resultadoVacio();
  const err = (reg: Registro, campo: string, mensaje: string): void => {
    r.errores.push({ archivo: reg.archivo, campo, mensaje });
  };
  const existe = (coleccion: NombreColeccion, id: unknown): boolean => typeof id === 'string' && !!contenido.obtener(coleccion, id);

  for (const reg of contenido.registros) {
    const d = reg.datos;

    // 1. Referencias directas.
    const refs = REFERENCIAS[reg.coleccion] ?? {};
    for (const [rutaCampo, destino] of Object.entries(refs)) {
      for (const { valor, campo } of obtenerRuta(d, rutaCampo.split('.'))) {
        if (valor === undefined || valor === null) continue;
        if (!existe(destino, valor)) {
          err(reg, campo, `Referencia rota: no existe "${String(valor)}" en content/${destino}/.`);
        }
      }
    }

    // 2. Medios de todas las fuentes (en cualquier profundidad).
    recorrerFuentes(d, (f, ruta) => {
      if (!existe('medios', f.medio)) {
        err(reg, `${ruta}.medio`, `Medio desconocido: no existe "${f.medio}" en content/medios/ ni en medios.yaml del lote. Si es un medio nuevo, su perfil va en medios.yaml del mismo lote (docs/colecciones/medios.md); si no, corregí el slug.`);
      }
    });

    // 2b. Presentación: un análisis con varias cifras de una misma fuente tiene página propia
    // (colección `analisis`), no filas sueltas en `comparaciones[]`. La regla la pidió un lector y
    // se aplicó a mano en dos fichas y se olvidó en la tercera; desde acá avisa el validador.
    if (reg.coleccion === 'empresas' && Array.isArray(d.comparaciones)) {
      const porUrl = new Map<string, number>();
      for (const c of d.comparaciones as { fuentes?: { url?: string }[] }[]) {
        const url = c?.fuentes?.[0]?.url;
        if (typeof url === 'string') porUrl.set(url, (porUrl.get(url) ?? 0) + 1);
      }
      // Si ya existe el registro de análisis sobre ese documento, la página esconde las filas sola.
      const analizadas = new Set(
        contenido.registros.filter((x) => x.coleccion === 'analisis').map((x) => (x.datos as { publicado?: { url?: string } }).publicado?.url).filter((u): u is string => typeof u === 'string'),
      );
      for (const [url, n] of porUrl) {
        if (n >= 3 && !analizadas.has(url)) {
          r.avisos.push({
            archivo: reg.archivo,
            campo: 'comparaciones',
            mensaje: `${n} comparaciones salen de la misma fuente (${url}): un análisis con varias cifras merece un registro de analisis/ con página propia, y la ficha una sola fila que lleve a ella.`,
          });
        }
      }
    }

    // 2d. Aritmética: si un monto declara la cotización, usd tiene que ser pesos / cotización (con
    // ambos en la misma unidad). Es la cuenta que el crítico hacía a mano en cada lote; acá es
    // error, porque un monto que no cierra es un número mal copiado.
    if (reg.coleccion === 'empresas' && Array.isArray(d.finanzas)) {
      type Monto = { pesos?: number; usd?: number; cotizacion?: number; unidad?: string };
      const revisar = (m: Monto | undefined, campo: string) => {
        if (!m || m.pesos === undefined || m.usd === undefined || m.cotizacion === undefined) return;
        const esperado = m.pesos / m.cotizacion;
        const desvio = Math.abs(esperado - m.usd) / Math.max(Math.abs(m.usd), 1e-9);
        if (desvio > 0.015) {
          r.errores.push({
            archivo: reg.archivo,
            campo,
            mensaje: `No cierra: ${m.pesos} / ${m.cotizacion} = ${esperado.toFixed(1)} y el registro dice usd ${m.usd} (desvío ${(desvio * 100).toFixed(1)} %). Revisá pesos, cotización o unidad.`,
          });
        }
      };
      for (const f of d.finanzas as Record<string, unknown>[]) {
        const anio = f.anio as number | undefined;
        for (const k of ['resultado_ejercicio', 'impuestos_pagados', 'transferencias_al_estado', 'capitalizaciones_del_estado', 'deuda_financiera']) {
          revisar(f[k] as Monto | undefined, `finanzas[${anio}].${k}`);
        }
        for (const s of (f.segmentos as { nombre?: string; resultado?: Monto }[] | undefined) ?? []) revisar(s.resultado, `finanzas[${anio}].segmentos[${s.nombre}]`);
      }
    }

    // 2c. Presentación: las notas al pie de la tabla de una empresa son de una oración. Un lector
    // vio 44 notas de cuatro renglones en UTE; el crítico contó 38 en OSE con once repetidas. El
    // aviso lo ve el editor antes de cerrar el lote.
    if (reg.coleccion === 'empresas' && Array.isArray(d.finanzas)) {
      const textos = new Map<string, number>();
      for (const f of d.finanzas as { anio?: number; nota?: string; segmentos?: { nota?: string }[] }[]) {
        const notas = [f.nota, ...(f.segmentos ?? []).map((s) => s.nota)].filter((n): n is string => typeof n === 'string');
        for (const n of notas) {
          if (n.length > 300) {
            r.avisos.push({ archivo: reg.archivo, campo: `finanzas[${f.anio}].nota`, mensaje: `Nota de ${n.length} caracteres: al pie de la tabla va una oración; lo largo pasa al resumen o se saca.` });
          }
          const clave = n.replace(/\d{4}/g, 'AAAA').toLowerCase();
          textos.set(clave, (textos.get(clave) ?? 0) + 1);
        }
      }
      for (const [clave, n] of textos) {
        if (n >= 3) r.avisos.push({ archivo: reg.archivo, campo: 'finanzas[].nota', mensaje: `La misma nota se repite en ${n} años («${clave.slice(0, 80)}…»): una convención va una sola vez, en el resumen.` });
      }
    }

    // 3. Procedencia por corrección.
    if (d.procedencia && d.procedencia.tipo === 'correccion' && !existe('correcciones', d.procedencia.correccion)) {
      err(reg, 'procedencia.correccion', `Referencia rota: no existe la corrección "${d.procedencia.correccion}" en content/correcciones/.`);
    }

    // 4. Correcciones: afecta[] y reemplaza apuntan a registros existentes.
    if (reg.coleccion === 'correcciones') {
      const ids: { valor: string; campo: string }[] = (d.afecta as string[]).map((v, i) => ({ valor: v, campo: `afecta.${i}` }));
      if (typeof d.reemplaza === 'string') ids.push({ valor: d.reemplaza, campo: 'reemplaza' });
      for (const { valor, campo } of ids) {
        const [coleccion, ...resto] = valor.split('/');
        if (!existe(coleccion as NombreColeccion, resto.join('/'))) {
          err(reg, campo, `Referencia rota: no existe "${valor}".`);
        }
      }
    }

    // 5. Convenciones de id.
    if (!reg.enInbox) {
      if (CON_CARPETA_POLITICO.has(reg.coleccion)) {
        const carpeta = reg.id.split('/')[0];
        if (carpeta !== d.politico) err(reg, 'politico', `La carpeta del archivo ("${carpeta}") debe coincidir con el campo politico ("${d.politico}").`);
      }
      if (reg.coleccion === 'cobertura') {
        const carpeta = reg.id.split('/')[0];
        if (carpeta !== d.medio) err(reg, 'medio', `La carpeta del archivo ("${carpeta}") debe coincidir con el campo medio ("${d.medio}").`);
      }
      const campoFecha = CON_FECHA_EN_ID[reg.coleccion];
      if (campoFecha) {
        const ultimo = reg.id.split('/').pop() ?? '';
        const fechaId = ultimo.slice(0, 10);
        if (fechaId !== d[campoFecha]) err(reg, campoFecha, `La fecha del nombre de archivo ("${fechaId}") debe coincidir con ${campoFecha} ("${d[campoFecha]}").`);
      }
      if (reg.coleccion === 'temas') {
        const partes = reg.id.split('/');
        const padreEsperado = partes.length > 1 ? partes.slice(0, -1).join('/') : undefined;
        if ((d.padre ?? undefined) !== padreEsperado) {
          err(reg, 'padre', padreEsperado ? `Un tema en "${reg.id}" debe declarar padre: ${padreEsperado}.` : `Un tema raíz no lleva padre (tiene "${d.padre}"); movelo a content/temas/${d.padre}/ o quitá el campo.`);
        }
      }
    }

    // 6. Giros.
    if (reg.coleccion === 'giros') {
      const antes = contenido.obtener('declaraciones', d.declaracion_antes);
      const despues = contenido.obtener('declaraciones', d.declaracion_despues);
      if (d.declaracion_antes === d.declaracion_despues) err(reg, 'declaracion_despues', 'Las dos declaraciones del giro deben ser distintas.');
      if (antes && despues) {
        if (antes.datos.politico !== despues.datos.politico) {
          err(reg, 'declaracion_despues', `Las dos declaraciones deben ser del mismo político (antes: ${antes.datos.politico}, después: ${despues.datos.politico}).`);
        }
        if (antes.datos.politico !== d.politico) {
          err(reg, 'politico', `El político del giro ("${d.politico}") debe coincidir con el de las declaraciones ("${antes.datos.politico}").`);
        }
        // D3 (docs/plan-fechas.md): se comparan los intervalos reales que cubre cada fecha según su
        // precisión, no el día que `fecha` guarda. Con precisión `dia` en las dos (el caso de
        // siempre) esto es exactamente `antes.datos.fecha < despues.datos.fecha`; una `antes_de`
        // nunca puede ser la "después" porque su intervalo arranca en el año 0.
        const intAntes = intervaloDeFecha(antes.datos.fecha, antes.datos.fecha_precision);
        const intDespues = intervaloDeFecha(despues.datos.fecha, despues.datos.fecha_precision);
        if (!(intAntes.fin < intDespues.inicio)) {
          err(
            reg,
            'declaracion_antes',
            `Fechas invertidas (orden no documentado): la declaración "antes" (${antes.datos.fecha}` +
              `${antes.datos.fecha_precision ? `, fecha_precision: ${antes.datos.fecha_precision}` : ''}) tiene que terminar, a más tardar el ` +
              `${intAntes.fin}, antes de que empiece la "después" (${despues.datos.fecha}` +
              `${despues.datos.fecha_precision ? `, fecha_precision: ${despues.datos.fecha_precision}` : ''}), que arranca el ${intDespues.inicio}.`,
          );
        }
      }
    }

    // 7. Chequeos: la declaración es del mismo político, y el fragmento marcado está en su texto.
    if (reg.coleccion === 'chequeos') {
      const dec = contenido.obtener('declaraciones', d.declaracion);
      if (dec && dec.datos.politico !== d.politico) {
        err(reg, 'declaracion', `La declaración chequeada es de "${dec.datos.politico}", no de "${d.politico}".`);
      }
      if (dec && typeof d.fragmento === 'string' && !fragmentoEsta(d.fragmento, dec.datos.cita, dec.datos.resumen)) {
        err(
          reg,
          'fragmento',
          `El fragmento "${d.fragmento}" no aparece tal cual en la cita ni en el resumen de la declaración "${d.declaracion}", así que la página no lo puede marcar. Copialo exacto de uno de los dos textos.`,
        );
      }
      // D2 (docs/plan-fechas.md): un chequeo es un dato dentro de una cita, no puede tener otra
      // fecha ni otra precisión que la declaración que lo dice.
      if (dec && dec.datos.fecha !== d.fecha) {
        err(
          reg,
          'fecha',
          `La fecha del chequeo (${d.fecha}) tiene que ser la misma que la de la declaración que chequea "${d.declaracion}" (${dec.datos.fecha}): un chequeo es un dato dentro de una cita.`,
        );
      }
      if (dec && (dec.datos.fecha_precision ?? 'dia') !== (d.fecha_precision ?? 'dia')) {
        err(
          reg,
          'fecha_precision',
          `La precisión de fecha del chequeo (${d.fecha_precision ?? 'dia'}) tiene que ser la misma que la de la declaración que chequea "${d.declaracion}" (${dec.datos.fecha_precision ?? 'dia'}).`,
        );
      }
    }

    // 8. Promesas: evidencias posteriores a la promesa.
    if (reg.coleccion === 'promesas') {
      (d.evidencias as any[]).forEach((h, i) => {
        if (h.fecha < d.fecha_promesa) err(reg, `evidencias.${i}.fecha`, `La evidencia (${h.fecha}) no puede ser anterior a fecha_promesa (${d.fecha_promesa}).`);
      });
    }

    // 9. Casos: línea de tiempo ascendente y etiqueta derivada.
    if (reg.coleccion === 'casos') {
      const hitos = d.estado_judicial as any[];
      for (let i = 1; i < hitos.length; i++) {
        if (hitos[i].fecha < hitos[i - 1].fecha) err(reg, `estado_judicial.${i}.fecha`, 'La línea de tiempo judicial debe ser ascendente.');
      }
      const ultima = hitos[hitos.length - 1];
      if (ultima) {
        const esperada = etiquetaLegalDesdeEtapa(ultima.etapa);
        if (d.etiqueta_legal !== esperada) {
          err(reg, 'etiqueta_legal', `etiqueta_legal inconsistente: la última etapa es "${ultima.etapa}", que deriva en "${esperada}" (el archivo dice "${d.etiqueta_legal}").`);
        }
      }
    }

    // 10. fecha_precision (docs/plan-fechas.md, D1 y D2): la convención mecánica de cada precisión,
    // y que nadie diga nada después de morir.
    const campoFecha = FECHA_ENUNCIACION[reg.coleccion];
    if (campoFecha && typeof d[campoFecha] === 'string') {
      const fecha = d[campoFecha] as string;
      const precision = (d.fecha_precision as string | undefined) ?? 'dia';

      if (precision === 'mes' && !fecha.endsWith('-01')) {
        err(reg, campoFecha, `fecha_precision: mes exige que ${campoFecha} sea el día 1 del mes documentado (AAAA-MM-01); tiene "${fecha}".`);
      } else if (precision === 'anio' && !fecha.endsWith('-01-01')) {
        err(reg, campoFecha, `fecha_precision: anio exige que ${campoFecha} sea el 1 de enero del año documentado (AAAA-01-01); tiene "${fecha}".`);
      } else if (precision === 'antes_de') {
        // La cota tiene que salir de un dato documentado: la muerte de la ficha o una fuente de la
        // evidencia de este mismo registro, nunca un número puesto para que el esquema pase.
        const campoEvidencia = EVIDENCIA_ENUNCIACION[reg.coleccion];
        const fuentes: { fecha?: unknown }[] = campoEvidencia && Array.isArray((d[campoEvidencia] as any)?.fuentes) ? (d[campoEvidencia] as any).fuentes : [];
        const politicoDeLaCota = typeof d.politico === 'string' ? contenido.obtener('politicos', d.politico) : undefined;
        const salidaDeLaCota = politicoDeLaCota?.datos.estado_actual?.salida as { tipo?: string; fecha?: string } | undefined;
        const fechaMuerte = salidaDeLaCota?.tipo === 'fallecimiento' ? salidaDeLaCota.fecha : undefined;
        const esCotaDocumentada = fecha === fechaMuerte || fuentes.some((f) => f.fecha === fecha);
        if (!esCotaDocumentada) {
          err(
            reg,
            campoFecha,
            `fecha_precision: antes_de exige que ${campoFecha} sea una cota documentada: la fecha de fallecimiento de la ficha` +
              `${fechaMuerte ? ` (${fechaMuerte})` : ' (la ficha no dice que haya fallecido)'} o la fecha de alguna fuente de la evidencia; "${fecha}" no es ninguna de las dos.`,
          );
        }
      }

      // D2: nadie dice nada después de morir, tenga o no fecha_precision. Con antes_de, `fecha` ya
      // es la cota documentada, y una cota posterior a la muerte es tan imposible como un día real
      // posterior: por eso esto no distingue los dos casos.
      const politico = typeof d.politico === 'string' ? contenido.obtener('politicos', d.politico) : undefined;
      const salida = politico?.datos.estado_actual?.salida as { tipo?: string; fecha?: string } | undefined;
      if (salida?.tipo === 'fallecimiento' && typeof salida.fecha === 'string' && fecha > salida.fecha) {
        err(
          reg,
          campoFecha,
          `"${fecha}" es posterior al fallecimiento de "${d.politico}" (${salida.fecha}, según su ficha): si la fecha de enunciación no está documentada, ${campoFecha} es la cota y fecha_precision: antes_de.`,
        );
      }
    }
  }

  return r;
}

export type { Problema };
