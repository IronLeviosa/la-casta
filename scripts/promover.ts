/**
 * `pnpm promover <inbox-run-dir> [--corrida <id>] [--modelo <id>] [--solo-crudo] [--simulacion]`
 *
 * Único camino de `inbox/` a `content/`. Por cada registro de las listas YAML de
 * la corrida:
 *
 *   1. quita los campos `_` (los del investigador), normaliza marcas de tiempo;
 *   2. le asigna id según la convención de su colección (fecha + slug);
 *   3. le escribe `procedencia`: {corrida, agente, agente_sha, modelo, brief_sha, fecha} normalmente,
 *      o {corrida, script, script_sha, brief_sha, fecha, modelo?} si el crudo trae
 *      `_investigacion: {script: <ruta en scripts/>}` en vez de agente (ver AYUDA más abajo);
 *   4. lo valida contra su esquema y lo escribe en `content/<coleccion>/<id>.yaml`,
 *      **sin sobreescribir nunca** un archivo existente.
 *
 * Y deja el rastro de la corrida en `data/corridas/<id>/`: `crudo/` (lo que
 * escribió el investigador, antes de tocarlo), `consultas.jsonl`, `agentes.json`
 * (hashes de CLAUDE.md y de todos los agentes y comandos) y `edicion.diff`
 * (crudo vs. lo que se promueve). Si el diff no es vacío, exige `razones.md`.
 *
 * `pnpm promover --deshacer <id-corrida> [--simulacion]`
 *
 * Deshace lo que esta misma corrida promovió y todavía no se commiteó: es la salida cuando
 * `pnpm revisar <dir> despues` promueve y el chequeo de `content/` que corre después (`validar
 * --breve`, o `pnpm build`) falla por algo que el modo --inbox no había marcado como error (caso
 * real: la corrida de Astori del 2026-09-16, ver el comentario de cabecera de
 * `scripts/validadores/tiers.ts`). Antes de esto, la única forma de deshacerlo era borrar a mano
 * con git, arriesgando llevarse por delante el contenido de otra corrida que promovió en paralelo.
 * Nunca toca nada ya commiteado (ver `deshacerPromocion` más abajo).
 *
 * `pnpm promover --resellar <id-corrida> [--simulacion]`
 *
 * Recalcula `brief_sha`/`agente_sha`/`script_sha` con el hash normalizado (ver `hashDeArchivo` en
 * `scripts/lib/corridas.ts`) y reescribe solo esos campos, línea por línea, en los registros de
 * `content/` de esa corrida y en su `agentes.json`, cuando el archivo original se escribió con
 * CRLF y el hash guardado quedó siendo el de esa copia (ver `resellarCorrida` más abajo).
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';
import { definicionDeColeccion, type NombreColeccion } from '../src/schemas/comunes';
import { aPosix, cargarContenido, validarContraEsquema } from './lib/contenido.ts';
import {
  archivoDeAgente,
  carpetaCorrida,
  commitActual,
  hashDeArchivo,
  hashDeContenido,
  hashesDeInstrucciones, instruccionesSinCommitear,
  idCorridaDesdeInbox,
  leerAgentesJson,
  leerInstruccionesCongeladas,
  PATRON_ID_CORRIDA,
  type AgentesJson,
  type InstruccionesCongeladas,
} from './lib/corridas.ts';
import { diffUnificado } from './lib/diff.ts';
import { cambios, contenidoEnCommit, esRepoGit } from './lib/git.ts';
import { AGENTE_POR_COLECCION, asegurarCrudo, derivarId, leerArchivosInbox, normalizarRegistroInbox } from './lib/inbox.ts';
import { log, parsearArgs } from './lib/log.ts';
import { agentesDeCorrida, modeloDeUltimoAgente } from './agentes.ts';
import { RAIZ } from './lib/rutas.ts';
import { REFERENCIAS } from './validadores/referencias.ts';
import type { Problema } from './validadores/tipos.ts';

export interface OpcionesPromover {
  rootDir?: string;
  /** Id de la corrida; si falta, se deriva de la ruta del inbox. */
  corrida?: string;
  /** Modelo a usar cuando un registro no trae `_investigacion.modelo`. */
  modelo?: string;
  /** Calcular todo sin escribir nada. */
  simulacion?: boolean;
  /** Congelar crudo/ y consultas.jsonl y salir, sin promover: se corre antes de que edite el editor. */
  soloCrudo?: boolean;
  /**
   * Id de un registro de `content/correcciones/`. Habilita sobreescribir los registros que esa
   * corrección declara en `afecta`, y les escribe `procedencia: {tipo: correccion, correccion}`.
   * Es el único camino por el que un registro ya publicado cambia.
   *
   * Si `content/correcciones/<id>.yaml` todavía no existe, se busca ese id (o, con `true` y sin
   * id, el único registro que haya) en `correcciones.yaml` dentro de `inboxDir`; si valida contra
   * el esquema, se escribe ahí (con `revision.tier: publicado`, sin `procedencia`: el esquema no
   * la admite) antes de aplicar `afecta`/`agrega` con el resto del directorio. Es el camino que
   * les faltaba a `pnpm reverificar --escribir` y `pnpm lote fusionar`, que solo dejan crudo en
   * `inbox/` (regla 9) y no pueden escribir en `content/` por su cuenta.
   */
  correccion?: string | true;
}

export interface RegistroPromovido {
  coleccion: NombreColeccion;
  id: string;
  /** Ruta destino relativa a la raíz. */
  destino: string;
  origen: string;
  agente: string;
  modelo: string;
}

export interface ResultadoPromover {
  corrida: string;
  corridaDir: string;
  promovidos: RegistroPromovido[];
  errores: Problema[];
  /** Diff crudo → promovido (vacío si el editor no tocó nada). */
  diff: string;
  /** true si solo se congeló el crudo y no se promovió nada. */
  soloCrudo?: boolean;
  /** Registros del lote que la corrección no declara y por eso no se tocaron. */
  ignorados?: string[];
  /** Artefactos escritos en data/corridas/<id>/. */
  artefactos: string[];
  /** true si no se escribió nada (simulación o errores). */
  simulado: boolean;
  /**
   * Id de una corrección que no existía en `content/correcciones/` y se escribió recién, tomada de
   * `correcciones.yaml` del propio inboxDir. Ausente si `--correccion` apuntaba a una ya publicada.
   */
  correccionEscrita?: string;
  /**
   * Pares `{de, a}` de un cambio de id (`reemplaza` en lista, docs/plan-correcciones-id.md)
   * aplicados por esta corrida, o que se aplicarían en `--simulacion`. Ausente si la corrección no
   * trae `reemplaza` en pares.
   */
  paresReemplazo?: ParDeReemplazo[];
  /** Registros de content/ cuyas referencias a algún `de` de `paresReemplazo` se reescribieron al `a`. */
  referenciasReescritas?: ReferenciaContenidoReescrita[];
}

function yamlDeRegistro(datos: Record<string, unknown>): string {
  return stringifyYaml(datos, { lineWidth: 100 });
}

/** Representación estable de una lista de registros, para el diff. */
function yamlDeLista(items: Record<string, unknown>[]): string {
  return items.length ? stringifyYaml(items, { lineWidth: 100, sortMapEntries: true }) : '';
}

/** Copia sin `procedencia` (la escribe la máquina; no es una edición del editor). */
function sinProcedencia(datos: Record<string, any>): Record<string, any> {
  const copia = structuredClone(datos);
  delete copia.procedencia;
  return copia;
}

// ---------------------------------------------------------------------------
// Cambio de id en pares (docs/plan-correcciones-id.md): `reemplaza: {de, a}[]`
// ---------------------------------------------------------------------------

export interface ParDeReemplazo {
  /** Id completo `<coleccion>/<id>` que esta corrección retira de content/. */
  de: string;
  /** Id completo `<coleccion>/<id>` que lo reemplaza. */
  a: string;
}

/** `<coleccion>/<id>` → `{coleccion, id}` (id relativo a la colección, con `/` si tiene carpeta). */
function partirIdCompleto(idCompleto: string): { coleccion: NombreColeccion; id: string } {
  const [coleccion, ...resto] = idCompleto.split('/');
  return { coleccion: coleccion as NombreColeccion, id: resto.join('/') };
}

function rutaDeIdCompleto(rootDir: string, idCompleto: string): string {
  const { coleccion, id } = partirIdCompleto(idCompleto);
  const def = definicionDeColeccion(coleccion);
  const segmentos = id.split('/');
  segmentos[segmentos.length - 1] = `${segmentos[segmentos.length - 1]}.${def.extension}`;
  return path.join(rootDir, ...def.carpeta.split('/'), ...segmentos);
}

/**
 * Reemplaza, dentro de `obj`, toda ocurrencia exacta de `idViejo` en el campo que describe
 * `segmentos` (sintaxis de `REFERENCIAS`: `campo`, `campo[]` o `campo[].sub`). Devuelve cuántas
 * reemplazó. Misma lógica que `reemplazarEnRuta`/`contarEnRuta` de `scripts/lote.ts` (que hace lo
 * mismo dentro de un lote del inbox); se duplica acá, más chica, para no acoplar `promover` a los
 * subcomandos de `lote`.
 */
function reemplazarReferenciaEnObjeto(obj: any, segmentos: string[], idViejo: string, idNuevo: string): number {
  if (!obj || typeof obj !== 'object') return 0;
  const [paso, ...resto] = segmentos;
  const esLista = paso.endsWith('[]');
  const clave = esLista ? paso.slice(0, -2) : paso;
  if (esLista) {
    const arr = obj[clave];
    if (!Array.isArray(arr)) return 0;
    let total = 0;
    arr.forEach((item: any, i: number) => {
      if (resto.length === 0) {
        if (item === idViejo) {
          arr[i] = idNuevo;
          total++;
        }
      } else {
        total += reemplazarReferenciaEnObjeto(item, resto, idViejo, idNuevo);
      }
    });
    return total;
  }
  if (resto.length === 0) {
    if (obj[clave] === idViejo) {
      obj[clave] = idNuevo;
      return 1;
    }
    return 0;
  }
  return reemplazarReferenciaEnObjeto(obj[clave], resto, idViejo, idNuevo);
}

/** Cuántas veces aparece `id` en `obj` siguiendo `segmentos`, sin escribir nada (misma sintaxis que arriba). */
function contarReferenciaEnObjeto(obj: any, segmentos: string[], id: string): number {
  if (!obj || typeof obj !== 'object') return 0;
  const [paso, ...resto] = segmentos;
  const esLista = paso.endsWith('[]');
  const clave = esLista ? paso.slice(0, -2) : paso;
  if (esLista) {
    const arr = obj[clave];
    if (!Array.isArray(arr)) return 0;
    let total = 0;
    for (const item of arr) total += resto.length === 0 ? (item === id ? 1 : 0) : contarReferenciaEnObjeto(item, resto, id);
    return total;
  }
  if (resto.length === 0) return obj[clave] === id ? 1 : 0;
  return contarReferenciaEnObjeto(obj[clave], resto, id);
}

