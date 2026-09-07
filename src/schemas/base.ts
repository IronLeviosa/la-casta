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
  'vetos',
  'discrepancias',
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

const FechaParcialTexto = z
  .string()
  .regex(/^\d{4}(-\d{2}(-\d{2})?)?$/, 'Fecha YYYY, YYYY-MM o YYYY-MM-DD')
  .refine((v) => !Number.isNaN(Date.parse(completarFecha(v, 'inicio'))), 'Fecha inválida');

/**
 * Fecha con precisión declarada por su largo: `1990`, `1990-03` o `1990-03-05`.
 *
 * Existe porque exigir día exacto en todos lados no hace que el dato sea más preciso: hace que
 * desaparezca. Tres cargos reales, documentados en varias fuentes, quedaron fuera del sitio por no
 * tener día —la edilía de Topolansky, la dirección de TI de Cosse, la dirección del INAME de
 * Argimón— y ese filtro no cae parejo: castiga lo más viejo y lo menos cubierto por la prensa, que
 * es justo lo que un registro de trayectoria no debería perder.
 *
 * La precisión no se infiere ni se completa: se guarda tal como se pudo documentar, y el sitio
 * muestra "1990" cuando eso es todo lo que se sabe. Para comparar y ordenar se usa
 * `completarFecha`, que rellena de forma explícita según se trate de un inicio o de un fin.
 */
export const FechaParcial = z
  .preprocess((v) => (v instanceof Date && !Number.isNaN(v.getTime()) ? v.toISOString().slice(0, 10) : typeof v === 'number' ? String(v) : v), FechaParcialTexto)
  .describe('Fecha en formato YYYY, YYYY-MM o YYYY-MM-DD, según la precisión que la fuente permita.');

/**
 * Completa una fecha parcial para comparar. `inicio` toma el primer instante posible del período y
 * `fin` el último, de modo que un mandato "1990"–"1995" abarque desde el 1 de enero de 1990 hasta
 * el 31 de diciembre de 1995 y no un solo día de cada año.
 */
export function completarFecha(fecha: string, extremo: 'inicio' | 'fin'): string {
  if (/^\d{4}$/.test(fecha)) return extremo === 'inicio' ? `${fecha}-01-01` : `${fecha}-12-31`;
  if (/^\d{4}-\d{2}$/.test(fecha)) {
    if (extremo === 'inicio') return `${fecha}-01`;
    const [a, m] = fecha.split('-').map(Number);
    return `${fecha}-${String(new Date(Date.UTC(a, m, 0)).getUTCDate()).padStart(2, '0')}`;
  }
  return fecha;
}

/** Cuánta precisión tiene una fecha parcial: 'dia', 'mes' o 'anio'. */
export function precisionFecha(fecha: string): 'anio' | 'mes' | 'dia' {
  if (/^\d{4}$/.test(fecha)) return 'anio';
  if (/^\d{4}-\d{2}$/.test(fecha)) return 'mes';
  return 'dia';
}

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
      /**
       * Qué tan textual es la `cita`.
       *
       * Hasta ahora el esquema solo admitía `literal`, y el validador de citas compara contra la
       * fuente con umbral 0,9. Eso hacía que **una condensación fiel fallara igual que una
       * tergiversación**, que son cosas distintas: un medio que resume "si uno aprieta, aprieta,
       * aprieta, ¿qué hace? asfixia" como "si uno aprieta, asfixia" conserva el sentido, la
       * estructura y la palabra clave; uno que corta una frase por la mitad para cambiarle el
       * sentido, no. Sin esta distinción el sistema no puede señalar la segunda sin castigar la
       * primera, y el lector no tiene forma de juzgar cuál es cuál.
       *
       * `condensada` **exige `contexto`**: si se recortó, el lector tiene que poder leer lo que se
       * dijo entero y decidir por su cuenta si el recorte cambia algo.
       */
      literalidad: z
        .enum(['literal', 'condensada', 'aproximada', 'difiere'])
        .optional()
        .describe(
          'literal (calza con el registro primario), condensada (recorte fiel, exige `contexto`), aproximada (no se pudo cotejar contra un registro primario), difiere (se cotejó y no coincide; exige `verificada_en.diferencia`).',
        ),
      /**
       * El pasaje completo alrededor de la cita, en las palabras exactas. Se muestra al lector
       * cuando abre la cita: es lo que le permite ver qué se recortó.
       */
      contexto: z
        .string()
        .min(20)
        .optional()
        .describe('Pasaje textual más amplio alrededor de la cita, para que el lector vea qué quedó afuera.'),
      /**
       * Qué se le preguntó. Una frase cambia de sentido según la pregunta que responde, y es la
       * información que más seguido falta para juzgar si una cita está fuera de contexto.
       */
      pregunta: z
        .string()
        .min(5)
        .optional()
        .describe('La pregunta o consigna que la persona estaba respondiendo, textual si se conoce.'),
      /**
       * Cuando la fuente es el audio o el video suelto (un track de SoundCloud, un mp4), la nota
       * del medio donde eso está publicado es otra URL. El lector que quiere ir a la cobertura
       * completa necesita esa, no el archivo.
       */
      url_nota: z.url().optional().describe('Página del medio donde se publica esta fuente, si la fuente es el archivo de audio o video.'),
      /**
       * Contra qué se cotejó la cita, cuando la fuente es de prensa y existe el registro primario
       * del mismo hecho: el audio de la entrevista, el video de la conferencia, el texto oficial.
       *
       * Sin esto, una nota que cita a la persona quedaba "sin verificar" aunque el audio estuviera
       * a un clic, y el lector no tenía forma de saber si el diario transcribió bien. El caso que lo
       * motivó: la nota de En Perspectiva sobre el coloquio de 2019 escribía "90 días" y el audio,
       * en 1:28:49, dice "cien días". Acá queda dónde está el pasaje en el original y, si difiere,
       * en qué. Sin verbos de intención: se registra qué publicó el medio y qué dice el original.
       */
      verificada_en: z
        .object({
          url: z.url().describe('URL del registro primario contra el que se cotejó la cita (audio, video, documento oficial o diario de sesiones).'),
          marca_tiempo: MarcaTiempo.optional().describe('Dónde está el pasaje en ese registro, si es audio o video.'),
          diferencia: z.string().min(10).optional().describe('En qué difiere lo publicado de lo que dice el original, sin verbos de intención. Obligatoria si literalidad = difiere.'),
        })
        .strict()
        .optional()
        .describe('Registro primario contra el que se cotejó esta cita, con la posición del pasaje y, si no coincide, la diferencia.'),
      marca_tiempo: MarcaTiempo.optional(),
      /**
       * Dónde empieza el `contexto` en el audio o video. `marca_tiempo` es el segundo donde empieza
       * la cita; si el reproductor arranca ahí, el lector se pierde lo que se dijo justo antes, que
       * es lo que `contexto` existe para mostrar. Con esta marca el reproductor arranca en el
       * contexto y el botón sigue diciendo dónde empieza la cita.
       */
      marca_tiempo_contexto: MarcaTiempo.optional().describe('Segundo donde empieza el `contexto` en el audio o video; el reproductor arranca ahí en vez de en la cita.'),
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
      // Una cita condensada sin el original es la peor combinacion: le pide al lector que confie
      // en que el recorte es fiel, sin darle con que comprobarlo. El recorte es legitimo; ocultar
      // lo recortado, no.
      // "Difiere" sin decir de qué y en qué sería una acusación sin prueba contra el medio.
      if (f.literalidad === 'difiere' && !f.verificada_en?.diferencia) {
        ctx.addIssue({
          code: 'custom',
          path: ['verificada_en'],
          message:
            'Una cita `difiere` exige `verificada_en` con `url` y `diferencia`: si se cotejó contra el original y no coincide, el lector tiene que poder ver contra qué y en qué.',
        });
      }
      if (f.literalidad === 'condensada' && !f.contexto) {
        ctx.addIssue({
          code: 'custom',
          path: ['contexto'],
          message:
            'Una cita `condensada` exige `contexto` con el pasaje completo: si se recortó, el lector tiene que poder ver qué quedó afuera y juzgar si el recorte cambia el sentido.',
        });
      }
    })
    .describe('Fuente citable: URL, medio, fecha, tipo y una cita textual de al menos 20 caracteres.');
}

