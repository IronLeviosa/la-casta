# Crítica — corrida 2026-09-09-senadores-49-50

Modelo: Opus 5 (claude-opus-5[1m])
Lote: inbox/senadores/todos/ (fusión de inbox/senadores/a-l/ y inbox/senadores/m-z/)
Registros revisados: 48 fichas de `politicos.yaml` (más `notas.md` y `asistencia.md`)

Documentos primarios abiertos en esta crítica con `pnpm fuente` (no citados de memoria):

- Diario de sesiones del Senado, sesión preparatoria del **15/02/2020** (0001)
- Diario de sesiones del Senado, sesión preparatoria del **15/02/2025** (0001)
- Diario del **14/04/2020** (0008), del **09/06/2020** (0017), del **08/07/2020** (0021),
  del **09/12/2020** (0042), del **01/11/2022** (0034) y del **11/03/2026** (0004)

---

## Resumen para el editor (lo que hay que leer sí o sí)

El censo del lote está construido sobre **la lista de quienes prestaron la promesa el día de la
sesión preparatoria**, y esa lista **no es la lista de titulares**. El contraejemplo está
documentado y es de la propia XLIX: **Danilo Astori era senador titular y no figura entre los 30
que juraron el 15/02/2020; quien juró ese día en su lugar fue su suplente, José Carlos Mahía**.
El lote carga a Mahía como titular de toda la XLIX y no carga el mandato de Astori. Todo lo demás
que sigue es menor al lado de esto.

En la L pasa lo simétrico por el otro extremo: el lote da la cobertura por completa y **faltan al
menos tres sucesiones de titulares posteriores a febrero de 2025**, una de ellas (Rodrigo Blás, por
la banca de Heber) nombrada literalmente en una fuente que el propio lote cita.

---

## Objeciones por registro

### mahia-jose-carlos — mandato «Senador 2020-02-15 → 2025-02-14»
- severidad: **bloquea**
- tipo: contexto_omitido
- campo exacto: `mandatos[0].cargo`, `mandatos[0].desde`, `mandatos[0].hasta`, `mandatos[0].fuentes`
- objecion: el registro afirma que Mahía fue **senador titular** los cinco años de la XLIX. El
  diario de sesiones del 14/04/2020 lo desmiente: Mahía era el **suplente de Danilo Astori** y
  entraba a sala cada vez que Astori pedía licencia. Que haya jurado el 15/02/2020 no lo vuelve
  titular: juró porque Astori no tomó la banca ese día. Aritmética que cierra el punto: el Frente
  Amplio tuvo 13 bancas en la XLIX, y los 13 nombres del FA que juraron el 15/02/2020 (Andrade,
  Bergara, Bonomi, Carrera, Cosse, Della Ventura, Kechichian, Lazo, **Mahía**, Olesker, Rubio,
  Topolansky, Mujica) más Astori dan 14. Uno de los 14 no es titular, y el diario dice cuál.
- cita_de_contexto: «A través de la presente solicito al Cuerpo me conceda licencia por el día de
  la fecha por razones de prevención de salud. […] **Danilo Astori. Senador**». SEÑORA
  PRESIDENTA.- Se va a votar si se concede la licencia solicitada. (Se vota). –22 en 22.
  Afirmativa. UNANIMIDAD. **Queda convocado el señor José Carlos Mahía**, a quien ya se ha tomado
  la promesa de estilo.» —
  https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescss/2020-04-14%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20SENADORES%20(0008).pdf
- corroboración adicional (vista en el índice del corpus, sin abrir todavía; hay que abrirla antes
  de citarla): el diario del **02/03/2022** (0001) trae «…nech, Penadés, Astori y Gandini. – Quedan
  convocados los señores senadores Caggiani, Blás, Methol, De Mattos, **Mahía**, Bica y…»; el del
  **15/11/2022** (0037) trae «Mahía y, por licencia del titular respectivo, el señor senador
  Meléndez. FALTAN: con licencia, los señores senadores **Astori**…». Y la ficha oficial de
  «Actuacion Parlamentaria» del Parlamento indexada en el corpus dice literalmente «**Titular:
  Astori, Danilo** tomo 630 pag.0 d.s.37 15-11-2022 […] ; **MAHIA, JOSÉ**…».
- accion_sugerida: partir el tramo en dos: `cargo: Senador (suplente de Danilo Astori)` desde
  2020-02-15 hasta la fecha en que Astori dejó la banca, y `cargo: Senador` (titular) desde esa
  fecha hasta 2025-02-14. La fecha la decide un documento previsible: el diario de la sesión en
  que el Senado tomó conocimiento de la renuncia de Astori, que por el diario del 15/11/2022
  (Astori todavía con licencia) es posterior a esa fecha, y que `content/politicos/astori.yaml`
  ubica el 14/11/2022 con fuente de Wikipedia. Mientras no esté ese diario, el tramo de titular
  no puede ir a `publicado`.

### (falta un registro) astori — mandato de Senador de la XLIX
- severidad: **bloquea** (afecta al censo del lote, no a un registro existente)
- tipo: contexto_omitido
- campo exacto: el censo de `notas.md` («Los 30, por orden alfabético real…») y la ausencia de un
  ítem `agrega[]`/corrección para `content/politicos/astori.yaml`
- objecion: `notas.md` detectó que Astori no está en la lista de los 30 y lo explicó como «asumió
  después, probablemente por incompatibilidad», sin resolverlo y sin advertir que, si Astori es
  titular, sobra un nombre entre los 30. El resultado es un censo de la XLIX que tiene un titular
  de menos y un suplente de más, y una ficha ya publicada (`astori.yaml`, tier `publicado`) que
  afirma «Senador de la República, 2020-02-15 a 2022-11-14» con **fuente de Wikipedia y de El
  Observador**, ninguna oficial, y con una fecha de inicio que el diario del 15/02/2020 no
  respalda (Astori no figura ni en los 30 que juran ni en «ASISTEN»).
- cita_de_contexto: «ASISTEN: los señores senadores Andrade, Asiaín, Bergara, Bianchi, Bonomi,
  Botana, Carrera, Cosse, Coutinho, Delgado, Della Ventura, Domenech, Gandini, García, Heber,
  Kechichian, Larrañaga, Lazo, **Mahía**, Manini Ríos, Moreira, Olesker, Peña, Rodríguez, Rubio,
  Sanguinetti, Sartori y Talvi.» (28 nombres; faltan Mujica y Topolansky porque presidían: «PRESIDEN
  EL SEÑOR JOSÉ MUJICA Presidente en ejercicio y LA SEÑORA LUCÍA TOPOLANSKY Presidente ad hoc») —
  https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescss/2020-02-15%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20SENADORES%20(0001).pdf
