/**
 * Modo lote de `pnpm fuente --lote <archivo>`: N URLs en un solo llamado (plan 2026-09, ítem 1.1).
 *
 * Solo se prueban funciones puras (parseo, formato de bloque, línea de consultas.jsonl y el
 * rechazo del enlace efímero de infolegislativa). Nada acá llama a `obtenerNota`: esa función baja
 * de red y toca el corpus privado (repo aparte), que es justo lo que estas pruebas evitan, igual
 * que `tests/fuente.test.ts` solo ejercita `presentarTexto`.
 */
import { describe, expect, it } from 'vitest';
import {
  esEnlaceEfimero,
  formatearBloqueLote,
  lineaConsulta,
  mensajeEnlaceEfimero,
  parsearLineaLote,
  parsearLote,
  type ResultadoEntradaLote,
} from '../scripts/corpus/fuente.ts';
import type { Taxonomia } from '../scripts/corpus/etiquetar.ts';
import type { Nota } from '../scripts/corpus/tipos.ts';

const taxonomia: Taxonomia = { politicos: [], partidos: [], temas: [], eventos: [] };

function notaFixture(texto: string, extra: Partial<Nota> = {}): Nota {
  return {
    id: 'abc123',
    url: 'https://ejemplo.uy/nota',
    url_canonica: 'https://ejemplo.uy/nota',
    medio: 'ejemplo',
    fecha: '2024-05-01',
    titulo: 'Título',
    autor: null,
    tipo: 'html',
    texto,
    retrieved_at: '2026-09-04T00:00:00Z',
    archived_url: null,
    text_sha256: '0',
    etiquetas: { politicos: [], partidos: [], temas: [], eventos: [], menciones: [], origen: {} },
    resumen: null,
    ...extra,
  };
}

describe('parsearLineaLote', () => {
  it('una URL sola no trae frases', () => {
    expect(parsearLineaLote('https://ejemplo.uy/a')).toEqual({ url: 'https://ejemplo.uy/a', frases: [] });
  });

  it('URL con una frase', () => {
    expect(parsearLineaLote('https://ejemplo.uy/a | subió el IVA')).toEqual({
      url: 'https://ejemplo.uy/a',
      frases: ['subió el IVA'],
    });
  });

  it('URL con dos frases', () => {
    expect(parsearLineaLote('https://ejemplo.uy/a | frase uno | frase dos')).toEqual({
      url: 'https://ejemplo.uy/a',
      frases: ['frase uno', 'frase dos'],
    });
  });

  it('tolera espacios irregulares alrededor del separador', () => {
    expect(parsearLineaLote('https://ejemplo.uy/a|frase uno|  frase dos  ')).toEqual({
      url: 'https://ejemplo.uy/a',
      frases: ['frase uno', 'frase dos'],
    });
  });

  it('ignora línea vacía', () => {
    expect(parsearLineaLote('')).toBeNull();
    expect(parsearLineaLote('   ')).toBeNull();
  });

  it('ignora línea de comentario', () => {
    expect(parsearLineaLote('# esto es un comentario')).toBeNull();
    expect(parsearLineaLote('   # con espacio adelante')).toBeNull();
  });

  it('ignora línea sin URL válida', () => {
    expect(parsearLineaLote('esto no es una url')).toBeNull();
    expect(parsearLineaLote('ftp://ejemplo.uy/a')).toBeNull();
  });

  it('una frase vacía (pipe colgante) no cuenta como frase', () => {
    expect(parsearLineaLote('https://ejemplo.uy/a | ')).toEqual({ url: 'https://ejemplo.uy/a', frases: [] });
  });
});

describe('parsearLote', () => {
  it('parsea el archivo entero en orden, salteando comentarios, vacías e inválidas', () => {
    const archivo = [
      '# lote de prueba',
      '',
      'https://ejemplo.uy/uno',
      '  ',
      'https://ejemplo.uy/dos | frase A',
      'no es una url',
      '# otro comentario',
      'https://ejemplo.uy/tres | frase B | frase C',
    ].join('\n');
    expect(parsearLote(archivo)).toEqual([
      { url: 'https://ejemplo.uy/uno', frases: [] },
      { url: 'https://ejemplo.uy/dos', frases: ['frase A'] },
      { url: 'https://ejemplo.uy/tres', frases: ['frase B', 'frase C'] },
    ]);
  });

  it('archivo sin entradas válidas devuelve lista vacía', () => {
    expect(parsearLote('# nada\n\n   \n')).toEqual([]);
  });
});

