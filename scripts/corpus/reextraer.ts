/**
 * pnpm corpus:reextraer [--medio <slug>] [--desde AAAA-MM] [--hasta AAAA-MM] [--limite n] [--escribir]
 *
 * Vuelve a extraer el texto de las notas del corpus que tienen el HTML crudo guardado
 * (`notas/<id>.html.gz`) con el extractor VIGENTE (`extraerHtml` de `lib/extraer.ts`) y lo compara
 * contra el `texto` ya guardado en `notas/<id>.json`. Sirve para medir, sobre notas ya bajadas, cuánto
 * cambia el texto cuando el extractor mejora (el multi-bloque/JSON-LD de El Observador, 2026-09-16):
 * sin esto, una mejora del extractor solo se aplica a notas nuevas, y las viejas quedan con el texto
 * recortado para siempre.
 *
 * Sin `--escribir` (modo por defecto, **simulación**): imprime una línea por nota cuyo texto nuevo sea
 * al menos 15% más largo o más corto que el guardado (id, medio, fecha, largo viejo → nuevo,
 * `extraccion` nueva, primeros 60 caracteres nuevos) y, al final, un resumen por medio (cuántas notas
 * con HTML crecen, se achican o quedan iguales dentro del umbral).
 *
 * Con `--escribir`: reemplaza `texto`, `text_sha256` y `extraccion`, conserva todo lo demás de la nota
 * (etiquetas, catálogo, resumen…) y reindexa. **Nunca achica un texto al escribir**: si el nuevo es más
 * corto, se lista igual que en la simulación pero no se toca (podría ser una regresión del extractor,
 * o un paywall que ahora bloquea más de lo que bloqueaba cuando se bajó la nota).
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { RUTAS_CORPUS } from '../lib/rutas.ts';
import { sha256 } from '../lib/hash.ts';
import { extraerHtml } from '../lib/extraer.ts';
import { log, parsearArgs } from '../lib/log.ts';
import { abrirIndice, indexarNota, type Indice } from './indexar.ts';
import type { Nota } from './tipos.ts';

/** Umbral de cambio de largo (docs/plan-catalogo.md, "Rendimiento"): ±15%. */
export const UMBRAL_CAMBIO = 0.15;

export interface FiltroReextraer {
  medio?: string;
  /** AAAA-MM, inclusive. */
  desde?: string;
  /** AAAA-MM, inclusive. */
  hasta?: string;
  limite?: number;
}

/**
 * true si `nota` pasa el filtro por medio y por mes de `fecha`. Sin fecha en la nota, pasa cualquier
 * filtro de fechas (no se puede descartar por un dato que no se tiene).
 */
export function pasaFiltro(nota: Pick<Nota, 'medio' | 'fecha'>, filtro: FiltroReextraer): boolean {
  if (filtro.medio && nota.medio !== filtro.medio) return false;
  const mes = nota.fecha ? nota.fecha.slice(0, 7) : null;
  if (mes) {
    if (filtro.desde && mes < filtro.desde) return false;
    if (filtro.hasta && mes > filtro.hasta) return false;
  }
  return true;
}

/**
 * HTML crudo cacheado (`<id>.html.gz`) de una carpeta de notas dada, o null si no existe o no se pudo
 * leer. Misma lógica que `htmlCacheado` de `fuente.ts` (no exportada de ahí): se repite acá, chica y
 * sin dependencias, para no acoplar este script de medición al de descarga (regla 17: no tocar una
 * herramienta que otro trabajo ya usa).
 */
export function htmlCacheadoDe(carpetaNotas: string, id: string): string | null {
  const ruta = join(carpetaNotas, `${id}.html.gz`);
  if (!existsSync(ruta)) return null;
  try {
    return gunzipSync(readFileSync(ruta)).toString('utf8');
  } catch {
    return null;
  }
}

export interface ComparacionExtraccion {
  id: string;
  medio: string;
  fecha: string | null;
  largoViejo: number;
  largoNuevo: number;
  /** (nuevo - viejo) / viejo; 1 si el texto viejo estaba vacío y el nuevo no. */
  cambioPct: number;
  extraccionNueva?: Nota['extraccion'];
  /** Primeros 60 caracteres del texto nuevo, sin saltos de línea. */
  inicioNuevo: string;
  /** Texto nuevo completo (para escribirlo si corresponde); no se imprime entero. */
  textoNuevo: string;
}

/** Compara el texto ya guardado contra lo que da el extractor vigente sobre `html`. Pura: no toca disco. */
export function compararExtraccion(nota: Pick<Nota, 'id' | 'medio' | 'fecha' | 'texto' | 'url_canonica'>, html: string): ComparacionExtraccion {
  const ex = extraerHtml(html, nota.url_canonica);
  const largoViejo = nota.texto.length;
  const largoNuevo = ex.texto.length;
  const cambioPct = largoViejo > 0 ? (largoNuevo - largoViejo) / largoViejo : largoNuevo > 0 ? 1 : 0;
  return {
    id: nota.id,
    medio: nota.medio,
    fecha: nota.fecha,
    largoViejo,
    largoNuevo,
    cambioPct,
    extraccionNueva: ex.extraccion,
    inicioNuevo: ex.texto.slice(0, 60).replace(/\s+/g, ' ').trim(),
    textoNuevo: ex.texto,
  };
}

export interface ResumenPorMedio {
  medio: string;
  /** Notas con HTML crudo que se llegaron a comparar (pasan el filtro). */
  total: number;
  crecen: number;
  achican: number;
  iguales: number;
}

