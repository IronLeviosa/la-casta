/**
 * Presentación de los chequeos: párrafos, título y gráfico.
 */
import { describe, expect, it } from 'vitest';
import { parrafos } from '../src/lib/formato';
import { crearGraficoSchema } from '../src/schemas/base';
import { agruparFuentesDeSeries, unirConPunto } from '../src/lib/fuentes';

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
