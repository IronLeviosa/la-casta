/**
 * Precarga del corpus (plan 2026-09, fase 3, ítem 3.3): baja al corpus, de noche y sin ningún
 * modelo, los registros primarios que la regla «corpus primero» necesita antes de cualquier
 * corrida: diarios de sesiones del Parlamento, conferencias/discursos/comunicados de Presidencia
 * e inventarios de documentos de las empresas. Tres tipos de trabajo nuevos para la cola
 * (`scripts/cola.ts`) y el worker (`scripts/worker.ts`):
 *
 *   - `precargar_diarios`      --camara crr|css|ag|cp --desde YYYY-MM [--hasta YYYY-MM]
 *   - `precargar_presidencia`  --desde YYYY-MM [--hasta YYYY-MM]
 *   - `precargar_inventario`   --dominio <dominio> | --empresa <slug>
 *
 * `pnpm corpus:precarga <tipo> [opciones]` encola (como `pnpm cola:agregar`); con `--una-vez`
 * corre el trabajo ahí mismo, sin cola, para probar.
 *
 * Los tres bajan documentos con `obtenerNota` (la misma función de `pnpm fuente`): lo que ya está
 * en el corpus no se vuelve a bajar, así que un trabajo cortado a la mitad (Ctrl+C, `maxTurns`,
 * el cron nocturno que corre una hora fija) se completa solo la próxima vez. La descarga masiva
 * respeta `robots.txt` (igual que `pnpm descubrir`), concurrencia 2 por host y pausa creciente
 * ante HTTP 429.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';
import { asegurarCorpus, RUTAS_CONTENIDO, RUTAS_CORPUS } from '../lib/rutas.ts';
import { idDeUrl } from '../lib/hash.ts';
import { canonicalizar, esYoutube, hostDe } from '../lib/url.ts';
import { ErrorHttp, USER_AGENT } from '../lib/http.ts';
import { descubrir, leerRobots, urlPermitida, type Robots } from '../lib/sitemaps.ts';
import { log, parsearArgs } from '../lib/log.ts';
import { agregarTrabajo, listarTrabajos } from '../cola.ts';
import { obtenerNota } from './fuente.ts';
import { cdx, construirInventario } from './inventario.ts';
import { idDeFuente, leerTranscripcion } from '../transcribir.ts';
import type { Nota } from './tipos.ts';

// ------------------------------------------------------------------------------------------
// 1. Diarios de sesiones (Hemeroteca Digital de la Biblioteca del Poder Legislativo)
//
// docs/fuentes-oficiales/parlamento.md describe la URL estable de cada diario y cómo se arma el
// inventario de un año: el timeline (JS) pide, al hacer clic en un año, un POST a
// `busquedalibreTimeLine/busquedaEdiciones` que devuelve un fragmento de HTML con una imagen de
// tapa por diario (`TapasD/sesiones<camara>/<nombre>.jpg`); `<nombre>` es también el nombre del
// PDF. Verificado a mano contra el sitio real el 2026-09-10 (la ruta corta
// `PublicacionesPeriodicas/busquedaEdiciones`, sin el segmento `busquedalibreTimeLine/`, devuelve
// un error de PHP: no es la misma página que usa el timeline).
// ------------------------------------------------------------------------------------------

export const CAMARAS = ['crr', 'css', 'ag', 'cp'] as const;
export type Camara = (typeof CAMARAS)[number];

export function esCamara(v: unknown): v is Camara {
  return typeof v === 'string' && (CAMARAS as readonly string[]).includes(v);
}

const RX_PERIODO = /^\d{4}-(0[1-9]|1[0-2])$/;

/** Valida "YYYY-MM"; lanza con el nombre de la opción para un mensaje de error legible. */
export function validarPeriodo(valor: string, nombre: string): string {
  if (!RX_PERIODO.test(valor)) throw new Error(`${nombre} debe ser YYYY-MM (recibido "${valor}")`);
  return valor;
}

