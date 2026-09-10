/**
 * `pnpm reverificar [--inbox <dir>] [--escribir] [--json]`
 *
 * Ítem 2.2 de la fase 2 de `docs/plan-2026-09.md`: reintenta, con la herramienta de hoy (planillas,
 * zip, respuestas de API — `scripts/corpus/fuente.ts`), cada fuente marcada `verificacion: manual`
 * y avisa cuáles ya se pueden cotejar mecánicamente contra su cita.
 *
 * `verificacion: manual` (`CLAUDE.md`, "Fuentes no verificables mecánicamente") existe para lo que
 * de verdad no se puede bajar (TV sin descarga, X, paywall) y deja el registro en `probable` hasta
 * que aparezca una fuente cotejable. Varias de las que hoy la llevan se cargaron cuando `pnpm
 * fuente` todavía no sabía leer una planilla, un zip o una respuesta de API; hoy sí sabe, así que
 * conviene reintentarlas en lugar de esperar a que alguien las note a mano.
 *
 * Ningún script toca `content/` directamente (CLAUDE.md, regla 9): este solo lee y, con
 * `--escribir`, redacta el registro de corrección en `inbox/correcciones/<fecha>/correcciones.yaml`
 * (`docs/colecciones/correcciones.md`, `.claude/commands/correccion.md`). Aplicarlo a `content/`
 * sigue siendo `pnpm promover <dir> --correccion <id>`, y no lo corre este script.
 *
 * Reutiliza, sin reimplementarla, la comparación de la etapa 5 del validador
 * (`scripts/validadores/citas.ts`: `verificarUna`, exportada para esto) y la misma lectura de
 * fuentes que `pnpm fuente` (`scripts/corpus/fuente.ts`, vía `obtenerTextoDelCorpus`): si la nota
 * ya está en el corpus no se vuelve a bajar; si no está, se baja con el lector de hoy.
 *
 * Solo se propone quitar `verificacion: manual` cuando la cita cotejó EXACTA: una cita "aproximada"
 * contra un `documento_oficial` publicado es un error de la etapa 5 (texto fijo, tiene que ser
 * literal), así que limpiar la marca en ese caso rompería `pnpm validar --red` en lugar de arreglar
 * algo. Esos casos quedan listados como "no cotejada" para que alguien revise la cita a mano.
 *
 * Códigos de salida: 0 siempre que la corrida terminó (aunque haya fuentes que no cotejaron o que
 * no se pudieron leer: eso se informa, no es un fallo de infraestructura); 2 si algo impidió correr
 * (carpeta de contenido ilegible, excepción no prevista).
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';
import type { NombreColeccion } from '../src/schemas/comunes';
import { aPosix, cargarContenido, hoyISO, leerRegistroCrudo, recorrerFuentes, validarContraEsquema, type FuenteMinima } from './lib/contenido.ts';
import { escribirCorridaDeScript, hashDeArchivo } from './lib/corridas.ts';
import { cargarInbox, derivarId, normalizarRegistroInbox } from './lib/inbox.ts';
import { log, parsearArgs, silenciar } from './lib/log.ts';
import { obtenerPorRuta, parsearRutaCampo } from './lote.ts';
import { RAIZ } from './lib/rutas.ts';
import { claveDeCita, obtenerTextoDelCorpus, obtenerTranscripcionDelCorpus, verificarUna, type ObtenerTexto, type ObtenerTranscripcion } from './validadores/citas.ts';
import type { Problema } from './validadores/tipos.ts';

// ---------------------------------------------------------------------------
// Parte pura: encontrar fuentes `verificacion: manual` en un árbol de registros ya cargado.
// ---------------------------------------------------------------------------

/** Forma mínima de un registro que hace falta para recorrer sus fuentes (subconjunto de `Registro`). */
export interface RegistroLigero {
  coleccion: NombreColeccion;
  id: string;
  archivo: string;
  datos: Record<string, unknown>;
}

export interface FuenteManual {
  /** Id completo `<coleccion>/<id>`, el mismo formato que exige `afecta[]` en el esquema de correcciones. */
  registroId: string;
  coleccion: NombreColeccion;
  archivo: string;
  /** Ruta del campo dentro de `datos` (la misma que usa el validador de citas), ej. `dato_real.fuentes.0`. */
  ruta: string;
  fuente: FuenteMinima;
}

/** Recorre una lista de registros y devuelve cada fuente marcada `verificacion: manual`. Sin red. */
export function encontrarFuentesManuales(registros: RegistroLigero[]): FuenteManual[] {
  const salida: FuenteManual[] = [];
  for (const r of registros) {
    recorrerFuentes(r.datos, (fuente, ruta) => {
      if (fuente.verificacion === 'manual') {
        salida.push({ registroId: `${r.coleccion}/${r.id}`, coleccion: r.coleccion, archivo: r.archivo, ruta, fuente });
      }
    });
  }
  return salida;
}

// ---------------------------------------------------------------------------
// Cotejo: misma función que la etapa 5 del validador (`verificarUna`).
// ---------------------------------------------------------------------------

export type EstadoCotejo = 'cotejada' | 'no_cotejada' | 'no_se_pudo_leer';

