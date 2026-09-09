## candidatos_giro

No aplica: esta corrida es sobre `empresas.yaml` (BROU), no hay declaraciones ni giros de político involucrados.

## hipotesis

- El código de institución de BROU en el nomenclador del BCU (`0001`) se infirió comparando el
  Estado de Resultados del PDF `balaudi_200112_0001.pdf` contra la escala del banco (activo total
  70.714,8 millones de pesos en 2001) y contra el hecho de que sea, junto con el código `0110`
  (Banco Central del Uruguay), el archivo de mayor tamaño de cada año en el listado CDX. No hay una
  tabla pública de nomencladores que lo confirme por nombre; queda como inferencia razonable, no
  como dato citado de un documento que diga "BROU = 0001". **Vuelta 2 (A2 de la crítica):** la
  hipótesis ya tiene dos corroboraciones adicionales, que se dejan anotadas y no como dato citado:
  el resultado de `balaudi_200612_0001.pdf` (2.187.573) es idéntico al que publica BROU con su
  propio nombre en la Memoria 2006 (`Estados_Contables.pdf`, carpeta 33214), y el resultado de 2001
  (87.168) reaparece como saldo inicial del ejercicio 2002 en el mismo código.
- No se pudo confirmar por qué el BCU (Wayback) no tiene capturas del balance de BROU código `0001`
  entre 2007 y 2012 bajo `Servicios-Financieros-SSF/Estados Contables Auditados/`, mientras que sí
  tiene, en esa misma carpeta y años, las de BHU (código `0091`). La hipótesis más simple es que el
  crawler de Wayback solo indexó los enlaces que estaban en una página que en ese momento enlazaba
  a BHU y no (todavía) a BROU, o que BROU publicó su balance auditado en otra ruta del sitio del BCU
  que no fue rastreada. **Vuelta 2 (A1 de la crítica):** confirmado por el crítico que
  `balaudi_<2007..2011>12_0001.pdf` no existe ni vivo ni en Wayback; la vía correcta para 2007-2014
  era el sitio de BROU, no el del BCU (ver B1 abajo). No se investigó más a fondo por qué el crawler
  de Wayback no indexó esos años para BROU.

## casos_vistos

Ninguno.

## verificacion_manual

Ninguna. Todos los documentos citados se leyeron con `pnpm fuente` en esta sesión, incluidos los
Estados Contables de 2006 a 2014 (33188 a 33214) y las Notas a los Estados Contables
correspondientes.

## cobertura_del_periodo

