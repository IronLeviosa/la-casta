/**
 * `pnpm catalogo:reintentar` de punta a punta, contra un `CORPUS_DIR` temporal (nunca el real):
 * arma un trabajo `catalogar` en `hechos/` con 3 errores (2 de red, 1 armazón JS — el caso del
 * apagón de DNS del 2026-09-16) y comprueba que `main()` encola un trabajo nuevo con las 2 URL de
 * red y que `--simulacion` no encola nada. Las funciones puras (clasificación, agrupado) se prueban
 * sin tocar disco en `tests/catalogo-reintentar.test.ts`; este archivo es solo la integración con la
 * cola real (`scripts/cola.ts`) de punta a punta.
 *
 * `process.env.CORPUS_DIR` se fija antes de importar `scripts/lib/rutas.ts` (y todo lo que lo usa:
 * `scripts/cola.ts`, `scripts/corpus/catalogo-reintentar.ts`), así que esos imports son dinámicos —
 * mismo patrón que `tests/fuente-armazon-js.test.ts`. Ningún import ESTÁTICO de este archivo puede
 * tocar `lib/rutas.ts`, ni siquiera transitivamente, o ya quedaría evaluado con el `CORPUS_DIR` real
 * antes de que el `beforeAll` corra.
 */
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

const CORPUS_TMP = mkdtempSync(path.join(tmpdir(), 'la-casta-corpus-reintentar-e2e-'));

let RUTAS_CORPUS: typeof import('../scripts/lib/rutas.ts').RUTAS_CORPUS;
let agregarTrabajo: typeof import('../scripts/cola.ts').agregarTrabajo;
let moverTrabajo: typeof import('../scripts/cola.ts').moverTrabajo;
let listarTrabajos: typeof import('../scripts/cola.ts').listarTrabajos;
let main: typeof import('../scripts/corpus/catalogo-reintentar.ts').main;

beforeAll(async () => {
  process.env.CORPUS_DIR = CORPUS_TMP;
  ({ RUTAS_CORPUS } = await import('../scripts/lib/rutas.ts'));
  // Guarda de seguridad (ver tests/fuente-armazon-js.test.ts): si por cache de módulos `rutas.ts`
  // ya se había evaluado con el CORPUS_DIR real, preferimos que el test falle a escribir ahí.
  if (!path.resolve(RUTAS_CORPUS.raiz).startsWith(path.resolve(CORPUS_TMP))) {
    throw new Error(`CORPUS_DIR no se redirigió al temporal (quedó en ${RUTAS_CORPUS.raiz}); abortando para no tocar el corpus real.`);
  }
  ({ agregarTrabajo, moverTrabajo, listarTrabajos } = await import('../scripts/cola.ts'));
  ({ main } = await import('../scripts/corpus/catalogo-reintentar.ts'));
});

afterAll(() => {
  rmSync(CORPUS_TMP, { recursive: true, force: true });
});

describe('main() de punta a punta (CORPUS_DIR temporal)', () => {
  const argvOriginal = process.argv;
  let salidaProceso: ReturnType<typeof vi.spyOn>;

  beforeAll(() => {
    // Red de seguridad: si algo en main() llama a process.exit (uso incorrecto, trabajo no
    // encontrado), que tire en vez de matar el proceso de test.
    salidaProceso = vi.spyOn(process, 'exit').mockImplementation((codigo?: string | number | null): never => {
      throw new Error(`process.exit(${codigo})`);
    });
  });

  afterAll(() => {
    salidaProceso.mockRestore();
    process.argv = argvOriginal;
  });

  afterEach(() => {
    for (const t of listarTrabajos('pendiente')) {
      // Limpieza entre tests: mover a un estado descartable alcanza porque cada test arranca
      // leyendo 'pendiente' de nuevo (no hay un helper de borrado más liviano en cola.ts).
      moverTrabajo(t, 'hecho', { resultado: null, terminado: new Date().toISOString() });
    }
  });

  function trabajoDePruebaConTresErrores(): string {
    const t = agregarTrabajo('catalogar', {
      medio: 'el-pais',
      desde: '2026-08',
      hasta: '2026-08',
      urls: ['https://elpais.com.uy/a', 'https://elpais.com.uy/b', 'https://elpais.com.uy/c'],
      progreso: {
        hechas: 3,
        ultima_url: 'https://elpais.com.uy/c',
        errores: [
          { url: 'https://elpais.com.uy/a', motivo: 'fetch failed' },
          { url: 'https://elpais.com.uy/b', motivo: 'fetch failed' },
          { url: 'https://elpais.com.uy/c', motivo: 'la página se arma con JavaScript en el navegador y trae poco texto (...)' },
        ],
      },
    });
    moverTrabajo(t, 'hecho', { resultado: null, terminado: new Date().toISOString() });
    return t.id;
  }

  it('--simulacion no encola nada', async () => {
    const id = trabajoDePruebaConTresErrores();
    const sufijo = id.split('-').pop()!;
    process.argv = ['node', 'catalogo-reintentar.ts', '--trabajo', sufijo, '--simulacion'];

    await main();

    expect(listarTrabajos('pendiente').filter((t) => t.tipo === 'catalogar')).toHaveLength(0);
  });

  it('sin --simulacion, encola un trabajo catalogar nuevo con las 2 URL de red y reintento_de', async () => {
    const id = trabajoDePruebaConTresErrores();
    const sufijo = id.split('-').pop()!;
    process.argv = ['node', 'catalogo-reintentar.ts', '--trabajo', sufijo];

    await main();

    const nuevos = listarTrabajos('pendiente').filter((t) => t.tipo === 'catalogar');
    expect(nuevos).toHaveLength(1);
    const [nuevo] = nuevos;
    expect(nuevo.creado_por).toBe('catalogo:reintentar');
    expect((nuevo.params.urls as string[]).sort()).toEqual(['https://elpais.com.uy/a', 'https://elpais.com.uy/b']);
    expect(nuevo.params.reintento_de).toEqual([id]);
    expect(nuevo.params.medio).toBe('el-pais');
    expect(nuevo.params.desde).toBe('2026-08');
    expect(nuevo.params.hasta).toBe('2026-08');
  });

  it('--todos toma todos los catalogar de hechos/ sin que haga falta nombrarlos', async () => {
    trabajoDePruebaConTresErrores();
    process.argv = ['node', 'catalogo-reintentar.ts', '--todos', '--simulacion'];

    await expect(main()).resolves.toBeUndefined();
  });

  it('un --trabajo que no existe no revienta: avisa y sale con 1 si no queda ninguno', async () => {
    process.argv = ['node', 'catalogo-reintentar.ts', '--trabajo', 'no-existe-1234'];
    await expect(main()).rejects.toThrow('process.exit(1)');
  });
});
