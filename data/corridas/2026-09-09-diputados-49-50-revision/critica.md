# Crítica — corrida 2026-09-09-diputados-49-50 (segunda pasada)

Modelo: Opus 5 (`claude-opus-5[1m]`), como pide la regla 14 de `CLAUDE.md` para el crítico.
Lote: `inbox/diputados/critica-revision/`
Registros revisados: 66 fichas de `politicos.yaml` (109 mandatos: 90 de Representante, 1 de
Representante suplente, 10 de Senador, 3 de Senador suplente, 5 de cargo ejecutivo o de presidencia
de la Cámara; 172 fuentes sobre 116 URL distintas).
Abierto con `pnpm fuente` en esta sesión: las dos nóminas alfabéticas archivadas de la XLIX
(07/10/2020 y 07/03/2023), la nómina por partido de la XLIX (22/07/2024), `LegxPartido.pdf` y
`LegAlfab.pdf` de hoy, y las páginas de Sabini (9894), Umpiérrez Alejo (7981), Fratti (6734),
Caggiani (9916), Andújar (11593), Goñi (5938), Blás (12660), De Mattos (9947), Antonini (12659),
Ferreira (9997), Viera (11626) y Aníbal Pereyra (7742).
Mecánica corrida sobre el lote: `pnpm validar --inbox` → 0 errores (705 registros, 22 avisos, todos
preexistentes).

Severidades, las mismas de la primera crítica: `bloquea` = el registro afirma algo que una fuente
oficial contradice, o que ninguna fuente respalda; `corregir` = se publica después de un cambio
concreto; `aviso` = para el editor.

---

## 1. Lo que cambió el cuadro: dos censos de la XLIX que nadie había usado

La primera crítica dijo que para la nómina de la XLIX «hay **una sola** captura archivada
(20240722)». Eso vale para `documentos.diputados.gub.uy/docs/LegxPartido.pdf`. **No vale para
`LegAlfab.pdf` del dominio viejo**, que tiene por lo menos dos versiones más y que el propio lote
cita (en `cardoso-german`, `castaingdebat-armando` y `lema-martin`) sin darse cuenta de que era un
censo:

| Documento | Fecha interna | Qué trae | Cómo se lee hoy |
|---|---|---|---|
| `https://web.archive.org/web/20201122020058if_/http://www.diputados.gub.uy/docs/LegAlfab.pdf` | **07/10/2020 08:39:14** | los 99 titulares de la XLIX, con partido y departamento, y 5 notas al pie (Penadés/Senador, Castaingdebat/Subsec. MIDES, Cardoso/Min. Turismo, Amarilla/Subsec. Ambiente, Olaizola/Subsec. MTOP) | abierto hoy |
| `https://diputados.gub.uy/docs/LegAlfab.pdf` (URL viva, contenido congelado) | **07/03/2023 16:36:56** | los 99 titulares de la XLIX, con 3 notas al pie (Lema/Min. MIDES, Amarilla, Olaizola) | abierto hoy; capturado en Wayback el 20240510140313 |
| `https://web.archive.org/web/20240722113854id_/https://documentos.diputados.gub.uy/docs/LegxPartido.pdf` | 22/07/2024 | los 99 titulares de la XLIX | ya lo usaba el lote |

Los tres traen, además, el renglón de encabezado que explica cómo se lee la fila entrelazada:
`REPRESENTANTE  REPRESENTANTE  REPRESENTANTE  PART. DEPTO.  PART. DEPTO.  PART. DEPTO.`
Es decir: la «regla empírica de corrimiento de columnas» que `notas.md` documenta con honestidad
**está escrita en el propio documento**, y basta incluir ese renglón en la `cita` para que el lector
vea de dónde sale el departamento. Eso resuelve de un saque las quince citas que hoy son una hilera
de tres apellidos y tres departamentos sueltos.

**Crucé los tres censos contra los 52 mandatos de la XLIX del lote.** 48 son coherentes: quien
figura en un censo tiene el mandato abierto en esa fecha, quien no figura lo tiene cerrado o todavía
no abierto (verificados uno por uno, incluidas las entradas escalonadas de Valdomir 03/11/2020,
Fajardo 25/11/2020, Mazzini 08/03/2022, Medina 15/08/2022, Ibarguren 04/10/2022 y Soravilla
16/07/2024, y las salidas de Besozzi, García, Lafluf, Olivera Nicolás, Irigoin, Umpiérrez Alejo,
Morel, Mier, Sánchez Cal, Minetti, Irazábal, Enciso, Caggiani, Mahía, Sabini, Dos Santos y Umpiérrez
Javier). **Cuatro no lo son, y son los cuatro «pisos documentados» que el pedido preguntaba si
alcanzaban.** No alcanzan: están refutados.

---

## 2. Estado de las objeciones de la crítica anterior

| Objeción anterior | Sev. | Estado | Qué falta |
|---|---|---|---|
| `mahia-jose-carlos`: tramo de senador cargado como diputado | bloquea | **resuelta** con fuente (Rep. 15/02/2020→15/11/2022 con «Convocado a la Cámara de Representantes… hasta el 15/11/2022 00:01»; Senador suplente de Astori) | falta el ítem de Ministro de Educación y Cultura (ver 3.5) |
| `caggiani-daniel`: idem | bloquea | **resuelta** (Rep. 15/02/2020→08/03/2022 + diario del 08/03/2022 que registra la renuncia) | falta el tramo de Senador, que sí se cargó en Mahía y Sabini (ver 3.14) |
| `sabini-sebastian`: idem | bloquea | **resuelta** en las fechas | el rótulo «(suplente)» no lo respalda la cita, y hay solapamiento 02→08/03/2022 (ver 3.12) |
| `lust-eduardo`: `hasta` sacado de una fila de intervención | bloquea | **resuelta**: mandato completo con «Convocado… hasta el 14/02/2025 23:59»; presente en los tres censos | el `partido` no está en ninguna cita (ver 3.10) |
| `etcheverry-lucia`: cita nueve meses anterior al `hasta` | bloquea | **resuelta a medias**: se cambió por la fila entrelazada de 2024, que no trae ni fechas ni el cargo | agregar los censos 07/10/2020 y 07/03/2023, donde figura (ver 3.7) |
| `echeverria-solis`: un día de suplencia como titular, `fin_de_mandato` el día de apertura | bloquea | **resuelta**: `cargo` con «(suplente)», `salida.tipo: renuncia` con «Renuncia el 15/02/2020» | nada |
| `umpierrez-alejo`: dos días de la L como titular, departamento de una biografía de 2005 | bloquea | **resuelta**: era una convocatoria al Senado, ahora `Senador (suplente)`; departamento y salida de 2020 con fuente propia | `salida.tipo: fin_de_mandato` el 09/04/2025 y falta la otra suplencia del 01→02/04/2025 (ver 3.13) |
| `soravilla-emiliano`: departamento sin cita, XLIX faltante, salida inferida | bloquea | **resuelta** con fuente: «por el departamento de ARTIGAS», XLIX 16/07/2024→14/02/2025, «Renuncia por pasaje a Intendente el 01/07/2025» | nada |
| `castaingdebat-armando`: cinco años apoyados en una semana | bloquea | **resuelta**: nota al pie de la nómina + dos ítems de Ejecutivo | el ítem de Ministro de Defensa quedó abierto (ver 3.4) |
| `antonini-eduardo` y `ferreira-zulimar`: cita de Senador para un cargo de Representante | corregir | **resuelta** (nota al pie de `LegxPartido.pdf`) | ninguna cita nombra Maldonado ni Tacuarembó (ver 3.16) |
| `viera-nicolas`: falta el mandato de la L | corregir | **resuelta** (Rep. por Colonia + Senador) | Colonia no está en ninguna cita (ver 3.16) |
| `blas-rodrigo`: falta el mandato titular de la XLIX | corregir | **resuelta mal**: se cargó desde 22/07/2024 y era titular el 07/10/2020 | ver 3.1 |
| 12 fichas sin mandato XLIX | corregir | **resuelta para las 12** | 4 con fecha de inicio refutada (3.1) y 3 con fecha de inicio sin fuente (3.7-3.9) |
| 8 fichas con el departamento fuera de la cita | corregir | **resuelta para las 8** (línea limpia de la página individual, o entrada aislada en Melo) | reaparece en Antonini, Ferreira, Viera, Pereyra y Melo (3.16, 3.19, 3.20) y en 15 citas entrelazadas (3.21) |
| 6 fichas con `fin_de_mandato` mal fechado | corregir | **resuelta para las 6** | reaparece en `olivera-ana` y `umpierrez-alejo` (3.15, 3.13) |
| 10 fichas `en_cargo` sin mandato abierto | corregir | **resuelta para las 10**; hoy 0 fichas en esa situación | el reverso: 2 fichas `fuera_de_cargo` con mandato abierto (3.3, 3.4) |
| 4 fichas `_faltante: segunda_fuente` | corregir | **no resuelta, y está bien**: es trabajo del resolvedor; se quitó la fuente de Wikipedia de Minetti | las 4 van a `probable` (3.24) |
| `garcia-mario` y `lafluf-omar`: segunda fuente de otra persona | corregir | **resuelta con fuente**: ahora citan su propia actuación (10117 y 7740) | nada |
| Amarilla/Castaingdebat con criterio distinto que Cardoso/Lema | corregir | **resuelta**: los cuatro con mandato de Representante continuo y el cargo ejecutivo como ítem aparte | el criterio no se aplicó a Mahía ni a Fratti, y a Penadés y Olaizola les falta el mandato (3.5, 3.6, 3.11, 5.2) |
| Cuatro tratamientos para la misma suplencia; falta la ficha de Aníbal Pereyra | corregir | **resuelta**: ficha creada, criterio uniforme | el departamento de Pereyra se apoya en un diario de 2005 (3.19) |
| Colisiones de alias (6) | corregir | **resueltas 3 de 6** (Mujica, Salle, Pereyra, con `alias_ambiguos`) | siguen «Delgado», «Araújo» y «Echeverría» (3.22) |
| Ids que quedarán mal | corregir | **resueltos 2 de 3**: `inthamoussu-pablo` y `rodriguez-galvez-carlos` | `de-armas`/`de-brum`/`de-mattos` sin decidir, y el cambio de id rompe `inbox/votaciones/2020` (5.4) |
| 67 fichas con `nombre` = `nombre_corto` | corregir | **resuelta parcialmente**: quedan 25 en este lote | bajo a `aviso` con motivo (4.1) |
| Fuentes: fechas, títulos y medio | aviso | **no resuelta** | 45 fuentes con la fecha del hecho y no la de consulta; `medio: parlamento` para tres dominios (4.2, 4.3) |
| `cardoso-german`, `irigoin-pedro`, `olivera-ana`, `umpierrez-javier` (avisos) | aviso | Olivera Ana y Umpiérrez Javier **resueltos** con la línea que trae departamento y fecha; Cardoso confirmado por el censo del 07/10/2020 | Irigoin sigue sin rótulo de cargo para el tramo de la L (3.26) |
| Cobertura de la L (faltan 14) y de la XLIX (faltan 32) | bloquea | **fuera del alcance de este lote**: entra 1 (Aníbal Pereyra) y el mandato de la L de Viera | los demás están en `inbox/diputados/critica-faltantes/` (168 fichas), que se critica aparte (5.1) |
| El aviso de simetría con 170 renglones | aviso | **no resuelta** (es cambio de infraestructura) | 5.5 |

---

## 3. Objeciones por registro

### 3.1 `andujar-sebastian`, `blas-rodrigo`, `de-mattos-alfredo`, `goni-rodrigo` — el «piso documentado» está refutado
- severidad: **bloquea**
- campo: `mandatos[].desde` del mandato de la XLIX
- tipo: cita_fuera_de_contexto / riesgo_legal
- objecion: las cuatro fichas datan el mandato de la XLIX en 2023 o 2024 porque `legislaturas-actuo`
  solo les muestra una fila suelta de uno a tres días. Los cuatro figuran entre los 99 titulares en
  el censo del **07/10/2020**, ocho meses después de abierta la legislatura. No es un dato que
  falte: es un dato que otra fuente oficial contradice. En la página, Sebastián Andújar —que
  presidió la Cámara en el período 2021-2022— quedaría con una banda de un día en mayo de 2024.
- cita_de_contexto (todas de
  `https://web.archive.org/web/20201122020058if_/http://www.diputados.gub.uy/docs/LegAlfab.pdf`,
  «Titulares · Nómina Alfabética de Representantes · XLIX Legislatura», «Cantidad de Representantes:
  99», fecha interna 07/10/2020):
  - «Pereyra Piñeyro, Susana	Goñi Reyes, Rodrigo	Andújar, Sebastián PN Canelones PN FA	Montevideo Montevideo»
  - «Reisch, Nibia	Lafluf Hebeich, Omar	Blás Simoncelli, Rodrigo PN Maldonado PN PC	Río Negro Colonia»
  - «Tinaglini, Gabriel	Mesa Waller, Nicolás	De Mattos, Alfredo PN Tacuarembó FA FA	San José Rocha»
  - los cuatro vuelven a figurar en el censo del 07/03/2023 (`https://diputados.gub.uy/docs/LegAlfab.pdf`).
- accion_sugerida: (a) datar el mandato con el censo más antiguo en que la persona figura, y (b)
  cerrar la fecha real con el diario de sesiones de la sesión preparatoria del **13/02/2020** y de la
  primera sesión del **15/02/2020**, que el brief ya lista como fuente 2 y que este mismo lote usó
  bien para `inthamoussu-pablo` («Hoja de votación N° 609, señor Luis Pablo Inthamoussu Acevedo»,
  d.s. del 13/02/2025). Es un solo documento que resuelve el `desde` de los 99 de una vez. Sin (b),
  el mandato no se publica con una fecha inventada hacia adelante ni hacia atrás: se publica con la
  fecha que el censo prueba y con el hueco declarado en `cobertura` (ver 3.23).
