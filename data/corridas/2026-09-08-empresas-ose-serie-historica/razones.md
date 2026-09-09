# Razones — corrida 2026-09-08-empresas-ose-serie-historica

Editor: Sonnet (claude-sonnet-5), por decisión del mantenedor del 2026-09-07 (ningún subagente
corre en Fable sin permiso explícito; Opus queda para el crítico). Lote: una ficha de empresa
(`empresas.yaml`, OSE), vuelta 3, que ya resolvía en el crudo casi todas las objeciones de
investigación de `critica.md`. Mi trabajo fue lo que el investigador dejó para el editor:
`hitos[]`, `resumen`, la corrección BID/ADERASA propuesta desde la otra corrida, la
presentación (notas largas/repetidas, `comparaciones[]`) y el `tier`.

## Objeciones de `critica.md` y qué se hizo con cada una

Los puntos de investigación (cifras, fuentes, `concepto` por campo) ya estaban resueltos por
el investigador en esta tercera vuelta; abajo solo lo que quedaba para el editor.

- **`resumen`/`hitos[2018]`/`finanzas[2018].nota` — bloquea.** El investigador ya había
  corregido `finanzas[2018].nota` (dice que la desagregación por actividad no empieza en
  2018). Yo corregí lo que quedaba: (1) borré la nota de `segmentos[0]` de 2018 que todavía
  decía "Primer año en que OSE desagrega el resultado por actividad", contradiciendo la nota
  del año; (2) reemplacé el hito de 2018 ("Primer año con resultado desagregado por segmento
  de negocio") por un hito en 2008 con esa misma fuente (Nota 22.3 del balance de 2008, ya
  releída y citada en este lote) y agregué un hito en 2018 con el título correcto ("Vuelve a
  publicarse la apertura del resultado por segmento de negocio"); (3) reescribí el párrafo del
  `resumen` que decía "Desde 2018, OSE desagrega su resultado en tres segmentos" con el
  período correcto (13 de 19 ejercicios documentados, 2008-2014 y 2018-2024) y los conteos de
  Alcantarillado positivo/negativo recalculados año por año contra las cifras de
  `finanzas[]` (positivo en 2008, 2009, 2011, 2021 y 2022; negativo en los otros ocho).
  Verifiqué los signos de cada año leyendo `segmentos[]` en el propio archivo, no de memoria.

- **`finanzas[2013].resultado_ejercicio` — bloquea.** Ya resuelto por el investigador
  (pérdida de $ 168,9 M / USD -7,9 M, Nota 4.23 del balance 2014). Sin acción del editor más
  allá de reflejar el nuevo signo en el `resumen` (ver abajo) y en `correccion.yaml`.

- **`finanzas[2013].capitalizaciones_del_estado`, `.deuda_financiera`, `.impuestos_pagados`,
  `.transferencias_al_estado`, `.segmentos` — corregir.** Todos resueltos por el investigador
  (fuente principal reemplazada, cita extendida, `concepto` recortado a una oración, base
  consolidada declarada una vez en la nota del año). No requirieron acción adicional del
  editor salvo el recorte de una oración más en el `concepto` de `capitalizaciones_del_estado`
  2013 (350 caracteres a con dos cláusulas separadas por punto y coma).

- **`finanzas[2005].resultado_ejercicio` — corregir.** Ya resuelto por el investigador
  (`tipo_cambio` sacado, `concepto` sin contradecirse). Sin acción adicional.

- **`finanzas[2008]`, `[2009]`, `[2010]`, `[2012]` — aviso/corregir.** Todos resueltos por el
  investigador en esta vuelta (cita del estado de flujo de efectivo en 2008, cita extendida en
  2009, `capitalizaciones_del_estado` sacado en 2010 en vez de forzado a cero, impuestos y
  transferencias agregados en 2012 con el documento consolidado). Sin acción adicional.

- **`finanzas[2011]`, `[2014]` — sin_objecion/aviso.** Sin cambios.

- **`cobertura_del_periodo` 2006/2007 — corregir.** El investigador cargó 2007 (parcial,
  columna comparativa del balance de 2008) en esta vuelta. 2006 sigue sin documento público
  tras las búsquedas adicionales (Banco Mundial, BID, Tribunal de Cuentas, Rendición de
  Cuentas); lo dejo así, declarado en el `resumen`, no oculto.

- **Objeción al lote 1 (la línea de cobertura del componente no declara los huecos) —
  corregir, "no se cierra el lote sin eso".** No puedo tocar `src/pages/empresas/[slug].astro`
  (fuera de mi alcance como editor). Lo resolví por el camino que la propia objeción deja
  abierto: un párrafo nuevo en el `resumen` que dice explícitamente que falta 2006 y que 2005,
  2007 y 2010 son parciales, y por qué. Si en el futuro se decide además ampliar el
  componente para enumerar huecos automáticamente, esta ficha ya tiene la información en
  `nota` de cada año para que ese trabajo no dependa de releer balances.

- **Objeción al lote 2 (ceros vs. guiones) — corregir.** Resuelto por el investigador
  (capitalizaciones completado en 2015, 2017-2021; transferencias en 2022). Actualicé el
  `resumen` y `revision.notas_internas` para reflejar los años que siguen sin dato (2005,
  2007, 2010 en capitalizaciones; 2005, 2007, 2010, 2011, 2019, 2021 en transferencias) sin
  volver a mezclarlos con ceros.

- **Objeción al lote 3 (38 notas al pie, 21 de más de 300 caracteres) — corregir, "aplicarlo
  a los diez años ya publicados también".** El investigador ya había recortado los años
  nuevos (2005, 2007-2014, 2018). Yo recorté los siete años publicados que quedaban largos:
  2015 (1211→255 caracteres: separé la reexpresión, que ya estaba en el `concepto` de
  `resultado_ejercicio`, de la salvedad de tipo de cambio, que quedó en `nota`), 2019
  (696→160: dejé solo que no hay balance propio; la hipótesis sin confirmar sobre el Impuesto
  a la Renta pasó a `revision.notas_internas`), 2020 (602→0: la nota entera era el texto de
  prorrateo, ahora en el `resumen`, así que la borré), 2021 (764→150), 2022 (960→190), 2023
  (1641→235: mantuve la emergencia hídrica y de dónde sale la deuda; saqué el resumen de
  transferencias del período entero, que ya está en el `resumen`), 2024 (1053→270). El texto
  de "los resultados financieros y otros resultados se prorratean por ingresos de explotación"
  se repetía casi textual en 2020-2024 (cinco años): ahora está una vez en el `resumen`,
  precisando que empieza en 2020 (2018 y 2019 no traen esa nota). Volví a correr
  `pnpm validar --inbox` después de cada tanda de recortes; dos notas quedaron por encima de
  300 caracteres en la primera pasada (2015 y 2023) y las acorté una vez más.

- **Objeción al lote 4 (citas de segmentos repetidas 3 veces por año) — aviso.** No la toqué:
  el propio investigador ya la dejó fuera de esta vuelta por ser un cambio de forma sin dato
  nuevo, y coincido en que no vale la reescritura de ~40 bloques de fuente para esta corrida.

- **Objeción al lote 5 (`comparaciones[]` que deberían ser `analisis[]`) — aviso, "corregir
  cuando se toque la ficha".** Se está tocando la ficha. Las 7 comparaciones de este archivo
  salen todas del informe del BID (2020) o de ADERASA (2024, datos 2022), que van a tener
  página propia en `content/analisis/ose/` (otra corrida, `2026-09-08-analisis-ose-bid-
  aderasa`). Vacié `comparaciones[]` completo: la regla de presentación dice que la página
  oculta las comparaciones cuya fuente es un análisis publicado, así que dejarlas no le
  aportaba nada al lector y sí duplicaba mantenimiento. El contenido no se pierde: quedó,
  corregido, en el `resumen` (ver la corrección BID/ADERASA abajo).

- **Objeción al lote 6 (1952-2007, vías sin agotar) — corregir.** El investigador probó en
  esta vuelta el Banco Mundial (PAD 2012, ICR 2013), BID, Tribunal de Cuentas y Rendición de
  Cuentas/Parlamento para 2005-2006, sin resultado, y lo dejó documentado en
  `busquedas_2005_sin_resultado`. No repetí esas búsquedas (son trabajo de investigación, no
  de edición); reflejé el estado actual en el `resumen` sin afirmar que 1952-2004 "no
  existen", solo que no aparecieron en las fuentes consultadas.

- **Objeción al lote 7 (simetría entre gobiernos) — sin objeción del crítico, revisada de
  nuevo por mí.** Los años con más y menos detalle (2008/2009/2013/2014 vs. 2005/2010) se
  explican por qué documento existe, no por qué gobierno gobernaba; los cuatro hitos nuevos
  que agregué reparten hechos entre los gobiernos de Batlle (creación del vínculo con Uragua,
  2000), Vázquez I/Mujica (fin del ajuste por inflación, 2012; modificación de 2013 conocida
  en 2014) y Lacalle Pou (ley 19.889, 2020) con el mismo criterio (hecho fechado con fuente
  primaria, no valorado). Ninguna `nota` ni `concepto` que edité usa un adjetivo o un verbo de
  intención.

- **Objeción al lote 8 (quiebre de método: ajuste por inflación 2009-2011 vs. nominal desde
  2012) — aviso.** Agregué un hito (decreto 104/12, 2012-04-10) con la cita exacta que trajo
  el crítico, releída por mí con `pnpm fuente` en esta sesión. No hay campo `metodo` de
  gráfico en esta ficha (no es un `chequeo`); el hito cumple el mismo objetivo de que el
  lector entienda por qué la serie en pesos no es directamente comparable año a año antes y
  después de 2012.

- **Objeción al lote 9 (hitos que salieron de las lecturas y la ficha no tenía) — para el
  editor, con fuente.** Agregué los tres que trajo el crítico (concesión a Uragua en 2000,
  decreto 104/12, modificación de 2013) más el que pidió el encargo de esta tarea (ley 19.889,
  2020). Releí las cuatro fuentes yo mismo con `pnpm fuente` en esta sesión (no copié las citas
  de `critica.md`, que son para orientar, no para publicar): confirmé el texto de
  `archivo.presidencia.gub.uy/mem2000/info/OSE.htm` sobre Uragua, la Nota 3.1 y la Nota 4.23
  del balance de 2014 (Banco Mundial), y reutilicé la cita de la Nota 1 del balance de 2024
  sobre la ley 19.889 (ya en `creacion.fuentes[1]` de este mismo archivo, verificada con
  `--red` en la vuelta anterior).

- **Objeción al lote 10 (`revision` viaja heredada, no es decisión del editor) — aviso.**
  Tomé la decisión explícita: `publicado` (ver "Tier" abajo), no por herencia.

- **Objeción al lote 11 (la copia del Banco Mundial no es una segunda fuente independiente) —
  informativa.** No hay ningún texto en la ficha que la presente como confirmación externa;
  no requirió cambio.

- **Objeción al lote 12 (bug de `pareceEscaneado()`) — informativa, herramienta.** No es del
  alcance del editor (no toco `scripts/`); queda para quien mantenga el pipeline.

## Corrección BID/ADERASA (de `data/corridas/2026-09-08-analisis-ose-bid-aderasa/razones.md`)

El editor de ese lote propuso cuatro cambios a `comparaciones[0]`, `[3]`, `[5]` y al `resumen`
de esta ficha. Verifiqué las dos afirmaciones de fondo yo mismo, con `pnpm fuente`, antes de
aplicar nada (Regla 0: no se corrige sin verificación propia):

- **Lentini (2015), Cuadro 4 y texto del Anexo**: confirmado. La tabla trae 11 filas de país
  (Argentina a Uruguay) con número de operadores, mínimo, promedio y máximo, y una fila
  "Total 57 0,17 1,40 2,35". Uruguay figura con 1 operador y valor 2,06 en las tres columnas
  (mínimo = promedio = máximo, porque es un solo dato). El texto del informe dice
  explícitamente que Costa Rica, Honduras, México y Panamá y Uruguay son los países con datos
  de un único operador, y que de esos cinco, Costa Rica, Panamá y Uruguay son de alcance
  nacional. Esto confirma que el USD 2,06/m3 es la tarifa de OSE, no un promedio de "Uruguay"
  con más de un operador, y que el promedio de 1,22/mínimo 0,39/máximo 2,06 que cita el BID es
  el promedio de los 11 promedios por país, no de los 57 operadores (cuyo promedio real es
  1,40, mínimo 0,17, máximo 2,35 en Colombia). Apliqué la corrección al `resumen` (no queda
  `comparaciones[]` donde aplicarla, ver arriba).
- **ADERASA (2024, datos 2022)**: confirmado. La tabla de indicadores (página 49 del PDF) da
  88,94% para OSE/Montevideo en tratamiento de aguas residuales; la sección de conclusiones
  por país (página 75) dice "el 88,98% de las aguas residuales volcadas de OSE recibió
  tratamiento previo". Son dos cifras del mismo informe para el mismo dato. Apliqué la
  salvedad al `resumen`.

No apliqué el cambio como una edición de `comparaciones[]` porque decidí (ver objeción al lote
5 arriba) vaciar ese campo entero: las correcciones puntuales habrían quedado en un campo que
la página ya no muestra. El contenido corregido está en el `resumen`.

## Cifras publicadas que cambian

- `finanzas[2013].resultado_ejercicio`: de ganancia $ 111.631.368 (USD 6,0 M) a pérdida
  $ 168.947.152 (USD -7,9 M). Cambia el signo porque la propia OSE reexpresó la cifra en el
  balance de 2014 (Nota 4.23); no es un error de esta corrida, es la cifra vigente reemplazando
  a una que dejó de estarlo. Ya estaba resuelto en el crudo del investigador; lo reflejo acá
  porque es el cambio más visible del lote.
- Ninguna otra cifra numérica de un año ya publicado (2015-2024) cambia. Los cambios en esos
  años son de presentación (notas más cortas, comparaciones fuera de `comparaciones[]`) o de
  cobertura (capitalizaciones/transferencias completadas donde faltaba verificación, no donde
  faltaba dato).

## Tier

`publicado`. Toda cifra factual tiene `documento_oficial` (balances propios de OSE, dictámenes
del Tribunal de Cuentas incorporados en esos balances, la Memoria del Poder Ejecutivo 2000);
donde falta un campo, queda ausente y declarado en `nota`/`resumen`, no en cero ni oculto. Los
dos años con estándar más bajo (2005, presentación institucional no auditada; 2012-2013, con
tramos leídos por OCR) están declarados como tales y las cifras de OCR están confirmadas por
un segundo documento en texto o por la aritmética interna de la fila, según el criterio que la
propia crítica pidió dejar escrito (ver `docs/diccionario-empresas.md`, regla 5). No hay
`verificacion: manual`, no hay casos judiciales en este registro. Es el mismo umbral aplicado a
las fichas de ANCAP, ANTEL y UTE ya publicadas con el mismo patrón de huecos documentados.

## Cambios de forma

- Errata de OCR en el `concepto` de `capitalizaciones_del_estado` de 2013: recorté a una
  oración con punto y coma (era correcta, solo larga).
- Cita del hito "Delgado: no hay privatización" (Telenoche, 2022-11-17, no tocado por el
  investigador en ninguna vuelta): la validación `--red` la marcó "aproximada" (0.99); la
  cita tenía comillas tipográficas y una coma de la fuente convertidas en punto. La reescribí
  como tramo literal sin la puntuación agregada por el medio.

## Validación

- `pnpm validar --inbox inbox/empresas/ose/2026-09-08-serie-historica`: 0 errores (esquema,
  referencias, tiers, simetría).
- `pnpm validar --inbox inbox/empresas/ose/2026-09-08-serie-historica --red`: 0 errores;
  25 URLs verificadas; 116 citas, 116 exactas, 0 aproximadas, 0 manuales.
- Nota sobre `correccion.yaml`: `scripts/lib/inbox.ts` (`ARCHIVOS_INBOX`) no tiene "correccion"
  como colección válida del inbox, así que `pnpm validar --inbox` sobre la carpeta completa
  falla con "no corresponde a ninguna colección conocida" en cuanto ese archivo está presente
  (es un gap de la herramienta, no de este lote: no hay ninguna colección de corrección
  registrada para `--inbox`, y no me corresponde tocar `scripts/`). Verifiqué que el contenido
  de datos es válido sacando `correccion.yaml` de la carpeta antes de correr el validador con
  `--red` (0 errores, igual que arriba) y devolviéndolo después. `/revisar` debería tratar
  `correccion.yaml` como lo que es -el insumo para `pnpm promover --correccion`, no un
  registro de una colección- y no pasarlo por esta validación de colecciones.

## Mensaje de commit propuesto

```
OSE: serie histórica 2005-2014, hito de segmentos corregido (2008, no 2018), resultado de
2013 reexpresado a pérdida, cuatro hitos nuevos y comparaciones internacionales corregidas
[correccion 2026-09-08-ose-serie-historica-2005-2014]
```
