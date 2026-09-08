# Crítica — corrida 2026-09-07-analisis-ced-ancap-paridad

Modelo: Opus 5 (`claude-opus-5[1m]`), corriendo como `critico`. Por la regla 14 del mantenedor, Opus
solo corre en este rol.
Lote: `inbox/empresas/ancap/2026-09-07-analisis-ced/`
Registros revisados: 1 registro de `analisis` (`ced-sobreprecio-combustibles-paridad`), con 6
afirmaciones y 1 gráfico. Se revisan por separado la cabecera del registro, cada afirmación y el
gráfico.

Fuentes releídas en esta sesión con `pnpm fuente`: la nota de El Observador (completa), el boletín
del CED en la copia de todoelcampo.com.uy **y en la copia del propio CED**
(`https://ced.uy/public/archivos/boletines/doc_13.pdf`, que el lote no usó), la planilla de URSEA
`Series_PPI_VS_PE_0.xlsx` (volcado completo, 76.107 caracteres), la página de URSEA de PPI, la
página `ced.uy/quienes_somos.php`, el dataset `ursea-ppi_vs_pe_v2` de catalogodatos.gub.uy y sus
recursos `ppi_pe.csv` y `ppi_pe.xlsx`, la página de series estadísticas de petróleo y derivados del
MIEM, el dataset `ancap-cantidad-ventas-combustibles`, el dataset `ancap-precio-combustible-pe` y el
dataset `miem-consumo-final-energetico-por-fuente`.

`pnpm validar --inbox inbox/empresas/ancap/2026-09-07-analisis-ced` pasa limpio (377 registros, 0
errores de esquema, 0 de referencias). La observación de proceso que el investigador dejó en
`notas.md` sobre `veredicto` no se materializa: el normalizador de inbox inyecta el placeholder. No
hay acción pendiente por ahí.

---

## Hallazgo que gobierna casi toda la crítica

**Los "huecos" de la planilla de URSEA no existen. Son un artefacto de la extracción del
investigador.**

La planilla `Series_PPI_VS_PE_0.xlsx` tiene **209 filas mensuales consecutivas, de 2002-01 a
2019-05, sin un solo mes faltante**. El investigador contó 153 porque su parseo solo reconoció las
filas cuya primera celda se imprime como fecha ISO (`2010-01-01`). Las otras 56 filas tienen la
fecha escrita como texto, muchas con la llamada al pie que URSEA usa para marcar los meses que
recalculó: `2012-Jun`, `2013-Ene`, `2013-Feb(1)`, `2014-Ago (4)`, `2016-Nov(5)(6)`, `2018-may (10)`,
`2019-ene (10)`. Esas filas están en el archivo, con sus datos completos, y quedaron afuera.

Cita de contexto (fila que el registro declara inexistente, tal como la imprime `pnpm fuente` sobre
`https://www.gub.uy/unidad-reguladora-servicios-energia-agua/sites/unidad-reguladora-servicios-energia-agua/files/inline-files/Series_PPI_VS_PE_0.xlsx`):

```
2013-Ene	38.63225806	37.20322581	35.50322581	14927.09677	29.15	32710		37.95012683	36.01010796	29.88411952	17667.47639	16591.20846	38.16473771	30708.63462
```

Cobertura real por año, contando todas las filas: 2010 a 2018, **12 meses cada uno**; 2019, 5 meses
(enero a mayo, porque ahí termina el archivo). Es decir **60 de 60 meses para 2010-2014 y 53 de 60
para 2015-2019**, no "29 de 60" y "28 de 60".

Rehecho el promedio con las 209 filas y las mismas columnas que declaró el investigador (col. 2 PE
nafta súper 95, col. 9 PPI nafta súper 95, col. 3 PE gas oil, col. 10 PPI gas oil), la
reconstrucción da:

| período | producto | PE $/lt | PPI $/lt | PE vs PPI | lo que dice el registro |
|---|---|---|---|---|---|
| 2010-2014 (60 m) | nafta | 35,80 | 36,52 | **−2,0 %** (subsidio) | −5,5 %, con 29 meses |
| 2010-2014 (60 m) | gas oil | 34,33 | 28,81 | **+19,2 %** (sobreprecio) | +15,8 %, con 29 meses |
| 2015-2019 (53 m) | nafta | 46,55 | 42,88 | **+8,6 %** (sobreprecio) | +8,4 %, con 28 meses |
| 2015-2019 (53 m) | gas oil | 39,48 | 29,68 | **+33,0 %** (sobreprecio) | +26,5 %, con 28 meses |

Promedios anuales correctos, para rehacer el gráfico (PE nafta / PPI nafta / PE gas oil / PPI gas
oil, $ corrientes por litro):

```
2010  28,80  30,34  27,80  21,86   (12 meses)
2011  33,18  35,29  32,07  28,00   (12)
2012  37,12  37,45  35,56  30,73   (12)
2013  38,11  38,39  36,35  30,66   (12)
2014  41,77  41,12  39,87  32,79   (12)
2015  41,72  39,76  38,41  26,51   (12)
2016  42,50  39,28  38,70  25,69   (12)
2017  45,88  42,00  40,07  27,96   (12)
2018  52,61  47,57  40,36  35,45   (12)
2019  54,95  49,91  40,40  37,10   (5: enero a mayo)
```

Consecuencias, para que el editor las tenga juntas:

1. La conclusión cualitativa del lote **se sostiene y se refuerza**: la nafta pasa de venderse por
   debajo de la paridad en 2010-2014 a venderse por encima en 2015-2019, y el gas oil se vende por
   encima en los dos quinquenios, con una brecha mayor en el segundo. Con la serie completa la
   brecha del gas oil es más grande que la que reporta el registro en los dos períodos, y el
   subsidio de la nafta 2010-2014 es más chico.
