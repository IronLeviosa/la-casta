# Crítica — corridas 2026-09-08-barandiaran-ficha y 2026-09-08-barandiaran-trayectoria

Modelo: Opus 5 (1M de contexto), `claude-opus-5[1m]`. Corro en Opus porque la regla 14 de `CLAUDE.md` reserva Opus para el crítico; el resto de los roles de estas dos corridas corrió en Sonnet, como declara `_investigacion.modelo` en los dos lotes.
Lotes: `inbox/barandiaran/ficha/2026-09-08/` y `inbox/barandiaran/trayectoria/2026-09-08/`
Registros revisados: 2 con contenido (`politicos[0]`, `declaraciones[0]` del lote de ficha) + 4 colecciones vacías (lote de trayectoria)

Nota de método: releí con `pnpm fuente` las cinco fuentes citadas en los registros, más siete documentos que ninguno de los dos investigadores abrió (Wikipedia de Iván Posada, ficha-asunto 11649 en su vista base, la página de Diarios de Sesión del Parlamento, IMPO Ley 17.189, FACTUM 2001, el PDF de Asamblea General del corpus y la Enciclopedia Electoral del Parlamento). No agregué registros: lo que encontré va como `accion_sugerida` con su URL.

---

## Lote 1 — `inbox/barandiaran/ficha/2026-09-08/`

### politicos[0] — barandiaran — identidad y partido
- severidad: aviso
- tipo: sin_objecion
- objecion: Ninguna sobre la identidad. Verifiqué yo mismo la ficha individual del documento oficial y dice exactamente lo que el registro afirma, en una entrada propia y separada de sus vecinas alfabéticas (BARAÑANO Gregorio antes, BARBADORA Alejandro después), lo que descarta la desalineación de columnas que el investigador temió con «BARAIBAR Gabriel / Rivera». No hay homónimo compitiendo: en el mismo documento, que cubre 1830-2005, «Barandiaran» aparece una sola vez como parlamentario. Barandiarán está además en el anexo de Wikipedia de la XLIV Legislatura entre los diputados de Montevideo por Nuevo Espacio, Lista 99000, junto a Gabriel Courtoisie (Montevideo) y Ricardo Falero (Canelones) de la misma lista.
- cita_de_contexto: «BARANDIARAN Gabriel / Representó al Partido Nuevo Espacio / Legislatura Cámara Calidad Departamento / 44 Diputados Titular Montevideo / 45 Diputados Suplente Montevideo / 44 Del 15 de febrero de 1995 al 14 de febrero de 2000 / 45 Del 6 de noviembre de 2000 al 12 de noviembre de 2000 / Del 9 de octubre de 2002 al 20 de octubre de 2002 / Del 16 de marzo de 2004 al 21 de marzo de 2004 [376] Del 19 de abril de 2004 al 24 de abril de 2004 / Suplencias menores a cinco días en la Legislatura: 79 días» — https://parlamento.gub.uy/sites/default/files/documentos-generales/parlamentariosuruguayos_.pdf (carácter ~533756)
- accion_sugerida: Ninguna sobre identidad. Aviso mecánico: la `cita` de `mandatos[0]` y las de `mandatos[3]`, `mandatos[4]` y `estado_actual.salida` cruzan el salto de página y saltean el número de página «376» que está intercalado en el texto extraído. `buscarCita` no las va a dar por exactas y va a caer en la comparación por Levenshtein (similitud ≈ 0,99, pasa, pero como aproximada). Conviene recortar cada cita a un tramo que no cruce la página.

### politicos[0].partido — «Partido Nuevo Espacio»
- severidad: corregir
- tipo: presentacion
- objecion: El nombre canónico en `data/alias.yaml` es **`Nuevo Espacio`** (sigla `NE`, alias `nuevoespacista`, `Lista 99000`), no «Partido Nuevo Espacio». `src/lib/partidos.ts` solo indexa `nombre` y `sigla`, así que `colorDePartido('Partido Nuevo Espacio')` devuelve `COLOR_SIN_PARTIDO` (`#57544c`, el gris de reserva): la línea de mandatos de `LineaMandato.astro` y la banda de `BandaMandato.astro` van a pintar a esta persona en gris «partido desconocido» mientras el resto del sitio pinta a cada uno con su color. Ya se ve: `pnpm validar --inbox inbox/barandiaran/ficha/2026-09-08` imprime una fila «Partido Nuevo Espacio» separada de las diez que ya existen. Y `notas.md > partido_faltante` afirma que «Nuevo Espacio / Partido Nuevo Espacio no figura en `data/alias.yaml`»: es falso desde el commit e1333b5, y si el editor le hace caso va a crear una entrada duplicada.
- cita_de_contexto: «- nombre: Nuevo Espacio / color: '#0e7c7b' / sigla: NE / alias: [Nuevo Espacio, NE, nuevoespacista, nuevoespacistas, Lista 99000]» — `data/alias.yaml`, líneas 117-130
- accion_sugerida: `partido: Nuevo Espacio`. Borrar la sección `partido_faltante` de `notas.md` o corregirla; no crear ninguna entrada nueva en `data/alias.yaml`.

