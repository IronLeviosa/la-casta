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
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';
import { afterAll, describe, expect, it } from 'vitest';
import { promover } from '../scripts/promover.ts';

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
  it('sin _slug en correcciones.yaml: deriva el id de afecta[0], escribe la corrección y aplica el cambio', () => {
    const corridaId = '2020-07-01-testpol-correccion-prueba';
    const { raiz, inboxDir } = prepararRaiz(corridaId);

    // El registro de corrección no trae `_slug`: promover lo deriva del primer id de `afecta`
    // ("declaraciones/testpol/2020-01-01-original" → "testpol-2020-01-01-original").
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

    const idEsperado = '2020-07-01-testpol-2020-01-01-original';
    const r = promover(inboxDir, { rootDir: raiz, corrida: corridaId, correccion: idEsperado });

    expect(r.errores).toEqual([]);
    expect(r.correccionEscrita).toBe(idEsperado);
    expect(r.promovidos).toHaveLength(1);
    expect(r.promovidos[0]!.id).toBe('testpol/2020-01-01-original');

    // 1. La corrección aparece en content/correcciones/, con revision.tier: publicado forzado y
    //    sin procedencia (el esquema de correcciones no la lleva).
    const rutaCorreccion = path.join(raiz, 'content', 'correcciones', `${idEsperado}.yaml`);
    expect(existsSync(rutaCorreccion)).toBe(true);
    const correccionEscrita = parseYaml(readFileSync(rutaCorreccion, 'utf8'));
    expect(correccionEscrita.revision).toEqual({ tier: 'publicado' });
    expect(correccionEscrita.procedencia).toBeUndefined();
    expect(correccionEscrita._slug).toBeUndefined(); // se quita al escribir en content/, como cualquier campo `_`
    expect(correccionEscrita.afecta).toEqual(['declaraciones/testpol/2020-01-01-original']);

    // 2. El registro afectado cambió (la cita vieja ya no está) y lleva procedencia de corrección.
    const destino = path.join(raiz, ...r.promovidos[0]!.destino.split('/'));
    const declaracionEscrita = parseYaml(readFileSync(destino, 'utf8'));
    expect(declaracionEscrita.cita).toBe('Cita corregida de más de veinte caracteres para pasar la validación del esquema.');
    expect(declaracionEscrita.procedencia).toEqual({ tipo: 'correccion', correccion: idEsperado });
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
