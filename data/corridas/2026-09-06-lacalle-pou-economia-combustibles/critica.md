# Crítica — corrida 2026-09-06-lacalle-pou-economia-combustibles

Modelo: claude-opus-5 (1M de contexto). La tabla de `CLAUDE.md` asigna Opus al rol de crítico, así que acá no
hay diferencia entre lo declarado y lo que corrió; el experimento de modelos no afecta a este lote.
Lote: `inbox/lacalle-pou/economia/combustibles/2026-09-06/`
Registros revisados: 3 (1 declaración que reemplaza a una publicada, 2 chequeos nuevos)

Abrí con `pnpm fuente` en esta sesión **todas** las fuentes citadas por el lote: el audio de Presidencia (con su
transcripción segmentada), Subrayado, El País, El Observador, el boletín del CED, el dataset de URSEA en
catalogodatos, el Decreto 64/022 en IMPO y la Síntese Semanal n.º 12/2022 de la ANP. Las dos consultas manuales
(BCU por SOAP, BCB por OData) no las repetí: sobre esas opino como problema de verificabilidad, abajo.

`pnpm banco lacalle-pou/2022-03-27-mecanismo-transparencia-no-paga-sobrecosto` devuelve **"sin evidencia
guardada"**. No hay pedidos rechazados previos sobre este registro cuya evidencia haya que sumar a la de ahora,
así que este caso se resuelve por sí solo. Sí conviene que quede escrito para el próximo que lo mire: el registro
ya pasó por dos correcciones (`2026-09-06-combustibles-el-pais-cambio-tier`, que lo subió de `probable` a
`publicado` con El País como segundo grupo, y `2026-09-06-titulos-declaraciones`, que le puso título), y las dos
son anteriores a que apareciera el audio. Lo que sigue las revisa a la luz de la primaria.

**Estado mecánico.** `pnpm validar --inbox` da 5 errores de referencias (medios inexistentes: `ced`,
`catalogodatos-gub-uy`, `anp-brasil`, `bcu`, `bcb-brasil`). Importa más de lo que parece: `pnpm validar:red` sobre
este lote **aborta en la etapa 2 y nunca llega a la etapa 5**, así que a hoy *ninguna* cita de este lote está
verificada por máquina. Las verifiqué a mano, una por una, y todas calzan (detalle en cada bloque). Pero el editor
no debe leer "el lote está validado": no lo está, y no lo va a estar hasta que existan los cinco medios.

---

## Resumen de lo que bloquea

Tres cosas, y una es grande:

1. **El País está en `evidencia.fuentes` de los dos chequeos con una cita que no contiene lo chequeado.** Su nota
   no dice "Brasil" ni "millones" en ningún lado (lo comprobé sobre el texto completo del corpus). Es exactamente
   la "segunda fuente falsa": pasa la validación de red porque cada fuente valida su propia cita, y le regala al
   registro un segundo grupo de medios para una afirmación que ese medio nunca publicó.
2. **El par de gasoil elegido decide el resultado del chequeo de Brasil, y el documento que lo daría vuelta ya
   está citado.** Con Gas Oil 50S (53,99) Uruguay sale 6,8 % más barato; con Gas Oil 10S (67,30) —el grado que
   comparte especificación de azufre con el Diesel S10 brasileño— Uruguay sale 16,2 % **más caro**. Los dos
   precios están en el mismo artículo 2 del mismo decreto, y la cita del registro se corta una línea antes del
   segundo.
3. **La afirmación chequeada no es la que el presidente dijo.** El audio dice "hoy por primera vez creo que del
   2001 2002 tenemos combustibles más baratos que Brasil"; el `resumen` heredado de la prensa dice "por primera
   vez **los** combustibles eran más baratos que en Brasil", y el `afirmacion` del chequeo lo repite. Se le quitó
   la reserva ("creo que"), la referencia temporal ("del 2001 2002") y se le agregó un artículo definido que
   convierte una frase ambigua en una universal. Ahora que hay primaria, el Veracímetro no puede calificar la
   versión de la prensa.

---

## Objeciones por registro

### declaraciones[0] — 2022-03-27 — "Estamos convencidos de que es una medida de transparencia…"

Antes de las objeciones, lo que hay que decir a favor porque también se audita: **la identificación de la primaria
es sólida y bien encadenada.** La gacetilla oficial del hecho enlaza la carpeta de activos `AJ_170`, y las imágenes
que sí lista (`.../AJ_170/fgr_01.jpg`) son de esa misma carpeta; el `Last-Modified` del mp3 (2022-03-28 02:57 UTC =
23:57 del 27 en Montevideo) cae dentro de la noche del hecho. Verifiqué además que `pregunta` (776 caracteres),
`contexto` (1.021) y `cita` son copia **literal y contigua** de la transcripción, sin empalmes. Eso está bien hecho.

#### A) La `cita` de cabecera del registro ya no es la de la primaria
- severidad: corregir
- tipo: cita_fuera_de_contexto
- objecion: El registro pasa a `nivel: textual`, que quiere decir "lo dijo con esas palabras y hay registro
  primario". Pero su campo `cita` de cabecera —el que se muestra como el titular de la declaración— sigue siendo
  la transcripción de Subrayado: "…de transparencia **y** que el uruguayo no paga **sobrecosto**". El audio dice
  "…de transparencia que el uruguayo no paga sobrecostos". Queda un registro que se declara textual y encabeza
  con palabras que la primaria no tiene.
- cita_de_contexto: "estamos convencidos de que es una medida de transparencia que el uruguayo no paga
  sobrecostos" — https://web.archive.org/web/20241120195416if_/https://medios.presidencia.gub.uy/tav_portal/2022/noticias/AJ_170/AJ_170.mp3 (657,48 s – 666,34 s)
