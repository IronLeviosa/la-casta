/**
 * Presentación de los chequeos: párrafos, título y gráfico.
 */
import { describe, expect, it } from 'vitest';
import { parrafos } from '../src/lib/formato';
import { crearGraficoSchema } from '../src/schemas/base';
import { agruparFuentesDeSeries, unirConPunto } from '../src/lib/fuentes';
import { ABREVIATURAS_SIN_FIN_DE_ORACION, contarTerminadores } from '../scripts/lib/presentacion.ts';

describe('parrafos', () => {
  it('separa por línea en blanco (YAML literal) y colapsa los espacios internos', () => {
    expect(parrafos('Uno dos\ntres.\n\nCuatro   cinco.\n\n\nSeis.')).toEqual(['Uno dos tres.', 'Cuatro cinco.', 'Seis.']);
  });
  it('acepta un salto simple como separador cuando no hay líneas en blanco (YAML plegado)', () => {
    expect(parrafos('Primero.\nSegundo.')).toEqual(['Primero.', 'Segundo.']);
  });
  it('un texto sin saltos es un solo párrafo; vacío es lista vacía', () => {
    expect(parrafos('Solo uno.')).toEqual(['Solo uno.']);
    expect(parrafos('')).toEqual([]);
    expect(parrafos(undefined)).toEqual([]);
  });
});

describe('grafico', () => {
  const Grafico = crearGraficoSchema();
  const base = {
    tipo: 'barras',
    titulo: 'Resultado del ejercicio',
    unidad: 'millones de USD',
    series: [{ nombre: 'Resultado', fuente: 'Estados financieros auditados', puntos: [{ x: '2019', y: 39.2 }, { x: '2020', y: -12.1 }] }],
  };
  it('acepta barras y líneas con al menos una serie con puntos y fuente', () => {
    expect(Grafico.safeParse(base).success).toBe(true);
    expect(Grafico.safeParse({ ...base, tipo: 'lineas' }).success).toBe(true);
    expect(Grafico.parse(base).colorear_por_signo).toBe(false);
  });
  it('rechaza una serie sin fuente, sin puntos, o un tipo desconocido', () => {
    expect(Grafico.safeParse({ ...base, series: [{ nombre: 'x', puntos: [{ x: 'a', y: 1 }] }] }).success).toBe(false);
    expect(Grafico.safeParse({ ...base, series: [{ nombre: 'x', fuente: 'f', puntos: [] }] }).success).toBe(false);
    expect(Grafico.safeParse({ ...base, tipo: 'torta' }).success).toBe(false);
  });
  it('rechaza campos desconocidos', () => {
    expect(Grafico.safeParse({ ...base, color: 'rojo' }).success).toBe(false);
  });
});

describe('agruparFuentesDeSeries', () => {
  it('un publicador citado por varias series aparece una sola vez, con la cita más completa', () => {
    // Caso real: content/chequeos/lacalle-pou/2022-03-27-combustibles-mas-baratos-brasil.yaml
    // repetía «ANP, Série Histórica…» en dos series, una con un paréntesis de más.
    const fuentes = [
      'URSEA/MIEM (2002-2019/05), decretos del Poder Ejecutivo (2021) y ANCAP/catalogodatos (2022).',
      'ANP, Série Histórica de Preços de Combustíveis, planillas mensuales nacionales.',
      'URSEA/MIEM (2002-2019/05), decretos del Poder Ejecutivo (2021) y ANCAP/catalogodatos (2022).',
      'ANP, Série Histórica de Preços de Combustíveis, planillas mensuales nacionales (diesel sin grado hasta 2012, S10 desde 2013).',
    ];
    const agrupadas = agruparFuentesDeSeries(fuentes);
    expect(agrupadas).toHaveLength(2);
    expect(agrupadas).toContain('URSEA/MIEM (2002-2019/05), decretos del Poder Ejecutivo (2021) y ANCAP/catalogodatos (2022)');
    // Se queda con la cita más completa (la que trae el paréntesis extra), no con la primera.
    expect(agrupadas).toContain('ANP, Série Histórica de Preços de Combustíveis, planillas mensuales nacionales (diesel sin grado hasta 2012, S10 desde 2013)');
  });
  it('sin coma ni paréntesis, el publicador es la frase entera (mismo comportamiento que antes)', () => {
    expect(agruparFuentesDeSeries(['Estados financieros auditados', 'Estados financieros auditados'])).toEqual(['Estados financieros auditados']);
    expect(agruparFuentesDeSeries(['Estados financieros auditados', 'Otra fuente'])).toEqual(['Estados financieros auditados', 'Otra fuente']);
  });
  it('ignora entradas vacías y conserva el orden de primera aparición', () => {
    expect(agruparFuentesDeSeries(['', 'BCU', '  '])).toEqual(['BCU']);
  });
});

