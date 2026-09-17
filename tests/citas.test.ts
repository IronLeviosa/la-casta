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
import { cargarContenido, construirContenido, type Contenido, type FuenteMinima, type Registro } from '../scripts/lib/contenido.ts';
import { limpiarFixtures, prepararFixture } from './ayuda.ts';
import { buscarCita, normalizar } from '../scripts/lib/texto.ts';

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

/**
 * `pareceArmazonJs` (scripts/corpus/fuente.ts) es un heurístico con falsos positivos: 194 de 280
 * fuentes de parlamento.gub.uy que lo disparaban el 2026-09-16 sí tenían la cita en el texto corto
 * ya guardado. `obtenerNota` ya no tira por esto (tests/fuente-armazon-js.test.ts); acá se prueba
 * el otro lado, que es el que de verdad decide qué se publica: la marca que deja la nota
 * (`armazon_js`, propagada por `obtenerTextoDelCorpus` como `TextoFuente.armazonJs`) solo cambia
 * el *mensaje* de `validarCitas` cuando la cita de verdad no aparece; nunca lo crea.
 *
 * Un `Contenido` armado a mano (sin fixture en disco) alcanza: `validarCitas` solo mira
 * `contenido.registros[].datos` con `recorrerFuentes`.
 */
describe('etapa citas: la marca de armazón JS solo explica el mensaje', () => {
  const URL_ARMAZON = 'https://parlamento.gub.uy/fixture/legislador-armazon';

  function contenidoConFuente(fuente: FuenteMinima): Contenido {
    return {
      rootDir: '(no usado)',
      registros: [
        {
          coleccion: 'declaraciones',
          id: 'fixture/armazon-js',
          archivo: 'content/declaraciones/fixture/armazon-js.yaml',
          datos: { evidencia: { nivel: 'reportado', fuentes: [fuente] } },
          crudo: {},
          enInbox: false,
        },
      ],
      errores: [],
      archivos: 1,
      obtener: () => undefined,
      de: () => [],
    } as unknown as Contenido;
  }

  const CITA = 'Representante Nacional por el Lema PARTIDO FRENTE AMPLIO - Legislatura XLIX';
  const fuente: FuenteMinima = { url: URL_ARMAZON, medio: 'parlamento', fecha: '2020-01-01', tipo: 'nota', cita: CITA };

  it('no falla cuando la fuente parece armazón JS pero la cita sí está en el texto corto', async () => {
    const obtenerTexto: ObtenerTexto = async () => ({ texto: CITA, armazonJs: true, armazonJsDetalle: 'texto extraído de 123 caracteres, 4 scripts' });
    const r = await validarCitas(contenidoConFuente(fuente), { sinCache: true, obtenerTexto, obtenerTranscripcion: () => null });
    expect(r.errores).toEqual([]);
    expect(r.exactas).toBe(1);
  });

  it('cuando la cita no está y la fuente parece armazón JS, el error explica el JavaScript en vez de "cita no encontrada" a secas', async () => {
    const obtenerTexto: ObtenerTexto = async () => ({ texto: 'Cargando…', armazonJs: true, armazonJsDetalle: 'texto extraído de 9 caracteres, 4 scripts' });
    const r = await validarCitas(contenidoConFuente(fuente), { sinCache: true, obtenerTexto, obtenerTranscripcion: () => null });
    const mensajes = r.errores.map((e) => e.mensaje).join('\n');
    expect(mensajes).toContain('parece armarse con JavaScript');
    expect(mensajes).toContain('texto extraído de 9 caracteres, 4 scripts');
    expect(mensajes).not.toContain('Lo más parecido que hay es');
  });

  it('sin la marca de armazón JS, "cita no encontrada" sigue con el mensaje de siempre', async () => {
    const obtenerTexto: ObtenerTexto = async () => ({ texto: 'Un texto cualquiera que no trae la cita.' });
    const r = await validarCitas(contenidoConFuente(fuente), { sinCache: true, obtenerTexto, obtenerTranscripcion: () => null });
    const mensajes = r.errores.map((e) => e.mensaje).join('\n');
    expect(mensajes).toContain('Cita no encontrada en la fuente');
    expect(mensajes).not.toContain('JavaScript');
  });
});

/**
 * Modo corrección ("no peor que lo publicado", mismo criterio que `presentacion`): una corrección
 * de presentación que no toca evidencia no tiene por qué pagar de nuevo una cita que ya fallaba en
 * lo publicado (caso real del 2026-09-16: cinco citas contra páginas armadas con JavaScript que ya
 * fallaban en medios/augpee, politicos/silva-robert y empresas/antel cortaron `--red` sobre un lote
 * que no había tocado esa evidencia). Un `Contenido` a mano (sin fixture en disco ni red real)
 * alcanza, con el mismo patrón que el bloque de armazón JS de arriba.
 */
