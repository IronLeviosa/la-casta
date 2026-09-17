/**
 * El validador corrido de forma programática sobre las fixtures.
 *
 * `fixtures/ok/` tiene que salir 0. Cada `fixtures/malos/<regla>/` tiene que
 * salir 1, fallar en la etapa esperada y decir por qué con un mensaje que una
 * persona pueda leer y corregir sin abrir el código.
 */
import { cpSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { stringify as stringifyYaml } from 'yaml';
import { afterAll, describe, expect, it } from 'vitest';
import { validar, type NombreEtapa } from '../scripts/validar.ts';
import { FIXTURES_MALOS, FIXTURE_OK, limpiarFixtures, prepararFixture } from './ayuda.ts';
import type { VerificadorUrl } from '../scripts/validadores/fuentes.ts';

afterAll(limpiarFixtures);

const temporalesPropios: string[] = [];
afterAll(() => {
  for (const d of temporalesPropios.splice(0)) rmSync(d, { recursive: true, force: true });
});

/**
 * Combina dos overlays de fixtures malas que tocan archivos distintos (medio-desconocido, en
 * `referencias`, y reportado-un-grupo, en `tiers`) y agrega, en un tercer archivo, un título que
 * empieza con el nombre de la persona (presentacion, con --estricto) — para probar que las tres
 * etapas offline se reportan juntas en una sola corrida (docs/plan-validar-completo.md). Un título
 * demasiado corto no sirve para esto: el propio Zod ya lo rechaza en la etapa esquema (mínimo 8
 * caracteres), así que no llegaría a presentacion.
 */
function prepararFixtureTresEtapas(): string {
  const destino = mkdtempSync(join(tmpdir(), 'la-casta-tres-etapas-'));
  temporalesPropios.push(destino);
  cpSync(FIXTURE_OK, destino, { recursive: true });
  cpSync(join(FIXTURES_MALOS, 'medio-desconocido'), destino, { recursive: true });
  cpSync(join(FIXTURES_MALOS, 'reportado-un-grupo'), destino, { recursive: true });

  const rutaChequeo = join(destino, 'content', 'chequeos', 'lacalle-pou', '2020-04-20-recaudacion-iva.yaml');
  const original = readFileSync(rutaChequeo, 'utf8');
  const conTitulo = original.replace(/^titulo: .*$/m, "titulo: 'Luis Lacalle Pou dice que el IVA bajó menos de lo afirmado'");
  writeFileSync(rutaChequeo, conTitulo);

  return destino;
}

/** Opciones comunes: sin red y sin escribir data/simetria.json en el temporal. */
const OPCIONES = { escribirSimetria: false as const };

/**
 * Copia la fixture buena y le mete dos avisos de presentación de reglas distintas, en dos
 * colecciones y dos registros distintos, para `--por-regla` (docs/plan-deuda-presentacion.md, punto
 * 1): un título que empieza con el nombre de la persona (chequeos, regla "titulo_nombre") y un
 * resumen de más de 1500 caracteres (declaraciones, regla "resumen_parrafo_largo"). Los dos quedan
 * en aviso, no en error: content/ sin --estricto no corta por presentación.
 */
function prepararFixturePorRegla(): string {
  const destino = mkdtempSync(join(tmpdir(), 'la-casta-por-regla-'));
  temporalesPropios.push(destino);
  cpSync(FIXTURE_OK, destino, { recursive: true });

  const rutaChequeo = join(destino, 'content', 'chequeos', 'lacalle-pou', '2020-04-20-recaudacion-iva.yaml');
  const chequeo = readFileSync(rutaChequeo, 'utf8').replace(/^titulo: .*$/m, "titulo: 'Luis Lacalle Pou dice que el IVA bajó menos de lo afirmado'");
  writeFileSync(rutaChequeo, chequeo);

  const rutaDeclaracion = join(destino, 'content', 'declaraciones', 'lacalle-pou', '2019-10-15-no-subir-impuestos.yaml');
  const resumenLargo = 'Se compromete a no aumentar impuestos durante todo el mandato. '.repeat(30).trim();
  const declaracion = readFileSync(rutaDeclaracion, 'utf8').replace(/^resumen: .*$/m, `resumen: '${resumenLargo}'`);
  writeFileSync(rutaDeclaracion, declaracion);

  return destino;
}

/** Todos los .yaml bajo un directorio, recursivo. */
function listarYaml(dir: string): string[] {
  const salida: string[] = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) salida.push(...listarYaml(p));
    else if (e.name.endsWith('.yaml')) salida.push(p);
  }
  return salida;
}

interface CasoMalo {
  regla: string;
  etapa: NombreEtapa;
  /** Fragmento que debe aparecer en algún mensaje de error. */
  mensaje: string;
}

