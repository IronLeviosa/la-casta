# Crítica — corrida 2026-09-07-empresas-bse

Modelo: Opus (claude-opus-5, 1M). Corro en Opus por la regla de modelos del mantenedor
(CLAUDE.md, 2026-09-07): el crítico es el único rol caro, y esta corrida respeta esa tabla.
Lote: `inbox/empresas/bse/2026-09-07/`
Registros revisados: 1 (`empresas.yaml#0`, BSE) — 6 años de `finanzas[]`, 1 comparación, 7 hitos,
3 argumentos de monopolio, 5 normas.

Verificaciones hechas en esta sesión: `pnpm validar --inbox` (22 errores, todos medios
inexistentes; esquema limpio), lectura con `pnpm fuente` de Ámbito, El País, Crónicas, IMPO
16.426 y 18.243, e índice CDX de Wayback sobre `bcu.gub.uy/Servicios-Financieros-SSF/Seguros*`
(567 URLs). Los `.xls` del BCU que `pnpm fuente` no puede bajar (ver O-L1) se comprobaron por
HTTP y se parsearon con la misma librería (`xlsx`) que usa `scripts/lib/extraer.ts`; eso alcanza
para afirmar que el documento existe y qué renglón trae, **no** para citarlo: la cita literal la
tiene que tomar el investigador con `pnpm fuente` una vez destrabada la herramienta.

---

## Resumen

| # | Campo | Severidad | Tipo | En una línea |
|---|---|---|---|---|
| O-1 | `finanzas[]` 2015-2019 | **bloquea** | documento_previsible | El BCU publica hoy los estados contables del BSE de 2005 a 2020; «no existe documento» es falso |
| O-2 | `comparaciones[0]` | **bloquea** | contexto_omitido | Fuente comercial de un corredor, `valor_par` calculado por el sitio, y falta la salvedad que hace la propia página |
| O-3 | `finanzas[].segmentos` | corregir | documento_previsible | El «Resultado Técnico por Rama» del BCU existe todos los años, no solo 2021 |
| O-4 | `finanzas[].impuestos_pagados` | corregir | documento_previsible | El dato está en el mismo documento que la ficha ya cita (flujo 2022, Notas 11 y 12, línea IRAE) |
| O-5 | `finanzas[].transferencias/capitalizaciones/deuda` | corregir | documento_previsible | Cargados en 2 de 6 años; la nota equivalente existe en cada filing del BCU |
| O-6 | `finanzas[].resultado_ejercicio.fuentes` | corregir | documento_previsible | Se cita el Informe de Gobierno Corporativo pudiendo citarse el estado de resultados |
| O-7 | `finanzas[].cotizacion` | corregir | documento_previsible | Cotización deducida de una cifra redondeada a millones enteros, no la declarada |
| O-8 | `finanzas[2024].nota` | corregir | contexto_omitido | Afirma una limitación que el filing del BCU de 2024 desmiente |
| O-9 | `finanzas[2020].resultado.concepto` | corregir | presentacion | «arrastra por error» es un verbo de intención sobre el BSE |
| O-10 | `monopolio.argumentos_*` | corregir | asimetria | El lado «a favor» depende de un solo jerarca designado por el gobierno de turno |
| O-11 | `monopolio.argumentos_en_contra[0]` | corregir | contexto_omitido | Se omite el matiz de AUDEA: «antes que nada igualar condiciones; si es desmonopolizando, mejor» |
| O-12 | `monopolio.argumentos_en_contra[1]` | corregir | asimetria | Es un episodio tarifario, y la respuesta del BSE está en la misma nota ya leída y no se registró |
| O-13 | `monopolio.normas[4]` (Ley 18.401) | corregir | cita_fuera_de_contexto | La cita es un fragmento de índice que no dice nada |
| O-14 | `hitos[3]` (Ley 18.243) | corregir | cita_fuera_de_contexto | El título afirma la derogación; la cita elegida no la contiene (sí el art. 21) |
| O-15 | `finanzas[].nota` y `.concepto` | corregir | presentacion | El validador marca 3 notas de 318 a 669 caracteres; varios `concepto` traen dos oraciones |
| O-16 | `fuentes[].medio` | corregir | presentacion | `bse` e `institucional.bse.com.uy` son el mismo publicador partido en dos |
| O-17 | `hitos[]` | corregir | presentacion | Faltan hechos fechados que ya están en fuentes leídas (1926, 1929, 2021) |
| O-18 | `notas.md` § hipótesis | corregir | riesgo_legal | Dice haber verificado contra notas de El Observador y En Perspectiva que no se abrieron |
| A-1 | `creacion.fuentes[0]` | aviso | contexto_omitido | Se cita el sumario de IMPO, no el articulado de la Ley 3.935 |
| A-2 | `monopolio.normas[2]` | aviso | sin_objecion | IMPO dice «Ley 7.975», la nota del BCU dice «Ley 7.915»: divergencia entre dos oficiales |
| A-3 | `finanzas[].segmentos` | aviso | presentacion | La taxonomía de ramas del BCU cambia entre 2021 y 2024: hay que declararlo antes de graficar |
| A-4 | `finanzas[2025]` | aviso | asimetria | Se agrega un año por encima del rango mientras faltan cinco por debajo |
| A-5 | `monopolio` | aviso | asimetria | El monopolio de hecho en renta vitalicia previsional no tiene argumentos de ningún lado |
| A-6 | `que_hace_fuentes` | aviso | documento_previsible | El art. 3 de la Ley 18.243 dice lo mismo y es primario |
| A-7 | lote | aviso | presentacion | El mismo defecto de `nota` larga ya está en ancap, antel y ute publicadas |
| O-L1 | lote / herramienta | corregir | documento_previsible | `canonicalizar()` borra el `www.` y por eso `bcu.gub.uy` es ilegible: es un bug, no una ausencia |
| O-L2 | lote / método | corregir | documento_previsible | El filtro CDX `.*957.*` no podía encontrar los archivos viejos, que se llaman `bse<fecha>` |
| O-L3 | lote | corregir | asimetria | La ficha arranca en 2020 mientras ancap, ute y antel se acaban de extender a 2000, 2003 y 1997 |

**2 bloquea · 18 corregir (incluidos los 3 del lote) · 7 avisos.**

---

## Objeciones por campo

### O-1 — `finanzas[]`, años 2015-2019 · «No se localizó ningún balance, memoria ni Informe de Gobierno Corporativo del BSE anterior a 2020»
- severidad: **bloquea**
- tipo: documento_previsible
- objecion: `notas.md` (§ `anios_sin_balance` y § `cobertura_del_periodo`) declara que no existe
  documento oficial para 2015-2019 «ni en el sitio propio, ni en Wayback, ni en el Portal de
  Transparencia de OPP, ni en catalogodatos». Es falso. La Superintendencia de Servicios
  Financieros del BCU publica **hoy, en el sitio vivo**, el estado de resultados, el estado de
  situación, el estado de evolución del patrimonio y las notas del BSE, año por año, en la
  carpeta heredada `Servicios-Financieros-SSF/Seguros/Datos del Mercado/reportes/`. Comprobé
  HTTP 200 para 2005, 2008, 2010, 2012, 2014, 2015, 2016, 2017, 2018, 2019 y 2020 en `estres`,
  `estsit` y `resram`, y para 2008 en adelante también en `notas` y `estevpat`. Los archivos son
  OLE2 reales (56 a 69 KB), no páginas de error.
