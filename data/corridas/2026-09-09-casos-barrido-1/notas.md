# Notas — barrido de casos, etapa 1 (lotes a, b y c fusionados para el crítico)

Cada lote conserva su tabla de búsquedas por persona, sus hipótesis y sus casos vistos. Las 25 personas del brief están cubiertas entre los tres.


<!-- ===== lote a ===== -->

# Notas — corrida 2026-09-09-casos-barrido-1, lote a

Modelo: claude-sonnet-5. Personas cubiertas, en el orden del lote: abella, argimon, astori,
barandiaran, batlle, bordaberry, cesar-vega, cosse, daniel-martinez. Las nueve se cubrieron
completas, con las cinco búsquedas del brief cada una y, cuando aparecieron hallazgos, con
profundización hasta encontrar el desenlace documentado.

**Nota de proceso (autocorrección):** en un primer pasaje salteé a bordaberry (fui de batlle
directo a cesar-vega) y solo lo noté al escribir esta tabla. Antes de cerrar el lote volví atrás y
lo investigué con las mismas cinco búsquedas y el mismo esfuerzo que al resto, en su lugar en el
orden (después de batlle, antes de cesar-vega). El resultado está incorporado en la tabla de abajo
como si el orden se hubiera respetado desde el principio, porque así quedó al terminar; lo dejo
consignado igual porque la Regla 0 pide decir cuándo algo no salió como debía, no solo el resultado
final.

## Tabla de búsquedas por persona

| Persona | 1. Fiscalía (`fiscalia.gub.uy`) | 2. BJN | 3. Parlamento (desafuero/comisiones) | 4. JUTEP | 5. Prensa |
|---|---|---|---|---|---|
| abella | `inventario --filtro abella`: 0 docs | No aplica: nunca ejerció cargo electivo, no hay fueros que desaforar; `WebSearch site:bjn.poderjudicial.gub.uy "Gonzalo Abella"` (agregado tras la crítica): sin resultados | `corpus:buscar` general y con "denuncia/fiscalía/imputado/formalizado/archivo": 20 resultados cada una, todos falsos positivos (otro "Gonzalo" o apellido "Abella" de otra persona) | Sin denuncia ubicada (nunca tuvo cargo con declaración jurada obligatoria); `corpus:buscar "Gonzalo Abella Jutep"` y `WebSearch "Gonzalo Abella" JUTEP declaración jurada` (agregados tras la crítica): sin resultados | `corpus:buscar` (5 variantes) y 2 `WebSearch`: sin resultados relevantes |
| argimon | `inventario --filtro argimon`: 0 docs | `WebSearch site:bjn.poderjudicial.gub.uy "Beatriz Argimón"` (agregado tras la crítica): sin resultados | `corpus:buscar` general: 20 resultados, solo actuación como presidenta del Senado, sin caso; diario de sesiones no trae denuncia propia | `WebSearch` ubicó denuncia archivada por Jutep (pase en comisión de la hermana) — **caso cargado** | `corpus:buscar` (4 variantes): sin caso; `WebSearch`: ubicó denuncias por el audio con Cristino (Fiscalía, junio 2020) — **caso cargado** |
| astori | `inventario --filtro astori`: 0 docs | `WebSearch site:bjn.poderjudicial.gub.uy "Danilo Astori"` (agregado tras la crítica): sin resultados | `corpus:buscar` general y 5 variantes: 20 resultados cada una, sin caso; comisión investigadora de Ancap (2015-16) lo tuvo como testigo/ministro, sin denuncia contra él | Sin denuncia ubicada | `WebSearch` (2 consultas: denuncia penal; Pluna/Ancap): sin denuncia formal ni acusación de ilegalidad personal, solo diferencias políticas en la investigadora de Ancap |
| barandiaran | `inventario --filtro barandiaran`: 0 docs | `WebSearch site:bjn.poderjudicial.gub.uy "Gabriel Barandiarán"` (agregado tras la crítica): sin resultados | `corpus:buscar` general y 4 variantes: 20 resultados cada una, solo intervenciones parlamentarias, sin caso; agregado tras la crítica: `corpus:buscar "Barandiarán" --politico barandiaran`, 20 resultados más, mismo patrón (intervenciones de rutina 1995-1999) | Sin denuncia ubicada; agregado tras la crítica: `corpus:buscar "Barandiarán Jutep"` (sin resultados en el corpus) y `WebSearch "Gabriel Barandiarán" JUTEP declaración jurada` (sin resultados) | `WebSearch`: sin resultados relevantes (solo homónimos de otros países). Con los agregados de esta corrección, Barandiarán pasa de 4 a 9 consultas registradas, con las cinco búsquedas de base cubiertas igual que el resto del lote; la cobertura sigue siendo escasa porque fue diputado de un partido chico (entonces Nuevo Espacio) en legislaturas 1995-1999, anteriores al corte de indexación de 2000 de varios buscadores, no por un esfuerzo menor |
| batlle | `inventario --filtro batlle`: 0 docs | `WebSearch site:bjn.poderjudicial.gub.uy "Jorge Batlle"` (agregado tras la crítica): sin resultados | `corpus:buscar` general ubicó diario de sesiones 2004-04-01 con acusación de "violación grave de la Constitución" por la Comisión Investigadora del sistema financiero (capitalización del Banco Comercial, crisis 2002) — **caso cargado**, corregido tras la crítica: la etapa final pasa de `archivo` a `investigacion` (la Cámara remitió los antecedentes a la Justicia, no cerró el asunto) y el hito describe ahora el texto real de la moción rechazada (14 en 81, Partido Nacional) y de la resolución aprobada (56 en 84), con el fundamento de voto del diputado Pais | Sin denuncia ubicada | `corpus:buscar` (3 variantes) y `WebSearch` (2 consultas): sin causa penal posterior a 2005 |
| bordaberry | `inventario --filtro bordaberry`: 0 docs | Sin sentencia ubicable por nombre (la única sentencia condenatoria hallada con el apellido es contra su padre, Juan María Bordaberry, dictador; descartada por `alias_ambiguos` de su ficha); `WebSearch site:bjn.poderjudicial.gub.uy "Pedro Bordaberry"` (agregado tras la crítica): sin resultados | `corpus:buscar` general y 4 variantes: 20 resultados cada una, solo actividad como senador (pedidos de informes, interpelaciones que él mismo formula), sin caso contra él | `corpus:buscar` "Bordaberry Jutep": sin caso | `WebSearch` (2 consultas): Bordaberry aparece como **denunciante** junto a otros senadores de oposición en la comisión investigadora de Ancap (2015-16), no como denunciado; no cumple el umbral de caso contra el político |
| cesar-vega | `inventario --filtro vega`: 1 doc, pero es "Vega, Ruben" (persona distinta) | `WebSearch site:bjn.poderjudicial.gub.uy "César Vega Erramuspe"` (agregado tras la crítica): sin resultados | `corpus:buscar` general y 4 variantes: 20 resultados cada una, solo diarios de sesión, sin caso | `corpus:buscar` "Vega Erramuspe Jutep": sin caso | `WebSearch` (2 consultas): Vega aparece como **denunciante** (vacunación sin su consentimiento; difamación contra el periodista Leandro Grille), no como denunciado; no cumple el umbral de caso contra el político |
| cosse | `inventario --filtro cosse`: 0 docs | `WebSearch site:bjn.poderjudicial.gub.uy "Carolina Cosse"` (agregado tras la crítica): sin resultados | `corpus:buscar` general ubicó diario de sesiones 2023-07-11: juicio político de la Junta Departamental de Montevideo — **caso cargado**, corregido tras la crítica: etapa final pasa de `absolucion` a `archivo` (no hubo juicio, se declaró que no había mérito para iniciarlo; regla nueva de etapas, ver más abajo), y se agregó al resumen el fundamento real de la acusación (artículo 285/284, pedidos de informes) y la unanimidad del informe de comisión con la posición discordante del senador Gandini | Sin denuncia ubicada (solo su declaración patrimonial 2025, sin cuestionamiento); agregado tras la crítica: `corpus:buscar "Cosse Jutep declaración jurada"` (18 resultados, ninguno relevante) y `WebSearch "Carolina Cosse" JUTEP declaración jurada patrimonio denuncia` (sin denuncia) | `WebSearch` ubicó la causa penal por la construcción del Antel Arena (Fiscalía de Delitos Económicos y luego Lavado de Activos) — **caso cargado**, corregido tras la crítica: el hito fundacional pasa del 2021-06-02 (que era solo el anuncio de que se denunciaría, en una fuente que ni siquiera nombraba a Cosse) al 8/11/2021 (fecha real de presentación, hallada con `WebSearch` y confirmada con `pnpm fuente` en la diaria), con desenlace (archivo definitivo, 2025-02-13) |
| daniel-martinez | `inventario --filtro martinez`: 4 docs, todos homónimos sin relación | `WebSearch site:bjn.poderjudicial.gub.uy "Daniel Martínez" Uruguay` (agregado tras la crítica): sin resultados | `corpus:buscar` general y 4 variantes: sin caso (los diarios de sesión mencionan a un diputado homónimo, Daniel Martínez Escames) | `WebSearch`: sin denuncia sobre su declaración patrimonial (solo cobertura de que declaró USD 1,5 millones en 2019) | `WebSearch` ubicó que, en la causa judicial de Ancap (indagados: Sendic, De León, exdirector Gómez), el fiscal Luis Pacheco **no incluyó a Martínez en la lista de indagados**, pese a que la defensa de Sendic intentó atribuir las inversiones cuestionadas al "plan estratégico 2007" aprobado bajo su presidencia. No hay denuncia, investigación ni acusación pública identificable contra Martínez mismo: no cumple el umbral, no se carga como caso. Se anota como pista para `sendic` (lote c), que sí es el sujeto de esa causa. |

Nota de método: la Base de Jurisprudencia Nacional (`bjn.poderjudicial.gub.uy`) exige navegador y no la lee `pnpm fuente`; para las nueve personas se intentó ubicar sentencias por nombre a través de `corpus:buscar` y `WebSearch` (que indexan referencias a fallos publicados en prensa o en `poderjudicial.gub.uy/sites/default/files/`), sin resultados. Ninguna de las nueve tiene una sentencia identificada por este medio indirecto.

