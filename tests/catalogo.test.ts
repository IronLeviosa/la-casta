/**
 * Piezas puras del catálogo (docs/plan-catalogo.md, etapa B): el parseo de las claves nuevas del
 * etiquetador, la verificación literal de citas del extractor, el cursor del trabajo `catalogar`,
 * el reparto de URL de `catalogo:descubrir` y las tablas nuevas del índice. Nada acá llama a
 * `claude -p` ni pega a la red: las respuestas de Haiku se simulan con el mismo JSON de ejemplo que
 * describen los roles (`.claude/agents/etiquetador.md`, `extractor.md`).
 */
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it, afterEach } from 'vitest';
import { armarLotes, extraerJsonArray, necesitaCatalogar, normalizarRespuesta, versionCatalogo, type RespuestaEtiquetador } from '../scripts/corpus/etiquetar.ts';
import { interpretarRespuestaExtractor, type RespuestaExtractor } from '../scripts/corpus/extraer-afirmaciones.ts';
import { deduplicarUrls, indiceDeReanudacion, listaDeUrls, type ProgresoCatalogar } from '../scripts/corpus/catalogar.ts';
import { agruparPorMes, deduplicarCandidatas, origenDeMedio, repartir } from '../scripts/corpus/catalogo-descubrir.ts';
import { abrirIndice, indexarNota } from '../scripts/corpus/indexar.ts';
import { etiquetasVacias, type Nota } from '../scripts/corpus/tipos.ts';

// ------------------------------------------------------------------------------------------
// etiquetar.ts: normalizarRespuesta con las claves del catálogo
// ------------------------------------------------------------------------------------------

describe('normalizarRespuesta() — claves del catálogo', () => {
  it('toma la relevancia declarada por político', () => {
    const r: RespuestaEtiquetador = {
      politicos_confirmados: [
        { slug: 'astori', posiciones: [10], relevancia: 'central' },
        { slug: 'lacalle-pou', posiciones: [50], relevancia: 'mencion' },
      ],
    };
    const n = normalizarRespuesta(r);
    expect(n.relevancia).toEqual({ astori: 'central', 'lacalle-pou': 'mencion' });
  });

  it('sin relevancia declarada, asume "secundaria" (ante la duda, no perder la afirmación)', () => {
    const r: RespuestaEtiquetador = { politicos_confirmados: [{ slug: 'astori', posiciones: [1] }] };
    expect(normalizarRespuesta(r).relevancia).toEqual({ astori: 'secundaria' });
  });

  it('ignora una relevancia que no es una de las tres válidas', () => {
    const r: RespuestaEtiquetador = { politicos_confirmados: [{ slug: 'astori', relevancia: 'muy-importante' }] };
    expect(normalizarRespuesta(r).relevancia).toEqual({ astori: 'secundaria' });
  });

  it('tiene_afirmaciones: solo true si vino exactamente true', () => {
    expect(normalizarRespuesta({ tiene_afirmaciones: true }).tieneAfirmaciones).toBe(true);
    expect(normalizarRespuesta({ tiene_afirmaciones: false }).tieneAfirmaciones).toBe(false);
    expect(normalizarRespuesta({}).tieneAfirmaciones).toBe(false);
  });

  it('fecha_texto: acepta AAAA, AAAA-MM o AAAA-MM-DD; descarta el resto', () => {
    expect(normalizarRespuesta({ fecha_texto: '2021-07-28' }).fechaTexto).toBe('2021-07-28');
    expect(normalizarRespuesta({ fecha_texto: '2021' }).fechaTexto).toBe('2021');
    expect(normalizarRespuesta({ fecha_texto: 'hace un año' }).fechaTexto).toBeNull();
    expect(normalizarRespuesta({ fecha_texto: null }).fechaTexto).toBeNull();
  });

  it('empresas: lista tal cual (el filtro contra la taxonomía lo hace el llamador)', () => {
    expect(normalizarRespuesta({ empresas: ['ancap', 'ute'] }).empresas).toEqual(['ancap', 'ute']);
    expect(normalizarRespuesta({}).empresas).toEqual([]);
  });

  it('leyes: descarta las que no traen número (el número es el único id)', () => {
    const r: RespuestaEtiquetador = {
      leyes: [
        { numero: '19.889', tipo: 'ley', nombre: 'LUC' },
        { numero: '', tipo: 'ley' },
        { tipo: 'decreto' } as any,
      ],
    };
    expect(normalizarRespuesta(r).leyes).toEqual([{ numero: '19.889', tipo: 'ley', nombre: 'LUC' }]);
  });

  it('leyes: "decreto" se conserva, cualquier otro valor cae a "ley"', () => {
    const r: RespuestaEtiquetador = { leyes: [{ numero: '123', tipo: 'decreto' }, { numero: '456', tipo: 'reglamento' }] };
    expect(normalizarRespuesta(r).leyes).toEqual([
      { numero: '123', tipo: 'decreto' },
      { numero: '456', tipo: 'ley' },
    ]);
  });
});

