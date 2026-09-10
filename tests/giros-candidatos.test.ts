/**
 * `pnpm giros:candidatos` (plan 2026-09, fase 4, ítem 4.1).
 *
 * Fixture de cuatro declaraciones de una sola persona: A y B deberían emparejarse alto (mismo
 * tema, 60+ días, una promete con negación y la otra no, y el contexto pasa de campaña a
 * gobierno); C es de otro tema (no debería aparecer en ningún par); D está a 19 días de B (par
 * B-D descartado por fecha), pero lejos de A (par A-D válido, con menos solapamiento que A-B).
 *
 * Lo que se verifica: el orden por puntaje, que un par ya publicado como giro se descarta, y que
 * el puntaje no cambia si se cambia el político o se le agrega un campo `partido` al fixture — el
 * puntaje es texto contra texto, nunca depende de quién lo dijo.
 */
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { stringify as aYaml } from 'yaml';
import { girosCandidatos, mismoTemaOPadre } from '../scripts/giros-candidatos.ts';

const temporales: string[] = [];
afterAll(() => {
  for (const d of temporales.splice(0)) rmSync(d, { recursive: true, force: true });
});

interface DeclFixture {
  archivo: string;
  tema: string;
  fecha: string;
  contexto: string;
  cita: string;
  resumen: string;
  titulo?: string;
}

/** Crea un `content/declaraciones/<politico>/` (y opcionalmente `content/giros/<politico>/`) temporal. */
function crearFixture(
  politico: string,
  declaraciones: DeclFixture[],
  camposExtra: Record<string, unknown> = {},
  giros: { antes: string; despues: string }[] = [],
): string {
  const raiz = mkdtempSync(path.join(tmpdir(), 'giros-candidatos-'));
  temporales.push(raiz);
  const dirDecl = path.join(raiz, 'content', 'declaraciones', politico);
  mkdirSync(dirDecl, { recursive: true });
  for (const d of declaraciones) {
    const crudo = {
      politico,
      tema: d.tema,
      fecha: d.fecha,
      contexto: d.contexto,
      cita: d.cita,
      resumen: d.resumen,
      ...(d.titulo ? { titulo: d.titulo } : {}),
      ...camposExtra,
    };
    writeFileSync(path.join(dirDecl, d.archivo), aYaml(crudo));
  }
  if (giros.length) {
    const dirGiros = path.join(raiz, 'content', 'giros', politico);
    mkdirSync(dirGiros, { recursive: true });
    giros.forEach((g, i) => {
      writeFileSync(
        path.join(dirGiros, `giro-${i}.yaml`),
        aYaml({ politico, tema: 'economia/impuestos', declaracion_antes: g.antes, declaracion_despues: g.despues }),
      );
    });
  }
  return raiz;
}

const DECLARACIONES_BASE: DeclFixture[] = [
  // A: campaña, promete con negación.
  {
    archivo: '2019-01-01-no-subir-impuestos.yaml',
    tema: 'economia/impuestos',
    fecha: '2019-01-01',
    contexto: 'campaña',
    cita: 'No vamos a subir los impuestos a la clase media',
    resumen: 'En un acto de campaña, promete no subir los impuestos a la clase media este gobierno.',
    titulo: 'Promete no subir los impuestos a la clase media',
  },
  // B: gobierno, mismo objeto, sin negación, más de 60 días después de A.
  {
    archivo: '2022-06-01-sube-impuestos-clase-media.yaml',
    tema: 'economia/impuestos',
    fecha: '2022-06-01',
    contexto: 'gobierno',
    cita: 'Vamos a subir los impuestos a la clase media para bajar el déficit fiscal',
    resumen: 'Como presidente, anuncia que subirá los impuestos a la clase media para bajar el déficit.',
    titulo: 'Anuncia que subirá los impuestos a la clase media',
  },
  // C: otro tema por completo.
  {
    archivo: '2020-06-15-baja-delitos-seguridad.yaml',
    tema: 'seguridad',
    fecha: '2020-06-15',
    contexto: 'gobierno',
    cita: 'Vamos a bajar los delitos y mejorar la seguridad en todo el país',
    resumen: 'Promete bajar los delitos y mejorar la seguridad ciudadana.',
    titulo: 'Promete bajar los delitos',
  },
  // D: mismo tema que A y B, pero a 19 días de B (par B-D descartado por fecha).
  {
    archivo: '2022-06-20-impuestos-tema-importante.yaml',
    tema: 'economia/impuestos',
    fecha: '2022-06-20',
    contexto: 'entrevista',
    cita: 'Los impuestos son un tema importante para el país y hay que analizarlos con cuidado',
    resumen: 'En una entrevista, opina que los impuestos requieren un análisis cuidadoso sin comprometerse a una posición.',
    titulo: 'Opina sobre los impuestos sin comprometerse',
  },
];

