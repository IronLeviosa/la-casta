/**
 * El validador corrido de forma programática sobre las fixtures.
 *
 * `fixtures/ok/` tiene que salir 0. Cada `fixtures/malos/<regla>/` tiene que
 * salir 1, fallar en la etapa esperada y decir por qué con un mensaje que una
 * persona pueda leer y corregir sin abrir el código.
 */
import { afterAll, describe, expect, it } from 'vitest';
import { validar, type NombreEtapa } from '../scripts/validar.ts';
import { limpiarFixtures, prepararFixture } from './ayuda.ts';

afterAll(limpiarFixtures);

/** Opciones comunes: sin red y sin escribir data/simetria.json en el temporal. */
const OPCIONES = { escribirSimetria: false as const };

interface CasoMalo {
  regla: string;
  etapa: NombreEtapa;
  /** Fragmento que debe aparecer en algún mensaje de error. */
  mensaje: string;
}

const CASOS: CasoMalo[] = [
  { regla: 'fuente-faltante', etapa: 'esquema', mensaje: 'Se requiere al menos una fuente' },
  { regla: 'reportado-un-grupo', etapa: 'tiers', mensaje: 'un solo grupo de medios' },
  { regla: 'giro-fechas-invertidas', etapa: 'referencias', mensaje: 'Fechas invertidas' },
  { regla: 'hipotesis-en-content', etapa: 'tiers', mensaje: 'no puede estar en content/' },
  { regla: 'caso-sin-aprobacion', etapa: 'tiers', mensaje: 'Sin aprobación humana' },
  { regla: 'hash-desactualizado', etapa: 'tiers', mensaje: 'Aprobación desactualizada' },
  { regla: 'inferencia-sin-cadena', etapa: 'esquema', mensaje: 'requiere cadena' },
  { regla: 'video-sin-marca-tiempo', etapa: 'esquema', mensaje: 'requiere marca_tiempo' },
  { regla: 'etiqueta-legal-inconsistente', etapa: 'esquema', mensaje: 'etiqueta_legal debe derivarse' },
  { regla: 'medio-desconocido', etapa: 'referencias', mensaje: 'Medio desconocido' },
  { regla: 'procedencia-faltante', etapa: 'esquema', mensaje: 'Campo obligatorio ausente' },
];

describe('validar() sobre la fixture buena', () => {
  it('sale 0 y no reporta errores', async () => {
    const raiz = prepararFixture();
    const r = await validar({ rootDir: raiz, ...OPCIONES });
    expect(r.errores).toEqual([]);
    expect(r.codigo).toBe(0);
    expect(r.ok).toBe(true);
  });

  it('corre las seis etapas y salta las de red sin --red', async () => {
    const raiz = prepararFixture();
    const r = await validar({ rootDir: raiz, ...OPCIONES });
    expect(r.etapas.map((e) => e.etapa)).toEqual(['esquema', 'referencias', 'tiers', 'fuentes', 'citas', 'simetria']);
    expect(r.etapas.filter((e) => e.omitida).map((e) => e.etapa)).toEqual(['fuentes', 'citas']);
  });

  it('avisa de las URLs sin verificar en el ledger, pero no falla (clon recién bajado)', async () => {
    const raiz = prepararFixture();
    const r = await validar({ rootDir: raiz, ...OPCIONES });
    expect(r.avisos.some((a) => a.mensaje.includes('Sin verificar en ledger'))).toBe(true);
    expect(r.codigo).toBe(0);
  });

  it('calcula la simetría por partido y por político', async () => {
    const raiz = prepararFixture();
    const r = await validar({ rootDir: raiz, ...OPCIONES });
    expect(r.simetria?.por_politico['lacalle-pou']?.declaraciones).toBe(2);
    expect(r.simetria?.por_partido['Partido Nacional']?.giros.total).toBe(1);
  });

  it('con --solo corre una sola etapa', async () => {
    const raiz = prepararFixture();
    const r = await validar({ rootDir: raiz, solo: 'referencias', ...OPCIONES });
    expect(r.etapas.filter((e) => !e.omitida).map((e) => e.etapa)).toEqual(['referencias']);
    expect(r.codigo).toBe(0);
  });
});

describe('validar() sobre las fixtures malas', () => {
  for (const caso of CASOS) {
    it(`${caso.regla}: falla en la etapa ${caso.etapa} con "${caso.mensaje}"`, async () => {
      const raiz = prepararFixture(caso.regla);
      const r = await validar({ rootDir: raiz, ...OPCIONES });

      expect(r.codigo, `se esperaba salida 1 para ${caso.regla}`).toBe(1);
      expect(r.errores.length).toBeGreaterThan(0);

      const mensajes = r.errores.map((e) => e.mensaje).join('\n');
      expect(mensajes, `mensajes obtenidos:\n${mensajes}`).toContain(caso.mensaje);

      const fallada = r.etapas.find((e) => !e.omitida && !e.ok);
      expect(fallada?.etapa, `etapas: ${r.etapas.map((e) => `${e.etapa}:${e.errores.length}`).join(' ')}`).toBe(caso.etapa);
    });
  }

  it('corta en la primera etapa que falla', async () => {
    const raiz = prepararFixture('medio-desconocido');
    const r = await validar({ rootDir: raiz, ...OPCIONES });
    // Falla en referencias: tiers y las siguientes no llegan a correr.
    expect(r.etapas.map((e) => e.etapa)).toEqual(['esquema', 'referencias']);
  });

  it('todas las fixtures malas del directorio están cubiertas por un caso', async () => {
    const { readdirSync } = await import('node:fs');
    const { FIXTURES_MALOS } = await import('./ayuda.ts');
    const enDisco = readdirSync(FIXTURES_MALOS).sort();
    expect(enDisco).toEqual(CASOS.map((c) => c.regla).sort());
  });
});
