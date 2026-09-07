# Crítica — corrida 2026-09-07-lacalle-pou-astesiano-documento

Modelo: Opus 5 (claude-opus-5[1m]), por decisión del mantenedor. Coincide con lo que la tabla de
`CLAUDE.md` asigna al rol de crítico; no hay discrepancia de modelo que reportar en esta corrida.
El lote lo produjo el resolvedor en Sonnet (`claude-sonnet-5`), que también es lo que la tabla dice.

Lote: `inbox/reparaciones/astesiano-documento-2026-09-07/`
Registros revisados: 1 (`chequeos[0]`, copia de `lacalle-pou/2022-09-26-astesiano-antecedentes-penales`)

Fuentes releídas en esta sesión con `pnpm fuente`: el Diario de Sesiones del Senado del 12-10-2022
(373.503 caracteres, leído por tramos: 30.500-39.500, 50.800-55.800, 71.700-88.900, 88.900-100.200,
120.600-124.800, 144.400-149.600), el decreto 382/999 en IMPO, y las nueve notas de prensa que se
listan en `## Cobertura`.

**Resultado en una línea:** el documento previsible apareció y es bueno, pero prueba más de lo que el
lote recogió: en la misma sesión, y sobre el mismo hecho, el Ministerio del Interior confirmó la
condena de 2014, negó el procesamiento de 2002 y sostuvo con norma y número de oficio que Astesiano
«no tiene antecedentes» en sentido jurídico. El lote incorporó solo la mitad que apunta en una
dirección. Así no puede publicarse.

## Objeciones por registro

Hay un solo registro y siete objeciones sobre él. Cada bloque es una objeción, todas sobre
`chequeos[0]`.

### chequeos[0] — 2022-09-26 — «Alejandro Astesiano, jefe de la custodia presidencial, "no tiene antecedentes penales"» — objeción 1 de 7
- severidad: bloquea
- tipo: contexto_omitido
- objecion: El lote cita del Diario de Sesiones únicamente lo que leyó el senador de la oposición
  Alejandro Sánchez. En el mismo documento, dos turnos después, el subsecretario del Interior
  (doctor Maciel) responde exactamente sobre ese punto y dice lo contrario en sentido jurídico, con
  norma, artículo y número de oficio. Nada de eso está en `dato_real.valor` ni en `analisis`.
  Además, con las fuentes nuevas el registro quedó internamente falso en dos frases que el
  resolvedor no tocó porque el brief le prohibía tocarlas: `dato_real.valor` sigue diciendo «No hay
  en el registro sentencia del Poder Judicial ni informe oficial que lo documente» cuando el
  registro ya tiene un `diario_de_sesiones` y un `documento_oficial`, y `analisis` sigue diciendo
  «Por eso queda en "discutible" hasta que se incorpore ese documento» cuando el documento está
  incorporado. Publicar así sería publicar un chequeo cuyo análisis contradice su propia lista de
  fuentes.
- cita_de_contexto: «Concretamente sobre el caso del señor Astesiano, desde el punto de vista
  jurídico y técnico, esta persona no tiene antecedentes. Ello es porque la justicia resolvió en el
  2015 el cierre de su causa por la «extinción del delito» por el cual fue procesado el 17 de marzo
  de 2013 y condenado el 5 de setiembre de 2014 a raíz de la suspensión condicional de la pena
  –artículo 126 del Código Penal–, y así lo comunicó por oficio n.º 3861, de 29 de junio de 2015, a
  la Dirección Nacional de Policía Científica.» — y el cierre de su intervención: «En suma, el señor
  Astesiano, técnica y judicialmente, no tiene antecedentes judiciales penales; sí tuvo una causa
  penal en el 2013, que fue cerrada en el 2015 y que extinguió el delito.»
  (https://infolegislativa.parlamento.gub.uy/temporales/20221012s0032ea321c7f-3f23-4f7c-a4ab-fc5df420cd88.html,
  caracteres 93.325 y 100.010)
