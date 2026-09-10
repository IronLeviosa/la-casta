/**
 * Formato --breve del validador (docs/plan-2026-09.md, fase 1, ítem 1.2).
 *
 * Los primeros bloques corren `validar()` sobre las fixtures existentes y verifican el formato
 * de línea `archivo · campo: mensaje`, el resumen por etapa y la línea final, igual que hace
 * `tests/validar.test.ts` con el modo normal.
 *
 * La condensación (>5 archivos con el mismo campo+mensaje) no aparece en ninguna fixture mala
 * existente: cada una overlaya un solo archivo. En vez de forzar una regla de negocio a repetirse
 * en seis fichas distintas, se arma acá una fixture chica ad-hoc con seis declaraciones que citan
 * un medio inexistente (mismo campo `evidencia.fuentes.0.medio`, mismo mensaje): un caso real que
 * pasa por `validar()` completo, no datos inventados para la función de formato.
 */
import { mkdtempSync, rmSync, writeFileSync, cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { validar, formatoBreve, lineasBreve } from '../scripts/validar.ts';
import { FIXTURE_OK, limpiarFixtures, prepararFixture } from './ayuda.ts';

afterAll(limpiarFixtures);

const OPCIONES = { escribirSimetria: false as const };

describe('formatoBreve() sobre la fixture buena', () => {
  it('sin errores ni avisos agregados: solo las líneas de etapa y el total', async () => {
    const raiz = prepararFixture();
    const r = await validar({ rootDir: raiz, ...OPCIONES });
    const salida = formatoBreve(r);
    const lineas = salida.split('\n');

    // Ninguna línea de fallo (llevarían "·"), pero sí una por etapa y el total al final.
    expect(lineas.some((l) => l.includes('·'))).toBe(false);
    expect(lineas).toEqual(['esquema: ok', 'referencias: ok', 'tiers: ok', 'fuentes: omitida', 'citas: omitida', 'simetria: ok', `validado: ${r.registros} registro(s), 0 error(es), ${r.avisos.length} aviso(s)`]);
  });

  it('con --avisos agrega los avisos en el mismo formato de una línea', async () => {
    const raiz = prepararFixture();
    const r = await validar({ rootDir: raiz, ...OPCIONES });
    expect(r.avisos.length).toBeGreaterThan(0); // el clon recién bajado avisa "Sin verificar en ledger".

    const salida = formatoBreve(r, { avisos: true });
    const lineas = salida.split('\n');
    const lineasDeAviso = lineasBreve(r.avisos);
    for (const l of lineasDeAviso) expect(lineas).toContain(l);
    // Sin --avisos esas líneas no aparecen.
    const sinAvisos = formatoBreve(r).split('\n');
    for (const l of lineasDeAviso) expect(sinAvisos).not.toContain(l);
  });

  it('con --solo referencias, todas las demás etapas quedan "omitida" y solo esa corre de verdad', async () => {
    const raiz = prepararFixture();
    const r = await validar({ rootDir: raiz, solo: 'referencias', ...OPCIONES });
    const lineas = formatoBreve(r).split('\n');
    expect(lineas).toEqual(['esquema: omitida', 'referencias: ok', 'tiers: omitida', 'fuentes: omitida', 'citas: omitida', 'simetria: omitida', `validado: ${r.registros} registro(s), 0 error(es), 0 aviso(s)`]);
  });
});

describe('formatoBreve() sobre fixtures malas', () => {
  it('fuente-faltante: una línea "archivo · campo: mensaje" y la etapa esquema en rojo', async () => {
    const raiz = prepararFixture('fuente-faltante');
    const r = await validar({ rootDir: raiz, ...OPCIONES });
    expect(r.codigo).toBe(1);

    const lineas = formatoBreve(r).split('\n');
    const lineasDeError = lineas.filter((l) => l.includes(' · '));
    expect(lineasDeError.length).toBe(r.errores.length);
    for (const p of r.errores) {
      expect(lineasDeError).toContain(`${p.archivo} · ${p.campo}: ${p.mensaje.replace(/\s+/g, ' ').trim()}`);
    }
    // Nada de tablas: ninguna línea de error mide más que archivo · campo: mensaje en una sola línea.
    for (const l of lineasDeError) expect(l.split('\n').length).toBe(1);

    expect(lineas).toContain('esquema: 1 error(es)');
    // El validador corta en esquema: no hay líneas de etapas posteriores.
    expect(lineas.some((l) => l.startsWith('referencias:'))).toBe(false);
    expect(lineas[lineas.length - 1]).toBe(`validado: ${r.registros} registro(s), ${r.errores.length} error(es), ${r.avisos.length} aviso(s)`);
  });

  it('reportado-un-grupo: agrupa por archivo en orden alfabético cuando hay más de un error', async () => {
    const raiz = prepararFixture('reportado-un-grupo');
    const r = await validar({ rootDir: raiz, ...OPCIONES });
    expect(r.codigo).toBe(1);

    const lineas = formatoBreve(r).split('\n');
    const lineasDeError = lineas.filter((l) => l.includes(' · '));
    const archivos = lineasDeError.map((l) => l.split(' · ')[0]);
    expect(archivos).toEqual([...archivos].sort());
  });

  it('nunca imprime el informe de simetría ni una tabla ancha', async () => {
    const raiz = prepararFixture('medio-desconocido');
    const r = await validar({ rootDir: raiz, ...OPCIONES });
    const salida = formatoBreve(r);
    expect(salida).not.toContain('Por partido');
    expect(salida).not.toContain('Cobertura por tema');
    expect(salida).not.toContain('--'); // separador de `tabla()`
  });
});

// ---------------------------------------------------------------------------
// Condensación: el mismo campo+mensaje en más de 5 archivos.
// ---------------------------------------------------------------------------

const temporalesCondensados: string[] = [];
afterAll(() => {
  for (const d of temporalesCondensados.splice(0)) rmSync(d, { recursive: true, force: true });
});

/**
 * Copia la fixture buena y agrega `n` declaraciones nuevas de lacalle-pou, todas citando el mismo
 * medio inexistente ("medio-inventado-condensado"): cada una dispara el mismo error de referencias
 * (`evidencia.fuentes.0.medio`, "Medio desconocido: ...") en un archivo distinto.
 */
function prepararFixtureCondensada(n: number): string {
  const destino = mkdtempSync(path.join(tmpdir(), 'la-casta-breve-'));
  temporalesCondensados.push(destino);
  cpSync(FIXTURE_OK, destino, { recursive: true });

  for (let i = 1; i <= n; i++) {
    const fecha = `2020-06-${String(i).padStart(2, '0')}`;
    const yaml = `politico: lacalle-pou
tema: economia/impuestos
fecha: ${fecha}
contexto: gobierno
cargo_en_ese_momento: Presidente de la República
cita: >-
  Frase de prueba número ${i} para condensar mensajes repetidos en modo breve.
resumen: Frase de prueba para condensación en modo breve.
evidencia:
  nivel: textual
  fuentes:
    - url: https://ejemplo.uy/condensado-${i}
      medio: medio-inventado-condensado
      fecha: ${fecha}
      tipo: nota
      titulo: Nota de prueba ${i}
      cita: >-
        Frase de prueba número ${i} para condensar mensajes repetidos en modo breve.
      retrieved_at: ${fecha}
revision:
  tier: publicado
procedencia:
  corrida: 2020-06-01-condensado
  agente: investigador
  agente_sha: 392a6e8aab00635be7c0a3ab995f4c8e39489bd060859912c202f324b989e786
  modelo: modelo-de-prueba
  brief_sha: 309513e55c1e15d3134aa1c8cc41b188201bf670179d7208568772edd80096bf
  fecha: ${fecha}
`;
    writeFileSync(path.join(destino, 'content', 'declaraciones', 'lacalle-pou', `${fecha}-condensado-${i}.yaml`), yaml, 'utf8');
  }
  return destino;
}

describe('condensación de mensajes repetidos', () => {
  it('con 6 archivos (más de 5) condensa en una sola línea', async () => {
    const raiz = prepararFixtureCondensada(6);
    const r = await validar({ rootDir: raiz, ...OPCIONES });
    expect(r.codigo).toBe(1);
    expect(r.errores.filter((e) => e.mensaje.includes('Medio desconocido')).length).toBe(6);

    const lineas = formatoBreve(r).split('\n');
    const condensada = lineas.find((l) => l.startsWith('evidencia.fuentes.0.medio:'));
    expect(condensada).toBeTruthy();
    expect(condensada).toContain('6 archivos:');
    expect(condensada).toContain('y 1 más');
    // Las seis rutas no aparecen sueltas como "archivo · campo: mensaje".
    expect(lineas.some((l) => l.includes('condensado-6.yaml ·'))).toBe(false);

    // Los primeros 5 archivos (orden alfabético) están listados, el sexto no.
    const archivosEsperados = Array.from({ length: 5 }, (_, i) => `content/declaraciones/lacalle-pou/2020-06-0${i + 1}-condensado-${i + 1}.yaml`);
    for (const a of archivosEsperados) expect(condensada).toContain(a);
  });

  it('con exactamente 5 archivos no condensa: cada uno queda en su propia línea', async () => {
    const raiz = prepararFixtureCondensada(5);
    const r = await validar({ rootDir: raiz, ...OPCIONES });
    expect(r.errores.filter((e) => e.mensaje.includes('Medio desconocido')).length).toBe(5);

    const lineas = formatoBreve(r).split('\n');
    expect(lineas.some((l) => l.startsWith('evidencia.fuentes.0.medio:'))).toBe(false);
    const lineasDeError = lineas.filter((l) => l.includes(' · evidencia.fuentes.0.medio:'));
    expect(lineasDeError.length).toBe(5);
  });
});
