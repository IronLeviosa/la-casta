# Razones — corrida 2026-09-04-orsi-economia-impuestos

Editor: Claude Sonnet 5 (claude-sonnet-5), corrida deliberada bajo el experimento de
`EXPERIMENTO.md` (editor con Sonnet en vez de Fable; el crítico de este lote también corrió con
Sonnet en vez de Opus, ver nota al inicio de `critica.md`). No se repitió la corrida del crítico;
donde sus objeciones parecieron flojas o incompletas las resolví con criterio propio y lo dejo
constando abajo, que es justamente el dato que el experimento quiere.

## Cambios de forma

- `declaraciones.yaml`, registro del 2024-10-10 ("Nosotros lo que no vamos a hacer es mentir"): se
  quitó el punto final después de "San José" que el investigador agregó al copiar y que la fuente
  no tiene, en `evidencia.fuentes[0].cita`. Hecho en el paso 1, antes de esta revisión (nota del
  orquestador). El validador pasó de 0.99 a 1.00. No cambió el sentido.
- `promesas.yaml`, evidencia candidata del proyecto de presupuesto (hoy `evidencias[2]`,
  2026-01-08): se quitaron las comillas rectas que envolvían la cita de El Observador, porque la
  fuente no las tiene en esa posición. Hecho en el paso 1. Misma clase de error, mismo efecto nulo
  sobre el sentido.

## Cambios sobre el crudo (no triviales)

1. **`declaraciones[2]` (7/3/2024, "con liviandad y hasta con frivolidad...")**: reescribí el
   `resumen` para agregar que la crítica apuntaba en particular a la promesa del entonces
   candidato oficialista Álvaro Delgado, no a una tesis general contra cualquier promitente.
   Motivo: objeción `corregir` de `critica.md` en `declaraciones[2]`, que señala esto como
   explicación alternativa legítima para el giro 1. No cambié la cita ni el `resumen` de fondo,
   sólo agregué el objeto exacto de la crítica.

2. **`declaraciones[3]` (7/3/2024, "Obviamente que se hace para conseguir votos")**: agregué al
   `resumen` que es la misma intervención, el mismo día, que `declaraciones[2]` (comité de
   Trouville), y lo mismo en sentido inverso en el `resumen` de `declaraciones[2]`. Motivo:
   objeción `corregir`/`asimetria` de `critica.md` en `declaraciones[3]` (fragmentar un mismo
   discurso en dos registros separados, cada uno con cita literal propia, sin cruzarlos). Elegí la
   opción de cruzar en el `resumen` en vez de fusionar los dos registros en uno (la otra opción que
   ofrecía la crítica) para conservar cada cita literal por separado con su propia fuente.

