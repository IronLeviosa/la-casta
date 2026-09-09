# Crítica — corrida 2026-09-09-ocr-huecos-ute-antel-anp

Modelo: Opus 5 (1M context) — `claude-opus-5[1m]`. Es el único rol que corre en Opus, por la regla
de modelos del mantenedor del 2026-09-07 (CLAUDE.md, «Reglas para agentes», punto 14). La tabla de
«Modelos por rol» dice Opus para el crítico y eso es lo que corrió: no hay divergencia que declarar.

Lotes: `inbox/empresas/ute/2026-09-09-ocr/`, `inbox/empresas/antel/2026-09-09-ocr/`,
`inbox/empresas/anp/2026-09-09-ocr/`
Registros revisados: 3 fichas de empresa, 7 bloques `finanzas[]` modificados (UTE 2017; ANTEL 2007,
2011, 2013; ANP 2016, 2017, 2021), 32 bloques de objeción (7 bloquea, 17 corregir, 6 aviso, 2 sin_objeción).

Qué verifiqué yo, no el investigador: releí los cinco documentos con `pnpm fuente` (UTE 2017, ANTEL
2007, ANTEL 2011, ANTEL 2013, ANP 2016, ANP 2017, ANP 2021) y comprobé cada cifra que cambia contra
la aritmética interna del propio documento o contra un segundo documento. Comparé además cada bloque
`finanzas[]` del lote contra el publicado en `content/empresas/*.yaml` con un diff estructurado: **solo
cambian los siete años declarados y ningún campo de nivel superior**, lo cual confirma que los lotes
son copias fieles salvo lo anunciado. `pnpm validar --inbox` pasa en los tres (606 registros, 22-23
avisos), así que todo lo que sigue son objeciones de criterio, no de esquema.

Cero registros `cobertura` y cero `discrepancias.yaml`: en los tres lotes no hay una sola fuente de
prensa. Las 100 % de las fuentes son `documento_oficial` (estados contables auditados). No hay nota
periodística a la que asignarle tono ni publicación que contrastar contra un registro primario,
porque las fuentes **son** el registro primario. Lo digo explícitamente porque la ausencia de esos
registros también se audita.

---

## Lote UTE — `inbox/empresas/ute/2026-09-09-ocr/`

Año modificado: 2017 (antes sin ninguna cifra).

### finanzas[2017].impuestos_pagados — $ 11.147,7 M / USD 387,0
- severidad: **bloquea**
- tipo: cita_fuera_de_contexto
- objecion: la única cita del campo es el **encabezado** del cuadro, no la cifra. Dice literalmente
  `Literal D      Impuestos pagados por la empresa en el ejercicio 2017 en pesos uruguayos` y no
  contiene ningún número. El registro afirma 11.147,7 M con una cita que no lo respalda. Pasa
  `validar --red` (la cita existe en el texto) y aun así el lector no puede verificar nada: es
  exactamente el modo de falla que la regla de citas existe para impedir. Agrava que el año vecino
  ya publicado, 2016, sí trae el cuadro entero en su cita (IVA, renta, patrimonio, retenciones y
  `Total 8.469.674.071`): dos años consecutivos, dos estándares.
- cita_de_contexto: leí el cuadro completo y **la cifra es correcta**. El documento cierra dos veces:
  las once sublíneas de retenciones (`1.223.448 + 44.549.022 + 1.604.039.857 + 1.314.196 + 2.942.663
  + 303.044 + 2.502.405 + 8.490 + 240.835 + 84.924.259 + 11.602.831`) dan exactamente el subtotal
  impreso `RETENCIONES 1.753.651.050`, y los trece conceptos del Literal D dan exactamente el total
  impreso `Total 11,.147.731.653`. (`https://portal.ute.com.uy/sites/default/files/docs/UTE%20EEFF%20e%20Informe%20de%20Auditor%C3%ADa%20al%2031%2012%2017_compresi%C3%B3n1.pdf`,
  `--desde 505700`.) Es decir: el dígito no depende del OCR, lo determina la aritmética de la propia
  nota, tal como pide la regla 5 del diccionario. Lo que falta es **escribirlo en el registro**.
- accion_sugerida: reemplazar la cita por el cuadro con sus conceptos y el `Total`, con el mismo
  formato que usa 2016. Dejar constancia en `nota` de que el OCR imprimió `11,.147.731.653` y
  `2.324.662,454` con separadores espurios y de que la suma de los conceptos determina la cifra.

### finanzas[2017].transferencias_al_estado — $ 10.898,5 M / USD 378,3
- severidad: corregir
- tipo: contexto_omitido
- objecion: dos cosas. (a) El `titulo` de la fuente dice «Sección II, **Literal E**», y el texto
  citado no es el Literal E. El Literal E de los Separados dice `El pago de versión de resultados
  realizado en el presente ejercicio ascendió a $ 10.898.512,920 (ver Nota 5.18)`. El párrafo que el
  registro cita es la nota de «Versión de resultados» del patrimonio, y aparece **dos veces** en el
  PDF: en el carácter 179587, dentro de `NOTAS A LOS ESTADOS FINANCIEROS CONSOLIDADOS`, y en el
  434055, dentro de los Separados. El valor no cambia entre bloques, así que no hay error de cifra,
  pero el `titulo` afirma una procedencia que el documento no tiene y el sitio imprime ese `titulo`.
  (b) El párrafo sigue, y lo que sigue es lo que el lector necesita para leer la serie.
- cita_de_contexto: `Durante el presente ejercicio fue vertida a Rentas Generales la suma de
  $ 10.898.512.920 ($ 6.785.864.320 en 2016), de los cuales, $ 2.379.232.920 corresponden a la
  versión a cuenta del resultado del ejercicio 2017 y $ 4.051.880.000 (U$S 140.000.000) al ajuste a
  la versión 2017 (…). La diferencia, $ 4.467.400.000, corresponde a la cancelación de la deuda
  asumida al cierre del ejercicio anterior (Nota 5.14) por concepto de ajuste de la versión de
  resultados del ejercicio 2016.` (mismo PDF, carácter 434055).
- accion_sugerida: corregir el `titulo` a «Sección II, nota de Versión de resultados (Nota 5.18)» y
  llevar el desglose al `concepto`, en una oración, exactamente como ya lo hace el 2018 publicado
  («Dicha cifra incluía $ 2.543.875.860 por concepto de versión a cuenta del resultado del ejercicio
  2018 y $ 7.929.708.113 por ajuste de la versión del ejercicio 2017»). Sin eso, el salto 2016 →
  2017 (6.785,9 → 10.898,5) parece un cambio de política y es en buena parte el pago de un ajuste
  del año anterior.

### finanzas[2017].capitalizaciones_del_estado — **ausente**
- severidad: corregir
- tipo: asimetria
- objecion: el balance de 2017 **sí** trae una capitalización del Estado y el lote no la cargó. La
  ficha carga esa misma línea («Aportes de OPP a capitalizar») para 2011, 2013 y 2014, y el
  `resumen` publicado dice «aportes de OPP a capitalizar en 2011, 2013 y 2014 (entre USD 0,9 y 6,2
  millones cada año)». Aplicar el criterio a tres años y no al cuarto, con el documento leído en la
  misma sesión, es asimetría dentro de la propia ficha.
