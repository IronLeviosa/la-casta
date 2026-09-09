# Razones — corrida 2026-09-09-anp-ocr-2016-2017-2021

Editor: Sonnet (`claude-sonnet-5`), por regla del mantenedor del 2026-09-07: el editor no corre en
Fable ni en Opus. Sin divergencia que declarar respecto de la tabla «Modelos por rol» de `CLAUDE.md`.

Lote: `inbox/empresas/anp/2026-09-09-ocr/`. Crítica: sección ANP de
`data/corridas/2026-09-09-ocr-huecos-ute-antel-anp/critica.md`. La vuelta 2 del investigador (ver
`## vuelta 2` de `notas.md` del lote) ya había resuelto los tres `bloquea` y los siete `corregir` de
esa sección antes de que este editor tomara el lote; verifiqué cada uno contra la cita y contra
`consultas.jsonl` y no encontré objeciones sin resolver. Lo que sigue es lo que cambié yo sobre ese
crudo ya corregido.

## Cambios sustantivos

- **`resumen`, párrafo 2 (cobertura).** «21 de los 23 ejercicios… no se encontró ningún balance de
  2007 ni de 2016… 2017 y 2021 usan la columna comparativa» → «22 de los 23… no se encontró ningún
  balance de 2007» + una oración sobre la lectura por OCR de 2016/2017/2021. Objeción `bloquea` de
  `critica.md` («resumen de ANP», ítems 1 y 2): el `resumen` publicado contradecía la tabla que el
  mismo lote traía. El crítico lo señaló pero no lo resolvió (fuera de su rol); lo resolví yo, punto
  por punto de `resumen_vs_tabla` en `notas.md`.
- **`resumen`, párrafo 4 (capitalizaciones/subsidios).** «los balances de 2017 a 2025 lo declaran» →
  «los balances de 2016 a 2025»: el balance de 2016, agregado en esta corrida, también declara
  expresamente que ANP no recibió subsidios (cita ya en el registro). Objeción `bloquea`, ítem 5 de
  `critica.md`.
- **`resumen`, párrafo 6 (deuda financiera).** Se agregó una oración sobre la composición de la deuda
  desde 2021 (tres préstamos, BID-2031, BID-2247 y FONPLATA, este último más de la mitad del total).
  No es una objeción explícita de `critica.md` sobre el `resumen` (la crítica lo pide para el
  `concepto` del campo, acción que la vuelta 2 del investigador ya cumplió), pero es el mismo hecho
  nuevo que aporta el documento y que el brief pide reflejar en el nivel de ficha completa
  («la deuda de 2021 con tres préstamos»); sin esta oración el lector solo lo ve si abre el
  `concepto` de un campo numérico.
- **`resumen`, párrafo 7 (segmentos por puerto).** «El desglose por puerto falta para… 2016, 2017,
  2021…» → se sacan los tres de la lista. «Salto como el más chico de todos ($ 26.000 en 2018)» →
  «($ 16.000 en 2017)»: con el segmento de Salto 2017 ahora cargado, ese es el valor más chico de la
  serie, no el de 2018. Objeción `bloquea`, ítem 3 de `critica.md`; el cambio del ejemplo de Salto no
  está en la crítica (que no llegó a comparar magnitudes entre años) pero se sigue directamente del
  dato que la vuelta 2 cargó: dejar «$ 26.000 en 2018» habría sido una afirmación falsa a la vista de
  la propia tabla.
- **`concepto` de `resultado_ejercicio` (2017 y 2021): eliminado.** Decía «Sin cambio de valor;
  confirmado ahora desde el balance propio…»: narraba el proceso de esta corrida, no qué es el
  número, y ningún otro año de la ficha lleva ese campo en `resultado_ejercicio`. No es una objeción
  puntual de `critica.md`, pero es la misma falla que el crítico marcó `corregir` en `transferencias`
  2017 y en `impuestos_pagados` 2021 bajo «`concepto` usado para narrar la corrida» («sistemático en
  ANP 2017/2021… unos doce campos»): apliqué el mismo criterio a los dos campos que la crítica no
  llegó a puntualizar uno por uno.
- **`concepto` de `transferencias_al_estado` (2017 y 2021): eliminado.** Misma razón; ningún otro año
  de la ficha lo lleva cuando no hay algo puntual que explicar (a diferencia de 2019 y 2020, que sí
  lo llevan porque están en base caja con un componente atrasado).
- **`concepto` de `deuda_financiera` 2017: reescrito.** «…confirmado desde la Nota 10 del balance
  propio de 2017 (cronograma de amortización…)» → se saca «confirmado desde…» y queda solo qué es el
  número y su estructura (Nota 10, cronograma de los dos préstamos BID). Objeción `corregir` de
  `critica.md` sobre el mismo campo en el lote UTE («`concepto` en una oración, sin narrar el
  proceso»), aplicada acá con el mismo criterio.
