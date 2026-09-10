/**
 * Compara dos árboles de `content/` producidos por el mismo brief y distintos modelos.
 * Uso: pnpm comparar <raiz-a> <raiz-b> [--json] [--corrida <id>] [--similitud 0.8]
 *
 * Es el instrumento del experimento de modelos: sin esto, dos corridas producen dos
 * pilas de YAML y una impresión. Acá solo hay medidas mecánicas y reproducibles.
 *
 * Lo que puede medir una máquina: cuánto cubrió cada brazo, en qué registros coinciden,
 * si califican igual lo que ambos encontraron, y de qué tipo son las fuentes que citan.
 * Lo que NO puede medir: cuál de los dos análisis está mejor escrito o mejor razonado.
 * Eso queda para la adjudicación a ciegas, y este reporte imprime la muestra a adjudicar.
 *
 * Modo aparte, `--criticas` (plan-2026-09 fase 5.2): compara dos `critica.md` del mismo
 * lote —crítico Sonnet contra crítico Opus— en vez de dos árboles de `content/`. Ver
 * `compararCriticas` / `compararCriticasLotes` más abajo y «Protocolo del crítico» en
 * `EXPERIMENTO.md`.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { cargarContenido, type Registro } from './lib/contenido.ts';
import { buscarCita } from './lib/texto.ts';
import { kappaDeCohen, interpretarKappaTresNiveles, type ResultadoKappa } from './lib/kappa.ts';
import { parsearArgs } from './lib/log.ts';
import { extraerBloqueResumen, extraerEncabezadosViejo } from './lote.ts';

/** Dos citas son "la misma" si una aparece en la otra con esta similitud o más. */
const SIMILITUD_POR_DEFECTO = 0.8;
/** Tipos de fuente que el proyecto considera primaria (CLAUDE.md, niveles de evidencia). */
const TIPOS_PRIMARIOS = new Set(['documento_oficial', 'diario_de_sesiones', 'video']);

interface Brazo {
  nombre: string;
  raiz: string;
  registros: Map<string, Registro[]>;
}

function cargarBrazo(raiz: string, nombre: string): Brazo {
  const c = cargarContenido(raiz);
  const porColeccion = new Map<string, Registro[]>();
  for (const r of c.registros) {
    if (!porColeccion.has(r.coleccion)) porColeccion.set(r.coleccion, []);
    porColeccion.get(r.coleccion)!.push(r);
  }
  if (c.errores.length > 0) {
    process.stderr.write(`AVISO: ${nombre} tiene ${c.errores.length} registro(s) que no pasan el esquema; se comparan igual los que sí.\n`);
  }
  return { nombre, raiz, registros: porColeccion };
}

function filtrarPorCorrida(rs: Registro[], corrida: string | null): Registro[] {
  if (!corrida) return rs;
  return rs.filter((r) => String(r.datos?.procedencia?.corrida ?? '') === corrida);
}

/** Similitud simétrica entre dos textos, en [0,1]. */
function similitud(a: string, b: string): number {
  if (!a || !b) return 0;
  const [largo, corto] = a.length >= b.length ? [a, b] : [b, a];
  return buscarCita(largo, corto).similitud;
}

interface Par {
  a: Registro;
  b: Registro;
  similitud: number;
}

/**
 * Empareja registros de los dos brazos: mismo político y misma fecha, y la cita (o el
 * texto) de uno aparece en la del otro. Emparejamiento codicioso por similitud
 * descendente, cada registro se usa una sola vez.
 */
function emparejar(as: Registro[], bs: Registro[], campo: string, umbral: number, claveDura: (r: Registro) => string): { pares: Par[]; soloA: Registro[]; soloB: Registro[] } {
  const candidatos: Par[] = [];
  for (const a of as) {
    for (const b of bs) {
      if (claveDura(a) !== claveDura(b)) continue;
      const s = similitud(String(a.datos[campo] ?? ''), String(b.datos[campo] ?? ''));
      if (s >= umbral) candidatos.push({ a, b, similitud: s });
    }
  }
  candidatos.sort((x, y) => y.similitud - x.similitud);
  const usadosA = new Set<Registro>();
  const usadosB = new Set<Registro>();
  const pares: Par[] = [];
  for (const c of candidatos) {
    if (usadosA.has(c.a) || usadosB.has(c.b)) continue;
    usadosA.add(c.a);
    usadosB.add(c.b);
    pares.push(c);
  }
  return { pares, soloA: as.filter((r) => !usadosA.has(r)), soloB: bs.filter((r) => !usadosB.has(r)) };
}

