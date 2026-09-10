// Genera el brief de una corrida de investigación y lo guarda en data/corridas/<id>/brief.md.
// Uso: pnpm brief <politico> <tema> [--casos "<instrucción explícita sobre casos>"] [--fecha YYYY-MM-DD]
//   o: pnpm brief <politico> --vetos [--fecha YYYY-MM-DD]
//   o: pnpm brief <politico> --programa <url> --eleccion <año> [--fecha YYYY-MM-DD]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

const leerYaml = (p: string) => parse(fs.readFileSync(p, 'utf8'));

// Solo lo que le sirve al investigador de cada colección: la cabecera, «Campos» e «Investigación».
// Las secciones «Edición» y «Crítica» las leen el editor y el crítico por su cuenta.
const SECCIONES_DEL_INVESTIGADOR = /^## (Campos|Investigaci[oó]n|Reglas|Umbral)/;

export interface OpcionesBrief {
  /** Corrida de vetos (`pnpm brief <politico> --vetos`). */
  vetos?: boolean;
  /** Corrida de programa de gobierno (`pnpm brief <politico> --programa <url> --eleccion <año>`). */
  programa?: string;
  /** Año de la elección a la que corresponde el programa (obligatorio junto con `programa`). */
  eleccion?: string;
  /** Instrucción explícita sobre casos judiciales (solo modo tema). */
  casos?: string | null;
  fecha?: string;
}

export interface ResultadoBrief {
  id: string;
  brief: string;
}

/**
 * Arma el texto del brief de una corrida sobre el árbol de contenido que cuelga de `raiz`
 * (`raiz/content/...`), sin tocar disco fuera de esa lectura. Separado de `main()` para que
 * los tests puedan armar un brief sobre una fixture temporal sin pasar por la CLI.
 */
