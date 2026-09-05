# Crítica — corrida 2026-09-05-vicepresidentes-eventos-cobertura

Modelo: claude-sonnet-5. Brazo barato del experimento: corro en Sonnet donde el rol declarado en
`.claude/agents/critico.md` es Opus. Es instrucción explícita del encargo recibido para esta
corrida, no una decisión mía; lo dejo dicho para el registro del experimento, tal como piden
`CLAUDE.md` y `EXPERIMENTO.md`.

Lote: inbox/vicepresidentes/eventos-y-cobertura/2026-09-05/
Registros revisados: 18 (12 `cobertura.yaml` + 6 `eventos.yaml`)

Nota de proceso: este lote es un rescate de trabajo de tres agentes encadenados (dos críticos que
escribieron los 12 registros de cobertura dentro de sus propios `critica.md`, y un investigador
que los rescató, creó las fichas de evento y dice haber verificado las 12 citas). El eslabón que
nadie había revisado todavía era el primero — los 12 registros de tono en sí — así que ahí puse el
foco, releyendo las 12 notas completas con `pnpm fuente`, no solo las citas ya elegidas.

`pnpm validar --inbox inbox/vicepresidentes/eventos-y-cobertura/2026-09-05` corre en 0 errores (228
registros, 9 avisos que son de simetría general del sitio, no específicos de este lote).

## Objeciones por registro — `cobertura.yaml`

### cobertura[0] — el-observador — 2022-12-07 — "El exvicepresidente de la República y actual embajador uruguayo en Perú, Luis Hierro López, aseguró que la destitución del presidente peruano Pedro Castillo era algo que 'se veía venir'"
- severidad: aviso
- tipo: sin_objecion
- objecion: Abrí la nota completa (2090 caracteres, la devuelve entera). Es una entrevista de opinión
  sobre un hecho internacional, sin ninguna otra voz que la contraste ni editorializado por El
  Observador. El tono `neutral` se sostiene: Hierro López habla en primera persona, sin que la nota
  lo elogie ni lo cuestione. La cita de la justificación es literal y contigua.
- cita_de_contexto: "El exvicepresidente de la República y actual embajador uruguayo en Perú, Luis
  Hierro López, aseguró que la destitución del presidente peruano Pedro Castillo era algo que 'se
  veía venir', dados los acontecimientos que venían sucediendo con los anteriores intentos de
  remoción." — https://www.elobservador.com.uy/nota/hierro-lopez-embajador-uruguayo-en-peru-sobre-destitucion-de-castillo-esto-se-veia-venir--2022127204735
- accion_sugerida: ninguna.

### cobertura[1] — el-observador — 2025-02-28 — "El ex vicepresidente y canciller, Rodolfo Nin Novoa, será el embajador uruguayo en Brasil durante el gobierno de Yamandú Orsi"
- severidad: aviso
- tipo: sin_objecion (con un matiz que sí importa para la simetría del lote, ver abajo)
- objecion: Abrí la nota completa (1350 caracteres, es la nota entera). Es exactamente el caso que
  pide chequear el encargo: "¿son favorables por cómo escribe el medio, o porque el hecho era una
  felicitación?". Acá la respuesta es las dos cosas a la vez, y hay que decirlo con precisión. El
  hecho es una designación sin controversia partidaria — a diferencia de Argimón y de Bustillo, acá
  no hay "cruce de bando" (Nin Novoa es frenteamplista y lo designa un gobierno frenteamplista), así
  que no había motivo estructural para que generara fricción interna. Pero además el propio medio
  eligió construir la nota entera alrededor de una única reacción, elogiosa, de un correligionario
  (Mario Bergara, FA), y usó esa cita como titular ('"Es una gran noticia para el país"'): eso sí es
  una decisión editorial, no solo un reflejo del hecho. No hay ninguna voz opositora ni crítica en
  toda la nota. El tono `favorable` se sostiene con lo que hay, pero conviene que quien lo lea sepa
  que el universo de reacciones citadas es de una sola persona.
- cita_de_contexto: "El candidato a la Intendencia de Montevideo y líder de su sector 'Fuerza
  Renovadora', Mario Bergara, celebró la noticia en su cuenta de la red social X: 'Con alegría
  recibo la noticia de que Rodolfo Nin será nuestro embajador en Brasil. Es una gran noticia para
  el país.'" — https://www.elobservador.com.uy/nacional/es-una-gran-noticia-el-pais-rodolfo-nin-novoa-sera-el-embajador-uruguay-brasil-n5987434
- accion_sugerida: buscar si hubo alguna reacción crítica a esta designación en otro medio del
  mismo día que esta nota no recoja (por ejemplo, desde la oposición o desde otro sector del FA);
  no encontré ninguna en el corpus con las búsquedas de `consultas.jsonl`, pero tampoco se buscó
  específicamente "críticas Nin Novoa embajador Brasil".

