/**
 * Marcas del Veracímetro dentro del texto: el fragmento se localiza exacto (salvo espacios), una
 * sola vez, sin pisarse con otro, y si no está no se marca nada.
 */
import { describe, expect, it } from 'vitest';
import { fragmentoEsta, partirEnFragmentos } from '../src/lib/fragmentos';
import { crearFuenteSchema, refTexto } from '../src/schemas/base';

const resumen =
  'Tras el triunfo del "No" en el referéndum, afirmó que en el quinquenio anterior se habían pagado\n' +
  '  más de USD 1.700 millones de sobrecostos, y dijo que por primera vez los combustibles eran más\n' +
  '  baratos que en Brasil.';

describe('partirEnFragmentos', () => {
  it('marca el tramo exacto y deja el resto sin marcar, con los espacios normalizados', () => {
    const partes = partirEnFragmentos(resumen, [{ fragmento: 'más de USD 1.700 millones de sobrecostos', dato: 'a' }]);
    expect(partes.map((p) => p.marca)).toEqual([undefined, 'a', undefined]);
    expect(partes[1].texto).toBe('más de USD 1.700 millones de sobrecostos');
    expect(partes.map((p) => p.texto).join('')).toBe(resumen.replace(/\s+/g, ' ').trim());
  });

  it('acepta un fragmento escrito con otros espacios o saltos de línea', () => {
    const partes = partirEnFragmentos(resumen, [{ fragmento: 'por primera vez los combustibles eran\nmás baratos que en Brasil', dato: 'b' }]);
    expect(partes.some((p) => p.marca === 'b')).toBe(true);
  });

  it('no marca un fragmento que no aparece tal cual', () => {
    const partes = partirEnFragmentos(resumen, [{ fragmento: 'USD 1.800 millones', dato: 'x' }]);
    expect(partes).toEqual([{ texto: resumen.replace(/\s+/g, ' ').trim() }]);
  });

  it('ordena por posición y descarta el fragmento que se pisa con uno anterior', () => {
    const partes = partirEnFragmentos('uno dos tres cuatro cinco', [
      { fragmento: 'tres cuatro', dato: 'b' },
      { fragmento: 'uno dos tres', dato: 'a' },
      { fragmento: 'cinco', dato: 'c' },
    ]);
    expect(partes.map((p) => p.marca ?? '-')).toEqual(['a', '-', 'c']);
    expect(partes.map((p) => p.texto)).toEqual(['uno dos tres', ' cuatro ', 'cinco']);
  });

  it('un texto sin marcas vuelve entero en una sola parte', () => {
    expect(partirEnFragmentos('sin datos', [])).toEqual([{ texto: 'sin datos' }]);
  });
});

describe('fragmentoEsta', () => {
  it('busca en cualquiera de los textos, ignorando espacios', () => {
    expect(fragmentoEsta('1.700 millones', 'nada', resumen)).toBe(true);
    expect(fragmentoEsta('1.700 millones', 'nada', undefined)).toBe(false);
    expect(fragmentoEsta('   ', resumen)).toBe(false);
  });
});

describe('cotejo de una cita de prensa con el registro primario', () => {
  const Fuente = crearFuenteSchema({ ref: refTexto });
  const nota = {
    url: 'https://ejemplo.uy/nota',
    medio: 'el-pais',
    fecha: '2019-09-04',
    tipo: 'nota',
    cita: 'La ley estaría aprobada en 90 días, dijo el candidato.',
    retrieved_at: '2026-09-06',
  };

  it('`difiere` sin `verificada_en.diferencia` no pasa: sería una acusación sin prueba', () => {
    expect(Fuente.safeParse({ ...nota, literalidad: 'difiere' }).success).toBe(false);
    expect(
      Fuente.safeParse({ ...nota, literalidad: 'difiere', verificada_en: { url: 'https://api.soundcloud.com/tracks/1', marca_tiempo: '1:28:49' } }).success,
    ).toBe(false);
  });

  it('`difiere` con contra qué y en qué, sí pasa', () => {
    const r = Fuente.safeParse({
      ...nota,
      literalidad: 'difiere',
      verificada_en: {
        url: 'https://api.soundcloud.com/tracks/1',
        marca_tiempo: '1:28:49',
        diferencia: 'La nota escribe 90 días; en el audio la respuesta es "a los 100 días está implementado".',
      },
    });
    expect(r.success).toBe(true);
  });

  it('`verificada_en` no admite campos que no sean url, marca_tiempo y diferencia', () => {
    expect(Fuente.safeParse({ ...nota, verificada_en: { url: 'https://a.b/c', intencion: 'mintió' } }).success).toBe(false);
  });
});
