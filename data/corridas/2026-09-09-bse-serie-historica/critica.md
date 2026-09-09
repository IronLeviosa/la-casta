# Crítica — corrida 2026-09-09-bse-serie-historica

Modelo: Opus 5 (1M context) — `claude-opus-5[1m]`. Es el único rol que corre en Opus por la regla de
modelos del mantenedor (CLAUDE.md, «Reglas para agentes», punto 14, 2026-09-07). El investigador de
este lote declara `_investigacion.modelo: claude-sonnet-5`, consistente con la tabla de roles.
Lote: `inbox/empresas/bse/2026-09-09-serie-historica/`
Registros revisados: 1 ficha de empresa (`bse`), 21 años de `finanzas[]` de los cuales 10 son nuevos
(2005-2014), 10 hitos, 1 comparación, 1 resumen. 116 URLs, 162 citas.

Lo que hice para revisar: releí con `pnpm fuente` los documentos citados y los ya bajados al corpus
por el investigador (los diez `estres`, `estsit` y `resram` de 2005-2014, las `notas` de 2006 y
2008-2015, el `oicot` de 2005, la Ley 18.243, la Carta Orgánica de 1911 publicada por el BSE), y
rehice a mano la aritmética de cada cifra publicada. Los resultados de esas cuentas están en cada
objeción, para que el editor pueda repetirlas sin volver a bajar nada.

---

## Tabla resumen

| # | Campo | Severidad | Tipo |
|---|---|---|---|
| B1 | `finanzas[2010].segmentos[Accidentes].resultado` | **bloquea** | contexto_omitido |
| B2 | `finanzas[*].transferencias_al_estado` + `resumen` | **bloquea** | presentacion / contexto_omitido |
| C1 | `finanzas[2014].impuestos_pagados` | corregir | documento_previsible |
| C2 | `finanzas[2012].impuestos_pagados` (hipótesis de notas.md) | corregir | explicacion_alternativa |
| C3 | `finanzas[2008\|2010\|2011].impuestos_pagados` | corregir | presentacion / inferencia |
| C4 | `finanzas[*].impuestos_pagados.concepto` | corregir | presentacion |
| C5 | `finanzas[2005\|2006\|2015].nota` (convención de cotización) | corregir | presentacion |
| C6 | `resumen` (largo) | corregir | presentacion |
| C7 | `resumen` (años salteados) | corregir | asimetria |
| C8 | `resumen` (capitalizaciones) | corregir | inferencia |
| C9 | `resumen` (cobertura 1911-2004) | corregir | presentacion |
| C10 | `hitos` (designación de presidentes del BSE) | corregir | asimetria |
| C11 | `finanzas[*].segmentos` (7 de 14 ramos) | corregir | presentacion |
| C12 | `finanzas[2013].impuestos_pagados.fuentes` | corregir | cita_fuera_de_contexto |
| A1 | `finanzas[2005-2009].resultado_ejercicio` (IRIC/IRAE) | aviso | sin_objecion |
| A2 | cotización 2005-2010 (códigos 2223 / 2230) | aviso | sin_objecion |
| A3 | aritmética de toda la serie | aviso | sin_objecion |
| A4 | anclas YAML en `segmentos` | aviso | presentacion |
| A5 | `notas.md`: «un quinto reporte» sin identificar | aviso | sin_objecion |
| A6 | inventario declarado en el encargo (28 vs 6) | aviso | sin_objecion |

**bloquea: 2 · corregir: 12 · aviso: 6.**

---

## Objeciones por campo

### B1 — `finanzas[2010].segmentos[Accidentes de trabajo y enfermedades profesionales]` — −652,6 millones

- severidad: **bloquea**
- tipo: contexto_omitido
- objecion: la planilla de la que sale ese número trae, en la misma hoja y colgada con un asterisco
  de esa misma columna, una nota del BSE que dice que el resultado incluye un incremento voluntario
  de reservas y que sin él el ramo habría dado ganancia. La ficha publica el −652,6 M sin la nota.
  El asterisco está incluso en la `cita` que la ficha ya trae («Accidentes (*)») y no se explica en
  ningún lado. Es el año en que la página va a dibujar la mayor pérdida de la década del ramo que es
  monopolio legal del BSE, y el documento dice que el signo se da vuelta sin ese asiento
  discrecional. Es el único año de 2005-2020 con una nota así: revisé los dieciséis `resram`
  bajados y solo el de 2010 la tiene.
- cita_de_contexto: «(*) Se computa en este ítem un incremento voluntario de Reservas Adicionales
  por $ 966.087.569. De no haberse efectuado, el Resultado Técnico de la rama Accidentes del Trabajo
  y Enfermedades Profesionales y el Resultado Técnico General habrían arrojado una utilidad de
  $ 318.863.293 y $ 167.822.645 respectivamente.» —
  https://www.bcu.gub.uy/Servicios-Financieros-SSF/Seguros/Datos%20del%20Mercado/reportes/resram/bse20101231.xls
