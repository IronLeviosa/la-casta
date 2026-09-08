# Razones — corrida 2026-09-08-empresas-ancap-serie-historica

Editor: Sonnet (`claude-sonnet-5`), por decisión del mantenedor (2026-09-07): ningún subagente
corre en Fable sin permiso, Opus queda para el crítico. Registro: `inbox/empresas/ancap/2026-09-08-serie-historica/empresas.yaml`
(un solo registro, `ancap`). Partí del crudo ya corregido por el investigador en su "segunda vuelta"
(ver `notas.md` del lote), que ya había resuelto la mayoría de las objeciones `corregir` y los dos
`bloquea` sobre los años 2004-2013 y `cobertura_del_periodo`. Lo que sigue es lo que cambié yo.

## Cambios sustantivos

- **Concepto de `impuestos_pagados` en los diez años ya publicados (2015-2024).** El crítico mostró
  que el `concepto` decía "no incluye el IRAE propio de Ancap ni transferencias a Rentas Generales" y
  que eso es falso en los años nuevos (2004-2013); yo encontré que la ficha **ya publicada**
  (2015-2024) tiene el mismo error, palabra por palabra, en los diez años. Verifiqué con `pnpm fuente`
  los balances de 2015 y 2024 (los dos extremos del tramo): los dos incluyen "Impuesto al Patrimonio" e
  "Impuesto a la Renta de las Actividades Económicas" (IRAE propio de Ancap) dentro de "Total
  impuestos". Corregí el `concepto` en los diez años con `replace_all` a un texto que dice lo que la
  nota realmente contiene. Referencia: `critica.md`, objeción transversal "finanzas[2004-2013].impuestos_pagados.concepto",
  severidad `bloquea`, párrafo que dice "Y el mismo error está en la ficha publicada". Va a
  `content/correcciones/2026-09-08-ancap-error-concepto-impuestos.yaml`, tipo `error_factual`.
