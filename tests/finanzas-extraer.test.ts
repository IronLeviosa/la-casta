/**
 * Pruebas de las funciones puras de `scripts/finanzas-extraer.ts`: ubicación de renglones sobre
 * texto de balance real (fixtures recortadas del balance 2016 de Correo, ya en el corpus —
 * `tests/fixtures/finanzas-correo-2016-*.txt`), chequeos aritméticos y marca de celdas del modelo.
 * Sin red ni modelo: nada de lo que se prueba acá llama a `obtenerNota` ni a `claude -p`.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  CLAVES_MONTO,
  anioCorregido,
  celdaLiteralEnTexto,
  cierraSumaSegmentos,
  cierraUsd,
  construirPromptFinanzas,
  convertirAMillones,
  detectarUnidadDocumento,
  elegirDocumentoDelAnio,
  extraerJsonHaiku,
  filtrarInventarioPorPalabras,
  indexarLineas,
  inferirAnioDeArchivo,
  parsearNumeroUY,
  ubicarCotizacion,
  ubicarRenglones,
  type EntradaInventario,
} from '../scripts/finanzas-extraer.ts';

const FIXTURES = join(import.meta.dirname, 'fixtures');
const leer = (nombre: string) => readFileSync(join(FIXTURES, nombre), 'utf8');

const ESTADOS_2016 = leer('finanzas-correo-2016-estados.txt');
const COTIZACION_2016 = leer('finanzas-correo-2016-cotizacion.txt');
const TRANSFERENCIAS_2016 = leer('finanzas-correo-2016-transferencias.txt');
const CAPITALIZACIONES_2016 = leer('finanzas-correo-2016-capitalizaciones.txt');

describe('parsearNumeroUY', () => {
  it('miles con punto, sin decimales', () => {
    expect(parsearNumeroUY('5.123.412')).toBe(5123412);
    expect(parsearNumeroUY('666.000.000')).toBe(666000000);
  });
  it('negativo entre paréntesis', () => {
    expect(parsearNumeroUY('(976.373.078)')).toBe(-976373078);
    expect(parsearNumeroUY('(115.920)')).toBe(-115920);
  });
  it('negativo con signo (token crudo, no un valor ya convertido a millones)', () => {
    expect(parsearNumeroUY('-125.866')).toBe(-125866);
  });
  it('decimal con coma (cotización)', () => {
    expect(parsearNumeroUY('21,424')).toBeCloseTo(21.424);
    expect(parsearNumeroUY('29,34')).toBeCloseTo(29.34);
  });
  it('sin separador de miles', () => {
    expect(parsearNumeroUY('125.866')).toBe(125866);
  });
  it('token inválido lanza', () => {
    expect(() => parsearNumeroUY('abc')).toThrow();
  });
});

describe('indexarLineas', () => {
  it('conserva el carácter de inicio y fin de cada línea', () => {
    const texto = 'una\ndos\ntres';
    const lineas = indexarLineas(texto);
    expect(lineas.map((l) => l.texto)).toEqual(['una', 'dos', 'tres']);
    expect(texto.slice(lineas[0].inicio, lineas[0].fin)).toBe('una');
    expect(texto.slice(lineas[1].inicio, lineas[1].fin)).toBe('dos');
    expect(texto.slice(lineas[2].inicio, lineas[2].fin)).toBe('tres');
  });
});

describe('inferirAnioDeArchivo', () => {
  it('nombre con "Contables<año>"', () => {
    expect(inferirAnioDeArchivo('https://correo.com.uy/documents/20182/109433/EstadosContables2016_compilado.pdf/e20156a1')).toBe(2016);
  });
  it('no confunde el id de carpeta del CMS ("20182") con el año del archivo', () => {
    // El bug real de inventario.ts: toma el primer (19|20)\d{2} de TODA la url, que cae en "20182"
    // (id de carpeta) antes de llegar a "2009" (el año real, en el nombre del PDF).
    expect(inferirAnioDeArchivo('https://www.correo.com.uy/documents/20182/109433/EstadosContables2009_compilado.pdf/708e2f83-9abf-4b14-ab4c-38c7c76eef0a')).toBe(2009);
  });
  it('nombre con "al 31 12 <YY>" (año de dos dígitos)', () => {
    expect(
      inferirAnioDeArchivo('https://www.correo.com.uy/documents/20182/109433/ANC+EEFF+al+31+12+19+e+Informe+de+Auditor%C3%ADa+-+Stavros+-+para+publicar.pdf'),
    ).toBe(2019);
  });
  it('nombre con "Financieros" separado del año por otras palabras: cae al patrón genérico', () => {
    expect(inferirAnioDeArchivo('https://www.antel.com.uy/documents/37544/378823/Estados+Financieros+ANTEL+31-12-2024.pdf')).toBe(2024);
  });
  it('sin ningún año reconocible: null', () => {
    expect(inferirAnioDeArchivo('https://correo.com.uy/documents/20182/109433/informe-auditoria.pdf')).toBeNull();
  });
});

describe('ubicarRenglones sobre el balance 2016 de Correo (fixture real del corpus)', () => {
  const candidatos = ubicarRenglones(ESTADOS_2016);

  it('resultado_ejercicio: un solo candidato, no confunde con el subtotal "antes del impuesto a la renta"', () => {
    expect(candidatos.resultado_ejercicio).toHaveLength(1);
    const c = candidatos.resultado_ejercicio[0];
    expect(c.valores[0]).toBe(-837807335); // columna 2016
    expect(c.valores[1]).toBe(-724752975); // columna comparativa 2015
    expect(ESTADOS_2016.includes(c.cita)).toBe(true); // cita literal y contigua
    expect(c.cita).not.toMatch(/antes del impuesto/i);
  });

  it('impuestos_pagados: sin renglón (el balance de 2016 no trae un total de tributos, solo "Impuesto a la renta")', () => {
    expect(candidatos.impuestos_pagados).toHaveLength(0);
  });

  it('deuda_financiera: dos candidatos (corriente y no corriente, en notas separadas) — heurística ambigua a propósito', () => {
    expect(candidatos.deuda_financiera).toHaveLength(2);
    const valores = candidatos.deuda_financiera.map((c) => c.valores[0]).sort((a, b) => a - b);
    expect(valores).toEqual([125866, 53768484]);
  });

  it('transferencias_al_estado: cero explícito con la frase de la nota, sobre la fixture de esa nota', () => {
    const c = ubicarRenglones(TRANSFERENCIAS_2016).transferencias_al_estado;
    expect(c).toHaveLength(1);
    expect(c[0].ceroExplicito).toBe(true);
    expect(c[0].valores).toEqual([0]);
    expect(c[0].cita).toMatch(/no se hicieron transferencias/i);
    expect(TRANSFERENCIAS_2016.includes(c[0].cita)).toBe(true);
  });

  it('capitalizaciones_del_estado: el monto está 4 líneas después del título de la nota, y aun así se ubica', () => {
    const c = ubicarRenglones(CAPITALIZACIONES_2016).capitalizaciones_del_estado;
    expect(c).toHaveLength(1);
    expect(c[0].valores[0]).toBe(666000000);
    expect(c[0].valores[1]).toBe(599625624);
    expect(CAPITALIZACIONES_2016.includes(c[0].cita)).toBe(true);
  });

  it('todas las claves del diccionario están presentes en el resultado, aunque vacías', () => {
    expect(Object.keys(candidatos).sort()).toEqual([...CLAVES_MONTO].sort());
  });
});

describe('ubicarCotizacion', () => {
  it('encuentra la cotización de cierre y no la confunde con otra moneda de la misma tabla', () => {
    const c = ubicarCotizacion(COTIZACION_2016);
    expect(c).toHaveLength(1);
    expect(c[0].valores[0]).toBeCloseTo(29.34);
    expect(c[0].valores[1]).toBeCloseTo(29.948);
    expect(c[0].cita).not.toMatch(/Francos Suizos/i);
  });
});

describe('detectarUnidadDocumento', () => {
  it('sin declaración explícita, asume unidades (pesos tal como se imprimen)', () => {
    expect(detectarUnidadDocumento(ESTADOS_2016)).toBe('unidades');
  });
  it('detecta "expresadas en miles"', () => {
    expect(detectarUnidadDocumento('Las cifras están expresadas en miles de pesos uruguayos.')).toBe('miles');
  });
  it('detecta "expresadas en millones"', () => {
    expect(detectarUnidadDocumento('Cifras expresadas en millones de pesos.')).toBe('millones');
  });
});

describe('convertirAMillones', () => {
  it('unidades → millones, redondeado a un decimal', () => {
    expect(convertirAMillones(-837807335, 'unidades')).toBeCloseTo(-837.8);
    expect(convertirAMillones(666000000, 'unidades')).toBeCloseTo(666.0);
  });
  it('miles → millones', () => {
    expect(convertirAMillones(5123412, 'miles')).toBeCloseTo(5123.4);
  });
  it('millones se queda igual', () => {
    expect(convertirAMillones(123.45, 'millones')).toBeCloseTo(123.5);
  });
});

describe('cierraUsd (tolerancia 0,5 %)', () => {
  it('cierra con el usd real publicado (Correo 2016)', () => {
    // content/empresas/correo.yaml, 2016: pesos -837.8, cotizacion 29.34, usd -28.6.
    expect(cierraUsd(-837.8, 29.34, -28.6)).toBe(true);
  });
  it('no cierra si el desvío supera la tolerancia', () => {
    expect(cierraUsd(-837.8, 29.34, -20)).toBe(false);
  });
  it('un desvío chico dentro de la tolerancia pasa', () => {
    // -837.8 / 29.34 = -28.552...; 0,3 % de desvío contra -28.6.
    expect(cierraUsd(-837.8, 29.34, -28.65)).toBe(true);
  });
});

describe('cierraSumaSegmentos (tolerancia 2 %)', () => {
  it('la suma exacta cierra', () => {
    expect(cierraSumaSegmentos([100, 200, 50], 350)).toBe(true);
  });
  it('un desvío chico (menos del 2 %) pasa', () => {
    expect(cierraSumaSegmentos([100, 200, 50], 353)).toBe(true);
  });
  it('un desvío grande no cierra', () => {
    expect(cierraSumaSegmentos([100, 200, 50], 500)).toBe(false);
  });
});

describe('elegirDocumentoDelAnio', () => {
  const inventario: EntradaInventario[] = [
    { url: 'https://correo.com.uy/EstadosContables2015_compilado.pdf', bytes: 3_000_000, en_sitio_hoy: false, captura: '20200101' },
    { url: 'https://correo.com.uy/EstadosContables2016_compilado.pdf', bytes: 1_000_000, en_sitio_hoy: true, captura: '20210101' },
    { url: 'https://correo.com.uy/ANC_Estados_Contables_2016_1.pdf', bytes: 8_000, en_sitio_hoy: false, captura: '20120101' },
  ];

  it('prefiere el documento del propio año, más completo (compilado) y más grande', () => {
    const elegido = elegirDocumentoDelAnio(inventario, 2016);
    expect(elegido?.comparativo).toBe(false);
    expect(elegido?.doc.url).toBe('https://correo.com.uy/EstadosContables2016_compilado.pdf');
  });

  it('sin documento propio, usa la columna comparativa del año siguiente', () => {
    const elegido = elegirDocumentoDelAnio(inventario, 2014);
    expect(elegido?.comparativo).toBe(true);
    expect(elegido?.doc.url).toBe('https://correo.com.uy/EstadosContables2015_compilado.pdf');
  });

  it('sin nada disponible: null', () => {
    expect(elegirDocumentoDelAnio(inventario, 1999)).toBeNull();
  });

  it('anioCorregido usa el nombre del archivo antes que anio_probable', () => {
    const e: EntradaInventario = { url: 'https://correo.com.uy/documents/20182/109433/EstadosContables2009_compilado.pdf/uuid', anio_probable: 2018 };
    expect(anioCorregido(e)).toBe(2009);
  });
});

describe('filtrarInventarioPorPalabras', () => {
  it('descarta un PDF sin relación aunque haya quedado en un inventario viejo sin --filtro', () => {
    // Caso real: un `.cache/inventarios/<dominio>.jsonl` de una corrida anterior sin --filtro trae
    // TODOS los PDF del sitio; un manual sin relación con Wayback capturándolo un año cualquiera no
    // tiene por qué ganarle a un balance real de ese año (o, como pasó de verdad, quedar como único
    // candidato porque el balance real ni siquiera está en ese inventario viejo).
    const entradas: EntradaInventario[] = [
      { url: 'http://www.correo.com.uy/otrosdocumentos/pdf/sed/Manual_SED.pdf', anio_probable: 2016 },
      { url: 'https://correo.com.uy/documents/20182/109433/EstadosContables2016_compilado.pdf/x', anio_probable: 2018 },
      { url: 'http://www.correo.com.uy/otrosdocumentos/pdf/rse/MEMORIA_SOSTENIBILIDAD_ANC_2013.pdf', anio_probable: 2013 },
    ];
    const filtradas = filtrarInventarioPorPalabras(entradas);
    expect(filtradas.map((e) => e.url)).not.toContain(entradas[0].url);
    expect(filtradas.map((e) => e.url)).toContain(entradas[1].url);
  });
});

describe('extraerJsonHaiku', () => {
  it('parsea un JSON limpio', () => {
    const r = extraerJsonHaiku('{"celdas": [{"renglon": "resultado_ejercicio", "valor": 123, "unidad": "unidades", "cita": "x"}]}');
    expect(r?.celdas).toHaveLength(1);
    expect(r?.celdas[0].renglon).toBe('resultado_ejercicio');
  });
  it('parsea un JSON envuelto en texto y bloque de código', () => {
    const r = extraerJsonHaiku('Acá está:\n```json\n{"celdas": []}\n```\ngracias');
    expect(r?.celdas).toEqual([]);
  });
  it('sin JSON válido devuelve null', () => {
    expect(extraerJsonHaiku('no hay nada acá')).toBeNull();
  });
  it('un objeto sin "celdas" devuelve null', () => {
    expect(extraerJsonHaiku('{"otracosa": 1}')).toBeNull();
  });
});

describe('celdaLiteralEnTexto', () => {
  const texto = 'Resultado del ejercicio (837.807.335) (724.752.975)';
  it('acepta una cita que aparece literal', () => {
    expect(celdaLiteralEnTexto(texto, 'Resultado del ejercicio (837.807.335) (724.752.975)')).toBe(true);
  });
  it('rechaza una cita que no aparece literal (paráfrasis del modelo)', () => {
    expect(celdaLiteralEnTexto(texto, 'el resultado del ejercicio fue de -837,8 millones')).toBe(false);
  });
  it('rechaza una cita demasiado corta', () => {
    expect(celdaLiteralEnTexto(texto, 'x')).toBe(false);
  });
  it('rechaza un valor que no es texto', () => {
    expect(celdaLiteralEnTexto(texto, 12345 as unknown)).toBe(false);
  });
});

describe('construirPromptFinanzas', () => {
  it('incluye el año, los campos pedidos y el texto', () => {
    const prompt = construirPromptFinanzas('texto del balance', 2016, ['impuestos_pagados', 'deuda_financiera']);
    expect(prompt).toContain('2016');
    expect(prompt).toContain('impuestos_pagados');
    expect(prompt).toContain('deuda_financiera');
    expect(prompt).toContain('texto del balance');
  });
  it('recorta un texto muy largo', () => {
    const largo = 'a'.repeat(30_000);
    const prompt = construirPromptFinanzas(largo, 2016, ['resultado_ejercicio']);
    expect(prompt.length).toBeLessThan(largo.length);
    expect(prompt).toContain('recortado');
  });
});