- nota de simetría: los cuatro son del Partido Nacional. No veo nada que indique intención —el
  método falló igual, en el sentido contrario, para tres fichas del FA, del PC y del PN (3.7-3.9)—
  pero el efecto sobre la página sí es asimétrico y hay que decirlo con números: cuatro diputados de
  un mismo partido aparecerían con mandatos de entre un día y nueve meses en vez de cinco años.

### 3.2 `jisdonian-pedro` — cargado como titular; las tres nóminas lo marcan como sustituto
- severidad: corregir
- campo: `mandatos[0].cargo`
- tipo: contexto_omitido
- objecion: la ficha dice «Representante Nacional por Montevideo, 03/03/2020 → 14/02/2025». En los
  tres censos figura entre los 99 **con la llamada al pie**: `Jisdonian, Pedro (5)` en 2020,
  `Jisdonian, Pedro (3)` en 2023 y en 2024. La llamada dice quién es el titular. El propio corrector
  lo dejó anotado y lo derivó al editor; la adenda (punto 4) ya decide el caso.
- cita_de_contexto: «( ) 5 Sustituye al Representante Juan José Olaizola mientras desempeñe el cargo
  de Subsecretario del Ministerio de Transporte y Obras Públicas» (censo del 07/10/2020; idéntica,
  con el número 3, en el del 07/03/2023).
- accion_sugerida: `cargo: "Representante Nacional por Montevideo (suplente)"`, con la llamada al
  pie como fuente. El sitio ya lo dibuja rayado (`esSuplencia()` en `src/lib/cargos.ts`), que es
  exactamente lo que pasó esos cinco años.

### 3.3 `amarilla-gerardo` y 3.4 `castaingdebat-armando` — un cargo de gobierno sin fecha de fin, en una ficha que dice «fuera de cargo»
- severidad: corregir
- campo: `mandatos[].hasta` del ítem ejecutivo + `estado_actual.situacion`
- tipo: riesgo_legal / presentacion
- objecion: son las dos únicas fichas del lote con `situacion: fuera_de_cargo` y un mandato sin
  `hasta`. La página va a mostrar «Subsecretario del Ministerio de Ambiente, desde 27/08/2020» y
  «Ministro de Defensa Nacional, desde 05/03/2024» sin cierre, es decir, como si siguieran en el
  cargo, al lado del rótulo «fuera de cargo». A Cardoso y a Lema, en la misma situación, se les
  cerró el tramo ejecutivo (24/08/2021 y 05/03/2024) porque la fila de actuación traía la fecha; a
  estos dos la fila la trae vacía («Pasaje a Ministro o Subsecretario el 27/08/2020 / /»).
- accion_sugerida: el documento es previsible y hay dos caminos. (a) La nómina de la L
  (`LegAlfab.pdf` de hoy) no los lista y ninguna de sus cinco llamadas al pie los nombra: el cargo
  terminó a más tardar con la legislatura. (b) El decreto de designación del gabinete entrante,
  publicado por IMPO y por `medios.presidencia.gub.uy` el 01/03/2025, fija el día. Con cualquiera de
  los dos el `hasta` deja de faltar. Si no se busca, el ítem ejecutivo no se publica abierto.

### 3.5 `mahia-jose-carlos` — el criterio de Cardoso, Lema, Amarilla y Castaingdebat no se le aplicó
- severidad: corregir
- campo: `mandatos[]`
- tipo: asimetria
- objecion: la adenda (punto 4) dice que el cargo ejecutivo va como otro ítem de `mandatos[]`, «vale
  igual para Cardoso, Lema, Amarilla, Castaingdebat y cualquiera en la misma situación». Mahía está
  en esa situación exacta y **la prueba está en dos citas que la ficha ya tiene** y que no convirtió
  en mandato. Es la única ficha del lote con evidencia de cargo ejecutivo en sus propias citas y sin
  el ítem correspondiente.
- cita_de_contexto: «Representante Nacional por el Lema PARTIDO FRENTE AMPLIO, departamento de
  CANELONES , actuando como Ministro o Subsecretario desde el 05/03/2025»
  (`https://parlamento.gub.uy/camarasycomisiones/legisladores/2921`) y «( ) 2 Sustituye al
  Representante José Carlos Mahia mientras desempeñe el cargo de Ministro de Educacion y Cultura»
  (`https://documentos.diputados.gub.uy/docs/LegxPartido.pdf`, leído hoy).
- accion_sugerida: agregar `cargo: Ministro de Educación y Cultura, desde: 2025-03-05` con esas dos
  fuentes.

### 3.6 `fratti-alfredo` — mismo caso, con la fuente fuera de la ficha
- severidad: corregir
- campo: `mandatos[]`
- tipo: asimetria
- objecion: la ficha carga «Senador de la República desde 2025-02-15» y nada más. Su página
  individual dice que está en el Poder Ejecutivo desde el 02/03/2025. Sumado a 3.5, el resultado es
  que los cuatro legisladores que pasaron al Ejecutivo bajo el gobierno anterior (PN y PC) tienen su
  cargo de gobierno registrado y los dos que pasaron bajo el actual (FA) no. Nada indica intención
  —fueron dos correctores distintos y ninguno vio al otro— pero el criterio tiene que ser uno solo o
  la página informa distinto según el partido.
- cita_de_contexto: «Senador de la República por el Lema PARTIDO FRENTE AMPLIO , actuando como
  Ministro o Subsecretario desde el 02/03/2025»
  (`https://parlamento.gub.uy/camarasycomisiones/legisladores/6734`, abierto hoy).
- accion_sugerida: agregar el ítem con esa cita. El nombre del ministerio necesita su propia fuente
  (el decreto de designación del 01/03/2025 o la página del ministerio); sin ella, el `cargo` puede
  decir «Ministro o Subsecretario» tal como lo dice el Parlamento, que es lo que la fuente respalda.

### 3.7 `etcheverry-lucia`, 3.8 `reisch-nibia`, 3.9 `rodriguez-hunter-alvaro` — el molde `2020-02-15 → 2025-02-14` sin ninguna fecha en la fuente
- severidad: corregir (bajo de `bloquea`, y digo por qué)
- campo: `mandatos[].desde`, `mandatos[].hasta`
- tipo: contexto_omitido
- objecion: las tres cargan el período completo de la legislatura apoyadas en una sola fila
  entrelazada de la nómina de 2024, que no trae fechas ni el cargo. Es exactamente la plantilla que
  la adenda prohíbe llenar por defecto (punto 2: «cada fecha sale de la fuente»), y convive en el
  mismo lote con el criterio opuesto de 3.1. Bajo la severidad porque verifiqué el hecho de fondo:
  las tres figuran en los censos del 07/10/2020, del 07/03/2023 y del 22/07/2024, así que el mandato
  existe y es largo; lo que no está probado es el día de asunción.
- cita_de_contexto (censo del 07/10/2020): «Viana, Pablo	Núñez Fallabrino, Gerardo	Etcheverry Lima,
  Lucía FA Canelones FA PN	Montevideo Montevideo»; «Reisch, Nibia	Lafluf Hebeich, Omar	Blás
  Simoncelli, Rodrigo PN Maldonado PN PC	Río Negro Colonia»; «Rodríguez Hunter, Álvaro	Lema, Martín
  Burgoa, Laura (2) PN Flores PN PN	Montevideo Florida».
- accion_sugerida: la misma que 3.1, los diarios del 13 y 15/02/2020. Mientras tanto, las tres citas
  de censo (2020, 2023, 2024) en el mandato y el hueco dicho en `cobertura`.

### 3.10 `lust-eduardo` — el partido no está en ninguna cita
- severidad: corregir
- campo: `partido`
- tipo: contexto_omitido
- objecion: sus dos citas son una convocatoria («por el departamento de MONTEVIDEO hasta el
  14/02/2025 23:59») y una fila entrelazada de la nómina de 2024. Ninguna dice Cabildo Abierto. Es
  la única ficha del lote cuyo `partido` no aparece en ninguna fuente, y es una ficha donde el dato
  no es trivial: Lust rompió públicamente con Cabildo Abierto durante el período.
- cita_de_contexto: «Rodríguez, Conrado	Lust Hitta, Eduardo	Capillera, Elsa CA Montevideo CA PC
  Montevideo Montevideo» (censo del 07/03/2023), que por el encabezado del documento le asigna «CA
  Montevideo».
- accion_sugerida: citar ese renglón junto con el encabezado `REPRESENTANTE REPRESENTANTE
  REPRESENTANTE PART. DEPTO. PART. DEPTO. PART. DEPTO.`, que es lo que hace legible la asignación.
  Si el editor quiere registrar el cambio de bancada, eso es otro registro y otra fuente, no un
  cambio del campo `partido`.

### 3.11 `olaizola-juan-jose` — falta el mandato de la XLIX que tres nóminas prueban
- severidad: corregir
- campo: `mandatos[]`
- tipo: contexto_omitido / asimetria
- objecion: la ficha solo trae el mandato de la L. Olaizola fue titular de la XLIX: aparece nombrado
  como Representante en la llamada al pie de los tres censos, sustituido por Jisdonian mientras era
  Subsecretario de Transporte. La primera crítica ya lo había señalado («lo que además prueba que
  Olaizola, Amarilla y Castaingdebat fueron titulares de la XLIX»); a Amarilla y a Castaingdebat se
  les cargó el mandato y a él no, porque no estaba en la lista de los doce.
- cita_de_contexto: «( ) 5 Sustituye al Representante Juan José Olaizola mientras desempeñe el cargo
  de Subsecretario del Ministerio de Transporte y Obras Públicas» (censo del 07/10/2020).
- accion_sugerida: cargar el mandato de Representante por Montevideo de la XLIX con esa cita, con el
  mismo criterio nominal que se le aplicó a los otros cuatro.

### 3.12 `sabini-sebastian` — «(suplente)» que la cita no dice, y seis días de solapamiento
- severidad: corregir
- campo: `mandatos[1].cargo`, `mandatos[].desde`
- tipo: cita_fuera_de_contexto
- objecion: el tramo de Senado dice `cargo: Senador (suplente)` y la única cita que lo sostiene
  termina en «Titular: Sabini, Sebastián», es decir, lo nombra a él como titular. En Mahía la misma
  fila dice «Titular: Astori, Danilo» y ahí sí queda claro a quién sustituye. Además el mandato de
  Representante llega al 08/03/2022 y el de Senador arranca el 02/03/2022: seis días con las dos
  bandas superpuestas, sin una línea que lo explique.
- cita_de_contexto: en la misma página está la fila que faltaba: «08-03-2022 Renuncia por opción el
  08/03/2022»
  (`https://parlamento.gub.uy/camarasycomisiones/legisladores/9894/actuacion-legislador?Fecha_desde=2022-01-01&Fecha_hasta=2023-12-31`).
- accion_sugerida: usar «Renuncia por opción el 08/03/2022» como fuente del cierre del mandato de
  diputado, y o bien sacar el «(suplente)» o bien conseguir la fila que nombre al titular
  sustituido. El solapamiento es real (fue convocado el 2 y optó el 8), así que se puede dejar, pero
  entonces se aplica el mismo criterio a Mahía y a Caggiani.

### 3.13 `umpierrez-alejo` — `fin_de_mandato` fuera de la regla 5, y falta una suplencia de la misma página
- severidad: corregir
- campo: `estado_actual.salida.tipo`, `mandatos[]`
- tipo: riesgo_legal / contexto_omitido
- objecion: dos cosas. (a) `salida.tipo: fin_de_mandato` con fecha 09/04/2025, cuando la adenda
  reserva ese tipo para el fin del período (14/02/2025). El corrector lo dice él mismo y tiene razón
  en el planteo: el enum de `TipoSalida` (`fin_de_mandato | renuncia | renuncia_forzada |
  destitucion | fallecimiento`) no tiene valor para «se terminó la convocatoria en su fecha».
  (b) La misma página muestra **dos** pasajes al Senado en abril de 2025 y la ficha carga uno solo.
- cita_de_contexto: «01-04-2025 Convocado a la Cámara de Senadoreshasta el 02/04/2025 23:59 tomo 661
  pag.0 d.s.5», «01-04-2025 Pasaje a Senado el 01/04/2025 02/04/2025» y «08-04-2025 Pasaje a Senado
  el 08/04/2025 09/04/2025»
  (`https://parlamento.gub.uy/camarasycomisiones/legisladores/7981/actuacion-legislador?Fecha_desde=2025-04-01&Fecha_hasta=2025-04-15`).
  «Pasaje a Senado el 08/04/2025 09/04/2025» es, además, mejor cita que la que la ficha usa, porque
  no arrastra el «Titular: Umpiérrez, Alejo» que confunde.
- accion_sugerida: cargar las dos suplencias con sus fechas exactas (punto 4 de la adenda) y decidir
  el criterio de salida como regla general, no para este registro (ver 6.2).

### 3.14 `caggiani-daniel` — el tramo de Senador se omitió por un motivo que la adenda ya corrigió
- severidad: corregir
- campo: `mandatos[]`
- tipo: asimetria
- objecion: `_notas_ficha` dice que el tramo de Senado «queda fuera de este lote de Diputados, según
  indica el brief». La adenda dice lo contrario (punto 3: el tramo de senador va como `Senador`;
  punto 8: la ficha lleva todos los mandatos), y a Mahía, Sabini, Umpiérrez, Viera y Zubía se les
  cargó. Además su `legislaturas-actuo` tiene una fila de la L (04→06/07/2025) que la ficha no
  menciona ni descarta.
- cita_de_contexto: «Legislatura XLIX (2020-2025) 02-03-2022 14-02-2025» y «Legislatura L
  (2025-2030) 04-07-2025 06-07-2025»
  (`https://parlamento.gub.uy/camarasycomisiones/legisladores/9916/legislaturas-actuo`, abierto hoy;
  ninguna de las dos filas trae rótulo de cargo).