### politicos[0].mandatos — los 79 días que no están
- severidad: corregir
- tipo: documento_previsible
- objecion: El mismo documento que da las cuatro suplencias fechadas cierra con «Suplencias menores a cinco días en la Legislatura: 79 días», y esos 79 días no están en ningún mandato. Las cuatro suplencias registradas suman 31 días (7 + 12 + 6 + 6). Es decir: la ficha muestra el 28 % del tiempo que ejerció en la XLV Legislatura y omite el 72 %. Y no es un límite de la fuente: el propio corpus ya tiene un día de ese bolsón documentado. El PDF `2370801.PDF`, que `pnpm corpus:buscar "Barandiarán"` devuelve como único resultado, es el Diario de la **Asamblea General del 12 de febrero de 2003** —fecha que no cae dentro de ninguna de las cuatro suplencias fechadas— y lo lista entre los presentes. O sea que los 79 días son ubicables uno por uno, y ya hay uno ubicado.
- cita_de_contexto: «ASAMBLEA GENERAL A.G. -145 12 de febrero de 2003 … TERCER PERIODO ORDINARIO DE LA XLV LEGISLATURA … y los señores Representantes Washington Abdala, Guzmán Acosta y Lara, Ernesto Agazzi, Guillermo Álvarez, Juan Justo Amaro, Gustavo Amen Vaghetti, José Amorín Batlle, Fernando Araújo, Beatriz Argimón, Roque E. Arregui, Carlos Baráibar, Gabriel Barandiaran, Raquel Barreiro» — https://infolegislativa.parlamento.gub.uy/temporales/2370801.PDF (carácter 4771)
- accion_sugerida: (a) La vía barata: el buscador de Diarios de Sesión del Parlamento (`documentosyleyes/documentos/diarios-de-sesion`, campos `Lgl_Nro=45`, `fecha_desde`, `fecha_hasta`) devuelve toda la XLV Legislatura; la sección «Integración de la Cámara» y «Licencias» de cada diario dice a quién se le concedió licencia y a qué suplente se convocó. (b) La vía corta: el módulo de asistencias de la ficha del legislador en `parlamento.gub.uy/camarasycomisiones/legisladores/2946`. (c) Mínimo aceptable si nada de eso se hace en esta corrida: decirlo con todas las letras en `cobertura.texto`, porque si no la página afirma por omisión que ejerció 31 días cuando el documento dice 110. Efecto colateral que conviene conocer: `mesesDeMandato` en `src/pages/politicos/[slug]/index.astro` cuenta por diferencia de mes calendario, así que las cuatro suplencias suman **cero meses** y la ficha va a decir 60 meses de mandato.

### politicos[0].mandatos[0] — apoyo probatorio del mandato titular
- severidad: aviso
- tipo: un_solo_grupo
- objecion: Las dos fuentes son `parlamento` (grupo `estado-uruguayo`) y `wikipedia` (grupo `wikimedia`). Son dos grupos distintos, así que la regla formal se cumple, pero `content/medios/wikipedia.yaml` dice de sí mismo, en sus notas internas, que «El validador de tiers no la acepta como fuente textual ni oficial» y que se usa «solo para datos de referencia». En los hechos el mandato descansa sobre un solo documento. Al mismo tiempo, la única fuente de prensa que confirma su filiación —LR21, 2000-09-29, «el legislador nuevoespacista»— está citada en `notas.md > objeciones_al_brief` y **no está en el registro**.
- cita_de_contexto: «El diputado Gabriel Barandiaran presentó al Parlamento un proyecto de ley para reglamentar el manejo de información sobre las personas físicas. […] La preocupación del legislador nuevoespacista radica en la extensión de la informática» — https://www.lr21.com.uy/politica/23470-proteger-el-derecho-a-la-intimidad
- accion_sugerida: **No** agregar esa nota a `mandatos[0].fuentes`. Es exactamente la trampa de la segunda fuente falsa: la nota es del 29-09-2000, no menciona ninguna fecha de mandato y no respalda «desde 1995-02-15 hasta 2000-02-14»; respalda otra cosa (que era diputado nuevoespacista y presentó un proyecto de datos personales). Pasaría la validación de red y le daría al mandato un tercer grupo con una cita que no dice lo que el registro afirma. Donde sí corresponde es (a) en `cobertura.texto`, como la prueba de prensa de la filiación, y (b) en el registro de `cobertura` (tono) que dejo en `cobertura.yaml`.

