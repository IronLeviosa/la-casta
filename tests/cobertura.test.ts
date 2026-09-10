/**
 * Conteo de "combinaciones de persona y tema investigadas": el número que
 * /cobertura/ muestra como denominador de todo el sitio (docs/plan-2026-09.md,
 * ítem 2.1). El bug era que /cobertura/ lo contaba aparte, sobre las carpetas
 * de data/corridas/, mientras cada ficha lo contaba sobre los registros
 * publicados: dos cálculos del mismo número, uno de los cuales daba 0 apenas
 * `listarCorridas` no encontraba ninguna carpeta (ver el arreglo de
 * `raizRepo()` en src/lib/cobertura.ts). Este archivo fija que el conteo sale
 * de `calcularCobertura` una sola vez, y que ni una corrida de identidad (sin
 * persona ni tema en el nombre, como las de reconstrucción de suplentes) ni
 * un registro de corrección sin carpeta propia lo rompen.
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { calcularCobertura, listarCorridas, type EntradaCobertura, type RegistroMinimo } from '../src/lib/cobertura.ts';

const POLITICOS = ['lacalle-pou', 'segundo-politico'];
const TEMAS = ['vetos', 'impuestos', 'inflacion'];

let raiz: string;

beforeAll(() => {
  raiz = fs.mkdtempSync(path.join(os.tmpdir(), 'cobertura-'));
  // Corrida con persona y tema: se buscó y no salió nada publicable ("investigado, sin hallazgos").
  fs.mkdirSync(path.join(raiz, 'data', 'corridas', '2026-09-04-lacalle-pou-vetos'), { recursive: true });
  fs.writeFileSync(path.join(raiz, 'data', 'corridas', '2026-09-04-lacalle-pou-vetos', 'agentes.json'), '{}');
  // Corrida de identidad: reconstrucción de suplentes por script (item 1.7/1.3 del plan), sin
  // persona ni tema reconocibles en el nombre. listarCorridas tiene que descartarla, no contarla.
  fs.mkdirSync(path.join(raiz, 'data', 'corridas', '2026-09-09-diputados-suplentes-1'), { recursive: true });
  fs.writeFileSync(path.join(raiz, 'data', 'corridas', '2026-09-09-diputados-suplentes-1', 'agentes.json'), '{}');
});
afterAll(() => fs.rmSync(raiz, { recursive: true, force: true }));

/** Entrada de prueba: 2 políticos x 3 temas hoja, sin jerarquía. */
function entrada(): EntradaCobertura {
  const corridas = listarCorridas(POLITICOS, TEMAS, raiz);
  const registros: RegistroMinimo[] = [
    // Registro de corrección: no tiene carpeta de corrida propia en data/corridas/. La procedencia
    // por corrección (tipo: 'correccion') no trae fecha ni id de corrida (src/schemas/base.ts,
    // PorCorreccion), así que acá no hay fecha de investigación que leer.
    {
      coleccion: 'declaraciones',
      id: 'impuestos-1',
      politicos: ['lacalle-pou'],
      tema: 'impuestos',
      fecha: '2019-01-01',
      procedencia: { tipo: 'correccion', correccion: '2026-09-06-titulos-declaraciones' },
    },
    // Registro cuya corrida no está (o ya no está) en data/corridas/ de este fixture: "Investigado
    // el" tiene que leer la fecha de la propia procedencia del registro, no solo de la carpeta.
    {
      coleccion: 'declaraciones',
      id: 'inflacion-1',
      politicos: ['lacalle-pou'],
      tema: 'inflacion',
      fecha: '2020-05-01',
      procedencia: {
        corrida: '2020-05-01-lacalle-pou-inflacion',
        agente: 'investigador',
        agente_sha: 'a'.repeat(64),
        modelo: 'claude-sonnet-5',
        brief_sha: 'b'.repeat(64),
        fecha: '2020-05-01',
      },
    },
  ];
  return {
    politicos: POLITICOS.map((id) => ({ id, partido: 'Partido de prueba', mandatos: [{ desde: '2015-01-01', hasta: '2025-01-01' }] })),
    temas: TEMAS.map((id) => ({ id })),
    registros,
    corridas,
  };
}

describe('listarCorridas', () => {
  it('descarta la corrida de identidad: no tiene persona ni tema reconocibles en el nombre', () => {
    const corridas = listarCorridas(POLITICOS, TEMAS, raiz);
    expect(corridas.map((c) => c.id)).toEqual(['2026-09-04-lacalle-pou-vetos']);
  });
});

describe('calcularCobertura: combinaciones de persona y tema investigadas', () => {
  it('cuenta 3 combinaciones investigadas sobre un denominador de 6 (2 personas x 3 temas)', () => {
    const resumen = calcularCobertura(entrada());
    expect(resumen.total_temas_hoja).toBe(3);
    expect(resumen.total_combinaciones).toBe(6);
    // 1 (vetos: investigado sin hallazgos, por la corrida) + 2 (impuestos e inflación: con
    // registros, ninguno con corrida propia) = 3. Es la misma cuenta que hace cada ficha con
    // `temas_investigados.length`, sumada sobre las dos personas: nunca un número aparte.
    expect(resumen.combinaciones_investigadas).toBe(3);
    const sumaPorPersona = resumen.politicos.reduce((n, p) => n + p.temas_investigados.length, 0);
    expect(sumaPorPersona).toBe(resumen.combinaciones_investigadas);
  });

  it('un político sin corridas ni registros no suma ninguna combinación investigada', () => {
    const resumen = calcularCobertura(entrada());
    const segundo = resumen.politicos.find((p) => p.politico === 'segundo-politico')!;
    expect(segundo.temas_investigados).toEqual([]);
  });

  it('"Investigado el" sale de la fecha de la corrida cuando hay carpeta en data/corridas/', () => {
    const resumen = calcularCobertura(entrada());
    const lp = resumen.politicos.find((p) => p.politico === 'lacalle-pou')!;
    const vetos = lp.celdas.find((c) => c.tema === 'vetos')!;
    expect(vetos.estado).toBe('investigado_sin_hallazgos');
    expect(vetos.investigadoEl).toBe('2026-09-04');
  });

  it('"Investigado el" sale de procedencia.fecha del registro cuando no hay carpeta de corrida', () => {
    const resumen = calcularCobertura(entrada());
    const lp = resumen.politicos.find((p) => p.politico === 'lacalle-pou')!;
    const inflacion = lp.celdas.find((c) => c.tema === 'inflacion')!;
    expect(inflacion.estado).toBe('con_registros');
    expect(inflacion.investigadoEl).toBe('2020-05-01');
  });

  it('un registro de corrección sin fecha ni corrida en su procedencia cuenta como investigado, pero sin fecha', () => {
    const resumen = calcularCobertura(entrada());
    const lp = resumen.politicos.find((p) => p.politico === 'lacalle-pou')!;
    const impuestos = lp.celdas.find((c) => c.tema === 'impuestos')!;
    expect(impuestos.estado).toBe('con_registros');
    expect(impuestos.investigadoEl).toBeNull();
  });
});
