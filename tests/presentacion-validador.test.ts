/**
 * Etapa `presentacion` del validador (plan 2026-09, ítem 2.4; docs/colecciones/presentacion.md).
 *
 * Se prueba `validarPresentacion()` directo, con un `Contenido` armado a mano
 * (`construirContenido`) en vez de fixtures YAML en disco: la etapa es una función pura sobre
 * `Contenido`, y armar un registro mínimo por regla es más legible que mantener YAML válidos
 * contra todos los esquemas anidados (grafico, finanzas, monopolio…) que no hacen falta acá.
 */
import { describe, expect, it } from 'vitest';
import { construirContenido, type Registro } from '../scripts/lib/contenido.ts';
import { validarPresentacion } from '../scripts/validadores/presentacion.ts';

/** Registro mínimo: solo lo que la etapa presentacion necesita (no pasa por Zod). */
function reg(coleccion: Registro['coleccion'], id: string, datos: Record<string, any>, opciones: { enInbox?: boolean } = {}): Registro {
  return {
    coleccion,
    id,
    archivo: `${opciones.enInbox ? 'inbox' : 'content'}/${coleccion}/${id}.yaml`,
    datos,
    crudo: datos,
    enInbox: opciones.enInbox ?? false,
  };
}

const LACALLE_POU = reg('politicos', 'lacalle-pou', { nombre_corto: 'Lacalle Pou', nombre: 'Luis Alberto Lacalle Pou' });

/** Contenido con `LACALLE_POU` más los registros que da cada test. */
function contenidoCon(...registros: Registro[]) {
  return construirContenido('/fake-root', [LACALLE_POU, ...registros], [], registros.length + 1);
}

describe('validarPresentacion: titulo', () => {
  it('pasa con un título de 8 a 110 caracteres que no empieza con el nombre de la persona', () => {
    const c = contenidoCon(
      reg('chequeos', 'lacalle-pou/2020-04-20-x', {
        politico: 'lacalle-pou',
        titulo: 'Recaudación de IVA cayó 18 %, no 50 % como se afirmó',
      }),
    );
    const r = validarPresentacion(c);
    expect(r.errores).toEqual([]);
    expect(r.avisos.filter((a) => a.campo === 'titulo')).toEqual([]);
  });

  it('avisa (en content/) si el título es más corto que 8 caracteres', () => {
    const c = contenidoCon(reg('chequeos', 'lacalle-pou/2020-04-20-x', { politico: 'lacalle-pou', titulo: 'Corto' }));
    const r = validarPresentacion(c);
    expect(r.avisos.some((a) => a.campo === 'titulo' && a.mensaje.includes('5 caracteres'))).toBe(true);
    expect(r.errores).toEqual([]);
  });

  it('avisa si el título pasa los 110 caracteres', () => {
    const largo = 'x'.repeat(120);
    const c = contenidoCon(reg('vetos', 'lacalle-pou/2020-04-20-x', { politico: 'lacalle-pou', titulo: largo }));
    const r = validarPresentacion(c);
    expect(r.avisos.some((a) => a.campo === 'titulo' && a.mensaje.includes('120 caracteres'))).toBe(true);
  });

  it('avisa si el título empieza con el nombre de la persona', () => {
    const c = contenidoCon(
      reg('declaraciones', 'lacalle-pou/2020-04-20-x', {
        politico: 'lacalle-pou',
        titulo: 'Lacalle Pou promete no subir los impuestos',
      }),
    );
    const r = validarPresentacion(c);
    expect(r.avisos.some((a) => a.campo === 'titulo' && a.mensaje.includes('empieza con el nombre'))).toBe(true);
  });
});

