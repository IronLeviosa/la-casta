/**
 * `scripts/lote.ts`: mirar y editar un registro de un YAML del inbox sin
 * cargar el archivo entero, y resumir una ficha ya publicada (plan-2026-09,
 * fase 1.4).
 */
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';
import {
  agregar,
  agregarANotas,
  fijar,
  fusionarSecciones,
  formatoFijado,
  fusionar,
  fusionesPendientes,
  listar,
  notas,
  objeciones,
  parsearRutaCampo,
  parsearSeccionesNotas,
  resumen,
  resumirRegistro,
  ver,
} from '../scripts/lote.ts';
import { esquemasPorColeccion } from '../src/schemas/comunes';

const temporales: string[] = [];
function dirTemp(): string {
  const d = mkdtempSync(path.join(tmpdir(), 'la-casta-lote-'));
  temporales.push(d);
  return d;
}
afterEach(() => {
  for (const d of temporales.splice(0)) rmSync(d, { recursive: true, force: true });
});

const DECLARACIONES_YAML = `- politico: lacalle-pou
  fecha: 2022-03-27
  resumen: primer registro
  fuentes:
    - {url: 'https://a', medio: subrayado, fecha: 2022-03-27, tipo: nota, cita: x}
- politico: lacalle-pou
  fecha: 2022-04-01
  resumen: segundo registro
`;

describe('pnpm lote ver', () => {
  it('imprime el registro n como YAML', () => {
    const dir = dirTemp();
    writeFileSync(path.join(dir, 'declaraciones.yaml'), DECLARACIONES_YAML, 'utf8');
    const salida = ver(dir, 'declaraciones', 1);
    expect(salida).toContain('segundo registro');
    expect(salida).not.toContain('primer registro');
  });

  it('rechaza un índice fuera de rango con un mensaje claro', () => {
    const dir = dirTemp();
    writeFileSync(path.join(dir, 'declaraciones.yaml'), DECLARACIONES_YAML, 'utf8');
    expect(() => ver(dir, 'declaraciones', 5)).toThrow(/fuera de rango/);
  });

  it('rechaza un YAML que no es una lista de nivel superior', () => {
    const dir = dirTemp();
    writeFileSync(path.join(dir, 'declaraciones.yaml'), 'politico: lacalle-pou\n', 'utf8');
    expect(() => ver(dir, 'declaraciones', 0)).toThrow(/no es una lista/);
  });

  it('--campo imprime solo ese campo, completo', () => {
    const dir = dirTemp();
    writeFileSync(path.join(dir, 'declaraciones.yaml'), DECLARACIONES_YAML, 'utf8');
    const salida = ver(dir, 'declaraciones', 0, { campo: 'fuentes[0].medio' });
    expect(salida.trim()).toBe('subrayado');
  });

  it('--completo imprime todo, sin resumir', () => {
    const dir = dirTemp();
    const yamlConFuentes = `- fuentes:\n${Array.from({ length: 5 }, (_, i) => `    - {url: 'https://a${i}', medio: m${i}, fecha: 2022-01-01, tipo: nota, cita: x}`).join('\n')}\n`;
    writeFileSync(path.join(dir, 'chequeos.yaml'), yamlConFuentes, 'utf8');
    const resumido = ver(dir, 'chequeos', 0);
    expect(resumido).toContain('5 fuentes');
    const completo = ver(dir, 'chequeos', 0, { completo: true });
    expect(completo).not.toContain('5 fuentes:');
    expect(completo).toContain('m0');
  });
});

describe('resumirRegistro: series largas resumidas', () => {
  it('finanzas[] queda en una línea por año, con los campos presentes y su usd, sin fuentes', () => {
    const registro = {
      finanzas: [
        {
          anio: 2024,
          resultado_ejercicio: { pesos: 100, usd: 2.3, cotizacion: 43, fuentes: [{ url: 'x', medio: 'm', fecha: '2024-01-01', tipo: 'documento_oficial', cita: 'c' }] },
          nota: 'una nota',
          segmentos: [{ nombre: 'Móvil' }, { nombre: 'Fijo' }],
        },
      ],
    };
    const r = resumirRegistro(registro) as any;
    expect(r.finanzas).toEqual(['2024: resultado_ejercicio=2.3, segmentos: Móvil, Fijo']);
  });

  it('segmentos[] fuera de finanzas queda como lista de nombres', () => {
    const r = resumirRegistro({ segmentos: [{ nombre: 'A', resultado: {} }, { nombre: 'B' }] }) as any;
    expect(r.segmentos).toEqual(['A', 'B']);
  });

  it('hitos[] queda en fecha · titulo · tipo', () => {
    const r = resumirRegistro({ hitos: [{ fecha: '2020-01-01', titulo: 'Se crea', tipo: 'creacion' }] }) as any;
    expect(r.hitos).toEqual(['2020-01-01 · Se crea · creacion']);
  });

  it('precios_vs_paridad.series[] queda en una sola línea con huecos', () => {
    const r = resumirRegistro({
      precios_vs_paridad: {
        unidad_precio: 'USD por litro',
        series: [
          { anio: 2019, producto: 'nafta' },
          { anio: 2021, producto: 'nafta' },
          { anio: 2019, producto: 'gasoil' },
        ],
      },
    }) as any;
    expect(r.precios_vs_paridad.series).toBe('3 ítems, productos nafta, gasoil, años 2019-2021, huecos: 2020');
  });

  it('fuentes[] de 3 ítems o menos no se resume', () => {
    const fuentes = [1, 2, 3].map((i) => ({ url: `u${i}`, medio: 'm', fecha: '2020-01-01', tipo: 'nota', cita: 'c' }));
    const r = resumirRegistro({ que_hace_fuentes: fuentes }) as any;
    expect(Array.isArray(r.que_hace_fuentes)).toBe(true);
  });

  it('fuentes[] de más de 3 ítems se resume como conteo por medio', () => {
    const fuentes = [1, 2, 3, 4, 5].map((i) => ({ url: `u${i}`, medio: i <= 3 ? 'el-pais' : 'subrayado', fecha: '2020-01-01', tipo: 'nota', cita: 'c' }));
    const r = resumirRegistro({ creacion: { fuentes } }) as any;
    expect(r.creacion.fuentes).toBe('5 fuentes: el-pais ×3, subrayado ×2');
  });
});

