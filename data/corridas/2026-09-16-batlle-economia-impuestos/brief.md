# Brief de investigación · corrida 2026-09-16-batlle-economia-impuestos

Regla 0: objetividad por encima de todo. Este brief pide cubrir el período completo y todo lo que la persona dijo sobre el tema, favorable o desfavorable, consistente o contradictorio. Si algo acá te parece asimétrico, decilo en `objeciones_al_brief` y aplicá el criterio simétrico.

## 1. Político
- slug: `batlle`
- nombre: Jorge Luis Batlle Ibáñez (Jorge Batlle)
- partido: Partido Colorado
- alias: Jorge Batlle, Jorge Batlle Ibáñez, Batlle Ibáñez, Batlle
- alias ambiguos: "Batlle": Apellido compartido con José Batlle y Ordóñez, Luis Batlle Berres y César Batlle Pacheco; solo asignar a Jorge Batlle si el contexto es 1999-2016 o aparece el nombre de pila.
- cargos en el Estado según la ficha (censo oficial; **no incluye** cargos partidarios, actividad en medios ni actividad privada o gremial, que también son trayectoria y se buscan):
- Presidente de la República: 2000-03-01 → 2005-03-01
- estado actual: fallecido (salida: fallecimiento el 2016-10-24)
- período a cubrir: desde la campaña previa al primer mandato (1999) hasta hoy (2026-09-16), incluidas oposición y posmandato, **sin huecos**, en estos tramos: 1999 · 2000-2004 · 2005-2009 · 2010-2014 · 2015-2019 · 2020-2024 · 2025-2026. Cada tramo lleva su renglón en `cobertura_del_periodo`, tenga o no cargo la persona en ese tramo. Son más de cuatro tramos: el orquestador lanza dos investigadores en secuencia sobre esta carpeta, cada uno con los tramos que le indique el prompt de lanzamiento («Tramos: …»); cubrí solo esos.

## 2. Tema
- slug: `economia/impuestos` · nombre: Impuestos · padre: economia
- descripción: Creación, aumento, rebaja o exoneración de impuestos y tasas, y promesas al respecto.
- alias: impuestos, impuesto, tributos, tributaria, carga tributaria, IVA, IRPF, IRAE, IASS, IMESI, DGI, presión fiscal, suba de impuestos, no subir impuestos, rebaja de IVA, exoneración
- temas hijos: ninguno

## 3. Esquema (extracto)
Fuente: { url, medio (slug de la tabla de medios), fecha (YYYY-MM-DD), tipo: video|nota|documento_oficial|diario_de_sesiones|redes, titulo?, cita (literal, ≥ 20 caracteres), marca_tiempo (obligatoria si video; segundos o hh:mm:ss, donde empieza la cita), marca_tiempo_contexto (donde empieza el contexto, si escribís `contexto`), contexto?, pregunta?, retrieved_at }.
Evidencia: { nivel: textual|reportado, fuentes: [Fuente, ...] }. `textual` solo con video, documento oficial o diario de sesiones. `reportado` exige dos fuentes de distinto `grupo`; si no, `_faltante: segunda_fuente`.
Declaración: { politico, tema, fecha, contexto: campaña|gobierno|oposicion|entrevista|parlamento|redes, cargo_en_ese_momento, cita, resumen, evidencia }.
Promesa: { politico, tema, texto, fecha_promesa, origen: Evidencia, evidencias_candidatas?: [{ fecha, tipo: ley|decreto|accion_de_gobierno|dato_oficial|declaracion|omision, efecto: a_favor|en_contra|neutral, descripcion, evidencia }] } (sin `estado`).
Mención: { politico, referente (slug de content/referentes; si falta, proponelo en notas.md bajo referentes_faltantes) o politico_mencionado (slug de content/politicos), fecha, cita, contexto, sentido: positivo|negativo|neutral, evidencia }.
Chequeo (crudo, sin calificación): { politico, declaracion (id publicado, o `<politico>/<fecha>-<_slug>` si la declaración está en este lote), tema, fecha, afirmacion, fragmento (tramo exacto de la cita o del resumen donde está el dato), dato_real: { valor, fuentes[] con documento oficial si existe }, evidencia } o `_faltante: dato_oficial`.
No escribas `revision`, `tier`, `procedencia`, `etiqueta_legal` ni `id`.