/** Mes actual en formato "YYYY-MM": el `--hasta` por defecto de los tres trabajos. */
export function mesActualISO(ahora: Date = new Date()): string {
  return `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}`;
}

export function baseHemeroteca(camara: Camara): string {
  return `https://biblioteca.parlamento.gub.uy/Publicaciones/sesiones${camara}/`;
}

/** URL estable del PDF de un diario, tal como la cita `docs/fuentes-oficiales/parlamento.md`. */
export function urlDiario(camara: Camara, nombre: string): string {
  return `${baseHemeroteca(camara)}${encodeURIComponent(nombre)}.pdf`;
}

/** Cuerpo del POST que arma el índice de un año (mismo formato que envía el timeline). */
export function parametrosIndiceAnio(anio: number): Record<string, string> {
  return { publicacion: '', anioInicio: String(anio), anioFin: '0', grupoEdicion: 'ds', porSlide: '6' };
}

/** Años que hay que consultar para cubrir un período "YYYY-MM" a "YYYY-MM" (el índice es por año). */
export function añosDelPeriodo(desde: string, hasta: string): number[] {
  validarPeriodo(desde, '--desde');
  validarPeriodo(hasta, '--hasta');
  // Comparación por string "YYYY-MM" (no solo por año): "2026-06" a "2026-01" está invertido
  // aunque los dos caigan en el mismo año, y el índice por año no lo detectaría solo.
  if (hasta < desde) throw new Error(`--hasta (${hasta}) es anterior a --desde (${desde})`);
  const anioDesde = Number(desde.slice(0, 4));
  const anioHasta = Number(hasta.slice(0, 4));
  const anios: number[] = [];
  for (let a = anioDesde; a <= anioHasta; a++) anios.push(a);
  return anios;
}

export interface EntradaDiario {
  camara: Camara;
  /** Nombre del diario tal como lo nombra la Hemeroteca, sin extensión (arranca con la fecha). */
  nombre: string;
  /** YYYY-MM-DD, tomada del propio nombre. */
  fecha: string;
}

/**
 * Extrae los diarios de una cámara del HTML que devuelve `busquedaEdiciones` para un año
 * (mezcla las cuatro cámaras: el filtro es la propia expresión regular). Ignora nombres sin fecha
 * reconocible al principio (no se puede ubicar en el tiempo) y deduplica por nombre.
 */
export function parsearIndiceHemeroteca(html: string, camara: Camara): EntradaDiario[] {
  const patron = new RegExp(`TapasD/sesiones${camara}/([^"]+?)\\.jpg`, 'g');
  const vistos = new Map<string, EntradaDiario>();
  for (const m of html.matchAll(patron)) {
    const nombre = m[1].replace(/&amp;/g, '&');
    const fm = /^(\d{4}-\d{2}-\d{2})/.exec(nombre);
    if (!fm) continue;
    vistos.set(nombre, { camara, nombre, fecha: fm[1] });
  }
  return [...vistos.values()].sort((a, b) => a.fecha.localeCompare(b.fecha) || a.nombre.localeCompare(b.nombre));
}

/** Se queda con los diarios cuyo mes cae dentro de [desde, hasta] (ambos "YYYY-MM", inclusive). */
export function filtrarPorMes(entradas: EntradaDiario[], desde: string, hasta: string): EntradaDiario[] {
  validarPeriodo(desde, '--desde');
  validarPeriodo(hasta, '--hasta');
  return entradas.filter((e) => {
    const mes = e.fecha.slice(0, 7);
    return mes >= desde && mes <= hasta;
  });
}

/** Filtra por período y arma la URL estable de cada diario: la "enumeración" que prueban los tests. */
export function urlsDelPeriodo(entradas: EntradaDiario[], desde: string, hasta: string): string[] {
  return filtrarPorMes(entradas, desde, hasta).map((e) => urlDiario(e.camara, e.nombre));
}

const URL_BUSQUEDA_EDICIONES = 'https://biblioteca.parlamento.gub.uy/PublicacionesPeriodicas/busquedalibreTimeLine/busquedaEdiciones';

