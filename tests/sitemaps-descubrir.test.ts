/**
 * `descubrir()` con red simulada (mock de `descargar`): cubre el filtro por `lastmod` propio de
 * cada `<url>` dentro de un sitemap hoja, agregado el 2026-09-16 (docs/plan-catalogo.md,
 * "Rendimiento"). Antes de este cambio, el filtro por mes solo miraba qué sitemap hoja bajar (por
 * el nombre del archivo o el `lastmod` del propio índice); una vez bajado, todas sus URL entraban
 * sin cotejar su fecha individual contra `--desde/--hasta`. Así el 13% de las URL de agosto de El
 * País (633 de 4.895) cayeron en 2026-09.
 */
import { describe, expect, it, vi } from 'vitest';
import { descubrir } from '../scripts/lib/sitemaps.ts';

const ROBOTS = 'Sitemap: https://test-lastmod.uy/sitemap-202608.xml\nUser-agent: *\n';
const SITEMAP = `<?xml version="1.0" encoding="UTF-8"?>
<urlset>
  <url><loc>https://test-lastmod.uy/nota-agosto</loc><lastmod>2026-08-15</lastmod></url>
  <url><loc>https://test-lastmod.uy/nota-setiembre</loc><lastmod>2026-09-02</lastmod></url>
  <url><loc>https://test-lastmod.uy/nota-sin-fecha</loc></url>
</urlset>`;

vi.mock('../scripts/lib/http.ts', () => ({
  descargar: vi.fn(async (url: string) => {
    if (url.endsWith('/robots.txt')) return { buffer: Buffer.from(ROBOTS, 'utf8') };
    if (url.includes('sitemap-202608.xml')) return { buffer: Buffer.from(SITEMAP, 'utf8') };
    throw new Error(`URL no mockeada en el test: ${url}`);
  }),
}));

describe('descubrir() — lastmod por URL dentro de un sitemap hoja', () => {
  it('descarta una URL cuyo lastmod propio cae fuera de --desde/--hasta, aunque el sitemap hoja sea del mes pedido', async () => {
    const r = await descubrir('https://test-lastmod.uy', { desde: '2026-08', hasta: '2026-08', terminos: [] });
    const urls = r.candidatas.map((c) => c.url);
    expect(urls).toContain('https://test-lastmod.uy/nota-agosto');
    expect(urls).not.toContain('https://test-lastmod.uy/nota-setiembre');
  });

  it('conserva una URL sin lastmod propio (no hay con qué filtrarla) y la cuenta en sinFechaPropia', async () => {
    const r = await descubrir('https://test-lastmod.uy', { desde: '2026-08', hasta: '2026-08', terminos: [] });
    expect(r.candidatas.map((c) => c.url)).toContain('https://test-lastmod.uy/nota-sin-fecha');
    expect(r.sinFechaPropia).toBe(1);
  });
});
