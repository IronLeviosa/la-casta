# Giros (`content/giros/`)

Un giro compara dos declaraciones de la misma persona sobre el mismo objeto y las califica por `cambio` (`sin_cambio | cambio_parcial | cambio_total`) y por `explicacion` (`reconocido_explicitamente | justificado_por_contexto | sin_explicacion`). Los `sin_cambio` también se publican. Un giro `cambio_total + sin_explicacion` se publica con las mismas reglas que los demás: lo que lo sostiene es la cita literal de las dos declaraciones y la búsqueda documentada de una explicación.

## Campos

`politico`, `tema`, `_slug` (promover deriva el id), `declaracion_antes` y `declaracion_despues` (ids: `<politico>/<fecha>-<slug>`), `cambio`, `explicacion`, `analisis`, `evidencia_explicacion` (obligatoria si `explicacion` no es `sin_explicacion`), `revision`. Ejemplo en `docs/ejemplos/giro.yaml`. Los escribe el editor en `inbox/<dir>/giros.yaml`, con `_investigacion: {agente: editor, modelo: <id del modelo>}`.

## Investigación

El investigador no arma giros: deja en `notas.md`, bajo `## candidatos_giro`, los pares de registros (antes y después) que parecen un cambio de posición, con una línea de por qué y qué falta para confirmarlo. Busca tanto lo que confirma consistencia como lo que sugiere cambio, en el período completo (campaña, gobierno, oposición, posmandato).

## Edición: cómo calificar

Leer las dos citas, no los resúmenes. Preguntas en orden:

1. ¿Las dos afirmaciones son sobre lo mismo? Si una habla de impuestos y la otra de tarifas públicas, no es un giro: son temas distintos.
2. ¿La segunda contradice a la primera, la matiza o la cumple? `cambio_total` es contradicción directa; `cambio_parcial` es matiz, excepción o cambio de alcance; `sin_cambio` es consistencia, y se publica igual.
3. ¿Hay explicación? `reconocido_explicitamente` solo si dijo que cambió, con la cita. `justificado_por_contexto` solo si hay un hecho externo documentado entre las dos fechas, citado con fuente en `evidencia_explicacion`, que explique el cambio. Si no hay ninguna de las dos, `sin_explicacion`.

El análisis se escribe sin verbos de intención. No se sabe si mintió, si traicionó ni si se vendió; se sabe qué dijo, cuándo, qué pasó en el medio y qué explicación dio o no dio. `WebSearch` solo para documentar el hecho externo que justifica un giro, y la fuente que aparezca se lee con `pnpm fuente`.

## Crítica

Explicaciones alternativas aunque no convenzan: cambio de contexto (pandemia, crisis, cargo distinto), pregunta distinta, cita parcial, ironía, cita de un tercero. Se escriben todas.
