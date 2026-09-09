# Crítica — corrida 2026-09-07-empresas-alur

Modelo: Opus 5 (`claude-opus-5[1m]`). Es el único rol que corre en Opus por la regla de modelos del
mantenedor (CLAUDE.md, 2026-09-07); el investigador declaró `claude-sonnet-5`, que es lo que la tabla
de roles espera. No hay desvío que reportar.
Lote: `inbox/empresas/alur/2026-09-07/`
Registros revisados: 1 registro de `empresas.yaml` (ALUR) + `medios/alur.yaml` + `notas.md` + `consultas.jsonl`
Documentos releídos en esta sesión con `pnpm fuente`: balances individuales de ALUR 2015, 2016, 2017,
2018, 2019, 2020, 2021, 2022 y 2024 y el índice `alur.com.uy/en/balances`; EEFF individuales de ANCAP
2024; presentaciones de resultados de ANCAP 2020, 2021 y 2024; Ley 18.195 en IMPO; informe de la
Comisión Investigadora del Senado sobre ANCAP; Memoria del Poder Ejecutivo 2000; las dos notas de
prensa del lote.

Resumen: la aritmética de la ficha está bien (verifiqué los diez años uno por uno) y las citas son
literales. Lo que falla es de otro tipo: **falta el dato que el propio balance publica** (segmentos),
**falta el hecho legal que cambió el negocio en 2021** (la derogación del artículo 7) y **el recorte
2015-2024 esconde, sin decirlo, catorce años que la empresa publica y donde está casi todo lo que el
Estado puso**.

## Tabla resumen

| # | Campo | Severidad | Tipo | En una línea |
|---|---|---|---|---|
| B1 | `finanzas[].segmentos` (10 años) | bloquea | presentacion | La nota "Ingresos/Egresos desagregados por división" existe desde el balance 2019; `notas.md` afirma que no existe en ningún año |
| B2 | `monopolio.alcance`, `hitos[]`, `argumentos_en_contra` | bloquea | contexto_omitido | La Ley 19.996 (3/11/2021) **derogó** el artículo 7 (mezcla obligatoria de biodiésel); la ficha lo presenta como propuesta pendiente |
| B3 | cobertura de `finanzas[]` | bloquea | asimetria | Cargado 2015-2024 sin decirlo, con balances 2006-2025 vivos en el sitio de ALUR y las capitalizaciones concentradas antes de 2015 |
| C1 | `creacion.norma` | corregir | contexto_omitido | Anacronismo: en 1999 el socio de ANCAP era la CND; PDVSA compró ese paquete el 12/11/2007 |
| C2 | `hitos[]` | corregir | presentacion | Faltan Bella Unión (1/2/2006), las cuatro plantas, la entrada de PDVSA, la investigadora del Senado y la Ley 19.996 |
| C3 | `capitalizaciones_del_estado` | corregir | presentacion | Cero solo en 2016 y con "ver notas.md" en un campo público; 2017-2024 ausentes cuando el balance dice que no hubo |
| C4 | `resultado_ejercicio.usd` 2015-2021 | corregir | contexto_omitido | Moneda funcional dólar desde 2014: para 2021 el balance publica US$ 4.693.887 y la ficha trae 4,4 |
| C5 | `finanzas[2019]`, `finanzas[2022]` | corregir | presentacion | Cargados de la comparativa con el balance propio publicado y vivo; el `concepto` publica una explicación de proceso |
| C6 | `fuentes[].url` de 2015-2021 | corregir | presentacion | Wayback como URL canónica cuando el sitio sirve hoy los mismos PDF |
| C7 | `impuestos_pagados` (citas y concepto) | corregir | presentacion | La cita es un par de números sin el renglón que los nombra; el concepto de 2019 mete nueve tributos en una celda |
| C8 | `comparaciones[0]` | corregir | cita_fuera_de_contexto | El "salvo 2014" del informe es sobre el traslado a tarifa, no sobre la diferencia de precio; y el autor impreso será "En Perspectiva" |
| C9 | `comparaciones[]` / falta `analisis.yaml` | corregir | presentacion | Rossa cuantifica el sobrecosto en U$ 48,5/58,7/92,3 M (2012-2014): tres cifras de una fuente = página propia |
| C10 | `precios_vs_paridad` (ausente) | corregir | presentacion | ANCAP publica el precio por planta y por año; la hipótesis de `notas.md` se resuelve por orden de series |
| C11 | `monopolio.argumentos_*` | corregir | asimetria | A favor: 2007 y 2015; en contra: 2021 y 2021. Nadie defiende el diseño en el momento en que se discutió eliminarlo |
| C12 | `argumentos_en_contra[0]` | corregir | un_solo_grupo | El informe del MIEM fue elevado a la Asamblea General: es documento previsible y se cita por una sola nota |
| C13 | `monopolio.alcance` | corregir | presentacion | 1.215 caracteres, con caracterización propia ("comprador cautivo") y sin el mecanismo de precio que ANCAP publica |
| C14 | `que_hace` | corregir | contexto_omitido | "Vende a ANCAP la totalidad" en presente, apoyado en una cita de 2008 cortada a mitad de frase |
| C15 | `concepto`/`nota` de varios años | corregir | presentacion | Párrafos en celdas, dos remisiones a `notas.md` (privado) y una mención a El Observador sin fuente |
| C16 | `fuentes[]` general | corregir | presentacion | Una sola fuente cuya cita es una lista de enlaces |
| A1 | `notas.md#hipotesis` (2) | aviso | sin_objecion | La hipótesis es una mala atribución de lámina: ANCAP confirma la serie de ALUR, no la contradice |
| A2 | informe del Senado vs. balances | aviso | contexto_omitido | El informe dice "más del 95%"; los balances dicen 90,79% desde 2007 |
| A3 | `deuda_financiera[2024]` | aviso | presentacion | El cero es correcto pero conviene decir que no incluye deuda comercial ni con partes relacionadas |
| A4 | `notas.md#medios_faltantes` | aviso | presentacion | Dice que creó `en-perspectiva.yaml`; ya existe en `content/medios/` y no está en la carpeta |
| A5 | `medios/alur.yaml` | aviso | sin_objecion | Sigue la convención de ancap/ute; solo faltaría `dominios` con la variante sin `www` |
| A6 | anticipos a productores de caña | aviso | contexto_omitido | $ 616,8 M previsionados sobre $ 928,3 M anticipados (2021): dato central de Bella Unión que no está en ningún campo |

Totales: **3 bloquea, 16 corregir, 6 aviso** (25 objeciones).

## Objeciones por campo

