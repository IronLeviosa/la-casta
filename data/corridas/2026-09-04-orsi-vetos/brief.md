# Brief de investigación · corrida 2026-09-04-orsi-vetos

Regla 0: objetividad por encima de todo. Este brief pide cubrir el período completo y todo lo que la persona dijo sobre el tema, favorable o desfavorable, consistente o contradictorio. Si algo acá te parece asimétrico, decilo en `objeciones_al_brief` y aplicá el criterio simétrico.

## 1. Político
- slug: `orsi`
- nombre: Yamandú Ramón Antonio Orsi Martínez (Yamandú Orsi)
- partido: Frente Amplio
- alias: Yamandú Orsi, Orsi, Yamandú, Yamandú Ramón Antonio Orsi Martínez
- alias ambiguos: ninguno
- mandatos:
- Presidente de la República: 2025-03-01 → en curso
- estado actual: en_cargo
- período a cubrir: desde la campaña previa al primer mandato (2024) hasta hoy (2026-09-04), incluidas oposición y posmandato.

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

Esta tabla es el estado de `content/medios/` al 2026-09-04. Si un medio que necesitas no figura, puede ser que se haya dado de alta despues: verifica con `ls content/medios/` antes de anotarlo como faltante.
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
1. Primero `pnpm corpus:buscar "orsi veto" --politico orsi --desde 2024-01-01` y variantes ("observaciones", "vetó", "levantó el veto", el nombre de cada ley); web después, y solo lo que el corpus no cubre.
2. Toda página, PDF o video que vayas a citar se lee con `pnpm fuente <url>`. Nunca cites una URL que no abriste con `pnpm fuente` en esta sesión. Leé barato: `pnpm fuente <url> --tema undefined` devuelve hasta 6000 caracteres y, si la nota es más larga, un índice de los tramos posteriores al corte que mencionan al político o al tema; leé un tramo con `--desde <carácter> --maximo 1500`, buscá frases con `--buscar "frase | otra frase"` (todas las frases de una nota en una sola llamada), y en documentos muy largos empezá por `--indice --politico orsi --tema undefined`. Reservá `--completo` para cuando de verdad necesites el documento entero.
3. `cita` es copia literal de lo que devolvió `pnpm fuente`; si no están las palabras exactas, no hay registro.
4. Preferí documento oficial (Presidencia, Parlamento, DGI, BCU, INE, MEF, URSEA, ANCAP, JUTEP), diario de sesiones o video con marca de tiempo. La prensa es `reportado`.
5. Para `reportado`, dos grupos distintos o `_faltante: segunda_fuente`.
6. No investigues casos judiciales; si aparecen, una linea en `casos_vistos`.
7. No escribas tier, procedencia ni id.
8. Cada búsqueda y cada URL leída va a `consultas.jsonl`, en orden.
9. Pistas cruzadas sobre otros políticos van a `/Users/santiago/Documents/GitHub/la-casta-corpus/pistas/<otro>.yaml`.
10. Cubrí cada mandato entero. Por cada veto, buscá el desenlace con el mismo empeño que el veto: un veto sin desenlace documentado no se publica. Si un mandato no tuvo vetos, decilo explícitamente.

## 6. Pistas pendientes del corpus
```yaml
# Pistas para orsi. Las carga el brief del investigador antes de googlear.
pistas:
  - url: https://ladiaria.com.uy/politica/articulo/2026/9/reunion-entre-orsi-y-los-intendentes-en-anchorena-tendra-como-tema-principal-la-coordinacion-por-el-nino/
    que_vi: menciona una linea de credito del gobierno para El Nino
    fecha: null
    tema_probable: economia
    agregada: 2026-09-03T22:31:40.822Z
    por: Mac
  - url: https://www.infobae.com/america/america-latina/2026/07/07/nueva-polemica-con-yamandu-orsi-debia-un-impuesto-por-una-de-sus-casas-y-no-habia-declarado-obras-en-otra/
    que_vi: Orsi debia el impuesto de Primaria de una propiedad y no habia declarado obras en otra; lo pago tras la investigacion periodistica (visto investigando impuestos de Lacalle Pou)
    fecha: 2026-07-07
    tema_probable: economia/impuestos
    agregada: 2026-09-04T00:29:03.312Z
    por: Mac

```

## 7. Salida esperada
Carpeta `inbox/orsi/vetos/2026-09-04/` con `vetos.yaml` (un registro por veto), `declaraciones.yaml` (lo que dijo públicamente sobre cada veto, si lo dijo), `consultas.jsonl` y `notas.md` con las secciones: procedimiento_constitucional, vetos_sin_desenlace, verificacion_manual, cobertura_del_periodo, hipotesis, objeciones_al_brief, medios_faltantes.

Todo registro lleva `_investigacion: {agente: investigador, modelo: <el id del modelo con el que corrés>}`.

Informe final: carpeta, cuántos vetos por mandato, cuántos con desenlace documentado y cuántos sin, los artículos de la Constitución que verificaste, el modelo con el que corriste y las objeciones al brief.
