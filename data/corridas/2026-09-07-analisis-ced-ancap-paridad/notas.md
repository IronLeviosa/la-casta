# Notas — análisis del CED sobre sobreprecio de combustibles vs. paridad (ANCAP)

Segunda pasada (2026-09-08), sobre el trabajo de un investigador anterior que había corregido ya
`analisis.yaml` según `critica.md` (5 objeciones que bloqueaban, 5 para corregir, 1 aviso) pero fue
interrumpido antes de reescribir este archivo. Esta versión de `notas.md` reemplaza por completo a la
anterior, que describía el estado *previo* a la corrección (huecos falsos en la planilla de URSEA,
29/28 meses, etc.) y ya no corresponde a lo que hay en `analisis.yaml`.

## metodo

Objetivo de esta segunda pasada: verificar en esta sesión (con `pnpm fuente`) que las correcciones ya
aplicadas por el investigador anterior son exactas, cerrar lo que quedaba pendiente de `critica.md`, y
dejar `notas.md` y `consultas.jsonl` al día con el estado real del registro.

Paso a paso:

1. `pnpm validar --inbox inbox/empresas/ancap/2026-09-07-analisis-ced` al arrancar: 0 errores de
   esquema, 2 errores de referencias ajenos a este lote (`content/medios/antel.yaml` y `ose.yaml`, de
   otra corrida en curso); al cerrar, 0 y 0 (la otra corrida ya había terminado).
2. Releída `critica.md` completa (599 líneas) y releído `analisis.yaml` completo (986 líneas) para
   distinguir qué objeción ya estaba resuelta y cuál no, sin recalcular lo que ya estaba bien.
3. **Verificación independiente de la planilla de URSEA** (objeción que gobierna casi toda la
   crítica). Se releyó `Series_PPI_VS_PE_0.xlsx` con `pnpm fuente` en esta sesión y se extrajo el texto
   cacheado (75.054 caracteres) a un script local que parsea las 209 filas —tanto las de fecha ISO
   como las de fecha en texto ("2013-Ene", "2014-Ago (4)", "2016-Nov(5)(6)", etc., con meses en
   español)— y recalcula los promedios. Resultado: **209 filas sin un solo duplicado ni hueco**,
   60/60 meses en 2010-2014 y 53/60 (2019 con solo enero-mayo) en 2015-2019; brechas nafta -1,97 % /
   +8,55 % y gasoil +19,17 % / +33,04 %, que redondean exactamente a los valores que ya tenía
   `analisis.yaml` (-2,0 %, +8,6 %, +19,2 %, +33,0 %). Los diez puntos anuales de los dos gráficos
   (niveles y brecha) también coinciden con el recálculo. **No hizo falta corregir nada de esto**: el
   investigador anterior ya lo había hecho bien.
4. **Verificación independiente de los volúmenes del MIEM.** Se releyó el zip "Venta de derivados de
   petróleo al mercado interno y zona franca" con `pnpm fuente` (184.980 caracteres) y se confirmó,
   contra el encabezado de la hoja "vta merc int", el mapeo de columnas que usa `analisis.yaml`: nafta
   = suma de las columnas 6 a 11 (las seis variantes de gasolina, vigentes y discontinuadas), gasoil =
   suma de las columnas 12 a 14 ("gas oil especial 10S", "gas oil UTE", "gas oil otros"). Con un
   script local que suma esas columnas mes a mes, los cuatro totales que cita `analisis.yaml`
   **coinciden exactamente**: nafta 2010-2014 = 3.094.365 m³, gasoil 2010-2014 = 6.070.917 m³, nafta
   2015-2019 = 4.119.862 m³, gasoil 2015-2019 = 4.951.009 m³ (60/60 meses en los dos quinquenios, sin
   huecos). Las cuatro filas citadas como ancla (2010-01, 2014-12, 2015-01, 2019-12) se confirmaron
   verbatim contra el texto cacheado. Nada de esto necesitó corrección.
