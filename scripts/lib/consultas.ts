/**
 * Líneas de `consultas.jsonl`, el rastro de lo que un agente buscó y leyó en una corrida
 * (`.claude/agents/investigador.md`, «Consultas»). La escribe la herramienta, no el agente: una
 * línea escrita a mano no prueba que la búsqueda se corrió, ni cuándo, ni qué devolvió, y la hora
 * quedaba aproximada (en la corrida de El Observador, 2026-10-29, las búsquedas web se anotaron a
 * mano con la hora «más o menos»). Lo comparten `pnpm corpus:buscar --consultas` y
 * `pnpm consulta:web`.
 */
import { appendFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

export type TipoConsulta = 'busqueda' | 'fuente';

/** Una línea JSON, sin salto de línea final: `{t, tipo, q, resultado}` con la hora real en ISO. */
export function lineaDeConsulta(tipo: TipoConsulta, q: string, resultado: string, momento: Date = new Date()): string {
  return JSON.stringify({ t: momento.toISOString(), tipo, q, resultado });
}

/** Agrega la línea al final de `ruta` (crea la carpeta si falta); nunca reescribe lo que ya había. */
export function agregarLineaDeConsulta(ruta: string, linea: string): void {
  mkdirSync(dirname(ruta), { recursive: true });
  appendFileSync(ruta, linea + '\n', 'utf8');
}

/** `resultado` de una búsqueda: «N resultado(s)» o «sin resultados» (igual que la salida por pantalla de `corpus:buscar`). */
export function resultadoDeBusqueda(cantidad: number): string {
  return cantidad === 0 ? 'sin resultados' : `${cantidad} resultado(s)`;
}
