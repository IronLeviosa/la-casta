# Crítica — corrida 2026-09-04-orsi-economia-impuestos

Modelo: Sonnet 5 (Claude Code / Agent SDK). Nota: `CLAUDE.md` asigna Opus al rol de Crítico; corrí con el modelo con el que efectivamente se me invocó en esta sesión, sin poder elegirlo. Lo dejo constando para que el editor decida si repetir la corrida con Opus.
Lote: inbox/orsi/economia/impuestos/2026-09-04/
Registros revisados: 18 (declaraciones 16, promesa 1 con 6 evidencias candidatas, mención 1)
Fuentes releídas: 17 notas (15 citadas en el lote + 2 leídas por el investigador y no citadas: la nota de El Observador del 17/11/2024 sobre el debate y la de Infobae del 07/07/2026 sobre el impuesto de Primaria)

Severidades: 0 bloquea · 18 corregir · 6 aviso (de los cuales 3 con tipo `sin_objecion`: declaraciones[8], declaraciones[10] y menciones[0])

Nota de método: no verifiqué literalidad de citas (ya lo hizo `pnpm validar --red`). Releí el texto de cada fuente citada con `pnpm fuente <url> --buscar "..."`, agrupando todas las frases de una misma nota en una sola llamada, con ventana suficiente para cubrir la nota completa o el fragmento relevante. También hice cuatro búsquedas web puntuales para localizar posibles segundas fuentes o documentos primarios (video del debate, decreto de la BPC), sin agregar registros: quedan como `accion_sugerida`.

---

## Objeciones por registro

### declaraciones[0] — 2023-12-14 — "Nadie hace campaña diciendo si sube o baja impuestos..."
- severidad: corregir
- tipo: un_solo_grupo
- objecion: Fuente única (el-observador, grupo werthein-hochbaum), como marcó el validador con `_faltante`. Además, la cita es una nota **retrospectiva** publicada casi un año después del hecho (19/11/2024), que reconstruye una entrevista de Telemundo (Canal 12) sin enlazar el video ni citar más contexto de esa entrevista que esta frase suelta. No es un error, pero el registro descansa en la paráfrasis periodística de un dicho televisivo, no en el dicho mismo.
- cita_de_contexto: "14 de diciembre de 2023: 'Nadie hace campaña diciendo si sube o baja impuestos. Es un error, lo dicen los analistas', dice Yamandú Orsi en Telemundo." — https://www.elobservador.com.uy/nacional/impuestos-el-tamque-que-orsi-quiso-laudar-el-debate-pero-que-tiene-interpretaciones-distintas-el-frente-amplio-n5970751
- accion_sugerida: buscar el video de esa aparición en Telemundo (archivo de Teledoce/Canal 12 o YouTube) para subir a `nivel: textual` con `marca_tiempo`, o una segunda cobertura de otro grupo de esa misma entrevista (Búsqueda, la diaria, 180, Subrayado). El investigador ya documentó en `notas.md` que buscó y no encontró segunda fuente para este tramo de campaña; si no aparece, el registro queda razonablemente en `probable`.

### declaraciones[1] — 2023-12-14 — "Ni descarto ni la afirmo. Pero es lo que no deseo..."
- severidad: corregir
- tipo: un_solo_grupo
- objecion: Mismo problema de fuente única que declaraciones[0] (misma nota). Vale además una explicación alternativa para el candidato a giro 1 del `notas.md`: esta frase, de la misma fecha que "es un error", muestra que la posición original de Orsi en diciembre de 2023 **no era una negación categórica** de subir impuestos ("ni la descarto"), sino una postura deliberadamente ambigua. Eso matiza la lectura de "giro": lo que cambia entre diciembre de 2023 y noviembre de 2024 no es solo el contenido (de ambigüedad a promesa categórica) sino también el registro retórico (de evitar comprometerse a comprometerse sin condiciones), y ese es justamente el tipo de explicación alternativa que hay que dejar escrita aunque no convenza del todo.
- cita_de_contexto: "Cuando le consultan si puede asegurar un no incremento de los tributos, contesta: 'Ni descarto ni la afirmo. Pero es lo que no deseo. Tiene que ser la última de las medidas'." — misma URL que declaraciones[0]
- accion_sugerida: igual que declaraciones[0]. Para el editor: si arma el giro 1, cite este registro como el punto de partida real (ambigüedad), no "Nadie hace campaña..." (que es una tesis sobre la campaña de otros, no una posición propia sobre impuestos).

### declaraciones[2] — 2024-03-07 — "con liviandad y hasta con frivolidad se dice 'no voy a aumentar impuestos...'"
- severidad: corregir
- tipo: un_solo_grupo
- objecion: Fuente única (el-observador, artículo "impuestos-y-edad-jubilatoria..."), `_faltante` correcto. Contexto que el resumen no recoge y que sí trae la propia nota: "Durante la campaña, Orsi había compartido esta opinión y **había criticado al candidato oficialista Álvaro Delgado** por prometer no subir los impuestos." Es decir, la crítica de marzo de 2024 tenía un blanco específico (la promesa de Delgado), no era una tesis general contra cualquier promitente, incluido él mismo. Esto es una explicación alternativa legítima para el giro 1: Orsi no dijo "yo nunca prometeré esto"; dijo que prometerlo así, como táctica de campaña ajena, era liviano.
- cita_de_contexto: "Durante la campaña, Orsi había compartido esta opinión y había criticado al candidato oficialista Álvaro Delgado por prometer no subir los impuestos. En un comité de base en Trouville, el 7 de marzo de 2024, Orsi había dicho que 'con liviandad y hasta con frivolidad se dice...'" — https://www.elobservador.com.uy/nacional/impuestos-y-edad-jubilatoria-los-diferencias-gabriel-oddone-que-yamandu-orsi-tuvo-que-aclarar-n5972872
- accion_sugerida: incorporar al `resumen` que la crítica apuntaba a la promesa de Delgado. Buscar segunda fuente (comité de base de baja cobertura; poco probable, pero intentar Frente Amplio en redes/streaming del acto, que sería fuente primaria).