### politicos[0].candidaturas[0] — 1994-11-27 — «Encabezó la lista 99000…»
- severidad: bloquea
- tipo: cita_fuera_de_contexto
- objecion: Dos defectos, y el segundo es el grave.
  1. «Encabezó la lista 99000» no lo dice ninguna de las dos fuentes. El anexo de Wikipedia solo lo lista con Lista 99000, igual que a Courtoisie y a Falero. Y hay una fuente que apunta al revés: la Wikipedia de Iván Posada dice que **Posada** «Resulta elegido diputado titular por la Lista 99.000 en los comicios de 1994».
  2. La segunda fuente del registro es la Wikipedia de Nuevo Espacio con la cita «ya se insinuaban corrientes internas: una agrupación liderada por Iván Posada y Gabriel Barandiarán presentó una lista propia». Esa frase está **dentro del párrafo de las elecciones de 1999**, no de las de 1994. El registro toma una cita sobre un hecho de 1999 y la usa para sostener un `detalle` de 1994, y de ahí sale la frase «junto a Iván Posada, con quien lideraba una corriente interna del partido» pegada al año equivocado. Es precisamente lo que la regla dura 2 del brief advertía.
  Además, la `fecha: 1994-11-27` no aparece en ninguna de las dos citas; sale de una búsqueda web sobre la fecha de la elección, no de una fuente leída sobre esta persona.
- cita_de_contexto: «En las elecciones de 1999, el Nuevo Espacio vuelve a comparecer ante la ciudadanía de manera independiente, ahora en un escenario caracterizado por los candidatos únicos; prácticamente repitió la votación de 1994, pero perdiendo un diputado. Además, ya se insinuaban corrientes internas: una agrupación liderada por Iván Posada y Gabriel Barandiarán presentó una lista propia.» — https://es.wikipedia.org/wiki/Nuevo_Espacio (carácter ~2743)
- accion_sugerida: Sacar «Encabezó» y sacar la cita de 1999 de este registro. `detalle` defendible con lo que sí está leído: «Electo diputado titular por Montevideo en la lista 99000 del Nuevo Espacio; asumió el 15 de febrero de 1995». Para la fecha y los votos, el documento previsible es la Corte Electoral (ver más abajo).

### politicos[0].candidaturas[1] — 1999-10-31 — `resultado: electo`
- severidad: bloquea
- tipo: riesgo_legal
- objecion: El registro afirma tres cosas que su única fuente no dice y una que otra fuente contradice. La única fuente es el PDF del Parlamento, cuya cita dice «44 Diputados Titular Montevideo / 45 Diputados Suplente Montevideo» y nada más: no dice que fuera candidato, no da fecha de elección, no dice el orden en la lista. El registro pone `fecha: 1999-10-31`, `resultado: electo` y `detalle: Segundo en una lista nuevoespacista de Montevideo`. Y `electo` está contradicho por la Wikipedia de Iván Posada, que dice que la lista que armaron entre los dos obtuvo **un** diputado y que fue Posada. El propio documento del Parlamento lo clasifica como «Suplente» en la Legislatura 45. Publicado así, el sitio va a decir que ganó una banca en 1999 cuando el documento oficial dice que fue suplente.
- cita_de_contexto: «En 1999 se forma una agrupación autónoma dentro del Nuevo Espacio; Iván Posada, Gabriel Barandiarán y otros dirigentes forman la Lista 1999 "Tercera Vía", que se presenta en los comicios de octubre; obteniendo entonces un diputado, el propio Iván Posada.» — https://es.wikipedia.org/wiki/Iv%C3%A1n_Posada (carácter ~1910)
- accion_sugerida: O se saca la candidatura de 1999 hasta tener la hoja de votación de la Corte Electoral, o se reescribe con lo que hay: `resultado: no_electo`, `detalle: Integró la Lista 1999 "Tercera Vía" del Nuevo Espacio, formada con Iván Posada; la lista obtuvo un diputado (Posada). Barandiarán ejerció la banca como suplente entre 2000 y 2004`, y se agrega la Wikipedia de Posada como fuente con la cita de arriba. El `lema` sigue siendo `Nuevo Espacio`; «Tercera Vía» es el sublema y va en `detalle`.

### politicos[0].estado_actual.salida — `fin_de_mandato`, 2004-04-24
- severidad: corregir
- tipo: riesgo_legal
- objecion: Afirma más de lo que la fuente respalda. El documento da 2004-04-24 como fin de la **cuarta suplencia fechada**, no como fin de su actuación: en el mismo párrafo dice que hay 79 días más de suplencias sin fechar en esa misma Legislatura, cualquiera de los cuales puede ser posterior. Publicar «salida: fin de mandato, 24 de abril de 2004» le pone al lector una fecha de cierre de carrera que el documento deja abierta hasta el 14 de febrero de 2005.
- cita_de_contexto: «LEGISLATURA No. 45 - Del 15 de febrero de 2000 al 14 de febrero de 2005» — mismo PDF, encabezado de legislatura que el investigador ya leyó (`consultas.jsonl`, 16:10:00).
- accion_sugerida: `fecha: 2005-02-14` con la cita del encabezado de la Legislatura 45, o mantener 2004-04-24 y decir en `cobertura.texto` que es la última suplencia fechada y que quedan 79 días sin fechar. Lo que no se puede es dejarla sin salvedad.

