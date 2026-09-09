# Crítica — corrida 2026-09-07-empresas-afe

Modelo: Opus 5 (`claude-opus-5[1m]`). Corro en Opus porque es el único rol que lo hace por regla del mantenedor (CLAUDE.md, regla de modelos del 2026-09-07); el investigador de este lote declara `claude-sonnet-5`, como corresponde.
Lote: `inbox/empresas/afe/2026-09-07/`
Registros revisados: 1 (`empresas.yaml`, un registro: 9 años de `finanzas`, 6 `normas`, 2+2 argumentos, 8 `hitos`, `comparaciones` vacío, `segmentos` vacío en los 9 años).
Documentos releídos en esta sesión con `pnpm fuente`: EEFF AFE 2017 (individual), EEFF 2018 (individual), balance individual 2021, EEFF separados 2022, EEFF separados 2023, informe de variaciones 2024/2023 (Ecovis), dictámenes TCR 2024, MEMORIA-2014, MEMORIA-2015, Decreto-Ley 14.396 (art. 3 y texto completo), Ley 11.859, Declaración de Red 2024 (MTOP), OPP PPP, Presidencia 10/01/2024, la diaria 16/04/2024, la diaria 19/05/2025, El Observador 20/05/2025, Ámbito 24/04/2025, unionferroviaria.uy.

## Tabla resumen

| # | Campo | Severidad | Tipo | En una línea |
|---|---|---|---|---|
| 1 | `finanzas[2021].resultado.concepto`, `finanzas[2022].resultado.concepto` | bloquea | contexto_omitido | La ficha dice que la diferencia «no está explicada en ninguno de los dos documentos»; los dos documentos la explican, con monto y concepto. |
| 2 | `finanzas[2020/2021].capitalizaciones_del_estado` | bloquea | riesgo_legal / contexto_omitido | «Cap. por inversiones» (+$2.102.396.173 en 2021, el 76 % de la cifra del año) es un movimiento patrimonial cuyo origen el propio investigador no puede atribuir al Estado. |
| 3 | `hitos[1]` y `finanzas[2018].nota` (exoneración Ley 14.396) | bloquea | cita_fuera_de_contexto | La cita de la exoneración no está en la URL citada (art. 3); está en el art. 17 y con una excepción que la ficha omite. |
| 4 | `finanzas[].capitalizaciones_del_estado` (FOCEM) | corregir | contexto_omitido | El aporte FOCEM (Mercosur) va sumado dentro de «lo que el Estado puso»: 78 % de la cifra de 2018. |
| 5 | `finanzas` 2016 y 2017 | corregir | documento_previsible | El balance propio de 2017 está en el inventario y trae 2016 y 2017; el resultado 2017 que la ficha carga no es el del ejercicio propio. |
| 6 | `finanzas` 2024 | corregir | documento_previsible | 2024 se lee: el informe de variaciones (Ecovis) da resultado 2024 = $(814.058.969) y la variación de Capital. |
| 7 | `finanzas[].*` (todos los montos) | corregir | presentacion | Ningún monto lleva `usd`, `tipo_cambio` ni `cotizacion`, y el balance declara el tipo de cambio; una serie 2011-2023 solo en pesos invierte el signo de la tendencia. |
| 8 | `finanzas[].segmentos` | corregir | presentacion | Vacío en los 9 años; los balances dan ingresos por división en 2016, 2017, 2018, 2022, 2023 y 2024, legibles. |
| 9 | `impuestos_pagados`, `transferencias_al_estado`, `deuda_financiera` | corregir | contexto_omitido | Ausentes en los 9 años, con una justificación apoyada en la cita mal atribuida del punto 3 y sin la cita del propio balance. |
| 10 | `finanzas` (bases de medición) | corregir | presentacion | 2011-2012 mide caja (flujo de efectivo) y marco Ley 17.040; 2017-2023 mide devengado (cuenta Capital) y NIIF para PYMES: una serie, dos convenciones, sin declararlo. |
| 11 | `finanzas` (dictamen de auditoría) | corregir | contexto_omitido | 2022 tiene abstención de opinión de RSM y 2024 abstención del Tribunal de Cuentas; la ficha publica esas cifras como «estados contables auditados» sin decirlo. |
| 12 | `monopolio.tiene` / `monopolio.alcance` | corregir | contexto_omitido | `tiene: true` contradice el propio `alcance` y la fuente del MTOP: hoy es un sistema abierto y la infraestructura la administra la DNTF. |
| 13 | `monopolio.argumentos_a_favor` | corregir | asimetria | Los dos «argumentos a favor» son descripciones de la norma, no argumentos de nadie sobre el diseño de AFE. |
| 14 | `monopolio.argumentos_en_contra` | corregir | asimetria / documento_previsible | Uno es sobre un episodio contractual (que el brief excluye) y en un medio argentino; el otro es una consigna. La versión taquigráfica que falta está enlazada en la propia página del sindicato. |
| 15 | `que_hace` | corregir | contexto_omitido | Dice que pasó a la DNTF la «gestión de operaciones»; el literal F es retiro y reposición de material ferroviario. |
| 16 | `hitos` (faltantes) | corregir | presentacion | Faltan 1988 (cierre del servicio de pasajeros), 1990 (mitad de la red no operativa), 2018 (SeLF deja de contratar a AFE) y 2019 (cierre de línea por obras), todos en fuentes ya leídas. |
| 17 | `hitos[6]` (16/04/2024) | corregir | cita_fuera_de_contexto | «Inicio de operaciones» está tomado del epígrafe de una foto y fija como hecho la fecha que el consorcio disputa (diciembre de 2023). |
| 18 | `hitos[7]` (US$ 144 millones) | corregir | contexto_omitido | La misma nota dice que un mediador tenía 60 días para determinar si la cifra «es correcta o debe ajustarse». |
| 19 | `monopolio.alcance` (canon 0,005) | corregir | riesgo_legal | La tarifa del canon sale de «fuentes del gobierno» anónimas y se publica como dato firme. |
| 20 | `concepto` y `nota` de varios años | corregir | presentacion | Párrafos de tres a cinco oraciones en campos que la página imprime como nota al pie, y convenciones de toda la serie colgadas del pie de un año. |
| 21 | `creacion.fecha` | aviso | contexto_omitido | 1952-09-19 no surge del texto leído (IMPO da publicación 30/09/1952). |
| 22 | Citas que son filas de números sin rótulo | aviso | cita_fuera_de_contexto | `(10.371.257.557) (885.718.153) 8.989.804.245 9.325.236.900` valida mecánicamente pero no le prueba nada al lector. |
| 23 | Dos fuentes de la diaria con muro de pago | aviso | riesgo_legal | Corresponde evaluar `verificacion: manual`. |
| 24 | Fuente de Presidencia tipada `documento_oficial` | aviso | contexto_omitido | Es una gacetilla de `comunicacion/noticias`, no un texto oficial. |
| 25 | `comparaciones: []` | sin_objecion | — | La búsqueda está registrada y el vacío está justificado en `notas.md`. |