/** Pide el índice de un año a la Hemeroteca; un reintento ante 5xx/429, como hace `lib/http.ts`. */
async function pedirIndiceAnio(anio: number, timeoutMs = 60_000): Promise<string> {
  for (let intento = 0; intento < 2; intento++) {
    const control = new AbortController();
    const t = setTimeout(() => control.abort(), timeoutMs);
    try {
      const r = await fetch(URL_BUSQUEDA_EDICIONES, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'X-Requested-With': 'XMLHttpRequest', 'User-Agent': USER_AGENT },
        body: new URLSearchParams(parametrosIndiceAnio(anio)).toString(),
        signal: control.signal,
      });
      if ((r.status >= 500 || r.status === 429) && intento === 0) {
        await new Promise((res) => setTimeout(res, 2000));
        continue;
      }
      if (!r.ok) throw new ErrorHttp(URL_BUSQUEDA_EDICIONES, r.status, `índice de la Hemeroteca (${anio}) respondió HTTP ${r.status}`);
      return await r.text();
    } finally {
      clearTimeout(t);
    }
  }
  throw new Error(`índice de la Hemeroteca (${anio}): sin respuesta útil tras reintentar`);
}

/** Enumera los diarios de una cámara en un período, consultando el índice de cada año que toca. */
export async function enumerarDiariosDelPeriodo(camara: Camara, desde: string, hasta: string): Promise<EntradaDiario[]> {
  const anios = añosDelPeriodo(desde, hasta);
  const todas: EntradaDiario[] = [];
  for (const anio of anios) {
    const html = await pedirIndiceAnio(anio);
    todas.push(...parsearIndiceHemeroteca(html, camara));
  }
  return todas;
}

// ------------------------------------------------------------------------------------------
// 2. Qué del listado ya está en el corpus (compartido por los tres trabajos)
// ------------------------------------------------------------------------------------------

export interface ResultadoFaltantes {
  faltantes: string[];
  presentes: string[];
}

/** Existe una nota para `id` en `${CORPUS_DIR}/notas/<id>.json`. Único punto que toca disco. */
export function notaExisteEnCorpus(id: string): boolean {
  return existsSync(join(RUTAS_CORPUS.notas, `${id}.json`));
}

/**
 * Separa una lista de URLs en las que ya están en el corpus y las que faltan, sin red: `estaEnCorpus`
 * es una función inyectada (en producción, `notaExisteEnCorpus`) para que la prueba no toque disco.
 */
export function faltantesEnCorpus(urls: string[], estaEnCorpus: (id: string) => boolean): ResultadoFaltantes {
  const faltantes: string[] = [];
  const presentes: string[] = [];
  for (const url of urls) (estaEnCorpus(idDeUrl(url)) ? presentes : faltantes).push(url);
  return { faltantes, presentes };
}

// ------------------------------------------------------------------------------------------
// 3. Motor de descarga compartido: concurrencia 2 por host, pausa creciente ante 429,
//    respeta robots.txt, reanudable (usa `obtenerNota`, que no vuelve a bajar lo que ya está).
// ------------------------------------------------------------------------------------------

export interface ResultadoPrecarga {
  enumerados: number;
  bajados: number;
  ya_estaban: number;
  fallidos: number;
  errores: { url: string; motivo: string }[];
}

const CONCURRENCIA_POR_HOST = 2;
const PAUSA_429_INICIAL_MS = 2000;
const PAUSA_429_MAXIMA_MS = 60_000;
const INTENTOS_429 = 5;

export interface OpcionesPrecargaDocumentos {
  sinArchivo?: boolean;
  sinHaiku?: boolean;
  detener?: () => boolean;
  /** Se llama con cada nota nueva (no la que ya estaba) recién guardada en el corpus. */
  alBajar?: (nota: Nota, url: string) => void | Promise<void>;
}

