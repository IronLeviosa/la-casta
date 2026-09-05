/**
 * Presidentes y vicepresidentes.
 *
 * "Vicepresidente de la República" contiene la cadena "presidente de la república", asi que un
 * filtro ingenuo mete a los vices entre los presidentes. Se probaba solo con presidentes cargados,
 * asi que el error no se veia; al cargar los vices habria aparecido en la linea de tiempo del home.
 */
import { describe, expect, it } from 'vitest';
import { ES_PRESIDENTE, ES_VICEPRESIDENTE } from '../src/lib/roles.ts';

describe('cargo de presidente y de vicepresidente', () => {
  const PRESI = ['Presidente de la República', 'presidente de la republica', '  Presidente de la República Oriental'];
  const VICE = ['Vicepresidente de la República', 'Vice Presidente de la República', 'vicepresidente de la republica'];

  it('reconoce al presidente', () => {
    for (const c of PRESI) expect(ES_PRESIDENTE.test(c)).toBe(true);
  });

  it('no confunde al vicepresidente con el presidente', () => {
    for (const c of VICE) expect(ES_PRESIDENTE.test(c)).toBe(false);
  });

  it('reconoce al vicepresidente', () => {
    for (const c of VICE) expect(ES_VICEPRESIDENTE.test(c)).toBe(true);
  });

  it('no confunde al presidente con el vicepresidente', () => {
    for (const c of PRESI) expect(ES_VICEPRESIDENTE.test(c)).toBe(false);
  });

  it('ignora otros cargos', () => {
    for (const c of ['Senador', 'Diputado', 'Intendente de Canelones', 'Ministro de Economía']) {
      expect(ES_PRESIDENTE.test(c)).toBe(false);
      expect(ES_VICEPRESIDENTE.test(c)).toBe(false);
    }
  });
});
