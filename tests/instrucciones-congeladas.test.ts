/**
 * `data/corridas/<id>/instrucciones.json` (defecto 2 del piloto de Astori, 2026-09-16): `pnpm
 * brief` congela ahí los hashes de instrucciones que el agente va a leer, antes de lanzarlo. Sin
 * esto, `agentes.json` —que escribe `pnpm promover` recién al final— registraba las instrucciones
 * vigentes al momento de promover, no las que el agente realmente leyó: si una regla cambiaba
 * mientras la corrida seguía abierta, la procedencia quedaba describiendo reglas que nadie leyó.
 *
 * Cuatro cosas se prueban acá:
 *   (a) escribirInstruccionesCongeladas() escribe el archivo con las mismas claves que agentes.json.
 *   (b) verificarArtefactos() sigue reportando soloBrief con brief.md + instrucciones.json.
 *   (c) armarAgentesJson() (y promover() de punta a punta) usan el hash congelado, no el de ahora,
 *       y listan archivos_cambiados_durante_la_corrida cuando un rol cambió después del brief.
 *   (d) sin instrucciones.json, el comportamiento no cambia: hashes de ahora, como siempre.
 */
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';
import { afterAll, describe, expect, it } from 'vitest';
import { armarAgentesJson, promover } from '../scripts/promover.ts';
import {
  commitActual,
  escribirInstruccionesCongeladas,
  hashDeArchivo,
  hashesDeInstrucciones,
  leerInstruccionesCongeladas,
  verificarArtefactos,
  type AgentesJson,
} from '../scripts/lib/corridas.ts';

const temporales: string[] = [];
afterAll(() => {
  for (const d of temporales.splice(0)) rmSync(d, { recursive: true, force: true });
});

function dirTemporal(prefijo: string): string {
  const dir = mkdtempSync(path.join(tmpdir(), prefijo));
  temporales.push(dir);
  return dir;
}

/** Raíz mínima (sin git) con CLAUDE.md, un rol y una regla de colección: lo que hashea archivosDeInstrucciones(). */
function prepararRaizConInstrucciones(): string {
  const raiz = dirTemporal('la-casta-instrucciones-');
  writeFileSync(path.join(raiz, 'CLAUDE.md'), '# Reglas v1\n', 'utf8');
  mkdirSync(path.join(raiz, '.claude', 'agents'), { recursive: true });
  writeFileSync(path.join(raiz, '.claude', 'agents', 'investigador.md'), '# rol v1\n', 'utf8');
  mkdirSync(path.join(raiz, 'docs', 'colecciones'), { recursive: true });
  writeFileSync(path.join(raiz, 'docs', 'colecciones', 'declaraciones.md'), '# colección v1\n', 'utf8');
  return raiz;
}

describe('escribirInstruccionesCongeladas()', () => {
  it('escribe instrucciones.json con las mismas claves que agentes.json y los hashes de ahora', () => {
    const raiz = prepararRaizConInstrucciones();
    const corridaDir = path.join(raiz, 'data', 'corridas', '2026-01-01-alguien-tema');

    const congeladas = escribirInstruccionesCongeladas(raiz, corridaDir);

    expect(Object.keys(congeladas).sort()).toEqual(['archivos', 'archivos_sin_commitear', 'commit', 'generado'].sort());
    expect(congeladas.commit).toBe(commitActual(raiz));
    expect(congeladas.archivos).toEqual(hashesDeInstrucciones(raiz));
    expect(congeladas.archivos['.claude/agents/investigador.md']).toBe(hashDeArchivo(path.join(raiz, '.claude', 'agents', 'investigador.md')));

    // Quedó escrito en disco, no solo devuelto.
    const releido = JSON.parse(readFileSync(path.join(corridaDir, 'instrucciones.json'), 'utf8'));
    expect(releido).toEqual(congeladas);
  });

  it('leerInstruccionesCongeladas() devuelve null si el archivo no existe', () => {
    const raiz = prepararRaizConInstrucciones();
    expect(leerInstruccionesCongeladas(path.join(raiz, 'data', 'corridas', 'no-existe'))).toBeNull();
  });
});

