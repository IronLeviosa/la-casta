/**
 * Piezas puras del catálogo (docs/plan-catalogo.md, etapa B): el parseo de las claves nuevas del
 * etiquetador, la verificación literal de citas del extractor, el cursor del trabajo `catalogar`,
 * el reparto de URL de `catalogo:descubrir` y las tablas nuevas del índice. Nada acá llama a
 * `claude -p` ni pega a la red: las respuestas de Haiku se simulan con el mismo JSON de ejemplo que
 * describen los roles (`.claude/agents/etiquetador.md`, `extractor.md`).
 */
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it, afterEach } from 'vitest';
import { armarLotes, extraerJsonArray, necesitaCatalogar, normalizarRespuesta, versionCatalogo, type RespuestaEtiquetador } from '../scripts/corpus/etiquetar.ts';
import { interpretarRespuestaExtractor, type RespuestaExtractor } from '../scripts/corpus/extraer-afirmaciones.ts';
import { agruparErroresPorMotivo, calcularCatalogadas, deduplicarUrls, esMotivoDeRed, indiceDeReanudacion, listaDeUrls, motivoCorto, type ProgresoCatalogar } from '../scripts/corpus/catalogar.ts';
import { agruparPorMes, deduplicarCandidatas, origenDeMedio, repartir } from '../scripts/corpus/catalogo-descubrir.ts';
import { abrirIndice, indexarNota } from '../scripts/corpus/indexar.ts';
import { erroresDeTrabajo, promedioPorNota, reconstruirFila, reconstruirTodas, type FilaRendimiento } from '../scripts/corpus/rendimiento.ts';
import { etiquetasVacias, type Nota, type Trabajo } from '../scripts/corpus/tipos.ts';
import {
  armarInforme,
  armarLotesDeTema,
  dentroDeRango,
  escribirCatalogo,
  formatearInformeTexto,
  idsQueMencionan,
  leerNotaDeCarpeta,
  MAX_DATOS_POR_LOTE,
  MAX_NOTAS_POR_LOTE,
  notaParaInforme,
  recolectarNotas,
  resolverTema,
  SIN_TEMA,
  temasDeNota,
  type AfirmacionInformeSalida,
  type InformeCatalogo,
  type NotaCoberturaSalida,
  type NotaParaInforme,
} from '../scripts/corpus/catalogo.ts';

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

  it('si la URL ya no está en la lista (cambió entre corridas), arranca de cero en vez de confiar en "hechas"', () => {
    // Antes devolvía `Math.min(hechas, lista.length)`: un `hechas` viejo (ver el test de abajo) podía
    // colar un número que no correspondía a ningún índice real de esta lista. Más simple y más
    // seguro: si `ultima_url` no aparece, no hay forma confiable de saber por dónde iba, así que se
    // repite el trabajo entero en vez de arriesgar un conteo raro.
    const p: Pick<ProgresoCatalogar, 'hechas' | 'ultima_url'> = { hechas: 2, ultima_url: 'https://ya-no-esta.uy/x' };
    expect(indiceDeReanudacion(lista, p)).toBe(0);
  });

  it('ignora un "hechas" viejo y desincronizado: usa solo la posición real de ultima_url (caso real, 2026-09-16)', () => {
    // El trabajo real: se encoló con 196 URLs (9 repetidas), el cursor guardó `hechas: 130` contando
    // sobre esa lista sin deduplicar. Al reanudar, `listaDeUrls` ya llega deduplicada (187 elementos)
    // y `ultima_url` cae en el índice 120 de esa lista nueva: el índice correcto para reanudar (y
    // para resincronizar `progreso.hechas` en `ejecutarCatalogar`) es 121, no el 130 guardado — que
    // además ya ni siquiera es un índice válido de una lista de 187.
    const listaDeduplicada = Array.from({ length: 187 }, (_, i) => `https://a.uy/${i}`);
    const progreso: Pick<ProgresoCatalogar, 'hechas' | 'ultima_url'> = { hechas: 130, ultima_url: listaDeduplicada[120] };
    expect(indiceDeReanudacion(listaDeduplicada, progreso)).toBe(121);
  });

  it('nunca devuelve más que el largo de la lista', () => {
    const p: Pick<ProgresoCatalogar, 'hechas' | 'ultima_url'> = { hechas: 999, ultima_url: 'https://a.uy/3' };
    expect(indiceDeReanudacion(lista, p)).toBeLessThanOrEqual(lista.length);
  });
});

// ------------------------------------------------------------------------------------------
// catalogar.ts: motivoCorto / esMotivoDeRed / agruparErroresPorMotivo / calcularCatalogadas
// (apagón de DNS del 2026-09-16: 1.291 notas de 8 trabajos terminaron con "fetch failed" y
// `resultado.catalogadas` las contaba como catalogadas igual)
// ------------------------------------------------------------------------------------------

