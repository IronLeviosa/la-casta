# Crítica — corrida 2026-09-07-empresas-brou

Modelo: Opus 5 (`claude-opus-5[1m]`). Corro en Opus por la regla de modelos del mantenedor
(2026-09-07): Opus solo para el crítico. Lo digo como corresponde en el informe.
Lote: `inbox/empresas/brou/2026-09-07/`
Registros revisados: 1 (`empresas.yaml`, ficha `brou`): 10 años de `finanzas[]`, 8 con `segmentos[]`,
`monopolio` con 2 argumentos a favor y 1 en contra, 1 comparación, 11 hitos, 98 entradas de `fuentes`
sobre 17 documentos distintos.

Regla 0: el brief no pide asimetría y el investigador declaró "objeciones_al_brief: ninguna". Yo
tampoco encuentro un pedido asimétrico en el brief. Sí encuentro asimetría en el resultado, y está
detallada en B2, B3 y C11: las omisiones del lote caen todas del mismo lado (el que sostiene la
reserva legal). El mismo criterio que se le pide acá a BROU se le pide a ANCAP, UTE, ANTEL y ANP.

## Resumen

| # | Campo | Severidad | Qué pasa |
|---|---|---|---|
| B1 | `finanzas[2017..2024].*.cotizacion` / `.usd` | bloquea | Faltan en 8 de 10 años; los balances las declaran. El gráfico de la página solo toma puntos con `usd`: la ficha quedaría con 2 puntos y sin ninguna serie de segmentos. |
| B2 | `monopolio.argumentos_en_contra[0]` | bloquea | El `texto` atribuye a Labat una cláusula que la fuente no trae; la cita sale de un preview con muro de pago y empieza cortada. El único argumento en contra del lote no está respaldado. |
| B3 | `monopolio.alcance` | bloquea | Omite el artículo 24 de la Ley 18.716 (garantía del Estado sobre depósitos y operaciones), el privilegio legal más grande y el que sostiene el lado en contra. El investigador lo vio y no lo cargó. |
| C1 | `finanzas[2017]` | corregir | El `concepto` afirma que no existe estado financiero propio de 2017; existe `Balances-Dic17-Esp.pdf` en el inventario, y hay quiebre de norma contable sin declarar entre 2016 y 2017. |
| C2 | `capitalizaciones_del_estado` | corregir | Ausente en 10 años cuando el estado de cambios en el patrimonio trae "Aumentos de capital" con guion. Es el cero con cita que pide el diccionario. |
| C3 | `transferencias_al_estado` | corregir | Captura solo el art. 11. En 2024 salieron $ 17.839,4 M y la ficha muestra $ 11.827,0 M; el resto vive en prosa. |
| C4 | `finanzas[].nota` | corregir | 8 notas de 397 a 528 caracteres; `pnpm validar` ya las marca. |
| C5 | `*.concepto` | corregir | La página los imprime como notas al pie numeradas; hay conceptos de 2 a 4 oraciones. |
| C6 | `impuestos_pagados` | corregir | Suma devengada hecha por el registro, sin declarar que es devengada, existiendo la cifra de caja en el flujo de efectivo. 2016 vacío sin abrir la memoria de ese año. |
| C7 | `comparaciones` | corregir | El informe de CPA Ferrere trae ROE, ROA, morosidad y depósitos: es un `analisis.yaml` con página propia, no una fila suelta con el resto descartado. |
| C8 | `hitos` | corregir | El hito 2002 se apoya en la página institucional del banco y no en la Ley 17.523; un hito no verificable ("una prestigiosa revista"); orden y duplicación de 2007. |
| C9 | `monopolio.alcance` (forma) | corregir | Un párrafo de ~300 palabras en un solo `<p>`, sin una sola cifra, teniendo las cifras a mano. |
| C10 | `monopolio.normas[3]` | corregir | La cita del art. 25 corta "a la fecha de la promulgación de la presente ley", que es lo que fija su alcance. |
| C11 | `argumentos_a_favor[1]` | corregir | Ache dice literalmente que no está en contra del artículo; un pedido de información no es un argumento a favor de la reserva. |
| C12 | cobertura del período | corregir | El inventario tiene `Balances-Dic09` a `Dic14` y memorias 2016-2024 sin abrir; ANCAP, UTE y ANTEL acaban de corregirse hacia atrás. |
| C13 | `finanzas[2015..2017].transferencias_al_estado` | corregir | Tres años sin dato cuando el documento que lo tendría (memorias 2016 y 2017, comparativa del estado de cambios en el patrimonio 2018) no se abrió. |
| A1 | `finanzas[2015].resultado_ejercicio.usd` | aviso | 197,9 contra 5.909 / 29,87 = 197,8. |
| A2 | `resultado_ejercicio` 2019-2024 | aviso | Sale de la nota de segmentos y no del renglón del estado de resultados, que existe y coincide. |
| A3 | `nota` 2024 (fecha ANDE) y art. 140 | aviso | El balance fecha el pago a ANDE el 26/8 y la ficha el 1/8; el balance dice "artículo 140", que no existe. |
| A4 | fuente `creacion-del-banco` | aviso | 8 citas históricas dependen de una página institucional sin fecha, cargada con `fecha: 2026-09-09`. |
| A5 | patrimonio | aviso | Serie de 10 números en prosa, sin campo ni gráfico. |
| A6 | `fecha` de la nota de la diaria | aviso | El cuerpo dice 26 de julio de 2021; la fuente carga 2021-07-27. |
| A7 | medios faltantes | aviso | `brou`, `poder-judicial`, `cpa-ferrere`, ya declarados en `notas.md`. |
| A8 | `segmentos[].nota` | aviso | La explicación de "Otros" está solo en 2017. |

3 `bloquea`, 13 `corregir`, 8 `aviso`.

## Objeciones por campo

