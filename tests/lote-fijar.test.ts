/**
 * `pnpm lote fijar`: las tres vías para el valor (`--valor`, `--valor-json`, `--desde-archivo`) y los
 * interruptores del CLI (docs/plan-herramientas-lote.md, puntos 1 y 2; corrida de El Observador,
 * 2026-10-29).
 *
 *  - `--desde-archivo` guardaba el archivo como texto: un `grupo_historial` (lista de objetos)
 *    escrito en un auxiliar quedó como una cadena con saltos de línea.
 *  - `--valor` se rompe en Windows con comillas curvas y paréntesis (el argumento pasa por cmd.exe):
 *    `--valor-json` lleva esos caracteres como escapes `\uXXXX`.
 */
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { parse as parseYaml } from 'yaml';
import { avisoDeModo, fijar, INTERRUPTORES_LOTE } from '../scripts/lote.ts';
import { interruptorActivo, parsearArgs } from '../scripts/lib/log.ts';
import { DIR_TESTS } from './ayuda.ts';

/** Una barra invertida: los escapes JSON de abajo se arman con ella para que en el archivo se lean como ASCII y no como el carácter. */
const BS = String.fromCharCode(92);

const temporales: string[] = [];
function dirTemp(): string {
  const d = mkdtempSync(path.join(tmpdir(), 'la-casta-lote-fijar-'));
  temporales.push(d);
  return d;
}
afterEach(() => {
  for (const d of temporales.splice(0)) rmSync(d, { recursive: true, force: true });
});

const MEDIOS_YAML = `- nombre: El Observador
  propiedad: Sin dato
  grupo_historial: null
- nombre: Otro medio
  propiedad: Otra
`;

function loteConMedios(): string {
  const dir = dirTemp();
  writeFileSync(path.join(dir, 'medios.yaml'), MEDIOS_YAML, 'utf8');
  return dir;
}

function relectura(dir: string): any[] {
  return parseYaml(readFileSync(path.join(dir, 'medios.yaml'), 'utf8')) as any[];
}

const GRUPO_HISTORIAL_YAML = `- grupo: grupo-a
  desde: 1991
  hasta: 2008
  fuente: https://ejemplo.uy/a
- grupo: grupo-b
  desde: 2008
  fuente: https://ejemplo.uy/b
`;

