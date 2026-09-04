/**
 * Presentación del texto en `pnpm fuente`: lo que ve el agente.
 *
 * El texto de prueba tiene tildes y saltos de línea triples a propósito: la
 * normalización colapsa espacios, así que el índice de una frase en el texto
 * normalizado no coincide con su índice en el original. Ese desfase fue un bug
 * real de --buscar (400 caracteres en una nota de 185k).
 */
import { describe, expect, it } from 'vitest';
import { presentarTexto } from '../scripts/corpus/fuente.ts';
import type { Taxonomia } from '../scripts/corpus/etiquetar.ts';
import type { Nota } from '../scripts/corpus/tipos.ts';
import { normalizar } from '../scripts/lib/texto.ts';

const taxonomia: Taxonomia = {
  politicos: [{ slug: 'lacalle-pou', nombre: 'Luis Lacalle Pou', alias: ['Luis Lacalle Pou', 'Lacalle Pou'] }],
  partidos: [],
  temas: [{ slug: 'economia/impuestos', nombre: 'Impuestos', alias: ['economia/impuestos', 'impuestos', 'IVA'] }],
  eventos: [],
};

const CITA = 'no iba a subir los impuestos ni el IVA';

function notaLarga(): Nota {
  const parrafos: string[] = [];
  for (let i = 0; i < 120; i++) {
    parrafos.push(`Párrafo ${i} con acentos y señales:   texto de relleno   sobre la economía uruguaya, sin menciones relevantes.`);
  }
  parrafos[80] = `En la campaña, Lacalle Pou dijo que ${CITA} durante su mandato.`;
  parrafos[110] = 'Años después, Lacalle Pou defendió el ajuste de tarifas como algo distinto de un impuesto.';
  const texto = parrafos.join('\n\n\n');
  return {
    id: 'prueba',
    url: 'https://ejemplo.uy/nota',
    url_canonica: 'https://ejemplo.uy/nota',
    medio: 'ejemplo',
    fecha: '2020-01-01',
    titulo: 'Nota de prueba',
    autor: null,
    tipo: 'html',
    texto,
    retrieved_at: '2026-09-04T00:00:00Z',
    archived_url: null,
    text_sha256: '0',
    etiquetas: { politicos: ['lacalle-pou'], partidos: [], temas: [], eventos: [], menciones: [], origen: {} },
    resumen: null,
  };
}

describe('pnpm fuente --buscar', () => {
  it('el texto de prueba tiene desfase entre normalizado y original', () => {
    const { texto } = notaLarga();
    expect(normalizar(texto).indexOf(normalizar(CITA))).not.toBe(texto.indexOf(CITA));
  });

  it('devuelve la ventana correcta aunque haya desfase', () => {
    const nota = notaLarga();
    const salida = presentarTexto(nota, { buscar: CITA }, taxonomia);
    expect(salida).toContain(CITA);
    expect(salida).toContain(`carácter ${nota.texto.indexOf(CITA)}`);
  });

  it('fusiona ventanas solapadas en una sola', () => {
    const salida = presentarTexto(notaLarga(), { buscar: 'subir los impuestos | el IVA' }, taxonomia);
    expect(salida.match(/· carácter \d+\]/g)).toHaveLength(1);
    expect(salida).toContain('subir los impuestos | el IVA');
  });

  it('avisa cuando una frase no aparece', () => {
    const salida = presentarTexto(notaLarga(), { buscar: 'frase inexistente' }, taxonomia);
    expect(salida).toContain('[frase inexistente] sin coincidencias');
  });

  it('respeta el tope total y dice cuántas ventanas omitió', () => {
    const salida = presentarTexto(notaLarga(), { buscar: 'Párrafo 3 con | Párrafo 60 con | Párrafo 100 con', maximo: 900 }, taxonomia);
    expect(salida.length).toBeLessThan(1300);
    expect(salida).toContain('Párrafo 3 con');
    expect(salida).not.toContain('Párrafo 100 con acentos');
    expect(salida).toMatch(/2 omitida\(s\) por el tope de 900/);
  });

  it('recorta una ventana encadenada en vez de volcarla entera', () => {
    const salida = presentarTexto(notaLarga(), { buscar: 'texto de relleno', coincidencias: 10, maximo: 900 }, taxonomia);
    expect(salida.length).toBeLessThan(1300);
    expect(salida).toMatch(/1 recortada\(s\) al tope de 900/);
  });
});

