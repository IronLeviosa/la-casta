/**
 * Barra de Wayback Machine colada como texto de la nota.
 *
 * `pnpm corpus:reextraer --medio el-observador --escribir` reescribió una nota (El Observador,
 * 2016-04-01, bajada de web.archive.org) de 60 a 3.658 caracteres, y el texto nuevo empezaba
 * "1 capture 04 Sep 2026 Aug SEP Oct…": no es la nota, es la interfaz que Wayback inyecta en cada
 * captura (`#wm-ipp-base`, con `display:none` que no oculta nada para Readability porque no corre
 * layout). Pasaba tanto con el camino nuevo del extractor (`textoBloquesArticulo` /
 * `articleBodyDeJsonLd`) como con Readability cuando la nota real es corta y la barra pesa más.
 */
import { describe, expect, it } from 'vitest';
import { extraerHtml, textoBloquesArticulo } from '../scripts/lib/extraer.ts';
import { parseHTML } from 'linkedom';

const TEXTO_NOTA = 'Una rebaja de la magnitud sugerida en combustibles deterioraría los resultados de la empresa, dijo el presidente.';

/**
 * Envoltura real de una captura de Wayback (recortada, pero con la misma estructura que trae
 * `web.archive.org`): scripts de cabecera con `archive.org` en el `src`, y en el `<body>` el
 * bloque `BEGIN/END WAYBACK TOOLBAR INSERT` con `#wm-ipp-base` (que a su vez contiene `#donato` y
 * `#wm-ipp`) más `#wm-ipp-print`, seguido recién ahí de la nota real.
 */
function htmlDeCapturaWayback(cuerpoNota: string): string {
  return `<!DOCTYPE html><html><head>
<script type="text/javascript" src="https://web-static.archive.org/_static/js/athena.js"></script>
<script type="text/javascript" src="https://web-static.archive.org/_static/js/wombat.js"></script>
<script>__wm.init("https://web.archive.org/web");</script>
<title>La nota</title>
</head>
<body class="home"><!-- BEGIN WAYBACK TOOLBAR INSERT -->
<script>__wm.rw(0);</script>
<div id="wm-ipp-base" style="display:none">
  <div id="wm-ipp">
    <div id="donato"><iframe src="https://archive.org/includes/donate.php"></iframe></div>
    <div id="wm-ipp-inside">
      1 capture
      04 Sep 2026
      Aug SEP Oct
      04
      2025 2026 2027
      success fail
      About this capture
      COLLECTED BY
      Collection: Save Page Now
      TIMESTAMPS
      The Wayback Machine - https://web.archive.org/web/20260904093540/https://www.elobservador.com.uy/nota/x
    </div>
  </div>
</div>
<div id="wm-ipp-print">The Wayback Machine - https://web.archive.org/web/20260904093540/https://www.elobservador.com.uy/nota/x</div>
<script>__wm.rw(1);</script>
<!-- END WAYBACK TOOLBAR INSERT -->
${cuerpoNota}
</body></html>`;
}

describe('extraerHtml() sobre una captura de Wayback', () => {
  it('con una nota corta detrás de la barra, el texto es la nota (no la barra)', () => {
    const html = htmlDeCapturaWayback(`<article><p>${TEXTO_NOTA}</p></article>`);
    const ex = extraerHtml(html, 'https://web.archive.org/web/2016/https://www.elobservador.com.uy/nota/x');
    expect(ex.texto).toContain(TEXTO_NOTA);
    expect(ex.texto).not.toMatch(/\d+\s+captures?/i);
    expect(ex.texto).not.toContain('wm-ipp');
    expect(ex.texto).not.toContain('Save Page Now');
    expect(ex.texto).not.toContain('About this capture');
  });

  it('sin texto real detrás de la barra (paywall), el resultado queda corto, no crece con la barra', () => {
    // Como la nota real de El Observador: solo un aviso de paywall, sin cuerpo.
    const html = htmlDeCapturaWayback('<p>Esta nota es exclusiva para suscriptores.</p>');
    const ex = extraerHtml(html, 'https://web.archive.org/web/2016/https://www.elobservador.com.uy/nota/x');
    expect(ex.texto.length).toBeLessThan(200);
    expect(ex.texto).not.toMatch(/\d+\s+captures?/i);
  });

  it('una página sin nada de Wayback no se toca (el regex y los selectores no encuentran nada)', () => {
    const html = `<html><body><article>${'<p>Un párrafo con bastante texto de relleno para superar el umbral de Readability, repetido. </p>'.repeat(10)}</article></body></html>`;
    const ex = extraerHtml(html, 'https://www.elobservador.com.uy/nota/x');
    expect(ex.texto).toContain('Un párrafo con bastante texto de relleno');
  });
});

describe('textoBloquesArticulo() descarta bloques que son la barra de Wayback', () => {
  it('no acepta un bloque cuyo texto empieza con "N capture(s)" seguido de fechas', () => {
    const html = `<html><body>
      <article class="article-body-1">1 capture\n04 Sep 2026\nAug SEP Oct</article>
      <article class="article-body-2">${TEXTO_NOTA}</article>
    </body></html>`;
    const { document } = parseHTML(html);
    // Un solo bloque válido (el otro se descartó): no llega al mínimo de dos, así que no reemplaza.
    expect(textoBloquesArticulo(document)).toBe('');
  });

  it('con dos bloques reales (ninguno es la barra), los junta como siempre', () => {
    const html = `<html><body>
      <article class="article-body-1">Primer párrafo real de la nota.</article>
      <article class="article-body-2">${TEXTO_NOTA}</article>
    </body></html>`;
    const { document } = parseHTML(html);
    const texto = textoBloquesArticulo(document);
    expect(texto).toContain('Primer párrafo real de la nota.');
    expect(texto).toContain(TEXTO_NOTA);
  });
});