function fuentesDe(r: Registro): { url: string; medio: string; tipo: string }[] {
  const salida: { url: string; medio: string; tipo: string }[] = [];
  const visitar = (v: unknown): void => {
    if (Array.isArray(v)) {
      for (const x of v) visitar(x);
      return;
    }
    if (!v || typeof v !== 'object') return;
    const o = v as Record<string, unknown>;
    if (typeof o.url === 'string' && typeof o.medio === 'string' && typeof o.tipo === 'string') {
      salida.push({ url: o.url, medio: o.medio, tipo: o.tipo });
    }
    for (const x of Object.values(o)) visitar(x);
  };
  visitar(r.datos);
  return salida;
}

function conteo<T>(items: T[], clave: (t: T) => string): Record<string, number> {
  const c: Record<string, number> = {};
  for (const i of items) {
    const k = clave(i);
    c[k] = (c[k] ?? 0) + 1;
  }
  return c;
}

function comoTexto(c: Record<string, number>): string {
  const e = Object.entries(c).sort((a, b) => b[1] - a[1]);
  return e.length ? e.map(([k, v]) => `${k} ${v}`).join(', ') : '—';
}

function lineaKappa(titulo: string, r: ResultadoKappa): string {
  const k = r.kappa === null ? 'indefinido' : r.kappa.toFixed(2);
  return `  ${titulo.padEnd(26)} n=${String(r.n).padStart(3)}  acuerdo ${(100 * r.acuerdo).toFixed(0).padStart(3)} %  kappa ${k.padStart(9)}  (${r.interpretacion})`;
}

