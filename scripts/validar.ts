/**
 * `pnpm validar [--red] [--inbox <dir>] [--solo <etapa>] [--json]`
 *
 * Orquestador del validador. Etapas en orden, corta en la primera que falla:
 *
 *   1. esquema      cada YAML pasa su Zod y el nombre de archivo cumple el patrón
 *   2. referencias  refs resueltas, giros coherentes, casos ascendentes, etiqueta_legal
 *   3. tiers        niveles de evidencia, compuerta humana, procedencia, ledger
 *   4. fuentes      (--red) HTTP + Wayback de cada URL, actualiza el ledger
 *   5. citas        (--red) la cita aparece en el texto o en la transcripción
 *   6. simetria     solo informa; escribe data/simetria.json
 *
 * Códigos de salida: 0 ok, 1 errores de contenido, 2 fallo de infraestructura
 * (sin red, ledger no escribible). CI reintenta solo el 2.
 *
 * Modo `--inbox <dir>`: valida una corrida de `inbox/<politico>/<tema>/<fecha>/`
 * con reglas relajadas (todavía no tiene tier, procedencia ni aprobación, y sus
 * referencias pueden resolver dentro de la misma corrida). Es el bucle
 * anti-alucinación: los registros cuya cita no aparece vuelven al agente.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { cargarContenido, construirContenido, type Contenido } from './lib/contenido.ts';
import { cargarInbox } from './lib/inbox.ts';
import { log, parsearArgs } from './lib/log.ts';
import { validarReferencias } from './validadores/referencias.ts';
import { validarTiers } from './validadores/tiers.ts';
import { validarFuentes, type VerificadorUrl } from './validadores/fuentes.ts';
import { validarCitas, type OpcionesCitas } from './validadores/citas.ts';
import { informeSimetria, validarSimetria, tabla, type ResumenSimetria } from './validadores/simetria.ts';
import { ErrorInfraestructura, type Problema, type ResultadoEtapa } from './validadores/tipos.ts';

export const ETAPAS = ['esquema', 'referencias', 'tiers', 'fuentes', 'citas', 'simetria'] as const;
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
  aprobacionesPath?: string;
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
}

function etapaOmitida(etapa: NombreEtapa, detalle: string): EtapaEjecutada {
  return { etapa, ok: true, errores: [], avisos: [], detalle, omitida: true };
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
  const razonOmitida = (etapa: NombreEtapa): string =>
    opciones.solo ? `omitida (--solo ${opciones.solo})` : ETAPAS_DE_RED.has(etapa) ? 'omitida (necesita --red)' : 'omitida';

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
  if (!etapaEsquema.ok) return terminar(1, { archivos, registros: contenido.registros.length });

  const comun = { archivos, registros: contenido.registros.length };

  // -------------------------------------------------------------------------
  // Etapa 2: referencias
  // -------------------------------------------------------------------------
  if (corre('referencias')) {
    const res = validarReferencias(contenido);
    etapas.push({ etapa: 'referencias', ok: res.errores.length === 0, ...res, detalle: `${contenido.registros.length} registro(s)`, omitida: false });
    if (res.errores.length) return terminar(1, comun);
  } else {
    etapas.push(etapaOmitida('referencias', razonOmitida('referencias')));
  }

  // -------------------------------------------------------------------------
  // Etapa 3: tiers
  // -------------------------------------------------------------------------
  if (corre('tiers')) {
    const res = validarTiers(contenido, {
      modoInbox,
      aprobacionesPath: opciones.aprobacionesPath,
      ledgerPath: opciones.ledgerPath,
      corridasDir: opciones.corridasDir,
    });
    etapas.push({ etapa: 'tiers', ok: res.errores.length === 0, ...res, detalle: modoInbox ? 'reglas relajadas (inbox)' : 'tier, evidencia, aprobación, procedencia, ledger', omitida: false });
    if (res.errores.length) return terminar(1, comun);
  } else {
    etapas.push(etapaOmitida('tiers', razonOmitida('tiers')));
  }

  // -------------------------------------------------------------------------
  // Etapa 4: fuentes (--red)
  // -------------------------------------------------------------------------
  if (corre('fuentes')) {
    try {
      const res = await validarFuentes(contenido, {
        modoInbox,
        ledgerPath: opciones.ledgerPath,
        verificarUrl: opciones.verificarUrl,
        progreso,
      });
      etapas.push({
        etapa: 'fuentes',
        ok: res.errores.length === 0,
        errores: res.errores,
        avisos: res.avisos,
        detalle: `${res.verificadas} URL(s) verificadas`,
        omitida: false,
      });
      if (res.errores.length) return terminar(1, comun);
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
  // Etapa 5: citas (--red)
  // -------------------------------------------------------------------------
  if (corre('citas')) {
    try {
      const res = await validarCitas(contenido, { modoInbox, progreso, ...opciones.citas });
      etapas.push({
        etapa: 'citas',
        ok: res.errores.length === 0,
        errores: res.errores,
        avisos: res.avisos,
        detalle: `${res.verificadas} cita(s): ${res.exactas} exacta(s), ${res.aproximadas} aproximada(s), ${res.manuales} manual(es), ${res.desdeCache} de caché`,
        omitida: false,
      });
      if (res.errores.length) return terminar(1, comun);
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
  // Etapa 6: simetría (solo informa; nunca falla)
  // -------------------------------------------------------------------------
  let simetria: ResumenSimetria | undefined;
  let informe: string | undefined;
  if (corre('simetria')) {
    // En modo --inbox no se escribe el JSON: la corrida todavía no es contenido.
    const res = validarSimetria(contenido, {
      salida: opciones.simetriaPath,
      sinEscribir: opciones.escribirSimetria === false || modoInbox,
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

  return terminar(0, { ...comun, simetria, informeSimetria: informe });
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
  --solo <etapa>    corre una sola etapa (${ETAPAS.join(' | ')})
  --json            imprime el resultado completo en JSON por stdout
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
  const resultado = await validar({
    rootDir: typeof opciones.raiz === 'string' ? opciones.raiz : undefined,
    red: opciones.red === true,
    inboxDir: typeof opciones.inbox === 'string' ? opciones.inbox : undefined,
    solo,
    progreso: json ? undefined : (m) => log.info(m),
  });
  imprimir(resultado, { json });
  process.exit(resultado.codigo);
}

const esEntrada = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (esEntrada) {
  main().catch((e) => {
    console.error(`Error inesperado: ${(e as Error).stack ?? (e as Error).message}`);
    process.exit(2);
  });
}