- accion_sugerida: Reescribir `dato_real.valor` para que diga las dos cosas que el documento dice, y
  agregar a `dato_real.fuentes` la cita del subsecretario. En concreto, el mismo documento sostiene
  (a) que hubo condena: «Astesiano fue procesado el 17 de marzo de 2013 y recibió un fallo de
  condena el 5 de setiembre de 2014, en el que se le imputó un delito continuado de estafa en
  calidad de primario absoluto a la pena de dieciocho meses de prisión con descuento de la medida
  preventiva sufrida»; y (b) que esa condena se extinguió en 2015 y por eso, en el sentido del
  certificado, no había antecedentes que consignar. Borrar del `valor` y del `analisis` las dos
  frases que ahora son falsas, y actualizar `revision.notas_internas`, que todavía pide «sentencia
  del Poder Judicial de 2014 o resultado de la investigación administrativa» como condición para
  salir de «discutible».

### chequeos[0] — 2022-09-26 — «…no tiene antecedentes penales» — objeción 2 de 7
- severidad: bloquea
- tipo: riesgo_legal
- objecion: `dato_real.valor` afirma como hecho, en voz del sitio, que Astesiano «había sido
  procesado por estafa en 2002 (sin prisión)», y el lote sumó como respaldo la lectura del senador.
  En el mismo Diario de Sesiones el Ministerio del Interior dice que ese procesamiento no existe en
  ningún registro y que la anotación con ese delito y esa fecha corresponde a **otra persona**. Es
  el antecedente penal de una persona nombrada: la ley 18.331 art. 18 pide fuente pública con etapa
  y fecha, y el art. 336 CP castiga afirmar más de lo que la fuente respalda. Hoy el registro no
  tiene ninguna fuente que acredite el procesamiento de 2002 —tiene dos notas de prensa que lo
  dicen, la lectura de un senador que lo dice, y un organismo del Estado que lo niega por escrito en
  el registro oficial—. El chequeo no necesita el dato de 2002 para nada: la condena de 2014 es la
  que decide.
- cita_de_contexto: «Tal presunta causa y procesamiento no figura ni hay registro de ella en el
  Sistema de Gestión de Seguridad Pública ni en los registros de antecedentes que lleva la Dirección
  Nacional de Policía Científica. De la búsqueda realizada sí surge exactamente el mismo delito y en
  la misma fecha, imputado por el Juzgado Letrado de la Costa de 1.er Turno, pero que corresponde a
  otra persona que no es el señor Astesiano.»
  (https://infolegislativa.parlamento.gub.uy/temporales/20221012s0032ea321c7f-3f23-4f7c-a4ab-fc5df420cd88.html,
  carácter 97.100)
- accion_sugerida: Sacar el procesamiento de 2002 de la voz del sitio en `dato_real.valor`. O se
  atribuye («la prensa informó y el senador Sánchez leyó en sala un procesamiento de 2002 que el
  Ministerio del Interior negó en la misma sesión»), o se omite. Y sacar de `dato_real.fuentes` la
  segunda entrada del Diario de Sesiones —la que cita solo la línea de 2002— o dejarla únicamente si
  la acompaña la cita de la negativa del Ministerio: tal como está, presenta como respaldo oficial
  de un hecho un documento que en su otra mitad lo desmiente.

### chequeos[0] — 2022-09-26 — «…no tiene antecedentes penales» — objeción 3 de 7
- severidad: corregir
- tipo: cita_fuera_de_contexto
- objecion: Las dos citas nuevas del Diario de Sesiones son literales y contiguas —las verifiqué
  carácter por carácter contra el documento— pero el registro no dice de quién son. El lector que
  vea «Diario de Sesiones del Senado» en `dato_real.fuentes` va a leerlo como una constatación
  oficial del Parlamento, y es la lectura de un legajo que hizo el senador convocante de la
  oposición en su intervención. Lo que convierte esa lectura en algo utilizable no es que esté en el
  diario de sesiones, sino que el Ministerio del Interior la confirmó en la misma sesión en la parte
  que importa —y esa confirmación no está citada—. Hay además una diferencia de fecha dentro del
  propio documento que el registro no puede ignorar si va a dar el día: el senador dice «El 18 de
  marzo de 2013 fue procesado» y el subsecretario dice «procesado el 17 de marzo de 2013».
- cita_de_contexto: «SEÑORA PRESIDENTA.- Tiene la palabra el subsecretario del Interior, doctor
  Maciel.» / «Astesiano fue procesado el 17 de marzo de 2013 y recibió un fallo de condena el 5 de
  setiembre de 2014…»
  (https://infolegislativa.parlamento.gub.uy/temporales/20221012s0032ea321c7f-3f23-4f7c-a4ab-fc5df420cd88.html,
  caracteres 88.430 y 93.930)