- cita_de_contexto: `ESTADOS FINANCIEROS SEPARADOS / ESTADO DE CAMBIOS EN EL PATRIMONIO / (…)
  Saldos finales al 31.12.16  84.280.269.850 (…) / Movimientos del ejercicio / Aportes OPP a
  capitalizar   5.18   93.619,.467 (…) 93.619.467` (mismo PDF, `--desde 283900`). Cierra la
  aritmética: 84.280.269.850 + 93.619.467 = 84.373.889.317, que es el `Saldos finales al 31.12.17`
  impreso. Son $ 93,6 M / USD 3,25 M al cierre de 28,807.
- accion_sugerida: cargar `capitalizaciones_del_estado: 93.6` con esa cita. Y anotar como pendiente
  que 2015, 2016, 2018 y 2019 tienen la misma línea sin cargar (2016: $ 81.250.652 en el mismo
  estado); si no se cargan todos, decirlo en el `resumen`, no dejar el hueco mudo.

### resumen (ficha completa, copiado sin cambios)
- severidad: **bloquea**
- tipo: contexto_omitido
- objecion: el lote copió la ficha entera y no tocó el `resumen`, que el sitio imprime arriba de la
  tabla. Con 2017 cargado, el `resumen` contradice su propia tabla en cinco puntos, y tres de ellos
  son máximos de serie que cambian de dueño:
  1. «El año 2017 no tiene cifra en esta ficha porque los estados financieros de ese ejercicio y sus
     columnas comparativas (2016 y 2018) están publicados por UTE solo como escaneos sin capa de
     texto extraíble.» → falso después de esta corrida.
  2. «con datos disponibles para 22 de los 23 ejercicios» → 23 de 23.
  3. Resultado: «positivo en los diecinueve restantes, entre USD 69,5 millones (2004) y **USD 430,5
     millones (2014)**» → 2017 es USD 486,7 M, nuevo máximo de la serie.
  4. Tributos: «estuvo entre USD 152,4 millones (2021) y **USD 333,6 millones (2025)**» → 2017 es
     USD 387,0 M, nuevo máximo.
  5. Versión de resultados: «entre cero (2009, sin adelanto ese año) y **USD 323,2 millones (2018)**»
     → 2017 es USD 378,3 M, nuevo máximo.
  Publicar el lote tal cual deja al lector con un párrafo que dice que el dato no existe encima de
  una tabla que lo muestra, y con tres récords mal atribuidos.
- accion_sugerida: el editor reescribe esos cinco tramos del `resumen` en la misma corrección. Si el
  `resumen` no se puede tocar en un `--correccion` de tipo `error_factual`, se abre una segunda
  corrección de tipo `presentacion` en el mismo commit; lo que no puede pasar es que se promueva la
  tabla sin el texto.

### finanzas[2017].deuda_financiera — $ 44.411,3 M / USD 1.541,7
- severidad: corregir
- tipo: presentacion
- objecion: el valor está bien y lo verifiqué (abajo). Lo que objeto es el `concepto`: 45 palabras en
  una sola oración con paréntesis anidados, y la página lo imprime como nota al pie de la celda
  (`CLAUDE.md`, «Empresas públicas»: «`concepto` y `nota` son una oración, porque van como notas al
  pie de la tabla»; lista de control, punto 5).
- cita_de_contexto: verificado en los **Separados** (no en los Consolidados): `NOTAS A LOS ESTADOS
  FINANCIEROS SEPARADOS / NOTA 8 (…) El Ente gestiona su estructura de financiamiento (…) Deuda (i)
  44.411.305.473  36.935.893.156 / Efectivo y equivalentes (12.380.514.374) (10.996.122.427) /
  Deuda neta 32.030.791.099  25.939.770.729 / Patrimonio (ii) 126.733.335.279 / Deuda neta sobre
  patrimonio 25,3%` (mismo PDF, carácter 455002). Tres controles: 44.411.305.473 − 12.380.514.374 =
  32.030.791.099 exacto; 32.030.791.099 / 126.733.335.279 = 25,27 % ≈ el 25,3 % impreso; y la
  comparativa 2016 (36.935.893.156) es idéntica al 2016 ya publicado, que salió de un PDF con capa de
  texto. La versión **consolidada** de la misma nota da otra cifra (`Deuda (i) 54.552.462.812
  43.708.758.445`, carácter 200519): el lote tomó la correcta.
- accion_sugerida: dejar el `concepto` en una oración («Deuda financiera neta de corto y largo plazo
  según la Nota 8 de los Estados Financieros Separados») y mover «mismo criterio que 2016» a `nota`.

### finanzas[2017].deuda_financiera — definición no homogénea en la serie
- severidad: aviso
- tipo: contexto_omitido
- objecion: preexistente, no lo introduce este lote, pero el lote lo consolida. 2016 y 2017 usan la
  «Deuda (i)» de la nota de gestión de riesgo (deuda financiera neta de corto y largo plazo, incluye
  derivados y arrendamientos financieros); 2018 y 2019 usan «Préstamos y otros pasivos financieros,
  corriente más no corriente» de la Nota 5.13. Son dos definiciones distintas graficadas en la misma
  línea, y ahora quedan pegadas (2016-2017 con una, 2018 con otra).
- accion_sugerida: el diccionario ya prevé esto («Si el balance la muestra neta de intereses a vencer
  o cambia de convención, se dice una vez en `nota`»). Decirlo una vez en el `resumen` de UTE, o
  homogeneizar la serie en una corrida posterior.

### finanzas[2017].resultado_ejercicio — $ 14.020,3 M / USD 486,7
- severidad: aviso
- tipo: sin_objecion (valor) / contexto_omitido (nota)
- objecion: el valor es correcto y está determinado, pero el documento devuelve **tres lecturas OCR
  distintas** de los últimos dígitos y el registro no lo dice. Estado de Resultados Separado:
  `14.020.331.048`; Estado de Resultados Consolidado (línea «atribuible a la Controladora»):
  `14.020.351.048`; Estado de Flujos de Efectivo Separado: `14.020.331.045`.
- cita_de_contexto: la aritmética lo cierra sin ambigüedad. En los Separados: `Resultado del
  ejercicio 14.020.331.048  12.189.879,271 / (…) Reserva por conversión 5.18 (195.855.349)
  (207.832.351) / Resultado integral del ejercicio 13.824.475.699  11.982.046.920` (carácter ~283000,
  búsqueda `12.189.879,271`) → 13.824.475.699 + 195.855.349 = **14.020.331.048** exacto. Además la
  comparativa 2016 (12.189.879.271) coincide con el 2016 ya publicado desde un PDF con texto, lo que
  confirma que se leyó el bloque Separados y no el Consolidado (cuyo 2016 es 12.242.502.121).
- accion_sugerida: una frase en `nota`: la cifra la determina la reconciliación del resultado integral,
  no la lectura directa del OCR.

