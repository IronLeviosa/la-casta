# Crítica — corrida 2026-09-05-vicepresidentes-fichas-2000-2015

Modelo: claude-sonnet-5 (brazo barato del experimento; corrí en Sonnet en lugar de Opus por
instrucción explícita del encargo, no por decisión propia).
Lote: inbox/vicepresidentes/semilla-2000-2015/2026-09-05/
Registros revisados: 3 (politicos: hierro-lopez, nin-novoa, astori)

Nota de proceso: los tres registros ya están en `content/politicos/` (promovidos antes de esta
crítica, por un error de orden que el encargo ya reconoce). Los critiqué como si no estuvieran
publicados. Donde encontré un error, lo señalo para que se corrija por
`content/correcciones/`, que es el camino previsto para un registro ya publicado — no toqué
`content/` ni corrí `promover`.

No escribo `discrepancias.yaml` para este lote: los hallazgos que siguen son errores del propio
registro (lo que escribió el investigador) contra fuentes de prensa que no había abierto, no
casos de "un medio publicó X y el documento oficial dice Y". La regla de discrepancias pide
específicamente un documento oficial, diario de sesiones o video que decida frente a lo que
publicó un medio; acá no hay ese choque medio-vs-documento, así que el hallazgo va en esta
crítica, no en discrepancias.

## Objeciones por registro

### politicos[0] — hierro-lopez — identidad (nombre, alias, partido, wikidata, foto)
- severidad: aviso
- tipo: sin_objecion
- objecion: Verifiqué `wikidata: Q961132` contra Wikidata: corresponde a Luis Hierro López. El
  alias, el nombre completo ("Luis Antonio Hierro López") y el partido ("Partido Colorado")
  coinciden con la ficha de Wikipedia y con el infobox. La foto (`credito: Zeroth`, `CC BY-SA
  4.0`) coincide con lo que dice la página del archivo en Commons: "I, the copyright holder of
  this work, hereby publish it under the following licenses [...] attribution, share alike",
  autor "Zeroth". Sin objeción.
- cita_de_contexto: "Luis Antonio Hierro López (Montevideo, 6 de enero de 1947) es un político
  uruguayo, fue el 13.er vicepresidente de la República entre 2000 y 2005." —
  https://es.wikipedia.org/wiki/Luis_Hierro_L%C3%B3pez
- accion_sugerida: ninguna.

### politicos[0] — hierro-lopez — mandatos[0..4] (Representante Nacional, Presidente de la Cámara, Senador 1995-2000, Ministro del Interior, Vicepresidente 2000-2005)
- severidad: aviso
- tipo: sin_objecion
- objecion: Las cinco fechas coinciden exactamente con el infobox de la Wikipedia en español,
  que dice, en el mismo orden: "Representante Nacional de Uruguay ... 15 de febrero de
  1985-15 de febrero de 1995", "94° Presidente de la Cámara de Representantes de Uruguay
  1 de marzo de 1989-15 de febrero de 1990", "Senador de la República 15 de febrero de
  1995-15 de febrero de 2000", "Ministro del Interior de Uruguay 2 de febrero de 1998-9 de
  octubre de 1998" y "13.er vicepresidente de la República 1 de marzo de 2000-1 de marzo de
  2005". Las citas son literales y contiguas (verifiqué cada una contra el texto bajado con
  `pnpm fuente`, no hay fragmentos cosidos). La superposición entre "Representante Nacional"
  (1985-1995) y "Ministro del Interior" (1998, dentro del período de Senador 1995-2000, que sí
  es distinto) y entre "Senador" y "Ministro del Interior" es normal en el sistema uruguayo (un
  legislador pasa a modalidad de licencia cuando asume un ministerio) y está en la fuente misma,
  no es un error de la ficha.
  Un matiz de forma, no de fondo: "Presidente de la Cámara de Representantes" (1989-1990) se
  cargó como mandato separado de "Representante Nacional" (1985-1995), aunque el período se
  solapa, porque presidir la Cámara es un cargo distinto (electo por los pares, no automático de
  ser representante) — a diferencia de cómo se trató la presidencia del Senado por el
  vicepresidente, que no se separó en un mandato propio para nadie de los tres porque es
  automática del cargo. El criterio es consistente entre los tres registros del lote.
