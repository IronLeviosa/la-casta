/**
 * Diversidad de fuentes: cuántos medios, cuántos grupos de propiedad y
 * cuántos alineamientos distintos respaldan un registro.
 *
 * La independencia se mide por `grupo` (familia de propiedad), no por nombre
 * de medio: dos diarios del mismo grupo cuentan como uno. Con menos de dos
 * grupos la evidencia depende de una sola familia de propiedad y se avisa.
 */

/** Un tramo de `grupo_historial` (docs/plan-grupo-por-fecha.md), en lo mínimo que hace falta para resolver una fecha. */
export interface TramoGrupo {
  grupo: string;
  desde: string;
  hasta?: string;
}

export interface PerfilMedio {
  grupo: string;
  alineamiento: string;
  nombre?: string;
  /** Tramos de propiedad con fecha; sin esto, `grupo` vale para toda fecha. */
  historial?: TramoGrupo[];
}

export interface FuenteMinima {
  medio: string | { id: string };
  /** Fecha de publicación de la fuente; sin ella se usa el `grupo` vigente del medio (comportamiento de siempre). */
  fecha?: string;
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
  entradas: Iterable<{
    id: string;
    data: { nombre: string; grupo: string; alineamiento: { etiqueta: string }; grupo_historial?: TramoGrupo[] };
  }>,
): Map<string, PerfilMedio> {
  const m = new Map<string, PerfilMedio>();
  for (const e of entradas) {
    m.set(e.id, { grupo: e.data.grupo, alineamiento: e.data.alineamiento.etiqueta, nombre: e.data.nombre, historial: e.data.grupo_historial });
  }
  return m;
}

/**
 * Grupo de propiedad de un medio en una fecha dada (docs/plan-grupo-por-fecha.md). El validador y
 * el sitio comparten esta función: "dos fuentes de distinto grupo" se evalúa con el grupo que el
 * medio tenía en la fecha de cada fuente, no con el vigente.
 *
 * Sin `historial`, el `grupo` vale para toda fecha (comportamiento de siempre, el de un medio que
 * nunca cambió de dueño o cuya historia de propiedad no se cargó todavía). Con `historial`, se busca
 * el tramo que contiene la fecha. Si ninguno la cubre, el grupo es `'desconocido'` y `documentado`
 * queda en `false`, para que el validador pueda avisar que la fecha cae fuera de la historia de
 * propiedad documentada. Un tramo que declara `grupo: 'desconocido'` explícitamente (propiedad
 * buscada y no encontrada) también devuelve `'desconocido'`, pero con `documentado: true`: ese vacío
 * sí está documentado, a diferencia de una fecha que ningún tramo cubre.
 */
export interface ResultadoGrupo {
  grupo: string;
  documentado: boolean;
}

export function grupoEnFecha(medio: Pick<PerfilMedio, 'grupo' | 'historial'>, fecha: string): ResultadoGrupo {
  const tramos = medio.historial;
  if (!tramos || tramos.length === 0) return { grupo: medio.grupo, documentado: true };
  for (const t of tramos) {
    if (fecha >= t.desde && (!t.hasta || fecha <= t.hasta)) return { grupo: t.grupo, documentado: true };
  }
  return { grupo: 'desconocido', documentado: false };
}

/**
 * Clave para deduplicar grupos en un `Set` o `Map`: `'desconocido'` nunca coincide con el de otro
 * medio (que dos medios sin historia documentada digan los dos "desconocido" no los vuelve la misma
 * familia de propiedad), pero sí coincide consigo mismo dentro del mismo medio (dos fuentes del
 * mismo medio, ambas sin grupo resuelto, siguen contando como una sola familia).
 */
export function claveDeGrupo(medioId: string, grupo: string): string {
  return grupo === 'desconocido' ? `desconocido:${medioId}` : grupo;
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
  const claves = new Set<string>();
  const nombresGrupos = new Set<string>();
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
    // Sin fecha, se usa el grupo vigente del medio (comportamiento de siempre); con fecha, el que
    // tenía ese medio ese día, que puede no ser el vigente (docs/plan-grupo-por-fecha.md).
    const { grupo } = f.fecha ? grupoEnFecha(perfil, f.fecha) : { grupo: perfil.grupo };
    claves.add(claveDeGrupo(id, grupo));
    nombresGrupos.add(grupo);
    alineamientos.add(perfil.alineamiento);
  }
  return {
    medios: ids.size,
    grupos: claves.size,
    alineamientos: alineamientos.size,
    advertencia: claves.size < 2,
    desconocidos,
    listaMedios: [...ids],
    listaGrupos: [...nombresGrupos],
    listaAlineamientos: [...alineamientos],
  };
}