- accion_sugerida: cargar el tramo de Senador de la XLIX con la fila de `actuacion-legislador` que
  lo nombra, y anotar la fila de 2025 en `notas.md` si no se puede establecer a qué cámara
  corresponde. `situacion: fuera_de_cargo` es correcto: no tiene rótulo de Senador en la L.

### 3.15 `olivera-ana` — `renuncia` sin una fuente que diga renuncia
- severidad: corregir
- campo: `estado_actual.salida.tipo`
- tipo: riesgo_legal
- objecion: es el mismo defecto que la primera crítica bloqueó en seis fichas, reaparecido en una
  que antes era solo un aviso. La única cita de la salida es «Legislatura L (2025-2030) 15-02-2025
  01-03-2026», que dice cuándo terminó, no por qué. A diferencia de las cuatro fichas con
  `_faltante: segunda_fuente`, esta no está marcada.
- accion_sugerida: el diario de sesiones del 01/03/2026 («Renuncia a la banca de la señora
  representante…»), que es el mismo camino que sirvió para Irigoin, Irazábal, Dos Santos, Mendiondo
  y Núñez Fallabrino. Mientras tanto, `_faltante: segunda_fuente` y `probable`.

### 3.16 `antonini-eduardo`, `ferreira-zulimar`, `viera-nicolas` — el departamento no está en ninguna cita
- severidad: corregir
- campo: `mandatos[].cargo`
- tipo: riesgo_legal
- objecion: los tres dicen «Representante Nacional por Maldonado / por Tacuarembó / por Colonia» y
  ninguna de sus citas nombra el departamento: la nota al pie de `LegxPartido.pdf` no lo trae, y la
  línea de `legislaturas-actuo` («Representante Nacional por el Lema PARTIDO FRENTE AMPLIO -
  Legislatura XLIX») tampoco. Abrí las tres páginas individuales (12659, 9997, 11626) y hoy solo
  muestran el cargo actual, «Senador de la República por el Lema PARTIDO FRENTE AMPLIO», sin
  departamento: la solución que sirvió para Olaizola, Rielli, Satdjián, Schipani y Valverde no sirve
  para estos tres.
- cita_de_contexto: el censo del 07/10/2020 los trae con departamento («Pérez Bonavita, Silvana
  Hugo, Claudia	Antonini, Eduardo FA Maldonado…»; «…Viera Díaz, Nicolás	Olivera Pessano, Ana María
  Ferreira, Zulimar FA Tacuarembó FA FA	Montevideo Colonia»).
- accion_sugerida: ese censo, o un diario de sesiones de la XLIX, que es como se resolvió en
  `morel-christian` («CHRISTIAN MOREL, Representante por Cerro Largo»).

### 3.17 `fajardo-maria` — la nómina de la L citada para el mandato de la XLIX
- severidad: corregir
- campo: `mandatos[0].fuentes[1]`
- tipo: cita_fuera_de_contexto
- objecion: el mandato «25/11/2020 → 14/02/2025» se apoya, además de en su fila de
  `legislaturas-actuo`, en `https://documentos.diputados.gub.uy/docs/LegAlfab.pdf`, que es la nómina
  **de hoy** (L Legislatura). Ese documento prueba que es diputada ahora, no que lo fuera en la
  XLIX. La primera fuente alcanza sola; la segunda dice otra cosa.
- accion_sugerida: reemplazarla por el censo del 07/03/2023 o del 22/07/2024, donde sí figura, o
  quitarla.

### 3.18 `lema-martin` — una URL viva citada para un documento de 2023
- severidad: corregir
- campo: `mandatos[1].fuentes[1].url`
- tipo: presentacion (cita que se puede romper sola)
- objecion: la cita «Sustituye al Representante Martín Lema mientras desempeñe el cargo de Ministro
  de Desarrollo Social» sale de `http://www.diputados.gub.uy/docs/LegAlfab.pdf`. Ese archivo hoy
  sirve la nómina con fecha interna 07/03/2023 —lo abrí—, pero es una URL viva que se actualiza: el
  día que la Cámara la reemplace, la cita deja de existir y el lector que haga clic va a ver un
  documento que no dice eso. `cardoso-german` y `castaingdebat-armando` citan la captura archivada
  para el mismo tipo de nota al pie; esta no.
- accion_sugerida: citar
  `https://web.archive.org/web/20240510140313/http://www.diputados.gub.uy/docs/LegAlfab.pdf` (o
  pedir una captura nueva con `pnpm archivar`). Además, la URL escrita en la ficha no es la que el
  corpus guardó: `pnpm fuente` la canonizó a `https://diputados.gub.uy/docs/LegAlfab.pdf`.

### 3.19 `pereyra-anibal` — el departamento apoyado en un diario de 2005
- severidad: corregir
- campo: `mandatos[0].fuentes[1]`
- tipo: cita_fuera_de_contexto
- objecion: el mandato de Representante por Rocha de la **L** se apoya en la nota al pie de
  `LegxPartido.pdf` (que no nombra el departamento) y en un diario de sesiones del **01/06/2005**
  («ANÍBAL PEREYRA, Representante por Rocha»). Es el mismo defecto que la primera crítica objetó en
  `umpierrez-alejo`: un dato de veinte años atrás usado para fijar el departamento de un mandato de
  2025. La ficha es nueva, así que la objeción no viene de arrastre.
- cita_de_contexto: la nómina de hoy lo resuelve en el mismo renglón: «Valverde, Sergio	Tinaglini,
  Gabriel (5)	Cairo, Cecilia MONTEVIDEO SAN JOSÉ	ROCHA», con «( ) 5 Sustituye al Representante
  Aníbal Pereyra mientras desempeñe el cargo de Senador de la República»
  (`https://documentos.diputados.gub.uy/docs/LegxPartido.pdf`, leído hoy): quien ocupa su banca es
  el representante por Rocha, y por lo tanto la banca es de Rocha.
- accion_sugerida: usar ese par de citas y dejar el diario de 2005 para el mandato de 2005-2010, si
  alguna vez se carga.

### 3.20 `melo-ana-laura` — el partido no está en la cita, y el cargo tampoco
- severidad: corregir
- campo: `partido`, `mandatos[0]`
- tipo: contexto_omitido
- objecion: la única fuente es «Melo Cedrés, Ana Laura FLORES». El corrector acertó al verificar que
  esa entrada es aislada y que el departamento sí le corresponde —lo confirmé—, pero la cita no dice
  ni «Representante» ni «Frente Amplio», y la fila de `LegxPartido.pdf` está impresa justo antes de
  un encabezado de otro partido («…Fajardo Rieiro, María de los Á SORIANO PARTIDO Cabildo Abierto (2
  bancas)»), así que la pertenencia no se puede leer de ahí.
- cita_de_contexto: `LegAlfab.pdf` de hoy sí lo trae, con el encabezado que lo hace legible:
  «REPRESENTANTE	REPRESENTANTE REPRESENTANTE	PART. DEPTO. PART. DEPTO.	PART. DEPTO.» … «Sierra,
  Julieta	Melo Cedrés, Ana Laura	de Armas González, Paula PC Canelones FA FA	Flores Montevideo»
  (`https://documentos.diputados.gub.uy/docs/LegAlfab.pdf`), que asigna FA y Flores a Melo.
- accion_sugerida: esa cita, con el renglón de encabezado incluido.

### 3.21 Quince mandatos cuya cita es una hilera de apellidos y departamentos sin encabezado
`andujar-sebastian`, `blas-rodrigo`, `de-mattos-alfredo`, `etcheverry-lucia`, `fajardo-maria`,
`goni-rodrigo`, `ibarguren-sylvia`, `jisdonian-pedro`, `mazzini-agustin`, `medina-nino`,
`melo-ana-laura`, `reisch-nibia`, `rodriguez-hunter-alvaro`, `soravilla-emiliano`,
`valdomir-sebastian`
- severidad: corregir
- campo: `mandatos[].fuentes[].cita`
- tipo: presentacion / riesgo_legal
- objecion: verifiqué las quince decodificaciones contra la página individual o contra otro censo y
  **las quince aciertan**; el problema no es el dato, es que el lector ve «Camargo Bulmini, Nazmi
  Goñi Reyes, Rodrigo Lima, Álvaro SALTO RIVERA MONTEVIDEO» y no tiene forma de saber que a Goñi le
  toca Montevideo. La cadena de evidencia no está a la vista, que es el mismo motivo por el que la
  primera crítica objetó las otras ocho. Se agrava porque la extracción entrelaza columnas de
  secciones de partidos distintos (en una misma fila conviven una diputada del PC, uno del PN y una
  del FA), así que de esa cita tampoco se puede leer el partido.
- accion_sugerida: una sola, y sirve para las quince: incluir en la `cita` el renglón de encabezado
  del propio documento, `REPRESENTANTE REPRESENTANTE REPRESENTANTE PART. DEPTO. PART. DEPTO. PART.
  DEPTO.`, junto con la fila. Con eso el lector lee la tabla como está impresa y la regla deja de ser
  una decisión invisible del investigador.

### 3.22 Tres colisiones de alias sin resolver
- severidad: corregir
- campo: `alias`
- tipo: presentacion / riesgo_legal
- objecion: crucé los alias de las 66 fichas contra `content/politicos/` y contra las 91 de
  `inbox/diputados/todos/`. Quedan tres alias compartidos por dos personas, y ninguna de las fichas
  implicadas los declara en `alias_ambiguos`:
  - **«Delgado»** → `delgado-juan-pablo` (PN, Canelones) y `content/politicos/delgado.yaml` (Álvaro
    Delgado, candidato presidencial). Es la más grave: los alias etiquetan el corpus de forma
    determinista, así que cada nota sobre Álvaro Delgado que diga «Delgado» quedaría también
    etiquetada al diputado.
  - **«Araújo»** → `araujo-mary` (FA, Maldonado) y `araujo-yisela` (FA, Cerro Largo).
  - **«Echeverría»** → `echeverria-diego` (PN, Maldonado) y `echeverria-solis` (CA, Tacuarembó).
  Las otras tres (Mujica, Salle, Pereyra) quedaron bien resueltas, con el apellido retirado y
  `alias_ambiguos` explicando la desambiguación; ese es el modelo.
- accion_sugerida: el mismo tratamiento en las seis fichas implicadas.

### 3.23 Las 66 fichas se publicarían sin una línea que diga qué se buscó
- severidad: corregir
- campo: `cobertura`
- tipo: presentacion
- objecion: ninguna de las 66 tiene `cobertura`. El esquema creó ese campo para exactamente este
  caso, y lo dice en su propio comentario: «Para un legislador con poca cobertura, una página con
  secciones vacías parece descuido o parece que el sitio esconde algo». Estas fichas no tienen
  declaraciones, ni promesas, ni chequeos, ni casos: el lector va a ver una ficha con varias
  secciones vacías y ningún motivo. Es el punto 19 de la lista de control («una sección sin
  registros es una línea, con la explicación de por qué falta plegada») y el punto 11 («un hueco no
  es un cero»).
- accion_sugerida: una `cobertura.texto` corta por ficha, o por tanda, que diga qué se revisó
  (páginas oficiales del Parlamento, nóminas de la Cámara, diarios de sesiones), qué período y qué
  no se buscó todavía (declaraciones, votaciones, patrimonio). Es también el lugar donde declarar
  los huecos de 3.1 y 3.7-3.9 («la fecha exacta de asunción no consta en los documentos publicados;
  el primer registro oficial que lo ubica en la banca es del …»), porque `Mandato` es `.strict()` y
  no tiene campo `nota`. Cuidado con `pnpm revisar:paginas`: ese texto no puede contar el proceso
  («en esta corrida», «el editor», ids de corrida); dice qué hay y qué falta.

### 3.24 `mier-sergio`, `minetti-orquidea`, `morel-christian`, `sanchez-cal-dardo` — `renuncia` sin cita, bien marcado
- severidad: corregir
- campo: `estado_actual.salida.tipo`
- tipo: contexto_omitido
- objecion: los cuatro afirman `renuncia` y ninguna de sus citas de salida contiene la palabra; los
  cuatro llevan `_faltante: segunda_fuente`, que es la conducta correcta. Lo digo igual porque el
  editor tiene que verlo: son cuatro salidas anticipadas con el motivo afirmado y sin respaldo.
- accion_sugerida: `probable` hasta que el resolvedor traiga el diario (para Minetti, `notas.md` ya
  localizó el índice: d.s. del 05/07/2022, «Renuncia a la banca de la señora representante Orquídea
  Minetti … 39»).

### 3.25 `mujica-gonzalo` — una fuente que no respalda el mandato y afirma otro partido
- severidad: corregir
- campo: `mandatos[0].fuentes[1]`
- tipo: cita_fuera_de_contexto
- objecion: la segunda fuente del mandato de la XLIX es Wikipedia y la cita es «En las elecciones
  nacionales de 2014 fue elegido, por tercera vez consecutiva, diputado de Montevideo por el Espacio
  609 del Frente Amplio». Habla de 2014, no del mandato 2020-2025 que acompaña, y es la única
  mención de partido en una ficha cuyo `partido` es Partido Nacional. Es el patrón de «segunda
  fuente falsa»: una fuente real que prueba otro hecho, colgada de la cita que no prueba. Además
  `content/medios/wikipedia.yaml` declara que el validador de tiers no la acepta como fuente textual
  ni oficial.
- accion_sugerida: quitarla. La primera fuente (`legislaturas-actuo` con el rótulo completo) alcanza
  sola. Si interesa el cambio de partido, es otro registro con otra fuente.

