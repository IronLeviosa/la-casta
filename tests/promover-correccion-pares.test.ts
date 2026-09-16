/**
 * `pnpm promover <dir> --correccion <id>` con `reemplaza` en pares (docs/plan-correcciones-id.md):
 * el caso real que dispara el plan es la entrevista de Batlle con El Observador, fechada
 * 2016-10-24 en el id cuando la fuente dice 21 de setiembre de 2016 — diez declaraciones y cuatro
 * chequeos que cuelgan de ellas.
 *
 * Este test reduce el caso a una declaración + un chequeo que la referencia (con `declaracion` a
 * propósito dejada en el id VIEJO, como la dejaría el editor) + un giro ya publicado que también la
 * referencia (por fuera del lote, para probar la reescritura en TODO `content/`, no solo dentro del
 * lote). Mismo patrón de raíz temporal que tests/promover-correccion.test.ts.
 */
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';
import { afterAll, describe, expect, it } from 'vitest';
import { promover } from '../scripts/promover.ts';
import { cargarContenido } from '../scripts/lib/contenido.ts';
import { validarReferencias } from '../scripts/validadores/referencias.ts';

const temporales: string[] = [];
afterAll(() => {
  for (const d of temporales.splice(0)) rmSync(d, { recursive: true, force: true });
});

const DE_DECLARACION = 'batlle/2016-10-24-impuestos-empezaran-cobrarse-enero-2017';
const A_DECLARACION = 'batlle/2016-09-21-impuestos-empezaran-cobrarse-enero-2017';
const DE_CHEQUEO = 'batlle/2016-10-24-rendicion-cuentas-2015-vigencia-enero-2017';
const A_CHEQUEO = 'batlle/2016-09-21-rendicion-cuentas-2015-vigencia-enero-2017';

function prepararRaiz(corridaId: string): { raiz: string; inboxDir: string } {
  const raiz = mkdtempSync(path.join(tmpdir(), 'la-casta-promover-pares-'));
  temporales.push(raiz);

  mkdirSync(path.join(raiz, 'data', 'corridas', corridaId), { recursive: true });
  writeFileSync(path.join(raiz, 'data', 'corridas', corridaId, 'brief.md'), '# brief de prueba\n', 'utf8');
  // El chequeo del lote queda a propósito con `declaracion` en el id VIEJO (ver chequeoNuevo()):
  // promover lo reescribe solo al id nuevo antes de validar, y ese reemplazo aparece en
  // edicion.diff (crudo/ conserva el id viejo tal como lo dejó el editor). Con diff no vacío,
  // promover exige razones.md.
  writeFileSync(
    path.join(raiz, 'data', 'corridas', corridaId, 'razones.md'),
    '## Cambios de fondo\n\n- chequeos[0]: `declaracion` reescrito del id viejo al nuevo por el cambio de id de la corrección.\n',
    'utf8',
  );

  mkdirSync(path.join(raiz, 'scripts'), { recursive: true });
  writeFileSync(path.join(raiz, 'scripts', 'generar-suplentes.ts'), '// script de fixture\n', 'utf8');

  // El "de" de declaraciones y de chequeos: existe (existsSync es lo único que promover comprueba
  // antes de borrarlo) pero su contenido no importa, igual que ARCHIVO_AFECTADO en
  // tests/promover-correccion.test.ts: se borra sin leerlo.
  mkdirSync(path.join(raiz, 'content', 'declaraciones', 'batlle'), { recursive: true });
  writeFileSync(path.join(raiz, 'content', 'declaraciones', `${DE_DECLARACION}.yaml`), 'politico: batlle\n# versión vieja, fecha mal\n', 'utf8');
  mkdirSync(path.join(raiz, 'content', 'chequeos', 'batlle'), { recursive: true });
  writeFileSync(path.join(raiz, 'content', 'chequeos', `${DE_CHEQUEO}.yaml`), 'politico: batlle\n# versión vieja, fecha mal\n', 'utf8');

  // Un giro YA PUBLICADO (no forma parte del lote, no está en afecta/agrega) que referencia el "de"
  // de la declaración por declaracion_antes: tiene que ser un YAML válido de verdad, porque
  // `reescribirReferenciasEnContenido` lo carga con `cargarContenido` (valida por esquema) para
  // encontrar la referencia y reescribirla.
  mkdirSync(path.join(raiz, 'content', 'giros', 'batlle'), { recursive: true });
  writeFileSync(
    path.join(raiz, 'content', 'giros', 'batlle', 'impuestos-2016.yaml'),
    stringifyYaml({
      politico: 'batlle',
      tema: 'economia',
      declaracion_antes: DE_DECLARACION,
      declaracion_despues: 'batlle/2018-01-01-impuestos-no-suben',
      cambio: 'sin_cambio',
      explicacion: 'sin_explicacion',
      analisis: 'Comparación de ambas citas sobre impuestos, sin adjetivos, de más de veinte caracteres.',
      revision: { tier: 'publicado' },
      procedencia: { tipo: 'correccion', correccion: '2020-01-01-otra-correccion-anterior' },
    }),
    'utf8',
  );

  const inboxDir = path.join(raiz, 'inbox-src');
  mkdirSync(inboxDir, { recursive: true });
  return { raiz, inboxDir };
}

