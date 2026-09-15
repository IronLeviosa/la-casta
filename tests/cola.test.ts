/**
 * Pruebas de la cola de trabajos (defectos vistos el 2026-09-15): prioridad por tipo al tomar
 * trabajo, el cálculo puro de qué queda un trabajo reencolado, y la validación de opciones de
 * `pnpm worker`. Todo sobre funciones puras, sin tocar CORPUS_DIR ni el corpus real: `ordenarPorPrioridad`
 * y `trabajoReintentado` no hacen IO (reciben y devuelven objetos en memoria), y `parsearOpcionesWorker`
 * solo parsea argv.
 */
import { describe, expect, it } from 'vitest';
import { intentosDe, ordenarPorPrioridad, trabajoReintentado } from '../scripts/cola.ts';
import { parsearOpcionesWorker } from '../scripts/worker.ts';
import type { Trabajo, TipoTrabajo } from '../scripts/corpus/tipos.ts';

// `intentos` no está en la interfaz Trabajo de corpus/tipos.ts (ver comentario en cola.ts);
// la fixture de test lo admite igual con la misma intersección que usa moverTrabajo.
function trabajo(id: string, tipo: TipoTrabajo, extra: Partial<Trabajo> & { intentos?: number } = {}): Trabajo {
  return {
    id,
    tipo,
    params: {},
    estado: 'pendiente',
    creado_por: 'test-host',
    creado: '2026-09-01T00:00:00.000Z',
    ...extra,
  };
}

// ------------------------------------------------------------------------------------------
// ordenarPorPrioridad
// ------------------------------------------------------------------------------------------

describe('ordenarPorPrioridad', () => {
  it('pone la precarga antes que etiquetar (defecto: 3 precargar_* detras de ~3.500 etiquetar)', () => {
    const cola = [trabajo('20260903-a', 'etiquetar'), trabajo('20260909-b', 'precargar_diarios'), trabajo('20260903-c', 'etiquetar')];
    const orden = ordenarPorPrioridad(cola);
    expect(orden[0].tipo).toBe('precargar_diarios');
    expect(orden.slice(1).every((t) => t.tipo === 'etiquetar')).toBe(true);
  });

  it('respeta el orden precargar_diarios, precargar_presidencia, precargar_inventario, transcribir, ..., etiquetar', () => {
    const cola = [
      trabajo('1', 'etiquetar'),
      trabajo('2', 'sync'),
      trabajo('3', 'precargar_inventario'),
      trabajo('4', 'transcribir'),
      trabajo('5', 'precargar_diarios'),
      trabajo('6', 'precargar_presidencia'),
    ];
    const orden = ordenarPorPrioridad(cola).map((t) => t.tipo);
    expect(orden).toEqual(['precargar_diarios', 'precargar_presidencia', 'precargar_inventario', 'transcribir', 'sync', 'etiquetar']);
  });

  it('dentro de un mismo tipo, el mas viejo primero (id = orden cronologico), sin importar el orden de entrada', () => {
    const cola = [trabajo('20260903-c', 'etiquetar'), trabajo('20260901-a', 'etiquetar'), trabajo('20260902-b', 'etiquetar')];
    expect(ordenarPorPrioridad(cola).map((t) => t.id)).toEqual(['20260901-a', '20260902-b', '20260903-c']);
  });

  it('no muta el arreglo recibido', () => {
    const cola = [trabajo('20260903-a', 'etiquetar'), trabajo('20260901-b', 'precargar_diarios')];
    const copia = [...cola];
    ordenarPorPrioridad(cola);
    expect(cola).toEqual(copia);
  });

  it('lista vacia da lista vacia', () => {
    expect(ordenarPorPrioridad([])).toEqual([]);
  });
});

// ------------------------------------------------------------------------------------------
// intentosDe / trabajoReintentado (logica pura de `pnpm cola:reintentar` y del retry del worker)
// ------------------------------------------------------------------------------------------

describe('intentosDe', () => {
  it('0 si el trabajo nunca tuvo intentos', () => {
    expect(intentosDe(trabajo('1', 'transcribir'))).toBe(0);
  });

  it('devuelve el contador guardado', () => {
    expect(intentosDe(trabajo('1', 'transcribir', { intentos: 2 }))).toBe(2);
  });
});

