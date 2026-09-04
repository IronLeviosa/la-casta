# Crítica — corrida 2026-09-04-lacalle-pou-transparencia-corrupcion

Modelo: claude-opus-5 (Opus 5)
Lote: inbox/lacalle-pou/transparencia-corrupcion/2026-09-04/
Registros revisados: 10 (declaraciones 6, promesas 2, menciones 2) + 3 casos de `notas.md`
Notas releídas con `pnpm fuente` en esta sesión: 11

## Objeciones por registro

### declaraciones#0 — 2019-05-06 — "Dijimos que Uruguay estaba haciendo cosas muy feas..."
- severidad: corregir
- tipo: contexto_omitido
- objecion: Tres problemas encadenados. (a) **Fecha equivocada**: la frase no se dijo el 6 de mayo ni en el acto del Prado, sino en un acto anterior en Barros Blancos. La nota lo dice expresamente. `fecha: 2019-05-06` es la fecha de publicación de El Observador. (b) **Referencia mal atribuida**: el `resumen` dice que la cita va "en referencia al caso Ancap y a los negocios con Venezuela". En la nota, la frase está encadenada a la comisión investigadora por los negocios con Venezuela (2016) y al pedido de procesamiento del diputado Daniel Placeres por Envidrio/Fondes. Lo de las gabardinas/Ancap es otro tramo, otro acto y otro día. (c) **Escalada semántica**: el `resumen` afirma que "personas cercanas al poder hicieron negocios irregulares con el Estado". La cita no dice "irregulares" ni "ilegales": dice que el gobierno "les dio la posibilidad de hacer los negocios con sus amigos". Convertir eso en "negocios irregulares" es agregar una imputación de ilicitud contra terceros no identificados que la fuente no hace, y presentarla en voz del sitio ("Afirmó ... que ... hicieron") en vez de como acusación de un adversario en campaña.
- cita_de_contexto: "En un acto realizado el viernes en Barros Blancos, Lacalle Pou se refirió al pedido de procesamiento que enfrenta de Placeres y recordó cuando en 2016 se planteó formar una comisión investigadora en el Parlamento por los negocios de Uruguay con Venezuela, la cual no prosperó por falta de votos." — https://www.elobservador.com.uy/nota/lacalle-pou-y-el-paralelismo-de-las-gabardinas-de-ancap-con-un-gobierno-de-coalicion-20195520206
- accion_sugerida: corregir la fecha al acto de Barros Blancos (viernes 3 de mayo de 2019) o, si no se confirma con otra fuente, dejar la fecha de publicación y decir en el `contexto` que la nota la ubica "el viernes" anterior. Reescribir el `resumen` sin "irregulares" y sin atribuirle el caso Ancap. Buscar segunda fuente del acto de Barros Blancos (El País, Montevideo Portal, Subrayado, La República). `_faltante: segunda_fuente` está bien puesto: única fuente, grupo werthein-hochbaum.

### declaraciones#1 — 2022-09-26 — "Tan sorprendido como ustedes estoy yo."
- severidad: corregir
- tipo: contexto_omitido
- objecion: Cuatro puntos. (a) **Trazabilidad de la cita**: la cita de nivel registro sí es literal (está en El Observador), pero **ninguna de las dos `fuentes[].cita` la contiene**. El validador verifica las citas de fuente contra la página, no la del registro contra sus fuentes; tal como queda, el lector no puede rastrear la frase que titula el registro. (b) **Contexto omitido a favor del político**: en la misma conferencia asumió la responsabilidad de la contratación en términos que el `resumen` no recoge. (c) **Contexto omitido en contra**: en esa misma conferencia dijo que Astesiano "no tiene antecedentes penales" y que su desempeño fue "profesionalmente intachable", y tres días después El Observador informó que Astesiano había sido procesado dos veces por estafa, la segunda con condena en setiembre de 2014, cuando ya trabajaba para Lacalle Pou. Esa es la afirmación chequeable más fuerte del lote y no está registrada. (d) **Etapa legal adelantada**: el `resumen` lo llama "imputado" en un registro fechado 2022-09-26; ese día estaba detenido y declarando ante la fiscal de Flagrancia. La imputación fue el martes 27.
- cita_de_contexto: "El presidente fue consultado sobre la decisión de contratar a Astesiano en el puesto que desempeña y respondió: 'El responsable último soy yo siempre, quién interviene o deja de intervenir (en el proceso de elección) no importa'. 'La responsabilidad es siempre mía', insistió." — https://www.subrayado.com.uy/estoy-tan-sorprendido-como-ustedes-dijo-lacalle-pou-detencion-su-jefe-seguridad-n879914 ; y "Este martes fue imputado por un delito continuado de suposición de estado civil en reiteración real con delito de asociación para delinquir y tráfico de influencias." — https://www.elobservador.com.uy/nota/investigan-si-a-lacalle-pou-le-ocultaron-los-antecedentes-de-astesiano-fa-analiza-acciones-parlamentarias-202292821300
- accion_sugerida: reemplazar la `cita` de la fuente El Observador por el fragmento que contiene la frase («"Tan sorprendido como ustedes estoy yo", dijo el presidente en conferencia»). Agregar al `resumen` que en la misma conferencia asumió la responsabilidad de la contratación. Cambiar "imputado" por "detenido y declarando ante la fiscal de Flagrancia" para el 26/09. Registrar aparte, como declaración y como candidato a chequeo, la afirmación "Astesiano no tiene antecedentes penales" (tiene dos grupos: el-observador + subrayado).