export function comparar(raizA: string, raizB: string, opciones: { corrida?: string | null; umbral?: number } = {}): Record<string, unknown> {
  const umbral = opciones.umbral ?? SIMILITUD_POR_DEFECTO;
  const corrida = opciones.corrida ?? null;
  const A = cargarBrazo(raizA, 'A');
  const B = cargarBrazo(raizB, 'B');
  const salida: Record<string, unknown> = { a: raizA, b: raizB, corrida, umbral };
  const lineas: string[] = [];

  lineas.push(`\nComparación de dos brazos${corrida ? ` · corrida ${corrida}` : ''}`);
  lineas.push(`  A = ${raizA}`);
  lineas.push(`  B = ${raizB}\n`);

  // 1. Volumen y tier por colección.
  lineas.push('Volumen por colección (A → B), y tier');
  const colecciones = [...new Set([...A.registros.keys(), ...B.registros.keys()])].sort();
  const volumen: Record<string, unknown> = {};
  for (const col of colecciones) {
    const as = filtrarPorCorrida(A.registros.get(col) ?? [], corrida);
    const bs = filtrarPorCorrida(B.registros.get(col) ?? [], corrida);
    if (as.length === 0 && bs.length === 0) continue;
    const tierA = conteo(as, (r) => String(r.datos?.revision?.tier ?? '—'));
    const tierB = conteo(bs, (r) => String(r.datos?.revision?.tier ?? '—'));
    volumen[col] = { a: as.length, b: bs.length, tier_a: tierA, tier_b: tierB };
    lineas.push(`  ${col.padEnd(15)} ${String(as.length).padStart(3)} → ${String(bs.length).padStart(3)}   A: ${comoTexto(tierA).padEnd(28)} B: ${comoTexto(tierB)}`);
  }
  salida.volumen = volumen;

  // 2. Declaraciones: cobertura y acuerdo de tier.
  const decA = filtrarPorCorrida(A.registros.get('declaraciones') ?? [], corrida);
  const decB = filtrarPorCorrida(B.registros.get('declaraciones') ?? [], corrida);
  const claveDec = (r: Registro) => `${r.datos.politico}|${r.datos.fecha}`;
  const dec = emparejar(decA, decB, 'cita', umbral, claveDec);
  lineas.push('\nDeclaraciones');
  lineas.push(`  en los dos brazos: ${dec.pares.length}   solo en A: ${dec.soloA.length}   solo en B: ${dec.soloB.length}`);
  const kTier = kappaDeCohen(dec.pares.map((p) => [String(p.a.datos?.revision?.tier ?? '—'), String(p.b.datos?.revision?.tier ?? '—')] as [string, string]));
  const kNivel = kappaDeCohen(dec.pares.map((p) => [String(p.a.datos?.evidencia?.nivel ?? '—'), String(p.b.datos?.evidencia?.nivel ?? '—')] as [string, string]));
  lineas.push(lineaKappa('tier (sobre las comunes)', kTier));
  lineas.push(lineaKappa('nivel de evidencia', kNivel));
  salida.declaraciones = { comunes: dec.pares.length, solo_a: dec.soloA.map((r) => r.id), solo_b: dec.soloB.map((r) => r.id), kappa_tier: kTier, kappa_nivel: kNivel };

  // 3. Giros: se emparejan por el par de declaraciones, que ya sabemos cuáles se corresponden.
  const mapaAB = new Map<string, string>();
  for (const p of dec.pares) mapaAB.set(p.a.id, p.b.id);
  const girosA = filtrarPorCorrida(A.registros.get('giros') ?? [], corrida);
  const girosB = filtrarPorCorrida(B.registros.get('giros') ?? [], corrida);
  const claveGiroB = (r: Registro) => `${r.datos.declaracion_antes}|${r.datos.declaracion_despues}`;
  const porClaveB = new Map(girosB.map((r) => [claveGiroB(r), r]));
  const paresGiro: Par[] = [];
  const girosSoloA: Registro[] = [];
  for (const g of girosA) {
    const antes = mapaAB.get(String(g.datos.declaracion_antes));
    const despues = mapaAB.get(String(g.datos.declaracion_despues));
    const b = antes && despues ? porClaveB.get(`${antes}|${despues}`) : undefined;
    if (b) paresGiro.push({ a: g, b, similitud: 1 });
    else girosSoloA.push(g);
  }
  const emparejadosB = new Set(paresGiro.map((p) => p.b));
  const girosSoloB = girosB.filter((r) => !emparejadosB.has(r));
  lineas.push('\nGiros (emparejados por el par de declaraciones)');
  lineas.push(`  en los dos brazos: ${paresGiro.length}   solo en A: ${girosSoloA.length}   solo en B: ${girosSoloB.length}`);
  const kCambio = kappaDeCohen(paresGiro.map((p) => [String(p.a.datos.cambio), String(p.b.datos.cambio)] as [string, string]));
  const kExpl = kappaDeCohen(paresGiro.map((p) => [String(p.a.datos.explicacion), String(p.b.datos.explicacion)] as [string, string]));
  lineas.push(lineaKappa('cambio', kCambio));
  lineas.push(lineaKappa('explicación', kExpl));
  for (const p of paresGiro) {
    if (p.a.datos.cambio === p.b.datos.cambio && p.a.datos.explicacion === p.b.datos.explicacion) continue;
    lineas.push(`    difieren: ${p.a.id}`);
    lineas.push(`      A: ${p.a.datos.cambio} / ${p.a.datos.explicacion}      B: ${p.b.datos.cambio} / ${p.b.datos.explicacion}`);
  }
  salida.giros = { comunes: paresGiro.length, solo_a: girosSoloA.map((r) => r.id), solo_b: girosSoloB.map((r) => r.id), kappa_cambio: kCambio, kappa_explicacion: kExpl };

  // 4. Promesas: acuerdo en el estado de la escala de Chequeado.
  const promA = filtrarPorCorrida(A.registros.get('promesas') ?? [], corrida);
  const promB = filtrarPorCorrida(B.registros.get('promesas') ?? [], corrida);
  const prom = emparejar(promA, promB, 'texto', umbral, (r) => String(r.datos.politico));
  const kEstado = kappaDeCohen(prom.pares.map((p) => [String(p.a.datos.estado), String(p.b.datos.estado)] as [string, string]));
  lineas.push('\nPromesas');
  lineas.push(`  en los dos brazos: ${prom.pares.length}   solo en A: ${prom.soloA.length}   solo en B: ${prom.soloB.length}`);
  lineas.push(lineaKappa('estado', kEstado));
  for (const p of prom.pares) {
    if (p.a.datos.estado === p.b.datos.estado) continue;
    lineas.push(`    difieren: ${p.a.id}  A: ${p.a.datos.estado}   B: ${p.b.datos.estado}`);
  }
  salida.promesas = { comunes: prom.pares.length, solo_a: prom.soloA.map((r) => r.id), solo_b: prom.soloB.map((r) => r.id), kappa_estado: kEstado };

  // 5. Fuentes: cuántas, cuáles compartidas, y qué proporción es fuente primaria.
  lineas.push('\nFuentes citadas');
  const resumenFuentes: Record<string, unknown> = {};
  const urls: Record<string, Set<string>> = {};
  for (const [nombre, brazo] of [['a', A], ['b', B]] as const) {
    const todas = [...brazo.registros.values()].flatMap((rs) => filtrarPorCorrida(rs, corrida)).flatMap(fuentesDe);
    const u = new Set(todas.map((f) => f.url));
    urls[nombre] = u;
    const primarias = todas.filter((f) => TIPOS_PRIMARIOS.has(f.tipo)).length;
    const medios = new Set(todas.map((f) => f.medio));
    resumenFuentes[nombre] = { citas: todas.length, urls: u.size, medios: medios.size, primarias, tipos: conteo(todas, (f) => f.tipo) };
    lineas.push(`  ${nombre.toUpperCase()}: ${todas.length} citas · ${u.size} URLs · ${medios.size} medios · ${primarias} de tipo primario (${todas.length ? Math.round((100 * primarias) / todas.length) : 0} %)`);
    lineas.push(`     tipos: ${comoTexto(conteo(todas, (f) => f.tipo))}`);
  }
  const comunes = [...urls.a].filter((u) => urls.b.has(u));
  lineas.push(`  URLs en los dos brazos: ${comunes.length}   solo en A: ${urls.a.size - comunes.length}   solo en B: ${urls.b.size - comunes.length}`);
  salida.fuentes = { ...resumenFuentes, urls_comunes: comunes.length };

  // 6. Muestra para adjudicar a ciegas: lo que la máquina no puede decidir.
  const paraAdjudicar = [
    ...paresGiro.filter((p) => p.a.datos.cambio !== p.b.datos.cambio || p.a.datos.explicacion !== p.b.datos.explicacion).map((p) => `giro ${p.a.id}`),
    ...prom.pares.filter((p) => p.a.datos.estado !== p.b.datos.estado).map((p) => `promesa ${p.a.id}`),
    ...dec.pares.filter((p) => p.a.datos?.revision?.tier !== p.b.datos?.revision?.tier).map((p) => `declaración ${p.a.id}`),
  ];
  lineas.push('\nPara adjudicar a ciegas (los dos brazos calificaron distinto lo mismo)');
  if (paraAdjudicar.length === 0) lineas.push('  nada: coinciden en todo lo que ambos encontraron.');
  for (const x of paraAdjudicar.slice(0, 40)) lineas.push(`  ${x}`);
  if (paraAdjudicar.length > 40) lineas.push(`  … y ${paraAdjudicar.length - 40} más.`);
  salida.para_adjudicar = paraAdjudicar;

  lineas.push(
    '\nLo que este reporte NO mide: si el análisis está bien escrito, si el crítico encontró la\n' +
      'objeción que importaba, o si una cita está fuera de contexto. Para eso, `pnpm validar:red`\n' +
      '(verificación mecánica de citas) y la adjudicación a ciegas de la lista de arriba.',
  );

  salida.texto = lineas.join('\n');
  return salida;
}

