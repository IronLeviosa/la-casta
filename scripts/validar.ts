/**
 * `pnpm validar [--red] [--inbox <dir>] [--solo <etapa>] [--json]`
 *
 * Orquestador del validador. Solo `esquema` corta; el resto reporta todas las etapas en una
 * pasada (docs/plan-validar-completo.md, decidido en la corrida de Batlle del 2026-09-16: cortar
 * en la primera etapa con errores le costó tres correctores y tres relanzadas con `--red` — uno
 * arregló las cinco referencias rotas, recién ahí aparecieron once de tiers, recién ahí siete de
 * presentación — cuando los tres problemas existían desde el principio y con la lista completa
 * alcanzaba un corrector):
 *
 *   1. esquema      cada YAML pasa su Zod y el nombre de archivo cumple el patrón — corta: un
 *                   registro que no pasó su Zod no existe para las demás etapas, y toda
 *                   referencia a él se vería rota, que sería ruido y no información.
 *   2. referencias  refs resueltas, giros coherentes, casos ascendentes, etiqueta_legal
 *   3. tiers        niveles de evidencia, procedencia, ledger
 *   4. presentacion título, párrafos, notas, gráficos y narración de proceso para el lector
 *   5. duplicados   mismo político, misma fecha y mismo comienzo de cita/texto, id distinto
 *   6. fuentes      (--red) HTTP + Wayback de cada URL, actualiza el ledger
 *   7. citas        (--red) la cita aparece en el texto o en la transcripción
 *   8. simetria     solo informa; escribe data/simetria.json
 *
 * Las etapas 2 a 5 corren todas aunque alguna falle, cada una con sus propios errores, sin filtrar
 * "errores derivados" de una etapa anterior por registro: la única superposición conocida (un
 * `medio` inexistente que además aparece como "ninguno resuelto" en `tiers`) cuesta dos líneas
 * para el mismo arreglo, que es más barato que esconder un error genuino de una etapa posterior
 * sobre un registro que además tenía una referencia rota.
 *
 * Las etapas de red (6 y 7) corren con `--inbox` aunque las offline (2 a 5) hayan fallado: el
 * corrector recibe la lista entera en una sola pasada, y `fuentes` (ledger) y `citas` (caché) no
 * repiten lo ya verificado. Sin `--inbox` (CI sobre `content/`), si alguna etapa offline falló,
 * `fuentes` y `citas` quedan "omitida (errores en etapas anteriores)": CI va a fallar igual y no
 * hay por qué gastar la cuota de Wayback en un commit que se va a corregir.
 *
 * Códigos de salida: 0 ok, 1 errores de contenido, 2 fallo de infraestructura
 * (sin red, ledger no escribible). CI reintenta solo el 2.
 *
 * Modo `--inbox <dir>`: valida una corrida de `inbox/<politico>/<tema>/<fecha>/`
 * con reglas relajadas (todavía no tiene tier ni procedencia, y sus
 * referencias pueden resolver dentro de la misma corrida). Es el bucle
 * anti-alucinación: los registros cuya cita no aparece vuelven al agente. En este modo,
 * `presentacion` y `duplicados` pasan de aviso a error: el lote no sale del inbox con esos
 * defectos adentro (docs/colecciones/presentacion.md; plan 2026-09, ítems 2.4 y 5.3).
 *
 * `--estricto`: en content/ (sin --inbox), vuelve error los avisos de la etapa `presentacion`.
 *
 * `--por-regla [<regla>]`: agrupa los avisos y errores de todas las etapas que corrieron por regla
 * y colección (docs/plan-deuda-presentacion.md, punto 1), para saber qué registros paga cada
 * corrección de presentación sin copiar ids a mano de una tabla. Ver `claveDeRegla` y
 * `agruparPorRegla` más abajo.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { aPosix, cargarContenido, construirContenido, recorrerFuentes, type Contenido } from './lib/contenido.ts';
import { canonicalizar } from './lib/url.ts';
import { cargarInbox } from './lib/inbox.ts';
import { log, parsearArgs } from './lib/log.ts';
import { validarReferencias } from './validadores/referencias.ts';
import { validarTiers } from './validadores/tiers.ts';
import { validarPresentacion } from './validadores/presentacion.ts';
import { validarDuplicados } from './validadores/duplicados.ts';
import { validarFuentes, type VerificadorUrl } from './validadores/fuentes.ts';
import { validarCitas, type OpcionesCitas } from './validadores/citas.ts';
import { informeSimetria, validarSimetria, tabla, type ResumenSimetria } from './validadores/simetria.ts';
import { ErrorInfraestructura, type Problema, type ResultadoEtapa } from './validadores/tipos.ts';

export const ETAPAS = ['esquema', 'referencias', 'tiers', 'presentacion', 'duplicados', 'fuentes', 'citas', 'simetria'] as const;
export type NombreEtapa = (typeof ETAPAS)[number];

/** Etapas que solo corren con --red. */
const ETAPAS_DE_RED: ReadonlySet<NombreEtapa> = new Set(['fuentes', 'citas']);