### segmentos[] de UTE 2017 y lo que dice `notas.md`
- severidad: aviso
- tipo: contexto_omitido
- objecion: `notas.md` afirma «el balance de UTE no desagrega por segmento de negocio de forma
  comparable a los otros años ya publicados». Es inexacto: el balance **sí** trae `NOTA 12
  INFORMACIÓN POR SEGMENTOS DE OPERACIÓN`, tanto en el bloque Consolidado como en el Separado, con
  un cuadro Generación / Trasmisión / Distribución / Comercial / Servicios de consultoría / Otros.
  La decisión de la ficha de no cargarlos es correcta y **ya está fundada** en el `resumen`
  publicado, que explica que UTE «declara expresamente que no es posible atribuir el resultado a cada
  segmento por separado porque la actividad está integrada verticalmente: todo el ingreso por venta
  de energía se expone dentro de un único segmento, "Comercial"». Lo que hay que arreglar es la
  redacción de `notas.md`, no el registro.
- cita_de_contexto: `NOTA 12 INFORMACIÓN POR SEGMENTOS DE OPERACIÓN (…) 2017 Generación Trasmisión
  Distribución Comercial Servicios de consultoria Otros Total / Ingresos 50.575.363 48.404 4.733.986
  55.417.753` (mismo PDF, carácter 496648, bloque Separados).
- accion_sugerida: reescribir esa viñeta de `notas.md`: el balance desagrega, pero concentra todo el
  ingreso en «Comercial», por lo que cargar `segmentos[]` no aportaría información y sería incoherente
  con el resto de la serie de UTE.

### Método
- severidad: aviso
- tipo: sin_objecion
- objecion: `consultas.jsonl` registra un `WebFetch` sobre `portal.ute.com.uy/institucional/...`
  «solo para ubicar URL del PDF, no citado». No viola la regla 2 (que prohíbe WebFetch sobre lo que
  se va a citar) y está declarado, que es lo correcto. Igual se puede evitar: el mismo lote corrió
  `pnpm inventario portal.ute.com.uy --desde 2017 --hasta 2018` con 66 documentos.

### comparaciones[] de la ficha de UTE (preexistente, se re-promueve con el lote)
- severidad: aviso
- tipo: presentacion
- objecion: las cinco `comparaciones[]` de UTE salen del **mismo** documento
  (`pv-magazine-latam.com/2026/07/23/en-el-cono-sur-...`). `CLAUDE.md` es explícito: «Un análisis con
  varias cifras de una misma fuente tiene página propia (`analisis`), no filas sueltas en una tabla»
  y «El validador avisa cuando tres o más comparaciones salen del mismo documento». Corresponde un
  registro en `content/analisis/` con su `autor_es` y el cotejo de cada cifra, y una sola fila en la
  ficha. No es de este lote, pero el lote vuelve a promover la ficha entera.
- accion_sugerida: anotarlo para una corrida propia; no bloquea esta.

---

## Lote ANTEL — `inbox/empresas/antel/2026-09-09-ocr/`

Años modificados: 2007 (cambian valores), 2011 y 2013 (se agregan campos).

**Lo primero, porque decide el resto: la convención está bien aplicada.** El balance de 2007 está
reexpresado por inflación y lo dice él mismo: `Las cuentas del estado de resultados fueron
actualizadas aplicando a sus valores de origen coeficientes mensuales basados en el índice general
de ajuste (…) El resultado neto por exposición a la inflación, derivado de la corrección monetaria
integral de los estados contables para reflejar el efecto de las variaciones en el poder adquisitivo
de la moneda, fue imputado a los resultados del ejercicio`
(`https://antel.com.uy/documents/37544/378823/estados-contables-2007.pdf/ae5aa7f3-dd21-fed2-ec2a-45e9d3c5a7df`,
búsqueda `reexpres`). La regla 1 del diccionario dice «se carga cada año desde su propio balance», y
eso es lo que hizo el lote: 2.152.516 en moneda de cierre de 2007, en vez de 2.290.911 en moneda de
cierre de 2008. **Está bien.** Y lo confirmé de una manera que el lote no aprovechó: el cociente
entre lo publicado y lo nuevo es **el mismo coeficiente 1,0643 en las cuatro magnitudes**, hasta la
quinta cifra:

| Magnitud | Balance 2008 (publicado) | Balance 2007 (lote) | Cociente |
|---|---|---|---|
| Resultado | 2.290.911 | 2.152.516 | 1,06430 |
| Transferencias | 2.212.576 | 2.078.913 | 1,06430 |
| Deuda financiera | 511.387 | 480.494 | 1,06430 |
| Ingresos por segmento (total) | 15.881.679 | 14.922.258 | 1,06429 |

Cuatro magnitudes independientes con un único coeficiente de reexpresión es la mejor confirmación
posible de los dígitos nuevos del OCR, y también prueba que las cifras viejas **no estaban mal
leídas**. Eso último tiene consecuencias, abajo.

### finanzas[2007].transferencias_al_estado.usd — 84,5 → 96,7
- severidad: **bloquea**
- tipo: contexto_omitido
- objecion: el lote cambió la cifra en dólares sin decirlo en ningún lado, rompiendo una convención
  que la propia ficha declara y borrando la fuente que la respaldaba. El `resumen` publicado dice:
  «Entre 2003 y 2007, la cifra en dólares de `transferencias_al_estado` es la efectivamente pagada,
  convertida al tipo de cambio del momento del pago, no al de cierre del ejercicio». Y el `resumen`
  además establece que **los dólares son la base de comparación entre años**: «Las cifras en dólares
  no cambian por ese efecto, así que son la base que usa esta ficha para comparar entre años de todo
  el período». El lote pone 2.078,9 / 21,5 = 96,7, que es exactamente lo que la convención dice que
  no hay que hacer, y deja 2007 fuera de línea con 2003-2006, que siguen con el criterio viejo.
- cita_de_contexto: la cifra oficial de ANTEL para 2007 es 84,5: `Contribuciones a rentas generales
  (1) 89,6 84,5 93,7 114,5 91,5` («Datos Financieros y Operativos Relevantes de ANTEL, 2004-2008»,
  `https://www.antel.com.uy/documents/37544/378823/datos-financieros-y-operativos-2008.pdf/b8efe60b-b90e-f853-758f-da61c743b1f2?t=1755713582110`,
  columnas en orden 2008→2004; el mismo documento y el mismo orden sostienen el 2006 publicado).
  84,5 es coherente con los pesos históricos que declara el propio balance de 2007
  (1.975.257 miles / 84,5 = 23,4, el tipo de cambio promedio del año), no con el de cierre.
- accion_sugerida: dejar `usd: 84.5`, restituir la fuente «Datos Financieros y Operativos
  Relevantes» y explicar en `concepto` que el peso cambia de base (moneda de cierre de 2007) pero el
  dólar sigue el criterio declarado en el `resumen`. Si el editor prefiere cambiar la convención,
  que la cambie **para 2003-2007 completo** y reescriba el `resumen`; lo que no se puede es cambiarla
  para un año solo y no decirlo.

### finanzas[2007] — fuentes de corroboración eliminadas
- severidad: corregir
- tipo: contexto_omitido
- objecion: el lote sacó de `resultado_ejercicio` y de `transferencias_al_estado` la fuente «Datos
  Financieros y Operativos Relevantes de ANTEL, 2004-2008», que es un documento **con capa de texto**
  y el único que confirma el OCR desde afuera. La regla 5 del diccionario dice que un dígito que
  depende del OCR se publica «solo si otro documento con texto lo confirma o la aritmética interna lo
  determina»: acá el otro documento existe, el investigador lo tenía en la ficha, y lo borró. Con
  `Resultado neto del ejercicio 80,5 100,1 89,7 100,8 72,0`, el 100,1 de 2007 × 21,5 = 2.152,5, que
  es exactamente la cifra nueva: la corroboración es perfecta y no está en el registro.