export interface ResultadoCotejo {
  fm: FuenteManual;
  estado: EstadoCotejo;
  /** Motivo para humanos cuando no cotejó o no se pudo leer; ausente cuando `estado === 'cotejada'`. */
  motivo?: string;
  similitud?: number;
}

/** Umbral bajo el cual un "aproximada" ni siquiera vale la pena mostrar como cercano (mismo criterio que `citas.ts`). */
function formatoSimilitud(s: number | undefined): string {
  return s === undefined ? '?' : s.toFixed(2);
}

/**
 * Cotejo de una sola fuente manual, con la misma comparación que usa `pnpm validar --red`
 * (`verificarUna` de `scripts/validadores/citas.ts`). Nunca lanza: cualquier error se reporta como
 * `no_se_pudo_leer` para que una fuente con problemas no corte la corrida entera.
 *
 * Solo `exacta` se traduce a `cotejada`. `aproximada` queda como `no_cotejada`: limpiar
 * `verificacion: manual` con una cita que no calza literal dejaría un `documento_oficial` publicado
 * en el error que la etapa 5 marca para ese caso ("en un documento oficial publicado la cita tiene
 * que ser exacta"), que es el problema contrario al que este script viene a resolver.
 */
export async function cotejarFuenteManual(fm: FuenteManual, obtenerTexto: ObtenerTexto, obtenerTranscripcion: ObtenerTranscripcion): Promise<ResultadoCotejo> {
  try {
    const r = await verificarUna(fm.fuente, obtenerTexto, obtenerTranscripcion);
    if (r.estado === 'exacta') return { fm, estado: 'cotejada', similitud: r.similitud };
    if (r.estado === 'aproximada') {
      return { fm, estado: 'no_cotejada', motivo: `cita aproximada (similitud ${formatoSimilitud(r.similitud)}); revisala y copiala literal`, similitud: r.similitud };
    }
    if (r.estado === 'no_descargable') {
      return { fm, estado: 'no_se_pudo_leer', motivo: r.detalle ?? 'sin detalle' };
    }
    return { fm, estado: 'no_cotejada', motivo: `cita no encontrada en la fuente (similitud ${formatoSimilitud(r.similitud)})`, similitud: r.similitud };
  } catch (e) {
    return { fm, estado: 'no_se_pudo_leer', motivo: (e as Error).message };
  }
}

/** Texto de una fila de la tabla: "cotejada" | "no cotejada: <motivo>" | "no se pudo leer: <motivo>". */
export function formatoResultado(r: ResultadoCotejo): string {
  if (r.estado === 'cotejada') return 'cotejada';
  if (r.estado === 'no_cotejada') return `no cotejada: ${r.motivo}`;
  return `no se pudo leer: ${r.motivo}`;
}

// ---------------------------------------------------------------------------
// Orquestación: content/ (+ --inbox) → fuentes manuales → cotejo.
// ---------------------------------------------------------------------------

export interface OpcionesReverificar {
  rootDir?: string;
  inboxDir?: string;
  /** Inyectables en tests; por defecto, la misma lectura que `pnpm fuente` (`scripts/corpus/fuente.ts`). */
  obtenerTexto?: ObtenerTexto;
  obtenerTranscripcion?: ObtenerTranscripcion;
  progreso?: (mensaje: string) => void;
}

export interface ResultadoReverificar {
  resultados: ResultadoCotejo[];
  /** Problemas no fatales (ej. la carpeta de --inbox no existe, o algún YAML del inbox no valida). */
  problemas: Problema[];
}

/**
 * Corre la reverificación completa: carga `content/` (y `--inbox` si se pasa), encuentra las
 * fuentes `verificacion: manual` y las coteja una por una. La misma (url, cita, marca_tiempo) no se
 * vuelve a cotejar dentro de la misma corrida (se cachea en memoria; no toca `.cache/citas.json`,
 * que es del validador real, para no mezclar resultados de una corrida exploratoria con el caché
 * que usa `pnpm validar --red`).
 */
