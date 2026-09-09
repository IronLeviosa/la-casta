# Razones — corrida 2026-09-07-empresas-afe (edición)

Modelo: Sonnet (`claude-sonnet-5`), por regla del mantenedor del 2026-09-07 (el editor no corre en
Fable ni en Opus). Lote editado: `inbox/empresas/afe/2026-09-07/empresas.yaml` (vuelta 2 del
investigador, ya con la crítica de Opus incorporada). No hay ficha publicada previa de AFE en
`content/empresas/`, así que no hay corrección que escribir: esta es la primera versión.

## Objeciones de `critica.md` — verificación y ajustes del editor

La vuelta 2 del investigador ya había resuelto las 25 objeciones (3 bloquea, 17 corregir, 4 aviso,
1 sin objeción) antes de que yo tocara el archivo; mi trabajo fue verificar cada resolución contra
la fuente y, donde la resolución dejaba texto de más (varias oraciones en un campo que va como nota
al pie, o una referencia a `notas.md`, archivo privado, dentro de un campo publicado), recortarlo.

1. **`resultado_ejercicio.concepto` 2021/2022 ("no está explicada")** — bloquea. Confirmado
   resuelto: las dos citas de la Nota 10.2 de los balances 2022 y 2023 están en el archivo y son
   literales (validadas con `--red`). Recorté el `concepto` de 2021 y 2022 a una oración cada uno
   (antes tenían 3), moviendo el detalle del ajuste a la misma oración con paréntesis.
2. **"Cap. por inversiones" en `capitalizaciones_del_estado` 2020/2021** — bloquea. Confirmado
   resuelto: la subcuenta ya no está en la cifra principal en ningún año. El `concepto` de 2020 y
   2021 citaba `notas.md` (archivo privado del inbox, no accesible para el lector); lo reemplacé
   por una referencia al `resumen`, que es donde efectivamente quedó la explicación completa
   (origen probable, cifra de la reclasificación, y que sigue sin confirmación exacta). Agregué la
   explicación detallada también como hipótesis (`hipotesis/afe/cap-por-inversiones-origen-2020-
   2021.yaml`) porque es la falla más material del lote y merece seguimiento en una corrida futura,
   con alternativas explícitas (reclasificación contable, aporte en especie, revalúo).
3. **Cita de la exoneración tributaria (artículo 3 vs. 17)** — bloquea. Confirmado resuelto: la
   cita ahora es del artículo 17, completa, con la excepción de tarifas por servicios prestados, y
   coincide con el texto que devuelve `pnpm fuente` sobre esa URL.
4. **Aporte FOCEM sumado a "lo que el Estado puso"** — corregir. Confirmado resuelto: el FOCEM está
   separado en todos los años con incremento (2016-2021); `capitalizaciones_del_estado` es solo
   asistencia financiera. Recorté las cifras exactas de FOCEM de cada `concepto` anual (donde
   aparecían en pesos y porcentaje, alargando el campo a 2-3 oraciones) y las agrupé una sola vez
   en el `resumen`, con el máximo (2018) y el patrón general, como pide la sección «Empresas
   públicas» de mi rol («las convenciones que se repiten van una vez en el resumen»).
5. **2016 ausente / 2017 con la cifra de otro año sin decirlo** — corregir. Confirmado resuelto:
   2016 está cargado (comparativa del balance 2017) y 2017 usa la cifra reexpresada por el balance
   2018 con la original declarada. Agregué el campo `nota` del año 2017, que no existía, con la
   diferencia no explicada ($35.960.660) y la discrepancia del FOCEM de ese año entre los dos
   balances de AFE (dato que la vuelta 2 dejaba solo en el `concepto`, alargándolo a 3 oraciones).
6. **2024 declarado "sin poder leer"** — corregir. Confirmado resuelto: los 11 campos de 2024 están
   cargados con el balance separado 2024. Saqué del `concepto` de `capitalizaciones_del_estado` la
   frase sobre la verificación interna del dato contra el informe de Ecovis (una nota de método del
   investigador, no información para el lector).
7. **Montos sin `usd`/`cotizacion`** — corregir. Confirmado resuelto en los 11 años (2011-2012
   quedan sin `usd` por la calidad del OCR de la nota de moneda extranjera, declarado). Revisé que
   `usd = pesos / cotizacion` cierre en cada monto; encontré uno que no cerraba por mi propio error
   (ver «Cambios de forma»).
8. **`segmentos` vacío** — corregir. Confirmado resuelto: cargado en los 11 años, con `concepto`
   consistente ("ingresos, no resultado") en toda la serie.
9. **`impuestos_pagados`/`transferencias_al_estado`/`deuda_financiera` ausentes** — corregir.
   Confirmado resuelto en los 9 años con documento (2016-2024); 2011-2012 quedan sin estos tres
   campos porque el "Balance General del Organismo" (Ley 17.040) no trae esa nota, declarado en la
   `nota` de esos años.