- accion_sugerida: reponer las dos fuentes como segunda cita de cada campo y anotar la corroboración
  en `nota`.

### finanzas[2007].nota — no dice que el balance está reexpresado
- severidad: corregir
- tipo: contexto_omitido
- objecion: el brief pregunta esto explícitamente. La `nota` dice de dónde salió la cifra y qué
  reemplaza, pero no dice **en qué moneda está**. El lector que compare 2006 (moneda de cierre 2008)
  con 2007 (moneda de cierre 2007) y con 2008 (moneda de cierre 2008) ve un pozo del 6,4 % en 2007
  que no existió. Y el propio documento entrega el dato que falta: la nota d) dice que la
  transferencia fue de `$ 2.078.913 miles ($ 1.975.257 miles en pesos históricos)`.
- accion_sugerida: `nota` en una oración: «Cifras en moneda de cierre del 31/12/2007 (el balance está
  reexpresado por inflación); el monto nominal transferido a Rentas Generales fue de $ 1.975.257
  miles». Y revisar que el `resumen` («cada año de esta ficha indica en su nota la moneda de cierre a
  la que está expresado») siga siendo cierto para 2007.

### finanzas[2007].deuda_financiera.concepto y transferencias.concepto — «cita mal alineada»
- severidad: corregir
- tipo: contexto_omitido
- objecion: los dos `concepto` afirman que la cifra publicada venía «de una cita mal alineada de la
  columna comparativa del balance de 2008». Es falso. Las cuatro cifras viejas son exactamente
  1,0643 × las nuevas (tabla de arriba): eran lecturas **correctas** de la columna comparativa
  reexpresada. La deuda vieja, 511,4, sale de 99.965 + 411.422 = 511.387 en ese mismo bloque. Un
  `concepto` publicado que le atribuye al sitio un error de lectura que no cometió es una afirmación
  sin respaldo sobre el propio registro, y va a la página.
- cita_de_contexto: verifiqué la deuda nueva en dos lugares del balance de 2007: el Estado de
  Situación Patrimonial (`Pasivo Corriente / Deudas / Financieras 13  93.926  179.436 (…) Pasivo No
  Corriente / Deudas a largo plazo / Financieras 13  386.568  630.922`, carácter 2028) y la Nota 3
  (`Deudas financieras  22.343.568  480.494  28.589.512  810.358`). 93.926 + 386.568 = 480.494 exacto,
  y 179.436 + 630.922 = 810.358 exacto para 2006. La cifra es sólida; la explicación de por qué
  cambió, no.
- accion_sugerida: reescribir los dos `concepto`: «cifra del balance propio de 2007, en moneda de
  cierre de ese ejercicio; la cifra anterior era la misma partida reexpresada a moneda de cierre de
  2008 en el balance siguiente (coeficiente 1,0643)». Y agregar la cita del Estado de Situación
  Patrimonial, porque el `concepto` menciona $ 93.926 y $ 386.568 y **ninguna cita del registro los
  trae**.

### finanzas[2007].impuestos_pagados — $ 4.064,9 M (campo nuevo)
- severidad: corregir
- tipo: contexto_omitido
- objecion: la suma cierra (contribuyente 1.785.711 + 1.188.038 + 307.815 + 27.926 + 203.155 =
  3.512.645; retención 514.580 + 4.248 + 3.482 + 16.641 + 860 + 1.174 + 6.133 + 1.104 + 2.934 + 1.078
  = 552.234; total 4.064.879 = los 4.064,9 del registro), y el Impuesto al Patrimonio (307.815) está
  confirmado dos veces en el mismo documento, en la nota c) y en la Nota 17 de Gastos Operativos. Lo
  que falta es el contexto que la propia cita del registro trae y el `concepto` no recoge: **el
  documento avisa que dos de los cinco conceptos de contribuyente no son pagos sino provisiones**.
  IRIC (1.188.038) + IP (307.815) = 1.495.853 miles, el **37 %** del total. La regla 3 del diccionario
  es «caja, no devengado, en transferencias e impuestos», así que este año se aparta de la convención
  y el registro no lo dice.
- cita_de_contexto: `c) Impuestos pagos en calidad de contribuyente y de agente de retención / Los
  valores responden a los impuestos liquidados en el presente ejercicio, con excepción del Impuesto a
  la Renta de Industria y Comercio e Impuesto al Patrimonio, que se presentan por las provisiones
  realizadas al 31 de diciembre de 2007.` (carácter 80709). Es la misma frase que el lote ya cita:
  está en el registro y no está en el `concepto`.
- objecion secundaria: el documento **no trae línea `Total`**; los 4.064,9 son una suma del sitio.
  Está permitido y el `concepto` lo insinúa, pero conviene decirlo con esas palabras. Además la
  primera línea del bloque de retención sale del OCR como `Impuesto al Valor Agregado (IVA)  -
  514.580`: verifiqué que el resto del bloque tiene una sola columna, así que el guion es un artefacto
  y no una columna 2006 vacía, pero eso hay que dejarlo escrito.
- accion_sugerida: `concepto` en una oración que diga que IRIC e IP van por provisión según la propia
  nota, y `nota` que diga que el total es suma del sitio (el documento no lo imprime).

### finanzas[2011].resultado_ejercicio — cita ilegible
- severidad: corregir
- tipo: presentacion
- objecion: la cita son 25 números sin etiquetas, encabezados por `Resultado neto del ejercicio` y
  `31 de diciembre 431 de diciembre` (el `431` es OCR de `31`). El lector no puede decir cuál de los
  25 es el resultado. La página muestra las citas.
- cita_de_contexto: el valor está bien: `3.096.102` es el último de la columna 2011 y coincide
  exactamente con el ya publicado, que salió de la columna comparativa del balance de 2012 (PDF con
  capa de texto): `Resultado neto antes de impuesto a la renta 21.1 5.204.237 3.749.108 / Impuesto a
  la renta (782.680) (653.006) / Resultado neto del ejercicio 4.421.557 3.096.102`. Dos documentos, el
  mismo número.
- accion_sugerida: recortar la cita a las líneas que importan y decir en `titulo` que el OCR separó
  las etiquetas de las cifras. Si no hay tramo contiguo legible, citar el balance de 2012 como
  segunda fuente del mismo valor, que es lo que efectivamente lo confirma.

### finanzas[2011] y [2013].impuestos_pagados — $ 3.792,5 M y $ 3.506,4 M (campos nuevos)
- severidad: corregir
- tipo: contexto_omitido
- objecion: las dos sumas cierran contra sus propios componentes (2011: 3.052.803 + 739.672 =
  3.792.475; 2013: 2.132.787 + 1.373.589 = 3.506.376), pero **sumar dígitos del OCR no los confirma**:
  el total no es un dato del documento, es una operación sobre las mismas lecturas. No hay, para
  ninguno de los dos años, ni línea `Total` impresa ni segundo documento. Y hay tres dígitos que
  piden confirmación antes de publicarse:
  - 2011: `IRAE 744.500` e `IP 415.000`, ambos perfectamente redondos.
  - 2013: `Empresas prestadoras servicio O90X  24428`, sin separador de miles.
  - 2013: `Impuesto al Valor Agregado (IVA)  951.787` como contribuyente, la **mitad** del 1.893.303
    de 2011, mientras el IVA de retención casi se duplica (682.421 → 1.294.041). Puede ser real (el
    régimen de retención del Decreto 528/003 corre el peso de una línea a la otra), pero es
    exactamente la forma que tiene un `1` perdido por el OCR, y publicar la serie de tributos con un
    escalón así sin confirmarlo es lo que el diccionario prohíbe en su regla 5.