- accion_sugerida: agregar la nota del BSE como `concepto` o `nota` de ese segmento, en una oración,
  con la cita literal de arriba como fuente adicional del mismo documento. Sin verbos de intención:
  se registra qué dice la planilla, no por qué se hizo el asiento.

### B2 — `finanzas[*].transferencias_al_estado` (ausente en 2005-2020, 2023 y 2025) y el párrafo del `resumen` que lo explica

- severidad: **bloquea**
- tipo: presentacion (lista de control, punto 11: «un hueco no es un cero») / contexto_omitido
- objecion: tres cosas, en orden de gravedad.

  **(a) El hueco se va a leer como cero.** La página dibuja `finanzas[]`; con transferencias cargadas
  solo en 2021 (0), 2022 (0) y 2024 (4.157,1), el lector ve una única barra en 2024 y nada en los
  otros veinte años. Sin un «?» con el motivo en el globo y una línea al pie, eso se lee como «el BSE
  no le giró nada al Estado en veinte años», que es justo lo que la ficha no puede afirmar.

  **(b) La ausencia no está verificada, y en dos años el propio material de la ficha dice lo
  contrario.** Con los `estsit` que la ficha ya cita, la cuenta
  `Resultados Acumulados(t) − [Resultados Acumulados(t−1) + Resultado del Ejercicio(t−1)]` da:

  | años | resultado de la cuenta | lo que dice la ficha |
  |---|---|---|
  | 2020 → 2021 | −1 peso | 2021: sin transferencias (Nota 19.3) ✔ |
  | 2021 → 2022 | +1 peso | 2022: sin transferencias (Nota 19.3) ✔ |
  | 2019 → 2020 | **−1.300.000.000** exactos | 2020: campo ausente |
  | 2022 → 2023 | **−2.400.000.001** | 2023: «hubo transferencias pero no se consiguió el monto» |

  El método da ±1 peso en los dos años en que hay documento que dice «no hubo», y da dos números
  redondos al peso en los dos años en que la ficha está en blanco. Capital (4.019.654.436) y Reservas
  (1 a 4 pesos) no se mueven entre 2018 y 2025, así que la caída no fue a capital ni a reservas. No
  digo que se publique el número inferido como si fuera el documento: digo que la ficha afirma menos
  de lo que sus propias fuentes permiten y que hay una `cadena` de `inferencia` armable, y sobre todo
  que hay que ir a buscar el documento.

  En los diez años nuevos la misma cuenta es más ruidosa porque hasta 2015 hay ajuste por reexpresión
  sobre el saldo acumulado. Sumando ese término
  (`RA(t) − [RA(t−1) + Ajuste por Reexpresión(t−1) + RE(t−1)]`) el residuo queda por debajo de los
  10 millones en 2006, 2007, 2010, 2012 y 2013, y claramente negativo en **2008 (−619,1 M), 2009
  (−587,0 M), 2011 (−479,8 M) y 2014 (−108,3 M)**. No es un dato y no propongo publicarlo: es la
  señal de que en al menos cuatro de los diez años nuevos pasó algo que el resultado del ejercicio y
  la reexpresión no explican, y de que la frase «no se encontró documento» no equivale a «no hubo».

  **(c) El documento existe y es previsible; lo que falta es la vía.** Para 2024 la ficha usa el
  Estado de Evolución del Patrimonio que está dentro de los **Estados Contables completos** que el
  BSE publica en `institucional.bse.com.uy` (2021-2024). Ese mismo estado es el que trae la fila
  «Distribución de Utilidades» en cualquier año. El investigador probó dos vías (el patrón de URL
  `reportes/estevpat/bse<AAAA>1231.xls`, 404 en los nueve años; y `pnpm inventario
  institucional.bse.com.uy --filtro Contables`, 0 resultados) y ninguna de las tres que quedan:
  - **Diario Oficial** (art. 191 de la Constitución obliga a los entes comerciales a publicar estados
    periódicos). El repo ya tiene la herramienta y ya se usó para ANCAP 1996 (`.cache/do-buscar.ts`,
    `.cache/do-ancap-1996.jsonl`). La probé sobre la Hemeroteca del Parlamento para el BSE: 2011 →
    123 ediciones, 2008 → 140, 1996 → 151, 1985 → 84 que mencionan «Banco de Seguros del Estado» y
    «Estado de Situación Patrimonial» el mismo día. No bajé las ediciones; el punto es que la vía
    está viva y sin probar.
  - **Tribunal de Cuentas**: el art. 12 de la Ley 18.243 le da intervención preventiva sobre todos
    los gastos del BSE, y el TC dictamina sobre los estados contables de los entes.
  - **Notas de OPP**: la propia ficha, en el año 2023, cita «Notas OPP 014/C/23 y 032/C/23» como el
    instrumento por el que se ordena la versión. El equivalente para 2005-2014 es la vía institucional
    natural.

  Verifiqué además que la vía que sí se probó está bien descartada: busqué «Rentas Generales»,
  «Gobierno Central» y «Distribución» en el texto de los nueve PDF de `notas` bajados (2006, 2008 a
  2015 y 2019) y hay **cero** coincidencias en todos. La nota «19.3 Transferencias al Gobierno
  Central» aparece recién en los filings del formato nuevo (2021 en adelante). Ese hallazgo es del
  crítico, no del lote: `notas.md` no registra haber hecho esa búsqueda.
