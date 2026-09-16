/**
 * Trabajo `catalogar` de la cola (docs/plan-catalogo.md, etapa B): por cada URL, el mismo camino
 * que `pnpm fuente` (bajar, extraer, guardar, indexar; `sinArchivo: true` — Wayback lo pide después
 * un trabajo `archivar` de fondo, nunca acá), la pasada 1 (etiquetador, ya devuelve `relevancia` y
 * `tiene_afirmaciones`) y, si corresponde, la pasada 2 (extractor).
 *
 * El cursor es lo que el trabajo `reetiquetar` no tenía: ese murió a las tres horas con un fallo
 * nativo tras 10.379 de 38.535 notas y arrancó de cero (docs/plan-catalogo.md, "Rendimiento"). Acá
 * `progreso: {hechas, ultima_url, errores}` se guarda en el propio YAML del trabajo (en curso, sin
 * cambiar de carpeta) al final de cada tramo de `tamano_lote` URL (5 por defecto) y al terminar;
 * `pnpm cola:reintentar` sobre un trabajo caído lo reencola con esos `params` intactos, y
 * `indiceDeReanudacion` retoma justo después de `ultima_url` en vez de desde el principio.
 *
 * Un error de una URL puntual (fuente caída, escaneo sin OCR, Haiku que no respondió) no aborta el
 * trabajo entero: queda en `progreso.errores` y se sigue con la próxima, igual que hace
 * `precargarDocumentos` en `precarga.ts`.
 */
import { existsSync, readFileSync } from 'node:fs';
import { moverTrabajo } from '../cola.ts';
import { log } from '../lib/log.ts';
import { envSinPensamiento } from '../lib/ejecutable.ts';
import { idDeUrl } from '../lib/hash.ts';
import { obtenerNota } from './fuente.ts';
import { armarLotes, ejecutarEtiquetadoConClaude, ejecutarEtiquetadoLoteConClaude, leerNota, necesitaCatalogar, TAMANO_LOTE_POR_DEFECTO } from './etiquetar.ts';
import { ejecutarExtraccionConClaude } from './extraer-afirmaciones.ts';
import { registrarRendimiento } from './rendimiento.ts';
import type { Nota, Relevancia, Trabajo } from './tipos.ts';

export interface ProgresoCatalogar {
  hechas: number;
  ultima_url: string | null;
  errores: { url: string; motivo: string }[];
}

export interface ParamsCatalogar {
  medio?: string;
  desde?: string;
  hasta?: string;
  /** Lista de URL en el propio trabajo (lo que escribe `catalogo:descubrir --encolar`). */
  urls?: unknown;
  /** Alternativa: un archivo con una URL por línea (para lotes armados a mano). */
  archivo?: unknown;
  progreso?: ProgresoCatalogar;
  /** Recatalogar aunque la nota ya tenga la versión vigente (equivalente a `--todas` del plan). */
  todas?: unknown;
  /** Tamaño del lote de la pasada 1 (docs/plan-catalogo.md: "hasta 5 notas"); 1 = sin modo lote. */
  tamano_lote?: unknown;
}

/**
 * Dedupe de una lista de URL por su id canónico (`idDeUrl`), en el mismo orden, quedándose con la
 * primera aparición de cada una. Red además de `deduplicarCandidatas` de `catalogo-descubrir.ts`:
 * un trabajo puede venir de un archivo armado a mano (`params.archivo`), o de una versión vieja de
 * la cola encolada antes de esa dedupe.
 */
export function deduplicarUrls(urls: string[]): string[] {
  const vistos = new Set<string>();
  const salida: string[] = [];
  for (const url of urls) {
    const id = idDeUrl(url);
    if (vistos.has(id)) continue;
    vistos.add(id);
    salida.push(url);
  }
  return salida;
}

/** La lista de URL del trabajo: `params.urls` si es un array, o las líneas no vacías de `params.archivo`. Deduplicada por URL canónica: ver `deduplicarUrls`. */
export function listaDeUrls(params: ParamsCatalogar): string[] {
  if (Array.isArray(params.urls)) return deduplicarUrls(params.urls.filter((u): u is string => typeof u === 'string' && u.length > 0));
  if (typeof params.archivo === 'string' && params.archivo) {
    if (!existsSync(params.archivo)) throw new Error(`no existe el archivo de URLs: ${params.archivo}`);
    return deduplicarUrls(
      readFileSync(params.archivo, 'utf8')
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l && !l.startsWith('#')),
    );
  }
  throw new Error('el trabajo catalogar necesita params.urls (lista) o params.archivo (ruta con una URL por línea)');
}

