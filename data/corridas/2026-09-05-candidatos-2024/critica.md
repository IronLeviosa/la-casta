# Crítica — corrida 2026-09-05-candidatos-2024

Modelo: Sonnet (brazo barato del experimento; corro en el rol que el archivo `.claude/agents/critico.md`
asigna a Opus, por instrucción explícita del encargo, no por decisión propia — lo dejo dicho como pide
`EXPERIMENTO.md`).
Lote: inbox/candidatos/2024/2026-09-05/
Registros revisados: 5 (Álvaro Delgado, Andrés Ojeda, Gustavo Salle, Guido Manini Ríos, Pablo Mieres)

Nota previa sobre el propio encargo: no encontré `data/corridas/2026-09-05-candidatos-2024/brief.md`.
La carpeta de la corrida solo tiene `consultas.jsonl` y `notas.md`; el brief no está. Audité contra la
paráfrasis del brief que trae el encargo de esta crítica y contra lo que `notas.md` describe como
criterio aplicado (que son consistentes entre sí), pero no pude comparar la instrucción literal.
Ver más abajo en "Objeciones al lote", severidad `bloquea`.

## Objeciones por registro

### politicos[0] — Álvaro Delgado
- severidad: corregir
- tipo: contexto_omitido
- objecion: El bug de codificación de `https://es.wikipedia.org/wiki/Álvaro_Delgado_Ceretta` que el
  investigador reportó como bloqueante ya se corrigió (aviso del coordinador durante esta misma
  sesión). Volví a pedir la fuente con `--forzar` y ahora se lee sin mojibake. El infobox da día
  exacto para las tres fechas que en el registro quedaron con precisión de año, exactamente lo que
  pide el punto 7 del encargo comprobar ("si el día estaba a una búsqueda de distancia"). Ya no lo
  está: está en la misma fuente que el investigador ya había decidido usar y no pudo leer. Las 5
  fechas de precisión de año/mes que reportan `notas.md` y que confirma `pnpm validar --inbox` (5
  avisos, uno por campo) se pueden corregir así:
  - `mandatos[0]` (Inspector General del Trabajo): `desde: "2000"` → `2000-03-01`; `hasta: "2004"` →
    `2004-12-15`.
  - `mandatos[1]` (Representante Nacional 2005-2015): `desde: "2005"` → `2005-02-15`; `hasta: "2015"`
    → `2015-02-15`.
  - `mandatos[2]` (Senador, primer período): `desde: "2015"` → `2015-02-15` (el `hasta: 2020-03-01`
    ya estaba bien y el infobox lo confirma exactamente: "15 de febrero de 2015-01 de marzo de
    2020").
  Ninguno de estos tres cambios contradice lo que el registro ya afirmaba (mismos años); solo le
  agregan precisión que hoy falta sin motivo, porque la fuente elegida sí la tiene.
- cita_de_contexto: "Representante Nacional de Uruguaypor Montevideo 15 de febrero de 2005-15 de
  febrero de 2015 Inspector General del Trabajo 1 de marzo de 2000-15 de diciembre de 2004Presidente
  Jorge Batlle" (infobox, `https://es.wikipedia.org/wiki/Álvaro_Delgado_Ceretta`, releído con
  `--forzar` el 2026-09-05).
- accion_sugerida: Agregar `https://es.wikipedia.org/wiki/Álvaro_Delgado_Ceretta` (ya releído sin
  mojibake) como fuente adicional de `mandatos[0]`, `mandatos[1]` y `mandatos[2]`, y completar los
  tres campos de fecha a precisión de día. No hace falta sacar las fuentes de prensa que ya están:
  quedan como corroboración independiente.

