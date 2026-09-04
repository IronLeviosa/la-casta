## procedimiento_constitucional

Verificado directamente en IMPO (https://www.impo.com.uy/bases/constitucion/1967-1967/137 a /141), Constitución de la República Oriental del Uruguay, Sección VII, Capítulo II:

- **Artículo 137**: «Si recibido un proyecto de ley, el Poder Ejecutivo tuviera objeciones que oponer u observaciones que hacer, lo devolverá con ellas a la Asamblea General, dentro del plazo perentorio de diez días.» — Plazo del Ejecutivo para observar: 10 días hábiles perentorios.

- **Artículo 138**: «Cuando un proyecto de ley fuese devuelto por el Poder Ejecutivo con objeciones u observaciones, totales o parciales, se convocará a la Asamblea General y se estará a lo que decidan los tres quintos de los miembros presentes de cada una de las Cámaras, quienes podrán ajustarse a las observaciones o rechazarlas, manteniendo el proyecto sancionado.» — Mayoría para que la Asamblea General levante el veto (rechace las observaciones y mantenga el proyecto tal como fue sancionado): tres quintos de los miembros presentes de cada Cámara, votando en sesión de Asamblea General.

- **Artículo 139**: «Transcurridos treinta días de la primera convocatoria sin mediar rechazo expreso de las observaciones del Poder Ejecutivo, las mismas se considerarán aceptadas.» — Si la Asamblea General no se pronuncia (no rechaza expresamente las observaciones) dentro de los 30 días de la primera convocatoria, las observaciones del Ejecutivo se dan por aceptadas tácitamente. Esto importa para clasificar `resultado.estado`: silencio parlamentario prolongado más allá de esos 30 días desde la primera convocatoria equivale, por el propio texto constitucional, a `observaciones_aceptadas` (no a `pendiente` ni a `sin_datos`), siempre que se pueda verificar la fecha de la primera convocatoria. Si no se puede verificar si hubo convocatoria, el estado correcto es `sin_datos`.

- **Artículo 140**: «Si las Cámaras reunidas desaprobaran el proyecto devuelto por el Poder Ejecutivo, quedará sin efecto por entonces, y no podrá ser presentado de nuevo hasta la siguiente Legislatura.» — Si la Asamblea General, en lugar de rechazar las observaciones, las aprueba (aceptando la posición del Ejecutivo), el proyecto original queda sin efecto y no puede reingresar hasta la siguiente Legislatura.

- **Artículo 141**: «En todo caso de reconsideración de un proyecto devuelto por el Ejecutivo, las votaciones serán nominales por sí o por no, y tanto los nombres y fundamentos de los sufragantes, como las objeciones u observaciones del Poder Ejecutivo, se publicarán inmediatamente por la prensa.» — La votación de la Asamblea General sobre las observaciones es siempre nominal y de publicación obligatoria e inmediata.

- Artículo 142 fue revisado y descartado: regula el caso de un proyecto rechazado en primera instancia por la Cámara de origen (antes de llegar a la otra Cámara), que es un supuesto distinto del veto y no aplica a esta investigación.

## vetos_sin_desenlace

Ninguno. No se encontró ningún veto de Yamandú Orsi como presidente (2025-03-01 a 2026-09-04), por lo que no hay registros de veto con o sin desenlace en `vetos.yaml`: el archivo queda con lista vacía.

La ausencia se verificó, no se asumió, mediante:
- Búsqueda de texto completo en el buscador de Repartidos del Parlamento (`parlamento.gub.uy/documentosyleyes/documentos/repartidos`), restringida a la Legislatura 50 (2025-2030), con los términos "veto", "vetó", "observaciones del Poder Ejecutivo", "objeciones u observaciones", "Mensaje del Poder Ejecutivo", "devuelve el proyecto", "el proyecto sancionado", "artículo 137/138 de la Constitución", tanto sin restricción de cuerpo como restringida a Asamblea General (Cpo_Codigo=A, el cuerpo que constitucionalmente trata las observaciones). Ningún resultado correspondió a un mensaje de observaciones del Poder Ejecutivo a un proyecto de ley: los pocos "hits" fueron un artículo de un proyecto sobre Defensa Pública que usa esa frase como título de un artículo interpretativo (no un veto), una convención internacional que menciona "veto" en el sentido de poder de veto en un organismo multilateral, y dos repartidos de autorización de ausencia del país de expresidentes.
- Búsqueda web dirigida (Google vía WebSearch) con variantes en español de "vetó/veto/observó/objeciones/promulgación parcial" combinadas con "Orsi" y con nombres de leyes conflictivas del período (Presupuesto 2025-2029, Rendición de Cuentas 2025 y 2026, ley de eutanasia/muerte digna).
- Revisión de los artículos de balance de gestión de Orsi (en español e inglés, Wikipedia "Gobierno de Yamandú Orsi" y "Presidency of Yamandú Orsi", y notas de un año y medio de gestión) sin mención de vetos.
- El único episodio relacionado con un veto en todo el período es que el 24/10/2025 un exdiputado (Carlos Iafigliola) le pidió por carta a Orsi que vetara la ley de eutanasia recién sancionada, y Orsi, consultado desde Roma, descartó hacerlo ("No pensé en vetarla, no lo pienso hacer"); la ley se promulgó sin observaciones como Ley 20.431 el 24/10/2025. Ese episodio está documentado como declaración en `declaraciones.yaml`, no como veto (porque no lo hubo).

## verificacion_manual

Ninguna. Todas las fuentes citadas en los registros de salida se leyeron con `pnpm fuente` sin errores.

## cobertura_del_periodo

- **Campaña 2024** (previa al mandato): se buscó específicamente si Orsi había hecho declaraciones sobre su disposición a usar o no el veto durante la campaña. No se encontró nada; no hay registros de este período en `declaraciones.yaml`.
- **Gobierno, 2025-03-01 a 2026-09-04** (único mandato, en curso): cubierto de forma exhaustiva para la pregunta específica "¿hubo vetos?" mediante el buscador de texto completo de Repartidos del Parlamento (todos los cuerpos, Legislatura 50) y búsqueda web amplia. Resultado: **no se encontró ningún veto**. Sí se encontró una declaración pública de Orsi descartando vetar una ley concreta (eutanasia, octubre 2025), que se registró como declaración con evidencia `reportado` de una sola fuente (`_faltante: segunda_fuente`).
- El mandato de Orsi lleva aproximadamente 18 meses de los 5 años del período (2025-2030), así que la cobertura es forzosamente parcial en el tiempo, no en el esfuerzo de búsqueda: no hay antecedente de "resto del mandato" para revisar. Esto es asimétrico frente a un presidente con mandato completo (p.ej. Lacalle Pou, cuyo período de 5 años ya cerró), y esa asimetría es inherente al objeto de la corrida, no una omisión de esta investigación.
- No se investigaron casos judiciales (fuera del alcance de este brief) ni otros temas mencionados en las pistas del corpus (línea de crédito por El Niño, deuda de impuesto de Primaria): se abrieron ambas URLs de las pistas por las reglas del proceso, se confirmó que no contienen contenido sobre vetos, y no se generó ningún registro a partir de ellas por estar fuera del objeto exclusivo de esta corrida ("todos los vetos... y ninguna otra cosa").

## hipotesis

- **Por qué no hay vetos**: una posible explicación es que, al gobernar sin mayoría propia en la Cámara de Representantes desde el inicio del mandato (situación inédita desde 1985, según cobertura de prensa), el Poder Ejecutivo necesita negociar cada proyecto antes de su sanción definitiva (ejemplos: Presupuesto 2025-2029 y Rendición de Cuentas 2026, ambos acordados con Cabildo Abierto), lo que reduce la probabilidad de que llegue a su escritorio un proyecto que decida observar. No se puede probar esta hipótesis con una fuente que la afirme explícitamente respecto del veto: es una inferencia sobre un patrón, no un hecho verificado, así que no se incluye como registro. Queda para que el editor la evalúe si le sirve de contexto.

## objeciones_al_brief

Ninguna. El brief pide cubrir el mandato completo, la campaña y la oposición si aplica, con el mismo criterio para cualquier resultado (incluida la ausencia de vetos), y así se hizo. No se detectó ningún pedido de selección, omisión o encuadre asimétrico por partido, ideología o persona.

## medios_faltantes

Ninguno. Todos los medios citados en los registros de salida (`ambito`) ya figuran en la tabla de medios del brief. Se leyeron además `teledoce` y `caras-y-caretas` (ambos ya en la tabla) para intentar una segunda fuente de otro grupo para la declaración sobre la eutanasia, sin éxito: ninguna de las dos notas contiene la cita textual de Orsi, solo el pedido de Iafigliola.

## casos_vistos

Ninguno. No se investigaron casos judiciales (fuera del alcance de este brief) y no apareció ninguno de forma incidental durante esta búsqueda.