| Año | Documento | Fuente | Campos cargados |
|---|---|---|---|
| 2001 | Estados Contables del BROU al 31/12/2001 | BCU (`balaudi_200112_0001.pdf`, vía Wayback) | resultado, impuestos (suma de Nota 6), capitalizaciones (cero) |
| 2002 | Estados Contables del BROU al 31/12/2002 | BCU (`balaudi_200212_0001.pdf`, vía Wayback) | resultado, capitalizaciones (cero); impuestos ausente (Nota 6 sin desglose ese año) |
| 2003 | Estados Contables del BROU al 31/12/2003 | BCU (`balaudi_200312_0001.pdf`, vía Wayback) | resultado, impuestos (Nota 6, total explícito), capitalizaciones (cero) |
| 2004 | Estados Contables del BROU al 31/12/2004 | BCU (`balaudi_200412_0001.pdf`, vía Wayback) | resultado, impuestos (Nota 6, total explícito), capitalizaciones (cero) |
| 2005 | Estados Contables del BROU al 31/12/2005 | BCU (`balaudi_200512_0001.pdf`, vía Wayback) | resultado, impuestos (Nota 6, total explícito), capitalizaciones (cero) |
| 2006 | Estados Contables del BROU al 31/12/2006 | BCU (`balaudi_200612_0001.pdf`, vía Wayback, 16/83 páginas por OCR), confirmado por el documento nativo sin OCR de brou.com.uy (carpeta 33214) | resultado (dos fuentes), impuestos (Nota 6, total explícito), capitalizaciones (cero) |
| 2007 | **Vuelta 2:** Estados Contables auditados de BROU (Deloitte, carpeta 33211), propio sitio | brou.com.uy (documento propio, vivo) | resultado, impuestos (dos componentes); sin capitalizaciones ni transferencias (el documento resumido no trae Estado de Evolución del Patrimonio ni C.6.4) |
| 2008 | **Vuelta 2:** Estados Contables auditados de BROU (carpeta 33208) + Notas a los Estados Contables | brou.com.uy (documento propio, vivo) | resultado, impuestos (dos componentes), **transferencias** (Nota C.6.4: $1.324,3 M + US$30 M) |
| 2009 | **Vuelta 2:** Estados Contables auditados de BROU (carpeta 33205, Tribunal de Cuentas + Deloitte) + Notas | brou.com.uy (documento propio, vivo) | resultado, impuestos (dos componentes), **transferencias** (Nota C.6.4: $3.506,8 M) |
| 2010 | **Vuelta 2:** Estados Contables auditados de BROU (carpeta 33200) + Notas | brou.com.uy (documento propio, vivo) | resultado, impuestos (dos componentes); transferencias ausente (Nota C.6.4 solo describe la cancelación parcial del saldo de 2009) |
| 2011 | **Vuelta 2:** Estados Contables auditados de BROU (carpeta 33197, un solo PDF con estados y notas) | brou.com.uy (documento propio, vivo) | resultado, impuestos (dos componentes), **transferencias** (Nota C.6.4: US$120 M) |
| 2012 | **Vuelta 2:** Estados Contables auditados de BROU (carpeta 33194) + Notas | brou.com.uy (documento propio, vivo) | resultado, impuestos (dos componentes), **transferencias** (Nota C.6.4: $2.021,3 M) |
| 2013 | **Vuelta 2:** Estados Contables auditados de BROU (carpeta 33191) + Notas | brou.com.uy (documento propio, vivo) | resultado, impuestos (dos componentes), **transferencias** (Nota C.6.4: $1.740,0 M) |
| 2014 | **Vuelta 2:** Estados Contables auditados de BROU (carpeta 33188) + Notas | brou.com.uy (documento propio, vivo); cotización tomada del informe de indicadores (el documento auditado no trae la nota) | resultado, impuestos (dos componentes); transferencias ausente (sin nota en 2014 ni en las Notas de 2015) |
| 2015-2024 | (ya publicado, corrida 2026-09-07) | brou.com.uy / BCU | sin cambios en esta corrida |
| 1896-2000 | No encontrado | Se probó el sitio de BROU, Wayback (CDX completo de brou.com.uy y de bcu.gub.uy), el buscador de Registros de la SSF del BCU, el catálogo de la Biblioteca del Parlamento (`pmb.parlamento.gub.uy`, solo historias institucionales del banco) y una búsqueda por texto sobre el Diario Oficial / artículo 191 de la Constitución | Ningún documento contable de BROU anterior a 2001 apareció en ninguna de las cinco vías. |

Segmentos de negocio: ausentes en 2001-2014 (empiezan recién en 2017, ya documentado en la ficha
publicada). Ningún balance de 2001-2006 trae nota de "segmentos" ni "desagregado por división"; los
Estados Contables auditados de BROU 2007-2014 tampoco.

Transferencias al Estado (**vuelta 2**, reemplaza el párrafo anterior de esta sección, que la crítica
marcó como falso en B2): se encontraron y cargaron, con criterio de caja, las notas C.6.4 de 2008
($1.324,3 M + US$30 M), 2009 ($3.506,8 M), 2011 (US$120 M), 2012 ($2.021,3 M) y 2013 ($1.740,0 M).
En 2001 y 2002 la Nota 3.21.5 de los balances de 2004-2006 documenta la cancelación parcial de un
adelanto pagado en 2000 (crédito contra el Gobierno Central, no una transferencia nueva de caja de
esos dos años): se dejó como `nota` explicando el hecho, no como "no se encontró documento". En 2003
a 2007, 2010 y 2014 se buscó la nota C.6.x o equivalente en los mismos Estados Contables y Notas a
los Estados Contables y no apareció (en 2010 hay una nota C.6.4, pero describe solo la cancelación
parcial del saldo de 2009, no una transferencia nueva); campo ausente esos años, con la búsqueda
documentada en `consultas.jsonl`.

## objeciones_al_brief