2. Todo lo que el registro dice sobre huecos —cuatro `dato_real.valor`, la `nota` del gráfico, el
   `metodo` del gráfico, las diez `nota` de punto y el `## metodo` de `notas.md`— es falso y hay que
   reescribirlo. El único hueco real es 2019-06 a 2019-12, porque el archivo termina en 2019-05.
3. Las cuatro citas de filas de URSEA que el registro usa existen verbatim (las verifiqué una por
   una contra el volcado). El problema no son las citas, es la inferencia sobre el conjunto de
   filas. `pnpm validar:red` no lo iba a detectar.
4. Los años 2013 y 2014, que hoy faltan en el gráfico, tienen datos y tienen que estar.

---

## Objeciones por registro

### analisis[0] — cabecera: `resumen`
- severidad: **bloquea**
- tipo: contexto_omitido / asimetria
- objecion: el `resumen` dice *"Entre 2020 y 2021, ya con el mecanismo de la LUC vigente, los
  sobreprecios fueron menores"*. El CED, en el mismo boletín y a continuación de esas dos cifras,
  concluye exactamente lo contrario sobre la LUC. El `resumen` es, por esquema, "qué sostiene el
  análisis"; hoy sostiene algo que el análisis niega, y lo niega en la oración siguiente a la que el
  registro sí cita. Además, el encuadre temporal no se sostiene: de los 24 meses de 2020-2021 el
  mecanismo rigió desde julio de 2021, y la propia nota lo dice.
- cita_de_contexto: *"De este modo, los artículos referentes a este tema de la LUC, votados por todo
  el sistema político, no parece haber generado ningún cambio relevante en la política de fijación
  de precios. También parece claro que su espíritu (precios que rápidamente reflejen las variaciones
  de los costos) está siendo dejado atrás por el gobierno."*
  (`https://ced.uy/public/archivos/boletines/doc_13.pdf`; idéntico en la copia de todoelcampo). Y:
  *"La puesta en marcha del nuevo esquema de fijación se aplazó por la pandemia y el gobierno recién
  anunció su aplicación desde julio del año pasado, aunque desde entonces ha recogido parcialmente
  lo pautado por el informe PPI de la Ursea."*
  (`https://www.elobservador.com.uy/nota/el-precio-de-la-nafta-y-el-gasoil-que-muestran-los-numeros-de-este-gobierno-y-el-fa--20223316150`)
- accion_sugerida: sacar la cláusula causal "ya con el mecanismo de la LUC vigente". Agregar, como
  parte de lo que sostiene el análisis, la conclusión del CED sobre la LUC y sobre la
  discrecionalidad ("Desde el 2010 en adelante, es claro como los precios de venta al público no
  reflejaron (en ningún sentido) los costos asumidos por ANCAP"), que es la afirmación transversal
  del boletín y la que le da simetría entre gobiernos. Partirlo en párrafos cortos: hoy es un solo
  bloque de ~200 palabras con oraciones de 60.

### analisis[0] — cabecera: `publicado`
- severidad: **corregir**
- tipo: presentacion
- objecion: dos cosas. (a) `publicado.cita` trae *"En el punto de partida, el gobierno reconoció un
  sobreprecio de hasta $ 2,97 por litro (llamado factor x)…"*, que no tiene nada que ver con el
  análisis del CED: es el párrafo de la nota sobre el factor X. El esquema pide "una cita de su
  título o primera oración" del análisis. (b) El análisis se publicó el 2022-03-03 en el Boletín
  Macroeconómico N°27 del CED; El Observador lo cubrió el 2022-03-07. `publicado` debería ser el
  boletín, y ahora existe la URL del propio autor, que el lote no usó: leí
  `https://ced.uy/public/archivos/boletines/doc_13.pdf` con `pnpm fuente` en esta sesión y es el
  mismo documento que la copia de todoelcampo.com.uy. Hoy el registro cita al CED con `medio: ced`
  pero apuntando a una URL de un tercero que subió el PDF, y `content/medios/todoelcampo.yaml` ni
  siquiera existe.
- cita_de_contexto: portada del PDF del propio CED: *"comparando con el PPI, la nafta tuvo un precio
  subsidiado por USD 78 millones mientras que, en caso contrario, el gas oil evidenció un
  sobreprecio de USD 1.181 millones."* (`https://ced.uy/public/archivos/boletines/doc_13.pdf`)
- accion_sugerida: `publicado` = el boletín del CED en su URL propia, con cita de portada o de la
  primera oración del apartado; `fecha` del registro = 2022-03-03 (fecha del análisis, no de la
  cobertura); El Observador pasa a ser una fuente de cobertura dentro de las afirmaciones que le
  corresponden (5 y 6, que son cifras del medio, no del CED). Mantener también la copia de
  todoelcampo si se quiere redundancia de archivo, pero la primaria es la del autor.

### analisis[0] — cabecera: `autor_es`
- severidad: **corregir**
- tipo: asimetria
- objecion: `autor_es` se construye con dos ítems de `ced.uy/quienes_somos.php` y los dos apuntan a
  Lacalle Pou. La misma página, en la misma lista, dice otras cosas que un `autor_es` honesto tiene
  que poder incluir o descartar con un criterio explícito, no por selección. Además, de los hechos
  citados solo la cena de 2021 es anterior al boletín de marzo de 2022: el discurso de 2023, las
  exposiciones de los candidatos de 2024 y Galperin en 2025 son posteriores al análisis que se está
  evaluando, y el texto no lo aclara. Falta también el dato más simple y más útil: quién dirige el
  CED (Agustín Iturralde), que está documentado en la propia nota que el lote leyó.
- cita_de_contexto: de la misma página: *"+370 expositores con los más destacados referentes
  políticos de la región, políticos de todos nuestros partidos, intelectuales de prestigio
  internacional y los más reconocidos analistas de nuestro medio."*; *"Co-organizamos junto a Atlas
  Network el 1° Latin America Liberty Forum en Uruguay"*; *"En 2017 fuimos reconocidos como el mejor
  Centro de Estudios nuevo de América Latina por el Think Tanks And Civil Societies Program de la
  Universidad de Pennsylvania."* (`https://ced.uy/quienes_somos.php?idm=esp`). De la nota: *"El
  director del Centro de Estudios para el Desarrollo (CED) Agustín Iturralde escribió que sólo ve
  'sentido político partidario' a una comparación de esa naturaleza"*
  (`https://www.elobservador.com.uy/nota/...20223316150`).
- accion_sugerida: fechar cada vínculo, decir cuáles son anteriores y cuáles posteriores al
  análisis, agregar el nombre del director, y aplicar un criterio único: o se listan los vínculos
  institucionales documentados con todos los actores que la página nombra (incluida la frase
  "políticos de todos nuestros partidos" y las exposiciones de los candidatos de 2024), o se limita
  a los anteriores al boletín. Lo que no puede quedar es la selección actual, que toma de una página
  solo los ítems que apuntan a una persona. Es Regla 0: el vínculo se registra como dato con fuente
  y con el mismo umbral en las dos direcciones.

### analisis[0] — cabecera: `metodo`
- severidad: **corregir**
- tipo: presentacion
- objecion: el esquema define `metodo` como "el método tal como lo describe el autor". La segunda
  mitad del campo no es del autor: es la limitación de esta investigación, y termina con *"que esta
  investigación no tuvo disponible en un formato descargable (ver notas.md, sección metodo)"*.
  `notas.md` es un archivo privado del inbox que el lector nunca va a ver. Una página publicada no
  puede remitir a un archivo que no existe para quien la lee.
- cita_de_contexto: —
- accion_sugerida: `metodo` = solo la cita del CED. Lo nuestro (qué se pudo reconstruir y qué no) va
  al `veredicto` del editor y al `metodo` del gráfico, sin referencias a `notas.md`.

### analisis[0].afirmaciones[0] — nafta 2010-2014, subsidio de USD 78 millones
- severidad: **bloquea**
- tipo: documento_previsible (+ el error de huecos descrito arriba)
- objecion: dos capas. (a) El `dato_real.valor` afirma que *"2013 y 2014 no tienen ninguna fila en el
  archivo"* y construye el cotejo sobre 29 meses. Es falso: son 60 de 60, y con la serie completa la
  brecha es −2,0 %, no −5,5 %. (b) El `_faltante: dato_oficial` está mal cerrado. El documento que
  falta —la serie de litros vendidos— es previsible y está publicado: el MIEM/DNE publica
  **"Venta de derivados de petróleo al mercado interno y zona franca"** (serie mensual nacional por
  producto) en la misma página que el investigador visitó y de la que solo mencionó los dos archivos
  por departamento. No aparece en `notas.md` ni en `consultas.jsonl`.
- cita_de_contexto: *"Venta de derivados de petróleo al mercado interno y zona franca (.zip 189.43
  KB) — https://www.gub.uy/ministerio-industria-energia-mineria/sites/ministerio-industria-energia-mineria/files/2026-09/venta%20de%20derivados%20de%20petroleo%20al%20mercado%20interno%20y%20zona%20franca.zip"*
  (`https://www.gub.uy/ministerio-industria-energia-mineria/datos-y-estadisticas/datos/series-estadisticas-petroleo-derivados`,
  leída en esta sesión)
