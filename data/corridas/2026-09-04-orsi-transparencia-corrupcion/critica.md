# Crítica — corrida 2026-09-04-orsi-transparencia-corrupcion

Modelo: Claude Sonnet 5 (claude-sonnet-5). Nota de proceso: el rol de crítico corre normalmente
con Opus según la tabla de `CLAUDE.md`; esta corrida es deliberadamente Sonnet, parte del
experimento descrito en `EXPERIMENTO.md` (brazo barato). No es un error ni motivo para repetir
la corrida.
Lote: inbox/orsi/transparencia-corrupcion/2026-09-04/
Registros revisados: 17 (13 declaraciones, 3 promesas, 1 mención) + 2 casos judiciales
documentados solo en `notas.md` (sin `casos.yaml` en este lote, igual que en la corrida de
referencia de Lacalle Pou).

Todas las citas de este informe fueron releídas con `pnpm fuente <url> --buscar "..."` en esta
sesión; ninguna URL se cita de memoria.

## Objeciones por registro

### declaraciones[0] — 2026-05-26 — "Cuando usted vea la factura, ahí va a decir qué precio es."
- severidad: corregir
- tipo: un_solo_grupo
- objecion: Las dos fuentes declaradas (montevideo-portal, grupo `montevideo-comm`, 2026-05-26;
  caras-y-caretas, grupo `editora-caras-y-caretas`, 2026-05-27) pasan la regla mecánica de
  grupos distintos, pero el cuerpo de las dos notas es prácticamente idéntico palabra por
  palabra en todo el párrafo que rodea la cita ("En las últimas horas, se generó polémica en
  torno a una camioneta que compró el presidente Yamandú Orsi... indicó en rueda de prensa."),
  incluida la cifra de US$ 3.396.500 y la referencia a "Así nos va (Radio Carve)". Es el patrón
  que el brief de esta misma corrida pide vigilar en otra forma (recorte o pegado de frases);
  acá el riesgo es el inverso: dos "grupos" que mecánicamente cuentan como independientes pero
  que en el texto leído son una sola cobertura, probablemente una reproduce a la otra o ambas
  reproducen un comunicado común. La regla del proyecto es explícita: "una copia de agencia en
  varios diarios cuenta como uno".
- cita_de_contexto: "El presidente fue consultado este martes sobre el tema y se limitó a
  responder que enviará la factura al programa radial con el fin de aclarar la situación.
  'Cuando usted vea la factura, ahí va a decir qué precio es', indicó en rueda de prensa."
  (idéntico en https://www.montevideo.com.uy/Noticias/-Cuando-usted-vea--Orsi-hablo-sobre-la-camioneta-que-compro-con-US-25-000-de-descuento-uc963282
  y en https://www.carasycaretas.com.uy/sociedad/la-camioneta-la-polemica-orsi-mostro-factura-y-entrego-vehiculo-como-forma-pago-n95840)
- accion_sugerida: buscar un segundo grupo genuinamente independiente (el-pais, la-diaria,
  busqueda, teledoce, telenoche no aparecieron en `corpus:buscar "camioneta descuento Orsi
  25.000"` para esta cita puntual) o, si no aparece, marcar `_faltante: segunda_fuente` en vez
  de presentar esto como si tuviera dos fuentes independientes.

### declaraciones[1] — 2026-05-30 — "Me equivoco todos los días, desde que me levanto..."
- severidad: aviso
- tipo: sin_objecion
- objecion: ninguna. La cita es un intercambio con dos periodistas, verificado palabra por
  palabra y en el mismo orden en subrayado y en en-perspectiva (grupos `fontaina-de-feo` y
  `lecueder-cotelo`, distintos). No hay recorte ni frases no contiguas pegadas: el intercambio
  completo aparece igual en ambas fuentes.
- cita_de_contexto: "'- Orsi: Me equivoco todos los días, desde que me levanto. - Periodista:
  ¿Pero en el caso de la camioneta?. – Orsi: No. – Periodista: ¿No se equivocó al recibir ese
  descuento?. – Orsi: Lo dictaminarán los organismos de contralor...'"
  (https://enperspectiva.uy/en-perspectiva-programa/la-mesa/el-presidente-yamandu-orsi-dijo-que-no-se-equivoco-al-recibir-un-descuento-en-la-compra-de-su-camioneta/)
- accion_sugerida: ninguna.

### declaraciones[2] — 2026-05-30 — "A veces descuentos en el supermercado de la esquina, por favor, por favor."
- severidad: aviso
- tipo: sin_objecion
- objecion: ninguna. Verificado en subrayado y en-perspectiva, contiguo a la pregunta que lo
  motiva en ambas.
- cita_de_contexto: "Consultado si él o su familia han recibido otros descuentos y beneficios,
  respondió: 'A veces descuentos en el supermercado de la esquina, por favor, por favor'."
  (https://www.subrayado.com.uy/cuando-hay-descuentos-yo-me-tiro-cabeza-dijo-orsi-la-camioneta-que-compro-25000-dolares-descuento-n1009051)
- accion_sugerida: ninguna.

### declaraciones[3] — 2026-05-30 — "Este país tiene buenos organismos de contralor..."
- severidad: aviso
- tipo: sin_objecion (la fidelidad de la cita) + contexto para el editor
- objecion: la cita es literal y contigua en subrayado. El `_faltante: segunda_fuente` está
  bien puesto: confirmé que ni ambito ("...respondió irónicamente...") ni en-perspectiva
  contienen esta frase (el propio investigador ya había probado esa búsqueda y dio "0
  coincidencias", lo repetí y es correcto). Punto de contexto para el editor, no defecto del
  registro: la misma nota (subrayado, 2026-08-03, no citada en este registro) recoge que la
  presidenta de la Jutep, Ana María Ferraris, describe a la "mayoría oficialista de la Jutep
  (Ferraris y Asti)" al hablar de otros casos en que se apartó del dictamen jurídico. Quien
  resuelve la denuncia por la camioneta tiene, según esa misma nota, una mayoría de origen
  oficialista. No es un hecho que deba entrar en la declaración (es sobre la Jutep, no sobre lo
  que dijo Orsi), pero el editor debería tenerlo presente al evaluar si "en las manos de ellos
  estamos" describe un control genuinamente independiente.
- cita_de_contexto: "Ante el señalamiento de que en otros casos la mayoría oficialista de la
  Jutep (Ferraris y Asti) se apartó del informe jurídico y adoptó una resolución distinta a la
  que sugerían los profesionales de la Junta, la presidenta respondió: 'Cuando uno se aparta de
  un dictamen jurídico tiene que hacerlo en forma fundada...'"
  (https://www.subrayado.com.uy/presidenta-la-jutep-el-caso-orsi-voy-votar-acuerdo-derecho-conforme-derecho-n1014314)
- accion_sugerida: si el editor escribe análisis sobre esta declaración, considerar citar la
  composición de la Jutep como contexto (no como acusación: es información pública sobre cómo
  se integra el organismo).

### declaraciones[4]-[8] — 2026-06-01 — mensaje en video ("Por reunir las condiciones de
seguridad...", "El valor de la operación está registrado...", "Pude acceder al nuevo auto...",
"La elección del eléctrico usado...", "Si algún organismo de contralor considera...")
- severidad: aviso
- tipo: contexto_omitido (fuente disponible y no usada)
- objecion: las cinco citas están verificadas literalmente en ambito e infobae (grupos
  `grupo-ambito` y `grupo-infobae`, genuinamente independientes: no son un copia, cada nota
  parafrasea y ordena distinto, y solo coincide donde ambas transcriben al pie de la letra). No
  hay error de cita. Pero las cinco son transcripciones de un mismo video que Presidencia
  "grabó y difundió" ese día; no encontré que el investigador haya buscado el video original
  (en `gub.uy` o el canal de YouTube de Presidencia). De existir, subiría estas cinco
  declaraciones de `reportado` a `textual` (video con marca de tiempo), que es fuente primaria
  preferida por el propio brief (regla 4) y evita apoyarse en la regla de dos grupos para algo
  que en rigor es una sola alocución cubierta por dos medios.
- cita_de_contexto: "El presidente de la República, Yamandú Orsi, brindó su versión sobre la
  polémica... al tomar la palabra en un video grabado y difundido desde la Presidencia de la
  República." (https://www.ambito.com/uruguay/me-hare-cargo-yamandu-orsi-dio-mas-detalles-la-camioneta-que-compro-un-polemico-descuento-us-25000-n6283937)
- accion_sugerida: buscar el video en gub.uy/presidencia o YouTube/Presidencia Uruguay del
  2026-06-01 y, si aparece, re-registrar estas cinco declaraciones como `nivel: textual` con
  `marca_tiempo`.

### declaraciones[9] — 2026-06-02 — "Para finalizar, pido disculpas si mi proceder ofendió o
lesionó los intereses de algún individuo o colectivo..."
- severidad: aviso
- tipo: sin_objecion (cita) + mismo punto que [4]-[8]
- objecion: cita literal y completa en infobae, incluido el cierre ("Muchas gracias") que el
  registro omite razonablemente por no ser parte de la declaración sustantiva. `_faltante:
  segunda_fuente` correctamente marcado (es el cierre del mismo video de Presidencia, cubierto
  solo por infobae con estas palabras exactas). Se resolvería igual que [4]-[8]: si aparece el
  video original, esta declaración pasa a `textual` con una sola fuente primaria suficiente.
- cita_de_contexto: "El presidente uruguayo cerró su exposición con un pedido de disculpas.
  'Para finalizar, pido disculpas si mi proceder ofendió o lesionó los intereses de algún
  individuo o colectivo...'"
  (https://www.infobae.com/america/america-latina/2026/06/02/orsi-pidio-disculpas-por-la-camioneta-que-compro-con-25000-dolares-de-descuento-y-ofrece-pagar-la-diferencia-si-hubo-una-falta/)
- accion_sugerida: mismo que [4]-[8].

### declaraciones[10] — 2026-07-09 — "Lo resolvimos, por suerte lo resolvimos."
- severidad: aviso
- tipo: sin_objecion
- objecion: ninguna. Cita literal en subrayado e infobae (grupos distintos, cobertura
  genuinamente independiente: las dos notas transcriben con pequeñas variantes de puntuación
  propias de cada transcripción, no son copia una de otra, a diferencia de declaraciones[0]).
- cita_de_contexto: "'Lo resolvimos, por suerte lo resolvimos', dijo el presidente de la
  República Yamandú Orsi, al ser consultado por la prensa sobre la situación impositiva y de
  registro de obras de las dos casas familiares en Salinas, Canelones."
  (https://www.subrayado.com.uy/tenemos-que-prestarle-bastante-mas-atencion-estas-cosas-dijo-orsi-regularizar-obras-su-casa-y-pagar-deuda-primaria-n1012418)
- accion_sugerida: ninguna. Aviso menor: en la misma rueda de prensa Orsi también respondió
  "capaz que sí" cuando le preguntaron si el episodio impacta en su imagen; no está registrado
  y no hace falta que lo esté, pero el editor puede quererlo si busca una declaración más de
  autocrítica.

### declaraciones[11] — 2026-07-09 — "Tengo que tener más cuidado..."
- severidad: aviso
- tipo: sin_objecion
- objecion: ninguna. Verificado igual que [10].
- cita_de_contexto: "'Tengo que tener más cuidado, por supuesto', reconoció ante los
  periodistas. 'Tenés que estar atento...'"
  (https://www.infobae.com/america/america-latina/2026/07/13/orsi-regularizo-obras-y-pago-una-deuda-tributaria-tras-la-polemica-por-sus-casas-debo-tener-mas-cuidado/)
- accion_sugerida: ninguna.

### declaraciones[12] — 2026-08-25 — "el respaldo a la ministra es absoluto, es 100%"
- severidad: aviso
- tipo: asimetria (dentro del lote, no del brief)
- objecion: la cita es literal en subrayado y montevideo-portal (grupos distintos, sin
  objeción de fidelidad). El problema no es esta declaración sino que es la única del lote que
  representa, con palabras de Orsi, el caso Cardama/Lazo (Caso 2), mientras que el investigador
  sí leyó con `pnpm fuente` un video de Presidencia del 2025-10-23 y una nota de ambito del
  2025-12-27 en los que Orsi habla extensamente y en primera persona sobre el mismo caso
  ("Decidí iniciar acciones para rescindir el contrato...", "hemos decidido hacer denuncia ante
  la justicia... porque hay fuertes indicios de que estaríamos ante una estafa o un fraude al
  Estado uruguayo"; "el gobierno se mantendrá 'firme'..."). Ninguna de esas dos fuentes generó
  una declaración. El resultado es que 12 de 13 declaraciones del lote son sobre el episodio de
  la camioneta (desfavorable) y solo 1 sobre Cardama, pese a que el material disponible sobre
  Cardama muestra a Orsi tomando una posición activa contra un presunto fraude. Ver más en
  "Objeciones al lote".
- cita_de_contexto: "Orsi aseguró que no leyó el contenido de la denuncia de los partidos
  Nacional, Colorado e Independiente, y afirmó que 'el respaldo a la ministra es absoluto, es
  100%'." (https://www.subrayado.com.uy/el-respaldo-la-ministra-es-absoluto-es-100-dijo-orsi-lazo-denuncia-la-coalicion-cardama-n1016262)
- accion_sugerida: agregar al menos una declaración con las palabras propias de Orsi del
  2025-10-23 (video, `tipo: video`, nivel potencialmente `textual`, ver
  https://www.youtube.com/watch?v=1Le_HmMv2OM — "Conferencia de prensa del presidente Yamandú
  Orsi y autoridades del Gobierno", ya está en el corpus con transcripción) o de la nota de
  ambito del 2025-12-27
  (https://www.ambito.com/uruguay/yamandu-orsi-aseguro-que-el-gobierno-se-mantendra-firme-contra-cardama-pese-la-posible-denuncia-del-astillero-n6228534).

### promesas[0] — "Fortalecer la JUTEP como organismo de contralor..."
- severidad: corregir
- tipo: un_solo_grupo
- objecion: `origen` cita mpp.org.uy (grupo `frente-amplio`) y subrayado (grupo
  `fontaina-de-feo`) como si fueran dos fuentes independientes de nivel `reportado`. Pero
  `content/medios/mpp.yaml`, ya commiteado, dice explícitamente: "no es un medio periodístico:
  es fuente primaria de lo que el candidato y su sector prometieron, y nunca cuenta como
  segunda fuente independiente" — el tratamiento simétrico de lacallepou-uy. Verifiqué que
  subrayado sí es cobertura periodística genuina y propia (no reproduce a mpp), así que la
  promesa tiene UNA fuente periodística válida, no dos. Mecánicamente el validador no lo
  detectará porque los slugs de grupo son distintos; conceptualmente la promesa está
  sub-corroborada. Esto se repite igual en promesas[1] y promesas[2], que comparten el mismo
  par de fuentes.
- cita_de_contexto: "No es un medio periodístico: es fuente primaria de lo que el candidato y
  su sector prometieron, y nunca cuenta como segunda fuente independiente."
  (content/medios/mpp.yaml, sección `propiedad.descripcion`)
- accion_sugerida: mantener mpp.org.uy como fuente primaria del texto exacto de la promesa (es
  insustituible para eso) pero marcar `_faltante: segunda_fuente` en las tres promesas, o
  buscar una segunda nota periodística genuinamente distinta de subrayado (el-observador,
  la-diaria y el-pais cubrieron el mismo acto de campaña con alta probabilidad).

### promesas[1] — "Regular donaciones anónimas, aportes de empresas privadas a partidos políticos."
- severidad: corregir
- tipo: un_solo_grupo
- objecion: mismo problema que promesas[0] (mpp + subrayado). Además, a diferencia de
  promesas[0] y promesas[2], esta promesa no tiene ningún `evidencias_candidatas`, pese a que
  `consultas.jsonl` registra una búsqueda específica que sí encontró resultados: "Orsi ley
  financiamiento partidos políticos donaciones anónimas 2025 2026 proyecto -> 8 resultados". No
  hay explicación en `notas.md` de por qué esos 8 resultados no produjeron ni una evidencia a
  favor, en contra o neutral, mientras que las otras dos promesas del mismo brief sí la tienen.
  Es una asimetría interna del lote, no necesariamente un error, pero no está documentada.
- cita_de_contexto: (consultas.jsonl) "Orsi ley financiamiento partidos políticos donaciones
  anónimas 2025 2026 proyecto -> 8 resultados"
- accion_sugerida: revisar esos 8 resultados y, si no hay nada publicable, decirlo
  explícitamente en notas.md (igual que se hizo con la ausencia de otros casos judiciales) en
  vez de dejar la promesa sin ningún seguimiento de cumplimiento.

### promesas[2] — "Limitar designaciones directas en el estado."
- severidad: corregir (por el mismo motivo de un_solo_grupo en `origen`); las
  `evidencias_candidatas` en sí no tienen objeción
- tipo: un_solo_grupo
- objecion: mismo problema de `origen` que promesas[0]. Las dos `evidencias_candidatas` sí
  están bien trabajadas y con simetría genuina: la ley 20.451 (a favor, documento oficial +
  busqueda) y el dato de la ONSC más el caso de Soriano (neutral, con el descargo de la
  intendencia incluido, no solo la denuncia de los ediles frenteamplistas). Verifiqué ambas
  fuentes y las citas son literales.
- cita_de_contexto: "La Intendencia de Soriano reaccionó a las acusaciones con un comunicado en
  sus redes sociales que asegura que las contrataciones se dan en 'estricto cumplimiento' de la
  normativa vigente..."
  (https://www.busqueda.com.uy/informacion/tras-la-ley-que-limita-designaciones-directas-intendenciaspersisten-tensiones-algunos-departamentos-esa-herramienta-n5414125)
- accion_sugerida: mismo que promesas[0] sobre `origen`.

### menciones[0] — 2026-05-30 — "La mejor forma de plantarse cuando uno tiene estas
dificultades es decir la verdad..."
- severidad: aviso
- tipo: sin_objecion
- objecion: cita literal y contigua en subrayado, correctamente atribuida como respuesta sobre
  la moto de Lacalle Pou. `_faltante: segunda_fuente` correcto: confirmé que ni ambito ni
  en-perspectiva tienen esta frase con las palabras de Orsi (en-perspectiva sí tiene, en la
  misma nota, una declaración de Fernando Pereira —no de Orsi— reconociendo que "el Frente
  Amplio se equivocó en su momento cuando criticó la compra de la moto" de Lacalle Pou, que es
  contexto compatible con lo que dice Orsi pero no es la misma persona hablando).
- cita_de_contexto: "'La mejor forma de plantarse cuando uno tiene estas dificultades es decir
  la verdad. Entonces, si ustedes revisan yo jamás critiqué esas cosas...', dijo Orsi al ser
  consultado sobre la moto que se compró Lacalle Pou cuando era presidente."
  (https://www.subrayado.com.uy/cuando-hay-descuentos-yo-me-tiro-cabeza-dijo-orsi-la-camioneta-que-compro-25000-dolares-descuento-n1009051)
- accion_sugerida: si el editor quiere reforzar el contexto de esta mención, puede citar (sin
  crear un nuevo registro con la voz de Orsi) que el propio presidente del Frente Amplio,
  Fernando Pereira, dijo en esos mismos días que el partido "se equivocó" al criticar la moto de
  Lacalle Pou (en-perspectiva, misma nota que declaraciones[1]/[4]).

## Casos judiciales (`notas.md` → `casos_vistos`)

El brief pide evaluar ambos casos contra el umbral "amplio" del proyecto: denuncia formal
presentada, investigación de Fiscalía, o acusación pública hecha por una persona identificable
en un medio.

### Caso 1 — Camioneta presidencial / denuncias ante la Jutep
- severidad: bloquea (para que entre como `content/casos/`, no para las declaraciones, que ya
  están bien cubiertas)
- objecion: las denuncias que dieron origen a la investigación de la Jutep son anónimas
  ("denuncias anónimas", confirmado en subrayado 2026-05-30, ambito 2026-06-01 y subrayado
  2026-08-03, donde Ferraris habla de "tres o cuatro" denuncias anónimas). No hay ninguna
  persona identificable que las haya formulado en un medio; el propio Orsi lo dice en su
  declaración ("por lo general llegan denuncias anónimas. No hay problema"). Esto falla la
  pata de "persona identificable" del umbral, y es distinto del precedente que ya existe en
  `content/casos/jutep-declaraciones-juradas-2026.yaml` (caso de Lacalle Pou): ahí el
  denunciante es un convencional nombrado, Esequiel Ibarra, del Partido Colorado, identificado
  en la nota. Esa es la diferencia real entre los dos casos, no el partido de la persona
  investigada. Además, los hechos de base todavía no están asentados: las fuentes leídas
  discrepan sobre qué vehículo se usó como parte de pago (caras-y-caretas 2026-05-27 y
  ambito/infobae 2026-06-01/02 dicen "un Hyundai modelo 2020 propiedad de Orsi"; caras-y-caretas
  2026-06-26 registra un pedido de informes del diputado Schipani sobre un "vehículo Renault"
  que habría sido omitido del mensaje de Orsi; subrayado 2026-08-03 describe una camioneta
  distinta, recibida como donación de una automotora durante la campaña y no adjudicada en una
  rifa). El propio `notas.md` de este lote no señala esta discrepancia entre fuentes.
- cita_de_contexto: "La Jutep recibió 'tres o cuatro' denuncias anónimas, recordó Ferraris,
  sobre presuntas irregularidades o faltas éticas en la compra que hizo Orsi de su camioneta..."
  (https://www.subrayado.com.uy/presidenta-la-jutep-el-caso-orsi-voy-votar-acuerdo-derecho-conforme-derecho-n1014314);
  "Esto se suma al pedido que había realizado el diputado colorado Felipe Schipani... cuando
  pidió datos sobre... 'se omitió toda referencia al vehículo Renault que fue entregado como
  parte de pago'." (https://www.carasycaretas.com.uy/sociedad/jutep-solicito-presidencia-mas-informacion-la-camioneta-orsi-n96850)
- accion_sugerida: no promover como `content/casos/` todavía. Recomiendo que quede en
  `hipotesis/` (tarea del editor, no mía) hasta que ocurra una de estas dos cosas: (a) la Jutep
  resuelve el expediente (con lo que deja de depender del origen anónimo de la denuncia para
  justificar su existencia como caso, igual que si un fiscal actuara de oficio), o (b) surge una
  acusación pública de una persona identificable (ya existe un antecedente cercano: el pedido de
  informes de Felipe Schipani, con nombre y cargo, en un medio — si se convierte en una denuncia
  formal ante la Jutep o Fiscalía, el umbral se cumple). Mientras tanto, lo que Orsi dijo sobre
  el episodio ya está bien documentado como declaraciones, que es el tratamiento correcto para
  algo que hoy es más bien "polémica pública + investigación administrativa en curso" que un
  caso judicial en el sentido del contrato de `CLAUDE.md`. Aclaro que la ausencia de resolución
  (desenlace) es un problema aparte, señalado por quien encargó esta crítica; incluso si la
  denuncia no fuera anónima, tampoco tendría desenlace documentado.

### Caso 2 — Denuncia penal de la oposición contra la ministra Sandra Lazo (caso Cardama)
- severidad: corregir (para entrar a `content/casos/`, sujeto a los puntos de abajo); no bloquea
- objecion: acá sí hay personas identificables: el diputado nacionalista Pablo Abdala nombró la
  denuncia y la caratuló ("delito de abuso de funciones", subrayado 2026-08-24); los diputados
  Sotelo, Schipani y Gianoli están nombrados desde mayo (el-observador 2026-05-08). Esto cumple
  la pata de "acusación pública hecha por persona identificable en un medio" del umbral, con el
  mismo criterio que ya se usó para el caso Lacalle Pou/Jutep (denunciante identificado, sin
  resolución, tier `probable`). Dos advertencias antes de tratarlo igual:
  1. Todas las fuentes leídas (subrayado 2026-08-24 y 2026-08-25, la búsqueda web que hice para
     verificar el estado posterior) usan tiempo futuro o de intención: "resolvieron presentar
     una denuncia penal", "denunciará". No encontré, ni en el corpus ni buscando después del
     2026-08-25, confirmación de que la denuncia haya sido efectivamente presentada ante
     Fiscalía a la fecha de esta corrida (2026-09-04). Si a esa fecha seguía siendo un anuncio
     de intención y no una denuncia presentada, la etapa `denuncia` del esquema (`estado_judicial[]`)
     todavía no correspondería estrictamente; el editor debería verificarlo con `pnpm fuente`
     antes de asignar esa etapa.
  2. El caso concierne a la ministra Lazo, no a Orsi. Sandra Lazo no existe hoy como `politico`
     ni como `referente` en `content/` (verifiqué `content/politicos/` y `content/referentes/`):
     habrá que crear el registro correspondiente o usar el rol que el esquema prevea para un
     jerarca no presidencial. El rol de Orsi en este caso es "mencionado" (respalda a su
     ministra públicamente, no está indagado ni acusado), igual que Lacalle Pou en el caso
     Jutep-declaraciones-juradas.
- cita_de_contexto: "El diputado del Partido Nacional, Pablo Abdala, dijo este lunes que la
  denuncia contra Lazo es por un 'delito de abuso de funciones'."
  (https://www.subrayado.com.uy/nos-encontramos-donde-quieran-lazo-respondio-decision-coalicion-denunciarla-penalmente-cardama-n1016148)
- accion_sugerida: antes de promover, verificar con `pnpm fuente` si la denuncia fue
  efectivamente presentada (no solo anunciada) a la fecha de publicación, y documentar el rol de
  Lazo en `content/referentes/` o el mecanismo que corresponda. Para la simetría del caso de
  fondo (no de esta denuncia puntual): el contrato con Cardama y la garantía irregular fueron
  decisión del Ministerio de Defensa de la gestión de Lacalle Pou (ministro Javier García,
  2023); ya está anotado como pista en
  `/Users/santiago/Documents/GitHub/la-casta-corpus/pistas/lacalle-pou.yaml`, correctamente,
  para que se documente en la corrida de Lacalle Pou. La nota de infobae del 2025-10-23
  (https://www.infobae.com/america/america-latina/2025/10/23/uruguay-rescinde-contrato-con-astillero-espanol-cardama-por-patrullas-oceanicas-hay-indicios-de-estafa/)
  dice explícitamente "El anuncio del gobierno apunta contra una decisión que tomó la
  administración de Luis Lacalle Pou": es la misma nota que sirve de fuente favorable para Orsi
  acá y debería servir de fuente para el tramo correspondiente del lado de Lacalle Pou, no solo
  quedar como pista de segunda mano.

## Objeciones al lote

1. **Peso relativo del episodio de la camioneta.** De 13 declaraciones, 12 son sobre la
   camioneta o temas patrimoniales adyacentes (Primaria/obras, error en la declaración jurada) y
   solo 1 sobre Cardama. Encontré que esto no es enteramente un reflejo del volumen real de
   cobertura: el investigador leyó con `pnpm fuente` una nota (ambito, 2025-12-27) y tenía
   disponible en el corpus un video de Presidencia (2025-10-23) donde Orsi habla extensamente en
   primera persona sobre Cardama, y ninguna de las dos produjo una declaración (ver
   declaraciones[12] arriba). Esto no invalida el lote —Orsi efectivamente habló mucho más sobre
   la camioneta que sobre Cardama en el período, y el episodio de la camioneta generó una
   cronología de una semana con múltiples ruedas de prensa— pero sí significa que el desbalance
   es mayor de lo que tenía que ser, porque se dejó afuera material ya leído que hubiera
   equilibrado el registro sin salir a buscar nada nuevo.
2. **Dependencia de subrayado.** De los 20 artículos de prensa que leí para esta crítica,
   subrayado es fuente única o co-fuente en 9. No hay alineamiento declarado para subrayado
   (`sin_datos`), así que no es un problema de sesgo editorial documentado, pero si en el futuro
   se etiqueta su alineamiento, vale la pena que el editor revise si esta corrida quedó atada a
   un solo medio para buena parte de la cronología del episodio.
3. **Copia entre medios (declaraciones[0]).** Ya señalado arriba: es el mismo patrón de riesgo
   que el brief pidió vigilar (recorte/pegado de citas), aplicado a la regla de dos fuentes en
   vez de a la cita misma.

## Objeciones al brief

El brief de esta corrida (sección 6) agrega una frase que no está en el brief de la corrida de
referencia de Lacalle Pou (`data/corridas/2026-09-04-lacalle-pou-transparencia-corrupcion/brief.md`,
sección 6): "Simetria obligatoria en casos... Un caso sin su desenlace documentado no se
publica." El brief de Lacalle Pou pide documentar casos con el mismo espíritu ("no califiques,
no concluyas: eso es del editor") pero no incluye esa frase explícita ni la palabra "simetría".
En la práctica esto no benefició ni perjudicó a ninguno de los dos políticos: el precedente ya
promovido a `content/casos/jutep-declaraciones-juradas-2026.yaml` (Lacalle Pou) entró a tier
`probable` sin desenlace, con una sola denuncia identificada y sin resolución — exactamente el
tipo de caso que la frase nueva, leída en sentido estricto, dejaría afuera. No es una instrucción
que pida tratar a un político distinto de otro (no viola la Regla 0 en el sentido de pedir
asimetría a favor o en contra de una persona), pero es una inconsistencia de plantilla entre
corridas del mismo tema: el criterio real que se aplicó a Lacalle Pou fue más permisivo en su
formulación escrita que el que se le escribió a este investigador. Lo señalo para que, si la
frase nueva refleja un estándar mejor (documentar desenlaces con el mismo rigor que las
acusaciones — me parece un buen estándar), se aplique parejo hacia adelante y, si corresponde,
también hacia atrás sobre los casos ya promovidos de Lacalle Pou, no solo hacia Orsi de acá en
más.

No encontré, más allá de este punto de plantilla, ninguna instrucción del brief que pida
seleccionar, omitir o encuadrar información a favor o en contra de Orsi o de otro político. La
sección 1 y la regla 1 del brief piden expresamente cubrir "favorable o desfavorable,
consistente o contradictorio" y "lo consistente (`sin_cambio` sirve)", y el investigador
efectivamente registró declaraciones que no tienen carga negativa (promesas de campaña,
declaraciones[10] y [11] con autocrítica pero sin escándalo).

## Cobertura

No incluyo aquí `mpp.org.uy` (sitio de campaña de un sector del propio Orsi, explícitamente no
periodístico según su propio registro en `content/medios/`) ni las páginas de `gub.uy`
(documento oficial, no nota de prensa). Las 20 notas de prensa que efectivamente leí con
`pnpm fuente` o desde el archivo del corpus en esta sesión:

```yaml
- medio: montevideo-portal
  url: https://www.montevideo.com.uy/Noticias/-Cuando-usted-vea--Orsi-hablo-sobre-la-camioneta-que-compro-con-US-25-000-de-descuento-uc963282
  fecha: 2026-05-26
  evento: "propuesto:camioneta-orsi-2026"
  politico: orsi
  tono: neutral
  justificacion: >-
    Reporta el descuento y la respuesta de Orsi de forma factual e incluye la crítica del
    senador Sebastián da Silva sin adoptarla como propia.

- medio: caras-y-caretas
  url: https://www.carasycaretas.com.uy/sociedad/la-camioneta-la-polemica-orsi-mostro-factura-y-entrego-vehiculo-como-forma-pago-n95840
  fecha: 2026-05-27
  evento: "propuesto:camioneta-orsi-2026"
  politico: orsi
  tono: neutral
  justificacion: >-
    "Desde el entorno presidencial confirmaron que en la operación existió una 'rebaja o
    descuento' por ese monto", reporte factual que da lugar a la explicación de Presidencia.

- medio: en-perspectiva
  url: https://enperspectiva.uy/en-perspectiva-programa/la-mesa/el-presidente-yamandu-orsi-dijo-que-no-se-equivoco-al-recibir-un-descuento-en-la-compra-de-su-camioneta/
  fecha: 2026-06-01
  evento: "propuesto:camioneta-orsi-2026"
  politico: orsi
  tono: neutral
  justificacion: >-
    Presenta preguntas abiertas para el análisis ("¿La oposición encontró un flanco real o está
    sobredimensionando el episodio?") en vez de tomar posición.

- medio: subrayado
  url: https://www.subrayado.com.uy/cuando-hay-descuentos-yo-me-tiro-cabeza-dijo-orsi-la-camioneta-que-compro-25000-dolares-descuento-n1009051
  fecha: 2026-05-30
  evento: "propuesto:camioneta-orsi-2026"
  politico: orsi
  tono: neutral
  justificacion: >-
    "La oposición lo cuestiona por aceptar este descuento y tras varias denuncias anónimas, la
    Junta de Transparencia y Ética Pública (Jutep) analiza si el presidente se apartó de la
    norma ética", reporte factual del estado del expediente.

- medio: ambito
  url: https://www.ambito.com/uruguay/yamandu-orsi-respondio-ironicamente-la-denuncia-la-camioneta-cuando-hay-descuentos-yo-me-tiro-cabeza-n6283306
  fecha: 2026-05-30
  evento: "propuesto:camioneta-orsi-2026"
  politico: orsi
  tono: neutral
  justificacion: >-
    Pese al título ("respondió irónicamente"), el cuerpo da espacio extenso a la defensa del
    prosecretario Jorge Díaz: "consideró que Orsi no incumplió el Código de Ética de la Función
    Pública".

- medio: ambito
  url: https://www.ambito.com/uruguay/me-hare-cargo-yamandu-orsi-dio-mas-detalles-la-camioneta-que-compro-un-polemico-descuento-us-25000-n6283937
  fecha: 2026-06-01
  evento: "propuesto:camioneta-orsi-2026"
  politico: orsi
  tono: neutral
  justificacion: >-
    Presenta ambos lados explícitamente bajo el subtítulo "El nudo ético": la defensa de Orsi y
    "la sospecha que se instaló en la oposición... argumentan los críticos".

- medio: infobae
  url: https://www.infobae.com/america/america-latina/2026/06/02/orsi-pidio-disculpas-por-la-camioneta-que-compro-con-25000-dolares-de-descuento-y-ofrece-pagar-la-diferencia-si-hubo-una-falta/
  fecha: 2026-06-02
  evento: "propuesto:camioneta-orsi-2026"
  politico: orsi
  tono: desfavorable
  justificacion: >-
    "Su primera salida pública tras la polémica... fue considerada una 'tomadura de pelo' por
    parte de dirigentes de la oposición", cita destacada temprano en la nota que enmarca el
    video de disculpas como reacción a esa crítica.

- medio: subrayado
  url: https://www.subrayado.com.uy/tenemos-que-prestarle-bastante-mas-atencion-estas-cosas-dijo-orsi-regularizar-obras-su-casa-y-pagar-deuda-primaria-n1012418
  fecha: 2026-07-09
  evento: "propuesto:patrimonio-orsi-2026"
  politico: orsi
  tono: neutral
  justificacion: >-
    "El presidente regularizó su situación luego que un informe periodístico revelara que
    debía..." — reporta el hecho y la regularización sin adjetivar.

- medio: infobae
  url: https://www.infobae.com/america/america-latina/2026/07/13/orsi-regularizo-obras-y-pago-una-deuda-tributaria-tras-la-polemica-por-sus-casas-debo-tener-mas-cuidado/
  fecha: 2026-07-13
  evento: "propuesto:patrimonio-orsi-2026"
  politico: orsi
  tono: desfavorable
  justificacion: >-
    "El presidente dijo que este tipo de controversias pueden impactar en la aprobación de su
    gestión (hoy fuertemente desaprobada por la ciudadanía según las encuestas)", vínculo
    explícito entre el episodio y la desaprobación de su gestión.

- medio: subrayado
  url: https://www.subrayado.com.uy/el-respaldo-la-ministra-es-absoluto-es-100-dijo-orsi-lazo-denuncia-la-coalicion-cardama-n1016262
  fecha: 2026-08-25
  evento: "propuesto:caso-cardama"
  politico: orsi
  tono: favorable
  justificacion: >-
    Cede el cierre de la nota, sin contrapunto, a la defensa del secretario de Presidencia:
    "Nosotros estamos muy tranquilos por el proceder del gobierno y, en particular, de la
    ministra".

- medio: montevideo-portal
  url: https://www.montevideo.com.uy/Noticias/Orsi-el-robo-al-BROU-no-es-modalidad-y-el-respaldo-absoluto-a-Lazo-por-Cardama-uc973027
  fecha: 2026-08-25
  evento: "propuesto:caso-cardama"
  politico: orsi
  tono: neutral
  justificacion: >-
    "Si bien el mandatario reconoció que no vio 'el contenido' de esa denuncia, aseguró que su
    respaldo a la ministra 'es absoluto'", reporte factual sin adjetivación propia.

- medio: subrayado
  url: https://www.subrayado.com.uy/frente-amplio-presento-los-principales-lineamientos-su-programa-foco-ejes-economico-social-y-seguridad-n957347
  fecha: 2024-09-16
  evento: elecciones-2024
  politico: orsi
  tono: neutral
  justificacion: >-
    Cobertura íntegramente descriptiva del discurso de campaña, sin valoración editorial.

- medio: busqueda
  url: https://www.busqueda.com.uy/informacion/tras-la-ley-que-limita-designaciones-directas-intendenciaspersisten-tensiones-algunos-departamentos-esa-herramienta-n5414125
  fecha: 2026-06-11
  evento: "propuesto:ley-designaciones-directas-2025"
  politico: partido-frente-amplio
  tono: neutral
  justificacion: >-
    Incluye tanto la denuncia de ediles frenteamplistas de Soriano como la respuesta de la
    intendencia asegurando "estricto cumplimiento" de la ley.

- medio: busqueda
  url: https://www.busqueda.com.uy/politica/un-error-la-declaracion-jurada-orsi-detectado-estudiantes-contabilidad-expuso-ausencia-controles-la-jutep-n5411964
  fecha: 2026-04-09
  evento: "propuesto:patrimonio-orsi-2026"
  politico: orsi
  tono: neutral
  justificacion: >-
    La Jutep califica el error como "circunstancial e involuntario" y la nota lo recoge, además
    de precisar que las declaraciones anteriores de Orsi como intendente eran "consistentes y
    correctas".

- medio: subrayado
  url: https://www.subrayado.com.uy/presidenta-la-jutep-el-caso-orsi-voy-votar-acuerdo-derecho-conforme-derecho-n1014314
  fecha: 2026-08-03
  evento: "propuesto:camioneta-orsi-2026"
  politico: orsi
  tono: neutral
  justificacion: >-
    Reportaje factual que agrega información nueva (el origen de la camioneta entregada como
    parte de pago) y cierra con la donación a la ANEP, sin editorializar.

- medio: caras-y-caretas
  url: https://www.carasycaretas.com.uy/sociedad/jutep-solicito-presidencia-mas-informacion-la-camioneta-orsi-n96850
  fecha: 2026-06-26
  evento: "propuesto:camioneta-orsi-2026"
  politico: orsi
  tono: neutral
  justificacion: >-
    Reporta el pedido de información de la Jutep y la pregunta pendiente del diputado Schipani
    sobre el vehículo Renault, en tono descriptivo.

- medio: el-observador
  url: https://www.elobservador.com.uy/nacional/pesquisa-y-usurpacion-funciones-oposicion-denunciara-sandra-lazo-y-asesores-defensa-caso-cardama-n6043237
  fecha: 2026-05-08
  evento: "propuesto:caso-cardama"
  politico: orsi
  tono: neutral
  justificacion: >-
    Da espacio extenso a la explicación de Lazo ("como es habitual en este tipo de situaciones",
    las firmas se demoraron por la burocracia estatal) junto con el reclamo opositor.

- medio: subrayado
  url: https://www.subrayado.com.uy/nos-encontramos-donde-quieran-lazo-respondio-decision-coalicion-denunciarla-penalmente-cardama-n1016148
  fecha: 2026-08-24
  evento: "propuesto:caso-cardama"
  politico: orsi
  tono: favorable
  justificacion: >-
    Cede el cierre íntegro y sin contrapunto al mensaje personal de Lazo: "en un lugar lejano de
    las sierras continuo recuperándome, rodeada de familia... Vuelvo con más energía y las
    mismas convicciones".

- medio: infobae
  url: https://www.infobae.com/america/america-latina/2025/10/23/uruguay-rescinde-contrato-con-astillero-espanol-cardama-por-patrullas-oceanicas-hay-indicios-de-estafa/
  fecha: 2025-10-23
  evento: "propuesto:caso-cardama"
  politico: orsi
  tono: favorable
  justificacion: >-
    "El anuncio del gobierno apunta contra una decisión que tomó la administración de Luis
    Lacalle Pou", encuadre que sitúa a Orsi denunciando una irregularidad heredada.

- medio: ambito
  url: https://www.ambito.com/uruguay/yamandu-orsi-aseguro-que-el-gobierno-se-mantendra-firme-contra-cardama-pese-la-posible-denuncia-del-astillero-n6228534
  fecha: 2025-12-27
  evento: "propuesto:caso-cardama"
  politico: orsi
  tono: neutral
  justificacion: >-
    Da voz extensa y sin matizar a la crítica opositora: "'Lo político por encima de lo
    jurídico está mal y además nos va a salir carísimo', sentenció [Javier García]".
```

Nota sobre simetría de este listado: la nota de infobae del 2025-10-23 (tono favorable hacia
Orsi) trata en el mismo texto una decisión de la gestión de Lacalle Pou de forma que, leída
desde ese lado, sería desfavorable ("El anuncio del gobierno apunta contra una decisión que tomó
la administración de Luis Lacalle Pou"). Es la misma nota, dos ángulos legítimos; el criterio de
tono que apliqué (cómo trata la nota al político de esta corrida, Orsi) es el mismo que debería
aplicarse, sobre la misma nota, en la corrida de Lacalle Pou.