### declaraciones[3] — 2024-03-07 — "Obviamente que se hace para conseguir votos"
- severidad: corregir
- tipo: un_solo_grupo + asimetria
- objecion: Es la **misma frase del mismo acto** que declaraciones[2] (comité de base de Trouville, 7 de marzo de 2024), tomada de la otra nota de El Observador ("impuestos-el-tamque..."). Fragmentar un mismo discurso en dos registros de `declaracion` separados, aunque cada frase tenga su propia cita literal, infla artificialmente el conteo de apariciones de 2024 y separa dos oraciones que en la fuente van una a continuación de la otra, en el mismo turno de palabra: "...se dice 'no voy a aumentar impuestos, no voy a subir la edad de jubilación'. 'Obviamente que se hace para conseguir votos', cuestiona en el comité Trouville y llama a la ciudadanía a 'cobrar ese tipo de actitudes...'".
- cita_de_contexto: "'Obviamente que se hace para conseguir votos', cuestiona en el comité Trouville y llama a la ciudadanía a 'cobrar ese tipo de actitudes que andan ahí en el tema de la falta ética'." — https://www.elobservador.com.uy/nacional/impuestos-el-tamque-que-orsi-quiso-laudar-el-debate-pero-que-tiene-interpretaciones-distintas-el-frente-amplio-n5970751
- accion_sugerida: considerar fusionar declaraciones[2] y [3] en un único registro con una `cita` que incluya ambas oraciones (mismo acto, mismo día), o dejarlas separadas pero cruzadas explícitamente en el `resumen` de cada una ("dicho en el mismo acto que..."). Mismo problema de fuente única que [2].

### declaraciones[4] — 2024-10-10 — "Nosotros lo que no vamos a hacer es mentir"
- severidad: corregir
- tipo: un_solo_grupo
- objecion: Fuente única (el-observador, misma nota retrospectiva que declaraciones[0]/[1]). Sin objeción de contenido: la cita, en su párrafo, respalda el resumen ("Orsi acusa a los 'adversarios políticos que se cansaron de repetir que el Frente Amplio subirá impuestos'. 'Nosotros lo que no vamos a hacer es mentir', rebate de recorrida por San José").
- cita_de_contexto: "10 de octubre: Orsi acusa a los 'adversarios políticos que se cansaron de repetir que el Frente Amplio subirá impuestos'. 'Nosotros lo que no vamos a hacer es mentir', rebate de recorrida por San José, en alusión a las promesas incumplidas del oficialismo." — misma URL que declaraciones[0]
- accion_sugerida: buscar cobertura local de la recorrida de San José (prensa departamental) para segunda fuente; baja probabilidad, aceptar `probable` si no aparece.

### declaraciones[5] — 2024-11-17 — "No vamos a aumentar los impuestos" (debate)
- severidad: aviso
- tipo: contexto_omitido
- objecion: Sin objeción de fondo: dos fuentes de grupos distintos (werthein-hochbaum, grupo-infobae), citas fieles al contexto del debate. Aviso: el debate presidencial del 17/11/2024 fue producido por Medios Públicos y APU y transmitido en cadena nacional; existe video público (confirmado por búsqueda web). Este es, junto con declaraciones[6], el dicho que estructura toda la promesa del lote — vale la pena subir a `nivel: textual` con fuente de video en vez de sostenerlo en dos notas de prensa.
- cita_de_contexto: "Al momento de hablar de economía, el candidato del Frente Amplio recordó que cuando ese partido gobernó, entre 2005 y 2020, el Producto Interno Bruto aumentó un 73,2%. 'No vamos a aumentar los impuestos...'" — https://www.infobae.com/america/agencias/2024/11/18/los-candidatos-presidenciales-uruguayos-se-comprometieron-en-el-debate-a-no-subir-los-impuestos/
- accion_sugerida: video del debate hallado por búsqueda (no verificado por mí con `pnpm fuente`, solo localizado): https://www.youtube.com/watch?v=YiZlxAeJ7oI y https://www.youtube.com/watch?v=t55eeoxENM8 — el investigador o el editor deberían confirmar cuál corresponde a la transmisión completa y extraer `marca_tiempo`.

### declaraciones[6] — 2024-11-17 — "Repito nuevamente porque no se entendió: no voy a subir los impuestos"
- severidad: corregir
- tipo: un_solo_grupo
- objecion: Fuente única (el-observador). Es la frase que compone la segunda mitad del `texto` de promesas[0], por lo que el mismo hueco de fuente afecta a la promesa entera. Prioridad alta para resolver con el video del debate (ver declaraciones[5]).
- cita_de_contexto: "Lo retoma diez minutos después: 'Repito nuevamente porque no se entendió: no voy a subir los impuestos. Y pregunto, antes de irse, ¿devolverán el 2% que recargaron de IVA por la compra de tarjetas?'." — https://www.elobservador.com.uy/nacional/impuestos-el-tamque-que-orsi-quiso-laudar-el-debate-pero-que-tiene-interpretaciones-distintas-el-frente-amplio-n5970751
- accion_sugerida: mismo video del debate que declaraciones[5]; si se consigue, sube también la promesa a `textual`.

### declaraciones[7] — 2024-11-17 — "Si el contexto me lo impone, andá a saber qué puede pasar..."
- severidad: corregir
- tipo: un_solo_grupo
- objecion: Fuente única (el-observador, segundo artículo). Este es, a mi juicio, **el registro más importante del lote para el candidato a giro 2** del `notas.md`, y el investigador no lo señaló como tal: en el mismo debate en que promete no subir impuestos, Orsi la condiciona explícitamente a que el contexto no lo obligue ("en términos de normalidad"). Eso es una explicación de contexto **contemporánea a la propia promesa**, no una racionalización posterior. Si el gobierno de Orsi sube o crea tributos citando un cambio de contexto (fiscal, internacional), el editor tiene acá una base textual, de la misma fecha que la promesa, para calificar el giro como `justificado_por_contexto` en vez de `sin_explicacion` — siempre que el contexto invocado después sea efectivamente uno que él no pudo prever en noviembre de 2024, y no simplemente la ejecución de un programa ya conocido.
- cita_de_contexto: "Luego, sin embargo, advirtió que esa era la planificación 'en términos de normalidad'. 'Si el contexto me lo impone, andá a saber qué puede pasar...'" — https://www.elobservador.com.uy/nacional/impuestos-y-edad-jubilatoria-los-diferencias-gabriel-oddone-que-yamandu-orsi-tuvo-que-aclarar-n5972872
- accion_sugerida: buscar segunda fuente (probablemente cubierta también por Ambito o Infobae, que reportaron el mismo debate). Para el editor: no calificar el giro 2 sin sopesar este registro.