describe('pnpm lote fijar', () => {
  it('escribe el campo y devuelve antes/después', () => {
    const dir = dirTemp();
    writeFileSync(path.join(dir, 'declaraciones.yaml'), DECLARACIONES_YAML, 'utf8');
    const r = fijar(dir, 'declaraciones', 0, 'resumen', { valor: 'nuevo resumen' });
    expect(r.antes).toBe('primer registro');
    expect(r.despues).toBe('nuevo resumen');
    const relectura = parseYaml(readFileSync(path.join(dir, 'declaraciones.yaml'), 'utf8'));
    expect(relectura[0].resumen).toBe('nuevo resumen');
    expect(relectura[1].resumen).toBe('segundo registro'); // el resto del archivo no se toca
  });

  it('interpreta --valor como YAML: número, string y lista', () => {
    const dir = dirTemp();
    writeFileSync(path.join(dir, 'declaraciones.yaml'), DECLARACIONES_YAML, 'utf8');
    expect(fijar(dir, 'declaraciones', 0, 'anio', { valor: '2022' }).despues).toBe(2022);
    expect(fijar(dir, 'declaraciones', 0, 'estado', { valor: 'publicado' }).despues).toBe('publicado');
    expect(fijar(dir, 'declaraciones', 0, 'lista', { valor: '[a, b]' }).despues).toEqual(['a', 'b']);
  });

  it('acepta índices de lista con corchetes', () => {
    const dir = dirTemp();
    writeFileSync(path.join(dir, 'declaraciones.yaml'), DECLARACIONES_YAML, 'utf8');
    const r = fijar(dir, 'declaraciones', 0, 'fuentes[0].medio', { valor: 'el-pais' });
    expect(r.antes).toBe('subrayado');
    expect(r.despues).toBe('el-pais');
  });

  it('--desde-archivo toma el valor tal cual, sin interpretarlo como YAML', () => {
    const dir = dirTemp();
    writeFileSync(path.join(dir, 'declaraciones.yaml'), DECLARACIONES_YAML, 'utf8');
    const origen = path.join(dir, 'texto.txt');
    writeFileSync(origen, 'Texto largo: sí, con dos puntos y [corchetes].\n', 'utf8');
    const r = fijar(dir, 'declaraciones', 0, 'resumen', { desdeArchivo: origen });
    expect(r.despues).toBe('Texto largo: sí, con dos puntos y [corchetes].');
  });

  it('avisa (comentariosPerdidos) cuando el archivo original tenía comentarios', () => {
    const dir = dirTemp();
    writeFileSync(path.join(dir, 'declaraciones.yaml'), `# comentario de cabecera\n${DECLARACIONES_YAML}`, 'utf8');
    const r = fijar(dir, 'declaraciones', 0, 'resumen', { valor: 'x' });
    expect(r.comentariosPerdidos).toBe(true);
  });

  it('no marca comentariosPerdidos por un "#" dentro de una URL entre comillas', () => {
    const dir = dirTemp();
    writeFileSync(path.join(dir, 'declaraciones.yaml'), "- url: 'https://example.com/pagina#seccion'\n  resumen: r\n", 'utf8');
    const r = fijar(dir, 'declaraciones', 0, 'resumen', { valor: 'x' });
    expect(r.comentariosPerdidos).toBe(false);
  });

  it('exige --valor o --desde-archivo', () => {
    const dir = dirTemp();
    writeFileSync(path.join(dir, 'declaraciones.yaml'), DECLARACIONES_YAML, 'utf8');
    expect(() => fijar(dir, 'declaraciones', 0, 'resumen', {})).toThrow(/Falta el valor/);
  });
});

describe('formatoFijado (salida por defecto del CLI de fijar)', () => {
  it('imprime el campo antes y después, cada uno en su línea', () => {
    const salida = formatoFijado('declaraciones', 0, 'resumen', 'primer registro', 'nuevo resumen');
    expect(salida).toBe('fijado: declaraciones[0].resumen\n  antes:   primer registro\n  después: nuevo resumen');
  });

  it('(sin valor) cuando "antes" es undefined (campo que no existía)', () => {
    const salida = formatoFijado('declaraciones', 1, 'titulo', undefined, 'Título nuevo');
    expect(salida).toContain('antes:   (sin valor)');
    expect(salida).toContain('después: Título nuevo');
  });

  it('recorta valores largos a ~200 caracteres con «…»', () => {
    const largo = 'x'.repeat(250);
    const salida = formatoFijado('declaraciones', 0, 'resumen', 'y', largo);
    const lineaDespues = salida.split('\n').find((l) => l.includes('después:'))!;
    expect(lineaDespues).toContain('…');
    expect(lineaDespues.length).toBeLessThan(220);
  });

  it('un objeto o lista se muestra en YAML de una sola línea, recortado igual', () => {
    const salida = formatoFijado('declaraciones', 0, 'fuentes[0]', undefined, { url: 'https://a', medio: 'subrayado' });
    expect(salida).toContain('después: { url: https://a, medio: subrayado }');
    expect(salida.split('\n')).toHaveLength(3); // sin el multilínea default de stringifyYaml
  });
});