- accion_sugerida: (1) marcar el hueco en el gráfico con «?» y motivo, y una línea al pie de la
  tabla; (2) mandar al resolvedor por el Diario Oficial con `do-buscar.ts` para 2005-2014 y también
  para 2020 y 2023; (3) mientras tanto, no dejar en el `resumen` ninguna frase que se pueda leer como
  «no hubo transferencias».

### C1 — `finanzas[2014].impuestos_pagados` — 335,6 millones

- severidad: corregir
- tipo: documento_previsible (el test que el propio lote definió no se corrió sobre este año)
- objecion: `notas.md` fija un criterio y lo aplica a tres años: sumar los renglones de la nota y
  compararlos con el total que la nota declara; si no reconcilia, no se publica («publicar un número
  con un dígito equivocado es peor que no publicarlo»). Corrí ese test sobre los cinco años
  publicados:

  | año | suma de renglones | total declarado | diferencia | ¿lo corrió el lote? |
  |---|---|---|---|---|
  | 2008 | 407.012.305 | 407.012.306 | +1 (redondeo del original) | no |
  | 2010 | 637.396.131 | 637.396.131 | 0 | no |
  | 2011 | cierra si el renglón ilegible «□3.026.699» es 83.026.699 | 714.801.518 | 0 | no |
  | 2013 | 1.108.191.191 | 1.108.191.191 | 0 | sí |
  | **2014** | **1.301.929.435** | **1.302.649.435** | **−720.000** | **no** |

  O sea: 2008, 2010 y 2011 pasan el test y quedan confirmados (buena noticia, y ahora está por
  escrito); 2014 **no lo pasa**, y es el único año publicado que no lo pasa. La explicación más
  probable es benigna: el OCR de 2014 lista doce renglones y le falta «Reclamaciones judiciales», que
  sí está en 2010, 2011 y 2013, y $720.000 es un renglón entero plausible; además en 2014 la etiqueta
  y el valor van en la misma línea («Impuestos, tasas y contribuciones 203.920.505 / Impuesto al
  patrimonio 131.705.696»), que es la situación más segura. Pero el lote no puede aplicar un test para
  descartar dos años y no aplicarlo al año que publica.
- cita_de_contexto: «Impuestos, tasas y contribuciones 203.920.505 / Impuesto al patrimonio
  131.705.696 … 1.302.649.435» — Nota 11,
  https://www.bcu.gub.uy/Servicios-Financieros-SSF/Seguros/Datos%20del%20Mercado/reportes/notas/bse20141231.pdf
- accion_sugerida: declarar el resultado del test en el `concepto` de los cinco años (una oración) y,
  para 2014, o bien recuperar el renglón faltante con un segundo OCR, o bien decir en el `concepto`
  que la nota no reconcilia por $720.000 y que los dos renglones usados están pegados a su etiqueta.

### C2 — `finanzas[2012].impuestos_pagados` (no publicado) y la hipótesis de `notas.md`

- severidad: corregir
- tipo: explicacion_alternativa
- objecion: `notas.md` afirma que en 2012 «al menos un dígito de al menos un renglón está mal leído
  por el OCR». Hay una explicación alternativa más simple que el lote no consideró y que cambia la
  decisión. En 2012 los once renglones suman **739.991.958** y el total impreso es **739.091.958**:
  la suma **supera** al total en 900.000, y los dos números difieren en exactamente un dígito, el de
  las centenas de mil (9 contra 0). Es decir, el dígito mal leído puede estar en el **total**, no en
  un renglón, y en ese caso los once renglones —incluido «Impuestos, tasas y contribuciones
  141.498.561»— son correctos. Refuerza la lectura que 141,5 M cae exactamente entre 2011 (107,9) y
  2013 (170,6) en una serie que crece de forma pareja: 47,1 (2008), 48,4 (2009), 57,7 (2010), 107,9
  (2011), 141,5 (2012), 170,6 (2013), 203,9 (2014).
  Para 2009 la alternativa no es tan limpia: los trece renglones suman 559.722.945 contra
  559.812.945, faltan 90.000, y hay un renglón («Gastos de comunicación», 29.202.463) donde un solo
  dígito explicaría la diferencia sin tocar el de impuestos, pero no hay forma de decidir cuál es.
  Descartar 2009 está bien; descartar 2012 con el mismo argumento no.