## 3b. Reglas de las colecciones de esta corrida

Copiadas de `docs/colecciones/`; el ejemplo completo de cada registro está en `docs/ejemplos/`.

# Declaraciones (`content/declaraciones/`)

Qué dijo la persona, cuándo, en qué contexto y con qué palabras. Es la colección base: los giros comparan dos declaraciones, los chequeos nacen de los datos que hay dentro de una cita, y las menciones son declaraciones sobre otra persona.

## Campos

`politico`, `tema` (slug de `content/temas/`, jerárquico), `fecha`, `contexto` (`campaña | gobierno | oposicion | entrevista | parlamento | redes`), `cargo_en_ese_momento`, `cita` (literal, contigua, al menos 20 caracteres, tal como la devolvió `pnpm fuente`), `titulo`, `resumen` (una oración neutra: qué afirmó, sin adjetivos), `evidencia` (`nivel` y `fuentes[]`), `seguimiento` cuando corresponde. Ejemplo completo en `docs/ejemplos/declaracion.yaml`.

## Investigación

- **Conferencia de prensa, discurso, cadena nacional o acto oficial: el texto oficial existe casi siempre, y se busca antes de citar al periodista.** Presidencia publica la versión completa (`archivo.presidencia.gub.uy` para mandatos anteriores, `medios.presidencia.gub.uy` para documentos y discursos, `www.gub.uy/presidencia/comunicacion/noticias/` para el mandato en curso; la raíz de esos dominios da 403, las rutas profundas se leen bien); la gacetilla trae un resumen. Citar la crónica da `reportado` y exige dos grupos de medios; citar el documento oficial da `textual` y no exige segundo grupo. En el Parlamento, el diario de sesiones también habilita `textual`. Si no aparece el texto, los streams del canal de YouTube de Presidencia (`@PresidenciaUruguay-b2s`) sirven para ubicar el pasaje y la `marca_tiempo` (`yt-dlp --skip-download --write-auto-subs --sub-langs es`), nunca para citar: para citar de audio se transcribe con `pnpm transcribir`.
- **Cotejo con el registro primario.** Si el registro tiene una fuente primaria (audio, video, texto oficial) y además notas de prensa que citan a la persona, cada nota lleva `verificada_en: {url: <la primaria>, marca_tiempo: <dónde está el pasaje>}`. El investigador no decide si la nota es fiel: eso es `literalidad`, y la pone el editor con el `contexto` de la primaria a la vista.
- **Datos dentro de la cita.** Cada cifra, fecha, cantidad o comparación que la persona afirma es un chequeo: ver `chequeos.md`.
- **Toda denuncia lleva desenlace.** Si la persona dice que algo es ilegal, inconstitucional o irregular, o pide algo concreto, se busca qué pasó después (diarios de sesiones posteriores, pedidos de informes y sus respuestas, resoluciones en IMPO, prensa) y se carga en `seguimiento` (`estado: resuelto | sin_resolucion_publica`, `fecha`, `texto`, `fuentes`); si no hay registro público, `sin_resolucion_publica` y dónde se buscó. El lector que lee «esto es inconstitucional» quiere saber si se salieron con la suya.

# Promesas (`content/promesas/`)

Lo que prometió en campaña frente a lo que hizo en el cargo. Estado en la escala de Chequeado y la diaria Verifica: `cumplida | en_proceso_adelantada | en_proceso_demorada | incumplida`, con `fundamentacion` y `evidencias[]` fechadas después de `fecha_promesa`.

## Campos

`politico`, `tema`, `texto` (la promesa, en una oración), `fecha_promesa`, `origen` (una `evidencia`: dónde y cuándo la dijo), `estado`, `fundamentacion`, `evidencias[]` con `{fecha, tipo: ley | decreto | accion_de_gobierno | dato_oficial | declaracion | omision | votacion, efecto: a_favor | en_contra | neutral, descripcion, evidencia}`. Una promesa compuesta («se terminó el aumento de impuestos, tarifas y combustibles») se separa en una promesa por componente, cada una con su calificación. Ejemplo en `docs/ejemplos/promesa.yaml`.

