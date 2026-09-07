# Razones — corrida 2026-09-07-empresas-ancap (paso de edición)

## Modelo

Editor: `claude-sonnet-5` (Sonnet), por decisión del mantenedor del 2026-09-07. No corrí en Fable. El
crítico de este lote corrió en Opus (`claude-opus-5`, según `critica.md`); el investigador declaró
`claude-sonnet-5` en las dos pasadas. Ningún subagente de esta corrida corrió fuera de lo que le
corresponde según `CLAUDE.md`.

## IDs completos de los registros de esta corrida (para la corrección)

Nuevos (`agrega[]`):
- `empresas/ancap`
- `cobertura/la-diaria/2021-11-24-argumentos-monopolio-ancap-lacalle-pou`
- `cobertura/subrayado/2020-05-22-retiro-articulo-230-luc-lacalle-pou`
- `cobertura/el-observador/2020-10-09-libre-importacion-puertos-lacalle-pou`
- `cobertura/el-observador/2022-03-07-precios-combustibles-vazquez`
- `cobertura/el-observador/2022-03-07-precios-combustibles-lacalle-pou`
- `cobertura/montevideo-portal/2024-03-08-lacalle-pou-libre-importacion-arroceros`
- `cobertura/ambito/2026-01-10-nafta-mas-cara-latinoamerica-orsi`
- `cobertura/ambito/2026-07-17-nafta-55-mas-cara-argentina-brasil-orsi`
- `cobertura/el-pais/2025-04-02-perdidas-ancap-2024-orsi`
- `cobertura/el-pais/2020-10-17-fancap-trabajadores-lacalle-pou`
- `discrepancias/el-pais/2025-04-02-ancap-2020-perdida-cifra-reexpresada`

Existentes que esta corrida modifica (`afecta[]`, van por `pnpm promover --correccion`, tipo
`cambio_de_rating` en los dos casos — ninguno corrige un error de investigación, corrigen la
calificación o el alcance con evidencia nueva):
- `chequeos/orsi/2025-04-25-ancap-volvio-negativos-diez-anos-2025` (de `falso` a `discutible`)
- `discrepancias/presidencia/2020-02-27-resultado-operativo-etiquetado-como-resultado-ejercicio-ancap-2019`
  (de `probable` a `publicado`, alcance ampliado de 2018-2019 a 2015-2019)

Semilla (no es de esta corrida; va con `[semilla <id>]` propio, no con el id de esta corrida):
- `content/medios/justia.yaml` (nuevo)

## empresas.yaml — ficha de ANCAP

**Reexpresión de 2020** (bloqueaba, crítica sección (c)). `resultado_ejercicio` pasó de la cifra
original (pérdida, ya superada por el propio emisor) a la reexpresada por la Nota 30.2 de los EECC de
2021 (ganancia, USD 9,1 M); la cifra original, el ajuste y el resultado antes de impuestos (negativo en
las dos versiones) se movieron al campo `nota` de `Anio`, que estaba sin usar. Ya lo había resuelto la
segunda pasada del investigador; yo solo lo verifiqué y ajusté redacción.

**Unidades de `finanzas[]`: `unidades` → `millones`.** Encargo del orquestador ("verificá que los usd
estén en millones... porque la página los muestra con esa unidad") más la objeción de la crítica sobre
precisión falsa (desvíos de conversión de hasta ~1.500 dólares publicados al dólar exacto). Convertí
los 35 `Monto` de `finanzas[]` (pesos y usd) a millones con un decimal, recalculando con Node a partir
de los pesos y tipos de cambio ya citados (no inventé ninguna cifra nueva); los valores de
`resultado_ejercicio` coinciden con los que ya usa el gráfico del chequeo de Orsi, lo que sirvió de
control cruzado. `millones` es además el valor por defecto del esquema.

**`transferencias_al_estado`: `concepto` explícito** (corregir). Agregué "no incluye impuestos (IMESI,
IVA, IRAE) ni retenciones — ver impuestos_pagados" en 2020, 2023 y 2024, para que no se lea como "lo
que Ancap le da al Estado" en sentido amplio.

**Año 2016: `nota` nueva** uniendo tres objeciones de la crítica que compartían el mismo hecho —
conversión de la capitalización al tipo de cambio de cierre de diciembre en vez de al de la operación
(2/2/2016), el préstamo de USD 250 M del CAF que integró el mismo paquete y no está registrado como
capitalización, y que la baja de deuda 2015→2016 es en un ~82% la misma cancelación de deuda. Agregué
una fuente de El Observador (la cifra contemporánea de USD 622 M + USD 250 M) y una cita de la Nota 23
sobre la composición de la deuda (bancarios vs. partes relacionadas, con el contrato CAF de
setiembre de 2016) a `deuda_financiera.fuentes` y `capitalizaciones_del_estado.fuentes`.

