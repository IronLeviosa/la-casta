# Razones de edición — corrida 2026-09-07-empresas-correo

Editor: subagente `editor`, Sonnet (`claude-sonnet-5`), 2026-09-09, por la regla de modelos del
mantenedor (2026-09-07: el editor no corre en Fable ni en Opus). Crítico: Opus 5 (`critica.md`,
`claude-opus-5[1m]`), 5 bloquea + 14 corregir + 8 aviso. El lote llegó en "vuelta 2": el investigador
ya había resuelto los cinco bloqueantes (B1-B5) y las catorce objeciones "corregir" (C1-C14) antes de
que yo lo recibiera (ver `notas.md`, sección `## vuelta 2`, con la tabla objeción por objeción). Mi
trabajo fue: la decisión de fondo sobre el monopolio (B1/B2, que la crítica dejó explícitamente para
el editor), calificar `analisis.yaml`, decidir la discrepancia, escribir `resumen`, terminar de
resolver la presentación (C9, A3, A5, A7) y asignar tier.

## Regla 0

Sin instrucciones asimétricas en la sesión ni en el brief (el propio crítico lo confirma en
"Objeciones al brief"). El umbral aplicado a los argumentos del monopolio —mismo esfuerzo de
búsqueda para los dos lados, y si un lado queda más débil, decirlo en vez de inventar simetría— es
el mismo que se aplicaría a cualquier empresa o cualquier ley; lo dejo explícito en el punto 1. El
párrafo de "cómo le fue la ANC" del `resumen` cubre los tres gobiernos del período (Mujica, Vázquez,
Lacalle Pou, Orsi) con el mismo tratamiento y sin atribuir el déficit a ninguno, como pidió A7.

## Decisiones editoriales

1. **`monopolio.tiene: true`, mantenido; `alcance` reescrito de once párrafos a dos oraciones (B1).**
   El criterio es el del brief: "actividades reservadas por ley". La única que lo es, sobre las tres
   fuentes primarias del propio registro (Ley 19.009 arts. 2D, 9, 11, 19), es la emisión de valores
   postales; el Servicio Postal Universal se presta "en régimen de concurrencia", que la misma ley
   declara sinónimo de competencia, así que no es una reserva de mercado. El `alcance` que entregó el
   investigador ya decía esto correctamente (lo corrigió en la vuelta 2), pero en un párrafo de unas
   40 líneas con datos que ya están en otros campos (130 empresas privadas → `que_hace`; cuotas de
   mercado de Ursec → `analisis.yaml`; artículo 192 de la RC 2026 → hito). Lo dejé en dos oraciones:
   qué es lo único reservado, y cómo se financia el SPU (TFSPU + Rentas Generales) para que quede
   claro que no es un mercado cerrado. El detalle de la unanimidad del Senado y el directorio
   multipartidario, que estaba en el `alcance`, pasó al `detalle` del hito de la Ley 20.075 (decisión
   3, resuelve A7 también).
2. **`argumentos_en_contra` (fuente académica española) y `argumentos_a_favor` (Presidencia +
   sindicato), mantenidos tal como los dejó el investigador en la vuelta 2 (B2/C13).** La crítica
   pedía, si se mantenían, que `quien` y `texto` dijeran exactamente qué sostiene la fuente y sobre
   qué (no Uruguay, no la Ley 19.009, un mecanismo de financiamiento distinto) — ya lo hacen. Antes de
   aceptarlo hice dos búsquedas más (debate de la Rendición de Cuentas 2021 en el Senado, e
   interpelaciones o pedidos de informes recientes sobre el Correo), sin encontrar una voz uruguaya
   sobre este diseño específico (un pedido de informes de setiembre de 2025 sobre juicios en trámite,
   no sobre el diseño legal). Con eso, van 26 búsquedas entre investigador (10 en la primera vuelta +
   16 en la segunda) y editor (2) sin resultado: la ficha no puede fingir simetría inventando una
   voz que no existe. Publiqué la constancia de la búsqueda en el `resumen`, como pidió la
   instrucción del lote, en vez de solo dejarla en el campo `quien` del argumento.
3. **Hito de la Ley 20.075 (`detalle`): agregada la unanimidad del Senado y la composición
   multipartidaria del directorio (A7).** Estaba en el `alcance` que acorté (decisión 1); es
   justamente el dato que evita que un lector lea la medida como partidaria.
