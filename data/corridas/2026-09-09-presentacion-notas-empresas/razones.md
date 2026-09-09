# Razones — 2026-09-09-presentacion-notas-empresas

Corrección de tipo `presentacion` sobre `content/empresas/ancap.yaml`, `content/empresas/ute.yaml` y `content/empresas/antel.yaml`. Ningún cambio toca una cifra, una fuente, una cita, un hito, un argumento del monopolio, una comparación ni el campo `procedencia`: se verificó con un script que compara, campo por campo, el registro original contra el nuevo con `nota`, `concepto` y `resumen` excluidos de la comparación, y el resultado es idéntico en las tres fichas (311 fuentes en ANCAP, 172 en UTE, 248 en ANTEL, antes y después). El detalle completo de cada cambio de campo, por ficha, está en `inbox/reparaciones/notas-empresas-2026-09-09/_correccion.yaml`; acá va el motivo agregado, no la lista repetida.

## Motivo general

`pnpm validar` avisaba 41 veces (`Nota de N caracteres`) más 1 vez (`La misma nota se repite`) que un campo `nota` de `finanzas[]` pasaba de 300 caracteres o repetía la misma frase en tres años o más, en las tres fichas de series históricas cargadas el 8 de setiembre. La lista de control de presentación (CLAUDE.md, puntos 5 y 12) exige que las notas al pie de una tabla sean una oración y que lo largo quede plegado (acá, movido al resumen).

Al revisar el crudo con esa misma vara, el problema no estaba solo en `nota`: el campo `concepto` de cada monto (`resultado_ejercicio`, `impuestos_pagados`, `transferencias_al_estado`, `capitalizaciones_del_estado`, `deuda_financiera`) tenía el mismo patrón, sin que el validador lo mida (`scripts/validadores/referencias.ts` solo mide `finanzas[].nota` y `segmentos[].nota`). En ANTEL, además, `segmentos[].resultado.concepto` repetía la misma frase («Ingreso operativo del segmento, según la nota de información por división…») en unas 55 combinaciones de año y segmento entre 2007 y 2024, sin una sola palabra específica de cada año.

## Criterio aplicado (mismo para las tres fichas)

1. Se acortó a una oración (o un par de oraciones cortas, el mismo estilo que ya usaban las notas cortas de estos archivos) todo `nota` de `finanzas[]` y de `segmentos[]` marcado por el validador (>300 caracteres o repetido ≥3 veces), conservando solo el dato específico de ese año.
2. Se extendió el mismo criterio a `concepto`: cuando el texto de un `concepto` era la misma definición genérica del renglón (qué es "deuda_financiera", qué impuestos suma "impuestos_pagados", qué es la "versión de resultados") repetida sin cambios en tres años o más, esa definición se escribió una sola vez en un párrafo nuevo del `resumen`, titulado "Cómo leer la tabla", y se sacó (`concepto: null`, el campo es opcional) de los años donde no agregaba nada propio de ese año.
3. Cuando un `concepto` o una `nota` tenía, además de la parte genérica, un dato que no está en ningún otro lado (una cifra antes de una reexpresión, el motivo de un hueco, una cita de un balance, una comparación con una cifra difundida después), esa parte se conservó, acortada a una oración, y la parte genérica se sacó igual.
4. No se tocó ningún `concepto` corto (bajo 300 caracteres), no repetido, que ya citaba algo propio del año (la fecha del balance, la nota específica, el motivo de una cifra distinta): tocar esos también habría sido más trabajo sin beneficio para el lector y un criterio más estricto que el que aplica el propio validador.
5. En ANCAP, la nota repetida de Lubricantes/Gas Natural (2020-2023, 8 apariciones idénticas) se reemplazó por la explicación general en el resumen; en 2024, donde la misma nota traía además un dato propio (una cifra consolidada distinta), se conservó ese dato, acortado.
6. En ANTEL, la definición de que el campo `resultado` de cada segmento es siempre ingreso operativo (nunca resultado) y que desde 2022 es del bloque individual, no consolidado, pasó una sola vez al resumen; se sacó de las ~55 celdas donde no decía nada más.

## Verificación

- `node inbox/.scratch/verificar.mjs <slug> <archivo>`: compara el registro original de `content/empresas/<slug>.yaml` contra el nuevo, con `nota`, `concepto` y `resumen` excluidos; confirma que la cantidad de fuentes y el JSON de `finanzas[]`, `monopolio`, `hitos`, `comparaciones` y `precios_vs_paridad` son idénticos byte a byte en las tres fichas.
- `node inbox/.scratch/chequear_final.mjs` y `detectar_final.mjs`: repiten, sobre el resultado final, la misma detección de longitud (>300) y repetición (≥3 años) que usa el validador para `nota`, y la extienden a `concepto` y `segmentos[].resultado.concepto`; no queda ningún caso en las tres fichas.
- `pnpm validar --inbox inbox/reparaciones/notas-empresas-2026-09-09`: 0 errores; el único aviso que queda sobre el lote (`5 comparaciones salen de la misma fuente`, pv-magazine, ya presente en el original de UTE) es preexistente y no es un campo `nota`/`concepto`; esta corrida no lo tocó porque `comparaciones` está fuera del alcance del brief.
- `pnpm validar --inbox inbox/reparaciones/notas-empresas-2026-09-09 --red --solo citas`: sin cambios en ninguna cita, url ni fuente, tiene que dar el mismo resultado que antes de esta corrección (ver informe final para el resultado exacto).

## Cambios de forma (no auditables campo por campo, no van en `_correccion.yaml`)

Ninguno: el YAML se regeneró completo a partir del original parseado (`yaml` npm package, parse → editar → stringify), así que el estilo de bloque de algunos textos largos cambia de plegado (`>-`) a literal (`|-`) al volcarse de nuevo, sin que cambie el contenido de la cadena. No hay reordenamiento de campos más allá de anteponer `_slug` y `_investigacion` (pedido por el encargo) y quitar `procedencia` (la pone `pnpm promover`).
