#!/usr/bin/env tsx
/**
 * `pnpm descubrir <medio|dominio> [--desde YYYY-MM] [--hasta YYYY-MM] [--terminos a,b,c]`
 *
 * Lista notas candidatas de un medio leyendo su sitemap, para los casos en que el buscador es
 * ciego a ese dominio. No baja las notas: devuelve URLs para que el investigador las lea con
 * `pnpm fuente`, que sigue siendo la unica forma de leer una nota.
 *
 * Caso que lo motivo: elpais.com.uy no aparece en el buscador que usan los agentes, pese a que el
 * diario permite a todos los crawlers y sirve el contenido completo. Resultado: cero notas de El
 * Pais en un corpus de 638, sobre el diario tradicional mas grande del pais.
 */
import { log, parsearArgs } from '../lib/log.ts';
import { descubrir } from '../lib/sitemaps.ts';

function origenDe(arg: string): string {
  if (arg.startsWith('http')) return new URL(arg).origin;
  return `https://www.${arg.replace(/^www\./, '')}`;
}

async function main(): Promise<void> {
  const { posicionales, opciones } = parsearArgs(process.argv.slice(2));
  const medio = posicionales[0];
  if (!medio) {
    process.stdout.write(
      'uso: pnpm descubrir <medio|dominio> [--desde YYYY-MM] [--hasta YYYY-MM] [--terminos a,b,c] [--limite N] [--json]\n' +
        'ej:  pnpm descubrir elpais.com.uy --desde 2019-03 --hasta 2020-03 --terminos ancap,combustible,nafta,gasoil\n',
    );
    process.exit(1);
  }
  const terminos = typeof opciones.terminos === 'string' ? opciones.terminos.split(',').map((t) => t.trim()).filter(Boolean) : [];
  const r = await descubrir(origenDe(medio), {
    desde: typeof opciones.desde === 'string' ? opciones.desde : undefined,
    hasta: typeof opciones.hasta === 'string' ? opciones.hasta : undefined,
    terminos,
    limite: opciones.limite ? Number(opciones.limite) : 500,
  });
  if (opciones.json) {
    process.stdout.write(JSON.stringify(r, null, 1) + '\n');
    return;
  }
  for (const c of r.candidatas) process.stdout.write(`${c.lastmod ? c.lastmod.slice(0, 10) : '          '}  ${c.url}\n`);
  log.info(
    `${r.candidatas.length} candidata(s) · ${r.sitemapsLeidos} sitemap(s) leido(s) · ${r.urlsVistas.toLocaleString('es-UY')} URL(s) revisada(s)`,
  );
}

main().catch((e) => {
  log.error((e as Error).message);
  process.exit(1);
});
