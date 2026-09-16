/**
 * `fecha_precision` en el validador de referencias (docs/plan-fechas.md):
 *
 * - D1: la convención mecánica de cada precisión (`mes` → día 1 del mes, `anio` → 1 de enero,
 *   `antes_de` → cota documentada) es un error si no se cumple.
 * - D2: nada dicho después de la muerte, y un chequeo lleva la misma fecha y precisión que su
 *   declaración.
 * - D3: los giros comparan intervalos, no días; una precisión más gruesa no ordena contra un día
 *   suelto sin que se documente cómo, y una `antes_de` nunca puede ser el «después».
 *
 * Como en tests/duplicados.test.ts, se prueba `validarReferencias()` directo sobre un `Contenido`
 * armado a mano, sin tocar el disco ni el esquema completo.
 */
import { describe, expect, it } from 'vitest';
import { construirContenido, type Registro } from '../scripts/lib/contenido.ts';
import { validarReferencias } from '../scripts/validadores/referencias.ts';

function reg(coleccion: Registro['coleccion'], id: string, datos: Record<string, any>): Registro {
  return { coleccion, id, archivo: `content/${coleccion}/${id}.yaml`, datos, crudo: datos, enInbox: false };
}

/** Un solo medio, reutilizado en toda fuente de este archivo: sin esto, cada declaración dispara
 *  "Medio desconocido" (etapa 2 del validador) y contamina las aserciones de "sin errores". */
const MEDIO = reg('medios', 'm', {});
const FUENTE = { url: 'https://a', medio: 'm', fecha: '2016-10-25', tipo: 'nota', cita: 'cita de veinte caracteres o mas' };

function politico(id: string, opciones: { fallecido?: string } = {}): Registro {
  const datos: Record<string, any> = { nombre_corto: id, estado_actual: { situacion: opciones.fallecido ? 'fallecido' : 'en_cargo' } };
  if (opciones.fallecido) datos.estado_actual.salida = { tipo: 'fallecimiento', fecha: opciones.fallecido };
  return reg('politicos', id, datos);
}

/** `politico` es siempre "batlle", así que el id sigue la convención `<politico>/<fecha>-<resto>`. */
function declaracion(resto: string, opciones: { fecha: string; fecha_precision?: string; fuentes?: any[] }): Registro {
  return reg('declaraciones', `batlle/${opciones.fecha}-${resto}`, {
    politico: 'batlle',
    fecha: opciones.fecha,
    fecha_precision: opciones.fecha_precision,
    evidencia: { nivel: 'reportado', fuentes: opciones.fuentes ?? [FUENTE] },
  });
}

function chequeo(resto: string, opciones: { declaracionId: string; fecha: string; fecha_precision?: string }): Registro {
  return reg('chequeos', `batlle/${opciones.fecha}-${resto}`, {
    politico: 'batlle',
    declaracion: opciones.declaracionId,
    fecha: opciones.fecha,
    fecha_precision: opciones.fecha_precision,
  });
}

function giro(antes: string, despues: string): Registro {
  return reg('giros', 'batlle/x', { politico: 'batlle', declaracion_antes: antes, declaracion_despues: despues, cambio: 'sin_cambio', explicacion: 'sin_explicacion' });
}