- accion_sugerida: Cambiar la `cita` de cabecera por la del audio. **Dos advertencias.** (i) Como el registro ya
  está publicado, esto exige una corrección escrita antes de `promover`; el tipo que corresponde es
  `cotejo_con_primaria` ("se incorporó o se cotejó el registro primario de un hecho que estaba citado por la
  prensa: cambia el nivel de evidencia o la literalidad de una cita, no lo afirmado"), que es literalmente este
  caso. (ii) **No usar esto para declarar equivocada a Subrayado en la "y".** Whisper no produce puntuación y
  puede omitir monosílabos átonos; además el segmento "que el uruguayo" dura 2,12 s (662,48→664,60) contra
  0,62–1,30 s de sus vecinos, lo que es compatible tanto con una pausa como con una palabra corta no
  transcripta. El plural "sobrecostos" sí es robusto (es una sílaba entera, y El País lo trae igual de forma
  independiente). Que quede en `notas_internas`.

#### B) `literalidad` de las dos notas (lo que pidió el encargo)
- severidad: corregir
- tipo: cita_fuera_de_contexto
- objecion: La pregunta "¿cuál de las dos notas es más fiel?" no tiene una respuesta única, y contestarla con una
  sola palabra sería falsear el resultado. **El País es más fiel en las palabras de la única frase que
  entrecomilla; Subrayado es más completa en cobertura pero altera una de las frases que entrecomilla.** El País
  calza palabra por palabra con el audio salvo una coma (no adjudicable: la transcripción no tiene puntuación).
  Subrayado publica entre comillas «Hoy por primera vez tenemos combustibles más baratos que Brasil» cuando el
  audio, entre "por primera vez" y "tenemos combustibles", trae cuatro palabras más: "creo que del 2001 2002".
  No hay puntos suspensivos ni corchetes. Eso no es puntuación ni plural: es una reserva del hablante y una
  referencia temporal, y es la diferencia que decide qué se puede chequear.
- cita_de_contexto: "tan es así que hoy por primera vez creo que del 2001 2002 tenemos combustibles más baratos
  que Brasil" — audio, 704,4 s – 713,0 s
- accion_sugerida: El País → `literalidad: literal` (marca 657, correcta: "estamos convencidos" empieza en
  657,48). Subrayado → `literalidad: difiere`, con `verificada_en.diferencia` diciendo qué falta, sin verbos de
  intención; algo como *"La frase entrecomillada omite, sin señalarlo, 'creo que del 2001 2002', que en el audio
  va entre 'por primera vez' y 'tenemos combustibles'."* `condensada` sería defendible sólo si se considera que
  quitar una reserva es un recorte fiel —yo sostengo que no lo es— y en ese caso el esquema obliga a agregarle
  `contexto` a esa fuente. Su marca 644 apunta a "no vamos a cambiar" (644,7), que es donde arranca el pasaje que
  parafrasea: eso está bien. Queda además registrado en `discrepancias.yaml` de este lote.

#### C) El `resumen` universaliza lo que el audio dejó ambiguo
- severidad: corregir
- tipo: contexto_omitido
- objecion: El `resumen` dice "por primera vez **los** combustibles eran más baratos que en Brasil". El audio dice
  "tenemos combustibles más baratos que Brasil", sin artículo. Sin artículo la frase admite lectura existencial
  ("tenemos [algunos] combustibles más baratos"), que es verdadera para el gasoil; con "los" queda una universal
  que es falsa para la nafta. El artículo lo agregamos nosotros: no está ni en el audio ni en Subrayado. También
  se pierde "creo que del 2001 2002". Esto no es cosmético: los dos `fragmento` de `chequeos.yaml` se copian del
  `resumen` y el validador exige que aparezcan tal cual en él (`referencias.ts`, regla 7), así que la afirmación
  que califica el Veracímetro es la que escribimos en el resumen.
- cita_de_contexto: "hoy por primera vez creo que del 2001 2002 tenemos combustibles más baratos que Brasil" —
  audio, 706,8 s – 713,0 s
- accion_sugerida: Reescribir esa cláusula del `resumen` siguiendo la primaria, p. ej. *"y dijo que 'por primera
  vez', según creía desde 2001 o 2002, Uruguay tenía combustibles más baratos que Brasil"*. **Y actualizar en el
  mismo movimiento el `fragmento` de `chequeos.yaml#1`**, que si no deja de calzar y rompe el build.

#### D) El `resumen` suelta el ancla de la cifra de sobrecostos
- severidad: corregir
- tipo: contexto_omitido
- objecion: El audio dice "mil setecientos y pico millones de dólares **por encima de lo que era el precio de
  paridad**". El `resumen` conserva el monto y pierde el patrón de comparación. "Sobrecosto" a secas se lee como
  sobreprecio absoluto; "por encima del precio de paridad de importación" es una definición técnica concreta y
  discutible. Sin ella el chequeo queda calificando una afirmación más fuerte que la que se hizo.
- cita_de_contexto: "¿saben cuánto pagó de sobrecostos en el quinquenio pasado los uruguayos? mil setecientos y
  pico millones de dólares por encima de lo que era el precio de paridad" — audio, 666,3 s – 678,1 s
- accion_sugerida: Agregar "por encima del precio de paridad de importación" al `resumen` y al `afirmacion` del
  chequeo 0. Mismo cuidado con el `fragmento`.

#### E) La pregunta que motiva la respuesta no aparece en el `resumen`
- severidad: corregir
- tipo: contexto_omitido
- objecion: Esto es lo que el encargo pedía mirar en el punto (d), y sí cambia el sentido. El `resumen` presenta
  la frase como un anuncio ("dijo en conferencia de prensa que no se iba a cambiar el mecanismo"). En el audio es
  la respuesta a un periodista que le está reprochando una promesa incumplida, y el presidente concede parte del
  reproche antes de la frase que citamos: "es muy difícil es muy difícil con esos precios poder bajar". El
  registro hace bien en guardar la `pregunta` completa en la fuente primaria; el problema es que la página del
  lector ve el `resumen`, no el campo `pregunta`.
- cita_de_contexto: "usted en la campaña había prometido bajar los combustibles ¿hay posibilidad de parte del
  gobierno de modificar el método de fijación de precios de los combustibles […] no se cumplió con esa promesa
  de bajar los combustibles porque en realidad por lo menos en los últimos meses han subido consecutivamente" —
  audio, 620,0 s – 644,7 s
- accion_sugerida: Una cláusula en el `resumen` que diga que respondía a una pregunta sobre el incumplimiento de
  la promesa de campaña. Y dos cosas que **no** son de este lote pero que la primaria habilita, para la cola:
  (i) el pasaje 620–644 s + 698–702 s es evidencia primaria para
  `content/promesas/lacalle-pou/no-aumentar-combustibles.yaml` (hoy `estado: incumplida`, sostenido con prensa);
  (ii) el periodista atribuye una promesa de **bajar** los combustibles, mientras que el registro de promesa
  documenta una de **no aumentarlos**. Son promesas distintas y el presidente no discute el encuadre. Hay que
  buscar si existe la promesa de bajar; si no existe, hay que decir que la premisa del periodista no está
  documentada. Yo no abro el registro.

#### F) `url_nota` apunta a una página que no contiene nada de lo citado
- severidad: aviso
- tipo: contexto_omitido
- objecion: La gacetilla `lacalle-pou-manana-seguiremos-trabajando-temas-urgentes-para-uruguay` no menciona
  "combustible", "sobrecosto" ni "Brasil" en ningún lugar (lo verifiqué con `--buscar` sobre las tres palabras: 
  "sin coincidencias en esta nota" para las tres). Un lector que la abra buscando la cita no la encuentra.
- cita_de_contexto: "Enlaces relacionados Audios Palabras del presidente de la República, Luis Lacalle Pou" —
  https://www.gub.uy/presidencia/comunicacion/noticias/lacalle-pou-manana-seguiremos-trabajando-temas-urgentes-para-uruguay
- accion_sugerida: Mantener el `url_nota` (es la cadena de procedencia del audio, y es lo que prueba que el mp3
  es de esa conferencia) pero decir en `notas_internas` que la gacetilla oficial **no** resume la ronda de
  preguntas y que por eso el pasaje de combustibles sólo existe en el audio. Es además el dato que justifica el
  esfuerzo: acá la versión oficial extensa que suele existir para discursos no existe para el Q&A.

#### G) La primaria vive sólo en Wayback y es una transcripción automática
- severidad: aviso
- tipo: sin_objecion (información para el editor)
- objecion: Dos cosas que el lector merece saber y que hoy no están escritas en ningún lado del registro. (i) El
  archivo original en `medios.presidencia.gub.uy` da 404 y la única copia viva es la de Wayback del 2024-11-20; si
  esa copia cae, el registro se queda sin primaria. Hay precedente de citar `web.archive.org` como `url` de la fuente en
  `content/`, pero es raro: 2 casos contra 14 en que Wayback aparece sólo como `archived_url`. Es decir, la
  práctica está aceptada pero este sería el tercer registro que depende de Wayback para existir. (ii) La `cita` no sale de una transcripción oficial sino de Whisper
  `large-v3-turbo` corrido por nosotros. Es mejor que la prensa —son las palabras efectivamente grabadas— pero es
  una transcripción de máquina, sin puntuación, y eso limita qué diferencias entre versiones de prensa se pueden
  adjudicar contra ella (ver A y B).
- accion_sugerida: `notas_internas` con las dos cosas. Correr `pnpm archivar` para que el mp3 tenga una segunda
  captura. No corresponde `verificacion: manual`: el audio **sí** es verificable por máquina, se transcribió con
  la herramienta del repo, y ponerle `manual` lo mandaría innecesariamente a la compuerta humana.

---

### chequeos[0] — "más de USD 1.700 millones de sobrecostos"

#### A) El País como fuente de evidencia de una cifra que su nota no publica
- severidad: bloquea
- tipo: un_solo_grupo
- objecion: `evidencia.fuentes[2]` es El País con la cita "Estamos convencidos de que es una medida de
  transparencia, que el uruguayo no paga sobrecostos". Esa nota **no contiene** "1.700", ni "700 millones", ni
  "millones", ni "paridad" (busqué las cuatro sobre los 4.353 caracteres del texto completo en el corpus: cero
  ocurrencias de cada una). El País no es testigo de esta afirmación. Hoy el chequeo es `textual` y se sostiene
  con el audio, así que la fuente falsa no cambia nada visible —y por eso es peligrosa: si el editor decide que
  una transcripción automática no alcanza para `textual` y baja el registro a `reportado`, El País pasa a ser el
  segundo grupo de medios de un dato que jamás publicó, y la regla de dos grupos queda satisfecha por un testigo
  inexistente.
- cita_de_contexto: la nota entera de El País sobre combustibles es: "Consultado sobre si se considera la
  posibilidad de modificar el método de fijación de precios de los combustibles, dijo que no se va a cambiar
  porque es 'la forma que votó el Parlamento por unanimidad' y aclaró que se llegó con una idea y del Parlamento
  salió otra. 'Estamos convencidos de que es una medida de transparencia, que el uruguayo no paga sobrecostos',
  sostuvo." — https://www.elpais.com.uy/informacion/politica/lacalle-dijo-que-el-referendum-es-una-etapa-superada-y-la-luc-queda-firme
- accion_sugerida: Sacar El País de `evidencia.fuentes` de este chequeo. Quedan el audio (666–678 s) y Subrayado,
  que sí trae la cifra. No convertirla en "otra colección" ni en registro nuevo: para *esta* afirmación no aporta
  nada, y ya está donde corresponde, en la declaración.

#### B) `afirmacion` sin el patrón de comparación y con el quinquenio corrido
- severidad: corregir
- tipo: contexto_omitido
- objecion: Dos deslizamientos chicos que se suman. (i) `afirmacion` dice "se pagaron más de USD 1.700 millones de
  sobrecostos en combustibles" y omite "por encima de lo que era el precio de paridad", que el audio sí tiene y
  que es lo único que define qué se está midiendo (ver declaraciones[0] D). (ii) `afirmacion` dice "el quinquenio
  2015-2019"; el presidente dijo "el quinquenio pasado", que es marzo 2015 – marzo 2020, y el CED midió años
  calendario 2015-2019. La diferencia (enero-febrero de 2020 dentro, enero-febrero de 2015 fuera) probablemente
  no mueve el total, pero el registro la está resolviendo en silencio.
- cita_de_contexto: "¿saben cuánto pagó de sobrecostos en el quinquenio pasado los uruguayos? mil setecientos y
  pico millones de dólares por encima de lo que era el precio de paridad" — audio, 666,3 s – 678,1 s
- accion_sugerida: `afirmacion` = *"En el quinquenio anterior (2015-2019 según el cálculo disponible) los
  consumidores uruguayos pagaron más de USD 1.700 millones por encima del precio de paridad de importación de
  nafta y gasoil."* Y en `dato_real.valor`, una línea sobre el desfase de dos meses entre "quinquenio de
  gobierno" y "años calendario".

#### C) La explicación del 1137/1.337 afirma una causa que no se puede verificar
- severidad: corregir
- tipo: explicacion_alternativa
- objecion: `dato_real.valor` dice que el bloque resumen del PDF trae 1137 "aparentemente por un error de
  extracción del texto de una infografía con columnas". Eso es una conjetura sobre cómo se produjo la diferencia,
  y el registro no tiene forma de sostenerla —es el mismo tipo de verbo de intención que la colección de
  discrepancias prohíbe, aplicado a un documento propio. Y el fork es material, no decorativo: **443 + 1.337 =
  1.780** ("mil setecientos y pico", coincide) pero **443 + 1.137 = 1.580** (no coincide). O sea que la lectura
  que elegimos es exactamente la que hace cerrar la cifra del presidente, y la elegimos con una explicación que
  no probamos.
- cita_de_contexto: bloque resumen (carácter ~1160): "nafta sobreprecio de USD 443 millones / consumidores
  uruguayos de gasoil pagaron USD 1137 millones más que PPI. la presentó un , mientras que los 2015-2019:"; cuerpo
  narrativo (carácter 7862): "En el periodo 2015-2019, la nafta presentó un sobreprecio de USD 443 millones,
  mientras que los consumidores uruguayos de gas oil pagaron aprox. USD 1.337 millones más que la referencia de
  PPI." — https://todoelcampo.com.uy/wp-content/uploads/2022/03/CED-Combustibles.-Boletin-Macroeconomico-N%C2%B027.pdf
- accion_sugerida: Reescribir sin causa: *"El documento trae la cifra dos veces con un dígito distinto: 1137 en el
  bloque resumen de la primera página y 1.337 en el párrafo del cuerpo. El Observador, citando el mismo informe
  el 2022-03-07, transcribe 1.337. No se establece a qué se debe la diferencia."* La corroboración de El
  Observador es real pero **no independiente**: lee el mismo PDF. Vale la pena decirlo así.

#### D) Contexto omitido: el "factor X" que el propio gobierno reconoció
- severidad: corregir
- tipo: contexto_omitido
- objecion: Esta es la explicación alternativa más fuerte del chequeo, y no está en el registro. La brecha entre
  el precio de venta y el PPI no es sólo margen: incluye componentes que son obligación legal o política de
  Estado y que siguieron vigentes bajo el gobierno que hace la acusación. El Observador lo dice arrancando la
  nota, atribuyéndoselo al propio gobierno de Lacalle Pou. Llamar "sobrecosto" a todo el diferencial y adjudicarlo
  al quinquenio anterior omite que una parte identificada de él es un subsidio cruzado que ninguna administración
  eliminó.
- cita_de_contexto: "En el punto de partida, el gobierno reconoció un sobreprecio de hasta $ 2,97 por litro
  (llamado factor x) en la tarifa del gasoil y las gasolinas por la incidencia del subsidio que tiene el supergás,
  el sobrecosto por la mezcla con biocombustibles, las pérdidas de Ancap en el pórtland y otras ineficiencias del
  ente. En la hoja de ruta del gobierno, el objetivo era que ese sobreprecio se suprimiera en un plazo de tres
  años." —
  https://www.elobservador.com.uy/nota/el-precio-de-la-nafta-y-el-gasoil-que-muestran-los-numeros-de-este-gobierno-y-el-fa--20223316150
- accion_sugerida: Sumarlo a `dato_real.valor` con esa cita (El Observador ya está en `evidencia.fuentes`).
  Agregar también, del mismo CED y ya en el registro pero sin destacar, que el fenómeno **precede** al quinquenio
  acusado: 2010-2014 dio USD 1.181 millones de sobreprecio en gasoil contra USD 78 millones de subsidio en nafta.

#### E) La serie de URSEA no alcanza para cerrar el chequeo, y falta nombrar la que falta
- severidad: corregir
- tipo: contexto_omitido
- objecion: Esto es lo que preguntaba el encargo en el punto (b), y la respuesta tiene dos mitades. **A favor del
  dataset:** sí es el dato oficial correcto y sí cubre el período, con una precisión que el registro no aprovecha
  —para 2002-01 a 2020-09 URSEA publica un "PPI **al consumidor final**", homologable con el precio de venta al
  público, junto con "los promedios mensuales de los precios máximos de los combustibles líquidos fijados por el
  Poder Ejecutivo". O sea que la comparación precio-de-venta contra PPI que hace el CED no es un error de nivel
  (que sería el reparo obvio: comparar un precio en planta contra uno con IMESI e IVA); es la comparación que la
  propia serie oficial habilita para esos años. **En contra:** con esa serie sola no se puede reconstruir la
  cifra. El CED dice explícitamente que además usó volúmenes: "estimaciones propias basadas en datos de ventas de
  combustibles (en litros) y series históricas de precios de venta al público y de PPI". Un diferencial por litro
  no da millones de dólares sin los litros, y los litros no están en el dataset citado.
- cita_de_contexto: "El primer modelo es el PPI al consumidor final y corresponde al período 2002-01 - 2020-09." y
  "Datos descriptivos de las series mensuales 01/2002-09/2020 con los Precios de Paridad de Importación (PPI) […]
  y los promedios mensuales de los precios máximos de los combustibles líquidos fijados por el Poder Ejecutivo." —
  https://catalogodatos.gub.uy/dataset/ursea-ppi_vs_pe_v2
- accion_sugerida: Decir en `dato_real.valor` qué falta exactamente para cerrarlo: **la serie oficial de ventas
  mensuales de nafta y gasoil en litros**, que publican ANCAP y la Dirección Nacional de Energía del MIEM (buscar
  en `catalogodatos.gub.uy` los datasets de ventas de combustibles / DNE, y el Balance Energético Nacional). Con
  PPI + PVP + litros el número se reproduce y el chequeo puede dejar de depender de un think tank. Mantener el
  `_faltante: dato_oficial` hasta entonces. Vale para el resolvedor, no para este lote.

#### F) El CED como "medio", y el PDF alojado en un espejo
- severidad: aviso
- tipo: sin_objecion (información para el editor)
- objecion: `medio: ced` con `tipo: nota` para un think tank fuerza el esquema: no es prensa ni organismo. Y el
  PDF que citamos está en `todoelcampo.com.uy` (portal agropecuario), no en un dominio del CED, así que la cadena
  depende de que un tercero conserve el archivo. El investigador lo señaló bien en `notas.md`.
- accion_sugerida: Decisión del editor sobre el slug. Sobre el espejo: buscar el PDF en el sitio del CED y, si
  aparece, citarlo desde ahí con el espejo como `archived_url` o como fuente secundaria. Nota de simetría para
  cuando se cree el medio: `bcu`, `ursea` y `catalogodatos-gub-uy` son todos `grupo: estado-uruguayo`, así que
  tres slugs distintos siguen siendo **un** grupo si algún día un registro necesitara dos.

#### G) Verificabilidad del Veracímetro
- severidad: aviso
- tipo: sin_objecion
- objecion: Con `_faltante: dato_oficial`, la regla es explícita: "Una nota de prensa sola alcanza solo para
  `discutible`". No existe hoy documento oficial que afirme el monto; lo que hay es una serie oficial y una
  estimación privada construida sobre ella con un insumo (volúmenes) que no citamos.
- accion_sugerida: `discutible` es el techo honesto mientras siga el `_faltante`. Los organismos y datasets que lo
  cambiarían, nombrados y no buscados por mí: URSEA (dataset `ursea-ppi_vs_pe_v2` y los informes mensuales de PPI
  en `ursea.gub.uy`), ANCAP y la Dirección Nacional de Energía del MIEM (ventas mensuales en litros), y la versión
  taquigráfica de la comisión parlamentaria donde MIEM o ANCAP hayan presentado la cifra, si existe.

---

### chequeos[1] — "por primera vez los combustibles eran más baratos que en Brasil"

A favor primero: **la aritmética está bien y la reproduje entera.** 74,88/41,478 = 1,8053 USD/L; 53,99/41,478 =
1,3017; 7,210/4,77820 = 1,5089; 6,674/4,77820 = 1,3968. Los cuatro números del registro son correctos. Además el
CED, en su boletín del 3 de marzo, da la nafta uruguaya en "1,8 dólares por litro", lo que implica un tipo de
cambio de 41,60 — a 0,3 % del que usó el investigador. La conversión no está haciendo trampa en ningún lado.

#### A) El País como fuente de evidencia de una afirmación sobre Brasil, en una nota que no dice "Brasil"
- severidad: bloquea
- tipo: un_solo_grupo
- objecion: Mismo problema que en chequeos[0], y acá es más flagrante: la nota de El País no contiene la palabra
  "Brasil" ni una sola vez, y la cita que se le asigna en este chequeo es la de la frase sobre transparencia, que
  no tiene nada que ver con lo chequeado.
- cita_de_contexto: búsqueda de "Brasil" sobre la nota completa de El País en el corpus: 0 ocurrencias;
  `pnpm fuente … --buscar "…| Brasil |…"` devuelve "[Brasil] sin coincidencias en esta nota." —
  https://www.elpais.com.uy/informacion/politica/lacalle-dijo-que-el-referendum-es-una-etapa-superada-y-la-luc-queda-firme
- accion_sugerida: Sacarla. Quedan el audio (704–713 s) y Subrayado.

#### B) La afirmación chequeada no es la del audio
- severidad: bloquea
- tipo: cita_fuera_de_contexto
- objecion: `afirmacion` dice "En marzo de 2022, por primera vez, los combustibles eran más baratos en Uruguay que
  en Brasil". El audio dice "hoy por primera vez **creo que del 2001 2002** tenemos combustibles más baratos que
  Brasil". Se perdieron la reserva del hablante y el horizonte temporal, y se agregó el artículo definido. Es una
  cadena de tres pasos: el audio hedgeado → Subrayado lo publica sin el hedge → nuestro `resumen` copia a
  Subrayado y le agrega "los" → el `afirmacion` del chequeo repite el resumen. El Veracímetro terminaría
  calificando una frase más categórica que la que dijo, construida en parte por nosotros. Es la objeción más
  seria del lote en términos de justicia con el chequeado, y aplicaría igual si el chequeado fuera cualquier otro.
- cita_de_contexto: "tan es así que hoy por primera vez creo que del 2001 2002 tenemos combustibles más baratos
  que Brasil" — audio, 704,4 s – 713,0 s
- accion_sugerida: Reescribir `afirmacion` siguiendo la primaria: *"En marzo de 2022 Uruguay tenía combustibles
  más baratos que Brasil, por primera vez desde 2001 o 2002 según creía el propio Lacalle Pou."* Corregir el
  `fragmento` junto con el `resumen` (ver declaraciones[0] C). Y calificar la afirmación con la reserva incluida:
  "creo que" es parte de lo dicho, no un adorno.

#### C) El par de gasoil decide el resultado, y el registro no declara la regla de emparejamiento
- severidad: bloquea
- tipo: contexto_omitido
- objecion: Es el agujero grande del chequeo, y responde al punto (c) del encargo. El registro compara Gas Oil 50S
  (Uruguay) contra Óleo Diesel B S10 (Brasil) y concluye que Uruguay estaba 6,8 % más barato. Pero **50S y S10 no
  son el mismo producto**: 50S son 50 ppm de azufre y S10 son 10 ppm. El equivalente por especificación es el Gas
  Oil 10S uruguayo, que el mismo artículo 2 del mismo Decreto 64/022 fija en $ 67,30 por litro = **1,6225 USD/L**,
  contra 1,3968 USD/L del S10 brasileño: Uruguay **16,2 % más caro**. La cita del registro reproduce la lista de
  precios del artículo 2 y se corta en "Gas Oil 50S 53,99", una línea antes de "Gas Oil 10S 67,30". No afirmo nada
  sobre por qué se cortó ahí; señalo que el número que da vuelta la conclusión está en el documento ya citado y
  no aparece en el registro. Además el Síntese de la ANP de esa semana **sólo** trae S10 (verifiqué: cero
  ocurrencias de "S500" en las 25.392 caracteres del PDF), así que el emparejamiento por especificación no es una
  posibilidad teórica: es la única lectura disponible del lado brasileño si uno quiere comparar el mismo producto.
- cita_de_contexto: "Gasolina Super 95 30S 74,88 Queroseno 49,07 Gas Oil 50S 53,99 Gas Oil 10S 67,30" —
  https://impo.com.uy/bases/decretos-originales/64-2022 (artículo 2, PVP)
- accion_sugerida: El registro tiene que **declarar la regla de emparejamiento y dar los dos resultados**. Los dos
  criterios son defendibles y dan signos opuestos: por posición de mercado (el grado masivo de cada país) Uruguay
  sale 6,8 % más barato; por especificación de azufre (10 ppm contra 10 ppm) Uruguay sale 16,2 % más caro. Ningún
  documento oficial resuelve cuál corresponde. Eso, más el resultado ya mixto de nafta contra gasoil, es lo que
  hace que **la única calificación honesta sea `discutible`**, y por dos motivos independientes, no por uno.

#### D) Contexto omitido: qué había tres semanas antes, y de qué lado vino el cambio
- severidad: corregir
- tipo: contexto_omitido
- objecion: El registro dice, correctamente, que no encontró serie histórica pareada. Pero tiene en la mano —en el
  mismo PDF del CED que ya cita— una medición de los dos combustibles contra Brasil fechada 24 días antes de la
  declaración, y no la usa. El 3 de marzo de 2022 el CED daba la nafta uruguaya **38 % más cara** que la brasileña
  y el gasoil uruguayo **17 % más caro**. Y el propio PDF de la ANP muestra que el diesel S10 brasileño subió
  **18,10 % en las cuatro semanas** hasta el 26 de marzo (la gasolina, 9,91 %). La cuenta cierra sola: una
  desventaja uruguaya de 17 % dividida por 1,181 da 0,99, es decir paridad, y lo observado es 0,93. El cruce de
  marzo de 2022 se explica íntegramente por lo que pasó del lado brasileño en esas cuatro semanas, no por una
  baja uruguaya, y databa de días antes de la conferencia. Eso es exactamente el contexto que el lector necesita
  para leer "por primera vez".
- cita_de_contexto: "Con los sucesivos incrementos, la nafta en Uruguay se consolidó como la más cara de la región
  con un valor de 1,8 dólares por litro. En este sentido, la nafta uruguaya es 30% más cara que en Chile, 38% más
  costosa que en Brasil, 47% más que en Paraguay y 80% superior al precio final vigente en Argentina. […] el gas
  oil uruguayo es 17% más caro que en Chile y Brasil, 35% superior que en Paraguay y 41% mayor que en Argentina."
  — CED, boletín N°27, 2022-03-03; y "Média nacional 6,674 -1,14% 18,10% 53,89%" — ANP, Síntese n.º 12/2022.
- accion_sugerida: Meterlo en `dato_real.valor` con las dos citas (las dos fuentes ya están en el lote). Es
  contexto que corta en las dos direcciones y por eso hay que ponerlo: debilita el "por primera vez" como logro
  de gestión y a la vez confirma que en esa semana concreta el gasoil uruguayo efectivamente estaba más barato.

#### E) Dispersión regional brasileña: no cambia el signo, y conviene decirlo
- severidad: aviso
- tipo: sin_objecion
- objecion: Uruguay tiene precio único regulado; Brasil tiene precios libres con dispersión regional grande, y el
  número de la ANP es un promedio nacional. La comparación relevante para un uruguayo es la frontera. Lo calculé:
  con los precios de la región Sul la conclusión no cambia de signo en ninguno de los dos combustibles —nafta
  7,047 → 1,4748 USD/L (Uruguay 22,4 % más caro) y diesel S10 6,545 → 1,3698 USD/L (Uruguay 5,0 % más barato con
  50S)—. Es un punto **a favor** de la robustez del registro y no está escrito.
- cita_de_contexto: "Sul 7,047 -1,08% 9,90% 28,34%" y "Sul 6,545 -1,25% 19,26% 57,71%" —
  https://www.gov.br/anp/pt-br/assuntos/precos-e-defesa-da-concorrencia/precos/arq-sintese-semanal/2022/marco/sintese-precos-n12.pdf
- accion_sugerida: Una línea en `dato_real.valor` diciendo que se usó el promedio nacional y que con la región
  Sul (frontera) el signo se mantiene.

#### F) Las dos URLs de tipo de cambio no reproducen el dato al abrirlas
- severidad: corregir
- tipo: riesgo_legal (verificabilidad)
- objecion: La fuente del BCU es el endpoint SOAP `cotizaciones.bcu.gub.uy/wscotizaciones/servlet/awsbcucotizaciones`,
  que sólo responde a un POST con cuerpo XML; abierto en un navegador no devuelve la cotización. La del BCB es
  `…/odata/CotacaoDolarDia` sin el parámetro `@dataCotacao`, que está sólo en la prosa de la cita. Un lector que
  siga los enlaces no puede reproducir ninguno de los dos números. No es que estén mal —los verifiqué contra el
  precio del CED, que implica el mismo tipo de cambio—; es que el registro no cumple su propia promesa de ser
  verificable.
- cita_de_contexto: cita del registro: "{\"cotacaoCompra\":4.77760,\"cotacaoVenda\":4.77820,…} (respuesta de la
  API oficial CotacaoDolarDia para @dataCotacao='03-25-2022')" — `chequeos.yaml#1`,
  `dato_real.fuentes[3]`
