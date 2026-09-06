# Crítica — corrida 2026-09-05-lacalle-pou-economia-combustibles

Modelo: claude-opus-5
Lote: `inbox/lacalle-pou/economia/combustibles/2026-09-05/` + `.../2026-09-05-t2/` + `.../2026-09-05-t3/` (criticados como un solo lote)
Registros revisados: 18 (16 declaraciones, 1 mención, 1 promesa reproducida) + 8 candidatas a segunda fuente de registros ya publicados

Todas las fuentes citadas se abrieron con `pnpm fuente` en esta sesión. `pnpm banco declaraciones/lacalle-pou` y
`pnpm banco promesas/lacalle-pou` devuelven "sin evidencia guardada": no hay pedidos rechazados previos cuya
evidencia haya que sumar a nada de este lote.

---

## Criterio previo: transcripciones no idénticas (sienta precedente)

Los tres tramos plantean la misma pregunta —si una cita de El País que no coincide carácter por carácter con la
ya publicada sirve como segunda fuente— y la respuesta decide la mitad de este lote. **Sí sirve, con tres
condiciones acumulativas.** Una segunda fuente cuenta como segunda fuente si:

- **(a) Literalidad propia.** Su campo `cita` es copia literal de *su* nota. Es lo que el esquema pide y lo que
  `pnpm validar --red` comprueba. El esquema nunca exigió que dos fuentes coincidan entre sí; exigirlo sería
  inventar un requisito que ningún registro publicado cumple (ver `2022-05-28-espalda-ancap-termino.yaml`, hoy
  `publicado`, cuyas dos fuentes traen transcripciones distintas del mismo audio).
- **(b) Misma afirmación.** La segunda fuente tiene que contener **lo que el registro afirma**, no el hecho de
  alrededor. Si el registro dice X, la segunda nota tiene que decir X con las palabras que sean. No alcanza con
  que cubra el mismo acto, el mismo día o la misma cifra.
- **(c) Testigo, no réplica.** La nota no declara estar tomando la cita de la primera fuente ni de un tercero
  común. "según consignó El País", "según consignó Subrayado", o una cita que es en realidad un tuit incrustado
  de otro medio, dan **otro grupo pero no otro testigo**: eso no invalida el registro, pero va a
  `notas_internas` y el editor no puede tratarlo como corroboración independiente.

**No rompen (a)-(b):** puntuación, singular/plural, conectores ("y que" ↔ ", que"), muletillas, cortes de frase,
paréntesis aclaratorios del redactor.
**Sí rompen (b):** que falte la oración que el registro afirma; que cambie el sujeto, el número, la fecha o la
modalidad (afirmar algo ≠ evaluarlo).

Aplicado, el criterio separa exactamente los casos buenos de los malos: las cuatro citas de El País del tramo 2 y
la del tramo 1 pasan (a) y (b); las tres del tramo 3 y la de El Observador en Mercedes fallan (b) o (c). Si el
criterio fuera "idéntico carácter por carácter" se caerían las cinco buenas junto con las malas, y si fuera
"mismo hecho" pasarían todas. Por eso propongo este y no otro.

---

## Objeciones por registro

### T1 declaraciones[0] — 2020-07-24 — "Los espero el miércoles que viene a las dos de la tarde…"
- severidad: corregir
- tipo: cita_fuera_de_contexto
- objecion: La cita elegida no dice nada sobre el tema del registro. "Los espero el miércoles que viene a las dos
  de la tarde en el despacho" es una frase de agenda; el registro está archivado en `economia/combustibles` y su
  `resumen` habla de la planta de cemento de Paysandú, pero ninguna palabra de la cita toca ANCAP, portland ni
  combustibles. El editor ya aplicó exactamente esta objeción al registro `2025-05-07-balances-ancap-no-comparto`
  ("la frase genérica sobre la crítica no nombraba el tema") y le cambió la cita principal. Corresponde lo mismo
  acá. La nota tiene una frase sustantiva y disponible.
- cita_de_contexto: "Nosotros estamos para dar una mano en lo que sea. Estamos para ayudar a que sigan las
  fuentes de trabajo, pero sabemos que hay ineficiencias, sabemos que hace 20 años que se pierde ..." —
  https://www.elpais.com.uy/informacion/politica/sindicato-de-ancap-se-manifesto-lacalle-se-acerco-y-dijo-los-espero-el-miercoles-que-viene
- accion_sugerida: Cambiar la `cita` por el pasaje de "ineficiencias"/"hace 20 años que se pierde", que sí es
  sobre la gestión de ANCAP, y dejar la frase de la reunión en el `resumen`. Mantener `_faltante: segunda_fuente`.
  La misma nota dice que el diálogo "registró Subrayado de Canal 10": si aparece el video, sube a `textual`.

### T1 declaraciones[1] — 2021-04-12 — "El Gobierno ha tomado una decisión en base a la situación actual…"
- severidad: corregir
- tipo: contexto_omitido
- objecion: Dos objeciones chicas y una nota a favor. (i) El `resumen` dice "las ministras de Economía e
  Industria": el de Industria era Omar Paganini, varón. (ii) La `descripcion` de la evidencia homónima en
  `promesas.yaml` afirma "una suba de 30,8% ... entre diciembre de 2020 y marzo de 2021", cifra que **no está en
  su única fuente**: El País dice "30% entre diciembre de 2020 y marzo de 2021" y el 30,8% es de Montevideo
  Portal, referido al "primer trimestre". La descripción fusiona el número de una nota con el período de la otra.
  (iii) A favor del registro: las dos fuentes reproducen el mismo tuit verbatim, o sea dos grupos con un solo
  origen — pero el origen es un texto escrito primario, así que el riesgo que la regla de dos grupos previene
  (error de desgrabación) no aplica. No lo cuento como dependencia.
- cita_de_contexto: "La ministra de Economía, Azucena Arbeleche, comunicó este lunes que el gobierno resolvió no
  aumentar los combustibles pese a la suba del precio del petróleo de 30% entre diciembre de 2020 y marzo de
  2021." —
  https://www.elpais.com.uy/negocios/noticias/lacalle-decision-de-no-subir-los-combustibles-responde-a-la-situacion-actual-por-la-pandemia
- accion_sugerida: Corregir "las ministras" → "la ministra de Economía y el ministro de Industria". En la
  evidencia de promesa, o poner 30% (con El País) o sumar montevideo-portal como segunda fuente para el 30,8%.

### T1 declaraciones[2] — 2021-06-01 — "Lo que hubo fue un no aumento de combustibles…"
- severidad: bloquea
- tipo: contexto_omitido
- objecion: El registro le atribuye al político una afirmación de hecho sobre terceros identificables —que los
  directores de la oposición en ANCAP pidieron aumentar— y **omite que el director nombrado la desmintió
  públicamente al día siguiente, exigió rectificación e invitó a chequearlo contra las actas del Directorio**.
  No es un contexto que haya que salir a buscar: **las dos fuentes del propio registro están construidas
  alrededor del desmentido**. El titular de El País es "Director de Ancap por el FA negó haber pedido suba de
  combustibles como dijo Lacalle Pou", y Montevideo Portal le dedica un subtítulo entero ("Discrepancias con la
  oposición"). Publicar el registro con este `resumen` es usar dos notas sobre un desmentido para difundir la
  afirmación desmentida.