- accion_sugerida: (1) el lote no se cierra sin el mandato de Astori en la XLIX, con la fuente
  oficial (su `/legisladores/<id>/legislaturas-actuo`, la ficha «Actuación Parlamentaria» que el
  corpus ya tiene indexada, y los diarios donde firma «Danilo Astori. Senador»); entra como
  corrección de `astori.yaml` de tipo `cambio_de_rating`/`cotejo_con_primaria`, no como ficha
  nueva. (2) La fecha de inicio real hay que buscarla: `asistencia.md` lo registra desde el
  03/03/2020, coherente con haber dejado el Ministerio de Economía el 01/03/2020.

### (falta un registro) blas-rodrigo, y las bancas de Nane y de Delgado en la L
- severidad: **bloquea** (cobertura del lote)
- tipo: contexto_omitido
- campo exacto: `notas.md` → «cobertura_del_periodo» y «Cobertura del período» («cubierta
  completa» para la L)
- objecion: el lote declara cubierta completa la L y le faltan sucesiones de titular posteriores a
  febrero de 2025. La más clara está nombrada en una fuente que el propio lote cita, dentro del
  registro de Heber: **Rodrigo Blás asume la titularidad de la banca de Heber** (14/10/2025) y no
  tiene ficha. Además, la banca de **Silvia Nane** (renuncia 18/06/2025) y la de **Álvaro
  Delgado** (renuncia 05/08/2025, ya documentada en `content/politicos/delgado.yaml`) quedaron sin
  sucesor identificado. El lote sí resolvió las de Bergara→Kechichian, Olivera→Moreira Carlos y
  Sánchez→Viera Nicolás: el criterio es el mismo, la búsqueda no.
- cita_de_contexto: «El diputado **Rodrigo Blás asumirá la titularidad del Senado en lugar de
  Heber**.» — https://www.ambito.com/uruguay/luis-alberto-heber-renuncia-su-banca-del-senado-luego-40-anos-el-parlamento-n6199250
  (citada en `politicos.yaml`, registro `heber-luis-alberto`). Y en el diario del **11/03/2026**:
  «FALTAN: con licencia, los señores senadores Bianchi, **Blás**, Caggiani, Falero, Rodríguez,
  Silva y Viera (Nicolás).» —
  https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescss/2026-03-11%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20SENADORES%20(0004).pdf
- accion_sugerida: abrir los diarios de las sesiones inmediatamente posteriores a cada renuncia
  (junio de 2025 para Nane, agosto de 2025 para Delgado, octubre de 2025 para Heber) y cargar los
  tres sucesores; o, si no se hace en esta corrida, **corregir la frase «cubierta completa» de
  `notas.md`**, que hoy afirma más de lo que el trabajo respalda.

### moreira-irene — mandatos partidos por el pasaje al Ministerio de Vivienda
- severidad: **bloquea**
- tipo: contexto_omitido
- campo exacto: `mandatos[0].hasta` (2020-03-01) y `mandatos[2].desde` (2023-05-08)
- objecion: el registro corta el mandato de senadora al asumir el ministerio y lo reabre al
  volver, con lo que la ficha afirma que Irene Moreira **no fue senadora entre marzo de 2020 y
  mayo de 2023**. Eso contradice la adenda del brief de diputados, que el brief de senadores
  declara vigente «palabra por palabra»: «El pasaje de un titular al Poder Ejecutivo o a una
  intendencia **no corta su mandato** […]: la banca la ocupa el suplente y el titular puede
  volver». Y contradice al propio lote, que para Larrañaga, Javier García, Lazo, Civila,
  Etcheverry, Fratti, Lustemberg y Ortuño mantiene el mandato abierto durante el cargo ejecutivo.
  El mismo hecho tiene dos tratamientos dentro del mismo archivo.
- cita_de_contexto: adenda, punto 4, `data/corridas/2026-09-09-diputados-49-50/brief.md`.
- accion_sugerida: un solo mandato `Senadora … 2020-02-15 → 2025-02-14` y el ministerio como ítem
  aparte de `mandatos[]` (que ya está, con dos fuentes buenas). Lo mismo para todos.

### pena-adrian — mandatos partidos por el pasaje al Ministerio de Ambiente
- severidad: **bloquea**
- tipo: cita_fuera_de_contexto
- campo exacto: `mandatos[0].hasta` (`2020-08`), `mandatos[2].desde` (2023-01-30)
- objecion: mismo problema que Irene Moreira, y acá la contradicción está **dentro de la cita que
  el propio registro usa**: la nota de Montevideo Portal dice «**Su banca** en el Senado es ocupada
  en el presente por Pablo Lanz» — «su banca», es decir, la banca siguió siendo de Peña mientras
  fue ministro. Además `mandatos[0].hasta: 2020-08` es una fecha parcial (el esquema la acepta,
  pero deja al lector sin día) y las transiciones ministro→senador se fechan el mismo 30/01/2023
  sin fuente que lo diga: la nota de Caras y Caretas que respalda el tercer tramo dice «El
  secretario de Estado habló a la prensa tras una reunión con la bancada de su sector, Ciudadanos,
  y explicó que lo suyo fue "un error"», que no documenta ningún reintegro a la banca.
- cita_de_contexto: «Su banca en el Senado es ocupada en el presente por Pablo Lanz.» —
  https://www.montevideo.com.uy/Noticias/Adrian-Pena-renuncio-a-su-cargo-como-ministro-de-Ambiente-tras-polemica-por-titulo-uc844486
- accion_sugerida: un solo mandato de senador 2020-02-15 → 2025-02-14 con la fila de
  `legislaturas-actuo`, más el ítem de ministro con sus fechas.

### nane-silvia — mandato XLIX «2020-11-20 → 2025-02-14»
- severidad: corregir
- tipo: contexto_omitido
- campo exacto: `mandatos[0].fuentes` (una sola, fila pelada)
- objecion: el mandato de titular de toda la XLIX se apoya en **una única fila de
  `legislaturas-actuo` sin la línea de cargo** («Legislatura XLIX (2020-2025) 20-11-2020
  14-02-2025»), que es exactamente lo que el método del brief prohíbe usar como prueba de
  titularidad, y **sin `_faltante: segunda_fuente`**, a diferencia de Niffouri, Olivera, Blanca
  Rodríguez y Sabini, que sí lo llevan por lo mismo. La sucesión (Cosse deja la banca el
  20/11/2020 para la Intendencia) no está documentada en ninguna fuente del registro.
- accion_sugerida: agregar la fuente de la renuncia de Cosse y de la asunción de Nane (el diario
  de la sesión de noviembre de 2020 la registra), o marcar `_faltante: segunda_fuente` y tier
  máximo `probable`. Es el mismo umbral que se le aplicó a Niffouri.

### camy-carlos — mandato «Senador (titular por sucesión) 2021-05-22 → 2025-02-14»
- severidad: corregir
- tipo: cita_fuera_de_contexto
- campo exacto: `mandatos[0].desde` y `mandatos[0].fuentes[0].cita`
- objecion: la fecha de inicio (22/05/2021, muerte de Larrañaga) **no está en ninguna de las dos
  fuentes del mandato**; `notas.md` lo reconoce y lo llama «la lógica constitucional estándar».
  Peor: la cita que acompaña al tramo dice otra cosa, que Camy asumió cuando Larrañaga pasó al
  Ministerio del Interior (marzo de 2020), y la fila oficial da 03-03-2020 a 14-02-2025 sin
  distinguir estatus. El lector que abra la fuente va a leer un hecho de 2020 debajo de un
  mandato que empieza en 2021.