- accion_sugerida: Para el BCB hay URL GET directa y clickeable:
  `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao='03-25-2022'&$format=json`.
  Para el BCU no hay equivalente GET; lo honesto es dejar la URL del webservice, poner el cuerpo SOAP exacto en
  `dato_real.valor` (el investigador ya lo dejó en `notas.md`) y mantener `verificacion: manual`. Nota aparte, de
  método: se usó el "DLS. USA BILLETE" del BCU contra la PTAX interbancaria del BCB, que son conceptos distintos.
  La diferencia en Uruguay es de décimas y no mueve nada acá, pero la versión simétrica es interbancario contra
  interbancario y conviene decir cuál se usó y por qué.

#### G) Compuerta humana
- severidad: aviso
- tipo: sin_objecion
- objecion: Este chequeo tiene dos fuentes con `verificacion: manual` (BCU y BCB). Según `CLAUDE.md`, las fuentes
  no verificables mecánicamente requieren aprobación del mantenedor para llegar a `publicado`. No apruebo ni
  toco `data/aprobaciones.json`; queda listado en el informe.
- accion_sugerida: Correr `pnpm aprobar --pendientes` después de promover y pasarle el comando al mantenedor.

#### H) "Por primera vez" sí se puede chequear, y falta nombrar con qué
- severidad: corregir
- tipo: contexto_omitido
- objecion: `dato_real.valor` dice que "no se encontró una serie histórica oficial pareada Uruguay-Brasil". Es
  cierto que nadie publica la serie **pareada**, pero las dos patas existen como datos públicos oficiales y el
  pareo es aritmética. Dejarlo como "no se encontró" sugiere que la afirmación es inverificable, y no lo es: es
  trabajo no hecho. Buscando por el lado brasileño encontré que la ANP publica la *Série Histórica de Preços de
  Combustíveis* con relevamiento semanal desde julio de 2001 en CSV —justo el horizonte que él invoca— en
  `gov.br/anp` (centrales de contenido / datos abiertos) y en `dados.gov.br`.
