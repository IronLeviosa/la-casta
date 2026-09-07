# Notas — lacalle-pou / veracimetro / 2026-09-07

## registro_primario

**2021-07-28 (US$600 millones de ahorro).** La declaración sale de una entrevista concedida al
canal argentino LN+ (programa "Más Realidad", conducido por Jonatan Viale, con panelistas Lucas
Morando, Santiago Bulat y Roberto Debbag), no de un acto oficial uruguayo. Por tratarse de un
medio privado extranjero, no hay razón para esperar un `documento_oficial` de Presidencia con la
transcripción (Presidencia no publica transcripciones de entrevistas que el presidente da a medios
de terceros países). Búsqueda de video:
- Confirmé el programa y la fecha exacta (28/07/2021) por varias notas de prensa que la cubrieron.
- No encontré el video completo en LN+ ni en un repost íntegro accesible (la página que lo tenía
  embebido, actualidadenfoco.com, no expone el reproductor en el HTML extraído).
- Encontré un clip de 109 segundos subido por VTV Noticias (`youtube.com/watch?v=pXlsC5BsOQk`,
  20210729) cuyo título coincide casi textualmente con la frase ("...logró ahorrar 600 millones de
  dólares sin aplicar impuestos"). Bajé los subtítulos automáticos solo para ubicar el pasaje (no
  para citar, según el protocolo) y **el contenido del clip no corresponde** al pasaje de
  impuestos/ahorro: trata sobre residencia fiscal para inversores, consejos de salarios y Mercosur.
  El título del clip parece resumir un tramo distinto de la misma entrevista, no el que buscamos.
- Conclusión: no hay upgrade a `textual` para esta declaración en esta corrida. La declaración
  queda como está, en `reportado`, ya con dos grupos de medios (la-diaria, el-observador) — cumple
  la regla igual. Sumé una tercera fuente de reportado (El País) hallada vía `pnpm descubrir`,
  documentada en el chequeo y más abajo en `## cobertura_del_periodo`, pero no armé una copia en
  `declaraciones.yaml` porque no cambia el nivel de evidencia (sigue siendo prensa, no primaria).

**2023-03-02 (75% contribuyentes IRPF / US$150 millones renuncia fiscal).** A diferencia de lo que
dice el brief, esta declaración **ya está en `nivel: textual`** en el archivo publicado (fuente
`documento_oficial`: la noticia de gub.uy/presidencia sobre el evento), no en `reportado`. Igual
hice la búsqueda de primaria pedida:
- `medios.presidencia.gub.uy/tav_portal/2023/noticias/AK_502/Documento-2-marzo-anexo.pdf`: es el
  informe técnico ("Documento a tres años de gestión") que Presidencia distribuyó junto con el
  discurso. Es oficial y detallado, pero está escrito como reporte de gestión, no como transcripción
  literal: no contiene la frase de apertura ("Estamos en condiciones de proceder...") ni la cifra de
  150 millones (sí contiene el 75% y el desglose de USD 80 millones solo de IRPF).
- `medios.presidencia.gub.uy/tav_portal/2023/noticias/AK_502/info-rebaja-impuestos.pdf`: infografía
  oficial con el desglose numérico (IRPF USD80M + IASS USD30M + apoyo mipymes USD40M = 150M), sin
  indicar el total en una sola cifra.
- Diario de Sesiones de la Asamblea General del 02/03/2023: **no lo encontré accesible**. El
  buscador del sitio de Parlamento (`diarios-de-sesion`, tanto el HTML como el `csv`) solo lista
  sesiones desde 2025 sin que se pueda cambiar de legislatura vía URL/WebFetch; el HTML on-line
  para diarios de sesión "sin corregir" empieza recién en marzo de 2024 según el resumen del propio
  buscador. Encontré sí la referencia bibliográfica (Tomo 103, sesión del 02/03/2023, presidida por
  Beatriz Argimón) pero no el texto.
- Como sustituto encontré algo mejor de lo esperado: **El Observador publicó la transcripción
  completa del discurso** ("Discurso completo de Lacalle Pou ante la Asamblea General: leelo acá",
  26.114 caracteres, con marcas de "(aplausos)" propias de una versión taquigráfica). No es
  `documento_oficial` (el medio es El Observador, no un organismo del Estado), así que no habilita
  por sí sola subir de nivel, pero es la fuente más literal disponible del discurso y la usé para
  la `afirmacion` de los chequeos, según manda la precedencia de la primaria. Ver
  `## resumen_vs_primaria`.
- Para el subsecretario de Comisión de Hacienda de Diputados sí conseguí un `documento_oficial`
  con fuerza de diario de sesiones (versión taquigráfica del 15/03/2023, Carpeta 3399/2023) que cita
  literalmente la exposición de motivos del proyecto de ley con la cifra de US$150.000.000. Ese es
  el que uso como ancla del chequeo de los 150 millones.
