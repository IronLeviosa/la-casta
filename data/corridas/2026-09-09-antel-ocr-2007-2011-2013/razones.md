# Razones — corrida 2026-09-09-antel-ocr-2007-2011-2013

Editor: Sonnet (`claude-sonnet-5`), por la regla de modelos del mantenedor del 2026-09-07: el editor
no corre en Fable ni en Opus (CLAUDE.md, «Reglas para agentes», punto 14). Crítica de referencia:
`data/corridas/2026-09-09-ocr-huecos-ute-antel-anp/critica.md`, sección ANTEL.

## Criterio de `impuestos_pagados` (2007, 2011, 2013) — decisión propia

El lote (vuelta 2) llegó con 2007 manteniendo `impuestos_pagados` ($ 4.064,9 M) con una salvedad en
`concepto`, y 2011/2013 con el campo removido por «no publiques la suma [si no hay Total impreso ni
segundo documento]». `notas.md` señaló explícitamente la tensión y pidió que decidiera el criterio.

Decisión: **remover también `impuestos_pagados` de 2007**, para que los tres años queden simétricos
(ausentes). Motivo: ninguno de los tres balances imprime una línea de Total; ninguno tiene un segundo
documento que confirme la *suma*; y la única confirmación interna que tiene 2007 (Impuesto al
Patrimonio, $ 307.815, repetido en dos notas del mismo documento) cubre un solo concepto de quince, el
7,6 % del total — no alcanza para certificar los catorce restantes ni la suma. El fuerte respaldo que
sí tiene 2007 (el coeficiente de reexpresión 1,0643 idéntico en cuatro magnitudes) confirma que el OCR
de *ese* documento es confiable, pero no confirma la suma de `impuestos_pagados` porque ese campo es
nuevo: no existía un valor previamente publicado con el que cruzarlo. Aplicar a 2007 la misma regla que
a 2011/2013 (objeción de la crítica, severidad `corregir` en los tres años, con la opción explícita de
«el campo baja de este lote y espera») es el umbral parejo entre los tres gobiernos que cubre el lote
(Vázquez I, Mujica). Efecto práctico: el campo queda ausente en 2007 igual que antes de esta corrida
(no hay retroceso de dato publicado), y el `resumen` no necesita tocar el párrafo de años con impuestos
pagados (sigue siendo «cuatro años: 2008, 2010, 2012 y 2014»).

Quité el bloque `finanzas[2007].impuestos_pagados` completo (valor, `concepto`, tres fuentes) y
reescribí `finanzas[2007].nota` para que explique la ausencia con la misma frase que ya usan 2011 y
2013 («la nota no imprime un total ni hay un segundo documento que confirme la suma»).

## Concepto y nota de una oración (regla de presentación)

`finanzas[2007].resultado_ejercicio.concepto`, `.deuda_financiera.concepto` y
`.transferencias_al_estado.concepto` traían dos oraciones cada uno (la cifra actual y, en una segunda
oración separada, la cifra vieja con su origen). Los recorté a una oración cada uno, moviendo la
explicación de «antes tenía X, la misma partida reexpresada» a una cláusula con punto y coma dentro de
la misma oración, igual que ya hace el `concepto` publicado de 2008. Apliqué lo mismo a
`finanzas[2007].nota`, `finanzas[2011].nota` y `finanzas[2013].nota`, que en el crudo tenían dos
oraciones (una sobre qué cambió, otra sobre `impuestos_pagados`); las uní en una con punto y coma. La
primera versión de la unión en 2011 medía 381 caracteres y el validador la marcó (`--inbox`, aviso de
«nota de más de 300 caracteres»); la recorté a 279 sin perder la información (cotización, campos que se
recalculan, motivo de la ausencia de impuestos).

También agregué la salvedad de `cotizacion implícita, no una tasa impresa en el balance` al `concepto`
de `finanzas[2007].deuda_financiera`: `notas.md` (tabla de la vuelta 2) decía que esa salvedad ya
estaba en los tres años, pero en el crudo solo estaba en 2011 y 2013; en 2007 faltaba. La agregué para
que los tres años digan lo mismo sobre el origen del tipo de cambio.

## Dólares de 2011 recalculados con la cotización propia — hallazgo no señalado por la crítica