- cita_de_contexto: no abrí esos datasets con `pnpm fuente`, así que **no los cito como fuente**: los nombro como
  camino de resolución, que es lo que me toca.
- accion_sugerida: Para el resolvedor, y con esto la afirmación queda cerrable: (1) ANP, Série Histórica de Preços
  de Combustíveis, semanal desde 2001-07, gasolina C comum y óleo diesel; (2) del lado uruguayo, el dataset de
  URSEA ya citado trae "los promedios mensuales de los precios máximos […] fijados por el Poder Ejecutivo" de
  2002-01 a 2020-09, y de 2020-10 a 2022-03 se completa con los decretos de IMPO; (3) BCU y BCB, series diarias
  completas. El resultado sería una `inferencia` con `cadena`, no un `documento_oficial` que afirme la conclusión,
  y hay que presentarlo así.

#### I) Comparabilidad de la nafta: el reparo está bien puesto y no cambia el resultado
- severidad: aviso
- tipo: sin_objecion
- objecion: El registro advierte que Súper 95 y gasolina C comum no son el mismo producto (octanaje y mezcla de
  etanol distintos). Es correcto y conviene decir cuánto pesa: la gasolina C brasileña es E27 y tiene menor
  contenido energético por litro, de modo que ajustar por energía **acerca** los precios, pero del orden de un
  puñado de puntos porcentuales frente a una brecha de 19,6 % (o 22,4 % contra la región Sul). La conclusión de
  que la nafta uruguaya era más cara es robusta a ese ajuste, y además coincide con lo que el CED midió por su
  cuenta tres semanas antes (38 %). Eso hay que decirlo, porque es la mitad del chequeo que **sí** está firme.
