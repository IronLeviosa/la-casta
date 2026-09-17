/**
 * `pnpm promover <dir> --correccion [id]` cuando la corrección todavía no existe en
 * `content/correcciones/`, pero el inbox trae `correcciones.yaml` (lo dejan `pnpm reverificar
 * --escribir` y `pnpm lote fusionar`, o el editor de `/correccion` a mano): antes de este cambio,
 * `promover` exigía que la corrección ya estuviera publicada y nada la llevaba ahí desde el inbox
 * (docs/colecciones/correcciones.md, "el único camino por el que un registro ya publicado cambia").
 *
 * Sigue el mismo patrón que tests/procedencia-script.test.ts: una raíz de proyecto mínima (sin
 * git) con `data/corridas/<id>/brief.md` y un script real en `scripts/` para que la procedencia
 * por script del registro afectado no exija agente ni modelo (se descarta igual: en modo
 * corrección la procedencia final es siempre `{tipo: correccion, correccion: <id>}`).
 */
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';
import { afterAll, describe, expect, it, vi } from 'vitest';
import { promover } from '../scripts/promover.ts';
import { fusionar } from '../scripts/lote.ts';
import { validar } from '../scripts/validar.ts';
import { verificarArtefactos } from '../scripts/lib/corridas.ts';
import { log } from '../scripts/lib/log.ts';
import { FIXTURE_OK } from './ayuda.ts';

const temporales: string[] = [];
afterAll(() => {
  for (const d of temporales.splice(0)) rmSync(d, { recursive: true, force: true });
});

const ARCHIVO_AFECTADO = ['content', 'declaraciones', 'testpol', '2020-01-01-original.yaml'];

/** Raíz mínima: brief.md de la corrida, un script real (procedencia por script) y el registro publicado que la corrección va a sobreescribir. */
function prepararRaiz(corridaId: string): { raiz: string; inboxDir: string } {
  const raiz = mkdtempSync(path.join(tmpdir(), 'la-casta-promover-correccion-'));
  temporales.push(raiz);

  mkdirSync(path.join(raiz, 'data', 'corridas', corridaId), { recursive: true });
  writeFileSync(path.join(raiz, 'data', 'corridas', corridaId, 'brief.md'), '# brief de prueba\n', 'utf8');

  mkdirSync(path.join(raiz, 'scripts'), { recursive: true });
  writeFileSync(path.join(raiz, 'scripts', 'generar-suplentes.ts'), '// script de fixture\n', 'utf8');

  mkdirSync(path.join(raiz, ...ARCHIVO_AFECTADO.slice(0, -1)), { recursive: true });
  // El contenido de "lo ya publicado" no importa: promover en modo corrección lo sobreescribe
  // entero y no lo lee antes (solo comprueba que el archivo exista).
  writeFileSync(path.join(raiz, ...ARCHIVO_AFECTADO), 'politico: testpol\n# versión vieja, se sobreescribe\n', 'utf8');

  const inboxDir = path.join(raiz, 'inbox-src');
  mkdirSync(inboxDir, { recursive: true });
  return { raiz, inboxDir };
}

/** Registro corregido de `declaraciones` para `testpol/2020-01-01-original`: sin agente ni modelo (procedencia por script), como en tests/procedencia-script.test.ts. */
function declaracionCorregida(): Record<string, unknown> {
  return {
    _slug: 'original',
    _investigacion: { script: 'generar-suplentes.ts' },
    politico: 'testpol',
    tema: 'economia/impuestos',
    fecha: '2020-01-01',
    contexto: 'gobierno',
    cargo_en_ese_momento: 'Presidente de la República',
    cita: 'Cita corregida de más de veinte caracteres para pasar la validación del esquema.',
    resumen: 'Registro corregido por la corrección de prueba.',
    evidencia: {
      nivel: 'textual',
      fuentes: [
        {
          url: 'https://ejemplo.uy/corregido',
          medio: 'el-pais',
          fecha: '2020-01-01',
          tipo: 'documento_oficial',
          titulo: 'Documento corregido',
          cita: 'Cita corregida de más de veinte caracteres para pasar la validación del esquema.',
          retrieved_at: '2020-01-01',
        },
      ],
    },
    revision: { tier: 'publicado' },
  };
}

