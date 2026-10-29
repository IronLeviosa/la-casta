# Crítica — corrida 2026-10-29-correccion-el-observador-grupo-historial

Lote: inbox/correcciones/el-observador-grupo-historial/
Registros revisados: 1 (medios[0], El Observador; sin muestra). Leídas con `pnpm fuente` las cuatro fuentes de `grupo_historial`, la de `alineamiento` y, para el contexto, El Cronista 2011, Señales, Grupo Radioescucha, Coletiva 2011, Caras y Caretas 2021, Montevideo Portal 2022-05-02, La Nación y Letra P 2022, Paper Papers 2009, dos notas del aniversario de 2021, Página/12 2002 y un PDF de FES. `pnpm banco medios/el-observador`: sin evidencia guardada (dato del orquestador).

## Resumen
```yaml
- registro: medios[0].grupo_historial[0]        # tramo peirano 1991-10-22 → 2022-05-04
  severidad: corregir
  tipo: contexto_omitido
- registro: medios[0].propiedad.descripcion
  severidad: corregir
  tipo: contexto_omitido
- registro: medios[0].grupo_historial[0].fuentes[2]   # Wikipedia
  severidad: aviso
  tipo: presentacion
- registro: medios[0].grupo_historial[1]        # werthein-hochbaum desde 2022-05-05
  severidad: sin_objecion
  tipo: sin_objecion                              # la nota del propio diario fija «Con fecha 5 de mayo de 2022 … adquirió el control accionario»; Montevideo Portal 2024 la confirma con otro grupo; el slug coincide con `grupo`
- registro: medios[0].alineamiento
  severidad: sin_objecion
  tipo: sin_objecion                              # no lo tocó la corrección; sigue en sin_datos con la justificación de lo buscado
- registro: notas.md (hipotesis 2, para_el_lector)
  severidad: aviso
  tipo: contexto_omitido
```

## Objeciones por registro

### medios[0].grupo_historial[0] — 1991-10-22 a 2022-05-04 — grupo `peirano`
- severidad: corregir
- tipo: contexto_omitido
- objecion: >-
    Ninguna de las tres fuentes del tramo dice que Ricardo Peirano o su familia controlaran la sociedad editora en algún año del período. La nota de fundación nombra a nueve promotores sin participaciones: Peirano, el abogado Héctor Viana Martorell (que le había propuesto comprar La Mañana y a quien Peirano le contrapropuso fundar un diario) y «otros siete». La entrevista de 2024 muestra a Peirano como vendedor en 2022 («Cuando la vendí»), pero él mismo habla en plural («Elegimos que otro hiciera la inversión»), y eso documenta quién vendió, no quién tuvo el control durante 31 años. Wikipedia solo sostiene la fecha. Además hay una señal positiva de un cambio de socios en medio del tramo, que el investigador dejó como pista: el grupo del empresario brasileño Ernesto Correa compró una participación hacia fines de 2010. Los dos textos de UyPress que se conservan lo dicen igual, y la cláusula «que recientemente vendió el frigorífico Pul … al también brasileño grupo Minerva» y la línea «el principal operador del grupo de Correa» identifican al titular: no es un nombre «cortado». En junio de 2011 el propio El Observador desmintió una venta y confirmó la inversión de Correa sin decir el monto, según Coletiva. Porcentaje, fecha exacta y control siguen sin fuente.
    Mi decisión, contra las tres opciones del brief:
    (a) Un tramo `peirano` entero no se sostiene: el slug afirma un dueño que ninguna fuente nombra. «Fundador» y «director» no son «dueño». El brief lo dice («No basta con "fundado por Ricardo Peirano"») y manda `desconocido` cuando de verdad se buscó y no se encontró, que es lo que el propio investigador escribe en `propiedad.descripcion`.
    (b) Partirlo no se puede sin adivinar. No hay fecha de entrada de Correa (solo «hace pocos meses» antes del 27/1/2011), no hay porcentaje, y lo único que hay sobre el control (el diario negó haber sido vendido) apunta a que el controlante no cambió, sin decir quién era. Un corte en 2010 con otro grupo sería inventar una fecha y un dueño.
    (c) Va un solo tramo 1991-10-22 → 2022-05-04 con `grupo: desconocido` y `fuentes: []`. La historia (los nueve promotores, la inversión de Correa, la venta de 2022) se cuenta en `propiedad.descripcion` con sus fuentes en `propiedad.fuentes`.
    Para la regla de dos grupos el efecto de (a) y de (c) es el mismo. Revisé `content/medios/` (lista completa; abiertas `ambito`, `infobae`, `busqueda`, `radio-carve`, `en-perspectiva`, `180-com-uy`) y ningún medio del sitio es de Peirano, de su familia ni de Correa. El único medio con un accionista compartido es El Cronista (Hochbaum, desde 2022, según la hipótesis 4 del investigador), y no tiene ficha. `desconocido` suma un aviso en cada `reportado` que cite El Observador antes del 5/5/2022, y ese aviso es verdadero. El criterio es el que se le aplicaría a cualquier medio: el slug de un tramo sale de una fuente que nombre al dueño de ese tramo.