describe('D1: convención mecánica de fecha_precision', () => {
  it('mes exige que fecha sea el día 1 del mes', () => {
    const ok = construirContenido('/fake-root', [MEDIO, politico('batlle'), declaracion('x', { fecha: '2016-10-01', fecha_precision: 'mes' })], [], 3);
    expect(validarReferencias(ok).errores).toEqual([]);

    const malo = construirContenido('/fake-root', [MEDIO, politico('batlle'), declaracion('x', { fecha: '2016-10-05', fecha_precision: 'mes' })], [], 3);
    const r = validarReferencias(malo);
    expect(r.errores.some((e) => e.mensaje.includes('mes exige que fecha sea el día 1'))).toBe(true);
  });

  it('anio exige que fecha sea el 1 de enero', () => {
    const ok = construirContenido('/fake-root', [MEDIO, politico('batlle'), declaracion('x', { fecha: '2016-01-01', fecha_precision: 'anio' })], [], 3);
    expect(validarReferencias(ok).errores).toEqual([]);

    const malo = construirContenido('/fake-root', [MEDIO, politico('batlle'), declaracion('x', { fecha: '2016-03-01', fecha_precision: 'anio' })], [], 3);
    const r = validarReferencias(malo);
    expect(r.errores.some((e) => e.mensaje.includes('anio exige que fecha sea el 1 de enero'))).toBe(true);
  });

  it('antes_de exige que fecha sea la fecha de fallecimiento de la ficha, o la de alguna fuente de la evidencia', () => {
    const conMuerte = construirContenido(
      '/fake-root',
      [MEDIO, politico('batlle', { fallecido: '2016-10-24' }), declaracion('x', { fecha: '2016-10-24', fecha_precision: 'antes_de' })],
      [],
      3,
    );
    expect(validarReferencias(conMuerte).errores).toEqual([]);

    const conFuente = construirContenido(
      '/fake-root',
      [MEDIO, politico('batlle'), declaracion('x', { fecha: '2016-10-25', fecha_precision: 'antes_de', fuentes: [FUENTE] })],
      [],
      3,
    );
    expect(validarReferencias(conFuente).errores).toEqual([]);

    const sinCota = construirContenido(
      '/fake-root',
      [MEDIO, politico('batlle'), declaracion('x', { fecha: '2016-11-01', fecha_precision: 'antes_de', fuentes: [FUENTE] })],
      [],
      3,
    );
    const r = validarReferencias(sinCota);
    expect(r.errores.some((e) => e.mensaje.includes('antes_de exige que fecha sea una cota documentada'))).toBe(true);
  });

  it('dia (u omitida): no exige nada mecánico', () => {
    const c = construirContenido('/fake-root', [MEDIO, politico('batlle'), declaracion('x', { fecha: '2016-10-24' })], [], 3);
    expect(validarReferencias(c).errores).toEqual([]);
  });
});

describe('D2: nada dicho después de la muerte', () => {
  it('error con una ficha fallecida y fecha posterior a la salida', () => {
    const c = construirContenido('/fake-root', [MEDIO, politico('batlle', { fallecido: '2016-10-24' }), declaracion('x', { fecha: '2016-10-25' })], [], 3);
    const r = validarReferencias(c);
    expect(r.errores.some((e) => e.mensaje.includes('es posterior al fallecimiento de "batlle"'))).toBe(true);
  });

  it('nada con una ficha viva, aunque la fecha sea "futura"', () => {
    const c = construirContenido('/fake-root', [MEDIO, politico('batlle'), declaracion('x', { fecha: '2099-01-01' })], [], 3);
    expect(validarReferencias(c).errores).toEqual([]);
  });

  it('nada con una ficha fallecida y fecha anterior o igual a la salida', () => {
    const c = construirContenido('/fake-root', [MEDIO, politico('batlle', { fallecido: '2016-10-24' }), declaracion('x', { fecha: '2016-10-24' })], [], 3);
    expect(validarReferencias(c).errores).toEqual([]);
  });

  it('no alcanza a evidencia.fuentes[].fecha: una nota puede publicarse después de morir', () => {
    const fuenteTardia = { ...FUENTE, fecha: '2016-10-25' };
    const c = construirContenido(
      '/fake-root',
      [MEDIO, politico('batlle', { fallecido: '2016-10-24' }), declaracion('x', { fecha: '2016-10-24', fuentes: [fuenteTardia] })],
      [],
      3,
    );
    expect(validarReferencias(c).errores).toEqual([]);
  });
});

