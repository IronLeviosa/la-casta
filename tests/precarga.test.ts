/**
 * Pruebas puras de la precarga del corpus (plan 2026-09, fase 3, ítem 3.3): sin red y sin tocar
 * el corpus real. Cubren la enumeración de URLs de la Hemeroteca para un período dado, el parseo
 * de un índice de fixture (el HTML que devuelve `busquedaEdiciones`) y qué está y qué falta en el
 * corpus dado un listado — las tres funciones que hacen el trabajo de decidir qué bajar sin pedirle
 * nada a la red.
 */
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it, afterEach } from 'vitest';
import { idDeUrl } from '../scripts/lib/hash.ts';
import {
  añosDelPeriodo,
  baseHemeroteca,
  CAMARAS,
  construirParamsDiarios,
  construirParamsInventario,
  construirParamsPresidencia,
  dominiosDeEmpresa,
  enPeriodoOIndeterminado,
  esCamara,
  extraerEnlacesYoutube,
  faltantesEnCorpus,
  filtrarPorMes,
  mesActualISO,
  mesDeUrlPresidencia,
  parametrosIndiceAnio,
  parsearIndiceHemeroteca,
  urlDiario,
  urlsDelPeriodo,
  validarPeriodo,
  type EntradaDiario,
} from '../scripts/corpus/precarga.ts';

// ------------------------------------------------------------------------------------------
// Cámaras y período
// ------------------------------------------------------------------------------------------

describe('esCamara', () => {
  it('acepta las cuatro cámaras de la Hemeroteca', () => {
    for (const c of CAMARAS) expect(esCamara(c)).toBe(true);
  });

  it('rechaza cualquier otra cosa', () => {
    expect(esCamara('senado')).toBe(false);
    expect(esCamara('CRR')).toBe(false);
    expect(esCamara(undefined)).toBe(false);
    expect(esCamara(5)).toBe(false);
  });
});

describe('validarPeriodo', () => {
  it('acepta YYYY-MM', () => {
    expect(validarPeriodo('2026-06', '--desde')).toBe('2026-06');
    expect(validarPeriodo('2000-01', '--desde')).toBe('2000-01');
    expect(validarPeriodo('1999-12', '--desde')).toBe('1999-12');
  });

  it('rechaza formatos distintos, con el nombre de la opción en el mensaje', () => {
    expect(() => validarPeriodo('2026-6', '--desde')).toThrow('--desde');
    expect(() => validarPeriodo('2026/06', '--hasta')).toThrow('--hasta');
    expect(() => validarPeriodo('06-2026', '--desde')).toThrow();
    expect(() => validarPeriodo('2026-13', '--desde')).toThrow();
    expect(() => validarPeriodo('2026-00', '--desde')).toThrow();
    expect(() => validarPeriodo('', '--desde')).toThrow();
  });
});

describe('mesActualISO', () => {
  it('formatea año-mes con cero a la izquierda', () => {
    expect(mesActualISO(new Date(2026, 0, 15))).toBe('2026-01');
    expect(mesActualISO(new Date(2026, 8, 10))).toBe('2026-09');
    expect(mesActualISO(new Date(2026, 11, 31))).toBe('2026-12');
  });
});

describe('añosDelPeriodo', () => {
  it('un solo año cuando desde y hasta caen en el mismo año', () => {
    expect(añosDelPeriodo('2026-01', '2026-06')).toEqual([2026]);
  });

  it('varios años cuando el período cruza el fin de año', () => {
    expect(añosDelPeriodo('2025-11', '2026-02')).toEqual([2025, 2026]);
  });

  it('lanza si hasta es anterior a desde', () => {
    expect(() => añosDelPeriodo('2026-06', '2026-01')).toThrow(/hasta.*anterior a.*desde|2026-01/);
  });

  it('lanza con formato inválido en cualquiera de los dos', () => {
    expect(() => añosDelPeriodo('2026-6', '2026-08')).toThrow();
    expect(() => añosDelPeriodo('2026-06', 'hoy')).toThrow();
  });
});

// ------------------------------------------------------------------------------------------
// URLs de la Hemeroteca
// ------------------------------------------------------------------------------------------

