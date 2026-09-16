/**
 * `pnpm corpus:buscar --consultas <ruta>`: la línea de consultas.jsonl la escribe la herramienta,
 * con la misma convención que los agentes usaban a mano («corpus:buscar "…" --desde …»).
 */
import { describe, expect, it } from 'vitest';
import { describirBusqueda, lineaConsultaBusqueda } from '../scripts/corpus/buscar.ts';

describe('describirBusqueda', () => {
  it('escribe el comando tal como se corrió, con la consulta entre comillas y los filtros en orden fijo', () => {
    expect(describirBusqueda('Batlle impuestos IRPF', { desde: '2020-01-01', hasta: '2024-12-31', politico: 'batlle' })).toBe(
      'corpus:buscar "Batlle impuestos IRPF" --politico batlle --desde 2020-01-01 --hasta 2024-12-31',
    );
  });

  it('sin filtros, solo la consulta; con --crudo lo dice al final', () => {
    expect(describirBusqueda('ajuste fiscal', {})).toBe('corpus:buscar "ajuste fiscal"');
    expect(describirBusqueda('"ajuste fiscal" NOT 2002', { crudo: true, limite: 50 })).toBe('corpus:buscar "\\"ajuste fiscal\\" NOT 2002" --limite 50 --crudo');
  });
});

describe('lineaConsultaBusqueda', () => {
  it('es una línea JSON con hora real, tipo busqueda, el comando y la cantidad de resultados', () => {
    const momento = new Date('2026-09-16T14:42:20.123Z');
    const linea = JSON.parse(lineaConsultaBusqueda('Batlle impuestos', { tema: 'economia/impuestos' }, 7, momento));
    expect(linea).toEqual({ t: '2026-09-16T14:42:20.123Z', tipo: 'busqueda', q: 'corpus:buscar "Batlle impuestos" --tema economia/impuestos', resultado: '7 resultado(s)' });
  });

  it('cero resultados se escribe como "sin resultados", igual que la salida por pantalla', () => {
    expect(JSON.parse(lineaConsultaBusqueda('nada', {}, 0)).resultado).toBe('sin resultados');
  });
});