- accion_sugerida: Dejarlo escrito en `dato_real.valor` como está, agregando que el ajuste por contenido
  energético no alcanza para revertir el signo.

#### J) Qué calificación es honesta (respuesta directa al punto (c) del encargo)
- severidad: aviso
- tipo: sin_objecion
- objecion: La pregunta era qué hacer con una afirmación cierta para un combustible y falsa para el otro. Mi
  lectura, y el criterio que propongo que se aplique igual a cualquier político: **`discutible`**, con el análisis
  diciendo las dos mitades con sus números. Contra `falso`: él dijo "combustibles", sin artículo, lo que admite
  lectura existencial; y bajo un emparejamiento defendible el gasoil efectivamente estaba más barato. Contra
  `verdadero`: la nafta estaba entre 19,6 % y 22,4 % más cara bajo cualquier emparejamiento y cualquier tipo de
  cambio de los probados; el gasoil da vuelta el signo si se empareja por especificación de azufre; y el "por
  primera vez" queda sin verificar. Además `verdadero` y `falso` exigen documento oficial que sostenga la
  conclusión, y acá el documento oficial da los **insumos**, no la conclusión: la conclusión es una cuenta
  nuestra. Ese solo hecho ya empuja a `discutible` por regla, antes que por criterio.
- accion_sugerida: `discutible`, y que el `analisis` publique la tabla de las cuatro combinaciones (50S y 10S,
  promedio nacional y región Sul) para que el lector vea de qué depende el resultado en vez de tener que
  confiar en nosotros.

