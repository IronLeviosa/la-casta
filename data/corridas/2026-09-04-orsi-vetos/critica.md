# Crítica — corrida 2026-09-04-orsi-vetos

Modelo: claude-sonnet-5
Lote: inbox/orsi/vetos/2026-09-04/
Registros revisados: 1 declaración (`declaraciones.yaml[0]`); `vetos.yaml` vacío por diseño (el hallazgo del lote) y `menciones.yaml` vacío.

## Objeciones por registro

### vetos.yaml — (vacío) — "no se encontró ningún veto" (notas.md, `vetos_sin_desenlace` y `cobertura_del_periodo`)

- severidad: **bloquea**
- tipo: riesgo_legal (afirma más de lo que el método de búsqueda realmente respalda; no es un riesgo de difamación sino de exactitud fáctica de una afirmación negativa)
- objecion: La afirmación "no se encontró ningún veto" se apoya casi enteramente en (a) búsqueda de texto libre sobre `documentosyleyes/documentos/repartidos` con variantes de "veto"/"observaciones" y (b) prensa y balances de gestión. Repliqué exactamente el mismo método sobre un veto **confirmado** de otro presidente para usarlo como control positivo, y el método falla en encontrarlo:
  - El veto de Lacalle Pou a la ley de suelos de prioridad forestal está confirmado en `https://parlamento.gub.uy/documentosyleyes/ficha-asunto/148848/ficha_completa` (sección "Sanciones": *"16-12-2021 Poder Ejecutivo veto total."*, cuerpo de la observación presentado como repartido `A.G. 74/2021, 10/0 PDF`).
  - Repetí la búsqueda del investigador —`https://parlamento.gub.uy/documentosyleyes/documentos/repartidos?Cpo_Codigo=A&Lgl_Nro=49&Texto=veto&Tipobusqueda=T` (y con `Tipobusqueda=E`)— restringida al cuerpo correcto (Asamblea General) y a la legislatura correcta (49, la del veto). **Devuelve cero repartidos.** El repartido que contiene el mensaje de veto existe (`A.G. 74/2021`), pero su título indexado es genérico ("Regulación", repite el nombre del proyecto), así que un buscador de texto sobre títulos/resúmenes de repartidos no lo encuentra aunque la palabra "veto" figure en el cuerpo del PDF.
  - Esto significa que el mismo método, aplicado a la Legislatura 50 (Orsi), tiene una probabilidad real de no encontrar un veto aunque exista. La ausencia de resultados no distingue entre "no hubo veto" y "el buscador de repartidos no indexa el contenido de los mensajes de observaciones por palabra clave".
  - En cambio, la ficha de trámite de cada asunto (`ficha-asunto/<id>/ficha_completa`, sección "Sanciones") sí es confiable: la usé sobre la ley de eutanasia de Orsi (asunto 165490) y muestra literalmente *"24-10-2025 Poder Ejecutivo promulga."*, sin línea de veto — ese es el tipo de evidencia que hace falta, y hoy no está aplicada de forma sistemática a los demás proyectos promulgados en el período.
  - Además, la lista completa de leyes promulgadas de la Legislatura 50 sí es accesible y navegable (`https://parlamento.gub.uy/documentosyleyes/leyes?LegislaturaSel=50`, ~118 leyes al 2026-09-04, cada fila con su número de asunto en la última columna). No se comprobó, ficha por ficha, que ninguna tenga "Poder Ejecutivo veto parcial/total" en su sección "Sanciones" en vez de "Poder Ejecutivo promulga". El investigador sí probó esta ruta para UN asunto (155750, Defensa Pública, elegido porque apareció en una búsqueda de texto, no como parte de un barrido sistemático) y no completó el resto.
  - Contraste con el lote gemelo: `inbox/lacalle-pou/vetos/2026-09-04/vetos.yaml` sí usa `ficha_completa` como fuente `documento_oficial` de nivel `textual` para cada uno de los cuatro vetos que reporta (cita literal: *"Poder Ejecutivo veto total."*). Es decir, el estándar de evidencia que el propio pipeline usó para confirmar que Lacalle Pou vetó es más fuerte que el estándar usado acá para confirmar que Orsi no vetó. Publicar la ausencia con un estándar más débil que el usado para la presencia, en el mismo lote comparado, es exactamente lo que la Regla 0 pide evitar (asimetría de rigor, no de contenido).