- severidad: aviso
- tipo: contexto_omitido
- objecion: La misma nota de El Observador que el investigador leyó pero no citó ("Álvaro Delgado,
  el 'gestor de activos' de Lacalle Pou...", 2024-06-23) da un dato de carrera anterior a 2000 que no
  está en ninguna versión del registro: "Raffo lo contrató como secretario en 1989 cuando fue electo
  senador por la lista 904 y luego, en 1993, se lo llevó al Ministerio de Transporte y Obras Públicas
  tras ser designado en el cargo por Luis Lacalle Herrera." Subrayado, en la fuente que sí está
  citada, lo confirma en paralelo con otro nombre: "Durante el gobierno de Lacalle Herrera trabajó
  como secretario legislativo". Ninguna de las dos fuentes da un título de cargo tan preciso como
  "Inspector General del Trabajo" (no dicen si era un cargo de confianza sin nombre formal o un
  puesto nombrado), así que no llego a proponerlo como mandato nuevo con la precisión que exige el
  esquema, pero es una etapa de la trayectoria de Delgado en la función pública (1993-1999, previa a
  Batlle) que no aparece en el registro y que si se pudiera nombrar con precisión debería estar, por
  el mismo criterio que se aplicó a su etapa como Inspector General del Trabajo.
- cita_de_contexto: "Raffo lo contrató como secretario en 1989 cuando fue electo senador por la
  lista 904 y luego, en 1993, se lo llevó al Ministerio de Transporte y Obras Públicas tras ser
  designado en el cargo por Luis Lacalle Herrera." (El Observador, 2024-06-23,
  `alvaro-delgado-el-gestor-activos-lacalle-pou...`).
- accion_sugerida: Buscar el nombre exacto del cargo que Delgado ocupó en el MTOP entre 1993 y 1999
  (antes de Inspector General del Trabajo) antes de decidir si corresponde agregarlo como mandato.

- severidad: aviso
- tipo: explicacion_alternativa
- objecion: Con la fuente ya legible until, aparece una discrepancia entre dos fuentes sobre la
  fecha en que terminó el segundo período de Delgado como senador (2025). El propio artículo de
  Wikipedia dice en el cuerpo del texto "Posteriormente, el 21 de julio, renunció a su banca en el
  Senado"[8], y el infobox pone "21 de julio de 2025" como fin de ese mandato. Pero la nota que el
  registro sí cita (El Observador, 2025-08-05) describe la renuncia como un hecho de ese mismo día,
  con la votación del Senado incluida: "Álvaro Delgado presentó este martes su renuncia al
  Senado... La cámara alta aprobó su renuncia con 27 votos de los 28 senadores presentes." Rastreé la
  referencia [8] de Wikipedia y resulta ser otra nota de El Observador cuyo propio título es
  "Álvaro Delgado anunció que renunciará al Senado para estar full time como presidente del
  directorio blanco" (consultada el 22 de julio de 2025) — es decir, la fuente que Wikipedia cita
  para el 21 de julio solo prueba un *anuncio de intención* ("renunciará", futuro), no la renuncia
  efectiva, y el artículo de Wikipedia convierte ese anuncio en un hecho consumado ("renunció",
  pasado) que su propia fuente no dice. El registro de este lote usa la fecha correcta (2025-08-05,
  respaldada por una nota que describe el trámite y la votación el mismo día), así que no hay nada
  que corregir en el registro; dejo esto anotado porque si alguien "arregla" esta fecha usando la
  Wikipedia recién legible, la empeoraría. No llega a `discrepancias.yaml` porque no tengo diario de
  sesiones ni documento oficial que fije el día exacto de la votación del Senado; solo tengo dos
  notas de prensa (ambas de El Observador) que se contradicen entre sí, y esa es la clase de
  hallazgo que la instrucción pide dejar como desacuerdo en la crítica, no como discrepancia.
- cita_de_contexto: "1 2 «Álvaro Delgado anunció que renunciará al Senado para estar full time como
  presidente del directorio blanco». El Observador. Consultado el 22 de julio de 2025."
  (`https://es.wikipedia.org/wiki/Álvaro_Delgado_Ceretta`, lista de referencias, releída el
  2026-09-05).
- accion_sugerida: Si en algún momento se quiere fechar con exactitud el trámite parlamentario (no
  hace falta para este registro, que ya está bien), buscar el Diario de Sesiones del Senado de la
  sesión de agosto de 2025 en que se aceptó la renuncia de Delgado.