- cita_de_contexto: «97.887.329 / 91.412.442 / 69.177.673 / 141.498.561 / 44.006.812 / 43.835.647 /
  65.060.429 / 27.612.686 / 29.467.874 / 42.785.280 / 87247225 … 739091958» — Nota 11,
  https://www.bcu.gub.uy/Servicios-Financieros-SSF/Seguros/Datos%20del%20Mercado/reportes/notas/bse20121231.pdf
- accion_sugerida: segundo OCR del PDF de 2012 (o una copia con capa de texto) para leer el total; si
  confirma 739.991.958, cargar 2012 con 141,5 M. Y reescribir la hipótesis de `notas.md`, que hoy
  presenta una sola causa posible como si fuera la única.

### C3 — `finanzas[2008|2010|2011].impuestos_pagados` — el «piso» y la serie con dos definiciones

- severidad: corregir
- tipo: presentacion / inferencia
- objecion: dos problemas encadenados.
  (a) El `concepto` dice «este total es un piso y no el total completo de tributos». El documento no
  dice eso: dice que la nota de esos años no lista «Impuesto al patrimonio» como renglón. Verifiqué
  la ausencia (0 apariciones de «Impuesto al patrimonio» en los textos de 2006, 2008, 2009, 2010,
  2011 y 2012; 1 aparición en 2013, 2014, 2015 y 2019), así que la observación de hecho es correcta,
  pero la conclusión «es un piso» supone que el tributo existió y se omitió, que es exactamente lo que
  el documento no permite decidir.
  (b) Peor para el lector: la página va a dibujar en una sola serie 47,1 (2008) · 57,7 (2010) · 107,9
  (2011) · 279,1 (2013) · 335,6 (2014) · 416,9 (2015). El salto entre 2011 y 2013 es en buena parte
  un cambio de definición, y el gráfico no lo dice. Es el mismo daño que la lista de control ataca en
  el punto 11: un valor parcial dibujado como si fuera el completo.
- accion_sugerida: `concepto` de una oración pegada al documento («la nota de este año lista un solo
  renglón de tributos; desde 2013 la nota agrega "Impuesto al patrimonio" por separado»), y marcar
  2008, 2010 y 2011 en el gráfico como parciales, con la línea al pie.

### C4 — `finanzas[*].impuestos_pagados.concepto` — largo

- severidad: corregir
- tipo: presentacion (lista de control, puntos 5 y 12)
- objecion: el `concepto` de 2008, 2010 y 2011 tiene tres oraciones y unas 60 palabras; va como nota
  al pie de una celda de tabla. El de 2013 es una sola oración pero con dos incisos y una cifra entre
  paréntesis. `docs/diccionario-empresas.md` y CLAUDE.md piden una oración.
- accion_sugerida: una oración por `concepto`; lo demás, al pie plegado o al `resumen`.

### C5 — `finanzas[2005].nota`, `finanzas[2006].nota` y `finanzas[2015].nota` — la convención de cotización

- severidad: corregir
- tipo: presentacion
- objecion: la convención general («el tipo de cambio interbancario de cierre del último día hábil de
  diciembre») está declarada en la `nota` del año **2015**, que ahora es el año once de veintiuno: el
  lector que mira 2005 no la ve. Y la excepción de 2005-2006 está escrita dos veces, casi con las
  mismas palabras, una en cada año. El encargo pide justamente «la misma convención en toda la serie,
  dicha una vez».
- accion_sugerida: la convención, una sola vez, en el primer año de la serie o al pie del gráfico; la
  excepción de 2005-2006, una oración en 2005 y una remisión en 2006 (o una sola línea que cubra los
  dos años).

### C6 — `resumen` — 1.132 palabras

- severidad: corregir
- tipo: presentacion (lista de control, puntos 6 y 8)
- objecion: el tope de la lista de control son «unas 350 palabras»; el `resumen` tiene 1.132 (6.612
  caracteres), y buena parte son veintiún números en prosa que el gráfico de `finanzas[]` ya dibuja
  («Partiendo de USD 19,3 millones en 2005, bajó a USD 13,7 millones en 2006, subió a USD 21,6…»).
  Cifras en el tiempo van al gráfico; el texto es para lo que el gráfico no puede decir.
- accion_sugerida: dejar en el `resumen` qué es el BSE, qué muestra la serie en una o dos frases, el
  estado de la cobertura y los huecos con su motivo; sacar la enumeración año por año.

### C7 — `resumen` — años salteados en la enumeración

