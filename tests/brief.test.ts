/**
 * `pnpm brief` (plan 2026-09, fase 4, ítem 4.2): el modo `--programa` arma el brief de una
 * corrida "programa de gobierno" (un documento por candidatura, misma plantilla para todas),
 * que carga las colecciones `promesas` y `declaraciones`.
 *
 * El primer bloque es una prueba de regresión: `construirBrief()` en modo tema tiene que seguir
 * produciendo, carácter por carácter, el mismo brief que producía el script antes de agregar el
 * modo `--programa`. El golden de `tests/fixtures/brief-tema-golden.md` se generó corriendo la
 * versión de `scripts/brief.ts` anterior a este cambio (`git show HEAD:scripts/brief.ts` antes de
 * la refactorización) sobre la misma fixture y los mismos argumentos; el único tramo que varía
 * entre corridas (la ruta de `${CORPUS_DIR}`, que depende del directorio temporal del sistema) se
 * dejó como marcador `__CORPUS_DIR__` y se sustituye acá por el valor real.
 */
import { readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { construirBrief } from '../scripts/brief.ts';
import { DIR_TESTS, limpiarFixtures, prepararFixture } from './ayuda.ts';

afterAll(limpiarFixtures);

describe('construirBrief() — modo tema (comportamiento existente, sin cambios)', () => {
  it('produce exactamente el mismo brief que antes de agregar el modo --programa', () => {
    const raiz = prepararFixture();
    const { id, brief } = construirBrief(raiz, 'lacalle-pou', 'economia/impuestos', { fecha: '2026-09-10' });

    expect(id).toBe('2026-09-10-lacalle-pou-economia-impuestos');

    const corpusDir = path.resolve(tmpdir(), 'la-casta-corpus');
    const golden = readFileSync(path.join(DIR_TESTS, 'fixtures', 'brief-tema-golden.md'), 'utf8').split('__CORPUS_DIR__').join(corpusDir);
    expect(brief).toBe(golden);
  });

  it('el modo --vetos tampoco cambia: sigue sin tocar las colecciones de promesas ni programa', () => {
    const raiz = prepararFixture();
    const { id, brief } = construirBrief(raiz, 'lacalle-pou', undefined, { vetos: true, fecha: '2026-09-10' });

    expect(id).toBe('2026-09-10-lacalle-pou-vetos');
    expect(brief).toContain('## 2. Objeto de la corrida: los vetos');
    expect(brief).not.toContain('programa de gobierno');
    expect(brief).not.toContain('--eleccion');
  });
});

describe('construirBrief() — modo --programa (corrida "programa de gobierno")', () => {
  const URL_PROGRAMA = 'https://www.gub.uy/corte-electoral/sites/corte-electoral/files/documentos/publicaciones/Partido%20Nacional_1.pdf';

  it('arma el id y las secciones esperadas, y no carga reglas de chequeos ni de menciones', () => {
    const raiz = prepararFixture();
    const { id, brief } = construirBrief(raiz, 'lacalle-pou', undefined, { programa: URL_PROGRAMA, eleccion: '2019', fecha: '2026-09-10' });

    expect(id).toBe('2026-09-10-lacalle-pou-programa-2019');
    expect(brief).toContain('# Brief de investigación · corrida 2026-09-10-lacalle-pou-programa-2019');

    // Sección 2: objeto de la corrida, con la definición de promesa concreta y la referencia
    // al documento de esta corrida.
    expect(brief).toContain('## 2. Objeto de la corrida: las promesas del programa de gobierno');
    expect(brief).toContain(URL_PROGRAMA);
    expect(brief).toContain('compromiso de hacer, no hacer, mantener o crear algo');
    expect(brief).toContain('se separa en una promesa por componente');
    expect(brief).toContain('`fecha_promesa` es la fecha del documento');
    expect(brief).toContain('No busques `evidencias_candidatas` en esta corrida');
    expect(brief).toContain('--indice --politico lacalle-pou');
    expect(brief).toContain('pnpm fuente --lote');
    expect(brief).toContain('Corte Electoral');
    expect(brief).toContain('documento_oficial');

    // Regla 0 propia del modo programa: mismo criterio para todas las candidaturas, y si falta
    // la corrida de otra candidatura de la misma elección, que quede dicho en el informe.
    expect(brief).toContain('Regla 0: objetividad por encima de todo.');
    expect(brief).toContain('vale para todas las candidaturas de esta elección');
    expect(brief).toContain('el informe final lo dice, para que la corrida siguiente sea esa');

    // Sección 3b: solo las colecciones de esta corrida (promesas y declaraciones).
    expect(brief).toContain('## 3b. Reglas de las colecciones de esta corrida');

    // Salida esperada.
    expect(brief).toContain('## 7. Salida esperada');
    expect(brief).toContain('inbox/lacalle-pou/programa-2019/2026-09-10/');
    expect(brief).toContain('promesas.yaml');
    expect(brief).toContain('declaraciones.yaml');
    expect(brief).toContain('capitulos_cubiertos');

    // Nada de menciones ni de chequeos: esta corrida solo toca promesas y declaraciones.
    const enMinusculas = brief.toLowerCase();
    expect(enMinusculas).not.toContain('chequeo');
    expect(enMinusculas).not.toContain('mención');
    expect(enMinusculas).not.toContain('mencion');
    expect(brief).not.toContain('casos judiciales');
    expect(brief).not.toContain('evidencias_candidatas?:'); // el esquema de Promesa no las ofrece en este modo
  });

  it('no busca ni pide evidencias_candidatas, a diferencia del modo por tema', () => {
    const raiz = prepararFixture();
    const { brief: brienfTema } = construirBrief(raiz, 'lacalle-pou', 'economia/impuestos', { fecha: '2026-09-10' });
    expect(brienfTema).toContain('evidencias_candidatas?:');

    const { brief: briefPrograma } = construirBrief(raiz, 'lacalle-pou', undefined, { programa: URL_PROGRAMA, eleccion: '2019', fecha: '2026-09-11' });
    // El texto sí menciona `evidencias_candidatas` para decir que no se buscan en esta corrida,
    // pero el esquema de Promesa no ofrece el campo (a diferencia del modo por tema).
    expect(briefPrograma).toContain('No busques `evidencias_candidatas` en esta corrida');
    expect(briefPrograma).not.toContain('evidencias_candidatas?:');
    expect(briefPrograma).not.toMatch(/Promesa: \{[^}]*evidencias_candidatas/);
  });

  it('exige --eleccion junto con --programa', () => {
    const raiz = prepararFixture();
    expect(() => construirBrief(raiz, 'lacalle-pou', undefined, { programa: URL_PROGRAMA, fecha: '2026-09-10' })).toThrow(/eleccion/);
  });
});
