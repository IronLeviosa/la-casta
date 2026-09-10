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
import { fijar, fusionar, fusionesPendientes, objeciones, parsearRutaCampo, resumen, resumirRegistro, ver } from '../scripts/lote.ts';
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