export function construirBrief(raiz: string, politico: string, tema: string | undefined, opciones: OpcionesBrief = {}): ResultadoBrief {
  const esVetos = opciones.vetos === true;
  const programaUrl = opciones.programa ?? null;
  const eleccion = opciones.eleccion ?? null;
  const esPrograma = programaUrl !== null;
  const casos = opciones.casos ?? null;
  const fecha = opciones.fecha ?? new Date().toISOString().slice(0, 10);

  if (!politico || (!tema && !esVetos && !esPrograma)) {
    throw new Error(
      'Uso: pnpm brief <politico> <tema> [--casos "..."]\n' +
        '       pnpm brief <politico> --vetos\n' +
        '       pnpm brief <politico> --programa <url> --eleccion <año>',
    );
  }
  if (esPrograma && !eleccion) throw new Error('Falta --eleccion <año> para el modo --programa.');

  const pPol = path.join(raiz, 'content', 'politicos', `${politico}.yaml`);
  const pTema = esVetos || esPrograma ? null : path.join(raiz, 'content', 'temas', `${tema}.yaml`);
  if (!fs.existsSync(pPol)) throw new Error(`No existe ${pPol}`);
  if (pTema && !fs.existsSync(pTema)) throw new Error(`No existe ${pTema}`);
  const pol = leerYaml(pPol);
  const tem = pTema ? leerYaml(pTema) : {};

  // temas hijos
  const dirTema = esVetos || esPrograma ? null : path.join(raiz, 'content', 'temas', tema as string);
  const hijos = dirTema && fs.existsSync(dirTema) ? fs.readdirSync(dirTema).filter((f) => f.endsWith('.yaml')).map((f) => `${tema}/${f.replace('.yaml', '')}`) : [];

  // medios
  const medios = fs.readdirSync(path.join(raiz, 'content', 'medios')).filter((f) => f.endsWith('.yaml')).map((f) => {
    const m = leerYaml(path.join(raiz, 'content', 'medios', f));
    return `| ${f.replace('.yaml', '')} | ${m.nombre} | ${m.grupo} | ${m.alineamiento?.etiqueta ?? 'sin_datos'} |`;
  });

  // pistas
  let corpusDir = path.resolve(raiz, '..', 'la-casta-corpus');
  if (fs.existsSync(path.join(raiz, '.env'))) {
    const m = fs.readFileSync(path.join(raiz, '.env'), 'utf8').match(/^CORPUS_DIR=(.+)$/m);
    if (m) corpusDir = path.resolve(raiz, m[1].trim());
  }
  const pPistas = path.join(corpusDir, 'pistas', `${politico}.yaml`);
  const pistas = fs.existsSync(pPistas) ? fs.readFileSync(pPistas, 'utf8') : '(sin pistas registradas)';

  const primerMandato = (pol.mandatos ?? []).map((m: any) => String(m.desde)).sort()[0] ?? '2000-01-01';
  const anioCampania = Number(primerMandato.slice(0, 4)) - 1;
  const id = esVetos
    ? `${fecha}-${politico}-vetos`
    : esPrograma
      ? `${fecha}-${politico}-programa-${eleccion}`
      : `${fecha}-${politico}-${(tema as string).replace(/\//g, '-')}`;
  const mandatos = (pol.mandatos ?? []).map((m: any) => `- ${m.cargo}: ${m.desde} → ${m.hasta ?? 'en curso'}`).join('\n');

  // Reglas de las colecciones que esta corrida toca, copiadas al brief: el agente no lee CLAUDE.md
  // ni los archivos de docs/ por su cuenta, y el brief queda hasheado en procedencia.brief_sha.
  const colecciones = esVetos ? ['vetos', 'declaraciones'] : esPrograma ? ['promesas', 'declaraciones'] : ['declaraciones', 'promesas', 'menciones', 'chequeos'];
  const reglasColecciones = colecciones
    .map((c) => {
      const p = path.join(raiz, 'docs', 'colecciones', `${c}.md`);
      if (!fs.existsSync(p)) return `(falta docs/colecciones/${c}.md)`;
      const partes = fs.readFileSync(p, 'utf8').trim().split(/\n(?=## )/);
      return partes.filter((s, i) => i === 0 || SECCIONES_DEL_INVESTIGADOR.test(s)).join('\n').trim();
    })
    .join('\n\n');

  const brief = `# Brief de investigación · corrida ${id}

${
  esPrograma
    ? `Regla 0: objetividad por encima de todo. El mismo criterio de qué es una promesa concreta (sección 2) vale para todas las candidaturas de esta elección, sin excepción. Este brief pide cargar todas las promesas que trae el programa, no las que ya sabés que después se cumplieron o se incumplieron. Si el programa de otra candidatura de la misma elección todavía no tiene su corrida, el informe final lo dice, para que la corrida siguiente sea esa. Si algo acá te parece asimétrico, decilo en \`objeciones_al_brief\` y aplicá el criterio simétrico.`
    : `Regla 0: objetividad por encima de todo. Este brief pide cubrir el período completo y todo lo que la persona dijo sobre el tema, favorable o desfavorable, consistente o contradictorio. Si algo acá te parece asimétrico, decilo en \`objeciones_al_brief\` y aplicá el criterio simétrico.`
}

## 1. Político
- slug: \`${politico}\`
- nombre: ${pol.nombre} (${pol.nombre_corto ?? ''})
- partido: ${pol.partido}
- alias: ${(pol.alias ?? []).join(', ')}
- alias ambiguos: ${(pol.alias_ambiguos ?? []).map((a: any) => `"${a.alias}": ${a.nota}`).join(' | ') || 'ninguno'}
- mandatos:
${mandatos}
- estado actual: ${pol.estado_actual?.situacion}${pol.estado_actual?.salida ? ` (salida: ${pol.estado_actual.salida.tipo} el ${pol.estado_actual.salida.fecha})` : ''}
${esPrograma ? `- elección: ${eleccion}` : `- período a cubrir: desde la campaña previa al primer mandato (${anioCampania}) hasta hoy (${fecha}), incluidas oposición y posmandato.`}

## 2. ${esVetos ? 'Objeto de la corrida: los vetos' : esPrograma ? 'Objeto de la corrida: las promesas del programa de gobierno' : 'Tema'}
${
  esVetos
    ? `Buscás **todos los vetos** que esta persona firmó como presidente, y ninguna otra cosa.

El veto es la facultad por la que el Poder Ejecutivo observa un proyecto de ley que las dos cámaras ya aprobaron. No es la última palabra: la Asamblea General puede levantar las observaciones con una mayoría especial. El veto y lo que el Parlamento hizo después son **un solo hecho**; registrar el veto sin su desenlace deforma lo que pasó, así que un veto sin desenlace documentado no se publica.

Antes de registrar el primero, verificá en el texto de la Constitución cuál es el procedimiento vigente: qué plazo tiene el Ejecutivo para observar, qué mayoría necesita la Asamblea General para levantar el veto, y qué pasa si la Asamblea no se pronuncia en plazo. Leelo con \`pnpm fuente\` desde IMPO y anotá en \`notas.md\`, bajo \`procedimiento_constitucional\`, los artículos exactos con su cita literal. **No lo escribas de memoria**: si no lo verificaste en la fuente, no lo afirmes.

Fuentes donde vive esto, en orden de preferencia: IMPO y el Diario Oficial (el mensaje de observaciones se publica), el sitio del Parlamento (ficha del asunto y diario de sesiones de la sesión donde se trataron las observaciones), Presidencia. Todas son \`documento_oficial\` o \`diario_de_sesiones\` y habilitan \`nivel: textual\`. La prensa sirve para encontrar el veto y para el contexto, pero es \`reportado\`.

Cubrí el mandato completo. Si en un mandato no hubo ningún veto, eso también es información: decilo explícitamente en \`notas.md\` bajo \`cobertura_del_periodo\`, para que un mandato sin vetos no se lea como un mandato sin investigar.`
    : esPrograma
      ? `Buscás **todas las promesas concretas** que el programa de gobierno de esta candidatura hace para la elección de ${eleccion}, y ninguna otra cosa.

Documento de esta corrida: ${programaUrl}

Una promesa concreta es un compromiso de hacer, no hacer, mantener o crear algo, con o sin plazo ("vamos a construir 3.000 viviendas en el quinquenio", "no vamos a privatizar ANCAP", "vamos a mantener la regla fiscal"). Una declaración de valores o de principios ("vamos a gobernar con justicia social", "creemos en un Uruguay integrado al mundo") no es una promesa: no hay compromiso verificable contra el cual medir la gestión después. Una promesa compuesta ("vamos a bajar los impuestos, las tarifas y los combustibles") se separa en una promesa por componente, cada una con su propio registro en \`promesas.yaml\` y su propia cita.

\`tema\` es el slug de \`content/temas/\` que corresponda a cada promesa en particular (mirá \`content/temas/\`): no hay un tema único para toda la corrida, el programa entero es el objeto.

\`fecha_promesa\` es la fecha del documento (la fecha en que el programa se presentó o se publicó), no la fecha en la que vos lo leíste. \`origen\` es ese documento, con la cita literal del párrafo exacto donde está la promesa.

**No busques \`evidencias_candidatas\` en esta corrida.** Cargás la promesa tal como está en el programa; buscar qué se cumplió o se incumplió es otra corrida, para cuando el mandato haya avanzado.

**Cómo leer un documento largo.** Si el programa no entra en la lectura por defecto de \`pnpm fuente ${programaUrl}\`, empezá por \`pnpm fuente ${programaUrl} --indice --politico ${politico}\` para ubicar los tramos, y leé cada uno con \`--desde <carácter> --maximo 3000\`. Si el programa está partido en varios documentos (un PDF por capítulo o por área), armá un archivo con una URL por línea y leelas todas en un solo llamado con \`pnpm fuente --lote <archivo> --politico ${politico}\`.

**Qué \`tipo\` de fuente usar.** La Corte Electoral publica los programas de gobierno que las candidaturas presidenciales registran: la Ley 18.485, artículo 15, obliga a presentarlos ante la Corte Electoral al menos 30 días antes de la elección nacional, y a la Corte a publicarlos en el Diario Oficial y en una página oficial dentro de los 10 días siguientes (hoy, \`gub.uy/corte-electoral\` publica los de la elección de 2024). Si el documento de esta corrida es esa copia (\`corteelectoral.gub.uy\` o \`gub.uy/corte-electoral\`), \`tipo: documento_oficial\` y \`evidencia.nivel: textual\` alcanza con esta sola fuente. Si es la copia del sitio del partido, un PDF de campaña o cualquier otra fuente que la Corte Electoral no publicó, \`tipo: nota\` — aunque el texto sea idéntico, no lo publica la Corte Electoral, y por invariante del sitio eso exige \`nivel: reportado\` con una segunda fuente de otro grupo de medios, o \`_faltante: segunda_fuente\` si no la encontraste.`
      : `- slug: \`${tema}\` · nombre: ${tem.nombre}${tem.padre ? ` · padre: ${tem.padre}` : ''}
- descripción: ${tem.descripcion ?? ''}
- alias: ${(tem.alias ?? []).join(', ')}
- temas hijos: ${hijos.length ? hijos.join(', ') : 'ninguno'}`
}

## 3. Esquema (extracto)
Fuente: { url, medio (slug de la tabla de medios), fecha (YYYY-MM-DD), tipo: video|nota|documento_oficial|diario_de_sesiones|redes, titulo?, cita (literal, ≥ 20 caracteres), marca_tiempo (obligatoria si video; segundos o hh:mm:ss, donde empieza la cita), marca_tiempo_contexto (donde empieza el contexto, si escribís \`contexto\`), contexto?, pregunta?, retrieved_at }.
Evidencia: { nivel: textual|reportado, fuentes: [Fuente, ...] }. \`textual\` solo con video, documento oficial o diario de sesiones. \`reportado\` exige dos fuentes de distinto \`grupo\`; si no, \`_faltante: segunda_fuente\`.
${
  esVetos
    ? `Veto: { politico, tema (slug de content/temas/ del asunto que trata el proyecto), titulo (cómo se conoce el proyecto, en llano), numero_ley?, fecha (la de las observaciones), alcance: total|parcial, articulos_observados? (obligatorio si parcial), fundamento (qué argumentó el Ejecutivo, una o dos oraciones sin adjetivos), resultado: { estado: observaciones_aceptadas|veto_levantado|pendiente|sin_datos, fecha?, detalle, fuentes: [Fuente] }, analisis, evidencia }.
Declaración: { politico, tema, fecha, contexto, cargo_en_ese_momento, cita, resumen, evidencia } — para lo que el presidente dijo públicamente sobre el veto.`
    : esPrograma
      ? `Declaración: { politico, tema, fecha, contexto: campaña, cargo_en_ese_momento, cita, resumen, evidencia } — solo si el programa trae, en primera persona, una afirmación que no es una promesa (ver sección 2); si no hay ninguna, \`declaraciones.yaml\` queda vacío.
Promesa: { politico, tema, texto, fecha_promesa, origen: Evidencia } (sin \`evidencias_candidatas\` ni \`estado\`: esta corrida no los busca).`
      : `Declaración: { politico, tema, fecha, contexto: campaña|gobierno|oposicion|entrevista|parlamento|redes, cargo_en_ese_momento, cita, resumen, evidencia }.`
}
${
  esPrograma
    ? ''
    : `Promesa: { politico, tema, texto, fecha_promesa, origen: Evidencia, evidencias_candidatas?: [{ fecha, tipo: ley|decreto|accion_de_gobierno|dato_oficial|declaracion|omision, efecto: a_favor|en_contra|neutral, descripcion, evidencia }] } (sin \`estado\`).
Mención: { politico, referente (slug de content/referentes; si falta, proponelo en notas.md bajo referentes_faltantes) o politico_mencionado (slug de content/politicos), fecha, cita, contexto, sentido: positivo|negativo|neutral, evidencia }.
Chequeo (crudo, sin calificación): { politico, declaracion (id publicado, o \`<politico>/<fecha>-<_slug>\` si la declaración está en este lote), tema, fecha, afirmacion, fragmento (tramo exacto de la cita o del resumen donde está el dato), dato_real: { valor, fuentes[] con documento oficial si existe }, evidencia } o \`_faltante: dato_oficial\`.
`
}No escribas \`revision\`, \`tier\`, \`procedencia\`, \`etiqueta_legal\` ni \`id\`.

## 3b. Reglas de las colecciones de esta corrida

Copiadas de \`docs/colecciones/\`; el ejemplo completo de cada registro está en \`docs/ejemplos/\`.

${reglasColecciones}

## 4. Medios (la regla de dos fuentes usa la columna grupo)

Esta tabla es el estado de \`content/medios/\` al ${fecha}. Si un medio que necesitas no figura, puede ser que se haya dado de alta despues: verifica con \`ls content/medios/\` antes de anotarlo como faltante.
| slug | nombre | grupo | alineamiento |
|---|---|---|---|
${medios.join('\n')}

Si citás un medio que no está en la tabla, usá el slug que corresponda al canal o diario y anotalo en \`notas.md\` bajo \`medios_faltantes\` para que el editor lo cree.

## 5. Reglas duras
${
  esPrograma
    ? `1. \`cita\` es copia literal y contigua (≥ 20 caracteres) de lo que devolvió \`pnpm fuente\`; si no están las palabras exactas, no hay promesa. Nunca cites una URL que no abriste con \`pnpm fuente\` en esta sesión.
2. No escribas \`revision\`, \`tier\`, \`procedencia\`, \`etiqueta_legal\`, \`id\` ni \`estado\`.
3. Cada búsqueda y cada URL leída va a \`consultas.jsonl\`, en orden.
4. Pistas cruzadas sobre otros políticos van a \`${corpusDir}/pistas/<otro>.yaml\`.
5. En \`notas.md\`, bajo \`capitulos_cubiertos\`, anotá qué partes del documento leíste (capítulos, secciones o tramos por carácter, según cómo esté organizado el programa) y cuáles quedaron sin leer.`
    : `1. Primero \`pnpm corpus:buscar "${esVetos ? `${politico} veto` : '<politico> <tema>'}" --politico ${politico} --desde ${anioCampania}-01-01\` y variantes${esVetos ? ' ("observaciones", "vetó", "levantó el veto", el nombre de cada ley)' : ' con los alias del tema'}; web después, y solo lo que el corpus no cubre.
2. Toda página, PDF o video que vayas a citar se lee con \`pnpm fuente <url>\`. Nunca cites una URL que no abriste con \`pnpm fuente\` en esta sesión. Leé barato: \`pnpm fuente <url> --tema ${tema}\` devuelve hasta 6000 caracteres y, si la nota es más larga, un índice de los tramos posteriores al corte que mencionan al político o al tema; leé un tramo con \`--desde <carácter> --maximo 1500\`, buscá frases con \`--buscar \"frase | otra frase\"\` (todas las frases de una nota en una sola llamada), y en documentos muy largos empezá por \`--indice --politico ${politico} --tema ${tema}\`. Reservá \`--completo\` para cuando de verdad necesites el documento entero.
3. \`cita\` es copia literal de lo que devolvió \`pnpm fuente\`; si no están las palabras exactas, no hay registro.
4. Preferí documento oficial (Presidencia, Parlamento, DGI, BCU, INE, MEF, URSEA, ANCAP, JUTEP), diario de sesiones o video con marca de tiempo. La prensa es \`reportado\`.
   **Si la nota dice "conferencia de prensa", "discurso", "cadena nacional" o "acto oficial", buscá el texto oficial antes de citar al periodista.** El Estado publica la versión completa: una gacetilla de \`www.presidencia.gub.uy\` trae ~1.500 caracteres, pero un discurso en \`medios.presidencia.gub.uy\` trae 23.636 y una conferencia en \`archivo.presidencia.gub.uy\` trae 63.990. Citar la crónica da \`reportado\` y exige dos grupos de medios; citar el documento oficial da \`textual\` y no exige segundo grupo. La raíz de esos dominios da 403 (bloquean el listado), pero las rutas profundas se leen bien. Si no aparece el texto, el canal de YouTube de Presidencia (\`@PresidenciaUruguay-b2s\`) tiene los streams: \`yt-dlp --skip-download --write-auto-subs --sub-langs es\` baja los subtítulos sin el video, que sirven para ubicar el pasaje y sacar la \`marca_tiempo\` pero **no para citar** (son ASR de un vivo). Para citar de audio se transcribe con \`pnpm transcribir\`.
5. Para \`reportado\`, dos grupos distintos o \`_faltante: segunda_fuente\`.
   Además de grupo distinto, buscá **alineamiento distinto**. Medido sobre el contenido publicado al 2026-09-05, el 82 % de las fuentes que cita el sitio son de medios con alineamiento \`sin_datos\` y **ninguna** es de un medio \`oficialista_tradicional\`. Eso no es equilibrio: es que se citan siempre los mismos. Antes de cerrar un registro con dos fuentes \`sin_datos\`, probá si el hecho está cubierto por El País (oficialista_tradicional), Brecha o La República (progresista), o Búsqueda.
   **Para El País no alcanza con \`WebSearch\`: el buscador no devuelve ese dominio y contesta "sin resultados", que parece falta de cobertura y no lo es.** Usá \`pnpm descubrir elpais.com.uy --desde <AAAA-MM> --hasta <AAAA-MM> --terminos <alias del tema>\`, que lee el sitemap del propio diario, y después leé las candidatas con \`pnpm fuente\`. La República ya se lee bien (el cliente reintenta por curl ante un 403); no la marques \`verificacion: manual\` sin comprobarlo. Si buscaste, probaste el sitemap y no está, decilo en \`notas.md\`; eso también es información.
6. ${casos ? `Casos judiciales: ${casos}
   Simetria obligatoria en casos: documenta los desenlaces con el mismo rigor que las acusaciones. Por cada caso busca y registra, si existen, el archivo de la causa, la absolucion, el sobreseimiento, la desestimacion de la denuncia, y el hecho de que la persona no haya sido imputada; y tambien lo que el mismo expediente o el mismo fiscal hayan dicho en contra. Un caso sin su desenlace documentado no se publica. Nombrar un caso en este brief no afirma que haya responsabilidad: pide que se documente lo que consta, en las dos direcciones.` : 'Los casos judiciales van por el barrido simétrico (regla 12 de CLAUDE.md), no por esta corrida; si aparece uno, una linea en `casos_vistos`.'}
7. No escribas tier, procedencia ni id.
   Cada cifra, fecha, cantidad o comparación que la persona afirma dentro de una cita o un resumen es un chequeo: va a \`chequeos.yaml\` con \`fragmento\` y el dato oficial que permita juzgarlo (INE, BCU, MEF, DGI, URSEA, ANCAP, Parlamento, catalogodatos.gub.uy; para una comparación con otro país, el organismo oficial de ese país), o con \`_faltante: dato_oficial\` y lo que sí encontraste. No calificás: eso es del editor. El mismo umbral de qué es "un dato" vale para cualquier político. Si encontraste el registro primario, la \`afirmacion\` sigue a la primaria (con sus reservas), no a la prensa; si el resumen dice otra cosa, anotalo en \`notas.md\` bajo \`resumen_vs_primaria\`. Decidí vos si una cifra es un dato concreto o una figura retórica ("100 %", "mil veces"): si es retórica, no hay chequeo y lo decís en \`notas.md\` con el motivo. Cualquier lista de datos que traiga el brief es punto de partida, no lista cerrada: si al leer la cita encontrás otro dato, también se chequea, y el criterio es el mismo para todos los políticos.
8. Cada búsqueda y cada URL leída va a \`consultas.jsonl\`, en orden.
9. Pistas cruzadas sobre otros políticos van a \`${corpusDir}/pistas/<otro>.yaml\`.
10. ${esVetos ? 'Cubrí cada mandato entero. Por cada veto, buscá el desenlace con el mismo empeño que el veto: un veto sin desenlace documentado no se publica. Si un mandato no tuvo vetos, decilo explícitamente.' : 'Cubrí el período completo: campaña, gobierno, oposición y posmandato. Registrá también lo consistente (`sin_cambio` sirve).'}`
}

## 6. Pistas pendientes del corpus
\`\`\`yaml
${pistas}
\`\`\`

## 7. Salida esperada
${
  esVetos
    ? `Carpeta \`inbox/${politico}/vetos/${fecha}/\` con \`vetos.yaml\` (un registro por veto), \`declaraciones.yaml\` (lo que dijo públicamente sobre cada veto, si lo dijo), \`consultas.jsonl\` y \`notas.md\` con las secciones: procedimiento_constitucional, vetos_sin_desenlace, verificacion_manual, cobertura_del_periodo, hipotesis, objeciones_al_brief, medios_faltantes.

Todo registro lleva \`_investigacion: {agente: investigador, modelo: <el id del modelo con el que corrés>}\`.

Informe final: carpeta, cuántos vetos por mandato, cuántos con desenlace documentado y cuántos sin, los artículos de la Constitución que verificaste, el modelo con el que corriste y las objeciones al brief.`
    : esPrograma
      ? `Carpeta \`inbox/${politico}/programa-${eleccion}/${fecha}/\` con \`promesas.yaml\`, \`declaraciones.yaml\` (un array vacío si el programa no trae ninguna afirmación en primera persona que no sea promesa, o con las que sí trae), \`consultas.jsonl\` y \`notas.md\` con las secciones: capitulos_cubiertos, hipotesis, verificacion_manual, objeciones_al_brief, medios_faltantes.

Todo registro lleva \`_investigacion: {agente: investigador, modelo: <el id del modelo con el que corrés>}\`.

Informe final: carpeta, promesas cargadas y cuántas son componentes de una promesa compuesta, tipo de fuente usado y por qué (documento_oficial o nota), qué capítulos o tramos del documento leíste y cuáles quedaron sin leer, si el programa de otra candidatura de esta misma elección todavía no tiene su corrida, el modelo con el que corriste y las objeciones al brief.`
      : `Carpeta \`inbox/${politico}/${tema}/${fecha}/\` con \`declaraciones.yaml\`, \`promesas.yaml\`, \`menciones.yaml\`, \`chequeos.yaml\`, \`consultas.jsonl\` y \`notas.md\` (secciones: candidatos_giro, hipotesis, casos_vistos, verificacion_manual, cobertura_del_periodo, objeciones_al_brief, medios_faltantes). Informe final: carpeta, registros por archivo, cuántos con \`_faltante\`, candidatos a giro, hipótesis, modelo con el que corriste, objeciones.`
}
`;

  return { id, brief };
}

function main(): void {
  const args = process.argv.slice(2);
  // Los posicionales son los que no son flags ni valor de un flag con valor.
  const CON_VALOR = new Set(['--casos', '--fecha', '--programa', '--eleccion']);
  const posicionales: string[] = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      if (CON_VALOR.has(args[i])) i++;
      continue;
    }
    posicionales.push(args[i]);
  }
  const politico = posicionales[0];
  const tema = posicionales[1];
  const esVetos = args.includes('--vetos');
  const casosIdx = args.indexOf('--casos');
  const casos = casosIdx >= 0 ? args[casosIdx + 1] : null;
  const fechaIdx = args.indexOf('--fecha');
  const fecha = fechaIdx >= 0 ? args[fechaIdx + 1] : new Date().toISOString().slice(0, 10);
  const programaIdx = args.indexOf('--programa');
  const programaUrl = programaIdx >= 0 ? args[programaIdx + 1] : undefined;
  const eleccionIdx = args.indexOf('--eleccion');
  const eleccion = eleccionIdx >= 0 ? args[eleccionIdx + 1] : undefined;

  const raiz = process.cwd();
  let resultado: ResultadoBrief;
  try {
    resultado = construirBrief(raiz, politico, tema, { vetos: esVetos, programa: programaUrl, eleccion, casos, fecha });
  } catch (e) {
    console.error((e as Error).message);
    process.exit(1);
  }
  const { id, brief } = resultado;

  const dir = path.join(raiz, 'data', 'corridas', id);
  const destino = path.join(dir, 'brief.md');

  // El brief guardado tiene que ser, palabra por palabra, lo que recibio el agente: es la
  // pieza que permite auditar de donde salio cada registro. Regenerarlo sobre una corrida ya
  // ejecutada rompe esa cadena en silencio, asi que hay que pedirlo explicitamente.
  if (fs.existsSync(destino) && !args.includes('--forzar')) {
    console.error(`Ya existe ${path.relative(raiz, destino)}.`);
    console.error('Un brief guardado debe seguir siendo identico al que recibio el agente.');
    console.error('Si la corrida todavia no se ejecuto y querias regenerarlo, agrega --forzar.');
    console.error('Si la corrida ya se ejecuto, usa otra fecha con --fecha YYYY-MM-DD.');
    process.exit(1);
  }

  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(destino, brief);
  console.log(path.join('data', 'corridas', id, 'brief.md'));
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) main();
