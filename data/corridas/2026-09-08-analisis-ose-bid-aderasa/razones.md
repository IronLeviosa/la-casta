# Razones — corrida 2026-09-08-analisis-ose-bid-aderasa

Editor: Sonnet (claude-sonnet-5), por decisión del mantenedor del 2026-09-07 (ningún subagente
corre en Fable sin permiso explícito; Opus queda para el crítico). Lote: dos registros de
`analisis` (BID 2020, ADERASA 2024/datos 2022) sobre OSE, más `discrepancias.yaml` (1 registro) y
tres medios faltantes.

## Objeciones de `critica.md` y qué se hizo con cada una

El investigador ya había resuelto, en la segunda vuelta que llegó a este lote, casi todas las
objeciones de fondo (documentos previsibles encontrados, contexto agregado, gráfico de agua no
facturada armado, autor_es corregido). Mi trabajo fue calificar cada afirmación con esos datos ya
cargados, escribir el `analisis` de cada una (el investigador no lo había escrito), reescribir
`veredicto` con las calificaciones reales y recortar `resumen`+`veredicto`, y decidir el `tier`.

- **analisis[0] `autor_es` — riesgo legal (bloquea).** Resuelta por el investigador antes de esta
  vuelta: se retiró la atribución del financiamiento del "Proyecto OSE Sostenible y Eficiente" al
  BID (es del BIRF/Banco Mundial, préstamo 8183, con el dictamen del Tribunal de Cuentas como
  fuente) y se corrigió la magnitud de la partida "Aportes contrato BID" a su valor real (USD
  83.500, no una cifra sin escala). No encontré nada para reabrir.
- **analisis[0] `autor_es`/`fuentes` (corregir).** Resuelta: el colofón del BID y la página
  "About Us" del BID ya están en `fuentes[]` del registro, no solo citados en el texto.
- **analisis[0] `titulo`/`resumen`/`metodo` (corregir).** Resuelta por el investigador (título
  sustancial, sin "arrastra"/"apenas", `metodo` sin evaluación propia). Yo recorté además el
  `resumen` (196 palabras) para que sumado al `veredicto` que reescribí quedara en ~338 palabras.
