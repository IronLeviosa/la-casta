/**
 * `agrega[]` de una corrección tiene que existir (docs/plan-correccion-agrega.md).
 *
 * El caso real que lo dispara: la corrección `2026-09-16-astori-irpf-2016-05` nombró en `agrega` dos
 * discrepancias con un id (`discrepancias/astori-franja-...`) que el lote no derivaba (el lote
 * derivaba `discrepancias/el-observador/2016-05-27-astori-...`). `promover` escribió solo `afecta`,
 * callando el resto, y `pnpm validar` dio 0 errores: la corrección quedó publicada diciendo que
 * había agregado dos registros que no existen.
 *
 * Tres lugares donde la regla tiene que cortar, con la misma comprobación (scripts/lib/correccion-lote.ts):
 *
 * 1. `content/`: una corrección aplicada con un `agrega` que no está publicado es un error.
 * 2. `pnpm validar --inbox`: `agrega[]` tiene que coincidir con un id que deriva el lote, y cada
 *    registro del lote tiene que estar en `afecta[]` o `agrega[]`.
 * 3. `pnpm promover --correccion`: lo mismo, antes de escribir nada; si falla, no promueve, y con
 *    `--simulacion` lo informa igual.
 *
 * Y el caso bueno (los ids derivados son los de `agrega`) sigue pasando.
 */
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';
import { afterAll, describe, expect, it } from 'vitest';
import { construirContenido, type Registro } from '../scripts/lib/contenido.ts';
import { promover } from '../scripts/promover.ts';
import { validar } from '../scripts/validar.ts';
import { validarReferencias } from '../scripts/validadores/referencias.ts';
import { FIXTURE_OK } from './ayuda.ts';

const temporales: string[] = [];
afterAll(() => {
  for (const d of temporales.splice(0)) rmSync(d, { recursive: true, force: true });
});

// ---------------------------------------------------------------------------
// 1. content/: una corrección aplicada dice que agregó X y X tiene que estar publicado
// ---------------------------------------------------------------------------

function reg(coleccion: Registro['coleccion'], id: string, datos: Record<string, any>): Registro {
  return { coleccion, id, archivo: `content/${coleccion}/${id}.yaml`, datos, crudo: datos, enInbox: false };
}

const DISCREPANCIA = 'discrepancias/el-observador/2016-05-27-astori-franja-irpf';
const DISCREPANCIA_CON_OTRO_ID = 'discrepancias/astori-franja-irpf-33041-50110-2016';
/** Lo que la corrección afecta: una ficha, que no lleva convenciones de id que el stub tenga que cumplir. */
const DECLARACION = 'politicos/astori';

function correccion(overrides: Record<string, any> = {}): Registro {
  return reg('correcciones', '2026-09-16-astori-irpf', {
    fecha: '2026-09-16',
    tipo: 'cambio_de_rating',
    desenlace: 'aceptada',
    motivo: 'Se suma una discrepancia.',
    afecta: [DECLARACION],
    agrega: [DISCREPANCIA_CON_OTRO_ID],
    revision: { tier: 'publicado' },
    ...overrides,
  });
}

function publicado(idCompleto: string): Registro {
  const [coleccion, ...resto] = idCompleto.split('/');
  return reg(coleccion as Registro['coleccion'], resto.join('/'), {});
}

function referenciasDeContent(registros: Registro[]) {
  return validarReferencias(construirContenido('/fake-root', registros, [], registros.length));
}