const CASOS: CasoMalo[] = [
  { regla: 'fuente-faltante', etapa: 'esquema', mensaje: 'Se requiere al menos una fuente' },
  { regla: 'reportado-un-grupo', etapa: 'tiers', mensaje: 'un solo grupo de medios' },
  { regla: 'giro-fechas-invertidas', etapa: 'referencias', mensaje: 'Fechas invertidas' },
  { regla: 'hipotesis-en-content', etapa: 'tiers', mensaje: 'no puede estar en content/' },
  { regla: 'inferencia-sin-cadena', etapa: 'esquema', mensaje: 'requiere cadena' },
  { regla: 'video-sin-marca-tiempo', etapa: 'esquema', mensaje: 'requiere marca_tiempo' },
  { regla: 'etiqueta-legal-inconsistente', etapa: 'esquema', mensaje: 'etiqueta_legal debe derivarse' },
  { regla: 'medio-desconocido', etapa: 'referencias', mensaje: 'Medio desconocido' },
  { regla: 'procedencia-faltante', etapa: 'esquema', mensaje: 'Campo obligatorio ausente' },
  { regla: 'chequeo-fragmento-ausente', etapa: 'referencias', mensaje: 'no aparece tal cual' },
];

describe('validar() sobre la fixture buena', () => {
  it('sale 0 y no reporta errores', async () => {
    const raiz = prepararFixture();
    const r = await validar({ rootDir: raiz, ...OPCIONES });
    expect(r.errores).toEqual([]);
    expect(r.codigo).toBe(0);
    expect(r.ok).toBe(true);
  });

  it('corre las ocho etapas y salta las de red sin --red', async () => {
    const raiz = prepararFixture();
    const r = await validar({ rootDir: raiz, ...OPCIONES });
    expect(r.etapas.map((e) => e.etapa)).toEqual(['esquema', 'referencias', 'tiers', 'presentacion', 'duplicados', 'fuentes', 'citas', 'simetria']);
    expect(r.etapas.filter((e) => e.omitida).map((e) => e.etapa)).toEqual(['fuentes', 'citas']);
  });

  it('avisa de las URLs sin verificar en el ledger, pero no falla (clon recién bajado)', async () => {
    const raiz = prepararFixture();
    const r = await validar({ rootDir: raiz, ...OPCIONES });
    expect(r.avisos.some((a) => a.mensaje.includes('Sin verificar en ledger'))).toBe(true);
    expect(r.codigo).toBe(0);
  });

  it('un fallo de archivado no marca la fuente como caída (http null = nunca verificada)', async () => {
    // Wayback devolviendo 520 crea una entrada en el ledger sin haber consultado la fuente. Si eso
    // contara como "fuente caída", un registro con la fuente viva bajaría de tier por un problema
    // ajeno al sitio. Tiene que ser aviso, no error.
    const raiz = prepararFixture();
    const ledgerPath = `${raiz}/data/fuentes-ledger.json`;
    const urls = new Set<string>();
    for (const archivo of listarYaml(`${raiz}/content`)) {
      for (const m of readFileSync(archivo, 'utf8').matchAll(/^\s*(?:-\s*)?url:\s*(\S+)/gm)) urls.add(m[1]);
    }
    const url = [...urls][0];
    expect(url).toBeTruthy();
    writeFileSync(
      ledgerPath,
      JSON.stringify({ [url]: { http: null, ok: false, archived_url: null, checked_at: '2026-09-05T00:00:00.000Z', error: 'save devolvio HTTP 520' } }, null, 2),
    );

    const r = await validar({ rootDir: raiz, ...OPCIONES });
    expect(r.errores.filter((e) => e.mensaje.includes('Fuente caída'))).toEqual([]);
    expect(r.avisos.some((a) => a.mensaje.includes('sin verificar por HTTP'))).toBe(true);
  });

  it('una fuente verificada y caída sí bloquea la publicación', async () => {
    const raiz = prepararFixture();
    const ledgerPath = `${raiz}/data/fuentes-ledger.json`;
    const urls = new Set<string>();
    for (const archivo of listarYaml(`${raiz}/content`)) {
      for (const m of readFileSync(archivo, 'utf8').matchAll(/^\s*(?:-\s*)?url:\s*(\S+)/gm)) urls.add(m[1]);
    }
    const url = [...urls][0];
    writeFileSync(
      ledgerPath,
      JSON.stringify({ [url]: { http: 404, ok: false, archived_url: null, checked_at: '2026-09-05T00:00:00.000Z' } }, null, 2),
    );

    const r = await validar({ rootDir: raiz, ...OPCIONES });
    expect(r.errores.some((e) => e.mensaje.includes('Fuente caída'))).toBe(true);
  });

  it('avisa cuando la cita que cierra un mandato habla en futuro', async () => {
    // El error real: un mandato cerrado el 21 de diciembre citando una nota del 10 que decía
    // "confirmó que renunciará el próximo jueves 21". La nota documenta el anuncio, no el hecho, y
    // un anuncio se puede postergar. El validador no puede decidirlo, pero sí señalar dónde mirar.
    const raiz = prepararFixture();
    const ficha = `${raiz}/content/politicos/mujica.yaml`;
    const texto = readFileSync(ficha, 'utf8').replace(/(cita: >-\n\s+)[^\n]+/, '$1El presidente confirmó que renunciará a su cargo el próximo jueves 21 de diciembre.');
    writeFileSync(ficha, texto);

    const r = await validar({ rootDir: raiz, ...OPCIONES });
    expect(r.avisos.some((a) => a.mensaje.includes('documenta un anuncio, no el hecho'))).toBe(true);
  });

  it('no avisa por un "actual" en una fuente lejana al fin del mandato', async () => {
    // "actual INAU" es el nombre de una institución y "el actual presidente" puede ser otra
    // persona. Lo que vuelve sospechoso al presente es que la nota sea contemporánea del cese.
    const raiz = prepararFixture();
    const ficha = `${raiz}/content/politicos/mujica.yaml`;
    const texto = readFileSync(ficha, 'utf8').replace(/(cita: >-\n\s+)[^\n]+/, '$1Fue director del INAME, actual INAU, durante aquel período de gobierno.');
    writeFileSync(ficha, texto);

    const r = await validar({ rootDir: raiz, ...OPCIONES });
    expect(r.avisos.some((a) => a.mensaje.includes('seguía en funciones'))).toBe(false);
  });

  it('calcula la simetría por partido y por político', async () => {
    const raiz = prepararFixture();
    const r = await validar({ rootDir: raiz, ...OPCIONES });
    expect(r.simetria?.por_politico['lacalle-pou']?.declaraciones).toBe(2);
    expect(r.simetria?.por_partido['Partido Nacional']?.giros.total).toBe(1);
  });

  it('con --solo corre una sola etapa', async () => {
    const raiz = prepararFixture();
    const r = await validar({ rootDir: raiz, solo: 'referencias', ...OPCIONES });
    expect(r.etapas.filter((e) => !e.omitida).map((e) => e.etapa)).toEqual(['referencias']);
    expect(r.codigo).toBe(0);
  });
});