describe('motivoCorto()', () => {
  it('"fetch failed" (undici/Node sobre un DNS caído) da "fetch failed"', () => {
    expect(motivoCorto('fetch failed')).toBe('fetch failed');
  });

  it('un HTTP con código dado por ErrorHttp da "http_<código>"', () => {
    expect(motivoCorto('HTTP 503 al pedir https://x.uy/nota')).toBe('http_503');
    expect(motivoCorto('HTTP 404 al pedir https://x.uy/nota')).toBe('http_404');
    expect(motivoCorto('HTTP 429 al pedir https://x.uy/nota')).toBe('http_429');
  });

  it('el mensaje de armazón JS de fuente.ts da "armazon_js"', () => {
    expect(motivoCorto('la página se arma con JavaScript en el navegador y trae poco texto (120 caracteres de texto sobre 9000 de HTML): guardo igual...')).toBe('armazon_js');
  });

  it('el mensaje de documento sin texto útil da "sin_texto"', () => {
    expect(motivoCorto('documento sin texto útil (0 caracteres): escaneo sin OCR o extractor fallido')).toBe('sin_texto');
  });

  it('cualquier otro mensaje cae en "otro"', () => {
    expect(motivoCorto('pasada 1: algo inesperado explotó')).toBe('otro');
  });
});

describe('esMotivoDeRed()', () => {
  it('"fetch failed" es de red', () => {
    expect(esMotivoDeRed('fetch failed')).toBe(true);
  });

  it('ECONNREFUSED, ENOTFOUND, ETIMEDOUT, EAI_AGAIN y "socket hang up" son de red', () => {
    expect(esMotivoDeRed('connect ECONNREFUSED 1.2.3.4:443')).toBe(true);
    expect(esMotivoDeRed('getaddrinfo ENOTFOUND elpais.com.uy')).toBe(true);
    expect(esMotivoDeRed('connect ETIMEDOUT 1.2.3.4:443')).toBe(true);
    expect(esMotivoDeRed('getaddrinfo EAI_AGAIN elpais.com.uy')).toBe(true);
    expect(esMotivoDeRed('socket hang up')).toBe(true);
  });

  it('HTTP 5xx y HTTP 429 son de red (ya agotaron el backoff de fetchConTimeout); un 4xx no', () => {
    expect(esMotivoDeRed('HTTP 503 al pedir https://x.uy/nota')).toBe(true);
    expect(esMotivoDeRed('HTTP 500 al pedir https://x.uy/nota')).toBe(true);
    expect(esMotivoDeRed('HTTP 429 al pedir https://x.uy/nota')).toBe(true);
    expect(esMotivoDeRed('HTTP 404 al pedir https://x.uy/nota')).toBe(false);
  });

  it('armazón JS, sin texto y cualquier otro motivo no son de red: reintentar no cambiaría nada', () => {
    expect(esMotivoDeRed('la página se arma con JavaScript en el navegador y trae poco texto (...)')).toBe(false);
    expect(esMotivoDeRed('documento sin texto útil (0 caracteres): escaneo sin OCR o extractor fallido')).toBe(false);
    expect(esMotivoDeRed('pasada 1: algo inesperado explotó')).toBe(false);
  });
});

describe('agruparErroresPorMotivo()', () => {
  it('cuenta por motivo corto (caso real: 172 fetch failed, algún otro suelto)', () => {
    const errores = [
      { url: 'a', motivo: 'fetch failed' },
      { url: 'b', motivo: 'fetch failed' },
      { url: 'c', motivo: 'HTTP 404 al pedir https://x.uy/c' },
      { url: 'd', motivo: 'documento sin texto útil (0 caracteres)' },
    ];
    expect(agruparErroresPorMotivo(errores)).toEqual({ 'fetch failed': 2, http_404: 1, sin_texto: 1 });
  });

  it('lista vacía da un objeto vacío', () => {
    expect(agruparErroresPorMotivo([])).toEqual({});
  });
});

describe('calcularCatalogadas()', () => {
  it('caso real: 173 hechas, 172 errores, 0 omitidas -> 1 catalogada, no 173', () => {
    expect(calcularCatalogadas(173, 172, 0)).toBe(1);
  });

  it('resta errores y omitidas', () => {
    expect(calcularCatalogadas(10, 2, 3)).toBe(5);
  });

  it('nunca da negativo', () => {
    expect(calcularCatalogadas(5, 10, 10)).toBe(0);
  });
});

// ------------------------------------------------------------------------------------------
// rendimiento.ts: promedioPorNota / erroresDeTrabajo / reconstruirFila / reconstruirTodas
// ------------------------------------------------------------------------------------------

