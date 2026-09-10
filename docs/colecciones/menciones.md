# Menciones (`content/menciones/`)

A quién cita la persona como autoridad, a quién reivindica y a quién critica. Alimenta la sección «Referentes» de cada ficha.

## Campos

`politico`, y uno de `referente` (slug de `content/referentes/`) o `politico_mencionado` (slug de `content/politicos/`, cuando menciona a otro político cubierto), `fecha`, `cita` (literal, con la salvedad del propio hablante si la hubo), `contexto`, `sentido: positivo | negativo | neutral`, `evidencia`. Ejemplo en `docs/ejemplos/mencion.yaml`.

## Investigación

Si el referente no existe en `content/referentes/`, se propone en `notas.md` bajo `referentes_faltantes` con nombre, tipo (`persona | organizacion | obra | corriente`) y una línea neutral; el editor lo crea.

## Edición

`sentido` según lo que la cita dice, no según lo que se infiere: un contrafáctico sobre qué habría hecho el rival es `neutral`, no `negativo`. Si el crítico propone otro sentido, se deja anotado en `notas_internas`.