- **`concepto` del segmento Montevideo (2017 y 2021): recortado** a la fórmula estándar de la ficha
  («Ingresos netos (proventos) por puerto, no resultado; los balances no desagregan costos por
  puerto, solo ingresos.»), igual que 2016, 2018 y 2022. Antes decía «año agregado en esta corrida,
  antes ausente porque…»: la misma falla de «`concepto` para narrar la corrida» que el crítico marcó
  `corregir`, extendida a un campo que la crítica no puntualizó.
- **`nota` de nivel de año (2016, 2017, 2021): reescrita.** Las tres narraban el proceso de la
  corrida («en esta corrida», «no existía en la ficha publicada», «antes se creía no localizable
  (ver notas.md)» — esto último remite a un archivo privado que un lector del sitio no puede abrir).
  Quedan en una oración con lo específico del año (fuente OCR, qué confirma, qué compone la deuda de
  2021), sin remitir a `notas.md` ni narrar la corrección. El diccionario (`docs/diccionario-empresas.md`)
  define `nota` como «una oración con lo específico de ese año»; no es una objeción puntual de
  `critica.md`, pero se sigue del mismo principio que motivó sus objeciones de presentación.

## Verificación de lo ya resuelto por el investigador (sin cambios de mi parte)

- Segmento Montevideo 2016: cita cambiada de la fila de servicio a «Total proventos» — confirmado
  contra `pnpm fuente` en caché; cierra la suma de los ocho puertos (4.679.846).
- `impuestos_pagados` 2017 y 2021: notas completas restituidas desde el balance propio de cada año —
  confirmado, ocho conceptos en 2021 (IP, IRAE, tasa TC, IVA, IRPF, IRNR, Ley 15.097) suman
  1.614.167.856 = $ 1.614,2 M ya publicado.
- Salto 2017 agregado como octavo segmento ($ 0,016 M, sin `usd` por magnitud, declarado en
  `concepto`).
- `deuda_financiera` 2021 cargada desde la Nota 9 del balance propio (tres préstamos, total en pesos
  uruguayos 3.922.012.324 = valor ya publicado).
- `cotizacion` de los tres años con fuente propia (nota de moneda extranjera del balance propio).
- Encabezado de columnas de segmentos agregado como segunda fuente en Montevideo de cada año.
- `deuda_financiera` 2016 con tercera fuente (columna comparativa 2016 del balance de 2017).
- Precisión decimal de `pesos`/`usd` normalizada a la tolerancia del validador (ver
  `notas.md`, `## precision_decimales`); no toqué ningún valor, solo confirmé que el chequeo
  aritmético (`usd = pesos / cotizacion`, tolerancia 1,5 %) cierra en cada campo tras mi edición de
  los `concepto`.

## Cambios de forma

- Ninguno más allá de los listados arriba: no encontré fechas, nombres de campo ni unidades mal
  escritas en el crudo de la vuelta 2.

## Tier

`revision.tier: publicado` en el registro `empresas/anp` (ya lo traía el crudo). Cumple todas las
reglas de evidencia (fuentes `documento_oficial`, cita literal verificada con `--red --solo citas`,
166/166 exactas) y no queda ningún `bloquea` de `critica.md` sin resolver en la sección ANP.

## Objeciones de `critica.md` (sección ANP) — estado final

Las once objeciones de la sección ANP (3 `bloquea`, 7 `corregir`, 1 `sin_objecion`, según la tabla
resumen de `critica.md`) quedaron resueltas: dos de los tres `bloquea` (segmento Montevideo 2016,
impuestos_pagados 2017/2021 amputados) y los siete `corregir` por la vuelta 2 del investigador (tabla
en `## vuelta 2` de `notas.md`); el tercer `bloquea` (`resumen` desactualizado, que «Objeciones al
lote» punto 1 marca además como transversal a las tres fichas de esta corrida conjunta) por este
editor, junto con la limpieza de `concepto`/`nota` de presentación descripta arriba, que no es una
objeción puntual de `critica.md` pero sigue el mismo criterio. No queda ninguna objeción de la
sección ANP sin resolver.

## Corrección

`inbox/empresas/anp/2026-09-09-ocr/_correccion.yaml`, id `2026-09-09-anp-ocr-2016-2017-2021`,
`tipo: contexto_omitido` (no `error_factual`: verifiqué 2017 y 2021 campo por campo contra
`content/empresas/anp.yaml` publicado — `resultado_ejercicio`, `impuestos_pagados`,
`transferencias_al_estado` y `deuda_financiera` de los dos años tienen el mismo valor en pesos y en
dólares que el publicado; lo que cambia es el año agregado (2016), la evidencia y el desglose por
puerto, no ninguna cifra ya publicada).
