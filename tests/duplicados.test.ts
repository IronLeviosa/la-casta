/**
 * Etapa `duplicados` del validador (plan 2026-09, ítem 5.3): dos registros de la misma colección,
 * mismo `politico`, misma fecha y los primeros 60 caracteres normalizados de la cita (o del
 * `texto`, en promesas) iguales, con ids distintos.
 *
 * Como en tests/presentacion-validador.test.ts, se prueba `validarDuplicados()` directo sobre un
 * `Contenido` armado a mano: la etapa no toca el disco ni el esquema, solo compara registros ya
 * cargados.
 */
import { describe, expect, it } from 'vitest';
import { construirContenido, type Registro } from '../scripts/lib/contenido.ts';
import { validarDuplicados } from '../scripts/validadores/duplicados.ts';

function reg(coleccion: Registro['coleccion'], id: string, datos: Record<string, any>, opciones: { enInbox?: boolean } = {}): Registro {
  return {
    coleccion,
    id,
    archivo: `${opciones.enInbox ? 'inbox' : 'content'}/${coleccion}/${id}.yaml`,
    datos,
    crudo: datos,
    enInbox: opciones.enInbox ?? false,
  };
}

const CITA = 'El presidente admitió que la situación obliga a revisar la carga tributaria este año en la conferencia.';

describe('validarDuplicados: declaraciones', () => {
  it('no avisa con fechas distintas', () => {
    const c = construirContenido('/fake-root', [
      reg('declaraciones', 'lacalle-pou/2020-04-20-a', { politico: 'lacalle-pou', fecha: '2020-04-20', cita: CITA }),
      reg('declaraciones', 'lacalle-pou/2020-04-21-b', { politico: 'lacalle-pou', fecha: '2020-04-21', cita: CITA }),
    ], [], 2);
    const r = validarDuplicados(c);
    expect(r.errores).toEqual([]);
    expect(r.avisos).toEqual([]);
  });

  it('no avisa con políticos distintos', () => {
    const c = construirContenido('/fake-root', [
      reg('declaraciones', 'lacalle-pou/2020-04-20-a', { politico: 'lacalle-pou', fecha: '2020-04-20', cita: CITA }),
      reg('declaraciones', 'mujica/2020-04-20-b', { politico: 'mujica', fecha: '2020-04-20', cita: CITA }),
    ], [], 2);
    const r = validarDuplicados(c);
    expect(r.errores).toEqual([]);
    expect(r.avisos).toEqual([]);
  });

  it('no avisa si los primeros 60 caracteres de la cita difieren', () => {
    const c = construirContenido('/fake-root', [
      reg('declaraciones', 'lacalle-pou/2020-04-20-a', { politico: 'lacalle-pou', fecha: '2020-04-20', cita: 'Una primera frase completamente distinta que no comparte comienzo con la otra.' }),
      reg('declaraciones', 'lacalle-pou/2020-04-20-b', { politico: 'lacalle-pou', fecha: '2020-04-20', cita: 'Otra frase, dicha en el mismo día, sobre un tema totalmente diferente y sin relación.' }),
    ], [], 2);
    const r = validarDuplicados(c);
    expect(r.errores).toEqual([]);
    expect(r.avisos).toEqual([]);
  });

  it('avisa (en content/) con mismo político, misma fecha y mismo comienzo de cita, ids distintos', () => {
    const c = construirContenido('/fake-root', [
      reg('declaraciones', 'lacalle-pou/2020-04-20-a', { politico: 'lacalle-pou', fecha: '2020-04-20', cita: CITA }),
      reg('declaraciones', 'lacalle-pou/2020-04-20-b', { politico: 'lacalle-pou', fecha: '2020-04-20', cita: CITA }),
    ], [], 2);
    const r = validarDuplicados(c);
    expect(r.errores).toEqual([]);
    expect(r.avisos.length).toBe(1);
    expect(r.avisos[0].mensaje).toContain('Posible duplicado');
    // Se reporta sobre el segundo por orden alfabético de id, apuntando al primero.
    expect(r.avisos[0].archivo).toContain('2020-04-20-b');
    expect(r.avisos[0].mensaje).toContain('lacalle-pou/2020-04-20-a');
  });

  it('detecta el duplicado aunque difieran en mayúsculas, acentos o puntuación (normaliza antes de comparar)', () => {
    const c = construirContenido('/fake-root', [
      reg('declaraciones', 'lacalle-pou/2020-04-20-a', { politico: 'lacalle-pou', fecha: '2020-04-20', cita: 'El Presidente admitió que la situación OBLIGA a revisar la carga tributaria.' }),
      reg('declaraciones', 'lacalle-pou/2020-04-20-b', { politico: 'lacalle-pou', fecha: '2020-04-20', cita: 'el presidente admitio que la situacion obliga a revisar la carga tributaria.' }),
    ], [], 2);
    const r = validarDuplicados(c);
    expect(r.avisos.length).toBe(1);
  });

  it('error en --inbox: duplicado dentro del mismo lote', () => {
    const c = construirContenido('/fake-root', [
      reg('declaraciones', 'lacalle-pou/2020-04-20-a', { politico: 'lacalle-pou', fecha: '2020-04-20', cita: CITA }, { enInbox: true }),
      reg('declaraciones', 'lacalle-pou/2020-04-20-b', { politico: 'lacalle-pou', fecha: '2020-04-20', cita: CITA }, { enInbox: true }),
    ], [], 2);
    const r = validarDuplicados(c);
    expect(r.avisos).toEqual([]);
    expect(r.errores.length).toBe(1);
  });

  it('error en --inbox: un registro nuevo que duplica uno ya publicado en content/', () => {
    const c = construirContenido('/fake-root', [
      reg('declaraciones', 'lacalle-pou/2020-04-20-a', { politico: 'lacalle-pou', fecha: '2020-04-20', cita: CITA }, { enInbox: false }),
      reg('declaraciones', 'lacalle-pou/2020-04-20-b', { politico: 'lacalle-pou', fecha: '2020-04-20', cita: CITA }, { enInbox: true }),
    ], [], 2);
    const r = validarDuplicados(c);
    expect(r.avisos).toEqual([]);
    expect(r.errores.length).toBe(1);
    expect(r.errores[0].archivo).toContain('inbox/');
  });
});

