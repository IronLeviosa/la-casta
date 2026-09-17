/**
 * `pnpm catalogo:reintentar` (docs/plan-catalogo.md, "Rendimiento"; apagón de DNS del 2026-09-16):
 * clasificación y agrupado puros — id (completo o sufijo), motivo de red vs. no reintentable,
 * dedupe/reparto de URL y armado del plan de reencolado. El caso de punta a punta contra un
 * `CORPUS_DIR` temporal (main() de verdad creando un trabajo en la cola) vive aparte en
 * `tests/catalogo-reintentar-e2e.test.ts`: este archivo importa `catalogo-reintentar.ts` de forma
 * estática (para probar las funciones puras sin fricción), y ese import ya evalúa `lib/rutas.ts`
 * con el `CORPUS_DIR` de siempre — nada acá lee ni escribe el corpus real, así que no importa.
 */
import { describe, expect, it } from 'vitest';
import {
  contarPorMotivo,
  coincideConId,
  enLotesDe,
  erroresDeTrabajos,
  extraerTrabajoIds,
  filtrarYaCatalogadas,
  pendientesDe,
  planificarReintento,
  seleccionarTrabajos,
  trabajosACrearDe,
  type GrupoDeReintento,
} from '../scripts/corpus/catalogo-reintentar.ts';
import { versionCatalogo } from '../scripts/corpus/etiquetar.ts';
import type { Nota, Trabajo } from '../scripts/corpus/tipos.ts';

function trabajo(id: string, params: Record<string, unknown> = {}, extra: Partial<Trabajo> = {}): Trabajo {
  return { id, tipo: 'catalogar', params, estado: 'hecho', creado_por: 'test-host', creado: '2026-09-16T00:00:00.000Z', ...extra };
}

// ------------------------------------------------------------------------------------------
// coincideConId / seleccionarTrabajos / extraerTrabajoIds
// ------------------------------------------------------------------------------------------

describe('coincideConId()', () => {
  it('coincide con el id completo', () => {
    expect(coincideConId('20260916T200028Z-db06d6ac', '20260916T200028Z-db06d6ac')).toBe(true);
  });

  it('coincide con solo el sufijo hex después del último guion', () => {
    expect(coincideConId('20260916T200028Z-db06d6ac', 'db06d6ac')).toBe(true);
  });

  it('no coincide con un sufijo de otro trabajo, ni con un prefijo suelto', () => {
    expect(coincideConId('20260916T200028Z-db06d6ac', 'a4521760')).toBe(false);
    expect(coincideConId('20260916T200028Z-db06d6ac', '20260916T200028Z')).toBe(false);
  });
});

describe('seleccionarTrabajos()', () => {
  const trabajos = [trabajo('20260916T200028Z-db06d6ac'), trabajo('20260916T200028Z-f87b34bd')];

  it('encuentra por sufijo, en el orden pedido', () => {
    const r = seleccionarTrabajos(trabajos, ['f87b34bd', 'db06d6ac']);
    expect(r.encontrados.map((t) => t.id)).toEqual(['20260916T200028Z-f87b34bd', '20260916T200028Z-db06d6ac']);
    expect(r.noEncontrados).toEqual([]);
  });

  it('un id que no aparece va a noEncontrados sin frenar el resto', () => {
    const r = seleccionarTrabajos(trabajos, ['db06d6ac', 'no-existe']);
    expect(r.encontrados.map((t) => t.id)).toEqual(['20260916T200028Z-db06d6ac']);
    expect(r.noEncontrados).toEqual(['no-existe']);
  });
});

describe('extraerTrabajoIds()', () => {
  it('junta varios --trabajo repetidos, en orden', () => {
    expect(extraerTrabajoIds(['--trabajo', 'a', '--tamano', '50', '--trabajo', 'b'])).toEqual(['a', 'b']);
  });

  it('acepta --trabajo=valor', () => {
    expect(extraerTrabajoIds(['--trabajo=a', '--trabajo=b'])).toEqual(['a', 'b']);
  });

  it('sin --trabajo, lista vacía', () => {
    expect(extraerTrabajoIds(['--todos', '--simulacion'])).toEqual([]);
  });

  it('--trabajo al final sin valor no cuenta (evita comerse la siguiente opción)', () => {
    expect(extraerTrabajoIds(['--trabajo', '--simulacion'])).toEqual([]);
  });
});

