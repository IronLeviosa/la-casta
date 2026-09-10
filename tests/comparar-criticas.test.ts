/**
 * `pnpm comparar --criticas`: acuerdo entre dos critica.md del mismo lote (plan-2026-09,
 * fase 5.2). Fixtures con acuerdo parcial, una en cada formato de `.claude/agents/critico.md`
 * («Formato de `critica.md`»): el bloque `## Resumen` en YAML (nuevo) y los encabezados
 * `### <registro> …` con `- severidad:` / `- tipo:` (viejo, sin ese bloque).
 */
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { compararCriticas, compararCriticasLotes, parsearArchivoDeLotes, parsearCritica } from '../scripts/comparar.ts';

const temporales: string[] = [];
function dirTemp(): string {
  const d = mkdtempSync(path.join(tmpdir(), 'la-casta-comparar-criticas-'));
  temporales.push(d);
  return d;
}
afterEach(() => {
  for (const d of temporales.splice(0)) rmSync(d, { recursive: true, force: true });
});

// ---------------------------------------------------------------------------
// Fixtures: mismo lote, acuerdo parcial. La barata (Sonnet, formato nuevo) revisó
// declaraciones[0..4]; la cara (Opus, formato viejo) revisó declaraciones[0..3] y
// politicos[0]. Coinciden en declaraciones[0] y [1], difieren en [2] y [3] (en [2] la
// cara marca `bloquea` y la barata solo `aviso`: el caso que la regla 14 quiere pescar).
// ---------------------------------------------------------------------------

const CRITICA_BARATA = `# Crítica — corrida test (barata, Sonnet)

Lote: inbox/x/y/2026-09-01/

## Resumen
\`\`\`yaml
- registro: declaraciones[0]
  severidad: corregir
  tipo: contexto_omitido
- registro: declaraciones[1]
  severidad: sin_objecion
  tipo: sin_objecion
- registro: declaraciones[2]
  severidad: aviso
  tipo: asimetria
- registro: declaraciones[3]
  severidad: corregir
  tipo: presentacion
- registro: declaraciones[4]
  severidad: corregir
  tipo: documento_previsible
\`\`\`

## Objeciones por registro

### declaraciones[4] — 2026-01-05 — algo que la cara no revisó
- severidad: corregir
- tipo: documento_previsible
- objecion: falta un documento previsible
`;

const CRITICA_CARA = `# Crítica — corrida test (cara, Opus)

Lote: inbox/x/y/2026-09-01/

### declaraciones[0] — 2026-01-01 — algo
- severidad: corregir
- tipo: contexto_omitido
- objecion: falta contexto

### declaraciones[1] — 2026-01-02 — otra cosa
- severidad: sin_objecion
- tipo: sin_objecion

### declaraciones[2] — 2026-01-03 — una cita grave
- severidad: bloquea
- tipo: riesgo_legal
- objecion: afirma más de lo que la fuente respalda

### declaraciones[3] — 2026-01-04 — otra cita
- severidad: aviso
- tipo: presentacion

### politicos[0] — identidad
- severidad: bloquea
- tipo: riesgo_legal
- objecion: la cara encontró un homónimo que la barata no revisó

### S1 — defecto sistémico sin severidad propia
Prosa libre, sin línea "- severidad:" ni "- tipo:": no es un registro comparable y
\`parsearCritica\` lo tiene que descartar.
`;

describe('parsearCritica', () => {
  it('formato nuevo: lee el bloque ## Resumen, incluidos los sin_objecion', () => {
    const r = parsearCritica(CRITICA_BARATA);
    expect(r.formato).toBe('nuevo');
    expect(r.objeciones).toHaveLength(5);
    expect(r.objeciones.find((o) => o.registro === 'declaraciones[1]')).toEqual({
      registro: 'declaraciones[1]',
      severidad: 'sin_objecion',
      tipo: 'sin_objecion',
    });
  });

  it('formato viejo: lee los encabezados ### con severidad y tipo, y descarta los que no declaran severidad', () => {
    const r = parsearCritica(CRITICA_CARA);
    expect(r.formato).toBe('viejo');
    // 5 encabezados en el texto, pero "### S1" no tiene "- severidad:" y se descarta.
    expect(r.objeciones).toHaveLength(5);
    expect(r.objeciones.some((o) => o.registro === 'S1')).toBe(false);
    expect(r.objeciones.find((o) => o.registro === 'declaraciones[2]')).toEqual({
      registro: 'declaraciones[2]',
      severidad: 'bloquea',
      tipo: 'riesgo_legal',
    });
  });
});