describe('D2: un chequeo lleva la misma fecha y precisión que su declaración', () => {
  it('error si la fecha difiere', () => {
    const dec = declaracion('x', { fecha: '2016-10-24' });
    const c = construirContenido('/fake-root', [MEDIO, politico('batlle'), dec, chequeo('y', { declaracionId: dec.id, fecha: '2016-10-25' })], [], 4);
    const r = validarReferencias(c);
    expect(r.errores.some((e) => e.mensaje.includes('La fecha del chequeo') && e.mensaje.includes('tiene que ser la misma'))).toBe(true);
  });

  it('error si la precisión difiere aunque la fecha coincida', () => {
    const dec = declaracion('x', { fecha: '2016-10-01', fecha_precision: 'mes' });
    const c = construirContenido('/fake-root', [MEDIO, politico('batlle'), dec, chequeo('y', { declaracionId: dec.id, fecha: '2016-10-01' })], [], 4);
    const r = validarReferencias(c);
    expect(r.errores.some((e) => e.mensaje.includes('La precisión de fecha del chequeo'))).toBe(true);
  });

  it('nada si fecha y precisión coinciden', () => {
    const dec = declaracion('x', { fecha: '2016-10-01', fecha_precision: 'mes' });
    const c = construirContenido('/fake-root', [MEDIO, politico('batlle'), dec, chequeo('y', { declaracionId: dec.id, fecha: '2016-10-01', fecha_precision: 'mes' })], [], 4);
    expect(validarReferencias(c).errores).toEqual([]);
  });
});

describe('D3: los giros comparan intervalos', () => {
  it('dia vs dia: como antes, antes.fecha < despues.fecha', () => {
    const a = declaracion('a', { fecha: '2020-01-01' });
    const b = declaracion('b', { fecha: '2020-06-01' });
    const c = construirContenido('/fake-root', [MEDIO, politico('batlle'), a, b, giro(a.id, b.id)], [], 5);
    expect(validarReferencias(c).errores).toEqual([]);
  });

  it('anio vs dia: "en 2006" no puede ser el antes de una de mayo de 2006 (no se sabe si es antes)', () => {
    const a = declaracion('a', { fecha: '2006-01-01', fecha_precision: 'anio' });
    const b = declaracion('b', { fecha: '2006-05-01' });
    const c = construirContenido('/fake-root', [MEDIO, politico('batlle'), a, b, giro(a.id, b.id)], [], 5);
    const r = validarReferencias(c);
    expect(r.errores.some((e) => e.mensaje.includes('Fechas invertidas') && e.mensaje.includes('orden no documentado'))).toBe(true);
  });

  it('mes vs dia posterior al fin del mes: sí ordena', () => {
    const a = declaracion('a', { fecha: '2006-01-01', fecha_precision: 'mes' }); // cubre todo enero de 2006
    const b = declaracion('b', { fecha: '2006-02-01' });
    const c = construirContenido('/fake-root', [MEDIO, politico('batlle'), a, b, giro(a.id, b.id)], [], 5);
    expect(validarReferencias(c).errores).toEqual([]);
  });

  it('antes_de nunca puede ser el "después"', () => {
    const a = declaracion('a', { fecha: '2016-01-01' });
    const b = declaracion('b', { fecha: '2016-10-24', fecha_precision: 'antes_de' });
    const c = construirContenido('/fake-root', [MEDIO, politico('batlle', { fallecido: '2016-10-24' }), a, b, giro(a.id, b.id)], [], 5);
    const r = validarReferencias(c);
    expect(r.errores.some((e) => e.mensaje.includes('Fechas invertidas'))).toBe(true);
  });

  it('antes_de sí puede ser el "antes", si su cota termina antes de que empiece la "después"', () => {
    // Cota documentada por una fuente (no por la muerte): con una ficha viva, nada le impide a la
    // "después" tener cualquier fecha posterior a esa cota.
    const a = declaracion('a', { fecha: FUENTE.fecha, fecha_precision: 'antes_de', fuentes: [FUENTE] });
    const b = declaracion('b', { fecha: '2020-01-01' });
    const c = construirContenido('/fake-root', [MEDIO, politico('batlle'), a, b, giro(a.id, b.id)], [], 5);
    expect(validarReferencias(c).errores).toEqual([]);
  });
});
