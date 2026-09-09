# Razones — corrida 2026-09-09-brou-serie-historica

Editor: Sonnet (`claude-sonnet-5`), por regla del mantenedor (2026-09-07): el editor no corre en
Fable ni en Opus.

## Cambios sobre el crudo (no triviales)

- **`revision` reescrito entero, `tier: publicado`.** El crudo llegó con el bloque `revision` de la
  corrida anterior (`2026-09-07-empresas-brou`), copiado junto con el resto de la ficha ya publicada
  que el investigador usó como base para extenderla. Ese bloque hablaba de objeciones (`B3`,
  `C11`-`C13`) que pertenecen a la crítica de esa corrida, no a `critica.md` de esta (que tiene `B1`,
  `B2` y `C1`-`C10`). Lo reescribí para que documente lo que efectivamente se hizo en esta corrida:
  qué resolvió la vuelta 2 del investigador de cada objeción de `critica.md`, y qué verifiqué yo. No
  es un desacuerdo con el investigador: es evitar que quede en `content/` una nota interna que
  describe una revisión distinta a la que ocurrió.

- **`finanzas[2002].capitalizaciones_del_estado.concepto` unificado con 2001, 2003-2006** (crítica
  C7, resuelta solo parcialmente por la vuelta 2). La vuelta 2 sacó la comparación con el BHU del
  `concepto` de 2002 (correcto, resuelve C3/C6) pero dejó una redacción distinta a los otros cinco
  años («... del balance auditado de 2002» en vez de «... del balance auditado de ese ejercicio»).
  Como la página deduplica notas al pie por texto exacto, esto habría dejado dos notas al pie (una
  para 2002, otra para 2001+2003-2006) en vez de la una que pedía C7. Cambié el texto de 2002 para
  que sea idéntico al de los otros cinco.

- **Verificación estructural de que ninguna cifra de `finanzas[2015..2024]` cambió.** Parseé el YAML
  publicado (`content/empresas/brou.yaml`) y el crudo con la librería `yaml` del propio repo y
  comparé año por año, 2015 a 2024: los diez registros son idénticos campo por campo. También
  comparé `hitos[]`, `imagenes[]`, `creacion`, `que_hace`, `monopolio`, `comparaciones` y `fuentes`
  fuera de `finanzas`/`hitos`/`resumen`/`revision`: todo idéntico salvo `hitos`, que cambia en dos
  puntos (ver siguiente ítem) y `resumen`, reescrito. Esto es lo que sostiene que la corrección
  adjunta declare `de: 2015-2024 sin cambios` y no tenga que listar ninguna cifra vieja.

- **`hitos[2010-12-24]` cambia de fuente y de `detalle`, y se agrega un hito nuevo** (crítica C2 y
  C4). Objeción C2: el `detalle` publicado atribuía al artículo 11 la contribución del 50 %, pero la
  única `cita` de esa fuente en la ficha publicada era el artículo 39 (derogaciones), que no sostiene
  esa afirmación. La vuelta 2 agregó las citas de los artículos 11 y 40 (que sí sostienen el
  `detalle`, ahora ampliado para mencionar también el artículo 40) y dejó el artículo 39 como fuente
  adicional de la derogación de la Ley 9.808 que el `detalle` también menciona. Objeción C4: se
  agregó el hito del 5/8/2002 (BROU empieza a usar el Fondo de Estabilidad del Sistema Bancario, con
  la Nota 3.21.4 del balance de 2004 como fuente), porque antes el Fondo solo estaba documentado
  como texto de la ley que lo creó, sin el hecho de que BROU lo haya usado. Estos dos cambios entran
  en `_correccion.yaml` porque modifican contenido ya publicado, no solo agregan años nuevos.

- **`_correccion.yaml` nuevo**, con `tipo: contexto_omitido` (no `error_factual`: ninguna cifra
  financiera ya publicada cambió; lo que cambia es la fuente y el detalle de un hito, y eso es un
  error de cita, no de dato). `afecta: [empresas/brou]`, tres entradas en `cambios[]` (finanzas,
  hitos, resumen), `revision.tier: publicado`.