// ---------------------------------------------------------------------------
// `pnpm comparar --criticas`: acuerdo entre dos critica.md del mismo lote
// (plan-2026-09, fase 5.2 — la única excepción vigente de la regla 14).
// ---------------------------------------------------------------------------

export interface ObjecionCritica {
  registro: string;
  severidad: string;
  tipo: string;
}

export interface CriticaParseada {
  formato: 'nuevo' | 'viejo';
  objeciones: ObjecionCritica[];
}

function normalizarCategoria(v: unknown): string {
  const s = String(v ?? '')
    .trim()
    .toLowerCase();
  return s || 'desconocido';
}

/**
 * Parsea una `critica.md` en cualquiera de los dos formatos que describe
 * `.claude/agents/critico.md` («Formato de `critica.md`»): el bloque `## Resumen` en
 * YAML (formato nuevo) o, si no está, los encabezados `### <registro> …` con líneas
 * `- severidad:` y `- tipo:` (formato viejo). Reusa el parser de `scripts/lote.ts`
 * (el mismo que lee `pnpm lote objeciones`) sin cambiarle el comportamiento: acá solo
 * se normalizan los valores y se arma la lista pareja que necesita el kappa.
 *
 * A diferencia de `pnpm lote objeciones`, acá se incluyen también los registros
 * `sin_objecion`: el acuerdo sobre "no hay nada que objetar" también es acuerdo, y
 * `severidad` tiene esa categoría en su escala (bloquea | corregir | aviso | sin_objecion).
 */
