/**
 * El hook que limita Bash por rol (scripts/hooks/bash-permitido.mjs) y la tabla «Comandos que
 * corren los agentes» de CLAUDE.md describen lo mismo desde dos lados: lo que un rol puede correr
 * y lo que se le exige correr. Si divergen, un brief obliga a un agente a usar una herramienta que
 * el hook le deniega, y el crítico lo castiga por no usarla: pasó con `pnpm sesion` en la corrida
 * de Astori (2026-09-16), y dejó quince años de diarios de sesiones sin abrir.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { PERMITIDOS_POR_ROL } from '../scripts/hooks/bash-permitido.mjs';
import { DIR_TESTS } from './ayuda.ts';

const RAIZ = path.resolve(DIR_TESTS, '..');

/** Comandos `pnpm <nombre>` de la tabla de CLAUDE.md cuya columna «Quién lo corre» incluye a los agentes. */
function comandosDeAgentesSegunClaudeMd(): string[] {
  const md = readFileSync(path.join(RAIZ, 'CLAUDE.md'), 'utf8');
  const comandos: string[] = [];
  for (const linea of md.split(/\r?\n/)) {
    if (!linea.startsWith('| `pnpm ')) continue;
    // Las celdas pueden traer un pipe escapado (`<crr\|css>`, `"frase \| frase"`): solo corta por los que no lo están.
    const celdas = linea.split(/(?<!\\)\|/).map((c) => c.trim());
    const comando = celdas[1];
    const quien = celdas[3] ?? '';
    if (!/\bagentes\b/.test(quien)) continue;
    const m = /^`pnpm ([a-z:-]+)/.exec(comando);
    if (m) comandos.push(`pnpm ${m[1]}`);
  }
  return comandos;
}

describe('el hook por rol cubre la tabla de comandos de CLAUDE.md', () => {
  const comandos = comandosDeAgentesSegunClaudeMd();

  it('la tabla tiene comandos asignados a los agentes', () => {
    expect(comandos.length).toBeGreaterThanOrEqual(5);
    expect(comandos).toContain('pnpm fuente');
    expect(comandos).toContain('pnpm sesion');
  });

  it.each(['investigador', 'resolvedor'] as const)('el rol %s puede correr cada uno de ellos', (rol) => {
    const permitidos = PERMITIDOS_POR_ROL[rol];
    const faltan = comandos.filter((c) => !permitidos.some((p) => c === p || c.startsWith(`${p} `) || p.startsWith(c)));
    expect(faltan, `faltan en el hook para ${rol}: ${faltan.join(', ')}`).toEqual([]);
  });
});
