## procedimiento_constitucional

Verificado en el texto de la Constitución de la República Oriental del Uruguay publicado por IMPO
(https://www.impo.com.uy/bases/constitucion/1967-1967), Sección VII, Capítulo II y III.

- **Artículo 137** (plazo del Ejecutivo para observar): "Si recibido un proyecto de ley, el Poder
  Ejecutivo tuviera objeciones que oponer u observaciones que hacer, lo devolverá con ellas a la
  Asamblea General, dentro del plazo perentorio de diez días."

- **Artículo 138** (mayoría para levantar el veto): "Cuando un proyecto de ley fuese devuelto por el
  Poder Ejecutivo con objeciones u observaciones, totales o parciales, se convocará a la Asamblea
  General y se estará a lo que decidan los tres quintos de los miembros presentes de cada una de
  las Cámaras, quienes podrán ajustarse a las observaciones o rechazarlas, manteniendo el proyecto
  sancionado."

- **Artículo 139** (silencio de la Asamblea): "Transcurridos treinta días de la primera convocatoria
  sin mediar rechazo expreso de las observaciones del Poder Ejecutivo, las mismas se considerarán
  aceptadas." Este mecanismo se vio aplicado literalmente en el veto al artículo 72 de la Ley de
  Medios (2024): la ficha de trámite del Parlamento registra "Plazo constitucional vence: 4 de
  octubre de 2024" y el 07-10-2024 anota "Veto aceptado tácitamente por vencimiento de plazo
  constitucional", sin que hubiera votación.

- **Artículo 140** (si la Asamblea desaprueba el proyecto devuelto): "Si las Cámaras reunidas
  desaprobaran el proyecto devuelto por el Poder Ejecutivo, quedará sin efecto por entonces, y no
  podrá ser presentado de nuevo hasta la siguiente Legislatura."

- **Artículo 141** (transparencia de la votación): "En todo caso de reconsideración de un proyecto
  devuelto por el Ejecutivo, las votaciones serán nominales por sí o por no, y tanto los nombres y
  fundamentos de los sufragantes, como las objeciones u observaciones del Poder Ejecutivo, se
  publicarán inmediatamente por la prensa." Esto se refleja en que las cuatro fichas de trámite del
  Parlamento consultadas incluyen el voto nominal completo de cada legislador.

- **Artículo 143** (si el Ejecutivo no tiene reparos): "Si el Poder Ejecutivo, a quien se hubiese
  remitido un proyecto de ley, no tuviese reparo que oponerle, lo avisará inmediatamente, quedando
  así de hecho sancionado y expedito para ser promulgado sin demora."

- **Artículo 144** (si el Ejecutivo no devuelve el proyecto en plazo): "Si el Ejecutivo no
  devolviese el proyecto, cumplidos los diez días que establece el artículo 137, tendrá fuerza de
  ley y se cumplirá como tal."

Nota sobre `resultado.estado` de este esquema: cuando la Asamblea General vota y no reúne los tres
quintos para rechazar las observaciones (arts. 138/140), o cuando el plazo vence sin pronunciamiento
(art. 139), el efecto práctico es el mismo — las observaciones del Poder Ejecutivo quedan firmes y
el proyecto no se convierte en ley tal como lo había sancionado el Parlamento —, así que en los
cuatro registros de `vetos.yaml` usé `estado: observaciones_aceptadas` tanto para los casos con
votación explícita (fichas 148848, 159716, 160955) como para el caso de silencio constitucional
(ficha 145888), y documenté el mecanismo específico de cada uno en `detalle`.

## vetos_sin_desenlace

Ninguno. Los cuatro vetos identificados (ley forestal 2021, Rendición de Cuentas/exfiscales 2023,
Casa de Galicia 2023, Ley de Medios artículo 72 de 2024) tienen desenlace documentado con fuente
`documento_oficial` (ficha de trámite del Parlamento), así que los cuatro se registraron en
`vetos.yaml`. No hay vetos descartados por falta de desenlace.

## verificacion_manual

- https://www.researchgate.net/publication/398840271_PUNTOS_DE_VETO_DURANTE_EL_GOBIERNO_DE_LACALLE_POU_JUDICIALIZACION_Y_DEMOCRACIA_DIRECTA_EN_URUGUAY_2020-2025
  — `pnpm fuente` no pudo bajarla (HTTP 403 Forbidden de ResearchGate). No se citó; se usó solo como
  pista de búsqueda (título) para confirmar por otras vías que había más de un veto en el período.
- https://ladiaria.com.uy/politica/articulo/2023/11/lacalle-pou-veto-parte-de-la-ley-para-extrabajadores-de-casa-de-galicia-por-constitucionalidad-y-conveniencia/
  y https://ladiaria.com.uy/politica/articulo/2021/12/lacalle-pou-veto-proyecto-de-ley-forestal-porque-vulnera-derechos-de-propiedad-libertad-y-trabajo/
  — se descargaron con `pnpm fuente` pero el sitio tiene paywall a partir del segundo o tercer
  párrafo (aviso "Creá una cuenta gratuita..."); el texto obtenido alcanzó para una cita corta pero
  no se pudo leer el artículo completo. No se marcó `verificacion: manual` porque sí se obtuvo texto
  descargable y citable, solo que parcial; no se usó como única fuente de ningún hecho central.

## cobertura_del_periodo

- **Campaña 2019 y mandato 2020-03-01 → 2025-03-01 (único mandato)**: cubierto. Se buscó
  específicamente en el corpus y en la web por vetos en cada año del mandato (2020, 2021, 2022,
  2023, 2024, y los primeros días de 2025 hasta el fin del mandato). No se encontró ningún veto en
  2020 (primer año, pandemia) ni en 2025 (últimos días de gobierno).
- Se encontraron y documentaron cuatro vetos, todos entre diciembre de 2021 y agosto de 2024:
  ley forestal (2021-12-16), Rendición de Cuentas/exfiscales (2023-10-24), Casa de Galicia
  (2023-11-17) y Ley de Medios artículo 72 (2024-08-08).
- La lista de cuatro vetos está confirmada por una fuente de prensa contemporánea al último veto
  (teledoce, 2024-08-09, "los cuatro vetos de Lacalle Pou a una norma aprobada en el Parlamento en
  este período de gobierno", que los enumera uno por uno) y por búsquedas propias en el índice del
  Parlamento (fichas de asunto) para cada uno de los cuatro casos. Además se buscó explícitamente
  evidencia de un quinto veto entre agosto de 2024 y marzo de 2025 (fin del mandato) y no apareció
  ninguno, ni en prensa ni en los resultados de búsqueda del sitio del Parlamento.
- No se investigó la posibilidad de vetos previos a 2021 más allá de la búsqueda general "Lacalle
  Pou veto 2020 primer año pandemia observó ley", que no arrojó ningún caso: es una ausencia
  buscada, no una ausencia por omisión.
- **Oposición (2015-2019, antes de asumir)**: no aplica al objeto de esta corrida — el veto es una
  facultad exclusiva del Poder Ejecutivo en ejercicio, así que no hay "vetos desde la oposición" que
  buscar.
- **Posmandato (2025-03-01 en adelante)**: no aplica por la misma razón; ya no tiene la facultad de
  vetar.
- Para cada uno de los cuatro vetos se buscó además si Lacalle Pou se refirió públicamente al hecho
  (declaraciones.yaml). Se encontró y documentó una declaración para el veto a la ley forestal y
  otra para el veto a Casa de Galicia. No se encontró una declaración pública de Lacalle Pou, más
  allá del texto de las observaciones mismas, para el veto de la Rendición de Cuentas (fiscales) ni
  para el de la Ley de Medios; esto se buscó activamente (ver consultas.jsonl) y se anota como
  ausencia documentada, no como omisión.

## hipotesis

- El veto a la Rendición de Cuentas 2022 y el veto a la Ley de Medios no tienen, hasta donde se
  buscó, una declaración pública directa de Lacalle Pou explicando personalmente el veto (más allá
  del texto de las observaciones, que ya está citado en `vetos.yaml` como `evidencia`, no como
  `declaracion`). Es posible que exista una declaración en una conferencia de prensa no indexada por
  los buscadores usados, o en video sin transcripción disponible. No se pudo confirmar con la
  evidencia reunida.
- El texto completo del mensaje de observaciones (documento firmado por el Poder Ejecutivo) para
  cada uno de los cuatro vetos no se encontró alojado directamente en un dominio oficial (IMPO,
  Presidencia) de forma fácilmente indexable por buscador; se accedió a su contenido a través de
  prensa que lo reprodujo (el-observador, montevideo-portal, ámbito, subrayado) y a través de la
  ficha de trámite del Parlamento (que confirma fecha, alcance y resultado pero no reproduce el
  texto completo del mensaje). Si se quisiera nivel `textual` basado exclusivamente en el documento
  del Poder Ejecutivo sin intermediación de prensa, faltaría ubicar el PDF original (posiblemente en
  medios.presidencia.gub.uy o en los "Repartidos" de la Asamblea General referenciados en cada
  ficha, ej. "Rep.10/0", "Rep.24/0", "Rep.25/0", "Rep.36/0", que no se descargaron en esta corrida).

## casos_vistos

Ninguno. No se investigaron casos judiciales; el brief de esta corrida pide específicamente vetos,
no casos.

## objeciones_al_brief

Ninguna. El brief pide cubrir el mandato completo, con lo que hubo y con lo que no hubo, y así se
hizo. No se identificó ninguna instrucción que pidiera seleccionar, omitir o encuadrar información
según partido o persona.

## referentes_faltantes

Ninguno nuevo. Cabildo Abierto, el Frente Amplio y el Partido Nacional se mencionan en `vetos.yaml`
solo como quiénes impulsaron cada proyecto, sin que eso constituya una mención a un referente en el
sentido del esquema (`content/referentes/`).

## medios_faltantes

Ninguno. Todos los medios citados (parlamento, impo, el-observador, montevideo-portal, ambito,
subrayado, teledoce, la-diaria) ya figuran en `content/medios/` según la tabla del brief.

## pistas_cruzadas (registradas en el corpus, no en esta corrida)

- Se agregó una pista a `<CORPUS_DIR>/corpus/pistas/vazquez.yaml`: Tabaré Vázquez vetó la ley de
  interrupción voluntaria del embarazo en 2008 (mencionado en Wikipedia y en el esquema del propio
  proyecto, que ya trae como ejemplo de id `vazquez/2008-11-14-salud-sexual-reproductiva`). No se
  investigó — corresponde a otra corrida sobre Vázquez.
- Se agregó una pista a `<CORPUS_DIR>/corpus/pistas/orsi.yaml`: en la cobertura del veto a la Ley de
  Medios (agosto 2024), un titular de montevideo.com.uy indica que Orsi (entonces candidato) opinó
  sobre el veto: "Orsi sobre veto de Lacalle Pou a artículo de Ley de Medios: 'Fue una especie de
  alivio'". No se abrió esa nota ni se investigó — corresponde a una corrida sobre declaraciones o
  menciones de Orsi.
