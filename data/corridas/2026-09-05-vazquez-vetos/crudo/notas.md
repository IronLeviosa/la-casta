## procedimiento_constitucional

Verificado en esta sesión, artículo por artículo, en IMPO (Constitución de la República Oriental del
Uruguay, texto de 1967, Sección VII, Capítulo II):

- **Artículo 137** (plazo del Ejecutivo para observar): "Si recibido un proyecto de ley, el Poder
  Ejecutivo tuviera objeciones que oponer u observaciones que hacer, lo devolverá con ellas a la
  Asamblea General, dentro del plazo perentorio de diez días." —
  https://www.impo.com.uy/bases/constitucion/1967-1967/137

- **Artículo 138** (mayoría para levantar el veto): "Cuando un proyecto de ley fuese devuelto por el
  Poder Ejecutivo con objeciones u observaciones, totales o parciales, se convocará a la Asamblea
  General y se estará a lo que decidan los tres quintos de los miembros presentes de cada una de las
  Cámaras, quienes podrán ajustarse a las observaciones o rechazarlas, manteniendo el proyecto
  sancionado." —  https://www.impo.com.uy/bases/constitucion/1967-1967/138

- **Artículo 139** (silencio de la Asamblea): "Transcurridos treinta días de la primera convocatoria
  sin mediar rechazo expreso de las observaciones del Poder Ejecutivo, las mismas se considerarán
  aceptadas." —  https://www.impo.com.uy/bases/constitucion/1967-1967/139

- **Artículo 140** (si la Asamblea desaprueba el proyecto devuelto): "Si las Cámaras reunidas
  desaprobaran el proyecto devuelto por el Poder Ejecutivo, quedará sin efecto por entonces, y no
  podrá ser presentado de nuevo hasta la siguiente Legislatura." —
  https://www.impo.com.uy/bases/constitucion/1967-1967/140

- **Artículo 141** (transparencia de la votación): "En todo caso de reconsideración de un proyecto
  devuelto por el Ejecutivo, las votaciones serán nominales por sí o por no, y tanto los nombres y
  fundamentos de los sufragantes, como las objeciones u observaciones del Poder Ejecutivo, se
  publicarán inmediatamente por la prensa." —
  https://www.impo.com.uy/bases/constitucion/1967-1967/141

No se afirma nada de este bloque de memoria: los cinco artículos se leyeron con `pnpm fuente` en esta
sesión y la cita de cada uno es literal.

## vetos_sin_desenlace

