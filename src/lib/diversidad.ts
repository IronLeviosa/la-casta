/**
 * Diversidad de fuentes: cuántos medios, cuántos grupos de propiedad y
 * cuántos alineamientos distintos respaldan un registro.
 *
 * La independencia se mide por `grupo` (familia de propiedad), no por nombre
 * de medio: dos diarios del mismo grupo cuentan como uno. Con menos de dos
 * grupos la evidencia depende de una sola familia de propiedad y se avisa.
 */

export interface PerfilMedio {
  grupo: string;
  alineamiento: string;
  nombre?: string;
}

export interface FuenteMinima {
  medio: string | { id: string };
}

export interface Diversidad {
  medios: number;
  grupos: number;
  alineamientos: number;
  /** true cuando hay menos de dos grupos de propiedad distintos. */
  advertencia: boolean;
  /** Ids de medios que no están en el mapa (no deberían existir tras el validador). */
  desconocidos: string[];
  listaMedios: string[];
  listaGrupos: string[];
  listaAlineamientos: string[];
}

export function idMedio(f: FuenteMinima): string {
  return typeof f.medio === 'string' ? f.medio : f.medio.id;
}

/** Construye el mapa id → perfil a partir de las entradas de la colección `medios`. */
export function mapaMedios(
  entradas: Iterable<{ id: string; data: { nombre: string; grupo: string; alineamiento: { etiqueta: string } } }>,
): Map<string, PerfilMedio> {
  const m = new Map<string, PerfilMedio>();
  for (const e of entradas) {
    m.set(e.id, { grupo: e.data.grupo, alineamiento: e.data.alineamiento.etiqueta, nombre: e.data.nombre });
  }
  return m;
}

export type NivelDeEvidencia = 'textual' | 'reportado' | 'inferencia';

/**
 * Si la insignia tiene que avisar. La regla de dos grupos de propiedad es de `reportado`: lo que
 * cuenta la prensa necesita dos familias de medios. Un registro `textual` se apoya en un documento
 * oficial, un diario de sesiones o un video, y ahí un solo «grupo» es lo esperable: avisar sobre esa
 * evidencia (la promesa de Astori de 2005, con el texto de Presidencia, llevaba «⚠ un solo grupo»,
 * 2026-09-16) hace desconfiar del registro más firme del sitio. Sin nivel se conserva el aviso.
 */
export function avisoDeDiversidad(d: Pick<Diversidad, 'advertencia'>, nivel?: NivelDeEvidencia): boolean {
  return d.advertencia && (nivel === undefined || nivel === 'reportado');
}

export function calcularDiversidad(fuentes: readonly FuenteMinima[], medios: Map<string, PerfilMedio>): Diversidad {
  const ids = new Set<string>();
  const grupos = new Set<string>();
  const alineamientos = new Set<string>();
  const desconocidos: string[] = [];
  for (const f of fuentes) {
    const id = idMedio(f);
    ids.add(id);
    const perfil = medios.get(id);
    if (!perfil) {
      if (!desconocidos.includes(id)) desconocidos.push(id);
      continue;
    }
    grupos.add(perfil.grupo);
    alineamientos.add(perfil.alineamiento);
  }
  return {
    medios: ids.size,
    grupos: grupos.size,
    alineamientos: alineamientos.size,
    advertencia: grupos.size < 2,
    desconocidos,
    listaMedios: [...ids],
    listaGrupos: [...grupos],
    listaAlineamientos: [...alineamientos],
  };
}
