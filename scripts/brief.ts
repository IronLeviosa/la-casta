// Genera el brief de una corrida de investigación y lo guarda en data/corridas/<id>/brief.md.
// Uso: pnpm brief <politico> <tema> [--casos "<instrucción explícita sobre casos>"] [--fecha YYYY-MM-DD]
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';

const args = process.argv.slice(2);
const politico = args[0];
const tema = args[1];
const casosIdx = args.indexOf('--casos');
const casos = casosIdx >= 0 ? args[casosIdx + 1] : null;
const fechaIdx = args.indexOf('--fecha');
const fecha = fechaIdx >= 0 ? args[fechaIdx + 1] : new Date().toISOString().slice(0, 10);
if (!politico || !tema) { console.error('Uso: pnpm brief <politico> <tema> [--casos "..."]'); process.exit(1); }

const raiz = process.cwd();
const leerYaml = (p: string) => parse(fs.readFileSync(p, 'utf8'));
const pPol = path.join(raiz, 'content', 'politicos', `${politico}.yaml`);
const pTema = path.join(raiz, 'content', 'temas', `${tema}.yaml`);
if (!fs.existsSync(pPol)) { console.error(`No existe ${pPol}`); process.exit(1); }
if (!fs.existsSync(pTema)) { console.error(`No existe ${pTema}`); process.exit(1); }
const pol = leerYaml(pPol);
const tem = leerYaml(pTema);

// temas hijos
const dirTema = path.join(raiz, 'content', 'temas', tema);
const hijos = fs.existsSync(dirTema) ? fs.readdirSync(dirTema).filter((f) => f.endsWith('.yaml')).map((f) => `${tema}/${f.replace('.yaml', '')}`) : [];

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
const id = `${fecha}-${politico}-${tema.replace(/\//g, '-')}`;
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

## 2. Tema
- slug: \`${tema}\` · nombre: ${tem.nombre}${tem.padre ? ` · padre: ${tem.padre}` : ''}
- descripción: ${tem.descripcion ?? ''}
- alias: ${(tem.alias ?? []).join(', ')}
- temas hijos: ${hijos.length ? hijos.join(', ') : 'ninguno'}

## 3. Esquema (extracto)
Fuente: { url, medio (slug de la tabla de medios), fecha (YYYY-MM-DD), tipo: video|nota|documento_oficial|diario_de_sesiones|redes, titulo?, cita (literal, ≥ 20 caracteres), marca_tiempo (obligatoria si video; segundos o hh:mm:ss), retrieved_at }.
Evidencia: { nivel: textual|reportado, fuentes: [Fuente, ...] }. \`textual\` solo con video, documento oficial o diario de sesiones. \`reportado\` exige dos fuentes de distinto \`grupo\`; si no, \`_faltante: segunda_fuente\`.
Declaración: { politico, tema, fecha, contexto: campaña|gobierno|oposicion|entrevista|parlamento|redes, cargo_en_ese_momento, cita, resumen, evidencia }.
Promesa: { politico, tema, texto, fecha_promesa, origen: Evidencia, evidencias_candidatas?: [{ fecha, tipo: ley|decreto|accion_de_gobierno|dato_oficial|declaracion|omision, efecto: a_favor|en_contra|neutral, descripcion, evidencia }] } (sin \`estado\`).
Mención: { politico, referente (slug de content/referentes; si falta, proponelo en notas.md bajo referentes_faltantes) o politico_mencionado (slug de content/politicos), fecha, cita, contexto, sentido: positivo|negativo|neutral, evidencia }.
No escribas \`revision\`, \`tier\`, \`procedencia\`, \`etiqueta_legal\` ni \`id\`.

## 4. Medios (la regla de dos fuentes usa la columna grupo)
| slug | nombre | grupo | alineamiento |
|---|---|---|---|
${medios.join('\n')}

Si citás un medio que no está en la tabla, usá el slug que corresponda al canal o diario y anotalo en \`notas.md\` bajo \`medios_faltantes\` para que el editor lo cree.

## 5. Reglas duras
1. Primero \`pnpm corpus:buscar "<politico> <tema>" --politico ${politico} --desde ${anioCampania}-01-01\` y variantes con los alias del tema; web después, y solo lo que el corpus no cubre.
2. Toda página, PDF o video que vayas a citar se lee con \`pnpm fuente <url>\`. Nunca cites una URL que no abriste con \`pnpm fuente\` en esta sesión.
3. \`cita\` es copia literal de lo que devolvió \`pnpm fuente\`; si no están las palabras exactas, no hay registro.
4. Preferí documento oficial (Presidencia, Parlamento, DGI, BCU, INE, MEF, URSEA, ANCAP, JUTEP), diario de sesiones o video con marca de tiempo. La prensa es \`reportado\`.
5. Para \`reportado\`, dos grupos distintos o \`_faltante: segunda_fuente\`.
6. ${casos ? `Casos judiciales: ${casos}` : 'No investigues casos judiciales; si aparecen, una línea en `casos_vistos`.'}
7. No escribas tier, procedencia ni id.
8. Cada búsqueda y cada URL leída va a \`consultas.jsonl\`, en orden.
9. Pistas cruzadas sobre otros políticos van a \`${corpusDir}/pistas/<otro>.yaml\`.
10. Cubrí el período completo: campaña, gobierno, oposición y posmandato. Registrá también lo consistente (\`sin_cambio\` sirve).

## 6. Pistas pendientes del corpus
\`\`\`yaml
${pistas}
\`\`\`

## 7. Salida esperada
Carpeta \`inbox/${politico}/${tema}/${fecha}/\` con \`declaraciones.yaml\`, \`promesas.yaml\`, \`menciones.yaml\`, \`consultas.jsonl\` y \`notas.md\` (secciones: candidatos_giro, hipotesis, casos_vistos, verificacion_manual, cobertura_del_periodo, objeciones_al_brief, medios_faltantes). Informe final: carpeta, registros por archivo, cuántos con \`_faltante\`, candidatos a giro, hipótesis, modelo con el que corriste, objeciones.
`;

const dir = path.join(raiz, 'data', 'corridas', id);
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'brief.md'), brief);
console.log(path.join('data', 'corridas', id, 'brief.md'));
