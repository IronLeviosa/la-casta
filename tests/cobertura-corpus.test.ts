/**
 * Pruebas puras de `pnpm cobertura:corpus`: sin red y sin depender del corpus real.
 * Cubren el parseo de brief.md, la lectura de consultas.jsonl y la comparación de
 * notas del corpus contra URLs abiertas.
 */
import { describe, expect, it } from 'vitest';
import {
  actualizarSeccionCobertura,
  compararCobertura,
  leerUrlsAbiertas,
  parsearBrief,
  type NotaCorpus,
} from '../scripts/corpus/cobertura.ts';

const BRIEF_COMBUSTIBLES = `# Brief de investigación · corrida 2026-09-05-lacalle-pou-economia-combustibles

Regla 0: objetividad por encima de todo.

## 1. Político
- slug: \`lacalle-pou\`
- nombre: Luis Alberto Aparicio Alejandro Lacalle Pou (Luis Lacalle Pou)
- partido: Partido Nacional
- alias: Lacalle Pou, Luis Lacalle Pou, Luis Alberto Lacalle Pou, Lacalle, LLP
- alias ambiguos: "Lacalle": También nombra a su padre.
- mandatos:
- Presidente de la República: 2020-03-01 → 2025-03-01
- estado actual: fuera_de_cargo (salida: fin_de_mandato el 2025-03-01)
- período a cubrir: desde la campaña previa al primer mandato (1999) hasta hoy (2026-09-05), incluidas oposición y posmandato.

## 2. Tema
- slug: \`economia/combustibles\` · nombre: Combustibles · padre: economia
- descripción: Precio y regulación de los combustibles.
- alias: combustibles, nafta, gasoil, precio del combustible, ANCAP, URSEA, precio de paridad de importación, PPI, supergás, refinería, La Teja
- temas hijos: ninguno

## 3. Esquema (extracto)
(...)
`;

const BRIEF_VETOS = `# Brief de investigación · corrida 2026-09-04-orsi-vetos

## 1. Político
- slug: \`orsi\`
- nombre: Yamandú Ramón Antonio Orsi Martínez (Yamandú Orsi)
- partido: Frente Amplio
- alias: Yamandú Orsi, Orsi, Yamandú
- alias ambiguos: ninguno
- mandatos:
- Presidente de la República: 2025-03-01 → en curso
- estado actual: en_cargo
- período a cubrir: desde la campaña previa al primer mandato (2024) hasta hoy (2026-09-04), incluidas oposición y posmandato.

## 2. Objeto de la corrida: los vetos
Buscás todos los vetos que esta persona firmó como presidente.

## 3. Esquema (extracto)
(...)
`;

describe('parsearBrief', () => {
  it('lee político, tema, alias del tema y período de un brief con tema', () => {
    const b = parsearBrief(BRIEF_COMBUSTIBLES);
    expect(b.politico).toBe('lacalle-pou');
    expect(b.tema).toBe('economia/combustibles');
    expect(b.temaAlias).toEqual([
      'combustibles',
      'nafta',
      'gasoil',
      'precio del combustible',
      'ANCAP',
      'URSEA',
      'precio de paridad de importación',
      'PPI',
      'supergás',
      'refinería',
      'La Teja',
    ]);
    expect(b.desde).toBe('1999-01-01');
    expect(b.hasta).toBe('2026-09-05');
  });

  it('no confunde "alias ambiguos" del político con los alias del tema', () => {
    const b = parsearBrief(BRIEF_COMBUSTIBLES);
    expect(b.temaAlias).not.toContain('"Lacalle": También nombra a su padre.');
  });

  it('un brief sin sección "## 2. Tema" (vetos) da tema null y alias vacío, sin romper', () => {
    const b = parsearBrief(BRIEF_VETOS);
    expect(b.politico).toBe('orsi');
    expect(b.tema).toBeNull();
    expect(b.temaAlias).toEqual([]);
    // El período sigue viviendo en la sección de Político: se sigue leyendo igual.
    expect(b.desde).toBe('2024-01-01');
    expect(b.hasta).toBe('2026-09-04');
  });

  it('"temas hijos: ninguno" no contamina la lista de alias', () => {
    const b = parsearBrief(BRIEF_COMBUSTIBLES);
    expect(b.temaAlias).not.toContain('ninguno');
  });

  it('brief sin ninguna sección reconocible devuelve todo null/vacío sin lanzar', () => {
    const b = parsearBrief('# nada de nada\nsolo texto suelto\n');
    expect(b.politico).toBeNull();
    expect(b.tema).toBeNull();
    expect(b.temaAlias).toEqual([]);
    expect(b.desde).toBeNull();
    expect(b.hasta).toBeNull();
  });
});

