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
 */
import path from 'node:path';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { aniosEntre, seSuperponen, type Contenido, type Registro } from '../lib/contenido.ts';
import { resultadoVacio, type ResultadoEtapa } from './tipos.ts';

export interface Conteos {
  declaraciones: number;
  giros: { total: number; por_cambio: Record<string, number>; por_explicacion: Record<string, number> };
  chequeos: { total: number; por_calificacion: Record<string, number> };
  casos: { total: number; por_etiqueta_legal: Record<string, number> };
  promesas: { total: number; por_estado: Record<string, number> };
  menciones: number;
  /** Años de mandato acumulados (suma de los mandatos de la persona o del partido). */
  anios_mandato: number;
  /** Cantidad de personas agregadas (1 en por_politico). */
  politicos: number;
  normalizado: {
    /** Giros por declaración investigada. */
    giros_por_declaracion: number;
    /** Chequeos "falso" por declaración investigada. */
    falsos_por_declaracion: number;
    /** Promesas incumplidas por declaración investigada. */
    incumplidas_por_declaracion: number;
    /** Casos por declaración investigada. */
    casos_por_declaracion: number;
    /** Declaraciones investigadas por año de mandato. */
    declaraciones_por_anio: number;
  };
}

export interface EstadoTema {
  tema: string;
  desde: string | null;
  hasta: string | null;
  cubiertos: string[];
  /** Políticos con mandato solapado y cero registros en el tema. */
  sin_cubrir: string[];
}

export interface ResumenSimetria {
  generado: string;
  total_registros: number;
  por_partido: Record<string, Conteos>;
  por_politico: Record<string, Conteos>;
  temas: EstadoTema[];
}

const CAMBIOS = ['sin_cambio', 'cambio_parcial', 'cambio_total'];
const EXPLICACIONES = ['reconocido_explicitamente', 'justificado_por_contexto', 'sin_explicacion'];
const CALIFICACIONES = ['verdadero', 'discutible', 'falso'];
const ETIQUETAS_LEGALES = ['denuncia', 'formalizado', 'condena', 'cerrado_sin_condena'];
const ESTADOS_PROMESA = ['cumplida', 'en_proceso_adelantada', 'en_proceso_demorada', 'incumplida'];

function conteosVacios(): Conteos {
  const cero = (claves: string[]) => Object.fromEntries(claves.map((k) => [k, 0]));
  return {
    declaraciones: 0,
    giros: { total: 0, por_cambio: cero(CAMBIOS), por_explicacion: cero(EXPLICACIONES) },
    chequeos: { total: 0, por_calificacion: cero(CALIFICACIONES) },
    casos: { total: 0, por_etiqueta_legal: cero(ETIQUETAS_LEGALES) },
    promesas: { total: 0, por_estado: cero(ESTADOS_PROMESA) },
    menciones: 0,
    anios_mandato: 0,
    politicos: 0,
    normalizado: {
      giros_por_declaracion: 0,
      falsos_por_declaracion: 0,
      incumplidas_por_declaracion: 0,
      casos_por_declaracion: 0,
      declaraciones_por_anio: 0,
    },
  };
}

function redondear(n: number, d = 2): number {
  const f = 10 ** d;
  return Math.round(n * f) / f;
}

function cerrarNormalizado(c: Conteos): void {
  const d = c.declaraciones || 0;
  const div = (x: number) => (d > 0 ? redondear(x / d) : 0);
  c.normalizado = {
    giros_por_declaracion: div(c.giros.total),
    falsos_por_declaracion: div(c.chequeos.por_calificacion.falso ?? 0),
    incumplidas_por_declaracion: div(c.promesas.por_estado.incumplida ?? 0),
    casos_por_declaracion: div(c.casos.total),
    declaraciones_por_anio: c.anios_mandato > 0 ? redondear(d / c.anios_mandato) : 0,
  };
  c.anios_mandato = redondear(c.anios_mandato, 1);
}

/** Políticos implicados en un registro (uno, o varios en casos). */
function politicosDe(reg: Registro): string[] {
  const d = reg.datos;
  if (reg.coleccion === 'casos') {
    return (Array.isArray(d.involucrados) ? d.involucrados : []).map((i: { politico: string }) => i.politico).filter(Boolean);
  }
  return typeof d.politico === 'string' ? [d.politico] : [];
}

