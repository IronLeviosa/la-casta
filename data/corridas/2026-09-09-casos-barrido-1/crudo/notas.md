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
| abella | `inventario --filtro abella`: 0 docs | No aplica: nunca ejerció cargo electivo, no hay fueros que desaforar; sin sentencia ubicable por nombre en búsquedas generales | `corpus:buscar` general y con "denuncia/fiscalía/imputado/formalizado/archivo": 20 resultados cada una, todos falsos positivos (otro "Gonzalo" o apellido "Abella" de otra persona) | Sin denuncia ubicada (nunca tuvo cargo con declaración jurada obligatoria) | `corpus:buscar` (5 variantes) y 2 `WebSearch`: sin resultados relevantes |
| argimon | `inventario --filtro argimon`: 0 docs | Sin sentencia ubicable por nombre | `corpus:buscar` general: 20 resultados, solo actuación como presidenta del Senado, sin caso; diario de sesiones no trae denuncia propia | `WebSearch` ubicó denuncia archivada por Jutep (pase en comisión de la hermana) — **caso cargado** | `corpus:buscar` (4 variantes): sin caso; `WebSearch`: ubicó denuncias por el audio con Cristino (Fiscalía, junio 2020) — **caso cargado** |
| astori | `inventario --filtro astori`: 0 docs | Sin sentencia ubicable por nombre | `corpus:buscar` general y 5 variantes: 20 resultados cada una, sin caso; comisión investigadora de Ancap (2015-16) lo tuvo como testigo/ministro, sin denuncia contra él | Sin denuncia ubicada | `WebSearch` (2 consultas: denuncia penal; Pluna/Ancap): sin denuncia formal ni acusación de ilegalidad personal, solo diferencias políticas en la investigadora de Ancap |
| barandiaran | `inventario --filtro barandiaran`: 0 docs | Sin sentencia ubicable por nombre | `corpus:buscar` general y 4 variantes: 20 resultados cada una, solo intervenciones parlamentarias, sin caso | Sin denuncia ubicada | `WebSearch`: sin resultados relevantes (solo homónimos de otros países) |
| batlle | `inventario --filtro batlle`: 0 docs | Sin sentencia ubicable por nombre | `corpus:buscar` general ubicó diario de sesiones 2004-04-01 con acusación de "violación grave de la Constitución" por la Comisión Investigadora del sistema financiero (capitalización del Banco Comercial, crisis 2002) — **caso cargado**, con desenlace (moción rechazada 38-82; resolución general aprobada 56-84 sin nombrarlo; sin indagatoria posterior) | Sin denuncia ubicada | `corpus:buscar` (3 variantes) y `WebSearch` (2 consultas): sin causa penal posterior a 2005 |
| bordaberry | `inventario --filtro bordaberry`: 0 docs | Sin sentencia ubicable por nombre (la única sentencia condenatoria hallada con el apellido es contra su padre, Juan María Bordaberry, dictador; descartada por `alias_ambiguos` de su ficha) | `corpus:buscar` general y 4 variantes: 20 resultados cada una, solo actividad como senador (pedidos de informes, interpelaciones que él mismo formula), sin caso contra él | `corpus:buscar` "Bordaberry Jutep": sin caso | `WebSearch` (2 consultas): Bordaberry aparece como **denunciante** junto a otros senadores de oposición en la comisión investigadora de Ancap (2015-16), no como denunciado; no cumple el umbral de caso contra el político |
| cesar-vega | `inventario --filtro vega`: 1 doc, pero es "Vega, Ruben" (persona distinta) | Sin sentencia ubicable por nombre | `corpus:buscar` general y 4 variantes: 20 resultados cada una, solo diarios de sesión, sin caso | `corpus:buscar` "Vega Erramuspe Jutep": sin caso | `WebSearch` (2 consultas): Vega aparece como **denunciante** (vacunación sin su consentimiento; difamación contra el periodista Leandro Grille), no como denunciado; no cumple el umbral de caso contra el político |
| cosse | `inventario --filtro cosse`: 0 docs | Sin sentencia ubicable por nombre | `corpus:buscar` general ubicó diario de sesiones 2023-07-11: juicio político de la Junta Departamental de Montevideo — **caso cargado**, con desenlace (Senado, 22 en 23, no encontró mérito) | Sin denuncia ubicada (solo su declaración patrimonial 2025, sin cuestionamiento) | `WebSearch` ubicó la causa penal por la construcción del Antel Arena (Fiscalía de Delitos Económicos y luego Lavado de Activos) — **caso cargado**, con desenlace (archivo definitivo, 2025-02-13) |
| daniel-martinez | `inventario --filtro martinez`: 4 docs, todos homónimos sin relación | Sin sentencia ubicable por nombre | `corpus:buscar` general y 4 variantes: sin caso (los diarios de sesión mencionan a un diputado homónimo, Daniel Martínez Escames) | `WebSearch`: sin denuncia sobre su declaración patrimonial (solo cobertura de que declaró USD 1,5 millones en 2019) | `WebSearch` ubicó que, en la causa judicial de Ancap (indagados: Sendic, De León, exdirector Gómez), el fiscal Luis Pacheco **no incluyó a Martínez en la lista de indagados**, pese a que la defensa de Sendic intentó atribuir las inversiones cuestionadas al "plan estratégico 2007" aprobado bajo su presidencia. No hay denuncia, investigación ni acusación pública identificable contra Martínez mismo: no cumple el umbral, no se carga como caso. Se anota como pista para `sendic` (lote c), que sí es el sujeto de esa causa. |

Nota de método: la Base de Jurisprudencia Nacional (`bjn.poderjudicial.gub.uy`) exige navegador y no la lee `pnpm fuente`; para las nueve personas se intentó ubicar sentencias por nombre a través de `corpus:buscar` y `WebSearch` (que indexan referencias a fallos publicados en prensa o en `poderjudicial.gub.uy/sites/default/files/`), sin resultados. Ninguna de las nueve tiene una sentencia identificada por este medio indirecto.

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
