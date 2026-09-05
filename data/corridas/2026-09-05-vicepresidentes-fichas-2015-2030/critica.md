# Crítica — corrida 2026-09-05-vicepresidentes-fichas-2015-2030

Modelo: claude-sonnet-5 (brazo barato del experimento; corro en Sonnet donde el rol declarado en
`.claude/agents/critico.md` es Opus. Instrucción del encargo, no decisión mía; queda dicho para el
registro del experimento).

Lote: inbox/vicepresidentes/semilla-2015-2030/2026-09-05/
Registros revisados: 4 (sendic, topolansky, argimon, cosse), ya promovidos a `content/politicos/`
por un error de orden de pasos según avisó el encargo. Los reviso como si no estuvieran publicados;
lo que encuentre que los invalide va por `content/correcciones/`, no lo toco yo.

Nota de proceso: los cuatro registros en `content/politicos/` coinciden campo por campo con
`inbox/vicepresidentes/semilla-2015-2030/2026-09-05/politicos.yaml` (verificado con lectura
directa de los cuatro archivos promovidos); el único cambio del promotor fue quitar `_slug` y
`_investigacion` y agregar `procedencia`. La crítica que sigue vale para ambos.

## Objeciones por registro

### politicos[0] — sendic — "15 de febrero de 2000-15 de febrero de 2005" (Representante Nacional)
- severidad: aviso
- tipo: sin_objecion
- objecion: Ninguna. Abrí `es.wikipedia.org/wiki/Ra%C3%BAl_Sendic_Rodríguez` y las cinco citas de
  fechas de mandatos previos a la vicepresidencia (Representante 2000-2005, VP-ANCAP 2005-2008,
  presidente ANCAP 2008-2009, ministro 2009-2010, presidente ANCAP 2010-2013) son copias literales
  y contiguas del infobox, sin costura entre fragmentos. Las fechas encadenan sin hueco ni
  superposición entre sí (cada `hasta` es el `desde` del siguiente).
- cita_de_contexto: "Representante Nacional de Uruguaypor Montevideo 15 de febrero de 2000-15 de
  febrero de 2005" (infobox, https://es.wikipedia.org/wiki/Ra%C3%BAl_Sendic_Rodríguez)
- accion_sugerida: ninguna.

