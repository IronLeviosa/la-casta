/**
 * Toda instrucción que nombra un comando tiene que apuntar a un comando que existe. Es el simétrico
 * del test del hook (tests/hooks-claude-md.test.ts): ahí se verifica que lo que se le exige a un rol
 * el hook lo permita; acá, que lo que se le exige exista. El 2026-09-17 un merge llevó a `main` los
 * roles que mandan a usar `pnpm lote listar` y `pnpm lote notas` antes que los subcomandos: un
 * agente que sigue una instrucción así quema turnos contra un comando que no existe y después declara
 * un hueco que no es real. Las instrucciones y las herramientas viajan en el mismo merge, y este test
 * lo hace cumplir.
 */
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { SUBCOMANDOS_LOTE } from '../scripts/lote.ts';
import { DIR_TESTS } from './ayuda.ts';

const RAIZ = path.resolve(DIR_TESTS, '..');
const ARCHIVOS_DE_INSTRUCCIONES = [
  'CLAUDE.md',
  ...readdirSync(path.join(RAIZ, '.claude', 'agents')).filter((f) => f.endsWith('.md')).map((f) => `.claude/agents/${f}`),
  ...readdirSync(path.join(RAIZ, '.claude', 'commands')).filter((f) => f.endsWith('.md')).map((f) => `.claude/commands/${f}`),
  ...readdirSync(path.join(RAIZ, 'docs', 'colecciones')).filter((f) => f.endsWith('.md')).map((f) => `docs/colecciones/${f}`),
];

/** `pnpm <script>` y, si el script es `lote`, el subcomando que sigue (una palabra sin `<` ni `-`). */
function comandosMencionados(texto: string): { script: string; sub?: string; contexto: string }[] {
  const salida: { script: string; sub?: string; contexto: string }[] = [];
  const re = /pnpm\s+([a-z][a-z0-9:-]*)(?:\s+([a-z][a-z-]*))?/g;
  for (const m of texto.matchAll(re)) {
    const script = m[1];
    const sub = script === 'lote' && m[2] ? m[2] : undefined;
    salida.push({ script, sub, contexto: texto.slice(Math.max(0, m.index! - 20), m.index! + 40).replace(/\s+/g, ' ') });
  }
  return salida;
}

describe('los comandos que nombran las instrucciones existen', () => {
  const scripts = new Set(Object.keys(JSON.parse(readFileSync(path.join(RAIZ, 'package.json'), 'utf8')).scripts as Record<string, string>));
  // Comandos de pnpm mismo, no scripts del repo: `pnpm install` en /auditar es legítimo.
  for (const propio of ['install', 'add', 'remove', 'exec', 'dlx', 'run', 'test', 'store']) scripts.add(propio);
  const subcomandos = new Set<string>(SUBCOMANDOS_LOTE);

  for (const archivo of ARCHIVOS_DE_INSTRUCCIONES) {
    it(`${archivo}: cada pnpm <script> está en package.json y cada pnpm lote <sub> en scripts/lote.ts`, () => {
      const texto = readFileSync(path.join(RAIZ, archivo), 'utf8');
      const faltan = comandosMencionados(texto).filter((c) => !scripts.has(c.script) || (c.sub !== undefined && !subcomandos.has(c.sub)));
      expect(faltan.map((c) => `pnpm ${c.script}${c.sub ? ` ${c.sub}` : ''} (…${c.contexto}…)`)).toEqual([]);
    });
  }

  it('la lista de instrucciones cubre los cuatro lugares que se hashean por corrida', () => {
    expect(ARCHIVOS_DE_INSTRUCCIONES.some((a) => a.startsWith('.claude/agents/'))).toBe(true);
    expect(ARCHIVOS_DE_INSTRUCCIONES.some((a) => a.startsWith('.claude/commands/'))).toBe(true);
    expect(ARCHIVOS_DE_INSTRUCCIONES.some((a) => a.startsWith('docs/colecciones/'))).toBe(true);
  });
});
