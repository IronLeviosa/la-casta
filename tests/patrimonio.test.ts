/**
 * Tests del análisis patrimonial (`src/lib/patrimonio.ts`).
 *
 * Los cuatro primeros bloques prueban las decisiones de modelo que un cambio
 * silencioso podría revertir; el último es una regresión con las cifras reales
 * de un tramo publicable, para que un error de modelo no vuelva a producir un
 * titular como el que produjo la versión anterior de la biblioteca.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  SUPUESTOS,
  analizarPatrimonio,
  efectoDeEvento,
  ingresosAnuales,
  tasaAhorroDeEquilibrio,
  type DeclaracionPatrimonial,
  type EventoDeclarado,
} from '../src/lib/patrimonio.ts';
import { DIR_TESTS } from './ayuda.ts';

/** Declaración mínima en pesos con UI = 1, para que UI y pesos coincidan. */
function decl(over: Partial<DeclaracionPatrimonial> & { fecha: string; neto: number }): DeclaracionPatrimonial {
  return {
    id: `d-${over.fecha}`,
    cargo: 'Cargo de prueba',
    activo: over.neto,
    pasivo: 0,
    ingresos: 0,
    ingresos_periodicidad: 'anual',
    moneda: 'UYU',
    tipo_cambio_bcu: 40,
    ui_a_la_fecha: 1,
    eventos_declarados: [],
    ...over,
  };
}

describe('normalización mensual vs. anual de ingresos', () => {
  it('anualiza el ingreso mensual multiplicando por 12 y deja el anual como está', () => {
    expect(ingresosAnuales(100, 'mensual')).toBe(1200);
    expect(ingresosAnuales(1200, 'anual')).toBe(1200);
    expect(SUPUESTOS.mesesPorAnio).toBe(12);
  });

  it('un ingreso mensual de X y uno anual de 12X producen exactamente el mismo análisis', () => {
    const mensual = analizarPatrimonio([
      decl({ fecha: '2021-01-01', neto: 1_000_000, ingresos: 50_000, ingresos_periodicidad: 'mensual' }),
      decl({ fecha: '2022-01-01', neto: 1_300_000, ingresos: 50_000, ingresos_periodicidad: 'mensual' }),
    ]);
    const anual = analizarPatrimonio([
      decl({ fecha: '2021-01-01', neto: 1_000_000, ingresos: 600_000, ingresos_periodicidad: 'anual' }),
      decl({ fecha: '2022-01-01', neto: 1_300_000, ingresos: 600_000, ingresos_periodicidad: 'anual' }),
    ]);
    expect(mensual.saltos[0]!.ingresosAnualesUI).toBe(600_000);
    expect(mensual.saltos[0]!.explicableUI).toBe(anual.saltos[0]!.explicableUI);
    expect(mensual.saltos[0]!.residuoUI).toBe(anual.saltos[0]!.residuoUI);
    expect(mensual.saltos[0]!.tasaAhorroEquilibrio).toBe(anual.saltos[0]!.tasaAhorroEquilibrio);
  });

  it('leer un ingreso mensual como si fuera anual infla el residuo ~12 veces en la parte de ahorro', () => {
    const base = [
      decl({ fecha: '2021-01-01', neto: 1_000_000, ingresos: 50_000, ingresos_periodicidad: 'mensual' }),
      decl({ fecha: '2022-01-01', neto: 1_300_000, ingresos: 50_000, ingresos_periodicidad: 'mensual' }),
    ];
    const malLeido = base.map((d) => ({ ...d, ingresos_periodicidad: 'anual' as const }));
    const bien = analizarPatrimonio(base).saltos[0]!;
    const mal = analizarPatrimonio(malLeido).saltos[0]!;
    expect(mal.ahorroUI).toBeCloseTo(bien.ahorroUI / 12, 6);
    // Menos ahorro explicado ⇒ residuo mayor: es la dirección del error corregido.
    expect(mal.residuoUI).toBeGreaterThan(bien.residuoUI);
  });
});

