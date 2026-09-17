/**
 * Ledger bajo carga de Wayback (plan 2026-09, ítem 1.11).
 *
 * `validarFuentes` recibe un `verificarUrl` inyectado (nunca toca la red real): simula un 404 o un
 * 429 de `web.archive.org` y comprueba que una verificación previa exitosa no se pisa, que se anota
 * el intento fallido, y que el resumen distingue «caída» (ok:false de esta corrida) de «no
 * comprobada hoy» (se conservó el estado anterior).
 */
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { validarFuentes, type VerificadorUrl } from '../scripts/validadores/fuentes.ts';
import { construirContenido, type Contenido, type Registro } from '../scripts/lib/contenido.ts';
import { escribirLedger, leerLedger, type Ledger } from '../scripts/lib/ledger.ts';

const URL_WAYBACK = 'https://web.archive.org/web/20200101000000/https://ejemplo.uy/nota-original';
const URL_NORMAL = 'https://ejemplo.uy/nota-viva';

const temporales: string[] = [];
afterEach(() => {
  for (const d of temporales.splice(0)) rmSync(d, { recursive: true, force: true });
});

function ledgerTemporal(inicial: Ledger = {}): string {
  const dir = mkdtempSync(path.join(tmpdir(), 'la-casta-ledger-'));
  temporales.push(dir);
  const ruta = path.join(dir, 'fuentes-ledger.json');
  escribirLedger(ruta, inicial);
  return ruta;
}

/** Contenido con un solo registro publicado que cita `url`. */
function contenidoConFuente(url: string): Contenido {
  const registro: Registro = {
    coleccion: 'declaraciones',
    id: 'prueba/caso',
    archivo: 'content/declaraciones/prueba/caso.yaml',
    datos: {
      revision: { tier: 'publicado' },
      evidencia: { nivel: 'textual', fuentes: [{ url, cita: 'una cita cualquiera de prueba', medio: 'ejemplo', fecha: '2020-01-01' }] },
    },
    crudo: {},
    enInbox: false,
  };
  return construirContenido('/repo-de-prueba', [registro], [], 1);
}

