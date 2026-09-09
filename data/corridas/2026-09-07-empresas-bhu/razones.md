# Razones — corrida 2026-09-07-empresas-bhu

Editor: Sonnet (regla del mantenedor, 2026-09-07). El investigador ya había resuelto la mayoría de
las objeciones de `critica.md` en una "vuelta 2" (ver `notas.md`); lo que sigue es lo que edité yo,
sobre el archivo que llegó de esa vuelta 2.

## Cambios sobre el crudo

- **B1/2009 (capitalizaciones_del_estado).** El balance de 2009 trae dos cifras que no concilian:
  $ 582.785.837 (nota 3.21.1, mecanismo del art. 124 Ley 18.046: el MEF asumió pasivos por
  $ 11.860,96 M a cambio de activos por $ 11.278,18 M) y $ 5.343.273 miles (Estado de Evolución del
  Patrimonio, línea "Aportes de capital"). La vuelta 2 del investigador había cargado la primera.
  Releí el balance completo con `pnpm fuente` y encontré que la segunda cifra la confirman **dos**
  estados contables independientes del mismo balance (el Estado de Evolución del Patrimonio y el
  Flujo de Efectivo por Actividades de Financiamiento, "Integrac. (rescate) de capital... 5.343.273"),
  mientras que la de la nota 3.21.1 describe un mecanismo distinto y más chico. Cambié
  `finanzas[2009].capitalizaciones_del_estado` a $ 5.343,3 M (USD 272,3 M), con las dos citas nuevas,
  y dejé la cifra de la nota 3.21.1 declarada en `nota`, sin conciliar (el documento no explica la
  diferencia). Actualicé también `hitos[2009-03-09].detalle` y sus fuentes para reflejar las dos
  cifras, y el `resumen` para no repetir el número viejo. Instrucción explícita del encargo de esta
  corrida ("cargá la cifra que el estado de evolución del patrimonio atribuye a «aportes de
  capital»").

- **C15 (impuestos_pagados de 2017).** La crítica señaló que 2017 usaba una base pre-NIIF
  ($ 1.722,1 M, Nota 6 propia del balance de 2017) mientras que `content/empresas/brou.yaml` usa la
  columna comparativa NIIF para su propio año de transición (también 2017). Además, dentro de la
  propia ficha del BHU, `resultado_ejercicio` de 2017 ya usaba la comparativa NIIF como cifra
  principal (con el original pre-NIIF declarado aparte): la ficha tenía dos criterios distintos para
  el mismo año. Fijé un solo criterio — usar la columna comparativa NIIF del balance siguiente
  cuando existe, con el original pre-NIIF citado en el propio campo — y lo apliqué a
  `impuestos_pagados` de 2017 ($ 1.647,6 M = $ 984,0 M de impuesto a la renta + $ 663,5 M de
  "Impuestos, tasas y contribuciones", Nota 15.1 y nota de Gastos generales del balance de 2018).
  Releí ambas notas con `pnpm fuente`. No toqué `content/empresas/brou.yaml`: ya aplica este mismo
  criterio, así que no hace falta una corrección ahí.

- **B3 (`monopolio.tiene` y los dos privilegios).** No cambié `tiene: false` del BHU. Revisé el texto
  de `content/empresas/brou.yaml` (`tiene: true`) y encontré que la diferencia es sustantiva, no
  arbitraria: BROU tiene una actividad reservada por ley en sentido estricto (los depósitos de
  organismos públicos y judiciales, art. 453 Ley 15.903 y art. 25 Ley 18.716, con excepción del Poder
  Ejecutivo), mientras que el BHU no tiene ninguna desde 1999 (Ley 17.202). Fijo ese criterio para
  `tiene`: si hay o no una actividad o segmento de mercado reservado por ley, no cualquier privilegio.
  Los privilegios que no llegan a esa reserva (garantía del Estado, en las dos fichas; ejecución
  extrajudicial, en el BHU) se documentan en `alcance` con argumentos de los dos lados en las dos
  fichas, sea cual sea `tiene`, que es lo que ya hacen las dos. **No propongo corrección a BROU**: el
  criterio, una vez escrito, ya es el mismo para las dos.
  Sobre la asimetría de fondo que señaló B3(a) — los dos "en contra" (FMI/BM, BID) pegan en los dos
  privilegios puntuales y los dos "a favor" (AEBU, Presidencia 2006) son defensa institucional
  general, no de esos privilegios — repetí la búsqueda que pide el brief (Hemeroteca del Parlamento,
  exposición de motivos de la Ley 18.125, AEBU, BHU, ANV) y no encontré una defensa específica y
  contemporánea de la garantía del Estado ni de la ejecución extrajudicial. `notas.md` ya documenta
  las búsquedas (08:12-08:16 en `consultas.jsonl`) con el mismo esfuerzo que los "en contra". Sigo el
  criterio de CLAUDE.md ("si un lado tiene fuentes más flojas, lo decís en razones.md, no lo
  recortás"): lo dejo declarado como hecho en el `resumen`, no lo escondo ni bajo el tier por eso.

- **Limpieza de "Detalle en notas.md."** Ocho campos `nota`/`concepto` terminaban con un puntero a
  `notas.md` (2002, 2007, 2009, 2014, 2015, 2017 ×2, 2021, 2022 — antes de mis cambios de contenido).
  `notas.md` sí se publica (`data/corridas/<id>/notas.md`), pero el lector de la ficha no tiene un
  enlace a él y la frase no agrega nada que la propia oración no dijera ya. Saqué la frase en los
  ocho casos (cambio de forma, no de contenido); el texto que queda es autosuficiente en todos los
  casos que revisé.

- **Longitud de `finanzas[2009].nota`.** Al reescribirla por el cambio de B1 quedó en 333 caracteres
  (por encima del umbral de 300 que usa el validador). La acorté a una oración con el número y
  referencia al resumen para el detalle del mecanismo alternativo.

- **`resumen`.** No existía (el investigador no lo escribe). Lo escribí en siete párrafos: qué es el
  BHU y sus dos privilegios; la crisis de 2002 y la reestructura 2007-2009 con las capitalizaciones
  de 2002 ($ 19.936,8 M), 2003 ($ 3.375,0 M) y 2009 (con la salvedad de las dos cifras); cómo le fue
  en dólares 2001-2024 (pérdidas en la crisis, positivo desde 2004 con una excepción en 2005, mínimo
  y máximo del período); qué vertió al Estado en criterio de caja (2023 y 2024) y qué años declaran
  cero; los dos privilegios y los dos lados, con la ausencia de defensa específica dicha como hecho;
  2014 sin documento y qué se probó; y un párrafo final "Cómo leer la tabla" con las convenciones que
  se repiten (individual no consolidado, tipo de cambio de cierre declarado por cada balance, NIIF
  desde 2018, un único segmento declarado por el banco, sin `deuda_financiera` con el mismo criterio
  que BROU pese a que el BHU emite OHR).

- **`revision: {tier: publicado, notas_internas}`.** No existía. Asigné `publicado`: los tres
  bloqueantes de la crítica están resueltos o declarados con el mismo umbral que se aplicó a ANCAP,
  UTE y ANTEL en estas mismas correcciones; los 16 "corregir" están resueltos (verificado campo por
  campo, no solo por la tabla de `notas.md`); no quedan objeciones `corregir` sin resolver de esta
  crítica. `notas_internas` deja escrito el criterio de 2009, el de `tiene`/C15, y la búsqueda sin
  resultado de una defensa específica de los privilegios.

## Objeciones que no ameritaron cambio

- **C1-C14, C16 y las demás partes de B2/B3**: verificadas contra el archivo (no solo contra la
  tabla de `notas.md`) y confirmadas resueltas: cita del FMI recortada a la frase sobre BHU/BROU
  (C1), argumento de AEBU con su salvedad movida a la nota de 2024 (C2), fuente de 2022 corregida al
  bloque individual (C3), nota del "anticipo de resultados" de 2022 reescrita (C4), 2021/2022
  `transferencias_al_estado` ausentes con nota de criterio, 2023 cargado (C5), ceros con cita en
  2015-2020 (C6), hito y `que_hace` refechados a 1999 (C7), 13 campos `concepto`/`nota` acortados a
  una oración (C8), nota de 2017 reescrita entera (C9), lista de bancos sacada de `alcance` (C10),
  nota de 2024 con el fideicomiso y sus dos hitos (C11), hitos ampliados de 9 a 15 (C12), serie
  2001-2013 cargada desde el BCU (C13), cobertura 2001-2024 con 2014 declarado ausente (C14),
  comparaciones sin "TEA" y con la cita del 3,75 % propio (C16). Ninguna requirió otro cambio de mi
  parte.

- **A2 (comparaciones agregadas), A3 (2018 sin dólares), A7 (medio ANV borrado)**: ya resueltas en la
  vuelta 2; verificadas.

- **A4 (segmentos vacío) y A5 (deuda_financiera ausente)**: resueltas acá, en el `resumen` (una
  oración cada una), no en `finanzas[]`: no hay nada que cargar (el banco declara un único segmento;
  en un banco los pasivos son depósitos y valores del negocio, mismo criterio que BROU), pero el
  lector necesitaba la explicación, que antes solo estaba en `notas.md`.

- **A8 (tipo `ente_autonomo`)**: sin cambio. La incertidumbre está bien declarada por el investigador
  y no hay una fuente legal que use la frase literal para el BHU (a diferencia de BROU); mantuve la
  clasificación estándar.

## Sobre la validación con `--red`

`pnpm validar --inbox … --red --solo citas`: 134 citas, 134 exactas, 0 aproximadas (incluye las
citas nuevas de 2009 y de 2017). `pnpm validar --inbox … --red --solo fuentes`, aislado: 0 errores,
37 URLs verificadas, en el segundo intento (el primero tuvo fallas transitorias de `web.archive.org`,
confirmadas como transitorias: las mismas URLs devuelven HTTP 200 por `curl` directo y por reintentos
posteriores del propio validador). La corrida combinada `--red` (citas + fuentes en la misma pasada)
repite entre 8 y 19 errores "HTTP 0, fetch failed" contra distintos subconjuntos de URLs de Wayback
en cada corrida — nunca las mismas dos veces seguidas, nunca un 404 real — lo que apunta a un límite
de tasa del lado de Wayback ante ráfagas de pedidos concurrentes, no a un enlace roto. Documentado
acá para que quede claro que no es un problema del contenido: las etapas de esquema, referencias y
citas —que son las que dependen de lo que yo edité— dan 0 errores de forma consistente.

## Cambios de forma

- Indentación y formato de los bloques YAML nuevos siguen el estilo ya usado en el resto del archivo
  (citas con `>-` para prosa, `|-` para tablas de renglones).
- Ningún otro cambio de fecha, cifra o cita fuera de lo listado arriba.