describe('promover() escribe la corrección desde el inbox, de punta a punta', () => {
  it('sin _slug en correcciones.yaml: error claro, no deriva el id de afecta[0] (mantenedor, 2026-09-16)', () => {
    // Antes, sin `_slug`, promover derivaba el id de la corrección del primer id de `afecta`
    // ("declaraciones/testpol/2020-01-01-original" → "testpol-2020-01-01-original") con solo un
    // aviso, y el id de la corrección terminaba pareciendo el id de una declaración. Ahora corta
    // con un mensaje que pide el `_slug` explícito, y no escribe nada en content/.
    const corridaId = '2020-07-01-testpol-correccion-prueba';
    const { raiz, inboxDir } = prepararRaiz(corridaId);

    writeFileSync(
      path.join(inboxDir, 'correcciones.yaml'),
      stringifyYaml([
        {
          fecha: '2020-07-01',
          tipo: 'error_factual',
          desenlace: 'aceptada',
          afecta: ['declaraciones/testpol/2020-01-01-original'],
          motivo: 'La cita publicada no correspondía a la afirmación; se reemplaza por la cita correcta.',
        },
      ]),
      'utf8',
    );
    writeFileSync(path.join(inboxDir, 'declaraciones.yaml'), stringifyYaml([declaracionCorregida()]), 'utf8');

    const r = promover(inboxDir, { rootDir: raiz, corrida: corridaId, correccion: true });

    expect(r.promovidos).toEqual([]);
    expect(r.errores).toHaveLength(1);
    expect(r.errores[0]!.campo).toBe('_slug');
    expect(r.errores[0]!.mensaje).toMatch(/necesita _slug/);
    expect(r.correccionEscrita).toBeUndefined();
    expect(existsSync(path.join(raiz, 'content', 'correcciones'))).toBe(false);
    // El registro afectado tampoco cambió: promover no llegó a tocar content/.
    expect(readFileSync(path.join(raiz, ...ARCHIVO_AFECTADO), 'utf8')).toBe('politico: testpol\n# versión vieja, se sobreescribe\n');
  });

  it('con --correccion sin id y un solo registro en correcciones.yaml, lo toma directo', () => {
    const corridaId = '2020-07-02-testpol-correccion-prueba';
    const { raiz, inboxDir } = prepararRaiz(corridaId);

    writeFileSync(
      path.join(inboxDir, 'correcciones.yaml'),
      stringifyYaml([
        {
          _slug: 'cita-mal-copiada',
          fecha: '2020-07-02',
          tipo: 'error_factual',
          desenlace: 'aceptada',
          afecta: ['declaraciones/testpol/2020-01-01-original'],
          motivo: 'La cita publicada no correspondía a la afirmación; se reemplaza por la cita correcta.',
        },
      ]),
      'utf8',
    );
    writeFileSync(path.join(inboxDir, 'declaraciones.yaml'), stringifyYaml([declaracionCorregida()]), 'utf8');

    const r = promover(inboxDir, { rootDir: raiz, corrida: corridaId, correccion: true });

    expect(r.errores).toEqual([]);
    expect(r.correccionEscrita).toBe('2020-07-02-cita-mal-copiada');
    expect(existsSync(path.join(raiz, 'content', 'correcciones', '2020-07-02-cita-mal-copiada.yaml'))).toBe(true);
    expect(r.promovidos).toHaveLength(1);
  });

  it('sin _investigacion (ni script ni modelo) ni --modelo: no lo exige, porque en modo corrección la procedencia no lo usa', () => {
    // Antes, un registro de declaraciones sin `_investigacion.script` caía en la rama que exige
    // `_investigacion.modelo` o `--modelo`, aunque la procedencia final de una corrección siempre
    // sea `{tipo: correccion, correccion}` y ese modelo nunca se escriba en ningún lado.
    const corridaId = '2020-07-07-testpol-correccion-prueba';
    const { raiz, inboxDir } = prepararRaiz(corridaId);

    writeFileSync(
      path.join(inboxDir, 'correcciones.yaml'),
      stringifyYaml([
        {
          _slug: 'cita-sin-modelo',
          fecha: '2020-07-07',
          tipo: 'error_factual',
          desenlace: 'aceptada',
          afecta: ['declaraciones/testpol/2020-01-01-original'],
          motivo: 'La cita publicada no correspondía a la afirmación; se reemplaza por la cita correcta.',
        },
      ]),
      'utf8',
    );
    const declaracionSinInvestigacion = declaracionCorregida();
    delete (declaracionSinInvestigacion as Record<string, unknown>)._investigacion;
    writeFileSync(path.join(inboxDir, 'declaraciones.yaml'), stringifyYaml([declaracionSinInvestigacion]), 'utf8');

    // Sin --modelo: antes de este cambio, esto tiraba "Falta el modelo que produjo el registro".
    const r = promover(inboxDir, { rootDir: raiz, corrida: corridaId, correccion: true });

    expect(r.errores).toEqual([]);
    expect(r.correccionEscrita).toBe('2020-07-07-cita-sin-modelo');
    expect(r.promovidos).toHaveLength(1);
    const destino = path.join(raiz, ...r.promovidos[0]!.destino.split('/'));
    const declaracionEscrita = parseYaml(readFileSync(destino, 'utf8'));
    expect(declaracionEscrita.procedencia).toEqual({ tipo: 'correccion', correccion: '2020-07-07-cita-sin-modelo' });
  });

  it('con varias correcciones en el archivo y sin id, lista los ids disponibles y no promueve nada', () => {
    const corridaId = '2020-07-03-testpol-correccion-prueba';
    const { raiz, inboxDir } = prepararRaiz(corridaId);

    writeFileSync(
      path.join(inboxDir, 'correcciones.yaml'),
      stringifyYaml([
        { _slug: 'primera', fecha: '2020-07-03', tipo: 'error_factual', desenlace: 'aceptada', afecta: ['declaraciones/testpol/2020-01-01-original'], motivo: 'Motivo uno.' },
        { _slug: 'segunda', fecha: '2020-07-03', tipo: 'presentacion', desenlace: 'aceptada', afecta: ['declaraciones/testpol/2020-01-01-original'], motivo: 'Motivo dos.' },
      ]),
      'utf8',
    );

    expect(() => promover(inboxDir, { rootDir: raiz, corrida: corridaId, correccion: true })).toThrow(/2020-07-03-primera/);
    expect(existsSync(path.join(raiz, 'content', 'correcciones'))).toBe(false);
  });

  it('desenlace: rechazada publica la corrección en content/correcciones/ y no toca el registro afectado', () => {
    const corridaId = '2020-07-04-testpol-correccion-prueba';
    const { raiz, inboxDir } = prepararRaiz(corridaId);
    const contenidoOriginal = readFileSync(path.join(raiz, ...ARCHIVO_AFECTADO), 'utf8');

    writeFileSync(
      path.join(inboxDir, 'correcciones.yaml'),
      stringifyYaml([
        {
          _slug: 'pedido-sin-sustento',
          fecha: '2020-07-04',
          tipo: 'error_factual',
          desenlace: 'rechazada',
          motivo_rechazo: 'evidencia_insuficiente',
          que_cambiaria_la_decision: 'Una segunda fuente de un grupo de medios distinto.',
          afecta: ['declaraciones/testpol/2020-01-01-original'],
          motivo: 'El pedido no traía evidencia suficiente para sostener el cambio.',
        },
      ]),
      'utf8',
    );

    expect(() => promover(inboxDir, { rootDir: raiz, corrida: corridaId, correccion: true })).toThrow(/desenlace 'rechazada'/);

    // Se publicó igual (docs/colecciones/correcciones.md: "los tres desenlaces se publican").
    const rutaCorreccion = path.join(raiz, 'content', 'correcciones', '2020-07-04-pedido-sin-sustento.yaml');
    expect(existsSync(rutaCorreccion)).toBe(true);
    const correccionEscrita = parseYaml(readFileSync(rutaCorreccion, 'utf8'));
    expect(correccionEscrita.desenlace).toBe('rechazada');
    expect(correccionEscrita.revision).toEqual({ tier: 'publicado' });

    // El registro afectado no cambió.
    expect(readFileSync(path.join(raiz, ...ARCHIVO_AFECTADO), 'utf8')).toBe(contenidoOriginal);
  });
});

