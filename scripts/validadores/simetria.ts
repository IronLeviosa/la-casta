/**
 * Etapa 6: prueba de simetría. **Nunca falla**: solo informa.
 *
 * La Regla 0 dice que toda regla editorial se aplica igual a todos. Esta etapa
 * hace visible la cobertura desigual en vez de dejarla accidental:
 *
 * 1. Por tema: qué políticos con mandato solapado con el período cubierto por el
 *    tema todavía no tienen ninguna declaración, giro ni chequeo ahí.
 * 2. Por partido y por político: giros por `cambio` y `explicacion`, chequeos por
 *    `calificacion`, casos por `etiqueta_legal` y promesas por `estado`,
 *    normalizados por declaraciones investigadas y por años de mandato.
 *
 * Escribe `data/simetria.json` (lo consume `pnpm exportar` y el sitio).
 *
 * El **cálculo** vive en `src/lib/cobertura.ts`, no acá: el sitio muestra la
 * misma cobertura en `/cobertura/` y en cada perfil, y dos implementaciones del
 * mismo conteo se separan tarde o temprano. Acá quedan la adaptación desde
 * `Contenido`, el informe de texto y la escritura del JSON.
 */
import path from 'node:path';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import type { Contenido, Registro } from '../lib/contenido.ts';
import {
  calcularResumen,
  type Conteos,
  type EntradaSimetria,
  type EstadoTema,
  type PoliticoMinimo,
  type RegistroMinimo,
  type ResumenSimetria,
} from '../../src/lib/cobertura.ts';
import { resultadoVacio, type ResultadoEtapa } from './tipos.ts';

export type { Conteos, EstadoTema, ResumenSimetria };

/** Políticos implicados en un registro (uno, o varios en casos). */
function politicosDe(reg: Registro): string[] {
  const d = reg.datos;
  if (reg.coleccion === 'casos') {
    return (Array.isArray(d.involucrados) ? d.involucrados : []).map((i: { politico: string }) => i.politico).filter(Boolean);
  }
  return typeof d.politico === 'string' ? [d.politico] : [];
}

/** Fecha con la que cada colección marca el período que cubre en su tema. */
function fechaDelTema(contenido: Contenido, reg: Registro): string | undefined {
  const d = reg.datos;
  switch (reg.coleccion) {
    case 'giros':
      return contenido.obtener('declaraciones', d.declaracion_despues)?.datos.fecha;
    case 'promesas':
      return d.fecha_promesa;
    default:
      return d.fecha;
  }
}

/** `Contenido` (YAML ya validado) → la entrada neutral del motor de cobertura. */
export function entradaDesdeContenido(contenido: Contenido): EntradaSimetria {
  const politicos: PoliticoMinimo[] = contenido.de('politicos').map((p) => ({
    id: p.id,
    nombre: p.datos.nombre_corto ?? p.datos.nombre ?? p.id,
    partido: String(p.datos.partido ?? 'sin partido'),
    mandatos: (Array.isArray(p.datos.mandatos) ? p.datos.mandatos : []).map((m: { cargo?: string; desde: string; hasta?: string }) => ({
      cargo: m.cargo,
      desde: m.desde,
      hasta: m.hasta,
    })),
  }));
  const registros: RegistroMinimo[] = contenido.registros.map((reg) => ({
    coleccion: reg.coleccion,
    id: reg.id,
    politicos: politicosDe(reg),
    tema: typeof reg.datos.tema === 'string' ? reg.datos.tema : undefined,
    fecha: fechaDelTema(contenido, reg),
    cambio: reg.datos.cambio,
    explicacion: reg.datos.explicacion,
    calificacion: reg.datos.calificacion,
    etiqueta_legal: reg.datos.etiqueta_legal,
    estado: reg.datos.estado,
  }));
  return { politicos, registros };
}

export function calcularSimetria(contenido: Contenido): ResumenSimetria {
  return calcularResumen(entradaDesdeContenido(contenido));
}

// ---------------------------------------------------------------------------
// Presentación
// ---------------------------------------------------------------------------

/** Tabla de ancho fijo, sin dependencias. */
export function tabla(encabezados: string[], filas: string[][]): string {
  const anchos = encabezados.map((h, i) => Math.max(h.length, ...filas.map((f) => (f[i] ?? '').length)));
  const linea = (celdas: string[]) => celdas.map((c, i) => (c ?? '').padEnd(anchos[i]!)).join('  ').trimEnd();
  const separador = anchos.map((a) => '-'.repeat(a)).join('  ');
  return [linea(encabezados), separador, ...filas.map(linea)].join('\n');
}

