# Crítica — corrida 2026-09-16-correccion-batlle-lectura-chequeos-2000-2002

Lote: inbox/correcciones/batlle-lectura-2026-09-16/
Registros revisados: 5 de 5 (sin muestra). Corrección (`/correccion`), pedido de cinco puntos en `pedido.md`. `pnpm banco`: sin evidencia guardada para ninguno (según el brief).

Fuentes abiertas con `pnpm fuente`, y comprobado que cada copia del corpus trae el encabezado:
- archivo.presidencia.gub.uy/…/2002/junio/2002060302.htm: empieza por «03/06/02», trae la conferencia del 3 de junio, la carta de Bloomberg del 29 de mayo y las dos entrevistas. Copia completa.
- archivo.presidencia.gub.uy/…/2000/noviembre/2000112201.htm: empieza por «21/11/2000». Copia completa.
- impo.com.uy/bases/leyes/17502-2002 (con encabezado «Promulgación: 29/05/2002 Publicación: 31/05/2002»), impo.com.uy/bases/leyes-originales/17503-2002, impo.com.uy/bases/leyes-originales/17243-2000 (las dos con «Fecha de Publicación» al principio).
- parlamento.gub.uy/documentosyleyes/leyes/ley/17502: bajada en esta crítica (no estaba en el corpus). **La copia viene recortada al principio**: el texto arranca a mitad del articulado. La firma de sanción, al final, sí está.

## Resumen
```yaml
- registro: declaraciones[0]
  severidad: corregir
  tipo: presentacion
- registro: chequeos[0]
  severidad: corregir
  tipo: explicacion_alternativa
- registro: chequeos[1]
  severidad: corregir
  tipo: contexto_omitido
- registro: chequeos[2]
  severidad: corregir
  tipo: contexto_omitido
- registro: chequeos[3]
  severidad: corregir
  tipo: documento_previsible
```

## Objeciones por registro