export function parsearCritica(texto: string): CriticaParseada {
  const bloque = extraerBloqueResumen(texto);
  if (bloque) {
    return {
      formato: 'nuevo',
      objeciones: bloque.map((it) => ({
        registro: String(it.registro),
        severidad: normalizarCategoria(it.severidad),
        tipo: normalizarCategoria(it.tipo),
      })),
    };
  }
  // Formato viejo: solo los encabezados que efectivamente declaran severidad. Un `### `
  // sin esa línea (por ejemplo los defectos sistémicos "### S1 — `bloquea` — …" de
  // algunas críticas viejas, donde la severidad va en el título y no en una línea propia)
  // no es un registro individual comparable y se deja fuera en vez de meter ruido.
  const objeciones = extraerEncabezadosViejo(texto)
    .filter((h) => h.severidad !== null)
    .map((h) => ({
      registro: h.registro,
      severidad: normalizarCategoria(h.severidad),
      tipo: normalizarCategoria(h.tipo),
    }));
  return { formato: 'viejo', objeciones };
}

function parsearCriticaDesdeArchivo(ruta: string): CriticaParseada {
  const abs = path.resolve(ruta);
  if (!fs.existsSync(abs)) throw new Error(`No existe ${abs}.`);
  return parsearCritica(fs.readFileSync(abs, 'utf8'));
}

const esObjecion = (o: ObjecionCritica) => o.severidad !== 'sin_objecion' && o.severidad !== 'desconocido';

export interface DesacuerdoCritica {
  registro: string;
  barata: { severidad: string; tipo: string };
  cara: { severidad: string; tipo: string };
}

export interface ResultadoComparacionCriticas {
  barata: string;
  cara: string;
  formato_barata: 'nuevo' | 'viejo';
  formato_cara: 'nuevo' | 'viejo';
  comunes: number;
  solo_barata: string[];
  solo_cara: string[];
  kappa_severidad: ResultadoKappa;
  kappa_tipo: ResultadoKappa;
  /** Pares alineados (barata, cara) sobre severidad; se exponen para el kappa global de `--lotes`. */
  pares_severidad: [string, string][];
  pares_tipo: [string, string][];
  exclusivas_barata: ObjecionCritica[];
  exclusivas_cara: ObjecionCritica[];
  /** `bloquea` que marcó la cara y la barata no igualó (ni encontró el registro, ni lo marcó `bloquea`). */
  bloqueos_no_igualados: ObjecionCritica[];
  desacuerdos: DesacuerdoCritica[];
  veredicto: 'bajo' | 'moderado' | 'alto' | 'indefinido';
  regla14: string;
  texto: string;
}

function lineaRegla14(veredicto: string, bloqueosNoIgualados: ObjecionCritica[]): string {
  if (veredicto === 'alto' && bloqueosNoIgualados.length === 0) {
    return 'Regla 14: acuerdo alto y la crítica barata no dejó pasar ningún `bloquea` que la cara sí marcó — el crítico puede correr en Sonnet.';
  }
  if (veredicto !== 'alto') {
    return `Regla 14: el acuerdo de severidad es ${veredicto} (no alto) — no alcanza para simplificar la regla 14; se sigue con el crítico en Opus o se acumulan más lotes.`;
  }
  return (
    `Regla 14: acuerdo alto, pero la barata dejó pasar ${bloqueosNoIgualados.length} \`bloquea\`(s) que la cara sí marcó ` +
    `(${bloqueosNoIgualados.map((b) => b.registro).join(', ')}) — el crítico se mantiene en Opus.`
  );
}

/**
 * Compara dos críticas del mismo lote, una por cada modelo. `rutaBarata` es la que se
 * quiere validar (Sonnet); `rutaCara` es la de referencia (Opus, la que hoy exige la
 * regla 14). Alinea por `registro`, calcula kappa de Cohen sobre `severidad` y `tipo`,
 * y arma el veredicto de tres niveles y la línea de regla 14 del protocolo del
 * experimento del crítico (`EXPERIMENTO.md`, «Protocolo del crítico»).
 */