- cita_de_contexto: "16-12-2021 Poder Ejecutivo veto total." — https://parlamento.gub.uy/documentosyleyes/ficha-asunto/148848/ficha_completa (control positivo); "24-10-2025 Poder Ejecutivo promulga." — https://parlamento.gub.uy/documentosyleyes/ficha-asunto/165490/ficha_completa (único caso de Orsi verificado con este método)
- accion_sugerida: Antes de publicar "Orsi no vetó nada" en cualquier forma (nota de cobertura, análisis, comparación con otro presidente), recorrer la lista completa de leyes promulgadas en `https://parlamento.gub.uy/documentosyleyes/leyes?LegislaturaSel=50` (paginada), tomar el número de asunto de cada fila y abrir `https://parlamento.gub.uy/documentosyleyes/ficha-asunto/<asunto>/ficha_completa` para cada una, revisando la sección "Sanciones" por la línea "Poder Ejecutivo veto parcial/total" en vez de "Poder Ejecutivo promulga". Es trabajo mecánico pero acotado (cubre todo lo promulgado desde el inicio de la Legislatura 50, que coincide con el inicio del mandato de Orsi). Si tras ese barrido sigue sin aparecer ningún veto, la afirmación negativa queda respaldada con el mismo nivel de evidencia que se exige para confirmar un veto positivo, y puede publicarse. Hasta entonces, sugiero que cualquier mención de "no vetó nada" en tier `publicado` o en una comparación visible del sitio lleve una nota explícita del método usado y su límite conocido (no exhaustivo por ficha de trámite), o baje a `probable`.

### notas.md — `procedimiento_constitucional` — artículos 137 a 141

- severidad: corregir
- tipo: contexto_omitido
- objecion: Verifiqué las cinco citas (arts. 137-141) directamente contra IMPO con `pnpm fuente` y son literales, sin errores de transcripción. La lectura general de cada artículo también es correcta. Dos matices que sí importan porque este apunte "va a gobernar cómo se clasifica el desenlace de todos los vetos del sitio":
  1. **Art. 137, "10 días hábiles perentorios"**: el texto de la Constitución dice "dentro del plazo perentorio de diez días", sin la palabra "hábiles". El investigador agregó "hábiles" sin citar de dónde sale esa lectura. Hay doctrina y comentaristas que efectivamente leen el plazo como días hábiles administrativos, pero no encontré una fuente citable (documento oficial o doctrina identificada) que lo diga con esas palabras; el PDF académico de MYSU sobre el veto ejecutivo, que sí revisé, no aborda la distinción hábil/corrido. Si se va a usar "hábiles" para calcular si un veto fue presentado en plazo, hace falta una fuente que lo respalde explícitamente, o sacar la palabra y dejar "diez días" a secas (que es lo único verificado).
  2. **Art. 140, "desaprobación del proyecto devuelto"**: notas.md lo lee como equivalente a que la Asamblea "apruebe las observaciones" (acepte la posición del Ejecutivo). Encontré un artículo académico reciente y específico sobre este punto —Gamarra Antes, "Sobre la potestad del Poder Ejecutivo de oponer objeciones o formular observaciones a proyectos de ley y las alternativas de respuesta de la Asamblea General en la Constitución uruguaya", Revista de la Facultad de Derecho Nº 59 (2025), UCU— que sostiene la tesis (compartida según el resumen por Cassinelli y Risso Ferrand bajo la redacción vigente desde 1996) de que el art. 140 regula una potestad de desaprobación **distinta y no sujeta a la mayoría especial del art. 138**: la Asamblea puede desaprobar el proyecto devuelto sin necesidad de los tres quintos, y eso es jurídicamente distinto de "aceptar las observaciones" (que hace que el proyecto se promulgue con los cambios del Ejecutivo). El esquema de `resultado.estado` del brief (`observaciones_aceptadas | veto_levantado | pendiente | sin_datos`) no tiene una categoría para "el proyecto cayó por desaprobación total y no se convirtió en ley de ninguna forma", que es justamente lo que describe el art. 140. Si algún veto real termina así, ninguno de los cuatro estados del esquema lo describe con precisión.