### cobertura[2] — el-observador — 2023-11-10 — "Murió Danilo Astori El exministro de Economía Danilo Astori murió este viernes a los 83 años de edad"
- severidad: aviso
- tipo: sin_objecion
- objecion: Abrí la nota completa (11648 caracteres, recortada a 6000 por ventana pero cubrí el
  tramo relevante con `--buscar`). Es un collage de mensajes de condolencia de figuras de todos los
  partidos — incluido un expresidente rival (Lacalle Herrera: "un hombre duro en la crítica, pero...
  en el momento que pasa al otro mundo uno tiene que detener toda crítica") y Sanguinetti ("una
  figura extraordinariamente relevante") — sin una sola voz crítica. Es el caso de manual que pide
  el encargo: favorable porque el género es necrológico, no porque El Observador tuviera una
  posición sobre Astori. Aplicaría el mismo criterio a la nota necrológica de cualquier político de
  cualquier partido, y de hecho el propio lote lo dice así.
- cita_de_contexto: "'Todo Nacional lamenta profundamente el fallecimiento de Danilo Astori, quien
  desarrolló una extensa carrera política en la que llegó a ser vice presidente de la República',
  señalaron en su cuenta de Twitter." — https://www.elobservador.com.uy/nota/murio-danilo-astori-exvicepresidente-y-ministro-de-economia-2023111012342
- accion_sugerida: ninguna.

### cobertura[3] — subrayado — 2023-10-25 — "El ministro de Relaciones Exteriores, Francisco Bustillo, envió una observación al embajador de Uruguay en Perú, Luis Hierro López"
- severidad: corregir
- tipo: cita_fuera_de_contexto / contexto_omitido
- objecion: Este es el hallazgo más concreto de la crítica. La `justificacion` del registro dice
  "La nota reporta **una sanción administrativa** contra él [...]". Abrí la nota completa (1801
  caracteres, es la nota entera) y dice exactamente lo contrario de lo que afirma la justificación:
  "La observación es un llamado de atención que el gobierno puede aplicar a un representante
  diplomático; la persona es notificada sobre la observación, **pero no implica una sanción**."
  Llamar "sanción administrativa" a algo que la propia nota define como "no es una sanción" afirma
  más de lo que la fuente sostiene — el tipo de exceso que el punto 5 del encargo pide bajar de
  nivel. No hay riesgo legal grave (no es una acusación sobre la persona, es la descripción de un
  mecanismo diplomático), pero si el registro sale publicado con esa palabra, un lector que abra la
  fuente va a encontrar que la nota la desmiente explícitamente.
  Además, con ese matiz en la mano, dudo que el tono deba quedar en `desfavorable`. La nota: (a)
  aclara que no es una sanción, (b) reproduce el tuit de Hierro López completo y textual, dándole
  la palabra en sus propios términos (no es una nota que lo censure, es una nota que lo cita), y
  (c) agrega una sola reacción crítica (la senadora Kechichian), sin acumular más voces en contra
  ni "cerrar" el texto con una condena. Comparado con las dos notas de Argimón (ver más abajo), que
  acumulan varias citas hostiles de su propio partido sin ninguna cita de defensa, esta nota sobre
  Hierro López es bastante más moderada. Con esa comparación de por medio, me parece más defendible
  `neutral` que `desfavorable` para esta nota específica, aunque reconozco que es un caso límite
  (una sola cita crítica, sin réplica, sí empuja hacia desfavorable).
- cita_de_contexto: "La observación es un llamado de atención que el gobierno puede aplicar a un
  representante diplomático; la persona es notificada sobre la observación, pero no implica una
  sanción." — https://www.subrayado.com.uy/bustillo-observo-al-embajador-hierro-lopez-sus-comentarios-elecciones-argentinas-n929393
- accion_sugerida: corregir la `justificacion` para que no diga "sanción administrativa" (decir
  "observación" o "llamado de atención", que es lo que dice la fuente); y reconsiderar el tono a
  `neutral` con la nueva justificación, o si se mantiene `desfavorable`, que sea explícitamente por
  "una sola voz crítica sin réplica", no por el peso de una sanción que no existió.

### cobertura[4] — montevideo-portal — 2025-01-17 — "el cargo que actualmente desempeña el exvicepresidente Luis Hierro López"
- severidad: aviso
- tipo: sin_objecion
- objecion: Nota completa (1815 caracteres). Trata la designación de Bustillo; menciona a Hierro
  López solo para ubicar el cargo que deja, sin valorar su gestión. El tono `neutral` se sostiene.
  De paso, esta misma nota es la que confirma que la decisión fue del gobierno **saliente** de
  Lacalle Pou ("la decisión de nombrar al excanciller como nuevo embajador del país sudamericano
  fue tomada a menos de dos meses de que se acabe el gobierno"), lo que valida la partición de
  eventos que hizo el investigador (ver eventos[4] y eventos[5] abajo).
- cita_de_contexto: "El gobierno propondrá que el exministro de Relaciones Exteriores Francisco
  Bustillo [...] sea designado en las próximas horas como nuevo embajador de Perú para ocupar el
  cargo que actualmente desempeña el exvicepresidente Luis Hierro López" — https://www.montevideo.com.uy/Noticias/Designaran-al-excanciller-Bustillo-como-embajador-en-Peru-en-lugar-de-Hierro-Lopez-uc912433
- accion_sugerida: ninguna.

### cobertura[5] — la-diaria — 2017-09-09 — "El vicepresidente Raúl Sendic le comunicó este sábado al Plenario del Frente Amplio su decisión de renunciar en forma indeclinable"
- severidad: aviso
- tipo: sin_objecion
- objecion: El extracto que devuelve `pnpm fuente` (812 caracteres) está cortado por paywall, pero
  cubre completa la cita usada y el párrafo que la rodea, que es puramente descriptivo ("Luego
  reafirmó esto en su cuenta de Twitter, y anunció que ya transmitió su decisión al presidente").
  No hay adjetivación. `neutral` se sostiene con lo que hay disponible.
- cita_de_contexto: "El vicepresidente Raúl Sendic le comunicó este sábado al Plenario del Frente
  Amplio su decisión de renunciar en forma indeclinable a la Vicepresidencia de la República." —
  https://ladiaria.com.uy/politica/articulo/2017/9/sendic-renuncio-en-forma-indeclinable-a-la-vicepresidencia-de-la-republica/
- accion_sugerida: ninguna.

### cobertura[6] — montevideo-portal — 2017-09-09 — "El vicepresidente informó la renuncia a su cargo al Plenario del Frente Amplio y presentó por escrito sus argumentos contra el informe del Tribunal de Conducta Política"
- severidad: aviso
- tipo: sin_objecion
- objecion: Nota completa (2084 caracteres). Incluye la autodefensa de Sendic ("Vengo aquí a
  renunciar. Se los digo acá, y no se los mando a decir por la prensa") y el comentario de Mujica,
  que es ambivalente, no hostil ("si había un error había que tomar medidas, pero no podían llegar
  a la ofensa, al aplastamiento"). Es un genuino equilibrio entre autodefensa y crítica moderada.
  `neutral` se sostiene.
- cita_de_contexto: "'A mí no me sorprendió para nada', manifestó el ex presidente José Mujica [...]
  'Si había un error había que tomar medidas, pero no podían llegar a la ofensa, al aplastamiento'"
  — https://www.montevideo.com.uy/Noticias/Sendic-renuncio-a-la-vicepresidencia-Mujica-anuncio-que-Topolansky-va-a-asumir-uc354114
- accion_sugerida: ninguna.

### cobertura[7] — el-observador — 2017-09-11 — "Sendic ha cumplido a cabalidad, con seriedad y con responsabilidad la función que le dio el pueblo uruguayo"
- severidad: aviso
- tipo: sin_objecion
- objecion: Nota completa (5199 caracteres). Reparte espacio real entre el elogio de Vázquez
  ("cumplido a cabalidad...", "valentía") y la crítica de la senadora Tourné ("es un golpe
  político"), además de otros ángulos neutrales (quién ocupa la vicepresidencia, la banca que gana
  el MPP). El propio Frente Amplio tuvo una voz crítica hacia Sendic en esta nota (Tourné) y aun así
  quedó balanceada por el elogio presidencial en la misma pieza — es la comparación útil para medir
  las dos notas de Argimón más abajo, donde no hay una voz de defensa equivalente. `neutral` se
  sostiene.
- cita_de_contexto: "'Sendic ha cumplido a cabalidad, con seriedad y con responsabilidad la función
  que le dio el pueblo uruguayo al elegirlo como vicepresidente'" — https://www.elobservador.com.uy/nota/las-consecuencias-de-la-renuncia-de-sendic-lo-que-se-sabe-hasta-ahora-201791115580
- accion_sugerida: ninguna.

### cobertura[8] — infobae — 2022-03-01 — "La exvicepresidenta de Uruguay Lucía Topolansky presentó este martes su carta de renuncia al escaño que ocupa en el Senado"
- severidad: aviso
- tipo: sin_objecion sobre el registro; contexto_omitido sobre un dato de la misma nota que no
  entró al registro (ya señalado por el propio investigador y correctamente no llevado a
  `discrepancias.yaml`)
- objecion: Nota completa (2532 caracteres), despacho de EFE, puramente factual. `neutral` se
  sostiene con la cita usada.
  Confirmo el hallazgo que ya traía `notas.md`: la misma nota dice "Topolansky, que fue
  vicepresidenta en el segundo mandato de Tabaré Vázquez (2005-2010 y 2015-2020)", lo cual es
  incorrecto — 2005-2010 fue el *primer* mandato de Vázquez (con Nin Novoa de vicepresidente); el
  segundo fue 2015-2020 (con Sendic y después Topolansky). Confirmo también que esto NO alcanza
  para `discrepancias.yaml`: revisé `content/politicos/vazquez.yaml` y sus fuentes para las fechas
  de mandato son las dos, exclusivamente Wikipedia — no hay ahí ni en ningún otro lugar de
  `content/` un `documento_oficial`, `diario_de_sesiones` o `video` que decida esta fecha, que es
  el requisito duro de la regla de discrepancias. La decisión de no registrar discrepancia, tomada
  por el investigador de este lote, es correcta.
- cita_de_contexto: "Topolansky, que fue vicepresidenta en el segundo mandato de Tabaré Vázquez
  (2005-2010 y 2015-2020) tras la renuncia de Raúl Sendic por un caso de corrupción" — https://www.infobae.com/america/agencias/2022/03/01/exvicepresidenta-uruguaya-topolansky-deja-el-miercoles-su-escano-en-el-senado/
- accion_sugerida: para poder registrar esto como discrepancia en el futuro, haría falta abrir con
  `pnpm fuente` un documento oficial que fije los períodos presidenciales de Vázquez — por ejemplo
  el acta de proclamación de la Corte Electoral (elecciones de 2004 y 2014) o el Diario de Sesiones
  de la Asamblea General del día de asunción (1/3/2005 y 1/3/2015). No lo busqué yo mismo con
  `pnpm fuente` en esta sesión (solo confirmé por búsqueda web que existen registros de la Corte
  Electoral sobre la proclamación de 2004), así que no corresponde que yo lo registre.

### cobertura[9] — infobae — 2025-05-30 — "Beatriz Argimón, la vicepresidenta de Uruguay durante el gobierno de Lacalle Pou, fue elegida por Orsi para ser la embajadora ante la Unesco"
- severidad: aviso
- tipo: sin_objecion
- objecion: Abrí la nota completa (4207 caracteres). Confirma el patrón que describe la
  justificación: el senador Da Silva la ridiculiza ("pasó de ser protestante a católico para
  quedarse en París") y la senadora Bianchi la despacha como "un problema menos" para el partido;
  no hay una sola cita de defensa de Argimón, de otro dirigente nacionalista o del propio gobierno
  de Orsi explicando la designación. A diferencia del caso de Sendic (cobertura[6] y [7]), donde
  la crítica interna del propio espacio político estuvo balanceada por una defensa en la misma
  pieza, acá no hay balance. El tono `desfavorable` se sostiene por cómo está armada la nota
  (a quién cita, a quién no), no solo porque el hecho generara roces.
  Un dato relevante para la simetría del lote, no para este registro puntual: la misma nota cubre
  en paralelo la designación de Carolina Ache (Partido Colorado, no vicepresidenta, fuera del
  alcance de este lote) con el mismo patrón — críticas de su propio partido (Bordaberry, Da Silva)
  sin réplica —, lo que sugiere que el patrón "controversia interna sin defensa" es un rasgo de
  cómo Infobae cubrió esta categoría de noticia (designaciones cruzadas de partido) ese día, no
  una cobertura reservada para el Partido Nacional.
- cita_de_contexto: "Graciela Bianchi, otra senadora de este partido, dijo que ya le había advertido
  a sus compañeros de esta noticia. 'Tenemos un problema menos en el Partido Nacional para
  resolver', señaló." — https://www.infobae.com/america/america-latina/2025/05/30/yamandu-orsi-designo-a-beatriz-argimon-vicepresidenta-de-lacalle-pou-como-embajadora-de-uruguay-ante-la-unesco/
- accion_sugerida: ninguna sobre el registro. Como contexto para el editor: buscar si Argimón o
  algún dirigente nacionalista respondió públicamente a estas críticas en otro medio del mismo
  período; no lo encontré en esta sesión, pero tampoco hice esa búsqueda específica.

### cobertura[10] — el-observador — 2025-10-15 — "La Cámara de Senadores aprobó en la noche del martes la venia para designar a la nacionalista Beatriz Argimón"
- severidad: aviso
- tipo: sin_objecion, con un matiz que vale la pena que el editor conozca
- objecion: Abrí la nota completa (3087 caracteres). El resultado de la votación fue 24 a favor
  sobre 27 posibles — una aprobación amplia, con solo tres votos en contra (dos del propio Partido
  Nacional, uno colorado) — y la nota también menciona que hubo reparos iniciales de dos senadores
  frenteamplistas (Andrade, González), es decir que la controversia no fue exclusivamente interna
  del Partido Nacional. Pero el desarrollo real de la nota, en extensión, es casi todo la crítica
  extensa de Bianchi (varias oraciones, incluida una entrevista aparte citada: "operó con el Frente
  Amplio", "falta ética que invalida cualquier tipo de consentimiento"), sin una cita que ponga en
  valor la aprobación amplia o defienda la designación. El tono `desfavorable` se sostiene porque
  la nota, tal como está escrita, le da mucho más espacio a la censura que al hecho neutral/positivo
  de que la venia se aprobó por amplia mayoría — eso es una elección de armado de la nota, no un
  reflejo obligado del resultado de la votación.
- cita_de_contexto: "La senadora Graciela Bianchi había expresado en reiteradas ocasiones que
  Argimón 'operó con el Frente Amplio' durante el gobierno anterior." — https://www.elobservador.com.uy/nacional/senado-aprobo-la-venia-beatriz-argimon-la-unesco-y-este-miercoles-retoma-la-discusion-carolina-ache-n6020785
- accion_sugerida: ninguna sobre el registro. Vale que el editor sepa, si usa esta nota para algo
  más que el registro de tono, que la votación real fue 24-3 (aprobación amplia), un dato que la
  nota no destaca pese a ser, en términos institucionales, la noticia central del día.

### cobertura[11] — busqueda — 2025-02-15 — "Silvia Nane (en reemplazo de Carolina Cosse, que asume la vicepresidencia)"
- severidad: aviso
- tipo: sin_objecion sobre el tono; aviso sobre el `evento` asignado
- objecion: Nota completa (8292 caracteres, cubrí el tramo con `--buscar`). Es cobertura
  institucional extensa sobre la instalación del nuevo Parlamento (composición de bancadas,
  paridad de género, productividad legislativa); menciona a Cosse solo de paso, en una lista de
  senadores salientes, sin ningún juicio de valor. `neutral` se sostiene sin duda.
  El `evento: elecciones-2024` al que apunta es un evento ya existente (`content/eventos/`), no
  uno de los seis que crea este lote. Pero el rango de fechas de ese evento es `desde: 2024-10-27`
  / `hasta: 2024-11-24` (elección y balotaje), y esta nota es del 2025-02-15 — casi tres meses
  después del `hasta` del evento, sobre la instalación de la legislatura, no sobre la elección en
  sí. El esquema de `cobertura` no valida que la fecha de la nota caiga dentro del rango del
  evento (lo comprobé en `src/schemas/cobertura.ts` y `src/schemas/evento.ts`: no hay ese chequeo
  cruzado), así que esto no rompe nada mecánicamente, pero semánticamente el evento no cubre bien
  la fecha de la nota.
- cita_de_contexto: "El 1º de marzo, Sánchez también juramentará a la vicepresidenta Carolina
  Cosse y al presidente Yamandú Orsi" — https://www.busqueda.com.uy/politica/la-asuncion-del-nuevo-parlamento-los-detalles-del-inicio-la-legislatura-n5395889
- accion_sugerida: extender el `hasta` de `content/eventos/elecciones-2024.yaml` hasta el 1 de marzo
  de 2025 (asunción), o crear un evento aparte para "instalación de la nueva legislatura /
  transición 2025" que cubra el período 15/2 al 1/3/2025 y sirva de ancla común para cobertura de
  cualquier vicepresidente o legislador que asuma en esa fecha (el mismo período que ya señaló el
  crítico del lote 2015-2030 como una zona de vacancia formal de catorce días entre Legislatura y
  Ejecutivo).

## Objeciones por registro — `eventos.yaml`

### eventos[0] — crisis-politica-peru-2022
- severidad: aviso
- tipo: sin_objecion
- objecion: Fechas y cita coinciden con la nota completa de El Observador (verificada arriba en
  cobertura[0]). El resumen no afirma nada que la nota no sostenga.
- accion_sugerida: ninguna.

### eventos[1] — incidente-diplomatico-hierro-lopez-2023
- severidad: aviso
- tipo: sin_objecion
- objecion: El resumen usa "observación", no "sanción" — a diferencia de la `justificacion` de
  cobertura[3], acá el registro sí describe el mecanismo con la palabra correcta. Fechas (24 y 25
  de octubre de 2023) y cita coinciden con la nota completa de Subrayado.
- accion_sugerida: ninguna sobre este registro; la corrección de vocabulario que pide cobertura[3]
  es aparte y no contamina a este evento.

### eventos[2] — fallecimiento-danilo-astori-2023
- severidad: aviso
- tipo: sin_objecion
- objecion: Fecha y citas coinciden con la nota completa de El Observador (cobertura[2]). El
  resumen es estrictamente descriptivo (cargos, fecha, mensajes de reconocimiento
  interpartidarios) y no arrastra ninguna valoración.
- accion_sugerida: ninguna.

### eventos[3] — salida-topolansky-senado-2022
- severidad: aviso
- tipo: sin_objecion
- objecion: Fecha y cita coinciden con Infobae/EFE (cobertura[8]). El resumen no repite el error de
  la nota sobre los mandatos de Vázquez (no lo menciona), así que el evento en sí queda limpio de
  ese problema.
- accion_sugerida: ninguna.

### eventos[4] — intento-designacion-bustillo-embajador-peru-2025
- severidad: aviso
- tipo: sin_objecion — confirmo que la partición del investigador fue correcta
- objecion: Verifiqué las dos fuentes (montevideo-portal 17/1 y 24/1) completas. Las dos confirman,
  con cita literal, que la decisión de proponer a Bustillo fue del gobierno saliente de Lacalle
  Pou ("la decisión de nombrar al excanciller... fue tomada a menos de dos meses de que se acabe
  el gobierno") y que el retiro de la venia el 24/1/2025 se debió a la falta de apoyo tanto del
  Frente Amplio como de dos legisladoras coloradas (Carmen Sanguinetti y María Eugenia Roselló),
  no solo del FA. El resumen de este evento es preciso en los dos puntos. Si el investigador
  hubiera mantenido la fusión que proponía el crítico 1 original (etiquetar esto como parte de
  "designaciones del gobierno de Orsi"), habría sido un error de atribución real, no una cuestión
  de estilo: la fuente prueba que la iniciativa fue de Lacalle Pou, no de Orsi.
- accion_sugerida: ninguna.

### eventos[5] — designaciones-embajadores-orsi-2025
- severidad: corregir
- tipo: contexto_omitido (inconsistencia interna de fechas)
- objecion: El campo `hasta: 2025-10-15` no coincide con lo que dice el propio `resumen` del mismo
  registro: "el Senado aprobó su venia el 14 de octubre de 2025". Verifiqué que la votación fue,
  en efecto, la noche del martes 14 de octubre de 2025 (la nota de El Observador que lo confirma
  está fechada el miércoles 15, día de publicación, no de la votación). No es un error de fondo —
  las dos fechas están a un día de diferencia y ambas están respaldadas por la fuente— pero el
  evento debería usar la misma fecha en `hasta` que en `resumen`: o el 14 (fecha real del voto) o
  el 15 (fecha de la fuente que lo documenta), pero no las dos a la vez dentro del mismo registro.
- cita_de_contexto: "La Cámara de Senadores aprobó en la noche del martes la venia para designar a
  la nacionalista Beatriz Argimón" (nota fechada 15/10/2025, refiriéndose al martes 14) — https://www.elobservador.com.uy/nacional/senado-aprobo-la-venia-beatriz-argimon-la-unesco-y-este-miercoles-retoma-la-discusion-carolina-ache-n6020785
- accion_sugerida: cambiar `hasta` a 2025-10-14 para que coincida con el `resumen`, o corregir el
  `resumen` a "15 de octubre" si se prefiere anclar a la fecha de publicación de la fuente.

## Objeciones al lote

1. **El campo `tono` — la pregunta central del encargo.** Reabrí las 12 notas completas, no solo
   las citas ya elegidas. Once de los doce tonos se sostienen tal como están. El único que
   recomiendo cambiar es cobertura[3] (Hierro López, Subrayado): la `justificacion` describe como
   "sanción administrativa" algo que la propia nota dice explícitamente que no es una sanción, y
   con ese error corregido el caso para `desfavorable` se debilita — lo dejaría en `neutral`, o en
   `desfavorable` pero con una justificación honesta (una sola voz crítica, sin sanción real, sin
   réplica). Si se acepta ese cambio, el reparto de tono queda: **Partido Colorado 0 favorable / 3
   neutral / 0 desfavorable; Frente Amplio 2 favorable / 5 neutral / 0 desfavorable; Partido
   Nacional 0 favorable / 0 neutral / 2 desfavorable**. Eso concentra el 100% del tono desfavorable
   de todo el lote en un solo partido (Nacional, vía Argimón) y ninguno en los otros dos. Lo digo
   con toda claridad porque es exactamente el tipo de resultado que la Regla 0 obliga a mirar de
   cerca, no a esconder ni a maquillar en sentido contrario.

2. **Ese resultado no lo puedo explicar por sesgo de medios, con lo que tengo en esta corrida.**
   Comprobé los tres puntos que pide el encargo:
   - Los seis medios usados (el-observador, subrayado, montevideo-portal, infobae, la-diaria,
     busqueda) existen en `content/medios/` y pertenecen a seis grupos de propiedad distintos
     (werthein-hochbaum, fontaina-de-feo, montevideo-comm, grupo-infobae, cooperativa-la-diaria,
     magnolio). Ninguno tiene `alineamiento` partidario documentado (todos `sin_datos` o
     `independiente`). No hay concentración en un solo grupo ni en dos.
   - El mismo medio (El Observador, 5 de 12 registros) produjo la nota favorable de Nin Novoa, la
     favorable de Astori, Y la desfavorable de Argimón, además de dos neutrales de Hierro López y
     Sendic. Un solo medio generando tonos en las tres direcciones, sobre personas de los tres
     partidos, es evidencia en contra de que el reparto salga de un medio con una línea editorial
     fija.
   - El patrón "críticas del propio partido sin cita de defensa" que hace desfavorables a las dos
     notas de Argimón se repite, el mismo día y en la misma nota de Infobae, sobre Carolina Ache
     (Partido Colorado): es un patrón de cómo se cubre la categoría "designación política cruzada
     de partido", no un patrón reservado para el Partido Nacional.

3. **Pero la muestra no permite ir más allá de esa comprobación negativa.** Como ya dice
   `notas.md` del propio investigador, y coincido: estos 12 registros no son un relevamiento
   sistemático de cobertura de cada vicepresidente, son un rescate incidental de lo que dos
   críticos anteriores encontraron mientras revisaban fechas de mandato en fichas de identidad. No
   hay, dentro de este lote, un caso de una figura del Frente Amplio aceptando un cargo ofrecido
   por un gobierno de otro signo político para comprobar si generaría el mismo patrón de "crítica
   interna sin defensa" que Argimón y Ache. Busqué un precedente histórico equivalente (designación
   de un embajador identificado con un partido por un gobierno de otro partido, con polémica
   interna en su propio espacio) y no encontré un caso limpio y simétrico verificable con fuente
   abierta en esta sesión. Dejo esto como límite explícito del lote, no como conclusión: la
   ausencia de un caso simétrico no prueba ni descarta un sesgo de la prensa uruguaya en esta
   categoría de noticia; solo dice que estos 12 registros no alcanzan para decidirlo.

4. **Los 6 eventos son hechos, no categorías, y las fechas cierran con las fuentes citadas**, con
   la única excepción de la inconsistencia interna de un día en `designaciones-embajadores-orsi-2025`
   (ver eventos[5] arriba). La partición del evento de Bustillo, separándolo de las designaciones
   del gobierno de Orsi, es correcta y la verifiqué con las dos fuentes primarias de la propia
   designación y su retiro: fue una iniciativa del gobierno saliente de Lacalle Pou, no del
   entrante de Orsi, y el propio investigador lo documentó bien.

5. **Descarte correcto del candidato a discrepancia (Infobae / mandatos de Vázquez).** Confirmé
   que `content/politicos/vazquez.yaml` no tiene ninguna fuente `documento_oficial`,
   `diario_de_sesiones` o `video` para las fechas de sus dos mandatos presidenciales — solo
   Wikipedia, dos veces. Sin ese documento primario, la regla de discrepancias no permite registrar
   el error de Infobae ("segundo mandato de Tabaré Vázquez (2005-2010 y 2015-2020)", cuando
   2005-2010 fue su primer mandato). El investigador de este lote descartó bien; no escribo
   `discrepancias.yaml` porque tampoco yo abrí con `pnpm fuente` un documento que decida esto en
   esta sesión. Queda como pista para quien tenga a mano el acta de la Corte Electoral o el Diario
   de Sesiones de la asunción.

6. **Detalle menor de `notas.md`**: dice dos veces "los ocho vicepresidentes de esta corrida", pero
   los dos lotes de origen (2000-2015 y 2015-2030) cubren siete personas (Hierro López, Nin Novoa,
   Astori, Sendic, Topolansky, Argimón, Cosse), no ocho. No afecta ningún registro publicable —
   `notas.md` no se promueve a `content/` — pero lo señalo porque es del tipo de error de conteo
   que conviene no arrastrar a la próxima corrida sobre vicepresidentes.

## Objeciones al brief

Ninguna. El brief de esta corrida (`data/corridas/2026-09-05-vicepresidentes-eventos-cobertura/brief.md`)
pide expresamente contar el reparto de tono por partido y no maquillarlo si sale desparejo, y pide
cambiar cualquier tono que no se sostenga con la cita que el propio crítico anterior puso. Es,
literalmente, la instrucción de Regla 0 aplicada a este tipo de trabajo. No encontré ninguna
instrucción para omitir, suavizar o encuadrar por partido. El único ajuste que propongo (cobertura[3])
va en la dirección de mayor precisión frente a la fuente, no de favorecer a nadie: si la nota
hubiera dicho "sanción" cuando en realidad era una sanción y el registro la hubiera bajado a
"observación", objetaría exactamente igual.

## Cobertura

Emito acá mi propia lectura de tono de las 12 notas, para que quede el registro de un segundo
lector independiente sobre el mismo material (así es como se originó este mismo lote, a partir de
los `## Cobertura` de las dos críticas previas). Coincide con `cobertura.yaml` en 11 de 12; difiere
en la nota de Subrayado sobre Hierro López (cobertura[3]), por lo explicado arriba.

```yaml
- medio: el-observador
  url: https://www.elobservador.com.uy/nota/hierro-lopez-embajador-uruguayo-en-peru-sobre-destitucion-de-castillo-esto-se-veia-venir--2022127204735
  fecha: 2022-12-07
  evento: crisis-politica-peru-2022
  politico: hierro-lopez
  tono: neutral
  justificacion: >-
    Reporta la opinión de Hierro López sobre la destitución de Castillo sin ninguna otra voz que
    la contraste: "aseguró que la destitución del presidente peruano Pedro Castillo era algo que
    'se veía venir'".

- medio: el-observador
  url: https://www.elobservador.com.uy/nacional/es-una-gran-noticia-el-pais-rodolfo-nin-novoa-sera-el-embajador-uruguay-brasil-n5987434
  fecha: 2025-02-28
  evento: designaciones-embajadores-orsi-2025
  politico: nin-novoa
  tono: favorable
  justificacion: >-
    La nota entera, incluido el título, se construye sobre una única cita elogiosa de un
    correligionario, sin ninguna voz crítica: "'Con alegría recibo la noticia de que Rodolfo Nin
    será nuestro embajador en Brasil. Es una gran noticia para el país'".

- medio: el-observador
  url: https://www.elobservador.com.uy/nota/murio-danilo-astori-exvicepresidente-y-ministro-de-economia-2023111012342
  fecha: 2023-11-10
  evento: fallecimiento-danilo-astori-2023
  politico: astori
  tono: favorable
  justificacion: >-
    Necrológica que reúne elogios de dirigentes de todos los partidos sin ninguna crítica, incluido
    uno del propio Partido Nacional: "'Todo Nacional lamenta profundamente el fallecimiento de
    Danilo Astori'"; mismo criterio que se aplicaría a cualquier necrológica de cualquier político.

- medio: subrayado
  url: https://www.subrayado.com.uy/bustillo-observo-al-embajador-hierro-lopez-sus-comentarios-elecciones-argentinas-n929393
  fecha: 2023-10-25
  evento: incidente-diplomatico-hierro-lopez-2023
  politico: hierro-lopez
  tono: neutral
  justificacion: >-
    La propia nota aclara que el mecanismo aplicado "no implica una sanción", reproduce el tuit de
    Hierro López íntegro en sus propias palabras y agrega una sola voz crítica sin acumular más
    reacciones ni cerrar en condena.

- medio: montevideo-portal
  url: https://www.montevideo.com.uy/Noticias/Designaran-al-excanciller-Bustillo-como-embajador-en-Peru-en-lugar-de-Hierro-Lopez-uc912433
  fecha: 2025-01-17
  evento: intento-designacion-bustillo-embajador-peru-2025
  politico: hierro-lopez
  tono: neutral
  justificacion: >-
    Menciona a Hierro López solo para ubicar el cargo que deja, sin valorar su gestión: "el cargo
    que actualmente desempeña el exvicepresidente Luis Hierro López".

- medio: la-diaria
  url: https://ladiaria.com.uy/politica/articulo/2017/9/sendic-renuncio-en-forma-indeclinable-a-la-vicepresidencia-de-la-republica/
  fecha: 2017-09-09
  evento: caso-sendic
  politico: sendic
  tono: neutral
  justificacion: >-
    Relato puramente factual, sin adjetivación: "El vicepresidente Raúl Sendic le comunicó este
    sábado al Plenario del Frente Amplio su decisión de renunciar en forma indeclinable".

- medio: montevideo-portal
  url: https://www.montevideo.com.uy/Noticias/Sendic-renuncio-a-la-vicepresidencia-Mujica-anuncio-que-Topolansky-va-a-asumir-uc354114
  fecha: 2017-09-09
  evento: caso-sendic
  politico: sendic
  tono: neutral
  justificacion: >-
    Incluye la autodefensa de Sendic en el Plenario y el comentario ambivalente de Mujica ("no
    podían llegar a la ofensa, al aplastamiento"), sin inclinar la balanza.

- medio: el-observador
  url: https://www.elobservador.com.uy/nota/las-consecuencias-de-la-renuncia-de-sendic-lo-que-se-sabe-hasta-ahora-201791115580
  fecha: 2017-09-11
  evento: caso-sendic
  politico: sendic
  tono: neutral
  justificacion: >-
    Reparte espacio real entre el elogio de Vázquez ("ha cumplido a cabalidad, con seriedad y con
    responsabilidad") y la crítica de la senadora Tourné ("es un golpe político"), sin favorecer a
    ninguna de las dos lecturas.

- medio: infobae
  url: https://www.infobae.com/america/agencias/2022/03/01/exvicepresidenta-uruguaya-topolansky-deja-el-miercoles-su-escano-en-el-senado/
  fecha: 2022-03-01
  evento: salida-topolansky-senado-2022
  politico: topolansky
  tono: neutral
  justificacion: >-
    Despacho de agencia puramente factual: "presentó este martes su carta de renuncia al escaño
    que ocupa en el Senado y se hará efectiva este miércoles".

- medio: infobae
  url: https://www.infobae.com/america/america-latina/2025/05/30/yamandu-orsi-designo-a-beatriz-argimon-vicepresidenta-de-lacalle-pou-como-embajadora-de-uruguay-ante-la-unesco/
  fecha: 2025-05-30
  evento: designaciones-embajadores-orsi-2025
  politico: argimon
  tono: desfavorable
  justificacion: >-
    Cita dos reacciones despectivas de senadores de su propio partido ("pasó de ser protestante a
    católico para quedarse en París"; "tenemos un problema menos en el Partido Nacional para
    resolver") sin ninguna cita de defensa o explicación de la designación.

- medio: el-observador
  url: https://www.elobservador.com.uy/nacional/senado-aprobo-la-venia-beatriz-argimon-la-unesco-y-este-miercoles-retoma-la-discusion-carolina-ache-n6020785
  fecha: 2025-10-15
  evento: designaciones-embajadores-orsi-2025
  politico: argimon
  tono: desfavorable
  justificacion: >-
    Pese a que la venia se aprobó por amplia mayoría (24 a 3), la nota dedica la mayor parte de su
    extensión a la crítica extensa de la senadora Bianchi ("operó con el Frente Amplio"; "falta
    ética que invalida cualquier tipo de consentimiento") sin una cita que ponga en valor la
    aprobación ni defienda la designación.

- medio: busqueda
  url: https://www.busqueda.com.uy/politica/la-asuncion-del-nuevo-parlamento-los-detalles-del-inicio-la-legislatura-n5395889
  fecha: 2025-02-15
  evento: elecciones-2024
  politico: cosse
  tono: neutral
  justificacion: >-
    Cobertura institucional de la instalación del Parlamento que menciona a Cosse solo de paso, sin
    valoración: "Silvia Nane (en reemplazo de Carolina Cosse, que asume la vicepresidencia)".
```