describe('eventos declarados', () => {
  const venta: EventoDeclarado = { tipo: 'venta', monto: 5_000_000, descripcion: 'Venta de la casa habitación.' };
  const herencia: EventoDeclarado = { tipo: 'herencia', monto: 5_000_000, descripcion: 'Herencia recibida.' };

  const tramo = (eventos: EventoDeclarado[]) =>
    analizarPatrimonio([
      decl({ fecha: '2021-01-01', neto: 1_000_000, ingresos: 600_000 }),
      decl({ fecha: '2022-01-01', neto: 1_300_000, ingresos: 600_000, eventos_declarados: eventos }),
    ]).saltos[0]!;

  it('clasifica cada tipo por su efecto sobre el patrimonio neto', () => {
    expect(efectoDeEvento('herencia')).toBe('aporta');
    expect(efectoDeEvento('donacion')).toBe('aporta');
    expect(efectoDeEvento('revaluo')).toBe('aporta');
    expect(efectoDeEvento('venta')).toBe('rota');
    expect(efectoDeEvento('compra')).toBe('rota');
    expect(efectoDeEvento('otro')).toBe('sin_clasificar');
    expect(efectoDeEvento('tipo-que-no-existe')).toBe('sin_clasificar');
  });

  it('una venta declarada no infla la banda de lo explicable', () => {
    const sin = tramo([]);
    const con = tramo([venta]);
    expect(con.explicableUI).toBe(sin.explicableUI);
    expect(con.explicableMinUI).toBe(sin.explicableMinUI);
    expect(con.explicableMaxUI).toBe(sin.explicableMaxUI);
    expect(con.residuoUI).toBe(sin.residuoUI);
    expect(con.tasaAhorroEquilibrio).toBe(sin.tasaAhorroEquilibrio);
    // Pero el monto queda visible para poder mostrarlo como anotación.
    expect(con.eventosAportanUI).toBe(0);
    expect(con.eventosRotanUI).toBe(5_000_000);
  });

  it('una herencia declarada sí entra a la banda de lo explicable', () => {
    const sin = tramo([]);
    const con = tramo([herencia]);
    expect(con.eventosAportanUI).toBe(5_000_000);
    expect(con.explicableUI).toBeCloseTo(sin.explicableUI + 5_000_000, 6);
    expect(con.residuoUI).toBeCloseTo(sin.residuoUI - 5_000_000, 6);
  });

  it('un evento de tipo "otro" no da crédito en la banda y queda anotado aparte', () => {
    const sin = tramo([]);
    const con = tramo([{ tipo: 'otro', monto: 5_000_000, descripcion: 'Sin efecto declarado.' }]);
    expect(con.explicableUI).toBe(sin.explicableUI);
    expect(con.eventosSinClasificarUI).toBe(5_000_000);
  });
});

describe('tasa de ahorro de equilibrio', () => {
  it('caso a mano: sin rendimiento y sin eventos, es la variación sobre el ingreso del período', () => {
    // Variación 240.000 UI en 2 años con 120.000 UI de ingreso anual:
    // 240.000 / (120.000 × 2) = 1,00, o sea el 100 % del ingreso declarado.
    const t = tasaAhorroDeEquilibrio(240_000, { netoPrevioUI: 1_000_000, ingresosAnualesUI: 120_000, anios: 2, eventosAportanUI: 0 }, 0);
    expect(t).toBe(1);
  });

  it('caso a mano: los eventos que aportan se descuentan antes de dividir', () => {
    // (240.000 − 60.000) / (120.000 × 2) = 0,75.
    const t = tasaAhorroDeEquilibrio(
      240_000,
      { netoPrevioUI: 1_000_000, ingresosAnualesUI: 120_000, anios: 2, eventosAportanUI: 60_000 },
      0,
    );
    expect(t).toBe(0.75);
  });

  it('la tasa de equilibrio deja el residuo exactamente en cero', () => {
    const a = analizarPatrimonio([
      decl({ fecha: '2021-01-01', neto: 1_000_000, ingresos: 600_000 }),
      decl({ fecha: '2022-01-01', neto: 1_300_000, ingresos: 600_000 }),
    ]);
    const t = a.saltos[0]!;
    const explicableEnEquilibrio =
      t.ingresosAnualesUI * t.tasaAhorroEquilibrio * t.anios +
      t.desde.netoUI * ((1 + SUPUESTOS.rendimiento) ** t.anios - 1) +
      t.eventosAportanUI;
    expect(t.saltoUI - explicableEnEquilibrio).toBeCloseTo(0, 6);
  });

  it('es NaN cuando no hay ingreso declarado, en vez de dar infinito', () => {
    const a = analizarPatrimonio([
      decl({ fecha: '2021-01-01', neto: 1_000_000, ingresos: 0 }),
      decl({ fecha: '2022-01-01', neto: 1_300_000, ingresos: 0 }),
    ]);
    expect(Number.isNaN(a.saltos[0]!.tasaAhorroEquilibrio)).toBe(true);
  });
});