describe('validarPresentacion: analisis en párrafos', () => {
  it('pasa con párrafos cortos', () => {
    const c = contenidoCon(reg('giros', 'lacalle-pou/x', { analisis: 'Cambió de posición sobre el tema y lo reconoció explícitamente.' }));
    const r = validarPresentacion(c);
    expect(r.avisos.filter((a) => a.campo === 'analisis')).toEqual([]);
  });

  it('avisa si un párrafo pasa las 80 palabras', () => {
    const parrafoLargo = Array.from({ length: 85 }, () => 'palabra').join(' ') + '.';
    const c = contenidoCon(reg('giros', 'lacalle-pou/x', { analisis: parrafoLargo }));
    const r = validarPresentacion(c);
    expect(r.avisos.some((a) => a.campo === 'analisis' && a.mensaje.includes('85 palabras'))).toBe(true);
  });

  it('avisa si el total pasa las 350 palabras aunque cada párrafo sea corto', () => {
    const parrafo = Array.from({ length: 70 }, () => 'palabra').join(' ') + '.';
    const texto = Array.from({ length: 6 }, () => parrafo).join('\n\n'); // 6 x 70 = 420 palabras
    const c = contenidoCon(reg('giros', 'lacalle-pou/x', { analisis: texto }));
    const r = validarPresentacion(c);
    expect(r.avisos.some((a) => a.campo === 'analisis' && /420 palabras en total/.test(a.mensaje))).toBe(true);
    // Ningún párrafo individual pasa las 80 palabras: no debería avisar por párrafo.
    expect(r.avisos.filter((a) => a.campo === 'analisis' && /\d+ palabras \(máximo 80\)/.test(a.mensaje))).toEqual([]);
  });

  it('aplica la misma regla a dato_real.valor', () => {
    const parrafoLargo = Array.from({ length: 90 }, () => 'palabra').join(' ') + '.';
    const c = contenidoCon(reg('chequeos', 'lacalle-pou/x', { analisis: 'Corto.', dato_real: { valor: parrafoLargo } }));
    const r = validarPresentacion(c);
    expect(r.avisos.some((a) => a.campo === 'dato_real.valor')).toBe(true);
  });
});

describe('validarPresentacion: resumen en párrafos cortos', () => {
  it('pasa con un párrafo corto', () => {
    const c = contenidoCon(reg('casos', 'x', { resumen: 'Se investiga un posible sobreprecio en una licitación.' }));
    const r = validarPresentacion(c);
    expect(r.avisos.filter((a) => a.campo === 'resumen')).toEqual([]);
  });

  it('avisa si un párrafo llega a 1500 caracteres', () => {
    const parrafo = 'Palabra '.repeat(200).trim(); // 1599 caracteres
    const c = contenidoCon(reg('casos', 'x', { resumen: parrafo }));
    const r = validarPresentacion(c);
    expect(r.avisos.some((a) => a.campo === 'resumen' && /1599 caracteres \(máximo 1500\)/.test(a.mensaje))).toBe(true);
  });
});

describe('validarPresentacion: una oración (concepto, nota, detalle/descripcion de hito)', () => {
  it('pasa con una sola oración corta', () => {
    const c = contenidoCon(reg('casos', 'x', { estado_judicial: [{ descripcion: 'Se presenta una denuncia ante la Fiscalía.' }] }));
    const r = validarPresentacion(c);
    expect(r.avisos.filter((a) => a.campo.includes('descripcion'))).toEqual([]);
  });

  it('avisa si el campo tiene más de una oración', () => {
    const c = contenidoCon(
      reg('casos', 'x', { estado_judicial: [{ descripcion: 'Se presenta la denuncia. Luego avanza a la investigación.' }] }),
    );
    const r = validarPresentacion(c);
    expect(r.avisos.some((a) => a.campo.includes('descripcion') && a.mensaje.includes('No parece una sola oración'))).toBe(true);
  });

  it('avisa si el campo pasa los 220 caracteres aunque sea una sola oración', () => {
    const oracion = 'Se presenta una denuncia ante la Fiscalía ' + 'muy '.repeat(50) + 'larga.';
    const c = contenidoCon(reg('empresas', 'ancap', { hitos: [{ detalle: oracion }] }));
    const r = validarPresentacion(c);
    expect(r.avisos.some((a) => a.campo === 'hitos.0.detalle' && a.mensaje.includes('máximo 220'))).toBe(true);
  });

  it('revisa concepto y nota de finanzas y segmentos', () => {
    const c = contenidoCon(
      reg('empresas', 'ancap', {
        finanzas: [
          {
            anio: 2020,
            nota: 'Primera oración. Segunda oración de más.',
            resultado_ejercicio: { pesos: 100, concepto: 'Aportes a Rentas Generales. Con una segunda oración.' },
            segmentos: [{ nombre: 'refinación', resultado: { pesos: 10, concepto: 'Bien.' }, nota: 'Nota corta y sola.' }],
          },
        ],
      }),
    );
    const r = validarPresentacion(c);
    expect(r.avisos.some((a) => a.campo === 'finanzas.0.nota')).toBe(true);
    expect(r.avisos.some((a) => a.campo === 'finanzas.0.resultado_ejercicio.concepto')).toBe(true);
    expect(r.avisos.some((a) => a.campo === 'finanzas.0.segmentos.0.nota')).toBe(false);
  });
});