10. **Dos bases de medición (caja 2011-2012, devengado 2016-2024) sin declarar** — corregir.
    Declarado una sola vez en el segundo párrafo del `resumen`, en vez de repetido por año.
11. **Abstenciones de opinión no declaradas** — corregir. Confirmado resuelto: declaradas en la
    `nota` de 2018, 2020, 2022 y 2024. Acorté la de 2022 (que pasaba las 300 caracteres que evalúa
    el validador) sin perder el dato más importante: la incertidumbre material sobre la continuidad
    de AFE como empresa en funcionamiento, que además subí al `resumen` porque es información que
    un dueño de la empresa necesita ver sin tener que abrir el detalle de un año.
12. **`monopolio.tiene: true` contradecía el propio `alcance`** — corregir. Confirmado resuelto:
    `tiene: false`, con la historia completa 1952-2022 en `alcance` y los argumentos de los dos
    lados conservados (el esquema no exige argumentos cuando `tiene: false`, pero el brief los pide
    igual).
13. **Argumentos a favor eran descripciones de la norma** — corregir. Confirmado resuelto: el de la
    OPP ya no se atribuye específicamente al Ferrocarril Central, y el segundo es una cita real de
    Waverley Tejera (director de la DNTF) explicando por qué el sistema debe ser mixto. Verifiqué
    con `pnpm fuente` que la cita es efectivamente de Tejera («Por su parte, Tejera destacó...
    "Estamos trabajando..." señaló») y no de la ministra, que habla antes en la misma nota.
14. **Argumentos en contra: episodio + consigna** — corregir/documento_previsible. Confirmado
    resuelto: la vuelta 2 encontró la versión taquigráfica de la Comisión de Transporte con el
    testimonio de Washington Sánchez (Unión Ferroviaria) sobre el "open access" y el monopolio de
    hecho de Portren, que releí en esta sesión con `pnpm fuente` y coincide literalmente. Esa URL
    (`infolegislativa.parlamento.gub.uy/temporales/0566.PDF`) devuelve 404 en directo (el documento
    "temporal" ya no está en esa ruta del Parlamento); `pnpm validar --red` la valida igual porque
    tiene copia en Wayback. En un primer intento la Availability API de Wayback no encontró el
    snapshot (falso negativo de indexación, confirmado con el índice CDX y con la URL archivada
    puntual, ambos con status 200); un segundo `--red` más tarde en la misma sesión ya la encontró.
15. **`que_hace` decía "gestión de operaciones"** — corregir. Confirmado resuelto: dice "retiro y
    reposición de material ferroviario", con la cita del literal F.
16. **Faltaban los hitos de 1988, 1990, 2018 y 2019** — corregir. Confirmado resuelto: los cuatro
    están cargados con las fuentes que señalaba la crítica.
17. **Hito del 16/04/2024 citaba el epígrafe de una foto** — corregir. Confirmado resuelto: la cita
    es del cuerpo de la nota, el título ya no afirma "inicio de operaciones" como hecho consumado, y
    el `detalle` dice que la fecha de disponibilidad está en disputa.
18. **Hito de los US$ 144 millones sin la salvedad del mediador** — corregir. Confirmado resuelto:
    el `detalle` dice que un mediador tenía 60 días para revisar la cifra y que el Ejecutivo envió
    una adenda al Tribunal de Cuentas. No hay resolución del TCR sobre esa adenda en las fuentes
    leídas; lo dejo como límite conocido en `revision.notas_internas` en vez de darlo por cerrado.
19. **Canon de 0,005 USD/tonelada-km de fuentes anónimas** — corregir. Confirmado resuelto: el texto
    de `alcance` atribuye la cifra explícitamente a "fuentes del gobierno citadas por El Observador"
    y no la presenta como dato firme; no hay una resolución oficial que la fije, declarado en
    `revision.notas_internas`.
20. **`concepto`/`nota` largos, convenciones colgadas de un año** — corregir. Era la objeción que
    más trabajo directo me pidió: aunque la vuelta 2 ya había resuelto los ejemplos puntuales que
    cita la crítica (2011, 2020, 2021, 2022), el mismo patrón (una explicación de 2-3 oraciones en
    `concepto` en vez de una) se repetía en 2017, 2018, 2019, 2020, 2021, 2023 y 2024. Recorté los
    once campos a una oración cada uno y escribí el `resumen` (8 párrafos) con las convenciones,
    los montos de FOCEM y de "Cap. por inversiones", y el resto de lo que el brief pedía para esta
    sección.
21. **Fecha de creación (1952-09-19) sin respaldo directo** — aviso. Confirmado resuelto: la
    primera fuente de `creacion.fuentes` ahora es el texto vigente en IMPO, con "Promulgación:
    19/09/1952" en la cita.