5. **Catalogodatos `ursea-ppi_vs_pe_v2`, releído para confirmar el hallazgo del investigador
   anterior sobre 2020-2021.** La descripción del dataset dice que el "primer modelo" (PPI al
   consumidor final, comparable a la planilla de URSEA) cubre 2002-01 a 2020-09, y que desde 2020-10
   rige un "segundo modelo" distinto: "PPI hasta la planta de distribución". Se releyó el recurso
   `ppi_pe.csv` (72.038 caracteres): pese a llamarse "ppi_pe" y estar descrito en la metadata del
   dataset como el período 2002-2020-09, su contenido real **empieza en 2020-10-25** y sus columnas
   son un desglose de costo (FOB, ajuste de calidad, fletes internacionales, seguro, IMESI, IVA,
   `total_precio_ex_planta_1/2`) — el modelo "ex planta de distribución", no el "PPI al consumidor
   final" comparable al PE de la planilla de URSEA. **Esto confirma, no corrige, lo que ya decía
   `analisis.yaml`**: no hay, en este dataset, una serie de precio de venta al público y PPI
   consumidor final para 2020-2021 en la misma base que 2002-2019. La instrucción de esta segunda
   pasada asumía que el "hueco real" quedaba acotado a 2019-06–2020-09 una vez sumado este dataset;
   la lectura del recurso real muestra que no es así (ver `## para_el_editor`).
6. **Explicación mecánica del propio CED, que faltaba.** `critica.md` señalaba que el boletín ofrece,
   en el mismo párrafo que da el "resultado primario corriente negativo en USD 44 millones" de 2021,
   una lectura menos acusatoria de la cifra más grande del análisis: que el "abultado resultado
   primario corriente de ANCAP en el período 2016-2017 estuvo explicado por el sobreprecio pagado por
   los consumidores uruguayos cuando los precios se mantenían fijos y el petróleo bajaba
   considerablemente". Se releyó el PDF del CED, se ubicó la cita exacta y contigua (carácter ~12900)
   y se agregó como fuente de cabecera (no estaba en la versión que dejó el investigador anterior).
7. **Presentación de resultados 2021 de ANCAP, pedida explícitamente por el brief y no buscada
   antes.** Se buscó y se leyó la página "ANCAP presentó resultados del 2021"
   (`ancap.com.uy/10614/1/ancap-presento-resultados-del-2021.html`) y el comunicado oficial en PDF
   que enlaza (`comunicado-resultados-q42021-vf.pdf`, abril de 2022). Ninguno de los dos usa el
   término "resultado primario corriente" que usa el CED, pero el comunicado da dos cifras
   comparables en concepto: una pérdida de USD 32 millones en el "mercado monopólico" 2021 (mismo
   signo y orden de magnitud que los -USD 44 millones del CED, sin poder confirmar si es la misma
   definición) y una renuncia de recaudación de USD 159 millones frente a la PPI "para todos los
   productos vendidos en el mercado interno" en 2021 (mismo orden de magnitud que los "casi USD 200
   millones" que calcula el CED para nafta+gasoil+supergás, tampoco conciliable en detalle). Nota:
   la página HTML (no el PDF) dice "130 millones" en vez de "159 millones" para la misma renuncia;
   se cita el PDF, que es el documento primario, no la nota HTML que lo resume con otra cifra —
   discrepancia que se deja anotada en `## hipotesis` para quien la quiera perseguir, sin tocarla acá
   porque no es sobre el análisis del CED sino sobre un documento de ANCAP.
8. Se agregaron ambas cifras de ANCAP (mercado monopólico -32M, renuncia -159M) como fuente adicional
   en `dato_real.fuentes` de las afirmaciones sobre la renuncia 2021 (46+59+93≈200M) y el resultado
   primario corriente negativo (-44M), sin cambiar la calificación (siguen `discutible`, sigue sin
   haber un documento oficial que use la misma definición que el CED) ni el `_faltante`.
9. Se recontó `analisis.yaml`: 10 afirmaciones, 2 gráficos, 24 fuentes de cabecera + las de cada
   afirmación. Cerrado con `pnpm validar --inbox` limpio (0/0/0/0, ver `## metodo` punto 1 para el
   antes/después de los avisos ajenos al lote).

