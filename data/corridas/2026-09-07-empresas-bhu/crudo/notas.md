# Notas — BHU (corrida 2026-09-07-empresas-bhu)

Corro en Sonnet por la regla de modelos del mantenedor (2026-09-07): ningún subagente corre en
Fable sin permiso explícito, y Opus queda reservado para el crítico; el investigador corre en
Sonnet.

## candidatos_giro
No aplica: esta corrida no investiga declaraciones de un político, sino la ficha de una empresa
pública.

## hipotesis
Ninguna hipótesis sin probar quedó pendiente de investigación adicional en esta corrida; lo que no
se pudo documentar quedó explícito como ausencia en `finanzas[].nota` o en las secciones de abajo.

## casos_vistos
Ninguno visto en esta corrida (el brief no pide casos judiciales y no se investigaron).

## verificacion_manual
- `https://www.bhu.gub.uy/media/1169/cartaorganica.pdf` — el dominio `bhu.gub.uy` no resuelve (ni
  con `pnpm fuente`, ni con `curl`, ni tiene capturas en Wayback). Se reemplazó por el mismo
  documento publicado por el propio banco en su sitio actual,
  `https://www.bhu.com.uy/sites/default/files/2026-03/SF.NOR.01_-_Carta_Org_nica.pdf` (Carta
  Orgánica consolidada, "Versión 05"), que sí se pudo leer y citar.
- `https://www.bhu.com.uy/sites/default/files/inline-files/bhu-eeff-e-informe-auditor%C3%ADa-31-12-2019.pdf`
  — la URL viva del sitio da HTTP 404 (el archivo ya no está en esa ruta). La primera captura de
  Wayback (20240621225050) está truncada a 1.048.576 bytes (el propio Wayback devuelve
  `warning: 299 wayback content truncated by "length"`) y `pnpm fuente` la rechaza con "Invalid PDF
  structure". Se encontró una segunda captura (20240307231019) con el tamaño completo
  (1.557.651 bytes), pero solo la variante `id_` de esa URL entrega el archivo sin truncar; con esa
  variante (`https://web.archive.org/web/20240307231019id_/https://www.bhu.com.uy/...`) el
  documento se leyó completo.
- `https://www.anv.gub.uy/preguntas-frecuentes-remates-extrajudiciales` (vuelta 2) — HTTP 403 y sin
  captura en Wayback (`archive.org/wayback/available` vacío). Es la única fuente con una defensa
  específica y oficial del remate extrajudicial que encontré por `WebSearch`; no se pudo citar.

## cobertura_del_periodo (actualizada en la vuelta 2)