describe('baseHemeroteca / urlDiario', () => {
  it('arma la URL estable con el patrón de docs/fuentes-oficiales/parlamento.md', () => {
    expect(baseHemeroteca('crr')).toBe('https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/');
    const nombre = '1996-12-19 - DIARIO DE SESIONES DE LA CAMARA DE REPRESENTANTES (0001)';
    expect(urlDiario('crr', nombre)).toBe(
      'https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/' + encodeURIComponent(nombre) + '.pdf',
    );
  });

  it('codifica los espacios (los paréntesis, encodeURIComponent los deja tal cual)', () => {
    const url = urlDiario('css', '2026-05-13 - DIARIO DE SESIONES DE LA CAMARA DE SENADORES (0018)');
    expect(url).toContain('%20');
    expect(url).toContain('(0018)');
    expect(url.endsWith('.pdf')).toBe(true);
  });

  it('cambia el segmento sesiones<camara> según la cámara', () => {
    expect(baseHemeroteca('css')).toContain('sesionescss/');
    expect(baseHemeroteca('ag')).toContain('sesionesag/');
    expect(baseHemeroteca('cp')).toContain('sesionescp/');
  });
});

describe('parametrosIndiceAnio', () => {
  it('arma el cuerpo del POST que usa el timeline al hacer clic en un año', () => {
    expect(parametrosIndiceAnio(2026)).toEqual({ publicacion: '', anioInicio: '2026', anioFin: '0', grupoEdicion: 'ds', porSlide: '6' });
  });
});

// ------------------------------------------------------------------------------------------
// Parseo de un índice de fixture (el HTML que devuelve busquedaEdiciones)
// ------------------------------------------------------------------------------------------

/** Un recorte realista del fragmento que devuelve `busquedalibreTimeLine/busquedaEdiciones`. */
const INDICE_FIXTURE_2026 = `
<div class="resultado">
  <div class="tapa"><a href="#"><img src="TapasD/sesionescrr/2026-01-15 - DIARIO DE SESIONES DE LA CAMARA DE REPRESENTANTES (0003).jpg" alt=""></a></div>
  <div class="tapa"><a href="#"><img src="TapasD/sesionescrr/2026-03-01 - DIARIO DE SESIONES DE LA CAMARA DE REPRESENTANTES (0001).jpg" alt=""></a></div>
  <div class="tapa"><a href="#"><img src="TapasD/sesionescss/2026-02-10 - DIARIO DE SESIONES DE LA CAMARA DE SENADORES (0002).jpg" alt=""></a></div>
  <div class="tapa"><a href="#"><img src="TapasD/sesionescrr/2026-05-13 - DIARIO DE SESIONES DE LA CAMARA DE REPRESENTANTES (0018).jpg" alt=""></a></div>
  <!-- repetida a propósito: debe dedupear -->
  <div class="tapa"><a href="#"><img src="TapasD/sesionescrr/2026-01-15 - DIARIO DE SESIONES DE LA CAMARA DE REPRESENTANTES (0003).jpg" alt=""></a></div>
  <!-- sin fecha reconocible al principio del nombre: se ignora -->
  <div class="tapa"><a href="#"><img src="TapasD/sesionescrr/INDICE ALFABETICO 2026.jpg" alt=""></a></div>
  <script>var mensajeResultado = "Se muestran 5 ejemplares del año 2026";</script>
</div>
`;

describe('parsearIndiceHemeroteca', () => {
  it('extrae solo los diarios de la cámara pedida', () => {
    const entradas = parsearIndiceHemeroteca(INDICE_FIXTURE_2026, 'crr');
    expect(entradas).toHaveLength(3);
    expect(entradas.every((e) => e.camara === 'crr')).toBe(true);
  });

  it('otra cámara del mismo índice trae lo suyo', () => {
    const entradas = parsearIndiceHemeroteca(INDICE_FIXTURE_2026, 'css');
    expect(entradas).toHaveLength(1);
    expect(entradas[0].fecha).toBe('2026-02-10');
  });

  it('una cámara sin diarios en el índice da lista vacía', () => {
    expect(parsearIndiceHemeroteca(INDICE_FIXTURE_2026, 'ag')).toEqual([]);
    expect(parsearIndiceHemeroteca(INDICE_FIXTURE_2026, 'cp')).toEqual([]);
  });

  it('dedupea por nombre', () => {
    const entradas = parsearIndiceHemeroteca(INDICE_FIXTURE_2026, 'crr');
    const nombres = entradas.map((e) => e.nombre);
    expect(new Set(nombres).size).toBe(nombres.length);
  });

  it('ignora una tapa cuyo nombre no arranca con fecha', () => {
    const entradas = parsearIndiceHemeroteca(INDICE_FIXTURE_2026, 'crr');
    expect(entradas.some((e) => e.nombre.includes('INDICE ALFABETICO'))).toBe(false);
  });

  it('ordena por fecha', () => {
    const entradas = parsearIndiceHemeroteca(INDICE_FIXTURE_2026, 'crr');
    expect(entradas.map((e) => e.fecha)).toEqual(['2026-01-15', '2026-03-01', '2026-05-13']);
  });

  it('un índice vacío o sin coincidencias da lista vacía', () => {
    expect(parsearIndiceHemeroteca('<div>sin resultados</div>', 'crr')).toEqual([]);
    expect(parsearIndiceHemeroteca('', 'crr')).toEqual([]);
  });
});

