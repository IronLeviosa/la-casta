/**
 * pnpm consulta:web "<consulta>" --consultas <ruta> [--resultados n]
 *
 * No busca nada: registra, en `consultas.jsonl`, una búsqueda web que el agente acaba de hacer con
 * `WebSearch`, con la hora real y la cantidad de resultados que devolvió. Es el equivalente, para la
 * web, de `pnpm corpus:buscar --consultas` (que escribe la línea de las búsquedas en el corpus): la
 * línea la escribe la herramienta, no el agente, porque una línea escrita a mano lleva una hora
 * aproximada y no prueba que la búsqueda se corrió (corrida de El Observador, 2026-10-29).
 *
 * Se corre apenas termina cada `WebSearch`, una vez por búsqueda:
 *
 *   pnpm consulta:web "El Observador Grupo Cardoso propiedad 2008" --consultas inbox/…/consultas.jsonl --resultados 8
 *
 * La línea queda como `{"t": "<ISO>", "tipo": "busqueda", "q": "consulta:web \"<consulta>\"",
 * "resultado": "8 resultado(s)"}`. Sin `--resultados` el resultado dice «no informado»: la
 * herramienta no inventa un número. La `q` lleva el nombre del comando, como la de `corpus:buscar`,
 * así una búsqueda web se distingue de una del corpus al leer el archivo.
 */
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { agregarLineaDeConsulta, lineaDeConsulta, resultadoDeBusqueda } from './lib/consultas.ts';
import { log, parsearArgs } from './lib/log.ts';

/** `q` de la línea: el comando tal como se corrió, con la consulta entre comillas. */
export function describirConsultaWeb(consulta: string): string {
  return `consulta:web ${JSON.stringify(consulta)}`;
}

/**
 * Línea JSONL de una búsqueda web. `resultados` es la cantidad que devolvió el buscador; si no se
 * informa, el campo `resultado` dice «no informado».
 */
export function lineaConsultaWeb(consulta: string, resultados?: number, momento: Date = new Date()): string {
  const texto = consulta.trim();
  if (!texto) throw new Error('Falta la consulta: pnpm consulta:web "<consulta>" --consultas <ruta> [--resultados n].');
  if (resultados !== undefined && (!Number.isInteger(resultados) || resultados < 0)) {
    throw new Error(`--resultados tiene que ser un entero mayor o igual a 0 (vino ${resultados}).`);
  }
  return lineaDeConsulta('busqueda', describirConsultaWeb(texto), resultados === undefined ? 'no informado' : resultadoDeBusqueda(resultados), momento);
}

/** Agrega la línea al final de `rutaConsultas` y la devuelve. */
export function registrarConsultaWeb(rutaConsultas: string, consulta: string, resultados?: number, momento: Date = new Date()): string {
  const linea = lineaConsultaWeb(consulta, resultados, momento);
  agregarLineaDeConsulta(rutaConsultas, linea);
  return linea;
}

const USO = 'Uso: pnpm consulta:web "<consulta>" --consultas <ruta/consultas.jsonl> [--resultados n]\n';

function main(): void {
  const { posicionales, opciones } = parsearArgs(process.argv.slice(2));
  const consulta = posicionales.join(' ');
  const ruta = typeof opciones.consultas === 'string' ? opciones.consultas : '';
  if (!consulta.trim() || !ruta) {
    process.stderr.write(USO);
    process.exit(2);
  }
  let resultados: number | undefined;
  if (opciones.resultados !== undefined) {
    if (typeof opciones.resultados !== 'string' || !/^\d+$/.test(opciones.resultados.trim())) {
      log.error(`--resultados tiene que ser un entero mayor o igual a 0 (vino ${JSON.stringify(opciones.resultados)}).`);
      process.exit(2);
    }
    resultados = Number(opciones.resultados);
  }
  try {
    const linea = registrarConsultaWeb(ruta, consulta, resultados);
    process.stdout.write(`registrado en ${ruta}: ${linea}\n`);
  } catch (e) {
    log.error((e as Error).message);
    process.exit(2);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
