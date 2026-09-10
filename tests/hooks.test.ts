/**
 * `scripts/hooks/bash-permitido.mjs` corrido de verdad con `node` y JSON por
 * stdin, como lo va a invocar Claude Code (plan-2026-09, fase 0.3 y 1.4): un
 * hook `PreToolUse` que deniega `Bash` fuera de la lista de cada rol.
 */
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const HOOK = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'scripts', 'hooks', 'bash-permitido.mjs');

interface Entrada {
  tool_name?: string;
  tool_input?: { command?: string };
  agent_type?: string;
}

function correr(entrada: Entrada): { codigo: number; stdout: string } {
  const r = spawnSync(process.execPath, [HOOK], { input: JSON.stringify(entrada), encoding: 'utf8' });
  if (r.error) throw r.error;
  return { codigo: r.status ?? -1, stdout: r.stdout };
}

function permitido(entrada: Entrada) {
  const r = correr(entrada);
  expect(r.codigo).toBe(0);
  expect(r.stdout.trim()).toBe('');
}

function denegado(entrada: Entrada): string {
  const r = correr(entrada);
  expect(r.codigo).toBe(0);
  const json = JSON.parse(r.stdout);
  expect(json.hookSpecificOutput.hookEventName).toBe('PreToolUse');
  expect(json.hookSpecificOutput.permissionDecision).toBe('deny');
  expect(typeof json.hookSpecificOutput.permissionDecisionReason).toBe('string');
  return json.hookSpecificOutput.permissionDecisionReason as string;
}

describe('bash-permitido: casos que no gobierna', () => {
  it('permite cualquier comando si no hay agent_type', () => {
    permitido({ tool_name: 'Bash', tool_input: { command: 'rm -rf content' } });
  });

  it('permite cualquier comando si tool_name no es Bash', () => {
    permitido({ tool_name: 'Read', agent_type: 'investigador', tool_input: { command: 'rm -rf content' } });
  });

  it('permite todo para un agent_type que el hook no gobierna (ej. claude, general-purpose)', () => {
    permitido({ tool_name: 'Bash', agent_type: 'claude', tool_input: { command: 'rm -rf content' } });
  });

  it('con JSON ilegible por stdin, no bloquea (sale 0 sin salida)', () => {
    const r = spawnSync(process.execPath, [HOOK], { input: 'esto no es JSON', encoding: 'utf8' });
    expect(r.status).toBe(0);
    expect(r.stdout.trim()).toBe('');
  });
});

describe('bash-permitido: comandos simples', () => {
  it('permite pnpm fuente para investigador', () => {
    permitido({ tool_name: 'Bash', agent_type: 'investigador', tool_input: { command: 'pnpm fuente https://example.com' } });
  });

  it('permite pnpm lote ver para editor', () => {
    permitido({ tool_name: 'Bash', agent_type: 'editor', tool_input: { command: 'pnpm lote ver inbox/x declaraciones 0' } });
  });

  it('permite pnpm banco para critico pero no para investigador', () => {
    permitido({ tool_name: 'Bash', agent_type: 'critico', tool_input: { command: 'pnpm banco algun-id' } });
    const razon = denegado({ tool_name: 'Bash', agent_type: 'investigador', tool_input: { command: 'pnpm banco algun-id' } });
    expect(razon).toContain('investigador');
  });

  it('deniega cat .env para investigador y dice qué usar en su lugar', () => {
    const razon = denegado({ tool_name: 'Bash', agent_type: 'investigador', tool_input: { command: 'cat .env' } });
    expect(razon).toContain('cat .env');
    expect(razon).toContain('pnpm lote');
    expect(razon).toContain('pnpm fuente');
  });

  it('deniega rm -rf para cualquier rol gobernado', () => {
    denegado({ tool_name: 'Bash', agent_type: 'detective', tool_input: { command: 'rm -rf inbox' } });
  });

  it('resolvedor tiene los mismos permisos que investigador', () => {
    permitido({ tool_name: 'Bash', agent_type: 'resolvedor', tool_input: { command: 'pnpm inventario antel.com.uy' } });
    permitido({ tool_name: 'Bash', agent_type: 'resolvedor', tool_input: { command: 'mkdir -p inbox/nuevo' } });
  });

  it('detective no tiene pnpm validar ni pnpm lote', () => {
    denegado({ tool_name: 'Bash', agent_type: 'detective', tool_input: { command: 'pnpm validar --inbox inbox/x' } });
    denegado({ tool_name: 'Bash', agent_type: 'detective', tool_input: { command: 'pnpm lote ver inbox/x declaraciones 0' } });
  });
});

describe('bash-permitido: comandos encadenados', () => {
  it('permite cd "<ruta>" && <comando permitido>', () => {
    permitido({ tool_name: 'Bash', agent_type: 'editor', tool_input: { command: 'cd "inbox/lacalle-pou/economia/2026-09-06" && pnpm validar --inbox . --red' } });
  });

  it('permite cd <ruta> && <comando permitido> sin comillas', () => {
    permitido({ tool_name: 'Bash', agent_type: 'investigador', tool_input: { command: 'cd inbox/mujica && pnpm fuente https://example.com' } });
  });

  it('deniega la cadena si algún tramo no está permitido', () => {
    const razon = denegado({
      tool_name: 'Bash',
      agent_type: 'editor',
      tool_input: { command: 'pnpm validar --inbox inbox/x && rm -rf inbox/x' },
    });
    expect(razon).toContain('rm -rf inbox/x');
  });

  it('permite | tail, | head y | grep como filtro final', () => {
    permitido({ tool_name: 'Bash', agent_type: 'critico', tool_input: { command: 'pnpm corpus:buscar "impuestos" --limite 50 | head -20' } });
    permitido({ tool_name: 'Bash', agent_type: 'critico', tool_input: { command: 'pnpm corpus:buscar "impuestos" | grep lacalle' } });
    permitido({ tool_name: 'Bash', agent_type: 'critico', tool_input: { command: 'pnpm lote ver inbox/x declaraciones 0 | tail -50' } });
  });

  it('un filtro final no exime los tramos anteriores de la cadena', () => {
    denegado({ tool_name: 'Bash', agent_type: 'critico', tool_input: { command: 'rm -rf inbox/x | head -5' } });
  });

  it('no confunde un "|" dentro de comillas (--buscar "frase | otra frase") con un pipe', () => {
    permitido({
      tool_name: 'Bash',
      agent_type: 'investigador',
      tool_input: { command: 'pnpm fuente https://example.com --buscar "primera frase | segunda frase" --ventana 800' },
    });
  });

  it('respeta ; como separador de tramos, igual que &&', () => {
    denegado({ tool_name: 'Bash', agent_type: 'editor', tool_input: { command: 'pnpm validar --inbox inbox/x; cat .env' } });
    permitido({ tool_name: 'Bash', agent_type: 'editor', tool_input: { command: 'pnpm validar --inbox inbox/x; pnpm lote ver inbox/x declaraciones 0' } });
  });
});