async function bajarConReintentos(
  url: string,
  opciones: { sinArchivo?: boolean; sinHaiku?: boolean },
  pausaEstado: { ms: number },
): Promise<{ ok: true; nota: Nota; nueva: boolean } | { ok: false; motivo: string }> {
  for (let intento = 0; intento < INTENTOS_429; intento++) {
    try {
      const r = await obtenerNota(url, opciones);
      pausaEstado.ms = PAUSA_429_INICIAL_MS;
      return { ok: true, nota: r.nota, nueva: r.nueva };
    } catch (e) {
      const err = e as Error;
      const es429 = err instanceof ErrorHttp && err.estado === 429;
      if (!es429 || intento === INTENTOS_429 - 1) {
        return { ok: false, motivo: err instanceof ErrorHttp ? `HTTP ${err.estado}` : err.message };
      }
      log.aviso(`429 al bajar ${url}; pauso ${pausaEstado.ms / 1000}s (intento ${intento + 1}/${INTENTOS_429})`);
      await new Promise((res) => setTimeout(res, pausaEstado.ms));
      pausaEstado.ms = Math.min(pausaEstado.ms * 2, PAUSA_429_MAXIMA_MS);
    }
  }
  return { ok: false, motivo: 'no se pudo bajar (429 persistente)' };
}

/**
 * Baja las URLs que todavía no están en el corpus (`faltantesEnCorpus` decide cuáles), agrupadas
 * por host para no pasar de 2 en simultáneo por sitio; ante un 429 espera cada vez más antes de
 * seguir con ese host. Reanudable: lo que ya se bajó en una corrida anterior no se vuelve a pedir.
 */
export async function precargarDocumentos(urls: string[], opciones: OpcionesPrecargaDocumentos = {}): Promise<ResultadoPrecarga> {
  const unicas = [...new Set(urls)];
  const { faltantes, presentes } = faltantesEnCorpus(unicas, notaExisteEnCorpus);
  const resultado: ResultadoPrecarga = { enumerados: unicas.length, bajados: 0, ya_estaban: presentes.length, fallidos: 0, errores: [] };

  const porHost = new Map<string, string[]>();
  for (const url of faltantes) {
    const host = hostDe(url) || 'desconocido';
    if (!porHost.has(host)) porHost.set(host, []);
    porHost.get(host)!.push(url);
  }

  await Promise.all(
    [...porHost.entries()].map(async ([host, lista]) => {
      let robots: Robots;
      try {
        robots = await leerRobots(`https://${host}`);
      } catch {
        robots = { sitemaps: [], disallow: [] };
      }
      const pausaEstado = { ms: PAUSA_429_INICIAL_MS };
      let siguiente = 0;
      async function trabajador(): Promise<void> {
        while (siguiente < lista.length) {
          if (opciones.detener?.()) return;
          const url = lista[siguiente++];
          if (!urlPermitida(url, robots)) {
            resultado.fallidos++;
            resultado.errores.push({ url, motivo: 'bloqueado por robots.txt' });
            continue;
          }
          const r = await bajarConReintentos(url, { sinArchivo: opciones.sinArchivo, sinHaiku: opciones.sinHaiku }, pausaEstado);
          if (!r.ok) {
            resultado.fallidos++;
            resultado.errores.push({ url, motivo: r.motivo });
            log.aviso(`fallo ${url}: ${r.motivo}`);
            continue;
          }
          if (r.nueva) {
            resultado.bajados++;
            await opciones.alBajar?.(r.nota, url);
          } else {
            // No debería pasar (ya lo filtramos con faltantesEnCorpus), pero si dos corridas
            // pisan la misma URL a la vez, obtenerNota igual no vuelve a bajarla.
            resultado.ya_estaban++;
          }
        }
      }
      const n = Math.max(1, Math.min(CONCURRENCIA_POR_HOST, lista.length));
      await Promise.all(Array.from({ length: n }, () => trabajador()));
    }),
  );
  return resultado;
}

// ------------------------------------------------------------------------------------------
// 4. `precargar_diarios`
// ------------------------------------------------------------------------------------------