/**
 * Índice desde el que reanudar (y valor correcto de `progreso.hechas`, ver más abajo): el siguiente a
 * `ultima_url` en la lista actual, o 0 si esa URL ya no aparece (sin cursor previo, o la lista cambió
 * entre corridas). Nunca usa `progreso.hechas` para decidir: guardarlo aparte de la lista y no
 * resincronizarlo al reanudar fue justo el bug real (trabajo `20260916T…`, "tramo cerrado, 195/187"
 * sobre una lista de 187 URLs) — se encoló con 196 URLs con 9 repetidas, el cursor guardó
 * `hechas: 130` contando sobre esa lista sin deduplicar, y al reanudar `listaDeUrls` ya llegaba
 * deduplicada a 187 pero `hechas` seguía sumando desde el 130 viejo. Pura, para poder probarla sin
 * tocar la cola; `ejecutarCatalogar` usa este mismo número para resincronizar `progreso.hechas` antes
 * de arrancar el lazo, así los dos no pueden volver a divergir.
 */
export function indiceDeReanudacion(lista: string[], progreso: Pick<ProgresoCatalogar, 'hechas' | 'ultima_url'>): number {
  if (!progreso.ultima_url) return 0;
  const i = lista.indexOf(progreso.ultima_url);
  return i >= 0 ? i + 1 : 0;
}

export interface ResultadoCatalogar {
  medio?: string;
  urls: number;
  catalogadas: number;
  omitidas_ya_catalogadas: number;
  relevancia_central_o_secundaria: number;
  con_afirmaciones: number;
  afirmaciones: number;
  descartadas_cita: number;
  errores: number;
  segundos: number;
  tokens_entrada: number;
  tokens_salida: number;
}

function tieneRelevanciaAlta(relevancia: Record<string, Relevancia> | undefined): boolean {
  return Object.values(relevancia ?? {}).some((v) => v === 'central' || v === 'secundaria');
}

/** El tamaño de lote pedido en `params.tamano_lote`, o el de por defecto (5) si no vino uno válido. */
function tamanoLoteDe(params: ParamsCatalogar): number {
  const v = params.tamano_lote;
  return typeof v === 'number' && Number.isFinite(v) && v > 0 ? Math.trunc(v) : TAMANO_LOTE_POR_DEFECTO;
}

/** Una URL bajada y su nota, o el motivo por el que no se pudo bajar. */
interface Descarga {
  url: string;
  nota?: Nota;
  motivo?: string;
}

/**
 * Corre (o reanuda) un trabajo `catalogar`. `trabajo` se pasa completo (no solo `params`) porque
 * hay que poder reescribir su YAML con el cursor al vuelo; `ctx.detener()` es la misma señal de
 * Ctrl+C que ya usa el resto de los handlers de `worker.ts`.
 *
 * Procesa la lista en tramos de `tamano_lote` URL (5 por defecto): baja cada una (siempre de a una,
 * es E/S de red), agrupa las que de verdad necesitan la pasada 1 en un solo pedido a Haiku
 * (`ejecutarEtiquetadoLoteConClaude`, docs/plan-catalogo.md: "varias notas cortas por llamada,
 * medido contra una por llamada") y corre la pasada 2 de a una, porque cada extracción depende de
 * la relevancia que le tocó a esa nota en particular. El cursor avanza por tramo completo: una
 * caída a mitad de tramo repite como mucho `tamano_lote` notas al reanudar, no todo el trabajo.
 */
