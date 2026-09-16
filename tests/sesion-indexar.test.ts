/**
 * Partes puras de `pnpm sesion:indexar` (scripts/corpus/sesion-indexar.ts): parseo de
 * identificadores de la colección `uruguay-diario-sesiones`, fusión incremental contra un índice
 * anterior, y el resumen por cámara y año. Nada acá pega a la red.
 */
import { describe, expect, it } from 'vitest';
import { identificadoresPendientes, parsearIdentificadorArchive } from '../scripts/corpus/sesion-indexar.ts';
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
  it('cuenta ítems fechado por cámara y año, ignora sin_fecha y sin_ocr', () => {
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