## Investigación

El investigador escribe `texto`, `fecha_promesa`, `origen` y, si encontró evidencia de cumplimiento o incumplimiento, `evidencias_candidatas[]` con `{fecha, tipo, efecto, evidencia}`. No pone `estado`. Una corrida de programa de gobierno (un documento por candidatura, misma plantilla para todas) es la forma más simétrica de cargar promesas: `pnpm brief <politico> --programa <url> --eleccion <año>` la arma; carga `promesas` y `declaraciones`, no busca `evidencias_candidatas`, y el brief dice si el `tipo` de fuente es `documento_oficial` (la copia registrada ante la Corte Electoral, ley 18.485, artículo 15) o `nota` (el sitio del partido).

# Menciones (`content/menciones/`)

A quién cita la persona como autoridad, a quién reivindica y a quién critica. Alimenta la sección «Referentes» de cada ficha.

## Campos

`politico`, y uno de `referente` (slug de `content/referentes/`) o `politico_mencionado` (slug de `content/politicos/`, cuando menciona a otro político cubierto), `fecha`, `cita` (literal, con la salvedad del propio hablante si la hubo), `contexto`, `sentido: positivo | negativo | neutral`, `evidencia`. Ejemplo en `docs/ejemplos/mencion.yaml`.

## Investigación

Si el referente no existe en `content/referentes/`, se propone en `notas.md` bajo `referentes_faltantes` con nombre, tipo (`persona | organizacion | obra | corriente`) y una línea neutral; el editor lo crea.

# Chequeos, el Veracímetro (`content/chequeos/`)

`afirmacion` es un dato concreto (cifra, fecha, cantidad, comparación: «por primera vez», «el más bajo de la región»), nunca una opinión ni una promesa. Cuatro calificaciones: `verdadero` (verde), `impreciso` (verde claro), `discutible` (amarillo) y `falso` (rojo). Color siempre acompañado de texto e ícono.

**Regla dura:** `verdadero`, `impreciso` y `falso` exigen al menos una fuente `documento_oficial` (INE, BCU, MEF, DGI, URSEA, Poder Judicial, Corte Electoral, JUTEP, un dataset público) o `diario_de_sesiones` en `dato_real.fuentes`. Con prensa sola, lo máximo es `discutible`. Un chequeo que queda en `discutible` cuando el documento es previsible (una sentencia, una versión taquigráfica, una resolución, un dataset oficial) es una investigación por la mitad: el crítico lo objeta con `documento_previsible` y el lote no cierra sin esa búsqueda.

## Campos

`politico`, `declaracion` (id publicado, o `<politico>/<fecha>-<_slug>` si la declaración está en el mismo lote), `tema`, `fecha`, `titulo`, `afirmacion`, `fragmento` (el tramo exacto de la cita o del resumen donde está el dato, copiado tal cual: la página lo marca con el color de la calificación y le cuelga un globo con el análisis; si no coincide, la marca no aparece y el validador lo rechaza), `calificacion`, `dato_real: {valor, fuentes[]}`, `analisis`, `grafico` o `graficos[]` cuando compara cifras, `evidencia` (de dónde sale la afirmación; sirven las fuentes de la declaración). Ejemplo en `docs/ejemplos/chequeo.yaml`.

## Investigación

