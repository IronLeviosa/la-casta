# Notas — BROU (corrida 2026-09-07-empresas-brou)

## candidatos_giro
No aplica: esta corrida no investiga declaraciones de un político, sino la ficha de una empresa
pública.

## hipotesis
Ninguna hipótesis sin probar quedó pendiente de investigación adicional en esta corrida; lo que no
se pudo documentar quedó explícito como ausencia en `finanzas[].nota` o en las secciones de abajo.

## casos_vistos
- https://www.elobservador.com.uy/nacional/el-detras-la-denuncia-penal-contra-la-auf-dos-directores-del-brou-que-dice-el-informe-la-comision-fiscal-n5971221 — denuncia penal contra dos directores de BROU vinculada a la AUF; apareció en un resultado de búsqueda de la página de transparencia de BROU, no se abrió ni se investigó (el brief no pide casos judiciales).
- Corpus: mención a que el expresidente del BROU, Fernando Calloia, fue procesado por "abuso de funciones" junto con Danilo Astori y Gonzalo Menéndez en una nota de 2016 sobre financiamiento político ("La promesa del Frente Amplio de no meter la mano en la lata..."); no se investigó, solo se vio de pasada en una búsqueda de corpus.

## verificacion_manual
- https://www.poderjudicial.gub.uy/documentos/198-2018/5620-198-2018-cuentas-judiciales-brou-contaduria-general-de-la-nacion.html — HTTP 404 en dos variantes de URL probadas (con "198-2018" y con "65-2018" como primer segmento). Se reemplazó por la Circular N° 64/2007, que sí se pudo leer y que documenta el mismo hecho (transferencia de depósitos judiciales del BHU a BROU) con cita textual.
- https://www.bcu.gub.uy/Servicios-Financieros-SSF/Reportes%20del%20Sistema%20Financiero/RSF_IV_25.pdf — se descargó completo (11,2 MB, HTTP 200) pero `pnpm fuente` no pudo extraer su texto ("Invalid PDF structure"). Ver detalle en `## vuelta 2`.

## cobertura_del_periodo
| Año | Documento usado | Tipo | Resultado del ejercicio | Impuestos | Transferencias al Estado | Segmentos |
|---|---|---|---|---|---|---|
| 2015 | Balances-Dic15-Esp.pdf (informe de indicadores de BROU) | documento_oficial | Sí | Sí (suma de dos líneas) | No documentado | No (el informe no trae nota de segmentos) |
| 2016 | balances-dic16-esp.pdf + Memoria Anual 2016 (vuelta 2) | documento_oficial | Sí | Sí (vuelta 2, Memoria Anual) | Sí (vuelta 2, Memoria Anual) | No |
| 2017 | Estados Financieros BROU al 31/12/2018 (columna comparativa) + Balances-Dic17-Esp.pdf (vuelta 2) | documento_oficial | Sí (con la cifra en la norma anterior) | Sí | No documentado (se revisó también la Memoria 2017) | Sí |
| 2018 | Estados Financieros BROU al 31/12/2018 (propio) | documento_oficial | Sí | Sí | Sí | Sí |
| 2019 | Estados Financieros BROU al 31/12/2019 | documento_oficial | Sí | Sí | Sí | Sí |
| 2020 | Estados Financieros BROU al 31/12/2020 | documento_oficial | Sí | Sí | Sí (artículo 11 + artículo 40, vuelta 2) | Sí |
| 2021 | Estados Financieros BROU al 31/12/2021 | documento_oficial | Sí | Sí | Sí (artículo 11 + artículo 40, vuelta 2) | Sí |
| 2022 | Estados Financieros BROU al 31/12/2022 | documento_oficial | Sí | Sí | Sí (artículo 11 + artículo 40, vuelta 2) | Sí |
| 2023 | Estados Financieros BROU al 31/12/2023 | documento_oficial | Sí | Sí | Sí (artículo 11 + artículo 40, vuelta 2) | Sí |
| 2024 | Estados Financieros BROU al 31/12/2024 | documento_oficial | Sí | Sí | Sí (artículo 11 + artículo 40, vuelta 2) | Sí |

