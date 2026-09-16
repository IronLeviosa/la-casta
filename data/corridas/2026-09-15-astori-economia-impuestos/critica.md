# Crítica — corrida 2026-09-15-astori-economia-impuestos

Lote: inbox/astori/economia/impuestos/2026-09-15/
Registros revisados: 22 (14 declaraciones, 5 chequeos, 3 promesas, 0 menciones). Sin muestra: el lote tiene menos de 40 registros y no lo generó un script, así que se revisó ficha por ficha.

Fuentes releídas con `pnpm fuente` en esta crítica: las 14 URLs citadas por los registros más 8 notas que el lote abrió y descartó sin cargar nada (El Observador 2016-05-25, 2022-03-05 y 2023-11-10; Caras y Caretas 2017-02-21; Montevideo Portal 2024-04-22; La República 2001-05-24; El País 2016-06-28; Subrayado 2019-04-23). No se releyó la nota de la diaria del 2022-07-28, que el lote usa solo para `trayectoria_fuera_del_estado` y no respalda ningún registro.

## Resumen

```yaml
- registro: declaraciones[0]        # 2005-11-07 · IVA al 20%
  severidad: sin_objecion
  tipo: sin_objecion
  motivo: cita literal y contigua, atribución verificada (el transcripto rotula «MINISTRO ASTORI») y el condicional «apenas podamos» se conserva en el resumen.
- registro: declaraciones[1]        # 2014-05-24 · no habrá ajuste fiscal
  severidad: bloquea
  tipo: cita_fuera_de_contexto
- registro: declaraciones[2]        # 2015-05-06 · 65.000 trabajadores
  severidad: corregir
  tipo: cita_fuera_de_contexto
- registro: declaraciones[3]        # 2015-06-08 · Dolores
  severidad: aviso
  tipo: explicacion_alternativa
- registro: declaraciones[4]        # 2015-06-26 · Foro ACDE
  severidad: sin_objecion
  tipo: sin_objecion
  motivo: cita entre comillas en el documento oficial, contigua y completa; el resumen no agrega nada que la fuente no diga.
- registro: declaraciones[5]        # 2016-05-26 · suba del IRPF
  severidad: corregir
  tipo: cita_fuera_de_contexto
- registro: declaraciones[6]        # 2016-08-04 · «el anuncio no se cumplió»
  severidad: corregir
  tipo: contexto_omitido
- registro: declaraciones[7]        # 2016-08-04 · esperanza de no repetir
  severidad: bloquea
  tipo: un_solo_grupo
- registro: declaraciones[8]        # 2016-08-04 · 17 % pagará más
  severidad: bloquea
  tipo: un_solo_grupo
- registro: declaraciones[9]        # 2016-08-11 · respuesta al FA
  severidad: aviso
  tipo: un_solo_grupo
- registro: declaraciones[10]       # 2017-03-23 · sincera intención
  severidad: corregir
  tipo: contexto_omitido
- registro: declaraciones[11]       # 2018-05-24 · Rendición 2018
  severidad: corregir
  tipo: riesgo_legal
- registro: declaraciones[12]       # 2020-03-13 · aumento oculto
  severidad: corregir
  tipo: documento_previsible
- registro: declaraciones[13]       # 2023-03-03 · US$ 100 millones
  severidad: corregir
  tipo: riesgo_legal
- registro: chequeos[0]             # IVA al 20 %
  severidad: corregir
  tipo: presentacion
- registro: chequeos[1]             # 65.000 trabajadores
  severidad: corregir
  tipo: documento_previsible
- registro: chequeos[2]             # IRPF 15 % → 18 %
  severidad: corregir
  tipo: documento_previsible
- registro: chequeos[3]             # 17 % / 67 %
  severidad: corregir
  tipo: documento_previsible
- registro: chequeos[4]             # US$ 100 millones
  severidad: corregir
  tipo: documento_previsible
- registro: promesas[0]             # no aumentar la carga tributaria (2014)
  severidad: bloquea
  tipo: cita_fuera_de_contexto
- registro: promesas[1]             # bajar el IVA al 20 % (2005)
  severidad: corregir
  tipo: contexto_omitido
- registro: promesas[2]             # no volver a modificar el sistema (2016)
  severidad: corregir
  tipo: asimetria
```

## Objeciones por registro

### declaraciones[1] — 2014-05-24 — «Descartó enfáticamente que el próximo gobierno tenga que hacer un ajuste fiscal…»
- severidad: bloquea
- tipo: cita_fuera_de_contexto
- objecion: la `cita` no es de Astori. Es la bajada del periodista, en tercera persona, resumiendo la entrevista («Descartó enfáticamente que… dijo que…»). La nota trae las palabras textuales de Astori sobre lo mismo, y dicen algo más matizado que el resumen del cronista: él define primero qué entiende por ajuste fiscal y recién ahí lo niega, y sobre la carga tributaria habla de la **media**, con la salvedad expresa de que algunos van a pagar más. Publicar como «cita» de una persona la síntesis del periodista, existiendo sus palabras en la misma página, es lo que el registro no puede hacer; además arrastra el problema a `promesas[0]`, que se construye sobre esa misma frase.
- cita_de_contexto: "La expresión ajuste fiscal está históricamente asociada a una contención generalizada y casi indiscriminada del gasto público y a una carga impositiva creciente. […] Si ese es el concepto de ajuste fiscal niego enfáticamente que vaya a haber ajuste fiscal. ¡No va a haber ajuste fiscal en el país, no va a haber ajuste fiscal!" y "Nosotros queremos disminuir la carga tributaria media que tiene la población beneficiando especialmente a los que más lo necesitan." — https://www.elobservador.com.uy/nota/-no-habra-un-ajuste-fiscal-y-se-reducira-la-carga-tributaria-media--201452419460
- accion_sugerida: reemplazar la `cita` por uno de los dos pasajes literales de Astori (son contiguos y superan los 20 caracteres) y ajustar el `resumen` para que diga «carga tributaria media». El `_faltante: segunda_fuente` sigue en pie; la entrevista es propia de El Observador, así que la segunda fuente de otro grupo quizá no exista y eso también es información para el editor.

### declaraciones[2] — 2015-05-06 — «65.000 trabajadores con ingresos inferiores a 27.000 pesos dejarán de pagar el impuesto»
- severidad: corregir
- tipo: cita_fuera_de_contexto
- objecion: dos cosas. (a) La `cita` es la redacción de la gacetilla en tercera persona, no las palabras de Astori: la oración completa empieza «El ministro Danilo Astori informó en conferencia de prensa que… 65.000 trabajadores… dejarán de pagar el impuesto». El registro está en `nivel: textual`, que quiere decir «lo dijo con esas palabras»; acá no hay ninguna palabra suya entrecomillada en toda la página. (b) La misma gacetilla dice de dónde salen los recursos para financiar la rebaja, y eso el registro no lo recoge: se reinstala un impuesto. En un lote cuyo eje es «no íbamos a subir impuestos», que el anuncio de una exoneración venga financiado con la reinstalación de otro tributo es contexto que el lector necesita, y juega en los dos sentidos.
- cita_de_contexto: "Informó asimismo que parte de los recursos para enfrentar esta renuncia fiscal surgirán de la reinstalación del Impuesto de Primaria a productores agropecuarios que estaban exonerados." — https://www.gub.uy/presidencia/comunicacion/noticias/astori-informo-65000-trabajadores-dejaran-pagar-irpf
- accion_sugerida: la misma página enlaza el audio oficial de la conferencia («Audios 65.000 trabajadores con ingresos inferiores a 27.000 pesos dejarán de pagar el IRPF»); transcribirlo con `pnpm transcribir` da la frase en primera persona y sostiene el `textual`. Si no se transcribe, el registro sigue siendo válido citando la gacetilla, pero el `resumen` tiene que dejar claro que la formulación es del comunicado oficial y no una cita del ministro. Sumar una oración al `resumen` con la reinstalación del Impuesto de Primaria.