describe('validar() sobre las fixtures malas', () => {
  for (const caso of CASOS) {
    it(`${caso.regla}: falla en la etapa ${caso.etapa} con "${caso.mensaje}"`, async () => {
      const raiz = prepararFixture(caso.regla);
      const r = await validar({ rootDir: raiz, ...OPCIONES });

      expect(r.codigo, `se esperaba salida 1 para ${caso.regla}`).toBe(1);
      expect(r.errores.length).toBeGreaterThan(0);

      const mensajes = r.errores.map((e) => e.mensaje).join('\n');
      expect(mensajes, `mensajes obtenidos:\n${mensajes}`).toContain(caso.mensaje);

      const fallada = r.etapas.find((e) => !e.omitida && !e.ok);
      expect(fallada?.etapa, `etapas: ${r.etapas.map((e) => `${e.etapa}:${e.errores.length}`).join(' ')}`).toBe(caso.etapa);
    });
  }

  it('esquema corta; con esquema ok, reporta todas las etapas', async () => {
    // Una referencia rota, un tier inválido y un defecto de presentación a la vez: las tres
    // etapas corren igual y cada una reporta lo suyo en la misma pasada (docs/plan-validar-completo.md).
    const raiz = prepararFixtureTresEtapas();
    const r = await validar({ rootDir: raiz, estricto: true, ...OPCIONES });

    expect(r.codigo).toBe(1);
    // Ninguna etapa quedó sin correr: llegan las ocho, y solo fuentes/citas quedan omitidas (sin --red).
    expect(r.etapas.map((e) => e.etapa)).toEqual(['esquema', 'referencias', 'tiers', 'presentacion', 'duplicados', 'fuentes', 'citas', 'simetria']);

    const porEtapa = new Map(r.etapas.map((e) => [e.etapa, e]));
    expect(porEtapa.get('referencias')!.errores.some((e) => e.mensaje.includes('Medio desconocido'))).toBe(true);
    expect(porEtapa.get('tiers')!.errores.some((e) => e.mensaje.includes('un solo grupo de medios'))).toBe(true);
    expect(porEtapa.get('presentacion')!.errores.some((e) => e.mensaje.includes('empieza con el nombre de la persona'))).toBe(true);
    expect(porEtapa.get('duplicados')!.ok).toBe(true);
  });

  it('sin --inbox, con errores offline y --red, fuentes/citas quedan omitidas y verificarUrl no se llama; con --inbox, sí se llama', async () => {
    const rootDir = prepararFixture('medio-desconocido'); // error en referencias
    let llamadas = 0;
    const verificarUrl: VerificadorUrl = async () => {
      llamadas++;
      return { http: 200, archived_url: null };
    };

    const sinInbox = await validar({ rootDir, red: true, verificarUrl, ...OPCIONES });
    expect(sinInbox.codigo).toBe(1);
    expect(llamadas).toBe(0);
    const fuentesSinInbox = sinInbox.etapas.find((e) => e.etapa === 'fuentes')!;
    const citasSinInbox = sinInbox.etapas.find((e) => e.etapa === 'citas')!;
    expect(fuentesSinInbox.omitida).toBe(true);
    expect(fuentesSinInbox.detalle).toBe('omitida (errores en etapas anteriores)');
    expect(citasSinInbox.omitida).toBe(true);
    expect(citasSinInbox.detalle).toBe('omitida (errores en etapas anteriores)');

    // Con --inbox, el mismo contenido roto corre igual: el corrector recibe la lista entera. Una
    // sola declaración en el lote, con una fuente propia, para que fuentes/citas tengan algo que
    // verificar (en modo inbox, esas dos etapas solo miran los registros del lote, no content/).
    const inboxDir = mkdtempSync(join(tmpdir(), 'la-casta-inbox-'));
    temporalesPropios.push(inboxDir);
    writeFileSync(
      join(inboxDir, 'declaraciones.yaml'),
      stringifyYaml([
        {
          politico: 'lacalle-pou',
          tema: 'economia/impuestos',
          fecha: '2020-07-01',
          contexto: 'gobierno',
          cargo_en_ese_momento: 'Presidente de la República',
          cita: 'Cita de prueba para el lote del test, con más de veinte caracteres.',
          resumen: 'Registro de prueba para este test.',
          evidencia: {
            nivel: 'textual',
            fuentes: [
              {
                url: 'https://ejemplo.uy/validar-red-test',
                medio: 'el-pais',
                fecha: '2020-07-01',
                tipo: 'documento_oficial',
                titulo: 'Documento de prueba',
                cita: 'Cita de prueba para el lote del test, con más de veinte caracteres.',
                retrieved_at: '2020-07-01',
              },
            ],
          },
          revision: { tier: 'publicado' },
        },
      ]),
      'utf8',
    );
    const conInbox = await validar({
      rootDir,
      inboxDir,
      red: true,
      verificarUrl,
      citas: { obtenerTexto: async () => { throw new Error('sin red en este test'); }, sinCache: true },
      ...OPCIONES,
    });
    expect(llamadas).toBeGreaterThan(0);
    const fuentesConInbox = conInbox.etapas.find((e) => e.etapa === 'fuentes')!;
    const citasConInbox = conInbox.etapas.find((e) => e.etapa === 'citas')!;
    expect(fuentesConInbox.omitida).toBe(false);
    expect(citasConInbox.omitida).toBe(false);
  });

  it('todas las fixtures malas del directorio están cubiertas por un caso', async () => {
    const { readdirSync } = await import('node:fs');
    const { FIXTURES_MALOS } = await import('./ayuda.ts');
    const enDisco = readdirSync(FIXTURES_MALOS).sort();
    expect(enDisco).toEqual(CASOS.map((c) => c.regla).sort());
  });
});

