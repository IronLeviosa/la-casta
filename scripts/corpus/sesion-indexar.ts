/**
 * pnpm sesion:indexar [--camara CS|CR|AG|CP] [--limite n] [--reintentar] [--concurrencia n]
 *
 * Arma `data/diarios-archive.json` (docs/plan-indice-diarios.md): un índice fecha → ítem de la
 * colección `uruguay-diario-sesiones` de archive.org (5.009 ítems), que `pnpm sesion` (sesion.ts)
 * consulta para no tener que pedir --tomo/--numero/--legislador a mano. El ítem de archive.org no
 * trae la fecha en sus metadatos, solo tomo y número: hay que leer la cabecera del OCR de cada uno.
 *
 * 1. Lista la colección entera con la API de búsqueda (una sola llamada) y parsea cámara, tomo,
 *    número y sufijo del identificador con `parsearIdentificadorArchive`.
 * 2. Carga el índice anterior si existe. Incremental: un ítem ya `fechado` nunca se reprocesa; uno
 *    `sin_ocr` se reintenta siempre (fue un fallo de red); uno `sin_fecha` solo con --reintentar
 *    (es el parser, no la red) — ver `identificadoresPendientes`.
 * 3. Por cada ítem pendiente, `Range: bytes=0-2999` del OCR (`<id>_djvu.txt`), con concurrencia y
 *    reintentos propios: un 404 es `sin_ocr` sin reintento; un 429/5xx o un fallo de red reintenta
 *    con espera 2 s, 8 s, 30 s. La fecha sale de `recortarCabecera` + `fechasDeCabecera`
 *    (scripts/corpus/sesion.ts): las mismas funciones que verifica cada candidato antes de citarlo.
 * 4. Escribe el índice cada 200 ítems y al final, para que una corrida cortada no pierda lo hecho.
 *
 * No usa `fetchWayback` (scripts/lib/wayback.ts) para las 5.009 lecturas de cabecera: ese helper
 * limita la concurrencia global del proceso a 2 pedidos en vuelo, y acá el plan pide concurrencia
 * configurable (3 por omisión) con esperas propias de 2 s/8 s/30 s. La protección contra 429 sigue
 * ahí (concurrencia acotada + backoff creciente), solo que con los parámetros que pide este script
 * en vez de los fijos de `fetchWayback`. Sí se usa para la única llamada a la API de búsqueda.
 *
 * Costo: 5.009 GET de ~3 KB. A 3 concurrentes y ~1 s cada uno, 30 a 40 minutos de red, cero tokens.
 * `--limite n` para probar antes de la corrida completa. Nada se baja entero: ni PDF ni OCR completo.
 */
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fetchConTimeout } from '../lib/http.ts';
import { fetchWayback } from '../lib/wayback.ts';
import { log, parsearArgs } from '../lib/log.ts';
import {
  calcularResumen,
  escribirIndice,
  leerIndice,
  RUTA_INDICE,
  type CamaraArchive,
  type ItemArchive,
  type ItemIndice,
} from '../lib/indice-diarios.ts';
import { fechasDeCabecera, RANGO_CABECERA, recortarCabecera } from './sesion.ts';

const CAMARAS: CamaraArchive[] = ['CS', 'CR', 'AG', 'CP'];

/**
 * Cámara, tomo, número y sufijo de un identificador de la colección `uruguay-diario-sesiones`:
 * `UruguayDiarioSesiones_CS_390_263` → `{camara: 'CS', tomo: 390, numero: 263}`;
 * `UruguayDiarioSesiones_CR_3692` → `{camara: 'CR', numero: 3692}` (Representantes nunca lleva
 * tomo); `UruguayDiarioSesiones_CP_025_003_3` → con `sufijo: 3`. `null` si no matchea ningún
 * patrón de número(s) (avisa quien llama, no acá).
 *
 * CS, AG y CP normalmente llevan tomo (dos números) y a veces un sufijo (tres números), pero no
 * siempre: verificado 2026-09-16 contra la API de búsqueda real, 6 de los primeros 50 ítems son
 * `UruguayDiarioSesiones_AG_<numero>` (un solo número, como CR) o `UruguayDiarioSesiones_CS_<tomo>_
 * <numero>_<sufijo>` (tres números). El plan (docs/plan-indice-diarios.md §1) asumía siempre dos
 * números para esas tres cámaras; se ajusta acá con lo que la colección real trae.
 */