export interface OpcionesValidar {
  /** Raíz del repo a validar (por defecto, la del proceso). */
  rootDir?: string;
  /** Correr también las etapas que tocan la red. */
  red?: boolean;
  /** Carpeta de una corrida del inbox; activa las reglas relajadas. */
  inboxDir?: string;
  /** Correr una sola etapa. */
  solo?: NombreEtapa;
  /** En la etapa presentacion, sobre content/ (sin --inbox), vuelve error los avisos. */
  estricto?: boolean;
  /**
   * Agrupa los avisos y errores de todas las etapas que corrieron por regla y colección
   * (`Resultado.porRegla`): `true` para todas las reglas, o el id de una sola (la clave exacta que
   * imprime `pnpm validar --por-regla`, ej. "presentacion:titulo_largo"). Sin esto, `porRegla` no se
   * calcula ni se agrega al resultado.
   */
  porRegla?: string | true;
  /**
   * Id de una corrección (o `true`) para la etapa presentacion en modo corrección ("no peor que lo
   * publicado", scripts/validadores/presentacion.ts): sin esto, el modo se activa solo con que el
   * `--inbox` traiga un registro de `correcciones`. Mismo criterio que `pnpm promover --correccion`.
   */
  correccion?: string | true;
  ledgerPath?: string;
  corridasDir?: string;
  simetriaPath?: string;
  /** false para no escribir data/simetria.json (tests). */
  escribirSimetria?: boolean;
  /** Verificador de URLs inyectable (tests). */
  verificarUrl?: VerificadorUrl;
  /** Opciones de la etapa de citas (obtenerTexto inyectable en tests). */
  citas?: Pick<OpcionesCitas, 'obtenerTexto' | 'obtenerTranscripcion' | 'sinCache' | 'cacheDir' | 'limite'>;
  /** Progreso en vivo (stderr en el CLI). */
  progreso?: (mensaje: string) => void;
}

export interface EtapaEjecutada extends ResultadoEtapa {
  etapa: NombreEtapa;
  ok: boolean;
  /** Línea corta con lo que hizo la etapa (archivos revisados, URLs verificadas…). */
  detalle: string;
  /** true si la etapa se saltó (por --solo o por falta de --red). */
  omitida: boolean;
}

export interface Resultado {
  ok: boolean;
  /** 0 ok · 1 errores de contenido · 2 infraestructura. */
  codigo: 0 | 1 | 2;
  etapas: EtapaEjecutada[];
  errores: Problema[];
  avisos: Problema[];
  /** Archivos de content/ (más los del inbox en modo --inbox). */
  archivos: number;
  registros: number;
  /** Mensaje de infraestructura, si el código es 2. */
  infraestructura?: string;
  simetria?: ResumenSimetria;
  /** Informe de simetría ya formateado (solo si corrió la etapa). */
  informeSimetria?: string;
  /** Solo con `opciones.porRegla`: regla -> colección -> ids completos ("coleccion/id"), ordenados. */
  porRegla?: ReporteRegla;
}

/** regla -> colección -> ids completos ("coleccion/id"). */
export type ReporteRegla = Record<string, Record<string, string[]>>;

function etapaOmitida(etapa: NombreEtapa, detalle: string): EtapaEjecutada {
  return { etapa, ok: true, errores: [], avisos: [], detalle, omitida: true };
}

/**
 * URLs citadas por los registros del inbox que no figuran en `consultas.jsonl` como leídas
 * (líneas de tipo `fuente` o `fuente_indice`, cuya `q` es la URL). Regla 5 de CLAUDE.md: nunca se
 * cita una URL que no se abrió con `pnpm fuente`; `consultas.jsonl` es el rastro de esas
 * lecturas. Es aviso y no error: el archivo lo escribe el agente y puede tener huecos legítimos,
 * pero el crítico pidió verlo (piloto de Astori, 2026-09-16: una gacetilla de Presidencia citada
 * sin rastro de lectura). Sin `consultas.jsonl`, o con uno sin ninguna URL, no avisa nada.
 */