- severidad: sin_objecion
- tipo: sin_objecion
- objecion: El resto del registro (candidatura 2024, estado_actual, y las tres fuentes que ya tienen
  precisión de día — Senador hasta 2020-03-01, Secretario de la Presidencia desde/hasta,
  Senador 2025 desde/hasta) está bien fechado y las citas son literales y contiguas. Verifiqué una
  por una: Subrayado (biografía), Teledoce (asunción/renuncia 15 días), la diaria (designación como
  secretario), Ámbito (renuncia de diciembre 2023, y el "próximo jueves 21" coincide con que el 21
  de diciembre de 2023 fue jueves), El Observador (vuelta al Senado en 2025 y renuncia de agosto de
  2025, cuyo "martes" también coincide con el calendario). Ninguna cita cierra un mandato citando
  una nota que en la misma fecha llama a la persona por el cargo anterior (el riesgo que señala el
  punto 5 del encargo); no encontré ese patrón acá.

### politicos[1] — Andrés Ojeda
- severidad: aviso
- tipo: contexto_omitido
- objecion: La única fuente no-Wikipedia (Búsqueda, "La asunción del nuevo Parlamento...") sí
  respalda el cargo, pero no en el fragmento citado en soledad: la lista "Partido Colorado Andrés
  Ojeda, Gustavo Zubía, Pedro Bordaberry, Tabaré Viera y Robert Silva" aparece en la nota bajo el
  subtítulo "La nueva composición del Senado", que es lo que la conecta con el cargo de senador. La
  cita elegida, sola, es solo una lista de nombres agrupados por partido; no dice por sí misma que
  sean senadores. No es una cita fuera de contexto (leí el artículo completo y el encabezado
  inmediatamente anterior confirma la lectura), pero es más débil de lo necesario.
- cita_de_contexto: "La nueva composición del Senado Frente Amplio [...] Partido Nacional [...]
  Partido Colorado Andrés Ojeda, Gustavo Zubía, Pedro Bordaberry, Tabaré Viera y Robert Silva."
  (Búsqueda, 2025-02-15, `la-asuncion-del-nuevo-parlamento...`).
- accion_sugerida: Extender la cita para incluir "La nueva composición del Senado" antes de la lista
  de nombres, o agregar una frase corta que use la palabra "senadores" explícitamente.

- severidad: sin_objecion
- tipo: sin_objecion
- objecion: El resto del registro está bien. Verifiqué el infobox de Wikipedia completo (no solo el
  fragmento citado): confirma "Edil de Montevideo 8 de julio de 2010-9 de julio de 2015" y "Senador
  de la República... Desde el 15 de febrero de 2025" con precisión de día en ambos casos, y no hay
  ningún cargo público entre 2015 y 2025 que falte (su actividad en ese período fue mediática y
  gremial —abogado penalista, columnista de TV—, no un cargo). El cargo de "Secretario General del
  Partido Colorado" (desde el 23/12/2024) es un rol partidario interno, no un cargo público, y el
  resto de las fichas de este mismo lote (la presidencia del directorio del PN de Delgado, el
  liderazgo de Cabildo Abierto de Manini) tampoco lo incluyen como mandato, así que no hay asimetría
  en excluirlo. La candidatura 2024 (votos, resultado, bancas del lema) es correcta contra la tabla
  de la Corte Electoral reproducida en Wikipedia.

### politicos[2] — Guido Manini Ríos
- severidad: corregir
- tipo: cita_fuera_de_contexto
- objecion: La única fuente no-Wikipedia (Ámbito, sobre el veto de agosto de 2024) sí llama
  "senador" a Manini Ríos, pero no en la oración citada: la cita usada ("el líder de Cabildo
  Abierto, Guido Manini Ríos, se mostró sorprendido y lamentó la decisión de Lacalle Pou...") lo
  identifica solo como "líder de Cabildo Abierto". Dos oraciones después, la misma nota sí dice "el
  senador" en referencia a él ("apuntó el senador"), pero esa parte no está en la cita del registro.
  Esto repite, en más chico, el patrón que señala el punto 8 del encargo: la fuente elegida
  respalda el cargo, pero no en el fragmento literal que quedó en el archivo.
- cita_de_contexto: "'Quedamos solos, como quedamos solos con las deudas [...] quedamos solos en
  muchos aspectos', apuntó el senador y añadió: 'No nos molesta quedarnos solos...'" (Ámbito,
  2024-08-09, `que-dice-el-veto-luis-lacalle-pou-al-articulo-72-la-ley-medios...`).