### declaraciones[8] — 2024-11-18 — "Lo primero y claro es que el presidente voy a ser yo..."
- severidad: aviso
- tipo: sin_objecion
- objecion: Dos fuentes de grupos distintos (montevideo-comm, grupo-ambito), cita fiel. Aviso menor: la nota de Montevideo Portal aclara que la rueda de prensa fue "consignada por Telemundo (Canal 12)" — de nuevo el primario es un canal de TV no citado directamente.
- cita_de_contexto: "'Fue una linda instancia donde yo, por ejemplo, pude plantear lo que quería plantearle a la ciudadanía', dijo el candidato en rueda de prensa consignada por Telemundo (Canal 12)." — https://www.montevideo.com.uy/Noticias/-El-presidente-voy-a-ser-yo-eso-queria-que-quedara-claro--Orsi-sobre-no-subir-impuestos-uc906902
- accion_sugerida: ninguna obligatoria; si se investiga más este tramo, buscar el video de Telemundo.

### declaraciones[9] — 2024-11-18 — "Y mi pregunta fue, y ahí no tuve respuesta..."
- severidad: corregir
- tipo: un_solo_grupo
- objecion: Fuente única (montevideo-portal). Sin objeción de contenido. Nota de contexto útil para el giro 2: acá Orsi fija, por elección propia, un ejemplo concreto de lo que él considera "una muestra clara de aumento de tributos" (el recargo de IVA de Lacalle Pou a compras con tarjeta), pero no define un criterio general aplicable a sus propias medidas posteriores (IVA a compras Temu, Impuesto Mínimo Complementario Doméstico). El editor va a necesitar ese criterio —o su ausencia— para juzgar el giro 2 sin caer en un doble estándar no señalado.
- cita_de_contexto: "'Y mi pregunta fue, y ahí no tuve respuesta, si antes de irse van a devolver ese 2% que aumentaron de IVA. Porque ahí sí hay una muestra clara de aumento de tributos. No escuché nada', completó." — https://www.montevideo.com.uy/Noticias/-El-presidente-voy-a-ser-yo-eso-queria-que-quedara-claro--Orsi-sobre-no-subir-impuestos-uc906902
- accion_sugerida: buscar segunda fuente de esa misma rueda de prensa (Ambito cubrió la misma rueda pero, según lo que leí, no incluye esta frase específica; revisar la-diaria o Búsqueda).

### declaraciones[10] — 2024-11-18 — "Todo técnico tiene que tener la prudencia que su profesión le indica..."
- severidad: aviso
- tipo: sin_objecion
- objecion: Tres fuentes de tres grupos distintos (montevideo-comm, grupo-ambito, cooperativa-la-diaria); la regla de dos grupos se cumple con margen. Aviso: la nota de la diaria está detrás de un paywall parcial ("Creá una cuenta gratuita o ingresá para continuar leyendo"); el fragmento citado aparece igualmente en el texto extraído por `pnpm fuente`, así que la cita es válida, pero el editor debería saber que no es una lectura completa y libre del artículo para un lector del sitio que quiera verificarla por su cuenta.
- cita_de_contexto: "'...vez que no era cierto' que no aumentaría los impuestos, 'lo tenía que reiterar, porque no hay que dejar pasar así nomás las cosas'." — https://ladiaria.com.uy/elecciones/articulo/2024/11/orsi-reitero-que-no-va-a-aumentar-impuestos-y-afirmo-el-presidente-voy-a-ser-yo/
- accion_sugerida: ninguna obligatoria.

### declaraciones[11] — 2024-11-21 — "En las actuales condiciones no hay necesidad de toquetear los impuestos"
- severidad: corregir
- tipo: un_solo_grupo
- objecion: Fuente única (ambito). Es una entrevista distinta (streaming "Campaña del Miedo", 21/11), no la misma rueda de prensa que declaraciones[8]/[9]/[10], así que no hay manera obvia de reutilizar montevideo-portal o la-diaria acá.
- cita_de_contexto: "'Históricamente en todos los programas del Frente viene eso... Ahora, el día que tuvimos que hacer la reforma tributaria la hicimos', comentó en diálogo con el programa de streaming Campaña del Miedo. 'En las actuales condiciones no hay necesidad de toquetear los impuestos', agregó." — https://www.ambito.com/uruguay/impuestos-el-eje-del-debate-yamandu-orsi-ratifico-que-no-hay-necesidad-aumentarlos-n6084480
- accion_sugerida: buscar si "Campaña del Miedo" publicó el video/audio completo (fuente primaria) o si otro medio cubrió la misma entrevista.

### declaraciones[12] — 2024-11-21 — "Estamos en un mundo de una fragilidad y una incertidumbre..."
- severidad: corregir
- tipo: un_solo_grupo
- objecion: Misma entrevista y misma fuente única que declaraciones[11]. Contenido fiel al contexto: es la justificación de coyuntura internacional para no subir impuestos "mientras no se necesite" — dato relevante para el giro 2 en la misma línea que declaraciones[7].
- cita_de_contexto: "'Estamos en un mundo de una fragilidad y una incertidumbre que los capitales vuelan. Abrís la página de cualquier periódico mundial y no sabes si arranca la tercera guerra mundial', comentó." — misma URL que declaraciones[11]
- accion_sugerida: igual que declaraciones[11].

### declaraciones[13] — 2025-08-21 — "La (solución) que se nos ocurre es gravar como cualquier otro producto..."
- severidad: aviso
- tipo: explicacion_alternativa
- objecion: Dos fuentes de grupos distintos (fontaina-de-feo, grupo-ambito), sin objeción de sourcing. Explicación alternativa que hay que dejar escrita para el giro 2, en paralelo con lo que ya se hizo en la corrida de Lacalle Pou para su recorte de la exoneración de IVA en tarjetas de 2020: **lectura de que sí es un aumento de impuestos** — antes estas compras estaban exoneradas de IVA y ahora se gravan al 22%; es una ampliación de la base imponible sobre una transacción que antes no pagaba nada. **Lectura de que no lo es** — la tasa general del IVA (22%) no cambia; se extiende un impuesto ya existente a una categoría que antes tenía una exención puntual, para nivelar la competencia con el comercio local (la propia palabra de Orsi es "equidad", no "recaudación"). Ambas lecturas son sostenibles con lo que hay en el lote; el registro no toma partido y eso está bien, pero el editor va a necesitar las dos para calificar el giro.
- cita_de_contexto: "El presidente Yamandú Orsi fue consultado este jueves sobre el anuncio que hizo el ministro de Economía Gabriel Oddone de comenzar a gravar con IVA las compras minoristas que se realizan por internet en el exterior..." — https://www.subrayado.com.uy/orsi-dijo-que-el-iva-compras-el-exterior-internet-es-resolver-un-tema-inequidad-n985772
- accion_sugerida: ninguna de sourcing. Incorporar el par de lecturas al análisis del giro.