Conteo: **3 bloquea, 17 corregir, 4 aviso, 1 sin objeción**.

---

## Objeciones por campo

### 1. `finanzas[2021].resultado_ejercicio.concepto` y `finanzas[2022].resultado_ejercicio.concepto` — «La diferencia no está explicada en ninguno de los dos documentos»
- severidad: **bloquea**
- tipo: contexto_omitido
- objecion: es el error más grave del lote, porque la afirmación falsa no está en una nota interna sino en un `concepto` que la página imprime al pie de la tabla, y afirma algo sobre los documentos de la empresa que los documentos contradicen. AFE explica las dos diferencias, en los mismos PDF que la ficha cita, en la nota 10.2 y en el cuadro de ajustes del Estado de Cambios en el Patrimonio.
- cita_de_contexto (EEFF Separados 2022, `https://www.afe.com.uy/pdf/balance/2022/Estados-financieros-Separados-AFE-31.12.2022.pdf`, para la diferencia de 2021): «Costo de los Servicios Prestados Amortizaciones (251.190.726) (6.106.386) (257.297.112) / Resultados Diversos Otros ingresos 9.178.597 7,280 9.185.877 / (6.099.106) / La pérdida reconocida en resultados acumulados por $ 26.762.697 se dio por los siguientes conceptos: Ganancia por cambio de criterio de valuación de existencias a FIFO: $ 1.234.608 · Pérdida por amortizaciones: $ 27.997.305». Y en la nota 10.2 del mismo documento: «El rubro "Resultados Acumulados" al inicio del ejercicio económico finalizado el 31 de diciembre de 2022 fue modificado según se expone en el Estado de Cambios en el Patrimonio 2021, para incluir una pérdida en concepto de "Ajuste de ejercicios anteriores" por $32.861.804 … como producto de cambios en la políticas contables referentes a inventarios como se detalla en nota 6 y otros ajustes de exposición».
- cita_de_contexto (EEFF Separados 2023, `https://www.afe.com.uy/pdf/balance/2023/Estados-Financieros-Separados-.pdf`, para la diferencia de 2022): «Resultado del Ejercicio (865.686.662) (2.673.387) (868.360.049) … La pérdida reconocida en resultados acumulados por $2.673.387 se debe al reconocimiento del costo de los materiales de vía entregados en el 2022 producto de ventas realizadas en ese ejercicio.»
- accion_sugerida: borrar las dos frases «no está explicada» y cambiar la cifra según la convención del diccionario (ver objeción 5 para la convención). El `concepto` queda en una oración; la explicación del ajuste va en `nota`, también en una oración.

### 2. `finanzas[2020].capitalizaciones_del_estado` y `finanzas[2021].capitalizaciones_del_estado` — «Cap. por inversiones» dentro de lo que puso el Estado
- severidad: **bloquea**
- tipo: contexto_omitido
- objecion: el campo responde «qué puso el Estado» y la página lo dibuja como barra. En 2021 el 76 % de la cifra ($2.102.396.173 de $2.770.283.847) es el aumento de una subcuenta patrimonial que el propio investigador no puede atribuir a nadie: en `notas.md` escribe que ese salto «no tiene, en las notas de los balances leídos, una explicación narrativa de origen (¿aportes en especie del MTOP…? ¿revalúo de activos?)». Publicar como aporte estatal un movimiento contable de origen desconocido es exactamente lo que el diccionario ordena no hacer, y en 2021 convierte a ese año en el pico de la serie.
- cita_de_contexto: la subcuenta estuvo congelada en $479.976.877 entre 2015 y 2017 (EEFF 2017, Nota 10.1: «Cap. Por inversiones 479.976.877 479.976:877 479.976.877»), lo que descarta que sea un flujo anual de subsidio. Y el informe de auditoría de los EEFF 2022 apunta a un origen no estatal para el salto de 2021: «De acuerdo con lo mencionado en la nota 6.3.2, AFE reclasificó el stock de materiales de infraestructura ferroviaria reconocido en 2021 como inventarios por $ 2.306.777.782 al rubro de Propiedad, Planta y Equipo».
- accion_sugerida: sacar «Cap. por inversiones» de `capitalizaciones_del_estado` en 2020 y 2021 (dejando 2020 = $1.099.114.992 y 2021 = $667.887.674 con asistencia financiera y FOCEM según se resuelva la objeción 4) y, si se quiere conservar el dato, leer la nota 6.3.2 de los EEFF 2022 y la nota de Patrimonio de los EEFF 2021 para decir qué es, en `nota`.

### 3. `hitos[1]` (1975) y `finanzas[2018].nota` — la exoneración tributaria citada de un artículo que no la contiene
- severidad: **bloquea**
- tipo: cita_fuera_de_contexto
- objecion: el hito atribuye a `https://www.impo.com.uy/bases/decretos-ley/14396-1975/3` la frase «Por su Carta Orgánica, Ley N* 14396, la Administración de Ferrocarriles del Estado está exonerada del pago de todo tributo y contribución.» Esa página tiene 1.975 caracteres y contiene solo el artículo 3; la frase no está ahí (`pnpm fuente … --buscar "exonerada del pago de todo tributo"` devuelve «sin coincidencias en esta nota»). La redacción y el «N*» delatan que salió del OCR de una nota de un balance, no del texto legal. Sobre esa cita se apoya, además, la decisión de dejar vacíos `impuestos_pagados` y `transferencias_al_estado` en los nueve años. También la `norma` 2 describe al artículo 3 como el que «exonera a AFE de todo tributo», y no lo hace.
- cita_de_contexto: el texto legal está en el artículo 17, y trae una excepción que la ficha no recoge. Decreto-Ley 14.396, `https://www.impo.com.uy/bases/decretos-ley/14396-1975`: «Artículo 17 La Administración de Ferrocarriles del Estado queda exonerada del pago de todo tributo y contribuciones, con excepción de las tarifas por servicios efectivamente prestados.»
- accion_sugerida: reemplazar la fuente por el artículo 17 (`https://www.impo.com.uy/bases/decretos-ley/14396-1975/17` o el texto completo, que ya está en el corpus) con la cita literal completa, incluida la excepción; corregir la descripción de la `norma` (el artículo 3 fija competencias, el 17 exonera); y no sostener sobre esa cita la ausencia de `impuestos_pagados` (ver objeción 9).

