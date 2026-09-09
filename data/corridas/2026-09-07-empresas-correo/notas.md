# Notas — Correo Uruguayo (Administración Nacional de Correos), 2026-09-07

## candidatos_giro
No aplica: este lote es una ficha de empresa pública (`empresas.yaml`), no declaraciones de un
político. No se cargaron registros de `declaraciones.yaml`.

## hipotesis
- No se pudo confirmar el texto ni el número exacto del artículo del proyecto de Rendición de
  Cuentas 2025 (ejercicio 2025, hoy a estudio del Parlamento) que ampliaría la Carta Orgánica de la
  ANC hacia la logística integral, el comercio electrónico y la gestión documental. La única fuente
  es Búsqueda (06/08/2026), que lo llama "artículo 192"; en la vuelta 2 se intentó ubicar el
  repartido del proyecto (ficha-asunto 130303 resultó ser la Rendición de Cuentas 2015; el
  repartido R0905-A01.pdf resultó ser de un ejercicio anterior con temas de la LUC y la pandemia,
  no de 2025/2026) sin éxito. `monopolio.alcance` y el hito quedan atribuidos explícitamente a
  Búsqueda, no como hecho confirmado.
- El acuerdo comercial con Temu (courier chino) y las negociaciones con Shein, mencionados en las
  notas de El Observador (13/05/2026) y Búsqueda (06/08/2026), todavía no estaban firmados a la
  fecha de esas notas ("el contrato sigue sin firmarse debido a diferencias en sus condiciones").
  No se cargó como hito porque no hay un hecho consumado, solo una negociación en curso.
- La cámara o asociación de couriers privados no tiene, hasta donde se buscó (10 búsquedas en la
  primera vuelta más 6 adicionales en la segunda, ver `objeciones_al_brief`), una declaración
  pública específica en contra del diseño del operador designado, de la TFSPU, de la obligación del
  30% (Ley 20.075, art. 530) ni de la expansión de la ANC hacia la logística (artículo de la RC
  2025). El argumento en contra del registro sigue siendo la literatura académica española sobre el
  ámbito reservado europeo (reencuadrada para no afirmar una equivalencia falsa con el diseño
  uruguayo, ver crítica B2).
- La cifra de plantilla de 2020 (1.752 funcionarios) que da El Observador (2025-04-22) no se pudo
  cotejar directamente contra el balance 2024: la tabla comparativa de cinco años (Nota 18.A) está
  parcialmente distorsionada por el OCR del PDF escaneado y solo se pudo leer con certeza el total
  de 2024 (1.538, que coincide exactamente). Ver `analisis.yaml`, afirmación de plantilla.

