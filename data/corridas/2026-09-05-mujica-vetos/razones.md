# Razones de edición · corrida 2026-09-05-mujica-vetos

Sin `critica.md`: este lote no pasó por el crítico (lote chico, hallazgo de ausencia).
Hice yo la lectura crítica al calificar. No hubo objeciones `bloquea` ni `corregir` de
un tercero que resolver; las decisiones abajo son propias.

## Cambios no triviales sobre el crudo

- **Medio nuevo `content/medios/cooperativa-cl.yaml`.** El inbox citaba `cooperativa.cl`
  (radio chilena) con `medio: cooperativa-cl`, slug que no existía en `content/medios/`;
  sin él, la etapa de referencias del validador falla. Leí
  `https://es.wikipedia.org/wiki/Radio_Cooperativa_(Chile)` con `pnpm fuente` en esta
  sesión y armé la ficha con lo que hay: propiedad (Compañía Chilena de Comunicaciones,
  desde 1939) y un dato de alineamiento histórico real pero que no mapea a ninguna
  etiqueta de este sitio (vínculo con el Partido Demócrata Cristiano *chileno*, no con
  un partido tradicional uruguayo ni con el Frente Amplio). Puse `alineamiento.etiqueta:
  sin_datos` en vez de forzarlo a `oficialista_tradicional` o `progresista`: esas
  etiquetas se definen en este esquema con referencia explícita a partidos uruguayos, y
  usarlas para un partido chileno habría sido una adivinanza, no una lectura de la
  fuente. `grupo: compania-chilena-de-comunicaciones` es deliberadamente distinto de
  cualquier grupo uruguayo, así que este medio nunca puede aportar la "segunda fuente"
  de un registro con una fuente uruguaya y viceversa — es la lectura correcta de la
  regla de dos grupos, no una casualidad de nombres.

- **Promesa de 2009 sobre no vetar la ley de aborto → `estado: cumplida`.** Verifiqué
  con `pnpm fuente` la ficha de Parlamento del asunto 107885: el Poder Ejecutivo
  promulgó la Ley 18.987 el 22-10-2012 sin observaciones ("Poder Ejecutivo promulga.",
  sin veto total ni parcial), y el barrido de vetos de esta misma corrida no encontró
  ningún veto de Mujica en todo el mandato. La promesa era condicional y concreta
  (no vetar si el Parlamento aprobaba una ley de despenalización/legalización), se
  cumplió tal como fue formulada, el mandato ya terminó, y no hay evidencia de efecto
  mixto que pesar: es uno de los pocos casos que se cierra limpio con documento
  oficial. Fundamentación y evidencia quedaron acotadas exactamente a esto — no
  agregué nada sobre el contraste con otros presidentes (ver más abajo).

- **Tier `probable` en las dos declaraciones y en la promesa**, no `publicado`: las
  tres tienen `evidencia`/`origen` de nivel `reportado` con una sola fuente (El País
  para 2009 y la promesa; Cooperativa.cl para 2011), y `--red` confirma que sigue
  siendo un solo grupo de medios en los tres casos (avisos `tiers`). El investigador
  ya había documentado en `consultas.jsonl` una búsqueda activa de segunda fuente para
  ambas citas, sin éxito; lo resumí en `notas_internas` de cada registro para que quede
  visible qué falta. Aplico el mismo umbral que le aplicaría a cualquier otro
  político con una sola fuente reportada: no subo a `publicado` solo porque el
  contenido (una promesa cumplida, prolija) sea atractivo de publicar completo.

- **No armé un giro entre la declaración de 2009 (aborto) y la de 2011 (Ley de
  Caducidad).** Son dos objetos distintos — dos proyectos de ley diferentes — aunque
  ambas expresen la misma posición general sobre el uso del veto. La regla de "mismo
  objeto" para calificar un giro no se cumple, así que quedan como dos declaraciones
  separadas (ver `giros.yaml`, vacío con la explicación). Son además consistentes
  entre sí y con la ausencia de vetos, lo cual es información, pero no alcanza para
  un registro de giro con este esquema.

- **No escribí la comparación entre Mujica (prometió no vetar y no vetó) y Vázquez
  (vetó en 2008 un proyecto sobre la misma materia) en ningún `analisis` ni
  `fundamentacion`.** El contraste es real y verificable, pero cada registro habla de
  su propio político; una comparación entre personas necesita su propio registro con
  su propia evidencia (el veto de Vázquez de 2008 no se investigó en esta corrida). Lo
  dejo anotado acá para quien decida abrir esa comparación como un registro propio en
  el futuro, con evidencia de ambos lados levantada expresamente para eso.

- **Decisión sobre la profundidad de lectura de los Diarios de Sesión (66 sumarios vs.
  66 PDF completos).** El investigador dejó abierta la duda de si hace falta abrir los
  66 PDF completos de Asamblea General del mandato de Mujica, en vez de buscar
  "observ"/"veto" solo en el sumario del índice, para igualar el estándar usado con
  Batlle (78 PDF completos). Decido que no hace falta: el control positivo sobre la
  Legislatura 45 encontró las 12 coincidencias conocidas exactamente al nivel de
  sumario del índice — el mismo nivel de lectura que se usó para Mujica —, lo que
  muestra que un veto tratado en sesión sí queda reflejado en el sumario y que el
  método no es insensible por diseño. Pedir además la apertura de los 66 PDF
  completos sería exigir un costo adicional sin que el control positivo dé ninguna
  señal de que cambiaría el resultado. Esto no es tratar a Mujica con menos rigor que
  a Batlle: es el mismo método (diarios de sesión completos del mandato, sin
  selección de qué sesiones mirar) validado con el mismo control positivo.

## Cambios de forma

- Ninguno de mi parte. Las dos citas que habían quedado con caracteres rotos por un
  problema de codificación (extracción de una nota de El País archivada en Wayback)
  ya estaban corregidas cuando llegué. Volví a leer ambas fuentes con `pnpm fuente`
  en esta sesión (El País vía Wayback y Cooperativa.cl) y confirmé que el texto que
  devuelve la herramienta hoy coincide, carácter por carácter, con la `cita` que
  está en `declaraciones.yaml` y `promesas.yaml`, sin ningún `�`. `pnpm validar --red`
  confirma además coincidencia "exacta (1.00)" en las 3 citas del lote. No hubo
  erratas de fecha ni de forma para corregir en este lote.