- cita_de_contexto: >-
    «el abogado Héctor Viana Martorell, al que ya conocía, le propuso unirse para comprar La Mañana. […] Por eso, le hizo una contrapropuesta: fundar un nuevo medio. A la idea se sumaron otros siete empresarios» (https://www.elobservador.com.uy/nota/como-se-gesto-la-creacion-de-el-observador-2021102210250).
    «El Observador, ao desmentir a alienação, confirmou que o empresário gaúcho investiu no jornal, sem citar valores» (https://coletiva.net/noticias/empresario-gaucho-investe-em-jornal-uruguaio/, 2011-06-29).
    «Esta venta se suma a la del diario El Observador con una importante participación accionaria adquirida hace pocos meses por el grupo brasileño cuyo titular es […] Ernesto Correa. que recientemente vendió el frigorífico Pul» (https://gruporadioescuchaargentino.wordpress.com/2011/01/27/uruguay-grupo-empresario-argentino-adquiere-am-libre-y-otros-medios-en-el-uruguay/, 2011-01-27; mismo texto en https://seniales.blogspot.com/2011/01/el-grupo-ick-le-compro-el-diario-la.html. Es un solo despacho).
    «Goñi, que integra el grupo del empresario brasileño Ernesto Correa, dijo que no sabía si el empresario Correa tenía capital accionario en el diario El Observador. Pero Goñi sabía. El director del diario, Ricardo Peirano, dijo que Goñi ha estado con Correa en El Observador» (columna de Rosenberg citada por https://www.carasycaretas.com.uy/un-cielo-azul-con-millones-y-un-lobbysta-del-gobierno, 2021-10-10).
- accion_sugerida: >-
    Corrector: `grupo_historial[0]` = `{grupo: desconocido, desde: 1991-10-22, hasta: 2022-05-04, fuentes: []}`. Pasar a `propiedad.fuentes` las fuentes que hoy están en el tramo y sumar Coletiva (hace falta una ficha `coletiva-net` en `medios.yaml` del lote: portal de Porto Alegre sobre comunicación, con propiedad y alineamiento con fuente o `sin_datos`). Antes de cerrar, buscar con el buscador, el corpus o el sitemap (sin armar URL) tres cosas que podrían devolver un dueño con nombre. La primera es la nota de El Observador del sábado 25/6/2011 que, según Coletiva, aclaró la inversión de Correa: es la fuente primaria de la empresa. La segunda es la columna de Joel Rosenberg del 9 de abril (sin año en la nota; el «martes 5» de abril calza con 2011), probablemente en 180, que dirige él. La tercera es la nota de Afonso Ritter en el Jornal do Comércio de Porto Alegre. Hay además un documento previsible: la publicación en el Diario Oficial del estatuto de la sociedad editora (1991) y de sus convocatorias a asamblea de accionistas. Nombra a los fundadores y a los directores, pero casi seguro no el reparto de acciones (eran acciones al portador hasta la Ley 18.930 de 2012, y el registro del BCU no es público). El corpus tiene Diario Oficial solo de 1996. Si alguna de esas fuentes dice quién tenía la mayoría, el tramo vuelve a tener nombre (`peirano` u otro). Si dice que Correa tomó el control en una fecha, se parte en esa fecha con un grupo `correa`, que tampoco coincide con ninguna ficha.

### medios[0].propiedad.descripcion
- severidad: corregir
- tipo: contexto_omitido
- objecion: >-
    La descripción tiene tres problemas. (1) Deja fuera a Héctor Viana Martorell: la nota dice «otros siete» además de Peirano y Viana, así que los promotores fueron nueve, no ocho. (2) Afirma que «las fuentes consultadas no dicen … si hubo cambios de socios entre 1991 y 2022», y hay al menos uno documentado: la inversión de Correa, confirmada por el propio diario según Coletiva. (3) Justifica el grupo con una inferencia («figura bajo el grupo peirano porque … cuenta que vendió»). Con el tramo en `desconocido`, esa oración tiene que decir por qué no hay dueño con nombre.
- cita_de_contexto: las mismas de arriba.
- accion_sugerida: >-
    Un texto que las fuentes sostienen, para el lector y sin narración de proceso: «Fundado el 22 de octubre de 1991 como El Observador Económico. Ricardo Peirano propuso fundar un diario sin identificación partidaria en lugar de comprar La Mañana, como le había planteado el abogado Héctor Viana Martorell, y al proyecto se sumaron otros siete empresarios (Roberto Acle, Julio Blanco, Horacio Fernández Ameglio, Roberto Fossati, Lionel Hudson, Alfredo Iraola y Alfonso Pablo Varela). Hacia fines de 2010 el empresario brasileño Ernesto Correa compró una participación en la empresa; en junio de 2011 el diario negó haber sido vendido y confirmó esa inversión, sin decir su monto. No se encontró fuente que diga qué porcentaje tenía cada socio ni quién tuvo la mayoría entre 1991 y 2022, por eso ese período figura con dueño desconocido. Peirano cuenta que vendió la empresa en 2022: desde el 5 de mayo de ese año el control accionario es de un grupo de inversores argentinos encabezado por Gerardo Werthein y Gabriel Hochbaum; Pablo Tarantino preside el grupo y Peirano quedó como director periodístico.» El nombre de la senadora que había afirmado la venta en 2011 (Coletiva) no hace falta en la ficha de un medio. Si se pone, va con la misma neutralidad con que se pondría el de cualquier otro legislador.

### medios[0].grupo_historial[0].fuentes[2] — Wikipedia
- severidad: aviso
- tipo: presentacion
- objecion: >-
    La cita solo sostiene la fecha de fundación, no un dueño. Sirve en `propiedad.fuentes` como ancla de la fecha, no como fuente de un grupo, y el brief dice que Wikipedia no es la única fuente de un tramo. `fecha: 2026-09-03` no coincide con la bajada del corpus (2026-09-04) ni con `retrieved_at: 2026-10-29`.
- accion_sugerida: moverla a `propiedad.fuentes` con la fecha de consulta real.

### notas.md — hipotesis 2 y para_el_lector
- severidad: aviso
- tipo: contexto_omitido
- objecion: >-
    La hipótesis 2 lee el despacho de UyPress como si el nombre del titular viniera «cortado y mezclado». Las dos copias conservadas traen el mismo texto, y el resto del párrafo (Pul vendido a Minerva, «el grupo de Correa», Goñi como operador) identifica a Ernesto Correa. El investigador buscó «Ernesto Correa» (consultas.jsonl, línea 53) pero no llegó a Coletiva ni a Caras y Caretas. `para_el_lector` repite «otros siete» sin Viana Martorell y sostiene el grupo de Peirano: tiene que seguir a la nueva descripción. En `verificacion_manual`, «Observando desde afuera» y la tesis de Levin Olivera no eran URL armadas a mano, porque figuran en la página de Wikipedia que se leyó. La tesis devuelve HTTP 403 (probé); la otra trata de los Panamá Papers y es poco probable que dé la propiedad.

## Objeciones al lote
- **Cobertura del período**: el brief pide 1991-10-22 a 2022-05-05, y `cobertura_del_periodo` tiene un renglón para cada tramo. No bloquea.
- **Esfuerzo y rastro**: `consultas.jsonl` trae 8 búsquedas de corpus escritas por la herramienta (hora real, `corpus:buscar`), 24 web con hora aproximada declarada y unas 40 lecturas. Es parejo para el tamaño de la pregunta.
- **Dependencia de un grupo**: no aplica a una ficha de medio. Las fuentes del tramo vigente son de dos grupos (el-observador y montevideo-portal).
- **Simetría con otros medios (aviso, fuera del lote)**: el mismo criterio de `grupo_historial` tiene que llegar a todo medio con cambio de dueño escrito en su ficha (plan, paso 4), y en algunos el efecto sobre la regla de dos grupos es real, cosa que acá no pasa. `busqueda` dice «Desde julio de 2022 pertenece a Magnolio Media Group … el grupo también es dueño de … del portal 180», pero `180-com-uy` lleva `grupo: portal-180` y dice «No hay una fuente que documente un cambio posterior de propiedad». Las dos fichas publicadas se contradicen, y hoy una nota de Búsqueda y otra de 180 posteriores a la compra cuentan como dos grupos cuando, según una de las fichas, son uno. Siguen `radio-carve` (Fontaina-De Feo hasta 2013) y `ambito` (Vignatti desde 2008), sin historial. Lo propongo como corrección siguiente, con prioridad para Búsqueda y 180 porque ahí sí cambia qué se publica.
- **El Cronista**: si alguna corrida le crea ficha (cronista.com), desde el 5/5/2022 hay que revisar si comparte grupo con El Observador, porque Hochbaum es accionista de los dos según la hipótesis 4 del investigador. Su nota de 2011 sería de otro tramo.
- **Discrepancias**: ninguna. Lo que contradice a El Cronista e iProfesional («compra de El Observador por parte de capitales brasileños») es la desmentida del diario relatada por Coletiva, y no hay documento primario leído. Por eso no escribo `discrepancias.yaml`.
- **Sin mirar**: no se encontró la nota de El Observador del 25/6/2011 ni la columna de Rosenberg; no abrí `iprofesional` 2011 (el investigador dice que repite El Cronista); de El Cronista 2011 leí solo el primer párrafo (carácter 0 a 1.400).

## Objeciones al brief
- Ninguna por Regla 0: el brief no elige personas ni partidos y pide el mismo umbral que para cualquier medio. Un aviso: el plan y `medios.md` usan «El Observador es de Peirano hasta el 4 de mayo de 2022» como ejemplo del esquema. Si esta corrección cambia el tramo a `desconocido`, el ejemplo queda afirmando algo que la ficha publicada no sostiene, y convendría cambiarlo por uno neutro en el taller.

## Cobertura
```yaml
# Sin registro de tono, porque no tratan a ninguna persona ni partido con ficha: el-observador 2021-10-23 (fundación), el-observador 2022-05-11 (cambio de accionistas),
# montevideo-portal 2022-05-02, lanacion.com.ar 2022-05-11, letrap.com.ar 2022-05-30 (ventana leída), paperpapers.net 2009, cronista.com 2011-01-28 (ventana leída).
- medio: montevideo-portal
  url: https://www.montevideo.com.uy/Noticias/Peirano-y-la-negacion-del-periodismo--Tenes-que-ir-al-tercer-parrafo-para-ver-que-pasa--uc894199
  fecha: 2024-07-16
  evento: crisis-2002
  politico: mujica
  tono: neutral
  justificacion: >-
    Menciona a Mujica solo para contar la respuesta de Peirano: «debió contestarle al entonces presidente José Mujica, cuando este habló del “diario de los Peirano”», sin adjetivos sobre él.
- medio: caras-y-caretas
  url: https://www.carasycaretas.com.uy/un-cielo-azul-con-millones-y-un-lobbysta-del-gobierno
  fecha: 2021-10-10
  evento: asociacion-portland-ancap
  politico: lacalle-pou
  tono: desfavorable
  justificacion: >-
    La nota juzga con su propia voz la visita del presidente a la cementera: «Suena raro que el presidente vaya a saludar a una empresa privada, casi extranjera, y les diga que, como la de los uruguayos pierde plata, está buscando socios».
- medio: caras-y-caretas
  url: https://www.carasycaretas.com.uy/un-cielo-azul-con-millones-y-un-lobbysta-del-gobierno
  fecha: 2021-10-10
  evento: propuesto:cementera-cielo-azul-2021
  politico: goni-rodrigo
  tono: desfavorable
  justificacion: >-
    Después de reproducir la columna que dice «Rodrigo Goñi mintió», la nota cierra con su propia voz: «¿Se comprende ahora cómo se puede lograr un Cielo Azul?».
- medio: coletiva-net            # sin ficha en content/medios
  url: https://coletiva.net/noticias/empresario-gaucho-investe-em-jornal-uruguaio/
  fecha: 2011-06-29
  evento: propuesto:venta-de-medios-a-extranjeros-2010-2011
  politico: topolansky
  tono: neutral
  justificacion: >-
    Cuenta el hecho sin calificarla: «A nota corrigia denúncia da senadora Lucia Topolanksy, esposa do presidente José Mujica, sobre a venda a estrangeiros de alguns meios de comunicação».
- medio: gruporadioescuchaargentino-wordpress-com   # blog sin ficha; reproduce el despacho de UyPress (mismo texto en seniales.blogspot.com)
  url: https://gruporadioescuchaargentino.wordpress.com/2011/01/27/uruguay-grupo-empresario-argentino-adquiere-am-libre-y-otros-medios-en-el-uruguay/
  fecha: 2011-01-27
  evento: propuesto:venta-de-medios-a-extranjeros-2010-2011
  politico: mujica
  tono: neutral
  justificacion: >-
    Recoge su posición sin juzgarla: «declaró hace pocos meses que en materia de prensa no era partidario de leyes regulatorias y que lo único que le preocupaba era la creciente compra de medios por parte de extranjeros».
- medio: gruporadioescuchaargentino-wordpress-com
  url: https://gruporadioescuchaargentino.wordpress.com/2011/01/27/uruguay-grupo-empresario-argentino-adquiere-am-libre-y-otros-medios-en-el-uruguay/
  fecha: 2011-01-27
  evento: propuesto:venta-de-medios-a-extranjeros-2010-2011
  politico: goni-rodrigo
  tono: neutral
  justificacion: >-
    Lo describe por su función, sin calificar: «El principal operador del grupo de Correa en Uruguay es el dirigente nacionalista Rodrigo Goñi».
```
