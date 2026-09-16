/**
 * `pnpm validar --inbox <dir> --breve` imprime los avisos del lote que se está validando aunque
 * no se pida `--avisos`: el editor de Astori (2026-09-16) reportó cinco avisos cuyo texto nunca
 * vio porque `--breve` imprimía el conteo y no las líneas.
 */
import { describe, expect, it } from 'vitest';
import { formatoBreve, type Resultado } from '../scripts/validar.ts';

function resultadoCon(avisos: { archivo: string; campo: string; mensaje: string }[]): Resultado {
  return { ok: true, codigo: 0, etapas: [], errores: [], avisos, archivos: 3, registros: 3 };
}

const DEL_LOTE = { archivo: 'inbox/astori/economia/impuestos/2026-09-15/chequeos.yaml#4', campo: 'dato_real', mensaje: 'Falta el documento oficial.' };
const DE_CONTENT = { archivo: 'content/empresas/brou.yaml', campo: 'hitos.15.fuentes.0.url', mensaje: 'Sin verificar en ledger.' };

describe('formatoBreve con avisosDelLote', () => {
  it('imprime solo los avisos de los archivos del lote y los cuenta aparte', () => {
    const salida = formatoBreve(resultadoCon([DEL_LOTE, DE_CONTENT]), { avisosDelLote: 'inbox/astori/economia/impuestos/2026-09-15' });
    expect(salida).toContain('chequeos.yaml#4 · dato_real: Falta el documento oficial.');
    expect(salida).not.toContain('brou.yaml');
    expect(salida).toContain('2 aviso(s) (1 del lote)');
  });

  it('acepta el prefijo con barra final y no confunde un lote con otro de nombre parecido', () => {
    const otro = { ...DEL_LOTE, archivo: 'inbox/astori/economia/impuestos/2026-09-15-b/chequeos.yaml#0' };
    const salida = formatoBreve(resultadoCon([DEL_LOTE, otro]), { avisosDelLote: 'inbox/astori/economia/impuestos/2026-09-15/' });
    expect(salida).toContain('2026-09-15/chequeos.yaml#4');
    expect(salida).not.toContain('2026-09-15-b');
    expect(salida).toContain('(1 del lote)');
  });

  it('sin avisosDelLote se comporta como antes: cuenta y no imprime', () => {
    const salida = formatoBreve(resultadoCon([DEL_LOTE]));
    expect(salida).not.toContain('Falta el documento oficial');
    expect(salida).toContain('1 aviso(s)');
    expect(salida).not.toContain('del lote');
  });

  it('con avisos: true imprime todos, como antes', () => {
    const salida = formatoBreve(resultadoCon([DEL_LOTE, DE_CONTENT]), { avisos: true, avisosDelLote: 'inbox/astori/economia/impuestos/2026-09-15' });
    expect(salida).toContain('brou.yaml');
    expect(salida).toContain('chequeos.yaml#4');
  });
});