- cita_de_contexto: el `estres` de 2015 —
  `https://www.bcu.gub.uy/Servicios-Financieros-SSF/Seguros/Datos%20del%20Mercado/reportes/estres/bse20151231.xls`
  — trae, en la hoja 1: `Período: 12 - 2015`, `Compañía: BANCO DE SEGUROS DEL ESTADO`,
  `RESULTADO ANTES DE IRAE 716.631.144,00`, `IRAE -412.267.748,00`,
  `RESULTADO NETO 304.363.396,00`. La serie completa que el documento entrega, y que la ficha
  hoy no tiene (resultado neto en pesos, con su IRAE entre paréntesis):
  2015 · 304.363.396 (−412.267.748) · 2016 · 240.432.961 (−348.206.026) ·
  2017 · 1.575.003.488 (−696.076.172) · 2018 · 757.414.110 (−502.490.510) ·
  2019 · 1.939.047.732 (−24.580.317) · 2020 · 2.822.453.198 (−38.528.320).
  El 2020 del BCU coincide dígito por dígito con el que la ficha sacó del Informe de Gobierno
  Corporativo, lo que confirma que es la misma cifra y la misma empresa.
- por qué bloquea: no es solo un hueco. La ficha publicada diría, a un lector que es dueño de la
  empresa, que de 2015 a 2019 no hay documento público, cuando el regulador lo publica. Y el
  recorte no es neutro en su efecto: los cinco años omitidos son los de resultado más bajo de la
  serie (240 a 1.939 millones) y los seis cargados son los de resultado más alto (2.822 a 6.409
  millones). Lo digo como problema de simetría, no de intención: el efecto sería el mismo si el
  recorte cayera del otro lado, y el criterio tiene que ser el mismo para el período de Vázquez,
  el de Lacalle Pou y el de Orsi. Es además el punto 3 de la lista de presentación: ocultar años
  sin decirlo hace pensar al lector que la empresa nació ese año.
- accion_sugerida: cargar 2015-2019 (y evaluar hasta 2005, ver O-L3) desde
  `https://www.bcu.gub.uy/Servicios-Financieros-SSF/Seguros/Datos%20del%20Mercado/reportes/estres/bse<AAAA>1231.xls`
  y sus hermanos `estsit`, `estevpat`, `notas` y `resram`. Requiere destrabar `pnpm fuente`
  (O-L1). Si por lo que sea el lote se cierra sin esos años, la línea de cobertura tiene que
  decir, con la URL, que los documentos existen en el BCU y que están pendientes de carga —
  nunca que no existen.

### O-2 — `comparaciones[0]` · 65 % del mercado, 2015, vía `garciahelgueraseguros.com`
- severidad: **bloquea**
- tipo: contexto_omitido (y quién hizo la comparación)
- objecion: tres problemas en una sola fila.
  (a) La fuente es la página comercial de un corredor de seguros. La página del sitio imprime el
  `medio` como autor de la comparación (regla 10 de la lista de presentación: «las comparaciones
  dicen quién las hizo, con el medio o el autor y el enlace»), así que el lector leería
  «García Helguera Seguros» como autor de una estadística de mercado. El brief lo pedía
  explícito: «la fuente es la de quien hizo la comparación».
  (b) `valor_par: "35 % (todas las aseguradoras privadas en conjunto)"` **no está en la fuente**.
  La página dice 65 % y nada más; el 35 % lo calculó el lote. El brief dice «nada calculado por
  vos», y aunque la resta sea trivial, se publica como si fuera una cifra citada.
  (c) La misma página, dos párrafos antes de la frase citada, pone la salvedad que da sentido al
  número, y la ficha no la recoge.
- cita_de_contexto: `https://garciahelgueraseguros.com/mercado-asegurador/` — «NOTA: Los
  accidentes de trabajo constituyen un monopolio legal en el cual el Banco de Seguros del Estado
  es la única aseguradora que puede operar en dicha rama. En el caso de vida previsional, el
  monopolio por parte del BSE es de hecho, ya que si bien la rama se encuentra en libre
  competencia ninguna aseguradora privada ofrece actualmente este producto.» Recién después:
  «Participación del mercado: Año 2015 — Para el año 2015 el 65% del mercado asegurador se
  explica por la actividad del BSE.» Sin esa nota, el 65 % se lee como dominio comercial cuando
  buena parte es reserva legal o ausencia de oferta privada; con ella, se lee como lo que es.
  Anoto además que la página, capturada, contiene datos «a Marzo 2017» y pestañas de 2013, 2015 y
  2017, así que la `fecha: 2015-04-07` de la fuente no es la fecha en que se publicó esa cifra.
- accion_sugerida: bajar la fila o reemplazarla por una comparación de autor identificable. Dos
  caminos concretos: (i) el boletín de AUDEA, que es quien produjo el dato — el corredor lo
  reproduce y lo dice («Referencias: Asociación Uruguaya de Empresas Aseguradoras»); (ii) la
  propia página «Datos del Mercado» del BSE
  (`https://institucional.bse.com.uy/inicio/institucional/Transparencia/Datos-del-Mercado/`),
  que publica participación con y sin accidentes de trabajo, y que en esta corrida quedó sin leer
  porque devuelve HTML dinámico: se ataca con `pnpm descubrir` o con la copia de Wayback. En
  cualquiera de los dos casos, el indicador tiene que decir si incluye o excluye las ramas
  reservadas, porque la fuente misma hace esa distinción.

### O-3 — `finanzas[].segmentos` · solo 2021, con 7 de 21 ramas
- severidad: corregir
- tipo: documento_previsible
- objecion: `notas.md` (§ `anios_sin_segmentos`) dice que el «Estado de Resultados por Rama» solo
  está archivado para diciembre de 2021. Está en el sitio vivo del BCU para toda la serie:
  comprobé `resram` HTTP 200 para 2005, 2008, 2010, 2012, 2014, 2015-2020 (carpeta heredada,
  `bse<AAAA>1231.xls`) y para 2021-2025 (carpeta por año, `957_<AAAA>1231.xls`). Con un solo año
  cargado, el gráfico de segmentos que la página dibuja sola queda con un punto por serie: el
  lector no tiene nada que prender ni apagar, que es exactamente lo que la regla de la colección
  quiere evitar.
- cita_de_contexto: el `resram` de 2019 abre las mismas 21 ramas que el de 2021, con la fila
  `RESULTADO TECNICO` completa (`Incendio -104.686.689 · Vehículos -1.018.976.583 · Robo
  12.207.972 · RC 143.901.252 …`). El de 2024 también existe y trae
  `Seguro de Renta Vitalicia -9.686.038.162` y `Accidentes 321.503.xxx`.