### 4. `finanzas[2018/2019/2020/2021].capitalizaciones_del_estado` — el aporte FOCEM sumado a lo que puso el Estado
- severidad: corregir
- tipo: contexto_omitido
- objecion: el FOCEM es el Fondo para la Convergencia Estructural del Mercosur, no el Estado uruguayo, y la propia ficha lo dice en el `concepto` de 2018 («aporte FOCEM del Mercosur»). Pero la cifra que la página va a graficar los suma: 2018 = $2.359,2 M, de los cuales $1.834,5 M (78 %) son FOCEM; 2019 = $1.679,6 M, de los cuales $1.066,4 M (63 %). El lector que mira la barra de 2018 concluye que el Estado uruguayo puso cuatro veces y media lo que puso. El diccionario admite «cobros de fondos», pero el ejemplo es el Fondo de Estabilización Energética, que es plata del propio sistema uruguayo; acá la mezcla cambia la respuesta a la pregunta que la ficha existe para responder.
- cita_de_contexto: EEFF 2017, Nota 10.1: «Aporte FOCEM: Este concepto incluye los aportes realizados por el Fondo para la Convergencia Estructural del Mercosur en los proyectos de Rehabilitación de Vías Férreas en las líneas Rivera (FOCEM |) y Artigas (FOCEM II).» En el mismo lugar queda claro qué sí es del Estado: «Capitalizaciones por asistencia financiera: … a partir del ejercicio cerrado al 31 de diciembre de 2003 todos los subsidios recibidos por parte del Estado fueron tratados como aumento de patrimonio».
- accion_sugerida: cargar en `capitalizaciones_del_estado` solo la asistencia financiera (2018 $524.785.875; 2019 $613.258.380; 2020 $670.696.451; 2021 $666.885.692; 2022 $720.000.000; 2023 $605.885.000) y declarar el FOCEM en `nota` de una oración por año, o —si el editor prefiere conservarlo— separar los dos conceptos y decir en el `resumen`, una sola vez, que la barra incluye fondos del Mercosur ejecutados por el Estado. Cualquiera de las dos, pero la misma para toda la serie y explicitada.

### 5. `finanzas[2016]` ausente y `finanzas[2017]` con la cifra del año siguiente — el balance propio está en el inventario
- severidad: corregir
- tipo: documento_previsible
- objecion: `notas.md` afirma que no hay balance para «2013, 2014, 2015 y 2016» y que el índice CDX «solo» tiene `balance-2012.pdf`, `balance-self.pdf` y licitaciones. Es falso para 2016 y 2017: el inventario del sitio (`.cache/inventarios/afe.com.uy.jsonl`) lista `https://www.afe.com.uy/wp-content/uploads/ESTADOS-FINANCIEROS-AFE-2017.pdf` (archivado el 2024-07-12). Lo leí en esta sesión: trae el resultado propio de 2017, el comparativo de 2016 y la Nota 10 con las capitalizaciones de los dos años. La causa del hueco es de proceso: la corrida no corrió `pnpm inventario` (0 menciones en `consultas.jsonl`) y usó un CDX a mano restringido a `wp-content/uploads/*` con un filtro (`balance-201|eecc|…`) que no matchea el nombre de ese archivo ni la carpeta `pdf/balance/` donde vive todo lo posterior a 2018.
- cita_de_contexto: EEFF AFE al 31/12/2017, `https://web.archive.org/web/20240712000502id_/https://www.afe.com.uy/wp-content/uploads/ESTADOS-FINANCIEROS-AFE-2017.pdf`: «RESULTADO DEL EJERCICIO (452.534.386) (614,784,531)»; Nota 10.1: «Asistencia financiera 4.136.035.487 756.057.300 4.892.092.787 668.414.080 5.560.506.867 … Aporte FOCEM 1.082.741.227 1.082.741.227 1.069.102.305 2.151.843.532».
- objecion (segunda parte, la convención): el resultado 2017 que la ficha carga (-$488,5 M) es el de la columna comparativa del balance 2018; el propio 2017 dice -$452,5 M (35,96 M de diferencia). El diccionario decide: `resultado_ejercicio` es «El renglón final del estado de resultados individual o separado (no consolidado), **del propio ejercicio, en la moneda del propio ejercicio**», y la regla transversal 1 («moneda del propio ejercicio») trata de la reexpresión **por inflación**. AFE no reexpresa por inflación: hace correcciones de ejercicios anteriores, y para eso la misma fila dice la otra mitad: «Si el balance siguiente lo reexpresa (NIIF, corrección de error), se carga el reexpresado con la cifra original en `nota`», con los precedentes ANCAP 2020 y OSE 2013. O sea: manda el reexpresado, con el original en `nota`. **La ficha no aplica ninguna de las dos convenciones de manera uniforme**: en 2017 usa la cifra del balance siguiente (sin saberlo) y en 2021, 2022 y 2023 usa la del año propio. Una misma serie con dos criterios es la falla que el diccionario dice que existe para evitar.
- accion_sugerida: cargar 2016 (resultado -$614,8 M; capitalizaciones 2016 = asistencia financiera $756.057.300, más FOCEM $1.082.741.227 según se resuelva la objeción 4) y 2017 (capitalizaciones = asistencia financiera $668.414.080, más FOCEM $1.069.102.305); y unificar la convención en toda la serie: cifra reexpresada por el balance siguiente cuando existe (2017 = -$488,5 M, 2021 = -$865.397.163, 2022 = -$868.360.049, 2023 = -$979.399.261 si el balance 2024 lo confirma), con la cifra original en `nota` y la convención dicha una sola vez en el `resumen`.

### 6. `finanzas[2024]` ausente — el año se lee, no es una falla de herramienta
- severidad: corregir
- tipo: documento_previsible
- objecion: `notas.md` dice que 2024 «no se pudo leer por una falla de OCR del entorno» y que «es la única falla de herramienta». Es cierto para el PDF escaneado de los estados financieros separados, y no es cierto para el año: el inventario tiene **nueve** documentos de 2024, y dos de ellos se leyeron en esta sesión al primer intento, sin `--ocr` forzado. El informe de variaciones de Ecovis trae el estado de situación y el estado de resultados completos, 2024 contra 2023.
- cita_de_contexto: `https://www.afe.com.uy/pdf/balance/2024/afe-informe-de-variaciones-ejercicios-finalizados-en-31-12-24-y-31-12-2023.pdf`: «Capital 19.998.928.883| 19.393.043.883| 605.885.000| 31% … Resultados acumulados (14.040.165.238) | (13.060.765.980) | (979.399.258) | — 7.5% / Resultado del ejercicio (814.058.969) | — (979.399.261)| 165.340.292 | -16.9%»; y el detalle por división: «Canon por uso de via 1.709.527 2.077.6088 (308.161) -18% / Servicio de pasajeros 1.982.030 1.495.653 486.377 33% / Ingresos netos operativos 3.691.557 3.573.341».
- accion_sugerida: cargar 2024 con resultado -$814,1 M; confirmar la variación de Capital de $605.885.000 contra la Nota 10 de los EEFF 2024 antes de darla por capitalización del año (coincide con el incremento de 2023, y una coincidencia exacta merece verificarse); y corregir la línea de cobertura: 2024 tiene documento, lo que falta es una lectura del PDF escaneado.

