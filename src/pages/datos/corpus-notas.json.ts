/**
 * /datos/corpus-notas.json: una fila compacta por fuente leída (tipo, medio, empresa, largo, día,
 * etiquetas), sin URL ni texto. La genera `pnpm corpus:estadisticas` en `data/`; acá se sirve para
 * que los filtros de «Datos procesados» funcionen también en el servidor de desarrollo, no solo
 * en el sitio construido (donde `pnpm exportar` copia el mismo archivo).
 */
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

export function GET() {
  const archivo = path.join(process.cwd(), 'data', 'corpus-notas.json');
  const cuerpo = existsSync(archivo) ? readFileSync(archivo, 'utf8') : JSON.stringify({ generado: null, campos: {}, notas: [] });
  return new Response(cuerpo, { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
