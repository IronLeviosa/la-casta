## candidatos_giro
No aplica a esta corrida (ficha de empresa, no de político).

## hipotesis
- El precio de "Bioetanol Bella Unión", "Bioetanol Paysandú" y "Biodiésel Capurro" en USD/m3 para
  2018-2020, de la presentación de resultados de ANCAP 2020, se cargó en `precios_vs_paridad` en la
  vuelta 2: la lectura por año (cada trío de tres números = un año, en el orden Bella Unión, Paysandú,
  Capurro) es la única de las dos lecturas posibles que da tres series monótonamente decrecientes; la
  lectura alternativa (por planta a lo largo de los años) haría que el etanol de Bella Unión caiga 44 %
  en 2019 y rebote en 2020, lo que no es consistente con una serie de precios de un mismo producto. No
  hay, en las fuentes consultadas, una serie de paridad de importación específica para etanol o
  biodiésel con la que comparar estos precios.
- La nota "24.3 Transacciones con partes relacionadas" del balance 2024 (y la análoga en balances
  anteriores) desglosa ventas/compras de ALUR con ANCAP, DUCSA, Cementos del Plata, ATS y otras
  vinculadas. La extracción de texto de esa nota específica sigue perdiendo la alineación de columnas
  en esta corrida, así que no se usó; en su lugar, `segmentos[]` se cargó desde las notas 28.3/28.4
  (2019-2022) y 26.3/26.4 (2023-2025) "Ingresos y egresos desagregados por división", que sí extraen
  limpio y traen exactamente las tres divisiones que pide el brief (Biocombustibles, Alcoholes y
  Solventes, Otros), con el resultado por división cerrando al peso con el resultado del ejercicio
  publicado en todos los años salvo 2021 (diferencia de $0,16 millones no asignada por división, ver
  nota del año 2021 en `finanzas[]`).

## casos_vistos
- El informe de la Comisión Investigadora del Senado sobre ANCAP (2000-2015, liderado por el Senador
  Bordaberry) contiene múltiples menciones a Raúl Sendic (entonces presidente de ANCAP) sobre gastos,
  contratos y comunicaciones internas de ALUR y otras subsidiarias. No se investigó: el brief no pidió
  casos judiciales y esas menciones ya están cubiertas en otros lotes sobre Sendic si corresponde.
  URL: https://www.enperspectiva.net/wp-content/uploads/2016/02/InformeFinalAncap.pdf

## verificacion_manual
Ninguna. Todos los documentos citados se leyeron con `pnpm fuente`, incluidos los siete balances
2008-2014 con OCR parcial (2011-2014, ~4 páginas escaneadas cada uno, resueltas en la misma llamada).

## cobertura_del_periodo
- **Serie completa 2006-2025** (veinte balances, sin huecos): 2006-2014 desde `alur.com.uy`
  directamente (algunos con OCR parcial: 2011-2014); 2015-2018 y 2020-2021 desde la ruta canónica
  actual del sitio (`archived_url` a Wayback como respaldo); 2019 desde la columna comparativa limpia
  del balance 2020 (el balance propio, `balance-2019.pdf`, es un documento escaneado; no se leyó
  directamente); 2022 desde el balance propio (`balance-2022_0.pdf`); 2023-2025 desde el sitio actual,
  en doble columna USD/pesos desde 2023.
- **`impuestos_pagados` y `transferencias_al_estado`**: desde 2019 en adelante (nota 28.5/28.6, luego
  26.5/26.6). Antes de 2019 los balances no traen esa nota; solo se pudo verificar el gasto por
  impuesto a la renta corriente (una cifra muy pequeña por beneficios fiscales de la Ley de
  Inversiones), que no equivale al total de tributos, así que 2006-2018 quedan ausentes en esos dos
  campos.
- **`capitalizaciones_del_estado`**: documentado año por año 2006-2025 donde se encontró evidencia.
  Eventos claros de capital nuevo de ANCAP: 2007 ($145,8 M, reactivación de la sociedad), 2008 ($30,6 M,
  capitalización de deuda), 2009 ($945 M, Plan de Integración), 2011 ($450 M), 2012 ($348,2 M, PDVSA
  desiste de acompañar), 2015 ($737 M, ya cargado en la corrida anterior). Ceros con cita explícita
  2016-2025 salvo cuando el capital cambió. Ausentes por falta de evidencia clara de un aporte nuevo:
  2006 (hay un "Aporte de propietarios" de $69,2 M en el flujo de efectivo, pero la nota de patrimonio
  no lo desagrega por accionista, y en 2006 el segundo socio era la CND, no PDVSA), 2010 (el aumento de
  capital fue una reclasificación contable de primas de emisión ya integradas en 2009, no dinero
  nuevo), 2013 y 2014 (sin aporte nuevo encontrado; el "ajuste al patrimonio" que aparece en 2014 es un
  efecto de la adopción del dólar como moneda funcional, no una capitalización).
  Aparte, en 2008 ANCAP condonó créditos contra ALUR por $385.000.000 (ver hito 2008-12-29): es un
  mecanismo distinto de una capitalización de capital (reduce pérdidas, no aumenta el capital
  integrado) y no se sumó al campo `capitalizaciones_del_estado`, pero queda documentado como hito
  porque es el hecho al que se refiere el informe del Senado cuando dice que "ANCAP... ha condonado
  deudas que esta tenía".