describe('pnpm lote agregar', () => {
  it('--copia-de agrega una copia profunda, descarta _slug y devuelve el nuevo índice', () => {
    const dir = dirTemp();
    writeFileSync(
      path.join(dir, 'promesas.yaml'),
      `- _slug: no-subir-impuestos\n  politico: lacalle-pou\n  promesa: no subir impuestos\n  evidencias:\n    - anio: 2021\n`,
      'utf8',
    );
    const r = agregar(dir, 'promesas', { copiaDe: 0 });
    expect(r.n).toBe(1);
    expect(r.archivoCreado).toBe(false);
    expect(r.registro._slug).toBeUndefined();
    expect(r.registro.politico).toBe('lacalle-pou');
    expect(r.registro.evidencias).toEqual([{ anio: 2021 }]);
    expect(r.avisoSlug).toMatch(/_slug descartado/);

    const relectura = parseYaml(readFileSync(path.join(dir, 'promesas.yaml'), 'utf8'));
    expect(relectura).toHaveLength(2);
    expect(relectura[0]._slug).toBe('no-subir-impuestos'); // el original no se toca
    expect(relectura[1]._slug).toBeUndefined();

    // Copiar y editar en dos pasos: partir una promesa en sus componentes es copiar y fijar.
    relectura[1].evidencias[0].anio = 2021; // sanity: sigue siendo un objeto independiente del original
  });

  it('no avisa de _slug cuando el registro copiado no tenía', () => {
    const dir = dirTemp();
    writeFileSync(path.join(dir, 'declaraciones.yaml'), DECLARACIONES_YAML, 'utf8');
    const r = agregar(dir, 'declaraciones', { copiaDe: 1 });
    expect(r.avisoSlug).toBeUndefined();
    expect(r.registro.resumen).toBe('segundo registro');
  });

  it('--copia-de con un índice fuera de rango lanza el mismo error que ver/fijar', () => {
    const dir = dirTemp();
    writeFileSync(path.join(dir, 'declaraciones.yaml'), DECLARACIONES_YAML, 'utf8');
    expect(() => agregar(dir, 'declaraciones', { copiaDe: 5 })).toThrow(/fuera de rango/);
  });

  it('--copia-de sin archivo previo falla en vez de crear uno vacío', () => {
    const dir = dirTemp();
    expect(() => agregar(dir, 'declaraciones', { copiaDe: 0 })).toThrow(/no hay ningún registro para copiar/);
  });

  it('--desde-archivo con un mapeo YAML lo agrega tal cual', () => {
    const dir = dirTemp();
    writeFileSync(path.join(dir, 'declaraciones.yaml'), DECLARACIONES_YAML, 'utf8');
    const origen = path.join(dir, '_nuevo.yaml');
    writeFileSync(origen, `politico: mujica\nfecha: 2023-01-01\nresumen: registro nuevo desde archivo\n`, 'utf8');
    const r = agregar(dir, 'declaraciones', { desdeArchivo: origen });
    expect(r.n).toBe(2);
    expect(r.registro.politico).toBe('mujica');
    const relectura = parseYaml(readFileSync(path.join(dir, 'declaraciones.yaml'), 'utf8'));
    expect(relectura[2].resumen).toBe('registro nuevo desde archivo');
  });

  it('--desde-archivo con una lista de un solo elemento toma ese elemento', () => {
    const dir = dirTemp();
    writeFileSync(path.join(dir, 'declaraciones.yaml'), DECLARACIONES_YAML, 'utf8');
    const origen = path.join(dir, '_nuevo.yaml');
    writeFileSync(origen, `- politico: mujica\n  resumen: viene en lista de uno\n`, 'utf8');
    const r = agregar(dir, 'declaraciones', { desdeArchivo: origen });
    expect(r.registro.resumen).toBe('viene en lista de uno');
  });

  it('--desde-archivo con una lista de más de un elemento es un error', () => {
    const dir = dirTemp();
    writeFileSync(path.join(dir, 'declaraciones.yaml'), DECLARACIONES_YAML, 'utf8');
    const origen = path.join(dir, '_nuevo.yaml');
    writeFileSync(origen, `- resumen: uno\n- resumen: dos\n`, 'utf8');
    expect(() => agregar(dir, 'declaraciones', { desdeArchivo: origen })).toThrow(/lista de 2 elemento/);
  });

  it('--desde-archivo con un YAML que no es un mapeo ni una lista de uno es un error', () => {
    const dir = dirTemp();
    writeFileSync(path.join(dir, 'declaraciones.yaml'), DECLARACIONES_YAML, 'utf8');
    const origen = path.join(dir, '_nuevo.yaml');
    writeFileSync(origen, `"solo un texto"\n`, 'utf8');
    expect(() => agregar(dir, 'declaraciones', { desdeArchivo: origen })).toThrow(/no contiene un mapeo/);
  });

  it('--vacio agrega un registro {} para llenar con fijar', () => {
    const dir = dirTemp();
    writeFileSync(path.join(dir, 'declaraciones.yaml'), DECLARACIONES_YAML, 'utf8');
    const r = agregar(dir, 'declaraciones', { vacio: true });
    expect(r.registro).toEqual({});
    expect(r.n).toBe(2);
  });

  it('crea <coleccion>.yaml si no existe, con el registro nuevo como único elemento', () => {
    const dir = dirTemp();
    const r = agregar(dir, 'chequeos', { vacio: true });
    expect(r.archivoCreado).toBe(true);
    expect(r.n).toBe(0);
    const relectura = parseYaml(readFileSync(path.join(dir, 'chequeos.yaml'), 'utf8'));
    expect(relectura).toEqual([{}]);
  });

  it('exige exactamente una fuente: ninguna o más de una es un error', () => {
    const dir = dirTemp();
    writeFileSync(path.join(dir, 'declaraciones.yaml'), DECLARACIONES_YAML, 'utf8');
    expect(() => agregar(dir, 'declaraciones', {})).toThrow(/exactamente una fuente/);
    expect(() => agregar(dir, 'declaraciones', { copiaDe: 0, vacio: true })).toThrow(/exactamente una fuente/);
  });

  it('rechaza una colección desconocida', () => {
    const dir = dirTemp();
    expect(() => agregar(dir, 'no-existe', { vacio: true })).toThrow(/[Cc]olección desconocida/);
  });

  it('rechaza un archivo de colección existente que no es una lista de nivel superior', () => {
    const dir = dirTemp();
    writeFileSync(path.join(dir, 'declaraciones.yaml'), 'politico: lacalle-pou\n', 'utf8');
    expect(() => agregar(dir, 'declaraciones', { vacio: true })).toThrow(/no es una lista/);
  });

  it('corre el mismo chequeo de esquema que fijar, pero como aviso: no bloquea el alta', () => {
    const dir = dirTemp();
    // Un registro vacío no cumple el esquema de declaraciones (le faltan campos obligatorios),
    // pero agregar tiene que escribirlo igual: lo completa fijar después.
    const r = agregar(dir, 'declaraciones', { vacio: true });
    expect(r.validacion.datos).toBeUndefined();
    expect(r.validacion.errores.length).toBeGreaterThan(0);
    const relectura = parseYaml(readFileSync(path.join(dir, 'declaraciones.yaml'), 'utf8'));
    expect(relectura).toEqual([{}]); // se escribió de todos modos
  });

  it('fijar funciona sobre el índice nuevo devuelto por agregar', () => {
    const dir = dirTemp();
    writeFileSync(path.join(dir, 'declaraciones.yaml'), DECLARACIONES_YAML, 'utf8');
    const a = agregar(dir, 'declaraciones', { copiaDe: 0 });
    const f = fijar(dir, 'declaraciones', a.n, 'resumen', { valor: 'completado con fijar' });
    expect(f.despues).toBe('completado con fijar');
    const relectura = parseYaml(readFileSync(path.join(dir, 'declaraciones.yaml'), 'utf8'));
    expect(relectura[a.n].resumen).toBe('completado con fijar');
  });
});