describe('etapa citas: modo corrección ("no peor que lo publicado")', () => {
  const URL_HEREDADO = 'https://ejemplo.uy/nota-heredada';
  const URL_NUEVO = 'https://ejemplo.uy/nota-nueva';
  const CITA_HEREDADA = 'Esta cita ya fallaba antes de la corrección y sigue exactamente igual.';
  const CITA_PUBLICADA_NUEVO = 'Esta es la cita que estaba publicada, sin que la corrección la toque.';
  const CITA_CAMBIADA = 'Esta es la cita nueva que trajo la corrección y tampoco aparece en la fuente.';

  function fuenteDePrueba(url: string, cita: string): FuenteMinima {
    return { url, cita, medio: 'ejemplo', fecha: '2020-01-01', tipo: 'nota' };
  }

  function registroDeclaracion(id: string, enInbox: boolean, url: string, cita: string): Registro {
    return {
      coleccion: 'declaraciones',
      id,
      archivo: enInbox ? `inbox/declaraciones.yaml#${id}` : `content/declaraciones/${id}.yaml`,
      datos: { revision: { tier: 'publicado' }, evidencia: { nivel: 'reportado', fuentes: [fuenteDePrueba(url, cita)] } },
      crudo: {},
      enInbox,
    };
  }

  function registroCorreccion(afecta: string[]): Registro {
    return {
      coleccion: 'correcciones',
      id: '2026-09-16-test-no-peor-que-publicado',
      archivo: 'inbox/correcciones.yaml#0',
      datos: { afecta },
      crudo: {},
      enInbox: true,
    };
  }

  /** El lote de corrección: dos ids en afecta[], uno con la fuente sin cambios y otro con la cita
   *  cambiada por la propia corrección (no debería pasar según docs/plan-deuda-presentacion.md,
   *  pero el validador tiene que seguir cortando si pasa). */
  const idHeredado = 'lacalle-pou/2020-01-01-heredado';
  const idNuevo = 'lacalle-pou/2020-01-01-nuevo';

  function contenidoDeCorreccion(conCorreccion: boolean): Contenido {
    const registros: Registro[] = [
      registroDeclaracion(idHeredado, false, URL_HEREDADO, CITA_HEREDADA), // publicado
      registroDeclaracion(idHeredado, true, URL_HEREDADO, CITA_HEREDADA), // copia del lote, sin cambios
      registroDeclaracion(idNuevo, false, URL_NUEVO, CITA_PUBLICADA_NUEVO), // publicado
      registroDeclaracion(idNuevo, true, URL_NUEVO, CITA_CAMBIADA), // el lote cambió la cita
    ];
    if (conCorreccion) registros.push(registroCorreccion([`declaraciones/${idHeredado}`, `declaraciones/${idNuevo}`]));
    return construirContenido('/repo-de-prueba', registros, [], registros.length);
  }

  const obtenerTextoQueNuncaEncuentra: ObtenerTexto = async () => ({ texto: 'Un texto cualquiera, sin ninguna de las citas que se buscan.', tipo: 'html' });

  it('una cita que ya fallaba en lo publicado pasa a aviso; una cita nueva o cambiada sigue cortando', async () => {
    const r = await validarCitas(contenidoDeCorreccion(true), {
      modoInbox: true,
      correccion: true,
      sinCache: true,
      obtenerTexto: obtenerTextoQueNuncaEncuentra,
      obtenerTranscripcion: () => null,
    });

    expect(r.errores.some((e) => e.archivo.includes('nuevo') && e.mensaje.includes('Cita no encontrada'))).toBe(true);
    expect(r.errores.some((e) => e.archivo.includes('heredado'))).toBe(false);
    expect(r.avisos.some((a) => a.archivo.includes('heredado') && a.mensaje.includes('ya fallaba así en lo publicado'))).toBe(true);
    expect(r.heredados).toBe(1);
  });

  it('sin ningún registro de corrección en el lote, la misma cita heredada corta igual que cualquier otra', async () => {
    const r = await validarCitas(contenidoDeCorreccion(false), {
      modoInbox: true,
      sinCache: true,
      obtenerTexto: obtenerTextoQueNuncaEncuentra,
      obtenerTranscripcion: () => null,
    });

    expect(r.heredados).toBe(0);
    expect(r.errores.some((e) => e.archivo.includes('heredado'))).toBe(true);
    expect(r.avisos.some((a) => a.mensaje.includes('ya fallaba así en lo publicado'))).toBe(false);
  });
});

describe('palabras cortadas por el salto de linea de un PDF', () => {
  // Al extraer un PDF, una palabra partida al final de la linea vuelve como "vota- cion".
  // La cita publicada dice "votacion", y la verificacion fallaba por un guion que nunca
  // estuvo en el texto original. Paso con dos diarios de sesion de la Asamblea General.
  it('encuentra la cita aunque el PDF haya partido la palabra', () => {
    const pdf = 'Han votado ochenta y dos senores Representantes: cincuenta y cinco lo han hecho por la vota- cion afirmativa';
    expect(buscarCita(pdf, 'por la votacion afirmativa').exacta).toBe(true);
  });

  it('no toca un guion que separa palabras enteras', () => {
    expect(normalizar('el veto - dijo - fue levantado')).toBe('el veto - dijo - fue levantado');
  });

  it('no toca un rango de numeros', () => {
    expect(normalizar('articulos 7 - 20 del proyecto')).toBe('articulos 7 - 20 del proyecto');
  });

  it('un caso raro se normaliza igual de los dos lados, que es lo que importa', () => {
    // La regla es agresiva y une tambien "Ejecutivo- Asamblea". Eso no rompe nada: la misma
    // normalizacion se aplica a la cita y al texto de la fuente, asi que siguen coincidiendo.
    const fuente = 'lo resolvio el Poder Ejecutivo- Asamblea General en la sesion';
    expect(buscarCita(fuente, 'Poder Ejecutivo- Asamblea General').exacta).toBe(true);
    expect(buscarCita(fuente, 'Poder EjecutivoAsamblea General').exacta).toBe(true);
  });

  it('el mapa sigue apuntando al texto original despues de unir', () => {
    const pdf = 'el levan- tamiento de las observaciones';
    const r = buscarCita(pdf, 'levantamiento de las observaciones');
    expect(r.exacta).toBe(true);
    expect(pdf.slice(r.posicion, r.fin)).toContain('levan');
  });
});