- cita_de_contexto: "'El presidente no dice la verdad. Quiero creer porque está mal informado', comenzó
  destacando Sosa en sus redes sociales. Afirmó que es 'falso' que el Frente Amplio haya pedido un aumento de los
  combustibles, y recalcó: 'Si el presidente quiere, que solicite las actas del Directorio (de Ancap)'" —
  https://www.elpais.com.uy/informacion/politica/director-de-ancap-por-el-fa-nego-haber-pedido-suba-de-combustibles-como-dijo-lacalle-pou
- accion_sugerida: Agregar el desmentido de Walter Sosa al `resumen` (con nombre y fecha, 02/06/2021) antes de
  promover. Además: la afirmación es chequeable y la fuente primaria está nombrada por el propio desmentido —
  **actas del Directorio de ANCAP de abril-mayo de 2021** (ANCAP, resoluciones de directorio); es candidata
  directa a `chequeos`. Y el tuit de Sosa da "el minuto 29:40 de la entrevista de Blanca Rodríguez": con ese
  video la declaración sube a `textual` con `marca_tiempo`. La `cita` de montevideo-portal puede ampliarse: esa
  nota también trae "increíblemente los miembros de la oposición dentro de Ancap dijeron tenemos que aumentar",
  o sea corrobora la afirmación completa, no solo la segunda mitad. Fecha verificada: la entrevista fue martes
  01/06/2021 ("El presidente había anunciado el martes en Subrayado", Montevideo Portal).

### T1 declaraciones[3] — 2021-08-03 — "No me gusta que me critiquen, pero menos me gusta cuando tienen razón"
- severidad: corregir
- tipo: un_solo_grupo
- objecion: Los dos grupos son formales, no reales. El Observador atribuye la cita a El País de forma explícita.
  Es el caso (c) del criterio de arriba: da un segundo `grupo` a la validación pero no un segundo testigo. Este
  es el registro más desfavorable del tramo, así que la objeción no es de conveniencia: si lo dejo pasar acá,
  tengo que dejar pasar el de Mercedes y el de Tacuarembó, que favorecen al político.
- cita_de_contexto: "El presidente admitió ante los periodistas presentes que no le gusta recibir críticas. 'No
  me gusta que me critiquen, pero menos me gusta cuando tienen razón', dijo, **según consignó El País**." —
  https://www.elobservador.com.uy/nota/lacalle-pou-ante-cuestionamientos-por-suba-de-combustibles-no-me-gusta-que-me-critiquen-pero-menos-me-gusta-cuando-tienen-razon--20218493318
- accion_sugerida: Mantener las dos fuentes, pero anotar en `notas_internas` que El Observador replica a El País
  y que el registro no tiene corroboración independiente. Fue un diálogo informal sin rueda de prensa (así lo
  dice El País), por lo que probablemente no exista video: buscar Subrayado/Telenoche del 03-04/08/2021.

### T1 declaraciones[4] — 2021-08-24 — "La idea es que no se pregunte mes a mes qué va a pasar…"
- severidad: aviso
- tipo: sin_objecion
- objecion: Cita literal, `_faltante: segunda_fuente` correctamente marcado, `resumen` fiel. Sin objeción de
  fondo. Un dato que el investigador tenía delante y no siguió: la propia nota dice que el cambio de fechas del
  PPI lo informó primero **la diaria** (`cooperativa-la-diaria`, alineamiento independiente), lo que da una
  candidata concreta a segunda fuente de otro grupo *y* de otro alineamiento.
- cita_de_contexto: "El gobierno realizará una modificación en el cálculo del Precio de Paridad de Importación
  (PPI) ... **según informó La Diaria y confirmó El País** con fuentes oficiales del Ministerio de Energía y
  Minería (MIEM)." —
  https://www.elpais.com.uy/negocios/noticias/gobierno-cambia-fechas-para-calculo-de-precios-de-combustibles-lacalle-se-reunio-con-arbeleche-y-paganini
- accion_sugerida: Buscar la nota de la diaria del 23-24/08/2021 sobre el cambio de fechas del PPI y ver si trae
  la cita. Si no la trae, el `_faltante` queda bien puesto.