describe('parsearRutaCampo', () => {
  it('separa claves y corchetes', () => {
    expect(parsearRutaCampo('finanzas[3].nota')).toEqual(['finanzas', 3, 'nota']);
    expect(parsearRutaCampo('precios_vs_paridad.series[0].producto')).toEqual(['precios_vs_paridad', 'series', 0, 'producto']);
  });
});

describe('pnpm lote resumen', () => {
  it('empresas: años por campo de finanzas, huecos, segmentos, precios_vs_paridad, hitos y comparaciones', () => {
    const dir = dirTemp();
    const archivo = path.join(dir, 'empresas.yaml');
    writeFileSync(
      archivo,
      `- _slug: acme
  nombre: ACME
  finanzas:
    - {anio: 2019, resultado_ejercicio: {usd: 1}}
    - {anio: 2021, resultado_ejercicio: {usd: 2}, segmentos: [{nombre: A}]}
  precios_vs_paridad:
    series:
      - {anio: 2020, producto: nafta}
  hitos:
    - {fecha: 2000-01-01, titulo: t, tipo: creacion}
  comparaciones:
    - {con: X, indicador: y}
`,
      'utf8',
    );
    const salida = resumen('empresas/acme', { archivo });
    expect(salida).toContain('resultado_ejercicio: 2019, 2021 — huecos: 2020');
    expect(salida).toContain('segmentos: años 2021');
    expect(salida).toContain('precios_vs_paridad[nafta]: años 2020');
    expect(salida).toContain('hitos: 1');
    expect(salida).toContain('comparaciones: 1');
    expect(salida.split('\n').length).toBeLessThan(40);
  });

  it('politicos: un mandato por línea', () => {
    const dir = dirTemp();
    const archivo = path.join(dir, 'politicos.yaml');
    writeFileSync(
      archivo,
      `- _slug: abt-andres
  nombre: Andrés Abt
  mandatos:
    - {cargo: "Representante Nacional por Montevideo", desde: 2020-02-15, hasta: 2020-11-25}
    - {cargo: "Representante Nacional por Montevideo (suplente)", desde: 2021-01-01}
`,
      'utf8',
    );
    const salida = resumen('politicos/abt-andres', { archivo });
    const lineas = salida.split('\n');
    expect(lineas[0]).toContain('Representante Nacional por Montevideo · 2020-02-15 – 2020-11-25');
    expect(lineas[1]).toContain('(en curso)');
  });

  it('cualquier otra colección: claves de primer nivel con su tamaño', () => {
    const dir = dirTemp();
    const archivo = path.join(dir, 'chequeos.yaml');
    writeFileSync(archivo, `- _slug: x\n  afirmacion: una frase\n  evidencia: {fuentes: [1, 2]}\n  calificacion: verdadero\n`, 'utf8');
    const salida = resumen('chequeos/x', { archivo });
    expect(salida).toContain('afirmacion: 9 caracter(es)');
    expect(salida).toContain('evidencia: 1 clave(s)');
    expect(salida).toContain('calificacion: 9 caracter(es)');
  });

  it('rechaza un formato que no sea <coleccion>/<slug>', () => {
    expect(() => resumen('sin-barra')).toThrow(/coleccion.*slug/);
  });

  it('rechaza una colección desconocida', () => {
    expect(() => resumen('no-existe/x')).toThrow(/[Cc]olección desconocida/);
  });
});

// ---------------------------------------------------------------------------
// pnpm lote listar / pnpm lote notas
// ---------------------------------------------------------------------------

const DECLARACIONES_CON_EVIDENCIA = `- _slug: 2022-03-27-algo-importante
  politico: lacalle-pou
  fecha: 2022-03-27
  resumen: dijo algo importante sobre impuestos
  evidencia:
    nivel: textual
    fuentes:
      - {url: 'https://a', medio: subrayado, fecha: 2022-03-27, tipo: nota, cita: 'una cita de veinte caracteres', retrieved_at: 2022-03-28}
  revision: {tier: publicado}
- politico: lacalle-pou
  fecha: 2022-04-01
  resumen: segundo registro sin slug propio, con un resumen bastante mas largo que sesenta caracteres para probar el recorte
  evidencia:
    nivel: reportado
    fuentes:
      - {url: 'https://b', medio: el-pais, fecha: 2022-04-01, tipo: nota, cita: 'otra cita de mas de veinte caracteres', retrieved_at: 2022-04-02}
      - {url: 'https://c', medio: subrayado, fecha: 2022-04-01, tipo: nota, cita: 'una tercera cita de mas de veinte', retrieved_at: 2022-04-02}
  revision: {tier: probable}
`;

const CHEQUEOS_UNO = `- _slug: recaudacion-iva
  politico: lacalle-pou
  fecha: 2021-05-03
  afirmacion: la recaudacion de IVA subio un 10%
  calificacion: verdadero
  evidencia:
    nivel: textual
    fuentes:
      - {url: 'https://d', medio: subrayado, fecha: 2021-05-03, tipo: nota, cita: 'cita textual de mas de veinte caracteres', retrieved_at: 2021-05-04}
  revision: {tier: publicado}
`;

const NOTAS_MD = `# Notas — Test / tema / 2026-09-17

## Resumen del hallazgo

Texto del resumen, con algo de contenido para que no quede vacío.

## cobertura_del_periodo (segunda pasada)

Detalle de la cobertura del período, con varias líneas
de contenido para probar el recorte.

## seccion_larga

${'0123456789'.repeat(6)}
`;

const CONSULTAS_JSONL = [
  { t: '2026-09-17T10:00:00.000Z', tipo: 'busqueda', q: 'lacalle pou iva', resultado: '5 resultados' },
  { t: '2026-09-17T10:01:00.000Z', tipo: 'fuente', q: 'https://a', resultado: 'ok' },
  { t: '2026-09-17T10:02:00.000Z', tipo: 'fuente', q: 'https://b', resultado: 'ok' },
]
  .map((l) => JSON.stringify(l))
  .join('\n');

