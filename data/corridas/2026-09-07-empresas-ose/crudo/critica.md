# Crítica — corrida 2026-09-07-empresas-ose

Modelo: **claude-opus-5 (1M de contexto)**. La regla 14 de `CLAUDE.md` reserva Opus para el rol de crítico y
esta corrida se lanzó en Opus: no hay diferencia entre lo que declara la tabla de modelos y lo que corrió, y el
experimento de modelos no afecta a este lote. El investigador declara `claude-sonnet-5` en `_investigacion`,
que es lo que la tabla le asigna a su rol.

Lote: `inbox/empresas/ose/2026-09-07/`
Registros revisados: **1** (una ficha de `empresas`), abierta por bloques: `creacion`, `que_hace`, `monopolio`
(alcance, 3 normas, 2 argumentos a favor, 2 en contra), `finanzas` (10 años × hasta 5 montos + segmentos),
`comparaciones` (3) y `fuentes`.

**Qué abrí en esta sesión con `pnpm fuente`** (no critico de memoria): los Estados Financieros de OSE de 2015,
2016, 2018, 2020, 2022, 2023 y 2024; la Ley 11.907 en IMPO; el artículo 47 de la Constitución en IMPO; las
cuatro notas de prensa del lote (la diaria, La República/LR21, Telenoche, El Observador); la nota de
REDES-AT; la Nota Técnica del BID; el informe de benchmarking de ADERASA. Además busqué en el corpus y en la
web contexto que el lote no trae. No abrí los balances de 2017, 2019 (no existe) ni 2021: sus cifras las
verifiqué contra las columnas comparativas de 2018, 2020 y 2022, que sí abrí.

**Estado mecánico.** `pnpm validar --inbox inbox/empresas/ose/2026-09-07`: **esquema 0 errores**,
**referencias 68 errores**, todos por medios inexistentes (`ose` ×64, `aderasa` ×2, `bid` ×1, `redes-org-uy`
×1). Como la etapa 2 falla, `pnpm validar:red` no llega a la etapa 5: **a hoy ninguna cita de este lote está
verificada por máquina**. Las que cito abajo las verifiqué a mano, una por una, y son literales; el editor no
debe leer "el lote está validado".

---

## Resumen: lo que bloquea

Tres cosas, y las dos primeras son la misma cosa vista desde dos lados.

1. **`monopolio.argumentos_en_contra` no contiene ningún argumento en contra del monopolio.** El primero es
   Álvaro Delgado diciendo que en Arazatí *"no hay ningún tipo de privatización"* — es decir, un funcionario
   negando estar en contra de la exclusividad estatal, publicado como si estuviera en contra de ella. El
   segundo no es un argumento: es una imputación de REDES-AT sobre quién hizo lobby en 2004, en palabras del
   adversario de esos actores. La ficha, tal como está, publicaría **cero** posiciones contrarias al diseño
   vigente sostenidas por alguien que efectivamente las sostiene, sobre una reforma que en 2004 tuvo 35 % de
   votos en contra y a la que se opuso el presidente en ejercicio y su partido. El esquema valida (hay un
   ítem en cada lista) y aun así el resultado es documentar un solo lado.
2. **`comparaciones[]` es asimétrica en la dirección opuesta**: tres filas, todas de precio, todas
   desfavorables ("la tarifa más cara de la región", "la más alta del grupo relevado" ×2). Los mismos dos
   documentos que el lote ya bajó traen los indicadores de servicio de OSE (95,19 % de acceso, 23,99 h de
   continuidad, 88,98 % de aguas residuales tratadas) y el promedio de la muestra (1,22 USD/m³), que no están.
   Una ficha que dice tres veces "es caro" y ninguna "y esto es lo que entrega" no es neutral tampoco.
3. **La nota de 2019 publica una atribución causal sacada de un documento que el propio lote declara no haber
   leído**, y la usa para omitir el segmento que carga con el 100 % del resultado del año. El desglose está en
   la misma tabla que el lote ya cita: no hace falta el documento no leído.

Y una cuarta que no bloquea pero es el hallazgo más útil de esta revisión: **los tres huecos de
`deuda_financiera` (2022, 2023, 2024) no son huecos.** Las tres cifras están en una tabla de cuatro renglones,
literal y contigua, en los balances de 2023 y 2024 que el lote ya tiene en el corpus. Ver **(c)**.

---

## (a) Regla 0: los dos lados, y por qué acá faltan los dos

`content/empresas` dice que "un monopolio lleva argumentos a favor y en contra con el mismo esfuerzo, cada uno
en palabras de quien lo sostiene y con fuente". El lote cumple la forma y no el fondo, y conviene ser preciso
sobre en qué dirección falla, porque falla en las dos.

**El lado "en contra" está vacío.**

- `argumentos_en_contra[0]` (Delgado, Telenoche 17/11/2022). Verifiqué la nota: la cita es literal. Pero lo
  que Delgado sostiene es que Arazatí **no** viola la exclusividad estatal: *"la potabilización tal como está
  prevista en el marco normativo lo hace la empresa"*. Publicar eso bajo el rótulo "argumentos en contra del
  monopolio" le atribuye a un dirigente nombrado una posición que él niega tener, en la misma frase que se
  cita. Es un problema editorial y de riesgo: no hay ninguna fuente que lo ponga en contra del artículo 47.