### 7. `finanzas[].*` — ningún monto tiene `usd`, `tipo_cambio` ni `cotizacion`, y el balance los declara
- severidad: corregir
- tipo: presentacion
- objecion: el brief lo pedía explícitamente («los montos `usd` en millones con un decimal y `tipo_cambio: cierre` con la cotización que declare el propio balance»), el diccionario tiene fila propia para `cotizacion` y las dos fichas publicadas que sirven de vara lo traen en cada monto (UTE 2003 y ANP 2003 llevan `usd`, `tipo_cambio: cierre` y una segunda fuente con la nota de tipo de cambio). Acá no hay ninguno, y `notas.md` no dice por qué. No es cosmético: la página dibuja `finanzas` y una serie 2011→2023 solo en pesos, con la inflación uruguaya del período, muestra un deterioro del 72 % (-561,6 M → -967,4 M) donde en dólares la pérdida es aproximadamente estable o menor. El signo de la conclusión depende de la moneda elegida.
- cita_de_contexto: los balances declaran la cotización. Balance individual 2021, nota de moneda extranjera: «El siguiente es el detalle de las principales cotizaciones de las monedas extranjeras operadas por … al promedio y cierre del ejercicio económico: Dic-21 … Dic-20 … Dólar estadounidense 43,572 44,695 41,906 42,340».
- accion_sugerida: agregar `usd`, `tipo_cambio: cierre` y `cotizacion` a cada monto, con la nota de moneda extranjera de cada balance como segunda fuente del monto (como hace `ute.yaml`); para los años tomados de una columna comparativa, usar la cotización del año al que corresponde la cifra y decirlo en `nota`. Si algún año no declara cotización, dejar `usd` vacío y anotarlo en `notas.md`, como hizo ANTEL 1997-2008.

### 8. `finanzas[].segmentos` — vacío en los nueve años, con los ingresos por división legibles
- severidad: corregir
- tipo: presentacion
- objecion: `notas.md` dice que «en ningún año pude leer con confianza … un resultado (utilidad o pérdida) por división». Eso es correcto y también es una respuesta a una pregunta que el diccionario no hace: la fila `segmentos[]` dice «Resultado (**o ingresos, si el balance solo da eso**) de cada negocio; el `concepto` dice cuál de los dos es, y toda la serie de una empresa usa el mismo», con ANTEL cargado por ingresos. Los ingresos por división están perfectamente legibles en al menos seis años, en documentos de este mismo lote. Sin `segmentos` la página no tiene nada que prender, y se pierde el hecho más elocuente de la ficha: que los ingresos operativos propios de AFE cayeron de $42,5 M en 2017 a $3,7 M en 2024.
- cita_de_contexto: EEFF 2018 (`https://www.afe.com.uy/pdf/balance/2018/AFE-EEFF-al-31.12.18-e-Informe-de-Auditoria.pdf`): «Canon por uso de via 22,061,497 23,718,158 / Servicios por transporte de carga 601,374 9,450,514 / Servicio de pasajeros 8,098,420 9,303,031 / INGRESOS OPERATIVOS NETOS 30,761,291 42,471,703» (2018 y 2017). EEFF 2017: «Canon por uso de via 23.718.158 33.488.382 / Servicios por transporte de carga 9.450.514 75.006.304 / Servicio de pasajeros 9.303.031 …» (2017 y 2016). EEFF 2023, Nota 11: «Canon por uso de via 2.077.688 5.461.231 / Servicio de pasajeros 1.495.653 1.441.134 / TOTAL INGRESOS OPERATIVOS 3,573.341 6.902.365» (2023 y 2022), con la definición de cada división en el mismo lugar. Informe de variaciones 2024: canon y pasajeros de 2024.
- accion_sugerida: cargar `segmentos[]` como ingresos por división en 2016, 2017, 2018, 2022, 2023 y 2024 (y en 2019-2021 si el estado de resultados de esos balances trae las mismas filas), con `concepto` idéntico en toda la serie: «ingresos operativos de la división, no resultado». Anotar en `anios_sin_segmentos` solo los que queden.

### 9. `impuestos_pagados`, `transferencias_al_estado` y `deuda_financiera` — ausentes en los nueve años
- severidad: corregir
- tipo: contexto_omitido
- objecion: tres de las cinco columnas de la tabla están vacías en toda la serie, y la única explicación está en el pie de 2018 («Por su carta orgánica (Ley 14.396) AFE está exonerada de todo tributo y no transfiere a Rentas Generales»), apoyada en la cita mal atribuida de la objeción 3. Tres problemas: (a) el artículo 17 exonera «con excepción de las tarifas por servicios efectivamente prestados», que la ficha no dice; (b) la vara de la casa carga tributos aun cuando la empresa retiene por cuenta de terceros (ANP 2003 registra «impuestos pagados por ANP como contribuyente y retenciones a terceros (IVA, IRPF, IRNR…)»), y el estado de resultados de AFE muestra «Retribuciones personales y cargas sociales» todos los años, así que la afirmación «no paga ningún tributo» necesita cotejarse contra el balance antes de vaciar la columna; (c) `deuda_financiera` no aparece ni siquiera mencionada en `notas.md`, y el documento la muestra.
- cita_de_contexto: informe de variaciones 2024: «Otros pasivos financieros , , 0% … Pasivo no Corriente J3.d79.502 3.942.753 (563.251) / Pasivo 129.912.892 186.786.664 (56.873.772)» — un pasivo total de $129,9 M al cierre de 2024 y sin deuda financiera visible, que es un dato en sí mismo para el dueño de la empresa.
- accion_sugerida: cargar `deuda_financiera` con cita por año (o cero con cita, que el diccionario admite explícitamente); revisar la nota de tributos de un balance antes de dar por vacía `impuestos_pagados` y, si efectivamente es cero, cargarla como cero con la cita del artículo 17 completo; y mover la convención al `resumen`, una sola vez, en lugar del pie de 2018.

### 10. `finanzas` — dos bases de medición y dos marcos contables en la misma serie
- severidad: corregir
- tipo: presentacion
- objecion: 2011 y 2012 salen del «Balance General del Organismo» publicado bajo la Ley 17.040 y miden la capitalización por caja («Aporte de capital» del Estado de Flujo de Efectivo); 2017 a 2023 salen de estados financieros individuales/separados bajo NIIF para PYMES y miden la capitalización por el incremento devengado de la cuenta Capital, que incluye aportes en especie y FOCEM. Son dos cosas distintas graficadas en la misma barra, con un hueco de cuatro años en el medio. El diccionario pide caja para transferencias e impuestos y no zanja capitalizaciones, pero sí exige que un cambio de convención «se diga una vez en `nota`».
- accion_sugerida: decir en el `resumen` que 2011-2012 son caja y 2017-2024 devengado, o rehacer 2011-2012 desde el estado de evolución del patrimonio de ese balance para que toda la serie mida lo mismo.