- accion_sugerida: cargar `segmentos[]` año por año desde `resram`. Verifiqué que el mapeo de
  columnas que hizo el lote para 2021 es **correcto** (ver «Sin objeción»), así que el trabajo es
  repetitivo, no interpretativo. Ver A-3 por el quiebre de taxonomía.

### O-4 — `finanzas[].impuestos_pagados` · ausente en los seis años
- severidad: corregir
- tipo: documento_previsible
- objecion: `notas.md` afirma que el formato de la SSF «no tiene ese dato agregado» y que el
  resto de los impuestos «aparecen mezclados dentro de Otros gastos de explotación sin un total
  propio». Los documentos que la propia ficha ya cita lo desmienten en tres lugares:
  1. **Caja, que es lo que pide `docs/diccionario-empresas.md`.** El Estado de Flujos de Efectivo
     de los Estados Contables 2022 —el PDF que la ficha usa para `transferencias_al_estado`—
     trae: «Impuesto a la renta pagado (184,560) (171,360)», con el comparativo 2021. Ese es
     literalmente el renglón de caja del diccionario.
  2. **Los tributos por naturaleza.** La Nota 11 «Otros gastos de explotación» de las Notas a los
     Estados Contables al 31/12/2021 (BCU, el PDF que la ficha ya cita para `que_hace` y para
     `transferencias`) lista, como renglones propios y no mezclados: «Impuestos. tasas y
     contribuciones», «Impuesto al patrimonio», y también «Fondo de Fomento Art. 68 Ley 16074».
  3. **El IRAE.** La Nota 12 «Impuesto a la Renta» da los componentes («Impuesto corriente
     171.360», «Impuesto diferido (1.297.674)», «Impuesto a la renta reconocido en el estado de
     resultados (1.126.314)») y la conciliación 12.2; y la línea `IRAE` aparece en el estado de
     resultados de **todos** los años del BCU.
- cita_de_contexto: Notas 2021, Nota 11: «La composición de otros gastos de explotación por
  naturaleza es la siguiente: Amortizaciones / Compensación asistencia médica / Asistencia médica
  ex funcionarios / Impuestos. tasas y contribuciones / Impuesto al patrimonio / …». Estados
  Contables 2022, flujo: «Impuesto a la renta pagado (184,560) (171,360)».
- accion_sugerida: cargar `impuestos_pagados` con el criterio de caja del diccionario (el
  renglón del flujo) y dejar en `nota`, en una oración, que el impuesto al patrimonio y las
  tasas están en la Nota 11 por devengado. Dos avisos para el editor, porque acá hay una trampa
  contable de verdad: **el IRAE del BSE fue negativo (ingreso) en 2021, 2023 y 2024**
  (+1.126.314, +85.239.453 y +22.046.590, con el signo que imprime el BCU) y positivo (gasto) en
  2022 y 2025 (−51.590.661 y −16.933.246). Y el «RESULTADO ANTES DE IRAE + IRAE = RESULTADO NETO»
  de 2024 que `notas.md` marca como «comportamiento inusual» **no es un error de OCR**: el
  `estres` del BCU, que es texto y no imagen, imprime exactamente `4.550.674.932 / 22.046.590 /
  4.572.721.522`. Un año con IRAE a favor no se carga como «impuestos pagados» sin decirlo.

### O-5 — `transferencias_al_estado`, `capitalizaciones_del_estado`, `deuda_financiera`
- severidad: corregir
- tipo: documento_previsible
- objecion: `transferencias_al_estado` está en 2021 y 2022; `capitalizaciones_del_estado` en 2022
  y 2024; `deuda_financiera` en 2022 y 2024. En los demás años no están «ausentes porque no
  constan»: están ausentes porque no se abrió el documento. La nota de transferencias al Gobierno
  Central es una nota estándar del filing (19.3 en 2021), y `DEUDAS FINANCIERAS` y `APORTES A
  CAPITALIZAR` son renglones fijos del Estado de Situación, que el BCU publica en `estsit` para
  cada año. El filing 2024 completo existe en el BCU: `notas/IDI_0555_20241231_0957.PDF`
  (2,78 MB, HTTP 200), `estevpat/957_20241231.pdf` y `estsit/957_20241231.xls`.
- cita_de_contexto: la nota 2021 que la ficha ya cita: «19.3 Transferencias al Gobierno Central
  En el presente ejercicio no se registraron transferencias al Gobierno Central.» — verifiqué que
  la cita es literal y contigua en el texto del PDF.
- accion_sugerida: completar los tres campos año por año desde `estsit` y `notas` del BCU. Un
  cero con cita en un año y nada en el siguiente le dice al lector cosas distintas sobre el mismo
  hecho.

### O-6 — `finanzas[].resultado_ejercicio.fuentes` · el Informe de Gobierno Corporativo como fuente del resultado
- severidad: corregir
- tipo: documento_previsible
- objecion: en 2020, 2021, 2023 y 2025 el resultado sale del desglose del patrimonio de un
  informe de gobierno corporativo. El diccionario pide «el renglón final del estado de resultados
  individual». El estado de resultados existe para todos esos años y es una planilla con texto,
  no un escaneo.
- cita_de_contexto: contrasté los seis años contra el `estres` del BCU y **todos cierran**:
  2020 `RESULTADO NETO 2.822.453.198` · 2021 `6.408.974.356` · 2022 `3.103.884.510` ·
  2023 `3.835.892.187` · 2024 `4.572.721.522` · 2025 `5.636.770.225`. Es decir: las cifras
  publicadas serían correctas; lo que está mal es de dónde cuelgan.
- accion_sugerida: mover la fuente principal al `estres` y dejar el informe de gobierno
  corporativo como segunda fuente. Es también lo que ordena la jerarquía de fuentes de la lista
  de presentación (punto 1): el estado contable antes que el informe institucional.

### O-7 — `finanzas[].cotizacion` · cotización deducida, no declarada
- severidad: corregir
- tipo: documento_previsible
- objecion: las cinco cotizaciones (44,768 · 40,111 · 39,049 · 44,069 · 39,02) se obtuvieron
  dividiendo el patrimonio en pesos por el patrimonio en dólares que el informe redondea a
  millones enteros. `docs/diccionario-empresas.md` es explícito: `cotizacion` son «pesos por
  dólar con los que se convirtió, **tal como los declara el balance**». La aritmética cierra —la
  verifiqué año por año, y el redondeo del denominador a millones enteros mete un error relativo
  de menos de 0,1 %, así que los `usd` no están mal por esta vía— pero el campo estaría diciendo
  que el balance declara algo que no declara.
