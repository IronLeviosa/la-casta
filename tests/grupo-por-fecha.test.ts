/**
 * Grupo de propiedad por fecha (docs/plan-grupo-por-fecha.md).
 *
 * El grupo de un medio no siempre fue el mismo, y la regla de "reportado" (≥ 2 fuentes de distinto
 * grupo) se evalúa con el grupo que el medio tenía **en la fecha de cada fuente**, no con el
 * vigente. Lo dispara el caso real de El Observador: `content/medios/el-observador.yaml` dice
 * `grupo: werthein-hochbaum`, pero ese grupo controla el diario recién desde el 5 de mayo de 2022;
 * toda nota anterior a esa fecha en realidad era de Peirano.
 *
 * Cuatro capas, de abajo hacia arriba: el esquema (`src/schemas/medio.ts`), la función compartida
 * `grupoEnFecha`/`claveDeGrupo` (`src/lib/diversidad.ts`), sus dos consumidores (`calcularDiversidad`
 * para las insignias del sitio, `motivosProbable` para el banner de `/probable/`) y el validador
 * (`scripts/validadores/tiers.ts`), que es quien de verdad bloquea la publicación.
 */
import { describe, expect, it } from 'vitest';
import { esquemasPorColeccion } from '../src/schemas/comunes';
import { calcularDiversidad, claveDeGrupo, grupoEnFecha, type PerfilMedio, type TramoGrupo } from '../src/lib/diversidad.ts';
import { motivosProbable } from '../src/lib/probable.ts';
import { construirContenido, type Registro } from '../scripts/lib/contenido.ts';
import { validarTiers } from '../scripts/validadores/tiers.ts';

/** Fuente mínima válida contra el esquema: 20+ caracteres de cita, retrieved_at, etc. */
function fuente(fecha: string, extra: Record<string, unknown> = {}) {
  return {
    url: 'https://ejemplo.uy/nota',
    medio: 'el-observador',
    tipo: 'nota' as const,
    cita: 'Una cita de más de veinte caracteres para pasar el largo mínimo del esquema.',
    retrieved_at: '2026-09-16',
    fecha,
    ...extra,
  };
}

// ---------------------------------------------------------------------------
// Esquema: src/schemas/medio.ts
// ---------------------------------------------------------------------------

const TRAMO_PEIRANO = {
  grupo: 'peirano',
  desde: '1991-10-22',
  hasta: '2022-05-04',
  fuentes: [fuente('2019-01-01', { medio: 'wikipedia', titulo: 'Historia de El Observador' })],
};

const TRAMO_WERTHEIN = {
  grupo: 'werthein-hochbaum',
  desde: '2022-05-05',
  fuentes: [fuente('2022-05-11', { titulo: 'El Observador cambia de accionistas' })],
};

const MEDIO_BASE = {
  nombre: 'El Observador',
  tipo: 'diario' as const,
  grupo: 'werthein-hochbaum',
  url: 'https://www.elobservador.com.uy',
  propiedad: {
    descripcion: 'Fundado en 1991 por Ricardo Peirano; desde el 5 de mayo de 2022 el control es de Werthein y Hochbaum.',
    fuentes: [fuente('2022-05-11', { titulo: 'El Observador cambia de accionistas' })],
  },
  alineamiento: {
    etiqueta: 'sin_datos' as const,
    justificacion: 'No se encontró vínculo partidario documentado.',
    fuentes: [fuente('2022-05-11', { titulo: 'El Observador cambia de accionistas' })],
  },
  revision: { tier: 'publicado' as const },
};

function parseMedio(extra: Record<string, unknown> = {}) {
  return esquemasPorColeccion.medios.safeParse({ ...MEDIO_BASE, ...extra });
}