Los diez años del brief (2015-2024) quedaron cargados. El inventario (`.cache/inventarios/brou.com.uy.jsonl`,
113 documentos) fue la base para decidir qué había disponible: confirma que BROU solo publica
"auditorias-YYYY.pdf" en formato NIIF completo (con nota de segmentos, patrimonio e impuesto a la
renta) desde el ejercicio 2018 en adelante (y su comparativo 2017); para 2015 y 2016 lo único
disponible como estado contable corto es el informe de indicadores ("Balances-DicXX-Esp.pdf"), sin
nota de segmentos, complementado en la vuelta 2 con la Memoria Anual (que sí trae el detalle de
impuestos y de la transferencia a Rentas Generales). Se verificó con el índice CDX de Wayback sobre
el nodo `documents/20182/52654/` que no existen "auditorias-2015.pdf" ni "auditorias-2016.pdf" ni
"auditorias-2017.pdf" archivados en ningún momento; sí existe `Balances-Dic17-Esp.pdf` (nodo
`documents/20182/28438/`), abierto en la vuelta 2 (ver C1).

## anios_sin_segmentos
2015 y 2016: el informe de indicadores de esos años no trae nota de segmentos de negocio (esa nota
solo aparece en el formato de Estados Financieros NIIF vigente desde 2018, con el comparativo 2017).

## medios_faltantes
No se detectó una falta de cobertura por medio: la información de BROU sale casi enteramente de sus
propios documentos y de la legislación. `elpais.com.uy` no se probó específicamente con
`pnpm descubrir` porque el foco de esta corrida es la ficha de la empresa (balances y marco legal),
no declaraciones de un político; el debate sobre el artículo 281 de la Rendición de Cuentas de 2021
se cubrió con El Observador y la diaria, que sí aparecen en `WebSearch`, y en la vuelta 2 con la
versión taquigráfica de la propia comisión.

## anios_sin_balance
No hay años del período 2015-2024 sin ningún documento: los diez años tienen al menos un documento
oficial de BROU. Lo que varía es el nivel de detalle (ver tabla de cobertura arriba).

## Sobre la cotización del dólar (primera vuelta — superado, ver `## vuelta 2`)
Los informes de 2015 y 2016 declaran, en la misma página, una tabla de "Cotización del Dólar a fin
de" (fuente BCU) que permite convertir a dólares con la cotización de cierre que el propio documento
trae. Desde 2018 (formato NIIF), los Estados Financieros de BROU se presentan enteramente en pesos
uruguayos y no declaran una cotización de cierre única (solo mencionan cotizaciones puntuales de
transacciones específicas, ej. "miles de US$ 123.862 equivalentes a miles de $ 4.730.795" para un
pago concreto). Siguiendo la regla de "la cotización que declara el propio balance", los años 2017 a
2024 se cargaron solo en pesos, sin `usd` ni `cotizacion`, para no inventar una tasa que el documento
no declara como cierre del ejercicio.

**Esto era un error**: la nota 2.1.4 "Moneda distinta a la funcional" de cada balance sí declara una
cotización de cierre del dólar; no se había abierto. Corregido en la vuelta 2 (objeción B1).

## Sobre "impuestos_pagados" en un banco (primera vuelta — parcialmente superado, ver `## vuelta 2`)
Los Estados Financieros NIIF de BROU no traen un renglón único de "total de impuestos" como sí lo
tienen UTE o ANCAP (su "Literal D"). Para no cargar "el IRAE solo" (el antipatrón que señala el
diccionario), se sumaron dos líneas del propio balance: el Impuesto a la Renta de operaciones
continuas (línea del Estado de Resultados) y "Impuestos, tasas y contribuciones" (línea de la nota
de Gastos generales, que agrupa el Impuesto al Patrimonio bancario y otras tasas menores). Esa suma
la hace este registro; queda explicada en el campo `concepto` de cada año. Para 2016 no se cargó
`impuestos_pagados` porque el informe de ese año no desglosa esas dos líneas por separado (solo
muestra "Impuesto a la Renta"), y cargar solo esa cifra hubiera repetido el error que el diccionario
pide evitar.

**2016 se completó en la vuelta 2** abriendo la Memoria Anual 2016, que sí trae el desglose. La
serie sigue en base devengada (no caja); ver la objeción C6 de la vuelta 2 para el detalle pendiente.