| Año | Documento usado | Resultado | Impuestos | Transferencias | Capitalizaciones | Segmentos | Cotización |
|---|---|---|---|---|---|---|---|
| 2001 | balaudi_200112_0091.pdf (BCU) | Sí (−5.583,7 M) | No (sin nota con total limpio) | No aplica (formato sin la sección) | Sí (0) | No aplica | Sí (14,768) |
| 2002 | balaudi_200212_0091.pdf (BCU) | Sí (−22.831,3 M) | No | No aplica | Sí (19.936,8 M) | No aplica | Sí (27,20) |
| 2003 | balaudi_200312_0091.pdf (BCU) | Sí (−6.064,5 M) | Sí (suma de componentes, sin total del documento) | No aplica | Sí (3.375,0 M) | No aplica | Sí (29,30) |
| 2004 | balaudi_200412_0091.pdf (BCU) | Sí (2.340,0 M) | Sí | No aplica | Sí (0) | No aplica | Sí (26,35) |
| 2005 | balaudi_200512_0091.pdf (BCU) | Sí (−219,0 M) | Sí | No aplica | Sí (0) | No aplica | Sí (24,10) |
| 2006 | balaudi_200612_0091.pdf (BCU) — reemplaza el techo legal de USD 250 M | Sí (1.609,4 M) | Sí | No aplica | Sí (0) | No aplica | Sí (24,40) |
| 2007 | balaudi_200712_0091.pdf (BCU) | Sí (4.529,6 M) | Sí | Sí (0) | Sí (0) | No aplica | Sí (21,50) |
| 2008 | balaudi_200812_0091.pdf (BCU) | Sí (372,7 M) | Sí | No documentado | Sí (0) | No aplica | Sí (24,35) |
| 2009 | balance_2009.pdf (BHU, vía Wayback) | Sí (390,5 M) | Sí | No documentado | Sí (582,8 M, nota 3.21.1; ver reconciliación abajo) | No aplica | Sí (19,627) |
| 2010 | balaudi_201012_0091.pdf (BCU) | Sí (543,1 M) | Sí | No documentado | Sí (44,9 M) | No aplica | Sí (20,094) |
| 2011 | balaudi_201112_0091.pdf (BCU) | Sí (1.878,6 M) | Sí | No documentado | Sí (0) | No aplica | Sí (19,898) |
| 2012 | balance_2012.pdf (BHU) | Sí (1.271,1 M) | Sí | No documentado | Sí (0) | No aplica | Sí (19,399) |
| 2013 | balance_2013.pdf (BHU) | Sí (1.675,7 M) | Sí | No documentado | Sí (0) | No aplica | Sí (21,389) |
| 2014 | Ninguno localizado | No | No | No | No | No aplica | No |
| 2015 | balaudi-bhu-dic15.pdf | Sí | No (Nota 6 vacía en la capa de texto) | Sí (0) | Sí (0) | No | Sí (29,873) |
| 2016 | balance-auditado-bhu-2016.pdf | Sí | Sí | Sí (0) | Sí (0) | No | Sí (29,256) |
| 2017 | balance-2017.pdf + comparativa NIIF del balance 2018 | Sí (reexpresado, original en nota) | Sí | Sí (0) | Sí (0) | No | Sí (28,764) |
| 2018 | bhu-eeff-inf-aud-31-12-2018.pdf | Sí | Sí | Sí (0) | Sí (0) | Sí | No (sin tasa de cierre declarada) |
| 2019 | bhu-eeff-e-informe-auditoría-31-12-2019.pdf (Wayback id_) | Sí | Sí | Sí (0) | Sí (0) | Sí | Sí (37,336) |
| 2020 | informe-y-estados-financieros...bhu-dic-20-completo.pdf | Sí | Sí | Sí (0) | Sí (0) | Sí | Sí (42,34) |
| 2021 | bhu-eeff-individuales-y-cosolidados-emisores-2021.pdf | Sí | Sí | Ausente (en criterio de caja; ver "anticipo de resultados") | Sí (0) | Sí | Sí (44,695) |
| 2022 | balance-bhu-con-dictamen-31122022_compressed.pdf | Sí | Sí | Ausente (ídem) | Sí (0) | Sí | Sí (40,071) |
| 2023 | Balance 31122023 con dictamen individual y consolidado.pdf | Sí | Sí | Sí (638,962 M, los dos vertidos cancelados este año) | Sí (0) | Sí | Sí (39,022) |
| 2024 | BHU_EEFF Individual y Consolidado e Informes Dic24.pdf | Sí | Sí | Sí (400,0 M) | Sí (0) | Sí | Sí (44,066) |

La serie ahora va de 2001 a 2024, con el único hueco en 2014 (sin documento localizado, ver más
abajo). El "2006 fantasma" con el techo legal de USD 250 M se reemplazó por los datos reales del
balance de ese año.

## anios_sin_segmentos
2001-2017 (el último solo en su formato propio, previo a NIIF): los balances de esos años no traen
una nota de "Segmentos de negocio". Desde el balance de 2018 en adelante (y en la columna
comparativa 2017 del balance de 2018), el BHU declara explícitamente "el banco ha identificado un
único segmento de negocio", así que no hay `segmentos[]` que cargar en ningún año: no es una
ausencia de dato, es que el propio banco no desagrega su resultado por segmento porque opera uno
solo (crédito hipotecario a personas físicas).

