/*
 * Recorrida de todo el sitio construido desde el navegador (docs/revision-visual.md, punto 3).
 *
 * Cómo se usa: `pnpm build`, `pnpm preview`, abrir http://localhost:4321/la-casta/ en el navegador,
 * pegar este archivo en la consola, y después:
 *
 *   window.__P = await (await fetch('/la-casta/datos/paginas.json')).json();   // o la lista a mano
 *   await window.__auditar(0, 120);   // devuelve solo las páginas con fallas
 *
 * Carga cada página en un iframe del ancho de una pantalla común (975 px) y mide lo que un HTML sin
 * dibujar no puede: rótulos de línea de tiempo que se pisan, textos de gráficos encimados, tarjetas
 * recortadas, desplazamiento horizontal de la página, párrafos visibles de más de 1.500 caracteres
 * fuera de un desplegable, listas de renglones iguales, contadores sin enlace, secciones vacías con
 * explicación larga, imágenes sin alt, secciones de más de 4.000 px sin nada plegado y letra menor a
 * 11 px. Los globos y tarjetas que solo aparecen al pasar el cursor no cuentan como texto.
 */
window.__auditar = async function (i0, i1) {
  const res = [];
  let fr = document.getElementById('__fr');
  if (!fr) {
    fr = document.createElement('iframe');
    fr.id = '__fr';
    fr.style.cssText = 'position:fixed;left:0;top:0;width:975px;height:900px;border:0;opacity:0.01;pointer-events:none';
    document.body.appendChild(fr);
  }
  const carga = (u) => new Promise((ok) => { fr.onload = () => setTimeout(ok, 120); fr.src = '/la-casta' + u; });
  const solapa = (a, b) => a.left < b.right - 1 && b.left < a.right - 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1;
  for (let i = i0; i < Math.min(i1, window.__P.length); i++) {
    const u = window.__P[i];
    try {
      await carga(u);
      const d = fr.contentDocument, w = fr.contentWindow;
      const main = d.querySelector('main') || d.body;
      const txt = (el) => { const c = el.cloneNode(true); c.querySelectorAll('[role="tooltip"], .globo, .lt-tarjeta, .ref-ley-tarjeta, .visualmente-oculto').forEach((x) => x.remove()); return (c.textContent || '').replace(/\s+/g, ' ').trim(); };
      const enD = (el) => !!el.closest('details, nav, footer, header, .fuentes, .procedencia, .historial');
      const f = [];
      if (d.documentElement.scrollWidth > d.documentElement.clientWidth + 1) f.push('overflow-x ' + d.documentElement.scrollWidth);
      for (const p of main.querySelectorAll('p')) if (!enD(p)) { const n = txt(p).length; if (n > 1500) f.push('parrafo ' + n); }
      for (const l of main.querySelectorAll('ul, ol')) { if (enD(l) || l.children.length < 8 || l.classList.contains('afirmaciones')) continue; const it = [...l.children].map((c) => txt(c).slice(0, 30)); const cu = {}; it.forEach((x) => (cu[x] = (cu[x] || 0) + 1)); if (Math.max(...Object.values(cu)) >= 8) f.push('lista-repetida ' + l.className); }
      for (const lt of main.querySelectorAll('.lt')) {
        const c = [...lt.querySelectorAll('.lt-rotulo, .lt-anio-rotulo')].map((e) => e.getBoundingClientRect());
        let n = 0; for (let a = 0; a < c.length; a++) for (let b = a + 1; b < c.length; b++) if (solapa(c[a], c[b])) n++;
        if (n) f.push('lt-solapes ' + n);
        const ps = [...lt.querySelectorAll('.lt-punto')];
        const sin = ps.filter((p) => !p.getAttribute('href') || p.getAttribute('href').startsWith('#')).length; if (sin) f.push('lt-sin-destino ' + sin);
        if (ps.length) { const p = ps[Math.floor(ps.length / 2)]; p.focus(); const t = p.querySelector('.lt-tarjeta'); const s = lt.querySelector('.lt-scroll'); if (t && s) { const rt = t.getBoundingClientRect(), rs = s.getBoundingClientRect(); if (rt.top < rs.top - 1 || rt.bottom > rs.bottom + 1) f.push('lt-tarjeta-recortada'); } p.blur(); }
      }
      for (const s of main.querySelectorAll('svg')) { const t = [...s.querySelectorAll('text')].map((e) => e.getBoundingClientRect()).filter((r) => r.width > 0); let n = 0; for (let a = 0; a < t.length; a++) for (let b = a + 1; b < t.length; b++) if (solapa(t[a], t[b])) n++; if (n) f.push('svg-solapes ' + n + ' (' + (s.getAttribute('aria-label') || s.id || '').slice(0, 30) + ')'); }
      for (const el of main.querySelectorAll('p, div')) { if (enD(el) || el.children.length > 6) continue; const t = txt(el); if (/\b[Hh]ay \d+ registros?\b/.test(t) && !el.querySelector('a')) f.push('contador-sin-enlace'); }
      for (const v of main.querySelectorAll('.vacio')) { if (v.closest('details')) continue; const t = [...v.children].filter((c) => c.tagName !== 'DETAILS').map((c) => txt(c)).join(' ') || txt(v); if (t.length > 400) f.push('vacio-largo ' + t.length); }
      for (const im of main.querySelectorAll('img')) if (!im.getAttribute('alt')) f.push('img-sin-alt');
      for (const s of [...main.querySelectorAll('section, .seccion')].filter((s) => s.querySelector('h2,h3'))) { const h = s.getBoundingClientRect().height; if (h > 4000 && !s.querySelector('details')) f.push('seccion-' + Math.round(h) + 'px-sin-plegar (' + txt(s.querySelector('h2,h3')).slice(0, 25) + ')'); }
      const ft = [...main.querySelectorAll('p, li, td, span')].filter((e) => txt(e).length > 20 && parseFloat(w.getComputedStyle(e).fontSize) < 11).length; if (ft) f.push('fuente<11px ' + ft);
      if (f.length) res.push({ u, alto: Math.round(d.documentElement.scrollHeight), f });
    } catch (e) { res.push({ u, f: ['error ' + String(e).slice(0, 80)] }); }
  }
  return res;
};