describe('content/: el agrega de una corrección aplicada existe', () => {
  it('error: la corrección dice que agregó un id que no está publicado', () => {
    const r = referenciasDeContent([publicado(DECLARACION), publicado(DISCREPANCIA), correccion()]);
    const errores = r.errores.filter((e) => e.campo === 'agrega.0');
    expect(errores).toHaveLength(1);
    expect(errores[0]!.archivo).toBe('content/correcciones/2026-09-16-astori-irpf.yaml');
    expect(errores[0]!.mensaje).toContain(`la corrección dice que agregó ${DISCREPANCIA_CON_OTRO_ID} y no está publicado`);
  });

  it('error con parcialmente_aceptada: también se aplicó', () => {
    const r = referenciasDeContent([publicado(DECLARACION), correccion({ desenlace: 'parcialmente_aceptada' })]);
    expect(r.errores.some((e) => e.campo === 'agrega.0' && e.mensaje.includes('no está publicado'))).toBe(true);
  });

  it('sin errores cuando el agrega está publicado', () => {
    const r = referenciasDeContent([publicado(DECLARACION), publicado(DISCREPANCIA_CON_OTRO_ID), correccion()]);
    expect(r.errores).toEqual([]);
  });

  it('una corrección rechazada no agrega nada: no se le exige nada', () => {
    const rechazada = correccion({
      desenlace: 'rechazada',
      agrega: undefined,
      motivo_rechazo: 'fuera_de_alcance',
      que_cambiaria_la_decision: 'Un documento oficial que lo respalde.',
    });
    const r = referenciasDeContent([publicado(DECLARACION), rechazada]);
    expect(r.errores).toEqual([]);
  });

  it('un id que una corrección posterior retiró con un par de reemplaza es historia, no un error', () => {
    const posterior = reg('correcciones', '2026-09-20-cambio-de-id', {
      fecha: '2026-09-20',
      tipo: 'error_factual',
      desenlace: 'aceptada',
      motivo: 'Cambio de id.',
      afecta: [DISCREPANCIA_CON_OTRO_ID],
      agrega: [DISCREPANCIA],
      reemplaza: [{ de: DISCREPANCIA_CON_OTRO_ID, a: DISCREPANCIA }],
      revision: { tier: 'publicado' },
    });
    const r = referenciasDeContent([publicado(DECLARACION), publicado(DISCREPANCIA), correccion(), posterior]);
    expect(r.errores).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// 2. pnpm validar --inbox: agrega[] contra los ids que deriva el lote
// ---------------------------------------------------------------------------

/** La cita publicada de `2020-04-20-suba-de-iva`: el chequeo de la fixture marca un fragmento de ella, y la copia del lote no puede perderlo. */
const CITA_SUBA_DE_IVA = 'El presidente admitió que la situación obliga a revisar la carga tributaria este año.';

function declaracionCruda(slug: string, fecha: string): Record<string, unknown> {
  const cita = slug === 'suba-de-iva' ? CITA_SUBA_DE_IVA : `Cita de prueba ${slug} con más de veinte caracteres para pasar el esquema.`;
  return {
    _slug: slug,
    politico: 'lacalle-pou',
    tema: 'economia/impuestos',
    fecha,
    contexto: 'gobierno',
    cargo_en_ese_momento: 'Presidente de la República',
    cita,
    resumen: slug === 'suba-de-iva' ? 'Admite que puede haber cambios en la carga tributaria.' : `Registro de prueba ${slug}.`,
    evidencia: {
      nivel: 'textual',
      fuentes: [
        {
          url: `https://ejemplo.uy/${slug}`,
          medio: 'el-pais',
          fecha,
          tipo: 'documento_oficial',
          titulo: 'Documento de prueba',
          cita,
          retrieved_at: fecha,
        },
      ],
    },
    revision: { tier: 'publicado' },
  };
}

function correccionCruda(slug: string, afecta: string[], agrega: string[], extra: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    _slug: slug,
    fecha: '2020-07-02',
    tipo: 'contexto_omitido',
    desenlace: 'aceptada',
    afecta,
    ...(agrega.length ? { agrega } : {}),
    motivo: 'Se suma un registro que faltaba y se ajusta otro.',
    ...extra,
  };
}

/** Lo publicado en FIXTURE_OK que una corrección puede afectar. */
const AFECTADO_FIXTURE = 'declaraciones/lacalle-pou/2020-04-20-suba-de-iva';
/** Lo que deriva el lote para `_slug: nueva` con fecha 2020-07-01. */
const NUEVO_DERIVADO = 'declaraciones/lacalle-pou/2020-07-01-nueva';

function prepararValidar(archivosLote: Record<string, unknown[]>): { raiz: string; inboxDir: string } {
  const raiz = mkdtempSync(path.join(tmpdir(), 'la-casta-agrega-validar-'));
  temporales.push(raiz);
  cpSync(FIXTURE_OK, raiz, { recursive: true });
  const inboxDir = path.join(raiz, 'inbox', 'correcciones', '2020-07-02');
  mkdirSync(inboxDir, { recursive: true });
  for (const [nombre, lista] of Object.entries(archivosLote)) writeFileSync(path.join(inboxDir, `${nombre}.yaml`), stringifyYaml(lista), 'utf8');
  return { raiz, inboxDir };
}

async function erroresDeReferencias(raiz: string, inboxDir: string, correccion?: string) {
  const r = await validar({ rootDir: raiz, inboxDir, solo: 'referencias', escribirSimetria: false, correccion });
  return r.errores;
}

describe('validar --inbox: agrega[] coincide con el lote y cada registro del lote tiene lugar', () => {
  it('caso bueno: el id que deriva el lote es el de agrega', async () => {
    const { raiz, inboxDir } = prepararValidar({
      correcciones: [correccionCruda('suma-nueva', [AFECTADO_FIXTURE], [NUEVO_DERIVADO])],
      declaraciones: [declaracionCruda('suba-de-iva', '2020-04-20'), declaracionCruda('nueva', '2020-07-01')],
    });
    expect(await erroresDeReferencias(raiz, inboxDir)).toEqual([]);
  });

  it('agrega que el lote no deriva: error en agrega y en el registro del lote, con los ids que sí deriva', async () => {
    // El caso de Astori: el editor nombró en `agrega` un id que no es el que deriva el lote.
    const idQueNoEs = 'declaraciones/lacalle-pou/nueva-sin-fecha';
    const { raiz, inboxDir } = prepararValidar({
      correcciones: [correccionCruda('suma-nueva', [AFECTADO_FIXTURE], [idQueNoEs])],
      declaraciones: [declaracionCruda('suba-de-iva', '2020-04-20'), declaracionCruda('nueva', '2020-07-01')],
    });
    const errores = await erroresDeReferencias(raiz, inboxDir);

    const deAgrega = errores.filter((e) => e.campo === 'agrega.0');
    expect(deAgrega).toHaveLength(1);
    expect(deAgrega[0]!.mensaje).toContain(`dice que agrega "${idQueNoEs}" y el lote no deriva ese id`);
    // Lista el id que el lote sí deriva, para corregir correcciones.yaml sin adivinar.
    expect(deAgrega[0]!.mensaje).toContain(NUEVO_DERIVADO);

    const deLote = errores.filter((e) => e.campo === '(id)');
    expect(deLote).toHaveLength(1);
    expect(deLote[0]!.mensaje).toContain(`El lote deriva "${NUEVO_DERIVADO}" y ninguna corrección lo declara`);
    // Y relaciona los dos: el agrega huérfano es probablemente este mismo registro.
    expect(deLote[0]!.mensaje).toContain(idQueNoEs);
  });

  it('un registro del lote que la corrección no declara: error', async () => {
    const { raiz, inboxDir } = prepararValidar({
      correcciones: [correccionCruda('solo-ajuste', [AFECTADO_FIXTURE], [])],
      declaraciones: [declaracionCruda('suba-de-iva', '2020-04-20'), declaracionCruda('nueva', '2020-07-01')],
    });
    const errores = await erroresDeReferencias(raiz, inboxDir);
    expect(errores).toHaveLength(1);
    expect(errores[0]!.campo).toBe('(id)');
    expect(errores[0]!.mensaje).toContain(`El lote deriva "${NUEVO_DERIVADO}"`);
    expect(errores[0]!.mensaje).toContain("en 'afecta' ni en 'agrega'");
  });

  it('un lote con dos correcciones: cada registro tiene lugar en la corrección que lo declara, aunque se elija una sola', async () => {
    const { raiz, inboxDir } = prepararValidar({
      correcciones: [
        correccionCruda('primera', [AFECTADO_FIXTURE], []),
        correccionCruda('segunda', [], [NUEVO_DERIVADO]),
      ],
      declaraciones: [declaracionCruda('suba-de-iva', '2020-04-20'), declaracionCruda('nueva', '2020-07-01')],
    });
    expect(await erroresDeReferencias(raiz, inboxDir)).toEqual([]);
    expect(await erroresDeReferencias(raiz, inboxDir, '2020-07-02-primera')).toEqual([]);
  });

  it('una corrección rechazada no se aplica: no se le exige nada al lote', async () => {
    const { raiz, inboxDir } = prepararValidar({
      correcciones: [
        correccionCruda('rechazo', [AFECTADO_FIXTURE], [], {
          desenlace: 'rechazada',
          motivo_rechazo: 'fuera_de_alcance',
          que_cambiaria_la_decision: 'Un documento oficial que lo respalde.',
        }),
      ],
      declaraciones: [declaracionCruda('nueva', '2020-07-01')],
    });
    expect(await erroresDeReferencias(raiz, inboxDir)).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// 3. pnpm promover --correccion: la misma comprobación, antes de escribir nada
// ---------------------------------------------------------------------------

const ARCHIVO_AFECTADO = ['content', 'declaraciones', 'testpol', '2020-01-01-original.yaml'];
const CONTENIDO_VIEJO = 'politico: testpol\n# versión vieja, se sobreescribe\n';
const AFECTADO_PROMOVER = 'declaraciones/testpol/2020-01-01-original';
/** Lo que deriva el lote para `_slug: nueva`, fecha 2020-02-02. */
const NUEVO_PROMOVER = 'declaraciones/testpol/2020-02-02-nueva';
const RUTA_NUEVO = ['content', 'declaraciones', 'testpol', '2020-02-02-nueva.yaml'];

function prepararPromover(corridaId: string): { raiz: string; inboxDir: string } {
  const raiz = mkdtempSync(path.join(tmpdir(), 'la-casta-agrega-promover-'));
  temporales.push(raiz);
  mkdirSync(path.join(raiz, 'data', 'corridas', corridaId), { recursive: true });
  writeFileSync(path.join(raiz, 'data', 'corridas', corridaId, 'brief.md'), '# brief de prueba\n', 'utf8');
  mkdirSync(path.join(raiz, 'scripts'), { recursive: true });
  writeFileSync(path.join(raiz, 'scripts', 'generar-suplentes.ts'), '// script de fixture\n', 'utf8');
  mkdirSync(path.join(raiz, ...ARCHIVO_AFECTADO.slice(0, -1)), { recursive: true });
  writeFileSync(path.join(raiz, ...ARCHIVO_AFECTADO), CONTENIDO_VIEJO, 'utf8');
  const inboxDir = path.join(raiz, 'inbox-src');
  mkdirSync(inboxDir, { recursive: true });
  return { raiz, inboxDir };
}

function declaracionPromover(slug: string, fecha: string): Record<string, unknown> {
  const cita = `Cita de ${slug} de más de veinte caracteres para pasar la validación del esquema.`;
  return {
    _slug: slug,
    _investigacion: { script: 'generar-suplentes.ts' },
    politico: 'testpol',
    tema: 'economia/impuestos',
    fecha,
    contexto: 'gobierno',
    cargo_en_ese_momento: 'Presidente de la República',
    cita,
    resumen: `Registro ${slug} del lote de prueba.`,
    evidencia: {
      nivel: 'textual',
      fuentes: [{ url: `https://ejemplo.uy/${slug}`, medio: 'el-pais', fecha, tipo: 'documento_oficial', titulo: 'Documento de prueba', cita, retrieved_at: fecha }],
    },
    revision: { tier: 'publicado' },
  };
}

function escribirLote(inboxDir: string, correcciones: unknown[], declaraciones: unknown[]): void {
  writeFileSync(path.join(inboxDir, 'correcciones.yaml'), stringifyYaml(correcciones), 'utf8');
  writeFileSync(path.join(inboxDir, 'declaraciones.yaml'), stringifyYaml(declaraciones), 'utf8');
}

function correccionPromover(slug: string, afecta: string[], agrega: string[]): Record<string, unknown> {
  return {
    _slug: slug,
    fecha: '2020-09-01',
    tipo: 'contexto_omitido',
    desenlace: 'aceptada',
    afecta,
    ...(agrega.length ? { agrega } : {}),
    motivo: 'Se suma un registro que faltaba y se ajusta otro.',
  };
}

function nadaEscrito(raiz: string): void {
  expect(existsSync(path.join(raiz, 'content', 'correcciones'))).toBe(false);
  expect(existsSync(path.join(raiz, ...RUTA_NUEVO))).toBe(false);
  expect(readFileSync(path.join(raiz, ...ARCHIVO_AFECTADO), 'utf8')).toBe(CONTENIDO_VIEJO);
}

describe('promover --correccion: agrega contra el lote, antes de escribir nada', () => {
  it('caso bueno: escribe el afectado y el agregado, con procedencia de corrección', () => {
    const corridaId = '2020-09-01-testpol-agrega-bueno';
    const { raiz, inboxDir } = prepararPromover(corridaId);
    escribirLote(inboxDir, [correccionPromover('suma-nueva', [AFECTADO_PROMOVER], [NUEVO_PROMOVER])], [declaracionPromover('original', '2020-01-01'), declaracionPromover('nueva', '2020-02-02')]);

    const r = promover(inboxDir, { rootDir: raiz, corrida: corridaId, correccion: true });

    expect(r.errores).toEqual([]);
    expect(r.promovidos.map((p) => `${p.coleccion}/${p.id}`).sort()).toEqual([AFECTADO_PROMOVER, NUEVO_PROMOVER]);
    const nuevo = parseYaml(readFileSync(path.join(raiz, ...RUTA_NUEVO), 'utf8'));
    expect(nuevo.procedencia).toEqual({ tipo: 'correccion', correccion: '2020-09-01-suma-nueva' });
    expect(existsSync(path.join(raiz, 'content', 'correcciones', '2020-09-01-suma-nueva.yaml'))).toBe(true);
  });

  it('agrega que el lote no deriva: se niega, no escribe nada y lista los ids que sí deriva', () => {
    const corridaId = '2020-09-01-testpol-agrega-malo';
    const { raiz, inboxDir } = prepararPromover(corridaId);
    const idQueNoEs = 'declaraciones/testpol/nueva-sin-fecha';
    escribirLote(inboxDir, [correccionPromover('suma-nueva', [AFECTADO_PROMOVER], [idQueNoEs])], [declaracionPromover('original', '2020-01-01'), declaracionPromover('nueva', '2020-02-02')]);

    const r = promover(inboxDir, { rootDir: raiz, corrida: corridaId, correccion: true });

    expect(r.promovidos).toEqual([]);
    expect(r.simulado).toBe(true);
    expect(r.correccionEscrita).toBeUndefined();
    const deAgrega = r.errores.filter((e) => e.campo === 'agrega.0');
    expect(deAgrega).toHaveLength(1);
    expect(deAgrega[0]!.mensaje).toContain(`dice que agrega "${idQueNoEs}" y el lote no deriva ese id`);
    expect(deAgrega[0]!.mensaje).toContain(NUEVO_PROMOVER);
    // «Nunca escribir lo que coincide y callar el resto»: el registro del lote sin lugar también se lista.
    expect(r.errores.some((e) => e.campo === '(id)' && e.mensaje.includes(`El lote deriva "${NUEVO_PROMOVER}"`))).toBe(true);
    nadaEscrito(raiz);
  });

  it('registro del lote que la corrección no declara: se niega, no escribe nada', () => {
    const corridaId = '2020-09-01-testpol-lote-sin-lugar';
    const { raiz, inboxDir } = prepararPromover(corridaId);
    escribirLote(inboxDir, [correccionPromover('solo-ajuste', [AFECTADO_PROMOVER], [])], [declaracionPromover('original', '2020-01-01'), declaracionPromover('nueva', '2020-02-02')]);

    const r = promover(inboxDir, { rootDir: raiz, corrida: corridaId, correccion: true });

    expect(r.promovidos).toEqual([]);
    expect(r.errores).toHaveLength(1);
    expect(r.errores[0]!.campo).toBe('(id)');
    expect(r.errores[0]!.mensaje).toContain(`El lote deriva "${NUEVO_PROMOVER}"`);
    nadaEscrito(raiz);
  });

  it('--simulacion informa lo mismo como listado', () => {
    const corridaId = '2020-09-01-testpol-agrega-simulacion';
    const { raiz, inboxDir } = prepararPromover(corridaId);
    const idQueNoEs = 'declaraciones/testpol/nueva-sin-fecha';
    escribirLote(inboxDir, [correccionPromover('suma-nueva', [AFECTADO_PROMOVER], [idQueNoEs])], [declaracionPromover('original', '2020-01-01'), declaracionPromover('nueva', '2020-02-02')]);

    const r = promover(inboxDir, { rootDir: raiz, corrida: corridaId, correccion: true, simulacion: true });

    expect(r.simulado).toBe(true);
    expect(r.promovidos).toEqual([]);
    expect(r.errores.map((e) => e.campo).sort()).toEqual(['(id)', 'agrega.0']);
    expect(r.errores.find((e) => e.campo === 'agrega.0')!.mensaje).toContain(NUEVO_PROMOVER);
    nadaEscrito(raiz);
  });

  it('un lote con dos correcciones: se promueve una y el registro de la otra no es un error, solo no se escribe', () => {
    const corridaId = '2020-09-01-testpol-dos-correcciones';
    const { raiz, inboxDir } = prepararPromover(corridaId);
    escribirLote(
      inboxDir,
      [correccionPromover('primera', [AFECTADO_PROMOVER], []), correccionPromover('segunda', [], [NUEVO_PROMOVER])],
      [declaracionPromover('original', '2020-01-01'), declaracionPromover('nueva', '2020-02-02')],
    );
    // Sin crudo congelado antes, edicion.diff no sale vacío y promover exige razones.md (no es lo que se prueba acá).
    writeFileSync(path.join(raiz, 'data', 'corridas', corridaId, 'razones.md'), 'Lote de prueba de dos correcciones.' + String.fromCharCode(10), 'utf8');

    const r = promover(inboxDir, { rootDir: raiz, corrida: corridaId, correccion: '2020-09-01-primera' });

    expect(r.errores).toEqual([]);
    expect(r.promovidos.map((p) => `${p.coleccion}/${p.id}`)).toEqual([AFECTADO_PROMOVER]);
    expect(existsSync(path.join(raiz, ...RUTA_NUEVO))).toBe(false);
  });
});