describe('promedioPorNota()', () => {
  it('divide el total por las notas catalogadas', () => {
    expect(promedioPorNota(300, 3)).toBe(100);
  });

  it('con 0 notas catalogadas da null, no 0 (no "instantáneo y gratis")', () => {
    expect(promedioPorNota(0, 0)).toBeNull();
    expect(promedioPorNota(123, 0)).toBeNull();
  });
});

function trabajoDePrueba(id: string, extra: Partial<Trabajo> = {}): Trabajo {
  return { id, tipo: 'catalogar', params: {}, estado: 'hecho', creado_por: 'test', creado: '2026-09-16T00:00:00.000Z', ...extra };
}

describe('erroresDeTrabajo()', () => {
  it('usa resultado.errores si ya lo tiene', () => {
    const t = trabajoDePrueba('1', { resultado: { errores: 5 } });
    expect(erroresDeTrabajo(t)).toBe(5);
  });

  it('sin resultado.errores, cuenta params.progreso.errores (trabajos de antes del 2026-09-16)', () => {
    const t = trabajoDePrueba('1', { params: { progreso: { errores: [{ url: 'a', motivo: 'x' }, { url: 'b', motivo: 'y' }] } } });
    expect(erroresDeTrabajo(t)).toBe(2);
  });

  it('sin ninguno de los dos, da 0', () => {
    expect(erroresDeTrabajo(trabajoDePrueba('1'))).toBe(0);
  });
});

function filaDePrueba(extra: Partial<FilaRendimiento> = {}): FilaRendimiento {
  return {
    trabajo: '20260916T200028Z-db06d6ac',
    medio: 'el-pais',
    desde: '2026-08',
    hasta: '2026-08',
    notas: 173,
    segundos_por_nota: 3.0,
    tokens_entrada_por_nota: 1000,
    tokens_salida_por_nota: 200,
    modo_lote: true,
    trabajadores: 1,
    fecha: '2026-09-16T20:05:00.000Z',
    ...extra,
  };
}

describe('reconstruirFila()', () => {
  it('caso real: 173 notas, 172 errores -> reescala los promedios sobre 1 nota catalogada, no 173', () => {
    const fila = filaDePrueba();
    const trabajo = trabajoDePrueba(fila.trabajo, { resultado: { errores: 172 } });
    const r = reconstruirFila(fila, trabajo);
    expect(r.errores).toBe(172);
    expect(r.notas_catalogadas).toBe(1);
    expect(r.notas).toBe(173); // el total no se toca
    expect(r.segundos_por_nota).toBeCloseTo(3.0 * 173, 5);
    expect(r.tokens_entrada_por_nota).toBeCloseTo(1000 * 173, 5);
    expect(r.tokens_salida_por_nota).toBeCloseTo(200 * 173, 5);
  });

  it('si notas_catalogadas da 0, los promedios quedan en null (no 0)', () => {
    const fila = filaDePrueba({ notas: 5 });
    const trabajo = trabajoDePrueba(fila.trabajo, { resultado: { errores: 5 } });
    const r = reconstruirFila(fila, trabajo);
    expect(r.notas_catalogadas).toBe(0);
    expect(r.segundos_por_nota).toBeNull();
    expect(r.tokens_entrada_por_nota).toBeNull();
    expect(r.tokens_salida_por_nota).toBeNull();
  });

  it('reescala también los campos opcionales cuando están presentes, y los deja undefined si no', () => {
    const fila = filaDePrueba({ segundos_api_por_nota: 2.5, tokens_pensamiento_por_nota: 40 });
    const trabajo = trabajoDePrueba(fila.trabajo, { resultado: { errores: 172 } });
    const r = reconstruirFila(fila, trabajo);
    expect(r.segundos_api_por_nota).toBeCloseTo(2.5 * 173, 5);
    expect(r.tokens_pensamiento_por_nota).toBeCloseTo(40 * 173, 5);
    expect(r.tokens_cache_leidos_por_nota).toBeUndefined();
  });

  it('sin errores nuevos (trabajo sin errores), notas_catalogadas queda igual a notas y los promedios no cambian', () => {
    const fila = filaDePrueba({ notas: 10, segundos_por_nota: 4, tokens_entrada_por_nota: 500, tokens_salida_por_nota: 50 });
    const trabajo = trabajoDePrueba(fila.trabajo, { resultado: { errores: 0 } });
    const r = reconstruirFila(fila, trabajo);
    expect(r.notas_catalogadas).toBe(10);
    expect(r.segundos_por_nota).toBeCloseTo(4, 5);
    expect(r.tokens_entrada_por_nota).toBeCloseTo(500, 5);
  });

  it('es idempotente: reconstruir una fila ya reconstruida da el mismo resultado', () => {
    const fila = filaDePrueba();
    const trabajo = trabajoDePrueba(fila.trabajo, { resultado: { errores: 172 } });
    const una = reconstruirFila(fila, trabajo);
    const dos = reconstruirFila(una, trabajo);
    expect(dos).toEqual(una);
  });

  it('sin trabajo de origen, devuelve la fila sin tocar', () => {
    const fila = filaDePrueba();
    expect(reconstruirFila(fila, undefined)).toEqual(fila);
  });
});

