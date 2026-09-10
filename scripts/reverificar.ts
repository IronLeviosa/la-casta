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
import { aPosix, cargarContenido, hoyISO, recorrerFuentes, validarContraEsquema, type FuenteMinima } from './lib/contenido.ts';
import { cargarInbox } from './lib/inbox.ts';
import { log, parsearArgs, silenciar } from './lib/log.ts';
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

    salida.push({
      registroId,
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

/** Valida cada propuesta contra el esquema real de `correcciones`. Nunca debería fallar; si falla, se reporta. */
export function validarCorrecciones(propuestas: CorreccionPropuesta[]): { validas: Record<string, unknown>[]; errores: Problema[] } {
  const validas: Record<string, unknown>[] = [];
  const errores: Problema[] = [];
  for (const p of propuestas) {
    const v = validarContraEsquema('correcciones', p.correccion, `reverificar:${p.registroId}`);
    if (v.datos) validas.push(v.datos);
    else errores.push(...v.errores);
  }
  return { validas, errores };
}

// ---------------------------------------------------------------------------
// Escritura: inbox/correcciones/<fecha>/correcciones.yaml (nunca content/).
// ---------------------------------------------------------------------------

export interface ResultadoEscritura {
  archivo: string;
  agregadas: number;
  total: number;
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
  return { archivo: aPosix(path.relative(rootDir, archivo)), agregadas: aAgregar.length, total: total.length };
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const AYUDA = `pnpm reverificar [--inbox <dir>] [--escribir] [--json]

Reintenta cada fuente 'verificacion: manual' de content/ (y de --inbox <dir> si se pasa) con el
lector de hoy (planillas, zip, respuestas de API) y coteja la cita contra el texto, con la misma
comparacion que 'pnpm validar --red'.

  --inbox <dir>  ademas de content/, revisa esa carpeta del inbox (formato de 'pnpm validar --inbox').
  --escribir     por cada registro con al menos una fuente que cotejo, escribe (o agrega a)
                 inbox/correcciones/<fecha>/correcciones.yaml un registro de correccion de tipo
                 'cotejo_con_primaria', desenlace 'aceptada', que solo quita 'verificacion: manual'
                 de esas fuentes. No aplica nada a content/: eso sigue siendo
                 'pnpm promover <dir> --correccion <id>'. Tampoco cambia revision.tier de los
                 registros afectados: esa decision es del editor en /correccion.
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
    if (escribir) {
      propuestas = construirCorrecciones(resultados, hoyISO());
      const v = validarCorrecciones(propuestas);
      erroresCorreccion = v.errores;
      if (v.validas.length) escritura = escribirCorrecciones(rootDir, hoyISO(), v.validas);
    }

    if (json) {
      const salida = {
        resultados: filas.map((r): FilaJson => ({ registro: r.fm.registroId, url: r.fm.fuente.url, estado: r.estado, motivo: r.motivo })),
        resumen: { revisadas: resultados.length, cotejadas, no_cotejadas: noCotejadas, no_se_pudo_leer: noSePudoLeer, registros_con_correccion: propuestas.length },
        problemas,
        ...(escribir
          ? {
              escritura: escritura
                ? { archivo: escritura.archivo, agregadas: escritura.agregadas, total: escritura.total, registros: propuestas.map((p) => p.registroId) }
                : null,
              errores_correccion: erroresCorreccion,
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
      if (escritura && escritura.agregadas > 0) {
        lineas.push(`escrito ${escritura.archivo}: ${escritura.agregadas} corrección(es) nueva(s) (${escritura.total} en el archivo).`);
        lineas.push('nota: ninguna corrección cambia revision.tier de los registros afectados; esa decisión es del editor en /correccion cuando el registro ya no tenga fuentes manuales.');
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