describe('verificarArtefactos(): instrucciones.json no cuenta para "la corrida corrió"', () => {
  it('brief.md + instrucciones.json sigue siendo soloBrief (corrida planificada, no ejecutada)', () => {
    const dir = dirTemporal('corrida-solo-brief-');
    writeFileSync(path.join(dir, 'brief.md'), '# brief\n', 'utf8');
    writeFileSync(path.join(dir, 'instrucciones.json'), '{}\n', 'utf8');

    const est = verificarArtefactos(dir);
    expect(est.soloBrief).toBe(true);
    expect(est.faltantes).toEqual([]);
  });
});

describe('armarAgentesJson()', () => {
  it('sin instrucciones.json (congeladas: null), el comportamiento es el de siempre: hashes de ahora, sin campos nuevos', () => {
    const raiz = prepararRaizConInstrucciones();
    const corridaDir = path.join(raiz, 'data', 'corridas', 'sin-congelar');
    mkdirSync(corridaDir, { recursive: true });
    const rutaRol = path.join(raiz, '.claude', 'agents', 'investigador.md');
    const shaAgente = new Map([['investigador', { archivo: '.claude/agents/investigador.md', sha256: hashDeArchivo(rutaRol) }]]);

    const { agentesJson, archivosCambiados } = armarAgentesJson(raiz, corridaDir, null, shaAgente, new Map([['investigador', 'modelo-x']]), new Map());

    expect(archivosCambiados).toEqual([]);
    expect(agentesJson.instrucciones_congeladas).toBeUndefined();
    expect(agentesJson.archivos_cambiados_durante_la_corrida).toBeUndefined();
    expect(agentesJson.commit).toBe(commitActual(raiz));
    expect(agentesJson.archivos).toEqual(hashesDeInstrucciones(raiz));
  });

  it('con instrucciones.json, usa los hashes congelados y lista lo que cambió después del brief', () => {
    const raiz = prepararRaizConInstrucciones();
    const corridaDir = path.join(raiz, 'data', 'corridas', 'con-congelar');
    mkdirSync(corridaDir, { recursive: true });
    const congeladas = escribirInstruccionesCongeladas(raiz, corridaDir);
    const rutaRol = path.join(raiz, '.claude', 'agents', 'investigador.md');

    // Alguien edita el rol mientras la corrida sigue abierta (lo que pasó de verdad con Astori).
    writeFileSync(rutaRol, '# rol v2, cambiado a mitad de la corrida\n', 'utf8');

    const shaAgente = new Map([['investigador', { archivo: '.claude/agents/investigador.md', sha256: congeladas.archivos['.claude/agents/investigador.md'] }]]);
    const { agentesJson, archivosCambiados } = armarAgentesJson(raiz, corridaDir, congeladas, shaAgente, new Map([['investigador', 'modelo-x']]), new Map());

    expect(archivosCambiados).toEqual(['.claude/agents/investigador.md']);
    expect(agentesJson.archivos_cambiados_durante_la_corrida).toEqual(['.claude/agents/investigador.md']);
    expect(agentesJson.instrucciones_congeladas).toBe(congeladas.generado);
    // El hash que queda en agentes.json es el congelado, no el de ahora.
    expect(agentesJson.archivos['.claude/agents/investigador.md']).toBe(congeladas.archivos['.claude/agents/investigador.md']);
    expect(agentesJson.archivos['.claude/agents/investigador.md']).not.toBe(hashDeArchivo(rutaRol));
    expect(agentesJson.agentes.investigador!.sha256).toBe(congeladas.archivos['.claude/agents/investigador.md']);
  });
});

// ---------------------------------------------------------------------------
// promover() de punta a punta: la procedencia de un registro promovido usa el rol congelado.
// ---------------------------------------------------------------------------

function declaracionDeEjemplo(): Record<string, unknown> {
  return {
    politico: 'lacalle-pou',
    tema: 'economia/impuestos',
    fecha: '2020-08-01',
    contexto: 'gobierno',
    cargo_en_ese_momento: 'Presidente de la República',
    cita: 'Cita de prueba con más de veinte caracteres para instrucciones congeladas.',
    resumen: 'Registro de prueba para instrucciones congeladas.',
    evidencia: {
      nivel: 'textual',
      fuentes: [
        {
          url: 'https://ejemplo.uy/instrucciones-congeladas',
          medio: 'el-pais',
          fecha: '2020-08-01',
          tipo: 'documento_oficial',
          titulo: 'Documento de prueba',
          cita: 'Cita de prueba con más de veinte caracteres para instrucciones congeladas.',
          retrieved_at: '2020-08-01',
        },
      ],
    },
    revision: { tier: 'publicado' },
    _investigacion: { agente: 'investigador', modelo: 'modelo-de-prueba' },
  };
}