export function informeSimetria(resumen: ResumenSimetria): string {
  const partes: string[] = [];

  const filasPartido = Object.entries(resumen.por_partido).map(([partido, c]) => [
    partido,
    String(c.politicos),
    String(c.declaraciones),
    String(c.giros.total),
    String(c.giros.por_cambio.cambio_total ?? 0),
    String(c.chequeos.por_calificacion.falso ?? 0),
    String(c.promesas.por_estado.incumplida ?? 0),
    String(c.casos.total),
    c.anios_mandato.toFixed(1),
    c.normalizado.giros_por_declaracion.toFixed(2),
    c.normalizado.declaraciones_por_anio.toFixed(2),
  ]);
  partes.push('Por partido');
  partes.push(
    tabla(['partido', 'pers.', 'declar.', 'giros', 'c.total', 'falsos', 'incump.', 'casos', 'años', 'giros/dec', 'dec/año'], filasPartido),
  );

  const filasPolitico = Object.entries(resumen.por_politico)
    .filter(([, c]) => c.declaraciones + c.giros.total + c.chequeos.total + c.promesas.total + c.casos.total > 0)
    .map(([slug, c]) => [
      slug,
      String(c.declaraciones),
      String(c.giros.total),
      String(c.chequeos.total),
      String(c.promesas.total),
      String(c.casos.total),
      c.normalizado.giros_por_declaracion.toFixed(2),
      c.normalizado.falsos_por_declaracion.toFixed(2),
    ]);
  partes.push('');
  partes.push('Por político (con registros)');
  partes.push(
    filasPolitico.length
      ? tabla(['politico', 'declar.', 'giros', 'chequeos', 'promesas', 'casos', 'giros/dec', 'falsos/dec'], filasPolitico)
      : '  (todavía no hay registros)',
  );

  const conHuecos = resumen.temas.filter((t) => t.sin_cubrir.length);
  partes.push('');
  partes.push('Cobertura por tema (quién falta con mandato solapado)');
  partes.push(
    conHuecos.length
      ? tabla(
          ['tema', 'período', 'cubiertos', 'sin cubrir'],
          conHuecos.map((t) => [t.tema, `${t.desde ?? '?'} → ${t.hasta ?? '?'}`, t.cubiertos.join(', '), t.sin_cubrir.join(', ')]),
        )
      : '  (sin huecos, o sin temas cubiertos todavía)',
  );

  return partes.join('\n');
}

export interface OpcionesSimetria {
  /** Ruta del JSON de salida (por defecto `<root>/data/simetria.json`). */
  salida?: string;
  /** No escribir el archivo (tests). */
  sinEscribir?: boolean;
}

/** true si el JSON guardado difiere del nuevo en algo que no sea `generado`. */
function cambio(salida: string, resumen: ResumenSimetria): boolean {
  if (!existsSync(salida)) return true;
  try {
    const previo = JSON.parse(readFileSync(salida, 'utf8')) as ResumenSimetria;
    const sinFecha = (r: ResumenSimetria) => JSON.stringify({ ...r, generado: '' });
    return sinFecha(previo) !== sinFecha(resumen);
  } catch {
    return true;
  }
}

export interface ResultadoSimetria extends ResultadoEtapa {
  resumen: ResumenSimetria;
  informe: string;
}

/** Etapa de simetría: calcula, escribe data/simetria.json y devuelve el informe. Nunca produce errores. */
export function validarSimetria(contenido: Contenido, opciones: OpcionesSimetria = {}): ResultadoSimetria {
  const r = resultadoVacio();
  const resumen = calcularSimetria(contenido);

  for (const t of resumen.temas) {
    if (t.sin_cubrir.length) {
      r.avisos.push({
        archivo: `content/temas/${t.tema}.yaml`,
        campo: 'cobertura',
        mensaje: `Cobertura asimétrica: con mandato en el período ${t.desde ?? '?'} → ${t.hasta ?? '?'} y sin ningún registro en este tema: ${t.sin_cubrir.join(', ')}.`,
      });
    }
  }

  if (!opciones.sinEscribir) {
    const salida = opciones.salida ?? path.join(contenido.rootDir, 'data', 'simetria.json');
    const texto = JSON.stringify(resumen, null, 2) + '\n';
    // Solo se reescribe si cambió algo más que la marca de tiempo, para no ensuciar git en cada corrida.
    if (cambio(salida, resumen)) {
      mkdirSync(path.dirname(salida), { recursive: true });
      writeFileSync(salida, texto, 'utf8');
    }
  }

  return { ...r, resumen, informe: informeSimetria(resumen) };
}
