/**
 * Tests de la detección de referencias a leyes y de la transformación del
 * Markdown (`src/lib/leyes.ts`, `src/lib/rehype-leyes.ts`).
 *
 * Lo que se cuida acá son las dos formas en que esto se rompe sin avisar: que
 * la expresión deje de reconocer una forma de citar que ya está escrita en las
 * páginas, o que empiece a reconocer algo que no es una ley (la palabra "ley"
 * suelta, una cifra con punto). Las dos serían invisibles en el build.
 */
import { describe, expect, it } from 'vitest';
import { buscarArticulo, claveArticulo, referenciasEn, type LeyMinima } from '../src/lib/leyes.ts';
import { rehypeLeyes } from '../src/lib/rehype-leyes.ts';

const LEY_18331: LeyMinima = {
  numero: '18.331',
  titulo: 'Ley de protección de datos personales',
  fecha: '2008-08-11',
  resumen: 'Regula qué se puede hacer con los datos de una persona.',
  articulos: [
    { numero: '9 bis', resumen: 'Enumera qué fuentes son públicas.', cita: 'se consideran como públicas o accesibles al público' },
    { numero: '18', resumen: 'Datos sobre infracciones penales.', cita: 'sólo pueden ser objeto de tratamiento por parte de las autoridades' },
  ],
  url_impo: 'https://www.impo.com.uy/bases/leyes/18331-2008',
};
const LEY_18515: LeyMinima = {
  numero: '18.515',
  titulo: 'Ley de prensa, modificación; Código Penal, modificación',
  fecha: '2009-06-26',
  resumen: 'Reescribió los delitos contra el honor.',
  articulos: [{ numero: '336 del Código Penal', resumen: 'Exime de responsabilidad.', cita: 'Estará exento de responsabilidad el que' }],
  url_impo: 'https://www.impo.com.uy/bases/leyes/18515-2009',
};
const LEYES = new Map<string, LeyMinima>([
  ['18.331', LEY_18331],
  ['18.515', LEY_18515],
]);

describe('formas de citar que ya están escritas en las páginas', () => {
  const casos: [string, string, string | undefined][] = [
    ['previsto en la ley 16.099 y no lo reemplaza', '16.099', undefined],
    ['la ley 18.331 (art. 9 bis) y del art. 336 del Código Penal', '18.331', '9 bis'],
    ['**Ley 18.331, art. 18**: los datos', '18.331', '18'],
    ['**Código Penal, art. 336** (redacción de la ley 18.515)', '18.515', '336 del Código Penal'],
    ['**Ley 17.060** (modificada por la 19.797)', '17.060', undefined],
    ['**Ley 19.827**: debate obligatorio', '19.827', undefined],
    ['declaraciones juradas públicas, según ley 17.060', '17.060', undefined],
    ['la ley N° 17.060 de 1998', '17.060', undefined],
    ['el art. 336 del Código Penal protege', '18.515', '336 del Código Penal'],
  ];
  for (const [texto, numero, articulo] of casos) {
    it(texto, () => {
      const r = referenciasEn(texto);
      expect(r.length).toBeGreaterThan(0);
      expect(r[0].numero).toBe(numero);
      expect(r[0].articulo).toBe(articulo);
    });
  }
});

describe('lo que no es una referencia a una ley', () => {
  for (const texto of [
    'una evidencia fechada (ley, decreto, acción de gobierno, dato oficial)',
    'la ley de la oferta y la demanda',
    'el índice subió 1.500 puntos',
    'la sala 19.797 del edificio',
  ]) {
    it(texto, () => {
      expect(referenciasEn(texto)).toEqual([]);
    });
  }
});

describe('resolución del artículo', () => {
  it('empareja "Art. 9 BIS", "artículo 9 bis" y "9 bis" contra el mismo artículo', () => {
    for (const forma of ['Art. 9 BIS', 'artículo 9 bis', '9 bis']) {
      expect(claveArticulo(forma)).toBe('9 bis');
      expect(buscarArticulo(LEY_18331, forma)?.numero).toBe('9 bis');
    }
  });
  it('devuelve undefined si la ley no tiene ese artículo cargado', () => {
    expect(buscarArticulo(LEY_18331, '42')).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// Transformación del árbol
// ---------------------------------------------------------------------------

const texto = (value: string) => ({ type: 'text', value });
const elemento = (tagName: string, children: any[]) => ({ type: 'element', tagName, properties: {}, children });
const raiz = (children: any[]) => ({ type: 'root', children });

/** Aplana el árbol a texto plano, para comprobar qué quedó dentro de qué. */
function aTexto(n: any): string {
  if (n.type === 'text') return n.value;
  return (n.children ?? []).map(aTexto).join('');
}
/** Lo mismo, pero sin el contenido de las tarjetas: es lo que el lector ve en la prosa. */
function aTextoVisible(n: any): string {
  if (n.type === 'text') return n.value;
  const clases = n.properties?.className;
  if (Array.isArray(clases) && clases.includes('ref-ley-tarjeta')) return '';
  return (n.children ?? []).map(aTextoVisible).join('');
}
function buscar(n: any, clase: string): any[] {
  const salida: any[] = [];
  const ver = (x: any) => {
    if (x.type === 'element' && Array.isArray(x.properties?.className) && x.properties.className.includes(clase)) salida.push(x);
    for (const h of x.children ?? []) ver(h);
  };
  ver(n);
  return salida;
}

describe('rehypeLeyes', () => {
  const transformar = rehypeLeyes({ leyes: LEYES });

  it('envuelve la referencia y conserva el resto del párrafo intacto', () => {
    const arbol = raiz([elemento('p', [texto('según la ley 18.331 (art. 9 bis), las fuentes públicas son libres')])]);
    transformar(arbol as any);
    expect(aTextoVisible(arbol)).toBe('según la ley 18.331 (art. 9 bis), las fuentes públicas son libres');
    const refs = buscar(arbol, 'ref-ley');
    expect(refs).toHaveLength(1);
    expect(aTexto(buscar(refs[0], 'ref-ley-art')[0])).toContain('Enumera qué fuentes son públicas');
  });

  it('no toca el texto dentro de enlaces, código ni títulos', () => {
    for (const etiqueta of ['a', 'code', 'h2']) {
      const arbol = raiz([elemento(etiqueta, [texto('ley 18.331')])]);
      transformar(arbol as any);
      expect(buscar(arbol, 'ref-ley')).toHaveLength(0);
    }
  });

  it('transforma dentro de negritas y de listas', () => {
    const arbol = raiz([elemento('li', [elemento('strong', [texto('Ley 18.331, art. 18')])])]);
    transformar(arbol as any);
    expect(buscar(arbol, 'ref-ley')).toHaveLength(1);
  });

  it('deja intacta una ley que no tiene archivo en content/leyes/', () => {
    const arbol = raiz([elemento('p', [texto('la ley 99.999 no existe acá')])]);
    transformar(arbol as any);
    expect(buscar(arbol, 'ref-ley')).toHaveLength(0);
    expect(aTextoVisible(arbol)).toBe('la ley 99.999 no existe acá');
  });

  it('da un id distinto a cada tarjeta de la misma página', () => {
    const arbol = raiz([
      elemento('p', [texto('la ley 18.331 y otra vez la ley 18.331')]),
      elemento('p', [texto('y el art. 336 del Código Penal')]),
    ]);
    transformar(arbol as any);
    const ids = buscar(arbol, 'ref-ley-tarjeta').map((t) => t.properties.id);
    expect(ids).toHaveLength(3);
    expect(new Set(ids).size).toBe(3);
  });
});
