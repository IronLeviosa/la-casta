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
  /** 'ocr' cuando el texto salio de Tesseract porque el PDF era un escaneo sin capa de texto. */
  extraccion?: 'ocr';
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

export type TipoTrabajo = 'transcribir' | 'verificar_fuentes' | 'detective' | 'etiquetar' | 'reetiquetar' | 'sync';
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