- **Los chequeos nacen de los datos que aparecen dentro de las citas.** El investigador escribe uno por cada dato que la persona afirma en una cita o un resumen, busca el dato oficial que permita juzgarlo (INE, BCU, MEF, DGI, URSEA, ANCAP, Parlamento, `catalogodatos.gub.uy`; para una comparación con otro país, el organismo oficial de ese país) y lo deja en `dato_real` con su cita. No califica: deja `calificacion: discutible` como marcador. Si no encuentra el dato oficial, escribe igual el chequeo con `_faltante: dato_oficial` y lo que sí encontró.
- **Las series oficiales de uso frecuente ya están registradas** en `docs/fuentes-oficiales/series.yaml` (tipo de cambio del BCU, IPC y mercado de trabajo del INE, precios y paridad de URSEA, combustibles de la ANP de Brasil, recaudación de la DGI, datasets de catalogodatos). `pnpm dato <serie> --fecha|--mes|--anio` devuelve el valor, la fila citable exacta y el bloque listo para `dato_real.fuentes[]`; `pnpm dato --lista` las enumera. Antes de buscar un dato oficial en la web, mirá si su serie está ahí.
- **El umbral de qué es «un dato» es el mismo para cualquier político.** Una figura retórica («100 %», «mil veces») no es un dato; se dice en `notas.md` con el motivo.
- **Precedencia de la primaria.** Si en la misma corrida apareció el registro primario (audio, video, texto oficial), la `afirmacion` se escribe contra lo que la primaria dice, con sus reservas («creo que», «más o menos»), y no contra la versión de la prensa. Si el `resumen` publicado dice otra cosa, se anota en `notas.md` bajo `## resumen_vs_primaria` para que el editor ajuste resumen y `fragmento` juntos. Chequear la versión del diario en vez de la del hablante es calificar una frase que la persona no dijo.
- Para antecedentes, sumarios, investigaciones administrativas o datos de un caso penal, las puertas oficiales y su orden están en `docs/fuentes-oficiales/casos-penales.md` y `docs/fuentes-oficiales/ministerio-interior.md`.

# Perfiles de medios (`content/medios/`)

Una ficha por medio citado: qué es, de quién es (`propiedad`), a qué familia de propiedad pertenece (`grupo`) y qué alineamiento documentado tiene. Es una colección de referencia, pero no es decorativa: la regla de dos grupos para `reportado` y el aviso por alineamiento compartido se calculan con lo que dice esta ficha, y por eso ningún registro puede citar un `medio` que no exista. Un medio nuevo se documenta en la misma corrida que lo cita; no se espera a nadie.

## Campos

`_slug` (el slug con el que las fuentes lo citan: el dominio sin puntos, `frenteamplio-uy`, `el-pais`, `la-diaria`), `nombre`, `tipo` (`diario | semanario | portal | tv | radio | agencia | estatal | enciclopedia`), `grupo` (familia de propiedad; dos medios del mismo grupo cuentan como uno), `url`, `dominios[]`, `alias[]`, `empresa` (solo si es el medio de una empresa pública con ficha), `propiedad: {descripcion, fuentes[]}`, `alineamiento: {etiqueta, justificacion, fuentes[]}`, `revision.tier`. Ejemplo completo en `docs/ejemplos/medio.yaml`. La procedencia la escribe `pnpm promover`.

## Investigación

- **Un medio que no está en `content/medios/` no frena la corrida.** El investigador escribe su ficha en `medios.yaml` del mismo lote, con el `_slug` exacto que usan sus fuentes, y `pnpm validar --inbox` la resuelve como si ya estuviera publicada; `pnpm promover` la publica con la corrida y con procedencia. Hasta el 2026-09-15 dos fuentes de un medio sin ficha pararon un lote de 22 registros porque nadie tenía camino para darlo de alta. `medios_faltantes` en `notas.md` queda solo para lo que no se pudo documentar: un medio del que no se encontró fuente ni para la propiedad ni para el alineamiento.
- **`propiedad` y `alineamiento` llevan fuente con cita literal leída con `pnpm fuente`**: la página «quiénes somos» o «acerca de», el registro de la sociedad, la nota de un tercero que documenta al dueño, o la autodefinición del propio sitio. Sin fuente, `alineamiento.etiqueta: sin_datos` y la `justificacion` dice qué se buscó y no se encontró. Nunca se infiere de la línea editorial ni se adivina.
- **Sitio de un partido, de un sector o de una campaña**: `tipo: portal`, `grupo` = el partido, `alineamiento` por autodefinición (`progresista` para el Frente Amplio y sus sectores, `oficialista_tradicional` para los partidos Nacional y Colorado y los suyos), y la `propiedad` dice explícitamente que es fuente primaria de lo que el partido o el candidato dijo y que **nunca cuenta como segunda fuente independiente**. El tratamiento es el mismo para todos los partidos: `mpp` y `lacallepou-uy` son el precedente y se copian.
- **Organismo público** (Presidencia, Parlamento, BCU, una intendencia): `tipo: estatal`, `alineamiento.etiqueta: estatal`, y `propiedad` dice qué organismo es.
- **El `grupo` sale de la propiedad documentada, no del nombre**: dos diarios del mismo dueño llevan el mismo grupo aunque compitan; un portal y una radio de la misma familia también.