## medios_faltantes
No se detectó una falta de cobertura por medio en esta corrida: la información de BHU sale casi
enteramente de sus propios documentos, de la legislación (IMPO), del regulador (BCU) y de dos
estudios (BID, FMI) que sí se pudieron leer. No se corrió `pnpm descubrir elpais.com.uy` porque el
foco de esta corrida es la ficha de la empresa (balances, marco legal, argumentos sobre el diseño),
no declaraciones de un político citadas por la prensa; la única comparación de tasas que se cargó
salió de El Observador, que sí aparece en `WebSearch` sin problemas.

## anios_sin_balance
Solo 2014 queda sin ningún documento con estados contables auditados (ver sección dedicada más
abajo). El resto del período 2001-2024 tiene al menos un estado financiero o contable propio de
BHU.

## Sobre el "anticipo de resultados" de $ 638.962.000 (resuelto en la vuelta 2)

En la primera vuelta este punto quedó sin cargar en ningún año, declarado como "el punto más
incierto de la corrida". La crítica de Opus (C4, C5) lo resolvió con una lectura consistente con
los tres balances:

- El balance de 2021 dice que el vertido de $ 306,6 M (Art. 65) "se prevé verter" y que "dicha
  obligación se registró dentro de otros pasivos": en criterio de caja, no salió efectivo en 2021.
- El balance de 2022 dice que el saldo de "$ 638.962.000" (que ya incluye el tramo de 2022, Art. 64,
  $ 332,4 M) "se registró dentro de otros pasivos": tampoco salió en 2022.
- El balance de 2023 dice, en la misma nota 21: "Al 31 de diciembre de 2023 se canceló el pasivo, no
  habiendo saldos pendientes de pago". Ahí es donde, en criterio de caja, sale el efectivo de los
  dos vertidos juntos.
- La nota 21 del balance de 2024 dice que en agosto de 2024 "se compensaron los anticipos de
  resultados realizados con anterioridad, con cargo a resultados acumulados, por un total de
  $ 1.038.962.000 ($ 638.962.000 distribuidos en ejercicios anteriores y $ 400.000.000 vertidos a
  rentas generales en julio de 2024)": es un asiento contable de compensación (mueve el saldo entre
  cuentas de patrimonio), no una segunda salida de caja de los $ 638,962 M.

Con esa lectura: `finanzas[2021].transferencias_al_estado` y `finanzas[2022].transferencias_al_estado`
quedan ausentes (con `nota` explicando el criterio), `finanzas[2023].transferencias_al_estado =
$ 638,962 M` (los dos vertidos, cancelados ese año, con la nota 21 completa y exacta como cita), y
`finanzas[2024].transferencias_al_estado = $ 400,0 M` se mantiene como estaba.

## Sobre las capitalizaciones del Estado 2001-2013 (resuelto en la vuelta 2)

En la primera vuelta, 2002 quedó sin cargar (por no encontrarse "un balance propio de BHU de 2002")
y 2006 se cargó con el techo legal de USD 250 M de la Ley 18.046 en lugar de un dato contable. La
crítica de Opus (B1, B2) encontró que el BCU publica los balances del BHU (institución 0091) desde
2001 en `www.bcu.gub.uy/autoriza/sieras/` (2001-2005) y
`www.bcu.gub.uy/Servicios-Financieros-SSF/Estados Contables Auditados/` (2006-2011), todos
accesibles por Wayback con el sufijo `id_`. En esta vuelta:

- Se cargó `finanzas[2002]` con el balance real: resultado −$ 22.831,3 M (año de la crisis bancaria)
  y capitalización $ 19.936,8 M (línea "Aportes de capital" del Estado de Evolución del Patrimonio).
