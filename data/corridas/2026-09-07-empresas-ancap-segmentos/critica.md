# Crítica — corrida 2026-09-07-empresas-ancap-segmentos

Modelo: Opus 5 (claude-opus-5[1m]) — crítico, por la regla 14 del mantenedor (Opus solo para el crítico).
Lote: inbox/empresas/ancap/2026-09-07-segmentos/
Registros revisados: 1 ficha (`ancap`), revisada por bloque: 10 años de `finanzas[].segmentos[]`, 14 ítems de `precios_vs_paridad.series[]`, `precios_vs_paridad.descripcion`, `hitos[]` (ausente) y el efecto de todo eso en la página.

Documentos abiertos en esta sesión con `pnpm fuente`: planilla URSEA "Series PPI vs PE" (xlsx), presentaciones de resultados de ANCAP 2016, 2020, 2021, 2022, 2023 y 2024, la página del dataset `ursea-ppi_vs_pe_v2` de catalogodatos.gub.uy y la nota de El Observador del 2022-03-07. Además leí `src/pages/empresas/[slug].astro` para saber cómo va a quedar la página, y recalculé desde la planilla las 14 medias anuales del lote.

---

## Lo que verifiqué y está bien (dicho explícitamente, porque la ausencia de crítica también se audita)

- **Las 14 medias anuales de URSEA reproducen exactas.** Recalculé desde el texto de la planilla que devuelve `pnpm fuente`, promedio simple de los meses disponibles: 2015 Súper 95 PE 41,72 / PPI 39,76; gasoil 38,41 / 26,51; 2016 42,50 / 39,28 y 38,70 / 25,69; 2017 45,88 / 42,00 y 40,07 / 27,96; 2018 52,61 / 47,57 y 40,36 / 35,45; 2019 (5 meses) 54,95 / 49,91 y 40,40 / 37,10. Coinciden con el lote hasta el último decimal, y la cobertura declarada (12/12 para 2015-2018, 5/12 para 2019) es la real.
- **La planilla efectivamente termina en mayo de 2019.** La última fila de datos es `2019-05-01`; después vienen solo las notas al pie. El corte no es una elección del investigador. (Ver, aun así, la objeción O-9: hay otro recurso oficial que llega más lejos.)
- **Las tablas de 2016 a 2019 son literales y contiguas**, con encabezado de columnas y fila "Resultado Operativo" en el mismo tramo de texto. Verifiqué la de 2016 en `presentacion-balance-ancap-2016-12-vfinal.pdf` y la de 2018-2019 en `presentacion-balance-2019.html`. La aritmética cierra: 2016 3.923+73−131−4.401 = −536 ≈ total −537 (redondeo del documento); 2017 2.059,6; 2018 5.294,9; 2019 4.043,7, todos idénticos al "TOTAL" impreso.
- **Las conversiones a USD de 2016-2019 son internamente consistentes** con los tipos de cambio de cierre que el resto de la ficha ya usa (3.923/29,34 = 133,7; 2.375,2/28,81 = 82,4; 5.383,5/32,41 = 166,1; 4.203,1/37,31 = 112,7).
- **La búsqueda de 2015 fue seria.** `consultas.jsonl` muestra que se revisaron los EEFF individuales 2015, los consolidados 2019 y 2020, la memoria institucional y la presentación de balance 2015 antes de concluir que no hay desglose por línea de negocio ese año. La `nota` de 2015 lo dice sin adjetivos.
- **La objeción de hecho al brief es correcta y bien hecha.** Los Estados Financieros Individuales no traen nota NIIF 8 de información por segmentos; el dato vive en las presentaciones de resultados. El investigador lo dijo en vez de forzar el dato. (Esa objeción, sin embargo, tiene una consecuencia que el lote no cerró: ver O-1.)
- **El gráfico de precio contra paridad está bien diseñado por construcción.** La página arma, por producto, una serie sólida (precio) y una punteada (paridad) del **mismo color**: dos productos = dos colores y dos trazos, exactamente lo que un lector pidió. No hay objeción de presentación ahí.
- **La convención de signo está declarada en la ficha**, no solo en `notas.md`: la segunda oración de `descripcion` dice qué significa positivo y qué significa negativo. Bien.

---

## Objeciones por registro

