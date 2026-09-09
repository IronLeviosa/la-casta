## candidatos_giro

N/A (corrida de empresas, no de declaraciones de un político).

## hipotesis

N/A.

## casos_vistos

Ninguno.

## verificacion_manual

Ninguna URL de esta corrida quedó sin poder leerse: el único documento (balance de UTE 2017) se leyó
completo con `pnpm fuente --ocr --forzar` (147 páginas, 206,9 s).

## cobertura_del_periodo

| Año | Documento | Qué cambió | Qué lo confirma |
|---|---|---|---|
| 2017 | Estados Financieros de UTE al 31/12/2017 e Informe de Auditoría (Sección II, Estados Financieros Separados) | Antes: sin ninguna cifra (`nota: no se pudo extraer ninguna cifra con cita literal`, porque la primera lectura del PDF solo devolvió el índice, 1594 caracteres, sin forzar OCR). Ahora: `resultado_ejercicio` 14020,3 M, `deuda_financiera` 44411,3 M, `transferencias_al_estado` 10898,5 M, `impuestos_pagados` 11147,7 M, todos con `cotizacion: 28.807` (cierre 31/12/17). | El total de "Fondos aplicados al financiamiento" y la reconciliación de caja no se verificaron por arithmetic (UTE no trae, para 2017, un estado de origen y aplicación de fondos con el detalle línea por línea legible); la confirmación es documental directa: cada cifra sale de una nota o estado con su propio encabezado (Estado de Resultados Separado, Literal E, Literal D, nota de gestión de riesgo financiero) dentro del mismo PDF de 147 páginas, y el resultado individual (14.020.331.048) coincide, en la columna comparativa 2016 del mismo estado, con el resultado ya publicado de 2016 (12.189.879.271), lo que confirma que la lectura del bloque "Separados" (no "Consolidados") es la correcta. |

Los demás 22 años de la ficha (2003-2016, 2018-2025) no se tocaron en esta corrida.

## objeciones_al_brief

Ninguna. El brief pide el mismo criterio de OCR para un año de UTE, sin distinción de gobierno o
partido; se aplicó igual que a ANTEL y ANP.

## notas_metodologicas

- El PDF de UTE 2017 trae **dos** juegos de estados financieros en el mismo archivo: "Sección I —
  Estados Financieros Consolidados" y "Sección II — Estados Financieros Separados". Se usó
  exclusivamente la Sección II (individual, no consolidado), según la regla 2 del diccionario de
  empresas. El resultado consolidado (14.436.755.572) es más alto que el individual
  (14.020.331.048) porque consolida subsidiarias.
- `impuestos_pagados` usa el total del "Literal D" del balance separado (11.147.731.653 pesos,
  citado como "Total 11,.147.731.653" con una coma añadida por el OCR antes del punto — la cifra
  correcta, sin la coma espuria, es 11.147.731.653).
- No se cargó `segmentos[]` para UTE 2017. Corregido en la vuelta 2: el balance sí trae la
  NOTA 12 (Información por segmentos de operación), tanto en el bloque Consolidado como en el
  Separado, con Generación / Trasmisión / Distribución / Comercial / Servicios de consultoría / Otros.
  El motivo real de no cargarlo no es que falte la nota, sino que la propia nota declara que no es
  posible atribuir el resultado a cada segmento por separado porque la actividad está integrada
  verticalmente: todo el ingreso por venta de energía se expone dentro de un único segmento,
  "Comercial". Cargar ese único número como `segmentos[]` no aportaría información sobre qué parte
  del negocio gana y cuál pierde, que es lo que ese campo existe para mostrar, así que se mantiene sin
  cargar, ahora con la razón correcta documentada (ya estaba bien fundada en el `resumen` publicado).
- Regla 0: se aplicó el mismo umbral de OCR y de arithmetic-check al único año de este lote
  (2017) que se aplicaría a cualquier otro año de cualquier otro gobierno.

## vuelta 2

Corrida `2026-09-09-ocr-huecos-ute-antel-anp`, crítica en
`data/corridas/2026-09-09-ocr-huecos-ute-antel-anp/critica.md`. Tabla objeción → acción sobre
`finanzas[2017]` de UTE.