### 3.26 `irigoin-pedro` — sin rótulo de cargo para el tramo de la L, y un día de diferencia
- severidad: aviso
- campo: `mandatos[1]`
- tipo: contexto_omitido
- objecion: sigue sin resolverse, y el corrector lo dejó anotado con el motivo, que es honesto.
  Además el mandato cierra el 08/07/2025 mientras la fila citada dice «02-03-2025 09-07-2025»; el
  diario del 08/07 respalda la renuncia, así que el desfasaje tiene explicación, pero el lector ve
  una cita que no coincide con la fecha.
- accion_sugerida: el diario de sesiones del 08/07/2025 que la ficha ya cita sirve también para el
  cargo («Renuncia a la banca del señor representante Pedro Irigoin Macari» supone la banca);
  alcanza con sumarlo a las fuentes del mandato.

### Fichas sin objeción (25)

Condenso, como pide el punto 14 de la lista de control, en vez de repetir 25 bloques iguales.
Motivo: mandato con el cargo nombrado en la cita, fechas coherentes con la fuente y con los tres
censos de la XLIX que crucé, partido y departamento respaldados, y salida con una fuente que dice lo
que la salida afirma.

- **Partido Nacional (10)**: besozzi-guillermo, dos-santos-valentina, enciso-carlos, garcia-mario,
  irazabal-benjamin, lafluf-omar, olivera-nicolas, rielli-domingo, satdjian-jose-luis,
  valverde-sergio.
- **Frente Amplio (8)**: carballo-felipe, civila-gonzalo, inthamoussu-pablo, lorenzo-nicolas,
  pereyra-estela, pereyra-susana, rodriguez-galvez-carlos, umpierrez-javier.
- **Partido Colorado (6)**: cardoso-german, de-armas-paula, de-brum-horacio, rodriguez-conrado,
  schipani-felipe, zubia-gustavo.
- **Identidad Soberana (1)**: salle-nicolle.

Cuatro que conviene mirar por lo bien resueltas, porque son el modelo del resto:
`dos-santos-valentina` (salida con el «VISTO: La nota de renuncia a su banca presentada por la señora
representante por el departamento de Artigas, Valentina Dos Santos»), `garcia-mario` y `lafluf-omar`
(la segunda fuente que antes era la página de Martín Lema ahora es la propia, con «Renuncia por
pasaje a Intendente el 25/11/2020»), e `inthamoussu-pablo` (id corregido a la grafía oficial y
nombre completo sacado del diario de la sesión preparatoria, que es justamente el documento que le
falta a las cuatro fichas de 3.1).

Salvedad honesta sobre `enciso-carlos`: su salida se apoya en la intervención de un colega («hoy es
un día especial, porque hemos votado la renuncia de Carlos Enciso, para nosotros, más conocido como
el Pájaro»). Prueba que la Cámara votó la renuncia y por eso no lo objeto, pero es más flojo que el
«VISTO: la nota de renuncia» que tienen los demás.

---

## 4. Objeciones de forma que siguen abiertas

### 4.1 Veinticinco fichas con `nombre` igual a `nombre_corto`
- severidad: aviso (bajo de `corregir`)
- objecion: `amarilla-gerardo`, `andujar-sebastian`, `antonini-eduardo`, `araujo-mary`,
  `caggiani-daniel`, `cardoso-german`, `de-mattos-alfredo`, `dos-santos-valentina`,
  `jisdonian-pedro`, `lorenzo-nicolas`, `medina-nino`, `mier-sergio`, `olaizola-juan-jose`,
  `pereyra-anibal`, `pereyra-estela`, `reisch-nibia`, `rodriguez-hunter-alvaro`, `sabini-sebastian`,
  `salle-nicolle`, `sanchez-cal-dardo`, `satdjian-jose-luis`, `schipani-felipe`,
  `valdomir-sebastian`, `valverde-sergio`, `zubia-gustavo`.
- motivo de la baja: el corrector verificó, para `araujo-mary`, que la nómina oficial no trae otra
  forma que «Araújo, Mary», y eso es cierto para buena parte de la lista. Donde la fuente oficial no
  da un segundo apellido, `nombre` = `nombre_corto` no es un defecto: es el nombre oficial.
- accion_sugerida: si el editor quiere uniformidad, la biografía en PDF de cada persona
  (`parlamento.gub.uy/sites/default/files/personas/biografias/Bio<id>.PDF`, que el lote ya usa en
  `sanchez-cal-dardo`) la trae. Son 25 descargas; es una corrida aparte, no un bloqueo.

### 4.2 Cuarenta y cinco fuentes con la fecha del hecho en vez de la de consulta
- severidad: aviso
- objecion: en 38 fichas, páginas de `parlamento.gub.uy` consultadas hoy llevan `fecha: 2020-02-15`,
  `2020-11-18`, `2025-04-08`, etc. La misma URL aparece en dos fichas distintas con dos fechas
  distintas. La página agrupa las fuentes por publicador y muestra la fecha; el lector va a ver una
  inconsistencia que no significa nada.
- accion_sugerida: criterio único (fecha de la página consultada), con `retrieved_at` para la
  consulta, o al revés, pero uno solo.

### 4.3 `medio: parlamento` para tres dominios que la ficha del medio no declara
- severidad: aviso
- objecion: las 171 fuentes no-Wikipedia usan `medio: parlamento`, y 43 de ellas apuntan a
  `documentos.diputados.gub.uy` (7), `diputados.gub.uy` (1), `biblioteca.parlamento.gub.uy` (14) y
  `web.archive.org` (21). `content/medios/parlamento.yaml` solo declara `parlamento.gub.uy` entre
  sus alias. El validador no lo mira, pero la agrupación por publicador de la página sí.
- accion_sugerida: agregar `documentos.diputados.gub.uy`, `diputados.gub.uy` y
  `biblioteca.parlamento.gub.uy` a `alias` de `content/medios/parlamento.yaml`. Es una edición de
  `content/`, fuera del alcance del investigador; el corrector hizo bien en no tocarla. Para
  `web.archive.org` el `medio` correcto es el publicador, así que ahí está bien.

### 4.4 Bandas de ancho cero en la línea de mandatos
- severidad: aviso
- tipo: presentacion
- objecion: `echeverria-solis` tiene un mandato de dos minutos (`desde` = `hasta` = 2020-02-15) y
  `umpierrez-alejo` uno de dos días (que van a ser dos, ver 3.13). `cobertura.ts` los va a dibujar
  como bandas de ancho cero. Es el punto 18 de la lista de control (legible al 100 %, medido y no
  supuesto) y el 13 (los ítems son puntos con rótulo cuando son pocos).
- accion_sugerida: mirar una captura al 100 % de esas dos fichas con el fragmento de
  `docs/revision-visual.md` antes de commitear, y si la banda no se ve, dibujarla como punto.

### 4.5 Seis salidas «por pasaje a Intendente» sin la intendencia
- severidad: aviso
- objecion: `besozzi-guillermo`, `garcia-mario`, `lafluf-omar`, `olivera-nicolas`,
  `soravilla-emiliano` y `umpierrez-alejo` citan «Renuncia por pasaje a Intendente» y ninguno carga
  el mandato de intendente. El criterio es uniforme dentro del lote y está bien declarado en
  `notas.md`. Lo anoto porque los seis son del Partido Nacional (por resultado electoral, no por
  selección) y porque cuando se haga el lote de intendencias hay que cargarlas todas: si el sitio
  termina con seis intendencias del PN documentadas y ninguna de otros partidos, el problema de
  simetría lo va a tener el sitio, no este lote.

---

## 5. Objeciones al lote

### 5.1 La cobertura de las dos legislaturas sigue abierta, pero ya no depende de este lote
Las dos objeciones que bloqueaban en la primera crítica (14 personas sin ficha en la L, 32 en la
XLIX) siguen sin cerrarse acá: este lote suma una (Aníbal Pereyra) y el mandato de la L de Viera. El
resto está en `inbox/diputados/critica-faltantes/` (168 fichas) y en los cuatro lotes de suplentes
(269), que se critican aparte. Consecuencia para el editor: **este lote se puede promover sin cerrar
el censo, pero el censo no se puede declarar cerrado hasta que esos lotes entren**, y hasta entonces
el enlace con `content/votaciones/` va a quedar incompleto, que era el motivo del encargo.

### 5.2 Penadés: el mismo criterio, aplicado a una ficha ya publicada
`content/politicos/penades.yaml` tiene, para la XLIX, «Senador de la República | 2020-03-03 →
2023-10-11» y ningún mandato de Representante. El censo del 07/10/2020 dice: «( ) 1 Sustituye al
Representante Gustavo Penadés mientras desempeñe el cargo de Senador», con «Abt, Andrés (1) PN
Montevideo» ocupando la banca. Es la misma situación exacta de Mahía, Antonini, Ferreira, Viera y
Aníbal Pereyra, a quienes este lote sí les carga el mandato nominal de Representante. Los cinco son
del Frente Amplio; el que queda sin el mandato es del Partido Nacional. No hay nada que indique que
fuera deliberado —Penadés estaba excluido del lote por otro motivo, y la primera crítica dio por
fundada esa exclusión con la información que había— pero el resultado publicado sería asimétrico y
hay que corregirlo con el mismo documento que se usó para los otros cinco.
- severidad: corregir (fuera de este lote: es una corrección sobre `content/`, tipo
  `cotejo_con_primaria`)
- accion_sugerida: agregar a `penades.yaml` el mandato de Representante Nacional por Montevideo de
  la XLIX con esa nota al pie. De paso, revisar si corresponde el mismo tratamiento a Alejandro
  Sánchez: no figura en ninguna de las notas al pie de los tres censos, así que por ahora su
  exclusión se sostiene.

### 5.3 Simetría del lote, con números
De las 66 fichas, 41 quedan con al menos una objeción: Frente Amplio 20 de 28, Partido Nacional 18
de 28, Cabildo Abierto 2 de 2, Partido Colorado 1 de 7, Identidad Soberana 0 de 1. Las cuatro que
bloquean son todas del Partido Nacional y las tres del molde `2020-02-15 → 2025-02-14` son FA, PC y
PN. Reviso mi propia crítica con el mismo criterio con que reviso el lote: no encuentro una regla
que haya aplicado a un partido y no a otro; el desbalance viene de que los errores de método se
concentraron en las fichas sin línea de cargo en `legislaturas-actuo`, y esas no se reparten parejo.

### 5.4 Ids que se renombran solos y rompen otro lote
- severidad: corregir
- objecion: `pnpm validar --inbox` ya asigna `armas-paula`, `brum-horacio` y `mattos-alfredo` a
  `de-armas-paula`, `de-brum-horacio` y `de-mattos-alfredo`, porque `slugificar()` (en
  `scripts/lib/contenido.ts`) descarta «de» como palabra vacía. Los ids son la ruta del archivo y no
  se renombran nunca, así que `/politicos/armas-paula/` va a nombrar para siempre a una persona cuyo
  apellido es «de Armas González». Y hay una consecuencia que `notas.md` no vio:
  `inbox/votaciones/2020/votaciones.yaml` cita **6 veces** `rodriguez-carlos-florida` (id que este
  lote cambió a `rodriguez-galvez-carlos`) y **6 veces** `de-mattos-alfredo` (id que `promover` va a
  convertir en `mattos-alfredo`). Las doce referencias quedan colgadas.
- accion_sugerida: que el editor decida los tres ids a conciencia antes de `promover` —dos caminos:
  aceptar la forma truncada, o que `_slug` no pase por `PALABRAS_VACIAS`, que es un cambio de una
  línea en `scripts/lib/inbox.ts` y le toca al mantenedor— y que actualice las doce referencias de
  `inbox/votaciones/2020/votaciones.yaml` en la misma tanda.

### 5.5 El aviso de simetría con 170 renglones
Sin resolver, y no es del lote: al promover, cada tema va a listar entre 150 y 175 nombres en
«Cobertura asimétrica: … sin ningún registro en este tema». Ya se ve en la corrida de `pnpm validar`
de hoy (86 nombres en `salud`, 86 en `transparencia-corrupcion`, 83 en `economia/combustibles`). Es
el punto 14 de la lista de control. Sugerencia: condensarlo a un número con enlace, como el punto 15
pide para los contadores.

---

## 6. Objeciones al brief y a su adenda

**Regla 0: ni el brief ni la adenda la violan.** Piden los 99 de cada legislatura, de todos los
partidos, con la misma ficha y el mismo documento, y lo dicen explícitamente («el documento que se
le exige a un diputado se le exige a los 99»). El lote lo cumplió: no hay un adjetivo valorativo en
las 66 fichas ni un dato buscado para un partido y no para otro. Las asimetrías que encontré (3.5,
3.6, 3.11, 5.2) son de aplicación, no de criterio.

Dos correcciones a la adenda, porque el próximo lote la va a usar:

### 6.1 «Quien figura ahí es titular de esa legislatura» no es exacto
El punto 1 de la adenda dice que quien figura en la nómina es titular. No: los 99 de la nómina son
los que **están ejerciendo**, e incluyen a los suplentes de quienes están en el Senado o en el
Ejecutivo, marcados con una llamada al pie. El titular es el nombrado en la llamada. Eso produjo 3.2
(Jisdonian cargado como titular cinco años) y dejó sin mandato a Olaizola (3.11) y a Penadés (5.2).
Redacción correcta: *quien figura sin llamada al pie es titular en ejercicio; quien figura con
llamada es suplente en ejercicio y el titular es el de la llamada; quien solo aparece nombrado en
una llamada es titular sin ejercicio*.