- accion_sugerida: rehacer el `dato_real.valor` con los 60 meses (−2,0 %) y mandar al resolvedor la
  búsqueda del volumen. Ver la sección "Documentos previsibles" abajo, que vale para las seis
  afirmaciones: hay cuatro rutas y una descartada, todas verificadas en esta sesión.

### analisis[0].afirmaciones[1] — gas oil 2010-2014, sobreprecio de USD 1.181 millones
- severidad: **bloquea**
- tipo: documento_previsible (+ error de huecos)
- objecion: mismo error de cobertura. Con los 60 meses reales la brecha del gas oil 2010-2014 es
  **+19,2 %**, no +15,8 %. El registro subestima la brecha del período que atribuye al gobierno de
  Mujica; lo digo sin verbo de intención, es el efecto aritmético de haber descartado las filas con
  fecha en texto. Mismo `_faltante` mal cerrado.
- cita_de_contexto: la fila `2013-Ene` citada arriba, más `2014-Ago (4)` y las otras 54 filas que el
  parseo descartó, en la misma URL de URSEA.
- accion_sugerida: recalcular y, si se quiere una cita ancla, citar una fila de las descartadas
  (para que quede documentado que el archivo las tiene) además de las que ya están.

### analisis[0].afirmaciones[2] — nafta 2015-2019, sobreprecio de USD 443 millones
- severidad: **corregir**
- tipo: documento_previsible (+ error de huecos, acá con poco efecto numérico)
- objecion: mismo error de cobertura, aunque es la afirmación donde menos cambia el número:
  53 meses dan +8,6 % contra el +8,4 % que reporta el registro con 28. Lo que sí cambia es la frase
  *"casi la mitad de los meses del período no tiene fila en el archivo oficial"*, que es falsa: solo
  faltan los siete meses de junio a diciembre de 2019, y faltan porque el archivo termina ahí, no
  porque URSEA no los haya publicado. El `fragmento` (*"la nafta presentó un sobreprecio de US$ 443
  millones"*) está tomado de El Observador, no del CED, mientras que el de la afirmación 0 está
  tomado del CED: hay que unificar la fuente del `fragmento` (debería ser el análisis, o sea el
  boletín).
- cita_de_contexto: el índice de filas por año del volcado de URSEA: 2015 → 12 filas, 2016 → 12,
  2017 → 12, 2018 → 12, 2019 → 5.
- accion_sugerida: recalcular con 53 meses; unificar `fragmento` contra el PDF del CED; para cerrar
  2019-06 a 2019-12 y llegar hasta 2021, ver la sección de documentos previsibles.

### analisis[0].afirmaciones[3] — gas oil 2015-2019, sobreprecio de USD 1.337 millones (y el 1137)
- severidad: **corregir**
- tipo: documento_previsible (+ error de huecos)
- objecion: dos partes.
  (a) Cobertura: con 53 meses la brecha del gas oil es **+33,0 %**, no +26,5 %; y la comparación con
  el quinquenio anterior queda 33,0 % contra 19,2 %, no 26,5 % contra 15,8 %. Hay que rehacer las
  dos cifras a la vez, porque la oración las contrasta.
  (b) El 1137 contra el 1.337: **el criterio aplicado es correcto y ahora está mejor fundado que
  cuando se escribió el chequeo publicado.** Verifiqué la discrepancia en la copia del propio CED
  (`ced.uy/public/archivos/boletines/doc_13.pdf`), no solo en la de todoelcampo: la portada imprime
  "USD 1137 millones" y el cuerpo "USD 1.337 millones" en las dos copias, o sea que no es un
  artefacto del sitio que la republicó. Sigue sin poder descartarse que sea un artefacto de
  extracción de la infografía de portada en ambas copias (son el mismo archivo), así que la
  hipótesis de `notas.md` no queda cerrada, pero sí queda cerrado que no es culpa del espejo.
  Además hay un argumento de consistencia interna que ni el chequeo ni este registro usan y que
  refuerza la elección de 1.337: la suma de El Observador (2.883) solo cierra con 1.337
  (−78 + 1.181 + 443 + 1.337 = 2.883; con 1.137 daría 2.683), y el total 2015-2019 de 1.780 que
  el chequeo publicado usa también.
- cita_de_contexto: portada, en la copia del CED: *"nafta sobreprecio de USD 443 millones /
  consumidores uruguayos de gasoil pagaron USD 1137 millones más que PPI."*; cuerpo, misma copia:
  *"En el periodo 2015-2019, la nafta presentó un sobreprecio de USD 443 millones, mientras que los
  consumidores uruguayos de gas oil pagaron aprox. USD 1.337 millones más que la referencia de PPI."*
  (`https://ced.uy/public/archivos/boletines/doc_13.pdf`)
- accion_sugerida: recalcular las brechas; agregar el argumento de consistencia interna al
  `dato_real.valor`, que hoy justifica la elección solo por contigüidad y por lo que reprodujo El
  Observador (que es corroboración no independiente: lee el mismo PDF).

### analisis[0].afirmaciones[4] — "USD 40,5 millones anuales" en 2020-2021
- severidad: **bloquea**
- tipo: riesgo_legal (atribución) + asimetria
- objecion: tres problemas, y el primero solo se arregla reescribiendo el campo.
  (a) **Atribución.** El campo `afirmacion` empieza con *"Según el CED, entre 2020 y 2021 el
  sobreprecio combinado… promedió USD 40,5 millones anuales"*, y el `dato_real` del mismo bloque
  dice, correctamente, que *"El CED no escribe literalmente 'USD 40,5 millones anuales'"*. El campo
  que la página muestra como la afirmación del análisis le pone al CED un número que el CED no
  publicó. Se corrige con una línea: "El Observador calculó, a partir de las dos cifras del CED…".
  (b) **La comparación netea signos opuestos.** El CED aclara que 2020 y 2021 son sustancialmente
  distintos —en 2020 hubo sobreprecio en los dos combustibles y en 2021 se vendieron por debajo del
  PPI—, así que los USD 81 millones del bienio son un neto entre un año positivo y uno negativo,
  mientras que los USD 288 millones anuales de la década son un promedio de años del mismo signo. El
  `dato_real` cita la aclaración del CED pero ni la `afirmacion` ni el `resumen` la recogen, y es lo
  que decide si la comparación 40,5 contra 288 significa algo.
  (c) **Asimetría con el mismo documento.** El boletín del CED cuantifica 2021 con cifras que el
  registro no carga y que son del mismo orden que las que sí carga para los quinquenios anteriores:
  la renuncia de ANCAP por no ajustar según el PPI habría sido de USD 46 millones en nafta súper,
  USD 59 millones en gas oil y USD 93 millones en supergás, *"en suma, casi USD 200 millones"*, y
  ANCAP cerró 2021 con resultado primario corriente negativo de USD 44 millones. Puestas al lado del
  neto de 81 millones del bienio, implican que 2020 por sí solo estuvo en el orden de los ~186
  millones de sobreprecio (81 + 105 de nafta y gas oil de 2021) — una lectura aritmética de dos
  frases del propio CED, que el editor debería confirmar contra la serie del CED antes de escribirla,
  pero que muestra cuánto cambia el sentido de "40,5 millones anuales".
  El `--buscar` del investigador (en `consultas.jsonl`) incluye la frase `105 millones`: la cifra se
  vio y no se cargó.
- cita_de_contexto: *"La renuncia del ente estatal por no ajustar los combustibles en función del PPI
  habría sido de USD 46 millones para el caso de la nafta Súper, USD 59 millones para el caso del gas
  oil y USD 93 millones para el caso del supergás; en suma, casi USD 200 millones de dólares."* y
  *"ANCAP culminó con un resultado primario corriente negativo en USD 44 millones explicado en gran
  parte por la mantención de los precios de los combustibles"*
  (`https://ced.uy/public/archivos/boletines/doc_13.pdf`)
- accion_sugerida: reescribir la `afirmacion` atribuyéndola a El Observador; trasladar la aclaración
  del CED sobre 2020 vs 2021 a la `afirmacion` o al `analisis` de la afirmación; y agregar al menos
  una afirmación nueva con la renuncia de 2021 (105 millones nafta + gas oil, o 200 con supergás),
  que es la cifra del mismo análisis sobre el gobierno en ejercicio. Sin ella el registro tiene
  cuatro cifras cuantificadas sobre los gobiernos del Frente Amplio y dos cifras chicas sobre el de
  la coalición, tomadas del mismo documento que ofrece más.

### analisis[0].afirmaciones[5] — "USD 2.883 millones" en la década
- severidad: **aviso**
- tipo: sin_objecion sustantiva
- objecion: la afirmación está bien construida: dice explícitamente que la cifra es de El Observador
  y no del CED, muestra la cuenta, explicita el criterio (netear el subsidio de la nafta, sin
  ponderar por consumo) y dice que no hay documento oficial que mida ese agregado. Es el bloque
  mejor resuelto del lote. Dos detalles menores: la cita de El Observador que se usa termina con la
  errata del original (*"de referencia de Ursea acuerdo a las estimaciones del CED"*, falta "de"),
  lo cual está bien porque la cita es literal, pero conviene que el editor sepa que no es un error de
  transcripción nuestro; y el `dato_real.valor` de 200 palabras es largo para una celda.
- cita_de_contexto: *"Es decir, en la década de 2010, compartida por los presidentes Mujica y
  Vázquez, entre nafta y gasoil los consumidores habrían puesto de su bolsillo US$ 2.883 millones
  por encima de lo que cuesta el combustible refinado en mercados de referencia de Ursea acuerdo a
  las estimaciones del CED."* (`https://www.elobservador.com.uy/nota/...20223316150`)
- accion_sugerida: ninguna sustantiva. Condensar el `valor`.

### analisis[0].graficos[0] — precio de venta y PPI, 2010-2019
- severidad: **bloquea**
- tipo: presentacion
- objecion: el diseño es correcto y hay que decirlo: dos colores (uno por producto) y dos trazos
  (continuo el precio, punteado la paridad) es exactamente lo que pide la regla de presentación, y
  el investigador no cayó en las cuatro series de cuatro colores. Lo que está mal son los datos y las
  anotaciones:
  - faltan 2013 y 2014, que sí están en la planilla;
  - los ocho puntos de 2012, 2015, 2016, 2017 y 2018 están calculados sobre 5 a 8 meses cuando hay
    12, y hay que reemplazarlos por los promedios de la tabla de arriba;
  - las diez `nota` de punto del tipo *"5 de 12 meses observados"* son falsas; después de la
    corrección sobrevive una sola, la de 2019 (5 de 12: enero a mayo, y son 5, no 4 como dice hoy);
  - la `nota` del gráfico repite el error ("2013 y 2014 no tienen ninguna fila en el archivo") y hay
    que reescribirla;
  - el `metodo` del gráfico mete la URL cruda de la planilla en medio de la prosa y repite el error
    de huecos.
- cita_de_contexto: recuento de filas por año del volcado completo de la planilla: 2010-2018, 12
  filas cada año; 2019, 5.
- accion_sugerida: además de corregir los datos, **agregar un segundo gráfico de la brecha** (PE
  menos PPI, o PE/PPI − 1, por producto y por año). Lo que el análisis discute es la brecha, no el
  nivel; en el gráfico de niveles las cuatro curvas suben juntas por inflación y tipo de cambio y la
  brecha —que es el dato— queda como una distancia que el lector tiene que estimar a ojo. Con la
  serie de brechas se ve de un vistazo lo que el CED afirma: nafta cruzando el cero entre 2014 y
  2015, gas oil siempre positivo y ensanchándose en 2015-2017. El esquema admite hasta 3 gráficos.
  Y si se consigue la serie 2019-06 a 2021 (ver abajo), extender los dos gráficos hasta 2021, que es
  el período que el `titulo` promete.

---

## Documentos previsibles (esto es lo que decide si el lote se cierra)

El `_faltante: dato_oficial` de las seis afirmaciones no está bien cerrado. Verifiqué las rutas en
esta sesión:

**Para los volúmenes (lo que falta para el monto en dólares):**

1. **MIEM/DNE — "Venta de derivados de petróleo al mercado interno y zona franca"** (.zip, serie
   mensual nacional por producto), en
   `https://www.gub.uy/ministerio-industria-energia-mineria/datos-y-estadisticas/datos/series-estadisticas-petroleo-derivados`.
   Es el archivo exacto que hace falta y **no figura en `notas.md` ni en `consultas.jsonl`**: el
   investigador miró esa página y solo listó los dos archivos por departamento.
2. **MIEM/DNE — "Ventas de gasolinas por departamento" y "Ventas de gas oil por departamento"**
   (.zip mensuales, misma página). El motivo por el que se descartaron —*"reconstruir un total
   nacional por año a partir de datos departamentales excedía el alcance razonable de esta
   corrida"*— no es un motivo: sumar 19 columnas es aritmética. Sirven como control cruzado de (1).
3. **ANCAP — memorias anuales y estados contables auditados 2010-2021**, con volúmenes vendidos por
   producto. Es la misma serie de documentos sobre la que está construida la ficha de ANCAP.
4. **Obstáculo real de herramienta, y hay que decirlo:** `pnpm fuente` sobre esos .zip devuelve 0
   caracteres ("texto muy corto: paywall, JS o extractor fallido"). Lo probé. O se extiende `fuente`
   para abrir un .zip y extraer el xlsx/csv de adentro, o el resolvedor consigue el mismo dato en
   otro formato. Esto es una tarea de infraestructura, no una excusa para dejar el `_faltante`.
5. **Descartado, para que nadie pierda el tiempo:** el dataset de datos abiertos
   `ancap-cantidad-ventas-combustibles` (ANCAP, miles de m³ por producto) **empieza en 2022-01**
   (`temporal_coverage: "2022-01 - 2026-07"`). No sirve para ninguno de los períodos del CED. Lo
   mismo `ancap-precio-combustible-pe` y `ancap-precio-combustible-ex-planta`, los dos 2022-01 en
   adelante. Y `miem-consumo-final-energetico-por-fuente` (1965-2025) agrega por fuente energética,
   no por producto: no separa nafta de gas oil.

**Para extender la serie de precios más allá de 2019-05 (necesario para el tramo 2020-2021):**

6. **URSEA — dataset `ursea-ppi_vs_pe_v2` en catalogodatos.gub.uy**, que el chequeo publicado ya
   cita y este lote no usó. Su descripción declara tres modelos: el primero *"corresponde al período
   2002-01 - 2020-09"*, el segundo cubre *"2020-10 - 2021-10"* y el tercero *"2021-11 en adelante"*.
   Advertencia verificada: los recursos que hoy se descargan bajo el nombre `ppi_pe.csv` y
   `ppi_pe.xlsx` **arrancan en 2020-10**, no en 2002 (busqué "2013-06", "2014-06", "2019-08" y
   "2002-01" en los dos y no hay coincidencias); la descripción del dataset y el contenido de los
   recursos no coinciden. Aun así, entre esos recursos y la planilla de la página de URSEA se cubre
   2002-01 → 2019-05 y 2020-10 → hoy, y queda un solo hueco real, **2019-06 a 2020-09**, para el que
   corresponde pedirle a URSEA/AGESIC el recurso del primer modelo o buscar una versión anterior del
   recurso en Wayback.
7. Para el precio de venta de 2020-2021, si el recurso de URSEA no lo trae: los **decretos del Poder
   Ejecutivo** que fijan los precios máximos (IMPO, que ya es un medio del sitio) y el archivo del
   MIEM "Precios medios de derivados de petróleo con y sin impuestos".

**Qué calificación permite hoy la regla del Veracímetro** (para que el editor decida con esto
enfrente):

- Afirmaciones 0 a 3 (los cuatro montos del CED): **`discutible`, y no hay alternativa**. `verdadero`
  y `falso` exigen documento oficial que confirme o refute, y ningún organismo publica el agregado
  en dólares de la brecha. `impreciso` tampoco está disponible: exige medir un desvío de hasta 10 %
  contra una cifra oficial, y no hay cifra oficial contra la cual medirlo. La dirección y el orden
  de magnitud relativo sí están confirmados con documento oficial (la planilla de URSEA), y eso hay
  que decirlo en el `dato_real` —ahora con los 60 y 53 meses reales—, pero confirmar el signo no
  confirma el monto. Lo que **no** corresponde es escribir `discutible` con el motivo "la planilla
  tiene huecos": el motivo correcto es "no existe documento oficial que agregue la brecha en
  dólares", y eso es lo que el resolvedor tiene que atacar con los volúmenes.
- Afirmación 4: hoy no es calificable, porque el campo `afirmacion` atribuye mal. Una vez reescrita
  como cálculo de El Observador, la aritmética (14 + 67) / 2 = 40,5 se verifica contra el texto del
  CED, pero el CED es una fuente `nota`, no `documento_oficial`: **`discutible`**.
- Afirmación 5: **`discutible`** por lo mismo. La cuenta cierra; no hay documento oficial que mida
  ese agregado.
- Aviso al editor para cuando aparezcan los volúmenes: reconstruir el monto en dólares nosotros no
  convierte automáticamente un `discutible` en `verdadero`. Sería una `inferencia` con supuestos que
  el CED no publica (tipo de cambio mensual o promedio, precio con o sin impuestos, qué grado de
  nafta, ponderación mensual o anual). Lo honesto sería `impreciso` si nuestra reconstrucción cae
  dentro del 10 % de la cifra del CED, y `discutible` si los supuestos mueven el resultado más que
  eso; en los dos casos el `dato_real` mejora muchísimo y el lector gana.

---

## Explicaciones alternativas (que el registro debería recoger)

1. **La brecha 2015-2019 tiene una explicación mecánica que da el propio CED**, y el registro no la
   trae: precios fijos mientras el petróleo bajaba. *"en el gráfico también se observa como el
   abultado resultado primario corriente de ANCAP en el período 2016-2017 estuvo explicado por el
   sobreprecio pagado por los consumidores uruguayos cuando los precios se mantenían fijos y el
   petróleo bajaba considerablemente."* (`https://ced.uy/public/archivos/boletines/doc_13.pdf`). Es
   la lectura menos acusatoria de la cifra más grande del análisis y viene del autor del análisis.
2. **La misma nota que publica el cálculo ofrece la contralectura del sobreprecio 2015-2019 como
   recomposición de pérdidas previas**, y el registro tampoco la trae: *"Solo entre 2011 y 2015 la
   empresa monopólica perdió US$ 665 millones. La situación provocó que en enero de 2016 el
   Parlamento aprobara una capitalización por US$ 622 millones aportados por el MEF, más un préstamo
   por US$ 250 millones del Banco de Desarrollo de América Latina (CAF). Los sobrecostos del
   quinquenio siguiente son tomados por algunos como la compensación que necesitó la empresa para
   solventar sus déficit anteriores."*, y Oddone: *"'la caja' que hizo Ancap en la década pasada
   respondió a 'pagar una factura de una fiesta que había tenido lugar en el período anterior'"*
   (`https://www.elobservador.com.uy/nota/...20223316150`).
3. **El contraargumento simétrico para 2020-2021 está en la misma nota** y también falta: *"siempre
   se puede bajar los combustibles mientras la petrolera estatal sea la que quede con números rojos,
   que en definitiva acaban financiando todos los contribuyentes"*, y *"Entre 2020 y 2021, el ente
   monopólico acumuló un balance negativo en US$ 56 millones."* Si se carga la explicación (2) para
   el tramo del Frente Amplio hay que cargar la (3) para el tramo de la coalición, y viceversa. Ese
   es el criterio simétrico.
4. **El análisis del CED nace dentro de una polémica**, y el registro lo presenta como un cálculo
   suelto. La nota lo dice: el boletín responde a un informe de Vallcorba y Zelko, asesores de la
   bancada del Frente Amplio, y el director del CED había criticado ese informe días antes. No es un
   descrédito del cálculo; es el contexto de publicación, y es un dato con fuente.

---

## Objeciones al lote

- **Simetría del recorte de cifras.** Del mismo boletín, el lote cargó las cuatro cifras que
  cuantifican los quinquenios de gobiernos del Frente Amplio y las dos cifras chicas del bienio de
  la coalición, y dejó afuera la renuncia de ANCAP de 2021 (46 + 59 + 93 ≈ 200 millones; 105 sin
  supergás), el resultado primario corriente negativo de 44 millones de 2021, la conclusión del CED
  sobre la LUC y la afirmación de competitividad (*"Uruguay tiene un nivel de precios de los
  combustibles estructuralmente más caro que la región y la mayor parte del mundo"*). Las cuatro
  omitidas son sobre el gobierno en ejercicio o transversales. No estoy afirmando intención: estoy
  afirmando que el criterio "una afirmación por cada cifra concreta del análisis" se aplicó a una
  parte del documento y no a la otra, y que corregirlo es cargar las que faltan. Regla 0.
- **Simetría del gráfico.** El único gráfico va de 2010 a 2019 en un registro titulado "2010-2021".
  Muestra visualmente el tramo de los gobiernos del Frente Amplio y no el del gobierno de la
  coalición. El motivo declarado (la planilla termina en 2019-05) es real pero ya no es
  insuperable: el dataset `ursea-ppi_vs_pe_v2` cubre 2020-10 en adelante y queda un hueco de 15
  meses. Si al cierre el hueco sigue abierto, el `titulo` y la `nota` del gráfico tienen que decir
  con todas las letras que el tramo 2020-2021 no está graficado y por qué, en vez de dejar que el
  lector lea un gráfico que termina justo donde cambia el gobierno.
- **Dependencia de fuentes.** No aplica la regla de dos grupos (`analisis` no tiene
  `evidencia.nivel`), pero conviene registrar el mapa: la cobertura de prensa del análisis es de un
  solo medio y un solo grupo (El Observador, grupo `werthein-hochbaum`), el análisis es de un solo
  autor (`ced`, grupo `ced`) y el respaldo oficial es de un solo organismo (URSEA, grupo
  `estado-uruguayo`). Es lo esperable para este tipo de registro, y por eso importa más que el
  `autor_es` esté bien hecho: es la única señal que el lector tiene sobre quién produjo la cifra.
- **Copia de tercero como fuente del autor.** El boletín se cita con `medio: ced` pero en una URL de
  `todoelcampo.com.uy`, que no es un medio registrado en `content/medios/`. Ahora existe la URL del
  propio CED, verificada en esta sesión.
- **`notas.md` hay que corregirlo también**, no solo el YAML: el `## metodo` documenta paso a paso
  un procedimiento cuyo paso 5 introduce el error (contar solo las filas con fecha ISO), y ese
  archivo es lo que quedará como rastro reproducible de la corrida.
- **Sobre el chequeo publicado `lacalle-pou/2022-03-27-sobrecostos-combustibles-1700-millones`**
  (no toco `content/`; lo dejo listado para el editor, y son tres correcciones separadas):
  1. `cotejo_con_primaria`: agregar la URL del boletín en el sitio del propio CED
     (`https://ced.uy/public/archivos/boletines/doc_13.pdf`) junto a la copia de todoelcampo, y
     dejar constancia de que la discrepancia 1137/1.337 se verificó en la copia del autor.
  2. `presentacion`: `revision.notas_internas` dice *"sin que esta corrida haya verificado a qué
     combustible corresponde cada cifra (no se confirmó el orden 'nafta, gasoil' contra el
     original)"*. **Queda confirmado**: el cuerpo del boletín, en las dos copias, dice
     *"se registraron sobreprecios en la nafta por USD 14 millones y el gas oil por USD 67
     millones"*, contiguo y explícito. Nafta = 14, gas oil = 67.
  3. Advertencia sobre esa misma corrección: si se aprovecha para llevar 2020-2021 al gráfico de
     barras, hay que llevar también la renuncia de 2021 (105 millones en nafta y gas oil). Poner
     barras de 443 y 1.337 al lado de barras de 14 y 67 sin ese tercer dato produce un gráfico que
     el propio documento fuente no respalda. Si no se puede poner las tres cosas, mejor dejar el
     gráfico como está.
- **Sobre la ficha `content/empresas/ancap.yaml`** (también para el editor): `precios_vs_paridad.series`
  está vacío. Con la planilla de URSEA ahora legible por `pnpm fuente` (2002-01 a 2019-05, mensual,
  sin huecos) y el dataset `ursea-ppi_vs_pe_v2` para 2020-10 en adelante, el regulador sí publica la
  serie y la ficha puede tener su gráfico de precio contra paridad. Es una corrección de
  `presentacion` sobre la ficha, aparte de esta corrida.

## Objeciones al brief

- **El brief no viola la Regla 0 en su encargo** —dice explícitamente "se verifica lo que dice, no a
  quién favorece"— pero **su alcance produce un resultado asimétrico**, y eso hay que decirlo:
  1. Pide reconstruir la brecha *"para 2010-2019"* y el gráfico *"para 2010-2019"*, cuando el
     análisis que se está verificando llega a 2021. Un recorte de años que termina justo en el
     cambio de gobierno no puede ser el alcance por defecto, aunque el motivo sea la disponibilidad
     del archivo. **Versión simétrica:** pedir la reconstrucción de todo el período que cubre el
     análisis, y si un tramo no se puede reconstruir, que el registro lo diga en el mismo lugar
     donde muestra los tramos que sí reconstruyó.
  2. Pide una afirmación por cada cifra *"que la nota atribuya al CED"*, es decir, define el
     universo de cifras por lo que eligió publicar un medio. En cuanto el investigador (bien) fue al
     boletín, el universo pasó a ser el boletín, y ahí hay cifras sobre el gobierno en ejercicio que
     El Observador no destacó. **Versión simétrica:** una afirmación por cada cifra concreta del
     documento del autor, no de la nota que lo cubrió.
  3. Da por sentado el sujeto de `autor_es` ("la ficha de ANCAP y el chequeo publicado ya registran
     uno con fuente; usalo"), y ese vínculo registrado es el de Lacalle Pou. Reutilizarlo sin pedir
     que se busquen los vínculos documentados en las dos direcciones reproduce la selección.
     **Versión simétrica:** pedir todos los vínculos institucionales documentados que el autor
     publica de sí mismo, con fecha, y dejar que el lector los lea juntos.
- Punto menor de coherencia: el brief pide `fecha` = fecha de la nota (2022-03-07), y el esquema
  define `fecha` como "fecha de publicación del análisis" (2022-03-03). Gana el esquema.
- Punto a favor del brief: pedir el gráfico con "color por producto, trazo continuo el precio y
  punteado la paridad" fue correcto y el investigador lo cumplió. Es la especificación que evita el
  gráfico de cuatro colores.

## Discrepancias

**No se escribe `discrepancias.yaml` en esta corrida, y el motivo importa.** Hay dos candidatas y
ninguna pasa el umbral:

1. El Observador publica *"los consumidores habrían puesto de su bolsillo US$ 2.883 millones… de
   acuerdo a las estimaciones del CED"*, y esa suma no está en el boletín del CED: la hizo el medio.
   Sería `atribucion_incorrecta`.
2. El Observador publica *"entre 2020 y 2021 ese número disminuyó a US$ 40,5 millones anuales"*
   presentándolo como contraste con el promedio de la década, cuando el CED aclara en la oración
   siguiente a sus dos cifras que 2020 y 2021 tienen signos opuestos. Sería `contexto_omitido`.

Las dos fallan por la primera regla dura: la fuente primaria que decidiría es un PDF de un centro de
estudios privado, que no es `documento_oficial`, ni `diario_de_sesiones`, ni `video`. Sin ese
documento, esto es un desacuerdo entre un medio y su fuente, no una discrepancia, y va acá y no a
`content/discrepancias/`. Lo dejo anotado para que si alguien más tarde levanta el caso no lo
registre por la vía equivocada. En sentido contrario, El Observador sí marca la derivación como
propia en el segundo caso (*"según se deduce de los números publicados por el think tank"*), lo que
debilita bastante la candidata 2 incluso como desacuerdo.

## Cobertura

Criterio aplicado: se emite un registro por pieza publicada y por sujeto, y solo se marca
`favorable`/`desfavorable` cuando puedo citar una frase **en la voz de la pieza**, no de un tercero
al que la pieza cita ni del titular. Con ese criterio, las dos piezas de este lote resultan
desfavorables a los dos lados, y eso es lo que corresponde registrar.

```yaml
- medio: el-observador
  url: https://www.elobservador.com.uy/nota/el-precio-de-la-nafta-y-el-gasoil-que-muestran-los-numeros-de-este-gobierno-y-el-fa--20223316150
  fecha: 2022-03-07
  evento: mecanismo-precios-combustibles-luc
  partido: frente-amplio
  tono: desfavorable
  justificacion: >-
    En su propia voz, y no citando a un tercero, la nota afirma un hecho adverso a los gobiernos del
    FA y refuta el método de sus economistas: "Aunque no se refleje en los promedios, en el
    transcurso de los gobiernos frenteamplistas hubo varios años en que los precios al público no
    mostraron rebajas en insumos clave como el Brent —particularmente en el segundo de Tabaré
    Vázquez—."

- medio: el-observador
  url: https://www.elobservador.com.uy/nota/el-precio-de-la-nafta-y-el-gasoil-que-muestran-los-numeros-de-este-gobierno-y-el-fa--20223316150
  fecha: 2022-03-07
  evento: mecanismo-precios-combustibles-luc
  politico: lacalle-pou
  tono: desfavorable
  justificacion: >-
    La misma nota, también en su propia voz y bajo el intertítulo "Discrecionalidad", describe al
    oficialismo apartándose de la regla que creó: "Desde filas del oficialismo se apela a los buenos
    resultados de Ancap y a la 'espalda' financiera del ente para desobedecer los aumentos indicados
    por el PPI."

- medio: ced
  url: https://ced.uy/public/archivos/boletines/doc_13.pdf
  fecha: 2022-03-03
  evento: mecanismo-precios-combustibles-luc
  partido: frente-amplio
  tono: desfavorable
  justificacion: >-
    El boletín cuantifica como sobreprecio pagado por los consumidores los dos quinquenios de
    gobierno del FA: "En el periodo 2015-2019, la nafta presentó un sobreprecio de USD 443 millones,
    mientras que los consumidores uruguayos de gas oil pagaron aprox. USD 1.337 millones más que la
    referencia de PPI."

- medio: ced
  url: https://ced.uy/public/archivos/boletines/doc_13.pdf
  fecha: 2022-03-03
  evento: mecanismo-precios-combustibles-luc
  politico: lacalle-pou
  tono: desfavorable
  justificacion: >-
    El mismo boletín concluye sobre el gobierno en ejercicio: "los artículos referentes a este tema
    de la LUC, votados por todo el sistema político, no parece haber generado ningún cambio
    relevante en la política de fijación de precios. También parece claro que su espíritu (precios
    que rápidamente reflejen las variaciones de los costos) está siendo dejado atrás por el
    gobierno."
```

Nota sobre el alcance: la copia del boletín alojada en `todoelcampo.com.uy`, que es la que usa el
lote, es el mismo documento (lo verifiqué frase por frase en los dos archivos) y no genera un
registro de cobertura aparte. Las demás fuentes que leí en esta sesión (planilla de URSEA, páginas
de catalogodatos, página del MIEM, `ced.uy/quienes_somos.php`) son documentos y páginas
institucionales, no cobertura de prensa, y no llevan registro de tono.
