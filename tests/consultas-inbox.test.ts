/**
 * `pnpm validar --inbox`: toda URL citada tiene que figurar en `consultas.jsonl` como leída con
 * `pnpm fuente` (regla 5 de CLAUDE.md). El crítico lo pidió en el piloto de Astori (2026-09-16),
 * cuando una gacetilla de Presidencia apareció citada sin rastro de lectura. Es aviso, no error.
 */
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { construirContenido, type Registro } from '../scripts/lib/contenido.ts';
import { avisosDeConsultas } from '../scripts/validar.ts';

const URL_CITADA = 'https://www.presidencia.gub.uy/comunicacion/comunicacionnoticias/astori-impuestos-2015';
const URL_OTRA = 'https://www.elobservador.com.uy/nota/astori-impuestos-n5970751';

const temporales: string[] = [];
afterEach(() => {
  for (const d of temporales.splice(0)) rmSync(d, { recursive: true, force: true });
});

function inboxCon(lineas: string[] | null): string {
  const dir = mkdtempSync(path.join(tmpdir(), 'la-casta-consultas-'));
  temporales.push(dir);
  if (lineas) writeFileSync(path.join(dir, 'consultas.jsonl'), lineas.map((l) => `${l}\n`).join(''), 'utf8');
  return dir;
}

function contenidoConCita(url: string, enInbox = true) {
  const registro: Registro = {
    coleccion: 'declaraciones',
    id: 'astori/2015-05-06-prueba',
    archivo: 'inbox/astori/economia/impuestos/2026-09-16/declaraciones.yaml#0',
    datos: {
      revision: { tier: 'publicado' },
      evidencia: { nivel: 'textual', fuentes: [{ url, cita: 'una cita cualquiera de prueba', medio: 'presidencia', fecha: '2015-05-06' }] },
    },
    crudo: {},
    enInbox,
  };
  return construirContenido('/repo-de-prueba', [registro], [], 1);
}

const linea = (tipo: string, q: string) => JSON.stringify({ t: '2026-09-16T10:00:00.000Z', tipo, q, resultado: 'ok' });

describe('avisosDeConsultas', () => {
  it('avisa por la URL citada que no figura como leída', () => {
    const dir = inboxCon([linea('corpus', 'Astori impuestos --politico astori'), linea('fuente', URL_OTRA)]);
    const avisos = avisosDeConsultas(contenidoConCita(URL_CITADA), dir);
    expect(avisos).toHaveLength(1);
    expect(avisos[0].campo).toBe('evidencia.fuentes.0.url');
    expect(avisos[0].mensaje).toContain(URL_CITADA);
    expect(avisos[0].mensaje).toContain('consultas.jsonl');
  });

  it('no avisa cuando la URL figura como leída, aunque la forma difiera (canonicalización)', () => {
    const dir = inboxCon([linea('fuente', `${URL_CITADA}?utm_source=x`)]);
    expect(avisosDeConsultas(contenidoConCita(URL_CITADA), dir)).toEqual([]);
  });

  it('acepta fuente_indice como lectura', () => {
    const dir = inboxCon([linea('fuente_indice', URL_CITADA)]);
    expect(avisosDeConsultas(contenidoConCita(URL_CITADA), dir)).toEqual([]);
  });

  it('sin consultas.jsonl, o sin ninguna URL en él, no avisa nada', () => {
    expect(avisosDeConsultas(contenidoConCita(URL_CITADA), inboxCon(null))).toEqual([]);
    expect(avisosDeConsultas(contenidoConCita(URL_CITADA), inboxCon([linea('corpus', 'solo búsquedas')]))).toEqual([]);
  });

  it('ignora los registros que no son del inbox y las líneas que no son JSON', () => {
    const dir = inboxCon(['esto no es json', linea('fuente', URL_OTRA)]);
    expect(avisosDeConsultas(contenidoConCita(URL_CITADA, false), dir)).toEqual([]);
  });
});