- severidad: corregir
- tipo: asimetria
- objecion: el `resumen` enumera uno por uno los once años 2005-2015 y después salta: «Siguió con USD
  10,2 millones en 2015, USD 66,7 millones en 2020 y USD 143,4 millones en 2021…». Quedan afuera
  2016 (USD 8,2 M), 2017 (54,8), 2018 (23,4), 2019 (51,9) y 2023 (98,3). Entre los salteados está el
  **mínimo de toda la serie** (2016) y el pico intermedio (2017). No creo que sea intencional —el
  tramo salteado abarca gobiernos de los dos signos y el sesgo no apunta a ningún lado—, pero la regla
  es la misma para todos los años: o se enumeran todos o no se enumera ninguno.
- accion_sugerida: al resolverse C6, el problema desaparece: sin enumeración no hay años salteados.
  Si se conserva alguna enumeración, que incluya el mínimo y el máximo de la serie.

### C8 — `resumen` — «no recibió capitalizaciones ni aportes del Estado en ningún año de 2005 a 2025»

- severidad: corregir
- tipo: inferencia (afirma más de lo que la cita respalda)
- objecion: la única evidencia cargada es «APORTES A CAPITALIZAR AJUSTADOS POR INFLACION 0» de cada
  `estsit`. Esa línea dice que al cierre no había aportes pendientes de capitalizar, no que no hubo
  aportes en el año. La afirmación fuerte, en cambio, sí es sostenible con otra línea del mismo
  documento que la ficha no cita: **«Capital Integrado 10»** en los veintiún años (verificado en los
  veinte `estsit` que están en el corpus, 2005 a 2025). El capital solo crece por ajuste por
  reexpresión (1.503.206.679 en 2005 → 4.019.654.436 desde 2018), no por integración nueva.
- accion_sugerida: agregar la cita «Capital Integrado 10» a `capitalizaciones_del_estado` (basta un
  año de ejemplo más la mención de que no varía) y reescribir la frase del `resumen` pegada al
  documento: «el capital integrado y la línea de aportes a capitalizar no varían en ningún año
  cargado».

### C9 — `resumen` — la línea de cobertura 1911-2004

- severidad: corregir
- tipo: presentacion (lista de control, punto 3)
- objecion: hoy dice «para 1911-2004 no se encontró documento público en las vías probadas (ni el
  sitio del BCU ni el índice de Wayback de ese dominio tienen algo anterior a 2005 con ese patrón de
  nombre)». Un lector lee «no existe». La regla del punto 3 pide decir desde cuándo existe la empresa,
  qué rango hay cargado, y que el resto se va a cargar hasta donde haya documentos — y acá hay una vía
  concreta sin probar que el propio repo sabe usar: el **Diario Oficial**, donde los entes comerciales
  publican sus estados por el art. 191 de la Constitución. Mi sondeo sobre la Hemeroteca del
  Parlamento (mismo endpoint que usa `.cache/do-buscar.ts`) devuelve, para «Banco de Seguros del
  Estado» cruzado con «Estado de Situación Patrimonial» en la misma edición: 84 fechas en 1985, 151
  en 1996, 140 en 2008, 123 en 2011. No bajé las ediciones: no afirmo que el balance esté ahí,
  afirmo que la vía no se probó y que decir «no se encontró» sin nombrarla es lo que el punto 3
  prohíbe.
- accion_sugerida: cambiar la línea por una que diga: el BSE existe desde 1911; la ficha carga
  2005-2025, que es desde donde el BCU publica los filings; para 1911-2004 la vía a probar es el
  Diario Oficial (art. 191) y todavía no se probó.

### C10 — `hitos` — quién designó al presidente del BSE

- severidad: corregir
- tipo: asimetria (Regla 0)
- objecion: la ficha tiene dos hitos de designación: «José Amorín Batlle asume la presidencia del
  BSE, designado por el gobierno de Lacalle Pou» (2020) y «Marcos Otheguy asume la presidencia del
  BSE, designado por el gobierno de Yamandú Orsi» (2025). No hay ninguno para 2005, 2010 ni 2015.
  Mientras la ficha cubría 2015-2025 la falta era discutible; ahora que cubre 2005-2025 no lo es: el
  criterio «quién puso al presidente del ente es un hito» tiene que valer para los cinco períodos o
  para ninguno. Tal como queda, la línea de tiempo nombra al gobierno responsable solo en los dos
  períodos más recientes, uno de cada signo, y deja tres sin nombrar.
- accion_sugerida: cargar las designaciones de 2005, 2010 y 2015 con su resolución (mensajes y
  resoluciones del Consejo de Ministros están en `archivo.presidencia.gub.uy` y en el Diario Oficial),
  o sacar los dos hitos existentes. Lo primero es mejor: es información y es simétrica.

### C11 — `finanzas[*].segmentos` — 7 de los 14 ramos que publica el documento

