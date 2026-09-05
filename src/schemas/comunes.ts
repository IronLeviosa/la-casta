/**
 * Punto de entrada de los esquemas de La Casta.
 *
 * Re-exporta los tipos comunes (FechaISO, Tier, NivelEvidencia, TipoFuente,
 * Fuente, Evidencia, Revision, Procedencia) y expone:
 *   - `esquemasPorColeccion`: nombre de colección → esquema Zod listo para
 *     scripts (las referencias cruzadas son `z.string()`).
 *   - `COLECCIONES`: carpeta, extensión y patrón de id de cada colección.
 *   - `crearEsquemas(ref)`: construye el mismo mapa con otra fábrica de
 *     referencias (Astro usa `reference()`).
 *
 * Los primitivos viven en ./base para que los esquemas por colección no
 * importen este archivo (evita ciclos de importación).
 */
import type { z } from 'astro/zod';
import {
  crearEvidenciaSchema,
  crearFuenteSchema,
  crearProcedenciaSchema,
  refTexto,
  type NombreColeccion,
  type Ref,
} from './base';
import { crearCasoSchema } from './caso';
import { crearChequeoSchema } from './chequeo';
import { crearCoberturaSchema } from './cobertura';
import { crearCorreccionSchema } from './correccion';
import { crearDeclaracionSchema } from './declaracion';
import { crearEventoSchema } from './evento';
import { crearGiroSchema } from './giro';
import { crearIntervencionSchema } from './intervencion';
import { crearLeySchema } from './ley';
import { crearMedioSchema } from './medio';
import { crearMencionSchema } from './mencion';
import { PaginaSchema } from './pagina';
import { crearPatrimonioSchema } from './patrimonio';
import { crearPoliticoSchema } from './politico';
import { crearPromesaSchema } from './promesa';
import { crearDiscrepanciaSchema } from './discrepancia';
import { crearVetoSchema } from './veto';
import { crearReferenteSchema } from './referente';
import { crearTemaSchema } from './tema';

// Tipos comunes (re-exportados desde ./base)
export {
  FechaISO,
  Slug,
  Tier,
  NivelEvidencia,
  TipoFuente,
  Verificacion,
  MarcaTiempo,
  Sha256,
  Revision,
  crearFuenteSchema,
  crearEvidenciaSchema,
  crearProcedenciaSchema,
  refTexto,
  NOMBRES_COLECCIONES,
} from './base';
export type {
  Fuente as FuenteT,
  Evidencia as EvidenciaT,
  Procedencia as ProcedenciaT,
  RevisionT,
  Ref,
  Opciones,
  NombreColeccion,
} from './base';

/** Esquemas listos para scripts: las referencias cruzadas son ids en texto. */
export const Fuente = crearFuenteSchema({ ref: refTexto });
export const Evidencia = crearEvidenciaSchema({ ref: refTexto });
export const Procedencia = crearProcedenciaSchema({ ref: refTexto });

// Re-export de enums y utilidades por colección
export { Situacion, TipoSalida } from './politico';
export { TipoMedio, EtiquetaAlineamiento } from './medio';
export { TipoReferente } from './referente';
export { ContextoDeclaracion } from './declaracion';
export { Cambio, Explicacion } from './giro';
export { EstadoPromesa, TipoEvidenciaPromesa, Efecto } from './promesa';
export { TipoCaso, RolInvolucrado, EtapaJudicial, EtiquetaLegal, etiquetaLegalDesdeEtapa } from './caso';
export { Calificacion } from './chequeo';
export { Tono } from './cobertura';
export { TipoIntervencion, FormatoIntervencion, ClaseSegmento, SubtipoEvasion, Respuesta } from './intervencion';
export { Moneda, TipoEventoPatrimonial } from './patrimonio';
export { SentidoMencion } from './mencion';
export { TipoCorreccion } from './correccion';
export { PaginaSchema } from './pagina';
export { NumeroLey, ArticuloLey } from './ley';

// ---------------------------------------------------------------------------
// Mapa de esquemas
// ---------------------------------------------------------------------------

/** Construye el mapa colección → esquema con la fábrica de referencias dada. */
export function crearEsquemas(ref: Ref) {
  const op = { ref };
  return {
    politicos: crearPoliticoSchema(op),
    temas: crearTemaSchema(op),
    medios: crearMedioSchema(op),
    eventos: crearEventoSchema(op),
    referentes: crearReferenteSchema(op),
    declaraciones: crearDeclaracionSchema(op),
    giros: crearGiroSchema(op),
    promesas: crearPromesaSchema(op),
    casos: crearCasoSchema(op),
    chequeos: crearChequeoSchema(op),
    cobertura: crearCoberturaSchema(op),
    intervenciones: crearIntervencionSchema(op),
    patrimonio: crearPatrimonioSchema(op),
    menciones: crearMencionSchema(op),
    correcciones: crearCorreccionSchema(op),
    paginas: PaginaSchema,
    leyes: crearLeySchema(op),
    vetos: crearVetoSchema(op),
    discrepancias: crearDiscrepanciaSchema(op),
  } satisfies Record<NombreColeccion, z.ZodType>;
}

/** Esquemas para scripts (tsx): las referencias son `z.string()`. */
export const esquemasPorColeccion = crearEsquemas(refTexto);

export type EsquemasPorColeccion = typeof esquemasPorColeccion;

// ---------------------------------------------------------------------------
// Colecciones: carpeta, extensión y patrón de id
// ---------------------------------------------------------------------------