- cita_de_contexto: "Artículo 137 Si recibido un proyecto de ley, el Poder Ejecutivo tuviera objeciones que oponer u observaciones que hacer, lo devolverá con ellas a la Asamblea General, dentro del plazo perentorio de diez días." — https://www.impo.com.uy/bases/constitucion/1967-1967/137 (sin "hábiles"); "se propone interpretar que el artículo 138 refiere exclusivamente a un pronunciamiento sobre las objeciones y observaciones, y que la potestad de desaprobación se encuentra regulada en forma diferenciada en el artículo 140... para la desaprobación del proyecto de ley devuelto por el Poder Ejecutivo no resulta aplicable la mayoría especial consignada en el artículo 138" — https://revista.fder.edu.uy/index.php/rfd/article/view/924
- accion_sugerida: (1) sacar "hábiles" del apunte o sourcearlo explícitamente; (2) agregar una nota bajo `procedimiento_constitucional` que distinga el escenario del art. 140 del de "observaciones aceptadas", y avisar al editor que el esquema de `resultado.estado` puede necesitar un quinto valor (o una nota aparte) para cubrirlo si aparece en la práctica. También puede citarse el art. 168 inciso 6º ("Poner objeciones o hacer observaciones a los proyectos de ley que le remita el Poder Legislativo, y suspender u oponerse a su promulgación, en la forma prevista en la Sección VII" — https://www.impo.com.uy/bases/constitucion/1967-1967/168) como la norma que otorga la potestad, complementaria a los arts. 137-141 que regulan el procedimiento; no es un error omitirlo, pero completa el apunte.

### declaraciones[0] — 2025-10-16 — "No pensé en vetarla, no lo pienso hacer"

- severidad: corregir
- tipo: contexto_omitido
- objecion: La cita es literal (verificada contra la nota de Ámbito con `pnpm fuente --buscar`) y el `resumen` del registro es fiel a lo que dice el artículo. El problema no está en el registro sino en `notas.md`, sección `vetos_sin_desenlace`, que narra el episodio así: *"el 24/10/2025 un exdiputado (Carlos Iafigliola) le pidió por carta a Orsi que vetara la ley de eutanasia recién sancionada, y Orsi, consultado desde Roma, descartó hacerlo"*. Esa frase da a entender que la cita es la respuesta de Orsi al pedido de Iafigliola. No lo es: el artículo de Ámbito con la cita está fechado 2025-10-16, y el pedido de Iafigliola (confirmado en teledoce y Caras y Caretas) fue presentado el viernes 24/10/2025, el mismo día en que —según la ficha de trámite oficial— la ley ya se había promulgado ("24-10-2025 Poder Ejecutivo promulga."). Es decir: Orsi descartó vetar **ocho días antes** de que existiera el pedido formal de Iafigliola, en una consulta genérica de prensa sobre la ley recién sancionada por el Senado (15/10/2025), no como respuesta a Iafigliola. No hay ninguna fuente en el lote que muestre a Orsi respondiendo específicamente al pedido de Iafigliola.
- cita_de_contexto: "Consultado sobre la posibilidad de vetar la norma, Orsi fue categórico: 'No pensé en vetarla, no lo pienso hacer'." (Ámbito, 2025-10-16) — https://www.ambito.com/uruguay/yamandu-orsi-descarto-vetar-la-ley-eutanasia-y-considero-que-es-un-tema-complejisimo-n6202808 ; "El exdiputado del Partido Nacional Carlos Iafigliola presentó esta viernes una carta dirigida al presidente de la República, Yamandú Orsi, solicitando el veto a la ley de eutanasia" (Teledoce, 2025-10-24) — https://www.teledoce.com/telemundo/nacionales/personas-que-no-estan-en-situacion-terminal-van-a-pedir-que-se-les-quite-la-vida-iafigliola-pidio-a-orsi-vetar-ley-de-eutanasia/ ; "24-10-2025 Poder Ejecutivo promulga." — https://parlamento.gub.uy/documentosyleyes/ficha-asunto/165490/ficha_completa
- accion_sugerida: Corregir la cronología en `notas.md` antes de que el editor la use para escribir el `analisis`: son dos episodios separados (declaración genérica el 16/10, pedido de Iafigliola el 24/10, coincidente con la promulgación), no una respuesta directa. El registro `declaraciones.yaml[0]` en sí no necesita cambios de contenido, solo evitar que el `contexto` que redacte el editor los funda.

### declaraciones[0] — segunda fuente (`_faltante: segunda_fuente`)

- severidad: aviso
- tipo: un_solo_grupo
- objecion: Confirmo el hallazgo del investigador: la cita textual de Orsi solo aparece en Ámbito (grupo `grupo-ambito`). Abrí Teledoce (`cardoso`) y Caras y Caretas (`editora-caras-y-caretas`) —los dos únicos otros medios que cubrieron el episodio adyacente (pedido de Iafigliola)— y ninguno reproduce la frase de Orsi; ambos solo cubren el pedido de veto, no la respuesta. Es un `_faltante` correctamente marcado, no una fuente débil disfrazada de sólida.
- cita_de_contexto: N/A (ausencia confirmada en las dos notas revisadas)
- accion_sugerida: Antes de resolver el `_faltante`, revisar `https://www.gub.uy/presidencia/comunicacion/audios/completos/declaraciones-del-presidente-republica-yamandu-orsi-tras-su-visita` (audio de 15 minutos, Presidencia, 18/10/2025, declaraciones de Orsi al regreso del viaje a Italia) y los demás audios de Presidencia de esa gira ("Declaraciones a la prensa del presidente de la República, Yamandú Orsi" en gub.uy/presidencia). Si alguno de esos audios contiene la frase de la eutanasia con marca de tiempo, resolvería el problema por partida doble: sería `documento_oficial`/`video`, lo que sube el nivel a `textual` y hace innecesaria la segunda fuente de prensa.

### menciones.yaml — (vacío)

- severidad: aviso
- tipo: sin_objecion
- objecion: Ninguna. No hay ningún registro donde Orsi se refiera a un referente o a otro político sobre el tema vetos; el episodio de Iafigliola es al revés (Iafigliola habla de Orsi, no Orsi de Iafigliola), y Orsi no lo menciona en la fuente citada. Correcto dejarlo vacío.
- cita_de_contexto: N/A
- accion_sugerida: ninguna.

## Objeciones al lote

1. **La búsqueda de la afirmación negativa es la objeción central de este lote** (ver bloque de arriba). No es solo "podría haber buscado más": repliqué el método sobre un caso positivo confirmado de otro presidente y el método no lo encuentra. Eso no prueba que Orsi haya vetado algo; prueba que el lote todavía no puede afirmar con el mismo rigor que se le exigió al lote de Lacalle Pou que no lo hizo.
2. El investigador usó `WebFetch` (no `pnpm fuente`) para leer varias páginas que después usó como evidencia dentro de `notas.md` —la lista de leyes con `tipoRepartido=Observaciones` (que además, verifiqué, no filtra nada: devuelve la misma lista completa con o sin el parámetro, evidencia adicional de que esa vía estaba rota desde el principio), la ficha 155750, y el balance de gestión de uruguayaldia.com.uy. Están marcadas "no citar" en `consultas.jsonl`, así que no violan la letra de la regla de citas, pero sí se usaron para sostener conclusiones ("sin columna de veto", "sin mención de vetos") que terminaron en `notas.md`. Para una afirmación negativa que va a difundirse como hallazgo, esas lecturas deberían rehacerse con `pnpm fuente` para que quede constancia archivada y con Wayback, igual que el resto.
3. `uruguayaldia.com.uy` no está en `content/medios/`. Se leyó (por WebFetch, sin citar formalmente) pero no se declaró en `medios_faltantes` porque no terminó como `Fuente` de ningún registro. Si el editor termina usándolo en `analisis` o en `cobertura`, hace falta darlo de alta con su `grupo`.
4. El resto del apunte (`verificacion_manual`, `cobertura_del_periodo`, `hipotesis`, `objeciones_al_brief`, `casos_vistos`) está bien fundamentado y no encontré objeciones: la hipótesis sobre gobernar sin mayoría propia está correctamente marcada como no probada y no se coló como hecho en ningún registro.

## Objeciones al brief

Ninguna. El brief pide cobertura del mandato completo, con el mismo criterio para cualquier resultado, y pide explícitamente verificar el procedimiento constitucional en la fuente antes de clasificar nada, lo cual va en la dirección correcta (reduce el riesgo de que la afirmación negativa se apoye en una lectura de memoria). No encontré ningún pedido de selección, omisión o encuadre asimétrico por partido, ideología o persona. La objeción de fondo (punto 1 de arriba) es sobre la ejecución de la búsqueda, no sobre el brief.

## Simetría, con la vuelta de tuerca que pide la tarea

La comparación entre "Lacalle Pou vetó cuatro veces en 5 años" y "Orsi no vetó nada en 1.5 años" corre el riesgo de ser un artefacto de tres cosas distintas, no de una sola:

1. **Tiempo transcurrido, no solo tiempo total.** El primer veto de Lacalle Pou (ley forestal) fue el 16/12/2021, es decir, **~21 meses** después de asumir (01/03/2020). Orsi lleva **~18 meses** (asumió 01/03/2025, hoy 04/09/2026). Al mismo punto del calendario del mandato (18 meses), Lacalle Pou *tampoco* había vetado nada todavía. Mostrar "0 vetos" de Orsi contra "4 vetos" de Lacalle Pou sin esa referencia temporal deja al lector con la impresión de una diferencia de comportamiento cuando, hasta ahora, es sobre todo una diferencia de cuánto tiempo llevan gobernando. Cualquier comparación visible en el sitio debería mostrar el tiempo transcurrido de cada mandato junto al conteo, o directamente comparar "vetos en los primeros 18 meses" contra "vetos en los primeros 18 meses" del otro mandato.
2. **Rigor de la verificación, parejo para ambos signos del hallazgo.** Como se detalla arriba, el lote de Lacalle Pou confirmó sus cuatro vetos con `ficha_completa` (documento oficial, nivel textual). Este lote no hizo el mismo barrido para confirmar la ausencia. Aplicar el mismo método a los dos lotes (bloque "Objeciones por registro" de arriba) es condición para que la comparación sea honesta y no un artefacto de que a un hallazgo se le pidió más prueba que al otro.
3. **El mandato de Orsi sigue en curso.** A diferencia de Lacalle Pou (mandato cerrado), cualquier ficha o comparación publicada sobre Orsi con fecha de corte 2026-09-04 necesita quedar explícitamente marcada como parcial y "sujeta a actualización", no como un resultado final del mandato. Esto ya está bien señalado en `notas.md` (`cobertura_del_periodo`); solo hace falta que sobreviva hasta el contenido publicado y no se pierda en el resumen editorial.

No hay nada asimétrico en qué se buscó (se buscó lo mismo para ambos: todos los vetos del período completo); la asimetría posible está en cómo se comunicaría el resultado si se publica tal cual.

## Cobertura

```yaml
- medio: ambito
  url: https://www.ambito.com/uruguay/yamandu-orsi-descarto-vetar-la-ley-eutanasia-y-considero-que-es-un-tema-complejisimo-n6202808
  fecha: 2025-10-16
  evento: propuesto:ley-eutanasia-2025
  politico: orsi
  tono: neutral
  justificacion: >-
    La nota reporta la postura de Orsi de forma descriptiva ("Consultado sobre la posibilidad
    de vetar la norma, Orsi fue categórico: 'No pensé en vetarla, no lo pienso hacer'") sin
    evaluar su decisión.

- medio: teledoce
  url: https://www.teledoce.com/telemundo/nacionales/personas-que-no-estan-en-situacion-terminal-van-a-pedir-que-se-les-quite-la-vida-iafigliola-pidio-a-orsi-vetar-ley-de-eutanasia/
  fecha: 2025-10-24
  evento: propuesto:ley-eutanasia-2025
  politico: orsi
  tono: neutral
  justificacion: >-
    La nota es sobre el pedido de Iafigliola y reproduce sus argumentos extensamente; Orsi
    aparece solo como destinatario de la carta ("presentó esta viernes una carta dirigida al
    presidente de la República, Yamandú Orsi, solicitando el veto a la ley de eutanasia"), sin
    juicio de la redacción sobre su gestión del tema.

- medio: caras-y-caretas
  url: https://www.carasycaretas.com.uy/sociedad/iafigliola-pidio-orsi-vetar-ley-eutanasia-n89382
  fecha: 2025-10-26
  evento: propuesto:ley-eutanasia-2025
  politico: orsi
  tono: neutral
  justificacion: >-
    Misma cobertura factual del pedido de Iafigliola ("solicitando el veto a la ley de
    eutanasia"), sin caracterizar la posición de Orsi.

- medio: ambito
  url: https://www.ambito.com/uruguay/historicamente-se-resolvio-asi-yamandu-orsi-evito-la-polemica-la-aprobacion-la-rendicion-cuentas-n6158504
  fecha: 2025-06-19
  evento: propuesto:rendicion-cuentas-2025
  politico: orsi
  tono: neutral
  justificacion: >-
    Reporta la respuesta de Orsi a la polémica por los votos de Cabildo Abierto ("mostrar una
    línea que se continúa en el Uruguay") de forma descriptiva, sin calificarla de acierto o
    error.

- medio: uruguayaldia
  url: https://uruguayaldia.com.uy/el-primer-ano-y-medio-de-gestion-de-yamandu-orsi-bajo-la-lupa/
  fecha: 2026-08-30
  evento: propuesto:balance-18-meses-gestion-orsi
  politico: orsi
  tono: desfavorable
  justificacion: >-
    Editorial de balance que caracteriza la gestión como "un espectáculo lúgubre de
    improvisación, tibieza y subordinación" y afirma que el gobierno "ha demostrado una
    incapacidad estructural para ejercer la magistratura nacional con la firmeza, la claridad
    y el coraje que el país exige". Nota: `uruguayaldia.com.uy` (medio `uruguayaldia`) no
    figura todavía en `content/medios/`; falta darlo de alta con su `grupo` antes de usar este
    registro.
```
