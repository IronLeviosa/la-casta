# Notas — ANTEL (corrida 2026-09-07-empresas-antel, segunda vuelta 2026-09-08)

Esta segunda vuelta resuelve la crítica de `data/corridas/2026-09-07-empresas-antel/critica.md`
(36 objeciones). Ver `## para_el_editor` para el resumen de qué se resolvió y qué queda pendiente,
objeción por objeción.

## candidatos_giro
No aplica: esta corrida no investiga declaraciones de un político, sino la ficha de una
empresa pública.

## hipotesis
- No se encontró el decreto original (2012-2013) por el que Mujica habría fijado por vía
  reglamentaria el monopolio de fibra óptica antes de que existiera la Ley 19.307 (2014).
  El Observador (2012) solo registra el anuncio de que se "enviará un proyecto de ley"; no
  se confirmó si ese proyecto es exactamente el que se convirtió en el artículo 56 de la
  Ley 19.307 dos años después.
- El decreto/resolución de 2024 que habilitó a ANTEL a revender capacidad mayorista de su
  fibra a cableoperadores no se pudo ubicar en su forma original (número de resolución del
  directorio); solo consta por la nota de ámbito.com de 2025 que la describe al informar su
  revocación.
- La Cámara de Telecomunicaciones del Uruguay (telecomunicaciones.org.uy) sigue sin poder
  leerse con `pnpm fuente` (Cloudflare). No se insistió en esta segunda vuelta.
- La sentencia de la Suprema Corte de Justicia de 2016 que declaró inconstitucional el
  artículo 56 no se pudo leer: la Base de Jurisprudencia Nacional (`bjn.poderjudicial.gub.uy`)
  exige navegador y `pnpm fuente` no la lee. Se citó en su lugar la cobertura de prensa
  (El Observador y Caras y Caretas, esta última con el dato del primer fallo en sentido
  contrario).
- La versión taquigráfica del debate parlamentario del artículo 240 de la Ley 20.075
  (Rendición de Cuentas 2021, octubre de 2022) no se pudo ubicar con las búsquedas hechas en
  esta sesión (ver `## para_el_editor`, objeción 23). Queda como pendiente de una próxima
  corrida: sería la fuente primaria más simétrica del debate del monopolio.
- El estudio de "benchmarking" de Omar de León (2012) no está identificado más allá de lo
  que dice la nota de El Observador; no se pudo cotejar el 58% de sobreprecio regional
  contra una fuente oficial (URSEC, UIT, OCDE) en el tiempo de esta corrida. Ver
  `analisis.yaml`.
- El balance de ANTEL de 2011 es un PDF escaneado sin capa de texto; esta máquina no tiene
  instalado el OCR que exige `pnpm fuente` (falta `pdftoppm`/poppler). Se usó en su lugar el
  balance de 2012 (con columna comparativa 2011), que sí tiene capa de texto y permitió
  verificar la cifra de ingresos de "Telefonía" (fija + pública + telegrafía) que cita de
  León, con una diferencia de 0,05%.

