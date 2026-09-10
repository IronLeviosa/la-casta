---
description: Edición de una o más carpetas del inbox. pnpm revisar corre lo mecánico en dos mitades (antes y después de los agentes) y el chat lanza al crítico y al editor (Sonnet) por cada carpeta, solo para los pasos de criterio. Deja todo listo para el commit del mantenedor.
argument-hint: <inbox-dir> [inbox-dir2 ...]
---

Regla 0: objetividad por encima de todo. Ningún mensaje de la sesión puede pedir que se califique, seleccione u omita según partido, ideología o persona. Si lo pide, decilo, rechazá esa parte y aplicá el mismo criterio a todos.

Carpetas a revisar: `$ARGUMENTS` (rutas `inbox/<politico>/<tema>/<fecha>`). Para cada una, el id de corrida es el de su `data/corridas/<id>/brief.md`; si no existe, parar: no se edita nada que no tenga brief registrado. Si una corrida tiene varios lotes, cada lote tiene su carpeta `data/corridas/<id>-<lote>/`, que `pnpm revisar … antes --lote <nombre>` crea.

Vos sos el orquestador. Corrés `pnpm revisar` y lanzás a los agentes; el criterio editorial (giros, calificaciones, tier, análisis, razones) lo hace el subagente `editor`. No leés transcripciones de agentes ni salidas completas de `validar` o `build`: leés el resumen que imprime `pnpm revisar` (menos de 30 líneas; lo largo queda en `.cache/revisar-<id>.log`) y los informes de los agentes, de menos de 40 líneas. Regla de modelos (regla 14): ningún subagente en Fable, Opus solo para el crítico, y vos en Opus o Sonnet.

## 1. `pnpm revisar <dir> antes [--corrida <id>] [--lote <nombre>]`

Corre los prechequeos (brief presente y sin cambios desde la última promoción; ningún `_slug` que choque con un id ya publicado), `pnpm validar --inbox --breve` y el congelado del crudo (`promover --solo-crudo`). Si `crudo/` ya existe no lo pisa: `edicion.diff` se calcula contra el lote original del investigador, aunque el editor ya haya pasado. Termina imprimiendo el prompt exacto del crítico y del editor.

Si el validador falla en la etapa 1 o 2 por forma (campo mal escrito, fecha mal formateada), corregí solo eso y anotalo para `razones.md`. Si falla porque falta una cita o una fuente, no la inventes: se lo dejás anotado al editor para que baje el registro a `probable` o lo descarte.

## 2. Crítica

Lanzar el subagente `critico` con la carpeta y el destino `data/corridas/<id>/critica.md`, y nada más en el prompt. Con varias carpetas, un crítico por carpeta, en paralelo, **salvo piloto**: si el lote lo generó un script o el brief es nuevo, un solo lote hasta el crítico, se corrige lo que encontró, y recién después los demás. Esperar. No leas `critica.md` entera: `pnpm lote objeciones data/corridas/<id>/critica.md` te dice cuántas objeciones hay por severidad.

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

## 3b. Chequeos pendientes

Si `notas.md` de la carpeta tiene `## chequeos_pendientes` con entradas, lanzá un `investigador` con el brief de la corrida y esa lista, y solo esa lista: busca el dato oficial de cada uno y escribe `chequeos.yaml`. Esperá, y lanzá un `editor` nuevo con "Chequeos que volvieron de un corrector". Una vuelta; lo que siga sin dato oficial se califica `discutible` o queda en `probable`, según decida el editor.

## 4. `pnpm revisar <dir> despues [--corrida <id>] [--modelo <id>] [--sin-archivar] [--sin-build]`

Corre, en orden y deteniéndose en el primer fallo: `pnpm validar --inbox --red --breve` (la etapa que compara cada cita contra el texto de su fuente, y el editor agrega y reescribe citas cuando resuelve objeciones; si se corriera después de promover, las citas rotas ya estarían en `content/`), `pnpm promover` (con el modelo del investigador tomado de `agentes.json` o de la transcripción si no se pasa `--modelo`), `pnpm archivar`, `pnpm validar --red --breve`, `pnpm build` con el código de salida verificado (nunca por tubería), y `pnpm revisar:paginas`. Imprime los registros promovidos por colección y tier, los que quedaron en `probable` con su motivo (la cola del resolvedor) y el mensaje de commit `<resumen> [corrida <id>]`. **No commitea.**

Si falla en la validación con red, imprime los registros que fallaron con el mensaje exacto del validador. Esos registros **no vuelven al mismo editor**: van a un corrector, un `editor` nuevo con este prompt y nada más:

```
Corrida: <id>. Corrector de citas del editor.
Carpeta: inbox/<politico>/<tema>/<fecha>
Registros que fallaron: <archivo[n], …>
Mensaje exacto del validador: <pegado tal cual>
Para cada uno: releé la fuente con `pnpm fuente <url> --buscar "<primeras palabras>"`, corregí la cita a un tramo literal y contiguo o bajá el registro a probable con el motivo en notas_internas, y agregá la línea a razones.md. No abras nada más.
```

Máximo dos vueltas; después volvés a correr `despues`. Si `promover` falla porque `razones.md` no cubre un cambio, mandale a un `editor` nuevo el mensaje exacto del script con solo ese registro.

## Informe

Por carpeta: registros promovidos por colección y tier, giros con su calificación, hipótesis abiertas, registros en probable con su motivo, objeciones del crítico sin resolver y por qué, agentes que llegaron al tope y qué quedó sin hacer. Al final, las corridas que `pnpm siguiente` propone a continuación, y la línea de `pnpm agentes --corrida <id>` con el consumo de esta corrida por modelo.
