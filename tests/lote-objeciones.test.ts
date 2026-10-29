/**
 * `pnpm lote objeciones <critica.md> [<registro>] --prosa` (docs/plan-herramientas-lote.md, punto 3).
 *
 * Reproducción con una `critica.md` real: en la corrida de El Observador (2026-10-29) el editor
 * corrió `… critica.md --prosa declaraciones[0]` y recibió solo los encabezados de todas las
 * objeciones, sin la prosa ni el filtro. La causa: `parsearArgs` trataba `--prosa` como una opción
 * con valor y se tragaba el registro (`opciones.prosa = "declaraciones[0]"`, `prosa === true` falso).
 * El editor terminó leyendo `critica.md` entero, que es lo que la opción quería evitar.
 *
 * Con la crítica de Batlle (`data/corridas/2026-09-16-batlle-economia-impuestos/critica.md`) se
 * reproduce el síntoma exacto: 31 líneas de encabezado, ninguna de prosa.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { argumentosDeObjeciones, INTERRUPTORES_LOTE, objeciones } from '../scripts/lote.ts';
import { parsearArgs } from '../scripts/lib/log.ts';
import { DIR_TESTS } from './ayuda.ts';

const RAIZ = path.resolve(DIR_TESTS, '..');
const CRITICA_REAL = path.join(RAIZ, 'data', 'corridas', '2026-09-16-batlle-economia-impuestos', 'critica.md');

const temporales: string[] = [];
function dirTemp(): string {
  const d = mkdtempSync(path.join(tmpdir(), 'la-casta-lote-objeciones-'));
  temporales.push(d);
  return d;
}
afterEach(() => {
  for (const d of temporales.splice(0)) rmSync(d, { recursive: true, force: true });
});

/** Lo que hace el CLI antes de llamar a `objeciones`: parsea argv, resuelve los argumentos y llama. */
function comoElCli(argv: string[], rutaCritica: string): string {
  const { posicionales, opciones } = parsearArgs(argv, { booleanas: INTERRUPTORES_LOTE });
  const { registro, prosa } = argumentosDeObjeciones(posicionales, opciones);
  return objeciones(rutaCritica, registro, { prosa });
}