- accion_sugerida: Atribuir en `dato_real.valor` quién dijo cada cosa (senador Sánchez / subsecretario
  Maciel), y no dar el día del procesamiento de 2013 como dato firme: el mes y el año están
  confirmados por las dos partes, el día no. La condena sí tiene fecha concordante entre el
  subsecretario («5 de setiembre de 2014») y el senador («setiembre de 2014»), y monto concordante
  (dieciocho meses).

### chequeos[0] — 2022-09-26 — «…no tiene antecedentes penales» — objeción 4 de 7
- severidad: corregir
- tipo: documento_previsible
- objecion: La parte de la regla que motivó esta corrida quedó saldada: el documento previsible era
  la versión taquigráfica de la comparecencia y apareció, con el prontuario leído en sala y con la
  respuesta del Ministerio. El chequeo ya no está en «discutible» por falta de documento. Pero el
  documento nuevo introdujo un argumento jurídico —extinción del delito por suspensión condicional
  de la pena, artículo 126 del Código Penal— que el registro va a tener que exponer en el
  `analisis`, y hoy no hay ninguna fuente en el registro que respalde ese instituto: el decreto
  382/999, que sí está citado, define qué se consigna en el certificado (art. 3: «las resoluciones y
  sentencias judiciales que hubieren recaído sobre el individuo»; art. 4: prohíbe consignar hechos
  sin condena) pero **no dice nada sobre extinción ni sobre caducidad del antecedente**; lo leí
  entero y su única regla de caducidad es la del art. 7, que vence el certificado a los tres meses
  de expedido. Ese es un documento previsible y barato: el Código Penal, título VIII capítulo I
  («extinción del delito») y artículo 126 («suspensión condicional de la pena»), publicado en
  impo.com.uy, el mismo organismo del que ya se citó el decreto.
  Lo que **no** es previsible, y conviene que quede escrito para que nadie lo pida de nuevo: la
  sentencia de primera instancia del 5-09-2014 (juzgado del interior, proceso pre-CPP; el Poder
  Judicial no publica ese estrato) y el oficio n.º 3861 del 29-06-2015 (comunicación entre juzgado y
  Policía Científica, reservada; Montevideo Portal publicó una foto de la resolución, no el
  organismo). Pedirlos sería pedir un documento que el Estado no publica.