// ------------------------------------------------------------------------------------------
// erroresDeTrabajos / contarPorMotivo / enLotesDe
// ------------------------------------------------------------------------------------------

describe('erroresDeTrabajos()', () => {
  it('junta los errores de varios trabajos con su id de origen', () => {
    const t1 = trabajo('a', { progreso: { hechas: 2, ultima_url: null, errores: [{ url: 'https://x.uy/1', motivo: 'fetch failed' }] } });
    const t2 = trabajo('b', { progreso: { hechas: 1, ultima_url: null, errores: [{ url: 'https://x.uy/2', motivo: 'HTTP 404 al pedir https://x.uy/2' }] } });
    expect(erroresDeTrabajos([t1, t2])).toEqual([
      { url: 'https://x.uy/1', motivo: 'fetch failed', origen: 'a' },
      { url: 'https://x.uy/2', motivo: 'HTTP 404 al pedir https://x.uy/2', origen: 'b' },
    ]);
  });

  it('un trabajo sin progreso.errores no aporta nada (no rompe)', () => {
    expect(erroresDeTrabajos([trabajo('a')])).toEqual([]);
  });
});

describe('contarPorMotivo()', () => {
  it('agrupa por motivo corto', () => {
    expect(contarPorMotivo([{ motivo: 'fetch failed' }, { motivo: 'fetch failed' }, { motivo: 'HTTP 404 al pedir x' }])).toEqual({ 'fetch failed': 2, http_404: 1 });
  });
});