### B1 — `finanzas[].segmentos` (los diez años) y `notas.md#anios_sin_segmentos`
- severidad: **bloquea**
- tipo: presentacion
- objecion: `notas.md` afirma "Ningún año 2015-2024: los estados financieros individuales de ALUR no
  traen una nota de «información por segmentos» (NIIF 8) que desagregue resultado o ingresos por
  azúcar/etanol/biodiésel/energía/alimento animal" y que la nota 6 "desagrega ingresos por mercado
  geográfico… no por producto". Las dos afirmaciones son falsas. Los balances traen **dos** cortes por
  negocio, y el diccionario de campos nombra exactamente el que usan ("«desagregado por división» en
  balances viejos"). Con `segmentos` vacío la página no tiene nada que prender y la ficha de una
  empresa de cuatro productos no dice cuál gana y cuál pierde.
- cita_de_contexto (nota por división, balance 2020, notas 28.3 y 28.4, con columnas 2020 y 2019):
  "28.3 Ingresos desagregados por división … Concepto Biocombustibles, Coproductos y Derivados |
  Alcoholes y Solventes | Otros … Ingresos netos 8.432.010.577 354.037.787 2.830.592 7.663.144.612
  143.658.183 3.028.241" y "28.4 Egresos desagregados por división … Costo de ventas 7.150.969.133
  264.309.003 7.534.862 6.346.534.172 101.994.740 11.203.700"
  (https://web.archive.org/web/20210511064840id_/http://www.alur.com.uy/empresa/balances/balance-2020.pdf).
  La misma nota está en el balance 2021 (28.3/28.4, columnas 2021 y 2020), en el balance 2022
  (28.3, en dólares y en pesos, columnas 2022 y 2021,
  https://www.alur.com.uy/sites/default/files/balance-2022_0.pdf) y en el balance 2024 (26.3 y 26.4,
  columnas 2024 y 2023).
- cita_de_contexto (nota por línea de producto, balance 2024, nota 6): "En la siguiente tabla se
  desagregan los ingresos por las principales líneas de productos: … Biocombustibles 135.102.481
  159.134.843 130.873.255 154.590.550 / Azúcar 19.416.529 22.291.829 1.649 560 / Alimento animal
  34.824.029 36.744.743 - - / Alcoholes y solventes 5.077.662 4.812.272 95.768 95.576 / Otros
  25.324.415 38.625.138 2.624.820 3.775.143"
  (https://www.alur.com.uy/sites/default/files/ALUR%20individual%20-%20Informe%2031.12.2024-ptg.pdf).
  La misma tabla está en 2019, 2020 y 2021.
- comprobación aritmética: en 2024 la nota por división cierra con el resultado del ejercicio.
  Biocombustibles 8.830.672.999 − 8.806.348.034 = +24,3 M; Alcoholes y Solventes 204.094.797 −
  188.815.212 = +15,3 M; Otros 139.521 − 435.548 = −0,3 M; suma 39,3 M = "Resultado del ejercicio …
  39.308.523". O sea que el resultado por división es una resta de dos filas publicadas, no un cálculo
  del sitio.
- simetría: `content/empresas/ancap.yaml` carga `segmentos[].resultado` de 2002 y 2003 exactamente así
  ("el monto se calcula restando el Total de Costos del TOTAL INGRESOS de la misma nota, ambas filas
  citadas arriba"). El mismo criterio tiene que valer para ALUR.
- accion_sugerida: cargar `segmentos[]` para **2019, 2020, 2021, 2022, 2023 y 2024** (seis años) con
  las tres divisiones del balance, `concepto` de una oración que diga si el monto es resultado
  (ingresos menos egresos de la misma nota) o ingresos, y la misma convención en toda la serie. Si
  además se quiere el corte por producto (azúcar, biocombustibles, alimento animal, alcoholes), va con
  `concepto: "ingresos brutos por línea de producto, nota 6"`, sin mezclar las dos bases. Corregir
  `anios_sin_segmentos` en `notas.md`: el hueco real es 2015-2018, no 2015-2024. Nota para el editor:
  la columna "Operaciones con empresas vinculadas" de la nota 6 es lo que ANCAP le paga a ALUR por
  biocombustibles año por año (2019: 5.546,2 M; 2020: 5.776,0; 2021: 6.985,6; 2023: 5.981,0; 2024:
  5.265,2 millones de pesos), y en 2020 y 2021 coincide al peso con el total de biocombustibles: toda
  la producción va a la matriz. Es el número que el lector-dueño está buscando.

### B2 — `monopolio.alcance`, `hitos[]` y `argumentos_en_contra[1]`: la derogación de 2021
- severidad: **bloquea**
- tipo: contexto_omitido
- objecion: la ficha describe el mandato de mezcla como vigente para etanol y biodiésel y dice que "el
  costo de esa incorporación obligatoria se traslada a tarifas", y presenta como argumento en contra
  que "el Poder Ejecutivo **promueve** la eliminación de la obligación de mezclar biodiésel". La misma
  fuente que la ficha cita (IMPO, Ley 18.195) dice que esa obligación fue derogada hace casi cinco
  años. Un lector de 2026 sale de la ficha creyendo que sigue pagando el biodiésel de ALUR en el
  gasoil. Es el hecho legal más importante del período cargado: explica el cierre de la planta de
  Capurro, la caída del resultado y la nota 1.4 del propio balance.
- cita_de_contexto: "Artículo 7 (*)(*)Notas:Derogado/s por: Ley Nº 19.996 de 03/11/2021 artículo 183."
  y, en el mismo texto, "Artículo 6 … proporción mínima de 8,5% … (*)Notas:Redacción dada por: Ley Nº
  19.996 de 03/11/2021 artículo 182" y "Artículo 8 … (*)Notas:Redacción dada por: Ley Nº 19.996 …
  artículo 184" (https://www.impo.com.uy/bases/leyes/18195-2007). El artículo 9, que la ficha cita para
  el traslado a tarifas, remite a "los artículos 6º y 7º": derogado el 7, solo queda el etanol.
- cita_de_contexto (la empresa lo dice): "1.4 Contexto operacional. La modificación de la normativa
  nacional que regula la mezcla de biocombustibles ha llevado a la Sociedad a definir acciones buscando
  nuevos negocios con el objetivo de optimizar las capacidades industriales instaladas y contratadas."
  (balance 2024, https://www.alur.com.uy/sites/default/files/ALUR%20individual%20-%20Informe%2031.12.2024-ptg.pdf).
- cita_de_contexto (cuál era el porcentaje derogado): "el MIEM «entiende necesario derogar» la
  disposición legal que obliga a mezclar 5% de biodiésel"
  (https://ladiaria.com.uy/politica/articulo/2021/2/combustibles-miem-pretende-eliminar-el-biodiesel-crear-impuesto-a-las-emisiones-y-revisar-subsidio-al-supergas/).
- accion_sugerida: reescribir `alcance` en frases cortas separando lo vigente de lo derogado y con
  fecha: artículos 2, 3 y 4 (exclusión del monopolio de ANCAP), artículo 6 con la redacción de 2021
  (8,5 % de etanol), artículo 7 derogado el 3/11/2021, artículo 8 (ANCAP realiza la mezcla), artículo 9
  (traslado a tarifas, hoy solo por el artículo 6). Agregar hito `2021-11-03` con las tres cosas que
  hizo la misma ley. Agregar al `texto` del argumento del MEF que la medida se aprobó, con su fecha, y
  al del MIEM la aclaración de que apuntaba al biodiésel: el mismo gobierno que lo eliminó subió el
  mínimo de etanol.

### B3 — cobertura de `finanzas[]`: 2015-2024 sin declararlo, con 2006-2025 publicado
- severidad: **bloquea**
- tipo: asimetria
- objecion: la ficha arranca en 2015 y termina en 2024. ALUR publica hoy, en su propio sitio, los
  balances de 2006 a 2025 — la propia `fuentes[0]` del lote es ese índice y su cita empieza con el
  informe de 2025. El punto 3 de la lista de control es explícito: "Ocultar años sin decirlo es faltar
  a la Regla 0: el lector piensa que la empresa nació ese año o que el sitio esconde el resto". Y acá
  el recorte no es neutral en su efecto: casi todo lo que ANCAP puso en ALUR, y el tramo de pérdidas
  que investigó el Senado, cae antes de 2015. Con la ficha como está, `capitalizaciones_del_estado`
  tiene **una** entrada en toda la serie y el lector concluye que el Estado puso $ 737 M una vez.
- cita_de_contexto (lo que el sitio publica hoy): "Descargas: - ALUR - Informe Individual
  31.12.2025-ptg.pdf … - balance-2019.pdf … - balance-2022_0.pdf … - balance-2006.pdf"
  (https://www.alur.com.uy/en/balances, leída en esta sesión: veinte balances, 2006 a 2025, todos con
  URL viva).
- cita_de_contexto (lo que queda afuera): "900.- Ancap ha realizado capitalizaciones en Alur de más de
  U$ 110.000.000, ha condonado deudas que esta tenía, se ha hecho cargo hasta del pago de la luz y
  otras cuentas, y es avalista y fiadora solidaria de muchas de las obligaciones que Alur mantiene con
  bancos y prestamistas." (https://www.enperspectiva.net/wp-content/uploads/2016/02/InformeFinalAncap.pdf).
  Y en documento primario: "En Asamblea Extraordinaria de Accionistas de fecha 28 de diciembre de 2007
  se resuelve la reactivación de la sociedad consagrada en el artículo 166 de la Ley 16.060 y el
  reintegro del capital integrado hasta la suma de $ 75.429.915. A esos efectos el accionista ANCAP
  capitaliza préstamos por un monto de $ 145.800.000 y el accionista PDVSA Uruguay S.A. capitaliza
  $ 16.200.000." (balance 2007,
  https://web.archive.org/web/20190714210751id_/http://www.alur.com.uy:80/empresa/balances/balance-2007.pdf).
- simetría con las fichas hermanas: `ancap.yaml` tiene 24 años (2000-2024), UTE desde 2003, ANTEL
  desde 1997, y las tres se extendieron hacia atrás por corrección el 2026-09-08. ALUR con diez años es
  el patito feo de la colección, y es la única de las cuatro cuya serie corta justo antes del período
  que su propia matriz tiene cargado.
- accion_sugerida: dos salidas, y la primera es obligatoria. (1) Mínimo para publicar: una línea en el
  `resumen` que diga desde cuándo existen balances publicados (2006), qué rango está cargado y que el
  resto se cargará, más el estado del ejercicio 2025, que ya está publicado. (2) Lo que corresponde:
  una segunda corrida que extienda `finanzas[]` a 2006-2025 con los veinte PDF del índice, igual que se
  hizo con ANCAP, UTE y ANTEL. Los años 2006-2014 traen, además, las capitalizaciones que hoy no se ven
  y el arranque del negocio azucarero.

### C1 — `creacion.norma`: anacronismo de accionistas
- severidad: corregir
- tipo: contexto_omitido
- objecion: `norma` (392 caracteres) dice que ALUR "se rige por la Ley General de Sociedades
  Comerciales N.º 16.060. El 90,79 % del paquete accionario pertenece a ANCAP … y el 9,21 % restante a
  PDVSA Uruguay S.A.". Eso es la foto de 2024 pegada al hecho de 1999. En 1999 los socios eran ANCAP y
  la Corporación Nacional para el Desarrollo; PDVSA compró el paquete de la CND ocho años después.
- cita_de_contexto: "El 12 de noviembre de 2007 se completó la transferencia por venta del paquete
  accionario perteneciente a la CND a la empresa PDVSA Uruguay." y, en la misma nota, la tabla "ANCAP
  67.886.924 90% / PDVSA Uruguay 7.542.991 10%" (balance 2007, URL arriba). En la Memoria del Poder
  Ejecutivo 2000: "La Corporación Nacional para el Desarrollo y ANCAP se asociaron a partir del
  1/12/99, formando Alcoholes del Uruguay S. A. dedicada a la comercialización de alcoholes potables y
  desnaturalizados" (http://archivo.presidencia.gub.uy/mem2000/info/ANCAP.htm).
- accion_sugerida: `norma` de una oración ("sociedad anónima cerrada constituida el 21/10/1999 al
  amparo de la Ley 16.060; no tiene ley de creación propia"). La composición accionaria actual va a
  `que_hace` o al `resumen`, con la fecha a la que corresponde. Hito nuevo `2007-11-12`. **Pista para
  otra ficha**: esto resuelve el reparo abierto en `content/empresas/ancap.yaml`, hito 1999-12-01 ("no
  se verificó si esta sociedad es la misma que hoy opera como ALUR"): es la misma, y la fecha de
  constitución es el 21/10/1999. Corresponde una corrección de tipo `cotejo_con_primaria` sobre ese
  hito.

### C2 — `hitos[]`: falta la mitad de la historia de la empresa
- severidad: corregir
- tipo: presentacion
- objecion: ocho hitos, y entre ellos la constitución de Agroalur y el proyecto SAF, pero no está el
  hecho por el que existe la ALUR que el lector conoce (Bella Unión), ni las plantas, ni la comisión
  investigadora, ni la ley de 2021. El brief pedía expresamente creación, Ley 18.195, Bella Unión,
  PDVSA y la investigadora.
- cita_de_contexto: "Esto llevó a que la empresa Alcoholes del Uruguay S.A. entrara a partir del 1 de
  febrero de 2006 en el negocio azucarero, teniendo como cometido fundamental la explotación del
  Ingenio Alfredo Mones Quintela." (balance 2007; la misma nota cuenta el traspaso al BROU de las
  deudas de CALNU y el arrendamiento por diez años del ingenio). Y: "se informó que Alur lleva
  invertidos U$ 248.000.000 en cuatro proyectos: la planta de cogeneración y producción de energía
  eléctrica en Bella Unión (2008), la planta de biodiesel en el predio de Cousa en el Paso de la Arena
  (2009), la planta de biodiesel de Capurro (2012) y la planta de bioetanol de Paysandú (2014). De
  ellas U$ 147.000.000 demandó la planta de bioetanol de Paysandú." (informe del Senado, ¶904).
- accion_sugerida: agregar `2006-02-01` (entrada al negocio azucarero, con su cita del balance 2007),
  `2007-11-12` (PDVSA), las cuatro plantas (una entrada o cuatro, con la cita del informe y, si se
  quiere primaria, el balance del año de cada puesta en marcha), `2016-02` (informe de la Comisión
  Investigadora), `2021-11-03` (Ley 19.996) y el cierre de ALUR Belén y Capurro en 2021, que hoy
  aparece solo de refilón dentro del hito del paro.

### C3 — `capitalizaciones_del_estado`: un cero solo y ocho ausencias
- severidad: corregir
- tipo: presentacion
- objecion: el diccionario dice "Cero con cita cuando el documento dice que no hubo; ausente cuando no
  se encontró". Acá el documento sí dice que no hubo, año por año, y `notas.md` lo reconoce ("no repetí
  un registro de capitalización en cero para cada uno de esos años para no inflar el archivo"). Un
  hueco no es un cero y se dibuja distinto: dejar ausentes 2017-2024 le dice al lector "no sabemos"
  cuando sabemos. Además el `concepto` del cero de 2016 son tres oraciones (281 caracteres) que
  terminan remitiendo a `notas.md`, un archivo privado y gitignored que el lector nunca va a ver.
- cita_de_contexto: "El capital integrado de la Sociedad al 31 de diciembre de 2024 y 2023 asciende a
  $ 3…" (balance 2024, nota 17.1), la misma frase con sus dos años en cada balance de la serie.
- accion_sugerida: `capitalizaciones_del_estado: {pesos: 0, concepto: "El capital integrado no cambió
  respecto del año anterior."}` en cada año 2016-2024, con la cita del balance de ese año. Sacar "ver
  notas.md" de todos los campos publicables.

### C4 — `resultado_ejercicio.usd` 2015-2021 y la moneda funcional
- severidad: corregir
- tipo: contexto_omitido
- objecion: la ficha convierte los pesos a dólares con el tipo de cambio de cierre en 2015-2021, y usa
  la cifra publicada en 2022-2024, sin decir en ningún lado que la moneda funcional de ALUR es el dólar
  **desde el 1/1/2014** y que los pesos son moneda de presentación convertida por NIC 21 (activos y
  pasivos al cierre; resultados al tipo de cambio de cada transacción). El gráfico va a dibujar una
  línea en dólares con dos construcciones distintas y un quiebre invisible en 2022. Y hay un caso
  comprobable: para 2021 existe la cifra auditada en dólares y no coincide con la de la ficha.
- cita_de_contexto: "Resultado del ejercicio 1.672.216 4.693.887 67.167.877 195.828.372" (balance
  2022, columnas US$ 2022, US$ 2021, $ 2022, $ 2021,
  https://www.alur.com.uy/sites/default/files/balance-2022_0.pdf): el resultado 2021 auditado es
  **US$ 4,7 millones**, la ficha trae **4,4** (195,8 / 44,695). Y: "La moneda funcional de los estados
  financieros de la Sociedad es el dólar estadounidense … La conversión desde la moneda funcional
  (dólar estadounidense) a pesos uruguayos como moneda de presentación se realizó aplicando los
  criterios establecidos en la NIC 21 … ii) Los ingresos y gastos del estado de resultados se presentan
  … convertidos al tipo de cambio vigente a la fecha de cada transacción o aproximados (promedios)."
  (balance 2024, nota 2.3). El cambio de moneda funcional está fechado: "A partir del ejercicio
  iniciado el 1° enero de 2014 la Sociedad adoptó al Dólar Estadounidense como su moneda funcional"
  (balance 2015, nota 2.3).
- accion_sugerida: para 2021 usar la cifra en dólares del balance 2022. Para 2015-2020 mantener la
  conversión al cierre (es la convención del sitio) pero decirlo una vez en el `resumen`, junto con la
  moneda funcional, que es lo que el brief pedía declarar. Y corregir la `nota` de 2015, que hoy dice
  "Primer año con moneda funcional dólar estadounidense (adoptada desde el ejercicio 2014)": 2015 no es
  el primer año, es el primero cargado.

### C5 — `finanzas[2019]` y `finanzas[2022]` desde la columna comparativa
- severidad: corregir
- tipo: presentacion
- objecion: la regla 4 del diccionario reserva la comparativa para el año **sin** balance propio.
  Ambos balances propios están publicados y vivos hoy en el sitio, en el mismo índice que la ficha cita
  como fuente. Los abrí en esta sesión: `balance-2019.pdf` existe (es un escaneo con OCR, lo que sí es
  una razón válida para preferir la comparativa limpia de 2020, pero hay que decir **esa** razón) y
  `balance-2022_0.pdf` existe, es texto limpio y viene en doble columna dólares/pesos, o sea que no
  había motivo para no usarlo. Además el `concepto` publicado dice "no se leyó un balance propio de
  2019 pese a existir en el sitio; ver notas.md": eso es una nota de proceso interno impresa al lado de
  una cifra.
- cita_de_contexto: el balance propio 2019 confirma las dos cifras cargadas ("Resultado antes de
  impuestos … 474.536.118 … Resultado del ejercicio 474.391.758" y, en su comparativa, 335.871.009 para
  2018; https://www.alur.com.uy/sites/default/files/balance-2019.pdf), y el balance propio 2022
  confirma "Resultado del ejercicio 1.672.216 4.693.887 67.167.877 195.828.372".
- accion_sugerida: cargar 2022 del balance propio (que además trae las divisiones de 2022 y 2021 en
  dólares y en pesos, y el dólar auditado de 2021). Dejar 2019 en la comparativa si se prefiere el
  texto limpio, con `nota` de una oración: "el balance propio de 2019 es un escaneo; la cifra se toma
  de la columna comparativa del balance 2020, que la publica idéntica".

### C6 — URLs de Wayback como URL canónica
- severidad: corregir
- tipo: presentacion
- objecion: siete años usan `https://web.archive.org/web/…id_/…/empresa/balances/balance-20XX.pdf`
  como `url`. La ruta vieja murió, pero el sitio sirve hoy los mismos PDF en `/sites/default/files/`.
  La convención es URL canónica en `url` y Wayback en `archived_url`; con la ruta muerta como
  canónica, el lector que quiere ir al documento aterriza en el archivo aunque el original esté vivo.
- accion_sugerida: reemplazar `url` por `https://www.alur.com.uy/sites/default/files/balance-20XX.pdf`
  y dejar la captura de Wayback en `archived_url`. Verificar antes que el PDF servido hoy sea el mismo
  documento (para 2019 y 2022 lo verifiqué; para el resto no).

### C7 — `impuestos_pagados`: citas que no dicen nada y un concepto de nueve tributos
- severidad: corregir
- tipo: presentacion
- objecion: las cifras son correctas — leí la nota completa y 155.527.736 y 192.870.188 son los
  totales de 2020 y 2019 —, pero la `cita` publicada es literalmente "155.527.736 192.870.188". El
  lector ve dos números sueltos como respaldo de un total de tributos. En 2022-2024 pasa lo mismo con
  cuatro números. Y el `concepto` de 2019 (254 caracteres) enumera los nueve tributos dentro de una
  celda de tabla.
- cita_de_contexto: "28.5 Tributos abonados … Impuesto al Patrimonio 13.743.006 14.955.820 … Tasa
  URSEA 42.634 147.397 Impuesto Primaria 6.744 7.270 155.527.736 192.870.188" (balance 2020).
- accion_sugerida: extender la cita para que incluya las dos últimas filas rotuladas y el total, de
  modo que se lea sola. `concepto` de una oración ("Total de tributos abonados, nota 28.5"); el detalle
  por impuesto, si se quiere, va a una nota al pie de la tabla o al `resumen`, una sola vez para toda
  la serie.

### C8 — `comparaciones[0]`: el "salvo 2014" está mal leído, y el autor impreso será una radio
- severidad: corregir
- tipo: cita_fuera_de_contexto
- objecion: dos cosas. (a) `periodo` dice "años previos a 2016 (según el informe, con excepción del
  ejercicio 2014)". El informe no dice que la diferencia de precio excluya 2014: dice que el **traslado
  a tarifa** ocurrió todos los años salvo 2014. Son cosas distintas y la ficha las funde. La comparación
  de Astori no tiene período declarado en la fuente. (b) `medio: en-perspectiva` para el informe de una
  Comisión Investigadora del Senado: la página imprime el medio como autor, así que un documento
  parlamentario va a aparecer firmado por una radio que solo lo aloja.
- cita_de_contexto: "241.- … Según expresara el Ministro Economía, Cr. Astori, el precio que abona
  Ancap a su propia subsidiaria Alur S.A. es 130 % para el etanol y 67% para el bio diesel superior al
  que le costaría importarlo sumando flete e impuestos. … 242.- Según Astori ese traslado tuvo lugar
  todos los años salvo en el 2014 en el que el Ministerio de Economía no convalidó un aumento de 263 %
  en los volúmenes de compra a Alur S.A." (informe del Senado; la nota al pie 197 dice "Danilo Astori
  en declaraciones citadas a la Comisión Investigadora").
- accion_sugerida: `periodo: "sin año declarado; declaraciones de Astori ante la Comisión
  Investigadora (2015-2016)"`, y el dato del traslado a tarifas, si se quiere conservar, va como
  argumento o como `nota`, no dentro de `periodo`. Buscar el informe en la Hemeroteca del Parlamento
  (`parlamento.gub.uy`, hay `content/medios/parlamento.yaml`) y citarlo como `diario_de_sesiones`; si
  no aparece, dejar `en-perspectiva` pero con `titulo` que empiece por "Informe de la Comisión
  Investigadora del Senado…" para que el crédito no engañe.

### C9 — falta el `analisis.yaml` del sobrecosto: tres cifras de una misma fuente
- severidad: corregir
- tipo: presentacion
- objecion: en el mismo informe, y en la página siguiente a la comparación ya cargada, hay una serie
  de tres años con autor identificable. Tres o más cifras de un mismo documento son un análisis con
  página propia (punto 9 de la lista de control, y el validador lo avisa), no filas sueltas.
- cita_de_contexto: "244.- En su informe multicitado el Cr. Alvaro Rossa analiza esto con singular
  precisión. Frente a la alternativa de importar mezclar combustible significa para Ancap un importante
  sobre costo cuantificado en U$ 48.500.000 en el año 2012, U$ 58.700.000 en el 2013 y U$ 92.300.000 en
  el 2014." (informe del Senado). En el mismo capítulo: "Ancap varió en forma retroactiva los
  porcentajes que abonaba por estos rubros a su subsidiaria. Los porcentajes … pasando los mismos del 5
  al 35 % en un caso, del 5 al 15 % en otro y duplicándose a un 10 % en otro."
- accion_sugerida: registro de `analisis.yaml` con sujeto ALUR, autor (Cr. Álvaro Rossa, informe
  presentado a la Comisión Investigadora; el vínculo del autor, si existe, va con fuente en `autor_es`,
  nunca como adjetivo), las tres cifras como afirmaciones a cotejar contra los balances 2012-2014 de
  ALUR y de ANCAP, y `calificacion: discutible` como marcador hasta que el editor califique. Ojo: son
  años que hoy no están cargados (ver B3).

### C10 — `precios_vs_paridad` ausente teniendo el precio publicado por ANCAP
- severidad: corregir
- tipo: presentacion
- objecion: el campo no existe en el registro. ANCAP publica el precio que le paga a ALUR por planta y
  por año. `notas.md` lo encontró y lo descartó porque "el texto extraído no permite asignar con
  certeza cada cifra a su año y producto". La cautela es sana pero la conclusión es evitable: en la
  extracción de un gráfico de barras agrupado los rótulos salen por serie, y de las dos lecturas
  posibles solo una da tres series monótonamente decrecientes; la otra hace que el etanol de Bella
  Unión caiga 44 % y rebote, y que Paysandú valga casi lo mismo que Bella Unión. Además la
  presentación de 2021 o 2022 repite la lámina con un año más y permite verificar el solapamiento.
- cita_de_contexto: "2.198 1.223 1.350 2.096 934 1.208 1.709 872 1.181 / Bioetanol Bella Unión
  Bioetanol Paysandú Biodiesel Capurro / 2018 USD/m3 2019 USD/m3 2020 USD/m3 / Precios biocombustibles
  (USD/m3)" (https://www.ancap.com.uy/9447/1/presentacion-balance-2020.html). En la misma lámina, el
  mecanismo de precio, que tampoco está en la ficha: "El contrato vigente para la compra de
  biocombustibles desde ANCAP, remunera los costos de ALUR y fija un margen comercial."
- accion_sugerida: cargar `precios_vs_paridad` con `descripcion` de dos oraciones y nueve puntos
  (`producto` = planta, `precio_venta`, `unidad_precio: "USD por m3"`), cada uno con la cita de la
  lámina y una `nota` que diga que la asignación año-producto se leyó de un gráfico y con qué otra
  presentación se verificó. Para la paridad: correr `pnpm inventario ursea.gub.uy --filtro
  "paridad|ppi|combustible"` antes de dar por sentado que no existe — desde el decreto 241/020 URSEA
  informa mensualmente el precio de paridad de importación (ver `content/eventos/mecanismo-precios-combustibles-luc.yaml`)
  y hay que ver si desagrega el componente de biocombustible. Si no lo desagrega, se carga solo el
  precio y se dice al pie que la paridad del etanol y el biodiésel no la publica el regulador.

### C11 — simetría de los argumentos del monopolio
- severidad: corregir
- tipo: asimetria
- objecion: los dos argumentos a favor son de 2007 (el texto de la ley) y de 2015 (el gerente general
  de ALUR en un comunicado de Presidencia). Los dos en contra son de 2021 (el MIEM vía prensa y el MEF).
  El resultado es que nadie defiende el diseño en el momento en que se discutió eliminarlo, y nadie lo
  cuestiona antes de 2021 (la crítica de 2016 quedó como comparación, no como argumento). Con el mismo
  esfuerzo de búsqueda se consiguen los dos lados en la misma fecha. No es un problema de partido: es
  que la ficha ordena los argumentos por época y eso los desbalancea solo.
- cita_de_contexto: el propio informe del MIEM, según la nota que la ficha cita, trae los dos lados y
  la ficha se quedó con uno: "el gobierno evalúa que la planta de etanol de ALUR en Paysandú es «la más
  eficiente», la de Bella Unión centrada en el mismo producto «la que más relevancia tiene en la
  economía local», y la de Capurro que produce biodiésel aumenta «el precio final del gasoil de forma
  significativa, sin mejorar el producto final»", y "el abogado Gonzalo Irrazabal aclaró que implica 40
  puestos de trabajo y que hay un contrato con la firma Cousa por el servicio de molienda hasta 2028,
  que debe pagarse «se use o no»" (la diaria, URL arriba).
- accion_sugerida: tres fuentes concretas, todas del período 2021-2024. (a) La discusión parlamentaria
  de los artículos 182 a 184 de la Ley 19.996: da los dos lados, en la misma fecha, con
  `diario_de_sesiones` (Hemeroteca del Parlamento). (b) FANCAP y el comité de base de Capurro por el
  cierre de las plantas: la nota de El País que el lote ya leyó cita al presidente del sindicato, y hay
  material sindical propio. (c) Del mismo informe del MIEM, el reconocimiento sobre Bella Unión y
  Paysandú citado arriba. Y del lado en contra, para no dejarlo pegado a un solo gobierno, el capítulo
  XVIII del informe del Senado (2016) en palabras de quien lo firma.

### C12 — `argumentos_en_contra[0]`: un informe elevado al Parlamento citado por una nota
- severidad: corregir
- tipo: un_solo_grupo
- objecion: el argumento más fuerte del lado en contra ("un fuerte subsidio implícito", "entre 100 % y
  400 %") se apoya solo en la crónica de la diaria, y la misma cita se reusa como `comparaciones[1]`:
  un solo documento, un solo grupo de medios, contado dos veces en la ficha. El documento original es
  previsible: la propia nota dice que fue elevado a la Asamblea General.
- cita_de_contexto: "El Ministerio de Industria, Energía y Minería (MIEM) envió este martes un informe
  a la Asamblea General sobre las reformas en el mercado de combustibles" (la diaria, 2021-02-03).
  Existe `content/medios/miem.yaml`.
- accion_sugerida: buscar el informe en la Asamblea General (Hemeroteca del Parlamento, febrero de
  2021) y en `miem.gub.uy`, y correr `pnpm inventario miem.gub.uy` antes de decir que no está. Si
  aparece, el argumento pasa a `documento_oficial` con la cifra en palabras del propio informe y la
  comparación queda con su autor real. Si no aparece, dejar la nota pero con una segunda fuente de otro
  grupo para el mismo hecho, y decir en el `texto` que es la cobertura de un informe no publicado.

### C13 — `monopolio.alcance`: un párrafo de 1.215 caracteres con una caracterización propia
- severidad: corregir
- tipo: presentacion
- objecion: es el campo más largo de la ficha y mezcla tres cosas: qué dice la ley, una conclusión del
  sitio ("el mandato de mezcla obligatoria le garantiza a ALUR un comprador cautivo") y una atribución
  a terceros ("según el Ministro de Economía y Finanzas y ex directores de ANCAP citados en la
  investigación del Senado"). La regla de la colección es que las cifras y los hechos van sin adjetivos
  ni verbos de intención y que las valoraciones van a `argumentos_*`, en palabras de quien las
  sostiene. Además falta el dato neutro y primario: cómo se fija el precio.
- accion_sugerida: `alcance` factual y corto (ver B2), con una frase del mecanismo de precio en
  palabras de ANCAP ("remunera los costos de ALUR y fija un margen comercial", presentación 2020) y el
  cambio de 2021 ("ALUR: Cambio de contrato de Biocombustibles con margen nulo", presentación 2021, ya
  citado en `hitos`). Lo demás, a `argumentos_en_contra` con su autor.

### C14 — `que_hace`: presente sostenido con una cita de 2008 cortada
- severidad: corregir
- tipo: contexto_omitido
- objecion: "Por contrato, vende a ANCAP la totalidad de su producción de etanol y biodiésel" está
  respaldado por una cita del balance de ANCAP de 2008 que además se corta a mitad de frase: "firmaron
  un contrato de suministro en el cual ALUR S.A. se obliga vender Etanol a ANCAP por". Esa cita habla
  de etanol, no de biodiésel, y de 2008, no de 2024. Los propios números de la ficha (una vez que se
  carguen los segmentos) muestran que en 2024 los biocombustibles vendidos a vinculadas son US$ 130,9 M
  sobre US$ 135,1 M totales, y que hay ventas al exterior.
- cita_de_contexto: nota 6 del balance 2024, ya transcrita en B1; y "Otros países 18.006.016
  32.398.583" en la tabla por mercado geográfico.
- accion_sugerida: fechar la afirmación ("hasta 2021 ANCAP compraba toda la producción de etanol y
  biodiésel") o cambiarla por lo que dicen los estados de los últimos años, con la cita de la nota 6.
  Y completar la cita de 2008 hasta el final de la frase o reemplazarla por el contrato vigente.

### C15 — `concepto` y `nota`: párrafos en celdas y remisiones a archivos privados
- severidad: corregir
- tipo: presentacion
- objecion: `concepto` y `nota` van como notas al pie de la tabla y son de una oración. Hay cuatro que
  no lo son: 2016 capitalizaciones (281 caracteres, tres oraciones, termina en "ver notas.md"), 2022
  resultado (287 caracteres, explica la NIC 21 dentro de una celda), 2019 impuestos (254, la lista de
  nueve tributos) y 2019 resultado (189, con "ver notas.md"). Dos campos publicables remiten a
  `notas.md`, que es privado y gitignored. Y la `nota` de 2018 invoca a El Observador ("consistente con
  lo publicado por El Observador … «Alur (US$ 10 millones)»") sin que esa fuente esté en la ficha.
- accion_sugerida: una oración por campo; lo metodológico que se repite (moneda funcional, columna
  comparativa) va una sola vez al `resumen`; sacar toda mención a `notas.md`; y o se cita a El
  Observador con su URL o se saca la frase. Sustituto mucho mejor para 2018-2020: la presentación de
  resultados de ANCAP confirma los tres años con el documento de la matriz (ver A1).

### C16 — `fuentes[]` general
- severidad: corregir
- tipo: presentacion
- objecion: hay una sola fuente general y su `cita` es una lista de enlaces de descarga. Con veinte
  balances del mismo publicador, la página agrupa sola por publicador (regla 2); una fuente cuya cita
  es un listado de URLs va a quedar como un bloque ilegible al pie.
- accion_sugerida: dejar el índice con `titulo` claro y una cita corta y legible (por ejemplo la línea
  del balance más reciente), y llevar la información de cobertura al `resumen`, que es donde el lector
  la busca (ver B3).

### A1 — `notas.md#hipotesis` (2): la falsa contradicción con ANCAP
- severidad: aviso
- tipo: sin_objecion (la hipótesis se resuelve, no hay defecto en la ficha)
- objecion: `notas.md` dice que la presentación de ANCAP 2020 atribuye a ALUR "Resultado neto empresa"
  de 661/793/926 millones, "que no coincide con el resultado individual leído directamente de los
  balances", y lo deja como duda abierta. Es una confusión de lámina. La lámina 27 es la de ALUR y trae
  336 / 474 / 471, que coinciden **exactamente** con los balances (335,9 / 474,4 / 470,8). Los
  661/793/926 son la lámina 28, otra empresa del grupo, igual que los −91/75/−76 de la lámina 26 son
  Cementos del Plata.
- cita_de_contexto: "26 / -91 75 -76 Resultado neto empresa … CAL: Se renovó contrato de suministro de
  cal a la central de Candiota … 27 / 336 474 471 … Resultado neto empresa … El contrato vigente para
  la compra de biocombustibles desde ANCAP, remunera los costos de ALUR y fija un margen comercial"
  (https://www.ancap.com.uy/9447/1/presentacion-balance-2020.html).
- accion_sugerida: borrar la hipótesis y usar la lámina como **segunda fuente** de los resultados
  2018-2020, que es lo que es: la matriz publicando el resultado de la subsidiaria, coincidente al
  millón con el balance auditado.

### A2 — el porcentaje accionario del informe del Senado
- severidad: aviso
- tipo: contexto_omitido
- objecion: la nota al pie 568 del informe dice "PDVSA es propietaria de una pequeña parte del capital
  accionario que se ha ido diluyendo puesto que cada vez que se hicieron capitalizaciones no acompañó
  las mismas. Hoy Ancap tiene más del 95% del capital de Alur". Los balances auditados dicen 90 %/10 %
  en 2007 y 90,79 %/9,21 % de 2015 a 2024, y en 2015 PDVSA sí acompañó (aportó $ 152.843.809). No lo
  registro como discrepancia: el informe no es un medio y la colección `discrepancias` es para prensa
  contra documento (ver más abajo).
- accion_sugerida: si el editor usa cifras de ese informe, agregar la salvedad en una oración. No
  cambia ninguna cifra de la ficha.

### A3 — `deuda_financiera[2024] = 0`
- severidad: aviso
- tipo: presentacion
- objecion: el cero está bien citado y es correcto, pero un cero en un gráfico de deuda se lee como
  "sin deuda". ALUR sigue teniendo deudas comerciales y con partes relacionadas.
- accion_sugerida: `nota` de una oración diciendo que el renglón es solo préstamos y obligaciones
  financieras.

### A4 — `notas.md#medios_faltantes`
- severidad: aviso
- tipo: presentacion
- objecion: dice que se creó `en-perspectiva.yaml` en `medios/` de la carpeta. No está en la carpeta
  (solo hay `alur.yaml`) y el medio ya existe en `content/medios/en-perspectiva.yaml`. Es un detalle,
  pero manda al editor a crear algo que ya está.

### A5 — `medios/alur.yaml`
- severidad: aviso
- tipo: sin_objecion
- objecion: sin objeción de fondo. Sigue la convención de `content/medios/ancap.yaml` y `ute.yaml`
  (`tipo: estatal`, `grupo: estado-uruguayo`, `empresa: alur`, `alineamiento.etiqueta: estatal` con
  justificación y fuente). Único agregado útil: `dominios` con `https://alur.com.uy` sin `www`, porque
  el índice del sitio mezcla las dos formas y `pnpm fuente` canoniza sin `www`.

### A6 — los anticipos a los productores de caña
- severidad: aviso
- tipo: contexto_omitido
- objecion: la ficha no dice nada del negocio azucarero salvo el nombre. El balance 2021 muestra
  "Anticipos a productores de caña 928.319.201" y "Provisión para anticipos incobrables (616.839.875)"
  en el corriente. Es información sustantiva sobre Bella Unión, con documento, y hoy no está en ningún
  campo.
- accion_sugerida: una oración en el `resumen` con su cita, o una `nota` del año.

## Verificado sin objeción

Lo que revisé y está bien, para que la ausencia de crítica también quede auditada:

- **Los diez resultados en pesos**, uno por uno contra la cita: 66.625.010 (2015), −270.986.359 (2016),
  −47.911.035 (2017), 335.871.009 (2018), 474.391.758 (2019), 470.761.851 (2020), 195.828.372 (2021),
  67.167.877 (2022), 328.423.574 (2023), 39.308.523 (2024). Todos son el renglón "Resultado del
  ejercicio" del estado **individual** del propio ejercicio, como pide el diccionario. Ninguno es
  consolidado y ninguno es una reexpresión.
- **La aritmética de la conversión a dólares** cierra en los diez años con la cotización declarada
  (por ejemplo 2016: 270.986.359 / 29,34 = 9,23) y las cotizaciones son las que declara cada balance en
  su nota 3.1. La objeción C4 es de criterio, no de cuentas.
- **Las sumas de `deuda_financiera`**: 2015 (5.700.985.771), 2016 (4.296.763.591 + 669.326.816),
  2017 (4.129.314.703 + 320.741.988), 2018 (3.469.703.378 + 653.617.572), 2019 y 2020 (saldos de la
  reconciliación), 2021, 2022 (US$ 28.677.544 + 20.109.145 y sus pesos), 2023 y 2024. Todas correctas.
- **Los totales de tributos**: leí la nota 28.5 completa de 2020 y la 26.5 de 2024; 192.870.188 (2019),
  155.527.736 (2020), 344.378.730 (2021), 191.756.965 (2022), 139.837.990 (2023) y 144.322.343 (2024)
  son los totales, no un impuesto suelto. Es el renglón que pide el diccionario.
- **`transferencias_al_estado: 0`** en 2019-2024, cada año con la frase del balance ("Durante los
  ejercicios X y X-1 no se realizaron versiones de fondos a rentas generales"). Bien hecho, y es el
  patrón que C3 pide replicar para las capitalizaciones.
- **La capitalización de 2015**: verifiqué la nota 18 completa. El capital integrado pasó de
  $ 2.171.830.739 a $ 3.314.484.995, y el aumento se explica por $ 252.860.447 de capitalización de
  ajustes al patrimonio más el plan de integración de $ 889.793.809 (ANCAP $ 736.950.000 + PDVSA
  $ 152.843.809). Que la ficha cargue solo la parte de ANCAP y lo aclare en el `concepto` es correcto:
  PDVSA Uruguay no es el Estado uruguayo. Solo faltaría, en una oración, que el aumento total del año
  fue mayor porque incluyó una reclasificación dentro del patrimonio.
- **Las citas** son literales y contiguas donde las pude cotejar (verifiqué unas veinte contra el
  texto que devolvió `pnpm fuente`), y `pnpm validar --inbox` da 50 errores, todos "no existe «alur» en
  content/medios", que es lo que el brief admite y lo que el editor resuelve con `medios/alur.yaml`.

## Objeciones al lote

1. **La cobertura declarada no es la cobertura real, en el sentido opuesto al habitual.** `notas.md`
   dice "Balances propios leídos (2015-2024, sin huecos)" y luego aclara que 2019 y 2022 salieron de
   comparativas. Está bien que lo aclare; el problema es la línea de arriba, que es la que va a
   terminar en el `resumen` si nadie la lee entera.
2. **Dependencia de fuentes**: 17 URLs, de las cuales dos son prensa (la diaria y El País, dos grupos
   distintos, correcto) y el resto documentos oficiales. No hay dependencia de un solo grupo de medios.
   Sí hay dependencia de **un solo documento** para el lado en contra (el informe del MIEM, vía una
   nota), y de **un solo documento** para el lado a favor con contenido económico (el comunicado de
   Presidencia de 2015, que reproduce a un gerente de la propia empresa).
3. **El corpus quedó infrautilizado en un punto concreto**: `consultas.jsonl` registra doce búsquedas
   en el corpus antes de ir a la web, lo que está bien, pero ninguna sobre la Ley 19.996 ni sobre "art.
   7 derogado", que es el hecho que falta (B2). Una búsqueda de "biodiésel derogación 2021" hubiera
   bastado.
4. **`pnpm inventario` se corrió para `alur.com.uy` pero no para los reguladores.** La regla 7 del
   diccionario pide el inventario del sitio de la empresa **y del regulador que la supervisa**. Para
   ALUR eso es URSEA (paridad de importación) y MIEM (informe de reforma). Las dos objeciones C10 y C12
   se caen solas si se corre.
5. **Nada del lote toca casos judiciales**, y corresponde: `casos_vistos` deja la mención al informe del
   Senado y a Sendic sin investigar, como pide la regla 12. Bien resuelto.

## Objeciones al brief

El brief no pide asimetría por partido, ideología ni persona: pide explícitamente los dos lados con el
mismo esfuerzo y avisa que "un dirigente que defiende una regla no es un argumento en contra de esa
regla". No hay Regla 0 que invocar contra su intención. Pero sí tiene **un defecto de encuadre con
consecuencia asimétrica**, y lo señalo como corresponde:

- **El rango fijo "2015-2024"** (sección 2, `finanzas[]`) produce el resultado descrito en B3: deja
  afuera catorce ejercicios que la empresa publica, y con ellos casi todas las capitalizaciones de
  ANCAP en ALUR, el arranque del negocio azucarero, las cuatro plantas y las cifras de sobrecosto de
  2012-2014. El efecto no es neutral: el período recortado coincide con los gobiernos del Frente Amplio
  y con el material del informe de la Comisión Investigadora del Senado. Digo lo mismo si el sesgo
  fuera al revés: un rango que empezara en 2020 dejaría afuera exactamente lo contrario.
- **Versión simétrica que propongo**: el criterio de las tres fichas ya publicadas — desde el primer
  balance publicado hasta el último (ALUR: 2006-2025, veinte documentos con URL viva) —, aplicado igual
  a toda empresa de la colección, sin que el rango dependa de qué gobierno cubra. Mientras eso no se
  haga, el punto 3 de la lista de control obliga a decir el rango cargado y desde cuándo hay documentos.
- Aparte de eso, el brief acierta en algo que conviene conservar: pedir el inventario antes de decir
  que un documento no existe. Lo que falta es extender esa misma exigencia al regulador (URSEA, MIEM),
  que es donde estaban las dos piezas que faltan.

`notas.md#objeciones_al_brief` dice "Ninguna". Debería decir esto.

## Discrepancias

**No escribo `discrepancias.yaml` en este lote, y el motivo importa.** Los dos candidatos que aparecieron
no cumplen el umbral:

1. *la diaria vs. el informe del MIEM*: para saber si "entre 100 % y 400 % más caro" es lo que dice el
   informe haría falta el informe, y en esta corrida nadie lo tuvo. Sin el documento que decide, es un
   desacuerdo, no una discrepancia. Queda como objeción C12, que es su lugar.
2. *Informe de la Comisión Investigadora vs. balances auditados* sobre el porcentaje accionario (A2):
   el informe no es un medio, así que no entra en una colección que mide la distancia entre lo que
   publicó la prensa y lo que dice el documento. Va como aviso.

Dejo dicho, para que el umbral se aplique igual en las dos direcciones, que si en una vuelta futura se
consigue el informe del MIEM y la cifra publicada no coincide, eso se registra; y que si aparece una
nota que exagere en el sentido contrario (favorable a ALUR) contra un documento primario, se registra
con el mismo rigor.

## Cobertura

Dos notas de prensa en el lote. El comunicado de Presidencia de 2015 y las presentaciones de ANCAP no
llevan registro de tono: son documentos oficiales de las partes, no cobertura periodística, y medir el
"tono" de un organismo sobre sí mismo no dice nada del sesgo de los medios.

```yaml
- medio: la-diaria
  url: https://ladiaria.com.uy/politica/articulo/2021/2/combustibles-miem-pretende-eliminar-el-biodiesel-crear-impuesto-a-las-emisiones-y-revisar-subsidio-al-supergas/
  titulo: "Combustibles: MIEM pretende eliminar el biodiésel, crear impuesto a las emisiones y revisar subsidio al supergás"
  fecha: 2021-02-03
  evento: mecanismo-precios-combustibles-luc
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Expone la propuesta del gobierno con sus fundamentos y, en el mismo texto, el origen y la razón de
    la norma que se quiere derogar y el costo de derogarla: "Esta regulación para los biocombustibles
    viene de una ley de 2007 surgida de un acuerdo multipartidario, que obligó a la mezcla con
    productos de producción nacional como forma de reactivar especialmente el sector azucarero de Bella
    Unión", y recoge que la planta de Capurro "implica 40 puestos de trabajo y que hay un contrato con
    la firma Cousa por el servicio de molienda hasta 2028, que debe pagarse «se use o no»".

- medio: el-pais
  url: https://www.elpais.com.uy/informacion/sindicales/paro-de-fancap-impide-suministro-a-distribuidoras-pero-aseguran-que-no-habra-desabastecimiento
  titulo: Paro de Fancap impide suministro a distribuidoras, pero aseguran que no habrá desabastecimiento
  fecha: 2021-08-12
  evento: "propuesto: conflicto-fancap-cierre-plantas-alur-2021"
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Da las dos versiones del conflicto con espacio equivalente y sin adjetivos propios: publica la
    posición del directorio de ANCAP ("El presidente de Ancap Alejandro Stipanicic ya había señalado en
    la noche de ayer a El País que no habría desabastecimiento por el almacenamiento con el que cuentan
    las estaciones de servicio") y la del sindicato en sus propias palabras ("ANCAP busca generar
    desabastecimiento a partir de su irresponsable alarma pública"), incluida la acusación del gremio
    contra la empresa.
```

Nota sobre el evento propuesto: `conflicto-fancap-cierre-plantas-alur-2021` cubriría la ocupación del
edificio de ANCAP, el paro del 12 de agosto, el cierre de ALUR Belén y ALUR Capurro y la no renovación
del convenio colectivo de 2000. Si el editor prefiere no crear un evento, la alternativa razonable es
`mecanismo-precios-combustibles-luc`, aunque encaja peor: el conflicto es laboral, no de precios.

## Qué documentos de ANCAP traen lo transferido a ALUR por año

Respuesta al punto 1 del encargo, con lo que verifiqué en esta sesión:

1. **Presentaciones de resultados de ANCAP, una por ejercicio** (`ancap.com.uy`, ya en el corpus para
   2019, 2020, 2021, 2022, 2023 y 2024). Traen tres láminas útiles:
   - "RESULTADO POR PARTICIPACIÓN EN EMPRESAS", con ALUR nombrada y su aporte al resultado de ANCAP en
     pesos y en dólares (2021: "$ 128,6 … USD 2,9" para ALUR; 2024: total "$ 1.027,4 … USD +23", con la
     aclaración "El resultado de ALUR es positivo, pero el efecto de los resultados no trascendidos por
     el stock de etanol en ANCAP, el resultado de inversión es negativo"). **Salvedad**: en la
     extracción de 2024 los rótulos no quedan alineados con los valores, así que hay que leer el PDF a
     ojo antes de cargar; en 2021 sí quedan.
   - "FACTURACIÓN EMPRESAS VINCULADAS", con ALUR desagregada por producto: 2021, "ALUR Biocombustibles:
     USD 161 mill. / ALUR Alimento animal: USD 46 mill. / ALUR Azúcar: USD 16 mill. / ALUR Otros: USD 13
     mill." (https://www.ancap.com.uy/17119/1/presentacion-balance-2021.html). Coincide con la nota 6
     del balance de ALUR (US$ 236 M de ingresos brutos): dos documentos independientes para el mismo
     número.
   - "Desglose de costos de producción y operativos", renglón "Biocombustibles": lo que ANCAP gastó en
     biocombustibles ese año ($ 6.791 millones en 2021, 9 % de sus costos).
   - Y la lámina de la subsidiaria con "Resultado neto empresa" y "Precios biocombustibles (USD/m3)"
     por planta (presentación 2020).
2. **EEFF individuales de ANCAP, Nota 17.1 "Inversiones en subsidiarias, asociadas y negocios
   conjuntos"**: valor de la inversión en Alcoholes del Uruguay S.A. año por año ("Alcoholes del Uruguay
   S.A. 90,79% 6.634.494.091 90,79% 6.075.171.426" al 31/12/2024 y 2023,
   https://www.ancap.com.uy/20615/1/eecc-individuales-2024.html). **No es una transferencia**: es el
   valor patrimonial proporcional por método de participación. Sirve para ver la evolución, no para
   `capitalizaciones_del_estado`.
3. **EEFF individuales de ANCAP, estado de flujos de efectivo, renglón "Aportes de capital efectuados
   en subsidiarias (Nota 27)"**: 2024 = 0; 2023 = $ 24.686.680. Está agregado por todas las
   subsidiarias, así que solo sirve como cota superior: si el renglón es cero, ese año no hubo aporte en
   efectivo a ALUR.
4. **EEFF individuales de ANCAP, Nota 27.2 "Otras transacciones y saldos con partes relacionadas"**:
   compras y ventas a subsidiarias, también agregadas (2024: "Compra de bienes y servicios /
   Subsidiarias 6.648.111.354 7.343.127.787").
5. **La contraparte, que es mejor que todo lo anterior y está en la propia ALUR**: nota 6 de sus
   estados financieros, columna "Operaciones con empresas vinculadas", línea "Biocombustibles". Es lo
   que ANCAP le pagó a ALUR, por año y por producto, auditado: 5.546,2 M (2019), 5.776,0 (2020), 6.985,6
   (2021), 5.981,0 (2023) y 5.265,2 (2024) millones de pesos, más los mismos números en dólares desde
   2022.
6. **Informe de la Comisión Investigadora del Senado (2016)** para lo anterior a 2015: ¶900
   (capitalizaciones de ANCAP en ALUR "de más de U$ 110.000.000", condonación de deudas, avales), ¶904
   (U$ 248.000.000 invertidos en cuatro plantas, U$ 147.000.000 la de Paysandú), ¶241-242 (Astori: 130 %
   y 67 % por encima del costo de importar), ¶243 (reajustes retroactivos de márgenes del 5 al 35 %, del
   5 al 15 % y del 5 al 10 %) y ¶244 (Rossa: U$ 48,5 M en 2012, U$ 58,7 M en 2013 y U$ 92,3 M en 2014).
7. **Balances de la propia ALUR** para las capitalizaciones con documento primario: nota 14 del balance
   2007 (ANCAP capitaliza préstamos por $ 145.800.000 el 28/12/2007) y nota 18 del balance 2015 (ANCAP
   $ 736.950.000 el 27/2/2015). Los balances 2008-2014, no leídos en esta corrida, son donde deberían
   estar las capitalizaciones intermedias que el informe del Senado menciona (las anteriores a 2010, la
   de 2011 y la de U$ 40.000.000 votada en contra por la directora Baldoira).
