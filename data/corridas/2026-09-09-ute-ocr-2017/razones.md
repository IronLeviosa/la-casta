# Razones — corrida 2026-09-09-ute-ocr-2017

Editor: Sonnet (`claude-sonnet-5`), por decisión del mantenedor del 2026-09-07 (regla 14 de
`CLAUDE.md`): ningún subagente corre en Fable sin permiso explícito, y Opus queda reservado para
el crítico. Este archivo documenta cada cambio no trivial sobre el crudo del investigador
(`inbox/empresas/ute/2026-09-09-ocr/empresas.yaml`), con referencia a la objeción de
`data/corridas/2026-09-09-ocr-huecos-ute-antel-anp/critica.md` (sección UTE) cuando corresponde.

El investigador ya había resuelto, en su "vuelta 2" (`notas.md`), los dos `bloquea` y los tres
`corregir` de la sección UTE antes de que este lote llegara al editor: la cita de
`impuestos_pagados` 2017 pasó del encabezado sin cifras al cuadro completo del Literal D con su
`Total`; el `titulo` de `transferencias_al_estado` 2017 dejó de atribuirse al "Literal E" y pasó a
la nota de Versión de resultados (Nota 5.18), con el desglose del pago en `concepto`;
`capitalizaciones_del_estado` 2017 se cargó (USD 3,25 M); y el `concepto` de `deuda_financiera`
2017 se acortó. Verifiqué las cinco reescrituras releyendo las citas del lote contra la crítica
(coinciden en cifras y en los tramos citados) y no encontré nada más para corregir en esas cinco
objeciones.

## 1. Reescritura del `resumen` en los cinco puntos que `resumen_vs_tabla` señaló (objeción "resumen
   (ficha completa)", bloquea)

Con `finanzas[2017]` cargado, cinco afirmaciones del `resumen` quedaban contradichas por la propia
tabla. Verifiqué cada una contra los valores ya cargados en `finanzas[]` (no solo contra lo que
dice la crítica) antes de reescribir:
- "con datos disponibles para 22 de los 23 ejercicios" → "para los 23 ejercicios" (2017 ya tiene
  las cinco magnitudes).
- "positivo en los diecinueve restantes" → "positivo en los veinte restantes" (los tres años
  negativos, 2006/2008/2012, no cambian; los ejercicios positivos pasan de 19 a 20 sobre 23 años).
- Máximo de resultado: "USD 430,5 millones (2014)" → "USD 486,7 millones (2017)". Confirmado
  extrayendo el campo `usd` de `resultado_ejercicio` de los 23 años del propio archivo: 2017 es el
  máximo de la serie completa 2003-2025.
- Máximo de tributos: "USD 333,6 millones (2025)" → "USD 387,0 millones (2017)". Mismo control
  sobre `impuestos_pagados.usd` de los 23 años: 2017 es el nuevo máximo.
- Máximo de versión de resultados: "USD 323,2 millones (2018)" → "USD 378,3 millones (2017)". Mismo
  control sobre `transferencias_al_estado.usd`: 2017 es el nuevo máximo.
- Se eliminó la oración "El año 2017 no tiene cifra en esta ficha porque los estados financieros de
  ese ejercicio... están publicados por UTE solo como escaneos sin capa de texto extraíble.", que
  después de esta corrida es falsa; no se agregó una oración que la reemplace porque la tabla ya
  muestra el año.

No toqué ninguna otra parte del `resumen`: el encargo de esta corrección lo limitó a estos cinco
puntos, que son exactamente los que `resumen_vs_tabla` (notas.md del investigador, sección "vuelta
2") señaló como contradichos por la tabla nueva.

## 2. Pendiente declarado, no resuelto: capitalizaciones de 2015, 2016, 2018 y 2019 (objeción
   `capitalizaciones_del_estado — ausente`, corregir, parte 2 del `accion_sugerida`)

La crítica pidió, además de cargar `capitalizaciones_del_estado` 2017 (hecho por el investigador),
"anotar como pendiente que 2015, 2016, 2018 y 2019 tienen la misma línea sin cargar (2016:
$ 81.250.652 en el mismo estado); si no se cargan todos, decirlo en el resumen, no dejar el hueco
mudo". No cargué esos cuatro años (excede el alcance de esta corrección, que es releer un único
documento de 2017) y decidí no tocar el `resumen` para señalarlo, porque el encargo de esta
corrección restringe los cambios de `resumen` a los cinco puntos de la sección 1. Dejo la
declaración en `revision.notas_internas` de la ficha (no releí yo mismo el balance de 2016 para
confirmar el monto que cita la crítica) y acá, para que quede visible y no se pierda en una
corrida siguiente que cargue esos cuatro años.

## 3. Avisos de la crítica: sin cambios adicionales

Los tres avisos restantes de la sección UTE no requerían acción del editor: la nota sobre las tres
lecturas de OCR distintas del `resultado_ejercicio` 2017 y la corrección de la viñeta de
`notas_metodologicas` sobre `segmentos[]` ya las había resuelto el investigador en la vuelta 2; la
definición no homogénea de `deuda_financiera` (2016-2017 neta, 2018-2019 Nota 5.13) es preexistente
y queda señalada en `revision.notas_internas`, no en el `resumen`, por el mismo motivo de alcance
de la sección 2; y las cinco `comparaciones[]` que salen de la misma fuente (pv magazine) quedan
para una corrida de `content/analisis/`, como ya lo dice la crítica.

## Cambios de forma

Ninguno: no encontré fechas, nombres ni cifras mal escritas fuera de lo ya cubierto arriba.

## Tier

`publicado`. Los dos `bloquea` y los tres `corregir` de la sección UTE de la crítica quedan
resueltos (dos por el investigador en la vuelta 2, uno —el `resumen`— por esta corrección). No hay
`verificacion: manual` ni fuente sin archivar en este lote: las cinco fuentes de `finanzas[2017]`
son el mismo documento oficial (Estados Financieros de UTE al 31/12/2017), tipo `documento_oficial`.

## Validación

`pnpm validar --inbox inbox/empresas/ute/2026-09-09-ocr`: 0 errores (esquema, referencias, tiers,
simetría), 23 avisos (ninguno de UTE excepto el ya conocido de `comparaciones[]` de la misma
fuente).
`pnpm validar --inbox inbox/empresas/ute/2026-09-09-ocr --red --solo citas`: 156 citas, 0 errores
(155 exactas, 1 aproximada con similitud 0.99 — la cita de Roberto Bentancor, preexistente, con
comillas tipográficas en la fuente donde el registro usa comillas rectas; no la tocó este lote).