export function avisosDeConsultas(contenido: Contenido, inboxDir: string): Problema[] {
  const ruta = path.join(inboxDir, 'consultas.jsonl');
  if (!existsSync(ruta)) return [];
  const leidas = new Set<string>();
  for (const linea of readFileSync(ruta, 'utf8').split(/\r?\n/)) {
    if (!linea.trim()) continue;
    try {
      const ev = JSON.parse(linea) as { tipo?: string; q?: string; url?: string };
      const u = ev.url ?? ev.q;
      if (typeof u === 'string' && /^https?:\/\//i.test(u.trim())) leidas.add(canonicalizar(u.trim().split(/\s+/)[0]));
    } catch {
      /* una línea que no es JSON no es una lectura */
    }
  }
  if (leidas.size === 0) return [];
  const avisos: Problema[] = [];
  const vistas = new Set<string>();
  for (const reg of contenido.registros) {
    if (!reg.enInbox) continue;
    recorrerFuentes(reg.datos, (f, rutaCampo) => {
      if (typeof f.url !== 'string') return;
      const c = canonicalizar(f.url);
      const clave = `${reg.archivo}|${c}`;
      if (leidas.has(c) || vistas.has(clave)) return;
      vistas.add(clave);
      avisos.push({
        archivo: reg.archivo,
        campo: `${rutaCampo}.url`,
        mensaje: `URL citada que no figura en consultas.jsonl como leída con pnpm fuente: ${f.url}. Si se abrió, falta la línea; si no se abrió, no se puede citar (regla 5).`,
      });
    });
  }
  return avisos;
}

/**
 * Corre el validador y devuelve el resultado. No lanza ni llama a process.exit:
 * los fallos de infraestructura vuelven como `codigo: 2`.
 */
export async function validar(opciones: OpcionesValidar = {}): Promise<Resultado> {
  const rootDir = path.resolve(opciones.rootDir ?? process.cwd());
  const modoInbox = !!opciones.inboxDir;
  const progreso = opciones.progreso ?? (() => {});
  const etapas: EtapaEjecutada[] = [];

  const corre = (etapa: NombreEtapa): boolean => {
    if (opciones.solo) return opciones.solo === etapa;
    if (ETAPAS_DE_RED.has(etapa) && !opciones.red) return false;
    return true;
  };
  // `huboErroresOffline` se actualiza mientras corren las etapas 2 a 5 (más abajo); las etapas de
  // red la consultan para saber si corren o quedan omitidas (punto 3 del plan).
  let huboErroresOffline = false;
  const razonOmitida = (etapa: NombreEtapa): string => {
    if (opciones.solo) return `omitida (--solo ${opciones.solo})`;
    if (ETAPAS_DE_RED.has(etapa) && !opciones.red) return 'omitida (necesita --red)';
    if (ETAPAS_DE_RED.has(etapa) && !modoInbox && huboErroresOffline) return 'omitida (errores en etapas anteriores)';
    return 'omitida';
  };

  // Cierre sobre `contenido` (asignado más abajo, en la etapa 1): se evalúa recién cuando se llama,
  // ya con `contenido` asignado en todo camino que llegue a usarla (después de la etapa 1). Sin
  // `opciones.porRegla`, no hace nada, para no gastar el recorrido en la corrida normal.
  const construirPorRegla = (): Pick<Resultado, 'porRegla'> => {
    if (opciones.porRegla === undefined) return {};
    const filtro = typeof opciones.porRegla === 'string' ? opciones.porRegla : undefined;
    return { porRegla: agruparPorRegla(etapas, contenido, filtro) };
  };

  const terminar = (codigo: 0 | 1 | 2, extra: Partial<Resultado> = {}): Resultado => {
    const errores = etapas.flatMap((e) => e.errores);
    const avisos = etapas.flatMap((e) => e.avisos);
    return {
      ok: codigo === 0,
      codigo,
      etapas,
      errores,
      avisos,
      archivos: 0,
      registros: 0,
      ...extra,
    };
  };

  // -------------------------------------------------------------------------
  // Etapa 1: esquema (carga el contenido; los errores de Zod salen de acá).
  // -------------------------------------------------------------------------
  let contenido: Contenido;
  let archivos = 0;
  try {
    const base = cargarContenido(rootDir);
    archivos = base.archivos;
    if (modoInbox) {
      const inbox = cargarInbox(rootDir, path.resolve(opciones.inboxDir!));
      archivos += inbox.archivos;
      contenido = construirContenido(rootDir, [...base.registros, ...inbox.registros], [...base.errores, ...inbox.errores], archivos);
    } else {
      contenido = base;
    }
  } catch (e) {
    const r = terminar(2);
    r.infraestructura = `No se pudo leer el contenido: ${(e as Error).message}`;
    return r;
  }

  const etapaEsquema: EtapaEjecutada = {
    etapa: 'esquema',
    ok: contenido.errores.length === 0,
    errores: contenido.errores,
    avisos: [],
    detalle: `${archivos} archivo(s), ${contenido.registros.length} registro(s)`,
    omitida: !corre('esquema'),
  };
  if (etapaEsquema.omitida) {
    // Aunque --solo pida otra etapa, necesitamos el contenido cargado; si hay
    // errores de esquema no se puede seguir, así que se reportan igual.
    etapaEsquema.detalle = `${archivos} archivo(s) cargados`;
  }
  etapas.push(etapaEsquema);
  if (!etapaEsquema.ok) return terminar(1, { archivos, registros: contenido.registros.length, ...construirPorRegla() });

  const comun = { archivos, registros: contenido.registros.length };

  // -------------------------------------------------------------------------
  // Etapa 2: referencias
  // -------------------------------------------------------------------------
  if (corre('referencias')) {
    const res = validarReferencias(contenido);
    // En el inbox, toda URL citada tiene que figurar en consultas.jsonl como leída (aviso).
    if (modoInbox) res.avisos.push(...avisosDeConsultas(contenido, path.resolve(opciones.inboxDir!)));
    etapas.push({ etapa: 'referencias', ok: res.errores.length === 0, ...res, detalle: `${contenido.registros.length} registro(s)`, omitida: false });
    if (res.errores.length) huboErroresOffline = true;
  } else {
    etapas.push(etapaOmitida('referencias', razonOmitida('referencias')));
  }

  // -------------------------------------------------------------------------
  // Etapa 3: tiers
  // -------------------------------------------------------------------------
  if (corre('tiers')) {
    const res = validarTiers(contenido, {
      modoInbox,
      ledgerPath: opciones.ledgerPath,
      corridasDir: opciones.corridasDir,
    });
    etapas.push({ etapa: 'tiers', ok: res.errores.length === 0, ...res, detalle: modoInbox ? 'reglas relajadas (inbox)' : 'tier, evidencia, procedencia, ledger', omitida: false });
    if (res.errores.length) huboErroresOffline = true;
  } else {
    etapas.push(etapaOmitida('tiers', razonOmitida('tiers')));
  }

  // -------------------------------------------------------------------------
  // Etapa 4: presentacion (título, párrafos, notas, gráficos, narración de proceso)
  // -------------------------------------------------------------------------
  if (corre('presentacion')) {
    const res = validarPresentacion(contenido, { modoInbox, estricto: opciones.estricto, correccion: opciones.correccion });
    const base = modoInbox ? 'reglas de presentación (inbox: error)' : opciones.estricto ? 'reglas de presentación (--estricto: error)' : 'reglas de presentación (aviso)';
    // Línea de resumen del modo corrección ("no peor que lo publicado"): siempre que se activó,
    // aunque no haya heredado ningún hallazgo, para que quede claro que corrió en ese modo.
    const resumenCorreccion = res.modoCorreccion ? `; modo corrección: ${res.heredados} hallazgo(s) heredados de lo publicado pasan a aviso` : '';
    etapas.push({
      etapa: 'presentacion',
      ok: res.errores.length === 0,
      errores: res.errores,
      avisos: res.avisos,
      detalle: `${base}${resumenCorreccion}`,
      omitida: false,
    });
    if (res.errores.length) huboErroresOffline = true;
  } else {
    etapas.push(etapaOmitida('presentacion', razonOmitida('presentacion')));
  }

  // -------------------------------------------------------------------------
  // Etapa 5: duplicados
  // -------------------------------------------------------------------------
  if (corre('duplicados')) {
    const res = validarDuplicados(contenido);
    etapas.push({ etapa: 'duplicados', ok: res.errores.length === 0, ...res, detalle: `${contenido.registros.length} registro(s) comparados`, omitida: false });
    if (res.errores.length) huboErroresOffline = true;
  } else {
    etapas.push(etapaOmitida('duplicados', razonOmitida('duplicados')));
  }

  // -------------------------------------------------------------------------
  // Etapa 6: fuentes (--red)
  // -------------------------------------------------------------------------
  if (corre('fuentes') && (modoInbox || !huboErroresOffline)) {
    try {
      const res = await validarFuentes(contenido, {
        modoInbox,
        ledgerPath: opciones.ledgerPath,
        verificarUrl: opciones.verificarUrl,
        correccion: opciones.correccion,
        progreso,
      });
      etapas.push({
        etapa: 'fuentes',
        ok: res.errores.length === 0,
        errores: res.errores,
        avisos: res.avisos,
        // «caída(s)» son URLs que esta corrida marcó ok:false; «no comprobada(s) hoy» son las que
        // Wayback rebotó (429/timeout) sobre una verificación previa exitosa, que se conservó tal
        // cual. Antes de esta distinción, un límite de pedidos de Wayback se veía igual que una
        // fuente muerta en el resumen final. «heredada(s)» son errores de afecta[] que ya fallaban
        // igual en lo publicado (modo corrección: "no peor que lo publicado").
        detalle: `${res.verificadas} URL(s) verificadas: ${res.caidas} caída(s), ${res.noComprobadas} no comprobada(s) hoy${res.heredados ? `, ${res.heredados} heredada(s) de lo publicado` : ''}`,
        omitida: false,
      });
    } catch (e) {
      if (e instanceof ErrorInfraestructura) {
        const r = terminar(2, comun);
        r.infraestructura = e.message;
        return r;
      }
      throw e;
    }
  } else {
    etapas.push(etapaOmitida('fuentes', razonOmitida('fuentes')));
  }

  // -------------------------------------------------------------------------
  // Etapa 7: citas (--red)
  // -------------------------------------------------------------------------
  if (corre('citas') && (modoInbox || !huboErroresOffline)) {
    try {
      const res = await validarCitas(contenido, { modoInbox, correccion: opciones.correccion, progreso, ...opciones.citas });
      etapas.push({
        etapa: 'citas',
        ok: res.errores.length === 0,
        errores: res.errores,
        avisos: res.avisos,
        detalle: `${res.verificadas} cita(s): ${res.exactas} exacta(s), ${res.aproximadas} aproximada(s), ${res.manuales} manual(es), ${res.desdeCache} de caché${res.heredados ? `, ${res.heredados} heredada(s) de lo publicado` : ''}`,
        omitida: false,
      });
    } catch (e) {
      if (e instanceof ErrorInfraestructura) {
        const r = terminar(2, comun);
        r.infraestructura = e.message;
        return r;
      }
      throw e;
    }
  } else {
    etapas.push(etapaOmitida('citas', razonOmitida('citas')));
  }

  // -------------------------------------------------------------------------
  // Etapa 8: simetría (solo informa; nunca falla)
  // -------------------------------------------------------------------------
  let simetria: ResumenSimetria | undefined;
  let informe: string | undefined;
  if (corre('simetria')) {
    // En modo --inbox no se escribe el JSON: la corrida todavía no es contenido.
    const res = validarSimetria(contenido, {
      salida: opciones.simetriaPath,
      // Con errores offline no se reescribe data/simetria.json: antes el corte impedía llegar acá, y
      // un árbol roto no tiene por qué dejar rastro en un archivo público.
      sinEscribir: opciones.escribirSimetria === false || modoInbox || huboErroresOffline,
    });
    simetria = res.resumen;
    informe = res.informe;
    etapas.push({
      etapa: 'simetria',
      ok: true,
      errores: [],
      avisos: res.avisos,
      detalle: `${Object.keys(res.resumen.por_partido).length} partido(s), ${res.resumen.temas.length} tema(s) con registros`,
      omitida: false,
    });
  } else {
    etapas.push(etapaOmitida('simetria', razonOmitida('simetria')));
  }

  // Ninguna etapa cortó: el código final depende de si alguna, offline o de red, dejó errores.
  const huboErrores = etapas.some((e) => e.errores.length > 0);
  return terminar(huboErrores ? 1 : 0, { ...comun, simetria, informeSimetria: informe, ...construirPorRegla() });
}

// ---------------------------------------------------------------------------
// --por-regla: agrupa avisos y errores por regla y colección.
// ---------------------------------------------------------------------------

/**
 * "finanzas[2019].nota" -> "finanzas[].nota"; "mandatos.3.fuentes.1.cita" -> "mandatos.fuentes.cita".
 * Sin esto, la misma regla aplicada a dos posiciones de una lista (o a dos registros con distinto
 * índice) contaría como dos reglas distintas.
 */
function campoSinIndices(campo: string): string {
  return campo
    .replace(/\[[^\]]*\]/g, '[]')
    .split('.')
    .filter((seg) => !/^\d+$/.test(seg))
    .join('.');
}

