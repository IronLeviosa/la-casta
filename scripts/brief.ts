// Genera el brief de una corrida de investigación y lo guarda en data/corridas/<id>/brief.md.
// Uso: pnpm brief <politico> <tema> [--casos "<instrucción explícita sobre casos>"] [--fecha YYYY-MM-DD]
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';

const args = process.argv.slice(2);
// Los posicionales son los que no son flags ni valor de un flag con valor.
const CON_VALOR = new Set(['--casos', '--fecha']);
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
if (!politico || (!tema && !esVetos)) { console.error('Uso: pnpm brief <politico> <tema> [--casos "..."]\n       pnpm brief <politico> --vetos'); process.exit(1); }

const raiz = process.cwd();
const leerYaml = (p: string) => parse(fs.readFileSync(p, 'utf8'));
const pPol = path.join(raiz, 'content', 'politicos', `${politico}.yaml`);
const pTema = esVetos ? null : path.join(raiz, 'content', 'temas', `${tema}.yaml`);
if (!fs.existsSync(pPol)) { console.error(`No existe ${pPol}`); process.exit(1); }
if (pTema && !fs.existsSync(pTema)) { console.error(`No existe ${pTema}`); process.exit(1); }
const pol = leerYaml(pPol);
const tem = pTema ? leerYaml(pTema) : {};

// temas hijos
const dirTema = esVetos ? null : path.join(raiz, 'content', 'temas', tema);
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
const id = esVetos ? `${fecha}-${politico}-vetos` : `${fecha}-${politico}-${tema.replace(/\//g, '-')}`;
const mandatos = (pol.mandatos ?? []).map((m: any) => `- ${m.cargo}: ${m.desde} → ${m.hasta ?? 'en curso'}`).join('\n');

const brief = `# Brief de investigación · corrida ${id}

Regla 0: objetividad por encima de todo. Este brief pide cubrir el período completo y todo lo que la persona dijo sobre el tema, favorable o desfavorable, consistente o contradictorio. Si algo acá te parece asimétrico, decilo en \`objeciones_al_brief\` y aplicá el criterio simétrico.

## 1. Político
- slug: \`${politico}\`
- nombre: ${pol.nombre} (${pol.nombre_corto ?? ''})
- partido: ${pol.partido}
- alias: ${(pol.alias ?? []).join(', ')}
- alias ambiguos: ${(pol.alias_ambiguos ?? []).map((a: any) => `"${a.alias}": ${a.nota}`).join(' | ') || 'ninguno'}
- mandatos:
${mandatos}
- estado actual: ${pol.estado_actual?.situacion}${pol.estado_actual?.salida ? ` (salida: ${pol.estado_actual.salida.tipo} el ${pol.estado_actual.salida.fecha})` : ''}
- período a cubrir: desde la campaña previa al primer mandato (${anioCampania}) hasta hoy (${fecha}), incluidas oposición y posmandato.

## 2. ${esVetos ? 'Objeto de la corrida: los vetos' : 'Tema'}
${esVetos ? `Buscás **todos los vetos** que esta persona firmó como presidente, y ninguna otra cosa.

El veto es la facultad por la que el Poder Ejecutivo observa un proyecto de ley que las dos cámaras ya aprobaron. No es la última palabra: la Asamblea General puede levantar las observaciones con una mayoría especial. El veto y lo que el Parlamento hizo después son **un solo hecho**; registrar el veto sin su desenlace deforma lo que pasó, así que un veto sin desenlace documentado no se publica.

Antes de registrar el primero, verificá en el texto de la Constitución cuál es el procedimiento vigente: qué plazo tiene el Ejecutivo para observar, qué mayoría necesita la Asamblea General para levantar el veto, y qué pasa si la Asamblea no se pronuncia en plazo. Leelo con \`pnpm fuente\` desde IMPO y anotá en \`notas.md\`, bajo \`procedimiento_constitucional\`, los artículos exactos con su cita literal. **No lo escribas de memoria**: si no lo verificaste en la fuente, no lo afirmes.

Fuentes donde vive esto, en orden de preferencia: IMPO y el Diario Oficial (el mensaje de observaciones se publica), el sitio del Parlamento (ficha del asunto y diario de sesiones de la sesión donde se trataron las observaciones), Presidencia. Todas son \`documento_oficial\` o \`diario_de_sesiones\` y habilitan \`nivel: textual\`. La prensa sirve para encontrar el veto y para el contexto, pero es \`reportado\`.

Cubrí el mandato completo. Si en un mandato no hubo ningún veto, eso también es información: decilo explícitamente en \`notas.md\` bajo \`cobertura_del_periodo\`, para que un mandato sin vetos no se lea como un mandato sin investigar.` : `- slug: \`${tema}\` · nombre: ${tem.nombre}${tem.padre ? ` · padre: ${tem.padre}` : ''}
- descripción: ${tem.descripcion ?? ''}
- alias: ${(tem.alias ?? []).join(', ')}
- temas hijos: ${hijos.length ? hijos.join(', ') : 'ninguno'}`}

