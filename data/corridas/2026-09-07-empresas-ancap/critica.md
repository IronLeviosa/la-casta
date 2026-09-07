# Crítica — corrida 2026-09-07-empresas-ancap

Modelo: claude-opus-5 (1M de contexto). `CLAUDE.md` asigna Opus al rol de crítico y el mantenedor confirmó
Opus para esta corrida: no hay diferencia entre lo declarado y lo que corrió, el experimento de modelos no
afecta a este lote. El investigador declara `claude-sonnet-5`, que es lo que la tabla asigna a su rol.
Lote: `inbox/empresas/ancap/2026-09-07/`
Registros revisados: 1 (una ficha `empresas`, primera de la colección), abierta por bloques: creación,
`que_hace`, `monopolio` (alcance, 6 normas, 4 argumentos a favor, 3 en contra), `finanzas` (10 años × hasta 4
montos), `precios_vs_paridad`, 10 `comparaciones` y fuentes generales.

Abrí en esta sesión, con `pnpm fuente`, todas las fuentes del lote salvo `uruguay.justia.com` (que no valida) y
la de Wikipedia: los Estados Financieros Individuales de 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023 y
2024, la Ley 8.764 en IMPO, la página de composición de precio de ANCAP, el comunicado de Resultados 2024, la
diaria, El Observador (las dos notas), Subrayado (las dos), Montevideo Portal y Ámbito (las dos). Además abrí
tres fuentes que el lote **no** usa y que cambian conclusiones: El País del 17/10/2020 (Stipanicic y Fancap), El
País del 02/04/2025 (balance 2024) y el tramo completo de la Nota 30 de los estados de 2021.

**Estado mecánico.** `pnpm validar --inbox inbox/empresas/ancap/2026-09-07` da **2 errores de referencias**
(`medio: justia` no existe en `content/medios/`), en `monopolio.normas[1].fuentes[1]` y
`monopolio.argumentos_en_contra[2].fuentes[0]`. El esquema pasa (0 errores). Como la etapa 2 falla, `pnpm
validar:red` no llega a la etapa 5: **a hoy ninguna cita de este lote está verificada por máquina**. Verifiqué a
mano todas las que cito abajo y son literales; el editor no debe leer "el lote está validado".

---

## Resumen de lo que bloquea

Tres cosas, y la primera es la que el lector va a mirar.

1. **El resultado de 2020 que la ficha va a publicar es el que la propia ANCAP dejó sin efecto.** Los Estados
   Financieros Individuales de 2021 traen el ejercicio 2020 en tres columnas: `Original (510.662.282)`,
   `Ajustes 895.776.155`, `Modificado 385.113.873`. La ficha publica la columna "Original" como el resultado del
   año y explica la reformulación dentro de `concepto`, que es el campo de "qué es exactamente este monto", no
   el de la nota del año. Un gráfico de la ficha saldría con 2020 en rojo. Y como el chequeo publicado sobre
   Orsi califica "falso" apoyándose en que 2020 fue negativo, el sitio quedaría diciendo dos cosas distintas
   sobre el mismo ejercicio en dos páginas. Ver la sección **(c) La reexpresión de 2020**, que es larga a
   propósito.
2. **"Desde 2023 tampoco en los aeropuertos" no tiene fuente, y la única nota citada dice lo contrario.** La
   ficha afirma, sobre el alcance vigente de un monopolio legal, que desde 2023 no rige en los aeropuertos. La
   nota de El Observador (09/10/2020) que respalda ese ítem dice: *"en la discusión parlamentaria algunos
   legisladores de la coalición decidieron ampliarlo a los aeropuertos pero no tuvo el respaldo ni de Batllistas
   ni de Cabildo Abierto ni tampoco del Partido Independiente"*. `notas.md` ya lo admite; el texto de la ficha no.
3. **Las cuatro comparaciones de precio al público le atribuyen a ANCAP el precio del surtidor.** `valor_propio`
   es, por esquema, "el valor de esta empresa". USD 1,998 por litro de nafta no es un valor de ANCAP: la propia
   ANCAP publica que *"El PEP sin impuestos es el ingreso neto que percibe ANCAP por sus ventas"* y que sobre él
   se agregan márgenes de la cadena fijados por URSEA más *"tasa URSEA, tasa inflamable (IMM), fidecomiso del
   boleto, FUDAEE, IMESI, IVA"*. En una ficha cuyo sujeto es la empresa, eso es una atribución incorrecta.

Y una cuarta que no bloquea pero es la objeción de Regla 0 del lote: **la asimetría de los argumentos no es un
límite de lo publicado**. Ver **(a)**.

---

## (a) Regla 0 en una ficha sobre una empresa con monopolio

El investigador declara en `notas.md`: *"No conseguí una declaración en primera persona, con nombre y apellido,
de alguien defendiendo el monopolio con la misma nitidez que la cita de Lacalle Pou en contra"*, y lo atribuye a
disponibilidad de fuentes, no a esfuerzo. **Eso no se sostiene.** Tres hallazgos, todos en material que estaba
al alcance de esta corrida:

- **El País, 17/10/2020, "Presidente de Ancap y los trabajadores debatieron sobre el futuro de la empresa"**
  (`https://www.elpais.com.uy/negocios/presidente-de-ancap-y-los-trabajadores-debatieron-sobre-el-futuro-de-la-empresa`).
  Estaba **en el corpus desde el 05/09/2026, antes de esta corrida**. Trae al presidente de Fancap, con nombre y
  cargo, sosteniendo el argumento en primera persona: *"Rodríguez habló sobre el marco ideológico 'que defiende
  a las empresas públicas como un factor fundamental de transformación social, respaldo y escudo de los más
  necesitados', pero señaló que la discusión de la ley de urgente consideración 'marcó algunas divergencias en
  la coalición de gobierno' en esa 'concepción ideológica' y dijo estar preocupado por la posibilidad de que
  Ancap 'pierda su esencia', el monopolio."* El investigador corrió `pnpm corpus:buscar "Fancap sindicato
  ANCAP"` (16 resultados, entrada 11 de `consultas.jsonl`) y **no abrió ninguno**; para el lado "en contra"
  hizo búsqueda web dirigida hasta encontrar y abrir la cita de Lacalle Pou (entradas 55 y 58). Esa es la
  asimetría de esfuerzo, medible en el propio `consultas.jsonl`.
- **la diaria, 24/11/2021 — la nota que el lote ya cita dos veces.** En su tercer párrafo: *"'siempre conviene
  refinar y no importar', retrucó el frenteamplista, expresidente de la empresa estatal"* (Daniel Martínez, en
  la Expo Prado 2019, frente a Lacalle Pou). Es una voz en primera persona, de un político que el sitio ya
  tiene ficha (`content/politicos/daniel-martinez.yaml`), en la misma nota de la que se sacaron los dos
  argumentos anónimos. Al final, la misma nota enlaza *"Las opiniones de Gerardo Rodríguez, de Federación
  Ancap, y del diputado del PN Juan Martín Rodríguez"*: un par simétrico, publicado, sin abrir.
- **El informe del comité de asesores del MIEM (LUC art. 237)**, que el brief pedía expresamente. Existe y la
  diaria lo describe: *"se conformó un comité de asesores en la órbita del Ministerio de Industria, Energía y
  Minería (MIEM) que sobre principios de 2021 entregó a la Asamblea General un informe en el que recomendó un
  conjunto de medidas"*. El único intento fue un `corpus:buscar` que dio cero (entrada 9); no hubo búsqueda web
  ni en `parlamento.gub.uy`. Es el documento que trae los dos lados escritos por expertos y es la pieza que más
  barato cierra la asimetría.

**Sobre la formulación.** Los dos argumentos que vienen de la diaria (uno de cada lado) son genuinamente
simétricos: misma nota, misma oración, mismo grado de anonimato, sin adjetivos. Bien hecho. Los otros no:

- `argumentos_en_contra[0]` (Lacalle Pou) dice en su `texto` que la libre importación *"es la medida más liberal
  que impulsó"*. **Eso no está en la nota.** La nota dice *"fue una bandera —a esta altura— bastante en
  solitario. Fue una unipersonal casi"*. "La más liberal" es un superlativo del sitio sobre una medida, exactamente
  lo que el esquema prohíbe ("resumida sin adjetivos"). También "No hay que temerle a terminar con el monopolio"
  es una reconstrucción: lo que dijo fue *"No, no hay monopolio en nada. Porque si cada uno protege la suya, somos
  una multiplicación de monopolios"*.