### 6.2 `fin_de_mandato` «solo el 14/02/2025» deja casos sin ningún valor válido
El punto 5 reserva `fin_de_mandato` para el fin del período. El enum de `TipoSalida` tiene cinco
valores (`fin_de_mandato | renuncia | renuncia_forzada | destitucion | fallecimiento`) y ninguno
sirve para «se terminó una convocatoria en la fecha que tenía fijada», que es el caso de
`umpierrez-alejo` y el de cualquier suplente. El corrector lo planteó bien y pidió que se resuelva
como regla general. Redacción sugerida: *`fin_de_mandato` es el fin del cargo por llegar a su
término previsto —el de la legislatura, el de la convocatoria o el del período ejecutivo—; una
salida anticipada lleva su propio tipo y la fuente que la nombra*. Así deja de haber registros
forzados y sigue prohibido usarla para tapar una renuncia sin documentar.

### 6.3 La respuesta a la pregunta del encargo: no, `desde` parcial no alcanza
El encargo pregunta si las fechas de asunción que quedaron como «piso documentado» alcanzan para
publicar con `desde` parcial (`YYYY-MM`). No, por tres motivos y en este orden:

1. **En los cuatro casos donde se usó, el piso está refutado** (3.1). `desde: 2024-07` en vez de
   `desde: 2024-07-22` no arregla nada: sigue diciendo que Blás asumió en julio de 2024 cuando ya
   era titular en octubre de 2020. Un dato equivocado con menos precisión sigue siendo equivocado.
2. **`FechaParcial` sirve para otra cosa.** El esquema la describe como «según lo que la fuente
   permita afirmar» *sobre la fecha*: la fuente dice «en 1990» o «en marzo». Acá la fuente no dice
   nada sobre la fecha de asunción; dice que la persona ya estaba en la banca tal día. Son dos
   proposiciones distintas, y poner la segunda en el campo de la primera es afirmar más de lo que la
   fuente respalda.
3. **Hay lugar para decir el hueco, y no es `desde`.** `Mandato` es `.strict()` y no tiene `nota`,
   pero el esquema del político tiene `cobertura` (texto y fecha) para exactamente esto (3.23). El
   mandato lleva la fecha que un documento prueba; `cobertura` dice que el día de asunción no consta
   en los documentos publicados y cuál es el primer registro que ubica a la persona en la banca. Y
   si el editor prefiere no afirmar nada, la ficha va a `probable`, que es donde va lo que tiene una
   fuente faltante.

Y el atajo, que existe y es barato: **el diario de sesiones de la sesión preparatoria del 13/02/2020
y el de la primera sesión del 15/02/2020** listan a los 99 que asumieron. Es la fuente 2 del brief,
el lote ya la usó bien para la L (`inthamoussu-pablo`, d.s. del 13/02/2025), y con dos documentos se
cierra el `desde` de toda la legislatura en vez de discutirlo ficha por ficha. Lo mismo que se le
exige a Blás se le exige a Etcheverry: es el mismo documento para los 99.

---

## Cobertura

**Ningún registro de tono, y no por olvido.** Los registros de `cobertura` se emiten por cada nota de
prensa leída en el lote, y en este lote no hay ninguna: las 172 fuentes se reparten en 128 de
`parlamento.gub.uy`, 21 de `web.archive.org` (que republican documentos de la Cámara), 14 de
`biblioteca.parlamento.gub.uy`, 8 de `documentos.diputados.gub.uy` / `diputados.gub.uy` y 1 de
`es.wikipedia.org`, que es una enciclopedia y no un medio periodístico. No hay nada de qué medir el
tono, y fabricar registros de tono sobre documentos oficiales sería inventar una métrica.

```yaml
# ninguno
```

**`discrepancias.yaml`: tampoco, y con motivo.** Encontré varias distancias entre documentos —el
`legislaturas-actuo` de Andújar, Blás, De Mattos y Goñi contra los tres censos de la Cámara; la
nómina de la L contra la de la XLIX— pero las dos partes son publicaciones del mismo organismo
oficial, no un medio contra el documento que lo decide. El esquema de `discrepancias` mide lo
segundo. Van como objeción de registro, que es donde corresponden.

---

## Resumen

- **Bloquean: 4 registros** — `andujar-sebastian`, `blas-rodrigo`, `de-mattos-alfredo`,
  `goni-rodrigo`, los cuatro por la misma causa: la fecha de inicio del mandato de la XLIX está
  contradicha por el censo de la Cámara del 07/10/2020.
- **Corregir: 32 registros** en 22 objeciones temáticas, más 3 objeciones de lote (Penadés, los ids
  que rompen `inbox/votaciones/2020`, y `cobertura` ausente en las 66).
- **Avisos: 5 objeciones** de forma (nombres, fechas de fuentes, medio, bandas de ancho cero,
  intendencias) y 1 registro (`irigoin-pedro`).
- **Sin objeción: 25 registros.**
- De las 9 objeciones que bloqueaban en la primera crítica, **las 9 se resolvieron con fuente**; dos
  de esas resoluciones dejaron un resto (`etcheverry-lucia`, `castaingdebat-armando`) y una lo
  empeoró (`blas-rodrigo` pasó de no tener mandato a tener uno mal fechado).
- **El lote no puede ir entero al editor.** Puede ir, junto con las 91 fichas sin objeción de
  `inbox/diputados/todos/`, el subconjunto de **25 fichas sin objeción más las que solo tienen
  objeciones resolubles sin volver a la fuente** (alias, cita a reemplazar por una que ya está
  identificada en esta crítica, ítem ejecutivo con la cita que la ficha ya tiene). Las 4 que
  bloquean y las que necesitan un documento nuevo —los diarios del 13 y 15/02/2020, el diario del
  01/03/2026 de Olivera Ana, el decreto del gabinete del 01/03/2025 para Amarilla y Castaingdebat—
  van a una tercera vuelta, que es corta: son tres documentos.


---

# Crítica — corrida 2026-09-09-diputados-49-50

Modelo: Opus 5 (claude-opus-5[1m]), como corresponde al crítico según la regla 14 de `CLAUDE.md`.
Lote: `inbox/diputados/todos/` (fusión de `l-a-l`, `l-m-z`, `xlix-a-l`, `xlix-m-z`)
Registros revisados: 156 fichas de `politicos.yaml` (188 mandatos, 184 de ellos de Representante; 274 fuentes)
Fichas abiertas contra la fuente con `pnpm fuente` en esta sesión: 37 fichas individuales de
`parlamento.gub.uy` (páginas `legisladores/<id>`, `legisladores/<id>/legislaturas-actuo` y
`legisladores/<id>/actuacion-legislador`) más 4 documentos oficiales de nómina.

Severidades: `bloquea` = el registro afirma algo que la fuente no respalda o que otra fuente
oficial contradice; `corregir` = se publica después de un cambio concreto; `aviso` = para el editor.
(El pedido usaba `bloqueante / corregir / aceptar`; `aceptar` es acá `sin_objecion`.)

---

## Hallazgo de método que ordena casi todo lo que sigue

Las cuatro corridas apoyaron la mayoría de los mandatos en
`parlamento.gub.uy/camarasycomisiones/legisladores/<id>/legislaturas-actuo`. Esa página **no dice
qué cargo ejerció la persona salvo cuando antepone la línea «Representante Nacional por el Lema
PARTIDO X - Legislatura N»**. Cuando la fila aparece pelada («Legislatura XLIX (2020-2025)» y dos
fechas), esa fila puede ser:

- una **suplencia** de uno o dos días en Diputados (Blás: 13/08/2024-14/08/2024; Andújar:
  15/05/2024; De Mattos: 05/12/2023-08/12/2023),
- un **pasaje al Senado** (Mahía, Caggiani, Sabini: ver abajo, con la cita que lo prueba),
- o simplemente **un dato incompleto**: Eduardo Lust tiene una sola fila de nueve días en
  diciembre de 2022 y fue titular de la banca toda la legislatura.

El lote trató las tres cosas como lo mismo. 43 de los 184 mandatos de Representante cargados no
tienen esa línea en ninguna de sus citas. La distribución por partido no es pareja y conviene
decirlo con números, aunque nada indica intención: Partido Nacional 21 de 54 (39 %), Frente Amplio
15 de 84 (18 %), Partido Colorado 5 de 29 (17 %), Cabildo Abierto 2 de 13 (15 %). La corrección es
la misma para todos: ningún mandato se publica sin una fuente que diga el cargo.

Los dos documentos que resuelven casi todo esto, y que el lote no usó, existen y los abrí:

| Documento | Qué da | Estado |
|---|---|---|
| `https://documentos.diputados.gub.uy/docs/LegAlfab.pdf` | Nómina alfabética de la L con **partido y departamento contiguos al nombre** («Abdala, Pablo PN Montevideo», «Cervini Pratto, Walter PC Canelones») | vivo, leído hoy |
| `https://documentos.diputados.gub.uy/docs/Legxdpto.pdf` | Nómina de la L por departamento, con la cantidad de bancas de cada uno | vivo, leído hoy |
| `https://documentos.diputados.gub.uy/docs/LegxPartido.pdf` | Los 99 titulares de la L al 09/09/2026, con las cinco notas al pie de sustitución | vivo, leído hoy |
| `https://web.archive.org/web/20240722113854id_/https://documentos.diputados.gub.uy/docs/LegxPartido.pdf` | **Los 99 titulares de la XLIX al 22/07/2024**, con tres notas al pie de sustitución | única captura en Wayback (verificado con el índice CDX) |

La captura de 2024 es la que refuta o confirma media docena de registros. `LegAlfab.pdf` es la
fuente correcta para los ocho registros cuyo departamento hoy sale de una fila de tres columnas
desordenada.

---

## Objeciones por registro

### `mahia-jose-carlos` — mandato XLIX «Representante Nacional por Canelones 2022-11-15 → 2025-02-14»
- severidad: **bloquea**
- tipo: cita_fuera_de_contexto / riesgo_legal
- objecion: el registro convierte en mandato de diputado el tramo en que Mahía fue **senador**.
  La fila que cita («Legislatura XLIX (2020-2025) 15-11-2022 14-02-2025») no lleva la línea
  «Representante Nacional». Su propia página de actuación dice lo contrario, y con todas las letras.
- cita_de_contexto: «Convocado a la Cámara de Senadores por el lema PARTIDO FRENTE AMPLIO, sublema
  PLURALISMO FRENTEAMPLISTA hasta el 14/02/2025 23:59 Titular: Astori, Danilo» y, en el mismo
  listado, «Iniciativa Asunto: 157283 ; MAHIA, JOSÉ CARLOS. BANCA CÁMARA REPRESENTANTES. RENUNCIA.»
  (`https://parlamento.gub.uy/camarasycomisiones/legisladores/2921/actuacion-legislador?Fecha_desde=2022-11-01&Fecha_hasta=2024-12-31`).
  Confirmación independiente: la nómina de Representantes de la XLIX al 22/07/2024 no lo lista.
- accion_sugerida: invertir el registro. El mandato de Representante por Canelones va de
  2020-02-15 a 2022-11-15 (renunció a la banca), y desde esa fecha hasta 2025-02-14 fue Senador
  sustituyendo a Astori. El mandato de la L sí está bien (su página lleva la línea «Representante
  Nacional por el Lema PARTIDO FRENTE AMPLIO - Legislatura L»), y hoy la banca la ejerce Luis
  Enrique Gallo: «Sustituye al Representante José Carlos Mahia mientras desempeñe el cargo de
  Ministro de Educacion y Cultura» (`LegxPartido.pdf`), que es la cita que corresponde.

### `caggiani-daniel` — mandato XLIX «Representante Nacional por Montevideo 2022-03-02 → 2025-02-14»
- severidad: **bloquea**
- tipo: cita_fuera_de_contexto
- objecion: mismo error. La fila citada no dice el cargo, y su actuación parlamentaria muestra que
  en ese tramo estaba en el Senado.
- cita_de_contexto: «Convocado a la Cámara de Senadoreshasta el 14/02/2025 23:59»
  (`https://parlamento.gub.uy/camarasycomisiones/legisladores/9916/actuacion-legislador?Fecha_desde=2022-11-01&Fecha_hasta=2024-12-31`).
  No figura en la nómina de Representantes al 22/07/2024.
- accion_sugerida: el propio `notas.md` ya traía la pista y la descartó: «desde el 15-02-2020 estuvo
  "Convocado a la Cámara de Representantes por el departamento de MONTEVIDEO hasta el 08/03/2022"».
  Ese es el mandato de Diputados. Cargar 2020-02-15 → 2022-03-08 con un diario de sesiones y dejar
  el Senado fuera de este lote.

### `sabini-sebastian` — mandato XLIX «Representante Nacional por Canelones 2022-03-02 → 2025-02-14»
- severidad: **bloquea**
- tipo: cita_fuera_de_contexto
- objecion: el registro data el mandato en el tramo en que estaba en el Senado, y su segunda fuente
  —un diario de sesiones del 10-03-2020 que dice «SEBASTIÁN SABINI, Representante por Canelones»—
  **queda fuera del rango que el registro afirma**, es decir, prueba lo contrario de lo que se le
  hace probar.
- cita_de_contexto: «Convocado a la Cámara de Senadores por el lema PARTIDO FRENTE AMPLIO, sublema
  MÁS DESARROLLO CON IGUALDAD hasta el 14/02/2025 23:59 Titular: Sabini, Sebastián»
  (`https://parlamento.gub.uy/camarasycomisiones/legisladores/9894/actuacion-legislador?Fecha_desde=2022-01-01&Fecha_hasta=2023-12-31`).
  No figura en la nómina de Representantes al 22/07/2024. El propio `notas.md` anota que un diario
  del 08-03-2022 lo llama «el senador Sabini».
- accion_sugerida: cargar el mandato de Diputados desde 2020-02-15 con el diario de sesiones que ya
  tiene, y buscar la fecha exacta de salida.