- Se reemplazó `finanzas[2006]`: resultado $ 1.609,4 M, capitalización $ 0 (el techo de la Ley
  18.046 queda solo en el hito legislativo, no como una cifra contable).
- Se extendió la serie completa 2001-2013 con el mismo criterio (ver tabla de cobertura). Un
  hallazgo no pedido explícitamente: **2003 también tuvo un aporte de capital** de $ 3.375,0 M,
  documentado con la misma cita del Estado de Evolución del Patrimonio de ese año.
- **2009** es el año con la capitalización más documentada y también el más ambiguo: ver la sección
  siguiente.
- **2014** quedó sin balance (ver abajo).

## Sobre la reconciliación de 2009 (declarada, no resuelta)

El balance de 2009 trae dos cifras de capitalización que no cierran entre sí y que están en
secciones distintas del mismo documento:

1. La nota 3.21.1 ("Otros hechos — Capitalización de 9 de marzo de 2009") dice que "el Banco fue
   capitalizado por $ 582:785.837", con el mecanismo explícito: el MEF asumió pasivos netos del BHU
   por $ 11.860.963.199 y recibió a cambio activos (créditos contra patrimonios fiduciarios) por
   $ 11.278.177.362; la diferencia ($ 582.785.837) es la capitalización neta. Esta cifra está en
   pesos plenos (no en miles), y al tipo de cambio de cierre de 2009 (19,627) equivale a unos
   USD 29,7 millones.
2. El Estado de Evolución del Patrimonio **y** el Estado de Origen y Aplicación de Fondos del mismo
   balance muestran, los dos de forma independiente, una línea "Aportes de capital" / "Integrac. de
   capital" de $ 5.343.273 **miles** de pesos (es decir, $ 5.343,3 millones), casi diez veces más
   grande que la cifra de la nota 3.21.1. Al tipo de cambio de cierre equivale a unos
   USD 272,3 millones.

El documento no explica la diferencia entre ambas. El brief de esta vuelta identificó explícitamente
"la capitalización del 9 de marzo de 2009 ($ 582.785.837)" como la cifra a cargar, así que se usó
esa (la de la nota 3.21.1, que es la que describe el mecanismo), dejando la otra declarada en la
`nota` del año. Si alguien concilia ambas cifras (por ejemplo, si la de $ 5.343,3 M incluye
capitalizaciones de años anteriores reclasificadas, o si la de $ 582,8 M es solo un componente neto
dentro de un movimiento mayor), el cambio es de un solo campo.

## Sobre el año 2014 (sin documento)

No se encontró un balance ni una memoria con estados contables auditados de 2014. El único documento
del inventario del sitio para ese año, `memoria-2014.pdf` (dos capturas de Wayback, una truncada y
otra completa), no trae las tablas de resultados en su capa de texto —solo un cuadro de
"Requerimientos de capital por riesgos"—, verificado con `--buscar` sobre "Resultado del ejercicio",
"utilidad", "resultado neto", "Rentas Generales" y "capitaliz", todos sin coincidencias. El índice
CDX de Wayback para `bcu.gub.uy/autoriza/sieras/balaudi_*_0091.pdf` no tiene capturas posteriores a
2011: el BCU parece haber movido esa publicación a su buscador de Registros
(`Servicios-Financieros-SSF/Paginas/buscador_Registros.aspx`), que es un formulario interactivo y no
se pudo consultar de forma programática en esta corrida. `finanzas[2014]` queda ausente.

## Sobre el mecanismo de la reexpresión NIIF de 2017

