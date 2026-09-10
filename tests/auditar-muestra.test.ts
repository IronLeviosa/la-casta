/**
 * Verificación `muestra` (`pnpm auditar --muestra`): reemplaza la aprobación humana registro por
 * registro (retirada el 2026-09-09) por un muestreo aleatorio continuo de citas, con semilla
 * publicada. Acá se prueban, sin red: la selección determinista (misma semilla → misma muestra;
 * semillas distintas → muestra distinta) y la clasificación en las cuatro categorías de la
 * verificación 6 de `.claude/commands/auditar.md`, con textos de fixture.
 */
import { afterAll, describe, expect, it } from 'vitest';
import {
  clasificarFuenteMuestra,
  elegirMuestraDeCitas,
  primeraFuenteConCita,
  semillaDelDia,
  semillaNumericaDe,
  type ClasificacionMuestra,
} from '../scripts/auditar.ts';
import { cargarContenido, type FuenteMinima } from '../scripts/lib/contenido.ts';
import type { ObtenerTexto, ObtenerTranscripcion, TranscripcionMinima } from '../scripts/validadores/citas.ts';
import { limpiarFixtures, prepararFixture } from './ayuda.ts';

afterAll(limpiarFixtures);

function fuente(cita: string, extra: Partial<FuenteMinima> = {}): FuenteMinima {
  return { url: 'https://ejemplo.uy/nota', medio: 'ejemplo', fecha: '2020-01-01', tipo: 'nota', cita, ...extra };
}

/** `obtenerTexto` sintético para el paso "corpus": `null` simula que no está cacheada. */
function corpusCon(texto: string | null): ObtenerTexto {
  return async () => {
    if (texto === null) throw new Error('no está en el corpus local.');
    return { texto, tipo: 'html' };
  };
}

/** `obtenerTexto` sintético para el paso "red": un `Error` simula que no se pudo bajar. */
function redCon(resultado: string | Error): ObtenerTexto {
  return async () => {
    if (resultado instanceof Error) throw resultado;
    return { texto: resultado, tipo: 'html' };
  };
}

const sinTranscripcion: ObtenerTranscripcion = () => null;

describe('elegirMuestraDeCitas: selección determinista', () => {
  it('con la misma semilla numérica, la misma muestra (mismo orden)', () => {
    const raiz = prepararFixture();
    const contenido = cargarContenido(raiz);
    const a = elegirMuestraDeCitas(contenido, 6, 1);
    const b = elegirMuestraDeCitas(contenido, 6, 1);
    expect(a.map((x) => x.registro.archivo)).toEqual(b.map((x) => x.registro.archivo));
  });

  it('con semillas distintas, una muestra (orden) distinta', () => {
    const raiz = prepararFixture();
    const contenido = cargarContenido(raiz);
    // Semillas 1 y 2 verificadas contra el mismo generador/mezclador: producen órdenes distintos.
    const a = elegirMuestraDeCitas(contenido, 6, 1);
    const b = elegirMuestraDeCitas(contenido, 6, 2);
    expect(a.map((x) => x.registro.archivo)).not.toEqual(b.map((x) => x.registro.archivo));
  });

  it('solo toma registros publicados con una fuente citable', () => {
    const raiz = prepararFixture();
    const contenido = cargarContenido(raiz);
    const elegidos = elegirMuestraDeCitas(contenido, 100, 1);
    expect(elegidos.length).toBeGreaterThan(0);
    for (const { registro, fuente: f } of elegidos) {
      expect(registro.datos.revision?.tier).toBe('publicado');
      expect(f.cita?.trim()).toBeTruthy();
      expect(f.verificacion).not.toBe('manual');
    }
  });

  it('respeta el tamaño pedido (nunca más de lo que hay)', () => {
    const raiz = prepararFixture();
    const contenido = cargarContenido(raiz);
    expect(elegirMuestraDeCitas(contenido, 2, 1)).toHaveLength(2);
    const total = elegirMuestraDeCitas(contenido, 1000, 1).length;
    expect(elegirMuestraDeCitas(contenido, 1000, 2)).toHaveLength(total);
  });
});

