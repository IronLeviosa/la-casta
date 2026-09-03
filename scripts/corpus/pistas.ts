/**
 * Pistas cruzadas: al leer una nota sobre A, algo relevante sobre B se anota en
 * ${CORPUS_DIR}/pistas/<b>.yaml para cuando arranque la investigacion de B.
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { hostname } from 'node:os';
import { parse as parseYaml, stringify as aYaml } from 'yaml';
import { asegurarCorpus, RUTAS_CORPUS } from '../lib/rutas.ts';
import { canonicalizar } from '../lib/url.ts';
import { log, parsearArgs } from '../lib/log.ts';

export interface Pista {
  url: string;
  que_vi: string;
  fecha?: string | null;
  tema_probable?: string | null;
  /** Para "re-chequear mas adelante": eventos o fechas que deben despertarla. */
  revisar_cuando?: string[];
  agregada?: string;
  por?: string;
}

function rutaPistas(politico: string): string {
  const slug = politico.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-');
  return join(RUTAS_CORPUS.pistas, `${slug}.yaml`);
}

export function leerPistas(politico: string): Pista[] {
  const ruta = rutaPistas(politico);
  if (!existsSync(ruta)) return [];
  const datos = parseYaml(readFileSync(ruta, 'utf8'));
  if (Array.isArray(datos)) return datos as Pista[];
  if (datos && Array.isArray(datos.pistas)) return datos.pistas as Pista[];
  return [];
}

/** Agrega una pista (evita duplicados por url + que_vi). Devuelve la ruta del archivo. */
export function agregarPista(politico: string, pista: Pista): string {
  asegurarCorpus();
  mkdirSync(RUTAS_CORPUS.pistas, { recursive: true });
  const ruta = rutaPistas(politico);
  const pistas = leerPistas(politico);
  const url = canonicalizar(pista.url);
  if (pistas.some((p) => canonicalizar(p.url) === url && p.que_vi.trim() === pista.que_vi.trim())) {
    log.info(`pista repetida para ${politico}, no se agrega`);
    return ruta;
  }
  pistas.push({
    url: pista.url,
    que_vi: pista.que_vi.trim(),
    fecha: pista.fecha ?? null,
    tema_probable: pista.tema_probable ?? null,
    ...(pista.revisar_cuando?.length ? { revisar_cuando: pista.revisar_cuando } : {}),
    agregada: new Date().toISOString(),
    por: hostname(),
  });
  writeFileSync(ruta, `# Pistas para ${politico}. Las carga el brief del investigador antes de googlear.\n` + aYaml({ pistas }, { lineWidth: 0 }), 'utf8');
  return ruta;
}

function main(): void {
  const { posicionales, opciones } = parsearArgs(process.argv.slice(2));
  const [politico, url, ...resto] = posicionales;
  if (!politico) {
    process.stderr.write('Uso: tsx scripts/corpus/pistas.ts <politico> [url "que vi" --fecha YYYY-MM-DD --tema economia/impuestos]\n');
    process.exit(2);
  }
  if (!url) {
    const pistas = leerPistas(politico);
    process.stdout.write(pistas.length ? aYaml({ pistas }, { lineWidth: 0 }) : `sin pistas para ${politico}\n`);
    return;
  }
  const ruta = agregarPista(politico, {
    url,
    que_vi: resto.join(' ') || '(sin descripcion)',
    fecha: typeof opciones.fecha === 'string' ? opciones.fecha : null,
    tema_probable: typeof opciones.tema === 'string' ? opciones.tema : null,
  });
  log.ok(`pista guardada en ${ruta}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
