# Brief de investigación · corrida 2026-09-05-vazquez-vetos

Regla 0: objetividad por encima de todo. Este brief pide cubrir el período completo y todo lo que la persona dijo sobre el tema, favorable o desfavorable, consistente o contradictorio. Si algo acá te parece asimétrico, decilo en `objeciones_al_brief` y aplicá el criterio simétrico.

## 1. Político
- slug: `vazquez`
- nombre: Tabaré Ramón Vázquez Rosas (Tabaré Vázquez)
- partido: Frente Amplio
- alias: Tabaré Vázquez, Tabaré Vázquez Rosas, Tabaré Ramón Vázquez Rosas, Vázquez, Tabaré
- alias ambiguos: "Vázquez": Apellido compartido con su hermano Jorge Vázquez Rosas (prosecretario de Presidencia y ministro del Interior); confirmar con el nombre de pila o el cargo. | "Tabaré": También nombra a Tabaré Viera (senador y ministro, Partido Colorado); confirmar con el apellido.
- mandatos:
- Presidente de la República: 2005-03-01 → 2010-03-01
- Presidente de la República: 2015-03-01 → 2020-03-01
- estado actual: fallecido (salida: fallecimiento el 2020-12-06)
- período a cubrir: desde la campaña previa al primer mandato (2004) hasta hoy (2026-09-05), incluidas oposición y posmandato.

## 2. Objeto de la corrida: los vetos
Buscás **todos los vetos** que esta persona firmó como presidente, y ninguna otra cosa.

El veto es la facultad por la que el Poder Ejecutivo observa un proyecto de ley que las dos cámaras ya aprobaron. No es la última palabra: la Asamblea General puede levantar las observaciones con una mayoría especial. El veto y lo que el Parlamento hizo después son **un solo hecho**; registrar el veto sin su desenlace deforma lo que pasó, así que un veto sin desenlace documentado no se publica.

Antes de registrar el primero, verificá en el texto de la Constitución cuál es el procedimiento vigente: qué plazo tiene el Ejecutivo para observar, qué mayoría necesita la Asamblea General para levantar el veto, y qué pasa si la Asamblea no se pronuncia en plazo. Leelo con `pnpm fuente` desde IMPO y anotá en `notas.md`, bajo `procedimiento_constitucional`, los artículos exactos con su cita literal. **No lo escribas de memoria**: si no lo verificaste en la fuente, no lo afirmes.

Fuentes donde vive esto, en orden de preferencia: IMPO y el Diario Oficial (el mensaje de observaciones se publica), el sitio del Parlamento (ficha del asunto y diario de sesiones de la sesión donde se trataron las observaciones), Presidencia. Todas son `documento_oficial` o `diario_de_sesiones` y habilitan `nivel: textual`. La prensa sirve para encontrar el veto y para el contexto, pero es `reportado`.

Cubrí el mandato completo. Si en un mandato no hubo ningún veto, eso también es información: decilo explícitamente en `notas.md` bajo `cobertura_del_periodo`, para que un mandato sin vetos no se lea como un mandato sin investigar.

## 3. Esquema (extracto)
Fuente: { url, medio (slug de la tabla de medios), fecha (YYYY-MM-DD), tipo: video|nota|documento_oficial|diario_de_sesiones|redes, titulo?, cita (literal, ≥ 20 caracteres), marca_tiempo (obligatoria si video; segundos o hh:mm:ss), retrieved_at }.
Evidencia: { nivel: textual|reportado, fuentes: [Fuente, ...] }. `textual` solo con video, documento oficial o diario de sesiones. `reportado` exige dos fuentes de distinto `grupo`; si no, `_faltante: segunda_fuente`.
Veto: { politico, tema (slug de content/temas/ del asunto que trata el proyecto), titulo (cómo se conoce el proyecto, en llano), numero_ley?, fecha (la de las observaciones), alcance: total|parcial, articulos_observados? (obligatorio si parcial), fundamento (qué argumentó el Ejecutivo, una o dos oraciones sin adjetivos), resultado: { estado: observaciones_aceptadas|veto_levantado|pendiente|sin_datos, fecha?, detalle, fuentes: [Fuente] }, analisis, evidencia }.
Declaración: { politico, tema, fecha, contexto, cargo_en_ese_momento, cita, resumen, evidencia } — para lo que el presidente dijo públicamente sobre el veto.
Promesa: { politico, tema, texto, fecha_promesa, origen: Evidencia, evidencias_candidatas?: [{ fecha, tipo: ley|decreto|accion_de_gobierno|dato_oficial|declaracion|omision, efecto: a_favor|en_contra|neutral, descripcion, evidencia }] } (sin `estado`).
Mención: { politico, referente (slug de content/referentes; si falta, proponelo en notas.md bajo referentes_faltantes) o politico_mencionado (slug de content/politicos), fecha, cita, contexto, sentido: positivo|negativo|neutral, evidencia }.
No escribas `revision`, `tier`, `procedencia`, `etiqueta_legal` ni `id`.