## casos_vistos
- Antel Arena: la Fiscalía archivó definitivamente el caso en junio de 2025, según
  ámbito.com ("La Fiscalía archivó definitivamente el caso del Antel Arena"; "Caso Antel
  Arena: 'Fue una operación política para aleccionar', señaló Carolina Cosse tras el
  archivo definitivo"). No investigado más allá de esta mención, tal como indica el brief.

## verificacion_manual
- https://www.telecomunicaciones.org.uy/index.php/la-inconveniencia-del-monopolio/ y las
  URLs relacionadas de la Cámara de Telecomunicaciones del Uruguay: `pnpm fuente` devuelve
  la página de verificación de Cloudflare tanto en vivo como desde Wayback Machine.
- https://www.antel.com.uy/documents/37544/378823/estados-financieros-consolidados-e-individuales-2011.pdf/c9fcf15a-1411-15ce-7e71-6720568c7749?t=1755713600521
  (balance ANTEL 2011): PDF escaneado, 0 caracteres extraídos; `pnpm fuente` avisa que
  necesita OCR (`pdftoppm`/poppler no instalados en esta máquina).
- https://www.pitcnt.uy/novedades/noticias/item/4863-sutel-para-24-horas-se-rompe-el-monopolio-de-antel:
  HTTP 404 (URL de un resultado de búsqueda, ya no existe).
- No se pudo ubicar ni abrir la nota original de El Observador de mayo de 2020 sobre la
  posición de Claro y Movistar respecto a la fibra óptica (la que En Perspectiva resume y
  atribuye expresamente a "El Observador"). Búsquedas con `WebSearch` y con
  `pnpm descubrir elobservador.com.uy --desde 2020-05 --hasta 2020-05` no dieron con ella
  (el sitemap de El Observador no cubre notas tan antiguas con ese filtro de fecha). El
  argumento de Movistar y Claro queda sostenido, honestamente, solo por la versión de En
  Perspectiva (que a su vez cita a El Observador).
- La versión taquigráfica del debate del artículo 240 de la Ley 20.075 en el Parlamento no
  se pudo ubicar: la página de diarios de sesiones de `parlamento.gub.uy` no tiene un filtro
  directo a octubre de 2022 accesible por `WebFetch`, y las búsquedas web tampoco dieron con
  el documento puntual.

## cobertura_del_periodo
- Balances individuales auditados cubiertos: 2015 a 2024, los diez años pedidos por el
  brief, con resultado del ejercicio, deuda financiera, transferencias a Rentas Generales
  (ahora todas del renglón del estado de flujos de efectivo), impuestos pagados
  (calculados, bloque individual en los diez años) y segmentos de negocio (bloque
  individual en los diez años) para cada año.
- Marco legal: cubre desde la creación (1974) hasta junio de 2025 (revocación de la
  resolución de 2024 sobre fibra mayorista), con los hitos intermedios de 1991, 1992
  (referéndum), 2001, 2002, 2006, 2014, 2016 (fallo SCJ, con el dato del primer fallo en
  sentido contrario) y 2022 (licencias Clase B y Ley 20.075, ahora como hitos separados).
- Argumentos a favor y en contra: cubren 2012 (Mujica, De León), 2020 (Claro, Movistar),
  2022 (Larrosa, Grille/Caras y Caretas, Olaso). Se sumaron dos argumentos nuevos (Grille a
  favor, Olaso en contra) leyendo notas ya presentes en el corpus del lote, sin búsquedas
  adicionales. Se sacó a Gurméndez (2023) de `argumentos_a_favor`: no defendía el monopolio,
  defendía el resultado de una inversión (5G), y presidía ANTEL bajo el gobierno que había
  abierto el mercado tres meses antes. No se encontró un argumento a favor o en contra
  situado en 2024-2026.
- No se investigaron declaraciones de políticos sobre ANTEL fuera de las que aparecieron
  directamente ligadas a los argumentos del monopolio (Mujica, Lacalle Pou, Larrosa); esta
  corrida es de la empresa, no de los políticos.

## anios_sin_segmentos
Ninguno: los diez años (2015-2024) traen desagregación de ingresos por división de
servicio. En ningún año ANTEL desagrega el *resultado* (costos y ganancia) por segmento,
solo el *ingreso operativo*; el propio documento lo explica ("Se presenta en forma agrupada
la totalidad de las utilidades de los servicios de telecomunicaciones dado que están
soportados por una única red compartida, asociada a la generación conjunta de ingresos.").
Esa frase ahora está citada como fuente en el segmento "Telefonía fija" del año 2024, y el
`concepto` de los 57 segmentos (no solo 10) lo dice. El campo del esquema se llama
`resultado` pero en esta ficha, como en la anterior, contiene un ingreso: el editor debería
considerar si el rótulo que muestra la página puede decir "ingreso por segmento" en vez de
"resultado por segmento" para ANTEL (a diferencia de ANCAP, que sí tiene resultado por
segmento).

## medios_faltantes
- El Observador, El País, La Diaria, Montevideo Portal, Ámbito, Caras y Caretas, En
  Perspectiva, Subrayado, Teledoce e IMPO ya tienen medio en `content/medios/`.
- **Falta `content/medios/antel.yaml`**: todas las fuentes `documento_oficial` de los
  balances usan `medio: antel`, que no existe todavía como slug en `content/medios/`.
  `tipo: estatal`, `grupo: estado-uruguayo`, `url: https://www.antel.com.uy/`,
  `empresa: antel`, `alineamiento.etiqueta: estatal`.
- No se usó ningún dato de URSEC en esta segunda vuelta (no se pudo verificar el 58% de
  sobreprecio de de León contra una fuente regulatoria oficial en el tiempo disponible), así
  que **no hace falta** crear `content/medios/ursec.yaml` por ahora; si una próxima corrida
  incorpora datos de URSEC, ahí sí haría falta (distinto de `ursea`, que es el regulador de
  energía y agua).
- `content/medios/pitcnt.uy` (o similar) no se creó: el intento de citar una nota de
  PIT-CNT/SUTEL sobre el monopolio no llegó a buen puerto (una URL devolvió 404, otra no
  trajo texto de artículo utilizable). Si el editor quiere insistir con esa fuente, el medio
  faltaría crear.

## objeciones_al_brief
Ninguna: el brief pide el mismo esquema para ANTEL que para ANCAP, con argumentos de los
dos lados del monopolio con el mismo esfuerzo, y así se hizo. La crítica de la primera
vuelta señaló dos frases del brief con encuadre asimétrico ("verificá qué tiene reservado
hoy... y, según la ley de medios y decretos, el tendido de fibra al hogar" da la respuesta
antes de leer las normas; "el Antel Arena y otras inversiones cuestionadas" encuadra en el
sustantivo). Esta segunda vuelta no repite ese encuadre: `monopolio.alcance` describe lo que
las normas dicen hoy (incluida la fibra ya no reservada desde octubre de 2022) sin partir de
la premisa del brief, y no se agregó nada sobre el Antel Arena más allá de la mención ya
existente en `que_hace` (el fideicomiso FAFOAA, con fuente del balance).

## resumen_vs_primaria
No aplica: no hubo declaraciones de políticos con fuente primaria de audio/video en esta
corrida (es una ficha de empresa, no declaraciones).

## anios_sin_balance
Ninguno para 2015-2024: se leyeron los diez balances individuales/consolidados auditados,
todos publicados en `antel.com.uy/institucional/nuestra-empresa/estados-financieros`. Esa
página (releída en esta sesión) ya lista también el balance 2025 (subido recientemente); no
se usó porque el brief pide 2015-2024, pero queda anotado para una futura corrida que
extienda la serie.

## para_el_editor

Resolución de las 36 objeciones de `critica.md`, en el mismo orden:

1. **`que_hace_fuentes[0]`** (bloquea) — resuelto. Cita reemplazada por el tramo literal y
   contiguo del balance 2024 ("ANTEL es la controlante directa o indirectamente..."), leído
   con `pnpm fuente --desde`. El texto de `que_hace` no cambió en esta parte.
2. **16 citas con «…»** (bloquea) — resuelto para las 16 identificadas: `que_hace_fuentes[0]`
   (ver 1), las 10 de `deuda_financiera` (releídas de cada balance, contiguas, algunas
   compartiendo cita entre dos años cuando el balance trae ambos en columnas comparativas),
   `monopolio.argumentos_en_contra[0]` (de León), `monopolio.argumentos_a_favor[1]`
   (Larrosa, ahora en dos `fuentes` con la misma URL, cada una contigua), `normas[4].fuentes[1]`
   (Montevideo Portal), y `monopolio.argumentos_en_contra[2]` (Movistar, ahora una sola cita
   larga pero genuinamente contigua). `comparaciones[0]` (de León) se sacó de `comparaciones`
   y pasó a `analisis.yaml` con sus propios fragmentos contiguos (ver objeción 25).
   Además se corrigieron, sin que fueran parte de los 16 "bloquea", las 8-9 citas de tipo de
   cambio a las que les faltaba el paréntesis de cierre (restituido en todos los años,
   verificado directamente en 2015/16, 2019, 2022 y 2023, e inferido por el mismo patrón en
   2017, 2018, 2020 y 2021, que no se releyeron individualmente por economía), la cita del
   resultado 2022 (ya no tiene el corchete "ej[ercicio]"; ahora es "Impuesto a la renta
   (2.217.232) (3.158.478) / Resultado del ejercicio 10.162.070 10.765.724", tomada del
   Estado de Resultados Individual), la de impuestos 2021 (el "$ miles" ahora está en su
   posición real, antes de "Contribuyente"), y la de transferencias 2017 (ya no se cita la
   nota narrativa con "Nota 16.7/17.7": se reemplazó la fuente entera por el renglón del
   estado de flujos de efectivo, igual que en los otros nueve años).
3. **Consolidado vs. individual** (bloquea) — resuelto. `impuestos_pagados` y `segmentos`
   de 2022, 2023 y 2024 ahora salen del bloque individual de cada balance (2024:
   10.087,1 M individual, no 10.498,1 M consolidado), releído directamente. Se verificó
   aritméticamente cada suma de impuestos contra los ítems citados (2022: 9.021,9 M; 2023:
   10.152,6 M; 2024: 10.087,1 M).
4. **Transferencias 2022** (bloquea) — resuelto. Los diez años usan ahora el mismo criterio:
   el renglón "Contribución a Rentas Generales" del estado de flujos de efectivo. 2022 pasó
   de 4.860,0 M (USD 121,3 M) a 5.914,1 M (USD 147,6 M). La `nota` del año 2022 dice lo que
   se verifica (dos cifras distintas en el mismo balance) sin aventurar la causa.
5. **Transferencias 2024, citada distinto** (corregir) — resuelto: al unificar el criterio
   en los diez años (renglón del flujo de efectivo), 2024 queda igual que los demás.
6. **El pago diferido, en diez notas casi iguales** (corregir) — parcialmente resuelto: el
   `concepto` es ahora una frase uniforme en los diez años ("Contribución a Rentas
   Generales del ejercicio, según el renglón..."). Se agregó, en la `nota` de 2015, la cita
   del artículo 643 de la Ley 16.170 y los decretos 161/91 y 436/002 como fundamento del
   mecanismo (releídos en IMPO). No se reescribió un párrafo único en `resumen` (ese campo
   lo escribe el editor).
7. **Impuestos 2022, cita incompleta** (corregir) — resuelto: al rehacer 2022 con el bloque
   individual, la cita ahora trae los 9 ítems completos y la suma cierra (9.021,9 M).
8. **`concepto` de impuestos repetido en dos oraciones** (corregir) — resuelto: una frase
   uniforme en los diez años; se sacó la explicación de método extendida (queda resumida en
   la misma frase corta).
9. **Segmentos: ingreso, no resultado** (bloquea) — resuelto en la medida en que el esquema
   lo permite: `concepto` ahora dice "Ingreso operativo del segmento..." en los 57, no en
   10; se citó la frase del balance ("Se presenta en forma agrupada...") como fuente
   adicional en el primer segmento de 2024. El campo del esquema sigue llamándose
   `resultado` (no se puede renombrar desde el investigador); queda para el editor decidir
   si el rótulo de la página puede decir "ingreso por segmento" para esta ficha.
10. **Reexpresiones entre balances** (aviso) — no resuelto por el investigador: es una nota
    de presentación para el pie del gráfico, que corresponde al editor.
11. **`finanzas[4].nota` (2019), afirma un corte que no existe** (corregir) — resuelto: la
    `nota` de 2019 ahora reproduce la cita completa (releída, no está cortada) y explica la
    aritmética sin "probablemente".
12. **`finanzas[6]` (2021), contradicción interna** (aviso) — resuelto: se agregó una `nota`
    de una línea.
13. **`finanzas[0]` (2015), de dónde salió** (aviso) — resuelto parcialmente: se corrigió la
    `nota` para no decir "no se leyó en el mismo detalle" (frase que no aportaba y podía
    leerse como contradictoria con este mismo archivo); no se cambió la fuente de 2015 (se
    mantiene la columna comparativa del balance 2016, ya validada por la crítica como
    numéricamente correcta).
14. **`capitalizaciones_del_estado` vacío, sin decir que se buscó** (aviso) — no resuelto en
    el YAML (el investigador no escribe `resumen`); queda anotado acá para que el editor
    agregue una línea: en 2015-2024 no consta capitalización del Estado en los estados
    contables (búsquedas de "aporte de capital", "capitalización" sin resultado en los diez
    balances).
15. **`monopolio.alcance`** (bloquea) — resuelto. Reescrito en cuatro párrafos cortos, con
    los cuatro textos legales originales leídos en IMPO (art. 56 original con su segundo
    inciso, art. 56 vigente desde la Ley 20.075, art. 613 de la Ley 17.296, art. 115 de la
    Ley 18.046), sin afirmar "situación de hecho" como conclusión propia: se describe la
    secuencia de normas y se deja ver el vacío legal entre 2002 y 2006.
16. **"Ese mismo mes" es falso** (corregir) — resuelto: las licencias Clase B (14 de junio)
    y la Ley 20.075 (20 de octubre) son ahora dos `normas` separadas, con las fechas
    correctas y rótulos más cortos.
17. **Un solo grupo de medios (hechos de 2022)** (corregir) — resuelto: se agregaron El
    Observador (`werthein-hochbaum`) y Caras y Caretas (`editora-caras-y-caretas`) como
    segunda fuente en `normas` (licencias Clase B) y como argumentos nuevos (Olaso en
    contra, Grille a favor).
18. **Documentos previsibles faltantes** (corregir) — parcialmente resuelto: se agregó el
    art. 115 de la Ley 18.046 y el art. 643 de la Ley 16.170 (con decretos 161/91 y
    436/002). La sentencia de la SCJ de 2016 sigue sin texto propio (BJN exige navegador);
    se dejó con cobertura de prensa, incluido el dato del primer fallo en sentido contrario
    (Caras y Caretas). La resolución del directorio de 2024 sigue sin texto original.
19. **Mujica, decisión narrada, no argumento en primera persona** (aviso) — resuelto: el
    `texto` ahora empieza aclarando "según El Observador" en `quien` y en el cuerpo del
    argumento no se agregó nada que la fuente no diga.
20. **Larrosa, frase agregada** (corregir) — resuelto: se sacó la frase sobre que "ANTEL sí
    llegó a esas localidades" (la fuente dice lo contrario: que las localidades del interior
    mencionadas son "supuestas"). El `texto` ahora resume solo lo que la nota dice.
21. **Gurméndez, no es argumento sobre el monopolio** (corregir) — resuelto: se sacó de
    `argumentos_a_favor` y se reemplazó por Alberto Grille (Caras y Caretas, 2022), que sí
    defiende explícitamente el monopolio con nombre y cita textual.
22. **Claro y Movistar, atribución** (corregir) — parcialmente resuelto: la cita de Movistar
    ahora es contigua y refleja que "sana competencia/fundamental/más beneficios" se atribuye
    a las dos empresas juntas, no solo a Movistar; el `quien` aclara que la fuente es una nota
    de El Observador resumida por En Perspectiva. No se pudo reemplazar por la nota original
    de El Observador: se buscó (`WebSearch` y `pnpm descubrir`) y no se encontró.
23. **Simetría: 2 a 3 real** (corregir) — parcialmente resuelto: quedó 3 a favor (Mujica,
    Larrosa, Grille) contra 4 en contra (de León, Claro, Movistar, Olaso). La versión
    taquigráfica del debate parlamentario (que arreglaría la simetría de una sola vez) no se
    pudo ubicar en esta sesión (ver `hipotesis`). SUTEL/PIT-CNT se buscó pero las URLs
    encontradas fallaron (404) o no trajeron texto de artículo legible a tiempo.
24. **`comparaciones[0]`, cifra invertida** (bloquea) — resuelto al mudar la comparación a
    `analisis.yaml`: la afirmación ahí ya no dice "58% por encima" sino que reproduce
    literalmente "el 58% menos que los precios actuales", tal como lo dice de León.
25. **`comparaciones[0]` → `analisis.yaml`** (corregir) — resuelto: nuevo archivo
    `analisis.yaml` con `_slug: de-leon-renta-monopolica-2012`, tres `afirmaciones` (base de
    ingresos 2011, 58% de sobreprecio, USD 181 millones de renta monopólica), cada una con
    `dato_real` y `calificacion: discutible` como marcador. La base de ingresos 2011 se pudo
    cotejar contra el balance de 2012 (diferencia de 0,05%); el 58% no se pudo cotejar contra
    una fuente oficial en el tiempo disponible (queda `_faltante: dato_oficial`). Falta que
    el editor complete `veredicto` con la calificación final.
26. **Datos favorables de la misma nota, omitidos** (corregir) — no resuelto en el YAML: el
    `resumen` de `analisis.yaml` menciona que El Observador no consiguió la versión de ANTEL,
    pero no se cargaron como afirmaciones aparte los dos datos favorables (celular e internet
    más baratos que la región) porque son caracterizaciones cualitativas sin una cifra
    puntual que verificar contra un documento oficial, no "un dato" en el sentido del
    esquema. Si el editor considera que sí corresponde, el fragmento está en el `publicado`
    de `analisis.yaml`, ya releído.
27. **Comparación Speedtest, fuente primaria** (corregir) — no resuelto: se intentó ubicar la
    publicación de Ookla (`speedtest.net/global-index`) para julio de 2023 y no se encontró
    una página con texto legible por `pnpm fuente` (es un panel interactivo). Se mantiene
    Presidencia como única fuente de esta comparación, ya señalado en `notas.md` como
    limitación.
28. **Solo dos comparaciones en once años** (corregir) — no resuelto: no se agregaron series
    de URSEC, UIT, Cable.co.uk ni `catalogodatos.gub.uy` en esta segunda vuelta (el foco
    estuvo en las citas rotas y el criterio individual/consolidado, que eran bloqueantes).
    Queda pendiente para una próxima corrida.
29. **`hitos[]` ausente** (corregir) — resuelto: 10 hitos cargados (1974, 1991, 1992, 2001,
    2002, 2006, 2014, 2016, 2022×2, 2025), todos con fuente ya leída en esta corrida. No se
    agregó un hito del Antel Arena por falta de una fecha de creación del fideicomiso FAFOAA
    verificada en esta sesión (solo se sabe que figura en la Nota 1 de los balances, sin
    fecha propia).
30. **`que_hace`, exclusividad en fibra** (corregir) — resuelto: se reescribió para decir que
    ANTEL compite en fibra/banda ancha con cableoperadores Clase B desde junio de 2022, y que
    la exclusividad que sí tiene (telefonía fija) se apoya en el art. 115 de la Ley 18.046.
31. **110 fuentes para 10 documentos** (corregir) — no resuelto por el investigador: es una
    decisión de presentación de la página (agrupar por URL), que corresponde al editor.
32. **`fuentes: []` en el nivel superior** (aviso) — resuelto: se agregaron dos fuentes
    generales (el índice de estados financieros de `antel.com.uy` y el Decreto-Ley 14.235).
33. **`tipo: servicio_descentralizado`** (aviso, sin objeción) — sin cambios: la crítica
    confirmó que es correcto.
34. **Tabuladores literales en las citas** (aviso) — resuelto: todas las citas nuevas usan
    espacios; las citas viejas que se reescribieron por otros motivos también quedaron sin
    tabuladores. No se revisó carácter por carácter el archivo completo en busca de
    tabuladores residuales fuera de los campos tocados.
35. **Medio faltante** (corregir) — sin resolver por el investigador (no crea medios); sigue
    haciendo falta `content/medios/antel.yaml`, como ya señalaba el brief que iba a pasar.
36. **Cámara de Telecomunicaciones y `verificacion: manual`** (aviso, sin objeción) — sigue
    sin haber nada que firmar: no se agregó `verificacion: manual` en esta ficha.

Objeciones al lote y objeciones al brief de la crítica: no requerían acción adicional del
investigador (son evaluaciones generales, ya reflejadas en los puntos de arriba).