Ninguna. El brief pide un criterio parejo (extender la serie con el mismo documento y la misma
convención que ya se usó para BHU, ANCAP, UTE y ANTEL) y así se hizo. Un hallazgo del propio
documento reveló una asimetría real entre BROU y BHU frente a la crisis de 2002 (BHU recibió aporte
de capital del Estado; BROU recibió un préstamo del Fondo de Estabilidad, no una capitalización): se
registró tal cual consta en la fuente primaria de cada banco, sin ajustar el relato para que
parecieran iguales. **Vuelta 2:** por C3 de la crítica, la comparación explícita con el BHU se sacó
del `resumen` y del `concepto` de 2002 (quedaba armada por la ficha juntando dos documentos, y con la
ley de capitalización del BHU mal citada); lo que queda es el hecho de BROU solo, con su propia
fuente. La asimetría de fondo (present ahora en las dos fichas por separado, con el mismo rigor
donde hay documento) sigue siendo cierta y verificable comparando ambas fichas.

## dato_notable: SWIFT_BALANCE_2008.pdf

El archivo `https://www.brou.com.uy/documents/20182/31784/SWIFT_BALANCE_2008.pdf`, listado en el
inventario del sitio de BROU, no es un balance del banco: es el reporte financiero anual 2008 de
S.W.I.F.T. SCRL (la cooperativa belga de mensajería interbancaria de la que BROU es accionista/socio
usuario), en inglés. Se abrió con `pnpm fuente` y se descartó como fuente de datos de BROU. Queda
anotado para que una corrida futura no repita la misma confusión por el nombre del archivo.

## vuelta 2

Segunda vuelta del investigador (Sonnet), sobre `data/corridas/2026-09-09-brou-serie-historica/critica.md`
(Opus: 2 `bloquea`, 10 `corregir`, 8 `aviso`). Tabla objeción → qué se hizo:

| # | Acción tomada |
|---|---|
| B1 | Recargados 2007-2014 desde los Estados Contables auditados que BROU publica en su propio sitio (carpetas 33188-33211, confirmadas una por una abriendo cada documento), con el "informe de indicadores" como fuente secundaria de `resultado_ejercicio`. Se borraron del `resumen`, del `concepto` y de esta nota todas las frases que decían "no se encontró documento propio" de 2007 y 2008. |
| B2 | Cargadas las transferencias de 2008, 2009, 2011, 2012 y 2013 (Nota C.6.4, criterio de caja, ver tabla de cobertura). Para 2001-2002 se agregó un `nota` explicando la cancelación del adelanto de 2000 (Nota 3.21.5) en vez de declarar "no se encontró documento". Reescrito el párrafo de `notas.md` y del `resumen`. |
| C1 | `finanzas[2008].impuestos_pagados` recargado a $1.388,6 M (471,7 + 916,9) desde el auditado. Aplicado el mismo criterio (auditado en vez de informe de indicadores) a 2007, 2009, 2010, 2011, 2012, 2013 y 2014; en 2011 y 2012 el auditado da una cifra unos $10 M más baja que el informe de indicadores por la misma reclasificación que ya explicaba C1 para 2008, declarado en el `resumen`. |
| C2 | Hito del 24/12/2010: la `cita` del artículo 11 (50 %) y del artículo 40 (30 %, texto original de 2010) reemplaza a la del artículo 39 (derogaciones), que se mantiene como tercera fuente porque el `detalle` también menciona la derogación de la Ley 9.808. |
| C3 | Sacada del `resumen` y del `concepto` de 2002 la comparación con el BHU (armada por la ficha, con la ley de capitalización mal citada); queda solo el hecho de BROU (capitalizaciones en cero, préstamo del FESB) con su propia fuente. |
| C4 | Hito nuevo (5/8/2002-12/2004): BROU usa el Fondo de Estabilidad del Sistema Bancario, con la Nota 3.21.4 del balance de 2004 como fuente. `nota` de una oración agregada a 2002, 2003 y 2004 remitiendo al hito. |
| C5 | Agregado un párrafo al `resumen` con los años donde hay ajuste por inflación (2003 sí; 2007-2008 no; 2009-2010 sí, con la cifra del balance auditado de 2009 y del informe de indicadores de 2010; 2011-2013 no; desde enero de 2014 sí, con la Comunicación 94/156 y la cifra de la propia Nota C.6.1 del balance de 2014). `nota` de una oración agregada a 2009 y 2014. |
| C6 | `concepto` de `capitalizaciones_del_estado` de 2002 reducido a una oración sin la comparación con el BHU. `concepto` de `resultado_ejercicio` de 2008 reescrito sin el párrafo de SWIFT (que ya recargó el campo entero por B1/C1). |
| C7 | Los seis `concepto` de `capitalizaciones_del_estado` 2001-2006 unificados en una sola redacción sin el año. |
| C8 | Las tablas de 28 renglones del informe de indicadores, citadas seis veces, se reemplazaron por citas del documento auditado propio (B1); donde se mantiene el informe de indicadores como segunda fuente, la cita es de una sola línea ("Resultado del Ejercicio X Y Z"), como ya hacían 2015 y 2016. |
| C9 | Agregada la búsqueda en el catálogo de la Biblioteca del Parlamento y una búsqueda por texto sobre el Diario Oficial / artículo 191 de la Constitución; ninguna encontró un balance de BROU anterior a 2001. Reescrita la frase de `notas.md` y del `resumen` para listar las cinco vías probadas. |
| C10 | Agregada una segunda fuente para `resultado_ejercicio` de 2006: el documento nativo (sin OCR) que BROU publica en su propio sitio (carpeta 33214), con la misma cifra (2.187.573) que el balance escaneado del BCU. |
| A1 | Sin acción sobre el registro (correcto tal como estaba); ver B1 para la vía real. |
| A2 | Agregadas las dos corroboraciones a la hipótesis en `notas.md` (ver arriba), sin convertirla en dato citado. |
| A3 | Agregada una cláusula al `resumen` sobre el cambio de redacción de la nota de tipo de cambio (interbancario 2001-2002, financiero 2003-2006). |
| A4 | Agregada una cláusula al `resumen` sobre la conversión de la pérdida de 2002 al dólar de cierre, ya devaluado 84 % en el año. |
| A5 | Agregada una cláusula al `resumen` sobre por qué `deuda_financiera` queda vacío en los 24 años (el pasivo de un banco son depósitos, no préstamos financieros). |
| A6 | Sin acción: el crítico mismo concluye que la regla, si se aplica, tiene que aplicarse a las ocho fichas a la vez, no solo a BROU. Queda para una corrida transversal. |
| A7 | Agregada una cláusula al `resumen` sobre la vigencia del artículo 40 (Ley 20.075 de 2022, antes Ley 19.889 de 2020, originalmente Ley 18.716 de 2010). |
| A8 | El mapa carpeta → año se confirmó abriendo cada documento en esta sesión (33217=2005, 33214=2006, 33211=2007, 33208=2008, 33205=2009, 33200=2010, 33197=2011, 33194=2012, 33191=2013, 33188=2014, 33185=2015), no se dio por bueno sin abrir. |