describe('compararCriticas', () => {
  function escribirFixtures(dir: string): { barata: string; cara: string } {
    const barata = path.join(dir, 'critica-sonnet.md');
    const cara = path.join(dir, 'critica.md');
    writeFileSync(barata, CRITICA_BARATA, 'utf8');
    writeFileSync(cara, CRITICA_CARA, 'utf8');
    return { barata, cara };
  }

  it('alinea por registro y separa lo exclusivo de cada lado', () => {
    const dir = dirTemp();
    const { barata, cara } = escribirFixtures(dir);
    const r = compararCriticas(barata, cara);

    expect(r.formato_barata).toBe('nuevo');
    expect(r.formato_cara).toBe('viejo');
    expect(r.comunes).toBe(4);
    expect(r.solo_barata).toEqual(['declaraciones[4]']);
    expect(r.solo_cara).toEqual(['politicos[0]']);
  });

  it('kappa de Cohen sobre severidad: acuerdo parcial da 1/3 (po=0,5, pe=0,25)', () => {
    const dir = dirTemp();
    const { barata, cara } = escribirFixtures(dir);
    const r = compararCriticas(barata, cara);

    expect(r.kappa_severidad.n).toBe(4);
    expect(r.kappa_severidad.acuerdo).toBeCloseTo(0.5, 10);
    expect(r.kappa_severidad.esperado).toBeCloseTo(0.25, 10);
    expect(r.kappa_severidad.kappa).toBeCloseTo(1 / 3, 10);
    expect(r.veredicto).toBe('bajo'); // < 0,4
  });

  it('kappa de Cohen sobre tipo: tres de cuatro coinciden', () => {
    const dir = dirTemp();
    const { barata, cara } = escribirFixtures(dir);
    const r = compararCriticas(barata, cara);

    expect(r.kappa_tipo.n).toBe(4);
    expect(r.kappa_tipo.acuerdo).toBeCloseTo(0.75, 10);
    expect(r.kappa_tipo.kappa).toBeCloseTo(9 / 13, 6);
  });

  it('lista los desacuerdos con las dos versiones', () => {
    const dir = dirTemp();
    const { barata, cara } = escribirFixtures(dir);
    const r = compararCriticas(barata, cara);

    expect(r.desacuerdos.map((d) => d.registro).sort()).toEqual(['declaraciones[2]', 'declaraciones[3]']);
    const d2 = r.desacuerdos.find((d) => d.registro === 'declaraciones[2]')!;
    expect(d2.barata).toEqual({ severidad: 'aviso', tipo: 'asimetria' });
    expect(d2.cara).toEqual({ severidad: 'bloquea', tipo: 'riesgo_legal' });
  });

  it('objeciones exclusivas de cada lado, por severidad', () => {
    const dir = dirTemp();
    const { barata, cara } = escribirFixtures(dir);
    const r = compararCriticas(barata, cara);

    expect(r.exclusivas_barata).toEqual([{ registro: 'declaraciones[4]', severidad: 'corregir', tipo: 'documento_previsible' }]);
    expect(r.exclusivas_cara).toEqual([{ registro: 'politicos[0]', severidad: 'bloquea', tipo: 'riesgo_legal' }]);
  });

  it('detecta el bloquea que la barata dejó pasar (severidad distinta o registro ausente)', () => {
    const dir = dirTemp();
    const { barata, cara } = escribirFixtures(dir);
    const r = compararCriticas(barata, cara);

    expect(r.bloqueos_no_igualados.map((b) => b.registro).sort()).toEqual(['declaraciones[2]', 'politicos[0]']);
    expect(r.regla14).toContain('bajo'); // acuerdo bajo: ya alcanza para no pasar a Sonnet
    expect(r.regla14).toContain('Opus');
  });

  it('--json (vía el objeto de resultado) no repite el texto armado', () => {
    const dir = dirTemp();
    const { barata, cara } = escribirFixtures(dir);
    const r = compararCriticas(barata, cara);
    expect(r.texto).toContain('Alineados por registro: 4');
    expect(r.texto).toContain('solo en barata: 1');
    expect(r.texto).toContain('solo en cara: 1');
    expect(r.texto).toContain('Desacuerdos (mismo registro, calificación distinta): 2');
  });

  it('acuerdo total y ningún bloquea perdido: el crítico puede correr en Sonnet', () => {
    const dir = dirTemp();
    const criticaIdentica = `## Resumen
\`\`\`yaml
- registro: declaraciones[0]
  severidad: bloquea
  tipo: riesgo_legal
- registro: declaraciones[1]
  severidad: corregir
  tipo: presentacion
- registro: declaraciones[2]
  severidad: aviso
  tipo: asimetria
- registro: declaraciones[3]
  severidad: sin_objecion
  tipo: sin_objecion
\`\`\`
`;
    const barata = path.join(dir, 'critica-sonnet.md');
    const cara = path.join(dir, 'critica.md');
    writeFileSync(barata, criticaIdentica, 'utf8');
    writeFileSync(cara, criticaIdentica, 'utf8');
    const r = compararCriticas(barata, cara);

    expect(r.kappa_severidad.kappa).toBe(1);
    expect(r.veredicto).toBe('alto');
    expect(r.bloqueos_no_igualados).toHaveLength(0);
    expect(r.regla14).toContain('puede correr en Sonnet');
  });

  it('rechaza una ruta que no existe', () => {
    expect(() => compararCriticas('no/existe/a.md', 'no/existe/b.md')).toThrow(/No existe/);
  });
});