describe('fijar --desde-archivo: un archivo YAML de lista o mapeo se asigna parseado', () => {
  it('una lista de objetos (el grupo_historial de El Observador) queda como lista, no como cadena', () => {
    const dir = loteConMedios();
    const origen = path.join(dir, '_grupo.yaml');
    writeFileSync(origen, GRUPO_HISTORIAL_YAML, 'utf8');

    const r = fijar(dir, 'medios', 0, 'grupo_historial', { desdeArchivo: origen });

    expect(r.modo).toBe('archivo-yaml');
    expect(Array.isArray(r.despues)).toBe(true);
    expect(relectura(dir)[0].grupo_historial).toEqual([
      { grupo: 'grupo-a', desde: 1991, hasta: 2008, fuente: 'https://ejemplo.uy/a' },
      { grupo: 'grupo-b', desde: 2008, fuente: 'https://ejemplo.uy/b' },
    ]);
    // El resto del archivo no se toca.
    expect(relectura(dir)[1]).toEqual({ nombre: 'Otro medio', propiedad: 'Otra' });
  });

  it('un mapeo queda como mapeo', () => {
    const dir = loteConMedios();
    const origen = path.join(dir, '_dato.yaml');
    writeFileSync(origen, 'valor: 12\nfuente: https://ejemplo.uy/x\n', 'utf8');
    const r = fijar(dir, 'medios', 1, 'dato', { desdeArchivo: origen });
    expect(r.modo).toBe('archivo-yaml');
    expect(relectura(dir)[1].dato).toEqual({ valor: 12, fuente: 'https://ejemplo.uy/x' });
  });

  it('un escalar (texto de varias líneas, sin forma de mapeo) se guarda tal cual, con sus saltos de línea', () => {
    const dir = loteConMedios();
    const origen = path.join(dir, '_texto.txt');
    const parrafos = 'Primer párrafo, largo y sin dos puntos.\n\nSegundo párrafo, que sigue después de una línea en blanco.';
    writeFileSync(origen, `${parrafos}\n`, 'utf8');
    const r = fijar(dir, 'medios', 0, 'propiedad', { desdeArchivo: origen });
    expect(r.modo).toBe('archivo-texto');
    expect(r.despues).toBe(parrafos);
    expect(relectura(dir)[0].propiedad).toBe(parrafos);
  });

  it('un número suelto en el archivo es texto, no un número', () => {
    const dir = loteConMedios();
    const origen = path.join(dir, '_n.txt');
    writeFileSync(origen, '2008\n', 'utf8');
    const r = fijar(dir, 'medios', 0, 'propiedad', { desdeArchivo: origen });
    expect(r.modo).toBe('archivo-texto');
    expect(r.despues).toBe('2008');
  });

  it('un archivo que no es YAML válido se guarda como texto', () => {
    const dir = loteConMedios();
    const origen = path.join(dir, '_roto.txt');
    writeFileSync(origen, '[abre y no cierra: {\n', 'utf8');
    const r = fijar(dir, 'medios', 0, 'propiedad', { desdeArchivo: origen });
    expect(r.modo).toBe('archivo-texto');
    expect(r.despues).toBe('[abre y no cierra: {');
  });

  it('--texto guarda el archivo como texto literal aunque parsee como YAML', () => {
    const dir = loteConMedios();
    const origen = path.join(dir, '_grupo.yaml');
    writeFileSync(origen, GRUPO_HISTORIAL_YAML, 'utf8');
    const r = fijar(dir, 'medios', 0, 'nota', { desdeArchivo: origen, texto: true });
    expect(r.modo).toBe('archivo-texto');
    expect(r.despues).toBe(GRUPO_HISTORIAL_YAML.replace(/\n$/, ''));
    expect(typeof relectura(dir)[0].nota).toBe('string');
  });

  it('un párrafo que empieza con «Nota: …» es un mapeo para YAML: sin --texto queda como mapeo y el aviso lo dice; con --texto, texto', () => {
    const dir = loteConMedios();
    const origen = path.join(dir, '_parrafo.txt');
    writeFileSync(origen, 'Nota: la propiedad cambió en 2008.\n', 'utf8');

    const sinTexto = fijar(dir, 'medios', 0, 'propiedad', { desdeArchivo: origen });
    expect(sinTexto.modo).toBe('archivo-yaml');
    expect(sinTexto.despues).toEqual({ Nota: 'la propiedad cambió en 2008.' });
    const aviso = avisoDeModo(sinTexto.modo, sinTexto.antes, sinTexto.despues);
    expect(aviso).toContain('interpretado como YAML (mapeo de 1 clave(s))');
    expect(aviso).toContain('El campo era texto');
    expect(aviso).toContain('--texto');

    const conTexto = fijar(dir, 'medios', 0, 'propiedad', { desdeArchivo: origen, texto: true });
    expect(conTexto.despues).toBe('Nota: la propiedad cambió en 2008.');
  });

  it('avisoDeModo calla en los demás modos', () => {
    expect(avisoDeModo('valor', 'a', 'b')).toBe('');
    expect(avisoDeModo('valor-json', 'a', 'b')).toBe('');
    expect(avisoDeModo('archivo-texto', 'a', 'b')).toBe('');
    expect(avisoDeModo('archivo-yaml', undefined, [1, 2])).toBe('interpretado como YAML (lista de 2); con --texto el archivo se guarda como texto literal.');
  });
});

describe('fijar --valor-json: JSON en una línea, a prueba de shell', () => {
  it('una cadena con comillas curvas y paréntesis llega intacta', () => {
    const dir = loteConMedios();
    const texto = 'Lo llamó «un error» (según la nota) y “no hay vuelta atrás”';
    const r = fijar(dir, 'medios', 0, 'propiedad', { valorJson: JSON.stringify(texto) });
    expect(r.modo).toBe('valor-json');
    expect(relectura(dir)[0].propiedad).toBe(texto);
  });

  it('los escapes \\uXXXX (ASCII puro, lo que sobrevive a cmd.exe) producen los mismos caracteres', () => {
    const dir = loteConMedios();
    // Se arma con el escape escrito, no con el carácter: es lo que viaja por el shell.
    const json = `"${BS}u00abHola${BS}u00bb ${BS}u0028mundo${BS}u0029 ${BS}u201cdicho${BS}u201d"`;
    expect(json).toMatch(/^[\x20-\x7e]+$/);
    fijar(dir, 'medios', 0, 'propiedad', { valorJson: json });
    expect(relectura(dir)[0].propiedad).toBe('«Hola» (mundo) “dicho”');
  });

  it('un objeto o una lista JSON se asignan con su forma', () => {
    const dir = loteConMedios();
    const valor = [{ grupo: 'grupo-a', desde: 1991 }];
    fijar(dir, 'medios', 0, 'grupo_historial', { valorJson: JSON.stringify(valor) });
    expect(relectura(dir)[0].grupo_historial).toEqual(valor);
  });

  it('un JSON roto falla y manda a --desde-archivo', () => {
    const dir = loteConMedios();
    expect(() => fijar(dir, 'medios', 0, 'propiedad', { valorJson: '{no es json' })).toThrow(/--valor-json no es JSON válido.*--desde-archivo/);
  });
});