/**
 * Antes de escribir nada de un par de reemplazo del lote: si el registro que se está por promover
 * (`archivo.coleccion`, ya con su id derivado) referencia, en algún campo de `REFERENCIAS`, el id
 * viejo (`idViejo`, relativo a `coleccionDestino`) de un par, lo reescribe al nuevo. Es lo que le
 * pasa a un chequeo que el editor dejó con `declaracion: <id viejo>` en el mismo lote que trae la
 * declaración corregida: sin esto, el chequeo se promovería apuntando a un id que ya no existe.
 */
function reescribirReferenciasDelLotePorPares(coleccionOrigen: NombreColeccion, datos: Record<string, any>, pares: ParDeReemplazo[]): void {
  const refs = REFERENCIAS[coleccionOrigen] ?? {};
  for (const [rutaCampo, destino] of Object.entries(refs)) {
    for (const par of pares) {
      const { coleccion: colDe, id: idDeRelativo } = partirIdCompleto(par.de);
      if (colDe !== destino) continue;
      const { id: idARelativo } = partirIdCompleto(par.a);
      reemplazarReferenciaEnObjeto(datos, rutaCampo.split('.'), idDeRelativo, idARelativo);
    }
  }
}

/**
 * Reemplaza, en el texto crudo de un registro de `content/`, cada línea que termina en `idViejo`
 * como valor de un campo escalar (`campo: idViejo`) o como ítem de una lista (`- idViejo`), por
 * `idNuevo`. Sin re-serializar el YAML: reemplazo de la cadena exacta línea por línea, igual que
 * `reemplazarHashDeProcedencia` más abajo para los hashes de procedencia. Devuelve el texto y
 * cuántas ocurrencias reemplazó.
 */
function reemplazarIdEnTexto(texto: string, idViejo: string, idNuevo: string): { texto: string; cantidad: number } {
  const escapado = idViejo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const patron = new RegExp(`(^[ \\t]*(?:[A-Za-z0-9_]+:|-)[ \\t]*)${escapado}([ \\t]*)$`, 'gm');
  let cantidad = 0;
  const nuevo = texto.replace(patron, (_m, pre, post) => {
    cantidad++;
    return `${pre}${idNuevo}${post}`;
  });
  return { texto: nuevo, cantidad };
}

export interface ReferenciaContenidoReescrita {
  /** Archivo de content/ (relativo a la raíz) cuyas referencias se reescribieron. */
  archivo: string;
  /** Cuántas ocurrencias de algún `de` se reemplazaron por su `a` en ese archivo. */
  cantidad: number;
}

/**
 * Recorre TODO `content/` (con `cargarContenido`, ya validado por esquema) y reescribe, por la
 * tabla `REFERENCIAS`, cada campo que apunte a un `de` de `pares` por su `a` correspondiente.
 * En `simulacion: true` calcula y devuelve la lista sin escribir nada. Verifica, por archivo y por
 * campo, que la cantidad de reemplazos en el texto coincida con la cantidad que la lectura
 * estructurada (`contarReferenciaEnObjeto`) esperaba, y se niega si no: mejor cortar que reemplazar
 * a ciegas una coincidencia de texto que no era la que se buscaba.
 */
function reescribirReferenciasEnContenido(rootDir: string, pares: ParDeReemplazo[], simulacion: boolean): ReferenciaContenidoReescrita[] {
  const contenido = cargarContenido(rootDir);
  const salida: ReferenciaContenidoReescrita[] = [];
  for (const reg of contenido.registros) {
    const refs = REFERENCIAS[reg.coleccion] ?? {};
    if (!Object.keys(refs).length) continue;
    const abs = path.join(rootDir, ...reg.archivo.split('/'));
    let texto = readFileSync(abs, 'utf8');
    let totalArchivo = 0;
    for (const [rutaCampo, destino] of Object.entries(refs)) {
      for (const par of pares) {
        const { coleccion: colDe, id: idDeRelativo } = partirIdCompleto(par.de);
        if (colDe !== destino) continue;
        const ocurrencias = contarReferenciaEnObjeto(reg.datos, rutaCampo.split('.'), idDeRelativo);
        if (ocurrencias === 0) continue;
        const { id: idARelativo } = partirIdCompleto(par.a);
        const { texto: nuevo, cantidad } = reemplazarIdEnTexto(texto, idDeRelativo, idARelativo);
        if (cantidad !== ocurrencias) {
          throw new Error(
            `${reg.archivo}: se esperaba reemplazar ${ocurrencias} ocurrencia(s) de "${idDeRelativo}" (campo "${rutaCampo}"), se encontraron ${cantidad} en el texto.`,
          );
        }
        texto = nuevo;
        totalArchivo += cantidad;
      }
    }
    if (totalArchivo > 0) {
      parseYaml(texto); // confirma que el archivo sigue siendo YAML válido antes de escribirlo
      if (!simulacion) writeFileSync(abs, texto, 'utf8');
      salida.push({ archivo: reg.archivo, cantidad: totalArchivo });
    }
  }
  return salida;
}

/**
 * Resuelve `_investigacion.script` a la ruta `scripts/<script>` y la valida: tiene que existir y
 * no salirse de `scripts/` (por ejemplo hacia `.cache/`, que está gitignored: un SHA de un archivo
 * que no llega al repo no lo puede verificar nadie). Devuelve la ruta relativa a la raíz
 * ("scripts/generar-suplentes.ts") y el nombre canónico dentro de scripts/ ("generar-suplentes.ts"),
 * o null si no es válida.
 */
function resolverScript(rootDir: string, scriptCrudo: string): { relRepo: string; nombre: string } | null {
  const absoluto = path.resolve(rootDir, 'scripts', scriptCrudo);
  const relRepo = aPosix(path.relative(rootDir, absoluto));
  if (!relRepo.startsWith('scripts/') || relRepo.includes('/.cache/') || !existsSync(absoluto)) return null;
  return { relRepo, nombre: relRepo.slice('scripts/'.length) };
}

export interface ResultadoArmarAgentesJson {
  agentesJson: AgentesJson;
  /**
   * Archivos de instrucciones cuyo hash actual difiere del que quedó congelado en
   * `instrucciones.json` (vacío si no hay congelado, o si nada cambió).
   */
  archivosCambiados: string[];
}

/**
 * Arma el `AgentesJson` que `promover` escribe en `data/corridas/<id>/agentes.json`, a partir de lo
 * que se promovió en esta tanda (`shaAgente`, `modelosPorAgente`, `shaScript`) y de lo que ya
 * hubiera de una tanda anterior de la misma corrida. Función pura (solo lee, nunca escribe) para
 * poder probarla sin pasar por `promover()` entero.
 *
 * Si `congeladas` viene (de `leerInstruccionesCongeladas`, corrida con brief posterior al
 * congelado), `commit`, `archivos` y `archivos_sin_commitear` son los que se congelaron al armar el
 * brief, no los de ahora: son las instrucciones que el agente realmente leyó. Si además algún hash
 * actual no coincide con el congelado, se agrega `archivos_cambiados_durante_la_corrida` (defecto 2
 * del piloto de Astori, 2026-09-16: una regla cambió mientras la corrida seguía abierta). Sin
 * `congeladas` (corrida anterior al congelado), el comportamiento es el de siempre: hashes de ahora.
 */
export function armarAgentesJson(
  rootDir: string,
  corridaDir: string,
  congeladas: InstruccionesCongeladas | null,
  shaAgente: Map<string, { archivo: string; sha256: string }>,
  modelosPorAgente: Map<string, string>,
  shaScript: Map<string, { archivo: string; sha256: string; insumos: Record<string, string> }>,
): ResultadoArmarAgentesJson {
  // Una corrida se puede promover en varias tandas: por tramos de período, o porque el crítico
  // escribió `cobertura.yaml` después de que el investigador ya hubiera entregado. Cada tanda ve
  // solo los agentes (o scripts) de sus propios registros, así que reemplazar el mapa hace que la
  // última borre a los anteriores y los registros ya promovidos queden apuntando a un agente que
  // `agentes.json` no declara. Por eso se acumula sobre lo que ya hubiera.
  const previoJson = ((): AgentesJson | null => {
    const p = path.join(corridaDir, 'agentes.json');
    if (!existsSync(p)) return null;
    try {
      return JSON.parse(readFileSync(p, 'utf8')) as AgentesJson;
    } catch {
      return null;
    }
  })();
  const scripts: NonNullable<AgentesJson['scripts']> = {
    ...(previoJson?.scripts ?? {}),
    ...Object.fromEntries(
      [...shaScript.entries()].map(([nombre, info]) => [
        nombre,
        { archivo: info.archivo, sha256: info.sha256, ...(Object.keys(info.insumos).length ? { insumos: info.insumos } : {}) },
      ]),
    ),
  };

  let commit: string | null;
  let archivos: Record<string, string>;
  let archivosSinCommitear: string[];
  let archivosCambiados: string[] = [];
  if (congeladas) {
    commit = congeladas.commit;
    archivos = congeladas.archivos;
    archivosSinCommitear = congeladas.archivos_sin_commitear ?? [];
    const actuales = hashesDeInstrucciones(rootDir);
    const claves = new Set([...Object.keys(congeladas.archivos), ...Object.keys(actuales)]);
    archivosCambiados = [...claves].filter((rel) => congeladas.archivos[rel] !== actuales[rel]).sort();
  } else {
    commit = commitActual(rootDir);
    archivos = hashesDeInstrucciones(rootDir);
    archivosSinCommitear = instruccionesSinCommitear(rootDir);
  }

  const agentesJson: AgentesJson = {
    commit,
    generado: new Date().toISOString(),
    archivos,
    archivos_sin_commitear: archivosSinCommitear,
    ...(congeladas ? { instrucciones_congeladas: congeladas.generado } : {}),
    ...(archivosCambiados.length ? { archivos_cambiados_durante_la_corrida: archivosCambiados } : {}),
    agentes: {
      ...(previoJson?.agentes ?? {}),
      ...Object.fromEntries(
        [...shaAgente.entries()].map(([nombre, info]) => [nombre, { archivo: info.archivo, sha256: info.sha256, modelo: modelosPorAgente.get(nombre) }]),
      ),
    },
    ...(Object.keys(scripts).length ? { scripts } : {}),
  };

  return { agentesJson, archivosCambiados };
}