export interface ParamsPrecargarDiarios {
  camara: Camara;
  desde: string;
  hasta: string;
}

export function construirParamsDiarios(params: Record<string, unknown>): ParamsPrecargarDiarios {
  const camara = params.camara;
  if (!esCamara(camara)) throw new Error(`--camara debe ser uno de ${CAMARAS.join('|')} (recibido "${String(camara)}")`);
  const desde = typeof params.desde === 'string' ? params.desde : undefined;
  if (!desde) throw new Error('falta --desde YYYY-MM');
  const hasta = typeof params.hasta === 'string' && params.hasta ? params.hasta : mesActualISO();
  validarPeriodo(desde, '--desde');
  validarPeriodo(hasta, '--hasta');
  return { camara, desde, hasta };
}

/**
 * `precargar_diarios`: baja los diarios de sesiones nuevos de una cámara en un período. Sin
 * `--hasta`, hasta el mes actual — es el trabajo que corre cada mes para no quedarse en el
 * 13/05/2026 (última fecha con diario de Representantes en la Hemeroteca al armar este trabajo).
 */
export async function precargarDiarios(params: Record<string, unknown>, ctx: { detener?: () => boolean } = {}): Promise<ResultadoPrecarga> {
  const { camara, desde, hasta } = construirParamsDiarios(params);
  asegurarCorpus();
  log.info(`Hemeroteca (${camara}): enumerando diarios de ${desde} a ${hasta}`);
  const entradas = await enumerarDiariosDelPeriodo(camara, desde, hasta);
  const urls = urlsDelPeriodo(entradas, desde, hasta);
  log.info(`${urls.length} diario(s) de ${camara} en el período`);
  // Documentos oficiales estables: no hace falta pedirle a Wayback una copia en el momento.
  return precargarDocumentos(urls, { sinHaiku: true, sinArchivo: true, detener: ctx.detener });
}

// ------------------------------------------------------------------------------------------
// 5. `precargar_presidencia`
// ------------------------------------------------------------------------------------------

/**
 * Las tres secciones que `docs/colecciones/declaraciones.md` señala como fuente primaria de
 * Presidencia: `archivo.presidencia.gub.uy` (mandatos anteriores), `medios.presidencia.gub.uy`
 * (documentos y discursos) y `www.gub.uy/presidencia/comunicacion/noticias/` (mandato en curso).
 * `origen` es para `pnpm descubrir` (sitemap + robots.txt); `prefijoCdx` es lo que se le pasa a
 * `cdx()` de `inventario.ts` (admite un host con ruta, no solo un host, para acotar la consulta).
 */
const SECCIONES_PRESIDENCIA: { origen: string; prefijoCdx: string }[] = [
  { origen: 'https://medios.presidencia.gub.uy', prefijoCdx: 'medios.presidencia.gub.uy' },
  { origen: 'https://archivo.presidencia.gub.uy', prefijoCdx: 'archivo.presidencia.gub.uy' },
  { origen: 'https://www.gub.uy', prefijoCdx: 'www.gub.uy/presidencia/comunicacion/noticias' },
];

/**
 * Fecha "YYYY-MM" a partir de un tramo `/YYYY/MM/` en la ruta (así fechan sus URLs
 * `archivo.presidencia.gub.uy`, p. ej. `.../noticias/2005/06/2005060604.htm`). `null` si la URL
 * no trae fecha reconocible (las de `www.gub.uy/.../noticias/<slug>` no la traen: para esas el
 * período no se puede filtrar antes de bajar la nota, así que se enumeran igual).
 */
export function mesDeUrlPresidencia(url: string): string | null {
  let ruta: string;
  try {
    ruta = new URL(url).pathname;
  } catch {
    return null;
  }
  const m = /\/(\d{4})\/(\d{2})(?:\/|$)/.exec(ruta);
  if (!m) return null;
  const mes = Number(m[2]);
  if (mes < 1 || mes > 12) return null;
  return `${m[1]}-${m[2]}`;
}

