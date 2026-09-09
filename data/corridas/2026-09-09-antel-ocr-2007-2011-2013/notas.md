## candidatos_giro

N/A (corrida de empresas, no de declaraciones de un político).

## hipotesis

N/A.

## casos_vistos

Ninguno.

## verificacion_manual

Ninguna URL de esta corrida quedó sin poder leerse: los tres balances propios de ANTEL (2007, 2011,
2013) se leyeron completos con `pnpm fuente` (2007 no necesitó `--forzar`, entró directo a OCR
porque no tenía capa de texto; 2011 y 2013 igual).

## cobertura_del_periodo

| Año | Documento | Qué cambió | Qué lo confirma |
|---|---|---|---|
| 2007 | Estados Contables de ANTEL al 31/12/2007 (39 páginas, OCR 89.680 caracteres) | `resultado_ejercicio` 2290,9 → 2152,5 M; `deuda_financiera` 511,4 (sin dólares) → 480,5 M / 22,3 M USD; `transferencias_al_estado` 2212,6 → 2078,9 M; `impuestos_pagados` ausente → 4064,9 M (campo nuevo); `segmentos[]` Telefonía 9034,3→8488,5, Datos 1896,9→1782,3, Móvil 4950,4→4651,4. Se agrega `cotizacion: 21.5` a los cuatro Montos. | Arithmetic interna del propio balance de 2007: (a) el Estado de Situación Patrimonial cuadra fila por fila (Pasivo Corriente = suma de sus tres líneas; Pasivo No Corriente = suma de sus dos líneas; Total Pasivo = suma de ambos; Total Activo = Total Pasivo + Patrimonio); (b) el Estado de Origen y Aplicación de Fondos reconcilia exactamente el saldo inicial y final de caja (361.631 + 309.310 = 670.941, que coincide con "Disponibilidades" del balance en ambos años) y de ahí sale la cifra de "Contribución a Rentas Generales" (2.078.913); (c) la Nota 3 (moneda extranjera) da un tipo de cambio implícito de 21,50 (512.477/23.836,124), idéntico al que UTE declara para la misma fecha de cierre (31/12/2007); (d) el total de ingresos del segmento (14.922.258) coincide exactamente con "Ingresos operativos" del Estado de Resultados. Antes, las cuatro cifras venían de una cita mal alineada de la columna comparativa 2007 del balance de 2008, reexpresada a moneda de cierre de 2008 (≈6,4% más alta) por un mecanismo de reexpresión por inflación que ANTEL discontinuó después de esa fecha. |
| 2011 | Estados Contables de ANTEL al 31/12/2011, Sección II individual (100 páginas, OCR 232.572 caracteres) | `resultado_ejercicio` sin cambio (3096,1 M, ahora confirmado desde el documento propio); `deuda_financiera` sin cambio en pesos (202,5 M), se corrige el dólar (9,5→10,2 M) y se agrega `cotizacion: 19.9`; `transferencias_al_estado` sin cambio (1929,2 M, confirmado); `impuestos_pagados` ausente → 3792,5 M (campo nuevo); `segmentos[]` sin cambio (no releído del documento propio, ver más abajo). | La Nota 5 (Posición en moneda extranjera) del bloque individual da "Deudas financieras 10.174.768 [US$] 202.508 [$ miles]", de donde sale el dólar corregido y la cotización implícita (202.508/10.174.768 = 19,906); el Estado de Resultados individual muestra "Resultado neto del ejercicio 3.096.102" para 2011, idéntico al ya publicado; la nota "Transferencias a Rentas Generales" da "$ 1.929.185 miles", también idéntico. |
| 2013 | Estados Contables de ANTEL al 31/12/2013, Sección II individual (97 páginas, OCR 229.861 caracteres) | `resultado_ejercicio`, `deuda_financiera` y `transferencias_al_estado` sin cambio de valor (confirmados desde el documento propio); se agrega `cotizacion: 21.42` a `deuda_financiera` (antes solo descrita en prosa); `impuestos_pagados` ausente → 3506,4 M (campo nuevo); `segmentos[]` sin cambio (no releído del documento propio). | El Estado de Cambios en el Patrimonio individual da "Resultado neto del ejercicio 3.759.092" para 2013, idéntico al publicado; la Nota 5 da "Deudas financieras 8.324.465 [US$] 178.343 [$ miles]", idéntico al publicado (178,3 M); la nota "Transferencias a Rentas Generales" da "$ 1.867.704 miles", idéntico. |