### politicos[0] — sendic — "hasta su renuncia el 13 de septiembre de 2017" (VP + salida)
- severidad: aviso
- tipo: explicacion_alternativa
- objecion: El campo `tipo: renuncia` (no `renuncia_forzada`) está bien elegido con lo que hay en
  mano, pero la razón que da `razones.md` ("las fuentes no permiten distinguir") es más débil de
  lo que parece: sí hay una fuente que agrega contexto relevante y no la vi citada ni en
  `inbox/` ni en `notas.md`. Abrí El Observador (11/9/2017) y Montevideo Portal (9/9/2017), ninguna
  de las dos abiertas en la corrida original: "El vicepresidente informó la renuncia a su cargo al
  Plenario del Frente Amplio y presentó por escrito sus argumentos contra el informe del Tribunal
  de Conducta Política" (Montevideo Portal) y Mujica, en la misma nota: "Si había un error había
  que tomar medidas, pero no podían llegar a la ofensa, al aplastamiento". Esto sitúa la renuncia
  después de un fallo desfavorable de un tribunal ético interno del FA y en medio de una presión
  de bancada real (El Observador: "En la semana hubo reuniones para intentar acordar una sanción al
  vicepresidente. Se había consensuado una moción para…", la diaria, cortado por paywall).
  Ninguna fuente usa la palabra "forzada" ni documenta un mecanismo de destitución formal (no hubo
  juicio político; la Asamblea General solo aceptó la carta de renuncia, un trámite, no una
  votación de remoción). Con eso, `renuncia` sigue siendo lo correcto y `renuncia_forzada`
  afirmaría más de lo que las fuentes sostienen (riesgo del art. 336 CP si se escribiera al
  revés). Pero el brief pedía explícitamente que la duda quedara documentada en `notas.md`, y no
  la encontré ahí: la explicación del porqué de la duda vive solo en `razones.md`, que la escribe
  el editor después de los hechos, no el investigador en el momento. Es una falla de trazabilidad,
  no de resultado.
- cita_de_contexto: "El vicepresidente informó la renuncia a su cargo al Plenario del Frente Amplio
  y presentó por escrito sus argumentos contra el informe del Tribunal de Conducta Política."
  (https://www.montevideo.com.uy/Noticias/Sendic-renuncio-a-la-vicepresidencia-Mujica-anuncio-que-Topolansky-va-a-asumir-uc354114)
- accion_sugerida: en una corrida futura sobre este período, agregar al `notas.md` del
  investigador (no al registro publicado) la mención del fallo del Tribunal de Conducta Política
  como contexto de la renuncia, dejando escrita ahí la duda que el brief pedía documentar.

### politicos[0] — sendic — Wikidata "cargos criminales" e infobox
- severidad: aviso
- tipo: sin_objecion
- objecion: Ninguna sobre lo publicado. El infobox de Wikipedia trae un campo de Wikidata
  ("Cargos criminales: Abuso de autoridad, malversación de fondos") sin fecha ni etapa procesal
  documentada en el cuerpo del artículo que pude leer. El investigador correctamente no lo llevó
  al registro (`estado_actual` no lo menciona) y lo dejó anotado en `notas.md` con la aclaración de
  que no se investigó por instrucción del brief. Eso es lo que corresponde: ese dato, tal como
  está sourced (solo a Wikidata, sin acusador identificable, sin etapa ni fecha), no alcanza ni
  siquiera el umbral amplio de `content/casos/` (ley 18.331 art. 18 y 9 bis), y mucho menos el de
  una ficha identitaria.
- accion_sugerida: ninguna para esta corrida; si se abre una corrida de casos sobre Sendic, no
  partir de ese campo de Wikidata sin una fuente primaria propia.

### politicos[1] — topolansky — "13 de septiembre de 2017-14 de febrero de 2020" (VP)
- severidad: aviso
- tipo: sin_objecion
- objecion: Ninguna sobre la exactitud de las fechas y las citas. Verifiqué el empalme
  Sendic→Topolansky contra tres fuentes independientes que abrí yo mismo: el infobox de Sendic
  ("...hasta su renuncia el 13 de septiembre de 2017... siendo reemplazado por Lucía Topolansky"),
  el infobox de Topolansky ("13 de septiembre de 2017-14 de febrero de 2020") y el documento
  oficial de Presidencia ("Lucía Topolansky asumió este miércoles 13 ante la Asamblea General del
  Parlamento la vicepresidencia de Uruguay... tras la renuncia al cargo de Raúl Sendic"). El
  empalme cierra exacto, mismo día, sin hueco ni superposición. La cita de Presidencia es literal y
  contigua.
- cita_de_contexto: "Lucía Topolansky asumió este miércoles 13 ante la Asamblea General del
  Parlamento la vicepresidencia de Uruguay y, por tal, la presidencia de ese cuerpo legislativo,
  tras la renuncia al cargo de Raúl Sendic."
  (https://www.gub.uy/presidencia/comunicacion/noticias/lucia-topolansky-asumio-vicepresidenta-uruguay-titular-asamblea-general)
- accion_sugerida: ninguna.

### politicos[1] — topolansky — "14 de febrero de 2020" (fin VP) → "1 de marzo de 2025" hueco con Argimón
- severidad: corregir
- tipo: contexto_omitido
- objecion: Este es el punto que me pidió revisar el coordinador a mitad de tarea. La ficha de
  Topolansky cierra su vicepresidencia el 2020-02-14 y la de Argimón (ver más abajo) la empieza el
  2020-03-01: catorce días donde ninguna de las dos figura como vicepresidenta. **No es un error de
  fecha.** Es un rasgo estructural del calendario constitucional uruguayo, no específico de esta
  transición: la nueva Legislatura (Cámara de Senadores y de Representantes electa en octubre) jura
  el 15 de febrero siguiente, mientras que el presidente y el vicepresidente asumen recién el 1 de
  marzo. En esos catorce días la vicepresidencia queda vacante y la Asamblea General/Cámara de
  Senadores la preside el senador titular de la lista más votada del partido más votado, no el
  vicepresidente saliente ni el entrante. Lo confirmé para la transición análoga de 2025 con una
  fuente que abrí yo mismo, no citada en el lote original: "Desde el 15 de febrero y hasta el 1º de
  marzo, el senador Alejandro Sánchez será el presidente del Senado y de la Asamblea General,
  debido a que encabeza la lista más votada (la 609, del Movimiento de Participación Popular) del
  partido más apoyado, Frente Amplio (FA)" (Búsqueda, 15/2/2025). Para 2020 específicamente, la
  evidencia que tengo de que fue Mujica quien ejerció ese rol viene de una síntesis de buscador
  sobre notas de prensa de la época, no de una fuente que abrí yo mismo palabra por palabra, así
  que no lo doy por confirmado con el mismo rigor que el mecanismo general. El propio Sendic (que
  dejó su banca de Representante el 2005-02-15 para asumir en ANCAP recién el 2005-03-01) tiene el
  mismo patrón de dos semanas en su propia ficha, y no lo objeté ahí porque no involucra un cargo
  ejecutivo vacante.

  El problema no es que las fechas estén mal: están bien y las dos citas de Wikipedia que las
  sostienen son literales. El problema es que ni `politicos.yaml` ni `notas.md` explican el hueco,
  así que un lector cuidadoso (como el propio encargo de esta crítica) lo lee como sospecha de
  error de arrastre. Con el esquema actual de `politicos` (sin campo de notas generales) no hay
  dónde ponerlo dentro del registro; corresponde documentarlo donde sí hay lugar.
- cita_de_contexto: "Desde el 15 de febrero y hasta el 1º de marzo, el senador Alejandro Sánchez
  será el presidente del Senado y de la Asamblea General, debido a que encabeza la lista más
  votada (la 609, del Movimiento de Participación Popular) del partido más apoyado, Frente Amplio
  (FA)."
  (https://www.busqueda.com.uy/politica/la-asuncion-del-nuevo-parlamento-los-detalles-del-inicio-la-legislatura-n5395889)
- accion_sugerida: agregar una nota a `notas.md` de esta corrida (no al registro publicado)
  explicando el mecanismo; considerar una ficha en `content/eventos/` o `content/paginas/` sobre el
  calendario de transición presidencial uruguayo (15 de febrero Legislatura / 1 de marzo Ejecutivo)
  para que no se repita esta duda en cada ficha de vicepresidente, ministro o senador que atraviese
  una transición. Si se documenta con fuente propia quién presidió la Asamblea General entre el
  2020-02-15 y el 2020-03-01, se puede cerrar del todo.

### politicos[1] — topolansky — "15 de febrero de 2020-1 de marzo de 2022" (Senadora) y salida
- severidad: aviso
- tipo: sin_objecion
- objecion: Cita de Infobae verificada literal y contigua, fecha del artículo (2022-03-01)
  coincide con la fecha de salida registrada.
- cita_de_contexto: "La exvicepresidenta de Uruguay Lucía Topolansky presentó este martes su carta
  de renuncia al escaño que ocupa en el Senado y se hará efectiva este miércoles"
  (https://www.infobae.com/america/agencias/2022/03/01/exvicepresidenta-uruguaya-topolansky-deja-el-miercoles-su-escano-en-el-senado/)
- accion_sugerida: la misma nota de Infobae (agencia EFE) trae, en un párrafo posterior no citado
  en el registro, la frase "Topolansky, que fue vicepresidenta en el segundo mandato de Tabaré
  Vázquez (2005-2010 y 2015-2020)...", que atribuye a Vázquez dos mandatos como si el segundo
  incluyera 2005-2010 (que en realidad fue su primer mandato, con Nin Novoa de vicepresidente, no
  Topolansky). Podría ser un error de la nota, pero no tengo en mano un documento oficial, diario
  de sesiones o video que lo confirme como tal (solo lo contrasto contra otro artículo de
  Wikipedia, que no es fuente primaria), así que no lo anoto en `discrepancias.yaml` y lo dejo acá
  como pista para quien tenga a mano el acta de proclamación de resultados de 2004 o 2014.

### politicos[2] — argimon — "15 de febrero de 2000-15 de febrero de 2010" (Representante)
- severidad: aviso
- tipo: sin_objecion
- objecion: Cita literal y contigua, verificada contra el infobox.
- cita_de_contexto: "Representante Nacionalpor Montevideo 15 de febrero de 2000-15 de febrero de
  2010" (https://es.wikipedia.org/wiki/Beatriz_Argimón)
- accion_sugerida: ninguna.

### politicos[2] — argimon — cargos faltantes (Directora del INAME, posible Edila)
- severidad: corregir
- tipo: asimetria
- objecion: Abrí el cuerpo completo del artículo de Wikipedia de Argimón (no solo el infobox) y
  encontré un cargo de gobierno documentado que no está en la ficha ni fue anotado como hipótesis
  en `notas.md`: "Durante el período presidencial del presidente nacionalista Luis Alberto Lacalle
  fue directora del INAME (Instituto Nacional del Menor; actual INAU)". Es un cargo designado por
  el Poder Ejecutivo al frente de un organismo estatal, del mismo nivel que "presidenta de ANCAP"
  (Sendic) o "presidenta de ANTEL" (Cosse), ambos sí incluidos en sus fichas respectivas. La razón
  más probable de la omisión es la misma que se dio explícitamente para otros tres cargos de esta
  misma corrida (Edila de Topolansky, Directora de TI de Cosse): el cuerpo del artículo no da fecha
  exacta, solo "durante el período de Lacalle" (1990-1995). Si esa fue la razón, es una decisión
  correcta y consistente con el criterio ya aplicado — pero acá nadie la escribió: `notas.md` trae
  una hipótesis para Topolansky-Edila y otra para Cosse-Directora TI, y ninguna para Argimón-INAME,
  aunque el caso es idéntico. Eso es una asimetría de documentación, no necesariamente de criterio,
  pero el efecto es que a Argimón se la revisó con menos detalle que a las otras dos en este punto
  específico. Además, el mismo artículo dice, sin fecha, "tras 30 años de militante ha tenido
  cargos como Edila de Montevideo y Representante Nacional", lo que sugiere que Argimón también
  ejerció como Edila en algún momento (más allá de su candidatura de 1989, que no dice si ganó), y
  tampoco está anotado en ningún lado.
- cita_de_contexto: "Durante el período presidencial del presidente nacionalista Luis Alberto
  Lacalle fue directora del INAME (Instituto Nacional del Menor; actual INAU)."
  (https://es.wikipedia.org/wiki/Beatriz_Argimón)
- accion_sugerida: agregar a `notas.md` de esta corrida la hipótesis de la Dirección del INAME y de
  la posible Edilía de Argimón, con el mismo motivo (fecha imprecisa) que ya se usó para los otros
  dos casos, y buscar en una corrida futura la fecha exacta (Diario Oficial, IMPO o el propio sitio
  de INAU/INAME) para decidir si entra como `mandato`.

### politicos[2] — argimon — "1 de marzo de 2020-1 de marzo de 2025" (VP) y Embajadora
- severidad: aviso
- tipo: sin_objecion
- objecion: Citas de Infobae (30/5/2025) y El Observador (15/10/2025) verificadas literales y
  contiguas contra las notas completas. Ambas notas tratan la designación con cierta fricción
  partidaria (ver sección Cobertura), pero las citas usadas en el registro son oraciones neutras de
  hecho, no las partes más críticas de cada nota, así que no hay problema de cita fuera de
  contexto.
- cita_de_contexto: "La Cámara de Senadores aprobó en la noche del martes la venia para designar a
  la nacionalista Beatriz Argimón como representante ante la Unesco en París"
  (https://www.elobservador.com.uy/nacional/senado-aprobo-la-venia-beatriz-argimon-la-unesco-y-este-miercoles-retoma-la-discusion-carolina-ache-n6020785)
- accion_sugerida: el propio `notas.md` ya deja constancia, correctamente, de que el
  `desde: 2025-10-14` es la fecha de la venia del Senado y no necesariamente la de asunción
  efectiva en París. Coincido con esa autocrítica y no tengo nada que agregar salvo reforzar la
  acción sugerida: buscar el comunicado de Cancillería o cambio.gub.uy con la fecha de presentación
  de credenciales.

### politicos[3] — cosse — mandatos ANTEL/Ministra/Senadora/Intendenta
- severidad: aviso
- tipo: sin_objecion
- objecion: Las cinco citas (ANTEL, Ministra, Senadora, Intendenta, VP) son literales y contiguas
  contra el infobox completo de Wikipedia, que leí entero. Los huecos entre mandatos (ej. de enero
  de 2019 a febrero de 2020, mientras fue candidata) no son errores: corresponden a períodos donde
  Cosse no ejerció cargo público, consistente con su historial de precandidaturas de 2019.
- cita_de_contexto: "26 de mayo de 2010-28 de febrero de 2015" / "2 de marzo de 2015-29 de enero de
  2019" / "15 de febrero de 2020-20 de noviembre de 2020" / "26 de noviembre de 2020-8 de julio de
  2024" (todas de https://es.wikipedia.org/wiki/Carolina_Cosse)
- accion_sugerida: ninguna.

### politicos[3] — cosse — única fuente no-Wikipedia (JUTEP)
- severidad: corregir
- tipo: asimetria
- objecion: `razones.md` dice correctamente que Cosse tiene una sola fuente no-Wikipedia; lo
  verifiqué y es cierto. Pero esa fuente es apenas el pie de un enlace de descarga en una página de
  JUTEP ("Vicepresidenta de la República Ing. Carolina Cosse - 2025"), no una oración de una nota
  que narre el hecho. Cumple el mínimo del esquema, pero es la sustentación más débil de las cuatro
  fichas para el hecho más reciente y más cubierto por la prensa del lote: la asunción presidencial
  del 1° de marzo de 2025 fue noticia de portada en todos los medios uruguayos. Al investigar el
  punto anterior (el hueco Topolansky-Argimón) encontré sin buscarlo una nota de Búsqueda sobre
  exactamente esa asunción, que ni siquiera hace falta ir a buscar más allá del corpus disponible.
  Sendic (con controversia) y Argimón (con controversia) terminaron con dos fuentes no-Wikipedia
  cada uno; la persona con menos motivo aparente para tener una cobertura pobre (vicepresidenta en
  ejercicio, asunción reciente y muy cubierta) es la que tiene la sourcing más fina del lote. Esto
  no es necesariamente un sesgo partidario deliberado (Sendic y Topolansky, del mismo partido que
  Cosse, están bien cubiertas), pero sí es una aplicación dispareja del "mismo empeño" que pide el
  punto 6 de esta crítica.
- cita_de_contexto: "Vicepresidenta de la República Ing. Carolina Cosse - 2025"
  (https://www.gub.uy/junta-transparencia-etica-publica/comunicacion/publicaciones/declaraciones-juradas-bienes-ingresos-del-presidente-del-0)
- accion_sugerida: agregar una fuente de prensa sobre la asunción del 1° de marzo de 2025 (por
  ejemplo, la nota de Búsqueda del 15/2/2025 sobre la instalación del nuevo Parlamento y la
  transición, u otra específica del día de la asunción) para que el mandato de vicepresidenta de
  Cosse tenga el mismo nivel de sustento narrativo que el de Sendic y Argimón.

### politicos[3] — cosse — casos_vistos (Antel Arena) en notas.md
- severidad: aviso
- tipo: contexto_omitido
- objecion: No es una objeción al registro publicado (la ficha no menciona el caso, correctamente,
  porque el brief no pidió investigar causas judiciales). Es una corrección al propio `notas.md`
  del investigador, para que la pista quede completa: el artículo de Wikipedia que se cita ahí
  dice que el fiscal Machado archivó la causa en 2024, pero agrega un dato que `notas.md` no
  recoge: "El 2 de abril de 2024, el fiscal de Lavado de Activos de 1° Turno, Enrique Rodríguez
  solicitó la reapertura del expediente del caso." Es decir, el archivo no fue necesariamente el
  final de la historia. No cambia nada de lo publicado en esta corrida, pero si alguna vez se abre
  una corrida de casos sobre Cosse, conviene partir de este dato actualizado.
- cita_de_contexto: "El 2 de abril de 2024, el fiscal de Lavado de Activos de 1° Turno, Enrique
  Rodríguez solicitó la reapertura del expediente del caso."
  (https://es.wikipedia.org/wiki/Carolina_Cosse)
- accion_sugerida: actualizar `notas.md` de esta corrida con este dato, para la memoria
  institucional, y para quien resuelva el caso a futuro.

## Objeciones al lote

1. **El hueco Topolansky→Argimón es real y no es un error**, por el motivo constitucional
   explicado arriba (jura de la Legislatura el 15 de febrero, del Ejecutivo el 1° de marzo). No
   está documentado en ningún lugar del lote, lo que lo hace parecer un error a primera vista —
   como de hecho le pasó a quien lanzó esta crítica. Recomiendo una nota general (evento o página)
   que lo explique una sola vez para las próximas fichas de vicepresidentes, ministros y senadores
   que atraviesen la misma fecha.

2. **Asimetría en la profundidad de búsqueda, no en el criterio.** Los cuatro perfiles tienen el
   mismo formato y la misma cantidad de campos, y el brief se cumplió parejo en lo explícito
   (mismo umbral para excluir cargos partidarios/protocolares, misma búsqueda judicial de rutina
   para las cuatro personas). Pero encontré dos huecos de sourcing que no se distribuyen parejo:
   Argimón es la única de las cuatro con un cargo de gobierno documentado (Dirección del INAME) que
   ni entró a la ficha ni se anotó como hipótesis, cuando el mismo problema (fecha imprecisa) sí se
   documentó para Topolansky y para Cosse. Y Cosse, pese a ser la persona con el hecho más reciente
   y más cubierto por la prensa (su propia asunción, hace seis meses), es la que terminó con la
   sourcing no-Wikipedia más débil del lote. Ninguna de las dos asimetrías corre en una sola
   dirección partidaria (una perjudica a la vicepresidenta del Partido Nacional, la otra a la
   vicepresidenta actual del Frente Amplio), así que no leo esto como un problema de Regla 0, sino
   de rigor de búsqueda disparejo entre personas.

3. **`razones.md` subestima la sourcing no-Wikipedia de Sendic.** Dice que Sendic tiene "una sola
   fuente no-Wikipedia (la diaria)"; en realidad tiene dos (la diaria y el documento oficial de
   Presidencia sobre la asunción de Topolansky, que también sirve de fuente para la salida de
   Sendic). Es un error a favor de la ficha (está mejor sustentada de lo que el propio editor
   registró), pero vale corregir el razonamiento escrito para que el rastro de auditoría sea
   preciso.

4. **El requisito de `notas.md` sobre la duda renuncia/renuncia_forzada no se cumplió a la letra.**
   El brief pedía explícitamente que si las fuentes no permiten distinguir, se explique la duda en
   `notas.md`. La explicación existe, pero en `razones.md` (del editor), no en `notas.md` (del
   investigador). El resultado (`tipo: renuncia`) es correcto de todas formas por lo que encontré
   al releer las fuentes.

5. **Dependencia de grupos de medios: sin objeción.** Aunque el esquema de `politicos` no exige
   dos grupos de medios (correcto, según razones.md, porque no es una `declaración` con
   `evidencia.nivel: reportado`), reviso igual: las fuentes no-Wikipedia del lote son la diaria
   (cooperativa), Infobae (grupo-infobae), El Observador (werthein-hochbaum), Presidencia y JUTEP
   (Estado uruguayo) — cuatro propietarios distintos, sin dependencia de un solo grupo.

6. **Cargo "Vicepresidente de la República" en femenino.** Las tres mujeres de esta ficha
   (Topolansky, Argimón, Cosse) llevan el campo `cargo` con la forma masculina exacta que pidió el
   brief, mientras que todas las fuentes citadas las llaman "vicepresidenta". Es una decisión
   técnica razonable (una sola cadena de texto para poder comparar/unir mandatos de la misma
   naturaleza en el sitio) y se aplicó pareja a las cuatro personas, así que no es un problema de
   Regla 0 ni objeción de fondo; lo dejo anotado para quien decida cómo se muestra `cargo` en la
   interfaz, por si conviene un campo de despliegue separado del campo de comparación.

## Objeciones al brief

Ninguna que viole la Regla 0. El brief pide expresamente el mismo rigor para las cuatro personas,
prohíbe investigar causas judiciales salvo pista para después (aplicado parejo a las cuatro, no
solo a quien dejó el cargo antes de tiempo), y da una regla simétrica y defendible para el caso
ambiguo de Sendic (ante la duda, no afirmar de más, documentando el motivo). La única observación
de proceso —no de sesgo— es la ya anotada en el punto 4 de arriba: el brief le pide al investigador
escribir la duda en `notas.md`, y esa pieza específica del cumplimiento no la encontré ahí.

## Cobertura

```yaml
- medio: la-diaria
  url: https://ladiaria.com.uy/politica/articulo/2017/9/sendic-renuncio-en-forma-indeclinable-a-la-vicepresidencia-de-la-republica/
  fecha: 2017-09-09
  evento: caso-sendic
  politico: sendic
  tono: neutral
  justificacion: >-
    Relato factual de la renuncia sin adjetivación propia: "El vicepresidente Raúl Sendic le
    comunicó este sábado al Plenario del Frente Amplio su decisión de renunciar en forma
    indeclinable a la Vicepresidencia de la República."

- medio: montevideo-portal
  url: https://www.montevideo.com.uy/Noticias/Sendic-renuncio-a-la-vicepresidencia-Mujica-anuncio-que-Topolansky-va-a-asumir-uc354114
  fecha: 2017-09-09
  evento: caso-sendic
  politico: sendic
  tono: neutral
  justificacion: >-
    Reporta la renuncia y cita a varios actores (Sendic, Mujica) sin un encuadre propio a favor o
    en contra; incluye tanto la autodefensa de Sendic ("presentó por escrito sus argumentos contra
    el informe del Tribunal de Conducta Política") como la crítica de Mujica al modo en que se lo
    trató, en equilibrio.

- medio: el-observador
  url: https://www.elobservador.com.uy/nota/las-consecuencias-de-la-renuncia-de-sendic-lo-que-se-sabe-hasta-ahora-201791115580
  fecha: 2017-09-11
  evento: caso-sendic
  politico: sendic
  tono: neutral
  justificacion: >-
    Nota de despacho informativo que reparte espacio entre elogios de Vázquez a Sendic ("Sendic ha
    cumplido a cabalidad, con seriedad y con responsabilidad la función que le dio el pueblo
    uruguayo") y la lectura crítica de la senadora Tourné ("la renuncia 'es un golpe político'"),
    sin inclinar la balanza.

- medio: infobae
  url: https://www.infobae.com/america/agencias/2022/03/01/exvicepresidenta-uruguaya-topolansky-deja-el-miercoles-su-escano-en-el-senado/
  fecha: 2022-03-01
  evento: propuesto:salida-topolansky-senado-2022
  politico: topolansky
  tono: neutral
  justificacion: >-
    Despacho de agencia (EFE) puramente factual sobre la renuncia a la banca: "presentó este
    martes su carta de renuncia al escaño que ocupa en el Senado y se hará efectiva este
    miércoles", sin valoración.

- medio: infobae
  url: https://www.infobae.com/america/america-latina/2025/05/30/yamandu-orsi-designo-a-beatriz-argimon-vicepresidenta-de-lacalle-pou-como-embajadora-de-uruguay-ante-la-unesco/
  fecha: 2025-05-30
  evento: propuesto:designaciones-embajadores-2025
  politico: argimon
  tono: desfavorable
  justificacion: >-
    Reproduce sin matizar la reacción de sus propios correligionarios describiéndola como una
    molestia resuelta: "'Tenemos un problema menos en el Partido Nacional para resolver', señaló"
    la senadora Graciela Bianchi sobre la designación de Argimón.

- medio: el-observador
  url: https://www.elobservador.com.uy/nacional/senado-aprobo-la-venia-beatriz-argimon-la-unesco-y-este-miercoles-retoma-la-discusion-carolina-ache-n6020785
  fecha: 2025-10-15
  evento: propuesto:designaciones-embajadores-2025
  politico: argimon
  tono: desfavorable
  justificacion: >-
    Da amplio desarrollo a las acusaciones de una senadora de su propio partido sin contrapeso
    equivalente en extensión: "Bianchi había expresado en reiteradas ocasiones que Argimón 'operó
    con el Frente Amplio' durante el gobierno anterior."

- medio: busqueda
  url: https://www.busqueda.com.uy/politica/la-asuncion-del-nuevo-parlamento-los-detalles-del-inicio-la-legislatura-n5395889
  fecha: 2025-02-15
  evento: elecciones-2024
  politico: cosse
  tono: neutral
  justificacion: >-
    Cobertura institucional de la instalación del nuevo Parlamento; menciona a Cosse solo de paso
    y sin valoración: "Silvia Nane (en reemplazo de Carolina Cosse, que asume la vicepresidencia)".
```
