# Crítica — corrida 2026-09-07-empresas-ute

Modelo: Opus 5 (claude-opus-5[1m]) — crítico, por la regla 14 del mantenedor (Opus solo para el crítico).
Lote: inbox/empresas/ute/2026-09-07/
Registros revisados: 1 (`empresas.yaml#0`, ficha de UTE). Las objeciones van por campo.
Estado mecánico: `pnpm validar --inbox` da 39 errores, todos "Medio desconocido" (`ute`, `augpee`,
`elpueblodigital`, `eltelegrafo`, `pv-magazine-latam`). Ninguno es de esquema.

Documentos que abrí yo en esta sesión con `pnpm fuente` (todos, salvo indicación, en
`portal.ute.com.uy`): EEFF 2015 (`UTE_311215.pdf`), EEFF 2016 (`UTE Estados financieros 2016_0.pdf`),
EEFF 2017 (`...al 31 12 17_compresión1.pdf`), EEFF 2019 (`UTE EEFF AL 31 12 19 E INFORME DE
AUDITORÍA.pdf`), EEFF 2020, EEFF 2021, EEFF 2022, EEFF 2023, EEFF 2024, la página de listado de
estados financieros, la noticia de UTE de 2019, Ley 4.273 y Ley 16.832 en IMPO, el informe de
Exante/Augpee, y las notas de El Observador, El Telégrafo, El Pueblo Digital, pv magazine y
La República.

---

## Resumen ejecutivo (lo que no puede pasar así)

Tres hallazgos cambian la ficha entera y todos salen del mismo lugar: los balances traen, en las
notas de los **Estados Financieros Separados**, dos anexos que el lote no usó.

- **Literal E — "Información respecto de los tributos abonados en el ejercicio"**: es el equivalente
  exacto del renglón "Total impuestos" que la ficha de ANCAP carga en `impuestos_pagados`. Existe en
  todos los años legibles. La ficha cargó en su lugar el IRAE pagado del flujo de efectivo, que es
  entre el 4 % y el 26 % de ese total.
- **Literal F — "Transferencias a Rentas Generales"**: dice, año por año, cuánto se pagó
  efectivamente. Contradice la nota de 2022 de la ficha ("en 2022 no hubo versión de resultados") y
  desarma la cifra de 2021.
- **El EEFF 2019 de `portal.ute.com.uy` tiene capa de texto** (381.098 caracteres). El lote lo dio
  por perdido porque probó un PDF distinto (el "resumen ejecutivo" colgado en `www.ute.com.uy`), y
  cayó en un comunicado de prensa con dólar promedio. El EEFF 2016 también tiene texto (383.458
  caracteres) y el de 2015 también (388.480). De los cuatro años "sin datos", **solo 2017 es un
  escaneo real**.

### Tabla A — `impuestos_pagados`: lo cargado contra lo que publica el balance

| año | ficha (IRAE pagado) | Literal E del balance | TC cierre | Literal E en USD | ficha en USD |
|---|---|---|---|---|---|
| 2015 | — | (Literal D, en el PDF 2015; no extraído) | 29,948 | — | — |
| 2016 | — | $ 8.501.363.431 (consolidado) | 29,34 | 289,8 M | — |
| 2019 | — | $ 8.912.101.809 (separado) | 37,308 | 238,9 M | — |
| 2020 | $ 461.157.884 | $ 7.243.069.304 (separado) | 42,34 | 171,1 M | 10,9 M |
| 2021 | $ 280.905.163 | $ 6.809.690.836 (separado) | 44,695 | 152,4 M | 6,3 M |
| 2022 | $ 3.277.052.520 | $ 12.585.878.960 (separado) | 40,071 | 314,1 M | 81,8 M |
| 2023 | $ 1.489.802.271 | $ 8.672.826.608 (consolidado) | 39,022 | 222,3 M | 38,2 M |
| 2024 | $ 1.431.393.289 | $ 11.860.529.396 (separado) | 44,066 | 269,2 M | 32,5 M |

### Tabla B — `transferencias_al_estado`: pago efectivo del ejercicio (Literal F)

| año | Literal F (pagado en el ejercicio) | ficha |
|---|---|---|
| 2014 | $ 1.354.860.000 | — |
| 2015 | $ 2.008.110.000 | — |
| 2016 | $ 6.785.864.320 | — |
| 2017 | (solo en PDF escaneado) | — |
| 2018 | $ 10.473.583.973 | — |
| 2019 | $ 6.258.501.640 | $ 6.258.501.640 ✓ |
| 2020 | $ 5.581.603.000 | $ 5.581.603.000 ✓ |
| 2021 | $ 3.004.921.602 | $ 7.744.730.362 (cargo patrimonial) |
| 2022 | $ 5.000.000.000 | ninguna, y una `nota` que dice que no hubo |
| 2023 | $ 3.603.300.000 | $ 3.603.300.000 ✓ |
| 2024 | $ 7.536.604.985 | $ 7.536.604.985 ✓ |

### Tabla C — `resultado_ejercicio` separado auditado y TC de cierre del propio balance

| año | resultado separado | TC cierre | USD | dónde |
|---|---|---|---|---|
| 2015 | $ 5.956.975.111 | 29,948 | 198,9 M | EEFF 2016, Estado de Resultados separado |
| 2016 | $ 12.189.879.271 | 29,34 | 415,4 M | EEFF 2016, Estado de Resultados separado |
| 2017 | — | — | — | solo en el escaneo |
| 2018 | $ 11.295.334.112 | 32,406 | 348,6 M | EEFF 2019, Nota 5.6.4 separada |
| 2019 | $ 6.319.716.903 | 37,308 | 169,4 M | EEFF 2019, Nota 5.6.4 separada |

Deuda financiera separada que también aparece: 2015 $ 29.532.638.733; 2016 $ 36.935.893.157;
2018 $ 35.984.345.403; 2019 $ 39.465.178.194 (Nota 5.13 del EEFF 2019, corriente + no corriente).

---

## Objeciones por campo

### 1. `finanzas[].impuestos_pagados` (2020-2024) — el campo no dice lo que la etiqueta promete
- severidad: **bloquea**
- tipo: contexto_omitido / presentacion
- objecion: el esquema define `impuestos_pagados` como "Total de impuestos del año según los estados
  contables (IMESI, IVA, IRAE, otros)". La ficha carga el IRAE pagado del Estado de Flujos de
  Efectivo y explica en `concepto` que "UTE no publica un total agregado de impuestos pagados (no
  paga IMESI)". Las dos afirmaciones del `concepto` son falsas contra el propio documento: UTE sí
  publica un total agregado (Literal E), y no paga IMESI porque **el IVA lo sustituyó en 1995**, no
  porque no tribute consumo. El efecto sobre el lector es el peor posible: la ficha de ANCAP muestra
  USD 867,8 M de impuestos en 2024 y esta mostraría USD 32,5 M para UTE, una relación de 1 a 27 que
  es un artefacto de qué renglón se eligió en cada ficha, no un hecho. Ver Tabla A.