**Nota del error de IRAE, reubicada** (corregir). Estaba colgada de `deuda_financiera.concepto` en 2018
y 2019, el único monto que el error no afecta. La saqué de ahí y agregué `Anio.nota` en los dos años
explicando que el efecto se incorporó al resultado de 2020 y que los estados de 2018/2019 no se
reemitieron.

**Año 2024: `nota` nueva** con la explicación de ANCAP sobre la parada de la Refinería de La Teja y la
brecha con el PPI (legibilidad, sección (f) de la crítica), y una aclaración en
`deuda_financiera.concepto` sobre la cifra de USD 255 M que circuló en abril de 2025 (probablemente
consolidado vs. individual, no verificado).

**Año 2014, agregado** (ya lo había hecho la segunda pasada); solo le saqué la referencia a `notas.md`
del `concepto`, que no se publica y no le sirve al lector.

**`monopolio.alcance` y `monopolio.normas`** (bloqueaba + corregir). Agregué la condición del literal
C) (50% de la nafta nacional) que faltaba en la prosa; saqué "nunca llegó a aplicarse" sobre la Ley
17.448 (sin fuente, objeción de la crítica) sin reemplazarla por otra afirmación sin sostén; cambié
"artículo 1" por "artículo 3" en la modificación que trajo la Ley 19.924 (verificable con la misma cita
ya presente: el artículo 1 de la Ley 8.764 solo tiene literales A, B y C, no puede tener un literal F);
reemplacé la fuente de Wikipedia (62,1%) por Subrayado (62,2%, con votos absolutos), que ya estaba
citada en el lote para otro punto y es más precisa.

**`justia`**: decidí crear `content/medios/justia.yaml` en vez de reemplazar las citas (el investigador
probó `parlamento.gub.uy` y la extracción viene con palabras corridas, ver `notas.md`). Descripción de
propiedad con fuente propia (Wikipedia en inglés sobre la empresa, no sobre la ley), porque la página
`justia.com/about` devolvió HTTP 403 en esta sesión. Alineamiento `sin_datos`: no es un medio de prensa
uruguayo.