### declaraciones#2 — 2022-09-30 — "Yo no les miento, yo les digo la verdad."
- severidad: corregir
- tipo: un_solo_grupo
- objecion: (a) Única fuente, grupo montevideo-comm; `_faltante` correcto, pero la declaración se hizo en rueda de prensa pública a la salida de un acto en Maldonado, así que casi con seguridad hay video y cobertura de otros grupos. (b) **La misma nota contiene la frase que `notas.md` usa como "después" del segundo candidato a giro** ("no le dieron 'la información correcta'") y esa frase **no está registrada en ningún registro del lote**. Un giro no puede apoyarse en un extremo que no existe como registro. (c) Explicación alternativa que el editor debe considerar: no hay contradicción con el 26/09; ambas declaraciones son compatibles (confiaba en él porque le habían ocultado los antecedentes), y el propio 26/09 ya contenía "Uno siempre está sujeto a equivocaciones".
- cita_de_contexto: "Los hechos revelarían que el presidente fue engañado. Al ser consultado sobre este asunto, respondió que de lo que está seguro es que no le dieron 'la información correcta'." — https://www.montevideo.com.uy/Noticias/Lacalle-sobre-Astesiano--Un-presidente-que-se-equivoca-pueden-tener-pero-que-miente-no--uc834074
- accion_sugerida: buscar segunda fuente del 30/09/2022 (El País, Subrayado, Telenoche, Telemundo, radio). Si el editor quiere sostener el candidato a giro nº2, registrar antes la declaración "no me dieron la información correcta" con su propia evidencia.

### declaraciones#3 — 2023-11-04 — "Pasé a saludar, no llegué a los dos minutos..."
- severidad: corregir
- tipo: contexto_omitido
- objecion: (a) Evidencia bien construida: dos grupos distintos (werthein-hochbaum + montevideo-comm), sin `_faltante`. (b) **Omite el desenlace, que es lo único que habla de la conducta del propio político**: en la misma conferencia contó que cuando Lafluf lo llamó tras la negativa de Ache, él dijo que se presentara todo, y que le escribió a Ache para que le avisara cuando lo hubiera presentado; los documentos se presentaron el lunes siguiente. Con el `resumen` actual, el registro deja al lector en la parte del relato que lo compromete y le saca la que lo descarga. (c) **Discrepancia de fechas que el lote resuelve sin decirlo**: Lacalle Pou ubicó su pedido "a fines de octubre, me parece que el 25 de octubre"; Ache y la captura difundida por Búsqueda lo ubican el 25 de noviembre de 2022. `notas.md` fija 2022-11-25 sin señalar que el propio político dio otra fecha. (d) Error menor: el `resumen` los llama "exsubsecretarios"; al momento de la reunión (nov. 2022) Ache y Maciel eran subsecretarios en ejercicio, y Maciel lo siguió siendo hasta ese mismo 4 de noviembre de 2023.
- cita_de_contexto: "Entonces Roberto Lafluf me llama a mí y yo le dije que, si esa es la decisión, que se presente todo. Al otro lunes, se presentan todos los documentos en el juzgado. Temprano en la mañana [en ese momento], le mando un mensaje a Carolina diciéndole: 'avisame cuando hayas presentado todo'." — https://www.montevideo.com.uy/Noticias/Lacalle-sobre-reunion-en-piso-11-paso-a-saludar-y-Ache-creia-que-debia-presentar-chat-uc870265
- accion_sugerida: ampliar el `resumen` con el desenlace y con el motivo declarado de la convocatoria (había discrepancias internas sobre si entregar chats privados en respuesta a un pedido de acceso a la información del Frente Amplio). Anotar la discrepancia de fecha 25/10 vs. 25/11 sin resolverla.

### declaraciones#4 — 2023-11-04 — "Tengo la íntima convicción que tanto el ministro del Interior..."
- severidad: corregir
- tipo: contexto_omitido
- objecion: (a) **Error de hecho en el `resumen`**: dice "horas antes de anunciar sus renuncias". Fue en la misma conferencia y minutos antes: el vivo de El Observador marca 20:00 para "responsabilidad legal" y 20:07 para la aceptación de las renuncias. (b) Impreciso: Ache no estaba entre quienes renunciaron ese día (renunció en diciembre de 2022) y Bustillo había renunciado el miércoles; los de ese día fueron Heber, Maciel y Lafluf. (c) **Aviso de verificabilidad**: la nota de la diaria está tras muro de pago y `pnpm fuente` solo extrajo el encabezado y un fragmento del final; la cita usada está en la parte visible, pero el registro debería llevar `verificacion: manual` o apoyarse además en Ámbito (grupo-ambito, ya existe en `content/medios/`), que confirma la misma frase. (d) **Discrepancia entre fuentes que hay que registrar, no zanjar**: El Observador transcribe a Ache diciendo que quien pidió borrar fue "Lafluf. Roberto Lafluf"; la diaria escribe "Bustillo y Lafluf le pidieron que borrara chats".
- cita_de_contexto: "20:07 Lacalle Pou aceptó renuncias de Heber, Maciel y Lafluf / 20:05 'No participé de la reunión', asegura Lacalle Pou / 20:00 Gobierno no tiene ninguna 'responsabilidad legal' en otorgamiento del pasaporte a Marset" — https://www.elobservador.com.uy/nota/en-vivo-lacalle-pou-llego-a-uruguay-e-inicia-reuniones-politicas-para-definir-futuro-de-heber-maciel-y-lafluf-202311412518
- accion_sugerida: corregir "horas antes" por "minutos antes, en la misma conferencia"; precisar quiénes renunciaron ese día; agregar Ámbito como tercera fuente o marcar `verificacion: manual` por el paywall de la diaria.