describe('enlace efímero de infolegislativa.parlamento.gub.uy/temporales/', () => {
  it('detecta el patrón que caduca', () => {
    expect(esEnlaceEfimero('https://infolegislativa.parlamento.gub.uy/temporales/d4445fc2e9504-dafc-4bce-9eca-fdd2d34c3b4b.pdf')).toBe(true);
  });

  it('no marca la URL estable de la Hemeroteca ni la página puente', () => {
    expect(esEnlaceEfimero('https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/1996-12-19%20-%20DIARIO.pdf')).toBe(false);
    expect(esEnlaceEfimero('https://parlamento.gub.uy/documentosyleyes/documentos/diarios-de-sesion/123/IMG')).toBe(false);
  });

  it('no marca otras rutas del mismo host', () => {
    expect(esEnlaceEfimero('https://infolegislativa.parlamento.gub.uy/documentosyleyes/ficha-asunto/9')).toBe(false);
  });

  it('el mensaje cita la Hemeroteca y trae un comando de Wayback con la URL', () => {
    const url = 'https://infolegislativa.parlamento.gub.uy/temporales/abc123.pdf';
    const msg = mensajeEnlaceEfimero(url);
    expect(msg).toContain('enlace efímero: caduca');
    expect(msg).toContain('docs/fuentes-oficiales/parlamento.md');
    expect(msg).toContain('web.archive.org/cdx/search/cdx?url=');
    expect(msg).toContain(encodeURIComponent(url));
  });
});

describe('formatearBloqueLote', () => {
  it('bloque de error: dos líneas, "### n. url" y "error: <motivo>", sin metadatos', () => {
    const resultado: ResultadoEntradaLote = { ok: false, motivo: 'HTTP 404' };
    const bloque = formatearBloqueLote(2, { url: 'https://ejemplo.uy/caida', frases: [] }, resultado, {}, taxonomia);
    expect(bloque.split('\n')).toEqual(['### 2. https://ejemplo.uy/caida', 'error: HTTP 404']);
  });

  it('bloque ok sin frases: encabezado, metadatos y los primeros 1500 caracteres por defecto', () => {
    const nota = notaFixture('a'.repeat(2000));
    const resultado: ResultadoEntradaLote = { ok: true, nota, nueva: false };
    const bloque = formatearBloqueLote(1, { url: nota.url, frases: [] }, resultado, {}, taxonomia);
    const lineas = bloque.split('\n');
    expect(lineas[0]).toBe(`### 1. ${nota.url}`);
    expect(lineas[1]).toBe('ejemplo · 2024-05-01 · html · 2000 caracteres · corpus');
    // Se corta a los 1500 (default del lote), no a los 6000 del modo de una sola URL.
    expect(bloque).toContain('recortado en el carácter 1500');
  });

  it('bloque ok "bajada" cuando la nota es nueva', () => {
    const nota = notaFixture('texto corto');
    const resultado: ResultadoEntradaLote = { ok: true, nota, nueva: true };
    const bloque = formatearBloqueLote(3, { url: nota.url, frases: [] }, resultado, {}, taxonomia);
    expect(bloque).toContain('11 caracteres · bajada');
    // Entra entera dentro del tope: no hay mensaje de corte.
    expect(bloque).not.toContain('recortado');
  });

  it('bloque ok con frases: usa las ventanas de --buscar, no los primeros --maximo caracteres', () => {
    const cita = 'no iba a subir los impuestos';
    const texto = `Relleno inicial.\n\n${cita} durante el discurso.\n\n` + 'Párrafo de relleno. '.repeat(200);
    const nota = notaFixture(texto);
    const resultado: ResultadoEntradaLote = { ok: true, nota, nueva: false };
    const bloque = formatearBloqueLote(1, { url: nota.url, frases: [cita] }, resultado, {}, taxonomia);
    expect(bloque).toContain(`[${cita} · carácter`);
    expect(bloque).toContain(cita);
    // Con frases no se aplica el tope de 1500 del modo sin frases: no hay mensaje de corte.
    expect(bloque).not.toContain('recortado');
  });

  it('respeta --ventana en el caso con frases', () => {
    const cita = 'palabra clave';
    const texto = `${'x'.repeat(500)}${cita}${'y'.repeat(500)}`;
    const nota = notaFixture(texto);
    const resultado: ResultadoEntradaLote = { ok: true, nota, nueva: false };
    const bloqueChico = formatearBloqueLote(1, { url: nota.url, frases: [cita] }, resultado, { ventana: 10 }, taxonomia);
    const bloqueGrande = formatearBloqueLote(1, { url: nota.url, frases: [cita] }, resultado, { ventana: 200 }, taxonomia);
    expect(bloqueChico.length).toBeLessThan(bloqueGrande.length);
  });
});

describe('lineaConsulta', () => {
  it('produce el mismo formato que consultas.jsonl del investigador', () => {
    const momento = new Date('2026-09-10T12:00:00.000Z');
    const linea = lineaConsulta('https://ejemplo.uy/nota', 'ok', momento);
    expect(JSON.parse(linea)).toEqual({
      t: '2026-09-10T12:00:00.000Z',
      tipo: 'fuente',
      q: 'https://ejemplo.uy/nota',
      resultado: 'ok',
    });
  });

  it('acepta "fallo: <motivo>" como resultado', () => {
    const linea = lineaConsulta('https://ejemplo.uy/caida', 'fallo: HTTP 404', new Date('2026-09-10T12:00:00.000Z'));
    expect(JSON.parse(linea).resultado).toBe('fallo: HTTP 404');
  });

  it('es una sola línea de JSON válido, sin saltos de línea internos', () => {
    const linea = lineaConsulta('https://ejemplo.uy/nota', 'ok');
    expect(linea).not.toContain('\n');
    expect(() => JSON.parse(linea)).not.toThrow();
  });
});