---

## Objeciones al lote

**1. Simetría del Veracímetro. Es la objeción más importante del lote y no es culpa del lote.**
`content/chequeos/` tiene hoy **un solo registro**, y es de Lacalle Pou. Este lote agrega dos, también de Lacalle
Pou. Si sale así, el Veracímetro del sitio es 3 de 3 sobre un presidente. Revisé las declaraciones publicadas
buscando dato numérico en `cita` o `resumen` —que es el criterio que este brief aplicó— y hay **siete
candidatas**, repartidas:

| político | registro | dato dentro de la cita/resumen | chequeado |
|---|---|---|---|
| lacalle-pou | `2022-03-27-mecanismo-transparencia-no-paga-sobrecosto` | USD 1.700 millones; Brasil | este lote (2) |
| lacalle-pou | `2021-07-28-tercamente-no-vamos-poner-impuestos` | US$ 600 | no |
| lacalle-pou | `2023-03-02-baja-impuestos-irpf-iass` | 75 %; US$ 150 | no |
| orsi | `2025-04-25-orsi-informo-ancap-volvio-tener-resultados` | 41, 118 y 160 millones | no |
| orsi | `2024-11-18-orsi-sostuvo-recargo-iva-2-aplicado` | 2 % | no |
| orsi | `2026-05-26-consultado-prensa-sobre-descuento-usd-25` | USD 25.000 | no |
| orsi | `2026-08-25-respaldo-publicamente-ministra-defensa-nacional-sandra` | 100 % | no |

