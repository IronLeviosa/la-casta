/**
 * `scripts/agentes.ts`: dedupe de turnos por `message.id`, contexto pico, filtro `--corrida` y
 * `--modelo-de` (docs/plan-2026-09.md, fase 1, ítem 1.8).
 *
 * Los fixtures de `tests/fixtures/agentes/` son transcriptos de subagente en miniatura: Claude Code
 * escribe una línea por bloque de contenido del mismo mensaje (todas comparten `message.id`), así
 * que `subagente-corrida-x.jsonl` tiene un mensaje repartido en dos líneas para probar que el
 * dedupe no lo cuenta dos veces. Las sesiones (el "chat" que lanza al subagente) se arman en un
 * directorio temporal por test, con la ruta real del fixture como `output_file`, igual que hace
 * Claude Code de verdad.
 */
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';
import { corridaCoincide, lanzamientos, modeloDeUltimoAgenteEnSesiones, usoDeTranscripto } from '../scripts/agentes.ts';

const DIR_TESTS = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = path.join(DIR_TESTS, 'fixtures', 'agentes');
const SUBAGENTE_X = path.join(FIXTURES, 'subagente-corrida-x.jsonl');
const SUBAGENTE_X2 = path.join(FIXTURES, 'subagente-corrida-x-segundo.jsonl');
const SUBAGENTE_Y = path.join(FIXTURES, 'subagente-corrida-y.jsonl');

const temporales: string[] = [];
function dirTemp(): string {
  const d = mkdtempSync(path.join(tmpdir(), 'la-casta-agentes-'));
  temporales.push(d);
  return d;
}
afterEach(() => {
  for (const d of temporales.splice(0)) rmSync(d, { recursive: true, force: true });
});

/** Línea de sesión que lanza un Agent y la de su tool_result (agentId + output_file), igual a como
 * Claude Code registra un subagente lanzado desde el chat. */
function lineaLanzamiento(toolUseId: string, agentId: string, archivo: string, opciones: { descripcion?: string; tipo?: string } = {}): string {
  const lanzamiento = JSON.stringify({
    type: 'assistant',
    message: {
      role: 'assistant',
      content: [
        {
          type: 'tool_use',
          id: toolUseId,
          name: 'Agent',
          input: { description: opciones.descripcion ?? '(sin descripción)', subagent_type: opciones.tipo ?? 'investigador' },
        },
      ],
    },
  });
  const resultado = JSON.stringify({
    type: 'user',
    message: {
      role: 'user',
      content: [{ type: 'tool_result', tool_use_id: toolUseId, content: `agentId: ${agentId}\noutput_file: ${archivo}` }],
    },
  });
  return `${lanzamiento}\n${resultado}`;
}

function escribirSesion(lineas: string[]): string {
  const archivo = path.join(dirTemp(), 'sesion.jsonl');
  writeFileSync(archivo, lineas.join('\n') + '\n', 'utf8');
  return archivo;
}

describe('usoDeTranscripto: turnos deduplicados por message.id', () => {
  it('cuenta un turno por mensaje, no por línea (msg_fixture_1 tiene dos líneas)', () => {
    const r = usoDeTranscripto(SUBAGENTE_X);
    expect(r.turnos).toBe(2);
  });

  it('usa los números finales de cada mensaje, no la suma de sus líneas', () => {
    const r = usoDeTranscripto(SUBAGENTE_X);
    // salida: 30 (línea final de msg_fixture_1, no 10+30) + 20 (msg_fixture_2) = 50
    expect(r.uso.salida).toBe(50);
    // entrada y caché: una sola vez por mensaje, no una vez por línea
    expect(r.uso.entrada).toBe(105); // 100 + 5
    expect(r.uso.cacheLeido).toBe(1200); // 200 + 1000
    expect(r.uso.cacheEscrito).toBe(50); // 50 + 0
  });

  it('contexto pico es el máximo de entrada + caché leído + caché escrito de un solo mensaje', () => {
    const r = usoDeTranscripto(SUBAGENTE_X);
    // msg_fixture_1: 100+200+50=350; msg_fixture_2: 5+1000+0=1005
    expect(r.contextoPico).toBe(1005);
  });

  it('ultimoModelo es el de la última línea del asistente, no el del mensaje más caro', () => {
    const r = usoDeTranscripto(SUBAGENTE_X);
    expect(r.ultimoModelo).toBe('claude-haiku-fixture');
    expect([...r.modelos].sort()).toEqual(['claude-haiku-fixture', 'claude-sonnet-5']);
  });
});