- cita_de_contexto: las Notas 2021, § 2.2 «Activos y pasivos en moneda extranjera»: «Los activos
  y pasivos en moneda extranjera se convierten a pesos uruguayos utilizando los arbitrajes y las
  cotizaciones proporcionadas por la SSF a la fecha de cierre del ejercicio.» O sea: el propio
  balance dice cuál es la cotización que usa, por referencia — la de la SSF/BCU al cierre.
- accion_sugerida: usar la cotización interbancaria de cierre del BCU al 31/12 de cada año (serie
  publicada por el BCU y en `catalogodatos.gub.uy`), que es la que el balance declara usar, y
  citarla. Si el editor prefiere no publicar `usd`, la alternativa es dejar solo pesos: lo que no
  puede quedar es una `cotizacion` presentada como declarada.

### O-8 — `finanzas[2024].nota`
- severidad: corregir
- tipo: contexto_omitido
- objecion: la nota dice «Los Estados Contables de 2024 disponibles (6 páginas…) traen solo el
  Estado de Situación Patrimonial, el Estado de Resultados y el Estado de Evolución del
  Patrimonio, sin el Estado de Flujos de Efectivo ni las notas explicativas; **por eso este año no
  tiene transferencias_al_estado ni segmentos**». La primera mitad es cierta del PDF del sitio del
  BSE. La segunda es falsa: el BCU publica para el mismo cierre las notas completas
  (`2024/diciembre/notas/IDI_0555_20241231_0957.PDF`, 2,78 MB) y el resultado por rama
  (`2024/diciembre/resram/957_20241231.xls`, que abrí y trae las 21 ramas).
- accion_sugerida: cargar 2024 desde el filing del BCU y reescribir la nota, o borrarla. Una nota
  al pie que explica una ausencia con un motivo equivocado es peor que no tener nota.

### O-9 — `finanzas[2020].resultado_ejercicio.concepto` · «arrastra por error»
- severidad: corregir
- tipo: presentacion
- objecion: el `concepto` dice «el mismo informe, en su introducción, **arrastra por error** la
  cifra de patrimonio en dólares de diciembre de 2019, no de 2020». La regla de la colección es
  «las cifras se registran con su documento y sin adjetivos ni verbos de intención». «Arrastra
  por error» atribuye un error al BSE; el documento solo permite decir qué fecha declara.
- cita_de_contexto: Informe Anual de Gobierno Corporativo 2020, introducción: «Es la principal
  empresa aseguradora del país, con más de 900.000 contratos vigentes y US$ 430 millones de
  patrimonio a diciembre de 2019.» Y en el mismo informe: «El Patrimonio del Banco al 31 de
  diciembre de 2020 asciende a $ 17.805.273.417». El hecho publicable es ese: la introducción del
  informe de 2020 reporta el patrimonio a diciembre de 2019.
- accion_sugerida: redactarlo como hecho («la introducción del informe reporta el patrimonio en
  dólares a diciembre de 2019»). De paso, ese US$ 430 millones a diciembre de 2019 es un dato con
  fuente que la ficha tiene leído y no usa.

### O-10 — `monopolio.argumentos_a_favor` · un solo actor, designado por el gobierno de turno
- severidad: corregir
- tipo: asimetria
- objecion: el único argumento a favor es del presidente del BSE en ejercicio, designado en 2025.
  `notas.md` justifica no buscar más con que «el criterio del brief es esfuerzo de búsqueda
  parejo, no cantidad de citas parejas», y que el argumento «es consistente entre las dos
  presidencias del período (Amorín Batlle y Otheguy)». Dos problemas: esa consistencia se afirma
  sin fuente (no hay ninguna declaración de Amorín Batlle sobre el monopolio en el lote), y el
  esfuerzo no fue parejo en el lugar donde más rinde. `consultas.jsonl` registra tres búsquedas
  web genéricas y ninguna sobre el sindicato ni sobre el Parlamento. La consecuencia práctica es
  que un lector ve «el jerarca que nombró este gobierno defiende su propio monopolio» contra «la
  cámara del sector privado lo cuestiona», cuando la discusión tiene treinta años de registro
  taquigráfico.
- cita_de_contexto: en el corpus, hoy, sin bajar nada nuevo, hay al menos seis diarios de
  sesiones sobre el tema: `biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/` —
  1996-03-19 (0002), 1997-03-12 (0007), 1997-04-15 (0015), 1997-04-16 (0016), 1997-05-06 (0019)
  y 1997-07-09 (0045), todos bajo «Normas sobre desmonopolización de seguros. (Interpretación de
  la excepción contenida en el inciso final del artículo 1º de la Ley Nº 16.426)». El
  investigador buscó «Ley 16.426 seguros» en el corpus y anotó «20 resultados del Parlamento
  citando la ley, ninguno con el texto pleno»: buscó el texto de la ley, no los argumentos.
- accion_sugerida: y esto vale para los dos lados por igual, que es el punto. `pnpm corpus:buscar
  "monopolio accidentes de trabajo Banco de Seguros" --desde 1993-01-01 --hasta 1998-12-31` y la
  sesión del 14/10/1993 en que se votó la Ley 16.426 dan, en `diario_de_sesiones` (fuente
  primaria, no prensa), quién defendió mantener la reserva y quién quiso abrirla, con nombre y
  partido. Del lado a favor, además: AEBU, que no se buscó ni una vez, y las memorias del propio
  BSE. Del lado en contra: economistas identificables, que tampoco aparecieron (se buscó
  «Ceres OR Exante» una vez, sin resultado). Un solo trabajo —el debate parlamentario— sube los
  dos lados de prensa a primaria.

### O-11 — `monopolio.argumentos_en_contra[0]` (AUDEA) · falta el matiz que la propia nota trae
- severidad: corregir
- tipo: contexto_omitido
- objecion: el `texto` presenta a AUDEA pidiendo lisa y llanamente la desmonopolización. El
  párrafo siguiente de la misma nota, que la ficha no recoge, subordina el pedido a otro
  objetivo. La cita registrada es literal y contigua (la verifiqué), y la atribución a «Federico
  Veiroj, director ejecutivo de Audea» es la que hace la nota; el problema es solo el recorte.
- cita_de_contexto: `https://www.ambito.com/uruguay/empresas-aseguradoras-abogan-mayor-desregulacion-del-sector-n6095305`
  — «"En definitiva lo que nos interesa antes que nada es igualar las condiciones de competencia.
  Si es desmonopolizando, mejor, porque todas las compañías privadas que operan en Uruguay tienen
  las capacidades y la experiencia para trabajar en el seguro de accidentes de trabajo, porque lo
  hacen en otros países del mundo y de forma muy robusta", agregó el representante de la
  comisión.»
- accion_sugerida: agregar esa oración al `texto` o partirlo en dos argumentos. «Igualar
  condiciones, y si es desmonopolizando mejor» es una posición distinta de «desmonopolizar», y la
  diferencia es justamente lo que un lector quiere saber.