## Sobre "transferencias_al_estado" y los aportes por artículo 40 (primera vuelta — superado, ver `## vuelta 2`)
El artículo 11 de la Carta Orgánica (Ley 18.716) limita la contribución a Rentas Generales al 50% de
las utilidades netas anuales; el artículo 40 habilita al Poder Ejecutivo a pedir un 30% adicional con
destino a fondos específicos (no a Rentas Generales). En los balances 2020-2024, BROU documenta,
además de los pagos por artículo 11, otros pagos por artículo 40 (a ANDE, a ACAU, al Fondo Solidario
COVID-19, al Fondo de Ferrocarril Central) que en la primera vuelta **no** se cargaron en
`transferencias_al_estado` sino que se documentaban en la `nota` de cada año.

**Corregido en la vuelta 2** (objeción C3): siguiendo la instrucción explícita de esa vuelta, la
cifra principal de `transferencias_al_estado` ahora es el total (artículo 11 + artículo 40) en los
años 2020-2024, y cada pago de artículo 40 quedó además como hito propio en la línea de tiempo.

## Sobre "capitalizaciones_del_estado" (primera vuelta — superado, ver `## vuelta 2`)
No se encontró, en los diez años del período, un aporte de capital fresco del Estado a BROU: los
incrementos de capital de este período provienen de la capitalización de reservas propias (utilidades
retenidas), no de un ingreso adicional del Tesoro. Por eso el campo se dejó ausente en todos los años
en la primera vuelta, en vez de forzar un cero.

**Esto era el error que señaló C2**: el propio estado de cambios en el patrimonio trae la línea
"4.1 Aumentos de capital" con guion (cero) en todos los años NIIF, y ese es exactamente el "cero con
cita" que pide el diccionario. Corregido: `capitalizaciones_del_estado: {pesos: 0, ...}` con cita,
2017-2024 (2015-2016 siguen ausentes porque el informe de indicadores no tiene ese estado).

## Sobre el tipo `ente_autonomo`
El brief sugería verificar el artículo 196 de la Constitución. La Ley 18.716 (Carta Orgánica
vigente), en su artículo 1, dice que BROU "se regirá por las disposiciones de las Secciones XI, XIII
y XIV de la Constitución de la República" (no cita un artículo único), y confirma explícitamente que
está "organizado bajo la forma de ente autónomo". Se usó esa cita, más precisa que un único artículo,
para respaldar `tipo: ente_autonomo`.

## Sobre los argumentos del artículo "monopolio" (primera vuelta — superado, ver `## vuelta 2`)
Se hizo al menos una búsqueda por cada lado (ver `consultas.jsonl`, series de 04:26 a 04:31 y de
04:38): a favor de mantener la reserva de depósitos públicos y judiciales en BROU, y a favor de
abrirla a la banca privada. Del lado "a favor de mantener la reserva" se encontraron dos fuentes con
nombre y apellido (AEBU y Cabildo Abierto — este último se descartó en la vuelta 2, ver C11). Del
lado "a favor de abrir la competencia" solo se encontró una fuente identificable con una cita
completa y no anónima: Diego Labat, presidente del BCU, y la cita disponible en la nota de la diaria
está parcialmente detrás de un muro de pago. No se encontró una declaración pública, con nombre, del
Poder Ejecutivo o del MEF defendiendo en detalle el artículo 281 antes de que lo retiraran.

**Corregido en la vuelta 2** (objeciones B2, B3, C11): se buscó y se encontró el documento
previsible (la versión taquigráfica de la propia comisión), que resuelve de un lado la cita de Labat
sin muro de pago y con las palabras exactas, y del otro lado un argumento real de una legisladora
(Galán) defendiendo la reserva con nombre y cargo. Se agregó también el informe FSAP 2013 del FMI
como segundo argumento en contra, de origen internacional. El detalle completo está en `## vuelta 2`.

## Sobre las comparaciones (primera vuelta — superado, ver `## vuelta 2`)
Se cargó una sola comparación (ROE BROU vs. bancos privados, 2025, CPA Ferrere) porque fue la única
comparación con autor identificable, cifra concreta y período claro que se encontró en esta corrida.
El informe de CPA Ferrere trae más cifras (ROA, morosidad, depósitos), pero no se cargaron como filas
sueltas porque el brief pide "solo lo que una fuente compare" con foco en rentabilidad, eficiencia o
morosidad, y no llegan a ser tres o más comparaciones del mismo documento (umbral que activaría un
registro de `analisis.yaml` según CLAUDE.md).