- cita_de_contexto: «Camy, que era el suplente en el senado de Larrañaga y asumió su banca una vez
  que el exministro pasó a liderar el ministerio del Interior» —
  https://www.montevideo.com.uy/Noticias/El-senador-Carlos-Camy-asumio-como-nuevo-presidente-de-Alianza-Nacional-uc787999
- accion_sugerida: usar como fuente del `desde` la misma nota de Infobae sobre la muerte de
  Larrañaga que el lote ya tiene en el registro `larranaga-jorge`, y mover la cita de Montevideo
  Portal a un tramo previo `Senador (suplente de Jorge Larrañaga) 2020-03-03 → 2021-05-22` o a un
  `_nota`. El criterio tiene que ser el mismo que se usó para dejar afuera a Raúl Batlle.

### civila-gonzalo, etcheverry-lucia, lustemberg-cristina — senadores sin el cargo que la propia fuente les atribuye
- severidad: corregir
- tipo: contexto_omitido
- campo exacto: `mandatos[]` (falta el ítem de ministro) y `estado_actual.situacion`
- objecion: los tres registros citan la ficha oficial del Parlamento, que dice «**actuando como
  Ministro o Subsecretario desde el 02/03/2025**», y ninguno registra el cargo ejecutivo. La
  página va a mostrar a tres senadores en ejercicio cuando el documento citado dice que están en
  el Poder Ejecutivo. La adenda es explícita: «el cargo ejecutivo va como otro ítem de
  `mandatos[]` con su fuente». Lo mismo vale para **mahia-jose-carlos** en la L (su cita dice
  «Representante Nacional […] actuando como Ministro o Subsecretario desde el 05/03/2025» y la
  ficha solo trae el mandato de representante) y para **lazo-sandra** y **garcia-javier**, a
  quienes `notas.md` les quitó el ítem de Ministerio de Defensa porque el `medio` no existía en
  `content/medios/`.
- cita_de_contexto: «Senadora de la República por el Lema PARTIDO FRENTE AMPLIO , **actuando como
  Ministro o Subsecretario desde el 02/03/2025**» —
  https://parlamento.gub.uy/camarasycomisiones/legisladores/11526 (Lustemberg); idéntica en 11585
  (Civila) y 10465 (Etcheverry).
- accion_sugerida: el nombre del ministerio no está en esa cita, así que hace falta una segunda
  fuente. Es un **documento previsible**: la resolución/decreto de designación del gabinete o la
  página oficial de Presidencia (`content/medios/presidencia.yaml` ya existe, no hay que crear
  ningún medio). Para Javier García hay además una fuente ya leída en este mismo lote: la nota de
  Subrayado citada en el registro de Bianchi («Armando Castaingdebat será el nuevo ministro de
  Defensa Nacional en lugar de Javier García»).

### fratti-alfredo — mandato «Ministro de Ganadería, Agricultura y Pesca» desde 2025-03-01
- severidad: corregir
- tipo: contexto_omitido
- campo exacto: `mandatos[1].desde` y `mandatos[1].fuentes[0].cita`
- objecion: la única fuente dice «actuando como Ministro o Subsecretario desde el **02/03/2025**»
  y el campo dice **2025-03-01**; y la cita no nombra la cartera («Ganadería, Agricultura y
  Pesca»), que por lo tanto queda sin respaldo. Además su mandato de senador queda abierto sin
  `hasta`, lo cual es correcto por la adenda, pero conviene que el `_nota` lo diga para que no
  parezca un olvido.
- accion_sugerida: alinear la fecha con la fuente o traer el decreto de designación.

### bianchi-graciela — fuente de 2024 dentro del mandato de la L
- severidad: corregir
- tipo: cita_fuera_de_contexto
- campo exacto: `mandatos[1].fuentes[1]` y `mandatos[0].hasta`
- objecion: el mandato «Senadora 2025-02-15 → abierto» lleva como segunda fuente una nota de
  Subrayado del **09/02/2024** cuya cita habla de la legislatura anterior («Castaingdebat ocupa una
  banca como senador suplente de Graciela Bianchi, quien está a cargo de la Presidencia del
  Senado»). No respalda el tramo al que está pegada. Aparte, el mandato de la XLIX tiene una sola
  fuente (el diario del 15/02/2020), que **no dice nada del 14/02/2025**: el `hasta` queda sin
  fuente.
- accion_sugerida: mover la cita de Subrayado a un `_nota` (documenta que presidió el Senado en la
  XLIX, dato que la ficha no recoge) y agregar la fila de `legislaturas-actuo` con la línea de
  cargo para cerrar el tramo XLIX.

### botana-sergio, gandini-jorge, garcia-javier, lazo-sandra — `hasta: 2025-02-14` sin fuente que lo diga
- severidad: corregir
- tipo: contexto_omitido
- campo exacto: `mandatos[].hasta` y, en Gandini, `estado_actual.salida.fuentes`
- objecion: estos cuatro mandatos de la XLIX (más el de Bianchi y el de Mahía, ya objetados) se
  cierran el 14/02/2025 con **el diario del 15/02/2020 como única fuente**, que obviamente no
  menciona esa fecha. En Gandini el problema llega hasta `estado_actual.salida`: la salida
  `fin_de_mandato 2025-02-14` está sostenida por el mismo diario de 2020. Veinte registros del
  lote resuelven exactamente esto con la fila de `legislaturas-actuo` que trae «Senador de la
  República por el Lema … - Legislatura XLIX (2020-2025) 15-02-2020 14-02-2025». No hay razón
  para que a seis se les pida menos.
- accion_sugerida: agregar esa fila a los seis. Es el mismo documento que ya se abrió para los
  otros; cuesta una llamada por persona.

### moreira-irene, pena-adrian, rodriguez-gloria, sartori-juan — `fin_de_mandato` con fuentes que no lo dicen
- severidad: corregir
- tipo: contexto_omitido
- campo exacto: `estado_actual.salida.fuentes`
- objecion: la salida de los cuatro se apoya en documentos que no fechan la salida: el diario del
  **15/02/2025** (evidencia de ausencia: no figuran entre los proclamados) en Moreira y Peña —los
  `_nota` lo reconocen, y está bien reconocido, pero una evidencia de ausencia no es la fuente de
  una fecha—; una nota de Montevideo Portal de mayo de 2025 sobre segundas filas de listas en
  Gloria Rodríguez; y en Sartori una cita sobre su lugar en la nómina de suplentes de la L.
  Además, la cita de Búsqueda que respalda el mandato de Sartori dice «desde el 15 de febrero de
  2020 **al 15 de febrero del 2025**» y el campo dice 2025-02-14: la fuente y el campo no
  coinciden en el día.