### 11. `finanzas` 2022 y 2024 — cifras de estados contables con abstención de opinión, sin decirlo
- severidad: corregir
- tipo: contexto_omitido
- objecion: la colección promete «resultados año por año según los estados contables **auditados**». En 2022 el auditor externo se abstuvo de opinar y en 2024 se abstuvo el Tribunal de Cuentas. La ficha publica esos números sin una palabra. Es información que el dueño de la empresa quiere tener, y es simétrica: se le exige a AFE lo mismo que a ANCAP o a UTE.
- cita_de_contexto: informe de RSM sobre los EEFF separados 2022: «No expresamos una opinión sobre los estados financieros separados adjuntos. Debido a la significatividad de las cuestiones descritas en la sección "Fundamentos de la abstención de opinión" … AFE no dispone de un detalle de la composición de terrenos y edificios, así como de material rodante que, ascienden en su conjunto a la suma de $ 1.332.964.811». Dictámenes del TCR sobre 2024 (`https://web.archive.org/web/20260512103530id_/https://www.afe.com.uy/pdf/balance/2024/dictamenes-tcr-eeff-eep-2024.pdf`): «DICTAMEN SOBRE LOS ESTADOS FINANCIEROS CONSOLIDADOS / Abstención de Opinión / … No expresamos una opinión sobre los estados financieros consolidados», con dos incumplimientos constatados: «Artículo 190 de la Ley N? 19.438 de 14/10/2016 — Publicación de estados financieros en AIN. * Artículo 286 de la Ley N* 19.889 de 09/07/2020 — Publicación de estados financieros en sitio web».
- accion_sugerida: revisar el dictamen de cada año cargado y anotar en `nota`, en una oración, los que tengan abstención o salvedad; el incumplimiento de publicación constatado por el TCR es además un hito con fuente.

### 12. `monopolio.tiene: true` y `monopolio.alcance` — la ficha dirá «sí» donde su propia fuente dice «sistema abierto»
- severidad: corregir
- tipo: contexto_omitido
- objecion: dos cosas. (a) `tiene: true` contradice el final del propio `alcance` («AFE ya no administra la infraestructura ferroviaria … el transporte de pasajeros y de cargas por la red es un "sistema abierto"») y a la fuente del MTOP que la ficha cita. La página va a mostrar «monopolio: sí» arriba de un texto que explica que no. (b) El `alcance` afirma que la Ley 11.859 y el Decreto-Ley 14.396 «reservaron a AFE, **sin otros operadores**» el transporte ferroviario; las citas que lo respaldan dicen «Compete a AFE» y «Realizar servicios de transporte…», que es una competencia, no una reserva legal excluyente. La exclusividad puede haber sido de hecho; afirmarla como diseño legal necesita la norma que la establece.
- cita_de_contexto: Declaración de la Red Ferroviaria Nacional 2024 (MTOP/DNTF): «● Un sistema abierto, en el que cualquier empresa que cumpla los requisitos establecidos por la normativa, puede realizar el transporte de pasajeros y/o cargas por la Red Ferroviaria Nacional. ● La Dirección Nacional de Transporte Ferroviario (DNTF) … con los cometidos relativos a la administración de la infraestructura».
- accion_sugerida: o `tiene: false` con el `alcance` contando la historia del monopolio y su apertura (y conservando los argumentos, que el esquema permite igual), o `tiene: true` con la norma vigente que reserva algo hoy, citada. Y sacar «sin otros operadores» salvo que aparezca la norma.

### 13. `monopolio.argumentos_a_favor` — son descripciones de la norma, no argumentos de alguien
- severidad: corregir
- tipo: asimetria
- objecion: el primero atribuye a la OPP un argumento sobre el Ferrocarril Central; la página de la OPP es una descripción general del régimen de PPP y no menciona el Ferrocarril Central. El segundo atribuye a la DNTF un argumento sobre las ventajas de separar infraestructura de operación; la cita es la definición del sistema, no una defensa de él. Ninguno es «una idea en palabras de quien la sostiene» sobre el diseño de AFE, que es lo que el esquema y el brief piden. Vale la simetría: el problema no es que falten argumentos favorables, es que estos dos no lo son.
- cita_de_contexto: OPP, `https://www.opp.gub.uy/es/participacion-publico-privada`: la frase citada aparece al final de una lista titulada «Principios y Orientaciones Generales», después de «Transparencia y publicidad / Protección del interés público / Eficiencia económica…»; es el texto del artículo 3 de la Ley 18.786 parafraseado por el organismo, sin referencia al ferrocarril.
- accion_sugerida: buscar el argumento donde alguien lo sostiene: la exposición de motivos y la discusión parlamentaria del artículo 243 de la Ley 20.075 (Rendición de Cuentas 2021, versiones taquigráficas de la Comisión de Presupuesto integrada con Hacienda), la fundamentación del Poder Ejecutivo del Decreto 280/018 (principios de la reglamentación ferroviaria) y las declaraciones del MTOP al anunciar el canon. Si se conservan los actuales, bajar el `quien` a lo que la fuente respalda («la Ley 18.786, según la descripción de la OPP»).

### 14. `monopolio.argumentos_en_contra` — un episodio contractual en medio argentino y una consigna
- severidad: corregir
- tipo: asimetria / documento_previsible
- objecion: el brief pide argumentos «sobre el diseño legal (qué está reservado y por qué debería seguir así o cambiar), no sobre un episodio suelto». El primer argumento en contra es sobre la redacción de un contrato y su diferendo de pagos: un episodio, no el diseño. Además su `quien` es la Unidad de PPP del MEF, cuyo informe no se leyó: la fuente es una nota de Ámbito (Argentina) que lo describe. El segundo es una consigna de la portada del sindicato («Presupuesto ya para el Tacoma! Por un ferrocarril al servicio del pueblo!»), que no es un argumento sobre el régimen. El resultado es un desbalance de esfuerzo: dos documentos oficiales de un lado, una nota de prensa extranjera y un eslogan del otro. Y lo que falta está a un clic: la propia portada del sindicato enlaza la intervención que `notas.md` reconoce no haber leído.
- cita_de_contexto: `https://www.unionferroviaria.uy/`: «Compartimos la intervención de nuestros compañeros Washington Sánchez y Sergio Laín en la comisión de transporte de la cámara de diputados en el marco del comienzo de la discusión de la rendición…»; y en la misma portada, la posición sobre el cierre: «Desde el cierre de la estación central hemos venido colocando iniciativas para su reapertura y la reactivación del servicio. En 2019 nos opusimos al cierre total de la línea».
- accion_sugerida: **objeción de tipo `documento_previsible`, el lote no se cierra sin esta búsqueda**: la versión taquigráfica de la Comisión de Transporte, Comunicaciones y Obras Públicas de la Cámara de Representantes con la delegación de la Unión Ferroviaria (Parlamento, buscador de versiones taquigráficas por comisión y fecha) es el documento donde el argumento en contra existe en palabras de quien lo sostiene. El mismo criterio para el otro lado: el informe de la Unidad de PPP del MEF, que también es un documento previsible (MEF, Unidad de Participación Público-Privada) y no una descripción de prensa. Si alguno no aparece, se dice qué se buscó.