export function promover(inboxDir: string, opciones: OpcionesPromover = {}): ResultadoPromover {
  const rootDir = path.resolve(opciones.rootDir ?? RAIZ);
  const dirCorrida = path.resolve(inboxDir);
  if (!existsSync(dirCorrida)) throw new Error(`No existe la carpeta del inbox: ${inboxDir}`);

  const corrida = opciones.corrida ?? idCorridaDesdeInbox(dirCorrida);
  if (!corrida) {
    // inbox/correcciones/<fecha> tiene dos niveles (no <politico>/<tema>/<fecha>), así que
    // idCorridaDesdeInbox no puede derivar de ahí un id con forma de investigación: vuelve null a
    // propósito, sin romper, y acá se explica por qué y qué pasar en su lugar. Es el caso de una
    // corrección que armó un script (pnpm reverificar --escribir, pnpm lote fusionar): esos dos ya
    // imprimen el --corrida que crearon; si el comando se corre sin él, este mensaje dice de dónde
    // sacarlo en vez del genérico de politico/tema, que no aplica acá.
    const partes = aPosix(dirCorrida).split('/').filter(Boolean);
    const esInboxDeCorrecciones = partes.length >= 2 && partes[partes.length - 2] === 'correcciones';
    throw new Error(
      esInboxDeCorrecciones
        ? `No se pudo derivar el id de la corrida de "${inboxDir}": una carpeta de inbox/correcciones/<fecha> no tiene la forma <politico>/<tema>/<fecha> de la que este comando deriva un id de investigación. Pasalo con --corrida <id>: el id que armó el script que escribió la corrección (pnpm reverificar --escribir o pnpm lote fusionar ya lo imprimen en el comando de promover que sugieren).`
        : `No se pudo derivar el id de la corrida de "${inboxDir}". Pasalo con --corrida <YYYY-MM-DD>-<politico>-<tema> (el tema con / reemplazado por -).`,
    );
  }
  if (!PATRON_ID_CORRIDA.test(corrida)) {
    throw new Error(`Id de corrida inválido: "${corrida}". Formato: <YYYY-MM-DD>-<politico>-<tema con / → ->.`);
  }
  const fechaCorrida = corrida.slice(0, 10);
  const corridaDir = carpetaCorrida(rootDir, corrida);
  const errores: Problema[] = [];
  const artefactos: string[] = [];

  // Instrucciones congeladas al armar el brief (si `pnpm brief` corrió después de este cambio):
  // el hash de cada archivo de instrucciones que va a `procedencia.agente_sha` sale de acá cuando
  // está disponible, no del archivo tal como está ahora. Sin esto, un rol editado mientras la
  // corrida está abierta le pondría a la procedencia el hash de una versión que el agente nunca leyó.
  const congeladas = leerInstruccionesCongeladas(corridaDir);
  const hashInstruccion = (rel: string): string => congeladas?.archivos[rel] ?? hashDeArchivo(path.join(rootDir, ...rel.split('/')));

  // -------------------------------------------------------------------------
  // 1. Artefactos: brief.md (tiene que existir de antes), crudo/, consultas.jsonl
  // -------------------------------------------------------------------------
  // Las instrucciones tienen que estar commiteadas antes de promover. `promover` hashea el archivo
  // tal como está en el árbol, así que si tiene cambios sin commitear registra un hash de una
  // versión que puede no llegar nunca a git: basta con seguir editando encima, o con descartar el
  // cambio, para que esos bytes dejen de existir. Pasó de verdad el 4 de setiembre de 2026: dos
  // corridas quedaron con siete hashes que no aparecen en ningún commit, y las instrucciones que
  // recibieron esos agentes no se pueden reconstruir. Son 26 registros publicados cuya procedencia
  // está incompleta para siempre.
  //
  // No hay `--forzar` a propósito. La fricción es de un commit y el daño es irreversible.
  const sucias = instruccionesSinCommitear(rootDir);
  if (sucias.length > 0) {
    throw new Error(
      `Hay ${sucias.length} archivo(s) de instrucciones con cambios sin commitear:\n` +
        sucias.map((f) => `  ${f}`).join('\n') +
        `\n\nCommiteálos antes de promover. promover guarda el hash del archivo tal como está ahora, ` +
        `y si esa versión no llega a git, nadie va a poder reconstruir con qué instrucciones se produjo ` +
        `este lote. No es recuperable después.`,
    );
  }

  const briefPath = path.join(corridaDir, 'brief.md');
  if (!existsSync(briefPath)) {
    throw new Error(`Falta data/corridas/${corrida}/brief.md: es el prompt exacto que recibió el agente y sin él no hay procedencia verificable.`);
  }
  const briefSha = hashDeArchivo(briefPath);

  // -------------------------------------------------------------------------
  // 1b. Congelar crudo/, consultas.jsonl y notas.md, y devolver ya si --solo-crudo.
  // -------------------------------------------------------------------------
  // Esto corre ANTES de resolver el modo corrección (más abajo) a propósito: en el flujo de
  // `/correccion` el editor es el único que escribe `correcciones.yaml` y el resto del lote (no
  // hay un investigador previo, a diferencia de una corrida normal), así que "congelar antes de
  // que edite el editor" significa congelar cuando en el inbox todavía no hay más que `pedido.md`
  // (y `consultas.jsonl`/`notas.md` si los hay). Si la resolución de `--correccion` corriera
  // primero, `pnpm promover <dir> --correccion <id> --solo-crudo` tiraba error apenas se lo
  // llamaba en ese momento (`correcciones.yaml` todavía no existe ni en el inbox ni en
  // `content/correcciones/`), y nunca llegaba a congelar nada cuando hace falta.
  let crudoExistiaAntes = false;
  // Nombres de archivo que `asegurarCrudo` copió recién en ESTE llamado (no en uno anterior). Un
  // archivo así no es un "antes" legítimo para el diff de la sección 4 si `crudo/` ya existía de
  // antes (`crudoExistiaAntes`): significa que el editor escribió un archivo que no estaba en el
  // lote cuando se congeló por primera vez (el caso normal de una corrección, donde `--solo-crudo`
  // se corre antes de que exista `correcciones.yaml`), y lo que acaba de copiar `asegurarCrudo` ES
  // la versión ya editada, no una foto de antes. Tratarlo como "antes" haría que el diff saliera
  // vacío para ese archivo aunque el editor lo haya escrito entero. Si en cambio `crudo/` no existía
  // en absoluto antes de este llamado (`!crudoExistiaAntes`), todo el directorio se está
  // congelando ahora mismo con lo que ya está editado: ahí no hay nada que excluir, el diff entero
  // sale vacío y el aviso de más abajo ("crudo congelado recién al promover") ya lo explica.
  let archivosCongeladosEnEsteLlamado: string[] = [];
  if (!opciones.simulacion) {
    mkdirSync(corridaDir, { recursive: true });
    crudoExistiaAntes = existsSync(path.join(corridaDir, 'crudo'));
    // El crudo se copia una sola vez: si ya está, es lo que se congeló antes (investigador, o
    // `pedido.md` de una corrección) y no se toca.
    //
    // Cuidado con CUÁNDO se llama a esto. Si la primera vez que corre `promover` es después de
    // que editó el editor, lo que queda congelado como "crudo" ya es la versión editada, el
    // `edicion.diff` sale vacío y nadie puede auditar qué cambió el editor. Por eso `/revisar`
    // corre `pnpm promover <dir> --corrida <id> --solo-crudo` apenas valida el inbox, antes de
    // lanzar al crítico y al editor; una corrección hace lo mismo con `--correccion <id>
    // --solo-crudo` antes de lanzar al editor (ver `.claude/commands/correccion.md`).
    const copiados = asegurarCrudo(dirCorrida, corridaDir);
    archivosCongeladosEnEsteLlamado = copiados;
    if (copiados.length) artefactos.push(...copiados.map((c) => `crudo/${c}`));

    const consultas = path.join(dirCorrida, 'consultas.jsonl');
    if (existsSync(consultas)) {
      copyFileSync(consultas, path.join(corridaDir, 'consultas.jsonl'));
      artefactos.push('consultas.jsonl');
    }

    // `notas.md` se copia en cada corrida, no una sola vez como el crudo. La versión congelada en
    // `crudo/` es la primera que escribió el investigador; esta es la última, con las correcciones
    // que hizo cuando el crítico le señaló algo. En una corrida cuyo hallazgo es una ausencia, esa
    // diferencia es todo: la cobertura documentada (cuántas sesiones se revisaron, con qué método y
    // qué controles se corrieron) es la única evidencia de que el cero significa algo. Si se queda
    // solo en `inbox/`, que es privado, el rastro público pierde justamente la parte que sostiene
    // la conclusión.
    const notas = path.join(dirCorrida, 'notas.md');
    if (existsSync(notas)) {
      copyFileSync(notas, path.join(corridaDir, 'notas.md'));
      artefactos.push('notas.md');
    }

    if (opciones.soloCrudo) {
      return { corrida, corridaDir, promovidos: [], errores: [], diff: '', artefactos, simulado: false, soloCrudo: true };
    }
  }

  // Modo corrección: el único camino por el que un registro ya publicado cambia. La corrección
  // tiene que existir y declarar en `afecta` cada id que se va a sobreescribir, para que el
  // cambio quede explicado en una pieza publica antes de tocar nada.
  let afectados: Set<string> | null = null;
  let agregados: Set<string> = new Set();
  let correccionEscrita: string | undefined;
  // Cambio de id en pares (docs/plan-correcciones-id.md): además de afecta/agrega, cada `de`
  // desaparece de content/ y cada `a` reescribe las referencias que apuntaban al viejo.
  let paresReemplazo: ParDeReemplazo[] = [];
  if (opciones.correccion !== undefined) {
    // No hay `--solo-crudo` de por medio a esta altura (ya habría devuelto arriba): esto es una
    // promoción real. Si el crudo recién se congeló en este mismo llamado, `edicion.diff` (más
    // abajo) va a comparar contra la versión ya editada del editor y va a salir vacío aunque el
    // editor haya cambiado todo el lote — no hay forma de distinguir "no cambió nada" de "no había
    // nada contra qué comparar". Se avisa apenas se sabe, no se corta: la corrección igual se puede
    // promover, pero sin la auditoría línea por línea de qué escribió el editor.
    if (!opciones.simulacion && !crudoExistiaAntes) {
      log.aviso(
        'crudo congelado recién al promover: edicion.diff no muestra lo que hizo el editor; la próxima vez congelá con --solo-crudo antes de lanzarlo.',
      );
    }
    const idPedido = typeof opciones.correccion === 'string' ? opciones.correccion : undefined;
    const rutaCorreccion = (id: string) => path.join(rootDir, 'content', 'correcciones', `${id}.yaml`);

    let corr: Record<string, unknown> | undefined;
    let idCorreccion = idPedido;

    if (idPedido && existsSync(rutaCorreccion(idPedido))) {
      corr = parseYaml(readFileSync(rutaCorreccion(idPedido), 'utf8')) as Record<string, unknown>;
    } else {
      // Todavía no existe en content/correcciones/ (o no se pasó id): se busca en el
      // correcciones.yaml del propio directorio que se está promoviendo. Es el paso que le
      // faltaba a `pnpm reverificar --escribir` y a `pnpm lote fusionar`: los dos dejan crudo en
      // inbox/ (regla 9, ningún agente ni script escribe en content/ directamente) pero antes no
      // había nada que lo llevara de ahí a `content/correcciones/`.
      const archivoCorrecciones = leerArchivosInbox(dirCorrida).find((a) => a.coleccion === 'correcciones');
      if (!archivoCorrecciones || !archivoCorrecciones.items.length) {
        throw new Error(
          idPedido
            ? `No existe content/correcciones/${idPedido}.yaml, y ${aPosix(path.relative(rootDir, dirCorrida))} no tiene correcciones.yaml para escribirla. La corrección se escribe primero: explica qué cambia y por qué, y recién después se promueve contra ella.`
            : `${aPosix(path.relative(rootDir, dirCorrida))} no tiene correcciones.yaml: pasá --correccion <id> de una corrección que ya exista en content/correcciones/, o dejá ahí un correcciones.yaml con el registro a promover.`,
        );
      }

      // Mismo criterio de id que `cargarInbox`/`pnpm validar --inbox`: `<fecha>-<_slug>`. Sin
      // `_slug` explícito, `derivarId` cae al primer id de `afecta`/`agrega` (lo sigue haciendo,
      // más abajo, solo para poder listar candidatos en los mensajes de error de acá abajo), pero
      // ese id nunca se promueve: antes de este cambio, no traer `_slug` era solo un aviso y la
      // corrección quedaba con un id que parece el de una declaración
      // ("testpol-2020-01-01-original" en vez de algo como "2020-07-01-cita-mal-copiada").
      const usadosCorreccion = new Set<string>();
      const candidatos = archivoCorrecciones.items.map((item, n) => ({
        item,
        n,
        id: derivarId('correcciones', item, usadosCorreccion),
        traiaSlug: typeof item._slug === 'string' && item._slug.trim() !== '',
      }));

      let elegido: (typeof candidatos)[number] | undefined;
      if (idPedido) {
        elegido = candidatos.find((c) => c.id === idPedido);
        if (!elegido) {
          throw new Error(
            `No existe content/correcciones/${idPedido}.yaml, y ningún registro de ${archivoCorrecciones.nombre} deriva ese id. ` +
              `Id(s) disponibles ahí: ${candidatos.map((c) => c.id).join(', ') || '(ninguno)'}.`,
          );
        }
      } else if (candidatos.length === 1) {
        elegido = candidatos[0];
      } else {
        throw new Error(
          `${archivoCorrecciones.nombre} tiene ${candidatos.length} correcciones: pasá --correccion <id> con una de estas:\n` +
            candidatos
              .map((c) => `  ${c.id}${typeof c.item.motivo === 'string' ? ` — ${String(c.item.motivo).replace(/\s+/g, ' ').slice(0, 80)}` : ''}`)
              .join('\n'),
        );
      }

      if (!elegido.traiaSlug) {
        return {
          corrida,
          corridaDir,
          promovidos: [],
          errores: [
            {
              archivo: `${archivoCorrecciones.nombre}#${elegido.n}`,
              campo: '_slug',
              mensaje:
                'La corrección necesita _slug: <fecha>-<tema-corto>, por ejemplo 2026-09-16-batlle-lectura-chequeos. ' +
                `Sin _slug, el id se derivaría de "${elegido.id}" (el primer id de afecta/agrega), que parece el id de una declaración y no el de una corrección.`,
            },
          ],
          diff: '',
          artefactos,
          simulado: true,
        };
      }
      idCorreccion = elegido.id;
      const defCorreccion = definicionDeColeccion('correcciones');
      if (!defCorreccion.patronId.test(idCorreccion)) {
        return {
          corrida,
          corridaDir,
          promovidos: [],
          errores: [
            {
              archivo: `${archivoCorrecciones.nombre}#${elegido.n}`,
              campo: '(id)',
              mensaje: `El id derivado "${idCorreccion}" no cumple el patrón de content/correcciones/ (${defCorreccion.patronId.source}); poné un _slug explícito.`,
            },
          ],
          diff: '',
          artefactos,
          simulado: true,
        };
      }

      // Una corrección no lleva `procedencia` (el esquema no la admite: se explica a sí misma) y
      // siempre se publica, incluidos los rechazos (docs/colecciones/correcciones.md, "los tres
      // desenlaces se publican"), así que `revision.tier` se fuerza acá y no lo decide el crudo.
      const normalizado = normalizarRegistroInbox('correcciones', elegido.item, false);
      normalizado.revision = { ...(normalizado.revision as Record<string, unknown> | undefined), tier: 'publicado' };
      delete normalizado.procedencia;
      const v = validarContraEsquema('correcciones', normalizado, `${archivoCorrecciones.nombre}#${elegido.n}`);
      if (!v.datos) {
        return { corrida, corridaDir, promovidos: [], errores: v.errores, diff: '', artefactos, simulado: true };
      }
      corr = v.datos;

      if (!opciones.simulacion) {
        mkdirSync(path.join(rootDir, 'content', 'correcciones'), { recursive: true });
        writeFileSync(rutaCorreccion(idCorreccion), yamlDeRegistro(v.datos), 'utf8');
      }
      correccionEscrita = idCorreccion;
    }

    if (!corr || !idCorreccion) throw new Error('No se pudo determinar el registro de corrección.');
    opciones.correccion = idCorreccion;

    // Un pedido rechazado se publica igual, para que quede el fundamento y para poder redirigir
    // a quien lo vuelva a plantear; pero no toca nada de lo publicado. Si `promover` lo aplicara,
    // el sitio diría que el pedido se desestimó mientras el registro ya fue reescrito.
    if (corr?.desenlace === 'rechazada' || corr?.desenlace === 'pendiente') {
      throw new Error(
        `content/correcciones/${idCorreccion}.yaml tiene desenlace '${corr.desenlace}': un pedido rechazado no modifica nada, y uno pendiente todavía no se resolvió. Publicalo para que se vea, pero no lo promuevas.`,
      );
    }
    const lista = Array.isArray(corr?.afecta) ? (corr.afecta as string[]) : [];
    const nuevos = Array.isArray(corr?.agrega) ? (corr.agrega as string[]) : [];
    if (lista.length === 0 && nuevos.length === 0) {
      throw new Error(`content/correcciones/${idCorreccion}.yaml no declara ningún registro: usá 'afecta' para los que modifica y 'agrega' para los que introduce.`);
    }
    afectados = new Set(lista);
    agregados = new Set(nuevos);

    // Verificación previa del cambio de id en pares, antes de escribir nada: cada `de` existe en
    // content/ (si no, no hay nada que retirar) y cada `a` todavía no existe (si ya existiera,
    // 'agrega' estaría pisando lo publicado por la puerta equivocada). El esquema ya garantiza que
    // cada `de` está en `afecta` y cada `a` en `agrega`, y que `de`/`a` son de la misma colección.
    if (Array.isArray(corr?.reemplaza)) {
      paresReemplazo = corr?.reemplaza as ParDeReemplazo[];
      for (const { de, a } of paresReemplazo) {
        if (!existsSync(rutaDeIdCompleto(rootDir, de))) {
          throw new Error(`content/correcciones/${idCorreccion}.yaml declara reemplazar "${de}" (reemplaza[].de), pero ese registro no existe en content/.`);
        }
        if (existsSync(rutaDeIdCompleto(rootDir, a))) {
          throw new Error(`content/correcciones/${idCorreccion}.yaml declara reemplazar "${de}" por "${a}" (reemplaza[].a), pero "${a}" ya existe en content/.`);
        }
      }
    }
  }

  // -------------------------------------------------------------------------
  // 2. Leer el crudo (antes) y el inbox (después)
  // -------------------------------------------------------------------------
  const crudoDir = path.join(corridaDir, 'crudo');
  const archivosCrudo = existsSync(crudoDir) ? leerArchivosInbox(crudoDir, { estricto: false }) : [];
  const archivosInbox = leerArchivosInbox(dirCorrida);
  if (!archivosInbox.length) {
    throw new Error(`La carpeta ${aPosix(path.relative(rootDir, dirCorrida))} no tiene ningún YAML de registros (declaraciones.yaml, giros.yaml, …).`);
  }

  // -------------------------------------------------------------------------
  // 3. Normalizar, asignar id y procedencia
  // -------------------------------------------------------------------------
  const usados = new Set<string>();
  const finales: { coleccion: NombreColeccion; id: string; datos: Record<string, any>; origen: string; agente: string; modelo: string }[] = [];
  const shaAgente = new Map<string, { archivo: string; sha256: string }>();
  const modelosPorAgente = new Map<string, string>();
  // Scripts (procedencia por script, sin agente): nombre relativo a scripts/ → su hash y el de sus insumos.
  const shaScript = new Map<string, { archivo: string; sha256: string; insumos: Record<string, string> }>();

  for (const archivo of archivosInbox) {
    const relOrigen = aPosix(path.relative(rootDir, archivo.ruta));
    archivo.items.forEach((item, n) => {
      const origen = `${relOrigen}#${n}`;
      if (!item || typeof item !== 'object' || Array.isArray(item)) {
        errores.push({ archivo: origen, campo: '(registro)', mensaje: 'Cada elemento de la lista debe ser un objeto con los campos del esquema.' });
        return;
      }
      // Un registro marcado como hipótesis no va a content/, ni siquiera a /probable/: las
      // hipótesis viven en hipotesis/, que es privado y gitignored. El editor las escribe ahí y
      // deja el registro marcado; si igual se promoviera, el validador falla después y el
      // registro ya estaría publicado. Cortar acá es el único momento en que todavía no pasó.
      if ((item.revision as Record<string, unknown> | undefined)?.tier === 'hipotesis') {
        errores.push({
          archivo: `${archivo.nombre}#${n}`,
          campo: 'revision.tier',
          mensaje:
            'Marcado como `hipotesis`: no se promueve. Las hipótesis van a hipotesis/<politico>/<slug>.yaml, ' +
            'que es privado. Sacá el registro del YAML del inbox y verificá que la hipótesis esté escrita.',
        });
        return;
      }

      // En modo corrección solo se tocan los registros que la corrección declara en `afecta`. El
      // resto del lote se ignora, así que tampoco se le exige nada: pedirle procedencia completa a
      // un registro que no se va a escribir empuja a poner metadatos falsos (un --modelo inventado)
      // para destrabar el comando, que es justo lo que la procedencia existe para evitar.
      const idTemprano = derivarId(archivo.coleccion, item, usados);
      // `agrega` también entra: son los registros nuevos que la corrección introduce. Este filtro
      // los dejaba afuera antes de llegar al chequeo de abajo, y una corrección con `agrega`
      // promovía solo lo que ya existía.
      if (afectados && !afectados.has(`${archivo.coleccion}/${idTemprano}`) && !agregados.has(`${archivo.coleccion}/${idTemprano}`)) return;

      // El lote no trae ningún `de` de un par de reemplazo: el lote solo trae los registros nuevos
      // (los `a`); el `de` se retira de content/ sin que nadie tenga que escribirlo de nuevo.
      if (paresReemplazo.some((p) => p.de === `${archivo.coleccion}/${idTemprano}`)) {
        errores.push({
          archivo: origen,
          campo: '(id)',
          mensaje: `El lote trae un registro con id "${archivo.coleccion}/${idTemprano}", que la corrección ${opciones.correccion} retira (reemplaza[].de): el lote solo trae los registros nuevos (los "a"); el viejo se borra solo.`,
        });
        return;
      }

      const investigacion = (item._investigacion ?? {}) as Record<string, unknown>;
      const scriptCrudo = typeof investigacion.script === 'string' && investigacion.script.trim() ? investigacion.script.trim() : null;

      let procedenciaPorCorrida: Record<string, unknown>;
      let agente: string;
      let modelo: string;

      if (scriptCrudo) {
        // Procedencia por script: sin agente ni modelo obligatorios (Decisión del mantenedor,
        // docs/plan-2026-09.md ítem 1.7). El script vive en scripts/, nunca en .cache/.
        const resuelto = resolverScript(rootDir, scriptCrudo);
        if (!resuelto) {
          errores.push({
            archivo: origen,
            campo: '_investigacion.script',
            mensaje: `No existe scripts/${scriptCrudo}, o la ruta se sale de scripts/ (por ejemplo hacia .cache/): todo script con procedencia vive en scripts/.`,
          });
          return;
        }
        const { relRepo, nombre } = resuelto;
        if (!shaScript.has(nombre)) {
          shaScript.set(nombre, { archivo: relRepo, sha256: hashDeArchivo(path.join(rootDir, ...relRepo.split('/'))), insumos: {} });
        }
        const infoScript = shaScript.get(nombre)!;
        const insumos = Array.isArray(investigacion.insumos) ? (investigacion.insumos as unknown[]).map(String) : [];
        let insumoFaltante: string | null = null;
        for (const insumo of insumos) {
          const relInsumo = aPosix(insumo);
          const absInsumo = path.join(rootDir, ...relInsumo.split('/'));
          if (!existsSync(absInsumo)) {
            insumoFaltante = relInsumo;
            break;
          }
          infoScript.insumos[relInsumo] = hashDeArchivo(absInsumo);
        }
        if (insumoFaltante) {
          errores.push({
            archivo: origen,
            campo: '_investigacion.insumos',
            mensaje: `No existe el insumo "${insumoFaltante}" (ruta relativa a la raíz del repo): sin el archivo no se puede calcular su SHA-256 para agentes.json.`,
          });
          return;
        }
        const modeloCelda = typeof investigacion.modelo === 'string' && investigacion.modelo.trim() ? investigacion.modelo.trim() : undefined;
        procedenciaPorCorrida = {
          corrida,
          script: nombre,
          script_sha: infoScript.sha256,
          brief_sha: briefSha,
          fecha: fechaCorrida,
          ...(modeloCelda ? { modelo: modeloCelda } : {}),
        };
        agente = `script: ${nombre}`;
        modelo = modeloCelda ?? '';
      } else if (opciones.correccion) {
        // Modo corrección: la procedencia final del registro siempre es {tipo: correccion,
        // correccion} (más abajo, tras normalizarRegistroInbox), así que agente_sha y modelo de
        // procedenciaPorCorrida no se usan para nada — pedir --modelo o exigir un archivo de
        // agente acá solo empuja a inventar datos que no describen nada real. El agente y el
        // modelo de quien escribió la corrección (si corrió como agente) quedan igual en el
        // agentes.json de esta corrida, que se completa más abajo desde agentesDeCorrida().
        agente = String(investigacion.agente ?? AGENTE_POR_COLECCION[archivo.coleccion] ?? 'investigador');
        modelo = String(investigacion.modelo ?? opciones.modelo ?? '');
        procedenciaPorCorrida = { corrida, agente, modelo, brief_sha: briefSha, fecha: fechaCorrida };
      } else {
        agente = String(investigacion.agente ?? AGENTE_POR_COLECCION[archivo.coleccion] ?? 'investigador');
        modelo = String(investigacion.modelo ?? opciones.modelo ?? '');
        if (!modelo) {
          // Antes de fallar, el mismo dato que expone `pnpm agentes --modelo-de <agente> --corrida
          // <id>`: el modelo real con el que corrió el último agente de ese tipo en esta corrida,
          // leído de su transcripción. Pedírselo al agente en el crudo es pedirle un dato que la
          // máquina ya sabe (docs/plan-2026-09.md, ítem 1.8).
          const deTranscripcion = modeloDeUltimoAgente(agente, corrida);
          if (deTranscripcion) {
            modelo = deTranscripcion;
            log.aviso(`${origen}: modelo tomado de la transcripción (${modelo}); _investigacion.modelo no estaba en el crudo.`);
          }
        }
        if (!modelo) {
          errores.push({
            archivo: origen,
            campo: '_investigacion.modelo',
            mensaje: 'Falta el modelo que produjo el registro: agregá `_investigacion: {modelo: <id de modelo>}` al crudo o pasá --modelo <id>. Sin modelo no hay procedencia auditable.',
          });
          return;
        }
        if (!shaAgente.has(agente)) {
          const rel = archivoDeAgente(rootDir, agente);
          if (!rel) {
            errores.push({
              archivo: origen,
              campo: '_investigacion.agente',
              mensaje: `No existe .claude/agents/${agente}.md ni .claude/commands/${agente}.md: el hash de instrucciones del agente es parte de la procedencia.`,
            });
            return;
          }
          shaAgente.set(agente, { archivo: rel, sha256: hashInstruccion(rel) });
        }
        modelosPorAgente.set(agente, modelo);
        procedenciaPorCorrida = {
          corrida,
          agente,
          agente_sha: shaAgente.get(agente)!.sha256,
          modelo,
          brief_sha: briefSha,
          fecha: fechaCorrida,
        };
      }

      const datos = normalizarRegistroInbox(archivo.coleccion, item, false);
      // Si el editor dejó, en este mismo lote, una referencia al id viejo de un par (ej. un
      // chequeo con `declaracion: <id viejo>`), la reescribe al nuevo antes de validar y escribir.
      if (paresReemplazo.length) reescribirReferenciasDelLotePorPares(archivo.coleccion, datos, paresReemplazo);
      datos.procedencia = opciones.correccion ? { tipo: 'correccion', correccion: opciones.correccion } : procedenciaPorCorrida;

      const id = idTemprano;
      const v = validarContraEsquema(archivo.coleccion, datos, origen);
      if (!v.datos) {
        errores.push(...v.errores);
        return;
      }
      finales.push({ coleccion: archivo.coleccion, id, datos, origen, agente, modelo });
    });
  }

  // -------------------------------------------------------------------------
  // 4. edicion.diff: crudo/ vs. lo que se promueve
  // -------------------------------------------------------------------------
  const partesDiff: string[] = [];
  for (const archivo of archivosInbox) {
    // `correcciones.yaml` no es parte del lote que "el editor edita desde el crudo del
    // investigador": es el registro de corrección mismo, que en modo `--correccion` se valida y
    // se escribe aparte (arriba) y nunca pasa por `finales`. Compararlo acá lo vería como
    // "borrado" en cada corrida y pediría un razones.md que no tiene nada que ver con esta corrida.
    if (archivo.coleccion === 'correcciones') continue;
    // Si `crudo/` ya existía de antes y este archivo es uno de los que `asegurarCrudo` acaba de
    // copiar en este mismo llamado (ver el comentario junto a `archivosCongeladosEnEsteLlamado`
    // más arriba), lo que hay en `crudoDir` para este nombre es la versión ya editada, no un
    // "antes": se lo trata como si no hubiera crudo, para que el diff muestre el archivo entero
    // como agregado en vez de compararlo contra sí mismo y salir vacío.
    const crudoNoEsAntesLegitimo = crudoExistiaAntes && archivosCongeladosEnEsteLlamado.includes(archivo.nombre);
    const crudo = crudoNoEsAntesLegitimo ? undefined : archivosCrudo.find((c) => c.nombre === archivo.nombre);
    const antes = yamlDeLista((crudo?.items ?? []).map((i) => normalizarRegistroInbox(archivo.coleccion, i, false)));
    const despues = yamlDeLista(finales.filter((f) => f.origen.startsWith(aPosix(path.relative(rootDir, archivo.ruta)) + '#')).map((f) => sinProcedencia(f.datos)));
    const d = diffUnificado(antes, despues, `crudo/${archivo.nombre}`, `content/ (${archivo.coleccion})`);
    if (d) partesDiff.push(d);
  }
  const diff = partesDiff.join('\n');

  if (!opciones.simulacion) {
    writeFileSync(path.join(corridaDir, 'edicion.diff'), diff, 'utf8');
    artefactos.push('edicion.diff');

    const { agentesJson: agentes, archivosCambiados } = armarAgentesJson(rootDir, corridaDir, congeladas, shaAgente, modelosPorAgente, shaScript);
    if (archivosCambiados.length) {
      log.aviso(
        `las instrucciones cambiaron durante la corrida; los agentes leyeron la versión congelada en el brief: ${archivosCambiados.join(', ')}`,
      );
    }
    // Defecto 1 del piloto 2026-09-15: una corrida que no promueve ningún registro (ausencia
    // documentada) igual lanzó un investigador y un crítico, y esa procedencia tiene que quedar
    // escrita en agentes.json aunque `shaAgente` (arriba, solo se llena por registro promovido)
    // esté vacío. Se completa con lo que corrió de verdad en esta corrida, leído de la transcripción
    // (`agentesDeCorrida`, la misma fuente que `pnpm agentes --corrida <id>`); los agentes que ya
    // quedaron por un registro promovido tienen precedencia y no se tocan.
    for (const [tipo, info] of agentesDeCorrida(corrida)) {
      if (agentes.agentes[tipo]) continue;
      const rel = archivoDeAgente(rootDir, tipo);
      if (!rel) continue; // tipo sin archivo de rol (p. ej. "general"): no hay instrucciones que hashear
      agentes.agentes[tipo] = {
        archivo: rel,
        sha256: hashInstruccion(rel),
        ...(info.modelo ? { modelo: info.modelo } : {}),
      };
    }
    // En una corrección NO se reescribe: `agentes.json` guarda el hash de las instrucciones que
    // regían cuando la corrida se ejecutó, y los registros ya promovidos apuntan a ese hash. Si una
    // corrección posterior lo pisa con los hashes de hoy, la procedencia de todos esos registros
    // deja de validar aunque nadie los haya tocado. Los archivos de agente cambian seguido; la
    // historia de una corrida, no.
    //
    // La excepción es la corrección que trae registros nuevos (`agrega`) desde una corrida propia,
    // con investigador, crítico y editor: ahí no hay agentes.json previo que proteger, y sin
    // escribirlo nadie podría reconstruir con qué instrucciones se produjeron esos registros.
    const rutaAgentes = path.join(corridaDir, 'agentes.json');
    if (!opciones.correccion || !existsSync(rutaAgentes)) {
      writeFileSync(rutaAgentes, JSON.stringify(agentes, null, 2) + '\n', 'utf8');
      artefactos.push('agentes.json');
    }
  }

  // -------------------------------------------------------------------------
  // 5. razones.md obligatorio si el editor tocó algo
  // -------------------------------------------------------------------------
  const razones = path.join(corridaDir, 'razones.md');
  if (diff.trim() && (!existsSync(razones) || readFileSync(razones, 'utf8').trim() === '')) {
    errores.push({
      archivo: `data/corridas/${corrida}/razones.md`,
      campo: '(archivo)',
      mensaje: `El editor cambió el crudo (data/corridas/${corrida}/edicion.diff no está vacío): escribí razones.md con una línea por cada cambio no trivial y volvé a correr pnpm promover.`,
    });
  }
  // Señal del mismo defecto que el aviso de arriba ("crudo congelado recién al promover"), pero
  // detectable incluso cuando `crudoExistiaAntes` dio true por otro motivo (por ejemplo, un
  // `--solo-crudo` corrido tarde, ya con el inbox editado): si el editor escribió razones para
  // cambios que el diff no muestra, lo más probable es que el crudo no sea el que el editor vio.
  if (opciones.correccion !== undefined && !diff.trim() && existsSync(razones) && readFileSync(razones, 'utf8').trim() !== '') {
    log.aviso('edicion.diff vacío con razones.md escrito: probablemente el crudo se congeló después del editor.');
  }

  // -------------------------------------------------------------------------
  // 6. Escribir en content/ (nunca sobreescribe)
  // -------------------------------------------------------------------------
  const promovidos: RegistroPromovido[] = [];
  const ignorados: string[] = [];
  for (const f of finales) {
    const def = definicionDeColeccion(f.coleccion);
    const destinoRel = `${def.carpeta}/${f.id}.${def.extension}`;
    const destino = path.join(rootDir, ...destinoRel.split('/'));
    const idCompleto = `${f.coleccion}/${f.id}`;
    // En modo corrección, la corrección manda: solo se tocan los ids que declara. El resto del
    // lote suele estar publicado y sin cambios, y no es asunto de esta corrección.
    if (afectados && !afectados.has(idCompleto) && !agregados.has(idCompleto)) {
      ignorados.push(destinoRel);
      continue;
    }
    if (existsSync(destino) && !afectados) {
      errores.push({
        archivo: destinoRel,
        campo: '(archivo)',
        mensaje: `Ya existe: promover nunca sobreescribe. Si es una corrección, escribí el registro en content/correcciones/ y corré con --correccion <id>; si es un registro distinto, cambiale el _slug en el crudo.`,
      });
      continue;
    }
    if (afectados && !existsSync(destino) && afectados.has(idCompleto)) {
      errores.push({
        archivo: destinoRel,
        campo: '(archivo)',
        mensaje: `La corrección ${opciones.correccion} declara "${idCompleto}" en 'afecta' pero ese registro no existe en content/. 'afecta' es para lo que ya está publicado; si es un registro nuevo, va en 'agrega'.`,
      });
      continue;
    }
    // Al reves que el anterior: `agrega` declara registros que NO tienen que existir. Si existe,
    // el pedido no esta agregando nada, esta pisando lo publicado por la puerta equivocada.
    if (afectados && existsSync(destino) && agregados.has(idCompleto)) {
      errores.push({
        archivo: destinoRel,
        campo: '(archivo)',
        mensaje: `La corrección ${opciones.correccion} declara "${idCompleto}" en 'agrega' pero ese registro ya existe en content/. Si querés modificarlo, va en 'afecta'.`,
      });
      continue;
    }
    if (!def.patronId.test(f.id)) {
      errores.push({
        archivo: destinoRel,
        campo: '(archivo)',
        mensaje: `El id derivado "${f.id}" no cumple el patrón de la colección ${f.coleccion} (${def.patronId.source}); poné un _slug explícito en el crudo. Ejemplo válido: ${def.ejemplo}.`,
      });
      continue;
    }
    promovidos.push({ coleccion: f.coleccion, id: f.id, destino: destinoRel, origen: f.origen, agente: f.agente, modelo: f.modelo });
  }

  const simulado = opciones.simulacion === true || errores.length > 0;
  if (!simulado) {
    for (const p of promovidos) {
      const f = finales.find((x) => x.coleccion === p.coleccion && x.id === p.id)!;
      const destino = path.join(rootDir, ...p.destino.split('/'));
      mkdirSync(path.dirname(destino), { recursive: true });
      writeFileSync(destino, yamlDeRegistro(f.datos), 'utf8');
    }
  }

  // Cambio de id en pares: con los `a` ya escritos (arriba) y sin errores, se borran los `de` y se
  // reescribe, en TODO content/, cada referencia que apuntaba a alguno de ellos. En `--simulacion`
  // no se borra ni se escribe nada, pero igual se calcula y se devuelve la lista (los `de` siguen
  // en disco, así que `reescribirReferenciasEnContenido` encuentra las mismas referencias que
  // encontraría de verdad).
  let referenciasReescritas: ReferenciaContenidoReescrita[] | undefined;
  if (paresReemplazo.length && errores.length === 0) {
    if (!simulado) {
      for (const { de } of paresReemplazo) rmSync(rutaDeIdCompleto(rootDir, de), { force: true });
    }
    referenciasReescritas = reescribirReferenciasEnContenido(rootDir, paresReemplazo, simulado);
  }

  return {
    corrida,
    corridaDir,
    promovidos,
    errores,
    diff,
    artefactos,
    simulado,
    ignorados,
    correccionEscrita,
    paresReemplazo: paresReemplazo.length ? paresReemplazo : undefined,
    referenciasReescritas,
  };
}