El resultado del ejercicio 2017 aparece en el propio balance de ese año (formato previo a NIIF,
"miles de $") como $ 2.341.656 miles, y en la columna comparativa del balance de 2018 (ya en
formato NIIF) como $ 2.362.529.445. La diferencia es de 0,9%. El balance de 2018 aclara que "los
estados financieros al 31 de diciembre de 2017 que se incluyen en el presente informe, fueron
confeccionados de acuerdo al nuevo marco normativo sólo a efectos comparativos". No se pudo
determinar si esa diferencia corresponde a una reexpresión por inflación o a un cambio de criterio
contable puntual entre el régimen local de BCU y NIIF completo; se usó la cotización propia de 2017
(28,764) para convertir a dólares el resultado reexpresado. El original y el reexpresado quedan
ambos citados en `finanzas[anio: 2017].resultado_ejercicio`.

**Sobre `impuestos_pagados` de 2017 (C15, sin resolver):** el propio balance de 2017 (formato previo
a NIIF) da un total de $ 1.722,1 M en su Nota 6; la columna comparativa NIIF del balance de 2018 da
$ 1.647,6 M para el mismo año (suma de "Impuesto a la renta" más "Impuestos, tasas y
contribuciones"). Se cargó la primera (la propia del ejercicio). `content/empresas/brou.yaml` usó,
para su propio año de transición (también 2017), la columna comparativa NIIF. Son dos bancos con el
mismo empalme de normas resuelto en direcciones opuestas; el brief pide que el editor fije **una**
convención y la aplique a las dos fichas (esto no lo puede resolver el investigador sin tocar
`content/`).

## Sobre `impuestos_pagados` de 2015 (dato faltante)

La Nota 6 "IMPUESTOS" del balance de 2015 aparece en el índice del documento pero su tabla no se
pudo extraer como texto: entre el título de la nota y la nota siguiente (7. OPERACIONES CON
INSTRUMENTOS DERIVADOS) no hay ningún número en la capa de texto del PDF, verificado con dos
búsquedas distintas (`--buscar "6. IMPUESTOS"` y `--buscar "Imp. al Patrimonio"`, sin resultados).
Es la misma nota que en 2016 y 2017 sí se extrae limpia, así que no parece ser un problema
sistemático del formato sino de esa página puntual del PDF de 2015. Se sabe, del propio Estado de
Resultados, que el componente de IRAE fue $ 1.122.719 miles, pero no se cargó como
`impuestos_pagados` porque sería exactamente "el IRAE solo" que el diccionario pide evitar. Queda
declarado como dato faltante, no como cero.

## Sobre `deuda_financiera`

No se cargó en ningún año, siguiendo el mismo criterio que se usó para la ficha de BROU: en un
banco, los pasivos financieros son mayormente depósitos del público y valores negociables emitidos
para financiar la cartera de créditos hipotecaria (el negocio central del banco, no una "deuda"
adicional en el sentido de una empresa no financiera). El BHU sí emite Obligaciones Hipotecarias
Reajustables (OHR, $ 18.374.931.949 al 31/12/2023, según el aviso A5 del crítico) con renglón propio
en la nota de "Otros débitos representados por valores negociables"; no se cargó igual porque no hay
un total comparable de "deuda financiera" bajo NIIF para entidades de intermediación financiera. Se
deja para que el editor decida y lo diga en el `resumen` (no lo escribo).

## Sobre el tipo `ente_autonomo`

No se encontró un artículo constitucional o legal único que use literalmente la frase "ente
autónomo" para el BHU (a diferencia de BROU, donde el artículo 1 de la Ley 18.716 lo dice
explícitamente). Se mantuvo `tipo: ente_autonomo` igual, por ser la clasificación estándar y no
controvertida del BHU en la literatura jurídica y económica uruguaya, y porque su Carta Orgánica
(artículo 90) establece que su Directorio es "designado por el Poder Ejecutivo, de acuerdo con lo
previsto en la Constitución de la República", la misma fórmula que usan los entes autónomos
indiscutidos. Se documenta esta incertidumbre acá para que el editor decida si amerita seguir
buscando el artículo constitucional preciso.

## Sobre los argumentos del "monopolio" (actualizado en la vuelta 2)