// ------------------------------------------------------------------------------------------
// Enumeración de URLs de la Hemeroteca para un período dado
// ------------------------------------------------------------------------------------------

describe('filtrarPorMes / urlsDelPeriodo', () => {
  const entradas: EntradaDiario[] = [
    { camara: 'crr', nombre: '2026-01-15 - DIARIO DE SESIONES DE LA CAMARA DE REPRESENTANTES (0003)', fecha: '2026-01-15' },
    { camara: 'crr', nombre: '2026-03-01 - DIARIO DE SESIONES DE LA CAMARA DE REPRESENTANTES (0001)', fecha: '2026-03-01' },
    { camara: 'crr', nombre: '2026-03-18 - DIARIO DE SESIONES DE LA CAMARA DE REPRESENTANTES (0007)', fecha: '2026-03-18' },
    { camara: 'crr', nombre: '2026-05-13 - DIARIO DE SESIONES DE LA CAMARA DE REPRESENTANTES (0018)', fecha: '2026-05-13' },
  ];

  it('se queda solo con los meses del período pedido', () => {
    const r = filtrarPorMes(entradas, '2026-03', '2026-03');
    expect(r.map((e) => e.fecha)).toEqual(['2026-03-01', '2026-03-18']);
  });

  it('un período que no cubre ningún diario da lista vacía (junio 2026: sin diarios de crr)', () => {
    expect(filtrarPorMes(entradas, '2026-06', '2026-06')).toEqual([]);
  });

  it('el período es inclusive en ambas puntas', () => {
    const r = filtrarPorMes(entradas, '2026-01', '2026-05');
    expect(r).toHaveLength(4);
  });

  it('urlsDelPeriodo filtra y arma la URL final en un solo paso', () => {
    const urls = urlsDelPeriodo(entradas, '2026-03', '2026-03');
    expect(urls).toEqual([
      urlDiario('crr', '2026-03-01 - DIARIO DE SESIONES DE LA CAMARA DE REPRESENTANTES (0001)'),
      urlDiario('crr', '2026-03-18 - DIARIO DE SESIONES DE LA CAMARA DE REPRESENTANTES (0007)'),
    ]);
    expect(urls.every((u) => u.startsWith('https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/'))).toBe(true);
  });

  it('urlsDelPeriodo sobre un índice de fixture completo, de punta a punta', () => {
    const indice = parsearIndiceHemeroteca(INDICE_FIXTURE_2026, 'crr');
    const urls = urlsDelPeriodo(indice, '2026-01', '2026-02');
    expect(urls).toEqual([urlDiario('crr', '2026-01-15 - DIARIO DE SESIONES DE LA CAMARA DE REPRESENTANTES (0003)')]);
  });
});

// ------------------------------------------------------------------------------------------
// Qué está y qué falta en el corpus, dado un listado
// ------------------------------------------------------------------------------------------

describe('faltantesEnCorpus', () => {
  it('separa presentes y faltantes según el predicado inyectado (sin tocar disco)', () => {
    const urls = ['https://a.com/1', 'https://a.com/2', 'https://a.com/3'];
    const presentes = new Set(urls.slice(0, 1).map((u) => idDeUrl(u)));
    const r = faltantesEnCorpus(urls, (id) => presentes.has(id));
    expect(r.presentes).toEqual(['https://a.com/1']);
    expect(r.faltantes).toEqual(['https://a.com/2', 'https://a.com/3']);
  });

  it('todo faltante si el predicado siempre da false', () => {
    const urls = ['https://a.com/1', 'https://a.com/2'];
    const r = faltantesEnCorpus(urls, () => false);
    expect(r.faltantes).toEqual(urls);
    expect(r.presentes).toEqual([]);
  });

  it('todo presente si el predicado siempre da true', () => {
    const urls = ['https://a.com/1', 'https://a.com/2'];
    const r = faltantesEnCorpus(urls, () => true);
    expect(r.presentes).toEqual(urls);
    expect(r.faltantes).toEqual([]);
  });

  it('lista vacía da los dos lados vacíos', () => {
    const r = faltantesEnCorpus([], () => true);
    expect(r).toEqual({ faltantes: [], presentes: [] });
  });

  it('dos URLs que canonicalizan igual dan el mismo id (misma nota del corpus)', () => {
    // idDeUrl canonicaliza antes de hashear: con o sin "www." y con utm_ de más, es la misma nota.
    const vistos: string[] = [];
    faltantesEnCorpus(['http://www.a.com/x?utm_source=y', 'https://a.com/x'], (id) => {
      vistos.push(id);
      return false;
    });
    expect(vistos[0]).toBe(vistos[1]);
  });
});

