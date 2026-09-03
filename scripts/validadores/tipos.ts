/**
 * Tipos compartidos por todas las etapas del validador.
 */

export interface Problema {
  /** Ruta relativa a la raíz (o `inbox/...#n` para registros del inbox). */
  archivo: string;
  /** Campo afectado con puntos (ej. evidencia.fuentes.1.medio) o "(registro)". */
  campo: string;
  /** Mensaje en español. */
  mensaje: string;
}

export interface ResultadoEtapa {
  errores: Problema[];
  avisos: Problema[];
}

/** Fallo de infraestructura (red caída, ledger no escribible). El orquestador sale con código 2. */
export class ErrorInfraestructura extends Error {
  constructor(mensaje: string) {
    super(mensaje);
    this.name = 'ErrorInfraestructura';
  }
}

export function resultadoVacio(): ResultadoEtapa {
  return { errores: [], avisos: [] };
}