/** true si `mes` cae en [desde, hasta], o si `mes` es `null` (no se pudo determinar por la URL). */
export function enPeriodoOIndeterminado(mes: string | null, desde: string, hasta: string): boolean {
  if (mes === null) return true;
  return mes >= desde && mes <= hasta;
}

/**
 * Enumera páginas candidatas de Presidencia en un período: primero `pnpm descubrir` (sitemap,
 * si el medio declara uno en robots.txt), y siempre además el CDX de Wayback (que hoy es lo que
 * de verdad tiene datos para estos tres sitios: ninguno declara sitemap en robots.txt).
 */
export async function enumerarPresidencia(desde: string, hasta: string): Promise<string[]> {
  validarPeriodo(desde, '--desde');
  validarPeriodo(hasta, '--hasta');
  const vistos = new Set<string>();
  for (const { origen, prefijoCdx } of SECCIONES_PRESIDENCIA) {
    try {
      const r = await descubrir(origen, { desde, hasta, limite: 3000 });
      for (const c of r.candidatas) vistos.add(c.url);
    } catch (e) {
      log.debug(`descubrir falló en ${origen}: ${(e as Error).message}`);
    }
    try {
      const capturas = await cdx(prefijoCdx, 'text/html');
      for (const c of capturas) {
        if (c.estado !== '200' && c.estado !== '-') continue;
        if (!enPeriodoOIndeterminado(mesDeUrlPresidencia(c.url), desde, hasta)) continue;
        vistos.add(c.url);
      }
    } catch (e) {
      log.debug(`CDX falló en ${prefijoCdx}: ${(e as Error).message}`);
    }
  }
  return [...vistos];
}

/**
 * Enlaces a YouTube en un HTML (href o src, para agarrar también los `<iframe>` embebidos).
 * No hay forma de confirmar el canal (`@PresidenciaUruguay-b2s`) sin otra llamada a la API de
 * YouTube; en la práctica un enlace a YouTube dentro de una página de Presidencia es su propio
 * stream, así que no hace falta: el llamador ya acotó la búsqueda a las páginas de Presidencia.
 */