### B1 — `finanzas[2017..2024]`: falta `cotizacion` y `usd` en 8 de 10 años
- severidad: **bloquea**
- tipo: contexto_omitido / presentacion
- objecion: `notas.md` afirma que "desde 2018 (formato NIIF), los Estados Financieros de BROU se
  presentan enteramente en pesos uruguayos y no declaran una cotización de cierre única (solo
  mencionan cotizaciones puntuales de transacciones específicas)". Es falso. Cada uno de los siete
  PDF que el lote ya bajó trae la nota 2.1.4 "Moneda distinta a la funcional" con la cotización de
  cierre del dólar, que es exactamente la "nota de moneda extranjera / tipo de cambio de cierre" que
  pide `docs/diccionario-empresas.md`. La consecuencia no es cosmética: en
  `src/pages/empresas/[slug].astro` la serie del gráfico se arma con
  `usdMillones(...)`, que devuelve `undefined` cuando falta `usd`, y después
  `.filter((s) => s.puntos.length > 0)` borra la serie entera. Con el lote como está, la ficha del
  BROU dibujaría **un solo gráfico con dos puntos** (2015 y 2016), **cero series de segmentos** —
  aunque hay ocho años cargados con cuatro segmentos cada uno — y **cero puntos** de transferencias,
  impuestos y capitalizaciones; y el método al pie diría "Todos los montos están en millones de
  dólares" mientras la tabla muestra pesos.
- cita_de_contexto: "El siguiente es el detalle de las principales cotizaciones de las monedas
  distintas a la funcional operadas por el Banco al 31 de diciembre de 2024 y al 31 de diciembre de
  2023: 31.12.2024 31.12.2023 Dólar estadounidense 44,066 39,022"
  (https://www.brou.com.uy/documents/20182/52654/auditorias-2024.pdf/2ae0106d-c47b-46a9-8535-c014c8f23b47,
  carácter ~27.900). La misma nota en el balance 2019: "Dólares estadounidenses 37,336 32,39"; en el
  balance 2018: "Dólares estadounidenses 32,39 28,764".
- accion_sugerida: cargar `usd`, `unidad: millones`, `tipo_cambio: cierre` y `cotizacion` en los 8
  años faltantes, cada uno con su propia cita del balance de ese año (o de la comparativa, declarada
  en `nota`). Cotizaciones declaradas: 2017 = 28,764 · 2018 = 32,39 · 2019 = 37,336 · 2020 = 42,34 ·
  2021 = 44,695 · 2022 = 40,071 · 2023 = 39,022 · 2024 = 44,066. Para control, el resultado del
  ejercicio daría USD 204,6 / 440,2 / 472,1 / 500,4 / 390,8 / 228,9 / 606,2 / 773,7 M — que el
  validador recalcula solo; no se copian de acá, se cargan con la cita. Corregir también el párrafo
  de `notas.md` "Sobre la cotización del dólar", que hoy documenta una ausencia que no existe.