## Objeciones de `critica.md` verificadas como resueltas por la vuelta 2 del investigador (sin cambio mío)

Repasé cada una contra el crudo, `notas.md` y `consultas.jsonl` antes de confiar en la tabla
"vuelta 2" de `notas.md`:

- **B1** (2007-2008 con documento propio): confirmado. `finanzas[2007]` y `[2008]` citan
  `brou.com.uy/.../Estados_Contables.pdf` con `tipo: documento_oficial`; el `resumen`, los
  `concepto` y `notas.md` ya no dicen "no se encontró documento propio" (grep sin resultados).
- **B2** (transferencias): confirmado. `finanzas[2008,2009,2011,2012,2013].transferencias_al_estado`
  cargadas con la Nota C.6.4, criterio de caja; `finanzas[2001,2002].nota` explica la cancelación
  del adelanto de 2000 en vez de declarar ausencia de documento.
- **C1** (impuestos 2008): `finanzas[2008].impuestos_pagados.pesos = 1388.6`, coincide con el
  cálculo de la crítica (471,693+916,920 miles).
- **C2**: ver arriba (hitos).
- **C3**: `resumen` sin mención al BHU ni a la Ley 17.523/17.513; verificado con grep.
- **C4**: ver arriba (hitos); además `nota` de una línea en `finanzas[2002,2003,2004]` remitiendo al
  hito.
- **C5**: el `resumen` (tercer párrafo) declara los años con y sin ajuste por inflación entre 2001 y
  2016, con cifra para 2003, 2009, 2010 y 2014. La acción sugerida por la crítica también pedía una
  `nota` de una oración en los registros de 2010 y 2014 además de 2009 (que sí la tiene); no la
  agregué porque el dato ya está en el `resumen`, que es lo que el lector lee primero, y duplicarlo
  en la nota del año no cambia el dato ni el análisis, solo lo repite: quedó registrado acá para que
  quien retome el registro sepa que fue una decisión, no un olvido.
- **C6**: `concepto` de `finanzas[2002].capitalizaciones_del_estado` y `finanzas[2008].resultado_ejercicio`
  son una oración cada uno (medí las dos: 21 y 12 palabras).
- **C7**: ver arriba (cambio mío).
- **C8**: las citas del informe de indicadores como fuente secundaria (2007, 2008, 2009) pasan a una
  sola línea, igual que 2015-2016. Las citas del documento auditado principal siguen siendo bloques
  largos en 2008-2014: no las recorté más porque el PDF de esos años entrelaza la columna de
  etiquetas con la de montos (confirmado leyendo `consultas.jsonl`, líneas de 2010-2013 con
  "etiquetas" y "montos" en citas separadas), y la única forma de que el lector pueda verificar que
  tal número corresponde a tal concepto es mostrar el bloque completo con el que se hizo la
  verificación aritmética que `notas.md` describe. Achicar la cita ahí habría roto la cadena de
  evidencia, no solo la prolijidad.
- **C9**: `notas.md` y `resumen` listan las cinco vías probadas (sitio de BROU, Wayback, buscador de
  Registros de la SSF del BCU, catálogo de la Biblioteca del Parlamento, búsqueda por texto en el
  Diario Oficial), confirmado también en `consultas.jsonl` (líneas 94-97).
- **C10**: `finanzas[2006].resultado_ejercicio.fuentes` tiene dos entradas, la del BCU (OCR) y la del
  propio sitio de BROU (documento nativo, mismo resultado 2.187.573).
- **A1-A8**: sin acción sobre el registro en A1, A2, A6, A8 (correctas tal como estaban, según la
  propia crítica); A3, A4, A5, A7 tienen su cláusula en el `resumen`.

## Cambios de forma

- Ninguno además de los de arriba. No encontré fechas ni cifras mal escritas fuera de lo ya cubierto
  por la crítica.

## Validación

`pnpm validar --inbox inbox/empresas/brou/2026-09-09-serie-historica` y con `--red`: ver informe
final del editor para el resultado.
