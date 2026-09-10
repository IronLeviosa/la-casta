/**
 * `pnpm reverificar` (docs/plan-2026-09.md, ítem 2.2): parte pura, sin red.
 *
 * - Encontrar fuentes `verificacion: manual` en un árbol de fixtures (tests/fixtures/reverificar).
 * - Cotejar con un `obtenerTexto`/`obtenerTranscripcion` simulados (misma técnica que
 *   tests/citas.test.ts), sin tocar la red ni el corpus.
 * - Armar el registro de corrección y validarlo contra el esquema real de `correcciones`.
 * - Armar el registro afectado sin `verificacion: manual` (lo que de verdad saca la fuente de
 *   `probable`) y escribir los dos, de punta a punta, con `promover --correccion` aplicándolos.
 * - Escribir (y agregar sin duplicar) inbox/correcciones/<fecha>/correcciones.yaml.
 */
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';
import { afterAll, describe, expect, it } from 'vitest';
import { cargarContenido } from '../scripts/lib/contenido.ts';
import { cargarInbox } from '../scripts/lib/inbox.ts';
import { promover } from '../scripts/promover.ts';
import { validar } from '../scripts/validar.ts';
import {
  construirCorrecciones,
  construirRegistrosCorregidos,
  crearCorridaReverificacion,
  encontrarFuentesManuales,
  escribirCorrecciones,
  escribirRegistrosCorregidos,
  formatoResultado,
  reverificar,
  slugsCandidatosParaId,
  validarCorrecciones,
  type FuenteManual,
  type RegistroLigero,
} from '../scripts/reverificar.ts';
import type { ObtenerTexto, ObtenerTranscripcion } from '../scripts/validadores/citas.ts';
import { FIXTURE_OK } from './ayuda.ts';

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

describe('slugsCandidatosParaId', () => {
  it('para un id <politico>/<fecha>-<slug>, prueba primero el segmento completo y después sin el prefijo de fecha', () => {
    expect(slugsCandidatosParaId('lacalle-pou/2020-04-20-recaudacion-iva', '2020-04-20')).toEqual(['2020-04-20-recaudacion-iva', 'recaudacion-iva']);
  });

  it('para un id <fecha>-<slug> sin "/" (correcciones), también prueba sin el prefijo de fecha', () => {
    expect(slugsCandidatosParaId('2026-09-05-candidaturas-2019', '2026-09-05')).toEqual(['2026-09-05-candidaturas-2019', 'candidaturas-2019']);
  });

  it('para un id sin fecha en el slug (giros, politicos, empresas), un solo candidato: el segmento completo', () => {
    expect(slugsCandidatosParaId('lacalle-pou/iva-tarjeta-2020', '2020-01-01')).toEqual(['lacalle-pou/iva-tarjeta-2020'.split('/').pop()!]);
    expect(slugsCandidatosParaId('brou', undefined)).toEqual(['brou']);
  });
});