export function compararCriticas(rutaBarata: string, rutaCara: string): ResultadoComparacionCriticas {
  const barata = parsearCriticaDesdeArchivo(rutaBarata);
  const cara = parsearCriticaDesdeArchivo(rutaCara);

  const mapaBarata = new Map(barata.objeciones.map((o) => [o.registro, o]));
  const mapaCara = new Map(cara.objeciones.map((o) => [o.registro, o]));
  const registros = [...new Set([...mapaBarata.keys(), ...mapaCara.keys()])];

  const paresSeveridad: [string, string][] = [];
  const paresTipo: [string, string][] = [];
  const desacuerdos: DesacuerdoCritica[] = [];
  const soloBarata: string[] = [];
  const soloCara: string[] = [];
  for (const r of registros) {
    const a = mapaBarata.get(r);
    const b = mapaCara.get(r);
    if (!a) {
      soloCara.push(r);
      continue;
    }
    if (!b) {
      soloBarata.push(r);
      continue;
    }
    paresSeveridad.push([a.severidad, b.severidad]);
    paresTipo.push([a.tipo, b.tipo]);
    if (a.severidad !== b.severidad || a.tipo !== b.tipo) {
      desacuerdos.push({ registro: r, barata: { severidad: a.severidad, tipo: a.tipo }, cara: { severidad: b.severidad, tipo: b.tipo } });
    }
  }

  const exclusivasBarata = barata.objeciones.filter((o) => esObjecion(o) && !esObjecion(mapaCara.get(o.registro) ?? { registro: '', severidad: 'sin_objecion', tipo: '' }));
  const exclusivasCara = cara.objeciones.filter((o) => esObjecion(o) && !esObjecion(mapaBarata.get(o.registro) ?? { registro: '', severidad: 'sin_objecion', tipo: '' }));
  const bloqueosNoIgualados = cara.objeciones.filter((o) => o.severidad === 'bloquea' && mapaBarata.get(o.registro)?.severidad !== 'bloquea');

  const kSeveridad = kappaDeCohen(paresSeveridad);
  const kTipo = kappaDeCohen(paresTipo);
  const veredicto = interpretarKappaTresNiveles(kSeveridad.kappa);
  const regla14 = lineaRegla14(veredicto, bloqueosNoIgualados);

  const lineas: string[] = [];
  lineas.push(`\nComparación de dos críticas del mismo lote`);
  lineas.push(`  barata (Sonnet) = ${rutaBarata}   formato: ${barata.formato}`);
  lineas.push(`  cara   (Opus)   = ${rutaCara}   formato: ${cara.formato}\n`);
  lineas.push(`Alineados por registro: ${paresSeveridad.length}   solo en barata: ${soloBarata.length}   solo en cara: ${soloCara.length}`);
  lineas.push(lineaKappa('severidad', kSeveridad));
  lineas.push(lineaKappa('tipo', kTipo));
  lineas.push(`\nVeredicto (kappa de severidad): ${veredicto}`);
  lineas.push('\nObjeciones que encontró la barata y la cara no, por severidad');
  lineas.push(`  ${exclusivasBarata.length ? comoTexto(conteo(exclusivasBarata, (o) => o.severidad)) : 'ninguna'}`);
  lineas.push('Objeciones que encontró la cara y la barata no, por severidad');
  lineas.push(`  ${exclusivasCara.length ? comoTexto(conteo(exclusivasCara, (o) => o.severidad)) : 'ninguna'}`);
  lineas.push(`\nDesacuerdos (mismo registro, calificación distinta): ${desacuerdos.length}`);
  for (const d of desacuerdos) {
    lineas.push(`  ${d.registro}`);
    lineas.push(`    barata: severidad=${d.barata.severidad} tipo=${d.barata.tipo}`);
    lineas.push(`    cara:   severidad=${d.cara.severidad} tipo=${d.cara.tipo}`);
  }
  lineas.push(`\n${regla14}`);

  return {
    barata: rutaBarata,
    cara: rutaCara,
    formato_barata: barata.formato,
    formato_cara: cara.formato,
    comunes: paresSeveridad.length,
    solo_barata: soloBarata,
    solo_cara: soloCara,
    kappa_severidad: kSeveridad,
    kappa_tipo: kTipo,
    pares_severidad: paresSeveridad,
    pares_tipo: paresTipo,
    exclusivas_barata: exclusivasBarata,
    exclusivas_cara: exclusivasCara,
    bloqueos_no_igualados: bloqueosNoIgualados,
    desacuerdos,
    veredicto,
    regla14,
    texto: lineas.join('\n'),
  };
}