**Esto era un error de lectura del umbral** (objeción C7 de la crítica): el umbral del validador es
un aviso, no un tope, y un análisis con varias cifras de una misma fuente va a `analisis.yaml` igual
si no llega a tres. Corregido: ver `analisis.yaml` y `## vuelta 2`.

## objeciones_al_brief
Ninguna en la primera vuelta. En la vuelta 2 se identificó una tensión entre el alcance del brief
original (2015-2024, explícito) y el pedido de la crítica de extender la serie hacia atrás como se
hizo con ANCAP, UTE y ANTEL (objeción C12): no es una instrucción asimétrica del brief, es un cambio
de alcance que no se pudo hacer con el mismo rigor en el tiempo de esta vuelta; queda declarado en
`## vuelta 2` para que se decida en una corrida futura.

## vuelta 2 (2026-09-09, resolviendo la crítica de Opus)

Corro en Sonnet por la regla de modelos del mantenedor (2026-09-07): ningún subagente corre en
Fable sin permiso explícito, y Opus queda reservado para el crítico; el investigador, incluida esta
segunda vuelta, corre en Sonnet. Lo digo como corresponde al pie de este informe.

### Tabla objeción → acción

| # | Severidad | Objeción | Acción tomada |
|---|---|---|---|
| B1 | bloquea | Falta `cotizacion`/`usd` en 8 de 10 años | Se abrió la nota "2.1.4 Moneda distinta a la funcional" de cada balance propio (auditorias-2018 a 2024.pdf) y se cargó `cotizacion`, `tipo_cambio: cierre` y `usd` (recalculado por el validador) en `resultado_ejercicio`, `impuestos_pagados`, `transferencias_al_estado`, `capitalizaciones_del_estado` y cada `segmentos[].resultado` de 2017 a 2024, cada uno con su cita literal de esa nota. Los USD de `resultado_ejercicio` cierran exactos con los de control de la crítica (204,6 / 440,2 / 472,1 / 500,4 / 390,8 / 228,9 / 606,2 / 773,7 M). |
| B2 | bloquea | Cita de Labat cortada sobre un muro de pago, con una cláusula que la fuente no respalda | Se buscó y se leyó la versión taquigráfica de la Comisión de Presupuestos integrada con Hacienda de Diputados del 22/7/2021 (`09 VT 22-07 MEF UTEC.PDF`, hallada en el índice de `diputados.gub.uy/com/presup/.../Versiones taquigráficas/`). Tiene el texto completo de la exposición de Labat: la cita "no la protección de la posición de un banco en particular" no existe en ningún lugar del documento y se sacó del registro; se cargó la cita real y completa ("Lo que quiero decir con todos estos ejemplos... Y no se busca otra cosa que eso.") y una segunda cita de la misma VT donde Labat responde directamente que la apertura "va a ayudar a fortalecer" al BROU. El argumento pasa de `nota` (reportado) a `diario_de_sesiones` (textual). Se agregó, además, un segundo argumento en contra de un origen totalmente distinto: la evaluación FSAP 2013 del FMI y el Banco Mundial (IMF Country Report No. 13/152), que describe el monopolio de depósitos públicos y la garantía estatal como "competitive advantages" de BROU y recomienda "designating the BCU as the sole depository of government funds" para nivelar la cancha entre bancos. |
| B3 | bloquea | Falta el artículo 24 de la Ley 18.716 (garantía del Estado) en `monopolio.alcance` y `normas` | Se agregó una entrada nueva en `normas` con el artículo 24 ("El Estado responde directamente de los depósitos y operaciones que realice el Banco") y se reescribió `alcance` completo para incluirlo como el primero de tres privilegios (antes solo mencionaba dos), con la cifra de AEBU (US$ 1.623 M, 9,7 %, 96 % en banca pública) y la serie de depósitos del "Sector Público" del propio balance 2017 (42.996 / 49.239 / 49.113 M). |
| C1 | corregir | `concepto` de 2017 decía "no se localizó" un balance propio existiendo `Balances-Dic17-Esp.pdf` | Se leyó ese documento (vía Wayback, `id_`). Se corrigió el `concepto` de `resultado_ejercicio` y de `impuestos_pagados` de 2017 para no negar la existencia del documento, se agregó una fuente con la cifra en la norma anterior (Resultado $ 5.025 M, Impuesto a la Renta $ 2.894 M, Patrimonio $ 45.198 M, cotización 28,76) y se declaró el quiebre de norma contable en la `nota` del año. |
| C2 | corregir | `capitalizaciones_del_estado` ausente en los 10 años cuando el estado de cambios en el patrimonio trae la línea con guion | Se agregó `capitalizaciones_del_estado: {pesos: 0, ...}` con cita de la línea "4.1 Aumentos de capital" (todo en guiones) para 2017-2024, leída del propio balance de cada año (o su comparativa, para 2017). 2015-2016 quedan ausentes porque el informe de indicadores de esos años no tiene ese estado. |
| C3 | corregir | `transferencias_al_estado` solo mostraba el artículo 11, un tercio menos de lo que salió del banco en años con artículo 40 | Siguiendo la instrucción explícita de esta vuelta (ítem 6), se sumó el artículo 40 al artículo 11 en `transferencias_al_estado.pesos` de 2020 a 2024, con `concepto` de una oración que dice qué incluye, y cada pago de artículo 40 quedó además como un hito propio en la línea de tiempo (ver C8/hitos). Los totales de 2023 y 2024 cierran exactos con la cifra "Otras variaciones del patrimonio neto" del propio estado de cambios en el patrimonio ($ 7.310,1 M y $ 17.839,4 M). |
| C4 | corregir | 8 `nota` de años eran párrafos de 400-530 caracteres | Se recortaron a una oración (solo el patrimonio al cierre, con la cita) en 2018, 2019, 2020, 2021, 2022, 2023; 2016 y 2017 conservan una segunda oración porque hace falta declarar el quiebre de norma (2017) o citar la Memoria (2016), pero bajan de 500+ a 136-296 caracteres, debajo del umbral de 300 que marca `pnpm validar`. |
| C5 | corregir | `concepto` de 2-4 oraciones en varios años | Se dejó `concepto` en una oración en todos los montos tocados en esta vuelta (capitalizaciones, transferencias 2020-2024, impuestos y resultado de 2016-2017). No se tocaron los `concepto` de los años 2018-2024 que ya estaban en una oración. |
| C6 | corregir | `impuestos_pagados` es devengado sin decirlo; 2016 vacío sin abrir la memoria | Se abrió `memoria-2016-esp.pdf` (la única sin el desglose en el informe de indicadores corto) y se cargó `impuestos_pagados` 2016 = $ 4.583,9 M (Impuesto a la Renta $ 3.095,8 M + Impuestos, tasas y contribuciones $ 1.488,1 M), con cita de la Memoria Anual 2016. No se migró la serie completa de devengado a caja: hacerlo para los 8 años NIIF exige abrir el estado de flujos de efectivo de cada balance y no hubo margen en esta vuelta; queda para el editor decidir si declara la serie como devengada en el `resumen` (con el dato de caja 2024 ya disponible: IRAE caja $ 6.760,4 M contra $ 7.436,7 M devengado, 9,1 % de diferencia) o encarga una tercera vuelta para recalcular todo a caja. |
| C7 | corregir | La comparación de CPA Ferrere debía ser un `analisis.yaml`, no una fila suelta | Se escribió `inbox/empresas/brou/2026-09-07/analisis.yaml` con las 5 afirmaciones concretas del informe (ROE, resultado del sistema, posición en moneda extranjera, morosidad, depósitos), cada una con `calificacion: discutible` como marcador. Se vació `comparaciones: []` en `empresas.yaml`. No se pudo cotejar ninguna contra el documento oficial que la propia nota nombra (el Reporte del Sistema Financiero IV trimestre 2025 del BCU, RSF_IV_25.pdf): existe, se descargó completo (11,2 MB, HTTP 200), pero `pnpm fuente` no pudo extraer su texto ("Invalid PDF structure"). Además se encontró que `bcu.gub.uy` sin el subdominio `www` no resuelve (timeout), un problema de canonicalización de URL (ver más abajo) que afecta a cualquier cita futura de la raíz de ese dominio. |
| C8 | corregir | Hito 2002 mal fundado; hito "Mejor Banco" sin fuente verificable; orden y duplicación | Se reescribió el hito de 2002 con la Ley 17.523 (arts. 1 y 2: creación del Fondo de Estabilidad del Sistema Bancario de US$ 1.500 M y su carácter de préstamo a BROU y al BHU). Se eliminó el hito "Mejor Banco del Uruguay" (fuente: autopresentación del banco, revista no identificada). Se reordenaron los 15 hitos cronológicamente y no quedan fechas duplicadas. |
| C9 | corregir | `alcance` en un párrafo de ~300 palabras sin una cifra | Reescrito con las cifras de AEBU y del propio balance (ver B3); baja de un bloque sin números a un texto de 5-6 oraciones con cuatro cifras y sus fuentes. |
| C10 | corregir | Cita del art. 25 cortada antes de "a la fecha de la promulgación de la presente ley" | Corregida la cita completa en `monopolio.normas` (la cita repetida en `alcance` desapareció al reescribirse `alcance` entero). |
| C11 | corregir | Ache clasificado como argumento a favor de la reserva cuando la nota dice que no se opone al artículo | Se sacó a Ache de `argumentos_a_favor`. Se lo reemplazó por un argumento real, con nombre y fuente primaria: Lilián Galán, diputada del MPP (Frente Amplio), en la misma versión taquigráfica del 22/7/2021, defendiendo explícitamente que los depósitos de las empresas públicas deben ser "una política de Estado" y no una elección banco por banco. |
| C12 | corregir | El inventario tiene `Balances-Dic09` a `Dic14` sin abrir; asimetría con ANCAP/UTE/ANTEL (extendidas hacia atrás) | No se cargaron 2009-2014 en esta vuelta. El brief de la corrida original fija el período 2015-2024 de forma explícita ("un ítem por año 2015-2024"); extenderlo a 2009-2014 es un cambio de alcance del encargo, no una corrección de lo pedido, y no había margen para hacerlo con el mismo rigor (leer 6 balances más, con su propia norma contable y su propia serie de segmentos) sin resignar tiempo a los `bloquea`. Se deja explícito acá, como pide Regla 0, para que quien decida el alcance sepa que el mismo criterio que se aplicó a ANCAP/UTE/ANTEL no se aplicó a BROU en esta vuelta, y que los documentos (`Balances-Dic09-Esp.pdf` a `Balances-Dic14-Esp.pdf`) están confirmados en el inventario y listos para una tercera vuelta. |
| C13 | corregir | `transferencias_al_estado` de 2015, 2016 y 2017 sin dato sin agotar la búsqueda | Se abrió `memoria-2016-esp.pdf` y se encontró el dato: contribución a Rentas Generales por la utilidad de 2015, $ 899 M + US$ 60 M, transferida el 28/6/2016 (cargada en `finanzas[2016]`). Se abrió también `memoria-2017-esp.pdf` buscando el pago de la utilidad de 2016: no está (se buscó "Rentas Generales", "Ministerio de Economía", "distribu" y "MEF" sin encontrar el monto). 2015 y 2017 quedan sin este dato, ahora con la búsqueda agotada y declarada. |
| A1 | aviso | `usd` de 2015 no cerraba con `pesos/cotizacion` | Sin cambios: es de la primera vuelta y el validador ya lo recalcula solo; no formaba parte del encargo de esta vuelta. |
| A2 | aviso | `resultado_ejercicio` citado desde la nota de segmentos en vez del renglón directo | Sin cambios en esta vuelta (mismo motivo que A1); los valores son correctos, es la cita la que el editor puede preferir cambiar por la del Estado de Resultados directo. |
| A3 | aviso | Fecha del pago a ANDE (1/8 vs. 26/8) y "artículo 140" que no existe | La `nota` de 2024 ahora dice explícitamente que el balance cita "artículo 140" y que ese artículo no existe en la Ley 18.716; no se cambió la fecha del pago a ANDE porque el hito de 2024 ya usa la fecha de la transferencia real (26/8) tomada del propio texto. |
| A4 | aviso | 8 citas dependen de la autopresentación del banco (`creacion-del-banco`), con `fecha` de retrieval | No resuelto en esta vuelta por tiempo: se priorizaron los `bloquea` y los `corregir` numerados. Los hechos de 1896, 1987, 2002, 2007 y 2010 ya tienen ley o Diario Oficial como fuente alternativa; quedan sin reforzar 1913, 1935 y 1985 (dependen solo de la página institucional). |
| A5 | aviso | El patrimonio es una serie de 10 números en prosa sin campo ni gráfico | Sin cambios: es un límite del esquema (`Anio` no tiene un campo `patrimonio`), señalado para quien decida agregarlo; no es algo que el investigador pueda resolver sin tocar `src/schemas/`. |
| A6 | aviso | `fecha` de la nota de la diaria (27/7) no coincide con el cuerpo (26/7) | Sin cambios; dato menor, no forma parte del encargo de esta vuelta. |
| A7 | aviso | medios faltantes (`brou`, `poder-judicial`, `cpa-ferrere`) | Escritos en `inbox/empresas/brou/2026-09-07/medios/`: `brou.yaml`, `poder-judicial.yaml`, `cpa-ferrere.yaml`. Se agregaron además `fmi.yaml` (para la fuente FSAP del argumento en contra nuevo) y `uruguayxxi-gub-uy.yaml` (fuente de la descripción de CPA Ferrere), ninguno de los dos pedido explícitamente pero necesarios para que las citas nuevas resuelvan `medio`. |
| A8 | aviso | La `nota` que explica "Otros" en segmentos solo está en 2017 | Sin cambios de campo (no puedo escribir `resumen`); queda señalado acá para que el editor agregue, en el `resumen`, que el segmento "Otros" de todos los años agrupa gastos de funcionamiento, impuesto a la renta, impuesto al patrimonio y resultados por valuación no repartidos entre segmentos. |