describe('pnpm lote listar', () => {
  it('una línea por registro, agrupado por colección, con encabezado == <coleccion>.yaml: N registro(s)', () => {
    const dir = dirTemp();
    writeFileSync(path.join(dir, 'declaraciones.yaml'), DECLARACIONES_CON_EVIDENCIA, 'utf8');
    writeFileSync(path.join(dir, 'chequeos.yaml'), CHEQUEOS_UNO, 'utf8');
    writeFileSync(path.join(dir, '_borrador.yaml'), '- politico: nadie\n', 'utf8'); // ignorado: empieza con _

    const salida = listar(dir);

    expect(salida).toContain('== chequeos.yaml: 1 registro(s)');
    expect(salida).toContain('== declaraciones.yaml: 2 registro(s)');
    expect(salida).not.toContain('_borrador');
    expect(salida).toContain('declaraciones[0]  2022-03-27  2022-03-27-algo-importante  textual  1 fuente  publicado');
    // sin _slug: título = resumen recortado a 60 caracteres
    const lineaSinSlug = salida.split('\n').find((l) => l.startsWith('declaraciones[1]'))!;
    expect(lineaSinSlug).toContain('2022-04-01');
    expect(lineaSinSlug).toContain('reportado');
    expect(lineaSinSlug).toContain('2 fuentes');
    expect(lineaSinSlug).toContain('probable');
    const tituloRecortado = lineaSinSlug.split('  ')[2]!;
    expect(tituloRecortado.length).toBeLessThanOrEqual(61); // 60 + «…»
    expect(tituloRecortado.endsWith('…')).toBe(true);
  });

  it('con <coleccion>: solo esa colección', () => {
    const dir = dirTemp();
    writeFileSync(path.join(dir, 'declaraciones.yaml'), DECLARACIONES_CON_EVIDENCIA, 'utf8');
    writeFileSync(path.join(dir, 'chequeos.yaml'), CHEQUEOS_UNO, 'utf8');

    const salida = listar(dir, 'chequeos');

    expect(salida).toContain('== chequeos.yaml: 1 registro(s)');
    expect(salida).toContain('chequeos[0]  2021-05-03  recaudacion-iva  textual  1 fuente  publicado');
    expect(salida).not.toContain('declaraciones.yaml');
  });

  it('agrega el resumen de consultas.jsonl (líneas por tipo) y de notas.md (secciones y largo) si existen', () => {
    const dir = dirTemp();
    writeFileSync(path.join(dir, 'declaraciones.yaml'), DECLARACIONES_CON_EVIDENCIA, 'utf8');
    writeFileSync(path.join(dir, 'consultas.jsonl'), `${CONSULTAS_JSONL}\n`, 'utf8');
    writeFileSync(path.join(dir, 'notas.md'), NOTAS_MD, 'utf8');

    const salida = listar(dir);

    expect(salida).toContain('consultas.jsonl: 3 línea(s) (tipos: busqueda=1, fuente=2)');
    expect(salida).toMatch(/notas\.md: \d+ caracteres, secciones: Resumen del hallazgo \(\d+ chars\), cobertura_del_periodo \(segunda pasada\) \(\d+ chars\), seccion_larga \(\d+ chars\)/);
  });

  it('sin consultas.jsonl ni notas.md, no agrega esas líneas', () => {
    const dir = dirTemp();
    writeFileSync(path.join(dir, 'chequeos.yaml'), CHEQUEOS_UNO, 'utf8');
    const salida = listar(dir);
    expect(salida).not.toContain('consultas.jsonl');
    expect(salida).not.toContain('notas.md');
  });
});

describe('pnpm lote notas', () => {
  it('sin sección: lista los títulos con su largo en caracteres', () => {
    const dir = dirTemp();
    writeFileSync(path.join(dir, 'notas.md'), NOTAS_MD, 'utf8');
    const esperado = parsearSeccionesNotas(NOTAS_MD);

    const salida = notas(dir);
    const lineas = salida.split('\n');

    expect(lineas).toHaveLength(3);
    expect(lineas[0]).toBe(`Resumen del hallazgo (${esperado[0]!.contenido.length} caracteres)`);
    expect(lineas[1]).toBe(`cobertura_del_periodo (segunda pasada) (${esperado[1]!.contenido.length} caracteres)`);
    expect(lineas[2]).toBe(`seccion_larga (${esperado[2]!.contenido.length} caracteres)`);
  });

  it('con sección: imprime la sección completa cuando entra en --maximo (por defecto 4000)', () => {
    const dir = dirTemp();
    writeFileSync(path.join(dir, 'notas.md'), NOTAS_MD, 'utf8');

    const salida = notas(dir, 'cobertura_del_periodo');

    expect(salida).toContain('## cobertura_del_periodo (segunda pasada)');
    expect(salida).toContain('Detalle de la cobertura del período');
    expect(salida).not.toContain('caracteres más');
  });

  it('el nombre de sección ignora mayúsculas y guiones bajos vs espacios', () => {
    const dir = dirTemp();
    writeFileSync(path.join(dir, 'notas.md'), NOTAS_MD, 'utf8');

    expect(notas(dir, 'COBERTURA DEL PERIODO')).toContain('Detalle de la cobertura');
    expect(notas(dir, 'resumen del hallazgo')).toContain('Texto del resumen');
  });

  it('--maximo recorta y avisa cuánto falta; --desde retoma desde ahí', () => {
    const dir = dirTemp();
    writeFileSync(path.join(dir, 'notas.md'), NOTAS_MD, 'utf8');
    const completo = parsearSeccionesNotas(NOTAS_MD).find((s) => s.titulo === 'seccion_larga')!.contenido;

    const primera = notas(dir, 'seccion_larga', { maximo: 20 });
    expect(primera.startsWith(completo.slice(0, 20))).toBe(true);
    expect(primera).toContain(`… (${completo.length - 20} caracteres más; --desde 20 para seguir)`);

    const segunda = notas(dir, 'seccion_larga', { desde: 20, maximo: 20 });
    expect(segunda.startsWith(completo.slice(20, 40))).toBe(true);
  });

  it('sección inexistente: lanza error y lista las disponibles', () => {
    const dir = dirTemp();
    writeFileSync(path.join(dir, 'notas.md'), NOTAS_MD, 'utf8');
    expect(() => notas(dir, 'no-existe')).toThrow(/No se encontró la sección "no-existe"/);
    expect(() => notas(dir, 'no-existe')).toThrow(/Resumen del hallazgo/);
  });

  it('sin notas.md: error claro', () => {
    const dir = dirTemp();
    expect(() => notas(dir)).toThrow(/No existe/);
  });
});

const CRITICA_FORMATO_NUEVO = `# Crítica — corrida test

Lote: inbox/x/

## Resumen
\`\`\`yaml
- registro: declaraciones[0]
  severidad: corregir
  tipo: contexto_omitido
- registro: declaraciones[1]
  severidad: sin_objecion
  tipo: sin_objecion
\`\`\`

## Objeciones por registro

### declaraciones[0] — 2022-03-27 — primeras palabras
- severidad: corregir
- tipo: contexto_omitido
- objecion: falta contexto
- accion_sugerida: agregar el párrafo completo
`;

