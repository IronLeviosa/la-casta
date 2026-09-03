/**
 * `pnpm exportar` (corre dentro de `pnpm build`, después de `astro build`)
 *
 * Escribe los datos abiertos del sitio en `dist/datos/`:
 *
 *   - `<coleccion>.json`   todos los registros `publicado` de cada colección
 *   - `claimreview.json`   JSON-LD ClaimReview de chequeos, giros y promesas
 *   - `simetria.json`      la prueba de simetría (cobertura por partido y tema)
 *   - `version.json`       {commit, fecha, registros}
 *   - `index.json`         índice de los archivos anteriores
 *
 * No depende de que Astro haya generado páginas: si `dist/` no existe, la crea.
 * Los registros `probable` no se exportan como datos abiertos (viven en
 * `/probable/`, con banner y noindex); tampoco los de `hipotesis`, que ni
 * siquiera pueden estar en `content/`.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { COLECCIONES, type NombreColeccion } from '../src/schemas/comunes';
import { claimReviewChequeo, claimReviewGiro, claimReviewPromesa } from '../src/lib/claimreview.ts';
import { urlDe } from '../src/lib/permalinks.ts';
import { ruta, SITIO_POR_DEFECTO } from '../src/lib/ruta.ts';
import { cargarContenido, hoyISO, type Contenido, type Registro } from './lib/contenido.ts';
import { calcularSimetria } from './validadores/simetria.ts';
import { git, tieneCommits } from './lib/git.ts';
import { log, parsearArgs } from './lib/log.ts';
import { RAIZ } from './lib/rutas.ts';

/**
 * Origen del sitio. Igual que en `astro.config.mjs`: `SITE_URL` o el valor por
 * defecto. El base lo agrega `urlDe()` (vía `ruta()`, que bajo `tsx` lee
 * `BASE_PATH`), así que acá solo hace falta el origen.
 */
export const SITIO = process.env.SITE_URL ?? SITIO_POR_DEFECTO;

export interface OpcionesExportar {
  rootDir?: string;
  /** Carpeta de salida (por defecto `<root>/dist/datos`). */
  salida?: string;
  sitio?: string;
}

export interface ResultadoExportar {
  salida: string;
  archivos: { nombre: string; registros: number }[];
  claimreview: number;
  commit: string | null;
}

function absoluta(ruta: string, sitio: string): string {
  return new URL(ruta, sitio + '/').toString();
}

/** Registro tal como se publica en /datos/: id, url y los datos, sin notas internas. */
function paraExportar(reg: Registro, sitio: string): Record<string, unknown> {
  const datos = structuredClone(reg.datos) as Record<string, any>;
  if (datos.revision && typeof datos.revision === 'object') delete datos.revision.notas_internas;
  return { id: reg.id, url: absoluta(urlDe(reg.coleccion, reg.id), sitio), ...datos };
}

function publicados(contenido: Contenido, coleccion: NombreColeccion): Registro[] {
  return contenido.de(coleccion).filter((r) => r.datos.revision?.tier === 'publicado');
}

/** JSON-LD ClaimReview de todo lo calificable: chequeos, giros y promesas publicados. */
export function construirClaimReview(contenido: Contenido, sitio: string): unknown[] {
  const salida: unknown[] = [];
  const autorDe = (slug: string) => {
    const p = contenido.obtener('politicos', slug);
    return { nombre: String(p?.datos.nombre ?? slug), wikidata: p?.datos.wikidata as string | undefined };
  };
  const urlPrimeraFuente = (datos: Record<string, any>): string | undefined => {
    const f = datos.evidencia?.fuentes?.[0] ?? datos.origen?.fuentes?.[0];
    return typeof f?.url === 'string' ? f.url : undefined;
  };

  for (const reg of publicados(contenido, 'chequeos')) {
    const d = reg.datos;
    salida.push(
      claimReviewChequeo({
        url: absoluta(urlDe('chequeos', reg.id), sitio),
        fecha: d.procedencia?.fecha ?? d.fecha,
        afirmacion: d.afirmacion,
        autor: autorDe(d.politico),
        fechaAfirmacion: d.fecha,
        fuenteAfirmacionUrl: urlPrimeraFuente(d),
        calificacion: d.calificacion,
      }),
    );
  }

  for (const reg of publicados(contenido, 'giros')) {
    const d = reg.datos;
    const antes = contenido.obtener('declaraciones', d.declaracion_antes);
    const despues = contenido.obtener('declaraciones', d.declaracion_despues);
    salida.push(
      claimReviewGiro({
        url: absoluta(urlDe('giros', reg.id), sitio),
        fecha: d.procedencia?.fecha ?? despues?.datos.fecha ?? hoyISO(),
        afirmacion: despues?.datos.resumen ?? d.analisis,
        autor: autorDe(d.politico),
        fechaAfirmacion: antes?.datos.fecha ?? despues?.datos.fecha ?? hoyISO(),
        fuenteAfirmacionUrl: despues ? urlPrimeraFuente(despues.datos) : undefined,
        cambio: d.cambio,
      }),
    );
  }

  for (const reg of publicados(contenido, 'promesas')) {
    const d = reg.datos;
    salida.push(
      claimReviewPromesa({
        url: absoluta(urlDe('promesas', reg.id), sitio),
        fecha: d.procedencia?.fecha ?? d.fecha_promesa,
        afirmacion: d.texto,
        autor: autorDe(d.politico),
        fechaAfirmacion: d.fecha_promesa,
        fuenteAfirmacionUrl: urlPrimeraFuente(d),
        estado: d.estado,
      }),
    );
  }

  return salida;
}