// ------------------------------------------------------------------------------------------
// Validación de parámetros de cada tipo de trabajo
// ------------------------------------------------------------------------------------------

describe('construirParamsDiarios', () => {
  it('toma camara y desde, y pone --hasta en el mes actual si falta', () => {
    const p = construirParamsDiarios({ camara: 'crr', desde: '2026-06' });
    expect(p.camara).toBe('crr');
    expect(p.desde).toBe('2026-06');
    expect(p.hasta).toBe(mesActualISO());
  });

  it('respeta --hasta si viene', () => {
    const p = construirParamsDiarios({ camara: 'css', desde: '2020-01', hasta: '2020-12' });
    expect(p.hasta).toBe('2020-12');
  });

  it('lanza sin --camara, con una cámara inválida, o sin --desde', () => {
    expect(() => construirParamsDiarios({ desde: '2026-06' })).toThrow(/camara/);
    expect(() => construirParamsDiarios({ camara: 'diputados', desde: '2026-06' })).toThrow(/camara/);
    expect(() => construirParamsDiarios({ camara: 'crr' })).toThrow(/desde/);
  });
});

describe('construirParamsPresidencia', () => {
  it('toma desde y por defecto hasta es el mes actual', () => {
    const p = construirParamsPresidencia({ desde: '2026-01' });
    expect(p).toEqual({ desde: '2026-01', hasta: mesActualISO() });
  });

  it('lanza sin --desde', () => {
    expect(() => construirParamsPresidencia({})).toThrow(/desde/);
  });
});

describe('construirParamsInventario', () => {
  it('lanza si no viene ni --dominio ni --empresa', () => {
    expect(() => construirParamsInventario({})).toThrow(/dominio|empresa/);
  });

  it('normaliza --dominio (sin esquema, sin www, sin ruta)', () => {
    expect(construirParamsInventario({ dominio: 'https://www.ancap.com.uy/algo' })).toEqual(['ancap.com.uy']);
  });
});

// ------------------------------------------------------------------------------------------
// Presidencia: fecha por URL y enlaces a YouTube
// ------------------------------------------------------------------------------------------

describe('mesDeUrlPresidencia', () => {
  it('extrae YYYY-MM de una ruta con /YYYY/MM/ (archivo.presidencia.gub.uy)', () => {
    expect(mesDeUrlPresidencia('https://archivo.presidencia.gub.uy/_web/noticias/2005/06/2005060604.htm')).toBe('2005-06');
  });

  it('da null cuando la URL no trae fecha en la ruta (slugs de www.gub.uy)', () => {
    expect(mesDeUrlPresidencia('https://www.gub.uy/presidencia/comunicacion/noticias/1-mayo-importa-para-valorar')).toBeNull();
  });

  it('da null ante una URL inválida o un mes fuera de 1-12', () => {
    expect(mesDeUrlPresidencia('no es una url')).toBeNull();
    expect(mesDeUrlPresidencia('https://a.com/2026/13/algo')).toBeNull();
  });
});

describe('enPeriodoOIndeterminado', () => {
  it('null (no determinable) siempre pasa', () => {
    expect(enPeriodoOIndeterminado(null, '2026-01', '2026-12')).toBe(true);
  });

  it('dentro y fuera del rango', () => {
    expect(enPeriodoOIndeterminado('2026-06', '2026-01', '2026-12')).toBe(true);
    expect(enPeriodoOIndeterminado('2025-12', '2026-01', '2026-12')).toBe(false);
    expect(enPeriodoOIndeterminado('2027-01', '2026-01', '2026-12')).toBe(false);
  });
});

