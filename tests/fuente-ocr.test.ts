/**
 * OCR en segundo plano de `pnpm fuente` (plan 2026-09, ítem 1.9).
 *
 * No corre tesseract ni pdftoppm: se simula el caché por página escribiendo directamente en
 * `.cache/ocr/<sha>/pN.txt` (el mismo formato que deja `ocrPaginas`) y se inyecta un `spawnFn` que
 * no lanza ningún proceso de verdad, solo devuelve un pid falso. Así se prueban el lock y el
 * mensaje de progreso sin depender de que la máquina tenga OCR instalado.
 */
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  CACHE_OCR,
  chequearOcrEnSegundoPlano,
  lanzarOcrSegundoPlano,
  mensajeOcrEnCurso,
  ocrEnCurso,
  OcrEnCursoError,
  type SpawnDesacoplado,
} from '../scripts/lib/ocr.ts';
import { sha256 } from '../scripts/lib/hash.ts';

/** Buffers de prueba distintos por test, para que sus carpetas de caché no se pisen entre sí. */
function bufferDePrueba(semilla: string): Buffer {
  return Buffer.from(`%PDF-1.4 fixture de prueba ${semilla}`, 'utf8');
}

const carpetasCreadas: string[] = [];

/** Simula que las páginas `listas` (1-based, de un total mayor) ya pasaron por OCR. */
function precargarPaginas(sha: string, listas: number[]): void {
  const carpeta = join(CACHE_OCR, sha);
  mkdirSync(carpeta, { recursive: true });
  carpetasCreadas.push(carpeta);
  for (const n of listas) writeFileSync(join(carpeta, `p${n}.txt`), `texto de la página ${n}`, 'utf8');
}

function spyQueNoLanzaNada(pid = 4242): { spawnFn: SpawnDesacoplado; llamadas: { cmd: string; args: string[] }[] } {
  const llamadas: { cmd: string; args: string[] }[] = [];
  const spawnFn: SpawnDesacoplado = (cmd, args) => {
    llamadas.push({ cmd, args });
    return { pid, unref: () => {} };
  };
  return { spawnFn, llamadas };
}

afterEach(() => {
  for (const carpeta of carpetasCreadas.splice(0)) rmSync(carpeta, { recursive: true, force: true });
});

/** Limpia también el `.pdf` y el `.lock.json` que deja un sha de prueba. */
function limpiarArchivosDe(sha: string): void {
  rmSync(join(CACHE_OCR, `${sha}.pdf`), { force: true });
  rmSync(join(CACHE_OCR, `${sha}.lock.json`), { force: true });
  rmSync(join(CACHE_OCR, `${sha}.error.log`), { force: true });
}

describe('chequearOcrEnSegundoPlano', () => {
  it('si todas las páginas pedidas ya están en caché, no lanza nada y devuelve null', () => {
    const buffer = bufferDePrueba('completo');
    const sha = sha256(buffer);
    precargarPaginas(sha, [1, 2, 3]);
    const { spawnFn, llamadas } = spyQueNoLanzaNada();

    try {
      const progreso = chequearOcrEnSegundoPlano(buffer, [1, 2, 3], spawnFn);
      expect(progreso).toBeNull();
      expect(llamadas).toHaveLength(0);
      expect(existsSync(join(CACHE_OCR, `${sha}.pdf`))).toBe(true); // igual guarda el PDF para el trabajador
    } finally {
      limpiarArchivosDe(sha);
    }
  });

  it('si faltan páginas y no hay OCR en curso, lanza el proceso en segundo plano y devuelve el progreso', () => {
    const buffer = bufferDePrueba('parcial');
    const sha = sha256(buffer);
    precargarPaginas(sha, [1, 2]); // de 5, listas 1 y 2
    // `ocrEnCurso` valida que el pid del lock siga vivo; se usa el pid del propio proceso de test
    // (garantizado vivo) en vez de un número inventado, que en otra máquina podría no existir.
    const { spawnFn, llamadas } = spyQueNoLanzaNada(process.pid);

    try {
      const progreso = chequearOcrEnSegundoPlano(buffer, [1, 2, 3, 4, 5], spawnFn);
      expect(progreso).toEqual({ sha, listas: 2, total: 5 });
      expect(llamadas).toHaveLength(1);
      expect(llamadas[0].args.join(' ')).toContain('1,2,3,4,5');
      expect(llamadas[0].args.some((a) => a.includes('ocr-trabajador'))).toBe(true);

      const lock = ocrEnCurso(sha);
      expect(lock?.pid).toBe(process.pid);
    } finally {
      limpiarArchivosDe(sha);
    }
  });

  it('si ya hay un OCR en curso (lock con pid vivo), no lanza otro', () => {
    const buffer = bufferDePrueba('en-curso');
    const sha = sha256(buffer);
    precargarPaginas(sha, [1]);
    mkdirSync(CACHE_OCR, { recursive: true });
    // El propio proceso de test es un pid garantizado vivo.
    writeFileSync(join(CACHE_OCR, `${sha}.lock.json`), JSON.stringify({ pid: process.pid, iniciado: new Date().toISOString() }));
    const { spawnFn, llamadas } = spyQueNoLanzaNada();

    try {
      const progreso = chequearOcrEnSegundoPlano(buffer, [1, 2, 3], spawnFn);
      expect(progreso).toEqual({ sha, listas: 1, total: 3 });
      expect(llamadas).toHaveLength(0); // no se relanzó
    } finally {
      limpiarArchivosDe(sha);
    }
  });

  it('un lock de un proceso muerto se descarta y permite relanzar', () => {
    const buffer = bufferDePrueba('lock-huerfano');
    const sha = sha256(buffer);
    precargarPaginas(sha, []);
    mkdirSync(CACHE_OCR, { recursive: true });
    // Un pid casi con certeza inexistente en cualquier máquina.
    writeFileSync(join(CACHE_OCR, `${sha}.lock.json`), JSON.stringify({ pid: 999_999_999, iniciado: '2020-01-01T00:00:00.000Z' }));
    const { spawnFn, llamadas } = spyQueNoLanzaNada(process.pid);

    try {
      expect(ocrEnCurso(sha)).toBeNull(); // se detecta y se limpia solo
      const progreso = chequearOcrEnSegundoPlano(buffer, [1, 2], spawnFn);
      expect(progreso).toEqual({ sha, listas: 0, total: 2 });
      expect(llamadas).toHaveLength(1); // sí se relanzó
      expect(ocrEnCurso(sha)?.pid).toBe(process.pid);
    } finally {
      limpiarArchivosDe(sha);
    }
  });
});