- severidad: corregir
- tipo: presentacion (lista de control, punto 3: el botón que dice «todo»)
- objecion: la fila `RESULTADO TECNICO` del `resram` trae catorce ramos más el total, y la `cita` que
  la ficha ya publica los contiene todos. La ficha carga siete (Incendio, Vehículos, Robo, RC,
  Accidentes, Rurales y Vida Prev.) y deja afuera Caución, Transporte, Otros, Vida, Ingeniería,
  Crédito y Reaseguros Activos, que no son residuales: Reaseguros Activos aporta +239,9 M en 2005 y
  +306,3 M en 2008, y Vida +80,1 M en 2005 y +280,8 M en 2013. El lector que prende los siete
  segmentos obtiene una suma que no se parece al total del año (en 2005: −107,2 M contra el total
  publicado de +302,7 M) y no hay nada que le diga por qué.
  Verifiqué que el mapeo columna→ramo es correcto y que el encabezado «Reaseguros Activos» es **una**
  columna, no dos: los catorce ramos suman exactamente el Total en 2005 (302.651.708), 2006
  (26.229.979), 2008 (−85.805.584), 2010 (−798.264.925) y 2015 (−1.398.713.399). O sea que los siete
  ramos que faltan están a mano y probados.
  Esto viene de la ficha publicada, no lo introdujo esta corrida; pero esta corrida es la que declara
  la cobertura completa de la serie, así que es acá donde corresponde arreglarlo o declararlo.
- accion_sugerida: cargar los catorce ramos en los veintiún años (los números ya están en la cita) o,
  como mínimo, una línea al pie que diga que la ficha muestra siete de los catorce ramos que publica
  el BCU y cuáles son los otros siete.

### C12 — `finanzas[2013].impuestos_pagados.fuentes` — la reconciliación que se afirma y no se cita

- severidad: corregir
- tipo: cita_fuera_de_contexto
- objecion: el `concepto` dice «posiciones 4ª y 5ª de 13 renglones de la Nota 11, pareadas por orden
  y verificadas contra el total que la propia nota declara ($ 1.108.191.191)», pero ninguna de las dos
  `cita` trae ese total ni la columna completa: traen «Impuestos, tasas y contribuciones Impuesto al
  patrimonio» y «170.626,634 108.511.545». Un lector no puede rehacer la verificación que el texto
  invoca. Y hay un problema visible a simple vista: la cita publica «170.626,**634**» con coma, que en
  la convención uruguaya se lee 170 mil pesos, mientras la ficha publica 170,6 **millones**. Es un
  artefacto del OCR y el número correcto es el que usó la ficha —lo confirmé: los trece renglones
  suman 1.108.191.191 exactos, idéntico al total impreso, solo si el cuarto vale 170.626.634—, pero
  el lector no tiene con qué saberlo.
- cita_de_contexto: «86.090.708 / 97.426.147 / 71.438.989 / 170.626,634 / 108.511.545 / 65.523.053 /
  56.754.904 / 68.881.995 / 41.203.531 / 36.634.080 / 51.457.245 / 11.694.228 / 241.948.132 /
  1,108.191.191» — Nota 11,
  https://www.bcu.gub.uy/Servicios-Financieros-SSF/Seguros/Datos%20del%20Mercado/reportes/notas/bse20131231.pdf
- accion_sugerida: agregar una tercera `fuente` del mismo documento con la columna entera y el total,
  y una oración en el `concepto` diciendo que la coma de «170.626,634» es del escaneo y que la suma
  de los trece renglones cierra exacto contra el total impreso.

### A1 — `finanzas[2005-2009].resultado_ejercicio` — el renglón dice IRIC

- severidad: aviso
- tipo: sin_objecion (el renglón es el correcto)
- objecion: en las planillas del BCU de 2005 a 2009 el renglón se llama IRIC y desde 2010 IRAE,
  aunque el IRAE rige desde el 1/7/2007: es el rótulo del formulario, no un error de la ficha. El
  renglón usado es el mismo que en 2015-2025 (`RESULTADO NETO`, después del impuesto a la renta) y la
  aritmética cierra en los diez años nuevos: 671.144.866 − 206.055.629 = 465.089.237 (2005);
  407.677.984 − 73.895.880 = 333.782.104 (2006); 563.264.391 − 98.153.970 = 465.110.421 (2007);
  −164.691.286 + 146.373.752 = −18.317.534 (2008); 723.168.625 − 76.543.396 = 646.625.229 (2009);
  y así hasta 2014. El encargo pedía verificar el renglón: está bien.
- accion_sugerida: una oración, una sola vez, aclarando el cambio de rótulo. Nada más.

### A2 — cotización 2005-2010 — dos códigos distintos del BCU