- accion_sugerida: la fila de `legislaturas-actuo` de cada uno resuelve los cuatro casos.

### rodriguez-gloria — `situacion: fuera_de_cargo` con sesiones en la L
- severidad: corregir
- tipo: contexto_omitido
- campo exacto: `estado_actual.situacion`
- objecion: `asistencia.md`, el índice del propio lote, registra «Rodríguez (Gloria) | 8 sesiones |
  L | 2025-03-18 → 2025-06-18». Una persona que ocupó una banca en ocho sesiones de la legislatura
  en curso no está «fuera de cargo» en el sentido que un lector le da a esa palabra, aunque no sea
  titular. La ficha, tal como está, oculta un año y medio de actividad parlamentaria.
- accion_sugerida: o se carga el tramo como `Senadora (suplente)` con su fuente, o el `_nota`
  explica que ejerció como suplente en la L y que las suplencias son otra corrida. Lo segundo
  alcanza, lo que no alcanza es el silencio.

### asiain-carmen — `situacion: fuera_de_cargo` desde 2025-02-14, y aparece en sala en 2026
- severidad: corregir
- tipo: contexto_omitido
- campo exacto: `estado_actual.situacion` y `estado_actual.salida`
- objecion: el diario del **11/03/2026** la registra entre los presentes. La ficha dirá que dejó
  el cargo el 14/02/2025.
- cita_de_contexto: «ASISTEN: los señores senadores Andrade, Antonini, **Asiaín**, Borbonet,
  Bordaberry, Botana, Brenta, Camy, Carballo, Da Silva, Díaz, Draper, Ferreira, Gandolfo, García,
  Gloodtdofsky, González, Inzaurralde, Kechichian, Kramer, Lema, Melazzi, Moreira (Carlos),
  Moreira (Constanza), Ojeda, Pereyra, Sabini, Tucci, Viera (Tabaré) y Zubía.» —
  https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescss/2026-03-11%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20SENADORES%20(0004).pdf
- accion_sugerida: verificar si es suplencia en ejercicio (fuera del alcance del brief, pero
  entonces el `_nota` lo dice) o sucesión por la banca que Delgado dejó en agosto de 2025 (y
  entonces es un mandato que falta). Hasta resolverlo no puede afirmarse `fin_de_mandato`.

### bergara-mario / kechichian-liliam — dos titulares en la misma banca dos días
- severidad: corregir
- tipo: contexto_omitido
- campo exacto: `bergara-mario.mandatos[1].hasta` (2025-07-10) vs `kechichian-liliam.mandatos[1].desde` (2025-07-08)
- objecion: la banca queda con dos titulares entre el 8 y el 10 de julio de 2025. La fuente
  oficial de Kechichian dice «desde el 08/07/2025» y la nota de prensa de Bergara dice que envió
  la renuncia el martes 8 y asumió la intendencia el jueves 10: la renuncia y la asunción de la
  intendencia son dos hechos distintos y el registro usó el segundo para cerrar el primero.
- accion_sugerida: cerrar el mandato de senador de Bergara el 08/07/2025 (renuncia) y dejar el
  10/07/2025 solo como inicio del mandato de Intendente.

### sanchez-alejandro — `hasta: 2025-03-01` sostenido en una nota de noviembre de 2024
- severidad: corregir
- tipo: cita_fuera_de_contexto
- campo exacto: `mandatos[1].hasta`, `mandatos[2].desde`, `mandatos[2].fuentes`
- objecion: la única fuente que respalda tanto el fin del mandato de senador como el inicio del
  cargo de Secretario de la Presidencia es una nota del **27/11/2024** que dice, en futuro y en
  condicional, «Para asumir como secretario de Presidencia, **deberá renunciar** a su banca del
  Senado». Documenta un anuncio, no el hecho. Y queda un hueco del 1 al 5 de marzo de 2025 entre
  su salida y la asunción de Nicolás Viera.
- accion_sugerida: documento previsible: el diario de sesiones de comienzos de marzo de 2025 en
  que el Senado trató la renuncia; la fila oficial de Viera Nicolás ya dice «desde el 05/03/2025».

### olivera-nicolas / moreira-carlos — cinco días de hueco en la misma banca
- severidad: aviso
- tipo: contexto_omitido
- campo exacto: `olivera-nicolas.mandatos[0].hasta` (2025-07-10) vs `moreira-carlos.mandatos[0].desde` (2025-07-15)
- objecion: las dos fechas salen de páginas oficiales y no son contradictorias (la banca puede
  estar vacante unos días), pero la ficha de Olivera lleva `_faltante: segunda_fuente` porque su
  fecha viene de una fila pelada. Queda anotado para que el editor no lo lea como error.

### heber-luis-alberto — fecha de salida en una fila pelada
- severidad: aviso
- tipo: contexto_omitido
- objecion: el `hasta: 2025-10-14` sale de una fila sin línea de cargo («Legislatura L (2025-2030)
  15-02-2025 14-10-2025»); la nota de Ámbito es del 06/10/2025 y no da esa fecha. Es un uso
  aceptable de la página oficial como apoyo de una fecha de salida (lo que `notas.md` declara como
  criterio), pero conviene que el editor sepa que el día exacto tiene una sola fuente.

### niffouri-amin — mandato de titular con una sola fila pelada
- severidad: corregir
- tipo: contexto_omitido
- campo exacto: `mandatos[0].fuentes` (única) y el `_faltante` ya presente
- objecion: bien marcado con `_faltante: segunda_fuente` y con un `_nota` honesto. Aun así, el
  mandato de titular de cinco años se apoya en una fila que el propio método declara insuficiente.
- accion_sugerida: tier máximo `probable` hasta que aparezca el diario de la sesión de marzo de
  2020 que registre su incorporación, o la nota de prensa de su asunción.

### rodriguez-blanca — mandato con una sola fuente y artefacto del sitio
- severidad: aviso
- tipo: sin_objecion sustantiva
- objecion: el censo del 15/02/2025 la proclama y el `_nota` sobre la fila con fechas futuras
  (17/09/2026-26/09/2026) está bien puesto y bien razonado: eso es una licencia agendada, no un
  tramo histórico. Ojo con la tentación de cerrar el `_faltante` con el diario del 11/03/2026: ahí
  dice «FALTAN: con licencia, los señores senadores Bianchi, Blás, Caggiani, Falero, **Rodríguez**,
  Silva y Viera (Nicolás)», y «Rodríguez» a secas no distingue a Blanca de Gloria (que, según
  `asistencia.md`, ejerció como suplente en la L). Es el mismo problema de alias que se objeta más
  abajo, visto desde el lado de la fuente.
- accion_sugerida: buscar un diario de 2026 donde figure con nombre de pila o con «(Blanca)», que
  es la forma que usan las actas cuando hay dos apellidos iguales en sala; con eso se cierra el
  `_faltante` y se documenta la vigencia.

