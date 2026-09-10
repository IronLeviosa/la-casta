/**
 * `pnpm siguiente` sobre un fixture chico, sin tocar disco: tres personas de cargos
 * distintos, dos temas, una combinación ya investigada con hallazgos (la que fija el
 * período del tema) y otra investigada sin hallazgos (para probar la regla 4).
 *
 * Fixture:
 *  - batlle-maria: Presidenta de la República, 2018-03-01 → 2023-03-01.
 *  - nunez-ana: Senadora de la República, 2015-01-01 → 2020-01-01.
 *  - perez-juan: Representante Nacional por Canelones (suplente), 2019-01-01 → 2021-01-01.
 *  - temas: impuestos, vivienda (los dos sin padre, es decir los dos son hojas).
 *  - un registro: declaración de batlle-maria sobre impuestos el 2019-06-15 → impuestos
 *    queda "investigado, con registros" para ella, y su período conocido es ese único día.
 *  - una corrida sin registro: nunez-ana investigó vivienda y no encontró nada → vivienda
 *    queda "investigado, sin hallazgos" para ella (y sin período conocido, porque no hay
 *    ningún registro de vivienda todavía).
 */
import { describe, expect, it } from 'vitest';
import type { Corrida, EstadoTema, PoliticoMinimo, RegistroMinimo, TemaMinimo } from '../src/lib/cobertura.ts';
import { cargoDePersona, construirPropuestas, mandatoSolapaConTema, type EntradaSiguiente } from '../scripts/siguiente.ts';

const politicos: PoliticoMinimo[] = [
  { id: 'batlle-maria', nombre: 'María Batlle', partido: 'Partido Nacional', mandatos: [{ cargo: 'Presidente de la República', desde: '2018-03-01', hasta: '2023-03-01' }] },
  { id: 'nunez-ana', nombre: 'Ana Núñez', partido: 'Frente Amplio', mandatos: [{ cargo: 'Senadora de la República', desde: '2015-01-01', hasta: '2020-01-01' }] },
  { id: 'perez-juan', nombre: 'Juan Pérez', partido: 'Frente Amplio', mandatos: [{ cargo: 'Representante Nacional por Canelones (suplente)', desde: '2019-01-01', hasta: '2021-01-01' }] },
];

const temas: TemaMinimo[] = [
  { id: 'impuestos', nombre: 'Impuestos' },
  { id: 'vivienda', nombre: 'Vivienda' },
];

const registros: RegistroMinimo[] = [
  { coleccion: 'declaraciones', id: 'batlle-maria/2019-06-15-algo', politicos: ['batlle-maria'], tema: 'impuestos', fecha: '2019-06-15' },
];

const corridas: Corrida[] = [
  { id: '2019-06-15-batlle-maria-impuestos', fecha: '2019-06-15', politico: 'batlle-maria', tema: 'impuestos', temaConocido: true },
  { id: '2020-02-01-nunez-ana-vivienda', fecha: '2020-02-01', politico: 'nunez-ana', tema: 'vivienda', temaConocido: true },
];

// Igual a como calcularResumen() dejaría data/simetria.json: solo aparecen los temas con
// al menos un registro (vivienda todavía no tiene ninguno, así que no figura acá).
const temasSimetria: EstadoTema[] = [
  { tema: 'impuestos', desde: '2019-06-15', hasta: '2019-06-15', cubiertos: ['batlle-maria'], sin_cubrir: ['nunez-ana', 'perez-juan'] },
];

function entrada(politicosFixture = politicos): EntradaSiguiente {
  return { politicos: politicosFixture, temas, registros, corridas, temasSimetria };
}

describe('cargoDePersona', () => {
  it('presidente y vicepresidente rankean tier 0', () => {
    expect(cargoDePersona([{ desde: '2020-01-01', cargo: 'Presidente de la República' }]).tier).toBe(0);
    expect(cargoDePersona([{ desde: '2020-01-01', cargo: 'Vicepresidente de la República' }]).tier).toBe(0);
  });

  it('senador titular es tier 1, distinto de un senador suplente (tier 3)', () => {
    expect(cargoDePersona([{ desde: '2020-01-01', cargo: 'Senadora de la República' }]).tier).toBe(1);
    expect(cargoDePersona([{ desde: '2020-01-01', cargo: 'Senador de la República (suplente de Jorge Larrañaga)' }]).tier).toBe(3);
  });

  it('diputado titular es tier 2, distinto de un diputado suplente (tier 3)', () => {
    expect(cargoDePersona([{ desde: '2020-01-01', cargo: 'Representante Nacional por Canelones' }]).tier).toBe(2);
    expect(cargoDePersona([{ desde: '2020-01-01', cargo: 'Representante Nacional por Canelones (suplente)' }]).tier).toBe(3);
  });

  it('un cargo sin reconocer (ministro, intendente) es tier 4, no rompe', () => {
    expect(cargoDePersona([{ desde: '2020-01-01', cargo: 'Ministro de Economía y Finanzas' }]).tier).toBe(4);
  });

  it('se queda con el mejor cargo entre varios mandatos', () => {
    expect(
      cargoDePersona([
        { desde: '2000-01-01', hasta: '2010-01-01', cargo: 'Representante Nacional por Canelones' },
        { desde: '2010-01-01', cargo: 'Senadora de la República' },
      ]).tier,
    ).toBe(1);
  });
});