3. **`_slug` agregado a cuatro declaraciones** (`declaraciones[1]` 2023-12-14 "Ni descarto ni la
   afirmo...", `declaraciones[5]` 2024-11-17 "No vamos a aumentar los impuestos", `declaraciones[13]`
   2025-08-21 "La solución que se nos ocurre...", `declaraciones[14]` 2026-05-19 "Yo ya dije lo que
   tenía para decir..."): necesario para que `declaracion_antes`/`declaracion_despues` de
   `giros.yaml` referencien un id predecible (`<politico>/<fecha>-<_slug>`) antes de que corra
   `pnpm promover`. No se tocó el contenido de esas cuatro declaraciones. Los valores de `_slug` se
   ajustaron después de un primer `pnpm validar --inbox` fallido, porque `slugificar()` descarta
   palabras vacías del español (`la`, `a`, `lo`, `que`, `para`, entre otras); quedaron en
   `ni-descarto-ni-afirmo`, `no-vamos-aumentar-impuestos`, `iva-compras-exterior-equidad` y
   `ya-dije-tenia-decir`.

4. **`promesas.yaml`, campo `texto`**: separé las dos frases del debate ("No vamos a aumentar los
   impuestos" / "Repito nuevamente porque no se entendió...") con una nota de que la segunda se
   dijo diez minutos después, en vez de presentarlas como una oración continua. Motivo: objeción
   `aviso`/`cita_fuera_de_contexto` de `critica.md` en `promesas[0]` — la `cita` de la fuente ya
   conservaba el salto temporal, sólo el `texto` de cara al lector lo perdía.

5. **`promesas.yaml`, evidencia del 21/8/2025 (IVA a compras en el exterior, hoy `evidencias[0]`)**:
   quité "(22%)" de la `descripcion`, porque ese dato no está en ninguna de las dos fuentes citadas
   para esa fecha (aparece en una nota distinta, del 1/9/2025, ya citada en la evidencia siguiente).
   Motivo: objeción `corregir`/`contexto_omitido` de `critica.md`.

6. **`promesas.yaml`, evidencia de la Ley 20.446 (hoy `evidencias[2]`)**: separé la `descripcion`
   en dos justificaciones distintas. La frase "no es aumentar, es localizar" corresponde, según la
   propia exposición de motivos citada, sólo al Impuesto Mínimo Complementario Doméstico; el cambio
   en la franquicia de compras al exterior usa una justificación distinta ("ajustes técnicos" por
   "equidad horizontal"). El texto original atribuía la primera justificación a las dos medidas.
   Motivo: objeción `corregir`/`contexto_omitido` de `critica.md`.

7. **`promesas.yaml`: `evidencias_candidatas` pasó a `evidencias` y se reordenó por fecha
   ascendente** (21/8/2025, 1/9/2025, 8/1/2026, 21/1/2026, 1/3/2026, 19/5/2026). El investigador
   había dejado la evidencia de Ojeda (1/9/2025) al final del arreglo pese a ser cronológicamente
   la segunda. Motivo: nota de orden de `critica.md` en `evidencias_candidatas[4]`.

8. **`promesas.yaml`: agregué `estado: en_proceso_demorada` y `fundamentacion`**, ponderando 6
   evidencias de solidez desigual: 2 hechos de gobierno verificados con dos fuentes cada uno que
   amplían qué se grava (IVA a compras en el exterior, Impuesto Mínimo Complementario Doméstico),
   ambos de alcance acotado y con justificación oficial ("equidad", "localización") distinta de la
   contingencia de contexto que Orsi había planteado como condición en noviembre de 2024; 1 ajuste
   automático de indexación (BPC) con efecto neutral y bajo peso; 2 juicios políticos de opositores
   (Ojeda, documento del PN) con bajo peso por no ser hechos de gobierno verificables de forma
   independiente; 1 autoevaluación del propio Orsi a favor, con bajo peso por circular. El detalle
   completo está en `fundamentacion` del propio archivo. Elegí `en_proceso_demorada` en vez de
   `en_proceso_adelantada` porque hay indicios verificados (no meras acusaciones) de que la promesa,
   leída literalmente ("no vamos a aumentar los impuestos", sin condicionar el texto mismo), ya se
   apartó parcialmente en dos medidas concretas, aunque acotadas; el mandato no terminó, por lo que
   no corresponde `incumplida`.

9. **`giros.yaml` (nuevo, 3 registros)**:
   - **Giro 1** (`declaracion_antes`: 2023-12-14 "Ni descarto ni la afirmo...";
     `declaracion_despues`: 2024-11-17 "No vamos a aumentar los impuestos"): elegí esta declaración
     de diciembre de 2023 como `declaracion_antes`, no "Nadie hace campaña diciendo..." (que el
     investigador había puesto primero en `notas.md` como candidato), porque es la posición propia
     de Orsi sobre sí mismo, no una tesis sobre la campaña de otros — sugerencia explícita de
     `critica.md` en `declaraciones[1]`. Clasifiqué `cambio_parcial` (pasó de dejar la puerta
     abierta "como última medida" a una promesa sin matices) y no `cambio_total`, porque nunca
     afirmó que subiría los impuestos antes de noviembre de 2024. `explicacion: sin_explicacion`
     porque no hay, en este lote, una declaración que reconozca el endurecimiento de postura. La
     crítica de marzo de 2024 a la promesa de Delgado (declaraciones[2]/[3]) queda como contexto en
     el `analisis`, con la salvedad de que apuntaba a un rival, no a una tesis general — no la usé
     como `declaracion_antes` por esa misma salvedad.
   - **Giro 2** (`declaracion_antes`: 2024-11-17 "No vamos a aumentar los impuestos";
     `declaracion_despues`: 2025-08-21 "La solución que se nos ocurre..."): evalué explícitamente
     si `declaraciones[7]` ("Si el contexto me lo impone...", misma fecha que la promesa) permite
     calificar `justificado_por_contexto` en vez de `sin_explicacion`, como pedía `critica.md`.
     Decidí `sin_explicacion` porque la justificación que Orsi dio en agosto de 2025 para la medida
     ("equidad" frente al comercio local) no invoca la contingencia que había planteado como
     condición (guerra, fuga de capitales, "el contexto me lo impone"): son dos justificaciones
     distintas, y no hay una fuente que las conecte. Clasifiqué `cambio_parcial`, no `cambio_total`,
     porque la medida amplía una exención puntual dentro de un impuesto ya existente (IVA), sin
     tocar tasas generales. Incorporé al `analisis` las dos lecturas (aumento vs. corrección de
     exención) que pedía `critica.md` en `declaraciones[13]`, y la observación de `critica.md` en
     `declaraciones[9]` sobre el riesgo de doble estándar (Orsi calificó el recargo de IVA de
     Lacalle Pou de "muestra clara de aumento" sin fijar un criterio que distinga ese caso del
     suyo). No arme un giro separado para el Impuesto Mínimo Complementario Doméstico (enero de
     2026) porque no hay, en este lote, una declaración de Orsi que lo aborde directamente —queda
     como evidencia de la promesa, no como declaración.
   - **Giro 3** (`declaracion_antes`: 2024-11-17; `declaracion_despues`: 2026-05-19 "Yo ya dije lo
     que tenía para decir..."): `cambio: sin_cambio`, siguiendo la propia lectura de `notas.md` de
     incluir un caso de consistencia para no sesgar el registro sólo hacia las contradicciones.

10. **Dos archivos de hipótesis** en `hipotesis/orsi/`:
    `aumentos-irae-irnr-zonas-francas-documento-pn-2026.yaml` (los incrementos específicos en IRAE,
    IRNR y zonas francas que acusa el documento "Construir sin Destruir" del PN no están
    corroborados en este lote con ninguna fuente independiente del propio documento opositor —
    objeción `corregir` de `critica.md` en `evidencias_candidatas[3]` y punto 4 de "Objeciones al
    lote") y `declaracion-telenoche-tres-dias-despues-debate.yaml` (pista sin verificar de
    `notas.md` sobre una posible declaración adicional en un video de Facebook de Telenoche, no
    abierto en esta corrida ni en la anterior). Ninguna pasa a `content/`.

11. **No se creó ningún registro (caso, chequeo o declaración) a partir del episodio del Impuesto
    de Primaria** (`casos_vistos` de `notas.md`, punto 5 de "Objeciones al lote" de `critica.md`).
    Coincido con el investigador y con el crítico: no hay denuncia formal ni investigación de
    Fiscalía, sólo juicios políticos de opositores sobre un hecho patrimonial ya regularizado, y de
    cualquier modo el tema es `transparencia-corrupcion`/patrimonio, no `economia/impuestos`. Lo
    dejo señalado en el informe final para una futura corrida de esos temas, sin abrir hipótesis
    acá porque no es una narrativa a confirmar: es un hecho ya conocido, sólo mal ubicado entre
    corridas.

12. **No se hizo investigación adicional** (video del debate del 17/11/2024, Decreto 11/026 de la
    BPC en IMPO, PDF completo de "Construir sin Destruir"): las tres están localizadas por el
    crítico pero no abiertas con `pnpm fuente` en esta corrida ni en la anterior. Las dejé como
    `notas_internas` de los registros afectados (para subir tier en una futura revisión) o como
    hipótesis, en vez de citarlas sin haberlas leído yo mismo, siguiendo la regla de que ninguna
    URL se cita sin abrirla en la sesión que la usa.

## Simetría

Antes de cerrar me pregunté si apliqué a Orsi el mismo umbral que aplicaría a un político de otro
partido con la misma evidencia:

- El criterio de tier —cualquier registro `reportado` con una sola fuente (`_faltante:
  segunda_fuente`) va a `probable`, sin excepción— es el mismo que usé en la corrida paralela de
  Lacalle Pou sobre impuestos y tarifas (commit `5b6107f`) y en la corrida de combustibles de este
  mismo político (`2026-09-04-orsi-economia-combustibles`). Lo apliqué igual a las 12
  declaraciones de fuente única de este lote, sean favorables o desfavorables a Orsi: tanto la
  reafirmación de mayo de 2026 (a favor de la promesa) como la crítica de marzo de 2024 a la
  promesa de Delgado (que, mal leída, podría usarse contra Orsi) quedaron en `probable` por el
  mismo motivo de sourcing, no por su contenido.
- En el giro 2, el punto de mayor riesgo de asimetría era calificar `cambio_total` por default
  (la lectura más desfavorable) o aceptar sin más la justificación de "equidad" del gobierno (la
  lectura más favorable). Elegí `cambio_parcial` con las dos lecturas explícitas en el `analisis`,
  el mismo tratamiento que le di en la corrida de combustibles a la disputa de cifras de Ancap del
  gobierno de Lacalle Pou (`hipotesis/orsi/disputa-cifras-ancap-abril-2025.yaml`): documentar ambas
  lecturas sostenibles con las fuentes disponibles, sin resolver a favor de ninguna por default.
- Traté la declaración de Andrés Ojeda (opositor colorado) y el documento "Construir sin Destruir"
  del Partido Nacional con el mismo criterio: son juicios políticos de terceros identificables,
  correctamente atribuidos, con bajo peso probatorio por no ser hechos de gobierno verificables —
  el mismo peso que le di a la reafirmación del propio Orsi (mayo de 2026) por ser autoevaluación
  del promitente. No privilegié la voz oficialista sobre la opositora ni viceversa: a ambas les
  bajé el peso por el mismo motivo estructural (opinión política vs. hecho de gobierno), no por
  quién la dijo.

## Objeciones de `critica.md` que quedan sin resolver

- **Dependencia de El Observador y Subrayado, y de Telemundo como fuente primaria no citada**
  (punto 1 de "Objeciones al lote"): no se consiguió el video del debate del 17/11/2024 en esta
  corrida; `declaraciones[5,6,7]` y `promesas[0].origen` quedan en su nivel actual, con la mejora
  posible anotada en `notas_internas` para una futura revisión.
- **Decreto 11/026 de la BPC** (`evidencias[2]`, 2026-01-21): sigue sin incorporarse el decreto
  mismo como fuente `documento_oficial` — se resolvió el problema de fondo (sourcing y precisión)
  con tres notas de prensa de grupos distintos en la corrección del 2026-09-04 (ver adenda), pero
  el documento oficial de IMPO queda pendiente para una futura revisión si se quiere subir esta
  evidencia a `textual`.
- **PDF completo de "Construir sin Destruir"**: no se consiguió; sus afirmaciones específicas sobre
  IRAE, IRNR y zonas francas quedan como hipótesis abierta, no como evidencia verificada de la
  promesa.
- **Referente para Álvaro Delgado** (`menciones[0]`): coincido con el crítico en que valdría la
  pena crearlo, dado que aparece citado y contrapuesto a Orsi en varias notas del lote, pero crear
  un registro en `content/referentes/` excede el alcance de esta corrida sobre `economia/impuestos`
  de Orsi; queda como sugerencia en el informe final.
- **Falta de dato `alineamiento` en cinco medios** (punto 6 de "Objeciones al lote"): es una mejora
  estructural de `content/medios/`, no de este lote puntual; no se tocó.
- **Sesión parlamentaria de aprobación del Presupuesto** (punto 4 de "Objeciones al lote"): no se
  investigó; el crítico ya lo señala como pendiente para una futura corrida, no como objeción a
  resolver en edición.

## Adenda del 2026-09-04 — `promesas.yaml` no pasaba `pnpm validar` sobre `content/`

El coordinador avisó que, ya promovido, `content/promesas/orsi/no-vamos-aumentar-impuestos-diez-minutos.yaml`
no pasa `pnpm validar`: cuatro de las seis evidencias tenían `nivel: reportado` con un solo grupo
de medios, y esa regla bloquea en tier `publicado` (en `--inbox` sólo daba aviso, por eso no lo vi
en la corrida original). El error es mío: evalué la solidez del `origen` de la promesa (dos
grupos) pero no revisé el sourcing de cada `evidencia` por separado antes de dejar el registro en
`publicado`. Corrijo trabajando sobre `inbox/orsi/economia/impuestos/2026-09-04/promesas.yaml`, no
sobre `content/` — el coordinador borra lo promovido y vuelve a correr `promover`.

Antes de elegir, probé la opción 2 (conseguir segunda fuente real) para las cuatro evidencias
señaladas, buscando primero en el corpus (`pnpm corpus:buscar`) y después con `WebSearch`
puntual, leyendo cada hallazgo con `pnpm fuente` antes de usarlo — el coordinador habilitó
explícitamente esta búsqueda para esta corrección puntual, fuera de mi alcance de lectura habitual
de editor:

- **Evidencia de "Construir sin Destruir" (2026-03-01)**: encontré cobertura del mismo documento en
  Telenoche (grupo `monte-carlo-romay-salvo`, distinto de `grupo-ambito`) y en Caras y Caretas
  (grupo `editora-caras-y-caretas`). Leí las dos con `pnpm fuente`. Caras y Caretas cubre el
  documento pero no menciona impuestos (tags del corpus: ni siquiera incluye `economia/impuestos`),
  así que no sirve como segunda fuente de *esta* evidencia — citarla habría sido "dar por buena"
  una fuente que no corrobora el contenido, que es justo lo que el coordinador pidió evitar.
  Telenoche sí corrobora la caracterización general ("brecha entre promesa y gestión" por
  "incrementos y ajustes tributarios"), aunque no el desglose específico (IRAE, IRNR, zonas
  francas) que sólo da Ámbito. Usé Telenoche como segunda fuente y reescribí la `descripcion` para
  decir exactamente eso: la caracterización general tiene dos fuentes, el desglose específico
  sigue sin corroboración independiente (por eso sigue existiendo
  `hipotesis/orsi/aumentos-irae-irnr-zonas-francas-documento-pn-2026.yaml`, sin cambios).
- **Evidencia de la BPC/IRPF/IASS (2026-01-21)**: encontré tres notas nuevas (El Observador,
  grupo `werthein-hochbaum`; Ámbito, `grupo-ambito`; la diaria, `cooperativa-la-diaria`) que, leídas
  con `pnpm fuente`, cambian lo que yo tenía entendido del hecho. No es una indexación puramente
  automática sin margen de decisión, como escribí en la versión anterior: la Ley 17.856 le da al
  Poder Ejecutivo la opción de ajustar la BPC por IPC o por IMS, y el gobierno de Orsi eligió volver
  al IPC —el mismo criterio que el gobierno de Lacalle Pou había cambiado a IMS en 2020-2021,
  cuando el FA, en oposición, criticó esa misma maniobra en sentido inverso—. El criterio elegido
  ahora recauda más que la alternativa (IMS creció 5,94% en 2025 contra 3,65% del IPC), pero,
  según los economistas que consultó la diaria, no cambia alícuotas ni estructura del IRPF. Reescribí
  la `descripcion` con este detalle y mantuve `efecto: neutral`: es una elección discrecional real,
  no un automatismo sin margen, pero tampoco un aumento de tasa; y es una herramienta que ambos
  partidos usaron de forma simétrica según les convino, lo cual me pareció importante dejar escrito
  explícitamente en la `fundamentacion` de la promesa por la misma razón de simetría de siempre.
- **Evidencia de la rueda de prensa de Ojeda (2025-09-01)** y **evidencia de la reafirmación de
  Orsi (2026-05-19)**: busqué en corpus y en la web y no encontré una segunda fuente de otro grupo
  que cubra la misma rueda de prensa o la misma declaración con cita propia (sólo videos de
  Facebook de Telemundo/Telenoche, que no puedo abrir ni citar). Elegí **retirar las dos** del
  registro de la promesa, no bajar todo el registro a `probable`: las dos ya venían marcadas en mi
  propia `fundamentacion` anterior como de bajo peso por motivos independientes del sourcing (la de
  Ojeda es un juicio político de un opositor sobre el mismo hecho que ya cubre, con mejor sourcing,
  la evidencia de "Construir sin Destruir"; la de Orsi es una autoevaluación circular del propio
  promitente, no un hecho de gobierno). No es lo mismo que "sacar las evidencias incómodas sin
  decirlo": lo que retiro es una de cada signo (una `en_contra`, una `a_favor`), así que el recorte
  en sí no está sesgado hacia un lado. Dejo dicho en la `fundamentacion`, explícitamente, que el
  registro que queda no tiene ninguna evidencia `a_favor` en sentido estricto, y que eso es un
  límite de qué se pudo sourcear a dos grupos, no una lectura de que la promesa esté peor cumplida
  que antes.
- No creé hipótesis nuevas por estas dos evidencias retiradas: no son narrativas sin confirmar (lo
  que dijeron Ojeda y Orsi está clara y literalmente citado), sólo evidencia insuficientemente
  sourceada para el uso específico de sostener una promesa en tier `publicado`.

Con las cuatro evidencias que quedan (dos con dos fuentes de grupos distintos, una con documento
oficial + nota, una con cuatro fuentes de tres grupos distintos) el registro pasa
`pnpm validar --inbox` sin avisos de sourcing en `promesas.yaml`. Mantuve `estado:
en_proceso_demorada` y `revision.tier: publicado`: el balance de fondo (dos medidas de gobierno
verificadas que amplían qué se grava, un ajuste de índice que recauda más pero no toca tasas, y una
acusación opositora general ahora con dos fuentes) no cambió con la corrección; lo que cambió es
que quedó mejor sourceado y más preciso, no más ni menos favorable a Orsi.

## Adenda del 2026-09-04 (2) — dos citas de la adenda anterior no verificaban contra la fuente

El coordinador corrió `pnpm validar:red` sobre lo ya promovido y encontró que dos citas que yo
escribí en la adenda anterior no aparecen en el texto de su fuente (similitud 0,54 y 0,74 contra el
umbral 0,9 de `--red`; `--inbox` sin `--red` no chequea esto, por eso no lo vi). Encontré el error
en cada caso:

- **`evidencias[1]` (Ley 20.446/IMCD), `fuentes[1]` (El Observador)**: al reescribir la
  `descripcion` para separar la justificación del IMCD de la de la franquicia (cambio 6 de la
  adenda anterior), reemplacé sin darme cuenta la `cita` original del investigador —que sí
  verificaba— por el texto de `cita_de_contexto` que usa `critica.md` para darme contexto a mí como
  editor. Ese campo de la crítica no es una cita literal contigua: tiene puntos suspensivos que
  saltan entre oraciones separadas por un párrafo intermedio, y lo copié como si fuera citable. Es
  el error que señala el coordinador: mezclé "contexto para mi propia lectura" con "texto para citar
  en el registro". Reabrí la URL con `pnpm fuente ... --buscar` y confirmé que el pasaje completo,
  desde "el propósito de esta iniciativa no es aumentar los impuestos..." hasta "...mayor equidad
  horizontal sobre impuestos existentes", es en realidad un tramo contiguo real de la nota (sin
  necesidad de puntos suspensivos): lo usé completo, sin saltos, y ahora cubre tanto la
  justificación de "localizar" como la de "ajustes técnicos", que es lo que la `descripcion`
  necesita.
- **`evidencias[2]` (BPC), `fuentes[2]` (Ámbito)**: la cita que escribí unía, con puntos
  suspensivos, dos frases que en la nota están separadas por tres oraciones intermedias ("En aquel
  momento... El Frente Amplio... criticó... Luego, el salario comenzó a evolucionar..."). La
  similitud (0,74) era más alta que en el caso anterior porque el salto era más corto, pero seguía
  sin ser un texto contiguo real. Reabrí la URL y confirmé que el párrafo completo, desde "El
  gobierno anterior cambió el criterio..." hasta "...si se hubiera mantenido el ajuste por IMS", es
  íntegramente contiguo en la nota (un solo párrafo corrido): lo usé completo, sin puntos
  suspensivos. Esto además mejora la `fundamentacion`: ya no solo afirmo yo que ambos gobiernos
  usaron el mecanismo de forma simétrica, la propia cita de Ámbito lo dice.

No cambié ninguna `descripcion` ni ningún `efecto` en esta ronda: las citas corregidas dicen lo
mismo que las que reemplazan, solo que ahora son tramos reales de la fuente. Confirmé con
`pnpm validar --inbox inbox/orsi/economia/impuestos/2026-09-04 --red`: 34 citas, 34 exactas (1.00),
0 aproximadas, 18/18 fuentes verificadas, 0 errores. Regla que me llevo para el resto de la corrida
y para futuras: el campo `cita_de_contexto` de `critica.md` es para decidir, no para copiar; toda
`cita` que yo escriba se verifica reabriendo la fuente con `pnpm fuente` en el momento de escribirla,
nunca por reutilización de un fragmento de otro archivo, ni siquiera de `critica.md`.

---

## Nota de proceso (la escribe el orquestador, no el editor)

Dos cosas de esta corrida que un auditor tiene que saber, y que no son del editor:

**1. `edicion.diff` está vacío y eso no significa que el editor no haya cambiado nada.**
`pnpm promover` congela `crudo/` la primera vez que se lo corre, y en esta corrida esa primera vez
fue después de que el editor ya había asignado tiers y escrito `giros.yaml`. Lo que quedó guardado
como "crudo" es entonces la versión ya editada, y el diff contra sí misma da vacío. Los cambios del
editor están enumerados más arriba en este mismo archivo; lo que se perdió es poder verificarlos
automáticamente. El defecto se corrigió el mismo día con `pnpm promover --solo-crudo`, incorporado
a `.claude/commands/revisar.md` como paso previo al crítico.

**2. Se normalizó el identificador de modelo de los tres giros.** El editor escribió
`_investigacion.modelo` como texto libre ("Sonnet 5 (Claude Code / Agent SDK)") en lugar del id del
modelo. Se corrigió a `claude-sonnet-5` en el inbox y se volvió a promover la corrida entera, en
vez de editar `content/` a mano. El valor es el mismo modelo: está verificado contra el transcripto
del agente, que reporta `claude-sonnet-5`. No cambió ningún otro campo de ningún registro.
