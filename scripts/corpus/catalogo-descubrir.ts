#!/usr/bin/env tsx
/**
 * `pnpm catalogo:descubrir <medio> --desde AAAA-MM --hasta AAAA-MM [--encolar] [--partes N] [--json]`
 *
 * Etapa A del catálogo, versión mínima para el piloto 0 (docs/plan-catalogo.md): todas las URL del
 * sitemap de un medio en un período, sin filtro por término. A diferencia de `pnpm descubrir` (que
 * por omisión recorta a 500 y ordena por relevancia contra los `--terminos` que le pasen), acá se
 * pide `descubrir()` sin `terminos` y con un `limite` muy alto: el catálogo es total, no por alias
 * (`docs/plan-catalogo.md`: "el filtro por alias en el título queda solo como modo de emergencia").
 * `descubrir()` ya admite las dos cosas por opción, así que no hizo falta tocar `lib/sitemaps.ts`
 * ni cambiar el comportamiento por defecto de `pnpm descubrir`.
 *
 * Descarta lo que el corpus ya tiene (mismo `idDeUrl` que usa `pnpm fuente`), imprime cuántas notas
 * nuevas hay por mes y, con `--encolar`, escribe uno o más trabajos `catalogar` (repartidos en
 * `--partes` tramos contiguos si se pide, para que varios `pnpm worker --tipo catalogar` corran en
 * paralelo sin pisarse: cada trabajo es su propio archivo en la cola, y `tomarTrabajo` nunca reparte
 * el mismo archivo dos veces).
 *
 * Sin Wayback: solo sitemap. El CDX de la etapa A (para los medios sin sitemap, o con sitemap
 * corto) espera a que Wayback deje de limitar la IP (ver plan, sección A) y no se toca acá.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';
import { RUTAS_CONTENIDO } from '../lib/rutas.ts';
import { idDeUrl } from '../lib/hash.ts';
import { descubrir, type Candidata } from '../lib/sitemaps.ts';
import { log, parsearArgs } from '../lib/log.ts';
import { agregarTrabajo } from '../cola.ts';
import { notaExisteEnCorpus } from './precarga.ts';

/**
 * Tope práctico de "sin recorte": `descubrir()` por omisión corta en 500 (pensado para
 * `pnpm descubrir`, donde un investigador lee 20 a mano). El catálogo total no filtra por término,
 * así que necesita ver el sitemap entero del período; un medio nacional no tiene millones de notas
 * en un solo mes.
 */
const SIN_RECORTE = 200_000;

/** `content/medios/<slug>.yaml` -> origen (`https://dominio`) para pasarle a `descubrir()`. */
export function origenDeMedio(slug: string, carpetaMedios: string = RUTAS_CONTENIDO.medios): string {
  const ruta = join(carpetaMedios, `${slug}.yaml`);
  if (!existsSync(ruta)) throw new Error(`no existe content/medios/${slug}.yaml`);
  const d = parseYaml(readFileSync(ruta, 'utf8')) as Record<string, unknown>;
  const url = typeof d.url === 'string' ? d.url : Array.isArray(d.dominios) && typeof d.dominios[0] === 'string' ? (d.dominios[0] as string) : null;
  if (!url) throw new Error(`content/medios/${slug}.yaml no tiene "url" ni "dominios"`);
  return url.includes('://') ? new URL(url).origin : `https://${url}`;
}

/** Cuántas candidatas caen en cada mes de `lastmod` (o "sin-fecha" si el sitemap no lo trae). */
export function agruparPorMes(candidatas: Pick<Candidata, 'lastmod'>[]): Map<string, number> {
  const porMes = new Map<string, number>();
  for (const c of candidatas) {
    const mes = c.lastmod ? c.lastmod.slice(0, 7) : 'sin-fecha';
    porMes.set(mes, (porMes.get(mes) ?? 0) + 1);
  }
  return porMes;
}

/** Reparte `lista` en `partes` tramos contiguos, lo más parejos posible, sin desordenarla. */
export function repartir<T>(lista: T[], partes: number): T[][] {
  if (lista.length === 0) return [];
  const n = Math.max(1, Math.min(Math.trunc(partes) || 1, lista.length));
  const tamano = Math.ceil(lista.length / n);
  const tramos: T[][] = [];
  for (let i = 0; i < lista.length; i += tamano) tramos.push(lista.slice(i, i + tamano));
  return tramos;
}

const USO = 'Uso: pnpm catalogo:descubrir <medio> --desde AAAA-MM --hasta AAAA-MM [--encolar] [--partes N] [--json]\n';

async function main(): Promise<void> {
  const { posicionales, opciones } = parsearArgs(process.argv.slice(2));
  const medio = posicionales[0];
  const desde = typeof opciones.desde === 'string' ? opciones.desde : undefined;
  const hasta = typeof opciones.hasta === 'string' ? opciones.hasta : undefined;
  if (!medio || !desde || !hasta) {
    process.stderr.write(USO);
    process.exit(2);
  }

  const origen = origenDeMedio(medio);
  log.info(`sitemap de ${medio} (${origen}) entre ${desde} y ${hasta}…`);
  const r = await descubrir(origen, { desde, hasta, terminos: [], limite: SIN_RECORTE });

  const nuevas = r.candidatas.filter((c) => !notaExisteEnCorpus(idDeUrl(c.url)));
  const yaEnCorpus = r.candidatas.length - nuevas.length;

  const porMes = agruparPorMes(nuevas);
  for (const [mes, n] of [...porMes.entries()].sort(([a], [b]) => a.localeCompare(b))) log.info(`  ${mes}  ${n} nota(s) nueva(s)`);
  log.ok(`${nuevas.length} URL nueva(s) de ${r.candidatas.length} en el sitemap (${yaEnCorpus} ya en el corpus) · ${r.sitemapsLeidos} sitemap(s) leído(s)`);

  const trabajos: { id: string; urls: number }[] = [];
  if (opciones.encolar) {
    const partes = opciones.partes ? Number(opciones.partes) : 1;
    const tramos = repartir(nuevas.map((c) => c.url), partes);
    for (const urls of tramos) {
      const t = agregarTrabajo('catalogar', { medio, desde, hasta, urls });
      trabajos.push({ id: t.id, urls: urls.length });
      log.ok(`trabajo ${t.id} (catalogar) encolado con ${urls.length} URL`);
    }
    if (!tramos.length) log.info('nada para encolar: no hay URL nuevas en este período');
  }

  if (opciones.json) {
    process.stdout.write(
      JSON.stringify(
        { medio, origen, total_sitemap: r.candidatas.length, nuevas: nuevas.length, ya_en_corpus: yaEnCorpus, por_mes: Object.fromEntries(porMes), trabajos },
        null,
        1,
      ) + '\n',
    );
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    log.error((e as Error).message);
    process.exit(1);
  });
}