### 15. `que_hace` — «gestión de operaciones» no es lo que transfirió la Ley 20.075
- severidad: corregir
- tipo: contexto_omitido
- objecion: `que_hace` es el texto que más se lee de la ficha y dice que pasaron a la DNTF «las competencias sobre construcción, conservación de la infraestructura ferroviaria, convenios de interconexión internacional y **gestión de operaciones**». La ley transfiere los literales C, E y F del artículo 3 de la carta orgánica, y el F es otra cosa. El `alcance` lo dice bien («retiro o reposición de material ferroviario»), así que es un descuido, pero queda en la parte visible.
- cita_de_contexto: Decreto-Ley 14.396, artículo 3: «F) Retirar y reponer material ferroviario (vías, durmientes, etc.) cuando lo considere conveniente, manteniendo siempre un trazado para los destinos previstos para la línea afectada.»
- accion_sugerida: reemplazar «gestión de operaciones» por «retiro y reposición de material ferroviario».

### 16. `hitos` — faltan los cuatro hechos que explican por qué la empresa está donde está
- severidad: corregir
- tipo: presentacion
- objecion: la línea de tiempo salta de 1975 a 2000 y después se concentra en 2011-2025. Faltan, con fuente ya leída en este lote: el cierre del servicio de pasajeros en 1988, la declaración de la mitad de la red como no operativa en 1990, el fin de la contratación de AFE por SeLF en enero de 2018 (que explica la caída de los ingresos por carga a cero) y el cierre de la línea en 2019 por las obras del Ferrocarril Central. La ausencia importa también por simetría entre gobiernos: tal como está, la línea de tiempo tiene siete hitos entre 2000 y 2025 y ninguno entre 1976 y 1999, y los dos hechos que más marcaron la decadencia de la empresa caen justamente en ese tramo.
- cita_de_contexto: Declaración de la Red 2024 (MTOP): «Posteriormente, en el año 1988 se clausura el servicio de pasajeros y en el año 1990 la mitad de la red es declarada No Operativa, quedando unos 1484 km de red activa. (incluye 137 que se encuentran provisoriamente clausurados)»; EEFF 2023, Nota 11: «Servicios de transporte de carga: Corresponde al transporte de carga que A.F.E realiza por cuenta de SeLF. Desde enero 2018 SeLF prescinde de estos servicios.»
- accion_sugerida: agregar esos cuatro hitos con esas fuentes; si el editor quiere la norma exacta de 1988 y 1990, están en el Diario Oficial y la Hemeroteca del Parlamento (regla transversal 7 del diccionario).

### 17. `hitos[6]` — «Inicio de operaciones del Ferrocarril Central» citado de un epígrafe de foto y con la fecha en disputa
- severidad: corregir
- tipo: cita_fuera_de_contexto
- objecion: la cita («Inicio de operaciones del Ferrocarril Central, el 16 de abril, en la Estación Cardal, en Florida.») es el epígrafe de la foto de la nota, seguido de «Foto: Mauricio Zina, adhocfotos»; el cuerpo dice otra cosa, que el `detalle` recoge bien: «La fiesta, formalmente anunciada como el "inicio del proceso de puesta en marcha integrada"». Y el título del hito zanja como hecho la fecha que es el centro del diferendo de US$ 144 millones: el consorcio sostiene que la disponibilidad empezó en diciembre de 2023 y el gobierno anterior que no.
- cita_de_contexto: Ámbito, 24/04/2025: «Para las empresas, esto ocurrió en diciembre de 2023, cuando UPM comenzó a transportar su carga de celulosa desde Paso de los Toros hasta el Puerto de Montevideo; pero para el gobierno anterior, no está especificado en ningún lado que dicho momento sea el comienzo de la disponibilidad.»
- accion_sugerida: retitular el hito como «Acto de inicio del proceso de puesta en marcha integrada del Ferrocarril Central», citar del cuerpo de la nota y no del epígrafe, y agregar en `detalle` que la fecha de inicio de la disponibilidad está en disputa entre el Estado y el consorcio.

### 18. `hitos[7]` — los US$ 144 millones estaban sujetos a un mediador
- severidad: corregir
- tipo: contexto_omitido
- objecion: el hito afirma «El Estado acuerda pagar US$ 144 millones». La misma nota que se cita dice que sobre esa cifra un mediador tenía 60 días para revisarla, y El Observador agrega que la adenda iba al Tribunal de Cuentas. Publicar la cifra sin eso la congela como definitiva.
- cita_de_contexto: la diaria, 19/05/2025: «Sobre esa cifra, un "mediador" tendrá 60 días para determinar si "es correcta o debe ajustarse"». El Observador, 20/05/2025: «el Partido Nacional está a la espera de la adenda que el Poder Ejecutivo enviará al Tribunal de Cuentas para analizar el acuerdo anunciado».
- accion_sugerida: agregar la salvedad al `detalle` y buscar el desenlace: la resolución del Tribunal de Cuentas sobre la adenda es un documento previsible (`tcr.gub.uy`, resoluciones 2025) y cierra el hecho como corresponde.

### 19. `monopolio.alcance` — la tarifa del canon sale de fuentes anónimas
- severidad: corregir
- tipo: riesgo_legal
- objecion: el `alcance` publica «un canon de operadores (0,005 dólares por tonelada bruta transportada por kilómetro) que recae hoy sobre UPM» como dato firme. La única fuente es un trascendido: «Fuentes del gobierno confirmaron a El Observador que consistirá en 0,005 dólares por tonelada bruta sobre kilómetro transportado». El anuncio del canon sí es on the record (la ministra Etcheverry), la tarifa no. El criterio de la casa manda trascendidos a hipótesis, no al texto publicado.
- accion_sugerida: dejar en `alcance` el canon anunciado por la ministra, con esa cita, y la tarifa solo si se la atribuye en el texto («según fuentes del gobierno citadas por El Observador») o —mejor— buscar la resolución del MTOP/DNTF o la Declaración de Red 2025-2026 que la fija, que es donde tiene que estar.