| Objeción (severidad) | Acción tomada |
|---|---|
| `impuestos_pagados` 2017: la cita es solo el encabezado del Literal D, sin ninguna cifra (**bloquea**) | Reemplazada por el cuadro completo del Literal D, leído de nuevo con `pnpm fuente --desde 505841/507441`, terminando en el `Total 11,.147.731.653` impreso. Se agregó `concepto` con una oración que dice que las trece líneas suman exactamente ese total y señala los dos artefactos de OCR (`11,.147.731.653` y `2.324.662,454`). |
| `capitalizaciones_del_estado` 2017 ausente, mismo documento ya leído trae la línea (**corregir**) | Cargada: pesos 93.6 M, usd 3.25 M (cotización 28.807), con cita contigua desde "Saldos finales al 31.12.16" hasta "Saldos finales al 31.12.17" (`pnpm fuente --desde 283100 --maximo 3600`), que cierra 84.280.269.850 + 93.619.467 = 84.373.889.317. La nota sobre los años 2015/2016/2018/2019 sin cargar todavía quedó en este `notas.md`, no en la ficha (para no alargar el `nota` de un año). |
| `transferencias_al_estado`: `titulo` atribuye la cita al «Literal E», que dice otra cosa; falta el desglose del pago (**corregir**) | `titulo` corregido a «Sección II, nota de Versión de resultados (Nota 5.18)»; la `cita` se reemplazó por el párrafo completo y contiguo («Durante el presente ejercicio... ejercicio 2016.», leído en `--desde 434000`), que incluye el desglose $ 2.379.232.920 / $ 4.051.880.000 / $ 4.467.400.000. Nota: el documento propio dice «Nota 5.15» (no «Nota 5.14», que era la referencia de la crítica); se usó lo que efectivamente imprime el balance. `concepto` resumido a una oración. |
| `deuda_financiera.concepto`: 45 palabras en una sola oración con paréntesis anidados (**corregir**) | Acortado a una oración («Deuda financiera neta de corto y largo plazo según la Nota 8 de los Estados Financieros Separados») y se agregó, en la misma oración con punto y coma, «mismo criterio que 2016» con el detalle. El esquema (`src/schemas/empresa.ts`) no tiene un campo `nota` a nivel de `Monto`, solo `concepto`, así que no hay dónde separar ambas frases en dos campos distintos: quedan juntas en `concepto`, más cortas que antes. |
| `resultado_ejercicio`: tres lecturas de OCR distintas de los últimos dígitos, sin decirlo (**aviso**) | Se agregó `concepto` con la reconciliación (13.824.475.699 + 195.855.349 = 14.020.331.048) y las tres lecturas divergentes, para que quede escrito por qué esa es la cifra y no otra. |
| `segmentos[]` de 2017: `notas.md` decía que UTE «no desagrega por segmento», lo cual es inexacto (**aviso**) | Reescrita la viñeta de `notas_metodologicas`: UTE sí trae la Nota 12, pero concentra todo el ingreso en un único segmento «Comercial» por integración vertical, así que cargar `segmentos[]` no aportaría información. La ficha no se tocó (sigue sin `segmentos[]`, correctamente). |
| `deuda_financiera`: definición no homogénea en la serie (2016-2017 «Deuda (i)» neta; 2018-2019 Nota 5.13 bruta) (**aviso**, preexistente) | No se tocó la ficha: el diccionario ya prevé decir esto una vez en `resumen`/`nota` de la ficha, y es tarea del editor al reescribir el `resumen` (ver más abajo). Queda señalado acá para que no se pierda. |
| Método (WebFetch declarado, no citado) (**aviso**, sin objeción real) | Sin acción: la crítica confirma que no viola la regla 2 y que ya estaba bien declarado en `consultas.jsonl`. |
| `comparaciones[]` de UTE, las 5 salen de la misma fuente (**aviso**, no es de este lote) | Sin acción en este lote (no estaba en el encargo de la vuelta 2); queda para una corrida de `content/analisis/`. |

### resumen_vs_tabla (para que el editor reescriba `resumen`)

Con `finanzas[2017]` cargado, el `resumen` publicado de UTE (que este lote no tocó, según indica el
encargo) queda contradicho en cinco puntos:

1. «El año 2017 no tiene cifra en esta ficha porque los estados financieros de ese ejercicio... están
   publicados por UTE solo como escaneos sin capa de texto extraíble.» → ya no es cierto: 2017 está
   cargado por OCR.
2. «con datos disponibles para 22 de los 23 ejercicios» → pasa a 23 de 23.
3. Resultado: «positivo en los diecinueve restantes, entre USD 69,5 millones (2004) y USD 430,5
   millones (2014)» → 2017 (USD 486,7 M) es nuevo máximo de la serie.
4. Tributos: «estuvo entre USD 152,4 millones (2021) y USD 333,6 millones (2025)» → 2017 (USD 387,0 M)
   es nuevo máximo.
5. Versión de resultados: «entre cero (2009, sin adelanto ese año) y USD 323,2 millones (2018)» → 2017
   (USD 378,3 M) es nuevo máximo.

No se reescribió el `resumen`: el encargo de esta vuelta 2 es dejar la lista para el editor, no
tocar el texto.