### Sobre el argumento en contra y la simetría de esfuerzo

Con la versión taquigráfica del 22/7/2021 se pudo, en una sola lectura, corregir la cita de Labat
(B2), encontrar el argumento a favor de la reserva de una legisladora con nombre y cargo (Galán,
C11) y confirmar que el debate real usó los números de artículo "279 a 282" (que incluyen la
sustitución del artículo 453 por el artículo 281 del proyecto, verificado también en
`brc2020_mensaje_y_proyecto.pdf`, el texto del Poder Ejecutivo). No se encontró una exposición de
motivos aparte para este artículo puntual en `brc2020_exposicion_motivos.pdf` (se buscaron "453",
"Banco Central del Uruguay", "sistema financiero" y "bancos autorizados" sin dar con un párrafo
dedicado); la explicación del Poder Ejecutivo quedó a cargo de quien presidía el BCU en la propia
comisión, que es lo que se cargó. El segundo argumento en contra (FSAP/FMI) es una fuente
completamente distinta de las tres notas de julio de 2021 que dominaban el lote anterior, y de un
origen internacional, no partidario. También se buscó una declaración de ABPU (Asociación de Bancos
Privados del Uruguay) sobre este episodio puntual y no se encontró una cita propia (solo menciones
de terceros a "la banca privada" en general); queda declarado, no inventado.

