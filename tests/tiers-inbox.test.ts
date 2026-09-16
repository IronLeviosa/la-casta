/**
 * Etapa `tiers` del validador en modo `--inbox` (scripts/validadores/tiers.ts): el nivel de
 * evidencia ("reportado" con un solo grupo de medios, "textual" sin registro primario, "inferencia"
 * sin cadena) es aviso salvo que el crudo traiga `revision.tier: publicado` explícito —lo puso el
 * editor—, en cuyo caso vale como error, la misma regla que rige en content/. Antes de este cambio
 * era siempre aviso en modo inbox, y un registro que el editor ya había marcado `publicado` podía
 * pasar `validar --inbox --red` limpio y fallar recién después de que `promover` lo escribiera en
 * content/ (defecto real de la corrida de Astori, 2026-09-16).
 *
 * Se prueba `validarTiers()` directo con un `Contenido` armado a mano (mismo patrón que
 * tests/presentacion-validador.test.ts): un registro mínimo, sin pasar por Zod, alcanza para esta
 * regla puntual.
 */
import { describe, expect, it } from 'vitest';
import { construirContenido, type Registro } from '../scripts/lib/contenido.ts';
import { validarTiers } from '../scripts/validadores/tiers.ts';

/** Registro mínimo en modo inbox: `datos` es lo que ya validó Zod (con placeholders); `crudo` es el YAML tal cual lo escribió el investigador o el editor. */
function regInbox(id: string, datos: Record<string, any>, crudo: Record<string, any>): Registro {
  return { coleccion: 'declaraciones', id, archivo: `inbox/testpol/economia/2026-09-16/declaraciones.yaml#0 (${id})`, datos, crudo, enInbox: true };
}

const MEDIO_EL_PAIS: Registro = {
  coleccion: 'medios',
  id: 'el-pais',
  archivo: 'content/medios/el-pais.yaml',
  datos: { grupo: 'scheck-aguirre' },
  crudo: { grupo: 'scheck-aguirre' },
  enInbox: false,
};

/** Evidencia "reportado" con una sola fuente: un solo grupo de medios resuelto, la regla que se prueba. */
const EVIDENCIA_UN_SOLO_GRUPO = {
  evidencia: {
    nivel: 'reportado',
    fuentes: [{ url: 'https://ejemplo.uy/nota', medio: 'el-pais', fecha: '2026-09-01', tipo: 'nota', cita: 'Una cita de más de veinte caracteres para pasar el largo mínimo.' }],
  },
};

describe('validarTiers en modo --inbox: nivel de evidencia según el tier explícito del crudo', () => {
  it('con revision.tier: publicado explícito en el crudo, "reportado" con un solo grupo es error', () => {
    const crudo = { ...EVIDENCIA_UN_SOLO_GRUPO, revision: { tier: 'publicado' } };
    // `datos` simula lo que devuelve normalizarRegistroInbox + Zod: mismo revision.tier explícito.
    const registro = regInbox('publicado', crudo, crudo);
    const contenido = construirContenido('/fake-root', [MEDIO_EL_PAIS, registro], [], 2);

    const r = validarTiers(contenido, { modoInbox: true });

    expect(r.errores.some((e) => e.mensaje.includes('un solo grupo de medios'))).toBe(true);
    expect(r.avisos.some((a) => a.mensaje.includes('un solo grupo de medios'))).toBe(false);
  });

  it('sin revision.tier en el crudo (el investigador no lo asigna: regla 7), el mismo problema es aviso', () => {
    // El crudo no trae `revision` (como entrega el investigador); `datos` sí lo tiene, con el
    // placeholder `probable` que normalizarRegistroInbox le pone solo para poder validar.
    const crudo = { ...EVIDENCIA_UN_SOLO_GRUPO };
    const datos = { ...EVIDENCIA_UN_SOLO_GRUPO, revision: { tier: 'probable' } };
    const registro = regInbox('sin-tier', datos, crudo);
    const contenido = construirContenido('/fake-root', [MEDIO_EL_PAIS, registro], [], 2);

    const r = validarTiers(contenido, { modoInbox: true });

    expect(r.avisos.some((a) => a.mensaje.includes('un solo grupo de medios'))).toBe(true);
    expect(r.errores.some((e) => e.mensaje.includes('un solo grupo de medios'))).toBe(false);
  });

  it('con revision.tier: probable explícito (el editor todavía no lo publicó), sigue siendo aviso', () => {
    const crudo = { ...EVIDENCIA_UN_SOLO_GRUPO, revision: { tier: 'probable' } };
    const registro = regInbox('probable-explicito', crudo, crudo);
    const contenido = construirContenido('/fake-root', [MEDIO_EL_PAIS, registro], [], 2);

    const r = validarTiers(contenido, { modoInbox: true });

    expect(r.avisos.some((a) => a.mensaje.includes('un solo grupo de medios'))).toBe(true);
    expect(r.errores.some((e) => e.mensaje.includes('un solo grupo de medios'))).toBe(false);
  });
});