### sabini-sebastian — segunda fuente que no respalda el mandato
- severidad: corregir
- tipo: cita_fuera_de_contexto
- campo exacto: `mandatos[0].fuentes[1].cita` («dijo el frenteamplista Sebastián Sabini»)
- objecion: una cita de cinco palabras de una nota de 2023 sobre la despedida de Enrique Rubio no
  documenta un mandato que empieza en 2025; solo prueba que existe y es del FA. Aparte, con 31
  caracteres pasa el mínimo del validador, pero al lector le va a quedar una fuente que no dice
  nada. El diario del 11/03/2026 lo registra en «ASISTEN» y sirve mucho mejor.
- accion_sugerida: reemplazarla.

### silva-robert — alias «Silva» sin `alias_ambiguos`
- severidad: corregir
- tipo: contexto_omitido
- campo exacto: `alias` / falta `alias_ambiguos`
- objecion: el propio `_nota` del registro advierte que «Silva | 41 sesiones | XLIX+L | 2020-08-11
  → 2025-06-17» puede no ser todo suyo, y aun así deja «Silva» como alias limpio. Los alias
  alimentan el etiquetado determinista del corpus: un alias ambiguo sin declarar le va a colgar a
  Robert Silva notas de 2020-2023 que pueden no ser suyas. Es exactamente el problema que el lote
  sí resolvió para García, Moreira, Rodríguez, Viera y Sanguinetti.
- accion_sugerida: `alias_ambiguos` con la nota, o retirar «Silva» de `alias` hasta resolverlo (la
  adenda del brief de diputados, punto 7, manda lo segundo; ver «Objeciones al brief»).

### garcia-javier — `alias_ambiguos` bien puesto, pero la ambigüedad ya está resuelta
- severidad: aviso
- tipo: contexto_omitido
- objecion: la nota dice que no se investigó quién es Graciela García. El diario del **08/07/2020**
  lo dice: es una suplente convocada por la licencia de Lucía Topolansky, después de una cadena de
  desistimientos del Frente Amplio. No es otra titular ni hay riesgo de duplicar bancas.
- cita_de_contexto: «Lucía Topolansky. Senadora». […] Se comunica que los señores Sebastián Sabini,
  Marcos Otheguy, Lucía Etcheverry, Eneida de León, Yamandú Orsi, Daniel Caggiani, Graciela
  Barrera, Aníbal Pereyra, Manuela Mutti, Gabriel Frugoni y Daniel Garín han presentado nota de
  desistimiento […] por lo que **queda convocada la señora Graciela García**, a quien se invita a
  pasar al hemiciclo a los efectos de que preste la promesa de estilo.» —
  https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescss/2020-07-08%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20SENADORES%20(0021).pdf
- accion_sugerida: actualizar la nota de `alias_ambiguos` con ese dato y con esa fuente.

### caggiani-daniel — cita que documenta el anuncio, no el hecho
- severidad: aviso
- tipo: contexto_omitido
- objecion: `notas.md` ya lo advierte («asumirá en marzo»: documenta el anuncio). La fila oficial
  corrobora el 02/03/2022 y eso alcanza. Agrego un dato que el lote no tenía: el diario del
  08/07/2020 muestra a Caggiani convocado como suplente de Bonomi desde 2020 («Eduardo Bonomi.
  Senador». […] Queda convocado el señor Daniel Caggiani, a quien ya se ha tomado la promesa de
  estilo»), lo que refuerza la sucesión y da la línea de suplencia.

### larranaga-jorge — sin objeción de fondo
- severidad: aviso
- tipo: sin_objecion
- objecion: el tratamiento es el correcto según la adenda (mandato de senador abierto hasta la
  muerte + ítem de ministro). El aviso que `notas.md` levanta sobre la cita «hasta hoy» de la nota
  necrológica es razonable y no cambia nada: el cese es la muerte. Es, además, el registro que
  fija el criterio contra el que hay que alinear a Irene Moreira y a Peña.

### andrade-oscar, coutinho-german, della-ventura-amanda, domenech-guillermo, kechichian-liliam (XLIX), asiain-carmen (mandato), heber-luis-alberto (XLIX), da-silva-sebastian, civila-gonzalo (mandato), etcheverry-lucia (mandato), lustemberg-cristina (mandato), moreira-constanza, ortuno-edgardo, silva-robert (mandato), viera-tabare, zubia-gustavo, camy-carlos (L), moreira-carlos, viera-nicolas
- severidad: aviso
- tipo: sin_objecion
- objecion: mandatos con dos fuentes, una de ellas la fila de `legislaturas-actuo` **con** la línea
  «Senador/Senadora de la República por el Lema … - Legislatura N», que es lo que el método pide.
  Las fechas de los campos coinciden con las de las citas. Sin objeción propia; les alcanzan las
  objeciones generales de lote (nombre completo, `cargo`, ausencia de `cobertura`).

### carballo-felipe, diaz-bettiana, lema-martin — mandato abierto con una sola fuente
- severidad: aviso
- tipo: contexto_omitido
- objecion: el diario del 15/02/2025 documenta el inicio y eso está bien; lo que no está
  documentado es que **sigan** en el cargo diecinueve meses después. Ver la objeción de lote sobre
  vigencia.
- accion_sugerida: el diario del 11/03/2026 los registra a los tres (Carballo y Lema en «ASISTEN»;
  Díaz en «ASISTEN»). Una sola llamada resuelve la vigencia de casi todo el lote.

### bonomi-eduardo, carrera-charles, olesker-daniel, rubio-enrique, sanguinetti-julio-maria, nunes-jose
- severidad: aviso
- tipo: sin_objecion
- objecion: salidas documentadas con hecho, fecha y fuente de prensa concordante (fallecimiento,
  renuncia). En Carrera, el `_nota` de `casos_vistos` está bien manejado: se fecha la salida sin
  entrar en el caso judicial, que el brief no pedía. En Sanguinetti, la salida se apoya en una nota
  del 14/10/2020 que anuncia la renuncia para el 20/10 y en Infobae del 20/10 que la da por hecha:
  las dos juntas alcanzan.

### bergara-mario (mandato «Intendente de Montevideo») y sanchez-alejandro («Secretario de la Presidencia»)
- severidad: aviso
- tipo: contexto_omitido
- objecion: mandatos abiertos con una sola fuente de prensa cada uno, y en el caso de Sánchez con
  una nota anterior al hecho. No es materia del brief (que pide identidad, partido y mandatos de
  senador), pero quedan publicados como cargos vigentes.

---

## Objeciones al lote