**Errores propios detectados y corregidos durante esta vuelta** (no señalados por la crítica): al
copiar a mano la Nota C.6.4 de 2009 (PDF a dos columnas, `pnpm fuente` entrelaza el texto) se
reconstruyó mal la primera línea, salteando el fragmento "El 30 de junio de 2004 se constituye el"
de la columna vecina; `pnpm validar --red` lo marcó como cita aproximada (similitud 0,96) y se
corrigió tomando la subcadena exacta del texto que devuelve la herramienta, sin editarla. Lo mismo
pasó con la cita de tipo de cambio de 2010 (se había saltado "los créditos y obligaciones" de la
columna vecina). Las dos quedan ahora como subcadenas literales verificadas por script contra el
texto del corpus.

**Validación de red**: `pnpm validar --red` corrió seis veces sobre este lote. La etapa `citas`
(cotejo del texto contra el corpus) pasó limpia en todas las corridas donde llegó a ejecutarse. La
etapa `fuentes` (HTTP + Wayback) fue inestable corrida a corrida, con entre 0 y 19 errores que
cambiaban de URL entre una corrida y la siguiente (nunca la misma URL dos veces seguidas), todos
"HTTP 0, fetch failed" contra `web.archive.org` o `www.bcu.gub.uy`; probadas a mano con `curl` fuera
del validador, las mismas URLs devolvieron 200 unos segundos después. Es la misma clase de
flakiness de red que ya quedó documentada en `revision.notas_internas` de esta ficha para el sitio
de Diputados en la corrida anterior, no un problema de contenido: ninguna corrida mostró una cita
que no coincidiera con el documento una vez corregidas las dos de arriba.
