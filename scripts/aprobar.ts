/**
 * `pnpm aprobar <archivo> [--por "Nombre Apellido"]`
 *
 * Compuerta humana. Calcula el hash SHA-256 de la forma canónica del registro
 * (claves ordenadas, sin `revision.notas_internas`) y lo agrega a
 * `data/aprobaciones.json`. El validador exige ese hash para casos publicados,
 * giros `cambio_total + sin_explicacion` y registros con fuentes
 * `verificacion: manual`. Cualquier edición posterior cambia el hash y la
 * aprobación deja de valer sola.
 *
 * **Ningún agente corre este comando.** Si la variable de entorno
 * `LA_CASTA_AGENTE` está definida, el script se niega.
 */
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';
import { COLECCIONES } from '../src/schemas/comunes';
import { cargarContenido } from './lib/contenido.ts';
import { requiereAprobacion } from './validadores/tiers.ts';
import { escribirAprobaciones, hashCanonico, leerAprobaciones, ultimaAprobacion, yamlCanonico, type Aprobacion } from './lib/aprobaciones.ts';
import { aPosix, hoyISO, leerRegistroCrudo } from './lib/contenido.ts';
import { diffUnificado } from './lib/diff.ts';
import { git, tieneCommits } from './lib/git.ts';
import { log, parsearArgs } from './lib/log.ts';
import { RAIZ } from './lib/rutas.ts';

export interface OpcionesAprobar {
  rootDir?: string;
  aprobacionesPath?: string;
  por?: string;
  fecha?: string;
  /** Calcular e informar sin escribir. */
  simulacion?: boolean;
}

export interface ResultadoAprobar {
  aprobacion: Aprobacion;
  /** Aprobación anterior del mismo registro, si la había. */
  anterior?: Aprobacion;
  /** Diff entre la versión aprobada antes y la actual (vacío si no se pudo reconstruir). */
  diff: string;
  /** true si el hash actual ya estaba aprobado (no se agrega nada). */
  yaAprobado: boolean;
}

/**
 * Deduce raíz del repo, colección e id a partir de la ruta del archivo.
 * La raíz se infiere del último segmento `content/` de la ruta, así el comando
 * funciona igual desde cualquier directorio y sobre cualquier copia del repo.
 */
export function ubicarRegistro(archivo: string, rootDirForzado?: string): { rootDir: string; coleccion: string; id: string; rutaAbsoluta: string; relativo: string } {
  const rutaAbsoluta = path.resolve(archivo);
  const partes = aPosix(rutaAbsoluta).split('/');
  const i = partes.lastIndexOf('content');
  const rootDir = rootDirForzado ? path.resolve(rootDirForzado) : i > 0 ? partes.slice(0, i).join('/') : RAIZ;
  const relativo = aPosix(path.relative(rootDir, rutaAbsoluta));
  for (const def of COLECCIONES) {
    const prefijo = `${def.carpeta}/`;
    if (!relativo.startsWith(prefijo)) continue;
    const id = relativo.slice(prefijo.length).replace(new RegExp(`\\.${def.extension}$`), '');
    return { rootDir, coleccion: def.nombre, id, rutaAbsoluta, relativo };
  }
  throw new Error(`El archivo no está dentro de una colección de content/: ${relativo}`);
}

/** Recupera la versión del archivo vigente en la fecha de la aprobación anterior, para mostrar el diff. */
function versionEnFecha(rootDir: string, relativo: string, fecha: string): string | null {
  if (!tieneCommits(rootDir)) return null;
  const commit = git(['log', '-1', '--format=%H', `--until=${fecha}T23:59:59`, '--', relativo], rootDir);
  if (!commit.ok || !commit.stdout) return null;
  const contenido = git(['show', `${commit.stdout}:${relativo}`], rootDir);
  return contenido.ok ? contenido.stdout : null;
}