describe('semillaNumericaDe / semillaDelDia', () => {
  it('un número pasa tal cual', () => {
    expect(semillaNumericaDe(42)).toBe(42);
  });

  it('un texto numérico se interpreta como número', () => {
    expect(semillaNumericaDe('42')).toBe(42);
  });

  it('la misma fecha (u otro texto) siempre da la misma semilla numérica', () => {
    expect(semillaNumericaDe('2026-09-10')).toBe(semillaNumericaDe('2026-09-10'));
  });

  it('fechas distintas dan semillas numéricas distintas', () => {
    expect(semillaNumericaDe('2026-09-10')).not.toBe(semillaNumericaDe('2026-09-11'));
  });

  it('semillaDelDia da la fecha de hoy en formato YYYY-MM-DD (UTC)', () => {
    expect(semillaDelDia(new Date('2026-09-10T23:00:00Z'))).toBe('2026-09-10');
  });
});

describe('primeraFuenteConCita', () => {
  it('ignora las fuentes marcadas verificacion: manual', () => {
    const datos = {
      evidencia: {
        fuentes: [
          { url: 'https://a', medio: 'a', fecha: '2020-01-01', tipo: 'nota', cita: 'x', verificacion: 'manual' },
          { url: 'https://b', medio: 'b', fecha: '2020-01-01', tipo: 'nota', cita: 'y' },
        ],
      },
    };
    expect(primeraFuenteConCita(datos)?.url).toBe('https://b');
  });

  it('devuelve null si no hay ninguna fuente citable', () => {
    const datos = { evidencia: { fuentes: [{ url: 'https://a', medio: 'a', fecha: '2020-01-01', tipo: 'nota', cita: '', verificacion: 'manual' }] } };
    expect(primeraFuenteConCita(datos)).toBeNull();
  });
});

