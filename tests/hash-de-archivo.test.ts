/**
 * `hashDeArchivo()` (scripts/lib/corridas.ts): hash de un archivo para procedencia (brief_sha,
 * agente_sha, script_sha, hashes de instrucciones). Normaliza el fin de línea a LF para los
 * archivos de texto antes de hashear, para que el hash sea siempre el del blob que git guarda
 * (`.gitattributes` fuerza `text=auto eol=lf`), sin importar en qué sistema operativo se escribió
 * el archivo.
 *
 * Nace del caso real de `data/corridas/2026-09-16-batlle-economia-impuestos/brief.md`, escrito con
 * CRLF por una herramienta en Windows: los 51 registros promovidos de esa corrida quedaron con un
 * `brief_sha` que es el hash de la copia con CRLF, y no coincide con el que ve cualquier checkout
 * limpio (este worktree, CI en Linux), donde git ya normalizó el archivo a LF.
 */
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { hashDeArchivo } from '../scripts/lib/corridas.ts';
import { sha256 } from '../scripts/lib/hash.ts';

const temporales: string[] = [];
afterAll(() => {
  for (const d of temporales.splice(0)) rmSync(d, { recursive: true, force: true });
});

function archivoTemporal(nombre: string, contenido: string | Buffer): string {
  const dir = mkdtempSync(path.join(tmpdir(), 'la-casta-hash-'));
  temporales.push(dir);
  const ruta = path.join(dir, nombre);
  writeFileSync(ruta, contenido);
  return ruta;
}

describe('hashDeArchivo(): normaliza el fin de línea de los archivos de texto', () => {
  it('da el mismo hash para el mismo texto con LF y con CRLF (.md)', () => {
    const textoLF = '# Brief de prueba\n\nUna línea.\nOtra línea.\n';
    const textoCRLF = textoLF.replace(/\n/g, '\r\n');
    const rutaLF = archivoTemporal('brief.md', textoLF);
    const rutaCRLF = archivoTemporal('brief.md', textoCRLF);

    expect(hashDeArchivo(rutaLF)).toBe(hashDeArchivo(rutaCRLF));
    // Y da el mismo resultado que hashear el texto ya normalizado a mano.
    expect(hashDeArchivo(rutaLF)).toBe(sha256(Buffer.from(textoLF, 'utf8')));
  });

  it('también normaliza un CR suelto (Mac clásico) y otras extensiones de texto (.yaml, .json, .ts)', () => {
    const textoLF = 'politico: batlle\ntema: economia/impuestos\n';
    const textoCR = textoLF.replace(/\n/g, '\r');
    const rutaLF = archivoTemporal('registro.yaml', textoLF);
    const rutaCR = archivoTemporal('registro.yaml', textoCR);
    expect(hashDeArchivo(rutaLF)).toBe(hashDeArchivo(rutaCR));

    for (const ext of ['.json', '.jsonl', '.ts', '.astro', '.csv', '.txt', '.yml']) {
      const lf = archivoTemporal(`x${ext}`, 'a\nb\n');
      const crlf = archivoTemporal(`x${ext}`, 'a\r\nb\r\n');
      expect(hashDeArchivo(lf)).toBe(hashDeArchivo(crlf));
    }
  });

  it('no normaliza un binario: el hash de un .pdf con bytes CRLF es el de los bytes crudos', () => {
    const bytesConCRLF = Buffer.from('%PDF-1.4\r\nalgo\r\nmas\r\n', 'latin1');
    const rutaPdf = archivoTemporal('documento.pdf', bytesConCRLF);
    expect(hashDeArchivo(rutaPdf)).toBe(sha256(bytesConCRLF));
    // Distinto del hash que daría si se normalizara: confirma que el PDF no pasa por la normalización.
    const normalizado = Buffer.from(bytesConCRLF.toString('latin1').replace(/\r\n/g, '\n'), 'latin1');
    expect(hashDeArchivo(rutaPdf)).not.toBe(sha256(normalizado));
  });

  it('un archivo sin extensión de texto conocida tampoco se normaliza', () => {
    const bytesConCRLF = Buffer.from('a\r\nb\r\n', 'latin1');
    const ruta = archivoTemporal('sin-extension-conocida.bin', bytesConCRLF);
    expect(hashDeArchivo(ruta)).toBe(sha256(bytesConCRLF));
  });
});