export function aprobar(archivo: string, opciones: OpcionesAprobar = {}): ResultadoAprobar {
  if (process.env.LA_CASTA_AGENTE) {
    throw new Error(
      'pnpm aprobar es la compuerta humana: ningún agente lo ejecuta (LA_CASTA_AGENTE está definida). Listá el registro en tu informe final y pará ahí.',
    );
  }
  const { rootDir, coleccion, id, rutaAbsoluta, relativo } = ubicarRegistro(archivo, opciones.rootDir);
  if (!existsSync(rutaAbsoluta)) throw new Error(`No existe el archivo: ${relativo}`);

  const crudo = leerRegistroCrudo(rutaAbsoluta);
  const hash = hashCanonico(crudo);

  const rutaAprobaciones = opciones.aprobacionesPath ?? path.join(rootDir, 'data', 'aprobaciones.json');
  const aprobaciones = leerAprobaciones(rutaAprobaciones);
  const anterior = ultimaAprobacion(aprobaciones, coleccion, id);

  let diff = '';
  if (anterior && anterior.hash !== hash) {
    const previa = versionEnFecha(rootDir, relativo, anterior.fecha);
    if (previa !== null) {
      let crudoPrevio: Record<string, unknown> | null = null;
      try {
        crudoPrevio = parseYaml(previa) as Record<string, unknown>;
      } catch {
        crudoPrevio = null;
      }
      if (crudoPrevio) {
        diff = diffUnificado(yamlCanonico(crudoPrevio), yamlCanonico(crudo), `${relativo} (aprobado ${anterior.fecha})`, `${relativo} (ahora)`);
      }
    }
  }

  const aprobacion: Aprobacion = {
    id,
    coleccion,
    hash,
    por: opciones.por ?? process.env.LA_CASTA_APROBADOR ?? 'Mantenedor',
    fecha: opciones.fecha ?? hoyISO(),
  };

  const yaAprobado = anterior?.hash === hash;
  if (!yaAprobado && !opciones.simulacion) {
    escribirAprobaciones(rutaAprobaciones, [...aprobaciones, aprobacion]);
  }

  return { aprobacion, anterior, diff, yaAprobado };
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const AYUDA = `pnpm aprobar <archivo> [--por "Nombre"]
       pnpm aprobar --pendientes

Escribe el hash SHA-256 del registro en data/aprobaciones.json (compuerta humana).
Solo lo corre una persona: si LA_CASTA_AGENTE está definida, el comando se niega.

  --por <nombre>   quién aprueba (por defecto Mantenedor, o LA_CASTA_APROBADOR)
  --pendientes     lista todos los registros que esperan tu firma y no la tienen,
                   con el comando exacto para aprobar cada uno
  --simulacion     calcula y muestra el diff, sin escribir
  --raiz <dir>     raíz del repo (por defecto se deduce de la ruta del archivo)`;

/**
 * Lista los registros que esperan la firma del mantenedor.
 *
 * Existe porque la compuerta humana es lo unico que no puede hacer ningun agente, y hasta ahora no
 * habia forma de ver la cola: `pnpm aprobar` pedia una ruta que habia que averiguar a mano. Un
 * requisito que nadie puede consultar es un requisito que no se cumple.
 */
export interface Pendiente {
  archivo: string;
  coleccion: string;
  id: string;
  motivo: string;
  /** Titulo legible del registro, para no mostrar solo la ruta del archivo. */
  titulo: string;
  tier?: string;
  /** Solo en los vencidos: cuando y quien firmo la version anterior. */
  firmadaAntes?: { fecha: string; por: string };
}

export interface Firmadas {
  coleccion: string;
  id: string;
  fecha: string;
  por: string;
  hash: string;
  /** false si el registro cambio despues de firmarse, o si ya no existe. */
  vigente: boolean;
}

/** Un titulo corto y humano para cada coleccion, sin exponer la ruta del archivo. */
function tituloDe(coleccion: string, datos: Record<string, any>): string {
  switch (coleccion) {
    case 'casos':
      // La insignia ya dice "caso": sin esto queda "caso Caso Astesiano".
      return String(datos.nombre ?? '').replace(/^caso\s+/i, '');
    case 'vetos':
      return String(datos.titulo ?? '');
    case 'giros':
      return String(datos.analisis ?? '').slice(0, 90);
    case 'declaraciones':
      return String(datos.cita ?? '').slice(0, 90);
    case 'promesas':
      return String(datos.texto ?? '').slice(0, 90);
    case 'chequeos':
      return String(datos.afirmacion ?? '').slice(0, 90);
    default:
      return String(datos.titulo ?? datos.nombre ?? '');
  }
}

export function pendientes(rootDir = RAIZ): {
  bloqueados: Pendiente[];
  esperando: Pendiente[];
  vencidos: Pendiente[];
  firmadas: Firmadas[];
} {
  const contenido = cargarContenido(rootDir);
  const aprobaciones = leerAprobaciones(path.join(rootDir, 'data', 'aprobaciones.json'));
  const bloqueados: Pendiente[] = [];
  const esperando: Pendiente[] = [];
  const vencidos: Pendiente[] = [];
  const vigentes = new Set<string>();

  for (const reg of contenido.registros) {
    const { requiere, motivo } = requiereAprobacion(reg);
    if (!requiere) continue;
    const hash = hashCanonico(reg.crudo);
    const ultima = ultimaAprobacion(aprobaciones, reg.coleccion, reg.id);
    const tier = (reg.datos?.revision as { tier?: string } | undefined)?.tier;
    const base = { archivo: reg.archivo, coleccion: reg.coleccion, id: reg.id, titulo: tituloDe(reg.coleccion, reg.datos), tier };
    if (ultima && ultima.hash === hash) {
      vigentes.add(`${reg.coleccion}/${reg.id}`);
      continue;
    }
    if (ultima) {
      vencidos.push({ ...base, motivo, firmadaAntes: { fecha: ultima.fecha, por: ultima.por } });
    } else if (tier === 'publicado') {
      bloqueados.push({ ...base, motivo });
    } else {
      esperando.push({ ...base, motivo });
    }
  }

  const firmadas: Firmadas[] = aprobaciones.map((a) => ({
    coleccion: a.coleccion,
    id: a.id,
    fecha: a.fecha,
    por: a.por,
    hash: a.hash,
    vigente: vigentes.has(`${a.coleccion}/${a.id}`),
  }));

  return { bloqueados, esperando, vencidos, firmadas };
}

function imprimirPendientes(): void {
  const { bloqueados, esperando, vencidos, firmadas } = pendientes();
  const bloque = (titulo: string, explicacion: string, filas: Pendiente[]) => {
    console.log(`\n${titulo} (${filas.length})`);
    console.log(explicacion);
    if (filas.length === 0) {
      console.log('  ninguno.');
      return;
    }
    for (const f of filas) {
      console.log(`  ${f.archivo}`);
      console.log(`      ${f.motivo}${f.tier ? `; hoy está en ${f.tier}` : ''}`);
      console.log(`      pnpm aprobar ${f.archivo}`);
    }
  };
  bloque(
    'Bloquean el build',
    'Están en tier publicado y les falta la firma. El sitio no compila hasta resolverlos: o los firmás, o bajan a probable.',
    bloqueados,
  );
  bloque(
    'Esperan tu firma para poder publicarse',
    'Están en probable y no bloquean nada. Firmarlos es lo que permite que el editor los suba.',
    esperando,
  );
  bloque(
    'Firmados antes, pero el registro cambió',
    'La aprobación vale para el texto exacto que se firmó. Si el registro se editó después, hay que volver a mirarlo.',
    vencidos,
  );
  const total = bloqueados.length + esperando.length + vencidos.length;
  const vigentes = firmadas.filter((f) => f.vigente).length;
  console.log(`\n${total} registro(s) esperan una decisión tuya. Ningún agente puede tomarla.`);
  console.log(`${vigentes} firma(s) vigente(s) sobre ${firmadas.length} registrada(s). Se ven también en /firmas/ del sitio.`);
}

function main(): void {
  const { posicionales, opciones } = parsearArgs(process.argv.slice(2));
  if (opciones.pendientes === true) {
    imprimirPendientes();
    process.exit(0);
  }
  if (!posicionales.length || opciones.ayuda || opciones.help) {
    console.log(AYUDA);
    process.exit(posicionales.length ? 0 : 1);
  }
  try {
    const r = aprobar(posicionales[0]!, {
      rootDir: typeof opciones.raiz === 'string' ? opciones.raiz : undefined,
      por: typeof opciones.por === 'string' ? opciones.por : undefined,
      simulacion: opciones.simulacion === true,
    });
    if (r.anterior) {
      console.log(`Aprobación anterior: ${r.anterior.hash.slice(0, 12)}… el ${r.anterior.fecha} por ${r.anterior.por}.`);
      if (r.diff) {
        console.log('');
        console.log('Cambios desde esa aprobación:');
        console.log(r.diff);
      } else if (r.anterior.hash !== r.aprobacion.hash) {
        console.log('(el registro cambió, pero no se pudo reconstruir la versión anterior desde git para mostrar el diff)');
      }
    }
    if (r.yaAprobado) {
      log.ok(`Sin cambios: ${r.aprobacion.coleccion}/${r.aprobacion.id} ya estaba aprobado con el hash ${r.aprobacion.hash.slice(0, 12)}….`);
      process.exit(0);
    }
    if (opciones.simulacion === true) {
      log.info(`Simulación: no se escribió nada. Hash actual ${r.aprobacion.hash}.`);
      process.exit(0);
    }
    log.ok(`Aprobado ${r.aprobacion.coleccion}/${r.aprobacion.id} — hash ${r.aprobacion.hash.slice(0, 12)}… por ${r.aprobacion.por} el ${r.aprobacion.fecha}.`);
    console.log('Acordate de commitear data/aprobaciones.json (firmado con git commit -S si tenés clave).');
    process.exit(0);
  } catch (e) {
    log.error((e as Error).message);
    process.exit(1);
  }
}

const esEntrada = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (esEntrada) main();