- `argumentos_a_favor[2]` y `[3]` **no son argumentos**. El [2] es el resultado de una votación (nadie sostiene
  una idea ahí) y el [3] es *"El Partido Colorado y Cabildo Abierto fueron los socios de la coalición que
  plantearon reparos"* — que dice quién objetó, no qué argumentó. Además "plantearon reparos" se convirtió en
  "se opusieron", y la misma oración de Subrayado sigue: *"también rechazado por el Frente Amplio"*, que si se
  cuenta como argumento a favor tendría que estar. Con eso, el conteo real es **1 argumento a favor con
  sostenedor identificado (ANCAP, institucional) contra 2 en contra con sostenedor identificado (Lacalle Pou en
  primera persona; el gobierno de Batlle vía la ley 17.448)**. El 4 a 3 del informe es aparente.
- **La cita de ANCAP se corta justo antes de su propia objeción al PPI.** El párrafo, en
  `ancap.com.uy/2147/6/`, empieza: *"Qué el ingreso por ventas de los combustibles sea superior o inferior a la
  paridad de importación, no dice nada sobre el valor agregado al refinar petróleo. Refinar petróleo crea
  valor, cuando..."*. La ficha cita desde "Refinar petróleo crea valor" y deja fuera la primera oración, que es
  justamente la que discute la vara con la que se miden seis de las diez `comparaciones`. **El mismo corte se
  repite** en `comparaciones[5]`: el comunicado de Resultados 2024 sigue, después de la frase citada, con
  *"Sumado a lo anterior, las importaciones reales de derivados por Muelle La Teja superaron en costo al cálculo
  teórico PPI URSEA"*. Dos veces el corte cae donde ANCAP cuestiona el PPI. No digo por qué; digo que pasa dos
  veces y que en las dos hay que restituir la oración.

**Corrección simétrica que propongo:** el mismo criterio para los dos lados — cada argumento con un sostenedor
identificable y sus palabras. A favor: Fancap (Rodríguez, El País 17/10/2020), Daniel Martínez (la diaria),
ANCAP con el párrafo completo. En contra: Lacalle Pou sin el superlativo, el gobierno de Batlle, la formulación
de la diaria. Y el informe del comité de asesores del MIEM para los dos lados.

---

## (b) Los números contra los documentos

Verifiqué renglón por renglón. **La aritmética de fondo está bien y el trabajo documental es sólido**: los diez
resultados del ejercicio son literales y coinciden con la columna comparativa del año siguiente en todos los
casos; los tipos de cambio de cierre son los correctos (29,95 / 29,34 / 28,81 / 32,41 / 37,31 / 42,340 / 44,695
/ 40,071 / 39,022 / 44,066); las sumas de deuda (corriente + no corriente) cierran exactas en los diez años; y
`transferencias`/`capitalizaciones` omitidas **son "no hubo", no "no se buscó"**: lo verifiqué en los propios
documentos (`"Durante los ejercicios 2016 y 2015 no se realizaron versiones de fondos a rentas generales"`,
`"32.6 Durante los ejercicios 2018 y 2017 no se realizaron versiones de fondos a rentas generales"`) y el flujo
de efectivo de 2020 confirma que el millar de millones es de 2020 y no del comparativo (`"Versión a Rentas
generales (1.000.000.000) -"`). Eso está bien y hay que decirlo.

Lo que no está bien:

- **`transferencias_al_estado` mide una cosa y el lector va a leer otra.** La ficha va a mostrar que ANCAP le
  pasó al Estado USD 23,6 M (2020), 11,8 M (2023) y 24,8 M (2024), y nada los otros siete años. En la **misma
  nota de los mismos estados**, dos renglones más arriba de la frase que el investigador citó, está el cuadro
  "Impuestos pagos y montos recaudados como agente de retención" con la línea `Total impuestos`: **17.963.260.814
  (2015), 19.767.669.858 (2016), 20.974.914.980 (2017), 26.871.322.829 (2018)** — del orden de USD 600 a 830
  millones por año. Y el comunicado de Resultados 2024 de ANCAP dice: *"USD 863 millones correspondientes a
  Descuentos por IMESI, Impuesto al CO2, Cadena GLP y Fideicomisos"*. No pido sumar nada ni inventar un
  agregado: pido que `concepto` diga qué mide y qué no, y que el `nota` del año traiga la línea `Total
  impuestos` con su cita. Publicar "USD 23,6 millones" a secas, para el dueño de la empresa, es la cifra
  equivocada del hecho correcto.
- **`deuda_financiera`: qué incluye.** La Nota 23 de los estados de 2016 desagrega los $ 14.058.536.515 así:
  *"Préstamos bancarios 4.077.205.907 1.141.768.682 1.403.337.364 6.622.311.953 ... Préstamos de partes
  relacionadas (*) (Nota 30) - 1.333.684.852 6.001.581.834 7.335.266.686"*. Más de la mitad no es deuda
  bancaria. La ficha publica un solo número con `concepto: "pasivo corriente + no corriente"`, que dice dónde
  está en el balance pero no qué es.
- **La caída de la deuda 2015→2016 es, en su mayor parte, la capitalización que la ficha registra al lado sin
  unirlas.** El cuadro de moneda extranjera al 31/12/2015 muestra que dentro de "Deudas financieras" había UI
  5.383.990.180 (no corriente) + UI 434.072.054 (corriente), es decir prácticamente toda la deuda con el MEF que
  se extinguió el 2/2/2016 (el contrato fue por UI 5.840.159.519). La ficha muestra deuda de USD 1.240 M en
  2015 y USD 479 M en 2016, y una capitalización de USD 642,7 M en 2016, sin decir que son el mismo hecho. Un
  lector va a leer una mejora de gestión.
- **La conversión de la capitalización de 2016.** La operación es del 2 de febrero de 2016 y está convertida al
  cierre de diciembre de 2016 (29,34), que es el tipo de cambio más favorable del rango plausible y da USD
  642,7 M. La única cifra publicada de esa operación que encontré es de El Observador: *"en enero de 2016 el
  Parlamento aprobara una capitalización por US$ 622 millones aportados por el MEF, más un préstamo por US$ 250
  millones del Banco de Desarrollo de América Latina (CAF)"*. Publicar UI y pesos como los da el documento, y si
  se convierte, declarar a qué fecha. El préstamo de la CAF, además, es parte del mismo paquete y no está.
- **La nota del error de IRAE está pegada al campo equivocado.** En 2018 y 2019 la advertencia sobre la Nota 30
  cuelga de `deuda_financiera`, que es el único monto que el error **no** afecta; el que afecta es
  `resultado_ejercicio`. La misma Nota 30 muestra que el patrimonio al 31/12/2020 quedó $ 1.506.088.344 por
  encima del original, de los cuales $ 895.776.155 corresponden al resultado 2020; el resto viene de las
  liquidaciones de 2018 y 2019, que nunca se reemitieron. Mover la nota a `Anio.nota` de 2018, 2019 y 2020.
- **Precisión falsa en los dólares.** Las conversiones tienen desvíos de hasta ~1.500 dólares respecto de la
  división exacta (2018: 88.070.742 publicado contra 88.069.206 calculado; 2015: 198.461.448 contra 198.464.555;
  2021: 88.071.939 contra 88.072.505). Son irrelevantes en magnitud y **no cambian ninguna conclusión**, pero
  publicar al dólar una cifra que el sitio calculó promete una exactitud que no tiene. Redondear a 0,1 millón.
- **Un número que el lector ya vio y no va a encontrar.** En abril de 2025 circuló *"una deuda total de 255
  millones de dólares"* (está en el título de Subrayado citado en el chequeo publicado). La ficha va a decir USD
  232,2 M para 2024. La diferencia probablemente sea individuales contra grupo; hay que decirlo en una nota, o
  el lector va a pensar que uno de los dos miente.

---

## (c) La reexpresión de 2020 — qué publicar y qué hacer con el chequeo

