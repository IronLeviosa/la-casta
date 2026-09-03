/**
 * `pnpm exec tsx tests/fixtures/sellar.ts`
 *
 * Recalcula los hashes de la fixture `ok/` con el mismo código que usa el
 * proyecto, para que el fixture no dependa de valores copiados a mano:
 *
 *   - `procedencia.brief_sha` = SHA-256 de `data/corridas/<id>/brief.md`
 *   - `procedencia.agente_sha` = el hash que declara `agentes.json`
 *   - `data/aprobaciones.json` = hash canónico de los registros con compuerta
 *
 * Es idempotente: si nada cambió, no reescribe nada. Hay que correrlo después
 * de editar `brief.md` o cualquier registro con aprobación.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { escribirAprobaciones, hashCanonico, type Aprobacion } from '../../scripts/lib/aprobaciones.ts';
import { leerRegistroCrudo } from '../../scripts/lib/contenido.ts';
import { hashDeArchivo } from '../../scripts/lib/corridas.ts';
import { sha256 } from '../../scripts/lib/hash.ts';
import { listarArchivos } from '../../scripts/validadores/esquema.ts';

export const CORRIDA = '2020-05-01-lacalle-pou-economia-impuestos';
/** Hash sintético del archivo de instrucciones del agente en la corrida del fixture. */
export const AGENTE_SHA = sha256('investigador-fixture');

/** Registros del fixture que pasan por la compuerta humana. */
const CON_APROBACION: { coleccion: string; id: string; archivo: string }[] = [
  { coleccion: 'casos', id: 'caso-de-prueba', archivo: 'content/casos/caso-de-prueba.yaml' },
];

export function sellar(dirFixture: string): { cambios: string[] } {
  const cambios: string[] = [];
  const escribirSiCambia = (rel: string, texto: string): void => {
    const ruta = path.join(dirFixture, ...rel.split('/'));
    let previo = '';
    try {
      previo = readFileSync(ruta, 'utf8');
    } catch {
      previo = '';
    }
    if (previo !== texto) {
      writeFileSync(ruta, texto, 'utf8');
      cambios.push(rel);
    }
  };

  const briefSha = hashDeArchivo(path.join(dirFixture, 'data', 'corridas', CORRIDA, 'brief.md'));

  // agentes.json de la corrida.
  const agentes = {
    commit: null,
    generado: '2020-05-01T12:00:00.000Z',
    archivos: { 'CLAUDE.md': sha256('claude-md-fixture'), '.claude/agents/investigador.md': AGENTE_SHA },
    agentes: { investigador: { archivo: '.claude/agents/investigador.md', sha256: AGENTE_SHA, modelo: 'modelo-de-prueba' } },
  };
  escribirSiCambia(`data/corridas/${CORRIDA}/agentes.json`, JSON.stringify(agentes, null, 2) + '\n');

  // Hashes de procedencia en todos los YAML de content/.
  for (const ruta of listarArchivos(path.join(dirFixture, 'content'), 'yaml')) {
    const texto = readFileSync(ruta, 'utf8');
    const nuevo = texto
      .replace(/(agente_sha: )(?:AGENTE_SHA|[a-f0-9]{64})/g, `$1${AGENTE_SHA}`)
      .replace(/(brief_sha: )(?:BRIEF_SHA|[a-f0-9]{64})/g, `$1${briefSha}`);
    if (nuevo !== texto) {
      writeFileSync(ruta, nuevo, 'utf8');
      cambios.push(path.relative(dirFixture, ruta));
    }
  }

  // Aprobaciones: el hash tiene que salir del mismo canonicalizador que usa pnpm aprobar.
  const aprobaciones: Aprobacion[] = CON_APROBACION.map(({ coleccion, id, archivo }) => ({
    id,
    coleccion,
    hash: hashCanonico(leerRegistroCrudo(path.join(dirFixture, ...archivo.split('/')))),
    por: 'Fixture',
    fecha: '2020-05-02',
  }));
  const rutaAprobaciones = path.join(dirFixture, 'data', 'aprobaciones.json');
  const textoAprobaciones = JSON.stringify(aprobaciones, null, 2) + '\n';
  let previoAprobaciones = '';
  try {
    previoAprobaciones = readFileSync(rutaAprobaciones, 'utf8');
  } catch {
    previoAprobaciones = '';
  }
  if (previoAprobaciones !== textoAprobaciones) {
    escribirAprobaciones(rutaAprobaciones, aprobaciones);
    cambios.push('data/aprobaciones.json');
  }

  return { cambios };
}

const esEntrada = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (esEntrada) {
  const dir = path.resolve(process.argv[2] ?? path.join(path.dirname(fileURLToPath(import.meta.url)), 'ok'));
  const { cambios } = sellar(dir);
  console.log(cambios.length ? `Sellado ${dir}:\n  ${cambios.join('\n  ')}` : `Sin cambios en ${dir}.`);
}