export function extraerEnlacesYoutube(html: string): string[] {
  const urls = new Set<string>();
  const patron = /(?:href|src)=["']([^"']*(?:youtube\.com|youtu\.be)[^"']*)["']/gi;
  for (const m of html.matchAll(patron)) {
    let url = m[1].replace(/&amp;/g, '&');
    if (url.startsWith('//')) url = 'https:' + url;
    if (!/^https?:\/\//i.test(url)) continue;
    if (esYoutube(url) || /youtube\.com\/(embed|channel|@)/i.test(url)) {
      try {
        urls.add(canonicalizar(url));
      } catch {
        /* URL invalida: se ignora */
      }
    }
  }
  return [...urls];
}

/** Lee el HTML crudo (gz) que `obtenerNota` guardó para una nota y saca sus enlaces a YouTube. */
function enlacesYoutubeDeNota(id: string): string[] {
  const ruta = join(RUTAS_CORPUS.notas, `${id}.html.gz`);
  if (!existsSync(ruta)) return [];
  try {
    return extraerEnlacesYoutube(gunzipSync(readFileSync(ruta)).toString('utf8'));
  } catch {
    return [];
  }
}

/** No hay ya una transcripción ni un trabajo `transcribir` pendiente/en curso para esa URL. */
function faltaEncolarTranscripcion(url: string): boolean {
  if (leerTranscripcion(idDeFuente(url))) return false;
  const enCola = [...listarTrabajos('pendiente'), ...listarTrabajos('en_curso')];
  return !enCola.some((t) => t.tipo === 'transcribir' && (t.params.url === url || t.params.archivo === url));
}

export interface ResultadoPrecargaPresidencia extends ResultadoPrecarga {
  transcribir_encolados: number;
}

export interface ParamsPrecargarPresidencia {
  desde: string;
  hasta: string;
}

export function construirParamsPresidencia(params: Record<string, unknown>): ParamsPrecargarPresidencia {
  const desde = typeof params.desde === 'string' ? params.desde : undefined;
  if (!desde) throw new Error('falta --desde YYYY-MM');
  const hasta = typeof params.hasta === 'string' && params.hasta ? params.hasta : mesActualISO();
  validarPeriodo(desde, '--desde');
  validarPeriodo(hasta, '--hasta');
  return { desde, hasta };
}

/**
 * `precargar_presidencia`: baja conferencias, discursos y comunicados de Presidencia en un
 * período, y encola un trabajo `transcribir` por cada stream de YouTube que encuentre enlazado
 * en las páginas nuevas.
 */
export async function precargarPresidencia(
  params: Record<string, unknown>,
  ctx: { detener?: () => boolean } = {},
): Promise<ResultadoPrecargaPresidencia> {
  const { desde, hasta } = construirParamsPresidencia(params);
  asegurarCorpus();
  log.info(`Presidencia: enumerando conferencias, discursos y comunicados de ${desde} a ${hasta}`);
  const urls = await enumerarPresidencia(desde, hasta);
  log.info(`${urls.length} página(s) candidata(s) de Presidencia`);
  let encolados = 0;
  const resultado = await precargarDocumentos(urls, {
    sinHaiku: true,
    sinArchivo: true,
    detener: ctx.detener,
    alBajar: (nota) => {
      if (nota.tipo !== 'html') return;
      for (const link of enlacesYoutubeDeNota(nota.id)) {
        if (!faltaEncolarTranscripcion(link)) continue;
        agregarTrabajo('transcribir', { url: link });
        encolados++;
      }
    },
  });
  return { ...resultado, transcribir_encolados: encolados };
}

// ------------------------------------------------------------------------------------------
// 6. `precargar_inventario`
// ------------------------------------------------------------------------------------------

/**
 * Dominios del medio de una empresa: busca en `content/medios/*.yaml` el (o los) archivo(s) con
 * `empresa: <slug>` y junta `url` + `dominios`. Es la misma convención que usa `slugDeMedio` en
 * `fuente.ts`, leída acá de nuevo para no tocar ese archivo.
 */
export function dominiosDeEmpresa(slug: string, carpetaMedios: string = RUTAS_CONTENIDO.medios): string[] {
  const dominios = new Set<string>();
  if (!existsSync(carpetaMedios)) return [];
  for (const f of readdirSync(carpetaMedios)) {
    if (!/\.ya?ml$/i.test(f)) continue;
    let d: Record<string, unknown> | null;
    try {
      d = parseYaml(readFileSync(join(carpetaMedios, f), 'utf8')) as Record<string, unknown>;
    } catch {
      continue;
    }
    if (!d || typeof d !== 'object' || d.empresa !== slug) continue;
    const candidatos = [d.url, ...(Array.isArray(d.dominios) ? d.dominios : [])].filter((x): x is string => typeof x === 'string');
    for (const c of candidatos) {
      const host = hostDe(c.includes('://') ? c : `https://${c}`);
      if (host) dominios.add(host);
    }
  }
  return [...dominios];
}

/** Quita esquema, `www.` y ruta de un dominio suelto (misma normalización que `pnpm inventario`). */
function normalizarDominio(v: string): string {
  return v.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '');
}

export function construirParamsInventario(params: Record<string, unknown>): string[] {
  const dominio = typeof params.dominio === 'string' ? params.dominio : undefined;
  const empresa = typeof params.empresa === 'string' ? params.empresa : undefined;
  if (!dominio && !empresa) throw new Error('falta --dominio <dominio> o --empresa <slug>');
  const dominios = dominio ? [normalizarDominio(dominio)] : dominiosDeEmpresa(empresa!);
  if (!dominios.length) {
    throw new Error(empresa ? `no encontré dominios para la empresa "${empresa}" en content/medios/` : `dominio inválido: "${dominio}"`);
  }
  return dominios;
}