## 4. Medios (la regla de dos fuentes usa la columna grupo)

Esta tabla es el estado de `content/medios/` al 2026-09-16. Si un medio que necesitas no figura, puede ser que se haya dado de alta despues: verifica con `ls content/medios/` antes de anotarlo como faltante.
| slug | nombre | grupo | alineamiento |
|---|---|---|---|
| 180-com-uy | Portal 180 | portal-180 | sin_datos |
| aderasa | Asociación de Entes Reguladores de Agua Potable y Saneamiento de las Américas (ADERASA) | aderasa | estatal |
| aebu | Asociación de Bancarios del Uruguay (AEBU) | aebu | sin_datos |
| afe | AFE (Administración de Ferrocarriles del Estado) | estado-uruguayo | estatal |
| afp | Agence France-Presse | afp | independiente |
| alur | ALUR | estado-uruguayo | estatal |
| ambito | Ámbito | grupo-ambito | sin_datos |
| ancap | ANCAP | estado-uruguayo | estatal |
| andina-peru | Andina (Agencia Peruana de Noticias) | estado-peruano | estatal |
| anp-brasil | Agência Nacional do Petróleo, Gás Natural e Biocombustíveis (ANP) | estado-brasileno | estatal |
| anp | Administración Nacional de Puertos (ANP, Uruguay) | estado-uruguayo | estatal |
| antel | ANTEL | estado-uruguayo | estatal |
| augpee | AUGPEE | augpee | sin_datos |
| banco-mundial | Banco Mundial (Grupo Banco Mundial) | banco-mundial | estatal |
| bcb-brasil | Banco Central do Brasil (BCB) | estado-brasileno | estatal |
| bcu | Banco Central del Uruguay (BCU) | estado-uruguayo | estatal |
| bhu | Banco Hipotecario del Uruguay (BHU) | estado-uruguayo | estatal |
| bid | Banco Interamericano de Desarrollo (BID) | bid | estatal |
| brecha | Brecha | cooperativa-brecha | progresista |
| brou | Banco de la República Oriental del Uruguay (BROU) | estado-uruguayo | estatal |
| bse | BSE | estado-uruguayo | estatal |
| busqueda | Búsqueda | magnolio | sin_datos |
| caras-y-caretas | Caras y Caretas | editora-caras-y-caretas | progresista |
| catalogodatos-gub-uy | Catálogo Nacional de Datos Abiertos (AGESIC) | estado-uruguayo | estatal |
| ced | Centro de Estudios para el Desarrollo (CED) | ced | sin_datos |
| congreso-espana | Congreso de los Diputados (España) | estado-espanol | estatal |
| cooperativa-cl | Cooperativa.cl (Radio Cooperativa) | compania-chilena-de-comunicaciones | sin_datos |
| correo | Correo Uruguayo (Administración Nacional de Correos) | estado-uruguayo | estatal |
| cpa-ferrere | CPA Ferrere | cpa-ferrere | independiente |
| cronicas | Crónicas | cronicas | sin_datos |
| efe | Agencia EFE | sepi-estado-espanol | estatal |
| el-observador | El Observador | werthein-hochbaum | sin_datos |
| el-pais | El País | scheck-aguirre | oficialista_tradicional |
| elpueblodigital | El Pueblo Digital | elpueblodigital | sin_datos |
| eltelegrafo | El Telégrafo | eltelegrafo | sin_datos |
| en-perspectiva | En Perspectiva (Radiomundo) | lecueder-cotelo | sin_datos |
| fiscalia-general-nacion | Fiscalía General de la Nación | estado-uruguayo | estatal |
| fmi | Fondo Monetario Internacional (FMI) | fmi | estatal |
| foco-economico | Foco Económico | foco-economico | sin_datos |
| frenteamplio-uy | Frente Amplio (frenteamplio.uy) | frente-amplio | progresista |
| grupo-r-multimedio | Grupo R Multimedio (Diario La R) | r-multimedio | sin_datos |
| icndiario | ICN Diario | icn | sin_datos |
| impo | IMPO (Diario Oficial) | estado-uruguayo | estatal |
| ine | Instituto Nacional de Estadística (INE) | estado-uruguayo | estatal |
| infobae | Infobae | grupo-infobae | sin_datos |
| justia | Justia | justia | sin_datos |
| jutep | JUTEP | estado-uruguayo | estatal |
| la-diaria | la diaria | cooperativa-la-diaria | independiente |
| la-republica | La República | reg-sa | progresista |
| lacallepou-uy | lacallepou.uy (sitio de campaña) | partido-nacional | oficialista_tradicional |
| mef | Ministerio de Economía y Finanzas | estado-uruguayo | estatal |
| miem | Ministerio de Industria, Energía y Minería | estado-uruguayo | estatal |
| ministerio-ambiente | Ministerio de Ambiente | estado-uruguayo | estatal |
| montevideo-portal | Montevideo Portal | montevideo-comm | sin_datos |
| mpp | MPP (mpp.org.uy) | frente-amplio | progresista |
| mtop | Ministerio de Transporte y Obras Públicas | estado-uruguayo | estatal |
| opp | Oficina de Planeamiento y Presupuesto (OPP) | estado-uruguayo | estatal |
| ose | OSE | estado-uruguayo | estatal |
| parlamento | Parlamento del Uruguay | estado-uruguayo | estatal |
| poder-judicial | Poder Judicial del Uruguay | estado-uruguayo | estatal |
| portalmaritimo-com-uy | Portal Marítimo | portalmaritimo-com-uy | sin_datos |
| prensa-mercosur | Prensa Mercosur | prensa-mercosur | sin_datos |
| presidencia | Presidencia de la República | estado-uruguayo | estatal |
| pv-magazine-latam | pv magazine América Latina | pv-magazine | sin_datos |
| radio-carve | Radio Carve | casa-zorrilla | sin_datos |
| scielo-org-mx | SciELO México | scielo | sin_datos |
| sipri | SIPRI (Stockholm International Peace Research Institute) | sipri | estatal |
| subrayado | Subrayado (Canal 10) | fontaina-de-feo | sin_datos |
| teledoce | Telemundo (Canal 12) | cardoso | sin_datos |
| telenoche | Telenoche (Canal 4) | monte-carlo-romay-salvo | sin_datos |
| tribunal-de-cuentas | Tribunal de Cuentas de la República | estado-uruguayo | estatal |
| tv-ciudad | TV Ciudad | intendencia-montevideo | estatal |
| union-ferroviaria | Unión Ferroviaria | union-ferroviaria | sin_datos |
| ursea | Unidad Reguladora de Servicios de Energía y Agua (URSEA) | estado-uruguayo | estatal |
| ursec | Unidad Reguladora de Servicios de Comunicaciones (Ursec) | estado-uruguayo | estatal |
| uruguayxxi-gub-uy | Uruguay XXI | estado-uruguayo | estatal |
| ute | UTE | estado-uruguayo | estatal |
| vtv | VTV | tenfield | sin_datos |
| wikipedia | Wikipedia en español | wikimedia | sin_datos |
| youtube | YouTube | google | sin_datos |