### declaraciones#5 — 2022-12-26 — "Yo estoy en el piso 11 y él en el 4..."
- severidad: bloquea
- tipo: cita_fuera_de_contexto
- objecion: (a) **Cita cortada donde cambia el sentido**. El `resumen` afirma que declaró "que no le dio ninguna indicación a los ministros del Interior sobre qué información debían brindarle". La respuesta completa fue: "No, indicaciones concretas, no. Puedo asumir de que se entendía que si llamaba Astesiano era como si hubiera pedido yo la información." La segunda oración es exactamente la que la fiscal Sabrina Flores usó como evidencia para pedir el sobreseimiento de un exjerarca policial. Cortarla convierte una negativa matizada en una negativa absoluta —en este caso **a favor** del político—, y anula el único elemento con consecuencia procesal de esa respuesta. Esto solo hay que corregirlo, no bloquea. (b) **Lo que bloquea es la fuente única**: es el contenido de una declaración testimonial en sede fiscal, reservada seis meses y filtrada, sostenida por un solo medio y un solo grupo (grupo-infobae). La propia nota indica que otro fragmento fue "consignado por El País" y que el audio lo divulgó el programa Nada que perder de M24: la segunda fuente existe y hay que ir a buscarla. (c) **Ley 18.331 art. 18**: es reproducible porque ya es público y porque declaró en calidad de **testigo**, no como indagado; el `resumen` lo dice bien y esa condición debe repetirse en cualquier ficha de caso donde se use. (d) La nota cierra insinuando un conflicto de interés de la fiscal Fossati (después militante del Partido Nacional). Si el editor usa esta nota, no debe arrastrar esa insinuación como hecho propio.
- cita_de_contexto: "Lacalle Pou: No, indicaciones concretas, no. Puedo asumir de que se entendía que si llamaba Astesiano era como si hubiera pedido yo la información. / Ese comentario del presidente uruguayo fue utilizado por la fiscal Sabrina Flores, que tomó el caso tras la salida de Fossati, como evidencia para pedir el sobreseimiento de la causa de un ex jerarca policial" — https://www.infobae.com/america/america-latina/2023/12/20/divulgaron-el-audio-de-la-declaracion-de-luis-lacalle-pou-en-el-caso-de-su-ex-custodio-condenado-yo-no-lo-veia/
- accion_sugerida: no publicar como `publicado`. Buscar la nota de El País del 19-20/12/2023 y/o el audio del programa de M24; con segunda fuente de otro grupo pasa a `publicado`, sin ella queda en `probable`. En cualquier caso, completar el `resumen` con la matización ("no dio indicaciones concretas, pero asumió que se entendía que si llamaba Astesiano era como si pidiera él la información"). Nota aparte: `notas.md` lista a `infobae` en `medios_faltantes`, pero `content/medios/infobae.yaml` ya existe; lo mismo con `lacallepou-uy`. La lista de medios del brief está desactualizada respecto de `content/medios/`.

### promesas#0 — 2019-04-08 — "Queremos que los ciudadanos nos controlen..."
- severidad: bloquea
- tipo: riesgo_legal
- objecion: El `origen` es impecable (documento oficial del propio candidato, nivel `textual`). El problema está en las evidencias candidatas. (a) **La `evidencia_candidata` del 2022-11-25 con `efecto: en_contra` afirma más de lo que las fuentes respaldan.** Encadena "en una reunión en Torre Ejecutiva convocada a pedido del presidente, el asesor Roberto Lafluf le pidió a ella y al subsecretario Guillermo Maciel que borraran mensajes". Ninguna fuente dice que Lacalle Pou pidiera borrar nada. La propia Ache atribuye el pedido a Lafluf, y relata que, tras consultar al presidente, Lafluf volvió con la instrucción contraria. Poner "a pedido del presidente" y "pidió que borraran" en la misma oración produce una imputación por yuxtaposición: es el registro con mayor exposición a real malicia (art. 336) de todo el lote, y además omite el desenlace exculpatorio que está en las dos fuentes citadas. (b) Además, calificarla `en_contra` de *esta* promesa exige un paso argumental que no está escrito: la promesa es sobre publicar información del Estado y crear canales de denuncia; el episodio es sobre chats privados de dos jerarcas frente a un pedido de acceso a la información de la ley 18.381. El vínculo existe pero hay que explicitarlo. (c) La `evidencia_candidata` del 2025-05-19 con `efecto: a_favor` es débil: publicar las declaraciones juradas del presidente es una obligación de la ley 17.060 que cumple la JUTEP, no una acción discrecional del Poder Ejecutivo. Como mucho `neutral`. (d) **Falta el objeto mismo de la promesa**: no hay ninguna evidencia sobre si se crearon los "canales de comunicación para recibir denuncias" ni sobre la publicación de la información del Estado (transparencia activa, datos abiertos, informes de la UAIP/AGESIC). Sin eso la promesa no puede calificarse en ninguna dirección.
- cita_de_contexto: "Luego de que el asesor le respondiera que debía consultar con el presidente, horas después la llamó y, de acuerdo a la declaración de Ache, le dijo: '¡Presenta todo como está! Lo único que te voy a pedir es que vuelvas a entregar el protocolo.'" — https://www.elobservador.com.uy/nota/chats-sobre-marset-la-version-de-lacalle-sobre-la-reunion-en-torre-ejecutiva-y-lo-que-habia-dicho-ache-2023115151110/amp
- accion_sugerida: reescribir la descripción de la evidencia en_contra en tres tramos verificables y en ese orden — el presidente pidió la reunión; según la declaración de Ache, Lafluf pidió allí borrar los mensajes; tras la negativa de Ache y una consulta al presidente, la instrucción fue presentar todo, y los documentos se presentaron —, o bajarla a `probable`. Cambiar el 2025-05-19 a `neutral`. Buscar evidencia directa del objeto prometido (informes de la UAIP/AGESIC sobre solicitudes 18.381 en 2020-2024; existencia de un canal oficial de denuncias de uso indebido de recursos públicos).