describe('validarFuentes: 404 del sitio original con verificación previa (dos fallos con un día de distancia)', () => {
  const URL_ORIGEN = 'https://documents1.worldbank.org/curated/en/1/txt/informe.txt';

  it('el primer 404 conserva la verificación previa y anota ultimo_fallo', async () => {
    const previa = { http: 200, ok: true, archived_url: null, checked_at: '2026-09-10T00:00:00.000Z' };
    const ledgerPath = ledgerTemporal({ [URL_ORIGEN]: previa });
    const verificarUrl: VerificadorUrl = async () => ({ http: 404, archived_url: null });

    const r = await validarFuentes(contenidoConFuente(URL_ORIGEN), { ledgerPath, verificarUrl });

    expect(r.errores).toEqual([]);
    expect(r.caidas).toBe(0);
    expect(r.noComprobadas).toBe(1);
    const entrada = leerLedger(ledgerPath)[URL_ORIGEN];
    expect(entrada.ok).toBe(true);
    expect(entrada.checked_at).toBe(previa.checked_at);
    expect(entrada.ultimo_fallo).toBeTruthy();
    expect(entrada.error).toContain('404');
  });

  it('un segundo 404 con más de 24 horas desde el primero la da por caída', async () => {
    const hace30h = new Date(Date.now() - 30 * 3_600_000).toISOString();
    const previa = { http: 200, ok: true, archived_url: null, checked_at: '2026-09-10T00:00:00.000Z', ultimo_fallo: hace30h, error: 'el original devolvió HTTP 404' };
    const ledgerPath = ledgerTemporal({ [URL_ORIGEN]: previa });
    const verificarUrl: VerificadorUrl = async () => ({ http: 404, archived_url: null });

    const r = await validarFuentes(contenidoConFuente(URL_ORIGEN), { ledgerPath, verificarUrl });

    expect(r.caidas).toBe(1);
    expect(r.errores.length).toBe(1);
    const entrada = leerLedger(ledgerPath)[URL_ORIGEN];
    expect(entrada.ok).toBe(false);
    expect(entrada.http).toBe(404);
  });

  it('un segundo 404 a menos de 24 horas del primero sigue sin voltearla', async () => {
    const hace2h = new Date(Date.now() - 2 * 3_600_000).toISOString();
    const previa = { http: 200, ok: true, archived_url: null, checked_at: '2026-09-10T00:00:00.000Z', ultimo_fallo: hace2h, error: 'el original devolvió HTTP 404' };
    const ledgerPath = ledgerTemporal({ [URL_ORIGEN]: previa });
    const verificarUrl: VerificadorUrl = async () => ({ http: 404, archived_url: null });

    const r = await validarFuentes(contenidoConFuente(URL_ORIGEN), { ledgerPath, verificarUrl });

    expect(r.caidas).toBe(0);
    expect(leerLedger(ledgerPath)[URL_ORIGEN].ok).toBe(true);
  });

  it('un 2xx después de un primer fallo borra la marca', async () => {
    const previa = { http: 200, ok: true, archived_url: null, checked_at: '2026-09-10T00:00:00.000Z', ultimo_fallo: '2026-09-14T00:00:00.000Z', error: 'el original devolvió HTTP 404' };
    const ledgerPath = ledgerTemporal({ [URL_ORIGEN]: previa });
    const verificarUrl: VerificadorUrl = async () => ({ http: 200, archived_url: null });

    await validarFuentes(contenidoConFuente(URL_ORIGEN), { ledgerPath, verificarUrl });

    const entrada = leerLedger(ledgerPath)[URL_ORIGEN];
    expect(entrada.ok).toBe(true);
    expect(entrada.ultimo_fallo).toBeUndefined();
  });

  it('un 404 sin verificación previa sí es una fuente caída (no hay nada que conservar)', async () => {
    const ledgerPath = ledgerTemporal({});
    const verificarUrl: VerificadorUrl = async () => ({ http: 404, archived_url: null });

    const r = await validarFuentes(contenidoConFuente(URL_ORIGEN), { ledgerPath, verificarUrl });

    expect(r.caidas).toBe(1);
    expect(leerLedger(ledgerPath)[URL_ORIGEN].ok).toBe(false);
  });
});

