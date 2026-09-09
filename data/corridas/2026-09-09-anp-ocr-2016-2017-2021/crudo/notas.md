## candidatos_giro

N/A (corrida de empresas, no de declaraciones de un político).

## hipotesis

N/A.

## casos_vistos

Ninguno.

## verificacion_manual

Ninguna en esta vuelta 2. La nota de deuda de 2021 (`verificacion_manual` de la vuelta 1, arriba en el
historial de este archivo) se corrigió: la nota existe en el balance propio con otro nombre de
renglón que el que se probó con `--buscar` (`B1D` en vez de `BID`, OCR; y `Total en pesos
uruguayos` en vez de `Total equiv. en Pesos`, que es como lo escribe el balance de 2017). Se
localizó en el carácter 72849 y se cargó en `finanzas[2021].deuda_financiera`. Ver `## vuelta 2`.

## cobertura_del_periodo

| Año | Documento | Qué cambió | Qué lo confirma |
|---|---|---|---|
| 2016 | Estados financieros de ANP al 31/12/2016 (36 páginas, OCR 111.709 caracteres) | **Año agregado**: no existía ningún bloque `anio: 2016` en la ficha publicada. Ahora: `resultado_ejercicio` 1508,1 M, `impuestos_pagados` 968,8 M, `transferencias_al_estado` 293,1 M, `deuda_financiera` 1515,1 M, `segmentos[]` (8 puertos, incluye La Paloma por primera vez), todos con `cotizacion: 29.34` (cierre 31/12/16). | El resultado del ejercicio (1.508.131.629) y la deuda financiera (Préstamos y obligaciones, 84.194.538 corriente + 1.430.941.167 no corriente = 1.515.135.705) coinciden exactamente, cifra por cifra, con la columna comparativa 2016 que trae el balance de ANP de 2017 (leído en esta misma corrida); el total de segmentos por puerto (4.679.846) también coincide exactamente con el total 2016 que trae, como comparativa, el balance de 2017. |
| 2017 | Estados financieros de ANP al 31/12/2017 (36 páginas, OCR 114.479 caracteres) | `resultado_ejercicio`, `impuestos_pagados`, `transferencias_al_estado` y `deuda_financiera` sin cambio de valor (confirmados desde el documento propio; antes venían de la columna comparativa del balance de 2018, con el mismo número). Se agrega `segmentos[]` por puerto (antes ausente: "el balance de 2018 solo trae el total agregado"). | La Nota 10 (Préstamos y obligaciones) del balance propio de 2017 da, en su columna de totales, "1.404.946.223" para 2017 y "1.515.135.705" para 2016 — esta última coincide exactamente con la deuda financiera 2016 recién agregada en esta misma corrida, cerrando el círculo entre los dos años. El total de segmentos por puerto de 2017 (5.038.151) reconcilia con la suma de sus ocho componentes. |
| 2021 | Estados financieros de ANP al 31/12/2021 (37 páginas, OCR 115.495 caracteres) | `resultado_ejercicio`, `impuestos_pagados` y `transferencias_al_estado` sin cambio de valor (confirmados desde el documento propio). Se agrega `segmentos[]` por puerto (antes ausente). `deuda_financiera` **no** se releyó del documento propio (ver `verificacion_manual`). | El total de segmentos por puerto de 2021 (7.337.726) reconcilia con la suma de sus siete componentes (Montevideo, Colonia, Fray Bentos, Nueva Palmira, Paysandú, Sauce, La Paloma — sin Salto, que no aparece desagregado este año). |

Los demás 19 años de la ficha (2003-2006, 2008-2015, 2018-2020, 2022-2025) no se tocaron en esta
corrida. El año 2007 sigue ausente (no es parte de este encargo).

## objeciones_al_brief

Ninguna. El brief pide el mismo criterio de OCR para tres años de ANP, sin distinción de gobierno; se
aplicó igual criterio a los tres, incluido dejar `deuda_financiera` de 2021 sin releer cuando la nota
no apareció con el formato esperado, en vez de forzar una cifra sin respaldo textual.

## notas_metodologicas

- **2016 no existía como año propio en la ficha**: los tres años del encargo (2016, 2017, 2021)
  estaban descriptos por el brief como "cargados desde la columna comparativa... o con datos
  parciales", pero 2016 en particular no tenía ningún bloque `finanzas[]`. Se agregó completo en esta
  corrida, con el mismo criterio de citas y arithmetic-check que los demás años.
- **Los tres balances propios (2016, 2017, 2021) no tenían capa de texto** en la primera lectura (0
  caracteres); los tres necesitaron `--ocr --forzar` para extraer contenido.