Si citás un medio que no está en la tabla, usá como slug su dominio sin puntos y escribí su perfil en `medios.yaml` del lote (propiedad y alineamiento con fuente; `docs/ejemplos/medio.yaml`): el validador lo resuelve en el mismo lote. `medios_faltantes` queda solo para lo que no pudiste documentar.

## 5. Reglas duras
1. Primero `pnpm corpus:buscar "<politico> <tema>" --politico batlle --desde 1999-01-01` y variantes con los alias del tema; web después, y solo lo que el corpus no cubre.
2. Toda página, PDF o video que vayas a citar se lee con `pnpm fuente <url>`. Nunca cites una URL que no abriste con `pnpm fuente` en esta sesión. Leé barato: `pnpm fuente <url> --tema economia/impuestos` devuelve hasta 6000 caracteres y, si la nota es más larga, un índice de los tramos posteriores al corte que mencionan al político o al tema; leé un tramo con `--desde <carácter> --maximo 1500`, buscá frases con `--buscar "frase | otra frase"` (todas las frases de una nota en una sola llamada), y en documentos muy largos empezá por `--indice --politico batlle --tema economia/impuestos`. Reservá `--completo` para cuando de verdad necesites el documento entero.
3. `cita` es copia literal de lo que devolvió `pnpm fuente`; si no están las palabras exactas, no hay registro.
4. Preferí documento oficial (Presidencia, Parlamento, DGI, BCU, INE, MEF, URSEA, ANCAP, JUTEP), diario de sesiones o video con marca de tiempo. La prensa es `reportado`.
   **Si la nota dice "conferencia de prensa", "discurso", "cadena nacional" o "acto oficial", buscá el texto oficial antes de citar al periodista.** El Estado publica la versión completa: una gacetilla de `www.presidencia.gub.uy` trae ~1.500 caracteres, pero un discurso en `medios.presidencia.gub.uy` trae 23.636 y una conferencia en `archivo.presidencia.gub.uy` trae 63.990. Citar la crónica da `reportado` y exige dos grupos de medios; citar el documento oficial da `textual` y no exige segundo grupo. La raíz de esos dominios da 403 (bloquean el listado), pero las rutas profundas se leen bien. Si no aparece el texto, el canal de YouTube de Presidencia (`@PresidenciaUruguay-b2s`) tiene los streams: `yt-dlp --skip-download --write-auto-subs --sub-langs es` baja los subtítulos sin el video, que sirven para ubicar el pasaje y sacar la `marca_tiempo` pero **no para citar** (son ASR de un vivo). Para citar de audio se transcribe con `pnpm transcribir`.