export async function ejecutarCatalogar(trabajo: Trabajo, ctx: { detener: () => boolean } = { detener: () => false }): Promise<ResultadoCatalogar> {
  const params = trabajo.params as ParamsCatalogar;
  const lista = listaDeUrls(params);
  const forzarTodas = params.todas === true;
  const tamanoLote = tamanoLoteDe(params);
  const progreso: ProgresoCatalogar = params.progreso ?? { hechas: 0, ultima_url: null, errores: [] };
  const indiceInicio = indiceDeReanudacion(lista, progreso);
  if (indiceInicio > 0) log.info(`catalogar ${trabajo.id}: reanudo desde el índice ${indiceInicio} de ${lista.length} (última: ${progreso.ultima_url})`);
  // Resincroniza `hechas` con el índice real (ver el comentario de `indiceDeReanudacion`): si la
  // lista se deduplicó después de guardar el cursor, el `hechas` cargado de `params.progreso` puede
  // no corresponder más a ningún índice válido de esta lista.
  if (progreso.hechas !== indiceInicio) {
    log.aviso(`catalogar ${trabajo.id}: cursor desincronizado (hechas=${progreso.hechas}, índice real=${indiceInicio} de ${lista.length}); se resincroniza`);
    progreso.hechas = indiceInicio;
  }

  let relevantes = 0;
  let conAfirmaciones = 0;
  let totalAfirmaciones = 0;
  let omitidas = 0;
  let descartadasCita = 0;
  let tokensEntrada = 0;
  let tokensSalida = 0;
  let segundosApi = 0;
  let tokensPensamiento = 0;
  let tokensCacheLeidos = 0;
  let tokensCacheCreados = 0;
  const t0 = Date.now();

  const persistirProgreso = (): void => {
    trabajo.params = { ...params, progreso };
    moverTrabajo(trabajo, 'en_curso', { params: trabajo.params });
  };

  for (let i = indiceInicio; i < lista.length && !ctx.detener(); i += tamanoLote) {
    const tramo = lista.slice(i, i + tamanoLote);

    // 1. Bajar cada URL del tramo (una por una: es red, no lo que agrupa el modo lote).
    const descargas: Descarga[] = [];
    for (const url of tramo) {
      if (ctx.detener()) break;
      try {
        const { nota } = await obtenerNota(url, { sinArchivo: true, sinHaiku: true });
        descargas.push({ url, nota });
      } catch (e) {
        const motivo = (e as Error).message?.slice(0, 500) ?? String(e);
        descargas.push({ url, motivo });
        progreso.errores.push({ url, motivo });
        log.aviso(`catalogar: fallo al bajar ${url}: ${motivo}`);
      }
    }

    // 2. Pasada 1, en lote, solo sobre lo que de verdad necesita catalogarse (versión vieja o
    // sin catálogo). Lo ya catalogado con la versión vigente no vuelve a pasar por Haiku.
    const aCatalogar = descargas.filter((d): d is Descarga & { nota: Nota } => Boolean(d.nota) && necesitaCatalogar(d.nota!, { todas: forzarTodas }));
    omitidas += descargas.length - aCatalogar.length - descargas.filter((d) => d.motivo).length;
    for (const grupo of armarLotes(aCatalogar.map((d) => ({ id: d.nota.id, texto: d.nota.texto, url: d.url })), { tamano: tamanoLote })) {
      try {
        const resultados = grupo.length > 1 ? await ejecutarEtiquetadoLoteConClaude(grupo.map((n) => n.id)) : [await ejecutarEtiquetadoConClaude(grupo[0].id)];
        for (const r1 of resultados) {
          tokensEntrada += r1.tokens_entrada;
          tokensSalida += r1.tokens_salida;
          segundosApi += r1.segundos_api;
          tokensPensamiento += r1.tokens_pensamiento;
          tokensCacheLeidos += r1.tokens_cache_leidos;
          tokensCacheCreados += r1.tokens_cache_creados;
        }
      } catch (e) {
        const motivo = `pasada 1: ${(e as Error).message?.slice(0, 500) ?? String(e)}`;
        for (const n of grupo) {
          progreso.errores.push({ url: n.url, motivo });
          log.aviso(`catalogar: fallo en la pasada 1 de ${n.url}: ${motivo}`);
        }
      }
    }

    // 3. Pasada 2, de a una: cada extracción depende de la relevancia propia de esa nota.
    for (const d of descargas) {
      if (!d.nota) continue;
      const catalogo = leerNota(d.nota.id)?.catalogo;
      if (!tieneRelevanciaAlta(catalogo?.relevancia)) continue;
      relevantes++;
      if (!catalogo?.tiene_afirmaciones) continue;
      try {
        const r2 = await ejecutarExtraccionConClaude(d.nota.id, { forzar: forzarTodas });
        tokensEntrada += r2.tokens_entrada;
        tokensSalida += r2.tokens_salida;
        segundosApi += r2.segundos_api;
        tokensPensamiento += r2.tokens_pensamiento;
        tokensCacheLeidos += r2.tokens_cache_leidos;
        tokensCacheCreados += r2.tokens_cache_creados;
        descartadasCita += r2.descartadas;
        if (r2.afirmaciones > 0) {
          conAfirmaciones++;
          totalAfirmaciones += r2.afirmaciones;
        }
      } catch (e) {
        const motivo = `pasada 2: ${(e as Error).message?.slice(0, 500) ?? String(e)}`;
        progreso.errores.push({ url: d.url, motivo });
        log.aviso(`catalogar: fallo en la pasada 2 de ${d.url}: ${motivo}`);
      }
    }

    // 4. Avanzar el cursor por el tramo entero y persistirlo: una caída repite como mucho un tramo.
    // El tope a `lista.length` es la misma red que la resincronización de arriba: `hechas` nunca
    // debería poder superar el largo de la lista vigente, pase lo que pase con el cursor guardado.
    for (const url of tramo) {
      progreso.hechas = Math.min(progreso.hechas + 1, lista.length);
      progreso.ultima_url = url;
    }
    persistirProgreso();

    // Línea de rendimiento al cerrar cada tramo (docs/plan-catalogo.md, "Rendimiento"): s/nota de
    // reloj, s/nota de API y tokens de pensamiento por nota, acumulados en lo que va de esta
    // corrida del trabajo (no de `progreso.hechas`, que incluye lo hecho antes de reanudar).
    const hechasHastaAhora = progreso.hechas - indiceInicio;
    if (hechasHastaAhora > 0) {
      const segRelojPorNota = (Date.now() - t0) / 1000 / hechasHastaAhora;
      const segApiPorNota = segundosApi / hechasHastaAhora;
      const tokensPensamientoPorNota = tokensPensamiento / hechasHastaAhora;
      log.info(
        `catalogar ${trabajo.id}: tramo cerrado, ${progreso.hechas}/${lista.length} · ${segRelojPorNota.toFixed(1)} s/nota (reloj) · ${segApiPorNota.toFixed(1)} s/nota (API) · ${tokensPensamientoPorNota.toFixed(0)} tokens de pensamiento/nota`,
      );
    }
  }

  const segundosTotales = (Date.now() - t0) / 1000;
  // Cuántas notas tocó ESTA corrida del trabajo (no el total acumulado en `progreso.hechas`, que
  // incluye lo que ya se había hecho antes de reanudar): es la base de segundos/tokens por nota.
  const hechasEnEstaCorrida = progreso.hechas - indiceInicio;

  const resultado: ResultadoCatalogar = {
    medio: params.medio,
    urls: lista.length,
    catalogadas: progreso.hechas,
    omitidas_ya_catalogadas: omitidas,
    relevancia_central_o_secundaria: relevantes,
    con_afirmaciones: conAfirmaciones,
    afirmaciones: totalAfirmaciones,
    descartadas_cita: descartadasCita,
    errores: progreso.errores.length,
    segundos: segundosTotales,
    tokens_entrada: tokensEntrada,
    tokens_salida: tokensSalida,
  };

  if (hechasEnEstaCorrida > 0) {
    registrarRendimiento({
      trabajo: trabajo.id,
      medio: params.medio ?? null,
      desde: params.desde ?? null,
      hasta: params.hasta ?? null,
      notas: hechasEnEstaCorrida,
      segundos_por_nota: segundosTotales / hechasEnEstaCorrida,
      tokens_entrada_por_nota: tokensEntrada / hechasEnEstaCorrida,
      tokens_salida_por_nota: tokensSalida / hechasEnEstaCorrida,
      segundos_api_por_nota: segundosApi / hechasEnEstaCorrida,
      tokens_pensamiento_por_nota: tokensPensamiento / hechasEnEstaCorrida,
      tokens_cache_leidos_por_nota: tokensCacheLeidos / hechasEnEstaCorrida,
      tokens_cache_creados_por_nota: tokensCacheCreados / hechasEnEstaCorrida,
      pensamiento: envSinPensamiento().MAX_THINKING_TOKENS ?? '0',
      modo_lote: tamanoLote > 1,
      trabajadores: 1,
      fecha: new Date().toISOString(),
    });
  }
  return resultado;
}