describe('validar() con --por-regla', () => {
  it('sin la opción, el resultado no trae porRegla', async () => {
    const raiz = prepararFixturePorRegla();
    const r = await validar({ rootDir: raiz, ...OPCIONES });
    expect(r.porRegla).toBeUndefined();
  });

  it('agrupa los avisos de dos reglas de presentación distintas por colección e id completo', async () => {
    const raiz = prepararFixturePorRegla();
    const r = await validar({ rootDir: raiz, porRegla: true, ...OPCIONES });

    // Son avisos (content/ sin --estricto): no cortan la corrida.
    expect(r.codigo).toBe(0);
    expect(r.porRegla?.['presentacion:titulo_nombre']).toEqual({
      chequeos: ['chequeos/lacalle-pou/2020-04-20-recaudacion-iva'],
    });
    expect(r.porRegla?.['presentacion:resumen_parrafo_largo']).toEqual({
      declaraciones: ['declaraciones/lacalle-pou/2019-10-15-no-subir-impuestos'],
    });
  });

  it('con --por-regla <regla> deja solo esa clave', async () => {
    const raiz = prepararFixturePorRegla();
    const r = await validar({ rootDir: raiz, porRegla: 'presentacion:titulo_nombre', ...OPCIONES });
    expect(Object.keys(r.porRegla ?? {})).toEqual(['presentacion:titulo_nombre']);
  });
});