describe('objeciones --prosa <registro> con una critica.md real', () => {
  const hayReal = existsSync(CRITICA_REAL);

  it.skipIf(!hayReal)('el síntoma: el parseo viejo (sin interruptores) pierde el registro y la prosa', () => {
    const { posicionales, opciones } = parsearArgs([CRITICA_REAL, '--prosa', 'declaraciones[0]']);
    expect(opciones.prosa).toBe('declaraciones[0]');
    const { registro, prosa } = { registro: posicionales[1], prosa: opciones.prosa === true };
    const salida = objeciones(CRITICA_REAL, registro, { prosa });
    // Una línea de encabezado por objeción (31), ninguna con la prosa.
    expect(salida.split('\n')).toHaveLength(31);
    expect(salida).not.toContain('accion_sugerida');
  });

  it.skipIf(!hayReal)('--prosa <registro> trae la prosa de ese registro y solo la de ese registro', () => {
    const salida = comoElCli([CRITICA_REAL, '--prosa', 'declaraciones[0]'], CRITICA_REAL);
    expect(salida.split('\n')[0]).toBe('declaraciones[0] — corregir (contexto_omitido)');
    expect(salida).toContain('### declaraciones[0] — 1999-11-15');
    expect(salida).toContain('accion_sugerida:');
    expect(salida).not.toContain('declaraciones[2]');
    expect(salida.split('\n').length).toBeLessThan(15);
  });

  it.skipIf(!hayReal)('<registro> --prosa y --prosa <registro> dan lo mismo', () => {
    expect(comoElCli([CRITICA_REAL, 'declaraciones[3]', '--prosa'], CRITICA_REAL)).toBe(comoElCli([CRITICA_REAL, '--prosa', 'declaraciones[3]'], CRITICA_REAL));
  });

  it.skipIf(!hayReal)('--prosa=<registro> también filtra', () => {
    const { posicionales, opciones } = parsearArgs([CRITICA_REAL, '--prosa=declaraciones[0]'], { booleanas: INTERRUPTORES_LOTE });
    expect(argumentosDeObjeciones(posicionales, opciones)).toEqual({ rutaCritica: CRITICA_REAL, registro: 'declaraciones[0]', prosa: true });
  });

  it.skipIf(!hayReal)('sin registro, --prosa trae un bloque por cada objeción', () => {
    const salida = objeciones(CRITICA_REAL, undefined, { prosa: true });
    expect(salida.match(/^### /gm)).toHaveLength(31);
  });

  it.skipIf(!hayReal)('por la línea de comandos real, igual', () => {
    const r = spawnSync(process.execPath, ['--import', 'tsx', path.join('scripts', 'lote.ts'), 'objeciones', CRITICA_REAL, '--prosa', 'declaraciones[0]'], { cwd: RAIZ, encoding: 'utf8' });
    expect(r.status, r.stderr).toBe(0);
    expect(r.stdout).toContain('### declaraciones[0] — 1999-11-15');
    expect(r.stdout).not.toContain('declaraciones[2]');
  }, 60_000);
});

// ---------------------------------------------------------------------------
// Críticas con el mismo registro repetido y con objeciones al lote
// ---------------------------------------------------------------------------

const CRITICA_CON_REPETIDOS = `# Crítica — corrida test

## Resumen
\`\`\`yaml
- registro: chequeos/astori/2016-05-26-irpf
  severidad: bloquea
  tipo: un_solo_grupo
- registro: chequeos/astori/2016-05-26-irpf
  severidad: corregir
  tipo: documento_previsible
- registro: chequeos/astori/2016-05-26-irpf-franja
  severidad: aviso
  tipo: presentacion
- registro: declaraciones[1]
  severidad: corregir
  tipo: presentacion
- registro: declaraciones[10]
  severidad: aviso
  tipo: presentacion
- registro: lote
  severidad: bloquea
  tipo: asimetria
- registro: lote
  severidad: corregir
  tipo: documento_previsible
- registro: medios[3]
  severidad: aviso
  tipo: presentacion
\`\`\`

## Objeciones por registro

### chequeos/astori/2016-05-26-irpf — resolución con El Observador
- objecion: una sola fuente de un grupo.

### chequeos/astori/2016-05-26-irpf — dato_real
- objecion: el dato real no tiene documento oficial.

### chequeos/astori/2016-05-26-irpf-franja — otra cosa
- objecion: texto del registro parecido pero distinto.

### declaraciones[10] — 2020-01-01 — diez
- objecion: texto de la declaración diez.

### declaraciones[1] — 2020-01-01 — uno
- objecion: texto de la declaración uno.

## Objeciones al lote

### 1. \`bloquea\` · asimetria — faltan nueve años
Texto del hueco de nueve años.

### 2. \`corregir\` · documento_previsible — el registro oficial era legible
Texto del documento previsible.

## Cobertura
`;

describe('objeciones --prosa: registros repetidos, prefijos y objeciones al lote', () => {
  function conRepetidos(registro?: string): string {
    const archivo = path.join(dirTemp(), 'critica.md');
    writeFileSync(archivo, CRITICA_CON_REPETIDOS, 'utf8');
    return objeciones(archivo, registro, { prosa: true });
  }

  it('un registro con dos objeciones imprime sus dos bloques una sola vez', () => {
    const salida = conRepetidos('chequeos/astori/2016-05-26-irpf');
    expect(salida.match(/una sola fuente de un grupo/g)).toHaveLength(1);
    expect(salida.match(/el dato real no tiene documento oficial/g)).toHaveLength(1);
    expect(salida).toContain('ya está impresa más arriba');
    // El registro cuyo id empieza igual es otro registro.
    expect(salida).not.toContain('texto del registro parecido pero distinto');
  });

  it('declaraciones[1] no trae el bloque de declaraciones[10], ni al revés', () => {
    const uno = conRepetidos('declaraciones[1]');
    expect(uno).toContain('texto de la declaración uno');
    expect(uno).not.toContain('texto de la declaración diez');
    const diez = conRepetidos('declaraciones[10]');
    expect(diez).toContain('texto de la declaración diez');
    expect(diez).not.toContain('texto de la declaración uno');
  });

  it('las objeciones al lote (registro: lote) se encuentran por severidad y tipo, cada una con su bloque', () => {
    const salida = conRepetidos('lote');
    expect(salida).toContain('lote — bloquea (asimetria)');
    expect(salida).toContain('Texto del hueco de nueve años.');
    expect(salida).toContain('Texto del documento previsible.');
    expect(salida).not.toContain('no se encontró el bloque');
  });

  it('un registro sin bloque propio lo dice y apunta a las objeciones al lote', () => {
    const salida = conRepetidos('medios[3]');
    expect(salida).toContain('no se encontró el bloque de prosa de "medios[3]"');
    expect(salida).toContain('Objeciones al lote');
  });

  it('sin --prosa sigue siendo una línea por objeción', () => {
    const archivo = path.join(dirTemp(), 'critica.md');
    writeFileSync(archivo, CRITICA_CON_REPETIDOS, 'utf8');
    const salida = objeciones(archivo);
    expect(salida.split('\n')).toHaveLength(8);
    expect(salida).not.toContain('objecion:');
  });
});

describe('argumentosDeObjeciones', () => {
  it('registro posicional y --prosa', () => {
    expect(argumentosDeObjeciones(['c.md', 'chequeos[0]'], { prosa: true })).toEqual({ rutaCritica: 'c.md', registro: 'chequeos[0]', prosa: true });
  });

  it('--prosa con valor y sin registro posicional: el valor es el registro', () => {
    expect(argumentosDeObjeciones(['c.md'], { prosa: 'chequeos[0]' })).toEqual({ rutaCritica: 'c.md', registro: 'chequeos[0]', prosa: true });
  });

  it('sin --prosa: no hay prosa', () => {
    expect(argumentosDeObjeciones(['c.md'], {})).toEqual({ rutaCritica: 'c.md', registro: undefined, prosa: false });
    expect(argumentosDeObjeciones(['c.md'], { prosa: 'false' }).prosa).toBe(false);
  });
});

// Evita que el archivo real quede sin leer si cambia de lugar: el test de arriba se saltea, este avisa.
describe('la critica.md real usada de fixture', () => {
  it('existe (si se movió, actualizá CRITICA_REAL)', () => {
    expect(existsSync(CRITICA_REAL), CRITICA_REAL).toBe(true);
    expect(readFileSync(CRITICA_REAL, 'utf8')).toContain('## Resumen');
  });
});