// ---------------------------------------------------------------------------
// De punta a punta: el registro afectado, no solo el de corrección documental. Antes de esto,
// `pnpm reverificar --escribir` dejaba `correcciones.yaml` (documental) pero no el registro
// corregido, así que `pnpm promover ... --correccion` publicaba la corrección y no le quitaba
// `verificacion: manual` a ninguna fuente: el registro seguía en `probable` con la marca puesta.
// ---------------------------------------------------------------------------
describe('construirRegistrosCorregidos + escribirRegistrosCorregidos + promover, de punta a punta', () => {
  it('quita verificacion: manual del registro afectado, y promover --correccion lo aplica a content/', async () => {
    const raiz = mkdtempSync(path.join(tmpdir(), 'la-casta-reverificar-e2e-'));
    temporales.push(raiz);
    cpSync(FIXTURE_OK, raiz, { recursive: true });

    // `_investigacion: {script: 'reverificar.ts'}` necesita que scripts/reverificar.ts exista de
    // verdad bajo rootDir (promover() lo hashea), igual que generar-suplentes.ts en
    // tests/promover-correccion.test.ts. El resultado final igual queda con procedencia de tipo
    // 'correccion' (el script solo importa para el hash, no para el dato final).
    mkdirSync(path.join(raiz, 'scripts'), { recursive: true });
    writeFileSync(path.join(raiz, 'scripts', 'reverificar.ts'), '// script de fixture para esta prueba\n', 'utf8');

    // Marca la fuente del dato oficial como no verificable mecánicamente: el estado real de hoy que
    // este cambio viene a resolver (CLAUDE.md, "Fuentes no verificables mecánicamente" deja el
    // registro en `probable` hasta que aparezca una fuente cotejable).
    const rutaRegistro = path.join(raiz, 'content', 'chequeos', 'lacalle-pou', '2020-04-20-recaudacion-iva.yaml');
    const registroOriginal = parseYaml(readFileSync(rutaRegistro, 'utf8')) as Record<string, any>;
    registroOriginal.dato_real.fuentes[0].verificacion = 'manual';
    registroOriginal.revision = { tier: 'probable', que_falta: 'la fuente del dato oficial es de verificación manual.' };
    writeFileSync(rutaRegistro, stringifyYaml(registroOriginal), 'utf8');

    const urlCotejable = registroOriginal.dato_real.fuentes[0].url as string;
    const citaCotejable = registroOriginal.dato_real.fuentes[0].cita as string;
    const obtenerTextoSimulado: ObtenerTexto = async (fuente) => {
      if (fuente.url === urlCotejable) return { texto: `Texto oficial.\n\n${fuente.cita}\n\nFin del informe.`, tipo: 'html' };
      throw new Error(`URL inesperada en el test: ${fuente.url}`);
    };
    const obtenerTranscripcionSimulada: ObtenerTranscripcion = () => null;

    // 1. Cotejo simulado: la fuente coteja exacta.
    const { resultados, problemas } = await reverificar({ rootDir: raiz, obtenerTexto: obtenerTextoSimulado, obtenerTranscripcion: obtenerTranscripcionSimulada });
    expect(problemas).toEqual([]);
    expect(resultados).toHaveLength(1);
    expect(resultados[0]!.estado).toBe('cotejada');
    expect(resultados[0]!.fm.fuente.cita).toBe(citaCotejable);

    const fecha = '2026-09-10';

    // 2. Registro de corrección documental (lo que ya hacía reverificar antes de este cambio).
    const propuestasCorreccion = construirCorrecciones(resultados, fecha);
    const { validas, errores: erroresCorreccion } = validarCorrecciones(propuestasCorreccion);
    expect(erroresCorreccion).toEqual([]);
    const escritura = escribirCorrecciones(raiz, fecha, validas);
    expect(escritura.agregadas).toBe(1);

    // 3. Lo que faltaba: el registro afectado en sí, sin `verificacion: manual`.
    const { propuestas: propuestasRegistros, problemas: problemasRegistros } = construirRegistrosCorregidos(raiz, resultados);
    expect(problemasRegistros).toEqual([]);
    expect(propuestasRegistros).toHaveLength(1);
    expect(propuestasRegistros[0]!.coleccion).toBe('chequeos');
    expect(propuestasRegistros[0]!.slug).toBe('recaudacion-iva'); // sin el prefijo de fecha: derivarId lo vuelve a anteponer
    expect(propuestasRegistros[0]!.registro._investigacion).toEqual({ script: 'reverificar.ts' });
    expect(propuestasRegistros[0]!.registro.procedencia).toBeUndefined();
    expect((propuestasRegistros[0]!.registro.dato_real as any).fuentes[0].verificacion).toBeUndefined();
    // revision.tier no se toca: sigue en probable hasta que el editor lo suba en /correccion.
    expect(propuestasRegistros[0]!.registro.revision).toEqual({ tier: 'probable', que_falta: 'la fuente del dato oficial es de verificación manual.' });

    const escrituraRegistros = escribirRegistrosCorregidos(raiz, fecha, propuestasRegistros);
    expect(escrituraRegistros.archivos).toHaveLength(1);
    expect(escrituraRegistros.archivos[0]).toMatchObject({ coleccion: 'chequeos', agregadas: 1, total: 1 });
    const archivoRegistros = path.join(raiz, escrituraRegistros.archivos[0]!.archivo);
    expect(existsSync(archivoRegistros)).toBe(true);

    // 4. Corrida mecánica (la crea reverificar --escribir cuando hay al menos una corrección nueva).
    const corrida = crearCorridaReverificacion(raiz, fecha, resultados, propuestasCorreccion, escritura);
    expect(corrida.comandosPromover).toHaveLength(1);
    const idCorreccion = corrida.comandosPromover[0]!.match(/--correccion (\S+)/)?.[1];
    expect(idCorreccion).toBeDefined();

    const inboxDir = path.join(raiz, escritura.directorio);
    expect(path.dirname(archivoRegistros)).toBe(inboxDir); // corrección y registro corregido en la misma carpeta del inbox

    // 5. `pnpm validar --inbox inbox/correcciones/<fecha> --breve` (acá, la misma función que corre
    //    ese comando) tiene que pasar sobre lo que se escribió: la corrección y el registro corregido.
    const resultadoValidarInbox = await validar({ rootDir: raiz, inboxDir });
    expect(resultadoValidarInbox.errores).toEqual([]);
    // Confirma también con cargarInbox directo (lo que usa validar() por dentro).
    const rInbox = cargarInbox(raiz, inboxDir);
    expect(rInbox.errores).toEqual([]);

    // 6. `pnpm promover <dir> --correccion <id> --corrida <id-corrida>`: aplica la corrección Y el
    //    registro corregido, de punta a punta.
    const pr = promover(inboxDir, { rootDir: raiz, corrida: corrida.id, correccion: idCorreccion });
    expect(pr.errores).toEqual([]);
    expect(pr.promovidos).toHaveLength(1);
    expect(pr.promovidos[0]!.id).toBe('lacalle-pou/2020-04-20-recaudacion-iva');
    expect(pr.correccionEscrita).toBe(idCorreccion);

    // 7. El registro publicado quedó sin verificacion: manual en esa fuente, y con procedencia de
    //    tipo corrección.
    const registroFinal = parseYaml(readFileSync(rutaRegistro, 'utf8')) as Record<string, any>;
    expect(registroFinal.dato_real.fuentes[0].verificacion).toBeUndefined();
    expect(registroFinal.dato_real.fuentes[0].url).toBe(urlCotejable);
    expect(registroFinal.procedencia).toEqual({ tipo: 'correccion', correccion: idCorreccion });
    // revision.tier lo sigue decidiendo el editor, no este script: queda igual que antes de promover.
    expect(registroFinal.revision).toEqual({ tier: 'probable', que_falta: 'la fuente del dato oficial es de verificación manual.' });

    // 8. content/correcciones/<id>.yaml existe (la corrección documental quedó publicada).
    expect(existsSync(path.join(raiz, 'content', 'correcciones', `${idCorreccion}.yaml`))).toBe(true);
  });
});