export async function reverificar(opciones: OpcionesReverificar = {}): Promise<ResultadoReverificar> {
  const rootDir = path.resolve(opciones.rootDir ?? RAIZ);
  const obtenerTexto = opciones.obtenerTexto ?? obtenerTextoDelCorpus;
  const obtenerTranscripcion = opciones.obtenerTranscripcion ?? obtenerTranscripcionDelCorpus;
  const progreso = opciones.progreso ?? ((): void => {});
  const problemas: Problema[] = [];

  const registros: RegistroLigero[] = [];
  const contenido = cargarContenido(rootDir);
  problemas.push(...contenido.errores);
  for (const r of contenido.registros) registros.push({ coleccion: r.coleccion, id: r.id, archivo: r.archivo, datos: r.datos });

  if (opciones.inboxDir) {
    const inboxAbsoluto = path.resolve(opciones.inboxDir);
    if (!existsSync(inboxAbsoluto)) {
      problemas.push({ archivo: aPosix(path.relative(rootDir, inboxAbsoluto)), campo: '(carpeta)', mensaje: 'No existe la carpeta del inbox.' });
    } else {
      const rInbox = cargarInbox(rootDir, inboxAbsoluto);
      problemas.push(...rInbox.errores);
      for (const r of rInbox.registros) registros.push({ coleccion: r.coleccion, id: r.id, archivo: r.archivo, datos: r.datos });
    }
  }

  const manuales = encontrarFuentesManuales(registros);
  // Caché en memoria por (url + cita + marca_tiempo): la misma fuente citada en dos registros no
  // se coteja dos veces en la misma corrida. Solo vive en memoria; no toca `.cache/citas.json`
  // (el caché del validador real) para no mezclar resultados de una corrida exploratoria con el
  // que usa `pnpm validar --red`.
  const cache = new Map<string, Omit<ResultadoCotejo, 'fm'>>();
  const resultados: ResultadoCotejo[] = [];
  let hechas = 0;
  for (const fm of manuales) {
    const clave = claveDeCita(fm.fuente);
    let base = cache.get(clave);
    if (!base) {
      const r = await cotejarFuenteManual(fm, obtenerTexto, obtenerTranscripcion);
      base = { estado: r.estado, motivo: r.motivo, similitud: r.similitud };
      cache.set(clave, base);
    }
    const resultado: ResultadoCotejo = { fm, ...base };
    hechas++;
    progreso(`[${hechas}/${manuales.length}] ${formatoResultado(resultado)} ${fm.fuente.url}`);
    resultados.push(resultado);
  }
  return { resultados, problemas };
}

// ---------------------------------------------------------------------------
// Parte pura: armar el registro de corrección a partir de lo que cotejó.
// ---------------------------------------------------------------------------

export interface CorreccionPropuesta {
  registroId: string;
  /** `_slug` del registro de corrección: `reverificacion-<slug del registro afectado>` (sin la colección). */
  slug: string;
  fuentesCotejadas: string[];
  /** Objeto crudo, listo para validar contra `esquemasPorColeccion.correcciones` (`validarContraEsquema`). */
  correccion: Record<string, unknown>;
}

/**
 * Agrupa los cotejos exitosos por registro y arma, por cada uno, un registro de corrección de tipo
 * `cotejo_con_primaria` (docs/colecciones/correcciones.md: "cotejar las notas contra [el registro
 * primario] es de tipo cotejo_con_primaria") con `desenlace: aceptada`, `afecta: [<id>]` y un
 * `cambios[]` que dice, campo por campo, qué fuente deja de ser manual. No incluye ninguna fuente
 * que no haya cotejado exacta, y no toca `revision.tier` del registro afectado: ese lo decide el
 * editor en `/correccion` (`docs/colecciones/correcciones.md`, "Sin compuerta humana").
 */