describe('leerUrlsAbiertas', () => {
  it('toma solo las líneas tipo "fuente", ignora "busqueda" y líneas corruptas', () => {
    const jsonl = [
      '{"t": "2026-09-05T00:00:00Z", "tipo": "busqueda", "q": "corpus:buscar algo", "resultado": "3 resultados"}',
      '{"t": "2026-09-05T00:01:00Z", "tipo": "fuente", "q": "https://www.elpais.com.uy/nota-a", "resultado": "ok: nueva"}',
      'esto no es json',
      '{"t": "2026-09-05T00:02:00Z", "tipo": "fuente", "q": "https://www.elpais.com.uy/nota-b", "resultado": "ok: nueva"}',
      '',
    ].join('\n');
    expect(leerUrlsAbiertas(jsonl)).toEqual(['https://www.elpais.com.uy/nota-a', 'https://www.elpais.com.uy/nota-b']);
  });

  it('jsonl vacío da lista vacía', () => {
    expect(leerUrlsAbiertas('')).toEqual([]);
  });
});

describe('compararCobertura', () => {
  const nota = (url: string, rank: number, extra: Partial<NotaCorpus> = {}): NotaCorpus => ({
    url,
    fecha: '2021-01-01',
    medio: 'el-pais',
    titulo: 'título',
    rank,
    ...extra,
  });

  it('cuenta abiertas y sin abrir, canonicalizando ambos lados', () => {
    const notas = [
      nota('http://www.elpais.com.uy/nota-a?utm_source=x', -5),
      nota('https://elpais.com.uy/nota-b', -3),
      nota('https://www.elpais.com.uy/nota-c', -1),
    ];
    // La abierta viene en otra forma (sin utm, con www distinto) pero es la misma URL canónica.
    const abiertas = ['https://elpais.com.uy/nota-a'];
    const r = compararCobertura(notas, abiertas);
    expect(r.total).toBe(3);
    expect(r.abiertas).toBe(1);
    expect(r.sinAbrir).toBe(2);
    expect(r.porcentaje).toBeCloseTo(33.3, 1);
  });

  it('dedupea notas repetidas (misma URL canónica) quedándose con el mejor rank', () => {
    const notas = [nota('https://www.elpais.com.uy/nota-a', -1), nota('http://elpais.com.uy/nota-a/', -9)];
    const r = compararCobertura(notas, []);
    expect(r.total).toBe(1);
    expect(r.notasSinAbrir[0].rank).toBe(-9);
  });

  it('ordena las no abiertas por rank (mejor primero) y respeta el tope', () => {
    const notas = [nota('https://a.com/1', -1), nota('https://a.com/2', -9), nota('https://a.com/3', -5)];
    const r = compararCobertura(notas, [], { tope: 2 });
    expect(r.sinAbrir).toBe(3);
    expect(r.notasSinAbrir).toHaveLength(2);
    expect(r.notasSinAbrir.map((n) => n.url)).toEqual(['https://a.com/2', 'https://a.com/3']);
  });

  it('sin notas del corpus, la cobertura es 100% (nada que cubrir) y no divide por cero', () => {
    const r = compararCobertura([], ['https://a.com/1']);
    expect(r.total).toBe(0);
    expect(r.abiertas).toBe(0);
    expect(r.sinAbrir).toBe(0);
    expect(r.porcentaje).toBe(100);
    expect(r.notasSinAbrir).toEqual([]);
  });

  it('todo abierto da 100%', () => {
    const notas = [nota('https://a.com/1', -1), nota('https://a.com/2', -2)];
    const r = compararCobertura(notas, ['https://a.com/1', 'https://a.com/2']);
    expect(r.porcentaje).toBe(100);
    expect(r.sinAbrir).toBe(0);
  });
});

describe('actualizarSeccionCobertura', () => {
  it('agrega la sección al final si no existía', () => {
    const md = '# Notas\n\n## otra_seccion\ncontenido\n';
    const out = actualizarSeccionCobertura(md, '## cobertura_corpus\n\nlinea nueva');
    expect(out).toContain('## otra_seccion');
    expect(out).toContain('## cobertura_corpus');
    expect(out.indexOf('## otra_seccion')).toBeLessThan(out.indexOf('## cobertura_corpus'));
  });

  it('reemplaza una sección previa sin duplicarla ni tocar las demás', () => {
    const md = '# Notas\n\n## cobertura_corpus\n\nversión vieja\n\n## otra_seccion\ndespués\n';
    const out = actualizarSeccionCobertura(md, '## cobertura_corpus\n\nversión nueva');
    expect(out).not.toContain('versión vieja');
    expect(out).toContain('versión nueva');
    expect(out).toContain('## otra_seccion');
    expect(out).toContain('después');
    expect((out.match(/## cobertura_corpus/g) ?? []).length).toBe(1);
  });

  it('en un notas.md vacío escribe solo la sección', () => {
    const out = actualizarSeccionCobertura('', '## cobertura_corpus\n\nlinea');
    expect(out).toBe('## cobertura_corpus\n\nlinea\n');
  });
});
