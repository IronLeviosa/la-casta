/**
 * Motivo por el que un registro queda en `probable`.
 *
 * El motivo se deriva del registro con las mismas condiciones que hace cumplir
 * scripts/validadores/tiers.ts. Lo que se prueba acá es que la explicación que ve el
 * lector coincida con la regla real, y que cuando no se reconoce ninguna condición
 * el sitio lo diga en vez de inventar una.
 */
import { describe, expect, it } from 'vitest';
import { motivosProbable } from '../src/lib/probable.ts';

const grupos = new Map([
  ['el-pais', 'scheck-aguirre'],
  ['el-observador', 'werthein-hochbaum'],
  ['busqueda', 'magnolio'],
  ['presidencia', 'estado-uruguayo'],
]);

const fuente = (medio: string, tipo = 'nota', extra: Record<string, unknown> = {}) => ({ medio, tipo, ...extra });

describe('motivos por los que un registro queda en probable', () => {
  it('una sola fuente', () => {
    const m = motivosProbable('declaraciones', { evidencia: { nivel: 'reportado', fuentes: [fuente('el-pais')] } }, grupos);
    expect(m[0].clave).toBe('una-sola-fuente');
    expect(m[0].texto).toMatch(/un solo medio/);
  });

  it('dos fuentes del mismo grupo cuentan como una y lo dice', () => {
    const m = motivosProbable(
      'declaraciones',
      { evidencia: { nivel: 'reportado', fuentes: [fuente('el-pais'), fuente('el-pais')] } },
      grupos,
    );
    expect(m[0].clave).toBe('mismo-grupo');
    expect(m[0].texto).toContain('scheck-aguirre');
  });

  it('dos grupos distintos no dan motivo de sourcing', () => {
    const m = motivosProbable(
      'declaraciones',
      { evidencia: { nivel: 'reportado', fuentes: [fuente('el-pais'), fuente('el-observador')] } },
      grupos,
    );
    expect(m.map((x) => x.clave)).not.toContain('una-sola-fuente');
    expect(m.map((x) => x.clave)).not.toContain('mismo-grupo');
  });

  it('textual sin fuente primaria', () => {
    const m = motivosProbable('declaraciones', { evidencia: { nivel: 'textual', fuentes: [fuente('el-pais')] } }, grupos);
    expect(m.map((x) => x.clave)).toContain('sin-primaria');
  });

  it('textual con documento oficial no da motivo', () => {
    const m = motivosProbable(
      'declaraciones',
      { evidencia: { nivel: 'textual', fuentes: [fuente('presidencia', 'documento_oficial')] } },
      grupos,
    );
    expect(m.map((x) => x.clave)).not.toContain('sin-primaria');
  });

  it('fuente con verificación manual', () => {
    const m = motivosProbable(
      'declaraciones',
      { evidencia: { nivel: 'reportado', fuentes: [fuente('el-pais'), fuente('el-observador', 'nota', { verificacion: 'manual' })] } },
      grupos,
    );
    expect(m.map((x) => x.clave)).toContain('verificacion-manual');
  });

  it('un caso mira las fuentes de cada etapa de su linea de tiempo judicial', () => {
    // Un caso no tiene `evidencia` arriba: cada etapa lleva la suya, y cualquiera puede frenarlo.
    const m = motivosProbable(
      'casos',
      { estado_judicial: [{ etapa: 'denuncia', evidencia: { nivel: 'reportado', fuentes: [fuente('el-pais'), fuente('el-pais')] } }] },
      grupos,
    );
    expect(m.map((x) => x.clave)).toContain('mismo-grupo');
    expect(m.map((x) => x.clave)).toContain('espera-aprobacion');
  });

  it('el editor puede escribir un hueco que ninguna regla deriva', () => {
    const m = motivosProbable(
      'casos',
      { revision: { que_falta: 'Falta el estado del expediente y el descargo del involucrado.' }, estado_judicial: [] },
      grupos,
    );
    expect(m.map((x) => x.texto)).toContain('Falta el estado del expediente y el descargo del involucrado.');
  });

  it('un caso sin resolver espera la firma de una persona', () => {
    const m = motivosProbable(
      'casos',
      { etiqueta_legal: 'denuncia', evidencia: { nivel: 'reportado', fuentes: [fuente('el-pais'), fuente('el-observador')] } },
      grupos,
    );
    expect(m.map((x) => x.clave)).toContain('espera-aprobacion');
  });

  it('un caso ya resuelto por la justicia no espera firma', () => {
    // Si un tribunal condenó o archivó, el hecho es público y firmado por quien correspondía.
    // Una firma nuestra no agregaría criterio, solo demora.
    for (const etiqueta of ['condena', 'cerrado_sin_condena']) {
      const m = motivosProbable(
        'casos',
        { etiqueta_legal: etiqueta, evidencia: { nivel: 'reportado', fuentes: [fuente('el-pais'), fuente('el-observador')] } },
        grupos,
      );
      expect(m.map((x) => x.clave)).not.toContain('espera-aprobacion');
    }
  });

  it('un giro cambio_total sin explicación espera la firma', () => {
    const m = motivosProbable('giros', { cambio: 'cambio_total', explicacion: 'sin_explicacion' }, grupos);
    expect(m.map((x) => x.clave)).toContain('espera-aprobacion');
  });

  it('un chequeo verde o rojo sin documento oficial', () => {
    const m = motivosProbable(
      'chequeos',
      { calificacion: 'falso', dato_real: { fuentes: [fuente('el-pais')] }, evidencia: { nivel: 'reportado', fuentes: [fuente('el-pais'), fuente('el-observador')] } },
      grupos,
    );
    expect(m.map((x) => x.clave)).toContain('sin-documento-oficial');
  });

  it('un veto sin desenlace documentado', () => {
    const m = motivosProbable('vetos', { resultado: { estado: 'sin_datos' }, evidencia: { nivel: 'textual', fuentes: [fuente('presidencia', 'documento_oficial')] } }, grupos);
    expect(m[0].texto).toMatch(/desenlace/);
  });

  it('la promesa mira también su evidencia de origen', () => {
    const m = motivosProbable('promesas', { origen: { nivel: 'reportado', fuentes: [fuente('busqueda')] } }, grupos);
    expect(m[0].clave).toBe('una-sola-fuente');
  });

  it('un giro hereda el estado de la declaración en la que se apoya', () => {
    const probables = new Map([['declaraciones', new Set(['orsi/2024-11-17-no-vamos-aumentar-impuestos'])]]);
    const m = motivosProbable(
      'giros',
      { cambio: 'cambio_parcial', explicacion: 'sin_explicacion', declaracion_antes: { id: 'orsi/2024-11-17-no-vamos-aumentar-impuestos' }, declaracion_despues: { id: 'orsi/otra' } },
      grupos,
      probables,
    );
    expect(m.map((x) => x.clave)).toContain('depende-de-otro');
    expect(m[0].texto).toMatch(/declaración anterior/);
  });

  it('una promesa mira también la evidencia de cada hecho posterior', () => {
    const m = motivosProbable(
      'promesas',
      {
        origen: { nivel: 'reportado', fuentes: [fuente('el-pais'), fuente('el-observador')] },
        evidencias: [{ evidencia: { nivel: 'reportado', fuentes: [fuente('busqueda')] } }],
      },
      grupos,
    );
    expect(m.map((x) => x.clave)).toContain('una-sola-fuente');
  });

  it('si no se reconoce ninguna condición, lo dice en vez de inventar', () => {
    const m = motivosProbable('declaraciones', { evidencia: { nivel: 'reportado', fuentes: [fuente('el-pais'), fuente('el-observador')] } }, grupos);
    expect(m).toHaveLength(1);
    expect(m[0].clave).toBe('otro');
  });

  it('no repite el mismo motivo dos veces', () => {
    const m = motivosProbable(
      'promesas',
      { evidencia: { nivel: 'reportado', fuentes: [fuente('el-pais')] }, origen: { nivel: 'reportado', fuentes: [fuente('el-pais')] } },
      grupos,
    );
    expect(m.filter((x) => x.clave === 'una-sola-fuente')).toHaveLength(1);
  });
});
