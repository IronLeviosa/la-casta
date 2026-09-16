/** Tipos compartidos del corpus privado. */

export type OrigenEtiqueta = 'alias' | 'haiku' | 'manual';

export interface Mencion {
  politico: string;
  /** Posicion (indice de caracter) en `texto`. */
  posicion: number;
}

export interface Etiquetas {
  politicos: string[];
  partidos: string[];
  temas: string[];
  eventos: string[];
  /** Menciones con posicion en el texto (alimenta la tabla `menciones` del indice). */
  menciones: Mencion[];
  /** slug -> quien puso la etiqueta. */
  origen: Record<string, OrigenEtiqueta>;
  fechas_mencionadas?: string[];
}

export type TipoNota = 'html' | 'pdf' | 'video' | 'texto';

/** Qué tan central es un político confirmado en una nota (catálogo, docs/plan-catalogo.md). */
export type Relevancia = 'central' | 'secundaria' | 'mencion';

export interface LeyMencionada {
  numero: string;
  tipo: 'ley' | 'decreto';
  nombre?: string;
}

export type TipoAfirmacion = 'dato' | 'promesa' | 'posicion' | 'mencion_a';

export interface Afirmacion {
  politico: string;
  /** Copia literal y contigua del cuerpo de la nota (ya verificada contra `nota.texto`). */
  cita: string;
  /** Índice de caracter donde arranca `cita` en `nota.texto`: lo que pide la tabla `afirmaciones`. */
  posicion: number;
  atribucion: 'directa' | 'indirecta';
  tipo: TipoAfirmacion;
  tema: string;
  dato: { que: string; valor: string; periodo?: string | null } | null;
  fecha_dicho: string | null;
}

/**
 * Lo que dejan las dos pasadas del catálogo (docs/plan-catalogo.md, etapa B) en la nota del
 * corpus. `version` es el sha256 del archivo de rol del etiquetador más el esquema de esta
 * respuesta: una nota solo se vuelve a catalogar (pasada 1) si esa versión cambió o con `--todas`.
 */
export interface Catalogo {
  version: string;
  modelo: string;
  fecha: string;
  /** slug de político -> relevancia que le asignó el etiquetador en esta nota. */
  relevancia: Record<string, Relevancia>;
  tiene_afirmaciones: boolean;
  /** Fecha que el propio texto declara para sí, cuando la nota llega sin fecha o con una que la contradice. */
  fecha_texto?: string | null;
  fechas_mencionadas?: string[];
  empresas?: string[];
  leyes?: LeyMencionada[];
  /** Solo si pasó la pasada 2 (extractor): relevancia central/secundaria y `tiene_afirmaciones`. */
  afirmaciones?: Afirmacion[];
  /** Cuántas afirmaciones devolvió el extractor con una cita que no apareció literal en el texto. */
  descartadas?: number;
}

export interface Nota {
  id: string;
  url: string;
  url_canonica: string;
  medio: string;
  fecha: string | null;
  titulo: string | null;
  autor: string | null;
  tipo: TipoNota;
  texto: string;
  retrieved_at: string;
  archived_url: string | null;
  text_sha256: string;
  etiquetas: Etiquetas;
  resumen: string | null;
  /** Solo para video: id de la transcripcion en `transcripciones/`. */
  transcripcion?: string;
  /** Marcado por el cron semanal si la URL desaparecio. */
  borrada?: string;
  http_estado?: number;
  /**
   * Rastro de que el texto no salio del camino normal (Readability sobre un solo contenedor, o
   * pdf-parse con capa de texto):
   *   - 'ocr': el PDF era un escaneo sin capa de texto, el texto salio de Tesseract.
   *   - 'dom-multi-bloque': el HTML partia el cuerpo en varios <article class="article-body...">
   *     hermanos y Readability se quedaba con uno solo; se concatenaron todos en orden.
   *   - 'json-ld': ni el DOM ni el multi-bloque alcanzaban; el texto salio del `articleBody` de un
   *     bloque JSON-LD (NewsArticle/Article) porque era mas largo que lo extraido del DOM.
   */
  extraccion?: 'ocr' | 'dom-multi-bloque' | 'json-ld';
  /** Catálogo (docs/plan-catalogo.md): relevancia por político, afirmaciones extraídas, etc. */
  catalogo?: Catalogo;
}

export interface Segmento {
  inicio: number;
  fin: number;
  texto: string;
}

export interface Transcripcion {
  id: string;
  url: string | null;
  url_canonica: string | null;
  archivo: string | null;
  titulo: string | null;
  canal: string | null;
  fecha: string | null;
  duracion: number;
  backend: string;
  modelo: string;
  idioma: string;
  transcrito_en: string;
  segundos_proceso?: number;
  segmentos: Segmento[];
  texto: string;
}

export type TipoTrabajo =
  | 'transcribir'
  | 'verificar_fuentes'
  | 'detective'
  | 'etiquetar'
  | 'reetiquetar'
  | 'sync'
  | 'precargar_diarios'
  | 'precargar_presidencia'
  | 'precargar_inventario'
  | 'catalogar';
export type EstadoTrabajo = 'pendiente' | 'en_curso' | 'hecho' | 'error';

export interface Trabajo {
  id: string;
  tipo: TipoTrabajo;
  params: Record<string, unknown>;
  estado: EstadoTrabajo;
  creado_por: string;
  creado: string;
  tomado_por?: string;
  tomado?: string;
  terminado?: string;
  resultado?: unknown;
  error?: string;
}

export function etiquetasVacias(): Etiquetas {
  return { politicos: [], partidos: [], temas: [], eventos: [], menciones: [], origen: {} };
}
