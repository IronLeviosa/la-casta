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

**Corrección post-revisión (2026-09-05):** la versión anterior de esta sección apoyaba el conteo de
cuatro vetos en una nota de prensa que los enumera (teledoce) más búsquedas dirigidas año por año.
El coordinador señaló, con razón, que ese método ya falló una vez en este proyecto (el investigador
de Vázquez había concluido "un veto" con el mismo tipo de evidencia, y un barrido mecánico encontró
once) y pidió reemplazarlo por un barrido mecánico del registro parlamentario más un control
positivo. Lo que sigue es ese barrido, hecho después de la entrega original.

**Método 1 — texto completo de los diarios de sesión de la Asamblea General, legislatura XLIX
(2020-2025).**
Índice: `https://parlamento.gub.uy/documentosyleyes/documentos/diarios-de-sesion?Cpo_codigo=A&Lgl_Nro=49`.
Este índice tiene 53 diarios de sesión en total para la legislatura (todas las sesiones de la
Asamblea General entre el 01-03-2020 y el 14-02-2025), es decir que revisé el 100% de las sesiones,
no una muestra. El formulario del propio índice tiene un campo de búsqueda de texto completo
(`Tipobusqueda`/`Texto`) que busca dentro del contenido de cada diario, no solo en el resumen
truncado que se ve en la tabla (confirmado: el resumen visible de la sesión del 29-12-2021, donde sé
por otra vía que se votó el veto forestal, dice solo "Texto de la citación, Asistencia,
Levantamiento del receso" — no menciona "veto" ni "observaciones"; el buscador de texto completo sí
la encuentra, así que confié en el buscador y no en el resumen de la tabla).

- Búsqueda `Texto=veto` (todas las palabras): 5 diarios de sesiones. URL:
  `https://parlamento.gub.uy/documentosyleyes/documentos/diarios-de-sesion?Cpo_codigo=A&Lgl_Nro=49&Tipobusqueda=T&Texto=veto`.
- Búsqueda `Texto=observaciones` (todas las palabras): 18 diarios de sesiones. URL:
  `https://parlamento.gub.uy/documentosyleyes/documentos/diarios-de-sesion?Cpo_codigo=A&Lgl_Nro=49&Tipobusqueda=T&Texto=observaciones`.
- Búsqueda de frase exacta `Texto=observaciones del Poder Ejecutivo`: 3 diarios. URL:
  `https://parlamento.gub.uy/documentosyleyes/documentos/diarios-de-sesion?Cpo_codigo=A&Lgl_Nro=49&Tipobusqueda=E&Texto=observaciones%20del%20Poder%20Ejecutivo`.
- Búsqueda `Texto=objeciones` (sinónimo constitucional, art. 137): 2 diarios, ya incluidos en las
  listas anteriores.

Unión de las cuatro búsquedas: 20 diarios candidatos (de 53). Abrí los 20 (bajando el PDF real de
cada uno desde `infolegislativa.parlamento.gub.uy/temporales/*.pdf`, al que la página del diario
redirige por JavaScript, y leyendo con `pnpm fuente --buscar "veto | observ"`) y clasifiqué cada uno:

- **3 son los vetos ya conocidos**, con votación de la Asamblea General: 29-12-2021 (forestal),
  01-11-2023 (Rendición de Cuentas/fiscales), 06-12-2023 (Casa de Galicia).
- **1 es la confirmación formal del cuarto veto** (Ley de Medios, art. 72): la sesión del
  17-12-2024 no vota nada, pero dentro del diario el Cuerpo da cuenta, textualmente, de que
  "VETO ACEPTADO TÁCITAMENTE POR VENCIMIENTO DEL PLAZO CONSTITUCIONAL. HA SIDO COMUNICADO
  OPORTUNAMENTE" para la Carpeta 145/2024 — es decir, el propio diario de sesiones (fuente
  `diario_de_sesiones`, más fuerte que la ficha) confirma el cuarto veto y su desenlace tácito.
  PDF: `https://infolegislativa.parlamento.gub.uy/temporales/20241217a000844c60e2b-3c36-487b-a626-524141017f07.pdf`.
- **1 es un falso positivo por otro político**: la sesión del 07-12-2021 es el homenaje de la
  Asamblea General a Tabaré Vázquez, fallecido días antes; "veto" ahí se refiere al veto de
  Vázquez a la ley de aborto en 2008, mencionado en el discurso de homenaje, no a un veto de
  Lacalle Pou. Este hallazgo, de paso, fecha con precisión el veto de Vázquez ("se produjo el 13
  de noviembre de 2008") — ya está agregado a la pista de `corpus/pistas/vazquez.yaml`.
- **Los 15 restantes son otro falso positivo sistemático**: en absolutamente todos, "observaciones"
  se refiere a que una Junta Departamental "no acepta las observaciones realizadas por el Tribunal
  de Cuentas" a una modificación presupuestal municipal (mecanismo del artículo 225 de la
  Constitución, ajeno al veto presidencial de los artículos 137 a 145), o a un caso de
  "observaciones de la OIT" sobre negociación colectiva, o a un uso coloquial de "objeciones" sin
  relación con un veto. Ninguno es un veto de Lacalle Pou a una ley.

Total de vetos según el método 1: **4**, los mismos cuatro ya registrados en `vetos.yaml`.