- `argumentos_en_contra[1]` (REDES-AT, 30/11/2004). Abrí la nota entera. Es un comunicado de prensa de la
  organización que impulsó el plebiscito, escrito en primera persona del movimiento (*"La victoria del
  plebiscito del agua fue una verdadera victoria social"*, *"El auspicioso resultado del plebiscito…"*). El
  `texto` del argumento no enuncia una posición: enuncia que *"las empresas privatizadoras… así como sectores
  empresariales conservadores (latifundistas, forestales, arroceros) realizaron un fuerte lobby político y
  mediático contra la reforma"*. Eso es una imputación de conducta a un conjunto identificable de actores
  económicos, hecha por su adversario en la disputa, publicada por el sitio como si fuera el argumento de esos
  actores. Además de no ser un argumento, es exactamente el tipo de afirmación que el artículo 336 del Código
  Penal vuelve costosa cuando el respaldo es una sola fuente parte interesada.

**La explicación alternativa, que hay que dejar escrita.** `notas.md` la ofrece y es honesta: la reforma de
2004 tiene un consenso político más amplio y sostenido que el monopolio de ANCAP, y por eso encontrar
posiciones contrarias cuesta más. Es plausible y no la descarto de plano. Pero no sobrevive al dato: la
reforma se aprobó con 64,58 % — hay 35 % del electorado del otro lado, y el gobierno en ejercicio (Batlle,
Partido Colorado) hizo campaña contra ella. `consultas.jsonl` muestra **una** búsqueda web para ese lado
(`plebiscito agua 2004 Uruguay campania por el No argumentos en contra de la reforma constitucional`) y
**una** para el lado contemporáneo (`Uruguay monopolio estatal agua OSE critica ineficiencia participacion
privada economistas`), ninguna de las dos con resultado usado. La lectura correcta no es sesgo de selección:
es que la búsqueda de un lado se detuvo en la primera consulta y la del otro no. Se arregla buscando, no
discutiendo.

**Pistas concretas, para que la acción sugerida sea ejecutable** (NO las abrí con `pnpm fuente`; son leads de
buscador, hay que abrirlas antes de citarlas):

- `https://www.lr21.com.uy/politica/156389-contrario-al-plebiscito-del-agua` — La República, 2004. Mismo medio
  que el lote ya usa, así que el editor no necesita crear un medio nuevo.
- `https://www.infobae.com/2004/11/16/152224-uruguay-intenta-frenar-la-estatizacion-del-agua/` — Infobae ya
  existe en `content/medios/` (`grupo-infobae`).
- La posición institucional del Poder Ejecutivo de Batlle sobre el alcance de la reforma (si se aplicaba o no
  a las concesiones vigentes) debería estar en IMPO como decreto de fines de 2004 y en las versiones
  taquigráficas del Parlamento. Es el documento previsible de este bloque.
- Del lado contemporáneo, hay actores identificables que defienden participación privada en infraestructura de
  agua y que el lote ya rozó sin citar: Raúl Montero, presidente de OSE, expuso el proyecto ante la Junta
  Departamental de San José (lo cuenta la propia nota de LR21 que el lote cita); la Cámara de la Construcción
  presentó obras durante la emergencia (lo dice la Nota 11 del balance 2023, ya leído); y `content/medios/`
  ya tiene `ced` (Centro de Estudios para el Desarrollo), que publica sobre empresas públicas.

**El lado "a favor" también es flojo, y hay que decirlo con el mismo rigor.** `argumentos_a_favor[0]` no es
alguien sosteniendo un argumento: es el texto de la Constitución, con `quien: Constitución de la República`. Y
`argumentos_a_favor[1]` es, otra vez, sobre Arazatí, no sobre el diseño. Si el editor quiere un argumento a
favor bien sostenido, la propia OSE lo enuncia en la Nota 1 de su balance 2024, que ya está en el corpus: *"La
orientación de la Entidad es fundamentalmente higiénica, anteponiéndose las razones de orden social a las de
orden económico."* (`pnpm fuente <balance 2024> --buscar "contralor higiénico"`).

**Diagnóstico de fondo, y es una recomendación estructural:** los cuatro argumentos del lote son sobre el
litigio de Arazatí, no sobre el diseño del monopolio. El artículo 47 y el proyecto Arazatí son dos preguntas
distintas —"¿debe el agua ser exclusivamente estatal?" y "¿este contrato viola esa regla?"— y meterlas en el
mismo par de listas produce el absurdo de tener a Delgado como crítico del monopolio. Recomiendo separar:
`argumentos_a_favor` / `argumentos_en_contra` para el diseño (2004 y hoy), y la disputa de Arazatí en
`hitos[]` y en `alcance`, con las dos posiciones nombradas.

---

## (b) Los números contra los documentos

Recalculé, uno por uno, los diez resultados del ejercicio, las nueve sumas de impuestos, las siete deudas
financieras y los veinticuatro segmentos, contra las citas y contra el tipo de cambio que declara cada
balance. **Salvo lo que digo abajo, la aritmética del lote está bien.** Es un lote cuidadoso con las cifras y
el editor debería saberlo tanto como debería saber lo que falta.

| Año | Resultado ($) | TC cierre | USD ficha | USD recalculado |
|---|---|---|---|---|
| 2015 | −175.052.460 | 29,948 | −5,8 | −5,85 ✓ |
| 2016 | 1.264.028.115 | 29,34 | 43,1 | 43,08 ✓ |
| 2017 | 2.266.527.080 | 28,807 | 78,7 | 78,68 ✓ |
| 2018 | 1.211.342.962 | 32,406 | 37,4 | 37,38 ✓ |
| 2019 | 733.773.923 | 37,308 | 19,7 | 19,67 ✓ |
| 2020 | 397.952.432 | 42,34 | 9,4 | 9,40 ✓ |
| 2021 | 3.798.839.182 | 44,695 | 85,0 | 85,00 ✓ |
| 2022 | 4.053.021.641 | 40,071 | 101,1 | 101,15 ✓ |
| 2023 | 2.951.081.374 | 39,022 | 75,6 | 75,63 ✓ |
| 2024 | 2.067.399.594 | 44,066 | 46,9 | 46,92 ✓ |

Las nueve sumas de `impuestos_pagados` dan exactamente lo que declara el campo (verifiqué las seis líneas de
cada año). Las siete `deuda_financiera` cargadas coinciden con el renglón "Total deudas financieras" de la
Nota 5.7 de cada balance. Los 24 segmentos suman el total del año en los siete años en que están.

**Lo que sí falla en los números:**

1. **El signo del resultado de 2015 no está en su cita.** La cita elegida es la fila `Cifras modificadas al
   31.12.15 47.361.102.637 (14.761.195.560) (32.774.959.537) 175.052.460`, y en esa tabla el 175.052.460 va
   **sin paréntesis** (la tabla usa signos invertidos: el patrimonio también va en negativo). Un lector que
   abra la fuente no puede saber que es pérdida. La cita que sí lo dice ya está en el lote, en el año
   siguiente: la Nota 10.5 de 2016 trae `Resultado neto 1.264.028.115 (175.052.460)`. Mover o duplicar esa
   fuente al 2015.
2. **OSE se contradice a sí misma sobre el tipo de cambio de 2015 y el lote no lo dice.** El balance 2015
   declara *"$ 29,948 por dólar al 31 de diciembre de 2015"*; el balance 2016 declara, para la misma fecha,
   *"$ 24,948 por dólar al 31 de diciembre de 2015"*. El lote usó 29,948, que es la cifra del balance del
   propio ejercicio y la consistente con la serie (el balance 2017 confirma 29,34 para 2016). La elección es
   correcta; lo que falta es una línea en `nota` que la explique, porque la ficha va a mostrar dos citas de la
   misma empresa con dos números distintos para el mismo día.
3. **El concepto de `impuestos_pagados` describe mal lo que suma.** Dice "suma de los conceptos que informa la
   Nota 10.3", pero esa nota informa además un bloque "En enero del año siguiente se pagó" (verificado en
   2015, 2018 y 2020) que el lote **no** suma — correctamente, pero un lector que rehaga la cuenta llega a
   otro número. Además el total mezcla impuestos (IP, IRAE, IVA) con tasas (Tribunal de Cuentas, URSEA,
   Sistema Postal Universal). Una frase: "impuestos y tasas del ejercicio, sin los anticipos pagados en enero
   siguiente".
4. **Contexto omitido que atraviesa toda la serie: el resultado de OSE lo manda la diferencia de cambio.** La
   Nota 11 del balance 2015, que el lote leyó, dice: *"El resultado del ejercicio 2015 arrojó una pérdida de
   aproximadamente $ 465.000.000. No obstante, el resultado operativo representó una ganancia de
   aproximadamente $ 300.000.000… A nivel del resultado del ejercicio el impacto de la pérdida neta por
   diferencia de cambio fue de $ 1.626 millones."* Con la deuda casi toda en dólares y UI, el "cómo le va a
   tu empresa" que va a leer el dueño está dominado por la cotización, no por la gestión. Una línea en el
   `resumen` del editor, con esa cita, cambia la lectura de los diez años.
5. **Lo que el Estado le saca a OSE sin que aparezca en `transferencias_al_estado`.** Los balances traen, como
   deducciones de ingresos, las bonificaciones sociales: en 2015 `Bonificación asentamientos (497.461.962)`,
   `Bonificación MIDES (106.653.777)`, `Bonificaciones Maldonado (176.027.952)`; en 2020 `Bonificación
   asentamientos (216.690.165)`, `Bonificación MIDES (216.987.180)`, `Bonificación Comercial (154.476.647)`,
   `Bonificación COVID-19 (6.235.220)`. Son política social financiada con tarifa, y en una ficha escrita para
   el contribuyente pesan tanto como una transferencia. No caben en ningún campo del esquema; caben en el
   `resumen` del editor. Es un aviso, no una objeción.

