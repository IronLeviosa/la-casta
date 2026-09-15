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
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';
import {
  agentesDeCorridaEnSesiones,
  corridaCoincide,
  lanzamientos,
  modeloDeUltimoAgenteEnSesiones,
  usoDeTranscripto,
} from '../scripts/agentes.ts';

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

/** Línea `assistant` con `message.model` y `message.usage`, como las que arma `usoDeTranscripto`. */
function lineaAsistente(id: string, modelo: string, salida: number): string {
  return JSON.stringify({
    type: 'assistant',
    message: { role: 'assistant', id, model: modelo, usage: { input_tokens: 10, output_tokens: salida, cache_creation_input_tokens: 0, cache_read_input_tokens: 0 } },
  });
}

/**
 * Arma, como hace la app de escritorio, `<sesión>.jsonl` junto a la carpeta `<sesión>/subagents/`
 * con el transcripto estable de un subagente (primera línea = prompt del usuario, que es donde
 * `textoInicial` busca `Corrida: <id>`) y, si se pide, su `agent-<id>.meta.json`.
 */
function escribirTranscriptoEstable(
  dirSesion: string,
  agentId: string,
  opciones: { prompt: string; lineasAsistente: string[]; meta?: { agentType?: string; description?: string } },
): string {
  const dirSubagentes = path.join(dirSesion, 'subagents');
  mkdirSync(dirSubagentes, { recursive: true });
  const archivo = path.join(dirSubagentes, `agent-${agentId}.jsonl`);
  const prompt = JSON.stringify({ type: 'user', message: { role: 'user', content: opciones.prompt } });
  writeFileSync(archivo, [prompt, ...opciones.lineasAsistente].join('\n') + '\n', 'utf8');
  if (opciones.meta) {
    writeFileSync(
      path.join(dirSubagentes, `agent-${agentId}.meta.json`),
      JSON.stringify({ toolUseId: 'toolu_x', spawnDepth: 1, ...opciones.meta }),
      'utf8',
    );
  }
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

describe('lanzamientos: transcripto estable de la app de escritorio (defecto 1 del piloto 2026-09-15)', () => {
  const CORRIDA = '2026-09-15-prueba-tema';

  /** Arma `<base>/s.jsonl` (sesión) + `<base>/s/subagents/` (transcriptos estables), tal como los
   * deja la app de escritorio: la carpeta de subagentes va junto al archivo de sesión, con el mismo
   * nombre que este sin la extensión `.jsonl`. */
  function armarSesionDeEscritorio() {
    const base = dirTemp();
    const archivoSesion = path.join(base, 's.jsonl');
    const carpetaSesion = path.join(base, 's');
    const outputFileInexistente = path.join(base, 'no-existe', 'tasks', 'a1.output');

    // El agente "investigador" quedó registrado en la sesión (tool_use + tool_result con agentId y
    // un output_file que ya no existe); su transcripto real vive en el lugar estable.
    const archivoEstableInvestigador = escribirTranscriptoEstable(carpetaSesion, 'a1', {
      prompt: `Corrida: ${CORRIDA}\n\nInvestigá tal cosa.`,
      lineasAsistente: [lineaAsistente('msg_1', 'claude-sonnet-5', 20)],
      meta: { agentType: 'investigador', description: 'Investigar algo' },
    });
    // Se escribe directo en `s.jsonl` (no con `escribirSesion`, que siempre usa `sesion.jsonl`):
    // tiene que llamarse igual que la carpeta `s/subagents/` para que `carpetaDeSesion` la encuentre.
    writeFileSync(
      archivoSesion,
      lineaLanzamiento('toolu_1', 'a1', outputFileInexistente, { descripcion: 'Investigar algo', tipo: 'investigador' }) + '\n',
      'utf8',
    );

    // El "editor" corrió en la misma sesión pero su lanzamiento nunca llegó a escribirse ahí (sesión
    // cortada): solo queda su transcripto y su meta.json, huérfanos en subagents/.
    const archivoEditor = escribirTranscriptoEstable(carpetaSesion, 'b2', {
      prompt: `Corrida: ${CORRIDA}\n\nEditá el lote.`,
      lineasAsistente: [lineaAsistente('msg_2', 'claude-opus-5', 15)],
      meta: { agentType: 'editor', description: 'Editar lote' },
    });

    return { archivoSesion, outputFileInexistente, archivoEstableInvestigador, archivoEditor };
  }

  it('resuelve el transcripto del agentId en subagents/, no en el output_file (temporal e inexistente)', () => {
    const { archivoSesion, outputFileInexistente, archivoEstableInvestigador } = armarSesionDeEscritorio();
    const mapa = lanzamientos(archivoSesion);
    expect(mapa.has('a1')).toBe(true);
    const investigador = mapa.get('a1')!;
    expect(investigador.tipo).toBe('investigador');
    expect(investigador.archivo).toBe(archivoEstableInvestigador);
    expect(investigador.archivo).not.toBe(outputFileInexistente);
  });

  it('modeloDeUltimoAgenteEnSesiones lee el modelo real del transcripto estable', () => {
    const { archivoSesion } = armarSesionDeEscritorio();
    expect(modeloDeUltimoAgenteEnSesiones([archivoSesion], 'investigador', CORRIDA)).toBe('claude-sonnet-5');
  });

  it('agrega, por enumeración de subagents/, el transcripto huérfano que ningún tool_result referenció', () => {
    const { archivoSesion, archivoEditor } = armarSesionDeEscritorio();
    const mapa = lanzamientos(archivoSesion);
    expect(mapa.has('b2')).toBe(true);
    const editor = mapa.get('b2')!;
    expect(editor.tipo).toBe('editor');
    expect(editor.descripcion).toBe('Editar lote');
    expect(editor.archivo).toBe(archivoEditor);
    // nada se cuenta dos veces: un agente registrado por tool_result no vuelve a aparecer por la
    // enumeración de la carpeta.
    expect(mapa.size).toBe(2);
  });

  it('agentesDeCorridaEnSesiones devuelve el mapa tipo → modelo de la corrida, mezclando ambos caminos', () => {
    const { archivoSesion } = armarSesionDeEscritorio();
    const agentes = agentesDeCorridaEnSesiones([archivoSesion], CORRIDA);
    expect(agentes.get('investigador')).toEqual({ modelo: 'claude-sonnet-5', descripcion: 'Investigar algo' });
    expect(agentes.get('editor')).toEqual({ modelo: 'claude-opus-5', descripcion: 'Editar lote' });
  });

  it('agentesDeCorridaEnSesiones no encuentra nada para una corrida que no aparece', () => {
    const { archivoSesion } = armarSesionDeEscritorio();
    expect(agentesDeCorridaEnSesiones([archivoSesion], 'no-existe').size).toBe(0);
  });
});