describe('lanzarOcrSegundoPlano', () => {
  it('escribe el lock con el pid y la hora antes de soltar el proceso', () => {
    const buffer = bufferDePrueba('lanzar-directo');
    const sha = sha256(buffer);
    const rutaPdf = join(CACHE_OCR, `${sha}.pdf`);
    mkdirSync(CACHE_OCR, { recursive: true });
    writeFileSync(rutaPdf, buffer);
    const { spawnFn } = spyQueNoLanzaNada(5555);

    try {
      const antes = Date.now();
      lanzarOcrSegundoPlano(rutaPdf, sha, [1, 2, 3], spawnFn);
      const lock = JSON.parse(readFileSync(join(CACHE_OCR, `${sha}.lock.json`), 'utf8'));
      expect(lock.pid).toBe(5555);
      expect(new Date(lock.iniciado).getTime()).toBeGreaterThanOrEqual(antes - 1000);
    } finally {
      limpiarArchivosDe(sha);
    }
  });

  it('sin pid (el spawn no arrancó), no escribe lock', () => {
    const buffer = bufferDePrueba('sin-pid');
    const sha = sha256(buffer);
    const rutaPdf = join(CACHE_OCR, `${sha}.pdf`);
    mkdirSync(CACHE_OCR, { recursive: true });
    writeFileSync(rutaPdf, buffer);
    const spawnFn: SpawnDesacoplado = () => ({ pid: undefined, unref: () => {} });

    try {
      lanzarOcrSegundoPlano(rutaPdf, sha, [1], spawnFn);
      expect(existsSync(join(CACHE_OCR, `${sha}.lock.json`))).toBe(false);
    } finally {
      limpiarArchivosDe(sha);
    }
  });
});

describe('mensajeOcrEnCurso', () => {
  it('reporta páginas listas sobre el total y una estimación de minutos', () => {
    // 30 páginas faltantes a ~5 s/página = 150 s = 2.5 min -> redondea para arriba a 3.
    const msg = mensajeOcrEnCurso({ sha: 'x', listas: 5, total: 35 });
    expect(msg).toBe('OCR en curso: 5 de 35 páginas listas; volvé a llamar en ~3 minuto(s).');
  });

  it('nunca estima menos de 1 minuto, ni con una sola página pendiente', () => {
    const msg = mensajeOcrEnCurso({ sha: 'x', listas: 34, total: 35 });
    expect(msg).toContain('~1 minuto(s)');
  });

  it('un documento de 100 páginas con poco avance estima varios minutos', () => {
    const msg = mensajeOcrEnCurso({ sha: 'x', listas: 10, total: 100 });
    // 90 páginas * 5 s = 450 s = 7.5 min -> 8.
    expect(msg).toContain('10 de 100 páginas listas');
    expect(msg).toContain('~8 minuto(s)');
  });
});

describe('OcrEnCursoError', () => {
  it('lleva el progreso y un mensaje legible', () => {
    const err = new OcrEnCursoError({ sha: 'abc', listas: 3, total: 10 });
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe('OcrEnCursoError');
    expect(err.progreso).toEqual({ sha: 'abc', listas: 3, total: 10 });
    expect(err.message).toContain('3 de 10');
  });
});
