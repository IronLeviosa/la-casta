/**
 * La insignia de diversidad avisa «un solo grupo de propiedad» solo sobre evidencia `reportado`,
 * que es donde rige la regla de dos grupos. La promesa de Astori de 2005, textual y apoyada en el
 * texto de Presidencia, salía con ⚠ como si dependiera de un diario (2026-09-16): el aviso hacía
 * desconfiar del registro más firme del sitio.
 */
import { describe, expect, it } from 'vitest';
import { avisoDeDiversidad, calcularDiversidad, type PerfilMedio } from '../src/lib/diversidad.ts';

const medios = new Map<string, PerfilMedio>([
  ['presidencia', { grupo: 'estado-uruguayo', alineamiento: 'estatal' }],
  ['el-pais', { grupo: 'grupo-el-pais', alineamiento: 'centro-derecha' }],
  ['el-observador', { grupo: 'grupo-observador', alineamiento: 'centro-derecha' }],
  ['montevideo-portal', { grupo: 'grupo-el-pais', alineamiento: 'centro' }],
]);

describe('calcularDiversidad()', () => {
  it('cuenta medios, grupos y alineamientos y avisa con menos de dos grupos', () => {
    const d = calcularDiversidad([{ medio: 'el-pais' }, { medio: 'montevideo-portal' }], medios);
    expect(d).toMatchObject({ medios: 2, grupos: 1, alineamientos: 2, advertencia: true, desconocidos: [] });
    expect(calcularDiversidad([{ medio: 'el-pais' }, { medio: 'el-observador' }], medios).advertencia).toBe(false);
  });

  it('lista los medios que no están en el mapa sin contarlos como grupo', () => {
    const d = calcularDiversidad([{ medio: 'el-pais' }, { medio: { id: 'inexistente' } }], medios);
    expect(d.desconocidos).toEqual(['inexistente']);
    expect(d.grupos).toBe(1);
  });
});

describe('avisoDeDiversidad()', () => {
  const unGrupo = calcularDiversidad([{ medio: 'presidencia' }], medios);
  const dosGrupos = calcularDiversidad([{ medio: 'el-pais' }, { medio: 'el-observador' }], medios);

  it('avisa sobre lo reportado con un solo grupo, y sin nivel conserva el aviso', () => {
    expect(avisoDeDiversidad(unGrupo, 'reportado')).toBe(true);
    expect(avisoDeDiversidad(unGrupo)).toBe(true);
  });

  it('no avisa sobre un registro textual ni sobre una inferencia con un solo grupo', () => {
    expect(avisoDeDiversidad(unGrupo, 'textual')).toBe(false);
    expect(avisoDeDiversidad(unGrupo, 'inferencia')).toBe(false);
  });

  it('nunca avisa con dos grupos', () => {
    expect(avisoDeDiversidad(dosGrupos, 'reportado')).toBe(false);
    expect(avisoDeDiversidad(dosGrupos, 'textual')).toBe(false);
  });
});