### Sobre `bcu.gub.uy` sin `www`

Encontrado al intentar leer `RSF_IV_25.pdf` para el `analisis.yaml`: `https://bcu.gub.uy/...` (sin
`www`) no resuelve (timeout, `curl` exit 28), mientras que `https://www.bcu.gub.uy/...` responde en
milisegundos. `scripts/lib/url.ts` (`canonicalizar`) le saca el `www` a cualquier host antes de
pedirlo, así que cualquier URL de `bcu.gub.uy` que pase por `pnpm fuente` corre riesgo de perder el
`www` y fallar, sin importar qué agente la cite. En este caso se pudo leer pasando la URL completa
con `www` al llamado. Lo dejo anotado para quien pueda tocar `scripts/`: no es un problema de BROU
ni de esta corrida, es un problema general del cliente HTTP con ese dominio en particular.

### Validación de esta vuelta

`pnpm validar --inbox inbox/empresas/brou/2026-09-07`: esquema 0 errores; referencias 171 errores,
todos "Medio desconocido" para `brou`, `cpa-ferrere`, `fmi` y `poder-judicial` (los medios que se
escriben en esta vuelta en `inbox/.../medios/`, más `uruguayxxi-gub-uy`, y que hay que promover a
`content/medios/` antes de que el resto valide limpio); 44 avisos, casi todos preexistentes en
ANCAP/ANTEL/UTE (notas largas) y no de este lote. Como `validar` corta en la primera etapa con
errores, `--red` se corrió con `--solo citas` y `--solo fuentes` para sortear el corte: `citas` da 0
errores (101 citas, 98 exactas y 3 aproximadas al 0,99 de similitud, ninguna bloqueante) y `fuentes`
da 0 errores (22 URLs únicas, todas HTTP 200).
