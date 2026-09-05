## procedimiento_constitucional

Verificado directamente en IMPO (https://www.impo.com.uy/bases/constitucion/1967-1967/137
a /141), Constitución de la República Oriental del Uruguay, Sección VII ("De la
proposición, discusión, sanción y promulgación de las leyes"), Capítulo II:

- **Artículo 137** (plazo del Ejecutivo para observar): «Si recibido un proyecto de
  ley, el Poder Ejecutivo tuviera objeciones que oponer u observaciones que hacer,
  lo devolverá con ellas a la Asamblea General, dentro del plazo perentorio de diez
  días.»

- **Artículo 138** (mayoría para levantar el veto): «Cuando un proyecto de ley
  fuese devuelto por el Poder Ejecutivo con objeciones u observaciones, totales o
  parciales, se convocará a la Asamblea General y se estará a lo que decidan los
  tres quintos de los miembros presentes de cada una de las Cámaras, quienes podrán
  ajustarse a las observaciones o rechazarlas, manteniendo el proyecto sancionado.»
  Nota de la propia IMPO: la redacción de este artículo es la de la reforma
  constitucional de 1996.

- **Artículo 139** (silencio de la Asamblea): «Transcurridos treinta días de la
  primera convocatoria sin mediar rechazo expreso de las observaciones del Poder
  Ejecutivo, las mismas se considerarán aceptadas.»

- **Artículo 140** (si la Asamblea desaprueba el proyecto devuelto): «Si las
  Cámaras reunidas desaprobaran el proyecto devuelto por el Poder Ejecutivo,
  quedará sin efecto por entonces, y no podrá ser presentado de nuevo hasta la
  siguiente Legislatura.»

- **Artículo 141** (transparencia de la votación): «En todo caso de reconsideración
  de un proyecto devuelto por el Ejecutivo, las votaciones serán nominales por sí o
  por no, y tanto los nombres y fundamentos de los sufragantes, como las
  objeciones u observaciones del Poder Ejecutivo, se publicarán inmediatamente por
  la prensa.»

No fue necesario usar estos artículos para calificar un `resultado.estado` en
`vetos.yaml` porque no se encontró ningún veto en el mandato (ver más abajo), pero
quedan verificados para que el editor los tenga disponibles si en otra corrida
sobre Mujica (u otro presidente) aparece un caso.

## vetos_sin_desenlace

Ninguno, porque no se encontró ningún veto que registrar: `vetos.yaml` queda con
lista vacía. No hay, por lo tanto, ningún veto descartado por falta de desenlace;
la ausencia de registros en este archivo es la ausencia de vetos, no una falta de
investigación (ver `cobertura_del_periodo`).

## verificacion_manual

- https://www.researchgate.net/publication/398840271_PUNTOS_DE_VETO_DURANTE_EL_GOBIERNO_DE_LACALLE_POU_JUDICIALIZACION_Y_DEMOCRACIA_DIRECTA_EN_URUGUAY_2020-2025
  — `pnpm fuente` no pudo bajarla (HTTP 403 Forbidden de ResearchGate). No se citó
  en ningún registro; se intentó solo porque un paper sobre "puntos de veto" en el
  gobierno de Lacalle Pou podría tener, en su marco teórico o antecedentes, una
  cifra comparativa de vetos por presidente uruguayo desde 1985, que hubiera sido
  útil para corroborar la ausencia de vetos de Mujica. Sigue sin poder leerse (ya
  había fallado igual en la corrida `2026-09-04-lacalle-pou-vetos`).

- La cita de la declaración de 2009 (El País, vía Wayback Machine,
  https://web.archive.org/web/20100120094504/http://www.elpais.com.uy:80/091116/pnacio-454575/nacional/jose-mujica-promueve-plebiscito-por-aborto)
  se descargó correctamente, pero el texto tiene un problema de codificación de
  caracteres: las vocales acentuadas de la nota original (de 2009, en un sitio
  probablemente en Windows-1252/Latin-1) aparecen como el carácter de reemplazo
  `�` en el texto que devolvió `pnpm fuente` (ej. "m�s" en vez de "más", "decisi�n"
  en vez de "decisión"). No es un error de transcripción mío ni una particularidad
  del habla de Mujica: es un artefacto de la extracción de esa página archivada
  concreta. Confirmé que el JSON guardado en el corpus tiene el mismo problema
  carácter por carácter (no es solo una rareza de la terminal), así que la `cita`
  en `declaraciones.yaml` y `promesas.yaal` reproduce el texto literal tal cual lo
  devolvió la herramienta, con los caracteres `�` incluidos, en vez de que yo
  reconstruya a mano qué vocal acentuada correspondía en cada caso. El editor
  debería considerar volver a extraer esa nota con una detección de codificación
  distinta antes de publicar, o al menos no tratar los `�` como parte real de la
  cita.

## cobertura_del_periodo

**Mandato de José Mujica como presidente: 2010-03-01 a 2015-03-01 (único mandato).**
Es el único período que aplica al objeto de esta corrida: el veto es una facultad
exclusiva del Poder Ejecutivo en ejercicio, así que ni la campaña 2009 ni la
oposición ni el posmandato (Mujica siguió como senador y luego se retiró de la
política activa; falleció el 2025-05-13) pueden generar un veto propio. Sí se buscó
en esos períodos si Mujica **habló** sobre vetos (ver `declaraciones.yaml`), y ahí
sí hay hallazgos: una promesa de campaña de no vetar la ley de aborto (2009) y una
declaración en el primer año de gobierno sobre su rechazo de principios al veto
(2011).

**Conclusión de esta corrida: no se encontró ningún veto de José Mujica durante su
mandato.** Esto se sostiene en un barrido con métodos independientes, no en una
única búsqueda negativa:

1. **Índice completo de repartidos de la Asamblea General, Legislatura 47
   (2010-2015), cuerpo A.G.**: la Asamblea General es el cuerpo al que
   constitucionalmente se devuelve un proyecto vetado (art. 137). El índice de
   Parlamento (`https://parlamento.gub.uy/documentosyleyes/documentos/repartidos?Cpo_Codigo=A&Lgl_Nro=47`,
   leído con `pnpm fuente`) lista **15 repartidos en total** para toda la
   Legislatura 47, del 2012-01 al 2014-07 (números 8 a 23, con dos anexos
   duplicados en 9 y 11). Ninguno de los 15 títulos corresponde a un proyecto de
   ley observado: son ceses de ministros de la Suprema Corte y del Tribunal de lo
   Contencioso Administrativo, informes anuales de la INDDHH, la comisión especial
   de inteligencia de Estado, la elección de un candidato a la Corte Penal
   Internacional, una comisión sobre el voto de los uruguayos en el exterior y el
   informe de gestión de gobierno. Después del repartido 23 (2014-07) no hay
   ningún repartido más de Asamblea General hasta el fin del mandato
   (2015-03-01): se verificó explícitamente con `Rptd_Anio=2010` y `Rptd_Anio=2011`
   que no devuelven ninguna fila (confirmando el aviso de la propia página: "Los
   Repartidos se encuentran disponibles a partir de la siguiente fecha: Asamblea
   General a partir del 01/01/2012"), y no hay repartidos posteriores al número 23.
   Como control positivo del método, el mismo índice para la Legislatura 49
   (Lacalle Pou) sí lista los 4 vetos ya conocidos de esa corrida (repartidos
   10/0, 24/0, 25/0 y 36/0 de esa legislatura), lo que confirma que el método
   encuentra vetos reales cuando existen.

2. **Límite del método 1**: los repartidos de Asamblea General anteriores al
   01/01/2012 no están digitalizados en el sitio del Parlamento. Esto deja sin
   cobertura directa por este método a los primeros ~22 meses del mandato
   (2010-03 a 2011-12) — casi el 40% del período. Para esa ventana temprana no
   pude enumerar de forma exhaustiva y verificada los repartidos de Asamblea
   General, porque no existen en el sistema.

3. **Para cerrar ese hueco temprano, usé el método 2 (ficha de trámite, sección
   "Sanciones") sobre las leyes más significativas y más propensas a fricción
   política de todo el mandato**, no solo del período temprano, incluyendo las que
   podrían haber generado un veto por su carácter presupuestal o controvertido:
   Presupuesto Nacional 2010-2014 (Ley 18.719, asunto 104435), Rendición de
   Cuentas 2010 (Ley 18.834, asunto 108306), Rendición de Cuentas 2011 (Ley
   18.996, asunto 112929), Rendición de Cuentas 2012 (Ley 19.149, asunto 117545),
   la ley interpretativa de la Ley de Caducidad (Ley 18.831, asunto 109882, la
   pieza legislativa más controvertida del primer año de gobierno), la
   despenalización del aborto (Ley 18.987, asunto 107885), el matrimonio
   igualitario (Ley 19.075, asunto 109246), la regulación del cannabis (Ley
   19.172, asunto 113662) y la Ley de Medios (Ley 19.307, asunto 119374, la
   última ley grande del mandato, sancionada a fines de diciembre de 2014). Las
   nueve fichas, leídas con `pnpm fuente`, muestran la misma línea en su sección
   "Sanciones": **"Poder Ejecutivo promulga."**, sin ninguna mención de "veto
   total" ni "veto parcial" (que sí aparece, como control, en las fichas de los
   cuatro vetos de Lacalle Pou revisadas en la corrida anterior).

4. **Grilla de repartidos de las tres cámaras (Representantes, Senadores y
   Asamblea General) para toda la Legislatura 47**, sin filtro de texto:
   se hizo una lectura (parcial, por costo — ver más abajo) de los títulos de
   Representantes y Senadores para los años 2010 y 2011 específicamente (la
   ventana sin repartidos de A.G. digitalizados), sin encontrar ningún título que
   mencione observaciones u objeciones del Poder Ejecutivo. Esta verificación es
   **parcial y no exhaustiva**: cada cuerpo tiene varios cientos de repartidos por
   año y solo revisé el primer tramo (~6000 caracteres) que devuelve `pnpm fuente`
   por cada consulta, no la lista completa. Además, ya había confirmado con un
   control cruzado sobre la Legislatura 49 que el título de un repartido en
   Representantes o Senadores para el mismo asunto de un veto real no siempre
   incluye la palabra "veto" u "observación" (ejemplo: el repartido 43/2 de
   Representantes para la Ley de Medios de 2024 dice solamente "SERVICIOS DE
   DIFUSIÓN DE CONTENIDO AUDIOVISUAL", sin la palabra "observación"), así que una
   lectura por título en estos dos cuerpos **no sería, por sí sola, concluyente**
   aunque hubiera cubierto el 100% de las filas. Por eso el peso principal de la
   conclusión negativa recae en el método 1 (índice de A.G., que si es
   digitalizado es completo) y el método 2 (fichas de trámite individuales),
   no en esta grilla de títulos.

5. **Corroboración independiente en fuentes secundarias**: los artículos
   "Gobierno de José Mujica" y "Presidency of José Mujica" de Wikipedia (español e
   inglés) no mencionan ningún veto legislativo de Mujica. El análisis político de
   Oscar Bottinelli (Factum, 22-04-2011,
   https://portal.factum.uy/analisis/2011/ana110422.php) explica por qué un
   presidente con mayoría parlamentaria propia —como Mujica, con el Frente
   Amplio— casi no tiene incentivo político para vetar, porque el veto está
   pensado constitucionalmente para gobiernos sin mayoría propia (cita a
   Sanguinetti en su primera presidencia como el caso que sí recurrió mucho al
   veto). Varias búsquedas web adicionales sobre "Mujica vetó" en 2010-2015 no
   devolvieron ningún caso, mientras que sí devuelven con facilidad los casos de
   Vázquez (aborto, 2008) y de Lacalle Pou (cuatro vetos, 2021-2024) cuando se
   buscan con los mismos términos.

**En síntesis**: la ausencia de vetos de Mujica está respaldada por (a) un índice
completo y verificado (con control positivo) para el 60% del mandato en el que
existe digitalización, (b) una revisión dirigida de las leyes más propensas a
fricción política en el 100% del mandato incluyendo la ventana sin digitalizar, y
(c) ausencia de cualquier mención de un veto de Mujica en fuentes secundarias
(enciclopédicas, periodísticas y académicas) que si existiera un veto real
probablemente lo mencionarían, como mencionan con facilidad los de Vázquez y
Lacalle Pou. No es una prueba matemática de que jamás hubo una sola ley observada
en 60 meses, pero es un barrido proporcional al objeto de la corrida y muy por
encima del umbral de "sin resultados en la primera búsqueda".

## hipotesis

- **Por qué no hay vetos**: la explicación más plausible, según el análisis de
  Bottinelli citado arriba, es que Mujica gobernó con mayoría parlamentaria propia
  del Frente Amplio en ambas cámaras durante todo el mandato, y el veto
  constitucional uruguayo está diseñado para darle poder a un Ejecutivo sin
  mayoría propia frente al Parlamento — "lo que se considera contra natura es que
  un presidente vete una ley aprobada con los votos de su propio partido". No se
  puede convertir esto en un registro porque es una inferencia sobre un patrón
  institucional, no un hecho verificado puntual; queda para que el editor lo use
  como contexto si le sirve.

- **La declaración de 2009 sobre no vetar la ley de aborto y la de 2011 sobre ser
  "enemigo del veto por una cuestión de principios" son consistentes entre sí y
  con la ausencia de vetos observada**: no hay ningún candidato a giro (cambio de
  posición) sobre el uso del veto por parte de Mujica en todo lo que se investigó
  en esta corrida. Esto también es información, aunque no genere un registro de
  giro.

- La declaración de 2011 (`cooperativa.cl`) solo tiene una fuente (`_faltante:
  segunda_fuente`). Busqué activamente una segunda fuente uruguaya con la misma
  cita literal (El Observador, la diaria, Infobae, Búsqueda — ver
  `consultas.jsonl`) y no la encontré con las palabras exactas; sí hay abundante
  cobertura del episodio político más amplio (la interna del Frente Amplio sobre
  la Ley de Caducidad), pero no de esta cita puntual sobre el veto. No se puede
  confirmar con una segunda fuente con la evidencia reunida en esta corrida.

## casos_vistos

Ninguno nuevo generado por esta corrida. El brief no pide investigar casos
judiciales y no apareció ninguno de forma incidental durante esta investigación
específica sobre vetos.

(Nota aparte, sin relación con esta corrida: el brief trae una pista del corpus
sobre el caso Astesiano y otra sobre ANCAP/Sendic que mencionan a Mujica; no las
investigué porque el objeto exclusivo de esta corrida son los vetos, y el brief
del `investigador` no autoriza investigar casos judiciales salvo pedido explícito.
Quedan disponibles en `corpus/pistas/mujica.yaml` para quien corra una corrida
sobre transparencia-corrupcion de Mujica.)

## objeciones_al_brief

Ninguna. El brief pide cubrir el mandato completo, decir explícitamente si un
mandato no tuvo vetos, y sostener esa afirmación con el barrido y las URLs
revisadas — no pide encuadrar la ausencia (o presencia) de vetos a favor o en
contra de ningún partido o persona, y así se hizo. No se detectó ninguna
instrucción del brief que pidiera seleccionar, omitir o encuadrar información
según partido, ideología o persona.

## medios_faltantes

- `cooperativa-cl` (Cooperativa.cl, Chile — radioemisora y portal de noticias
  chileno; grupo y alineamiento no verificados en esta corrida) — citado en una
  declaración de 2011 por ser, hasta donde busqué, la única fuente con la cita
  literal de Mujica sobre el veto a la ley de caducidad.

Todos los demás medios citados (`el-pais`, `parlamento`, `impo`) ya figuran en
`content/medios/` según la tabla del brief (confirmado además con `ls
content/medios/`, que ya incluye `icndiario.yaml`, agregado después de la fecha
del brief).