describe('validarPresentacion: gráficos', () => {
  it('pasa con series de fuentes distintas y limpias', () => {
    const c = contenidoCon(
      reg('chequeos', 'lacalle-pou/x', {
        grafico: { nota: 'Datos oficiales del BCU.', series: [{ fuente: 'INE, 2020' }, { fuente: 'BCU, 2021' }] },
      }),
    );
    const r = validarPresentacion(c);
    expect(r.avisos.filter((a) => a.campo.includes('grafico'))).toEqual([]);
  });

  it('avisa si dos series repiten la misma fuente', () => {
    const c = contenidoCon(
      reg('chequeos', 'lacalle-pou/x', {
        grafico: { series: [{ fuente: 'INE, 2020' }, { fuente: 'INE, 2020' }] },
      }),
    );
    const r = validarPresentacion(c);
    expect(r.avisos.some((a) => a.campo === 'grafico.series' && a.mensaje.includes('se repite en 2 series'))).toBe(true);
  });

  it('avisa si la nota o la fuente tienen ";;" o ".."', () => {
    const c = contenidoCon(
      reg('chequeos', 'lacalle-pou/x', {
        grafico: { nota: 'Fuente A;;Fuente B', series: [{ fuente: 'INE, 2020..2021' }] },
      }),
    );
    const r = validarPresentacion(c);
    expect(r.avisos.some((a) => a.campo === 'grafico.nota' && a.mensaje.includes('concatenación'))).toBe(true);
    expect(r.avisos.some((a) => a.campo === 'grafico.series.0.fuente' && a.mensaje.includes('concatenación'))).toBe(true);
  });
});

describe('validarPresentacion: narración de proceso', () => {
  it('pasa cuando el texto no menciona el proceso', () => {
    const c = contenidoCon(reg('correcciones', '2020-01-01-x', { motivo: 'Se agregó una segunda fuente que ya existía públicamente.' }));
    const r = validarPresentacion(c);
    expect(r.avisos.filter((a) => a.campo === 'motivo')).toEqual([]);
  });

  it('avisa si menciona la corrida, el inbox o un rol del pipeline', () => {
    const c = contenidoCon(reg('correcciones', '2020-01-01-x', { motivo: 'Esto se resolvió en esta corrida, sin cambiar el dato factual.' }));
    const r = validarPresentacion(c);
    expect(r.avisos.some((a) => a.campo === 'motivo' && a.mensaje.includes('Narración de proceso'))).toBe(true);
  });

  it('revisa también fundamentacion, cobertura.texto y texto de un argumento', () => {
    const c = contenidoCon(
      reg('promesas', 'lacalle-pou/x', { fundamentacion: 'Todavía no hubo una suba efectiva de impuestos.' }),
      reg('promesas', 'lacalle-pou/y', { fundamentacion: 'Se revisó de nuevo en la vuelta 2 del editor.' }),
      reg('politicos', 'mujica', { nombre_corto: 'Mujica', cobertura: { texto: 'pnpm fuente no encontró más cobertura.' } }),
      reg('empresas', 'ancap', { monopolio: { argumentos_a_favor: [{ texto: 'Según notas.md el negocio se sostiene solo.' }] } }),
    );
    const r = validarPresentacion(c);
    expect(r.avisos.some((a) => a.campo === 'fundamentacion' && a.archivo.includes('/y.yaml'))).toBe(true);
    expect(r.avisos.some((a) => a.campo === 'cobertura.texto')).toBe(true);
    expect(r.avisos.some((a) => a.campo.includes('argumentos_a_favor'))).toBe(true);
  });
});

