# Crítica — corrida 2026-09-09-caso-penades

Modelo: Opus 5 (`claude-opus-5[1m]`), que es el modelo que la tabla de `CLAUDE.md` asigna al crítico.
Lote: `inbox/penades/caso/2026-09-09/`
Registros revisados: 2 (`politicos.yaml` × 1, `casos.yaml` × 1 con 10 hitos de `estado_judicial`);
`chequeos.yaml`, `declaraciones.yaml`, `menciones.yaml` y `promesas.yaml` están vacíos.
Fuentes releídas con `pnpm fuente`: 20 (2 diarios de sesiones, 1 CV oficial, 1 ficha de
legislaturas, 15 notas de prensa del lote, 1 nota ajena al lote encontrada al buscar la segunda
fuente que falta).

**Resumen: 3 objeciones bloqueantes, 16 de corregir, 9 de aviso.** Bloqueantes: B1 (el hito de la denuncia afirma dos hechos que sus citas no sostienen, uno de ellos un trascendido anónimo en condicional), B2 (el hito del 14/5/2025 tiene dos grupos de medios que son un solo trabajo periodístico) y B3 (el hito del 22/8/2026 tiene un solo grupo, y ese medio no tiene propiedad identificable). El lote no puede pasar al editor
para `publicado` como está; sí puede pasar para trabajo, y el editor tiene con qué resolver casi
todo sin una segunda vuelta del investigador.

Lo que está bien y conviene decirlo, porque la ausencia de crítica también se audita: **las 20 citas
que releí son literales**, sin una sola paráfrasis ni recorte que cambie el sentido. Las dos
votaciones del Senado son efectivamente del diario de sesiones (los PDF de
`biblioteca.parlamento.gub.uy`), no de crónicas: el «31 en 31» del 7/6/2023 y el «29 en 29» del
11/10/2023 están en el texto, palabra por palabra. Ninguna víctima de identidad reservada aparece
identificada en los campos del registro, y el investigador se abstuvo de nombrar a Javier Viana
aunque dos de sus fuentes lo nombran, lo que es la decisión correcta. El manejo de la fecha de la
formalización (`notas.md`, hipótesis 2) es exactamente lo que corresponde: cita literal con el error
del medio, `fecha` propia correcta.

---

## Objeciones por registro

### politicos[0] — penades — ficha de Gustavo Carlos Penadés Etchebarne

#### P1. `mandatos[4]` (Senador 2020-2023): la fuente no dice el cargo

- severidad: **corregir**
- tipo: cita_fuera_de_contexto
- campo: `mandatos[4].fuentes[0].cita`
- objecion: La única fuente del mandato del que fue destituido dice, literal, «Legislatura XLIX
  (2020-2025) 03-03-2020 11-10-2023». **No dice «Senador de la República».** La ficha oficial
  `legislaturas-actuo` rotula el cargo en cuatro de sus seis filas y lo omite en dos: la de la
  Legislatura XLV y la de la XLIX. `notas.md` detectó la anomalía en la fila de la XLV y con buen
  criterio no la usó; la misma anomalía en la fila de la XLIX pasó inadvertida y sí se usó, y
  justamente para afirmar el cargo. Un lector que abra la fuente no va a encontrar ahí el cargo que
  la ficha afirma.
