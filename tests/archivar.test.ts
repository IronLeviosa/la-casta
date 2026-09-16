/**
 * `archivarTodo()` (scripts/archivar.ts): D2 y D4 de docs/plan-fuentes-lentas.md.
 *
 * D2: con `inboxDir`, las URL salen del lote del inbox (no de `content/`); una URL cuya nota del
 * corpus ya trae `archived_url` no se pide a Save Page Now y queda en el ledger igual; sin `pedir`
 * inyectado, el `archivar()` real de `scripts/lib/wayback.ts` se llama con el timeout largo de 90 s.
 * D4: un 429/520 de Save Page Now corta la corrida entera (no sigue pidiendo URL por URL).
 */
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterAll, describe, expect, it, vi } from 'vitest';
import { archivarTodo, TIMEOUT_ARCHIVAR_MS } from '../scripts/archivar.ts';
import * as wayback from '../scripts/lib/wayback.ts';
import { limpiarFixtures, prepararFixture } from './ayuda.ts';

const temporales: string[] = [];
function dirTemporal(): string {
  const d = mkdtempSync(path.join(tmpdir(), 'archivar-'));
  temporales.push(d);
  return d;
}
afterAll(() => {
  limpiarFixtures();
  for (const d of temporales.splice(0)) rmSync(d, { recursive: true, force: true });
});

/** Un lote de inbox mínimo con las URL de `evidencia.fuentes[].url` que se pasen. */
function escribirLote(urls: string[]): string {
  const inboxDir = dirTemporal();
  const registros = urls.map(
    (url, i) => `- politico: lacalle-pou
  tema: economia/impuestos
  fecha: 2026-02-0${i + 1}
  contexto: gobierno
  cargo_en_ese_momento: Presidente de la República
  cita: "Cita de prueba número ${i + 1}, con más de veinte caracteres."
  resumen: "Resumen de prueba número ${i + 1}."
  evidencia:
    nivel: textual
    fuentes:
      - url: ${url}
        medio: el-pais
        fecha: 2026-02-0${i + 1}
        tipo: documento_oficial
        titulo: Prueba ${i + 1}
        cita: "Cita de prueba número ${i + 1}, con más de veinte caracteres."
        retrieved_at: 2026-02-0${i + 1}
  revision:
    tier: publicado
`,
  );
  writeFileSync(path.join(inboxDir, 'declaraciones.yaml'), registros.join(''), 'utf8');
  return inboxDir;
}