// ------------------------------------------------------------------------------------------
// etiquetar.ts: versionCatalogo / necesitaCatalogar
// ------------------------------------------------------------------------------------------

describe('necesitaCatalogar()', () => {
  it('una nota sin catálogo siempre necesita catalogarse', () => {
    expect(necesitaCatalogar({ catalogo: undefined })).toBe(true);
  });

  it('una nota con la versión vigente no necesita recatalogarse', () => {
    expect(necesitaCatalogar({ catalogo: { version: versionCatalogo(), modelo: 'x', fecha: '', relevancia: {}, tiene_afirmaciones: false } })).toBe(false);
  });

  it('una versión vieja (rol o esquema cambiaron) necesita recatalogarse', () => {
    expect(necesitaCatalogar({ catalogo: { version: 'version-vieja', modelo: 'x', fecha: '', relevancia: {}, tiene_afirmaciones: false } })).toBe(true);
  });

  it('--todas fuerza el recatalogado aunque la versión esté al día', () => {
    const cat = { version: versionCatalogo(), modelo: 'x', fecha: '', relevancia: {}, tiene_afirmaciones: false };
    expect(necesitaCatalogar({ catalogo: cat }, { todas: true })).toBe(true);
  });
});

// ------------------------------------------------------------------------------------------
// etiquetar.ts: modo lote (armarLotes / extraerJsonArray)
// ------------------------------------------------------------------------------------------

describe('armarLotes()', () => {
  const corta = (id: string) => ({ id, texto: 'x'.repeat(100) });
  const larga = (id: string) => ({ id, texto: 'x'.repeat(4000) });

  it('agrupa notas cortas de a 5 (por defecto)', () => {
    const notas = Array.from({ length: 12 }, (_, i) => corta(`n${i}`));
    const lotes = armarLotes(notas);
    expect(lotes.map((l) => l.length)).toEqual([5, 5, 2]);
  });

  it('respeta un tamaño de lote configurable', () => {
    const notas = Array.from({ length: 7 }, (_, i) => corta(`n${i}`));
    expect(armarLotes(notas, { tamano: 3 }).map((l) => l.length)).toEqual([3, 3, 1]);
  });

  it('una nota de 4.000 caracteres o más va sola, aunque venga en medio de notas cortas', () => {
    const notas = [corta('a'), corta('b'), larga('grande'), corta('c'), corta('d')];
    const lotes = armarLotes(notas);
    expect(lotes).toEqual([[corta('a'), corta('b')], [larga('grande')], [corta('c'), corta('d')]]);
  });

  it('todas largas: cada una en su propio lote', () => {
    const notas = [larga('a'), larga('b')];
    expect(armarLotes(notas)).toEqual([[larga('a')], [larga('b')]]);
  });

  it('lista vacía da lista de lotes vacía', () => {
    expect(armarLotes([])).toEqual([]);
  });

  it('red contra duplicados: un id repetido no entra dos veces en el mismo lote (docs/plan-catalogo.md)', () => {
    // Caso real del 2026-09-16: el trabajo 20260916T200028Z-02152367 trajo una URL repetida, y el
    // log mostró "lote de 5" con el mismo id de nota dos veces. armarLotes es la red: descarta la
    // segunda aparición antes de agrupar, y el resto de la lista sigue en el mismo orden.
    const notas = [corta('a'), corta('b'), corta('b'), corta('c')];
    const lotes = armarLotes(notas);
    expect(lotes).toEqual([[corta('a'), corta('b'), corta('c')]]);
  });

  it('red contra duplicados: no cambia el tamaño de lote declarado', () => {
    const notas = [corta('a'), corta('a'), corta('b'), corta('c'), corta('d'), corta('e'), corta('f')];
    const lotes = armarLotes(notas, { tamano: 3 });
    // Sin el id repetido quedan 6 notas únicas: dos lotes de 3.
    expect(lotes.map((l) => l.length)).toEqual([3, 3]);
    expect(lotes.flat().map((n) => n.id)).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
  });
});