- cita_de_contexto: verifiqué las dos notas c) individuales y **están bien elegidas** (ver el punto de
  individual/consolidado más abajo); el problema no es de bloque, es de confirmación.
- accion_sugerida: buscar la nota c) del bloque **individual** de los balances de 2012 y de 2014 (los
  dos con capa de texto y ya citados en la ficha) por si traen columna comparativa del año anterior.
  Si no la traen —ANTEL suele imprimir una sola columna—, entonces `nota` tiene que decir con todas
  las letras que la cifra depende de una sola lectura por OCR, o el campo baja de este lote y espera.
  El mismo criterio para 2007, 2011 y 2013, que son de tres gobiernos distintos.

### finanzas[2007], [2011], [2013].cotizacion — 21,5 / 19,9 / 21,42
- severidad: corregir
- tipo: contexto_omitido
- objecion: el diccionario define `cotizacion` como «Pesos por dólar con los que se convirtió, **tal
  como los declara el balance** (nota de moneda extranjera)». Las tres son cocientes calculados por
  el sitio (512.477 / 23.836,124 = 21,50; 202.508 / 10.174.768 = 19,906; 178.343 / 8.324.465 = 21,42),
  no tasas que el balance imprima. `consultas.jsonl` lo confirma para 2011: «--buscar "cambio
  interbancario|tipos de cambio de cierre" → 2 ventanas (**sin tasa numérica en prosa**)».
- accion_sugerida: dejarlas —son correctas y el redondeo es razonable— pero declarar en `nota` que
  son implícitas de la nota de moneda extranjera. Para 2007 se puede además apoyar en un segundo
  documento del mismo cierre: UTE declara `$ 29,34 por dólar al 31/12/16` con el mismo formato y el
  investigador dice haber usado ese cruce, pero la cita de UTE no está en el registro de ANTEL.

### resumen de ANTEL (ficha completa, copiado sin cambios)
- severidad: **bloquea**
- tipo: contexto_omitido
- objecion: mismo problema que en UTE, y acá el `resumen` **cita las cifras viejas textualmente**:
  1. «En 2007, el primer año con esta desagregación, la telefonía (…) era el segmento que más
     facturaba, **$ 9.034,3 millones**, muy por delante del servicio móvil (**$ 4.950,4 millones**)»
     → la tabla pasa a decir 8.488,5 y 4.651,4.
  2. «Pagó impuestos (…) en **cuatro años** del tramo 1997-2014 en los que se localizó el cuadro que
     los detalla (**2008, 2010, 2012 y 2014**, entre $ 2.201,3 y **$ 3.869,8 millones**)» → pasan a ser
     siete años y el máximo del tramo pasa a ser 2007 con $ 4.064,9 M.
  3. «en los años en que esta ficha usa una columna comparativa (**2007, 2009, 2011, 2013**) el
     documento no la repite» → falso para 2007, 2011 y 2013 después de esta corrida.
  4. «Entre 2003 y 2007, la cifra en dólares de `transferencias_al_estado` es la efectivamente
     pagada, convertida al tipo de cambio del momento del pago» → roto para 2007 (ver la primera
     objeción de este lote).
- accion_sugerida: reescribir los cuatro tramos en la misma corrección.

### finanzas[2011] y [2013] — individual vs. consolidado
- severidad: sin_objecion
- tipo: sin_objecion
- objecion: ninguna. Lo verifiqué porque el brief lo pide y **está bien resuelto en los dos años**.
  Los dos PDF traen la nota c) dos veces, una por bloque, con cifras distintas, y el lote tomó la
  individual en ambos:
  - 2013: consolidado en el carácter 107445 (`IVA 1.064.753`, `IRAE 651.659`), individual en el
    224862 (`IVA 951.787`, `IRAE 630.500`) → el lote usa el individual.
  - 2011: consolidado en el 105030, individual en el 224236 (`IVA 1.893.303`, `IRAE 744.500`) → el
    lote usa el individual.
  Lo mismo vale para el segmento y la deuda. No encontré ninguna otra cifra tomada del bloque
  consolidado en este lote.

### finanzas[2007].capitalizaciones_del_estado y segmentos de 2011/2013
- severidad: aviso
- tipo: asimetria
- objecion: dos huecos declarados, los dos correctamente declarados en `notas.md`, ninguno de los
  dos bloqueante. (a) `capitalizaciones_del_estado` para 2007: **ningún** año de ANTEL lo tiene, y el
  `resumen` explica por qué («En ningún año del período 1997-2024 esta ficha encontró evidencia de que
  el Estado le haya puesto capital a ANTEL: el capital que muestran los balances leídos no varía»).
  Cargar un `0` solo en 2007 sería la asimetría, no lo contrario; si se carga, se carga en la serie.
  (b) `segmentos[]` de 2011 y 2013 no se releyeron del documento propio: el lote lo dice y da la
  razón (los totales coinciden), pero el balance individual propio de 2013 sí trae el cuadro y lo leí
  (`Ejercicio 2013 (…) Servicios Fijos 9.670.721 / Servicios Móviles 10.373.267 / Total 20.043.988`,
  carácter 224862), así que la relectura es barata y queda pendiente.

---

## Lote ANP — `inbox/empresas/anp/2026-09-09-ocr/`

Años modificados: 2016 (agregado), 2017 y 2021 (se agregan segmentos).

### finanzas[2016].segmentos[0] «Montevideo — ingresos» — $ 4.175,46 M
- severidad: **bloquea**
- tipo: cita_fuera_de_contexto
- objecion: la cita **no contiene la cifra**. Cita la fila `Mercadería – uso infraestructura
  2.491.807 1.526 59.963 129.191 6.324 - 4.369 - 2.693.180 | 2.902.579`, que es un renglón de
  servicio, no el total del puerto. Los otros siete segmentos del mismo año citan bien la fila de
  totales. Un lector que abra la fuente de Montevideo va a encontrar 2.693.180 donde el registro dice
  4.175,46.
- cita_de_contexto: la fila correcta existe y la leí: `Total proventos  4.175.463  176.327  83.998
  220.225  12.673  88  9.482  1.590  4.679.846 | 4.532.714`
  (`https://anp.com.uy/sites/default/files/archivos/parrafo-colapsable/2020-08/balance_2016_0.pdf`,
  carácter 108075). Los ocho puertos suman exactamente el total impreso 4.679.846, que a su vez es la
  columna comparativa 2016 del balance de 2017. El valor está bien; la cita, no.
- accion_sugerida: usar la misma cita de `Total proventos` que los otros siete segmentos.