describe('esquema de medio: grupo_historial', () => {
  it('sin grupo_historial sigue siendo válido: nada cambia para los medios de hoy', () => {
    expect(parseMedio().success).toBe(true);
  });

  it('acepta un medio con dos tramos ordenados, sin solaparse, y el grupo vigente igual al último', () => {
    const r = parseMedio({ grupo_historial: [TRAMO_PEIRANO, TRAMO_WERTHEIN] });
    expect(r.success).toBe(true);
  });

  it('rechaza tramos solapados', () => {
    // "hasta" de Peirano pisa el "desde" de Werthein (2022-05-05).
    const solapado = { ...TRAMO_PEIRANO, hasta: '2022-05-10' };
    const r = parseMedio({ grupo_historial: [solapado, TRAMO_WERTHEIN] });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues.some((i) => i.message.includes('no pueden solaparse'))).toBe(true);
  });

  it('rechaza "grupo" (el vigente) distinto del grupo del último tramo', () => {
    const r = parseMedio({ grupo: 'otro-grupo', grupo_historial: [TRAMO_PEIRANO, TRAMO_WERTHEIN] });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues.some((i) => i.message.includes('tiene que coincidir con el grupo del último tramo'))).toBe(true);
  });

  it('rechaza tramos fuera de orden (desde no creciente)', () => {
    const r = parseMedio({ grupo_historial: [TRAMO_WERTHEIN, TRAMO_PEIRANO] });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues.some((i) => i.message.includes('ordenados por'))).toBe(true);
  });

  it('rechaza un tramo sin fuentes si el grupo no es "desconocido"', () => {
    const r = parseMedio({ grupo_historial: [{ ...TRAMO_PEIRANO, fuentes: [] }, TRAMO_WERTHEIN] });
    expect(r.success).toBe(false);
  });

  it('acepta un tramo "desconocido" sin fuentes, antes de la historia documentada', () => {
    const desconocido = { grupo: 'desconocido', desde: '1972-01-01', hasta: '1991-10-21', fuentes: [] };
    const r = parseMedio({ grupo_historial: [desconocido, TRAMO_PEIRANO, TRAMO_WERTHEIN] });
    expect(r.success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// src/lib/diversidad.ts: grupoEnFecha, claveDeGrupo
// ---------------------------------------------------------------------------

const HISTORIAL_EL_OBSERVADOR: TramoGrupo[] = [
  { grupo: 'peirano', desde: '1991-10-22', hasta: '2022-05-04' },
  { grupo: 'werthein-hochbaum', desde: '2022-05-05' },
];

const PERFIL_EL_OBSERVADOR: PerfilMedio = { grupo: 'werthein-hochbaum', alineamiento: 'sin_datos', historial: HISTORIAL_EL_OBSERVADOR };

describe('grupoEnFecha()', () => {
  it('devuelve el tramo que contiene la fecha', () => {
    expect(grupoEnFecha(PERFIL_EL_OBSERVADOR, '2019-01-01')).toEqual({ grupo: 'peirano', documentado: true });
    expect(grupoEnFecha(PERFIL_EL_OBSERVADOR, '2022-05-04')).toEqual({ grupo: 'peirano', documentado: true });
    expect(grupoEnFecha(PERFIL_EL_OBSERVADOR, '2022-05-05')).toEqual({ grupo: 'werthein-hochbaum', documentado: true });
    expect(grupoEnFecha(PERFIL_EL_OBSERVADOR, '2026-01-01')).toEqual({ grupo: 'werthein-hochbaum', documentado: true });
  });

  it('sin historial, el grupo vigente vale para toda fecha', () => {
    expect(grupoEnFecha({ grupo: 'magnolio' }, '1980-01-01')).toEqual({ grupo: 'magnolio', documentado: true });
  });

  it('una fecha fuera de todo tramo es "desconocido" y queda sin documentar', () => {
    expect(grupoEnFecha(PERFIL_EL_OBSERVADOR, '1980-01-01')).toEqual({ grupo: 'desconocido', documentado: false });
  });
});

describe('claveDeGrupo()', () => {
  it('"desconocido" no coincide entre medios distintos', () => {
    expect(claveDeGrupo('medio-a', 'desconocido')).not.toBe(claveDeGrupo('medio-b', 'desconocido'));
  });
  it('"desconocido" sí coincide dentro del mismo medio', () => {
    expect(claveDeGrupo('medio-a', 'desconocido')).toBe(claveDeGrupo('medio-a', 'desconocido'));
  });
  it('un grupo real no se namespacea', () => {
    expect(claveDeGrupo('medio-a', 'peirano')).toBe('peirano');
  });
});

// ---------------------------------------------------------------------------
// src/lib/diversidad.ts: calcularDiversidad con fecha por fuente
// ---------------------------------------------------------------------------

describe('calcularDiversidad() con fecha por fuente', () => {
  // "busqueda" hoy comparte el grupo vigente de El Observador, pero no tiene historial cargado.
  const medios = new Map<string, PerfilMedio>([
    ['el-observador', PERFIL_EL_OBSERVADOR],
    ['busqueda', { grupo: 'werthein-hochbaum', alineamiento: 'sin_datos' }],
  ]);

  it('dos notas del mismo medio, antes y después del cambio de dueño, cuentan como dos grupos', () => {
    const d = calcularDiversidad(
      [
        { medio: 'el-observador', fecha: '2019-01-01' },
        { medio: 'el-observador', fecha: '2023-01-01' },
      ],
      medios,
    );
    expect(d.grupos).toBe(2);
    expect(d.advertencia).toBe(false);
  });

  it('dos medios que hoy comparten grupo pero no lo compartían en la fecha de las notas cuentan como dos', () => {
    // En 2019 El Observador era de Peirano; Búsqueda (sin historial) ya contaba como werthein-hochbaum.
    const d = calcularDiversidad(
      [
        { medio: 'el-observador', fecha: '2019-01-01' },
        { medio: 'busqueda', fecha: '2019-01-01' },
      ],
      medios,
    );
    expect(d.grupos).toBe(2);
    expect(d.advertencia).toBe(false);
  });

  it('sin fecha en la fuente, se usa el grupo vigente (comportamiento de siempre)', () => {
    const d = calcularDiversidad([{ medio: 'el-observador' }, { medio: 'busqueda' }], medios);
    expect(d.grupos).toBe(1);
    expect(d.advertencia).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// src/lib/probable.ts: motivosProbable con historialPorMedio
// ---------------------------------------------------------------------------

describe('motivosProbable() con historialPorMedio', () => {
  const grupoPorMedio = new Map([
    ['el-observador', 'werthein-hochbaum'],
    ['busqueda', 'werthein-hochbaum'],
  ]);
  const historialPorMedio = new Map([['el-observador', HISTORIAL_EL_OBSERVADOR]]);
  const evidenciaDosMil19 = {
    evidencia: {
      nivel: 'reportado',
      fuentes: [fuente('2019-01-01', { medio: 'el-observador' }), fuente('2019-01-01', { medio: 'busqueda' })],
    },
  };

  it('sin historialPorMedio, dos fuentes que hoy comparten grupo dan "mismo-grupo" (comportamiento de siempre)', () => {
    const m = motivosProbable('declaraciones', evidenciaDosMil19, grupoPorMedio);
    expect(m.map((x) => x.clave)).toContain('mismo-grupo');
  });

  it('con historialPorMedio, la misma evidencia deja de ser "mismo-grupo": en 2019 eran grupos distintos', () => {
    const m = motivosProbable('declaraciones', evidenciaDosMil19, grupoPorMedio, new Map(), historialPorMedio);
    expect(m.map((x) => x.clave)).not.toContain('mismo-grupo');
  });
});

// ---------------------------------------------------------------------------
// scripts/validadores/tiers.ts: el validador de verdad
// ---------------------------------------------------------------------------

describe('validarTiers(): "reportado" evalúa el grupo a la fecha de cada fuente', () => {
  const MEDIO_EL_OBSERVADOR: Registro = {
    coleccion: 'medios',
    id: 'el-observador',
    archivo: 'content/medios/el-observador.yaml',
    datos: { grupo: 'werthein-hochbaum', grupo_historial: HISTORIAL_EL_OBSERVADOR },
    crudo: { grupo: 'werthein-hochbaum', grupo_historial: HISTORIAL_EL_OBSERVADOR },
    enInbox: true,
  };

  function regInbox(id: string, datos: Record<string, any>): Registro {
    return { coleccion: 'declaraciones', id, archivo: `inbox/testpol/economia/2026-09-16/declaraciones.yaml#0 (${id})`, datos, crudo: datos, enInbox: true };
  }

  it('dos notas del mismo medio, antes y después del cambio de dueño, cuentan como dos grupos: sin error ni aviso de "un solo grupo"', () => {
    const datos = {
      revision: { tier: 'publicado' },
      evidencia: {
        nivel: 'reportado',
        fuentes: [fuente('2019-01-01', { medio: 'el-observador', titulo: 'Nota vieja' }), fuente('2023-01-01', { medio: 'el-observador', titulo: 'Nota nueva' })],
      },
    };
    const contenido = construirContenido('/fake-root', [MEDIO_EL_OBSERVADOR, regInbox('dos-eras', datos)], [], 2);
    const r = validarTiers(contenido, { modoInbox: true });
    expect(r.errores.some((e) => e.mensaje.includes('un solo grupo de medios'))).toBe(false);
    expect(r.avisos.some((a) => a.mensaje.includes('un solo grupo de medios'))).toBe(false);
  });

  it('una fecha fuera de la historia documentada del medio deja aviso', () => {
    const datos = {
      revision: { tier: 'publicado' },
      evidencia: {
        nivel: 'reportado',
        fuentes: [
          fuente('1980-01-01', { medio: 'el-observador', titulo: 'Nota muy vieja, antes de toda historia documentada' }),
          fuente('2023-01-01', { medio: 'el-observador', titulo: 'Nota nueva' }),
        ],
      },
    };
    const contenido = construirContenido('/fake-root', [MEDIO_EL_OBSERVADOR, regInbox('fuera-de-historia', datos)], [], 2);
    const r = validarTiers(contenido, { modoInbox: true });
    expect(r.avisos.some((a) => a.mensaje.includes('cae fuera de la historia de propiedad documentada'))).toBe(true);
  });

  it('sin grupo_historial en el medio, el comportamiento es el de siempre (grupo vigente para toda fecha)', () => {
    const medioSinHistorial: Registro = { ...MEDIO_EL_OBSERVADOR, datos: { grupo: 'werthein-hochbaum' }, crudo: { grupo: 'werthein-hochbaum' } };
    const datos = {
      revision: { tier: 'publicado' },
      evidencia: {
        nivel: 'reportado',
        fuentes: [fuente('2019-01-01', { medio: 'el-observador', titulo: 'Nota vieja' })],
      },
    };
    const contenido = construirContenido('/fake-root', [medioSinHistorial, regInbox('un-solo-grupo', datos)], [], 2);
    const r = validarTiers(contenido, { modoInbox: true });
    expect(r.errores.some((e) => e.mensaje.includes('un solo grupo de medios'))).toBe(true);
    expect(r.avisos.some((a) => a.mensaje.includes('cae fuera de la historia de propiedad documentada'))).toBe(false);
  });
});