4. **Nueve notas de `finanzas[]` acortadas a una oración (C9): 2013, 2014 (eliminada), 2015
   (eliminada), 2017, 2019, 2020, 2021, 2022, 2023.** El validador ya las marcaba como aviso (>300
   caracteres); el crítico había pedido además sacar las referencias a nombres de campos del YAML
   ("ver impuestos_pagados") en la nota de 2015, que resultó más simple eliminar (era el mismo
   contenido, sobre unidades de medida, que no le aporta nada al lector: la página normaliza sola
   `unidades` a millones para el gráfico, según confirmó el propio crítico en A1). Lo que sí importa
   para el lector —el quiebre de definición de impuestos en 2020, la reconstrucción por OCR de
   2020-2021, la Abstención de Opinión de 2022-2023— quedó en una oración por año y una vez más,
   resumido, en el párrafo "Cómo leer la tabla" del `resumen`.
5. **`resumen` escrito de cero (siete párrafos), siguiendo el modelo de `content/empresas/ancap.yaml`.**
   Cubre: qué es la ANC; el resultado 2013-2025 por gobierno (Mujica, Vázquez, Lacalle Pou, Orsi), sin
   atribuir el déficit a ninguno; el subsidio año por año con su único quiebre (2013→2014), que es
   tanto lo devengado como lo cobrado en caja en los años en que se pudo cotejar (resuelve C3, con la
   oración que pedía la crítica en vez de agregar una segunda fuente por año, que no llegué a
   verificar en esta sesión); la exoneración de impuestos con su excepción y la deuda separada con el
   MEF que no es deuda financiera (resuelve A5); el quiebre de definición de impuestos en 2020 y la
   caída de la deuda financiera; el crecimiento de Logística contra el estancamiento de
   Correspondencia 2022-2025 (el dato que el crítico señaló en B5 como "la información más útil de
   toda la ficha"); el diseño del monopolio y sus argumentos (decisión 2); y un párrafo final "Cómo
   leer la tabla" con las convenciones que se repiten (quiebre de impuestos, columnas comparativas,
   Abstención de Opinión, y la convención de "Resultado del ejercicio" vs. "Resultado integral" que
   pedía A3).
6. **`empresas.yaml` → `revision.tier: publicado`.** Todas las cifras están en `documento_oficial`
   (estados contables auditados), el monopolio tiene los dos lados documentados con el mismo esfuerzo
   de búsqueda y la asimetría de calidad de fuentes declarada (decisión 2), y las cinco fuentes de
   los últimos bloqueantes de la crítica quedan verificadas por `--red` (130/130 citas exactas). Los
   límites que quedan (RC 2026 sin repartido, Tribunal de Cuentas 2022-2023 no buscado, balances
   2009-2012 sin cargar) están en `notas_internas` y no cambian ninguna cifra publicada.
7. **`analisis.yaml`: calificación de las 9 afirmaciones.** Cinco `verdadero` (resultado 2024, los
   dos aportes del MEF, ingresos operativos, retribuciones y cargas sociales): coinciden
   exactamente con el balance 2024. Una `impreciso` (costo de los servicios): el monto coincide, el
   porcentaje de suba que da la nota (5,8%) difiere 0,4 puntos del que sale del balance (5,4%),
   dentro del margen del 10% que no cambia el sentido. Tres siguen `discutible` (las tres cuotas de
   mercado de Ursec) porque el documento de Ursec expone esos datos en gráficos de imagen, no en
   texto verificable — no es un error de la nota, es un límite del documento oficial. La comparación
   de plantilla con 2020 también queda `discutible`: intenté cotejar la cifra de 2020 (1.752) en el
   balance propio de ese año y su Nota 18.A también está distorsionada por el OCR del escaneo (mismo
   problema que la crítica documentó para el Estado de Situación Financiera de 2020-2021 en
   `empresas.yaml`), así que no hay forma de confirmarla en esta corrida. `veredicto` reescrito para
   reflejar las calificaciones y explicar, sin decir si el medio "tuvo razón en general", qué cambia
   cada calificación. `revision.tier: publicado`.
8. **`discrepancias.yaml`: se publica.** El crítico dejó la decisión para el editor porque hay una
   lectura alternativa (que "seis años" describa el quinquenio revisado, no la racha completa). "
   Completó seis años consecutivos de déficit" es, en el uso corriente del español, una afirmación
   sobre la duración de la racha; el balance de 2019 (mismo estudio de auditoría) ya documentaba
   pérdidas recurrentes antes de 2020, y los balances propios 2013-2019 (cargados en este mismo lote)
   confirman resultado negativo todos esos años. Agregué el párrafo de decisión al `analisis`, sin
   verbos de intención, y `revision.tier: publicado`.
