/**
 * Partes puras de `pnpm sesion <crr|css> <AAAA-MM-DD>`: parseo del CSV de diputados.gub.uy (dos
 * formatos de fecha en el mismo archivo), parseo de una línea CDX, la URL de la consulta CDX, y el
 * camino de archive.org (fecha de la actuación legislativa, tomo/d.s. del texto, identificador de
 * la colección `uruguay-diario-sesiones`, dedupe de candidatos).
 * Nada acá pega a la red: eso lo prueba la corrida real (`npx tsx scripts/corpus/sesion.ts ...`).
 */
import { describe, expect, it } from 'vitest';
import {
  candidatosDelIndice,
  comandoCdx,
  deduplicarCandidatosArchive,
  fechasDeCabecera,
  recortarCabecera,
  identificadorArchive,
  normalizarFechaActuacion,
  normalizarFechaCsv,
  parsearActuacion,
  parsearCsv,
  parsearFilaCsv,
  parsearUrlHemeroteca,
} from '../scripts/corpus/sesion.ts';
import type { IndiceDiarios } from '../scripts/lib/indice-diarios.ts';

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

describe('normalizarFechaActuacion', () => {
  it('convierte DD-MM-YYYY a AAAA-MM-DD', () => {
    expect(normalizarFechaActuacion('23-05-2001')).toBe('2001-05-23');
  });

  it('devuelve null si no matchea el patrón', () => {
    expect(normalizarFechaActuacion('2001-05-23')).toBeNull();
    expect(normalizarFechaActuacion('')).toBeNull();
  });
});

describe('parsearActuacion', () => {
  it('saca tomo y d.s. de un texto real con el enlace adentro', () => {
    expect(parsearActuacion('Intervino en la discusión. <a href="/x">tomo 68 pag.5 d.s.41</A>')).toEqual({
      tomo: 68,
      numero: 41,
    });
  });

  it('tolera espacios distintos alrededor de "d.s."', () => {
    expect(parsearActuacion('tomo 12 pag. 34 d. s. 567')).toEqual({ tomo: 12, numero: 567 });
  });

  it('tomo 0 vuelve tal cual (desconocido), no se descarta acá', () => {
    expect(parsearActuacion('tomo 0 pag.9 d.s.5')).toEqual({ tomo: 0, numero: 5 });
  });

  it('devuelve null si no encuentra el patrón', () => {
    expect(parsearActuacion('Presidió la sesión ordinaria.')).toBeNull();
  });
});

describe('identificadorArchive', () => {
  it('arma el identificador de Senadores con tomo y número rellenados a 3 dígitos', () => {
    expect(identificadorArchive('css', { tomo: 68, numero: 41 })).toBe('UruguayDiarioSesiones_CS_068_041');
  });

  it('arma el identificador de Representantes sin relleno y sin tomo', () => {
    expect(identificadorArchive('crr', { numero: 3548 })).toBe('UruguayDiarioSesiones_CR_3548');
    // Con `id` (candidato del índice) se usa tal cual: el sufijo no se reconstruye desde tomo y número.
    expect(identificadorArchive('css', { tomo: 386, numero: 217, id: 'UruguayDiarioSesiones_CS_386_217_2' })).toBe('UruguayDiarioSesiones_CS_386_217_2');
  });

  it('tira si a Senadores le falta el tomo', () => {
    expect(() => identificadorArchive('css', { numero: 41 })).toThrow();
    expect(() => identificadorArchive('css', { tomo: 0, numero: 41 })).toThrow();
  });
});

describe('deduplicarCandidatosArchive', () => {
  it('descarta repetidos (mismo tomo y número) y conserva el orden', () => {
    const candidatos = [
      { tomo: 68, numero: 41 },
      { tomo: 68, numero: 41 },
      { tomo: 68, numero: 42 },
      { numero: 3548 },
      { numero: 3548 },
    ];
    expect(deduplicarCandidatosArchive(candidatos)).toEqual([
      { tomo: 68, numero: 41 },
      { tomo: 68, numero: 42 },
      { numero: 3548 },
    ]);
  });
});