describe('pnpm comparar --criticas --lotes', () => {
  it('parsearArchivoDeLotes: una línea "barata cara" por lote, ignora blancos y comentarios', () => {
    const dir = dirTemp();
    mkdirSync(path.join(dir, 'lote-1'));
    writeFileSync(path.join(dir, 'lote-1', 'critica-sonnet.md'), CRITICA_BARATA, 'utf8');
    writeFileSync(path.join(dir, 'lote-1', 'critica.md'), CRITICA_CARA, 'utf8');
    writeFileSync(
      path.join(dir, 'lotes.txt'),
      '# comentario\n\nlote-1/critica-sonnet.md lote-1/critica.md\n',
      'utf8',
    );
    const pares = parsearArchivoDeLotes(path.join(dir, 'lotes.txt'));
    expect(pares).toHaveLength(1);
    expect(pares[0]!.barata).toBe(path.resolve(dir, 'lote-1', 'critica-sonnet.md'));
    expect(pares[0]!.cara).toBe(path.resolve(dir, 'lote-1', 'critica.md'));
  });

  it('parsearArchivoDeLotes: rechaza una línea que no tiene exactamente dos rutas', () => {
    const dir = dirTemp();
    writeFileSync(path.join(dir, 'lotes.txt'), 'solo-una-ruta.md\n', 'utf8');
    expect(() => parsearArchivoDeLotes(path.join(dir, 'lotes.txt'))).toThrow(/dos rutas/);
  });

  it('compararCriticasLotes agrega una tabla y un kappa global', () => {
    const dir = dirTemp();
    for (const lote of ['lote-1', 'lote-2']) {
      mkdirSync(path.join(dir, lote));
      writeFileSync(path.join(dir, lote, 'critica-sonnet.md'), CRITICA_BARATA, 'utf8');
      writeFileSync(path.join(dir, lote, 'critica.md'), CRITICA_CARA, 'utf8');
    }
    const pares = [
      { barata: path.join(dir, 'lote-1', 'critica-sonnet.md'), cara: path.join(dir, 'lote-1', 'critica.md') },
      { barata: path.join(dir, 'lote-2', 'critica-sonnet.md'), cara: path.join(dir, 'lote-2', 'critica.md') },
    ];
    const r = compararCriticasLotes(pares);

    expect(r.filas).toHaveLength(2);
    expect(r.filas.map((f) => f.lote).sort()).toEqual(['lote-1', 'lote-2']);
    // Dos copias del mismo lote: mismas proporciones, mismo kappa que un solo lote (1/3).
    expect(r.kappa_severidad_global.n).toBe(8);
    expect(r.kappa_severidad_global.kappa).toBeCloseTo(1 / 3, 10);
    expect(r.bloqueos_no_igualados_total).toBe(4); // 2 por lote, 2 lotes
    expect(r.veredicto_global).toBe('bajo');
    expect(r.texto).toContain('lote-1');
    expect(r.texto).toContain('lote-2');
  });
});