// ---------------------------------------------------------------------------
// --deshacer
// ---------------------------------------------------------------------------

export interface ResultadoDeshacer {
  corrida: string;
  /** Rutas de content/ (relativas a la raíz) que se borraron (o se borrarían, en simulación). */
  contenido: string[];
  /** agentes.json y/o edicion.diff de la corrida que se borraron (o se borrarían). */
  artefactos: string[];
  /** true si no se borró nada de verdad (--simulacion). */
  simulado: boolean;
}

/**
 * Deshace lo que `promover(<inboxDir>, {corrida: id})` escribió y todavía no se commiteó.
 *
 * Nunca toca nada que git ya tenga: ni un `content/<coleccion>/<id>.yaml` commiteado (por esta
 * corrida o por cualquier otra que haya corrido en paralelo y ya se haya subido), ni un
 * `agentes.json`/`edicion.diff` con cambios propios encima de HEAD. Si encuentra alguno así, no
 * borra nada —ni siquiera lo que sí era seguro— y lo dice, para no dejar la corrida a medio
 * deshacer sin que quede explícito qué falta revertir a mano.
 *
 * Qué borra:
 *   - todo archivo de `content/` sin commitear cuyo `procedencia.corrida` sea este id (se detecta
 *     leyendo content/ entero con `cargarContenido`, no solo los archivos que `git` marca como
 *     nuevos: así un archivo que YA está commiteado pero pertenece a esta corrida se detecta igual
 *     y frena el borrado en vez de dejarlo huérfano);
 *   - `data/corridas/<id>/agentes.json` y `edicion.diff`, si existen y están sin commitear.
 *
 * Qué NO toca nunca, exista o no: `brief.md`, `instrucciones.json`, `crudo/`, `critica.md`,
 * `razones.md`, `consultas.jsonl`. Son el rastro de lo que investigó y criticó la corrida, no lo
 * que escribió `promover`; sin ellos no queda ni memoria de que la corrida se intentó.
 */
