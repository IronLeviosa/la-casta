/**
 * Partes puras de `pnpm inventario`: agrupar documentos por período y recortar la lista de URL.
 *
 * Motivo: un dominio con archivo largo (261 documentos en biblioteca.parlamento.gub.uy) imprimía
 * 35.000 caracteres, uno por documento. `resumirInventario` no toca red: agrupa por año (o por
 * mes si el rango pedido es un único año) y recorta a las N más recientes.
 */
import { describe, expect, it } from 'vitest';
import { type DocumentoInventario, resumirInventario } from '../scripts/corpus/inventario.ts';

let contador = 0;
function doc(captura: string, bytes = 1024): DocumentoInventario {
  contador += 1;
  return {
    url: `https://x.gub.uy/doc-${contador}.pdf`,
    url_archivada: `https://web.archive.org/web/${captura}id_/https://x.gub.uy/doc-${contador}.pdf`,
    captura,
    anio_probable: Number(captura.slice(0, 4)),
    bytes,
    en_sitio_hoy: false,
  };
}

describe('resumirInventario()', () => {
  it('agrupa por año cuando no se pide un único año', () => {
    const docs = [doc('20150101000000'), doc('20150601000000'), doc('20200101000000')];
    const r = resumirInventario(docs);
    expect(r.lineasPorPeriodo).toEqual(['2015  2 documento(s)  2 KB', '2020  1 documento(s)  1 KB']);
  });

  it('agrupa por mes cuando desde y hasta piden el mismo año', () => {
    const docs = [doc('20160301000000'), doc('20160815000000'), doc('20160820000000')];
    const r = resumirInventario(docs, { desde: 2016, hasta: 2016 });
    expect(r.lineasPorPeriodo).toEqual(['2016-03  1 documento(s)  1 KB', '2016-08  2 documento(s)  2 KB']);
  });

  it('no agrupa por mes si desde y hasta son años distintos', () => {
    const docs = [doc('20150301000000'), doc('20200815000000')];
    const r = resumirInventario(docs, { desde: 2015, hasta: 2020 });
    expect(r.lineasPorPeriodo).toEqual(['2015  1 documento(s)  1 KB', '2020  1 documento(s)  1 KB']);
  });

  it('por defecto muestra las 60 URL más recientes primero y avisa que truncó', () => {
    const docs = Array.from({ length: 100 }, (_, i) => doc(`2020${String((i % 12) + 1).padStart(2, '0')}01000000`));
    const r = resumirInventario(docs);
    expect(r.mostrados).toHaveLength(60);
    expect(r.truncado).toBe(true);
    // más reciente primero: comparamos por el campo `captura` en sí, no por índice de creación.
    for (let i = 1; i < r.mostrados.length; i++) {
      expect(r.mostrados[i - 1].captura >= r.mostrados[i].captura).toBe(true);
    }
  });

  it('todos: true devuelve la lista completa sin truncar', () => {
    const docs = Array.from({ length: 100 }, (_, i) => doc(`20200101${String(i).padStart(6, '0')}`));
    const r = resumirInventario(docs, { todos: true });
    expect(r.mostrados).toHaveLength(100);
    expect(r.truncado).toBe(false);
  });

  it('si hay menos documentos que el máximo, no trunca', () => {
    const docs = [doc('20200101000000'), doc('20200102000000')];
    const r = resumirInventario(docs);
    expect(r.truncado).toBe(false);
    expect(r.mostrados).toHaveLength(2);
  });

  it('maximoUrls cambia el corte', () => {
    const docs = Array.from({ length: 10 }, (_, i) => doc(`202001${String(i + 1).padStart(2, '0')}000000`));
    const r = resumirInventario(docs, { maximoUrls: 3 });
    expect(r.mostrados).toHaveLength(3);
    expect(r.truncado).toBe(true);
  });
});
