import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { candidatosDeVersion } from '../scripts/lib/ejecutable.ts';

const temporales: string[] = [];
afterEach(() => {
  for (const t of temporales.splice(0)) rmSync(t, { recursive: true, force: true });
});

describe('candidatosDeVersion()', () => {
  it('prueba <version>/claude.exe y <version>/<hash>/claude.exe, con el hash verificado primero', () => {
    const base = mkdtempSync(join(tmpdir(), 'claude-code-'));
    temporales.push(base);
    const version = join(base, '2.1.309');
    mkdirSync(join(version, 'aaaa'), { recursive: true });
    mkdirSync(join(version, 'bbbb'), { recursive: true });
    writeFileSync(join(version, 'bbbb', '.verified'), 'ok');
    const c = candidatosDeVersion(version);
    expect(c[0]).toBe(join(version, 'claude.exe'));
    expect(c.indexOf(join(version, 'bbbb', 'claude.exe'))).toBeLessThan(c.indexOf(join(version, 'aaaa', 'claude.exe')));
    expect(c).toContain(join(version, 'aaaa', 'claude'));
  });

  it('sin subcarpetas devuelve solo las rutas directas, y no revienta si la carpeta no existe', () => {
    const base = mkdtempSync(join(tmpdir(), 'claude-code-'));
    temporales.push(base);
    expect(candidatosDeVersion(base)).toEqual([join(base, 'claude.exe'), join(base, 'claude')]);
    expect(candidatosDeVersion(join(base, 'no-existe'))).toEqual([join(base, 'no-existe', 'claude.exe'), join(base, 'no-existe', 'claude')]);
  });
});
