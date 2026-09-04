/**
 * Tipos comunes del modelo de datos de La Casta.
 *
 * Se importa `z` desde 'astro/zod' para que los mismos esquemas sirvan dentro
 * de Astro (content.config.ts) y en scripts corridos con tsx.
 *
 * Toda referencia cruzada entre colecciones se construye con `ref(coleccion)`:
 * en Astro devuelve `reference(coleccion)` (enlace roto = error de build);
 * en scripts devuelve `z.string()` (el validador de referencias resuelve aparte).
 */
import { z } from 'astro/zod';

export const NOMBRES_COLECCIONES = [
  'politicos',
  'temas',
  'medios',
  'eventos',
  'referentes',
  'declaraciones',
  'giros',
  'promesas',
  'casos',
  'chequeos',
  'cobertura',
  'intervenciones',
  'patrimonio',
  'menciones',
  'correcciones',
  'paginas',
  'leyes',
] as const;

export type NombreColeccion = (typeof NOMBRES_COLECCIONES)[number];

/**
 * Referencia resuelta a otro registro.
 *
 * En el sitio, `reference()` de Astro transforma el id en `{ id, collection }`,
 * y eso es lo que llega a `entry.data`. En los scripts la referencia sigue
 * siendo el id en texto; el validador de referencias la resuelve aparte.
 * El tipo declara la forma de Astro porque es la que consumen las páginas y los
 * componentes; en los scripts el contenido de `content/` se lee con tipos
 * propios (`scripts/lib/contenido.ts`), no con estos.
 */
export interface Referencia {
  id: string;
  collection: string;
}

/** Fábrica de referencias: `reference()` en Astro, `z.string()` en scripts. */
export type Ref = (coleccion: NombreColeccion) => z.ZodType<Referencia, string>;

/** Implementación de `ref` para scripts: la referencia es un id en texto. */
export const refTexto: Ref = (coleccion) =>
  z.string().min(1).describe(`Id de un registro de la colección "${coleccion}" (ruta relativa sin extensión).`) as unknown as z.ZodType<Referencia, string>;

export type Opciones = { ref: Ref };

// ---------------------------------------------------------------------------
// Primitivos
// ---------------------------------------------------------------------------

const FechaISOTexto = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha en formato YYYY-MM-DD')
  .refine((s) => !Number.isNaN(Date.parse(s)), 'Fecha inválida (YYYY-MM-DD)');

/**
 * Fecha YYYY-MM-DD. Algunos parsers de YAML (el de Astro) convierten
 * `2020-03-01` sin comillas en un Date; acá se normaliza de vuelta a texto
 * para que el resto del esquema y las comparaciones trabajen con strings.
 */
export const FechaISO = z
  .preprocess((v) => (v instanceof Date && !Number.isNaN(v.getTime()) ? v.toISOString().slice(0, 10) : v), FechaISOTexto)
  .describe('Fecha en formato ISO YYYY-MM-DD.');

export const Slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug en minúsculas, sin acentos, con guiones')
  .describe('Identificador corto en minúsculas, sin acentos, palabras separadas por guiones.');

export const Tier = z
  .enum(['publicado', 'probable', 'hipotesis'])
  .describe('Nivel editorial: publicado (verificado), probable (con banner, noindex) o hipotesis (privado; nunca dentro de content/).');

export const NivelEvidencia = z
  .enum(['textual', 'reportado', 'inferencia'])
  .describe('textual: cita literal en video, documento oficial o diario de sesiones; reportado: lo dice la prensa (exige 2 grupos de medios distintos); inferencia: conclusión propia (exige cadena).');

export const TipoFuente = z
  .enum(['video', 'nota', 'documento_oficial', 'diario_de_sesiones', 'redes'])
  .describe('Tipo de fuente: video, nota de prensa, documento_oficial, diario_de_sesiones o redes sociales.');

export const Verificacion = z
  .enum(['automatica', 'manual'])
  .describe('automatica: la cita se encontró mecánicamente en el texto o la transcripción; manual: no descargable (TV, X, paywall), requiere aprobación humana.');

export const MarcaTiempo = z
  .string()
  .regex(/^(?:\d{1,2}:)?[0-5]?\d:[0-5]\d$/, 'Marca de tiempo H:MM:SS o MM:SS')
  .describe('Marca de tiempo dentro del video, formato H:MM:SS o MM:SS. Obligatoria si tipo = video.');

export const Sha256 = z
  .string()
  .regex(/^[a-f0-9]{64}$/, 'Hash SHA-256 en hexadecimal (64 caracteres)')
  .describe('Hash SHA-256 en hexadecimal minúsculo.');

// ---------------------------------------------------------------------------
// Fuente
// ---------------------------------------------------------------------------

