## procedimiento_constitucional

Verificado directamente en IMPO (https://www.impo.com.uy/bases/constitucion/1967-1967/137 a /144), Constitución de la República Oriental del Uruguay, Sección VII, Capítulos II y III:

- **Artículo 137**: «Si recibido un proyecto de ley, el Poder Ejecutivo tuviera objeciones que oponer u observaciones que hacer, lo devolverá con ellas a la Asamblea General, dentro del plazo perentorio de diez días.» — Plazo del Ejecutivo para observar: 10 días perentorios. (Corrección: en una versión anterior de esta nota se agregó la palabra "hábiles" a este plazo; esa palabra no está en el texto citado ni se encontró en los artículos 137, 138, 139, 140, 141 o 144, así que se retira. El plazo se cita tal como lo da la Constitución, sin calificarlo.)

- **Artículo 138**: «Cuando un proyecto de ley fuese devuelto por el Poder Ejecutivo con objeciones u observaciones, totales o parciales, se convocará a la Asamblea General y se estará a lo que decidan los tres quintos de los miembros presentes de cada una de las Cámaras, quienes podrán ajustarse a las observaciones o rechazarlas, manteniendo el proyecto sancionado.» — Mayoría para que la Asamblea General levante el veto (rechace las observaciones y mantenga el proyecto tal como fue sancionado): tres quintos de los miembros presentes de cada Cámara, votando en sesión de Asamblea General.

- **Artículo 139**: «Transcurridos treinta días de la primera convocatoria sin mediar rechazo expreso de las observaciones del Poder Ejecutivo, las mismas se considerarán aceptadas.» — Si la Asamblea General no se pronuncia (no rechaza expresamente las observaciones) dentro de los 30 días de la primera convocatoria, las observaciones del Ejecutivo se dan por aceptadas tácitamente. Esto importa para clasificar `resultado.estado`: silencio parlamentario prolongado más allá de esos 30 días desde la primera convocatoria equivale, por el propio texto constitucional, a `observaciones_aceptadas` (no a `pendiente` ni a `sin_datos`), siempre que se pueda verificar la fecha de la primera convocatoria. Si no se puede verificar si hubo convocatoria, el estado correcto es `sin_datos`.

- **Artículo 140**: «Si las Cámaras reunidas desaprobaran el proyecto devuelto por el Poder Ejecutivo, quedará sin efecto por entonces, y no podrá ser presentado de nuevo hasta la siguiente Legislatura.» — Si la Asamblea General, en lugar de rechazar las observaciones, las aprueba (aceptando la posición del Ejecutivo), el proyecto original queda sin efecto y no puede reingresar hasta la siguiente Legislatura.

- **Artículo 141**: «En todo caso de reconsideración de un proyecto devuelto por el Ejecutivo, las votaciones serán nominales por sí o por no, y tanto los nombres y fundamentos de los sufragantes, como las objeciones u observaciones del Poder Ejecutivo, se publicarán inmediatamente por la prensa.» — La votación de la Asamblea General sobre las observaciones es siempre nominal y de publicación obligatoria e inmediata.

- **Artículo 144**: «Si el Ejecutivo no devolviese el proyecto, cumplidos los diez días que establece el artículo 137, tendrá fuerza de ley y se cumplirá como tal, reclamándose esto, en caso omiso, por la Cámara remitente.» — Si el Ejecutivo deja pasar los 10 días del artículo 137 sin devolver el proyecto con observaciones, el proyecto se convierte en ley por el solo vencimiento del plazo (promulgación por omisión).

- Artículo 142 fue revisado y descartado: regula el caso de un proyecto rechazado en primera instancia por la Cámara de origen (antes de llegar a la otra Cámara), que es un supuesto distinto del veto y no aplica a esta investigación.

## vetos_sin_desenlace

Ninguno. No se encontró ningún veto de Yamandú Orsi como presidente. `vetos.yaml` queda con lista vacía.

**Corrección de método.** La primera versión de esta investigación apoyó la ausencia de vetos en una búsqueda de texto libre sobre los Repartidos del Parlamento (`documentosyleyes/documentos/repartidos`). El crítico mostró, con un experimento reproducible, que ese método tiene falsos negativos: aplicado al veto confirmado de Lacalle Pou a la ley de suelos de prioridad forestal (ficha de asunto 148848), la búsqueda de texto libre no lo encuentra, porque el repartido que contiene el mensaje de observaciones está indexado con un título genérico sin la palabra "veto". Ese método quedó descartado como evidencia de la ausencia.

**Método corregido, verificado antes de aplicarlo a los 120 casos:**
- Se confirmó el patrón positivo en la ficha de asunto 148848 (Lacalle Pou, suelos de prioridad forestal): la sección **Sanciones** de la ficha de trámite muestra las líneas `16-12-2021 Poder Ejecutivo veto total.` y `29-12-2021 A.G. 74/2021 Asamblea General no levanta veto.`
- Se confirmó el patrón negativo en la ficha de asunto 165490 (Orsi, ley de eutanasia/muerte digna, Ley 20.431): la sección Sanciones termina en `24-10-2025 Poder Ejecutivo promulga.`, sin ninguna línea de veto.
- Con el patrón confirmado en ambos sentidos, se aplicó a **las 120 leyes promulgadas en la Legislatura 50 entre el 1/3/2025 y hoy** (ver conteo, fechas y URL del listado en `cobertura_del_periodo`): se abrió la ficha de trámite de cada una (`parlamento.gub.uy/documentosyleyes/ficha-asunto/<asunto>`) y se revisó el texto completo de su sección Sanciones buscando la palabra "veto" (que aparece tanto en "Poder Ejecutivo veto total/parcial" como en "Asamblea General levanta/no levanta veto"). **Resultado: 120 de 120 fichas terminan en "Poder Ejecutivo promulga.", ninguna contiene la palabra "veto".**

**Cronología del episodio de la eutanasia (corregida).** El 16/10/2025 —después de que el Senado sancionara el proyecto el 15/10/2025 y antes de la promulgación— Orsi, consultado desde Roma sobre la ley recién aprobada por el Parlamento, descartó vetarla ("No pensé en vetarla, no lo pienso hacer"; fuente: Ámbito, 16/10/2025). Ocho días después, el 24/10/2025, el exdiputado Carlos Iafigliola le presentó una carta pidiéndole igual que la vetara (fuentes: Teledoce y Caras y Caretas, 24 y 26/10/2025); ese mismo 24/10/2025 el Poder Ejecutivo promulgó la ley sin observaciones, como Ley 20.431 (confirmado en la sección Sanciones de la ficha de asunto 165490: "Poder Ejecutivo promulga."). Es decir, la declaración de Orsi **antecede** al pedido de Iafigliola; no es una respuesta a él. Ese episodio está documentado como declaración en `declaraciones.yaml`, no como veto (porque no lo hubo).

## verificacion_manual

Ninguna. Todas las fuentes citadas en los registros de salida se leyeron con `pnpm fuente` sin errores.

## cobertura_del_periodo

- **Campaña 2024** (previa al mandato): se buscó específicamente si Orsi había hecho declaraciones sobre su disposición a usar o no el veto durante la campaña. No se encontró nada; no hay registros de este período en `declaraciones.yaml`.

- **Gobierno, 2025-03-01 a 2026-09-04** (único mandato, en curso): la afirmación de que no hubo vetos se apoya en haber revisado, una por una, **las 120 leyes promulgadas** durante la Legislatura 50 desde el 1 de marzo de 2025 hasta hoy. El listado se obtuvo del sitio del Parlamento, dos formas independientes que coinciden en el número:
  - Listado con filtro de fechas: https://parlamento.gub.uy/documentosyleyes/leyes-promulgadas?Fechadesde=2025-03-01&Fechahasta=2026-09-04 → "Se encontraron 120 Leyes Promulgadas".
  - Dataset abierto completo (todas las leyes históricas, filtrado por fecha desde 2025-03-01 en esta sesión): https://parlamento.gub.uy/transparencia/datos-abiertos/leyes-promulgadas/csv → 120 filas con fecha ≥ 2025-03-01, la más reciente del 19/8/2026 (Ley 20.518) y la más antigua del 5/3/2025 (Ley 20.399). No hay leyes promulgadas registradas entre el 19/8/2026 y hoy (4/9/2026); no se puede descartar un desfasaje de carga de la fuente de datos abierta para esas dos semanas y media, pero el listado con filtro de fechas del propio sitio (que sí incluye "hasta hoy") confirma el mismo total de 120, así que no parece haber leyes faltantes.
  - De cada una de las 120 se abrió su ficha de trámite (`documentosyleyes/ficha-asunto/<número de asunto>`) y se revisó el texto completo de la sección "Sanciones". **0 de 120 contienen una línea de veto**; las 120 terminan en "Poder Ejecutivo promulga."
  - Además de ese barrido completo, se hizo búsqueda web dirigida (variantes de "vetó/veto/observó/objeciones/promulgación parcial" + "Orsi", más los nombres de las leyes más discutidas del período: Presupuesto 2025-2029, Rendición de Cuentas 2025 y 2026, ley de eutanasia) y revisión de los balances de gestión de Orsi en Wikipedia (ES/EN) y prensa. Ninguna fuente adicional menciona un veto.
  - Sí se encontró una declaración pública de Orsi descartando vetar una ley concreta (eutanasia, octubre 2025), registrada como declaración con evidencia `reportado` de una sola fuente (`_faltante: segunda_fuente`).

- El mandato de Orsi lleva aproximadamente 18 meses de los 5 años del período (2025-2030), así que la cobertura es forzosamente parcial en el tiempo, no en el esfuerzo de búsqueda: no hay antecedente de "resto del mandato" para revisar. Esto es asimétrico frente a un presidente con mandato completo (p. ej. Lacalle Pou, cuyo período de 5 años ya cerró), y esa asimetría es inherente al objeto de la corrida, no una omisión de esta investigación.

- No se investigaron casos judiciales (fuera del alcance de este brief) ni otros temas mencionados en las pistas del corpus (línea de crédito por El Niño, deuda de impuesto de Primaria): se abrieron ambas URLs de las pistas por las reglas del proceso, se confirmó que no contienen contenido sobre vetos, y no se generó ningún registro a partir de ellas por estar fuera del objeto exclusivo de esta corrida ("todos los vetos... y ninguna otra cosa").

## hipotesis

- **Por qué no hay vetos**: una posible explicación es que, al gobernar sin mayoría propia en la Cámara de Representantes desde el inicio del mandato (situación inédita desde 1985, según cobertura de prensa), el Poder Ejecutivo necesita negociar cada proyecto antes de su sanción definitiva (ejemplos: Presupuesto 2025-2029 y Rendición de Cuentas 2026, ambos acordados con Cabildo Abierto), lo que reduce la probabilidad de que llegue a su escritorio un proyecto que decida observar. No se puede probar esta hipótesis con una fuente que la afirme explícitamente respecto del veto: es una inferencia sobre un patrón, no un hecho verificado, así que no se incluye como registro. Queda para que el editor la evalúe si le sirve de contexto.

## objeciones_al_brief

Ninguna. El brief pide cubrir el mandato completo, la campaña y la oposición si aplica, con el mismo criterio para cualquier resultado (incluida la ausencia de vetos), y así se hizo. No se detectó ningún pedido de selección, omisión o encuadre asimétrico por partido, ideología o persona.

## medios_faltantes

Ninguno. Todos los medios citados en los registros de salida (`ambito`) ya figuran en la tabla de medios del brief. Se leyeron además `teledoce` y `caras-y-caretas` (ambos ya en la tabla) para intentar una segunda fuente de otro grupo para la declaración sobre la eutanasia, sin éxito: ninguna de las dos notas contiene la cita textual de Orsi, solo el pedido de Iafigliola.

## casos_vistos

Ninguno. No se investigaron casos judiciales (fuera del alcance de este brief) y no apareció ninguno de forma incidental durante esta búsqueda.
