/**
 * Lectura de `data/fuentes-ledger.json`, el registro que escribe la máquina
 * (`pnpm validar --red`, `pnpm archivar`) con el estado de cada URL citada.
 *
 * El sitio solo lo lee para resolver la copia archivada (Wayback) de cada
 * fuente. La lectura es tolerante: acepta un objeto indexado por URL o una
 * lista de entradas con `url`, y cualquiera de los nombres de campo que el
 * ledger use para la copia archivada (`archived_url`, `archivo`, `wayback`).
 */
import ledgerCrudo from '../../data/fuentes-ledger.json';

export interface EntradaLedger {
  url: string;
  estado?: string;
  http?: number;
  archived_url?: string;
  verificado?: string;
  hash?: string;
}

type Cruda = Record<string, unknown>;

function normalizar(cruda: unknown): Map<string, EntradaLedger> {
  const mapa = new Map<string, EntradaLedger>();
  const agregar = (url: string, v: Cruda) => {
    const archived =
      (v.archived_url as string | undefined) ??
      (v.archivo as string | undefined) ??
      (v.wayback as string | undefined) ??
      (v.archive as string | undefined);
    mapa.set(url, {
      url,
      estado: typeof v.estado === 'string' ? v.estado : typeof v.status === 'string' ? v.status : undefined,
      http: typeof v.http === 'number' ? v.http : typeof v.status_code === 'number' ? v.status_code : undefined,
      archived_url: typeof archived === 'string' && archived.length > 0 ? archived : undefined,
      verificado:
        (v.verificado as string | undefined) ??
        (v.ultima_verificacion as string | undefined) ??
        (v.checked_at as string | undefined),
      hash: typeof v.hash === 'string' ? v.hash : undefined,
    });
  };
  if (Array.isArray(cruda)) {
    for (const e of cruda) {
      if (e && typeof e === 'object' && typeof (e as Cruda).url === 'string') agregar((e as Cruda).url as string, e as Cruda);
    }
  } else if (cruda && typeof cruda === 'object') {
    const obj = cruda as Cruda;
    // Formato { fuentes: {...} } o { urls: {...} } o directamente { url: {...} }
    const interno = (obj.fuentes ?? obj.urls ?? obj) as Cruda;
    for (const [k, v] of Object.entries(interno)) {
      if (v && typeof v === 'object' && /^https?:\/\//.test(k)) agregar(k, v as Cruda);
    }
  }
  return mapa;
}

const LEDGER = normalizar(ledgerCrudo);

export function entradaDe(url: string): EntradaLedger | undefined {
  return LEDGER.get(url);
}

/** URL de la copia archivada: la del registro si la trae, si no la del ledger. */
export function archivoDe(url: string, archivedEnRegistro?: string): string | undefined {
  return archivedEnRegistro ?? LEDGER.get(url)?.archived_url;
}

/** Cantidad de URLs conocidas por el ledger (para la página de datos). */
export function tamanioLedger(): number {
  return LEDGER.size;
}