describe('validarFuentes: 404/429 de web.archive.org con verificación previa', () => {
  it('un 404 de web.archive.org no pisa una verificación previa exitosa', async () => {
    const previa = { http: 200, ok: true, archived_url: null, checked_at: '2026-09-01T00:00:00.000Z' };
    const ledgerPath = ledgerTemporal({ [URL_WAYBACK]: previa });
    const verificarUrl: VerificadorUrl = async () => ({ http: 404, archived_url: null });

    const r = await validarFuentes(contenidoConFuente(URL_WAYBACK), { ledgerPath, verificarUrl });

    expect(r.errores).toEqual([]);
    expect(r.caidas).toBe(0);
    expect(r.noComprobadas).toBe(1);
    const entrada = leerLedger(ledgerPath)[URL_WAYBACK];
    expect(entrada.ok).toBe(true);
    expect(entrada.http).toBe(200); // se conserva el http de la verificación anterior
    expect(entrada.checked_at).toBe(previa.checked_at); // no se actualiza: no se comprobó hoy
    expect(entrada.ultimo_fallo).toBeTruthy();
    expect(entrada.error).toContain('404');
  });

  it('un 429 de web.archive.org tampoco pisa una verificación previa exitosa', async () => {
    const previa = { http: 200, ok: true, archived_url: 'https://web.archive.org/web/20190101/https://ejemplo.uy/x', checked_at: '2026-09-05T00:00:00.000Z' };
    const ledgerPath = ledgerTemporal({ [URL_WAYBACK]: previa });
    const verificarUrl: VerificadorUrl = async () => ({ http: 429, archived_url: null });

    const r = await validarFuentes(contenidoConFuente(URL_WAYBACK), { ledgerPath, verificarUrl });

    expect(r.errores).toEqual([]);
    expect(r.noComprobadas).toBe(1);
    expect(r.caidas).toBe(0);
    const entrada = leerLedger(ledgerPath)[URL_WAYBACK];
    expect(entrada.ok).toBe(true);
    expect(entrada.archived_url).toBe(previa.archived_url);
    expect(entrada.error).toContain('429');
  });

  it('un 404 de web.archive.org SIN verificación previa sí cuenta como caída', async () => {
    const ledgerPath = ledgerTemporal({});
    const verificarUrl: VerificadorUrl = async () => ({ http: 404, archived_url: null });

    const r = await validarFuentes(contenidoConFuente(URL_WAYBACK), { ledgerPath, verificarUrl });

    expect(r.caidas).toBe(1);
    expect(r.noComprobadas).toBe(0);
    expect(r.errores.some((e) => e.mensaje.includes('Fuente no responde'))).toBe(true);
    const entrada = leerLedger(ledgerPath)[URL_WAYBACK];
    expect(entrada.ok).toBe(false);
    expect(entrada.http).toBe(404);
  });

  it('un 404 de una fuente que NO es web.archive.org no entra en la excepción de Wayback', async () => {
    // La excepción de Wayback es incondicional; para el sitio original rige la regla de los dos
    // fallos con un día de distancia (bloque de arriba): una fuente de prensa que ya falló hace
    // más de 24 horas y vuelve a devolver 404 cuenta como caída aunque tuviera una verificación
    // previa exitosa.
    const previa = { http: 200, ok: true, archived_url: null, checked_at: '2026-09-01T00:00:00.000Z', ultimo_fallo: new Date(Date.now() - 30 * 3_600_000).toISOString(), error: 'el original devolvió HTTP 404' };
    const ledgerPath = ledgerTemporal({ [URL_NORMAL]: previa });
    const verificarUrl: VerificadorUrl = async () => ({ http: 404, archived_url: null });

    const r = await validarFuentes(contenidoConFuente(URL_NORMAL), { ledgerPath, verificarUrl });

    expect(r.caidas).toBe(1);
    expect(r.noComprobadas).toBe(0);
    const entrada = leerLedger(ledgerPath)[URL_NORMAL];
    expect(entrada.ok).toBe(false);
  });

  it('HTTP 0 (fallo de red genérico) sigue conservando la verificación previa, como antes', async () => {
    const previa = { http: 200, ok: true, archived_url: null, checked_at: '2026-09-01T00:00:00.000Z' };
    const ledgerPath = ledgerTemporal({ [URL_NORMAL]: previa });
    const verificarUrl: VerificadorUrl = async () => ({ http: 0, archived_url: null, error: 'timeout' });

    const r = await validarFuentes(contenidoConFuente(URL_NORMAL), { ledgerPath, verificarUrl });

    expect(r.noComprobadas).toBe(1);
    expect(r.caidas).toBe(0);
    const entrada = leerLedger(ledgerPath)[URL_NORMAL];
    expect(entrada.ok).toBe(true);
    expect(entrada.error).toBe('timeout');
  });

  it('una fuente viva no cuenta ni como caída ni como no comprobada', async () => {
    const ledgerPath = ledgerTemporal({});
    const verificarUrl: VerificadorUrl = async () => ({ http: 200, archived_url: null });

    const r = await validarFuentes(contenidoConFuente(URL_NORMAL), { ledgerPath, verificarUrl });

    expect(r.caidas).toBe(0);
    expect(r.noComprobadas).toBe(0);
    expect(r.verificadas).toBe(1);
  });
});