describe('extraerJsonArray()', () => {
  it('parsea un array JSON limpio', () => {
    expect(extraerJsonArray('[{"resumen":"a"},{"resumen":"b"}]')).toEqual([{ resumen: 'a' }, { resumen: 'b' }]);
  });

  it('ignora texto y bloques ```json alrededor', () => {
    expect(extraerJsonArray('acá va:\n```json\n[{"resumen":"a"}]\n```\nfin')).toEqual([{ resumen: 'a' }]);
  });

  it('devuelve null si no hay un array', () => {
    expect(extraerJsonArray('{"resumen":"a"}')).toBeNull();
    expect(extraerJsonArray('no hay json acá')).toBeNull();
  });
});

// ------------------------------------------------------------------------------------------
// extraer-afirmaciones.ts: interpretarRespuestaExtractor (la verificación literal de citas)
// ------------------------------------------------------------------------------------------

describe('interpretarRespuestaExtractor()', () => {
  const TEXTO = 'El ministro Astori dijo que el déficit fiscal cerró 2016 en 3,9% del producto, según cifras oficiales.';
  const POLITICOS = new Set(['astori']);
  const TEMAS = new Set(['economia/deficit-fiscal']);

  it('acepta una cita literal y contigua', () => {
    const r: RespuestaExtractor = {
      afirmaciones: [
        { politico: 'astori', cita: 'el déficit fiscal cerró 2016 en 3,9% del producto', atribucion: 'indirecta', tipo: 'dato', tema: 'economia/deficit-fiscal', dato: { que: 'déficit fiscal', valor: '3,9%', periodo: '2016' } },
      ],
    };
    const res = interpretarRespuestaExtractor(TEXTO, r, POLITICOS, TEMAS);
    expect(res.descartadas).toBe(0);
    expect(res.afirmaciones).toHaveLength(1);
    expect(res.afirmaciones[0].cita).toBe('el déficit fiscal cerró 2016 en 3,9% del producto');
    expect(res.afirmaciones[0].posicion).toBe(TEXTO.indexOf('el déficit'));
    expect(res.afirmaciones[0].dato).toEqual({ que: 'déficit fiscal', valor: '3,9%', periodo: '2016' });
  });

  it('descarta una cita que no aparece en el texto (inventada) y la cuenta', () => {
    const r: RespuestaExtractor = {
      afirmaciones: [{ politico: 'astori', cita: 'el desempleo bajó al mínimo histórico este año', atribucion: 'directa', tipo: 'dato', tema: 'economia/deficit-fiscal' }],
    };
    const res = interpretarRespuestaExtractor(TEXTO, r, POLITICOS, TEMAS);
    expect(res.afirmaciones).toHaveLength(0);
    expect(res.descartadas).toBe(1);
  });

  it('descarta una cita reconstruida con puntos suspensivos que une dos tramos no contiguos', () => {
    const r: RespuestaExtractor = {
      afirmaciones: [{ politico: 'astori', cita: 'el déficit fiscal ... 3,9% del producto', atribucion: 'directa', tipo: 'dato', tema: 'economia/deficit-fiscal' }],
    };
    const res = interpretarRespuestaExtractor(TEXTO, r, POLITICOS, TEMAS);
    expect(res.afirmaciones).toHaveLength(0);
    expect(res.descartadas).toBe(1);
  });

  it('descarta un político fuera de la lista confirmada (aunque la cita sea literal)', () => {
    const r: RespuestaExtractor = {
      afirmaciones: [{ politico: 'lacalle-pou', cita: 'el déficit fiscal cerró 2016 en 3,9% del producto', atribucion: 'directa', tipo: 'dato', tema: 'economia/deficit-fiscal' }],
    };
    const res = interpretarRespuestaExtractor(TEXTO, r, POLITICOS, TEMAS);
    expect(res.descartadas).toBe(1);
  });

  it('descarta un tema fuera de la taxonomía recibida', () => {
    const r: RespuestaExtractor = {
      afirmaciones: [{ politico: 'astori', cita: 'el déficit fiscal cerró 2016 en 3,9% del producto', atribucion: 'directa', tipo: 'dato', tema: 'salud/vacunas' }],
    };
    expect(interpretarRespuestaExtractor(TEXTO, r, POLITICOS, TEMAS).descartadas).toBe(1);
  });

  it('descarta una cita más corta que el mínimo (20 caracteres)', () => {
    const r: RespuestaExtractor = { afirmaciones: [{ politico: 'astori', cita: 'dijo algo', atribucion: 'directa', tipo: 'posicion', tema: 'economia/deficit-fiscal' }] };
    expect(interpretarRespuestaExtractor(TEXTO, r, POLITICOS, TEMAS).descartadas).toBe(1);
  });

  it('descarta un tipo que no es de la lista válida', () => {
    const r: RespuestaExtractor = { afirmaciones: [{ politico: 'astori', cita: 'el déficit fiscal cerró 2016 en 3,9% del producto', atribucion: 'directa', tipo: 'opinion', tema: 'economia/deficit-fiscal' }] };
    expect(interpretarRespuestaExtractor(TEXTO, r, POLITICOS, TEMAS).descartadas).toBe(1);
  });

  it('"dato" solo se guarda para tipo "dato"', () => {
    const r: RespuestaExtractor = {
      afirmaciones: [{ politico: 'astori', cita: 'según cifras oficiales', atribucion: 'indirecta', tipo: 'posicion', tema: 'economia/deficit-fiscal', dato: { que: 'x', valor: 'y' } }],
    };
    // "según cifras oficiales" tiene 22 caracteres, aparece literal en TEXTO.
    const res = interpretarRespuestaExtractor(TEXTO, r, POLITICOS, TEMAS);
    expect(res.afirmaciones).toHaveLength(1);
    expect(res.afirmaciones[0].dato).toBeNull();
  });

  it('sin afirmaciones en la respuesta, "crudas" queda en 0', () => {
    const res = interpretarRespuestaExtractor(TEXTO, { afirmaciones: [], sin_afirmaciones_porque: 'no hay citas' }, POLITICOS, TEMAS);
    expect(res).toEqual({ afirmaciones: [], descartadas: 0, crudas: 0 });
  });
});