## 4. Medios (la regla de dos fuentes usa la columna grupo)

Esta tabla es el estado de `content/medios/` al 2026-09-05. Si un medio que necesitas no figura, puede ser que se haya dado de alta despues: verifica con `ls content/medios/` antes de anotarlo como faltante.
| slug | nombre | grupo | alineamiento |
|---|---|---|---|
| afp | Agence France-Presse | afp | independiente |
| ambito | Ámbito | grupo-ambito | sin_datos |
| brecha | Brecha | cooperativa-brecha | progresista |
| busqueda | Búsqueda | magnolio | sin_datos |
| caras-y-caretas | Caras y Caretas | editora-caras-y-caretas | progresista |
| efe | Agencia EFE | sepi-estado-espanol | estatal |
| el-observador | El Observador | werthein-hochbaum | sin_datos |
| el-pais | El País | scheck-aguirre | oficialista_tradicional |
| en-perspectiva | En Perspectiva (Radiomundo) | lecueder-cotelo | sin_datos |
| icndiario | ICN Diario | icn | sin_datos |
| impo | IMPO (Diario Oficial) | estado-uruguayo | estatal |
| infobae | Infobae | grupo-infobae | sin_datos |
| jutep | JUTEP | estado-uruguayo | estatal |
| la-diaria | la diaria | cooperativa-la-diaria | independiente |
| la-republica | La República | reg-sa | progresista |
| lacallepou-uy | lacallepou.uy (sitio de campaña) | partido-nacional | oficialista_tradicional |
| montevideo-portal | Montevideo Portal | montevideo-comm | sin_datos |
| mpp | MPP (mpp.org.uy) | frente-amplio | progresista |
| parlamento | Parlamento del Uruguay | estado-uruguayo | estatal |
| presidencia | Presidencia de la República | estado-uruguayo | estatal |
| radio-carve | Radio Carve | casa-zorrilla | sin_datos |
| subrayado | Subrayado (Canal 10) | fontaina-de-feo | sin_datos |
| teledoce | Telemundo (Canal 12) | cardoso | sin_datos |
| telenoche | Telenoche (Canal 4) | monte-carlo-romay-salvo | sin_datos |
| wikipedia | Wikipedia en español | wikimedia | sin_datos |
| youtube | YouTube | google | sin_datos |

Si citás un medio que no está en la tabla, usá el slug que corresponda al canal o diario y anotalo en `notas.md` bajo `medios_faltantes` para que el editor lo cree.

