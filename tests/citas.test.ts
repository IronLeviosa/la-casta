/**
 * Etapa 5 (citas) con el acceso a la red simulado.
 *
 * Es el bucle anti-alucinación: si la cita que escribió el agente no aparece en
 * el texto de la fuente, el registro no se publica. Acá se comprueban los cuatro
 * caminos: cita exacta, cita aproximada (aviso), cita inventada (error) y fuente
 * que no se puede descargar (exige `verificacion: manual`).
 */
import { afterAll, describe, expect, it } from 'vitest';
import { validar } from '../scripts/validar.ts';
import { validarCitas, type ObtenerTexto, type ObtenerTranscripcion, type TranscripcionMinima } from '../scripts/validadores/citas.ts';
import { cargarContenido } from '../scripts/lib/contenido.ts';
import { limpiarFixtures, prepararFixture } from './ayuda.ts';

afterAll(limpiarFixtures);

const URL_VIDEO = 'https://www.youtube.com/watch?v=fixture0001';
const URL_EL_PAIS = 'https://www.elpais.com.uy/fixture/suba-de-iva';

/** Transcripción sintética: la cita del video cae en el segundo 750 (marca_tiempo 12:30). */
function transcripcionCon(cita: string): TranscripcionMinima {
  const segmentos = [
    { inicio: 0, fin: 300, texto: 'Buenas noches, gracias por la invitación a este programa.' },
    { inicio: 740, fin: 760, texto: cita },
    { inicio: 1200, fin: 1230, texto: 'Muchas gracias y hasta la próxima semana.' },
  ];
  return { duracion: 1300, segmentos, texto: segmentos.map((s) => s.texto).join(' ') };
}

/**
 * Devuelve un `obtenerTexto` que arma el cuerpo de cada fuente alrededor de su
 * propia cita. `alterar` permite romper una URL puntual.
 */
function textoSimulado(alterar: (url: string, cita: string) => string | null = () => null): ObtenerTexto {
  return async (fuente) => {
    const alterada = alterar(fuente.url, fuente.cita);
    if (alterada === 'NO_DESCARGABLE') throw new Error(`HTTP 403 al pedir ${fuente.url}`);
    const cuerpo = alterada ?? fuente.cita;
    if (fuente.url === URL_VIDEO) return { texto: '', transcripcion: 'transcripcion-fixture', tipo: 'video' };
    return { texto: `Título de la nota.\n\nPrimer párrafo de contexto. ${cuerpo} Y sigue la nota con más párrafos.`, tipo: 'html' };
  };
}

function transcripcionSimulada(cita: string): ObtenerTranscripcion {
  return () => transcripcionCon(cita);
}

const CITA_VIDEO = 'No vamos a subir los impuestos, ni ahora ni en los cinco años de gobierno.';

describe('etapa citas', () => {
  it('pasa cuando cada cita aparece literal en su fuente', async () => {
    const raiz = prepararFixture();
    const contenido = cargarContenido(raiz);
    const r = await validarCitas(contenido, {
      sinCache: true,
      obtenerTexto: textoSimulado(),
      obtenerTranscripcion: transcripcionSimulada(CITA_VIDEO),
    });
    expect(r.errores).toEqual([]);
    expect(r.avisos).toEqual([]);
    expect(r.exactas).toBe(r.verificadas);
    expect(r.verificadas).toBeGreaterThan(0);
  });

  it('falla la etapa citas cuando la cita no está en la fuente', async () => {
    const raiz = prepararFixture();
    const r = await validar({
      rootDir: raiz,
      red: true,
      escribirSimetria: false,
      // La etapa de fuentes no toca la red: se le inyecta un verificador que dice "todo ok".
      verificarUrl: async () => ({ http: 200, archived_url: null }),
      ledgerPath: `${raiz}/data/fuentes-ledger.json`,
      citas: {
        sinCache: true,
        obtenerTexto: textoSimulado((url) => (url === URL_EL_PAIS ? 'Acá el diario dice algo completamente distinto de lo que afirma el registro.' : null)),
        obtenerTranscripcion: transcripcionSimulada(CITA_VIDEO),
      },
    });

    expect(r.codigo).toBe(1);
    const fallada = r.etapas.find((e) => !e.omitida && !e.ok);
    expect(fallada?.etapa).toBe('citas');
    expect(r.errores.map((e) => e.mensaje).join('\n')).toContain('Cita no encontrada en la fuente');
    expect(r.errores.every((e) => e.campo.endsWith('.cita'))).toBe(true);
  });

  it('avisa (sin fallar) cuando la cita es aproximada', async () => {
    const raiz = prepararFixture();
    const contenido = cargarContenido(raiz);
    const r = await validarCitas(contenido, {
      sinCache: true,
      // Un par de palabras cambiadas: similitud alta, pero no es una cita literal.
      obtenerTexto: textoSimulado((url, cita) => (url === URL_EL_PAIS ? cita.replace('admitió', 'reconoció') : null)),
      obtenerTranscripcion: transcripcionSimulada(CITA_VIDEO),
    });
    expect(r.errores).toEqual([]);
    expect(r.avisos.map((a) => a.mensaje).join('\n')).toContain('Cita aproximada');
    expect(r.aproximadas).toBe(1);
  });

  it('encuentra la cita de un video en la transcripción, en la ventana de la marca de tiempo', async () => {
    const raiz = prepararFixture();
    const contenido = cargarContenido(raiz);
    const r = await validarCitas(contenido, {
      sinCache: true,
      obtenerTexto: textoSimulado(),
      // El ASR se come una coma y cambia una palabra: sigue por encima del umbral 0.85.
      obtenerTranscripcion: transcripcionSimulada('No vamos a subir los impuestos ni ahora ni en los cinco anios de gobierno.'),
    });
    expect(r.errores).toEqual([]);
    expect(r.avisos.filter((a) => a.archivo.includes('2019-10-15')).length).toBeGreaterThan(0);
  });

  it('exige verificacion: manual cuando la fuente no se puede descargar', async () => {
    const raiz = prepararFixture();
    const contenido = cargarContenido(raiz);
    const r = await validarCitas(contenido, {
      sinCache: true,
      obtenerTexto: textoSimulado((url) => (url === URL_EL_PAIS ? 'NO_DESCARGABLE' : null)),
      obtenerTranscripcion: transcripcionSimulada(CITA_VIDEO),
    });
    const mensajes = r.errores.map((e) => e.mensaje).join('\n');
    expect(mensajes).toContain('No se pudo descargar la fuente');
    expect(mensajes).toContain('verificacion: manual');
    expect(r.errores.every((e) => e.campo.endsWith('.verificacion'))).toBe(true);
  });

  it('no vuelve a descargar lo que ya está en la caché', async () => {
    const raiz = prepararFixture();
    const contenido = cargarContenido(raiz);
    let descargas = 0;
    const contando: ObtenerTexto = async (f) => {
      descargas++;
      return textoSimulado()(f);
    };
    const opciones = { cacheDir: `${raiz}/.cache`, obtenerTexto: contando, obtenerTranscripcion: transcripcionSimulada(CITA_VIDEO) };
    const primera = await validarCitas(contenido, opciones);
    const deLaPrimera = descargas;
    const segunda = await validarCitas(contenido, opciones);
    expect(deLaPrimera).toBe(primera.verificadas);
    expect(descargas).toBe(deLaPrimera); // la segunda no bajó nada
    expect(segunda.desdeCache).toBe(segunda.verificadas);
  });
});
