/**
 * Elección de charset al extraer una página.
 *
 * Una nota vieja de El País archivada en Wayback trae tres declaraciones de charset: dos de la
 * envoltura que inyecta el propio Wayback, en utf-8, y la del cuerpo original, en iso-8859-1.
 * Creerle al primero rompe todas las vocales acentuadas, y eso llegó a una cita del inbox. El
 * validador de citas no lo atrapa, porque compara la cita rota contra el texto rota que guardamos.
 */
import { describe, expect, it } from 'vitest';
import { decodificarHtmlParaPrueba as decodificar } from '../scripts/corpus/fuente.ts';

const latin1 = (s: string) => Buffer.from(s, 'latin1');

describe('decodificación de HTML', () => {
  it('usa el charset del cuerpo aunque una envoltura declare otro antes', () => {
    // Así viene una nota archivada: el wrapper del archivo dice utf-8, el original iso-8859-1.
    const html =
      '<html><head><meta charset="utf-8"><!-- wrapper del archivo --></head><body>' +
      '<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">' +
      '<p>respetaremos la decisión que tome el Parlamento</p></body></html>';
    expect(decodificar(latin1(html), 'text/html')).toContain('la decisión que tome el Parlamento');
  });

  it('no rompe una página utf-8 normal', () => {
    const html = '<html><head><meta charset="utf-8"></head><body><p>había una vez, ñandú</p></body></html>';
    expect(decodificar(Buffer.from(html, 'utf8'), 'text/html; charset=utf-8')).toContain('había una vez, ñandú');
  });

  it('acierta aunque no haya ningún charset declarado', () => {
    const html = '<html><body><p>el déficit es grande</p></body></html>';
    expect(decodificar(latin1(html), 'text/html')).toContain('el déficit es grande');
    expect(decodificar(Buffer.from(html, 'utf8'), 'text/html')).toContain('el déficit es grande');
  });

  it('no deja caracteres de reemplazo cuando existe un charset que decodifica limpio', () => {
    const html = '<meta charset="utf-8"><p>José Mujica, más allá de la decisión</p>';
    const texto = decodificar(latin1(html), 'text/html');
    expect(texto).not.toContain('�');
    expect(texto).toContain('José Mujica');
  });
});