5. Para `reportado`, dos grupos distintos o `_faltante: segunda_fuente`.
   Además de grupo distinto, buscá **alineamiento distinto**. Medido sobre el contenido publicado al 2026-09-05, el 82 % de las fuentes que cita el sitio son de medios con alineamiento `sin_datos` y **ninguna** es de un medio `oficialista_tradicional`. Eso no es equilibrio: es que se citan siempre los mismos. Antes de cerrar un registro con dos fuentes `sin_datos`, probá si el hecho está cubierto por El País (oficialista_tradicional), Brecha o La República (progresista), o Búsqueda.
   **Para El País no alcanza con `WebSearch`: el buscador no devuelve ese dominio y contesta "sin resultados", que parece falta de cobertura y no lo es.** Usá `pnpm descubrir elpais.com.uy --desde <AAAA-MM> --hasta <AAAA-MM> --terminos <alias del tema>`, que lee el sitemap del propio diario, y después leé las candidatas con `pnpm fuente`. La República ya se lee bien (el cliente reintenta por curl ante un 403); no la marques `verificacion: manual` sin comprobarlo. Si buscaste, probaste el sitemap y no está, decilo en `notas.md`; eso también es información.
6. Los casos judiciales van por el barrido simétrico (regla 12 de CLAUDE.md), no por esta corrida; si aparece uno, una linea en `casos_vistos`.
7. No escribas tier, procedencia ni id.
   Cada cifra, fecha, cantidad o comparación que la persona afirma dentro de una cita o un resumen es un chequeo: va a `chequeos.yaml` con `fragmento` y el dato oficial que permita juzgarlo (INE, BCU, MEF, DGI, URSEA, ANCAP, Parlamento, catalogodatos.gub.uy; para una comparación con otro país, el organismo oficial de ese país), o con `_faltante: dato_oficial` y lo que sí encontraste. No calificás: eso es del editor. El mismo umbral de qué es "un dato" vale para cualquier político. Si encontraste el registro primario, la `afirmacion` sigue a la primaria (con sus reservas), no a la prensa; si el resumen dice otra cosa, anotalo en `notas.md` bajo `resumen_vs_primaria`. Decidí vos si una cifra es un dato concreto o una figura retórica ("100 %", "mil veces"): si es retórica, no hay chequeo y lo decís en `notas.md` con el motivo. Cualquier lista de datos que traiga el brief es punto de partida, no lista cerrada: si al leer la cita encontrás otro dato, también se chequea, y el criterio es el mismo para todos los políticos.