### finanzas[2017].impuestos_pagados y finanzas[2021].impuestos_pagados — cita amputada
- severidad: **bloquea**
- tipo: contexto_omitido
- objecion: **la corrección empeora la evidencia del registro publicado.** Antes, 2017 y 2021 citaban
  la nota entera desde el balance del año siguiente (2018 y 2022, ambos con capa de texto). El lote
  la reemplaza por una sola línea:
  - 2017: `Impuesto al Patrimonio: pagos por concepto de anticipos efectuados por $ 298.012.400
    ($266.208.010 al 31 de diciembre de 2016).` para sostener $ 1.015,1 M (el 29 %).
  - 2021: `Impuesto al Patrimonio: pagos por concepto de anticipos efectuados por $ 467.197.053` para
    sostener $ 1.614,2 M (el 29 %).
  Y el `resumen` publicado de ANP promete lo contrario: «**La cita de cada año trae el desglose
  completo por concepto**». `notas.md` justifica el recorte diciendo que el resto ya coincide con lo
  publicado, pero es justamente al revés: la coincidencia entre dos documentos es la confirmación, y
  el registro es donde se deja escrita.
- cita_de_contexto: la nota completa está en el OCR de los balances propios y el investigador la leyó
  (`consultas.jsonl`: «Estados_Financieros_2021.pdf --desde 109700 (impuestos pagos completo)»;
  «balance_2017_0.pdf --desde 110950 (impuestos pagos completo)»). La de 2021 dice, componente por
  componente: IP `$ 467.197.053`, IRAE `$ 727.433.953`, tasa Tribunal de Cuentas `$ 1.186.954`,
  retención de IVA `$ 125.566.818`, IRPF `$ 631.683`, IRNR `$ 51.966`, Ley 15.097/ANSE
  `$ 292.099.429`
  (`https://aplicaciones.anp.com.uy/archivo/Institucional/Estados_Financieros_2021.pdf`, carácter
  109700). Suman 1.614.167.856, exactamente los $ 1.614,2 M publicados, y coinciden uno a uno con la
  columna comparativa del balance de 2022: es una confirmación cruzada de dos documentos que el lote
  descarta.
- accion_sugerida: restituir la cita completa en los dos años, desde el balance propio, y mantener
  además la del balance siguiente como segunda fuente. Ninguna corrección puede dejar un registro con
  menos evidencia que la que ya tenía.

### resumen de ANP (ficha completa, copiado sin cambios)
- severidad: **bloquea**
- tipo: contexto_omitido
- objecion: cinco afirmaciones que la tabla nueva contradice:
  1. «no se encontró **ningún balance de 2007 ni de 2016**, y los balances propios de 2017 y 2021 son
     PDF escaneados sin capa de texto, así que esos dos años usan la columna comparativa del balance
     siguiente» → los tres se leyeron y 2016 se cargó.
  2. «Esta ficha reúne **21 de los 23** ejercicios entre 2003 y 2025» → 22 de 23.
  3. «El desglose por puerto falta para 2003, 2005, 2006, 2008 a 2012, 2014, **2016, 2017, 2021** y
     2024» → los tres pasan a tenerlo.
  4. «La cita de cada año trae el desglose completo por concepto» → deja de ser cierto para 2017 y
     2021 (objeción anterior).
  5. «los balances de **2017 a 2025** lo declaran de forma expresa ("La ANP no recibió subsidios")» →
     el de 2016 también lo declara y el lote lo cita.
- accion_sugerida: reescribir esos cinco tramos en la misma corrección.

### finanzas[2021].deuda_financiera — «no se pudo releer»
- severidad: corregir
- tipo: contexto_omitido
- objecion: **la nota está en el documento y la encontré.** `notas.md` afirma en
  `verificacion_manual` que «no apareció con ese formato en el balance de 2021 (dos búsquedas con
  `--buscar` sin resultados)» y especula que la estructura de la deuda cambió. La estructura sí
  cambió, pero la nota existe: las búsquedas fallaron porque el OCR escribe `B1D` en vez de `BID` y
  porque el renglón es `Total en pesos uruguayos`, no `Total equiv. en Pesos` (que es como lo escribe
  el balance de 2017).
- cita_de_contexto: `Menor a 1 año  1 año a 3 años  3 años a 5 años  Mayor a 5 años  Total / En
  dólares Estadounidenses / Préstamo B1D-2031/OC-UR 1.977.964 3.834.470 3.834.470 13.420.646
  23.067.551 / Préstamo B1D-2247/OC-UR 988.592 1.904.762 1.904.762 9.523.809 14.321.925 / Préstamo
  FONPLATA 361.107 3.333.333 6.666.667 40.000.000 50.361.107 / Total en dólares 3.327.663 9.072.565
  12.405.899 62.944.456 87.750.583 / Total en pesos uruguayos 148.729.904 405.498.305 554.481.668
  2.813.302.447 3.922.012.324`
  (`https://aplicaciones.anp.com.uy/archivo/Institucional/Estados_Financieros_2021.pdf`, carácter
  72849). Tres controles independientes: los cuatro tramos suman el total en pesos; los tres préstamos
  suman los USD 87.750.583; y 3.922.012.324 / 87.750.583 = **44,695**, la cotización de cierre que el
  mismo balance declara. Coincide con los $ 3.922,0 M y los USD 87,8 ya publicados.
- accion_sugerida: cargar `deuda_financiera` de 2021 desde el balance propio con esa cita, corregir
  `verificacion_manual` en `notas.md`, y agregar al `concepto` el hecho nuevo que aporta el documento:
  desde 2021 la deuda son **tres** préstamos (BID-2031, BID-2247 y FONPLATA), contra los dos BID de
  2016-2017; FONPLATA (USD 50,4 M) es más de la mitad del total.

### finanzas[2016], [2017], [2021].cotizacion — 29,34 / 28,807 / 44,695 sin ninguna fuente
- severidad: corregir
- tipo: contexto_omitido
- objecion: el campo `cotizacion` se agrega en 33 montos de los tres años y **ninguna cita del lote lo
  documenta**. Peor: en 2017 y 2021 el lote **borró** las citas que sí lo documentaban (las notas de
  cotizaciones de los balances de 2018 y 2022, que el registro publicado traía). El diccionario pide
  la cotización «tal como la declara el balance».
- cita_de_contexto: los tres balances propios la declaran y el investigador las leyó
  (`consultas.jsonl` 09:37:15, 09:38:45, 09:41:00) sin registrarlas:
  - 2016: `Promedio / Cierre — dic-16 dic-15 dic-16 dic-15 / Dólar estadounidense 30,142 27,293
    **29,340** 29,948` (balance 2016, carácter 39547).
  - 2017: `Promedio Cierre / Dic-17 Dic-16 Dic-17 Dic-16 / Dólar Estadounidense 28,666 30,142
    **28,807** 29,340` (balance 2017, carácter ~42800).
  - 2021: `31.12.2021 31.12.2020 / Euro 50,5322 52,0443 / Dólar estadounidense **44,695** 42,34`
    (balance 2021, carácter 46259).
- accion_sugerida: agregar la nota de cotizaciones como fuente en cada año. Es trivial, ya está en el
  corpus.