- accion_sugerida: Extender la cita hasta "apuntó el senador" o agregar esa cláusula, para que el
  fragmento citado por sí solo respalde el cargo de senador que el registro le atribuye a esta
  fuente.

- severidad: sin_objecion
- tipo: sin_objecion
- objecion: El resto del registro está bien. El infobox de Wikipedia (completo, no solo el
  fragmento citado) confirma con precisión de día "Comandante en Jefe del Ejército Uruguayo 1 de
  febrero de 2015-12 de marzo de 2019" y "Senador de Uruguay 15 de febrero de 2020-15 de febrero de
  2025", coincidiendo exactamente con el registro. No falta ningún cargo público: los grados y
  destinos militares anteriores (coronel, director de Sanidad Militar, agregado militar, etc.) son
  ascensos dentro de la carrera militar, no cargos de nombramiento político como el de Comandante en
  Jefe, y el liderazgo de Cabildo Abierto —como con Delgado y Ojeda— es un rol partidario, no un
  mandato público. La candidatura 2024 y la comparación con el resultado de 2019 de Cabildo Abierto
  ("de tres senadores a ninguno y de once a dos diputados") la verifiqué contra la página de
  Wikipedia de las elecciones de 2019 (no citada en el registro, ver acción sugerida) y es exacta:
  "Senadores obtenidos 3 [...] Diputados obtenidos 11" en 2019 contra "0" y "2" en 2024.
- accion_sugerida: Agregar `https://es.wikipedia.org/wiki/Elecciones_generales_de_Uruguay_de_2019`
  como fuente del dato de comparación con 2019 en el `detalle` de la candidatura, ya que hoy ese
  dato solo tiene como fuente la página de las elecciones de 2024, que no lo menciona.

### politicos[3] — Pablo Mieres
- severidad: corregir
- tipo: contexto_omitido
- objecion: Falta un cargo público documentado en la propia Wikipedia de Mieres, la misma fuente que
  el registro ya usa para sus otros mandatos: "Durante 1995 y 1996, ocupó el cargo de Director de
  Educación en el Ministerio de Educación y Cultura, manteniéndose políticamente independiente."
  Es un cargo con nombre formal y ministerio identificado, del mismo tipo que el "Inspector General
  del Trabajo" de Delgado (que sí está en este lote) o la "Directora de Educación" de Argimón, la
  "Presidenta de ANTEL" de Cosse, etc. en registros ya publicados de esta colección. Su ausencia dejó
  la trayectoria de Mieres con un salto entre su actividad partidaria de los 90 y su banca de
  diputado en 2000, cuando en realidad hubo un cargo público de por medio.
- cita_de_contexto: "En 1995 y junto a Juan Young y otros dirigentes del PDC, se retiraron de la
  coalición frentista. Durante 1995 y 1996, ocupó el cargo de Director de Educación en el Ministerio
  de Educación y Cultura, manteniéndose políticamente independiente."
  (`https://es.wikipedia.org/wiki/Pablo_Mieres`, releída el 2026-09-05).
- accion_sugerida: Agregar el mandato "Director de Educación (Ministerio de Educación y Cultura)",
  1995-1996 (precisión de año, la fuente no da mes ni día), con la misma fuente de Wikipedia.

- severidad: sin_objecion
- tipo: sin_objecion
- objecion: El resto del registro está bien. Las tres fechas de mandatos con precisión de día
  (Representante Nacional 2000-2005, Senador 2015-2020, Ministro 2020-2024) coinciden exactamente
  con el infobox de Wikipedia. La renuncia como ministro (02/05/2024) está respaldada por la
  resolución de Presidencia, que dice exactamente eso ("a partir del 2 de mayo de 2024"), y el
  Diario de Sesiones del 17/12/2024 confirma que para esa fecha ya era "exministro... y exsenador",
  consistente con las fechas del registro. Es, de los cinco, el único con una fuente
  `documento_oficial` y una `diario_de_sesiones` propias, y ambas están usadas en el lugar correcto
  y sin cortes que cambien el sentido. Los cargos de diputado suplente en 1984 y 1989 que menciona
  su Wikipedia no corresponden a mandatos (nunca asumió la banca), así que su exclusión es correcta,
  no un olvido.