- cita_de_contexto: «Artículo 7 El Certificado de Antecedentes Judiciales caducará a los tres meses
  de ser expedido.» (https://www.impo.com.uy/bases/decretos/382-1999) — es la única caducidad que el
  decreto contiene, y es la del papel, no la del hecho.
- accion_sugerida: Agregar a `dato_real.fuentes` el Código Penal art. 126 y el título VIII cap. I
  desde impo.com.uy, leídos con `pnpm fuente`, antes de que el `analisis` afirme qué es «extinción
  del delito». Sin eso, el análisis estaría explicando el instituto en voz propia con la sola
  paráfrasis de un jerarca interesado.

### chequeos[0] — 2022-09-26 — «…no tiene antecedentes penales» — objeción 5 de 7
- severidad: aviso
- tipo: explicacion_alternativa
- objecion: El brief pedía que el análisis dijera las dos cosas. Dejo las lecturas inocentes escritas,
  con su cita, para que el editor no tenga que reconstruirlas, y con la objeción a cada una.
  1. **Le informaron eso.** El ministro afirmó en la sesión que al presidente se le informó dos
     veces que no tenía antecedentes. Objeción a esta lectura: es el Ministerio explicando su propio
     error, y no exime a la afirmación de ser verificable —el Veracímetro chequea el dato, no la
     buena fe—; el registro ya aclara que no afirma que el presidente supiera.
  2. **«Primario legal»: en sentido jurídico no tenía antecedentes.** Es la tesis del subsecretario,
     y no es solo del Gobierno: según el mismo documento, la fiscal del caso lo dijo públicamente.
     Objeción: la distinción «primario absoluto / primario legal» es interna al derecho penal y no
     es lo que un hablante entiende por «no tiene antecedentes penales»; además el propio Ministerio
     admite que la ficha policial fue adulterada en 2015 para que la causa no apareciera, lo que
     hace que la afirmación fuera cierta en el papel por una razón que el Estado califica de
     adulteración.
  3. **El certificado habría dicho «sin antecedentes».** También del subsecretario, y es la lectura
     más fuerte porque es contrastable contra el decreto 382/999. Objeción: el art. 3 manda
     consignar «las resoluciones y sentencias judiciales que hubieren recaído sobre el individuo», y
     una sentencia de condena de 2014 recayó; lo que la saca del certificado no es el decreto sino
     la extinción posterior, que hay que documentar aparte (objeción 4).
- cita_de_contexto: «se le informó por dos veces consecutivas al presidente que tenía anotaciones y
  que no tenía antecedentes» (carácter 143.900) / «La propia fiscal penal de flagrancia de 12.°
  turno de Montevideo, que lleva adelante la investigación, ha declarado públicamente en diferentes
  medios que el imputado es justamente un «primario legal»» (carácter 96.700) / «alguien desasoció
  del sistema de base de datos la cédula del señor Astesiano para que al hacerse la consulta en la
  sección destinada a antecedentes policiales no figurara la causa penal, más allá de que estuviera
  extinguida. Esto implica una adulteración informática para que no apareciera el antecedente
  mencionado.» (carácter 98.400) — todas en
  https://infolegislativa.parlamento.gub.uy/temporales/20221012s0032ea321c7f-3f23-4f7c-a4ab-fc5df420cd88.html
- accion_sugerida: Que el `analisis` resuelva en la primera oración y después dé las dos lecturas con
  su fuente. Si el editor califica «falso», el análisis tiene que decir por qué la lectura jurídica
  no lo salva; si califica «discutible», tiene que decir que ahora es discutible **por el fondo** —dos
  lecturas documentadas de qué es un antecedente— y no por falta de papel, que es lo que decía
  antes. La peor salida es dejar «discutible» con el análisis viejo: el lector no distingue una
  duda sustantiva de un trámite pendiente.

### chequeos[0] — 2022-09-26 — «…no tiene antecedentes penales» — objeción 6 de 7
- severidad: aviso
- tipo: contexto_omitido
- objecion: El hecho chequeado es una conferencia de prensa del presidente en Torre Ejecutiva, y las
  dos fuentes de `evidencia` son crónicas. La frase exacta descansa en una sola de ellas: Subrayado
  la entrecomilla, El Observador la parafrasea («El mandatario aseguró que Astesiano no cuenta con
  antecedentes penales»). Además, la `cita` del registro de declaraciones asociado une dos
  respuestas que, según la crónica de El Observador, fueron a preguntas distintas: la de los
  antecedentes y la de «todo el mundo es inocente…», que El Observador presenta como respuesta a la
  pregunta por el futuro laboral del custodio.
- cita_de_contexto: «Consultado sobre el futuro laboral de su custodio, Lacalle expresó: "Todo el
  mundo es inocente hasta que se demuestre lo contrario. Los elementos que tengo son que hubo una
  orden de detención…"»
  (https://www.elobservador.com.uy/nota/en-vivo-lacalle-pou-habla-en-conferencia-de-prensa-tras-detencion-del-jefe-de-custodia-2022926143441)
- accion_sugerida: Buscar la versión de Presidencia o el video de la conferencia del 26-09-2022
  (`medios.presidencia.gub.uy`, `archivo.presidencia.gub.uy`, canal de Presidencia en YouTube). Con
  eso `evidencia.nivel` sube de `reportado` a `textual`, queda la frase textual con marca de tiempo y
  se resuelve de paso si las dos frases fueron una o dos respuestas. No es bloqueante para este
  chequeo, pero es el mismo tipo de documento previsible que motivó esta corrida, aplicado al otro
  extremo del registro.

### chequeos[0] — 2022-09-26 — «…no tiene antecedentes penales» — objeción 7 de 7
- severidad: aviso
- tipo: asimetria
- objecion: Dos cosas, una del registro y una del uso que se le puede dar. (a) El `titulo` actual
  —«la prensa documentó dos procesamientos y una condena»— quedó desactualizado en las dos mitades:
  ya no es solo la prensa, y «dos procesamientos» incluye el de 2002 que el Ministerio niega.
  (b) En la misma sesión el ministro leyó una lista de custodios de gobiernos anteriores con
  antecedentes judiciales, nombre por nombre. Es material tentador para «equilibrar» el registro y
  no debe usarse: son personas privadas, no figuras con cargo electivo o de gobierno, y el registro
  oficial no trae para casi ninguna la etapa ni la fecha que exige la ley 18.331 art. 18. La
  simetría correcta no es publicar los prontuarios de terceros, es aplicar el mismo umbral a
  afirmaciones equivalentes de otros presidentes.
- cita_de_contexto: «El señor Fabra tiene antecedentes judiciales del año 2000.»
  (https://infolegislativa.parlamento.gub.uy/temporales/20221012s0032ea321c7f-3f23-4f7c-a4ab-fc5df420cd88.html,
  carácter 144.717) — un apellido y un año, sin delito, sin etapa y sin causa: no alcanza para nada
  publicable.
- accion_sugerida: Reescribir el `titulo` con lo que el documento sostiene. No abrir registros sobre
  los custodios nombrados. Si se quiere simetría de verdad, la búsqueda equivalente es: afirmaciones
  verificables de Vázquez, Mujica, Batlle u Orsi sobre antecedentes o idoneidad de personas que
  designaron, con el mismo umbral de documento.

## Objeciones al lote

- **Dependencia de un solo grupo:** no aplica en el sentido habitual. `dato_real` tiene ahora dos
  fuentes del Estado uruguayo (parlamento, impo) y dos de prensa de grupos distintos
  (werthein-hochbaum, montevideo-comm), y la regla de dos grupos rige para `evidencia.nivel:
  reportado`, no para `dato_real`. `evidencia` sigue con subrayado (fontaina-de-feo) y el-observador
  (werthein-hochbaum): dos grupos, correcto.
- **El aviso de alineamiento del validador es vacuo hoy.** `pnpm validar --inbox` devuelve un solo
  aviso para este lote: «Todas las fuentes comparten alineamiento "sin_datos"». Revisé los 41
  archivos de `content/medios/`: **ninguno** tiene `alineamiento` cargado. El chequeo existe pero no
  puede detectar nada hasta que se pueble ese campo; conviene no leerlo como señal.
- **La nota técnica del resolvedor sobre el esquema quedó obsoleta.** `notas.md` sección 1 avisa que
  `src/schemas/chequeo.ts` y `src/lib/probable.ts` exigen literalmente `documento_oficial` y que un
  `diario_de_sesiones` no habilita verde ni rojo. Era cierto cuando corrió; el commit `0f913e9`
  cambió las dos puertas para aceptar `documento_oficial` **o** `diario_de_sesiones`. El editor no
  tiene que hacer nada con ese aviso; lo señalo para que no se tome una decisión editorial sobre una
  restricción que ya no existe.
- **Dos fuentes con la misma URL en `dato_real.fuentes`.** Las dos entradas del Diario de Sesiones
  apuntan al mismo documento con citas de tramos separados por ~1.800 caracteres (no se pueden
  fusionar en una cita contigua). El validador no se queja. Si se conserva la de 2002, tiene que ir
  con la negativa del Ministerio al lado (objeción 2).
- **Cobertura del período:** el lote es una reparación de un registro puntual, no un barrido, así que
  no corresponde exigirle años faltantes. Sí corresponde señalar que el caso Astesiano tiene en
  `content/` una sola declaración chequeada de 2022 y una de diciembre de 2022, y que el desenlace
  documentado (condena de Astesiano en proceso abreviado, 15-02-2023, cuatro años y seis meses) no
  aparece en el chequeo aunque el resolvedor leyó la nota. No es objeción al chequeo —es de otro
  hecho— pero es el tipo de contexto que un lector espera y que el sitio se obliga a buscar con el
  mismo rigor que la acusación.
- **Discrepancias:** escribí `discrepancias.yaml` en esta misma carpeta (no en `inbox/`, que no
  toco) con dos entradas, contra dos medios de grupos distintos, ambas contra el mismo diario de
  sesiones. Ahí dejo escrito el umbral que apliqué y los dos hallazgos que **descarté** para que se
  pueda auditar que el umbral fue el mismo para todos.

## Objeciones al brief

- **Regla 0 — el brief está bien en el enunciado y sesgado en el diseño de búsqueda.** El encabezado
  es simétrico y explícito («el mismo pedido vale para cualquier chequeo de cualquier político»), y
  la instrucción de no tocar `calificacion` ni `analisis` es correcta. El problema está en el punto
  1 y en el punto de entrega: el brief define de antemano cuál es el resultado esperado («Un lector
  preguntó por qué no es "falso". La respuesta correcta es encontrar el documento») y ordena la
  búsqueda en cuatro lugares que solo pueden confirmar que había antecedentes (versión taquigráfica,
  sentencia condenatoria, investigación administrativa sobre por qué no figuraban, legajo pedido por
  Presidencia). Ninguno de los cuatro es donde vive el documento que apunta en la otra dirección: la
  resolución de extinción del delito, el artículo 126 del Código Penal y el oficio de 2015. Y la
  entrega pide «cita literal del renglón que dice **qué antecedentes tenía**», no «qué dice el
  documento sobre sus antecedentes».
  El efecto es medible en el lote: el resolvedor encontró el material exculpatorio —lo tiene en
  `notas.md` sección 3 y lo marca como «no incorporado»— y no lo subió al registro, porque el brief
  no se lo pedía. La mitad del documento que servía entró; la otra mitad quedó en un archivo que no
  se publica.
- **Versión simétrica de ese punto:** «Buscá el documento que decide, en las dos direcciones. Si el
  documento habilita más de una lectura del término chequeado, traé la cita de cada lectura y el
  análisis las dice las dos. Si el hallazgo hace que la afirmación resulte cierta bajo alguna
  lectura documentada, eso entra al registro con la misma prioridad que lo que la hace falsa.» Ese
  párrafo, tal cual, sirve para cualquier chequeo de cualquier político y es lo que le faltaba a
  este brief.
- **Un acierto del brief que conviene conservar:** el punto que pide definir «antecedentes penales»
  con fuente normativa antes de calificar. Es lo que evitó que este lote se cerrara con un «falso»
  automático, y es lo que hizo aparecer el decreto 382/999. La corrección propuesta arriba no lo
  reemplaza, lo completa.
- **Pista equivocada, ya resuelta:** el brief sugería el decreto-ley 14.470 como norma de registro de
  antecedentes. El resolvedor verificó que es el régimen de trabajo penitenciario y lo dejó escrito.
  Conviene que la próxima versión del brief cite el decreto 382/999 y el Código Penal.

## Cobertura

```yaml
- medio: subrayado
  url: https://www.subrayado.com.uy/estoy-tan-sorprendido-como-ustedes-dijo-lacalle-pou-detencion-su-jefe-seguridad-n879914
  fecha: 2022-09-26
  evento: caso-astesiano
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    La nota es casi íntegramente reproducción de lo que dijo el presidente, sin adjetivación propia:
    Además, explicó que Astesiano "no tiene antecedentes penales" y que "todo el mundo es
    inocente hasta que se demuestre lo contrario".

- medio: el-observador
  url: https://www.elobservador.com.uy/nota/en-vivo-lacalle-pou-habla-en-conferencia-de-prensa-tras-detencion-del-jefe-de-custodia-2022926143441
  fecha: 2022-09-26
  evento: caso-astesiano
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Cobertura en vivo de la conferencia, con las respuestas transcritas y sin valoración del medio:
    "El mandatario aseguró que Astesiano no cuenta con antecedentes penales."

- medio: montevideo-portal
  url: https://www.montevideo.com.uy/Noticias/Astesiano-estuvo-cuatro-meses-preso-en-2013-por-un-delito-continuado-de-estafa-uc833884
  fecha: 2022-09-28
  evento: caso-astesiano
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Nota breve de dato, con la fuente identificada y sin juicio sobre el presidente, que aparece solo
    como referencia: "estuvo preso en el 2013 por un delito continuado de estafa, según informó La
    Diaria y confirmó Montevideo Portal con el Ministerio del Interior."

- medio: la-diaria
  url: https://ladiaria.com.uy/justicia/articulo/2022/9/ministerio-del-interior-plantea-que-sorpresivamente-en-la-ficha-de-astesiano-consta-un-antecedente-penal-de-2013/
  fecha: 2022-09-28
  evento: caso-astesiano
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Solo pude leer la bajada y el arranque (el resto está tras registro), y lo legible atribuye todo
    al Ministerio sin calificar al presidente: "Luis Alberto Heber dispuso una investigación de
    urgencia para establecer “quién o quiénes alteraron la información”; en la ficha no figura como
    antecedente penal que fue procesado sin prisión en 2002."

- medio: el-observador
  url: https://www.elobservador.com.uy/nota/investigan-si-a-lacalle-pou-le-ocultaron-los-antecedentes-de-astesiano-fa-analiza-acciones-parlamentarias-202292821300
  fecha: 2022-09-29
  evento: caso-astesiano
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Describe el golpe político y recoge las dos reacciones dentro de la coalición sin tomar partido:
    "Entre los socios del gobierno se mezclaron posiciones críticas con Lacalle Pou con otras que
    destacaron la fortaleza institucional de investigar a un funcionario tan importante y la
    transparencia del presidente para presentar el caso."

- medio: el-observador
  url: https://www.elobservador.com.uy/nota/investigacion-de-interior-no-pudo-determinar-quien-borro-antecedente-de-astesiano-2022930182151
  fecha: 2022-09-30
  evento: caso-astesiano
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Reporta el informe administrativo citándolo y sin conclusión propia sobre responsabilidades:
    "“A través de la auditoría realizada por esta unidad, no ha sido posible establecer qué usuario
    pudo desasociar el número de cédula de identidad”, señala el informe al que accedió El
    Observador."

- medio: montevideo-portal
  url: https://www.montevideo.com.uy/Noticias/El-oficio-de-la-Justicia-con-el-que-Interior-argumenta-que-Astesiano-no-posee-antecedentes-uc834675
  fecha: 2022-10-08
  evento: caso-astesiano
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Es la nota que mejor explica el argumento del Gobierno ("La respuesta se encuentra en un oficio
    que libró el Juzgado Letrado de Primera Instancia en 2015") y a la vez marca la contradicción
    interna del Ministerio ("Heber ha dejado entrever en más de una ocasión que el excustodio posee
    antecedentes, algo que dentro del ministerio no comparten"); la frase más benigna para el
    presidente ("Esta explicación, junto con la confianza que el mandatario tenía en Astesiano, lo
    impulsó a no sospechar") está atribuida a fuentes de Presidencia, no puesta en voz del medio.

- medio: la-republica
  url: https://www.lr21.com.uy/politica/1464915-luis-alberto-heber-parlamento-rodrigo-caso-astesiano-interpelacion-comparecencia
  fecha: 2022-10-12
  evento: caso-astesiano
  politico: lacalle-pou
  tono: desfavorable
  justificacion: >-
    El medio no se limita a informar la comparecencia: le atribuye una intención al ministro y la
    refuta en voz propia. "Así, Heber largó frente a la Cámara Alta un glosario de nombres que traía
    entre sus apuntes, con el fin de deslizar que el caso de Astesiano es uno más. Sin embargo, lo
    que diferencia toda la trama del excustodio de Lacalle Pou es que estuvo operando su
    organización criminal en la mismísima sede del gobierno nacional." (Aviso para el editor: la URL
    es de lr21.com.uy y ese dominio no figura en content/medios/la-republica.yaml, aunque el archivo
    lista "lr21" y "LaRed21" entre sus alias; por eso `pnpm fuente` etiquetó el medio como
    "lr21.com.uy". Hay que agregar el dominio al archivo del medio —o crear el medio— antes de que
    este registro y la discrepancia asociada validen.)

- medio: subrayado
  url: https://www.subrayado.com.uy/alejandro-astesiano-recibio-condena-4-anos-y-6-meses-acuerdo-fiscal-fossati-n907579
  fecha: 2023-02-15
  evento: caso-astesiano
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Relato procesal del desenlace, sin valoración sobre el presidente, que aparece solo como
    referencia del cargo del condenado: "El ex jefe de la custodia presidencial Alejandro Astesiano
    fue condenado a cuatro años y seis meses de prisión por su participación en la organización
    delictiva que falsificaba documentos".
```

Nueve notas de prensa leídas, nueve registros de tono: ocho `neutral` y uno `desfavorable`. Ninguna
nota del lote reúne el requisito para `favorable` (una frase del cuerpo, en voz del medio, que trate
bien al político); la candidata más cercana —Montevideo Portal del 08-10— pone esa frase en boca de
fuentes de Presidencia, y por eso quedó `neutral`. El Diario de Sesiones y el decreto 382/999 no
llevan registro de tono: no son notas de prensa.