/**
 * `precargar_inventario`: corre el inventario CDX+sitemap de `inventario.ts` sobre los dominios
 * de una empresa (o uno dado a mano) y baja al corpus los PDF y planillas nuevos.
 */
export async function precargarInventario(params: Record<string, unknown>, ctx: { detener?: () => boolean } = {}): Promise<ResultadoPrecarga> {
  const dominios = construirParamsInventario(params);
  asegurarCorpus();
  log.info(`Inventario de ${dominios.join(', ')}: PDF y planillas`);
  const urls = new Set<string>();
  for (const dominio of dominios) {
    if (ctx.detener?.()) break;
    try {
      const { lista } = await construirInventario(dominio);
      for (const d of lista) urls.add(d.url);
    } catch (e) {
      log.aviso(`inventario de ${dominio} falló: ${(e as Error).message}`);
    }
  }
  log.info(`${urls.size} documento(s) candidato(s)`);
  return precargarDocumentos([...urls], { sinHaiku: true, sinArchivo: true, detener: ctx.detener });
}

// ------------------------------------------------------------------------------------------
// 7. CLI: `pnpm corpus:precarga <tipo> [opciones] [--una-vez]`
// ------------------------------------------------------------------------------------------

const TIPOS_PRECARGA = ['precargar_diarios', 'precargar_presidencia', 'precargar_inventario'] as const;
type TipoPrecarga = (typeof TIPOS_PRECARGA)[number];

function esTipoPrecarga(v: string): v is TipoPrecarga {
  return (TIPOS_PRECARGA as readonly string[]).includes(v);
}

async function ejecutarTipo(tipo: TipoPrecarga, params: Record<string, unknown>, ctx: { detener?: () => boolean }): Promise<unknown> {
  if (tipo === 'precargar_diarios') return precargarDiarios(params, ctx);
  if (tipo === 'precargar_presidencia') return precargarPresidencia(params, ctx);
  return precargarInventario(params, ctx);
}

const USO =
  'Uso: pnpm corpus:precarga <tipo> [opciones] [--una-vez] [--json]\n' +
  '  precargar_diarios      --camara crr|css|ag|cp --desde YYYY-MM [--hasta YYYY-MM]\n' +
  '  precargar_presidencia  --desde YYYY-MM [--hasta YYYY-MM]\n' +
  '  precargar_inventario   --dominio <dominio> | --empresa <slug>\n\n' +
  'Sin --una-vez, encola el trabajo (como `pnpm cola:agregar`) para que lo corra `pnpm worker`.\n' +
  'Con --una-vez lo corre en el momento, sin cola: sirve para probar.\n';

async function main(): Promise<void> {
  const { posicionales, opciones } = parsearArgs(process.argv.slice(2));
  const tipo = posicionales[0];
  if (!tipo || !esTipoPrecarga(tipo)) {
    process.stderr.write(USO);
    process.exit(2);
  }
  const params: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(opciones)) if (k !== 'json' && k !== 'una-vez') params[k] = v;

  if (!opciones['una-vez']) {
    const t = agregarTrabajo(tipo, params);
    log.ok(`trabajo ${t.id} (${t.tipo}) encolado`);
    log.info('recorda hacer `pnpm corpus:sync` para que lo vea el worker de la otra maquina');
    if (opciones.json) process.stdout.write(JSON.stringify(t) + '\n');
    return;
  }

  let detenido = false;
  const manejar = () => {
    detenido = true;
    log.aviso('corto: termino lo que esté en curso y salgo');
  };
  process.on('SIGINT', manejar);
  process.on('SIGTERM', manejar);

  const inicio = Date.now();
  const resultado = await ejecutarTipo(tipo, params, { detener: () => detenido });
  const seg = ((Date.now() - inicio) / 1000).toFixed(1);
  log.ok(`${tipo} en ${seg}s`);
  process.stdout.write(JSON.stringify(resultado, null, 1) + '\n');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    log.error((e as Error).message);
    process.exit(1);
  });
}