## 3. Esquema (extracto)
Fuente: { url, medio (slug de la tabla de medios), fecha (YYYY-MM-DD), tipo: video|nota|documento_oficial|diario_de_sesiones|redes, titulo?, cita (literal, ≥ 20 caracteres), marca_tiempo (obligatoria si video; segundos o hh:mm:ss), retrieved_at }.
Evidencia: { nivel: textual|reportado, fuentes: [Fuente, ...] }. \`textual\` solo con video, documento oficial o diario de sesiones. \`reportado\` exige dos fuentes de distinto \`grupo\`; si no, \`_faltante: segunda_fuente\`.
${esVetos ? `Veto: { politico, tema (slug de content/temas/ del asunto que trata el proyecto), titulo (cómo se conoce el proyecto, en llano), numero_ley?, fecha (la de las observaciones), alcance: total|parcial, articulos_observados? (obligatorio si parcial), fundamento (qué argumentó el Ejecutivo, una o dos oraciones sin adjetivos), resultado: { estado: observaciones_aceptadas|veto_levantado|pendiente|sin_datos, fecha?, detalle, fuentes: [Fuente] }, analisis, evidencia }.
Declaración: { politico, tema, fecha, contexto, cargo_en_ese_momento, cita, resumen, evidencia } — para lo que el presidente dijo públicamente sobre el veto.` : `Declaración: { politico, tema, fecha, contexto: campaña|gobierno|oposicion|entrevista|parlamento|redes, cargo_en_ese_momento, cita, resumen, evidencia }.`}
Promesa: { politico, tema, texto, fecha_promesa, origen: Evidencia, evidencias_candidatas?: [{ fecha, tipo: ley|decreto|accion_de_gobierno|dato_oficial|declaracion|omision, efecto: a_favor|en_contra|neutral, descripcion, evidencia }] } (sin \`estado\`).
Mención: { politico, referente (slug de content/referentes; si falta, proponelo en notas.md bajo referentes_faltantes) o politico_mencionado (slug de content/politicos), fecha, cita, contexto, sentido: positivo|negativo|neutral, evidencia }.
No escribas \`revision\`, \`tier\`, \`procedencia\`, \`etiqueta_legal\` ni \`id\`.

## 4. Medios (la regla de dos fuentes usa la columna grupo)

Esta tabla es el estado de \`content/medios/\` al ${fecha}. Si un medio que necesitas no figura, puede ser que se haya dado de alta despues: verifica con \`ls content/medios/\` antes de anotarlo como faltante.
| slug | nombre | grupo | alineamiento |
|---|---|---|---|
${medios.join('\n')}

Si citás un medio que no está en la tabla, usá el slug que corresponda al canal o diario y anotalo en \`notas.md\` bajo \`medios_faltantes\` para que el editor lo cree.

## 5. Reglas duras
1. Primero \`pnpm corpus:buscar "${esVetos ? `${politico} veto` : '<politico> <tema>'}" --politico ${politico} --desde ${anioCampania}-01-01\` y variantes${esVetos ? ' ("observaciones", "vetó", "levantó el veto", el nombre de cada ley)' : ' con los alias del tema'}; web después, y solo lo que el corpus no cubre.
2. Toda página, PDF o video que vayas a citar se lee con \`pnpm fuente <url>\`. Nunca cites una URL que no abriste con \`pnpm fuente\` en esta sesión. Leé barato: \`pnpm fuente <url> --tema ${tema}\` devuelve hasta 6000 caracteres y, si la nota es más larga, un índice de los tramos posteriores al corte que mencionan al político o al tema; leé un tramo con \`--desde <carácter> --maximo 1500\`, buscá frases con \`--buscar \"frase | otra frase\"\` (todas las frases de una nota en una sola llamada), y en documentos muy largos empezá por \`--indice --politico ${politico} --tema ${tema}\`. Reservá \`--completo\` para cuando de verdad necesites el documento entero.
3. \`cita\` es copia literal de lo que devolvió \`pnpm fuente\`; si no están las palabras exactas, no hay registro.
4. Preferí documento oficial (Presidencia, Parlamento, DGI, BCU, INE, MEF, URSEA, ANCAP, JUTEP), diario de sesiones o video con marca de tiempo. La prensa es \`reportado\`.
5. Para \`reportado\`, dos grupos distintos o \`_faltante: segunda_fuente\`.
   Además de grupo distinto, buscá **alineamiento distinto**. Medido sobre el contenido publicado al 2026-09-05, el 82 % de las fuentes que cita el sitio son de medios con alineamiento \`sin_datos\` y **ninguna** es de un medio \`oficialista_tradicional\`. Eso no es equilibrio: es que se citan siempre los mismos. Antes de cerrar un registro con dos fuentes \`sin_datos\`, probá si el hecho está cubierto por El País (oficialista_tradicional), Brecha o La República (progresista), o Búsqueda. Los tres primeros tienen cero citas en todo el sitio y responden bien, salvo La República, que devuelve 403 y hay que anotar como \`verificacion: manual\`. Si buscaste y no está, decilo en \`notas.md\`; eso también es información.
6. ${casos ? `Casos judiciales: ${casos}
   Simetria obligatoria en casos: documenta los desenlaces con el mismo rigor que las acusaciones. Por cada caso busca y registra, si existen, el archivo de la causa, la absolucion, el sobreseimiento, la desestimacion de la denuncia, y el hecho de que la persona no haya sido imputada; y tambien lo que el mismo expediente o el mismo fiscal hayan dicho en contra. Un caso sin su desenlace documentado no se publica. Nombrar un caso en este brief no afirma que haya responsabilidad: pide que se documente lo que consta, en las dos direcciones.` : 'No investigues casos judiciales; si aparecen, una linea en `casos_vistos`.'}
7. No escribas tier, procedencia ni id.
8. Cada búsqueda y cada URL leída va a \`consultas.jsonl\`, en orden.
9. Pistas cruzadas sobre otros políticos van a \`${corpusDir}/pistas/<otro>.yaml\`.
10. ${esVetos ? 'Cubrí cada mandato entero. Por cada veto, buscá el desenlace con el mismo empeño que el veto: un veto sin desenlace documentado no se publica. Si un mandato no tuvo vetos, decilo explícitamente.' : 'Cubrí el período completo: campaña, gobierno, oposición y posmandato. Registrá también lo consistente (\`sin_cambio\` sirve).'}

## 6. Pistas pendientes del corpus
\`\`\`yaml
${pistas}
\`\`\`

## 7. Salida esperada
${esVetos ? `Carpeta \`inbox/${politico}/vetos/${fecha}/\` con \`vetos.yaml\` (un registro por veto), \`declaraciones.yaml\` (lo que dijo públicamente sobre cada veto, si lo dijo), \`consultas.jsonl\` y \`notas.md\` con las secciones: procedimiento_constitucional, vetos_sin_desenlace, verificacion_manual, cobertura_del_periodo, hipotesis, objeciones_al_brief, medios_faltantes.

Todo registro lleva \`_investigacion: {agente: investigador, modelo: <el id del modelo con el que corrés>}\`.

Informe final: carpeta, cuántos vetos por mandato, cuántos con desenlace documentado y cuántos sin, los artículos de la Constitución que verificaste, el modelo con el que corriste y las objeciones al brief.` : `Carpeta \`inbox/${politico}/${tema}/${fecha}/\` con \`declaraciones.yaml\`, \`promesas.yaml\`, \`menciones.yaml\`, \`consultas.jsonl\` y \`notas.md\` (secciones: candidatos_giro, hipotesis, casos_vistos, verificacion_manual, cobertura_del_periodo, objeciones_al_brief, medios_faltantes). Informe final: carpeta, registros por archivo, cuántos con \`_faltante\`, candidatos a giro, hipótesis, modelo con el que corriste, objeciones.`}
`;

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