export function exportar(opciones: OpcionesExportar = {}): ResultadoExportar {
  const rootDir = path.resolve(opciones.rootDir ?? RAIZ);
  const sitio = opciones.sitio ?? SITIO;
  const salida = opciones.salida ?? path.join(rootDir, 'dist', 'datos');
  mkdirSync(salida, { recursive: true });

  const contenido = cargarContenido(rootDir);
  if (contenido.errores.length) {
    // `prebuild` ya corrió el validador; si aún así hay errores, se exporta lo válido y se avisa.
    log.aviso(`${contenido.errores.length} archivo(s) no pasan el esquema y quedan fuera de /datos/.`);
  }

  const escribir = (nombre: string, datos: unknown): void => {
    writeFileSync(path.join(salida, nombre), JSON.stringify(datos, null, 2) + '\n', 'utf8');
  };

  const archivos: { nombre: string; registros: number }[] = [];
  let totalPublicados = 0;
  for (const def of COLECCIONES) {
    if (def.nombre === 'paginas') continue;
    // Las colecciones de referencia se exportan enteras (no llevan tier de publicación por registro).
    const registros = def.referencia ? contenido.de(def.nombre) : publicados(contenido, def.nombre);
    const cuerpo = registros.map((r) => paraExportar(r, sitio));
    escribir(`${def.nombre}.json`, { coleccion: def.nombre, generado: hoyISO(), total: cuerpo.length, registros: cuerpo });
    archivos.push({ nombre: `${def.nombre}.json`, registros: cuerpo.length });
    if (!def.referencia) totalPublicados += cuerpo.length;
  }

  const claimreview = construirClaimReview(contenido, sitio);
  escribir('claimreview.json', claimreview);
  archivos.push({ nombre: 'claimreview.json', registros: claimreview.length });

  const simetria = calcularSimetria(contenido);
  escribir('simetria.json', simetria);
  archivos.push({ nombre: 'simetria.json', registros: simetria.temas.length });

  const commit = tieneCommits(rootDir) ? git(['rev-parse', 'HEAD'], rootDir).stdout || null : null;
  const etiqueta = tieneCommits(rootDir) ? git(['describe', '--tags', '--abbrev=0'], rootDir) : null;
  escribir('version.json', {
    commit,
    etiqueta: etiqueta?.ok ? etiqueta.stdout : null,
    fecha: new Date().toISOString(),
    registros_publicados: totalPublicados,
    licencia_contenido: 'CC BY 4.0',
    licencia_codigo: 'MIT',
  });
  archivos.push({ nombre: 'version.json', registros: 1 });

  escribir('index.json', {
    generado: new Date().toISOString(),
    archivos: archivos.map((a) => ({ ...a, url: absoluta(ruta(`/datos/${a.nombre}`), sitio) })),
  });

  return { salida, archivos, claimreview: claimreview.length, commit };
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function main(): void {
  const { opciones } = parsearArgs(process.argv.slice(2));
  if (opciones.ayuda || opciones.help) {
    console.log('pnpm exportar [--salida <dir>]\n\nEscribe dist/datos/*.json (datos abiertos, ClaimReview, simetría y versión).');
    process.exit(0);
  }
  try {
    const r = exportar({ salida: typeof opciones.salida === 'string' ? opciones.salida : undefined });
    for (const a of r.archivos) log.info(`${a.nombre}: ${a.registros}`);
    log.ok(`Datos exportados a ${path.relative(RAIZ, r.salida) || r.salida} (commit ${r.commit?.slice(0, 8) ?? 'sin commits'}).`);
    process.exit(0);
  } catch (e) {
    log.error(`No se pudo exportar: ${(e as Error).message}`);
    process.exit(1);
  }
}

const esEntrada = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (esEntrada) main();