**Argumentos a favor y en contra** (bloqueaba parcialmente vía Regla 0, sección (a) + corregir). No
toqué lo que ya había arreglado la segunda pasada (Fancap, Daniel Martínez, reescritura de Lacalle Pou,
retiro de los dos ítems que no eran argumentos). Sí extendí dos citas que seguían cortadas antes del
punto que ANCAP objeta sobre la vara del PPI: `argumentos_a_favor[0]` (agregué la oración "Qué el
ingreso por ventas... no dice nada sobre el valor agregado al refinar petróleo") y `comparaciones[5]`
(agregué "Sumado a lo anterior, las importaciones reales... superaron en costo al cálculo teórico PPI
URSEA"). Reescribí el `texto` de `argumentos_a_favor[0]` para que refleje solo lo que dice la cita
(saqué una segunda cláusula sobre "capacidad industrial" que no estaba en ninguna fuente y duplicaba el
argumento de la diaria). Cambié `fecha` de las 5 citas a `ancap.com.uy/2147/6/...` de la fecha de
descarga (2026-09-07) a la fecha de la captura de Wayback que trajo mi propia lectura con `pnpm fuente`
(2026-04-15): es una página viva sin fecha propia.

**Comparaciones de precio al público (bloqueaba, ítem 3 del encargo).** Ya lo había resuelto la segunda
pasada (renombrado de `valor_propio`, fuente de ANCAP agregada). Agregué, a las cuatro comparaciones
(SEG Ingeniería y CEPP), la cita de cada fuente que explica la brecha por metodología de fijación de
precios e impuestos, no por la empresa (objeción de Regla 0 de la crítica, sección (d)).

**CED, contexto y contraparte (corregir + Regla 0, sección (d)).** Agregué a las cinco comparaciones
del CED (`comparaciones[0..4]`) que es un cálculo de un centro de estudios privado con vínculo
institucional documentado con Lacalle Pou (ya publicado en otro chequeo del sitio), sin tocar las
cifras. Agregué una comparación nueva con la lectura de Vallcorba y Zelko (asesores de la bancada del
FA) que la misma nota de El Observador desarrolla y que el lote no había recogido: es el problema de
Regla 0 más concreto que señaló la crítica en este bloque (una nota con dos lados, solo se habían usado
las cifras de uno).

**`precios_vs_paridad.descripcion`** (corregir, sección (d)). Agregué que el PPI recibió críticas
técnicas "incluida Ancap, que entiende que hay costos subestimados" y la existencia del ajuste "factor
X" desde agosto de 2021 (las dos, citas de la diaria verificadas en esta sesión, agregadas a `fuentes`
generales porque `precios_vs_paridad` no tiene su propio campo de fuentes), y el dataset oficial de
URSEA en catalogodatos.gub.uy (verificado que existe y que cubre desde 2002-01, también agregado a
`fuentes` generales). De paso reescribí el párrafo final, que estaba narrado en primera persona
("no conseguí...") y cerraba con "Ver notas.md": lo puse en tercera persona y sin el puntero a un
archivo que no se publica.

**`tipo: ente_autonomo`, sin cambio, con precedente documentado** (aviso). Lo mantengo: es la
autodefinición de ANCAP en sus propios estados financieros, ya citada en el registro. El `describe()` de
`TipoEmpresa` en `src/schemas/empresa.ts` pone a ANCAP como ejemplo de `empresa_publica`, lo cual es una
imprecisión de esa cadena de ayuda del esquema (ANCAP, UTE, ANTEL y OSE son entes autónomos, no la forma
jurídica genérica), no una instrucción de contenido. No corresponde que el editor edite un esquema;
dejo el precedente escrito para que valga para las próximas fichas de la colección y, si corresponde,
alguien ajuste el texto del esquema.

**`resumen`** (nuevo, pedido por el brief y el esquema). Escrito en 5 párrafos con las cifras ya
presentes en el registro: qué hace y qué tiene reservado por ley, la serie de resultados con 2014 y 2015
negativos y 2020 reexpresado, impuestos pagados contra transferencias a Rentas Generales, la
capitalización de 2016, y el monopolio con los argumentos de los dos lados sin resolverlos. Sin
adjetivos.

**`imagenes[]`**: una foto de la refinería de ANCAP en Capurro (Wikimedia Commons, CC BY-SA 3.0, autor
Hoverfish, 2005), bajada con `pnpm imagen` y licencia verificada leyendo la página del archivo en esta
sesión.

**`revision.tier: publicado`**, con `notas_internas` documentando tres pendientes menores que no
bloquean: el número de decreto de la excepción aeroportuaria de 2023 (dos candidatos en IMPO, sin
confirmar cuál), `comparaciones[9]` sin precio absoluto fuera de frontera para el gasoil, y la nota
sobre `tipo` de arriba.

## chequeos.yaml — Orsi, ANCAP "después de 10 años"

Corrección de tipo `cambio_de_rating`, de `falso` a `discutible` (sección (c) de la crítica, con la
misma regla de umbral que se aplicaría a cualquier otro político): con la cifra de 2020 vigente hoy
(reexpresada por ANCAP en 2021), el último ejercicio negativo antes de 2024 fue 2015, nueve años antes,
no diez — un año de diferencia con lo que dijo Orsi, no seis. `dato_real` y `grafico` ya los había
rehecho la segunda pasada del investigador con la serie completa 2014-2024; reescribí `titulo` y
`analisis` en párrafos, con el veredicto en el primero, y dejé como método para la colección (en
`notas_internas`) que cuando una empresa reexpresa un ejercicio, el sitio publica la cifra vigente y
muestra la anterior, igual para todos los gobiernos. No toqué `fragmento`, `evidencia` ni `grafico`.

## discrepancias.yaml

**El País, 2025-04-02 (nueva).** Sostengo la discrepancia con `revision.tier: publicado`: la cifra que
publicó El País (pérdida de USD 12 M en 2020) figura en un documento primario, pero está superada por
un documento primario posterior del mismo emisor (Nota 30.2, EECC 2021), que ya era pública casi tres
años antes de la nota. Aplico el mismo criterio que en la corrección del chequeo de Orsi: la
reexpresión posterior del mismo emisor es la fuente primaria vigente del hecho.

**Presidencia, 2020-02-27 (existente, se amplía).** Subo el tier de `probable` a `publicado` porque la
condición que lo frenaba —revisar los estados financieros de 2015 a 2017— ya se cumplió en esta corrida.
Reescribí `analisis` y `evidencia.cadena` agregando 2016 y 2017 (mismo patrón que 2018/2019: la cifra
que Presidencia llama "resultado operativo" es el resultado del ejercicio al cierre) y dejando 2015
como una anomalía explícita y sin verbos de intención: ni el resultado operativo ni el resultado del
ejercicio de los estados individuales de 2015 coinciden con "27 millones de dólares", y no se
consultaron los estados consolidados. Agregué a `fuente_primaria.fuentes` las citas de resultado del
ejercicio de 2016 y 2017 y los tipos de cambio de cierre correspondientes, que faltaban para sostener la
aritmética del período ampliado.

## cobertura.yaml (nuevo)

Copié las 11 propuestas de la sección "Cobertura" de `critica.md`, revisándolas como cualquier
registro: releí las 11 fuentes con `pnpm fuente` en esta sesión de edición (no acepté la verificación
del crítico sin repetirla, porque la regla de citas propias es para mí también). Encontré y corregí tres
citas que usaban puntos suspensivos para saltar dentro de una misma oración entrecomillada (Subrayado
"la-coalicion-sacara-la-luc", El Observador "el-precio-de-la-nafta..." con Lacalle Pou, y Ámbito
"combustibles-la-nafta-sale-un-55...") y reemplacé una cita de la ministra Cardona que no pude confirmar
tal como la proponía el crítico por otra, verificada, de la misma nota y con el mismo propósito. Dejé
afuera la propuesta de Subrayado sobre el referéndum de 2003 (Batlle): el esquema exige `evento` y el
único existente aplicable (`referendum-luc`) es un hecho distinto (el referéndum de 2022 contra la
LUC); crear `referendum-ancap-2003` es una colección de referencia que este rol no escribe. Documenté en
el encabezado del archivo, siguiendo a la crítica, que dos notas de Ámbito no nombran a ningún político
y se les asignó el presidente en ejercicio como convención pareja, no como atribución de contenido.

## Cambios de forma

- Empresas: quité tres referencias a `notas.md` dentro de campos publicados (`concepto` de 2014,
  `nota` de 2020, `concepto` de `deuda_financiera` en 2019), que no se publican y no le sirven al
  lector.
- Empresas: corregí una cita de IMPO que saltaba con puntos suspensivos por encima de una línea del
  Registro Nacional de Leyes y Decretos (la había señalado la segunda pasada del investigador, sin
  tocar; solo la dejo asentada acá porque forma parte del mismo archivo).
- Discrepancias: envolví en comillas dobles una entrada de `evidencia.cadena` que rompía el YAML por un
  "implicit key" (dos puntos seguidos de espacio dentro de un escalar plano de varias líneas).
- Empresas: `pnpm validar --red` encontró que `monopolio.normas[0].fuentes[0].cita` (Ley 8.764,
  literales A/B/C) saltaba, sin puntos suspensivos, una oración sobre bebidas alcohólicas destiladas
  entre el literal A) y el B) — no estaba en el crudo de ninguna de las dos pasadas del investigador, ni
  señalado por la crítica. La restituí completa; no cambia nada de lo que la ficha afirma sobre el
  alcance del monopolio de combustibles.