### O-12 — `monopolio.argumentos_en_contra[1]` (CIPU/CAPU) · episodio, y sin la respuesta del BSE
- severidad: corregir
- tipo: asimetria
- objecion: dos cosas. (a) El brief es explícito: los argumentos van «sobre el diseño legal (qué
  está reservado y por qué debería seguir así o cambiar), **no sobre un episodio suelto**». Esto
  es un conflicto tarifario de abril de 2024 por la prima de la pesca. Contado como «argumento en
  contra del monopolio», el recuento queda 1 a 2 cuando en argumentos de diseño es 1 a 1. (b) La
  misma nota, ya leída y ya en el corpus, trae la respuesta técnica del BSE, y no está registrada
  en ningún lado de la ficha. El `texto` afirma como hechos («cobrando una tasa más del triple…,
  sin haber verificado en el terreno las condiciones que invoca») lo que son afirmaciones de una
  parte, contradichas en la misma nota por la otra —incluso el número está en disputa.
- cita_de_contexto: `https://www.elpais.com.uy/negocios/noticias/de-falta-de-mantenimiento-a-incapacidad-para-detectar-denuncias-falsas-cruce-entre-el-bse-y-gremiales-pesqueras`
  — «Ya hay diferencias en lo que cobra el ente: 9,13% (según el BSE) y 10,24% (según la Cámara
  de Industrias Pesqueras -CIPU- y la Cámara de Armadores Pesqueros -CAPU).» Y: «Según Cerruti
  del BSE, "aún existe una insuficiencia de ingresos por primas que no permite cubrir la
  siniestralidad del sector, y que lleva a que, desde el punto de vista técnico, nos sea imposible
  bajar la tasa de prima por debajo del valor actual".» La cita que sí registró la ficha
  («Nosotros no tenemos un negocio monopólico…») es literal y es de CIPU/CAPU: eso está bien.
- accion_sugerida: o se saca el argumento por ser un episodio, o se lo deja diciendo que es una
  disputa tarifaria y se registra en el mismo movimiento la respuesta del BSE, que es un argumento
  a favor de la reserva (la prima refleja la siniestralidad del sector) y está en una nota que ya
  se leyó, a costo cero. Si la nota alcanza para el lado en contra, alcanza para el lado a favor:
  ese es el umbral único.

### O-13 — `monopolio.normas[4]` y `hitos[4]` (Ley 18.401) · la cita no dice nada
- severidad: corregir
- tipo: cita_fuera_de_contexto
- objecion: la `cita` es «TITULO II - SUPERVISION DEL SISTEMA FINANCIEROCAPITULO I -
  SUPERINTENDENCIA DE SERVICIOS FINANCIEROS Artículo 8» — un fragmento de índice, con las
  palabras pegadas del salto de línea. Pasa el mínimo de 20 caracteres y no respalda nada de lo
  que el título de la norma afirma («crea la Superintendencia… que desde entonces supervisa al
  BSE»). Se repite idéntica en el hito.
- accion_sugerida: citar el texto del artículo que crea la SSF, y, para la parte de «supervisa al
  BSE», el art. 2 de la Ley 16.426, que ya se leyó en esta corrida y lo dice con todas las letras:
  «Las empresas públicas o privadas para desarrollar actividad aseguradora o reaseguradora deberán
  instalarse en el país y ser autorizadas por el Poder Ejecutivo, con el asesoramiento y control
  de la Superintendencia de Servicios Financieros del Banco Central del Uruguay.»

### O-14 — `hitos[3]` (Ley 18.243) · el título afirma lo que la cita no dice
- severidad: corregir
- tipo: cita_fuera_de_contexto
- objecion: el hito se titula «Ley 18.243 reemplaza la ley fundacional de 1911 por una nueva
  Carta Orgánica» y el `alcance` dice «sustituyó por completo la Ley 3.935». La cita elegida es
  el art. 1, que solo dice que el BSE «creado por la Ley N° 3.935 … es un ente autónomo que
  integra el dominio comercial del Estado». La derogación no está en esa cita. Es un caso de
  manual de «el registro afirma más de lo que la fuente respalda» —con el atenuante, importante,
  de que la afirmación es verdadera.
- cita_de_contexto: `https://www.impo.com.uy/bases/leyes/18243-2007` — «Artículo 21 Derógase la
  Ley N° 3.935, de 27 de diciembre de 1911.» Lo leí en esta sesión con `pnpm fuente`.
- accion_sugerida: reemplazar o agregar esa cita en el hito y en `monopolio.normas[3]`.

### O-15 — `finanzas[].nota` y `.concepto` · más de una oración
- severidad: corregir
- tipo: presentacion
- objecion: `pnpm validar --inbox` lo marca solo: `finanzas[2021].nota` 669 caracteres,
  `finanzas[2023].nota` 415, `finanzas[2024].nota` 318. La regla de la colección es una oración,
  porque van como nota al pie de la tabla. Además, seis de los siete `concepto` de
  `resultado_ejercicio` traen dos oraciones (la segunda explica siempre lo mismo: de dónde salió
  la cotización), y el `concepto` del segmento «Accidentes de trabajo» tiene dos oraciones largas.
- accion_sugerida: una oración por celda. La explicación de la cotización, que se repite en cinco
  años, va una sola vez en el `resumen` —el validador ya avisa de eso en otras fichas («la misma
  nota se repite en 8 años: una convención va una sola vez, en el resumen»)—. El razonamiento
  sobre por qué la columna «Accidentes» del `resram` es accidentes de trabajo y no la columna
  «Accidente» del bloque Vida es correcto y vale la pena conservarlo, pero va en el `resumen` o en
  el `nota` del año, no en la celda.

### O-16 — `medio` · un mismo publicador partido en dos
- severidad: corregir
- tipo: presentacion
- objecion: las fuentes usan `bse` (para `bse.com.uy`) e `institucional.bse.com.uy` como medios
  distintos, siendo el mismo publicador. La página agrupa las fuentes por publicador (punto 2 de
  la lista: «Un publicador con varios documentos es una línea»); con dos slugs el BSE aparecería
  dos veces en el bloque de fuentes, y el lector no sabría por qué.
- accion_sugerida: un solo medio `bse` que cubra los dos hosts, con `empresa: bse` apuntando a
  esta ficha, como pide la regla de la colección. Y crear `cronicas`. `garciahelgueraseguros` no
  debería llegar a existir si se resuelve O-2.

### O-17 — `hitos[]` · faltan hechos fechados que ya están en fuentes leídas
- severidad: corregir
- tipo: presentacion
- objecion: siete hitos, de los cuales cinco son las mismas cinco normas de `monopolio.normas` y
  dos son designaciones de presidentes. La regla 8 de la lista de presentación pide toda ayuda
  visual que condense información: la línea de tiempo de una empresa de 114 años que solo tiene
  leyes y dos nombramientos no condensa gran cosa. Hay hechos fechados en documentos que esta
  corrida ya abrió y no se usaron.