const CRITICA_FORMATO_VIEJO = `# Crítica — corrida vieja

### declaraciones[0] — algo
- severidad: bloquea
- tipo: riesgo_legal
- objecion: motivo

### chequeos[0] — otra cosa
- severidad: aviso
- tipo: sin_objecion
`;

describe('pnpm lote objeciones', () => {
  it('formato nuevo: lista los registros con objeción, sin los sin_objecion', () => {
    const dir = dirTemp();
    const archivo = path.join(dir, 'critica.md');
    writeFileSync(archivo, CRITICA_FORMATO_NUEVO, 'utf8');
    const salida = objeciones(archivo);
    expect(salida).toContain('declaraciones[0] — corregir (contexto_omitido)');
    expect(salida).not.toContain('declaraciones[1]');
  });

  it('formato nuevo: filtra por el registro pedido', () => {
    const dir = dirTemp();
    const archivo = path.join(dir, 'critica.md');
    writeFileSync(archivo, CRITICA_FORMATO_NUEVO, 'utf8');
    const salida = objeciones(archivo, 'declaraciones[0]');
    expect(salida).toBe('declaraciones[0] — corregir (contexto_omitido)');
  });

  it('formato nuevo con --prosa agrega el bloque de objeción', () => {
    const dir = dirTemp();
    const archivo = path.join(dir, 'critica.md');
    writeFileSync(archivo, CRITICA_FORMATO_NUEVO, 'utf8');
    const salida = objeciones(archivo, 'declaraciones[0]', { prosa: true });
    expect(salida).toContain('falta contexto');
    expect(salida).toContain('accion_sugerida');
  });

  it('formato viejo: avisa que no hay bloque Resumen y lista los ### con su severidad', () => {
    const dir = dirTemp();
    const archivo = path.join(dir, 'critica.md');
    writeFileSync(archivo, CRITICA_FORMATO_VIEJO, 'utf8');
    const salida = objeciones(archivo);
    expect(salida).toContain('formato viejo');
    expect(salida).toContain('declaraciones[0] — algo — severidad: bloquea');
    expect(salida).toContain('chequeos[0] — otra cosa — severidad: aviso');
  });
});

// ---------------------------------------------------------------------------
// pnpm lote fusionar (plan-2026-09, ítem 2.8)
// ---------------------------------------------------------------------------

/** Crea rootDir/content/politicos/<slug>.yaml (una sola ficha, como content/ de verdad). */
function escribirFichaContent(rootDir: string, slug: string, ficha: Record<string, unknown>): void {
  const dir = path.join(rootDir, 'content', 'politicos');
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, `${slug}.yaml`), stringifyYaml(ficha), 'utf8');
}

/** Crea <inboxDir>/politicos.yaml con una lista de fichas (como un inbox/.../fusion real). */
function escribirFichasInbox(inboxDir: string, fichas: Record<string, unknown>[]): void {
  writeFileSync(path.join(inboxDir, 'politicos.yaml'), stringifyYaml(fichas), 'utf8');
}

const FUENTE_A = { url: 'https://parlamento/diputado', medio: 'parlamento', fecha: '2020-02-15', tipo: 'documento_oficial', cita: 'cita de la camara de diputados', retrieved_at: '2026-09-09' };
const FUENTE_SENADO_A = { url: 'https://parlamento/senado-a', medio: 'parlamento', fecha: '2022-03-02', tipo: 'documento_oficial', cita: 'cita del ingreso al senado version a', retrieved_at: '2026-09-09' };
const FUENTE_SENADO_B = { url: 'https://parlamento/senado-b', medio: 'parlamento', fecha: '2022-03-02', tipo: 'documento_oficial', cita: 'cita del ingreso al senado version b', retrieved_at: '2026-09-10' };
const FUENTE_SENADO_NUEVO = { url: 'https://parlamento/senado-nuevo', medio: 'parlamento', fecha: '2025-02-15', tipo: 'documento_oficial', cita: 'cita del nuevo periodo en el senado', retrieved_at: '2026-09-10' };

/** Ficha ya publicada (como si viniera de la corrida de diputados): sale del Senado al fin del período. */
function fichaContentBase() {
  return {
    nombre: 'Ana Test',
    nombre_corto: 'Ana Test',
    partido: 'Partido Test',
    alias: ['Ana Test', 'Test'],
    mandatos: [
      { cargo: 'Representante Nacional por Test', desde: '2020-02-15', hasta: '2022-03-08', fuentes: [FUENTE_A] },
      { cargo: 'Senadora de la República', desde: '2022-03-02', hasta: '2025-02-14', fuentes: [FUENTE_SENADO_A] },
    ],
    estado_actual: {
      situacion: 'fuera_de_cargo',
      salida: { tipo: 'fin_de_mandato', fecha: '2025-02-14', fuentes: [FUENTE_SENADO_A] },
    },
    revision: { tier: 'publicado' },
  };
}

/** Ficha pendiente en el inbox (como si viniera de la corrida de senadores): sigue en el Senado hoy. */
function fichaInboxBase(slug: string) {
  return {
    _slug: slug,
    nombre: 'Ana Test',
    nombre_corto: 'Ana Test',
    partido: 'Partido Test',
    alias: ['Test', 'Ana T.'],
    mandatos: [
      // Mismo mandato que ya está publicado (cargo+desde+hasta iguales), pero con otra fuente: tiene que
      // deduplicarse en uno solo que conserve las dos fuentes.
      { cargo: 'Senadora de la República', desde: '2022-03-02', hasta: '2025-02-14', fuentes: [FUENTE_SENADO_B] },
      // Mandato nuevo: la nueva legislatura, todavía en curso (sin `hasta`).
      { cargo: 'Senadora de la República', desde: '2025-02-15', fuentes: [FUENTE_SENADO_NUEVO] },
    ],
    estado_actual: { situacion: 'en_cargo' },
    revision: { tier: 'publicado' },
  };
}

