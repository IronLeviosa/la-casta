# Razones de edición — 2026-09-16-correccion-batlle-fecha-ultima-entrevista

## Cambios de fondo

- declaraciones[0] (critica bloquea, contexto_omitido): el resumen decía «la fecha exacta... no está documentada» y usaba 24/10/2016 como cota; la bajada de la nota, ya releída completa en el corpus, da la fecha real (21/09/2016) y nombra al periodista que hizo la entrevista, Leandro Gómez. Se reescribe el resumen sin la afirmación falsa y se corrige el id por `reemplaza:` (ver correcciones.yaml). Tier se mantiene `probable`: sigue habiendo un solo grupo de medios (el-observador).
- declaraciones[1] (critica bloquea, contexto_omitido): mismo error y misma corrección que declaraciones[0]. Tier se mantiene `probable` por la misma razón (un solo grupo).
- chequeos[2] (critica corregir, contexto_omitido): el análisis decía «cuando habló, la ley todavía era un proyecto en el Parlamento», falso con la fecha vieja (24/10, posterior a la promulgación del 14/10). Se verificó con `pnpm fuente` la ficha de asunto 130303 del Parlamento: al 21/09/2016 (fecha real) la Cámara de Representantes había sancionado el 04/08/2016, el Senado modificó el 14/09/2016 y la Cámara volvió a sancionar recién el 05/10/2016, con promulgación el 14/10/2016 — todo eso posterior a la entrevista. El análisis ya decía «todavía no tenía sanción definitiva», que es exacto con la fecha real y la ficha del Parlamento; no hizo falta reescribirlo, solo confirmar la fuente. Calificación sin cambios (verdadero).

## Cambios de forma

- menciones[0], menciones[1], menciones[3] (critica corregir, contexto_omitido: "solo la fecha"): notas_internas decía «fecha corregida a 2016-10-24... la fecha exacta no está documentada»; se reescribe para reflejar que la bajada de la nota documenta 21/09/2016. Sin texto para el lector que mencione la fecha (no hacía falta tocar campos públicos).
- menciones[2] (critica corregir, contexto_omitido): mismo ajuste de notas_internas sobre la fecha, conservando sin cambios la nota sobre la lectura alternativa de "el pobre presidente" que ya había resuelto un editor anterior (se mantiene `sentido: neutral`).
- chequeos[0], chequeos[1], chequeos[3] (critica corregir/aviso, contexto_omitido/documento_previsible: "solo la fecha; el análisis no depende del día"): notas_internas tenían el paréntesis viejo "(24-25/10/2016)"; se corrige a "21/09/2016, publicada el 25/10/2016" y se actualizan las referencias cruzadas a los índices de este lote. El análisis y el título de chequeos[0] ya databan el hecho en "agosto o setiembre de 2016", coherente con la fecha real: no se tocan. El aviso de chequeos[0] sobre el PPI de URSEA de setiembre de 2016 (documento_previsible) queda sin resolver: excede esta corrección de fecha y no se corrió `pnpm inventario` por instrucción explícita del encargo; queda en notas.md como pendiente para una corrida de chequeos aparte.
- Los diez registros (critica bloquea, "lote (los diez)"): el cambio de id de 2016-10-24 a 2016-09-21 en los diez registros (2 declaraciones, 4 menciones, 4 chequeos) ya lo había hecho el editor anterior con `pnpm lote fijar` antes del corte; se documenta en `inbox/correcciones/2026-09-16/correcciones.yaml` con `reemplaza:` en pares, tipo `error_factual`, desenlace `aceptada`.

## Tier

- Los diez registros (declaraciones[0-1], menciones[0-3], chequeos[0-3]): se mantiene tier=probable en los diez. Motivo sin cambios respecto del editor anterior: nivel reportado con un solo grupo de medios (el-observador), entrevista exclusiva sin segunda fuente hallada en corpus ni web. La corrección de fecha no agrega una segunda fuente ni sube a documento_oficial ninguna evidencia.fuentes; solo corrige el id, el resumen y las notas_internas. Mismo umbral que se aplicaría a cualquier otro político con una sola nota exclusiva como fuente.

## Cambios de forma

- correcciones.yaml: se escribe la corrección de cambio de id (tipo error_factual, desenlace aceptada) con los diez pares {de, a} de 2016-10-24 a 2016-09-21, y un cambios[] con un campo id por par más los cambios de resumen (declaraciones) y notas_internas (menciones y chequeos) descritos arriba. Motivo para el lector sin jerga de proceso, según docs/colecciones/correcciones.md.

## Cambios de forma

- chequeos[1].dato_real.fuentes[0].cita (hallado por validar --red, no por la crítica): la cita decía '...déficit de 2,4% del PIB, con...' y el PDF de la Rendición de Cuentas 2013 del MEF trae '...déficit de 2,4% del PIB10, con...' (el 10 es la llamada a nota al pie, pegada sin espacio). Se corrige a la copia literal.