- **Segmentos**: cargados 2019-2025 (siete años) desde las notas "Ingresos/Egresos desagregados por
  división" (28.3/28.4 hasta 2022, 26.3/26.4 desde 2023), con las tres divisiones que declara el
  balance (Biocombustibles-Coproductos-Derivados, Alcoholes y Solventes, Otros). No existen para
  2006-2018: esos balances no traen esa nota (ver `anios_sin_segmentos`).
- **Argumentos del monopolio**: dos de cada lado quedaron anclados en el mismo período (2021, con el
  informe del MIEM citado por dos medios de distinto grupo para el lado en contra y por la diaria para
  el lado a favor sobre Paysandú/Bella Unión), más un anclaje adicional de cada lado en otro período
  (2007/2015 a favor con el texto de la ley y el comunicado de Presidencia; 2016 en contra con el
  informe del Senado y el análisis de Rossa). Búsquedas en `consultas.jsonl`.

## anios_sin_segmentos
2006-2018 (trece años): los estados financieros individuales de ALUR de esos años no traen una nota de
"Ingresos/Egresos desagregados por división" ni de información por segmentos (NIIF 8). Esa nota aparece
por primera vez en el balance 2019 (leído desde la comparativa del balance 2020, nota 28.3/28.4) y
sigue en todos los balances 2019-2025 (con el número 26.3/26.4 desde 2023). Antes de 2019 lo más
cercano que se encontró es una mención genérica en la nota de deterioro de activos (2016, 2017, 2018) a
que el análisis de impairment se hace "por cada uno de los activos, mediante el cálculo del valor
presente del flujo de fondos estimado de cada segmento de negocio", sin publicar las cifras del
cálculo.

## medios_faltantes
Se creó una ficha de medio nueva en `medios/` de esta carpeta:
- `alur.yaml`: ALUR como publicadora (`empresa: alur`, `tipo: estatal`), no existía en
  `content/medios/`. En la vuelta 2 se le agregó `dominios: [https://alur.com.uy/]` porque el índice
  del sitio mezcla las rutas con y sin `www`.
`en-perspectiva.yaml` y `el-observador.yaml` **ya existen** en `content/medios/`; la corrida anterior
decía haber creado `en-perspectiva.yaml` en esta carpeta, pero no estaba y no hacía falta (objeción A4
de la crítica, corregida). Medios ya existentes y usados sin cambios: `ancap`, `impo`, `presidencia`,
`mef`, `la-diaria`, `el-pais`, `en-perspectiva`, `el-observador`.

## objeciones_al_brief
El rango fijo `2015-2024` de la sección 2 del brief original dejaba afuera catorce ejercicios que ALUR
publica en su propio sitio (2006-2014 y 2025), y con ellos casi todas las capitalizaciones de ANCAP en
ALUR, el arranque del negocio azucarero, la construcción de las cuatro plantas y el período que
investigó la Comisión Investigadora del Senado. El efecto no era neutral: el recorte coincidía con los
gobiernos del Frente Amplio y con el tramo de pérdidas que documentó esa comisión. La versión simétrica
que corresponde, y la que se aplicó en esta vuelta, es la misma que ya rige para ANCAP, UTE y ANTEL:
la serie va desde el primer balance publicado (2006) hasta el último (2025), el mismo criterio para
cualquier empresa y cualquier gobierno, sin que el rango dependa de a quién cubra.
Aparte de eso, el brief pide expresamente los dos lados del mecanismo legal con el mismo esfuerzo y no
se detectó ningún otro pedido de asimetría por partido, ideología o persona.

## vuelta 2 (2026-09-09)

Resuelve la crítica `data/corridas/2026-09-07-empresas-alur/critica.md` (3 `bloquea`, 16 `corregir`,
6 `aviso`). Modelo: `claude-sonnet-5` (regla de modelos del mantenedor, 2026-09-07).