export interface FilaLoteCriticas {
  lote: string;
  barata: string;
  cara: string;
  resultado: ResultadoComparacionCriticas;
}

export interface ResultadoLotesCriticas {
  filas: FilaLoteCriticas[];
  kappa_severidad_global: ResultadoKappa;
  kappa_tipo_global: ResultadoKappa;
  bloqueos_no_igualados_total: number;
  veredicto_global: 'bajo' | 'moderado' | 'alto' | 'indefinido';
  regla14_global: string;
  texto: string;
}

/** Nombre de lote a partir de la carpeta que contiene la crítica: `data/corridas/<id>/critica.md` -> `<id>`. */
function nombreDeLote(rutaBarata: string): string {
  return path.basename(path.dirname(path.resolve(rutaBarata)));
}

/**
 * `<archivo>` de `--lotes`: una línea `barata.md cara.md` por lote (rutas relativas a la
 * carpeta del propio archivo, o absolutas). Líneas en blanco y las que empiezan con `#`
 * se ignoran.
 */
export function parsearArchivoDeLotes(rutaArchivo: string): { barata: string; cara: string }[] {
  const abs = path.resolve(rutaArchivo);
  if (!fs.existsSync(abs)) throw new Error(`No existe ${abs}.`);
  const base = path.dirname(abs);
  const pares: { barata: string; cara: string }[] = [];
  fs.readFileSync(abs, 'utf8')
    .split(/\r?\n/)
    .forEach((linea, i) => {
      const l = linea.trim();
      if (!l || l.startsWith('#')) return;
      const partes = l.split(/\s+/);
      if (partes.length !== 2) {
        throw new Error(`${abs}, línea ${i + 1}: se esperan dos rutas separadas por espacio ("barata.md cara.md"), se encontró "${l}".`);
      }
      pares.push({ barata: path.resolve(base, partes[0]!), cara: path.resolve(base, partes[1]!) });
    });
  if (!pares.length) throw new Error(`${abs} no tiene ningún par de rutas.`);
  return pares;
}

export function compararCriticasLotes(pares: { barata: string; cara: string }[]): ResultadoLotesCriticas {
  const filas: FilaLoteCriticas[] = pares.map(({ barata, cara }) => ({
    lote: nombreDeLote(barata),
    barata,
    cara,
    resultado: compararCriticas(barata, cara),
  }));

  const paresSeveridadGlobal = filas.flatMap((f) => f.resultado.pares_severidad);
  const paresTipoGlobal = filas.flatMap((f) => f.resultado.pares_tipo);
  const bloqueosTotal = filas.reduce((acc, f) => acc + f.resultado.bloqueos_no_igualados.length, 0);

  const kSeveridadGlobal = kappaDeCohen(paresSeveridadGlobal);
  const kTipoGlobal = kappaDeCohen(paresTipoGlobal);
  const veredictoGlobal = interpretarKappaTresNiveles(kSeveridadGlobal.kappa);
  const regla14Global = lineaRegla14(veredictoGlobal, filas.flatMap((f) => f.resultado.bloqueos_no_igualados)).replace(
    'Regla 14:',
    `Regla 14 (${filas.length} lote(s), ${bloqueosTotal} bloqueo(s) sin igualar en total):`,
  );

  const lineas: string[] = [];
  lineas.push(`\nComparación de críticas por lote (${filas.length} lote(s))\n`);
  const encabezado = `  ${'lote'.padEnd(40)}${'comunes'.padStart(9)}${'acuerdo'.padStart(10)}${'kappa sev.'.padStart(12)}${'bloqueos s/igualar'.padStart(20)}`;
  lineas.push(encabezado);
  for (const f of filas) {
    const r = f.resultado;
    const k = r.kappa_severidad.kappa === null ? 'indefinido' : r.kappa_severidad.kappa.toFixed(2);
    lineas.push(
      `  ${f.lote.padEnd(40)}${String(r.comunes).padStart(9)}${`${(100 * r.kappa_severidad.acuerdo).toFixed(0)} %`.padStart(10)}${k.padStart(12)}${String(
        r.bloqueos_no_igualados.length,
      ).padStart(20)}`,
    );
  }
  lineas.push('');
  lineas.push(lineaKappa('severidad (global)', kSeveridadGlobal));
  lineas.push(lineaKappa('tipo (global)', kTipoGlobal));
  lineas.push(`\nVeredicto global (kappa de severidad): ${veredictoGlobal}`);
  lineas.push(`\n${regla14Global}`);

  return {
    filas,
    kappa_severidad_global: kSeveridadGlobal,
    kappa_tipo_global: kTipoGlobal,
    bloqueos_no_igualados_total: bloqueosTotal,
    veredicto_global: veredictoGlobal,
    regla14_global: regla14Global,
    texto: lineas.join('\n'),
  };
}