- cita_de_contexto: Notas a los Estados Contables 2021, Nota 1.1 —el BSE se rige por «las Leyes
  N° 3.935 del 27 de diciembre de 1911, N° 7.915 del 19 de julio de 1926, N° 8.416 del 30 de mayo
  de 1929, N° 16.426 del 14 de octubre de 1993 y N° 18.243 del 27 de diciembre de 2007»: dos
  leyes fechadas (1926 y 1929) que la ficha no tiene. Y Nota 11: «Dentro de este ítem se
  constituyó este año el Fondo de Fomento de la Rehabilitación de Trabajadores Discapacitados por
  Accidentes de Trabajo y Enfermedades Profesionales por un total de $ 360.405.800. según lo
  establecido por el Art. 68 de la Ley 16074.-» — un hito de 2021 con cifra y fuente.
- accion_sugerida: agregar esos tres, más lo que aparezca de 2015-2019 al cargar esos años.

### O-18 — `notas.md` § hipótesis · verificación contra notas que no se abrieron
- severidad: corregir
- tipo: riesgo_legal (regla 4 y 5 de agentes)
- objecion: `notas.md` sostiene la decisión de publicar la cotización deducida diciendo: «Se
  verificó contra prensa para 2021 (US$ 143 millones, cronicas de El Observador) y contra prensa
  para 2025 (US$ 144-145 millones, En Perspectiva) y ambas coinciden con el cálculo.»
  `consultas.jsonl` no registra ninguna lectura de El Observador ni de En Perspectiva sobre el
  BSE, y no hay nota de ninguno de los dos en el corpus con esas cifras. La única traza es una
  búsqueda («8 resultados, incluye nota de El Observador sobre ganancia récord 2021») cuyo
  resultado nunca se abrió. No llega al lector, pero es el fundamento declarado de una decisión
  que sí llega.
- accion_sugerida: borrar la afirmación o abrir las dos notas con `pnpm fuente`. Con O-7
  resuelto, la verificación deja de hacer falta.

### A-1 — `creacion.fuentes[0]` · la Ley 3.935 citada por su sumario
- severidad: aviso
- tipo: contexto_omitido
- objecion: la cita de la Ley 3.935 es el sumario que escribe IMPO, no el articulado, y de ahí
  sale la afirmación de que el monopolio original cubría vida, accidentes de trabajo e incendios.
  El lote lo declara con honestidad en el `titulo` («resumen de IMPO; la página no publica el
  articulado completo»), que es lo correcto, así que esto es un aviso y no una objeción.
- accion_sugerida: si en algún momento se quiere el articulado, el Registro Nacional de Leyes y
  Decretos y la Hemeroteca del Parlamento (que el diccionario manda usar «para todo lo legislativo
  desde 1830») lo tienen.

### A-2 — «Ley 7.975» vs «Ley 7.915»
- severidad: aviso
- objecion: la cita literal del art. 1 de la Ley 16.426 en IMPO dice «el artículo 1 de la Ley
  7.975, de 19 de julio de 1926»; la Nota 1.1 del BSE ante el BCU, para la misma fecha, dice «N°
  7.915 del 19 de julio de 1926». Las dos citas de la ficha son literales de su documento: no hay
  error del lote. Lo anoto para que el editor no lo corrija «arreglando» una de las dos, y porque
  es una divergencia entre dos documentos oficiales, no entre prensa y documento (por eso no va a
  `discrepancias.yaml`).

### A-3 — quiebre de taxonomía de ramas entre 2021 y 2024
- severidad: aviso
- tipo: presentacion
- objecion: la planilla del BCU cambia los rótulos entre esos años. 2021: bloques «Vida» / «Vida
  Prev.», con ramas «Robo» e «Invalidez». 2024: bloques «Seguros de Personas no Previsionales» /
  «Seguros Previsionales», con «Hurto» en lugar de «Robo», sin «Invalidez» y con «Varios». Si se
  carga la serie sin declararlo, el gráfico va a mostrar series que empiezan y terminan sin
  motivo aparente, y el punto 11 de la lista es explícito: un hueco no es un cero.
- accion_sugerida: declarar el cambio una vez en el `resumen` y usar `nota` del año del quiebre.

### A-4 — `finanzas[2025]`
- severidad: aviso
- tipo: asimetria
- objecion: agregar 2025 (fuera del rango 2015-2024 del brief) porque el documento ya está
  disponible es una buena decisión y así lo explica la `nota`. Solo señalo el contraste: se
  extiende la serie un año hacia adelante en la misma corrida en que se declaran inexistentes
  cinco años hacia atrás que sí existen. Resuelto O-1, el aviso se cae solo.

### A-5 — el monopolio de hecho en renta vitalicia previsional
- severidad: aviso
- tipo: asimetria
- objecion: `alcance` dice bien que en vida previsional «ninguna privada ofrece el producto,
  aunque no hay reserva legal». Es, según el único año con desglose cargado, la mayor pérdida
  técnica del banco por lejos (Seguro de Renta Vitalicia: −4.459,9 millones en 2021; −9.686,0
  millones en 2024 según el `resram` que leí). Un lector-dueño va a preguntar por eso antes que
  por accidentes de trabajo, y la ficha no tiene argumentos de ningún lado sobre ese diseño.
- accion_sugerida: no es obligatorio para cerrar el lote, pero si se busca, se busca para los dos
  lados con el mismo esfuerzo.

### A-6 — `que_hace_fuentes`
- severidad: aviso
- tipo: documento_previsible
- objecion: `que_hace` se apoya en el informe de gobierno corporativo y en la nota del BCU. El
  art. 3 de la Ley 18.243, leído en esta sesión, dice casi lo mismo y es la norma: «Realizará todo
  tipo de operaciones de seguros, reaseguros, contratación de rentas vitalicias, administración de
  fondos…».

### A-7 — el mismo defecto de presentación en fichas ya publicadas
- severidad: aviso
- objecion: `pnpm validar` emite 46 avisos de `nota` demasiado larga, y solo 3 son de este lote:
  los otros 43 son de `content/empresas/ancap.yaml`, `antel.yaml` y `ute.yaml`, más un aviso de
  «5 comparaciones de la misma fuente» en `ute.yaml` que pide un registro de `analisis/`. No es
  problema de esta corrida, pero es la cuarta ficha seguida en que se pierde la misma regla, y el
  editor lo va a ver en la misma corrida.

---

## Sin objeción (lo que sí está bien y conviene que quede registrado)

- **Las seis cifras de `resultado_ejercicio` son correctas.** Las contrasté una por una contra el
  estado de resultados que el BSE presenta a la SSF, que es un documento distinto del que usó el
  lote, y coinciden dígito por dígito en 2020, 2021, 2022, 2023, 2024 y 2025.
- **El mapeo de segmentos de 2021 es correcto, incluida la parte difícil.** La planilla tiene dos
  columnas parecidas —«Accidente» (dentro del bloque Vida) y «Accidentes» (rama propia)— y el
  lote eligió la segunda para accidentes de trabajo, que es la buena, y explicó por qué. Los ocho
  valores cargados coinciden con la fila `RESULTADO TECNICO` del archivo original.
