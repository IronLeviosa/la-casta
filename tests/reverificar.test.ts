/**
 * `pnpm reverificar` (docs/plan-2026-09.md, ítem 2.2): parte pura, sin red.
 *
 * - Encontrar fuentes `verificacion: manual` en un árbol de fixtures (tests/fixtures/reverificar).
 * - Cotejar con un `obtenerTexto`/`obtenerTranscripcion` simulados (misma técnica que
 *   tests/citas.test.ts), sin tocar la red ni el corpus.
 * - Armar el registro de corrección y validarlo contra el esquema real de `correcciones`.
 * - Escribir (y agregar sin duplicar) inbox/correcciones/<fecha>/correcciones.yaml.
 */
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterAll, describe, expect, it } from 'vitest';
import { cargarContenido } from '../scripts/lib/contenido.ts';
import {
  construirCorrecciones,
  encontrarFuentesManuales,
  escribirCorrecciones,
  formatoResultado,
  reverificar,
  validarCorrecciones,
  type FuenteManual,
  type RegistroLigero,
} from '../scripts/reverificar.ts';
import type { ObtenerTexto, ObtenerTranscripcion } from '../scripts/validadores/citas.ts';

const DIR_TESTS = path.dirname(fileURLToPath(import.meta.url));
const FIXTURE_DIR = path.join(DIR_TESTS, 'fixtures', 'reverificar');

const URL_COTEJABLE = 'https://www.gub.uy/fixture/recaudacion-abril-2020';
const URL_NO_COTEJABLE = 'https://www.gub.uy/fixture/dato-no-cotejable';

/** `obtenerTexto` simulado: la fuente "cotejable" trae la cita textual; la otra, un texto ajeno. */
const obtenerTexto: ObtenerTexto = async (fuente) => {
  if (fuente.url === URL_COTEJABLE) return { texto: `Informe oficial.\n\n${fuente.cita}\n\nFin del informe.`, tipo: 'html' };
  if (fuente.url === URL_NO_COTEJABLE) return { texto: 'Documento con un contenido que no tiene relación con la cita registrada en el YAML.', tipo: 'html' };
  throw new Error(`URL inesperada en el test: ${fuente.url}`);
};
const obtenerTranscripcion: ObtenerTranscripcion = () => null;

const temporales: string[] = [];
afterAll(() => {
  for (const d of temporales.splice(0)) rmSync(d, { recursive: true, force: true });
});
function dirTemporal(): string {
  const d = mkdtempSync(path.join(tmpdir(), 'la-casta-reverificar-'));
  temporales.push(d);
  return d;
}

describe('encontrarFuentesManuales', () => {
  it('encuentra cada fuente verificacion: manual del árbol de fixtures, y ninguna automática', () => {
    const contenido = cargarContenido(FIXTURE_DIR);
    expect(contenido.errores).toEqual([]);
    const registros: RegistroLigero[] = contenido.registros.map((r) => ({ coleccion: r.coleccion, id: r.id, archivo: r.archivo, datos: r.datos }));

    const manuales = encontrarFuentesManuales(registros);
    expect(manuales.map((m) => m.fuente.url).sort()).toEqual([URL_NO_COTEJABLE, URL_COTEJABLE].sort());

    const porRegistro = new Map(manuales.map((m) => [m.registroId, m]));
    expect(porRegistro.get('chequeos/lacalle-pou/2020-04-20-recaudacion-iva')?.ruta).toBe('dato_real.fuentes.0');
    expect(porRegistro.get('chequeos/mujica/2010-05-01-ejemplo-no-cotejable')?.ruta).toBe('dato_real.fuentes.0');

    // La declaración de control no tiene ninguna fuente manual: no debe aparecer.
    expect(manuales.some((m) => m.registroId.startsWith('declaraciones/'))).toBe(false);
  });

  it('no encuentra nada en una lista vacía', () => {
    expect(encontrarFuentesManuales([])).toEqual([]);
  });
});

describe('reverificar (con lector simulado, sin red)', () => {
  it('coteja exacta la fuente cuyo texto trae la cita, y no cotejada la que trae un texto distinto', async () => {
    const { resultados, problemas } = await reverificar({ rootDir: FIXTURE_DIR, obtenerTexto, obtenerTranscripcion });
    expect(problemas).toEqual([]);
    expect(resultados).toHaveLength(2);

    const porUrl = new Map(resultados.map((r) => [r.fm.fuente.url, r]));
    expect(porUrl.get(URL_COTEJABLE)?.estado).toBe('cotejada');
    expect(porUrl.get(URL_NO_COTEJABLE)?.estado).toBe('no_cotejada');
    expect(porUrl.get(URL_NO_COTEJABLE)?.motivo).toMatch(/no encontrada/);
  });

  it('avisa (sin lanzar) cuando --inbox apunta a una carpeta inexistente, y sigue con content/', async () => {
    const { resultados, problemas } = await reverificar({
      rootDir: FIXTURE_DIR,
      inboxDir: path.join(FIXTURE_DIR, 'no-existe'),
      obtenerTexto,
      obtenerTranscripcion,
    });
    expect(problemas.length).toBeGreaterThan(0);
    expect(resultados).toHaveLength(2); // igual revisó content/
  });
});

