/**
 * Fechas con precisión parcial en los mandatos.
 *
 * El esquema acepta `1990`, `1990-03` y `1990-03-05` porque exigir día exacto no hacía el dato más
 * preciso: lo hacía desaparecer, y no parejo — se perdía lo más viejo y lo menos cubierto por la
 * prensa. Lo que estas pruebas cuidan es que aceptar la imprecisión no la propague: al comparar se
 * completan los extremos, y al mostrar se dice solo lo que la fuente dijo.
 */
import { describe, expect, it } from 'vitest';
import { completarFecha, intervaloDeFecha, precisionFecha } from '../src/schemas/base.ts';
import { datetimeConPrecision, fechaConPrecision, fechaParcialLarga } from '../src/lib/formato.ts';

describe('completarFecha()', () => {
  it('un año abarca desde su primer día hasta el último', () => {
    expect(completarFecha('1990', 'inicio')).toBe('1990-01-01');
    expect(completarFecha('1990', 'fin')).toBe('1990-12-31');
  });

  it('un mes abarca desde su primer día hasta el último, contando los de 28, 30 y 31', () => {
    expect(completarFecha('1990-03', 'inicio')).toBe('1990-03-01');
    expect(completarFecha('1990-03', 'fin')).toBe('1990-03-31');
    expect(completarFecha('1990-04', 'fin')).toBe('1990-04-30');
    expect(completarFecha('1990-02', 'fin')).toBe('1990-02-28');
    expect(completarFecha('2020-02', 'fin')).toBe('2020-02-29');
  });

  it('una fecha completa se devuelve igual', () => {
    expect(completarFecha('1990-03-05', 'inicio')).toBe('1990-03-05');
    expect(completarFecha('1990-03-05', 'fin')).toBe('1990-03-05');
  });

  it('ordena el año antes que un día de ese mismo año', () => {
    // Comparar los textos crudos deja "1990" después de "1990-03-05" en algunos órdenes; el punto
    // de completar es que un mandato que empieza "en 1990" no se dibuje después de uno de marzo.
    const a = completarFecha('1990', 'inicio');
    const b = completarFecha('1990-03-05', 'inicio');
    expect(a < b).toBe(true);
  });
});

describe('precisionFecha()', () => {
  it('distingue año, mes y día', () => {
    expect(precisionFecha('1990')).toBe('anio');
    expect(precisionFecha('1990-03')).toBe('mes');
    expect(precisionFecha('1990-03-05')).toBe('dia');
  });
});

describe('fechaParcialLarga()', () => {
  it('no inventa precisión que la fuente no tiene', () => {
    expect(fechaParcialLarga('1990')).toBe('1990');
    expect(fechaParcialLarga('1990-03')).toBe('marzo de 1990');
    expect(fechaParcialLarga('1990-03-05')).toBe('5 de marzo de 1990');
  });

  it('con vacío devuelve vacío', () => {
    expect(fechaParcialLarga(null)).toBe('');
    expect(fechaParcialLarga(undefined)).toBe('');
  });
});

/**
 * `fecha_precision` (docs/plan-fechas.md, D1 y D3): a diferencia de `FechaParcial`, acá `fecha`
 * siempre es un día ISO completo; lo que cambia es cuánto de ese día está documentado, y por eso el
 * intervalo real que cubre difiere del que da `completarFecha` sobre un string parcial.
 */
describe('intervaloDeFecha() (D3)', () => {
  it('dia (u omitida): el intervalo es un solo día', () => {
    expect(intervaloDeFecha('2016-10-24', 'dia')).toEqual({ inicio: '2016-10-24', fin: '2016-10-24' });
    expect(intervaloDeFecha('2016-10-24', undefined)).toEqual({ inicio: '2016-10-24', fin: '2016-10-24' });
  });

  it('mes: desde el día guardado (el 1) hasta el último día de ese mes', () => {
    expect(intervaloDeFecha('2006-05-01', 'mes')).toEqual({ inicio: '2006-05-01', fin: '2006-05-31' });
    expect(intervaloDeFecha('2020-02-01', 'mes')).toEqual({ inicio: '2020-02-01', fin: '2020-02-29' }); // bisiesto
  });

  it('anio: desde el 1 de enero guardado hasta el 31 de diciembre', () => {
    expect(intervaloDeFecha('2006-01-01', 'anio')).toEqual({ inicio: '2006-01-01', fin: '2006-12-31' });
  });

  it('antes_de: arranca en el principio de los tiempos y termina en la cota', () => {
    expect(intervaloDeFecha('2016-10-24', 'antes_de')).toEqual({ inicio: '0000-01-01', fin: '2016-10-24' });
  });
});

describe('fechaConPrecision() (D1, D5)', () => {
  it('dia (u omitida): igual que fechaLarga', () => {
    expect(fechaConPrecision('2016-10-24', 'dia')).toBe('24 de octubre de 2016');
    expect(fechaConPrecision('2016-10-24', undefined)).toBe('24 de octubre de 2016');
  });

  it('mes: "en <mes> de <año>"', () => {
    expect(fechaConPrecision('2016-10-01', 'mes')).toBe('en octubre de 2016');
  });

  it('anio: "en <año>"', () => {
    expect(fechaConPrecision('2006-01-01', 'anio')).toBe('en 2006');
  });

  it('antes_de: "antes del <fecha completa>"', () => {
    expect(fechaConPrecision('2016-10-24', 'antes_de')).toBe('antes del 24 de octubre de 2016');
  });

  it('con vacío devuelve vacío', () => {
    expect(fechaConPrecision(null, 'dia')).toBe('');
    expect(fechaConPrecision(undefined, 'anio')).toBe('');
  });
});

describe('datetimeConPrecision() (D5): recorte para <time datetime> y datePublished', () => {
  it('dia (u omitida) y antes_de: el día ISO completo', () => {
    expect(datetimeConPrecision('2016-10-24', 'dia')).toBe('2016-10-24');
    expect(datetimeConPrecision('2016-10-24', undefined)).toBe('2016-10-24');
    expect(datetimeConPrecision('2016-10-24', 'antes_de')).toBe('2016-10-24');
  });

  it('mes: recorta a AAAA-MM', () => {
    expect(datetimeConPrecision('2016-10-01', 'mes')).toBe('2016-10');
  });

  it('anio: recorta a AAAA', () => {
    expect(datetimeConPrecision('2006-01-01', 'anio')).toBe('2006');
  });
});