- severidad: aviso
- tipo: sin_objecion (la elección está bien y está declarada)
- objecion: revisé el `oicot` completo del 30/12/2005 y confirmo que ese reporte **no** trae la fila
  del «dólar promedio fondo»: solo trae «ESTADOS UNIDOS DLS. USA FDO BCU 2223 $ 24,100 24,150», con
  compra y venta. El punto medio (24,125) es la única opción y está declarado. Pero conviene precisar
  que la serie usada cambia de código: 2223 en 2005-2006 y **2230** («DOLAR PROMEDIO» en 2007,
  «DLS.PROMED.FONDO» en 2008-2010) de 2007 en adelante, mientras la `nota` de 2015 llama a toda la
  serie «Dólar USA Fondo BCU».
- accion_sugerida: nombrar los dos códigos una vez, en la misma línea donde se declare la convención
  (ver C5).

### A3 — aritmética de toda la serie

- severidad: aviso
- tipo: sin_objecion
- objecion: ninguna. Recalculé los veintiún `usd` contra `pesos / cotizacion` y cierran todos al
  decimal publicado (2005: 465.089.237 / 24,125 = 19,28; 2014: 408.169.458 / 24,333 = 16,78; etc.),
  igual los `usd` de `deuda_financiera` (2006 a 2010) y de `impuestos_pagados` (2008, 2010, 2011,
  2013, 2014). Los `deuda_financiera` y `capitalizaciones_del_estado` salen del renglón correcto del
  `estsit`, el mismo que usa 2015-2025. Los nombres de los siete segmentos coinciden exactamente con
  los de 2015-2018. Y `pnpm validar --inbox` pasa sin errores.
- accion_sugerida: ninguna. Queda registrado que se revisó.

### A4 — anclas YAML en `segmentos`

- severidad: aviso
- tipo: presentacion
- objecion: los años nuevos usan anclas (`fuentes: &a1` / `*a1`) y los viejos repiten el bloque
  entero. El contenido resultante es idéntico, pero `pnpm promover` va a reserializar y el
  `edicion.diff` va a verse más grande de lo que el cambio real es.
- accion_sugerida: nada de contenido; avisar en `razones.md` para que el diff no confunda.

### A5 — `notas.md`: el «quinto reporte» sin identificar

- severidad: aviso
- tipo: sin_objecion
- objecion: `notas.md` dice que el BCU «publica cinco tipos de reporte por separado […] y un quinto
  que no llegué a identificar con certeza». En todo lo que revisé aparecen cuatro (`estres`,
  `estsit`, `notas`, `resram`). Una nota interna que deja una duda abierta sin cerrarla se arrastra a
  la corrida siguiente.
- accion_sugerida: cerrarlo o sacarlo de `notas.md`.

### A6 — el inventario declarado en el encargo

- severidad: aviso
- tipo: sin_objecion
- objecion: el encargo dice que `.cache/inventarios/bse.com.uy.jsonl` tiene 28 documentos; el archivo
  tiene 6, y son los Informes de Gobierno Corporativo 2020-2025. No cambia ninguna conclusión, pero
  si alguien se apoyó en «28» para dar por agotado el sitio del BSE, se apoyó en un número que no es.
- accion_sugerida: rehacer el inventario de `bse.com.uy` y de `institucional.bse.com.uy` antes de dar
  por cerrada la búsqueda de los Estados Contables viejos.

---

## Objeciones al lote

1. **Lo que el lote hizo bien y conviene que quede escrito.** Los diez años nuevos salen todos de
   documento oficial primario, con el mismo renglón, la misma convención de cambio y los mismos
   nombres de segmento que la parte ya publicada; la aritmética cierra en todas las celdas que
   recalculé; los huecos están declarados uno por uno en `notas.md` con su motivo; y la decisión de no
   publicar 2009 por OCR no reconciliado es la decisión correcta. La crítica de arriba es sobre los
   bordes, no sobre el cuerpo.

2. **El test de reconciliación se aplicó de forma despareja.** Es el problema transversal del lote:
   se corrió en 2009, 2012 y 2013, se usó para descartar dos años, y no se corrió en 2008, 2010, 2011
   ni 2014 —justo los que se publicaron—. Lo corrí yo (C1): tres pasan, 2014 no. El criterio tiene
   que correrse sobre todos los años antes de decidir sobre cualquiera.

3. **La ausencia de transferencias no está verificada, y es el dato con más carga política de la
   ficha.** Cuánto le gira al Tesoro una empresa pública es exactamente lo que un lector va a mirar
   para juzgar a un gobierno. Dejarlo en blanco veinte años, sin marcar el hueco y sin haber probado
   la vía del Diario Oficial, es la única parte del lote donde el silencio puede hacer daño en las dos
   direcciones a la vez. Ver B2.