export function deshacerPromocion(corridaId: string, opciones: { rootDir?: string; simulacion?: boolean } = {}): ResultadoDeshacer {
  const rootDir = path.resolve(opciones.rootDir ?? RAIZ);
  if (!PATRON_ID_CORRIDA.test(corridaId)) {
    throw new Error(`Id de corrida inválido: "${corridaId}". Formato: <YYYY-MM-DD>-<politico>-<tema con / → ->.`);
  }
  if (!esRepoGit(rootDir)) {
    throw new Error(`${rootDir} no es un repositorio git: --deshacer necesita git para distinguir lo commiteado de lo que promover acaba de escribir.`);
  }

  const estadoDe = new Map(cambios(rootDir).map((c) => [aPosix(c.ruta), c.estado]));
  const sinCommitear = (rel: string): boolean => (estadoDe.get(rel) ?? '').includes('?');

  // content/ que esta corrida escribió: se busca por `procedencia.corrida`, no por "es nuevo para
  // git", para que un archivo de esta corrida que alguien ya commiteó (a medias, o por otra corrida
  // que tomó el mismo id por error) se detecte y frene el borrado en vez de quedar sin tocar y sin
  // aviso.
  const contenido = cargarContenido(rootDir);
  const propios = contenido.registros
    .filter((r) => (r.datos?.procedencia as Record<string, unknown> | undefined)?.corrida === corridaId)
    .map((r) => r.archivo)
    .sort();

  const contenidoBloqueado = propios.filter((rel) => !sinCommitear(rel));
  const contenidoADeshacer = propios.filter(sinCommitear);

  // agentes.json y edicion.diff de la corrida: los únicos dos artefactos que escribe `promover`
  // y que no son un rastro de investigación (crudo/, consultas.jsonl, notas.md) ni algo que el
  // brief o la crítica necesiten conservar.
  const corridaDir = carpetaCorrida(rootDir, corridaId);
  const artefactosADeshacer: string[] = [];
  const artefactosBloqueados: string[] = [];
  for (const nombre of ['agentes.json', 'edicion.diff']) {
    const abs = path.join(corridaDir, nombre);
    if (!existsSync(abs)) continue;
    const rel = aPosix(path.relative(rootDir, abs));
    if (sinCommitear(rel)) artefactosADeshacer.push(rel);
    else artefactosBloqueados.push(rel);
  }

  const bloqueados = [...contenidoBloqueado, ...artefactosBloqueados];
  if (bloqueados.length) {
    throw new Error(
      `--deshacer no toca nada commiteado. Ya está en git (o tiene cambios propios encima de HEAD), así que no se borra nada de esta corrida:\n` +
        bloqueados.map((b) => `  ${b}`).join('\n') +
        `\n\nSi de verdad hay que revertir alguno, hacelo a mano con git (y revisá si pertenece a otra corrida).`,
    );
  }

  const simulado = opciones.simulacion === true;
  if (!simulado) {
    for (const rel of contenidoADeshacer) rmSync(path.join(rootDir, ...rel.split('/')), { force: true });
    for (const rel of artefactosADeshacer) rmSync(path.join(rootDir, ...rel.split('/')), { force: true });
  }

  return { corrida: corridaId, contenido: contenidoADeshacer, artefactos: artefactosADeshacer, simulado };
}

