/**
 * `pnpm consulta:web "<consulta>" --consultas <ruta> [--resultados n]` (docs/plan-herramientas-lote.md,
 * punto 4): registra una búsqueda web en `consultas.jsonl` con la hora real. Antes la anotaba el
 * agente a mano, con una hora aproximada.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { describirConsultaWeb, lineaConsultaWeb, registrarConsultaWeb } from '../scripts/consulta-web.ts';
import { lineaConsultaBusqueda } from '../scripts/corpus/buscar.ts';
import { agregarLineaDeConsulta, lineaDeConsulta, resultadoDeBusqueda } from '../scripts/lib/consultas.ts';
import { DIR_TESTS } from './ayuda.ts';

const temporales: string[] = [];
function dirTemp(): string {
  const d = mkdtempSync(path.join(tmpdir(), 'la-casta-consulta-web-'));
  temporales.push(d);
  return d;
}
afterEach(() => {
  for (const d of temporales.splice(0)) rmSync(d, { recursive: true, force: true });
});

describe('lineaConsultaWeb', () => {
  it('es una línea JSON con hora real, tipo busqueda, el comando entre comillas y la cantidad de resultados', () => {
    const momento = new Date('2026-10-29T14:42:20.123Z');
    const linea = JSON.parse(lineaConsultaWeb('El Observador Grupo Cardoso propiedad', 8, momento));
    expect(linea).toEqual({
      t: '2026-10-29T14:42:20.123Z',
      tipo: 'busqueda',
      q: 'consulta:web "El Observador Grupo Cardoso propiedad"',
      resultado: '8 resultado(s)',
    });
  });

  it('cero resultados se escribe como "sin resultados", igual que corpus:buscar', () => {
    expect(JSON.parse(lineaConsultaWeb('nada', 0)).resultado).toBe('sin resultados');
  });

  it('sin --resultados el resultado dice "no informado": la herramienta no inventa un número', () => {
    expect(JSON.parse(lineaConsultaWeb('algo')).resultado).toBe('no informado');
  });

  it('la hora por omisión es la de ahora, no una aproximación', () => {
    const antes = Date.now();
    const t = Date.parse(JSON.parse(lineaConsultaWeb('algo', 1)).t);
    expect(t).toBeGreaterThanOrEqual(antes);
    expect(t).toBeLessThanOrEqual(Date.now());
  });

  it('las comillas de la consulta se escapan y la línea sigue siendo JSON de una sola línea', () => {
    const linea = lineaConsultaWeb('"Observador" | propiedad (2008)', 2);
    expect(linea).not.toContain('\n');
    expect(JSON.parse(linea).q).toBe(describirConsultaWeb('"Observador" | propiedad (2008)'));
  });

  it('rechaza una consulta vacía y una cantidad que no es un entero >= 0', () => {
    expect(() => lineaConsultaWeb('   ', 1)).toThrow(/Falta la consulta/);
    expect(() => lineaConsultaWeb('x', -1)).toThrow(/entero/);
    expect(() => lineaConsultaWeb('x', 1.5)).toThrow(/entero/);
    expect(() => lineaConsultaWeb('x', Number.NaN)).toThrow(/entero/);
  });
});

describe('registrarConsultaWeb: agrega al final, nunca reescribe', () => {
  it('crea la carpeta y el archivo si faltan, y suma líneas en orden', () => {
    const dir = dirTemp();
    const ruta = path.join(dir, 'inbox', 'lote', 'consultas.jsonl');
    registrarConsultaWeb(ruta, 'primera', 3, new Date('2026-10-29T10:00:00.000Z'));
    registrarConsultaWeb(ruta, 'segunda', 0, new Date('2026-10-29T10:00:05.000Z'));
    const lineas = readFileSync(ruta, 'utf8').trimEnd().split('\n').map((l) => JSON.parse(l));
    expect(lineas.map((l) => l.q)).toEqual(['consulta:web "primera"', 'consulta:web "segunda"']);
    expect(lineas.map((l) => l.t)).toEqual(['2026-10-29T10:00:00.000Z', '2026-10-29T10:00:05.000Z']);
  });

  it('respeta lo que el archivo ya tenía (líneas de corpus:buscar y de pnpm fuente)', () => {
    const dir = dirTemp();
    const ruta = path.join(dir, 'consultas.jsonl');
    const previa = lineaConsultaBusqueda('Batlle impuestos', { politico: 'batlle' }, 7, new Date('2026-10-29T09:00:00.000Z'));
    writeFileSync(ruta, previa + '\n', 'utf8');
    registrarConsultaWeb(ruta, 'web', 4, new Date('2026-10-29T09:01:00.000Z'));
    const texto = readFileSync(ruta, 'utf8');
    expect(texto.startsWith(previa + '\n')).toBe(true);
    expect(texto.trimEnd().split('\n')).toHaveLength(2);
  });
});

describe('la misma función escribe la línea del corpus y la de la web', () => {
  it('lineaDeConsulta es el formato común de consultas.jsonl', () => {
    const momento = new Date('2026-10-29T00:00:00.000Z');
    expect(JSON.parse(lineaDeConsulta('busqueda', 'q', 'r', momento))).toEqual({ t: '2026-10-29T00:00:00.000Z', tipo: 'busqueda', q: 'q', resultado: 'r' });
    expect(resultadoDeBusqueda(0)).toBe('sin resultados');
    expect(resultadoDeBusqueda(12)).toBe('12 resultado(s)');
  });

  it('corpus:buscar y consulta:web dejan las mismas claves y el mismo formato de resultado', () => {
    const corpus = JSON.parse(lineaConsultaBusqueda('x', {}, 5));
    const web = JSON.parse(lineaConsultaWeb('x', 5));
    expect(Object.keys(web)).toEqual(Object.keys(corpus));
    expect(web.tipo).toBe(corpus.tipo);
    expect(web.resultado).toBe(corpus.resultado);
    expect(corpus.q.startsWith('corpus:buscar ')).toBe(true);
    expect(web.q.startsWith('consulta:web ')).toBe(true);
  });

  it('agregarLineaDeConsulta agrega un salto de línea al final', () => {
    const dir = dirTemp();
    const ruta = path.join(dir, 'a', 'consultas.jsonl');
    agregarLineaDeConsulta(ruta, '{"a":1}');
    agregarLineaDeConsulta(ruta, '{"a":2}');
    expect(readFileSync(ruta, 'utf8')).toBe('{"a":1}\n{"a":2}\n');
  });
});

describe('el CLI real (pnpm consulta:web)', () => {
  const RAIZ = path.resolve(DIR_TESTS, '..');
  const correr = (args: string[]) => spawnSync(process.execPath, ['--import', 'tsx', path.join('scripts', 'consulta-web.ts'), ...args], { cwd: RAIZ, encoding: 'utf8' });

  it('registra la búsqueda con la hora real y lo confirma por stdout', () => {
    const ruta = path.join(dirTemp(), 'consultas.jsonl');
    const antes = Date.now();
    const r = correr(['"Observador" propiedad 2008 (grupo)', '--consultas', ruta, '--resultados', '6']);
    expect(r.status, r.stderr).toBe(0);
    expect(r.stdout).toContain('registrado en');
    const linea = JSON.parse(readFileSync(ruta, 'utf8').trim());
    expect(linea.tipo).toBe('busqueda');
    expect(linea.resultado).toBe('6 resultado(s)');
    expect(linea.q).toBe('consulta:web "\\"Observador\\" propiedad 2008 (grupo)"');
    expect(Date.parse(linea.t)).toBeGreaterThanOrEqual(antes - 1000);
  }, 60_000);

  it('sin --consultas o sin consulta: uso y código 2, sin escribir nada', () => {
    const ruta = path.join(dirTemp(), 'consultas.jsonl');
    const sinRuta = correr(['algo']);
    expect(sinRuta.status).toBe(2);
    expect(sinRuta.stderr).toContain('Uso: pnpm consulta:web');
    const sinConsulta = correr(['--consultas', ruta]);
    expect(sinConsulta.status).toBe(2);
    const malResultados = correr(['algo', '--consultas', ruta, '--resultados', 'muchos']);
    expect(malResultados.status).toBe(2);
    expect(existsSync(ruta)).toBe(false);
  }, 60_000);
});