### finanzas[2017].segmentos[] — falta Salto
- severidad: corregir
- tipo: asimetria
- objecion: la fila de totales de 2017 tiene **ocho** puertos y el lote carga **siete**. El valor
  omitido es el sexto, `16` (miles), que en 2016 el mismo lote sí carga como «Salto — ingresos»
  ($ 88 mil). Mismo cuadro, mismo lote, dos criterios; y `CLAUDE.md` es explícito («Un hueco no es un
  cero»): una barra ausente se lee como cero o como ocultamiento.
- cita_de_contexto: `Total proventos  4_._506.436  209.908  25.517  268.805  12.625  **16**  8.071
  6773  5.038.151 | 4.679.846` (balance 2017). Los ocho suman 5.038.151 exacto, y ese total es el que
  la ficha ya tenía publicado desde el balance de 2018 (PDF con capa de texto): confirmación de dos
  documentos para los ocho dígitos, incluido el `6773` que el OCR escribió sin separador. Cargar
  siete rompe la suma.
- accion_sugerida: agregar Salto ($ 0,016 M). Nota: el `resumen` de ANP ya usa a Salto como ejemplo
  («con Salto como el más chico de todos, $ 26.000 en 2018»), así que la serie lo espera.

### segmentos[] de los tres años — las citas no traen la fila de encabezado
- severidad: corregir
- tipo: cita_fuera_de_contexto
- objecion: las 22 citas de segmentos son una fila de números pelada. Nada en el registro dice qué
  columna es qué puerto: la asignación depende de un encabezado que ninguna cita reproduce. Verifiqué
  el de 2021 en el documento y **la asignación del lote es correcta**; para 2016 y 2017 no logré
  localizar el encabezado en el OCR, así que ahí la asignación descansa solo en la posición de la
  columna, y el lector no tiene con qué comprobarla.
- cita_de_contexto: encabezado de 2021, verificado: `…tevideo — Colonia  Bentos  Palmira  Paysandú
  Sauce  pPaloma  Totales 2021  Totales 2020` (balance 2021, carácter 104900). Confirma Montevideo,
  Colonia, Fray Bentos, Nueva Palmira, Paysandú, Sauce, La Paloma, en ese orden, sin Salto.
- accion_sugerida: incluir la fila de encabezado en la cita de cada segmento, o al menos en la del
  primero, y ubicar el encabezado de 2016 y 2017 antes de cerrar el lote.

### finanzas[2016].deuda_financiera — la confirmación cruzada no está en el registro
- severidad: corregir
- tipo: contexto_omitido
- objecion: `notas.md` dice que la deuda de 2016 «coincide exactamente (…) con la columna comparativa
  2016 que trae el balance de ANP de 2017». Es cierto —lo verifiqué— pero esa cita no está en el
  registro: `deuda_financiera` de 2016 solo cita el balance de 2016. La confirmación que hace
  publicable un dígito de OCR tiene que estar en el registro, no en las notas del investigador.
- cita_de_contexto: `Dic-16 (…) Total equiv. en Pesos Uruguayos  84.194.538 _ 168.389.089 _
  168.389.065 _ 1.094.163.013 — **1.515.135.705**`
  (`https://anp.com.uy/sites/default/files/archivos/parrafo-colapsable/2020-08/balance_2017_0.pdf`,
  carácter 70633). Cierra por partida doble con lo que el lote cargó desde el balance de 2016
  (84.194.538 corriente + 1.430.941.167 no corriente): 168.389.089 + 168.389.065 + 1.094.163.013 =
  1.430.941.167 exacto. Y el total en dólares del mismo cuadro (51.640.616) da 1.515.135.705 /
  51.640.616 = 29,340, la cotización declarada.
- accion_sugerida: agregar esa cita como segunda fuente de `deuda_financiera` 2016.

### `usd` con cuatro decimales y `pesos` con dos
- severidad: corregir
- tipo: presentacion
- objecion: ANP 2016/2017/2021 traen `usd: 142.3129`, `6.0099`, `0.0031`, `156.4356`, `153.6716`,
  `0.1168`… y `pesos: 1508.13`, `968.76`, `4175.46`. Toda la serie de las tres fichas (y de UTE y
  ANTEL en este mismo lote) usa un decimal. La página imprime esos números en la tabla y en el
  gráfico: 0,0031 millones de dólares es una precisión de 3.100 dólares sobre un dato que ni siquiera
  se conoce con esa resolución, y siete decimales significativos al lado de dos en la celda de
  arriba se leen como un error de la ficha.
- accion_sugerida: un decimal en `pesos` y en `usd`, como el resto de la serie. Si un puerto chico
  queda en 0,0, ponerle el valor con la unidad que corresponda o dejarlo en 0,0 con el monto exacto
  en `nota`.

### `concepto` usado para narrar la corrida
- severidad: corregir
- tipo: presentacion
- objecion: sistemático en ANP 2017/2021 y en ANTEL 2011/2013 (unos doce campos). `concepto` es la
  nota al pie de la celda: tiene que decir **qué es el número**. El lote lo usa para decir qué hizo el
  investigador. Ejemplos: «Sin cambio de valor; confirmado ahora desde el balance propio de 2017.»
  (transferencias 2017); «Sin cambio de valor; confirmado ahora desde el balance propio de 2021
  (mismos siete conceptos ya publicados, ahora leídos desde el propio documento).» (impuestos 2021).
  Y en un caso destruye información útil: el `concepto` publicado de impuestos 2017 decía «Incluye
  impuestos pagados por ANP como contribuyente y retenciones a terceros (IVA, IRPF, IRNR, Ley
  15.097/ANSE) de 2017», que es exactamente lo que el lector necesita al pie de la tabla, y el lote lo
  reemplazó por la frase de proceso.
- accion_sugerida: `concepto` define el número; qué cambió va a `nota` del año, una oración. Restituir
  el `concepto` publicado de impuestos 2017 y escribir el equivalente en 2016 y 2021.

### Valores de ANP — verificados
- severidad: sin_objecion
- tipo: sin_objecion
- objecion: ninguna sobre las cifras. Confirmé: 2016 resultado `RESULTADO DEL EJERCICIO
  1.508.131.629`, con el impuesto a la renta y el resultado antes de impuestos cerrando la resta
  (1.736.425.796 − 228.294.167 = 1.508.131.629); 2016 deuda 1.515.135.705 por dos documentos; 2016
  impuestos 968.762.160 como suma exacta de sus siete conceptos citados; 2016 y 2021 transferencias
  ($ 293.142.600 y $ 432.118.320) contra la nota del balance propio y contra la comparativa del
  siguiente; 2016 `La ANP no recibió subsidios en los ejercicios 2016 y 2015` para el cero de
  capitalizaciones; segmentos de 2016 (ocho puertos = 4.679.846), 2017 (ocho = 5.038.151) y 2021
  (siete = 7.337.726), los tres cerrando contra su propio total y contra el total ya publicado desde
  el balance siguiente; 2021 deuda 3.922.012.324 con tres controles. **Ninguna cifra de este lote está
  mal.** Todo lo objetado es cita, contexto, cobertura o presentación.

---

## Objeciones al lote (los tres)

1. **El `resumen` de las tres fichas quedó contradiciendo su propia tabla.** Es la objeción más
   costosa de las tres y la más fácil de pasar por alto, porque el diff por año no la muestra: los
   lotes copian el `resumen` sin cambios y `promover --correccion` lo va a sobreescribir igual. Son
   catorce afirmaciones en total (5 en UTE, 4 en ANTEL, 5 en ANP), tres de ellas máximos de serie que
   cambian de año. Ningún lote se cierra sin eso.