describe('unirConPunto', () => {
  it('une con «; » y un solo punto final, sin arrastrar el punto de cada frase', () => {
    expect(unirConPunto(['URSEA', 'ANP.'])).toBe('URSEA; ANP.');
    expect(unirConPunto(['ANP, Série Histórica de Preços de Combustíveis (diesel S10).'])).toBe('ANP, Série Histórica de Preços de Combustíveis (diesel S10).');
  });
  it('nunca deja «..» ni «;;», incluso con frases vacías de por medio', () => {
    const texto = unirConPunto(['ANP.', '', 'URSEA.']);
    expect(texto).not.toMatch(/\.\./);
    expect(texto).not.toMatch(/;;/);
    expect(texto).toBe('ANP; URSEA.');
  });
  it('lista vacía es texto vacío', () => {
    expect(unirConPunto([])).toBe('');
  });
});

describe('contarTerminadores: siglas y abreviaturas no terminan oración', () => {
  it('una sigla con puntos no termina oración, ni en cadena ni con espacios', () => {
    expect(contarTerminadores('Aportes del M.V.O.T.M.A., y otros) no constan en el balance.')).toBe(1);
    expect(contarTerminadores('Agroalur S.A. fue absorbida por ALUR.')).toBe(1);
    expect(contarTerminadores('Alcoholes del Uruguay S. A. se constituyó como sociedad anónima.')).toBe(1);
    expect(contarTerminadores('Capitalización de U.T.E. por unidades indexadas.')).toBe(1);
    expect(contarTerminadores('Capitalización de U.I. 5.712.381.810 a ANCAP.')).toBe(1);
  });

  it('una abreviatura conocida no termina oración, siga lo que siga', () => {
    expect(contarTerminadores('Ver art. 190 de la ley de presupuesto.')).toBe(1);
    expect(contarTerminadores('Según el Art. 68 de la ley.')).toBe(1);
    expect(contarTerminadores('Seguro «Vida Prev.» (renta vitalicia) aparte.')).toBe(1);
    expect(contarTerminadores('Seguro "Vida Prev." (renta vitalicia) aparte.')).toBe(1);
    expect(contarTerminadores('Informe técnico del Cr. Alvaro Rossa sobre el balance.')).toBe(1);
    expect(contarTerminadores('Convocado el Sr. Gabriel Barandiarán.')).toBe(1);
    expect(contarTerminadores('Ordenanza N.° 81 del Tribunal de Cuentas.')).toBe(1);
    expect(contarTerminadores('Dice «Integrac. (rescate) de capital» en el estado.')).toBe(1);
  });

  it('un punto seguido de minúscula no termina oración (abreviatura no listada, dominio, puntos suspensivos)', () => {
    expect(contarTerminadores('Aportes de capital en trám. según el balance.')).toBe(1);
    expect(contarTerminadores('Consta en ose.com.uy y en Wayback.')).toBe(1);
    expect(contarTerminadores('El texto está siendo redactado... los legisladores lo votan.')).toBe(1);
  });

  it('el punto final cierra la oración aunque sea el de una sigla o una abreviatura', () => {
    expect(contarTerminadores('Seguro de Vida Prev.')).toBe(1);
    expect(contarTerminadores('Subsidiaria ANCSOL S.A.')).toBe(1);
    expect(contarTerminadores('Aportes M.T.O.P.')).toBe(1);
    expect(contarTerminadores('Dos oraciones. La segunda cierra en Prev.')).toBe(2);
  });

  it('dos oraciones reales siguen contando 2, con y sin siglas de por medio', () => {
    expect(contarTerminadores('Sociedad anónima cerrada, con acciones nominativas. Los socios fundadores son ANCAP y la CND.')).toBe(2);
    expect(contarTerminadores('Agroalur S.A. fue absorbida por ALUR. La fusión rige desde el cierre del ejercicio.')).toBe(2);
    expect(contarTerminadores('Desde entonces el MTOP administra el puerto. Ver art. 190 de la ley.')).toBe(2);
    expect(contarTerminadores('La diferencia neta es de $ 582,8 M. El Estado de Evolución del Patrimonio la muestra aparte.')).toBe(2);
  });

  it('no cambia lo que ya medía: decimales, miles, repeticiones, ! y ?', () => {
    expect(contarTerminadores('Subió 12.5 puntos.')).toBe(1);
    expect(contarTerminadores('US$ 5.712.381.810 más intereses.')).toBe(1);
    expect(contarTerminadores('¿Cuánto? Mucho.')).toBe(2);
    expect(contarTerminadores('¡Sí! ¡Claro!')).toBe(2);
    expect(contarTerminadores('¿En serio?! Sí.')).toBe(2);
    expect(contarTerminadores('Se aprobó la ley. Luego se promulgó.')).toBe(2);
    expect(contarTerminadores('Sin terminador')).toBe(0);
  });

  it('«ley» no está en la lista de abreviaturas: cierra oraciones', () => {
    expect(ABREVIATURAS_SIN_FIN_DE_ORACION.has('ley')).toBe(false);
    expect(ABREVIATURAS_SIN_FIN_DE_ORACION.has('art')).toBe(true);
    expect(ABREVIATURAS_SIN_FIN_DE_ORACION.has('prev')).toBe(true);
  });
});