describe('validarPresentacion: serie sin gráfico', () => {
  it('avisa con tres o más cifras con año en dato_real.valor y sin grafico', () => {
    const c = contenidoCon(
      reg('chequeos', 'lacalle-pou/x', {
        dato_real: { valor: 'La cifra fue 39,2 en 2019. Bajó a -12,1 en 2020. Y a 8,4 en 2021.' },
      }),
    );
    const r = validarPresentacion(c);
    expect(r.avisos.some((a) => a.campo === 'dato_real.valor' && a.mensaje.includes('serie sin gráfico'))).toBe(true);
  });

  it('no avisa si ya hay un grafico', () => {
    const c = contenidoCon(
      reg('chequeos', 'lacalle-pou/x', {
        dato_real: { valor: 'La cifra fue 39,2 en 2019. Bajó a -12,1 en 2020. Y a 8,4 en 2021.' },
        grafico: { series: [{ fuente: 'BCU, 2021' }] },
      }),
    );
    const r = validarPresentacion(c);
    expect(r.avisos.some((a) => a.mensaje.includes('serie sin gráfico'))).toBe(false);
  });

  it('sigue siendo aviso incluso en --inbox y con --estricto (nunca error)', () => {
    const datos = { dato_real: { valor: 'Fue 1 en 2019. Fue 2 en 2020. Fue 3 en 2021.' } };
    const c = contenidoCon(reg('chequeos', 'lacalle-pou/x', datos, { enInbox: true }));
    const r = validarPresentacion(c, { modoInbox: true, estricto: true });
    expect(r.avisos.some((a) => a.mensaje.includes('serie sin gráfico'))).toBe(true);
    expect(r.errores.some((e) => e.mensaje.includes('serie sin gráfico'))).toBe(false);
  });
});

describe('validarPresentacion: severidad content/ vs --inbox y --estricto', () => {
  it('en content/ (sin --estricto) un defecto es aviso, no error', () => {
    const c = contenidoCon(reg('chequeos', 'lacalle-pou/x', { politico: 'lacalle-pou', titulo: 'Corto' }));
    const r = validarPresentacion(c);
    expect(r.errores).toEqual([]);
    expect(r.avisos.length).toBeGreaterThan(0);
  });

  it('en content/ con --estricto, el mismo defecto es error', () => {
    const c = contenidoCon(reg('chequeos', 'lacalle-pou/x', { politico: 'lacalle-pou', titulo: 'Corto' }));
    const r = validarPresentacion(c, { estricto: true });
    expect(r.avisos).toEqual([]);
    expect(r.errores.length).toBeGreaterThan(0);
  });

  it('en --inbox, un registro de la corrida con el mismo defecto es siempre error', () => {
    const c = contenidoCon(reg('chequeos', 'lacalle-pou/x', { politico: 'lacalle-pou', titulo: 'Corto' }, { enInbox: true }));
    const r = validarPresentacion(c, { modoInbox: true });
    expect(r.avisos).toEqual([]);
    expect(r.errores.length).toBeGreaterThan(0);
  });

  it('en --inbox, un registro de content/ que no es parte de la corrida no se revisa', () => {
    const c = contenidoCon(reg('chequeos', 'lacalle-pou/x', { politico: 'lacalle-pou', titulo: 'Corto' }, { enInbox: false }));
    const r = validarPresentacion(c, { modoInbox: true });
    expect(r.errores).toEqual([]);
    expect(r.avisos).toEqual([]);
  });
});