const idA = (p: string) => `${p}/2019-01-01-no-subir-impuestos`;
const idB = (p: string) => `${p}/2022-06-01-sube-impuestos-clase-media`;
const idC = (p: string) => `${p}/2020-06-15-baja-delitos-seguridad`;
const idD = (p: string) => `${p}/2022-06-20-impuestos-tema-importante`;

describe('mismoTemaOPadre()', () => {
  it('el mismo tema coincide', () => {
    expect(mismoTemaOPadre('economia/impuestos', 'economia/impuestos')).toBe(true);
  });
  it('un subtema coincide con su tema padre en cualquier orden', () => {
    expect(mismoTemaOPadre('economia/impuestos', 'economia')).toBe(true);
    expect(mismoTemaOPadre('economia', 'economia/impuestos')).toBe(true);
  });
  it('dos subtemas hermanos del mismo padre no coinciden', () => {
    expect(mismoTemaOPadre('economia/impuestos', 'economia/combustibles')).toBe(false);
  });
});

describe('girosCandidatos()', () => {
  it('empareja por tema y 60+ días, ordena por puntaje descendente y descarta tema distinto y fecha muy cercana', () => {
    const politico = 'persona-test';
    const raiz = crearFixture(politico, DECLARACIONES_BASE);
    const pares = girosCandidatos(raiz, politico);

    expect(pares).toHaveLength(2);
    expect(pares[0].antes.id).toBe(idA(politico));
    expect(pares[0].despues.id).toBe(idB(politico));
    expect(pares[1].antes.id).toBe(idA(politico));
    expect(pares[1].despues.id).toBe(idD(politico));
    expect(pares[0].puntaje).toBeGreaterThan(pares[1].puntaje);

    const idsInvolucrados = pares.flatMap((p) => [p.antes.id, p.despues.id]);
    expect(idsInvolucrados).not.toContain(idC(politico)); // otro tema: nunca aparece
    expect(
      pares.some(
        (p) =>
          (p.antes.id === idB(politico) && p.despues.id === idD(politico)) ||
          (p.antes.id === idD(politico) && p.despues.id === idB(politico)),
      ),
    ).toBe(false); // B-D: 19 días, demasiado cerca
  });

  it('el mejor par trae las dos señales: asimetría de negación y campaña→gobierno', () => {
    const politico = 'persona-test-senales';
    const raiz = crearFixture(politico, DECLARACIONES_BASE);
    const [mejor] = girosCandidatos(raiz, politico);
    expect(mejor.senales).toContain('negación');
    expect(mejor.senales).toContain('contexto');
  });

  it('descarta un par que ya es un giro publicado', () => {
    const politico = 'persona-test-giro';
    const raiz = crearFixture(politico, DECLARACIONES_BASE, {}, [{ antes: idA(politico), despues: idB(politico) }]);
    const pares = girosCandidatos(raiz, politico);
    expect(pares).toHaveLength(1);
    expect(pares[0].antes.id).toBe(idA(politico));
    expect(pares[0].despues.id).toBe(idD(politico));
  });

  it('--n limita la cantidad de pares devueltos', () => {
    const politico = 'persona-test-n';
    const raiz = crearFixture(politico, DECLARACIONES_BASE);
    const pares = girosCandidatos(raiz, politico, { n: 1 });
    expect(pares).toHaveLength(1);
    expect(pares[0].despues.id).toBe(idB(politico)); // el de mayor puntaje
  });

  it('el puntaje no depende del político ni de un campo partido: solo del texto', () => {
    const raizX = crearFixture('persona-x', DECLARACIONES_BASE, { partido: 'partido-x' });
    const raizY = crearFixture('otra-persona-bien-distinta', DECLARACIONES_BASE, { partido: 'partido-y' });
    const paresX = girosCandidatos(raizX, 'persona-x');
    const paresY = girosCandidatos(raizY, 'otra-persona-bien-distinta');

    expect(paresX).toHaveLength(2);
    expect(paresY).toHaveLength(2);
    expect(paresX.map((p) => p.puntaje)).toEqual(paresY.map((p) => p.puntaje));
    expect(paresX.map((p) => p.terminosComunes)).toEqual(paresY.map((p) => p.terminosComunes));
    expect(paresX.map((p) => p.senales)).toEqual(paresY.map((p) => p.senales));
  });
});