describe('mandatoSolapaConTema', () => {
  const mandatos = [{ desde: '2015-01-01', hasta: '2020-01-01' }];
  it('sin período conocido, cualquier mandato cuenta (tema recién abierto)', () => {
    expect(mandatoSolapaConTema(mandatos, undefined)).toBe(true);
  });
  it('con período conocido, exige solapamiento real', () => {
    const dentro: EstadoTema = { tema: 'x', desde: '2016-01-01', hasta: '2016-06-01', cubiertos: [], sin_cubrir: [] };
    const fuera: EstadoTema = { tema: 'x', desde: '2021-01-01', hasta: '2022-01-01', cubiertos: [], sin_cubrir: [] };
    expect(mandatoSolapaConTema(mandatos, dentro)).toBe(true);
    expect(mandatoSolapaConTema(mandatos, fuera)).toBe(false);
  });
});

describe('construirPropuestas', () => {
  it('arma la cola completa en el orden esperado', () => {
    const { propuestas, restantesPorTema } = construirPropuestas(entrada());
    expect(propuestas.map((p) => [p.politico, p.tema])).toEqual([
      ['nunez-ana', 'impuestos'],
      ['perez-juan', 'impuestos'],
      ['batlle-maria', 'vivienda'],
      ['perez-juan', 'vivienda'],
    ]);
    expect(Object.fromEntries(restantesPorTema)).toEqual({ impuestos: 2, vivienda: 2 });
  });

  it('nunca propone una combinación ya investigada, con hallazgos o sin ellos (regla 4)', () => {
    const { propuestas } = construirPropuestas(entrada());
    expect(propuestas.some((p) => p.politico === 'batlle-maria' && p.tema === 'impuestos')).toBe(false); // con hallazgos
    expect(propuestas.some((p) => p.politico === 'nunez-ana' && p.tema === 'vivienda')).toBe(false); // sin hallazgos
  });

  it('dentro de un tema, ordena por cargo: senadora antes que suplente', () => {
    const { propuestas } = construirPropuestas(entrada());
    const deImpuestos = propuestas.filter((p) => p.tema === 'impuestos').map((p) => p.politico);
    expect(deImpuestos).toEqual(['nunez-ana', 'perez-juan']);
  });

  it('dentro de un tema nuevo (sin período conocido), presidenta antes que suplente', () => {
    const { propuestas } = construirPropuestas(entrada());
    const deVivienda = propuestas.filter((p) => p.tema === 'vivienda').map((p) => p.politico);
    expect(deVivienda).toEqual(['batlle-maria', 'perez-juan']);
  });

  it('el motivo tiene cinco palabras, y es el mismo para impuestos y vivienda: las dos ya tienen a alguien investigado (con o sin hallazgos)', () => {
    const { propuestas } = construirPropuestas(entrada());
    const deImpuestos = propuestas.find((p) => p.tema === 'impuestos')!;
    const deVivienda = propuestas.find((p) => p.tema === 'vivienda')!;
    expect(deImpuestos.motivo.split(' ')).toHaveLength(5);
    expect(deVivienda.motivo.split(' ')).toHaveLength(5);
    expect(deImpuestos.motivo).toBe(deVivienda.motivo);
  });

  it('un tema sin nadie investigado todavía usa el motivo de tema nuevo', () => {
    // Fixture aparte, mínima: un solo tema y una sola persona, cero corridas.
    const soloPolitico: PoliticoMinimo[] = [{ id: 'solo', nombre: 'Solo', partido: 'X', mandatos: [{ desde: '2015-01-01', cargo: 'Senador de la República' }] }];
    const soloTema: TemaMinimo[] = [{ id: 'nuevo', nombre: 'Nuevo' }];
    const { propuestas } = construirPropuestas({ politicos: soloPolitico, temas: soloTema, registros: [], corridas: [], temasSimetria: [] });
    expect(propuestas).toHaveLength(1);
    expect(propuestas[0]!.motivo).toBe('abre tema todavía sin investigar');
    expect(propuestas[0]!.motivo.split(' ')).toHaveLength(5);
  });

  it('cambiar el partido de una persona no cambia el orden (regla 2: nunca por partido)', () => {
    const base = construirPropuestas(entrada()).propuestas.map((p) => [p.politico, p.tema]);
    const otroPartido = politicos.map((p) => (p.id === 'nunez-ana' ? { ...p, partido: 'Partido Colorado' } : p));
    const cambiado = construirPropuestas(entrada(otroPartido)).propuestas.map((p) => [p.politico, p.tema]);
    expect(cambiado).toEqual(base);
  });

  it('--cargo filtra por la categoría institucional, no por partido ni por cantidad de registros', () => {
    const { propuestas } = construirPropuestas(entrada(), { cargo: 'senador' });
    expect(propuestas.map((p) => p.politico)).toEqual(['nunez-ana']);
  });

  it('--tema restringe a ese tema (y a sus subtemas)', () => {
    const { propuestas } = construirPropuestas(entrada(), { tema: 'vivienda' });
    expect(propuestas.every((p) => p.tema === 'vivienda')).toBe(true);
    expect(propuestas).toHaveLength(2);
  });

  it('cada propuesta trae el comando exacto para lanzarla', () => {
    const { propuestas } = construirPropuestas(entrada());
    const p = propuestas[0]!;
    expect(p.comandoBrief).toBe(`pnpm brief ${p.politico} ${p.tema}`);
    expect(p.comandoInvestigar).toBe(`/investigar ${p.politico} ${p.tema}`);
  });
});