### declaraciones[0] — 2002-05-30 — «nuestra mayoría –una coalición…» (punto 1 del pedido)
- severidad: corregir
- tipo: presentacion (y explicacion_alternativa, como aviso)
- objecion: El pedido plantea dos opciones y la que se sostiene es la segunda: **fue la entrevista del 30 de mayo**. La `fecha` del registro está bien y los ids no cambian, así que no hace falta `reemplaza:`. Se deduce de tres pasajes de la misma página. (a) La carta de Bloomberg está fechada «29 de mayo de 2002» y agradece la gestión «para la entrevista del día de mañana». (b) En la conferencia, Batlle cuenta que «La nota comenzó pues con el representante en habla española» y que «más tarde viene el otro periodista y me hace una nota en inglés». (c) La entrevista en español lleva el rótulo «ENTREVISTA CON EL REPRESENTANTE DE AGENCIA BLOOMBERG MARTÍN BOERR 30 DE MAYO DE 2002». La cita está en la otra, «ENTREVISTA CONCEDIDA POR EL PRESIDENTE BATLLE A LA CADENA TELEVISIVA BLOOMBERG NEWS», que no lleva fecha ni nombre. Por descarte es la de David Plumb (la carta dice «idioma inglés»), en la versión en español que publicó Presidencia, y se hizo en la misma jornada. Donde el pedido no tiene razón: el título de la fuente no es falso, porque es el rótulo de la primera sección de la página. Lo que está mal es la **`fecha` de la fuente**. `evidencia.fuentes[].fecha` es la fecha de publicación, la página dice «03/06/02» y el registro pone 2002-05-30. Lo mismo pasa en chequeos[0]; chequeos[1] ya pone 2002-06-03 para la misma URL. Aviso: la cita es una traducción de Presidencia, no las palabras de Batlle, y eso pesa en los dos chequeos que dependen de «la semana pasada» (ver chequeos[0]). El `resumen` lo insinúa («cuya versión en español») pero no dice que la entrevista fue en inglés.
- cita_de_contexto: "Tengo el agrado de dirigirme a usted a efectos de, en primer lugar, agradecerle su gestión para la entrevista del día de mañana con el Sr. Presidente" / "ENTREVISTA CON EL REPRESENTANTE DE AGENCIA BLOOMBERG MARTÍN BOERR 30 DE MAYO DE 2002" / "Tenemos apoyo político. Esa es la razón por la cual en menos de una semana el Parlamento votó todo. Además, nuestra mayoría" (https://archivo.presidencia.gub.uy/noticias/archivo/2002/junio/2002060302.htm)
- accion_sugerida: Desenlace parcialmente aceptada. Mantener `fecha: 2002-05-30`. Poner `fuentes[0].fecha: 2002-06-03` aquí y en chequeos[0]. Cambiar el `titulo` de la fuente por uno que diga lo que es la página, por ejemplo «Conferencia de prensa del 3 de junio de 2002 y entrevistas a Bloomberg del 30 de mayo». En el `resumen`, «entrevista en inglés con Bloomberg News, cuya versión en español publicó Presidencia junto con la conferencia de prensa del 3 de junio».

### chequeos[0] — 2002-05-30 — ley fiscal 17.502 (punto 2)
- severidad: corregir
- tipo: explicacion_alternativa (y presentacion)
- objecion: Se confirman tres cosas del pedido. (1) `afirmacion`, `analisis` y `dato_real.valor` fechan todo contra la conferencia del 3 de junio, cuando el dicho es del 30 de mayo. Además, «seis días antes de la conferencia» está mal hasta en su propia cuenta: del 29/5 al 3/6 van cinco días, y del 31/5 van tres. (2) El segundo párrafo de `dato_real.valor` y el de `analisis` son casi idénticos. (3) Falta decir que la ley se identifica por fecha y contenido, porque Batlle no dio número. Una premisa del pedido no se confirma: en el registro no hay doble espacio. `titulo` es `"La ley fiscal" votada la semana anterior…`, con comillas y un solo espacio, así que el doble espacio lo produce la página al imprimir las comillas (eso es de quien construye el sitio). **Otra premisa no se puede aceptar sin verificarla:** el pedido da por hecho que «la semana pasada» es compatible con la fecha del dicho. Según la firma de la ley, la Cámara de Representantes sancionó la 17.502 el **29 de mayo de 2002, un miércoles**, el día antes de la entrevista (jueves 30) y en la misma semana del calendario, no en la anterior. Hay dos lecturas que lo hacen compatible, y el análisis tiene que escribirlas como lecturas, no como hecho. La primera: la cita es una traducción, y «last week» o «this past week» en inglés puede querer decir los últimos siete días. La segunda: en la frase anterior Batlle dice «en menos de una semana el Parlamento votó todo», así que la cámara de origen pudo votar en la semana anterior. La fecha de la votación en el Senado, que fue la cámara de origen de la 17.502, no está en el registro.
- cita_de_contexto: "Sala de Sesiones de la Cámara de Representantes, enMontevideo, a 29 de mayo de 2002. GUILLERMO ÁLVAREZ, Presidente." (https://parlamento.gub.uy/documentosyleyes/leyes/ley/17502); "Promulgación: 29/05/2002 Publicación: 31/05/2002" (https://www.impo.com.uy/bases/leyes/17502-2002)
- accion_sugerida: `afirmacion` contra el dicho: «Dijo que la mayoría de gobierno había votado "la semana pasada" la ley fiscal (entrevista del 30 de mayo de 2002)». `dato_real.valor` con solo el dato: sanción el 29/05 en Representantes, promulgación el 29/05, publicación el 31/05 y las tasas que fija. Sumar a `dato_real.fuentes` la línea de sanción del Parlamento y la línea de promulgación de IMPO. En `analisis`, primero la comparación: sanción definitiva el día antes, en la misma semana. Después las dos lecturas, y después por qué la 17.502 es «la ley fiscal». Documento previsible para la cámara de origen: la ficha del asunto en el sistema de información legislativa del Parlamento o el Diario de Sesiones de la Cámara de Senadores de fines de mayo de 2002. La calificación (verdadero o impreciso por un día respecto de la semana del calendario) la decide el editor con esa fecha a la vista. `titulo` sin comillas internas y sin afirmar la semana. `fragmento` reducido a «la ley fiscal», para que no quede encimado con el de chequeos[1], que está contenido en el fragmento actual.

### chequeos[1] — 2002-05-30 — IVA a frutas y verduras, Ley 17.503 (punto 3)
- severidad: corregir
- tipo: contexto_omitido (y presentacion)
- objecion: Las dos partes del pedido se confirman. La `afirmacion` describe hechos («El Senado sancionó… Batlle la promulgó…») y no lo que él dijo. Y calificar «impreciso» por «frutas y verduras» frente a «frutas, hortalizas y flores» no entra en la regla: `impreciso` es para una cifra que le erra por poco (chequeos.md), y en el uso rioplatense «verduras» por «hortalizas» no es un error de dato. Pero pasar sin más a «verdadero» deja afuera el mismo problema de fecha que chequeos[0]: el Senado, que fue la última cámara, sancionó la 17.503 el 29 de mayo, el día antes del dicho. Hay además errores que el pedido no señala. (a) `dato_real.valor` dice «tres días antes de que Batlle se refiriera a ella en su conferencia de prensa del 3 de junio», y la mención fue en la entrevista del 30, el mismo día de la promulgación. (b) «No se encontró en esta sesión…» es narración de proceso en texto que lee el público. (c) El análisis resume lo dicho como «el Parlamento extendió el IVA al agro», que no es lo que dijo Batlle ni lo que hizo la ley. (d) Se omite que el IVA a frutas, flores y hortalizas era temporal: el art. 9 suspende la exoneración hasta el 1º de julio de 2005, y el art. 12 la ubica en la tasa mínima con condiciones.
- cita_de_contexto: "La exoneración dispuesta en el Literal A) del numeral 1) del artículo 19 del Título 10 del Texto Ordenado de 1996, quedará suspendida hasta el 1º de julio de 2005." / "Sala de Sesiones de la Cámara de Senadores, en Montevideo, a 29 de mayo de 2002." (https://www.impo.com.uy/bases/leyes-originales/17503-2002)
- accion_sugerida: Aceptar el punto 3. `afirmacion`: «Dijo que la mayoría de gobierno había votado la semana pasada una ley referente a la aplicación del IVA a frutas y verduras». Sacar lo de la conferencia y lo de «en esta sesión» de `dato_real.valor`, y agregar el art. 9 como cita. En el análisis, la misma lectura de «la semana pasada» que en chequeos[0], y cambiar «al agro» por «a frutas, flores y hortalizas, hasta 2005». La calificación sale de la fecha, no del vocabulario, con el mismo criterio que chequeos[0] y chequeos[2]. Documento previsible para la fecha en Representantes, que fue la cámara de origen: la ficha del asunto en el Parlamento o el Diario de Sesiones de la Cámara de Representantes de mayo de 2002.

### chequeos[2] — 2000-11-21 — «el de 0, el de 14 y el de 23» (punto 4)
- severidad: corregir
- tipo: contexto_omitido (y documento_previsible, presentacion)
- objecion: La contradicción que señala el pedido es real: el registro dice «discutible» y el análisis dice «las dos cifras… son exactas». Pero la causa no es la que el registro supone. El `dato_real` interpreta el «0» como la tasa cero de las exportaciones, y el párrafo de la propia fuente lo contradice. Batlle habla de extender el IVA a sectores exonerados («se le aplica a unos y a otros no»; «algún sector que estuviera, digamos, exonerado de pagar esa tasa, incorporarle a ese sector el pago de la tasa»), en respuesta a la pregunta por las emergencias médicas móviles del Mensaje Complementario. Su «0» son las **exoneraciones**. Hay documento previsible: el artículo 19 del Título 10 del Texto Ordenado 1996 (exoneraciones del IVA), en IMPO o en la DGI. La misma Ley 17.503, ya en el corpus, remite a ese artículo. Sobre la salida que propone el pedido, «impreciso» si la duda es exoneración contra tasa cero: por simetría con el punto 3, un rótulo técnico no es una cifra errada. Si el punto 3 descarta la imprecisión por vocabulario, aquí corresponde el mismo criterio: verdadero con una oración que aclare que formalmente es exoneración. Aplicar criterios distintos a dos chequeos del mismo lote sería una asimetría. «sin una cita puntual verificada en esta sesión» (`dato_real`) y «esta sesión no encontró» (`analisis`) son narración de proceso.
- cita_de_contexto: "El IVA en este país existe, el de 0, el de 14 y el de 23, se le aplica a unos y a otros no." … "algún sector que estuviera, digamos, exonerado de pagar esa tasa, incorporarle a ese sector el pago de la tasa." (https://archivo.presidencia.gub.uy/noticias/archivo/2000/noviembre/2000112201.htm)
- accion_sugerida: Parcialmente aceptada. Sumar a `dato_real.fuentes` el art. 19 del Título 10 del TO 1996 vigente en noviembre de 2000. Reescribir el `dato_real` y el `analisis` con el «0» como exoneración, según el párrafo de la fuente, y sin narración de proceso. Calificación con el mismo criterio que chequeos[1]. Si el art. 19 no aparece, queda `discutible` con `_faltante: dato_oficial`, y el análisis lo dice sin nombrar la «sesión».

### chequeos[3] — 2000-11-21 — Ley de Urgencia 17.243 y el agro (punto 5)
- severidad: corregir
- tipo: documento_previsible (y presentacion)
- objecion: La premisa del pedido no coincide con el registro. `dato_real.valor` no «solo da la fecha»: tiene cuatro párrafos sobre los capítulos I y II. Si la página muestra solo el primero, es un problema de plegado del sitio. Lo que sí tiene razón es que la única `cita` de `dato_real.fuentes` es el plazo de la exoneración del art. 4; las rebajas en sí no están citadas. Al releer la ley aparecen además tres errores. (a) El capítulo II «AGROPECUARIA» va de los artículos 3 a **10**, no de 3 a 9. El art. 10 rebaja un 25 % la Contribución Inmobiliaria Rural de 2000 y compensa a las intendencias con US$ 15.000.000: es la rebaja al agro con monto explícito, y el registro la omite. (b) El art. 1 «fija en 6,5 puntos» el aporte patronal de la industria manufacturera y deroga el art. 25 de la Ley 16.697, pero nada en el registro muestra que eso sea una baja. «bajó aportes patronales en varios sectores» no está respaldado para la industria sin el art. 25 de la 16.697, que ya está en el corpus. (c) «sobre todo» se mide por cantidad de artículos, y eso no mide cuántos recursos se bajaron. El art. 4 tiene condiciones omitidas: dos dependientes como máximo, y quedan fuera DISSE, BSE e IRP. El último párrafo de `dato_real.valor` es análisis. La calificación «verdadero» para lo central, que bajaron recursos al agro, se sostiene con los arts. 3, 4 y 10 citados. Bajarla a «discutible», como plantea el pedido, no corresponde, porque el documento oficial existe y está leído.
- cita_de_contexto: "Rebájase en un 25% (veinticinco por ciento), por única vez, la alícuota de la Contribución Inmobiliaria Rural cuyo pago deba efectuarse en el año 2000" / "Por el período 1º de enero a 31 de diciembre del año 2000 se reduce en un 0,387 o/oo (cero con trescientos ochenta y siete por mil) la citada tasa." (https://www.impo.com.uy/bases/leyes-originales/17243-2000)
- accion_sugerida: Parcialmente aceptada. Sumar citas de los arts. 3, 4 y 10 (misma URL). Corregir «artículos 3 a 9» por «3 a 10». Sacar el párrafo de análisis de `dato_real.valor`. O bien probar la baja del art. 1 con el art. 25 de la Ley 16.697, o bien no afirmarla. En el análisis, decir que el «sobre todo» no se puede medir en montos con el texto de la ley. Documento previsible para medirlo: la exposición de motivos y el informe de comisión del proyecto de Ley de Urgencia (Parlamento, 2000) o la estimación de costo fiscal del MEF o el BPS.

## Objeciones al lote
- **Fecha de la fuente inconsistente:** la misma URL de Presidencia figura con `fecha` 2002-05-30 en declaraciones[0] y chequeos[0] y con 2002-06-03 en chequeos[1]. La correcta es 2002-06-03, según el encabezado «03/06/02».
- **Narración de proceso en texto para el lector** («en esta sesión», «esta sesión no encontró»): 3 apariciones, en chequeos[1].dato_real, chequeos[2].dato_real y chequeos[2].analisis. Es un defecto que puede ser sistémico y conviene medirlo con un comando para todas las personas por igual, no solo para Batlle: `rg -n "esta sesión|en esta sesión" content/`.
- **`dato_real` que repite el análisis:** 2 de 4 chequeos (chequeos[0] y chequeos[3]). Un script puede medirlo para todo el Veracímetro comparando la similitud entre `dato_real.valor` y `analisis`.
- **Datos sin chequeo en la misma cita** (para `## chequeos_pendientes`): «una referida al Banco Hipotecario» (la ley y su fecha, en IMPO) y «en menos de una semana el Parlamento votó todo» (la ficha del asunto en el Parlamento).
- **Simetría:** el pedido sale de leer como lector solo la ficha de Batlle. No es una violación de la Regla 0, porque se origina en una página concreta. Pero los cuatro defectos de forma (fecha contra un evento equivocado, dato repetido en el análisis, «impreciso» por vocabulario, narración de proceso) conviene revisarlos con la misma lectura en los chequeos de todas las personas.
- **Herramienta:** `pnpm fuente` bajó la página de la Ley 17.502 del Parlamento, que no estaba en el corpus, e hizo una consulta de disponibilidad a Wayback («✔ Wayback: …»). No se usó `inventario`, `sesion` ni CDX a propósito. Lo dejo dicho por la sensibilidad de la IP.
- No hay registros sin mirar.

## Objeciones al brief
- Sin objeciones de Regla 0. El brief está bien planteado: pide verificar cada premisa del pedido. Dos premisas del pedido no coinciden con el registro: el doble espacio del título (punto 2) y que el dato real «solo da la fecha» (punto 5).

## Cobertura
Sin registros de tono: todas las fuentes leídas son documentos oficiales (Presidencia, IMPO, Parlamento); no se leyó ninguna nota de prensa.

```yaml
[]
```
