#!/usr/bin/env tsx
/**
 * `pnpm descubrir <medio|dominio> [--desde YYYY-MM] [--hasta YYYY-MM] [--terminos a,b,c]
 *   [--maximo n] [--todas] [--json]`
 *
 * Lista notas candidatas de un medio leyendo su sitemap, para los casos en que el buscador es
 * ciego a ese dominio. No baja las notas: devuelve URLs para que el investigador las lea con
 * `pnpm fuente`, que sigue siendo la unica forma de leer una nota.
 *
 * Caso que lo motivo: elpais.com.uy no aparece en el buscador que usan los agentes, pese a que el
 * diario permite a todos los crawlers y sirve el contenido completo. Resultado: cero notas de El
 * Pais en un corpus de 638, sobre el diario tradicional mas grande del pais.
 *
 * Un rango amplio con varios `--terminos` puede devolver cientos de candidatas: un investigador no
 * las lee todas, lee 20. Por eso el texto muestra solo las 40 mas relevantes (`ordenarCandidatas`
 * en `../lib/sitemaps.ts`) y avisa cuantas quedaron afuera; `--maximo` y `--todas` destapan el
 * resto para quien de verdad las necesite. `--json` sigue devolviendo el resultado completo.
 */
import { log, parsearArgs } from '../lib/log.ts';
import { descubrir, recortar, relevanciaCandidata } from '../lib/sitemaps.ts';

function origenDe(arg: string): string {
  if (arg.startsWith('http')) return new URL(arg).origin;
  return `https://www.${arg.replace(/^www\./, '')}`;
}

async function main(): Promise<void> {
  const { posicionales, opciones } = parsearArgs(process.argv.slice(2));
  const medio = posicionales[0];
  if (!medio) {
    process.stdout.write(
      'uso: pnpm descubrir <medio|dominio> [--desde YYYY-MM] [--hasta YYYY-MM] [--terminos a,b,c]\n' +
        '       [--maximo N] [--todas] [--limite N] [--json]\n' +
        'ej:  pnpm descubrir elpais.com.uy --desde 2019-03 --hasta 2020-03 --terminos ancap,combustible,nafta,gasoil\n' +
        'por omision se muestran las 40 candidatas mas relevantes (mas terminos, despues mas recientes);\n' +
        '--maximo N cambia el corte, --todas las muestra todas.\n',
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
  const maximo = opciones.maximo ? Number(opciones.maximo) : 40;
  const todas = Boolean(opciones.todas);
  const { mostradas, truncado } = recortar(r.candidatas, { maximo, todas });
  if (terminos.length && r.candidatas.length && relevanciaCandidata(r.candidatas[0], terminos) === 0) {
    log.aviso(`ningún término apareció en las URLs candidatas; se muestran igual las ${mostradas.length} más recientes.`);
  }
  for (const c of mostradas) process.stdout.write(`${c.lastmod ? c.lastmod.slice(0, 10) : '          '}  ${c.url}\n`);
  if (truncado) {
    process.stdout.write(
      `${r.candidatas.length} candidata(s) en total; se muestran las ${mostradas.length} con más términos; --maximo n o --todas para ver más.\n`,
    );
  }
  log.info(
    `${r.candidatas.length} candidata(s) · ${r.sitemapsLeidos} sitemap(s) leido(s) · ${r.urlsVistas.toLocaleString('es-UY')} URL(s) revisada(s)`,
  );
}

main().catch((e) => {
  log.error((e as Error).message);
  process.exit(1);
});