**Lo que dicen los documentos, sin interpretación.** Los Estados Financieros Individuales al 31/12/2021, Nota
30.2, presentan el estado de resultados de 2020 en tres columnas:

```
Resultado antes de impuesto a la renta   (277.690.029)        -        (277.690.029)
Gasto por impuesto a la renta            (232.972.253)  895.776.155     662.803.902
Resultado del ejercicio                  (510.662.282)  895.776.155     385.113.873
```

y la nota (a): *"Corresponde al impacto detectado por ANCAP en el ejercicio finalizado el 31 de diciembre de
2021, en un error en el cálculo del impuesto a la renta contabilizado el 31 de diciembre de 2020 y en los
impuestos liquidados correspondientes a los ejercicios finalizados el 31 de diciembre de 2019 y 2018."* El
resultado **antes de impuestos** de 2020 fue negativo y sigue siendo negativo después del ajuste: todo el giro
está en la línea de impuesto a la renta.

**Qué cifra corresponde publicar en la ficha: las dos, con la reexpresada como la cifra del año.** No es una
componenda: es lo que dice el emisor. La NIC 8 no ofrece dos lecturas válidas — corregido el error, la cifra que
representa el ejercicio 2020 es $ 385.113.873, y los estados de 2020 tal como se emitieron son la versión
superada. Concretamente:

- `finanzas[2020].resultado_ejercicio` = **+385.113.873** (USD 9,1 M al cierre 42,340), con las dos fuentes que
  ya están.
- `finanzas[2020].nota` (el campo existe y está sin usar): la cifra original `(510.662.282)`, el ajuste
  `895.776.155`, que el motivo es un error en el cálculo del IRAE corregido por NIC 8 en los estados de 2021, y
  que el **resultado antes de impuestos de 2020 fue negativo en $ 277.690.029 en las dos versiones**. Ese último
  dato es el que le permite al lector entender por qué durante cuatro años todo el mundo dijo "2020 dio
  pérdida".
- Lo que **no** corresponde es lo que hay hoy: la cifra superada como el número del año, con la explicación
  metida en `concepto` (que es el campo de "qué es este monto") mientras `nota` queda vacío.

**El chequeo publicado necesita corrección, y no es cosmética.** `content/chequeos/orsi/2025-04-25-ancap-volvio-negativos-diez-anos-2025.yaml`
califica **falso** la frase de Orsi *"volvemos después de 10 años a tener números negativos en el balance de la
empresa ANCAP"*, con este `dato_real`: *"el ejercicio negativo inmediatamente anterior a 2024 fue 2020, cuatro
años antes, no diez"*, y el título del chequeo es literalmente *"el último ejercicio negativo fue 2020"*. Ese
pilar se cae. Y el segundo pilar del `analisis` — *"tampoco hubo una racha ininterrumpida de diez años de
resultados positivos antes de la pérdida de 2024"* — también cambia de tamaño.

Con las cifras auditadas hoy vigentes, la serie es: **2014 pérdida** ($ 7.876.081.940, en la columna comparativa
del propio estado de 2015 que este lote cita), **2015 pérdida**, 2016 a 2019 ganancia, **2020 ganancia
(reexpresada)**, 2021 a 2023 ganancia, **2024 pérdida**. El último ejercicio negativo antes de 2024 fue 2015:
**nueve años antes, no cuatro**. Orsi dijo diez. Se equivocó por uno, no por seis.

Mi recomendación: **corrección de tipo `cambio_de_rating`, de `falso` a `discutible`**, y no a `verdadero`:

- No se sostiene `falso`. Sostenerlo exigiría decir que 2020 fue negativo, y el último estado auditado que trata
  ese ejercicio dice que no; o apoyarse en que 2015 son nueve años y no diez, que es una imprecisión de un año
  en una frase hablada, no una afirmación falsa.
- Tampoco es `verdadero`. Nueve no es diez; y la lectura de que 2020 fue negativo era defendible con los estados
  de 2020 tal como se emitieron, que es lo que además tenía a mano cualquiera en abril de 2025.
- `discutible` es exactamente el casillero de "el número depende de cuál de dos documentos del mismo emisor se
  tome y de cómo se cuente el intervalo", y el `analisis` puede decirlo en dos oraciones.

Lo que la corrección tiene que arrastrar, además del rating: el `titulo` (afirma lo que se cae), el
`dato_real.valor`, el `grafico` (hoy grafica 2020 = −12 con la nota *"cuatro años antes de 2024, no diez"*), y
la frase *"también en 2015, según la prensa que cita el mismo balance"* — que ya no hace falta, porque esta
corrida leyó el estado individual de 2015 y tiene el renglón primario (`"Resultado del ejercicio (5.944.013.417)
(7.876.081.940)"`), que además aporta 2014 y es el dato que decide si "diez años" era una exageración o casi.

Y un punto de método que el editor debería fijar ahora, porque va a volver: **cuando una empresa reexpresa un
ejercicio, el sitio publica la cifra vigente y muestra la anterior**, en fichas y en chequeos, para todos los
gobiernos por igual. Si esa regla se hubiera aplicado en su momento, el chequeo de abril de 2025 no habría
salido "falso".

---

## (d) Comparaciones

- **La decisión de mover la serie de paridad a `comparaciones` es correcta**, y por la razón buena: el esquema
  pide `SerieParidad` por año y lo publicado son períodos plurianuales; forzarlos habría sido inventar un
  reparto. `precios_vs_paridad.descripcion` lo explica. Bien.
- **Pero cuatro entradas del CED tienen problema de contexto, no de forma.** El sitio ya publicó, en
  `content/chequeos/lacalle-pou/2022-03-27-sobrecostos-combustibles-1700-millones.yaml`, que ese cálculo es *"un
  cálculo privado del CED, no un dato oficial"*, que no se puede reproducir con la fuente oficial sola, que el
  PDF trae el dato de gasoil con dos valores distintos (1137 y 1.337) y que el CED tiene vínculo institucional
  documentado con Lacalle Pou. La ficha publica los mismos números como hechos, sin ninguno de esos cuatro
  caveats. El sitio no puede calificar "discutible" una cifra en una página y publicarla como dato en otra.
- **La misma nota de El Observador trae la lectura alternativa y no se recogió**: *"Los sobrecostos del
  quinquenio siguiente son tomados por algunos como la compensación que necesitó la empresa para solventar sus
  déficit anteriores"*, precedido de *"Solo entre 2011 y 2015 la empresa monopólica perdió US$ 665 millones"*.
  Es la explicación inocente del sobreprecio 2015-2019, en la fuente que se usó para probar el sobreprecio.
- **Y trae la posición contraria, que tampoco se recogió.** La nota se titula "qué muestran los números de este
  gobierno **y el FA**" y dedica la mitad a Vallcorba y Zelko (asesores de la bancada del FA), cuyo índice
  *"descarta de plano cualquier posibilidad de considerar que se registraron 'tarifazos' y que hubo 'voracidad
  fiscal'"*. Tomar de una nota de dos lados solamente las cifras de un lado es el problema de Regla 0 más
  concreto del bloque de comparaciones.
- **Unidades que no se comparan entre sí.** `comparaciones[0..3]` son acumulados de cinco años (USD 1.337 M) y
  `[4]` es un promedio anual (USD 40,5 M). El `valor_propio` de `[4]` sí trae el promedio de la década (USD 288
  M/año) para que se pueda comparar — bien — pero el lector que mire la lista va a poner 1.337 al lado de 40,5.
  Homogeneizar la unidad en `indicador`.
- **`comparaciones[9]` tiene un `valor_propio` que no es un valor**: *"gasoil uruguayo, sin cifra en pesos citada
  en esta nota para el litro fuera de frontera; en frontera con Brasil, 5 pesos más caro que en Sant'Ana do
  Livramento"*. Si no hay valor, no hay comparación: o se busca la cifra o se cae la entrada.
- **Las dos comparaciones de precio: falta lo que la propia fuente explica.** Ámbito/CEPP dice *"El CEPP explica
  la diferencia a partir de la metodología utilizada por el gobierno para la fijación de precios, determinados
  por los valores internacionales de los dos meses anteriores, lo que generó 'grandes desfasajes'"*; y
  Ámbito/SEG dice *"las diferencias entre países ricos y pobres son evidentes, así como la influencia de los
  subsidios y las políticas locales"*. Las dos fuentes atribuyen la brecha a política de precios e impuestos, no
  a la empresa. Sin eso, y con `valor_propio` como está (ver bloqueo 3), la ficha convierte una diferencia de
  política tributaria en un indicador de ANCAP.
