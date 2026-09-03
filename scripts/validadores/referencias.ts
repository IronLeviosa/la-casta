/**
 * Etapa 2: referencias cruzadas y coherencia entre registros.
 *
 * - Toda referencia (politico, tema, medio, evento, declaracion, referente, caso,
 *   correccion, padre de tema) apunta a un registro existente (en content/ o,
 *   en modo --inbox, dentro de la misma corrida).
 * - Giros: mismo político en ambas declaraciones y en el giro, antes ≠ después,
 *   fecha(antes) < fecha(después).
 * - Chequeos: la declaración chequeada es del mismo político.
 * - Promesas: evidencias fechadas ≥ fecha_promesa.
 * - Casos: línea de tiempo ascendente y etiqueta_legal derivada de la última etapa.
 * - Convenciones de id: carpeta == politico (o medio en cobertura), fecha del id == fecha.
 * - Temas: padre coherente con la ruta del id.
 */
import { etiquetaLegalDesdeEtapa, type NombreColeccion } from '../../src/schemas/comunes';
import { recorrerFuentes, type Contenido, type Registro } from '../lib/contenido.ts';
import { resultadoVacio, type Problema, type ResultadoEtapa } from './tipos.ts';

/** Campos de referencia directa por colección: campo → colección destino (`[]` = lista). */
const REFERENCIAS: Partial<Record<NombreColeccion, Record<string, NombreColeccion>>> = {
  temas: { padre: 'temas' },
  eventos: { 'temas[]': 'temas', 'politicos[]': 'politicos', 'casos[]': 'casos' },
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
        err(reg, `${ruta}.medio`, `Medio desconocido: no existe "${f.medio}" en content/medios/. Agregalo con pnpm nuevo medios ${f.medio} o corregí el slug.`);
      }
    });

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
        if (!(antes.datos.fecha < despues.datos.fecha)) {
          err(reg, 'declaracion_antes', `Fechas invertidas: la declaración "antes" (${antes.datos.fecha}) debe ser anterior a la "después" (${despues.datos.fecha}).`);
        }
      }
    }

    // 7. Chequeos: la declaración es del mismo político.
    if (reg.coleccion === 'chequeos') {
      const dec = contenido.obtener('declaraciones', d.declaracion);
      if (dec && dec.datos.politico !== d.politico) {
        err(reg, 'declaracion', `La declaración chequeada es de "${dec.datos.politico}", no de "${d.politico}".`);
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
  }

  return r;
}

export type { Problema };