### 20. `concepto` y `nota` de varios años — párrafos donde va una oración, y convenciones colgadas del año equivocado
- severidad: corregir
- tipo: presentacion
- objecion: CLAUDE.md y el diccionario son explícitos: «`concepto` y `nota` son una oración, porque van como notas al pie de la tabla», y «las convenciones que se repiten van una sola vez en el `resumen`». Acá el `concepto` de 2011, 2020, 2021 y 2022 tiene de dos a cuatro oraciones (el de 2021 discute una diferencia contable); la `nota` de 2012 explica el hueco 2013-2016 (una afirmación de cobertura de toda la serie colgada del pie de 2012), la de 2018 explica el régimen tributario de todos los años y la de 2023 avisa que falta 2024. El validador ya marca esto en ANCAP, ANTEL y UTE; no hay motivo para repetirlo en una ficha nueva.
- accion_sugerida: `concepto` de una oración («Resultado del ejercicio 2021 según el balance de ese año»); el ajuste posterior, en `nota`, una oración; y las tres afirmaciones de cobertura y convención, al `resumen`.

### 21. `creacion.fecha` — 1952-09-19 no surge del texto leído
- severidad: aviso
- tipo: contexto_omitido
- objecion: la única fecha que aparece en la página de IMPO leída es «Fecha de Publicación: 30/09/1952». La fecha de sanción probablemente sea correcta, pero no está respaldada por la cita.
- accion_sugerida: citar el encabezado con la fecha de la ley o dejar `1952-09` con la publicación.

### 22. Citas que son filas de números sin rótulo
- severidad: aviso
- tipo: cita_fuera_de_contexto
- objecion: `finanzas[2020].resultado_ejercicio` se apoya en «(10.371.257.557) (885.718.153) 8.989.804.245 9.325.236.900», que pasa el mínimo mecánico de 20 caracteres pero no le muestra al lector qué renglón es. El segundo respaldo (columna comparativa del balance 2021) sí lo tiene, así que el arreglo es barato.
- accion_sugerida: elegir citas que incluyan el rótulo del renglón, como se hizo bien en 2018 y 2019.

### 23. Dos fuentes de la diaria con muro de pago
- severidad: aviso
- tipo: riesgo_legal
- objecion: las dos notas de la diaria cortan en «Creá una cuenta gratuita o ingresá para continuar leyendo» (1.551 y 1.471 caracteres visibles). Las citas usadas están en la parte libre, así que validan, pero el resto de la nota no es verificable mecánicamente.
- accion_sugerida: que el editor evalúe `verificacion: manual` para esas dos fuentes, con el criterio de CLAUDE.md para paywall.

### 24. Fuente de Presidencia tipada `documento_oficial`
- severidad: aviso
- tipo: contexto_omitido
- objecion: `gub.uy/presidencia/comunicacion/noticias/…` es una gacetilla de la comunicación presidencial (2.145 caracteres, con declaraciones del ministro), no un texto oficial. La cita es literal y el hecho está bien sostenido; el `tipo` es el que está mal.
- accion_sugerida: `tipo: nota`, medio `presidencia`.

### 25. `comparaciones: []`
- severidad: **sin_objecion**
- tipo: sin_objecion
- objecion: no hay ninguna. El vacío está justificado: se buscó (CEPAL, ALAF vía CEPAL, web general), no se encontró una comparación hecha por una fuente identificable y se registró en `notas.md`. Es la conducta correcta: el sitio no calcula comparaciones. Anoto, como pista para una corrida futura y no como objeción, que las memorias 2014 y 2015 traen la serie de toneladas por producto 2006-2015 y de pasajeros 2013-2015 (datos propios de AFE, no comparaciones).

---

## Objeciones al lote

1. **El inventario no se corrió.** `consultas.jsonl` no tiene ninguna llamada a `pnpm inventario` (0 de 100 líneas), pese a que el diccionario lo pone como regla transversal 7 («El inventario antes que la memoria») y a que el archivo ya existía en `.cache/inventarios/afe.com.uy.jsonl` con 65 documentos. En su lugar se hizo un CDX a mano limitado a `wp-content/uploads/*` y con un filtro de nombres que no matchea `ESTADOS-FINANCIEROS-AFE-2017.pdf` ni la carpeta `pdf/balance/`. De ahí salen las tres afirmaciones de cobertura equivocadas (2016, 2017 propio, 2024). Es la objeción de proceso más importante y la más fácil de evitar.
2. **La cobertura declarada no es verdadera en dos puntos y es incompleta en un tercero.** «Años sin balance encontrado: 2013, 2014, 2015 y 2016» → 2016 está (columna comparativa de los EEFF 2017). «2024 … no se pudo leer» → 2024 se lee. Y para 1952-2010 la ficha no dice nada: el inventario del sitio de AFE empieza en 2012, pero la regla de presentación 3 obliga a que la línea de cobertura diga desde cuándo existe la empresa y qué se va a cargar. Confirmo, en cambio, lo que sí es cierto: **2013, 2014 y 2015 no tienen estados contables en el inventario**; leí `MEMORIA-2014-.pdf` y `MEMORIA-2015.pdf` y son memorias operativas (tráfico de pasajeros, toneladas por producto), sin estado de resultados ni nota de patrimonio.
3. **Repositorios que el brief nombraba y no se consultaron**: `ain.gub.uy` (0 menciones en `consultas.jsonl`), pese a que el propio dictamen del TCR sobre 2024 constata el incumplimiento del artículo 190 de la Ley 19.438 «Publicación de estados financieros en AIN», lo que sugiere que la AIN es el lugar donde deberían estar; y la búsqueda en el Tribunal de Cuentas se hizo sobre «la muestra revisada» de una página de resultados. Para 2013-2016 quedan sin probar el Diario Oficial (artículo 191 de la Constitución) y la Hemeroteca del Parlamento.
4. **Dependencia de un solo grupo**: no aplica en el sentido habitual, porque el peso de la ficha son documentos oficiales de la propia empresa. Pero de las cuatro fuentes de prensa, tres son uruguayas de grupos distintos (la-diaria → `cooperativa-la-diaria`; el-observador → `werthein-hochbaum`) y una es argentina (ambito → `grupo-ambito`), y **la única fuente de un argumento en contra es esa nota argentina**. Ningún hecho de la ficha depende de una sola nota salvo el canon de 0,005 (objeción 19) y el acuerdo de US$ 144 M (dos grupos, correcto).
5. **Simetría entre gobiernos**: el marco legal cubre bien 1952-2022 y no encuentro sesgo en la selección de normas (Batlle 2000, Vázquez 2005, Mujica 2011, Vázquez II 2015, Lacalle Pou 2022, Orsi 2025). El desbalance está en los hitos, no en las leyes: siete hitos entre 2000 y 2025, ninguno entre 1976 y 1999, faltando justo el cierre del servicio de pasajeros (1988) y la declaración de media red como no operativa (1990). Corregido eso (objeción 16), la línea de tiempo queda pareja. Del mismo modo, la exigencia de documento previsible del punto 14 vale para los dos lados: la versión taquigráfica del sindicato y el informe de la Unidad de PPP del MEF.
6. **Verificación en red pendiente**: `pnpm validar --inbox` da 0 errores de esquema y 24 de referencias, todos por los tres medios que faltan (`afe`, `mtop`, `union-ferroviaria`), declarados en `notas.md`. La cita mal atribuida de la objeción 3 la habría cazado `pnpm validar:red`; conviene correrlo antes de que el editor toque nada, porque puede haber otras.