### `lust-eduardo` — mandato XLIX «2020-02-15 → 2020-06-02», `fuera_de_cargo` desde entonces
- severidad: **bloquea**
- tipo: cita_fuera_de_contexto / contexto_omitido
- objecion: el `hasta` sale de una fila de actuación del 02-06-2020 que dice que ese día fue
  «Miembro interpelante en el llamado a sala…». Que ese día haya intervenido no prueba que dejara
  la banca; y la nómina oficial de Representantes de la XLIX al 22/07/2024 lo lista como titular en
  ejercicio («Lust Hitta, Eduardo»). Su `legislaturas-actuo` no respalda nada: tiene una sola fila,
  «Legislatura XLIX (2020-2025) 02-12-2022 11-12-2022».
- cita_de_contexto: `https://parlamento.gub.uy/camarasycomisiones/legisladores/12661/legislaturas-actuo`
  y la nómina archivada de 2024, que lo incluye entre los 99.
- accion_sugerida: mandato completo 2020-02-15 → 2025-02-14 con la nómina archivada como fuente, o
  `probable` hasta conseguir un diario de sesiones. Corregir `salida.tipo` (hoy `fin_de_mandato` con
  fecha 2020-06-02).

### `etcheverry-lucia` — mandato XLIX «2020-02-15 → 2021-03-03»
- severidad: **bloquea**
- tipo: cita_fuera_de_contexto
- objecion: idéntico al anterior. La cita que sostiene el mandato es «02-06-2020 Interviene en la
  discusión fundamentando su voto…», una fila fechada nueve meses antes del `hasta` que el registro
  afirma. La nómina de la XLIX al 22/07/2024 la lista como titular en ejercicio («Etcheverry Lima,
  Lucía»), y su `legislaturas-actuo` solo tiene filas de un día (10-12-2024 y 15-02-2025).
- cita_de_contexto: `https://parlamento.gub.uy/camarasycomisiones/legisladores/10465/legislaturas-actuo`.
- accion_sugerida: la misma que Lust.

### `echeverria-solis` — mandato XLIX «Representante Nacional por Tacuarembó 2020-02-15 → 2020-02-15»
- severidad: **bloquea**
- tipo: riesgo_legal (afirma más de lo que la fuente respalda)
- objecion: la segunda cita del propio registro dice «Convocado a la Cámara de Representantes por el
  departamento de TACUAREMBÓ», es decir, **suplente convocado un día**, no titular. El registro lo
  publica como mandato de Representante y además cierra con `salida.tipo: fin_de_mandato` fechada el
  15-02-2020, que es el día en que empezó la legislatura, no el día en que terminó ningún mandato.
  No figura en la nómina de titulares de la XLIX.
- accion_sugerida: o `cargo: "Representante Nacional por Tacuarembó (suplente)"` —el sitio ya lo
  soporta: `esSuplencia()` en `src/lib/cargos.ts` dibuja la suplencia rayada— o sacar la ficha del
  lote. Y `salida.tipo` no puede ser `fin_de_mandato`.

### `umpierrez-alejo` — mandato L «2025-04-08 → 2025-04-09» y XLIX «2020-02-15 → 2020-11-26»
- severidad: **bloquea**
- tipo: riesgo_legal / cita_fuera_de_contexto
- objecion: tres problemas en un registro. (1) Dos días de la L cargados como mandato de titular
  cuando no está en la nómina de los 99 ni tiene nota de sustitución; es una suplencia. (2) La
  segunda fuente del mandato de 2025 es su biografía oficial y la cita es «Primer Suplente a la
  Cámara de Representantes por Rocha por el Partido Nacional (Lista 71 – Herrerismo) **(2005-2010)**»:
  un dato de hace veinte años usado para fijar el departamento de un mandato de 2025. (3)
  `salida.tipo: renuncia` con fecha 2025-04-09 no tiene ninguna fuente que diga «renuncia»; el
  propio `notas.md` reconoce que es una inferencia y que podría ser una licencia.
- accion_sugerida: marcar la suplencia como tal, tomar el departamento de `LegAlfab.pdf` o de la
  ficha de la persona, y quitar `salida` o dejarla sin tipo hasta tener el diario de sesiones.

### `soravilla-emiliano` — mandato L «Representante Nacional por Artigas 2025-02-15 → 2025-07-01»
- severidad: **bloquea**
- tipo: riesgo_legal / contexto_omitido
- objecion: el departamento (Artigas) **no está en ninguna cita del registro**; `notas.md` lo admite:
  «El departamento que usé viene del brief y de una búsqueda web (no citada)». Eso es exactamente lo
  que la regla 4 para agentes prohíbe. Además `salida.tipo: renuncia` es una inferencia sin fuente,
  y falta un mandato de la XLIX que **la propia página que el registro cita** muestra.
- cita_de_contexto: `https://parlamento.gub.uy/camarasycomisiones/legisladores/12763/legislaturas-actuo`
  trae dos filas: «Legislatura L (2025-2030) 15-02-2025 01-07-2025» y «Legislatura XLIX (2020-2025)
  **16-07-2024 14-02-2025**». Esa segunda fila arranca el mismo día en que Valentina Dos Santos (PN,
  Artigas) dejó la banca, y la nómina de la XLIX al 22/07/2024 ya lo lista («Soravilla Pinato,
  Emiliano»), lo que además confirma Artigas: es la banca del Partido Nacional por ese departamento.
- accion_sugerida: agregar el mandato XLIX 2024-07-16 → 2025-02-14, apoyar el departamento en la
  nómina archivada y quitar el tipo de salida.

### `castaingdebat-armando` — mandato XLIX «2020-02-15 → 2025-02-14»
- severidad: **bloquea**
- tipo: riesgo_legal (la cita no cubre lo afirmado)
- objecion: el mandato de cinco años se apoya en una única cita que dice «Legislatura XLIX
  (2020-2025) 05-02-2024 12-02-2024» — una semana. El propio `notas.md` admite las reservas. El
  hecho probablemente sea cierto, pero así no está probado.
- cita_de_contexto: la nómina archivada de la XLIX sí lo respalda, por su nota al pie: «Sustituye al
  Representante Armando Castaingdebat mientras desempeñe el cargo de Ministro de Defensa Nacional»
  (la suplente en ejercicio al 22/07/2024 era Laura Burgoa González).
- accion_sugerida: usar esa nota al pie como fuente del mandato y, si se le aplica el mismo criterio
  que a Cardoso y a Lema (a quienes sí se les partió el mandato por el pasaje al Ejecutivo), partir
  el suyo también. Ver `amarilla-gerardo`, que tiene el mismo caso.

### `antonini-eduardo` y `ferreira-zulimar` — mandato L de Representante
- severidad: corregir
- tipo: cita_fuera_de_contexto
- objecion: el `cargo` dice «Representante Nacional por Maldonado / por Tacuarembó» pero la cita que
  lo acompaña habla de otra cosa: «Senador de la República por el Lema PARTIDO FRENTE AMPLIO desde el
  02/03/2025». La cita existe (pasa la validación de red) y no respalda el cargo.
- cita_de_contexto: `LegxPartido.pdf` lo dice literal y es la fuente correcta: «Sustituye al
  Representante Eduardo Antonini mientras desempeñe el cargo de Senador de la República» y
  «Sustituye a la Representante Zulimar Ferreira mientras desempeñe el cargo de Senadora de la
  República».
- accion_sugerida: cambiar la cita por la nota al pie de la nómina. Los mandatos XLIX de ambos están
  bien (los verifiqué: llevan la línea «Representante Nacional por el Lema…»).

### `viera-nicolas` — falta el mandato de la L; `en_cargo` sin cargo documentado
- severidad: corregir
- tipo: contexto_omitido
- objecion: la ficha carga solo la XLIX y deja `situacion: en_cargo` sin un solo mandato abierto. Un
  lector ve un diputado que terminó en 2025 y una ficha que dice que sigue en cargo, sin decir en
  cuál.
- cita_de_contexto: «Sustituye al Representante Nicolás Viera mientras desempeñe el cargo de Senador
  de la República» (`LegxPartido.pdf`, la suplente es Cecilia Badín) y «Senador de la República por
  el Lema PARTIDO FRENTE AMPLIO desde el 05/03/2025- Legislatura L (2025-2030)»
  (`legisladores/11626/legislaturas-actuo`).
- accion_sugerida: cargar el mandato de Representante por Colonia de la L y el de Senador, con esas
  dos citas.

### `blas-rodrigo` — falta el mandato titular de la XLIX
- severidad: corregir
- tipo: contexto_omitido
- objecion: `notas.md` concluye que no hay fuente de que haya ejercido banca titular. La hay: la
  nómina de titulares de la XLIX al 22/07/2024 lo lista entre los 99 («Blás Simoncelli, Rodrigo»).
  La ficha, como está, dice que Rodrigo Blás fue diputado dos días.
- accion_sugerida: cargar el mandato XLIX por Maldonado con esa nómina y buscar las fechas exactas.
  El mandato de Senador desde 2025-10-14 está bien citado.

### Fichas de la L a las que les falta el mandato de la XLIX que la nómina prueba
`andujar-sebastian`, `de-mattos-alfredo`, `goni-rodrigo`, `lorenzo-nicolas`, `reisch-nibia`,
`rodriguez-hunter-alvaro`, `jisdonian-pedro`, `mazzini-agustin`, `medina-nino`, `fajardo-maria`,
`ibarguren-sylvia`, `valdomir-sebastian`
- severidad: corregir
- tipo: contexto_omitido
- objecion: los doce figuran entre los 99 titulares de la XLIX al 22/07/2024 y ninguno tiene mandato
  de esa legislatura. `notas.md` explica la decisión (las filas de `legislaturas-actuo` mostraban uno
  o tres días) y para varios era prudente; pero para **`lorenzo-nicolas` no hay excusa**: su página
  trae la fila completa y con el rótulo del cargo, «Representante Nacional por el Lema PARTIDO
  FRENTE AMPLIO - Legislatura XLIX (2020-2025) 15-02-2020 14-02-2025»
  (`legisladores/12646/legislaturas-actuo`), y el propio `notas.md` lo escribe («su XLIX sí es
  completa 15/02/2020-14/02/2025») antes de no cargarlo.
- accion_sugerida: cargar los doce mandatos con la nómina archivada de 2024 como fuente y las fechas
  que cada `legislaturas-actuo` permita; el de Lorenzo, directo, con la línea que ya está.

### Ocho fichas cuyo departamento no está en la cita
`melo-ana-laura`, `olaizola-juan-jose`, `reisch-nibia`, `rielli-domingo`, `rodriguez-conrado`,
`satdjian-jose-luis`, `schipani-felipe`, `valverde-sergio`
- severidad: corregir
- tipo: riesgo_legal (afirma más de lo que la fuente respalda)
- objecion: la única fuente del mandato es una fila de `LegxPartido.pdf` de tres nombres y tres
  departamentos desordenados, del tipo «Rodríguez, Conrado\tDastugue, Álvaro\tLorenzo, Nicolás
  ARTIGAS MONTEVIDEO\tCANELONES». Qué departamento le toca a qué nombre sale de una regla empírica
  que `notas.md` documenta con honestidad pero que **el registro no declara**: la cita no dice que
  Conrado Rodríguez sea por Montevideo. Los ocho aciertan, hasta donde puedo comprobar, pero la
  cadena de evidencia no está a la vista del lector.
- accion_sugerida: reemplazar por `https://documentos.diputados.gub.uy/docs/LegAlfab.pdf`, donde el
  partido y el departamento van pegados al nombre en el mismo renglón («Abdala, Pablo PN
  Montevideo»), o por la página individual cuando renderice.

### Seis fichas con `salida.tipo: fin_de_mandato` en una fecha que no es fin de mandato
`dos-santos-valentina` (2024-07-16), `echeverria-solis` (2020-02-15), `enciso-carlos` (2020-06-02),
`etcheverry-lucia` (2021-03-03), `irazabal-benjamin` (2021-06-08), `lust-eduardo` (2020-06-02)
- severidad: corregir
- tipo: riesgo_legal
- objecion: `fin_de_mandato` afirma que el mandato llegó a su término; en las seis la persona salió
  antes del 14-02-2025. El enum tiene `renuncia`, pero ninguna fuente del lote dice «renuncia» para
  estas seis, así que tampoco corresponde ponerla. Es el caso típico de «motivo de una renuncia»
  afirmado sin respaldo que el pedido pide vigilar.
- accion_sugerida: buscar el diario de sesiones («Renuncia a la banca del señor representante…», que
  el propio lote ya usó bien para Mendiondo, Núñez Fallabrino e Irigoin) y, mientras tanto, dejar la
  ficha en `probable` con el `hasta` del mandato y sin `salida.tipo`.

### Diez fichas con `situacion: en_cargo` y ningún mandato abierto
`besozzi-guillermo`, `carballo-felipe`, `civila-gonzalo`, `fratti-alfredo`, `garcia-mario`,
`lafluf-omar`, `lema-martin`, `olivera-nicolas`, `viera-nicolas`, `zubia-gustavo`
- severidad: corregir
- tipo: riesgo_legal / presentacion
- objecion: `en_cargo` es una afirmación sobre el presente y en las diez no tiene fuente en la ficha:
  el último mandato cargado termina en 2020 o en 2025. `notas.md` reconoce que el dato de que
  Besozzi, García y Lafluf son intendentes salió de Wikipedia «solo como orientación, no citado». Un
  lector que abre la ficha de Besozzi lee «en cargo» y una banda que termina en noviembre de 2020.
- accion_sugerida: o se carga el mandato actual con fuente (intendencia, Senado), o `situacion` pasa
  a lo que la ficha puede sostener. Y el criterio tiene que ser uno solo: hoy `morel-christian` está
  en `fuera_de_cargo` por prudencia ante la misma duda (posible intendente de Cerro Largo) mientras
  estos diez están en `en_cargo` sin fuente.