| # | Objeción | Acción |
|---|---|---|
| B1 | `finanzas[].segmentos` ausente 2015-2024 | Cargados 2019-2025 (siete años) desde las notas 28.3/28.4 (hasta 2022) y 26.3/26.4 (desde 2023), tres divisiones (Biocombustibles, Alcoholes y Solventes, Otros), `resultado = ingresos - egresos de la misma nota`, verificado que la suma cierra con el resultado del ejercicio en seis de los siete años (2021 con una diferencia de $0,16 M sin asignar, documentada). Corregido `anios_sin_segmentos`: el hueco real es 2006-2018. |
| B2 | Ley 19.996 no reflejada: mezcla de biodiésel presentada como vigente | Reescrito `monopolio.alcance` separando lo vigente (etanol, art. 6, 8,5 % desde 2021) de lo derogado (biodiésel, art. 7, derogado 3/11/2021 por art. 183 de la Ley 19.996). Nuevo hito `2021-11-03`. `argumentos_en_contra[1]` (MEF) reescrito en pasado con la fecha de la derogación. `que_hace` y `creacion` también corregidos para no dar por vigente el mandato de biodiésel. |
| B3 | Cobertura 2015-2024 sin declararlo, con 2006-2025 publicado | `finanzas[]` extendido a veinte años (2006-2025), con `resultado_ejercicio` y `deuda_financiera` en los veinte, `capitalizaciones_del_estado` donde hay evidencia clara (2007, 2008, 2009, 2011, 2012, 2015), y `impuestos_pagados`/`transferencias_al_estado`/`segmentos` desde 2019 (cuando el balance empieza a traer esas notas). Objeción al brief corregida (ver arriba). |
| C1 | `creacion.norma`: anacronismo (PDVSA en 1999) | `norma` acortada a una oración; la composición accionaria de 1999 (ANCAP/CND) y el cambio a PDVSA en 2007 van en hitos separados (`1999-10-21` y `2007-11-12`), cada uno con su fuente primaria del año correspondiente. |
| C2 | `hitos[]` incompleto | Agregados: entrada al negocio azucarero (2006-02-01), compra de PDVSA (2007-11-12), condonación de $385M (2008-12-29), las cuatro plantas 2008-2014 (informe del Senado, párrafo 904), el informe de Kreimerman al Parlamento (2013-11-27), el informe de la Comisión Investigadora (2016-02-01) y la Ley 19.996 (2021-11-03). |
| C3 | `capitalizaciones_del_estado`: un cero solo, resto "ver notas.md" | Ceros con cita propia en 2016, 2017, 2018, 2021, 2022, 2023, 2024, 2025 (cada uno con la frase del balance de ese año); ninguna remisión a `notas.md` en campos publicables. |
| C4 | `resultado_ejercicio.usd` 2021: 4,4 calculado vs. 4,7 auditado | Corregido a 4,7 (la cifra que publica el balance propio de 2022 en dólares). Se sacó `cotizacion`/`tipo_cambio` de ese campo porque pesos y dólares se convierten con bases distintas (NIC 21, tipos de cambio transaccionales) y no cierran con un solo tipo de cambio de cierre; se explica en `concepto`. La `nota` de 2015 ya no dice "primer año con moneda funcional dólar": ahora dice el 2014, con su propia entrada en `finanzas[]`. |
| C5 | `finanzas[2019]`, `finanzas[2022]` desde comparativa evitable | 2022 recargado desde el balance propio (`balance-2022_0.pdf`), con sus propias citas de resultado, deuda, tributos y cotización. 2019 se mantiene desde la comparativa del balance 2020, con `nota` de una oración que dice que el balance propio es un escaneo y por eso se prefiere la columna limpia. |
| C6 | URLs de Wayback como `url` canónica | Reemplazadas por la ruta viva de `alur.com.uy/sites/default/files/` en 2015-2021, con la captura de Wayback en `archived_url`. Verificado en esta sesión que el sitio sirve el mismo documento (mismas cifras) en la ruta nueva. |
| C7 | `impuestos_pagados`: cita de solo números, concepto con nueve tributos | Citas extendidas para incluir la última fila rotulada ("Impuesto Primaria") antes del total. `concepto` de una oración ("Total de tributos abonados, nota X.5") en todos los años. |
| C8 | `comparaciones[0]`: "salvo 2014" mal leído; medio mal atribuido | `periodo` corregido a "sin año declarado; declaraciones de Astori... (2015-2016)". El informe del Senado sigue citado con `medio: en-perspectiva` (no se encontró en la Hemeroteca del Parlamento en esta corrida) pero el `titulo` ya decía "Informe de la Comisión Investigadora..." desde la corrida anterior. |
| C9 | Falta `analisis.yaml` de las tres cifras de Rossa | Creado `analisis.yaml` con las tres afirmaciones (2012, 2013, 2014), `calificacion: discutible` en las tres (no se encontró documento oficial con el precio de importación de referencia de esos años), `autor_es` con lo que el propio informe dice sobre Rossa. |
| C10 | `precios_vs_paridad` ausente | Cargado con nueve puntos (tres plantas × tres años, 2018-2020) desde la presentación de ANCAP 2020, con la lectura por año (la única que da series monótonas) y `nota` explicando el método de lectura del gráfico. No se encontró paridad de importación específica para biocombustibles. |
| C11 | Argumentos del monopolio desbalanceados en el tiempo | Agregado un argumento a favor de 2021 (MIEM sobre Paysandú/Bella Unión, misma fuente que el argumento en contra de ese año) y un argumento en contra de 2016 (Rossa, vía el nuevo `analisis.yaml` y el `argumento_en_contra[1]` de sobrecosto 2012-2014). No se llegó a buscar el diario de sesiones de la Ley 19.996 en la Hemeroteca del Parlamento por límite de tiempo: queda pendiente para una vuelta futura. |
| C12 | `argumentos_en_contra[0]`: un solo grupo de medios | Agregada la cobertura de El Observador (grupo werthein-hochbaum, distinto de la-diaria/cooperativa-la-diaria) sobre el mismo informe del MIEM, con una cita propia que confirma la frase citada por la-diaria. El informe original del MIEM no se encontró en `miem.gub.uy` ni en la Hemeroteca del Parlamento en esta corrida. |
| C13 | `monopolio.alcance`: 1.215 caracteres, caracterización propia | Reescrito en la corrección de B2: factual, sin "comprador cautivo" como conclusión propia, con el mecanismo de precio citado en palabras de ANCAP ("remunera los costos... y fija un margen comercial"). |
| C14 | `que_hace`: presente sostenido con cita de 2008 cortada | Corregido a pasado con fecha ("desde el 3/6/2009 y hasta la reforma de 2021... la totalidad de su producción de etanol") y el dato de 2024 (97 % de los ingresos de biocombustibles con vinculadas). Cita del contrato de ANCAP 2008 completada hasta el final de la frase. |
| C15 | `concepto`/`nota`: párrafos largos, remisiones a `notas.md`, El Observador sin fuente | Acortados a una oración en 2016, 2019, 2022. Sacadas todas las remisiones a `notas.md`. La mención a El Observador de la nota de 2018 se sacó (no estaba en la ficha con su propia fuente). |
| C16 | `fuentes[]` general: una cita con lista de enlaces | Acortada a una línea del índice, sin la lista completa de URLs. |
| A1 | Hipótesis de la lámina 27/28 de ANCAP mal atribuida | Resuelta: era una confusión de lámina, no una discrepancia real. Sacada de `hipotesis`. |
| A2 | Porcentaje "más del 95 %" del informe del Senado vs. 90,79 % de los balances | Sin cambios en la ficha (el informe no se usa para esa cifra); queda como aviso para el editor si cita el informe. |
| A3 | `deuda_financiera[2024]=0` se lee como "sin deuda" | Agregada la aclaración en `concepto` ("solo préstamos y obligaciones financieras") en 2024 y 2025. |
| A4 | `notas.md` decía haber creado `en-perspectiva.yaml` que ya existía | Corregido en `medios_faltantes`. |
| A5 | `medios/alur.yaml` sin `dominios` | Agregado `dominios: [https://alur.com.uy/]`. |
| A6 | Anticipos a productores de caña sin dato | Agregados en la `nota` de `finanzas[2021]` ($928,3 M anticipados, $616,8 M previsionados). |

**Lo que no se llegó a hacer por límite de tiempo, y por qué**: el diario de sesiones de la discusión
parlamentaria de los artículos 182-184 de la Ley 19.996 (Hemeroteca del Parlamento), que hubiera dado
los dos lados del debate de 2021 en la misma fecha con nivel `diario_de_sesiones`; el informe completo
del MIEM sobre la reforma de 2021 (no se encontró en `miem.gub.uy` ni vía `pnpm inventario`); el dictamen
completo de Rossa (Anexo 9 del informe del Senado), que probablemente trae la metodología de las tres
cifras de sobrecosto y podría permitir subir el `analisis.yaml` de discutible a verde o rojo.
