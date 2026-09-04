/**
 * Qué corridas de investigación se hicieron, leído de `data/corridas/`.
 *
 * Existe para distinguir dos cosas que se ven iguales y no lo son: una sección vacía porque
 * todavía nadie investigó eso, y una sección vacía porque se investigó y no hay nada que
 * registrar. Un mandato sin vetos y un mandato sin investigar se muestran igual si el sitio no
 * sabe cuál es cuál, y esa confusión se lee como cobertura desigual.
 *
 * La fuente es el nombre de la carpeta de cada corrida, que ya es pública y commiteada:
 * `<YYYY-MM-DD>-<politico>-<resto>`. El slug del político tiene guiones, así que el corte se
 * resuelve contra la lista de políticos conocidos y no por posición.
 *
 * **Solo cuentan las corridas que se ejecutaron.** Una carpeta con `brief.md` y nada más es una
 * corrida planificada, no hecha: el brief se escribe antes de lanzar al agente. Lo que marca que
 * la corrida llegó hasta el final es `agentes.json`, que escribe `pnpm promover`. Contar los
 * briefs como investigación haría que el sitio afirme "se investigó y no hay nada" sobre algo que
 * nadie miró todavía, que es peor que no decir nada.
 */
import fs from 'node:fs';
import path from 'node:path';

export interface Corrida {
  id: string;
  fecha: string;
  politico: string;
  /** Lo que sigue al político: un tema con `/` reemplazado por `-`, o `vetos`, o `patrimonio`. */
  objeto: string;
}

const RE_CORRIDA = /^(\d{4}-\d{2}-\d{2})-(.+)$/;

export function leerCorridas(politicos: string[], raiz = process.cwd()): Corrida[] {
  const dir = path.join(raiz, 'data', 'corridas');
  if (!fs.existsSync(dir)) return [];
  // Del slug más largo al más corto: "lacalle-pou" tiene que ganarle a un hipotético "lacalle".
  const slugs = [...politicos].sort((a, b) => b.length - a.length);
  const corridas: Corrida[] = [];
  for (const nombre of fs.readdirSync(dir)) {
    if (!fs.statSync(path.join(dir, nombre)).isDirectory()) continue;
    const m = RE_CORRIDA.exec(nombre);
    if (!m) continue;
    const [, fecha, resto] = m;
    if (!fs.existsSync(path.join(dir, nombre, 'agentes.json'))) continue;
    const politico = slugs.find((s) => resto === s || resto.startsWith(`${s}-`));
    if (!politico) continue;
    corridas.push({ id: nombre, fecha, politico, objeto: resto.slice(politico.length + 1) });
  }
  return corridas;
}

/**
 * ¿Se investigó `objeto` para `politico`? Devuelve la fecha de la corrida más reciente, o null.
 * `objeto` se compara por prefijo: la corrida `economia-impuestos` cubre `economia`.
 */
export function fechaInvestigacion(corridas: Corrida[], politico: string, objeto: string): string | null {
  const fechas = corridas
    .filter((c) => c.politico === politico && (c.objeto === objeto || c.objeto.startsWith(`${objeto}-`)))
    .map((c) => c.fecha)
    .sort();
  return fechas.length ? fechas[fechas.length - 1] : null;
}