### Qué se encontró ya hecho y correcto (no se rehizo)

- Los cuatro `dato_real.valor` de las afirmaciones 0 a 3 (huecos, 60/53 meses, brechas recalculadas).
- Las diez `nota` de punto de los gráficos (solo 2019 conserva nota, "5 de 12").
- La `nota` y el `metodo` de ambos gráficos, con 2013 y 2014 ya incluidos.
- El segundo gráfico de brecha (PE/PPI − 1, por producto y año), que no existía en la versión que
  criticó el crítico.
- `publicado` apuntando al PDF del propio CED (`ced.uy`), no a la copia de terceros.
- `autor_es` con fechas, distinción antes/posterior al boletín, nombre del director y criterio
  simétrico (todos los vínculos institucionales documentados, no solo los que apuntan a una persona).
- `metodo` de cabecera sin remitir a `notas.md`.
- El `resumen` ya no dice "ya con la LUC vigente, los sobreprecios fueron menores"; cita la conclusión
  contraria del CED en la oración siguiente.
- La afirmación 4 (40,5 millones) ya atribuida a El Observador, no al CED, con el orden nafta/gasoil
  (14/67) citado de forma contigua.
- Las cuatro afirmaciones nuevas que pedía la simetría: renuncia 2021 (~200M / 105M), resultado
  primario corriente negativo (-44M), conclusión del CED sobre la LUC, afirmación de competitividad.
- El argumento de consistencia interna (1.337 vs. 1.137) en la afirmación de gasoil 2015-2019.

### Qué se corrigió en esta pasada