- cita_de_contexto: «Legislatura XLIX (2020-2025) / 03-03-2020 / 11-10-2023» — sin rótulo de cargo,
  frente a «Representante Nacional por el Lema PARTIDO NACIONAL - Legislatura XLVIII (2015-2020)»,
  que sí lo trae
  (https://parlamento.gub.uy/camarasycomisiones/legisladores/2901/legislaturas-actuo).
- accion_sugerida: Agregar como segunda fuente del mismo mandato la línea del CV oficial que **ya
  está citado en el lote**: «2020/ 25 Electo Senador de la República.»
  (https://parlamento.gub.uy/sites/default/files/personas/biografias/CVGPENADES2021.pdf). El mismo
  PDF trae además el encabezado «Actividades como Senador de la República (Período 2020/2025)». Como
  refuerzo primario está el diario de sesiones del 7/6/2023, que lo llama «al señor Senador Gustavo
  Penadés». Es un agregado de dos líneas, no una investigación nueva.

#### P2. `mandatos[1]`: el tramo 2000-2005 se afirma con más precisión que la fuente

- severidad: **corregir**
- tipo: contexto_omitido
- campo: `mandatos[1].hasta`
- objecion: El registro presenta un único mandato de diputado de `1995-02-15` a `2005-02-14` con dos
  fuentes. La primera (`legislaturas-actuo`) solo documenta la Legislatura XLIV, «15-02-1995
  14-02-2000». La segunda (el CV) dice «2000/04», no 2005. La fecha `2005-02-14` no está en ninguna
  cita: es una reconstrucción del calendario legislativo, razonable pero no citada. Fundir dos
  legislaturas en una fila también oculta que la segunda no tiene respaldo en el registro oficial de
  legislaturas, que es justamente lo que `notas.md` quería que el editor viera.
- cita_de_contexto: «2000/04 Relecto Representante Nacional (Diputado) por Montevideo»
  (https://parlamento.gub.uy/sites/default/files/personas/biografias/CVGPENADES2021.pdf).
- accion_sugerida: Partir en dos mandatos: XLIV con la fila oficial (1995-02-15 → 2000-02-14) y XLV
  con el CV, con `desde`/`hasta` a la precisión que el CV permite (`"2000"` / `"2004"`, que
  `FechaParcial` admite). Si el editor prefiere mantener la fila fundida, el tramo necesita
  `verificacion: manual`, como `notas.md` propone.

#### P3. `mandatos[0]` (Edil): `hasta` no coincide con su única cita

- severidad: **corregir**
- tipo: contexto_omitido
- campo: `mandatos[0].hasta`
- objecion: El registro pone `hasta: 1995-02-14`; la única cita dice «1990/94». El día exacto no
  está en ninguna fuente del lote.
- cita_de_contexto: «1990/94 Edil Departamental por Montevideo.»
  (https://parlamento.gub.uy/sites/default/files/personas/biografias/CVGPENADES2021.pdf).
- accion_sugerida: `hasta: "1994"` (o `"1995"`) con la precisión que la fuente permite, o una fuente
  de la Junta Departamental o la Corte Electoral que dé la fecha exacta.

#### P4. `estado_actual.salida`: la cita es la de la cuestión de orden, no la de la destitución

- severidad: **corregir** (imprescindible antes de publicar)
- tipo: cita_fuera_de_contexto
- campo: `estado_actual.salida.fuentes[0].cita`
- objecion: El 11/10/2023 el Senado votó **dos veces, las dos 29 en 29**. La primera votación fue la
  cuestión de orden planteada por la senadora Bianchi para tratar el asunto; la segunda, después de
  leerse el artículo 115 en sala, fue la que resolvió la remoción. El registro cita la **primera**
  para sostener `salida.tipo: destitucion`. El número es correcto y el hecho es correcto, pero la
  cita elegida no contiene la decisión que el campo afirma, y el pasaje que sí la contiene está un
  párrafo más abajo en el mismo PDF y termina con la palabra exacta.
- cita_de_contexto: «SEÑORA PRESIDENTA.- Si no se hace uso de la palabra, se va a votar si se aplica
  al hasta hoy senador Penadés lo establecido en el artículo 115, tal cual ha sido leído. (Se vota).
  –29 en 29. Afirmativa. UNANIMIDAD. Queda aprobada la destitución del exsenador Gustavo Penadés.»
  (https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescss/2023-10-11%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20SENADORES%20(0040).pdf).
- accion_sugerida: Reemplazar la cita por ese pasaje. Si se quiere conservar la secuencia completa,
  van las dos como dos fuentes de la misma URL (la página las agrupa por URL).

#### P5. `estado_actual.prision`: fecha no citada, lugar afirmado como vigente y un tramo sin cubrir

- severidad: **corregir**
- tipo: contexto_omitido
- campo: `estado_actual.prision` (`desde`, `lugar`, `fuentes`)
- objecion: Tres cosas en un mismo bloque. (a) `desde: 2023-10-10` no está en la única cita, que solo
  dice que ya estaba alojado. (b) `lugar` se afirma en presente, a setiembre de 2026, con una nota de
  octubre de 2023 como única fuente. (c) El propio registro documenta que entre el 5 y el 12 de
  febrero de 2025 la Justicia dispuso prisión domiciliaria total con tobillera, revocada después;
  el bloque describe una privación de libertad continua en un mismo lugar y no dice nada de eso. Y,
  sobre todo, el componente imprime «En prisión» con insignia roja y «Privado de libertad desde el…»
  sin decir en ningún lado que es **prisión preventiva** y que no hay sentencia. Sobre una persona
  sin condena, eso es exactamente lo que la ley 18.331 y el art. 336 CP piden cuidar.
- cita_de_contexto: «Penadés fue imputado el 10 de octubre de 2023 con prisión preventiva, por la
  presunta comisión de 22 delitos»
  (https://www.ambito.com/uruguay/revocaron-la-prision-domiciliaria-gustavo-penades-y-debera-volver-la-carcel-n6112937);
  «La Justicia mantuvo la prisión preventiva contra Gustavo Penadés por 180 días más»
  (https://www.subrayado.com.uy/justicia-resolvio-que-mauvezin-aguarde-el-juicio-arresto-domiciliario-nocturno-penades-continua-prision-n1004421).
- accion_sugerida: Poner en `lugar` que es prisión preventiva (p. ej. «Prisión preventiva, Unidad
  N.º 19 del Instituto Nacional de Rehabilitación (Florida)»), agregar las dos fuentes de arriba —
  la de 2026 sostiene la vigencia — y dejar el paréntesis de febrero de 2025 dicho en el `resumen`
  del caso, que ya lo trae.

#### P6. `cobertura.texto`: le cuenta al lector el proceso interno

- severidad: **corregir** (rompe `pnpm build`)
- tipo: presentacion
- campo: `cobertura.texto`
- objecion: El texto empieza con «Esta corrida investigó específicamente…», nombra «(pedido explícito
  del mantenedor, regla 12 de CLAUDE.md)» y cierra con «No se investigaron declaraciones… en esta
  corrida». Ese campo se imprime al lector en la sección «Qué se buscó y qué existe» de
  `/politicos/penades/`. `revisar:paginas` marca `/\b(en )?esta corrida\b/i` como
  `narracion-de-proceso`, que es error fatal en modo estricto: el build no pasa. Además es lo que la
  regla pide de fondo: el campo dice **qué hay y qué falta**, no quién lo pidió ni con qué regla.
- cita_de_contexto: el modelo a copiar está en el repo, en `content/politicos/barandiaran.yaml`:
  «…109 declaraciones con posición, sobre 480 diarios leídos. De los 110 días de suplencia que el
  Parlamento le atribuye en 2000-2004, 81 tienen fecha y cita; los 29 restantes no aparecen en
  ninguno de los 552 diarios…».
- accion_sugerida: Reescribirlo en esos términos. Algo como: «Se revisó el caso judicial por
  explotación sexual de menores con los diarios de sesiones del Senado del 7/6/2023 y del
  11/10/2023, la biografía oficial y la ficha de legislaturas de parlamento.gub.uy, y prensa de
  ocho medios de siete grupos entre marzo de 2023 y agosto de 2026. No hay todavía declaraciones,
  promesas de campaña, votaciones ni chequeos cargados de esta persona; sus intervenciones en sala
  entre 1995 y 2004 están en la Hemeroteca del Parlamento y no se leyeron.» Sin «corrida», sin
  «mantenedor», sin nombres de archivo.

#### P7. `fecha` de las fuentes de parlamento

- severidad: aviso
- tipo: presentacion
- campo: `mandatos[*].fuentes[*].fecha`
- objecion: Las cinco fuentes de `parlamento.gub.uy` llevan `fecha: 2026-09-09`, que es el día en que
  se bajaron, no el de publicación (para eso está `retrieved_at`, que trae el mismo valor). El CV es
  de 2021 (el propio nombre del archivo lo dice) y la ficha de legislaturas tiene captura de Wayback
  del 23/6/2025. En los dos diarios de sesiones sí está bien puesta.
- accion_sugerida: `fecha: "2021"` para el CV; para la ficha de legislaturas, la del snapshot o la
  que el sitio declare.

#### P8. Un cargo documentado que no está en la ficha

- severidad: aviso
- tipo: contexto_omitido
- campo: `mandatos`
- objecion: El CV oficial ya citado documenta «2001/02 Electo Presidente de la Cámara de
  Representantes». Presidir una cámara es un cargo público con fecha y fuente, y no figura.
- accion_sugerida: Que el editor decida si va como `mandato` o como nota; lo que no puede es quedar
  fuera sin que nadie lo haya mirado, teniendo la fuente ya leída en el lote.

#### P9. Sin objeción

- `nombre`, `nombre_corto`, `partido`, `alias`: sin adjetivos, sin calificativos, sin verbos de
  intención. Cumplen.
- `estado_actual.situacion: en_prision` y `salida.tipo: destitucion`: los dos valores del enum son
  los correctos según el diario de sesiones (una vez corregida la cita, P4).
- `mandatos[2]` y `mandatos[3]` (Senador 2005-2015, Diputado 2015-2020): las filas oficiales traen
  cargo, lema y fechas exactas y las citas las reproducen. Sin objeción, salvo la misma observación
  de forma que P2 sobre fundir XLVI y XLVII en una fila.

---

### casos[0] — penades-explotacion-sexual

#### B1. `estado_judicial[0]` (2023-03-29): dos hechos que ninguna de sus citas sostiene, y uno es un trascendido en condicional

- severidad: **bloquea**
- tipo: riesgo_legal
- campo: `estado_judicial[0].descripcion`
- objecion: La `descripcion` afirma tres hechos y las dos citas del hito solo sostienen uno (que
  Fiscalía actuaría de oficio). Los otros dos: (a) «el senador niega los hechos en una conferencia de
  prensa el mismo día» — la nota de Montevideo Portal, publicada esa mañana, dice que «brindará a
  las 11:00 de este miércoles una **declaración pública**», en futuro, y la cita elegida de El
  Observador no menciona la negativa; (b) «anuncia que la denunciará por difamación» — el cuerpo de
  la nota no dice que él lo haya anunciado: dice que, **según fuentes anónimas de su partido citadas
  por un tercer medio**, «presentaría» una demanda, en condicional. El titular de la nota sí lo pone
  en pasado, pero el titular no es la nota. Convertir un trascendido anónimo relevado por un tercero
  en un acto afirmado de una persona nombrada es la definición de lo que el umbral de casos manda a
  `hipotesis/`, y es riesgo de real malicia.
- cita_de_contexto: «Tras la publicación del reportaje, el senador oficialista decidió tomar cartas
  en el asunto. Según fuentes de su partido citadas por el matutino El País, Penadés presentaría
  contra Papasso una demanda por difamación. Además, brindará a las 11:00 de este miércoles una
  declaración pública.»
  (https://www.montevideo.com.uy/Noticias/Penades-anuncio-demanda-a-Romina-Celeste-ella-se-adelanto-en-redes-y-presento-imagenes-uc849595).
- accion_sugerida: Dos caminos, los dos baratos. (1) Bajar la `descripcion` a lo que las citas
  sostienen y decir el condicional con su cadena de atribución: «…según fuentes de su partido
  citadas por El País, presentaría una demanda por difamación». (2) Mejor: sostener la negativa con
  la cita que ya existe en la misma nota de El Observador y que el lote no recogió — «En su
  declaración, Penadés negó las acusaciones de Romina Celeste y dijo que se trataba de…»
  (https://www.elobservador.com.uy/nota/fiscalia-actuara-de-oficio-por-la-acusacion-de-romina-celeste-contra-penades-202332915498).
  Es agregar una fuente más de la misma URL. Y cambiar «conferencia de prensa» por «declaración
  pública», que es lo que las fuentes dicen.

#### B2. `estado_judicial[5]` (2025-05-14): dos grupos de medios que son un solo trabajo periodístico

- severidad: **bloquea**
- tipo: un_solo_grupo
- campo: `estado_judicial[5].evidencia.fuentes`
- objecion: El validador va a contar dos grupos (`fontaina-de-feo` y `montevideo-comm`) y a dar el
  hito por bueno. No lo es: la nota de Montevideo Portal **se acredita a la de Subrayado y le copia
  la cita del abogado**. Es el caso de «una copia de agencia en varios diarios cuenta como uno» que
  la regla nombra, con la agencia reemplazada por otro medio. El hito, en los hechos, tiene una
  fuente.
- cita_de_contexto: «Según informó Subrayado (Canal 10), las personas habían declarado ante Fiscalía
  de manera anticipada… “En cada caso es distinto, en cada víctima es distinto. Hay víctimas en las
  que se repetía la conducta. Se le imputaron nuevos delitos dentro del mismo modus operandi”, dijo
  el abogado defensor Juan Raúl Williman… **al citado medio**.»
  (https://www.montevideo.com.uy/Noticias/-Mismo-modus-operandi--Penades-fue-imputado-por-delitos-contra-cuatro-nuevas-victimas-uc923888).
- accion_sugerida: Buscar una segunda fuente independiente de la ampliación del 14/5/2025 (la diaria,
  El País, El Observador, Búsqueda o Caras y Caretas cubrieron el caso ese año). Si no aparece, el
  hito queda con una fuente y arrastra al caso entero a `probable`; lo que no corresponde es dejarlo
  como si tuviera dos.

#### B3. `estado_judicial[9]` (2026-08-22): un solo grupo, y sin propiedad identificable

- severidad: **bloquea** (para `publicado`; en `probable` el validador solo avisa)
- tipo: un_solo_grupo
- campo: `estado_judicial[9].evidencia.fuentes` y `_faltante: segunda_fuente`
- objecion: El investigador marcó el faltante, que es lo correcto. Dos precisiones que el `_faltante`
  no dice. Primero: el estado actual de la causa — el dato más sensible del registro, el que le dice
  al lector si hay o no sentencia — cuelga de un único medio cuya propia ficha
  (`content/medios/prensa-mercosur.yaml`) declara que «no se encontró fuente que identifique a una
  persona o empresa propietaria». Segundo: **la segunda fuente existe y es legible**. La busqué.
  Caras y Caretas (grupo `editora-caras-y-caretas`, distinto) publicó el 24/7/2026 una nota sobre la
  misma etapa de control de acusación y sobre el mismo planteo de caducidad, con texto completo.
- cita_de_contexto: «La Justicia rechazó el planteo de la defensa del exsenador nacionalista Gustavo
  Penadés para excluir del juicio oral a cuatro víctimas cuyos casos, según los abogados del
  imputado, no fueron denunciados dentro del plazo previsto por la legislación vigente al momento de
  los hechos. La resolución fue adoptada este jueves por la jueza del caso, Marcela Vargas, durante
  una nueva audiencia de control de acusación.»
  (https://www.carasycaretas.com.uy/sociedad/caso-penades-rechazan-excluir-cuatro-victimas-presunta-caducidad-las-denuncias-n97688).
- accion_sugerida: Sumar esa nota como segunda fuente y, si conviene, fechar el hito el 2026-07-24
  (inicio documentado del control de acusación con resolución) y dejar el 2026-08-22 como un hito
  aparte con las dos fuentes que tenga. Respuesta directa a la pregunta del encargo: **con lo que
  hay hoy el hito no puede ir a `publicado`, y no hace falta dejarlo fuera** — sacarlo no cambiaría
  la `etiqueta_legal` (el hito anterior también es `formalizacion` ⇒ `formalizado`), pero le sacaría
  al lector lo único que le dice en qué está la causa hoy. Con la nota de Caras y Caretas el
  problema desaparece; sin ella, el hito se queda y el caso entero va a `probable`.

#### C1. `resumen`: 2.632 caracteres en un solo párrafo

- severidad: **corregir** (rompe `pnpm build`)
- tipo: presentacion
- campo: `resumen`
- objecion: `CasoCard.astro` imprime el resumen como un único `<p>{c.resumen}</p>`; no lo parte en
  párrafos. `revisar:paginas` marca error fatal por encima de 1.500 caracteres y aviso por encima de
  800. Los cuatro resúmenes ya publicados en `content/casos/` miden 1.192, 1.491, 1.472 y 960
  caracteres: este sería el primero en romper la regla, y por casi el doble. Y el punto 6 de la lista
  de presentación pide análisis de menos de unas 350 palabras con el veredicto primero. Hoy el dato
  que más le importa al lector — «no hay sentencia» — está en la última línea del cuarto párrafo,
  detrás de 2.500 caracteres.
- accion_sugerida: Recortar a ~1.200 caracteres poniendo primero el estado (imputado, en prisión
  preventiva, acusación fiscal presentada, sin sentencia al 9/9/2026) y llevando el detalle de cada
  etapa a la `descripcion` del hito que le corresponde, que es donde el lector ya lo va a encontrar.
  El desglose de los 22 delitos se repite tres veces entre resumen y citas: alcanza una.

#### C2. `estado_judicial[7]` (2025-10-08): una explicación atribuida a la Fiscalía que ninguna cita del lote trae

- severidad: **corregir**
- tipo: contexto_omitido
- campo: `resumen` (paréntesis del cuarto párrafo)
- objecion: El resumen dice «(el número y la tipificación de los delitos varió respecto de la
  formalización, **según explicó la Fiscalía**, por una reclasificación jurídica y no por un cambio
  en los hechos)». Ninguna de las dos citas del hito dice eso, y la palabra «reclasificación» no
  aparece en ninguna de las dos notas. Infobae da una explicación pero es del periodista, no de la
  Fiscalía («hay una depuración de la causa»). Subrayado sí la atribuye a Fiscalía, pero en otros
  términos, y el lote no recogió ese pasaje. La frase «y no por un cambio en los hechos» no la dice
  nadie: es una conclusión del registro presentada como declaración de un organismo. Sobre este
  caso, esa frase es exculpatoria, y la regla es la misma en las dos direcciones.
- cita_de_contexto: «El director de Comunicación de Fiscalía, Javier Benech, explicó a Subrayado que
  en el caso de Penadés hubo una variación en la tipificación de los delitos y pasó de 11 a 10
  delitos de retribución o promesa de retribución, además se entendió que el delito de corrupción de
  menores está incluido en el resto de los delitos.»
  (https://www.subrayado.com.uy/fiscal-delitos-sexuales-pidio-una-condena-16-anos-carcel-el-exsenador-gustavo-penades-n989734).
- accion_sugerida: Extender la cita de Subrayado para incluir ese pasaje y reescribir el paréntesis
  con las palabras de Benech («una variación en la tipificación»), borrando «y no por un cambio en
  los hechos».

#### C3. `estado_judicial[2]` (2023-10-10): «con prisión preventiva» no está en las citas, y una de ellas dice lo contrario

- severidad: **corregir**
- tipo: contexto_omitido
- campo: `estado_judicial[2].descripcion` y `evidencia.fuentes[*].cita`
- objecion: La `descripcion` dice «formaliza a Penadés **con prisión preventiva**». La cita de Ámbito
  no lo sostiene y el cuerpo de esa nota, escrito ese mismo día, dice que todavía se estaba
  discutiendo. La cita de Búsqueda tampoco lo menciona (sí lo dice el cuerpo, en una frase que el
  lote no recogió). El hecho es cierto y está sobradamente documentado; lo que falta es la cita.
- cita_de_contexto: «El exsenador del Partido Nacional podría ir ahora a prisión preventiva, según lo
  solicitado por la fiscal Alicia Ghione… Por estas horas, continúan discutiéndose las medidas
  cautelares que serán aplicadas a los dos imputados del caso.»
  (https://www.ambito.com/uruguay/gustavo-penades-fue-imputado-multiples-delitos-abuso-sexual-menores-n5843122);
  «Deberá cumplir 180 días de prisión preventiva en el mismo lugar en donde está recluido el
  excustodio presidencial Alejandro Astesiano»
  (https://www.busqueda.com.uy/Secciones/Once-victimas-y-22-delitos-enviaron-a-la-carcel-a-Gustavo-Penades-el-parlamentario-mas-influyente-del-gobierno-uc58572).
- accion_sugerida: Extender la cita de Búsqueda para que incluya los 180 días de preventiva. Nota al
  margen para el editor: Ámbito enumera seis categorías que suman 21 y titula 22; la enumeración
  completa (con desacato) es la de Búsqueda y la de Subrayado, y el resumen usa esa. Está bien
  resuelto.

#### C4. Las apelaciones de la defensa no están en ningún hito

- severidad: **corregir**
- tipo: contexto_omitido
- campo: `estado_judicial[3]`, `[6]`, `[9]` (`descripcion`)
- objecion: Tres de las fuentes ya citadas informan que la defensa apeló, y ninguno de los hitos lo
  registra ni dice en qué terminó. La regla de casos es explícita: los desenlaces se buscan con el
  mismo rigor que las acusaciones. Un caso que enumera diez decisiones en contra del imputado y
  ninguno de sus recursos está contando la mitad, y esa mitad está en las notas que el lote ya leyó.
- cita_de_contexto: «Las defensas apelaron la decisión de la jueza Marcela Vargas»
  (https://www.montevideo.com.uy/Noticias/Justicia-extendio-prision-preventiva-por-180-dias-a-Penades-por-existir-riesgo-procesal--uc884909);
  «Esto fue apelado por la defensa.»
  (https://www.montevideo.com.uy/Noticias/Penades-fue-imputado-por-un-nuevo-delito-un-hecho-de-violencia-privada-ocurrido-en-2014-uc934543);
  «La discusión ya fue llevada a un Tribunal de Apelaciones, por lo que algunos de estos planteos
  todavía no tienen una resolución definitiva.»
  (https://prensamercosur.org/2026/08/22/caso-penades-la-familia-cuestiona-las-audiencias-privadas-y-reclama-que-el-proceso-judicial-sea-publico/).
- accion_sugerida: Agregar la apelación a la `descripcion` de cada hito, con el desenlace si consta y
  «sin resolución pública conocida» si no. El hito del 2026-08-22 tiene que decir que hay planteos
  pendientes en el Tribunal de Apelaciones: hoy dice «rechazados hasta ahora por la jueza», que es
  cierto pero incompleto en el sentido que perjudica al imputado.

#### C5. La posición del acusado no está en el registro

- severidad: **corregir**
- tipo: asimetria
- campo: `resumen`
- objecion: La única aparición de la defensa en todo el registro es la negativa de marzo de 2023 (y
  ver B1, que no está citada). Tres fuentes del lote traen su posición sostenida en el tiempo y una
  cuarta la de su familia, y ninguna se recogió. Esto no es «dar equilibrio»: es la regla de que un
  caso se documenta en las dos direcciones, la misma que se aplicó en `astesiano.yaml` cuando se dejó
  escrito que Lacalle Pou «nunca fue imputado ni indagado en esta causa».
- cita_de_contexto: «al llegar, Penadés aseguró “no tener miedo a nada” y volvió a insistir en su
  inocencia»
  (https://www.ambito.com/uruguay/gustavo-penades-fue-imputado-multiples-delitos-abuso-sexual-menores-n5843122);
  «Desde allí, ha expresado que es inocente.»
  (https://www.infobae.com/america/america-latina/2025/10/09/fiscalia-uruguaya-pide-16-anos-de-prision-para-el-ex-senador-gustavo-penades-acusado-de-explotacion-sexual-de-menores/).
- accion_sugerida: Una oración en el `resumen`: que se declaró inocente en la audiencia de
  formalización y que sostiene esa posición, con esas dos fuentes. No hace falta más.

#### C6. Siete de diez hitos dicen «Formalización» y cinco no son formalizaciones

- severidad: **corregir**
- tipo: presentacion
- campo: `estado_judicial[*].etapa`
- objecion: El enum tiene seis valores y ninguno cubre «prórroga de la medida cautelar», «revocación
  de la domiciliaria», «acusación fiscal» ni «control de acusación», así que el investigador los
  puso todos como `formalizacion`. El resultado es una línea de tiempo en la que el lector lee siete
  veces la misma etiqueta para siete cosas distintas, y en la que la acusación fiscal —el hecho más
  importante después de la formalización— aparece rotulada igual que una prórroga administrativa. El
  precedente del repo es el contrario: en `astesiano.yaml` las salidas transitorias y la libertad
  anticipada se dejaron fuera del `estado_judicial` justamente por no ser etapas del enum, y se
  explicaron en `notas_internas`.
- accion_sugerida: Que el editor decida entre dos criterios y lo aplique parejo a todos los casos:
  (a) el criterio Astesiano, dejar en `estado_judicial` solo denuncia, investigación, las tres
  formalizaciones o ampliaciones reales (2023-10-10, 2025-05-14, 2025-08-27) y el estado actual, y
  contar las medidas cautelares en el `resumen`; o (b) mantenerlos todos, con la `descripcion`
  empezando por lo que realmente se resolvió («Prórroga de la prisión preventiva…», «Acusación
  fiscal…»), para que la etiqueta repetida no sea lo único que el lector ve. Si el criterio (b) se
  adopta, conviene proponer un valor `medida_cautelar` o `acusacion` en `EtapaJudicial`, porque este
  no va a ser el último caso largo.

#### C7. La línea de tiempo judicial se dibuja como lista vertical, no como línea de tiempo

- severidad: **corregir**
- tipo: presentacion
- campo: componente `src/components/CasoCard.astro` (no es un campo del registro)
- objecion: `CasoCard` imprime `estado_judicial` como un `<ol class="caso-hitos">` con un renglón por
  hito. Con cuatro hitos (Astesiano) eso se lee; con diez, repartidos en tres años y medio y con
  siete etiquetas iguales, es lo que el punto 13 de la lista de presentación llama «una lista
  vertical de decenas de renglones iguales» y el punto 8 pide resolver con una ayuda visual:
  `LineaTiempo.astro`, eje de tiempo real, punto por hito, tarjeta al pasar el cursor. Este caso es
  el primero del sitio que lo hace evidente. `revisar:paginas` no lo va a atrapar (su regla de lista
  repetida exige ocho ítems que empiecen igual en los primeros 30 caracteres, y acá la fecha los
  diferencia), así que si no se objeta acá no lo objeta nadie.
- accion_sugerida: Pasar `estado_judicial` por `LineaTiempo.astro` con el tipo de etapa como leyenda
  filtrable, y dejar el detalle en la tarjeta del punto y en las fuentes plegadas, sin repetirlo en
  una lista debajo (punto 16, `duplicado-tras-visual`).

#### C8. La etiqueta `formalizado` no lleva el aviso de «no hay condena» que sí lleva `denuncia`

- severidad: **corregir**
- tipo: presentacion / riesgo_legal
- campo: componente `src/components/EstadoStepper.astro`
- objecion: El stepper muestra una caja de aviso explícita cuando la etiqueta es `denuncia` («no hay
  condena… ninguna autoridad judicial resolvió responsabilidad») y otra cuando es
  `cerrado_sin_condena`. Para `formalizado` no muestra ninguna: solo una insignia amarilla. Este es
  el primer caso del sitio en el que el político es el `imputado` (los cuatro publicados son
  `bajo_su_mando` o `mencionado`), y la página va a mostrar diez hitos judiciales, una pena
  solicitada de 16 años y «En prisión» en rojo en la ficha de la persona, sin una sola línea que
  diga que no hay sentencia salvo el final del resumen. El stepper marca el paso de cierre con «○»,
  que es correcto pero es un círculo.
- accion_sugerida: Agregar a `EstadoStepper` la caja equivalente para `formalizado`: «Estado:
  formalizado — hay imputación y proceso en curso; no hay sentencia». Es una condición más en el
  mismo componente y vale para todos los casos futuros, de cualquier partido.

#### C9. Una segunda persona nombrada, por el título de una fuente

- severidad: **corregir**
- tipo: riesgo_legal
- campo: `estado_judicial[6].evidencia.fuentes[1].titulo`
- objecion: `notas.md` fundamenta con cuidado que se nombre a una sola persona además del acusado, y
  el `resumen` cumple. Pero la página imprime los títulos de las fuentes, y el título de la nota de
  Subrayado del 27/8/2025 nombra a dos: «…defensa accederá parcialmente a celulares de Romina
  Celeste y **Paula Díaz**». Paula Díaz no está cubierta por la justificación de `notas.md` y el
  cuerpo de esa nota la vincula, además, con una causa penal distinta.
- cita_de_contexto: «los celulares de las dos mujeres trans, que fueron incautados en el marco de la
  causa por una denuncia falsa radicada por Díaz contra el hoy presidente Yamandú Orsi que terminó
  con Papasso presa»
  (https://www.montevideo.com.uy/Noticias/Penades-fue-imputado-por-un-nuevo-delito-un-hecho-de-violencia-privada-ocurrido-en-2014-uc934543).
- accion_sugerida: `titulo` es opcional en el esquema de `Fuente`. O se omite en esa fuente (la de
  Montevideo Portal del mismo hito ya da el titular sin nombres), o `notas.md` extiende la
  justificación a Paula Díaz con la constancia de que también es denunciante pública identificada.
  La decisión es del editor, pero tiene que ser una decisión y no un descuido de un campo.

#### C10. Ningún documento oficial en todo el caso, con la búsqueda a medio hacer

- severidad: **corregir**
- tipo: documento_previsible
- campo: `estado_judicial[*].evidencia.fuentes` (tipos)
- objecion: De las 19 fuentes del caso, 18 son notas de prensa y una es diario de sesiones (el
  desafuero). Ninguna etapa judicial tiene documento oficial. `notas.md` explica que el índice de
  comunicados de Fiscalía se renderiza por JavaScript y que `WebSearch` con `site:gub.uy` no dio
  nada, y ahí se detuvo. Pero `consultas.jsonl` muestra que `pnpm inventario` —que es exactamente la
  herramienta para esto, y que el propio `CLAUDE.md` describe como la que se corre «antes de decir
  que un documento no existe»— se corrió tres veces y las tres contra
  `biblioteca.parlamento.gub.uy`. Contra `fiscalia.gub.uy`, contra `gub.uy` y contra
  `bjn.poderjudicial.gub.uy` no se corrió nunca; «bjn» y «jurisprudencia» no aparecen una sola vez
  en las 75 consultas, aunque el brief los lista como fuente número dos. Los documentos son
  previsibles: hay resoluciones interlocutorias de un juzgado penal, una acusación fiscal presentada
  en octubre de 2025 y resoluciones de un Tribunal de Apelaciones.
- accion_sugerida: Antes de cerrar el lote: `pnpm inventario fiscalia.gub.uy --desde 2023` y
  `pnpm inventario gub.uy --filtro fiscalia --desde 2023` (el índice CDX de Wayback ve los PDF que
  la página JS esconde), y una pasada por `bjn.poderjudicial.gub.uy`. Si después de eso no aparece
  nada, se dice en `notas.md` que se buscó con esa herramienta y no hay, que es una afirmación
  distinta de la actual. El mismo criterio que se le va a exigir al próximo caso de cualquier otro
  partido.

#### C11. Sin objeción

- `estado_judicial[1]` (2023-06-07, desafuero): la cita es literal y completa, incluye la firma de la
  comisión y el resultado «31 en 31. Afirmativa. UNANIMIDAD», y la `descripcion` reproduce con
  exactitud quién pidió qué (Juzgado de 36.º Turno, comunicado por la Suprema Corte, artículo 114).
  `nivel: textual` con `diario_de_sesiones` es la clasificación correcta. Es el mejor hito del lote.
- `estado_judicial[4]` (2025-02-12), `[8]` (2026-04-06): dos grupos reales e independientes, citas
  literales, `descripcion` ajustada a lo que las fuentes dicen. Sin objeción propia más allá de C4.
- `involucrados[0].rol: imputado`: correcto según el enum y según los hechos.
- `tipo: delito_grave`, `temas`, `eventos`: correctos.
- Orden ascendente de `estado_judicial` y ausencia de `etiqueta_legal` y `revision`: correctos —
  la etiqueta la deriva el validador (`formalizado`) y el tier lo pone el editor.
- Ninguna víctima de identidad reservada está identificada en ningún campo del registro, ni por
  nombre, ni por iniciales, ni por edad, ni por lugar. Se verificó contra las cuatro fuentes que sí
  nombran a denunciantes (Montevideo Portal 15/5/2025 e Infobae 9/10/2025 nombran a Javier Viana;
  Subrayado y Montevideo Portal del 27/8/2025 nombran a dos más). El registro no los recoge. Cumple.

---

## Objeciones al lote

1. **Cobertura del período: completa y honesta.** Marzo de 2023 a agosto de 2026, diez hitos, sin
   huecos anuales. `notas.md` declara lo que no pudo leer (`grupormultimedio.com`) y por qué, en vez
   de omitirlo. Sin objeción.

2. **Diversidad de grupos, a nivel del lote: buena; a nivel de hito, con dos agujeros.** Ocho medios
   de ocho grupos distintos (`werthein-hochbaum`, `montevideo-comm`, `grupo-ambito`, `magnolio`,
   `fontaina-de-feo`, `cooperativa-la-diaria`, `grupo-infobae`, `prensa-mercosur`), más
   `estado-uruguayo`. Ningún grupo domina. Los dos agujeros son B2 (dos grupos que son un solo
   trabajo) y B3 (un solo grupo). Ninguno de los medios usados tiene `alineamiento` distinto de
   `sin_datos` salvo Caras y Caretas (`progresista`), que no está en el lote: es decir, no hay
   concentración de alineamiento, pero tampoco hay un medio con alineamiento declarado que sirva de
   contraste. Es un dato para el editor, no una objeción.

3. **Simetría dentro del registro: cumple en lo que se afirma, falla en lo que se omite.** Cada hito
   describe lo que resolvió la Justicia sin adjetivos ni verbos de intención, y el investigador
   evitó cargar la trama parapolicial y a los colaboradores condenados, que hubieran sido fáciles de
   sumar y habrían agravado el retrato sin agregar nada sobre el imputado. Eso está bien. Lo que
   falta es la otra dirección: las apelaciones (C4) y la posición sostenida del acusado (C5).

4. **Simetría de la colección: 4 a 1, y hay que decirlo.** Con este caso, `content/casos/` queda con
   cuatro registros que tocan al Partido Nacional (Astesiano, Marset, JUTEP-Lacalle Pou, Penadés) y
   uno que toca al Frente Amplio (Cardama-Lazo, con Orsi como `mencionado`). La Regla 0 no se
   satisface bajando este caso: se satisface corriendo la misma búsqueda, con el mismo umbral
   («denuncia formal presentada, investigación de Fiscalía, o acusación pública hecha por una
   persona identificable en un medio»), sobre figuras del Frente Amplio, del Partido Colorado, de
   Cabildo Abierto y del resto. La regla 12 impide que un agente lo haga sin pedido explícito, así
   que **es una decisión que solo el mantenedor puede tomar, y queda anotada acá como pendiente**.
   Mientras esa lista esté 4 a 1, la página de casos debería decir con qué criterio se eligieron los
   casos cargados, para que el desbalance se lea como cobertura y no como línea editorial.

5. **Compuerta humana: obligatoria.** La última etapa es `formalizacion` ⇒ `etiqueta_legal:
   formalizado` ⇒ caso sin resolución judicial. En tier `publicado` exige el hash del registro en
   `data/aprobaciones.json`, firmado por el mantenedor. Ningún agente lo hace y ningún agente corre
   `pnpm aprobar`. Aunque se resolvieran las tres objeciones bloqueantes, el caso no llega a
   `publicado` sin esa firma.

6. **Dos correcciones sobre contenido ya publicado que este lote habilita.** No son objeciones al
   lote; son consecuencias de haberlo hecho bien, y se pierden si no quedan escritas.
   - `content/eventos/caso-penades.yaml` dice «el 7 de junio de 2023 el Senado le quitó los fueros **a
     pedido de la Fiscalía**». El diario de sesiones que este lote incorporó dice que fue «Ante la
     solicitud del Juzgado Letrado de Primera Instancia en lo Penal de 36 Turno, comunicada por la
     Suprema Corte de Justicia a través del mensaje N° 11/2023». Es una corrección de tipo
     `cotejo_con_primaria`, y de paso cambia las dos fuentes de Wikipedia por el diario de sesiones.
   - El mismo evento tiene `casos: []`, `politicos: [lacalle-pou]` y una `notas_internas` que dice
     «Penadés no tiene registro propio en politicos/ todavía». Cuando este lote se promueva, las tres
     cosas quedan desactualizadas.

7. **Discrepancia registrada: una, contra Búsqueda** (`discrepancias.yaml`). Búsqueda fecha la
   formalización «el martes 9»; el diario de sesiones del 11/10/2023 fija que ese miércoles era 11
   (por el texto de la citación, del 10 de octubre, que convoca para «mañana miércoles 11») y que
   las veintidós imputaciones fueron «en el día de ayer». Es una diferencia de un día. En el mismo
   archivo dejé escritas las **tres diferencias que encontré y no registré** —una de Ámbito, una de
   Infobae y una de El Observador— con el motivo exacto en cada caso: ninguna tiene detrás un
   documento primario que decida, y un desacuerdo entre medios no es una discrepancia. Lo digo acá
   además de allá para que se vea que el umbral fue el mismo para los cuatro y que el que quedó
   registrado no es el del medio que menos gusta.

8. **Registros `cobertura`: 18** (`cobertura.yaml`), 16 neutrales y 2 desfavorables (Búsqueda
   11/10/2023 e Infobae 9/10/2025). El criterio está escrito en la cabecera del archivo y es el
   mismo para todos: solo se mueve el tono cuando el medio caracteriza a la persona **en su propia
   voz**, no cuando reproduce con atribución lo que argumentó una parte en una audiencia. Bajo ese
   criterio quedaron neutrales notas de contenido muy duro (La Diaria del 6/4/2026, Subrayado del
   14/5/2025) y también la que le da tribuna a la familia del acusado (Prensa Mercosur del
   22/8/2026). Las dos notas de Grupo R Multimedio no llevan registro porque no se pudo leer el
   cuerpo, y así está dicho.

---

## Objeciones al brief

**Ninguna objeción de Regla 0.** El brief pide documentar un caso judicial «en las dos direcciones
(acusación y desenlace)», prohíbe expresamente identificar víctimas, exige etapa y fecha por hito y
cierra con «el mismo rigor que se aplicó a Astesiano y Marset», que es la formulación correcta de la
simetría. No pide seleccionar, omitir ni encuadrar según partido ni persona. Coincido con `notas.md`
en que no hay nada que rechazar.

Dos observaciones que no son objeciones de Regla 0 pero sí de método:

- El brief ordena las fuentes «Fiscalía General de la Nación» primero y «Poder Judicial
  (bjn.poderjudicial.gub.uy para sentencias)» segundo, y el lote cerró sin haber corrido contra
  ninguno de los dos la herramienta que el propio repo declara obligatoria antes de afirmar que un
  documento no existe. Está en C10; lo repito acá porque el incumplido es el orden de fuentes del
  brief, no solo un campo.
- El brief dice «si el caso tiene condena firme, va a `publicado` sin compuerta; si hay etapas sin
  resolución, queda en `probable` hasta la firma». La segunda mitad merece una precisión: `probable`
  no requiere firma, y `publicado` con etiqueta `formalizado` sí. Tal como está redactado se puede
  leer que basta con esperar. No cambia nada de este lote, pero conviene que el próximo brief de
  casos lo diga como lo dice `CLAUDE.md`.

Sobre el modelo: corro en Opus, que es lo que la tabla de `CLAUDE.md` asigna al crítico y lo que la
regla 14 permite. No hay divergencia que reportar por el experimento en curso.

---

## Cobertura

Los 18 registros de tono, en YAML, están en `cobertura.yaml` de esta misma carpeta, con el criterio
de asignación escrito en la cabecera del archivo. Resumen: 16 `neutral`, 2 `desfavorable`, 0
`favorable`; nueve medios de nueve grupos; un solo evento (`caso-penades`) y un solo político
(`penades`).

## Discrepancias

Un registro en `discrepancias.yaml` de esta misma carpeta (Búsqueda, 2023-10-11, `dato_erroneo`),
con las tres diferencias descartadas y su motivo escritos en la cabecera del archivo.