describe('pnpm lote fusionar', () => {
  it('dedupea mandatos[] por cargo+desde+hasta y conserva las fuentes de las dos fichas', () => {
    const rootDir = dirTemp();
    const inboxDir = dirTemp();
    escribirFichaContent(rootDir, 'ana-test', fichaContentBase());
    escribirFichasInbox(inboxDir, [fichaInboxBase('ana-test')]);

    const r = fusionar('ana-test', 'ana-test', { queda: 'ana-test', fecha: '2026-09-10', inboxDir, rootDir, simulacion: true });

    expect(r.ficha.mandatos).toHaveLength(3); // diputado + senado (deduplicado) + senado nuevo
    const senadoViejo = r.ficha.mandatos.find((m: any) => m.desde === '2022-03-02');
    expect(senadoViejo.hasta).toBe('2025-02-14');
    expect(senadoViejo.fuentes.map((f: any) => f.url).sort()).toEqual(['https://parlamento/senado-a', 'https://parlamento/senado-b']);
    const senadoNuevo = r.ficha.mandatos.find((m: any) => m.desde === '2025-02-15');
    expect(senadoNuevo).toBeTruthy();
    expect(senadoNuevo.hasta).toBeUndefined();
    // Orden cronológico por `desde`.
    expect(r.ficha.mandatos.map((m: any) => m.desde)).toEqual(['2020-02-15', '2022-03-02', '2025-02-15']);
  });

  it('une alias[] sin duplicados, conservando el orden de aparición', () => {
    const rootDir = dirTemp();
    const inboxDir = dirTemp();
    escribirFichaContent(rootDir, 'ana-test', fichaContentBase());
    escribirFichasInbox(inboxDir, [fichaInboxBase('ana-test')]);

    const r = fusionar('ana-test', 'ana-test', { queda: 'ana-test', fecha: '2026-09-10', inboxDir, rootDir, simulacion: true });

    expect(r.ficha.alias).toEqual(['Ana Test', 'Test', 'Ana T.']);
  });

  it('recalcula estado_actual a partir del mandato más reciente y avisa si las dos fichas difieren', () => {
    const rootDir = dirTemp();
    const inboxDir = dirTemp();
    escribirFichaContent(rootDir, 'ana-test', fichaContentBase());
    escribirFichasInbox(inboxDir, [fichaInboxBase('ana-test')]);

    const r = fusionar('ana-test', 'ana-test', { queda: 'ana-test', fecha: '2026-09-10', inboxDir, rootDir, simulacion: true });

    // La ficha publicada decía "fuera_de_cargo" (se le acababa el período); con el mandato del
    // inbox (todavía en curso) la situación real es "en_cargo".
    expect(r.ficha.estado_actual.situacion).toBe('en_cargo');
    expect(r.ficha.estado_actual.salida).toBeUndefined();
    expect(r.avisos.some((a) => a.includes('estado_actual difiere'))).toBe(true);
    // El cambio de situación (no solo de trayectoria) hace que el tipo más honesto sea error_factual.
    expect(r.correccion.tipo).toBe('error_factual');
  });

  it('si las dos fichas coinciden en estado_actual, no hay aviso y el tipo es contexto_omitido', () => {
    const rootDir = dirTemp();
    const inboxDir = dirTemp();
    escribirFichaContent(rootDir, 'ana-test', fichaContentBase());
    const inboxSinCambioDeEstado = fichaInboxBase('ana-test');
    // Sin el mandato en curso: mismo estado_actual que la ficha publicada (fuera_de_cargo).
    inboxSinCambioDeEstado.mandatos = [inboxSinCambioDeEstado.mandatos[0]!];
    inboxSinCambioDeEstado.estado_actual = fichaContentBase().estado_actual;
    escribirFichasInbox(inboxDir, [inboxSinCambioDeEstado]);

    const r = fusionar('ana-test', 'ana-test', { queda: 'ana-test', fecha: '2026-09-10', inboxDir, rootDir, simulacion: true });

    expect(r.avisos.some((a) => a.includes('estado_actual difiere'))).toBe(false);
    expect(r.correccion.tipo).toBe('contexto_omitido');
  });

  it('genera una corrección válida contra src/schemas/correccion.ts', () => {
    const rootDir = dirTemp();
    const inboxDir = dirTemp();
    escribirFichaContent(rootDir, 'ana-test', fichaContentBase());
    escribirFichasInbox(inboxDir, [fichaInboxBase('ana-test')]);

    const r = fusionar('ana-test', 'ana-test', { queda: 'ana-test', fecha: '2026-09-10', inboxDir, rootDir, simulacion: true });

    // `_slug` (fusion-<queda>, para que `pnpm promover --correccion` encuentre este registro sin
    // adivinarlo) no es parte del esquema, igual que en `ficha`: se valida sin él.
    const { _slug: slugCorreccion, ...correccionSinSlug } = r.correccion;
    expect(slugCorreccion).toBe('fusion-ana-test');
    const validacion = esquemasPorColeccion.correcciones.safeParse(correccionSinSlug);
    expect(validacion.success).toBe(true);
    expect(r.correccion.afecta).toEqual(['politicos/ana-test']);
    expect(r.correccion.desenlace).toBe('aceptada');
    expect(r.correccion.reemplaza).toBeUndefined(); // mismo id de los dos lados: no hay nada que reemplazar
    expect(r.comandoPromover).toBe(`pnpm promover inbox/correcciones/2026-09-10 --correccion 2026-09-10-fusion-ana-test`);
    // También la ficha fusionada tiene que validar contra su propio esquema (sin los campos `_`
    // internos: `_slug`, y `_investigacion` que le da procedencia por script sin exigir modelo).
    const { _slug, _investigacion, ...fichaSinSlug } = r.ficha;
    expect(_investigacion).toEqual({ script: 'lote.ts' });
    expect(esquemasPorColeccion.politicos.safeParse(fichaSinSlug).success).toBe(true);
  });

  it('con --simulacion no escribe nada en disco', () => {
    const rootDir = dirTemp();
    const inboxDir = dirTemp();
    escribirFichaContent(rootDir, 'ana-test', fichaContentBase());
    escribirFichasInbox(inboxDir, [fichaInboxBase('ana-test')]);

    const r = fusionar('ana-test', 'ana-test', { queda: 'ana-test', fecha: '2026-09-10', inboxDir, rootDir, simulacion: true });

    expect(r.escrito).toBe(false);
    expect(() => readFileSync(path.join(rootDir, 'inbox', 'correcciones', '2026-09-10', 'correcciones.yaml'), 'utf8')).toThrow();
  });

  it('sin --simulacion escribe (o agrega a) inbox/correcciones/<fecha>/{politicos,correcciones}.yaml', () => {
    const rootDir = dirTemp();
    const inboxDir = dirTemp();
    escribirFichaContent(rootDir, 'ana-test', fichaContentBase());
    escribirFichasInbox(inboxDir, [fichaInboxBase('ana-test')]);

    const r = fusionar('ana-test', 'ana-test', { queda: 'ana-test', fecha: '2026-09-10', inboxDir, rootDir });
    expect(r.escrito).toBe(true);

    const dirCorreccion = path.join(rootDir, 'inbox', 'correcciones', '2026-09-10');
    const fichas = parseYaml(readFileSync(path.join(dirCorreccion, 'politicos.yaml'), 'utf8'));
    const correcciones = parseYaml(readFileSync(path.join(dirCorreccion, 'correcciones.yaml'), 'utf8'));
    expect(fichas).toHaveLength(1);
    expect(fichas[0]._slug).toBe('ana-test');
    expect(correcciones).toHaveLength(1);
    expect(correcciones[0].afecta).toEqual(['politicos/ana-test']);
    expect(correcciones[0]._slug).toBe('fusion-ana-test');

    // Una segunda fusión el mismo día agrega a la lista en vez de pisarla.
    escribirFichaContent(rootDir, 'otra-persona', { ...fichaContentBase(), nombre: 'Otra Persona', nombre_corto: 'Otra Persona' });
    escribirFichasInbox(inboxDir, [{ ...fichaInboxBase('otra-persona') }]);
    fusionar('otra-persona', 'otra-persona', { queda: 'otra-persona', fecha: '2026-09-10', inboxDir, rootDir });
    const fichasLuego = parseYaml(readFileSync(path.join(dirCorreccion, 'politicos.yaml'), 'utf8'));
    expect(fichasLuego).toHaveLength(2);
  });

  it('exige que --queda sea slug-a o slug-b: no se inventa un tercer id', () => {
    const rootDir = dirTemp();
    const inboxDir = dirTemp();
    escribirFichaContent(rootDir, 'ana-test', fichaContentBase());
    escribirFichasInbox(inboxDir, [fichaInboxBase('ana-test')]);

    expect(() => fusionar('ana-test', 'ana-test', { queda: 'un-slug-inventado', inboxDir, rootDir, simulacion: true })).toThrow(/tiene que ser uno de los dos ids/);
  });

  it('avisa si un alias de la ficha fusionada también aparece en una tercera ficha (regla 7)', () => {
    const rootDir = dirTemp();
    const inboxDir = dirTemp();
    escribirFichaContent(rootDir, 'ana-test', fichaContentBase());
    escribirFichaContent(rootDir, 'otra-persona', { ...fichaContentBase(), nombre: 'Otra Persona', nombre_corto: 'Otra Persona', alias: ['Ana T.', 'Otra Persona'] });
    escribirFichasInbox(inboxDir, [fichaInboxBase('ana-test')]); // trae el alias "Ana T." que "otra-persona" también tiene

    const r = fusionar('ana-test', 'ana-test', { queda: 'ana-test', fecha: '2026-09-10', inboxDir, rootDir, simulacion: true });

    expect(r.avisos.some((a) => a.includes('"Ana T."') && a.includes('otra-persona'))).toBe(true);
  });

  it('fusionesPendientes lista las fusiones anotadas en inbox/senadores/fusion e inbox/diputados/fusion', () => {
    const rootDir = dirTemp();
    mkdirSync(path.join(rootDir, 'inbox', 'senadores', 'fusion'), { recursive: true });
    mkdirSync(path.join(rootDir, 'inbox', 'diputados', 'fusion'), { recursive: true });
    escribirFichasInbox(path.join(rootDir, 'inbox', 'senadores', 'fusion'), [fichaInboxBase('persona-uno'), fichaInboxBase('persona-dos')]);
    escribirFichasInbox(path.join(rootDir, 'inbox', 'diputados', 'fusion'), [fichaInboxBase('persona-tres')]);

    const lista = fusionesPendientes(rootDir);

    expect(lista).toHaveLength(3);
    expect(lista.map((f) => f.slug)).toEqual(['persona-uno', 'persona-dos', 'persona-tres']);
    expect(lista[0]!.comando).toBe('pnpm lote fusionar persona-uno persona-uno --queda persona-uno --inbox inbox/senadores/fusion');
  });
});