function quitarTexto<T extends { texto: string }>(r: T): Omit<T, 'texto'> {
  const { texto, ...resto } = r;
  return resto;
}

function mainCriticas(argv: string[]): void {
  const { posicionales, opciones } = parsearArgs(argv);
  const invertido = opciones.barata === 'b';
  try {
    if (typeof opciones.lotes === 'string') {
      const pares = parsearArchivoDeLotes(opciones.lotes).map((p) => (invertido ? { barata: p.cara, cara: p.barata } : p));
      const r = compararCriticasLotes(pares);
      if (opciones.json === true) {
        const resto = quitarTexto(r);
        process.stdout.write(JSON.stringify({ ...resto, filas: resto.filas.map((f) => ({ ...f, resultado: quitarTexto(f.resultado) })) }, null, 1) + '\n');
      } else {
        process.stdout.write(r.texto + '\n');
      }
      return;
    }
    if (posicionales.length < 2) {
      process.stderr.write(
        'Uso: pnpm comparar --criticas <barata.md> <cara.md> [--json] [--barata b]\n' +
          '     pnpm comparar --criticas --lotes <archivo> [--json] [--barata b]\n\n' +
          '  barata = crítico Sonnet (a comparar), cara = crítico Opus (referencia); --barata b invierte cuál es cuál.\n' +
          '  <archivo> de --lotes: una línea "barata.md cara.md" por lote, una comparación por línea.\n',
      );
      process.exit(2);
    }
    const [p1, p2] = posicionales;
    const [rutaBarata, rutaCara] = invertido ? [p2!, p1!] : [p1!, p2!];
    const r = compararCriticas(path.resolve(rutaBarata), path.resolve(rutaCara));
    if (opciones.json === true) {
      process.stdout.write(JSON.stringify(quitarTexto(r), null, 1) + '\n');
    } else {
      process.stdout.write(r.texto + '\n');
    }
  } catch (e) {
    process.stderr.write(`${(e as Error).message}\n`);
    process.exit(1);
  }
}

function main(): void {
  const argv = process.argv.slice(2);
  // `--criticas` es un modo aparte (dos critica.md, no dos árboles de content/). Se saca
  // del argv antes de `parsearArgs` porque ese parser toma el token siguiente a un `--flag`
  // como su valor si no empieza con `--`, y acá lo que sigue son posicionales (rutas).
  const idxCriticas = argv.indexOf('--criticas');
  if (idxCriticas !== -1) {
    mainCriticas([...argv.slice(0, idxCriticas), ...argv.slice(idxCriticas + 1)]);
    return;
  }
  const { posicionales, opciones } = parsearArgs(argv);
  if (posicionales.length < 2) {
    process.stderr.write(
      'Uso: pnpm comparar <raiz-a> <raiz-b> [--corrida <id>] [--similitud 0.8] [--json]\n' +
        '     pnpm comparar --criticas <barata.md> <cara.md> [--json] [--barata b]\n' +
        '     pnpm comparar --criticas --lotes <archivo> [--json] [--barata b]\n\n' +
        '  Cada raíz es una copia del repo (por ejemplo, dos worktrees de git) con su content/.\n' +
        '  --corrida  compara solo los registros de esa corrida (procedencia.corrida).\n' +
        '  --criticas compara dos critica.md del mismo lote (kappa sobre severidad y tipo).\n',
    );
    process.exit(2);
  }
  const r = comparar(path.resolve(posicionales[0]), path.resolve(posicionales[1]), {
    corrida: typeof opciones.corrida === 'string' ? opciones.corrida : null,
    umbral: opciones.similitud !== undefined ? Number(opciones.similitud) : undefined,
  });
  if (opciones.json === true) {
    const { texto, ...resto } = r;
    process.stdout.write(JSON.stringify(resto, null, 1) + '\n');
    return;
  }
  process.stdout.write(String(r.texto) + '\n');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