export function parsearIdentificadorArchive(id: string): ItemArchive | null {
  const m = id.match(/^UruguayDiarioSesiones_(CS|CR|AG|CP)_(\d+)(?:_(\d+))?(?:_(\d+))?$/);
  if (!m) return null;
  const camara = m[1] as CamaraArchive;
  const numeros = [m[2], m[3], m[4]].filter((x): x is string => x !== undefined).map(Number);

  if (camara === 'CR') {
    // Representantes nunca lleva tomo (docs/fuentes-oficiales/parlamento.md §2.1): un identificador
    // con más de un número no matchea el patrón conocido de esta cámara.
    return numeros.length === 1 ? { camara, numero: numeros[0] } : null;
  }
  if (numeros.length === 1) return { camara, numero: numeros[0] };
  if (numeros.length === 2) return { camara, tomo: numeros[0], numero: numeros[1] };
  return { camara, tomo: numeros[0], numero: numeros[1], sufijo: numeros[2] };
}

/**
 * Qué identificadores de `identificadores` hay que (re)procesar contra el índice `anterior`: los
 * que no están todavía, los `sin_ocr` (fallo de red, se reintenta siempre) y, solo con
 * `--reintentar`, los `sin_fecha` (el parser no reconoció la fecha, no es un fallo transitorio).
 * Un `fechado` nunca se reprocesa. Pura, para testear la fusión incremental sin red.
 */
export function identificadoresPendientes(
  identificadores: string[],
  anterior: Record<string, ItemIndice>,
  opciones: { reintentar?: boolean } = {},
): string[] {
  const pendientes: string[] = [];
  for (const id of identificadores) {
    const previo = anterior[id];
    if (!previo) pendientes.push(id);
    else if (previo.estado === 'sin_ocr') pendientes.push(id);
    else if (previo.estado === 'sin_fecha' && opciones.reintentar) pendientes.push(id);
  }
  return pendientes;
}

const URL_BUSQUEDA =
  'https://archive.org/advancedsearch.php?q=identifier:UruguayDiarioSesiones_*&fl[]=identifier&rows=10000&output=json';

interface RespuestaBusqueda {
  response?: { numFound?: number; docs?: { identifier: string }[] };
}

/** Identificadores de toda la colección, con una sola llamada a la API de búsqueda de archive.org. */
async function listarColeccion(): Promise<string[]> {
  const r = await fetchWayback(URL_BUSQUEDA, { timeoutMs: 60_000 });
  if (!r.ok) throw new Error(`archive.org advancedsearch respondió HTTP ${r.status}`);
  const datos = (await r.json()) as RespuestaBusqueda;
  return (datos.response?.docs ?? []).map((d) => d.identifier).filter(Boolean);
}

