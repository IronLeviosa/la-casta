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
    // La excepción es específica del host de Wayback: una fuente de prensa que de verdad devuelve
    // 404 sigue contando como caída aunque tuviera una verificación previa exitosa.
    const previa = { http: 200, ok: true, archived_url: null, checked_at: '2026-09-01T00:00:00.000Z' };
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