- **Cobertura**: no hay ninguna comparación de 2022-2023, que son los dos años de mayor ganancia de la serie.
  No lo leo como sesgo (el conjunto queda desfavorable para todos los gobiernos salvo 2020-2021 y 2024), pero es
  un hueco.
- **Nada calculado por el sitio**: se cumple. La única aritmética propia son las conversiones a dólares
  (declaradas) y las sumas de dos renglones de balance (declaradas en `concepto`). Correcto.

---

## (e) Riesgo legal y alcance

- **El caso Sendic: cumplido.** `grep` sobre `empresas.yaml` no devuelve ni una mención de "Sendic", ni de
  "comisión investigadora", ni una insinuación. `notas.md` lo deja en `casos_vistos` con dos líneas y sin atar
  nada a hechos. Es exactamente lo que pedía el brief. **Sin objeción.**
- **Riesgo art. 336 CP: bajo, con una excepción.** La ficha no imputa conducta a nadie: son cifras de estados
  auditados y textos de leyes. La excepción es el bloqueo 2 (aeropuertos): afirmar el alcance vigente de un
  monopolio sin fuente es afirmar más de lo que respalda la evidencia, aunque no haya persona nombrada.
- **Ley 18.331 art. 18: no aplica.** No hay denuncias ni personas físicas en situación procesal.
- **Dos afirmaciones más sin fuente, del mismo tipo**: *"nunca llegó a aplicarse"* (sobre la ley 17.448) y que
  la excepción portuaria rige "desde 2020" — esto último apoyado en una nota sobre la aprobación **en comisión**
  (octubre 2020), no en el texto sancionado. La Ley 19.924 está en IMPO y el investigador ya estuvo ahí.

---

## (f) Legibilidad para el dueño

Un ciudadano que abre esta página en dos minutos hoy se lleva: una definición correcta, un cuadro legal denso,
una tabla de diez años con resultado y deuda, y diez comparaciones. Le falta, en orden de importancia:

1. **Por qué pasó lo de 2024.** La respuesta está en una fuente que el lote ya cita: *"como consecuencia de la
   falta de producción local de combustibles por la parada de la Refinería La Teja para mantenimiento y obras"*,
   con el desglose de ANCAP (pérdida operativa de combustibles USD 95 M por la refinería parada, Portland −24,5
   M, financiero −64 M). Un `nota` en `finanzas[2024]`.
2. **Cuánto le devuelve al Estado de verdad** (ver (b)): hoy la respuesta que da la página es del orden de USD
   20 M por año, y la línea `Total impuestos` de los mismos documentos está entre USD 600 y 830 M.
3. **El patrimonio.** Es la pregunta del dueño y el esquema no la admite: `Anio` es `.strict()` con resultado,
   transferencias, capitalizaciones, deuda y nota. Está en todos los balances leídos ("Total de patrimonio
   21.126.143.956 5.187.440.402" en 2016). Y hay una frase del presidente de la empresa que la resume: *"el
   patrimonio de Ancap en el 2020 es igual al que tenía en el 2002, el mismo"* (Stipanicic, El País 17/10/2020).
   Propongo agregar `patrimonio` (y quizá `ingresos`) a `Anio` antes de que la colección tenga cinco fichas.
4. **Una línea sobre qué es "resultado del ejercicio"** frente a "resultado operativo". El sitio ya tiene una
   discrepancia publicada que existe precisamente porque alguien confundió las dos.
5. **Que las cifras son de los estados individuales**, no del grupo. Hoy no está dicho en ningún lado del
   registro (está en `notas.md`, que no se publica).

---

## Objeciones por bloque

### empresas[0] · `creacion` + `tipo` + `que_hace`
- severidad: aviso
- tipo: sin_objecion (con una decisión pendiente)
- objecion: fecha, norma y citas verificadas contra IMPO y contra los estados. `que_hace` es una paráfrasis fiel
  de la Nota 1 de 2024, sin adjetivos. La única decisión: `tipo: ente_autonomo` es correcto por cómo se
  autodefine ANCAP, pero el propio esquema, en el `describe` de `TipoEmpresa`, pone a ANCAP como ejemplo de
  `empresa_publica`. Como ANCAP, UTE, ANTEL y OSE son todos entes autónomos, elegir `ente_autonomo` deja el
  valor `empresa_publica` sin ocupante natural en toda la colección.
- cita_de_contexto: "es una persona jurídica de derecho público del dominio comercial e industrial del Estado,
  organizada bajo la forma de ente autónomo" (https://www.ancap.com.uy/20615/1/eecc-individuales-2024.html)
- accion_sugerida: decidir el precedente ahora — o `ente_autonomo` para las cuatro y se documenta por qué el
  `describe` del esquema dice otra cosa, o `empresa_publica` como campo de forma "de hecho" y `ente_autonomo`
  reservado a los que no son empresas.

### empresas[0] · `monopolio.alcance` — aeropuertos
- severidad: **bloquea**
- tipo: riesgo_legal / contexto_omitido
- objecion: "desde 2023 tampoco en los aeropuertos" no tiene ninguna fuente, y la nota que respalda el ítem dice
  que la ampliación a aeropuertos no consiguió respaldo.
- cita_de_contexto: "en la discusión parlamentaria algunos legisladores de la coalición decidieron ampliarlo a
  los aeropuertos pero no tuvo el respaldo ni de Batllistas ni de Cabildo Abierto ni tampoco del Partido
  Independiente"
  (https://www.elobservador.com.uy/nota/que-argumenta-el-gobierno-para-habilitar-la-libre-importacion-de-combustibles-para-barcos-202010819440)
- accion_sugerida: sacar la mención, o sostenerla con la norma de 2023 (decreto o artículo de Rendición de
  Cuentas) en IMPO.

### empresas[0] · `monopolio.alcance` — literal C) y "nunca llegó a aplicarse"
- severidad: corregir
- tipo: contexto_omitido
- objecion: el alcance dice que el monopolio cubre "la importación y exportación de combustibles líquidos,
  semilíquidos y gaseosos" y omite la condición que la propia ley le pone. Es materialmente relevante en un año
  como 2024, con la refinería parada e importando derivados. Aparte, "nunca llegó a aplicarse" (sobre la ley
  17.448) es una afirmación sin fuente.
- cita_de_contexto: "C) A la importación y exportación de carburantes líquidos, semilíquidos y gaseosos,
  cualesquiera sea su estado y su composición, cuando las refinerías del Estado produzcan por lo menos, el 50 %
  de la nafta que consuma el país." (https://www.impo.com.uy/bases/leyes/8764-1931)
- accion_sugerida: llevar la condición del literal C) a la prosa del alcance; sostener o quitar "nunca llegó a
  aplicarse".

### empresas[0] · `monopolio.normas[2]` — Ley 19.924 art. 317
- severidad: corregir
- tipo: contexto_omitido (dato verificable contra el propio documento citado)
- objecion: dice "modifica el literal F) del **artículo 1** de la Ley 8.764". El artículo 1 tiene literales A),
  B) y C). El literal F) que modificó la Ley 19.924 art. 317 es del **artículo 3** (competencias del Directorio,
  precios de los productos no monopolizados).