describe('clasificarFuenteMuestra: las cuatro categorías de la verificación 6, sin red', () => {
  const CITA = 'El presidente admitió que la situación obliga a revisar la carga tributaria este año.';

  it('cita exacta en el corpus local: no hace falta ir a la red', async () => {
    let llamadaRed = false;
    const obtenerTextoRed: ObtenerTexto = async () => {
      llamadaRed = true;
      return { texto: '', tipo: 'html' };
    };
    const r = await clasificarFuenteMuestra(fuente(CITA), {
      obtenerTextoCorpus: corpusCon(`Título de la nota.\n\nPrimer párrafo. ${CITA} Y sigue la nota.`),
      obtenerTextoRed,
      obtenerTranscripcion: sinTranscripcion,
    });
    expect(r).toEqual<ClasificacionMuestra>({ resultado: 'encontrada', origen: 'corpus' });
    expect(llamadaRed).toBe(false);
  });

  it('cita con diferencias menores en el corpus: "encontrada con diferencias menores", sin ir a la red', async () => {
    let llamadaRed = false;
    const obtenerTextoRed: ObtenerTexto = async () => {
      llamadaRed = true;
      return { texto: '', tipo: 'html' };
    };
    const casiIgual = CITA.replace('admitió', 'reconoció');
    const r = await clasificarFuenteMuestra(fuente(CITA), {
      obtenerTextoCorpus: corpusCon(`Título de la nota.\n\n${casiIgual} Y sigue la nota.`),
      obtenerTextoRed,
      obtenerTranscripcion: sinTranscripcion,
    });
    expect(r.resultado).toBe('encontrada con diferencias menores');
    expect(r.origen).toBe('corpus');
    expect(r.diferencias).toContain('reconoció');
    expect(llamadaRed).toBe(false);
  });

  it('no está en el corpus, pero sí en la red: "encontrada" (origen red)', async () => {
    const r = await clasificarFuenteMuestra(fuente(CITA), {
      obtenerTextoCorpus: corpusCon(null),
      obtenerTextoRed: redCon(`Título.\n\n${CITA} Y sigue la nota.`),
      obtenerTranscripcion: sinTranscripcion,
    });
    expect(r).toEqual<ClasificacionMuestra>({ resultado: 'encontrada', origen: 'red' });
  });

  it('no está en el corpus y la red no responde (sin archived_url): "fuente caída sin archivo"', async () => {
    const r = await clasificarFuenteMuestra(fuente(CITA), {
      obtenerTextoCorpus: corpusCon(null),
      obtenerTextoRed: redCon(new Error('HTTP 404 al pedir https://ejemplo.uy/nota')),
      obtenerTranscripcion: sinTranscripcion,
    });
    expect(r.resultado).toBe('fuente caída sin archivo');
    expect(r.origen).toBe('red');
  });

  it('la cita no está ni en el corpus ni en la red: "no encontrada"', async () => {
    const r = await clasificarFuenteMuestra(fuente(CITA), {
      obtenerTextoCorpus: corpusCon('Un texto que no tiene absolutamente nada que ver con la cita buscada.'),
      obtenerTextoRed: redCon('Otro texto completamente distinto, sin relación con la cita buscada tampoco.'),
      obtenerTranscripcion: sinTranscripcion,
    });
    expect(r.resultado).toBe('no encontrada');
  });

  it('el corpus no coincide y la red no se puede bajar: se queda con el veredicto del corpus ("no encontrada")', async () => {
    const r = await clasificarFuenteMuestra(fuente(CITA), {
      obtenerTextoCorpus: corpusCon('Un texto que no tiene absolutamente nada que ver con la cita buscada.'),
      obtenerTextoRed: redCon(new Error('HTTP 500 al pedir https://ejemplo.uy/nota')),
      obtenerTranscripcion: sinTranscripcion,
    });
    expect(r.resultado).toBe('no encontrada');
    expect(r.origen).toBe('corpus');
  });

  it('el corpus no coincide pero una copia fresca de la red sí: la red puede revertir el veredicto', async () => {
    const r = await clasificarFuenteMuestra(fuente(CITA), {
      obtenerTextoCorpus: corpusCon('El texto guardado en el corpus quedó viejo y no dice nada de esto.'),
      obtenerTextoRed: redCon(`Título.\n\n${CITA} Y sigue la nota.`),
      obtenerTranscripcion: sinTranscripcion,
    });
    expect(r.resultado).toBe('encontrada');
    expect(r.origen).toBe('red');
  });

  it('fuente de video: busca en la transcripción del corpus con la misma ventana que el validador de red', async () => {
    const citaVideo = 'No vamos a subir los impuestos, ni ahora ni en los cinco años de gobierno.';
    const transcripcion: TranscripcionMinima = {
      duracion: 1300,
      segmentos: [
        { inicio: 0, fin: 300, texto: 'Buenas noches, gracias por la invitación.' },
        { inicio: 740, fin: 760, texto: citaVideo },
        { inicio: 1200, fin: 1230, texto: 'Muchas gracias y hasta la próxima semana.' },
      ],
      texto: '',
    };
    const f = fuente(citaVideo, { url: 'https://www.youtube.com/watch?v=x', tipo: 'video', marca_tiempo: '12:30' });
    const r = await clasificarFuenteMuestra(f, {
      obtenerTextoCorpus: async () => ({ texto: '', tipo: 'video', transcripcion: 'transcripcion-x' }),
      obtenerTextoRed: async () => {
        throw new Error('no debería llamarse: la transcripción del corpus ya la encontró');
      },
      obtenerTranscripcion: () => transcripcion,
    });
    expect(r).toEqual<ClasificacionMuestra>({ resultado: 'encontrada', origen: 'corpus' });
  });
});
