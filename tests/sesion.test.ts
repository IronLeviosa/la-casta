/**
 * Partes puras de `pnpm sesion <crr|css> <AAAA-MM-DD>`: parseo del CSV de diputados.gub.uy (dos
 * formatos de fecha en el mismo archivo), parseo de una línea CDX y la URL de la consulta CDX.
 * Nada acá pega a la red: eso lo prueba la corrida real (`npx tsx scripts/corpus/sesion.ts ...`).
 */
import { describe, expect, it } from 'vitest';
import {
  comandoCdx,
  normalizarFechaCsv,
  parsearCsv,
  parsearFilaCsv,
  parsearUrlHemeroteca,
} from '../scripts/corpus/sesion.ts';

describe('normalizarFechaCsv', () => {
  it('acepta el formato con barras (sesiones recientes)', () => {
    expect(normalizarFechaCsv('2026/07/14')).toBe('2026-07-14');
  });

  it('acepta el formato con guiones y hora (sesiones viejas)', () => {
    expect(normalizarFechaCsv('2014-03-12 00:00:00')).toBe('2014-03-12');
  });

  it('devuelve null si no reconoce el formato', () => {
    expect(normalizarFechaCsv('12 de marzo de 2014')).toBeNull();
    expect(normalizarFechaCsv('')).toBeNull();
  });
});

describe('parsearFilaCsv', () => {
  it('parsea una fila con fecha con barras', () => {
    expect(parsearFilaCsv('L,2,ORD,26,ESP,2026/07/14,4635,http://www.diputados.gub.uy/wp-content/uploads/2026/09/d4635.pdf')).toEqual({
      legislatura: 'L',
      periodo: '2',
      tipo: 'ORD',
      sesion: '26',
      sesionTipo: 'ESP',
      fecha: '2026-07-14',
      diario: '4635',
      url: 'http://www.diputados.gub.uy/wp-content/uploads/2026/09/d4635.pdf',
    });
  });

  it('parsea una fila con fecha con guiones y hora', () => {
    const fila = parsearFilaCsv('XLVII,5,ORD,3,ORD,2014-03-12 00:00:00,3912,http://www.diputados.gub.uy/wp-content/uploads/2014/03/d3912.pdf');
    expect(fila?.fecha).toBe('2014-03-12');
    expect(fila?.diario).toBe('3912');
  });

  it('devuelve null si faltan columnas', () => {
    expect(parsearFilaCsv('L,2,ORD,26,ESP,2026/07/14')).toBeNull();
  });

  it('devuelve null si la fecha no parsea', () => {
    expect(parsearFilaCsv('L,2,ORD,26,ESP,fecha-invalida,4635,http://ejemplo.uy/d.pdf')).toBeNull();
  });
});

describe('parsearCsv', () => {
  it('saltea el encabezado y las líneas vacías, conserva el orden', () => {
    const csv = [
      'Legislatura,Periodo,Tipo,Sesion,SesionTipo,SesionFecha,Diario,URL',
      'L,2,ORD,26,ESP,2026/07/14,4635,http://ejemplo.uy/d4635.pdf',
      '',
      'XLVII,5,ORD,3,ORD,2014-03-12 00:00:00,3912,http://ejemplo.uy/d3912.pdf',
    ].join('\n');
    const filas = parsearCsv(csv);
    expect(filas).toHaveLength(2);
    expect(filas[0].diario).toBe('4635');
    expect(filas[1].fecha).toBe('2014-03-12');
  });

  it('archivo sin filas válidas da lista vacía', () => {
    expect(parsearCsv('Legislatura,Periodo,Tipo,Sesion,SesionTipo,SesionFecha,Diario,URL\n')).toEqual([]);
  });
});

describe('comandoCdx', () => {
  it('arma la URL del CDX con la carpeta de Representantes', () => {
    const url = comandoCdx('crr', '2005-05-17');
    expect(url).toContain('biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2005-05-17*');
    expect(url).toContain('output=txt');
    expect(url).toContain('fl=original');
  });

  it('usa la carpeta de Senadores para css', () => {
    expect(comandoCdx('css', '2005-05-17')).toContain('/sesionescss/2005-05-17*');
  });
});

describe('parsearUrlHemeroteca', () => {
  it('extrae fecha y número de una URL con espacios codificados', () => {
    const url =
      'https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/1996-12-19%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0001).pdf';
    expect(parsearUrlHemeroteca(url)).toEqual({ fecha: '1996-12-19', numero: '0001' });
  });

  it('extrae fecha y número de una URL de Senadores', () => {
    const url = 'https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescss/1890-04-09%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20SENADORES%20(0009).pdf';
    expect(parsearUrlHemeroteca(url)).toEqual({ fecha: '1890-04-09', numero: '0009' });
  });

  it('devuelve null para una URL que no matchea el patrón', () => {
    expect(parsearUrlHemeroteca('https://biblioteca.parlamento.gub.uy/PublicacionesPeriodicas/busquedalibreTimeLine/?op=ds')).toBeNull();
  });
});
