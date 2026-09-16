/**
 * Partes puras de `pnpm sesion:indexar` (scripts/corpus/sesion-indexar.ts): parseo de
 * identificadores de la colección `uruguay-diario-sesiones`, fusión incremental contra un índice
 * anterior, y el resumen por cámara y año. Nada acá pega a la red.
 */
import { describe, expect, it } from 'vitest';
import { depurarIndice, fechasPlausibles, identificadoresPendientes, parsearIdentificadorArchive } from '../scripts/corpus/sesion-indexar.ts';
import { calcularResumen, type ItemIndice } from '../scripts/lib/indice-diarios.ts';
import { fechasDeCabecera, recortarCabecera } from '../scripts/corpus/sesion.ts';

describe('parsearIdentificadorArchive', () => {
  it('Senadores: tomo y número', () => {
    expect(parsearIdentificadorArchive('UruguayDiarioSesiones_CS_390_263')).toEqual({
      camara: 'CS',
      tomo: 390,
      numero: 263,
    });
  });

  it('Representantes: sin tomo', () => {
    expect(parsearIdentificadorArchive('UruguayDiarioSesiones_CR_3692')).toEqual({ camara: 'CR', numero: 3692 });
  });

  it('Comisión Permanente con sufijo', () => {
    expect(parsearIdentificadorArchive('UruguayDiarioSesiones_CP_025_003_3')).toEqual({
      camara: 'CP',
      tomo: 25,
      numero: 3,
      sufijo: 3,
    });
  });

  it('Comisión Permanente sin sufijo', () => {
    expect(parsearIdentificadorArchive('UruguayDiarioSesiones_CP_025_003')).toEqual({
      camara: 'CP',
      tomo: 25,
      numero: 3,
    });
  });

  it('Asamblea General: tomo y número, como Senadores', () => {
    expect(parsearIdentificadorArchive('UruguayDiarioSesiones_AG_010_005')).toEqual({
      camara: 'AG',
      tomo: 10,
      numero: 5,
    });
  });

  it('devuelve null si no matchea ningún patrón', () => {
    expect(parsearIdentificadorArchive('UruguayDiarioSesiones_XX_1')).toBeNull();
    expect(parsearIdentificadorArchive('otracosa')).toBeNull();
  });

  it('devuelve null si Representantes trae más de un número (patrón desconocido para esa cámara)', () => {
    expect(parsearIdentificadorArchive('UruguayDiarioSesiones_CR_390_263')).toBeNull();
  });

  // Verificado 2026-09-16 contra la API de búsqueda real: algunos ítems de AG y CS no siguen la
  // forma de dos números que asumía el plan (docs/plan-indice-diarios.md §1).
  it('Asamblea General sin tomo, un solo número (forma real, no prevista en el plan)', () => {
    expect(parsearIdentificadorArchive('UruguayDiarioSesiones_AG_060')).toEqual({ camara: 'AG', numero: 60 });
  });

  it('Senadores con sufijo, tres números (forma real, no prevista en el plan)', () => {
    expect(parsearIdentificadorArchive('UruguayDiarioSesiones_CS_407_106_2')).toEqual({
      camara: 'CS',
      tomo: 407,
      numero: 106,
      sufijo: 2,
    });
  });

  it('ata el identificador al parser de fechas: la cabecera real de UruguayDiarioSesiones_CS_407_103', () => {
    const id = 'UruguayDiarioSesiones_CS_407_103';
    expect(parsearIdentificadorArchive(id)).toEqual({ camara: 'CS', tomo: 407, numero: 103 });
    const cabecera = 'N* 103 - TOMO 407 \n\n\n23 DE MAYO DE 2001 \n\n\nREPUBLICA ORIENTAL DEL URUGUAY \n\n\nSUMARIO...';
    expect(fechasDeCabecera(recortarCabecera(cabecera))).toEqual(['2001-05-23']);
  });
});

function item(estado: ItemIndice['estado']): ItemIndice {
  return { camara: 'CS', tomo: 1, numero: 1, fechas: estado === 'fechado' ? ['2000-01-01'] : [], estado };
}

describe('fechasPlausibles', () => {
  it('descarta años antes de 1830 (ruido de OCR como «1286») y después del año que viene', () => {
    expect(fechasPlausibles(['1286-02-07', '1998-09-16', '2099-01-01'], 2027)).toEqual(['1998-09-16']);
    expect(fechasPlausibles(['1830-01-01', '2027-12-31'], 2027)).toEqual(['1830-01-01', '2027-12-31']);
    expect(fechasPlausibles([])).toEqual([]);
  });
});