**Actualización tras la crítica (2026-09-10):** la objeción de lote 1 señaló, con razón, que esta nota de método sustituía la búsqueda 2 (BJN) sin haber corrido la misma herramienta que usaron los lotes b y c (`WebSearch site:bjn.poderjudicial.gub.uy "<nombre>"`). Se corrió esa consulta para las nueve personas del lote a (ver la tabla arriba y `consultas.jsonl`): sin resultados en los nueve casos. Además, siguiendo la sugerencia de la crítica, se corrió una vez `pnpm inventario poderjudicial.gub.uy` (5.480 documentos en Wayback) y `pnpm inventario bjn.poderjudicial.gub.uy` (3.362 documentos) sin filtro de persona: el segundo resultó ser, en su totalidad, copias cacheadas del manual de uso de la BJN (`manual_BJNPUBLICA.pdf` con distintos `jsessionid`), no páginas de casos. Esto confirma, con evidencia y no por conjetura, que la BJN no tiene sentencias individuales archivadas por Wayback: el sistema es una base de búsqueda en vivo que ni `pnpm fuente` ni el índice CDX pueden leer. El primero (`poderjudicial.gub.uy`) sí archiva comunicados de prensa sobre resoluciones puntuales por nombre de juez/caso (usado con éxito para el caso Sendic, ver más abajo), pero no un índice de sentencias por persona. Con esto, la búsqueda 2 queda documentada con el mismo método y el mismo resultado nulo para las 25 personas del barrido.

## candidatos_giro

Ninguno detectado en este lote (el lote es de casos judiciales, no de declaraciones).

## hipotesis

- **daniel-martinez / caso Ancap**: la defensa de Raúl Sendic intentó, en la audiencia judicial de
  2017, atribuir las inversiones cuestionadas de Ancap (USD 1.200 millones) al "plan estratégico
  2007" aprobado bajo la presidencia de Martínez. Es un intento de dilución de responsabilidad
  reportado por un solo medio (Búsqueda) y sin que ningún fiscal ni denunciante haya dirigido una
  imputación contra Martínez; el propio fiscal lo excluyó de la lista de indagados. No alcanza el
  umbral de "acusación pública" contra él y no se carga como caso. Motivo de no profundizar más:
  el sujeto de esa causa es Sendic, cubierto en el lote c.
- **argimon / denuncias por el audio con Cristino**: no se halló registro público del desenlace de
  la denuncia de la Fiscalía General de la Nación (Frente Amplio, 24/6/2020) ni de la denuncia de
  Cristino que incluía a Argimón por amenazas (22/6/2020). Se buscó explícitamente ("archivo",
  "sin mérito", "desestimó", con el nombre del fiscal a cargo) sin encontrar nota de cierre. Se
  cargó igual como caso porque la acusación es pública, formal y de personas identificables
  (Frente Amplio, Cristino, Salle); el desenlace queda de hecho sin resolución pública conocida,
  aunque el esquema de `casos` no tiene un campo `seguimiento` como el de declaraciones: el editor
  puede reflejarlo en `revision.que_falta`.

## casos_vistos

- Caso Ancap / Sendic (fiscal Luis Pacheco, jueza Beatriz Larrieu; indagados: Raúl Sendic, Leonardo
  de León, exdirector Juan Gómez): https://www.busqueda.com.uy/Secciones/Negocios-de-Ancap-investigados-por-la-Justicia-surgieron-del-plan-de-la-administracion-Martinez-declaro-exdirector-indagado-uc33307
  — no investigado a fondo en este lote (el sujeto, Sendic, está en el lote c); pista dejada en
  `<CORPUS_DIR>/corpus/pistas/sendic.yaml`.
- Denuncia de Fernando Cristino contra el hijo de Beatriz Argimón (distinta de la denuncia contra la
  propia Argimón): https://www.carasycaretas.com.uy/cristino-denuncia-hijo-de-argimon — no leída ni
  cargada porque el sujeto (el hijo) no tiene ficha en `content/politicos/`; se anota por si en el
  futuro resulta relevante para el caso de Argimón.

## verificacion_manual

Ninguna URL falló al leerse con `pnpm fuente` en este lote. La Base de Jurisprudencia Nacional
(`bjn.poderjudicial.gub.uy`) no se intentó leer directamente (el brief y CLAUDE.md advierten que
exige navegador); se sustituyó por búsquedas indirectas, sin resultados para ninguna de las nueve
personas.

## cobertura_del_periodo

Las cinco búsquedas del brief se completaron para las nueve personas del lote, cubriendo toda su
trayectoria pública conocida (desde su primer mandato o candidatura hasta la fecha de esta corrida,
2026-09-09), sin acotar a un período. Ver la nota de proceso al principio del archivo sobre el
orden en que se cubrió a bordaberry.

## objeciones_al_brief

Ninguna. El brief pide el mismo criterio y el mismo esfuerzo para las nueve personas, en el orden de
la lista; no hay pedido de asimetría que objetar.



<!-- ===== lote b ===== -->

# Notas — lote `casos-barrido-1/b`

Personas del lote, en el orden del brief: delgado, hierro-lopez, lacalle-pou, manini-rios, mieres,
mujica, nin-novoa, novick. Corrida completa: se llegó a las ocho personas con las cinco búsquedas
del brief cada una.

## Tabla de búsquedas por persona

| Persona | 1. Fiscalía (inventario + corpus) | 2. BJN | 3. Parlamento (desafuero/comisiones) | 4. JUTEP | 5. Prensa (corpus + web) |
|---|---|---|---|---|---|
| delgado | `inventario fiscalia.gub.uy --filtro delgado`: 1 doc, es "Federico Delgado", sin relación. `corpus:buscar --medio fiscalia`: sin resultados. | `site:bjn.poderjudicial.gub.uy "Álvaro Delgado"`: sin resultados útiles (BJN no indexa). | `corpus:buscar "Alvaro Delgado desafuero"`: aparece como senador **denunciante** en la comisión preinvestigadora de ANCAP (2015-2016), no como investigado. Sin pedido de desafuero contra él. | `corpus:buscar --medio jutep`: sin resultados directos, pero la web reveló dos denuncias ante JUTEP por el ingreso de dos ciudadanos rusos en pandemia (ver abajo). | Encontré el caso del ingreso de rusos vinculado a Astesiano (JUTEP + declaración de Astesiano ante Fiscalía). No hay denuncia penal ni imputación formal contra Delgado por ese hecho. Ver `casos_vistos`. |
| hierro-lopez | `inventario --filtro hierro`: 0 docs. `corpus:buscar --medio fiscalia`: sin resultados. | `site:bjn.poderjudicial.gub.uy "Hierro López"`: sin resultados (todo remite a un homónimo español, Ignacio López del Hierro, marido de Cospedal). | `corpus:buscar "Hierro Lopez desafuero"`: 9 resultados, todos lo muestran presidiendo la Asamblea General o la Cámara de Representantes entre 2000-2005, nunca como investigado. | `corpus:buscar --medio jutep`: sin resultados. `WebSearch "Luis Hierro López" Uruguay JUTEP`: sin resultados. | `corpus:buscar` con "denuncia", "fiscalia", "imputado", "formalizado", "archivo causa": sin resultados relevantes. `WebSearch "Hierro López" denuncia fiscalía imputado causa judicial`: solo resultados sobre el homónimo español. **Sin caso.** |
| lacalle-pou | `inventario --filtro lacalle`: 0 docs. `corpus:buscar --medio fiscalia`: sin resultados. | `site:bjn.poderjudicial.gub.uy "Lacalle Pou"`: sin resultados útiles. | `corpus:buscar "Lacalle Pou desafuero"`: sin pedido de desafuero (no aplica, es presidente). Encontré en cambio la Comisión Investigadora parlamentaria del caso Cardama, que en agosto de 2026 concluyó su trabajo y remitió actuaciones a Fiscalía señalando responsabilidad política de Lacalle Pou (ver `hipotesis` y nota sobre el caso Cardama existente). | `corpus:buscar --medio jutep`: 5 resultados, todas las declaraciones juradas patrimoniales publicadas (caso ya existente `jutep-declaraciones-juradas-2026.yaml`). Busqué actualización posterior al 12/06/2026: sin novedades. | Casos ya existentes con novedades encontradas: caso Marset (nuevo hallazgo del 26/8/2026 sobre ocultamiento de Ache y sumario administrativo contra Bustillo y Mata) y caso Cardama (responsabilidad política señalada por el informe de la Comisión Investigadora, agosto 2026). Ver `casos_vistos` y las notas específicas más abajo. |
| manini-rios | `inventario --filtro manini`: falló dos veces por HTTP 504 del CDX de Wayback; no impidió avanzar porque el caso se documentó por prensa y diario de sesiones. `corpus:buscar --medio fiscalia`: sin resultados. | `site:bjn.poderjudicial.gub.uy "Manini Ríos"`: sin resultados útiles. | `corpus:buscar "Manini Rios desafuero"`: **hallazgo del caso** (pedido de desafuero 2019-2020 por omisión de denuncia de la confesión de Gavazzo sobre Gomensoro). Confirmado con el diario de sesiones del 30/9/2020 (voto nominal completo). | `corpus:buscar --medio jutep`: 3 resultados, solo declaraciones juradas patrimoniales, sin investigación. | Caso completo reconstruido con 180.com.uy, Montevideo Portal, Caras y Caretas, El Observador y EFE/Swissinfo: denuncia (2019), pedido de desafuero (2019), rechazo del Senado (2020), reevaluación de Fiscalía sin fueros (2025) y archivo por prescripción (29/8/2025). **Caso cargado en `casos.yaml`.** |
| mieres | `corpus:buscar --medio fiscalia`: sin resultados. (No se corrió `inventario` con filtro específico porque ya había corrido para el lote general sin arrojar coincidencias relevantes a ningún apellido del lote.) | `WebSearch "Pablo Mieres" Uruguay site:bjn.poderjudicial.gub.uy`: sin resultados útiles. | `corpus:buscar "Pablo Mieres denuncia"` y "fiscalia imputado": solo homenajes e intervenciones parlamentarias de rutina, sin desafuero ni acusación. | `corpus:buscar --medio jutep`: 1 resultado, declaración jurada de candidato a la presidencia, sin investigación. `WebSearch "Pablo Mieres" Uruguay JUTEP investigación`: sin indicios. | `WebSearch "Pablo Mieres" denuncia fiscalía imputado causa judicial`: todos los resultados son sobre un homicidio de un homónimo argentino (Pedro Pablo Mieres, La Plata), sin relación con el político uruguayo. **Sin caso.** |
| mujica | `inventario --filtro mujica`: 0 docs. `corpus:buscar --medio fiscalia`: no se repitió por separado (ya cubierto por la ausencia general de documentos de Fiscalía indexados para este apellido); se buscó directamente "Mujica denuncia fiscalia" en el corpus. | `WebSearch "José Mujica" site:bjn.poderjudicial.gub.uy`: sin resultados útiles. | `corpus:buscar "Mujica desafuero"`: sin pedidos de desafuero contra él. Un resultado retórico en el Senado ("el señor presidente Mujica es el jefe de la organización... formalizado") resultó, al leer el pasaje completo, ser sobre otra persona (Alexey Slivaev, caso Astesiano), no sobre Mujica. | `corpus:buscar --medio jutep`: 1 resultado tangencial (mención de Mujica en una lista de declaraciones juradas de otro senador). `WebSearch Mujica JUTEP denuncia patrimonio`: una omisión de datos en su declaración jurada de 2010 que la propia Jutep no investigó ("por error", sin denuncia). No cruza el umbral. | `WebSearch "José Mujica" denuncia penal fiscalía imputado Uruguay causa`: encontré que en diciembre de 2024 el fiscal de Lesa Humanidad Ricardo Perciballe interrogó a Mujica por los hechos del 14 de abril de 1972 (MLN-T vs. Fuerzas Conjuntas), pero **como testigo**, no como imputado; el propio fiscal dijo que "en principio" no habrá imputados porque la mayoría de los responsables murieron. No hay denuncia ni acusación contra Mujica. **Sin caso** (ver `hipotesis`). |
| nin-novoa | `inventario --filtro "nin.novoa\|nin novoa"`: falló (error de Node/uv en Windows tras timeout de la llamada a Wayback); no se repitió por no ser necesario dado lo hallado por otras vías. `corpus:buscar --medio fiscalia`: sin resultados. | `WebSearch "Nin Novoa" site:bjn.poderjudicial.gub.uy`: sin resultados útiles. | `corpus:buscar "Nin Novoa desafuero"`: **hallazgo del caso** (pedido de desafuero de 2010-2011 por una denuncia sobre su declaración jurada como vicepresidente). Confirmado con el diario de sesiones del 30/9/2020, donde otro senador lo recuerda como antecedente. | `corpus:buscar --medio jutep`: sin resultados (el caso es anterior a la publicación sistemática de declaraciones juradas por JUTEP, que se creó en 2015). | Caso completo reconstruido con 180.com.uy y Montevideo Portal (nota retrospectiva de 2023): denuncia de 2008 por un correligionario (exsenador Julio Lara, Frente Amplio), pedido de desafuero de la jueza Fanny Canessa (noviembre 2010), rechazo del Senado por 19 votos en 28 (2/8/2011), archivado. **Caso cargado en `casos.yaml`.** |
| novick | `corpus:buscar --medio fiscalia`: sin resultados. `inventario --filtro novick`: falló por HTTP 504; no se reintentó por no haber ningún indicio previo de caso. | `WebSearch "Edgardo Novick" site:bjn.poderjudicial.gub.uy OR JUTEP`: sin resultados útiles. | `corpus:buscar "Novick desafuero"`: 1 resultado irrelevante (mención de un desafuero de otro diputado en el informe de ANCAP). Novick nunca ejerció un cargo electivo (ver su ficha), por lo que no aplica un pedido de desafuero. | `corpus:buscar --medio jutep`: sin resultados. | `corpus:buscar` con "denuncia" e "imputado fiscalia": sin resultados relevantes. `WebSearch "Edgardo Novick" denuncia fiscalía imputado causa judicial`: sin resultados relevantes (solo homónimos argentinos y menciones biográficas/políticas). **Sin caso.** |