export function calcularSimetria(contenido: Contenido): ResumenSimetria {
  const porPolitico = new Map<string, Conteos>();
  const partidoDe = new Map<string, string>();
  const mandatosDe = new Map<string, { desde: string; hasta?: string }[]>();

  for (const p of contenido.de('politicos')) {
    porPolitico.set(p.id, conteosVacios());
    partidoDe.set(p.id, String(p.datos.partido ?? 'sin partido'));
    mandatosDe.set(
      p.id,
      (Array.isArray(p.datos.mandatos) ? p.datos.mandatos : []).map((m: { desde: string; hasta?: string }) => ({ desde: m.desde, hasta: m.hasta })),
    );
    const c = porPolitico.get(p.id)!;
    c.politicos = 1;
    for (const m of mandatosDe.get(p.id)!) c.anios_mandato += aniosEntre(m.desde, m.hasta);
  }

  const paraPolitico = (slug: string): Conteos => {
    if (!porPolitico.has(slug)) {
      porPolitico.set(slug, conteosVacios());
      partidoDe.set(slug, 'sin partido');
    }
    return porPolitico.get(slug)!;
  };

  const sumar = (mapa: Record<string, number>, clave: unknown): void => {
    const k = String(clave ?? 'sin_dato');
    mapa[k] = (mapa[k] ?? 0) + 1;
  };

  // Cobertura por tema: quién tiene algo y en qué rango de fechas.
  const cobertura = new Map<string, { politicos: Set<string>; desde: string | null; hasta: string | null }>();
  const anotarTema = (tema: unknown, slug: string, fecha: unknown): void => {
    if (typeof tema !== 'string' || !tema) return;
    if (!cobertura.has(tema)) cobertura.set(tema, { politicos: new Set(), desde: null, hasta: null });
    const c = cobertura.get(tema)!;
    c.politicos.add(slug);
    if (typeof fecha === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      if (!c.desde || fecha < c.desde) c.desde = fecha;
      if (!c.hasta || fecha > c.hasta) c.hasta = fecha;
    }
  };

  let total = 0;
  for (const reg of contenido.registros) {
    const d = reg.datos;
    const slugs = politicosDe(reg);
    if (!slugs.length) continue;
    switch (reg.coleccion) {
      case 'declaraciones':
        total++;
        for (const s of slugs) paraPolitico(s).declaraciones++;
        anotarTema(d.tema, slugs[0]!, d.fecha);
        break;
      case 'giros':
        total++;
        for (const s of slugs) {
          const c = paraPolitico(s);
          c.giros.total++;
          sumar(c.giros.por_cambio, d.cambio);
          sumar(c.giros.por_explicacion, d.explicacion);
        }
        anotarTema(d.tema, slugs[0]!, contenido.obtener('declaraciones', d.declaracion_despues)?.datos.fecha);
        break;
      case 'chequeos':
        total++;
        for (const s of slugs) {
          const c = paraPolitico(s);
          c.chequeos.total++;
          sumar(c.chequeos.por_calificacion, d.calificacion);
        }
        anotarTema(d.tema, slugs[0]!, d.fecha);
        break;
      case 'promesas':
        total++;
        for (const s of slugs) {
          const c = paraPolitico(s);
          c.promesas.total++;
          sumar(c.promesas.por_estado, d.estado);
        }
        anotarTema(d.tema, slugs[0]!, d.fecha_promesa);
        break;
      case 'casos':
        total++;
        for (const s of slugs) {
          const c = paraPolitico(s);
          c.casos.total++;
          sumar(c.casos.por_etiqueta_legal, d.etiqueta_legal);
        }
        break;
      case 'menciones':
        total++;
        for (const s of slugs) paraPolitico(s).menciones++;
        break;
      default:
        break;
    }
  }

  // Temas: quién falta.
  const temas: EstadoTema[] = [];
  for (const [tema, c] of [...cobertura.entries()].sort()) {
    const sinCubrir: string[] = [];
    for (const [slug, mandatos] of mandatosDe) {
      if (c.politicos.has(slug)) continue;
      const solapa = c.desde && c.hasta ? mandatos.some((m) => seSuperponen(m.desde, m.hasta, c.desde!, c.hasta!)) : mandatos.length > 0;
      if (solapa) sinCubrir.push(slug);
    }
    temas.push({ tema, desde: c.desde, hasta: c.hasta, cubiertos: [...c.politicos].sort(), sin_cubrir: sinCubrir.sort() });
  }

  // Agregado por partido.
  const porPartido = new Map<string, Conteos>();
  for (const [slug, c] of porPolitico) {
    const partido = partidoDe.get(slug) ?? 'sin partido';
    if (!porPartido.has(partido)) porPartido.set(partido, conteosVacios());
    const p = porPartido.get(partido)!;
    p.declaraciones += c.declaraciones;
    p.menciones += c.menciones;
    p.anios_mandato += c.anios_mandato;
    p.politicos += c.politicos;
    p.giros.total += c.giros.total;
    p.chequeos.total += c.chequeos.total;
    p.casos.total += c.casos.total;
    p.promesas.total += c.promesas.total;
    for (const k of CAMBIOS) p.giros.por_cambio[k]! += c.giros.por_cambio[k] ?? 0;
    for (const k of EXPLICACIONES) p.giros.por_explicacion[k]! += c.giros.por_explicacion[k] ?? 0;
    for (const k of CALIFICACIONES) p.chequeos.por_calificacion[k]! += c.chequeos.por_calificacion[k] ?? 0;
    for (const k of ETIQUETAS_LEGALES) p.casos.por_etiqueta_legal[k]! += c.casos.por_etiqueta_legal[k] ?? 0;
    for (const k of ESTADOS_PROMESA) p.promesas.por_estado[k]! += c.promesas.por_estado[k] ?? 0;
  }

  for (const c of porPolitico.values()) cerrarNormalizado(c);
  for (const c of porPartido.values()) cerrarNormalizado(c);

  const ordenado = <T>(m: Map<string, T>): Record<string, T> => Object.fromEntries([...m.entries()].sort(([a], [b]) => (a < b ? -1 : 1)));

  return {
    generado: new Date().toISOString(),
    total_registros: total,
    por_partido: ordenado(porPartido),
    por_politico: ordenado(porPolitico),
    temas,
  };
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