### declaraciones[14] — 2026-05-19 — "Yo ya dije lo que tenía para decir: acá no va a haber aumento"
- severidad: corregir
- tipo: un_solo_grupo
- objecion: Fuente única (subrayado). Sin objeción de contenido. Es la reafirmación más reciente del compromiso original (mayo de 2026, año y medio en el cargo), y sirve como registro `sin_cambio` que el investigador incluyó correctamente para no sesgar el lote solo hacia contradicciones.
- cita_de_contexto: "El presidente Yamandú Orsi reiteró este martes que no habrá aumento de impuestos en lo que queda del actual período de gobierno. 'Yo ya dije lo que tenía para decir: acá no va a haber aumento', remarcó." — https://www.subrayado.com.uy/no-va-haber-aumento-impuestos-el-periodo-y-se-analiza-siempre-cambios-tributarios-dijo-el-presidente-n1008170
- accion_sugerida: buscar segunda cobertura de esta rueda de prensa (probablemente cubierta también por Ambito, El Observador o Telenoche el mismo día).

### declaraciones[15] — 2026-05-19 — "a mí me encanta la idea del IVA personalizado..."
- severidad: corregir
- tipo: un_solo_grupo
- objecion: Fuente única (subrayado, misma nota que declaraciones[14]). Sin objeción de contenido; el resumen es fiel. Es un registro de menor centralidad para el tema "no subir impuestos" (habla de una reforma hipotética, no de un aumento), pero corresponde igual a `economia/impuestos`.
- cita_de_contexto: "Consultado sobre el IVA personalizado, el presidente manifestó: 'a mí me encanta la idea del IVA personalizado, creo que no estamos preparados para eso todavía...'" — misma URL que declaraciones[14]
- accion_sugerida: igual que declaraciones[14].

### promesas[0] — 2024-11-17 — "No vamos a aumentar los impuestos. Repito nuevamente porque no se entendió: no voy a subir los impuestos."
- severidad: aviso
- tipo: cita_fuera_de_contexto
- objecion: El campo `texto` concatena dos frases que, según la propia fuente citada en `origen`, se dijeron con **diez minutos de diferencia** dentro del debate ("Lo retoma diez minutos después"), presentadas sin ningún separador que indique el salto temporal. No hay tergiversación de sentido (las dos frases dicen lo mismo, reforzándose), pero leído tal como está el `texto` sugiere una sola oración continua. La `cita` dentro de `origen.evidencia` sí conserva el "diez minutos después", así que el problema es solo del campo `texto` de cara al lector.
- cita_de_contexto: "Hasta que llegó el debate del domingo con Delgado, y Orsi compromete: 'No vamos a aumentar los impuestos'. Lo retoma diez minutos después: 'Repito nuevamente porque no se entendió: no voy a subir los impuestos...'" — https://www.elobservador.com.uy/nacional/impuestos-el-tamque-que-orsi-quiso-laudar-el-debate-pero-que-tiene-interpretaciones-distintas-el-frente-amplio-n5970751
- accion_sugerida: separar con puntos suspensivos o una nota ("[...], reiterado diez minutos después:") en `texto`. Igual que declaraciones[5]/[6]: subir a `textual` con el video del debate resolvería esto de raíz al poder anclar cada frase a su propia `marca_tiempo`.

### promesas[0].evidencias_candidatas[0] — 2025-08-21 — IVA a compras en plataformas extranjeras (22%)
- severidad: corregir
- tipo: contexto_omitido
- objecion: La `descripcion` incluye el dato "(22%)" que **no está en ninguna de las dos fuentes citadas** para esta fecha (subrayado y ambito del 21/08/2025); ese porcentaje sí aparece, pero en una nota distinta de El Observador del 01/09/2025 que es la fuente de evidencias_candidatas[1], no de esta entrada. No es un dato inventado (el 22% es la tasa general del IVA uruguayo y coincide con lo que finalmente se legisló), pero tal como está escrito el registro atribuye a las fuentes del 21/08 una precisión que no dieron ese día.
- cita_de_contexto: "El presidente Yamandú Orsi fue consultado este jueves sobre el anuncio que hizo el ministro de Economía Gabriel Oddone de comenzar a gravar con IVA las compras minoristas que se realizan por internet en el exterior bajo el régimen de encomiendas con franquicias." (sin mención de "22%") — https://www.subrayado.com.uy/orsi-dijo-que-el-iva-compras-el-exterior-internet-es-resolver-un-tema-inequidad-n985772
- accion_sugerida: quitar el "(22%)" de esta entrada o agregar como tercera fuente la nota de El Observador del 01/09/2025 (ya citada en evidencias_candidatas[1]) que sí da la cifra.

