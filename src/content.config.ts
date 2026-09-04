import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { COLECCIONES, crearEsquemas, type NombreColeccion } from './schemas/comunes';

/**
 * Colecciones de contenido de La Casta.
 *
 * Los esquemas viven en src/schemas/. Acá solo se les inyecta `reference()`
 * para que cualquier enlace roto entre colecciones sea un error de build.
 */
const esquemas = crearEsquemas((coleccion: NombreColeccion) => reference(coleccion));

function loaderDe(nombre: NombreColeccion) {
  const def = COLECCIONES.find((c) => c.nombre === nombre)!;
  const pattern = def.extension === 'md' ? '**/*.md' : '**/*.yaml';
  return glob({ pattern, base: `./${def.carpeta}` });
}

export const collections = {
  politicos: defineCollection({ loader: loaderDe('politicos'), schema: esquemas.politicos }),
  temas: defineCollection({ loader: loaderDe('temas'), schema: esquemas.temas }),
  medios: defineCollection({ loader: loaderDe('medios'), schema: esquemas.medios }),
  eventos: defineCollection({ loader: loaderDe('eventos'), schema: esquemas.eventos }),
  referentes: defineCollection({ loader: loaderDe('referentes'), schema: esquemas.referentes }),
  declaraciones: defineCollection({ loader: loaderDe('declaraciones'), schema: esquemas.declaraciones }),
  giros: defineCollection({ loader: loaderDe('giros'), schema: esquemas.giros }),
  promesas: defineCollection({ loader: loaderDe('promesas'), schema: esquemas.promesas }),
  casos: defineCollection({ loader: loaderDe('casos'), schema: esquemas.casos }),
  chequeos: defineCollection({ loader: loaderDe('chequeos'), schema: esquemas.chequeos }),
  cobertura: defineCollection({ loader: loaderDe('cobertura'), schema: esquemas.cobertura }),
  intervenciones: defineCollection({ loader: loaderDe('intervenciones'), schema: esquemas.intervenciones }),
  patrimonio: defineCollection({ loader: loaderDe('patrimonio'), schema: esquemas.patrimonio }),
  menciones: defineCollection({ loader: loaderDe('menciones'), schema: esquemas.menciones }),
  correcciones: defineCollection({ loader: loaderDe('correcciones'), schema: esquemas.correcciones }),
  paginas: defineCollection({ loader: loaderDe('paginas'), schema: esquemas.paginas }),
  leyes: defineCollection({ loader: loaderDe('leyes'), schema: esquemas.leyes }),
  vetos: defineCollection({ loader: loaderDe('vetos'), schema: esquemas.vetos }),
};