### promesas#1 — 2019-04-08 — "Entendemos como un atributo fundamental de la transparencia el dar debido trámite..."
- severidad: corregir
- tipo: contexto_omitido
- objecion: (a) **La única `evidencia_candidata` no pertenece a esta promesa.** La promesa es sobre dar trámite a las observaciones del Tribunal de Cuentas, a los pedidos de informe parlamentarios y a las solicitudes de la ley 18.381, y sobre el seguimiento a cargo de la Agencia de Monitoreo y Evaluación de Políticas Públicas. La denuncia de la JUTEP de 2026 por declaraciones juradas no toca nada de eso; está adosada por afinidad temática. (b) `tipo: dato_oficial` es incorrecto: la fuente es una nota de Montevideo Portal sobre una denuncia, no un dato oficial. (c) Fuente única, grupo montevideo-comm; el propio Montevideo Portal atribuye la primicia a Info Capital (TV Ciudad) y LR21 publicó la misma noticia, o sea que la segunda fuente de otro grupo existe. (d) **Falta todo lo que la promesa sí exige verificar**, en ambas direcciones.
- cita_de_contexto: "Según informó Info Capital (TV Ciudad), el escrito fue presentado el pasado 7 de junio por el convencional nacional del Partido Colorado Esequiel Ibarra y fue aceptado por el organismo tras la revisión técnica." — https://www.montevideo.com.uy/Noticias/Jutep-evaluara-denuncia-de-convencional-colorado-a-Lacalle-por-sus-declaraciones-juradas-uc964999
- accion_sugerida: sacar la evidencia de la JUTEP de esta promesa y tratarla como caso. Para poder calificar esta promesa hace falta buscar: si se creó la Agencia de Monitoreo y Evaluación de Políticas Públicas y su área de Transparencia e Información (ley de presupuesto 19.924 y LUC 19.889); las memorias anuales del Tribunal de Cuentas 2020-2024 con las observaciones al Poder Ejecutivo y su reiteración; el registro de pedidos de informe parlamentarios respondidos y no respondidos (Parlamento); los informes anuales de la UAIP sobre solicitudes de acceso a la información. Todos son documentos oficiales identificables.

### menciones#0 — 2019-05-06 — mujica — "...muy cercanos al expresidente Mujica y a Tabaré Vázquez"
- severidad: bloquea
- tipo: riesgo_legal
- objecion: La cita **no imputa nada a Mujica**: imputa a personas "muy cercanas" a él. Publicar una mención con `politico_mencionado: mujica` y `sentido: negativo` colgada de esta cita hace que en la ficha de Mujica aparezca una acusación de corrupción que la fuente no le hace a él. A eso se suman: fuente única de un solo grupo, la misma fecha equivocada de declaraciones#0 (la frase se dijo en Barros Blancos, no en el acto del 5/6 de mayo), y que se trata de la acusación de un adversario político en campaña interna sobre una persona hoy fallecida (mayo de 2025) que no puede responder.
- cita_de_contexto: "Dijimos que unos pocos al amparo y al calor del poder estaban haciendo mucho dinero, negocios hechos porque el gobierno les dio la posibilidad de hacer los negocios con sus amigos, muy cercanos al expresidente Mujica y a Tabaré Vázquez" — https://www.elobservador.com.uy/nota/lacalle-pou-y-el-paralelismo-de-las-gabardinas-de-ancap-con-un-gobierno-de-coalicion-20195520206
- accion_sugerida: no publicar así. Si se conserva, el campo `contexto` debe decir literalmente que la acusación recae sobre personas del entorno y no sobre el expresidente, corregir la fecha y sumar segunda fuente de otro grupo; si no, va a `probable` o a `hipotesis/`. Y por Regla 0: si esta acusación cruzada se publica, las corridas sobre Mujica y Vázquez deben registrar con el mismo umbral y el mismo cuidado las acusaciones que ellos hicieron sobre Lacalle Pou o el Partido Nacional.

### menciones#1 — 2019-05-06 — vazquez — "...muy cercanos al expresidente Mujica y a Tabaré Vázquez"
- severidad: bloquea
- tipo: riesgo_legal
- objecion: Idéntica a menciones#0 y con un agravante: a Vázquez la cita lo nombra todavía más de refilón (ni siquiera lo llama expresidente; era presidente en ejercicio en mayo de 2019). Falleció en diciembre de 2020. Mismo problema de fecha, misma fuente única, mismo grupo.
- cita_de_contexto: la misma de menciones#0, misma URL.
- accion_sugerida: la misma que menciones#0. El registro no puede sostener por sí solo que Lacalle Pou acusó a Vázquez; sostiene que acusó a personas cercanas a Vázquez.

## Objeciones al lote