- **`resumen` reescrito para 2000-2024.** Estaba escrito solo para 2015-2024 (llamaba a 2014 "el año
  anterior al período de esta ficha", cuando ya está cargado). Lo reescribí con el mismo nivel de
  detalle para los seis gobiernos con datos (Batlle, Vázquez I, Mujica, Vázquez II, Lacalle Pou, y la
  ausencia de dato para Orsi por falta de ejercicio cerrado), agregando: los huecos de 2001 (sin
  documento archivado) y 2004 (base mixta); el préstamo del MEF de 2013 como origen documentado de la
  capitalización de 2016; el salto de deuda financiera de 2011 a 2012-2013 explicado por la compra con
  descuento de la deuda con PDVSA; que el segmento Portland perdió los 21 años con datos de los 25 que
  cubre la ficha (dato que el lector no iba a inferir mirando el gráfico); y la reexpresión bajo NIIF
  del resultado de 2013 entre el balance de 2013 y el de 2014. Referencia: `critica.md`, "Objeciones al
  lote", segundo punto ("La ficha va a decir «Balances cargados: 2004 a 2024» y el resumen sigue
  escrito para 2015-2024"). Va a la misma corrección de tipo `contexto_omitido` que los hitos y los
  años nuevos (`2026-09-08-ancap-serie-historica-2000-2014`).
- **Seis hitos nuevos en `hitos[]`** (1999-12-01 formación de Alcoholes del Uruguay S.A., 2008
  capitalización de ANCAP a DUCSA, 2011-09-30 venta de Petrolera del Conosur a PDVSA Argentina,
  2012-12-26 compra con descuento de la deuda con PDVSA, 2013-01-02 préstamo del MEF, 2014 adopción de
  NIIF), cada uno con una fuente que leí yo misma con `pnpm fuente` en esta sesión (no copié las citas
  de `notas.md` ni de `critica.md`, que no traían texto literal para varias de ellas). No agregué la
  formación de AMBD S.A. (bebidas, 1999) porque no estaba en la lista que me pidieron y no es central a
  la historia del monopolio de combustibles y pórtland. Para Alcoholes del Uruguay S.A. dejé la
  salvedad explícita que pide `notas.md`: no verifiqué si es la misma sociedad que hoy opera como ALUR.
  Para la capitalización a DUCSA, solo pude verificar con fuente propia un aporte de capital en
  efectivo de $ 652,6 millones en el flujo de fondos del balance 2008; no encontré el texto con las
  fechas de resolución de directorio (17/5/2007) y de asamblea de Ducsa (28/3/2008) que traía
  `notas.md`, así que el hito queda fechado en el año 2008, sin esas dos fechas puntuales, para no citar
  algo que no pude confirmar yo misma en esta sesión (regla 4 y regla del "una cita, una lectura
  propia"). Referencia: `critica.md`, "notas.md `## para_el_editor` — candidatos a hito 1999-2008",
  severidad `corregir`.
- **Segmentos de 2002 y 2003: agregada la advertencia de que no se mezclan con los de 2016-2024.** Los
  años 2005-2014 ya traían, en su `nota` de año, la aclaración de que el desagregado por división en
  pesos (Energía/Portland) es distinto del desglose por línea de negocio en dólares que aparece desde
  2016; 2002 y 2003 no la tenían. La agregué en los dos, con la misma frase que ya usaban los demás
  años. Referencia: `critica.md`, "Ayudas visuales" ("los `segmentos[]` que se carguen de los balances
  viejos... no se grafiquen mezclados... sin una nota que lo diga").
- **Recorte de las `nota` de 2002, 2003, 2011, 2012 y 2013.** Eran las cinco más largas del lote (hasta
  seis oraciones), y repetían, año por año, la misma historia general (la reexpresión contable hasta
  2011, el préstamo del MEF, la compra de la deuda con PDVSA, el quiebre NIIF de 2013/2014) que ahora
  está una sola vez en el `resumen`. Las recorté a una o dos oraciones con el dato específico de ese
  año y una remisión al resumen o al hito correspondiente para el resto, siguiendo la regla de
  presentación de `editor.md` ("que `concepto` y `nota` sean una oración... lo largo pasa al
  `resumen`"). No toqué las `nota` de 2000, 2004 y 2014, que ya eran razonablemente cortas para lo
  específico de cada una (2000 y 2004 explican una fuente atípica; 2014 explica el quiebre NIIF que no
  se repite en ningún otro año).
- **`notas_internas` del registro, reescritas.** Documenté ahí qué de la crítica quedó resuelto en esta
  corrida y qué queda pendiente (decreto de julio 2023 sin número confirmado; comparación CEPP de
  gasoil sin precio absoluto para Uruguay; "Resultado Monopólico" no cargado como segmento por no poder
  verificar la extracción del PDF; la serie de precio-vs-paridad de URSEA sigue sin llegar a
  2000-2014). Estos cuatro puntos ya eran pendientes de una revisión anterior de la misma ficha (no de
  esta corrida) y siguen sin resolverse; no bajan el tier porque no afectan ningún dato ya cargado, solo
  documentan un límite de la fuente pública disponible.

## Citas corregidas para que `--red` valide

Estos cuatro cambios no alteran ningún hecho publicado: son citas que ya estaban en el crudo (tres de
ellas, del investigador; no de esta corrida) y que saltaban líneas de la fuente sin decirlo con puntos
suspensivos, lo que las volvía citas no contiguas. Las reescribí como tramo contiguo completo, tal como
exige `editor.md` ("Una cita es un tramo contiguo del texto de la fuente"):
- `finanzas[2002].impuestos_pagados.fuentes[0].cita`: agregadas las líneas de Cofis, Tribunal de
  Cuentas y las dos líneas de retenciones que faltaban entre "Impuesto al Valor Agregado" y "TOTAL
  IMPUESTOS".
- `finanzas[2003].impuestos_pagados.fuentes[0].cita`: agregada la línea de Cofis y las de Tribunal de
  Cuentas y retenciones IVA e IRIC.
- `finanzas[2014].impuestos_pagados.fuentes[0].cita`: agregadas las líneas de IVA, Tribunal de Cuentas,
  FUDAEE y retenciones que faltaban entre "Impuesto Específico Interno" y "Total impuestos".
- `finanzas[2012].deuda_financiera.fuentes[2].cita` y la cita del hito nuevo de 2012-12-26: "N.º 1590"
  corregido a "N° 1590", tal como figura en el documento (aviso de `--red`, no error).

## Cambios de forma

- Ninguno más allá de lo anterior. No toqué fechas, mayúsculas ni la fuente del `resumen` general
  (`fuentes[]` del registro).

## Objeciones de `critica.md` que quedaron abiertas

- **Ninguna objeción `bloquea` ni `corregir` de esta crítica quedó sin resolver.** Las dos `bloquea`
  (concepto de impuestos, cobertura 2000-2003) y las once `corregir` están resueltas entre la segunda
  vuelta del investigador y esta edición.
- Los cinco `aviso` sobre 2005-2010 ("sin objeción propia") no requerían acción.
- El aviso sobre Regla 2 (dos lecturas con WebFetch en `consultas.jsonl`, sin cita contaminada) no
  requiere acción: el investigador ya documentó que no citó nada de esas lecturas.
- El aviso sobre tabulaciones preexistentes en `precios_vs_paridad` del `content/empresas/ancap.yaml`
  ya publicado queda fuera de alcance de este lote (preexistente, no tocado por esta corrida); lo dejo
  anotado para quien haga la próxima corrida sobre esta ficha.

## Umbral aplicado

Apliqué a esta ficha el mismo umbral de rigor que usaría con la ficha de cualquier otra empresa
pública o ente del Estado, sin importar qué gobierno esté mejor o peor representado en la serie: el
crítico había señalado que el único período subrepresentado era el de Jorge Batlle (2000-2004, el
único con un solo año de fuente débil antes de esta corrida); esta corrida lo empareja con el resto
cargando 2000, 2002 y 2003 con el mismo tipo de fuente (balance auditado) que ya tenían los demás años,
y documentando 2001 como no disponible con la misma honestidad con la que se documentan los huecos de
cualquier otro año. El `resumen` describe con el mismo detalle los resultados positivos y negativos de
los seis gobiernos, sin adjetivos.

## Tier

`revision.tier: publicado` para el único registro del lote (`ancap`). No hay giros, promesas ni
chequeos en este lote (corrida de datos de una empresa pública, sin declaraciones de un político). No
hay casos. No hay fuentes `verificacion: manual`. No hay ningún registro que requiera aprobación
humana.

## Corrección pública propuesta

Dos correcciones, porque son de naturaleza distinta: una corrige un dato ya publicado que decía lo
contrario de lo que dice el documento (`error_factual`), y la otra agrega contexto que no estaba
(`contexto_omitido`, años, segmentos e hitos nuevos). El id que había puesto el investigador en
`procedencia` del crudo (`2026-09-08-ancap-segmentos-paridad-hitos`) lo reemplazo por estos dos; el
campo `procedencia` del crudo no lo edité (lo escribe `pnpm promover`, no el editor).

### 1. `2026-09-08-ancap-error-concepto-impuestos` — tipo `error_factual`

- **afecta:** `empresas/ancap`
- **de:** El concepto de "impuestos pagados" decía, en los 21 años cargados (2004-2024), que la cifra
  "no incluye el IRAE propio de Ancap ni transferencias a Rentas Generales".
- **a:** El concepto ahora dice que la cifra sí incluye el Impuesto al Patrimonio y el impuesto a la
  renta propio de Ancap (IRIC hasta 2006, IRAE desde 2007), además de IMESI, IVA y otras retenciones de
  terceros; solo excluye la versión a Rentas Generales (que se registra aparte, en
  `transferencias_al_estado`).
- **motivo:** La nota "Impuestos pagos y montos recaudados como agente de retención" de los balances
  auditados de Ancap (verificado en los balances de 2002, 2003, 2005, 2013, 2014, 2015 y 2024) incluye
  el impuesto a la renta propio de la empresa y el Impuesto al Patrimonio; la frase anterior afirmaba lo
  contrario de lo que dice el documento que la propia ficha citaba. Objeción `bloquea` de
  `data/corridas/2026-09-08-empresas-ancap-serie-historica/critica.md`.

### 2. `2026-09-08-ancap-serie-historica-2000-2014` — tipo `contexto_omitido`

- **afecta:** `empresas/ancap`
- **agrega:** ejercicios 2000, 2002-2014 en `finanzas[]` (2001 documentado como sin balance archivado),
  segmentos por división 2002-2014, seis hitos (1999-2014).
- **de:** La ficha tenía balances desde 2015 y un resumen escrito solo para el período 2015-2024; la
  línea de tiempo (`hitos[]`) saltaba de 2003 a 2016 sin mencionar el préstamo del MEF de 2013 que
  explica la capitalización de 2016, ni la compra con descuento de la deuda con PDVSA de 2012.
- **a:** La ficha tiene ahora ejercicios desde 2000 (con los huecos de 2001, sin documento archivado, y
  2004, con base mixta, explicados), segmentos por división para 2002-2014, seis hitos nuevos que
  completan el arco 1999-2014, y un resumen reescrito con el mismo nivel de detalle para los seis
  gobiernos del período.
- **motivo:** Objeciones `bloquea` (cobertura del período 2000-2003) y `corregir` (segmentos por
  división, hitos faltantes, balance 2014 no cargado, resumen escrito solo para 2015-2024) de
  `data/corridas/2026-09-08-empresas-ancap-serie-historica/critica.md`.