describe('formatoResultado', () => {
  const fmDeEjemplo: FuenteManual = {
    registroId: 'chequeos/x/y',
    coleccion: 'chequeos',
    archivo: 'content/chequeos/x/y.yaml',
    ruta: 'dato_real.fuentes.0',
    fuente: { url: 'https://x.uy/y', medio: 'x', fecha: '2020-01-01', tipo: 'documento_oficial', cita: 'cita de ejemplo de más de veinte caracteres', retrieved_at: '2020-01-01' },
  };

  it('da el texto exacto de las tres formas que imprime la tabla', () => {
    expect(formatoResultado({ fm: fmDeEjemplo, estado: 'cotejada' })).toBe('cotejada');
    expect(formatoResultado({ fm: fmDeEjemplo, estado: 'no_cotejada', motivo: 'cita no encontrada' })).toBe('no cotejada: cita no encontrada');
    expect(formatoResultado({ fm: fmDeEjemplo, estado: 'no_se_pudo_leer', motivo: 'HTTP 404' })).toBe('no se pudo leer: HTTP 404');
  });
});

describe('construirCorrecciones + validarCorrecciones', () => {
  it('arma una corrección cotejo_con_primaria solo para el registro que cotejó, y valida contra el esquema', async () => {
    const { resultados } = await reverificar({ rootDir: FIXTURE_DIR, obtenerTexto, obtenerTranscripcion });
    const propuestas = construirCorrecciones(resultados, '2026-09-10');

    // El registro de mujica no cotejó ninguna fuente: no genera corrección.
    expect(propuestas).toHaveLength(1);
    const [p] = propuestas;
    expect(p.registroId).toBe('chequeos/lacalle-pou/2020-04-20-recaudacion-iva');
    expect(p.fuentesCotejadas).toEqual([URL_COTEJABLE]);
    expect(p.correccion.tipo).toBe('cotejo_con_primaria');
    expect(p.correccion.desenlace).toBe('aceptada');
    expect(p.correccion.afecta).toEqual(['chequeos/lacalle-pou/2020-04-20-recaudacion-iva']);
    // Revision.tier del registro afectado no se toca: solo se declaran cambios de campo `.verificacion`.
    const cambios = p.correccion.cambios as { registro: string; campo: string; de: string; a: string }[];
    expect(cambios).toHaveLength(1);
    expect(cambios[0].campo).toBe('dato_real.fuentes.0.verificacion');
    expect(cambios[0].de).toBe('manual');
    expect(cambios.every((c) => !c.campo.includes('revision'))).toBe(true);
    expect(typeof p.correccion.motivo).toBe('string');
    expect((p.correccion.motivo as string).length).toBeGreaterThan(0);

    const { validas, errores } = validarCorrecciones(propuestas);
    expect(errores).toEqual([]);
    expect(validas).toHaveLength(1);
  });

  it('no arma ninguna corrección si nada cotejó', () => {
    const { resultados } = { resultados: [] as Awaited<ReturnType<typeof reverificar>>['resultados'] };
    expect(construirCorrecciones(resultados, '2026-09-10')).toEqual([]);
  });
});

describe('escribirCorrecciones', () => {
  it('escribe el archivo, y una segunda corrida no duplica el mismo afecta', async () => {
    const { resultados } = await reverificar({ rootDir: FIXTURE_DIR, obtenerTexto, obtenerTranscripcion });
    const propuestas = construirCorrecciones(resultados, '2026-09-10');
    const { validas } = validarCorrecciones(propuestas);
    const tmp = dirTemporal();

    const r1 = escribirCorrecciones(tmp, '2026-09-10', validas);
    expect(r1.agregadas).toBe(1);
    expect(r1.total).toBe(1);
    expect(r1.archivo).toBe('inbox/correcciones/2026-09-10/correcciones.yaml');
    expect(existsSync(path.join(tmp, r1.archivo))).toBe(true);

    const r2 = escribirCorrecciones(tmp, '2026-09-10', validas);
    expect(r2.agregadas).toBe(0);
    expect(r2.total).toBe(1);
  });
});