8. Cada búsqueda y cada URL leída va a `consultas.jsonl`, en orden.
9. Pistas cruzadas sobre otros políticos van a `C:\Users\sdsmo\GitHub\la-casta-corpus/pistas/<otro>.yaml`.
10. Cubrí el período completo por tramos (1999, 2000-2004, 2005-2009, 2010-2014, 2015-2019, 2020-2024, 2025-2026): campaña, gobierno, oposición y posmandato, tenga o no cargo la persona en el tramo. Antes de buscar el tema, una búsqueda de la trayectoria fuera del Estado (cargos partidarios, medios, actividad privada o gremial), anotada con fuente en `notas.md` bajo `## trayectoria_fuera_del_estado`: sirve para saber desde dónde hablaba en cada tramo; no va a la ficha. En `cobertura_del_periodo`, un renglón por tramo: qué buscaste, en qué fuentes y qué encontraste, aunque sea nada. Un tramo sin renglón es un lote incompleto y el crítico lo bloquea. Registrá también lo consistente (`sin_cambio` sirve).
11. Fuentes que se agotan antes de declarar que no hay nada, la misma lista para todas las personas: (a) el corpus con cada alias de la persona y del tema; (b) los diarios de sesiones de cada tramo en que integró una cámara, por la ruta estable (`pnpm sesion <crr|css> <fecha>`; `docs/fuentes-oficiales/parlamento.md`); (c) su actuación en comisiones por los endpoints CSV y JSON del Parlamento (mismo documento); (d) un medio de cada alineamiento: El País con `pnpm descubrir`, Brecha o La República, Búsqueda, la diaria; (e) `pnpm inventario` del sitio del organismo que dirigió, si dirigió alguno. Si la lista se agota sin una cita, el resultado es un cero válido: lo decís en `cobertura_del_periodo` y no seguís buscando.
12. `## para_el_lector` en `notas.md`: una o dos oraciones para quien lea la ficha, que digan qué se buscó y qué se encontró (o que no se encontró nada), sin narración de proceso: sin ids, sin «en esta corrida», sin nombres de archivos, herramientas ni roles. Si el lote no trae registros, ese texto es lo único que el lector va a ver.

## 6. Pistas pendientes del corpus
```yaml
# Pistas para batlle. Las carga el brief del investigador antes de googlear.
pistas:
  - url: https://parlamento.gub.uy/documentosyleyes/ficha-asunto/20891/ficha_completa
    que_vi: >-
      Un barrido mecánico de las leyes promulgadas entre 2005-03-01 y 2010-03-01 (mandato de
      Vázquez) encontró la Ley 17.888 ("REPUBLICA ITALIANA. ESCUELA 41 TRINIDAD (FLORES).
      DENOMINACION") con línea de veto total en su ficha de trámite. Al revisar la fecha exacta, el
      veto ("Poder Ejecutivo veto total") es del 19-05-2004, dentro del mandato de Jorge Batlle
      (2000-2005), no de Vázquez: la ley recién se promulgó el 22-08-2005 (ya con Vázquez en la
      presidencia) porque el trámite quedó archivado más de un año y se retomó/re-sancionó después.
      Es decir: es candidato a veto de Batlle, no de Vázquez. No se investigó más allá de leer la
      ficha de trámite (fechas y trámite, sin fundamento ni desenlace de Asamblea General).
    fecha: "2004-05-19"
    tema_probable: educacion
    agregada: 2026-09-05T02:50:00.000Z
    por: investigador-vazquez-vetos

```

## 7. Salida esperada
Carpeta `inbox/batlle/economia/impuestos/2026-09-16/` con `declaraciones.yaml`, `promesas.yaml`, `menciones.yaml`, `chequeos.yaml`, `medios.yaml` (solo si citás un medio que `content/medios/` no tiene), `consultas.jsonl` y `notas.md` (secciones: trayectoria_fuera_del_estado, candidatos_giro, hipotesis, casos_vistos, verificacion_manual, cobertura_del_periodo, para_el_lector, objeciones_al_brief, medios_faltantes). Todo registro lleva `_investigacion: {agente: investigador}` (el modelo lo lee `pnpm agentes` de la transcripción). Informe final: carpeta, registros por archivo, cuántos con `_faltante`, candidatos a giro, hipótesis, tramos que quedaron sin cita, objeciones.
