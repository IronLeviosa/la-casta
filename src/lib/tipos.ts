/** Tipos derivados de las colecciones, para tipar props de componentes. */
import type { CollectionEntry } from 'astro:content';

export type Fuente = CollectionEntry<'declaraciones'>['data']['evidencia']['fuentes'][number];
export type Evidencia = CollectionEntry<'declaraciones'>['data']['evidencia'];
export type Procedencia = CollectionEntry<'declaraciones'>['data']['procedencia'];
export type Revision = CollectionEntry<'declaraciones'>['data']['revision'];

export type Politico = CollectionEntry<'politicos'>;
export type Declaracion = CollectionEntry<'declaraciones'>;
export type Giro = CollectionEntry<'giros'>;
export type Promesa = CollectionEntry<'promesas'>;
export type Chequeo = CollectionEntry<'chequeos'>;
export type Caso = CollectionEntry<'casos'>;
export type Intervencion = CollectionEntry<'intervenciones'>;
export type Patrimonio = CollectionEntry<'patrimonio'>;
export type Medio = CollectionEntry<'medios'>;
export type Tema = CollectionEntry<'temas'>;
export type Evento = CollectionEntry<'eventos'>;
export type Cobertura = CollectionEntry<'cobertura'>;
export type Correccion = CollectionEntry<'correcciones'>;
export type Mencion = CollectionEntry<'menciones'>;
export type Referente = CollectionEntry<'referentes'>;