El criterio de esta vuelta, fijado por el brief: `monopolio.tiene: false` (el BHU no tiene
actividades reservadas por ley desde 1999), pero los dos privilegios que sí conserva (garantía del
Estado, art. 8; ejecución extrajudicial, art. 80) van en `alcance` con argumentos de los dos lados
buscados a mano (el esquema no lo exige automáticamente cuando `tiene: false`).

- **En contra** (sobre los privilegios puntuales): FMI/Banco Mundial (FSAP 2013, párrafo 43,
  recortado a la frase exacta sobre BROU/BHU, sin la recomendación que es solo sobre BROU) para la
  garantía del Estado; BID (Gandelman y Gandelman, 2004) para la ejecución extrajudicial.
- **A favor** (defensa institucional general, no de los privilegios puntuales): AEBU (2023) sobre la
  necesidad de un banco público de vivienda, y Presidencia (2006) sobre el objetivo de la
  reestructura. **No encontré, después de repetir las búsquedas con otros términos** ("garantía del
  Estado" AEBU, "ejecución extrajudicial" defensa, exposición de motivos Ley 18.125, Hemeroteca del
  Parlamento), una defensa específica y contemporánea de estos dos privilegios puntuales. La única
  pista fue una página de la ANV (`preguntas-frecuentes-remates-extrajudiciales`) que defiende el
  remate extrajudicial con argumentos concretos (comisión más baja, sin costo de desocupación,
  "amplía las oportunidades de acceso a la vivienda"), pero da HTTP 403 y no tiene copia en Wayback,
  así que no se pudo citar (ver `verificacion_manual`). Esto queda como asimetría de esfuerzo
  reconocida, no de intención: se buscó con el mismo empeño de los dos lados (ver `consultas.jsonl`,
  08:12-08:16), y lo que falta es específicamente disponibilidad de la fuente, no que no se haya
  buscado.

## Sobre las comparaciones (actualizado en la vuelta 2)

Se mantienen las dos comparaciones de tasas (BHU vs. Santander, BHU vs. Itaú) de El Observador
(2022-02-22), ahora sin la sigla "TEA" (que no está en la fuente) y con una segunda cita que respalda
el 3,75% propio del BHU. Se agregaron dos comparaciones más, cada una de una fuente distinta (para no
acercarse al umbral de tres del mismo documento que activaría `analisis.yaml`):
- Cuota de mercado (BID, Documento de Trabajo 503, período 2002-2004): "el BHU concentra alrededor de
  80% del total del mercado hipotecario".
- Morosidad (balance BHU 2018): "1,40% en diciembre de 2018 ... alineado con los parámetros de
  morosidad de hipotecarios de la banca privada", sin una cifra propia de la banca privada en el
  documento (así declarado en `valor_par`, sin inventar un número).

## objeciones_al_brief

Ninguna, en ninguna de las dos vueltas. El brief pide un tratamiento simétrico (argumentos a favor y
en contra con el mismo esfuerzo) y así se buscó; no hubo pedido de omitir ni encuadrar información
según partido o persona. El brief de la vuelta 2 fija explícitamente el criterio `tiene: false` para
el BHU (distinto del `tiene: true` de BROU), y pide igual los dos lados de los dos privilegios: se
siguió esa instrucción tal cual, sin objetarla (no es una asimetría entre políticos o partidos, es
una diferencia de diseño legal entre dos bancos que el propio brief reconoce y decide).

## vuelta 2 (2026-09-09, resolviendo la crítica de Opus, corrida 2026-09-07-empresas-bhu)

Corro en Sonnet por la regla de modelos del mantenedor (2026-09-07). Edité `empresas.yaml` en el
lugar; no toqué `content/`, no escribí tier ni procedencia.

### bloquea

