# Crítica — corrida 2026-09-08-empresas-ancap-serie-historica

Modelo: Opus 5 (1M context) — `claude-opus-5[1m]`. Corro en Opus como crítico, que es el único rol
al que la regla 14 del mantenedor le habilita ese modelo.
Lote: `inbox/empresas/ancap/2026-09-08-serie-historica/`
Registros revisados: 10 ejercicios nuevos de `finanzas[]` (2004-2013), 4 campos cada uno, más la
tabla `## cobertura_del_periodo` (1931-2013) y los candidatos a hito de `## para_el_editor`.

Balances abiertos con `pnpm fuente` en esta sesión: 2005, 2007 (índice), 2011, 2012, 2013 (los cinco
del lote), más 2014 y 2015 (ficha publicada, para comparar criterio) y los balances auditados
archivados de 2002 y 2003, que el lote da por inexistentes. Verifiqué a mano las sumas
(corriente + no corriente en deuda) y las conversiones a dólares de los diez años contra las citas:
**todas cierran**, y en todos los casos el divisor es el tipo de cambio de *cierre* que declara el
propio balance (2004: 26,38; 2005: 24,12; 2006: 24,42; 2007: 21,50; 2008: 24,36; 2009: 19,64;
2010: 20,10; 2011: 19,90; 2012: 19,40; 2013: 21,42). Ese trabajo aritmético está bien hecho y no
tengo objeción sobre ninguna cifra en pesos ni sobre ninguna división. Las objeciones que siguen son
sobre qué *dicen* los campos que acompañan a esas cifras, sobre lo que el lote declaró inexistente y
sobre lo que los mismos documentos traen y no se cargó.

---

## Objeciones transversales (afectan a los diez años; no las repito año por año)

### finanzas[2004-2013].impuestos_pagados.concepto — «no incluye el IRAE propio de Ancap»
- severidad: **bloquea**
- tipo: cita_fuera_de_contexto
- objecion: los diez años llevan el `concepto` «Total de impuestos pagados y montos recaudados como
  agente de retención en el año; no incluye el IRAE propio de Ancap ni transferencias a Rentas
  Generales». La segunda mitad es falsa y la desmiente el mismo renglón que el registro cita: la
  nota «Impuestos pagos y montos recaudados como agente de retención» **incluye** el impuesto a la
  renta propio de ANCAP (IRIC hasta 2006, IRAE desde 2007) y el Impuesto al Patrimonio. No es un
  detalle menor de redacción: en 2005 el IRIC propio son $ 1.143,7 millones sobre un total de
  $ 8.763,1 (13 %), y en 2010 el IRAE propio son $ 556,3 millones. La página muestra ese `concepto`
  al pie de la celda: el lector leería exactamente lo contrario de lo que dice el documento.