### promesas[0].evidencias_candidatas[1] — 2026-01-08 — Ley 20.446, Impuesto Mínimo Complementario Doméstico
- severidad: corregir
- tipo: contexto_omitido
- objecion: La `descripcion` atribuye a "el propio proyecto de ley" la frase "el propósito de esta iniciativa no es aumentar los impuestos... sino simplemente localizar..." como si justificara el conjunto de la medida descrita (Impuesto Mínimo Complementario Doméstico **y** la ampliación de la franquicia de compras al exterior con IVA). Leída en la nota de El Observador, esa frase de la exposición de motivos se aplica explícitamente solo a la "primera categoría" de cambios (el Impuesto Mínimo Complementario Doméstico y el tratamiento de dividendos a no residentes); el cambio en las franquicias de compras al exterior (el "efecto TEMU") está en una "segunda categoría" que el propio proyecto encuadra como "ajustes técnicos" para "mayor equidad horizontal", una justificación distinta. Mezclar las dos bajo una sola cita atribuye al gobierno un argumento más amplio del que realmente usó para cada componente. También aporto acá el mismo par de lecturas que en declaraciones[13]: **sí es aumento** porque crea, con ese nombre, un impuesto nuevo; **no lo es** en el sentido de que solo alcanza a multinacionales con facturación mayor a US$ 750 millones (no a contribuyentes uruguayos comunes) y busca captar en Uruguay una recaudación que, por las reglas del Pilar Dos de la OCDE, esas empresas ya pagan en algún país — no es plata nueva que sale del bolsillo de nadie en Uruguay, es una disputa de jurisdicción fiscal internacional.
- cita_de_contexto: "En primer lugar, se proponen ajustes que tienen como propósito localizar el pago de impuestos en Uruguay... En esta primera categoría se ubica el Impuesto Mínimo Complementario Doméstico... En segundo lugar, el Poder Ejecutivo señala que hay 'ajustes técnicos' orientados a otorgar 'mayor equidad horizontal'... cambios en los regímenes de envíos expresos." — https://www.elobservador.com.uy/nacional/los-detalles-los-cambios-tributarios-del-presupuesto-impuestos-temu-los-capitales-el-exterior-y-el-minimo-global-las-multinacionales-n6015085
- accion_sugerida: separar la `descripcion` en dos frases con su propia justificación oficial cada una, o al menos aclarar que la cita "no es aumentar, es localizar" corresponde solo al Impuesto Mínimo Complementario Doméstico.

