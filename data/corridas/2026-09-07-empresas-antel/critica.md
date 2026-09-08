# Crítica — corrida 2026-09-07-empresas-antel

Modelo: Opus 5 (`claude-opus-5[1m]`). Es el modelo que la tabla de `CLAUDE.md` asigna al crítico,
así que no hay desvío de la regla 14 que reportar en esta corrida.
Lote: `inbox/empresas/antel/2026-09-07/`
Registros revisados: 1 (la ficha de ANTEL en `empresas`), con 10 años de `finanzas`, 57 `segmentos`,
6 `normas`, 6 argumentos, 2 `comparaciones` y 127 fuentes.

## Qué hice antes de objetar

Abrí con `pnpm fuente`, en esta sesión, los **diez** balances citados (2015 a 2024), no tres: hacía
falta para poder decir de qué sección de cada PDF salió cada cifra. Además abrí las seis notas de
prensa del lote, las cuatro páginas de IMPO citadas, y cinco documentos que el lote no usa y que
resultaron decisivos: el texto original completo de la Ley 19.307 y de la Ley 20.075 en
`impo.com.uy/bases/leyes-originales/`, el artículo 613 de la Ley 17.296, el artículo 115 de la
Ley 18.046, y dos notas que el propio investigador leyó y dejó fuera (El Observador 2022-06-16 y
Caras y Caretas 2022-06-26).

Verifiqué a mano, contra el texto de cada PDF: resultado del ejercicio, deuda financiera,
transferencias, impuestos, tipo de cambio y los 57 segmentos.

Lo que está bien y lo digo primero, porque también se audita:

- **Las 57 citas de segmentos son literales**, ninguna reconstruida. Verificado una por una contra
  el texto extraído de cada PDF.
- **La conversión a dólares cierra en los diez años** contra el tipo de cambio de cierre que declara
  cada balance: pesos/usd da 29,97 · 29,35 · 28,81 · 32,40 · 37,31 · 42,35 · 44,69 · 40,07 · 39,02 ·
  44,06, contra los 29,948 · 29,340 · 28,807 · 32,406 · 37,308 · 42,340 · 44,695 · 40,071 · 39,022 ·
  44,066 del documento. Ningún año usa promedio disfrazado de cierre.
- **Las sumas de impuestos cierran** contra los renglones citados en nueve de los diez años
  (diferencias de ±40 mil pesos, que es el redondeo a un decimal en millones). La excepción es 2022
  y está objetada abajo.
- **La deuda financiera de 2015, 2016 y 2024 la recalculé** desde el estado de posición financiera
  individual y da exactamente lo cargado (193,9 / 580,3 / 1.103,1 millones de pesos).
- `pnpm validar --inbox` da 110 errores y **los 110 son el mismo**: `medio: antel` no existe.
  Ninguno es de esquema.
- No hay ninguna fuente con `verificacion: manual` en el lote, ni ninguna cita de un buscador sin
  abrir la página. El investigador se negó a citar la Cámara de Telecomunicaciones desde un snippet
  y eso está bien hecho.

---

## Objeciones por campo

### 1. `que_hace_fuentes[0]` — cita de las subsidiarias
- severidad: **bloquea**
- tipo: cita_fuera_de_contexto
- objecion: la `cita` no está en el documento. La frase "La Entidad posee las siguientes
  subsidiarias y negocios conjuntos:" **no aparece ni una vez** en el balance 2024 (busqué la cadena
  literal y variantes). Lo que el documento tiene es una tabla, con otra frase de entrada y las
  columnas de porcentaje intercaladas. La cita del registro es esa tabla reescrita en prosa por el
  investigador, con un encabezado inventado y con el fideicomiso "tuapp" traído de otra página del
  PDF. El contenido es correcto —las entidades y sus actividades coinciden—, pero una `cita`
  reconstruida es exactamente lo que la regla 4 prohíbe, y es lo primero que un lector que abre el
  PDF va a no encontrar.
- cita_de_contexto: lo que dice el documento es «ANTEL es la controlante directa o indirectamente de
  las siguientes entidades, con las cuales conjuntamente conforman "el Grupo": … (%) (%) Subsidiaria
  País de incorporación Actividad Dic-24 Dic-23 ITC S.A. Uruguay Servicios de asesoramiento en
  telecomunicaciones 100 100 HG S.A. Uruguay Servicios de alojamiento y mantenimiento de sitios web
  100 100 Accesa S.A. Uruguay Servicios de call center 100 100 …»
  (`https://www.antel.com.uy/documents/37544/378823/Estados+Financieros+consolidados+e+individuales+ANTEL31-12-2024.pdf/…`)
- accion_sugerida: reemplazar la cita por el tramo literal de la tabla (empezando en "ANTEL es la
  controlante directa o indirectamente"), y si hace falta nombrar el fideicomiso tuapp, agregar una
  segunda fuente con su propia cita literal. El texto de `que_hace` no cambia.

### 2. Citas que unen fragmentos separados con « … » — 16 fuentes
- severidad: **bloquea**
- tipo: cita_fuera_de_contexto
- objecion: dieciséis citas del lote no son copia contigua: pegan dos o tres tramos distantes del
  documento con puntos suspensivos. `scripts/lib/texto.ts::buscarCita` busca la cita literal y, si
  no está, corre una ventana deslizante con Levenshtein: exacta ⇒ ok, ≥ 0,90 ⇒ aviso "cita
  aproximada", menor ⇒ **error**. Reproduje el algoritmo (con `difflib` en vez de Levenshtein, así
  que los números son aproximados pero el orden de magnitud no) y estas quedan muy por debajo de
  0,90:

  | fuente | similitud aprox. |
  |---|---|
  | `comparaciones[0]` (de León, El Observador) | 0,04 |
  | `finanzas[2..9].deuda_financiera` (10 citas "Préstamos … Préstamos") | 0,32 a 0,64 |
  | `monopolio.argumentos_en_contra[0]` (de León) | 0,33 |
  | `monopolio.argumentos_a_favor[1]` (Larrosa) | 0,48 |
  | `monopolio.argumentos_en_contra[2]` (Movistar) | 0,53 |
  | `monopolio.normas[4].fuentes[1]` (Montevideo Portal) | 0,59 |
  | `que_hace_fuentes[0]` | 0,70 |

  Además hay doce citas entre 0,96 y 0,99, que pasarían como "cita aproximada" pero son evitables:
  **ocho citas de tipo de cambio a las que se les sacó el paréntesis de cierre del original**
  ("…al 31 de diciembre de 2019)." quedó "…al 31 de diciembre de 2019."; la de 2024 sí lo conserva),
  la de resultado de 2022 con una reconstrucción entre corchetes ("Resultado del ej[ercicio]"), la
  de impuestos 2021 con un "$ miles" insertado que en la versión individual no está, y la de
  transferencias 2017 que dice "(ver Nota 16.7)" cuando la versión individual dice "(ver Nota 17.7)".
- accion_sugerida: para la deuda, dos fuentes por año (una por el préstamo corriente, otra por el no
  corriente) o una sola cita del bloque contiguo del pasivo; para las citas de prensa, una cita
  contigua por idea, con varias fuentes de la misma URL si hace falta (la página ya agrupa por URL);
  para el tipo de cambio, restituir el paréntesis. No usar corchetes de reconstrucción en `cita`.
  Correr `pnpm validar:red` **antes** de promover: esto no es una hipótesis, es aritmética.

