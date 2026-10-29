/**
 * Una corrección dice qué registros toca (`afecta`) y cuáles introduce (`agrega`); el lote que se
 * promueve con ella trae los registros. Este módulo es la comprobación de que las dos mitades dicen
 * lo mismo (docs/plan-correccion-agrega.md), compartida por `pnpm validar --inbox`
 * (`validadores/referencias.ts`) y por `pnpm promover --correccion` para que ninguno de los dos
 * tenga una versión propia de la regla:
 *
 * - cada id de `agrega[]` de la corrección elegida tiene que coincidir con un id que el lote deriva;
 * - cada registro del lote tiene que estar en `afecta[]` o en `agrega[]` de alguna corrección del
 *   propio lote (un lote de `pnpm reverificar --escribir` o de `pnpm lote fusionar` trae varias
 *   correcciones, cada una con sus registros, y se promueven de a una).
 *
 * El id de un registro lo deriva el lote (`derivarId`, scripts/lib/inbox.ts), no la corrección: el
 * mensaje de error lista los ids que el lote sí deriva para que quien escribe `correcciones.yaml`
 * corrija la corrección y no tenga que adivinar ni renombrar el registro.
 *
 * Sin dependencias de disco: funciona sobre listas de ids ya derivados.
 */
import type { Contenido, Registro } from './contenido.ts';

/** Desenlaces que aplican cambios en `content/`: un pedido rechazado o pendiente no agrega ni modifica nada. */
export function esDesenlaceAplicado(desenlace: unknown): boolean {
  return desenlace === 'aceptada' || desenlace === 'parcialmente_aceptada';
}

/** Lo que una corrección declara sobre registros, en ids completos `<coleccion>/<id>`. */
export interface DeclaracionDeCorreccion {
  /** Id de la corrección (`<fecha>-<slug>`), para los mensajes. */
  id: string;
  afecta: string[];
  /** `agrega` más los `a` de los pares de `reemplaza` (el esquema ya exige que estén en `agrega`; acá no se confía en eso). */
  agrega: string[];
}

function listaDeStrings(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];
}

/** Lee `afecta`/`agrega`/`reemplaza` de una corrección (validada o cruda) sin asumir su forma. */
export function declaracionDeCorreccion(id: string, datos: unknown): DeclaracionDeCorreccion {
  const d = (datos && typeof datos === 'object' ? datos : {}) as Record<string, unknown>;
  const agrega = listaDeStrings(d.agrega);
  if (Array.isArray(d.reemplaza)) {
    for (const par of d.reemplaza as { a?: unknown }[]) {
      if (par && typeof par.a === 'string' && !agrega.includes(par.a)) agrega.push(par.a);
    }
  }
  return { id, afecta: listaDeStrings(d.afecta), agrega };
}

/**
 * Correcciones del lote que `pnpm promover --correccion` y la etapa `presentacion` consideran: un
 * registro de la colección `correcciones` en el propio lote (`enInbox: true`), desambiguado por
 * `opciones.correccion` si el lote trae más de uno, o esa misma opción apuntando a una corrección
 * ya publicada en `content/correcciones/` cuando el lote no trae ninguna. Sin ninguna de las dos
 * señales, el modo corrección no se activa.
 */
export function elegirCorrecciones(
  contenido: Contenido,
  opciones: { correccion?: string | true },
): { activa: boolean; delLote: Registro[]; elegidas: Registro[] } {
  const delLote = contenido.de('correcciones').filter((r) => r.enInbox);
  let elegidas = delLote;
  if (typeof opciones.correccion === 'string') {
    const filtradas = delLote.filter((r) => r.id === opciones.correccion);
    if (filtradas.length > 0) {
      elegidas = filtradas;
    } else {
      const publicada = contenido.obtener('correcciones', opciones.correccion);
      elegidas = publicada ? [publicada] : [];
    }
  }
  const activa = delLote.length > 0 || opciones.correccion !== undefined;
  return { activa, delLote, elegidas };
}

export interface DesajusteCorreccionLote {
  /** Ids de `agrega[]` (con la posición en la lista) de una corrección elegida que ningún registro del lote deriva. */
  agregaSinRegistro: { correccion: string; id: string; posicion: number }[];
  /** Ids derivados por el lote que ninguna corrección del lote declara en `afecta` ni en `agrega`. */
  loteSinLugar: string[];
}