describe('fijar: una sola vía por llamada', () => {
  it('sin ninguna, pide una de las tres', () => {
    const dir = loteConMedios();
    expect(() => fijar(dir, 'medios', 0, 'propiedad', {})).toThrow(/Falta el valor.*--valor-json.*--desde-archivo/);
  });

  it('dos a la vez es error, no gana una en silencio', () => {
    const dir = loteConMedios();
    expect(() => fijar(dir, 'medios', 0, 'propiedad', { valor: 'a', valorJson: '"b"' })).toThrow(/una sola/);
  });

  it('--texto sin --desde-archivo es error', () => {
    const dir = loteConMedios();
    expect(() => fijar(dir, 'medios', 0, 'propiedad', { valor: 'a', texto: true })).toThrow(/--texto solo va con --desde-archivo/);
  });
});

describe('interruptores del CLI de lote: no se tragan el argumento que sigue', () => {
  it('parsearArgs sin la lista se traga el argumento (el defecto), con la lista no', () => {
    const argv = ['objeciones', 'critica.md', '--prosa', 'declaraciones[0]'];
    expect(parsearArgs(argv).opciones.prosa).toBe('declaraciones[0]');
    expect(parsearArgs(argv).posicionales).toEqual(['objeciones', 'critica.md']);

    const bien = parsearArgs(argv, { booleanas: INTERRUPTORES_LOTE });
    expect(bien.opciones.prosa).toBe(true);
    expect(bien.posicionales).toEqual(['objeciones', 'critica.md', 'declaraciones[0]']);
  });

  it('--texto antes de la ruta del lote no se come la ruta', () => {
    const { posicionales, opciones } = parsearArgs(['fijar', '--texto', 'inbox/x', 'medios', '0', 'nota', '--desde-archivo', 'a.txt'], { booleanas: INTERRUPTORES_LOTE });
    expect(opciones.texto).toBe(true);
    expect(posicionales).toEqual(['fijar', 'inbox/x', 'medios', '0', 'nota']);
    expect(opciones['desde-archivo']).toBe('a.txt');
  });

  it('un valor inline apaga el interruptor: --texto=false', () => {
    const { opciones } = parsearArgs(['--texto=false'], { booleanas: INTERRUPTORES_LOTE });
    expect(interruptorActivo(opciones.texto)).toBe(false);
    expect(interruptorActivo(true)).toBe(true);
    expect(interruptorActivo(undefined)).toBe(false);
    expect(interruptorActivo('0')).toBe(false);
    expect(interruptorActivo('si')).toBe(true);
  });
});

describe('el CLI real (pnpm lote fijar)', () => {
  const RAIZ = path.resolve(DIR_TESTS, '..');

  function correrLote(args: string[]): { codigo: number | null; stdout: string; stderr: string } {
    const r = spawnSync(process.execPath, ['--import', 'tsx', path.join('scripts', 'lote.ts'), ...args], { cwd: RAIZ, encoding: 'utf8' });
    if (r.error) throw r.error;
    return { codigo: r.status, stdout: r.stdout, stderr: r.stderr };
  }

  it('--valor-json con escapes y --desde-archivo con una lista, por la línea de comandos', () => {
    const dir = loteConMedios();
    const j = correrLote(['fijar', dir, 'medios', '0', 'propiedad', '--valor-json', `"${BS}u00abEl Observador${BS}u00bb ${BS}u0028desde 1991${BS}u0029"`]);
    expect(j.codigo, j.stderr).toBe(0);
    expect(relectura(dir)[0].propiedad).toBe('«El Observador» (desde 1991)');

    const origen = path.join(dir, '_grupo.yaml');
    writeFileSync(origen, GRUPO_HISTORIAL_YAML, 'utf8');
    const a = correrLote(['fijar', dir, 'medios', '0', 'grupo_historial', '--desde-archivo', origen]);
    expect(a.codigo, a.stderr).toBe(0);
    expect(a.stdout).toContain('interpretado como YAML (lista de 2)');
    expect(relectura(dir)[0].grupo_historial).toHaveLength(2);

    // --texto al final, sin nada que seguir: queda como texto.
    const t = correrLote(['fijar', dir, 'medios', '1', 'nota', '--desde-archivo', origen, '--texto']);
    expect(t.codigo, t.stderr).toBe(0);
    expect(typeof relectura(dir)[1].nota).toBe('string');
  }, 60_000);
});