// ---------------------------------------------------------------------------
// --resellar
// ---------------------------------------------------------------------------

export interface CampoResellado {
  /** Archivo de content/ (relativo a la raíz) cuyo campo de procedencia se reescribió. */
  archivo: string;
  campo: 'brief_sha' | 'agente_sha' | 'script_sha';
  viejo: string;
  nuevo: string;
}

export interface ResultadoResellar {
  corrida: string;
  cambios: CampoResellado[];
  /** true si data/corridas/<id>/agentes.json se reescribió (o se reescribiría) con hashes nuevos. */
  agentesJsonCambiado: boolean;
  simulado: boolean;
}

/**
 * Reemplaza, en el texto crudo de un registro de `content/`, el valor de un campo de hash dentro
 * de `procedencia:` por su valor nuevo — con una expresión regular sobre la línea, sin
 * re-serializar el YAML. `viejo` es el valor exacto que ya se leyó del YAML parseado, así que el
 * reemplazo es literal: no hay ambigüedad posible con otro campo que por casualidad tenga el mismo
 * SHA-256. Se niega si no encuentra exactamente una línea así, para no reemplazar a ciegas.
 */
function reemplazarHashDeProcedencia(texto: string, archivo: string, campo: 'brief_sha' | 'agente_sha' | 'script_sha', viejo: string, nuevo: string): string {
  const patron = new RegExp(`(^[ \\t]*${campo}:[ \\t]*)${viejo}(?![0-9a-f])`, 'gm');
  const ocurrencias = texto.match(patron)?.length ?? 0;
  if (ocurrencias !== 1) {
    throw new Error(`${archivo}: se esperaba exactamente una línea "${campo}: ${viejo}" dentro de procedencia, se encontraron ${ocurrencias}.`);
  }
  return texto.replace(patron, `$1${nuevo}`);
}