describe('detección de cambio de signo dentro de la banda de supuestos', () => {
  // Con neto previo 1.000.000 UI, ingreso anual 100.000 UI y un año de tramo,
  // lo explicable va de 24.983 UI (ahorro 15 %, rendimiento 1 %) a 94.934 UI
  // (ahorro 45 %, rendimiento 5 %). Una variación dentro de ese intervalo hace
  // que el signo del residuo dependa del supuesto elegido.
  const tramoCon = (netoFinal: number) =>
    analizarPatrimonio([
      decl({ fecha: '2021-01-01', neto: 1_000_000, ingresos: 100_000 }),
      decl({ fecha: '2022-01-01', neto: netoFinal, ingresos: 100_000 }),
    ]).saltos[0]!;

  it('marca signoRobusto = false cuando el residuo cambia de signo dentro de la banda', () => {
    const t = tramoCon(1_060_000);
    expect(t.explicableMinUI).toBeCloseTo(24_982.85, 1);
    expect(t.explicableMaxUI).toBeCloseTo(94_934.13, 1);
    expect(t.residuoBandaMaxUI).toBeGreaterThan(0);
    expect(t.residuoBandaMinUI).toBeLessThan(0);
    expect(t.signoRobusto).toBe(false);
    // Y la tasa de equilibrio cae dentro de la banda de tasas publicada.
    expect(t.tasaAhorroEquilibrio).toBeGreaterThan(SUPUESTOS.tasaAhorroMin);
    expect(t.tasaAhorroEquilibrio).toBeLessThan(SUPUESTOS.tasaAhorroMax);
  });

  it('marca signoRobusto = true cuando el residuo es positivo en toda la banda', () => {
    const t = tramoCon(1_200_000);
    expect(t.signoRobusto).toBe(true);
    expect(t.residuoBandaMinUI).toBeGreaterThan(0);
    expect(t.tasaAhorroEquilibrio).toBeGreaterThan(SUPUESTOS.tasaAhorroMax);
  });

  it('marca signoRobusto = true cuando el residuo es negativo en toda la banda', () => {
    const t = tramoCon(1_000_000);
    expect(t.signoRobusto).toBe(true);
    expect(t.residuoBandaMaxUI).toBeLessThan(0);
    expect(t.tasaAhorroEquilibrio).toBeLessThan(0);
  });
});

describe('regresión: tramo real Lacalle Pou 2022-03-21 → 2024-03-22', () => {
  // Fixture con las cifras exactas del inbox. Con la biblioteca anterior este
  // tramo publicaba −94,0 % porque sumaba entera a la banda explicable la venta
  // de la casa habitación (20.515.000 UYU) y porque leía el ingreso mensual
  // como si fuera anual. Los dos errores están fijados acá.
  const declaraciones: DeclaracionPatrimonial[] = JSON.parse(
    readFileSync(path.join(DIR_TESTS, 'fixtures', 'patrimonio-lacalle-pou-2022-2024.json'), 'utf8'),
  );
  const t = analizarPatrimonio(declaraciones).saltos[0]!;

  it('la venta declarada no entra a la banda de lo explicable', () => {
    expect(t.eventosAportanUI).toBe(0);
    expect(t.eventosRotanUI).toBeCloseTo(3_429_971, 0);
  });

  it('el residuo relativo no vuelve a −94 %', () => {
    expect(t.residuoRelativo).toBeGreaterThan(-0.2);
    expect(t.residuoRelativo).toBeCloseTo(-0.0685, 3);
    expect(t.residuoUI).toBeCloseTo(-217_991, -1);
  });

  it('reproduce las cifras verificadas del tramo', () => {
    expect(t.dias).toBe(732);
    expect(t.desde.netoUI).toBeCloseTo(3_181_967.6, 0);
    expect(t.hasta.netoUI).toBeCloseTo(3_866_783.2, 0);
    expect(t.saltoUI).toBeCloseTo(684_815.6, 0);
    expect(t.ingresosAnualesUI).toBeCloseTo(1_178_604.3, 0);
    expect(t.explicableUI).toBeCloseTo(902_806.5, 0);
  });

  it('la tasa de ahorro de equilibrio es 20,8 % y por eso el signo no es robusto', () => {
    expect(t.tasaAhorroEquilibrio).toBeCloseTo(0.2077, 3);
    expect(t.signoRobusto).toBe(false);
  });
});