Los demás 25 años de la ficha (1997-2006, 2008-2010, 2012, 2014-2024) no se tocaron en esta
corrida.

## objeciones_al_brief

Ninguna. El brief pide el mismo criterio de OCR para tres años de ANTEL, sin distinción de gobierno;
se aplicó igual criterio a los tres.

## notas_metodologicas

- **2007 es el único de los tres años con reexpresión por inflación.** ANTEL, como UTE, reexpresaba
  los balances por inflación hasta el cierre de esa era contable; el balance de 2008 muestra 2007 en
  moneda de cierre de 2008. Los balances de 2011 y 2013 ya no reexpresan (NIIF/IFRS sin ajuste por
  inflación), por lo que sus columnas comparativas coinciden exactamente con el balance propio: para
  esos dos años, el valor no cambió, solo mejoró la fuente (documento propio en vez de comparativa) y
  se completaron campos ausentes (`impuestos_pagados`, `cotizacion`).
- **`segmentos[]` de 2011 y 2013 no se releyeron del documento propio en esta corrida** por límite de
  tiempo: se dejaron sin cambio porque el total de ingresos operativos individuales del balance propio
  coincide exactamente, en ambos años, con el total que ya trae la ficha en `segmentos[]` (17.793.247
  para 2011; 20.043.988 para 2013, vía Nota 27.b del balance de 2014), lo que confirma indirectamente
  que la fuente ya usada (columna comparativa) era la correcta. Si se quisiera una cita textual desde
  el documento propio de cada año para `segmentos[]`, falta releerla.
- **`impuestos_pagados` es un campo nuevo en los tres años**, no localizado antes porque ninguno de
  los tres balances propios se había leído por OCR: la ficha decía "no se localizó desagregación de
  impuestos pagados" para 2007 y 2011, y no tenía el campo para 2013. La nota "c) Impuestos pagos en
  calidad de contribuyente y de agente de retención" existe en los tres balances y se sumó (IVA, IRIC
  o IRAE según la época, Impuesto al Patrimonio, más las retenciones) siguiendo el mismo criterio que
  usa la ficha para UTE y ANP.
- Regla 0: se aplicó el mismo umbral de OCR y de aritmetic-check a los tres años de este lote (2007,
  bajo Vázquez I; 2011 y 2013, bajo Mujica), que se aplicaría a cualquier otro año de cualquier otro
  gobierno.

## vuelta 2

Corrida `2026-09-09-ocr-huecos-ute-antel-anp`, crítica en
`data/corridas/2026-09-09-ocr-huecos-ute-antel-anp/critica.md`. Tabla objeción → acción sobre
`finanzas[2007]`, `finanzas[2011]` y `finanzas[2013]` de ANTEL.

