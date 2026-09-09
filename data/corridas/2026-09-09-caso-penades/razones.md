# Razones de edición — 2026-09-09-caso-penades

Editor: Sonnet (`claude-sonnet-5`), por la regla de modelos del mantenedor (2026-09-07): el editor
corre en Sonnet, no en Fable; el crítico corrió en Opus como corresponde.

## Bloqueantes (crítica B1-B3)

- **B1** (`casos.yaml`, `estado_judicial[0].descripcion`): reescrita. Se sacó "anuncia que la
  denunciará por difamación" (trascendido anónimo en condicional, atribuido por El País a "fuentes
  de su partido" y relevado por un tercer medio — no sostenido por ninguna cita del lote como acto
  afirmado). Se sostiene la negativa y el anuncio de acciones legales con una cita nueva y directa de
  El Observador ("En su declaración, Penadés negó las acusaciones..." y "...iniciaré acciones legales
  que correspondan contra todos los participantes activos de estas calumnias", ambas releídas con
  `pnpm fuente` en esta sesión), que es la opción 2 sugerida por la crítica. "Conferencia de prensa"
  se cambió por "declaración pública", que es el término de las fuentes.
- **B2** (`casos.yaml`, `estado_judicial[5]`, 2025-05-14): Montevideo Portal y Subrayado son un solo
  trabajo periodístico (el primero se acredita al segundo). Se buscó una segunda fuente independiente
  con `pnpm descubrir elpais.com.uy --desde 2025-05 --hasta 2025-05` y se encontró y leyó con
  `pnpm fuente` la nota de El País del 14/5/2025 sobre la misma ampliación, con cita propia (el anuncio
  de apelación de la defensa). Se agregó como tercera fuente. El validador con `--red` no marca "un
  solo grupo" en este hito tras el agregado.
- **B3** (`casos.yaml`, `estado_judicial[9]`, 2026-08-22): se agregó la nota de Caras y Caretas del
  24/7/2026 que la crítica dejó citada, releída con `pnpm fuente`, como segunda fuente del hito. Se
  quitó `_faltante: segunda_fuente`. Se mantuvo la fecha del hito en 2026-08-22 (no se lo partió en
  dos, que era la alternativa que la propia crítica ofrecía como "mejor" pero no exigía) porque el
  encargo pedía específicamente agregar la fuente a ese hito.

## Objeciones "corregir" (16 de 16)

### Ficha de político (P1-P6)

- **P1** (`mandatos[4]`, Senador 2020-2023, la fuente no dice el cargo): agregadas dos fuentes al
  mismo mandato: el CV oficial ("2020/ 25 Electo Senador de la República.") y el diario de sesiones
  del 7/6/2023 ("...al señor Senador Gustavo Penadés..."), ambas releídas con `pnpm fuente`.
- **P2** (`mandatos[1]`, 2000-2005 con más precisión que la fuente): partido en dos mandatos. El
  primero (Legislatura XLIV, 1995-02-15 a 2000-02-14) con la fila oficial de `legislaturas-actuo`. El
  segundo (2000-2004) nuevo, con la precisión de año que da el CV ("2000/04 Relecto..."), sin
  reconstruir el día. No se usó la fila anómala de la Legislatura XLV (08-12-2004, un solo día, sin
  rótulo de cargo), igual que ya se había decidido para el propio mandato de Diputado.
- **P3** (`mandatos[0]`, Edil, `hasta` no coincide con la cita): `hasta` cambiado de `1995-02-14` a
  `"1994"`, precisión que da la única fuente ("1990/94 Edil Departamental por Montevideo").