### T1 declaraciones[5] — 2021-09-16 — "Tenemos que modernizarla"
- severidad: corregir
- tipo: cita_fuera_de_contexto
- objecion: Cita de 24 caracteres cuyo único contenido es un pronombre cuyo antecedente lo pone el redactor, y
  cargada a `nivel: textual`. El registro resuelve "la" = el sector portland; **la propia Presidencia lo resuelve
  distinto**: su subtítulo dice "Lacalle Pou: 'Tenemos que modernizar Ancap'". Que la fuente primaria y el
  registro discrepen sobre a qué se refiere el pronombre es exactamente el motivo por el que una cita de dos
  palabras no debería sostener sola un registro `textual`. Además la nota de gub.uy no es una desgrabación: es
  una gacetilla que parafrasea, y todo lo que el `resumen` afirma más allá de esas cuatro palabras ("asociándose
  con un inversor privado") es paráfrasis de la Presidencia, no palabras de él.
- cita_de_contexto: "Lacalle Pou: 'Tenemos que modernizar Ancap' Tras la inauguración, el presidente de la
  República habló en rueda de prensa de la situación de la empresa ANCAP y, en particular, del sector portland
  que arroja pérdidas económicas, recordó. 'Tenemos que modernizarla', expresó y consideró que el ente debe
  asociarse con un inversor privado" —
  https://www.gub.uy/presidencia/comunicacion/noticias/presidente-lacalle-pou-participo-inauguracion-fabrica-cementera-treinta-tres
- accion_sugerida: La misma página enlaza el audio "Declaraciones del presidente Luis Lacalle Pou a la prensa".
  Bajarlo, transcribir el pasaje y reemplazar la cita por una frase con sujeto explícito; recién ahí `textual`
  con `marca_tiempo`. Fecha confirmada contra la primaria: la nota abre con "Cielo Azul 16/09/2021 Este jueves
  16", así que `fecha: 2021-09-16` está bien pese a que el corpus muestre `fecha ?`.

### T1 declaraciones[6] — 2021-10-10 — "Acá no viene un ministro de Economía y llama al presidente de Ancap…"
- severidad: aviso
- tipo: sin_objecion
- objecion: Cita literal, `_faltante` bien marcado, `resumen` fiel al cuerpo (que efectivamente detalla el
  desglose petróleo/impuestos/subsidio/ganancia). Sin objeción. Aviso al editor: es una frase que le atribuye a
  gobiernos anteriores una práctica concreta, sin nombrarlos; la nota tampoco pide respuesta a nadie. No es
  riesgo legal (no identifica persona), pero es afirmación chequeable.
- cita_de_contexto: "Lacalle Pou aseguró que ahora las personas pueden saber de ese precio cuánto corresponde al
  costo del petróleo, cuánto a impuestos, cuánto al subsidio del ente y cuánto a las ganancias de la empresa." —
  https://www.elpais.com.uy/informacion/politica/lacalle-defendio-nueva-forma-de-fijacion-del-precio-de-los-combustibles-hoy-es-clara
- accion_sugerida: Para el Veracímetro, la afirmación de que antes el precio del combustible financiaba déficit
  fiscal se contrasta con los **balances anuales de ANCAP y las transferencias al Tesoro (Rendición de Cuentas,
  MEF)** y con las series de PPI de URSEA. No la busqué yo.

### T1 declaraciones[7] — 2021-10-10 — "Desmantelar no es asociarlas, desmantelar es hacerlas que no trabajen bien…"
- severidad: corregir
- tipo: un_solo_grupo
- objecion: El registro queda en `reportado` con fuente única de El Observador, pero **esa nota está reproduciendo
  la gacetilla de Presidencia y lo dice**. O sea: el `_faltante: segunda_fuente` es innecesario y el `nivel`
  está mal. Verifiqué la fuente primaria en esta sesión y contiene la cita íntegra, palabra por palabra.
- cita_de_contexto: "Acerca de los precios de los combustibles, Lacalle Pou resaltó el compromiso de las
  autoridades para reducir los sobrecostos de Ancap. Adelantó que la dependencia dedicada a la producción de
  cemento pórtland será asociada con privados. 'Desmantelar no es asociarlas, desmantelar es hacerlas que no
  trabajen bien, es despilfarrar, es mala administración; nosotros queremos buenas empresas públicas para que
  les presten servicios a la población', expresó." —
  https://www.gub.uy/presidencia/comunicacion/noticias/lacalle-pou-tengo-desvelo-productores-vendan-libremente-mundo-hacia-alli-va
- accion_sugerida: Agregar esa URL como `documento_oficial` (medio `presidencia`), pasar el registro a
  `nivel: textual` y quitar el `_faltante`. La primaria confirma además la fecha: "durante el cierre de la
  exposición rural de San José, **este domingo 10**". Anotar en `notas_internas` que la nota de El Observador
  es reproducción de esa gacetilla ("Según se destacó en el portal de Presidencia de la República"), para que
  nadie la cuente después como cobertura independiente.

### T1 declaraciones[8] — 2021-12-14 — "Yo escuché las explicaciones del presidente de Ancap…"
- severidad: corregir
- tipo: cita_fuera_de_contexto
- objecion: El `resumen` dice que "no había motivos aparentes para una medida de esa magnitud" y toma esa
  formulación del **titular** de El País, que entrecomilla una frase que no está en el cuerpo. El cuerpo dice
  otra cosa: que hay huelgas que, **aun teniendo un motivo**, no tienen razones aparentes para un paro de esa
  dimensión. La concesiva es justo lo que el titular borra y lo que el `resumen` hereda. Busqué fuente primaria
  (gub.uy, video) para registrar esto en `discrepancias.yaml` y no la encontré, así que queda acá.
- cita_de_contexto: "El presidente Luis Lacalle Pou dijo este martes que hay 'algunas huelgas que, aun teniendo
  un motivo', no tienen razones 'aparentes para generar un paro de esa dimensión y un daño al país y sus bienes
  públicos'." —
  https://www.elpais.com.uy/informacion/politica/no-hay-motivos-aparentes-para-generar-un-paro-de-esa-dimension-dijo-lacalle-pou-sobre-ancap
- accion_sugerida: Reescribir el `resumen` con la concesiva ("dijo que la huelga tenía un motivo pero que no veía
  razones aparentes para un paro de esa dimensión"). Mantener `_faltante`: probé Subrayado del 16/02/2022
  (n839481), que el buscador sugiere, y no contiene la cita.

### T1 promesas[0] — no-aumentar-combustibles (reproducción de una promesa ya publicada)
- severidad: bloquea
- tipo: sin_objecion (defecto de forma, no de contenido)
- objecion: Confirmado el problema que señalaba el encargo, y es **peor de lo que anticipaba: `pnpm promover` no
  se va a negar**. El id de una promesa se deriva de `<politico>/<slug(texto)>` con `slugificar(texto, 6)`
  (`scripts/lib/inbox.ts:155-156`, `scripts/lib/contenido.ts:121`). El `texto` reproducido empieza "No aumentar
  el precio de los combustibles si es electo presidente…", y como "no" y "si" no están en `PALABRAS_VACIAS`, el
  id derivado es `lacalle-pou/no-aumentar-precio-combustibles-si-es`, que **no colisiona** con
  `lacalle-pou/no-aumentar-combustibles`. `promover` escribiría un segundo archivo de promesa, sin `estado` ni
  `fundamentacion` (y con `evidencias_candidatas` remapeadas a `evidencias` por `inbox.ts:104`): un duplicado
  huérfano de la promesa real. La guarda de "Ya existe: promover nunca sobreescribe" no se dispara.
- cita_de_contexto: `scripts/promover.ts:377` — "Ya existe: promover nunca sobreescribe. Si es una corrección,
  escribí el registro en content/correcciones/ y corré con --correccion <id>" (mensaje que en este caso **no**
  se emitiría).
- accion_sugerida: Borrar `promesas.yaml` del tramo 1 antes de correr `promover`, y encaminar las cuatro
  evidencias por `content/correcciones/<fecha>-<slug>.yaml` con
  `afecta: [promesas/lacalle-pou/no-aumentar-combustibles]`. Qué sumar exactamente, en la sección "Objeciones al
  lote", punto 4.

### T2 declaraciones[0] — 2022-03-14 — "Las empresas públicas están dando déficit hace años. Dejaron pudrir un horno…"
- severidad: corregir
- tipo: un_solo_grupo
- objecion: Tres fuentes, tres grupos, **un solo origen**: El País dice que el intercambio "fue consignado por
  Telemundo (Canal 12)", El Observador lo cierra incrustando el tuit de @TelemundoUY, y teledoce *es* Telemundo.
  Peor: la `cita` elegida de El Observador ("Dejaron pudrir un horno. ¡Nunca hablaste!") **no es prosa de El
  Observador sino el texto del tuit incrustado de Telemundo**. Es literal en la página, así que pasa la
  validación de red, pero como corroboración es circular. El Observador sí tiene transcripción propia, distinta,
  en su cuerpo.
- cita_de_contexto: "'Está dando déficit hace años —fue una de las primeras cosas que respondió el presidente
  Lacalle Pou ante los reclamos de los trabajadores—. Dejaron pudrir un horno, nunca te vi levantar la voz,
  nunca hablaste'" —
  https://www.elobservador.com.uy/nota/el-cruce-de-lacalle-con-un-sindicalista-por-el-portland-de-ancap-dejaron-pudrir-un-horno-y-nunca-hablaste--2022314142049
- accion_sugerida: Cambiar la `cita` de el-observador por su prosa propia (la de arriba), que además está más
  cerca de la cita del registro. Y resolver el problema de raíz: teledoce publica el video en su propia página
  (`https://www.teledoce.com/wp-content/uploads/2022/03/lacalle-def.mp4`). Con ese archivo y `marca_tiempo` el
  registro pasa a `textual` y deja de depender de tres desgrabaciones del mismo material.

### T2 declaraciones[1] — 2022-03-14 — "Gerardo, vamos a decir la verdad: no vamos a privatizar…"
- severidad: aviso
- tipo: cita_fuera_de_contexto
- objecion: Las dos citas son literales en sus notas, pero la de teledoce **fusiona réplicas que ocurrieron en
  momentos distintos**: teledoce entrecomilla como un bloque continuo "No vamos a privatizar. Nunca te vi
  quejarte de otras asociaciones. Hasta acá llegamos por muchos años. No vamos a privatizar, queremos que sean
  competitivos, se los están comiendo. Los trabajadores no van a perder el laburo", mientras que la
  transcripción larga de El País muestra esas frases separadas por varias intervenciones del sindicalista (el
  "no vamos a privatizar" viene antes del intercambio sobre la piedra caliza, y "Gerardo, vamos a decir la
  verdad" bastante después). El registro copia bien; el que fusiona es teledoce. Como la `cita` principal del
  registro es la de El País, no bloquea.
- cita_de_contexto: "'No vamos a privatizar', reafirmó Lacalle Pou y Rodríguez lo cortó para decirle: 'Usted
  está privatizando, porque si se asocia en un 80%...' [...] 'Gerardo, vamos a decir la verdad: no vamos a
  privatizar. Sí queremos que sean competitivos, porque sino se los van a comer como se los están comiendo'" —
  https://www.elpais.com.uy/informacion/politica/cruce-entre-lacalle-pou-y-presidente-de-fancap-dejaron-pudrir-un-horno-y-nunca-te-vi-levantar-la-voz
- accion_sugerida: Anotar en `notas_internas` que la cita de teledoce es un bloque compuesto y no debe usarse
  como cita principal. Mismo remedio de fondo: el video de teledoce.

### T2 declaraciones[2] — 2022-03-30 — "La recomendación de la Ursea fue de $ 15 pesos al gasoil…"
- severidad: corregir
- tipo: un_solo_grupo
- objecion: **Segunda fuente falsa, versión atenuada.** La cita de El Observador que el registro usa no contiene
  una sola palabra de Lacalle Pou: es la descripción del ajuste de precios. Corrobora el *hecho* (subieron $3 y
  $5, y el ajuste quedó por debajo de lo que marcaba el PPI) pero no la *declaración*, que es lo que este
  registro afirma. Con esta segunda fuente el registro podría subir a `publicado` teniendo las palabras del
  político respaldadas por un solo medio. Es más leve que el caso del tramo 3 porque El Observador sí atribuye
  el anuncio a él y sí publica las cifras de PPI ($7,54 nafta / $15,22 gasoil, coherentes con el "$7,5 y $15"
  que él dijo), o sea el contenido está doblemente sostenido aunque las palabras no.
- cita_de_contexto: "En una improvisada rueda de prensa en Mercedes, el presidente Luis Lacalle Pou, realizó el
  miércoles por la tarde dos anuncios de impacto para el bolsillo. En primer lugar confirmó una nueva suba de
  los combustibles que regirá desde el viernes 1° de abril" —
  https://www.elobservador.com.uy/nota/gobierno-anuncio-suba-de-combustibles-y-exoneracion-de-iva-a-panificados-y-fideos-202233019490
- accion_sugerida: Dos salidas, cualquiera sirve: (i) cambiar la `cita` de el-observador por el pasaje de arriba
  —que al menos atribuye el anuncio a él— y anotar en `notas_internas` que ningún medio distinto de El País
  reproduce sus palabras; o (ii) marcar `_faltante: segunda_fuente` y dejar El Observador como contexto. Lo que
  no se puede es dejarla como está y contarla como segundo grupo. Este registro es además la evidencia
  `en_contra` de promesa más limpia del lote (suba real con montos): ver punto 4 de las objeciones al lote.

### T2 declaraciones[3] — 2023-06-08 — "No hay problema, pasa que si me dicen mentiroso acá…"
- severidad: aviso
- tipo: un_solo_grupo
- objecion: Citas literales en las dos notas y transcripciones genuinamente distintas (El País: "No hay problema,
  pasa que si me dicen…"; Montevideo Portal: "Si ya me dicen…"), lo que indica desgrabación propia de cada uno.
  Pero las dos declaran que el material es de Telemundo, así que el testigo vuelve a ser uno. Sin objeción de
  fondo: el registro está bien armado y el `resumen` recoge tanto el reproche como el compromiso de recibirlos.
- cita_de_contexto: "El diálogo culminó con esas palabras y el presidente siguió su recorrido, **según el video
  publicado por Telemundo**. En otro de los videos registrados por Canal 12…" —
  https://www.montevideo.com.uy/Noticias/Lacalle-cara-a-cara-con-Fancap--Para-que-los-voy-a-recibir-si-piensan-que-voy-a-mentir--uc856353
- accion_sugerida: Anotar el origen único en `notas_internas`. El investigador registró que la nota de la diaria
  tiene paywall: como es `cooperativa-la-diaria`/independiente, vale el intento de conseguirla para tener por
  primera vez en este lote un tercer alineamiento.

### T2 menciones[0] — 2022-03-14 — "Nunca te vi quejarte en ninguna asociación en estos años. ¿Esta no sirve?"
- severidad: corregir
- tipo: un_solo_grupo
- objecion: El `_faltante: segunda_fuente` está puesto con un criterio **más estricto que el que el mismo
  investigador defendió para El País** en la sección `segunda_fuente_para_registro_existente`. Ahí argumenta que
  transcripciones distintas del mismo audio valen; acá descarta teledoce porque no encontró "esas palabras
  exactas". Teledoce trae la misma afirmación con otras palabras, y pasa (a), (b) y —al ser desgrabación propia
  del canal que grabó— también (c). La asimetría no cambia nada favorable ni desfavorable, pero un criterio que
  se aplica flojo cuando conviene sumar y duro cuando no, no es un criterio.
- cita_de_contexto: "'No vamos a privatizar. **Nunca te vi quejarte de otras asociaciones**. Hasta acá llegamos
  por muchos años.'" —
  https://www.teledoce.com/telemundo/nacionales/tenso-cruce-entre-el-presidente-de-fancap-y-lacalle-dejaron-pudrir-un-horno-y-nunca-te-vi-levantar-la-voz/
- accion_sugerida: Sumar teledoce como segunda fuente con su propia `cita` ("Nunca te vi quejarte de otras
  asociaciones", ampliada a ≥20 caracteres con la frase contigua) y quitar el `_faltante`. Sobre el referente
  propuesto `gerardo-rodriguez-fancap`: la nota de El País del 24/07/2020 del tramo 1 también lo llama
  "presidente de la Fancap", o sea el cargo cambia entre notas, no entre años; el editor debería fijar un
  descriptor y anotar la variante.

### T3 declaraciones[0] — 2024-03-08 — "El país es uno, y la actividad política es el arte de lo posible…"
- severidad: aviso
- tipo: contexto_omitido
- objecion: Las dos citas son literales y transcripciones distintas del mismo discurso: pasa (a) y (b). Falla
  (c): Montevideo Portal dice tomarlo de Subrayado. Punto menor de contenido: el `resumen` afirma que no logró
  convencer "a los sectores de la coalición de gobierno", pero él no nombra a nadie; la identificación es de El
  País ("agregó en referencia a algunos legisladores de la coalición"), y Montevideo Portal la atribuye a
  "negociaciones políticas". Conviene marcar de quién es la atribución.
- cita_de_contexto: "'…Pueden tener sus razones, seguramente las tengan', **agregó en referencia a algunos
  legisladores de la coalición que no acompañaron la iniciativa**." —
  https://www.elpais.com.uy/informacion/politica/lacalle-pou-insto-a-los-cultivadores-de-arroz-a-no-ceder-en-su-reclamo-para-desmonopolizar-los-combustibles
- accion_sugerida: En el `resumen`, atribuir la identificación al medio ("según El País, en referencia a
  legisladores de la coalición"). Anotar en `notas_internas` que la segunda fuente replica a Subrayado, y probar
  la nota original de Subrayado del 08/03/2024, que sería un tercer grupo con testigo propio.

### T3 declaraciones[1] — 2024-03-08 — "No es cierto que no se haya discutido porque fue en anteproyecto…"
- severidad: corregir
- tipo: cita_fuera_de_contexto
- objecion: Dos cosas. (i) La cita incluye "(dentro de la Ley de Urgente Consideración)", que es una aclaración
  del redactor de El País metida dentro de las comillas, no palabras del político; se ve porque Montevideo
  Portal desgraba la misma frase sin ella. Pasa la validación porque es literal en El País, pero el registro
  presenta como dicho por él un dato normativo que el diario agregó. (ii) Más importante: el `_slug` del
  registro y su frase más citable —"jugamos como nunca y perdimos como siempre"— **él mismo la atribuye a un
  tercero**, y eso solo se ve en la segunda fuente. El registro no lo recoge.
- cita_de_contexto: "'Y tampoco es cierto que no se haya discutido. Porque fue el anteproyecto al Parlamento y,
  **como decía un amigo mío**, jugamos como nunca y perdimos como siempre'" —
  https://www.montevideo.com.uy/Noticias/-Jugamos-como-nunca-perdimos-como-siempre--Lacalle-por-libre-importacion-de-combustibles-uc881969
- accion_sugerida: Agregar al `resumen` que él atribuyó la frase a un tercero ("como decía un amigo mío"), y
  marcar el paréntesis como aclaración del medio (o mover el dato de la LUC al `resumen`).

### T3 declaraciones[2] — 2024-03-08 — "Yo recomendaría no ceder en este reclamo. Ancap está mejor, que hace seis años"
- severidad: bloquea
- tipo: un_solo_grupo
- objecion: **Segunda fuente falsa, el caso limpio del lote.** La cita registrada tiene dos oraciones. Montevideo
  Portal contiene la primera y **no contiene la segunda**: `pnpm fuente ... --buscar "Ancap está mejor"` devuelve
  "sin coincidencias en esta nota" sobre el texto completo (1.976 caracteres, leído entero). La segunda oración
  es justamente la afirmación sustantiva, chequeable y favorable del registro; el resto es una recomendación
  retórica. Tal como está, el registro sumaría el grupo `montevideo-comm` y quedaría habilitado a subir de
  `probable` a `publicado` con **una sola fuente para lo único que afirma**. Encima falla también (c): Montevideo
  Portal dice tomarlo de Subrayado. Y hay un matiz de sentido que solo trae la segunda fuente: ahí la
  recomendación de "no ceder" está dirigida "en alusión al próximo gobierno", no al suyo.
- cita_de_contexto: "'Yo recomendaría no ceder en este reclamo', **les dijo a los productores en alusión al
  próximo gobierno**." + "[Ancap está mejor] sin coincidencias en esta nota." —
  https://www.montevideo.com.uy/Noticias/-Jugamos-como-nunca-perdimos-como-siempre--Lacalle-por-libre-importacion-de-combustibles-uc881969
- accion_sugerida: O se parte el registro (uno con "Yo recomendaría no ceder…", que sí tiene dos fuentes; otro
  con "Ancap está mejor, que hace seis años", con `_faltante: segunda_fuente`), o se deja entero con
  `_faltante`. No puede quedar con montevideo-portal como segunda fuente de la cita completa. Para el
  Veracímetro, "Ancap está mejor que hace seis años" es contrastable con los **estados contables auditados de
  ANCAP 2018 y 2023-2024** (memorias anuales de ANCAP, y el balance auditado por Grant Thornton que el propio
  tramo 3 documenta en `hipotesis`); no lo verifiqué yo.

---

## Objeciones al lote

**1. Dependencia de El País: el lote no invierte el sesgo, pero se acerca más de lo que declara.**
De 17 registros nuevos (16 declaraciones + 1 mención), **14 tienen a El País como fuente** (t1: 7 de 9; t2: 5 de
5; t3: 3 de 3). Los tres que no: uno de Presidencia (t1[5]) y otro de El Observador que resultó ser reproducción
de Presidencia (t1[7]). Con fuente efectivamente única quedan **7 registros**: t1[0], t1[4], t1[6], t1[8] (los
cuatro `_faltante` con El País), t1[5] (Presidencia, `textual`), t1[7] (El Observador, `_faltante`) y la mención
de t2 (El País, `_faltante`). Es decir: **más del 40 % de los registros nuevos se apoyan en un único medio, y en
cinco de esos siete ese medio es El País.** El diagnóstico del tramo 1 ("de los 9 registros, 4 quedan con El País
como fuente única") es correcto pero se queda corto porque no cuenta los single-source de los otros dos tramos ni
el de El Observador.

**2. Ningún registro nuevo tiene dos testigos independientes.** Es el hallazgo transversal y no lo dice ninguna
de las tres `notas.md`. Los pares que existen son: dos medios reproduciendo el mismo tuit (t1[1]); un medio
citando al otro (t1[3], "según consignó El País"); tres medios desgrabando el mismo video de Telemundo (t2[0],
t2[1], t2[3]); dos medios desgrabando la misma entrevista de Subrayado (t3[0], t3[1], t3[2]); y un medio
reproduciendo la gacetilla de Presidencia (t1[7]). El sitio ya reconoció este patrón una vez
(`2022-05-28-espalda-ancap-termino.yaml`: "Dos grupos... pero un solo origen"), pero acá es el caso de todos.
No pide bloquear nada: pide que `notas_internas` lo diga registro por registro, y sobre todo que se persigan los
originales, porque **cuatro registros tienen video u audio localizable** (teledoce `lacalle-def.mp4`; entrevista
de Subrayado min. 29:40; audios de Presidencia del 16/09/2021 y del 28/05/2022) y con eso pasan a `textual` y
el problema desaparece.

**3. Sobrecorrección: sí hay, y está en el balance de qué se registró, no en el rigor.**
El encargo pedía vigilar que lo favorable no entrara con menos exigencia. El rigor formal fue parejo (las citas
existen, los `_faltante` están casi todos bien puestos). El desbalance está en la selección: de las 9
declaraciones del tramo 1, **una sola** es desfavorable (t1[3], "menos me gusta cuando tienen razón"); las otras
ocho son defensas del mecanismo de precios, reivindicaciones de gestión o gestos de apertura hacia el sindicato.
En el tramo 3, de tres registros dos son explicaciones de un incumplimiento en clave de "no me acompañaron" y
una es una reivindicación ("Ancap está mejor"). Esto no es necesariamente decisión del investigador: es lo que
pasa cuando se hace backfill de un solo medio `oficialista_tradicional` — se importa su selección junto con su
cobertura. Pero el efecto sobre el sitio es real y hay que compensarlo antes de promover, no después.
Dos correcciones concretas y baratas, ambas verificadas en fuentes que el propio lote leyó:
  - el registro t1[2] recupera su carga desfavorable en cuanto se le agrega el desmentido de Sosa (hoy omitido);
  - la promesa `no-aumentar-combustibles` gana varias evidencias `en_contra` (punto 4), que es donde más falta.

**4. La promesa `no-aumentar-combustibles` no documenta ni un solo aumento de precio, y este lote lo puede
arreglar.** Repasadas sus 9 evidencias publicadas: 5 `a_favor` (todas acciones de gobierno: no subir, mantener,
bajar), 2 `neutral` y 2 `en_contra` que son **declaraciones** de él admitiendo el incumplimiento. **Ninguna
evidencia registra un aumento efectivo**, y hubo por lo menos seis en el mandato. Una promesa calificada
`incumplida` cuyo expediente solo contiene los meses en que no subió es un problema de simetría en el registro
publicado, no en este lote — y este lote trae el material para corregirlo. Vía `content/correcciones/` con
`afecta: [promesas/lacalle-pou/no-aumentar-combustibles]`, corresponde sumar:
  - **2021-06-07, `en_contra`** — aumento del 12 % (nafta +$7,10, gasoil +$4,90). Cita literal verificada en El
    País. *(está en el `promesas.yaml` del tramo 1)*
  - **2021-06-30, `en_contra`** — segundo aumento consecutivo, que el lote **no registró**. Está documentado en
    una nota que el propio tramo 1 leyó: "El último ajuste en el precio del combustible comenzó a regir el 30 de
    junio, lo que significa un incremento en las tarifas por segundo mes consecutivo"
    (https://www.elpais.com.uy/informacion/politica/paganini-y-arbeleche-estan-estudiando-que-se-puede-hacer-con-precios-de-combustibles-dijo-lacalle-pou).
  - **2021-07-31, `en_contra`** — nafta +7,6 %, gasoil ~+11 %. Cita literal verificada. *(en el `promesas.yaml`)*
  - **2022-03-30, `en_contra`** — nafta +$3, gasoil +$5, con montos y con la brecha respecto del PPI ($7,54 /
    $15,22). Es la declaración t2[2] y **no está propuesta como evidencia de promesa**, siendo la mejor que hay.
  - **2024-03-01, `en_contra`** y **2025-02-01 (gasoil), `en_contra`** — documentadas con Presidencia + El País
    en `notas.md` del tramo 3, sección `hipotesis`, y hoy fuera de todo registro.
  - Del lado `a_favor`, las dos que el tramo 1 propone (2021-04-12 y 2021-05-07, ambas verificadas) más la serie
    2024-11-29 / 2025-02-28 del tramo 3. Con eso la promesa deja de saltar de 2023-06 a 2024-09 y cubre hasta el
    último decreto del mandato.
  - Corregir el "30,8 %" de la evidencia 2021-04-12 (ver t1[1]).
  Sumar solo las `a_favor` sería el error simétrico del que ya tiene el registro; van juntas o no van.

**5. Cobertura del período: los tres tramos dejan huecos y solo dos los declaran.**
  - **2020-04 a 2021-03** (once meses, primer año de pandemia): un solo registro en todo el rango (24/07/2020).
    El tramo 1 lo declara. Es el hueco más grande del mandato y coincide con el período en que se estaba
    definiendo el mecanismo de precios de la LUC.
  - **2022-06/07, 2022-09 a 2023-01, 2023-02 a 2023-05, 2023-09 a 2023-12**: el tramo 2 declara que no corrió
    barridos angostos y depende de un barrido amplio que se topó con el límite de 400 candidatas y quedó sesgado
    hacia nov-2022/ago-2023. O sea: para más de la mitad de su propio tramo la cobertura no está garantizada.
  - **2025-03 a 2026-09 (posmandato, 18 meses)**: el tramo 3 no encontró ninguna declaración propia y
    verificable después del 07/05/2025. Es plausible, pero conviene decirlo como resultado y no como silencio.
  - **Ningún registro nuevo de 2025.** El tramo 3 se anuncia como "2024 a 2025" y sus tres registros son del
    mismo día: 08/03/2024. El período 2025 queda cubierto solo por decretos de precios (sin cita) y por el
    registro ya publicado del 07/05/2025.
  - **Pre-2020 no lo cubre nadie.** El brief pide desde 1999. Los tres tramos arrancan en 2020-03. La campaña
    2019 y la etapa de oposición/senador están cubiertas por la corrida anterior, pero ningún tramo lo verifica
    ni lo declara como fuera de alcance con esas palabras. Que lo confirme el editor antes de dar el tema por
    barrido.

**6. Duplicados: no encontré ninguno.** Verifiqué los 16 registros nuevos contra las 30 declaraciones publicadas
de `lacalle-pou`, los 5 giros y las 4 promesas. Ninguno cubre un hecho ya publicado. Las coincidencias temáticas
(el criterio de la "espalda", la defensa del mecanismo) son hechos distintos en fechas distintas. El único
solapamiento real es el `promesas.yaml` del tramo 1, que no es duplicado de contenido sino reproducción
deliberada (objeción T1 promesas[0]).

**7. Las 8 candidatas a segunda fuente de registros ya publicados: verifiqué las 8, sirven 5.**

| Registro publicado | Nota de El País | ¿Sirve? | Efecto |
|---|---|---|---|
| `2021-07-20-bajo-petroleo-mensaje-ministros` | `paganini-y-arbeleche-estan-estudiando…` | **Sí** | Ya está `publicado`; suma el primer alineamiento `oficialista_tradicional` del registro. Cita verificada literal, incluida la variante "no cobrar combustibles **y no cobrar** otros servicios públicos" |
| `2022-01-25-mecanismo-luc-espalda-ancap` | `gobierno-cree-que-hay-espalda-todavia…` | **Sí** | Ya `publicado`; suma tercer grupo y `oficialista_tradicional`. Cita literal verificada |
| `2022-03-27-mecanismo-transparencia-no-paga-sobrecosto` | `lacalle-dijo-que-el-referendum-es-una-etapa-superada…` | **Sí** | **Es la que mueve de tier**: hoy `probable` con fuente única (subrayado / fontaina-de-feo); con El País pasa a dos grupos y dos alineamientos. Cita literal verificada: "Estamos convencidos de que es una medida de transparencia, que el uruguayo no paga sobrecostos" (coma en vez de "y", plural en "sobrecostos": diferencias que no rompen (b)) |
| `2022-05-28-espalda-ancap-termino` | `ajuste-en-precio-de-combustibles-se-termino-la-espalda…` | **Sí, con una salvedad de fecha** | Ver abajo |
| `2022-08-25-esperemos-poder-bajar-combustibles` | `esperemos-poder-bajar-por-lo-menos-algunos-combustibles…` | **Sí** | Hoy `probable` con fuente única (subrayado); con El País pasa a dos grupos. Cita literal verificada, casi idéntica |
| `2020-03-11-combustibles-no-suben-adecuacion-menor` | `anuncian-hoy-aumento-de-tarifas…` | **No** | El tramo 1 la descartó bien: la única cita citable es de Delgado, no de él. Falla (b) |
| `2021-11-16-deberiamos-haber-aumentado-ganancia-ancap` | — | **No existe** | Barrido de sitemap de nov-2021 sin resultado. El registro sigue `probable` con fuente única, y con él el giro `criterio-espalda-ancap-2021-2022` |
| `2023-01-31-ancap-soporta-no-hacer-suba` | dos notas de negocios | **No** | Las dos citan a Paganini. El tramo 2 lo identificó y no las usó: correcto |

**Verifiqué los tres descartes abriendo las notas, no los di por buenos.** Los tres están bien:
- `anuncian-hoy-aumento-de-tarifas…` (11/03/2020, 00:21) sí cita a Lacalle Pou, pero sobre la sequía y el dólar
  ("Está realmente brava la sequía"; "Preocupa la suba del dólar"), no sobre combustibles; lo de combustibles es
  de Delgado. Además es de la víspera: "Hoy el gobierno de la coalición de partidos anunciará una suba".
- `esta-sobre-la-mesa-no-aumentar…` y `el-poder-ejecutivo-decidio-mantener-el-precio…` (31/01/2023): en las dos,
  `--buscar "Lacalle"` devuelve "sin coincidencias en esta nota". La segunda es el caso didáctico del riesgo: dice
  casi lo mismo que el registro publicado ("Ancap puede sostenerla bien esta decisión porque tiene márgenes para
  sostenerse") **en boca de Paganini**. La coincidencia semántica es casi total y aun así no sirve, porque la
  prueba (b) es sobre quién lo dijo, no sobre qué se dijo.

Que el tramo 1 documentara dos "segundas fuentes falsas" en vez de usarlas, y el tramo 2 una tercera, es lo que
hay que reconocer; el problema es que otros dos casos del mismo tipo (t2[2] Mercedes, t3[2] "Ancap está mejor")
sí se colaron dentro de los registros nuevos, donde el filtro no se aplicó con el mismo cuidado que en la lista
de candidatas.

Bonus del descarte de 2023: esa nota revela que la decisión la comunicó Paganini "en declaraciones a la prensa
consignada por Subrayado (Canal 10)". El registro publicado `2023-01-31-ancap-soporta-no-hacer-suba` está en
`probable` con fuente única de infobae, que las `notas_internas` describen como "agregador que levanta de
Subrayado": la segunda fuente que le falta es la **nota original de Subrayado del 31/01/2023**, no El País.

**Salvedad del `2022-05-28`.** La nota de El País dice dos veces "ayer" ("afirmó ayer en Juan Lacaze"; "Ayer,
tras la inauguración de la Línea del Plata…") y su sello es 28/05/2022 17:08, lo que ubicaría la rueda de prensa
el viernes 27. Pero El Observador dice "este sábado" y **la fuente primaria zanja la fecha del acto**:
Presidencia publica "afirmó el presidente de la República, Luis Lacalle Pou, **este sábado 28** en el puerto de
Juan Lacaze, donde se inauguró el buque Expreso del Plata I"
(https://www.gub.uy/presidencia/comunicacion/noticias/lacalle-pou-participo-presentacion-buque-transportara-camiones-carga-entre).
No lo registro como discrepancia (ver más abajo): el "ayer" de El País es consistente con una publicación del
domingo 29 y no puedo descartar que el sello sea la hora de subida online de una pieza de papel. Antes de sumar
esta fuente el editor tiene que fijar la fecha; y esa misma página de Presidencia enlaza el audio "Declaraciones
del presidente de la República, Luis Lacalle Pou, a la prensa", que llevaría el registro a `textual` y resolvería
las dos cosas de una vez.

**8. Alineamiento.** Sumando lo nuevo, el tema pasa a tener por primera vez fuentes `oficialista_tradicional` —
que era el objetivo. Pero sigue sin tener **ninguna** fuente `progresista` (Brecha, La República, Caras y
Caretas aparece una sola vez, en un registro ya publicado) ni `independiente` (la diaria: intentada dos veces,
paywall y falta de cita). El brief pide probar los tres. El tramo 2 lo intentó con la diaria; los tramos 1 y 3
no dejan constancia de haber probado Brecha ni La República en ninguna ventana. Si el objetivo es equilibrio de
alineamientos y no solo agregar El País, ese barrido falta.

**9. Higiene de ids: el tramo 1 no puso `_slug` en ninguna declaración.** Los tramos 2 y 3 sí. Sin `_slug`, el id
se deriva de `slugificar(resumen)`: el registro t1[0] quedaría como
`lacalle-pou/2020-07-24-durante-recorrida-oficial-puerto-paysandu-tras`. Hay que agregar `_slug` a las nueve
antes de promover. Además, el tramo 3 usa `cargo_en_ese_momento: presidente de la República` mientras todo el
resto del corpus usa `presidente`; unificar.

---

## Objeciones al brief

**Ninguna de Regla 0 en el brief.** Lo leí completo. Pide expresamente cubrir el período entero y "todo lo que la
persona dijo sobre el tema, favorable o desfavorable, consistente o contradictorio", pide registrar también lo
consistente (`sin_cambio`), y su regla 5 es explícitamente simétrica: manda buscar alineamiento distinto en las
dos direcciones (El País *y* Brecha/La República/Búsqueda), no en una. No hay ningún pedido de omitir, encuadrar
o seleccionar por partido, ideología o persona.

Dos observaciones que no son violaciones pero afectan el resultado:

- **El brief es correcto y aun así produce un lote sesgado en la selección**, porque la instrucción operativa
  fuerte ("para El País no alcanza con WebSearch, usá `pnpm descubrir`") solo tiene contraparte procedimental
  para El País. Para Brecha y La República el brief dice "probá", sin herramienta ni verificación. El resultado
  previsible —y observado— es que el backfill se ejecute contra un solo medio. Sugerencia para el próximo
  brief: exigir que `notas.md` declare, para cada ventana temporal, qué medios de cada alineamiento se barrieron
  y con qué resultado, de modo que "no hay cobertura" quede distinguible de "no busqué ahí". Es la misma lección
  que originó esta corrida, aplicada a los otros dos alineamientos.
- **Las pistas del §6 no corresponden a este tema.** Las dos son de `transparencia-corrupcion` (Cardama; el acto
  de la lista 40 de 2019). Cargarlas en el brief de combustibles gasta atención del investigador en material que
  no puede registrar. No es un problema de objetividad, es de ruido.

---

## Discrepancias contra fuente primaria

**No registro ninguna, y `discrepancias.yaml` no se crea.** Encontré dos candidatas y las dos fallan mi propio
umbral, así que las dejo acá en vez de forzarlas:

1. **El País, 28/05/2022, fecha del acto de Juan Lacaze.** Tengo la fuente primaria (Presidencia:
   "este sábado 28") y tengo lo publicado ("afirmó ayer en Juan Lacaze"). Lo que no puedo establecer es que El
   País haya afirmado una fecha equivocada: si la pieza se publicó el domingo 29, "ayer" es correcto y lo que
   está mal es el sello de la página. Registrar una discrepancia sobre esa ambigüedad sería inflar un hallazgo.
   Queda como salvedad para el editor (punto 7).
2. **El País, 14/12/2021, titular "No hay motivos aparentes para generar un paro de esa dimensión".** El cuerpo
   dice "algunas huelgas que, **aun teniendo un motivo**, no tienen razones aparentes…", o sea el entrecomillado
   del titular no es contiguo y borra la concesiva. Sería `titular_no_respaldado`, pero el que decide es el audio
   o el registro de la rueda de prensa, y no lo encontré (busqué en gub.uy y en web). Titular contra cuerpo del
   mismo diario no es fuente primaria. Queda como objeción del registro t1[8].

Sobre el umbral simétrico: las dos candidatas son de El País, que es el medio que este lote está incorporando y
el único `oficialista_tradicional` del sitio. Para no dejar eso como un sesgo por omisión, contrasté también la
nota de El Observador del 11/10/2021 contra la misma gacetilla de Presidencia que reproduce, palabra por
palabra: las únicas diferencias son "Dirección **Nacional** de Seguridad Rural" y "MGAP" por "Ministerio de
Ganadería". Trivial, no registrable — y lo digo justamente para dejar constancia de que apliqué el mismo
control al medio del otro lado.

---

## Cobertura

**30 notas de prensa leídas** con `pnpm fuente` en esta sesión; **27 registros de tono** en
`cobertura.yaml` de esta misma carpeta. Las tres excluidas, con el motivo:

- `elpais.com.uy/negocios/gobierno-anuncio-aumento-de-combustibles-del-12` (2021-06-07) y
  `.../el-gobierno-subio-7-6-las-naftas-y-casi-11-el-gasoil…` (2021-07-31): **no mencionan a Lacalle
  Pou** —el corpus las etiqueta `politicos []`— y citan a Paganini y Arbeleche. Sin político ni
  partido tratado no hay tono que medir. (Sirven igual como evidencia de promesa, que no exige cita
  del político.)
- `subrayado.com.uy/…-n839481` (2022-02-16): la abrí para descartar una segunda fuente y no leí su
  cuerpo. Asignarle tono sería inventarlo.

Tampoco genero registros para las cuatro páginas de `presidencia`/gub.uy: son documentos oficiales,
no notas de prensa.

**Resultado: 3 favorable, 24 neutral, 0 desfavorable.** Por medio: el-pais 17, el-observador 5,
montevideo-portal 4, teledoce 1.

Ese 0 en `desfavorable` hay que leerlo con cuidado, y por eso lo explicito: **no es un dato sobre la
prensa uruguaya, es un dato sobre el muestreo de este lote.** 22 de las 27 notas puntuadas son de El
País o El Observador, ninguna es de un medio `progresista` y ninguna de un `independiente`. Un
conjunto de notas elegido por haber cubierto lo que dijo un presidente, y extraído sobre todo del
sitemap del diario `oficialista_tradicional`, no puede producir otra distribución.

Los tres `favorable` son los únicos casos en que el medio **evalúa en voz propia y no en boca de una
fuente citada**: dos crónicas de El País (la caracterización personal en Cerrillos, la comparación de
temples en Minas) y una de El Observador (que aporta por su cuenta el respaldo fáctico de la
acusación del presidente al gobierno anterior). Aplicando el mismo umbral en la otra dirección, **no**
marqué `desfavorable` la nota de El País del 02/06/2021 pese a que su eje es una acusación de mentir
al presidente: la acusación es de un tercero citado y la nota reproduce su respuesta completa. Si
hubiera bajado el umbral para conseguir alguna `desfavorable` y equilibrar el cuadro, habría tenido
que bajarlo también para las favorables, y el registro dejaría de medir nada.

Dos eventos propuestos, ninguno existe en `content/eventos/`:
- `propuesto:mecanismo-precios-combustibles-luc` — creación (ley 19.889) y operación del mecanismo de
  fijación de precios por PPI + sobrecostos de ANCAP, 2021-2025.
- `propuesto:asociacion-portland-ancap` — proceso de asociación con privados de la división portland
  de ANCAP, 2020-2023 (Paysandú, Minas, licitación).

---

## Resumen de severidades

- **bloquea (3):** T1 declaraciones[2] (desmentido de Sosa omitido); T1 promesas[0] (duplicaría la promesa
  publicada, `promover` no lo frena); T3 declaraciones[2] (segunda fuente falsa).
- **corregir (10):** T1 [0], [1], [3], [5], [7], [8]; T2 [0], [2], menciones[0]; T3 [1].
- **aviso (5):** T1 [4], [6]; T2 [1], [3]; T3 [0].
- **sin objeción de fondo (3, dentro de los `aviso`):** T1 [4], T1 [6] y T2 [3]. En los tres la cita es literal,
  el `resumen` es fiel y el `_faltante` está bien puesto; el `aviso` es información para el editor (una candidata
  a segunda fuente en la diaria, una afirmación chequeable, un origen único), no una objeción al registro.

**Cobertura de la verificación: abrí 32 de las 33 citas del lote y 31 son literales en su propia nota.** La
excepción es la de montevideo-portal en T3 declaraciones[2] ("Ancap está mejor, que hace seis años"), que
directamente no está en esa nota. La única que no abrí es el `origen` de la promesa reproducida (subrayado,
30/03/2019), porque es copia textual del registro ya publicado y no material nuevo.

O sea: **el problema de este lote no es la literalidad, que funcionó.** Es lo que se pone alrededor de la cita —
qué contexto se omite (t1[2], t1[8]), qué frase se elige como cita principal (t1[0], t1[5]) y qué se cuenta como
segunda fuente (t2[2], t3[2]).