22. **Citas sin rótulo de renglón** — aviso. Confirmado parcialmente resuelto (2016-2024 llevan
    rótulo; 2011-2012 quedan con filas de números por la calidad del OCR de esos PDF, declarado).
    No pedí más porque no hay mejor documento disponible para esos dos años.
23. **Fuentes de la diaria con paywall parcial** — aviso, a criterio del editor. Decisión: dejarlas
    con verificación automática. El paywall oculta el resto de la nota, pero las citas usadas están
    en la parte libre y `pnpm validar --red` las verificó exactamente contra el texto cacheado; no
    son del tipo de fuente (TV sin descarga, X) que CLAUDE.md reserva para `verificacion: manual`.
    Documentado en `revision.notas_internas`.
24. **Fuente de Presidencia tipada `documento_oficial`** — aviso. Confirmado resuelto: `tipo: nota`
    en las dos gacetillas de Presidencia/MTOP.
25. **`comparaciones: []`** — sin objeción. Sin cambios: no encontré tampoco, en esta sesión, una
    comparación de AFE con otro ferrocarril de la región hecha por una fuente identificable.

## Otras decisiones del editor (no pedidas por un número de la crítica)

- **`resumen`**: no existía; lo escribí en 8 párrafos siguiendo la sección «Empresas públicas» de mi
  rol (qué es hoy AFE, cobertura y huecos, resultado del ejercicio por año y gobierno, qué puso el
  Estado con FOCEM y "Cap. por inversiones" separados, exoneración tributaria y deuda, abstenciones
  de opinión, caída de los ingresos por segmento, y la historia del monopolio con sus argumentos).
- **`revision`**: no existía; agregué `tier: publicado` y `notas_internas` con los límites conocidos
  (2013-2015 sin documento, 2011-2012 sin `usd`, el diferendo del Ferrocarril Central sin desenlace
  documentado del lado del mediador y del canon, y la nota sobre el falso negativo de Wayback).
- **Tier**: `publicado`. La ficha se apoya casi enteramente en estados contables auditados de AFE,
  leyes (IMPO) y una versión taquigráfica del Parlamento; el único registro `reportado` (prensa) sin
  documento oficial detrás es el episodio del Ferrocarril Central (hitos y canon), consistentemente
  atribuido y sin presentarse como dato firme donde no lo es. No hay casos judiciales ni vetos en
  este lote. Ninguna fuente queda en `verificacion: manual`, así que no hace falta aprobación humana
  por ese motivo. Apliqué el mismo umbral que usé para ANCAP/UTE/ANTEL en corridas anteriores: los
  puntos sin desenlace documentado (mediador, canon, "Cap. por inversiones") se declaran en el texto
  y en `notas_internas`, no bajan el tier de todo el registro.
- **Hipótesis nueva**: `hipotesis/afe/cap-por-inversiones-origen-2020-2021.yaml`, con evidencia a
  favor y en contra, tres explicaciones alternativas (ninguna descartada) y cómo descartar cada una.
  Uso `politico: afe` porque el formato de hipótesis es por sujeto/slug y esta no tiene un político
  asociado; es una hipótesis sobre la empresa.
- **`analisis.yaml`**: no escribí ninguno. No encontré, ni en esta sesión ni en las dos vueltas del
  investigador, un documento de un tercero con tres o más cifras o comparaciones sobre AFE (el
  informe del Órgano de Control del Proyecto Ferrocarril Central que se buscó para el argumento en
  contra resultó ser sobre incumplimientos del contratista, no sobre AFE ni su diseño, y no se usó).
- **Medios**: los tres archivos de `inbox/.../medios/` (`afe.yaml`, `mtop.yaml`,
  `union-ferroviaria.yaml`) están completos y con el mismo formato que `content/medios/anp.yaml`;
  no les hice cambios. Los copié temporalmente a `content/medios/` para poder correr
  `pnpm validar --red` (que necesita resolver esas referencias) y los borré después; `content/`
  queda limpio (`git status` no muestra cambios ahí).

## Cambios de forma

- `finanzas[2022].deuda_financiera.usd`: intenté redondear de 0.173 a 0.17 pensando que la serie
  usaba un decimal; el validador marcó que ya no cerraba contra `pesos / cotizacion` (6.95/40.071 =
  0.1734, redondeado a 0.2, contra 0.17 declarado = 2.0% de desvío). Revertí a 0.173, el valor
  original del investigador, que sí cierra.
- Errores tipográficos menores en las citas del OCR de 2011-2012 (ej. "Servicio de pasajeros
  8,871.163" con coma en vez de punto) se dejan tal cual: son transcripciones literales del PDF y
  las erratas del propio documento no se corrigen en la cita.