- **P4** (`estado_actual.salida`, cita de la cuestión de orden en vez de la destitución): cita
  reemplazada por el pasaje que sí resuelve la destitución ("...Queda aprobada la destitución del
  exsenador Gustavo Penadés."), releído con `pnpm fuente` contra el PDF del diario de sesiones del
  11/10/2023 (con las palabras partidas por salto de línea del PDF reunidas, sin cambiar ninguna).
- **P5** (`estado_actual.prision`, fecha no citada / lugar en presente sin decir "preventiva" / tramo
  de febrero 2025 no cubierto): `lugar` ahora dice explícitamente "Prisión preventiva, Unidad N.º 19
  del Instituto Nacional de Rehabilitación (Florida)". Se agregaron dos fuentes: Búsqueda
  (11/10/2023, conecta la formalización con "Deberá cumplir 180 días de prisión preventiva...") y
  Subrayado (6/4/2026, sostiene la vigencia a esa fecha). El paréntesis de febrero de 2025 queda
  contado en el `resumen` del caso, como sugería la crítica, no repetido acá.
- **P6** (`cobertura.texto`, narra el proceso): reescrito sin "esta corrida", "el mantenedor", "regla
  12 de CLAUDE.md" ni nombres de archivo, con el modelo de `barandiaran.yaml` que la crítica señaló:
  qué se buscó, con qué fuentes, qué falta y por qué.

### Caso judicial (C1-C10)

- **C1** (`resumen`, 2.632 caracteres en un párrafo): reescrito en cuatro párrafos cortos (~1.490
  caracteres con espacios, por debajo del límite de 1.500 y dentro del rango 960-1.491 de los casos
  publicados), con el estado actual primero (preventiva, acusación presentada, sin sentencia) y el
  desglose completo de los 22 delitos dejado únicamente en las citas de los hitos, sin repetirlo.
- **C2** (`estado_judicial[7]`, explicación de Fiscalía no citada): se releyó con `pnpm fuente` la
  nota de Subrayado y se extendió la cita para incluir la explicación real de Javier Benech ("...una
  variación en la tipificación de los delitos..."). Se sacó "y no por un cambio en los hechos", que
  no está en ninguna fuente.
- **C3** (`estado_judicial[2]`, "con prisión preventiva" no citado): se agregó una segunda cita de
  Búsqueda ("Deberá cumplir 180 días de prisión preventiva...", releída con `pnpm fuente`) que sí
  sostiene el dato.
- **C4** (apelaciones de la defensa ausentes): agregadas a la `descripcion` de los hitos 2024-04-08
  (con cita nueva de Montevideo Portal, "Las defensas apelaron..."), 2025-08-27 (con cita nueva del
  mismo artículo ya citado, "Esto fue apelado por la defensa.") y 2025-05-14 (con cita nueva de El
  País sobre el anuncio de apelación). Para 2026-08-22 se reescribió la `descripcion` usando el
  cuerpo completo, ya releído, de la nota de Prensa Mercosur ("La discusión ya fue llevada a un
  Tribunal de Apelaciones, por lo que algunos de estos planteos todavía no tienen una resolución
  definitiva."), en vez de "rechazados hasta ahora por la jueza", que dejaba afuera los planteos
  pendientes.
- **C5** (posición del acusado ausente): agregada una oración al `resumen` ("Penadés se declaró
  inocente en la formalización y sostuvo esa posición después"), con base en las citas de Ámbito
  ("no tener miedo a nada" / "insistir en su inocencia") e Infobae ("ha expresado que es inocente"),
  ambas ya releídas con `pnpm fuente` para otros fines de esta misma edición.
- **C6** (siete hitos rotulados "Formalización" para cinco cosas distintas): no se agregó un valor
  nuevo al enum `EtapaJudicial` (es un cambio de esquema/código, fuera de lo que un editor escribe).
  Se aplicó el criterio (b) que la crítica ofrecía: la `etapa` sigue siendo `formalizacion` en los
  cinco hitos que no son formalizaciones propiamente, pero la `descripcion` de cada uno ahora empieza
  con lo que realmente se resolvió ("Prórroga de la prisión preventiva:", "Revocación de la prisión
  domiciliaria:", "Acusación fiscal:", "Control de acusación:"). Con el mismo criterio para los
  próximos casos largos hasta que el esquema tenga valores propios (sugerencia para el mantenedor,
  no aplicada acá).
- **C7** y **C8** (línea de tiempo como lista vertical en `CasoCard.astro`; el stepper no avisa "no
  hay condena" para `formalizado`): son cambios de componente (`src/components/`), no de contenido.
  No los tocué: el editor escribe YAML, no código de presentación. Quedan para una sesión de
  desarrollo; los anoto acá para que no se pierdan.
- **C9** (segunda persona nombrada por el `titulo` de una fuente): se quitó el campo `titulo` de la
  fuente de Subrayado del 27/8/2025 en `estado_judicial[6]` (el campo es opcional). La justificación
  de `notas.md` para nombrar solo a la primera denunciante pública no cubre a la segunda persona que
  aparecía en ese titular.
- **C10** (ningún documento oficial, búsqueda a medio hacer): no se corrió `pnpm inventario` contra
  `fiscalia.gub.uy`, `gub.uy` ni `bjn.poderjudicial.gub.uy`. Esa herramienta y esas búsquedas
  corresponden al investigador, no al editor (que relee con `pnpm fuente` fuentes ya identificadas,
  no descubre nuevas). Queda documentado en `revision.notas_internas` de `casos.yaml` como pendiente
  para una segunda vuelta del investigador. No cambia el tier de este lote: el caso ya está en
  `probable` por la compuerta humana, con o sin ese documento.

## Tier

- **`politicos.yaml` (ficha de Penadés): `publicado`.** Pasa `--red` sin errores, sin fuentes
  `verificacion: manual`, sin giros. Las tres bloqueantes eran todas de `casos.yaml`; las de la ficha
  (P1-P6) quedaron resueltas con fuente citada y releída.
- **`casos.yaml` (Caso Penadés): `probable`**, con `que_falta` dirigido al lector y `notas_internas`
  para el mantenedor. La última etapa de `estado_judicial` es `formalizacion` ⇒ el validador deriva
  `etiqueta_legal: formalizado` ⇒ caso sin resolución judicial ⇒ exige el hash del registro en
  `data/aprobaciones.json` para `publicado`. Ningún agente lo firma. Con las tres bloqueantes
  resueltas y `--red` en 0 errores, lo único que falta para subir a `publicado` es esa firma (más,
  si el mantenedor lo pide, el documento oficial de C10).
- **`cobertura.yaml` (18 registros) y `discrepancias.yaml` (1 registro): `publicado`.** Sin
  objeciones bloqueantes ni de corregir sobre estos archivos; el criterio de tono está escrito en la
  cabecera y es el mismo para las 18 notas; la discrepancia está sostenida por dos citas del diario
  de sesiones del 11/10/2023, releídas por mí en esta sesión (una de ellas al buscar la cita de P4).

## Regla 0 — pendiente para el mantenedor

La crítica anota que, con este caso, `content/casos/` queda 4 a 1 hacia el Partido Nacional
(Astesiano, Marset, JUTEP-Lacalle Pou, Penadés, contra Cardama-Lazo del Frente Amplio). El remedio no
es bajar ni recortar este caso: es correr la misma búsqueda ("denuncia formal presentada,
investigación de Fiscalía, o acusación pública hecha por una persona identificable en un medio") con
el mismo umbral sobre figuras del Frente Amplio, el Partido Colorado, Cabildo Abierto y el resto. Por
la regla 12 de `CLAUDE.md` un agente no puede iniciar esa investigación sin pedido explícito; queda
anotado acá como pendiente de decisión del mantenedor. No se agregó ni se quitó nada de este lote por
motivo de partido.

## Cambios de forma (no sustantivos)

- `mandatos[*].fuentes[*].fecha` de las cinco fuentes de `parlamento.gub.uy`: tenían la fecha de
  bajada (2026-09-09, duplicando `retrieved_at`). Cambiadas a la fecha real: `2021-01-01` para el CV
  (el archivo se llama `CVGPENADES2021.pdf`; sin día exacto, se usó la convención ya vigente en
  `content/politicos/barandiaran.yaml` de fechar con `-01-01` cuando solo se conoce el año) y
  `2025-06-23` para la ficha de legislaturas (fecha del snapshot de Wayback, confirmada con
  `pnpm fuente` en esta sesión). Los dos diarios de sesiones ya tenían la fecha correcta.
- El esquema exige `fecha` en formato `YYYY-MM-DD` completo; un primer intento con `"2021"` a secas
  lo rechazó (`pnpm validar --inbox` lo marcó como error de esquema). Corregido a `2021-01-01`.
- Una cita nueva (la de "acciones legales... calumnias" en `estado_judicial[0]`) salió "aproximada
  (0.99)" en la primera pasada de `--red`: le faltaban las comillas de cierre que trae la fuente
  ("...calumnias".). Corregida; en la segunda pasada salió exacta (1.00).