describe('promover() usa el rol congelado en instrucciones.json cuando existe', () => {
  it('procedencia.agente_sha y agentes.json quedan con el hash congelado, no con el de ahora', () => {
    const corridaId = '2020-08-01-lacalle-pou-economia-impuestos';
    const raiz = prepararRaizConInstrucciones();
    const corridaDir = path.join(raiz, 'data', 'corridas', corridaId);
    mkdirSync(corridaDir, { recursive: true });
    writeFileSync(path.join(corridaDir, 'brief.md'), '# brief de prueba\n', 'utf8');
    // Congela ANTES de que el rol cambie: es la versión que el agente realmente leyó.
    const congeladas = escribirInstruccionesCongeladas(raiz, corridaDir);
    const hashRolCongelado = congeladas.archivos['.claude/agents/investigador.md'];
    const rutaRol = path.join(raiz, '.claude', 'agents', 'investigador.md');

    // Alguien edita el rol mientras la corrida sigue abierta.
    writeFileSync(rutaRol, '# rol v2, cambiado a mitad de la corrida\n', 'utf8');

    const inboxDir = path.join(raiz, 'inbox-src');
    mkdirSync(inboxDir, { recursive: true });
    writeFileSync(path.join(inboxDir, 'declaraciones.yaml'), stringifyYaml([declaracionDeEjemplo()]), 'utf8');

    const r = promover(inboxDir, { rootDir: raiz, corrida: corridaId });

    expect(r.errores).toEqual([]);
    expect(r.promovidos).toHaveLength(1);

    const destino = path.join(raiz, ...r.promovidos[0]!.destino.split('/'));
    const escrito = parseYaml(readFileSync(destino, 'utf8'));
    expect(escrito.procedencia.agente_sha).toBe(hashRolCongelado);
    expect(escrito.procedencia.agente_sha).not.toBe(hashDeArchivo(rutaRol));

    const agentesJson = JSON.parse(readFileSync(path.join(corridaDir, 'agentes.json'), 'utf8')) as AgentesJson;
    expect(agentesJson.agentes.investigador!.sha256).toBe(hashRolCongelado);
    expect(agentesJson.archivos_cambiados_durante_la_corrida).toContain('.claude/agents/investigador.md');
    expect(agentesJson.instrucciones_congeladas).toBe(congeladas.generado);
  });

  it('sin instrucciones.json (corrida anterior al congelado), promover sigue usando el hash de ahora', () => {
    const corridaId = '2020-08-02-lacalle-pou-economia-impuestos';
    const raiz = prepararRaizConInstrucciones();
    const corridaDir = path.join(raiz, 'data', 'corridas', corridaId);
    mkdirSync(corridaDir, { recursive: true });
    writeFileSync(path.join(corridaDir, 'brief.md'), '# brief de prueba\n', 'utf8');
    // Sin escribirInstruccionesCongeladas(): esta corrida es "anterior al congelado".

    const rutaRol = path.join(raiz, '.claude', 'agents', 'investigador.md');
    const hashDeAhora = hashDeArchivo(rutaRol);

    const inboxDir = path.join(raiz, 'inbox-src');
    mkdirSync(inboxDir, { recursive: true });
    writeFileSync(path.join(inboxDir, 'declaraciones.yaml'), stringifyYaml([declaracionDeEjemplo()]), 'utf8');

    const r = promover(inboxDir, { rootDir: raiz, corrida: corridaId });

    expect(r.errores).toEqual([]);
    const destino = path.join(raiz, ...r.promovidos[0]!.destino.split('/'));
    const escrito = parseYaml(readFileSync(destino, 'utf8'));
    expect(escrito.procedencia.agente_sha).toBe(hashDeAhora);

    const agentesJson = JSON.parse(readFileSync(path.join(corridaDir, 'agentes.json'), 'utf8')) as AgentesJson;
    expect(agentesJson.archivos_cambiados_durante_la_corrida).toBeUndefined();
    expect(agentesJson.instrucciones_congeladas).toBeUndefined();
  });
});