- cita_de_contexto: "Literal E 	Información respecto de los tributos abonados en el ejercicio 2022
  expresado en pesos uruguayos / IVA 	2.634.873.988 / IMPUESTO A LA RENTA / - Crédito 2020
  3.006.443.635 / - Anticipos 	1.513.598.278 / IMPUESTO AL PATRIMONIO / - Anticipos 	1.624.213.443
  … RETENCIONES 	4.044.285.130 … Total 	12.585.878.960"
  (https://portal.ute.com.uy/sites/default/files/docs/UTE%20informe%20de%20Auditor%C3%ADa%20Consolidado%20y%20Separado%20al%2031122022_BV.pdf,
  Notas a los Estados Financieros Separados, carácter ~368.000).
  Y: "A partir del 01/05/95 y como consecuencia de la Ley N° 16.697 del 25/04/95 y del Decreto N°
  158/95 del 28/04/95, UTE pasó a ser contribuyente del Impuesto al Valor Agregado, en sustitución
  del IMESI que se tributaba hasta entonces." (EEFF 2024, Nota 4.17 Tributos).
- accion_sugerida: reemplazar el valor de `impuestos_pagados` por el Total del Literal E de cada año
  (Tabla A), con `concepto` de una frase: "Total de tributos abonados en el ejercicio según el
  Literal E de los estados financieros separados (IVA, IRAE, impuesto al patrimonio, retenciones,
  tasas)". Es el mismo criterio que ANCAP, cuyo `concepto` dice "Total de impuestos pagados y montos
  recaudados como agente de retención en el año". Si se quiere conservar el IRAE de caja, va como
  `nota` del año, no como el valor del campo. Para 2023 usar el Literal E de los **separados** del
  EEFF 2023 (`.../UTE - Estados financieros al 31.12.23 e Informe de Auditoría-ptg_0.pdf`), no el
  consolidado que cité arriba.

### 2. `finanzas[2022].nota` y `finanzas[2022].transferencias_al_estado` — la ficha afirma lo contrario del balance
- severidad: **bloquea**
- tipo: contexto_omitido / riesgo_legal (afirmación más fuerte que la fuente)
- objecion: la `nota` dice "La nota de Patrimonio de este ejercicio ('Movimientos del ejercicio
  Versión de resultados 5.16 - -') muestra que en 2022 no hubo versión de resultados a Rentas
  Generales". El mismo PDF, en la misma sección de notas y en el Literal F, dice que en 2022 se
  vertieron $ 5.000 millones. La línea del patrimonio está en cero porque el pasivo se había
  reconocido en 2021; el pago se hizo en 2022. Publicar "no hubo versión de resultados" es afirmar
  un hecho que el documento citado niega, y sobre la relación de una empresa pública con Rentas
  Generales.
- cita_de_contexto: "Durante el ejercicio 2022 fue vertida a Rentas Generales la suma de
  $ 5.000.000.000, por concepto de aporte adicional por el ejercicio 2021. Al cierre del ejercicio
  anterior se había reconocido por este concepto una reducción en los resultados acumulados y un
  pasivo por dicho monto (Nota 5.14)." y "Literal F 	Transferencias a Rentas Generales / El pago de
  versión de resultados realizado en el presente ejercicio ascendió a $ 5.000.000.000 (ver Nota
  5.16)." (mismo PDF 2022, notas separadas, caracteres ~322.822 y ~369.851).
- accion_sugerida: borrar esa `nota`; cargar `transferencias_al_estado` 2022 = $ 5.000.000.000
  (USD 124,8 M al cierre 40,071) con `concepto` de una frase: "Pago de versión de resultados
  realizado en el ejercicio, por el aporte adicional correspondiente a 2021".

### 3. `finanzas[2021].transferencias_al_estado` — dos convenciones distintas en la misma serie
- severidad: corregir
- tipo: contexto_omitido
- objecion: 2019, 2020, 2023 y 2024 usan lo **vertido en el ejercicio**; 2021 usa el **cargo
  patrimonial devengado** ($ 7.744.730.362), que es 2,6 veces lo efectivamente pagado ese año. La
  serie que la página va a mostrar no es homogénea y el pico de 2021 seguido del cero de 2022 es
  puro efecto contable. El propio balance descompone la cifra: 11.055.362 + 2.733.675.000 +
  5.000.000.000 = 7.744.730.362.
- cita_de_contexto: "En el ejercicio 2021 se había vertido, por concepto de aporte adicional por el
  ejercicio 2020, la suma de U$S 6.145.282, equivalente a $ 271.246.602 … A su vez, se había vertido
  a cuenta del resultado del ejercicio 2021 la suma de $ 2.733.675.000" y "Literal F … El pago de
  versión de resultados realizado en el presente ejercicio ascendió a $ 3.004.921.602 (ver Nota
  5.16)." (EEFF 2022 carácter ~135.100 y EEFF 2021 carácter ~374.538).
- accion_sugerida: elegir una convención para toda la serie —recomiendo el Literal F, que es caja y
  existe en todos los años (Tabla B)— y dejar la otra cifra en `nota` de una frase donde difiera.