function declaracionNueva(): Record<string, unknown> {
  return {
    _slug: 'impuestos-empezaran-cobrarse-enero-2017',
    _investigacion: { script: 'generar-suplentes.ts' },
    politico: 'batlle',
    tema: 'economia',
    fecha: '2016-09-21',
    contexto: 'gobierno',
    cargo_en_ese_momento: 'Presidente de la República',
    cita: 'Los impuestos de la rendición de cuentas van a empezar a cobrarse en enero de 2017.',
    resumen: 'Batlle dijo, en la entrevista con El Observador del 21 de setiembre de 2016, que los impuestos de la rendición de cuentas empezarían a cobrarse en enero de 2017.',
    evidencia: {
      nivel: 'textual',
      fuentes: [
        {
          url: 'https://elobservador.com.uy/entrevista-batlle-2016-09-21',
          medio: 'el-observador',
          fecha: '2016-09-21',
          tipo: 'documento_oficial',
          titulo: 'Entrevista a Batlle',
          cita: 'Los impuestos de la rendición de cuentas van a empezar a cobrarse en enero de 2017.',
          retrieved_at: '2026-09-16',
        },
      ],
    },
    revision: { tier: 'publicado' },
  };
}

/** `declaracion` queda a propósito con el id VIEJO: así se prueba que promover la reescribe sola. */
function chequeoNuevo(): Record<string, unknown> {
  return {
    _slug: 'rendicion-cuentas-2015-vigencia-enero-2017',
    _investigacion: { script: 'generar-suplentes.ts' },
    politico: 'batlle',
    declaracion: DE_DECLARACION,
    tema: 'economia',
    fecha: '2016-09-21',
    afirmacion: 'Los impuestos de la rendición de cuentas 2015 entran en vigencia en enero de 2017.',
    calificacion: 'discutible',
    dato_real: {
      valor: 'Entraron en vigencia en enero de 2017, según la ley de rendición de cuentas.',
      fuentes: [
        {
          url: 'https://parlamento.gub.uy/rendicion-cuentas-2015',
          medio: 'parlamento',
          fecha: '2016-10-01',
          tipo: 'nota',
          titulo: 'Ley de rendición de cuentas 2015',
          cita: 'La ley entra en vigencia a partir de enero de 2017, según lo aprobado.',
          retrieved_at: '2026-09-16',
        },
      ],
    },
    analisis: 'La fecha de vigencia coincide con lo declarado; se mantiene discutible por depender de una nota, no de la versión oficial.',
    evidencia: {
      nivel: 'reportado',
      fuentes: [
        {
          url: 'https://elobservador.com.uy/entrevista-batlle-2016-09-21',
          medio: 'el-observador',
          fecha: '2016-09-21',
          tipo: 'documento_oficial',
          titulo: 'Entrevista a Batlle',
          cita: 'Los impuestos de la rendición de cuentas van a empezar a cobrarse en enero de 2017.',
          retrieved_at: '2026-09-16',
        },
      ],
    },
    revision: { tier: 'publicado' },
  };
}