describe('fechasDeCabecera', () => {
  it('saca la fecha de una cabecera real de archive.org (tomo 407, d.s. 103, un solo día)', () => {
    // Bytes reales de UruguayDiarioSesiones_CS_407_103_djvu.txt (Range 0-1200), verificado hoy: el
    // "Nº" del OCR sale como "N*" y la fecha va en su propia línea, varias líneas después del tomo.
    const cabecera =
      'N* 103 - TOMO 407 \n\n\n23 DE MAYO DE 2001 \n\n\nREPUBLICA ORIENTAL DEL URUGUAY \n\n\n' +
      'SEGUNDO PERIODO ORDINARIO DE LA XLV LEGISLATURA \n\n21ª SESION EXTRAORDINARIA';
    expect(fechasDeCabecera(cabecera)).toEqual(['2001-05-23']);
  });

  it('una sesión de dos días da las dos fechas (tomo 328, d.s. 12)', () => {
    const cabecera = 'Nº 12 - TOMO 328 \n\n26 Y 27 DE MARZO DE 1990 \n\nREPUBLICA ORIENTAL DEL URUGUAY';
    expect(fechasDeCabecera(cabecera)).toEqual(['1990-03-26', '1990-03-27']);
  });

  it('día con ordinal ("1º")', () => {
    expect(fechasDeCabecera('1º DE MARZO DE 1995')).toEqual(['1995-03-01']);
  });

  it('tolera minúsculas, tildes y el ordinal escrito como "1°" o "1o" (ruido de OCR)', () => {
    expect(fechasDeCabecera('1° de marzo de 1995')).toEqual(['1995-03-01']);
    expect(fechasDeCabecera('1o DE MARZO DE 1995')).toEqual(['1995-03-01']);
    // Lo que el OCR de archive.org hace con el «º» (índice del 2026-09-16: «1?» en 96 cabeceras).
    expect(fechasDeCabecera('N* 75 - TOMO 76 1? DE SETIEMBRE DE 1998')).toEqual(['1998-09-01']);
    expect(fechasDeCabecera('N* 21 - TOMO 66 1* DE FEBRERO DE 1991')).toEqual(['1991-02-01']);
    expect(fechasDeCabecera('N* 2 - TOMO 66 1” DE MARZO DE 1990')).toEqual(['1990-03-01']);
    expect(fechasDeCabecera('N* 2 - TOMO N* 90 1”? DE MARZO DE 2010')).toEqual(['2010-03-01']);
    expect(fechasDeCabecera('N.* 45 - TOMO 93 1. DE MARZO DE 2013')).toEqual(['2013-03-01']);
    expect(fechasDeCabecera('N* 33 - TOMO 92 1% DE MARZO DE 2012')).toEqual(['2012-03-01']);
    // La preposición pegada al mes («DEENERO»), otro ruido frecuente del OCR.
    expect(fechasDeCabecera('N" 17 - TOMO 73 2 DEENERO DE 1996')).toEqual(['1996-01-02']);
    expect(fechasDeCabecera('N* 76 - TOMO 76 3 DEOCTUBRE DE 1998')).toEqual(['1998-10-03']);
    expect(fechasDeCabecera('23 DE MAYO DE 2001')).toEqual(fechasDeCabecera('23 de Mayo de 2001'));
  });

  it('devuelve lista vacía si no hay ninguna fecha reconocible', () => {
    expect(fechasDeCabecera('REPUBLICA ORIENTAL DEL URUGUAY - CAMARA DE SENADORES')).toEqual([]);
  });
});