| Objeción (severidad) | Acción tomada |
|---|---|
| `transferencias_al_estado.usd` 2007: 84,5 → 96,7 rompe la convención de dólar «al tipo de cambio del momento del pago» que el `resumen` declara para 2003-2007 y borra el documento que publica 84,5 (**bloquea**) | Revertido a `usd: 84.5`. Se restituyó la fuente «Datos Financieros y Operativos Relevantes de ANTEL, 2004-2008» (cita: «Contribuciones a rentas generales (1) 89,6 84,5 93,7 114,5 91,5»). El peso sigue cargado desde el balance propio en moneda de cierre de 2007 (2.078,9 M). No se declaró `cotizacion` en este campo (el original publicado tampoco la tenía): el dólar no sale de dividir el peso por una cotización de cierre, sino del tipo de cambio del momento de cada pago, así que forzar una `cotizacion` habría sido inventar una tasa que el criterio del `resumen` explícitamente rechaza. |
| `finanzas[2007]`: se eliminaron las fuentes de corroboración («Datos Financieros y Operativos Relevantes») de `resultado_ejercicio` y `transferencias_al_estado` (**corregir**) | Restituidas como segunda y tercera fuente de `resultado_ejercicio` (con la cita «Resultado neto del ejercicio 80,5 100,1 89,7 100,8 72,0», que ×21,5 da 2.152,5) y como segunda fuente de `transferencias_al_estado`. Se agregó además una cuarta fuente para `resultado_ejercicio`: el propio balance de UTE 2007 («interbancario comprador $ 21,50... al 31/12/07»), que es el segundo documento del mismo cierre que confirma el tipo de cambio (la crítica citó mal esta fuente, con la cifra de otro año; se usó la cita real, verificada en esta sesión). |
| `concepto` de `deuda_financiera` y `transferencias_al_estado` 2007 dice «cita mal alineada», que es falso: eran la misma partida reexpresada (**corregir**) | Reescritos los dos `concepto`: ahora dicen que la cifra anterior era la misma partida reexpresada a moneda de cierre de 2008 en el balance siguiente (coeficiente 1,0643), no un error de lectura. Se agregó la cita del Estado de Situación Patrimonial («Comerciales 12 949.089... Financieras 13 93.926 179.436... Financieras 13 386.568 630.922...») como fuente de `deuda_financiera`, porque el `concepto` menciona esos dos montos y antes ninguna cita los traía. |
| `impuestos_pagados` 2007: IRIC+IP (37 % del total) son provisiones, no pagos; el documento no imprime `Total` (**corregir**) | `concepto` reescrito: dice que la suma es del sitio (no hay línea Total impresa) y que IRIC ($ 1.188.038) e IP ($ 307.815) van por provisión según la propia nota c). Ver más abajo la decisión final sobre este campo. |
| `nota` de 2007 no dice en qué moneda están las cifras (**corregir**) | El `nota` de nivel de año ahora dice «en moneda de cierre del 31/12/2007 (el balance está reexpresado por inflación)» y agrega el monto nominal, $ 1.975.257 miles, contra los $ 2.078.913 miles en moneda de cierre. |
| `resultado_ejercicio` 2011: cita ilegible, 25 números sin etiquetas (**corregir**) | Reemplazada por una cita limpia y con etiquetas del Estado de Situación Patrimonial individual («Resultados acumulados 19.749.344 18.333.584 Resultado neto del ejercicio 3.096.102 3.994.836 Total Patrimonio 35.086.237 33.917.488»), ubicada en esta sesión (carácter 121200 del balance propio de 2011). Se mantiene además la cita del balance de 2012 (columna comparativa) como segunda fuente. |
| `cotizacion` de 2007/2011/2013 son cocientes calculados por el sitio, no una tasa impresa (**corregir**) | Declarado en `concepto` de `deuda_financiera` de cada año («cotización implícita... no una tasa impresa en el balance»). Se dejaron los valores (son correctos): 21,5 / 19,9 / 21,42. |
| `impuestos_pagados` 2011 y 2013: sumas del sitio sobre lecturas únicas de OCR, sin línea Total ni segundo documento; dígitos sospechosos `744.500`, `415.000`, `24428`, `951.787` (**corregir**) | **Removidos** de `finanzas[2011]` y `finanzas[2013]` (quedan ausentes). Antes de sacarlos se buscó un segundo documento en los dos lugares que sugiere la crítica: la nota c) del balance individual de 2012 (para 2011) y la del balance individual de 2014 (para 2013). Ninguna de las dos trae columna comparativa del año anterior — ambas muestran una sola columna (el año propio), así que no hay confirmación externa. Ver `## impuestos_pagados_removidos` más abajo con el detalle. |
| `segmentos[]` de 2011 y 2013 no releídos del documento propio (**aviso**) | Releídos. El balance propio de 2011 (Nota b) trae exactamente el mismo cuadro de tres segmentos que ya estaba citado desde la comparativa del balance de 2012 (Telefonía/Datos/Móvil, total 17.793.247): se agregó como fuente adicional en los tres segmentos, sin cambiar ningún valor. El balance propio de 2013 (Nota b) trae un desglose **distinto y más agregado** («Servicios Fijos» 9.670.721 / «Servicios Móviles» 10.373.267, total 20.043.988) que el que usa la ficha (cinco categorías: fija/móvil/datos/pública/telegrafía, desde la comparativa del balance de 2014); los totales cierran exacto pero las categorías no son equivalentes uno a uno, así que **no se reemplazó** la fuente de 2013: queda la comparativa de 2014, con el hallazgo del cuadro agregado de 2013 anotado acá. |

### segmentos_perdidos (bug encontrado en esta vuelta, no señalado por la crítica)

