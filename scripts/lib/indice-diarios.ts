/**
 * `data/diarios-archive.json`: índice fecha → ítem de la colección `uruguay-diario-sesiones` de
 * archive.org (docs/fuentes-oficiales/parlamento.md §2.1). Lo escribe `pnpm sesion:indexar`
 * (scripts/corpus/sesion-indexar.ts); lo lee `pnpm sesion` (scripts/corpus/sesion.ts) para no
 * tener que pedir --tomo/--numero/--legislador a mano cuando el ítem ya está indexado. Tipos y
 * lectura/escritura viven acá, aparte de los dos scripts, para que ninguno importe del otro.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { RAIZ } from './rutas.ts';
import { ordenarClaves } from './canonico.ts';

export type CamaraArchive = 'CS' | 'CR' | 'AG' | 'CP';

export interface ItemArchive {
  camara: CamaraArchive;
  /** Solo CS, AG y CP: CR no lleva tomo en su identificador. */
  tomo?: number;
  numero: number;
  /** Solo algunos CP (`_CP_<tomo>_<numero>_<sufijo>`). */
  sufijo?: number;
}

export interface ItemIndice extends ItemArchive {
  /** Todas las fechas que nombra la cabecera (una sesión de dos días son dos fechas). */
  fechas: string[];
  /** Primeros ~120 caracteres de la cabecera recortada, espacios colapsados. Ausente si nunca se leyó el OCR. */
  cabecera?: string;
  /** `fechado`: al menos una fecha. `sin_fecha`: OCR leído, ninguna fecha reconocida. `sin_ocr`: no se pudo leer el OCR. */
  estado: 'fechado' | 'sin_fecha' | 'sin_ocr';
}

export interface IndiceDiarios {
  version: 1;
  coleccion: string;
  generado: string;
  script: string;
  items: Record<string, ItemIndice>;
  /** Ítems `fechado` por cámara y año (el primer año de `fechas`). Dónde quedan huecos, sin abrir el archivo. */
  resumen: Record<string, Record<string, number>>;
}

export const RUTA_INDICE = join(RAIZ, 'data', 'diarios-archive.json');
export const URL_COLECCION = 'https://archive.org/details/uruguay-diario-sesiones';

export function leerIndice(ruta: string = RUTA_INDICE): IndiceDiarios | null {
  if (!existsSync(ruta)) return null;
  const texto = readFileSync(ruta, 'utf8').trim();
  if (!texto) return null;
  return JSON.parse(texto) as IndiceDiarios;
}

/** Ítems `fechado` por cámara y año. Pura: no toca disco ni red. */
export function calcularResumen(items: Record<string, ItemIndice>): Record<string, Record<string, number>> {
  const resumen: Record<string, Record<string, number>> = {};
  for (const item of Object.values(items)) {
    if (item.estado !== 'fechado' || item.fechas.length === 0) continue;
    const anio = item.fechas[0].slice(0, 4);
    const porCamara = resumen[item.camara] ?? (resumen[item.camara] = {});
    porCamara[anio] = (porCamara[anio] ?? 0) + 1;
  }
  return resumen;
}

/** Arma el índice completo (con `resumen` recalculado) y lo escribe, claves ordenadas para diff estable. */
export function escribirIndice(items: Record<string, ItemIndice>, ruta: string = RUTA_INDICE): IndiceDiarios {
  const indice: IndiceDiarios = {
    version: 1,
    coleccion: URL_COLECCION,
    generado: new Date().toISOString(),
    script: 'scripts/corpus/sesion-indexar.ts',
    items,
    resumen: calcularResumen(items),
  };
  mkdirSync(dirname(ruta), { recursive: true });
  writeFileSync(ruta, JSON.stringify(ordenarClaves(indice), null, 2) + '\n', 'utf8');
  return indice;
}