## Objeciones al brief

Ninguna violación de la Regla 0. El brief pide explícitamente el mismo esfuerzo por lado, advierte que «un dirigente que defiende una regla no es un argumento en contra de esa regla» y ordena documentar los dos lados del Ferrocarril Central. El investigador declaró «ninguna» objeción al brief y coincido.

Con una salvedad de diseño, que no es asimetría partidaria pero sí un empujón que se materializó: el brief dice «para esta empresa lo que el Estado pone es la cifra principal» e instruye registrar «cada aporte anual». Es correcto como prioridad, y a la vez es el incentivo que llevó a meter en `capitalizaciones_del_estado` el FOCEM y una subcuenta de origen desconocido (objeciones 2 y 4), es decir, a inflar precisamente la cifra que el brief marcó como principal. La versión simétrica, para este brief y para el de cualquier otra empresa: «registrá lo que el Estado puso, separando lo que no vino del Estado; una capitalización cuyo origen el balance no explica no se carga, se anota en `hipotesis`». Y una nota menor: el brief pide `finanzas[]` «un ítem por año 2015-2024»; el lote entregó 2011-2012 y 2017-2023, o sea siete de los diez años pedidos, y de los tres faltantes dentro del rango dos son alcanzables hoy (2016 y 2024) y uno no (2015).

## Discrepancias

No escribo `discrepancias.yaml` en este lote. Releí las cuatro notas de prensa y las cuatro citas son literales y contiguas; las diferencias que encontré son entre la ficha y los documentos primarios (objeciones 1, 3, 5, 6), no entre un medio y un documento. Para registrar una discrepancia haría falta el documento que decide —el informe de la Unidad de PPP del MEF, el texto del acuerdo con Grupo Vía Central o la resolución que fija el canon—, y ninguno se leyó. Que Ámbito y El Observador cuenten el diferendo con énfasis distintos es un desacuerdo de cobertura, no una discrepancia, y va acá y no a esa colección.

## Cobertura

```yaml
- medio: ambito
  url: https://www.ambito.com/uruguay/el-gobierno-avanza-un-acuerdo-el-ferrocarril-central-aunque-preocupa-el-monto-la-deuda-n6137962
  fecha: 2025-04-24
  evento: "propuesto:ferrocarril-central-ppp"
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Presenta la decisión de no pagar como fundada en un informe técnico y a la vez
    recoge que ese informe cuestiona el contrato de su gobierno, sin adjetivar en
    ninguna de las dos direcciones: "se conoció un informe elaborado por la Unidad de
    Participación Público-Privada del Ministerio de Economía y Finanzas (MEF) —uno de
    los insumos principales para que Lacalle Pou decidiera no pagar—, el cual señala
    debilidades en la elaboración del contrato que firmó el Ministerio de Transporte y
    Obras Públicas (MTOP), así como en su accionar".

- medio: la-diaria
  url: https://ladiaria.com.uy/politica/articulo/2024/4/en-inauguracion-de-la-obra-del-ferrocarril-central-en-florida-lacalle-pou-dijo-que-hacia-adelante-esta-el-sueno-del-tren-de-pasajeros/
  fecha: 2024-04-16
  evento: "propuesto:ferrocarril-central-ppp"
  politico: lacalle-pou
  tono: desfavorable
  justificacion: >-
    La crónica del acto oficial del presidente lo encuadra como un festejo y se detiene
    en el menú de los invitados: "La fiesta, formalmente anunciada como el 'inicio del
    proceso de puesta en marcha integrada', fue en Cardal, capital de la cuenca lechera,
    en la zona sur del departamento de Florida, aunque no necesariamente fue para los
    anfitriones. En la carpa montada en el predio de la estación del ferrocarril hubo
    espacio suficiente para los más de 400 comensales, que, apenas al sentarse, pudieron
    ver en sus platos el menú que anunciaba una entrada de boniato asado con queso de
    cabra". Salvedad para la auditoría: la nota tiene muro de pago y solo fueron
    legibles los primeros 1.551 caracteres, así que el tono cubre la parte visible.

- medio: la-diaria
  url: https://ladiaria.com.uy/politica/articulo/2025/5/gobierno-acordo-pagos-por-144-millones-de-dolares-al-consorcio-responsable-del-ferrocarril-central/
  fecha: 2025-05-19
  evento: "propuesto:ferrocarril-central-ppp"
  politico: orsi
  tono: neutral
  justificacion: >-
    Informa el acuerdo con el alcance y el efecto, sin valoración: "El acuerdo comprende
    el período que va del 24 de diciembre de 2023 al 31 de marzo de 2025, y 'saca' al
    Estado de los 'titulares de arbitraje internacional' anunciados por el consorcio en
    febrero".

- medio: el-observador
  url: https://www.elobservador.com.uy/nacional/ferrocarril-central-gobierno-celebra-acuerdo-mas-barato-el-pais-y-fija-canon-locomotoras-upm-n6000197
  fecha: 2025-05-20
  evento: "propuesto:ferrocarril-central-ppp"
  politico: orsi
  tono: neutral
  justificacion: >-
    Da los argumentos del gobierno entrecomillados y marca por su cuenta que también
    hubo reproche político, sin respaldarlo ni desmentirlo: "en los que el nuevo
    gobierno pasó unos cuántos rezongos a la administración saliente".

- medio: el-observador
  url: https://www.elobservador.com.uy/nacional/ferrocarril-central-gobierno-celebra-acuerdo-mas-barato-el-pais-y-fija-canon-locomotoras-upm-n6000197
  fecha: 2025-05-20
  evento: "propuesto:ferrocarril-central-ppp"
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    La misma nota recoge la posición del gobierno saliente con sus fundamentos y en sus
    términos: "Falero recriminaba a Grupo Vía Central que ya en dos ocasiones (en 2021 y
    en 2023) habían incumplido las condiciones acordadas, como ser la finalización de
    todas las obras para diciembre de 2023".

- medio: presidencia
  url: https://www.gub.uy/presidencia/comunicacion/noticias/ferrocarril-central-prepara-inicio-actividades-para-primer-cuatrimestre-2024
  fecha: 2024-01-10
  evento: "propuesto:ferrocarril-central-ppp"
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Gacetilla de la comunicación presidencial que transmite lo que informó el ministro
    sin calificarlo: "El 4 de diciembre se realizó el primer viaje de prueba de la
    locomotora que, con vagones vacíos, se trasladó desde el puerto de Montevideo al
    pueblo Centenario". Se registra por criterio simétrico: si se mide el tono de la
    prensa privada, también se mide el de la comunicación estatal.
```

No emito registro de tono para `unionferroviaria.uy`: es la página institucional de un sindicato, no una nota de prensa, y el medio todavía no existe en `content/medios/`.
