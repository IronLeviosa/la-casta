/**
 * Paso 4 del validador de referencias (`scripts/validadores/referencias.ts`) para el cambio de id
 * en pares (`reemplaza: {de, a}[]`, docs/plan-correcciones-id.md):
 *
 * - Cada `a` tiene que existir; cada `de` NO (si sigue existiendo, la corrección dice que lo
 *   reemplazó y no es cierto).
 * - `afecta[]` está exento de "apunta a un registro existente" para los ids que son `de` de algún
 *   par de esta misma corrección: son justamente los que se retiraron a propósito.
 * - Un registro de otra colección que todavía referencia un `de` ya retirado cae en la regla
 *   general de referencias rotas (paso 1): el id simplemente no existe más.
 *
 * Mismo patrón que tests/fechas-precision.test.ts: `validarReferencias()` sobre un `Contenido`
 * armado a mano, sin tocar el disco.
 */
import { describe, expect, it } from 'vitest';
import { construirContenido, type Registro } from '../scripts/lib/contenido.ts';
import { validarReferencias } from '../scripts/validadores/referencias.ts';

function reg(coleccion: Registro['coleccion'], id: string, datos: Record<string, any>): Registro {
  return { coleccion, id, archivo: `content/${coleccion}/${id}.yaml`, datos, crudo: datos, enInbox: false };
}

const MEDIO = reg('medios', 'm', {});
const FUENTE = { url: 'https://a', medio: 'm', fecha: '2016-09-21', tipo: 'nota', cita: 'cita de veinte caracteres o mas' };

function politico(id: string): Registro {
  return reg('politicos', id, { nombre_corto: id, estado_actual: { situacion: 'en_cargo' } });
}

function declaracion(id: string, fecha: string): Registro {
  return reg('declaraciones', id, { politico: 'batlle', fecha, evidencia: { nivel: 'reportado', fuentes: [FUENTE] } });
}

function chequeo(id: string, declaracionId: string, fecha: string): Registro {
  return reg('chequeos', id, { politico: 'batlle', declaracion: declaracionId, fecha });
}

const DE = 'batlle/2016-10-24-impuestos-empezaran-cobrarse-enero-2017';
const A = 'batlle/2016-09-21-impuestos-empezaran-cobrarse-enero-2017';

function correccionDePares(overrides: Record<string, any> = {}): Registro {
  return reg('correcciones', '2026-09-16-fecha-batlle-entrevista', {
    fecha: '2026-09-16',
    tipo: 'error_factual',
    desenlace: 'aceptada',
    motivo: 'La fecha de la entrevista estaba mal.',
    afecta: [`declaraciones/${DE}`],
    agrega: [`declaraciones/${A}`],
    reemplaza: [{ de: `declaraciones/${DE}`, a: `declaraciones/${A}` }],
    revision: { tier: 'publicado' },
    ...overrides,
  });
}

describe('reemplaza en pares: el "de" retirado no cuenta como referencia rota en afecta[]', () => {
  it('sin errores cuando el "de" ya no existe y el "a" sí', () => {
    const c = construirContenido('/fake-root', [MEDIO, politico('batlle'), declaracion(A, '2016-09-21'), correccionDePares()], [], 3);
    const r = validarReferencias(c);
    expect(r.errores).toEqual([]);
  });

  it('error si el "de" sigue existiendo: la corrección dice que lo reemplazó y sigue publicado', () => {
    const c = construirContenido(
      '/fake-root',
      [MEDIO, politico('batlle'), declaracion(DE, '2016-10-24'), declaracion(A, '2016-09-21'), correccionDePares()],
      [],
      4,
    );
    const r = validarReferencias(c);
    expect(r.errores.some((e) => e.mensaje.includes('sigue existiendo en content/') && e.mensaje.includes('sigue publicado'))).toBe(true);
  });

  it('error si el "a" no existe (promover todavía no lo escribió, o el id está mal)', () => {
    const c = construirContenido('/fake-root', [MEDIO, politico('batlle'), correccionDePares()], [], 2);
    const r = validarReferencias(c);
    expect(r.errores.some((e) => e.mensaje.includes(`Referencia rota: no existe "declaraciones/${A}"`))).toBe(true);
  });
});

describe('reemplaza en pares: referencias de otros registros a un "de" ya retirado', () => {
  it('un chequeo que todavía apunta al "de" cae en la regla general de referencia rota', () => {
    const c = construirContenido(
      '/fake-root',
      [MEDIO, politico('batlle'), declaracion(A, '2016-09-21'), chequeo('batlle/2016-10-24-rendicion', DE, '2016-10-24'), correccionDePares()],
      [],
      5,
    );
    const r = validarReferencias(c);
    expect(r.errores.some((e) => e.campo === 'declaracion' && e.mensaje.includes(`no existe "${DE}"`))).toBe(true);
  });

  it('un chequeo que ya apunta al "a" (referencia reescrita): sin errores', () => {
    const c = construirContenido(
      '/fake-root',
      [MEDIO, politico('batlle'), declaracion(A, '2016-09-21'), chequeo('batlle/2016-09-21-rendicion', A, '2016-09-21'), correccionDePares()],
      [],
      5,
    );
    const r = validarReferencias(c);
    expect(r.errores).toEqual([]);
  });
});