/**
 * `pnpm promover --resellar <id-corrida>`: repara mecánicamente la prueba de procedencia cuando
 * `brief.md`, un archivo de agente o un script se escribieron alguna vez con CRLF y el hash
 * guardado en `content/` quedó siendo el de esa copia (ver el comentario de `hashDeArchivo` en
 * `scripts/lib/corridas.ts`; caso real: el brief de
 * `data/corridas/2026-09-16-batlle-economia-impuestos/`).
 *
 * `brief_sha` se recalcula contra `brief.md` tal como está hoy: ese archivo no se vuelve a tocar
 * después de que la corrida promovió (`pnpm brief` se niega a sobreescribirlo), así que su hash de
 * hoy es el mismo de siempre. `agente_sha`/`script_sha` (y los hashes que guarda `agentes.json`) se
 * recalculan contra el contenido que ese archivo tenía en el commit congelado en
 * `agentes.json.commit`, no contra el árbol de trabajo actual: un archivo de agente o de script sí
 * se sigue editando después de que la corrida promovió (es lo normal, no la excepción), y comparar
 * contra la versión de hoy confundiría esa edición real y posterior con el defecto de CRLF,
 * reescribiendo la procedencia para que apunte a instrucciones que ese agente nunca leyó.
 *
 * Reescribe SOLO esos campos —línea por línea, nunca re-serializando el YAML— en cada registro de
 * `content/` cuya `procedencia.corrida` sea `corridaId`, y los mismos hashes en
 * `data/corridas/<corridaId>/agentes.json` si los guarda. No decide nada editorial: no cambia
 * tier, no toca ningún otro campo, no promueve ni borra nada.
 */