---

## (c) Los huecos de `deuda_financiera` no son huecos — `documento_previsible`

El lote declara tres años sin deuda financiera (2022, 2023, 2024) por fallas de extracción de tabla, y
describe bien el problema: en el balance 2022 la Nota 5.7 extraída trae solo la tabla al 31/12/2021, y en el
de 2024 el "Resumen de Pasivos Financieros" sale con las etiquetas de fila desplazadas. **Verifiqué las dos
cosas y son ciertas.** Y aun así los tres números están, literales y contiguos, en documentos que el lote ya
tiene bajados.

En la **Nota 8.1 (gestión del riesgo de capital)** de los balances 2023 y 2024 hay una tabla de cuatro
renglones con la deuda financiera de los cuatro ejercicios:

Balance 2023 (`pnpm fuente https://www.ose.com.uy/sites/default/files/2026-04/OSE_2023_EEFF_Separados.pdf
--buscar "Deuda neta sobre patrimonio"`):

> La proporción de deuda neta de efectivo y equivalentes sobre patrimonio al fin de cada ejercicio se expone a
> continuación: 2023 2022 Deuda (i) 16.823.188.612 15.954.923.019 Efectivo y equivalentes -731.553.912
> -1.539.770.435 Deuda neta 16.091.634.700 14.415.770.435 Patrimonio (ii) 52.849.455.899 49.987.714.211 Deuda
> neta sobre patrimonio 30% 29% (i) Deuda es definida como deuda financiera neta de corto y largo plazo.

Balance 2024 (misma búsqueda, carácter 87.377):

> 2024 2023 Deuda (i) 20.314.931.678 16.823.188.612 Efectivo y equivalentes (1.731.486.607) (731.553.912)
> Deuda neta 18.583.445.071 16.091.634.700 Patrimonio (ii) 54.962.439.075 52.849.455.897 Deuda neta sobre
> patrimonio 34% 30%

De ahí salen, al tipo de cambio de cierre que el lote ya usa: **2022 → $ 15.954.923.019 = USD 398,2 M**;
**2023 → $ 16.823.188.612 = USD 431,1 M**; **2024 → $ 20.314.931.678 = USD 461,0 M**.

Hice dos controles antes de afirmarlo, porque el rótulo cambia ("Total deudas financieras" en la Nota 5.7 de
2015-2021, "Deuda (i)" en la Nota 8.1 de 2023-2024) y un cambio de perímetro arruinaría la serie:

- **Cuadra con la otra tabla del mismo documento.** El "Resumen de Pasivos Financieros" del balance 2024, ese
  cuyas etiquetas están desplazadas, se puede reconstruir por aritmética: sus subtotales corriente + no
  corriente dan 1.485.734.783 + 15.337.453.830 = 16.823.188.613 para 2023 y 2.465.650.025 + 17.849.281.653 =
  20.314.931.678 para 2024 — los mismos números de la Nota 8.1, con un peso de redondeo. La cautela del
  investigador de no arriesgar una cita con la etiqueta corrida era correcta; el número no dependía de esa
  tabla.
- **Cuadra con la serie.** 2021 (Nota 5.7) USD 384,8 → 2022 USD 398,2 → 2023 USD 431,1 → 2024 USD 461,0. En
  pesos hay una caída de 2021 a 2022 que se explica por la apreciación del peso (TC 44,695 → 40,071) sobre una
  deuda mayoritariamente en dólares y UI.

**Severidad: `corregir`, tipo `documento_previsible`.** No se cierra el lote con tres años en blanco cuando el
documento está bajado y la tabla es citable. El mismo criterio que se le exigiría a la ficha de cualquier otra
empresa.

**Los otros dos huecos, en cambio, son reales y el lote los describió bien.** Verifiqué que la expresión
"Rentas Generales" **no aparece en absoluto** en el texto extraído de los balances de 2021 ni de 2022: el
hueco de `transferencias_al_estado` de esos dos años no es falta de búsqueda. Lo que sí falta es haber
buscado fuera de OSE: el brief pedía Rendición de Cuentas del MEF, `ain.gub.uy` y la API de
`catalogodatos.gub.uy`, y `consultas.jsonl` no registra una sola consulta a ninguno de los tres. Las
versiones a Rentas Generales de las empresas públicas son un anexo típico de la Rendición de Cuentas
(Contaduría General de la Nación / MEF): es el documento previsible de ese hueco, y también el que
resolvería `capitalizaciones_del_estado`.

---

## (d) Segmentos

`segmentos[]` está bien cargado en siete años y suma el total en todos. Tres objeciones.

1. **Falta "Otros" en 2018 y en 2019, y en 2019 eso deforma el año entero.** La tabla que el lote cita para
   2019 (balance 2020, `--buscar "253.841.956"`, carácter 96.863) es esta:

   > Agua Potable Alcantarillado Otros Total / Ingresos de explotación 12.242.536.394 2.191.854.695 8.332.713
   > 14.442.723.802 / … / Resultado de explotación 1.297.852.146 (102.225.169) 6.552.105 1.202.179.082 / … /
   > Otros resultados 164.266.145 28.635.255 728.287.262 921.188.662 / Resultado neto 253.841.956
   > (254.907.400) 734.839.367 733.773.923

   Sin la columna "Otros", la página va a dejar prender Agua Potable (+253,8) y Alcantarillado (−254,9), que
   suman −1,1, mientras el total del año dice +733,8. El lector ve una ficha que no cierra. En 2018 pasa lo
   mismo en chico: "Otros" = 98.131, omitido sin explicación (el lote lo explica para 2019 y no para 2018).
2. **La justificación de esa omisión se apoya en un documento que el lote declara no haber leído.** La `nota`
   de 2019 dice que el segmento "incluye mayormente un ajuste contable de $ 728.287.262 por corrección del
   Impuesto a la Renta de 2018 y 2019 (ver Nota 30 de los Estados Financieros de 2021 de OSE, **no leída en
   esta corrida**)". Dos problemas: la ficha publicaría una atribución causal sin fuente leída, y publicaría
   la frase "no leída en esta corrida", que es lenguaje de nuestro proceso, no información para el lector. Y
   es innecesario: la tabla de arriba, que el lote ya cita, separa sola los dos componentes — el resultado de
   explotación de "Otros" fue 6.552.105 y los "otros resultados" 728.287.262. Con eso se carga el segmento y
   se pone una `nota` de una línea que dice de dónde viene el grueso, sin afirmar la causa. Si el editor
   quiere afirmar la causa, que abra la Nota 30 de 2021: es un documento previsible más.
3. **Falta el descargo del propio documento sobre qué significan estos segmentos.** Al pie de la misma tabla,
   el balance dice: *"La asignación de los resultados financieros a las actividades de agua y alcantarillado,
   es en función de los ingresos de explotación del ejercicio"* y *"Otros resultados incluye resultados
   diversos y extraordinarios, los mismos se distribuyen en base a los ingresos de explotación del
   ejercicio"*. O sea: la pérdida de Alcantarillado es, en buena parte, un prorrateo. En 2020 el resultado de
   **explotación** de Alcantarillado fue −52,8 M$ y el **neto** −188,0 M$; la diferencia es financiero y otros
   resultados asignados por regla de tres. Sin esa línea, el gráfico de segmentos afirma más de lo que afirma
   el documento. Una oración en la `nota` de cada año, con la cita al pie, lo arregla.

---

## (e) Comparaciones