Ninguno. El único veto identificado en los dos mandatos (2008-11-14, salud sexual y reproductiva)
tiene desenlace documentado con fuente `documento_oficial` (ficha de trámite del Parlamento: "20-11-
2008 A.G. 219/2008 Asamblea General no levanta veto" y "01-12-2008 Poder Ejecutivo promulga. Ley Nro:
18426"), así que se registró en `vetos.yaml`. No se descartó ningún veto por falta de desenlace.

## verificacion_manual

- http://www.scielo.edu.uy/scielo.php?script=sci_arttext&pid=S1688-499X2017000100151 — `pnpm fuente`
  no pudo bajarla ("fetch failed"). Era un artículo académico sobre éxito presidencial y concesiones
  legislativas en Uruguay 2000-2009; no se citó nada de esta fuente, solo se intentó como posible
  contexto sobre frecuencia de vetos.
- https://www.carasycaretas.com.uy/siete-frases-para-recordar-el-legado-politico-de-tabare-vazquez/
  — URL construida a mano a partir del snippet del corpus, devolvió HTTP 404. Se encontró la URL
  correcta (con el sufijo `-n68979`) en el archivo JSON del corpus y se volvió a intentar con éxito;
  esa segunda lectura sí está citada en `vetos.yaml`.

## cobertura_del_periodo

- **Primer mandato, 2005-03-01 a 2010-03-01**: se encontró y documentó un veto (14-11-2008, salud
  sexual y reproductiva / interrupción voluntaria del embarazo). Se buscó explícitamente si hubo
  algún otro veto en este mandato (rendición de cuentas, presupuesto, ley de medios, ANCAP, UTE, y
  variantes genéricas "Vázquez vetó ley" con rango de fechas 2005-01-01 a 2020-12-31) sin encontrar
  ningún otro caso, ni en el corpus ni en la web.
- **Segundo mandato, 2015-03-01 a 2020-03-01**: no se encontró ningún veto. Se buscó año por año
  (2016, 2017, 2018, 2019) combinando "Vázquez veto ley" en el corpus, y con búsquedas web dirigidas
  ("Tabaré Vázquez segundo mandato 2015-2020 vetó ley OR proyecto -aborto"), sin resultados. Varias
  fuentes que repasan su biografía completa (Infobae 2020, El Observador 2020, CIDOB) señalan
  explícitamente que en su segundo mandato "no tocó la ley [del aborto]" y no mencionan ningún otro
  veto de ese período al hacer el repaso de su gestión.
- **Límite metodológico explícito**: el buscador de "Repartidos" de la Asamblea General del
  Parlamento (que permitiría enumerar de forma corta y completa todos los repartidos de un cuerpo que
  sesiona pocas veces) declara en su propia página que solo cubre repartidos "a partir del
  01/01/2012", así que no se pudo usar ese método (el más confiable de los dos que se pidió aplicar)
  para verificar de forma mecánica la ausencia de vetos en 2005-2010 ni en gran parte de 2015-2020.
  Tampoco se hizo el barrido ficha por ficha de las cientos de leyes promulgadas en cada mandato (el
  método más caro, el segundo de los dos indicados): sería el paso siguiente para cerrar esta
  afirmación negativa con la misma solidez mecánica que en Lacalle Pou u Orsi. Lo que sostiene la
  conclusión de "un solo veto en diez años de gobierno" acá es: (a) múltiples fuentes de prensa y
  biografías independientes que, al repasar los dos mandatos completos de Vázquez, mencionan un único
  episodio de veto; (b) un libro académico completo (MYSU, 2010) dedicado enteramente a analizar "el
  veto" de Vázquez como si fuera un hecho singular y no uno más de una serie; y (c) que ninguna
  búsqueda dirigida a otros posibles vetos (por tema o por año) devolvió un segundo caso. Esto es
  evidencia razonable pero no una enumeración mecánica completa, y se deja así de explícito.
- **Campaña 2004 (previa al primer mandato)**: no aplica directamente al objeto "vetos" (el veto es
  una facultad del cargo), pero se buscó si había anticipado su posición sobre el aborto antes de
  asumir: no se encontró una declaración citable con fecha y cita literal de ese período específico.
- **Oposición**: no aplica; entre sus dos mandatos (2010-2015) Vázquez no ejerció un cargo desde el
  que se pueda "hacer oposición" de forma directamente relevante al objeto de esta corrida, y no tuvo
  facultad de veto en ese tramo.
- **Posmandato (2020 en adelante, hasta su fallecimiento el 2020-12-06)**: no aplica; ya no tenía la
  facultad de vetar. Se revisó el material publicado tras su muerte (obituarios de Infobae y El
  Observador) porque suelen repasar toda la gestión y habrían mencionado otro veto si lo hubiera
  habido; ninguno lo hace.

## hipotesis

- **Recuento de votos de la Asamblea General del 20-11-2008**: la ficha de trámite del Parlamento
  registra el resultado ("Asamblea General no levanta veto") pero no incluye, en el texto que
  `pnpm fuente` pudo extraer, el detalle de la votación nominal (cuántos senadores y diputados
  votaron a favor y en contra de rechazar las observaciones). Se buscó ese detalle en el Diario de
  Sesiones de la Asamblea General n.º 54 del 20-11-2008 (mencionado en la propia ficha, sesión
  extraordinaria n.º 13), pero no se pudo construir ni encontrar la URL directa a ese diario de
  sesiones específico (el buscador de "Diarios de sesiones" del Parlamento no permitió filtrar por
  fecha exacta con los parámetros que se probaron). Por eso el registro de `vetos.yaml` no incluye el
  recuento de votos, solo el resultado. Falta: acceder al Diario de Sesiones n.º 54 (A.G., 20-11-2008)
  o al repartido correspondiente para completar ese dato.
- **Declaración propia de Vázquez fuera del texto del veto**: se buscó una declaración en primera
  persona (entrevista, discurso) donde Vázquez explicara su decisión más allá del texto de las
  observaciones. El libro "Crónica de un mal amigo" (2011) contendría, según una nota de El
  Observador, un relato suyo vinculando su postura con el caso de una paciente oncológica, pero esa
  nota lo cuenta en tercera persona (paráfrasis del libro), sin una cita entrecomillada de Vázquez que
  se pueda copiar literalmente; no se tuvo acceso al libro en esta sesión. Tampoco se encontró una
  cita textual de algo que haya dicho en la gira "Pueblo a Pueblo" de noviembre de 2007, mencionada
  por 180.com.uy como el momento en que "dialogó con la prensa sobre la despenalización del aborto"
  sin reproducir sus palabras. Por eso `declaraciones.yaml` queda vacío.
- **Diferencia de numeración de artículos entre la etapa de comisión y el veto final**: en el trámite
  en comisión del Senado (agosto-setiembre de 2007) el Capítulo II ("de la interrupción voluntaria del
  embarazo") empezaba en el artículo 9, pero el texto de las observaciones (reproducido íntegro por
  Infobae) dice que vetó "los Capítulos II, III y IV, artículos 7 a 20" del texto finalmente
  sancionado. La diferencia es consistente con que el texto fue renumerado entre la instancia de
  comisión de 2007 y la sanción final de ambas cámaras en noviembre de 2008 (se agregaron artículos
  aditivos durante el trámite, según consta en la propia ficha), y no se interpretó como una
  contradicción a resolver, pero se deja anotado por si el editor quiere verificarlo contra el texto
  íntegro del proyecto sancionado.

## objeciones_al_brief

Ninguna. El brief pide cubrir los dos mandatos completos, con lo que hubo y con lo que no hubo, con
el mismo criterio, y pide verificar el procedimiento constitucional en la fuente antes de escribirlo
de memoria; así se hizo. No se identificó ningún pedido de seleccionar, omitir o encuadrar
información según partido, ideología o persona.

## medios_faltantes

- `180-com-uy` (180.com.uy, portal de noticias uruguayo, Grupo 180): citado en `vetos.yaml` por ser
  la única fuente de prensa contemporánea al día exacto del veto (14-11-2008) que documenta el
  conflicto interno en el gabinete al momento de la firma. No figura en la tabla de medios del brief;
  se usó el slug `180-com-uy` a falta de uno mejor.
- `mysu.org.uy` (Mujer y Salud en Uruguay / MYSU): se consultó en profundidad su publicación "El veto
  del Ejecutivo uruguayo a la despenalización del aborto" (2010) como contexto y para confirmar el
  alcance del veto (capítulos II, III y IV), pero no se usó como fuente citada en ningún registro
  porque no es un medio de prensa sino una organización no gubernamental que publicó un libro
  académico; no se propone como medio, se deja mencionado por transparencia de lo que se leyó.
- `cidob.org` (CIDOB, Centro de biografías de líderes políticos, ya en el corpus con la ficha de
  Vázquez): se leyó vía `corpus:buscar` pero no se abrió con `pnpm fuente` en esta sesión, así que no
  se citó en ningún registro.

## referentes_faltantes

Ninguno detectado en esta corrida.

## casos_vistos

Ninguno. No se investigaron casos judiciales (fuera del alcance de este brief) y no apareció ninguno
de forma incidental durante esta búsqueda. La nota "Otro veto de Tabaré" (diariojudicial.com, 2010)
que apareció en una búsqueda no es un caso judicial ni un veto legislativo: describe la anulación
administrativa, por parte de la Presidencia, de una multa de la Dirección General de Comercio a
laboratorios farmacéuticos por abuso de posición dominante. No es el objeto de esta corrida (que es
el veto a leyes sancionadas por el Parlamento) y no se investigó más allá de leer el resumen en el
resultado de búsqueda.

## pistas_cruzadas (registradas en el corpus, no en esta corrida)

Ninguna nueva. La pista original sobre este mismo veto (cargada por el investigador de la corrida de
Lacalle Pou en `corpus/pistas/vazquez.yaml`) es la que dio origen a esta corrida y ya está resuelta
acá.
