# Correcciones (`content/correcciones/`)

Un registro publicado no cambia sin una pieza pública que lo explique. Primero se escribe el registro de corrección, que dice qué cambia, por qué y a qué ids afecta; después `pnpm promover <dir> --correccion <id>` sobreescribe solo esos ids y les pone `procedencia: {tipo: correccion, correccion}`. Sin la corrección escrita, `promover` se niega.

## Tipos

- Subir un registro de `probable` a `publicado` porque apareció la fuente que faltaba es una corrección de tipo `cambio_de_rating`: no hubo error, pero el lector que vio la versión anterior merece saber que cambió.
- Incorporar el registro primario de un hecho que estaba citado solo por la prensa, o cotejar las notas contra él, es de tipo `cotejo_con_primaria`.
- Un cambio de forma que no toca lo afirmado ni la evidencia (un título, el orden de las fuentes) es de tipo `presentacion`.
- Un pedido de un lector o una réplica entra al mismo proceso que todo lo demás: crítico, editor y corrección publicada.

## Los tres desenlaces se publican

Una corrección declara `desenlace: aceptada | parcialmente_aceptada | rechazada`, y los rechazos también se publican, con su fundamento, `motivo_rechazo` y `que_cambiaria_la_decision`. Un pedido desestimado en silencio es lo que el sitio promete no hacer. `promover` se niega a aplicar una corrección rechazada.

## La evidencia de los rechazos se acumula

El nivel `reportado` exige dos fuentes de distinto grupo, así que lo habitual es que dos aportes que por separado no alcanzan sí alcancen juntos. Los rechazos con `motivo_rechazo: evidencia_insuficiente` quedan en un banco que se consulta con `pnpm banco <id-del-registro>` **antes de resolver cualquier pedido**. Si se resuelve el segundo pedido sin mirar el primero, se rechaza dos veces una corrección que correspondía. Cuando la suma alcanza, la corrección lleva `aportes[]` con la fecha de cada aporte y cada rechazo reutilizado se marca con `superada_por`. Al rechazar, solo `evidencia_insuficiente` se guarda en el banco: marcar como `sin_evidencia_verificable` algo que traía una fuente real pero incompleta pierde esa evidencia para siempre.

## Dos trampas

- **La segunda fuente falsa.** Una nota que respalda el hecho pero no contiene la cita del registro no se suma a `evidencia.fuentes`: pasaría la validación de red y le daría al registro un segundo `grupo` con una fuente que no respalda lo que el registro afirma. Si prueba un hecho distinto, va como registro nuevo (`agrega[]`) o como evidencia de otra colección.
- **Lo que el pedido afirma sobre el registro se verifica contra el registro.** Un lector puede describir mal lo que el sitio dice. Se leen el `resumen` y la `cita` reales antes de aceptar la premisa del reclamo.

## Campos

`afecta[]` es lo que ya existe y cambia; `agrega[]` es lo que no existía y entra, con `procedencia.tipo: correccion`. Los ids nunca se renombran: los cambios de id van con `reemplaza:`. El `motivo` es texto para el lector (`presentacion.md`).