Las tres citas son literales y las verifiqué en los documentos originales. Las dos fuentes son quien hizo la
comparación (BID y ADERASA), no un tercero que la repitió: en eso el lote está bien y hay que decirlo. Cuatro
objeciones.

1. **La comparación del BID le atribuye a OSE una cifra que el documento le atribuye a Uruguay.**
   `valor_propio` dice "Uruguay (OSE) USD 2,06/m3". El texto del BID (`--buscar "2,06 USD"`, carácter 88.944)
   define el indicador como *"la relación entre la facturación anual por concepto de todo servicio (agua y
   saneamiento) y el total de los metros cúbicos facturados"*, y dos párrafos antes el mismo documento aclara
   que en Montevideo el saneamiento lo cobra la Intendencia, no OSE. Es una cifra de país, con dos
   prestadores adentro. Sacar "(OSE)".
2. **Falta el promedio de la muestra, que está en la misma oración.** *"la tarifa media promedio de los
   operadores analizados es de 1,22 USD/m3 (figura II-7), con un valor mínimo de 0,39 USD/m3 y uno máximo
   2,06 USD/m3"*. Sin el promedio, "la más cara" no tiene escala.
3. **Falta la contracara que el propio documento pone al lado**, y es lo que vuelve la comparación honesta:
   *"La OSE cuenta con una tarifa más económica destinada a la población de menores ingresos… Implica un
   subsidio sobre los consumos menores a 15 m3/mes, donde la tarifa final del servicio de agua potable
   corresponde a un valor fijo entre 22 % y 36 % de la tarifa de agua potable residencial asociada"*.
4. **Asimetría del bloque, con solución dentro del mismo PDF.** El informe de ADERASA que el lote ya bajó trae
   una sección por país (`--buscar "bajo responsabilidad de OSE"`): *"El 95.19% de la población bajo
   responsabilidad de OSE, tuvo acceso al agua potable con una continuidad de 23.99 horas y un nivel de
   micromedición mayor a 92%. Es importante destacar que, el 88.98% de las aguas residuales volcadas de OSE
   recibió tratamiento previo."* Y trae los pares con el mismo formato: AyA (Costa Rica) 9,88 h de
   continuidad y 70,97 % de pérdidas; EPMAPS (Ecuador) 23,60 h, 28,92 % de pérdidas y 1,87 % de aguas
   residuales tratadas. Con eso se arma al menos una `comparacion` de servicio, de la misma fuente, del mismo
   año y con el mismo método. Si el editor decide no agregarla, que lo justifique por escrito, porque hoy la
   ficha compara precio tres veces y calidad ninguna.

**Presentación:** las dos comparaciones que quedan dicen cosas que parecen contradictorias — "la tarifa más
cara de la región" (2,06 USD/m³, ~2015, agua + saneamiento, país) y "la segunda más alta" (1,27 USD/m³, 2022,
doméstica 15 m³, operador) — y ningún lector va a reconciliarlas solo. Van con una nota de una línea que diga
que son métricas, años y universos distintos, o el editor elige una sola.

---

## (f) Presentación para el lector

No veo la página, pero los datos dicen cómo va a quedar.

- **`monopolio.alcance` es un párrafo de 17 líneas** que cuenta la historia de Uragua, el proyecto Arazatí,
  quién dice que es inconstitucional y qué responde el gobierno. Es un campo sin `fuentes` propias: todo lo
  que diga ahí va sin respaldo citable, incluidas afirmaciones sobre un gobierno nombrado ("Desde 2020, el
  gobierno de Lacalle Pou impulsó el proyecto…"). Debe quedar en tres o cuatro oraciones sobre qué está
  reservado por ley; el resto se reparte entre `normas`, `argumentos_*` e `hitos`.
- **Seis `concepto` traen párrafos donde va una frase** (2015 resultado e impuestos, 2017 resultado, 2019
  resultado y deuda, 2023 transferencias). `concepto` es la celda que la página muestra al pie del monto.
- **Seis `nota` publican lenguaje de nuestro pipeline** (2017, 2019, 2021, 2022, 2023, 2024): "tal como los
  devolvió el extractor de texto", "no se encontró en el texto extraído", "ver verificacion_manual en
  notas.md", "no leída en esta corrida". El lector no sabe qué es un extractor ni tiene `notas.md`. Lo que
  corresponde decirle es de dónde sale la cifra ("de la columna comparativa 2017 de la Nota 10.5 del balance
  2018") o que el dato no está.
- **La ficha no tiene `hitos[]`**, y es el campo que el esquema agregó porque un lector pidió condensar en un
  vistazo lo que en prosa ocupa párrafos. Se puede armar entero con fuentes que el lote **ya leyó**:
  1952 creación (Ley 11.907); 2000 ampliación de cometidos (Ley 17.277, citada en la Nota 1); 31/10/2004
  reforma constitucional (IMPO, art. 47); 01/06/2005 rescisión de la concesión de Uragua (Res. 760/05,
  balance 2015); 23/09/2005 Ley 17.902, Unidad de Gestión Desconcentrada de Maldonado (balance 2015); 2018
  primer año con resultado desagregado por actividad (balance 2018); 2022 proyecto Neptuno/Arazatí (la
  diaria, LR21, Telenoche); 19/06/2023 emergencia hídrica por Decreto 177/023 hasta el Decreto 253/023
  (Nota 11 del balance 2023). Ocho hitos, cero documentos nuevos.
- **Fuentes repetidas.** El mismo PDF aparece hasta 64 veces, y en ocho años la nota de cotización del dólar
  entra como **segunda fuente del `resultado_ejercicio`** solo para cargar el tipo de cambio. Es el patrón que
  el rol manda objetar: una línea agrupa. Sugerencia: el tipo de cambio va una vez por año (en `nota` o en la
  fuente del resultado), no como fuente aparte. Lo que se decida acá hay que aplicarlo también a
  `content/empresas/ancap.yaml`, que tiene el mismo patrón: dos fichas de la misma colección con criterios
  distintos de citado es peor que cualquiera de los dos criterios.
- **`fuentes: []`** (generales, vacío) y **`imagenes` ausente**. Ninguno bloquea. Sobre imágenes, la única vía
  es `pnpm imagen` con licencia libre; fotos de prensa no.
- **`precios_vs_paridad` omitido: es la decisión correcta**, y mejor que la de ANCAP (que lo tiene con
  `series: []`). El agua no es un bien transable y no tiene paridad de importación. Si el editor quiere el
  contrapunto regulatorio, el organismo es URSEA —que regula agua y ya existe como
  `content/medios/ursea.yaml`— y va como `comparaciones` o como fuente general, no forzado en este campo.

---

## Objeciones por campo

### `creacion` — 1952-12-19, Ley N° 11.907
- severidad: **aviso**
- tipo: sin_objecion
- objecion: verificado. La cita de IMPO es literal (*"Créase, como servicio descentralizado del Ministerio de
  Obras Públicas…"*) y el balance 2024 la confirma. Único detalle: la URL de IMPO
  `/bases/leyes/11907-1952/1` devuelve **solo el artículo 1** (665 caracteres), no la ley; sirve para esta
  cita y para ninguna otra.
- accion_sugerida: ninguna.

### `tipo: servicio_descentralizado`
- severidad: **aviso**
- tipo: sin_objecion
- objecion: correcto y doblemente documentado (la ley y la Nota 1 del balance 2024, ambas citadas). El editor
  debe saber que el docstring del propio esquema pone a OSE como ejemplo de `empresa_publica` y que ANCAP
  quedó como `ente_autonomo`: si la página agrupa por `tipo`, OSE va a aparecer sola en su categoría. La
  norma manda sobre el docstring.
- accion_sugerida: mantener `servicio_descentralizado`; si molesta en la UI, se arregla en la UI.

### `que_hace` + `que_hace_fuentes`
- severidad: **corregir**
- tipo: cita_fuera_de_contexto
- objecion: el texto afirma que OSE puede *"proveer agua sin potabilizar a terceros cuando hay excedente"*,
  pero la cita del balance se corta en el literal e). El literal f) —que es exactamente eso— está en la línea
  siguiente del mismo documento, y hay un g) que la ficha ignora y que es información para el dueño.