export type Fuente = z.infer<ReturnType<typeof crearFuenteSchema>>;

// ---------------------------------------------------------------------------
// Gráfico
// ---------------------------------------------------------------------------

/**
 * Un gráfico chico que la página dibuja al construirse, con números que ya están en el registro.
 *
 * Un chequeo que compara cifras en el tiempo o entre categorías (resultados de una empresa por
 * año, precios de dos países) se entiende de un vistazo en barras y cuesta párrafos en prosa. Cada
 * serie declara su fuente en una frase, y los documentos van en las fuentes del registro: un
 * gráfico sin fuente es peor que ninguno.
 */
export function crearGraficoSchema() {
  const Punto = z
    .object({
      x: z.string().min(1).describe('Categoría o período (ej. "2019", "Nafta").'),
      y: z.number().describe('Valor numérico, en la unidad del gráfico.'),
      nota: z.string().optional().describe('Aclaración corta del punto (ej. "al tipo de cambio de cierre").'),
    })
    .strict();
  const Serie = z
    .object({
      nombre: z.string().min(1).describe('Nombre de la serie (ej. "Uruguay", "Resultado del ejercicio").'),
      fuente: z.string().min(1).describe('De dónde salen los números, en una frase (organismo, documento, período). El documento va en las fuentes del registro.'),
      puntos: z.array(Punto).min(1),
    })
    .strict();
  return z
    .object({
      tipo: z.enum(['barras', 'lineas']),
      titulo: z.string().min(3).describe('Qué muestra el gráfico, en una línea.'),
      unidad: z.string().min(1).describe('Unidad de los valores (ej. "millones de USD", "USD por litro").'),
      series: z.array(Serie).min(1).max(4),
      colorear_por_signo: z.boolean().default(false).describe('true si lo que importa es si el valor es positivo o negativo (una sola serie).'),
      nota: z.string().optional().describe('Aclaración corta al pie (convención usada, qué producto se compara).'),
    })
    .strict()
    .describe('Gráfico de barras o líneas con los números del registro y su fuente.');
}

export type Grafico = z.infer<ReturnType<typeof crearGraficoSchema>>;

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
    que_falta: z
      .string()
      .optional()
      .describe(
        'Solo en tier `probable`: qué le falta a este registro para publicarse, en una oración dirigida al lector. ' +
          'Se muestra en la ficha, a diferencia de `notas_internas`. Existe porque hay huecos que ninguna regla mecánica ' +
          'puede derivar (falta el estado de un expediente, falta el descargo del involucrado) y sin decirlos nadie puede ' +
          'ayudar a cerrarlos, ni el propio mantenedor decidir si firma.',
      ),
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
