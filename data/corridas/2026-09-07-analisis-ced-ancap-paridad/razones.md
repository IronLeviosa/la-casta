# Razones — corrida 2026-09-07-analisis-ced-ancap-paridad

Editor: Sonnet 5 (`claude-sonnet-5`), por decisión del mantenedor (2026-09-07): ningún subagente
corre en Fable sin su permiso, y Opus queda para el crítico. El lote llegó a este paso con el crudo
del investigador ya corregido por un editor anterior según `critica.md` (5 objeciones `bloquea`, 5
`corregir`, 1 `aviso`) en una primera pasada, y por una segunda pasada de verificación independiente
documentada en `notas.md`; ese editor anterior fue interrumpido antes de escribir `veredicto`,
`revision` y el `analisis` de cada afirmación, y antes de escribir este archivo. Lo que sigue cubre el
diff completo entre el crudo del investigador y el registro final: los cambios de contenido ya hechos
al llegar a este paso (con su referencia a `critica.md`, para que el diff se entienda sin releer
`notas.md`), y los cambios de esta pasada final.

## Cambios de contenido (resueltos antes de esta pasada, verificados acá contra `critica.md`)

- **`resumen`**: se sacó la cláusula "ya con el mecanismo de la LUC vigente, los sobreprecios fueron
  menores", que afirmaba lo contrario de lo que el CED concluye sobre la LUC en el mismo boletín; se
  agregó la conclusión transversal del CED ("Desde el 2010 en adelante... no reflejaron (en ningún
  sentido) los costos asumidos por ANCAP") y la conclusión específica sobre la LUC, citadas. Motivo:
  `critica.md`, objeción "analisis[0] — cabecera: resumen" (bloquea, contexto_omitido/asimetria).
- **`publicado`**: se cambió la URL de la copia de todoelcampo.com.uy a la del propio CED
  (`ced.uy/public/archivos/boletines/doc_13.pdf`), con cita de la primera oración del boletín;
  `fecha` quedó en 2022-03-03 (fecha del boletín, no de la cobertura de El Observador del 2022-03-07).
  Motivo: `critica.md`, objeción "cabecera: publicado" (corregir, presentacion).
- **`autor_es`**: se reescribió con fecha de cada vínculo institucional del CED, distinguiendo los
  anteriores del boletín (Programa Alta Dirección, cena 2021) de los posteriores (cena 2023,
  candidatos 2024, Galperin 2025); se agregó el nombre del director (Agustín Iturralde) y se aplicó el
  mismo criterio a toda la página citada, incluida la frase "políticos de todos nuestros partidos" que
  antes no se citaba. Se dejó constancia explícita de que no se encontró una lista pública de
  financiamiento, en vez de omitirla sin explicación. Motivo: `critica.md`, objeción "cabecera:
  autor_es" (corregir, asimetria) y Regla 0.
- **`metodo` de cabecera**: se sacó la referencia a `notas.md` (archivo privado que el lector nunca
  ve) y quedó solo la cita del método tal como lo describe el CED. Motivo: `critica.md`, objeción
  "cabecera: metodo" (corregir, presentacion).