| # | Objeción | Qué hice |
|---|---|---|
| B1 | `finanzas[2006].capitalizaciones_del_estado` cargaba el techo legal de USD 250 M (Ley 18.046) como si fuera lo que el Estado puso. | Saqué esa entrada. Cargué 2006 con datos reales del balance del BHU publicado por el BCU (institución 0091, `Servicios-Financieros-SSF/Estados Contables Auditados/balaudi_200612_0091.pdf` vía Wayback `id_`): resultado $ 1.609,4 M, impuestos $ 174,6 M, capitalización $ 0 (con cita del Estado de Evolución del Patrimonio). La autorización legal de USD 250 M queda solo en `hitos[2006-10-24]`, que ya la tenía. |
| B2 | Faltaba la capitalización de 2002 ($ 19.936,8 M) que el brief pidió con nombre y apellido. | Abrí el balance del BHU de 2002 publicado por el BCU (`autoriza/sieras/balaudi_200212_0091.pdf`, Wayback). Cargué `finanzas[2002]` completo: resultado −$ 22.831,3 M (pérdida del año de la crisis), capitalización $ 19.936,8 M, cotización 27,20. Agregué un hito `2002-12-31` con esa cita. |
| B3 | Los dos "en contra" pegaban en los dos privilegios del `alcance` (garantía, ejecución extrajudicial) y ninguno de los dos "a favor" los tocaba; y `tiene:false` no obligaba al doble lado. | El brief de esta vuelta fija el criterio explícitamente: `tiene: false`, pero pide igual los dos privilegios en `alcance` con argumentos de los dos lados a mano. Reescribí `alcance` con la fecha correcta (1999, no 1996) y los dos privilegios explícitos. Recorté el argumento del FMI a la frase exacta que es sobre el BHU (C1). Reescribí el argumento de AEBU sin la mitad omitida en su núcleo, separando la crítica al giro comercial hacia la `nota` de 2024 (C2 y C11). No encontré una defensa contemporánea y específica de la garantía o la ejecución extrajudicial (ver la sección dedicada arriba); queda declarado, no resuelto. |

### corregir

| # | Objeción | Qué hice |
|---|---|---|
| C1 | La cita del FMI mezclaba el párrafo 43 (sobre BHU) con una recomendación del resumen ejecutivo que es sobre BROU. | Recorté el `texto` del argumento a la frase exacta y sola sobre BROU/BHU. La `cita` de la fuente es ahora el párrafo 43, sin la recomendación del depositario único (que es de BROU). |
| C2 | El argumento de AEBU omitía que la misma nota critica al BHU por el giro comercial y a la Ley 20.237. | Reescribí `argumentos_a_favor[0]` con el núcleo de la defensa institucional y moví la crítica al giro comercial a la `nota` de `finanzas[2024]` (ver C11). |
| C3 | La cita de `finanzas[2022].resultado_ejercicio` venía del bloque consolidado ("3. PATRIMONIO"), no del individual. | Reemplacé por la línea "7.1 - Resultado del ejercicio" del Estado de cambios en el patrimonio individual del propio balance 2022 (numeración verificada con `--red`). |
| C4 | La `nota` de 2022 sobre el "anticipo de resultados" de $ 638.962.000 se leía como una tercera distribución. | La reescribí para decir que es la suma exacta de los dos vertidos previstos ($ 306,6 M + $ 332,4 M) y que se compensó contablemente en agosto de 2024. |
| C5 | `finanzas[2021].transferencias_al_estado` cargaba $ 306,6 M como si hubiera salido en caja en 2021. | Saqué el campo de 2021 (queda ausente, con `nota`). Cargué `finanzas[2023].transferencias_al_estado = $ 638,962 M` (los dos vertidos, cancelados "no habiendo saldos pendientes de pago" al 31/12/2023). `finanzas[2022]` también queda ausente. |
| C6 | Faltaba `transferencias_al_estado = 0` con cita en 2015, 2016, 2018, 2019, 2020. | Cargué los cinco años en cero, citando la línea correspondiente del mismo documento que ya se cita para `capitalizaciones_del_estado`. |
| C7 | El hito y el `que_hace` fechaban el fin del privilegio en 1996 en vez de 1999 (Ley 17.202), y describían mal el privilegio original. | Refeché el hito a 1999-09-24. Corregí `que_hace`. Reescribí `monopolio.alcance` con la distinción correcta. |
| C8 | 13 campos `concepto`/`nota` pasaban de 300 caracteres. | Acorté los 13 a una oración cada uno. |
| C9 | La `nota` de 2017 terminaba en un fragmento colgado. | La reescribí completa. |
| C10 | `monopolio.alcance` nombraba cinco bancos privados sin fuente. | Saqué la lista; queda "los bancos privados de plaza autorizados por el BCU". |
| C11 | La `nota` de 2024 decía "no se investigó a fondo" algo que el propio balance explica. | La reescribí con la migración a la ANV (fideicomiso, 23/5/2024) y la extinción de 533 deudas (diciembre 2024), con cita. Agregué dos hitos. |
| C12 | Faltaban en `hitos[]` la capitalización de 2002, la de 2009, la Carta Orgánica de 1915 y el fideicomiso de 2024. | Agregué esos cuatro más el cambio a NIIF (2018) y la extinción de deudas (diciembre 2024): de 9 hitos pasé a 15. |
| C13 | Nunca se corrió el inventario del BCU. | Usé el índice CDX de Wayback (`bcu.gub.uy/autoriza/sieras/`) para completar 2001-2005 y extendí la serie 2001-2013 (2014 ausente, declarado). |
| C14 | La ficha arrancaba en 2015 con un 2006 fantasma. | `finanzas[]` va de 2001 a 2024 (hueco declarado en 2014); los hitos cubren desde 1892. |
| C15 | 2017 usa una base de impuestos distinta a la de BROU para el mismo año de transición. | No lo cambié unilateralmente (afecta a las dos fichas); documentado para que el editor fije un criterio único. |
| C16 | Las comparaciones decían "TEA" (no está en la fuente) y faltaba la cita del 3,75% del BHU. | Saqué "TEA". Agregué la segunda fuente con la cita textual de la gacetilla del BHU en las dos comparaciones. |