describe('pnpm fuente sin opciones', () => {
  it('recorta a 6000 y agrega el índice de menciones posteriores al corte', () => {
    const nota = notaLarga();
    const salida = presentarTexto(nota, {}, taxonomia);
    const primera = nota.texto.indexOf('Lacalle Pou', 6000);
    expect(salida).toContain('recortado en el carácter 6000');
    expect(salida).toContain('Menciones de [lacalle-pou] desde el carácter 6000: 2 tramo(s)');
    expect(salida).toContain(`c. ${String(primera).padStart(6)}  [lacalle-pou]`);
    expect(nota.texto.slice(primera)).toMatch(/^Lacalle Pou/);
    // El índice no vuelca el tramo entero: solo un extracto corto.
    expect(salida).not.toContain('defendió el ajuste de tarifas como algo distinto de un impuesto.\n');
  });

  it('el índice se mantiene compacto aunque haya cien menciones', () => {
    // El índice es un mapa, no un resumen: si crece con el documento deja de ahorrar nada.
    // Con 30 entradas de 150 caracteres ocupaba 5700 en una nota real de 185k, casi tanto
    // como los 6000 de texto que venía a ahorrar.
    const nota = notaLarga();
    const parrafos = [...nota.texto.split('\n\n\n'), ...nota.texto.split('\n\n\n')];
    for (let i = 10; i < parrafos.length; i++) parrafos[i] = `Lacalle Pou dijo algo en el párrafo ${i}. ${parrafos[i]}`;
    nota.texto = parrafos.join('\n\n\n');

    const salida = presentarTexto(nota, {}, taxonomia);
    const indice = salida.slice(salida.indexOf('Menciones de ['));
    expect(indice.length).toBeLessThan(2000);
    expect(indice).toMatch(/tramo\(s\) más, repartidos entre medio/);

    // Y las entradas se reparten por el documento, no se amontonan al principio.
    const posiciones = [...indice.matchAll(/c\.\s+(\d+)/g)].map((m) => Number(m[1]));
    expect(posiciones.length).toBeLessThanOrEqual(14);
    expect(Math.max(...posiciones)).toBeGreaterThan(nota.texto.length * 0.7);
  });

  it('con --tema también indexa los alias del tema', () => {
    const salida = presentarTexto(notaLarga(), { tema: 'economia/impuestos' }, taxonomia);
    expect(salida).toContain('[lacalle-pou, economia/impuestos]');
  });

  it('devuelve la nota entera si cabe en el tope', () => {
    const nota = notaLarga();
    nota.texto = nota.texto.slice(0, 3000);
    expect(presentarTexto(nota, {}, taxonomia)).toBe(nota.texto);
  });

  it('--desde lee un tramo a partir de un carácter', () => {
    const nota = notaLarga();
    const pos = nota.texto.indexOf('En la campaña');
    const salida = presentarTexto(nota, { desde: pos, maximo: 200 }, taxonomia);
    expect(salida.startsWith(`[desde el carácter ${pos} de ${nota.texto.length}]`)).toBe(true);
    expect(salida).toContain(CITA);
    expect(salida).not.toContain('Párrafo 0 ');
  });

  it('--indice devuelve solo el mapa, sin texto', () => {
    const salida = presentarTexto(notaLarga(), { indice: true, tema: 'economia/impuestos' }, taxonomia);
    expect(salida).not.toContain('Párrafo 0 ');
    expect(salida).toContain('desde el carácter 0');
    expect(salida).toContain('economia/impuestos');
  });

  it('--completo devuelve todo', () => {
    const nota = notaLarga();
    expect(presentarTexto(nota, { completo: true }, taxonomia)).toBe(nota.texto);
  });
});