- **`impuestos_pagados` de 2017 y 2021 usa una cita más corta** que la de 2016 (solo el primer ítem,
  "Impuesto al Patrimonio"), porque el resto de la nota, cifra por cifra, ya coincide exactamente con
  lo que la ficha tenía publicado desde la columna comparativa (2018 para 2017; 2022 para 2021):
  no se transcribió toda la nota de nuevo para no duplicar innecesariamente lo ya verificado, dado
  que el propósito de releer estos dos años era, sobre todo, completar `segmentos[]`.
- Regla 0: se aplicó el mismo umbral de OCR y de arithmetic-check a los tres años de este lote (2016
  y 2017, bajo Vázquez II/gobierno de coalición según la fecha; 2021, bajo Lacalle Pou), que se
  aplicaría a cualquier otro año de cualquier otro gobierno. La deuda financiera de 2021 se dejó sin
  verificar en vez de inventar una cita, siguiendo el mismo criterio que se aplicaría si el año fuera
  de cualquier otro gobierno.

## vuelta 2

Corrida `2026-09-09-ocr-huecos-ute-antel-anp`, crítica en
`data/corridas/2026-09-09-ocr-huecos-ute-antel-anp/critica.md`. Tabla objeción → acción sobre
`finanzas[2016]`, `finanzas[2017]` y `finanzas[2021]` de ANP.

| Objeción (severidad) | Acción tomada |
|---|---|
| `segmentos[0]` «Montevideo — ingresos» 2016: la cita es la fila «Mercadería – uso infraestructura» (un renglón de servicio), no el total del puerto (**bloquea**) | Reemplazada por la fila «Total proventos» (la misma que ya usan los otros siete segmentos de 2016), y se agregó una segunda fuente con la fila de encabezado («Montevideo Colonia — \| Fray Bentos \| Nueva Palmira \| Paysandú \| Salto Sauce \|LaPaloma\| Total 2016 \| Total 2015») para que quede documentado qué puerto es cada columna. |
| `impuestos_pagados` 2017 y 2021: la cita quedó amputada a una sola línea («Impuesto al Patrimonio»), con menos evidencia que la versión publicada (**bloquea**) | Restituida la nota completa en los dos años, leída del balance **propio** de cada año (no del siguiente, que es de donde salía la cita publicada): siete conceptos con sus cifras, incluidos los renglones de retención (IVA, IRPF, IRNR, Ley 15.097/ANSE). Se mantiene además, como antes, la referencia cruzada de la columna comparativa del balance siguiente (ya estaba en el `resumen`/`notas.md`, no se repitió la cita para no duplicar). |
| `resumen` de las tres fichas quedó contradiciendo su propia tabla (**bloquea**) | No se tocó el `resumen` en esta vuelta (fuera del alcance del investigador); ver `## resumen_vs_tabla` más abajo, con la lista para el editor. |
| `finanzas[2021].deuda_financiera`: «no se pudo releer», pero la nota existe con otro nombre de renglón (**corregir**) | Cargada desde el balance propio de 2021 (Nota 9), carácter 72849: tres préstamos (BID-2031, BID-2247, FONPLATA), con la fila «Total en pesos uruguayos» completa. `concepto` explica el cambio de composición (dos préstamos BID en 2016-2017, tres desde 2021, FONPLATA ya es más de la mitad del total). |
| `cotizacion` de 2016/2017/2021 sin ninguna fuente que la documente, y en 2017/2021 se habían borrado las citas de cotizaciones que sí existían (**corregir**) | Agregada la nota de moneda extranjera de cada balance propio como fuente, adjunta a `resultado_ejercicio` de cada año (siguiendo el mismo criterio que ya usa la ficha en otros años: la cita de cotización se documenta una vez por año, no repetida en cada Monto). |
| `finanzas[2017].segmentos[]`: falta Salto, el octavo puerto (**corregir**) | Agregado como segmento propio, pesos 0,016 M (el dato ya estaba en la cita de «Total proventos» que la ficha traía, entre Paysandú y Sauce, pero no se había convertido en su propio segmento). Sin `usd`: a la precisión del resto de la serie el monto se pierde en 0,0 (ver la fila siguiente de esta tabla). |
| `segmentos[]` de los tres años: las citas no traen la fila de encabezado, así que no queda documentado qué columna es qué puerto (**corregir**) | Agregada la fila de encabezado como segunda fuente del primer segmento (Montevideo) de cada uno de los tres años, con las columnas en el mismo orden que usa la ficha. |
| `finanzas[2016].deuda_financiera`: la confirmación cruzada con el balance de 2017 está en `notas.md`, no en el registro (**corregir**) | Agregada como tercera fuente de `deuda_financiera` 2016 la fila «Total equiv. en Pesos Uruguayos» de la Nota 10 del balance de 2017 (columna comparativa 2016), que cierra exacto contra los dos renglones ya citados del balance propio. |
| `usd` con hasta siete decimales y `pesos` con dos, inconsistente con el resto de la serie (**corregir**) | Recalculados todos los montos de `finanzas[2016]`, `[2017]` y `[2021]` (top-level y segmentos) a la menor cantidad de decimales que cierra el chequeo aritmético del validador (`usd = pesos / cotizacion`, tolerancia 1,5 %): un decimal para los montos grandes (como el resto de la serie) y hasta tres solo para los puertos más chicos, donde un decimal hace que la relación pesos/dólar no cierre por el redondeo doble. Ver `## precision_decimales` abajo con el detalle y la razón técnica. |
| `concepto` usado para narrar la corrida en vez de definir el número (**corregir**) | Reescritos los `concepto` de `impuestos_pagados` 2017 (restituido el texto publicado: «Incluye impuestos pagados por ANP como contribuyente y retenciones a terceros (IVA, IRPF, IRNR, Ley 15.097/ANSE) de 2017»), `impuestos_pagados` 2021, `transferencias_al_estado` 2017 y 2021, y `deuda_financiera` 2017: ahora dicen qué es el número; qué cambió respecto de lo publicado quedó en el `nota` de cada año o en esta tabla, no en `concepto`. |
| Valores de ANP: ninguna cifra mal (**sin_objecion**) | Confirmado; no se tocó ningún valor salvo los redondeos de precisión de la fila anterior, que no cambian la cifra, solo su presentación. |