### politicos[0].cobertura — falta el bloque «Qué se buscó y qué existe»
- severidad: corregir
- tipo: presentacion
- objecion: Punto 8 y punto 3 de la lista de control. Esta ficha va a producir una página con siete secciones vacías —Giros, Promesas, Chequeos, Casos, Patrimonio, Sustancia del discurso, Referentes— y una sola declaración. `src/pages/politicos/[slug]/index.astro` solo usa el texto «Se investigó el … y no se encontró …» para vetos (`vacioDe('vetos', …)`); todas las demás caen en la constante `VACIO = 'Todavía no hay registros publicados.'`. El comentario del propio archivo describe el problema: «"No hay vetos" y "nadie miró si hubo vetos" se ven iguales en una seccion vacia, y confundirlos se lee como cobertura desigual». El esquema ya tiene el lugar para arreglarlo: `cobertura: {texto, fecha}`, que la página imprime arriba bajo el título «Qué se buscó y qué existe», y el registro no lo trae.
- cita_de_contexto: «Los Diarios de Sesiones se encuentran disponibles a partir de las siguientes fechas: Cámara de Senadores a partir del 15/02/1985 - Cámara de Representantes a partir del 11/02/2000 - Comisión Permanente a partir del 15/02/1985 - Asamblea General a partir del 15/02/1985» — https://parlamento.gub.uy/documentosyleyes/documentos/diarios-de-sesion (carácter 175). Es la cita que sostiene el «qué no existe» del período 1995-2000, y ninguno de los dos lotes la tenía textual.
- accion_sugerida: Escribir `cobertura` con cinco cosas, en párrafos cortos y sin adjetivos: (1) el registro parlamentario de Diputados anterior al 11/02/2000 no está en línea, con la cita de arriba; (2) los 79 días de suplencias sin fechar; (3) los trece medios revisados y con qué resultado, diciendo cuáles se revisaron con el sitemap completo y cuáles no (ver la objeción de método del lote 2); (4) que la única nota de prensa que lo cita es la de LR21 del 29-09-2000; (5) que no hay foto con licencia libre. `fecha: 2026-09-08`. Y que `data/corridas/2026-09-08-barandiaran-ficha/agentes.json` exista, porque sin ese archivo `leerCorridas` descarta la corrida y ni siquiera la línea de vetos va a poder decir que se investigó.

### politicos[0] — datos personales
- severidad: aviso
- tipo: sin_objecion
- objecion: Nada que objetar por la ley 18.331. El registro solo trae actuación pública (cargos, fechas, lista, partido). `notas.md` deja constancia de que no encontró segundo apellido ni fecha de nacimiento y no los inventó, que es lo correcto. La única precaución hacia adelante: si aparece un padrón o una ficha cívica con documento y domicilio, nada de eso entra.

### declaraciones[0] — 2000-11-07 — «Señora Presidenta: he votado afirmativamente…»
- severidad: corregir
- tipo: cita_fuera_de_contexto
- objecion: La cita es literal y contigua —la verifiqué contra el diario— pero **se corta justo donde el orador relativiza todo lo anterior**. Después de «mediante una combinación mecánica» siguen tres párrafos suyos, y el último dice: «Estos tres puntos no pesan en el motivo fundamental: frente a una finalidad social y humana, tenemos que buscar un marco normativo que haga posible o facilite el fomento de este tipo de cosas». El registro se queda con los reparos y deja afuera la frase en que él mismo los subordina. El `titulo` («Reparos al uso científico del material humano en la ley de trasplantes») y el `resumen` («expresó preocupación porque este último no estuviera suficientemente acotado») se construyen sobre la mitad que quedó. Lectura alternativa, que hay que escribir aunque no cambie la conclusión: es un fundamento de voto **a favor**, en una votación que el mismo diario registra como «Cincuenta por la afirmativa: Afirmativa. Unanimidad», y el orador está adhiriendo a una salvedad ya planteada por otro diputado (Scavarelli); no está fijando una posición propia de oposición.
- cita_de_contexto: «Por último, entiendo que la investigación científica no ha sido suficientemente debatida en nuestro país como para tener la tranquilidad de que la medicina respetará los aspectos básicos que buena parte de los ciudadanos consideran imprescindibles. / Estos tres puntos no pesan en el motivo fundamental: frente a una finalidad social y humana, tenemos que buscar un marco normativo que haga posible o facilite el fomento de este tipo de cosas.» — https://infolegislativa.parlamento.gub.uy/temporales/8648567.PDF (carácter ~284888 y siguientes)
- accion_sugerida: Extender la `cita` hasta «…el fomento de este tipo de cosas», o dejarla donde está y poner ese párrafo final en `contexto` (el esquema de Fuente lo admite y el registro ya usa `contexto` para lo que viene antes). Y cambiar el `titulo` por uno que diga lo sustancial y el sentido del voto, del tipo «Votó a favor de la ley de trasplantes y advirtió sobre el uso científico del material humano» (punto 6 de la lista de control). El `tema: salud` es correcto: existe en `content/temas/` y el único hijo es `salud/pandemia-covid`, que no aplica.