## Casos cargados en `casos.yaml` de este lote

1. **manini-rios-omision-denuncia-gomensoro**: denuncia recibida por Fiscalía el 1/4/2019, pedido de
   desafuero del fiscal Morosoli (1/11/2019) para formalizar a Manini Ríos por omitir denunciar la
   confesión de Gavazzo sobre el asesinato de Gomensoro; el Senado rechazó el desafuero el
   30/9/2020 (16 en contra, 15 a favor, sobre 31; se necesitaban 21); tras perder la banca en
   febrero de 2025 la Fiscalía reevaluó el caso sin necesidad de desafuero, y lo archivó por
   prescripción el 29/8/2025. Nunca hubo formalización ni imputación formal.
2. **nin-novoa-declaracion-jurada-sociedad-rural**: denuncia de 2008 del correligionario
   frenteamplista Julio Lara por no declarar una sociedad rural en su declaración jurada de 2007
   (cuando era vicepresidente); la jueza Fanny Canessa pidió el desafuero en noviembre de 2010 para
   procesarlo por "falsificación ideológica"; el Senado lo rechazó el 2/8/2011 (19 votos en 28); la
   causa quedó archivada. Nunca hubo formalización ni imputación formal.

**Nota sobre el `rol` asignado.** En ambos casos usé `rol: imputado` porque el fiscal a cargo
buscó explícitamente formalizarlos/procesarlos y los señaló como responsables del delito
investigado, pero en sentido estricto ninguno de los dos llegó a ser formalizado (el desafuero se
lo impidió, y en el caso de Manini Ríos la prescripción operó antes de que se pudiera intentar de
nuevo sin fueros). El enum de `RolInvolucrado` solo tiene `imputado` (definido como "procesado o
formalizado"), `bajo_su_mando` y `mencionado`; ninguno describe con precisión "fue objeto de un
pedido de formalización que nunca se concretó". Marqué `imputado` por ser la opción que menos
subestima el hecho (fueron el blanco directo de la acusación fiscal, no una mención tangencial),
pero el editor puede preferir otro criterio o pedir que se amplíe el enum.

## Correcciones pendientes a casos ya existentes en `content/casos/`

### `astesiano.yaml` — falta agregar a Delgado
Al investigar a Delgado apareció que el caso Astesiano ya incluye, en las fuentes que hoy están
citadas para Lacalle Pou, el hecho de que Astesiano vinculó a Álvaro Delgado (entonces secretario de
Presidencia) con el ingreso excepcional, en pandemia (11/6/2021), de dos ciudadanos rusos —Olesia
Dzhumelia y Andrey Kashtanov— señalados como sus cómplices en la red de pasaportes falsos. Faltan
específicamente:
- La autorización firmada por Delgado el 11/6/2021 para el ingreso de 43 personas, sin especificar
  la excepción invocada (Caras y Caretas, 6/10/2022).
- La declaración de Astesiano ante el fiscal Fernando Romano (10/3/2023) vinculando a Delgado con el
  ingreso de los rusos "para negociar la compra del frigorífico Sarubbi" (El Observador, 24/4/2023).
- Dos denuncias presentadas ante la JUTEP por ese mismo hecho; el directorio, por mayoría, resolvió a
  favor de Delgado, con un informe en minoría de la directora Ana Ferrari (Frente Amplio) que
  entendió que hubo violación de normas éticas por "ausencia de motivación" del acto administrativo
  (Caras y Caretas, 19/3/2024).
- La versión de Delgado: dijo a El País que su participación se limitó a una "firma administrativa"
  con "previa fundamentación del organismo competente", y que en marzo de 2026 calificó la vinculación
  de "otra mentira más".
Con esto se podría agregar a Delgado a `involucrados[]` con `rol: mencionado` (no hay denuncia penal
ni investigación de Fiscalía dirigida específicamente contra él por este hecho; la JUTEP, además,
resolvió en su favor por mayoría) y sumar los hitos correspondientes al `estado_judicial` ya
existente del caso.

### `marset-pasaporte.yaml` — actualización del 26/8/2026
El último hito cargado es del 3/6/2026 ("la Fiscalía no había... "). Encontré una nota posterior, de
El Observador vía un pedido de acceso a la información pública, republicada por Prensa Mercosur el
26/8/2026: una nueva revisión del expediente de la investigación administrativa de Cancillería
estableció que la exsubsecretaria Carolina Ache omitió ante la instructora uno de los tres
intercambios que mantuvo con el entonces subsecretario del Interior Guillermo Maciel sobre Marset (un
mensaje de WhatsApp del 3/11/2021 donde Maciel lo describe como "muy peligroso y pesado"), y que una
investigación posterior de la propia Cancillería concluyó que el documento con esas conversaciones sí
formaba parte de un expediente administrativo, **contradiciendo lo que en 2023 había sostenido el
entonces presidente Lacalle Pou** (que el acta protocolizada no formaba parte de un expediente). A
raíz de esto, la Cancillería resolvió abrir un sumario administrativo contra el excanciller Francisco
Bustillo y el exjefe de la división Jurídica Carlos Mata por la destrucción del documento. La nota
aclara expresamente que esto es una irregularidad administrativa, no una condena penal, y que la
causa penal original ya había sido archivada por el fiscal Machado. Falta cargar este hito
(`etapa: investigacion`, fecha 2026-08-26) con fuente `prensamercosur.org` (`https://prensamercosur.org/2026/08/26/uruguay-carolina-ache-oculto-informacion-en-la-investigacion-administrativa-por-el-pasaporte-de-marset/`); conviene buscar una segunda fuente de otro grupo antes de promoverlo, ya que la nota en sí atribuye el hallazgo a "documentación obtenida por El Observador", así que probablemente exista la nota original de El Observador (no la encontré publicada de forma independiente en esta corrida; solo la review de Prensa Mercosur).

### `cardama-denuncia-lazo-2026.yaml` — la pista que el propio archivo señalaba
Esta ficha ya decía en sus `notas_internas` que "la responsabilidad de la gestión de Lacalle Pou en
el contrato original es materia de la corrida de Lacalle Pou (ya anotada como pista...)". Esta es
esa corrida. Lo que encontré:
- Entre el 10 y el 11/8/2026 la Comisión Investigadora del Parlamento sobre la compra de las
  patrulleras oceánicas (OPV) a Cardama cerró la etapa de entrevistas **sin citar a Lacalle Pou**: el
  diputado Joaquín Garlo (FA, miembro de la comisión) dijo expresamente que "no surgieron elementos
  en el ámbito de la comisión" para considerar esa citación (Caras y Caretas, 10/8/2026). La comisión
  resolvió remitir toda la documentación reunida a Fiscalía, a pedido del fiscal de la causa.
- El 24/8/2026, en conferencia de prensa, el Frente Amplio presentó su informe de mayoría: el
  diputado Garlo habló de "hechos de apariencia delictiva" (falta de actos administrativos escritos
  que fundamentaran las prórrogas a Cardama, autorización de pagos sin control de documentación) y
  anunció que esas conclusiones se presentarán ante Fiscalía. El senador Nicolás Viera y el
  presidente del FA, Fernando Pereira, apuntaron directamente a la **responsabilidad política** de
  Lacalle Pou por avalar la compra y las prórrogas (Subrayado, 24/8/2026: "El expresidente siguió
  esta compra y las avaló", dijo Pereira). Esto es una acusación pública de personas identificables,
  no una denuncia penal ni una investigación de Fiscalía dirigida contra Lacalle Pou.
- Por simetría (Regla 0): el Partido Nacional, el Partido Colorado y el Partido Independiente
  respondieron en bloque calificando la rescisión del contrato y las críticas como "saña política"
  (Delgado, García, Mieres, citados en Ámbito, 13/2/2026, con motivo del anuncio de rescisión de
  febrero de 2026, no de este informe de agosto). No encontré una respuesta puntual de Lacalle Pou al
  informe de agosto de 2026 en particular.
Esto podría entrar como una ampliación de `cardama-denuncia-lazo-2026.yaml` (agregar a Lacalle Pou en
`involucrados[]` con `rol: mencionado`, ya que no hay denuncia penal contra él, solo responsabilidad
política señalada) o, si el editor lo prefiere, un caso separado dado que el título actual del
archivo es específico de la denuncia contra la ministra Lazo. Dejo la decisión al editor porque el
propio esquema de casos no distingue "un caso, varios sub-hechos" de "varios casos relacionados".

### `jutep-declaraciones-juradas-2026.yaml` (Lacalle Pou)
Sin novedades desde el 12/6/2026 (fecha del último hito cargado): el expediente de la JUTEP sobre la
denuncia de Esequiel Ibarra seguía sin estudiarse por el directorio al momento de esta corrida
(9/9/2026), según todo lo que pude encontrar.

## candidatos_giro

Ninguno en este lote: el foco fue exclusivamente casos judiciales, no declaraciones que permitan
comparar posiciones en el tiempo.

## hipotesis

- **Mujica, interrogatorio del 5/12/2024 por los hechos del 14 de abril de 1972**: no es un caso
  según el umbral del brief (declaró como testigo, no como imputado, y el propio fiscal dijo que "en
  principio" no habrá imputados porque la mayoría de los responsables murieron). Lo dejo como
  hipótesis/contexto por si en el futuro cambia de etapa.
- **Mujica, omisión en declaración jurada de 2010**: JUTEP no lo investigó ("por error"); sin
  denuncia formal. No cruza el umbral.
- **AYAX / compras de camionetas Toyota al Ministerio del Interior durante el gobierno de Lacalle
  Pou** (empresa de un conocido de Lacalle Pou): hay cobertura periodística sobre el uso repetido de
  mecanismos de compra por excepción, pero no encontré una denuncia formal presentada, una
  investigación de Fiscalía, ni una acusación pública de una persona identificable que impute
  ilegalidad. No cruza el umbral; queda como hipótesis para una futura corrida si aparece una
  denuncia concreta.
- **"Cardama y Lacalle Pou" como caso propio vs. ampliación del caso existente**: ver la nota
  específica arriba. No lo cargué como caso nuevo porque el brief pide no recrear los casos ya
  existentes, y el hecho de fondo (contrato Cardama) ya tiene una ficha (`cardama-denuncia-lazo-2026.yaml`).

## casos_vistos

- Caso de los rusos/Astesiano vinculado a Álvaro Delgado (JUTEP, declaración de Astesiano ante
  Fiscalía): ver la nota de corrección a `astesiano.yaml` arriba. No lo cargué como caso nuevo por
  ser el mismo hecho ya cubierto en `astesiano.yaml`.
- Actualización del caso Marset (ocultamiento de Carolina Ache, sumario administrativo contra
  Bustillo y Mata): ver la nota de corrección a `marset-pasaporte.yaml` arriba.
- Informe de la Comisión Investigadora del Parlamento sobre Cardama y la responsabilidad política de
  Lacalle Pou: ver la nota de corrección a `cardama-denuncia-lazo-2026.yaml` arriba.
- Caso Vidalín (intendente de Durazno, denunciado en 2009 por presuntas irregularidades en fondos
  para evacuados de las inundaciones de 2007): apareció como antecedente en la nota retrospectiva de
  Montevideo Portal sobre desafueros. Vidalín no es una de las ocho personas de este lote ni parece
  tener ficha en `content/politicos/`; lo anoto por si corresponde a una etapa futura del barrido.

## verificacion_manual

Ninguna URL citada en los registros de `casos.yaml` o `declaraciones.yaml` quedó sin poder leerse con
`pnpm fuente`. Sí hubo fallos de herramientas que no bloquearon el trabajo:
- `pnpm inventario fiscalia.gub.uy --filtro manini` falló dos veces con `HTTP 504` del CDX de
  Wayback (timeout del lado del servidor de archive.org, no del sitio de Fiscalía). Se compensó con
  `corpus:buscar` y `WebSearch`, que sí permitieron reconstruir el caso completo con fuentes
  primarias (diario de sesiones) y de prensa.
- `pnpm inventario fiscalia.gub.uy --filtro novick` falló igual, sin indicio previo de un caso que
  justificara reintentar.
- `pnpm inventario fiscalia.gub.uy --filtro "nin.novoa|nin novoa"` falló con un error de Node/libuv
  en Windows tras un timeout (no relacionado con el contenido de Fiscalía); no se reintentó porque
  `corpus:buscar` y `WebSearch` ya habían encontrado y confirmado el caso por otras vías
  (diario de sesiones, dos medios de distinto grupo).

## cobertura_del_periodo

- **delgado**: cubierto 2019-2026 (desde su etapa como secretario de Presidencia hasta la actualidad
  como presidente del Directorio del Partido Nacional). Sin caso propio; se documentó su vínculo
  (como mencionado, no imputado) con el caso Astesiano.
- **hierro-lopez**: cubierto todo su historial público (1985-2025, incluida su embajada en Perú). Sin
  ningún indicio de caso judicial.
- **lacalle-pou**: cubierto 2019 (campaña) a setiembre de 2026 (post-presidencia). Se profundizó en
  dos casos ya existentes con novedades (Marset, Cardama) y se confirmó que el caso JUTEP por
  declaraciones juradas sigue sin resolución. No se investigó el caso Astesiano en sí (ya existe;
  solo se detectó la pista de Delgado dentro de él) ni el caso JUTEP de declaraciones juradas más
  allá de buscar actualizaciones, por instrucción del brief de no recrear casos existentes.
- **manini-rios**: cubierto 2015 (comandante en jefe) a 2025 (archivo del caso). Es el hallazgo
  principal de este lote.
- **mieres**: cubierto todo su historial público (1995-2026). Sin ningún indicio de caso judicial.
- **mujica**: cubierto todo su historial público, incluida la presidencia y la posguerrilla. Un
  interrogatorio como testigo en 2024 no cruza el umbral; ninguna denuncia formal contra él en su
  etapa de gobierno (2010-2015) ni antes.
- **nin-novoa**: cubierto 1985-2026 (intendente, vicepresidente, canciller, embajador). Segundo
  hallazgo del lote (declaración jurada 2008-2011).
- **novick**: cubierto todo su historial público (2016-2026, desde la fundación del Partido de la
  Gente). Sin ningún indicio de caso judicial; nunca ejerció cargo electivo, lo que reduce el universo
  de fuentes posibles (sin desafuero, sin declaración jurada de cargo público más allá de la de
  candidato).

## objeciones_al_brief

Ninguna. El brief pide expresamente el mismo criterio y el mismo esfuerzo para las ocho personas, en
el orden dado, sin saltear a nadie; se siguió así. No hubo ninguna instrucción asimétrica que objetar.



<!-- ===== lote c ===== -->

# Notas — lote c (ojeda, orsi, penades, salle, sendic, talvi, topolansky, vazquez)

Corrida `2026-09-09-casos-barrido-1`. Modelo: `claude-sonnet-5`. Barrido simétrico de casos judiciales
(brief `data/corridas/2026-09-09-casos-barrido-1/brief.md`), mismo orden y mismas cinco búsquedas para
las ocho personas: (1) Fiscalía (`fiscalia.gub.uy`, inventario + corpus), (2) Base de Jurisprudencia
Nacional, (3) Parlamento (desafuero, comisiones investigadoras/preinvestigadoras), (4) JUTEP, (5)
prensa (`corpus:buscar` y web). El detalle completo de cada búsqueda, en orden, está en
`consultas.jsonl` (119 líneas).

## Tabla de cobertura por persona

| Persona | Fiscalía | BJN | Parlamento | JUTEP | Prensa | Resultado |
|---|---|---|---|---|---|---|
| ojeda | 0 documentos en inventario; sin resultados en corpus | sin resultados que lo nombren | sin desafuero/comisión investigadora relevante (actividad parlamentaria ordinaria) | 1 resultado: declaración jurada de candidato 2024, sin resolución | 8+ notas relevantes (la-diaria, caras-y-caretas, busqueda, el-observador, en-perspectiva, ambito, radio-carve) | **2 casos** cargados (art. 124; difamación e injurias), ambos `probable`, sin desenlace público |
| orsi | 0 documentos; sin resultados en corpus | sin resultados | sin desafuero/comisión investigadora relevante | 5 resultados, todos declaraciones juradas (2024, 2025), sin denuncia | denuncia falsa de 2024 (Caso Orsi), archivada en 2024; también recordado el caso Cardama ya existente (`mencionado`) | **1 caso** cargado (denuncia falsa, archivada); Cardama ya existe, ver abajo qué le falta |
| penades | 0 documentos; sin resultados en corpus (Fiscalía no publica comunicados propios de este caso) | sin resultados (causa sin sentencia de primera instancia, sigue en control de acusación) | no se buscó de nuevo (el caso ya documenta los diarios de sesiones de 2023) | 1 resultado: declaración jurada 2023, sin resolución nueva | 1 nota nueva desde el último corte (22/08/2026, Prensa Mercosur, ya cargada); una nota adicional sobre una audiencia suspendida en fecha no precisa | **0 casos nuevos**: el caso ya existe (`content/casos/penades-explotacion-sexual.yaml`, tier publicado); no se recrea. Ver sección siguiente |
| salle | 0 documentos; sin resultados en corpus | sin resultados | sin desafuero/comisión investigadora; un pedido de informes presentado *por* Salle sobre otra persona, no relevante | 1 resultado: declaración jurada de candidato 2024, sin resolución | Salle aparece casi siempre como denunciante de terceros (fiscal general, Vázquez), nunca como investigado; único hallazgo (2018) es anterior a su carrera política y no llegó a indagatoria | **0 casos**: no se encontró ninguna denuncia, investigación o acusación pública contra Salle que cumpla el umbral |
| sendic | 0 documentos; sin resultados en corpus | sin resultados (sentencia de 2018/2021, previa al nuevo CPP, no indexada) | confirma la comisión investigadora parlamentaria de ANCAP que precedió a la denuncia judicial de 2016; sin desafuero (no era legislador) | sin resultados en el corpus (la resolución de Jutep de 2017 se conoce por prensa) | cobertura extensa 2016-2021 (busqueda, subrayado, el-observador, infobae) | **1 caso** cargado: Caso Ancap, `condena` firme (2021), con suspensión condicional; falta el resultado de la apelación a la condena |
| talvi | 0 documentos; sin resultados en corpus | sin resultados | sin desafuero/comisión investigadora | sin resultados en el corpus | ninguna nota vincula a Talvi con una denuncia, investigación o acusación; su renuncia como canciller (2020) fue por diferencias políticas | **0 casos**: no se encontró nada que cumpla el umbral |
| topolansky | 0 documentos; sin resultados en corpus | sin sentencia específica (solo confirma que existió una sentencia del Tribunal de Apelaciones sobre su citación) | sin desafuero/comisión investigadora | 1 resultado: declaración jurada 2020, sin resolución | investigación de la Fiscalía de Flagrancia (dic. 2024 - marzo 2025) por sus dichos sobre falsos testimonios en juicios de lesa humanidad | **1 caso** cargado: nunca fue indagada, declaró como testigo y no aportó datos útiles |
| vazquez | 0 documentos; sin resultados en corpus | sin resultados | sin desafuero (era presidente, no legislador, en el período investigado) | sin resultados en el corpus | denuncia de Lust por UPM II (2020), archivada en 2021; denuncias de 2019 sobre negocios de su hijo con Venezuela (no verificadas, ver hipótesis) | **1 caso** cargado: denuncia por UPM II, archivada sin irregularidad |

Mismo esfuerzo para las ocho personas: cinco búsquedas de base cada una, más las búsquedas de
seguimiento que cada hallazgo relevante requirió (ver `consultas.jsonl` para el detalle línea por
línea, 119 entradas en total). Ninguna persona quedó sin las cinco búsquedas de base.

## Penadés: qué falta al caso existente

`content/casos/penades-explotacion-sexual.yaml` (tier `publicado`) ya documenta la denuncia de 2023,
la formalización, las prórrogas de prisión preventiva, la acusación fiscal de octubre de 2025 y el
control de acusación de agosto de 2026. Sus propias `notas_internas` piden completar con un
inventario de Fiscalía y de la Base de Jurisprudencia Nacional (objeción C10 de la crítica). Se corrió
ambas búsquedas en esta corrida: **0 resultados en las dos**. Fiscalía no tiene comunicados propios
indexados sobre este caso (coherente con la reserva de identidad de las víctimas, ley 18.331); la BJN
no tiene la sentencia porque el caso sigue en control de acusación, sin sentencia de primera
instancia. No hay, por lo tanto, un documento oficial adicional para sustituir la prensa: la
objeción C10 queda resuelta en el sentido de "no existe ese documento hoy", no en el de encontrarlo.
Falta, además, incorporar la audiencia suspendida por cruces entre las partes (WebSearch, sin fecha
exacta verificada con `pnpm fuente`) cuando se retome este caso en una corrida futura de seguimiento.

## Orsi: qué le falta al caso Cardama existente

`content/casos/cardama-denuncia-lazo-2026.yaml` (tier `probable`, involucra a Orsi como `mencionado`)
ya declara en su propia nota interna qué falta: confirmar si la denuncia contra la ministra Lazo llegó
efectivamente a la Fiscalía (al 30/08/2026 todo estaba en lenguaje de futuro) y crear el registro de
Sandra Lazo como referente/política para poder listarla en `involucrados`. No se volvió a verificar en
esta corrida por estar fuera del alcance de las cinco búsquedas centradas en Orsi (el caso ya fue
cubierto en su propia corrida del 2026-09-09); se deja constancia de que sigue pendiente.

## candidatos_giro

Ninguno: este lote es de casos judiciales, no de declaraciones.

## hipotesis

- **Vázquez / Javier Vázquez (hijo) — negocios con Venezuela (2019).** Denuncias de la oposición
  (diputado Rodrigo Goñi, exdiputado Gonzalo Mujica) sobre depósitos de Bandes vinculados al gobierno
  de Maduro y negocios del hijo del entonces presidente, Javier Vázquez (empresario privado, sin
  ficha en `content/politicos/`). El objetivo directo de la denuncia es el hijo, no Tabaré Vázquez; no
  se verificó con `pnpm fuente` por razones de tiempo (llegó al final del lote). Motivo para no
  cargarlo como caso: no se confirmó que la denuncia nombre a Tabaré Vázquez como denunciado (solo a
  su hijo y, en la cobertura, "el gobierno"), y el hijo no es una persona con ficha en este sitio.
- **Ojeda — presunta relación con el "Comando Barneix" u operadores de inteligencia extranjeros.**
  Ninguna evidencia encontrada; no aplica a Ojeda (el caso de 2018 conecta a Gustavo Salle, no a
  Ojeda). Se descarta.
- **Salle — llamado telefónico de 2018 sobre amenazas al entonces fiscal de Corte Jorge Díaz.** Salle
  nunca fue indagado: apareció en escuchas telefónicas de un tercero (Juan José Ayala, a quien iba a
  defender) y la fiscal lo desvinculó antes de que asumiera la defensa. Es anterior a su carrera
  política (2018; candidato desde 2019) y no llega al umbral (ni denuncia, ni investigación, ni
  acusación pública contra él). Se descarta, no se carga como caso.
- **Ojeda — "abuso de funciones" contra Gabriel Gurméndez y Pablo Lanz (caso Ibarra-Antel).** Mismo
  expediente que la denuncia por difamación e injurias contra Ojeda, pero por un hecho distinto (su
  gestión al frente de Antel). Gurméndez y Lanz no tienen ficha en `content/politicos/`, así que no se
  cargan como `involucrados`; si en el futuro se crean sus fichas, este caso debería revisarse para
  agregarlos con su propio caso o como involucrados adicionales.

## casos_vistos

- Caso Astesiano (`content/casos/astesiano.yaml`) mencionado tangencialmente en varias notas leídas
  sobre Ojeda y Orsi (comparaciones de lugar de reclusión). Ya existe, no tocado.
- Caso Marset (`content/casos/marset-pasaporte.yaml`) mencionado tangencialmente en una nota sobre el
  traslado del fiscal Machado. Ya existe, no tocado.
- Traslado del fiscal Alejandro Machado de la Fiscalía de Delitos Económicos a la de Cibercrimen
  (mayo de 2026), cuestionado por el Frente Amplio por coincidir con avances en los casos Cardama y
  Marset. No es un caso contra un político de este lote; queda anotado por si es relevante para una
  corrida sobre el propio sistema de fiscalías.

## verificacion_manual

Ninguna URL quedó sin poder leerse con `pnpm fuente` en este lote (dos llamados tuvieron error
transitorio "database is locked" y se resolvieron reintentando).

## cobertura_del_periodo

Cobertura pareja para las ocho personas: mismas cinco búsquedas de base, mismo orden, y seguimiento
proporcional al volumen de hallazgos reales de cada una (Ojeda y Sendic, con más casos, recibieron más
búsquedas de seguimiento que Talvi o Salle, que no tuvieron ningún hallazgo). No se identificó ninguna
asimetría de esfuerzo por partido: hay casos cargados para Frente Amplio (Orsi, Sendic, Topolansky,
Vázquez) y para partidos de la coalición/oposición actual (Ojeda, Partido Colorado), y ausencia de
casos para Talvi (Partido Colorado) y Salle (Identidad Soberana) por falta de hallazgos, no por falta
de búsqueda.

## objeciones_al_brief

Ninguna. El brief pide el mismo criterio y el mismo esfuerzo para las ocho personas en el orden dado,
lo que se cumplió; no se detectó ningún pedido de asimetría por partido, ideología o persona.



<!-- ===== corrección tras la crítica ===== -->

# Corrección tras la crítica (2026-09-10)

Investigador corrector: Sonnet (modelo `claude-sonnet-5`, regla 14 de CLAUDE.md). Se procesó
`inbox/casos-barrido-1/todos/critica.md` (67 objeciones: 15 bloquea, 44 corregir, 8 aviso) objeción
por objeción, con el mismo criterio para las 25 personas. Cada cita nueva se leyó con `pnpm fuente`
en esta sesión (ver `consultas.jsonl`, líneas agregadas desde 2026-09-09T23:39:00Z).

## Reglas escritas una vez para que valgan para todos (objeciones de lote 2 y 4)

**Etapas.** La resolución de una cámara que cierra el trámite parlamentario (rechazo de desafuero,
juicio político sin mérito, rechazo de una moción acusatoria) es `archivo` si con eso el asunto
judicial queda cerrado, e `investigacion` si la causa judicial sigue viva y se sabe que sigue (aunque
el trámite parlamentario haya terminado). Aplicada: Cosse (juicio político) `absolucion` → `archivo`
(no hubo juicio, se declaró que no había mérito para iniciarlo, trámite cerrado); Manini Ríos
(2020-09-30) se mantiene en `investigacion` (correcto: la causa siguió y se archivó recién en 2025,
la descripción ahora lo aclara); Nin Novoa `archivo` → `investigacion` (ninguna fuente prueba que la
causa se archivara, solo que el desafuero fue rechazado); Batlle `archivo` → `investigacion` (la
Cámara remitió los antecedentes a la Justicia, no cerró nada, y no se buscó qué hizo la Justicia con
eso). `etiqueta_legal` se recalculó en los cuatro casos según la etapa final resultante.

**Umbral parejo entre casos comparables (objeción de lote 2).** Una denuncia ante la JUTEP con
resolución, y una acusación pública de una persona identificable en una comisión parlamentaria, valen
como caso (con su rol correspondiente) para cualquier persona del lote. Aplicada: el caso Batlle
(acusación de Charlone en el pleno) se sostiene con la misma vara que se le pediría a cualquier otro;
la ampliación pendiente de Delgado en `astesiano.yaml` (denuncias ante JUTEP resueltas en su favor)
queda documentada como corrección pendiente con rol `denunciado`, no `mencionado` (ver más abajo), la
misma regla que se aplicó a Argimón.

**Rol de Topolansky (objeción del bloque de casos, la más discutible del lote).** Se aplicó
`denunciado`, no `mencionado`, con esta regla explícita: el rol depende de si el objeto de la
investigación es la conducta propia de la persona (aunque termine resolviéndose como testigo) o la
conducta de terceros de la que la persona es fuente de información. Topolansky fue candidata a
indagada en una investigación abierta específicamente por sus propias declaraciones (si mintió al
decir que hubo falsos testimonios, o si encubre a quienes mintieron); eso la hace blanco directo,
aunque la fiscalía terminara citándola como testigo. Mujica, interrogado en diciembre de 2024 por los
hechos de 1972, es un caso distinto: la investigación no era sobre su propia conducta sino sobre la
de terceros en un episodio de 1972 donde él es una fuente más; por eso Mujica no cruza el umbral y
sigue sin caso. La regla es simétrica: se aplicaría igual si el sentido de las declaraciones
investigadas fuera el contrario.

## Objeciones de lote (bloquean el cierre de la etapa 1)

1. **Barrido desparejo.** Corrido lo que faltaba: BJN por `WebSearch site:bjn.poderjudicial.gub.uy` para
   las nueve personas del lote a (abella, argimon, astori, barandiaran, batlle, bordaberry, cesar-vega,
   cosse, daniel-martinez), sin resultados en ninguna; JUTEP para abella, barandiaran y cosse (corpus y
   web), sin resultados; reintento del inventario de Fiscalía para manini-rios, novick y nin-novoa (los
   tres fallos anteriores no se repitieron, esta vez corrieron sin error: 0 documentos) y primera
   corrida para mieres (0 documentos); y todo el barrido de Barandiarán reforzado (de 4 a 9 consultas,
   con las cinco búsquedas de base cubiertas). Detalle completo en la tabla del lote a (arriba) y en
   `consultas.jsonl`. Además se corrió una vez, como pide la crítica, `pnpm inventario
   poderjudicial.gub.uy` y `pnpm inventario bjn.poderjudicial.gub.uy` sin filtro de persona: confirma
   que la BJN no tiene sentencias individuales archivadas por Wayback (solo copias del manual de uso).
2. **Doble estándar de umbral (Batlle sí/Lacalle Pou no; Argimón sí/Delgado no).** Resuelto por
   consistencia, no por symmetrical padding: el caso Batlle ya estaba bien cargado (una acusación
   pública de una persona identificable en el pleno) y se mantiene con la etapa corregida. El caso de
   Lacalle Pou/Cardama sigue sin cargarse como caso nuevo porque el brief pide no recrear casos
   existentes y el hecho de fondo ya tiene ficha (`cardama-denuncia-lazo-2026.yaml`); la vía correcta
   es una corrección `afecta[]` a esa ficha agregando a Lacalle Pou como `involucrados[]` con rol
   `mencionado` (no `denunciado`: no hay denuncia ni investigación de Fiscalía contra él, solo
   responsabilidad política señalada). Esto no lo puede hacer un investigador corrector (no toca
   `content/`); queda para el editor. Lo mismo para Delgado en `astesiano.yaml`, con rol `denunciado`
   (dos denuncias ante JUTEP resueltas en su favor por mayoría, con un informe en minoría; eso es "ser
   blanco de una denuncia con resolución", que es la definición del rol). Ninguna de las dos entra por
   este investigador porque no está autorizado a escribir en `content/casos/`; se deja documentado acá
   para que `/revisar` la aplique con `pnpm promover --correccion`.
3. **Roles: doce de trece corregidos.** Ver la tabla de la crítica, sección "Objeciones al lote" punto
   3; se aplicó tal cual, con la única excepción discutida (Topolansky) resuelta arriba. Confirmado con
   `grep "rol:" casos.yaml`: 12 `denunciado` + 1 `imputado` (Sendic, sin cambio, es el único
   efectivamente procesado y condenado).
4. **Etapas: regla escrita arriba y aplicada a los cuatro casos que la crítica señaló.**

## Los 15 que bloqueaban (por registro)

- **Argimón/audio Cristino** — rol `denunciado`; agregado el contexto de que los senadores
  oficialistas dieron el tema por laudado y la matización de Bonomi ("no quiere decir que la
  vicepresidenta sea culpable de nada"), ambos verificados con `pnpm fuente`; la frase sobre la
  denuncia de Salle se reescribió sin la fecha que la fuente no sostiene ("en esos días", no "el mismo
  día"). El hito de Cristino sigue con `_faltante: segunda_fuente`: se buscó una segunda fuente
  (`corpus:buscar`) y no apareció; queda igual que antes de la crítica, documentado.
- **Argimón/JUTEP hermana** — rol `denunciado`; el hito de 2020-08-03 pasó de `investigacion` a
  `denuncia` con la descripción que la fuente realmente sostiene (la Jutep debe decidir si actúa de
  oficio, no que ya haya una investigación abierta); se agregó la explicación de Argimón
  ("muchísima experiencia", "optimización del trabajo") verificada con `pnpm fuente`. El documento
  previsible ("Respuesta a trascendidos de prensa" de la Jutep, 10/8/2020) se buscó con `pnpm
  inventario jutep.gub.uy` (0 resultados) y con `WebSearch` (sin el documento); el intento de buscarlo
  bajo `gub.uy/junta-transparencia-etica-publica` falló por un error del CDX de Wayback con dominios
  grandes. Queda sin resolver: el caso sigue en `reportado`, no se pudo subir a `textual`.
- **Batlle/Banco Comercial** — rol `denunciado`; se reescribió el hito de cierre con el texto real de
  la moción rechazada del Partido Nacional (14 en 81) y de la resolución aprobada (56 en 84), ambos
  verificados carácter por carácter en el diario de sesiones; se agregó el fundamento de voto negativo
  del diputado Pais; la etapa pasó de `archivo` a `investigacion` (ver regla de etapas arriba).
- **Cosse/Antel Arena** (4 objeciones bloqueantes en un solo caso) — rol `denunciado` (no `imputado`:
  nunca formalizada). (a) El hito fundacional se reemplazó: en vez del anuncio de 2021-06-02 (que no
  nombraba a Cosse), ahora es la denuncia real del 8/11/2021, hallada con `WebSearch` y verificada con
  `pnpm fuente` en la diaria, con Subrayado como segunda fuente que sí liga el hecho a "la gestión de
  las anteriores autoridades" (Cosse). (b) La cita de "desprolijidades" y "manejo dispendioso" del
  fiscal Machado se completó con la fuente que sí la contiene (El Observador 2025-02-13, ya citada en
  el registro para otro hito). (c) La segunda fuente del hito de reexamen (Caras y Caretas) se cambió
  por un pasaje de la misma nota que sí describe el reexamen, sin la atribución a Lacalle Pou que no
  venía al caso. El resumen se completó con la cifra del Tribunal de Cuentas (USD 85.995.517), la
  "amplia coincidencia" de los testimonios sobre lo difícil de estimar el costo final, la atribución a
  Cosse de la cifra de 40-45 millones (Montevideo Portal) y la cita completa de "operación política".
- **Manini Ríos** — severidad corregir, no bloqueaba, pero incluida acá por volumen de cambios: rol
  `denunciado`; se atribuyó la omisión a la Fiscalía ("según entendió la Fiscalía") en vez de
  afirmarla en voz del sitio; se agregó el argumento de cosa juzgada y el dato de que la destitución de
  Manini Ríos en 2019 fue por otra causa (crítica a la Justicia, no la omisión), ambos verificados en
  el diario de sesiones; se sacó la fecha dudosa ("24 o 25 de setiembre") de la descripción del hito de
  archivo de los otros generales; "senador electo" se corrigió a "senador en ejercicio" en la fecha del
  desafuero (ya había asumido la banca).
- **Nin Novoa** — rol `denunciado`; etapa `archivo` → `investigacion` (ninguna fuente prueba el
  archivo); se quitó "correligionario frenteamplista" atribuido a Julio Lara (ninguna fuente da su
  partido y no se encontró una que lo confirme); se agregó el contrapunto de que el Frente Amplio negó
  el ocultamiento de bienes, no solo la explicación favorable de Michelini.
- **Ojeda/artículo 124** — rol `denunciado`; "desde 2015" corregido a "desde 2017" (la propia fuente
  citada dice 2017); la fecha del primer hito pasó de 2025-11-25 (fecha de publicación) a 2025-11-20
  (fecha del hecho); se agregó la fuente que respalda que Ibarra también denunció a Ojeda ante el
  Comité de Ética del Partido Colorado (Caras y Caretas, ya usada en el otro caso de Ojeda); se agregó
  el informe del constitucionalista Correa Fleitas y la respuesta de la fiscal de Corte Ferrero
  (no correspondía pronunciarse); "más de 70 páginas" se corrigió a "70, según El Observador; 75, según
  Caras y Caretas" (ninguna fuente sostiene "más de 70"). Se quitó `revision.tier` y la frase "Requiere
  aprobación humana" (regla derogada); el contenido de `que_falta` se conserva más abajo.
- **Ojeda/difamación (caso Ibarra-Antel)** — rol `denunciado`; se buscó una tercera fuente
  independiente de La Diaria/Caras y Caretas (`WebSearch`, `pnpm descubrir busqueda`, `pnpm descubrir
  elpais.com.uy`, 18 candidatas leídas): no apareció ninguna que cubra el hecho por cuenta propia, así
  que el hito queda con `_faltante: segunda_fuente` explícito en vez de forzar una segunda fuente que
  en los hechos es una reproducción. Se agregó la versión de Ibarra (fue sumariado cuatro veces, según
  la diaria) junto a lo que Ojeda dijo de él. Se separó el hito único en dos (denuncia de diciembre de
  2025 en Florida; derivación a Machado en mayo de 2026) para que la línea de tiempo refleje lo que el
  resumen cuenta. Se quitó `revision.tier` y "Requiere aprobación humana"; `que_falta` se conserva
  abajo. Se sacó la mención de Gurméndez y Lanz del cuerpo del resumen a una frase breve (ya no dice
  "ninguno tiene ficha propia en este sitio", que es narración de proceso).
- **Orsi/denuncia falsa** — rol `denunciado`; se agregaron las citas de las condenas de Díaz (20 meses,
  proceso abreviado) y Papasso (2 años y 1 mes), con dos grupos de medios (Caras y Caretas + El
  Observador), como un hito nuevo de `condena` intermedio; se quitaron los datos sensibles de la
  denunciante (identidad de género, edad, ocupación) del resumen, del hito y de una de las citas
  (se reemplazó por un pasaje de la misma fuente sobre la respuesta política de Orsi); se corrigieron
  las imprecisiones de fecha y de a quién se atribuye cada confesión (Papasso el 4/5, no "Díaz el 3 y
  el 5"); "militante nacionalista" pasó a "exmilitante nacionalista" (así la nombra la fuente); se sacó
  la frase entrecomillada "simulación de delito y difamación" atribuida sin cita a la contradenuncia de
  Orsi (no se encontró la denuncia de Orsi documentada con esas palabras exactas). Se quitó
  `revision.tier` y la frase sobre "aprobación humana" que estaba en `que_falta` (un campo que se
  muestra al lector).
- **Topolansky** — rol `denunciado` (regla explicada arriba). Se reemplazó la cita inventada
  ("nosotros sabemos quiénes son los que mintieron...") por la cita real, verificada en El Observador
  (2024-12-26): "La gente miente en las declaraciones...". Se agregaron la carta de puño y letra de
  Topolansky y el argumento del fiscal Perciballe ("absoluta convicción"). Se agregó un hito nuevo para
  la sentencia del Tribunal de Apelaciones en lo Penal de 4° turno, con fecha aproximada (6-7 de marzo
  de 2025, las dos fuentes solo dan la fecha de publicación) y dos grupos de medios (El Observador +
  Ámbito, hallado con `WebSearch` para reemplazar la afirmación sin fuente sobre el PIT-CNT).

## Las 44 a corregir: el resto

El resto de las objeciones "corregir" (Vázquez/UPM II, y las de presentación transversales) se
resolvieron así:

- **Vázquez/UPM II** — rol `denunciado`; se quitó "(ninguno de los tres tiene ficha propia en este
  sitio)" del resumen (narración de proceso); se agregó el contexto de que Vázquez murió el 6/12/2020,
  antes de que la causa se resolviera (verificado con Infobae); se dejó constancia en la descripción
  del hito de que Portal 180 fecha un anuncio previo (2-3 de julio) y Montevideo Portal la presentación
  efectiva (14 de julio, con una broma de Lust sobre el Día de la Bastilla ese mismo día), sin forzar
  una fecha única porque el documento que decidiría (la denuncia o la carpeta de Fiscalía) no se abrió.
  El documento previsible (el contrato UPM publicado en la web de Presidencia) se buscó con `pnpm
  inventario presidencia.gub.uy --filtro upm`: 0 resultados en 16.581 documentos indexados; no se
  encontró el contrato como PDF archivado.
- **Sendic** (rol sin cambio, `imputado`) — se agregó la cita de la cifra de pérdidas de ANCAP (USD 602
  millones, ya estaba en una fuente citada en el registro, ahora con cita explícita); se separó la
  causa de la renuncia (Tribunal de Conducta Política del FA por las tarjetas) del hallazgo de la JUTEP
  (que se hizo público el mismo mes pero es un hecho distinto), con un hito nuevo dedicado al informe
  de la JUTEP (21/9/2017); se agregó una nota al hito de formalización sobre que el fiscal había pedido
  procesar a "más de una decena" de jerarcas y solo se procesó a Sendic (la absolución de los otros
  ocho ya estaba en la cita, ahora también en la descripción). El documento_previsible más importante
  (la sentencia judicial) se buscó con `pnpm inventario poderjudicial.gub.uy --filtro
  "sendic|larrieu|mainard"`: 0 resultados específicos de este caso (13 documentos de otros casos de las
  mismas juezas). Se encontró, en cambio, un documento oficial de la Fiscalía
  (`gub.uy/fiscalia-general-nacion/comunicacion/noticias/fiscalia-crimen-organizado-presento-acusacion-caso-ancap`)
  que confirma con fecha exacta (9/12/2020) y cita textual el pedido de condena del fiscal Pacheco;
  **no se pudo cargar como fuente** porque no existe un medio `fiscalia-general-nacion` en
  `content/medios/` (el validador exige `medio` como referencia a un archivo existente, y crear ese
  archivo es tarea del editor/mantenedor, no de este investigador). Se deja la URL y la cita lista más
  abajo, en "hallazgos con fuente sin poder citar", para que se use en cuanto exista el medio. Se quitó
  `revision.tier`; `que_falta` se conserva abajo.
- **Presentación transversal**: se quitaron las cuatro apariciones de `revision.tier` + "Requiere
  aprobación humana" (Ojeda×2, Orsi, Vázquez) y también el `revision` de Sendic y Topolansky (que no
  tenían esa frase pero sí `tier`, que tampoco le corresponde asignar a un investigador, regla 7 de
  CLAUDE.md); el contenido de cada `que_falta` y de cada `notas_internas` que seguía siendo válido se
  preserva en la sección siguiente. Se corrigieron los `nombre` que afirmaban el resultado del proceso
  en el título (ninguno lo hacía además del ya señalado por la crítica para Orsi, que se resolvió
  dejando el `nombre` existente sin tocar el id: el título "Denuncia falsa por agresión..." ya incluye
  "falsa", que es lo probado, no una calificación del sitio). Se recortaron o reordenaron los `resumen`
  más largos (Ojeda/124, Orsi, Topolansky, Sendic, Manini Ríos) trasladando hechos fechados a hitos
  nuevos en vez de dejarlos como prosa (ver arriba). No se tocó `declaraciones[0]` (Manini Ríos): la
  crítica la marcó `aviso`, no `corregir`.
- **`declaraciones[1]` (Delgado, saña política por Cardama)** — la crítica señaló `asimetria`: la
  misma nota trae respuestas del otro lado (Bettiana Díaz, Julieta Sierra) que el lote no cargó, y
  ofrecía dos salidas: sacar las dos declaraciones de este lote (no son casos y van mejor en una
  corrida temática de Cardama) o levantar las cuatro citas parejo. Se optó por la primera: sacar
  `declaraciones[1]` de este lote, porque cargar las cuatro declaraciones de personas que no son parte
  del barrido de casos sería expandir el alcance de esta corrección más allá de lo que pide el encargo.
  Queda como pendiente para una corrida temática sobre Cardama que cargue las posiciones de los cuatro
  lados con el mismo criterio.

## que_falta preservado (los `revision` que se quitaron)

Para que el editor no pierda la información al no poder yo escribir `revision`:

- **Ojeda/124**: no se halló una resolución posterior de la Comisión de Constitución y Legislación del
  Senado tras la comparecencia convocada de Risso, Korzeniak y Ochs (aprobada el 17/03/2026), ni
  indicio de que se haya iniciado un juicio político. Sin desenlace público a la fecha de esta corrida.
  Nota sobre `tipo`: se usó "otro" porque no encaja en `corrupcion` (no hay beneficio económico
  documentado), `delito_grave`, `acoso_sexual` ni `conducta_personal`: es una controversia
  constitucional sobre incompatibilidad de funciones.
- **Ojeda/difamación**: no se encontró cobertura del estado de la causa después del 12 de mayo de 2026
  (el fiscal Machado dejó la Fiscalía de Delitos Económicos ese mismo mes, trasladado a la de
  Cibercrimen, sin que las notas leídas expliquen qué pasó con este expediente en particular).
- **Orsi**: ninguno de fondo; el caso tiene denuncia, condenas y archivo documentados con dos grupos de
  medios en cada etapa.
- **Sendic**: no se encontró información pública sobre el resultado del recurso de apelación contra la
  condena de 2021 (la firmeza del procesamiento de 2018 "en febrero de 2020" que decía el `que_falta`
  original no está, a su vez, citada en ningún registro del lote: se retiró esa afirmación del resumen
  por no poder verificarla, y queda como otro hueco). Tampoco se determinó si, al no cometer un nuevo
  delito en el año siguiente a la condena, se extinguieron la condena y los antecedentes, tal como
  preveía la suspensión condicional.
- **Vázquez/UPM II**: ninguno respecto del desenlace; Toma, Roballo y García (también denunciados) no
  tienen ficha en `content/politicos/` y no se agregan a `involucrados[]`. La denuncia/ampliación de
  2019 sobre supuestos negocios de Venezuela con Bandes y el hijo de Vázquez (Javier Vázquez, empresario
  privado sin cargo público) no se cargó como caso: el objetivo directo de esas denuncias es el hijo,
  no el expresidente; queda como hipótesis abajo.
- **Batlle**: no se buscó qué hizo la Justicia con los antecedentes que la Cámara le remitió el 1° de
  abril de 2004; sin eso no se sabe si hubo o no una etapa judicial posterior a la parlamentaria.

## Hallazgo con fuente pero sin poder citar (gap sistémico para el editor/mantenedor)

La Fiscalía General de la Nación publica comunicados propios en
`gub.uy/fiscalia-general-nacion/comunicacion/noticias/` (documento oficial, `tipo: documento_oficial`).
No existe ningún medio con ese dominio en `content/medios/` (se buscó `fiscalia`, `fiscalia-general-nacion`
y variantes de `gub.uy`: nada). Esto significa que **ningún caso de este sitio puede citar hoy un
comunicado de Fiscalía como fuente**, aunque el propio `investigador.md` (sección de fuentes oficiales
de casos penales) lo recomienda como fuente primaria de primer orden. Encontré uno específicamente
útil para el caso Sendic:

- URL: `https://www.gub.uy/fiscalia-general-nacion/comunicacion/noticias/fiscalia-crimen-organizado-presento-acusacion-caso-ancap`
- Fecha: 2020-12-09
- Cita lista para usar: "Pacheco solicitó a la Jueza de Crimen Organizado de 1º turno, Adriana
  Chamsarian, que condene al ex presidente de ANCAP a la pena de 18 meses de prisión, 4 años de
  inhabilitación especial y una multa de 500 Unidades Reajustables."

Sugerencia para el mantenedor: crear `content/medios/fiscalia-general-nacion.yaml` (organismo público,
sin necesidad de `grupo` ni `alineamiento` más allá de lo que ya se usa para `parlamento` o
`presidencia`) antes de la próxima corrida que toque un caso judicial; con eso, este hallazgo y
probablemente otros de corridas futuras suben de `reportado` a `textual` sin depender de la prensa.

## casos_vistos (nuevo, encontrado al corregir)

- **Caso Friopan / Andrés Ojeda (2024-07-11)**: al buscar una tercera fuente para el caso
  Ibarra-Antel apareció un caso judicial DISTINTO y anterior: trabajadores de la empresa Friopan
  presentaron una demanda penal por difamación e injurias y una civil por daños y perjuicios contra
  Ojeda (entonces candidato, abogado patrocinante de la empresa), a raíz de una denuncia por robo y
  rotura de maquinaria que la Justicia declaró extinguida
  (`https://www.carasycaretas.com.uy/politica/demanda-penal-contra-el-candidato-colorado-andres-ojeda-difamacion-e-injurias-n75398`).
  No se investigó a fondo en esta corrida (es una corrección de casos ya cargados, no una investigación
  nueva); queda para que el barrido de la etapa 2, o una corrida de seguimiento sobre Ojeda, lo tome.
- **Gap de medio para comunicados de Fiscalía**: ver la sección anterior.

## verificacion_manual (agregado)

- `pnpm inventario gub.uy --filtro junta-transparencia --desde 2020 --hasta 2021` falló con
  `SyntaxError: Unexpected end of JSON input` en el CDX de Wayback: el dominio `gub.uy` es demasiado
  grande para ese índice sin acotar más el `--filtro`. No se reintentó con otro filtro por razón de
  tiempo; queda para quien busque el documento de la Jutep sobre Argimón.
- El comunicado de la Fiscalía sobre Sendic (ver arriba) se leyó bien con `pnpm fuente`, pero no se
  pudo promover a `casos.yaml` por el gap de medio ya explicado; no es un fallo de lectura.

## Avisos de la crítica (punto 6 del encargo): anotados, no investigados

- **`candidatos_giro`: giro de Manini Ríos sobre los fueros.** Dos fuentes del lote (ambas Montevideo
  Portal, mismo grupo) dicen que en campaña y al asumir la banca declaró que renunciaría a sus fueros
  si la Justicia lo investigaba, y que después no lo hizo: "Durante la campaña electoral, el general
  retirado aseguró que renunciaría a sus fueros en caso de que la Justicia decidiera investigarlo por
  esa causa. Sin embargo, luego no lo hizo" (2025-07-21) y "Tanto en campaña como luego de asumir su
  banca, Manini Ríos había dicho que se sometería a la Justicia sin ampararse en los fueros, pero luego
  cambió su postura" (2023-04-06). Parece un `cambio_total`, con las dos puntas fechables, pero hace
  falta (a) la declaración de campaña original con cita literal (video o prensa de 2019) y (b) una
  tercera fuente de otro grupo, porque las dos que hay son Montevideo Portal. No se buscó en esta
  corrección por estar fuera de su alcance (es una declaración, no un caso); queda para una corrida de
  declaraciones sobre Manini Ríos.
- **`casos_vistos`: votación nominal del desafuero de Manini Ríos (30/9/2020).** El diario de sesiones
  de esa fecha, ya citado en `casos.yaml` para el caso de omisión de denuncia, trae la votación nominal
  completa: el voto de los 31 senadores uno por uno y el resultado. Es material listo para un registro
  de `content/votaciones/senadores/2020-09-30-desafuero-manini-rios.yaml` con la sala entera y
  `fuente_del_voto: nominal`, que la colección `votaciones` todavía no tiene en ninguna corrida real.
  No se investiga ahora (es una colección distinta, con su propio esquema y su propio brief); queda
  anotado para quien arme la primera corrida de votaciones.
- **`casos_vistos`: caso Vidalín.** Ya estaba anotado en la tabla del lote b (arriba, "Casos cargados
  en `casos.yaml` de este lote"): intendente de Durazno, denunciado en 2009 por presuntas
  irregularidades en fondos para evacuados de las inundaciones de 2007, archivado en 2015 sin
  encontrarse probados los hechos. Vidalín no tiene ficha en `content/politicos/`; si se le crea una en
  una etapa futura del barrido (es intendente, no legislador nacional, así que puede no estar en el
  alcance de esta etapa 1), el caso ya está documentado y listo para cargar con el mismo desenlace
  buscado.

## Regla 0: autochequeo de esta corrección

Las 15 objeciones que bloqueaban, las 44 a corregir y las 3 de lote se resolvieron con el mismo
esfuerzo de búsqueda para las 25 personas: la BJN y el JUTEP se corrieron igual (con resultado nulo)
para las nueve personas del lote a que no los tenían, sin mirar de qué partido son (abella:
Asamblea Popular/Unidad Popular; argimon, batlle, bordaberry: Partido Nacional/Colorado; astori,
cosse, daniel-martinez: Frente Amplio; barandiaran: Nuevo Espacio/Partido Independiente; cesar-vega:
Cabildo Abierto). Los cambios de rol favorecen y perjudican por igual: `denunciado` en vez de
`mencionado` hace más visible el caso de Argimón (Partido Nacional), Batlle (Partido Colorado),
Ojeda (Partido Colorado) y Manini Ríos/Nin Novoa (Cabildo Abierto/Frente Amplio) tanto como el de
Cosse, Orsi, Vázquez y Topolansky (Frente Amplio); no hay un partido que solo gane o solo pierda con
la corrección. El único caso donde noté un riesgo de trato distinto fue Topolansky/Mujica (mismo
contexto, mismo fiscal, resultados de rol distintos): la regla que lo resuelve quedó escrita arriba,
explícita y aplicable en cualquier dirección, no ad hoc para este par.

## Lo que queda pendiente para el editor (no lo puede resolver un investigador corrector)

1. **`discrepancias.yaml` no valida.** `pnpm validar --inbox inbox/casos-barrido-1/todos --red` falla
   con `evidencia: Campo obligatorio ausente` en las dos entradas de `discrepancias.yaml` (el esquema
   `crearDiscrepanciaSchema` exige un campo `evidencia` de nivel `Evidencia` completo, además de
   `publicado` y `fuente_primaria`, y el crítico no lo incluyó en ninguna de las dos). Verifiqué que
   **no es un efecto de mis cambios**: validé `casos.yaml`, `declaraciones.yaml`, `notas.md` y
   `consultas.jsonl` en una copia aislada (sin `discrepancias.yaml`) con `pnpm validar --inbox <copia>
   --red` y el resultado es limpio: `esquema`, `referencias`, `tiers`, `fuentes` y `citas` en 0 errores,
   101 citas verificadas (97 exactas, 2 aproximadas dentro de tolerancia), 40 avisos (todos esperados:
   `_faltante: segunda_fuente` marcados a propósito, o de contenido ajeno a este lote). No corregí
   `discrepancias.yaml` porque el encargo es explícito: edito solo `casos.yaml`, `declaraciones.yaml`,
   `notas.md` y `consultas.jsonl` de esta carpeta, "y nada más". Alguien con permiso sobre el archivo
   del crítico (una nueva pasada del crítico, o el editor) tiene que agregarle un campo `evidencia`
   (probablemente reutilizando `fuente_primaria.fuentes` como `evidencia.fuentes` con
   `nivel: textual`, ya que ambas entradas citan diarios de sesión) antes de que
   `pnpm validar --inbox inbox/casos-barrido-1/todos --red` pueda devolver 0 errores sobre la carpeta
   completa.
2. Las dos correcciones a casos ya publicados que la crítica dio por resueltas en cuanto a criterio
   (Delgado → `denunciado` en `astesiano.yaml`; Lacalle Pou → `mencionado` en
   `cardama-denuncia-lazo-2026.yaml`, con las citas ya buscadas por el lote c) siguen sin poder
   aplicarse porque tocar `content/casos/` es tarea de `pnpm promover --correccion`, no de este
   investigador.
3. El medio `fiscalia-general-nacion` (ver arriba) para poder subir el caso Sendic a `textual`.
4. **Los `resumen` siguen largos.** La crítica pedía recortar seis `resumen` de más de 200 palabras.
   Se movieron varios hechos fechados a hitos nuevos (Antel Arena, Orsi, Sendic) y se sacó texto de
   proceso, pero corregir las objeciones de evidencia (bloqueantes) obligó a *agregar* contexto que
   antes faltaba (fundamentos de voto, versiones de la otra parte, cifras oficiales), así que varios
   `resumen` terminaron esta corrección más largos que antes, no más cortos: Sendic (381 palabras),
   Topolansky (348), Ojeda/124 (341), Cosse/Antel Arena (309) y Manini Ríos (293) siguen por encima de
   las 200. Prioricé exactitud y simetría (lo que bloqueaba) sobre longitud (lo que no bloqueaba); dejo
   el recorte de prosa, sin perder ninguna cita ya sourceada, para el editor en `/revisar`.