### B2 — `monopolio.argumentos_en_contra[0]` (Diego Labat)
- severidad: **bloquea**
- tipo: cita_fuera_de_contexto / riesgo_legal
- objecion: tres problemas encadenados sobre el único argumento en contra del lote.
  (1) El `texto` termina en "…, **no la protección de la posición de un banco en particular**". Esa
  cláusula no está en ningún lugar del texto disponible de la nota: se la agrega el registro y se la
  atribuye por nombre y cargo al presidente del BCU. Es afirmar más de lo que la fuente respalda
  sobre una persona identificable.
  (2) La `cita` empieza en "es velar por esa estabilidad…", y lo que la precede en la nota es el
  fragmento truncado "…debe guiar", que es donde el muro de pago corta el texto. No se sabe qué es
  "lo que debe guiar" ni a qué pregunta responde: se cita el resto de una oración cuyo sujeto no se
  leyó. El corpus tiene 1.346 caracteres de esa nota, casi todos de presentación.
  (3) La misma porción legible de la nota trae, inmediatamente después, la frase que el registro no
  recoge y que contradice el argumento a favor que sí cargó (AEBU, "deteriora la competitividad de
  las instituciones públicas"). Omitir la respuesta cuando está en el mismo párrafo que la cita
  usada es contexto omitido en la dirección que favorece a un lado.
  Sumado a C11, el lote no tiene ningún argumento en contra sostenido por su fuente: cumple el
  mínimo del esquema en la forma y no en el fondo.
- cita_de_contexto: "…debe guiar", manifestó Labat, "es velar por esa estabilidad del sistema
  financiero, por la solidez, la solvencia, la eficiencia y el desarrollo del sistema financiero". A
  su vez, Labat dijo que, en caso de aprobarse, esta normativa "no va a afectar la competitividad
  del Banco de la República (BROU)" sino…"
  (https://ladiaria.com.uy/politica/articulo/2021/7/rendicion-de-cuentas-tras-exposicion-de-labat-coalicion-retiro-articulo-que-habilitaba-a-organismos-publicos-a-depositar-en-banca-privada/)
- accion_sugerida: **`documento_previsible`**. Labat expuso ante la Comisión de Presupuestos
  integrada con Hacienda de la Cámara de Representantes el jueves 22 de julio de 2021; esa sesión
  tiene versión taquigráfica publicada por el Parlamento, y es la fuente que decide qué dijo. Hay
  que buscarla en `parlamento.gub.uy` (Cámara de Representantes, Comisión de Presupuestos integrada
  con Hacienda, Carpeta de la Rendición de Cuentas 2021) antes de cerrar el lote. En el mismo lugar
  está el otro documento que falta de ese lado: el articulado y la **exposición de motivos del
  artículo 281** del proyecto que envió el Poder Ejecutivo, que es literalmente el argumento del
  gobierno para abrir los depósitos y hoy no está en la ficha. Mientras tanto, el argumento de
  Labat, si se conserva, tiene que quedar con la cita literal disponible y sin la cláusula
  agregada, y con `quien` diciendo que es el regulador describiendo el criterio, no que se opone a
  la reserva. Otros lugares del mismo lado, con nombre, para el resolvedor: Asociación de Bancos
  Privados del Uruguay (ABPU); consultas del Artículo IV del FMI sobre Uruguay y el FSAP para el
  sistema financiero uruguayo; informes del Banco Mundial sobre banca pública en Uruguay; la
  discusión parlamentaria de la Ley 19.210 (inclusión financiera) y de la Ley 19.889 (LUC) sobre
  dónde se pagan sueldos y pasividades.

### B3 — `monopolio.alcance`: falta el artículo 24 de la Ley 18.716
- severidad: **bloquea**
- tipo: asimetria / contexto_omitido
- objecion: el `alcance` describe dos cosas reservadas (depósitos de organismos públicos y depósitos
  judiciales) y omite la tercera, que es la más grande y la más citada en cualquier discusión sobre
  banca pública: el Estado responde por los depósitos y las operaciones del banco. Está en el
  artículo 24 de la misma Ley 18.716 que el registro cita seis veces, y la Ley 17.523 la da por
  supuesta ("Sin perjuicio de la garantía del Estado establecida en sus respectivas cartas
  orgánicas"). El propio `consultas.jsonl` del lote registra una búsqueda cuyo resultado dice
  "confirma el argumento de garantía estatal como ventaja competitiva de BROU": se encontró y no se
  cargó. Un lector que lea esta ficha entera no se entera de que el banco tiene garantía soberana
  ilimitada mientras sus competidores tienen un seguro de depósitos acotado. La omisión cae toda del
  lado que sostiene la reserva, que es el mismo lado que B2 y C11: por eso es Regla 0 y no un olvido.
  El brief pedía verificar además "pago de sueldos y pasividades del Estado, garantías": de esas
  tres, ninguna está en el `alcance`.
- cita_de_contexto: "CAPITULO VII - RELACIONES DEL BANCO CON EL PODER EJECUTIVO Artículo 24 El
  Estado responde directamente de los depósitos y operaciones que realice el Banco."
  (https://impo.com.uy/bases/leyes/18716-2010, carácter ~19.290). Y: "Sin perjuicio de la garantía
  del Estado establecida en sus respectivas cartas orgánicas, el Fondo de Estabilidad del Sistema
  Bancario garantiza el total cumplimiento de los depósitos de los ahorristas del Sector No
  Financiero en moneda extranjera existentes al 30 de julio de 2002 en el Banco de la República
  Oriental del Uruguay y el Banco Hipotecario del Uruguay"
  (https://www.impo.com.uy/bases/leyes/17523-2002, art. 2).
- accion_sugerida: agregar el art. 24 a `monopolio.normas` con su cita literal y una oración en
  `alcance`; y verificar, con la misma búsqueda, si sigue vigente el régimen de pago de sueldos y
  pasividades del Estado por BROU y qué le hizo la Ley 19.210. Sin esto, el lado "en contra" no
  tiene ni su hecho central ni su vocero.

### C1 — `finanzas[2017]`: existe el documento propio y hay un quiebre de norma sin declarar
- severidad: corregir
- tipo: contexto_omitido
- objecion: el `concepto` dice "No se localizó un estado financiero propio de 2017 en el formato
  NIIF que BROU usa desde 2018", y `notas.md` extiende la conclusión a que para 2015-2016 "lo único
  disponible es un informe de indicadores". El inventario que el brief mandó mirar
  (`.cache/inventarios/brou.com.uy.jsonl`) tiene `Balances-Dic17-Esp.pdf`, de la misma serie que los
  informes de 2015 y 2016 que el lote **sí** usó como fuente de `resultado_ejercicio`. Leído, ese
  documento da para 2017: Resultado del Ejercicio $ 5.025 M, Impuesto a la Renta $ 2.894 M,
  Patrimonio $ 45.198 M y cotización del dólar 28,76. La ficha carga 5.886,4 M (comparativa NIIF del
  balance 2018) y patrimonio 45.341,2 M. La diferencia es real y tiene nombre: es un cambio de norma
  contable. El diccionario permite cargar el reexpresado, pero exige "con la cifra original en
  `nota`", y eso no está. Peor: 2015 y 2016 quedan en norma vieja (con "Resultado por Inflación
  -2.900 / -2.944", que en 2017 pasa a 0) y 2017-2024 en NIIF, así que el gráfico y la tabla van a
  mostrar un salto de 2.182 a 5.886 entre 2016 y 2017 como si fuera el negocio y no la norma.
- cita_de_contexto: "Resultado antes de I.R. 7.442 5.278 7.919 / Impuesto a la Renta -1.533 -3.096
  -2.894 / Resultado del Ejercicio 5.909 2.182 5.025" y "Patrimonio 36.830 38.894 45.198" y
  "Cotización del Dólar a fin de 29,87 29,26 28,76"
  (https://web.archive.org/web/20191111223947id_/https://www.brou.com.uy/documents/20182/28438/Balances-Dic17-Esp.pdf/1982ce87-2839-479b-b908-23b626033bf5)
- accion_sugerida: corregir el `concepto` de 2017 (el documento propio existe), dejar la cifra NIIF
  con la original en `nota`, y declarar una vez en el `resumen` que la serie tiene dos normas
  contables con el corte en 2017. Si el editor prefiere la serie homogénea, la alternativa simétrica
  es cargar 2009-2017 con los informes de indicadores y 2018-2024 con NIIF, diciendo dónde está el
  corte. Cualquiera de las dos, pero declarada.

### C2 — `capitalizaciones_del_estado`: es un cero con cita, no una ausencia
- severidad: corregir
- tipo: contexto_omitido
- objecion: `notas.md` razona que un cero "afirmaría que se buscó el dato y no hubo capitalización,
  cuando lo que se puede decir es que no se encontró". El razonamiento sería correcto si el documento
  callara. No calla: el estado de cambios en el patrimonio separado tiene una línea propia,
  "4.1 Aumentos de capital", con guion en 2023 y en 2024, y el aumento del capital integrado
  ($ 53.950,3 M → $ 58.624,5 M) se explica íntegramente por la línea "4.7 Distribución de
  dividendos", es decir, por capitalización de utilidades propias. Eso es exactamente lo que el
  diccionario llama cero con cita. Dejarlo ausente hace que la página muestre diez huecos en la
  serie "El Estado puso" cuando lo que corresponde mostrar es que el Estado no puso nada y el banco
  se capitalizó solo: la regla 11 de presentación ("un hueco no es un cero") corta para los dos
  lados.
- cita_de_contexto: "4. Otras variaciones del patrimonio neto 4.674.200 1.168.550 (28.224)
  (23.653.974) … 4.1 Aumentos de capital ‐ ‐ ‐ ‐ ‐ … 4.7 Distribución de dividendos 4.651.621
  1.162.905 ‐ (23.653.974) (17.839.448)"
  (auditorias-2024.pdf, estado de cambios en el patrimonio separado, carácter ~12.100)
- accion_sugerida: cargar `capitalizaciones_del_estado: {pesos: 0, ...}` con esa cita para cada año
  cuyo estado de cambios en el patrimonio lo diga (2018-2024, más 2017 por comparativa) y dejar
  ausente 2015-2016, que no tienen ese estado en el informe de indicadores. En `hitos`, la
  capitalización que sí hubo es de 2002 y no es de capital: ver C8.

### C3 — `transferencias_al_estado`: la cifra visible es dos tercios de lo que salió
- severidad: corregir
- tipo: presentacion / contexto_omitido
- objecion: el registro reserva el campo para el artículo 11 (Rentas Generales) y manda los pagos del
  artículo 40 a la `nota`. El resultado es que en 2024 la página muestra $ 11.827,0 M cuando el
  estado de cambios en el patrimonio dice que del resultado de 2023 salieron del banco
  $ 17.839,4 M, y en 2023 muestra $ 4.586,5 M cuando salieron $ 7.310,1 M. La aritmética cierra
  exactamente con lo que la propia ficha puso en prosa (11.827,0 + 1.202,5 + 490,5 + 482,9 + 3.836,6
  = 17.839,5), así que no es un dato que falte: es un dato que está escondido en una nota al pie. Y
  no son transferencias a un tercero: el balance dice "se transfiere **al MEF**, con destino a obras
  previstas en el Proyecto Ferrocarril Central". El precedente del Fondo de Estabilización
  Energética de UTE, que el diccionario usa para excluir aportes a fondos, no aplica igual: aquel
  fondo vuelve a UTE, y ANDE, ACAU y el Ferrocarril Central no vuelven a BROU.
- cita_de_contexto: "4.7 Distribución de dividendos 4.651.621 1.162.905 ‐ (23.653.974)
  (17.839.448)" y "El 27 de setiembre de 2024 … se transfiere al MEF, con destino a obras previstas
  en el Proyecto Ferrocarril Central, la suma de miles de $ 3.836.557 por el remanente de lo
  dispuesto por el artículo 40 de la Ley Nº 18.716" (auditorias-2024.pdf, caracteres ~12.100 y
  ~144.400)
- accion_sugerida: no decido el fondo; las dos salidas simétricas son (a) cargar en
  `transferencias_al_estado` el total distribuido, con un `concepto` de una oración que diga
  "artículo 11 más artículo 40", o (b) mantener el artículo 11 y que el total salga a la vista por
  otro lado (una oración en el `resumen` con la serie, o un hito por año). Lo que no puede quedar es
  el total solo en prosa dentro de una nota al pie. Y la convención que se elija tiene que ser la
  misma para ANCAP, UTE, ANTEL y ANP: hoy `docs/diccionario-empresas.md` no resuelve el caso de un
  aporte por ley a un fondo que no vuelve a la empresa. Eso es una regla editorial y por Regla 0 se
  escribe una vez para todos, no por empresa.

### C4 — `finanzas[].nota`: ocho notas que son párrafos
- severidad: corregir
- tipo: presentacion
- objecion: `pnpm validar --inbox` ya lo marca en 2016, 2017, 2018, 2020, 2021, 2022, 2023 y 2024
  (de 397 a 528 caracteres). La página imprime cada `nota` como nota al pie numerada de la tabla
  (`notaResultado: notaIdx(f.nota)`), así que ocho párrafos quedan abiertos debajo de la tabla. El
  caso peor es 2023, con cinco pagos del artículo 40 enumerados con fecha y monto dentro de una
  nota, y 2024 con cuatro: eso no es una nota al pie, es una tabla escrita en prosa.
- accion_sugerida: una oración por año. Los pagos del artículo 40 salen con la solución de C3
  (campo, hito o `resumen`). La convención repetida diez veces ("Patrimonio al cierre de …") va una
  sola vez, en el `resumen`, como pide el propio validador para ANCAP.

### C5 — `concepto` de los montos: van al pie de la tabla, no son párrafos
- severidad: corregir
- tipo: presentacion
- objecion: la página numera y lista `f.transferencias_al_estado?.concepto` y
  `f.capitalizaciones_del_estado?.concepto` como notas al pie. Hay conceptos de tres y cuatro
  oraciones: el de `impuestos_pagados` 2015 explica de dónde sale la suma; el de
  `resultado_ejercicio` 2017 afirma además que no existe documento propio (ver C1); los de
  `transferencias_al_estado` describen dos resoluciones con fecha y porcentaje.
- accion_sugerida: `concepto` de una oración, siempre; la explicación del método (por qué se suman
  dos líneas de impuestos, qué norma rige cada tramo) va una vez en el `resumen`.

### C6 — `impuestos_pagados`: devengado sin decirlo, y 2016 vacío sin agotar el inventario
- severidad: corregir
- tipo: contexto_omitido
- objecion: la decisión de sumar "Impuesto a las ganancias" (estado de resultados) e "Impuestos,
  tasas y contribuciones" (nota de gastos generales) es razonable, está declarada y evita el
  antipatrón del IRAE solo; las dos líneas están verificadas literales en el balance 2024. Pero la
  regla transversal 3 del diccionario pide caja y no devengado en impuestos, y la cifra de caja
  existe en el mismo documento: el estado de flujos de efectivo separado trae "5. Cobros/pagos por
  Impuesto a las ganancias (6.760.351) (6.879.875)", contra los 7.436.739 devengados que usa la
  ficha (9,1 % de diferencia en 2024). Ningún `concepto` dice que la cifra es devengada.
  Aparte, 2016 queda sin dato porque el informe de indicadores de ese año no desglosa la línea —
  verificado, no la trae —, pero `memoria-2016-esp.pdf` está en el inventario, con estados contables
  y notas, y no se abrió.
- cita_de_contexto: "5. Cobros/pagos por Impuesto a las ganancias (6.760.351) (6.879.875)"
  (auditorias-2024.pdf, estado de flujos de efectivo separado, carácter ~17.800); "Impuestos, tasas
  y contribuciones (3.249.563) (2.831.573)" (ídem, nota de gastos generales, carácter ~152.900)
- accion_sugerida: decir en una oración del `resumen` que la serie de impuestos es devengada y cuál
  es la de caja, o cambiar de criterio; y abrir `memoria-2016-esp.pdf` (y `memoria-2017-esp.pdf`)
  antes de dejar 2016 vacío.

### C7 — `comparaciones`: el informe de CPA Ferrere es un análisis, no una fila
- severidad: corregir
- tipo: presentacion / documento_previsible
- objecion: la única comparación está bien hecha —autor identificable, período, dos valores con
  unidad, cita literal, y la URL es la del autor y no una copia— pero `notas.md` explica que se
  cargó una sola fila "porque no llegan a ser tres o más comparaciones del mismo documento (umbral
  que activaría un registro de `analisis.yaml`)". Eso es al revés: el umbral del validador es un
  aviso, no un tope, y tanto el brief como el punto 9 de la lista de presentación dicen que un
  análisis con varias cifras de una misma fuente va a `analisis.yaml` con página propia. El informe
  trae, además del ROE, el resultado del sistema (USD 1.046 M, USD 530 M menos que 2024), el ROA, la
  morosidad, los depósitos y la posición en moneda extranjera del BROU (51 % del activo contra 57 %
  el año anterior). Dejar cuatro cifras afuera para no cruzar un umbral es perder información que el
  lector podía verificar.
- cita_de_contexto: "El resultado del sistema bancario en 2025 totalizó USD 1.046 millones, es
  decir, USD 530 millones menos que el año anterior" y "La posición neta en moneda extranjera que
  incluye posición fuera de balance del BROU en 2025 se ubica en 51% del activo en 2025 vs 57% el
  año anterior" (https://www.cpaferrere.com/es/novedades/sistema-bancario-en-2025-desempeno-tendencias-y-cl/)
- accion_sugerida: escribir `analisis.yaml` en el lote con la forma de `src/schemas/analisis.ts`,
  `calificacion: discutible` como marcador en cada afirmación, y **cotejar cada cifra contra el
  documento oficial que la propia nota nombra**: "el Banco Central del Uruguay (BCU) publicó los
  boletines mensuales del sistema bancario correspondientes al cierre de 2025". Es un
  `documento_previsible`: el BCU publica esos boletines y la serie de indicadores por institución en
  `bcu.gub.uy`. Un análisis de terceros que queda en `discutible` porque nadie abrió el boletín del
  regulador es media investigación. Dejar en la ficha una sola fila que lleve a esa página.

### C8 — `hitos`
- severidad: corregir
- tipo: contexto_omitido / presentacion
- objecion: (a) el hito de 2002 se apoya solo en la página institucional del banco y cuenta la mitad:
  dice que se reprogramaron los depósitos y no dice con qué. La Ley 17.523 es la fuente primaria,
  está en IMPO y agrega el hecho que le importa al dueño: un Fondo de Estabilidad del Sistema
  Bancario de US$ 1.500 millones de organismos multilaterales que garantizó los depósitos del BROU y
  del BHU y les entregó las sumas "en carácter de préstamo". Ese es el episodio en que el Estado
  puso plata detrás del banco, y hoy la ficha no lo dice.
  (b) el hito "BROU distinguido como Mejor Banco del Uruguay" cita "una prestigiosa revista
  internacional especializada" sin nombrarla, sale de la autopresentación del banco y no se puede
  verificar. En una ficha escrita para el contribuyente, un premio sin fuente verificable es
  decoración; la lista de presentación pide ayudas que condensen información y ninguna por decorar.
  Nombrar la publicación con su nota, o sacarlo.
  (c) orden y duplicación: hay dos hitos fechados 2007 y el de la Ley 18.716 (2010) queda antes del
  de "Mejor Banco" ('2007') en el arreglo; la línea de tiempo horizontal se dibuja con el orden del
  arreglo.
- cita_de_contexto: "Artículo 1 Créase un Fondo de Estabilidad del Sistema Bancario que se integrará
  con los desembolsos de los organismos multilaterales de crédito por un monto total de
  US$ 1.500.000.000" y "Las sumas que suministre el Fondo a dichos Bancos lo serán en carácter de
  préstamo en los términos que establezca la reglamentación"
  (https://www.impo.com.uy/bases/leyes/17523-2002, arts. 1 y 2)
- accion_sugerida: reescribir el hito 2002 con la Ley 17.523 como fuente; sacar o nombrar el premio;
  ordenar por fecha. Candidatos a verificar con documento antes de agregarlos, con el mismo umbral:
  creación de República AFAP y de República Microfinanzas, y qué le hizo al negocio la Ley 19.210 de
  inclusión financiera.

### C9 — `monopolio.alcance`: un párrafo de 300 palabras y sin una cifra
- severidad: corregir
- tipo: presentacion
- objecion: la página lo imprime como un solo `<p class="prosa">`. Adentro hay tres normas con
  número y año, dos actividades reservadas, un episodio parlamentario de 2021 y su desenlace. Y no
  hay un solo número que le diga al lector de qué tamaño es lo reservado, teniendo el lote dos
  fuentes ya leídas que lo dicen.
- cita_de_contexto: "Los depósitos del sector estatal totalizan US$ 1.623 millones, lo que significa
  el 9,7% de los depósitos totales de todo el sector no financiero del país. De ellos, actualmente
  el 96% se encuentra en los bancos propiedad del Estado"
  (https://www.elobservador.com.uy/nota/aebu-pide-dejar-sin-efecto-articulo-que-elimina-exclusividad-del-brou-en-depositos-de-instituciones-publicas-20217695135,
  cifras de AEBU). Y del propio BROU: "Sector Público 42.996 49.239 49.113"
  (Balances-Dic17-Esp.pdf, estado de situación - pasivo, depósitos por sector, 2015-2017).
- accion_sugerida: `alcance` en tres o cuatro oraciones con el tamaño de lo reservado atribuido a
  quien lo mide; el detalle normativo ya vive en `normas`, y el episodio de 2021 ya vive en `hitos`.

### C10 — `monopolio.normas[3]`: la cita del artículo 25 corta donde cambia el sentido
- severidad: corregir
- tipo: cita_fuera_de_contexto
- objecion: la cita cargada termina en "…disposiciones legales y reglamentarias vigentes." El
  artículo sigue: "**a la fecha de la promulgación de la presente ley**". Sin esa cláusula, el
  artículo se lee como una regla permanente; con ella, es un reenvío congelado al régimen vigente en
  2010. La misma cita truncada se repite dentro de `alcance`.
- cita_de_contexto: "Artículo 25 Los depósitos judiciales, los provenientes de instituciones
  públicas estatales o no estatales, y los que deban efectuar los particulares en garantía de
  obligaciones y contratos con el Estado se efectuarán de conformidad con las disposiciones legales
  y reglamentarias vigentes a la fecha de la promulgación de la presente ley."
  (https://impo.com.uy/bases/leyes/18716-2010, carácter ~19.384)
- accion_sugerida: cita completa en los dos lugares.

### C11 — `argumentos_a_favor[1]` (Eduardo Ache): la nota dice que no está en contra del artículo
- severidad: corregir
- tipo: cita_fuera_de_contexto / asimetria
- objecion: el registro clasifica como argumento **a favor** de la reserva a alguien que en la misma
  nota dice explícitamente que no se opone a abrirla. El propio `texto` del registro lo reconoce
  ("no se trata de oponerse al artículo en sí") y lo archiva igual del lado de mantener. El brief
  fija la regla para el lado contrario ("Un dirigente que defiende una regla no es un argumento en
  contra de esa regla"); por Regla 0 la regla es simétrica. Con esto, el lado "a favor" queda con un
  argumento real (AEBU) y el lado "en contra" con ninguno (B2). Además la `cita` cargada es solo la
  pregunta retórica sobre el oligopolio, mientras el `texto` afirma cuatro ideas más.
- cita_de_contexto: "El economista que asesora a Cabildo Abierto dejó claro que no se trata de
  'estar en contra' de este artículo pero aseguró que es necesario 'ser más cuidadosos en la forma
  de abrir'" y "El economista aseguró que en términos de apertura del mercado 'no le cede la derecha
  a nadie' pero dijo que es necesario que se 'abra bien'"
  (https://elobservador.com.uy/nota/cabildantes-y-colorados-plantean-dudas-sobre-quitar-exclusividad-del-brou-en-depositos-20217520520)
- accion_sugerida: sacarlo de `argumentos_a_favor` o reformular `texto` y `quien` para que digan lo
  que la nota dice (pedido de discutir la apertura en conjunto, no defensa de la reserva). Si se
  saca, hay que buscar el segundo argumento a favor donde con seguridad está: la comparecencia de
  AEBU y del Directorio del BROU en la misma comisión de 2021, con versión taquigráfica, y la
  discusión del artículo 281 en el Frente Amplio.

### C12 — cobertura del período: el inventario tiene años y documentos sin abrir
- severidad: corregir
- tipo: asimetria / contexto_omitido
- objecion: el brief pidió 2015-2024 y el lote lo cumple, pero `notas.md` afirma que el inventario
  "fue la base para decidir qué había disponible" y las conclusiones que saca no se sostienen contra
  el inventario. Sin abrir quedaron: `Balances-Dic09` a `Balances-Dic14` (seis años más en el mismo
  formato que el lote ya sabe leer, con resultado, patrimonio y cotización), `Balances-Dic17` (C1),
  `Balances-Dic18`, `Dic19`, `Dic-20`, `Dic21`, las `Síntesis Financiera Diciembre` de 2022, 2023,
  2024 y 2025, las memorias anuales 2016 a 2024, once juegos de "Estados Contables" y "Notas a los
  Estados Contables" de años anteriores, y el `dictamen_tribunal_cuentas_balance_2021.pdf`. La
  verificación que sí se hizo ("no existen auditorias-2015/2016/2017 archivados en el nodo
  `documents/20182/52654/`") es correcta y no alcanza para la conclusión que se sacó. El contexto
  importa: las tres fichas de empresas que se corrigieron esta semana extendieron la serie hacia
  atrás (ANCAP a 2000, UTE a 2003, ANTEL a 1997). Si BROU queda en 2015 sin decir por qué, el mismo
  criterio no se está aplicando a todas.
- accion_sugerida: o se cargan 2009-2014 con los informes de indicadores, o el `resumen` dice —como
  hace el de UTE— qué documentos existen para los años anteriores y por qué no están. La línea
  automática de la página ("La empresa existe desde 1896; los años anteriores a 2015 todavía no
  están en la ficha y se van a cargar hasta donde haya documentos públicos") es verdadera pero
  promete: conviene que el `resumen` diga qué hay.

### C13 — `transferencias_al_estado` 2015, 2016 y 2017 sin dato
- severidad: corregir
- tipo: contexto_omitido
- objecion: tres de diez años quedan sin la cifra que el brief define como "la que le importa al
  dueño", con la explicación "No se localizó documento de BROU con el detalle de transferencias a
  Rentas Generales para este ejercicio". No se agotó la búsqueda: la comparativa del estado de
  cambios en el patrimonio del balance 2018 cubre 2017, y `memoria-2016-esp.pdf` y
  `memoria-2017-esp.pdf` están en el inventario sin abrir. Fuera de BROU, la Rendición de Cuentas
  del MEF de cada ejercicio y el Balance de Ejecución Presupuestal registran lo que entró a Rentas
  Generales por este concepto.
- accion_sugerida: abrir las dos memorias y la comparativa 2018 antes de dejar los huecos; si igual
  quedan, la tabla de cobertura de `notas.md` ya los declara y la página los muestra como guion, que
  es lo correcto.

### A1 a A8 — avisos
- **A1** `finanzas[2015].resultado_ejercicio.usd: 197.9`; 5.909 / 29,87 = 197,8. El validador
  recalcula `usd = pesos / cotizacion`.
- **A2** `resultado_ejercicio` 2019 a 2024 se cita desde la nota de segmentos. El renglón directo
  existe y coincide: "Resultado del ejercicio 34.092.767 23.653.974" en el estado de resultados
  separado (auditorias-2024.pdf, carácter ~9.700). El diccionario pide ese renglón. Los valores están
  bien; es la cita la que conviene cambiar.
- **A3** la `nota` de 2024 fecha el pago a ANDE el 1/8/2024, que es la fecha de la resolución; el
  balance dice "El 26 de agosto de 2024 en cumplimiento de la Resolución de Directorio de fecha 1º
  de agosto se transfiere a ANDE". Con criterio de caja, 26/8. Aparte, el pago de $ 1.202.492 del
  31/7/2024 el balance lo funda en "el artículo 140 de la Ley Nro. 18.716", artículo que no existe
  (la ley tiene 40). La clasificación del lote como artículo 40 cierra con la aritmética (el tope del
  artículo 11 es el 50 % de 23.653.974 = 11.826.987 = 9.461.590 + 2.365.397, ya completo), pero la
  ambigüedad del documento merece media oración.
- **A4** ocho hitos y dos citas de `creacion` dependen de
  `brou.com.uy/institucional/el-banco/creacion-del-banco`, una página institucional sin fecha,
  cargada con `tipo: documento_oficial` y `fecha: 2026-09-09` (que es la fecha de lectura). Es
  autodescripción del sujeto. Los hechos de 1935, 1967, 1987, 2002, 2007 y 2010 tienen ley o Diario
  Oficial disponible; conviene apoyar los hitos ahí y dejar la página del banco para lo que solo el
  banco cuenta.
- **A5** el patrimonio al cierre está en los diez `nota` como prosa: es una serie de diez números que
  el lector no puede ver en un gráfico porque el esquema no tiene campo para ella. El brief lo pidió
  así; lo levanto para el editor, porque una serie en el tiempo sin gráfico es el punto 8 de la lista
  de presentación. Si se quiere resolver de verdad, es un cambio de esquema (un campo `patrimonio`),
  no un parche en esta ficha.
- **A6** la nota de la diaria se carga con `fecha: 2021-07-27`; el cuerpo dice "26 de julio de 2021".
- **A7** medios a crear: `brou`, `poder-judicial`, `cpa-ferrere` (ya declarados en `notas.md`; son
  los únicos errores de `pnpm validar --inbox` fuera de las notas largas de C4).
- **A8** la `nota` que explica qué hay dentro del segmento "Otros" está solo en 2017; en 2018-2024 el
  mismo segmento aparece sin explicación y con signo negativo grande (hasta −26.406,8 en 2022). Una
  vez, en el `resumen`.

### Sin objeción
- Las diez cifras de `resultado_ejercicio` cierran con la suma de sus segmentos en los ocho años que
  los tienen (verificado año por año), y las de 2015-2017 cierran con el estado de resultado de los
  informes de indicadores.
- Las cinco cifras de `transferencias_al_estado` cargadas cierran exactamente con la suma de las dos
  resoluciones citadas en cada año (2020: 6.279.049 + 2.093.016; 2021: 9.292.997 + 1.032.555; 2022:
  6.549.665 + 2.183.221; 2023: 3.669.176 + 917.294; 2024: 9.461.590 + 2.365.397).
- Los segmentos salen de la nota 4 de los estados financieros **separados**, no de los consolidados
  (verificado en 2024: el total de la tabla, 34.092.767, es el resultado del estado de resultados
  separado, y el consolidado es otro bloque del mismo PDF). La regla "individual, no consolidado"
  está bien aplicada, y el `nota` de 2023 avisa cuando el consolidado difiere.
- Las citas de las líneas de impuestos, patrimonio, artículo 11 y artículo 40 que releí en el balance
  2024 son literales y contiguas; las de los informes de 2015 y 2016 también (verifiqué
  "Impuestos Tasas y Contribuciones -990 -1.170 -1.361" en el de 2015 y confirmé que el de 2016 no
  trae esa línea, así que la decisión de dejar 2016 sin `impuestos_pagados` es correcta **sobre ese
  documento**; ver C6 por la memoria).
- La comparación de CPA Ferrere está bien atribuida y la URL es la del autor, no una copia (ver C7
  por lo que le falta alrededor).
- `tipo: ente_autonomo` está bien fundado con la cita del artículo 1 de la Ley 18.716.

## Objeciones al lote

- **Dependencia de fuentes.** El bloque financiero depende de un solo publicador (BROU) para todo,
  lo cual es correcto en esta colección: los estados contables auditados son la fuente primaria. Lo
  que falta al lado es el control externo, que existe y está en el inventario:
  `dictamen_tribunal_cuentas_balance_2021.pdf`, y `content/medios/tribunal-de-cuentas.yaml` ya
  existe en el repo. Una ficha de empresa pública que cita diez balances del propio ente y ningún
  dictamen del órgano que los controla está apoyada en un solo lado.
- **Un solo grupo de medios en la parte de opinión.** Los dos `argumentos_a_favor` salen de
  El Observador (grupo `werthein-hochbaum`) y el único `argumentos_en_contra` de la diaria (grupo
  `cooperativa-la-diaria`), las tres notas de la misma quincena de julio de 2021. Una discusión sobre
  un diseño legal vigente desde 1987 y 2010 queda contada por tres notas de tres semanas. No es un
  problema de propiedad de los medios; es que el episodio de 2021 se está usando como si fuera el
  debate entero.
- **Simetría.** Del lado que sostiene la reserva hay un argumento real; del lado que la cuestiona,
  ninguno sostenido por su fuente (B2, C11), y falta el hecho legal que ese lado usaría primero
  (B3). Las tres omisiones caen del mismo lado. `notas.md` lo atribuye a "una asimetría de lo que
  hay publicado, no de las búsquedas hechas", y en `consultas.jsonl` hay efectivamente búsquedas de
  los dos lados (series de 04:26 a 04:31 y 04:38). Pero las búsquedas del lado "en contra" fueron
  todas en buscadores web y ninguna en el Parlamento, que es donde ese lado habló bajo versión
  taquigráfica: el Poder Ejecutivo escribió el artículo 281 y su exposición de motivos, y el
  presidente del BCU expuso en comisión. No es que no exista; es que no se buscó donde está.
- **Casos vistos.** `notas.md` registra bien dos pistas judiciales (denuncia penal contra dos
  directores por el asunto AUF; procesamiento de Fernando Calloia) sin investigarlas, como manda la
  regla 12. Correcto. Recordatorio para el editor: no entran en esta ficha, y si alguna vez entran,
  entran con etapa, fecha y desenlace, con el mismo rigor en las dos direcciones.
- **Verificabilidad.** No hay `afirmacion` chequeable en este lote (no es una colección de
  chequeos), pero sí hay dos documentos previsibles que el lote deja sin buscar y que cambian lo que
  la ficha puede afirmar: la versión taquigráfica de la Comisión de Presupuestos integrada con
  Hacienda de Diputados del 22 de julio de 2021 y los boletines mensuales del sistema bancario del
  BCU al cierre de 2025. Los dos están nombrados en las propias fuentes que el lote ya leyó. Con el
  criterio del punto 7 de mi rol, eso no es un aviso: es `corregir` de tipo `documento_previsible`, y
  el lote no debería cerrarse sin esa búsqueda.

## Objeciones al brief

- El brief no pide seleccionar, omitir ni encuadrar por partido, ideología ni persona. Pide
  explícitamente el mismo esfuerzo por cada lado y una búsqueda mínima por lado registrada en
  `consultas.jsonl`. No hay Regla 0 que objetar en el brief.
- Sí hay una instrucción del brief que produce C3 y que no es simétrica entre empresas, aunque no lo
  sea entre partidos: "usá `transferencias_al_estado` para la contribución anual a Rentas
  Generales". Aplicada al pie de la letra deja fuera un tercio de lo que el banco le giró al Estado
  en 2024. La corrección no es para este brief sino para `docs/diccionario-empresas.md`: hace falta
  una regla única sobre los aportes por ley a fondos específicos —cuándo son transferencia y cuándo
  no—, escrita una vez y válida para ANCAP, UTE, ANTEL, ANP, OSE y BROU. Hoy el único precedente es
  el Fondo de Estabilización Energética de UTE, que vuelve a la empresa, y no cubre el caso de un
  aporte que no vuelve.
- El brief dice "el artículo 196" de la Constitución para el tipo de ente. El investigador verificó y
  usó la cita del artículo 1 de la Ley 18.716, que es más precisa. Bien resuelto y bien documentado
  en `notas.md`; lo dejo anotado para que la próxima versión del brief no repita la referencia.

## Discrepancias

No escribo `discrepancias.yaml` en este lote, y digo por qué: ninguna de las tres notas de prensa
que releí contradice un documento primario que yo tenga. Lo que encontré son distancias entre el
**registro** y el documento (B1, B2, C1, C3, C10), que son objeciones a la ficha y no hallazgos sobre
un medio. El caso más cercano a una discrepancia es el titular de la diaria, que liga el retiro del
artículo 281 a la exposición de Labat; para decidir si lo publicado coincide con lo ocurrido haría
falta la versión taquigráfica de la comisión, que es justamente el documento que falta (B2). Sin ese
documento va a la crítica, no a `discrepancias.yaml`. Y si algún día se registra, el mismo umbral
tiene que valer para la nota de El Observador que cuenta el mismo episodio.

## Cobertura

```yaml
- medio: el-observador
  url: https://elobservador.com.uy/nota/cabildantes-y-colorados-plantean-dudas-sobre-quitar-exclusividad-del-brou-en-depositos-20217520520
  titulo: Cabildantes y colorados plantean dudas sobre quitar exclusividad del Brou en depósitos de instituciones públicas
  fecha: 2021-07-06
  evento: "propuesto:articulo-281-depositos-publicos-2021"
  partido: Partido Nacional
  tono: desfavorable
  justificacion: >-
    En voz del propio medio, no de una fuente citada, la nota describe al Poder Ejecutivo
    sorprendiendo a sus socios: "Los socios del oficialismo esperan por las explicaciones acerca de
    algunos artículos sobre los que no tenían conocimiento que estarían en la normativa", y el
    artículo del gobierno se cuenta a lo largo de toda la nota desde las objeciones de Cabildo
    Abierto y el Partido Colorado, sin ninguna voz del Ejecutivo.

- medio: el-observador
  url: https://www.elobservador.com.uy/nota/aebu-pide-dejar-sin-efecto-articulo-que-elimina-exclusividad-del-brou-en-depositos-de-instituciones-publicas-20217695135
  titulo: AEBU pide "dejar sin efecto" artículo que elimina exclusividad del BROU en depósitos de instituciones públicas
  fecha: 2021-07-06
  evento: "propuesto:articulo-281-depositos-publicos-2021"
  partido: Partido Nacional
  tono: neutral
  justificacion: >-
    La nota reproduce un comunicado sindical crítico del gobierno pero mantiene la atribución en
    todas las afirmaciones ("señala el texto", "entienden", "según comprenden", "asegura"), sin
    asumir la posición como propia; es de fuente única, lo que no cambia el tono pero sí conviene
    anotar.

- medio: la-diaria
  url: https://ladiaria.com.uy/politica/articulo/2021/7/rendicion-de-cuentas-tras-exposicion-de-labat-coalicion-retiro-articulo-que-habilitaba-a-organismos-publicos-a-depositar-en-banca-privada/
  titulo: "Rendición de Cuentas: tras exposición de Labat, coalición retiró artículo que habilitaba a organismos públicos a depositar en banca privada"
  fecha: 2021-07-26
  evento: "propuesto:articulo-281-depositos-publicos-2021"
  partido: Partido Nacional
  tono: neutral
  justificacion: >-
    La porción legible (la nota tiene muro de pago y en el corpus quedan 1.346 caracteres) es
    descriptiva y atribuida: "Uno de los primeros que fue quitado del proyecto, según confirmó a la
    diaria el diputado blanco Sebastián Andújar, es el 281"; incluye a Labat diciendo que la norma
    "no va a afectar la competitividad del Banco de la República (BROU)", que juega a favor del
    proyecto del gobierno.
```

Nota sobre el cuarto documento leído: el informe de CPA Ferrere
(https://www.cpaferrere.com/es/novedades/sistema-bancario-en-2025-desempeno-tendencias-y-cl/) no
lleva registro de `cobertura`. No trata sobre un político ni sobre un partido, y el esquema exige
uno de los dos; es un análisis de terceros sobre el sistema bancario, y su lugar es el
`analisis.yaml` que pide C7.