describe('extraerEnlacesYoutube', () => {
  it('encuentra un watch?v= en un href', () => {
    const html = '<a href="https://www.youtube.com/watch?v=abc12345678">Ver transmisión</a>';
    expect(extraerEnlacesYoutube(html)).toEqual(['https://www.youtube.com/watch?v=abc12345678']);
  });

  it('encuentra un iframe embebido (src, no href) y lo canonicaliza a watch?v=', () => {
    const html = '<iframe src="https://www.youtube.com/embed/xyz98765432" allowfullscreen></iframe>';
    expect(extraerEnlacesYoutube(html)).toEqual(['https://www.youtube.com/watch?v=xyz98765432']);
  });

  it('reconoce youtu.be y dedupea tras canonicalizar', () => {
    const html = `
      <a href="https://youtu.be/abc12345678">stream</a>
      <a href="https://www.youtube.com/watch?v=abc12345678&feature=share">mismo video</a>
    `;
    expect(extraerEnlacesYoutube(html)).toHaveLength(1);
  });

  it('sin enlaces a YouTube da lista vacía', () => {
    expect(extraerEnlacesYoutube('<a href="https://www.gub.uy/presidencia/algo">nota</a>')).toEqual([]);
  });

  it('ignora un href de YouTube roto/relativo que no arranca con http(s)', () => {
    expect(extraerEnlacesYoutube('<a href="/relativo/youtube.com/no-es-una-url">x</a>')).toEqual([]);
  });
});

// ------------------------------------------------------------------------------------------
// Dominios de la empresa, desde content/medios/ (fixture propia, no la del repo)
// ------------------------------------------------------------------------------------------

describe('dominiosDeEmpresa', () => {
  let carpeta: string;

  afterEach(() => {
    if (carpeta) rmSync(carpeta, { recursive: true, force: true });
  });

  it('junta url + dominios del medio cuyo campo empresa calza con el slug', () => {
    carpeta = mkdtempSync(join(tmpdir(), 'la-casta-medios-'));
    writeFileSync(
      join(carpeta, 'ancap.yaml'),
      'nombre: ANCAP\nurl: https://www.ancap.com.uy/\nempresa: ancap\n',
      'utf8',
    );
    writeFileSync(
      join(carpeta, 'otra-cosa.yaml'),
      'nombre: El Pais\nurl: https://www.elpais.com.uy/\n',
      'utf8',
    );
    expect(dominiosDeEmpresa('ancap', carpeta)).toEqual(['ancap.com.uy']);
  });

  it('incluye los dominios extra listados aparte de "url"', () => {
    carpeta = mkdtempSync(join(tmpdir(), 'la-casta-medios-'));
    writeFileSync(
      join(carpeta, 'presidencia.yaml'),
      'nombre: Presidencia\nurl: https://www.gub.uy/presidencia/\nempresa: presidencia\ndominios:\n  - https://medios.presidencia.gub.uy/\n  - https://archivo.presidencia.gub.uy/\n',
      'utf8',
    );
    const r = dominiosDeEmpresa('presidencia', carpeta);
    expect(r).toContain('gub.uy');
    expect(r).toContain('medios.presidencia.gub.uy');
    expect(r).toContain('archivo.presidencia.gub.uy');
  });

  it('empresa sin ningún medio asociado da lista vacía', () => {
    carpeta = mkdtempSync(join(tmpdir(), 'la-casta-medios-'));
    writeFileSync(join(carpeta, 'ancap.yaml'), 'nombre: ANCAP\nurl: https://www.ancap.com.uy/\nempresa: ancap\n', 'utf8');
    expect(dominiosDeEmpresa('no-existe', carpeta)).toEqual([]);
  });

  it('carpeta inexistente da lista vacía sin lanzar', () => {
    expect(dominiosDeEmpresa('ancap', join(tmpdir(), 'la-casta-carpeta-que-no-existe-xyz'))).toEqual([]);
  });

  it('un YAML roto en la carpeta no rompe la lectura de los demás', () => {
    carpeta = mkdtempSync(join(tmpdir(), 'la-casta-medios-'));
    writeFileSync(join(carpeta, 'roto.yaml'), 'esto: [no cierra', 'utf8');
    writeFileSync(join(carpeta, 'ancap.yaml'), 'nombre: ANCAP\nurl: https://www.ancap.com.uy/\nempresa: ancap\n', 'utf8');
    expect(dominiosDeEmpresa('ancap', carpeta)).toEqual(['ancap.com.uy']);
  });
});