### 4. `finanzas[2019]` — comunicado de prensa y dólar promedio cuando existe el balance auditado
- severidad: **bloquea**
- tipo: contexto_omitido / presentacion
- objecion: el resultado 2019 se tomó de una gacetilla ("$ 6.320 millones … dólares promedio
  ($ 35,255) … U$S 179,3 millones") porque el lote concluyó que el balance de 2019 era ilegible. No
  lo es: el EEFF 2019 publicado en `portal.ute.com.uy` extrae 381.098 caracteres y trae, en las
  notas separadas, el resultado contable y el tipo de cambio de cierre. La diferencia no es menor:
  USD 179,3 M con dólar promedio contra USD 169,4 M al cierre, un 6 % que es solo la convención
  cambiaria, en el único año de la serie que no la comparte. El lote probó
  `www.ute.com.uy/.../Informe Estados Financieros 2019.pdf` (que es el resumen ejecutivo escaneado,
  y el link de la propia noticia al lado dice "VER ESTADO FINANCIERO 2019") y el archivo de la Bolsa
  de Valores, pero no el que figura en la página de estados financieros que sí había abierto.
- cita_de_contexto: "Concepto 	2019 	2018 / Resultado contable 	6.319.716.903 	11.295.334.112"
  (Nota 5.6.4 de los Estados Financieros Separados) y "convertidos a moneda nacional a los tipos de
  cambio de cierre de cada ejercicio (interbancario $ 37,308 por dólar al 31/12/19 y $ 32,406 por
  dólar al 31/12/18)" —
  https://portal.ute.com.uy/sites/default/files/docs/UTE%20EEFF%20AL%2031%2012%2019%20E%20INFORME%20DE%20AUDITOR%C3%8DA.pdf
- accion_sugerida: rehacer 2019 con el balance: resultado $ 6.319.716.903 (USD 169,4 M al cierre
  37,308), impuestos abonados $ 8.912.101.809 (Literal E separado, USD 238,9 M), deuda financiera
  $ 39.465.178.194 (Nota 5.13 separada, corriente $ 3.412.769.695 + no corriente $ 36.052.408.499).
  El comunicado puede quedar como segunda fuente, con `nota` que diga que ahí la conversión es a
  dólar promedio.

### 5. `finanzas` 2015-2018 y `notas.md ## anios_sin_balance` — la premisa del hueco es falsa
- severidad: **bloquea** (para el texto de `notas.md` que el editor va a copiar; `corregir` si solo
  se agregan años)
- tipo: contexto_omitido / documento_previsible
- objecion: `notas.md` dice que los PDF de 2015 a 2018 "tanto en `portal.ute.com.uy` como en la
  Bolsa de Valores de Montevideo, son escaneos sin capa de texto (0 caracteres extraídos)". Probé
  los cuatro archivos que la propia página de UTE lista y el resultado es otro:
  - `UTE_311215.pdf` (2015 y 2014): **388.480 caracteres**, con estados primarios y notas.
  - `UTE Estados financieros 2016_0.pdf` (2016 y 2015): **383.458 caracteres**, con estados
    primarios, separados, Literal D de impuestos y versión de resultados.
  - `...al 31 12 17_compresión1.pdf` (2017 y 2016): 1.594 caracteres en 147 páginas → escaneo real,
    confirmado.
  - `UTE EEFF 31-12-2018...pdf` (2018 y 2017): 0 caracteres → escaneo real, confirmado; pero **2018
    aparece completo como comparativo en el EEFF 2019**, que sí se lee.
  Con eso, de los cuatro años que el lote da por perdidos quedan cubiertos 2015, 2016 y 2018, y
  además 2014 queda al alcance. **El único año realmente sin datos es 2017.** El brief pedía
  2015-2024 y la ficha entregaría 5 de 10 años cuando 9 son alcanzables.
- cita_de_contexto: "Resultado del ejercicio 	12.189.879.271 	5.956.975.111" (Estado de Resultados
  separado, EEFF 2016) y "Durante el presente período fue vertida a Rentas Generales la suma de
  $ 6.785.864.320 … ($ 2.008.110.000 en 2015)" (misma fuente) y "En el ejercicio 2018 fue vertida a
  Rentas Generales la suma de $ 10.473.583.973" (EEFF 2019, carácter ~115.900).
- accion_sugerida: cargar 2015, 2016, 2018 y 2019 con Tablas A/B/C. Para 2017, dejar el año con
  `nota` de una frase ("Los estados financieros de 2017 están publicados solo como escaneo sin capa
  de texto") y anotarlo como pendiente de OCR: `pnpm fuente` avisa que falta `pdftoppm` (poppler) en
  esta máquina, y el documento existe. Es `documento_previsible` en sentido literal: el PDF está en
  `portal.ute.com.uy`, solo hace falta rasterizarlo. Segunda vía si el OCR no llega: la Auditoría
  Interna de la Nación (`ain.gub.uy`) y el Tribunal de Cuentas publican los estados de los entes, y
  la Rendición de Cuentas del MEF trae las versiones a Rentas Generales por empresa.

### 6. `monopolio.alcance` — una afirmación sin fuente que contradice la ley que la propia ficha cita
- severidad: **bloquea**
- tipo: riesgo_legal / contexto_omitido
- objecion: la última oración de `alcance` dice: "Según cobertura de prensa que recoge un informe
  encargado por la asociación de generadores privados, UTE mantiene además, en los hechos, el
  monopolio de la compra de la energía que producen los generadores privados…". Tres problemas.
  (a) `alcance` es el campo donde la página describe qué tiene reservado por ley, y no lleva
  `fuentes` propias: una afirmación en disputa queda impresa como si fuera la descripción legal.
  (b) La frase "monopolio de la compra" **no está en el informe de Exante**: la busqué en el PDF y
  no aparece. Viene de la columna de Stipanicic, que es un argumento, y ya está —bien— en
  `argumentos_en_contra`. (c) Contradice el art. 11 de la Ley 16.832 que la propia ficha transcribe
  dos campos más abajo: "Los generadores podrán celebrar contratos de suministro directamente con
  distribuidores y grandes consumidores".
- cita_de_contexto: "[monopolio de la compra] sin coincidencias en esta nota" sobre
  https://augpee.org.uy/wp-content/uploads/2024/10/Informe-Transmisi%C3%B3n-y-Distribuci%C3%B3n-de-Energ%C3%ADa-El%C3%A9ctrica-en-Uruguay.pdf
  y, en el propio informe: "Los grandes consumidores de energía eléctrica pueden optar por ir al
  mercado mayorista y comprarle a un privado o pueden comprarle a UTE."
- accion_sugerida: sacar esa oración de `alcance`. Si se quiere conservar el planteo, va como
  `argumentos_en_contra` con `quien: Alejandro Stipanicic` y su cita, que ya está en la ficha.

### 7. `creacion`, `monopolio.normas` y `monopolio.alcance` — falta 1977, y la fuente lo dice en el párrafo siguiente
- severidad: **bloquea**
- tipo: cita_fuera_de_contexto
- objecion: la ficha cuenta que el monopolio de 1912 duró hasta la Ley 16.832 de 1997. El propio
  balance que cita dice otra cosa, y lo dice en la oración inmediatamente posterior a donde la cita
  se corta: el régimen de monopolio terminó con el Decreto Ley 14.694 (1977) y sus continuaciones de
  1980 y 1991. La cita de `creacion.fuentes[1]` termina en "…respaldar su autoridad." y la de
  `que_hace_fuentes[2]` empieza dos párrafos después, salteando exactamente el que desmiente el
  relato. Además, el brief pedía expresamente la Ley 14.694 y `normas[]` no la tiene.
- cita_de_contexto: "Se le confirió el monopolio estatal del suministro eléctrico para todo el
  territorio nacional y se la amparó reconociéndole derechos y privilegios legales para facilitar
  su gestión y respaldar su autoridad. **Por Leyes N° 14.694 del 01/09/77, N° 15.031 del 04/07/80 y
  N° 16.211 del 01/10/91, el Ente deja de cumplir sus funciones específicas en régimen de monopolio
  y se le amplían sus posibilidades de actuación…** Por el art. 265 de la Ley Nº 16.462 del 11 de
  enero de 1994 se amplía su giro… Con fecha 17 de junio de 1997 el Poder Ejecutivo promulgó la Ley
  Nº 16.832 que sustituye el artículo 2° del Decreto - Ley Nº 14.694…"
  (https://portal.ute.com.uy/sites/default/files/docs/UTE%20EEFF%20AL%2031.12.20%20E%20INFORME%20DE%20AUDITOR%C3%8DA.pdf,
  Nota 1.1, y el mismo texto en el EEFF 2019).
- accion_sugerida: extender la cita hasta incluir el párrafo de 1977; agregar a `normas[]` el
  Decreto Ley 14.694 (01/09/1977) leído en `impo.com.uy`, y reescribir `alcance` para que la
  cronología sea 1912 → 1977 → 1994 → 1997 → Decreto 276/002.

### 8. `monopolio.argumentos_a_favor[0]` (Exante/Augpee) — la cita se corta justo antes de su límite
- severidad: **bloquea**
- tipo: cita_fuera_de_contexto
- objecion: es el único argumento de la ficha que realmente defiende la reserva de trasmisión y
  distribución, y está usado contra lo que su autor aclara a renglón seguido. El informe dice que la
  calificación de monopolio natural **no implica que la propiedad ni la gestión deban ser
  estatales**, y que en el mundo hay redes privadas con monopolio natural en su área. Tal como está,
  la página va a imprimir a Exante respaldando el monopolio *estatal* de UTE, que es precisamente lo
  que el informe se cuida de no decir. Va agravado por el hecho de que el mismo informe concluye que
  los peajes "exceden largamente los costos efectivos de UTE".
- cita_de_contexto: "…tener múltiples empresas construyendo redes paralelas de trasmisión y
  distribución sería económicamente ineficiente… **Es importante notar que la calificación de
  monopolio natural no necesariamente implica que la propiedad y/o la gestión de las redes debe ser
  estatal. De hecho, la estructura del mercado y la propiedad de los activos son dos dimensiones
  distintas, existiendo en el mundo numerosos ejemplos en los cuales las redes de trasmisión y
  distribución son de propiedad de empresas privadas…**" (informe Exante/Augpee, carácter ~15.445).
- accion_sugerida: extender el `texto` del argumento con esa aclaración, o dejarlo y agregar un
  segundo argumento en contra con la conclusión del informe sobre los peajes. Cualquiera de las dos,
  pero no publicar la mitad.

### 9. `monopolio.argumentos_a_favor[1]` (Bentancor) — es un argumento sobre propiedad, no sobre monopolio
- severidad: corregir
- tipo: explicacion_alternativa / presentacion
- objecion: "UTE tiene que seguir siendo una empresa del Estado para el Estado y para la gente" es
  una defensa de la propiedad estatal, no de la reserva legal de trasmisión y distribución. Son
  cosas distintas —lo dice el propio informe de Exante en la cita de la objeción 8— y la ficha las
  fusiona. Verifiqué la nota entera: Bentancor habla de matriz energética, inversión pública desde
  2005 y función social; en ningún tramo defiende que la distribución deba ser monopolio. Con esto,
  la ficha se queda con **un solo** argumento a favor del monopolio, y es el de la objeción 8.
- cita_de_contexto: "Para el vicepresidente del ente, la energía no puede pensarse únicamente desde
  la lógica comercial. Insistió en que las empresas públicas deben cumplir una función social y
  estratégica para el desarrollo nacional. 'UTE tiene que seguir siendo una empresa del Estado para
  el Estado y para la gente', afirmó."
  (https://elpueblodigital.uy/roberto-bentancor-ute-tiene-que-seguir-siendo-una-empresa-del-estado-al-servicio-de-la-gente/)
- accion_sugerida: conservarlo pero con `texto` que no le atribuya más de lo que dijo ("defiende que
  UTE siga siendo una empresa estatal con función social; no se pronuncia en la nota sobre la
  reserva legal de trasmisión y distribución"), y buscar un argumento a favor del monopolio en
  sentido estricto (ver objeción 11).

### 10. `monopolio.argumentos_en_contra[0]` (Stipanicic) — falta el mismo dato de posición que se da del otro lado
- severidad: corregir
- tipo: asimetria (Regla 0) / contexto_omitido
- objecion: de Bentancor se dice "vicepresidente de UTE y exdirigente de AUTE", que es lo correcto.
  De Stipanicic se dice "expresidente de ANCAP", y se omite que lo fue por designación del gobierno
  de Lacalle Pou (Partido Nacional), que es el dato equivalente. Si el vínculo de uno se declara, el
  del otro también. Falta además el disparador de la columna, que el propio medio explica: el
  Directorio no renovó el contrato con Fenirol tras una observación del Tribunal de Cuentas "por
  falta de disponibilidad presupuestal". Sin eso, la cita queda como una tesis general cuando es una
  reacción a una decisión puntual.
- cita_de_contexto: "El Directorio de UTE resolvió la semana pasada con los votos del oficialismo no
  renovar el contrato de compraventa de energía con la empresa Fenirol S.A … el nuevo Directorio
  revirtió la decisión dando lugar a una observación efectuada por el Tribunal de Cuentas 'por falta
  de disponibilidad presupuestal' y resolvió no reiterar el gasto."
  (https://www.elobservador.com.uy/economia-y-empresas/stipanicic-el-monopolio-la-compra-generacion-electrica-ute-es-absurdo-y-hay-que-combatirlo-n6008574)
- accion_sugerida: completar `quien` con el cargo y quién lo designó, y agregar el contexto del caso
  Fenirol en el `texto` o en una segunda oración. El mismo criterio, aplicado a los cuatro
  argumentos.

### 11. `monopolio` — asimetría de origen de los argumentos, y un documento previsible sin buscar
- severidad: corregir
- tipo: asimetria (Regla 0) / documento_previsible
- objecion: `notas.md` lo dice con honestidad ("me costó más encontrar argumentos a favor") y hay
  que tomarlo en serio, porque el resultado es que **tres de los cuatro argumentos salen del mismo
  campo**: Exante (contratada por Augpee), Fraschini (Augpee) y Stipanicic. El único de la otra
  vereda no habla del monopolio (objeción 9). La ficha de ANCAP, con el mismo esquema, tiene siete
  argumentos con un presidente de la República, un expresidente de la empresa y candidato
  presidencial, un sindicato y una ley de un gobierno. La diferencia no es de disponibilidad de
  fuentes: es de dónde se buscó. Y hay un documento que decide y que nadie abrió: **la respuesta de
  URSEA y de UTE al planteo de los peajes**. El propio informe de Exante dice que entrevistó a
  autoridades de URSEA y de UTE; URSEA es quien fija la remuneración regulatoria de las redes y
  publica sus resoluciones.
- cita_de_contexto: "También se realizaron entrevistas con autoridades de Ursea y UTE y con algunos
  actores del sector privado 'para validar nuestra comprensión de la contabilidad regulatoria'"
  (https://www.eltelegrafo.com/2024/10/generadores-privados-consideran-abusivo-el-precio-que-cobra-ute-por-redes-de-transmision/);
  y "La ley establece que la Ursea periódicamente tiene que revisar esos costos, recalcularlos"
  (misma nota, Fraschini).
- accion_sugerida: buscar, con el mismo esfuerzo, en este orden: (1) **URSEA** (`ursea.gub.uy`, ya
  existe `content/medios/ursea.yaml`), resoluciones y estudios de remuneración de trasmisión y
  distribución, y cualquier respuesta al informe de Exante; (2) **AUTE** (`aute.uy`), que es el
  equivalente exacto de Fancap en la ficha de ANCAP, sobre por qué las redes deben seguir en manos
  del Estado; (3) **MIEM / Dirección Nacional de Energía**, Política Energética 2005-2030;
  (4) **versiones taquigráficas del Parlamento** (`parlamento.gub.uy`, medio ya existente) de las
  comisiones de Industria y Energía donde UTE explicó los peajes o la no renovación de contratos —
  es el `documento_previsible` clásico de esta colección; (5) el **decreto de venta directa
  impulsado por Paganini** que, según El Observador, UTE rechazó: si existe, está en IMPO y es una
  norma que cambia el alcance, no una opinión. El lote no se cierra sin al menos (1) y (4)
  intentados y anotados.

### 12. `finanzas[].segmentos` vacío en todos los años — la razón existe y no se le cuenta al lector
- severidad: corregir
- tipo: presentacion
- objecion: verifiqué la Nota 12 y el lote tiene razón: UTE informa segmentos pero declara que los
  resultados no son atribuibles. La decisión de no inventar un resultado por segmento es correcta y
  hay que decirlo así. Lo que falta es que el lector lo sepa: la página de ANCAP deja prender
  segmentos y la de UTE va a mostrar el bloque vacío sin explicación, lo que se lee como que faltó
  trabajo.
- cita_de_contexto: "UTE mantiene una actividad integrada verticalmente desde la generación hasta la
  comercialización de energía eléctrica, no encontrándose disponible información financiera
  diferenciada de los ingresos atribuibles a cada segmento, tal como lo requiere la norma, motivo
  por el cual, todo el ingreso por venta de energía eléctrica se expone dentro del segmento
  'Comercial'. … Los saldos y transacciones no distribuidos comprenden principalmente los activos
  distintos a la propiedad, planta y equipo e intangibles …, todos los pasivos y los resultados
  asociados, que no pueden ser directamente atribuibles a los segmentos." (EEFF 2024, Nota 12 de los
  Estados Financieros Separados, carácter ~361.000 en la versión consolidada y ~352.000 en la
  separada).
- accion_sugerida: una oración en `resumen` (la escribe el editor) y una `nota` de una frase en el
  último año con datos: "Los estados financieros informan segmentos (Nota 12) pero no atribuyen
  resultados por segmento". Nada más largo: `nota` se imprime al pie de la celda. Dato adicional
  disponible si el editor lo quiere: el Literal D de cada balance sí desagrega **costos** por
  generación, trasmisión, distribución y despacho (2022: generación $ 11.768.002.384, trasmisión
  $ 1.728.897.944, distribución $ 5.051.266.960, despacho $ 206.526.307, compra de energía
  $ 19.514.403.559).

### 13. `comparaciones[0]` y `[1]` — la fuente es quien repitió, no quien hizo, y son de hace un año
- severidad: corregir
- tipo: presentacion
- objecion: tres cosas. (a) `medio: pv-magazine-latam` es el medio que repitió el barómetro de SEG
  Ingeniería; la página va a imprimir a pv magazine como autor de la comparación. SEG publica el
  informe mensual "Indicadores Energéticos" en su propio sitio desde 2008. (b) El período es agosto
  de 2025 y la ficha se publica en septiembre de 2026: hay ediciones mucho más recientes del mismo
  barómetro. (c) `valor_par` mete cuatro países en una sola cadena de texto y `valor_propio` mete
  una valoración ("el más caro de la región") dentro de un campo de valor; el esquema pide una
  comparación por par y la página imprime cada fila.
- cita_de_contexto: "Según hace constar desde SEG Ingeniería, para el cálculo de la tarifa eléctrica
  del sector industrial, la estimación se realiza en base a una cuenta tipo con un consumo mensual
  de 400 MWh, desde agosto de 2008. … se analizan cuatro tarifas: Simple (216 kWh), Consumo Básico
  (113 kWh), Doble Horario (437 kWh) y Triple Horario (522 kWh)."
  (https://www.pv-magazine-latam.com/2025/09/23/precios-de-la-electricidad-en-el-cono-sur-chile-y-uruguay-la-industrial-y-la-residencial-mas-cara-paraguay-la-mas-barata-en-ambas/)
  — el método está declarado en la nota, así que ese punto está bien cubierto; lo que falta es la
  publicación original.
- accion_sugerida: citar el PDF de SEG (`https://www.segingenieria.com/category/indicadores/`, un
  número por mes) como fuente de la comparación, con pv magazine como segunda fuente si se quiere;
  usar la edición más reciente disponible; y partir en una fila por país (`con: Chile`,
  `con: Brasil`, `con: Argentina`, `con: Paraguay`), dejando el método en `indicador`
  ("precio residencial en USD/MWh, cuenta tipo ponderada de cuatro tarifas, metodología SEG").

### 14. `comparaciones` — falta la comparación que publica la propia empresa
- severidad: corregir
- tipo: asimetria
- objecion: las dos únicas comparaciones de la ficha muestran a Uruguay caro, y vienen de una
  consultora privada vía un medio especializado. UTE publica bimestralmente su propio "Comparativo
  Regional de Tarifas", que el lote abrió y descartó porque las etiquetas de país de las barras se
  pierden en la extracción de texto. El motivo técnico es válido, pero el resultado es que la única
  voz en el campo de comparaciones es la de un tercero, cuando el documento de la empresa existe.
  Eso no es "buscar lo desfavorable": es no haber buscado el otro documento con la misma
  insistencia con la que se buscó este.
- accion_sugerida: reintentar
  `https://www.ute.com.uy/sites/default/files/docs/Comparativo Regional de Tarifas - Edición
  Noviembre 2024.pdf` (y la edición vigente) con `--buscar` sobre los encabezados de las tablas, no
  sobre los gráficos; si las barras siguen sin etiquetas, decirlo en `notas.md` como intento fallido
  documentado y no cargarlo. Alternativa con datos por país inequívocos: CIER, que publica el
  informe de tarifas regionales que suele citarse en esta discusión.

### 15. `hitos: []` — la ficha no tiene línea de tiempo y hay material leído para diez hitos
- severidad: corregir
- tipo: presentacion
- objecion: el esquema tiene `hitos[]` justamente porque un lector pidió que la ficha condense en un
  vistazo lo que en prosa ocupa párrafos, y `alcance` hoy es un párrafo de 15 líneas con seis fechas
  adentro. Todo lo necesario ya está leído en este lote.
- accion_sugerida: armar `hitos[]` con, como mínimo: 1912-10-21 Ley 4.273, creación con el
  suministro reservado al Estado (IMPO + Nota 1 de cualquier EEFF); 1977-09-01 Decreto Ley 14.694,
  fin del régimen de monopolio (Nota 1); 1994-01-11 Ley 16.462 art. 265, actuación fuera de
  fronteras (Nota 1); 1995-05-01 Ley 16.697 y Decreto 158/95, UTE pasa a pagar IVA en sustitución
  del IMESI (Nota 4.17); 1996 Ley 16.736 art. 665, contribuyente de impuesto al patrimonio (Nota
  4.17); 1997-06-17 Ley 16.832, mercado mayorista y competencia en generación (IMPO); 2002 Decreto
  276/002, trasmisión y distribución pueden prestarse por el ente o en concesión (informe Exante);
  2010 transferencia de $ 2.997.000.000 para constituir el Fondo de Estabilización Energética (EEFF
  2015/2016); 2015-2016 parque eólico de Valentines, 70 MW, operativo (EEFF 2016); 2023-08-11 Ley
  20.181, los activos y pasivos de Gas Sayago pasan a UTE y ANCAP (página de EEFF de UTE); 2024
  cierre del anillo de 500 kV, inversión del orden de USD 200 millones (informe Exante). Los
  contratos eólicos que pide el encargo entran por Valentines y por el detalle de compra de energía
  del Literal D.

### 16. `tipo: empresa_publica` — el documento y la ficha hermana dicen ente autónomo
- severidad: corregir
- tipo: presentacion / asimetria
- objecion: los estados financieros dicen "creó la UTE, **ente autónomo** al cual se le concedió
  personería jurídica". ANCAP, que es igualmente un ente autónomo, está publicada con
  `tipo: ente_autonomo`. Publicar UTE como `empresa_publica` y ANCAP como `ente_autonomo` hace que
  el sitio muestre dos formas jurídicas distintas para dos entes de la misma naturaleza. El valor lo
  fijó el brief, no el investigador (ver Objeciones al brief).
- accion_sugerida: `tipo: ente_autonomo`.

### 17. `que_hace` — dos afirmaciones que las fuentes citadas no respaldan
- severidad: corregir
- tipo: riesgo_legal (afirmar más que la fuente)
- objecion: (a) dice que opera generación "hidráulica, eólica, fotovoltaica y térmica"; la cita del
  balance dice "parque generador hidrotérmico y eólico propio", sin fotovoltaica. (b) dice que
  "participa de la interconexión eléctrica con Argentina (Central Hidroeléctrica de Salto Grande)";
  la cita dice que se dispone de "945 MW de potencia instalada en la Central de Salto Grande
  correspondiente a Uruguay" y, por separado, de "570 MW de capacidad de interconexión con Brasil en
  Rivera y Melo". La represa binacional y la interconexión son cosas distintas y la fuente no
  atribuye a UTE la interconexión con Argentina.
- accion_sugerida: ajustar el texto a la cita, o traer una fuente de UTE que enumere el parque
  fotovoltaico y la interconexión con Argentina.

### 18. `creacion.fuentes[0]` — lo citado es el resumen de IMPO, no el articulado
- severidad: corregir
- tipo: presentacion
- objecion: la cita de la Ley 4.273 sale del campo "Resumen:" de la ficha de IMPO, no del texto de
  la ley. Es un documento oficial y la cita es literal, así que no es un problema de veracidad; es
  un problema de etiqueta, y pesa porque la frase "con exclusión de toda otra empresa o persona" es
  la que sostiene todo el `monopolio`. La página de IMPO para esa ley no publica el articulado.
- cita_de_contexto: "Promulgación: 21/10/1912 Publicación: 29/10/1912 **Resumen:** Créase como
  dependencia del Poder Ejecutivo la Administración General de las 'Usinas Eléctricas del Estado'…"
  (https://www.impo.com.uy/bases/leyes/4273-1912)
- accion_sugerida: `titulo: "Ley N° 4273 — resumen de IMPO (la página no publica el articulado)"`.

### 19. `finanzas[].deuda_financiera` — separado excluye los fideicomisos, y no se dice
- severidad: corregir
- tipo: contexto_omitido
- objecion: la ficha usa los estados separados, que es la elección correcta y la misma que ANCAP.
  Pero en UTE la brecha con el consolidado es grande porque las líneas de trasmisión están
  financiadas por fideicomisos (PAMPA, ARIAS, Línea Cierre del Anillo) y por ISUR y AREAFLIN: en
  2022 el separado da $ 41.462,7 millones y el consolidado $ 54.102,1 millones (corriente
  $ 2.823.487.447 + no corriente $ 51.278.660.743). Un lector que compare con otra cifra publicada
  va a ver una diferencia de USD 315 millones sin explicación. ANCAP resolvió el mismo problema con
  una nota en `concepto`.
- accion_sugerida: agregar a `concepto` (una frase): "Estados separados; el consolidado incluye
  fideicomisos y sociedades vinculadas y da una cifra mayor".

### 20. `concepto` y `nota` con párrafos donde la página imprime una celda
- severidad: corregir
- tipo: presentacion
- objecion: `finanzas[2019].resultado_ejercicio.concepto` tiene cuatro renglones;
  `finanzas[2020].impuestos_pagados.concepto` tiene seis y además argumenta contra ANCAP;
  `finanzas[2020].transferencias_al_estado.concepto` explica un ajuste de $ 260.191.240 en tres
  renglones. Todos van al pie de una celda.
- accion_sugerida: una frase por `concepto`. Lo que no entre, a `nota` del año (también una frase) o
  al `resumen`.

### 21. `fuentes` repetidas: seis documentos citados treinta y una veces
- severidad: corregir
- tipo: presentacion
- objecion: la ficha tiene 31 objetos `Fuente` que apuntan a seis PDFs. Cada cifra repite la URL, el
  medio, la fecha y el `retrieved_at`, cambiando solo el `titulo` y la `cita`. La página va a listar
  el mismo balance decenas de veces al pie.
- accion_sugerida: es el mismo problema que el editor resolvió en ANCAP; mantener una fuente por
  cifra donde la `cita` cambia (que es lo que valida la red) pero unificar `titulo` por documento
  ("Estados Financieros de UTE al 31 de diciembre de 2021") y dejar la ubicación dentro del
  documento en la `cita`, no en el `titulo`, para que la página pueda agrupar por URL.

### 22. `capitalizaciones_del_estado` vacío — falta el Fondo de Estabilización Energética
- severidad: corregir
- tipo: contexto_omitido
- objecion: la conclusión "no hubo capitalizaciones" es defendible para la línea "Aportes a
  capitalizar", pero deja fuera el flujo que sí hubo entre UTE y el Estado por el FEE: UTE aportó
  $ 260.191.240 en 2020 y **usó $ 2.622.846.146 del Fondo en 2020**. Es exactamente el tipo de
  movimiento que la colección existe para mostrar (qué puso el Estado, qué se llevó).
- cita_de_contexto: "Uso del Fondo de Estabilización Energética 	2.622.846.146" y "Versión de
  resultados 	- 	- 	5.841.794.240 	6.258.501.640" (EEFF 2020, nota de partes relacionadas,
  carácter ~161.400); "se reconoció una disminución de los resultados acumulados por $ 260.191.240
  (equivalente a U$S 6.145.282) … por el monto a verter en concepto de aporte por el ejercicio 2020
  al Fondo de Estabilización Energética, aprobado por R21.-64 del Directorio del Ente".
- accion_sugerida: cargarlo en `capitalizaciones_del_estado` de 2020 con `concepto` de una frase, o
  si el editor entiende que no es una capitalización, dejarlo en `nota` del año. Lo que no
  corresponde es que no aparezca.

### 23. `precios_vs_paridad` omitido — sin objeción
- severidad: aviso
- tipo: sin_objecion
- objecion: no hay. Verifiqué el razonamiento de `notas.md` y es correcto: no existe un precio de
  paridad de importación de electricidad publicado por URSEA equivalente al PPI de combustibles. El
  campo es opcional y omitirlo es lo que corresponde; forzar una descripción sin serie sería peor
  (la regla de presentación castiga exactamente eso: `precios_vs_paridad` con `descripcion` y
  `series: []`).

### 24. Cobertura temporal: el balance 2025 ya está publicado
- severidad: aviso
- tipo: asimetria
- objecion: la página de estados financieros de UTE que el lote abrió lista "EEFF … 31/12/2025"
  (`.../Informe de auditoría 2025 - UTE_2.pdf`). El brief acotó a 2015-2024 y el investigador cumplió
  el brief, así que no es una falta del lote. Pero la ficha se publica en septiembre de 2026 con un
  ejercicio cerrado de menos. Si se extiende a 2025 hay que hacer lo mismo con ANCAP: el criterio de
  hasta qué año llega una ficha se aplica igual a todas.

### 25. `casos_vistos` y pistas cruzadas — sin objeción
- severidad: aviso
- tipo: sin_objecion
- objecion: no hay. El brief no pedía casos judiciales y el lote no los investigó. Anoto para el
  detective, no para esta ficha, que en el EEFF 2022 (Nota 14) consta que "existen situaciones
  litigiosas y procesos judiciales iniciados contra Gas Sayago, cuyos montos reclamados totalizan
  U$S 72.789.656 y $ 46.983.881"; no es un caso de una persona y no corresponde a `casos/`, pero es
  un pasivo contingente que el editor puede querer en `nota`.

---

## Objeciones al lote

1. **El lote se detuvo en la primera puerta cerrada.** El patrón se repite en los tres hallazgos
   grandes: se probó un PDF de 2019 que no era el de la página de estados financieros; se dio por
   escaneados cuatro años habiendo probado dos; se buscó "Total impuestos" (el nombre del renglón de
   ANCAP) y, al no encontrarlo, se concluyó que UTE no publica el total, sin buscar el nombre que
   UTE usa. Los tres se resuelven con las URLs que el propio lote ya tenía abiertas. Es el error más
   caro de esta corrida y no requiere fuentes nuevas para arreglarse.
2. **Cobertura del período: 5 años de 10 pedidos, cuando 9 son alcanzables.** Ver objeción 5.
3. **Dependencia de fuentes: el eje UTE-Augpee.** Los documentos financieros son todos de UTE, lo
   cual es correcto y es lo mismo que hace ANCAP. Pero el eje interpretativo depende de un único
   origen: Augpee y su consultora, presentes en tres de los cuatro argumentos y en la afirmación no
   respaldada de `alcance`. Ningún medio del lote es de un grupo repetido (El Observador es
   werthein-hochbaum; El Telégrafo y El Pueblo Digital son del interior y sin grupo determinado; pv
   magazine es extranjero especializado), así que el problema no es de propiedad de medios sino de
   procedencia del argumento.
4. **Simetría con la ficha hermana.** Comparada con ANCAP: ANCAP tiene 11 años de finanzas, un
   `impuestos_pagados` agregado, 7 argumentos con actores políticos de los dos lados y comparaciones
   que muestran subsidio y sobreprecio. UTE tendría 5 años (6 con 2019 mal convertido), un
   `impuestos_pagados` que es una fracción del real, 4 argumentos con 3 del mismo campo y solo
   comparaciones desfavorables. No hay indicio de intención —el `notas.md` es transparente sobre sus
   límites— pero el resultado publicado sería una ficha que trata peor a UTE que a ANCAP con el
   mismo esquema, y eso es Regla 0 aunque nadie lo haya pedido.
5. **Medios faltantes: `tipo` y `grupo` propuestos para el editor.**
   - `ute`: `tipo: estatal`, `grupo: estado-uruguayo`, `url: https://www.ute.com.uy/`,
     `empresa: ute`, y **`dominios: [https://portal.ute.com.uy]`** (el esquema tiene ese campo justo
     para esto; sin él, las 25 fuentes que apuntan a `portal.ute.com.uy` quedan sin medio).
     `alineamiento.etiqueta: estatal`. Es calcado de `content/medios/ancap.yaml`.
   - `augpee`: **no es un medio de prensa**, es la Asociación Uruguaya de Generadores Privados de
     Energía Eléctrica publicando un informe que encargó a Exante. `tipo: portal` es lo que más se
     acerca en el enum; `grupo: augpee`; `alineamiento.etiqueta: sin_datos` con justificación que
     diga qué es (asociación gremial de empresas generadoras privadas) y que el informe lo firma
     Exante. Verificado: el PDF está en `augpee.org.uy` y el informe se titula "Trasmisión y
     Distribución de Energía Eléctrica en Uruguay", con la firma "EXANTE" en el pie de cada página.
   - `eltelegrafo`: diario de Paysandú; la nota dice "indicó a EL TELEGRAFO". `tipo: diario`,
     `url: https://www.eltelegrafo.com`. **Aviso para quien lo cree**: en el corpus hay otra nota de
     `eltelegrafo.com` firmada "(La Diaria-Telemundo)", es decir que republica contenido de terceros.
     Si en el futuro se usa El Telégrafo como segunda fuente de un `reportado`, hay que verificar que
     la nota sea propia y no una reproducción, o el segundo grupo será ficticio. `grupo`: no
     determinado; que se investigue antes de asignarlo, y si no aparece, `grupo: eltelegrafo` con
     `alineamiento: sin_datos` y la justificación diciendo qué se buscó.
   - `elpueblodigital`: `tipo: portal` o `diario`; la nota está firmada por Karina de Mattos y
     fechada 2026-06-05. `grupo`: no determinado, mismo criterio.
   - `pv-magazine-latam`: publicación especializada internacional en energías renovables, edición
     latinoamericana, autor de la nota Luis Ini. `tipo: portal`, `url:
     https://www.pv-magazine-latam.com`. La nota lleva aviso de copyright propio ("Este contenido
     está protegido por derechos de autor"), lo que confirma que es un medio con redacción propia y
     no un agregador. `grupo: pv-magazine`.
   Ninguno de estos cinco lo puedo cerrar yo: la propiedad de El Telégrafo y de El Pueblo Digital
   necesita una fuente que no busqué. Van con `sin_datos` y la justificación diciendo qué falta.
6. **Verificación mecánica.** `pnpm validar --inbox` da 39 errores y todos desaparecen creando los
   cinco medios. No hay errores de esquema. `pnpm validar:red` no lo corrí: las citas que verifiqué
   a mano (las 12 más cargadas) están todas en sus documentos, con una salvedad de forma: varias
   citas de tablas dependen de tabulaciones (`Resultado del ejercicio \t17.262.272.412
   \t2.966.355.483`), así que si la validación de red normaliza espacios hay que revisarlas.

---

## Objeciones al brief

1. **El brief fija `tipo` (empresa_publica) y el documento dice otra cosa.** El encargo dice
   literalmente `tipo` (empresa_publica). Los estados financieros auditados de UTE dicen "ente
   autónomo", y la ficha ya publicada de ANCAP —mismo estatus jurídico— usa `ente_autonomo`. No es
   una violación de Regla 0 (no favorece a nadie), pero es una instrucción que contradice la fuente
   primaria y que produce una inconsistencia visible entre dos fichas del mismo sitio. Se corrige
   poniendo `ente_autonomo` y, si el mantenedor quiere, revisando el criterio para toda la
   colección: la regla debería ser "lo que dice el estatuto en el balance", igual para todas.
2. **El brief pide 2015-2024 y la ficha se publica en septiembre de 2026.** El ejercicio 2025 ya
   está publicado por UTE. No es asimetría de partido, pero sí un criterio que hay que fijar de una
   vez y aplicar igual a todas las empresas: hasta qué ejercicio llega una ficha.
3. **Regla 0: no encuentro pedido de asimetría en el brief.** Lo digo explícitamente porque la
   ausencia de crítica también se audita. El brief pide argumentos de los dos lados con el mismo
   esfuerzo, dice que el esquema no valida un solo lado, prohíbe adjetivos y verbos de intención en
   las cifras, y prohíbe comparaciones calculadas por el sitio. Es simétrico. La asimetría del
   resultado (objeción 11 y punto 4 del lote) es de ejecución, no de encargo, y el propio `notas.md`
   la señala antes que yo, que es lo que corresponde.
4. **Un punto donde el brief podría inducir el error de la objeción 1.** El brief dice que
   `impuestos_pagados` es "el total de impuestos del año" y remite a ANCAP; el investigador buscó el
   renglón con el nombre que tiene en ANCAP ("Total impuestos") y, al no hallarlo, cargó otra cosa
   antes que dejar el campo vacío. Sugerencia para futuros briefs de esta colección: "si el balance
   no trae un total agregado con ese nombre, buscá el anexo de tributos que las empresas públicas
   están obligadas a publicar (en UTE es el 'Literal E'); si tampoco existe, dejá el campo vacío
   antes que cargar un impuesto suelto bajo la etiqueta de total".

---

## Discrepancias

Escribí una, en `discrepancias.yaml` de esta misma carpeta y en la carpeta del lote. Es menor y lo
digo con todas las letras, para que el editor pueda decidir que está por debajo del umbral: La
República publica el resultado 2016 de UTE como "casi 12 millones de pesos" cuando el estado
financiero separado auditado dice $ 12.189.879.271, y el equivalente en dólares que la propia nota
da (410 millones) es consistente con miles de millones, no con millones.

Apliqué el mismo test a las otras notas del lote y no encontré nada registrable, y lo detallo para
que se vea que el umbral fue el mismo:
- **El Observador** (Stipanicic): todo lo publicado son citas textuales de una columna; no hay un
  dato del medio que un documento primario contradiga. La afirmación fáctica del medio —que el
  Directorio revirtió la renovación tras una observación del Tribunal de Cuentas— no la pude cotejar
  contra la resolución del Tribunal, que no busqué; si se la quiere cotejar, es un
  `documento_previsible` (`tcr.gub.uy`).
- **El Telégrafo** (Fraschini/Exante): las citas del informe que reproduce coinciden con el informe.
  Pero el informe de Exante **no es fuente primaria** en el sentido de esta colección (no es
  documento oficial, ni diario de sesiones, ni video), así que aunque hubiera discrepancia no sería
  registrable acá. Va a la crítica, no a `discrepancias/`.
- **pv magazine**: las cifras que atribuye a SEG Ingeniería no las pude cotejar contra el informe de
  SEG, que no abrí. Sin el original no hay discrepancia, hay desacuerdo posible.
- **La noticia de UTE de 2019**: dice USD 179,3 millones donde el balance da USD 169,4 millones al
  cierre, pero el comunicado **declara su método** ("dólares promedio ($ 35,255)"), así que no hay
  distancia entre lo publicado y el documento. No se registra.

---

## Cobertura

Emití los registros en `cobertura.yaml` (misma carpeta). Los reproduzco acá porque el formato de mi
rol lo pide, y aclaro un problema de esquema: `crearCoberturaSchema` exige `politico` o `partido`
afectado y un `evento` de `content/eventos/`. En un lote de empresa, tres de las cinco notas leídas
no tienen político ni partido afectado, así que **no se pueden emitir como registros de cobertura**.
Las dejo listadas con su tono observado para que el criterio quede auditado, pero no como registros.

```yaml
# emitibles
- medio: el-observador
  url: https://www.elobservador.com.uy/economia-y-empresas/stipanicic-el-monopolio-la-compra-generacion-electrica-ute-es-absurdo-y-hay-que-combatirlo-n6008574
  titulo: 'Stipanicic: "El monopolio de la compra de generación eléctrica de UTE es absurdo y hay que combatirlo"'
  fecha: 2025-07-15
  evento: "propuesto: no-renovacion-contrato-fenirol-ute-2025"
  partido: Frente Amplio
  tono: neutral
  justificacion: >-
    La nota atribuye la crítica sin hacerla propia ("Esta semana el ex presidente de Ancap,
    Alejandro Stipanicic, criticó la decisión adoptada por los representantes del Frente Amplio en
    el Directorio de UTE") y publica la razón que dio el Directorio ("dando lugar a una observación
    efectuada por el Tribunal de Cuentas 'por falta de disponibilidad presupuestal'"), aunque no
    incluye respuesta del Frente Amplio ni de UTE.

# no emitibles (sin político ni partido afectado; el esquema los rechaza)
- medio: eltelegrafo
  url: https://www.eltelegrafo.com/2024/10/generadores-privados-consideran-abusivo-el-precio-que-cobra-ute-por-redes-de-transmision/
  fecha: 2024-10-22
  afectado: UTE (empresa), no un político ni un partido
  tono_observado: desfavorable hacia UTE
  justificacion: >-
    El medio adopta el marco del entrevistado en su propia voz al describir la posición del sector
    ("Los generadores privados de energía eléctrica cuestionan que el Poder Ejecutivo establece
    'condiciones desiguales de competencia'") y no publica respuesta de UTE ni de URSEA.
- medio: elpueblodigital
  url: https://elpueblodigital.uy/roberto-bentancor-ute-tiene-que-seguir-siendo-una-empresa-del-estado-al-servicio-de-la-gente/
  fecha: 2026-06-05
  afectado: Roberto Bentancor (vicepresidente de UTE); no está en content/politicos/
  tono_observado: favorable hacia el entrevistado
  justificacion: >-
    El cierre es del medio, no del entrevistado: "Su historia resume, en buena medida, la de muchos
    trabajadores uruguayos que encontraron en las empresas públicas no solo una fuente laboral, sino
    también una identidad colectiva y una herramienta de transformación social."
- medio: pv-magazine-latam
  url: https://www.pv-magazine-latam.com/2025/09/23/precios-de-la-electricidad-en-el-cono-sur-chile-y-uruguay-la-industrial-y-la-residencial-mas-cara-paraguay-la-mas-barata-en-ambas/
  fecha: 2025-09-23
  afectado: ninguno
  tono_observado: neutral
  justificacion: >-
    Expone las cifras y sus posibles causas sin atribuir responsabilidad ("Uruguay aplica una
    estructura tarifaria que integra costos de generación diversificada y componentes fiscales que
    impactan en el precio final") y declara la metodología de la consultora.
- medio: la-republica
  url: https://www.lr21.com.uy/economia/1363647-ute-ganancias-balance-rentas-generales
  fecha: 2018-03-29
  afectado: ninguno nombrado
  tono_observado: neutral
  justificacion: >-
    Reproduce el informe de una consultora sin valoración propia ("La consultora Stavros Moyal &
    Asociados dio a conocer el balance de UTE correspondiente al año 2017"). Ver `discrepancias.yaml`
    por el dato de 2016.
```

---

## Conteo

- bloquea: 7 (objeciones 1, 2, 4, 5, 6, 7 y 8)
- corregir: 15 (objeciones 3, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22)
- aviso: 3 (objeciones 23, 24, 25)
- registros de cobertura emitidos: 1 (más 4 no emitibles documentados)
- discrepancias registradas: 1