### Cuatro fichas marcadas `_faltante: segunda_fuente`
`mier-sergio`, `minetti-orquidea`, `morel-christian`, `sanchez-cal-dardo`
- severidad: corregir
- tipo: contexto_omitido
- objecion: la marca está bien puesta y es la conducta correcta, pero el brief pedía segunda fuente
  justamente para las salidas anticipadas, que es lo que estos cuatro tienen. En `minetti-orquidea`
  la segunda fuente que sí hay es Wikipedia con la cita «Representante Nacional (2020-2025) Partido
  político Frente Amplio», que no dice nada sobre el 01-01-2023 en que el registro la hace salir; y
  `content/medios/wikipedia.yaml` declara que «el validador de tiers no la acepta como fuente
  textual ni oficial».
- accion_sugerida: al resolvedor, con el índice del diario de sesiones que `notas.md` ya localizó
  para Minetti («Renuncia a la banca de la señora representante Orquídea Minetti … 39», d.s. del
  05-07-2022). Mientras tanto, `probable`.

### `garcia-mario` y `lafluf-omar` — la segunda fuente es la página de actuación de otra persona
- severidad: corregir
- tipo: cita_fuera_de_contexto
- objecion: la segunda fuente de ambos es
  `legisladores/11125/actuacion-legislador` (la de Martín Lema) y la cita es del tipo «18-11-2020
  Interviene en la discusión fundamentando su voto. ASUNTO VARIO: Asunto: 149423; LAFLUF HEBEICH,
  O…». Esa fila registra que **Lema** intervino sobre un asunto que menciona a Lafluf; no dice que
  Lafluf dejara la banca el 25-11-2020.
- accion_sugerida: buscar la resolución de la Cámara sobre la renuncia (las tres salidas del
  25-11-2020 son el recambio de intendencias tras las departamentales de setiembre de 2020, como
  `notas.md` razona bien) o dejar el `hasta` con la sola fuente oficial y sin segunda fuente falsa.

### `amarilla-gerardo` y `castaingdebat-armando` — criterio distinto que `cardoso-german` y `lema-martin`
- severidad: corregir
- tipo: asimetria (de criterio, no de partido)
- objecion: a Cardoso (PC) y a Lema (PN) se les partió el mandato en dos por el pasaje al Ejecutivo;
  a Amarilla (PN) y a Castaingdebat (PN) se les dejó un mandato continuo pese a que la nómina
  archivada dice, en sus notas al pie, que estaban siendo sustituidos: «Sustituye al Representante
  Gerardo Amarilla mientras desempeñe el cargo de Subsecretario del Ministerio de Ambiente».
- accion_sugerida: un solo criterio escrito para los cuatro. El defendible es el nominal (la banca no
  se pierde por ir al Ejecutivo, la ejerce un suplente), y entonces habría que **rearmar** Cardoso y
  Lema, no partir Amarilla y Castaingdebat. Cualquiera de los dos, pero el mismo para todos.

### `cardoso-german` — mandato 2020-02-15 → 2020-03-01
- severidad: aviso
- tipo: contexto_omitido
- objecion: la cita del primer tramo («15-02-2020 Convocado a la Cámara de Representantes por el
  departamento de MALDONADO hasta el 14/02/2025 23:59») usa el mismo verbo «Convocado» que en
  `echeverria-solis` marca una suplencia. Acá el «hasta el 14/02/2025» indica titularidad, y la
  nómina archivada de la XLIX lo confirma; queda anotado para que el editor no aplique la lectura de
  Echeverría a este caso.

### `irigoin-pedro` y `olivera-ana` — salidas bien fechadas, cargo sin rótulo
- severidad: aviso
- tipo: contexto_omitido
- objecion: los dos `hasta` coinciden exactamente con lo que muestran sus páginas
  (`legisladores/12649/legislaturas-actuo`: «Legislatura L 02-03-2025 09-07-2025»;
  `legisladores/8089/legislaturas-actuo`: «Legislatura L 15-02-2025 01-03-2026»), y en Irigoin hay
  además un diario de sesiones que dice «Renuncia a la banca del señor representante Pedro Irigoin
  Macari». Bien hecho. Lo que falta es la línea del cargo para el tramo de la L, que en las dos
  fichas no está en ninguna cita. Olivera Ana sí tiene el rótulo para la XLIX.
- accion_sugerida: para Olivera, un diario de sesiones de 2025; el de Irigoin ya sirve.

### `umpierrez-javier` — mandato XLIX «2020-02-15 → 2023-03-07»
- severidad: aviso
- tipo: contexto_omitido
- objecion: la fila existe y coincide («Legislatura XLIX (2020-2025) 15-02-2020 07-03-2023»,
  `legisladores/10034/legislaturas-actuo`) y no está en la nómina de 2024, lo que es consistente con
  haber salido en 2023. Pero no hay ninguna fuente que diga «Representante» para ese tramo ni por
  qué salió. El mandato de la L sí lleva el rótulo.

### `blas-rodrigo`, `echeverria-solis`, `umpierrez-alejo` y Aníbal Pereyra — cuatro tratamientos para el mismo hecho
- severidad: corregir
- tipo: asimetria
- objecion: una suplencia de uno o dos días recibió, dentro del mismo lote, cuatro respuestas
  distintas: en Blás se cargó como mandato con la palabra «(suplente)» en el `cargo`; en Echeverría
  Solís como mandato de titular sin más; en Umpiérrez Alejo como mandato de titular con `salida:
  renuncia`; y en Aníbal Pereyra se decidió no hacerle ficha. Ninguna de las cuatro decisiones
  favorece a un partido en particular —Blás y Umpiérrez son del Nacional, Echeverría de Cabildo,
  Pereyra del Frente— pero el lector no puede saber por qué la misma cosa aparece de cuatro maneras.
- accion_sugerida: escribir el criterio y aplicarlo a los cuatro. El sitio ya distingue suplencias
  (`esSuplencia()` las dibuja rayadas), así que lo natural es registrarlas con `(suplente)` en el
  `cargo` cuando aportan algo, y no registrarlas cuando no. Y Aníbal Pereyra **necesita ficha**: es
  Representante titular de la L por Rocha, exactamente igual que Viera, Mahía, Antonini y Ferreira,
  a quienes sí se les hizo ficha, y así lo dice el documento oficial: «Sustituye al Representante
  Aníbal Pereyra mientras desempeñe el cargo de Senador de la República».

### Colisiones de alias (homónimos)
- severidad: corregir
- tipo: presentacion / riesgo_legal
- objecion: seis alias quedan compartidos por dos personas distintas, y tres de ellos con fichas ya
  publicadas:
  - «Delgado» → `delgado-juan-pablo` (PN, Canelones) **y** `content/politicos/delgado.yaml`
    (Álvaro Delgado, candidato presidencial).
  - «Mujica» → `mujica-gonzalo` (PN, Montevideo) **y** `content/politicos/mujica.yaml` (José Mujica).
  - «Salle» → `salle-nicolle` (IS) **y** `content/politicos/salle.yaml` (Gustavo Salle). Padre e
    hija, mismo partido, mismo departamento, misma legislatura: es la colisión más peligrosa del
    lote.
  - «Araújo» → `araujo-mary` (FA, Maldonado) y `araujo-yisela` (FA, Cerro Largo).
  - «Echeverría» → `echeverria-diego` (PN, Maldonado) y `echeverria-solis` (CA, Tacuarembó).
  - «Pereyra» → `pereyra-estela` (FA, Montevideo, L) y `pereyra-susana` (FA, Montevideo, XLIX); y
    falta Aníbal Pereyra, que sería el tercero.
- accion_sugerida: sacar el apellido solo de los alias en esos seis casos. Aviso para quien cargue
  los faltantes: **Daniel Martínez Escames** (PN, XLIX) chocaría con
  `content/politicos/daniel-martinez.yaml`; en la verificación mecánica de esta crítica el nombre del
  diputado se cruzó con el del ex intendente y hubo que separarlos a mano.
- reconocimiento: en cambio, las dos desambiguaciones que `notas.md` documenta están **bien
  resueltas** y las verifiqué: `silva-rubenson` usa el id 8307 y no el 13602 de Robert Silva (abrí
  8307: «Representante Nacional por el Lema PARTIDO FRENTE AMPLIO, departamento de RIVERA»), y
  `martinez-william` usa 12776 y no 12048 de Walter Gonzalo Martínez (abrí 12776: «…departamento de
  CANELONES»).

### Ids que quedarán mal y no se pueden renombrar después
- severidad: corregir
- tipo: presentacion
- objecion: los ids son la ruta del archivo y no se renombran nunca, así que hay que arreglarlos
  antes de `promover`.
  - `_slug: inthamoussou-pablo` contra `nombre: Pablo Inthamoussu` (una «o» de más en el id).
  - `_slug: rodriguez-carlos-florida` usa el departamento como desambiguador mientras
    `rodriguez-hunter-alvaro` y `rodriguez-juan-martin` usan el apellido; la persona es «Carlos
    Rodríguez Gálvez» y el id natural es `rodriguez-galvez-carlos`.
  - `pnpm validar --inbox` ya asigna `armas-paula`, `brum-horacio` y `mattos-alfredo` a
    `de-armas-paula`, `de-brum-horacio` y `de-mattos-alfredo`: el id final no será el `_slug`. Que el
    editor lo decida a conciencia y no por omisión.

### 67 fichas donde `nombre` es igual a `nombre_corto`
`abdala-pablo`, `amado-fernando`, `andujar-sebastian`, `cervini-walter`, `colman-mario`,
`de-mattos-alfredo`, `fajardo-maria`, `lema-martin`, `reisch-nibia`, `sabini-sebastian`,
`viana-pablo` y 56 más.
- severidad: corregir
- tipo: asimetria (de detalle, no de partido) / presentacion
- objecion: el brief pide `nombre` completo «como figura en el Parlamento». En 89 fichas hay nombre
  completo («Víctor Martín Aldaya González») y en 67 no («Pablo Abdala»). La misma ficha para todos
  incluye el mismo nivel de detalle para todos; si no, la página muestra a unos con dos apellidos y
  a otros con uno sin que eso signifique nada.
- accion_sugerida: `LegAlfab.pdf` y `LegxPartido.pdf` traen la forma oficial de casi todos y
  resuelven varios de una: «Cervini Pratto, Walter» (que `notas.md` dejó en duda: **es correcto**,
  aparece igual en las dos nóminas y en la de departamentos), «Fajardo Rieiro, María de los Ángeles»
  (hoy la ficha dice «María Fajardo Rieiro»), «Umpiérrez Diano, Javier».

### Fuentes: fechas, títulos y medio
- severidad: aviso
- tipo: presentacion
- objecion: tres detalles que la página muestra. (1) `fuentes[].fecha` a veces es la fecha del hecho
  y no la de la página (en `echeverria-solis`, `fecha: 2020-02-15` para una consulta de 2026). (2) El
  mismo documento aparece con cuatro títulos distintos («Parlamento UY», «Legislaturas»,
  «Legislaturas en las que actuó», «Actuación parlamentaria»), y la página agrupa las fuentes por
  publicador. (3) Ocho fuentes de `documentos.diputados.gub.uy` se declaran con `medio: parlamento`,
  cuyo `content/medios/parlamento.yaml` tiene `url: https://parlamento.gub.uy` y no lista ese dominio
  entre sus alias.
- accion_sugerida: unificar título por tipo de página, poner la fecha de consulta, y agregar
  `documentos.diputados.gub.uy` y `biblioteca.parlamento.gub.uy` a los alias del medio.

### Fichas sin objeción (91)

Verifiqué contra la fuente una muestra de estas y todas las que tenían dos mandatos: en las 20 que
abrí (`12665` Cairo, `12651` Cervini, `12657` Colman, `11598` Dastugue, `12515` Echeverría Diego,
`11413` Gianoli, `12679` Lima, `12680` Mesa, `9963` Osorio, `12667` Otero, `9936` Perrone, `12673`
Rodríguez Juan Martín, `10032` Rodríguez Gálvez, `11597` Rodríguez Conrado, `12504` Schipani, `12666`
Tucci, `7754` Varela, `3959` Amarilla, `12674` Viana, `11634` Díaz) la fila de la XLIX lleva el
rótulo del cargo y las fechas coinciden exactamente con lo cargado; en `8307`, `12776`, `13647`,
`12852`, `12663` y `13626` la línea «Representante Nacional por el Lema PARTIDO X, departamento de Y»
coincide con el partido y el departamento del registro. Las condenso en una lista, como pide el
punto 14 de la lista de control, en vez de repetir 91 bloques iguales:

- severidad: aviso (`sin_objecion`)
- tipo: sin_objecion
- motivo: mandato con la línea «Representante Nacional por el Lema…» en la cita, fechas coincidentes
  con la fuente, partido y departamento respaldados, sin salida anticipada que explicar.
- **Partido Nacional (18)**: abdala-pablo, albisu-carlos, auersperg-fernanda, bacigalupe-ruben,
  colman-mario, dastugue-alvaro, echenique-graciela, farinha-fermin, gianoli-gabriel, grezzi-andres,
  long-mercedes, niffouri-amin, pena-adriana, pereira-monica, radiccioni-javier,
  rodriguez-juan-martin, viana-pablo, viviano-alvaro.
- **Frente Amplio (44)**: aita-ubaldo, aldaya-victor, amado-fernando, antunez-tatiana,
  barreiro-gabriela, barrera-graciela, bottino-cecilia, cairo-cecilia, cortes-ines, diaz-bettiana,
  diverio-daniel, galan-lilian, gerhard-daniel, giometti-bruno, gorosterrazu-juan, hugo-claudia,
  larzabal-nelson, libschitz-margarita, lima-alvaro, lustemberg-cristina, malan-enzo, maneiro-sol,
  martinez-william, mato-veronica, mendez-anibal, mendiondo-constante, mesa-nicolas, nedov-sandra,
  noy-diana, nunez-gerardo, obaldia-maria-ines, olmos-gustavo, otero-gabriel, presa-marcos,
  preve-federico, reyes-carlos, rinaldi-magela, ruiz-federico, sierra-julieta, silva-rubenson,
  tierno-martin, tucci-mariano, varela-carlos, zavala-alejandro.
