# Correcciones (`content/correcciones/`)

Un registro publicado no cambia sin una pieza pública que lo explique. Primero se escribe el registro de corrección, que dice qué cambia, por qué y a qué ids afecta; después `pnpm promover <dir> --correccion <id>` sobreescribe solo esos ids y les pone `procedencia: {tipo: correccion, correccion}`. Sin la corrección escrita, `promover` se niega.

Un lote de corrección trae, por cada id de `afecta[]`, una copia entera del registro publicado con el cambio puntual adentro: `pnpm validar --inbox` no le exige más presentación de la que ya cumplía lo publicado (compara los hallazgos de la copia contra los del registro en `content/` y los que ya estaban ahí pasan de error a aviso, «ya estaba así en lo publicado»); un registro de `agrega[]`, al no tener versión publicada previa, se valida entero como cualquier registro nuevo.

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

`afecta[]` es lo que ya existe y cambia; `agrega[]` es lo que no existía y entra, con `procedencia.tipo: correccion`. Los ids nunca se renombran: los cambios de id van con `reemplaza:` (`docs/plan-correcciones-id.md`). El `motivo` es texto para el lector (`presentacion.md`): nombra los roles (el crítico, el editor, un lector) y los hechos, nunca carpetas, archivos ni comandos (`inbox`, `.yaml`, `notas.md`, `pnpm`); el validador lo avisa en la etapa `presentacion`. Las 32 correcciones anteriores al 2026-09-16 que traen esa jerga quedan como están: son historial y la página de correcciones es de proceso por diseño.

## Cambio de id

Un cambio de id (una fecha mal, un slug que no correspondía) es una corrección normal —casi siempre `error_factual`— con `reemplaza` en pares, aunque mueva varios registros a la vez:

```yaml
tipo: error_factual
desenlace: aceptada
afecta:
  - declaraciones/batlle/2016-10-24-impuestos-empezaran-cobrarse-enero-2017
  - chequeos/batlle/2016-10-24-rendicion-cuentas-2015-vigencia-enero-2017
agrega:
  - declaraciones/batlle/2016-09-21-impuestos-empezaran-cobrarse-enero-2017
  - chequeos/batlle/2016-09-21-rendicion-cuentas-2015-vigencia-enero-2017
reemplaza:
  - de: declaraciones/batlle/2016-10-24-impuestos-empezaran-cobrarse-enero-2017
    a: declaraciones/batlle/2016-09-21-impuestos-empezaran-cobrarse-enero-2017
  - de: chequeos/batlle/2016-10-24-rendicion-cuentas-2015-vigencia-enero-2017
    a: chequeos/batlle/2016-09-21-rendicion-cuentas-2015-vigencia-enero-2017
motivo: >-
  La entrevista con El Observador es del 21 de setiembre de 2016, no del 24 de octubre: las diez
  declaraciones que la citan y los cuatro chequeos que cuelgan de ellas quedaron con la fecha mal
  en el id. Se reemplazan por los mismos registros con la fecha correcta.
```

Cinco reglas:

1. **Una sola corrección**, aunque cambien catorce registros: el lector lee un solo motivo, no diez correcciones idénticas.
2. **Pares, no un id suelto**: cada `de` (el id viejo) va en `afecta`, cada `a` (el id nuevo) en `agrega`, y el par que los une va en `reemplaza`. `de` y `a` son de la misma colección.
3. **El viejo se retira**: `pnpm promover --correccion` borra cada `de` de `content/` después de escribir su `a`. Dos registros con la misma cita y distinta fecha no conviven "por las dudas".
4. **La URL vieja redirige**: una ruta del sitio genera, en cada URL que un `de` ocupaba, una página mínima que redirige a la del `a`, con el motivo por si el navegador no redirige solo.
5. **Las referencias se reescriben solas**: todo lo que en `content/` apuntaba a un `de` (un giro por `declaracion_antes`, un chequeo por `declaracion`) pasa a apuntar a su `a`; nadie edita esas referencias a mano.

`pnpm promover --correccion` no sabe deshacer un cambio de id: la forma de revertirlo es otra corrección al revés (un par nuevo con `de` y `a` invertidos).