### declaraciones[0] — cobertura del período parlamentario
- severidad: corregir
- tipo: documento_previsible
- objecion: `notas.md` da por cerrado el período titular 1995-2000 con el argumento de que el Parlamento no digitaliza Diputados antes del 11-02-2000. La primera mitad es cierta y ahora está citada. La segunda no: **la misma página dice que Asamblea General y Comisión Permanente están en línea desde el 15/02/1985**, y un diputado de la XLIV Legislatura integraba la Asamblea General. Lo verifiqué: el buscador con `Lgl_Nro=44` y fechas de 1995-1996 devuelve diarios de C.SS y de C.P. de 1996 con PDF **y HTML**. Ese camino no se probó ni una vez, y es el mismo por el que el corpus ya tiene su asistencia de 2003. La afirmación «no hay forma de acceder al registro parlamentario de su período titular» es más fuerte de lo que la evidencia permite.
- cita_de_contexto: «2ª Sesión del 30 de diciembre de 1996 - C.P. Nº 10 - TOMO 20 … PDF HTML Sumario» — resultado de https://parlamento.gub.uy/documentosyleyes/documentos/diarios-de-sesion?Lgl_Nro=44&fecha_desde=1995-02-15&fecha_hasta=1996-12-31
- accion_sugerida: Buscar «BARANDIARAN» en los diarios de Asamblea General y de Comisión Permanente de la XLIV Legislatura (1995-2000) antes de cerrar el período. Para el texto taquigráfico de Diputados anterior a 2000 hay dos rutas más que nadie probó: el catálogo en línea de la Biblioteca del Poder Legislativo (`pmb.parlamento.gub.uy/pmb/opac_css/`), que cataloga los Diarios de Sesiones en papel y microfilm, y Wayback sobre `legislativo.parlamento.gub.uy/temporales/…` (el dominio hoy no resuelve —lo confirmé, `fetch failed`— pero los snapshots pueden estar).

### Lote 1 — Corte Electoral, nunca consultada
- severidad: corregir
- tipo: documento_previsible
- objecion: El brief nombra explícitamente «la Corte Electoral (resultados por departamento y lema)» como fuente a usar, y en los 51 renglones de `consultas.jsonl` no hay una sola URL de la Corte Electoral. Los votos de 1994 y 1999 y el orden en la hoja de votación —que son justamente los dos datos que hoy están sin fuente o mal en `candidaturas`— salen de ahí.
- accion_sugerida: `https://www.gub.uy/corte-electoral/datos-y-estadisticas/estadisticas/resultados-elecciones-nacionales-balotaje-1999` y su equivalente de 1994; `https://catalogodatos.gub.uy/organization/corte-electoral` (el medio `catalogodatos-gub-uy` ya existe en `content/medios/`). El Parlamento publica además la Enciclopedia Electoral Uruguaya 1900-2010 del Instituto Factum en `https://legislativo.parlamento.gub.uy/OtrosDocumentos/EnciclopediaElectoral1900_2010.pdf`, que hoy no resuelve (lo probé) y habría que buscar en Wayback.