describe('reconstruirTodas()', () => {
  it('reconstruye las filas cuyo trabajo aparece en la lista y deja igual las que no', () => {
    const filaConTrabajo = filaDePrueba({ trabajo: 'a' });
    const filaSinTrabajo = filaDePrueba({ trabajo: 'b-no-esta' });
    const trabajos = [trabajoDePrueba('a', { resultado: { errores: 172 } })];
    const r = reconstruirTodas([filaConTrabajo, filaSinTrabajo], trabajos);
    expect(r.actualizadas).toEqual(['a']);
    expect(r.sinTrabajo).toEqual(['b-no-esta']);
    expect(r.filas.find((f) => f.trabajo === 'b-no-esta')).toEqual(filaSinTrabajo);
    expect(r.filas.find((f) => f.trabajo === 'a')?.notas_catalogadas).toBe(1);
  });

  it('lista vacía da resultado vacío', () => {
    expect(reconstruirTodas([], [])).toEqual({ filas: [], actualizadas: [], sinTrabajo: [] });
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

// ------------------------------------------------------------------------------------------
// catalogo.ts (etapa C, docs/plan-catalogo.md): informe por persona.
// ------------------------------------------------------------------------------------------

describe('dentroDeRango()', () => {
  it('sin desde ni hasta, siempre true (aunque la fecha sea null)', () => {
    expect(dentroDeRango(null)).toBe(true);
    expect(dentroDeRango('2019-05-01')).toBe(true);
  });

  it('sin fecha y con un filtro activo, false (no se puede confirmar)', () => {
    expect(dentroDeRango(null, '2019-01')).toBe(false);
  });

  it('una fecha AAAA-MM-DD dentro del rango AAAA-MM', () => {
    expect(dentroDeRango('2019-05-15', '2019-01', '2019-12')).toBe(true);
  });

  it('una fecha antes de "desde" o después de "hasta" queda afuera', () => {
    expect(dentroDeRango('2018-12-31', '2019-01', '2019-12')).toBe(false);
    expect(dentroDeRango('2020-01-01', '2019-01', '2019-12')).toBe(false);
  });

  it('una fecha de solo año cubre los doce meses: entra si el rango pisa ese año', () => {
    expect(dentroDeRango('2019', '2019-06', '2019-08')).toBe(true);
    expect(dentroDeRango('2018', '2019-01', '2019-12')).toBe(false);
  });

  it('exacto en el borde de "desde" o "hasta" entra', () => {
    expect(dentroDeRango('2019-01-01', '2019-01', '2019-12')).toBe(true);
    expect(dentroDeRango('2019-12-31', '2019-01', '2019-12')).toBe(true);
  });
});

describe('resolverTema() / temasDeNota()', () => {
  const VALIDOS = new Set(['economia/deficit-fiscal', 'economia/impuestos']);

  it('un tema de la taxonomía se conserva', () => {
    expect(resolverTema('economia/impuestos', VALIDOS)).toBe('economia/impuestos');
  });

  it('un tema inválido, vacío o ausente cae en "sin-tema"', () => {
    expect(resolverTema('no-existe', VALIDOS)).toBe(SIN_TEMA);
    expect(resolverTema('', VALIDOS)).toBe(SIN_TEMA);
    expect(resolverTema(null, VALIDOS)).toBe(SIN_TEMA);
    expect(resolverTema(undefined, VALIDOS)).toBe(SIN_TEMA);
  });

  it('temasDeNota filtra los inválidos y conserva los que valen', () => {
    expect(temasDeNota(['economia/impuestos', 'no-existe'], VALIDOS)).toEqual(['economia/impuestos']);
  });

  it('temasDeNota sin ningún tema válido (o sin ninguno) cae en ["sin-tema"]', () => {
    expect(temasDeNota([], VALIDOS)).toEqual([SIN_TEMA]);
    expect(temasDeNota(['no-existe'], VALIDOS)).toEqual([SIN_TEMA]);
  });
});

describe('notaParaInforme()', () => {
  function notaConCatalogo(): Nota {
    return {
      id: 'nota-1',
      url: 'https://x.uy/nota-1',
      url_canonica: 'https://x.uy/nota-1-canonica',
      medio: 'el-pais',
      fecha: '2019-05-10',
      titulo: 'Título',
      autor: null,
      tipo: 'html',
      texto: 'texto',
      retrieved_at: '2019-05-10T00:00:00Z',
      archived_url: null,
      text_sha256: '0',
      etiquetas: { ...etiquetasVacias(), temas: ['economia/impuestos'] },
      resumen: null,
      catalogo: {
        version: 'v1',
        modelo: 'haiku',
        fecha: '2019-05-10T00:00:00Z',
        relevancia: { astori: 'central', 'lacalle-pou': 'mencion' },
        tiene_afirmaciones: true,
        afirmaciones: [
          { politico: 'astori', cita: 'cita de astori bien larga', posicion: 0, atribucion: 'directa', tipo: 'dato', tema: 'economia/impuestos', dato: { que: 'x', valor: 'y' }, fecha_dicho: '2019-05-01' },
          { politico: 'lacalle-pou', cita: 'cita de lacalle bien larga', posicion: 30, atribucion: 'directa', tipo: 'posicion', tema: 'economia/impuestos', dato: null, fecha_dicho: null },
        ],
        descartadas: 0,
      },
    };
  }

  it('usa url_canonica, y filtra las afirmaciones al político pedido', () => {
    const n = notaParaInforme(notaConCatalogo(), 'astori');
    expect(n.url).toBe('https://x.uy/nota-1-canonica');
    expect(n.medio).toBe('el-pais');
    expect(n.fecha).toBe('2019-05-10');
    expect(n.temasNota).toEqual(['economia/impuestos']);
    expect(n.relevancia).toBe('central');
    expect(n.afirmaciones).toHaveLength(1);
    expect(n.afirmaciones[0].cita).toBe('cita de astori bien larga');
  });

  it('un político sin relevancia declarada en esta nota da relevancia undefined', () => {
    const n = notaParaInforme(notaConCatalogo(), 'orsi');
    expect(n.relevancia).toBeUndefined();
    expect(n.afirmaciones).toEqual([]);
  });

  it('una nota sin catálogo da afirmaciones vacías y relevancia undefined, sin romper', () => {
    const base = notaConCatalogo();
    delete (base as { catalogo?: unknown }).catalogo;
    const n = notaParaInforme(base, 'astori');
    expect(n.afirmaciones).toEqual([]);
    expect(n.relevancia).toBeUndefined();
  });
});

describe('armarLotesDeTema()', () => {
  const fecha = (dia: number) => `2019-01-${String(dia).padStart(2, '0')}`;
  const afirmacion = (id: string, dia: number, tipo: AfirmacionInformeSalida['tipo']): AfirmacionInformeSalida => ({
    nota: { id, medio: 'el-pais', fecha: fecha(dia), url: `https://x.uy/${id}` },
    cita: 'x'.repeat(25),
    tipo,
    dato: tipo === 'dato' ? { que: 'q', valor: 'v' } : null,
    atribucion: 'directa',
    fecha: fecha(dia),
  });

  it('35 notas con un "dato" cada una se parten en dos períodos: 30 y 5 (tope de datos)', () => {
    const total = MAX_DATOS_POR_LOTE + 5;
    const afirmaciones = Array.from({ length: total }, (_, i) => afirmacion(`n${i}`, i + 1, 'dato'));
    const lotes = armarLotesDeTema('economia/deficit-fiscal', afirmaciones, []);
    expect(lotes).toHaveLength(2);
    expect(lotes[0].notas).toBe(MAX_DATOS_POR_LOTE);
    expect(lotes[0].datos).toBe(MAX_DATOS_POR_LOTE);
    expect(lotes[0].periodo).toEqual({ desde: fecha(1), hasta: fecha(MAX_DATOS_POR_LOTE) });
    expect(lotes[1].notas).toBe(5);
    expect(lotes[1].datos).toBe(5);
    expect(lotes[1].periodo).toEqual({ desde: fecha(MAX_DATOS_POR_LOTE + 1), hasta: fecha(total) });
  });

  it('"posicion" no cuenta para el tope de 30: 40 notas de posición caben en un solo lote', () => {
    const afirmaciones = Array.from({ length: MAX_NOTAS_POR_LOTE }, (_, i) => afirmacion(`n${i}`, i + 1, 'posicion'));
    const lotes = armarLotesDeTema('tema', afirmaciones, []);
    expect(lotes).toHaveLength(1);
    expect(lotes[0].notas).toBe(MAX_NOTAS_POR_LOTE);
    expect(lotes[0].datos).toBe(0);
    expect(lotes[0].posiciones).toBe(MAX_NOTAS_POR_LOTE);
  });

  it('la nota 41 de puras "posicion" abre un segundo lote por el tope de 40 notas', () => {
    const afirmaciones = Array.from({ length: MAX_NOTAS_POR_LOTE + 1 }, (_, i) => afirmacion(`n${i}`, i + 1, 'posicion'));
    const lotes = armarLotesDeTema('tema', afirmaciones, []);
    expect(lotes).toHaveLength(2);
    expect(lotes[0].notas).toBe(MAX_NOTAS_POR_LOTE);
    expect(lotes[1].notas).toBe(1);
  });

  it('una nota de cobertura (sin afirmaciones) cuenta para el tope de notas pero no para el de datos', () => {
    const cobertura: NotaCoberturaSalida[] = [{ id: 'cov-1', medio: 'el-pais', fecha: fecha(1), url: 'https://x.uy/cov-1', relevancia: 'central' }];
    const lotes = armarLotesDeTema('tema', [afirmacion('n1', 2, 'dato')], cobertura);
    expect(lotes).toHaveLength(1);
    expect(lotes[0].notas).toBe(2);
    expect(lotes[0].datos).toBe(1);
    expect(lotes[0].periodo).toEqual({ desde: fecha(1), hasta: fecha(2) });
  });

  it('sin afirmaciones ni cobertura, no propone ningún lote', () => {
    expect(armarLotesDeTema('tema', [], [])).toEqual([]);
  });

  it('varias afirmaciones "dato" de la misma nota se agrupan en un solo ítem (con la fecha más temprana)', () => {
    const afirmaciones = [afirmacion('n1', 10, 'dato'), afirmacion('n1', 5, 'dato'), afirmacion('n2', 1, 'promesa')];
    const lotes = armarLotesDeTema('tema', afirmaciones, []);
    expect(lotes).toHaveLength(1);
    expect(lotes[0].notas).toBe(2); // n1 y n2, no 3
    expect(lotes[0].datos).toBe(2);
    expect(lotes[0].promesas).toBe(1);
    expect(lotes[0].periodo.desde).toBe(fecha(1)); // n2 (1) va antes que n1 (fecha más temprana: 5)
  });
});

describe('armarInforme()', () => {
  const TEMAS_VALIDOS = new Set(['economia/deficit-fiscal', 'economia/impuestos']);
  const fecha = (dia: number) => `2019-01-${String(dia).padStart(2, '0')}`;

  function notaConAfirmacion(id: string, dia: number, tema: string, tipo: NotaParaInforme['afirmaciones'][number]['tipo'] = 'dato'): NotaParaInforme {
    return {
      id,
      medio: 'el-pais',
      fecha: fecha(dia),
      url: `https://x.uy/${id}`,
      temasNota: [],
      relevancia: 'central',
      afirmaciones: [{ cita: 'x'.repeat(25), tipo, tema, dato: tipo === 'dato' ? { que: 'q', valor: 'v' } : null, atribucion: 'directa', fecha_dicho: fecha(dia) }],
    };
  }

  function notaCobertura(id: string, dia: number, temasNota: string[]): NotaParaInforme {
    return { id, medio: 'la-diaria', fecha: fecha(dia), url: `https://x.uy/${id}`, temasNota, relevancia: 'secundaria', afirmaciones: [] };
  }

  // Un político con dos temas: "economia/deficit-fiscal" se pasa de 30 "dato" y se parte en dos
  // períodos; "economia/impuestos" tiene pocas afirmaciones más una nota de cobertura. Una
  // afirmación extra con tema inválido prueba el balde "sin-tema".
  function notasDePrueba(): NotaParaInforme[] {
    const deficit = Array.from({ length: 35 }, (_, i) => notaConAfirmacion(`def-${i}`, i + 1, 'economia/deficit-fiscal'));
    const impuestos = [notaConAfirmacion('imp-1', 1, 'economia/impuestos', 'promesa'), notaConAfirmacion('imp-2', 2, 'economia/impuestos', 'dato'), notaCobertura('imp-cov', 3, ['economia/impuestos'])];
    const sinTema = [notaConAfirmacion('raro-1', 1, 'no-existe', 'posicion')];
    return [...deficit, ...impuestos, ...sinTema];
  }

  it('junta afirmaciones y cobertura por tema, y parte en dos lotes el tema que se pasa de 30 datos', () => {
    const informe = armarInforme('astori', notasDePrueba(), TEMAS_VALIDOS);
    expect(Object.keys(informe.temas).sort()).toEqual(['economia/deficit-fiscal', 'economia/impuestos', SIN_TEMA]);

    const lotesDeficit = informe.lotes.filter((l) => l.tema === 'economia/deficit-fiscal');
    expect(lotesDeficit).toHaveLength(2);
    expect(lotesDeficit[0].notas + lotesDeficit[1].notas).toBe(35);

    const impuestos = informe.temas['economia/impuestos'];
    expect(impuestos.afirmaciones).toHaveLength(2);
    expect(impuestos.notas_cobertura).toHaveLength(1);
    expect(impuestos.resumen.notas).toBe(3);
    expect(impuestos.resumen.por_tipo).toEqual({ dato: 1, promesa: 1, posicion: 0, mencion_a: 0 });

    expect(informe.afirmaciones_sin_tema_valido).toBe(1);
    expect(informe.notas_totales).toBe(39); // 35 + 3 + 1
    expect(informe.afirmaciones_totales).toBe(35 + 2 + 1);
  });

  it('--tema filtra a un solo tema en la salida, pero no achica "afirmaciones_sin_tema_valido"', () => {
    const informe = armarInforme('astori', notasDePrueba(), TEMAS_VALIDOS, { tema: 'economia/impuestos' });
    expect(Object.keys(informe.temas)).toEqual(['economia/impuestos']);
    expect(informe.lotes.every((l) => l.tema === 'economia/impuestos')).toBe(true);
    expect(informe.notas_totales).toBe(3);
    expect(informe.afirmaciones_sin_tema_valido).toBe(1); // señal global, no se recorta con --tema
    expect(informe.filtros).toEqual({ desde: null, hasta: null, tema: 'economia/impuestos' });
  });

  it('--tema por un slug sin ninguna afirmación ni cobertura da un informe vacío, no un error', () => {
    const informe = armarInforme('astori', notasDePrueba(), TEMAS_VALIDOS, { tema: 'economia/deuda-publica' });
    expect(informe.temas).toEqual({});
    expect(informe.lotes).toEqual([]);
    expect(informe.notas_totales).toBe(0);
  });

  it('--desde/--hasta recorta las afirmaciones y notas de cobertura fuera de rango', () => {
    const informe = armarInforme('astori', notasDePrueba(), TEMAS_VALIDOS, { tema: 'economia/deficit-fiscal', desde: '2019-01', hasta: '2019-01' });
    // fecha(10) = 2019-01-10, todas las 35 caen en enero de 2019: el filtro de mes no las saca.
    expect(informe.temas['economia/deficit-fiscal'].afirmaciones).toHaveLength(35);
  });

  it('--desde recorta afirmaciones de meses anteriores al corte (por fecha_dicho)', () => {
    const notaVieja: NotaParaInforme = {
      id: 'a',
      medio: 'el-pais',
      fecha: '2018-12-15',
      url: 'https://x.uy/a',
      temasNota: [],
      relevancia: 'central',
      afirmaciones: [{ cita: 'x'.repeat(25), tipo: 'dato', tema: 'economia/impuestos', dato: { que: 'q', valor: 'v' }, atribucion: 'directa', fecha_dicho: '2018-12-15' }],
    };
    const notaNueva: NotaParaInforme = {
      id: 'b',
      medio: 'el-pais',
      fecha: '2019-01-20',
      url: 'https://x.uy/b',
      temasNota: [],
      relevancia: 'central',
      afirmaciones: [{ cita: 'y'.repeat(25), tipo: 'dato', tema: 'economia/impuestos', dato: { que: 'q', valor: 'v' }, atribucion: 'directa', fecha_dicho: '2019-01-20' }],
    };
    const informe = armarInforme('astori', [notaVieja, notaNueva], TEMAS_VALIDOS, { desde: '2019-01' });
    expect(informe.temas['economia/impuestos'].afirmaciones).toHaveLength(1);
    expect(informe.temas['economia/impuestos'].afirmaciones[0].nota.id).toBe('b');
  });

  it('lotes[] ordenados por cantidad de "dato" descendente', () => {
    const informe = armarInforme('astori', notasDePrueba(), TEMAS_VALIDOS);
    const datos = informe.lotes.map((l) => l.datos);
    expect(datos).toEqual([...datos].sort((a, b) => b - a));
  });
});

describe('formatearInformeTexto()', () => {
  it('incluye al político, el conteo de temas y de lotes', () => {
    const informe: InformeCatalogo = {
      politico: 'astori',
      generado: '2019-01-01T00:00:00Z',
      filtros: { desde: null, hasta: null, tema: null },
      notas_totales: 2,
      afirmaciones_totales: 2,
      afirmaciones_sin_tema_valido: 0,
      medios_distintos: 1,
      temas: {
        'economia/impuestos': {
          afirmaciones: [],
          notas_cobertura: [],
          resumen: { notas: 2, por_tipo: { dato: 1, promesa: 1, posicion: 0, mencion_a: 0 }, primer_dicho: '2019-01-01', ultimo_dicho: '2019-01-02', medios_distintos: 1 },
        },
      },
      lotes: [{ tema: 'economia/impuestos', periodo: { desde: '2019-01-01', hasta: '2019-01-02' }, notas: 2, nota_ids: ['a', 'b'], datos: 1, promesas: 1, posiciones: 0, menciones_a: 0 }],
    };
    const texto = formatearInformeTexto(informe);
    expect(texto).toContain('astori');
    expect(texto).toContain('economia/impuestos');
    expect(texto).toContain('lotes propuestos');
    expect(texto).toContain('0 afirmación(es) sin tema válido');
  });
});

describe('escribirCatalogo()', () => {
  let carpeta: string;
  afterEach(() => {
    if (carpeta) rmSync(carpeta, { recursive: true, force: true });
  });

  it('escribe data/catalogo/<politico>.json y crea la carpeta si falta', () => {
    carpeta = mkdtempSync(join(tmpdir(), 'la-casta-catalogo-'));
    const destino = join(carpeta, 'anidada', 'catalogo');
    const informe: InformeCatalogo = {
      politico: 'astori',
      generado: '2019-01-01T00:00:00Z',
      filtros: { desde: null, hasta: null, tema: null },
      notas_totales: 0,
      afirmaciones_totales: 0,
      afirmaciones_sin_tema_valido: 0,
      medios_distintos: 0,
      temas: {},
      lotes: [],
    };
    const ruta = escribirCatalogo('astori', informe, destino);
    expect(ruta).toBe(join(destino, 'astori.json'));
    const leido = JSON.parse(readFileSync(ruta, 'utf8'));
    expect(leido).toEqual(informe);
  });
});

describe('idsQueMencionan() / recolectarNotas() — índice y notas temporales', () => {
  let carpetaIndice: string;
  let carpetaNotas: string;

  afterEach(() => {
    if (carpetaIndice) rmSync(carpetaIndice, { recursive: true, force: true });
    if (carpetaNotas) rmSync(carpetaNotas, { recursive: true, force: true });
  });

  function escribirNotaEnCarpeta(carpeta: string, nota: Nota): void {
    writeFileSync(join(carpeta, `${nota.id}.json`), JSON.stringify(nota, null, 1), 'utf8');
  }

  it('junta candidatas de "menciones" (cobertura) y de "afirmaciones", y lee el detalle de cada nota', () => {
    carpetaIndice = mkdtempSync(join(tmpdir(), 'la-casta-indice-c-'));
    carpetaNotas = mkdtempSync(join(tmpdir(), 'la-casta-notas-c-'));
    const indice = abrirIndice({ ruta: join(carpetaIndice, 'indice.db') });
    try {
      const notaConDato: Nota = {
        id: 'con-dato',
        url: 'https://x.uy/1',
        url_canonica: 'https://x.uy/1',
        medio: 'el-pais',
        fecha: '2019-05-01',
        titulo: null,
        autor: null,
        tipo: 'html',
        texto: 't',
        retrieved_at: '2019-05-01T00:00:00Z',
        archived_url: null,
        text_sha256: '0',
        etiquetas: { ...etiquetasVacias(), politicos: ['astori'] },
        resumen: null,
        catalogo: {
          version: 'v1',
          modelo: 'haiku',
          fecha: '2019-05-01T00:00:00Z',
          relevancia: { astori: 'central' },
          tiene_afirmaciones: true,
          afirmaciones: [{ politico: 'astori', cita: 'x'.repeat(25), posicion: 0, atribucion: 'directa', tipo: 'dato', tema: 'economia/impuestos', dato: { que: 'q', valor: 'v' }, fecha_dicho: null }],
          descartadas: 0,
        },
      };
      const notaCobertura: Nota = {
        id: 'cobertura',
        url: 'https://x.uy/2',
        url_canonica: 'https://x.uy/2',
        medio: 'la-diaria',
        fecha: '2019-06-01',
        titulo: null,
        autor: null,
        tipo: 'html',
        texto: 't',
        retrieved_at: '2019-06-01T00:00:00Z',
        archived_url: null,
        text_sha256: '0',
        etiquetas: { ...etiquetasVacias(), politicos: ['astori'], temas: ['economia/impuestos'] },
        resumen: null,
        catalogo: { version: 'v1', modelo: 'haiku', fecha: '2019-06-01T00:00:00Z', relevancia: { astori: 'secundaria' }, tiene_afirmaciones: false },
      };
      indexarNota(indice, notaConDato);
      indexarNota(indice, notaCobertura);
      escribirNotaEnCarpeta(carpetaNotas, notaConDato);
      escribirNotaEnCarpeta(carpetaNotas, notaCobertura);

      const ids = idsQueMencionan(indice, 'astori').sort();
      expect(ids).toEqual(['cobertura', 'con-dato']);

      const notas = recolectarNotas(indice, 'astori', carpetaNotas).sort((a, b) => a.id.localeCompare(b.id));
      expect(notas.map((n) => n.id)).toEqual(['cobertura', 'con-dato']);
      expect(notas[0].relevancia).toBe('secundaria');
      expect(notas[0].afirmaciones).toEqual([]);
      expect(notas[1].relevancia).toBe('central');
      expect(notas[1].afirmaciones).toHaveLength(1);
    } finally {
      indice.cerrar();
    }
  });

  it('leerNotaDeCarpeta devuelve null si el archivo no existe (no rompe)', () => {
    carpetaNotas = mkdtempSync(join(tmpdir(), 'la-casta-notas-c-'));
    expect(leerNotaDeCarpeta('no-existe', carpetaNotas)).toBeNull();
  });
});