### promesas[0].evidencias_candidatas[2] — 2026-01-21 — ajuste de franjas de IRPF/IASS por indexación de la BPC
- severidad: corregir
- tipo: un_solo_grupo
- objecion: Fuente única (montevideo-portal), `_faltante` correcto. Además, para `tipo: dato_oficial` la fuente ideal es el propio decreto, no una nota de prensa que reporta la polémica. Encontré (búsqueda web, no abierto con `pnpm fuente`) el Decreto 11/026 en IMPO, que fija la BPC en $6.864 desde el 1/1/2026 según la fórmula de indexación por IPC de la Ley 17.856 art. 3. Ese dato — que la fórmula es automática y preexistente, no una decisión discrecional del gobierno de Orsi — es central para juzgar si "ajuste fiscal" (etiqueta de la oposición) o "es lo que corresponde" (etiqueta del asesor Viñales) describe mejor el hecho, y hoy el registro no lo tiene.
- cita_de_contexto: "El aumento en el valor de la base de prestaciones y contribuciones (BPC) decretado por el Poder Ejecutivo, que modifica las franjas del impuesto a la renta de las personas físicas (IRPF)... causó polémica..." — https://www.montevideo.com.uy/Noticias/De-mazazo-a-es-lo-que-corresponde--cruces-y-criticas-varias-por-ajustes-en-IRPF-e-IASS-uc950445
- accion_sugerida: citar el Decreto 11/026 (https://www.impo.com.uy/bases/decretos-originales/11-2026, no verificado por mí con `pnpm fuente`, solo localizado) como fuente `documento_oficial` adicional, y precisar en la `descripcion` si la fórmula de indexación es la misma que regía antes de este gobierno.

### promesas[0].evidencias_candidatas[3] — 2026-03-01 — documento "Construir sin Destruir" del Partido Nacional
- severidad: corregir
- tipo: un_solo_grupo
- objecion: Fuente única (ambito), `_faltante` correcto; el `notas.md` documenta una búsqueda real de segunda fuente sin éxito. La nota es fiel al documento partidario y lo atribuye con claridad ("Desde el PN señalan que..."), sin que Ámbito adopte la acusación como propia. Aviso de Veracímetro: las afirmaciones específicas del documento (incrementos en IRAE, IRNR, zonas francas) no están corroboradas en este lote con ninguna fuente independiente del propio documento opositor.
- cita_de_contexto: "Desde el PN señalan que durante la campaña electoral, el Frente Amplio (FA) afirmó reiteradamente que no habría aumentos impositivos. Sin embargo, el primer año de gobierno incorporó incrementos en el IRPF, IRAE, IRNR, zonas francas, el Impuesto Mínimo Global y un nuevo tributo al comercio electrónico internacional..." — https://www.ambito.com/uruguay/la-oposicion-cuestiono-la-gestion-yamandu-orsi-impuestos-deficit-y-promesas-rotas-n6250895
- accion_sugerida: buscar el PDF de 15 páginas "Construir sin Destruir" directamente (circuló en la cuenta de X de Lacalle Pou, según la propia nota) como fuente primaria del documento, y verificar cada uno de los tributos mencionados (IRAE, IRNR, zonas francas) contra DGI/IMPO antes de tratarlos como hechos establecidos.

### promesas[0].evidencias_candidatas[4] — 2025-09-01 — declaraciones de Andrés Ojeda
- severidad: corregir
- tipo: un_solo_grupo
- objecion: Fuente única (montevideo-portal), `_faltante` correcto. Es una opinión de un dirigente opositor identificable, correctamente atribuida entre comillas, no una afirmación de hecho de La Casta — riesgo legal bajo. Aviso metodológico: a diferencia de evidencias_candidatas[1] (Ley 20.446, un hecho verificable), esta pieza y evidencias_candidatas[3] son **juicios políticos de terceros sobre el cumplimiento de la promesa**, no hechos de gobierno; el editor debería pesarlas distinto al fundamentar el estado de la promesa. Nota de orden: esta entrada tiene fecha 2025-09-01, anterior a evidencias_candidatas[1] (2026-01-08) y evidencias_candidatas[2] (2026-01-21), pero está ubicada después de ambas en el arreglo — no afecta la validación, pero dificulta seguir la cronología.
- cita_de_contexto: "'Todos recordamos al presidente Orsi en el debate en campaña mirar a cámara y decir: No vamos a subir los impuestos. Va a ser meme ese clip de Orsi diciendo que no va a subir los impuestos. Aquí vienen aumentos y vienen nuevos impuestos', expresó el senador colorado." — https://www.montevideo.com.uy/Noticias/-Le-mintieron-a-la-gente-y-Orsi-va-a-ser-meme--Ojeda-por-impuestos-en-Presupuesto-uc935026
- accion_sugerida: reordenar cronológicamente el arreglo de `evidencias_candidatas`; buscar segunda fuente de esta rueda de prensa del Partido Colorado.

### promesas[0].evidencias_candidatas[5] — 2026-05-19 — reiteración de que no habrá aumento
- severidad: corregir
- tipo: un_solo_grupo
- objecion: Fuente única (subrayado), `_faltante` correcto (mismo problema que declaraciones[14], de donde se toma literalmente la misma cita). Objeción metodológica, en paralelo exacto con lo que señaló la crítica de la corrida de Lacalle Pou para un caso análogo (evidencias_candidatas[3] de ese lote): usar la propia reafirmación del promitente como evidencia `a_favor` del cumplimiento de su propia promesa es, en algún grado, circular — mide la promesa con la palabra de quien la hizo, no con un hecho de gobierno independiente. No es un error de cita (la fuente es exacta), pero como pieza probatoria pesa menos que un acto de gobierno verificable.
- cita_de_contexto: "El presidente Yamandú Orsi reiteró este martes que no habrá aumento de impuestos en lo que queda del actual período de gobierno." — https://www.subrayado.com.uy/no-va-haber-aumento-impuestos-el-periodo-y-se-analiza-siempre-cambios-tributarios-dijo-el-presidente-n1008170
- accion_sugerida: mantener `efecto: a_favor` pero dejar constancia en la `descripcion` de que es autoevaluación del propio promitente, no un hecho de gobierno independiente.

### menciones[0] — 2024-11-17 — "Antes de irse, devolverán el 2% que recargaron de IVA por la compra por tarjetas?"
- severidad: aviso
- tipo: sin_objecion
- objecion: Dos fuentes de grupos distintos (grupo-ambito, werthein-hochbaum), cita fiel al contexto del debate en ambas notas. `sentido: negativo` es razonable: es una chicana dirigida a la gestión saliente de Lacalle Pou. Cruza con declaraciones[9] (mismo reclamo, repetido al día siguiente en rueda de prensa) — el editor podría enlazarlos.
- cita_de_contexto: "mientras Orsi chicaneó: 'Antes de irse, devolverán el 2% que recargaron de IVA por la compra por tarjetas?'." — https://www.ambito.com/uruguay/economia-yamandu-orsi-y-alvaro-delgado-se-cruzaron-los-impuestos-n6083094
- accion_sugerida: ninguna de sourcing. El `notas.md` ya señala que Álvaro Delgado, interpelado directamente en el mismo debate, no tiene ficha en `content/politicos/` ni en `content/referentes/`; coincido en que valdría la pena crearla, dado que aparece citado y contrapuesto a Orsi en al menos seis de las notas de este lote.

---

## Objeciones al lote

1. **Dependencia estructural de dos medios (El Observador y Subrayado) y de un solo canal de TV no citado directamente (Telemundo/Canal 12).** El Observador es la fuente única o compartida de 8 de los 16 registros de declaraciones (0,1,2,3,4,6,7 y compartida en 5), y Subrayado de 4 (13,14,15 y compartida en 13). Dos notas retrospectivas de un mismo periodista de El Observador ("impuestos-el-tamque..." e "impuestos-y-edad-jubilatoria...") sostienen, entre las dos, 7 de los 16 registros. Formalmente cada registro con `_faltante` está correctamente marcado; en la práctica, casi la mitad del lote depende de la reconstrucción de un solo diario. Además, al menos tres momentos citados (Telemundo dic. 2023, rueda de prensa post-debate del 18/11 "consignada por Telemundo") tienen como fuente primaria real un canal de TV que nadie en el lote citó directamente. `accion_sugerida`: antes de publicar, priorizar la búsqueda del video del debate del 17/11/2024 (hallado por mí, no verificado con `pnpm fuente`: https://www.youtube.com/watch?v=YiZlxAeJ7oI y https://www.youtube.com/watch?v=t55eeoxENM8), que resolvería de una vez declaraciones[5,6,7] y promesas[0].origen.

2. **El giro 2 del `notas.md` tiene, dentro del propio lote, una explicación de contexto contemporánea que el investigador no destacó como tal.** Declaraciones[7] y [12] muestran a Orsi condicionando su promesa "en términos de normalidad" y advirtiendo sobre la volatilidad del contexto internacional, en la misma semana en que la formula. Esto no cierra el debate sobre si el IVA a compras en plataformas extranjeras o el Impuesto Mínimo Complementario Doméstico "cuentan" como el tipo de cambio de contexto que él anticipó, pero es la pieza que decide entre `justificado_por_contexto` y `sin_explicacion`, y hoy está dispersa en dos registros sin que el `notas.md` la conecte con el candidato a giro 2.

3. **Fragmentación de un mismo acto en dos registros** (declaraciones[2] y [3], comité de Trouville del 7/3/2024): ver objeción de registro. No cambia ningún hecho, pero puede leerse como que Orsi "habló dos veces" de impuestos ese día cuando fue una sola intervención.

4. **Cobertura del período: coincido con la autoevaluación de `notas.md`.** El período de gobierno cubierto (18 meses) es necesariamente corto frente a los mandatos completos ya investigados de otros presidentes, y eso es un artefacto del calendario, no de un criterio más laxo — no encontré, en mi propia relectura ni en las búsquedas adicionales que hice, ningún episodio de peso sobre impuestos en 2025-2026 que el lote haya omitido. Sí falta, dentro del período efectivamente cubierto, una búsqueda dirigida a la sesión parlamentaria de aprobación de la Ley de Presupuesto (fines de 2025), donde probablemente haya intervenciones directas de Orsi o de su bancada defendiendo los cambios tributarios ante acusaciones de incumplimiento — hoy el lote solo tiene el anuncio (agosto 2025) y la ley promulgada (enero 2026), sin el debate parlamentario intermedio.

5. **El episodio del Impuesto de Primaria (`casos_vistos`) no cruza el umbral de "caso" tal como está documentado, y coincido con la decisión de no generar un registro en este lote.** No hay denuncia formal ni investigación de Fiscalía. Hay dos declaraciones críticas de dirigentes opositores identificables (Álvaro Delgado: "el peor [gobierno] desde el 85 para acá"; Andrés Ojeda: distingue "olvidarse de un impuesto y pagarlo después" de no declarar obras que impliquen "subtributación") en un medio, pero son juicios políticos generales o preguntas abiertas, no una acusación formal de un ilícito específico — Ojeda pide "ahondar en la información", no denuncia. La deuda (UYU 5.509, ≈ USD 137) se regularizó apenas se conoció la nota. Mi lectura: **no es un caso; en el peor de los casos, es una declaración o un chequeo de Veracímetro sobre el hecho patrimonial puntual**, y de cualquier manera no pertenece al tema `economia/impuestos` (es `transparencia-corrupcion`/patrimonio). Objeción operativa: revisé `inbox/orsi/patrimonio/2026-09-04/` (el lote paralelo de esa corrida) y este episodio **no aparece** en su `notas.md` ni en `patrimonio.yaml` — solo cubre el caso de la camioneta y la declaración jurada. Es un hueco real entre corridas, no de este lote específico. `accion_sugerida`: que el editor lo derive a una futura corrida de `orsi/transparencia-corrupcion` o `orsi/patrimonio`, si decide que amerita registro (aunque sea como declaración/chequeo, no como caso).

6. **Ningún medio del lote tiene `alineamiento` distinto de `sin_datos`, salvo la diaria (`independiente`).** El Observador, Ámbito, Infobae, Montevideo Portal y Subrayado —que entre los cinco sostienen prácticamente todo el lote— figuran con `alineamiento: sin_datos` en `content/medios/`. No puedo evaluar si el lote está capturando "el ángulo crítico" y "el ángulo afín" en proporciones parejas porque el dato de base no existe; lo señalo como límite de mi propia revisión, no como falla del investigador. `accion_sugerida`: completar `alineamiento` en `content/medios/` para estos cinco medios sería una mejora estructural, no de este lote puntual.

## Objeciones al brief

Ninguna. El brief pide expresamente cobertura del período completo, campaña y gestión, lo favorable y lo desfavorable, y registrar también la consistencia (`sin_cambio`). No hay instrucción de seleccionar, omitir o encuadrar por partido, ideología o persona. Coincido con la autoevaluación de `notas.md` en este punto. Único matiz operativo (no de Regla 0): la tabla de medios del brief no incluye `teledoce` (Telemundo/Canal 12), pese a que varias citas del lote provienen de apariciones en ese canal reportadas por terceros; como `teledoce.yaml` ya existe en `content/medios/`, no es un bloqueo, pero conviene que quien genera la tabla del brief la lea completa de `content/medios/` en vez de una lista fija, para que el investigador sepa desde el principio que ese medio está disponible como fuente primaria a buscar.

---

## Cobertura

Criterio de tono aplicado, uniforme para todos los medios y partidos: `neutral` por defecto; me aparto solo si el medio, en voz propia (no en boca de una fuente citada), afirma algo adverso o laudatorio.

```yaml
- medio: el-observador
  url: https://www.elobservador.com.uy/nacional/impuestos-el-tamque-que-orsi-quiso-laudar-el-debate-pero-que-tiene-interpretaciones-distintas-el-frente-amplio-n5970751
  fecha: 2024-11-19
  evento: elecciones-2024
  politico: orsi
  tono: desfavorable
  justificacion: >-
    En voz propia, no de una fuente citada, describe la posición de Orsi como acorralada por su
    propia coalición: "El Frente Amplio lleva más de un año embretado por la coalición de gobierno
    en su posición sobre los impuestos".

- medio: el-observador
  url: https://www.elobservador.com.uy/nacional/impuestos-y-edad-jubilatoria-los-diferencias-gabriel-oddone-que-yamandu-orsi-tuvo-que-aclarar-n5972872
  fecha: 2024-11-30
  evento: elecciones-2024
  politico: orsi
  tono: neutral
  justificacion: >-
    Narra las posiciones sucesivas de Orsi y Oddone sin adjetivarlas en exceso: "declaraciones de
    quien será el próximo ministro de Economía... generaron confusión en más de una oportunidad
    que Orsi terminó zanjando diciendo que él tiene la última palabra".

- medio: el-observador
  url: https://www.elobservador.com.uy/nacional/debate-presidencial-yamandu-orsi-asumio-compromiso-no-aumentar-impuestos-primera-vez-n5970628
  fecha: 2024-11-17
  evento: elecciones-2024
  politico: orsi
  tono: desfavorable
  justificacion: >-
    Encuadra en voz propia la promesa como una novedad frente a sus dichos previos, sugiriendo un
    cambio de postura: "Si bien hasta el momento había señalado que no lo podía asegurar ahora fue
    contundente y asumió el compromiso de no incrementar tributos". (Leída por el investigador,
    no citada en ningún registro final.)

- medio: el-observador
  url: https://www.elobservador.com.uy/nacional/los-detalles-los-cambios-tributarios-del-presupuesto-impuestos-temu-los-capitales-el-exterior-y-el-minimo-global-las-multinacionales-n6015085
  fecha: 2025-09-01
  evento: "propuesto: ley-presupuesto-2025-2029"
  politico: orsi
  tono: neutral
  justificacion: >-
    Nota explicativa de los cambios tributarios sin citar declaraciones de Orsi ni valorarlas:
    "el propósito de esta iniciativa no es aumentar los impuestos para los contribuyentes
    alcanzados por la norma, sino simplemente localizar en Uruguay la recaudación".

- medio: infobae
  url: https://www.infobae.com/america/agencias/2024/11/18/los-candidatos-presidenciales-uruguayos-se-comprometieron-en-el-debate-a-no-subir-los-impuestos/
  fecha: 2024-11-18
  evento: elecciones-2024
  politico: orsi
  tono: neutral
  justificacion: >-
    Cable de agencia que reparte espacio parejo entre los dos candidatos sin valorar: "Al momento
    de hablar de economía, el candidato del Frente Amplio recordó que... Por el contrario, Delgado
    dijo que el Gobierno del Frente Amplio entregó el país con una inflación 'de casi dos dígitos'".

- medio: montevideo-portal
  url: https://www.montevideo.com.uy/Noticias/-El-presidente-voy-a-ser-yo-eso-queria-que-quedara-claro--Orsi-sobre-no-subir-impuestos-uc906902
  fecha: 2024-11-18
  evento: elecciones-2024
  politico: orsi
  tono: neutral
  justificacion: >-
    Reproduce la rueda de prensa con atribución constante, sin adjetivar: "habló este lunes tras
    el debate presidencial... en declaraciones donde reafirmó su compromiso de no subir impuestos
    en caso de ser electo".

- medio: ambito
  url: https://www.ambito.com/uruguay/impuestos-el-eje-del-debate-yamandu-orsi-ratifico-que-no-hay-necesidad-aumentarlos-n6084480
  fecha: 2024-11-21
  evento: elecciones-2024
  politico: orsi
  tono: neutral
  justificacion: >-
    Da amplio espacio a la explicación de Orsi y a la contra-argumentación de Oddone sin tomar
    partido: "el presidenciable por el Frente Amplio... comentó el porqué cree que aumentar los
    impuestos daría una mala señal al mercado".

- medio: la-diaria
  url: https://ladiaria.com.uy/elecciones/articulo/2024/11/orsi-reitero-que-no-va-a-aumentar-impuestos-y-afirmo-el-presidente-voy-a-ser-yo/
  fecha: 2024-11-18
  evento: elecciones-2024
  politico: orsi
  tono: neutral
  justificacion: >-
    Nota breve que resume ambas posturas del debate sin valorarlas: "ambos prometieron no aumentar
    los impuestos... Delgado, en tanto, dijo que si el FA gana las elecciones, 'va a subir los
    impuestos porque lo dice su programa'".

- medio: subrayado
  url: https://www.subrayado.com.uy/orsi-dijo-que-el-iva-compras-el-exterior-internet-es-resolver-un-tema-inequidad-n985772
  fecha: 2025-08-21
  evento: "propuesto: ley-presupuesto-2025-2029"
  politico: orsi
  tono: neutral
  justificacion: >-
    Reporta la justificación de Orsi sin contrapunto ni valoración propia: "Orsi dijo que 'se está
    resolviendo un tema de inequidad'".

- medio: ambito
  url: https://www.ambito.com/uruguay/el-iva-compras-el-exterior-internet-busca-resolver-un-tema-inequidad-aseguro-yamandu-orsi-n6181152
  fecha: 2025-08-21
  evento: "propuesto: ley-presupuesto-2025-2029"
  politico: orsi
  tono: neutral
  justificacion: >-
    Incluye la justificación presidencial y, a continuación, un proyecto de ley opositor en
    sentido contrario, ambos atribuidos: "el diputado del Partido Nacional (PN) Pedro Jisdonian
    presentó un proyecto de ley que propone mantener la compra libre de impuesto".

- medio: impo
  url: https://www.impo.com.uy/bases/leyes-originales/20446-2025
  fecha: 2026-01-08
  evento: "propuesto: ley-presupuesto-2025-2029"
  politico: orsi
  tono: neutral
  justificacion: >-
    Texto legal sin voz editorial: "quedarán exentas del pago de aranceles... quedarán sujetas a
    las disposiciones... del Impuesto al Valor Agregado". (Documento oficial, no nota de prensa;
    se incluye por trazabilidad.)

- medio: montevideo-portal
  url: https://www.montevideo.com.uy/Noticias/De-mazazo-a-es-lo-que-corresponde--cruces-y-criticas-varias-por-ajustes-en-IRPF-e-IASS-uc950445
  fecha: 2026-01-21
  evento: "propuesto: ajuste-bpc-irpf-iass-2026"
  politico: orsi
  tono: neutral
  justificacion: >-
    Presenta las dos etiquetas en pugna ("mazazo" vs. "es lo que corresponde") sin adoptar
    ninguna: "el aumento en el valor de la base de prestaciones y contribuciones (BPC)... causó
    polémica y repercusión en el sistema político uruguayo".

- medio: ambito
  url: https://www.ambito.com/uruguay/la-oposicion-cuestiono-la-gestion-yamandu-orsi-impuestos-deficit-y-promesas-rotas-n6250895
  fecha: 2026-03-01
  evento: "propuesto: construir-sin-destruir-2026"
  politico: orsi
  tono: neutral
  justificacion: >-
    Transmite el documento partidario con atribución explícita y sin adherir: "Desde el PN
    señalan que durante la campaña electoral, el Frente Amplio (FA) afirmó reiteradamente que no
    habría aumentos impositivos. Sin embargo, el primer año de gobierno incorporó incrementos...".

- medio: montevideo-portal
  url: https://www.montevideo.com.uy/Noticias/-Le-mintieron-a-la-gente-y-Orsi-va-a-ser-meme--Ojeda-por-impuestos-en-Presupuesto-uc935026
  fecha: 2025-09-01
  evento: "propuesto: ley-presupuesto-2025-2029"
  politico: orsi
  tono: neutral
  justificacion: >-
    Titula y reporta con la cita de Ojeda entre comillas, atribuida, sin adoptarla como propia:
    "El secretario general del Partido Colorado, Andrés Ojeda, brindó una rueda de prensa... y
    manifestó que desde el gobierno 'le mintieron a la gente'".

- medio: subrayado
  url: https://www.subrayado.com.uy/no-va-haber-aumento-impuestos-el-periodo-y-se-analiza-siempre-cambios-tributarios-dijo-el-presidente-n1008170
  fecha: 2026-05-19
  evento: "propuesto: gestion-tributaria-orsi-2025-2026"
  politico: orsi
  tono: neutral
  justificacion: >-
    Reporta la reafirmación presidencial sin contrapunto ni adjetivación: "El presidente Yamandú
    Orsi reiteró este martes que no habrá aumento de impuestos en lo que queda del actual período
    de gobierno".

- medio: ambito
  url: https://www.ambito.com/uruguay/economia-yamandu-orsi-y-alvaro-delgado-se-cruzaron-los-impuestos-n6083094
  fecha: 2024-11-17
  evento: elecciones-2024
  politico: orsi
  tono: neutral
  justificacion: >-
    Reparte la crónica del cruce entre los dos candidatos con verbos parejos para ambos ("Orsi
    chicaneó"; Delgado "sacó pecho"), sin tomar partido: "Ambos candidatos se comprometieron a no
    subir impuestos, pero también intercambiaron acusaciones".

- medio: infobae
  url: https://www.infobae.com/america/america-latina/2026/07/07/nueva-polemica-con-yamandu-orsi-debia-un-impuesto-por-una-de-sus-casas-y-no-habia-declarado-obras-en-otra/
  fecha: 2026-07-07
  evento: "propuesto: gestion-tributaria-orsi-2025-2026"
  politico: orsi
  tono: desfavorable
  justificacion: >-
    Encuadra el episodio como controversia en voz propia, no solo en boca de opositores: "está
    envuelto en una nueva polémica que involucra su patrimonio personal". (Leída en `casos_vistos`,
    no generó ningún registro de declaración/promesa/mención en este lote; ver "Objeciones al
    lote", punto 5.)
```

Registros de cobertura: **17** (15 de notas citadas en el lote + 2 de notas leídas y no citadas). Tonos: 2 desfavorables, 15 neutrales, 0 favorables.