Al comparar el crudo contra `content/empresas/antel.yaml` publicado, encontré que el lote ya traía
`resultado_ejercicio.usd` (144,7 → 155,5) y `transferencias_al_estado.usd` (90,2 → 96,9) de 2011
cambiados respecto de lo publicado, pero el `concepto` de ambos campos decía «sin cambio de valor» (sin
mencionar el dólar) y la `nota` del año decía «resultado, transferencias y segmentos no cambian de
valor; se corrige el dólar de la deuda» — que es inexacto: el dólar también cambia en resultado y
transferencias, y no cambiaba (todavía) en los tres segmentos, que seguían con el dólar viejo (291,4 /
153,9 / 386,5, calculado con ~21,4, la tasa de la columna comparativa del balance de 2012) mientras el
resto del año ya usaba la cotización propia de 2011 (19,9, de la Nota 5 del balance individual propio).
Esto no es un error del OCR: es una inconsistencia dentro del mismo año, entre campos que deben usar la
misma tasa de cierre.

Recalculé los tres segmentos con 19,9 (Telefonía 291,4→313,0; Servicios de datos 153,9→165,4; Servicio
móvil 386,5→415,3; verificación cruzada: la suma de los tres, 893,7, coincide con pesos totales del
cuadro, 17.793,2, dividido por 19,9) y reescribí los `concepto` de `resultado_ejercicio` y
`transferencias_al_estado` de 2011 para que digan qué dólar viejo reemplazan y por qué (antes: tipo de
cambio de la columna comparativa del balance de 2012; ahora: cotización propia del balance individual
de 2011). Reescribí también `finanzas[2011].nota` para reflejar que los cuatro campos —no solo la
deuda— tienen el dólar corregido. Este cambio no estaba en la lista de objeciones de la crítica (que
solo revisó el dólar de `deuda_financiera`); lo agrego en la corrección de todos modos porque dejarlo
sin corregir habría publicado una ficha con dos tasas de cambio distintas para el mismo año, que es
exactamente el tipo de inconsistencia que la Regla 0 pide corregir con el mismo rigor en cualquier año.

## Resumen

Actualicé las cifras de segmentos de 2007 en el párrafo de segmentos (Telefonía 9.034,3→8.488,5;
Servicio móvil 4.950,4→4.651,4) y reescribí la oración sobre qué años tienen `impuestos_pagados` para
que distinga el motivo de 2009 (columna comparativa que no repite la nota) del de 2007/2011/2013
(balance propio sin línea de Total ni segundo documento), en vez de agruparlos a los cuatro bajo la
misma explicación, que dejó de ser cierta para tres de ellos. El resto del `resumen` (comparación en
dólares 2003-2007, capital, deuda, dictamen de auditores) no necesitaba cambios: ninguna cifra citada
ahí de 2007/2011/2013 cambió de una manera que afecte esos párrafos.

## Objeciones de la crítica ya resueltas por el investigador (vuelta 2), verificadas por mí

`transferencias_al_estado.usd` 2007 revertido a 84,5 con la fuente restituida; fuentes de corroboración
de 2007 (`Datos Financieros y Operativos Relevantes`, balance de UTE 2007) repuestas; `concepto` de
`deuda_financiera` y `transferencias_al_estado` de 2007 corregido (ya no dice «cita mal alineada»);
`nota` de 2007 declara la moneda de cierre; cita de `resultado_ejercicio` 2011 reemplazada por una
legible con etiquetas; `segmentos[]` de 2011 y 2013 restituidos (bug de la primera vuelta que había
vaciado el array, encontrado por el investigador y verificado por mí contra `content/empresas/antel.yaml`
publicado). No repetí la verificación línea por línea de estas fuentes porque `notas.md` la documenta y
`--red --solo citas` la confirma mecánicamente (200/200 exactas tras mis ediciones).

## Cambios de forma

Ninguno además de los ya descritos arriba (los recortes de `concepto`/`nota` a una oración son de
presentación, pero los dejo documentados arriba porque tocan el mismo texto que los cambios de fondo).

## Validación

`pnpm validar --inbox inbox/empresas/antel/2026-09-09-ocr`: 0 errores (609 registros, 22 avisos
preexistentes, ninguno de este lote). `pnpm validar --inbox inbox/empresas/antel/2026-09-09-ocr --red
--solo citas`: 200/200 citas exactas, 0 errores. La corrección
(`inbox/empresas/antel/2026-09-09-ocr/_correccion.yaml`) se validó a mano contra
`esquemasPorColeccion['correcciones']` (`src/schemas/correccion.ts`): sin errores.