4. **Simetría entre años y gobiernos: bien en los datos, con dos excepciones en el marco.** Los diez
   años nuevos abarcan Vázquez I (2005-2010) y Mujica (2010-2015), y la disponibilidad de documento no
   sigue el color del gobierno: los huecos de `impuestos_pagados` caen en 2005, 2006 y 2007 (Vázquez)
   y en 2009 y 2012 (Vázquez y Mujica), por calidad de escaneo. No veo selección. Las dos excepciones
   son de encuadre, no de datos: los hitos de designación existen solo para los dos gobiernos más
   recientes (C10) y la enumeración del `resumen` saltea el tramo 2016-2019 (C7).

5. **Presentación: es donde el lote está más flojo.** Recorrí los trece puntos de la lista de control.
   Cumplen 1, 2, 7 (no aplica), 9, 10 y 13. Fallan o quedan cortos: 3 (el «todo» de los ramos, C11, y
   la línea de cobertura, C9), 4 y 11 (la serie de impuestos con dos definiciones y el hueco de
   transferencias sin marca, C3 y B2), 5 y 12 (`concepto` de tres oraciones, C4), 6 (1.132 palabras,
   C6), 8 (la enumeración en prosa de lo que el gráfico dibuja, C6).

6. **Nada de esto es riesgo legal.** No hay personas nombradas salvo dos presidentes del BSE con su
   resolución de designación, no hay denuncias ni causas, no hay trascendidos. Art. 336 CP y ley
   18.331 art. 18: sin observaciones.

---

## Objeciones al brief

**Regla 0: el brief no tiene problema de simetría.** Pide el mismo criterio para todos los años y
todos los gobiernos, y el encargo (extender la ficha hacia atrás hasta donde haya documento) es
neutral por construcción. No hay nada que rechazar.

**Sí hay un error de derecho en el encargo de esta corrida, y conviene corregirlo antes de que se
convierta en una búsqueda mal orientada.** El encargo dice que «el BSE vierte utilidades a Rentas
Generales por ley (art. 11 de su Carta Orgánica…)». Leí las dos cartas orgánicas:

- Ley 3.935 de 1911, **art. 11**: «El servicio de interés y amortización de la deuda será hecho de
  rentas generales. El Banco reintegrará el importe de esos servicios y de los gastos que haga el
  Poder Ejecutivo para su organización y funcionamiento, con el producto líquido que obtenga». Es el
  reintegro al Estado del servicio de los títulos con que se formó el capital fundacional, no una
  versión de utilidades.
  (https://www.bse.com.uy/wps/wcm/connect/17b8c551-440c-4369-a8c7-a03de1cdef16/CARTA_ORGANICA.pdf)
- Ley 3.935, **art. 14**: «Hasta tanto no se determine por la ley el destino del producto líquido
  anual del Banco, todo él pasará á constituir un fondo acumulativo de reserva». O sea: por defecto,
  no se vierte.
- Ley 18.243 de 2007 (la Carta Orgánica vigente), **art. 5**: el patrimonio se integra «por los
  resultados obtenidos y no afectados, **que se capitalizarán**». Su art. 11 es sobre las atribuciones
  del Directorio. Ni «Rentas Generales» ni «utilidades» aparecen en el texto de la ley.
  (https://www.impo.com.uy/bases/leyes/18243-2007)

La versión correcta del encargo es: **la carta orgánica no obliga a verter; la obligación nace cada
vez de una ley o de una instrucción del Poder Ejecutivo**, como muestran la Ley 7.819 de 1925 (50 %
de las utilidades líquidas), la Ley 8.935 de 1933 (un aporte extraordinario de $ 500.000) y, en la
época moderna, las notas de OPP que la propia ficha cita para 2023 («Notas OPP 014/C/23 y 032/C/23»).
Eso cambia dónde hay que buscar: no en la carta orgánica sino, año por año, en el Estado de Evolución
del Patrimonio de los Estados Contables completos (Diario Oficial, Tribunal de Cuentas) y en las
instrucciones de OPP/MEF. Ver B2, que es la objeción operativa.

---

## Cobertura

```yaml
# Ninguno.
# El lote no leyó ninguna nota de prensa: las 116 URLs son documentos oficiales (planillas y PDF del
# BCU, leyes en IMPO, resoluciones de Presidencia, PDF del propio BSE). Sin nota de prensa no hay
# tono que medir, así que esta corrida no aporta registros de cobertura. Se deja dicho explícitamente
# para que la ausencia no se lea como un paso salteado.
```

## Discrepancias

Ninguna. Una discrepancia exige contrastar lo que publicó un medio contra la fuente primaria del
mismo hecho, y en este lote no hay medios: hay documentos. Las inconsistencias que encontré son entre
lo que dice un documento del BCU y lo que la ficha escribió sobre él (B1, C1, C2, C3, C12), y ésas van
a la crítica, no a `discrepancias.yaml`.