describe('enLotesDe()', () => {
  it('reparte en tramos de a lo sumo "tamano", el último más chico', () => {
    expect(enLotesDe([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  it('con tamano mayor que la lista, un solo lote', () => {
    expect(enLotesDe([1, 2], 190)).toEqual([[1, 2]]);
  });

  it('lista vacía da lista de lotes vacía', () => {
    expect(enLotesDe([], 190)).toEqual([]);
  });
});

// ------------------------------------------------------------------------------------------
// filtrarYaCatalogadas / planificarReintento (con leerNotaFn inyectado: sin tocar disco)
// ------------------------------------------------------------------------------------------

describe('filtrarYaCatalogadas()', () => {
  const VIGENTE: Pick<Nota, 'catalogo'> = { catalogo: { version: versionCatalogo(), modelo: 'haiku', fecha: '2026-09-01', relevancia: {}, tiene_afirmaciones: false } };

  it('sin nada en el corpus (siempre null), todas quedan pendientes', () => {
    const r = filtrarYaCatalogadas(['https://x.uy/1', 'https://x.uy/2'], () => null);
    expect(r.pendientes).toEqual(['https://x.uy/1', 'https://x.uy/2']);
    expect(r.yaCatalogadas).toEqual([]);
  });

  it('con la versión vigente ya guardada, todas quedan afuera', () => {
    const r = filtrarYaCatalogadas(['https://x.uy/1', 'https://x.uy/2'], () => VIGENTE);
    expect(r.pendientes).toEqual([]);
    expect(r.yaCatalogadas).toEqual(['https://x.uy/1', 'https://x.uy/2']);
  });

  it('con una versión vieja (necesita recatalogarse), queda pendiente igual', () => {
    const vieja: Pick<Nota, 'catalogo'> = { ...VIGENTE, catalogo: { ...VIGENTE.catalogo!, version: 'v-vieja' } };
    const r = filtrarYaCatalogadas(['https://x.uy/1'], () => vieja);
    expect(r.pendientes).toEqual(['https://x.uy/1']);
  });
});

describe('planificarReintento()', () => {
  const sinCorpus = () => null; // nada catalogado todavía: todo lo de red queda pendiente

  it('caso del enunciado: 3 errores (2 de red, 1 armazón JS) -> solo las 2 de red quedan para reencolar', () => {
    const t = trabajo('20260916T200028Z-db06d6ac', {
      medio: 'el-pais',
      desde: '2026-08',
      hasta: '2026-08',
      progreso: {
        hechas: 3,
        ultima_url: 'https://elpais.com.uy/c',
        errores: [
          { url: 'https://elpais.com.uy/a', motivo: 'fetch failed' },
          { url: 'https://elpais.com.uy/b', motivo: 'HTTP 503 al pedir https://elpais.com.uy/b' },
          { url: 'https://elpais.com.uy/c', motivo: 'la página se arma con JavaScript en el navegador y trae poco texto (...)' },
        ],
      },
    });
    const plan = planificarReintento([t], { leerNotaFn: sinCorpus });
    expect(plan.porMotivo).toEqual({ 'fetch failed': 1, http_503: 1, armazon_js: 1 });
    expect(plan.urlsDeRed).toBe(2);
    expect(plan.yaCatalogadas).toBe(0);
    expect(plan.grupos).toHaveLength(1);
    const [grupo] = plan.grupos;
    expect(grupo.urls.sort()).toEqual(['https://elpais.com.uy/a', 'https://elpais.com.uy/b']);
    expect(grupo.params).toEqual({ medio: 'el-pais', desde: '2026-08', hasta: '2026-08' });
    expect(grupo.origenes).toEqual(['20260916T200028Z-db06d6ac']);
  });

  it('saca las URL que el corpus ya tiene catalogadas con la versión vigente', () => {
    const t = trabajo('a', {
      progreso: { hechas: 2, ultima_url: null, errores: [{ url: 'https://x.uy/1', motivo: 'fetch failed' }, { url: 'https://x.uy/2', motivo: 'fetch failed' }] },
    });
    const yaVigente = () => ({ catalogo: { version: versionCatalogo(), modelo: 'haiku', fecha: '2026-09-01', relevancia: {}, tiene_afirmaciones: false } });
    // Con un stub que siempre dice "ya está con la versión vigente", las dos quedan afuera.
    const plan = planificarReintento([t], { leerNotaFn: yaVigente });
    expect(plan.urlsDeRed).toBe(2);
    expect(plan.yaCatalogadas).toBe(2);
    expect(plan.grupos).toEqual([]);
  });

  it('deduplica la misma URL de red repetida en dos trabajos y junta los orígenes', () => {
    const t1 = trabajo('a', { medio: 'x', progreso: { hechas: 1, ultima_url: null, errores: [{ url: 'https://x.uy/1', motivo: 'fetch failed' }] } });
    const t2 = trabajo('b', { medio: 'x', progreso: { hechas: 1, ultima_url: null, errores: [{ url: 'https://x.uy/1', motivo: 'fetch failed' }] } });
    const plan = planificarReintento([t1, t2], { leerNotaFn: sinCorpus });
    expect(plan.urlsDeRed).toBe(1);
    expect(plan.grupos).toHaveLength(1);
    expect(plan.grupos[0].urls).toEqual(['https://x.uy/1']);
    expect(plan.grupos[0].origenes.sort()).toEqual(['a', 'b']);
  });

  it('sin errores de red, no arma ningún grupo', () => {
    const t = trabajo('a', { progreso: { hechas: 1, ultima_url: null, errores: [{ url: 'https://x.uy/1', motivo: '404' }] } });
    const plan = planificarReintento([t], { leerNotaFn: sinCorpus });
    expect(plan.grupos).toEqual([]);
    expect(pendientesDe(plan)).toBe(0);
    expect(trabajosACrearDe(plan, 190)).toBe(0);
  });
});

describe('pendientesDe() / trabajosACrearDe()', () => {
  it('suma las URL de todos los grupos y calcula cuántos trabajos saldrían con el tamaño de lote', () => {
    const grupos: GrupoDeReintento[] = [
      { params: {}, urls: Array.from({ length: 250 }, (_, i) => `u${i}`), origenes: ['a'] },
      { params: { medio: 'x' }, urls: ['u1', 'u2'], origenes: ['b'] },
    ];
    const plan = { porMotivo: {}, urlsDeRed: 252, yaCatalogadas: 0, grupos };
    expect(pendientesDe(plan)).toBe(252);
    expect(trabajosACrearDe(plan, 190)).toBe(3); // 250 -> 2 lotes (190+60), 2 -> 1 lote
  });
});