const SLUG = '[a-z0-9]+(?:-[a-z0-9]+)*';
const FECHA = '\\d{4}-\\d{2}-\\d{2}';
/** Id de una ley: el número con guion en lugar de punto (18.331 → 18-331), porque el id es un slug. */
const NUMERO_LEY = '\\d{1,2}-\\d{3}';

export interface DefinicionColeccion {
  /** Nombre de la colección (clave en esquemasPorColeccion). */
  nombre: NombreColeccion;
  /** Carpeta relativa a la raíz del repo. */
  carpeta: string;
  /** Extensión de los archivos. */
  extension: 'yaml' | 'md';
  /** Patrón que debe cumplir el id (ruta relativa a la carpeta, sin extensión, con `/`). */
  patronId: RegExp;
  /** Ejemplo de id válido, para mensajes de error. */
  ejemplo: string;
  /** true si es colección de referencia (no exige procedencia). */
  referencia: boolean;
}

export const COLECCIONES: readonly DefinicionColeccion[] = [
  { nombre: 'politicos', carpeta: 'content/politicos', extension: 'yaml', patronId: new RegExp(`^${SLUG}$`), ejemplo: 'lacalle-pou', referencia: true },
  { nombre: 'temas', carpeta: 'content/temas', extension: 'yaml', patronId: new RegExp(`^${SLUG}(?:/${SLUG})?$`), ejemplo: 'economia/impuestos', referencia: true },
  { nombre: 'medios', carpeta: 'content/medios', extension: 'yaml', patronId: new RegExp(`^${SLUG}$`), ejemplo: 'el-pais', referencia: true },
  { nombre: 'eventos', carpeta: 'content/eventos', extension: 'yaml', patronId: new RegExp(`^${SLUG}$`), ejemplo: 'caso-astesiano', referencia: true },
  { nombre: 'referentes', carpeta: 'content/referentes', extension: 'yaml', patronId: new RegExp(`^${SLUG}$`), ejemplo: 'batlle-y-ordonez', referencia: true },
  { nombre: 'declaraciones', carpeta: 'content/declaraciones', extension: 'yaml', patronId: new RegExp(`^${SLUG}/${FECHA}-${SLUG}$`), ejemplo: 'lacalle-pou/2019-10-15-no-subir-impuestos', referencia: false },
  { nombre: 'giros', carpeta: 'content/giros', extension: 'yaml', patronId: new RegExp(`^${SLUG}/${SLUG}$`), ejemplo: 'lacalle-pou/iva-tarjeta-2020', referencia: false },
  { nombre: 'promesas', carpeta: 'content/promesas', extension: 'yaml', patronId: new RegExp(`^${SLUG}/${SLUG}$`), ejemplo: 'lacalle-pou/no-subir-impuestos', referencia: false },
  { nombre: 'casos', carpeta: 'content/casos', extension: 'yaml', patronId: new RegExp(`^${SLUG}$`), ejemplo: 'astesiano', referencia: false },
  { nombre: 'chequeos', carpeta: 'content/chequeos', extension: 'yaml', patronId: new RegExp(`^${SLUG}/${FECHA}-${SLUG}$`), ejemplo: 'lacalle-pou/2021-05-03-recaudacion-iva', referencia: false },
  { nombre: 'cobertura', carpeta: 'content/cobertura', extension: 'yaml', patronId: new RegExp(`^${SLUG}/${FECHA}-${SLUG}$`), ejemplo: 'el-pais/2022-09-27-astesiano-detenido', referencia: false },
  { nombre: 'intervenciones', carpeta: 'content/intervenciones', extension: 'yaml', patronId: new RegExp(`^${SLUG}/${FECHA}-${SLUG}$`), ejemplo: 'lacalle-pou/2020-03-13-conferencia-emergencia', referencia: false },
  { nombre: 'patrimonio', carpeta: 'content/patrimonio', extension: 'yaml', patronId: new RegExp(`^${SLUG}/${FECHA}$`), ejemplo: 'lacalle-pou/2020-03-31', referencia: false },
  { nombre: 'menciones', carpeta: 'content/menciones', extension: 'yaml', patronId: new RegExp(`^${SLUG}/${FECHA}-${SLUG}$`), ejemplo: 'mujica/2013-09-24-seregni', referencia: false },
  { nombre: 'correcciones', carpeta: 'content/correcciones', extension: 'yaml', patronId: new RegExp(`^${FECHA}-${SLUG}$`), ejemplo: '2026-09-03-fuente-caida-el-pais', referencia: false },
  { nombre: 'paginas', carpeta: 'content/paginas', extension: 'md', patronId: new RegExp(`^${SLUG}$`), ejemplo: 'sobre', referencia: true },
  { nombre: 'leyes', carpeta: 'content/leyes', extension: 'yaml', patronId: new RegExp(`^${NUMERO_LEY}$`), ejemplo: '18-331', referencia: true },
  { nombre: 'vetos', carpeta: 'content/vetos', extension: 'yaml', patronId: new RegExp(`^${SLUG}/${FECHA}-${SLUG}$`), ejemplo: 'vazquez/2008-11-14-salud-sexual-reproductiva', referencia: false },
  { nombre: 'discrepancias', carpeta: 'content/discrepancias', extension: 'yaml', patronId: new RegExp(`^${SLUG}/${FECHA}-${SLUG}$`), ejemplo: 'el-pais/2023-10-24-articulo-36-fiscales', referencia: false },
];

export function definicionDeColeccion(nombre: NombreColeccion): DefinicionColeccion {
  const def = COLECCIONES.find((c) => c.nombre === nombre);
  if (!def) throw new Error(`Colección desconocida: ${nombre}`);
  return def;
}