// ------------------------------------------------------------------------------------------
// catalogar.ts: cursor del trabajo (progreso.ultima_url / hechas)
// ------------------------------------------------------------------------------------------

describe('listaDeUrls()', () => {
  it('lee params.urls', () => {
    expect(listaDeUrls({ urls: ['https://a.uy/1', 'https://a.uy/2'] })).toEqual(['https://a.uy/1', 'https://a.uy/2']);
  });

  it('sin urls ni archivo, lanza', () => {
    expect(() => listaDeUrls({})).toThrow(/urls|archivo/);
  });

  it('descarta entradas que no son string', () => {
    expect(listaDeUrls({ urls: ['https://a.uy/1', 42, null] as unknown[] })).toEqual(['https://a.uy/1']);
  });

  it('dedupea una URL literalmente repetida (red del caso real: 9 de 196 repetidas en un sitemap)', () => {
    expect(listaDeUrls({ urls: ['https://a.uy/1', 'https://a.uy/2', 'https://a.uy/1'] })).toEqual(['https://a.uy/1', 'https://a.uy/2']);
  });

  it('dedupea por URL canónica aunque cambien mayúsculas, "www." o la barra final', () => {
    expect(listaDeUrls({ urls: ['https://www.a.uy/nota/', 'https://A.UY/nota'] })).toEqual(['https://www.a.uy/nota/']);
  });
});

describe('deduplicarUrls()', () => {
  it('mantiene la primera aparición y el orden del resto', () => {
    expect(deduplicarUrls(['https://a.uy/1', 'https://a.uy/2', 'https://a.uy/1', 'https://a.uy/3'])).toEqual(['https://a.uy/1', 'https://a.uy/2', 'https://a.uy/3']);
  });

  it('lista sin repetidos queda igual', () => {
    expect(deduplicarUrls(['https://a.uy/1', 'https://a.uy/2'])).toEqual(['https://a.uy/1', 'https://a.uy/2']);
  });
});

describe('indiceDeReanudacion()', () => {
  const lista = ['https://a.uy/1', 'https://a.uy/2', 'https://a.uy/3'];

  it('sin progreso previo, arranca desde el principio', () => {
    expect(indiceDeReanudacion(lista, { hechas: 0, ultima_url: null })).toBe(0);
  });

  it('reanuda justo después de la última URL hecha', () => {
    expect(indiceDeReanudacion(lista, { hechas: 2, ultima_url: 'https://a.uy/2' })).toBe(2);
  });

  it('si ya se hizo la última de la lista, el índice queda igual al largo (nada más que hacer)', () => {
    expect(indiceDeReanudacion(lista, { hechas: 3, ultima_url: 'https://a.uy/3' })).toBe(3);
  });

  it('si la URL ya no está en la lista (cambió entre corridas), usa el contador "hechas"', () => {
    const p: Pick<ProgresoCatalogar, 'hechas' | 'ultima_url'> = { hechas: 2, ultima_url: 'https://ya-no-esta.uy/x' };
    expect(indiceDeReanudacion(lista, p)).toBe(2);
  });
});