1. **El documento del censo es el equivocado, y hay que decirlo en `notas.md`.** La lista de
   quienes prestan la promesa en la sesión preparatoria incluye a los suplentes convocados desde
   el primer día (Mahía por Astori) y excluye a los titulares que no juraron ese día (Astori). El
   documento que decide titular contra suplente es la **proclamación de la Corte Electoral / la
   adjudicación de bancas de senadores con sus suplentes** (existe para 2019 y para 2024), y en
   segundo lugar la nómina de titulares del Senado. `notas.md` documenta bien por qué no pudo
   leerse la página de integración con `pnpm fuente` (extrae «PARTIDO FRENTE AMPLIO» repetido 31
   veces) — eso está bien hecho y bien contado; lo que falta es no haber dado por equivalente el
   diario de la preparatoria. Con la proclamación de la Corte Electoral el censo se cierra solo y
   se cierran también las tres suplencias largas sin resolver.

2. **La vigencia de la L no está documentada.** Veinticinco fichas dicen `situacion: en_cargo` con
   un censo de febrero de 2025 y verificaciones sueltas hasta julio de 2025. La corrida es del
   09/09/2026: son diecinueve meses. El documento previsible existe y está en el corpus: el diario
   de sesiones más reciente, cuyas listas «ASISTEN» y «FALTAN» son la integración del Cuerpo ese
   día. Abrí el del **11/03/2026** y ahí ya aparecen tres cosas que el lote no tiene: Blás como
   senador, Asiaín en sala, y catorce nombres que no están en ninguna ficha. No se cierra el lote
   sin pasar el censo de la L contra un diario de 2026.

3. **El corte del trabajo por letra del apellido partió las sucesiones.** Cosse (a-l) → Nane (m-z);
   Delgado (a-l) → Niffouri (m-z); Bergara (a-l) → Kechichian (a-l); Olivera (m-z) → Moreira
   Carlos (m-z). Los dos casos que cruzan de lote son justamente los dos que quedaron con una sola
   fuente y `_faltante`. No es culpa de los investigadores: es el reparto. Para la próxima, el
   corte natural es por legislatura o por banca, no por letra.

4. **Un mismo hecho, cuatro tratamientos.** Pasaje de un senador titular al Poder Ejecutivo:
   Larrañaga → mandato de senador continuo + ítem de ministro; Javier García → mandato continuo,
   sin ítem de ministro; Irene Moreira y Peña → mandato cortado y reabierto + ítem de ministro;
   Civila, Etcheverry, Lustemberg, Lazo, Mahía(L) → mandato continuo, sin ítem de ministro. Hay
   que elegir uno (la adenda ya lo eligió) y aplicarlo a los diez.

5. **El criterio «suplente en ejercicio» no está declarado y el sitio ya tiene un precedente
   contrario.** El lote deja afuera a Raúl Batlle con un razonamiento correcto y bien documentado
   («la banca sigue siendo de Tabaré Viera… él no renunció a su banca»), pero `content/politicos/`
   ya publica a **Gustavo Penadés con «Senador de la República, 2020-03-03 a 2023-10-11»**, que es
   exactamente una suplencia larga en la banca de Javier García mientras García era ministro. O
   entran los dos, o ninguno, o entran los dos con `cargo: … (suplente)`. Lo que no puede pasar es
   que el criterio dependa de qué corrida cargó a quién. (De paso: `notas.md` del lote a-l afirma
   que «Ningún archivo `content/politicos/` corresponde a "Penadés"». Existe: `penades.yaml`, tier
   `publicado`.)

6. **Los tres apellidos sin resolver, resueltos.** Los tres son **suplentes convocados por
   licencia**, no sucesores; ninguno necesita ficha en esta corrida, y `notas.md` debería decirlo
   en vez de dejarlos como «posibles fichas M-Z adicionales»:
   - **Lauro Meléndez** (FA): diario del **09/06/2020** (0017): «[…] han presentado nota de
     desistimiento informando que **por esta vez** no aceptan la convocatoria a integrar el Cuerpo,
     por lo que **queda convocado el señor Lauro Meléndez**, a quien se invita a pasar al hemiciclo
     a los efectos de que preste la promesa de estilo.» La cadena de desistimientos previa (De
     León, Orsi, Caggiani, Barrera, Pereyra, Mutti, Frugoni) lo ubica en la línea de suplentes del
     MPP.
   - **Uruguay Russi** (FA): diario del **01/11/2022** (0034): «Silvia Nane. Senadora». […] **Queda
     convocado el señor Uruguay Russi**, quien ya ha prestado la promesa de estilo.» Es el suplente
     de Nane. Prestó la promesa el **09/12/2020** (diario 0042).
   - **Jorge Saravia**: prestó la promesa en la sesión del **08/07/2020** (0021), que es una sesión
     de licencias en cadena (Bonomi → Caggiani, Topolansky → Graciela García, etc.). El id 7766
     del Parlamento, que `notas.md` descartó por no cuadrar, es el correcto: es el mismo Jorge
     Saravia que fue senador 2005-2015.

7. **Simetría de trato: se cumple, con una excepción que no es ideológica pero hay que corregir.**
   A los cinco partidos se les pidió el mismo documento (diario de la preparatoria + fila oficial)
   y se les aplicó el mismo umbral. La única asimetría material del lote es la del punto 1: el
   único titular ausente es del Frente Amplio (Astori) y el único no-titular incluido es del
   Frente Amplio (Mahía). No es un sesgo de selección, es un error de método que cayó donde cayó;
   pero el efecto sobre la página es que la bancada del FA de la XLIX queda mal representada, y
   eso se corrige igual que si hubiera caído del otro lado.

8. **Presentación (lista de control de `CLAUDE.md`), lo que aplica a fichas de identidad:**
   - **`cargo` inconsistente con `content/` y consigo mismo.** Todas las fichas ya publicadas usan
     «Senador de la República» / «Senadora de la República»; el lote usa «Senador» / «Senadora».
     La banda de mandatos va a mostrar dos etiquetas distintas para el mismo cargo según de qué
     corrida salió la ficha. Además, tres sucesores llevan «Senador (titular por sucesión)»
     (Caggiani, Camy, Kechichian) y otros siete exactamente en la misma situación llevan «Senador»
     a secas (Nunes, Niffouri, Nane, Viera Tabaré, Sánchez, Moreira Carlos, Viera Nicolás): el
     mismo estatus con dos rótulos. Elegir uno y aplicarlo a los 48. (Nota aparte: el brief manda
     «masculino genérico, `Senador`» y el documento oficial que el propio lote cita dice «Senadora
     de la República por el Lema…». Ver «Objeciones al brief».)
   - **`nombre` no es el nombre completo en 46 de 48 fichas.** El esquema pide «Nombre completo tal
     como figura en registros oficiales» y las fichas publicadas lo cumplen («Danilo Ángel Astori
     Saragosa», «Gustavo Carlos Penadés Etchebarne»). Acá `nombre` y `nombre_corto` son casi
     siempre idénticos. Y lo llamativo es que los apellidos completos **ya están en el lote**, en
     los `titulo` de las fuentes que los investigadores escribieron: «Camy Antognazza», «Coutinho
     Rodríguez», «Domenech Martínez», «Civila López», «Etcheverry Lima», «Nane Vincon», «Bergara
     Duque». Solo Bergara los pasó al campo.
   - **`nombre_corto` mezclado.** Mahía, Olesker, Sanguinetti y Sabini llevan solo el apellido; los
     otros 44, nombre y apellido. En una lista de senadores el lector va a ver «Oscar Andrade»
     junto a «Mahía».
   - **Ninguna ficha lleva `cobertura`.** Entran 48 personas nuevas cuyas páginas van a mostrar
     vacías las secciones de declaraciones, chequeos, promesas, casos, patrimonio y votaciones. El
     punto 19 de la lista («Una sección sin registros es una línea, con la explicación de por qué
     falta plegada») y el propio campo `cobertura` del esquema existen para esto. Una sola frase
     por ficha, o una frase compartida por el lote, alcanza: qué se buscó (identidad y mandatos,
     por documento oficial), qué período, y qué falta.
   - **`_slug` con dos convenciones.** El lote usa `apellido-nombre` (`andrade-oscar`) y `content/`
     tiene `astori`, `delgado`, `mujica`, `penades`. Los ids no se renombran nunca, así que esto
     queda para siempre; no es objeción al lote (el brief lo fijó), pero conviene que el editor lo
     decida a sabiendas y lo aplique de acá en adelante.