### O-1 — `finanzas[2016..2024].segmentos[]` (todos) — atribución de la fuente en la página
- severidad: **bloquea**
- tipo: presentacion
- objecion: La página tiene el texto de la fuente **hardcodeado**: cada serie de segmento se dibuja con `fuente: 'Información por segmentos de los estados contables'`, y el bloque de método imprime *"Segmentos de negocio: el resultado de cada negocio según la nota de información por segmentos de los estados contables; los nombres son los que usa cada balance"* (`src/pages/empresas/[slug].astro`, líneas 76 y 86). El propio lote demuestra que eso es falso para ANCAP: el investigador verificó que los Estados Financieros Individuales **no traen** esa nota y que el dato sale de las presentaciones de resultados, que son documentos distintos y no auditados como parte del estado contable. Antes de este lote `nombresSegmentos` estaba vacío y esas dos frases no se renderizaban; es la incorporación de estos datos la que hace aparecer en el sitio una atribución que las fuentes del propio registro contradicen.
- cita_de_contexto: notas.md del lote: "revisé los Estados Financieros **Individuales** de 2015 y 2024, y los **Consolidados** de 2019, y ninguno trae una nota de 'información por segmentos' al estilo NIIF 8". Y en `presentacion-balance-2019.html`: "RESULTADOS POR LÍNEA DE NEGOCIO ejercicio 2018 - ejercicio 2019" (https://www.ancap.com.uy/8518/1/presentacion-balance-2019.html), documento titulado "Presentación", no estado contable.
- accion_sugerida: No publicar hasta que la página derive ese texto de las fuentes reales del campo (o lo diga genérico: "según los documentos citados en cada serie"). Es un cambio en `src/pages/empresas/[slug].astro`, no en el registro; el editor tiene que pedirlo o dejar el lote en espera. Si se cambia el texto de la página, conviene que diga qué son: "presentaciones de resultados que publica ANCAP junto con sus estados contables".

### O-2 — `finanzas[2020..2023].segmentos[].nota` — la advertencia está en el segmento equivocado
- severidad: **corregir**
- tipo: contexto_omitido
- objecion: Esto es el punto 1 del encargo, y la respuesta es más matizada que "es una inferencia". Abrí las cinco presentaciones. **La `cita` sí es literal y contigua** en el texto extraído (la reproduje carácter por carácter; pasa la etapa 5 de `pnpm validar --red` legítimamente, no por casualidad). Lo que no es literal es *el mapeo de número a categoría*. Y ese mapeo no está indeterminado de forma pareja: casi todo está anclado por prosa o por signo, y **la única ambigüedad real es la que el lote no marcó**.
  - **Total**: dicho en el documento todos los años ("$ 1.449 Total resultado operativo ANCAP" en 2020; "USD +102", "USD + 133", "USD + 46"; y en 2024 en prosa, "el resultado operativo de ANCAP totalizó una pérdida de USD 111 millones").
  - **Combustibles**: en 2021, 2022 y 2023 el documento emite la etiqueta pegada al valor, en la misma línea de texto: *"Combustibles USD 107"*, *"Combustibles USD 144"*, *"Combustibles USD +49"*. En 2024 está en prosa: *"La perdida operativa de Combustibles es de USD 95 millones"*. En 2020 es el único valor compatible con el peso $ 1.322 al tipo de cambio declarado (1.322/42,34 = 31,2) y con *"El 96% de los Ingresos Brutos corresponden al negocio de Combustibles"*.
  - **Portland**: en 2024 está en prosa (*"Portland aporta pérdidas por USD 24,5"*); en 2020-2023 es el único valor negativo del grupo chico, y ANCAP lo dice: *"El resultado de Lubricantes y Gas Natural compensan el resultado negativo de Portland"*.
  - **Lubricantes contra Gas Natural**: acá sí, ninguna restricción del documento distingue cuál es cuál. Las dos asignaciones satisfacen todas las ecuaciones en 2020 (4 / 1,4), 2021 (5 / 3), 2022 (6 / 3,7), 2023 (1,5 / 0,5) y 2024 (5 / 3,5).
  Resultado: la `nota` "Cifra no rotulada como tal en el documento: surge de que Lubricantes, Gas Natural, Portland y esta cifra suman exactamente el resultado operativo total" está puesta en **Combustibles** en 2020, 2021, 2022 y 2023 —el segmento mejor establecido de los cuatro— y **falta en Lubricantes y Gas Natural en esos mismos cuatro años**, que es donde vive la duda. En 2021, 2022 y 2023 esa nota además dice algo que el documento desmiente: la cifra *sí* está rotulada.
- cita_de_contexto: "Combustibles USD +49 / USD -10 USD +18 USD +2 USD +39" (https://www.ancap.com.uy/19352/1/resultados-ancap-ejercicio-2023.html); "Combustibles USD 144" (https://www.ancap.com.uy/17120/1/presentacion-balance-2022.html); "Combustibles USD 107" (https://www.ancap.com.uy/17119/1/presentacion-balance-2021.html).
- accion_sugerida: (a) Quitar la nota de Combustibles en 2021-2023 y reemplazarla, en 2020, por la que corresponde ("la cifra no está rotulada junto a la barra; surge del peso $ 1.322 al tipo de cambio de cierre declarado, $ 42,34/USD"). (b) Poner en Lubricantes y Gas Natural de 2020, 2021, 2022 y 2023 la misma nota que ya tiene 2024. (c) Sumar en esa nota el argumento independiente que sí resuelve la duda y que el lote no usó: en las cuatro tablas literales de 2016 a 2019, Lubricantes es mayor que Gas Natural **todos los años** (73 vs −131; 69,1 vs −28,3; 79,0 vs 45,2; 123,9 vs 31,2), así que la asignación del lote es la única que no exige que Gas Natural se multiplique por cinco y Lubricantes caiga a la mitad en el mismo año. Para 2024 hay además, en la diapositiva siguiente del mismo documento, *"El resultado global del Negocio Lubricantes para el Grupo ANCAP es +USD 6,4 millones"*, más cerca de 5 que de 3,5. Con eso la duda queda acotada y declarada, y no hace falta bajar la ficha entera a `probable`: el error máximo posible es de USD 2,6 millones en el peor año, entre dos segmentos que juntos nunca pasan del 6% del resultado operativo, y no cambia ninguna lectura de la ficha.
- (Alternativa si el editor prefiere no arriesgar nada: colapsar los dos en un solo segmento "Lubricantes y Gas Natural" en los años donde el documento solo da el combinado en prosa —2024, "Lubricantes y Gas natural totalizan USD 8,5 millones"; 2020, "un aporte neto al resultado operativo de 3 millones de dólares"—. Es más literal y menos informativo. Mi recomendación es (a)+(b)+(c), no esto.)

### O-3 — `finanzas[2020..2024].segmentos[].resultado` — falta `pesos`, que es lo que hace auditable la asignación
- severidad: **corregir**
- tipo: presentacion
- objecion: Los cinco documentos dan las cifras **en pesos y en dólares**, y el lote guarda solo `usd`. Justamente los pesos son lo que permite verificar la asignación: 1.322/42,34 = 31,2; 169/42,34 = 4,0; 59/42,34 = 1,4; −102/42,34 = −2,4 (2020). Ídem 2022 (4.335/40,071 = 108, 242 = 6,0, 149 = 3,7, −832 = −20,8) y 2024 (−4.202/44,066 = −95,4; 206 = 4,7; 158 = 3,6; −1.077 = −24,4). El esquema admite los dos campos en el mismo `Monto`. Guardar solo el dólar tira la moneda primaria del documento y obliga al lector a confiar.
- cita_de_contexto: "1322 / Lubricantes / -102 / Combustibles Portland / 169 59 / Gas Natural / $ 1.449 / Total resultado operativo ANCAP / USD 34 USD 31 USD 4 USD 1,4 USD -2,4 / Cifras expresadas en millones. Los pesos fueron convertidos a tipo de cambio de cierre = $ 42,34/USD." (https://www.ancap.com.uy/9447/1/presentacion-balance-2020.html)
- accion_sugerida: Agregar `pesos` en los segmentos de 2020, 2022, 2023 y 2024 (2021 no publica los pesos por segmento en esa lámina, solo dos totales). Es dato ya leído, no requiere corrida nueva.

### O-4 — `finanzas[2016..2024].segmentos[]` — la serie de segmentos no suma al "Resultado del ejercicio" que la página dibuja al lado
- severidad: **corregir**
- tipo: presentacion
- objecion: La página pone las cuatro series de segmento **en el mismo gráfico interactivo** que "Resultado del ejercicio", "Impuestos pagados" y "Deuda financiera", y el lector puede prenderlas juntas. Los segmentos son **resultado operativo**; el resultado del ejercicio es después de resultado financiero, vinculadas e impuesto a la renta. En 2016 eso da un choque frontal: los segmentos suman **−536 millones de pesos** (pérdida operativa) y el resultado del ejercicio del mismo año fue **+435,5 millones** (ganancia). En 2019 los segmentos suman 4.043,7 y el ejercicio dio 1.464,3. El investigador lo advirtió en `notas.md`, pero en la ficha no queda dicho en ningún lado: ni el `metodo` de la página ni ninguna `nota` lo mencionan.
- cita_de_contexto: notas.md: "Todas las cifras son **resultado operativo** (antes de resultado financiero, participación en vinculadas e impuesto a la renta), no resultado del ejercicio (neto): por eso el total de segmentos de un año no coincide con `finanzas[año].resultado_ejercicio`".
- accion_sugerida: Una oración en el bloque de método de la página (`metodoFinanzas`), junto a la línea de segmentos: "Los segmentos son resultado operativo, antes de resultado financiero, vinculadas e impuesto a la renta; por eso no suman el resultado del ejercicio del mismo año." Sin eso el gráfico invita a una suma que no cierra.

### O-5 — `finanzas[2021..2023].segmentos[]` — ANCAP publica el "Resultado monopólico" y el lote lo descarta
- severidad: **corregir**
- tipo: contexto_omitido
- objecion: En 2021, 2022 y 2023 la misma lámina desagrega el resultado de Combustibles en sus componentes, y uno de ellos se llama literalmente **"Resultado Monopólico"**. En 2022 hay además una lámina entera, "RESULTADOS POR MERCADO", que separa resultado monopólico de no monopólico. Los números están: 2022 monopólico **USD −10** y no monopólico **USD +11**; 2023 monopólico **USD −10**, exportaciones/bunkers/pasteras **+18**, UTE **+2**; 2021 **−32 / +45 / +7 / +56**. El lote los pliega todos dentro de "Combustibles" y no los registra. En una ficha cuya sección `monopolio` está obligada por el esquema a llevar argumentos de los dos lados, el número que ANCAP misma publica sobre cuánto gana o pierde **el negocio monopólico** es el dato más pertinente de toda la lámina, y es el único que no entró. La omisión no favorece a nadie —en los tres años el resultado monopólico es negativo, bajo el gobierno de Lacalle Pou— pero deja afuera una cifra que el lector de una ficha sobre un monopolio va a buscar primero.
- cita_de_contexto: "Resultado no monopólico* / Resultado monopólico / IRAE ... USD -10 / Resultado operativo = USD +133 / USD +11 USD +25 USD +52 USD +14 USD +163 / *Incluye combustibles no monopólicos, Exportaciones, Asfaltos, Gasoil Marino, Fuel Oil Marino, Jet A1, Pasteras, Lubricantes, Gas Natural y Portland." (https://www.ancap.com.uy/17120/1/presentacion-balance-2022.html)
- accion_sugerida: Agregar, en 2021, 2022 y 2023, los segmentos "Resultado monopólico" y "Exportaciones, bunkers y pasteras" (y "Resultado UTE" si el editor quiere el detalle), con su cita. Aparecerán como series propias que el lector prende y apaga, que es exactamente para lo que sirve ese gráfico. Nota adicional: la `cita` de 2022 arranca en "Bunkers, Pasteras", es decir **inmediatamente después** de la etiqueta "Resultado Monopólico" del mismo gráfico; extenderla dos palabras hacia atrás resuelve el corte.

### O-6 — `finanzas[2021].segmentos[0].nota` — la salvedad sobre UTE está mal acotada
- severidad: aviso
- tipo: contexto_omitido
- objecion: La nota dice que "Para este año, 'Combustibles' incluye además el resultado por ventas de gasoil a UTE", y `notas.md` refuerza "a diferencia de otros años". No es a diferencia de otros años: el bloque "Resultado UTE" aparece dentro de Combustibles también en 2022 (USD +25) y en 2023 (USD +2). Lo que sí es propio de 2021 es la magnitud (+56) y que el documento la desglosa por trimestre.
- cita_de_contexto: "▪ Incluye resultado por ventas a UTE USD +18 mill. ... ▪ Incluye resultado por ventas a UTE +5 mill." (https://www.ancap.com.uy/17119/1/presentacion-balance-2021.html); "Resultado UTE ... USD +25" (2022); "Resultado UTE ... USD +2" (2023).
- accion_sugerida: Reescribir: "Combustibles incluye el resultado por ventas de gasoil a UTE, que en este año fue de USD +56 millones." Y si entra O-5, la nota sobra porque el número queda a la vista.

### O-7 — `finanzas[2016].segmentos[2]` — el documento dice "Gas", el registro dice "Gas Natural"
- severidad: aviso
- tipo: cita_fuera_de_contexto
- objecion: El encabezado de la tabla de 2016 es "LINEA DE NEGOCIO Combustibles Lubricantes **Gas** Portland TOTAL". El registro lo nombra "Gas Natural" para que la página lo una en una sola serie con 2017-2024. La unificación es la decisión correcta para el gráfico, pero el bloque de método de la página promete que "los nombres son los que usa cada balance", y en 2016 no lo es. El investigador lo anotó en `notas.md` como hipótesis de bajo riesgo; no llegó a la ficha.
- cita_de_contexto: "LINEA DE NEGOCIO Combustibles Lubricantes Gas Portland TOTAL" (https://www.ancap.com.uy/innovaportal/file/2245/1/presentacion-balance-ancap-2016-12-vfinal.pdf)
- accion_sugerida: Una `nota` en ese segmento: "La tabla de 2016 encabeza esta columna 'Gas'; desde 2017 la llama 'Gas Natural'."

### O-8 — `finanzas[2016..2019].segmentos[].resultado` — el tipo de cambio no tiene fuente en el propio monto
- severidad: **corregir**
- tipo: riesgo_legal (rigor de evidencia, no difamación)
- objecion: Los montos de 2016-2019 declaran `tipo_cambio: cierre` y traen `usd`, pero la única fuente del monto es la presentación, y **esas tablas están en pesos y no declaran ningún tipo de cambio** (las de 2020-2024 sí lo declaran al pie). Verifiqué que los valores usados (29,34 / 28,81 / 32,41 / 37,31) son los que el resto de la ficha ya usa y que la aritmética cierra al decimal, así que el número es correcto; lo que falta es la fuente del divisor dentro del registro que lo usa.
- cita_de_contexto: la tabla de 2016 termina en "Resultado Operativo 3.923 73 (131) (4.401) (537)" sin ninguna mención de tipo de cambio (mismo PDF citado en O-7); comparar con 2020: "Los pesos fueron convertidos a tipo de cambio de cierre = $ 42,34/USD".
- accion_sugerida: Agregar como segunda fuente de esos montos el estado contable del año que declara el tipo de cambio de cierre (ya está citado en `finanzas[].resultado_ejercicio` de la misma ficha), o decirlo en la `nota` del año.

### O-9 — `precios_vs_paridad.series[0..9]` — existe el documento oficial que extiende la serie hasta setiembre de 2020 y no se usó
- severidad: **corregir**
- tipo: documento_previsible
- objecion: Este es el punto de simetría, y no se resuelve con una `nota`: se resuelve buscando el archivo. El lote corta la serie en mayo de 2019 porque la planilla que bajó termina ahí, y eso es cierto. Pero **el mismo organismo publica la misma serie más larga**, y el investigador tuvo esa página abierta. El dataset `ursea-ppi_vs_pe_v2` de catalogodatos.gub.uy contiene un recurso llamado "PPI al consumidor final" (CSV, id `7fb4c8d9-8db4-41bf-aac0-254368269d24`; también en xlsx, id `e31b3957-ca94-41d9-82f4-28a85c96bf2c`) cuya descripción dice que trae **las dos** variables que este campo necesita —el PPI al consumidor final y los precios máximos fijados por el Poder Ejecutivo— para **01/2002 a 09/2020**. `notas.md` descarta ese dataset diciendo que "da el PPI desglosado por costos hasta planta de distribución desde octubre de 2020, sin el precio de venta al lado": eso describe el *segundo* recurso del dataset, no este. `consultas.jsonl` confirma que se bajó ese otro ("descargado; resulta ser el desglose de costos del PPI ex-planta desde 2020-10"). Es el recurso equivocado del dataset correcto.
  La consecuencia importa: la serie que hoy tiene el lote termina el 31 de mayo de 2019, es decir **dentro del segundo gobierno de Vázquez y sin un solo mes del gobierno siguiente**. El único gráfico de precio contra paridad de la ficha cubriría un gobierno y ninguno más, y el lector no tiene cómo saber si eso es un límite del archivo o un recorte editorial. Con el recurso que falta, la serie llega a setiembre de 2020 e incluye siete meses del gobierno de Lacalle Pou —incluido el tramo previo a la entrada en vigencia del mecanismo de la LUC—. No es una mejora cosmética: es la diferencia entre un gráfico que cruza un cambio de gobierno y uno que no.
- cita_de_contexto: "Se presentan las series mensuales correspondientes al período 01/2002-09/2020 de: 1. PPI al consumidor final 2. los promedios mensuales de los precios máximos de los combustibles líquidos fijados por el Poder Ejecutivo." (https://catalogodatos.gub.uy/dataset/ursea-ppi_vs_pe_v2). Y en la misma página: "El primer modelo es el PPI al consumidor final y corresponde al período 2002-01 - 2020-09."
- accion_sugerida: El lote no se cierra sin bajar ese recurso. Organismo: URSEA (Gerencia de Regulación), publicado por AGESIC en catalogodatos.gub.uy; ruta: `https://catalogodatos.gub.uy/dataset/af74758a-2175-4b93-9847-4386a17aee00/resource/7fb4c8d9-8db4-41bf-aac0-254368269d24/`. Extender la serie a 2019 completo y a 2020 (enero-setiembre), con `periodo` que diga "2020 (enero-setiembre)" como ya hace con 2019. El mismo criterio vale para cualquier ficha: si el corte de una serie cae justo en un cambio de gobierno, hay que probar que el corte es del archivo y no de la búsqueda.

### O-10 — `precios_vs_paridad.series[0..7]` — quiebre metodológico documentado en medio de la serie
- severidad: **corregir**
- tipo: contexto_omitido
- objecion: La propia planilla avisa, al pie, que el PPI cambió de metodología dentro del tramo que el lote promedia: hasta noviembre de 2017 rige la metodología de 2010 y **el PPI no incluye margen de comercialización**; desde diciembre de 2017 rige la aprobada por el Directorio en noviembre de 2017. El lote compara, en 2015, 2016 y once meses de 2017, un precio de venta al consumidor final (que sí incluye ese margen) contra un PPI que no lo incluye, y en 2018-2019 contra uno que sí. La brecha que va a dibujar el gráfico —gasoil 2015: 38,41 contra 26,51, un 45%; gasoil 2019: 40,40 contra 37,10, un 9%— tiene adentro, en proporción desconocida, ese cambio de definición. Sin decirlo, el gráfico se lee como "la brecha se cerró sola entre 2017 y 2018". Las filas están marcadas en la planilla: `2017-Nov (7)` y `2017-Dic (8)`.
- cita_de_contexto: "(7) Hasta este mes se utilizó la metodología aprobada en Julio de 2010. Los PPI no incluyen margen de comercialización." y "(8) A partir de este mes se calculan los PPI con la metodología vigente aprobada por el Directorio en noviembre de 2017." (https://www.gub.uy/unidad-reguladora-servicios-energia-agua/sites/unidad-reguladora-servicios-energia-agua/files/inline-files/Series_PPI_VS_PE_0.xlsx)
- accion_sugerida: Una oración en `descripcion`, sin verbos de intención: "URSEA cambió el cálculo del PPI en diciembre de 2017: hasta noviembre de ese año no incluía el margen de comercialización." Es información que el lector necesita para leer el gráfico y está en el documento, no es interpretación nuestra.

### O-11 — `precios_vs_paridad.series[0..9].fuentes` — la cita no permite verificar nada, y `verificacion: manual` ya no corresponde
- severidad: **corregir**
- tipo: presentacion
- objecion: Dos cosas, y la segunda es la que ahorra trabajo. (a) Las 20 fuentes de estos diez ítems repiten dos citas que son **encabezados de columna**: "Precios medios al consumidor final de los combustibles , $ corrientes (Fuente MIEM/DNE)" y "Precios de paridad de importación de los combustibles calculados por la URSEA". Ninguna contiene un número. El lector que quiera comprobar de dónde sale 41,72 no tiene por dónde empezar, y la página va a imprimir la misma planilla veinte veces. (b) Las 20 llevan `verificacion: manual` porque, cuando arrancó la corrida, `pnpm fuente` no leía planillas. **Hoy las lee**: la corrí sobre esa URL y devuelve 75.054 caracteres, con las filas separadas por tabulador y el índice normalizado a espacios simples, así que una fila literal valida sola en la etapa 5. Esto no es cosmético: `verificacion: manual` arrastra la ficha entera a la compuerta humana, y sacándolo la ficha deja de necesitar firma por este motivo.
- cita_de_contexto: fila literal disponible como cita, por ejemplo: "2019-05-01 57.01 54.95 40.4 21450 46.9 48886.5 55.11839046 52.89350919 39.08861654" (mismo xlsx, leído con `pnpm fuente`).
- accion_sugerida: Reemplazar las dos citas de encabezado por **una** fuente por ítem, sin `verificacion: manual`, cuya `cita` sea una fila literal del año (la primera del período alcanza para ubicar las columnas), y llevar a `descripcion` la frase que hoy está solo en `notas.md`: que cada valor anual es el promedio simple de los meses disponibles. Si el editor prefiere conservar el encabezado, que vaya como cita de una fuente general y no repetido en cada punto.

### O-12 — `precios_vs_paridad.series[10..11]` — el cálculo es del CED y la página va a firmarlo El Observador
- severidad: **bloquea**
- tipo: presentacion
- objecion: Los dos ítems de 2015-2019 (nafta +443, gasoil +1.337) llevan como única fuente la nota de El Observador, que atribuye el número explícitamente a otro: "observó el documento", el del CED. La página construye el pie de cada serie con `s.fuentes.map(nombreMedio)`, así que el gráfico va a decir que la fuente del cálculo es **El Observador**, un medio que lo repitió, y no el centro de estudios que lo hizo. Peor: la ficha publicada ya trae esos mismos números en `comparaciones[]` con una advertencia de procedencia trabajada con cuidado —"cálculo del CED, centro de estudios privado con vínculo institucional documentado con Lacalle Pou; no es un dato oficial ni reproducible solo con la fuente oficial"—, y `SerieParidad` **no tiene ningún campo donde poner eso**. Mover las cifras a `series[]` las despoja de la salvedad que la ficha ya había ganado. El esquema del campo dice, además, "solo con fuente oficial o cálculo publicado con autor": acá el autor no aparece.
- cita_de_contexto: "Según el informe del CED, entre 2010 y 2014 'la nafta tuvo un precio subsidiado por US$ 78 millones...' ... En la misma línea, durante los años 2015 a 2019 'la nafta presentó un sobreprecio de US$ 443 millones, mientras que los consumidores uruguayos de gasoil pagaron aproximadamente US$ 1.337 millones más que la referencia de PPI', **observó el documento**." (https://www.elobservador.com.uy/nota/el-precio-de-la-nafta-y-el-gasoil-que-muestran-los-numeros-de-este-gobierno-y-el-fa--20223316150)
- accion_sugerida: Sacar los ítems 10 y 11 de `series[]` y dejar esas cifras donde ya estaban y donde llevan el autor y la salvedad: `comparaciones[]`. Si el editor quiere igual el gráfico de brecha, primero hay que conseguir el boletín macroeconómico del CED (el documento que hizo el cálculo) y citarlo a él. Es la misma regla que el sitio aplica a cualquier análisis de terceros.

### O-13 — `precios_vs_paridad.series[10..13]` — el gráfico de barras compara cinco años acumulados contra un año
- severidad: **bloquea**
- tipo: asimetria
- objecion: La página arma con estos cuatro ítems un gráfico de barras titulado "Diferencia entre lo cobrado y la paridad de importación", una serie por `producto` y el `periodo` como etiqueta del eje. Con lo que trae el lote quedan cuatro series de cuatro colores —"nafta", "gasoil", "combustibles fósiles (nafta y gasoil combinados)", "supergás"— donde dos barras son un **acumulado de cinco años** (2015-2019: +443 y +1.337) y dos son **un solo año** (2024: −55 y −24), en el mismo eje y con la misma unidad. Leído como lo va a leer cualquiera, dice: bajo un gobierno se cobró 1.337 de más, bajo el otro se subsidió 55. Anualizado, 1.337 en cinco años son 267 por año. Y como los productos difieren, `colorear_por_signo` queda apagado, así que ni siquiera el color distingue sobreprecio de subsidio.
  Que la asimetría no sea intencional no la arregla: la ficha **ya tiene** la normalización que la corrige y el lote no la usó. `comparaciones[4]` dice, del mismo informe: "Los anteriores sobreprecios significaron un promedio de US$ 288 millones por año durante una década. En contraste, entre 2020 y 2021 ese número disminuyó a US$ 40,5 millones anuales". Y faltan en `series[]` los dos períodos que completarían el cuadro y que la ficha ya tiene citados: 2010-2014 (nafta −78, gasoil +1.181, gobierno de Mujica) y 2020-2021 (+40,5 anuales, gobierno de Lacalle Pou). Señalo la dirección para que quede claro que el arreglo no beneficia a nadie: agregar 2010-2014 empeora el cuadro del período frenteamplista, y agregar 2020-2021 empeora el del gobierno siguiente respecto de mostrar solo el subsidio de 2024. Completar es lo simétrico; recortar en cualquiera de los dos sentidos no lo es.
- cita_de_contexto: "Los anteriores sobreprecios significaron un promedio de US$ 288 millones por año durante una década. En contraste, entre 2020 y 2021 ese número disminuyó a US$ 40,5 millones anuales, según se deduce de los números publicados por el think tank." (misma nota de El Observador).
- accion_sugerida: Primera opción, y la que recomiendo: no dibujar este gráfico con estos datos. Sacar los cuatro `diferencia_usd_millones` de `series[]` (las cifras siguen en `comparaciones[]`, con autor y salvedad). Segunda opción, si el editor quiere el gráfico: que **todas** las barras sean de la misma naturaleza —promedio anual— y que estén los cuatro períodos que la ficha ya cita (2010-2014, 2015-2019, 2020-2021, 2024), con el autor de cada cálculo en la fuente de su serie. Lo que no puede publicarse es la mezcla actual.

### O-14 — `precios_vs_paridad.descripcion` — la nueva versión borra el contrapunto documentado de la publicada
- severidad: **bloquea**
- tipo: asimetria
- objecion: El lote reemplaza un párrafo ya publicado por dos oraciones, y en el camino desaparecen dos cosas que no son adorno: (1) que **el cálculo del PPI está discutido, incluida ANCAP**, que es el sujeto de la ficha; y (2) el **"factor X"**, el ajuste que el propio gobierno agregó al PPI desde agosto de 2021 justamente porque reconoció sobrecostos del ente. El registro suma, al mismo tiempo, un gráfico que usa el PPI como vara. Sacar la salvedad sobre la vara mientras se agrega el gráfico que la usa es una pérdida neta del otro lado del argumento, en una colección cuyo esquema exige que un monopolio lleve los dos lados con el mismo esfuerzo. `notas.md` dice que la información "sigue viviendo en `monopolio.alcance`": verifiqué y no es así — `alcance` conserva el mecanismo de la LUC y las leyes, pero ni "factor X" ni la crítica al cálculo aparecen ahí. Lo único que sobrevive son las dos citas de la diaria en `fuentes[]`, sin ninguna prosa que las use.
- cita_de_contexto: lo que se borra, en la versión publicada: "El cálculo recibió críticas técnicas desde diversos ámbitos, incluida ANCAP, que sostiene que subestima costos. Desde agosto de 2021 se sumó al PPI un ajuste adicional (el 'factor X'...)". Está respaldado por fuentes que la ficha ya tiene: "la Ursea realiza un cálculo teórico –que recibió críticas técnicas desde diversos ámbitos, incluida Ancap, que entiende que hay costos subestimados–" (la diaria, 2021-11-24), y ahora también por un documento primario de ANCAP que leí en esta corrida: "Reconocimiento a partir de agosto de factor X= + 2,97$/lt en gasolinas y gasoil" (https://www.ancap.com.uy/17119/1/presentacion-balance-2021.html).
- accion_sugerida: Reponer las dos ideas en `descripcion`, en dos oraciones cortas, con las fuentes que ya están. Y decirle al editor que el tope de "dos oraciones" del brief, aplicado al pie de la letra, es lo que produjo este recorte: `descripcion` es el único campo de prosa del bloque y ahora tiene que sostener cuatro cosas (qué es el PPI, qué mide la diferencia, que el cálculo está discutido y desde cuándo lleva el factor X), más las dos salvedades de O-10 y O-11. Cuatro a seis oraciones cortas siguen siendo un párrafo legible; dos oraciones no alcanzan y el costo de forzarlas es informativo, no estético.

### O-15 — `hitos[]` — ausente, y la ficha tiene la línea de tiempo escrita en prosa
- severidad: **corregir**
- tipo: presentacion
- objecion: La ficha no tiene `hitos[]` y la página tiene el componente listo (`Timeline id="hitos"`). Es exactamente el caso que el punto de presentación nombra: una secuencia de hechos fechados que hoy vive en párrafos de `monopolio.alcance` y del `resumen`, donde el lector tiene que reconstruirla leyendo. Y todos los hitos ya tienen fuente **en la propia ficha**: no hace falta investigar nada nuevo.
- cita_de_contexto: `monopolio.alcance` publicado: "La Ley 17.448 (4 de enero de 2002)... esa ley fue derogada por el referéndum del 7 de diciembre de 2003 (62,2% de los votos válidos por el Sí a la derogación)".
- accion_sugerida: El editor puede armarla con lo que ya está citado: 1931-10-15 creación (Ley 8.764, fuente impo); 2002-01-04 Ley 17.448 de desmonopolización; 2003-12-07 referéndum que la deroga; 2016-02-02 capitalización del MEF por UI 5.840.159.519 (Ley 19.368); 2020 excepción de bunkers en puertos de la ANP; 2020 LUC arts. 235-237, mecanismo de fijación de precios; 2020-12-18 Ley 19.924; 2021-07 entrada en vigencia del mecanismo PPI; 2021-08 factor X de $ 2,97/litro; 2022-10-20 Ley 20.075, hidrógeno verde fuera del monopolio; 2023-07-25 decreto que amplía la excepción aeroportuaria; 2024 parada de la Refinería de La Teja. Doce hitos, todos con fuente ya en el archivo.

### O-16 — `finanzas[2015].nota` — párrafo donde la página muestra una nota al pie
- severidad: aviso
- tipo: presentacion
- objecion: La página junta las `nota` de cada año en notas al pie numeradas bajo la tabla. La de 2015 son 330 caracteres con dos oraciones encadenadas por punto y coma, y solo la primera mitad es lo que el lector necesita ahí.
- accion_sugerida: "No hay desglose por línea de negocio para 2015: ese formato aparece por primera vez en la presentación del ejercicio 2016." El resto ya está en `notas.md`. (La `nota` de 2016, de dos párrafos, viene de la ficha publicada y no la toca este lote; queda anotada por si el editor hace una pasada de presentación.)

---

## Objeciones al lote

- **Cobertura de segmentos: 9 de 10 años, y el faltante está bien fundamentado.** 2015 no tiene desglose y se buscó en cuatro documentos distintos antes de decirlo. Sin objeción.
- **Simetría del corte de la serie de precios: no está resuelta.** El corte en mayo de 2019 es real (lo verifiqué), pero deja el único gráfico de precio contra paridad enteramente dentro de un gobierno, y existe un recurso oficial de la misma URSEA que llega a setiembre de 2020 y que no se bajó (O-9). Mientras eso no se busque, el lote no debería cerrarse: el criterio tiene que ser el mismo para todos, y "el archivo que abrí termina acá" no equivale a "la serie oficial termina acá".
- **Simetría del gráfico de brecha: rota tal como está** (O-13). Cuatro barras que mezclan un quinquenio acumulado con un año suelto, y dos períodos ya citados en la ficha que no entran. Lo señalo con las dos direcciones explícitas para que quede claro que completar no favorece a ninguno.
- **Simetría entre segmentos que ganan y que pierden: correcta.** Portland, que pierde todos los años, está registrado con el mismo detalle que Combustibles, y lleva además la salvedad de los deterioros contables (2016: $ 3.621 millones; 2021: USD 6,3; 2022: USD 1,4). Las notas describen sin adjetivos. Sin objeción.
- **Dependencia de un solo grupo de medios: no aplica en el sentido habitual, pero conviene decirlo.** Casi toda la evidencia nueva es `documento_oficial` del grupo `estado-uruguayo` (ANCAP y URSEA), que es lo correcto para una ficha de empresa. La única fuente de prensa del material nuevo es una: El Observador (grupo `werthein-hochbaum`), y aporta las dos cifras que O-12 recomienda sacar de `series[]`. Con eso hecho, el lote queda sin dependencia de prensa.
- **Riesgo legal: bajo.** No hay imputaciones a personas, no hay denuncias, no hay trascendidos. Las cifras de pérdida por segmento son las que ANCAP publica de sí misma. El único punto de rigor probatorio es O-8 (tipo de cambio sin fuente en el monto) y el mapeo de O-2, ambos acotados.
- **Proceso: esto modifica una ficha ya publicada.** `content/empresas/ancap.yaml` existe con `procedencia.tipo: correccion` (`2026-09-07-ancap-ficha-y-reexpresion-2020`). El lote es una copia con campos agregados y con `descripcion` reescrita, así que `pnpm promover` va a negarse sin `--correccion`. Hace falta un registro nuevo en `content/correcciones/` que declare qué cambia y por qué; y como `descripcion` no es un agregado sino un reemplazo de prosa publicada, la corrección tiene que decirlo, no pasarlo como ampliación. Si se aplica O-14, además, el tipo deja de ser puramente `presentacion`.
- **Compuerta humana: evitable.** Los 20 `verificacion: manual` de la planilla URSEA son lo único que mandaría esta ficha a firma. `pnpm fuente` ya lee el xlsx (O-11), así que sacándolos el lote se resuelve sin humano.

## Objeciones al brief

- **No hay violación de Regla 0 en el brief.** Pide dos series sobre una empresa pública, dice explícitamente que el mismo criterio vale para cualquier empresa, e invita a objetar. Lo confirmo.
- **Sí hay dos errores de encargo, y uno tuvo costo editorial.**
  1. El brief manda a buscar los segmentos en la nota de "información por segmentos" de los Estados Financieros Individuales. Esa nota no existe en ANCAP. El investigador lo detectó y lo dijo bien; lo que ninguno de los dos cerró es que **la página imprime esa misma premisa equivocada como atribución de fuente** (O-1). Un brief que nombra el documento equivocado no es grave; que el sitio herede la premisa, sí.
  2. El tope de "dos oraciones" para `precios_vs_paridad.descripcion` es el que produjo el borrado del párrafo con la crítica al PPI y el factor X (O-14). No corresponde tratarlo como un límite duro: el campo es el único lugar de prosa del bloque y tiene que sostener las salvedades sin las cuales el gráfico se lee mal. Recomiendo que el brief diga "párrafos cortos, sin adjetivos" en vez de contar oraciones, con el mismo criterio para cualquier empresa.
- **Un pedido del brief no se cumplió y conviene que quede dicho:** "Si el CED o ANCAP publican la diferencia agregada en millones de dólares para un período, `diferencia_usd_millones` **con su fuente**". Se cumplió con ANCAP (fuente propia) y no con el CED (se citó a quien lo repitió). Ver O-12.

## Discrepancias de la prensa contra el documento

**No escribo `discrepancias.yaml` en esta corrida, y digo por qué.** Releí la única nota de prensa del material nuevo (El Observador, 2022-03-07) y no encontré distancia comprobable contra un documento primario: las cifras que atribuye al CED están entrecomilladas y atribuidas ("observó el documento"), y el informe del CED no lo tengo, así que no hay documento que decida. La otra nota citada por la ficha (la diaria, 2021-11-24) describe el PPI y el factor X en términos que **coinciden** con el documento primario que sí leí —"Reconocimiento a partir de agosto de factor X= + 2,97$/lt en gasolinas y gasoil", presentación de resultados 2021 de ANCAP—, o sea que el cotejo dio bien. Registrar una discrepancia acá exigiría el boletín del CED; sin él, esto es un desacuerdo de metodologías, no una discrepancia, y va a la crítica como tal. Anotarlo en `discrepancias.yaml` con un solo medio de un solo lado, sin el documento que decide, sería el problema de Regla 0 que la regla nombra.

---

## Cobertura

```yaml
- medio: el-observador
  url: https://www.elobservador.com.uy/nota/el-precio-de-la-nafta-y-el-gasoil-que-muestran-los-numeros-de-este-gobierno-y-el-fa--20223316150
  titulo: "El debate por el precio de la nafta y el gasoil: qué muestran los números de este gobierno y el FA"
  fecha: 2022-03-07
  evento: mecanismo-precios-combustibles-luc
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    La nota expone el argumento del oficialismo y también lo cuestiona en voz propia y de terceros:
    "A pesar de estar vigente la Ley de Urgente Consideración, el informe de Ursea solo fue seguido
    en las primeras recomendaciones", y cita a Oddone diciendo que "este gobierno, por razones de
    economía política, ha usado argumentos para romper su propia regla"; también recoge su defensa
    ("la Ursea sugirió determinados aumentos y nosotros decidimos aumentar la mitad de lo sugerido").
    Trato parejo, sin frase que incline el tono.

- medio: el-observador
  url: https://www.elobservador.com.uy/nota/el-precio-de-la-nafta-y-el-gasoil-que-muestran-los-numeros-de-este-gobierno-y-el-fa--20223316150
  titulo: "El debate por el precio de la nafta y el gasoil: qué muestran los números de este gobierno y el FA"
  fecha: 2022-03-07
  evento: mecanismo-precios-combustibles-luc
  politico: vazquez
  tono: neutral
  justificacion: >-
    La nota critica en voz propia el método de los asesores del Frente Amplio ("si solo se toma los
    dos extremos de un período y se calcula un promedio, se pasa por alto qué ocurrió entre medio")
    y arrima la cifra del CED sobre el período de Vázquez ("durante los años 2015 a 2019 'la nafta
    presentó un sobreprecio de US$ 443 millones'"), pero reproduce completa la respuesta de esos
    mismos asesores ("descarta de plano cualquier posibilidad de considerar que se registraron
    'tarifazos'") y aplica el mismo escrutinio al gobierno siguiente. El saldo es parejo.

- medio: el-observador
  url: https://www.elobservador.com.uy/nota/el-precio-de-la-nafta-y-el-gasoil-que-muestran-los-numeros-de-este-gobierno-y-el-fa--20223316150
  titulo: "El debate por el precio de la nafta y el gasoil: qué muestran los números de este gobierno y el FA"
  fecha: 2022-03-07
  evento: mecanismo-precios-combustibles-luc
  politico: mujica
  tono: neutral
  justificacion: >-
    Lo menciona solo como referencia temporal de un dato que no lo señala en particular, y el dato
    citado del CED para su período incluye las dos direcciones: "entre 2010 y 2014 'la nafta tuvo un
    precio subsidiado por US$ 78 millones mientras que, en caso contrario, el gasoil evidenció un
    sobreprecio de US$ 1.181 millones'".
```

Los demás documentos que abrí en esta corrida (presentaciones de resultados de ANCAP 2016, 2020, 2021, 2022, 2023 y 2024; planilla y dataset de URSEA) son `documento_oficial` del propio sujeto o del regulador, no notas de prensa, y no llevan registro de tono.

---

## Resumen para el editor

**Bloquean (4):** O-1 (la página atribuye los segmentos a los estados contables, que no los traen), O-12 (el cálculo del CED firmado por El Observador y sin la salvedad de procedencia que la ficha ya tenía), O-13 (gráfico de barras que pone cinco años acumulados junto a un año), O-14 (la nueva `descripcion` borra la crítica al PPI y el factor X mientras se agrega el gráfico que usa el PPI como vara).

**A corregir (9):** O-2 (notas en el segmento equivocado en 2020-2023), O-3 (falta `pesos`), O-4 (los segmentos no suman el resultado del ejercicio y nadie lo dice), O-5 (falta el "Resultado monopólico" que ANCAP publica), O-8 (tipo de cambio sin fuente en 2016-2019), O-9 (**documento previsible**: el recurso de URSEA que llega a setiembre de 2020), O-10 (quiebre metodológico del PPI en diciembre de 2017), O-11 (citas de encabezado y `verificacion: manual` ya innecesario), O-15 (falta `hitos[]`).

**Avisos (3):** O-6 (UTE también en 2022 y 2023), O-7 ("Gas" contra "Gas Natural" en 2016), O-16 (`nota` de 2015 demasiado larga para una nota al pie).

El lote no se cierra sin O-9: el mismo documento que se le exige a una ficha se le exige a todas, y una serie que termina justo donde termina un gobierno tiene que probar que el corte es del archivo.