**Método 2 — ficha de trámite de cada ley promulgada en el período, ficha por ficha.**
Índice: `https://parlamento.gub.uy/documentosyleyes/leyes-promulgadas?Fechadesde=2020-03-01&Fechahasta=2025-03-01`.
535 leyes promulgadas entre el 01-03-2020 y el 01-03-2025 (27 páginas de listado). Bajé las 27
páginas del índice, extraje el número de ley, la fecha de promulgación y el id de ficha de asunto de
las 535 filas, y abrí la página `ficha_completa` de las 535 fichas (con `curl`, no con `pnpm fuente`,
para no archivar 535 páginas de las que 532 no aportan nada; verifiqué que las 535 descargas
llegaron completas — ninguna quedó vacía o cortada) buscando "veto" (insensible a mayúsculas) en el
texto completo de cada una. Resultado: **exactamente 3 fichas** contienen la palabra "veto" en toda
su sección de Trámite/Sanciones — las mismas tres leyes ya registradas como vetadas y luego
promulgadas: 20.212 (ficha 159716), 20.226 (ficha 160955) y 20.383 (ficha 145888). Ninguna otra de
las 535 leyes promulgadas en el período tiene rastro de haber sido vetada.

Esto cierra el hueco que el método 1 no puede cerrar por sí solo: una ley con veto total que la
Asamblea General rechaza nunca se promulga y por lo tanto nunca aparece en este listado (es el caso
de la ley forestal); pero toda ley que sí llegó a promulgarse habiendo sido vetada —parcial o
totalmente, y haya habido votación o aceptación tácita— tiene que decir "veto" en su propia ficha, y
revisé las 535, no una muestra.

**Chequeo de fecha de veto vs. fecha de promulgación** (el error que el investigador de Vázquez
cometió, según avisó el coordinador): en los tres casos con ley promulgada, verifiqué que la fila
"Poder Ejecutivo veto total/parcial" de la ficha tiene su propia fecha, dentro del mandato de
Lacalle Pou (24-10-2023, 17-11-2023 y 08-08-2024 respectivamente), y que es anterior y distinta de
la fecha de promulgación final (06-11-2023, 13-12-2023 y 16-10-2024); no tomé la fecha de
promulgación como si fuera la fecha del veto en ningún caso.

**Control positivo.** Antes de confiar en el método, lo apliqué a legislaturas donde se sabe que
hubo vetos, para comprobar que no devuelve cero o un número artificialmente bajo:

- Legislatura XLV (Batlle, 2000-2005): `Texto=veto` → **12 diarios**; frase exacta
  `Texto=observaciones del Poder Ejecutivo` → **10 diarios**. URLs:
  `https://parlamento.gub.uy/documentosyleyes/documentos/diarios-de-sesion?Cpo_codigo=A&Lgl_Nro=45&Tipobusqueda=T&Texto=veto` y
  `...&Tipobusqueda=E&Texto=observaciones%20del%20Poder%20Ejecutivo`.
- Legislatura XLVI (Vázquez, primer mandato, 2005-2010): `Texto=veto` → **5 diarios**; frase exacta
  → **2 diarios** (20-11-2008 y 06-08-2008; el primero coincide con la fecha del veto a la ley de
  aborto, 13-11-2008, más el tiempo de trámite hasta la sesión de la Asamblea General). URLs:
  `https://parlamento.gub.uy/documentosyleyes/documentos/diarios-de-sesion?Cpo_codigo=A&Lgl_Nro=46&Tipobusqueda=T&Texto=veto` y
  `...&Tipobusqueda=E&Texto=observaciones%20del%20Poder%20Ejecutivo`.

El método claramente no devuelve un resultado plano: encuentra muchos más diarios relevantes en una
legislatura con más conflicto entre Ejecutivo y Legislativo (Batlle) que en la de Lacalle Pou (3
diarios con voto + 1 de aceptación tácita), y encuentra un número bajo pero no nulo en la legislatura
46 de Vázquez, coherente con que su primer mandato tuvo mayoría propia en ambas cámaras y por lo
tanto menos fricción de la que tendría su segundo mandato (2015-2020, legislatura XLVIII, que no
revisé: no es el objeto de esta corrida). No hice el control positivo con el método 2 completo (no
abrí las ~628 fichas de leyes promulgadas 2000-2005 de Batlle una por una); el control positivo se
apoya en el método 1, que ya deja claro que el método no arroja sistemáticamente un resultado bajo o
nulo independientemente del contenido real.

**Conclusión:** los dos métodos, aplicados de forma completa (100% de los diarios de la legislatura
49, 100% de las leyes promulgadas en el mandato) y no por muestreo, coinciden entre sí y con la nota
de prensa original: **cuatro vetos**. La cobertura del período queda sostenida ahora en el registro
parlamentario completo, no en una enumeración periodística.

- **Campaña 2019 y mandato 2020-03-01 → 2025-03-01 (único mandato)**: cubierto por los dos métodos
  mecánicos arriba. No se encontró ningún veto en 2020 (primer año, pandemia) ni entre agosto de
  2024 y el fin del mandato en marzo de 2025.
- **Oposición (2015-2019, antes de asumir)**: no aplica al objeto de esta corrida — el veto es una
  facultad exclusiva del Poder Ejecutivo en ejercicio, así que no hay "vetos desde la oposición" que
  buscar.
- **Posmandato (2025-03-01 en adelante)**: no aplica por la misma razón; ya no tiene la facultad de
  vetar.
- Para cada uno de los cuatro vetos se buscó además si Lacalle Pou se refirió públicamente al hecho
  (declaraciones.yaml). Se encontró y documentó una declaración para el veto a la ley forestal y
  otra para el veto a Casa de Galicia (esta última, según la revisión posterior registrada en
  `vetos.yaml`, puede haber cambiado de estado; no la edité en esta pasada porque el alcance de esta
  corrección es específicamente el conteo de vetos, no las declaraciones). No se encontró una
  declaración pública de Lacalle Pou, más allá del texto de las observaciones mismas, para el veto
  de la Rendición de Cuentas (fiscales) ni para el de la Ley de Medios.

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