export interface ResultadoReextraer {
  /** Notas con HTML crudo, dentro del filtro y del límite, que se compararon. */
  revisadas: number;
  /** Notas que pasaban el filtro pero no tenían `.html.gz` (nada que reextraer). */
  sinHtml: number;
  /** Solo las que superan el umbral (para arriba o para abajo). */
  comparaciones: ComparacionExtraccion[];
  resumenPorMedio: ResumenPorMedio[];
  /** Cuántas notas se reescribieron de verdad (solo con `--escribir`, y solo las que crecen). */
  escritas: number;
}

/**
 * Recorre `notas/*.json` de `carpetaNotas` (por defecto, el corpus real), filtra por medio/fecha,
 * compara cada una que tenga `.html.gz` contra el extractor vigente, y agrupa el resultado por medio.
 * `limite` tope la cantidad de notas COMPARADAS (con HTML y dentro del filtro), no la cantidad de
 * archivos recorridos: sobre un corpus de decenas de miles de notas, es la forma de correr una pasada
 * acotada sin barrer todo.
 *
 * Con `escribir: true`, las que crecen ≥ `UMBRAL_CAMBIO` se reescriben en el propio JSON (texto,
 * text_sha256, extraccion) y se reindexan con `abrirIndice`/`indexarNota`; `rutaIndice` permite
 * apuntar a un índice de prueba en vez del `indice.db` real del corpus.
 */
export function reextraerCorpus(opciones: FiltroReextraer & { escribir?: boolean; carpetaNotas?: string; rutaIndice?: string } = {}): ResultadoReextraer {
  const carpetaNotas = opciones.carpetaNotas ?? RUTAS_CORPUS.notas;
  const archivos = existsSync(carpetaNotas) ? readdirSync(carpetaNotas).filter((f) => f.endsWith('.json')).sort() : [];

  let revisadas = 0;
  let sinHtml = 0;
  let escritas = 0;
  const comparaciones: ComparacionExtraccion[] = [];
  const porMedio = new Map<string, ResumenPorMedio>();
  let indice: Indice | null = null;

  const resumenDe = (medio: string): ResumenPorMedio => {
    let r = porMedio.get(medio);
    if (!r) {
      r = { medio, total: 0, crecen: 0, achican: 0, iguales: 0 };
      porMedio.set(medio, r);
    }
    return r;
  };

  try {
    for (const archivo of archivos) {
      if (opciones.limite !== undefined && revisadas >= opciones.limite) break;

      let nota: Nota;
      try {
        nota = JSON.parse(readFileSync(join(carpetaNotas, archivo), 'utf8')) as Nota;
      } catch (e) {
        log.aviso(`nota ilegible ${archivo}: ${(e as Error).message}`);
        continue;
      }
      if (!pasaFiltro(nota, opciones)) continue;

      const html = htmlCacheadoDe(carpetaNotas, nota.id);
      if (html === null) {
        sinHtml++;
        continue;
      }
      revisadas++;

      const c = compararExtraccion(nota, html);
      const resumen = resumenDe(nota.medio);
      resumen.total++;
      if (c.cambioPct >= UMBRAL_CAMBIO) resumen.crecen++;
      else if (c.cambioPct <= -UMBRAL_CAMBIO) resumen.achican++;
      else resumen.iguales++;

      if (Math.abs(c.cambioPct) < UMBRAL_CAMBIO) continue;
      comparaciones.push(c);

      if (opciones.escribir && c.cambioPct > 0) {
        nota.texto = c.textoNuevo;
        nota.text_sha256 = sha256(c.textoNuevo);
        if (c.extraccionNueva) nota.extraccion = c.extraccionNueva;
        else delete nota.extraccion;
        writeFileSync(join(carpetaNotas, archivo), JSON.stringify(nota, null, 1), 'utf8');
        escritas++;
        indice ??= abrirIndice({ ruta: opciones.rutaIndice });
        indexarNota(indice, nota);
      }
    }
  } finally {
    indice?.cerrar();
  }

  return {
    revisadas,
    sinHtml,
    comparaciones,
    resumenPorMedio: [...porMedio.values()].sort((a, b) => a.medio.localeCompare(b.medio)),
    escritas,
  };
}

function main(): void {
  const { opciones } = parsearArgs(process.argv.slice(2));
  const escribir = opciones.escribir === true;
  const r = reextraerCorpus({
    medio: typeof opciones.medio === 'string' ? opciones.medio : undefined,
    desde: typeof opciones.desde === 'string' ? opciones.desde : undefined,
    hasta: typeof opciones.hasta === 'string' ? opciones.hasta : undefined,
    limite: typeof opciones.limite === 'string' && Number.isFinite(Number(opciones.limite)) ? Number(opciones.limite) : undefined,
    escribir,
  });

  for (const c of r.comparaciones) {
    const signo = c.cambioPct >= 0 ? '+' : '';
    process.stdout.write(
      `${c.id} · ${c.medio} · ${c.fecha ?? '?'} · ${c.largoViejo} → ${c.largoNuevo} (${signo}${(c.cambioPct * 100).toFixed(0)}%) · ${c.extraccionNueva ?? 'dom'} · "${c.inicioNuevo}"\n`,
    );
  }
  if (r.comparaciones.length) process.stdout.write('\n');
  for (const rm of r.resumenPorMedio) {
    process.stdout.write(`${rm.medio}: ${rm.total} con HTML · crecen ${rm.crecen} · se achican ${rm.achican} · iguales ${rm.iguales}\n`);
  }
  log.ok(
    `${r.revisadas} nota(s) comparada(s) (${r.sinHtml} sin HTML crudo)` +
      (escribir ? `, ${r.escritas} reescrita(s)` : ' — simulación, nada se tocó (correr con --escribir para aplicar)'),
  );
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
