# Crítica — corrida 2026-09-16-correccion-astori-resolucion-chequeos

Lote: inbox/resoluciones/2026-09-16/ (solo los dos archivos resueltos que nombra el brief; registros y declaraciones leídos en inbox/astori/economia/impuestos/2026-09-15/)
Registros revisados: 2 resoluciones, 2 chequeos y sus 2 declaraciones (sin muestra).
Banco: `pnpm banco` sin evidencia guardada para los dos chequeos.

## Veredicto en una línea por resolución

- **2016 (IRPF 15 % a 18 %): la fecha del registro está bien y la nota reporta otro dicho.** La nota de El Observador del 23/5 cubre la conferencia del lunes 23/5 en la Torre Ejecutiva, no la entrevista en radio Carve del 26/5. No se suma. Hay otra nota de El Observador, la del 27/5, que sí es segunda fuente del dicho del 26/5, pero solo de la declaración, no del chequeo: no trae el 15 % ni el 18 %.
- **2020 (IVA débito y gastronomía): la fecha del registro está mal.** Lo dijo el jueves 12/3/2020. El 13/3 es el día en que lo publicó el sitio del Frente Amplio. Pero la nota de El Observador tampoco sirve como segunda fuente del chequeo: las cifras las pone el diario con su propia voz y no se las atribuye a Astori. Es la trampa de la segunda fuente falsa.

## Resumen
```yaml
- registro: chequeos/astori/2016-05-26-irpf-suba-15-a-18-franja-33401-50100
  severidad: bloquea
  tipo: un_solo_grupo            # segunda fuente falsa: la nota es de otro dicho (23/5)
- registro: chequeos/astori/2016-05-26-irpf-suba-15-a-18-franja-33401-50100
  severidad: corregir
  tipo: documento_previsible     # el 15 % a 18 % está en el texto de Presidencia del 23/5, que ya está en el lote
- registro: declaraciones/astori/2016-05-26-defensa-suba-irpf-franja-33401-50100
  severidad: corregir
  tipo: presentacion             # el resumen dice «el diario que lo entrevistó»: lo entrevistó radio Carve, El País lo reportó
- registro: declaraciones/astori/2016-05-26-defensa-suba-irpf-franja-33401-50100
  severidad: aviso
  tipo: un_solo_grupo            # hay una segunda fuente verdadera del mismo dicho: El Observador 27/5/2016
- registro: chequeos/astori/2020-03-13-descuento-iva-debito-y-gastronomia-2020
  severidad: bloquea
  tipo: un_solo_grupo            # segunda fuente falsa: el diario no atribuye las cifras a Astori
- registro: chequeos/astori/2020-03-13-descuento-iva-debito-y-gastronomia-2020
  severidad: corregir
  tipo: contexto_omitido         # fecha del dicho: 2020-03-12, cambio de id en par
- registro: chequeos/astori/2020-03-13-descuento-iva-debito-y-gastronomia-2020
  severidad: corregir
  tipo: documento_previsible     # mitad débito: la norma de los 2 puntos adicionales desde 2017, antes de su derogación
- registro: declaraciones/astori/2020-03-13-aumento-oculto-impuestos-iva-debito-2020
  severidad: corregir
  tipo: contexto_omitido         # misma fecha mal, par con el chequeo
- registro: declaraciones/astori/2020-03-13-aumento-oculto-impuestos-iva-debito-2020
  severidad: aviso
  tipo: documento_previsible     # grabación primaria del 12/3 (área de comunicación del FA / 970 Noticias)
```

## Objeciones por registro

