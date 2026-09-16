/**
 * Segunda pasada del catálogo (docs/plan-catalogo.md, etapa B): sobre una nota que el etiquetador
 * ya marcó `central` o `secundaria`, con `tiene_afirmaciones`, saca cada afirmación atribuible a
 * un político con su cita literal, la verifica contra `nota.texto` y descarta la que no aparece tal
 * cual, contándola en `catalogo.descartadas`. La verificación usa `buscarCita` de `lib/texto.ts`,
 * el mismo normalizador que ya usa `validar --red` para cotejar citas contra su fuente
 * (`scripts/validadores/citas.ts`): solo se acepta `exacta: true` (literal y contigua, tolerante
 * nada más que a espacios repetidos y a las variantes de comillas/guiones que el normalizador ya
 * colapsaba); una cita "aproximada" no alcanza para el catálogo, que no tiene revisión humana antes
 * de indexarse.
 *
 * Llama a `claude -p --agent extractor` por el mismo camino que el etiquetador
 * (`etiquetar.ts:ejecutarEtiquetadoConClaude`, `buscarClaude` de `lib/ejecutable.ts`): mismos flags
 * (`--tools ""`, `--strict-mcp-config`, `--output-format json`), mismo chequeo de `is_error` con
 * código 0 (OAuth vencido no es un fallo de proceso) y mismo fallback a `--model haiku` si falta
 * `.claude/agents/extractor.md`. No comparte código con `etiquetar.ts` a propósito: son dos rutinas
 * chicas e independientes, y la regla 17 de CLAUDE.md ya avisa del riesgo de tocar una herramienta
 * mientras otra la está usando.
 */
import { existsSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { RAIZ, RUTAS_CONTENIDO } from '../lib/rutas.ts';
import { buscarCita } from '../lib/texto.ts';
import { buscarClaude, ejecutarSync } from '../lib/ejecutable.ts';
import { log } from '../lib/log.ts';
import { cargarTaxonomia, guardarNota, leerNota, type EntradaTaxonomia } from './etiquetar.ts';
import type { Afirmacion, Nota, TipoAfirmacion } from './tipos.ts';

const RUTA_AGENTE = join(RUTAS_CONTENIDO.agentes, 'extractor.md');
const MAX_CHARS_TEXTO = 14_000;
const MIN_CARACTERES_CITA = 20;
const TIPOS_VALIDOS: TipoAfirmacion[] = ['dato', 'promesa', 'posicion', 'mencion_a'];

const INSTRUCCIONES_FALLBACK = `Sos el extractor del catalogo de La Casta (politica uruguaya): sacas afirmaciones atribuibles
a los politicos confirmados en una nota, con cita literal. Devolves SOLO un objeto JSON, sin texto
alrededor ni bloques de codigo:
{"afirmaciones": [{"politico": "slug", "cita": "texto literal de al menos 20 caracteres, copiado tal cual",
"atribucion": "directa"|"indirecta", "tipo": "dato"|"promesa"|"posicion"|"mencion_a", "tema": "slug",
"dato": {"que": "...", "valor": "...", "periodo": "..."} | null, "fecha_dicho": "YYYY-MM-DD" | null}],
"sin_afirmaciones_porque": "motivo" | null}
La cita tiene que ser copia literal y contigua del cuerpo de la nota: un programa la coteja despues, y
la que no aparece tal cual se descarta. Solo politicos de la lista recibida; solo temas de la lista
recibida. "dato" solo para tipo "dato"; en los demas casos, null.`;

/** Forma de la respuesta del rol `extractor` (`.claude/agents/extractor.md`). */
export interface RespuestaExtractor {
  afirmaciones?: {
    politico?: string;
    cita?: string;
    atribucion?: string;
    tipo?: string;
    tema?: string;
    dato?: { que?: string; valor?: string; periodo?: string } | null;
    fecha_dicho?: string | null;
  }[];
  sin_afirmaciones_porque?: string | null;
}

/** Extrae el primer objeto JSON de una respuesta que puede traer texto o ```json alrededor. */
export function extraerJson(texto: string): RespuestaExtractor | null {
  const limpio = texto.replace(/```(?:json)?/gi, '').trim();
  const ini = limpio.indexOf('{');
  const fin = limpio.lastIndexOf('}');
  if (ini < 0 || fin <= ini) return null;
  try {
    return JSON.parse(limpio.slice(ini, fin + 1)) as RespuestaExtractor;
  } catch {
    return null;
  }
}

/** Arma el prompt: la nota, los políticos ya confirmados central/secundaria y los temas de la taxonomía. */
export function armarPromptExtractor(nota: Nota, politicos: EntradaTaxonomia[], temas: EntradaTaxonomia[]): string {
  const texto = nota.texto.length > MAX_CHARS_TEXTO ? nota.texto.slice(0, MAX_CHARS_TEXTO) + '\n[… texto recortado …]' : nota.texto;
  const listaPoliticos = politicos.length ? politicos.map((p) => `- ${p.slug}: ${p.nombre} (alias: ${p.alias.join(', ')})`).join('\n') : '(ninguno)';
  const listaTemas = temas.length ? temas.map((t) => `- ${t.slug}: ${t.nombre}`).join('\n') : '(ninguno)';
  return [
    'POLITICOS CONFIRMADOS EN ESTA NOTA (central o secundaria; el extractor solo trabaja con estos)',
    listaPoliticos,
    '',
    'TEMAS',
    listaTemas,
    '',
    'NOTA',
    `id: ${nota.id}`,
    `medio: ${nota.medio} · fecha: ${nota.fecha ?? '?'} · titulo: ${nota.titulo ?? '?'} · url: ${nota.url_canonica}`,
    '---',
    texto,
    '---',
    'Responde SOLO con el objeto JSON pedido.',
  ].join('\n');
}

export interface ResultadoInterpretacion {
  afirmaciones: Afirmacion[];
  descartadas: number;
  /** Cuántas afirmaciones trajo la respuesta cruda, antes de filtrar (para saber si "0 afirmaciones" es porque no había nada o porque se descartó todo). */
  crudas: number;
}

/**
 * La parte pura de la pasada 2: interpreta la `RespuestaExtractor` ya parseada (JSON de Haiku, o un
 * JSON de ejemplo en un test) contra el texto real de la nota, sin tocar disco ni llamar a nadie.
 * Cada afirmación cruda se descarta si el político, el tipo o el tema no están en las listas
 * válidas, si la cita es corta, o si `buscarCita` no la encuentra literal y contigua en `texto`
 * (mismo cotejo que usa `validar --red`, ver cabecera del archivo). Separada de
 * `ejecutarExtraccionConClaude` justamente para poder probar la verificación de citas con textos y
 * respuestas de ejemplo, sin invocar `claude -p`.
 */
export function interpretarRespuestaExtractor(
  texto: string,
  respuesta: RespuestaExtractor,
  politicosValidos: Set<string>,
  temasValidos: Set<string>,
): ResultadoInterpretacion {
  const crudo = Array.isArray(respuesta.afirmaciones) ? respuesta.afirmaciones : [];
  const afirmaciones: Afirmacion[] = [];
  let descartadas = 0;
  for (const a of crudo) {
    const politico = typeof a?.politico === 'string' ? a.politico : '';
    const cita = typeof a?.cita === 'string' ? a.cita : '';
    const tipoCrudo = typeof a?.tipo === 'string' ? a.tipo : '';
    const tipo = (TIPOS_VALIDOS as string[]).includes(tipoCrudo) ? (tipoCrudo as TipoAfirmacion) : null;
    const tema = typeof a?.tema === 'string' && temasValidos.has(a.tema) ? a.tema : null;
    // Cualquiera de estos cuatro motivos basta para descartar: político fuera de lista, cita corta
    // o ausente, tipo no reconocido, o tema fuera de la taxonomía recibida.
    if (!politico || !politicosValidos.has(politico) || !cita || cita.length < MIN_CARACTERES_CITA || !tipo || !tema) {
      descartadas++;
      continue;
    }
    // La verificación mecánica: la cita tiene que aparecer literal y contigua en el texto guardado
    // (mismo cotejo que `validar --red`, ver cabecera del archivo). Lo que no da "exacta" se
    // descarta entero, no se guarda "aproximada": acá no hay a nadie revisándolo a mano.
    const encontrada = buscarCita(texto, cita);
    if (!encontrada.exacta) {
      descartadas++;
      continue;
    }
    const dato =
      tipo === 'dato' && a?.dato && typeof a.dato === 'object'
        ? { que: String(a.dato.que ?? ''), valor: String(a.dato.valor ?? ''), periodo: a.dato.periodo ? String(a.dato.periodo) : null }
        : null;
    afirmaciones.push({
      politico,
      // Se guarda el tramo que devolvió `buscarCita` sobre el texto ORIGINAL (no la cadena que
      // mandó el modelo): son iguales cuando la cita es exacta salvo por espacios colapsados, y así
      // `posicion` siempre apunta al carácter donde ese tramo empieza de verdad en el texto.
      cita: encontrada.extracto,
      posicion: encontrada.posicion,
      atribucion: a?.atribucion === 'directa' ? 'directa' : 'indirecta',
      tipo,
      tema,
      dato,
      fecha_dicho: typeof a?.fecha_dicho === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(a.fecha_dicho) ? a.fecha_dicho : null,
    });
  }
  return { afirmaciones, descartadas, crudas: crudo.length };
}

export interface ResultadoExtraccion {
  nota: string;
  afirmaciones: number;
  descartadas: number;
  sin_afirmaciones_porque: string | null;
  modelo: string;
  segundos: number;
  tokens_entrada: number;
  tokens_salida: number;
  /** true si no se llamó a Haiku: ya había afirmaciones extraídas, o no hay a quién atribuirle nada. */
  omitida: boolean;
}

/**
 * Corre el extractor Haiku sobre una nota que la pasada 1 (etiquetador) ya dejó con `relevancia`
 * central o secundaria para al menos un político. Sin `--forzar`, si `nota.catalogo.afirmaciones`
 * ya existe (esta nota ya pasó por acá) no vuelve a llamar a Haiku: "una sola vez para todos"
 * también vale para la pasada 2.
 */
export async function ejecutarExtraccionConClaude(notaId: string, opciones: { forzar?: boolean } = {}): Promise<ResultadoExtraccion> {
  const nota = leerNota(notaId);
  if (!nota) throw new Error(`no existe la nota ${notaId}`);

  if (nota.catalogo?.afirmaciones !== undefined && !opciones.forzar) {
    return {
      nota: notaId,
      afirmaciones: nota.catalogo.afirmaciones.length,
      descartadas: nota.catalogo.descartadas ?? 0,
      sin_afirmaciones_porque: null,
      modelo: nota.catalogo.modelo,
      segundos: 0,
      tokens_entrada: 0,
      tokens_salida: 0,
      omitida: true,
    };
  }

  const taxonomia = cargarTaxonomia();
  const relevancia = nota.catalogo?.relevancia ?? {};
  const politicosRelevantes = taxonomia.politicos.filter((p) => relevancia[p.slug] === 'central' || relevancia[p.slug] === 'secundaria');
  if (!politicosRelevantes.length) {
    // No debería pasar si el llamador respeta relevancia + tiene_afirmaciones (así lo hace
    // `corpus/catalogar.ts`), pero sin nadie a quién atribuirle una cita no vale gastar la llamada.
    return {
      nota: notaId,
      afirmaciones: 0,
      descartadas: 0,
      sin_afirmaciones_porque: 'sin políticos con relevancia central o secundaria',
      modelo: '(sin llamar)',
      segundos: 0,
      tokens_entrada: 0,
      tokens_salida: 0,
      omitida: true,
    };
  }

  const claude = buscarClaude();
  if (!claude) throw new Error('no encuentro el CLI `claude` (Claude Code). Instalalo o define CLAUDE_BIN.');
  const prompt = armarPromptExtractor(nota, politicosRelevantes, taxonomia.temas);

  const args = ['-p', '--output-format', 'json', '--tools', '', '--strict-mcp-config'];
  let modelo = 'agente extractor';
  if (existsSync(RUTA_AGENTE)) args.push('--agent', 'extractor');
  else {
    log.aviso(`no existe ${relative(RAIZ, RUTA_AGENTE)}: uso --model haiku con instrucciones minimas`);
    args.push('--model', 'haiku', '--append-system-prompt', INSTRUCCIONES_FALLBACK);
    modelo = 'haiku (fallback)';
  }
  log.info(`claude -p (${modelo}, extractor) sobre ${notaId} (${nota.texto.length} chars)`);
  const t0 = Date.now();
  const r = ejecutarSync(claude, args, { cwd: RAIZ, entrada: prompt, timeoutMs: 5 * 60_000 });
  const segundos = (Date.now() - t0) / 1000;

  let textoRespuesta = r.stdout;
  let respuesta: RespuestaExtractor | null = null;
  let errorClaude: string | null = null;
  let tokensEntrada = 0;
  let tokensSalida = 0;
  try {
    const envoltorio = JSON.parse(r.stdout) as {
      result?: string;
      structured_output?: unknown;
      is_error?: boolean;
      model?: string;
      usage?: { input_tokens?: number; output_tokens?: number; cache_creation_input_tokens?: number; cache_read_input_tokens?: number };
    };
    // Igual que en el etiquetador: con --output-format json, claude sale con código 0 aunque
    // `is_error` sea true (p. ej. "OAuth session expired"). Hay que mirar el campo.
    if (envoltorio.is_error) errorClaude = String(envoltorio.result ?? 'error sin detalle');
    if (envoltorio.structured_output && typeof envoltorio.structured_output === 'object') respuesta = envoltorio.structured_output as RespuestaExtractor;
    textoRespuesta = envoltorio.result ?? r.stdout;
    if (envoltorio.model) modelo = envoltorio.model;
    if (envoltorio.usage) {
      tokensEntrada = Number(envoltorio.usage.input_tokens ?? 0) + Number(envoltorio.usage.cache_creation_input_tokens ?? 0) + Number(envoltorio.usage.cache_read_input_tokens ?? 0);
      tokensSalida = Number(envoltorio.usage.output_tokens ?? 0);
    }
  } catch {
    /* stdout no era el envoltorio JSON: se trata como texto plano */
  }
  if (errorClaude) {
    const pista = /auth|oauth|login|credential/i.test(errorClaude)
      ? ' La sesión de Claude Code de esta máquina no está autenticada: la tiene que abrir una persona.'
      : '';
    throw new Error(`claude -p (extractor) devolvió error: ${errorClaude}.${pista}`);
  }
  if (!r.ok && !textoRespuesta.trim()) throw new Error(`claude -p (extractor) falló (código ${r.codigo}): ${(r.stderr || r.stdout).trim().slice(-600)}`);
  respuesta ??= extraerJson(textoRespuesta);
  if (!respuesta) throw new Error(`la respuesta del extractor no trae JSON: ${textoRespuesta.slice(0, 300)}`);

  const slugsValidos = new Set(politicosRelevantes.map((p) => p.slug));
  const temasValidos = new Set(taxonomia.temas.map((t) => t.slug));
  const { afirmaciones, descartadas, crudas } = interpretarRespuestaExtractor(nota.texto, respuesta, slugsValidos, temasValidos);

  nota.catalogo = {
    ...(nota.catalogo ?? { version: '', modelo, fecha: new Date().toISOString(), relevancia: {}, tiene_afirmaciones: crudas > 0 }),
    afirmaciones,
    descartadas,
  };
  guardarNota(nota);

  const { abrirIndice, indexarNota } = await import('./indexar.ts');
  const indice = abrirIndice();
  try {
    indexarNota(indice, nota);
  } finally {
    indice.cerrar();
  }

  return {
    nota: notaId,
    afirmaciones: afirmaciones.length,
    descartadas,
    sin_afirmaciones_porque: typeof respuesta.sin_afirmaciones_porque === 'string' ? respuesta.sin_afirmaciones_porque : null,
    modelo,
    segundos,
    tokens_entrada: tokensEntrada,
    tokens_salida: tokensSalida,
    omitida: false,
  };
}

async function main(): Promise<void> {
  const [notaId, ...resto] = process.argv.slice(2);
  if (!notaId) {
    process.stderr.write('Uso: tsx scripts/corpus/extraer-afirmaciones.ts <notaId> [--forzar]\n');
    process.exit(2);
  }
  const r = await ejecutarExtraccionConClaude(notaId, { forzar: resto.includes('--forzar') });
  process.stdout.write(JSON.stringify(r, null, 1) + '\n');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    log.error((e as Error).message);
    process.exit(1);
  });
}
