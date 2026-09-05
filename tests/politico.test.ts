/**
 * Reglas del esquema de político que deciden a quién puede documentar el sitio.
 *
 * La que se prueba acá cambió por un caso real: Edgardo Novick encabezó un lema en 2019 que obtuvo
 * una banca en Diputados, y él mismo nunca ejerció ningún cargo. El esquema exigía al menos un
 * mandato, así que no había forma de cargarlo sin inventarle uno. Excluirlo no lo vuelve menos
 * parte de esa elección: lo vuelve invisible en el cuadro que el sitio dice mostrar completo.
 */
import { describe, expect, it } from 'vitest';
import { crearPoliticoSchema } from '../src/schemas/politico.ts';
import { z } from 'astro/zod';

const schema = crearPoliticoSchema({ ref: () => z.string() } as never);

const fuente = {
  url: 'https://example.org/nota',
  medio: 'el-observador',
  fecha: '2019-10-27',
  tipo: 'nota',
  titulo: 'Una nota',
  cita: 'una cita literal de más de veinte caracteres',
  retrieved_at: '2026-09-05',
};

const base = {
  nombre: 'Nombre Completo',
  nombre_corto: 'Nombre',
  partido: 'Partido de la Gente',
  wikidata: 'Q123',
  alias: ['Nombre'],
  estado_actual: { situacion: 'fuera_de_cargo' as const },
  revision: { tier: 'publicado' as const },
};

const candidatura = {
  cargo: 'Presidencia de la República',
  fecha: '2019-10-27',
  lema: 'Partido de la Gente',
  resultado: 'no_electo' as const,
  fuentes: [fuente],
};

const mandato = { cargo: 'Senador de la República', desde: '2015-02-15', hasta: '2020-02-15', fuentes: [fuente] };

describe('crearPoliticoSchema()', () => {
  it('acepta a quien solo fue candidato y nunca ejerció un cargo', () => {
    const r = schema.safeParse({ ...base, mandatos: [], candidaturas: [candidatura] });
    expect(r.success).toBe(true);
  });

  it('rechaza a quien no tiene ni mandatos ni candidaturas', () => {
    const r = schema.safeParse({ ...base, mandatos: [] });
    expect(r.success).toBe(false);
    if (!r.success) expect(JSON.stringify(r.error.issues)).toContain('al menos un mandato ejercido o una candidatura');
  });

  it('no le exige una salida a quien nunca ejerció un cargo', () => {
    // Exigirla obliga a inventar un hecho para que el registro pase.
    const r = schema.safeParse({ ...base, mandatos: [], candidaturas: [candidatura] });
    expect(r.success).toBe(true);
  });

  it('sí le exige una salida a quien ejerció un cargo y ya no está', () => {
    const r = schema.safeParse({ ...base, mandatos: [mandato] });
    expect(r.success).toBe(false);
    if (!r.success) expect(JSON.stringify(r.error.issues)).toContain('se requiere salida');
  });

  it('acepta fechas de mandato con precisión de año', () => {
    const r = schema.safeParse({
      ...base,
      estado_actual: { situacion: 'en_cargo' as const },
      mandatos: [{ cargo: 'Director del INAME', desde: '1990', hasta: '1995', fuentes: [fuente] }],
    });
    expect(r.success).toBe(true);
  });
});
