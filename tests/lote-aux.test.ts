/**
 * `<lote>/_aux/`: la carpeta de archivos auxiliares de una corrida (docs/plan-herramientas-lote.md,
 * punto 6). El borrador de un valor para `pnpm lote fijar --desde-archivo`, un extracto, una lista de
 * URLs: nada de eso es un registro, no tiene que validarse, no tiene que promoverse ni quedar
 * suelto en la carpeta del lote. Este archivo comprueba que `validar --inbox`, `promover` y los
 * comandos de `pnpm lote` la ignoran, aunque adentro haya YAML con nombre de colección.
 */
import { existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { stringify as stringifyYaml } from 'yaml';
import { afterAll, describe, expect, it } from 'vitest';
import { asegurarCrudo, cargarInbox, leerArchivosInbox } from '../scripts/lib/inbox.ts';
import { git } from '../scripts/lib/git.ts';
import { listar } from '../scripts/lote.ts';
import { promover } from '../scripts/promover.ts';

const temporales: string[] = [];
afterAll(() => {
  for (const d of temporales.splice(0)) rmSync(d, { recursive: true, force: true });
});

function declaracionValida(slug: string): Record<string, unknown> {
  return {
    _slug: slug,
    _investigacion: { script: 'generar-suplentes.ts' },
    politico: 'testpol',
    tema: 'economia/impuestos',
    fecha: '2020-01-01',
    contexto: 'gobierno',
    cargo_en_ese_momento: 'Presidente de la República',
    cita: 'Cita de prueba de más de veinte caracteres para pasar la validación del esquema.',
    resumen: 'Registro de prueba para la carpeta _aux.',
    evidencia: {
      nivel: 'textual',
      fuentes: [
        {
          url: 'https://ejemplo.uy/prueba',
          medio: 'el-pais',
          fecha: '2020-01-01',
          tipo: 'documento_oficial',
          titulo: 'Documento de prueba',
          cita: 'Cita de prueba de más de veinte caracteres para pasar la validación del esquema.',
          retrieved_at: '2020-01-01',
        },
      ],
    },
    revision: { tier: 'publicado' },
  };
}

/**
 * Un lote con un registro válido y una `_aux/` llena de trampas: un `declaraciones.yaml` roto (si
 * alguien lo leyera como colección, el lote dejaría de validar), un YAML que no es colección, un
 * `.md` y un `.jsonl` (los dos tipos que `asegurarCrudo` copia a `crudo/` cuando están sueltos) y una
 * subcarpeta.
 */
function loteConAux(): string {
  const dir = mkdtempSync(path.join(tmpdir(), 'la-casta-aux-'));
  temporales.push(dir);
  writeFileSync(path.join(dir, 'declaraciones.yaml'), stringifyYaml([declaracionValida('con-aux')]), 'utf8');
  writeFileSync(path.join(dir, 'consultas.jsonl'), '', 'utf8');
  const aux = path.join(dir, '_aux');
  mkdirSync(path.join(aux, 'anidada'), { recursive: true });
  writeFileSync(path.join(aux, 'declaraciones.yaml'), 'esto: [no es, una lista de registros\n', 'utf8');
  writeFileSync(path.join(aux, 'borrador-grupo.yaml'), '- grupo: grupo-a\n  desde: 1991\n', 'utf8');
  writeFileSync(path.join(aux, 'notas.md'), '## seccion\ntexto\n', 'utf8');
  writeFileSync(path.join(aux, 'consultas.jsonl'), '{"t":"x"}\n', 'utf8');
  writeFileSync(path.join(aux, 'anidada', 'chequeos.yaml'), '- {}\n', 'utf8');
  return dir;
}

describe('<lote>/_aux/ queda fuera de todo', () => {
  it('leerArchivosInbox (validar --inbox y promover) no la lee, ni siquiera un declaraciones.yaml roto adentro', () => {
    const dir = loteConAux();
    const archivos = leerArchivosInbox(dir);
    expect(archivos.map((a) => a.nombre)).toEqual(['declaraciones.yaml']);
    expect(archivos[0]!.items).toHaveLength(1);
  });

  it('cargarInbox (el núcleo de validar --inbox) no da errores por lo que hay en _aux/', () => {
    const dir = loteConAux();
    const r = cargarInbox(dir, dir);
    expect(r.errores).toEqual([]);
    expect(r.registros).toHaveLength(1);
    expect(r.archivos).toBe(1);
  });

  it('asegurarCrudo no copia nada de _aux/ al crudo de la corrida', () => {
    const dir = loteConAux();
    const corridaDir = mkdtempSync(path.join(tmpdir(), 'la-casta-aux-corrida-'));
    temporales.push(corridaDir);
    const copiados = asegurarCrudo(dir, corridaDir);
    expect(copiados.sort()).toEqual(['consultas.jsonl', 'declaraciones.yaml']);
    expect(existsSync(path.join(corridaDir, 'crudo', '_aux'))).toBe(false);
    expect(readdirSync(path.join(corridaDir, 'crudo')).sort()).toEqual(['consultas.jsonl', 'declaraciones.yaml']);
  });

  it('pnpm lote listar no la cuenta como colección', () => {
    const dir = loteConAux();
    const salida = listar(dir);
    expect(salida).toContain('== declaraciones.yaml: 1 registro(s)');
    expect(salida).not.toContain('borrador-grupo');
    expect(salida).not.toContain('chequeos.yaml');
  });

  it('promover promueve el registro y no congela ni copia nada de _aux/', () => {
    const corridaId = '2020-08-01-testpol-aux';
    const raiz = mkdtempSync(path.join(tmpdir(), 'la-casta-aux-raiz-'));
    temporales.push(raiz);
    mkdirSync(path.join(raiz, 'data', 'corridas', corridaId), { recursive: true });
    writeFileSync(path.join(raiz, 'data', 'corridas', corridaId, 'brief.md'), '# brief de prueba\n', 'utf8');
    mkdirSync(path.join(raiz, 'scripts'), { recursive: true });
    writeFileSync(path.join(raiz, 'scripts', 'generar-suplentes.ts'), '// script de fixture\n', 'utf8');
    mkdirSync(path.join(raiz, 'content'), { recursive: true });
    git(['init', '-q'], raiz);
    git(['config', 'user.email', 'test@example.com'], raiz);
    git(['config', 'user.name', 'Test'], raiz);
    git(['add', '-A'], raiz);
    git(['commit', '-q', '-m', 'inicial'], raiz);

    const inboxDir = loteConAux();
    const p = promover(inboxDir, { rootDir: raiz, corrida: corridaId });

    expect(p.errores).toEqual([]);
    expect(p.promovidos).toHaveLength(1);
    const crudo = path.join(raiz, 'data', 'corridas', corridaId, 'crudo');
    expect(readdirSync(crudo).sort()).toEqual(['consultas.jsonl', 'declaraciones.yaml']);
    // Ningún archivo de _aux/ llegó a la carpeta de la corrida, ni a content/.
    const corridaDir = path.join(raiz, 'data', 'corridas', corridaId);
    expect(readdirSync(corridaDir).some((n) => n.includes('aux'))).toBe(false);
    expect(readdirSync(path.join(raiz, 'content'), { recursive: true }).some((n) => String(n).includes('borrador-grupo'))).toBe(false);
  });
});