// ------------------------------------------------------------------------------------------
// catalogo-descubrir.ts: origenDeMedio, agruparPorMes, repartir
// ------------------------------------------------------------------------------------------

describe('origenDeMedio() / agruparPorMes() / repartir()', () => {
  let carpeta: string;

  afterEach(() => {
    if (carpeta) rmSync(carpeta, { recursive: true, force: true });
  });

  it('lee el origen desde content/medios/<slug>.yaml ("url")', () => {
    carpeta = mkdtempSync(join(tmpdir(), 'la-casta-medios-'));
    writeFileSync(join(carpeta, 'el-pais.yaml'), 'nombre: El País\nurl: https://www.elpais.com.uy\n');
    expect(origenDeMedio('el-pais', carpeta)).toBe('https://www.elpais.com.uy');
  });

  it('sin "url", cae a la primera de "dominios"', () => {
    carpeta = mkdtempSync(join(tmpdir(), 'la-casta-medios-'));
    writeFileSync(join(carpeta, 'x.yaml'), 'nombre: X\ndominios: [x.uy, otro.uy]\n');
    expect(origenDeMedio('x', carpeta)).toBe('https://x.uy');
  });

  it('sin el archivo, lanza con un mensaje claro', () => {
    carpeta = mkdtempSync(join(tmpdir(), 'la-casta-medios-'));
    expect(() => origenDeMedio('no-existe', carpeta)).toThrow(/no-existe\.yaml/);
  });

  it('sin "url" ni "dominios", lanza', () => {
    carpeta = mkdtempSync(join(tmpdir(), 'la-casta-medios-'));
    writeFileSync(join(carpeta, 'sin-url.yaml'), 'nombre: Sin URL\n');
    expect(() => origenDeMedio('sin-url', carpeta)).toThrow();
  });

  it('agruparPorMes cuenta por "lastmod" y agrupa lo que no tiene fecha en "sin-fecha"', () => {
    const porMes = agruparPorMes([{ lastmod: '2026-08-01' }, { lastmod: '2026-08-15' }, { lastmod: '2026-07-01' }, { lastmod: null }]);
    expect(porMes.get('2026-08')).toBe(2);
    expect(porMes.get('2026-07')).toBe(1);
    expect(porMes.get('sin-fecha')).toBe(1);
  });

  it('repartir divide en tramos contiguos parejos', () => {
    const partes = repartir([1, 2, 3, 4, 5, 6, 7], 3);
    expect(partes).toEqual([[1, 2, 3], [4, 5, 6], [7]]);
  });

  it('repartir con más partes que elementos no genera tramos vacíos', () => {
    expect(repartir([1, 2], 5)).toEqual([[1], [2]]);
  });

  it('repartir de una lista vacía da una lista vacía', () => {
    expect(repartir([], 3)).toEqual([]);
  });
});

describe('deduplicarCandidatas()', () => {
  it('descarta la URL repetida (caso real: elpais.com.uy/ataque-a-nadia-beller dos veces en el sitemap de agosto)', () => {
    const candidatas = [
      { url: 'https://www.elpais.com.uy/ataque-a-nadia-beller', lastmod: '2026-08-19' },
      { url: 'https://www.elpais.com.uy/otra-nota', lastmod: '2026-08-18' },
      { url: 'https://www.elpais.com.uy/ataque-a-nadia-beller', lastmod: '2026-08-19' },
    ];
    expect(deduplicarCandidatas(candidatas)).toEqual([
      { url: 'https://www.elpais.com.uy/ataque-a-nadia-beller', lastmod: '2026-08-19' },
      { url: 'https://www.elpais.com.uy/otra-nota', lastmod: '2026-08-18' },
    ]);
  });

  it('dedupea por URL canónica aunque difieran en "www." o esquema', () => {
    const candidatas = [
      { url: 'http://www.elpais.com.uy/nota', lastmod: null },
      { url: 'https://elpais.com.uy/nota', lastmod: null },
    ];
    expect(deduplicarCandidatas(candidatas)).toHaveLength(1);
  });

  it('sin repetidos, no cambia nada', () => {
    const candidatas = [{ url: 'https://a.uy/1', lastmod: null }, { url: 'https://a.uy/2', lastmod: null }];
    expect(deduplicarCandidatas(candidatas)).toEqual(candidatas);
  });
});

