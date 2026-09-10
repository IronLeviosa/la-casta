/**
 * `pnpm dato` (plan-2026-09, ítem 3.2 de la fase 3): series oficiales en
 * docs/fuentes-oficiales/series.yaml + ubicación de fila/valor + bloque para dato_real.fuentes[].
 *
 * Solo funciones puras, sin red: nada acá llama a `obtenerNota` (eso baja de la red y toca el
 * corpus privado). Los fixtures de texto imitan lo que `pnpm fuente` imprimiría para cada formato
 * real (planilla con tabs, csv con `;`, csv con comillas, y el reporte de ancho fijo del BCU).
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parse as parseYaml } from 'yaml';
import { RAIZ } from '../scripts/lib/rutas.ts';
import {
  armarBloqueDatoReal,
  construirUrl,
  dividirCeldas,
  extraerUrlDeRecurso,
  extremosDisponibles,
  fechaDeCita,
  isoFecha,
  listarSeries,
  parsearPeriodo,
  parsearSeries,
  tituloMes,
  ubicarFila,
  validarPeriodoParaSerie,
  type SerieOficial,
} from '../scripts/dato.ts';

function serieBase(extra: Partial<SerieOficial>): SerieOficial {
  return {
    id: 'serie-prueba',
    organismo: 'Organismo de prueba',
    nombre: 'Serie de prueba',
    unidad: 'unidades',
    frecuencia: 'mensual',
    url: 'https://ejemplo.uy/serie.xlsx',
    tipo: 'planilla',
    como_leer: 'columna B',
    desde: '2020-01',
    ejemplo: 'ejemplo',
    verificado: '2026-09-10',
    ...extra,
  };
}

describe('parsearSeries', () => {
  const YAML_OK = `
series:
  - id: bcu-ejemplo
    organismo: BCU
    nombre: Tipo de cambio
    unidad: UYU por USD
    frecuencia: diaria
    url: https://ejemplo.uy/x
    tipo: api_json
    como_leer: fila tal
    desde: '2000-01-01'
    ejemplo: 'linea de ejemplo'
    verificado: '2026-09-10'
`;

  it('parsea una serie válida', () => {
    const series = parsearSeries(YAML_OK);
    expect(series).toHaveLength(1);
    expect(series[0].id).toBe('bcu-ejemplo');
    expect(series[0].frecuencia).toBe('diaria');
  });

  it('rechaza un archivo sin la clave "series"', () => {
    expect(() => parsearSeries('otracosa: []\n')).toThrow(/clave "series"/);
  });

  it('rechaza una serie sin un campo obligatorio', () => {
    const sinUnidad = YAML_OK.replace('    unidad: UYU por USD\n', '');
    expect(() => parsearSeries(sinUnidad)).toThrow(/"unidad"/);
  });

  it('rechaza ids repetidos', () => {
    const dosVeces = YAML_OK + YAML_OK.replace('series:\n', '');
    expect(() => parsearSeries(dosVeces)).toThrow(/repetido/);
  });

  it('exige "url" si la serie no es manual', () => {
    const sinUrl = YAML_OK.replace('    url: https://ejemplo.uy/x\n', '');
    expect(() => parsearSeries(sinUrl)).toThrow(/no tiene "url"/);
  });

  it('una serie manual no necesita "url" pero sí "como_buscar"', () => {
    const manual = `
series:
  - id: mef-ejemplo
    organismo: MEF
    nombre: Resultado fiscal
    unidad: '% del PIB'
    frecuencia: mensual
    manual: true
    desde: '1999-01'
    ejemplo: 'ejemplo'
    verificado: '2026-09-10'
`;
    expect(() => parsearSeries(manual)).toThrow(/"como_buscar"/);
    const conBusqueda = manual + '    como_buscar: buscar en comunicados\n';
    const series = parsearSeries(conBusqueda);
    expect(series[0].manual).toBe(true);
    expect(series[0].url).toBeUndefined();
  });
});

describe('listarSeries', () => {
  it('una línea por serie, con [manual] cuando corresponde', () => {
    const series = [serieBase({ id: 'a', frecuencia: 'mensual' }), serieBase({ id: 'b', manual: true, como_buscar: 'x' })];
    const salida = listarSeries(series);
    const lineas = salida.split('\n');
    expect(lineas).toHaveLength(2);
    expect(lineas[0]).toContain('a');
    expect(lineas[0]).toContain('mensual');
    expect(lineas[1]).toContain('[manual]');
  });
});

describe('parsearPeriodo', () => {
  it('--fecha da año, mes y día', () => {
    expect(parsearPeriodo({ fecha: '2022-03-25' })).toEqual({ anio: 2022, mes: 3, dia: 25 });
  });
  it('--mes da año y mes', () => {
    expect(parsearPeriodo({ mes: '2022-03' })).toEqual({ anio: 2022, mes: 3 });
  });
  it('--anio da solo el año', () => {
    expect(parsearPeriodo({ anio: '2022' })).toEqual({ anio: 2022 });
  });
  it('sin ninguna opción, período vacío', () => {
    expect(parsearPeriodo({})).toEqual({});
  });
  it('--fecha mal formada lanza', () => {
    expect(() => parsearPeriodo({ fecha: '25/03/2022' })).toThrow(/AAAA-MM-DD/);
  });
  it('--mes mal formado lanza', () => {
    expect(() => parsearPeriodo({ mes: '2022' })).toThrow(/AAAA-MM/);
  });
  it('--anio no numérico lanza', () => {
    expect(() => parsearPeriodo({ anio: 'hoy' })).toThrow(/año/);
  });
  it('--fecha tiene precedencia sobre --mes y --anio', () => {
    expect(parsearPeriodo({ fecha: '2022-03-25', mes: '2021-01', anio: '2019' })).toEqual({ anio: 2022, mes: 3, dia: 25 });
  });
});

describe('validarPeriodoParaSerie', () => {
  it('serie anual acepta --anio', () => {
    expect(() => validarPeriodoParaSerie(serieBase({ frecuencia: 'anual' }), { anio: 2022 })).not.toThrow();
  });
  it('serie anual rechaza período vacío y sugiere --anio', () => {
    expect(() => validarPeriodoParaSerie(serieBase({ frecuencia: 'anual' }), {})).toThrow(/--anio/);
  });
  it('serie mensual rechaza solo --anio', () => {
    expect(() => validarPeriodoParaSerie(serieBase({ frecuencia: 'mensual' }), { anio: 2022 })).toThrow(/--mes/);
  });
  it('serie mensual acepta --mes o una fecha completa', () => {
    expect(() => validarPeriodoParaSerie(serieBase({ frecuencia: 'mensual' }), { anio: 2022, mes: 3 })).not.toThrow();
    expect(() => validarPeriodoParaSerie(serieBase({ frecuencia: 'mensual' }), { anio: 2022, mes: 3, dia: 25 })).not.toThrow();
  });
  it('serie diaria exige fecha completa', () => {
    expect(() => validarPeriodoParaSerie(serieBase({ frecuencia: 'diaria' }), { anio: 2022, mes: 3 })).toThrow(/--fecha/);
    expect(() => validarPeriodoParaSerie(serieBase({ frecuencia: 'diaria' }), { anio: 2022, mes: 3, dia: 25 })).not.toThrow();
  });
});

describe('fechaDeCita / isoFecha / tituloMes', () => {
  it('isoFecha rellena con ceros', () => {
    expect(isoFecha(2022, 3, 5)).toBe('2022-03-05');
  });
  it('fechaDeCita usa el día si está, si no el 1° del mes o del año', () => {
    expect(fechaDeCita({ anio: 2022, mes: 3, dia: 25 })).toBe('2022-03-25');
    expect(fechaDeCita({ anio: 2022, mes: 3 })).toBe('2022-03-01');
    expect(fechaDeCita({ anio: 2022 })).toBe('2022-01-01');
  });
  it('tituloMes capitaliza el nombre en español (setiembre, no septiembre)', () => {
    expect(tituloMes(1)).toBe('Enero');
    expect(tituloMes(9)).toBe('Setiembre');
    expect(tituloMes(12)).toBe('Diciembre');
  });
});

describe('construirUrl', () => {
  it('sustituye {fecha} en formato ISO por defecto', () => {
    const serie = serieBase({ url: 'https://ejemplo.uy/{fecha}/datos' });
    expect(construirUrl(serie, { anio: 2022, mes: 3, dia: 25 })).toBe('https://ejemplo.uy/2022-03-25/datos');
  });
  it('sustituye {fecha} en dd/mm/aaaa cuando la serie lo pide', () => {
    const serie = serieBase({ url: 'https://ejemplo.uy/?f={fecha}', formato_fecha_url: 'dd/mm/aaaa' });
    expect(construirUrl(serie, { anio: 2022, mes: 3, dia: 5 })).toBe('https://ejemplo.uy/?f=05/03/2022');
  });
  it('sustituye {anio}', () => {
    const serie = serieBase({ url: 'https://ejemplo.uy/{anio}/datos' });
    expect(construirUrl(serie, { anio: 2022 })).toBe('https://ejemplo.uy/2022/datos');
  });
  it('sin placeholders, devuelve la url tal cual', () => {
    const serie = serieBase({ url: 'https://ejemplo.uy/fijo' });
    expect(construirUrl(serie, {})).toBe('https://ejemplo.uy/fijo');
  });
  it('{fecha} sin --fecha (solo --mes) lanza un mensaje claro', () => {
    const serie = serieBase({ url: 'https://ejemplo.uy/{fecha}' });
    expect(() => construirUrl(serie, { anio: 2022, mes: 3 })).toThrow(/--fecha/);
  });
});

describe('dividirCeldas', () => {
  it('separador tab', () => {
    expect(dividirCeldas('a\tb\tc', 'tab')).toEqual(['a', 'b', 'c']);
  });
  it('separador ;', () => {
    expect(dividirCeldas('2022;3;valor', ';')).toEqual(['2022', '3', 'valor']);
  });
  it('separador de espacios (2 o más) como el reporte de ancho fijo del BCU', () => {
    const linea = 'URUGUAY                DLS.PROMED.FONDO       2230  UYU      41.478';
    expect(dividirCeldas(linea, 'espacios')).toEqual(['URUGUAY', 'DLS.PROMED.FONDO', '2230', 'UYU', '41.478']);
  });
  it('csv con comillas: una coma dentro de comillas no separa', () => {
    const linea = '1,"Documentos (Cartas, folletos)",Certificado,80,UYU';
    expect(dividirCeldas(linea, ',', true)).toEqual(['1', 'Documentos (Cartas, folletos)', 'Certificado', '80', 'UYU']);
  });
  it('csv con comillas: comillas dobles escapadas', () => {
    expect(dividirCeldas('a,"dice ""hola""",c', ',', true)).toEqual(['a', 'dice "hola"', 'c']);
  });
});

describe('ubicarFila: fecha_iso', () => {
  const TEXTO = ['2002-01-01\t16.3\t15.6', '2009-05-01\t57.01\t54.95', '2019-05-01\t57.01\t54.95'].join('\n');

  it('encuentra el mes pedido (frecuencia mensual matchea por prefijo año-mes)', () => {
    const serie = serieBase({ formato_periodo: 'fecha_iso', separador: 'tab', columna: 2, frecuencia: 'mensual' });
    const r = ubicarFila(TEXTO, serie, { anio: 2009, mes: 5 });
    expect(r?.celdas[2]).toBe('54.95');
    expect(r?.linea).toBe('2009-05-01\t57.01\t54.95');
  });

  it('no encuentra un mes fuera de la serie', () => {
    const serie = serieBase({ formato_periodo: 'fecha_iso', separador: 'tab', columna: 2 });
    expect(ubicarFila(TEXTO, serie, { anio: 2020, mes: 1 })).toBeNull();
  });

  it('respeta un filtro adicional', () => {
    const conFiltro = ['2022-03-01\tGASOIL\t40.4', '2022-03-01\tSUPER95\t54.95'].join('\n');
    const serie = serieBase({ formato_periodo: 'fecha_iso', separador: 'tab', columna: 2, filtro: 'SUPER95' });
    expect(ubicarFila(conFiltro, serie, { anio: 2022, mes: 3 })?.celdas[2]).toBe('54.95');
  });

  it('columna_periodo distinta de 0 (fecha al final de la fila, como el CSV del correo)', () => {
    const texto = ['x,y,2019-11-01', 'x,z,2020-11-01'].join('\n');
    const serie = serieBase({ formato_periodo: 'fecha_iso', separador: ',', columna_periodo: 2, columna: 1, frecuencia: 'anual' });
    expect(ubicarFila(texto, serie, { anio: 2020 })?.celdas[1]).toBe('z');
  });
});

describe('ubicarFila: anio_mes_columnas', () => {
  const TEXTO_DGI = ['Año;Mes;Total', '2026;may;100', '2026;jun;200'].join('\n');
  const TEXTO_ANCAP = ['2022;3;GASOIL;40,4;$/lt', '2022;3;SUPER95;74,88;$/lt'].join('\n');

  it('mes como abreviatura en español (DGI)', () => {
    const serie = serieBase({ formato_periodo: 'anio_mes_columnas', separador: ';', columna: 2 });
    expect(ubicarFila(TEXTO_DGI, serie, { anio: 2026, mes: 6 })?.celdas[2]).toBe('200');
  });

  it('mes como número sin cero inicial (catalogodatos ANCAP), con filtro por producto', () => {
    const serie = serieBase({ formato_periodo: 'anio_mes_columnas', separador: ';', columna: 3, filtro: 'SUPER95' });
    expect(ubicarFila(TEXTO_ANCAP, serie, { anio: 2022, mes: 3 })?.celdas[3]).toBe('74,88');
  });

  it('no matchea un año distinto', () => {
    const serie = serieBase({ formato_periodo: 'anio_mes_columnas', separador: ';', columna: 2 });
    expect(ubicarFila(TEXTO_DGI, serie, { anio: 2025, mes: 6 })).toBeNull();
  });
});

describe('ubicarFila: anio_bloque_mes (formato INE/ECH)', () => {
  const TEXTO = [
    'Tasa de desempleo por área geográfica',
    'Año, Trimestre y Mes\tTotal Pais\tMontevideo',
    '2006',
    'Enero (2)\t13.2\t12.3',
    'Febrero (2)\t12.2\t11.5',
    'Enero - Marzo/06 (2)\t12.4\t12.1',
    'Total 2006 (2)\t10.8\t10.5',
    '2007',
    'Enero (2)\t10.0\t9.3',
  ].join('\n');

  it('ubica el mes dentro del bloque del año correcto', () => {
    const serie = serieBase({ formato_periodo: 'anio_bloque_mes', separador: 'tab', columna: 1 });
    expect(ubicarFila(TEXTO, serie, { anio: 2006, mes: 2 })?.celdas[1]).toBe('12.2');
  });

  it('no confunde un rango trimestral ("Enero - Marzo") con el mes "Enero"', () => {
    const serie = serieBase({ formato_periodo: 'anio_bloque_mes', separador: 'tab', columna: 1 });
    const r = ubicarFila(TEXTO, serie, { anio: 2006, mes: 1 });
    expect(r?.celdas[1]).toBe('13.2'); // la fila "Enero (2)", no "Enero - Marzo/06 (2)" (12.4)
  });

  it('el mismo mes en otro año da otra fila', () => {
    const serie = serieBase({ formato_periodo: 'anio_bloque_mes', separador: 'tab', columna: 1 });
    expect(ubicarFila(TEXTO, serie, { anio: 2007, mes: 1 })?.celdas[1]).toBe('10.0');
  });

  it('no encuentra un año que no está', () => {
    const serie = serieBase({ formato_periodo: 'anio_bloque_mes', separador: 'tab', columna: 1 });
    expect(ubicarFila(TEXTO, serie, { anio: 2010, mes: 1 })).toBeNull();
  });
});

describe('ubicarFila: mes_abrev_en_anio2 (formato ANP Brasil)', () => {
  const TEXTO = ['Jan-13\tGASOLINA COMUM\t2.763', 'Mar-22\tGASOLINA COMUM\t1.718', 'Mar-22\tOLEO DIESEL\t1.283'].join('\n');

  it('ubica por mes abreviado en inglés + año de 2 dígitos, con filtro de producto', () => {
    const serie = serieBase({ formato_periodo: 'mes_abrev_en_anio2', separador: 'tab', columna: 2, filtro: 'GASOLINA COMUM' });
    expect(ubicarFila(TEXTO, serie, { anio: 2022, mes: 3 })?.celdas[2]).toBe('1.718');
  });

  it('sin el filtro correcto, no matchea la fila de otro producto', () => {
    const serie = serieBase({ formato_periodo: 'mes_abrev_en_anio2', separador: 'tab', columna: 2, filtro: 'ETANOL' });
    expect(ubicarFila(TEXTO, serie, { anio: 2022, mes: 3 })).toBeNull();
  });
});

describe('ubicarFila: ninguno (documento de un único período, como el BCU diario)', () => {
  const TEXTO = [
    'ESTADOS UNIDOS         DLS. USA BILLETE       2225  UYU      41.478',
    'URUGUAY                DLS.PROMED.FONDO       2230  UYU      41.478',
  ].join('\n');

  it('ubica la fila por el filtro solo, sin período', () => {
    const serie = serieBase({ formato_periodo: 'ninguno', separador: 'espacios', columna: 4, filtro: 'DLS.PROMED.FONDO' });
    expect(ubicarFila(TEXTO, serie, {})?.celdas[4]).toBe('41.478');
  });

  it('sin "filtro" configurado, lanza (no hay forma de elegir la fila)', () => {
    const serie = serieBase({ formato_periodo: 'ninguno', separador: 'espacios', columna: 4 });
    expect(() => ubicarFila(TEXTO, serie, {})).toThrow(/filtro/);
  });
});

describe('extremosDisponibles', () => {
  it('fecha_iso: primero y último período presentes', () => {
    const texto = ['2002-01-01\tx', '2009-05-01\tx', '2019-05-01\tx'].join('\n');
    const serie = serieBase({ formato_periodo: 'fecha_iso', separador: 'tab' });
    expect(extremosDisponibles(texto, serie)).toEqual({ primero: '2002-01-01', ultimo: '2019-05-01' });
  });

  it('anio_bloque_mes: primero y último año con bloque propio', () => {
    const texto = ['2006', 'Enero (2)\t1', '2007', 'Enero (2)\t2', '2026', 'Enero (2)\t3'].join('\n');
    const serie = serieBase({ formato_periodo: 'anio_bloque_mes', separador: 'tab' });
    expect(extremosDisponibles(texto, serie)).toEqual({ primero: '2006', ultimo: '2026' });
  });

  it('sin períodos reconocibles, devuelve null', () => {
    const serie = serieBase({ formato_periodo: 'ninguno' });
    expect(extremosDisponibles('nada de nada', serie)).toBeNull();
  });
});

describe('extraerUrlDeRecurso (indirección CKAN)', () => {
  const JSON_CKAN = JSON.stringify({
    result: {
      resources: [
        { format: 'JSON', url: 'https://ejemplo.uy/a.json' },
        { format: 'CSV', url: 'https://ejemplo.uy/b.csv' },
        { format: 'XML', url: 'https://ejemplo.uy/c.xml' },
      ],
    },
  });

  it('encuentra el recurso por formato, sin distinguir mayúsculas', () => {
    expect(extraerUrlDeRecurso(JSON_CKAN, 'CSV')).toBe('https://ejemplo.uy/b.csv');
    expect(extraerUrlDeRecurso(JSON_CKAN, 'csv')).toBe('https://ejemplo.uy/b.csv');
  });

  it('devuelve null si el formato no está', () => {
    expect(extraerUrlDeRecurso(JSON_CKAN, 'PDF')).toBeNull();
  });

  it('devuelve null ante JSON inválido o con otra forma', () => {
    expect(extraerUrlDeRecurso('esto no es json', 'CSV')).toBeNull();
    expect(extraerUrlDeRecurso('{"otracosa": 1}', 'CSV')).toBeNull();
  });
});

describe('armarBloqueDatoReal', () => {
  it('arma una lista de un elemento con las claves en orden, lista para pegar', () => {
    const bloque = armarBloqueDatoReal({
      url: 'https://ejemplo.uy/x',
      medio: 'bcu',
      fecha: '2022-03-25',
      tipo: 'documento_oficial',
      titulo: 'Tipo de cambio',
      cita: 'URUGUAY DLS.PROMED.FONDO 2230 UYU 41.478',
      retrieved_at: '2026-09-10',
    });
    expect(bloque).toContain('- url: https://ejemplo.uy/x');
    expect(bloque).toContain('  medio: bcu');
    expect(bloque).toContain('  fecha: 2022-03-25');
    expect(bloque).toContain('  tipo: documento_oficial');
    expect(bloque).toContain('  titulo: Tipo de cambio');
    expect(bloque).toContain('  retrieved_at: 2026-09-10');
    // El orden importa para que sea un copiar-y-pegar directo: url antes que medio, etc.
    expect(bloque.indexOf('url:')).toBeLessThan(bloque.indexOf('medio:'));
    expect(bloque.indexOf('medio:')).toBeLessThan(bloque.indexOf('fecha:'));
    expect(() => parseYaml(bloque)).not.toThrow();
  });
});

describe('series.yaml real del repo', () => {
  it('carga y valida sin lanzar, con al menos las series del ítem 3.2', () => {
    const ruta = join(RAIZ, 'docs', 'fuentes-oficiales', 'series.yaml');
    const series = parsearSeries(readFileSync(ruta, 'utf8'));
    const ids = series.map((s) => s.id);
    expect(ids).toContain('bcu-tipo-cambio-interbancario');
    expect(ids).toContain('ine-ipc');
    expect(ids.some((id) => id.includes('desempleo'))).toBe(true);
    expect(ids.some((id) => id.includes('ursea'))).toBe(true);
    expect(ids.some((id) => id.includes('anp-brasil'))).toBe(true);
    expect(ids.some((id) => id.includes('dgi'))).toBe(true);
    expect(ids.some((id) => id.includes('catalogodatos'))).toBe(true);
    // Regla 0: el registro de series no nombra a ningún político ni partido.
    const crudo = readFileSync(ruta, 'utf8').toLowerCase();
    for (const nombre of ['lacalle', 'orsi', 'mujica', 'frente amplio', 'partido nacional', 'partido colorado']) {
      expect(crudo).not.toContain(nombre);
    }
  });
});