- **afirmaciones 0 y 1 (nafta y gasoil, 2010-2014)**: se recalculó la cobertura real de la planilla de
  URSEA — 209 filas sin huecos de 2002-01 a 2019-05, 60/60 meses en 2010-2014, no 29/60 como contaba
  una lectura que descartaba por error las filas con fecha escrita como texto ("2013-Ene",
  "2014-Ago (4)"). Las brechas pasan de −5,5 % a −2,0 % (nafta) y de +15,8 % a +19,2 % (gasoil). Se
  cerró bien el `_faltante`: ya no dice que faltan filas, dice que no hay documento oficial que agregue
  la brecha en dólares, y se sumó la serie de volúmenes del MIEM/DNE ("Venta de derivados de petróleo
  al mercado interno y zona franca") como el documento previsible que señalaba el crítico, verificada
  columna por columna. Motivo: `critica.md`, "Hallazgo que gobierna casi toda la crítica" y objeciones
  afirmaciones[0]/[1] (bloquea, documento_previsible).
- **afirmaciones 2 y 3 (nafta y gasoil, 2015-2019)**: recalculadas con los 53/60 meses reales del
  quinquenio: nafta +8,6 % (no +8,4 %), gasoil +33,0 % (no +26,5 %). En la de nafta se unificó el
  `fragmento` contra la cita del CED (antes citaba la frase de El Observador). En la de gasoil se
  agregó el argumento de consistencia interna: la suma de El Observador (2.883) solo cierra con 1.337,
  no con 1.137, y la doble cifra se verificó en la copia del propio CED, no solo en la de terceros.
  Motivo: `critica.md`, objeciones afirmaciones[2]/[3] (corregir, documento_previsible).
- **afirmación 4 (promedio de El Observador, 2020-2021)**: se reescribió `afirmacion` para atribuir el
  promedio de USD 40,5 millones a El Observador, no al CED (el CED no escribe esa cifra); se agregó al
  `dato_real` la aclaración del propio CED de que 2020 y 2021 tienen signos opuestos, que el contraste
  de El Observador no recogía. Motivo: `critica.md`, objeción afirmaciones[4] (bloquea, riesgo_legal
  por atribución + asimetria).
- **afirmaciones nuevas 6 y 7 (renuncia de 2021 y resultado primario corriente negativo)**: se
  agregaron para cerrar la asimetría que señaló el crítico (cuatro cifras cuantificadas sobre 2010-2019
  y ninguna cifra propia sobre 2021 más allá del promedio de El Observador). Se sumó, en las dos, la
  cifra comparable pero no idéntica del comunicado de resultados de ANCAP de abril de 2022 (pérdida de
  USD 32M en "mercado monopólico", renuncia de USD 159M "para todos los productos"). Motivo:
  `critica.md`, objeción afirmaciones[4] punto (c) y "Objeciones al lote — Simetría del recorte de
  cifras".
- **afirmaciones nuevas 8 y 9 (conclusión sobre la LUC y afirmación de competitividad)**: se agregaron
  por el mismo motivo de simetría; son conclusiones interpretativas del CED, sin dato oficial que las
  mida, y quedan `discutible` por eso, no por falta de investigación. Motivo: `critica.md`,
  "Objeciones al lote — Simetría del recorte de cifras".
- **`graficos[0]` (niveles, 2010-2019)**: se corrigieron los diez puntos anuales con los promedios
  reales de 12 meses (antes, 5 a 8 meses para 2012 y 2015-2018), se agregaron 2013 y 2014 (antes
  ausentes del gráfico), y se corrigió la única `nota` de punto que sobrevive (2019: 5 de 12 meses, no
  4 de 12). Motivo: `critica.md`, objeción graficos[0] (bloquea, presentacion).
- **`graficos[1]` (brecha, nuevo)**: se agregó el segundo gráfico (PE/PPI − 1, por producto y año) que
  pedía el crítico porque el gráfico de niveles no deja ver la brecha —que es el dato que discute el
  análisis— a simple vista. Motivo: `critica.md`, "accion_sugerida" de graficos[0].
- **Explicaciones alternativas del propio CED**: se agregaron como fuentes de cabecera, con cita
  literal: la lectura mecánica del resultado de ANCAP 2016-2017 (precios fijos mientras bajaba el
  petróleo), la contralectura de recomposición de pérdidas 2011-2015 (capitalización estatal de 2016),
  la contralectura simétrica del bienio 2020-2021 (balance ANCAP −USD 56M) y el contexto de la
  polémica con el informe de Vallcorba y Zelko. Las dos primeras se retomaron en el `analisis` de la
  afirmación 3 y en el `veredicto` (ver más abajo), porque el crítico las señaló específicamente sobre
  la cifra más grande del análisis. Motivo: `critica.md`, "Explicaciones alternativas" 1-4.

## Cambios de esta pasada (los que hice yo en esta sesión)

- **`analisis` de las 10 afirmaciones**: no existía en el archivo que recibí (el editor anterior fue
  interrumpido antes de escribirlo). Cada uno resuelve en la primera oración qué confirma el documento
  oficial y qué no, y en las afirmaciones 1 y 3 recoge, en dos oraciones, las lecturas menos lineales
  que el propio CED da sobre esas cifras (explicación mecánica de 2016-2017, recomposición de pérdidas
  2011-2015) para que un lector que solo lee esa afirmación —no el `veredicto` completo— las vea.
  Motivo: encargo de esta corrida, editor.md sección "Qué escribís".
- **`veredicto`**: no existía. Cuenta que las diez afirmaciones quedaron `discutible`, separa las seis
  cifras en dólares (documento oficial confirma dirección, no monto) de las dos comparaciones de El
  Observador (aritmética correcta, fuente no oficial) y de las dos conclusiones interpretativas; dice,
  como dato y no como juicio, que de las seis cifras en dólares cuatro son de los quinquenios del
  Frente Amplio y dos del bienio de la coalición, y qué explicaciones alternativas del propio CED
  pesan sobre la cifra más grande. Motivo: encargo de esta corrida.
- **`revision: {tier: publicado, notas_internas}`**: no existía. Tier `publicado`, fundamentado en el
  propio campo `notas_internas` del registro: las diez afirmaciones en `discutible` son la calificación
  correcta cuando hay documento oficial que confirma dirección y orden de magnitud pero no el monto
  exacto con la definición del autor —el mismo umbral que ya tiene, publicado, el chequeo sobre este
  mismo boletín (`content/chequeos/lacalle-pou/2022-03-27-sobrecostos-combustibles-1700-millones.yaml`,
  también `discutible` + `publicado`)—, ninguna fuente citada lleva `verificacion: manual`, y no quedó
  ninguna objeción `bloquea` de `critica.md` sin resolver. Lo que falta (reconstrucción del monto en
  dólares con volúmenes; serie de precios 2019-06 a 2021) se deja para un resolvedor, no bloquea la
  publicación de lo que sí está confirmado.
- **`graficos[0].metodo`**: seguía citando la URL cruda de la planilla de URSEA en medio de la prosa y
  una frase sobre "una lectura anterior de esta planilla" que describe nuestro propio proceso editorial,
  no algo que le sirva al lector. Se reescribió sin la URL (que ya está en `series[].fuente`) y sin la
  referencia al proceso interno. Motivo: `critica.md`, objeción graficos[0], frase "el metodo del
  gráfico mete la URL cruda de la planilla en medio de la prosa", que había quedado sin resolver en la
  corrección anterior.
- **`nota` de los dos gráficos y `metodo` de `graficos[0]`**: se agregó, en los tres campos, la razón
  concreta de por qué el tramo 2020-2021 no está graficado (el dataset de catalogodatos que debía
  cubrirlo, `ursea-ppi_vs_pe_v2`, resultó ser otro concepto de precio —"ex planta de distribución", no
  "PPI al consumidor final"—, verificado leyendo el recurso real, no solo su descripción). Antes solo
  el `metodo` de `graficos[1]` lo decía; un lector que no expande "Cómo se calculó" no lo veía. Motivo:
  `critica.md`, "Objeciones al lote — Simetría del gráfico" ("el titulo y la nota del gráfico tienen
  que decir con todas las letras que el tramo 2020-2021 no está graficado y por qué").

## Cambios de forma

- Se acortaron las `nota` de los dos gráficos (382 y 384 caracteres) para cumplir el límite de 280
  caracteres del esquema, detectado por `pnpm validar --inbox --red`; el detalle que no entró
  (justificación completa de por qué falta 2020-2021, matices de la convención de signo) se movió al
  `metodo` de cada gráfico, que no tiene ese límite.

## Propuestas para `content/chequeos/lacalle-pou/2022-03-27-sobrecostos-combustibles-1700-millones.yaml`

No se tocó `content/` desde esta corrida (no es parte de este brief). Quedan redactadas para que se
tramiten con `pnpm promover --correccion`, señaladas por `critica.md` y confirmadas en `notas.md`:

1. **tipo**: cotejo_con_primaria — **registro**: el chequeo arriba — **campo**: `dato_real.fuentes` —
   **de**: solo la copia de todoelcampo.com.uy del boletín del CED — **a**: agregar
   `https://ced.uy/public/archivos/boletines/doc_13.pdf` junto a la copia de todoelcampo, y una línea
   en `dato_real.valor` o `notas_internas` dejando constancia de que la discrepancia 1137/1.337 se
   verificó también en la copia del propio CED, no solo en la republicada — **motivo**: `critica.md`,
   "Sobre el chequeo publicado", punto 1; verificado en esta corrida.
2. **tipo**: presentacion — **registro**: el mismo — **campo**: `revision.notas_internas` — **de**:
   "sin que esta corrida haya verificado a qué combustible corresponde cada cifra (no se confirmó el
   orden 'nafta, gasoil' contra el original)" — **a**: reemplazar por la confirmación: nafta = USD 14
   millones, gasoil = USD 67 millones, según la cita contigua del cuerpo del boletín del CED ("se
   registraron sobreprecios en la nafta por USD 14 millones y el gas oil por USD 67 millones") —
   **motivo**: `critica.md` y `notas.md`, punto 2; confirmado en esta corrida contra la copia del
   propio CED.
3. **tipo**: presentacion (advertencia, condicional) — **registro**: el mismo — **campo**:
   `grafico.series` — **de**: barras de 443 y 1.337 (2015-2019), sin el bienio 2020-2021 — **a**: si en
   el futuro se extiende ese gráfico a 2020-2021, agregar también la renuncia de 2021 (USD 105 millones
   solo nafta y gasoil, o 200 millones con supergás) y no solo los USD 14M/67M de sobreprecio, porque
   poner 443/1.337 al lado de 14/67 sin ese tercer dato exagera visualmente la caída del sobreprecio en
   2020-2021 — **motivo**: `critica.md` y `notas.md`, punto 3. No aplicar la corrección 3 si no se
   aplican también las cifras de renuncia.

## Otras notas para quien retome

- `content/empresas/ancap.yaml`: `precios_vs_paridad.series` está vacía. Con la planilla de URSEA ya
  verificada dos veces en esta corrida (2002-01 a 2019-05, sin huecos), la ficha puede tener su gráfico
  de precio contra paridad para 2010-2019; para 2020-2021 no hay, por ahora, una serie oficial
  comparable. Aparte de esta corrida.
- Un resolvedor podría intentar reconstruir el monto en dólares de las afirmaciones 0 a 3 con los
  volúmenes del MIEM ya citados. En el mejor caso eso movería la calificación a `impreciso` (si la
  reconstrucción cae dentro del 10 % de la cifra del CED) o la dejaría en `discutible` (si los
  supuestos de tipo de cambio y ponderación mueven el resultado más que eso); nunca directo a
  `verdadero`, porque sería una inferencia nuestra, no un documento oficial que mida lo mismo que dice
  el CED.

## Mensaje de commit propuesto

```
[corrida 2026-09-07-analisis-ced-ancap-paridad] Verificar afirmación por afirmación el análisis
del CED sobre sobreprecio de combustibles vs. paridad de importación (2010-2021)
```