- cita_de_contexto: "M) Participar en el exterior en las diversas fases de la operación petrolera ... (*)Notas:
  Literal F) redacción dada por: Ley Nº 19.924 de 18/12/2020 artículo 317." — el bloque de notas cierra el
  artículo 3 (https://www.impo.com.uy/bases/leyes/8764-1931)
- accion_sugerida: cambiar "artículo 1" por "artículo 3".

### empresas[0] · `monopolio.normas[1]` y `argumentos_en_contra[2]` — fuente `justia`
- severidad: corregir
- tipo: documento_previsible
- objecion: el lote no valida por este medio inexistente, y el texto de una ley uruguaya no tiene por qué salir
  de un agregador comercial extranjero. IMPO no muestra el texto de la 17.448 por estar derogada, pero
  `parlamento.gub.uy` publica el texto sancionado y el Diario Oficial del 14/01/2002 lo tiene.
- cita_de_contexto: "LEY DE ANCAP - LEY DE DESMONOPOLIZACION Promulgación: 04/01/2002 Publicación: 14/01/2002 ...
  Quedó sin efecto por: Referéndum de fecha 7 de diciembre de 2003." (https://www.impo.com.uy/bases/leyes/17448-2002)
- accion_sugerida: buscar el texto en `parlamento.gub.uy`; si no aparece, crear el medio `justia` con su ficha
  de propiedad y dejarlo, diciendo en el registro que es un espejo y no la fuente del Estado.

### empresas[0] · `argumentos_a_favor[0]` — ANCAP
- severidad: corregir
- tipo: cita_fuera_de_contexto
- objecion: la cita empieza una oración después de donde ANCAP hace su objeción a la vara del PPI.
- cita_de_contexto: "Qué el ingreso por ventas de los combustibles sea superior o inferior a la paridad de
  importación, no dice nada sobre el valor agregado al refinar petróleo. Refinar petróleo crea valor, cuando
  producir los derivados de petróleo para la canasta de energéticos que demanda el país es menos costoso que
  importarlos" (https://www.ancap.com.uy/2147/6/composicion-de-precio-y-comparacion-ursea.html)
- accion_sugerida: extender la cita una oración hacia atrás. Y cambiar `fecha: 2026-09-07` (es la fecha de
  descarga; el corpus registra la página sin fecha) por la de la captura de Wayback (2026-04-15) o dejar
  explícito que es una página viva sin fecha.

### empresas[0] · `argumentos_a_favor[1]` y `argumentos_en_contra[1]` — la diaria
- severidad: sin_objecion
- tipo: sin_objecion
- objecion: ninguna. Las dos formulaciones salen de la misma oración de la misma nota, con el mismo grado de
  anonimato y sin adjetivos. Es el par mejor construido del registro y sirve de modelo para el resto.
- cita_de_contexto: "al poseer ese activo Uruguay gana en soberanía y reduce su dependencia del exterior,
  plantean quienes defienden el rol de la empresa estatal dentro de la economía, pero otros apuntan a que al ser
  responsable el sector público de generar un insumo clave para la producción, hay ineficiencias que se
  trasladan a toda la población"
  (https://ladiaria.com.uy/luc/articulo/2021/11/luc-numeros-y-argumentos-detras-del-debate-sobre-el-precio-de-los-combustibles/)

### empresas[0] · `argumentos_a_favor[2]` — referéndum 2003
- severidad: corregir
- tipo: documento_previsible / asimetria
- objecion: dos problemas. Uno, no es un argumento: es el resultado de una votación, sin idea ni sostenedor.
  Dos, el porcentaje sale de Wikipedia cuando **una nota que el propio lote cita da otra cifra** (62,2%, con
  votos absolutos) y la Corte Electoral publica el resultado oficial. Que dos fuentes secundarias difieran no es
  discrepancia registrable —no tengo el documento que decide— pero sí es motivo para ir al que decide.
- cita_de_contexto: "La ley fue derogada, luego de que resultara ganadora la opción del Sí con 1.201.626 votos
  (62,2%) frente a la del No que obtuvo 684.129 adhesiones."
  (https://www.subrayado.com.uy/ancap-empresas-publicas-y-caducidad-la-historia-los-referendums-uruguay-n852564)
- accion_sugerida: resultado oficial de la Corte Electoral (`corteelectoral.gub.uy`, requiere crear el medio); y
  convertir el ítem en un argumento real con un sostenedor — la Federación de Funcionarios de Ancap, que fue
  quien juntó las firmas: "La Federación de Funcionarios de Ancap comenzó con la recolección de firmas con el
  respaldo de la militancia de otros sindicatos y del Frente Amplio. El 3 de enero de 2003 fueron presentadas
  cerca de 650.000 adhesiones ante la Corte Electoral" (misma nota de Subrayado).

### empresas[0] · `argumentos_a_favor[3]` — PC y Cabildo Abierto
- severidad: corregir
- tipo: asimetria
- objecion: "plantearon reparos" pasó a "se opusieron", y el ítem no dice qué argumentaron. La misma oración de
  la nota agrega que el FA también rechazó el artículo, lo que por el mismo criterio también contaría.
- cita_de_contexto: "El Partido Colorado y Cabildo Abierto fueron los socios de la coalición que plantearon
  reparos a la caída del monopolio de ANCAP. Finalmente no se llegó a un acuerdo y se quitará el cuestionado
  artículo, también rechazado por el Frente Amplio."
  (https://www.subrayado.com.uy/la-coalicion-sacara-la-luc-la-desmonopolizacion-ancap-falta-acuerdo-interno-n631084)
- accion_sugerida: o se reemplaza por un argumento con sostenedor y contenido (Fancap, Daniel Martínez), o se
  ajusta el verbo y se incluye al FA.

### empresas[0] · `argumentos_en_contra[0]` — Lacalle Pou
- severidad: corregir
- tipo: cita_fuera_de_contexto
- objecion: "la medida más liberal que impulsó" no está en la nota; es un superlativo agregado. "No hay que
  temerle a terminar con el monopolio" es reconstrucción. El resto del `texto` (falta de apoyo político, que
  cree que el país va a terminar adoptándola) sí está respaldado.
- cita_de_contexto: "Yo nunca arrié esa bandera, fue una bandera —a esta altura— bastante en solitario. Fue una
  unipersonal casi. ... no tuve el poder de convicción, sobre los que en algún momento podían acompañar, de
  llevar la libre importación" (https://www.montevideo.com.uy/Noticias/-Jugamos-como-nunca-perdimos-como-siempre--Lacalle-por-libre-importacion-de-combustibles-uc881969)
- accion_sugerida: reescribir el `texto` con lo que dijo. Agregar en `quien` que fue ante la Asociación de
  Cultivadores de Arroz, en marzo de 2024, siendo presidente.

### empresas[0] · `argumentos_en_contra[2]` — gobierno de Batlle
- severidad: aviso
- tipo: sin_objecion
- objecion: la cita de Subrayado es literal y sostiene lo que el `texto` dice, incluido que el FA no votó. Queda
  colgando de la fuente `justia` para el contenido de la ley (ver arriba).

### empresas[0] · `finanzas[2015..2019, 2021..2024].resultado_ejercicio`
- severidad: sin_objecion
- tipo: sin_objecion
- objecion: ninguna. Los nueve renglones son literales, cruzan con la columna comparativa del año siguiente y
  los tipos de cambio de cierre son los que declaran los propios estados. El de 2015 coincide además con la
  cifra que El País publicó en dólares (USD 198 millones). Único reparo, de forma: la precisión al dólar (ver
  (b)).

### empresas[0] · `finanzas[2020].resultado_ejercicio`
- severidad: **bloquea**
- tipo: contexto_omitido
- objecion: publica como resultado del año la cifra que los estados del año siguiente reemplazaron, con la
  explicación dentro de `concepto` y el campo `nota` sin usar. Ver la sección (c) completa.
- cita_de_contexto: "Resultado del ejercicio (510.662.282) 895.776.155 385.113.873" y "Resultado antes de
  impuesto a la renta (277.690.029) - (277.690.029)"
  (https://www.ancap.com.uy/10610/1/eecc-individuales-2021.html, Nota 30.2)
- accion_sugerida: publicar +385.113.873 como resultado 2020 y llevar original, ajuste, motivo y resultado antes
  de impuestos a `finanzas[2020].nota`. Y abrir la corrección del chequeo de Orsi (ver (c)).

### empresas[0] · `finanzas[*].transferencias_al_estado`
- severidad: corregir
- tipo: contexto_omitido
- objecion: mide solo "versión de resultados acumulados a Rentas Generales" y se va a leer como "lo que ANCAP le
  da al Estado". Que los años omitidos sean "no hubo" está bien verificado; el problema es qué mide el campo.
- cita_de_contexto: "Impuesto Específico Interno 15.589.129.030 14.503.087.107 ... Total impuestos
  19.767.669.858 17.963.260.814 f) Durante los ejercicios 2016 y 2015 no se realizaron versiones de fondos a
  rentas generales" (https://www.ancap.com.uy/234/1/eecc-individual-2016.html — el cuadro está inmediatamente
  antes de la frase que el registro cita)
- accion_sugerida: `concepto` explícito ("versiones de resultados acumulados; no incluye IMESI, IVA, impuesto al
  patrimonio ni IRAE") y la línea `Total impuestos` del año en `Anio.nota`, con su cita. Sin sumar nada nuevo.

### empresas[0] · `finanzas[*].deuda_financiera`
- severidad: corregir
- tipo: contexto_omitido
- objecion: tres cosas — qué incluye (más de la mitad en 2016 son préstamos de partes relacionadas), que la
  caída 2015→2016 es la extinción de la deuda con el MEF que la ficha registra al lado como capitalización, y
  que son cifras individuales y no del grupo (el número público de abril de 2025 fue USD 255 M).
- cita_de_contexto: "Nota 23 - Deudas financieras ... Préstamos bancarios 4.077.205.907 1.141.768.682
  1.403.337.364 6.622.311.953 ... Préstamos de partes relacionadas (*) (Nota 30) - 1.333.684.852 6.001.581.834
  7.335.266.686" (https://www.ancap.com.uy/234/1/eecc-individual-2016.html)
- accion_sugerida: desagregar o al menos declarar la composición en `concepto`; `nota` en 2016 uniendo la caída
  con la capitalización; una línea de que son estados individuales.

### empresas[0] · `finanzas[2016].capitalizaciones_del_estado`
- severidad: corregir
- tipo: contexto_omitido
- objecion: la cita del contrato es impecable y el hecho está bien documentado. El problema es la conversión:
  una operación del 2/2/2016 convertida al cierre de diciembre de 2016. Y falta el préstamo de la CAF, que fue
  parte del mismo rescate.
- cita_de_contexto: "en enero de 2016 el Parlamento aprobara una capitalización por US$ 622 millones aportados
  por el MEF, más un préstamo por US$ 250 millones del Banco de Desarrollo de América Latina (CAF)"
  (https://www.elobservador.com.uy/nota/el-precio-de-la-nafta-y-el-gasoil-que-muestran-los-numeros-de-este-gobierno-y-el-fa--20223316150)
- accion_sugerida: publicar UI y pesos como los da el contrato; si se convierte, a la fecha de la operación y
  declarándolo. Evaluar registrar el préstamo CAF.

### empresas[0] · `precios_vs_paridad.descripcion`
- severidad: corregir
- tipo: documento_previsible / contexto_omitido
- objecion: describe el PPI como si fuera una medición pacífica. No lo es, y la nota que el propio lote cita lo
  dice; falta también el "factor X". Y no nombra el dataset oficial que el sitio ya cita en un chequeo
  publicado: URSEA, `catalogodatos.gub.uy/dataset/ursea-ppi_vs_pe_v2`, con series mensuales desde 2002. El brief
  pedía `catalogodatos.gub.uy` y no hay una sola consulta a ese dominio en `consultas.jsonl`.
- cita_de_contexto: "la Ursea realiza un cálculo teórico –que recibió críticas técnicas desde diversos ámbitos,
  incluida Ancap, que entiende que hay costos subestimados– sobre lo que costaría a un importador ficticio
  abastecer al mercado" y "para agosto el gobierno informó que entraría en escena el denominado 'factor X'"
  (https://ladiaria.com.uy/luc/articulo/2021/11/luc-numeros-y-argumentos-detras-del-debate-sobre-el-precio-de-los-combustibles/)
- accion_sugerida: agregar las dos cosas a la descripción y nombrar el dataset de URSEA como la serie oficial
  de referencia, aunque no llene `series` (está en $/litro, no en USD millones).

### empresas[0] · `comparaciones[0..3]` — CED, 2010-2014 y 2015-2019
- severidad: corregir
- tipo: contexto_omitido / asimetria
- objecion: se publican como dato cifras que el propio sitio ya calificó de estimación privada no reproducible,
  sin los caveats que ya publicó, sin la lectura alternativa que trae la misma nota y sin la posición contraria
  que la misma nota desarrolla.
- cita_de_contexto: "Los sobrecostos del quinquenio siguiente son tomados por algunos como la compensación que
  necesitó la empresa para solventar sus déficit anteriores" y "mientras las subas de estos elementos
  promediaron el 4,7% anual, la nafta lo hizo en 4,5% durante las administraciones del Frente Amplio, por lo que
  el resultado 'descarta de plano cualquier posibilidad de considerar que se registraron "tarifazos"'"
  (https://www.elobservador.com.uy/nota/el-precio-de-la-nafta-y-el-gasoil-que-muestran-los-numeros-de-este-gobierno-y-el-fa--20223316150)
- accion_sugerida: en `indicador` o en el `con`, que quede escrito que es un cálculo del CED (centro privado, con
  el vínculo institucional que el sitio ya documentó) y no un dato oficial; y agregar una comparación con la
  lectura de Vallcorba y Zelko, o no publicar ninguna de las dos.

### empresas[0] · `comparaciones[4]` — CED, 2020-2021
- severidad: aviso
- tipo: contexto_omitido
- objecion: la cifra es un promedio que dedujo El Observador ("según se deduce de los números publicados por el
  think tank") y la propia cita lo dice, así que está bien atribuida. Pero el sitio ya registró que no verificó a
  qué combustible corresponde cada una de las dos cifras anuales del CED para 2020-2021.
- accion_sugerida: dejar la nota de que es una deducción del medio, no una cifra del informe.

### empresas[0] · `comparaciones[5]` — ANCAP, ejercicio 2024
- severidad: corregir
- tipo: cita_fuera_de_contexto
- objecion: la cita corta justo antes del matiz que ANCAP agrega en la oración siguiente.
- cita_de_contexto: "En el ejercicio 2024, los precios de venta estuvieron por debajo de la paridad de
  importación teórica URSEA fósil en USD 55 millones. A lo anterior se agrega el aporte de ANCAP de USD 24
  millones de subsidio focalizado de supergás. Sumado a lo anterior, las importaciones reales de derivados por
  Muelle La Teja superaron en costo al cálculo teórico PPI URSEA."
  (https://www.ancap.com.uy/20669/1/resultados-ancap-ejercicio-2024.html)
- accion_sugerida: extender la cita una oración.

### empresas[0] · `comparaciones[6..9]` — precio al público
- severidad: **bloquea**
- tipo: cita_fuera_de_contexto (atribución)
- objecion: `valor_propio` le atribuye a ANCAP el precio al surtidor, que incluye impuestos y márgenes de la
  cadena que ANCAP no percibe. Además falta, en las cuatro, la explicación que dan las propias fuentes. Y
  `comparaciones[9]` no tiene valor propio.
- cita_de_contexto: "El PEP sin impuestos es el ingreso neto que percibe ANCAP por sus ventas. Sobre el PEP la
  URSEA determina los costos de la cadena comercial y fletes: márgenes de comercialización de las
  Distribuidoras, envasado de GLP, fletes, y bonificaciones de las estaciones de servicio. Adicionalmente se
  agregan los gravámenes a cada producto: tasa URSEA, tasa inflamable (IMM), fidecomiso del boleto, FUDAEE,
  IMESI, IVA" (https://www.ancap.com.uy/2147/6/composicion-de-precio-y-comparacion-ursea.html)
- accion_sugerida: renombrar `valor_propio` a "precio al público en Uruguay (incluye impuestos y márgenes de la
  cadena, que ANCAP no percibe)", agregar la composición del precio con la fuente de ANCAP, e incorporar la
  explicación de cada fuente. `comparaciones[9]`: conseguir la cifra o eliminarla.

---

## Objeciones al lote

- **El lote no valida** (2 errores de referencias, medio `justia`), así que ninguna cita está verificada por
  máquina. Es lo primero que hay que resolver.
- **El esquema `empresa` no tiene `evidencia.nivel`**, así que la regla de "dos grupos de medios para
  `reportado`" no se aplica sola en esta colección. Y hay afirmaciones que descansan en un solo medio y un solo
  grupo: la excepción portuaria (El Observador, werthein-hochbaum), el retiro del art. 230 de la LUC (Subrayado,
  fontaina-de-feo), la cita de Lacalle Pou (Montevideo Portal, montevideo-comm, que además reproduce a
  Subrayado: *"según consignó Subrayado (Canal 10)"*), las dos comparaciones de precio (las dos de Ámbito, mismo
  grupo). Ninguna es grave por sí sola, pero el editor tiene que aplicar la regla a mano porque el validador no
  la va a aplicar.
- **Dependencia de un solo grupo, en el balance general: no.** El grueso de la ficha son documentos oficiales
  (ANCAP e IMPO, ambos `estado-uruguayo`), que es lo correcto para una ficha de este tipo. La prensa aparece en
  seis grupos distintos. Bien.
- **Cobertura del período.** Los diez años de balance están completos y verificados, que era lo más caro del
  encargo, y está bien hecho. El marco legal cubre 1931-2022 con un hueco en 2023 (aeropuertos). Las
  comparaciones dejan fuera 2022-2023.
- **Regla de lectura de fuentes:** tres entradas de `consultas.jsonl` (21, 22, 24) usan `WebFetch`. Ninguna de
  esas páginas terminó citada, así que no viola la letra de la regla 2, pero conviene decirlo: la que dio
  timeout (`transparenciapresupuestaria.opp.gub.uy/inicio/empresas-publicas/ancap`) es justamente la que podía
  traer las series de transferencias y capitalizaciones ya armadas para toda la colección, y no se reintentó con
  `pnpm fuente`.
- **Un hallazgo que este lote desbloquea y que no es suyo.** La discrepancia ya publicada
  `content/discrepancias/presidencia/2020-02-27-resultado-operativo-etiquetado-como-resultado-ejercicio-ancap-2019.yaml`
  está en `probable` con esta nota interna: *"Queda a `probable` mientras no se revisen los estados financieros
  de 2015 a 2017"*. Esta corrida los leyó. Los renglones son:
  - 2015, estados individuales 2015: *"Resultado operativo (3.223.398.507) (3.457.283.442)"* — negativo en 2015
    y en 2014, mientras la nota de Presidencia dice *"El balance 2015 de Ancap presenta un resultado operativo
    superavitario de 27 millones de dólares"*. Y el resultado del ejercicio de 2015 también fue negativo.
  - 2016, estados individuales 2017 (columna comparativa): *"Resultado operativo 2.059.659.016 (536.666.041)"* —
    2016 negativo. Presidencia dice *"En 2016, alcanzó 15 millones de dólares"*, que es el **resultado del
    ejercicio** de 2016 al cierre (435.536.149 / 29,34 = 14,8), el mismo patrón que el registro ya documentó
    para 2018 y 2019.
  - 2017: Presidencia dice *"39 millones de dólares"*, que es el resultado del ejercicio 2017 al cierre
    (1.124.635.133 / 28,81 = 39,0), no el operativo (2.059.659.016 / 28,81 = 71,5).
  No lo escribo como registro nuevo porque ya existe: va como corrección de ese registro, que puede pasar de
  `probable` a `publicado` y ampliar su alcance a 2015-2017. No consulté los estados **consolidados** de esos
  años, que es la única explicación alternativa que se me ocurre para el "+27 millones" de 2015; dejarlo dicho.

---

## Objeciones al brief

**Ninguna de Regla 0.** El brief pide explícitamente los dos lados con el mismo esfuerzo, cifras sin adjetivos,
y avisa que si un lado cuesta más hay que decirlo. Es simétrico y está bien escrito. Coincido con
`objeciones_al_brief` del investigador en eso.

Dos observaciones de encargo, no de sesgo:

1. **El brief pidió cosas que no se buscaron y que son las que más cambiaban el resultado**: el informe de la
   comisión/comité de expertos de la LUC (punto 3), `catalogodatos.gub.uy` (punto 2), la Rendición de Cuentas
   del MEF para transferencias (punto 2) y la Corte Electoral para el referéndum (punto 3). Las cuatro son
   documentos previsibles y las cuatro habrían mejorado justamente los bloques más flojos.
2. **El brief ofrece un ejemplo de YAML que difiere del esquema real** (`valor_ancap` vs `valor_propio`,
   `transferencias_al_estado.usd` como número suelto vs el objeto `Monto`, `precios_vs_paridad.series` como si
   siempre hubiera desglose anual). El investigador hizo bien en seguir `src/schemas/empresa.ts` y decirlo en el
   encabezado del archivo. Para la próxima ficha de la colección, que el brief remita al esquema y no lo
   transcriba.

Y una sugerencia de esquema, para que la colección no arranque coja: `Anio` no admite `patrimonio` ni
`ingresos`, y `Comparacion` obliga a poner un `valor_propio` aunque la fuente no dé uno. Las dos cosas se ven en
esta primera ficha.

---

## Discrepancias

Escribí **una** en `inbox/empresas/ancap/2026-09-07/discrepancias.yaml`: El País, 02/04/2025, `dato_erroneo`,
*"dejó atrás tres años consecutivos de ganancias (en 2020 había perdido US$ 12 millones)"* contra la Nota 30.2
de los Estados Financieros Individuales de 2021, que presenta el ejercicio 2020 reformulado a una ganancia de
$ 385.113.873. Sin verbos de intención: el registro dice que hay dos versiones del mismo ejercicio emitidas por
el mismo emisor y que lo publicado corresponde a la primera.

**Es una decisión de umbral y la expongo para que el editor la revise**, porque no es obvia: la cifra que
publicó El País sí figura en un documento primario (los estados de 2020 tal como se emitieron), y lo que la
contradice es un documento primario posterior del mismo emisor. Si el editor decide que un documento superado
no cuenta como "la fuente primaria del hecho", la discrepancia sale — y la corrección del chequeo propio de la
sección (c) **se mantiene igual**, porque a nosotros no nos protege esa duda: publicamos en 2026 apoyándonos en
una cifra reemplazada en 2022. El umbral que aplico es el mismo para los dos.

**Lo que no registré como discrepancia y por qué:**
- Subrayado (62,2%) contra Wikipedia (62,1%) sobre el referéndum de 2003: son dos fuentes secundarias que no
  coinciden y no tengo el documento de la Corte Electoral. Es un desacuerdo, y va a la crítica, no al registro.
- El Observador, "en enero de 2016 el Parlamento aprobara una capitalización por US$ 622 millones": la
  diferencia con los USD 642,7 M de la ficha se explica por el tipo de cambio de conversión, y no tengo el
  registro parlamentario para juzgar la fecha de aprobación. No es registrable.
- La nota de Presidencia (2020-02-27) sobre "cinco años consecutivos de superávit": ya está registrada, en
  `probable`; lo mío es una corrección de ese registro, no una discrepancia nueva (ver "Objeciones al lote").

Simetría del registro resultante: el nuevo apunta a El País (grupo `scheck-aguirre`, alineamiento
`oficialista_tradicional`); la ampliación de la existente apunta a la Presidencia de un gobierno del Frente
Amplio. El mismo umbral, en las dos direcciones, en el mismo lote.

---

## Cobertura

Todas las notas de prensa que el lote cita, más las dos que abrí yo. **Todas quedan `neutral`**, y lo digo
porque un crítico que marca todo neutral tiene que justificarlo: son notas explicativas o de datos, no de
cobertura política, y en las que sí hay carga (El Observador 2022, Ámbito 2026) la nota trae también la voz del
criticado, que es el caso que el criterio manda leer como neutral. Apliqué el mismo umbral a los dos lados: si
"particularmente en el segundo de Tabaré Vázquez" bastara para `desfavorable`, "el Poder Ejecutivo decidió
apartarse de la recomendación técnica de la Ursea" bastaría para lo mismo con Lacalle Pou, y las dos frases
conviven en la misma nota con sus respectivas réplicas.

```yaml
- medio: la-diaria
  url: https://ladiaria.com.uy/luc/articulo/2021/11/luc-numeros-y-argumentos-detras-del-debate-sobre-el-precio-de-los-combustibles/
  titulo: 'LUC: números y argumentos detrás del debate sobre el precio de los combustibles'
  fecha: 2021-11-24
  evento: mecanismo-precios-combustibles-luc
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Presenta los dos lados en la misma oración y sin adjetivos: "al poseer ese activo Uruguay gana en soberanía
    y reduce su dependencia del exterior, plantean quienes defienden el rol de la empresa estatal dentro de la
    economía, pero otros apuntan a que al ser responsable el sector público de generar un insumo clave para la
    producción, hay ineficiencias que se trasladan a toda la población".

- medio: subrayado
  url: https://www.subrayado.com.uy/la-coalicion-sacara-la-luc-la-desmonopolizacion-ancap-falta-acuerdo-interno-n631084
  titulo: La coalición sacará de la LUC la desmonopolización de ANCAP tras falta de acuerdo interno
  fecha: 2020-05-22
  evento: mecanismo-precios-combustibles-luc
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Reporta una derrota interna del oficialismo sin calificarla y le da la palabra a quien la explica: "Estos
    artículos apuntan a bajar los precios para que ANCAP en breve venda todos los productos a precio de
    paridad", explicó Gandini.

- medio: el-observador
  url: https://www.elobservador.com.uy/nota/que-argumenta-el-gobierno-para-habilitar-la-libre-importacion-de-combustibles-para-barcos-202010819440
  titulo: Qué argumenta el gobierno para habilitar la importación de combustibles en puertos
  fecha: 2020-10-09
  evento: mecanismo-precios-combustibles-luc
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Expone el argumento oficial en palabras del ministro y a la vez consigna quién no lo acompañó, sin adjetivar
    ninguna de las dos: "De todos modos, Batllistas no acompañó la ampliación de la propuesta a los
    aeropuertos".

- medio: el-observador
  url: https://www.elobservador.com.uy/nota/el-precio-de-la-nafta-y-el-gasoil-que-muestran-los-numeros-de-este-gobierno-y-el-fa--20223316150
  titulo: 'El debate por el precio de la nafta y el gasoil: qué muestran los números de este gobierno y el FA'
  fecha: 2022-03-07
  evento: mecanismo-precios-combustibles-luc
  politico: vazquez
  tono: neutral
  justificacion: >-
    Trae una afirmación desfavorable a su gobierno ("en el transcurso de los gobiernos frenteamplistas hubo
    varios años en que los precios al público no mostraron rebajas en insumos clave como el Brent
    —particularmente en el segundo de Tabaré Vázquez—") y en el mismo texto la lectura contraria ("Los
    sobrecostos del quinquenio siguiente son tomados por algunos como la compensación que necesitó la empresa
    para solventar sus déficit anteriores").

- medio: el-observador
  url: https://www.elobservador.com.uy/nota/el-precio-de-la-nafta-y-el-gasoil-que-muestran-los-numeros-de-este-gobierno-y-el-fa--20223316150
  titulo: 'El debate por el precio de la nafta y el gasoil: qué muestran los números de este gobierno y el FA'
  fecha: 2022-03-07
  evento: mecanismo-precios-combustibles-luc
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Segunda ficha de la misma nota porque trata a dos gobiernos: reproduce su justificación textual ("la Ursea
    sugirió determinados aumentos y nosotros decidimos aumentar la mitad de lo sugerido") y también la crítica
    a su gestión tarifaria ("desde el pasado mes de noviembre ... el Poder Ejecutivo decidió apartarse de la
    recomendación técnica de la Ursea").

- medio: montevideo-portal
  url: https://www.montevideo.com.uy/Noticias/-Jugamos-como-nunca-perdimos-como-siempre--Lacalle-por-libre-importacion-de-combustibles-uc881969
  titulo: '“Jugamos como nunca, perdimos como siempre”: Lacalle por libre importación de combustibles'
  fecha: 2024-03-08
  evento: mecanismo-precios-combustibles-luc
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Es una crónica de discurso que lo cita largo y sin comentario propio: "El presidente Luis Lacalle Pou
    defendió este viernes ante la Asociación de Cultivadores de Arroz su postura en favor de la libre
    importación de combustibles".

- medio: subrayado
  url: https://www.subrayado.com.uy/ancap-empresas-publicas-y-caducidad-la-historia-los-referendums-uruguay-n852564
  titulo: 'ANCAP, empresas públicas y Caducidad: la historia de los referéndums en Uruguay'
  fecha: 2022-03-26
  evento: referendum-luc
  politico: batlle
  tono: neutral
  justificacion: >-
    Relato histórico con cifras y sin calificativos sobre su gobierno: "En 2001, el gobierno del entonces
    presidente Jorge Batlle buscaba impulsar la reforma de ANCAP ... el gobierno creó un llamado proyecto de
    'ley de consenso' con aportes de todos los partidos políticos. El Frente Amplio no votó la iniciativa".

- medio: ambito
  url: https://www.ambito.com/uruguay/tiene-la-nafta-mas-cara-latinoamerica-y-el-tercer-gasoil-mas-costoso-n6232758
  titulo: Uruguay tiene la nafta más cara de Latinoamérica y el tercer gasoil más costoso
  fecha: 2026-01-10
  evento: mecanismo-precios-combustibles-luc
  politico: orsi
  tono: neutral
  justificacion: >-
    No nombra a ningún actor político ni atribuye el precio a una gestión; explica la dispersión por factores
    generales: "las diferencias entre países ricos y pobres son evidentes, así como la influencia de los
    subsidios y las políticas locales, que inciden directamente en el costo final que pagan los consumidores".

- medio: ambito
  url: https://www.ambito.com/uruguay/combustibles-la-nafta-sale-un-55-mas-cara-que-argentina-y-brasil-mientras-el-gasoil-se-empareja-n6300670
  titulo: 'Combustibles: la nafta sale un 55% más cara que en Argentina y Brasil mientras el gasoil se empareja'
  fecha: 2026-07-17
  evento: mecanismo-precios-combustibles-luc
  politico: orsi
  tono: neutral
  justificacion: >-
    Atribuye la brecha a la metodología del gobierno ("El CEPP explica la diferencia a partir de la metodología
    utilizada por el gobierno para la fijación de precios ... lo que generó 'grandes desfasajes'") y en el mismo
    texto le da lugar a la respuesta oficial: "Estamos trabajando seriamente y responsablemente", sostuvo la
    ministra Fernanda Cardona.

- medio: el-pais
  url: https://elpais.com.uy/negocios/empresas/ancap-tuvo-en-2024-las-mayores-perdidas-desde-2015-con-us-118-4-millones-que-estuvo-detras
  titulo: Ancap tuvo en 2024 las mayores pérdidas desde 2015, con US$ 118,4 millones, ¿qué estuvo detrás?
  fecha: 2025-04-02
  evento: mecanismo-precios-combustibles-luc
  politico: orsi
  tono: neutral
  justificacion: >-
    Nota que abrí yo (no está citada por el lote; la usé para la discrepancia). Es descriptiva y atribuye la
    pérdida a un hecho técnico, no a una gestión: "El resultado de pérdidas de la petrolera estatal Ancap en
    2024 no fue una sorpresa: en las presentaciones trimestrales del ente se venía advirtiendo el deterioro
    producto -principalmente- de una parada técnica de la refinería de La Teja".

- medio: el-pais
  url: https://www.elpais.com.uy/negocios/presidente-de-ancap-y-los-trabajadores-debatieron-sobre-el-futuro-de-la-empresa
  titulo: Presidente de Ancap y los trabajadores debatieron sobre el futuro de la empresa
  fecha: 2020-10-17
  evento: mecanismo-precios-combustibles-luc
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Nota que abrí yo (el lote no la usa y debería, ver sección (a)). Da las dos posiciones con espacio parejo,
    incluida la objeción de un trabajador al presidente del ente: "Hace unos cuantos años nos habían dicho que
    (el patrimonio) se había duplicado", por lo que "entonces me resulta muy difícil saber a quién creerle".
```

**Nota de método sobre estos registros.** El esquema `cobertura` exige `politico` o `partido`, y varias notas de
esta colección no tratan de ningún político (las dos de Ámbito no nombran a ninguno). Puse el presidente en
ejercicio y lo dije en la justificación, pero es una atribución forzada: para la colección `empresas`, o el
esquema admite un sujeto "empresa", o estas notas no deberían generar registro de cobertura. Que lo decida el
editor antes de que se acumulen.

Además propongo dos eventos que no existen y que esta ficha necesita: `propuesto:referendum-ancap-2003` (hoy la
ficha lo cuelga de nada y `referendum-luc` es otro hecho) y `propuesto:balance-ancap-2024`.