La versión simétrica es concreta y barata: pasar el mismo criterio ("si hay un dato chequeable dentro de una cita
publicada, se chequea") por las otras seis antes de que el Veracímetro se estrene, o al menos por las cuatro de
Orsi. La de ANCAP (`2025-04-25`) es del mismo tema y se chequea contra los mismos organismos (ANCAP, AIN,
`catalogodatos.gub.uy`), así que ni siquiera exige aprender fuentes nuevas. Que cada registro de este lote sea
justo no arregla que la colección entera apunte a una sola persona.

**2. Dependencia de grupo.** Para la declaración no hay problema: con el audio el nivel es `textual` y no aplica
la regla de dos grupos; y si se cayera a `reportado`, Subrayado (`fontaina-de-feo`) y El País (`scheck-aguirre`)
son grupos distintos con alineamientos distintos. **El problema real es el opuesto y ya está marcado como
`bloquea`:** en los dos chequeos hay una fuente que aporta grupo sin aportar testimonio. Sobre el lote en
conjunto: las dos únicas notas de prensa son de Montevideo, ninguna de un medio `progresista` ni `independiente`
cubrió este pasaje en el lote, y el cálculo que sostiene la cifra de sobrecostos viene de un think tank cuyo
director aparece en la misma nota de El Observador discutiendo con los asesores del Frente Amplio. Nada de eso
invalida el registro; sí obliga a que el análisis del chequeo 0 diga que la cifra es de parte interesada en un
debate público y no un dato neutro.

**3. Cobertura del período.** El lote es una vuelta sobre un hecho puntual, no una corrida del tema, y así lo pide
el brief. No hay asimetría temporal que reprochar acá.

**4. Riesgo legal.** No lo veo. No hay denuncias, no hay imputaciones, no hay trascendidos anónimos. Los dos
chequeos evalúan afirmaciones públicas sobre política de precios, con documentos públicos, y la única persona
nombrada es quien las hizo en conferencia de prensa. Lo único que roza el art. 336 CP es el punto de siempre:
afirmar más de lo que la fuente respalda, que es precisamente lo que corrigen las objeciones B y C del chequeo 1.
La atribución de "USD 1.700 millones de sobrecostos" a administraciones anteriores no es afirmación nuestra sino
cita de él, y el registro lo deja claro; con el "factor X" incorporado (chequeo 0, D) queda mejor todavía.

**5. Un hallazgo propio, en `discrepancias.yaml` del lote.** Un registro: Subrayado, `cita_alterada`, por publicar
entre comillas «Hoy por primera vez tenemos combustibles más baratos que Brasil» cuando el audio oficial trae
"creo que del 2001 2002" entre "por primera vez" y "tenemos combustibles", sin marca de recorte. Se registra
contra fuente primaria (el audio de Presidencia, `tipo: video`), sin verbos de intención. **Sobre el umbral, que
es lo que hay que poder auditar:** apliqué el mismo test a las dos notas; El País pasó (su única frase
entrecomillada calza palabra por palabra) y por eso no aparece, y dejé escritos en el encabezado del archivo los
tres casos que **descarté** —incluidas dos diferencias de Subrayado que no llegan al umbral— para que se vea dónde
puse la raya. Vale la pena notar que la diferencia registrada opera **en contra** del chequeado: la versión de
Subrayado es la más categórica y por lo tanto la más fácil de calificar como falsa. Registrarla no es castigar al
medio que lo trata mal; es corregir la versión que lo trata peor.

---

## Objeciones al brief

**No hay violación de Regla 0 en el texto del brief.** Lo invoca explícitamente, encuadra el criterio como
universal ("buscar el original y chequear los datos no es un favor ni un castigo para nadie") y pide en `§3.B`
registrar el dato real "en las dos direcciones", incluyendo la instrucción de decir que el monto no existe como
dato oficial si no existe. Eso es lo correcto y el investigador lo cumplió.

Dos objeciones de método, ninguna de sesgo:

**a) El brief fija los `fragmento` desde el `resumen` antes de saber qué dice la primaria.** `§3.B` copia
textualmente los dos fragmentos a chequear de un `resumen` que se había escrito a partir de la prensa. Cuando el
mismo brief manda a buscar el registro primario, está creando la posibilidad —que efectivamente ocurrió— de que
la primaria diga algo distinto de lo que el fragmento fijó. El resultado es un chequeo apuntado a la versión
periodística de la frase. La versión simétrica es una regla de precedencia: **si en la misma corrida aparece la
primaria, la `afirmacion` se escribe contra la primaria y el `fragmento` se ajusta con el `resumen`, no al
revés.** Como el validador exige que el fragmento esté literal en cita o resumen, esto obliga a tocar los dos en
el mismo movimiento; conviene que el brief lo diga.