export function crearFuenteSchema({ ref }: Opciones) {
  return z
    .object({
      url: z.url().describe('URL original de la fuente. Debe figurar como "ok" en data/fuentes-ledger.json para publicarse.'),
      medio: ref('medios').describe('Medio que publicó la fuente (id de content/medios).'),
      fecha: FechaISO.describe('Fecha de publicación de la fuente (YYYY-MM-DD).'),
      tipo: TipoFuente,
      titulo: z.string().min(1).optional().describe('Título de la nota, video o documento.'),
      cita: z
        .string()
        .min(20, 'La cita debe tener al menos 20 caracteres y ser textual')
        .describe('Extracto textual copiado de la fuente (mínimo 20 caracteres). El validador de citas la busca literalmente en el texto o la transcripción.'),
      marca_tiempo: MarcaTiempo.optional(),
      archived_url: z.url().optional().describe('URL de la copia archivada (Wayback Machine).'),
      retrieved_at: FechaISO.describe('Fecha en que se leyó la fuente (YYYY-MM-DD).'),
      verificacion: Verificacion.optional(),
      transcripcion_extracto: z
        .string()
        .optional()
        .describe('Solo video: 30 segundos de contexto de la transcripción alrededor de la cita, escrito por el validador.'),
    })
    .strict()
    .superRefine((f, ctx) => {
      if (f.tipo === 'video' && !f.marca_tiempo) {
        ctx.addIssue({
          code: 'custom',
          path: ['marca_tiempo'],
          message: 'Una fuente de tipo video requiere marca_tiempo (H:MM:SS).',
        });
      }
    })
    .describe('Fuente citable: URL, medio, fecha, tipo y una cita textual de al menos 20 caracteres.');
}

export type Fuente = z.infer<ReturnType<typeof crearFuenteSchema>>;

// ---------------------------------------------------------------------------
// Evidencia
// ---------------------------------------------------------------------------

export function crearEvidenciaSchema({ ref }: Opciones) {
  const Fuente = crearFuenteSchema({ ref });
  return z
    .object({
      nivel: NivelEvidencia,
      fuentes: z.array(Fuente).min(1, 'Se requiere al menos una fuente').describe('Fuentes que respaldan la afirmación (mínimo 1).'),
      cadena: z
        .array(z.string().min(1))
        .optional()
        .describe('Pasos del razonamiento cuando nivel = inferencia: cada paso enuncia un hecho y de qué fuente sale.'),
    })
    .strict()
    .superRefine((e, ctx) => {
      if (e.nivel === 'inferencia' && (!e.cadena || e.cadena.length === 0)) {
        ctx.addIssue({
          code: 'custom',
          path: ['cadena'],
          message: 'Una evidencia de nivel inferencia requiere cadena con al menos un paso.',
        });
      }
    })
    .describe('Evidencia: nivel (textual | reportado | inferencia), fuentes y, si es inferencia, la cadena de razonamiento.');
}

export type Evidencia = z.infer<ReturnType<typeof crearEvidenciaSchema>>;

// ---------------------------------------------------------------------------
// Revision
// ---------------------------------------------------------------------------

export const Revision = z
  .object({
    tier: Tier,
    notas_internas: z.string().optional().describe('Notas del editor; no se muestran en el sitio.'),
  })
  .strict()
  .describe('Estado editorial del registro: tier y notas internas.');

export type RevisionT = z.infer<typeof Revision>;

// ---------------------------------------------------------------------------
// Procedencia (auditabilidad)
// ---------------------------------------------------------------------------

export function crearProcedenciaSchema({ ref }: Opciones) {
  const PorCorrida = z
    .object({
      corrida: z.string().min(1).describe('Id de la corrida en data/corridas/<id>/ que produjo el registro.'),
      agente: z.string().min(1).describe('Nombre del agente que escribió el crudo (ej. investigador).'),
      agente_sha: Sha256.describe('SHA-256 del archivo .claude/agents/<agente>.md en ese momento.'),
      modelo: z.string().min(1).describe('Id del modelo que devolvió el agente (ej. claude-sonnet-4-...).'),
      brief_sha: Sha256.describe('SHA-256 del brief.md que recibió el agente.'),
      fecha: FechaISO.describe('Fecha de la corrida (YYYY-MM-DD).'),
    })
    .strict()
    .describe('Procedencia por corrida del pipeline.');

  const PorCorreccion = z
    .object({
      tipo: z.literal('correccion').describe('Marca que el registro fue creado o modificado por una corrección.'),
      correccion: ref('correcciones').describe('Id del registro en content/correcciones que explica el cambio.'),
    })
    .strict()
    .describe('Procedencia por corrección editorial.');

  return z
    .union([PorCorrida, PorCorreccion])
    .describe('Procedencia: o bien la corrida del pipeline que lo produjo (corrida, agente, agente_sha, modelo, brief_sha, fecha), o bien tipo: correccion + id de la corrección.');
}

export type Procedencia = z.infer<ReturnType<typeof crearProcedenciaSchema>>;

/** Lista de ids de temas (jerárquicos, ej. economia/impuestos). */
export const listaTemas = ({ ref }: Opciones) =>
  z.array(ref('temas')).describe('Temas de la taxonomía (ids de content/temas, ej. economia/impuestos).');

/** Lista de ids de eventos. */
export const listaEventos = ({ ref }: Opciones) =>
  z.array(ref('eventos')).describe('Eventos relacionados (ids de content/eventos, ej. caso-astesiano).');