describe('--corrida: descripción o primera línea del transcript del subagente', () => {
  it('encuentra el id de corrida en la primera línea del prompt aunque la descripción no lo mencione', () => {
    const sesion = escribirSesion([lineaLanzamiento('toolu_1', 'agente-fixture-1', SUBAGENTE_X, { descripcion: 'Investigar algo' })]);
    const [lanzamiento] = [...lanzamientos(sesion).values()];
    expect(lanzamiento!.descripcion).toBe('Investigar algo'); // no menciona "x"
    expect(corridaCoincide(lanzamiento!, 'x')).toBe(true);
    expect(corridaCoincide(lanzamiento!, 'y')).toBe(false);
  });

  it('descarta los agentes de otra corrida', () => {
    const sesion = escribirSesion([
      lineaLanzamiento('toolu_1', 'agente-fixture-1', SUBAGENTE_X),
      lineaLanzamiento('toolu_2', 'agente-fixture-y', SUBAGENTE_Y),
    ]);
    const coincidencias = [...lanzamientos(sesion).values()].filter((l) => corridaCoincide(l, 'x'));
    expect(coincidencias).toHaveLength(1);
    expect(coincidencias[0]!.archivo).toBe(SUBAGENTE_X);
  });

  it('también coincide por la descripción cuando esta sí menciona el id', () => {
    const sesion = escribirSesion([lineaLanzamiento('toolu_1', 'agente-fixture-1', SUBAGENTE_Y, { descripcion: 'Corrida x: revisión final' })]);
    const [lanzamiento] = [...lanzamientos(sesion).values()];
    expect(corridaCoincide(lanzamiento!, 'x')).toBe(true);
  });
});

describe('modeloDeUltimoAgenteEnSesiones: modelo real del último agente de un tipo en una corrida', () => {
  it('devuelve el modelo del último agente lanzado de ese tipo, no el del primero', () => {
    const sesion = escribirSesion([
      lineaLanzamiento('toolu_1', 'agente-fixture-1', SUBAGENTE_X, { tipo: 'investigador' }),
      lineaLanzamiento('toolu_2', 'agente-fixture-1b', SUBAGENTE_X2, { tipo: 'investigador' }),
    ]);
    // El primer agente (SUBAGENTE_X) termina en claude-haiku-fixture; el corrector, lanzado
    // después, corre entero en claude-sonnet-5: ese es el que tiene que devolver.
    expect(modeloDeUltimoAgenteEnSesiones([sesion], 'investigador', 'x')).toBe('claude-sonnet-5');
  });

  it('null si ningún agente de ese tipo corrió en esa corrida', () => {
    const sesion = escribirSesion([lineaLanzamiento('toolu_1', 'agente-fixture-1', SUBAGENTE_X, { tipo: 'investigador' })]);
    expect(modeloDeUltimoAgenteEnSesiones([sesion], 'editor', 'x')).toBeNull();
    expect(modeloDeUltimoAgenteEnSesiones([sesion], 'investigador', 'no-existe')).toBeNull();
  });

  it('busca en varias sesiones y se queda con la primera (más reciente) que tenga una coincidencia', () => {
    const sesionVieja = escribirSesion([lineaLanzamiento('toolu_1', 'agente-fixture-y', SUBAGENTE_Y, { tipo: 'investigador' })]);
    const sesionNueva = escribirSesion([lineaLanzamiento('toolu_1', 'agente-fixture-1', SUBAGENTE_X, { tipo: 'investigador' })]);
    // El llamador pasa las sesiones ya ordenadas de más nueva a más vieja.
    expect(modeloDeUltimoAgenteEnSesiones([sesionNueva, sesionVieja], 'investigador', 'x')).toBe('claude-haiku-fixture');
    expect(modeloDeUltimoAgenteEnSesiones([sesionNueva, sesionVieja], 'investigador', 'y')).toBe('claude-sonnet-5');
  });
});