**b) El brief limita el lote a este registro y a estos dos chequeos.** Es una decisión de alcance legítima, y no
es asimétrica en su formulación. Pero sumada al estado de `content/chequeos/` (un registro, mismo político)
produce un resultado que sí lo parece. La corrección no es ampliar este lote: es que el mismo criterio salga en la
misma tanda sobre las otras seis declaraciones con dato numérico, listadas arriba. Lo dejo como objeción al brief
y no sólo al lote porque es una decisión de encargo, no del investigador.

---

## Cobertura

**Tres notas de prensa leídas en el lote, tres registros de tono.** No genero registros para el audio ni para la
gacetilla de `presidencia`, ni para el Decreto 64/022 (`impo`), el dataset de URSEA (`catalogodatos`) o la Síntese
de la ANP: son documentos oficiales, no notas de prensa. Sigo el precedente de la crítica del 2026-09-05, que
excluyó por lo mismo las páginas de gub.uy. Tampoco genero uno para el boletín del CED: es un think tank, no
prensa, y no está en `content/medios/`. Si el editor decide crear el slug `ced`, hay que decidir a la vez si su
producción entra o no en la medición de tono; mi posición es que no, porque el índice mide medios.

```yaml
- medio: subrayado
  url: https://www.subrayado.com.uy/una-etapa-superada-una-ley-que-queda-firme-dijo-lacalle-pou-referendum-la-luc-n852859
  fecha: 2022-03-27
  evento: referendum-luc
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Crónica de la conferencia sin evaluación propia: encadena lo que dijo con verbos de atribución
    ("sostuvo", "señaló", "explicó") y no agrega juicio ni contraste, incluso en el pasaje donde
    reproduce cifras suyas sin verificar ("dijo que se pagaron más de USD 1.700 millones de
    sobrecostos en el quinquenio anterior"). Reproducir una cifra sin chequearla no es tono
    favorable; es crónica. La cita alterada que sí registré en `discrepancias.yaml` tampoco mueve el
    tono: recorta a favor de la contundencia de la frase, no a favor ni en contra del político.

- medio: el-pais
  url: https://www.elpais.com.uy/informacion/politica/lacalle-dijo-que-el-referendum-es-una-etapa-superada-y-la-luc-queda-firme
  fecha: 2022-03-27
  evento: referendum-luc
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Cobertura de la misma conferencia, también sin voz evaluativa propia: "Consultado sobre si se
    considera la posibilidad de modificar el método de fijación de precios de los combustibles, dijo
    que no se va a cambiar porque es 'la forma que votó el Parlamento por unanimidad'". Omite el
    tramo de la respuesta con las dos cifras y comprime la premisa de la pregunta (la promesa de
    campaña incumplida), pero omitir no es evaluar y la nota tampoco introduce adjetivación en
    ninguna dirección.

- medio: el-observador
  url: https://www.elobservador.com.uy/nota/el-precio-de-la-nafta-y-el-gasoil-que-muestran-los-numeros-de-este-gobierno-y-el-fa--20223316150
  fecha: 2022-03-07
  evento: mecanismo-precios-combustibles-luc
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Nota de contraste que somete a examen los argumentos de los dos lados con la misma vara y en voz
    propia: cuestiona el método de los asesores del Frente Amplio ("si solo se toma los dos extremos
    de un período y se calcula un promedio, se pasa por alto qué ocurrió entre medio") y también
    señala lo que el gobierno actual reconoció y no resolvió ("el gobierno reconoció un sobreprecio
    de hasta $ 2,97 por litro (llamado factor x) […] En la hoja de ruta del gobierno, el objetivo era
    que ese sobreprecio se suprimiera en un plazo de tres años"). Atribuye las cifras al CED
    ("según las estimaciones del CED") en vez de asumirlas. Ninguna frase evaluativa cae de un solo
    lado, así que neutral.
```

**Lectura del cuadro: 0 favorable, 3 neutral, 0 desfavorable.** No es un dato sobre la prensa uruguaya sino sobre
el muestreo: tres notas, dos de ellas crónicas de la misma conferencia elegidas justamente por citar la frase que
el registro documenta. Con n = 3 y ese criterio de selección, cualquier otra distribución sería sospechosa. Sobre
grupos: `fontaina-de-feo`, `scheck-aguirre` y `werthein-hochbaum`, tres distintos; sobre alineamientos, uno
`oficialista_tradicional` y dos `sin_datos`, ninguno `progresista` ni `independiente`.

Ningún evento propuesto: los dos que uso (`referendum-luc`, `mecanismo-precios-combustibles-luc`) ya existen en
`content/eventos/`.

---

## Recuento

- **bloquea: 4** — El País como evidencia falsa en chequeos[0] (A) y chequeos[1] (A); afirmación no
  correspondiente a la primaria en chequeos[1] (B); par de gasoil sin regla declarada en chequeos[1] (C).
- **corregir: 12** — declaraciones[0] A, B, C, D, E; chequeos[0] B, C, D, E; chequeos[1] D, F, H.
- **aviso: 8** — declaraciones[0] F, G; chequeos[0] F, G; chequeos[1] E, G, I, J.
- **discrepancias registradas: 1** (`inbox/lacalle-pou/economia/combustibles/2026-09-06/discrepancias.yaml`).
- **registros `cobertura`: 3.**
- **sin objeción, explícitamente:** la cadena de identificación de la primaria (gacetilla → carpeta AJ_170 → mp3 →
  `Last-Modified` compatible con la noche del hecho); la contigüidad literal de `pregunta`, `contexto` y `cita` de
  la primaria contra la transcripción; las marcas de tiempo 657 (El País), 644 (Subrayado) y 704 (chequeo 1); y
  toda la aritmética de conversión a dólares del chequeo 1, que reproduje número por número.
- **una marca de tiempo desalineada, sin consecuencia:** `chequeos[0]`, `evidencia.fuentes[0].marca_tiempo: 670`
  apunta al final de la pregunta retórica; la cita empieza en 666,3. Ajustar a 666 si se toca el archivo.