## 5. Reglas duras
1. Primero `pnpm corpus:buscar "vazquez veto" --politico vazquez --desde 2004-01-01` y variantes ("observaciones", "vetó", "levantó el veto", el nombre de cada ley); web después, y solo lo que el corpus no cubre.
2. Toda página, PDF o video que vayas a citar se lee con `pnpm fuente <url>`. Nunca cites una URL que no abriste con `pnpm fuente` en esta sesión. Leé barato: `pnpm fuente <url> --tema undefined` devuelve hasta 6000 caracteres y, si la nota es más larga, un índice de los tramos posteriores al corte que mencionan al político o al tema; leé un tramo con `--desde <carácter> --maximo 1500`, buscá frases con `--buscar "frase | otra frase"` (todas las frases de una nota en una sola llamada), y en documentos muy largos empezá por `--indice --politico vazquez --tema undefined`. Reservá `--completo` para cuando de verdad necesites el documento entero.
3. `cita` es copia literal de lo que devolvió `pnpm fuente`; si no están las palabras exactas, no hay registro.
4. Preferí documento oficial (Presidencia, Parlamento, DGI, BCU, INE, MEF, URSEA, ANCAP, JUTEP), diario de sesiones o video con marca de tiempo. La prensa es `reportado`.
5. Para `reportado`, dos grupos distintos o `_faltante: segunda_fuente`.
   Además de grupo distinto, buscá **alineamiento distinto**. Medido sobre el contenido publicado al 2026-09-05, el 82 % de las fuentes que cita el sitio son de medios con alineamiento `sin_datos` y **ninguna** es de un medio `oficialista_tradicional`. Eso no es equilibrio: es que se citan siempre los mismos. Antes de cerrar un registro con dos fuentes `sin_datos`, probá si el hecho está cubierto por El País (oficialista_tradicional), Brecha o La República (progresista), o Búsqueda. Los tres primeros tienen cero citas en todo el sitio y responden bien, salvo La República, que devuelve 403 y hay que anotar como `verificacion: manual`. Si buscaste y no está, decilo en `notas.md`; eso también es información.
6. No investigues casos judiciales; si aparecen, una linea en `casos_vistos`.
7. No escribas tier, procedencia ni id.
8. Cada búsqueda y cada URL leída va a `consultas.jsonl`, en orden.
9. Pistas cruzadas sobre otros políticos van a `/Users/santiago/Documents/GitHub/la-casta-corpus/pistas/<otro>.yaml`.
10. Cubrí cada mandato entero. Por cada veto, buscá el desenlace con el mismo empeño que el veto: un veto sin desenlace documentado no se publica. Si un mandato no tuvo vetos, decilo explícitamente.

## 6. Pistas pendientes del corpus
```yaml
# Pistas para vazquez. Las carga el brief del investigador antes de googlear.
pistas:
  - url: https://www.elobservador.com.uy/nota/lacalle-pou-y-el-paralelismo-de-las-gabardinas-de-ancap-con-un-gobierno-de-coalicion-20195520206
    que_vi: Lacalle Pou (entonces precandidato) acusó a 'gente cercana' a Mujica y Vazquez de hacer negocios irregulares con el Estado (caso Ancap, negocios con Venezuela); ver declaracion de 2019-05-06
    fecha: 2019-05-06
    tema_probable: transparencia-corrupcion
    agregada: 2026-09-04T00:38:37.870Z
    por: Mac
  - url: https://es.wikipedia.org/wiki/Tabar%C3%A9_V%C3%A1zquez
    que_vi: >-
      Vista solo en snippet de corpus:buscar (nota wikipedia "Tabaré Vázquez", indexada en el
      corpus como nota 21e94632c8), sin abrir con pnpm fuente: menciona que Vázquez vetó la ley de
      interrupción voluntaria del embarazo en 2008 ("El Presidente vetó Ley de Aborto", cita a Punta
      News). El esquema del proyecto (src/schemas/base.ts, COLECCIONES) ya trae como id de ejemplo
      "vazquez/2008-11-14-salud-sexual-reproductiva", lo que sugiere que este veto ya estaba
      previsto para una futura corrida de vetos sobre Vázquez.
    fecha: 2008-11-14
    tema_probable: derechos-humanos
    agregada: 2026-09-04T21:10:00.000Z
    por: investigador (corrida 2026-09-04-lacalle-pou-vetos)

```

## 7. Salida esperada
Carpeta `inbox/vazquez/vetos/2026-09-05/` con `vetos.yaml` (un registro por veto), `declaraciones.yaml` (lo que dijo públicamente sobre cada veto, si lo dijo), `consultas.jsonl` y `notas.md` con las secciones: procedimiento_constitucional, vetos_sin_desenlace, verificacion_manual, cobertura_del_periodo, hipotesis, objeciones_al_brief, medios_faltantes.

Todo registro lleva `_investigacion: {agente: investigador, modelo: <el id del modelo con el que corrés>}`.

Informe final: carpeta, cuántos vetos por mandato, cuántos con desenlace documentado y cuántos sin, los artículos de la Constitución que verificaste, el modelo con el que corriste y las objeciones al brief.