export function construirCorrecciones(resultados: ResultadoCotejo[], fecha: string): CorreccionPropuesta[] {
  const porRegistro = new Map<string, ResultadoCotejo[]>();
  for (const r of resultados) {
    if (r.estado !== 'cotejada') continue;
    const lista = porRegistro.get(r.fm.registroId) ?? [];
    lista.push(r);
    porRegistro.set(r.fm.registroId, lista);
  }

  const salida: CorreccionPropuesta[] = [];
  for (const [registroId, cotejos] of [...porRegistro.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    const medios = [...new Set(cotejos.map((c) => c.fm.fuente.medio))].sort();
    const cambios = cotejos
      .slice()
      .sort((a, b) => a.fm.ruta.localeCompare(b.fm.ruta))
      .map((c) => ({
        registro: registroId,
        campo: `${c.fm.ruta}.verificacion`,
        de: 'manual',
        a: 'eliminado (la cita ya se cotejó mecánicamente contra el texto de la fuente)',
      }));
    const listaMedios = medios.join(', ');
    const motivo =
      medios.length === 1
        ? `La fuente de ${listaMedios} que respalda este registro, hasta ahora marcada como no verificable mecánicamente, se pudo leer y cotejar contra la cita. Queda marcada como verificada; el nivel de evidencia y lo afirmado no cambian.`
        : `Las fuentes de ${listaMedios} que respaldan este registro, hasta ahora marcadas como no verificables mecánicamente, se pudieron leer y cotejar contra la cita. Quedan marcadas como verificadas; el nivel de evidencia y lo afirmado no cambian.`;

    // Mismo criterio que el id de la corrección publicada (`<fecha>-<_slug>`, docs/colecciones/
    // correcciones.md): el slug del registro afectado, sin la colección
    // ("giros/lacalle-pou/iva-2020" → "lacalle-pou-iva-2020").
    const slug = `reverificacion-${registroId.split('/').slice(1).join('-')}`;

    salida.push({
      registroId,
      slug,
      fuentesCotejadas: cotejos.map((c) => c.fm.fuente.url),
      correccion: {
        fecha,
        tipo: 'cotejo_con_primaria',
        desenlace: 'aceptada',
        afecta: [registroId],
        cambios,
        motivo,
        solicitante: 'detección interna (pnpm reverificar: cotejo mecánico de fuentes con verificacion: manual)',
        revision: { tier: 'publicado' },
      },
    });
  }
  return salida;
}

/**
 * Valida cada propuesta contra el esquema real de `correcciones` y le agrega `_slug` (el esquema
 * no lo admite, así que se valida sin él y se agrega después: `pnpm promover <dir> --correccion`
 * lo usa para derivar el id `<fecha>-<_slug>` sin tener que adivinarlo de `afecta`).
 * Nunca debería fallar; si falla, se reporta.
 */
export function validarCorrecciones(propuestas: CorreccionPropuesta[]): { validas: Record<string, unknown>[]; errores: Problema[] } {
  const validas: Record<string, unknown>[] = [];
  const errores: Problema[] = [];
  for (const p of propuestas) {
    const v = validarContraEsquema('correcciones', p.correccion, `reverificar:${p.registroId}`);
    if (v.datos) validas.push({ _slug: p.slug, ...v.datos });
    else errores.push(...v.errores);
  }
  return { validas, errores };
}

// ---------------------------------------------------------------------------
// Parte pura (con una lectura de content/ por registro afectado): el registro corregido en sí,
// sin `verificacion: manual` en las fuentes que cotejaron. El registro de corrección (arriba) solo
// documenta el cambio; sin esto, `pnpm promover <dir> --correccion <id>` publica la corrección pero
// no tiene qué escribir en `afecta`, y ninguna fuente sale de `probable` (ver cabecera del archivo).
// ---------------------------------------------------------------------------

export interface RegistroCorregidoPropuesta {
  /** `<coleccion>/<id>`, igual que `FuenteManual.registroId`. */
  registroId: string;
  coleccion: NombreColeccion;
  /** `_slug` elegido: el que hace que `derivarId` reproduzca el id publicado. */
  slug: string;
  /** Listo para `inbox/correcciones/<fecha>/<coleccion>.yaml`: con `_slug` y `_investigacion`, sin `procedencia`. */
  registro: Record<string, unknown>;
}

/**
 * `_slug` candidatos para que `derivarId` reproduzca el id publicado: el último segmento del id
 * (después de la última "/"), y ese mismo segmento sin el prefijo `<fecha>-` cuando lo tiene. La
 * mayoría de las colecciones arman su id como `<algo>/<fecha>-<slug>` (declaraciones, chequeos,
 * menciones, vetos, intervenciones, analisis, cobertura, discrepancias, votaciones) o `<fecha>-<slug>`
 * (correcciones): `derivarId` vuelve a anteponer `crudo.fecha` al `_slug`, así que pasarle el
 * segmento completo lo duplicaría. Las colecciones sin fecha en el id (politicos, empresas, eventos,
 * medios, giros, casos) ya quedan bien con el primer candidato, y patrimonio (`<politico>/<fecha>`,
 * sin slug) ni siquiera usa el `_slug` para derivar su id.
 */
export function slugsCandidatosParaId(id: string, fecha: unknown): string[] {
  const ultimo = id.includes('/') ? id.split('/').pop()! : id;
  const candidatos = [ultimo];
  if (typeof fecha === 'string' && fecha && ultimo.startsWith(`${fecha}-`) && ultimo.length > fecha.length + 1) {
    candidatos.push(ultimo.slice(fecha.length + 1));
  }
  return candidatos;
}

/** Quita `verificacion: manual` de la fuente en `ruta` (formato `dato_real.fuentes.0`, el de `FuenteManual.ruta`). Sin lanzar si la ruta ya no existe. */
function quitarVerificacionManual(datos: Record<string, unknown>, ruta: string): void {
  try {
    const fuente = obtenerPorRuta(datos, parsearRutaCampo(ruta));
    if (fuente && typeof fuente === 'object') delete (fuente as Record<string, unknown>).verificacion;
  } catch {
    /* la ruta ya no existe en este registro: nada que quitar (no debería pasar, se reporta si pasa) */
  }
}

/**
 * Por cada registro con al menos una fuente cotejada, relee el YAML publicado en `content/`, le
 * quita `procedencia` (la vuelve a escribir `pnpm promover`) y `verificacion: manual` solo de las
 * fuentes que cotejaron, y le agrega `_slug` e `_investigacion: {script: 'reverificar.ts'}`. No
 * toca `revision.tier`. Un registro que todavía no está publicado (viene de `--inbox`) no se puede
 * corregir así (`afecta` exige que el id ya exista en `content/`): se reporta y se salta, igual que
 * uno para el que ningún `_slug` candidato reproduce el id publicado.
 */
export function construirRegistrosCorregidos(rootDir: string, resultados: ResultadoCotejo[]): { propuestas: RegistroCorregidoPropuesta[]; problemas: Problema[] } {
  const problemas: Problema[] = [];
  const propuestas: RegistroCorregidoPropuesta[] = [];

  const porRegistro = new Map<string, ResultadoCotejo[]>();
  for (const r of resultados) {
    if (r.estado !== 'cotejada') continue;
    const lista = porRegistro.get(r.fm.registroId) ?? [];
    lista.push(r);
    porRegistro.set(r.fm.registroId, lista);
  }

  for (const [registroId, cotejos] of [...porRegistro.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    const { coleccion, archivo } = cotejos[0]!.fm;
    const id = registroId.slice(coleccion.length + 1);

    // Solo un registro ya publicado en content/ (archivo real, sin "#n" de inbox) se puede corregir
    // así: `afecta` exige que el id ya exista, y un registro de --inbox todavía no tiene archivo real.
    if (!archivo.startsWith('content/') || archivo.includes('#')) {
      problemas.push({
        archivo,
        campo: '(registro)',
        mensaje: `"${registroId}" no está publicado en content/ (viene de --inbox): no se le puede quitar verificacion: manual con una corrección hasta que se promueva por primera vez. Se deja como está.`,
      });
      continue;
    }

    let crudo: Record<string, any>;
    try {
      crudo = leerRegistroCrudo(path.join(rootDir, ...archivo.split('/')));
    } catch (e) {
      problemas.push({ archivo, campo: '(archivo)', mensaje: `No se pudo releer para armar el registro corregido: ${(e as Error).message}` });
      continue;
    }

    const copia = structuredClone(crudo) as Record<string, any>;
    delete copia.procedencia;
    for (const c of cotejos) quitarVerificacionManual(copia, c.fm.ruta);

    const candidatos = slugsCandidatosParaId(id, copia.fecha);
    const slug = candidatos.find((candidato) => derivarId(coleccion, { ...copia, _slug: candidato }, new Set()) === id) ?? null;
    if (slug === null) {
      problemas.push({
        archivo,
        campo: '(_slug)',
        mensaje: `Ningún _slug candidato (${candidatos.join(', ')}) hace que derivarId reproduzca el id publicado "${id}" para la colección "${coleccion}": no se escribe el registro corregido, hay que resolverlo a mano.`,
      });
      continue;
    }

    // Autochequeo contra el esquema real, con la misma inyección de placeholders que usa `pnpm
    // validar --inbox` (procedencia provisoria: la escribe promover, nunca este script) para poder
    // validar un registro sin procedencia. Nada de lo inyectado acá se escribe al archivo.
    const paraValidar = normalizarRegistroInbox(coleccion, copia, true);
    const v = validarContraEsquema(coleccion, paraValidar, archivo);
    if (!v.datos) {
      problemas.push(...v.errores);
      continue;
    }

    propuestas.push({
      registroId,
      coleccion,
      slug,
      registro: { _slug: slug, _investigacion: { script: 'reverificar.ts' }, ...copia },
    });
  }

  return { propuestas, problemas };
}

export interface ResultadoEscrituraRegistros {
  /** Uno por colección tocada (cada colección va a su propio `<coleccion>.yaml`). */
  archivos: { coleccion: NombreColeccion; archivo: string; agregadas: number; total: number }[];
}

/**
 * Escribe (o agrega a) `inbox/correcciones/<fecha>/<coleccion>.yaml`, un archivo por colección
 * (misma convención que `pnpm lote fusionar` deja `politicos.yaml` junto a `correcciones.yaml`).
 * No agrega un registro cuyo `_slug` ya esté en el archivo.
 */
export function escribirRegistrosCorregidos(rootDir: string, fecha: string, propuestas: RegistroCorregidoPropuesta[]): ResultadoEscrituraRegistros {
  const dir = path.join(rootDir, 'inbox', 'correcciones', fecha);
  mkdirSync(dir, { recursive: true });

  const porColeccion = new Map<NombreColeccion, RegistroCorregidoPropuesta[]>();
  for (const p of propuestas) {
    const lista = porColeccion.get(p.coleccion) ?? [];
    lista.push(p);
    porColeccion.set(p.coleccion, lista);
  }

  const archivos: ResultadoEscrituraRegistros['archivos'] = [];
  for (const [coleccion, items] of [...porColeccion.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    const archivo = path.join(dir, `${coleccion}.yaml`);
    let existentes: Record<string, unknown>[] = [];
    if (existsSync(archivo)) {
      const datos = parseYaml(readFileSync(archivo, 'utf8'));
      if (Array.isArray(datos)) existentes = datos as Record<string, unknown>[];
    }
    const slugsExistentes = new Set(existentes.map((e) => (e && typeof e === 'object' ? (e as Record<string, unknown>)._slug : undefined)).filter((s): s is string => typeof s === 'string'));
    const aAgregar = items.filter((it) => !slugsExistentes.has(it.slug)).map((it) => it.registro);
    const total = [...existentes, ...aAgregar];
    writeFileSync(archivo, stringifyYaml(total, { lineWidth: 100 }), 'utf8');
    archivos.push({ coleccion, archivo: aPosix(path.relative(rootDir, archivo)), agregadas: aAgregar.length, total: total.length });
  }
  return { archivos };
}

// ---------------------------------------------------------------------------
// Escritura: inbox/correcciones/<fecha>/correcciones.yaml (nunca content/).
// ---------------------------------------------------------------------------

export interface ResultadoEscritura {
  archivo: string;
  /** Carpeta del archivo, relativa a rootDir: el <dir> que después toma `pnpm promover`. */
  directorio: string;
  agregadas: number;
  total: number;
  /** Ids (`<fecha>-<_slug>`) de las correcciones agregadas en esta corrida, para armar el comando de `pnpm promover`. */
  idsAgregados: string[];
}

/**
 * Escribe (o agrega a) `inbox/correcciones/<fecha>/correcciones.yaml`, en la misma convención que
 * documenta `.claude/commands/correccion.md`: una lista YAML de registros de corrección crudos.
 * Nunca escribe en `content/`; aplicar la corrección sigue siendo `pnpm promover --correccion <id>`.
 * No agrega una corrección cuyo `afecta` ya esté cubierto por una entrada existente del archivo.
 */
export function escribirCorrecciones(rootDir: string, fecha: string, nuevas: Record<string, unknown>[]): ResultadoEscritura {
  const dir = path.join(rootDir, 'inbox', 'correcciones', fecha);
  mkdirSync(dir, { recursive: true });
  const archivo = path.join(dir, 'correcciones.yaml');

  let existentes: Record<string, unknown>[] = [];
  if (existsSync(archivo)) {
    const datos = parseYaml(readFileSync(archivo, 'utf8'));
    if (Array.isArray(datos)) existentes = datos as Record<string, unknown>[];
  }
  const afectaExistente = new Set<string>();
  for (const e of existentes) for (const a of Array.isArray(e.afecta) ? (e.afecta as string[]) : []) afectaExistente.add(a);

  const aAgregar = nuevas.filter((n) => !(Array.isArray(n.afecta) ? (n.afecta as string[]) : []).some((a) => afectaExistente.has(a)));
  const total = [...existentes, ...aAgregar];
  writeFileSync(archivo, stringifyYaml(total, { lineWidth: 100 }), 'utf8');
  const idsAgregados = aAgregar
    .map((n) => (typeof n._slug === 'string' && n._slug ? `${fecha}-${n._slug}` : undefined))
    .filter((id): id is string => id !== undefined);
  return { archivo: aPosix(path.relative(rootDir, archivo)), directorio: aPosix(path.relative(rootDir, dir)), agregadas: aAgregar.length, total: total.length, idsAgregados };
}

// ---------------------------------------------------------------------------
// Corrida: data/corridas/<fecha>-reverificacion[-N]/, con el rastro de esta pasada mecánica
// (CLAUDE.md, "Procedencia obligatoria"). Sin esto, `pnpm promover <dir> --correccion <id>` no
// tiene dónde escribir el rastro y se niega a promover (exige `data/corridas/<id>/brief.md`).
// ---------------------------------------------------------------------------

export interface ResultadoCorridaReverificacion {
  id: string;
  dir: string;
  /** Un `pnpm promover ... --correccion <id> --corrida <id-corrida>` por cada corrección nueva. */
  comandosPromover: string[];
}

/** Una línea de consultas.jsonl por fuente cotejada (el formato de data/corridas/README.md). */
function lineaConsulta(r: ResultadoCotejo): string {
  return JSON.stringify({ t: new Date().toISOString(), tipo: 'fuente', q: r.fm.fuente.url, resultado: formatoResultado(r) });
}

function brieveReverificacion(fecha: string, scriptSha: string, resultados: ResultadoCotejo[], propuestas: CorreccionPropuesta[]): string {
  const cotejadas = resultados.filter((r) => r.estado === 'cotejada').length;
  const noCotejadas = resultados.filter((r) => r.estado === 'no_cotejada').length;
  const noSePudoLeer = resultados.filter((r) => r.estado === 'no_se_pudo_leer').length;
  const registros = propuestas.map((p) => p.registroId);
  return [
    '# Corrida mecánica: reverificación de fuentes `verificacion: manual`',
    '',
    `Generada por \`pnpm reverificar --escribir\` (scripts/reverificar.ts, sha256 ${scriptSha}) el ${fecha}.`,
    '',
    'Qué hizo: recotejó cada fuente marcada `verificacion: manual` de content/ (y de `--inbox` si se pasó) con el lector de `pnpm fuente`, usando la misma comparación de citas que `pnpm validar --red` (`verificarUna` de scripts/validadores/citas.ts).',
    '',
    `Resultado: ${resultados.length} fuente(s) revisada(s), ${cotejadas} cotejada(s) exacta(s), ${noCotejadas} no cotejada(s), ${noSePudoLeer} no se pudo(-ieron) leer.`,
    '',
    `Registros con corrección propuesta (se retira \`verificacion: manual\` de la(s) fuente(s) que cotejó exacta, sin tocar lo afirmado ni el nivel de evidencia): ${registros.length ? registros.join(', ') : '(ninguno)'}.`,
    '',
    'Sin agente investigador ni crítico: ver critica.md.',
  ].join('\n');
}

/**
 * Crea la corrida de esta pasada (si hay al menos una corrección nueva) y arma, por cada una, el
 * comando completo de `pnpm promover` con `--corrida`. Solo se llama cuando `--escribir` de verdad
 * agregó algo a `correcciones.yaml`: sin corrección nueva no hay nada que promover, y crear una
 * corrida vacía cada vez que se corre `pnpm reverificar --escribir` sin novedades ensuciaría
 * `data/corridas/` sin ningún registro que la referencie.
 */
export function crearCorridaReverificacion(
  rootDir: string,
  fecha: string,
  resultados: ResultadoCotejo[],
  propuestas: CorreccionPropuesta[],
  escritura: ResultadoEscritura,
): ResultadoCorridaReverificacion {
  const scriptSha = hashDeArchivo(path.join(rootDir, 'scripts', 'reverificar.ts'));
  const { id, dir } = escribirCorridaDeScript(rootDir, {
    fecha,
    sufijo: 'reverificacion',
    brief: brieveReverificacion(fecha, scriptSha, resultados, propuestas),
    consultas: resultados.map(lineaConsulta),
    motivoSinCritica:
      'Corrección mecánica: sin crítica; ver brief.md. El cambio es retirar `verificacion: manual` de una fuente que ya cotejó exacta contra el texto (misma comparación que `pnpm validar --red`), sin tocar lo afirmado ni el nivel de evidencia del registro.',
    motivoSinRazones: 'corrección mecánica generada por script (pnpm reverificar --escribir); ver brief.md.',
  });
  const comandosPromover = escritura.idsAgregados.map((idCorreccion) => `pnpm promover ${escritura.directorio} --correccion ${idCorreccion} --corrida ${id}`);
  return { id, dir, comandosPromover };
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const AYUDA = `pnpm reverificar [--inbox <dir>] [--escribir] [--json]

Reintenta cada fuente 'verificacion: manual' de content/ (y de --inbox <dir> si se pasa) con el
lector de hoy (planillas, zip, respuestas de API) y coteja la cita contra el texto, con la misma
comparacion que 'pnpm validar --red'.

  --inbox <dir>  ademas de content/, revisa esa carpeta del inbox (formato de 'pnpm validar --inbox').
  --escribir     por cada registro con al menos una fuente que cotejo, escribe (o agrega a) dos
                 cosas en inbox/correcciones/<fecha>/: en correcciones.yaml, un registro de
                 correccion (con '_slug: reverificacion-<slug del registro afectado>') de tipo
                 'cotejo_con_primaria', desenlace 'aceptada', que documenta que fuentes dejan de ser
                 manuales; y en <coleccion>.yaml, el registro afectado releido de content/, con
                 'verificacion: manual' ya quitado de esas fuentes ('_slug' e '_investigacion:
                 {script: reverificar.ts}' agregados, sin 'procedencia': la escribe promover). Si un
                 registro no esta publicado en content/ (viene de --inbox) o ningun _slug candidato
                 reproduce su id con derivarId, se avisa y se deja sin escribir (la correccion
                 documental sigue saliendo igual). Si hay al menos una correccion nueva, tambien crea
                 data/corridas/<fecha>-reverificacion/ (brief, consultas.jsonl, critica.md y
                 razones.md ya escritos: es una corrida mecanica, sin agente ni critico) e imprime el
                 comando completo y funcional ('pnpm promover <dir> --correccion <id> --corrida
                 <id-corrida>') para cada correccion nueva, que valida y la escribe en
                 content/correcciones/ antes de aplicar 'afecta' (con el registro corregido ya en el
                 mismo <dir>, ese 'afecta' de verdad saca la fuente de 'probable'). No aplica nada a
                 content/ por su cuenta. Tampoco cambia revision.tier de los registros afectados: esa
                 decision es del editor en /correccion.
  --json         salida por maquina en vez de tabla de texto.

Codigo de salida: 0 si la corrida termino (aunque haya fuentes que no cotejaron); 2 si fallo la
infraestructura (no se pudo leer content/, o una excepcion no prevista).`;

interface FilaJson {
  registro: string;
  url: string;
  estado: EstadoCotejo;
  motivo?: string;
}

async function main(): Promise<void> {
  const { opciones } = parsearArgs(process.argv.slice(2));
  if (opciones.ayuda || opciones.help) {
    console.log(AYUDA);
    process.exit(0);
  }
  const json = opciones.json === true;
  if (json) silenciar();
  const inboxDir = typeof opciones.inbox === 'string' ? opciones.inbox : undefined;
  const escribir = opciones.escribir === true;

  try {
    const rootDir = RAIZ;
    const { resultados, problemas } = await reverificar({
      rootDir,
      inboxDir,
      progreso: json ? undefined : (msg) => log.info(msg),
    });

    const filas = [...resultados].sort((a, b) => a.fm.registroId.localeCompare(b.fm.registroId) || a.fm.fuente.url.localeCompare(b.fm.fuente.url));
    const cotejadas = resultados.filter((r) => r.estado === 'cotejada').length;
    const noCotejadas = resultados.filter((r) => r.estado === 'no_cotejada').length;
    const noSePudoLeer = resultados.filter((r) => r.estado === 'no_se_pudo_leer').length;

    let escritura: ResultadoEscritura | undefined;
    let propuestas: CorreccionPropuesta[] = [];
    let erroresCorreccion: Problema[] = [];
    let corrida: ResultadoCorridaReverificacion | undefined;
    let escrituraRegistros: ResultadoEscrituraRegistros | undefined;
    let problemasRegistros: Problema[] = [];
    if (escribir) {
      propuestas = construirCorrecciones(resultados, hoyISO());
      const v = validarCorrecciones(propuestas);
      erroresCorreccion = v.errores;
      if (v.validas.length) escritura = escribirCorrecciones(rootDir, hoyISO(), v.validas);

      // El registro de corrección de arriba solo documenta el cambio; esto es lo que de verdad saca
      // la fuente de `probable`: el registro afectado, sin `verificacion: manual`, listo para que
      // `pnpm promover ... --correccion` lo aplique con `afecta`.
      const rc = construirRegistrosCorregidos(rootDir, resultados);
      problemasRegistros = rc.problemas;
      if (rc.propuestas.length) escrituraRegistros = escribirRegistrosCorregidos(rootDir, hoyISO(), rc.propuestas);

      // Solo si de verdad hay algo nuevo que promover: sin corrección nueva, crear una corrida acá
      // dejaría una carpeta sin ningún registro que la referencie.
      if (escritura && escritura.agregadas > 0) {
        corrida = crearCorridaReverificacion(rootDir, hoyISO(), resultados, propuestas, escritura);
      }
    }

    if (json) {
      const salida = {
        resultados: filas.map((r): FilaJson => ({ registro: r.fm.registroId, url: r.fm.fuente.url, estado: r.estado, motivo: r.motivo })),
        resumen: { revisadas: resultados.length, cotejadas, no_cotejadas: noCotejadas, no_se_pudo_leer: noSePudoLeer, registros_con_correccion: propuestas.length },
        problemas,
        ...(escribir
          ? {
              escritura: escritura
                ? {
                    archivo: escritura.archivo,
                    agregadas: escritura.agregadas,
                    total: escritura.total,
                    registros: propuestas.map((p) => p.registroId),
                    corrida: corrida?.id ?? null,
                    comandos_promover: corrida?.comandosPromover ?? escritura.idsAgregados.map((id) => `pnpm promover ${escritura!.directorio} --correccion ${id}`),
                  }
                : null,
              errores_correccion: erroresCorreccion,
              registros_corregidos: escrituraRegistros?.archivos ?? [],
              problemas_registros_corregidos: problemasRegistros,
              nota: 'no se cambio revision.tier de ningun registro afectado: esa decision es del editor en /correccion.',
            }
          : {}),
      };
      process.stdout.write(JSON.stringify(salida, null, 1) + '\n');
      process.exit(0);
    }

    const lineas: string[] = [];
    lineas.push('registro  ·  url  ·  resultado');
    for (const r of filas) lineas.push(`${r.fm.registroId}  ·  ${r.fm.fuente.url}  ·  ${formatoResultado(r)}`);
    if (filas.length === 0) lineas.push('(sin fuentes verificacion: manual en el árbol revisado)');
    lineas.push('');
    lineas.push(`resumen: ${resultados.length} fuente(s) manual(es) revisada(s), ${cotejadas} cotejada(s), ${noCotejadas} no cotejada(s), ${noSePudoLeer} no se pudo(-ieron) leer.`);
    if (problemas.length) lineas.push(`problemas al cargar registros: ${problemas.length} (no impiden la corrida; ver detalle con --json).`);

    if (escribir) {
      if (escritura && escritura.agregadas > 0 && corrida) {
        lineas.push(`escrito ${escritura.archivo}: ${escritura.agregadas} corrección(es) nueva(s) (${escritura.total} en el archivo).`);
        if (escrituraRegistros?.archivos.length) {
          for (const a of escrituraRegistros.archivos) lineas.push(`escrito ${a.archivo}: ${a.agregadas} registro(s) corregido(s) nuevo(s) (${a.total} en el archivo).`);
        }
        if (problemasRegistros.length) {
          lineas.push(`${problemasRegistros.length} registro(s) con corrección propuesta que no se pudieron escribir corregidos (ver --json): quedan con la corrección documental pero sin que salga la fuente de 'probable'.`);
        }
        lineas.push(`corrida: data/corridas/${corrida.id}/ (mecánica, sin agente ni crítico: brief.md, consultas.jsonl, critica.md y razones.md ya escritos).`);
        lineas.push('nota: ninguna corrección cambia revision.tier de los registros afectados; esa decisión es del editor en /correccion cuando el registro ya no tenga fuentes manuales.');
        lineas.push('para aplicar cada una (valida y escribe content/correcciones/<id>.yaml, después afecta/agrega):');
        for (const c of corrida.comandosPromover) lineas.push(`  ${c}`);
      } else if (escritura) {
        lineas.push(`${escritura.archivo} ya tenía corrección para todos los registros que cotejaron: no se agregó nada nuevo.`);
      } else if (erroresCorreccion.length) {
        lineas.push(`no se escribió ninguna corrección: ${erroresCorreccion.length} problema(s) de esquema (ver --json).`);
      } else {
        lineas.push('ninguna fuente manual cotejó exacta: no se escribió ninguna corrección.');
      }
    }
    process.stdout.write(lineas.join('\n') + '\n');
    process.exit(0);
  } catch (e) {
    log.error((e as Error).message);
    process.exit(2);
  }
}

const esEntrada = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (esEntrada) main();
