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
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';
import { definicionDeColeccion, type NombreColeccion } from '../src/schemas/comunes';
import { aPosix, validarContraEsquema } from './lib/contenido.ts';
import {
  archivoDeAgente,
  carpetaCorrida,
  commitActual,
  hashDeArchivo,
  hashesDeInstrucciones, instruccionesSinCommitear,
  idCorridaDesdeInbox,
  PATRON_ID_CORRIDA,
  type AgentesJson,
} from './lib/corridas.ts';
import { diffUnificado } from './lib/diff.ts';
import { AGENTE_POR_COLECCION, asegurarCrudo, derivarId, leerArchivosInbox, normalizarRegistroInbox } from './lib/inbox.ts';
import { log, parsearArgs } from './lib/log.ts';
import { modeloDeUltimoAgente } from './agentes.ts';
import { RAIZ } from './lib/rutas.ts';
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

  // Modo corrección: el único camino por el que un registro ya publicado cambia. La corrección
  // tiene que existir y declarar en `afecta` cada id que se va a sobreescribir, para que el
  // cambio quede explicado en una pieza publica antes de tocar nada.
  let afectados: Set<string> | null = null;
  let agregados: Set<string> = new Set();
  let correccionEscrita: string | undefined;
  if (opciones.correccion !== undefined) {
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

      // Mismo criterio de id que `cargarInbox`/`pnpm validar --inbox`: `<fecha>-<_slug>`, o
      // derivado del primer id de `afecta`/`agrega` si el registro no trae `_slug`.
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
        log.aviso(`${archivoCorrecciones.nombre}#${elegido.n}: el registro no traía _slug; id derivado del primer id de afecta/agrega: "${elegido.id}".`);
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
  }

  if (!opciones.simulacion) {
    mkdirSync(corridaDir, { recursive: true });
    // El crudo se copia una sola vez: si ya está, es lo que escribió el investigador y no se toca.
    //
    // Cuidado con CUÁNDO se llama a esto. Si la primera vez que corre `promover` es después de
    // que editó el editor, lo que queda congelado como "crudo" ya es la versión editada, el
    // `edicion.diff` sale vacío y nadie puede auditar qué cambió el editor. Por eso `/revisar`
    // corre `pnpm promover <dir> --corrida <id> --solo-crudo` apenas valida el inbox, antes de
    // lanzar al crítico y al editor.
    const copiados = asegurarCrudo(dirCorrida, corridaDir);
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
          shaAgente.set(agente, { archivo: rel, sha256: hashDeArchivo(path.join(rootDir, ...rel.split('/'))) });
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
    const crudo = archivosCrudo.find((c) => c.nombre === archivo.nombre);
    const antes = yamlDeLista((crudo?.items ?? []).map((i) => normalizarRegistroInbox(archivo.coleccion, i, false)));
    const despues = yamlDeLista(finales.filter((f) => f.origen.startsWith(aPosix(path.relative(rootDir, archivo.ruta)) + '#')).map((f) => sinProcedencia(f.datos)));
    const d = diffUnificado(antes, despues, `crudo/${archivo.nombre}`, `content/ (${archivo.coleccion})`);
    if (d) partesDiff.push(d);
  }
  const diff = partesDiff.join('\n');

  if (!opciones.simulacion) {
    writeFileSync(path.join(corridaDir, 'edicion.diff'), diff, 'utf8');
    artefactos.push('edicion.diff');

    // Una corrida se puede promover en varias tandas: por tramos de período, o porque el crítico
    // escribió `cobertura.yaml` después de que el investigador ya hubiera entregado. Cada tanda ve
    // solo los agentes de sus propios registros, así que reemplazar el mapa hace que la última
    // borre a los anteriores y los registros ya promovidos queden apuntando a un agente que
    // `agentes.json` no declara. Por eso se acumula.
    const previo = ((): AgentesJson['agentes'] => {
      const p = path.join(corridaDir, 'agentes.json');
      if (!existsSync(p)) return {};
      try {
        return (JSON.parse(readFileSync(p, 'utf8')) as AgentesJson).agentes ?? {};
      } catch {
        return {};
      }
    })();
    // Igual que `previo` con `agentes`: una corrida puede promoverse en varias tandas, y cada una
    // solo ve los scripts de sus propios registros.
    const previoScripts = ((): NonNullable<AgentesJson['scripts']> => {
      const p = path.join(corridaDir, 'agentes.json');
      if (!existsSync(p)) return {};
      try {
        return (JSON.parse(readFileSync(p, 'utf8')) as AgentesJson).scripts ?? {};
      } catch {
        return {};
      }
    })();
    const scripts: NonNullable<AgentesJson['scripts']> = {
      ...previoScripts,
      ...Object.fromEntries(
        [...shaScript.entries()].map(([nombre, info]) => [
          nombre,
          { archivo: info.archivo, sha256: info.sha256, ...(Object.keys(info.insumos).length ? { insumos: info.insumos } : {}) },
        ]),
      ),
    };
    const agentes: AgentesJson = {
      commit: commitActual(rootDir),
      generado: new Date().toISOString(),
      archivos: hashesDeInstrucciones(rootDir),
      archivos_sin_commitear: instruccionesSinCommitear(rootDir),
      agentes: {
        ...previo,
        ...Object.fromEntries(
          [...shaAgente.entries()].map(([nombre, info]) => [nombre, { archivo: info.archivo, sha256: info.sha256, modelo: modelosPorAgente.get(nombre) }]),
        ),
      },
      ...(Object.keys(scripts).length ? { scripts } : {}),
    };
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

  return { corrida, corridaDir, promovidos, errores, diff, artefactos, simulado, ignorados, correccionEscrita };
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const AYUDA = `pnpm promover <inbox-run-dir> [--corrida <id>] [--modelo <id>] [--solo-crudo] [--simulacion]

Separa las listas del inbox en un archivo por registro dentro de content/,
les asigna id y procedencia, y deja el rastro en data/corridas/<id>/.

  --corrida <id>   id de la corrida (por defecto se deriva de la ruta del inbox)
  --modelo <id>    modelo para los registros sin _investigacion.modelo
                   (no aplica a un registro con _investigacion.script: ver abajo)

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
                   --correccion <id> con uno de los ids que lista el error.
  --solo-crudo     congela crudo/ y consultas.jsonl y sale, sin promover nada.
                   Se corre apenas valida el inbox y ANTES de que edite el editor:
                   si no, lo que queda como "crudo" ya es la version editada y
                   edicion.diff sale vacio.
  --simulacion     muestra qué haría, sin escribir`;

function main(): void {
  const { posicionales, opciones } = parsearArgs(process.argv.slice(2));
  if (!posicionales.length || opciones.ayuda || opciones.help) {
    console.log(AYUDA);
    process.exit(posicionales.length ? 0 : 1);
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