// ---------------------------------------------------------------------------
// Corrida de una corrección generada por un script (pnpm reverificar --escribir, pnpm lote
// fusionar): antes de este cambio, esos dos scripts dejaban correcciones.yaml en
// inbox/correcciones/<fecha>/ pero ninguna corrida en data/corridas/, así que `pnpm promover <dir>
// --correccion <id>` no tenía dónde escribir el rastro (exige data/corridas/<id>/brief.md) y el
// comando que ellos mismos imprimían no funcionaba. Ahora ambos crean la corrida mecánica (sin
// agente ni crítico, pero con sus siete artefactos) e imprimen `--corrida <id>` en el comando.
//
// Este test usa `pnpm lote fusionar` (la otra alternativa ofrecida es `pnpm reverificar`) porque
// es el único de los dos que deja, en el mismo inbox/correcciones/<fecha>/, tanto el registro de
// corrección como el contenido ya corregido (politicos.yaml): `pnpm reverificar --escribir` solo
// documenta el cambio en `cambios[]` sin reescribir el registro, así que promoverlo no alcanza para
// probar de punta a punta que "el registro afectado cambió".
// ---------------------------------------------------------------------------
describe('corrida de una corrección generada por script (pnpm lote fusionar)', () => {
  it('fusionar() crea data/corridas/<id>/ completa, y promover() aplica el cambio de punta a punta', async () => {
    const raiz = mkdtempSync(path.join(tmpdir(), 'la-casta-corrida-script-'));
    temporales.push(raiz);
    cpSync(FIXTURE_OK, raiz, { recursive: true });

    // `_investigacion: {script: 'lote.ts'}` que fusionar() le agrega a la ficha necesita que
    // scripts/lote.ts exista de verdad bajo rootDir (promover() lo hashea); FIXTURE_OK no trae
    // scripts/, así que se deja un archivo de fixture, como con generar-suplentes.ts en los tests
    // de arriba.
    mkdirSync(path.join(raiz, 'scripts'), { recursive: true });
    writeFileSync(path.join(raiz, 'scripts', 'lote.ts'), '// script de fixture para esta prueba\n', 'utf8');

    // Ficha "pendiente" con un mandato de Diputado anterior a la presidencia (contenido en
    // tests/fixtures/ok/content/politicos/lacalle-pou.yaml), como si viniera de otra cámara: es el
    // caso real que fusionar() documenta ("mismo slug, una ficha publicada y otra en el inbox de la
    // otra cámara").
    const inboxDir = path.join(raiz, 'inbox', 'senadores', 'fusion');
    mkdirSync(inboxDir, { recursive: true });
    const fichaPendiente = {
      _slug: 'lacalle-pou',
      nombre: 'Luis Alberto Aparicio Alejandro Lacalle Pou',
      nombre_corto: 'Luis Lacalle Pou',
      partido: 'Partido Nacional',
      alias: ['Diputado Lacalle Pou'],
      mandatos: [
        {
          cargo: 'Diputado',
          desde: '2000-02-15',
          hasta: '2010-02-14',
          fuentes: [
            {
              url: 'https://ejemplo.uy/diputado-lacalle-pou',
              medio: 'wikipedia',
              fecha: '2026-09-03',
              tipo: 'nota',
              titulo: 'Luis Lacalle Pou diputado',
              cita: 'Fue diputado por Canelones entre 2000 y 2010, antes de asumir la presidencia.',
              retrieved_at: '2026-09-03',
            },
          ],
        },
      ],
      estado_actual: {
        situacion: 'fuera_de_cargo',
        salida: {
          tipo: 'fin_de_mandato',
          fecha: '2010-02-14',
          fuentes: [
            {
              url: 'https://ejemplo.uy/diputado-lacalle-pou',
              medio: 'wikipedia',
              fecha: '2026-09-03',
              tipo: 'nota',
              titulo: 'Luis Lacalle Pou diputado',
              cita: 'Fue diputado por Canelones entre 2000 y 2010, antes de asumir la presidencia.',
              retrieved_at: '2026-09-03',
            },
          ],
        },
      },
      revision: { tier: 'publicado' },
    };
    writeFileSync(path.join(inboxDir, 'politicos.yaml'), stringifyYaml([fichaPendiente]), 'utf8');

    const r = fusionar('lacalle-pou', 'lacalle-pou', { queda: 'lacalle-pou', fecha: '2026-09-10', inboxDir, rootDir: raiz });

    expect(r.escrito).toBe(true);
    expect(r.corridaId).toBe('2026-09-10-fusion-lacalle-pou');
    expect(r.comandoPromover).toBe(
      `pnpm promover inbox/correcciones/2026-09-10 --correccion 2026-09-10-fusion-lacalle-pou --corrida ${r.corridaId}`,
    );

    // 1. data/corridas/<id>/ tiene sus siete artefactos (brief.md, consultas.jsonl, critica.md y
    //    razones.md los escribió fusionar(); crudo/, agentes.json y edicion.diff los escribe promover()).
    const corridaDir = path.join(raiz, 'data', 'corridas', r.corridaId!);
    for (const nombre of ['brief.md', 'consultas.jsonl', 'critica.md', 'razones.md']) {
      expect(existsSync(path.join(corridaDir, nombre))).toBe(true);
    }
    expect(readFileSync(path.join(corridaDir, 'critica.md'), 'utf8')).toMatch(/sin crítica/i);

    // 2. promover(), con la corrida que fusionar() creó, aplica el cambio.
    const inboxCorreccionDir = path.join(raiz, 'inbox', 'correcciones', '2026-09-10');
    const idCorreccion = `2026-09-10-${(r.correccion as { _slug: string })._slug}`;
    const pr = promover(inboxCorreccionDir, { rootDir: raiz, corrida: r.corridaId, correccion: idCorreccion });
    expect(pr.errores).toEqual([]);
    expect(pr.promovidos).toHaveLength(1);
    expect(pr.promovidos[0]!.id).toBe('lacalle-pou');

    // 3. El registro afectado cambió: ahora tiene los dos mandatos (Diputado + Presidente) y el
    //    alias nuevo.
    const fichaFinal = parseYaml(readFileSync(path.join(raiz, 'content', 'politicos', 'lacalle-pou.yaml'), 'utf8'));
    expect(fichaFinal.mandatos).toHaveLength(2);
    expect(fichaFinal.mandatos.map((m: { cargo: string }) => m.cargo).sort()).toEqual(['Diputado', 'Presidente de la República']);
    expect(fichaFinal.alias).toContain('Diputado Lacalle Pou');
    expect(fichaFinal.procedencia).toEqual({ tipo: 'correccion', correccion: idCorreccion });

    // 4. content/correcciones/<id>.yaml existe.
    expect(existsSync(path.join(raiz, 'content', 'correcciones', `${idCorreccion}.yaml`))).toBe(true);

    // 5. data/corridas/<id-corrida>/ tiene los siete artefactos completos (verificarArtefactos, la
    //    misma función que usa la etapa `tiers` del validador).
    const estado = verificarArtefactos(corridaDir);
    expect(estado.existe).toBe(true);
    expect(estado.faltantes).toEqual([]);
    expect(estado.soloBrief).toBe(false);

    // 6. `pnpm validar` sobre ese árbol no marca la corrida incompleta (el registro afectado, con
    //    procedencia.tipo: correccion, ni siquiera dispara ese chequeo; se confirma igual acá).
    const resultado = await validar({ rootDir: raiz, escribirSimetria: false });
    const incompletas = resultado.errores.filter((e) => /incompleta/i.test(e.mensaje));
    expect(incompletas).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// idCorridaDesdeInbox no reconoce inbox/correcciones/<fecha> (dos niveles, no <politico>/<tema>/
// <fecha>): antes ya devolvía null sin romper, pero el mensaje de promover() hablaba de
// "politico/tema", que no tiene sentido para una corrección. Ahora, sin pasar --corrida, el
// mensaje dice específicamente qué pasar.
// ---------------------------------------------------------------------------
describe('promover() sin --corrida sobre inbox/correcciones/<fecha>', () => {
  it('no rompe: pide --corrida con un mensaje específico de corrección, y los inbox de tres niveles siguen igual', () => {
    const corridaId = '2020-07-05-testpol-correccion-prueba';
    const raiz = mkdtempSync(path.join(tmpdir(), 'la-casta-promover-correccion-'));
    temporales.push(raiz);

    mkdirSync(path.join(raiz, 'data', 'corridas', corridaId), { recursive: true });
    writeFileSync(path.join(raiz, 'data', 'corridas', corridaId, 'brief.md'), '# brief de prueba\n', 'utf8');
    mkdirSync(path.join(raiz, 'scripts'), { recursive: true });
    writeFileSync(path.join(raiz, 'scripts', 'generar-suplentes.ts'), '// script de fixture\n', 'utf8');
    mkdirSync(path.join(raiz, ...ARCHIVO_AFECTADO.slice(0, -1)), { recursive: true });
    writeFileSync(path.join(raiz, ...ARCHIVO_AFECTADO), 'politico: testpol\n# versión vieja\n', 'utf8');

    // Dos niveles bajo inbox/: correcciones/<fecha>, como los deja pnpm reverificar --escribir y
    // pnpm lote fusionar. idCorridaDesdeInbox() no puede derivar de ahí un id <politico>/<tema>/
    // <fecha>: promover() tiene que pedir --corrida explícito, sin lanzar un error genérico.
    const inboxDir = path.join(raiz, 'inbox', 'correcciones', '2020-07-05');
    mkdirSync(inboxDir, { recursive: true });
    writeFileSync(
      path.join(inboxDir, 'correcciones.yaml'),
      stringifyYaml([
        {
          _slug: 'prueba-mensaje',
          fecha: '2020-07-05',
          tipo: 'error_factual',
          desenlace: 'aceptada',
          afecta: ['declaraciones/testpol/2020-01-01-original'],
          motivo: 'Motivo de prueba para el mensaje de error.',
        },
      ]),
      'utf8',
    );
    writeFileSync(path.join(inboxDir, 'declaraciones.yaml'), stringifyYaml([declaracionCorregida()]), 'utf8');

    // Sin --corrida: falla con un mensaje que menciona inbox/correcciones y --corrida, no el
    // genérico de <politico>-<tema>.
    expect(() => promover(inboxDir, { rootDir: raiz, correccion: true })).toThrow(/inbox\/correcciones.*--corrida/s);

    // Con --corrida sí funciona (mismo comportamiento que ya prueban los tests de arriba).
    const r = promover(inboxDir, { rootDir: raiz, corrida: corridaId, correccion: true });
    expect(r.errores).toEqual([]);
    expect(r.promovidos).toHaveLength(1);

    // Un inbox de tres niveles (<politico>/<tema>/<fecha>) sigue derivando su id como siempre.
    const inboxTresNiveles = path.join(raiz, 'inbox', 'testpol', 'economia', '2020-07-06');
    mkdirSync(inboxTresNiveles, { recursive: true });
    writeFileSync(
      path.join(inboxTresNiveles, 'declaraciones.yaml'),
      stringifyYaml([
        {
          _investigacion: { script: 'generar-suplentes.ts' },
          politico: 'testpol',
          tema: 'economia/impuestos',
          fecha: '2020-07-06',
          contexto: 'gobierno',
          cargo_en_ese_momento: 'Presidente de la República',
          cita: 'Cita nueva de más de veinte caracteres para pasar la validación del esquema.',
          resumen: 'Registro nuevo sin corrección, para probar la derivación de tres niveles.',
          evidencia: {
            nivel: 'textual',
            fuentes: [
              {
                url: 'https://ejemplo.uy/tres-niveles',
                medio: 'el-pais',
                fecha: '2020-07-06',
                tipo: 'documento_oficial',
                titulo: 'Documento de prueba',
                cita: 'Cita nueva de más de veinte caracteres para pasar la validación del esquema.',
                retrieved_at: '2020-07-06',
              },
            ],
          },
          revision: { tier: 'publicado' },
        },
      ]),
      'utf8',
    );
    mkdirSync(path.join(raiz, 'data', 'corridas', '2020-07-06-testpol-economia'), { recursive: true });
    writeFileSync(path.join(raiz, 'data', 'corridas', '2020-07-06-testpol-economia', 'brief.md'), '# brief\n', 'utf8');
    const r2 = promover(inboxTresNiveles, { rootDir: raiz });
    expect(r2.corrida).toBe('2020-07-06-testpol-economia');
    expect(r2.errores).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// `--solo-crudo` en modo corrección (defecto real del 2026-09-16: la corrección de la fecha de
// Batlle promovió con edicion.diff en 0 líneas aunque el editor cambió 430; el crudo se había
// congelado recién al promover, cuando el inbox ya tenía la versión editada). A diferencia de una
// corrida normal, en `/correccion` el editor es el único que escribe `correcciones.yaml` y el
// resto del lote — no hay un investigador previo — así que "antes de que edite el editor" es antes
// de que exista `correcciones.yaml`, cuando en el inbox solo está `pedido.md`.
// ---------------------------------------------------------------------------
describe('promover --solo-crudo en modo corrección', () => {
  it('congela crudo/ antes de que exista correcciones.yaml en el inbox, y no promueve nada', () => {
    const corridaId = '2020-08-01-testpol-correccion-prueba';
    const { raiz, inboxDir } = prepararRaiz(corridaId);

    // Lo único que hay en el inbox en este punto del flujo (después de la crítica, antes del
    // editor): el pedido literal que motivó la corrección.
    writeFileSync(path.join(inboxDir, 'pedido.md'), 'La última entrevista fue el 21 de setiembre, no el 24 de octubre.\n', 'utf8');

    // Antes de este cambio, esto tiraba error: la resolución de --correccion corría primero y
    // exigía correcciones.yaml (que todavía no existe) o content/correcciones/<id>.yaml.
    const r = promover(inboxDir, { rootDir: raiz, corrida: corridaId, correccion: true, soloCrudo: true });

    expect(r.soloCrudo).toBe(true);
    expect(r.promovidos).toEqual([]);
    expect(r.errores).toEqual([]);
    expect(existsSync(path.join(raiz, 'data', 'corridas', corridaId, 'crudo', 'pedido.md'))).toBe(true);
    // La corrección no se resolvió ni se escribió: soloCrudo devuelve antes de llegar ahí.
    expect(existsSync(path.join(raiz, 'content', 'correcciones'))).toBe(false);
    // El registro afectado tampoco cambió.
    expect(readFileSync(path.join(raiz, ...ARCHIVO_AFECTADO), 'utf8')).toBe('politico: testpol\n# versión vieja, se sobreescribe\n');
  });

  it('sin crudo previo, promover --correccion igual promueve pero avisa que el crudo se congeló recién', () => {
    const corridaId = '2020-08-02-testpol-correccion-prueba';
    const { raiz, inboxDir } = prepararRaiz(corridaId);

    writeFileSync(
      path.join(inboxDir, 'correcciones.yaml'),
      stringifyYaml([
        {
          _slug: 'aviso-crudo-tardio',
          fecha: '2020-08-02',
          tipo: 'error_factual',
          desenlace: 'aceptada',
          afecta: ['declaraciones/testpol/2020-01-01-original'],
          motivo: 'Motivo de prueba para el aviso de crudo tardío.',
        },
      ]),
      'utf8',
    );
    writeFileSync(path.join(inboxDir, 'declaraciones.yaml'), stringifyYaml([declaracionCorregida()]), 'utf8');

    const avisoSpy = vi.spyOn(log, 'aviso').mockImplementation(() => {});
    try {
      const r = promover(inboxDir, { rootDir: raiz, corrida: corridaId, correccion: true });
      expect(r.errores).toEqual([]);
      expect(r.promovidos).toHaveLength(1);
      // edicion.diff sale vacío: el crudo recién congelado ya es la versión editada.
      expect(r.diff.trim()).toBe('');
      const mensajes = avisoSpy.mock.calls.map((c) => String(c[0]));
      expect(mensajes.some((m) => /crudo congelado recién al promover/.test(m))).toBe(true);
    } finally {
      avisoSpy.mockRestore();
    }
  });

  it('con crudo congelado antes vía --solo-crudo, edicion.diff refleja lo que escribió el editor (no vacío)', () => {
    const corridaId = '2020-08-03-testpol-correccion-prueba';
    const { raiz, inboxDir } = prepararRaiz(corridaId);

    // 1. Antes del editor: solo pedido.md, y se congela con --solo-crudo.
    writeFileSync(path.join(inboxDir, 'pedido.md'), 'Pedido de prueba.\n', 'utf8');
    const rCongelado = promover(inboxDir, { rootDir: raiz, corrida: corridaId, correccion: true, soloCrudo: true });
    expect(rCongelado.soloCrudo).toBe(true);

    // 2. El editor escribe la corrección y el registro corregido en el mismo directorio.
    writeFileSync(
      path.join(inboxDir, 'correcciones.yaml'),
      stringifyYaml([
        {
          _slug: 'con-crudo-previo',
          fecha: '2020-08-03',
          tipo: 'error_factual',
          desenlace: 'aceptada',
          afecta: ['declaraciones/testpol/2020-01-01-original'],
          motivo: 'Motivo de prueba con crudo ya congelado.',
        },
      ]),
      'utf8',
    );
    writeFileSync(path.join(inboxDir, 'declaraciones.yaml'), stringifyYaml([declaracionCorregida()]), 'utf8');
    writeFileSync(path.join(raiz, 'data', 'corridas', corridaId, 'razones.md'), 'Se reemplaza la cita por la versión correcta.\n', 'utf8');

    const avisoSpy = vi.spyOn(log, 'aviso').mockImplementation(() => {});
    try {
      const r = promover(inboxDir, { rootDir: raiz, corrida: corridaId, correccion: true });
      expect(r.errores).toEqual([]);
      expect(r.promovidos).toHaveLength(1);
      // El crudo congelado (solo pedido.md) no tenía declaraciones.yaml: el diff muestra el
      // registro completo que escribió el editor, no 0 líneas.
      expect(r.diff.trim()).not.toBe('');
      // Y no dispara ninguno de los dos avisos: el crudo ya estaba congelado de antes, y el diff
      // no salió vacío.
      const mensajes = avisoSpy.mock.calls.map((c) => String(c[0]));
      expect(mensajes.some((m) => /crudo congelado recién al promover/.test(m))).toBe(false);
      expect(mensajes.some((m) => /edicion\.diff vacío con razones\.md escrito/.test(m))).toBe(false);
    } finally {
      avisoSpy.mockRestore();
    }
  });
});