- **Las citas legales son literales y contiguas**: Ley 16.426 art. 1 (la larga, que sostiene todo
  el `alcance`), Ley 16.074 art. 7, Ley 18.243 art. 1. Verificadas con `pnpm fuente` en esta
  sesión.
- **Las tres citas de prensa son literales, contiguas y bien atribuidas**: Otheguy en Crónicas,
  Veiroj en Ámbito (la nota efectivamente dice «Federico Veiroj, director ejecutivo de Audea»), y
  CIPU/CAPU en El País.
- **La cita de la nota 19.3 de transferencias es literal.**
- **La afirmación sobre el portal de OPP es correcta**: la página de BSE en
  `transparenciapresupuestaria.opp.gub.uy` solo trae indicadores de gestión (margen de solvencia,
  ROE, ejecución de inversiones, vacantes), ningún estado contable. Bien descartado.
- **`precios_vs_paridad` correctamente ausente**: no hay paridad de importación para un seguro. Si
  el editor quisiera una serie de precios (la tasa de prima por sector), va como comparación con
  autor o como `analisis`, no en ese campo.
- **`monopolio.alcance` es jurídicamente correcto** en lo que dice sobre qué quedó reservado en
  1993 y qué no, y el esquema exige (y el lote cumple) argumentos de los dos lados.

---

## Objeciones al lote

### O-L1 — `pnpm fuente` no puede leer `bcu.gub.uy`, y no es culpa del BCU
- severidad: corregir · tipo: documento_previsible
- `notas.md` § `verificacion_manual` dice: «`pnpm fuente` y `WebFetch` fallan con "unable to
  verify the first certificate" / "fetch failed". El dominio `bcu.gub.uy` no se pudo leer
  directamente en ningún intento de esta sesión». La causa no es el BCU ni un certificado roto:
  `scripts/lib/url.ts:75` hace `u.hostname = u.hostname.toLowerCase().replace(/^www\./, '')`
  dentro de `canonicalizar()`, y `fuente.ts` baja la URL canónica. El BCU sirve en
  `www.bcu.gub.uy` y **no** en el ápice. Medido en esta sesión, sobre el mismo archivo:
  - `https://www.bcu.gub.uy/…/2023/diciembre/resram/957_20231231.xls` → **HTTP 200, 62.976 bytes**
  - `https://bcu.gub.uy/…/2023/diciembre/resram/957_20231231.xls` → **sin respuesta (timeout)**
  Y el log de `pnpm fuente` muestra la reescritura: pidió
  `bajando https://bcu.gub.uy/Servicios-Financieros-SSF/…` con el `www.` ya borrado.
- accion_sugerida: no tocar el registro; abrir el arreglo en la herramienta (conservar el host tal
  cual para la descarga, aunque se siga canonicalizando para el id de corpus). Es lo que destraba
  O-1, O-3, O-4 y O-5, y afecta a cualquier ficha futura que dependa del BCU, que son todas las
  del sistema financiero. Mientras tanto, Save Page Now sobre esas URLs devuelve HTTP 523, así que
  la vía Wayback tampoco sirve hoy.

### O-L2 — el filtro de la búsqueda CDX no podía encontrar los años viejos
- severidad: corregir · tipo: documento_previsible
- El lote buscó en Wayback con `filter=urlkey:.*957.*` y concluyó «solo dic-2021 y mar-2022». Es
  consistente con lo que devuelve ese filtro, y es la razón exacta del error de O-1: el BCU pasó a
  nombrar los archivos con el código de institución (`957_20211231.xls`) recién con la carpeta por
  año; antes se llamaban con el nombre de la empresa (`bse20191231.xls`, y en Wayback quedó por
  ejemplo `…/reportes/notas/bse2020930.pdf`). Buscando `957` no aparece ni un archivo anterior a
  2021.
- accion_sugerida: cuando el sujeto es una empresa supervisada, buscar por las dos convenciones
  (nombre y código) y, sobre todo, **probar el sitio vivo antes de concluir que algo no existe**:
  en este caso los 500 y pico de URLs que Wayback tiene bajo esa carpeta son una fracción mínima
  de lo que el BCU sirve hoy. Vale la pena dejarlo escrito en `docs/diccionario-empresas.md`, que
  ya tiene la regla «el inventario antes que la memoria»: el inventario de Wayback no agota el
  sitio vivo.

### O-L3 — cobertura y simetría entre fichas
- severidad: corregir · tipo: asimetria
- Los tres commits anteriores a esta corrida extendieron hacia atrás las series de las otras
  fichas: ANCAP a 2000, UTE a 2003, ANTEL a 1997. Cerrar BSE en 2020 aplicaría a esta empresa un
  estándar de cobertura distinto del que se acaba de aplicar a las otras tres, y con menos
  justificación, porque acá los documentos están todos en un mismo directorio de un mismo
  organismo. Comprobé HTTP 200 en `estres` y `resram` para 2005, 2008, 2010, 2012 y 2014, y en
  `notas` desde 2008 y `estevpat` desde 2010: la serie del BCU llega, como mínimo, a 2005.
- accion_sugerida: mínimo indispensable, 2015-2024 completo (que es lo que pidió el brief). Si se
  cierra con menos, la línea de cobertura tiene que decir tres cosas, no una: que el BSE existe
  desde 1911, que los estados contables ante el regulador existen desde al menos 2005, y hasta
  dónde está cargada la ficha. Ocultar el rango sin decirlo es el punto 3 de la lista de
  presentación y, en la práctica, un problema de Regla 0.

### Dependencia de un solo grupo de medios
- Sin objeción. Los dos argumentos en contra vienen de `ambito` (grupo `grupo-ambito`) y `el-pais`
  (grupo `scheck-aguirre`), que son grupos distintos; el argumento a favor viene de `cronicas`,
  que todavía no existe en `content/medios/` y habrá que declararle grupo. Todo lo financiero es
  `documento_oficial` de `bse` y `bcu`. No hay copia de agencia repetida ni un grupo único
  sosteniendo un lado. Sí hay un desbalance de **tipo** de fuente, no de grupo: los dos lados del
  debate son prensa cuando existe diario de sesiones (ver O-10).

### Riesgo legal
- No hay casos judiciales en el lote y `notas.md` lo declara. Ninguna afirmación sobre personas
  identificables excede a su fuente, salvo las dos que marqué (O-12, donde la ficha presenta como
  hechos las afirmaciones de una parte en una disputa, y O-9, donde atribuye un error al BSE). Las
  designaciones de Amorín Batlle y Otheguy están respaldadas por documentos oficiales de
  Presidencia. Nada que bajar a `hipotesis/`.

---

## Objeciones al brief

Ninguna de Regla 0. El brief pide explícitamente el mismo esfuerzo para los dos lados
(«mismo esfuerzo para cada lado, y si un lado te cuesta más, decilo en `notas.md`»), aclara que
«un dirigente que defiende una regla no es un argumento en contra de esa regla, y la imputación
sobre quién hizo lobby no es un argumento», y pide desenlaces y comparaciones solo con autor. La
sección «Inventario de documentos» agregada el 2026-09-09 es la corrección correcta de un error
anterior. No hay nada en el brief que pida seleccionar, omitir o encuadrar por partido o persona.

