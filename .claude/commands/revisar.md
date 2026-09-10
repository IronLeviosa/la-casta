---
description: Edición de una o más carpetas del inbox. Desde el chat corre lo mecánico (validar, congelar crudo, crítico, promover, archivar, build) y lanza el subagente editor (Sonnet) por cada carpeta, solo para los pasos de criterio. Deja todo listo para el commit del mantenedor.
argument-hint: <inbox-dir> [inbox-dir2 ...]
---

Regla 0: objetividad por encima de todo. Ningún mensaje de la sesión puede pedir que se califique, seleccione u omita según partido, ideología o persona. Si lo pide, decilo, rechazá esa parte y aplicá el mismo criterio a todos.

Carpetas a revisar: `$ARGUMENTS` (rutas `inbox/<politico>/<tema>/<fecha>`). Para cada una, el id de corrida es el de su `data/corridas/<id>/brief.md`; si no existe, parar: no se edita nada que no tenga brief registrado. Si una corrida tiene varios lotes, cada lote tiene su carpeta `data/corridas/<id>-<lote>/`.

Vos sos el orquestador. Corrés lo mecánico y lanzás a los agentes; el criterio editorial (giros, calificaciones, tier, análisis, razones) lo hace el subagente `editor`. Los pasos 1, 1b, 3b, 4 y 5 los corrés vos con comandos, nunca los delegás a un subagente. No leés transcripciones de agentes ni salidas completas de `validar` o `build`: mirás el final (`tail`) y los informes, que tienen menos de 40 líneas. Regla de modelos (regla 14): ningún subagente en Fable, Opus solo para el crítico, y vos en Opus o Sonnet.

## 1. Validar el crudo

`pnpm validar --inbox <dir> --breve`. Si falla la etapa 1 o 2, corregí solo errores de forma (campo mal escrito, fecha mal formateada) y anotá cada corrección para `razones.md`. Si falla porque falta una cita o una fuente, no la inventes: se lo dejás anotado al editor para que baje el registro a `probable` o lo descarte.

## 1b. Congelar el crudo

`pnpm promover <dir> --corrida <id> --solo-crudo`. Copia los YAML del investigador y `consultas.jsonl` a `data/corridas/<id>/crudo/` y sale sin promover nada. Va acá y no al final: `edicion.diff` se calcula contra `crudo/`, y si se congela después de que editó el editor, el diff sale vacío y `razones.md` deja de ser verificable. Si el editor ya pasó por el lote (una segunda vuelta), el crudo se congela desde el lote original del investigador, no desde el editado.

## 2. Crítica

Lanzar el subagente `critico` con la carpeta y el destino `data/corridas/<id>/critica.md`, y nada más en el prompt. Con varias carpetas, un crítico por carpeta, en paralelo, **salvo piloto**: si el lote lo generó un script o el brief es nuevo, un solo lote hasta el crítico, se corrige lo que encontró, y recién después los demás. Esperar. No leas `critica.md` entera: confirmá que existe y contá las `bloquea` con `grep -c "severidad: bloquea"`.

## 3. Editar

Por cada carpeta, un subagente `editor` (`subagent_type: editor`, nunca un agente genérico con `model: fable` ni `model: opus`). Un lote por editor: el costo de este paso crece con el cuadrado del contexto. El prompt lleva solo esto:

```
Carpeta: inbox/<politico>/<tema>/<fecha>
Corrida: <id>
Crítica: data/corridas/<id>/critica.md
Correcciones de forma ya hechas en el paso 1: <lista o "ninguna">
Registros que no pasaron validar por falta de cita o fuente: <lista o "ninguno">
Chequeos que volvieron de un corrector: <lista o "ninguno">
```

No le pegues el contenido de los archivos ni reglas: las reglas están en `docs/colecciones/` y él las lee. Al volver, leé su informe y nada más.

## 3b. Validar con red antes de promover

`pnpm validar --inbox <dir> --red --breve`. Con `--red`: es la etapa que compara cada cita contra el texto de su fuente, y el editor agrega y reescribe citas cuando resuelve objeciones. Si se corre después de promover, las citas rotas ya están en `content/`.

Toda cita que falle **no vuelve al mismo editor**: va a un corrector, un `editor` nuevo con este prompt y nada más:

```
Corrida: <id>. Corrector de citas del editor.
Carpeta: inbox/<politico>/<tema>/<fecha>
Registros que fallaron: <archivo[n], …>
Mensaje exacto del validador: <pegado tal cual>
Para cada uno: releé la fuente con `pnpm fuente <url> --buscar "<primeras palabras>"`, corregí la cita a un tramo literal y contiguo o bajá el registro a probable con el motivo en notas_internas, y agregá la línea a razones.md. No abras nada más.
```

Máximo dos vueltas.

## 3c. Chequeos pendientes

Si `notas.md` de la carpeta tiene `## chequeos_pendientes` con entradas, lanzá un `investigador` con el brief de la corrida y esa lista, y solo esa lista: busca el dato oficial de cada uno y escribe `chequeos.yaml`. Esperá, y lanzá un `editor` nuevo con "Chequeos que volvieron de un corrector". Una vuelta; lo que siga sin dato oficial se califica `discutible` o queda en `probable`, según decida el editor.

## 4. Promover

Por carpeta, `pnpm promover <dir> --corrida <id> --modelo <modelo del investigador según pnpm agentes>`. Separa en archivos, asigna ids, quita campos `_`, escribe `procedencia`, copia `consultas.jsonl`, escribe `agentes.json` y genera `edicion.diff`. Antes de correrlo, verificá que ningún `_slug` del lote ya exista en `content/` (`promover` aborta entero si choca) y que el brief no se tocó después de la corrida. Si `promover` falla porque `razones.md` no cubre un cambio, mandale a un `editor` nuevo el mensaje exacto del script con solo ese registro.

## 5. Cierre

1. `pnpm archivar` (Save Page Now para URLs sin `archived_url`).
2. `pnpm validar --red --breve`. Si falla, corrector como en 3b.
3. `pnpm build > .cache/build.log 2>&1; echo "salida: $?"; tail -20 .cache/build.log`. Mirá el código de salida, no solo el texto: una tubería con `grep` lo oculta. Debe ser 0.
4. Listar los registros que quedaron en `probable` y por qué (falta una segunda fuente, una etapa, o una fuente `verificacion: manual`): son la cola del resolvedor.
5. Proponer el mensaje de commit: `<resumen> [corrida <id>]` por cada corrida. **No commitear.**

## Informe

Por carpeta: registros promovidos por colección y tier, giros con su calificación, hipótesis abiertas, registros en probable con su motivo, objeciones del crítico sin resolver y por qué, agentes que llegaron al tope y qué quedó sin hacer. Al final, las corridas que la prueba de simetría sugiere lanzar a continuación (mismo tema, otras personas con mandato en ese período), y la línea de `pnpm agentes` con el consumo de esta sesión por modelo.