- No armé copia en `declaraciones.yaml`: el registro actual ya es `textual`, y la fuente más literal
  que hallé (El Observador) es prensa, no un tipo que la instrucción pida como "primera fuente" de
  una copia (video/documento_oficial/diario_de_sesiones). Ver el punto siguiente, que sí me parece
  necesario que quede documentado para el editor.

**Nota aparte, importante:** el `cita` publicado de esta declaración ("Estamos en condiciones de
proceder a una baja de impuestos para quienes hacen los mayores esfuerzos") no aparece así, contiguo,
en la transcripción completa del discurso. Lo que dice la transcripción es dos oraciones separadas
por aplausos: "estamos en condiciones de proceder a una baja de impuestos (aplausos). Baja de
impuestos sobre todo a aquellas personas que hacen grandes esfuerzos por sostener económicamente...".
La `cita` publicada parece una fusión hecha por la propia oficina de prensa de Presidencia en su
noticia (que sí es la fuente citada, y ahí sí aparece exactamente como está publicado, como cita
entrecomillada de tercera persona). No toco el registro publicado — no me corresponde — pero lo dejo
señalado porque roza la regla de "cita literal y contigua" que se aplica a nuestros propios registros.
Si el editor quiere corregirlo, la vía es `content/correcciones/`.

## resumen_vs_primaria

El `resumen` de `2023-03-02-baja-impuestos-irpf-iass.yaml` dice: "...que dijo alcanzaría al 75% de
los contribuyentes de IRPF y significaría una renuncia fiscal de US$150 millones." Cotejado contra
la transcripción completa del discurso (El Observador):
- **"75% de los contribuyentes"**: SÍ está dicho literalmente ese día ("Estos cambios en la
  deducción del IRPF beneficiará al 75% de contribuyentes..."). No hay discrepancia.
- **"renuncia fiscal de US$150 millones"**: NO está en el discurso. Busqué "150 millones" y
  "renuncia fiscal" en el texto completo (26.114 caracteres, el tramo de impuestos completo, del
  saludo a la mención de mipymes) y no hay coincidencias. La cifra de 150 millones aparece
  únicamente en la comunicación escrita posterior de Presidencia (la noticia de gub.uy que ya es
  fuente del registro) y coincide con la suma de los tres componentes de la infografía oficial
  (IRPF 80M + IASS 30M + mipymes 40M) y con la exposición de motivos del proyecto de ley (confirmada
  en el diario de la Comisión de Hacienda). Es un dato oficial y correcto, pero no es algo que
  Lacalle Pou haya dicho con esas palabras en el discurso ese día — es la lectura que hizo la propia
  Presidencia del conjunto de medidas.
- Implicación para el editor: el `resumen` no está mal (el 150M es una cifra oficial real sobre el
  mismo anuncio), pero atribuye implícitamente al discurso algo que en rigor viene de la
  comunicación posterior. Si se quiere ser estricto, correspondería separar "dijo" (75%, textual)
  de "informó Presidencia" (150 millones, del comunicado). No reescribo el resumen ni el fragmento;
  quedan como estaban en el chequeo, con la cifra y la fuente exacta.

## medios_faltantes

- **mef** — Ministerio de Economía y Finanzas. `url: https://www.gub.uy/ministerio-economia-finanzas/`.
  Propuesto `grupo: estado-uruguayo`, `alineamiento: estatal` (mismo criterio que `presidencia` y
  `parlamento`). Usado en `chequeos.yaml` para la presentación y la noticia oficial del 08/02/2021.
- Nota sobre `parlamento`: usé este slug también para documentos de `diputados.gub.uy` (versión
  taquigráfica de Comisión de Hacienda, presentación del MEF a la Comisión de Presupuestos), porque
  `content/medios/parlamento.yaml` ya lista "Cámara de Representantes" y "Diario de Sesiones" como
  alias del mismo organismo (Poder Legislativo). Si el editor prefiere un slug separado para la
  Cámara de Representantes (dominio propio, `diputados.gub.uy`), lo dejo señalado acá para que lo
  decida; no me pareció que ameritara crear un medio nuevo dado el alias ya existente.

## candidatos_giro

Ninguno. El encargo se limita a chequear datos dentro de dos declaraciones ya publicadas y
puntuales; no relevé el resto de la trayectoria del político en este tema en esta corrida (ver
`## cobertura_del_periodo`).

## hipotesis

- La cifra de "US$600 millones" (2021-07-28) podría estar tomada de memoria del propio
  Lacalle Pou sobre la cifra de US$660 millones que el MEF había difundido en febrero de 2021 para
  el ejercicio 2020 (660 > 600, y el margen "más de" es compatible), pero no hay forma de confirmar
  que sea *esa* la cifra que tenía en mente y no una actualizada para 2021 que yo no haya
  encontrado. Falta: una presentación oficial del MEF fechada entre julio y agosto de 2021 que
  repita o actualice el número de ahorro (busqué la del 12/07/2021 y no lo trae).
- El clip de VTV Noticias en YouTube (pXlsC5BsOQk) tiene un título que promete el pasaje de ahorro
  pero el contenido no corresponde. Puede que YouTube/el buscador hayan indexado mal el título, o
  que VTV haya resubido un clip con título genérico de la misma ronda de entrevistas de Lacalle Pou
  en Buenos Aires (dio varias esos días: LN+, TN, C5N). No profundicé más porque excede el
  presupuesto razonable para esta corrida; si en el futuro se quiere subir esta declaración a
  `textual`, el camino más prometedor es pedir el video completo de LN+ (o de algún repost íntegro)
  y transcribirlo con `pnpm transcribir`.
- La comparación "75% de los contribuyentes" carece de un padrón público de la DGI (total de
  contribuyentes de IRPF por categoría, para poder recalcular el porcentaje de forma independiente
  del propio Poder Ejecutivo). No until encontré ese padrón en esta corrida. No lo marco como
  `_faltante: dato_oficial` en el chequeo porque sí hay un documento oficial con el desglose
  (el anexo técnico de Presidencia); pero la verificación queda un escalón por debajo de lo ideal
  (fuente oficial que calcula, no fuente oficial independiente que audita).

## casos_vistos

Ninguno.

## verificacion_manual

- `https://www.elpais.com.uy/lacalle-sobre-irpf` — `pnpm fuente` devolvió solo 116 caracteres (el
  pie de página con el copyright). Es una URL corta/alias de El País para el día del anuncio de
  IRPF/IASS (02/03/2023); probablemente redirige a contenido que requiere JS o está paywalled de un
  modo que el extractor no resuelve. Wayback Machine guardó una copia pero con el mismo problema de
  extracción. No usé esta nota para nada; el resto de la cobertura de El País para este mismo tema
  sí se pudo leer sin problemas (ver más abajo).

## cobertura_del_periodo

Este encargo es puntual (dos declaraciones ya publicadas, un evento cada una) y no un relevamiento
de todo el tema `economia/impuestos` a lo largo de los mandatos de Lacalle Pou, así que no aplica el
criterio habitual de cobertura completa de campaña + gestión + oposición. Documento igual el
resultado del chequeo de cobertura de medios que sí es parte del protocolo (`pnpm descubrir` sobre
`elpais.com.uy`, el medio con el problema de indexación conocido):
- Para 2021-07 — 2021-08 (evento del ahorro): el sitemap de El País devolvió 110 candidatas; entre
  ellas apareció la cobertura específica del hecho ("El ahorro que camisetea son recortes...",
  29/07/2021), que leí y sumé como tercera fuente del chequeo. **El País sí cubrió este hecho** y
  antes no estaba en el corpus (0 notas de el-pais sobre esto antes de esta corrida).
- Para 2023-03 (evento IRPF/IASS): el sitemap devolvió 10 candidatas relevantes, incluida
  `elpais.com.uy/lacalle-sobre-irpf` (el día exacto del anuncio) — pero esa URL específica no se
  pudo extraer (ver `## verificacion_manual`). Sí hay, sin abrir, más cobertura de seguimiento
  (03/03, 06/03, 07/03, 08/03, 10/03) que no fue necesaria para los chequeos de esta corrida y que
  no leí para no gastar presupuesto en algo que no hacía falta para el dato concreto pedido.
- Conclusión operativa: confirmado que El País cubre a Lacalle Pou con normalidad y que el problema
  de indexación de `WebSearch` sobre ese dominio se sigue reproduciendo (`WebSearch` no lo trajo en
  ninguna de las consultas de esta corrida; solo `pnpm descubrir` lo encontró).

## objeciones_al_brief

Ninguna por asimetría de Regla 0: este brief es, por diseño, la mitad simétrica de un mismo criterio
aplicado también a Orsi en la corrida gemela `2026-09-07-orsi-veracimetro` (mismo criterio: "dato
concreto dentro de una cita publicada → se chequea"), así que no encontré nada que objetar en ese
plano.

Sí señalo una imprecisión fáctica menor del brief (no una objeción de Regla 0, solo una corrección
de estado): el brief dice que "las dos declaraciones están hoy en nivel reportado (prensa)", pero
`2023-03-02-baja-impuestos-irpf-iass.yaml` ya está en `nivel: textual` en el archivo publicado (con
fuente `documento_oficial` de Presidencia). Lo señalo en `## registro_primario` para que quede claro
que igual hice la búsqueda de primaria pedida, aunque el motivo original (upgrade de tier) no
aplicaba a este registro.
