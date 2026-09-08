/**
 * Planillas, CSV y respuestas JSON leídos como texto, para que `pnpm fuente` los guarde en el
 * corpus y `pnpm validar --red` pueda cotejar una cita contra ellos como contra cualquier nota.
 *
 * Existe porque el chequeo de Brasil citaba la planilla de URSEA, los CSV de ANCAP y la API del
 * Banco Central do Brasil, y todos quedaron en `verificacion: manual`: los agentes bajaban el
 * dato pero la verificación mecánica no tenía texto contra el cual buscar la cita. Con esto, una
 * fila de la planilla (tal como la imprime `pnpm fuente`, columnas separadas por tabulador) es
 * una cita verificable, y la firma humana queda para lo que de verdad no se puede leer.
 */
import * as XLSX from 'xlsx';
import { unzipSync } from 'fflate';

/** Tope de texto extraído: una planilla de series mensuales cabe holgada; un dump de una API, no. */
const MAX_CHARS = 4_000_000;

export function esHojaDeCalculo(contentType: string, url: string, buffer: Buffer): boolean {
  if (/spreadsheetml|application\/vnd\.ms-excel|application\/vnd\.oasis\.opendocument\.spreadsheet/i.test(contentType)) return true;
  const zip = buffer.subarray(0, 2).toString('latin1') === 'PK';
  const ole = buffer.subarray(0, 4).toString('hex') === 'd0cf11e0';
  return /\.(xlsx|xlsm|xls|ods)(\?|#|$)/i.test(url) && (zip || ole || /\.ods(\?|#|$)/i.test(url));
}

export function esCsv(contentType: string, url: string): boolean {
  return /text\/csv|text\/tab-separated-values/i.test(contentType) || /\.(csv|tsv)(\?|#|$)/i.test(url);
}

export function esJson(contentType: string, url: string, buffer: Buffer): boolean {
  if (/application\/(ld\+)?json/i.test(contentType)) return true;
  if (/\.json(\?|#|$)/i.test(url)) return true;
  if (/html/i.test(contentType)) return false;
  const inicio = buffer.subarray(0, 64).toString('utf8').trimStart();
  return (inicio.startsWith('{') || inicio.startsWith('[')) && !/text\/plain/i.test(contentType);
}

/** Cada hoja con su nombre y sus filas separadas por tabulador; las celdas vacías quedan vacías. */
export function textoDeHojaDeCalculo(buffer: Buffer): { texto: string; hojas: string[] } {
  const libro = XLSX.read(buffer, { type: 'buffer', cellDates: true, cellNF: false, cellText: false });
  const partes: string[] = [];
  for (const nombre of libro.SheetNames) {
    const hoja = libro.Sheets[nombre];
    if (!hoja) continue;
    const csv = XLSX.utils.sheet_to_csv(hoja, { FS: '\t', RS: '\n', blankrows: false, dateNF: 'yyyy-mm-dd' });
    partes.push(`## hoja: ${nombre}\n${csv.trim()}`);
  }
  return { texto: recortar(partes.join('\n\n')), hojas: libro.SheetNames };
}

/** CSV tal cual (UTF-8, o latin1 si el UTF-8 trae caracteres de reemplazo). */
export function textoDeCsv(buffer: Buffer): string {
  const utf8 = buffer.toString('utf8');
  const texto = utf8.includes('�') ? buffer.toString('latin1') : utf8;
  return recortar(texto.replace(/^﻿/, ''));
}

/** JSON con un espacio de sangría: cada valor en su renglón, legible y citable. */
export function textoDeJson(buffer: Buffer): string {
  const crudo = buffer.toString('utf8').replace(/^﻿/, '');
  try {
    return recortar(JSON.stringify(JSON.parse(crudo), null, 1));
  } catch {
    return recortar(crudo);
  }
}

/** Un zip de datos (el MIEM publica sus series así): se lee lo que trae adentro. Un xlsx también es un zip; se pregunta antes por la planilla. */
export function esZip(contentType: string, url: string, buffer: Buffer): boolean {
  const firma = buffer.subarray(0, 2).toString('latin1') === 'PK';
  return firma && (/application\/(zip|x-zip-compressed)/i.test(contentType) || /\.zip(\?|#|$)/i.test(url));
}

/** Cada archivo del zip con su nombre: csv y txt tal cual, planillas por hoja, JSON legible; el resto solo se lista. */
export function textoDeZip(buffer: Buffer): { texto: string; archivos: string[] } {
  const entradas = unzipSync(new Uint8Array(buffer));
  const partes: string[] = [];
  const archivos: string[] = [];
  for (const [nombre, datos] of Object.entries(entradas)) {
    if (nombre.endsWith('/')) continue;
    archivos.push(nombre);
    const b = Buffer.from(datos);
    if (/\.(csv|tsv|txt)$/i.test(nombre)) partes.push(`## archivo: ${nombre}\n${textoDeCsv(b)}`);
    else if (/\.(xlsx|xlsm|xls|ods)$/i.test(nombre)) partes.push(`## archivo: ${nombre}\n${textoDeHojaDeCalculo(b).texto}`);
    else if (/\.json$/i.test(nombre)) partes.push(`## archivo: ${nombre}\n${textoDeJson(b)}`);
    else partes.push(`## archivo: ${nombre} (${b.length} bytes, no se extrae)`);
  }
  return { texto: recortar(partes.join('\n\n')), archivos };
}

function recortar(texto: string): string {
  return texto.length > MAX_CHARS ? `${texto.slice(0, MAX_CHARS)}\n[... recortado a ${MAX_CHARS} caracteres]` : texto;
}