- cita_de_contexto: «Impuesto al Patrimonio 247.014.266 155.661.044 / Impuesto a la Renta de
  Industria y Comercio del ejercicio (ver Nota 19) 1.143.660.383 1.135.138.251 / … / Total impuestos
  8.763.069.877 8.379.048.812» (balance 2005, https://www.ancap.com.uy/276/1/eecc-individual-2005.html).
  Y en 2013: «Impuesto al Patrimonio 705.945.888 … Impuesto a la Renta de las Actividades Económicas
  229.435.604 … Total impuestos 13.490.554.648»
  (https://www.ancap.com.uy/246/1/eecc-individual-2013.html).
- accion_sugerida: reescribir el `concepto` con lo que la nota realmente contiene («impuestos pagados
  por ANCAP —incluidos el impuesto a la renta propio y el Impuesto al Patrimonio— más los montos
  recaudados como agente de retención; no incluye las versiones a Rentas Generales, que van en
  `transferencias_al_estado`»). **Y el mismo error está en la ficha publicada**: el `concepto` de
  2015-2024 dice lo mismo y el `resumen` lo repite al lector («sin contar el impuesto a la renta
  propio de ANCAP»), cuando el balance 2015 lista «Impuesto a la Renta de las Actividades Económicas
  106.200» y «Impuesto al Patrimonio 662.142.837»
  (https://www.ancap.com.uy/232/1/eecc-individual-2015.html). Corregirlo solo en los años nuevos
  (2004-2013, gobiernos de Batlle, Vázquez y Mujica) y dejarlo mal en los publicados (Vázquez II,
  Lacalle Pou, Orsi) sería una asimetría creada por la propia corrección: va junto, por
  `content/correcciones/` con tipo `presentacion` o `cotejo_con_primaria`.

### finanzas[2004-2013].segmentos[] — vacío en años cuyo balance sí informa por división
- severidad: corregir
- tipo: presentacion
- objecion: `notas.md ## anios_sin_segmentos` afirma que «2004 a 2013 no traen desglose de resultado
  por línea de negocio» y que se confirmó «ausencia de las palabras "línea de negocio" / "segmento"
  con datos» en 2011, 2012 y 2013. La búsqueda erró el término, no el hecho: los balances de esos
  años traen el desglose bajo el rótulo **«desagregado por división» (Energía / Pórtland)**, con
  ingresos, egresos, resultado y activos. El esquema pide `segmentos[]` «cuando los estados
  contables lo informan», y la página deja prender cada segmento: hoy no hay nada que prender en
  ninguno de los diez años, y el dato que falta es justamente el que un dueño quiere ver (Pórtland
  pierde plata en 2005 y en 2013, con Energía positiva en 2005 y negativa en 2013).
- cita_de_contexto: 2013: «c) Egresos desagregados por división … Resultado (2.798.402.823)
  (802.642.241) (3.601.045.064) (293.155.056)»
  (https://www.ancap.com.uy/246/1/eecc-individual-2013.html). 2005: «Resultado 1.525.727.082
  (138.676.332) 1.387.050.750 1.270.510.457», bajo «Energía Pórtland Total»
  (https://www.ancap.com.uy/276/1/eecc-individual-2005.html). 2012 tiene la misma estructura
  («d) Activos desagregados por División — Energía Pórtland Total»,
  https://www.ancap.com.uy/251/1/eecc-individual-2012.html).
- accion_sugerida: cargar `segmentos[]` con Energía y Pórtland para todos los años del tramo cuyo
  balance trae la tabla, con la fila «Resultado» como cita, y corregir el texto de
  `## anios_sin_segmentos`. Ojo con no mezclar dos cosas distintas en el mismo gráfico: estos
  segmentos son *divisiones contables en pesos* del balance; los `segmentos[]` que la ficha ya tiene
  para 2016-2024 (Combustibles, Lubricantes, Gas Natural, Pórtland…) salen de la presentación de
  resultados y están en dólares. Si van a la misma serie, hay que decirlo en una `nota` de una
  frase. El mismo desglose por división existe en el balance 2014 («Resultado (7.191.980.923)
  (684.101.017) (7.876.081.940) (3.391.440.836)»), o sea que el hueco de segmentos también alcanza
  al año publicado.

### finanzas[2004-2013].*.fuentes — la cita de cotizaciones no permite reconstruir la conversión
- severidad: corregir
- tipo: presentacion
- objecion: la fuente del tipo de cambio se cita sin el encabezado de columnas —«Dólar 24,43 24,12
  28,65 26,38»— y el número usado no queda escrito en ningún campo del registro. Un lector (o un
  auditor externo, que es el punto de `pnpm auditar`) no puede saber cuál de los cuatro valores se
  aplicó. Y el orden de columnas **cambia** entre balances: el de 2005 es «2005 2004 / Promedio
  Cierre Promedio Cierre» (por año), y los de 2006 en adelante son «promedio actual, promedio
  anterior, cierre actual, cierre anterior» (por concepto). Verifiqué que el investigador eligió
  bien en los diez casos, pero eso no se deduce de la cita tal como quedó. La ficha publicada ya
  resuelve esto mejor: su cita de 2015 incluye el encabezado («dic-15 dic-14 dic-15 dic-14 Dólar
  Estadounidense 27,29 23,22 29,95 24,37»).
- cita_de_contexto: «Las cotizaciones promedio y al cierre del ejercicio de las principales monedas
  extranjeras operadas por ANCAP respecto al Peso Uruguayo, son las siguientes: 2005 2004 / Promedio
  Cierre Promedio Cierre / Dólar 24,43 24,12 28,65 26,38»
  (https://www.ancap.com.uy/276/1/eecc-individual-2005.html).
- accion_sugerida: extender la cita de cotizaciones para que incluya el encabezado, y escribir el
  tipo de cambio usado en la `nota` del año («convertido al tipo de cambio de cierre del propio
  balance, $ 21,42 por dólar»). De paso resuelve otra inconsistencia: la fuente de cotizaciones está
  repetida en `impuestos_pagados` en 2004 y 2005 y ausente en los otros ocho años, aunque la
  conversión se aplicó igual en todos. Una sola línea por año, en la `nota`, evita las dos cosas.

### finanzas[2004-2013].transferencias_al_estado — diez ceros sin explicación en la celda
- severidad: corregir
- tipo: presentacion
- objecion: los diez años llevan `pesos: 0` con la cita correcta («no se realizaron versiones de
  fondos a rentas generales»), pero solo 2004 y 2007 llevan `concepto`. En la página, «Transferencias
  al Estado: 0» repetido diez veces, al lado de una columna de impuestos de entre USD 318 y USD 844
  millones por año, se lee como «ANCAP no le dio nada al Estado», que es lo contrario de lo que dice
  el documento. Los años publicados sí traen el `concepto` («Versión de resultados acumulados a
  Rentas Generales; no incluye impuestos … ver impuestos_pagados»).
- cita_de_contexto: «f) Durante los ejercicios 2013 y 2012 no se realizaron versiones de fondos a
  rentas generales» (https://www.ancap.com.uy/246/1/eecc-individual-2013.html).
- accion_sugerida: poner en los diez años el mismo `concepto` que usan los años publicados. Y un dato
  que le da sentido al cero y que el lote no tiene porque no cargó 2002-2003: en esos años **sí**
  hubo versiones —«Durante el ejercicio 2003 se vertieron a rentas generales $ 150.740.478» y
  «Versión a Rentas Generales (153.517.500)» en 2002—, así que el cero de 2004-2019 es un cambio de
  práctica y no una constante de la empresa. Eso pertenece al `resumen`, con su fuente.

---

## Objeciones por registro

### finanzas[2004] — columna comparativa del balance 2005
- severidad: corregir
- tipo: contexto_omitido
- objecion: los cuatro montos salen de la columna «31.12.2004» del balance de 2005, y eso está bien
  declarado en `nota` y en `concepto`. Falta lo otro: esa columna está **reexpresada en moneda de
  cierre del 31 de diciembre de 2005**, y el lote la convierte a dólares con el tipo de cambio de
  cierre de *2004* (26,38). Es una mezcla de bases —pesos de poder adquisitivo de diciembre de 2005
  divididos por el dólar de diciembre de 2004— que ningún otro año de la ficha tiene, porque los
  demás usan el balance propio. El efecto es del tamaño de la variación del IPPN de 2005 y
  probablemente chico, pero el lector no tiene cómo saber que ese año se construyó distinto.
- cita_de_contexto: «(*) = Importes expresados en moneda de cierre del 31 de diciembre de 2005» y
  «…reexpresados … de acuerdo con la variación del índice de "Precios al Productor de Productos
  Nacionales" (IPPN) publicados por el Instituto Nacional de Estadística»
  (https://www.ancap.com.uy/276/1/eecc-individual-2005.html).
- accion_sugerida: agregar a la `nota` de 2004 una frase que diga que las cifras en pesos están
  expresadas en moneda de cierre de 2005 y que la conversión a dólares usa el cierre de 2004; o
  convertir al cierre de 2005 y decirlo. Cualquiera de las dos, pero explícita. Confirmo por mi
  cuenta que **no existe** un balance anual propio de 2004 publicado ni archivado (busqué en el
  índice CDX de Wayback de `ancap.com.uy` filtrando por «2004» y por «Balance»: no aparece), así que
  la decisión de usar la comparativa es correcta.

### finanzas[2005]
- severidad: aviso
- tipo: sin_objecion
- objecion: sin objeción propia. Resultado, impuestos, deuda (corriente 1.178.618.561 + no corriente
  958.114.092 = 2.136,7) y transferencias coinciden con el documento y con la conversión a 24,12.
  Le aplican las cuatro transversales.

### finanzas[2006]
- severidad: aviso
- tipo: sin_objecion
- objecion: sin objeción propia; verificado contra el balance 2006 y su tabla de cotizaciones
  (cierre 24,42). Nota para el editor, no para el registro: entre el «Total impuestos» de 2006 del
  balance propio ($ 9.101,1 M) y el que informa como comparativo el balance de 2007
  ($ 11.091,9 M) hay 21,9 %, mientras que el resultado del mismo año se reexpresa 16,1 %. No
  cambia ninguna cifra cargada (se usó la del año propio, que es el criterio correcto), pero es la
  misma familia de problema que el de 2011, abajo.

### finanzas[2007] — transferencias tomadas del balance de 2008
- severidad: aviso
- tipo: contexto_omitido
- objecion: el cero de transferencias de 2007 se documenta con el balance de **2008** («Durante los
  ejercicios 2008 y 2007…»), y el `concepto` lo aclara con honestidad. Está bien resuelto; lo señalo
  solo porque es la segunda excepción (junto con 2004) a la regla que la `nota` de 2013 declara como
  absoluta —«esta ficha usa siempre la cifra del balance del propio año»—, y esa nota hay que
  arreglarla igual (ver 2013).

### finanzas[2008] — deuda financiera en cero y la nota de la Ley 18.083
- severidad: aviso
- tipo: contexto_omitido
- objecion: dos cosas chicas. (a) El `concepto` afirma «Ancap no registró deudas financieras (ni
  corrientes ni no corrientes) al cierre de 2008» y trae una sola cita, la del renglón corriente
  («Deudas financieras 10 - 436.881.442»); el renglón no corriente no está citado, aunque
  `consultas.jsonl` registra que se verificó. (b) El propio lote anotó, en `## para_el_editor`, que
  el balance 2008 menciona «Aporte a cuenta de futuras capitalizaciones y transformación patrimonial
  de acuerdo a las exigencias de la ley 18.083» y que no se leyó a fondo. Si eso es un aporte del
  Estado, es `capitalizaciones_del_estado` de ese año, que es un campo que la serie nueva tiene
  vacío en los diez años.
- accion_sugerida: agregar la cita del renglón no corriente 2008; leer la nota completa de la
  Ley 18.083 en https://www.ancap.com.uy/267/1/eecc-individual-2008.html antes de dar por cerrado
  `capitalizaciones_del_estado` en el tramo.

### finanzas[2009] / finanzas[2010]
- severidad: aviso
- tipo: sin_objecion
- objecion: sin objeción propia. Sumas y conversiones verificadas (2009: 2.060.947.650 +
  1.364.430.609 = 3.425,4 / 19,64; 2010: 1.426.922.557 + 0 = 1.426,9 / 20,10). Les aplican las
  transversales.

### finanzas[2011] y finanzas[2012] — los dos «Total impuestos» de 2011 difieren 26 %
- severidad: corregir
- tipo: contexto_omitido
- objecion: el balance de 2011 informa «Total impuestos 14.849.861.874» para 2011; el balance de
  2012 informa, como comparativo del mismo año, «10.979.882.567». No es reexpresión: la reexpresión
  contable cesó el 31/12/2011 (ver 2013) y, de hecho, el resultado de 2011 figura idéntico en los
  dos balances. Todas las líneas del comparativo bajan, pero con porcentajes distintos (IMESI
  −23 %, IVA −36 %, Patrimonio −8 %), o sea que cambió qué se cuenta, no la unidad. El lote registra
  el fenómeno, pero en el lugar equivocado (el `concepto` de 2012, no el de 2011) y con una causa
  que el documento no dice: «La nota de impuestos pagados de cada balance es sobre base de caja».
  Eso es una explicación del investigador presentada como hecho, en un campo que la página muestra.
- cita_de_contexto: «Impuesto Específico Interno 8.785.705.177 7.722.420.425 … Total impuestos
  14.849.861.874 13.550.102.593» (https://www.ancap.com.uy/255/1/eecc-individual-2011.html) contra
  «Impuesto Específico Interno 9.329.058.448 6.738.597.912 … Total impuestos 16.377.037.208
  10.979.882.567» (https://www.ancap.com.uy/251/1/eecc-individual-2012.html).
- accion_sugerida: mover la advertencia a la `nota` de 2011, decir el hecho sin la causa («el balance
  del año siguiente informa para 2011 un total de impuestos de $ 10.979,9 millones; esta ficha usa
  la cifra del balance del propio ejercicio») y sacar la atribución a «base de caja» salvo que
  aparezca en el documento.

### finanzas[2013] — la nota de reexpresión dice algo que en 2013 ya no era cierto
- severidad: corregir
- tipo: contexto_omitido
- objecion: la `nota` de 2013 —el único lugar donde el lector va a leer sobre la reexpresión— afirma
  en presente que «los estados contables de Ancap reexpresan en moneda de cierre del ejercicio
  corriente la cifra comparativa del ejercicio anterior». Para 2012 y 2013 es falso: el ajuste por
  inflación se aplicó hasta el 31/12/2008 por IPPN y hasta el 31/12/2011 por IPC, y ahí terminó. Se
  comprueba con los propios números: el comparativo 2011 del balance 2012 y el comparativo 2012 del
  balance 2013 son idénticos a las cifras propias de esos años, mientras que el comparativo 2010 del
  balance 2011 sí está reexpresado ($ 1.585.057.368 contra $ 1.459.537.171). Además la nota dice que
  la ficha «usa siempre la cifra del balance del propio año», y eso tampoco es cierto: 2004 entero y
  las transferencias de 2007 salen de otro balance, y en la ficha publicada el resultado de 2014 y
  la deuda de 2015 también.
- cita_de_contexto: «…reexpresados en moneda de cierre de acuerdo con la variación del IPPN hasta el
  31 de diciembre de 2008 y a base de coeficientes derivados del IPC hasta el 31 de diciembre de
  2011» (https://www.ancap.com.uy/246/1/eecc-individual-2013.html).
- accion_sugerida: reescribir la nota acotando el fenómeno a los años en que ocurrió (2004-2011),
  ponerla donde el lector la necesita (el primer año afectado, o el `resumen`), y cambiar «siempre»
  por la regla real con sus dos excepciones declaradas.

### finanzas[2013] — ANCAP reexpuso 2013 en el balance de 2014 y la ficha no lo dice
- severidad: corregir
- tipo: documento_previsible
- objecion: el registro carga el resultado 2013 como $ (3.601.045.064) / USD −168,1, que es lo que
  dice el balance de 2013. En el balance de 2014, el primero preparado con NIIF, ANCAP presenta el
  mismo ejercicio 2013 como **$ (3.391.440.836)**, y el estado de cambios en el patrimonio arranca
  con «Saldo al 1° de enero de 2013». Son $ 209,6 millones de diferencia, y no es reexpresión (ya no
  había): es el cambio de base contable. El lector va a ver 2013 = USD −168,1 y 2014 = USD −323,2 en
  el mismo gráfico, con un salto de criterio en el medio que nada señala. La ficha ya tiene
  precedente de cómo se maneja esto: la `nota` de 2020 explica la reformulación por NIC 8.
- cita_de_contexto: «Resultado del ejercicio (7.876.081.940) (3.391.440.836)» y «Saldo al 31 de
  diciembre de 2013 (497.713.922) 1.252.629.057 17.198.366.218 17.953.281.353»
  (https://www.ancap.com.uy/innovaportal/file/242/1/ancap-31-12-14--individual.pdf).
- accion_sugerida: `nota` en 2013 con las dos cifras y su documento. Vale para todos los años del
  seam, no solo para este.

### finanzas[2012] y finanzas[2013] — falta el préstamo del Estado que explica la deuda y la capitalización de 2016
- severidad: corregir
- tipo: contexto_omitido
- objecion: la deuda financiera salta de USD 271,6 M (2011) a USD 985,2 M (2012) y USD 1.141,2 M
  (2013), y el registro no dice de qué se trata. Los mismos balances lo dicen: el 2 de enero de 2013
  el Estado, por el MEF, le prestó a ANCAP **US$ 517.268.037** (UI 3.940.699.680, 12 cuotas anuales)
  para cancelar la deuda con PDVSA, con prenda sobre el crédito por ventas a DUCSA; y la nota de
  partes relacionadas del balance 2013 registra deudas financieras con el MEF por $ 11.021.908.442,
  cerca del 45 % de los $ 24.445,4 millones que la ficha carga como deuda financiera de ese año. Es
  decir: buena parte de la «deuda financiera» de 2013 es deuda con el propio dueño, no con bancos,
  y es exactamente la deuda que la Ley 19.368 condona en 2016 y que la ficha **ya publica** como
  `capitalizaciones_del_estado` de 2016 (USD 642,7 M) y como hito. Hoy la ficha muestra el desenlace
  sin el origen.
- cita_de_contexto: «Con fecha 2 de enero de 2013 se firmó un contrato de préstamo con el Estado, por
  intermedio del Ministerio de Economía y Finanzas (en adelante "MEF"), en el cual este le otorga un
  préstamo a ANCAP por el monto de US$ 517.268.037 equivalentes a la fecha a Unidades Indexadas
  3.940.699.680 … Los fondos recibidos … fueron utilizados con fecha 2 de enero de 2013 para la
  cancelación por un monto de US$ 517.268.037 de adeudos incluidos dentro del capítulo Deudas
  financieras - Préstamos bancarios de corto plazo … en el marco de la cancelación anticipada de la
  deuda con PDVSA» (https://www.ancap.com.uy/251/1/eecc-individual-2012.html); «Deudas financieras:
  MEF - - - 4.019.513.673 11.021.908.442»
  (https://www.ancap.com.uy/246/1/eecc-individual-2013.html, nota de partes relacionadas).
- accion_sugerida: `nota` en `deuda_financiera` de 2013 (y de 2012, para el salto) diciendo cuánto es
  con el MEF, previa lectura de la nota de deudas financieras del balance 2013 para confirmar el
  corte corriente/no corriente —el no corriente de 2013 son $ 12.210,9 millones, del orden del
  préstamo—; y un hito 2013-01-02 con el préstamo, que es el eslabón que le falta a la línea de
  tiempo entre 2003 y 2016.

### notas.md `## cobertura_del_periodo` — filas 2000, 2001, 2002 y 2003
- severidad: **bloquea**
- tipo: documento_previsible
- objecion: la tabla declara «sin documento público encontrado» para 1932-2003, y esa tabla es,
  según el propio brief, «lo que la ficha va a decir para que el lector sepa qué existe y qué no».
  Para 2000-2003 es falso, y se refuta con una consulta al índice CDX de Wayback sobre
  `ancap.com.uy`, que el lote no probó: la nota de `verificacion_manual` explica que Wayback quedó
  descartada porque «WebFetch no puede acceder a web.archive.org», pero las fuentes no se leen con
  WebFetch (regla 2) y **`pnpm fuente` llega a Wayback sin problema**: así abrí todo lo que sigue.
  ANCAP publicó sus balances en su propio sitio antes de 2005 y están archivados, con capa de texto:
  - **2003**: `Balance 31-12-2003.pdf` (KPMG, ejercicio anual, 104.666 caracteres). Trae «Resultado
    del Ejercicio 580.297.449», «TOTAL IMPUESTOS 7.278.795.414» y «Durante el ejercicio 2003 se
    vertieron a rentas generales $ 150.740.478». Hay además `Estados en U$S2003.pdf`, con los
    estados en dólares hechos por la propia empresa.
  - **2002**: `Balance31-12-2002.pdf` (84.851 caracteres), con «Versión a Rentas Generales
    (153.517.500)», más `Mem_ANCAP2002.pdf` (la memoria anual).
  - **2001**: `estadoresultadosponegoc3112001.htm` → `2001ESTADORESULTADOSPORNEGOCIOU$S.pdf` (estado
    de resultados por negocio en dólares al 31/12/2001), `activo2001pesos.htm`, `activo2001dolar.htm`
    y los balancetes trimestrales (`ENEMAR`, `ENEJUN`, `ENESET` 2001, en xls y pdf).
  - **2000**: `resultados2000dolar.htm` (que muestra «IMPUESTO A LA RENTA -22.849.153» y «RESULTADO
    NETO 30.375.871»), `activo2000pesos.htm`, `activo2000dolar.htm`, `pasivo2000dolar.htm`,
    `ActivoCorriente31122000.htm`, `ActNoCorr31122000.htm`.
  Publicar «no se encontró documento público» sobre años en los que la empresa publicó su balance
  auditado, y que están a una consulta de distancia, es lo contrario de lo que la tabla promete. Y
  tiene consecuencia de simetría, aunque nadie la haya buscado: la serie arranca justo donde termina
  el gobierno de Batlle (2000-2004), de modo que el único período de gobierno que queda representado
  por un solo año —y por el año de fuente más débil, la columna comparativa— es ese. No le imputo
  intención a nadie: el investigador declaró sus vías y una herramienta le falló. Pero el resultado
  publicable es asimétrico y hay que arreglarlo antes, no después. Que las cifras de 2003 sean
  positivas ($ 580,3 millones de ganancia) no cambia la recomendación en ningún sentido: se cargan
  porque existen.
- cita_de_contexto: «e) Durante el ejercicio 2003 se vertieron a rentas generales $ 150.740.478 (*).
  (*) Estos saldos se encuentran ajustados por inflación» y «Impuesto a la Renta de Industria y
  Comercio del ejercicio (ver Nota 19) 469.000.000 … TOTAL IMPUESTOS 7.278.795.414»
  (http://web.archive.org/web/20041109105941id_/http://www.ancap.com.uy/Balance/Balance%2031-12-2003.pdf).
- accion_sugerida: no publicar la tabla como está. Mandar el tramo 2000-2003 a una segunda vuelta
  (investigador o resolvedor) con estas URLs archivadas; `medio: ancap` (no `web.archive.org`, que
  no es un medio del corpus) y la URL archivada como `url` y `archived_url`, tal como el brief lo
  previó. Para 1931-1999 la conclusión «no encontrado» me parece sostenible con lo que hay —en el
  índice CDX solo aparecen imágenes de tapa (`Memoria_y_Balance2001.gif`,
  `1996_Report_and_Balance.gif`, 1997, 1998), no documentos—, pero conviene redactarla como
  «no encontrado en estas vías», que es lo que se probó, y listar las vías. Vías adicionales que
  quedan sin probar y que un resolvedor debería agotar antes de cerrar: el índice CDX de
  `ancap.com.uy` con otros filtros (`estados`, `situacion`, `pdfs`), la Memoria del Poder Ejecutivo
  de los años 2001-2005 en `archivo.presidencia.gub.uy` (probé `mem2002`, `mem2003` y `mem2004` con
  la ruta `/info/ANCAP.htm` del año 2000 y dan 404: la ruta cambia, hay que entrar por el índice de
  cada memoria) y el Diario Oficial de IMPO por fecha de publicación de balances de entes.
  Descarto, en cambio, una vía que el lote anotó como pendiente: leí el informe final de la Comisión
  Investigadora del Senado (520.423 caracteres) y **no** reproduce una serie de resultados del
  ejercicio; es un informe sobre presuntas irregularidades, fuera del alcance de esta corrida.

### notas.md `## para_el_editor` — candidatos a hito 1999-2008
- severidad: corregir
- tipo: presentacion
- objecion: los cuatro candidatos están bien documentados, pero dos advertencias y tres ausencias.
  Advertencias: (1) la capitalización del préstamo a **DUCSA** por US$ 32 millones (2007-2008) es
  ANCAP capitalizando a su filial, plata que *sale* de ANCAP; no confundirla con
  `capitalizaciones_del_estado`, que el esquema define como «lo que el Estado puso en la empresa».
  (2) El candidato «Alcoholes del Uruguay S.A., 1/12/1999, CND + ANCAP» probablemente **no** es la
  ALUR S.A. que la ficha nombra hoy en `que_hace` (la que opera Bella Unión, constituida alrededor
  de 2006); el propio investigador lo marcó. No cargarlo como creación de ALUR sin un segundo
  documento que aclare si es la misma sociedad. Ausencias, todas con documento leído en esta
  crítica: el préstamo del MEF del 2/1/2013 (US$ 517.268.037), la venta de Petrolera del Conosur a
  PDVSA Argentina («Contrato de Compraventa de Acciones firmado el 30 de setiembre de 2011»,
  balance 2012) y la adopción de NIIF en el ejercicio 2014, que es lo que explica el cambio de base
  entre 2013 y 2014. La línea de tiempo publicada hoy salta de 2003 a 2016.
- accion_sugerida: sumar los tres, y mantener la advertencia sobre DUCSA y ALUR en el traspaso al
  editor.

---

## Objeciones al lote

- **El hueco de 2014 en medio de una serie de 21 años.** El balance individual 2014 existe y es
  legible: `https://www.ancap.com.uy/innovaportal/file/242/1/ancap-31-12-14--individual.pdf` (lo
  abrí; 135.065 caracteres, con «Total impuestos 15.638.118.684», el desglose por división y la nota
  de rentas generales). La ficha publicada carga 2014 solo con `resultado_ejercicio`, tomado de la
  columna comparativa del balance 2015. Con esta corrida, 2004-2013 quedan completos y 2015-2024
  también, y 2014 queda como el único año con un solo campo: cualquier gráfico de impuestos, deuda o
  transferencias va a tener un agujero exactamente ahí. Es una objeción `documento_previsible` de
  manual: el documento existe, es del organismo obvio, y sin él la serie que la ficha va a anunciar
  como «2004 a 2024» no es tal. Severidad corregir; el lote no debería cerrarse sin ese año.
- **La ficha va a decir «Balances cargados: 2004 a 2024» y el `resumen` sigue escrito para
  2015-2024.** Empieza en «En los diez años de 2015 a 2024…», llama a 2014 «el año anterior al
  período de esta ficha» y describe transferencias e impuestos solo de ese tramo. Si se publica así,
  el texto que el lector lee primero contradice el gráfico que mira después, y además describe con
  detalle un período de gobierno y no los otros. Hay que reescribirlo para 2004-2024 con el mismo
  nivel de detalle para todos los períodos, y (ver transversal de impuestos) sin la frase «sin
  contar el impuesto a la renta propio de ANCAP».
- **Dependencia de una sola fuente: correcta acá, pero conviene decirlo.** Todo el lote se apoya en
  un único emisor, ANCAP, que es a la vez la empresa retratada. No es la falla de «un solo grupo de
  medios» —son estados contables auditados por KPMG, que es la fuente primaria correcta y el esquema
  la prefiere—, pero sí obliga a lo que estas objeciones piden: registrar cuándo la propia ANCAP
  informa dos cifras distintas del mismo año (2011 en impuestos, 2013 en resultado) en vez de elegir
  una en silencio.
- **Simetría dentro del tramo cargado: sin objeción.** Los diez años llevan exactamente los mismos
  cuatro campos, con el mismo criterio de renglón, la misma convención de tipo de cambio y notas
  solo donde hay algo técnico que aclarar. Revisé `concepto` y `nota` uno por uno buscando adjetivos
  o verbos de intención y no hay ninguno. Los resultados que la serie muestra son mixtos dentro de
  cada gobierno (2005 +57,5; 2006 −4,2; 2007 +37,2; 2008 −57,1; 2009 +91,8; 2010 +72,6; 2011 −94,5;
  2012 −15,1; 2013 −168,1 millones de dólares), así que ninguna decisión de recorte que yo objete
  favorece o perjudica a nadie de manera previsible. La única asimetría real del lote es de
  cobertura, y está arriba: falta el tramo 2000-2003.
- **Regla 2 (procedimiento).** `consultas.jsonl` registra dos lecturas con WebFetch
  (`https://www.ancap.com.uy/518/1/balance-anual-2003.html` y
  `http://web.archive.org/web/2004*/ancap.com.uy`). No se citó nada de ellas, así que no contamina
  ningún registro, pero el fallo de la segunda es lo que llevó a descartar Wayback y de ahí sale la
  objeción que bloquea. Con `pnpm fuente` las dos habrían andado.
- **Ayudas visuales.** Con 21 ejercicios, la ficha necesita que el editor confirme tres cosas antes
  de promover: que la página dibuja resultado, impuestos y deuda como serie temporal (y no como
  tabla larga), que el cambio de base contable 2013/2014 y el hueco de 2014 quedan visibles, y que
  los `segmentos[]` que se carguen de los balances viejos (Energía/Pórtland, pesos) no se grafiquen
  mezclados con los de 2016-2024 (líneas de negocio, dólares) sin una nota que lo diga.
- **Aviso fuera de alcance.** `content/empresas/ancap.yaml` tiene 10 líneas con tabulaciones dentro
  de citas sin comillas (todas en `precios_vs_paridad`, copiadas de la planilla de URSEA). El parser
  del sitio las acepta, PyYAML no. Es preexistente, no es de este lote y no afecta al build; lo dejo
  anotado porque es una fragilidad latente para cualquier herramienta externa que quiera auditar el
  archivo.

## Objeciones al brief

Ninguna por Regla 0. El brief pide «todos los años con balance público, hasta donde existan
documentos, con el mismo detalle y el mismo rigor que los años ya cargados», nombra las vías de
búsqueda sin excluir ninguna y pide explícitamente que se declare qué no se encontró. Es el criterio
correcto y es simétrico: no selecciona años, no menciona partidos y no orienta el resultado. Dos
observaciones menores, que son de precisión y no de sesgo:

1. El brief dice «la sección de balances tiene ejercicios desde 2005 al menos». Ese «al menos» se
   leyó, en los hechos, como un piso: la búsqueda hacia atrás se concentró en el sitio vivo y en
   registros de organismos, y el sitio archivado de la propia empresa —donde estaban 2000-2003— se
   probó una sola vez y con la herramienta equivocada. Para la próxima conviene que el brief lo pida
   por su nombre: «índice CDX de Wayback sobre el dominio del organismo, leído con `pnpm fuente`».
2. El brief pide cargar `segmentos[]` «si el documento los informa» pero no advierte que los
   balances viejos los llaman «divisiones». Esa sola palabra explica la pérdida de diez años de
   desglose Energía/Pórtland.

## Cobertura

Ningún registro de tono. Este lote no leyó notas de prensa: sus 62 consultas y la totalidad de las
fuentes citadas son documentos oficiales (estados contables auditados de ANCAP, Memoria del Poder
Ejecutivo, portales de MEF/OPP/catalogodatos y una comisión del Parlamento). Los documentos que
abrí yo para criticarlo son de la misma naturaleza. Un registro `cobertura` mide cómo un medio trata
a un político o a un partido en una nota; acá no hay ni medio ni nota que medir, y forzar uno sería
inventar un dato.

Tampoco corresponde `discrepancias.yaml`. Encontré tres inconsistencias entre documentos —el «Total
impuestos» de 2011, el resultado de 2013 y el comparativo de impuestos de 2006—, pero las tres son
de ANCAP contra ANCAP, es decir, la misma fuente primaria informando dos veces el mismo año. Una
discrepancia exige que lo publicado por un **medio** no coincida con el documento; sin medio no hay
discrepancia, hay una nota al pie que la ficha tiene que llevar, y por eso están arriba como
objeciones y no acá.

---

## Recuento

- bloquea: **2** (el `concepto` de impuestos en los diez años; las filas 2000-2003 de
  `cobertura_del_periodo`)
- corregir: **11** (segmentos por división; citas de cotizaciones sin encabezado; ceros de
  transferencias sin concepto; base mixta de 2004; impuestos de 2011 y su explicación no
  respaldada; nota de reexpresión de 2013; reexpresión de 2013 bajo NIIF en el balance 2014;
  préstamo del MEF en 2012-2013; hitos faltantes y advertencias sobre DUCSA/ALUR; balance individual
  2014 no cargado; `resumen` escrito para 2015-2024)
- aviso: **6** (2005, 2006, 2007, 2008 —dos puntos—, 2009/2010 sin objeción propia; regla 2 con
  WebFetch; tabulaciones preexistentes en el YAML publicado)
- registros `cobertura`: **0**, con el motivo explicado arriba
- `discrepancias.yaml`: **no se emite**, con el motivo explicado arriba