- Se agregó la cita de la explicación mecánica del propio CED ("el petróleo bajaba
  considerablemente") como fuente de cabecera: era la única "explicación alternativa" de las cuatro
  que señalaba `critica.md` que todavía faltaba.
- Se agregó, a las afirmaciones de renuncia 2021 y resultado primario corriente 2021, la cifra
  comparable del propio comunicado de resultados de ANCAP (abril de 2022): pérdida de USD 32M en el
  "mercado monopólico" y renuncia de USD 159M frente a la PPI para todos los productos. Es la fuente
  "presentación de resultados 2021" que pedía el brief y que el investigador anterior no había
  buscado.
- Se rehízo por completo este archivo (`notas.md`), que había quedado desactualizado.
- Se completó `consultas.jsonl` con las 20 búsquedas y lecturas de esta sesión.

## candidatos_giro

Ninguno: este registro es un análisis de un tercero (el CED) sobre una empresa, no una declaración de
un político con dos momentos comparables.

## hipotesis

- El PDF del CED trae la cifra de gasoil 2015-2019 con dos valores distintos en el mismo documento
  (1137 en el resumen de portada, 1.337 en el cuerpo). Verificado en la copia del propio CED (no solo
  en la de terceros): la doble cifra está en el documento original, no es un artefacto de quien lo
  republicó. Sigue sin poder confirmarse si es un error de imprenta del CED o un artefacto de cómo se
  extrae texto de las cajas de una infografía de portada (el orden de lectura no necesariamente
  coincide con el orden visual). Ya está anotado en el chequeo publicado
  `2022-03-27-sobrecostos-combustibles-1700-millones.yaml`.
- La página HTML "ANCAP presentó resultados del 2021" dice que la empresa "pagó cerca de 130 millones
  de dólares menos con respecto a la paridad de importación" en 2021, mientras que el comunicado en
  PDF que la misma página enlaza (`comunicado-resultados-q42021-vf.pdf`, el documento primario) dice
  "cerca de USD 159 mill.". No se investigó el origen de la diferencia (¿una actualización posterior
  de la nota HTML? ¿un error de redacción?) porque es una discrepancia sobre un documento de ANCAP,
  no sobre el análisis del CED que es el objeto de este registro; se cita el PDF (documento primario)
  y se deja esta nota para quien quiera perseguirla.
- No se pudo reconstruir el monto en dólares de ninguna de las cuatro afirmaciones del CED (USD 78M,
  1.181M, 443M, 1.337M) porque el CED no publica el tipo de cambio mensual, el corte de nafta/gasoil
  ni la ponderación que usó junto con los volúmenes del MIEM. Los volúmenes oficiales ya están
  citados y verificados (ver `## metodo`); lo que falta no es un documento, es la metodología exacta
  del CED para combinarlos con precio y tipo de cambio.
- No hay, en ningún documento oficial revisado en esta corrida ni en la anterior, una serie de precio
  de venta al público y PPI al consumidor final para el tramo 2019-06 a 2021 en la misma base que la
  planilla de URSEA 2002-2019. Ver `## para_el_editor` para lo que esto implica sobre el alcance del
  gráfico y sobre la ficha de ANCAP.

## casos_vistos

Ninguno.

## verificacion_manual

Ninguna URL citada en `analisis.yaml` quedó sin poder leerse. Dos páginas de ANCAP se habían
intentado leer en la sesión anterior y no se citan (se usaron solo para buscar enlaces, vía
`WebFetch`, no como fuente de un dato):
- `https://www.ancap.com.uy/4891/1/datos-ancap.html` — "texto muy corto: paywall, JS o extractor
  fallido".
- `https://www.ancap.com.uy/8887/1/informacion-historica.html` — mismo error.

## cobertura_del_periodo

El análisis del CED (marzo de 2022) cubre tres ventanas: 2010-2014, 2015-2019 y 2020-2021.
Verificación lograda por fuente, en esta pasada:
- Planilla oficial de URSEA (PE vs. PPI consumidor final): completa y sin huecos para 2010-2019
  (60/60 y 53/60 meses). No hay serie oficial en la misma base para 2019-06 en adelante.
- Volúmenes oficiales del MIEM/DNE: completos y sin huecos para 2010-2019 (verificados mes a mes).
- 2020-2021: sin serie oficial de precio de venta al público y PPI consumidor final en la misma base
  (ver `## para_el_editor`); sí hay, para 2021, dos cifras oficiales de ANCAP (pérdida de mercado
  monopólico y renuncia frente a PPI) que dan el orden de magnitud pero no la misma definición que
  usa el CED.
- No se buscó si el CED publicó boletines posteriores con estimaciones para 2022 en adelante (no lo
  pide el brief, que se centra en este boletín de 2022 ya citado en la ficha de ANCAP).

## objeciones_al_brief

Ninguna nueva. La observación de la corrida anterior sigue vigente: el brief pide verificar un
análisis con el mismo rigor sin prejuzgar a quién favorece, y el propio análisis del CED es
desfavorable para los tres gobiernos que compara en algún momento. Con las cuatro afirmaciones que
agregó la corrección de simetría (renuncia 2021, resultado primario 2021, LUC, competitividad), el
registro ya cubre con el mismo detalle los tramos de gobierno del Frente Amplio y de la coalición.

Un punto menor, no una objeción de Regla 0: la instrucción de esta segunda pasada asumía que, sumando
el dataset `ursea-ppi_vs_pe_v2` de catalogodatos (desde 2020-10), "el hueco real" quedaba acotado a
2019-06–2020-09. La verificación de esta sesión (ver `## metodo`, punto 5) muestra que el recurso de
catalogodatos que cubre desde 2020-10 no es la misma serie (es "PPI hasta la planta de distribución",
no "PPI al consumidor final"), así que el hueco real en la base comparable a la planilla de URSEA es
más grande de lo que asumía la instrucción: no hay serie oficial de PE vs. PPI consumidor final desde
2019-06 hasta que aparezca, si aparece, un documento que la publique. No es un desacuerdo sobre qué
investigar, es una corrección de un supuesto fáctico sobre el contenido de un dataset, y queda
documentada acá y en el propio registro para que no se repita la asunción.

## para_el_editor

Lo que sigue es criterio (calificación, `veredicto`, tier), no investigación; no lo resolví, lo dejo
con la fuente ya leída para que el editor decida.

**Sobre el chequeo publicado
`content/chequeos/lacalle-pou/2022-03-27-sobrecostos-combustibles-1700-millones.yaml`** (no toco
`content/`; son tres correcciones separadas, ya señaladas por el crítico y confirmadas en esta
sesión):
1. `cotejo_con_primaria`: agregar la URL del boletín en el sitio del propio CED
   (`https://ced.uy/public/archivos/boletines/doc_13.pdf`) junto a la copia de terceros que ya usa, y
   dejar constancia de que la discrepancia 1137/1.337 se verificó también en la copia del autor.
2. `presentacion`: `revision.notas_internas` de ese chequeo dice que no se confirmó el orden
   "nafta, gasoil" de los USD 14M/67M de 2020-2021. Queda confirmado: el cuerpo del boletín del CED
   dice, de forma contigua, "se registraron sobreprecios en la nafta por USD 14 millones y el gas oil
   por USD 67 millones". Nafta = 14M, gasoil = 67M, en ese orden.
3. Si se aprovecha para llevar 2020-2021 al gráfico de ese chequeo, hay que llevar también la renuncia
   de 2021 (105M nafta+gasoil, o 200M con supergás) y, si se quiere, las dos cifras de ANCAP
   (pérdida de mercado monopólico -32M, renuncia -159M) que agregó esta pasada. Poner barras de 443 y
   1.337 al lado de 14 y 67 sin ese contexto adicional exagera visualmente la caída del sobreprecio en
   2020-2021.

**Sobre la calificación de cada afirmación** (ninguna tiene documento oficial que mida exactamente lo
que afirma; todas quedan `discutible` por default, salvo que el editor encuentre lo que esta corrida
no encontró):
- Afirmaciones 0-3 (los cuatro montos del CED en dólares): `discutible`. El documento oficial (URSEA +
  MIEM) confirma la dirección y el orden de magnitud relativo de la brecha, no el monto en dólares
  (falta la metodología exacta del CED para combinar precio, volumen y tipo de cambio).
- Afirmación 4 (40,5M anuales, atribuida a El Observador): `discutible`. La aritmética (14+67)/2=40,5
  se verifica contra el texto del CED, pero el CED es fuente `nota`, no `documento_oficial`.
- Afirmación 5 (2.883M década): `discutible`, mismo motivo.
- Afirmación 6 (renuncia 2021, ~200M/105M): `discutible`. Ahora hay, además del boletín del CED, una
  cifra comparable pero no idéntica del propio comunicado de ANCAP (USD 159M para todos los
  productos); no alcanza para `verdadero` ni para `impreciso` porque no está claro que midan lo mismo
  con la misma metodología, y el editor tendría que decidir si esa comparación amerita mencionarse en
  el `analisis` de la afirmación.
- Afirmación 7 (resultado primario corriente -44M): `discutible`, mismo caso: la pérdida de -32M del
  "mercado monopólico" de ANCAP es del mismo signo y orden de magnitud, no la misma definición
  confirmada.
- Afirmaciones 8 y 9 (conclusión sobre la LUC, competitividad): `discutible` — son conclusiones
  interpretativas del propio CED, no datos medibles con fuente oficial.
- Aviso para cuando aparezcan los volúmenes con metodología exacta: reconstruir el monto en dólares
  nosotros mismos no convierte automáticamente un `discutible` en `verdadero`, sería una `inferencia`
  con supuestos que el CED no publica. Sería `impreciso` si la reconstrucción cae dentro del 10 % de
  la cifra del CED, y `discutible` si los supuestos mueven el resultado más que eso.

**Sobre la ficha `content/empresas/ancap.yaml`** (aparte de esta corrida, para quien la retome):
`precios_vs_paridad.series` está vacía. Con la planilla de URSEA (2002-01 a 2019-05, mensual, sin
huecos, ya verificada dos veces) la ficha puede tener su gráfico de precio contra paridad para
2010-2019; para 2020-2021 no hay, por ahora, una serie oficial comparable (ver `## metodo`, punto 5).