describe('pnpm lote notas --agregar', () => {
  it('suma un bloque al final del archivo y la lectura lo funde con la sección existente', () => {
    const dir = dirTemp();
    writeFileSync(path.join(dir, 'notas.md'), '# Notas\n\n## verificacion_manual\n\n- primera entrada\n', 'utf8');

    const salida = agregarANotas(dir, 'verificacion_manual', '- segunda entrada, de otro corrector');
    expect(salida).toMatch(/agregados a "## verificacion_manual"/);

    const crudo = readFileSync(path.join(dir, 'notas.md'), 'utf8');
    expect(crudo).toContain('- primera entrada\n\n## verificacion_manual\n\n- segunda entrada, de otro corrector\n');
    expect(crudo.startsWith('# Notas')).toBe(true);

    expect(notas(dir)).toBe(`verificacion_manual (${notas(dir, 'verificacion_manual').length} caracteres)`);
    const seccion = notas(dir, 'verificacion_manual');
    expect(seccion).toContain('- primera entrada');
    expect(seccion).toContain('- segunda entrada, de otro corrector');
    expect(seccion.match(/## verificacion_manual/g)).toHaveLength(1);
  });

  it('crea la sección (y el archivo) si no existían, sin tocar lo demás', () => {
    const dir = dirTemp();
    agregarANotas(dir, 'casos_vistos', 'nada por ahora');
    agregarANotas(dir, 'hipotesis', 'una idea');
    expect(readFileSync(path.join(dir, 'notas.md'), 'utf8')).toBe('## casos_vistos\n\nnada por ahora\n\n## hipotesis\n\nuna idea\n');
    expect(notas(dir).split('\n')).toHaveLength(2);
  });

  it('rechaza texto vacío, sección vacía y texto que trae sus propios encabezados', () => {
    const dir = dirTemp();
    expect(() => agregarANotas(dir, '', 'x')).toThrow(/Falta la sección/);
    expect(() => agregarANotas(dir, 'hipotesis', '   ')).toThrow(/No hay texto/);
    expect(() => agregarANotas(dir, 'hipotesis', '## otra\ncuerpo')).toThrow(/encabezados/);
  });
});

describe('fusionarSecciones', () => {
  it('funde bloques con el mismo título normalizado y conserva el orden de aparición', () => {
    const secciones = parsearSeccionesNotas('## A\n\nuno\n\n## B\n\ndos\n\n## a (continuación)\n\ntres\n');
    const fundidas = fusionarSecciones(secciones);
    expect(fundidas.map((s) => s.titulo)).toEqual(['A', 'B']);
    expect(fundidas[0]!.contenido).toBe('## A\n\nuno\n\ntres');
    expect(fundidas[1]!.contenido).toBe('## B\n\ndos');
  });
});