- cita_de_contexto: *"f) Podrá proveer a terceros a título oneroso, el suministro de agua sin potabilizar para
  ser destinada a finalidades diversas del consumo humano, siempre que la disponibilidad del recurso natural
  resulte excedentaria… g) Podrá construir o adquirir ya construidos y enajenar a título oneroso a terceros
  dentro y fuera del país, ingenios para la potabilización de aguas y para el tratamiento de efluentes
  cloacales cuya tecnología de fabricación le pertenezca."* — balance 2024, `--buscar "contralor higiénico"`.
- accion_sugerida: extender la cita hasta g) y agregar el g) al `que_hace`.

### `que_hace_fuentes[1]` y `monopolio.normas[0]` — artículo 47
- severidad: **corregir**
- tipo: riesgo_legal (precisión normativa)
- objecion: dos cosas menores y comprobables. (1) El lote llama "inciso 3" a lo que el artículo numera como
  **3)**, mientras la nota de IMPO dice que lo agregado en 2004 fue "el inciso segundo": son dos convenciones
  distintas y la ficha va a mezclarlas. (2) Las fuentes de IMPO llevan `fecha: 2004-10-31` sobre una página
  cuya fecha de publicación es 02/02/1967.
- cita_de_contexto: *"La redacción de este artículo fue dada por la Reforma Constitucional, aprobada por
  plebiscito de fecha 8 de diciembre de 1996. El inciso segundo fue agregado por la Reforma Constitucional,
  aprobada por plebiscito de fecha 31 de octubre de 2004."* — https://www.impo.com.uy/bases/constitucion/1967-1967/47
- accion_sugerida: escribir "artículo 47, numeral 3), texto incorporado por la reforma aprobada en el
  plebiscito del 31 de octubre de 2004", y dejar la nota de IMPO como respaldo de la fecha.

### `monopolio.alcance`
- severidad: **corregir**
- tipo: presentacion (+ afirmaciones sin fuente)
- objecion: ver **(f)**. 17 líneas de narrativa, con atribuciones de posición a un gobierno y a
  organizaciones, en un campo que el esquema no acompaña de `fuentes`.
- accion_sugerida: reducir a qué está reservado por ley (art. 47 + Ley 11.907/17.277 + el hecho de que hubo
  una concesión en Maldonado rescindida en 2005) y mover el resto a `normas`, `argumentos_*` e `hitos`.

### `monopolio.normas[1]` — Ley 11.907 y Ley 17.277
- severidad: **corregir**
- tipo: contexto_omitido
- objecion: la norma se enuncia como "cometidos y facultades", pero su única fuente es la página de IMPO con
  el artículo 1, cuya cita no dice nada de cometidos; y la Ley 17.277 no tiene ninguna fuente.
- accion_sugerida: usar la Nota 1 del balance 2024 (que enumera a→g y nombra las dos leyes) o abrir en IMPO
  los artículos de cometidos y la Ley 17.277.