- **Dependencia de un grupo.** El Observador (werthein-hochbaum) aparece en 4 de los 6 registros de declaraciones y es la fuente única de uno. Montevideo Portal (montevideo-comm) en 3, fuente única de dos (una declaración y una evidencia de promesa). 3 de 6 declaraciones y 1 de 3 evidencias candidatas reportadas quedan con `_faltante: segunda_fuente`. Ninguno es irremediable: para el 30/09/2022 hubo rueda de prensa pública, para el 26/12/2022 la propia nota de Infobae indica que El País publicó fragmentos, y para la denuncia de la JUTEP LR21 e Info Capital (TV Ciudad) tienen la misma noticia.
- **Alineamiento: falta el material de los dos extremos, no de uno.** Todas las fuentes del lote son `sin_datos` o `independiente`. No hay ni un solo registro apoyado en El País o Búsqueda (los medios que en este corpus cargan la etiqueta `oficialista_tradicional` o cubren desde la derecha del sistema) ni en Brecha, La República o Caras y Caretas (`progresista`). El resultado no está sesgado hacia un lado, pero está construido sobre una franja estrecha y eso es en sí una fragilidad: la versión que Búsqueda tiene del archivo de la causa Marset, por ejemplo, contiene un dato central que el lote no registra (ver casos, abajo).
- **Wikipedia sosteniendo hitos judiciales.** En `notas.md`, la formalización de Astesiano, su condena, la ramificación Bergara/Carrera/Abdala, sus salidas transitorias, el origen del pasaporte de Marset, la renuncia de Ache y el archivo de la causa Marset están apoyados **solo en Wikipedia**. El propio `content/medios/wikipedia.yaml` dice que "el validador de tiers no la acepta como fuente textual ni oficial" y que se usa "nunca como fuente para calificar declaraciones, giros, promesas o chequeos". Ningún hito judicial puede publicarse con ese respaldo.
- **Simetría interna: el balance está, pero incompleto de los dos lados.** A favor del político hay una promesa con `origen` textual, una evidencia `a_favor`, y registros donde su versión se cita completa (declaraciones#3, #4). En contra hay dos casos y una denuncia. Lo que falta no es "el otro lado" sino los dos: (i) falta el hecho más favorable documentado del período, que la Fiscalía archivó la causa por el pasaporte de Marset en setiembre de 2024 por no hallar conductas punibles, y que Lacalle Pou nunca fue imputado ni indagado en ninguno de los dos casos; y (ii) falta el hecho más desfavorable documentado, que al archivar esa misma causa el fiscal señaló que jerarcas ocultaron información al Senado, y que la investigación por la destrucción del documento protocolizado siguió abierta después. Están los dos en fuentes públicas y ninguno de los dos está en el lote.
- **Falta el candidato a chequeo más claro del lote.** "Astesiano no tiene antecedentes penales" (26/09/2022, con dos grupos de fuentes) contra los dos procesamientos por estafa de 2002 y 2013 y la condena de setiembre de 2014. No hay registro ni de la afirmación ni de su contraste.
- **Cobertura del período.** El tramo 2015-2019 (oposición, Senado) está vacío y el investigador lo dice. El tramo balotaje 2019 y asunción marzo 2020 está vacío. Parlamento (diario de sesiones) no se tocó, pese a que la interpelación de agosto de 2022 a Heber y Bustillo tiene versión taquigráfica disponible y es la fuente primaria de todo el caso Marset. Nada de esto invalida lo registrado, pero el editor no debería presentar el lote como cobertura del período completo.

## Objeciones al brief

- **No hay violación de la Regla 0 en el pedido.** El brief pide período completo, favorable y desfavorable, y pide expresamente registrar lo consistente (`sin_cambio` sirve). El investigador escribió "Ninguna" en `objeciones_al_brief` y en lo sustantivo tiene razón.
- **Sí hay un riesgo de asimetría en la regla 5.6, y se corrige con una frase.** El brief nombra un caso concreto y desfavorable ("documentá el caso Astesiano") y no pide con la misma especificidad documentar los desenlaces favorables (archivo, sobreseimiento, ausencia de imputación). En un brief por político eso no es selección partidaria, pero produce lotes con etapas de acusación mejor documentadas que las de cierre —que es exactamente lo que pasó acá con el archivo de la causa Marset, que quedó en una línea de `notas.md` respaldada por Wikipedia. Versión simétrica que propongo para todos los briefs: *"para cada caso, documentá con el mismo rigor la etapa que abre y la etapa que cierra: si hay archivo, absolución, sobreseimiento o no imputación, es un hito obligatorio con fuente propia"*. Y la contracara: la instrucción "casos judiciales: SÍ" debe aparecer igual en los briefs de Vázquez, Mujica, Batlle y Orsi, y los casos resultantes publicarse con el mismo umbral y la misma compuerta humana.
- **La tabla de medios del brief está desactualizada.** Lista 20 medios; `content/medios/` tiene 23 e incluye `infobae`, `ambito` y `lacallepou-uy`. Por eso el investigador anotó `infobae` y `lacallepou-uy` como `medios_faltantes` cuando ya existen, y no consideró a Ámbito como segundo grupo disponible. Regenerar la tabla del brief desde `content/medios/`.
- **El brief no dice qué hacer con menciones a terceros.** Todo el esquema de `Mención` permite colgar una acusación de corrupción a otro político de una cita donde la acusación recae sobre su entorno. Propongo agregar a las reglas duras: *"una mención solo se registra contra la persona a la que la cita imputa la conducta; si la cita imputa a terceros vinculados a esa persona, eso debe decirse en el campo `contexto`"*.

## Cobertura

```yaml
- medio: el-observador
  url: https://www.elobservador.com.uy/nota/lacalle-pou-y-el-paralelismo-de-las-gabardinas-de-ancap-con-un-gobierno-de-coalicion-20195520206
  fecha: 2019-05-06
  evento: elecciones-2019
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Crónica de acto de campaña que reproduce sus dichos sin evaluarlos ni contrastarlos;
    la única voz valorativa es la del propio precandidato: "esas gabardinas fueron las
    que investigaron, las que llevaron a la Justicia y terminaron procesando a gente que
    actuó irregularmente".

- medio: el-observador
  url: https://www.elobservador.com.uy/nota/en-vivo-lacalle-pou-habla-en-conferencia-de-prensa-tras-detencion-del-jefe-de-custodia-2022926143441
  fecha: 2022-09-26
  evento: caso-astesiano
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Cobertura de conferencia sin adjetivación propia del medio; transcribe tanto lo
    defensivo como lo autoincriminante, incluido que Astesiano tuvo un desempeño
    "profesionalmente intachable" e incluso "un celo en exceso".

- medio: subrayado
  url: https://www.subrayado.com.uy/estoy-tan-sorprendido-como-ustedes-dijo-lacalle-pou-detencion-su-jefe-seguridad-n879914
  fecha: 2022-09-26
  evento: caso-astesiano
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Relato en estilo indirecto sin valoración del medio; incluye la asunción de
    responsabilidad del presidente: "El responsable último soy yo siempre, quién
    interviene o deja de intervenir (en el proceso de elección) no importa".

- medio: el-observador
  url: https://www.elobservador.com.uy/nota/investigan-si-a-lacalle-pou-le-ocultaron-los-antecedentes-de-astesiano-fa-analiza-acciones-parlamentarias-202292821300
  fecha: 2022-09-29
  evento: caso-astesiano
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    El encuadre del título favorece la hipótesis del ocultamiento al presidente, pero el
    cuerpo da espacio equivalente a la crítica opositora sin filtro: "Entraba gente a la
    Torre Ejecutiva para hacer negocios turbios", y consigna el dato adverso de que
    Astesiano "había sido procesado en dos ocasiones por estafa, algo que el mandatario
    aseguró desconocer".

- medio: montevideo-portal
  url: https://www.montevideo.com.uy/Noticias/Lacalle-sobre-Astesiano--Un-presidente-que-se-equivoca-pueden-tener-pero-que-miente-no--uc834074
  fecha: 2022-09-30
  evento: caso-astesiano
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    El cuerpo es descriptivo y reproduce su defensa completa; la única marca valorativa es
    la volanta irónica "Yo no fui" y el condicional del medio "Los hechos revelarían que el
    presidente fue engañado", que no alcanzan para calificarla desfavorable con el mismo
    criterio que se aplica al resto del lote.

- medio: el-observador
  url: https://www.elobservador.com.uy/nota/lacalle-pou-declaro-como-testigo-ante-la-fiscal-fossati-por-el-caso-astesiano-202313143216
  fecha: 2023-01-03
  evento: caso-astesiano
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Informa la declaración sin calificarla y precisa su condición procesal: "declaró como
    testigo ante la fiscal Gabriela Fossati"; incluye además la conclusión exculpatoria de
    la fiscal sobre la exesposa del presidente.

- medio: el-observador
  url: https://www.elobservador.com.uy/nota/en-vivo-lacalle-pou-llego-a-uruguay-e-inicia-reuniones-politicas-para-definir-futuro-de-heber-maciel-y-lafluf-202311412518
  fecha: 2023-11-04
  evento: propuesto:caso-marset
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Vivo con entradas cronológicas y citas literales sin comentario del medio; recoge tanto
    su descargo ("estamos con la conciencia tranquila") como el anuncio opositor de censura.

- medio: la-diaria
  url: https://ladiaria.com.uy/politica/articulo/2023/11/crisis-en-el-gobierno-lacalle-pou-acepto-renuncias-de-heber-maciel-y-lafluf-y-nombro-nuevos-jerarcas/
  fecha: 2023-11-04
  evento: propuesto:caso-marset
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Nota informativa de cambios de gabinete; la parte accesible describe los hechos sin
    adjetivación ("aceptó las renuncias del ministro del Interior... cuatro días después de
    la crisis"). Advertencia: está tras muro de pago y el texto extraído es parcial, por lo
    que el tono se juzga sobre un fragmento.

- medio: ambito
  url: https://www.ambito.com/uruguay/lacalle-pou-confirmo-las-renuncias-heber-maciel-y-lafluf-el-escandalo-marset-n5864578
  fecha: 2023-11-04
  evento: propuesto:caso-marset
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Reproduce el relato del presidente sin contrastarlo ni valorarlo, con subtítulo propio
    "Lacalle Pou destacó la institucionalidad de Uruguay" y su cita "existe la
    institucionalidad como en pocos países del mundo".

- medio: el-observador
  url: https://www.elobservador.com.uy/nota/chats-sobre-marset-la-version-de-lacalle-sobre-la-reunion-en-torre-ejecutiva-y-lo-que-habia-dicho-ache-2023115151110/amp
  fecha: 2023-11-05
  evento: propuesto:caso-marset
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Nota expresamente construida para confrontar las dos versiones y transcribir la
    declaración de Ache sin glosarla: "Uno de los puntos centrales a dilucidar era su
    participación (o no) en la reunión".

- medio: montevideo-portal
  url: https://www.montevideo.com.uy/Noticias/Lacalle-sobre-reunion-en-piso-11-paso-a-saludar-y-Ache-creia-que-debia-presentar-chat-uc870265
  fecha: 2023-11-05
  evento: propuesto:caso-marset
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Publica el relato del presidente íntegro en tres citas largas y luego la versión de
    Ache; la observación crítica del medio está equilibrada hacia ambos lados: "el
    mandatario no ahondó en detalles al respecto de ese encuentro, aunque las preguntas
    tampoco apuntaron de forma directa".

- medio: infobae
  url: https://www.infobae.com/america/america-latina/2023/12/20/divulgaron-el-audio-de-la-declaracion-de-luis-lacalle-pou-en-el-caso-de-su-ex-custodio-condenado-yo-no-lo-veia/
  fecha: 2023-12-20
  evento: caso-astesiano
  politico: lacalle-pou
  tono: desfavorable
  justificacion: >-
    El cuerpo es transcripción fiel, pero la nota cierra con una insinuación de conflicto de
    interés atribuida a nadie: "Tras llevar adelante esta investigación, la fiscal Fossati
    se jubiló de su trabajo en la Fiscalía y pasó a ser una militante activa del Partido
    Nacional, la colectividad del presidente Lacalle Pou, a quien un año antes le tomó
    declaración".

- medio: montevideo-portal
  url: https://www.montevideo.com.uy/Noticias/Jutep-evaluara-denuncia-de-convencional-colorado-a-Lacalle-por-sus-declaraciones-juradas-uc964999
  fecha: 2026-06-12
  evento: propuesto:denuncia-jutep-declaraciones-juradas-2026
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Informa la denuncia y publica en el mismo cuerpo el descargo implícito del denunciante:
    "Ibarra aclaró que la presentación no tiene como fin formular imputaciones ni atribuir
    conductas irregulares", y aclara que el expediente "todavía no comenzó a ser estudiado
    por el directorio".
```

No se emiten registros de cobertura para `https://www.gub.uy/junta-transparencia-etica-publica/...`, `https://lacallepou.uy/programa/mejorar-la-calidad-del-gasto/` ni para los artículos de Wikipedia: no son notas de prensa.

## veredicto_editorial_sugerido

### Candidatos a giro

**Giro 1 — discurso de campaña 2019 vs. casos del propio gobierno.**
- cambio sugerido: `sin_cambio`
- explicacion sugerida: `justificado_por_contexto`
- fundamento: no hay dos declaraciones comparables sobre la misma cuestión. Es una tensión entre programa y gestión, y eso se mide en `promesas`, no en `giros`. El propio investigador lo advierte en `notas.md`. Recomiendo **no crear registro de giro** y tratarlo íntegramente en promesas#0. Si el editor decide publicarlo igual, solo puede ser `sin_cambio`, porque no existe cita de 2019 que él haya contradicho después.

**Giro 2 — 26/09/2022 ("no le entrego lo más preciado a alguien con indicios") vs. 30/09/2022 ("no me dieron la información correcta").**
- cambio sugerido: `sin_cambio`
- explicacion sugerida: `justificado_por_contexto`
- fundamento: las dos afirmaciones son compatibles y él mismo encadena la explicación (confió porque le ocultaron los antecedentes). El 26/09 ya había dicho "Uno siempre está sujeto a equivocaciones" y "La responsabilidad es siempre mía". Además, el "después" no existe como registro en el lote: no se puede publicar un giro cuyo segundo extremo no está registrado con evidencia propia.

**Giro 3 — no detectado por el investigador, y es el único candidato serio.**
- 26/09/2022: "El mandatario aseguró que Astesiano no cuenta con antecedentes penales" (El Observador) / "explicó que Astesiano 'no tiene antecedentes penales'" (Subrayado) — dos grupos.
- 30/09/2022 en adelante: reconoce que no le dieron "la información correcta"; El Observador documenta dos procesamientos por estafa y una condena de setiembre de 2014.
- cambio sugerido: `cambio_parcial`
- explicacion sugerida: `reconocido_explicitamente`
- fundamento: acá sí hay una afirmación de hecho sostenida y luego corregida por el propio autor. Requiere registrar antes las dos declaraciones. Es además el mejor material del lote para el Veracímetro.

### Promesas

**promesas#0 (acceso a la información y canales de denuncia)** — estado sugerido: **no calificar todavía**. No hay una sola evidencia sobre el objeto de la promesa (publicación de información del Estado, canales de denuncia). La evidencia `en_contra` que se propuso no puede publicarse tal como está redactada (ver objeción, severidad `bloquea`) y la `a_favor` es cumplimiento de una obligación legal ajena al Poder Ejecutivo. Si el editor quiere publicar la promesa ya, hacerlo con la promesa y su `origen` textual, sin `estado`, hasta conseguir evidencia directa.

**promesas#1 (contralor, Tribunal de Cuentas, pedidos de informe, ley 18.381)** — estado sugerido: **no calificar todavía**. La única evidencia adjunta no pertenece a la promesa. Documentos que la resolverían, nombrados y no buscados por mí: memorias anuales del Tribunal de Cuentas 2020-2024 (observaciones al Poder Ejecutivo y reiteraciones de gasto), informes anuales de la UAIP sobre solicitudes de acceso a la información de la ley 18.381, registro de pedidos de informe del Parlamento, y la norma de creación de la Agencia de Monitoreo y Evaluación de Políticas Públicas (LUC 19.889 / presupuesto 19.924).

### Casos

**Caso Astesiano**
- involucrado: `lacalle-pou`, rol `bajo_su_mando`. Correcto: nunca fue imputado, indagado ni citado como sospechoso; declaró el 26/12/2022 en calidad de **testigo**.
- última etapa documentada: `condena` (febrero de 2023, contra Astesiano). Las salidas transitorias y la libertad anticipada de 2024 son ejecución de pena, no etapas del enum.
- **etiqueta_legal que corresponde: `condena`.**
- tier sugerido: **`probable`**, no `publicado`.
- qué le falta: (1) fuente admisible para la formalización y para la condena — hoy ambas cuelgan solo de Wikipedia, que el propio `content/medios/wikipedia.yaml` declara inadmisible para calificar; sirven la resolución de Fiscalía o del Poder Judicial, o dos grupos de prensa distintos; (2) el `resumen` debe decir en una oración explícita que Lacalle Pou no fue imputado ni investigado y que declaró como testigo. Sin esa oración, una ficha titulada "Caso Astesiano" con etiqueta `condena` mostrada en el perfil de Lacalle Pou se lee como si el condenado fuera él, y ese es el riesgo de real malicia más grande de todo el lote; (3) la ramificación sobre las "fichas" de Bergara, Carrera y Abdala **no debe entrar** con el respaldo actual (Wikipedia), y si entra debe llevar su propia etapa y fecha; (4) aprobación humana (`pnpm aprobar`), obligatoria para todos los casos.

**Caso Marset**
- involucrado: `lacalle-pou`, rol `bajo_su_mando`. No fue imputado; en el pico de la crisis se informó que la Fiscalía podía citarlo y `notas.md` reconoce que no se verificó si eso ocurrió.
- **La cronología de `notas.md` termina donde no corresponde.** El archivo del 02/09/2024 alcanza solo a la causa por la entrega del pasaporte. Después de ese archivo siguió abierta la investigación por la destrucción del documento protocolizado por Lafluf (Presidencia entregó su investigación administrativa a Fiscalía y en abril de 2025 la Fiscalía seguía pidiendo información a Cancillería). Si la línea de tiempo se cierra en el archivo, el validador derivará `cerrado_sin_condena` y el sitio publicará un cierre que no ocurrió.
- **etiqueta_legal que corresponde: `denuncia`**, si el caso se arma como uno solo con la última etapa `investigacion` (la causa por destrucción de documento). Si el editor prefiere separar en dos casos: "pasaporte de Marset" → última etapa `archivo` → `cerrado_sin_condena`; "destrucción de documento en Presidencia" → última etapa `investigacion` → `denuncia`. Prefiero la separación: es más honesta con ambos lados.
- tier sugerido: **`probable`**.
- qué le falta: (1) leer con `pnpm fuente` la resolución de archivo y su cobertura — Búsqueda (grupo magnolio, hoy ausente del lote) publicó que el mismo fiscal, al archivar, sostuvo que jerarcas "ocultaron información" al Senado, dato que corta en contra y que el lote no tiene, y también que el archivo "abre paso a la investigación sobre la destrucción de un documento en Presidencia", dato que corta a favor y que el lote tampoco tiene; (2) verificar el estado de la causa por destrucción de documento a setiembre de 2026; (3) verificar si la citación de Lacalle Pou por Fiscalía se concretó, que `notas.md` deja abierto; (4) registrar la discrepancia de fecha 25/10 vs. 25/11 de 2022 sobre la reunión, y la discrepancia entre fuentes sobre si el pedido de borrar fue de Lafluf o de Bustillo y Lafluf; (5) aprobación humana.
- Sobre lo que pide el brief distinguir: **probado documentalmente** — que el pasaporte se expidió el 30/11/2021; que hubo interpelación en agosto de 2022; que la reunión existió y que la convocó Lafluf a pedido del presidente (lo admite el propio Lacalle Pou y consta en el chat difundido por Búsqueda); que Ache declaró ante Fiscalía; que los documentos terminaron presentándose en el juzgado; que renunciaron Bustillo, Heber, Maciel y Lafluf; que la causa por el pasaporte se archivó. **Versiones contrapuestas** — si en esa reunión se pidió borrar mensajes (solo lo sostiene Ache; Lafluf no fue oído en el lote y no hay resolución que lo declare probado); quién lo pidió; qué hizo o supo el presidente dentro de la reunión (él dice que pasó menos de dos minutos "según me dicen los participantes"). **Interpretación** — que el pedido de convocar la reunión implique responsabilidad del presidente en el pedido de borrado: eso no lo dice ninguna fuente y no puede publicarse como hecho.

**Denuncia ante la JUTEP por declaraciones juradas (2026)**
- Pasa el umbral acordado: denuncia formal presentada, escrito aceptado tras revisión técnica, denunciante identificable (Esequiel Ibarra, convencional del Partido Colorado). No es un trascendido anónimo.
- última etapa documentada: `denuncia` (2026-06-08, ingreso a la JUTEP).
- **etiqueta_legal que corresponde: `denuncia`.**
- tier sugerido: **`probable`**.
- **Sigue abierta.** Al 2026-09-04 el directorio de la JUTEP no había comenzado a estudiarla; no hay resolución, no hay pronunciamiento, no hay imputación. El material del lote sí la trata como denuncia y no como condena —eso está bien hecho— pero está colgada de una promesa que no le corresponde y con `tipo: dato_oficial`, que es incorrecto.
- qué le falta para pasar a `publicado`: (1) segunda fuente de otro grupo (LR21/la-republica ya publicó la noticia; el origen es Info Capital de TV Ciudad); (2) el estado del expediente a la fecha de publicación, verificado, y el compromiso de actualizarlo; (3) la cita literal del propio denunciante aclarando que "la presentación no tiene como fin formular imputaciones ni atribuir conductas irregulares", en el `resumen` y no solo en las fuentes; (4) intento documentado de obtener el descargo de Lacalle Pou, que el investigador no buscó; (5) aprobación humana.
- Nota de proporcionalidad: es una denuncia administrativa sobre la consistencia de dos vehículos entre declaraciones juradas, presentada por un convencional de un partido de la coalición, aún no estudiada. Publicarla con el mismo peso visual que un caso con condena sería desproporcionado aunque cada dato sea cierto.

### Veracímetro

Afirmaciones chequeables detectadas y documento oficial que las resolvería (nombrados, no buscados por mí):
1. "Astesiano no tiene antecedentes penales" (26/09/2022) → sentencias del Poder Judicial por los procesamientos de 2002 y 2013 y la condena de setiembre de 2014; y el resultado de la investigación administrativa de urgencia que el Ministerio del Interior abrió para determinar por qué esos antecedentes no aparecieron en los informes de 2020 y 2021. Con prensa sola alcanza para `discutible`.
2. Evolución del patrimonio declarado 2020-2025 (las hipótesis de `notas.md` mencionan un crecimiento del 60,9 %) → las declaraciones juradas de bienes e ingresos publicadas por la JUTEP en gub.uy, que ya están en el corpus. Es dataset oficial: permite `verdadero` o `falso`, no solo `discutible`. Hoy no hay registro de chequeo en el lote.
3. "El pasaporte había que darlo aun sabiendo que era Marset" (04/11/2023, Ámbito) → normativa consular vigente en 2021 y el dictamen de archivo del fiscal de Delitos Económicos y Complejos, que se pronunció sobre ese punto.