/**
 * Modo corrección ("no peor que lo publicado", mismo criterio que `presentacion` y `citas`): una
 * corrección que no toca evidencia no tiene por qué pagar de nuevo una url que ya estaba caída en lo
 * publicado. Mismo patrón que `tests/citas.test.ts`: `Contenido` a mano, sin fixture en disco ni red
 * real (`verificarUrl` inyectado).
 */
describe('validarFuentes: modo corrección ("no peor que lo publicado")', () => {
  const URL_HEREDADA = 'https://ejemplo.uy/nota-caida-heredada';
  const URL_PUBLICADA_SANA = 'https://ejemplo.uy/nota-sana-publicada';
  const URL_NUEVA = 'https://ejemplo.uy/nota-caida-nueva';

  function declaracion(id: string, enInbox: boolean, url: string): Registro {
    return {
      coleccion: 'declaraciones',
      id,
      archivo: enInbox ? `inbox/declaraciones.yaml#${id}` : `content/declaraciones/${id}.yaml`,
      datos: { revision: { tier: 'publicado' }, evidencia: { nivel: 'reportado', fuentes: [{ url, cita: 'una cita cualquiera de prueba', medio: 'ejemplo', fecha: '2020-01-01' }] } },
      crudo: {},
      enInbox,
    };
  }

  function correccion(afecta: string[]): Registro {
    return {
      coleccion: 'correcciones',
      id: '2026-09-16-test-no-peor-que-publicado',
      archivo: 'inbox/correcciones.yaml#0',
      datos: { afecta },
      crudo: {},
      enInbox: true,
    };
  }

  const idHeredado = 'lacalle-pou/2020-01-01-heredado';
  const idNuevo = 'lacalle-pou/2020-01-01-nuevo';

  function contenidoDeCorreccion(conCorreccion: boolean): Contenido {
    const registros: Registro[] = [
      declaracion(idHeredado, false, URL_HEREDADA), // publicado: ya citaba la url caída
      declaracion(idHeredado, true, URL_HEREDADA), // copia del lote, sin cambios
      declaracion(idNuevo, false, URL_PUBLICADA_SANA), // publicado: citaba otra url, sana
      declaracion(idNuevo, true, URL_NUEVA), // el lote cambió a una url nueva, que también cae
    ];
    if (conCorreccion) registros.push(correccion([`declaraciones/${idHeredado}`, `declaraciones/${idNuevo}`]));
    return construirContenido('/repo-de-prueba', registros, [], registros.length);
  }

  const verificarUrlQueSiempreCae: VerificadorUrl = async () => ({ http: 404, archived_url: null });

  it('una url que ya estaba caída en lo publicado pasa a aviso; una url nueva sigue cortando', async () => {
    const ledgerPath = ledgerTemporal({});
    const r = await validarFuentes(contenidoDeCorreccion(true), { modoInbox: true, correccion: true, ledgerPath, verificarUrl: verificarUrlQueSiempreCae });

    expect(r.errores.some((e) => e.archivo.includes('nuevo') && e.mensaje.includes('Fuente no responde'))).toBe(true);
    expect(r.errores.some((e) => e.archivo.includes('heredado'))).toBe(false);
    expect(r.avisos.some((a) => a.archivo.includes('heredado') && a.mensaje.includes('ya fallaba así en lo publicado'))).toBe(true);
    expect(r.heredados).toBe(1);
  });

  it('sin ningún registro de corrección en el lote, la misma url heredada corta igual que cualquier otra', async () => {
    const ledgerPath = ledgerTemporal({});
    const r = await validarFuentes(contenidoDeCorreccion(false), { modoInbox: true, ledgerPath, verificarUrl: verificarUrlQueSiempreCae });

    expect(r.heredados).toBe(0);
    expect(r.errores.some((e) => e.archivo.includes('heredado'))).toBe(true);
    expect(r.avisos.some((a) => a.mensaje.includes('ya fallaba así en lo publicado'))).toBe(false);
  });
});