### chequeos/astori/2016-05-26-irpf-suba-15-a-18-franja-33401-50100 — resolución con El Observador 23/5/2016
- severidad: bloquea
- tipo: un_solo_grupo (segunda fuente falsa)
- objecion: La nota del 23/5 no puede reportar lo que Astori dijo el 26/5, y no lo hace. Cubre la conferencia de prensa del lunes 23/5 en la Torre Ejecutiva, donde se presentó la Rendición de Cuentas. Ese hecho ya está publicado en `textual` como `declaraciones/astori/2016-05-23-anuncio-ajuste-fiscal-irpf-iass-80-recaudacion-2016`, con el texto de Presidencia como fuente. La declaración de la que cuelga el chequeo es otra: la entrevista en radio Carve, donde Astori descartó eliminar la suba ante el planteo del PIT-CNT y de sectores del FA. Ese planteo recién existe después del anuncio. **La fecha del 26/5 es correcta.** La confirma una fuente de otro día y otro medio: El Observador del 27/5 escribe «las declaraciones realizadas ayer por Astori a radio Carve». No hay cambio de id por la fecha. Si la nota del 23/5 se sumara a `evidencia.fuentes`, el chequeo tendría un segundo grupo con una nota de otro hecho. Es la trampa que describe `correcciones.md`. Tampoco sirve para el banco de este id: no es evidencia incompleta del dicho del 26/5, sino evidencia de otro dicho.
- cita_de_contexto: "El ministro de Economía, Danilo Astori, anunció este lunes diversas medidas que adoptará el gobierno en el marco de la Rendición de Cuentas a fin de equilibrar las cuentas públicas. En conferencia de prensa desde Torre Ejecutiva" (https://www.elobservador.com.uy/nota/aumentos-de-irpf-afectaran-a-quienes-ganen-mas-de-33-400-nominales-201652316150); "las declaraciones realizadas ayer por Astori a radio Carve provocaron enojo en filas del FA" (https://www.elobservador.com.uy/nota/fa-planea-alternativa-a-suba-del-irpf-en-sueldos-menores-de-50-mil-2016527500); "El planteo proviene del Pit Cnt y de algunos sectores dentro del Frente Amplio." (El País 26/5/2016)
- accion_sugerida: El editor no suma la fuente y la corrección de este chequeo sale `rechazada`. El fundamento: la nota es de la conferencia del 23/5, un hecho distinto que ya está publicado. Lo que cambiaría la decisión es una nota de otro grupo que atribuya el 15 % a 18 % al dicho del 26/5 en Carve, o el audio de Carve de ese día. Otra salida, si el editor la prefiere, es re-anclar el chequeo a la declaración del 23/5. Ahí el dato es de Astori en un texto oficial: «los tramos de ingresos mensuales comprendidos entre los 33.400 a 50.100 pesos pasarán de tener una tasa de 15 % a 18 %» (https://www.gub.uy/presidencia/comunicacion/noticias/80-recaudacion-adicional-empleados-pasivos-recaera-10-mayores-ingresos). Eso es un cambio de id con par `{de: chequeos/astori/2016-05-26-irpf-suba-15-a-18-franja-33401-50100, a: chequeos/astori/2016-05-23-…}`, y la declaración del 23/5 tendría que llevar el tramo del `fragmento` en su cita o en su resumen, que hoy no lo traen.

### chequeos/astori/2016-05-26-irpf-suba-15-a-18-franja-33401-50100 — dato_real
- severidad: corregir
- tipo: documento_previsible
- objecion: Las `notas_internas` dicen que falta un documento para confirmar el «18 %» sin depender de El País. Ese documento ya está en el lote: el texto de Presidencia del 23/5/2016, fuente de `declaraciones[5]`, da la tasa propuesta de 15 % a 18 % para esa franja. Para lo que finalmente se aplicó, la Ley 19.438 fija la escala en BPC. La conversión a pesos se hace con el decreto que fijó el valor de la BPC para 2016, en IMPO, y es previsible.
- cita_de_contexto: "El ministro de Economía y Finanzas informó que los tramos de ingresos mensuales comprendidos entre los 33.400 a 50.100 pesos pasarán de tener una tasa de 15 % a 18 %" (https://www.gub.uy/presidencia/comunicacion/noticias/80-recaudacion-adicional-empleados-pasivos-recaera-10-mayores-ingresos)
- accion_sugerida: Agregar ese texto de Presidencia a `dato_real.fuentes`. Buscar el decreto de la BPC 2016 en IMPO para convertir la escala de la Ley 19.438. La calificación la decide el editor.

### declaraciones/astori/2016-05-26-defensa-suba-irpf-franja-33401-50100 — «Hay que tener en cuenta la forma en la que se liquida…»
- severidad: corregir (resumen) · aviso (segunda fuente disponible)
- tipo: presentacion · un_solo_grupo
- objecion: (1) El resumen dice «El diario que lo entrevistó consignó que ese aumento era del 15% al 18%». El País no lo entrevistó: reportó una entrevista de radio Carve. El `fragmento` del chequeo está en esa misma oración, así que resumen y fragmento se ajustan juntos. (2) La segunda fuente verdadera del dicho del 26/5 existe y ya está en el corpus: El Observador del 27/5. Cita el mismo pasaje, condensado con «(...)», y lo fecha «ayer». No trae las tasas, así que levanta la declaración pero no el chequeo. Antes de contarla como segundo grupo frente a El País, hay que ver el aviso sobre la ficha de El Observador en «Objeciones al lote».
- cita_de_contexto: "A la franja entre $ 33.401 y $ 50.100 no le estoy definiendo una alícuota algo más alta, entonces afecto la liquidación de todo el impuesto" (https://www.elobservador.com.uy/nota/fa-planea-alternativa-a-suba-del-irpf-en-sueldos-menores-de-50-mil-2016527500); `--buscar "18 | 15"` sin coincidencias en esa nota.
- accion_sugerida: Resumen: «El País, que reportó la entrevista, consignó…». Si la corrección se amplía a la declaración, sumar esa nota del 27/5 con la cita de arriba. Es una corrección `cambio_de_rating` sobre la declaración, no sobre el chequeo.

### chequeos/astori/2020-03-13-descuento-iva-debito-y-gastronomia-2020 — resolución con El Observador 12/3/2020
- severidad: bloquea
- tipo: un_solo_grupo (segunda fuente falsa)
- objecion: La nota cubre el mismo dicho: las frases sobre el recorte del 15 % y la supresión de vacantes coinciden con las del sitio del FA. Pero la cita que propone el resolvedor no es de Astori. El diario pone las cifras con su propia voz, en otra forma («cuatro puntos» que «está previsto que pase a dos», en futuro) y con «débito y crédito (en restaurantes)». La `afirmacion` y el `fragmento` del chequeo son palabras de Astori: «Se ha disminuido en 2 puntos… de 9 a 5 puntos». La nota no se las atribuye. Suma un grupo sin respaldar lo que el chequeo afirma que él dijo. Montevideo Portal del mismo día tampoco trae las cifras (`--buscar "puntos"` sin coincidencias). Sobre la independencia: El Observador atribuye sus citas a un «diálogo con el área de comunicación del Frente Amplio». Aun con `grupo` distinto, el origen es el mismo material del partido, cuya ficha dice que nunca cuenta como segunda fuente independiente.
- cita_de_contexto: "Astori dijo que hay “un aumento oculto de impuestos” porque hay una rebaja de las exoneraciones tributarias sobre el IVA que rigen para las compras con tarjeta de débito y crédito (en restaurantes). Hoy el beneficio es de cuatro puntos y está previsto que pase a dos puntos en el caso del débito." y "afirmó en dialogo con el área de comunicación del Frente Amplio" (https://www.elobservador.com.uy/nota/para-astori-se-estimularon-conductas-devaluatorias-desde-el-gobierno-2020312201523)
- accion_sugerida: El editor no suma la fuente al chequeo, y la parte de `cambio_de_rating` sale `rechazada` con ese fundamento. Lo que cambiaría la decisión es la grabación del 12/3 o una nota de otro grupo que atribuya a Astori los «2 puntos» y el «9 a 5».

### chequeos/astori/2020-03-13-… y declaraciones/astori/2020-03-13-aumento-oculto-impuestos-iva-debito-2020 — fecha
- severidad: corregir
- tipo: contexto_omitido (fecha del dicho)
- objecion: La fecha correcta es **2020-03-12**. La fijan dos medios de grupos distintos. El Observador, publicado el 12/3, dice «se refirió este jueves», y el 12/3/2020 fue jueves. Montevideo Portal, también del 12/3, habla de las medidas que «anunció este miércoles el gobierno» y de las «medidas de ayer». La nota del FA, fechada el 13/3, repite las mismas frases, así que es el mismo dicho publicado un día después. `declaraciones.md` dice que la fecha es cuándo lo dijo, no cuándo lo publicó el medio.
- cita_de_contexto: "se refirió este jueves al paquete de medidas anunciado por el gobierno de la coalición multicolor" (El Observador, url arriba); "hay un aumento oculto de impuestos, porque hay una rebaja de las ventajas o exoneraciones tributarias sobre el IVA, que se tomaron como parte de las medidas de ayer" (https://www.montevideo.com.uy/Noticias/Danilo-Astori-definio-las-modificaciones-en-el-IVA-como-un-aumento-oculto-de-impuestos--uc746816)
- accion_sugerida: Una sola corrección `error_factual` con dos pares:
  `{de: declaraciones/astori/2020-03-13-aumento-oculto-impuestos-iva-debito-2020, a: declaraciones/astori/2020-03-12-aumento-oculto-impuestos-iva-debito-2020}` y
  `{de: chequeos/astori/2020-03-13-descuento-iva-debito-y-gastronomia-2020, a: chequeos/astori/2020-03-12-descuento-iva-debito-y-gastronomia-2020}`.
  Con la fecha nueva, «a dos semanas de asumir» del resumen pasa a ser «a menos de dos semanas». Hay una diferencia de origen para dejar en `notas_internas`: El Observador habla del área de comunicación del FA y Montevideo Portal de «declaraciones a la prensa consignadas por 970 Noticias (radio Universal)».

### chequeos/astori/2020-03-13-… — mitad débito
- severidad: corregir
- tipo: documento_previsible
- objecion: El análisis deja en `discutible` los «2 puntos» de débito porque no se puede leer el artículo derogado. Hay dos pistas de que la rebaja por débito era de 4 puntos hasta el Decreto 97/020, 2 generales más 2 adicionales desde 2017, y de que se derogaron los adicionales. Presidencia (23/5/2016) anunció una «nueva rebaja de dos puntos» que «se suma a una similar en vigencia, de igual monto». El Observador (12/3/2020) dice «Hoy el beneficio es de cuatro puntos». Las dos son pistas, no prueba. El documento previsible es la norma que creó los 2 puntos adicionales desde el 1/1/2017, anunciada con la Rendición de Cuentas 2015, y su decreto reglamentario, con el texto publicado en el Diario Oficial antes de la derogación. Está en IMPO, sin pasar por Wayback.
- cita_de_contexto: "Esta medida se suma a una similar en vigencia, de igual monto." (https://www.gub.uy/presidencia/comunicacion/noticias/80-recaudacion-adicional-empleados-pasivos-recaera-10-mayores-ingresos)
- accion_sugerida: Un corrector busca en IMPO esa norma y el texto original del artículo que 97/020 derogó.

### declaraciones/astori/2020-03-13-… — grabación primaria
- severidad: aviso
- tipo: documento_previsible
- objecion: Las dos notas de prensa vienen de una grabación del 12/3: la del área de comunicación del FA o la de 970 Noticias. Con audio o video, la declaración pasa a `textual` y no depende de un segundo grupo. La página https://www.2121.org.uy/novedades/entrevistas-y-columnas/item/1279-hubo-un-aumento-oculto-de-los-impuestos-y-gran-impericia-en-el-manejo-del-dolar (Asamblea Uruguay, sector de Astori) puede alojarla, pero `pnpm fuente` devolvió HTTP 403. Es un sitio partidario: nunca cuenta como fuente independiente, aunque sirve como registro primario si trae el audio.
- accion_sugerida: Buscar la grabación en los canales del FA, de Asamblea Uruguay o de 970 Noticias y transcribir con `pnpm transcribir`.

## Objeciones al lote

- **Ficha de El Observador (aviso, vale para cualquier persona).** El `grupo: werthein-hochbaum` describe el control accionario desde el 5/5/2022. Las notas de 2016 y 2020 son de antes, y la ficha no documenta quién era dueño hasta entonces: solo dice que lo fundó Ricardo Peirano. No aparece ningún vínculo con `scheck-aguirre` (El País), así que la independencia es plausible, pero la ficha no la prueba. Es el caso de la sección «Crítica» de `medios.md`: «`grupo` que no coincide con la propiedad documentada». Hace falta documentar la propiedad anterior a 2022 con una corrección a la ficha antes de contar El Observador de antes de 2022 como segundo grupo, para Astori y para cualquier otra persona.
- **Notas reextraídas.** Las tres de El Observador (23/5/2016, 27/5/2016 y 12/3/2020) empiezan en el primer párrafo, no a mitad de texto. Quedan defectos de forma: intertítulos pegados («Cambios en el IRPFAstori») y un «Más noticias» incrustado. No afectan las citas.
- **Resolvedor.** En los dos casos vio la diferencia de fecha y la resolvió mal. En 2016 confundió el hecho (la propuesta, del 23/5) con el dicho (Carve, 26/5). En 2020 identificó bien el dicho, pero tomó como de Astori cifras que el diario pone con su propia voz. La nota del 27/5/2016, que sí es segunda fuente de la declaración, está en el corpus (acf56814caab). Las otras tres resoluciones del mismo lote no están en esta crítica.
- **Incidente de esta crítica.** Probé con `pnpm fuente` una URL de Montevideo Portal armada a mano (…--uc745133). El sitio devolvió otra nota, sobre incendios en Australia, que quedó en el corpus como 4f399962d1269c5ca2231d5e6bf72c00bc715800 con un trabajo de Haiku encolado. No se cita en ningún lado. Conviene revisarla o borrarla del corpus.
- Sin riesgo legal: son dichos sobre política tributaria, sin denuncias.
- Simetría: la corrección toca solo chequeos de Astori porque son los que el resolvedor tenía. La prueba de mismo dicho y misma voz se aplica igual a toda resolución de cualquier persona.

## Objeciones al brief

- Sin violación de la Regla 0. El brief dice que el cambio de id «espera a la herramienta de pares». `correcciones.md`, en su versión actual, ya describe `promover --correccion` con `reemplaza`. Lo decide el orquestador.

## Discrepancias

Hay dos en `inbox/resoluciones/2026-09-16/discrepancias.yaml`. Las dos son de El Observador del 27/5/2016 contra el texto de Presidencia del 23/5/2016: la franja «$33.041 a los $50.110» contra «33.400 a 50.100», y «31 de junio» contra «30 de junio».

## Cobertura
```yaml
- medio: el-observador
  url: https://www.elobservador.com.uy/nota/aumentos-de-irpf-afectaran-a-quienes-ganen-mas-de-33-400-nominales-201652316150
  fecha: 2016-05-23
  evento: propuesto:rendicion-de-cuentas-2015-ajuste-fiscal-2016
  politico: astori
  tono: neutral
  justificacion: >-
    Atribuye cada anuncio al ministro sin adjetivar: «Astori indicó que las franjas 1 y 2 de IRPF se mantienen».
- medio: el-pais
  url: https://www.elpais.com.uy/informacion/astori-no-se-puede-evitar-subir-irpf-a-salarios-entre-33-401-y-50-100
  fecha: 2016-05-26
  evento: propuesto:rendicion-de-cuentas-2015-ajuste-fiscal-2016
  politico: astori
  tono: neutral
  justificacion: >-
    Expone su argumento y el de quienes lo cuestionan sin tomar partido: «El planteo proviene del Pit Cnt y de algunos sectores dentro del Frente Amplio».
- medio: el-observador
  url: https://www.elobservador.com.uy/nota/fa-planea-alternativa-a-suba-del-irpf-en-sueldos-menores-de-50-mil-2016527500
  fecha: 2016-05-27
  evento: propuesto:rendicion-de-cuentas-2015-ajuste-fiscal-2016
  politico: astori
  tono: neutral
  justificacion: >-
    Las críticas al ministro van atribuidas a su partido y no a la voz del diario: «en el FA consideran que el jerarca deberá deponer sus pretensiones».
- medio: el-observador
  url: https://www.elobservador.com.uy/nota/para-astori-se-estimularon-conductas-devaluatorias-desde-el-gobierno-2020312201523
  fecha: 2020-03-12
  evento: propuesto:medidas-fiscales-y-tarifas-marzo-2020
  politico: astori
  tono: neutral
  justificacion: >-
    Reporta sus críticas con verbos de atribución: «insistió en que existen incumplimientos respecto a las promesas realizadas en la última campaña electoral».
- medio: montevideo-portal
  url: https://www.montevideo.com.uy/Noticias/Danilo-Astori-definio-las-modificaciones-en-el-IVA-como-un-aumento-oculto-de-impuestos--uc746816
  fecha: 2020-03-12
  evento: propuesto:medidas-fiscales-y-tarifas-marzo-2020
  politico: astori
  tono: neutral
  justificacion: >-
    Presenta su postura como una más entre las críticas: «se sumó a las críticas por el aumento de las tarifas de UTE, OSE y Antel».
- medio: frenteamplio-uy
  url: https://frenteamplio.uy/noticias/12-noticias/1551-danilo-astori-hay-un-aumento-oculto-de-los-impuestos
  fecha: 2020-03-13
  evento: propuesto:medidas-fiscales-y-tarifas-marzo-2020
  politico: astori
  tono: favorable
  justificacion: >-
    Hace suya la tesis de Astori en un intertítulo con la voz del sitio, sin atribuirla: «Suba del impuesto más injusto del sistema tributario uruguayo».
```