### politicos[4] — Gustavo Salle
- severidad: sin_objecion
- tipo: sin_objecion
- objecion: Verifiqué la biografía completa de Wikipedia (no solo el fragmento citado) y confirma
  que el único cargo público de Salle es la diputación desde febrero de 2025; toda su actividad
  previa fue como abogado litigante y activista (denuncias contra Sendic y Argimón, campañas
  antipandemia), tal como dice `notas.md`, y no hay ningún cargo de gobierno ni electivo anterior que
  falte. La fecha (15 de febrero de 2025) coincide entre Wikipedia y El Observador. La cita de El
  Observador ("los legisladores electos Gustavo Salle (líder de Identidad Soberana)") sí respalda
  directamente el cargo de diputado, a diferencia de la de Manini Ríos: está en el mismo párrafo que
  dice "en la Cámara de Representantes", inmediatamente antes de nombrarlo. La candidatura 2024 es
  correcta contra la tabla de la Corte Electoral. No investigué las denuncias de Salle contra Sendic
  y Argimón que aparecen de pasada en su Wikipedia (correctamente, el brief no pedía casos, y
  `notas.md` ya las deja marcadas como no investigadas con la fuente donde aparecen).

## Objeciones al lote

- severidad: bloquea
- objecion: Falta `data/corridas/2026-09-05-candidatos-2024/brief.md`. Según
  `data/corridas/README.md`, ese archivo lo escribe `/investigar` *antes* de lanzar al investigador,
  y sin él `pnpm validar` va a fallar para todo registro cuya `procedencia.corrida` apunte a esta
  corrida (no se puede calcular ni verificar `procedencia.brief_sha`). No es un problema de
  contenido del lote, es un hueco en el rastro de procedencia que hay que cerrar antes de promover:
  hace falta reconstruir y commitear el brief literal que efectivamente se usó para esta corrida.

