/**
 * Utilidades de test: arma una copia temporal de `tests/fixtures/ok` y le
 * superpone una fixture mala (`tests/fixtures/malos/<regla>/`).
 *
 * Las fixtures malas son solo los archivos que cambian respecto de la buena;
 * así cada regla se lee de un vistazo y no hay 11 copias del mismo repo.
 */
import { cpSync, existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const DIR_TESTS = path.dirname(fileURLToPath(import.meta.url));
export const FIXTURE_OK = path.join(DIR_TESTS, 'fixtures', 'ok');
export const FIXTURES_MALOS = path.join(DIR_TESTS, 'fixtures', 'malos');

const temporales: string[] = [];

/** Copia la fixture buena a un directorio temporal y aplica el overlay de `regla`. */
export function prepararFixture(regla?: string): string {
  const destino = mkdtempSync(path.join(tmpdir(), 'la-casta-'));
  temporales.push(destino);
  cpSync(FIXTURE_OK, destino, { recursive: true });
  if (regla) {
    const overlay = path.join(FIXTURES_MALOS, regla);
    if (!existsSync(overlay)) throw new Error(`No existe la fixture mala "${regla}" en tests/fixtures/malos/.`);
    cpSync(overlay, destino, { recursive: true });
  }
  return destino;
}

/** Borra todos los directorios temporales creados por prepararFixture. */
export function limpiarFixtures(): void {
  for (const d of temporales.splice(0)) rmSync(d, { recursive: true, force: true });
}