9. **`cobertura.yaml`: NO se entrega en este lote.** El crítico redactó tres registros emitibles
   (Infobae, 2022-10-07, un registro por cada uno de los tres partidos que nombra la nota en la misma
   oración, para no emitir solo el del partido cuyo director está citado) y cinco notas no emitibles
   por falta de sujeto político, con la misma justificación que usaron ANCAP y UTE esta semana. Los
   revisé y habría asignado `tier: publicado` a los tres — el borrador queda en
   `data/corridas/2026-09-07-empresas-correo/` para la próxima corrida —, pero los tres necesitan un
   evento en `content/eventos/` (`obligacion-contratacion-postal-estado-2022`) que no existe, y
   `content/eventos/` no es una colección que el editor pueda escribir (solo `content/medios/` y
   `content/referentes/`, por instrucción explícita de este rol). Entregar el archivo con una
   referencia rota habría bloqueado `pnpm validar --inbox` para todo el lote sin que yo pudiera
   resolverlo; lo dejo documentado acá en vez de fingir que está resuelto. Necesita una corrida
   semilla que cree el evento (o el mantenedor, a mano) antes de poder promoverse.

## Cambios de forma

- Corregidos tres casos donde una nota o un veredicto usaba dos puntos dentro de un escalar YAML sin
  el indicador `>-`, lo que rompía el parseo (`Nested mappings are not allowed`): `finanzas[2019].nota`
  de `empresas.yaml`, `veredicto` de `analisis.yaml`, y las tres `justificacion` de `cobertura.yaml`
  (borrador). No cambia contenido, solo la forma del YAML.
- `usd` de `deuda_financiera` en 2024 y 2025, y en 2015-2016, se dejaron con dos o tres decimales tal
  como los entregó el investigador: redondearlos a un decimal (la convención general del brief) rompe
  la verificación aritmética `usd = pesos / cotización` del validador (tolerancia 1,5%) en esos años
  por ser montos chicos. No es un error; es la razón por la que esos años tienen más decimales que el
  resto de la serie.

## Objeciones del crítico que no se siguieron del todo, y por qué

- **C3 (capitalizaciones: declarar caja vs. devengado)**: seguí la primera mitad de la
  `accion_sugerida` (una oración en el `resumen`) pero no la segunda (agregar el renglón del flujo de
  efectivo como segunda fuente en cada año donde ya está verificado). No alcancé a releer los cinco
  balances para tomar esa cita en esta sesión; la oración del `resumen` ya informa el hecho, que es lo
  que un lector necesita.
- **A4 (dictamen del Tribunal de Cuentas 2022-2023)**: no se buscó. Es un aviso, no bloquea
  `publicado`, y queda anotado en `notas_internas` para una corrida futura.
- **Objeciones al lote de la crítica sobre balances 2009-2012**: el investigador ya extendió la serie
  a 2013 en la vuelta 2 (y cargó 2025); 2009-2012 quedan documentados como disponibles y no cargados
  en `notas.md` (`anios_sin_balance`), igual que se hizo con ANCAP, UTE y ANTEL esta semana. No los
  cargué yo: es trabajo de investigación, no de edición.

## Registros de este lote que necesitan aprobación humana

Ninguno. No hay casos judiciales, ni giros `cambio_total + sin_explicacion`, ni fuentes con
`verificacion: manual` en `empresas.yaml`, `analisis.yaml` ni `discrepancias.yaml`. `cobertura.yaml`
no se entrega (decisión 9) y tampoco lo requeriría si se resolviera la referencia al evento.

## Validación

`pnpm validar --inbox inbox/empresas/correo/2026-09-07` (con los tres medios nuevos copiados
temporalmente a `content/medios/` y borrados después): 0 errores de esquema, 0 de referencias, 0 de
tiers. Con `--red`: 0 errores en `fuentes` (25 URLs verificadas) y 0 en `citas` (130/130 exactas).
`content/` quedó sin cambios míos (confirmado con `git status --short content/` antes y después).

## Mensaje de commit propuesto

`Correo Uruguayo: ficha de empresa pública 2013-2025, análisis de El Observador cotejado afirmación
por afirmación y una discrepancia sobre la racha de pérdidas [corrida 2026-09-07-empresas-correo]`