- severidad: sin_objecion
- objecion: El punto más importante que pedía este encargo —el umbral de inclusión— está bien
  aplicado y no encontré ninguna violación de Regla 0. Recontacté la tabla completa de la elección
  de 2024 (11 lemas presentados, tal como dice la propia nota de Wikipedia: "de los once partidos
  políticos que se presentaron, solo seis obtuvieron representación parlamentaria") contra la fuente
  primero en `es.wikipedia.org/wiki/Elecciones_generales_de_Uruguay_de_2024` y confirmé, banca por
  banca y voto por voto, los seis que entran (Frente Amplio -ya con ficha-, Partido Nacional,
  Partido Colorado, Identidad Soberana, Cabildo Abierto, Partido Independiente) y los cinco que
  quedan afuera (Eduardo Lust/Partido Constitucional Ambientalista con 11.865 votos y 0 bancas,
  Gonzalo Martínez/Unidad Popular con 10.102, César Vega/PERI con 9.281, Guillermo Franchi con
  3.183, Martín Pérez Banchero con 1.909; los cinco con 0 bancas en ambas cámaras). El corte
  (al menos una banca en Diputados o Senadores) se aplicó igual a los once lemas, no encontré ningún
  lema con banca que haya quedado afuera ni ninguno sin banca que haya entrado. Tampoco encontré
  ningún candidato presidencial de 2024 que falte de las dos listas: los partidos que no llegaron a
  presentar fórmula (Basta Ya, Partido Verde Animalista) no compitieron, así que no corresponde que
  aparezcan en ninguna de las dos columnas.
- accion_sugerida: Intenté yo mismo bajar `https://eleccionesnacionales2024.corteelectoral.gub.uy/`
  con `pnpm fuente` para ver si había una fuente de la Corte Electoral directamente citable (como
  pide el punto 2 del encargo): es un sitio armado en JavaScript que no devuelve los totales en el
  HTML estático, así que confirmo lo que ya había concluido el investigador — no hay una página de
  la Corte con los votos en texto plano. No llegué a revisar
  `https://catalogodatos.gub.uy/dataset/corte-electoral-elecciones-nacionales-2024`, que apareció en
  una búsqueda web y podría tener un dataset estructurado citable; queda para quien retome esto.
  También sostengo la propuesta de `notas.md` de dar de alta el medio `corte-electoral` en
  `content/medios/`.

- severidad: aviso
- objecion: Asimetría de sourcing (punto 8 del encargo): confirmado que la explicación del
  investigador se sostiene — el bug de codificación de la Wikipedia de Delgado era real (lo
  reproduje yo mismo antes del aviso del coordinador) y ya está arreglado. Con el arreglo, el
  esfuerzo de documentación de los cinco registros es comparable: los cuatro que no son Delgado
  también tienen su cronología completa respaldada por el infobox de Wikipedia (que ahora pude leer
  entero para los cinco, no solo para las fuentes ya citadas), y el patrón de una sola fuente por
  mandato en Wikipedia es el mismo que usan registros ya publicados de esta colección (Lacalle Pou,
  Mujica, y la mayoría de los mandatos de Cosse solo tienen a Wikipedia como fuente), así que no es
  una anomalía de este lote. Lo que sí encontré, y por eso esto no es `sin_objecion`, son dos
  puntos concretos de rigor menor: la cita de Manini Ríos no incluye la palabra que prueba el cargo
  (ver `politicos[2]`) y a Mieres le falta un cargo que su propia fuente documenta (ver
  `politicos[3]`). Ninguno de los dos tiene relación con el partido de la persona (uno es Cabildo
  Abierto, el otro Partido Independiente) ni sigue un patrón que favorezca o perjudique a un lado
  del espectro, así que no llego a una objeción de Regla 0 acá.

- severidad: aviso
- objecion: Sobre el uso de WebFetch en las páginas de Wikimedia Commons (categorías e imágenes,
  para crédito y licencia de las fotos): la regla 2 dice que las notas se leen solo con `pnpm
  fuente`. Estas páginas de Commons no son notas y no se citó ningún `cita` textual de ellas (solo
  se usó para llenar `foto.credito`, `foto.licencia` y `foto.pagina`, que no llevan cita), así que no
  hay contenido no leído citado como si se hubiera leído. Aun así, dejo la observación: si en algún
  lote futuro una página de Commons se usara para sostener una afirmación con `cita`, ahí sí
  correspondería `pnpm fuente`.

- severidad: sin_objecion
- objecion: Revisé la entrada de `candidaturas` para Orsi que `notas.md` deja escrita para aplicar
  por corrección (no se tocó `content/politicos/orsi.yaml`, correctamente, siguiendo la instrucción
  de no reescribirlo). Los datos (1.212.833 votos, 51,13%, 16 senadores y 48 diputados del Frente
  Amplio en primera vuelta) están confirmados contra la misma tabla de la Corte Electoral vía
  Wikipedia que usé para verificar a los otros cinco. Cuando se aplique por `pnpm promover --correccion`, está lista tal cual.

## Objeciones al brief

No pude comparar contra el texto literal del brief porque `brief.md` no está en la carpeta de la
corrida (ver "Objeciones al lote", severidad `bloquea`). Contra la descripción del criterio de
inclusión que trae este encargo y contra lo que `notas.md` documenta haber aplicado —que coinciden
entre sí—, no encuentro ninguna instrucción que pida seleccionar, omitir o encuadrar según partido:
el umbral (al menos una banca en cualquiera de las dos cámaras) es una regla numérica objetiva,
verificable con una sola tabla, y se aplicó igual a los seis partidos que entran y a los cinco que
no. No hay verificación de Regla 0 que hacer más allá de la ya hecha en "Objeciones al lote".

## Cobertura

Las diez notas de prensa (no cuento Wikipedia, los documentos oficiales ni el diario de sesiones,
que no son cobertura periodística evaluable por tono) que se leyeron para este lote son, en su
mayoría, crónicas procedimentales de transición de cargos (asunciones, renuncias, composición de
cámaras): no encontré ninguna con una frase evaluativa —a favor o en contra— de la persona que
alcance el estándar de citar una oración concreta que lo muestre, así que las diez quedaron en
`neutral`. Es un resultado esperable para un lote de fichas de identidad/trayectoria: la cobertura
favorable o desfavorable aparece más en declaraciones y gestión, que este lote no cubrió.

```yaml
- medio: subrayado
  url: https://www.subrayado.com.uy/alvaro-delgado-aire-fresco-los-pasos-su-carrera-electoral-n950542
  fecha: 2024-06-29
  evento: "propuesto:internas-partido-nacional-2024"
  politico: delgado
  tono: neutral
  justificacion: >-
    Recuento biográfico sin adjetivación evaluativa: "Delgado fue Inspector General de Trabajo del
    2000 al 2004, y luego fue electo diputado en dos períodos, 2005 y 2010, y senador en dos
    elecciones, 2014 y 2019."

- medio: teledoce
  url: https://www.teledoce.com/telemundo/nacionales/alvaro-delgado-asumio-su-banca-en-el-senado-que-dejara-el-1o-de-marzo-para-asumir-como-secretario-de-presidencia/
  fecha: 2020-02-15
  evento: "propuesto:transicion-gobierno-lacalle-pou-2020"
  politico: delgado
  tono: neutral
  justificacion: >-
    Crónica procedimental de una asunción y renuncia anunciada, sin valoración: "El dirigente
    nacionalista ocupará solamente 15 días su banca en el Senado."

- medio: la-diaria
  url: https://ladiaria.com.uy/politica/articulo/2019/12/lacalle-pou-confirmo-a-delgado-y-ferres-en-la-secretaria-y-prosecretaria-de-presidencia/
  fecha: 2019-12-02
  evento: "propuesto:transicion-gobierno-lacalle-pou-2020"
  politico: delgado
  tono: neutral
  justificacion: >-
    Anuncio de designación reportado sin adjetivos: "El presidente electo Luis Lacalle Pou confirmó
    que el senador nacionalista Álvaro Delgado será el secretario de Presidencia una vez que asuma
    el cargo."

- medio: ambito
  url: https://www.ambito.com/uruguay/alvaro-delgado-le-puso-fecha-su-renuncia-dedicarse-la-campana-n5895429
  fecha: 2023-12-10
  evento: "propuesto:internas-partido-nacional-2024"
  politico: delgado
  tono: neutral
  justificacion: >-
    Reporta el anuncio de renuncia y reproduce una cita autoelogiosa de Delgado sin agregar ni
    contrastar: "el 21 de diciembre me voy con la conciencia tranquila de haber sido parte de un
    gobierno que estuvo a la altura de las circunstancias", pero es la única voz citada y el marco
    de la nota es puramente informativo (fecha y motivo de la renuncia).

- medio: el-observador
  url: https://www.elobservador.com.uy/nacional/alvaro-delgado-el-gestor-activos-lacalle-pou-que-busca-ser-presidente-de-los-pagos-chicos-n5947365
  fecha: 2024-06-23
  evento: "propuesto:internas-partido-nacional-2024"
  politico: delgado
  tono: neutral
  justificacion: >-
    El título usa apodos ("gestor de activos", "presidente de los pagos chicos"), pero ambos salen
    de las propias palabras de Delgado y sus compañeros de partido, citadas en el cuerpo sin que el
    medio los use para elogiar ni para descalificar: "de quien se transformó en su mano derecha o
    –al decir de sus compañeros de partido– en su 'gestor de activos'."

- medio: el-observador
  url: https://elobservador.com.uy/nacional/en-fotos-asi-comenzo-la-50-legislatura-uruguay-nuevos-senadores-y-diputados-n5985291
  fecha: 2025-02-15
  evento: "propuesto:asuncion-50-legislatura-2025"
  politico: delgado
  tono: neutral
  justificacion: >-
    Lo identifica solo por su trayectoria reciente, sin valoración: "la vuelta al senado de figuras
    políticas como el excandidato a presidente por el Partido Nacional Álvaro Delgado."

- medio: el-observador
  url: https://elobservador.com.uy/nacional/en-fotos-asi-comenzo-la-50-legislatura-uruguay-nuevos-senadores-y-diputados-n5985291
  fecha: 2025-02-15
  evento: "propuesto:asuncion-50-legislatura-2025"
  politico: salle
  tono: neutral
  justificacion: >-
    Lo presenta como una cara nueva sin valoración de su gestión o sus posiciones: "También se
    vieron caras nuevas en la Cámara de Representantes, como los legisladores electos Gustavo Salle
    (líder de Identidad Soberana)."

- medio: el-observador
  url: https://elobservador.com.uy/nacional/alvaro-delgado-presento-su-renuncia-al-senado-dedicarse-la-presidencia-del-partido-nacional-n6011520
  fecha: 2025-08-05
  evento: "propuesto:presidencia-directorio-partido-nacional-2025"
  politico: delgado
  tono: neutral
  justificacion: >-
    Reproduce el discurso de despedida de Delgado sin agregar juicio propio y cierra con el dato
    procedimental de la votación: "La cámara alta aprobó su renuncia con 27 votos de los 28
    senadores presentes."

- medio: ambito
  url: https://www.ambito.com/uruguay/que-dice-el-veto-luis-lacalle-pou-al-articulo-72-la-ley-medios-n6046304
  fecha: 2024-08-09
  evento: "propuesto:veto-ley-medios-2024"
  politico: manini-rios
  tono: neutral
  justificacion: >-
    Reporta su queja como cita directa sin sumarle ni restarle: "el líder de Cabildo Abierto, Guido
    Manini Ríos, se mostró sorprendido y lamentó la decisión de Lacalle Pou."

- medio: busqueda
  url: https://www.busqueda.com.uy/politica/la-asuncion-del-nuevo-parlamento-los-detalles-del-inicio-la-legislatura-n5395889
  fecha: 2025-02-15
  evento: "propuesto:asuncion-50-legislatura-2025"
  politico: ojeda
  tono: neutral
  justificacion: >-
    Lo lista entre los senadores del Partido Colorado sin ninguna valoración: "Partido Colorado
    Andrés Ojeda, Gustavo Zubía, Pedro Bordaberry, Tabaré Viera y Robert Silva."
```

## Nota sobre `cobertura.yaml` y `discrepancias.yaml` en el inbox

No escribí ningún archivo `cobertura.yaml` en `inbox/candidatos/2024/2026-09-05/`. Los diez
hallazgos de tono de arriba son todos `neutral` (el valor de menor información para el
Veracímetro de sesgo del sitio), y siete de los diez necesitarían un `evento` que hoy no existe en
`content/eventos/` (`evento: ref('eventos')` es obligatorio en `src/schemas/cobertura.ts`, no acepta
un prefijo `propuesto:` — eso es una convención de esta crítica, no del esquema). Forzarlos contra
`elecciones-2024` o `elecciones-2019` para que el archivo pase `pnpm validar --inbox` habría sido
menos preciso que dejarlos documentados acá. Antes de que esto se pueda promover como
`content/cobertura/`, hacen falta cinco eventos nuevos (semilla): `internas-partido-nacional-2024`
(cubre Subrayado 2024-06-29, Ámbito 2023-12-10 y El Observador 2024-06-23),
`transicion-gobierno-lacalle-pou-2020` (Teledoce 2020-02-15, la diaria 2019-12-02),
`asuncion-50-legislatura-2025` (El Observador 2025-02-15, Búsqueda 2025-02-15),
`presidencia-directorio-partido-nacional-2025` (El Observador 2025-08-05) y
`veto-ley-medios-2024` (Ámbito 2024-08-09). Tampoco escribí `discrepancias.yaml`: el único hallazgo
de esta sesión que se le parece —la fecha de renuncia de Delgado al Senado en 2025, donde Wikipedia
dice el 21 de julio y El Observador dice el 5 de agosto— es un desacuerdo entre dos notas de
prensa, no una distancia contra un documento oficial, diario de sesiones o video, así que por la
regla "solo contra fuente primaria" queda en la crítica (`politicos[0]`) y no en `discrepancias.yaml`.