- **analisis[0] `veredicto` (corregir).** Lo reescribí de cero: contaba mal (decía "diez de once
  discutible" cuando eran once de once) y no era una síntesis del editor. Ahora dice 8 verdadero,
  1 falso, 3 discutible, con lo que cambia en la lectura del documento.
- **afirmaciones[0] "2,06 USD/m3" (bloquea).** El investigador agregó Lentini (2015, Cuadro 4 y
  Cuadro A1): el valor es exacto para OSE (único operador de la muestra en Uruguay) y por eso no
  incluye el saneamiento de Montevideo — al revés de lo que decía la ficha publicada (ver más
  abajo, corrección propuesta). Calificación: **verdadero** (la cifra citada por el BID coincide
  con el documento de origen; la salvedad de a qué corresponde va en el `analisis`, no baja la
  calificación).
- **afirmaciones[1] "tarifa media 1,22/0,39/2,06" (bloquea).** Confirmado con Lentini: son
  estadísticos de país (11 promedios), no de operador (57 operadores dan 1,40/0,17/2,35). El BID
  presenta una estadística de país como si fuera de operador y dos de los tres valores están mal
  encuadrados. Calificación: **falso** (el sentido cambia: hay operadores con tarifa mayor a 2,06
  y un mínimo real muy por debajo de 0,39).
- **afirmaciones[2] "gasto mensual USD 29" (corregir).** Se agregó la cifra de Montevideo (USD 28)
  y se probaron las explicaciones candidatas (IVA, cargo fijo adicional de $ 62,11). La
  reconstrucción con el Decreto N° 27/019 da USD 26,26, un 10,4 % por debajo del BID: por encima
  del umbral de `impreciso` (hasta 10 %) y sin una explicación concluyente entre las candidatas
  probadas. Calificación: **discutible**.
- **afirmaciones[3] "tarifa social 22-36 %/42-90 %" (corregir).** La reconstrucción con los mismos
  operandos del decreto reproduce los dos extremos del rango de saneamiento al decimal (42,2 % y
  90,6 %) y el de agua dentro de un margen chico (20,7 %-35,5 % contra 22-36 %). Calificación:
  **verdadero**.
- **afirmaciones[4] "acceso 99,4 %/95,2 %" (corregir, documento_previsible).** La síntesis del
  Informe Nacional Voluntario de OPP confirma las dos cifras de forma literal. Calificación:
  **verdadero** (la reetiquetación "agua segura" → "cobertura por redes" es una precisión de
  contexto, no cambia el sentido ni el valor).
- **afirmaciones[5] "saneamiento básico 99,2 %/seguro 43 %" (aviso).** El Plan Nacional de
  Saneamiento confirma ambas cifras casi al decimal; la fecha ya está corregida a 2018 en el
  registro. Calificación: **verdadero**.
- **afirmaciones[6] "agua no facturada 53,4 %" (bloquea).** El Anexo 1 del propio BID confirma el
  nivel y el desagregado; se retiró la afirmación de "mejora 2006-2017" que el documento no
  sostiene (el índice sube levemente 2013-2018). Calificación: **verdadero**.
- **afirmaciones[7] "3,4 M habitantes/1,15 M conexiones/16.500 km" (aviso).** Confirmado con la
  presentación de OSE ante el Parlamento (misma fuente que cita el BID) y cruzado con ADERASA.
  Calificación: **verdadero**.
- **afirmaciones[8] "315 M m3/86,5 M m3/USD 140 M" (corregir, documento_previsible).** El documento
  de origen ("OSE, 2018b", Reporte de sostenibilidad 2018) está identificado por su nombre exacto
  pero no se localizó. Queda **discutible** con `_faltante: dato_oficial`; recomiendo mandarlo a un
  resolvedor (accion_sugerida del crítico), lo dejo anotado en `revision.notas_internas`.
- **afirmaciones[9] "cobertura saneamiento por red 62 %/80 %/50 %" (aviso).** El Plan Nacional de
  Saneamiento confirma los tres valores dentro del margen de "aproximadamente" que declara el BID.
  Calificación: **verdadero**.
- **afirmaciones[10] "4.050 km/340.000 conexiones/+200 localidades" (sin_objecion).**
  Calificación: **verdadero**, sin cambios.
- **afirmaciones[11] "asequibilidad 4 %" (no tenía objeción propia, es la afirmación nueva de esta
  vuelta).** El BID mismo cita su fuente como un adelanto de resultados sin publicación separada.
  Calificación: **discutible**, `_faltante: dato_oficial`.
- **graficos[0] "tarifa por país" (corregir).** Rehecho con los once promedios por país de Lentini,
  Uruguay señalado, sin la barra de "promedio de la muestra" como categoría, fuente = Lentini
  (quien hizo la comparación), no el BID. Sin objeción de mi parte.
- **graficos[1] "cobertura de saneamiento" (sin_objecion).** Sin cambios.
- **analisis[1] `autor_es`/`fuentes` (corregir).** Resuelto: `fuentes[]` ya no está vacío (nosotros
  de ADERASA + colofón con los tres autores del informe, mismo umbral que los cuatro del BID).
- **analisis[1] `publicado.cita` (corregir, cita_fuera_de_contexto).** Resuelto: la cita es ahora un
  tramo contiguo, sin el orden invertido con puntos suspensivos.
- **analisis[1] `titulo`/`resumen`/`veredicto` (corregir).** `resumen` ya distinguía las dos
  muestras (117 operadores del benchmarking general, 11 de la sección de tarifas) desde la vuelta
  anterior; yo lo recorté y reescribí `veredicto` de cero (antes contaba mal: decía "seis de siete
  discutible" cuando eran siete de siete, y ahora son nueve afirmaciones, una verdadero y ocho
  discutible).
- **afirmaciones[0]-[2] tarifas y cargo fijo (corregir).** Se agregaron los 11 operadores nombrados
  y la salvedad de Belice/Costa Rica/Chile. Sin un documento propio de OSE o de URSEA con la misma
  definición para 2022 (el anexo del Decreto N° 466/021 es una imagen), quedan **discutible** las
  tres.
- **afirmaciones[3] acceso/continuidad/micromedición (corregir).** Reemplazada la comparación ad
  hoc (AyA/Heredia) por el grupo oficial "Muy Grande" del propio informe. Sigue sin un documento
  propio de OSE/URSEA para 2022: **discutible**.
- **afirmaciones[4] pérdidas de agua 45,30 % (bloquea, por el `dato_real` y el gráfico).** Corregido
  el `dato_real`: OSE es el peor de los cuatro "Muy Grande" con dato, no un valor intermedio. El
  Δ2021 (-10 %) y la comparación ADERASA-ADERASA con 2016 (49,50 %) ya están. Sigue sin un
  documento propio de OSE/URSEA con la misma definición: **discutible**.
- **afirmaciones[5] tratamiento de aguas residuales (corregir).** Se documentó el doble valor del
  propio informe (88,94 % / 88,98 %) y se agregó el contraste 2016 (46,92 %). El doble valor es,
  por definición, dos lecturas del mismo dato: **discutible**.
- **afirmaciones[6] facturación unitaria 2,16 (corregir, documento_previsible).** El dataset abierto
  de OSE que permitiría reconstruir el cociente no se procesó por su volumen; queda **discutible**
  con `_faltante: dato_oficial` y la tarea para un resolvedor anotada en `revision.notas_internas`.
- **afirmaciones[7] endeudamiento 41,18 % (corregir, documento_previsible).** Confirmado de forma
  independiente contra el balance auditado de OSE 2022 (OCR cruzado con la Nota 8.1 en texto
  nativo), coincide al segundo decimal para 2022 y 2021. Es la única afirmación de este registro
  con **verdadero**.
- **afirmaciones[8] alcantarillado (corregir, cita_fuera_de_contexto).** El `fragmento` ya cita el
  50,60 % literal de la ficha de país (el error de la vuelta anterior, que ponía 50,50 % como
  fragmento, está corregido). El doble valor del informe (50,50 %/50,60 %) y las dos fuentes
  oficiales que no coinciden (Plan Nacional de Saneamiento 51,0 %, Anexo 1 del BID 44,39 %) dejan
  la afirmación en **discutible**.
- **graficos[0] pérdidas de agua (bloqueaba).** Reemplazado por el cuadro oficial "Muy Grande" de
  ADERASA (Sedapal, Aguas Andinas, AySA, OSE), con nota explicando que EPM y EAAB no reportan el
  indicador. Sin objeción de mi parte.
- **Objeción al lote 6 (medios faltantes) y 8 (discrepancias.yaml).** Escribí los tres medios en
  `inbox/.../medios/` (no en `content/medios/`: así lo pide el encargo de esta corrida) y agregué
  `revision: {tier: publicado}` a `discrepancias.yaml`, que no lo tenía.
- **Objeciones al brief (dos observaciones del crítico sobre instrucciones que le dieron a él, no
  al lote).** No requieren acción del editor: el crítico ya verificó ambas premisas contra el
  documento primario y el investigador cargó lo que salió de esa verificación (el 2,06 es de OSE,
  no de "Uruguay" con más de un operador; la mejora en agua no facturada es mixta según el período
  y la definición). Las dejo consignadas en el `veredicto` de cada registro tal como quedaron.

## Un ítem del encargo que no pude verificar

El encargo de esta tarea menciona, entre lo que la ficha de OSE dice mal, la "desagregación por
actividad desde 2018". No encontré esa objeción ni en `critica.md` ni en `notas.md` de este lote
(que hablan de tres cosas: el 2,06 USD/m3, la muestra de 11 operadores y el 88,98 %/88,94 %). La
nota de `content/empresas/ose.yaml` sobre 2018 como "primer año en que las notas a los estados
financieros de OSE desagregan... por actividad" pertenece a la corrida de la serie histórica de
OSE, no a esta (BID/ADERASA), y verificarla exigiría releer balances de 2015-2017 que no abrí en
esta sesión. Por Regla 0 (no calificar ni corregir sin verificación propia) no propongo cambiar ese
campo: si hay evidencia de que está mal, debería salir de la corrida de la serie histórica de OSE,
con la misma fuente primaria a la vista.

## Corrección propuesta para `content/empresas/ose.yaml`

Tipo: `dato_erroneo` (tres campos, misma causa raíz: la ficha reprodujo lecturas del estudio de
Lentini y del informe de ADERASA que los documentos primarios no sostienen). Fuentes: las de
`analisis.yaml#0.afirmaciones[0]` y `[1]` (Lentini 2015, Cuadro 4 y Cuadro A1) y
`analisis.yaml#1.afirmaciones[5]` (ADERASA, ficha de país y sección de conclusiones).

1. **`comparaciones[0].valor_propio`** — de: `"Uruguay USD 2,06/m3, la tarifa más cara de la
   región (indicador de país, no solo OSE: en Montevideo el servicio de saneamiento lo cobra la
   Intendencia)"` — a: `"OSE (Uruguay) USD 2,06/m3, la tarifa más cara de la región; es un
   indicador del operador OSE, el único de la muestra en Uruguay según Lentini (2015), y por eso
   no incluye el saneamiento que cobra la Intendencia de Montevideo"` — motivo: Lentini (2015),
   Cuadro A1, identifica la muestra de Uruguay con un único operador de alcance nacional (OSE); la
   ficha decía lo contrario de lo que dice la fuente.
2. **`comparaciones[3].con` y `.valor_par`** — de: `"el promedio de la muestra de 11 operadores de
   América Latina y el Caribe"` / `"Promedio de la muestra USD 1,22/m3 (mínimo 0,39 USD/m3, máximo
   2,06 USD/m3)"` — a: `"los once promedios por país de una muestra de 66 operadores de América
   Latina y el Caribe (57 con dato de tarifa)"` / `"Promedio de los once promedios por país USD
   1,22/m3 (mínimo 0,39, el promedio de Argentina; máximo 2,06, el de Uruguay); por operador
   individual el promedio es USD 1,40/m3 y el máximo USD 2,35/m3, en Colombia"` — motivo: Lentini
   (2015), Cuadro 4, da esos tres estadísticos por país, no por operador; hay 66 operadores de 11
   países, no 11 operadores.
3. **`comparaciones[5].valor_propio`** — de: `"OSE (Uruguay): 88,98% de aguas residuales volcadas
   con tratamiento previo"` — a: `"OSE (Uruguay): 88,94 % en la ficha de indicadores y la tabla
   comparativa de ADERASA, 88,98 % en la sección de conclusiones por país del mismo informe"` —
   motivo: el informe de ADERASA (2024, datos 2022) da dos cifras distintas para el mismo dato; la
   ficha reproducía solo una, sin la salvedad.
4. **`resumen`** (párrafo "En comparaciones internacionales...") — mismo tipo de corrección,
   aplicada al texto corrido: quitar "esa cifra es de país, no solo de OSE, porque en Montevideo el
   saneamiento lo cobra la Intendencia" y "contra un promedio de USD 1,22/m³ en la muestra (mínimo
   USD 0,39/m³, máximo USD 2,06/m³, el propio Uruguay)" tal como están, y reemplazar por el texto
   corregido equivalente a los puntos 1 y 2; agregar la salvedad del 88,94 %/88,98 % donde el
   resumen cita "88,98% de las aguas residuales tratadas".

Nota: una vez promovidos `analisis.yaml#0` y `#1`, las `comparaciones[]` que salen de las mismas
notas (Lentini/BID y ADERASA) dejan de mostrarse por la regla del esquema de `content/empresas/`
("las comparaciones[] sueltas que salgan de la misma nota dejan de mostrarse"); igual dejo la
corrección de texto arriba por si el mantenedor prefiere aplicarla antes de esa promoción.

## Tier

- `analisis/ose/2020-06-01-bid-sector-agua-saneamiento-uruguay.yaml`: **publicado**. No queda
  ningún `bloquea` sin resolver; todas las calificaciones distintas de discutible tienen documento
  oficial en `dato_real.fuentes`; `resumen`+`veredicto` están en ~338 palabras.
- `analisis/ose/2024-11-01-aderasa-indicadores-2022.yaml`: **publicado**. No queda ningún `bloquea`
  sin resolver. Dejo en `revision.notas_internas` que falta, para una corrida futura, un gráfico de
  tarifas domésticas/comerciales de los 11 operadores (el informe solo nombra 8 de los 11 en el
  texto leído, así que no armo un gráfico con 3 etiquetas sin confirmar) y la tarea de bajar los
  datasets abiertos de OSE para reconstruir la facturación unitaria.
- `discrepancias.yaml#0` (BID vs. Lentini, tarifa media): **publicado**. Documento primario que
  decide, sin verbos de intención, mismo umbral que se aplicaría a cualquier medio.

## Umbral aplicado por igual

Apliqué la misma regla a las cifras favorables y desfavorables a OSE y a los dos organismos
analizados: el BID tiene una afirmación falsa (la 1,22/0,39/2,06) y ocho verdaderas; ADERASA tiene
ocho discutibles (por falta de documento independiente, no por error) y una verdadera. Ninguna
calificación depende de si el dato deja bien o mal a OSE: el endeudamiento (favorable) y las
pérdidas de agua (desfavorable) están sujetos a la misma exigencia de documento oficial
independiente, y ambas quedaron donde la evidencia las dejó (verdadero la primera, por tener
balance auditado cruzado; discutible la segunda, por no tenerlo).

## Cambios de forma

- `discrepancias.yaml`: agregado `revision: {tier: publicado}` (faltaba el campo).
- `analisis.yaml`: sin cambios de fecha ni de erratas más allá de lo ya listado arriba.

## Mensaje de commit propuesto

```
Análisis de terceros sobre OSE (BID 2020, ADERASA 2024/datos 2022): calificación afirmación por
afirmación, corrección del error del BID sobre la tarifa por operador, y tres medios estatales
faltantes [corrida 2026-09-08-analisis-ose-bid-aderasa]
```