describe('validarDuplicados: promesas (usa `texto` en vez de `cita`)', () => {
  it('avisa con mismo político, misma fecha_promesa y mismo comienzo de texto', () => {
    const c = construirContenido('/fake-root', [
      reg('promesas', 'lacalle-pou/a', { politico: 'lacalle-pou', fecha_promesa: '2019-10-15', texto: 'No subir los impuestos durante todo el mandato de gobierno.' }),
      reg('promesas', 'lacalle-pou/b', { politico: 'lacalle-pou', fecha_promesa: '2019-10-15', texto: 'No subir los impuestos durante todo el mandato de gobierno.' }),
    ], [], 2);
    const r = validarDuplicados(c);
    expect(r.avisos.length).toBe(1);
  });

  it('no compara promesas contra declaraciones (colecciones distintas)', () => {
    const c = construirContenido('/fake-root', [
      reg('promesas', 'lacalle-pou/a', { politico: 'lacalle-pou', fecha_promesa: '2019-10-15', texto: CITA }),
      reg('declaraciones', 'lacalle-pou/2019-10-15-a', { politico: 'lacalle-pou', fecha: '2019-10-15', cita: CITA }),
    ], [], 2);
    const r = validarDuplicados(c);
    expect(r.errores).toEqual([]);
    expect(r.avisos).toEqual([]);
  });
});

describe('validarDuplicados: sin datos suficientes', () => {
  it('no revienta ni avisa si falta politico, fecha o el campo de texto', () => {
    const c = construirContenido('/fake-root', [
      reg('declaraciones', 'lacalle-pou/2020-04-20-a', { politico: 'lacalle-pou', fecha: '2020-04-20' }),
      reg('declaraciones', 'lacalle-pou/2020-04-20-b', { fecha: '2020-04-20', cita: CITA }),
    ], [], 2);
    const r = validarDuplicados(c);
    expect(r.errores).toEqual([]);
    expect(r.avisos).toEqual([]);
  });
});