export function resellarCorrida(corridaId: string, opciones: { rootDir?: string; simulacion?: boolean } = {}): ResultadoResellar {
  const rootDir = path.resolve(opciones.rootDir ?? RAIZ);
  if (!PATRON_ID_CORRIDA.test(corridaId)) {
    throw new Error(`Id de corrida inválido: "${corridaId}". Formato: <YYYY-MM-DD>-<politico>-<tema con / → ->.`);
  }
  const corridaDir = carpetaCorrida(rootDir, corridaId);
  if (!existsSync(corridaDir)) {
    throw new Error(`No existe data/corridas/${corridaId}/.`);
  }
  const simulado = opciones.simulacion === true;

  const briefPath = path.join(corridaDir, 'brief.md');
  const nuevoBriefSha = existsSync(briefPath) ? hashDeArchivo(briefPath) : null;

  const agentesJsonPath = path.join(corridaDir, 'agentes.json');
  const agentesJsonPrevio = leerAgentesJson(corridaDir);

  // Hash "correcto" de cada agente y script que agentes.json declara: el que tenía ese archivo en
  // el commit que quedó grabado en agentes.json.commit, no el del árbol de trabajo actual. Un
  // archivo de instrucciones se sigue editando después de que la corrida promovió (es el caso
  // normal, no la excepción), así que recalcular contra la versión de hoy confundiría esa edición
  // real y posterior con el defecto de CRLF, y reescribiría procedencia para que apunte a
  // instrucciones que ese agente nunca leyó. Recalcular contra el commit congelado es inmune a eso:
  // si el archivo no cambió (el caso común), da el mismo hash de siempre; si en aquel commit ya
  // tenía CRLF, da el hash normalizado real; si el archivo no existe en ese commit (por ejemplo, un
  // repo sin ese historial en un fixture de test), no hay base para recalcular y se deja como está.
  const agenteShaNuevo = new Map<string, string>();
  const scriptShaNuevo = new Map<string, string>();
  let agentesJsonCambiado = false;
  const agentesJsonNuevo: AgentesJson | null = agentesJsonPrevio ? structuredClone(agentesJsonPrevio) : null;

  if (agentesJsonPrevio && agentesJsonNuevo) {
    const commit = agentesJsonPrevio.commit;
    const hashHistorico = (rel: string): string | null => {
      if (!commit) return null;
      const blob = contenidoEnCommit(rootDir, commit, rel);
      return blob ? hashDeContenido(blob, rel) : null;
    };

    for (const [rel, shaViejo] of Object.entries(agentesJsonPrevio.archivos ?? {})) {
      const shaNuevo = hashHistorico(rel);
      if (shaNuevo && shaNuevo !== shaViejo) {
        agentesJsonNuevo.archivos[rel] = shaNuevo;
        agentesJsonCambiado = true;
      }
    }
    for (const [nombre, info] of Object.entries(agentesJsonPrevio.agentes ?? {})) {
      const shaNuevo = hashHistorico(info.archivo);
      if (!shaNuevo) continue;
      agenteShaNuevo.set(nombre, shaNuevo);
      if (shaNuevo !== info.sha256) {
        agentesJsonNuevo.agentes[nombre] = { ...info, sha256: shaNuevo };
        agentesJsonCambiado = true;
      }
    }
    for (const [nombre, info] of Object.entries(agentesJsonPrevio.scripts ?? {})) {
      const shaNuevo = hashHistorico(info.archivo);
      if (shaNuevo) {
        scriptShaNuevo.set(nombre, shaNuevo);
        if (shaNuevo !== info.sha256) {
          agentesJsonNuevo.scripts![nombre] = { ...agentesJsonNuevo.scripts![nombre], sha256: shaNuevo };
          agentesJsonCambiado = true;
        }
      }
      if (info.insumos) {
        const insumosNuevos: Record<string, string> = { ...info.insumos };
        for (const [relInsumo, shaViejoInsumo] of Object.entries(info.insumos)) {
          const shaNuevoInsumo = hashHistorico(relInsumo);
          if (shaNuevoInsumo && shaNuevoInsumo !== shaViejoInsumo) {
            insumosNuevos[relInsumo] = shaNuevoInsumo;
            agentesJsonCambiado = true;
          }
        }
        agentesJsonNuevo.scripts![nombre] = { ...agentesJsonNuevo.scripts![nombre], insumos: insumosNuevos };
      }
    }
  }

  // Registros de content/ que promovió esta corrida.
  const contenido = cargarContenido(rootDir);
  const cambios: CampoResellado[] = [];
  for (const reg of contenido.registros) {
    const p = reg.datos?.procedencia as Record<string, unknown> | undefined;
    if (!p || p.tipo === 'correccion' || p.corrida !== corridaId) continue;

    const abs = path.join(rootDir, ...reg.archivo.split('/'));
    let texto = readFileSync(abs, 'utf8');
    let tocado = false;

    if (nuevoBriefSha && typeof p.brief_sha === 'string' && p.brief_sha !== nuevoBriefSha) {
      texto = reemplazarHashDeProcedencia(texto, reg.archivo, 'brief_sha', p.brief_sha, nuevoBriefSha);
      cambios.push({ archivo: reg.archivo, campo: 'brief_sha', viejo: p.brief_sha, nuevo: nuevoBriefSha });
      tocado = true;
    }
    // agente_sha/script_sha se cotejan contra el hash histórico (commit congelado en
    // agentes.json), nunca contra el árbol de trabajo actual: ver el comentario de más arriba.
    // Sin ese hash histórico (agentes.json faltante, o el archivo no existe en ese commit) no hay
    // base para resellar y el campo queda como está.
    if (typeof p.agente === 'string') {
      const shaNuevo = agenteShaNuevo.get(p.agente);
      if (shaNuevo && typeof p.agente_sha === 'string' && p.agente_sha !== shaNuevo) {
        texto = reemplazarHashDeProcedencia(texto, reg.archivo, 'agente_sha', p.agente_sha, shaNuevo);
        cambios.push({ archivo: reg.archivo, campo: 'agente_sha', viejo: p.agente_sha, nuevo: shaNuevo });
        tocado = true;
      }
    }
    if (typeof p.script === 'string') {
      const shaNuevo = scriptShaNuevo.get(p.script);
      if (shaNuevo && typeof p.script_sha === 'string' && p.script_sha !== shaNuevo) {
        texto = reemplazarHashDeProcedencia(texto, reg.archivo, 'script_sha', p.script_sha, shaNuevo);
        cambios.push({ archivo: reg.archivo, campo: 'script_sha', viejo: p.script_sha, nuevo: shaNuevo });
        tocado = true;
      }
    }

    if (tocado) {
      // No re-serializa: el reemplazo ya se hizo sobre el texto crudo. Solo se verifica que el
      // resultado siga siendo YAML válido antes de escribirlo.
      parseYaml(texto);
      if (!simulado) writeFileSync(abs, texto, 'utf8');
    }
  }

  if (agentesJsonCambiado && agentesJsonNuevo && !simulado) {
    writeFileSync(agentesJsonPath, JSON.stringify(agentesJsonNuevo, null, 2) + '\n', 'utf8');
  }

  return { corrida: corridaId, cambios, agentesJsonCambiado, simulado };
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const AYUDA = `pnpm promover <inbox-run-dir> [--corrida <id>] [--modelo <id>] [--solo-crudo] [--simulacion]

Separa las listas del inbox en un archivo por registro dentro de content/,
les asigna id y procedencia, y deja el rastro en data/corridas/<id>/.

  --corrida <id>   id de la corrida (por defecto se deriva de la ruta del inbox)
  --modelo <id>    modelo para los registros sin _investigacion.modelo
                   (no aplica a un registro con _investigacion.script: ver abajo, ni con
                   --correccion, donde la procedencia final nunca lleva agente ni modelo)

  Procedencia por script: un registro con _investigacion: {script: <ruta en scripts/>,
  insumos?: [<rutas relativas al repo>], modelo?: <id>} no exige modelo ni archivo de
  agente. El script tiene que existir en scripts/<script> (nunca en .cache/); se le
  calcula el SHA-256 a él y a cada insumo, y quedan en agentes.json bajo 'scripts'.
  'modelo' es opcional y solo para una celda puntual que salió de un modelo (no del parser).
  --correccion [id] aplica una correccion ya escrita en content/correcciones/<id>.yaml:
                   sobreescribe solo los registros que esa correccion declara en 'afecta' y
                   les pone procedencia de tipo correccion. Es el unico camino por el que
                   cambia un registro ya publicado.
                   Si <inbox-run-dir> trae correcciones.yaml (lo dejan 'pnpm reverificar
                   --escribir' y 'pnpm lote fusionar') y esa corrección todavia no existe en
                   content/correcciones/, primero se valida y se escribe ahi (revision.tier:
                   publicado, sin procedencia: el esquema no la lleva). Sin <id>, tiene que
                   haber un solo registro en correcciones.yaml; con varios, hay que pasar
                   --correccion <id> con uno de los ids que lista el error. El registro de
                   correcciones.yaml necesita _slug (id de la corrección = <fecha>-<_slug>):
                   sin _slug, error, no se deriva de afecta/agrega.
                   Cambio de id (reemplaza en pares, docs/plan-correcciones-id.md): si la
                   corrección trae reemplaza: [{de, a}, ...], cada "de" (tiene que existir en
                   content/ y estar en 'afecta') se borra, cada "a" (tiene que estar en 'agrega'
                   y no existir todavia) se escribe desde el lote, y se reescribe sola, en TODO
                   content/, cada referencia que apuntaba a un "de". --deshacer no sabe revertir
                   un cambio de id: la forma de revertirlo es otra corrección al revés.
  --solo-crudo     congela crudo/ y consultas.jsonl y sale, sin promover nada.
                   Se corre apenas valida el inbox y ANTES de que edite el editor:
                   si no, lo que queda como "crudo" ya es la version editada y
                   edicion.diff sale vacio. Funciona también con --correccion,
                   incluso antes de que exista correcciones.yaml en el inbox
                   (en ese momento no hay nada más que congelar que pedido.md):
                   la corrección recién se resuelve al promover de verdad.
  --simulacion     muestra qué haría, sin escribir

pnpm promover --deshacer <id-corrida> [--simulacion]

  Deshace lo que esa corrida promovió y todavía no se commiteó: borra, en content/, cada
  archivo sin commitear cuyo procedencia.corrida sea <id-corrida>, y en data/corridas/<id-corrida>/
  borra agentes.json y edicion.diff si están sin commitear. Nunca toca brief.md,
  instrucciones.json, crudo/, critica.md, razones.md ni consultas.jsonl. Si algo de lo que
  tendría que borrar ya está commiteado (por esta corrida o por otra que tomó el mismo id),
  no borra nada y lo lista, para no dejar el borrado a medias.
  --simulacion     lista qué borraría, sin borrar nada

pnpm promover --resellar <id-corrida> [--simulacion]

  Repara mecánicamente la prueba de procedencia cuando brief.md, un archivo de agente o un
  script se escribieron alguna vez con CRLF: el hash guardado en content/ quedó siendo el de
  esa copia, y ningún checkout limpio (otra máquina, CI) lo reproduce. Recalcula brief_sha con
  el hash normalizado de brief.md tal como está hoy, y agente_sha/script_sha con el hash
  normalizado que ese archivo tenía en el commit que agentes.json tiene congelado (no con el
  árbol de trabajo actual: un archivo de agente sigue editándose después de que la corrida
  promovió, y comparar contra hoy confundiría esa edición real con el defecto de CRLF).
  Reescribe SOLO esos campos —línea por línea, nunca re-serializando el YAML— en cada registro
  de content/ cuya procedencia.corrida sea <id-corrida>, y los mismos hashes en
  data/corridas/<id-corrida>/agentes.json si los guarda. No cambia tier ni ningún otro campo:
  es reparación mecánica de la prueba, no una decisión editorial.
  --simulacion     lista qué campo cambiaría en qué archivo, sin escribir nada`;

function main(): void {
  const { posicionales, opciones } = parsearArgs(process.argv.slice(2));
  if (opciones.ayuda || opciones.help) {
    console.log(AYUDA);
    process.exit(0);
  }
  if (typeof opciones.deshacer === 'string') {
    try {
      const r = deshacerPromocion(opciones.deshacer, { simulacion: opciones.simulacion === true });
      const prefijo = r.simulado ? '(simulación) se borraría: ' : 'borrado: ';
      for (const rel of r.contenido) console.log(`${prefijo}${rel}`);
      for (const rel of r.artefactos) console.log(`${prefijo}${rel}`);
      if (!r.contenido.length && !r.artefactos.length) {
        log.ok(`nada para deshacer de la corrida ${r.corrida}: no hay content/ ni artefactos sin commitear con ese procedencia.corrida.`);
      } else {
        log.ok(`${r.simulado ? 'se borrarían' : 'borrados'} ${r.contenido.length} registro(s) de content/ y ${r.artefactos.length} artefacto(s) de data/corridas/${r.corrida}/.`);
      }
      process.exit(0);
    } catch (e) {
      log.error((e as Error).message);
      process.exit(1);
    }
  }
  if (typeof opciones.resellar === 'string') {
    try {
      const r = resellarCorrida(opciones.resellar, { simulacion: opciones.simulacion === true });
      for (const c of r.cambios) {
        console.log(`${c.archivo}: ${c.campo} ${c.viejo.slice(0, 12)}… → ${c.nuevo.slice(0, 12)}…`);
      }
      if (r.agentesJsonCambiado) {
        console.log(`data/corridas/${r.corrida}/agentes.json: ${r.simulado ? '(simulación) se actualizaría' : 'actualizado'}`);
      }
      if (!r.cambios.length && !r.agentesJsonCambiado) {
        log.ok(`nada para resellar de la corrida ${r.corrida}: los hashes de procedencia ya coinciden.`);
      } else {
        log.ok(`${r.simulado ? 'se reescribirían' : 'reescritos'} ${r.cambios.length} campo(s) de procedencia en content/${r.agentesJsonCambiado ? ' y agentes.json' : ''}.`);
      }
      process.exit(0);
    } catch (e) {
      log.error((e as Error).message);
      process.exit(1);
    }
  }
  if (!posicionales.length) {
    console.log(AYUDA);
    process.exit(1);
  }
  try {
    const idCorreccionCli = opciones.correccion === true ? true : typeof opciones.correccion === 'string' ? opciones.correccion : undefined;
    const r = promover(posicionales[0]!, {
      corrida: typeof opciones.corrida === 'string' ? opciones.corrida : undefined,
      modelo: typeof opciones.modelo === 'string' ? opciones.modelo : undefined,
      simulacion: opciones.simulacion === true,
      soloCrudo: opciones['solo-crudo'] === true,
      correccion: idCorreccionCli,
    });
    console.log(`corrida: ${r.corrida}`);
    if (r.artefactos.length) console.log(`artefactos: ${r.artefactos.join(', ')}`);
    if (r.correccionEscrita) {
      console.log(`content/correcciones/${r.correccionEscrita}.yaml: ${r.simulado ? '(simulado) se escribiría' : 'escrita'} desde correcciones.yaml de ${posicionales[0]}`);
    }
    if (r.soloCrudo) {
      log.ok(`crudo congelado en data/corridas/${r.corrida}/crudo/. Ahora sí puede editar el editor: lo que cambie va a quedar en edicion.diff.`);
      process.exit(0);
    }
    console.log(r.diff.trim() ? `edicion.diff: ${r.diff.split('\n').length} línea(s) de cambios del editor` : 'edicion.diff: vacío (el editor no tocó el crudo)');
    for (const p of r.promovidos) console.log(`  ${r.simulado ? '(simulado) ' : ''}${p.destino}  ← ${p.origen}  [${p.agente}${p.modelo ? ` · ${p.modelo}` : ''}]`);
    if (r.ignorados?.length) {
      console.log(`ignorados por la corrección (no están en 'afecta'): ${r.ignorados.length}`);
    }
    if (r.paresReemplazo?.length) {
      const prefijo = r.simulado ? '(simulado) se borraría: ' : 'borrado: ';
      for (const { de, a } of r.paresReemplazo) console.log(`  ${prefijo}${de}  (reemplazado por ${a})`);
      for (const ref of r.referenciasReescritas ?? []) {
        console.log(`  ${r.simulado ? '(simulado) se reescribiría' : 'reescrito'}: ${ref.archivo} (${ref.cantidad} referencia(s))`);
      }
    }
    if (r.errores.length) {
      console.log('');
      console.log(`No se promovió nada: ${r.errores.length} problema(s).`);
      for (const e of r.errores) console.log(`  ${e.archivo}\n    ${e.campo}: ${e.mensaje}`);
      process.exit(1);
    }
    const idCorreccionUsado = typeof idCorreccionCli === 'string' ? idCorreccionCli : r.correccionEscrita;
    const refCommit = idCorreccionUsado ? `[correccion ${idCorreccionUsado}]` : `[corrida ${r.corrida}]`;
    log.ok(`${r.promovidos.length} registro(s) ${r.simulado ? 'listos para promover' : 'promovidos'}. Ahora: pnpm validar (y --red), commit con ${refCommit}.`);
    process.exit(0);
  } catch (e) {
    log.error((e as Error).message);
    process.exit(1);
  }
}

const esEntrada = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (esEntrada) main();
