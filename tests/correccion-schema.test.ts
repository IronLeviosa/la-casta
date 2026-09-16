/**
 * `reemplaza` en `src/schemas/correccion.ts` (docs/plan-correcciones-id.md): sigue aceptando el
 * string de siempre (fusión de dos fichas) y ahora también una lista de pares `{de, a}` para un
 * cambio de id mecánico. Se prueba contra `esquemasPorColeccion.correcciones` directo, como
 * `tests/lote.test.ts` ya hace para el resto del esquema de correcciones.
 */
import { describe, expect, it } from 'vitest';
import { esquemasPorColeccion } from '../src/schemas/comunes';

const BASE = {
  fecha: '2026-09-16',
  tipo: 'error_factual' as const,
  desenlace: 'aceptada' as const,
  motivo: 'La fecha de la entrevista estaba mal: es del 21 de setiembre, no del 24 de octubre.',
  revision: { tier: 'publicado' as const },
};

function parse(datos: Record<string, unknown>) {
  return esquemasPorColeccion.correcciones.safeParse({ ...BASE, ...datos });
}

describe('reemplaza: string (fusión) sigue válido', () => {
  it('acepta el id completo del registro nuevo', () => {
    const r = parse({ afecta: ['politicos/ana-test'], reemplaza: 'politicos/ana-test-2' });
    expect(r.success).toBe(true);
  });
});

describe('reemplaza: lista de pares {de, a}', () => {
  const de1 = 'declaraciones/batlle/2016-10-24-impuestos-empezaran-cobrarse-enero-2017';
  const a1 = 'declaraciones/batlle/2016-09-21-impuestos-empezaran-cobrarse-enero-2017';
  const de2 = 'chequeos/batlle/2016-10-24-rendicion-cuentas-2015-vigencia-enero-2017';
  const a2 = 'chequeos/batlle/2016-09-21-rendicion-cuentas-2015-vigencia-enero-2017';

  it('válida con dos pares, cada de en afecta y cada a en agrega', () => {
    const r = parse({
      afecta: [de1, de2],
      agrega: [a1, a2],
      reemplaza: [
        { de: de1, a: a1 },
        { de: de2, a: a2 },
      ],
    });
    expect(r.success).toBe(true);
  });

  it('inválida si un "de" no está en afecta', () => {
    const r = parse({
      afecta: [de2], // falta de1
      agrega: [a1, a2],
      reemplaza: [
        { de: de1, a: a1 },
        { de: de2, a: a2 },
      ],
    });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues.some((i) => i.message.includes(`"${de1}" tiene que estar en 'afecta'`))).toBe(true);
  });

  it('inválida si un "a" no está en agrega', () => {
    const r = parse({
      afecta: [de1, de2],
      agrega: [a1], // falta a2
      reemplaza: [
        { de: de1, a: a1 },
        { de: de2, a: a2 },
      ],
    });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues.some((i) => i.message.includes(`"${a2}" tiene que estar en 'agrega'`))).toBe(true);
  });

  it('inválida con un "a" repetido entre pares', () => {
    const r = parse({
      afecta: [de1, de2],
      agrega: [a1],
      reemplaza: [
        { de: de1, a: a1 },
        { de: de2, a: a1 }, // repetido
      ],
    });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues.some((i) => i.message.includes("'a' repetidos"))).toBe(true);
  });

  it('inválida con un "de" repetido entre pares', () => {
    const r = parse({
      afecta: [de1],
      agrega: [a1, a2],
      reemplaza: [
        { de: de1, a: a1 },
        { de: de1, a: a2 }, // repetido
      ],
    });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues.some((i) => i.message.includes("'de' repetidos"))).toBe(true);
  });

  it('inválida si de y a son de distinta colección', () => {
    const r = parse({
      afecta: [de1],
      agrega: ['chequeos/batlle/2016-09-21-rendicion-cuentas-2015-vigencia-enero-2017'],
      reemplaza: [{ de: de1, a: 'chequeos/batlle/2016-09-21-rendicion-cuentas-2015-vigencia-enero-2017' }],
    });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues.some((i) => i.message.includes('tienen que ser de la misma colección'))).toBe(true);
  });

  it('inválida: lista vacía de pares', () => {
    const r = parse({ afecta: [de1], agrega: [a1], reemplaza: [] });
    expect(r.success).toBe(false);
  });

  it('una corrección rechazada no puede traer reemplaza (ni string ni pares)', () => {
    const r = parse({
      desenlace: 'rechazada',
      motivo_rechazo: 'evidencia_insuficiente',
      que_cambiaria_la_decision: 'Una fuente que confirme la fecha correcta.',
      afecta: [de1],
      reemplaza: [{ de: de1, a: a1 }],
    });
    expect(r.success).toBe(false);
  });
});