describe('trabajoReintentado', () => {
  it('saca error, terminado, tomado_por y tomado', () => {
    const t = trabajo('1', 'transcribir', {
      estado: 'error',
      error: 'fetch failed',
      terminado: '2026-09-15T01:00:00.000Z',
      tomado_por: 'server-1',
      tomado: '2026-09-15T00:50:00.000Z',
    });
    const nuevo = trabajoReintentado(t);
    expect(nuevo).not.toHaveProperty('error');
    expect(nuevo).not.toHaveProperty('terminado');
    expect(nuevo).not.toHaveProperty('tomado_por');
    expect(nuevo).not.toHaveProperty('tomado');
  });

  it('suma uno a intentos (0 -> 1 la primera vez)', () => {
    const t = trabajo('1', 'transcribir', { estado: 'error', error: 'timeout' });
    expect(trabajoReintentado(t).intentos).toBe(1);
  });

  it('acumula sobre intentos previos (2 -> 3)', () => {
    const t = trabajo('1', 'transcribir', { estado: 'error', error: 'timeout', intentos: 2 });
    expect(trabajoReintentado(t).intentos).toBe(3);
  });

  it('conserva id, tipo, params, creado_por, creado y el estado original (moverTrabajo pone el nuevo)', () => {
    const t = trabajo('20260915-x', 'precargar_diarios', { estado: 'error', error: 'HTTP 503', params: { camara: 'crr' } });
    const nuevo = trabajoReintentado(t);
    expect(nuevo.id).toBe('20260915-x');
    expect(nuevo.tipo).toBe('precargar_diarios');
    expect(nuevo.params).toEqual({ camara: 'crr' });
    expect(nuevo.creado_por).toBe('test-host');
    expect(nuevo.estado).toBe('error');
  });

  it('no muta el trabajo original', () => {
    const t = trabajo('1', 'transcribir', { estado: 'error', error: 'timeout' });
    trabajoReintentado(t);
    expect(t.error).toBe('timeout');
  });
});

// ------------------------------------------------------------------------------------------
// parsearOpcionesWorker (defecto: `--ayuda` mal escrito arrancaba el bucle en vez de fallar)
// ------------------------------------------------------------------------------------------

describe('parsearOpcionesWorker', () => {
  it('sin opciones: valores por omision, no arranca en modo ayuda', () => {
    const r = parsearOpcionesWorker([]);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.opciones.ayuda).toBe(false);
      expect(r.opciones.unaVez).toBe(false);
      expect(r.opciones.intervaloSeg).toBeUndefined();
      expect(r.opciones.tipo).toBeUndefined();
    }
  });

  it('--una-vez', () => {
    const r = parsearOpcionesWorker(['--una-vez']);
    expect(r.ok && r.opciones.unaVez).toBe(true);
  });

  it('--intervalo numerico', () => {
    const r = parsearOpcionesWorker(['--intervalo', '30']);
    expect(r.ok && r.opciones.intervaloSeg).toBe(30);
  });

  it('--intervalo no numerico falla sin arrancar', () => {
    const r = parsearOpcionesWorker(['--intervalo', 'mucho']);
    expect(r.ok).toBe(false);
  });

  it('--tipo valido', () => {
    const r = parsearOpcionesWorker(['--tipo', 'etiquetar']);
    expect(r.ok && r.opciones.tipo).toBe('etiquetar');
  });

  it('--tipo desconocido falla', () => {
    const r = parsearOpcionesWorker(['--tipo', 'no-existe']);
    expect(r.ok).toBe(false);
  });

  it('--ayuda y --help piden ayuda sin validar el resto', () => {
    expect(parsearOpcionesWorker(['--ayuda'])).toEqual({ ok: true, opciones: { unaVez: false, ayuda: true } });
    expect(parsearOpcionesWorker(['--help'])).toEqual({ ok: true, opciones: { unaVez: false, ayuda: true } });
  });

  it('una opcion desconocida (defecto: "--ayuda" mal tipeado) falla en vez de arrancar el bucle', () => {
    const r = parsearOpcionesWorker(['--loquesea']);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/loquesea/);
  });

  it('un argumento posicional (sin --) tambien falla', () => {
    const r = parsearOpcionesWorker(['dale']);
    expect(r.ok).toBe(false);
  });
});