2. **Ningún lote perdió cifras, tres perdieron evidencia.** ANTEL 2007 (fuente «Datos Financieros y
   Operativos» eliminada), ANP 2017 y ANP 2021 (nota de impuestos amputada), ANP 2017 y 2021
   (cotizaciones eliminadas). En los tres casos lo removido era un documento con capa de texto que
   confirmaba un OCR. Una corrección puede cambiar una cifra; no puede dejar el registro con menos
   respaldo del que tenía.
3. **Dígitos que dependen solo del OCR, con nombre y apellido.** De todo lo que revisé, quedan cinco
   cifras sin confirmación externa ni aritmética que las determine: `impuestos_pagados` de ANTEL 2007
   ($ 4.064,9 M), 2011 ($ 3.792,5 M) y 2013 ($ 3.506,4 M) —las tres son sumas del sitio sobre lecturas
   únicas, sin línea `Total` en el documento—, y dentro de ellas los dígitos concretos `744.500`,
   `415.000`, `24428` y `951.787`. Todo lo demás que cambia lo verifiqué contra la aritmética interna
   o contra un segundo documento, y **todo cerró**. La confirmación más fuerte del lote es la que el
   propio lote no escribió: el coeficiente 1,0643 idéntico en las cuatro magnitudes de ANTEL 2007.
4. **Individual vs. consolidado: bien resuelto, con una excepción de etiqueta.** Verifiqué los cuatro
   documentos con doble bloque (UTE 2017, ANTEL 2011, ANTEL 2013 y, por descarte, ANP que no tiene
   consolidado). En ANTEL 2011 y 2013 el lote tomó el bloque individual en los cuatro campos, y las
   cifras del consolidado son visiblemente distintas (2013: IVA 1.064.753 contra 951.787), así que la
   elección no fue casual. En UTE 2017 todas las cifras salen de los Separados —lo comprobé una por
   una— pero **una fuente está mal etiquetada**: el párrafo de versión de resultados existe en los dos
   bloques y el `titulo` lo atribuye al «Literal E» de la Sección II, que dice otra cosa. Etiqueta, no
   cifra.
5. **Lo que faltó, con la respuesta:** ANP 2021 `deuda_financiera` **sí se puede cargar** (carácter
   72849 del balance propio, tres controles aritméticos); UTE 2017 `capitalizaciones_del_estado`
   **sí se puede cargar** ($ 93.619.467, Estado de Cambios en el Patrimonio Separado, cierra contra el
   saldo final); UTE 2017 `segmentos[]` **no corresponde cargar** y la ficha ya explica por qué en su
   `resumen` (todo el ingreso en un único segmento «Comercial»), aunque `notas.md` lo justifica mal;
   ANTEL 2007 `capitalizaciones_del_estado` **no corresponde cargar** solo para ese año, porque
   ningún año de ANTEL lo tiene y el `resumen` fundamenta la ausencia.
6. **Simetría entre años y gobiernos: sin objeción.** Los siete años cubren cuatro gobiernos (2007,
   Vázquez I; 2011 y 2013, Mujica; 2016 y 2017, Vázquez II; 2021, Lacalle Pou) y el mismo umbral de
   OCR, de aritmética y de cita se aplicó a todos. Las fallas que encontré tampoco se agrupan por
   gobierno: la cita amputada afecta a 2017 (Vázquez II) y a 2021 (Lacalle Pou); la evidencia
   eliminada, a 2007 (Vázquez I) y a los dos anteriores; el hueco no releído, a 2021. Y las tres
   objeciones que mejoran cifras (deuda 2021, capitalizaciones UTE 2017, Salto 2017) reparten entre
   gobiernos distintos. No hay patrón.
7. **Un efecto de serie que hay que decidir, no esconder.** Con ANTEL 2007 en moneda de cierre de
   2007 y 2004-2006 y 2008 en moneda de cierre de 2008 (el resumen oficial «Datos Financieros y
   Operativos»), la serie **en pesos** muestra un pozo del 6,4 % en 2007 que es puramente contable. El
   `resumen` de ANTEL ya resuelve esto declarando que la base de comparación son los dólares —y por eso
   la primera objeción de ese lote, el `usd` cambiado, es `bloquea` y no `corregir`—, pero el gráfico
   de pesos lo va a mostrar igual. Corresponde una nota al pie del gráfico o, mejor, releer 2004-2006
   y 2008 con el mismo criterio en una corrida siguiente.
8. **Sin `cobertura` ni `discrepancias`, y por la razón correcta.** No hay prensa en el lote. Para
   registrar una discrepancia hace falta un medio publicando algo distinto de lo que dice el
   documento; acá solo hay documentos. Las diferencias que encontré (2.290.911 contra 2.152.516) son
   entre dos publicaciones oficiales de la misma empresa en bases monetarias distintas, no una
   discrepancia: es reexpresión contable, está explicada en el propio balance, y registrarla como
   discrepancia sería exactamente el «desacuerdo» que las tres reglas duras excluyen.

## Objeciones al brief

Ninguna. El brief pide releer siete años de tres empresas con el mismo procedimiento, nombra los
años por la causa técnica (escaneo sin capa de texto, OCR cortado por el tope de dos minutos) y no
por gobierno, período ni signo del resultado, y fija de antemano el criterio de publicación de un
dígito de OCR sin excepciones. Los tres `notas.md` declaran la Regla 0 y la aplican. No hay nada que
rechazar ni versión simétrica que proponer.

Una observación de alcance, que no es una objeción de Regla 0: el brief cierra siete huecos y deja
abiertos otros del mismo tipo que ahora quedan a la vista (UTE 2018, también escaneado; ANP 2007,
todavía ausente; ANTEL 2004-2006, que dependen del resumen oficial y no del balance auditado). Si la
próxima corrida los toma, que los tome a los cuatro juntos.

## Cobertura

```yaml
# Ninguna. Los tres lotes citan exclusivamente estados contables auditados
# (tipo: documento_oficial) de UTE, ANTEL y ANP. No se leyó ninguna nota de
# prensa en esta corrida, así que no hay tono de cobertura que registrar.
```

## Tabla resumen

| Lote | bloquea | corregir | aviso | sin_objecion | La más grave |
|---|---|---|---|---|---|
| UTE | 2 | 3 | 5 | 0 | `impuestos_pagados` 2017: la cita es el encabezado del Literal D y no contiene ninguna cifra (el valor, que verifiqué, es correcto: los trece conceptos suman el `Total 11,.147.731.653` impreso) |
| ANTEL | 2 | 7 | 1 | 1 | `transferencias_al_estado.usd` 2007: 84,5 → 96,7 rompe la convención que el `resumen` de la ficha declara para 2003-2007 y borra el documento oficial de ANTEL que publica 84,5 |
| ANP | 3 | 7 | 0 | 1 | `impuestos_pagados` 2017 y 2021: la corrección deja el registro con una cita que cubre el 29 % de la cifra, donde el publicado traía la nota entera desde un PDF con capa de texto |
| **Total** | **7** | **17** | **6** | **2** | |

Los tres `bloquea` transversales —el `resumen` desactualizado de cada ficha— están contados una vez
por lote.