function correccionDePares(): Record<string, unknown> {
  return {
    _slug: 'fecha-entrevista-batlle-el-observador',
    fecha: '2026-09-16',
    tipo: 'error_factual',
    desenlace: 'aceptada',
    afecta: [`declaraciones/${DE_DECLARACION}`, `chequeos/${DE_CHEQUEO}`],
    agrega: [`declaraciones/${A_DECLARACION}`, `chequeos/${A_CHEQUEO}`],
    reemplaza: [
      { de: `declaraciones/${DE_DECLARACION}`, a: `declaraciones/${A_DECLARACION}` },
      { de: `chequeos/${DE_CHEQUEO}`, a: `chequeos/${A_CHEQUEO}` },
    ],
    motivo: 'La entrevista con El Observador es del 21 de setiembre de 2016, no del 24 de octubre: se corrige la fecha de la declaración y del chequeo que cuelga de ella.',
  };
}

describe('promover --correccion con reemplaza en pares: declaración + chequeo + giro', () => {
  it('borra los "de", escribe los "a" con procedencia de corrección, y reescribe las referencias en todo content/', () => {
    const corridaId = '2026-09-16-batlle-correccion-prueba';
    const { raiz, inboxDir } = prepararRaiz(corridaId);

    writeFileSync(path.join(inboxDir, 'correcciones.yaml'), stringifyYaml([correccionDePares()]), 'utf8');
    writeFileSync(path.join(inboxDir, 'declaraciones.yaml'), stringifyYaml([declaracionNueva()]), 'utf8');
    writeFileSync(path.join(inboxDir, 'chequeos.yaml'), stringifyYaml([chequeoNuevo()]), 'utf8');

    const idCorreccion = '2026-09-16-fecha-entrevista-batlle-el-observador';
    const r = promover(inboxDir, { rootDir: raiz, corrida: corridaId, correccion: idCorreccion });

    expect(r.errores).toEqual([]);
    expect(r.promovidos).toHaveLength(2);
    expect(r.paresReemplazo).toHaveLength(2);

    // 1. Los "de" ya no existen.
    expect(existsSync(path.join(raiz, 'content', 'declaraciones', `${DE_DECLARACION}.yaml`))).toBe(false);
    expect(existsSync(path.join(raiz, 'content', 'chequeos', `${DE_CHEQUEO}.yaml`))).toBe(false);

    // 2. Los "a" existen, con procedencia de corrección.
    const declaracionEscrita = parseYaml(readFileSync(path.join(raiz, 'content', 'declaraciones', `${A_DECLARACION}.yaml`), 'utf8'));
    expect(declaracionEscrita.procedencia).toEqual({ tipo: 'correccion', correccion: idCorreccion });
    expect(declaracionEscrita.fecha).toBe('2016-09-21');

    const chequeoEscrito = parseYaml(readFileSync(path.join(raiz, 'content', 'chequeos', `${A_CHEQUEO}.yaml`), 'utf8'));
    expect(chequeoEscrito.procedencia).toEqual({ tipo: 'correccion', correccion: idCorreccion });
    // 3. El chequeo nuevo apunta a la declaración nueva (el editor lo había dejado con el id viejo).
    expect(chequeoEscrito.declaracion).toBe(A_DECLARACION);

    // 4. El giro, publicado antes y fuera del lote, quedó reescrito solo.
    const giroEscrito = parseYaml(readFileSync(path.join(raiz, 'content', 'giros', 'batlle', 'impuestos-2016.yaml'), 'utf8'));
    expect(giroEscrito.declaracion_antes).toBe(A_DECLARACION);
    expect(giroEscrito.declaracion_despues).toBe('batlle/2018-01-01-impuestos-no-suben'); // no tocado

    expect(r.referenciasReescritas?.some((x) => x.archivo.includes('impuestos-2016.yaml'))).toBe(true);

    // 5. content/correcciones/<id>.yaml existe.
    expect(existsSync(path.join(raiz, 'content', 'correcciones', `${idCorreccion}.yaml`))).toBe(true);

    // 6. Ninguna referencia rota disfrazada: ningún registro de content/ sigue citando los "de".
    const contenido = cargarContenido(raiz);
    expect(contenido.errores).toEqual([]);
    const r2 = validarReferencias(contenido);
    expect(r2.errores.some((e) => e.mensaje.includes(DE_DECLARACION) || e.mensaje.includes(DE_CHEQUEO))).toBe(false);
    // Los "de" no están más: ninguno de los dos debe seguir "existiendo" en content/.
    expect(existsSync(path.join(raiz, 'content', 'declaraciones', `${DE_DECLARACION}.yaml`))).toBe(false);
  });

  it('--simulacion no borra ni reescribe nada, pero informa qué haría', () => {
    const corridaId = '2026-09-16-batlle-correccion-simulacion';
    const { raiz, inboxDir } = prepararRaiz(corridaId);

    writeFileSync(path.join(inboxDir, 'correcciones.yaml'), stringifyYaml([correccionDePares()]), 'utf8');
    writeFileSync(path.join(inboxDir, 'declaraciones.yaml'), stringifyYaml([declaracionNueva()]), 'utf8');
    writeFileSync(path.join(inboxDir, 'chequeos.yaml'), stringifyYaml([chequeoNuevo()]), 'utf8');

    const idCorreccion = '2026-09-16-fecha-entrevista-batlle-el-observador';
    const r = promover(inboxDir, { rootDir: raiz, corrida: corridaId, correccion: idCorreccion, simulacion: true });

    expect(r.simulado).toBe(true);
    expect(r.errores).toEqual([]);
    expect(r.paresReemplazo).toHaveLength(2);
    // Nada se escribió ni se borró: los "de" siguen, los "a" no existen, la corrección no se escribió.
    expect(existsSync(path.join(raiz, 'content', 'declaraciones', `${DE_DECLARACION}.yaml`))).toBe(true);
    expect(existsSync(path.join(raiz, 'content', 'chequeos', `${DE_CHEQUEO}.yaml`))).toBe(true);
    expect(existsSync(path.join(raiz, 'content', 'declaraciones', `${A_DECLARACION}.yaml`))).toBe(false);
    expect(existsSync(path.join(raiz, 'content', 'correcciones', `${idCorreccion}.yaml`))).toBe(false);
    // El giro sigue con el id viejo (nada se reescribió de verdad), pero el cálculo dice que se
    // reescribiría si se corriera sin --simulacion.
    const giroSinTocar = parseYaml(readFileSync(path.join(raiz, 'content', 'giros', 'batlle', 'impuestos-2016.yaml'), 'utf8'));
    expect(giroSinTocar.declaracion_antes).toBe(DE_DECLARACION);
    expect(r.referenciasReescritas?.some((x) => x.archivo.includes('impuestos-2016.yaml'))).toBe(true);
  });

  it('verificación previa: falla si el "de" no existe en content/, sin escribir nada', () => {
    const corridaId = '2026-09-16-batlle-correccion-de-inexistente';
    const raiz = mkdtempSync(path.join(tmpdir(), 'la-casta-promover-pares-'));
    temporales.push(raiz);
    mkdirSync(path.join(raiz, 'data', 'corridas', corridaId), { recursive: true });
    writeFileSync(path.join(raiz, 'data', 'corridas', corridaId, 'brief.md'), '# brief\n', 'utf8');
    mkdirSync(path.join(raiz, 'scripts'), { recursive: true });
    writeFileSync(path.join(raiz, 'scripts', 'generar-suplentes.ts'), '// fixture\n', 'utf8');
    // A propósito: no se crea content/declaraciones/<DE_DECLARACION>.yaml.
    mkdirSync(path.join(raiz, 'content', 'chequeos', 'batlle'), { recursive: true });
    writeFileSync(path.join(raiz, 'content', 'chequeos', `${DE_CHEQUEO}.yaml`), 'politico: batlle\n', 'utf8');

    const inboxDir = path.join(raiz, 'inbox-src');
    mkdirSync(inboxDir, { recursive: true });
    writeFileSync(path.join(inboxDir, 'correcciones.yaml'), stringifyYaml([correccionDePares()]), 'utf8');
    writeFileSync(path.join(inboxDir, 'declaraciones.yaml'), stringifyYaml([declaracionNueva()]), 'utf8');
    writeFileSync(path.join(inboxDir, 'chequeos.yaml'), stringifyYaml([chequeoNuevo()]), 'utf8');

    expect(() =>
      promover(inboxDir, { rootDir: raiz, corrida: corridaId, correccion: '2026-09-16-fecha-entrevista-batlle-el-observador' }),
    ).toThrow(/no existe en content\//);
    expect(existsSync(path.join(raiz, 'content', 'chequeos', `${DE_CHEQUEO}.yaml`))).toBe(true); // no se tocó nada
  });
});