### Lote 1 — dos errores de hecho en `notas.md`
- severidad: corregir
- tipo: contexto_omitido
- objecion: `notas.md > proyectos_presentados` dice del asunto 11649 que Barandiarán «no es autor del proyecto» y que «Este proyecto se convirtió luego en la Ley 17.250 (no verificado con fuente propia, es contexto general conocido de la época)». Las dos cosas están contradichas por el mismo documento que el investigador dice haber leído. La vista base de la ficha-asunto lista a Barandiarán primero entre los firmantes, y la ficha completa dice que el Poder Ejecutivo promulgó la **Ley 17.189**. La segunda frase además admite haber sido escrita de memoria, que es lo que la regla 4 prohíbe; el problema es que `notas.md` es el insumo con el que el editor va a escribir `cobertura.texto`, así que el error se propaga a la página.
- cita_de_contexto: «Asunto: 11649 Origen: Cámara Representantes - Barandiarán, Gabriel; Castro Riera, Omar; Iglesias Rodríguez, Alberto Walter; Mahía, José Carlos; Obispo, Ruben; Scarpa, Roberto … Título: CONSUMIDOR. DERECHOS. REGULACION.» — https://parlamento.gub.uy/documentosyleyes/ficha-asunto/11649 ; y «20-09-1999 Poder Ejecutivo promulga. Ley Nro: 17189» — https://parlamento.gub.uy/documentosyleyes/ficha-asunto/11649/ficha_completa
- accion_sugerida: Corregir las dos frases. Y considerar lo que ese hallazgo habilita: la ley de relaciones de consumo que él cofirmó existe con texto oficial completo en IMPO (`https://www.impo.com.uy/bases/leyes/17189-1999`, promulgada 20/09/1999, «SANGUINETTI - JUAN ALBERTO MOREIRA - JULIO HERRERA»), la colección `content/leyes/` ya existe con el patrón de id `17-189`, y ese es un hecho documentado de su actuación pública que ninguno de los dos lotes registró. También quedó sin usar el dato de que intervino **dos veces** en la discusión general del 18-08-1999 (Diario 2845, páginas 114-115 y 116-117), que la ficha-asunto da con página exacta y que hace localizable el texto si aparece por la vía de la Biblioteca.

---

## Lote 2 — `inbox/barandiaran/trayectoria/2026-09-08/`

### declaraciones.yaml, promesas.yaml, menciones.yaml, chequeos.yaml — los cuatro vacíos
- severidad: aviso
- tipo: sin_objecion
- objecion: El resultado vacío es defendible y está bien documentado: 63 renglones de `consultas.jsonl`, seis medios recorridos con `pnpm descubrir`, trece con búsqueda, y una tabla que dice medio por medio cuántas notas encontró. No hay asimetría de esfuerzo entre alineamientos: buscó igual en El País y en la diaria, en Búsqueda y en La República. Que `chequeos.yaml` esté vacío también es correcto: en la única cita que existe de esta persona no hay cifra, fecha ni comparación que él afirme (el «Cincuenta por la afirmativa» es del taquígrafo, no suyo), así que no hay `afirmacion` chequeable en ninguno de los dos lotes y el punto 7 de mi rol no tiene sobre qué aplicarse. Un lote vacío bien fundado es un resultado, no una falla.

### Lote 2 — el esfuerzo no fue parejo entre medios, y el lote no lo dice al mismo volumen
- severidad: corregir
- tipo: asimetria
- objecion: La tabla de `medios_faltantes` presenta trece «0» como si valieran lo mismo, y no valen lo mismo. `pnpm descubrir` revisó 1.135.122 URLs en El País y 292.109 en la diaria, pero **205** en El Observador, **103** en Subrayado, **39** en Búsqueda y **0 sitemaps** en Montevideo Portal. Un cero sobre 39 URLs no es una búsqueda, es una muestra. El investigador lo advierte, pero solo para dos de los cuatro casos y en un párrafo al final; la tabla que el editor va a copiar dice «0 · `pnpm descubrir` + `WebSearch`» para todos. Si ese texto llega a `cobertura.texto` tal cual, la página le va a decir al lector que se revisó Búsqueda y Montevideo Portal con el mismo rigor que El País.
- accion_sugerida: En `cobertura.texto`, separar en dos grupos: los medios cuyo archivo se recorrió entero y los que solo se consultaron por buscador. Y no escribir «cobertura verificada en cero» para los segundos, sino «no se encontró; el archivo de este medio no es recorrible por sitemap».

### Lote 2 — lr21.com.uy, el único medio que sí lo cubrió, no se recorrió
- severidad: corregir
- tipo: contexto_omitido
- objecion: Los dos investigadores partieron del mismo corpus (una sola mención) y el mismo día. El del lote de ficha encontró una nota de LR21 de 2000 que cita a Barandiarán; el del lote de trayectoria, cuyo encargo era exactamente la prensa, no la encontró y anotó «La República · 0 · WebSearch únicamente». O sea que el cero de este lote no es un cero verificado: hay al menos un falso negativo comprobado. Y `lr21.com.uy` —que es el dominio histórico de La República, declarado en `content/medios/la-republica.yaml`— nunca se recorrió con `pnpm descubrir` ni con `site:`, siendo el único medio uruguayo con hemeroteca en línea de esa época que ya demostró tener material.
- cita_de_contexto: «El diputado Gabriel Barandiaran presentó al Parlamento un proyecto de ley para reglamentar el manejo de información sobre las personas físicas» — https://www.lr21.com.uy/politica/23470-proteger-el-derecho-a-la-intimidad, encontrada por el otro lote el mismo día.
- accion_sugerida: `pnpm descubrir lr21.com.uy --terminos Barandiarán,Barandiaran` y `site:lr21.com.uy Barandiaran` antes de dar por cerrada la prensa de 1995-2005. Vale lo mismo para `brecha.com.uy`, que el propio investigador marca como no probado con `descubrir`. Y para El País de esos años, la vía no es el sitemap actual sino Wayback sobre `elpais.com.uy` y `diarioelpais.com`. Búsqueda en papel efectivamente no está en la web: eso sí es correcto decirlo y punto.