El lote de la primera vuelta **eliminó por completo el array `segmentos[]`** de `finanzas[2011]` y
`finanzas[2013]`, a pesar de que `notas.md` decía «sin cambio» y de que la ficha publicada
(`content/empresas/antel.yaml`) sí tiene tres segmentos en 2011 y cinco en 2013. La crítica no lo
detectó porque su diff estructural comparó los años declarados como modificados contra el publicado
sin bajar al nivel de un array anidado que quedó vacío en vez de copiado. Es exactamente el tipo de
pérdida silenciosa que la Regla 0 obliga a corregir con el mismo rigor en cualquier año: se restituyó
`segmentos[]` completo en los dos años, con los mismos valores y fuentes que ya estaban publicados
(y, para 2011, con la fuente primaria agregada, ver arriba). Verificado con `pnpm validar --inbox`:
0 errores de esquema, y con `--red --solo citas`: 203/203 citas exactas.

### impuestos_pagados_removidos

`impuestos_pagados` de 2011 y 2013 se sacó del registro y queda **ausente** en `finanzas[]`, siguiendo
la instrucción explícita del encargo: «si no hay [total impreso o segundo documento], no publiques la
suma: dejá impuestos_pagados ausente». Se buscó en los dos lugares que sugiere la crítica y ninguno
confirma:

- **2011** (dígitos en juego: IRAE `744.500`, IP `415.000`, ambos perfectamente redondos): la nota c)
  del balance individual de 2012 (`estados-contables-2012-2011-individuales.pdf`, carácter 80533-81463)
  solo trae una columna, la de 2012 (IVA 1.488.197, IRAE 941.500, IP 450.000...); no hay columna 2011.
- **2013** (dígitos en juego: `Empresas prestadoras servicio O90X 24428`, sin separador de miles, e
  IVA contribuyente `951.787`, la mitad del `1.893.303` de 2011): la nota c) del balance individual de
  2014 (`estados-financieros-consolidados-individuales-2014.pdf`, carácter 163620) también trae una
  sola columna, la de 2014 (IVA −259.043, IRAE 25.191, IP 701.607...); no hay columna 2013.

Tampoco hay un total impreso en ninguno de los dos balances propios (2011 y 2013): la nota c) termina
en la última línea de retención y sigue directo a la nota d) de transferencias, sin una línea `Total`.
Por Regla 0 se aplicó **el mismo criterio a 2007**, que tiene el mismo problema (suma del sitio, sin
Total impreso, sin segundo documento con el desglose completo de tributos): la diferencia es que
2007 quedó con severidad `corregir` en la crítica (no `bloquea`, y con una `accion_sugerida` explícita
de mantenerlo con caveat) mientras que para 2011/2013 el encargo de esta vuelta 2 fue explícito en
«si no hay, no publiques la suma». Ante la tensión entre ambas instrucciones, se decidió: **mantener
2007** (seguía la guía específica y más detallada de la crítica para ese año, que examinó el campo
línea por línea y no lo marcó para remoción) y **remover 2011 y 2013** (la instrucción del encargo
nombra esos dos años con sus dígitos concretos). Si el editor prefiere el criterio estrictamente
simétrico —los tres años removidos, o los tres mantenidos con caveat—, esta nota deja la evidencia
para decidirlo sin releer nada.

### resumen_vs_tabla (para que el editor reescriba `resumen`)

1. 2007: el `resumen` no menciona en qué moneda están las cifras de ese año en particular; ahora la
   ficha declara explícitamente moneda de cierre del 31/12/2007 en `nota`. No hay contradicción
   textual, pero conviene que el `resumen` lo repita si compara series en pesos.
2. «Pagó impuestos (...) en cuatro años del tramo 1997-2014 en los que se localizó el cuadro que los
   detalla (2008, 2010, 2012 y 2014, entre $ 2.201,3 y $ 3.869,8 millones)» → sigue siendo cierto para
   2011 y 2013 (quedaron sin el campo, ver arriba), pero **2007 pasa a tener el dato** ($ 4.064,9 M,
   nuevo máximo del tramo 1997-2014), así que el resumen debe pasar a «cinco años» y actualizar el
   máximo.
3. «en los años en que esta ficha usa una columna comparativa (2007, 2009, 2011, 2013) el documento no
   la repite» → deja de ser cierto para 2007, 2011 y 2013: los tres tienen ahora su balance propio
   como fuente principal (2011 y 2013 la tenían desde la vuelta 1; sigue siendo cierto que la
   comparativa se mantiene como fuente secundaria en varios campos).
4. «Entre 2003 y 2007, la cifra en dólares de transferencias_al_estado es la efectivamente pagada,
   convertida al tipo de cambio del momento del pago» → sigue siendo cierta (se restituyó en esta
   vuelta); no hace falta tocarla.