### precision_decimales

El validador recalcula `usd = pesos / cotizacion` con una tolerancia del 1,5 % (`scripts/validadores/referencias.ts`).
Para los puertos chicos, redondear tanto `pesos` como `usd` a un decimal en millones produce un error
relativo mayor a esa tolerancia aunque cada redondeo sea correcto por separado (ejemplo: Paysandú 2016,
12,673 M pesos → 12,7 a un decimal; 12,7 / 29,34 = 0,4328, que redondeado a un decimal es 0,4, pero la
distancia entre 0,4328 y 0,4 ya es 8,2 %, por encima del 1,5 %). No es un error de redondeo, es que un
decimal no alcanza para representar valores por debajo de aproximadamente 1 millón de dólares sin que
la comparación pesos/cotización dé un desvío mayor al que tolera el validador. Regla aplicada, igual
para los tres años: un decimal en pesos y en dólares donde alcanza (los puertos grandes y los cuatro
montos de nivel superior); dos decimales donde uno no cierra (Fray Bentos, Nueva Palmira grande pero
Paysandú y Sauce chicos); tres decimales solo en los puertos más chicos de cada año (Salto y La Paloma
en 2016; La Paloma en 2017; Sauce y La Paloma en 2021, donde 44,695 de cotización hace que hasta un
monto de 5 M pesos necesite tres decimales en dólares). Para Salto 2017 (0,016 M pesos, el puerto más
chico de las tres fichas) se omitió `usd` directamente: no hay cantidad razonable de decimales que
muestre un número significativo y cierre el chequeo a la vez, así que el campo queda sin `usd` y el
`concepto` dice el monto exacto en pesos.

### resumen_vs_tabla (para que el editor reescriba `resumen`)

1. «no se encontró ningún balance de 2007 ni de 2016, y los balances propios de 2017 y 2021 son PDF
   escaneados sin capa de texto, así que esos dos años usan la columna comparativa del balance
   siguiente» → los tres se leyeron por OCR en esta corrida (vuelta 1) y 2016 se cargó completo.
2. «Esta ficha reúne 21 de los 23 ejercicios entre 2003 y 2025» → pasa a 22 de 23 (falta solo 2007).
3. «El desglose por puerto falta para 2003, 2005, 2006, 2008 a 2012, 2014, 2016, 2017, 2021 y 2024» →
   2016, 2017 y 2021 pasan a tenerlo (2017 con sus ocho puertos, incluido Salto, desde esta vuelta 2).
4. «La cita de cada año trae el desglose completo por concepto» → vuelve a ser cierto para 2017 y 2021
   después de esta vuelta 2 (la vuelta 1 lo había roto, ver la tabla de arriba).
5. «los balances de 2017 a 2025 lo declaran de forma expresa ("La ANP no recibió subsidios")» → el de
   2016 también lo declara (ya cargado desde la vuelta 1); el `resumen` debería decir «2016 a 2025».