### 3. `finanzas` — criterio consolidado/individual mezclado dentro de la misma serie
- severidad: **bloquea**
- tipo: contexto_omitido
- objecion: cada PDF trae dos juegos completos, el consolidado (el Grupo) primero y el individual
  (la Entidad) después, y en varios rubros dan cifras distintas. Todos los `titulo` del registro
  dicen "Estados Financieros **Individuales**". No siempre es cierto. Localicé los dos bloques en los
  diez PDF y comparé:

  - `impuestos_pagados`: **2015 a 2021 salen del bloque individual; 2022, 2023 y 2024 salen del
    consolidado.** Magnitud del salto: 2022 individual 9.021,9 vs cargado 9.236,7 (+214,8 M de
    pesos); 2023 individual ≈ 10.152,6 vs cargado 10.536,9; 2024 individual 10.087,1 vs cargado
    10.498,1 (+411,0 M, +4,1 %).
  - `segmentos`: mismo corte. "Telefonía fija" en el bloque individual da 5.219.372 · 5.268.896 ·
    5.249.504 · 5.121.629 · 5.145.715 · 5.083.417 · 4.879.162 · **4.453.904** · **4.195.655** ·
    **4.065.160**; el registro carga los tres últimos años con 4.446.891, 4.189.055 y 4.058.318,
    que son los del bloque consolidado.
  - `transferencias_al_estado` 2022: la cita es la del bloque consolidado ("los cuales se componen
    de $ 3.446.006 miles que corresponden al ejercicio 2021"); la individual dice solo "la suma de
    $ 4.860.000 miles. La totalidad de los pagos…".
  - `resultado_ejercicio` 2022: usa 10.162.070, que es el **individual** (el consolidado dice
    10.162.071). O sea que dentro del mismo año 2022 conviven las dos bases.

  El efecto para el lector es que los últimos tres años de la barra de impuestos están unos cuatro
  puntos por encima del criterio con que se midieron los siete primeros, y nadie puede notarlo.
- cita_de_contexto: bloque individual 2024, «Contribuyente Impuesto al Valor Agregado (IVA)
  4.201.043 Impuesto a la Renta de Actividades Empresariales (IRAE) 2.824.346 Impuesto al Patrimonio
  (IP) 1.206.554 Agente de Retención Impuesto al Valor Agregado (IVA) 1.692.950 …» frente al bloque
  consolidado del mismo PDF, «… (IVA) 4.445.063 … (IRAE) 2.956.777 … (IP) 1.224.583 … (IVA)
  1.699.929 …».
- accion_sugerida: elegir un criterio y aplicarlo a los diez años —recomiendo el **individual**,
  que es el que pide el brief, el que usa la ficha de ANCAP y el que corresponde a "la empresa" y no
  "el grupo"—, rehacer 2022, 2023 y 2024, y dejar los `titulo` diciendo la verdad. Si el editor
  prefiere el consolidado, hay que rehacer 2015-2021. Lo que no se puede es mezclar.

### 4. `finanzas[7].transferencias_al_estado` (2022) — el número elegido es el más bajo de los tres que da el propio balance, y la explicación de la diferencia es incorrecta
- severidad: **bloquea**
- tipo: contexto_omitido
- objecion: el balance 2022 da tres cifras para lo mismo. La nota "Transferencias a Rentas Generales"
  dice $ 4.860.000 miles (lo cargado). El estado de cambios en el patrimonio dice $ 5.914.125 miles.
  Y **el estado de flujos de efectivo también dice $ 5.914.125 miles**. La `nota` del año explica la
  diferencia diciendo que "probablemente corresponda a que la distribución contable y el pago en
  efectivo no coinciden en el tiempo": eso no puede ser, porque el pago en efectivo es justamente el
  que dice 5.914.125. Y el balance 2023 lo confirma en su columna comparativa.

  Revisé el renglón del flujo de efectivo en los diez años y **coincide con la nota en nueve de los
  diez**: 1.961.293 / 3.298.658 / 3.286.362 / 3.518.678 / 4.089.457 / 3.314.543 / 3.446.007 /
  **5.914.125** / 5.551.775 / 7.540.174. El único año raro es 2022, y el registro se quedó con la
  cifra que no cierra. En dólares la diferencia es USD 121,3 M cargados contra USD 147,6 M del flujo
  de efectivo: 26 millones que el gráfico no muestra.
- cita_de_contexto: «Contribución a Rentas Generales (5.914.125) (3.446.007)» (estado de flujos de
  efectivo, balance 2022) y «Contribución a Rentas Generales (5.551.775) (5.914.125)» (balance 2023).
- accion_sugerida: usar en los diez años **el renglón "Contribución a Rentas Generales" del estado de
  flujos de efectivo**. Es un renglón único, identificable, presente en todos los balances, de una
  sola base (caja), y coincide con la nota en nueve años. Reescribir la `nota` de 2022 diciendo lo
  que se verifica —que la nota narrativa dice 4.860.000 y los dos estados dicen 5.914.125— sin
  aventurar la causa.

### 5. `finanzas[9].transferencias_al_estado` (2024) — citada de otro estado que los otros nueve años
- severidad: corregir
- tipo: contexto_omitido
- objecion: 2024 se cita del estado de cambios en el patrimonio y su `concepto` dice "Contribución a
  Rentas Generales del ejercicio, según el estado de cambios en el patrimonio y el estado de flujos
  de efectivo individuales", mientras los otros nueve años citan la nota narrativa. Suena a que 2024
  está en otra base y el gráfico salta. **No lo está**: la nota existe en el balance 2024 y da el
  mismo número. El problema es de cita y de redacción, no de cifra.
- cita_de_contexto: «Transferencias a Rentas Generales — En el presente ejercicio, la Entidad
  transfirió a Rentas Generales la suma de $ 7.540.174 miles.» (balance 2024, sección individual).
- accion_sugerida: citar esa nota (o, mejor, el renglón del flujo de efectivo, ver objeción 4) y
  dejar el `concepto` en una sola frase igual a la de los demás años.

### 6. `transferencias_al_estado` — el pago diferido, en diez notas en vez de una
- severidad: corregir
- tipo: presentacion
- objecion: el mecanismo de pago diferido está bien detectado y bien documentado (2015 deja $ 821.747
  miles a reintegrar entre 2016 y 2019; 2016, 2017, 2018, 2019, 2020 y 2021 arrastran saldos), pero
  el lector lo tiene que reconstruir leyendo diez `concepto` que dicen casi lo mismo con variantes
  ("incluye el saldo de años anteriores pagado con demora", "incluye saldo de 2015 pagado con
  demora", "incluye saldo de 2017/2018 pagado con demora"). Además el `concepto` de 2022 termina con
  "Nota de discrepancia interna del documento debajo": un campo que la página imprime en una celda
  remitiendo a otro campo.
- accion_sugerida: una frase por año en `concepto` (qué es el monto, nada más), y el mecanismo del
  pago diferido explicado una sola vez, en `resumen` o como `nota` del gráfico de transferencias.
  Falta además la norma que lo funda y que el propio balance cita: **artículo 643 de la Ley 16.170 y
  decretos 161/91 y 436/002** ("Dichas contribuciones son efectuadas en el marco del artículo 643 de
  la Ley 16.170 del 28 de diciembre de 1990 y de los Decretos 161/91 de fecha 15 de marzo de 1991 y
  436/002", balance 2015, nota 2.24). Es un `documento_previsible` de una línea en IMPO y le da al
  lector el porqué del mecanismo.

### 7. `finanzas[7].impuestos_pagados` (2022) — la cita no contiene todos los sumandos
- severidad: corregir
- tipo: cita_fuera_de_contexto
- objecion: la cifra cargada es 9.236,7 M de pesos, pero los renglones citados suman 9.227,2 M. Falta
  el último renglón del cuadro, «Impuesto a la Renta de Actividades Empresariales (IRAE) 9.525», que
  sí está en el documento. Como esta cifra es una suma que hace el sitio (no un renglón del balance,
  a diferencia de ANCAP que tiene "Total impuestos"), la cita **es** la auditoría: si no trae todos
  los sumandos, el lector no puede reproducir el número.
- accion_sugerida: completar la cita. Y revisar lo mismo en el resto de los años cuando se rehagan
  2022-2024 con el bloque individual.

### 8. `impuestos_pagados` — el `concepto`, diez veces y en dos oraciones
- severidad: corregir
- tipo: presentacion
- objecion: el `concepto` de 2015 y el de 2024 son de dos oraciones largas ("Suma calculada por el
  investigador… ; el documento no publica una cifra de 'total impuestos' consolidada"), y la
  aclaración de método se repite en los diez años con redacciones distintas. La página lo muestra en
  una celda. Además, la suma mezcla lo que ANTEL paga como contribuyente con lo que retiene o
  percibe de terceros (IVA de clientes, IRPF de empleados): es defendible bajo la definición del
  esquema —"es la mayor parte de lo que le pasa al Estado"— y el `concepto` lo dice, pero conviene
  que lo diga una vez y con claridad, no diez veces a medias.
- accion_sugerida: una frase idéntica en los diez años, y la explicación de método (qué incluye, por
  qué se suma, que no hay renglón de total) una sola vez en `resumen`.

### 9. `segmentos` — 57 valores en un campo llamado `resultado` que en realidad son ingresos, con la aclaración en 10 de ellos
- severidad: **bloquea**
- tipo: presentacion
- objecion: `notas.md` lo dice bien: ANTEL no desagrega el resultado por segmento, solo el ingreso.
  Pero en la ficha esa advertencia aparece en el `concepto` de **un** segmento por año (siempre
  "Telefonía fija"): 10 de 57. Los otros 47 —incluido "Servicio móvil 20.567,2 millones de pesos" en
  2024— van a la página bajo un campo cuyo esquema dice literalmente "Resultado por segmento de
  negocio… Es lo que le dice al dueño qué parte del negocio gana y cuál pierde". Un lector va a
  entender que el móvil ganó 20.567 millones. Ganó cero según ese cuadro: facturó eso.
  Peor: el `concepto` que sí existe remite a "ver nota del año sobre por qué", y **en siete de los
  diez años no hay `nota`** (solo 2015, 2019 y 2022 la tienen, y ninguna de las tres habla de esto).
  La remisión apunta a la nada.
  Y la frase del documento que respalda toda la advertencia no está citada en ninguna parte del
  registro.
- cita_de_contexto: «Se presenta en forma agrupada la totalidad de las utilidades de los servicios de
  telecomunicaciones dado que están soportados por una única red compartida, asociada a la
  generación conjunta de ingresos.» (balance 2024, y con el mismo texto en todos los años).
- accion_sugerida: (a) `concepto` en los 57, no en 10, con la misma frase corta; (b) `nota` del año
  en los diez años, o —mejor— una sola advertencia en `resumen` y en el pie del gráfico de segmentos,
  que es donde el lector la va a leer; (c) citar esa frase del balance como fuente de la advertencia;
  (d) que el editor decida si en la página el rótulo puede decir "ingreso por segmento" en vez de
  "resultado", que es la diferencia entre informar y confundir. Ojo: el balance trae **tres**
  desgloses distintos (la Nota 20 de reconocimiento del ingreso, antes de bonificaciones, da
  Telefonía fija 5.658.160 en 2024; el Anexo 2 consolidado da 4.058.318; el Anexo 2 individual
  4.065.160). Hay que decir cuál se usa.

### 10. `segmentos` — la columna comparativa del balance siguiente no coincide con el año propio
- severidad: aviso
- tipo: contexto_omitido
- objecion: ANTEL reexpresa. "Otros ingresos" de 2018 es 71.282 según el balance 2018 y 275.505
  según la comparativa del balance 2019; "Otros ingresos" de 2021 es 386.166 según el de 2021 y
  192.582 según el de 2022; "Servicios de datos" de 2020 es 14.707.458 según el de 2020 y 14.470.641
  según el de 2021. La ficha toma cada año de su propio balance, que es lo correcto, pero el lector
  que compare año contra año va a ver saltos que no son del negocio.
- accion_sugerida: una línea en el pie del gráfico de segmentos: "cada año según su propio balance;
  las cifras comparativas del balance siguiente difieren por reexpresiones".

### 11. `finanzas[4].nota` (2019) — afirma un corte del PDF que no existe
- severidad: corregir
- tipo: contexto_omitido
- objecion: la `nota` dice que "la cita del monto transferido a Rentas Generales quedó cortada en la
  fuente (el PDF corta justo después de '$ 51.359 que corresponde al ejerci')". No está cortada: el
  texto completo está en el PDF, en las dos versiones. Y el "$ 245.302.333" que la nota marca como
  probable error de tipeo sí es del documento, y se resuelve con aritmética en vez de con
  "probablemente": 3.792.795 + 245.302 + 51.359 = 4.089.456, contra el total declarado de 4.089.457.
- cita_de_contexto: «En el presente ejercicio, la Entidad transfirió a Rentas Generales la suma de
  $ 4.089.457 miles, los cuales se componen de $ 3.792.795 que corresponden al ejercicio 2019,
  $ 245.302.333 que corresponden a los ejercicios 2017 y 2018 y $ 51.359 que corresponde al ejercicio
  2015. La totalidad de los pagos se realizan en moneda nacional.»
- accion_sugerida: completar la cita y reescribir la nota con la comprobación aritmética, sin
  adverbios de probabilidad.

### 12. `finanzas[6]` (2021) — el mismo balance se contradice a sí mismo y la ficha no lo dice
- severidad: aviso
- tipo: contexto_omitido
- objecion: la nota de transferencias del bloque consolidado del balance 2021 dice que los
  $ 3.405.123 miles "corresponden al ejercicio **2020**"; la del bloque individual dice "corresponden
  al ejercicio **2021**". Mismo monto, mismo documento, distinto año. La ficha usa la individual
  (bien), pero al lector le sirve saberlo.
- accion_sugerida: una línea en la `nota` de 2021.

### 13. `finanzas[0]` (2015) — de dónde salió, contra lo que dice `notas.md`
- severidad: aviso
- tipo: contexto_omitido
- objecion: la `nota` de 2015 dice que el resultado y la deuda salen de la columna comparativa del
  balance 2016 "no del balance de 2015 en sí, que no se leyó en el mismo detalle", mientras
  `notas.md` afirma que "se consiguieron y leyeron los diez balances individuales/consolidados
  auditados de 2015 a 2024". Las dos cosas no son falsas —el balance 2015 sí se usó para
  transferencias e impuestos— pero el informe queda más redondo de lo que fue.
- accion_sugerida: el balance 2015 está en el corpus y trae el resultado y el pasivo; tomar las dos
  cifras de ahí y borrar la salvedad, o dejar la salvedad y corregir `notas.md`.

### 14. `capitalizaciones_del_estado` — vacío en los diez años, sin decir que se buscó
- severidad: aviso
- tipo: contexto_omitido
- objecion: el campo está ausente en los diez años. Por `consultas.jsonl` se ve que el investigador
  buscó ("aporte de capital", "capitalización") y no encontró. Que el Estado no haya puesto plata en
  ANTEL en una década es un dato para el dueño, y hoy no se distingue de "no se buscó".
- accion_sugerida: una línea en `resumen` diciendo que en 2015-2024 no consta capitalización del
  Estado en los estados contables, con el balance como fuente.

### 15. `monopolio.alcance` — el artículo 56 vigente dice lo contrario de lo que la ficha sugiere, y el documento estaba a un `pnpm fuente` de distancia
- severidad: **bloquea**
- tipo: documento_previsible
- objecion: cuatro cosas, y las cuatro se resuelven con documentos que conseguí en esta sesión.

  **(a) El texto del artículo 56 original existe en IMPO y no es el que la ficha entrecomilla.** El
  `notas.md` dice que no se pudo extraer de `impo.com.uy/bases/leyes/19307-2014/56` (cierto: esa
  ruta solo devuelve notas de vigencia) y que por eso se citó a Montevideo Portal. Pero
  `impo.com.uy/bases/**leyes-originales**/19307-2014` devuelve el texto completo. El artículo dice:
  «Artículo 56 (Incompatibilidades para la prestación de servicios de comunicación audiovisual). Las
  personas físicas o jurídicas que presten servicios de comunicación audiovisual regulados por la
  presente ley no podrán, a su vez, prestar servicios de telecomunicaciones de telefonía o de
  transmisión de datos. Esta incompatibilidad alcanza a las personas, físicas o jurídicas,
  integrantes de las personas jurídicas involucradas. **Lo establecido en el inciso precedente es sin
  perjuicio de los acuerdos de comercialización que se puedan celebrar, ofrecidos en igualdad de
  condiciones a todos los interesados.**» El segundo inciso —una salvedad que abre la puerta a
  acuerdos comerciales— no está en la ficha, y es la clase de recorte que cambia el sentido de una
  prohibición.

  **(b) La ficha no dice qué dice el artículo 56 hoy, y hoy dice lo opuesto.** El `alcance` informa
  que "en octubre de 2022 la Ley 20.075 le dio nueva redacción al artículo 56" y ahí se detiene. La
  nueva redacción, en `impo.com.uy/bases/leyes-originales/20075-2022`, artículo 240, es:
  «Sustitúyese el artículo 56 de la Ley N° 19.307 … por el siguiente: "ARTÍCULO 56.- Los titulares de
  servicios de comunicación audiovisual de televisión para abonados que operan mediante cable
  **tendrán derecho a solicitar licencias para prestar servicios de banda ancha y acceso a
  internet**, a través del empleo de sus redes propias, desarrollos futuros o de recursos que
  contraten con terceros, en igual área de cobertura a la de su respectiva licencia. Los servicios
  referidos en el inciso anterior deberán resultar técnica y jurídicamente factibles conforme a la
  normativa vigente".» Una ficha que describe el resguardo de la fibra y omite que la norma que lo
  daba fue sustituida por su contraria no es neutral aunque no lo pretenda.

  **(c) "No hay hoy un artículo único y vigente" es una conclusión jurídica del sitio, sin fuente, y
  hay un texto legal vigente que la matiza.** El `alcance` afirma que el monopolio de telefonía fija
  "subsiste como situación de hecho antes que como texto legal expreso". Ninguna de las fuentes
  citadas dice eso: son notas de vigencia de IMPO y una nota de Montevideo Portal. Es una inferencia,
  y el esquema de `empresas` no tiene dónde declarar una inferencia con cadena. Además existe un
  texto legal en vigor que la contradice en parte: el **artículo 115 de la Ley 18.046**, que
  sustituye el 197 de la Ley 17.930, dice «La Administración Nacional de Telecomunicaciones abonará
  dicha Tasa por todos los servicios que presta, incluyendo la telefonía fija y conmutada, **sin
  distinción de la tecnología empleada, que presta en condiciones de exclusividad**, con excepción de
  aquellos servicios de carácter social…». No otorga el monopolio, pero es el legislador,
  en 2006 y todavía vigente, describiendo esa actividad como prestada en exclusividad, y sin
  distinción de tecnología. Eso es exactamente lo que hay que poner en `alcance` en vez de una
  deducción propia.

  **(d) La ficha invierte lo que hizo la Ley 17.296 de 2001.** Dice que las "redacciones posteriores
  que intentaron reponerlo (Ley 17.296 de 2001) fueron a su vez derogadas". El artículo 613 de esa
  ley, que leí completo, no repuso nada: mantuvo la exclusividad de ANTEL en telefonía básica
  («ARTICULO 5º. La prestación del servicio público de telefonía básica será realizada, en
  exclusividad, por la Administración Nacional de Telecomunicaciones (ANTEL). A estos efectos, se
  considera servicio público de telefonía básica la prestación a terceros de servicios de telefonía
  que reúnan los caracteres de fija, conmutada y referida al tráfico nacional…») y abrió otras
  actividades. Lo que la Ley 17.524 de 2002 derogó fue eso.
- accion_sugerida: rehacer `alcance` con los cuatro textos citados de su documento oficial (art. 56
  original y vigente desde `leyes-originales`, art. 613 de la 17.296, art. 115 de la 18.046), no
  afirmar nada sobre "situación de hecho" que no diga una fuente, y partir el campo en párrafos
  cortos (hoy son 2.278 caracteres de un tirón).

### 16. `monopolio.normas[4]` — "ese mismo mes" es falso
- severidad: corregir
- tipo: contexto_omitido
- objecion: el rótulo de la norma dice «Ley 20.075 (20/10/2022), artículo 240 — da nueva redacción al
  artículo 56 …; **ese mismo mes**, tres decretos firmados por Luis Lacalle Pou y el ministro Omar
  Paganini otorgaron licencias "Clase B"…». No es el mismo mes: las autorizaciones son de junio y la
  ley de octubre. El propio `alcance` lo dice bien ("en junio de ese año"), así que es un error del
  rótulo, pero es el rótulo lo que la página lista. Además fueron **cinco resoluciones del 14 de
  junio de 2022**, no "tres decretos" más "dos resoluciones más".
- cita_de_contexto: «Las cinco resoluciones, firmadas por el presidente de la República, Luis Lacalle
  Pou, con fecha 14 de junio, le otorgan a estas empresas una Licencia de Telecomunicaciones Clase B
  "para brindar a terceros, servicios de transmisión de datos". Las empresas beneficiadas por estas
  resoluciones son Korfield, Monte Cablevideo, Praimar, Riselco (Nuevo Siglo) y Tractoral (TCC).»
  (El Observador, 2022-06-16,
  `https://www.elobservador.com.uy/nota/gobierno-habilito-a-cables-del-interior-a-ofrecer-internet-y-antel-pierde-su-monopolio--2022616135432`)
- accion_sugerida: separar en dos `normas` (las resoluciones de junio y la ley de octubre), con la
  fecha exacta, y acortar los rótulos: `normas[3]` y `normas[4]` tienen 379 y 315 caracteres, cuando
  el máximo de la ficha publicada de ANCAP es 242 y la página los lista como ítems.

### 17. `monopolio.normas` — dos de seis dependen de un solo grupo, teniendo la segunda fuente ya leída
- severidad: corregir
- tipo: un_solo_grupo
- objecion: los hechos de 2022 (artículo 56, fallo de la SCJ, licencias Clase B) se acreditan solo con
  `montevideo-portal` (grupo `montevideo-comm`). El investigador **abrió en la misma sesión** dos
  notas de otros grupos sobre exactamente el mismo hecho y no las usó: El Observador
  (`werthein-hochbaum`, 2022-06-16, con la fecha exacta de las resoluciones y la abogada de tres de
  las empresas explicando el planteo de inconstitucionalidad) y Caras y Caretas
  (`editora-caras-y-caretas`, 2022-06-26, con la historia normativa y la posición contraria).
  `consultas.jsonl` las registra como "ok" y `notas.md` no explica por qué quedaron fuera.
- accion_sugerida: agregarlas. No hace falta buscar nada: están en el corpus.

### 18. `monopolio.normas` — faltan tres documentos previsibles
- severidad: corregir
- tipo: documento_previsible
- objecion:
  1. **La sentencia de la Suprema Corte de Justicia (2016)** que declaró inconstitucional el artículo
     56. Hoy la ficha dice "según cobertura de prensa". Una sentencia es el caso de manual de
     documento previsible: Base de Jurisprudencia Nacional Pública del Poder Judicial
     (`bjn.poderjudicial.gub.uy`); el sitio ya tiene `justia` como medio. Caras y Caretas además
     señala que **hubo un primer fallo en sentido contrario** antes de ese, de modo que "la SCJ falló
     a favor" cuenta la mitad.
  2. **Ley 18.046, artículo 115** (ver objeción 15c).
  3. **Artículo 643 de la Ley 16.170 y decretos 161/91 y 436/002** (ver objeción 6).
  4. `normas[5]`, la resolución del directorio de 2024, se acredita solo por una nota de 2025 que la
     menciona al informar su revocación. `notas.md` lo reconoce. El camino previsible es el acta o
     resolución del directorio, o un pedido de informes parlamentario; mientras tanto la norma debe
     decir en su rótulo que su existencia consta por prensa.
- accion_sugerida: buscarlos antes de cerrar el lote.

### 19. `monopolio.argumentos_a_favor[0]` (Mujica) — es una decisión narrada, no un argumento en primera persona
- severidad: aviso
- tipo: explicacion_alternativa
- objecion: la lectura inocente existe y hay que escribirla: El Observador no publica a Mujica
  argumentando a favor del monopolio, publica que estaba dudando y que terminó laudando. Las dos
  frases entre comillas son fragmentos dentro de la narración del diario, no una declaración
  transcripta. El `texto` del argumento es una reconstrucción razonable, pero `quien` dice "José
  Mujica, presidente de la República" y la página va a mostrar eso como su posición.
- cita_de_contexto: «Ante esta disyuntiva, el presidente Mujica se había mostrado dubitativo porque
  entendía que si se da competencia el mercado "termina en dos o tres empresas transnacionales",
  pero de lo contrario se le crea "un problema jurídico al país". Finalmente decidió laudar a favor
  de ANTEL y enviará un proyecto de ley con el monopolio para la telefónica.»
- accion_sugerida: dejar el argumento pero que el `texto` empiece por "según El Observador, Mujica…",
  o buscar la primaria: la audición presidencial y los comunicados de Presidencia de mayo de 2012
  están en `archivo.presidencia.gub.uy`, que es donde `CLAUDE.md` dice que hay que mirar antes de
  citar la crónica.

### 20. `monopolio.argumentos_a_favor[1]` (Larrosa) — una frase que la fuente no dice
- severidad: corregir
- tipo: riesgo_legal
- objecion: el `texto` afirma que Larrosa dijo que "nadie en el mundo tiende fibra óptica en zonas
  rurales por ser económicamente inviable, **mientras que ANTEL sí llegó a esas localidades**". La
  nota no dice eso. Dice lo primero, y sobre las localidades dice lo contrario de lo que el registro
  sugiere: que las del interior mencionadas en las resoluciones son "supuestas". El esquema pide que
  `texto` esté "en palabras de quien la sostiene o resumida sin adjetivos"; acá se le agregó una
  afirmación a una persona nombrada.
- cita_de_contexto: «Asimismo, el economista señaló que las autoridades "están hablando de una
  realidad que no existe" respecto a las empresas privadas. Y que "nadie en ningún lugar del mundo
  tiene fibra óptica en las zonas rurales porque es imposible inviable económicamente". En este
  sentido, Larrosa expresó que las localidades que ortogaron a las empresas privadas "son básicamente
  en Montevideo", en lugares que "tienen acceso" y que las localidades del interior que fueron
  mencionadas son "supuestas".»
- accion_sugerida: borrar la frase agregada. Y acortar: 639 caracteres es el argumento más largo de
  esta ficha y de la de ANCAP; la página lo muestra como una idea.

### 21. `monopolio.argumentos_a_favor[2]` (Gurméndez) — no es un argumento sobre el monopolio, y el encuadre lo empeora
- severidad: corregir
- tipo: asimetria
- objecion: `notas.md` ya lo admite ("es más indirecto —defiende el resultado de una inversión
  estatal, no el monopolio en sí"). Hay que ir un paso más: Gurméndez presidía ANTEL designado por el
  gobierno que **abrió** el mercado por decreto tres meses antes de esa nota. Ponerlo en la columna
  "a favor del monopolio" no es solo débil, es un error de encuadre. Con esto, el 3 a 3 de argumentos
  es nominal: son 2 a 3.
  Además, la cita no contiene una sola palabra textual de Gurméndez —"excelente noticia", "salto
  extraordinario" son adjetivos que Presidencia le atribuye en estilo indirecto— y el `texto` del
  argumento los reproduce como si fueran suyos.
- cita_de_contexto: «Gurméndez sostuvo que dicho resultado es una excelente noticia para los clientes…
  consideró que las cifras representan un salto extraordinario…» Y al pie de la misma página:
  «Enlaces relacionados Audios Entrevista al presidente de Antel, Gabriel Gurméndez».
- accion_sugerida: sacarlo de `argumentos_a_favor` o reescribirlo sin adjetivos y con el audio de la
  entrevista como fuente primaria (está enlazado en la misma página: es un `documento_previsible`
  gratis, y una fuente de video con `marca_tiempo` sube el nivel de evidencia).

### 22. `monopolio.argumentos_en_contra[1] y [2]` (Claro y Movistar) — la fuente citada dice de dónde salió, y no es ella
- severidad: corregir
- tipo: presentacion
- objecion: los dos argumentos se acreditan con el resumen de titulares de En Perspectiva del
  2020-05-08, que **atribuye expresamente las declaraciones a otro medio**. La página va a imprimir
  "En Perspectiva" como quien recogió la posición de Claro y de Movistar, cuando el original es una
  nota de El Observador.
  Dos problemas más en el mismo lugar: (a) las frases "sana competencia", "fundamental" y "más
  beneficios para los consumidores" están atribuidas en la nota a **las dos empresas juntas**, y el
  registro se las asigna solo a Movistar; (b) falta el contexto que cambia el sentido del reclamo.
  No estaban argumentando contra la apertura: estaban argumentando contra quedar excluidas de una
  apertura que se les daba a los cableoperadores.
- cita_de_contexto: «Claro y Movistar criticaron la decisión del gobierno uruguayo de excluirlas del
  negocio de internet a los hogares y de abrirlo sólo a las empresas que tienen licencia para brindar
  televisión por cable. Las dos empresas de telefonía móvil opinaron, **en nota con El Observador**,
  que no abrir el mercado a todos los operadores va en contra de la "sana competencia".»
- accion_sugerida: pedir la nota de El Observador de mayo de 2020 y citarla; corregir la atribución
  conjunta; agregar el contexto del proyecto en una frase.

### 23. `monopolio` — simetría: 2 a 3 real, y el material para empatar está identificado
- severidad: corregir
- tipo: asimetria
- objecion: `notas.md` reconoce con honestidad que costó más encontrar argumentos a favor, y eso está
  bien dicho. Pero la búsqueda no se agotó, y las tres puertas que quedaron sin abrir son las más
  obvias:
  1. **La versión taquigráfica del debate del artículo 240 de la Ley 20.075** (Rendición de Cuentas
     2021, Cámara de Representantes y Senado, octubre de 2022) en `parlamento.gub.uy`. Un solo
     documento con los dos lados, con nombre y apellido, en fuente primaria. Es un
     `documento_previsible` y arregla la simetría de una sola vez.
  2. **SUTEL y el PIT-CNT.** El brief los nombraba y no se los buscó. El propio balance cita el
     "Convenio colectivo de relaciones entre ANTEL y SUTEL" con su URL en `gub.uy`.
  3. **Caras y Caretas del 2022-06-26**, ya leída, con un argumento a favor explícito y con autor
     identificable (Alberto Grille): «El monopolio de Antel tiene un sustento histórico, un marco
     legal y el respaldo de la ciudadanía en una consulta histórica.»
  Del lado en contra, también quedó afuera un argumento con nombre disponible: la abogada Cristina
  Olaso en El Observador (2022-06-16), «Basados en que se estaría estableciendo un monopolio de hecho
  a favor de Antel. Sin cumplir con las previsiones legales que establece la Constitución, se estaría
  limitando la competencia de un mercado en libre competencia…».
- accion_sugerida: el mismo esfuerzo de los dos lados, y que quede registrado cuál se hizo. Si tras
  buscar la versión taquigráfica sigue habiendo asimetría, se dice en `resumen`.

### 24. `comparaciones[0]` (renta monopólica de Omar de León) — la cifra está transformada al revés
- severidad: **bloquea**
- tipo: cita_fuera_de_contexto
- objecion: `valor_propio` dice «tarifas de telefonía fija **un 58% por encima** del promedio
  regional». La fuente dice lo contrario en su forma: que deberían estar **un 58% por debajo** de las
  actuales. No es lo mismo ni parecido: bajar 58% desde el precio actual equivale a estar hoy un
  138% por encima del promedio, no un 58%. Es una cifra atribuida a una persona nombrada, y el
  registro la reescribe mal en el campo que la página imprime.
  El resto de la comparación sí está bien: USD 181 millones es el 58% de los USD 312 millones de
  ingresos por telefonía fija de 2011 que de León declara.
- cita_de_contexto: «si se aplica la metodología de análisis para estimar precios denominada
  benchmarking …, queda en evidencia que si en Uruguay se establecieran las tarifas de acuerdo a los
  costos "al menos deberían encontrarse en el promedio del continente, o sea **el 58% menos que los
  precios actuales**". "Según los Estados Contables de ANTEL de 2011, los ingresos por telefonía fija
  ascienden a $ 6.229.619.000, aproximadamente US$ 312 millones. De ello surge que una estimación del
  precio excesivo cobrado a los usuarios, o más técnicamente hablando la 'renta monopólica', asciende
  a aproximadamente US$ 181 millones por año".»
- accion_sugerida: corregir a "un 58% por encima del nivel que resultaría de aplicar costos, según el
  benchmarking del autor", o mejor, usar las palabras del autor.

### 25. `comparaciones[0]` — es un análisis de un tercero con varias cifras: corresponde `analisis.yaml`
- severidad: corregir
- tipo: presentacion
- objecion: es literalmente el caso que documenta `src/schemas/analisis.ts` ("la tabla de
  comparaciones de una ficha de empresa mostraba cuatro filas que salían de la misma nota… un lector
  dijo lo obvio: ese análisis merece una página propia"). Acá una misma nota aporta un método
  (benchmarking), un porcentaje (58%), una base (USD 312 millones de ingresos por telefonía fija en
  2011) y un resultado (USD 181 millones anuales), y va todo comprimido en una fila de tabla cuyo
  `indicador` ocupa dos líneas.
  Además, **la fuente es quien lo repitió, no quien lo hizo**: la comparación es de Omar de León y la
  página va a imprimir "El Observador" como origen.
- accion_sugerida: un registro en `analisis.yaml` con `empresa: antel`, `autor: Omar de León`,
  `publicado` = la nota de El Observador, `metodo` en palabras del autor, y una `afirmacion` por
  cifra cotejada. El dato oficial para cotejar la base existe y es previsible: **los estados
  contables de ANTEL de 2011** (misma sección de `antel.com.uy` de donde salieron los otros diez), y
  para las tarifas regionales, los informes de la UIT o de URSEC de esos años. En `autor_es`, qué es
  de León con fuente, sin adjetivos. En `comparaciones` queda una fila que apunta a esa página.

### 26. `comparaciones[0]` — la misma nota trae dos datos favorables que la ficha no recoge
- severidad: corregir
- tipo: contexto_omitido
- objecion: de la nota de 2012 se extrajeron el argumento en contra y la comparación desfavorable, y
  se dejaron afuera los dos datos que la propia nota da a favor. También queda sin decir que ANTEL no
  dio su versión del estudio. Sacar de una nota solo lo que va para un lado es lo que la Regla 0
  pide no hacer, aunque no haya intención.
- cita_de_contexto: «Uruguay aparece como uno de los países más baratos en el costo del minuto de
  celular –hay competencia entre ANTEL, Movistar y Claro–, pero los precios se disparan en la
  telefonía básica en la que ANTEL tiene el monopolio. En cuanto al nivel de costos de los servicios
  de internet, Uruguay exhibe los valores más bajos del continente después de Brasil y Venezuela.» Y:
  «El Observador intentó, sin éxito, conseguir la versión de ANTEL sobre este estudio de De León. La
  empresa se limitó a enviar una gráfica comparativa sobre cómo se redujo el precio de la telefonía
  fija.»
- accion_sugerida: sumar las dos comparaciones favorables de la misma nota (celular e internet
  frente a la región, 2011) y la no respuesta de ANTEL. Está todo en la fuente ya leída.

### 27. `comparaciones[1]` (Speedtest) — la comparación es de Ookla; Presidencia la repite
- severidad: corregir
- tipo: presentacion
- objecion: quien hizo la comparación es el Speedtest Global Index de Ookla (ranking de julio de
  2023). Presidencia la reproduce. Tal como está, la página imprime `presidencia` —el medio del
  gobierno de turno— como origen de la única comparación favorable de la ficha.
- cita_de_contexto: «El Speedtest Global Index es una herramienta que clasifica mensualmente la
  velocidad de banda ancha fija y móvil en todo el mundo. En la medición del mes de julio, última
  disponible, Uruguay alcanzó un promedio de 149,08 megabits por segundo (mbps) y se ubicó en el 4.°
  puesto de la lista.»
- accion_sugerida: fuente primaria la publicación de Ookla del ranking de julio de 2023
  (`speedtest.net/global-index`), con Presidencia como fuente secundaria de la reacción de ANTEL.

### 28. `comparaciones` — dos comparaciones para once años, y ninguna en el medio
- severidad: corregir
- tipo: asimetria
- objecion: las únicas dos comparaciones son de 2012 (desfavorable) y de 2023 (favorable). Entre
  medio no hay nada, y el período que la ficha documenta con cifras es 2015-2024. El brief nombraba
  UIT, OCDE, Cable.co.uk y Speedtest, y `catalogodatos.gub.uy` (que el propio brief listaba) **no se
  consultó ni una vez** según `consultas.jsonl`. **URSEC**, que es el regulador del sector y publica
  la serie de mercado y precios, tampoco: la única búsqueda de URSEC fue en el corpus.
- accion_sugerida: nombrar y buscar, sin elegir el signo del resultado: URSEC, "Evolución del sector
  telecomunicaciones" y sus datasets en `catalogodatos.gub.uy`; UIT/ITU, ICT Price Baskets; Cable.co.uk,
  Worldwide Mobile Data Pricing y Worldwide Broadband Price League; Speedtest Global Index, medición
  más reciente. Si el resultado es favorable a ANTEL, entra igual; si es desfavorable, también.

### 29. `hitos[]` — ausente, con una cronología de medio siglo escondida en prosa
- severidad: corregir
- tipo: presentacion
- objecion: el campo existe en el esquema justamente porque un lector lo pidió ("condense en un
  vistazo lo que en prosa ocupa párrafos") y esta ficha es el caso: `monopolio.alcance` es un solo
  párrafo de 2.278 caracteres que va de 1974 a 2025 saltando entre leyes, decretos, un fallo y una
  revocación. Es la información menos legible del lote.
- accion_sugerida: once hitos, todos con fuentes que ya están leídas en esta corrida: 1974-07-25
  creación (Decreto-Ley 14.235); 1991 Ley 16.211; 1992 el referéndum que frena la privatización
  (Caras y Caretas lo narra; la fuente dura es la Corte Electoral); 2001 Ley 17.296 art. 613;
  2002-08-05 Ley 17.524; 2006 Ley 18.046 art. 115; 2014-12-29 Ley 19.307 art. 56; 2016 fallo de la
  SCJ; 2022-06-14 las cinco licencias Clase B; 2022-10-20 Ley 20.075 art. 240; 2025-06 revocación de
  la resolución mayorista. Para el Antel Arena, un hito con el balance como fuente (el fideicomiso
  FAFOAA figura en la Nota 1); el archivo de la causa por parte de Fiscalía es materia de `casos`,
  no de esta ficha, y el brief lo excluye.

### 30. `que_hace` — la exclusividad en fibra la contradice su propia cita
- severidad: corregir
- tipo: contexto_omitido
- objecion: `que_hace` afirma que "en telefonía fija y en la infraestructura de fibra al hogar opera
  en un régimen de exclusividad de hecho". Las dos fuentes del campo dicen otra cosa, y el artículo
  56 vigente también (objeción 15b).
- cita_de_contexto: «Existen otros operadores en el mercado con licencias para la prestación de
  servicios de telefonía móvil, **transmisión de datos** y telefonía internacional.» (balance 2024,
  Nota 1, que es la fuente del propio campo).
- accion_sugerida: describir el estado actual sin adjetivar: exclusividad en telefonía fija —con el
  art. 115 de la Ley 18.046 como respaldo— y, en datos, competencia con Movistar y Claro más los
  cableoperadores con licencia Clase B desde junio de 2022.

### 31. Presentación de las fuentes: 110 entradas para 10 documentos
- severidad: corregir
- tipo: presentacion
- objecion: el balance 2016 aparece 20 veces como fuente, el de 2024 trece, los demás entre 10 y 11.
  Cada año repite además el mismo `concepto` de deuda financiera palabra por palabra ("Préstamos
  corrientes y no corrientes según el estado de posición financiera individual"), diez veces. Es
  exactamente lo que el rol llama "las fuentes repiten decenas de veces el mismo documento cuando una
  línea las agrupa".
- accion_sugerida: que el editor decida cómo agrupa la página los diez PDF (una línea por balance con
  los rubros que respalda), y que el `concepto` repetido baje a `resumen`. No hay que borrar
  fuentes: hay que no imprimirlas cien veces.

### 32. `fuentes: []` en el nivel superior
- severidad: aviso
- tipo: presentacion
- objecion: la ficha publicada de ANCAP tiene siete fuentes generales. Esta, ninguna. Es el lugar
  donde van la página de estados financieros de `antel.com.uy`, la ley de creación y el marco
  regulatorio, para que el lector pueda seguir por su cuenta.
- accion_sugerida: cargar las generales cuando se resuelva el resto.

### 33. `tipo: servicio_descentralizado` (el brief pedía `empresa_publica`)
- severidad: aviso
- tipo: sin_objecion sustantiva
- objecion: el investigador se apartó del brief y tiene razón: la norma de creación dice "un servicio
  público descentralizado" y la cita lo respalda. Lo anoto para que el editor sepa que el desvío es
  deliberado y está fundado, no un error.

### 34. YAML con tabuladores dentro de escalares
- severidad: aviso
- tipo: presentacion
- objecion: las líneas 1783 y 1913 contienen tabuladores literales copiados del PDF. `js-yaml` —el
  parser del proyecto— los tolera y `pnpm validar` pasa; PyYAML y otros los rechazan ("found
  character '\t' that cannot start any token"). Cualquiera que audite el archivo con otra
  herramienta se va a chocar con eso.
- accion_sugerida: pasar esas dos citas a bloque `>-` o reemplazar los tabuladores por espacios; la
  normalización del validador de citas colapsa los espacios igual, así que no cambia la verificación.

### 35. Medio faltante
- severidad: corregir
- tipo: presentacion
- objecion: los 110 errores de `pnpm validar --inbox` son todos `medio: antel` inexistente. Es el
  único medio que falta: `el-observador`, `montevideo-portal`, `ambito`, `en-perspectiva`,
  `presidencia`, `impo`, `caras-y-caretas`, `parlamento` y `justia` ya existen.
- accion_sugerida: crear `content/medios/antel.yaml` con la misma forma que `ancap.yaml`:
  `tipo: estatal`, `grupo: estado-uruguayo`, `url: https://www.antel.com.uy/`, `empresa: antel`,
  `alineamiento.etiqueta: estatal`, y `propiedad.descripcion` con cita del balance. Si se incorporan
  los informes del regulador (objeción 28), va a hacer falta además `ursec` (existe `ursea`, que es
  el de energía y agua, y no sirve).

### 36. Sobre la pregunta del encargo: la Cámara de Telecomunicaciones y `verificacion: manual`
- severidad: aviso
- tipo: sin_objecion
- objecion: el encargo dice que "la fuente de la Cámara de Telecomunicaciones (Cloudflare) quedó en
  `verificacion: manual`". Lo verifiqué contra el registro y **no es así**: la cadena `verificacion`
  no aparece ni una vez en `empresas.yaml`, y la Cámara no es fuente de nada. `notas.md` la deja
  fuera y explica por qué. No hay nada que firmar.
- accion_sugerida: y no habría que crearlo. Marcar `verificacion: manual` sobre una página que no se
  pudo leer, con un texto sacado de un snippet de buscador, es pedirle al mantenedor que firme algo
  que el sitio no leyó. Si se quiere la posición de la Cámara, hay dos caminos legibles: su
  intervención en comisión parlamentaria (versión taquigráfica en `parlamento.gub.uy`, misma búsqueda
  de la objeción 23) o su posición citada textualmente por un medio que sí se pueda abrir.

---

## Objeciones al lote

1. **Cobertura del período: buena en cifras, floja en el medio.** Los diez años de balances están,
   completos y auditados, y eso es lo más caro de esta ficha. En cambio el marco vivo del negocio
   tiene un hueco de once años: hay argumentos de 2012, 2020, 2022 y 2023, y comparaciones de 2012 y
   2023. Nada de 2013-2019 ni de 2024-2026, y `notas.md` lo reconoce solo para el tramo final.

2. **Dependencia de fuentes.** Sobre las cifras, dependencia total y correcta de un solo emisor
   (ANTEL), que es lo que corresponde: son sus estados contables auditados por PwC y KPMG. Sobre el
   marco legal y los argumentos, la dependencia real es de `montevideo-portal` (dos normas, un
   argumento a favor) y de una nota de resumen de titulares de `en-perspectiva` que a su vez cita a
   El Observador (dos argumentos en contra). Las notas que equilibrarían eso ya están leídas y en el
   corpus.

3. **Lo que se leyó y no se usó.** `consultas.jsonl` registra como "ok" tres notas que no aparecen en
   la ficha: El Observador 2022-06-16 (fecha exacta de las resoluciones, argumento de la abogada de
   los cableoperadores), Caras y Caretas 2022-06-26 (argumento a favor, historia normativa,
   referéndum de 1992) y El Observador sobre el superávit de empresas públicas 2017. Las dos
   primeras arreglan la simetría y el problema de un solo grupo sin una sola búsqueda nueva. Que se
   hayan leído y descartado sin explicación en `notas.md` es lo único del proceso que me parece
   improlijo.

4. **Un lote de empresa, no de político.** Se investigó lo que había que investigar y no se
   aprovechó la corrida para cargar declaraciones de Mujica, Lacalle Pou o Larrosa. Correcto: eso es
   otro brief.

5. **Riesgo legal: bajo.** No hay imputaciones a personas, no hay denuncias narradas, el Antel Arena
   queda en `casos_vistos` con el archivo de Fiscalía anotado y fuera de la ficha, y las críticas al
   monopolio están todas atribuidas a quien las hizo. Los dos puntos donde el registro afirma más de
   lo que la fuente respalda son las objeciones 20 (frase agregada a Larrosa) y 24 (el 58% invertido
   en boca de de León); los dos son corregibles con el texto de la fuente a la vista.

6. **Contra la ficha de ANCAP, que es la referencia.** ANTEL queda igual o mejor en cifras (10 años
   con segmentos, deuda, impuestos y transferencias, contra los de ANCAP), parecida en `alcance` y
   argumentos, y claramente por debajo en `comparaciones` (2 contra 11) y en `fuentes` generales
   (0 contra 7). `precios_vs_paridad` ausente es correcto: es un campo pensado para la paridad de
   importación de combustibles y no tiene análogo en telecomunicaciones; no había que inventarle uno.
   El análogo útil —la serie de precios que publica el regulador— es la objeción 28.

---

## Objeciones al brief

El brief no viola la Regla 0: pide el mismo esquema, el mismo período y el mismo esfuerzo para los
dos lados que la ficha de ANCAP, y dice expresamente que el esquema no valida un solo lado. Dos
cosas menores, para las próximas fichas de empresas:

1. **El punto 2 preanuncia el resultado del análisis normativo.** Dice: «`monopolio` (`tiene`:
   verificá qué tiene reservado hoy: telefonía fija y, según la ley de medios y decretos, el tendido
   de fibra al hogar…)». Eso no es un encargo de verificar, es un encargo de confirmar: le da al
   investigador la respuesta antes de leer las normas. Y en este caso la respuesta era incorrecta
   para la fibra, porque el artículo 56 vigente desde octubre de 2022 dice lo contrario. La versión
   simétrica es «verificá **si** tiene algo reservado hoy, con qué texto vigente, y citá el
   artículo», y es la misma redacción que habría que usar para UTE, OSE o ANCAP.

2. **"El Antel Arena y otras inversiones cuestionadas"** trae un encuadre en el sustantivo. Simétrico
   sería «inversiones relevantes, con lo que consta a favor y en contra». No cambió nada en esta
   corrida —el investigador no cargó nada sobre el Arena más allá de la Nota 1 del balance— pero la
   frase, repetida en otras fichas, empuja hacia un solo lado.

---

## Cobertura

Ver `data/corridas/2026-09-07-empresas-antel/cobertura.yaml`, con el criterio aplicado y los casos
que el esquema no admite. Resumen: 8 notas de prensa leídas en el lote, **5 emitibles** como
`cobertura` (2 `desfavorable` — El Observador 2012 hacia Mujica y Caras y Caretas 2022 hacia Lacalle
Pou — y 3 `neutral`), y **3 no emitibles** porque no nombran a ningún político ni partido: En
Perspectiva 2020 (neutral), ámbito 2025 (neutral) y Presidencia 2023 (tono observado `favorable`,
y además es medio estatal, no prensa).

Dos de las cinco emitibles (El Observador 2022-06-16 y Caras y Caretas 2022-06-26) no están citadas
en la ficha: el investigador las leyó y las descartó. Son las mismas que arreglan las objeciones 17
y 23.

## Discrepancias

Ver `data/corridas/2026-09-07-empresas-antel/discrepancias.yaml`: una sola entrada, y el registro de
que apliqué el mismo test a las notas del otro lado.