describe('archivarTodo(): --inbox <dir> (D2)', () => {
  it('con inboxDir, las URL salen del lote, no de content/', async () => {
    const rootDir = prepararFixture(); // content/ trae sus propias URL (ejemplo.uy/fixture/...)
    const inboxDir = escribirLote(['https://ejemplo.uy/lote-de-prueba-d2']);
    const pedidas: string[] = [];
    const pedir = async (url: string) => {
      pedidas.push(url);
      return { archived_url: `https://web.archive.org/web/2/${url}`, origen: 'guardado' as const };
    };
    const r = await archivarTodo({ rootDir, inboxDir, pedir, espera: 0 });
    // Ni una de content/ (siempre "ejemplo.uy/fixture/..."): solo la del lote.
    expect(pedidas).toEqual(['https://ejemplo.uy/lote-de-prueba-d2']);
    expect(r.archivadas).toBe(1);
    expect(r.ledger['https://ejemplo.uy/lote-de-prueba-d2']?.archived_url).toBe('https://web.archive.org/web/2/https://ejemplo.uy/lote-de-prueba-d2');
  });

  it('una URL con archived_url en el corpus no se pide y queda en el ledger', async () => {
    const rootDir = prepararFixture();
    const url = 'https://ejemplo.uy/con-copia-en-el-corpus';
    const inboxDir = escribirLote([url]);
    let pedidoLlamado = false;
    const pedir = async () => {
      pedidoLlamado = true;
      return { archived_url: null, origen: 'ninguno' as const, error: 'no debería llamarse a pedir para esta URL' };
    };
    const archivedUrlDelCorpus = (u: string) => (u === url ? 'https://web.archive.org/web/9/con-copia-en-el-corpus' : null);
    const r = await archivarTodo({ rootDir, inboxDir, pedir, archivedUrlDelCorpus, espera: 0 });
    expect(pedidoLlamado).toBe(false);
    expect(r.archivadas).toBe(1);
    expect(r.ledger[url]?.archived_url).toBe('https://web.archive.org/web/9/con-copia-en-el-corpus');
  });

  it('sin pedir inyectado, usa el archivar() real de wayback.ts con el timeout largo (90 s)', async () => {
    const rootDir = prepararFixture();
    const url = 'https://ejemplo.uy/timeout-largo';
    const inboxDir = escribirLote([url]);
    const spy = vi.spyOn(wayback, 'archivar').mockResolvedValue({ archived_url: `https://web.archive.org/web/3/${url}`, origen: 'guardado' });
    try {
      await archivarTodo({ rootDir, inboxDir, espera: 0 });
      expect(spy).toHaveBeenCalledWith(url, { timeoutMs: TIMEOUT_ARCHIVAR_MS });
      expect(TIMEOUT_ARCHIVAR_MS).toBe(90_000);
    } finally {
      spy.mockRestore();
    }
  });

  it('--limite 0 no pide nada y lista las pendientes', async () => {
    const rootDir = prepararFixture();
    const inboxDir = escribirLote(['https://ejemplo.uy/pendiente-uno', 'https://ejemplo.uy/pendiente-dos']);
    let llamadas = 0;
    const pedir = async () => {
      llamadas++;
      return { archived_url: 'https://web.archive.org/web/x', origen: 'guardado' as const };
    };
    const r = await archivarTodo({ rootDir, inboxDir, pedir, espera: 0, limite: 0 });
    expect(llamadas).toBe(0);
    expect(r.intentadas).toBe(0);
    expect(r.pendientes).toBe(2);
    expect(r.urlsPendientes.sort()).toEqual(['https://ejemplo.uy/pendiente-dos', 'https://ejemplo.uy/pendiente-uno']);
  });
});

describe('archivarTodo(): D4, un 429/520 de Save Page Now corta la corrida', () => {
  it('corta después de la primera URL y no sigue pidiendo las que quedan', async () => {
    const rootDir = prepararFixture();
    const inboxDir = escribirLote(['https://ejemplo.uy/a-primera', 'https://ejemplo.uy/b-segunda']);
    const pedidas: string[] = [];
    const pedir = async (url: string) => {
      pedidas.push(url);
      return { archived_url: null, origen: 'ninguno' as const, error: 'save devolvio HTTP 429' };
    };
    const r = await archivarTodo({ rootDir, inboxDir, pedir, espera: 0 });
    expect(pedidas).toEqual(['https://ejemplo.uy/a-primera']); // no llega a pedir la segunda
    expect(r.limitada).toMatch(/limitando esta IP/);
    expect(r.limitada).toContain('429');
  });

  it('un 200 normal (no 429/520) no corta la corrida', async () => {
    const rootDir = prepararFixture();
    const inboxDir = escribirLote(['https://ejemplo.uy/a-primera', 'https://ejemplo.uy/b-segunda']);
    const pedidas: string[] = [];
    const pedir = async (url: string) => {
      pedidas.push(url);
      return { archived_url: null, origen: 'ninguno' as const, error: 'sin snapshot' };
    };
    const r = await archivarTodo({ rootDir, inboxDir, pedir, espera: 0 });
    expect(pedidas).toEqual(['https://ejemplo.uy/a-primera', 'https://ejemplo.uy/b-segunda']);
    expect(r.limitada).toBeUndefined();
  });
});