9. **Lo que el lote hizo bien y conviene no perder al corregir:** el censo se apoyó en el documento
   más fuerte que se podía leer con la herramienta, y `notas.md` documenta con precisión por qué no
   se pudo usar la nómina web y por qué no se usó WebFetch (no citable). Los artefactos del sitio
   del Parlamento (fila de Sabini con tres días de octubre de 2025, fila de Blanca Rodríguez con
   fechas de septiembre de 2026) fueron detectados y **no** se usaron como fuente, que era la
   trampa obvia. La exclusión de Raúl Batlle está bien razonada y bien citada. Las cinco citas que
   salieron «aproximadas» por espacios en el PDF están bien explicadas. Y los `alias_ambiguos` de
   Moreira, Rodríguez, Viera, García y Sanguinetti están bien puestos.

---

## Objeciones al brief

No hay pedido de asimetría: el brief es explícito en que el mismo documento se le exige a todos
los partidos y en las dos legislaturas, y así se aplicó. **No hay violación de la Regla 0.** Sí hay
tres defectos de método que conviene corregir antes de la próxima corrida, porque el lote los
heredó:

1. **El censo propuesto no distingue titular de suplente.** El brief ofrece el diario de la sesión
   preparatoria como fuente del censo y dice «Quien figura ahí es titular». Es falso para el
   Senado, y el contraejemplo es de la propia XLIX (Mahía por Astori). Redacción simétrica
   propuesta: *el censo sale de la proclamación de la Corte Electoral (titulares y suplentes de
   cada lista); el diario de la sesión preparatoria prueba quién juró ese día, que no es lo mismo;
   y quien no juró ese día es titular igual si un diario o su página oficial lo dice con el cargo.*
   Esta última mitad ya está en el brief y es la que habría atrapado a Astori: no se aplicó.

2. **`cargo: "Senador"` en masculino genérico contradice al documento oficial.** La fila del
   Parlamento que el brief manda citar dice literalmente «**Senadora** de la República por el Lema
   PARTIDO FRENTE AMPLIO - Legislatura XLIX». Los investigadores hicieron bien en seguir al
   documento y no al brief, pero entonces el brief tiene que decirlo. Propuesta simétrica: se usa
   la forma del documento oficial, y la misma regla para diputados, ministros e intendentes; el
   agrupamiento por tipo de cargo lo hace `src/lib/cargos.ts`, que ya reconoce las dos formas.

3. **El brief y la adenda que declara vigente se contradicen en los alias compartidos.** El brief
   de senadores manda `alias_ambiguos` con la nota; la adenda de diputados, punto 7, manda lo
   contrario: «Un alias compartido por dos personas […] se retira de las dos fichas y queda solo el
   nombre completo». Como los alias alimentan el etiquetado determinista del corpus, la diferencia
   no es cosmética: con `alias_ambiguos` el apellido «Rodríguez» va a etiquetar notas de Gloria y
   de Blanca indistintamente. Hay que elegir una regla y que valga para las dos cámaras.

4. **Menor:** el brief da a Penadés por existente en `content/politicos/` y `notas.md` del lote a-l
   afirma lo contrario; existe. Y el brief pide que las personas con ficha previa se anoten en
   `notas.md` «para que entren por corrección», lo cual se cumplió para Astori, Delgado, Mujica,
   Talvi, Topolansky y Ojeda, pero sin distinguir entre «hueco menor» y «dato contradicho por el
   documento», que es lo que pasa con Astori.

### Sobre los huecos anotados de las fichas existentes (punto 6 del encargo)

- **astori.yaml** — el hueco **no está bien descrito**. `notas.md` señala dos cosas ciertas (la
  incoherencia entre `hasta: 2022-11-14` y el fallecimiento del 10/11/2023, y que las fuentes son
  Wikipedia y El Observador) y una tercera que trata como curiosidad y es el problema central:
  que Astori no figura entre los 30 del 15/02/2020. Para escribir la corrección hace falta decir
  que el mandato **existe** (probado por los diarios donde firma «Danilo Astori. Senador»), que
  **la fecha de inicio publicada no está respaldada**, y que Mahía era su suplente. Tal como está,
  quien tome la nota va a agregar una fuente oficial y dejar el 2020-02-15 intacto.
- **delgado.yaml** — el hueco **está bien descrito**: falta el tramo breve de senador de la XLIX,
  con el hecho documentado y la fecha exacta pendiente. Agrego que la fecha está a mano: la fila
  de `legislaturas-actuo` de Niffouri («01-03-2020») y el propio `delgado.yaml`, que ya cierra su
  mandato 2015-2020 el 2020-03-01, la fijan. Ojo con un detalle que la nota no ve: `delgado.yaml`
  hace terminar el mandato 2015-2020 el **2020-03-01**, es decir, ya cubre el tramo del 15/02 al
  01/03 dentro del mandato anterior. La corrección tiene que decidir si parte ese mandato o no,
  porque si no se va a duplicar quince días.
- **mujica.yaml** — el hueco **no está descrito, solo enunciado** («no se abrieron en esta
  corrida»). Y es grande: `mujica.yaml` no tiene **ningún** mandato de senador, ni el de la XLIX ni
  los anteriores; solo la presidencia. La fuente para la XLIX está en el lote (diario del
  15/02/2020 + Infobae del 20/10/2020 sobre la renuncia).
- **talvi.yaml** — el hueco **no está descrito** y la ficha ya tiene el tramo («Senador de la
  República 2020-02-15 a 2020-03-01»), con fuente de Wikipedia. Lo que falta es el cotejo con el
  primario: el diario del 15/02/2020 lo proclama y `asistencia.md` lo registra en 2 sesiones, las
  dos del 15/02/2020. Es una corrección de tipo `cotejo_con_primaria`, barata.