### declaraciones[3] — 2015-06-08 — «No solo no proyectamos incrementar la carga tributaria en la producción nacional…»
- severidad: aviso
- tipo: explicacion_alternativa
- objecion: no hay objeción a la cita (está entrecomillada y contigua en el documento oficial). Lo que dejo escrito, aunque no me convenza del todo, es la lectura inocente que el editor tiene que descartar por escrito antes de armar el giro: las promesas de 2015 que este lote recoge hablan de la carga tributaria **sobre la producción** (esta y, en parte, la de 2017: «sobre la producción, sobre el nivel de actividad, el empleo y el ingreso»), mientras que la suba de 2016 recayó sobre el IRPF y el IASS, es decir sobre las rentas personales. Quien defienda a Astori dirá que no incumplió *esta* frase. Contra esa lectura juega `declaraciones[4]` (ACDE), donde extiende la promesa a «la sociedad en su conjunto», y sobre todo la propia admisión de 2016. La otra explicación alternativa —el cambio de contexto regional— está en boca del propio Astori y hay que citarla, no parafrasearla.
- cita_de_contexto: "Hoy tenemos una circunstancia internacional compleja y tendremos que prestar mucha atención a la tributación desde el punto de vista fiscal pero no aumentando impuestos" — https://www.gub.uy/presidencia/comunicacion/noticias/astori-descarto-enfaticamente-incrementar-carga-tributaria-produccion
- accion_sugerida: al armar el giro, decir en `explicacion` cuál de las dos formulaciones se compara y por qué, y citar la justificación de Astori desde la versión taquigráfica (no desde la crónica): en la interpelación atribuyó el cambio a «influencias negativas de Brasil por inconvenientes internos de ese país, y problemas importantes en la Argentina», según recoge El Observador del 2022-03-05 diciendo expresamente que lo toma de la versión taquigráfica (https://www.elobservador.com.uy/nota/promesa-incumplida-el-argumento-de-lacalle-y-una-similitud-con-lo-que-criticaba-a-vazquez-y-astori-20223420470). Ese pasaje está en el PDF que el lote ya abrió.

### declaraciones[5] — 2016-05-26 — «Hay que tener en cuenta la forma en la que se liquida el impuesto a la renta…»
- severidad: corregir
- tipo: cita_fuera_de_contexto
- objecion: la cita corta a mitad de oración, justo antes de la subordinada que completa el argumento. Tal como queda, la frase termina en «no está afectando solo a la franja que elimina» y el lector no se entera de qué sí afecta, que es todo el razonamiento. No cambia el sentido, pero lo deja trunco. Además, el `resumen` incorpora los números («del 15% al 18%», «$33.401 y $50.100») que no están en boca de Astori en ningún pasaje citado de la nota: son de la bajada del diario. Eso es lo que después hace que `chequeos[2]` chequee una frase que la persona no dijo.
- cita_de_contexto: "…si uno elimina franjas no está afectando solo a la franja que elimina sino a la liquidación de todo el impuesto porque, digamos, dejar de cobrar impuesto en determinada franja, y lo hemos hecho para la de más abajo, es que dejen de contribuir por esa franja de ingresos todos los contribuyentes." — https://www.elpais.com.uy/informacion/astori-no-se-puede-evitar-subir-irpf-a-salarios-entre-33-401-y-50-100
- accion_sugerida: extender la cita hasta el final de la oración. Atribuir en el `resumen` los montos y las tasas a la nota («según El País, el aumento del IRPF del 15% al 18%…») o, mejor, buscar la entrevista original: la nota dice «dijo Astori en radio Carve», y `radio-carve` ya está en `content/medios/` (grupo casa-zorrilla), lo que daría un registro primario y una segunda fuente de otro grupo de un saque.

### declaraciones[6] — 2016-08-04 — «Cuando dijimos «no vamos a poner más impuestos», era porque no queríamos hacerlo…»
- severidad: corregir
- tipo: contexto_omitido
- objecion: la cita corta en «como lo estoy haciendo en este momento», y la oración sigue con un «pero» que es su defensa. Dos párrafos antes está además la distinción sobre la que apoya todo su argumento —anunciar en la actividad política no es asumir un compromiso institucional— y la pregunta retórica sobre la mentira. El registro es el más fuerte del lote y va a ser el más leído; publicarlo sin el resto de la oración lo deja mejor de lo que el propio texto lo deja. El mismo criterio valdría si la frase fuera de cualquier otro político.
- cita_de_contexto: "Una cosa es anunciar, como parte de la actividad política pública que todos tenemos, que no vamos a poner más impuestos, y otra cosa es asumir un compromiso institucional en el Senado. ¿Pretendimos mentir cuando dijimos eso con el presidente Vázquez? Créame, señor presidente: en absoluto. […] Hay que reconocer que el anuncio no se cumplió, como lo estoy haciendo en este momento, pero a quienes me están escuchando les pido que no tengan la más mínima duda de que no hubo intención de mala fe, en absoluto." — https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescss/2016-08-04%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20SENADORES%20(0026).pdf
- accion_sugerida: extender la `cita` hasta «no hubo intención de mala fe, en absoluto» (es contigua) o, si se prefiere dejarla corta, que el `resumen` diga que en la misma intervención sostuvo que no hubo mala fe. Al cotejar la nota de El País, marcar `literalidad: difiere`: el diario publica entre comillas «Cuando dijimos que no iba a haber más impuestos era que no queríamos poner más impuestos», y la versión taquigráfica dice «Cuando dijimos «no vamos a poner más impuestos», era porque no queríamos hacerlo. Esa era nuestra voluntad política». El sentido se mantiene; la redacción no coincide.

### declaraciones[7] — 2016-08-04 — «No quisiera seguir modificando el sistema impositivo…»
- severidad: bloquea
- tipo: un_solo_grupo
- objecion: la frase está en la versión taquigráfica **que el propio lote abrió y cita en `declaraciones[6]`**, y sin embargo el registro cita solo la crónica de El País, queda en `reportado` con un grupo y se va a `probable` pidiendo una segunda fuente que la regla no le exigiría. Es exactamente lo que `declaraciones.md` manda evitar. Y la versión del diario no coincide palabra por palabra con la taquigráfica: El País publica «no tengamos que volver a hacer otra» y une dos pasajes con «(…)»; el original dice «no tengamos que hacer otra» y entre medio hay una oración que el diario no trae.
- cita_de_contexto: "Esto se dijo de buena fe, como digo ahora de buena fe que no quisiera seguir modificando el sistema impositivo. Esa es mi voluntad a la luz de la realidad actual. Y mi esperanza es que esta corrección fiscal sea suficiente en el país y no tengamos que hacer otra." — https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescss/2016-08-04%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20SENADORES%20(0026).pdf
- accion_sugerida: pasar la fuente primaria (mismo PDF, mismo id de fuente que `declaraciones[6]`) a `evidencia.fuentes[]` con la cita de arriba, subir el nivel a `textual`, quitar el `_faltante: segunda_fuente` y dejar la nota de El País como cobertura con `verificada_en` y `literalidad: difiere`.

### declaraciones[8] — 2016-08-04 — «solo el 17% de los trabajadores y pasivos pagará más, el 67% no paga ni pagará»
- severidad: bloquea
- tipo: un_solo_grupo
- objecion: mismo caso que el anterior, agravado porque acá el dato es el que después se chequea. La cifra está en la versión taquigráfica, dicha mientras Astori mostraba una lámina, y el original trae un tercer número que el registro pierde: el 15 % que paga lo mismo. Con solo el 17 % y el 67 %, las cuentas del lector no cierran (17 + 67 = 84) y parece que falta información; con el 15 % cierran. Publicar la cifra recortada por la crónica, teniendo el original abierto, deja el registro en `probable` sin necesidad y empeora el chequeo que cuelga de él.
- cita_de_contexto: "La gráfica que estamos viendo en pantalla nos muestra que solo el 17 % de los trabajadores y pasivos pagará más impuestos que en la actualidad. El 67 % de los trabajadores y pasivos no paga ni pagará impuesto. Luego, el 15 % paga lo mismo, y solamente el 17 % de trabajadores y pasivos –insisto– va a pagar un poco más de lo que paga hoy." — https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescss/2016-08-04%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20SENADORES%20(0026).pdf
- accion_sugerida: reemplazar la cita por el pasaje completo de la taquigráfica, subir a `textual`, y actualizar `fragmento` y `afirmacion` de `chequeos[3]` para que incluyan el 15 %. La nota de El País queda como cobertura con `literalidad: condensada`.

### declaraciones[9] — 2016-08-11 — «creemos que la carga tributaria no debería seguir incrementándose…»
- severidad: aviso
- tipo: un_solo_grupo
- objecion: fuente única (El País, grupo scheck-aguirre) y el registro lo declara. No hay problema de contexto: la nota deja claro a quién le contestaba y el resumen lo dice. Lo que sí es evitable es el `_faltante`: la propia nota informa que las declaraciones se hicieron a Canal 4, y ese canal está en la tabla de medios (`telenoche`, grupo monte-carlo-romay-salvo).
- cita_de_contexto: "opinó el ministro Astori al ser consultado por canal 4" — https://www.elpais.com.uy/informacion/astori-al-fa-no-deberia-aumentar-carga-tributaria
- accion_sugerida: buscar la nota o el video de Telenoche del 2016-08-10/11 antes de cerrar el registro como fuente única; si no aparece, dejar el `_faltante` y decir en `notas.md` que se buscó.

### declaraciones[10] — 2017-03-23 — «Nuestra sincera intención es no aumentar la carga tributaria…»
- severidad: corregir
- tipo: contexto_omitido
- objecion: el `resumen` dice que «reafirmó los dichos de Vázquez de que no estaba en los planes del gobierno aumentar la carga tributaria», y la nota dice algo más matizado: que Vázquez había dejado la puerta abierta. La propia frase siguiente de Astori tampoco es un compromiso, es una apreciación («no debería ser necesario»). Tal como está, el registro afirma más de lo que la fuente respalda, y en un lote cuyo eje es el incumplimiento de promesas, sobredimensionar la firmeza de la promesa es el error que más hay que cuidar.
- cita_de_contexto: "Si bien el presidente Tabaré Vázquez había afirmado que no estaba en los planes del gobierno aumentar la carga tributaria, en su momento dejó abierta esa puerta cuando dijo que \"de aumentar, no recaería en la clase media\"." y "La carga tributaria, señaló, \"está un límite que no conviene aumentar, y no debería ser necesario aumentar\"." — https://www.elobservador.com.uy/nota/astori-la-carga-tributaria-esta-en-un-limite-que-no-conviene-aumentar--201732311280
- accion_sugerida: reescribir el `resumen` recogiendo el matiz («intención», «no debería ser necesario»). La nota dice que habló en En Perspectiva: `en-perspectiva` está en `content/medios/` (grupo lecueder-cotelo) y el programa publica audio y resúmenes, así que ahí hay registro primario y segundo grupo a la vez.

### declaraciones[11] — 2018-05-24 — «El espacio fiscal propuesto por el Ministerio de Economía es cero…»
- severidad: corregir
- tipo: riesgo_legal
- objecion: el `titulo` y el `resumen` le atribuyen a Astori haber «descartado aumentar la carga impositiva», y la nota no le atribuye eso a él: se lo atribuye al gobierno y lo sostiene en «según supo El País», es decir en información propia del diario sin fuente identificada. Lo que la nota sí pone en boca de Astori, y en estilo indirecto, es el espacio fiscal cero. El registro afirma más de lo que la fuente respalda y convierte un trascendido en un dicho de la persona. El mismo problema se traslada a `promesas[2]`, que usa esta nota como evidencia `a_favor`.
- cita_de_contexto: "A pesar de los pedidos de mayor presupuesto para llegar al 6% del Producto Interno Bruto (PIB) para la educación, el gobierno descartó la posibilidad de aumentar la carga impositiva, según supo El País." — https://www.elpais.com.uy/informacion/politica/rendicion-no-subiran-mas-los-impuestos
- accion_sugerida: acotar `titulo` y `resumen` al espacio fiscal cero, que es lo atribuido a Astori en rueda de prensa, y dejar el «no subirán los impuestos» como lo que es: información del diario. Si se quiere el hecho con respaldo, la exposición de motivos de la Rendición de Cuentas 2018 (MEF, proyecto de ley remitido el 30 de junio de 2018) dice si hubo o no cambios tributarios.

### declaraciones[12] — 2020-03-13 — «Se ha disminuido en 2 puntos la ventaja tributaria del IVA…»
- severidad: corregir
- tipo: documento_previsible
- objecion: la cita trae dos datos duros (2 puntos de rebaja del descuento del IVA por débito; de 9 a 5 puntos en gastronomía) y ninguno tiene chequeo, mientras que la afirmación equivalente de 2023 sobre el mismo episodio sí lo tiene. El documento que decide es previsible y público: los descuentos salen de la ley 19.210 y sus decretos reglamentarios, y la modificación de marzo de 2020 se publicó en IMPO. Por otro lado, la fuente única es el sitio del propio partido de la persona; está declarado como `_faltante`, y corresponde, pero también corresponde intentar la segunda fuente antes de cerrar.
- cita_de_contexto: "«Se ha disminuido en 2 puntos la ventaja tributaria del IVA en las compras con tarjeta de débito y se ha rebajado la ventaja tributaria de 9 a 5 puntos en el consumo de servicios gastronómicos» detalló Astori, lo que para él «es un aumento de impuestos» oculto" — https://frenteamplio.uy/noticias/12-noticias/1551-danilo-astori-hay-un-aumento-oculto-de-los-impuestos
- accion_sugerida: cargar un chequeo con el decreto de marzo de 2020 que modificó los descuentos de IVA de la ley 19.210 (IMPO, `impo.com.uy`), que fija los puntos exactos. Para la segunda fuente, `pnpm descubrir elpais.com.uy --desde 2020-03 --hasta 2020-04 --terminos Astori,IVA,impuestos` y la nota de En Perspectiva del 2020-05-08 que el corpus ya tiene sin abrir.

### declaraciones[13] — 2023-03-03 — «contrariando lo que se había anunciado en la campaña electoral…»
- severidad: corregir
- tipo: riesgo_legal
- objecion: el registro pone en circulación dos afirmaciones sobre un tercero —que el gobierno de Lacalle Pou subió impuestos por US$ 100 millones y que lo hizo contra lo anunciado en campaña— con la sola palabra de un adversario político y sin documento. Como declaración está bien encuadrada (es lo que dijo Astori, con su nombre), pero el `resumen` la relata en voz propia («recordó que ese gobierno había subido los impuestos por US$ 100 millones»), lo que la afirma en vez de atribuirla. «Recordó» presupone que el hecho ocurrió. El mismo cuidado se le debe a cualquier persona.
- cita_de_contexto: "Por otro lado, Astori dijo que \"ahora se está haciendo mucha difusión y comentarios sobre el alivio de 150 millones\", pero que \"contrariando lo que se había anunciado en la campaña electoral, a poco de asumir el gobierno se aumentaron los impuestos en un total de 100 millones de dólares\"." — https://www.elobservador.com.uy/nota/astori-dijo-que-la-rebaja-del-irpf-y-del-iass-va-para-poca-gente-y-recordo-el-aumento-de-impuestos-a-comienzos-del-gobierno--202333145022
- accion_sugerida: cambiar «recordó» por «afirmó» o «sostuvo» en el `resumen`. Para la parte de campaña, el sitio ya tiene publicadas las declaraciones de Lacalle Pou que sirven de ancla verificable (`content/declaraciones/lacalle-pou/2019-03-30-termino-aumento-impuestos-tarifas-combustibles.yaml` y `2020-08-26-no-vamos-aumentar-impuestos.yaml`): enlazarlas es mejor que afirmarlo. En la misma nota queda otro dato de Astori sin chequear, «esta renuncia fiscal… es el 0,25% del PBI», que tiene documento previsible (informe del Consejo Fiscal Asesor y exposición de motivos del MEF).

### chequeos[0] — 2005-11-07 — «El gobierno se proponía reducir la tasa básica del IVA al 20%»
- severidad: corregir
- tipo: presentacion
- objecion: la `afirmacion` no es un dato, es una promesa, y `chequeos.md` lo excluye expresamente («nunca una opinión ni una promesa»). Además duplica `promesas[1]`, que registra exactamente lo mismo con la misma cita y la misma evidencia: el lector va a ver dos veces el mismo hecho, una con veredicto de Veracímetro y otra con estado de promesa. Y hay un problema de fondo: la promesa es condicional («apenas podamos»; la ley la ata a que los resultados «aseguren el cumplimiento de los compromisos presupuestales»), y el `dato_real` la juzga por el resultado sin decir nada sobre si la condición se cumplió.
- cita_de_contexto: "El Poder Ejecutivo reducirá gradualmente la tasa básica del tributo hasta alcanzar el 20% (veinte por ciento) cuando los resultados de la aplicación de la presente ley aseguren el cumplimiento de los compromisos presupuestales asumidos en relación al resultado fiscal." — https://www.bcu.gub.uy/Acerca-de-BCU/Normativa/Documents/Servicios-Financieros/Seguros/Leyes-y-Decretos/Leyes-y-Decretos-relativos-al-regimen-de-triubutacion-de-las-entidades-aseguradoras/Impuesto-al-valor-agregado(IVA)/titulo10dgi.pdf
- accion_sugerida: o se borra el chequeo y el hecho vive solo como promesa, o se reescribe la `afirmacion` como un dato chequeable de verdad («la tasa básica del IVA bajó cinco puntos con la reforma, de 23 % a 22 %, y la incidencia del COFIS agrega un sexto punto»), que es lo que la cita realmente afirma y que el mismo Texto Ordenado permite verificar. Dos detalles de presentación en el mismo registro: `dato_real.fuentes[]` repite dos veces la misma URL del BCU (es un documento, no dos: la página los agrupa igual, pero la ficha va a contar dos fuentes donde hay una), y esas fuentes llevan `fecha: 2026-09-15`, que es cuándo se leyó, no la fecha del texto legal; en la línea de tiempo de la ficha va a aparecer un documento de 2026.

### chequeos[1] — 2015-05-06 — 65.000 trabajadores exonerados
- severidad: corregir
- tipo: documento_previsible
- objecion: el `dato_real` es la misma gacetilla que la `afirmacion`: se cita al anunciante para verificar el anuncio. Eso no es un dato real, es la afirmación otra vez, y así lo dice el propio registro; correcto haberlo marcado `_faltante`, pero el documento es previsible. Además la `afirmacion` junta tres datos (65.000 exonerados, 133.000 beneficiados, 93 % con menos de $50.000) y el `fragmento` cubre solo el primero: la página va a marcar en la cita un tramo que no corresponde a todo lo que el globo dice.
- cita_de_contexto: "Puntualizó que serán 133.000 el total de beneficiados y precisó que el 93 % perciben ingresos nominales inferiores a 50.000 pesos." — https://www.gub.uy/presidencia/comunicacion/noticias/astori-informo-65000-trabajadores-dejaran-pagar-irpf
- accion_sugerida: separar en un chequeo por dato, cada uno con su `fragmento`. Para el dato real: la exposición de motivos del proyecto que modificó la liquidación del IRPF sobre aguinaldo y salario vacacional (aprobado por el Senado el 5 de mayo de 2015, según la propia gacetilla) está en la ficha del asunto en `parlamento.gub.uy`, y las series de contribuyentes de IRPF por franja las publica la DGI en su Anuario Estadístico (`dgi.gub.uy`, sección Estadísticas). Si ninguno trae el desagregado, el `_faltante` queda justificado y hay que decir dónde se buscó.

### chequeos[2] — 2016-05-26 — IRPF del 15 % al 18 % entre $33.401 y $50.100
- severidad: corregir
- tipo: documento_previsible
- objecion: el chequeo se construye sobre el `resumen`, y el `resumen` tomó la cifra de la bajada del diario: en el pasaje citado Astori no dice ni «15 %» ni «18 %» ni los montos de la franja. `chequeos.md` lo llama por su nombre: chequear la versión del diario en vez de la del hablante es calificar una frase que la persona no dijo. Y el dato oficial existe y es de los más accesibles del lote: las franjas y tasas del IRPF las fija la ley y las publica la DGI.
- cita_de_contexto: "El ministro de Economía y Finanzas, Danilo Astori, sostuvo que no existe la posibilidad de eliminar el incremento de 15% a 18% en la tasa del Impuesto a la Renta de las Personas Físicas (IRPF) para los salarios nominales entre $ 33.401 y $ 50.100" (texto del diario, no de Astori) — https://www.elpais.com.uy/informacion/astori-no-se-puede-evitar-subir-irpf-a-salarios-entre-33-401-y-50-100
- accion_sugerida: buscar el texto de la ley 19.438 (Rendición de Cuentas 2015) en IMPO, artículo que sustituye la escala del IRPF categoría II, y la tabla de franjas en BPC que publica la DGI para el ejercicio 2017. Con eso el chequeo se califica. Si además se consigue la entrevista de radio Carve, la `afirmacion` puede escribirse contra lo que dijo el hablante.

### chequeos[3] — 2016-08-04 — 17 % pagará más, 67 % no paga ni pagará
- severidad: corregir
- tipo: documento_previsible
- objecion: el `dato_real` cita la misma crónica de la que sale la afirmación —circular— cuando la fuente primaria estaba abierta en la corrida y trae la cifra completa, incluido el 15 % que paga lo mismo. Y el documento independiente es previsible: los porcentajes salían de una lámina del Ministerio de Economía presentada en el Senado, y el impacto distributivo de la Rendición de Cuentas 2015 está en la exposición de motivos del proyecto.
- cita_de_contexto: "Luego, el 15 % paga lo mismo, y solamente el 17 % de trabajadores y pasivos –insisto– va a pagar un poco más de lo que paga hoy." — https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescss/2016-08-04%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20SENADORES%20(0026).pdf
- accion_sugerida: `dato_real.fuentes[]` con la versión taquigráfica (tipo `diario_de_sesiones`, que habilita calificar) y, para el contraste independiente, la exposición de motivos de la Rendición de Cuentas 2015 del MEF (ficha del asunto en `parlamento.gub.uy`) o el informe de distribución del IRPF por decil de la DGI. Corregir también `afirmacion` y `fragmento` con el 15 %.

### chequeos[4] — 2023-03-03 — US$ 100 millones de aumento de impuestos
- severidad: corregir
- tipo: documento_previsible
- objecion: es el chequeo de una acusación a un tercero sostenida únicamente en la palabra de quien acusa, y el `dato_real` lo resuelve citando otra declaración del mismo Astori de 2020. Dos dichos de la misma persona no son un dato real. El documento existe y es previsible: la cuantificación de la renuncia fiscal y del efecto recaudatorio de las medidas de marzo de 2020 está en los informes del MEF. Mientras no esté, el chequeo tiene que quedar en `discutible` y el `analisis` tiene que atribuir la cifra a Astori en la primera oración.
- cita_de_contexto: "\"Ese aumento de impuestos se obtuvo eliminando el subsidio que tenía un impuesto muy importante que es el IVA para la justicia tributaria y por otro lado modificando los criterios de ajustes de las franjas del impuesto a la renta personal que pasaron a ajustarse por las bases de prestaciones y contribuciones y no por el Índice Medio de Salarios\"" — https://www.elobservador.com.uy/nota/astori-dijo-que-la-rebaja-del-irpf-y-del-iass-va-para-poca-gente-y-recordo-el-aumento-de-impuestos-a-comienzos-del-gobierno--202333145022
- accion_sugerida: el propio Astori dice de dónde sale el número, y eso lo hace verificable: (a) el decreto de marzo de 2020 que redujo los descuentos de IVA de la ley 19.210 (IMPO); (b) el cambio del índice de ajuste de las franjas del IRPF, de IMS a BPC, en la ley que lo dispuso (IMPO); (c) el Informe de Recaudación anual de la DGI 2020 y la exposición de motivos de la Rendición de Cuentas 2020 del MEF, que cuantifican el efecto. Con cualquiera de los tres el chequeo sale de `discutible`.

### promesas[0] — 2014-05-24 — «no se iba a aumentar la carga tributaria ni a hacer un ajuste fiscal»
- severidad: bloquea
- tipo: cita_fuera_de_contexto
- objecion: el `texto` de la promesa es más absoluto que la promesa. Astori negó el ajuste fiscal después de definir qué entendía por tal, y sobre los impuestos habló de bajar la carga tributaria **media**, aclarando en la misma respuesta que algunos iban a pagar más. Una promesa cuya formulación original contiene «hay quienes deben pagar más porque tienen mayor capacidad» no puede calificarse de incumplida porque subió el IRPF de las franjas altas: eso es calificar una promesa que no hizo. Puede ser incumplida por otras razones (la carga tributaria media, medida, subió o no), pero entonces hay que medirla, no deducirla. Como está, la promesa, el `origen` (la bajada del periodista) y las dos `evidencias_candidatas` en contra forman una cadena que el lector no puede auditar.
- cita_de_contexto: "Respecto a la otra hoja del tema fiscal que son los ingresos y el sistema tributario nuestro objetivo es exactamente el inverso, es ir disminuyendo la carga tributaria. Estoy hablando en términos generales porque hay quienes deben pagar más porque tienen mayor capacidad y quienes tienen que pagar menos porque tienen menor capacidad. Nosotros queremos disminuir la carga tributaria media que tiene la población beneficiando especialmente a los que más lo necesitan." — https://www.elobservador.com.uy/nota/-no-habra-un-ajuste-fiscal-y-se-reducira-la-carga-tributaria-media--201452419460
- accion_sugerida: separar en dos promesas, como pide `promesas.md` para las compuestas: (1) no habrá ajuste fiscal, con la definición que él mismo dio; (2) bajará la carga tributaria media. Poner como `origen` sus palabras, no la bajada. Para la segunda, la evidencia decisiva es un dato oficial y existe: la serie de presión tributaria sobre el PIB del MEF (Informe de Política Fiscal / rendiciones) o la recaudación de la DGI sobre PIB, 2014 contra 2019. Sin eso, la promesa se califica por declaraciones y no por hechos.

### promesas[1] — 2005-11-07 — bajar el IVA al 20 %
- severidad: corregir
- tipo: contexto_omitido
- objecion: el `texto` respeta el condicional, que está bien y es lo que la crítica de `promesas.md` pide mirar primero. Lo que falta es la otra mitad: la única `evidencia_candidata` es en contra (la tasa sigue en 22 %) y nadie evaluó si la condición a la que la propia ley ató la baja llegó a cumplirse. Sin eso, la ficha dice «prometió y no cumplió» sobre una promesa que estaba sujeta a una condición que quizá nunca se dio, y eso es un juicio que el lector no puede revisar.
- cita_de_contexto: "Hoy, no queremos perder recaudación, tampoco ganar. Pero apenas podamos, a medida que evolucione bien la economía uruguaya, queremos ir reduciendo la carga tributaria sobre la sociedad, sobre la producción, sobre el consumo, sobre los uruguayos en su conjunto." — http://archivo.presidencia.gub.uy/_web/noticias/2005/11/2005110709.htm
- accion_sugerida: agregar como evidencia el resultado fiscal del período (serie de resultado del sector público del MEF o del BCU) y que la `fundamentacion` diga si la condición se cumplió o no. Corregir la `fecha: 2026-09-15` de la fuente del BCU, que es la fecha de lectura y no la del Texto Ordenado.

### promesas[2] — 2016-08-04 — no volver a modificar el sistema impositivo
- severidad: corregir
- tipo: asimetria
- objecion: la única `evidencia_candidata` es `a_favor` y se apoya en la nota de El País de 2018 cuyo dato central es un trascendido («según supo El País»). No hay rastro de búsqueda de evidencia en contra con el mismo esfuerzo, que es justo lo que la crítica de `promesas.md` manda mirar. Entre agosto de 2016 y marzo de 2020 hubo tres Rendiciones de Cuentas y un montón de decretos tributarios; si ninguno tocó el sistema impositivo, eso hay que mostrarlo, no suponerlo. El `origen`, además, arrastra el problema de `declaraciones[7]`: se cita la crónica cuando existe la versión taquigráfica.
- cita_de_contexto: "a pesar de los pedidos de mayor presupuesto para llegar al 6% del Producto Interno Bruto (PIB) para la educación, el gobierno descartó la posibilidad de aumentar la carga impositiva, según supo El País" — https://www.elpais.com.uy/informacion/politica/rendicion-no-subiran-mas-los-impuestos
- accion_sugerida: cambiar el `origen` a la versión taquigráfica y buscar en IMPO las leyes de Rendición de Cuentas 2016, 2017 y 2018 y los decretos tributarios del período; cualquier modificación de tasas o franjas es evidencia `en_contra` y cualquier período sin modificaciones es evidencia `a_favor` con documento.

## Objeciones al lote

1. **Los ceros de 1990-2004 se declaran sin agotar la lista que el propio brief fija** (severidad: corregir, tipo: asimetria). Los nueve tramos tienen su renglón en `cobertura_del_periodo`, así que no hay bloqueo por cobertura. Pero la regla 11 del brief enumera las fuentes que hay que agotar antes de decir que no hay nada, y `consultas.jsonl` no tiene ninguna llamada a `pnpm sesion`, ninguna consulta a los endpoints de comisiones del Parlamento, ningún `pnpm inventario`, y ningún `pnpm descubrir` anterior a 2014 para los quince años en que Astori fue senador. Lo que hubo fueron siete búsquedas web. El caso más claro: el lote leyó la nota de La República del 2001-05-24 sobre la sesión en que el Senado creó el COFIS, que trae la fecha exacta («la discusión que culminó anoche a la hora 23.40») y el dato de que el Encuentro Progresista votó en contra; con esa fecha, `pnpm sesion css 2001-05-23` da la versión taquigráfica donde, si Astori habló, habló. `notas.md` reconoce la vía de los índices alfabéticos de la Hemeroteca y dice que no se siguió «por el volumen de trabajo». Un cero declarado sobre quince años de carrera parlamentaria, sin haber abierto un solo diario de sesiones, no es un cero: es una búsqueda incompleta, y publicado como cero le dice al lector que Astori no habló de impuestos entre 1990 y 2004. Si no se corren esas búsquedas, el texto que ve el lector tiene que decir hasta dónde se buscó.
2. **Falta 2019 completo dentro del tramo 2015-2019** (severidad: corregir, tipo: cobertura). El renglón del tramo enumera 2015, 2016, 2017 y 2018 y no dice nada de 2019, que es año electoral, con Astori ministro en ejercicio y los impuestos como tema de campaña. La propia pista que el brief le entregó al investigador es del 2019-04-23. Un tramo cubierto «en profundidad» que se detiene en mayo de 2018 tiene que decirlo en el renglón.
3. **El hecho central del relato no tiene registro** (severidad: corregir, tipo: contexto_omitido). El lote tiene las promesas de 2015, la defensa de la suba en mayo de 2016 y la admisión de agosto de 2016, pero no tiene el anuncio del ajuste fiscal, que es el momento en que la promesa se rompe. La nota de El Observador del 2016-05-25, que el lote abrió y descartó, lo fecha y lo cuantifica: «El primer ajuste fiscal de los gobiernos del Frente Amplio se anunció oficialmente este lunes por el ministro de Economía y Finanzas, Danilo Astori. El paquete de medidas… busca aumentar los ingresos del Estado por US$ 350 millones… y recortar gastos en US$ 150 millones» (https://www.elobservador.com.uy/nota/los-ajustes-fiscales-desde-el-retorno-a-la-democracia-201652514300). Para un anuncio oficial de esa escala, Presidencia y el MEF publican el texto: buscarlo en `www.gub.uy/presidencia/comunicacion/noticias/` de mayo de 2016 antes de citar la crónica.
4. **Ocho notas abiertas y descartadas sin una línea que diga por qué** (severidad: corregir, tipo: asimetria). `notas.md` explica solo las URLs que fallaron. Las que se abrieron bien y no produjeron nada no figuran. Son: El Observador 2016-05-25, 2022-03-05 y 2023-11-10; Caras y Caretas 2017-02-21; Montevideo Portal 2024-04-22; La República 2001-05-24; El País 2016-06-28; Subrayado 2019-04-23 (la pista del brief). Releí las ocho. Cinco se descartan bien (no traen cita textual de Astori sobre el tema, o hablan de otro). Tres son hallazgos que se perdieron:
   - **Caras y Caretas, 2017-02-21**: una declaración sobre el tema, de un medio de otro grupo y otro alineamiento que el lote no usa en ningún registro: «Astori desmintió la información. «No hay nada decidido sobre nuevos impuestos o subir los que ya existen», dijo el ministro» (https://www.carasycaretas.com.uy/astori-no-nada-decidido-nuevos-impuestos-subir-los-ya-existen). Es un registro que falta.
   - **El País, 2016-06-28**: Astori en la Comisión de Presupuesto integrada con Hacienda diciendo que no habrá otro ajuste fiscal por ley, un mes antes de la interpelación (https://www.elpais.com.uy/informacion/danilo-astori-dijo-en-el-parlamento-que-no-habra-otro-ajuste-fiscal-por-ley). La nota no lo cita textualmente, y por eso se entiende el descarte; pero la versión taquigráfica de esa comisión sí, y es un documento previsible.
   - **El Observador, 2022-03-05**: trae la justificación de Astori tomada de la versión taquigráfica y el contrapunto de Lacalle Pou, que es el material de la `explicacion` del giro.
5. **Una URL citada no está en `consultas.jsonl`** (severidad: aviso, tipo: presentacion). La gacetilla de Presidencia del 2015-05-06 respalda `declaraciones[2]` y `chequeos[1]` y no aparece en el registro de consultas, aunque el corpus muestra que se bajó durante la corrida. Esto no se le pide a un crítico: es una comparación mecánica entre las `evidencia.fuentes[].url` del inbox y las líneas de `consultas.jsonl`, y debería correrla `pnpm validar --inbox` como una advertencia.
6. **Dependencia de fuentes, con el número puesto** (severidad: aviso, tipo: un_solo_grupo). De los 14 registros de declaraciones, 9 son `reportado` y 8 quedan con un solo grupo; de esos 8, 5 son de El País (grupo scheck-aguirre). No es un problema de alineamiento —el brief pedía justamente romper la dependencia de medios `sin_datos` y El País es `oficialista_tradicional`, así que el lote cumple esa parte—, pero sí de grupo: hay medios de otros grupos cubriendo los mismos hechos que no se probaron (Caras y Caretas para 2017, Telenoche para el 2016-08-11, radio Carve para el 2016-05-26, En Perspectiva para el 2017-03-23). Dos de los ocho `_faltante` desaparecen sin buscar nada nuevo, usando la versión taquigráfica que ya está abierta (`declaraciones[7]` y `[8]`).
7. **`menciones.yaml` vacío con al menos una mención cargable** (severidad: corregir, tipo: contexto_omitido). `notas.md` argumenta que ninguna cita encaja en «cita como autoridad», y hay una que encaja de manera directa: el 2023-03-03 Astori respalda expresamente a un organismo. «El exministro de Economía en gobiernos del FA se manifestó de acuerdo con lo que había señalado el Consejo Fiscal Asesor […] "El Consejo Fiscal Asesor tiene razón en lo que señala porque esta renuncia fiscal, que en total es muy pequeña es el 0,25% del PBI en pocas palabras, genera una presión muy grande sobre el gasto público"». Corresponde proponer en `referentes_faltantes` el Consejo Fiscal Asesor (tipo `organizacion`) y cargar la mención con `sentido: positivo`.
8. **`## para_el_lector` dice algo que el lote no respalda y calla algo que sí** (severidad: corregir, tipo: presentacion). Dice «primero como candidato y después como ministro»: no hay en el lote ninguna promesa hecha como candidato; el registro de 2014 es una entrevista dada como vicepresidente, un mes antes de las elecciones internas, y el propio `cargo_en_ese_momento` lo dice. Y no dice que la búsqueda no encontró nada suyo sobre impuestos antes de 2005, pese a que fue senador desde 1990: la regla 5 de `presentacion.md` es explícita en que lo que no se cargó se declara. El texto está bien en lo demás (sin narración de proceso, sin ids, sin nombres de archivo).
9. **Lo que el lote hizo bien y conviene que quede escrito** (severidad: sin_objecion). El umbral de `_faltante: dato_oficial` se aplicó igual a los datos que favorecen a Astori (65.000 exonerados, 17 %/67 %) que al dato con el que acusa a un gobierno rival (US$ 100 millones): ningún chequeo se cerró en verde por falta de documento y ninguno se dejó pasar por conveniencia. El lote también carga el par `sin_cambio` (la promesa de 2016 y la Rendición de 2018), que es lo que evita que la ficha quede unilateral. Las dos búsquedas de corpus que corrí para atacar los ceros (`Astori impuestos IVA` hasta 2004-12-31 y `reforma tributaria IRPF Astori` entre 2006 y 2009) devolvieron «sin resultados en el corpus», así que la afirmación de `notas.md` sobre el corpus es exacta: lo que falta es el trabajo fuera del corpus.
10. **No se escribió `discrepancias.yaml`, y el motivo importa** (severidad: aviso). El único caso del lote donde hay fuente primaria para cotejar contra lo publicado es la crónica de El País del 2016-08-04 frente a la versión taquigráfica. La diferencia existe y está anotada en `declaraciones[6]` y `[7]`: el diario entrecomilla «no iba a haber más impuestos» donde el original dice «no vamos a poner más impuestos», y agrega «volver a» dentro de una cita. No la registro como discrepancia porque el sentido de lo afirmado no cambia, y porque un umbral que convierta cualquier diferencia de redacción entre una crónica en vivo y una versión taquigráfica en discrepancia castigaría mecánicamente al medio que más cubre el Parlamento. Eso va como `literalidad: difiere` en el cotejo, que es el mecanismo previsto. Las otras notas del lote no tienen documento primario del mismo hecho contra el cual medirlas, así que ningún medio queda excluido del examen por su línea editorial: quedan excluidos por falta de documento, que es la primera regla de la colección.

## Objeciones al brief

Ninguna por Regla 0. El brief pide expresamente cubrir el período completo, «favorable o desfavorable, consistente o contradictorio», fija los mismos tramos y las mismas fuentes a agotar que se le fijarían a cualquier persona, y manda los casos judiciales al barrido simétrico en vez de elegir a quién se le investiga. La instrucción de la regla 5 de buscar medios de alineamiento distinto y de probar El País con `pnpm descubrir` corrige un desbalance medido en el propio sitio y se aplica a todos los políticos, así que no es una asimetría sino lo contrario.

Una observación menor, no de Regla 0: el brief dimensiona el lote por persona y tema, pero no por cantidad de tramos. Acá una sola corrida tenía que cubrir 37 años y nueve tramos, y lo que se cayó fue lo más caro de buscar, que son los quince años más viejos. Si la regla 16 fija topes de 6 personas por lote de casos y 40 fichas por lote de verificación, un tope análogo para trayectorias largas (por ejemplo, partir en dos corridas cuando el período supera los veinte años) haría que el hueco de 1990-2004 no dependa del cansancio del agente. Vale igual para cualquier político con carrera larga.

## Cobertura

Un registro de tono por cada nota de prensa que leí en esta crítica. No incluyo las gacetillas de Presidencia, el diario de sesiones ni el Texto Ordenado del BCU: no son cobertura periodística sino documentos de la parte. La nota de la diaria del 2022-07-28 no la releí y por eso no lleva registro.

Criterio, el mismo para todas: `neutral` por defecto; `desfavorable` o `favorable` solo cuando el juicio está en la voz del medio, no atribuido a un tercero. Una crítica atribuida y acotada («para la oposición…») deja la nota en `neutral` aunque la crítica sea dura; una crítica que el medio asume como propia, o un elogio en su voz, la mueve.

```yaml
- medio: la-republica
  url: https://www.lr21.com.uy/politica/44448-senado-aprobo-creacion-de-cofis-y-astori-lo-califico-de-inepto-para-la-reactivacion
  fecha: 2001-05-24
  evento: propuesto:creacion-cofis-2001
  politico: astori
  tono: neutral
  justificacion: >-
    Crónica de la votación, con las posiciones de los dos lados: "En el tratamiento en general la
    iniciativa contó con 18 votos favorables provenientes de los legisladores colorados y blancos
    (coalición de gobierno) y rechazaron el mismo el Encuentro Progresista y el Nuevo Espacio". El
    título le atribuye a Astori la palabra "inepto", que en el cuerpo de la nota no aparece en
    ninguna cita suya.

- medio: el-observador
  url: https://www.elobservador.com.uy/nota/-no-habra-un-ajuste-fiscal-y-se-reducira-la-carga-tributaria-media--201452419460
  fecha: 2014-05-24
  evento: elecciones-2014
  politico: astori
  tono: favorable
  justificacion: >-
    La presentación de la entrevista contrapone a Astori con el gobierno saliente en la voz del
    medio: "Pero a diferencia del vacilante andar de José Mujica, el actual vicepresidente siente
    que con Vázquez, en un eventual tercer gobierno frentista, no habrá lugar a cabildeos en
    materia económica".

- medio: el-observador
  url: https://www.elobservador.com.uy/nota/-no-habra-un-ajuste-fiscal-y-se-reducira-la-carga-tributaria-media--201452419460
  fecha: 2014-05-24
  evento: elecciones-2014
  politico: mujica
  tono: desfavorable
  justificacion: >-
    La misma frase que trata bien a Astori califica a Mujica en la voz del medio: "a diferencia del
    vacilante andar de José Mujica". El juicio no está atribuido a nadie.

- medio: el-observador
  url: https://www.elobservador.com.uy/nota/los-ajustes-fiscales-desde-el-retorno-a-la-democracia-201652514300
  fecha: 2016-05-25
  evento: propuesto:ajuste-fiscal-2016
  politico: astori
  tono: neutral
  justificacion: >-
    Repaso histórico sin adjetivos sobre ninguna administración: "El primer ajuste fiscal de los
    gobiernos del Frente Amplio se anunció oficialmente este lunes por el ministro de Economía y
    Finanzas, Danilo Astori".

- medio: el-pais
  url: https://www.elpais.com.uy/informacion/astori-no-se-puede-evitar-subir-irpf-a-salarios-entre-33-401-y-50-100
  fecha: 2016-05-26
  evento: propuesto:ajuste-fiscal-2016
  politico: astori
  tono: neutral
  justificacion: >-
    Explica el mecanismo del impuesto antes de opinar y le da espacio al argumento del ministro,
    incluida su cifra: "El 80% de la mayor carga tributaria recae sobre el 10% de la población de
    mayores ingresos".

- medio: el-pais
  url: https://www.elpais.com.uy/informacion/danilo-astori-dijo-en-el-parlamento-que-no-habra-otro-ajuste-fiscal-por-ley
  fecha: 2016-06-28
  evento: propuesto:ajuste-fiscal-2016
  politico: astori
  tono: neutral
  justificacion: >-
    La lectura crítica está atribuida y acotada, no asumida por el medio: "Para la oposición, las
    palabras del ministro de Economía dejan entrever que sí podría ocurrir otro ajuste, pero a
    través del diferimiento de partidas".

- medio: el-pais
  url: https://www.elpais.com.uy/informacion/con-los-votos-del-fa-senado-encontro-satisfactorias-las-palabras-de-astori
  fecha: 2016-08-04
  evento: propuesto:ajuste-fiscal-2016
  politico: astori
  tono: neutral
  justificacion: >-
    Todas las valoraciones duras están entrecomilladas y atribuidas a los senadores de la
    oposición, y la nota también recoge la defensa del ministro: "Astori por su parte, en la última
    exposición de la jornada, afirmó que \"esta sesión me ha convencido más de que estamos en el
    camino correcto\"". El reparto de espacio favorece a los interpelantes, pero el medio no pone
    juicio propio.

- medio: el-pais
  url: https://www.elpais.com.uy/informacion/astori-al-fa-no-deberia-aumentar-carga-tributaria
  fecha: 2016-08-11
  evento: propuesto:ajuste-fiscal-2016
  politico: astori
  tono: neutral
  justificacion: >-
    Relato de la interna del oficialismo sin calificar a nadie: "El ministro de Economía, Danilo
    Astori, respondió ayer a los sectores que dentro del Frente Amplio promueven una suba de
    impuestos para financiar la no postergación del gasto en educación".

- medio: caras-y-caretas
  url: https://www.carasycaretas.com.uy/astori-no-nada-decidido-nuevos-impuestos-subir-los-ya-existen
  fecha: 2017-02-21
  evento: propuesto:programa-fa-rendicion-2017
  politico: astori
  tono: favorable
  justificacion: >-
    El medio da por falsa la versión que el ministro desmiente, en su propia voz y sin atribuirlo:
    "A raíz de ese hecho, varios medios anunciaron que la fuerza política gobernante determinaría
    nuevos impuestos y un aumento de algunos de los ya existentes. Astori desmintió la
    información".

- medio: el-observador
  url: https://www.elobservador.com.uy/nota/astori-la-carga-tributaria-esta-en-un-limite-que-no-conviene-aumentar--201732311280
  fecha: 2017-03-23
  evento: propuesto:programa-fa-rendicion-2017
  politico: astori
  tono: neutral
  justificacion: >-
    Recoge sus dichos y a la vez marca la contradicción con el antecedente, sin adjetivos: "Si bien
    el presidente Tabaré Vázquez había afirmado que no estaba en los planes del gobierno aumentar
    la carga tributaria, en su momento dejó abierta esa puerta".

- medio: el-pais
  url: https://www.elpais.com.uy/informacion/politica/rendicion-no-subiran-mas-los-impuestos
  fecha: 2018-05-24
  evento: propuesto:rendicion-de-cuentas-2018
  politico: astori
  tono: neutral
  justificacion: >-
    Nota informativa breve, sin valoración, aunque su dato central se apoya en información propia
    sin fuente identificada: "el gobierno descartó la posibilidad de aumentar la carga impositiva,
    según supo El País".

- medio: subrayado
  url: https://www.subrayado.com.uy/novick-apunta-otra-vez-contra-mujica-y-dice-que-ahora-hace-payaso-n532035
  fecha: 2019-04-23
  evento: elecciones-2019
  politico: astori
  tono: desfavorable
  justificacion: >-
    El medio enuncia la acusación como hecho en su propia redacción, sin comillas, sin matiz y sin
    respuesta del aludido: "También criticó al ministro de Economía Danilo Astori por subir los
    impuestos cuando dijo que no lo haría".

- medio: frenteamplio-uy
  url: https://frenteamplio.uy/noticias/12-noticias/1551-danilo-astori-hay-un-aumento-oculto-de-los-impuestos
  fecha: 2020-03-13
  evento: propuesto:medidas-economicas-inicio-gobierno-2020
  politico: astori
  tono: favorable
  justificacion: >-
    El sitio del propio partido adopta como propio el encuadre del entrevistado, incluso en los
    intertítulos: "Suba del impuesto más injusto del sistema tributario uruguayo".

- medio: el-observador
  url: https://www.elobservador.com.uy/nota/promesa-incumplida-el-argumento-de-lacalle-y-una-similitud-con-lo-que-criticaba-a-vazquez-y-astori-20223420470
  fecha: 2022-03-05
  evento: propuesto:ajuste-fiscal-2016
  politico: astori
  tono: neutral
  justificacion: >-
    Aplica la misma vara a los dos gobiernos y cita la fuente primaria de cada dicho: "Cuando
    dijimos «no vamos a poner más impuestos» era porque no queríamos hacerlo […]", dijo Astori
    según consta en la versión taquigráfica de la sesión".

- medio: el-observador
  url: https://www.elobservador.com.uy/nota/astori-dijo-que-la-rebaja-del-irpf-y-del-iass-va-para-poca-gente-y-recordo-el-aumento-de-impuestos-a-comienzos-del-gobierno--202333145022
  fecha: 2023-03-03
  evento: propuesto:rebaja-irpf-iass-2023
  politico: astori
  tono: neutral
  justificacion: >-
    Reproduce sus argumentos en extenso y con atribución, sin sumar valoración del medio: "El
    exministro de Economía en gobiernos del FA se manifestó de acuerdo con lo que había señalado el
    Consejo Fiscal Asesor".

- medio: el-observador
  url: https://www.elobservador.com.uy/nota/que-pague-mas-el-que-tiene-mas-el-irpf-de-danilo-astori-2023111014366
  fecha: 2023-11-10
  evento: fallecimiento-danilo-astori-2023
  politico: astori
  tono: favorable
  justificacion: >-
    Balance de obra en la voz del medio el día de su muerte: "La reforma tributaria fue el cambio
    económico más importante en el primer gobierno del Frente Amplio y por el que siempre se
    recordó a Astori".

- medio: montevideo-portal
  url: https://www.montevideo.com.uy/Noticias/-Aumentan-o-bajan-Esto-dice-el-programa-del-Frente-Amplio-sobre-impuestos-uc886216
  fecha: 2024-04-22
  evento: elecciones-2024
  politico: astori
  tono: neutral
  justificacion: >-
    Cita el programa y los cruces de los precandidatos sin tomar partido, y menciona a Astori solo
    como dato: "El FA realizó en 2007 una reforma tributaria liderada por el entonces ministro de
    Economía Danilo Astori".
```

Nota sobre los `evento: propuesto:`: ninguno de los episodios de este lote tiene evento en `content/eventos/`. Los cinco propuestos (`creacion-cofis-2001`, `ajuste-fiscal-2016`, `programa-fa-rendicion-2017`, `rendicion-de-cuentas-2018`, `medidas-economicas-inicio-gobierno-2020`, `rebaja-irpf-iass-2023`) los crea el editor si los acepta; `ajuste-fiscal-2016` agrupa seis notas de cuatro medios y es el que más rinde.