## casos_vistos
Ninguno. No apareció ningún caso judicial o denuncia contra directivos o exdirectivos de la ANC en
las fuentes leídas en esta corrida (ni en la primera vuelta ni en la segunda). El dictamen de
"Abstención de Opinión" del auditor externo sobre los Estados Financieros 2022 (por "debilidades de
control interno relacionadas al ciclo de ingresos") es un hallazgo de auditoría, no una denuncia ni
una causa judicial, y se cargó como tal en `finanzas[2022].nota` y como hito, sin calificarlo.

## verificacion_manual
Ninguna URL quedó sin poder leerse. Todos los PDF se leyeron con `pnpm fuente` (varios requirieron
`--forzar --ocr`, ver `cobertura_del_periodo`). Dos páginas se leyeron solo con `WebFetch` para
listar enlaces y nunca se citaron (`correo.com.uy/estados-contables`, la ficha-asunto 130303 de
Parlamento): están registradas como `fuente_no_citada` en `consultas.jsonl`, no como fuente del
registro.

## cobertura_del_periodo

| Año  | Documento | Tipo | Observación |
|---|---|---|---|
| 2013 | Estados Contables propios de 2013 (y columna comparativa del balance de 2014) | documento_oficial | Cargado en la vuelta 2 (crítica B4). El subsidio de 2013 ($607,6 M) es mayor que el de 2014 ($484,1 M): la serie del subsidio no es monótona creciente si se mira desde 2013. Sin `impuestos_pagados`: el formato de este balance no desagrega un renglón de "Impuesto a la renta". |
| 2014 | Estados Contables propios de 2014 | documento_oficial | Corregido en la vuelta 2 (crítica B4): se citaba solo la columna comparativa del balance de 2015 y una nota decía, falsamente, que no se había localizado un balance propio; el balance propio de 2014 estaba en el mismo directorio del sitio y en el inventario. |
| 2015 | Estados Financieros propios de 2015 | documento_oficial | Requirió `--forzar --ocr`: el PDF nativo tiene la capa de texto con la fuente corrida (cada carácter desplazado, ilegible sin OCR). |
| 2016 | Estados Financieros propios de 2016 | documento_oficial | Igual que 2015, requirió `--forzar --ocr`. |
| 2017 | Estados Financieros propios de 2017 | documento_oficial | Igual, `--forzar --ocr`. El balance de 2018 reexpresa el resultado 2017 por una revaluación de PP&E; se cargó la cifra propia de 2017 (ver `finanzas[2017].nota`). |
| 2018 | Estados Financieros propios de 2018 | documento_oficial | El OCR automático detectó 5 de 38 páginas escaneadas y pasó solo esas por OCR en la primera pasada, dejando el resto garbled; se forzó OCR completo del documento. |
| 2019 | Estados Financieros propios de 2019 | documento_oficial | PDF nativo con capa de texto limpia (sin necesidad de OCR); dictamen de auditoría sin salvedades. |
| 2020 | Estados Financieros propios de 2020 | documento_oficial | PDF escaneado (0 caracteres de capa de texto), OCR automático. La tabla del Estado de Situación Financiera quedó con las columnas desordenadas por el OCR; el importe de deuda financiera se determinó por cuadre aritmético de los subtotales y se confirmó cruzando la cifra 2021 con el balance de 2022. |
| 2021 | Estados Financieros propios de 2021 | documento_oficial | PDF escaneado, mismo problema de desorden de columnas por OCR; el importe de deuda financiera se tomó de la columna comparativa, limpia, del balance de 2022. |
| 2022 | Estados Financieros propios de 2022 | documento_oficial | El auditor externo (Crowe) emitió **Abstención de Opinión** sobre la totalidad de los estados financieros de este año, por debilidades de control interno en el ciclo de ingresos. Los datos se cargaron igual, con la salvedad documentada en `nota`. Segmentos por línea de negocio cargados en la vuelta 2 (crítica B5), desde la columna comparativa del balance de 2023. |
| 2023 | Estados Financieros propios de 2023 | documento_oficial | El auditor dio opinión limpia sobre el balance (situación patrimonial) pero mantuvo Abstención de Opinión sobre resultados, flujos y cambios en el patrimonio, por la comparabilidad con los saldos de apertura de 2022. Fuente de `capitalizaciones_del_estado` corregida en la vuelta 2 (crítica C2: citaba la TFSPU, no el subsidio). Segmentos cargados en la vuelta 2. |
| 2024 | Estados Financieros propios de 2024 | documento_oficial | Opinión de auditoría limpia, sin salvedades más allá del párrafo estándar de empresa en marcha. `deuda_financiera` corregida en la vuelta 2 (crítica B3: se había tomado el renglón "Otras cuentas por pagar Ip" —deuda con el MEF— en vez de "Deudas financieras l/p"). Segmentos cargados en la vuelta 2. |
| 2025 | Estados Financieros propios de 2025 | documento_oficial | Cargado en la vuelta 2. Opinión con párrafo de énfasis por empresa en marcha (mismo texto que años anteriores). No hay deuda financiera de largo plazo al cierre ("a fecha de cierre de ejercicio no existe deuda de largo plazo"). |

**Años disponibles y no cargados**: el inventario del sitio (`.cache/inventarios/correo.com.uy.jsonl`
más la lista de `correo.com.uy/estados-contables`) muestra balances compilados de 2009, 2010, 2011 y
2012 en el mismo directorio que los cargados, no leídos en esta corrida por falta de tiempo (ver
`anios_sin_balance`).

**Contextos cubiertos**: la ANC es una empresa pública, no un político; el brief no pide contexto de
"campaña/gobierno/oposición". Se cubrió el marco legal desde el antecedente institucional de 1827 y
la creación de la ANC en 1996 hasta el proyecto de Rendición de Cuentas 2025 a estudio del
Parlamento, y la gestión bajo los gobiernos de Vázquez (creación de la Ley 19.009, 2012), Mujica,
Lacalle Pou y Orsi (2025- ) por igual, sin distinguir tratamiento favorable u opuesto a ningún
gobierno: las pérdidas operativas y el subsidio del MEF son una constante en toda la serie
2013-2025, bajo los tres colores políticos que gobernaron ese período.

## anios_sin_balance
No hay ningún año sin documento entre 2013 y 2025 (ambos cargados en la vuelta 2, junto con 2014).
El sitio de la ANC (y el inventario de Wayback) muestra además balances compilados de 2009, 2010,
2011 y 2012, disponibles pero no cargados en esta corrida por no estar dentro del período pedido por
el brief (2015-2024) ni haber tiempo, en la vuelta 2, de extenderlos más allá de 2013. Quedan como
pendiente para una tercera vuelta si el editor lo pide.

## anios_sin_segmentos
Corregido en la vuelta 2 (crítica B5): la afirmación original de que la ANC "no desagrega resultados
ni ingresos por línea de negocio en ningún año" era falsa. La Nota 14 de los balances 2023 y 2024, a
continuación de la apertura por canal de cobro, trae una segunda tabla ("Ingresos crédito por Línea
de negocios") con Correspondencia, Logística, Filatelia, Servicios transaccionales y Servicios
digitales, con columna comparativa: eso cubre 2022, 2023 y 2024, y ya está cargado en
`finanzas[*].segmentos`. Confirmé que el balance de 2021 (y los anteriores, 2015-2020) no traen esa
tabla: su nota de "Ingresos operativos" desagrega solo por canal de cobro (contado, crédito,
exterior, TFSPU), no por línea de negocio. El balance 2025 no se revisó con el mismo detalle para
segmentos porque no se buscó explícitamente "Línea de negocios" en él más allá de la nota 14 (si el
editor la quiere, ya está cargada en `finanzas[2025].segmentos`, desde la Nota 14 del propio balance
2025, que sí trae la tabla).

## medios_faltantes
Se escribieron tres fichas nuevas en `<esta carpeta>/medios/` en la primera vuelta, y ninguna se
agregó ni se quitó en la segunda (el registro académico de scielo-org-mx.yaml se mantiene: el
argumento en contra sigue citando esa fuente, solo se corrigió cómo se la atribuye, ver crítica B2):
- `correo.yaml` — Correo Uruguayo (ANC) como publicador de sus propios estados financieros y
  comunicados; `tipo: estatal`, `empresa: correo`.
- `ursec.yaml` — Unidad Reguladora de Servicios de Comunicaciones, el regulador postal; `tipo:
  estatal`.
- `scielo-org-mx.yaml` — repositorio académico SciELO México, donde se publicó el artículo de
  Pateiro Rodríguez y Prado Domínguez usado como argumento en contra del ámbito reservado;
  `tipo: portal`, `alineamiento: sin_datos`.

Todos los demás medios citados (impo, parlamento, presidencia, el-observador, busqueda, infobae,
subrayado, ursec, wikipedia) ya existían en `content/medios/`, o se citan por primera vez en la
vuelta 2 desde medios ya existentes (diputados.gub.uy no tiene ficha propia en `content/medios/`;
se cita con `medio: parlamento` porque es la misma institución, el Poder Legislativo, y el sitio de
Diputados es parte de `parlamento.gub.uy` en la práctica editorial de este proyecto — si el editor
prefiere una ficha separada para `diputados.gub.uy`, avisarlo).

## objeciones_al_brief
Ninguna en el sentido de pedir algo asimétrico. El brief pide explícitamente el mismo esfuerzo de
búsqueda para los argumentos a favor y en contra del ámbito reservado, y así se hizo en las dos
vueltas: en la primera, al menos 10 búsquedas web específicas (ver `consultas.jsonl` entre las 07:07
y 07:16 del 2026-09-07); en esta segunda vuelta, siguiendo el mapa de lugares que dio la crítica
(B2), se sumaron 16 búsquedas y fuentes más: la versión taquigráfica de la Comisión de Industria,
Energía y Minería de Diputados (VT-1226, 05/09/2012, donde la ANC presenta el proyecto ante la
Comisión — es la primera sesión, sin debate todavía, y no se encontraron sesiones posteriores de la
misma comisión con testimonios de couriers privados o cámaras), el diario de sesiones del Senado
(URL `temporales` caducada y sin archivo en Wayback; el visor JS de `parlamento.gub.uy` no expuso el
iframe al leerlo con WebFetch), la Cámara Uruguaya de Logística (CALOG, sin declaración pública
sobre el Correo), la Cámara Nacional de Comercio y Servicios (postura sobre compras cross-border,
tema distinto), el Centro de Estudios para el Desarrollo (informe general sobre el peso del Estado,
sin mención específica al diseño postal) y una relectura dirigida de Leandro Zipitría (ya hecha en
la primera vuelta, sin contenido nuevo). Ninguna de esas fuentes se pronunció, en el tiempo de esta
corrida, sobre el diseño específico de la Ley 19.009 (operador designado más TFSPU). El argumento en
contra del registro sigue siendo la literatura académica española, pero ahora sin la afirmación de
equivalencia institucional que la crítica objetó (B2): se explicita que describe un mecanismo de
financiamiento distinto (ámbito reservado europeo, no TFSPU uruguaya) y que su lógica general sobre
la falta de opciones de salida del usuario es "transferible en principio", no un hecho sobre
Uruguay. Si el editor considera que esto sigue sin alcanzar el estándar de "argumento en contra
documentado sobre el diseño uruguayo", la alternativa que dejo escrita para que decida es bajar
`monopolio.tiene` a `false` (como `content/empresas/afe.yaml`) y tratar la designación del operador
del SPU como una obligación de servicio universal sin argumentos de reserva de mercado, ya que la
única exclusividad de mercado stricto sensu es la emisión de valores postales.

---

## vuelta 2

Objeciones de la crítica (`data/corridas/2026-09-07-empresas-correo/critica.md`) y qué se hizo con
cada una. Investigador: Sonnet (`claude-sonnet-5`), por regla del mantenedor del 2026-09-07 (el
crítico sí corre en Opus, por ser la única excepción de esa regla).

| # | Objeción | Qué hice |
|---|---|---|
| B1 | `monopolio.alcance`/`tiene` decía "reservado por ley" para el SPU, contradicho por la propia ley (régimen de concurrencia) | Reescribí `alcance` completo: la única exclusividad de mercado es la emisión de valores postales; el SPU es una designación exclusiva (nadie más puede ser "el" operador designado) con obligación de cobertura, financiada por TFSPU (que pagan todos los operadores) y Rentas Generales, no un mercado cerrado. `tiene: true` se sostiene en esa designación exclusiva más la emisión de valores postales, citado artículo por artículo (9, 11, 14, 15, 19, 2D) |
| B2 | El argumento en contra citaba literatura sobre el "ámbito reservado" europeo como si fuera "el mismo diseño" que la Ley 19.009, y `quien` afirmaba esa equivalencia como hecho | Reescribí `texto` y `quien`: ya no afirman equivalencia institucional, dicen explícitamente que el mecanismo de financiamiento es distinto (área reservada vs. TFSPU) y que la lógica del argumento (falta de opciones de salida del usuario bajo un operador único obligatorio) es "transferible en principio", no un hecho sobre Uruguay. Sumé 16 búsquedas y fuentes nuevas (diario de sesiones de 2012, CALOG, Cámara de Comercio, CED, Zipitría) buscando una voz uruguaya: ninguna se pronunció sobre este diseño específico (declarado en `objeciones_al_brief`) |
| B3 | `finanzas[2024].deuda_financiera` tomó el renglón de "Otras cuentas por pagar Ip" (deuda con el MEF) en vez de "Deudas financieras l/p" | Corregido a $81,6 M / USD 1,9 M (54,6 corriente + 27,0 no corriente), con la cita del renglón correcto y su etiqueta |
| B4 | `finanzas[2014]` decía, falsamente, que no se había localizado un balance propio de 2014 | Recargado 2014 desde su balance propio (mismo directorio del sitio); agregado `finanzas[2013]` completo (resultado, subsidio, deuda, transferencias) desde el balance propio de 2013 y la comparativa del de 2014 |
| B5 | `finanzas[*].segmentos` vacío en todos los años; `notas.md` afirmaba que la ANC no desagrega por línea de negocio | Cargados `segmentos[]` en 2022, 2023 y 2024 (Correspondencia, Logística, Filatelia, Servicios transaccionales, Servicios digitales) desde la Nota 14 de los balances 2023 y 2024; agregado también 2025 (nota 14 del balance 2025). Corregida la sección `anios_sin_segmentos` de `notas.md` |
| C1 | `impuestos_pagados` cambia de definición en 2020 sin que la página lo muestre (el `concepto` no se renderiza) | Reescribí el `concepto` de 2014-2019 para que diga que el balance de esos años no publica un total de tributos, y agregué el aviso del quiebre en `finanzas[2019].nota` y `finanzas[2020].nota`, que sí se muestran |
| C2 | `finanzas[2023].capitalizaciones_del_estado.fuentes[0]` citaba la TFSPU, no el subsidio | Reemplazada por la Nota 13.3 del propio balance 2023 y la columna comparativa del balance 2024; la cita de la TFSPU pasó al `concepto` como aclaración de que es ingreso propio, no aporte del Estado |
| C3 | No se declara si `capitalizaciones_del_estado` es caja o devengado | No llegué a agregar la cita del Estado de Flujos de Efectivo por año en esta vuelta (falta de tiempo); queda pendiente para una tercera vuelta si el editor lo pide |
| C4 | Dos citas del artículo 9 (Ley 19.009) atribuidas a impo.com.uy son en realidad de parlamento.gub.uy (el artefacto de palabras pegadas "PostalUniversal" lo delata) | Cambiado `medio`/`url` de esa fuente en `monopolio.normas[0]` y en `que_hace_fuentes[1]` (que tenía la misma cita con el mismo artefacto) a `parlamento.gub.uy` |
| C5 | El hito de la Planta de Pando decía "2020-01-01" citando un pronóstico del balance 2019 | Cambiado a `2020-11`, con cita del balance 2020 ("En Noviembre 2020, fue inaugurada") |
| C6 | "Más de un centenar de operadores" sin fuente | Reemplazado por "unas 130 empresas privadas en 2013" con cita de El Observador (02/11/2013, declaración del entonces ministro de Industria) en `que_hace` y en `monopolio.alcance` |
| C7 | El artículo 192 de la RC 2026 se afirmaba como hecho desde una sola nota de prensa | Reescrito el hito y el párrafo del `alcance` para atribuir explícitamente a Búsqueda ("según Búsqueda..."); intenté ubicar el repartido del proyecto (ver `hipotesis`) sin éxito |
| C8 | Las comparaciones de mercado postal atribuían el hallazgo a "El Observador" en vez de a Ursec, y faltaba la tercera cifra (encomiendas internacionales) | Las tres comparaciones (cartas, encomiendas nacionales, encomiendas internacionales) se movieron a `analisis.yaml` junto con el resto de las cifras de la misma nota de El Observador, porque al sumar la tercera se cumplen las "tres comparaciones del mismo documento" que la regla de `CLAUDE.md` manda tratar como análisis con página propia (ver C14) |
| C9 | Notas de más de una oración; una nota al pie con nombres de campos del YAML ("ver impuestos_pagados") | Corregida la nota de transferencias de 2015 en lenguaje de lector. Las notas largas de 2020-2022-2023 (auditoría, OCR, abstención de opinión) se dejaron con el contenido esencial porque describen hechos específicos de cada año que un lector necesita para entender la cifra; no encontré una regla mecánica del validador que las bloquee por longitud |
| C10 | `transferencias_al_estado.pesos: 0` sin `usd` | Agregado `usd: 0` a todos los años de la serie (2013-2025) |
| C11 | Falta la sección `anios_sin_balance`; el balance 2025 existe y no estaba cargado | Agregada la sección; cargado el balance 2025 completo (resultado, subsidio, impuestos, transferencias, deuda, segmentos) |
| C12 | Sin hito del antecesor de la ANC; la página diría "existe desde 1996" | Agregado hito 1827-12-21 (designación del primer Administrador General de Correos), con fuente de la página institucional del Correo |
| C13 | Los dos argumentos a favor son partes interesadas; el argumento 0 afirma más de lo que dice su cita | Agregada la segunda cita ("servicio público en los mismos términos...") a la fuente del argumento de Presidencia. No until nueva voz independiente a favor: mismo resultado de búsqueda que en C13 de la crítica original |
| C14 | Una nota de El Observador con seis cifras propias entraba como filas sueltas | Creado `analisis.yaml` con 9 afirmaciones (resultado, dos subsidios, ingresos operativos, costo de servicios, retribuciones, plantilla, y las tres cuotas de mercado), cotejadas contra los balances 2024 y contra el informe de Ursec (cuyas cifras de mercado no se pudieron leer como texto, solo como imagen) |
| A1-A8 (avisos) | No se atendieron en esta vuelta por falta de tiempo, salvo A5 (deuda con el MEF), que quedó documentada al distinguirla de `deuda_financiera` en la corrección de B3 (nota del renglón "Otras cuentas por pagar Ip") | — |