/**
 * Clave de regla estable para un problema de una etapa: la etapa presentacion ya calcula un id de
 * regla por hallazgo (scripts/validadores/presentacion.ts, `calcularHallazgos`, ej. "titulo_largo");
 * acá se le antepone la etapa ("presentacion:titulo_largo") para que nunca choque con la clave
 * derivada de otra etapa. Las demás etapas todavía no traen `regla`, así que se deriva de
 * `etapa + campo` sin los índices de lista.
 */
export function claveDeRegla(etapa: NombreEtapa, problema: Problema): string {
  return `${etapa}:${problema.regla ?? campoSinIndices(problema.campo)}`;
}

/**
 * Agrupa los avisos y errores de las etapas que corrieron por regla (`claveDeRegla`) y colección,
 * con los ids completos ("coleccion/id", la misma forma que `afecta[]` de una corrección) que
 * dispararon cada una (docs/plan-deuda-presentacion.md, punto 1). `filtro`, si se da, deja solo esa
 * clave exacta. No cambia ningún resultado del validador: es una relectura de lo que las etapas ya
 * reportaron, para que un script arme `afecta[]` sin copiar ids a mano de una tabla.
 */
export function agruparPorRegla(etapas: EtapaEjecutada[], contenido: Contenido, filtro?: string): ReporteRegla {
  const registroPorArchivo = new Map<string, { coleccion: string; id: string }>();
  for (const reg of contenido.registros) registroPorArchivo.set(reg.archivo, { coleccion: reg.coleccion, id: reg.id });

  const reporte: ReporteRegla = {};
  for (const e of etapas) {
    for (const p of [...e.errores, ...e.avisos]) {
      const clave = claveDeRegla(e.etapa, p);
      if (filtro && clave !== filtro) continue;
      const info = registroPorArchivo.get(p.archivo);
      const coleccion = info?.coleccion ?? '(sin colección)';
      const idCompleto = info ? `${info.coleccion}/${info.id}` : p.archivo;
      const porColeccion = (reporte[clave] ??= {});
      const ids = (porColeccion[coleccion] ??= []);
      if (!ids.includes(idCompleto)) ids.push(idCompleto);
    }
  }
  for (const clave of Object.keys(reporte)) {
    for (const coleccion of Object.keys(reporte[clave])) reporte[clave][coleccion].sort();
  }
  return reporte;
}