- **Partido Colorado (17)**: alvear-jorge, campo-maximiliano, castro-elianne, cervini-walter,
  estevez-omar, gurmendez-gabriel, jorge-juan-martin, juri-adrian, melazzi-martin, molins-marti,
  moreno-juan-carlos, osorio-marne, pasquet-ope, rosello-maria-eugenia, rydstrom-carlos,
  verri-walter, viera-mauricio.
- **Cabildo Abierto (9)**: albernaz-rodrigo, caballero-wilman, cal-sebastian, camargo-nazmi,
  capillera-elsa, perez-bonavita-silvana, perrone-alvaro, sodano-martin, testa-carlos.
- **Partido Independiente (2)**: posada-ivan, sotelo-gerardo. **Partido de la Gente (1)**: pena-daniel.
- Salvedad honesta: `mendiondo-constante` y `nunez-gerardo` entran acá porque su salida sí tiene un
  diario de sesiones que la dice con todas las letras («Renuncia a la banca del señor representante
  Constante Mendiondo» / «…Gerardo Núñez Fallabrino»); son el modelo de cómo debería quedar el resto
  de las salidas anticipadas. Y `cervini-walter` entra pese a la duda de `notas.md` sobre el segundo
  apellido: las tres nóminas oficiales dicen «Cervini Pratto, Walter».

---

## Objeciones al lote

### 1. Cobertura de la Legislatura L: faltan 14 personas con banca (bloquea)

Contra la nómina oficial del día de hoy (`LegxPartido.pdf`, 09/09/2026 08:11:46, «Cantidad de
Representantes: 99»), 86 de los 99 tienen ficha con mandato de la L. Faltan 13, más Aníbal Pereyra
(titular sustituido, no aparece en la lista de 99 pero el documento lo llama «el Representante Aníbal
Pereyra»), más el mandato de la L de Nicolás Viera, que tiene ficha sin ese mandato:

| Falta | Partido | Departamento | De dónde sale |
|---|---|---|---|
| Núñez, Fabricio | FA | a confirmar | nómina, columna FA |
| Reutor, Carlos | FA | a confirmar | nómina, columna FA |
| Badín, Cecilia (1) | FA | Colonia | `LegAlfab.pdf`: «Badín, Cecilia (1) FA Colonia»; sustituye a Viera |
| Tinaglini, Gabriel (5) | FA | Rocha | sustituye a Aníbal Pereyra |
| Camarán Cawen, Susana | FA | Montevideo | `LegAlfab.pdf` |
| Díaz Marrero, Natalia | FA | Montevideo | `LegAlfab.pdf` |
| Gallo, Luis Enrique (2) | FA | Canelones | `LegAlfab.pdf`; sustituye a Mahía |
| Garlo, Joaquín (3) | FA | Maldonado | sustituye a Antonini |
| Guerrero, Gustavo (4) | FA | Tacuarembó | sustituye a Ferreira |
| Pereyra, Aníbal | FA | Rocha | nota al pie 5 de `LegxPartido.pdf` |
| Britos, Miriam | PN | Artigas | `LegAlfab.pdf`; ocupa la banca que dejó Soravilla |
| Casaretto, Federico | PN | Maldonado | `LegAlfab.pdf` |
| Constenla, Pablo | PN | Salto | `LegAlfab.pdf` |
| Duque Barreto, Matías | PC | Canelones | `LegAlfab.pdf` |
| Salle Lorier, Gustavo | IS | Montevideo | ya tiene ficha (`content/politicos/salle.yaml`); solo le falta la fuente oficial, que `notas.md` deja escrita |

`notas.md` acertó al excluir a Aníbal Pereyra del lote *de la L* por ser senador, pero la
consecuencia —que no exista ficha— es lo contrario de lo que el brief pide, y es incoherente con
Mahía, Antonini, Ferreira y Viera, que están en la misma situación exacta y sí la tienen. Además
`notas.md` afirma que Tinaglini es «por Rocha, PN»: Tinaglini es del Frente Amplio, y conviene que
esa frase no se arrastre a ningún registro.

El brief dice «o tienen ficha todos los que votan, o ninguno». Con 14 faltantes, las votaciones de la
L no se pueden enlazar completas, que es para lo que se hizo el lote.

### 2. Cobertura de la Legislatura XLIX: faltan 32 (bloquea)

Contra la nómina archivada al 22/07/2024 (99 titulares), 67 tienen mandato de la XLIX. De los 32
restantes, 13 tienen ficha en este lote sin ese mandato (los doce listados arriba más Blás, con la
suplencia en lugar del mandato) y **19 no tienen ficha en ninguna parte**:

Amigo Díaz, Oscar · Algorta Brit, Felipe · Burgoa González, Laura · Corbo, Milton · Fuentes, Pablo
Andrés · Gallo Cantera, Luis Enrique · Guadalupe, Eduardo · Inzaurralde, Alexandra · Lereté, Alfonso
· Martínez Escames, Daniel · Melgar, Micaela · Menéndez, Rafael · Mirza Perpignani, Adel · Núñez
Soler, Nancy · Olano Llano, José Quintín · Onetto Linale, Gonzalo Andrés · Reutor, Carlos · Tinaglini,
Gabriel · Tort González, Carmen.

Tres de esos diecinueve estaban ejerciendo como suplentes de un titular en el Ejecutivo (Burgoa por
Castaingdebat, Guadalupe por Amarilla, Jisdonian por Olaizola), lo que además prueba que Olaizola,
Amarilla y Castaingdebat fueron titulares de la XLIX.

Sobre esto `notas.md` es honesto y hay que subrayarlo: los dos lotes de la XLIX escriben que **no se
hizo un censo independiente de los 99** y que se investigó exactamente a las personas de la lista del
brief. Eso explica el hueco y no lo justifica, porque el brief pedía los 99.

### 3. Las exclusiones de `notas.md`, una por una

| Excluido | Fundamento del lote | Veredicto |
|---|---|---|
| Alejandro Sánchez (FA) | su `legislaturas-actuo` no registra tramo de Diputados en la XLIX, y dos diarios de sesiones muestran el pasaje al Senado en octubre de 2020 | **fundado**; y no está en la nómina de 2024. Aun así conviene revisar si fue titular entre febrero y octubre de 2020 |
| Gustavo Penadés (PN) | fila sin rótulo de Representante y Wikipedia diciendo que ocupó una banca de Senador desde el 01-03-2020 | **fundado**; tampoco está en la nómina de 2024 |
| Aníbal Pereyra (FA) | es senador | **no fundado como exclusión total**: es Representante titular de la L (nota al pie 5). Necesita ficha |
| Gabriel Tinaglini (FA) | sigue en la L, así que iba en el otro lote | **fundado como razonamiento, fallido como resultado**: el lote de la L tampoco lo cargó y quedó sin ficha en las dos legislaturas |
| Rodrigo Blás (PN) | no encontró fuente de banca titular | **refutado**: está entre los 99 de la XLIX al 22/07/2024 |
| Nibia Reisch, Álvaro Rodríguez Hunter, Alfredo De Mattos, Sebastián Andújar, Rodrigo Goñi, Nicolás Lorenzo | filas de uno a tres días | **refutado para los seis**: los seis están entre los 99 de la XLIX. En Lorenzo, además, la fuente citada ya traía el mandato completo con su rótulo |
| Pablo Viana, departamento Montevideo y no Canelones | diario de sesiones del 16-07-2024 | **fundado y bien hecho**; la nómina archivada lo confirma. El descarte del `Bio00461.PDF` equivocado, también |

### 4. Lo que el lote hizo bien y conviene no perder

- Encontró y corrigió dos ids de homónimo antes de citar (Robert Silva por Rubenson Silva; Walter
  Gonzalo Martínez por William Martínez). Las verifiqué las dos.
- Rechazó una biografía en PDF que resultó ser de otra persona antes de que llegara al registro.
- Documentó la regla empírica de desordenamiento del PDF de tres columnas en vez de esconderla.
- Documentó una falla de extracción y su arreglo en `scripts/lib/extraer.ts` (`if (!texto)` →
  `if (!texto || texto.length < 200)`). No la evalúo: es infraestructura, no `content/`, pero el
  mantenedor debería mirarla antes del próximo `build` porque cambia el comportamiento de
  `pnpm fuente` para todo el sitio.
- No inventó nada donde no había fuente; todos los huecos que encontré están declarados en
  `notas.md`. El problema no es ocultamiento: es que varias decisiones prudentes resultaron
  equivocadas cuando aparece el documento que el lote no buscó.

### 5. Consecuencia para el sitio, no para el lote

Al promover 156 políticos sin registros, el validador de simetría pasa a listar entre 150 y 175
nombres en el aviso de cada tema («Cobertura asimétrica: … sin ningún registro en este tema:
abdala-pablo, aita-ubaldo, …»), y lo mismo hará la página del tema. Es el punto 14 de la lista de
control: una lista de 170 renglones iguales no informa. Sugerencia para el editor o para una tarea
aparte: condensar ese aviso a un número con enlace («170 legisladores con mandato en el período y sin
registros»), como hace el punto 15 con los contadores.

---

## Objeciones al brief

Regla 0: **el brief no la viola**. Pide los 99 de cada legislatura, de todos los partidos, con la
misma ficha, sin adjetivos y sin «conocido por», y la salida cumple ese criterio: no hay un solo
adjetivo valorativo en las 156 fichas, ni un dato cargado para un partido que no se haya buscado para
los demás. Los cuatro `notas.md` responden «ninguna» a `objeciones_al_brief` y coincido.

Dos observaciones que sí corresponden:

1. **La lista de nombres del brief se usó como si fuera la fuente.** Traía por lo menos cinco errores
   (Blás y Tinaglini como si no fueran titulares donde lo son, Alejandro Sánchez y Penadés como
   diputados, Viana en Canelones) y el brief mismo dice que Wikipedia «es solo un índice para no
   olvidar a nadie». Los investigadores hicieron lo correcto al corregir el brief contra el documento,
   pero la lista se usó también como *cierre* del universo: los dos lotes de la XLIX investigaron
   exactamente a las personas nombradas. De ahí los 32 huecos. El brief debería haber dado el
   procedimiento de censo, que existe: `documentos.diputados.gub.uy/docs/LegxPartido.pdf` (o
   `LegAlfab.pdf`) para la legislatura en curso y la captura de Wayback para la anterior. Verifiqué el
   índice CDX: para ese PDF hay **una sola** captura archivada (20240722), así que para reconstruir
   los movimientos intermedios de la XLIX hay que ir a los diarios de sesiones. Y
   `documentos.diputados.gub.uy/docs/SesionesPreparatorias/ListaProclamados.pdf`, que `notas.md`
   menciona, hoy da HTTP 404.
2. **El brief fijó la plantilla `desde: 2020-02-15 / hasta: 2025-02-14` antes de mirar los datos.**
   Eso empujó a llenar el molde con la fila que hubiera, y es el origen del error de método descrito
   arriba. La versión correcta sería: sin la línea que nombra el cargo, no hay mandato.

Nada de esto se aplicó distinto a un partido que a otro, y así debe corregirse: el mismo documento
que se le exige a un diputado se le exige a los 99.

---

## Cobertura

**Ningún registro de `cobertura`, y no por olvido.** Los registros de tono se emiten «por cada nota de
prensa leída en el lote», y en este lote no se leyó ninguna: las 274 fuentes se reparten en 239 de
`parlamento.gub.uy`, 24 de `biblioteca.parlamento.gub.uy` (diarios de sesiones), 8 de
`documentos.diputados.gub.uy` y 3 de `es.wikipedia.org` (una enciclopedia, no un medio periodístico,
y su propia ficha de medio la declara `alineamiento: sin_datos`). No hay nada de qué medir el tono, y
fabricar registros de tono sobre documentos oficiales sería inventar una métrica.

```yaml
# ninguno
```

**`discrepancias.yaml`: no se escribe, y también con motivo.** Encontré varias distancias entre
documentos —`legislaturas-actuo` contra la nómina de titulares en Lust, Etcheverry, Rodríguez Hunter,
Andújar, Goñi, De Mattos, Blás y Soravilla— pero las dos partes son publicaciones del mismo organismo
oficial, no un medio contra el documento que lo decide. El esquema de `discrepancias` mide lo
segundo. Van como objeción de registro, que es donde corresponden.

---

## Resumen

- Objeciones que **bloquean**: 9 registros (`mahia-jose-carlos`, `caggiani-daniel`,
  `sabini-sebastian`, `lust-eduardo`, `etcheverry-lucia`, `echeverria-solis`, `umpierrez-alejo`,
  `soravilla-emiliano`, `castaingdebat-armando`) y 2 objeciones de lote (cobertura de la L y de la
  XLIX).
- Objeciones a **corregir**: 52 registros (los que no tienen ninguna objeción que bloquee), agrupados en 13 objeciones temáticas.
- **Avisos**: 4 registros cuya única objeción es informativa (`cardoso-german`, `irigoin-pedro`, `olivera-ana`, `umpierrez-javier`), más las objeciones de forma de fuentes y la de simetría del sitio.
- **Sin objeción**: 91 registros.
- El lote **no está en condiciones de publicarse completo**. Sí podría promoverse, si el editor
  quiere avanzar por partes, el subconjunto de 91 fichas sin objeción más las que solo tienen
  objeciones de forma (alias, ids, nombre completo), dejando las 65 restantes para una segunda vuelta
  del investigador con los cuatro documentos de nómina en la mano. Pero mientras falten las 14
  personas de la L, el enlace con `content/votaciones/` va a quedar incompleto, que era el motivo del
  encargo.