### Lote 2 — `identidad_no_confirmada` como bloqueo
- severidad: aviso
- tipo: explicacion_alternativa
- objecion: El lote pide «que se resuelva antes de promover nada de este lote o del lote de ficha». Ya está resuelto, y no por Wikipedia: por la ficha individual del documento oficial del Parlamento, que este investigador no llegó a abrir (trabajó con la lista de asistencia del corpus y con los anexos de Wikipedia). El editor no tiene que frenar el lote por esto. Lo que sí conviene registrar es por qué el lote 2 llegó a una conclusión más débil que el lote 1 con el mismo material de partida: el lote 1 abrió `parlamentariosuruguayos_.pdf` y buscó la entrada alfabética; el lote 2 no.
- accion_sugerida: Cerrar la sección `identidad_no_confirmada` remitiendo a la ficha oficial, y conservar de ella solo lo que sigue siendo válido: que no aparece homónimo colorado y que Gabriel Gurméndez es otra persona.

### Lote 2 — la hipótesis del pase al Partido Independiente
- severidad: aviso
- tipo: explicacion_alternativa
- objecion: La hipótesis es razonable pero el texto que la sostendría no dice lo que parece. La Wikipedia de Iván Posada, al llegar a 2004, dice «Posada y otros dirigentes rechazan el planteo, y conforman el Partido Independiente»: **no nombra a Barandiarán**. Los buscadores lo parafrasean incluyéndolo porque la oración anterior sí lo nombra, y esa paráfrasis es la que aparece en los resultados de búsqueda. Que haya cofundado la Tercera Vía en 1999 no prueba que haya seguido a Posada en 2004; el documento del Parlamento lo sigue anotando como Nuevo Espacio en 2004, y Nuevo Espacio se integró al Frente Amplio en 2005.
- accion_sugerida: Que la hipótesis quede en `hipotesis/` con esta salvedad escrita, y que ni el registro ni `cobertura.texto` insinúen una afiliación posterior a 2004. Lo verificable sería la nómina de fundadores del Partido Independiente (acta de fundación, Corte Electoral, registro de lemas) o una lista de candidatos 2004-2024 con su nombre; nada de eso apareció.

---

## Objeciones al lote (los dos)

- **Simetría entre lotes:** no encuentro sesgo de partido en ninguno de los dos. Se registró lo que había y no había nada favorable ni desfavorable que elegir: una sola intervención, un solo proyecto reportado, ninguna cifra, ningún caso. Ambos investigadores anotaron `casos_vistos: ninguno` sin haber buscado casos, que es lo que corresponde por la regla 12.
- **Simetría de criterio con el resto del sitio:** esta ficha va a entrar con dos candidaturas cuya fuente electoral no se consultó, mientras que `content/politicos/salle.yaml` trae los 65.796 votos de 2024 con fuente. El mismo documento que se le exige a Salle hay que exigírselo a Barandiarán, y al revés: si para un diputado de 1994 se acepta «candidatura sin votos», hay que aceptarlo para todos. Mi recomendación es la primera: pedir la Corte Electoral, para los dos.
- **Años sin cubrir:** 1995-2000 (registro parlamentario, con la vía de Asamblea General y Comisión Permanente sin probar), los 79 días sin fechar de 2000-2005, y 2005-2026 completo (donde el resultado nulo es creíble pero descansa en buscadores).
- **Dependencia de fuentes:** todo el lote descansa en `estado-uruguayo` (Parlamento) y `wikimedia` (Wikipedia). La única fuente periodística leída, LR21, no entró en ningún registro. No es un problema de alineamiento —el Parlamento es `estatal` y Wikipedia `sin_datos`— sino de que casi no hay prensa que consultar.
- **Presentación, recorriendo la lista de control:** puntos 1, 2, 4, 5, 9 y 10 no aplican (no hay dos bloques de fuentes que ordenar, ni series de cifras, ni tablas, ni comparaciones, ni análisis de terceros). Punto 3 y punto 8: la ficha necesita `cobertura` y necesita que los mandatos estén completos, porque la línea de tiempo la dibuja el sitio solo a partir de `mandatos` y hoy dibujaría 60 meses de titular más cuatro astillas. Punto 6: el `titulo` de la declaración no dice el sentido del voto. Punto 7: no aplica, no hay audio ni video (si alguna vez aparece una versión sonora de la sesión, corresponde `marca_tiempo_contexto`).
- **Un defecto de componente que estos datos van a exponer:** `LineaMandato.astro` calcula `Mes X de N` con `Math.round(dias/30.44)`. Para la declaración del 07-11-2000, que cae dentro de la suplencia del 6 al 12 de noviembre, va a imprimir literalmente «Mes 1 de 0». No es algo que el editor pueda arreglar en el registro; es la primera vez que el sitio recibe un mandato de días y el componente no lo contempla. Va como aviso al mantenedor.
- **Foto:** correcto no ponerla. No hay imagen con licencia libre y `notas.md` lo dice. Que no se use la foto de la ficha del Parlamento sin que esa página declare licencia, ni ninguna foto de diario.