### `monopolio.normas[2]` — concesión a Uragua S.A.
- severidad: **corregir**
- tipo: riesgo_legal
- objecion: la rescisión está impecablemente documentada por el balance 2015 (Res. 760/05). Lo que **no** está
  documentado es la composición accionaria que el lote afirma en `alcance` ("participada por la española Aguas
  de Bilbao y la francesa Suez Lyonnaise des Eaux"): su única fuente es una **columna de opinión firmada** de
  El Observador, que además escribe mal el nombre de la empresa (*"Suez Lyonnese Des Aux"*) y resume el
  desenlace como *"Estas empresas vendieron sus activos y se fueron del país"*, mientras el balance describe
  una rescisión por incumplimiento y un acuerdo transaccional con traspaso de activos a OSE.
- cita_de_contexto: *"El 30 de setiembre de 2005, se suscribió un Acuerdo Transaccional entre OSE y URAGUA
  S.A., a través del cual ambas partes renunciaron a todas las acciones administrativas y judiciales, y se
  determinaron los activos recibidos por aquélla…"* — balance 2015, carácter 16.684.
- accion_sugerida: sacar la composición accionaria o respaldarla con documento; quedarse con la versión del
  balance para el desenlace.

### `monopolio.argumentos_a_favor[0]` — Constitución
- severidad: **corregir**
- tipo: cita_fuera_de_contexto
- objecion: el `texto` afirma que el servicio "debe anteponer las razones de orden social a las de orden
  económico". Es verdad y está en el artículo 47 —numeral 1), literal d)— pero **no está en la cita
  adjunta**, que solo trae las dos primeras oraciones del inciso.
- cita_de_contexto: *"d) el principio por el cual la prestación del servicio de agua potable y saneamiento,
  deberá hacerse anteponiendo las razones de orden social a las de orden económico."* — IMPO, art. 47.
- accion_sugerida: agregar esa cita, y considerar reemplazar el `quien: Constitución` por alguien que sostenga
  el argumento (la propia OSE lo enuncia en la Nota 1 de su balance 2024).

### `monopolio.argumentos_a_favor[1]` — CNDAV y FFOSE
- severidad: **aviso**
- tipo: contexto_omitido
- objecion: las dos citas son literales y las fuentes son de grupos distintos (`cooperativa-la-diaria` y
  `reg-sa`), así que como argumento está bien sostenido. Dos cosas para el editor: (1) es un argumento sobre
  Arazatí, no sobre el diseño del monopolio; (2) la nota de la diaria está tras muro de registro y solo se
  extraen 1.352 caracteres — la cita usada está en la parte libre, pero el resto del argumento no es
  verificable sin cuenta.
- accion_sugerida: ninguna obligatoria; si se separa Arazatí del diseño (ver **(a)**), este ítem se mueve.

### `monopolio.argumentos_en_contra[0]` — Álvaro Delgado
- severidad: **bloquea**
- tipo: riesgo_legal / asimetria
- objecion: ver **(a)**. Le atribuye a un dirigente nombrado una posición contraria al monopolio que la propia
  cita desmiente.
- cita_de_contexto: *"El secretario de la Presidencia, Álvaro Delgado, respondió a las críticas sobre el
  proyecto Arazatí y aseguró que no hay 'ningún tipo de privatización'."* — Telenoche, 17/11/2022.
- accion_sugerida: sacarlo de `argumentos_en_contra`. Va como posición del gobierno dentro de la disputa por
  Arazatí (en `alcance` acotado o en `hitos`), y el lugar queda libre para un argumento real.

### `monopolio.argumentos_en_contra[1]` — REDES-AT sobre el lobby de 2004
- severidad: **bloquea**
- tipo: riesgo_legal / asimetria
- objecion: ver **(a)**. No es un argumento, es una imputación de conducta a un conjunto identificable de
  actores económicos, hecha por la organización que impulsó el plebiscito, publicada como si fuera la posición
  de esos actores.
- cita_de_contexto: *"La victoria del plebiscito del agua fue una verdadera victoria social. La CNDAV
  constituye un amplio abanico de organizaciones sociales y políticas enfrentadas a la concepción mercantilista
  del agua."* — https://www.redes.org.uy/2004/11/30/uruguay-decision-soberana-por-el-agua-mas-del-60-dijo-si/
- accion_sugerida: sacarlo. Si el editor quiere conservar el dato del lobby, va como línea descriptiva
  atribuida explícitamente a REDES-AT, en `hitos` del plebiscito, y **junto** con la posición de quienes
  hicieron campaña por el No, en sus palabras.

### `finanzas` — `resultado_ejercicio` (10 años)
- severidad: **corregir** (solo 2015)
- tipo: cita_fuera_de_contexto
- objecion: los diez valores y las diez conversiones son correctos (tabla en **(b)**). En 2015 la cita elegida
  no permite ver que el número es una pérdida.
- accion_sugerida: usar como fuente del 2015 la Nota 10.5 del balance 2016, que ya está en el lote y trae
  `(175.052.460)` entre paréntesis.

### `finanzas` — `impuestos_pagados` (9 años; falta 2019)
- severidad: **corregir**
- tipo: contexto_omitido
- objecion: las nueve sumas son exactas. El `concepto` no dice que quedan fuera los anticipos "pagados en
  enero" del ejercicio siguiente que la misma nota informa, ni que el total mezcla impuestos con tasas.
- accion_sugerida: una frase de `concepto` por año, igual en los nueve.

### `finanzas` — `deuda_financiera` (7 años; faltan 2022, 2023, 2024)
- severidad: **corregir**
- tipo: documento_previsible
- objecion y cita: ver **(c)**. Las tres cifras están en la Nota 8.1 de los balances 2023 y 2024.
- accion_sugerida: cargar $ 15.954.923.019 (2022), $ 16.823.188.612 (2023) y $ 20.314.931.678 (2024) con la
  cita de la Nota 8.1 y un `concepto` de una frase que diga que la etiqueta del documento es "Deuda … deuda
  financiera neta de corto y largo plazo" y que coincide con la suma corriente + no corriente del Resumen de
  Pasivos Financieros.

### `finanzas` — `transferencias_al_estado`
- severidad: **corregir**
- tipo: riesgo_legal (afirma más que la fuente) + presentacion
- objecion: el `concepto` de 2023 dice "Crédito autorizado… **depositado** en la cuenta en pesos del Tesoro
  Nacional". Los dos lugares donde el balance lo cuenta dicen otra cosa: la Nota 10.5 dice *"se autorizó un
  crédito por la suma de $ 23:400.000, a efectos de ser depositado"* y la Nota 11 dice *"Se dispuso transferir
  $ 23.400.000 a Rentas Generales (Expediente 819/2023)"*. Ninguna de las dos afirma que se ejecutó. Además el
  `concepto` son cuatro líneas donde va una frase.
- accion_sugerida: "Crédito de $ 23:400.000 autorizado por Resolución de Directorio 627/2023 para transferir
  al Tesoro, con destino a agua embotellada durante la emergencia hídrica", y el resto a `nota`. Y agregar, en
  el `resumen` o en la `nota`, que es la **única** transferencia a Rentas Generales de todo el período
  2015-2024, para que no se lea como un flujo habitual: los años 2015 a 2018, 2020 y 2024 tienen constancia
  expresa de que no hubo, y 2019, 2021 y 2022 quedan sin dato.

### `finanzas` — `capitalizaciones_del_estado` (vacío en los 10 años)
- severidad: **corregir**
- tipo: documento_previsible
- objecion: el campo está silencioso en los diez años. `notas.md` explica bien por qué (OSE se financia con
  tarifa y deuda multilateral) pero la ficha publicada no dice nada, y el lector no puede distinguir "no
  hubo" de "no se buscó". La Nota 8.1 de los balances 2023 y 2024 menciona explícitamente *"capital aportado
  por el Estado… revelados en el Estado de evolución del patrimonio"*: ese estado, en los mismos PDF, dice si
  el capital se movió.
- accion_sugerida: leer el Estado de evolución del patrimonio de dos o tres balances y, si no hubo aportes,
  decirlo en el `resumen` con su cita. Alternativa: Rendición de Cuentas del MEF.

### `finanzas` — `segmentos` (2018-2024)
- severidad: **corregir**
- tipo: presentacion + contexto_omitido
- objecion y citas: ver **(d)**. Falta "Otros" en 2018 y 2019; la justificación de 2019 se apoya en un
  documento no leído; falta en todos los años el descargo del propio balance sobre el prorrateo de los
  resultados financieros.
- accion_sugerida: cargar los dos "Otros" faltantes; en 2022 decir en la `nota` que la tabla trae "-" (cero)
  en vez de omitirlo sin más; agregar en cada año una línea con la cita del pie de tabla.

### `comparaciones[0]` — BID / Lentini 2015
- severidad: **corregir**
- tipo: cita_fuera_de_contexto + asimetria
- objecion y citas: ver **(e)**, puntos 1 a 3.
- accion_sugerida: sacar "(OSE)" del `valor_propio`; agregar el promedio de la muestra (1,22 USD/m³) y la
  tarifa social (22-36 %) del mismo documento.

### `comparaciones[1]` y `comparaciones[2]` — ADERASA 2024 (datos 2022)
- severidad: **corregir**
- tipo: asimetria
- objecion: las citas son literales y el universo (11 operadores, nombrados) está bien descrito. Lo que falta
  es al menos una comparación de servicio del mismo informe.
- cita_de_contexto: *"El 95.19% de la población bajo responsabilidad de OSE, tuvo acceso al agua potable con
  una continuidad de 23.99 horas y un nivel de micromedición mayor a 92%… el 88.98% de las aguas residuales
  volcadas de OSE recibió tratamiento previo."* — ADERASA, `--buscar "bajo responsabilidad de OSE"`.
- accion_sugerida: agregar una comparación de continuidad o de tratamiento de aguas residuales contra los
  pares que el mismo informe reporta (AyA 9,88 h; EPMAPS 23,60 h y 1,87 % de tratamiento). Y una nota de una
  línea que explique por qué el 2,06 del BID y el 1,27 de ADERASA no se contradicen. Detalle menor: la
  elaboración del benchmarking la firma SUNASS (Perú) para ADERASA; conviene que el crédito lo diga.

### `hitos[]` — ausente
- severidad: **corregir**
- tipo: presentacion
- objecion y lista de ocho hitos con sus fuentes ya leídas: ver **(f)**.

### `fuentes: []` e `imagenes` ausente
- severidad: **aviso**
- tipo: sin_objecion
- objecion: el esquema los permite vacíos. Si se quiere una fuente general, URSEA (que regula agua y ya existe
  como medio) es la candidata natural.

---

## Objeciones al lote

1. **Cobertura del período: buena, con dos huecos declarados y uno recuperable.** 2015-2024 completos en
   resultado; impuestos en 9 de 10; deuda en 7 de 10 (recuperables los 3, ver **(c)**); transferencias en 7 de
   10. 2019 no tiene balance propio publicado y se resolvió con la columna comparativa del balance 2020: **eso
   alcanza**, es la misma cifra auditada del mismo emisor, y lo verifiqué contra el documento. Pero tiene que
   declararse en el campo, no en `notas.md`, y con una frase para el lector ("OSE no publicó un balance
   separado de 2019; la cifra es la columna comparativa del balance 2020"), no con "no se localizó… ni en el
   corpus ni en una búsqueda web acotada". Lo mismo para 2017.
2. **El brief pedía fuentes que no se abrieron.** `ain.gub.uy`, la API de `catalogodatos.gub.uy` y la
   Rendición de Cuentas del MEF figuran en el punto 2 del brief y no hay una sola consulta a ninguno en
   `consultas.jsonl`. Son justamente los documentos que cerrarían `transferencias_al_estado` 2021-2022 y
   `capitalizaciones_del_estado`. También quedó sin correr `pnpm descubrir` sobre medios que el buscador no
   devuelve; `notas.md` lo explica (la herramienta no estaba entre las permitidas del agente) y es una
   explicación razonable, no una omisión.
3. **Dependencia de un solo grupo: no la hay, y conviene decirlo.** Las cuatro notas de prensa son de cuatro
   grupos distintos (`cooperativa-la-diaria`, `reg-sa`, `monte-carlo-romay-salvo`, `werthein-hochbaum`) y
   cuatro alineamientos distintos (`independiente`, `progresista`, `sin_datos`, `sin_datos`). El desbalance no
   es de propiedad: es que la posición pro-exclusividad tiene dos fuentes independientes y la contraria tiene
   una nota y una ONG que es parte en la disputa.
4. **Simetría.** El lote tiene dos asimetrías de signo opuesto, y las dos se arreglan con documentos ya
   bajados: los argumentos favorecen el diseño estatal (ver **(a)**), las comparaciones lo desfavorecen (ver
   **(e)**). Ninguna de las dos parece deliberada; las dos son de profundidad de búsqueda.
5. **Lo que el lote hizo bien y debe registrarse**, porque la ausencia de crítica también se audita: declaró
   todos sus huecos con el motivo; no forzó `precios_vs_paridad` cuando el concepto no aplica (mejor criterio
   que el de la ficha de ANCAP); no calculó ninguna comparación propia; usó como fuente de las comparaciones a
   quien las hizo y no a quien las repitió; y la aritmética de 10 años de conversiones y 9 sumas de impuestos
   está bien hecha, la verifiqué entera.
6. **Medios faltantes: confirmé que las URL pertenecen a los publicadores declarados.** Propuesta de alta,
   para el editor:
   - `ose` — `https://www.ose.com.uy/` — `tipo: estatal`, `grupo: estado-uruguayo`, `alineamiento: estatal`,
     y `empresa: ose` apuntando a la ficha, exactamente como `content/medios/ancap.yaml`. 64 de los 68 errores
     de validación son este.
   - `bid` — `https://publications.iadb.org/` (Banco Interamericano de Desarrollo) — `tipo: estatal`,
     `alineamiento: estatal`. **Grupo propio** (p. ej. `bid`), **no** `estado-uruguayo`: si se le pusiera un
     grupo estatal compartido, un registro `reportado` podría contar al BID y a un organismo uruguayo como dos
     grupos siendo uno. El enum de `tipo` no tiene "organismo internacional"; `estatal` es el menos malo y
     conviene decirlo en la `justificacion`.
   - `aderasa` — `https://aderasa.org/` (Asociación de Entes Reguladores de Agua Potable y Saneamiento de las
     Américas) — `tipo: estatal`, `grupo: aderasa`, `alineamiento: estatal`, con la aclaración de que es una
     asociación de reguladores públicos y que el informe lo elabora SUNASS.
   - `redes-org-uy` — `https://www.redes.org.uy/` (REDES–Amigos de la Tierra Uruguay) — `tipo: portal`,
     `grupo: redes-at`, `alineamiento: sin_datos`. **No es prensa**: es una organización que fue parte en el
     asunto que se cita (cofundadora de la CNDAV e impulsora del plebiscito). Eso tiene que estar en
     `propiedad.descripcion` para que nadie la use después como segunda fuente de un `reportado`. No le pongo
     `progresista` porque no encontré fuente que documente vínculo partidario de la organización; lo que la
     nota documenta es la composición de la CNDAV, que es otra cosa.

---

## Objeciones al brief

El brief **no viola la Regla 0**: pide explícitamente el mismo esfuerzo para los dos lados, avisa que el
esquema no valida un solo lado, prohíbe adjetivos y comparaciones propias, y pide que se declare si un lado
costó más. El investigador declaró `objeciones_al_brief: Ninguna` y explicó su asimetría; eso es lo que
corresponde hacer.

Dos observaciones, que son de diseño y no de neutralidad:

1. **El brief nombra episodios donde debería nombrar posiciones.** "…incluidos los del plebiscito de 2004 y
   los del proyecto Arazatí/Neptuno" orienta a buscar en dos litigios en vez de buscar quién sostiene qué
   sobre el diseño. El resultado observable es que los cuatro argumentos de la ficha son sobre Arazatí y
   ninguno sobre el artículo 47. Redacción simétrica para el próximo brief de `empresas`: *"argumentos a favor
   y en contra del régimen vigente, cada uno en palabras de quien lo sostiene, con al menos dos búsquedas
   independientes por lado; si un lado queda con menos, listar las búsquedas hechas"*. El mismo texto para
   ANCAP, UTE, ANTEL y las demás.
2. **El brief da por resuelto un dato que también pide verificar.** Dice `monopolio` (`tiene`: … por la reforma
   de 2004) y a la vez manda verificar `tipo`. No genera error acá —el artículo 47 dice lo que dice y lo
   verifiqué— pero un brief que trae la respuesta adentro le baja el incentivo a leer el documento. Mejor:
   "verificá `tiene` contra el texto del artículo 47 en IMPO".

---

## Discrepancias

Escribí **una**, en `inbox/empresas/ose/2026-09-07/discrepancias.yaml`: El Observador, 13/05/2023,
`cita_alterada`. La columna presenta entre comillas, atribuido al artículo 47, un texto que no figura en el
artículo, y la diferencia no es de estilo: donde la Constitución dice que los servicios *"serán prestados
exclusiva y directamente por personas jurídicas estatales"*, lo publicado dice *"que es competencia del Estado
garantizar a la población dichos servicios"* — garantizar la prestación no excluye a un prestador no estatal.
La fuente primaria es el texto del artículo en IMPO, `documento_oficial`, que abrí en esta sesión. Sin verbos
de intención: registro qué se publicó y qué dice el original.

**Lo que no registré, y por qué:**

- la diaria, *"algo que quedó explícitamente prohibido luego del plebiscito de 2004"*: no está entre comillas
  ni atribuido al texto constitucional, y es una caracterización razonable de una regla de exclusividad. No es
  registrable.
- LR21 y Telenoche: lo que publican son citas de un comunicado de FFOSE y de declaraciones de Delgado. No
  tengo el comunicado ni el video: **no hay documento que decida**, y sin eso va a la crítica, no al registro.
- El Observador, *"Estas empresas vendieron sus activos y se fueron del país"* contra la rescisión y el
  acuerdo transaccional que describe el balance 2015: son dos relatos comprimidos de procesos distintos (la
  concesión de Uragua y la participación en Aguas de la Costa) y no tengo el documento que cubra los dos. No
  es registrable; sí es motivo suficiente para no usar esa columna como fuente de la ficha.

**Simetría del registro resultante, dicha en voz alta porque es una sola entrada:** la discrepancia recae
sobre una columna que trata favorablemente al gobierno de Lacalle Pou y desfavorablemente al Frente Amplio.
Apliqué el mismo test —cita entre comillas contra documento primario— a las tres notas restantes, que cubren
la misma disputa desde el otro lado, y no pasó el filtro por falta de documento, no por criterio. Si el editor
consigue el comunicado de FFOSE del 05/06/2022 o el video de las declaraciones de Delgado, corresponde correr
el mismo test sobre LR21 y Telenoche antes de publicar esta.

---

## Cobertura

Cinco registros sobre cuatro URL de prensa (una nota genera dos registros porque trata a dos sujetos en
sentidos opuestos). Están también en `inbox/empresas/ose/2026-09-07/cobertura.yaml`.

**Criterio, uno solo para todos:** el tono no es `neutral` únicamente si el medio, **en su propia voz**
(titular excluido, subtítulos incluidos), afirma o hace suya una afirmación en disputa. Bajo esa regla, las
tres notas informativas quedan `neutral` aunque den más espacio a un lado: en la diaria y LR21 todo lo
polémico va atribuido y entre comillas (LR21 abre, además, con el planteo de las autoridades de OSE: *"Se
refirieron a los desafíos y los riesgos que representa en la actualidad contar con una sola fuente de
abastecimiento… y las soluciones que generaría la concreción de la obra"*), y en Telenoche la voz del medio es
puramente atributiva. La cuarta es una **columna de opinión firmada**, y ahí la voz del medio sí toma partido,
en las dos direcciones.

**Advertencia metodológica para el editor:** mezclar una columna firmada con notas informativas en la misma
métrica de tono distorsiona la medición de sesgo del medio (la página de opinión no es la cobertura). Si el
sitio no distingue género, conviene decirlo en la ficha del medio, y aplicarlo igual a una columna de El País,
de Brecha o de la diaria.

Tres notas que abrí y **no** convertí en `cobertura`, con el motivo: `redes.org.uy` (organización de
incidencia y parte en el asunto, no medio de prensa), la entrada de Wikipedia sobre el plebiscito
(enciclopedia, y el lote no cita nada de ella) y el anexo de `medios.presidencia.gub.uy` (documento oficial).

Los eventos `proyecto-arazati` y `crisis-hidrica-2023` no existen en `content/eventos/`; van con el prefijo
`propuesto:` para que el editor decida si los crea.

```yaml
- medio: la-diaria
  url: https://ladiaria.com.uy/ambiente/articulo/2022/4/el-proyecto-neptuno-de-ose-es-inconstitucional-denuncia-comision-nacional-en-defensa-del-agua/
  titulo: El proyecto Neptuno de OSE “es inconstitucional”, denuncia Comisión Nacional en Defensa del Agua
  fecha: 2022-04-20
  evento: "propuesto: proyecto-arazati"
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Todo lo polémico va atribuido a la fuente y entre comillas, y el medio no lo hace suyo: "La Comisión
    Nacional en Defensa del Agua y de la Vida (CNDAV) se pronunció este miércoles sobre el proyecto Neptuno,
    que está a estudio de OSE, y lo consideró 'inconstitucional'".

- medio: la-republica
  url: https://www.lr21.com.uy/politica/1460393-ffose-denuncia-que-proyecto-neptuno-es-inconstitucional-y-privatizador
  titulo: FFOSE denuncia que “Proyecto Neptuno” es inconstitucional y privatizador
  fecha: 2022-06-05
  evento: "propuesto: proyecto-arazati"
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Reproduce extensamente el comunicado del sindicato, siempre atribuido, y abre con el planteo de las
    autoridades de OSE en su propia voz: "Se refirieron a los desafíos y los riesgos que representa en la
    actualidad contar con una sola fuente de abastecimiento de agua potable (Aguas Corrientes) para el área
    metropolitana, y las soluciones que generaría la concreción de la obra".

- medio: telenoche
  url: https://www.telenoche.com.uy/nacionales/delgado-no-hay-ningun-tipo-privatizacion-arazati-n5337463
  titulo: 'Delgado: "No hay ningún tipo de privatización" en Arazatí'
  fecha: 2022-11-17
  evento: "propuesto: proyecto-arazati"
  politico: delgado
  tono: neutral
  justificacion: >-
    La voz del medio es solo atributiva y no valora: "El secretario de Presidencia respondió a los
    cuestionamientos del Frente Amplio y expresó que las críticas no lo toman por sorpresa"; todo lo demás son
    citas textuales de Delgado.

- medio: el-observador
  url: https://www.elobservador.com.uy/nota/el-agua-es-nuestra-202351218340
  titulo: El agua es nuestra
  fecha: 2023-05-13
  evento: "propuesto: crisis-hidrica-2023"
  politico: lacalle-pou
  tono: favorable
  justificacion: >-
    Columna firmada por Ricardo Peirano que respalda en primera persona el argumento del presidente sobre
    Casupá: "como bien dijo el presidente Lacalle Pou, aunque se hubiera empezado con Casupá en marzo de 202º,
    recién hoy en 2023 estaría pronta porque su construcción lleva 36 meses, pero no tendría agua dado que
    tenemos esta fenomenal sequía".

- medio: el-observador
  url: https://www.elobservador.com.uy/nota/el-agua-es-nuestra-202351218340
  titulo: El agua es nuestra
  fecha: 2023-05-13
  evento: "propuesto: crisis-hidrica-2023"
  partido: Frente Amplio
  tono: desfavorable
  justificacion: >-
    La misma columna atribuye la crisis a la gestión anterior en la voz del autor, sin atribuir la afirmación
    a un tercero: "El Frente Amplio tuvo una enorme bonanza económica de 2005 a 2014 y en ese período no se
    avanzó prácticamente nada".
```

---

## Recuento

- **bloquea: 3** — `argumentos_en_contra[0]` (Delgado), `argumentos_en_contra[1]` (REDES-AT), y la
  consecuencia de las dos: `monopolio` sin ningún argumento en contra sostenido por quien lo sostiene.
- **corregir: 16** — `que_hace` (cita cortada en e); art. 47 (numeral e inciso, fechas); `alcance` (párrafo
  sin fuentes); `normas[1]` (cometidos sin cita); `normas[2]` (accionistas de Uragua desde una columna de
  opinión); `argumentos_a_favor[0]` (cita que no contiene lo que el texto afirma); resultado 2015 (signo);
  `impuestos_pagados` (qué suma y qué no); **deuda financiera 2022-2024 (`documento_previsible`)**;
  transferencia 2023 ("depositado" y párrafo en `concepto`); `capitalizaciones_del_estado`
  (`documento_previsible`); segmentos 2018 y 2019 ("Otros" faltante y justificación sin documento leído);
  segmentos, todos los años (prorrateo no advertido); `comparaciones[0]` (atribución a OSE, promedio y tarifa
  social); `comparaciones[1-2]` (falta una comparación de servicio); `hitos[]` ausente.
- **aviso: 6** — `creacion` (URL de IMPO con un solo artículo); `tipo` (docstring vs norma);
  `argumentos_a_favor[1]` (muro de registro en la diaria); bonificaciones sociales como contracara de las
  transferencias; `fuentes: []` e `imagenes`; fuentes repetidas y su tratamiento simétrico con la ficha de
  ANCAP.
- **sin_objecion, dicho expresamente** — la omisión de `precios_vs_paridad` (correcta); el uso de la columna
  comparativa de 2020 para 2019 (alcanza, con la redacción corregida); los huecos de transferencias 2021-2022
  (verifiqué que "Rentas Generales" no aparece en esos textos); la aritmética de resultados, impuestos, deuda
  y segmentos; la ausencia de dependencia de un solo grupo de medios; y las tres citas de comparaciones, que
  son literales y de quien hizo la comparación.
- **cobertura: 5 registros** (4 URL, todas verificadas en esta sesión).
- **discrepancias: 1 registro.**