- **topolansky.yaml** — el hueco **no está descrito**. La ficha ya trae «Senadora de la República
  2020-02-15 a 2022-03-01», compatible con el diario. Hay un dato que ninguna nota recoge y que el
  diario del 15/02/2020 sí da: presidió la sesión preparatoria como **Presidente ad hoc**, junto a
  Mujica como Presidente en ejercicio; y su mandato de Vicepresidenta figura terminando el
  2020-02-14, cosa que conviene cotejar con el documento (el período vicepresidencial termina el
  1.º de marzo).
- **ojeda.yaml** — el hueco **está bien descrito** y en realidad no existe: la ficha ya tiene
  «Senador de la República desde 2025-02-15» con dos fuentes. Solo cabría sumar el diario de la
  preparatoria como primario.

---

## Cobertura

**No se emiten registros `cobertura` en esta crítica, y el motivo importa.** El único material que
abrí en esta sesión son diarios de sesiones (`tipo: diario_de_sesiones`), que no son cobertura de
prensa y no se codifican por tono. Las notas de prensa del lote (Infobae, Subrayado, Montevideo
Portal, El Observador, Ámbito, La Diaria, Caras y Caretas, Búsqueda) **no las abrí**: de cada una
solo vi la cita que el registro transcribe, y el propio rol prohíbe emitir un tono sin poder citar
una frase de la nota leída en esta sesión. Emitir tono desde la cita que el investigador eligió
sería medir el sesgo de los medios con la selección de un tercero.

Notas que una pasada de tono debería codificar, si el editor quiere cobertura de este lote (todas
tienen `medio` en `content/medios/`, todas son de grupos distintos, y ninguna sostiene sola un
registro):

```yaml
# pendientes de codificar (no leídas por el crítico en esta sesión)
- medio: infobae        # grupo-infobae
  urls:
    - https://www.infobae.com/america/america-latina/2021/05/22/murio-jorge-larranaga-ministro-del-interior-de-uruguay/
    - https://www.infobae.com/america/america-latina/2020/10/20/los-ex-presidentes-de-uruguay-julio-maria-sanguinetti-y-jose-mujica-renunciaron-al-senado/
    - https://www.infobae.com/america/america-latina/2024/10/03/el-senado-uruguayo-acepto-la-renuncia-de-legislador-del-frente-amplio-investigado-por-abuso-de-funciones/
- medio: montevideo-portal   # montevideo-comm
  urls:
    - https://www.montevideo.com.uy/Noticias/El-senador-Carlos-Camy-asumio-como-nuevo-presidente-de-Alianza-Nacional-uc787999
    - https://www.montevideo.com.uy/Noticias/Olesker-renuncio-a-su-banca-en-el-Senado--Los-lugares-de-militancia-son-todos-iguales--uc839970
    - https://www.montevideo.com.uy/Noticias/Del-legado-y-la-militancia-a-su-tono-de-voz-la-despedida-a-Enrique-Rubio-en-el-Senado-uc873076
    - https://www.montevideo.com.uy/Noticias/Adrian-Pena-renuncio-a-su-cargo-como-ministro-de-Ambiente-tras-polemica-por-titulo-uc844486
    - https://www.montevideo.com.uy/Noticias/-He-aprendido-mucho-escuchando-cuando-disentia--dijo-Bergara-en-su-renuncia-al-Senado-uc929456
    - https://www.montevideo.com.uy/Noticias/Kechichian-Moreira-y-una-cantante-los-cambios-en-el-Parlamento-tras-las-departamentales-uc923621
    - https://www.montevideo.com.uy/Noticias/Orsi-confirmo-que-Alejandro-Pacha-Sanchez-sera-su-secretario-de-Presidencia-uc907844
- medio: subrayado      # fontaina-de-feo
  urls:
    - https://www.subrayado.com.uy/irene-moreira-renuncio-al-ministerio-vivienda-y-anuncio-que-el-lunes-volvera-al-senado-n914501
    - https://www.subrayado.com.uy/sanguinetti-y-mujica-renuncian-al-senado-el-martes-20-octubre-n678491
    - https://www.subrayado.com.uy/el-senado-despidio-elogios-todos-los-partidos-silvia-nane-que-asumira-un-cargo-la-imm-n980065
    - https://www.subrayado.com.uy/armando-castaingdebat-sera-el-nuevo-ministro-defensa-nacional-lugar-javier-garcia-n938196
- medio: el-observador  # werthein-hochbaum
  urls:
    - https://www.elobservador.com.uy/nota/daniel-caggiani-reemplazara-a-bonomi-y-asumira-su-banca-en-el-senado-20222221799/amp
- medio: ambito         # grupo-ambito
  urls:
    - https://www.ambito.com/uruguay/luis-alberto-heber-renuncia-su-banca-del-senado-luego-40-anos-el-parlamento-n6199250
    - https://www.ambito.com/uruguay/otra-baja-el-herrerismo-gloria-rodriguez-se-aleja-discrepancias-n6061402
- medio: la-diaria      # cooperativa-la-diaria
  urls:
    - https://ladiaria.com.uy/politica/articulo/2023/5/irene-moreira-dejara-el-ministerio-y-asumira-su-banca-en-el-parlamento-tras-pedido-de-renuncia-de-lacalle-pou/
- medio: caras-y-caretas   # editora-caras-y-caretas
  urls:
    - https://www.carasycaretas.com.uy/politica/pena-renuncio-al-ministerio-ambiente-y-vuelve-al-senado-n59271
- medio: busqueda       # magnolio
  urls:
    - https://www.busqueda.com.uy/politica/juan-sartori-pone-pausa-su-actividad-politica-uruguay-y-se-concentra-los-negocios-internacionales-n5404478
```

Sobre dependencia de un grupo: la colección `politicos` no exige dos grupos (esa regla es de
`evidencia.nivel: reportado`), pero vale mirarlo igual. Ocho grupos distintos, ninguno domina, y
las fuentes de peso son documentos oficiales del Estado uruguayo (`parlamento`, grupo
`estado-uruguayo`). No hay dependencia de un grupo de prensa.

## Discrepancias

**No se escribe `discrepancias.yaml`.** Hay un candidato claro —`content/politicos/astori.yaml`
publica «Senador de la República, 2020-02-15 a 2022-11-14» con fuente de Wikipedia y de El
Observador, y el diario del 15/02/2020 no respalda esa fecha de inicio— pero **no abrí en esta
sesión el artículo de Wikipedia ni la nota de El Observador**, y sin la cita literal y contigua de
lo publicado no corresponde registrar una discrepancia. Queda como acción para quien la resuelva:
`pnpm fuente https://es.wikipedia.org/wiki/Danilo_Astori` y la nota de El Observador del
10/11/2023, contra el diario del 15/02/2020 y el del 14/04/2020. Si al abrirlas la diferencia se
confirma, es una discrepancia de tipo `dato_erroneo` y, sobre todo, una corrección de
`astori.yaml`.