- cita_de_contexto: "Electo Representante Nacional por el Partido Colorado en las primeras
  elecciones nacionales tras la dictadura, en 1984 y reelecto en 1989, fue Presidente de la
  Cámara de Representantes en 1989-1990." — https://es.wikipedia.org/wiki/Luis_Hierro_L%C3%B3pez
- accion_sugerida: ninguna en cuanto a fechas. Como mejora de robustez (no bloqueante): hay un
  documento oficial disponible y no usado, la "Solicitud de venia para acreditar en calidad de
  embajador al señor Luis Antonio Hierro López" (Presidencia de la República, 23 de octubre de
  2020, PDF en https://medios.presidencia.gub.uy/legal/2020/proyectos/10/mrree_230.pdf), citado
  como referencia en la misma página de Wikipedia. Podría reemplazar a Wikipedia como fuente
  primaria para el inicio del cargo de embajador.

### politicos[0] — hierro-lopez — mandatos[5] (Embajador de Uruguay en Perú) y estado_actual
- severidad: bloquea
- tipo: cita_fuera_de_contexto
- objecion: El `hasta: 2022-12-07` y el `estado_actual.situacion: fuera_de_cargo` /
  `salida.fecha: 2022-12-07` están mal, y las dos fuentes citadas para esa fecha no la sostienen
  cuando se leen enteras.
  1) La fuente de El Observador (2022-12-07) se usa para fijar el fin del cargo, pero el texto
     dice exactamente lo contrario: que ESE día Hierro López seguía siendo embajador. La cita
     completa es "El exvicepresidente de la República y ACTUAL embajador uruguayo en Perú, Luis
     Hierro López, aseguró que la destitución del presidente peruano Pedro Castillo..." — "actual
     embajador" documenta que seguía en el cargo el 7 de diciembre de 2022, no que lo dejó ese
     día. Usar esta cita para respaldar un cese es leerla al revés.
  2) La otra fuente citada para el mismo mandato, la Wikipedia en inglés, sí dice "In office
     22 March 2021 – 7 December 2022" con "Preceded by Carlos Barros" pero sin ningún
     "Succeeded by" (a diferencia de la entrada de vicepresidente, que sí tiene predecesor Y
     sucesor). La ausencia de sucesor en un cargo que se afirma cerrado es una señal de que el
     dato del infobox inglés es sospechoso.
  3) La Wikipedia en ESPAÑOL —la misma fuente que se usó sin problema para los otros cinco
     mandatos de esta misma persona, bajada el mismo día— dice lo contrario en su propio
     infobox: "Embajador de Uruguay en Perú Actualmente en el cargo Desde el 9 de diciembre de
     2020", sin fecha de fin. La ficha usa la versión en inglés para el cierre y omite que la
     versión en español, abierta en la misma sesión, contradice ese cierre. Esta contradicción
     ya estaba anotada como hipótesis sin resolver en `notas.md` del propio investigador, pero el
     registro publicado no refleja la incertidumbre: se escribió como hecho cerrado.
  4) Busqué más allá de lo que el investigador encontró (dejó constancia en `consultas.jsonl` de
     haber buscado "Luis Hierro López 2023 2024 2025 cargo actual" sin confirmar nada) y hallé
     dos notas de prensa uruguaya, ninguna de las cuales estaba en el corpus antes de esta
     crítica:
     - Subrayado, 25 de octubre de 2023: "El ministro de Relaciones Exteriores, Francisco
       Bustillo, envió una observación al embajador de Uruguay en Perú, Luis Hierro López, por
       sus comentarios sobre las elecciones en Argentina" — lo llama embajador en funciones
       casi un año después de la fecha de cese que tiene la ficha.
       (https://www.subrayado.com.uy/bustillo-observo-al-embajador-hierro-lopez-sus-comentarios-elecciones-argentinas-n929393)
     - Montevideo Portal, 17 de enero de 2025: "El gobierno propondrá que el exministro de
       Relaciones Exteriores Francisco Bustillo [...] sea designado [...] como nuevo embajador de
       Perú para ocupar el cargo que ACTUALMENTE desempeña el exvicepresidente Luis Hierro
       López [...] Ante el final de la gestión de Hierro López en febrero (fue designado en
       diciembre de 2020)".
       (https://www.montevideo.com.uy/Noticias/Designaran-al-excanciller-Bustillo-como-embajador-en-Peru-en-lugar-de-Hierro-Lopez-uc912433)
     Estas dos notas, leídas juntas, indican que Hierro López fue embajador en Perú de forma
     continua desde su designación (diciembre de 2020 / acreditación marzo de 2021) hasta
     alrededor de febrero de 2025, cuando Bustillo lo sucedió — no hasta diciembre de 2022.
  En síntesis: el `hasta` del mandato, el `situacion` y la `salida` de esta ficha están mal
  fechados por más de dos años, y el error es verificable con dos fuentes de prensa
  independientes (Subrayado, grupo Fontaina-De Feo; Montevideo Portal, grupo montevideo-comm),
  ninguna de las cuales pertenece al mismo grupo que El Observador (grupo
  werthein-hochbaum), que es la única fuente no-Wikipedia que se usó para este dato.
- cita_de_contexto: "el cargo que actualmente desempeña el exvicepresidente Luis Hierro López
  [...] Ante el final de la gestión de Hierro López en febrero (fue designado en diciembre de
  2020)" — https://www.montevideo.com.uy/Noticias/Designaran-al-excanciller-Bustillo-como-embajador-en-Peru-en-lugar-de-Hierro-Lopez-uc912433
- accion_sugerida: No publicar el `hasta` de este mandato ni el `estado_actual` actual tal como
  están. Corregir por `content/correcciones/`: (a) quitar el `hasta: 2022-12-07` del mandato de
  Embajador en Perú o reemplazarlo por la fecha real de cese (buscar la fecha exacta de 2025;
  Montevideo Portal solo da "en febrero" sin día, así que hace falta una fuente más precisa —
  por ejemplo la venia del Senado a Bustillo, o un comunicado de Cancillería); (b) corregir
  `estado_actual.salida.fecha` en consecuencia; (c) si no se encuentra la fecha exacta, bajar
  este dato a `probable` en vez de afirmar un día concreto sin fuente que lo sostenga. Mientras
  tanto, la fuente de El Observador debería quedar solo como evidencia de que seguía en el cargo
  el 7 de diciembre de 2022, no como fuente del cese.

### politicos[1] — nin-novoa — identidad (nombre, alias, partido, wikidata, foto)
- severidad: aviso
- tipo: sin_objecion
- objecion: `wikidata: Q1344343` corresponde a Rodolfo Nin Novoa. El partido "Frente Amplio" es
  el partido al momento de asumir la vicepresidencia (2005), que es el criterio que pide el
  brief ("partido al que pertenecía al asumir"); Wikipedia documenta el cambio de partido en
  1994 ("En 1994 abandona el Partido Nacional..."), así que el dato es correcto aunque no sea
  su partido de origen. La foto (`credito: Uruguayo1977`, CC BY-SA 4.0) coincide con la página
  del archivo en Commons. Sin objeción.
- cita_de_contexto: "Partido político Frente Amplio (desde 1994) Partido Nacional (hasta 1994)"
  — https://es.wikipedia.org/wiki/Rodolfo_Nin_Novoa
- accion_sugerida: ninguna.

### politicos[1] — nin-novoa — mandatos (fechas y citas)
- severidad: aviso
- tipo: sin_objecion
- objecion: Las siete fechas coinciden con el infobox de Wikipedia y, para cuatro de los siete
  mandatos, además con una nota de El Observador (28-2-2025) que repasa toda su carrera y que
  usa fechas iguales a las de Wikipedia ("fue el vicepresidente de Tabaré Vázquez durante el
  primer gobierno del Frente Amplio (2005-2010)", etc.). Todas las citas son literales y
  contiguas. El caso del "Senador de Uruguay" con dos períodos (2000-2005 y 2010-2015) reutiliza
  la misma cita de infobox para los dos mandatos porque así aparecen agrupados en la fuente (dos
  rangos bajo un mismo encabezado); no es un error, es fiel a como Wikipedia presenta el dato.
- cita_de_contexto: "Rodolfo Nin Novoa fue el vicepresidente de Tabaré Vázquez durante el primer
  gobierno del Frente Amplio (2005-2010)." — https://www.elobservador.com.uy/nacional/es-una-gran-noticia-el-pais-rodolfo-nin-novoa-sera-el-embajador-uruguay-brasil-n5987434
- accion_sugerida: ninguna sobre las fechas en sí (ver el próximo bloque sobre el orden de la
  lista).

### politicos[1] — nin-novoa — orden de mandatos[4] y mandatos[5] (Ministro interino de Defensa vs. Ministro de Relaciones Exteriores)
- severidad: corregir
- tipo: contexto_omitido
- objecion: En el YAML, "Ministro interino de Defensa Nacional" (5-12 de agosto de 2016) está
  listado ANTES que "Ministro de Relaciones Exteriores" (1 de marzo de 2015 – 1 de marzo de
  2020), pese a que el segundo empieza año y medio antes que el primero (y lo contiene: fue
  canciller y, dentro de ese período, ministro interino de Defensa por una semana). No es un
  error de fecha — ambas fechas están bien — es un error de orden. Importa porque
  `src/pages/politicos/[slug]/index.astro` (línea 210) renderiza `politico.data.mandatos.map(...)`
  sin ordenar por fecha: la página va a mostrar la línea de tiempo con el interinato de Defensa
  antes que la Cancillería, en el orden equivocado, para cualquier lector del sitio.
- cita_de_contexto: infobox completo, en orden de aparición: "Ministro de Relaciones Exteriores
  de Uruguay 1 de marzo de 2015-1 de marzo de 2020 [...] Ministro interino de Defensa Nacional
  5 de agosto-12 de agosto de 2016" — es decir que incluso la propia Wikipedia los lista en
  orden cronológico correcto (RREE primero); el reordenamiento incorrecto ocurrió al pasar los
  datos a la ficha. — https://es.wikipedia.org/wiki/Rodolfo_Nin_Novoa
- accion_sugerida: reordenar la lista `mandatos` de nin-novoa.yaml por `desde` ascendente antes
  de corregir. Esto es válido para cualquier ficha de político con cargos superpuestos; convendría
  además que el validador o la página ordenen `mandatos` por fecha en vez de depender de que el
  investigador los liste ya ordenados, para que este tipo de error no dependa de la memoria de
  quien escribe el YAML.

### politicos[1] — nin-novoa — estado_actual (en_cargo, embajador en Brasil)
- severidad: aviso
- tipo: sin_objecion
- objecion: El brief pidió específicamente verificar este caso porque figura `en_cargo`. Lo
  verifiqué: la Wikipedia en español, bajada hoy (2026-09-05), dice "Embajador de Uruguay en
  Brasil Actualmente en el cargo Desde el 11 de junio de 2025", y El Observador (28-2-2025)
  documenta el anuncio previo de la designación. No hay contradicción entre las fuentes ni señal
  de que haya dejado el cargo. A diferencia del caso de Hierro López, acá "actualmente en el
  cargo" no choca con ninguna otra fuente abierta en esta sesión. Sin objeción.
- cita_de_contexto: "Embajador de Uruguay en Brasil Actualmente en el cargo Desde el 11 de junio
  de 2025" — https://es.wikipedia.org/wiki/Rodolfo_Nin_Novoa
- accion_sugerida: ninguna.

### politicos[1] — nin-novoa — pista no registrada (pedido de desafuero, 2011)
- severidad: aviso
- tipo: contexto_omitido
- objecion: El propio artículo de Wikipedia que el investigador leyó y citó dice, más abajo del
  fragmento que uso para las fechas: "En agosto de 2011 hubo un pedido de desafuero en su
  contra, que no tuvo éxito." Esto no debía convertirse en un caso de `content/casos/` (el brief
  prohíbe investigar causas judiciales salvo pedido explícito, con razón), pero sí calificaba
  para anotarse como pista en `notas.md` o en `<CORPUS_DIR>/corpus/pistas/nin-novoa.yaml`, igual
  que se hizo con la mención más vaga de "denuncias de corrupción" de 2009 (que sí quedó
  anotada en `casos_vistos`). No encontrar ambas menciones en la misma lectura no es grave, pero
  vale la pena que quede registrado para quien continúe.
- cita_de_contexto: "En agosto de 2011 hubo un pedido de desafuero en su contra, que no tuvo
  éxito." — https://es.wikipedia.org/wiki/Rodolfo_Nin_Novoa
- accion_sugerida: agregar esta pista a `<CORPUS_DIR>/corpus/pistas/nin-novoa.yaml` si todavía no
  está, con la fecha (agosto 2011) y la fuente.

### politicos[2] — astori — identidad (nombre, alias, partido, wikidata, foto)
- severidad: aviso
- tipo: sin_objecion
- objecion: `wikidata: Q51983` corresponde a Danilo Astori. Nombre completo, alias y partido
  coinciden con la fuente. La foto (`credito: Fábio Rodrigues Pozzebom/ABr`, `CC BY 3.0 BR`)
  coincide con la página de Commons, que dice "Author: Photo by Fábio Rodrigues Pozzebom/ABr" y
  aclara que la licencia libre aplica a este archivo (de 2007, previo al cambio de política de
  Agência Brasil en 2017 que la nota de la propia página menciona). Sin objeción.
- cita_de_contexto: "Danilo Ángel Astori Saragosa (Montevideo, 23 de abril de 1940-Montevideo,
  10 de noviembre de 2023)... fue un contador público, economista, profesor universitario,
  escritor y político uruguayo." — https://es.wikipedia.org/wiki/Danilo_Astori
- accion_sugerida: ninguna.

### politicos[2] — astori — mandatos (fechas y citas)
- severidad: aviso
- tipo: sin_objecion
- objecion: Las seis fechas coinciden con el infobox de Wikipedia, en el mismo orden y sin
  superposiciones no explicadas: Senador 1990-2005 (un solo mandato agregado, pese a corresponder
  a tres elecciones sucesivas 1990-95/95-2000/2000-05, igual que hace el propio infobox),
  Ministro de Economía 2005-2008, Senador 2008-2010, Vicepresidente 2010-2015, Ministro de
  Economía 2015-2020, Senador 2020-2022. La cita del primer bloque de Senador es un párrafo
  contiguo de la sección "Actuación en el Frente Amplio", no una cita armada: verifiqué el
  párrafo completo y el texto de la ficha es un recorte literal, sin fragmentos de otras partes
  del artículo pegados. Correctamente NO se incluyó como mandato su candidatura a la
  vicepresidencia de 1989 (la perdió, junto a Seregni) ni su decanato universitario de 1973 (no
  es cargo electivo ni de gobierno), coherente con lo que explica `razones.md`.
- cita_de_contexto: "En 1989 fue Candidato a la vicepresidencia de la República [...] Fue
  elegido senador por el período 1990-1995 por el Frente Amplio." —
  https://es.wikipedia.org/wiki/Danilo_Astori
- accion_sugerida: ninguna.

### politicos[2] — astori — mandatos[5] (Senador 2020-2022) y contexto de la licencia por salud
- severidad: aviso
- tipo: contexto_omitido
- objecion: No es un error, pero falta un matiz: el propio infobox dice "Senador de la
  República en uso de licencia desde el 17 de marzo de 2020" — es decir que Astori estuvo de
  licencia médica durante prácticamente todo ese mandato (asumió el 15-2-2020 y pidió licencia
  un mes después). El Observador lo confirma: "el exjerarca casi no ejerció la banca debido al
  agravamiento de sus problemas de salud." La ficha no afirma nada falso al listar el mandato
  con sus fechas formales, pero un lector que use esta ficha para atribuirle actividad
  legislativa en ese período (una declaración, un voto) estaría construyendo sobre un cargo que
  formalmente tuvo pero que apenas ejerció. No pido cambiar el dato, solo dejar constancia para
  quien lo use después.
- cita_de_contexto: "Elegido senador para el actual período, el exjerarca casi no ejerció la
  banca debido al agravamiento de sus problemas de salud." —
  https://www.elobservador.com.uy/nota/murio-danilo-astori-exvicepresidente-y-ministro-de-economia-2023111012342
- accion_sugerida: ninguna sobre el registro; si en el futuro se cargan declaraciones de Astori
  de 2020-2022, tener presente esta licencia al fechar su cargo real.

### politicos[2] — astori — estado_actual (fallecido)
- severidad: aviso
- tipo: sin_objecion
- objecion: La fecha de fallecimiento (10-11-2023) coincide en Wikipedia ("Falleció el 10 de
  noviembre de 2023") y en El Observador ("Murió Danilo Astori El exministro de Economía Danilo
  Astori murió este viernes a los 83 años de edad"), dos fuentes independientes para el mismo
  hecho. Sin objeción.
- cita_de_contexto: "Murió Danilo Astori El exministro de Economía Danilo Astori murió este
  viernes a los 83 años de edad." — https://www.elobservador.com.uy/nota/murio-danilo-astori-exvicepresidente-y-ministro-de-economia-2023111012342
- accion_sugerida: ninguna.

## Objeciones al lote

- **Error de fecha que corre en cascada.** El hallazgo principal (Hierro López, embajador en
  Perú) es exactamente el riesgo que describe el encargo de esta crítica: "un error de fecha acá
  desplaza después toda la línea de tiempo del sitio". Si en el futuro se cargan declaraciones de
  Hierro López como "actual embajador" fechadas entre 2023 y 2025, un chequeo automático o un
  editor apurado podría descartarlas por parecer incompatibles con `estado_actual`, cuando en
  realidad el que está mal es el registro de la ficha.

- **Dependencia de Wikipedia, desigual entre los tres.** Los tres cumplen el mínimo del brief
  (al menos una fuente no-Wikipedia por persona), pero el reparto es desigual: de los bloques de
  fuentes por mandato + salida, Nin Novoa tiene no-Wikipedia en 4 de 7 (57%), Astori en 2 de 7
  (29%) y Hierro López en 1 de 7 (14%) — y ese único bloque no-Wikipedia de Hierro López es,
  precisamente, el que está mal interpretado. No encuentro que esto sea un sesgo partidario: Nin
  Novoa y Astori son ambos identificados con el Frente Amplio en el período que importa y tienen
  niveles de sourcing muy distintos entre sí, así que la diferencia se explica mejor por qué
  articulo de prensa "de repaso de carrera" existía para cada uno (El Observador publicó un
  perfil completo de Nin Novoa por su nombramiento de 2025 que no tiene equivalente para los
  otros dos) que por el partido de cada uno. De todas formas, para un cargo activo y con fechas
  en disputa como el de Hierro López, una sola fuente no-Wikipedia no alcanzaba, y el resultado
  lo confirma.

- **Simetría de esfuerzo entre los tres.** El número de mandatos documentados (6, 7 y 6) es
  comparable y no sugiere por sí solo que a alguno se le buscó menos. Las tres personas atravesaron
  cargos de gobierno bastante distintos entre sí (legislativo puro para Hierro López antes y
  después de la vicepresidencia; intendencia y cancillería para Nin Novoa; ministerio de Economía
  dos veces para Astori), así que la diferencia de cantidad de cargos refleja trayectorias reales,
  no un recorte deliberado.

- **Cobertura del período y casos.** Ninguno de los tres dejó la vicepresidencia antes de tiempo,
  y el investigador no investigó ninguna causa judicial de ninguno de los tres, aplicando la
  misma regla a los tres (correcto según el brief, que prohíbe investigar casos judiciales salvo
  pedido explícito). El caso de Sendic (único vicepresidente uruguayo que renunció a mitad de
  mandato, fuera del recorte 2000-2015) quedó correctamente derivado a una pista y no a esta
  corrida.

- **Orden de mandatos no normalizado.** El error de orden encontrado en Nin Novoa (ver arriba)
  sugiere que conviene, a nivel de esquema o de validador, exigir o forzar que `mandatos` esté
  ordenado por `desde` ascendente, en vez de confiar en que cada agente los liste en ese orden.
  Esto no es específico de este lote — cualquier ficha futura con cargos superpuestos puede
  repetir el error — pero lo anoto acá porque es donde lo encontré.

## Objeciones al brief

Ninguna. El brief pide expresamente el mismo criterio para los tres ("Regla 0: el criterio es el
mismo para los tres, sean del partido que sean. No omitas ni suavices nada de ninguno"), cubre un
Colorado, un exblanco pasado a frenteamplista y un frenteamplista, y no pide omitir ni destacar
nada de ninguno por su partido. No encontré ninguna instrucción para rechazar. El recorte
temporal (2000-2015, tres vicepresidentes consecutivos) es un criterio cronológico razonable para
una semilla identitaria por fases; coincido con la nota del propio investigador en que la
extensión natural (Sendic 2015-2020, y hacia atrás de 2000) debería seguir en corridas futuras
con el mismo criterio, no que falte acá.

## Cobertura

```yaml
- medio: el-observador
  url: https://www.elobservador.com.uy/nota/hierro-lopez-embajador-uruguayo-en-peru-sobre-destitucion-de-castillo-esto-se-veia-venir--2022127204735
  fecha: 2022-12-07
  evento: "propuesto:crisis-politica-peru-2022"
  politico: hierro-lopez
  tono: neutral
  justificacion: >-
    La nota reporta la opinión de Hierro López sobre la destitución de Pedro Castillo sin
    comentario editorial a favor o en contra de él: "aseguró que la destitución del presidente
    peruano Pedro Castillo era algo que 'se veía venir'".

- medio: el-observador
  url: https://www.elobservador.com.uy/nacional/es-una-gran-noticia-el-pais-rodolfo-nin-novoa-sera-el-embajador-uruguay-brasil-n5987434
  fecha: 2025-02-28
  evento: "propuesto:transicion-embajadas-gobierno-orsi-2025"
  politico: nin-novoa
  tono: favorable
  justificacion: >-
    La nota se construye alrededor de una cita elogiosa sobre su designación: "Con alegría
    recibo la noticia de que Rodolfo Nin será nuestro embajador en Brasil. Es una gran noticia
    para el país [...] Su experiencia como ex vicepresidente y canciller es un aporte
    fundamental", sin ninguna voz crítica que contrapese.

- medio: el-observador
  url: https://www.elobservador.com.uy/nota/murio-danilo-astori-exvicepresidente-y-ministro-de-economia-2023111012342
  fecha: 2023-11-10
  evento: "propuesto:fallecimiento-danilo-astori-2023"
  politico: astori
  tono: favorable
  justificacion: >-
    La nota reúne solo mensajes de condolencia y reconocimiento de figuras de distintos
    partidos, sin ninguna crítica, por ejemplo "Todo Nacional lamenta profundamente el
    fallecimiento de Danilo Astori, quien desarrolló una extensa carrera política"; aplico el
    mismo criterio que aplicaría a la nota necrológica de cualquier otro político, de cualquier
    partido, que muriera en el cargo o después de él.

- medio: subrayado
  url: https://www.subrayado.com.uy/bustillo-observo-al-embajador-hierro-lopez-sus-comentarios-elecciones-argentinas-n929393
  fecha: 2023-10-25
  evento: "propuesto:incidente-diplomatico-hierro-lopez-2023"
  politico: hierro-lopez
  tono: desfavorable
  justificacion: >-
    La nota reporta una sanción administrativa contra él y cita a una senadora que lo cuestiona
    directamente: "la senadora del Frente Amplio Liliam Kechichian [...] reclamó: 'Un embajador
    no debería hacer estos comentarios'", sin que la nota incluya una defensa de Hierro López.
    (Esta nota no estaba citada en el registro; la abrí durante esta crítica para verificar la
    fecha real de salida del cargo de embajador; ver el hallazgo de arriba.)

- medio: montevideo-portal
  url: https://www.montevideo.com.uy/Noticias/Designaran-al-excanciller-Bustillo-como-embajador-en-Peru-en-lugar-de-Hierro-Lopez-uc912433
  fecha: 2025-01-17
  evento: "propuesto:transicion-embajadas-gobierno-orsi-2025"
  politico: hierro-lopez
  tono: neutral
  justificacion: >-
    La nota trata principalmente de la designación de Bustillo y menciona a Hierro López solo en
    términos factuales, sin valorar su gestión: "el cargo que actualmente desempeña el
    exvicepresidente Luis Hierro López". (Tampoco estaba citada en el registro; misma
    verificación que la anterior.)
```

No incluyo a Wikipedia en `cobertura`: es una enciclopedia de edición abierta
(`content/medios/wikipedia.yaml` la describe explícitamente como "no un medio periodístico") y el
campo de tono está pensado para juzgar cómo trata la prensa a un político, no para calificar un
infobox.
