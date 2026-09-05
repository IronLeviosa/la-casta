/**
 * Estado de los artefactos de una corrida.
 *
 * Lo que se prueba acá no es un detalle de formato: es la diferencia entre una corrida que se
 * planificó y nunca se ejecutó (legítima, y su brief vale la pena que sea público) y una que corrió
 * y perdió un artefacto (un agujero de auditoría). Si `pnpm auditar` las confunde, queda en rojo
 * para siempre y deja de servir.
 */
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { verificarArtefactos } from '../scripts/lib/corridas.ts';

const temporales: string[] = [];
function corridaTemporal(): string {
  const dir = mkdtempSync(path.join(tmpdir(), 'corrida-'));
  temporales.push(dir);
  return dir;
}
afterEach(() => {
  for (const d of temporales.splice(0)) rmSync(d, { recursive: true, force: true });
});

describe('verificarArtefactos()', () => {
  it('una carpeta con solo brief.md es una corrida planificada, no una incompleta', () => {
    const dir = corridaTemporal();
    writeFileSync(path.join(dir, 'brief.md'), '# brief\n');
    const est = verificarArtefactos(dir);
    expect(est.soloBrief).toBe(true);
    expect(est.faltantes).toEqual([]);
  });

  it('una corrida que corrió y perdió un artefacto sí reporta el faltante', () => {
    const dir = corridaTemporal();
    writeFileSync(path.join(dir, 'brief.md'), '# brief\n');
    writeFileSync(path.join(dir, 'agentes.json'), '{}\n');
    writeFileSync(path.join(dir, 'consultas.jsonl'), '\n');
    mkdirSync(path.join(dir, 'crudo'));
    writeFileSync(path.join(dir, 'edicion.diff'), '');
    const est = verificarArtefactos(dir);
    expect(est.soloBrief).toBe(false);
    expect(est.faltantes).toContain('critica.md');
  });

  it('con el diff vacío no exige razones.md, porque el editor no tocó nada', () => {
    const dir = corridaTemporal();
    for (const a of ['brief.md', 'agentes.json', 'consultas.jsonl', 'critica.md']) writeFileSync(path.join(dir, a), 'x\n');
    mkdirSync(path.join(dir, 'crudo'));
    writeFileSync(path.join(dir, 'edicion.diff'), '   \n');
    const est = verificarArtefactos(dir);
    expect(est.diffVacio).toBe(true);
    expect(est.faltantes).toEqual([]);
  });

  it('una carpeta que no existe no es una corrida planificada', () => {
    const est = verificarArtefactos(path.join(tmpdir(), 'no-existe-corrida-xyz'));
    expect(est.existe).toBe(false);
    expect(est.soloBrief).toBe(false);
  });
});