/** Salida de texto de `--por-regla`: por regla, colección y total, con los ids uno por línea. */
export function formatoPorRegla(porRegla: ReporteRegla): string {
  const reglas = Object.keys(porRegla).sort();
  if (reglas.length === 0) return '(sin hallazgos para esa regla)';
  const lineas: string[] = [];
  for (const regla of reglas) {
    const porColeccion = porRegla[regla];
    const colecciones = Object.keys(porColeccion).sort();
    const total = colecciones.reduce((n, c) => n + porColeccion[c].length, 0);
    lineas.push(`${regla}: ${total} registro(s)`);
    for (const coleccion of colecciones) {
      const ids = porColeccion[coleccion];
      lineas.push(`  ${coleccion} (${ids.length})`);
      for (const id of ids) lineas.push(`    ${id}`);
    }
  }
  return lineas.join('\n');
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

/** Tabla `archivo | campo | mensaje`. */
export function tablaDeProblemas(problemas: Problema[]): string {
  return tabla(
    ['archivo', 'campo', 'mensaje'],
    problemas.map((p) => [p.archivo, p.campo, p.mensaje.replace(/\s+/g, ' ')]),
  );
}

// ---------------------------------------------------------------------------
// Modo --breve: para agentes. Sin tablas anchas, una línea por problema.
// ---------------------------------------------------------------------------

/** Archivos por encima de los cuales el mismo campo+mensaje se condensa en una sola línea. */
const TOPE_CONDENSACION = 5;

const limpiar = (mensaje: string): string => mensaje.replace(/\s+/g, ' ').trim();

/**
 * Líneas de un modo --breve para una lista de problemas (errores o avisos, por separado):
 * `archivo · campo: mensaje`, agrupadas por archivo en orden alfabético, salvo que el mismo
 * campo+mensaje aparezca en más de `TOPE_CONDENSACION` archivos, en cuyo caso se condensa en
 * una sola línea `campo: mensaje (N archivos: a, b, c, d, e y N-5 más)`.
 */
export function lineasBreve(problemas: Problema[]): string[] {
  const porClave = new Map<string, Problema[]>();
  for (const p of problemas) {
    const clave = `${p.campo}\u0000${limpiar(p.mensaje)}`;
    if (!porClave.has(clave)) porClave.set(clave, []);
    porClave.get(clave)!.push(p);
  }

  const lineasCondensadas: string[] = [];
  const sueltos: Problema[] = [];
  for (const grupo of porClave.values()) {
    const archivos = [...new Set(grupo.map((p) => p.archivo))].sort();
    if (archivos.length > TOPE_CONDENSACION) {
      const primeros = archivos.slice(0, TOPE_CONDENSACION);
      const resto = archivos.length - TOPE_CONDENSACION;
      lineasCondensadas.push(`${grupo[0].campo}: ${limpiar(grupo[0].mensaje)} (${archivos.length} archivos: ${primeros.join(', ')} y ${resto} más)`);
    } else {
      sueltos.push(...grupo);
    }
  }
  lineasCondensadas.sort();

  const porArchivo = new Map<string, Problema[]>();
  for (const p of sueltos) {
    if (!porArchivo.has(p.archivo)) porArchivo.set(p.archivo, []);
    porArchivo.get(p.archivo)!.push(p);
  }
  const lineasSueltas = [...porArchivo.keys()].sort().flatMap((archivo) => porArchivo.get(archivo)!.map((p) => `${archivo} · ${p.campo}: ${limpiar(p.mensaje)}`));

  return [...lineasSueltas, ...lineasCondensadas];
}

/** Línea de resumen de una etapa en modo --breve: `<etapa>: ok | N error(es) | omitida`. */
function lineaEtapaBreve(e: EtapaEjecutada): string {
  if (e.omitida) return `${e.etapa}: omitida`;
  return `${e.etapa}: ${e.errores.length === 0 ? 'ok' : `${e.errores.length} error(es)`}`;
}

/**
 * Salida completa del modo --breve: solo fallos (uno por línea, agrupados y condensados),
 * resumen de una línea por etapa y una línea final con los totales. Nada de tablas ni del
 * informe de simetría. Con `avisos: true` agrega todos los avisos en el mismo formato de una
 * línea; con `avisosDelLote: <prefijo posix del inbox>` agrega solo los avisos de los archivos
 * del lote que se está validando. Lo segundo es lo que necesita un agente que corrige un lote:
 * el editor de Astori (2026-09-16) reportó «5 avisos cuyo texto --breve no imprimió y no se
 * volvieron a ver», porque el conteo salía y el texto no, y volver a correr el validador entero
 * para leerlos cuesta lo mismo que leerlos ahora.
 */
export function formatoBreve(resultado: Resultado, opciones: { avisos?: boolean; avisosDelLote?: string } = {}): string {
  const lineas: string[] = [];
  lineas.push(...lineasBreve(resultado.errores));
  const prefijo = opciones.avisosDelLote ? opciones.avisosDelLote.replace(/\/+$/, '') : undefined;
  const delLote = prefijo ? resultado.avisos.filter((p) => p.archivo === prefijo || p.archivo.startsWith(`${prefijo}/`)) : [];
  if (opciones.avisos) lineas.push(...lineasBreve(resultado.avisos));
  else if (delLote.length) lineas.push(...lineasBreve(delLote));
  for (const e of resultado.etapas) lineas.push(lineaEtapaBreve(e));
  if (resultado.infraestructura) lineas.push(`infraestructura: ${resultado.infraestructura}`);
  lineas.push(
    `validado: ${resultado.registros} registro(s), ${resultado.errores.length} error(es), ${resultado.avisos.length} aviso(s)${prefijo ? ` (${delLote.length} del lote)` : ''}`,
  );
  return lineas.join('\n');
}

function imprimir(resultado: Resultado, opciones: { json: boolean }): void {
  if (opciones.json) {
    console.log(JSON.stringify(resultado, null, 2));
    return;
  }

  for (const e of resultado.etapas) {
    if (e.omitida) {
      console.log(`· ${e.etapa}: ${e.detalle}`);
      continue;
    }
    const marca = e.ok ? '✔' : '✘';
    console.log(`${marca} ${e.etapa}: ${e.errores.length} error(es) — ${e.detalle}`);
  }

  if (resultado.errores.length) {
    console.log('');
    console.log('Errores');
    console.log(tablaDeProblemas(resultado.errores));
  }
  if (resultado.avisos.length) {
    console.log('');
    console.log(`Avisos (no bloquean, ${resultado.avisos.length})`);
    console.log(tablaDeProblemas(resultado.avisos));
  }
  if (resultado.informeSimetria) {
    console.log('');
    console.log(resultado.informeSimetria);
  }
  if (resultado.infraestructura) {
    console.log('');
    console.log(`Fallo de infraestructura: ${resultado.infraestructura}`);
  }
  console.log('');
  console.log(
    resultado.ok
      ? `✔ validado: ${resultado.registros} registro(s), ${resultado.avisos.length} aviso(s).`
      : resultado.codigo === 2
        ? '✘ no se pudo completar la validación (infraestructura).'
        : `✘ ${resultado.errores.length} error(es) de contenido.`,
  );
}

const AYUDA = `pnpm validar [opciones]

  --red             corre también las etapas fuentes y citas (toca la red)
  --inbox <dir>     valida una corrida de inbox/ con reglas relajadas
  --correccion [id] con --inbox, fuerza el modo corrección de la etapa presentacion ("no peor que
                    lo publicado") o desambigua cuál si el lote trae más de una en correcciones.yaml;
                    sin esto, el modo se activa solo con que el lote traiga un registro de corrección
  --solo <etapa>    corre una sola etapa (${ETAPAS.join(' | ')})
  --estricto        en content/, los avisos de la etapa presentacion pasan a error
  --breve           salida corta para agentes: solo fallos, una línea cada uno (con --inbox, también los avisos del lote)
  --avisos          con --breve, agrega los avisos en el mismo formato
  --json            imprime el resultado completo en JSON por stdout
  --por-regla [<r>] agrupa avisos y errores por regla y colección, con los ids completos; sin <r>,
                    todas las reglas ("presentacion:titulo_largo", "tiers:evidencia.fuentes.url"…);
                    con --json va integrado en resultado.porRegla
  --por-regla-json <ruta>  escribe {regla: {coleccion: [ids]}} en <ruta> (implica --por-regla)
  --raiz <dir>      raíz del repo a validar (por defecto, la actual)

Salidas: 0 ok · 1 errores de contenido · 2 fallo de infraestructura.`;

async function main(): Promise<void> {
  const { opciones } = parsearArgs(process.argv.slice(2));
  if (opciones.ayuda || opciones.help || opciones.h) {
    console.log(AYUDA);
    process.exit(0);
  }
  const solo = typeof opciones.solo === 'string' ? (opciones.solo as NombreEtapa) : undefined;
  if (solo && !ETAPAS.includes(solo)) {
    console.error(`Etapa desconocida: "${solo}". Etapas válidas: ${ETAPAS.join(', ')}.`);
    process.exit(2);
  }
  const json = opciones.json === true;
  const breve = opciones.breve === true;
  const porReglaJson = typeof opciones['por-regla-json'] === 'string' ? opciones['por-regla-json'] : undefined;
  const porRegla =
    opciones['por-regla'] === true ? true : typeof opciones['por-regla'] === 'string' ? opciones['por-regla'] : porReglaJson !== undefined ? true : undefined;
  const resultado = await validar({
    rootDir: typeof opciones.raiz === 'string' ? opciones.raiz : undefined,
    red: opciones.red === true,
    inboxDir: typeof opciones.inbox === 'string' ? opciones.inbox : undefined,
    solo,
    estricto: opciones.estricto === true,
    correccion: opciones.correccion === true ? true : typeof opciones.correccion === 'string' ? opciones.correccion : undefined,
    porRegla,
    progreso: json || breve ? undefined : (m) => log.info(m),
  });
  if (porReglaJson) {
    mkdirSync(path.dirname(path.resolve(porReglaJson)), { recursive: true });
    writeFileSync(porReglaJson, JSON.stringify(resultado.porRegla ?? {}, null, 2), 'utf8');
  }
  if (json) imprimir(resultado, { json: true });
  else if (breve) {
    const inboxDir = typeof opciones.inbox === 'string' ? path.resolve(opciones.inbox) : undefined;
    const rootDir = path.resolve(typeof opciones.raiz === 'string' ? opciones.raiz : process.cwd());
    console.log(formatoBreve(resultado, { avisos: opciones.avisos === true, avisosDelLote: inboxDir ? aPosix(path.relative(rootDir, inboxDir)) : undefined }));
  }
  else imprimir(resultado, { json: false });
  if (porRegla !== undefined && !json) {
    console.log('');
    console.log('Por regla');
    console.log(formatoPorRegla(resultado.porRegla ?? {}));
  }
  process.exit(resultado.codigo);
}

const esEntrada = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (esEntrada) {
  main().catch((e) => {
    console.error(`Error inesperado: ${(e as Error).stack ?? (e as Error).message}`);
    process.exit(2);
  });
}