### avisos

| # | Objeción | Qué hice |
|---|---|---|
| A1 | Dos comparaciones de una sola nota. | Sin cambios (las dos nuevas comparaciones son de otras fuentes, no de la misma nota). |
| A2 | Faltaban comparaciones con autor identificable ya leídas. | Agregué las dos (BID cuota de mercado, balance 2018 morosidad). |
| A3 | `finanzas[2018]` sin `cotizacion` ni `usd`. | Volví a buscar; ningún documento declara una tasa de cierre 2018. Queda ausente. |
| A4 | `segmentos[]` vacío en los diez años sin explicar por qué. | No lo resolví (afecta al `resumen`, que no escribo). |
| A5 | `deuda_financiera` ausente pese a que el BHU emite OHR. | No lo cargué (mismo criterio que BROU); queda para el editor. |
| A6 | Verificar el agrupado "un publicador, una línea" en `pnpm dev`. | No verificado en esta vuelta. |
| A7 | `medios/anv-gub-uy.yaml` sin uso. | Lo borré: no logré citar ninguna fuente de la ANV en esta vuelta. |
| A8 | `tipo: ente_autonomo` con incertidumbre reconocida. | Sin cambios. |
| A9 | Errores de referencia, todos "medio desconocido". | Siguen siendo del mismo tipo (83, por los nuevos años y hitos); `bcu` ya existe en `content/medios/` y no genera error, solo faltan `bhu` y `aebu`. |
| A10 | Faltaba `pnpm validar --red`. | Corrido con `--solo citas` y `--solo fuentes` (el gate de referencias con errores esperados de medio impide llegar a esas etapas con `--red` a secas). Resultado: 131 citas, 131 exactas, 0 aproximadas; 37 URLs verificadas, 0 errores, 3 avisos (BID con 403 pero copia archivada, ya conocido). |