function esperar(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

const ESPERAS_MS = [2_000, 8_000, 30_000];

/**
 * Los primeros ~3.000 bytes del OCR de un ítem, con reintentos propios (2 s, 8 s, 30 s) ante
 * 429/5xx o fallo de red. Un 404 es `sin_ocr` sin reintento: el archivo no existe, no es transitorio.
 */
async function descargarCabecera(id: string): Promise<{ ok: true; texto: string } | { ok: false }> {
  const url = `https://archive.org/download/${id}/${id}_djvu.txt`;
  for (let intento = 0; intento <= ESPERAS_MS.length; intento++) {
    try {
      const r = await fetchConTimeout(url, { timeoutMs: 20_000, headers: { Range: RANGO_CABECERA }, reintentos: 0 });
      if (r.ok) return { ok: true, texto: await r.text() };
      if (r.status === 404) return { ok: false };
      if ((r.status === 429 || r.status >= 500) && intento < ESPERAS_MS.length) {
        log.debug(`archive.org HTTP ${r.status} en ${id}, reintento en ${ESPERAS_MS[intento]}ms`);
        await esperar(ESPERAS_MS[intento]);
        continue;
      }
      return { ok: false };
    } catch (e) {
      if (intento < ESPERAS_MS.length) {
        log.debug(`fallo de red leyendo ${id}: ${(e as Error).message}, reintento en ${ESPERAS_MS[intento]}ms`);
        await esperar(ESPERAS_MS[intento]);
        continue;
      }
      return { ok: false };
    }
  }
  return { ok: false };
}

/** Primeros 120 caracteres de la cabecera recortada, espacios colapsados: lo que un humano lee sin abrir archive.org. */
function cabeceraCorta(texto: string): string {
  return texto.replace(/\s+/g, ' ').trim().slice(0, 120);
}

/** Pool de `limite` trabajadores tomando de `items` en orden. No devuelve nada: `tarea` muta el acumulador que le pase quien llama. */
async function conConcurrencia<T>(items: T[], limite: number, tarea: (item: T) => Promise<void>): Promise<void> {
  let cursor = 0;
  async function trabajador(): Promise<void> {
    while (cursor < items.length) {
      const item = items[cursor++];
      await tarea(item);
    }
  }
  await Promise.all(Array.from({ length: Math.max(1, Math.min(limite, items.length)) }, trabajador));
}

function contarEstados(items: Record<string, ItemIndice>): { fechados: number; sinFecha: number; sinOcr: number } {
  let fechados = 0;
  let sinFecha = 0;
  let sinOcr = 0;
  for (const item of Object.values(items)) {
    if (item.estado === 'fechado') fechados++;
    else if (item.estado === 'sin_fecha') sinFecha++;
    else sinOcr++;
  }
  return { fechados, sinFecha, sinOcr };
}

const USO =
  'Uso: pnpm sesion:indexar [--camara CS|CR|AG|CP] [--limite n] [--reintentar] [--concurrencia n]\n' +
  '  --camara: solo esa cámara (por omisión, las cuatro).\n' +
  '  --limite n: procesa como mucho n ítems pendientes (para probar antes de la corrida completa).\n' +
  '  --reintentar: reprocesa también los `sin_fecha` (por omisión solo los nuevos y los `sin_ocr`).\n' +
  '  --concurrencia n: pedidos simultáneos a archive.org (3 por omisión).\n';

async function main(): Promise<number> {
  const { opciones } = parsearArgs(process.argv.slice(2));

  let camaraFiltro: CamaraArchive | undefined;
  if (typeof opciones.camara === 'string') {
    const c = opciones.camara.toUpperCase();
    if (!CAMARAS.includes(c as CamaraArchive)) {
      process.stderr.write(`--camara debe ser una de ${CAMARAS.join(', ')}\n${USO}`);
      return 2;
    }
    camaraFiltro = c as CamaraArchive;
  }
  const limite = opciones.limite !== undefined ? Number(opciones.limite) : undefined;
  if (limite !== undefined && !Number.isFinite(limite)) {
    process.stderr.write(`--limite va con un número entero\n${USO}`);
    return 2;
  }
  const concurrencia = opciones.concurrencia !== undefined ? Number(opciones.concurrencia) : 3;
  if (!Number.isFinite(concurrencia) || concurrencia < 1) {
    process.stderr.write(`--concurrencia va con un número entero mayor a 0\n${USO}`);
    return 2;
  }
  const reintentar = opciones.reintentar === true;

  log.info('listando la colección uruguay-diario-sesiones (archive.org advancedsearch)…');
  const identificadoresCrudos = await listarColeccion();
  log.info(`${identificadoresCrudos.length.toLocaleString('es-UY')} ítem(s) en la colección`);

  const items: Record<string, ItemIndice> = leerIndice(RUTA_INDICE)?.items ?? {};
  const infoPorId = new Map<string, ItemArchive>();
  let sinParsear = 0;
  for (const id of identificadoresCrudos) {
    const info = parsearIdentificadorArchive(id);
    if (!info) {
      sinParsear++;
      log.aviso(`identificador que no matchea ningún patrón esperado: ${id}`);
      continue;
    }
    if (camaraFiltro && info.camara !== camaraFiltro) continue;
    infoPorId.set(id, info);
  }
  if (sinParsear) log.aviso(`${sinParsear} identificador(es) sin reconocer, del total de la colección`);

  let pendientes = identificadoresPendientes([...infoPorId.keys()], items, { reintentar });
  const totalConsiderados = infoPorId.size;
  if (limite !== undefined) pendientes = pendientes.slice(0, limite);
  log.info(
    `${pendientes.length.toLocaleString('es-UY')} ítem(s) pendiente(s) de ${totalConsiderados.toLocaleString('es-UY')} ` +
      `(índice previo: ${Object.keys(items).length.toLocaleString('es-UY')} ítem(s))`,
  );

  let procesados = 0;
  await conConcurrencia(pendientes, concurrencia, async (id) => {
    const info = infoPorId.get(id)!;
    const resultado = await descargarCabecera(id);
    if (!resultado.ok) {
      items[id] = { ...info, fechas: [], estado: 'sin_ocr' };
    } else {
      const recortada = recortarCabecera(resultado.texto);
      const fechas = fechasDeCabecera(recortada);
      items[id] = { ...info, fechas, cabecera: cabeceraCorta(recortada), estado: fechas.length ? 'fechado' : 'sin_fecha' };
    }
    procesados++;
    if (procesados % 100 === 0) {
      const { fechados, sinFecha, sinOcr } = contarEstados(items);
      log.info(
        `${Object.keys(items).length.toLocaleString('es-UY')}/${totalConsiderados.toLocaleString('es-UY')} · ` +
          `fechados ${fechados.toLocaleString('es-UY')} · sin_fecha ${sinFecha.toLocaleString('es-UY')} · sin_ocr ${sinOcr.toLocaleString('es-UY')}`,
      );
    }
    if (procesados % 200 === 0) escribirIndice(items);
  });

  escribirIndice(items);
  log.ok(`${RUTA_INDICE}: ${Object.keys(items).length.toLocaleString('es-UY')} ítem(s), ${procesados.toLocaleString('es-UY')} procesado(s) en esta corrida`);

  console.log('\nResumen (ítems fechados por cámara y año):');
  const resumen = calcularResumen(items);
  for (const camara of Object.keys(resumen).sort()) {
    const anios = resumen[camara];
    for (const anio of Object.keys(anios).sort()) console.log(`  ${camara} ${anio}: ${anios[anio]}`);
  }

  const { fechados, sinFecha, sinOcr } = contarEstados(items);
  console.log(`\n${fechados.toLocaleString('es-UY')} fechado(s), ${sinFecha.toLocaleString('es-UY')} sin_fecha, ${sinOcr.toLocaleString('es-UY')} sin_ocr`);
  const conSinFecha = Object.entries(items).filter(([, v]) => v.estado === 'sin_fecha');
  if (conSinFecha.length) {
    console.log(`\nsin_fecha (hasta 20 de ${conSinFecha.length}), para ver qué le falta al parser:`);
    for (const [id, item] of conSinFecha.slice(0, 20)) console.log(`  ${id}: ${item.cabecera ?? ''}`);
    if (conSinFecha.length > 20) console.log(`  … ${conSinFecha.length - 20} más en ${RUTA_INDICE}`);
  }

  return 0;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main()
    .then((codigo) => { process.exitCode = codigo; })
    .catch((e) => {
      log.error((e as Error).message);
      process.exitCode = 1;
    });
}
