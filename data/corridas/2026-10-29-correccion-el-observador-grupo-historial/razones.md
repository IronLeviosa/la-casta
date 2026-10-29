# Razones de edición — 2026-10-29-correccion-el-observador-grupo-historial

## Cambios de fondo

- medios[0] (crítica medios[0].grupo_historial[0], contexto_omitido, corregir): el tramo 1991-10-22 a 2022-05-04 pasa de grupo peirano a desconocido con fuentes vacías, sin partirlo. Ninguna de las tres fuentes del tramo dice quién controlaba la sociedad editora: la nota de fundación nombra promotores sin participaciones, la entrevista de 2024 muestra a Peirano como vendedor en plural y Wikipedia solo sostiene la fecha. Partirlo en 2010 con otro grupo sería inventar una fecha y un dueño: lo único documentado sobre Correa es que invirtió (Coletiva, 2011), sin monto ni fecha ni control. Busqué otra fuente con dueño con nombre (corpus, WebSearch, notas de aniversario de El Observador de 2021) y no apareció. El tramo werthein-hochbaum desde 2022-05-05 queda como estaba; grupo vigente y alineamiento no se tocan.

## Cambios de fondo

- medios[0] (crítica medios[0].propiedad.descripcion, contexto_omitido, corregir): descripcion reescrita por tramos con lo que las fuentes sostienen. Se agrega la propuesta de Viana Martorell de comprar La Mañana tal como la cuenta la nota de fundación (la nota no dice que Viana fuera uno de los socios fundadores, por eso no se cuenta nueve promotores), se declara que sí hay un cambio de socios documentado (la inversión de Correa, confirmada por el propio diario en junio de 2011 según Coletiva) y se reemplaza la inferencia 'figura bajo peirano porque vendió' por la razón del desconocido. No se escribió 'hacia fines de 2010': su única fuente es un despacho de enero de 2011 reproducido en blogs, con el nombre del titular cortado y 'hace pocos meses' sin fecha, y Coletiva dice 'acaba de' en junio; la fecha de entrada de Correa queda declarada como no documentada. No se nombra a la senadora que había afirmado la venta; la cita de Coletiva arranca después de su nombre. Verificado con pnpm fuente: nota de fundación, Wikipedia, Coletiva, Montevideo Portal y nota de cambio de accionistas.

## Cambios de forma

- medios[0] (crítica medios[0].grupo_historial[0].fuentes[2], aviso, presentacion): Wikipedia pasa a propiedad.fuentes como ancla de la fecha y el nombre original (cita nueva: 'Fue publicado por primera vez el 22 de octubre de 1991 con la denominación de El Observador Económico…'), con fecha y retrieved_at 2026-09-04, la bajada que registra el corpus. Las otras dos fuentes del tramo 1 (nota de fundación, Montevideo Portal) también pasan a propiedad.fuentes.

## Cambios de fondo

- medios[1] coletiva-net (crítica medios[0].grupo_historial[0], accion_sugerida): ficha nueva, pedida por el encargo del orquestador porque la ficha de El Observador cita Coletiva y un medio inexistente se documenta en el mismo lote. Sin dueño documentado (grupo coletiva-net como icndiario, alineamiento sin_datos): la única fuente leída que habla de él es su propia nota; una nota de ABC da Comunicación leída nombra a una publisher pero no al titular y no tiene fecha en el corpus, así que no se cita. Mismo umbral que icndiario.

## Tier

- medios[0] el-observador: publicado. Todas las citas nuevas verificadas con pnpm fuente; el crítico no dejó bloquea; el tramo desconocido con fuentes vacías está permitido porque la descripcion dice qué se buscó y no se encontró (corpus, WebSearch, notas de aniversario del diario de 2021). Mismo umbral que se aplicaría a cualquier medio: el grupo de un tramo sale de una fuente que nombre al dueño de ese tramo.\n- medios[1] coletiva-net: publicado, mismo tier que icndiario con la misma evidencia (nota propia, propiedad y alineamiento sin datos, dicho en la ficha).

## Cambios de forma

- correcciones[0] el-observador-grupo-historial: tipo error_factual (la ficha publicada aplicaba el grupo vigente a toda fecha y su descripcion no contaba la inversión de 2011 ni a todos los promotores), desenlace aceptada, afecta medios/el-observador, agrega medios/coletiva-net. El motivo está escrito para el lector, sin jerga. En descripcion y motivo se quitó 'fundador y director' de Peirano antes de 2022: la nota de 2022 habla de su 'nueva función de director periodístico', y su cargo previo no está en las fuentes leídas.\n- Simetría: el mismo umbral que se aplica a cualquier medio (el grupo de un tramo sale de una fuente que nombre al dueño de ese tramo) se aplicaría igual a un medio de cualquier otro dueño o línea; el tratamiento de Búsqueda, 180, radio-carve y ámbito que propone el crítico queda para otra corrección con el mismo criterio.