// ------------------------------------------------------------------------------------------
// indexar.ts: tablas nuevas del catálogo (afirmaciones, fechas, empresas, leyes)
// ------------------------------------------------------------------------------------------

function notaDePrueba(extra: Partial<Nota> = {}): Nota {
  return {
    id: 'nota-prueba',
    url: 'https://x.uy/nota',
    url_canonica: 'https://x.uy/nota',
    medio: 'x',
    fecha: '2026-08-10',
    titulo: 'Nota de prueba',
    autor: null,
    tipo: 'html',
    texto: 'texto de prueba',
    retrieved_at: '2026-08-10T00:00:00Z',
    archived_url: null,
    text_sha256: '0',
    etiquetas: etiquetasVacias(),
    resumen: null,
    ...extra,
  };
}

describe('indexarNota() — tablas del catálogo', () => {
  let carpeta: string;
  afterEach(() => {
    if (carpeta) rmSync(carpeta, { recursive: true, force: true });
  });

  it('escribe afirmaciones, fechas mencionadas, empresas y leyes; borra y reescribe sin duplicar', () => {
    carpeta = mkdtempSync(join(tmpdir(), 'la-casta-indice-'));
    const ruta = join(carpeta, 'indice.db');
    const indice = abrirIndice({ ruta });
    try {
      const nota = notaDePrueba({
        catalogo: {
          version: 'v1',
          modelo: 'haiku',
          fecha: '2026-08-10T00:00:00Z',
          relevancia: { astori: 'central' },
          tiene_afirmaciones: true,
          fechas_mencionadas: ['2016', '2016-10'],
          empresas: ['ancap'],
          leyes: [{ numero: '19.889', tipo: 'ley', nombre: 'LUC' }],
          afirmaciones: [
            { politico: 'astori', cita: 'el déficit bajó', posicion: 5, atribucion: 'directa', tipo: 'dato', tema: 'economia', dato: { que: 'x', valor: 'y' }, fecha_dicho: null },
          ],
          descartadas: 1,
        },
      });
      indexarNota(indice, nota);

      const afirmaciones = indice.db.prepare('SELECT politico, tema, tipo, cita, posicion, fecha FROM afirmaciones WHERE nota = ?').all(nota.id) as any[];
      expect(afirmaciones).toEqual([{ politico: 'astori', tema: 'economia', tipo: 'dato', cita: 'el déficit bajó', posicion: 5, fecha: nota.fecha }]);

      const fechas = (indice.db.prepare('SELECT fecha FROM nota_fecha_mencionada WHERE nota = ? ORDER BY fecha').all(nota.id) as any[]).map((r) => r.fecha);
      expect(fechas).toEqual(['2016', '2016-10']);

      const empresas = (indice.db.prepare('SELECT empresa FROM nota_empresa WHERE nota = ?').all(nota.id) as any[]).map((r) => r.empresa);
      expect(empresas).toEqual(['ancap']);

      const leyes = indice.db.prepare('SELECT numero, tipo, nombre FROM nota_ley WHERE nota = ?').all(nota.id) as any[];
      expect(leyes).toEqual([{ numero: '19.889', tipo: 'ley', nombre: 'LUC' }]);

      // Reindexar la misma nota no duplica: borra y reescribe (idempotente).
      indexarNota(indice, nota);
      const otraVez = indice.db.prepare('SELECT COUNT(*) AS n FROM afirmaciones WHERE nota = ?').get(nota.id) as { n: number };
      expect(otraVez.n).toBe(1);
    } finally {
      indice.cerrar();
    }
  });

  it('una nota sin catálogo no escribe nada en esas tablas (y no rompe)', () => {
    carpeta = mkdtempSync(join(tmpdir(), 'la-casta-indice-'));
    const indice = abrirIndice({ ruta: join(carpeta, 'indice.db') });
    try {
      const nota = notaDePrueba();
      expect(() => indexarNota(indice, nota)).not.toThrow();
      const n = indice.db.prepare('SELECT COUNT(*) AS n FROM afirmaciones WHERE nota = ?').get(nota.id) as { n: number };
      expect(n.n).toBe(0);
    } finally {
      indice.cerrar();
    }
  });
});