describe('depurarIndice', () => {
  const cs = (tomo: number, numero: number, fecha: string, estado: ItemIndice['estado'] = 'fechado'): ItemIndice =>
    ({ camara: 'CS', tomo, numero, fechas: [fecha], estado });

  it('marca incoherente al ítem cuyo año se aleja más de uno de la mediana de su tomo, y lo revierte si vuelve a cuadrar', () => {
    const items: Record<string, ItemIndice> = {
      a: cs(301, 1, '1986-03-04'),
      b: cs(301, 2, '1986-05-06'),
      c: cs(301, 3, '1986-09-10'),
      d: cs(301, 4, '1987-01-12'),
      malo: cs(301, 140, '1983-09-24'),
    };
    expect(depurarIndice(items)).toEqual({ implausibles: [], incoherentes: ['malo'] });
    expect(items.malo.estado).toBe('incoherente');
    expect(items.malo.fechas).toEqual(['1983-09-24']);
    expect(items.d.estado).toBe('fechado');
    // Reversible: con el año corregido, vuelve a fechado en la pasada siguiente.
    items.malo.fechas = ['1986-09-24'];
    expect(depurarIndice(items).incoherentes).toEqual([]);
    expect(items.malo.estado).toBe('fechado');
  });

  it('con menos de tres compañeros de tomo no juzga, y en las cámaras de tomo largo (CP, AG) tampoco', () => {
    const pocos: Record<string, ItemIndice> = { a: cs(310, 1, '1987-03-04'), b: cs(310, 2, '1987-05-06'), malo: cs(310, 215, '1938-10-13') };
    expect(depurarIndice(pocos).incoherentes).toEqual([]);
    expect(pocos.malo.estado).toBe('fechado');
    const cp: Record<string, ItemIndice> = {
      a: { camara: 'CP', tomo: 21, numero: 7, fechas: ['2001-01-23'], estado: 'fechado' },
      b: { camara: 'CP', tomo: 21, numero: 30, fechas: ['2003-02-05'], estado: 'fechado' },
      c: { camara: 'CP', tomo: 21, numero: 31, fechas: ['2003-03-05'], estado: 'fechado' },
      d: { camara: 'CP', tomo: 21, numero: 40, fechas: ['2003-11-05'], estado: 'fechado' },
      e: { camara: 'CP', tomo: 21, numero: 61, fechas: ['2005-01-25'], estado: 'fechado' },
    };
    expect(depurarIndice(cp).incoherentes).toEqual([]);
  });

  it('descarta fechas implausibles que quedaron fechadas antes del filtro y deja el ítem sin_fecha', () => {
    const items: Record<string, ItemIndice> = {
      viejo: { camara: 'CP', tomo: 18, numero: 5, fechas: ['1286-02-07'], cabecera: 'N* 5 — TOMO 18 7 DE FEBRERO DE 1286', estado: 'fechado' },
      mixto: { camara: 'CR', numero: 10, fechas: ['0198-01-01', '1998-01-01'], estado: 'fechado' },
    };
    expect(depurarIndice(items).implausibles).toEqual(['viejo', 'mixto']);
    expect(items.viejo).toMatchObject({ fechas: [], estado: 'sin_fecha', cabecera: 'N* 5 — TOMO 18 7 DE FEBRERO DE 1286' });
    expect(items.mixto).toMatchObject({ fechas: ['1998-01-01'], estado: 'fechado' });
  });
});

describe('identificadoresPendientes', () => {
  const anterior: Record<string, ItemIndice> = {
    fechado: item('fechado'),
    sinFecha: item('sin_fecha'),
    sinOcr: item('sin_ocr'),
  };
  const identificadores = ['fechado', 'sinFecha', 'sinOcr', 'nuevo'];

  it('sin --reintentar: solo el nuevo y el sin_ocr (fallo de red, se reintenta siempre)', () => {
    expect(identificadoresPendientes(identificadores, anterior)).toEqual(['sinOcr', 'nuevo']);
  });

  it('con --reintentar: además el sin_fecha; el fechado nunca se reprocesa', () => {
    expect(identificadoresPendientes(identificadores, anterior, { reintentar: true })).toEqual([
      'sinFecha',
      'sinOcr',
      'nuevo',
    ]);
  });

  it('índice anterior vacío: todos pendientes', () => {
    expect(identificadoresPendientes(['a', 'b'], {})).toEqual(['a', 'b']);
  });
});

describe('calcularResumen', () => {
  it('cuenta ítems fechado por cámara y año, ignora sin_fecha, sin_ocr e incoherente', () => {
    const items: Record<string, ItemIndice> = {
      a: { camara: 'CS', tomo: 1, numero: 1, fechas: ['1998-09-16'], estado: 'fechado' },
      b: { camara: 'CS', tomo: 2, numero: 2, fechas: ['1998-03-01'], estado: 'fechado' },
      c: { camara: 'CR', tomo: undefined, numero: 3, fechas: ['2010-05-05'], estado: 'fechado' },
      d: { camara: 'CS', tomo: 3, numero: 3, fechas: [], estado: 'sin_fecha' },
      e: { camara: 'CS', tomo: 4, numero: 4, fechas: [], estado: 'sin_ocr' },
    };
    expect(calcularResumen(items)).toEqual({ CS: { '1998': 2 }, CR: { '2010': 1 } });
  });

  it('índice vacío da resumen vacío', () => {
    expect(calcularResumen({})).toEqual({});
  });
});
