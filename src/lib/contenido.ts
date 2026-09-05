/**
 * Consultas comunes sobre las colecciones: filtrado por tier, por político,
 * orden cronológico y conteos. Concentra la regla "solo se sirve lo
 * publicado; lo probable va a /probable/ con banner y noindex".
 */
import { getCollection, type CollectionEntry, type CollectionKey } from 'astro:content';
import { completarFecha } from '../schemas/base';
import { ES_PRESIDENTE, ES_VICEPRESIDENTE } from './roles';

export type Tier = 'publicado' | 'probable' | 'hipotesis';

type ConRevision = { data: { revision: { tier: Tier } } };

export function esPublicado<T extends ConRevision>(e: T): boolean {
  return e.data.revision.tier === 'publicado';
}

export function esProbable<T extends ConRevision>(e: T): boolean {
  return e.data.revision.tier === 'probable';
}

/** Entradas de una colección con `revision.tier === 'publicado'`. */
export async function publicados<C extends CollectionKey>(coleccion: C): Promise<CollectionEntry<C>[]> {
  const todas = await getCollection(coleccion);
  return todas.filter((e) => (e as unknown as ConRevision).data?.revision?.tier === 'publicado');
}

/** Entradas con tier `probable`. */
export async function probables<C extends CollectionKey>(coleccion: C): Promise<CollectionEntry<C>[]> {
  const todas = await getCollection(coleccion);
  return todas.filter((e) => (e as unknown as ConRevision).data?.revision?.tier === 'probable');
}

/** Publicadas y probables (todo lo que tiene página). */
export async function servibles<C extends CollectionKey>(coleccion: C): Promise<CollectionEntry<C>[]> {
  const todas = await getCollection(coleccion);
  return todas.filter((e) => {
    const t = (e as unknown as ConRevision).data?.revision?.tier;
    return t === 'publicado' || t === 'probable';
  });
}

type ConPolitico = { data: { politico: { id: string } } };

export function dePolitico<T extends ConPolitico>(entradas: T[], slug: string): T[] {
  return entradas.filter((e) => e.data.politico.id === slug);
}

/** Orden cronológico descendente por `data[campo]` (fecha ISO). */
export function porFechaDesc<T extends { data: Record<string, unknown> }>(entradas: T[], campo = 'fecha'): T[] {
  return [...entradas].sort((a, b) => String(b.data[campo] ?? '').localeCompare(String(a.data[campo] ?? '')));
}

export function porFechaAsc<T extends { data: Record<string, unknown> }>(entradas: T[], campo = 'fecha'): T[] {
  return [...entradas].sort((a, b) => String(a.data[campo] ?? '').localeCompare(String(b.data[campo] ?? '')));
}

/** Los cinco presidentes, en orden de primer mandato. */
export async function presidentes(): Promise<CollectionEntry<'politicos'>[]> {
  const todos = await publicados('politicos');
  return todos
    .filter((p) => p.data.mandatos.some((m) => ES_PRESIDENTE.test(m.cargo)))
    .sort((a, b) => primerMandato(a).localeCompare(primerMandato(b)));
}

export async function vicepresidentes(): Promise<CollectionEntry<'politicos'>[]> {
  const todos = await publicados('politicos');
  return todos
    .filter((p) => p.data.mandatos.some((m) => ES_VICEPRESIDENTE.test(m.cargo)))
    .sort((a, b) => primerMandato(a).localeCompare(primerMandato(b)));
}

export function primerMandato(p: CollectionEntry<'politicos'>): string {
  // Se ordena con la fecha completada: '1990' tiene que quedar antes que '1990-03-05', y
  // comparar los textos crudos los deja al revés porque '1990' es más corto.
  return [...p.data.mandatos].map((m) => completarFecha(m.desde, 'inicio')).sort()[0] ?? '';
}

/** Fecha de procedencia (cuándo se produjo el registro), si la tiene. */
export function fechaProcedencia(e: { data: { procedencia?: unknown } }): string {
  const p = e.data.procedencia as { fecha?: string } | undefined;
  return p?.fecha ?? '';
}

/** Mapa id → entrada, para resolver referencias sin repetir getEntry. */
export function indexar<T extends { id: string }>(entradas: T[]): Map<string, T> {
  return new Map(entradas.map((e) => [e.id, e]));
}

export { ES_PRESIDENTE, ES_VICEPRESIDENTE } from './roles';