## Objeciones al brief

- **Los dos briefs afirman, sin fuente, que Gabriel Barandiarán «fue Representante Nacional (diputado) por el Partido Colorado».** El documento oficial del Parlamento dice «Representó al Partido Nuevo Espacio». Lo verifiqué yo mismo en la entrada individual del PDF, no por la lista de asistencia. No es una instrucción de seleccionar u omitir según partido, así que no es una violación de la Regla 0 en su forma habitual, pero sí es un encuadre partidario metido en el enunciado del brief sin fuente, y tuvo costo real: el lote 2 gastó al menos ocho de sus consultas persiguiendo un vínculo colorado que no existe, y el lote 1 abrió su `politicos.yaml` con un comentario defensivo. **La versión simétrica** es la que corresponde para cualquier persona: el brief afirma el partido solo con la fuente que lo dice, o no lo afirma y lo pone como lo primero a resolver. Los dos investigadores hicieron lo correcto —no forzaron el dato al brief— y hay que dejarlo escrito así en `razones.md`.
- **Lo que el brief pidió bien y no se hizo:** «cada suplencia, de quién y cuándo» (los 79 días y a quién suplió) y «Corte Electoral». No es objeción al brief sino a su cumplimiento, y ya está arriba.
- No hay ninguna otra instrucción asimétrica en ninguno de los dos briefs. Piden explícitamente el mismo criterio que para cualquier otra persona del sitio, y lo repiten en la primera línea.

## Discrepancias

No escribo `discrepancias.yaml`. Hubo un candidato y no llega al umbral: LR21 lo llama «El diputado Gabriel Barandiaran» el 29 de septiembre de 2000, y en esa fecha ninguna de las cuatro suplencias fechadas del documento oficial estaba corriendo. Pero el mismo documento registra 79 días de suplencias **sin fechar** en esa Legislatura, así que el documento primario no decide: el 29-09-2000 puede perfectamente ser uno de esos días. Registrar una discrepancia acá sería usar el silencio de un documento como si fuera su afirmación. Queda como una de las razones concretas por las que conviene fechar los 79 días: si se fechan y el 29-09-2000 no está entre ellos, entonces sí hay discrepancia y hay que escribirla. Dejo constancia de que aplicaría el mismo umbral en la dirección contraria.

## Cobertura

Una sola nota de prensa fue leída en las dos corridas. Las demás fuentes son documentos primarios del Parlamento (no llevan registro de tono), Wikipedia (no es un medio periodístico; `content/medios/wikipedia.yaml` la limita a datos de referencia) y una entrevista de FACTUM que no menciona a Barandiarán y cuyo medio no existe en `content/medios/` — la anoto en `medios_faltantes`, no como cobertura.

```yaml
- medio: la-republica
  url: https://www.lr21.com.uy/politica/23470-proteger-el-derecho-a-la-intimidad
  titulo: '"Proteger el derecho a la intimidad"'
  fecha: 2000-09-29
  evento: "propuesto: proyecto-datos-personales-2000"
  politico: barandiaran
  tono: neutral
  justificacion: >-
    Nota descriptiva: expone el proyecto y cita su exposición de motivos sin valorarlo en ningún
    sentido — "La preocupación del legislador nuevoespacista radica en la extensión de la
    informática, que permite que los datos personales de la gente estén a disposición de los demás
    y puedan ser trasmitidos y divulgados aun in su autorización".
```

El mismo registro queda en `data/corridas/2026-09-08-barandiaran-ficha/cobertura.yaml`.

## Resumen de severidades

| severidad | cantidad |
|---|---|
| bloquea | 2 |
| corregir | 8 |
| aviso | 5 |
| sin_objecion | 2 |

Los dos `bloquea` son `politicos[0].candidaturas[0]` y `politicos[0].candidaturas[1]`: las dos candidaturas afirman cosas que sus fuentes no dicen y una de ellas está contradicha por una fuente que existe. El resto de la ficha —identidad, partido, mandatos, la declaración— se sostiene y puede publicarse con las correcciones listadas.