Una observación de método, no de simetría: el brief manda mirar `.cache/inventarios/bse.com.uy.jsonl`
antes de decir que un documento no existe, y el lote lo hizo. Pero el inventario del sitio de la
empresa no dice nada sobre lo que publica el **regulador**, que para una aseguradora es donde
está todo. Para el próximo brief de una empresa supervisada (BROU, BHU, aseguradoras, AFAP),
conviene que el inventario obligatorio incluya el sitio del supervisor. El brief tampoco nombró la
Hemeroteca del Parlamento para los argumentos, aunque `docs/diccionario-empresas.md` ya la manda
usar para todo lo legislativo; agregarlo hubiera evitado O-10.

Anoto también, como corresponde según CLAUDE.md: corro en Opus, que es lo que la tabla de modelos
asigna al crítico, y no hay divergencia entre esa tabla y esta corrida.

---

## Discrepancias

**No se registra ninguna**, y lo digo explícitamente porque la ausencia de hallazgos también se
audita. Revisé las tres candidatas del lote y ninguna pasa el umbral:

1. «El Observador, marzo 2022: ganancia récord de US$ 143 millones» (§ hipótesis de `notas.md`).
   No hay discrepancia: el resultado 2021 del estado de resultados ante el BCU es
   $ 6.408.974.356, que a la cotización de cierre da unos US$ 143 millones. Además la nota nunca
   se abrió (O-18), así que no hay «lo publicado» que cotejar.
2. «Ley 7.975» (IMPO) vs «Ley 7.915» (nota del BSE ante el BCU). Es una divergencia entre dos
   documentos oficiales, no entre prensa y documento: la regla es «solo contra fuente primaria», y
   acá las dos son primarias. Va como A-2.
3. Ámbito: «la empresa aseguradora estatal tiene "copado" más de la mitad del mercado». No tengo
   documento primario de participación de mercado leído en esta sesión que decida; calcularla yo
   desde el CONSOLIDADO del BCU sería precisamente lo que la colección prohíbe. Sin el documento
   que decide, es un desacuerdo, no una discrepancia.

Por eso no escribo `discrepancias.yaml` en el lote.

---

## Cobertura

Se leyeron tres notas de prensa en el lote. **No emito ningún registro de tono promovible**, y
el motivo es sustantivo, no formal: `src/schemas/cobertura.ts` exige `politico` (de
`content/politicos/`) o `partido`, y `evento` (de `content/eventos/`). Ninguna de las tres notas
tiene como sujeto a un político del corpus ni a un partido: el sujeto es una empresa pública y sus
jerarcas. Forzar un `politico` para poder emitir el registro metería ruido en la métrica que el
sitio usa justamente para medir sesgo —le atribuiría a Lacalle Pou, por ejemplo, el tono de una
nota sobre una disputa de primas de la pesca, porque la CIPU lo arrobó en un tuit—. Eso sería un
problema de Regla 0 por la puerta de atrás.

Dejo las tres evaluadas y no emitibles, con el mismo criterio para las tres, para que el editor
las promueva el día que existan el político y el evento:

```yaml
propuestas_no_emitibles:
  - medio: ambito
    url: https://www.ambito.com/uruguay/empresas-aseguradoras-abogan-mayor-desregulacion-del-sector-n6095305
    titulo: Empresas aseguradoras abogan por mayor "desregulación" del sector
    fecha: 2024-12-20
    evento: "propuesto:debate-monopolio-accidentes-de-trabajo-bse"
    politico: null            # ningún político de content/politicos es sujeto de la nota
    sujeto_real: BSE (empresa pública)
    tono: desfavorable
    justificacion: >-
      El encuadre es del propio medio, no de la fuente citada, y adopta el marco del sector
      privado sin respuesta del BSE: "El vocero empresarial reflexionó sobre las inusuales
      características del mercado uruguayo, donde la empresa aseguradora estatal tiene 'copado'
      más de la mitad del mercado, a pesar de varias 'desregulaciones' que según el sector privado
      no alcanzan."
    _no_emitible: falta politico o partido; falta el evento en content/eventos/

  - medio: el-pais
    url: https://www.elpais.com.uy/negocios/noticias/de-falta-de-mantenimiento-a-incapacidad-para-detectar-denuncias-falsas-cruce-entre-el-bse-y-gremiales-pesqueras
    titulo: >-
      De "falta de mantenimiento" a "incapacidad" para detectar denuncias falsas: cruce entre el
      BSE y gremiales pesqueras
    fecha: 2024-04-09
    evento: "propuesto:disputa-prima-pesca-bse-2024"
    politico: null            # nombra a Amorín Batlle, que no está en content/politicos
    sujeto_real: BSE (empresa pública), presidido por José Amorín Batlle
    tono: neutral
    justificacion: >-
      Reproduce las dos cartas con extensión pareja y da la respuesta técnica del ente en sus
      propias palabras: "Según Cerruti del BSE, 'aún existe una insuficiencia de ingresos por
      primas que no permite cubrir la siniestralidad del sector, y que lleva a que, desde el punto
      de vista técnico, nos sea imposible bajar la tasa de prima por debajo del valor actual'."
    _no_emitible: falta politico o partido; falta el evento en content/eventos/

  - medio: cronicas
    url: https://www.cronicas.com.uy/news-69340-uruguay-entiende-los-seguros-de-accidentes-de-trabajo-no-como-un-negocio-sino-como-una-politica-social
    titulo: >-
      "Uruguay entiende los seguros de accidentes de trabajo no como un negocio, sino como una
      política social"
    fecha: 2026-05-29
    evento: "propuesto:debate-monopolio-accidentes-de-trabajo-bse"
    politico: null            # entrevista a Marcos Otheguy, que no está en content/politicos
    sujeto_real: BSE (empresa pública), presidido por Marcos Otheguy
    tono: neutral
    justificacion: >-
      Es pregunta y respuesta sin comentario del medio: el titular es cita textual del
      entrevistado ("Uruguay entiende los seguros de accidentes de trabajo no como un negocio,
      sino como una política social") y no hay ninguna frase del cronista que valore. Sin frase
      propia del medio, el valor por defecto es neutral, aunque no haya repregunta.
    _no_emitible: falta politico o partido; el medio "cronicas" todavía no existe en content/medios/
```

Nota para el editor: si en algún momento entran `amorin-batlle` y `otheguy` a `content/politicos/`
y se crea el evento del debate sobre el monopolio de accidentes de trabajo, estas tres pasan a ser
emitibles tal cual están, y forman un conjunto útil: dos notas del mismo debate con encuadres
opuestos y una tercera neutral. El umbral que apliqué es el mismo para las tres, y es el de
siempre: `favorable` o `desfavorable` solo con una frase del medio, no del entrevistado ni del
titular.