/**
 * Compara lo que declaran las correcciones con los ids que deriva el lote.
 *
 * @param elegidas      correcciones que se aplican (las de `agrega` se comprueban contra el lote).
 * @param declaranTodas elegidas más las otras correcciones del mismo lote: un registro declarado por
 *                      cualquiera de ellas tiene lugar (se promueven de a una, el resto se ignora).
 * @param idsDelLote    `<coleccion>/<id>` derivados por el lote, sin los de la colección `correcciones`.
 */
export function compararCorreccionConLote(
  elegidas: DeclaracionDeCorreccion[],
  declaranTodas: DeclaracionDeCorreccion[],
  idsDelLote: string[],
): DesajusteCorreccionLote {
  const delLote = new Set(idsDelLote);
  const agregaSinRegistro: DesajusteCorreccionLote['agregaSinRegistro'] = [];
  for (const c of elegidas) {
    c.agrega.forEach((id, posicion) => {
      if (!delLote.has(id)) agregaSinRegistro.push({ correccion: c.id, id, posicion });
    });
  }
  const declarados = new Set<string>();
  for (const c of declaranTodas) {
    for (const id of c.afecta) declarados.add(id);
    for (const id of c.agrega) declarados.add(id);
  }
  const loteSinLugar = idsDelLote.filter((id) => !declarados.has(id));
  return { agregaSinRegistro, loteSinLugar };
}

function coleccionDe(id: string): string {
  return id.slice(0, id.indexOf('/'));
}

/** Hasta `max` ids, con «y N más» si hay más, para que el mensaje se lea. */
function listar(ids: string[], max = 12): string {
  if (ids.length <= max) return ids.join(', ');
  return `${ids.slice(0, max).join(', ')} y ${ids.length - max} más`;
}

export interface ProblemaDeCorreccionLote {
  /** `agrega`: el problema es de una línea de `agrega[]`; `lote`: de un registro del lote. */
  tipo: 'agrega' | 'lote';
  /** Id de la corrección (tipo `agrega`). */
  correccion?: string;
  /** Posición en `agrega[]` (tipo `agrega`). */
  posicion?: number;
  /** Id completo del registro implicado. */
  id: string;
  mensaje: string;
}

/**
 * Mensajes del desajuste, con los ids que el lote sí deriva. Mismo texto para el validador y para
 * `promover`: lo que el editor lee en uno es lo que lee en el otro.
 */
export function problemasDeCorreccionLote(d: DesajusteCorreccionLote, idsDelLote: string[]): ProblemaDeCorreccionLote[] {
  const sinDeclarar = d.loteSinLugar;
  const problemas: ProblemaDeCorreccionLote[] = [];

  for (const a of d.agregaSinRegistro) {
    const coleccion = coleccionDe(a.id);
    const mismaColeccion = idsDelLote.filter((id) => coleccionDe(id) === coleccion);
    const candidatos = sinDeclarar.filter((id) => coleccionDe(id) === coleccion);
    problemas.push({
      tipo: 'agrega',
      correccion: a.correccion,
      posicion: a.posicion,
      id: a.id,
      mensaje:
        `La corrección ${a.correccion} dice que agrega "${a.id}" y el lote no deriva ese id. ` +
        `El lote deriva, en ${coleccion}: ${mismaColeccion.length ? listar(mismaColeccion) : '(ninguno)'}` +
        `${candidatos.length ? `; sin declarar en la corrección: ${listar(candidatos)}` : ''}. ` +
        `Corregí 'agrega' en correcciones.yaml con el id que deriva el lote: el id lo deriva el lote, no la corrección, y el registro no se renombra para que coincida.`,
    });
  }

  for (const id of d.loteSinLugar) {
    const coleccion = coleccionDe(id);
    const faltantes = d.agregaSinRegistro.filter((a) => coleccionDe(a.id) === coleccion).map((a) => a.id);
    problemas.push({
      tipo: 'lote',
      id,
      mensaje:
        `El lote deriva "${id}" y ninguna corrección lo declara en 'afecta' ni en 'agrega'. ` +
        `Si es un registro nuevo va en 'agrega' con ese id; si ya está publicado y cambia, en 'afecta'; si no es de esta corrección, sacalo del lote.` +
        `${faltantes.length ? ` En 'agrega' hay ids de ${coleccion} sin registro en el lote (${listar(faltantes)}): probablemente son este id mal escrito.` : ''}` +
        ` Ids que deriva el lote: ${idsDelLote.length ? listar(idsDelLote) : '(ninguno)'}.`,
    });
  }
  return problemas;
}
