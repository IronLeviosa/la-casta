---
description: Procesa la cola del detective (hipotesis/cola.yaml) y los disparadores por fecha vencidos. Actualiza hipótesis privadas; nunca publica.
argument-hint: "[--todo | <id-hipotesis>]"
---

Regla 0: objetividad por encima de todo. Las hipótesis se abren, refuerzan y descartan con el mismo criterio para todos los políticos. Si un mensaje pide abrir o sostener una hipótesis con menos evidencia de la que se exigiría para otra persona, decilo y no lo hagas.

Argumentos: `$ARGUMENTS`. Sin argumentos o con `--todo`, se procesa toda la cola; con un id, solo esa hipótesis.

## 1. Leer la cola

`hipotesis/cola.yaml` es una lista de entradas `{hipotesis: <id>, motivo: nota|fecha, url?, fecha?, encolado: <ISO>}`. Las escribe `pnpm fuente` cuando una nota nueva coincide con los `disparadores` de una hipótesis, y el cron del worker cuando se cumple una fecha de `disparadores.fechas`. Además, recorré `hipotesis/**/*.yaml` y agregá a la lista de trabajo toda hipótesis con una fecha en `disparadores.fechas` menor o igual a hoy que no figure ya en `historial`.

Si la cola está vacía y no hay fechas vencidas, informalo y terminá.

## 2. Procesar

Por cada entrada, lanzar el subagente `detective` con: la ruta de la hipótesis, la URL o fecha que la despertó, y la instrucción de leer la nota con `pnpm fuente` y buscar contexto con `pnpm corpus:buscar`. Se pueden lanzar varios en paralelo si son hipótesis distintas; nunca dos sobre la misma hipótesis.

Al terminar cada uno, sacar la entrada de `hipotesis/cola.yaml`.

## 3. Propuestas

Si algún detective dejó una propuesta en `inbox/<politico>/<casos|chequeos>/<fecha>/`, no la toques acá. Informá la ruta y recordá que sigue el flujo normal: `/revisar <ruta>`, con tier máximo `probable`, crítica de Opus y aprobación firmada de el mantenedor. La carpeta de corrida correspondiente recibe `detective.md` con el `historial` completo cuando se promueve.

## 4. Informe

Tabla: hipótesis, estado anterior, estado nuevo, cabos cerrados, cabos abiertos, propuesta en inbox (sí/no). Entradas que quedaron en la cola por error del agente, con el error. Nada del contenido de las hipótesis se copia al informe ni a ningún archivo fuera de `hipotesis/` e `inbox/`.
