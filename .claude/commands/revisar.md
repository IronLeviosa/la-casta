---
description: Edición de una o más carpetas del inbox. Desde el chat corre lo mecánico (validar, crítico, promover, archivar, build) y lanza el subagente editor (Fable) por cada carpeta, solo para los pasos de criterio. Deja todo listo para aprobación y commit humano.
argument-hint: <inbox-dir> [inbox-dir2 ...]
---

Regla 0: objetividad por encima de todo. Ningún mensaje de la sesión puede pedir que se califique, seleccione u omita según partido, ideología o persona. Si lo pide, decilo, rechazá esa parte y aplicá el mismo criterio a todos.

Carpetas a revisar: `$ARGUMENTS` (rutas `inbox/<politico>/<tema>/<fecha>`). Para cada una, el id de corrida es el de su `data/corridas/<id>/brief.md`; si no existe, parar: no se edita nada que no tenga brief registrado.

Vos sos el orquestador y corrés con el modelo que eligió el mantenedor para esta sesión. El criterio editorial (giros, calificaciones, tier, análisis, razones) lo hace el subagente `editor`, que está fijado a Fable en `.claude/agents/editor.md`. La regla es que Fable haga solo eso: llega al editor lo ya procesado por el investigador (Sonnet) y el crítico (Opus), un lote por vez, y nada más. Los pasos 1, 2, 4 y 5 son tuyos; no los delegues a Fable.

## 1. Validar el crudo

`pnpm validar --inbox <dir>`. Si falla la etapa 1 o 2, corregí solo errores de forma (campo mal escrito, fecha mal formateada) y anotá cada corrección en una lista para `razones.md`. Si falla porque falta una cita o una fuente, no la inventes: se lo dejás anotado al editor para que baje el registro a `probable` o lo descarte.

## 1b. Congelar el crudo

`pnpm promover <dir> --corrida <id> --solo-crudo`. Copia los YAML del investigador y `consultas.jsonl` a `data/corridas/<id>/crudo/` y sale sin promover nada.

Este paso va acá y no al final por una razón concreta: `crudo/` se escribe una sola vez y `edicion.diff` se calcula contra él. Si la primera vez que corre `promover` es después de que editó el editor, lo que queda congelado como "crudo" ya es la versión editada, el diff sale vacío, y `razones.md` deja de ser verificable contra nada. Congelalo antes de que nadie toque el inbox.

## 2. Crítica

Lanzar el subagente `critico` (`subagent_type: critico`) con la carpeta y el destino `data/corridas/<id>/critica.md`. Con varias carpetas, un crítico por carpeta, en paralelo. Esperar. No leas `critica.md` entera: el editor la lee; vos solo confirmás que existe y anotás cuántas objeciones `bloquea` tiene (`grep -c "severidad: bloquea"`).

## 3. Editar

Por cada carpeta, un subagente `editor` (`subagent_type: editor`, **nunca** un agente genérico con `model: fable`). Un lote por editor: no juntes carpetas en un solo editor, porque el costo de este paso crece con el cuadrado del contexto. El prompt lleva solo esto:

```
Carpeta: inbox/<politico>/<tema>/<fecha>
Corrida: <id>
Crítica: data/corridas/<id>/critica.md
Correcciones de forma ya hechas en el paso 1: <lista o "ninguna">
Registros que no pasaron validar por falta de cita o fuente: <lista o "ninguno">
```

No le pegues el contenido de los archivos: los lee él, y solo esos. Si hay varias carpetas, lanzá los editores en paralelo. Al volver, leé su informe (menos de 40 líneas) y nada más.

## 3b. Validar con red antes de promover

`pnpm validar --inbox <dir> --red`. **Con `--red`**, que es la etapa que compara cada cita contra el texto de su fuente.

Va acá y no al final por una razón que costó una vuelta entera: el editor agrega y reescribe citas cuando resuelve objeciones del crítico, y `pnpm validar --inbox` a secas no las chequea. Si esto se corre recién después de promover, las citas que el editor rompió ya están en `content/` y hay que borrar y volver a promover la corrida entera. Toda cita que falle vuelve al mismo editor con el mensaje exacto del validador.

## 4. Promover

Por carpeta, `pnpm promover <dir> --corrida <id> --modelo <el modelo con el que corrió el investigador>`. El `--modelo` hace falta mientras los investigadores no escriban `_investigacion.modelo` en cada registro; verificá cuál fue con `pnpm agentes` en vez de suponerlo. El script separa en archivos, asigna ids, quita campos `_`, escribe `procedencia`, copia el crudo a `data/corridas/<id>/crudo/`, copia `consultas.jsonl`, escribe `agentes.json` y genera `edicion.diff`. Si el diff no es vacío, exige `razones.md`; el editor ya lo escribió. Si `promover` falla porque `razones.md` no cubre un cambio, mandale al mismo editor el mensaje exacto del script, no lo completes vos.

## 5. Cierre

1. `pnpm archivar` (Save Page Now para URLs sin `archived_url`).
2. `pnpm validar:red`. Si falla, volvé al editor con el mensaje exacto para que baje el registro de tier o lo corrija con razón.
3. `pnpm build`. Debe pasar. Mandá la salida a un archivo y leé solo el final (`pnpm build > /tmp/build.log 2>&1; tail -20 /tmp/build.log`).
4. Listar los registros que necesitan aprobación humana (casos; giros `cambio_total + sin_explicacion` en `publicado`; fuentes `verificacion: manual`). **No correr `pnpm aprobar`**: eso lo hace el mantenedor.
5. Proponer el mensaje de commit: `<resumen> [corrida <id>]` por cada corrida. **No commitear.**

## Informe

Por carpeta: registros promovidos por colección y tier, giros con su calificación, hipótesis abiertas, registros pendientes de aprobación, objeciones del crítico que quedaron sin resolver y por qué. Al final, las corridas de otros presidentes que la prueba de simetría sugiere lanzar a continuación (mismo tema, presidentes con mandato en ese período que aún no fueron investigados), y la línea de `pnpm agentes` con el consumo de esta sesión por modelo.