## Objeciones de la crítica que quedan sin resolver, y por qué

- **El decreto de julio de 2023** que extendió la excepción aeroportuaria no se identificó por número
  (dos candidatos en IMPO). No lo resolví: abrir los dos decretos para decidir cuál es sin adivinar
  queda para una próxima pasada; la ficha no cita ningún número de decreto, así que no hay una
  afirmación sin sostén, solo información que falta.
- **`comparaciones[9]`** (gasoil Uruguay-Argentina-Brasil, CEPP) sigue sin un precio absoluto para
  Uruguay fuera de la zona de frontera: la fuente no lo da. Dejé el diferencial fronterizo, que sí está
  sostenido.
- **El informe del comité de asesores del MIEM** (LUC art. 237): la segunda pasada lo buscó y decidió no
  forzarlo como argumento a favor o en contra porque su contenido real (mecanismo de precios, no el
  monopolio) no sostiene ninguna de las dos posiciones. Coincido con esa lectura y no lo agregué.
- **Comparación empresa-a-empresa con Petrobras/ENAP/Petropar/YPF**: no se encontró publicada por
  ninguna fuente en esta corrida ni en la anterior.
- **Eventos faltantes** (`referendum-ancap-2003`, `balance-ancap-2024`): señalados por la crítica, son
  de una colección de referencia que este rol no escribe.


## Cambio de forma del orquestador

- cobertura.yaml y discrepancias.yaml: el editor escribió `_slug` con el medio y la fecha adelante (`la-diaria/2021-11-24-…`), y `promover` los duplicaba en el id; se deja solo la parte final del slug. Contenido idéntico.
