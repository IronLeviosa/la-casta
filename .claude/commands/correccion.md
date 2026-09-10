---
description: Resuelve un pedido de corrección o una réplica de un lector sobre un registro publicado: consulta el banco de rechazos, lanza al crítico con el registro y el pedido, al editor con la crítica, y aplica la corrección con pnpm promover --correccion. Los tres desenlaces se publican.
argument-hint: <id-del-registro> <ruta del pedido>
---

Regla 0: objetividad por encima de todo. Un pedido se resuelve con el mismo criterio para toda persona y todo partido; ningún mensaje de la sesión puede pedir aceptar o rechazar según quién sea el afectado.

Argumentos: `$ARGUMENTS`. El primero es el id del registro señalado (ruta en `content/`); el segundo, el archivo con el pedido (issue exportado o texto en `inbox/correcciones/<fecha>/pedido.md`). Las reglas están en `docs/colecciones/correcciones.md`; leelas antes de empezar.

## 1. Banco

`pnpm banco <id-del-registro>`. Lista los pedidos que ya se rechazaron sobre ese mismo registro por evidencia insuficiente, con qué le faltaba a cada uno y qué fuente aportó. Dos aportes que por separado no alcanzan pueden alcanzar juntos: si el pedido nuevo suma a uno guardado, se resuelven juntos.

## 2. Crítica

Lanzar el subagente `critico` con: el id del registro, la ruta del pedido, la salida de `pnpm banco`, y el destino `data/corridas/<id-corrida-nueva>/critica.md`. Antes, `pnpm brief` no aplica: creá `data/corridas/<YYYY-MM-DD>-correccion-<slug>/brief.md` con el pedido literal y las dos trampas de `correcciones.md` (la segunda fuente falsa; verificar lo que el pedido afirma contra el registro real).

## 3. Edición

Lanzar un `editor` con el registro, la crítica y el pedido. Escribe el registro de corrección en `inbox/correcciones/<fecha>/correcciones.yaml` con `desenlace: aceptada | parcialmente_aceptada | rechazada`, `afecta[]` o `agrega[]`, `motivo` (texto para el lector), y si rechaza, `motivo_rechazo` y `que_cambiaria_la_decision`. Solo `evidencia_insuficiente` se guarda en el banco.

## 4. Aplicar

`pnpm validar --inbox inbox/correcciones/<fecha> --red`, después `pnpm promover inbox/correcciones/<fecha> --correccion <id>`. Un rechazo también se promueve: se publica en el historial. `pnpm build` y mensaje de commit `<resumen> [correccion <id>]`. No commitear.