describe('candidatosDelIndice', () => {
  const indice: IndiceDiarios = {
    version: 1,
    coleccion: 'https://archive.org/details/uruguay-diario-sesiones',
    generado: '2026-09-16T00:00:00.000Z',
    script: 'scripts/corpus/sesion-indexar.ts',
    items: {
      UruguayDiarioSesiones_CS_407_103: {
        camara: 'CS',
        tomo: 407,
        numero: 103,
        fechas: ['2001-05-23'],
        estado: 'fechado',
      },
      UruguayDiarioSesiones_CS_407_104: {
        camara: 'CS',
        tomo: 407,
        numero: 104,
        fechas: ['2001-05-23'],
        estado: 'fechado',
      },
      UruguayDiarioSesiones_CR_3548: {
        camara: 'CR',
        numero: 3548,
        fechas: ['2001-05-23'],
        estado: 'fechado',
      },
    },
    resumen: {},
  };

  it('una fecha con dos ítems de Senadores da dos candidatos', () => {
    expect(candidatosDelIndice(indice, 'css', '2001-05-23')).toEqual([
      { tomo: 407, numero: 103, id: 'UruguayDiarioSesiones_CS_407_103' },
      { tomo: 407, numero: 104, id: 'UruguayDiarioSesiones_CS_407_104' },
    ]);
  });

  it('cámara equivocada: el ítem de Representantes no aparece para css', () => {
    expect(candidatosDelIndice(indice, 'crr', '2001-05-23')).toEqual([{ tomo: undefined, numero: 3548, id: 'UruguayDiarioSesiones_CR_3548' }]);
    // Un ítem `incoherente` conserva su fecha leída pero no es candidato: el año no cuadra con su tomo.
    const conIncoherente: IndiceDiarios = {
      ...indice,
      items: { ...indice.items, UruguayDiarioSesiones_CS_301_140: { camara: 'CS', tomo: 301, numero: 140, fechas: ['1983-09-24'], estado: 'incoherente' } },
    };
    expect(candidatosDelIndice(conIncoherente, 'css', '1983-09-24')).toEqual([]);
  });

  it('fecha sin ningún ítem: lista vacía', () => {
    expect(candidatosDelIndice(indice, 'css', '1999-06-15')).toEqual([]);
  });

  it('sin índice (todavía no se corrió pnpm sesion:indexar): lista vacía', () => {
    expect(candidatosDelIndice(null, 'css', '2001-05-23')).toEqual([]);
  });
});

describe('recortarCabecera', () => {
  it('corta antes de "REPUBLICA", que separa la cabecera del cuerpo del diario', () => {
    const texto = 'N* 103 - TOMO 407 \n\n\n23 DE MAYO DE 2001 \n\n\nREPUBLICA ORIENTAL DEL URUGUAY \n\n\nSUMARIO...';
    expect(recortarCabecera(texto)).toBe('N* 103 - TOMO 407 \n\n\n23 DE MAYO DE 2001 \n\n\n');
  });

  it('no deja que una fecha del cuerpo (la citación, por ejemplo) contamine la comparación', () => {
    // Caso real: el cuerpo de UruguayDiarioSesiones_CS_407_103 (cabecera real: 23 de mayo de 2001)
    // trae más abajo "Montevideo, 22 de mayo de 2001" en el texto de la citación. Sin el recorte,
    // fechasDeCabecera devolvería también esa fecha y un identificador equivocado para el 22 de
    // mayo pasaría la verificación por casualidad.
    const texto =
      'N* 103 - TOMO 407 \n\n\n23 DE MAYO DE 2001 \n\n\nREPUBLICA ORIENTAL DEL URUGUAY \n\n\n' +
      '«Montevideo, 22 de mayo de 2001. La Camara de Senadores se reunira...»';
    expect(fechasDeCabecera(recortarCabecera(texto))).toEqual(['2001-05-23']);
    expect(fechasDeCabecera(texto)).toContain('2001-05-22'); // sin recortar, sí se cuela
  });

  it('sin el marcador, usa un prefijo corto en vez del texto entero', () => {
    const cuerpoLargo = 'x'.repeat(500) + ' 22 DE MAYO DE 2001';
    expect(recortarCabecera(cuerpoLargo)).toHaveLength(200);
    expect(fechasDeCabecera(recortarCabecera(cuerpoLargo))).toEqual([]);
  });
});
