# Crítica — corrida 2026-09-09-casos-barrido-1

Modelo: Opus 5 (id exacto `claude-opus-5[1m]`). Corre en Opus, que es lo que la regla 14 de
CLAUDE.md manda para el crítico; no hay diferencia que reportar contra la tabla de modelos.
Lote: `inbox/casos-barrido-1/todos/` (lotes a, b y c fusionados)
Registros revisados: 15 (13 en `casos.yaml`, 2 en `declaraciones.yaml`)
Fuentes releídas con `pnpm fuente` en esta sesión: 35 notas de prensa y 4 documentos primarios (tres
diarios de sesiones y una ficha de asunto del Parlamento). Cada una de las 35 notas tiene su registro
de tono en la sección «Cobertura».

**Cuenta rápida para el editor: 67 objeciones — 15 `bloquea`, 44 `corregir`, 8 `aviso`.** De las
quince que bloquean, doce son de evidencia por registro (una cita entrecomillada que no está en ninguna fuente, un
hito cuya única fuente no nombra a la persona, una etapa que la fuente contradice) y tres son de lote
(el barrido no fue igual para las 25 personas, el mismo umbral dio resultados distintos en dos pares
comparables, y la misma resolución parlamentaria recibió tres etapas distintas). Doce de los trece casos
necesitan cambio de `rol`; la tabla está en «Objeciones al lote», punto 3. También escribí
`discrepancias.yaml` en esta misma carpeta, con dos entradas y con la lista de los siete casos que
consideré y no registré por falta de documento primario.

Nota de método, porque condiciona todo lo que sigue: no juzgo por memoria. Cada objeción de abajo
sale de haber vuelto a abrir la fuente citada y leer el párrafo. Donde no pude abrir el documento
que decidiría, lo digo y la objeción baja de severidad.

---

## Objeciones por registro

### casos[0] — Denuncias por el audio filtrado entre Beatriz Argimón y Fernando Cristino (2020)

- severidad: **corregir**
- tipo: contexto_omitido, riesgo_legal, un_solo_grupo, presentacion
- rol a cambiar: **`mencionado` → `denunciado`.** Argimón es el blanco directo de dos denuncias
  presentadas: la del Frente Amplio ante la Fiscalía General de la Nación, que pide investigar
  "diferentes delitos que involucrarían a la vicepresidenta", y la de Cristino, que "está referida a
  la vicepresidenta". Nunca fue formalizada ni indagada, que es exactamente el supuesto del nuevo
  valor. `mencionado` la deja como si apareciera de costado en un caso ajeno, y no es así.

1. **contexto_omitido (corregir).** La nota de El Observador cierra con el dato que más cambia la
   lectura del episodio y que el registro no recoge: los senadores del oficialismo dieron el tema
   por cerrado después de escuchar a Argimón.
   - cita_de_contexto: "La decisión del Frente Amplio de presentar el caso a la Fiscalía General de
     la Nación se tomó luego de una reunión entre la vicepresidenta y los senadores de todos los
     partidos. Si bien los legisladores oficialistas dieron por laudado el tema después de escuchar
     los argumentos de la vicepresident…"
     (https://www.elobservador.com.uy/nota/frente-amplio-presento-denuncia-en-fiscalia-ante-gravedad-de-conversacion-entre-argimon-y-cristino-202062419337)
   - Y en la diaria, la matización del propio denunciante político: "no quiere decir que la
     vicepresidenta sea culpable de nada, pero hay que investigar y aclarar el hecho, porque su
     declaración no lo hace" (Bonomi)
     (https://ladiaria.com.uy/politica/articulo/2020/6/senadores-del-fa-presentan-este-miercoles-denuncia-penal-por-audio-de-argimon-con-cristino/).
   - accion_sugerida: sumar las dos frases al `resumen`, atribuidas. Sin ellas el registro cuenta la
     acusación y no la reacción, que es media historia.

2. **riesgo_legal (corregir).** El `resumen` afirma que "el mismo día, según la diaria, el abogado
   Gustavo Salle presentó otra denuncia penal por el mismo episodio". La nota de la diaria está
   fechada el 23 de junio en su propio cuerpo ("23 de junio de 2020") y la frase queda cortada por
   el muro de pago: "Quien sí asegura que la vicepresidenta cometió ilícitos es el abogado y ex
   candidato del Partido Verde Animalista Gustavo Salle, que presentó una denuncia penal este…".
   La fecha ("el mismo día", 24 de junio) no está en la fuente, y Salle es una de las 25 personas
   con ficha: atribuirle una denuncia con fecha que la fuente no da no puede publicarse así.
   - accion_sugerida: o se busca la fuente que fecha la denuncia de Salle y entra como hito propio,
     o se escribe "según la diaria, el abogado Gustavo Salle presentó otra denuncia penal por el
     mismo episodio en esos días", sin fecha.

3. **un_solo_grupo (aviso, no bloquea).** El hito de 2020-06-22 tiene una sola fuente
   (`subrayado`, grupo fontaina-de-feo) y `_faltante: segunda_fuente`. Busqué la segunda en el
   corpus (`pnpm corpus:buscar "Cristino Argimon denuncia amenazas fiscalia" --desde 2020-06-01
   --hasta 2020-12-31`) y devuelve exactamente esa nota y ninguna más. **No la encontré**: el hito
   queda en `probable` con razón. Además, la propia Subrayado marca que el dato es suyo y no de la
   Fiscalía ("Según información en poder de Subrayado"), lo que es una razón adicional para no
   subirlo.
   - accion_sugerida: el resolvedor debería probar `pnpm descubrir el-pais --desde 2020-06 --terminos
     Cristino,Argimón` y `pnpm descubrir montevideo-portal` para el 22 y 23 de junio de 2020.

4. **presentacion (corregir).** El `resumen` (162 palabras) termina con "No se halló registro
   público de que la Fiscalía haya imputado, indagado o formalizado a Argimón por este episodio, ni
   de que las denuncias hayan sido resueltas". Eso es correcto y hay que decirlo, pero escrito así
   cuenta la búsqueda y no el hecho. En texto para el lector va: "No hay resolución pública conocida
   de ninguna de las dos denuncias; Argimón no fue indagada ni formalizada".

---

### casos[1] — Denuncia ante la JUTEP por el pase en comisión de la hermana de Beatriz Argimón

- severidad: **bloquea** (por el hito 1; el hito 2 está bien)
- tipo: cita_fuera_de_contexto, riesgo_legal, contexto_omitido, documento_previsible
- rol a cambiar: **`mencionado` → `denunciado`.** La fuente dice literalmente "La Junta de
  Transparencia y Ética Pública (Jutep) archivó la denuncia contra la vicepresidenta Beatriz
  Argimón". Es el blanco directo de una denuncia que no llegó a nada; ese es el valor nuevo.

1. **cita_fuera_de_contexto + riesgo_legal (bloquea).** El hito de 2020-08-03 (`etapa:
   investigacion`) dice que la Jutep "tiene pendiente de resolución, entre unas quince denuncias, la
   situación de la vicepresidenta". La nota dice otra cosa: las quince denuncias son una lista, y el
   caso de Argimón aparece como una decisión distinta, la de si el organismo **actuaría de oficio**.
   - cita_de_contexto: "El organismo tiene alrededor de 15 denuncias a las que deberá dar respuesta
     acerca de la ética de funcionarios públicos, entre las que se incluye la que presentó a fines
     de abril la Vertiente Artiguista contra Gerardo Sotelo […] También deberá decidir si se actuará
     de oficio en situaciones como la de la vicepresidenta de la República, Beatriz Argimón"
     (https://www.elobservador.com.uy/nota/polemica-en-la-ursec-inac-y-la-hermana-de-argimon-algunos-temas-pendientes-que-debera-tratar-la-jutep-20207301990).
   - Además, `etapa: investigacion` afirma que había una investigación abierta el 3 de agosto, y la
     nota dice que todavía no se había decidido si se abriría. Un caso que empieza con una etapa que
     la fuente no sostiene no puede publicarse.
   - accion_sugerida: reescribir el hito como `etapa: denuncia` con la descripción que la nota
     sostiene ("la Jutep debe decidir si actúa de oficio por la designación de la hermana de la
     vicepresidenta como asesora en su despacho del Senado"), o eliminarlo y dejar el caso con el
     archivo del 10 de agosto, que sí está probado y menciona la denuncia previa.

2. **documento_previsible (corregir).** La propia nota de la diaria dice dónde está el documento:
   "En el sitio web de la Jutep aparece un solo pronunciamiento del directorio actual, fechado el 10
   de agosto de este año y titulado 'Respuesta a trascendidos de prensa', donde el organismo hace
   una enumeración de algunos temas que están a estudio, otros que se archivaron"
   (https://ladiaria.com.uy/politica/articulo/2020/11/ex-presidente-de-la-jutep-cuestiona-al-actual-directorio-del-organismo-no-ha-tenido-una-actitud-proactiva/).
   El caso entero está en `reportado` cuando existe la resolución firmada por los tres integrantes
   del directorio, que lo llevaría a `textual` y resolvería de paso el `_faltante` del hito 1.
   - accion_sugerida: `pnpm inventario jutep.gub.uy --desde 2020 --hasta 2021` y buscar el
     pronunciamiento del 10/08/2020 "Respuesta a trascendidos de prensa"; el lote no lo corrió (en
     `consultas.jsonl` no hay ninguna consulta a `jutep.gub.uy`, solo `corpus:buscar --medio jutep`).

3. **contexto_omitido (corregir).** El `resumen` no recoge ni la explicación de Argimón ni el dato
   que la sostiene, y sí recoge las "dudas" de Gil Iribarne. Eso es asimétrico dentro del propio
   registro.
   - cita_de_contexto: "La hermana de la vicepresidenta es funcionaria de carrera del Banco República
     –al que accedió por concurso– […] 'Quiero hacer una optimización del trabajo y organizar mi
     secretaría en base a resultados. Hablé con ella porque tiene muchísima experiencia en eso y
     creí que era la indicada para hacerlo', dijo la vicepresidenta"
     (https://www.elobservador.com.uy/nota/jutep-archiva-la-denuncia-por-la-contratacion-de-la-hermana-de-la-vicepresidenta-beatriz-argimon-202081014411).
   - accion_sugerida: una oración con la explicación de Argimón, entrecomillada, en el `resumen`.

---

### casos[2] — Comisión Investigadora sobre el sistema financiero y la capitalización del Banco Comercial (crisis de 2002)

- severidad: **bloquea**
- tipo: cita_fuera_de_contexto, explicacion_alternativa, contexto_omitido, presentacion
- rol a cambiar: **`mencionado` → `denunciado`.** Batlle fue el blanco directo de una moción formal
  que pedía que la Cámara declarara su responsabilidad y remitiera lo actuado a la Justicia Penal.
  No llegó a formalización (ni siquiera a indagatoria). `mencionado` lo pinta como un nombre suelto
  en una investigación sobre bancos; el acta dice que la moción era sobre él.

1. **cita_fuera_de_contexto (bloquea).** El hito de `archivo` de 2004-04-01 describe la resolución
   aprobada como "una resolución de alcance general que remite a la Justicia los antecedentes de la
   Comisión Investigadora para determinar si hubo hechos delictivos, sin individualizar responsables,
   e insta al Banco Central y al Poder Ejecutivo a determinar responsabilidades técnico
   administrativas". **Eso es el texto de un proyecto que la Cámara rechazó**, no el que aprobó. Leí
   el diario de sesiones entero en ese tramo: hubo cuatro proyectos y una moción final.
   - El proyecto del Partido Nacional, que sí decía "Disponer el envío a la justicia penal del
     conjunto de los antecedentes y actuaciones […] con el fin de determinar si existieron hechos de
     carácter delictivo" e "Instar al Poder Ejecutivo y al Banco Central del Uruguay a proceder a
     determinar las responsabilidades y los errores de carácter técnico administrativo", fue votado
     y perdió: "Catorce en ochenta y uno: NEGATIVA."
   - cita_de_contexto (lo que sí se aprobó, 56 en 84): "la Cámara de Representantes declara: 1. Que
     las autoridades de la época del Ministerio de Economía y Finanzas son políticamente responsables
     de los errores cometidos en la estrategia frente a la crisis del sistema financiero.- 2. Que el
     Directorio del Banco Central del Uruguay y la Presidencia de la Institución […] han incurrido en
     responsabilidad administrativa […] Resuelve: 1. Remitir las actuaciones y antecedentes de esta
     Comisión Investigadora a la Justicia.- 2. Exhortar al Poder Ejecutivo la preparación de
     iniciativas referidas a…"
     (https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2004-04-01%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0012).pdf, carácter ~133.700)
   - Y la palabra "delictivos" no aparece ni una vez en las 162.087 caracteres del diario (lo
     verifiqué con `--buscar "delictivos"`: "sin coincidencias en esta nota").
   - accion_sugerida: reescribir el hito con el texto real de la moción aprobada y sumar esa cita.

2. **cita_fuera_de_contexto (bloquea).** La `etapa: archivo` es directamente el revés de lo que pasó:
   la Cámara resolvió **remitir las actuaciones a la Justicia**. Con `archivo` como última etapa, el
   validador deriva `etiqueta_legal: cerrado_sin_condena`, es decir, el sitio le dice al lector que
   el asunto terminó sin condena, cuando lo que consta es que el Parlamento lo mandó a la Justicia y
   el lote no averiguó qué hizo la Justicia con eso.
   - accion_sugerida: `etapa: investigacion` (etiqueta `denuncia`), y `revision.que_falta` diciendo
     que no se buscó el destino de los antecedentes remitidos a la Justicia en 2004. Un caso sin
     desenlace documentado puede vivir en `probable`; no puede publicarse con un desenlace inventado.

3. **cita_fuera_de_contexto (corregir).** El hito 1 (2002-10-08, `etapa: investigacion`) trae como
   única cita la lista de integrantes de la comisión. La cita prueba quiénes la integraban, no que la
   comisión estuviera "encargada de analizar la actuación del BCU y el MEF y las responsabilidades
   derivadas del contrato de capitalización del Banco Comercial". El objeto de la comisión está en el
   repartido 1070 ("DIVERSAS ACTUACIONES RELACIONADAS CON EL SISTEMA FINANCIERO Y BANCARIO.
   Designación de una Comisión Investigadora. Informe."), que aparece en la misma ficha de asunto y
   no se citó.
   - accion_sugerida: agregar esa segunda cita de la ficha 20426, o describir el hito por lo que la
     cita sostiene. Y decir en la descripción que la comisión investigaba el sistema financiero, no a
     Batlle: el registro debe dejar clara la diferencia.

4. **explicacion_alternativa (corregir, y es la que más falta).** Las razones por las que la Cámara
   rechazó la moción están en el mismo acta y el registro no las trae.
   - cita_de_contexto: "he votado en forma negativa la moción presentada por los señores legisladores
     del Encuentro Progresista-Frente Amplio en virtud de que todas las decisiones de las autoridades
     económicas fueron adoptadas siempre dentro del marco de la Constitución y de la ley, contando
     con informes favorables de las reparticiones jurídicas de los respectivos organismos y con
     informes de catedráticos de Derecho Constitucional. El Tribunal de Cuentas emitió dictámenes que
     avalan todos los gastos realizados, en virtud de lo cual las razones expresadas para plantear
     esta moción carecen de fundamento jurídico y fáctico." (diputado Gabriel Pais, misma sesión)
   - accion_sugerida: sumar el fundamento de voto negativo, entrecomillado y atribuido. Un caso que
     solo transcribe la acusación es un caso a medias.

5. **presentacion (corregir).** La descripción del hito de cierre incluye "Ninguna fuente posterior
   registra que Batlle haya sido indagado o imputado por este episodio". La `descripcion` de un hito
   es "qué resolvió quién, en una oración" y la página la imprime en la línea de tiempo: una frase
   sobre lo que la búsqueda no encontró va a `revision.que_falta`, no ahí.

---

### casos[3] — Juicio político a la intendenta Carolina Cosse (2022-2023)

- severidad: **corregir**
- tipo: cita_fuera_de_contexto, contexto_omitido
- rol a cambiar: **`mencionado` → `denunciado`.** El enum nombra el juicio político de forma
  explícita como supuesto de `denunciado`, y la resolución de la Junta Departamental "solicita el
  juicio político a la intendenta". Es el caso más claro del lote.

1. **cita_fuera_de_contexto (corregir).** La `etapa: absolucion` del 2023-07-11: **corresponde
   `archivo`.** Tres razones, y la tercera es la que decide.
   - La resolución no absuelve de nada: dice "declarar que no se ha encontrado mérito para proceder a
     la separación de su cargo". Y en la misma sesión el propio Senado explica qué acaba de hacer:
     "Lo que la comisión propone a esta cámara implica […] reconocer –se dice claramente en el
     informe– que no hay mérito en la denuncia para proceder a separar del cargo a la intendenta. Es
     decir, no hay mérito para realizar juicio político, que su promoción no tenía mérito."
     (https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescss/2023-07-11%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20SENADORES%20(0023).pdf)
     No hubo juicio: se resolvió que no había mérito para hacerlo. Eso es un cierre sin trámite, no
     una absolución tras juicio.
   - `absolucion` es la palabra del proceso penal y el lector la va a leer así. Sobrestima a favor de
     Cosse, y la Regla 0 obliga a no inclinar la balanza en ninguna dirección.
   - **La razón de peso es la simetría interna del lote**: el mismo acto parlamentario recibe tres
     etapas distintas según de quién se trate. La resolución del Senado sobre Cosse es `absolucion`,
     el rechazo del desafuero de Manini Ríos es `investigacion`, y el rechazo del desafuero de Nin
     Novoa es `archivo`. Tres etapas para "la cámara resolvió no dar lugar" es exactamente lo que la
     Regla 0 prohíbe. La regla que propongo, igual para los tres: la resolución de la cámara que
     cierra el trámite parlamentario es `archivo`; si la causa judicial sigue viva después (Manini
     Ríos), el hito es `investigacion` y hay que decir por qué en la descripción.
   - accion_sugerida: `etapa: archivo` (la `etiqueta_legal: cerrado_sin_condena` no cambia).

2. **contexto_omitido (corregir).** El `resumen` afirma que el planteo fue "que la intendenta habría
   violado la Constitución al no responder sistemáticamente pedidos de informes de la oposición".
   Ninguna de las dos citas del registro dice eso. Y falta el dato que aparece en la sesión y que es
   el que convierte 22 en 23 en un número informativo: la resolución salió "votada por unanimidad por
   la comisión asesora" y un senador (Gandini) anunció voto distinto en sala.
   - accion_sugerida: agregar la cita del fundamento del juicio político (está en el informe de
     comisión del mismo diario) o sacar esa afirmación del `resumen`; y sumar la unanimidad en
     comisión.

3. **sin_objecion** en el resto: las dos citas existen literalmente en el diario de sesiones, la
   secuencia es ascendente y el nivel `textual` está bien asignado.

---

### casos[4] — Investigación penal por la construcción del Antel Arena

- severidad: **bloquea**
- tipo: riesgo_legal, cita_fuera_de_contexto, contexto_omitido, un_solo_grupo, documento_previsible
- rol a cambiar: **`imputado` → `denunciado`.** Cosse nunca fue formalizada: declaró como indagada y
  la causa terminó archivada dos veces. `imputado` le atribuye una condición procesal que no tuvo, y
  ese es el error de rol de mayor riesgo legal del lote.

1. **riesgo_legal (bloquea).** El hito fundacional (2021-06-02) tiene una sola fuente, y esa fuente
   **no nombra a Cosse ni una vez**. Lo verifiqué: `--buscar "Cosse"` sobre la nota devuelve
   "[Cosse] sin coincidencias en esta nota". El hito, sin embargo, dice "durante la gestión de la
   presidenta Carolina Cosse". Un caso cuyo primer hito atribuye a una persona un hecho que su única
   fuente no le atribuye no puede publicarse.
   - accion_sugerida: usar como fuente del hito una nota que sí la nombre (Subrayado 2022-02-15 lo
     hace: "La denuncia penal fue presentada por el actual directorio de ANTEL y es contra la gestión
     de las anteriores autoridades"), o quitar la atribución del hito.

2. **cita_fuera_de_contexto (bloquea).** La `etapa: denuncia` del 2021-06-02 no describe una
   denuncia: describe el **anuncio** de que se iba a presentar una.
   - cita_de_contexto: "El vicepresidente de Antel, Robert Bouvier, anunció este miércoles en
     conferencia de prensa que el ente realizará 'la denuncia penal correspondiente'"
     (https://www.elobservador.com.uy/nota/antel-realizara-una-denuncia-penal-tras-auditoria-por-antel-arena--202162181634).
     Futuro, no pasado.
   - Que la denuncia efectivamente se presentó está probado en otras dos fuentes del propio lote, de
     dos grupos distintos: "el actual directorio de Antel, representado por el abogado penalista
     Gustavo Bordes, presentó en Fiscalía una denuncia sobre irregularidades" (Montevideo Portal,
     2022-07-28) y "La denuncia penal fue presentada por el actual directorio de ANTEL" (Subrayado,
     2022-02-15). Lo que ninguna de las tres da es **la fecha de presentación**.
   - accion_sugerida: reemplazar el hito por uno de `denuncia` con la fecha real, buscada
     (`pnpm descubrir el-observador --desde 2021-06 --terminos "Antel Arena,denuncia penal"`), o
     dejarlo como está pero con `etapa: denuncia` fechada el día de la presentación probada. Mientras
     no aparezca la fecha, el hito de 2021-06-02 sirve como contexto en el `resumen`, no como hito.

3. **riesgo_legal (bloquea).** El hito de 2024-02-22 pone entre comillas dos frases atribuidas al
   fiscal Machado —"desprolijidades" y "manejo dispendioso de los recursos públicos"— y **ninguna de
   las dos fuentes citadas para ese hito las contiene**. Lo verifiqué en las dos: El Observador
   (2024-02-22) → "[desprolijidades] sin coincidencias"; Caras y Caretas (2024-12-21) →
   "[desprolijidades] sin coincidencias en esta nota. [dispendioso] sin coincidencias en esta nota."
   - Las frases sí existen, pero en otra nota, que el registro cita para otro hito: "el fiscal de
     Delitos Económicos Alejandro Machado archivó el caso en primera instancia al entender que no
     hubo delito, aunque si constató 'desprolijidades' y un 'manejo dispendioso de los recursos
     públicos' en el proceso de construcción"
     (https://www.elobservador.com.uy/nacional/fiscalia-volvio-archivar-investigacion-el-antel-arena-n5984909).
   - accion_sugerida: agregar esa fuente al hito de 2024-02-22. Es un arreglo de dos líneas, pero
     hasta que se haga el registro entrecomilla a un fiscal sin fuente.

4. **riesgo_legal + cita_fuera_de_contexto (bloquea).** La segunda fuente del hito de 2024-04-05
   (habilitación del reexamen) es Caras y Caretas, y la cita elegida no habla del reexamen: habla de
   una orden presidencial. "Una vez que el presidente Luis Lacalle Pou le indicó a Gabriel Gurméndez,
   expresidente del ente autónomo de las Telecomunicaciones, que solicitara el reexamen de la causa
   Antel Arena". Eso es (a) una afirmación de un solo medio sobre una persona que no figura en
   `involucrados[]`, y (b) una cita que no respalda el hecho del hito. Es el patrón de la segunda
   fuente falsa: le da al hito un segundo grupo que para ese hecho no tiene.
   - cita_de_contexto que sí respalda el hito, en la misma nota que ya está citada como primera
     fuente: "Este viernes el juez Alejandro Asteggiante resolvió habilitar el reexamen de la causa".
     Y en la otra nota de El Observador: "El juez en lo penal de 38º turno, Alejandro Asteggiante,
     hizo lugar al planteo de Antel."
   - accion_sugerida: cambiar la cita de Caras y Caretas por una que hable del reexamen, o sustituir
     la fuente por El Observador 2025-02-13, que cubre el mismo hecho. La frase sobre Lacalle Pou, si
     se quiere conservar, es material de otro registro con su propia evidencia, no de este hito.

5. **contexto_omitido (corregir, y es la omisión más grande del lote).** El `resumen` presenta el
   sobrecosto como un hecho ("el costo final de la obra, muy superior al presupuesto original
   difundido […] por la entonces presidenta de ANTEL") y omite por completo lo que el fiscal
   Rodríguez concluyó sobre esa cifra, que está en una fuente que el registro ya cita:
   - cita_de_contexto: "Sobre el supusto sobrecosto, dijo que aunque para Ecovis costó US$ 120
     millones, el informe oficial que es el del Tribunal de Cuentas señaló que se gastaron US$
     85.995.517." Y: "'…el presupuesto del concurso de ideas era de US$ 40.000.000', que solo
     incluían a la 'obra civil', sin gran parte del equipamiento necesario […] existió una 'amplia
     coincidencia' entre los testimonios en que era 'muy difícil' hacer una estimación inicial del
     costo final"
     (https://www.elobservador.com.uy/nacional/fiscalia-volvio-archivar-investigacion-el-antel-arena-n5984909).
   - Falta también la objeción a la auditoría, que estaba en la fuente de Subrayado: "Desde el Frente
     Amplio se cuestionó esa auditoría por haber sido encargada a una empresa consultora dirigida por
     una persona vinculada al Partido Nacional […] con el rechazo del director en representación del
     Frente Amplio, denunciaron ante Fiscalía"
     (https://www.subrayado.com.uy/fiscal-citara-carolina-cosse-denuncia-irregularidades-construccion-del-antel-arena-n839001).
   - accion_sugerida: el `resumen` tiene que traer la cifra del Tribunal de Cuentas y el hecho de que
     la denuncia del directorio no fue unánime. Sin eso, el registro reproduce la acusación con más
     detalle que el descargo, que es lo que la Regla 0 no permite.

6. **cita_fuera_de_contexto (corregir).** La atribución "el presupuesto original difundido (entre USD
   40 y 45 millones) por la entonces presidenta de ANTEL, Carolina Cosse" mezcla dos cifras de dos
   notas (40 en El Observador, 45 en Subrayado) y le atribuye la difusión a Cosse sin cita. La única
   fuente del lote que hace esa atribución es Montevideo Portal: "un costo de 120 millones de
   dólares, tres veces mayor a lo comunicado en su momento por Cosse". Hay que citarla o quitar la
   atribución.

7. **cita_fuera_de_contexto (corregir).** El `resumen` cierra con "Cosse […] calificó el proceso como
   una 'operación política'". La frase es real —la verifiqué: "esta operación política intentó
   aleccionar a los funcionarios públicos y a la población de las cosas que pasan cuando se hacen
   cosas nuevas"
   (https://www.montevideo.com.uy/Noticias/-Vale-la-pena--la-reflexion-de-Cosse-tras-el-archivo-definitivo-de-la-causa-Antel-Arena-uc914931)—
   pero **ninguna `cita` del registro la contiene**: la cita de esa fuente es otra frase. Entrecomillar
   en el `resumen` algo que no está en ninguna cita del registro rompe la regla de que toda afirmación
   tiene fuente citable, aunque el hecho sea cierto.
   - accion_sugerida: sumar esa frase como cita de esa misma fuente.

8. **documento_previsible (corregir).** El caso entero es `reportado`. Existen y son previsibles: la
   auditoría de Ecovis (el propio El Observador enlaza "el segundo informe de auditoría completo"), el
   informe del Tribunal de Cuentas al Parlamento de 2019 con la cifra de US$ 85.995.517, y los dos
   dictámenes de archivo de Fiscalía (2024 y 2025). Con cualquiera de ellos el caso deja de depender
   de la prensa para las cifras que hoy son el corazón del `resumen`.
   - accion_sugerida: `pnpm inventario antel.com.uy --filtro "auditoria|ecovis"` y
     `pnpm inventario tcr.gub.uy --desde 2019`.

---

### casos[5] — Caso Manini Ríos (omisión de denuncia de la confesión de Gavazzo sobre Gomensoro)

- severidad: **corregir**
- tipo: riesgo_legal, contexto_omitido, explicacion_alternativa, cita_fuera_de_contexto, presentacion
- rol a cambiar: **`imputado` → `denunciado`.** El propio `resumen` lo dice: "Manini Ríos nunca fue
  formalizado ni imputado formalmente". La nota interna del lote b explica que eligió `imputado`
  porque el enum viejo no tenía un valor intermedio; hoy lo tiene y es exactamente este supuesto
  ("blanco directo de […] un pedido de desafuero que no llegó a formalización").

1. **riesgo_legal (corregir).** El `resumen` afirma en voz del sitio la conducta que se investigaba:
   "informó verbalmente de esa confesión al entonces ministro de Defensa Jorge Menéndez […] **pero no
   presentó la denuncia penal correspondiente ante la Justicia**". La causa terminó archivada por
   prescripción sin formalización, así que el sitio no puede afirmar el hecho típico: tiene que
   atribuirlo. Que el hecho no esté controvertido no cambia la regla.
   - accion_sugerida: "…y, según la Fiscalía, no presentó la denuncia penal ante la Justicia; Manini
     Ríos sostuvo que informar a su superior era lo que correspondía".

2. **contexto_omitido (corregir).** El argumento jurídico que ganó en el Senado no está en el
   registro, y es lo que explica el resultado de la votación.
   - cita_de_contexto: "El delito cometido por Gavazzo, confesado en los tribunales de honor, ya
     había sido juzgado. En ese sentido, había sido sobreseído en un juzgado de Paso de los Toros, a
     pedido de un fiscal, de manera que había cosa juzgada sobre ese delito […] el 19 de agosto de
     este año, ese tribunal ordena el archivo, es decir, desestima el pedido de reapertura del fiscal"
     (https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescss/2020-09-30%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20SENADORES%20(0033).pdf).
   - Falta también un dato de contexto que la Fiscalía y los medios dan y que el registro omite: la
     destitución de Manini Ríos como comandante en jefe en marzo de 2019 fue por otra causa. "ahí se
     destituye al entonces comandante en jefe Manini Ríos, pero no por una omisión o delito, sino por
     una nota en la que critica a la Justicia, es decir, por otra causa" (mismo diario).
   - accion_sugerida: dos oraciones en el `resumen`, atribuidas al debate del Senado.

3. **cita_fuera_de_contexto (corregir).** El hito de 2019-04-01 usa como prueba `textual` de un hecho
   de la Fiscalía la frase de un senador en un debate político: "Hay que recordar que la denuncia es
   recibida por la fiscalía el 1.º de abril del 2019, fecha en la cual el hoy senador Manini aún no
   había manifestado públicamente su intención de ser candidato". El diario de sesiones es registro
   primario de **lo que se dijo**, no de lo que la Fiscalía recibió, y esa frase forma parte de un
   argumento sobre la oportunidad política del caso.
   - accion_sugerida: mantener el hito pero describirlo como "según se afirmó en el Senado, la
     Fiscalía recibió la denuncia el 1 de abril de 2019", o sustituir por una fuente de Fiscalía o de
     prensa que fecha la denuncia.

4. **cita_fuera_de_contexto (corregir).** El hito de 2019-11-01 describe como hecho que el fiscal
   "resolvió el 24 o 25 de setiembre de 2019 archivar la investigación sobre el resto de los
   generales". "El 24 o 25" es una duda del investigador escrita en un campo que la página imprime, y
   ninguna cita del registro fecha ese archivo. El diario de sesiones da otra fecha para otro acto:
   "El 24 de setiembre de 2019 […] el fiscal Morosoli Díaz actúa […] y solicita la formalización".
   - accion_sugerida: sacar la fecha dudosa de la `descripcion`, o fecharla con fuente.

5. **contexto_omitido / desacuerdo entre medios (aviso).** El registro llama a la fiscal "María
   Nogueira" en el hito de 2025-07-21 y "Lucía Nogueira" en el de 2025-08-29. Las dos formas vienen de
   medios distintos (Montevideo Portal y Caras y Caretas dicen María, atribuyendo a MVD Noticias; El
   Observador dice Lucía, de Flagrancia de 13.º turno). No lo registré como discrepancia porque el
   documento que decide —el comunicado de la Fiscalía General de la Nación del 29/8/2025— no lo abrí.
   - accion_sugerida: pedir el comunicado (`pnpm inventario fiscalia.gub.uy --desde 2025`) y unificar,
     o decir en el registro que los medios difieren.

6. **presentacion (corregir).** `resumen` de 223 palabras y la imprecisión "ya con Manini Ríos como
   senador electo por Cabildo Abierto" el 30/9/2020: para esa fecha era senador en ejercicio (asumió
   el 15/2/2020, como el propio registro dice más abajo). Corregir a "senador en ejercicio".

7. **accion_sugerida de oportunidad (aviso), no objeción.** El diario de sesiones del 30/9/2020 trae
   la votación **nominal completa**, con el voto de los 31 senadores uno por uno y la presidencia. Es
   material listo para un registro de `content/votaciones/senadores/2020-09-30-desafuero-manini-rios.yaml`
   con la sala entera y `fuente_del_voto: nominal`, que es justo lo que la colección de votaciones
   pide y todavía no tiene ninguna corrida real. La página lo dibuja con `Hemiciclo.astro` y el lector
   ve quién votó qué. Este lote lo tuvo delante y no lo levantó.

---

### casos[6] — Caso Nin Novoa (omisión en declaración jurada de una sociedad rural)

- severidad: **bloquea**
- tipo: riesgo_legal, cita_fuera_de_contexto, asimetria
- rol a cambiar: **`imputado` → `denunciado`.** El `resumen` dice "nunca fue formalizado ni imputado
  formalmente". Mismo caso que Manini Ríos.

1. **cita_fuera_de_contexto (bloquea).** El hito de 2011-08-02 lleva `etapa: archivo` sobre la base de
   la frase "Al no prosperar el desafuero, la causa no avanza y queda archivada". **Ninguna de las
   tres citas dice que la causa se archivó.** Lo más cerca que llega la fuente es lo contrario: "Nin
   posee fueros y la jueza pidió que se los levantaran para continuar con el proceso, extremo
   descartado este martes"
   (https://www.180.com.uy/articulo/20589_Senado-voto-por-mantenerle-los-fueros-a-Nin-Novoa) —
   es decir, el proceso no pudo continuar mientras tuviera fueros, que no es lo mismo que archivado.
   Como `archivo` es la última etapa, el validador deriva `etiqueta_legal: cerrado_sin_condena` y el
   sitio le afirma al lector un desenlace que ninguna fuente sostiene.
   - accion_sugerida: `etapa: investigacion` (etiqueta pasa a `denuncia`) y `revision.que_falta`
     diciendo que no se encontró el destino de la causa después del rechazo del desafuero de 2011.
     Nin Novoa dejó de ser legislador en 2015 al asumir como canciller, así que el desenlace es
     buscable y previsible: Base de Jurisprudencia Nacional y la carpeta del juzgado de la jueza
     Canessa.

2. **riesgo_legal (bloquea).** El `resumen` describe al denunciante como "el correligionario
   frenteamplista y exsenador Julio Lara". **Ninguna de las dos fuentes citadas dice de qué partido
   era Lara.** Portal 180 dice "el ex senador Julio Lara" y nada más; Montevideo Portal no lo nombra
   siquiera. Atribuirle un partido a un denunciante sin fuente cambia por completo cómo se lee el caso
   (una denuncia entre correligionarios se lee distinto de una denuncia de un adversario), y es
   exactamente el tipo de afirmación sobre una persona identificable que el artículo 336 castiga si no
   está respaldada.
   - accion_sugerida: quitar "correligionario frenteamplista" o respaldarlo con la Corte Electoral o
     el registro parlamentario de la legislatura en que Lara fue senador.

3. **contexto_omitido (corregir).** Falta la posición del otro lado, que sí está en la fuente:
   "Mientras los blancos cuestionaron al Frente Amplio por partidizar el debate, la fuerza política
   aseguró que no hubo ocultamiento de bienes"
   (https://montevideo.com.uy/Noticias/Manini-Nin-y-Vidalin-que-postura-tomaron-los-partidos-en-casos-anteriores-de-desafuero-uc850363).
   El registro trae la explicación favorable (Michelini) y no la objeción.

4. **un_solo_grupo (aviso).** El hito de 2011-08-02 lista tres fuentes, pero dos son la misma URL de
   Portal 180 con distintas citas. Grupos reales: `portal-180` y `montevideo-comm`. Cumple, pero la
   página agrupa por URL y el lector va a ver dos entradas de la misma nota; conviene unir las dos
   citas en una sola fuente o dejar una.

---

### casos[7] — Denuncia por posible violación del artículo 124 de la Constitución (Andrés Ojeda)

- severidad: **corregir**
- tipo: cita_fuera_de_contexto, contexto_omitido, presentacion, documento_previsible
- rol a cambiar: **`mencionado` → `denunciado`.** "Ojeda había sido denunciado en noviembre del año
  pasado por el convencional colorado Juan Ibarra por ejercer como abogado penalista mientras se
  desempeña como senador"
  (https://www.elobservador.com.uy/nacional/frente-amplio-descarta-archivar-denuncia-contra-ojeda-violar-la-constitucion-y-pidio-citar-constitucionalistas-al-parlamento-n6037665).

1. **cita_fuera_de_contexto (corregir).** El `resumen` dice que la Fiscalía es servicio
   descentralizado "desde 2015". La cita que el propio registro trae dice **2017**: "como lo es la
   Fiscalía General de la Nación (FGN) desde 2017"
   (https://www.busqueda.com.uy/politica/informe-la-division-juridica-del-legislativo-concluye-que-no-corresponderia-remover-ojeda-del-senado-ejercer-como-abogado-n5407782).
   El registro contradice su propia fuente en un dato que es el eje del caso.
   - accion_sugerida: usar la fecha de la fuente, o mejor, citar la ley (documento previsible: la ley
     19.334 en IMPO, que crea la FGN como servicio descentralizado, y su entrada en vigencia). Es un
     dato de una línea que convierte una controversia en un hecho verificable.

2. **cita_fuera_de_contexto (corregir).** La fecha del hito 1 es 2025-11-25 (la fecha de publicación
   de la nota), pero el hecho es del 20 de noviembre y la propia `descripcion` lo dice. Los hitos se
   fechan por el hecho.

3. **cita_fuera_de_contexto (corregir).** El `resumen` afirma que "El convencional colorado Juan
   Esequiel Ibarra presentó además una denuncia formal ante la Secretaría General y el Comité de Ética
   del Partido Colorado por el mismo hecho". Es cierto, pero la cita que lo prueba está en el **otro**
   caso de Ojeda, no en este: "Ibarra presentó una denuncia formal ante la Secretaría General y los
   integrantes del Comité de Ética y Conducta Política del Partido Colorado para analizar la
   'eventual violación' del artículo 124"
   (https://www.carasycaretas.com.uy/politica/varios-dirigentes-colorados-investigados-ellos-el-senador-andres-ojeda-n95344).
   - accion_sugerida: agregar esa fuente a este caso, o sacar la afirmación.

4. **contexto_omitido (corregir).** Faltan dos cosas del lado de Ojeda que están en las fuentes:
   - "El senador Andrés Ojeda ha defendido su actuación, señalando que cuenta con un informe del
     constitucionalista Correa Fleitas que respalda la legalidad de su accionar ante el organismo"
     (https://www.carasycaretas.com.uy/politica/andres-ojeda-fue-denunciado-la-fiscal-lovesio-puede-ser-destituido-n90301).
   - Y el desenlace de la consulta a la Fiscalía de Corte, que el hito 1 plantea y el registro nunca
     cierra: "la fiscal de Corte subrogante Mónica Ferrero respondió que, debido a que había una
     investigación en curso, no correspondía que se pronunciara sobre el tema, por lo que la decisión
     quedó a criterio de Lovesio en el marco de su 'independencia técnica'"
     (https://www.montevideo.com.uy/Noticias/Fiscal-concluyo-que-Ojeda-violo-Constitucion--El-124-no-es-una-simple-regla-de-conducta--uc955670).
     Un hito que abre una consulta y nunca dice cómo terminó es media línea de tiempo.

5. **presentacion (corregir).** `resumen` de 293 palabras, el más largo del lote después de Sendic, y
   con dos oraciones enteras de cronología procesal. Además, "un escrito de más de 70 páginas": El
   Observador dice 70, Caras y Caretas dice 75. "Más de 70" es la única lectura que ninguna de las dos
   sostiene.

6. **aviso (regla 7).** Este registro trae `revision.tier: probable` y `notas_internas` con la frase
   "Requiere aprobación humana por no tener resolución judicial". Dos cosas: el tier no lo asigna el
   investigador (regla 7), y desde el 2026-09-09 **no existe la aprobación humana**: lo que decide es
   el proceso. Hay que borrar esa frase de los cuatro registros de lote c que la traen (este, el otro
   de Ojeda, Orsi y Vázquez); si queda, contamina las razones del editor con una regla derogada. El
   contenido de `que_falta` sí es correcto y hay que conservarlo.

---

### casos[8] — Denuncia penal por difamación e injurias contra Andrés Ojeda (caso Ibarra-Antel)

- severidad: **bloquea**
- tipo: un_solo_grupo, riesgo_legal, presentacion
- rol a cambiar: **`mencionado` → `denunciado`.** "El convencional colorado Esequiel Ibarra denunció
  penalmente al senador colorado Andrés Ojeda"
  (https://ladiaria.com.uy/justicia/articulo/2026/5/fiscalia-de-delitos-complejos-investiga-al-senador-colorado-andres-ojeda-por-difamacion-e-injurias/).

1. **un_solo_grupo (bloquea).** El único hito tiene dos fuentes de dos grupos (`cooperativa-la-diaria`
   y `editora-caras-y-caretas`), pero la segunda dice de dónde sacó el dato: "Según publica este
   martes La Diaria, en los últimos días la causa -que se había presentado en diciembre en Florida-
   fue derivada al fiscal especializado en Delitos Económicos de primer turno, Alejandro Machado"
   (https://www.carasycaretas.com.uy/politica/varios-dirigentes-colorados-investigados-ellos-el-senador-andres-ojeda-n95344).
   Para el hecho citado, Caras y Caretas es una reproducción de la diaria, no una segunda fuente: es el
   mismo supuesto que "una copia de agencia en varios diarios cuenta como uno". Con eso el hito tiene
   un solo grupo y el caso no llega a `publicado`.
   - accion_sugerida: buscar una tercera fuente que haya reporteado por su cuenta (`pnpm descubrir
     el-observador --desde 2026-05 --terminos Ojeda,Ibarra,difamación`; `pnpm descubrir busqueda`).
     Caras y Caretas sí aporta reporteo propio en otro punto —el audio certificado con Pablo Lanz—,
     pero eso es un hecho distinto y no está en el registro.

2. **riesgo_legal (corregir).** El `resumen` reproduce el contenido presuntamente difamatorio: que
   Ibarra "había sido sumariado por denuncias falsas […] y por casos de acoso contra compañeros y
   apertura de correspondencia". Está atribuido a Ojeda y sale de la fuente, así que se puede
   publicar; pero Ibarra es un funcionario de Antel y convencional partidario, no una figura con ficha,
   y el registro no incluye su versión, que la misma nota da: "Tras las denuncias realizadas, Ibarra
   fue denunciado y sumariado cuatro veces y sancionado a cinco meses sin goce de sueldo, algo
   entendido por el convencional colorado como un caso de persecución laboral y política".
   - accion_sugerida: si se reproduce lo que Ojeda dijo de Ibarra, hay que reproducir en la misma
     oración lo que Ibarra sostiene. Si no, se describe el objeto de la denuncia sin repetir el
     contenido.

3. **riesgo_legal (aviso).** El `resumen` nombra al diputado Gabriel Gurméndez y al exsenador Pablo
   Lanz como investigados por abuso de funciones en el mismo expediente, sin etapa ni fecha propias y
   sin que sean `involucrados`. Está en fuente pública y atribuido, así que no bloquea, pero es
   información sobre dos personas identificables que el registro no puede sostener con la estructura
   de un caso (etapa y fecha por hito).
   - accion_sugerida: dejarlo en una sola frase o sacarlo del `resumen` y anotarlo como pista.

4. **presentacion (corregir).** "ninguno de los dos tiene ficha propia en este sitio" está en el
   `resumen`, que es texto para el lector. Es narración de proceso: `pnpm revisar:paginas` lo rechaza.
   Va a `notas_internas`.

5. **presentacion (corregir).** Un solo hito y 174 palabras de `resumen`: la mitad de lo que el
   `resumen` cuenta (la denuncia de diciembre en Florida, el traslado del fiscal Machado a Cibercrimen)
   no tiene hito ni cita propia. O se abren hitos, o el `resumen` se recorta a lo que hay.

---

### casos[9] — Denuncia falsa por agresión contra Yamandú Orsi (2024)

- severidad: **bloquea**
- tipo: riesgo_legal, presentacion, cita_fuera_de_contexto
- rol a cambiar: **`mencionado` → `denunciado`.** Orsi fue el blanco directo de una denuncia penal que
  terminó archivada, y las denunciantes fueron condenadas. `denunciado` con `etiqueta_legal:
  cerrado_sin_condena` y el hito de archivo cuenta la historia entera y correcta; `mencionado` la
  esconde. La nota interna del lote dice "el esquema no tiene un rol para 'víctima de denuncia falsa'":
  cierto, y precisamente por eso el rol tiene que decir lo que pasó procesalmente y el desenlace tiene
  que estar en la línea de tiempo, que lo está.

1. **riesgo_legal (bloquea).** El `resumen` (247 palabras) narra hechos penales sobre dos personas
   privadas identificadas por nombre —detenciones, allanamientos, dos condenas con penas y delitos
   concretos, fechas— y el registro **solo tiene dos hitos y cuatro citas**, ninguna de las cuales
   respalda las condenas, las penas ni la contradenuncia de Orsi del 6 de mayo. Los hechos son ciertos
   (los verifiqué en las notas), pero un registro que afirma la condena penal de una persona nombrada
   sin una cita que la sostenga es exactamente lo que el artículo 336 castiga y lo que el sitio promete
   no hacer.
   - cita_de_contexto disponible y no usada: "Díaz fue condenada en un proceso abreviado por los
     delitos de asociación para delinquir, calumnia y difamación a cumplir una pena de 20 meses de
     libertad a prueba. Mientras, que Papasso fue primero imputada por los mismos delitos a 90 días de
     prisión preventiva, luego en agosto se la condenó 2 años y un mes de cárcel"
     (https://www.carasycaretas.com.uy/archivaron-denuncia-contra-el-candidato-del-fa-yamandu-orsi-n77565).
   - accion_sugerida: o se agregan hitos con esas citas (que existen y son de dos grupos), o el
     `resumen` se recorta a lo que las cuatro citas sostienen. Recomiendo lo primero: la condena de las
     denunciantes es el desenlace del caso y merece hito propio.

2. **riesgo_legal (corregir).** El `resumen` y el hito describen a la denunciante como "una mujer trans
   de 42 años, trabajadora sexual". Los medios lo publicaron, pero identidad de género y trabajo sexual
   son datos sensibles (ley 18.331, art. 4 lit. E y 9) de una persona privada, y **no aportan nada a lo
   que el caso documenta**: que hubo una denuncia falsa, que se archivó y que las denunciantes fueron
   condenadas. El sitio no está obligado a repetir todo lo que el medio publicó.
   - accion_sugerida: "la denunciante, Paula Díaz, luego condenada por calumnia y difamación". Sin la
     edad, sin la identidad de género, sin la ocupación.

3. **cita_fuera_de_contexto (corregir).** Tres imprecisiones contra las fuentes:
   - "El 3 y el 5 de mayo de 2024 la propia denunciante, Paula Díaz, reconoció en una entrevista
     televisiva que la denuncia era falsa": Caras y Caretas dice "El 4 de mayo, Papasso reconoció que
     la denuncia contra Orsi era mentira" y El Observador atribuye la confesión televisiva a Díaz en
     Santo y Seña sin fecha. El registro fija dos fechas que ninguna fuente da y le atribuye a Díaz lo
     que una fuente atribuye a Papasso.
   - "la militante nacionalista Romina Celeste Papasso": El Observador dice "la **ex**militante
     nacionalista".
   - "Orsi presentó una denuncia penal por 'simulación de delito y difamación'": frase entrecomillada
     sin cita en el registro.

4. **presentacion (corregir).** `notas_internas` dice "Queda en probable solo porque la colección casos
   requiere aprobación humana". Eso ya no existe (mantenedor, 2026-09-09). Hay que borrarlo: si no, el
   editor lee una razón falsa para no publicar. Con las citas de las condenas agregadas, este caso
   cumple las reglas y no tiene por qué quedar en `probable`.

---

### casos[10] — Caso Ancap - Raúl Sendic (abuso de funciones y peculado)

- severidad: **corregir**
- tipo: riesgo_legal, documento_previsible, presentacion, contexto_omitido
- rol: **`imputado` — correcto, sin cambio.** Es el único del lote que fue efectivamente procesado
  (2018) y condenado (2021). El valor `denunciado` no le corresponde.

1. **riesgo_legal (corregir).** El `resumen` (365 palabras, el más largo) afirma cinco datos concretos
   que **ninguna cita del registro respalda**: las pérdidas de "USD 602 millones" de ANCAP entre 2011 y
   2014; la fecha de la renuncia de Sendic ("13 de setiembre de 2017"); el pedido de condena del fiscal
   Pacheco del "9 de diciembre de 2020" con sus tres componentes; que el procesamiento "quedó firme en
   febrero de 2020" (esto sí está en la nota de Búsqueda de 2021, pero no en ninguna `cita`); y el
   detalle de las denuncias de 2016 (Armada, Trafigura, Petroecuador, Exor), que está en la nota pero no
   en la cita elegida. En un caso con `etiqueta_legal: condena` —la etiqueta más grave que el sitio
   pone— cada dato tiene que estar citado.
   - accion_sugerida: las citas existen y las leí; hay que trasladarlas. Por ejemplo, para el alcance
     de las denuncias: "Las denuncias que derivaron en los procesamientos fueron presentadas a la
     Justicia por los partidos de la oposición el 19 de abril de 2016, e incluían la gestión en la
     publicidad de Ancap, contratos y licitaciones para el transporte de cal y para el equipamiento de
     una planta de cemento, contrato con la Armada […] intermediación de Ancap entre la empresa
     Trafigura y la estatal ecuatoriana Petroecuador"
     (https://www.busqueda.com.uy/Secciones/Raul-Sendic-fue-procesado-sin-prision-por-abuso-de-funciones-y-peculado-uc36199).
   - Para las pérdidas de ANCAP, el dato está **dentro del propio sitio**: `content/empresas/ancap.yaml`
     tiene la serie de resultados por año con los estados contables auditados. Un caso que cita una
     cifra de la empresa sin usar la ficha de la empresa que el sitio ya publicó es trabajo repetido y
     sin fuente.

2. **cita_fuera_de_contexto (corregir).** El `resumen` encadena "la Jutep concluyó que Sendic incurrió
   en 'violaciones' […] y Sendic renunció a la vicepresidencia el 13 de setiembre de 2017", sugiriendo
   una causa. La fuente atribuye el desencadenante a otra cosa: "decidió renunciar a su cargo en
   setiembre de 2017, luego de que el Tribunal de Conducta Política del Frente Amplio cuestionara el uso
   que dio a las tarjetas corporativas de Ancap"
   (https://www.busqueda.com.uy/Secciones/La-Justicia-condeno-a-Sendic-por-exceder-los-poderes-de-su-cargo-y-apropiarse-de-dinero-estatal-durante-la-presidencia-de-Ancap-uc47804).
   Dos hechos distintos en el mismo mes; el registro los funde.

3. **documento_previsible (corregir).** Es la objeción central de este caso y del lote entero. El caso
   está íntegramente en `reportado` (Búsqueda y Subrayado) cuando existen tres documentos judiciales
   previsibles: la sentencia de procesamiento de la jueza Larrieu (mayo 2018), la sentencia del Tribunal
   de Apelaciones y la de la Suprema Corte que la confirmaron (firme en febrero de 2020), y la sentencia
   condenatoria de la jueza Mainard (mayo 2021). El lote da por cerrada la búsqueda con una nota de
   método: "sin resultados (sentencia de 2018/2021, previa al nuevo CPP, no indexada)". Eso es una
   conjetura, no una búsqueda: en `consultas.jsonl` la única consulta sobre jurisprudencia para Sendic
   es `WebSearch: "Raúl Sendic" bjn.poderjudicial.gub.uy OR "Base de Jurisprudencia Nacional" sentencia`.
   No se corrió `pnpm inventario poderjudicial.gub.uy --filtro sendic` ni se intentó la Base de
   Jurisprudencia con `pnpm fuente`.
   - accion_sugerida: `pnpm inventario poderjudicial.gub.uy --filtro "sendic|larrieu|mainard"` y
     `pnpm inventario bjn.poderjudicial.gub.uy`. Con la sentencia el caso pasa a `textual` y las cifras
     dejan de depender de la prensa.

4. **documento_previsible (corregir).** El desenlace no está buscado con el mismo rigor que la
   acusación, que es una regla dura de `content/casos/`. Faltan dos hechos posteriores y los dos son
   previsibles: (a) el resultado de la apelación anunciada contra la condena de 2021; (b) si, al no
   cometer nuevo delito en el año, se extinguió la condena y se eliminaron los antecedentes, que es lo
   que la propia sentencia preveía ("si en un año el exjerarca no comete un nuevo crimen, se extingue
   el delito y se eliminan sus antecedentes penales"). Mientras eso no se busque, `etiqueta_legal:
   condena` está describiendo una sentencia de primera instancia apelada como si fuera el estado final.
   - accion_sugerida: el caso queda en `probable` hasta que se resuelva. Y la `descripcion` del hito de
     condena tiene que decir "en primera instancia".

5. **contexto_omitido (aviso).** Falta el dato que la fuente subraya y que da la medida del caso: de más
   de una decena de jerarcas investigados, ocho fueron absueltos y solo Sendic procesado. Está en la
   cita del hito de formalización, pero no en el `resumen`, que menciona la absolución de los otros ocho
   solo de pasada. Es información que juega a favor y en contra a la vez, y por eso tiene que estar.

6. **presentacion (corregir).** 365 palabras de `resumen`, tres hitos. Sobran unas 150 palabras y
   faltan hitos: la resolución de la Jutep de setiembre de 2017, la renuncia, el procesamiento firme de
   febrero de 2020 y el pedido de condena de diciembre de 2020 son hechos fechados que hoy viven como
   prosa dentro del `resumen` en vez de como puntos de la línea de tiempo que la página dibuja.
   `notas_internas` también trae narración de proceso ("verificado contra la lista completa: astesiano,
   cardama…"), que ahí está bien, pero conviene que no migre al `resumen`.

---

### casos[11] — Investigación por los dichos de Lucía Topolansky sobre falsos testimonios

- severidad: **bloquea**
- tipo: riesgo_legal, contexto_omitido, cita_fuera_de_contexto, documento_previsible
- rol a cambiar: **`mencionado` → `denunciado`**, con una salvedad que dejo escrita porque es el más
  discutible del lote. A favor de `denunciado`: se abrió una investigación en una fiscalía de Flagrancia
  por sus dichos, y esa fiscalía tenía que decidir "si cita a Topolansky en calidad de indagada o de
  testigo"; ser candidata a indagada en una investigación abierta por lo que uno dijo es ser blanco
  directo de una investigación que no llegó a formalización, que es la definición del valor. En contra:
  el objeto investigado son los presuntos falsos testimonios de terceros, no su conducta, y terminó
  declarando como testigo. Si el editor prefiere `mencionado`, la regla tiene que quedar escrita y
  aplicarse igual al día siguiente: entonces Mujica —interrogado como testigo por el mismo fiscal en
  diciembre de 2024— tampoco entra, que es lo que el lote decidió, y ahí sí el lote sería coherente. Lo
  que no puede pasar es que Topolansky tenga caso y Mujica no, con el mismo rol.

1. **riesgo_legal (bloquea).** El `resumen` pone entre comillas, como dicho por Topolansky: "nosotros
   sabemos quiénes son los que mintieron dentro de la izquierda, pero no lo vamos a decir". **Esa frase
   no está en ninguna de las cuatro fuentes del registro ni en ninguna `cita`.** Lo que las dos notas de
   El Observador citan es otra cosa: "La gente miente en las declaraciones. A un compañero nuestro le
   dijeron: 'Mentí, decí esto y aquello, metamos preso a fulano'. Él contestó: 'No lo voy a decir'. Ahí
   te acusan de traidor y dicen que los tupamaros no dijeron nada". Una cita textual inventada o
   reconstruida de memoria, sobre lesa humanidad y atribuida a una expresidenta del Senado, es lo más
   grave que encontré en el lote.
   - accion_sugerida: reemplazarla por la frase que las fuentes traen y agregarla como `cita`. Si el
     investigador la leyó en algún lado, que aporte la URL; si no, se borra.

2. **contexto_omitido (corregir).** Falta la respuesta de Topolansky, que está en la fuente ya citada y
   que es el hecho más significativo después de sus dichos: "Topolansky respondió al colectivo con una
   carta de puño y letra, en la que reconoció el error y dijo hacerse cargo de las consecuencias. Sin
   embargo, aseguró que no podía retractarse de lo que había dicho. 'Quisiera decirles en primer término
   que como el comunicado de vuestra organización espera me llamaré a silencio. No puedo retractarme
   pues conocí lo que dije'"
   (https://www.elobservador.com.uy/nacional/lucia-topolansky-declaro-sus-dichos-testimonios-falsos-dictadura-no-aporto-nombres-ni-datos-utiles-n5991779).
   Falta también el argumento del fiscal, que da la otra mitad: "El fiscal Perciballe argumentó ante la
   jueza que tenía 'absoluta convicción' de que las víctimas de delitos de lesa humanidad 'han expresado
   la verdad' y que 'no existe confabulación alguna para perjudicar a nadie menos a un inocente'".

3. **cita_fuera_de_contexto (corregir).** El `resumen` afirma que "El 6 de marzo de 2025 el Tribunal de
   Apelaciones en lo Penal de 4.º turno revocó la decisión de la jueza Pena". Ninguna cita del registro
   da esa fecha ni ese turno; las fuentes dicen solo "Esto luego fue rechazado por un Tribunal de
   Apelaciones, que avaló la citación en calidad de testigo". Y el `resumen` suma el "PIT-CNT" a la lista
   de quienes rechazaron los dichos, dato que tampoco está en las fuentes leídas.
   - accion_sugerida: quitar fecha y turno, o citarlos. La sentencia del Tribunal de Apelaciones es un
     **documento previsible** (Base de Jurisprudencia Nacional / Poder Judicial) y además merece hito
     propio: hoy la línea de tiempo salta de la asignación de la fiscal al testimonio, y el hecho que
     explica ese salto —la revocación— no aparece como hito.

4. **documento_previsible (corregir).** El caso queda sin desenlace porque no se buscó qué hizo la
   fiscalía de Flagrancia (Travers) con el expediente. Es previsible: comunicado o resolución de la
   Fiscalía General de la Nación, que es la misma fuente que ya se cita de segunda mano ("Según informó
   la Fiscalía General de la Nación").
   - accion_sugerida: `pnpm inventario fiscalia.gub.uy --desde 2024 --filtro "topolansky|travers"`. No
     hay ninguna consulta a `fiscalia.gub.uy` para Topolansky en `consultas.jsonl` más allá del
     `inventario` general.

---

### casos[12] — Denuncia penal por el contrato UPM II contra Tabaré Vázquez y su gabinete

- severidad: **corregir**
- tipo: cita_fuera_de_contexto, presentacion, contexto_omitido, documento_previsible
- rol a cambiar: **`imputado` → `denunciado`.** Denunciado por Lust, archivado por Fiscalía, nunca
  formalizado. La `notas_internas` explica que eligió `imputado` "porque la denuncia lo nombra
  directamente como denunciado": esa es literalmente la definición del valor nuevo.

1. **cita_fuera_de_contexto (corregir).** El hito de `denuncia` está fechado 2020-07-14 y la segunda
   fuente citada para ese mismo hito lo contradice: Portal 180, en una nota del 3 de julio, escribe
   "Según la denuncia que presentó Lust ayer en fiscalía" (es decir, el 2 de julio). O hubo dos
   presentaciones —lo que la nota de Montevideo Portal sugiere: "Tal como había anunciado en el programa
   Punto de Encuentro […] Lust presentó la denuncia contra el exmandatario y su gabinete"— o una de las
   dos fechas está mal.
   - accion_sugerida: decidir con fuente cuál es la fecha de presentación, y si hubo dos actos, hacer
     dos hitos. No lo registré como discrepancia porque el documento que decide (la denuncia o la
     carpeta de Fiscalía) no lo abrí.

2. **presentacion (corregir).** "(ninguno de los tres tiene ficha propia en este sitio)" dentro del
   `resumen`. Igual que en el otro caso: es narración de proceso en texto para el lector y
   `pnpm revisar:paginas` la rechaza. Va a `notas_internas`.

3. **contexto_omitido (aviso).** Vázquez murió el 6 de diciembre de 2020 y el archivo es del 5 de enero
   de 2021. El registro no lo dice, y es información que el lector necesita para entender por qué no hay
   descargo del denunciado ni etapas posteriores.

4. **documento_previsible (corregir).** El contrato está publicado y la fuente dice dónde: "El contrato
   que está publicado en la web de Presidencia con fecha 7 de noviembre de 2017, sostiene que el costo
   para UPM en los primeros cinco años de contrato será de US$ 0,5 por tonelada bruta/km"
   (https://www.180.com.uy/articulo/83536_lust-denuncia-cambio-en-un-coma-que-habria-causado-perdida-millonaria-en-contrato-de-upm-2&ref=delsol).
   El corazón del caso es una cifra de un contrato público, y el registro la tiene solo por boca del
   denunciante.
   - accion_sugerida: `pnpm inventario presidencia.gub.uy --filtro "upm"` y citar la cláusula. Con eso el
     caso pasa a tener un documento oficial y el lector puede verificar el 0,5 por sí mismo.

5. **sin_objecion** sobre lo demás: la atribución de las cifras a Lust está bien hecha ("Lust sostuvo
   que…"), las dos citas del archivo son de dos grupos y el `etiqueta_legal` deriva bien.

---

### declaraciones[0] — 2019-09-25 — "Ya he dicho que hice lo que tenía que hacer, lo tengo bien claro…"

- severidad: **aviso**
- tipo: contexto_omitido, un_solo_grupo
- objecion: la cita existe literalmente en la fuente y está bien atribuida. Dos cosas: (a) `_faltante:
  segunda_fuente` es correcto y la declaración queda en `probable` —Portal 180 dice que la declaración se
  la dio a Subrayado ("Manini fue consultado por Subrayado"), así que la primaria es de Subrayado y
  conviene buscarla ahí, no una segunda reproducción; (b) esta declaración es una denuncia implícita de
  que "las responsabilidades están a otro nivel" y no lleva `seguimiento`, que el esquema pide cuando una
  declaración señala una irregularidad de otro. Marginal: no la señala con nombre.
- accion_sugerida: `pnpm descubrir subrayado --desde 2019-09 --terminos Manini,Gavazzo` para la fuente
  original del reportaje.

---

### declaraciones[1] — 2026-02-13 — "Enorme irresponsabilidad del gobierno, actuando con saña política…"

- severidad: **corregir**
- tipo: cita_fuera_de_contexto, asimetria
- objecion:
  1. **`contexto: entrevista` es falso.** Lo que Ámbito reproduce es una publicación de Delgado en X. La
     nota lo muestra con el embed: "Enorme irresponsabilidad del gobierno, actuando con saña política.
     Para justificar su ataque contra el gobierno de Coalición, exponen a todos los uruguayos a un juicio
     internacional y dejan al país sin las patrullas necesarias para vigilar nuestras aguas. Si se pierde
     el juicio,… https://t.co/hbumSB0oE4 — Alvaro Delgado (@AlvaroDelgadoUy) February 13, 2026"
     (https://www.ambito.com/uruguay/la-oposicion-cuestiona-sana-politica-cardama-y-el-frente-amplio-redobla-criticas-la-gestion-anterior-n6245664).
     El `contexto` tiene que reflejar que es un mensaje en redes; y la fuente primaria es el propio
     posteo (`tipo: redes`, `verificacion: manual`, que lo deja igualmente en `probable`).
  2. **El `resumen` afirma más que la cita.** "y respaldó la gestión del Ministerio de Defensa durante el
     gobierno de Lacalle Pou" sale de una segunda frase que el registro no cita: "Una penosa decisión, con
     fines exclusivamente políticos, que va contra los intereses de Uruguay. El más completo respaldo a la
     gestión del Ministerio de Defensa durante nuestro gobierno".
  3. **asimetria (corregir).** La misma nota trae, con el mismo peso, las respuestas del otro lado
     —Bettiana Díaz ("Políticas también son las responsabilidades de quienes fueron adelante con este
     proceso de compra"), Julieta Sierra, y del lado opositor también García y Mieres—. El lote levantó
     una sola declaración, de un solo lado, de una nota que tiene los dos. Eso no es intencional
     —`declaraciones.yaml` es un subproducto de un lote de casos—, pero publicado así queda como
     selección.
- accion_sugerida: o se sacan las dos declaraciones de este lote (no son casos y entran mejor por la
  corrida temática de Cardama), o se levantan las cuatro citas de la nota, oficialismo y oposición, con
  el mismo criterio.

---

## Objeciones al lote

### 1. El barrido no fue igual para las 25 personas, y se puede probar con el propio `consultas.jsonl` (severidad: bloquea el cierre de la etapa 1, no los registros)

El brief dice que un cero solo vale si se ve cómo se buscó. Conté las 330 consultas del log y las crucé
con las tablas de `notas.md`:

- **Búsqueda 2 (Base de Jurisprudencia Nacional): 16 consultas para 25 personas.** Los lotes b y c
  corrieron una consulta explícita `site:bjn.poderjudicial.gub.uy` para cada una de sus 16 personas. Las
  **nueve del lote a** (abella, argimon, astori, barandiaran, batlle, bordaberry, cesar-vega, cosse,
  daniel-martinez) **no tienen ninguna**. La tabla del lote a dice "Sin sentencia ubicable por nombre"
  para las nueve y una nota de método explica que se sustituyó por `corpus:buscar` y `WebSearch`; el log
  no muestra ninguna búsqueda dirigida a la BJN para ninguna de ellas. Es un cero sin cómo.
- **Búsqueda 4 (JUTEP): abella, barandiaran y cosse no tienen ninguna consulta.** Los otros 22 sí (16 con
  `corpus:buscar --medio jutep`, 6 con `corpus:buscar <nombre> JUTEP`). Las tablas igual afirman "Sin
  denuncia ubicada".
- **Barandiarán tiene 4 consultas en total**, contra 6 a 12 de las demás personas sin hallazgos (talvi 8,
  novick 8, mieres 8, hierro-lopez 12). Y de esas cuatro, ninguna es de JUTEP ni de BJN. Es la persona
  peor cubierta del barrido.
- **Búsqueda 1 (inventario de Fiscalía) quedó incompleta para cuatro personas**: falló con HTTP 504 para
  manini-rios y novick y con un error de Node para nin-novoa, sin reintento, y para mieres no se corrió
  ("No se corrió `inventario` con filtro específico porque ya había corrido para el lote general").

Digo expresamente que **esto no es asimetría por partido**: los tres sin JUTEP son de Asamblea Popular,
del Partido Independiente/Nuevo Espacio y del Frente Amplio; los nueve sin BJN cubren todos los partidos;
los cuatro con inventario incompleto son de Cabildo Abierto, Partido de la Gente, Frente Amplio y Partido
Independiente. Es asimetría de método, y por eso se arregla corriendo lo que falta, no reescribiendo
nada.

- accion_sugerida: antes de cerrar la etapa 1, correr para las nueve del lote a la consulta de BJN que
  corrieron los lotes b y c, y la de JUTEP para abella, barandiaran y cosse; reintentar el `inventario`
  de Fiscalía para manini-rios, novick, nin-novoa y mieres; y rehacer barandiarán entero. Y una vez:
  `pnpm inventario poderjudicial.gub.uy` y `pnpm inventario bjn.poderjudicial.gub.uy`, que nadie corrió
  y que es la vía que el brief pedía para la búsqueda 2. Sin eso, el sitio no puede decir que aplicó el
  mismo criterio a los 25.

### 2. El mismo umbral produjo resultados distintos en dos pares comparables (severidad: bloquea)

- **Batlle sí, Lacalle Pou no.** Para Batlle, el lote cargó un caso a partir de una acusación pública de
  una persona identificable (la diputada Charlone, en el pleno). Para Lacalle Pou, el lote encontró una
  acusación pública de personas identificables sobre Cardama —Garlo hablando de "hechos de apariencia
  delictiva", Pereira diciendo "El expresidente siguió esta compra y las avaló"— y **no la cargó**,
  dejándola como nota de corrección. El brief dice que no se recrean los casos existentes, y está bien;
  pero el caso de Batlle tampoco existía y entró. El umbral tiene que dar lo mismo en los dos: o la
  acusación pública de una persona identificable entra como hito con su desenlace, o no entra para
  nadie.
- **Argimón sí, Delgado no.** Una denuncia ante la JUTEP archivada a favor de la denunciada es, para
  Argimón, un caso propio con dos hitos. Para Delgado, dos denuncias ante la JUTEP resueltas a su favor
  por mayoría son una nota de corrección para agregarlo a `astesiano` como `mencionado`. Son la misma
  situación y los dos son del Partido Nacional, así que no es sesgo partidario: es una regla que se
  aplicó de dos formas. Propongo la regla simétrica: una denuncia ante la JUTEP contra una persona con
  ficha, con resolución, es un caso (o un hito) con `rol: denunciado` y con el archivo documentado, para
  todos.

### 3. Los roles: doce de trece hay que cambiarlos (severidad: corregir)

Resumen para el editor, con el criterio único que apliqué: `imputado` solo si hubo procesamiento o
formalización; `denunciado` si fue el blanco directo de una denuncia, una investigación, un juicio
político o un pedido de desafuero que no llegó a formalización; `mencionado` si aparece nombrado en un
caso ajeno.

| caso | rol actual | rol correcto | por qué |
|---|---|---|---|
| Argimón / audio Cristino | mencionado | **denunciado** | dos denuncias presentadas contra ella |
| Argimón / JUTEP hermana | mencionado | **denunciado** | "la Jutep archivó la denuncia contra la vicepresidenta" |
| Batlle / Banco Comercial | mencionado | **denunciado** | moción que pedía declarar su responsabilidad y remitir a la Justicia Penal |
| Cosse / juicio político | mencionado | **denunciado** | el enum nombra el juicio político |
| Cosse / Antel Arena | imputado | **denunciado** | declaró como indagada, nunca formalizada, archivo definitivo |
| Manini Ríos / omisión | imputado | **denunciado** | el propio registro: "nunca fue formalizado ni imputado formalmente" |
| Nin Novoa / declaración jurada | imputado | **denunciado** | ídem |
| Ojeda / artículo 124 | mencionado | **denunciado** | "Ojeda había sido denunciado […] por el convencional colorado Juan Ibarra" |
| Ojeda / difamación | mencionado | **denunciado** | "Ibarra denunció penalmente al senador colorado Andrés Ojeda" |
| Orsi / denuncia falsa | mencionado | **denunciado** | fue el denunciado; el desenlace lo cuentan los hitos |
| Sendic / Ancap | imputado | **imputado** (sin cambio) | procesado en 2018, condenado en 2021 |
| Topolansky / falsos testimonios | mencionado | **denunciado** (discutible, ver el bloque) | investigación abierta con ella como posible indagada |
| Vázquez / UPM II | imputado | **denunciado** | denunciado por Lust, archivado, nunca formalizado |

Y fuera del lote, por coherencia: `content/casos/jutep-declaraciones-juradas-2026.yaml` tiene a Lacalle
Pou como `mencionado` cuando es el blanco directo de la denuncia de Ibarra ante la JUTEP. Si los casos
nuevos usan `denunciado` y el publicado se queda en `mencionado`, el sitio pone dos etiquetas distintas a
la misma situación. Entra por corrección.

### 4. Etapas: la misma resolución parlamentaria recibió tres etapas distintas (severidad: bloquea)

Ya lo detallé en Cosse. La regla que propongo, y que hay que escribir una vez para que valga para todos:
la resolución de una cámara que cierra el trámite (rechazo de desafuero, juicio político sin mérito,
rechazo de una moción acusatoria) es `archivo` si con eso el asunto queda cerrado, y `investigacion` si
la causa judicial sigue viva y se sabe que sigue. Aplicada al lote: Cosse `absolucion` → `archivo`;
Manini Ríos 2020-09-30 se queda en `investigacion` (correcto, porque la causa siguió y se archivó en
2025) pero la `descripcion` tiene que decir por qué; Nin Novoa `archivo` → `investigacion` (porque nadie
probó que se archivara); Batlle `archivo` → `investigacion` (porque la Cámara remitió a la Justicia).

### 5. Dependencia de fuentes (severidad: aviso, con una excepción)

De 13 casos: 2 se sostienen íntegramente en documentos primarios (Batlle y Cosse/juicio político, ambos
en diarios de sesiones del Parlamento), 1 es mixto (Manini Ríos) y **10 son solo prensa**. Ningún caso
del lote cita un documento de Fiscalía, del Poder Judicial ni de la JUTEP, en un barrido cuyas búsquedas
1, 2 y 4 eran justamente esas tres fuentes. Los grupos están bien distribuidos (werthein-hochbaum,
magnolio, fontaina-de-feo, montevideo-comm, cooperativa-la-diaria, editora-caras-y-caretas, portal-180,
grupo-ambito, sepi-estado-espanol, grupo-infobae, lecueder-cotelo): ningún caso depende de un solo grupo
salvo el de Ojeda/difamación, que es el que bloqueo por eso. Sobre alineamiento: de los 78 medios del
sitio, solo `caras-y-caretas` tiene etiqueta declarada (`progresista`) entre los usados acá; los demás
son `sin_datos`, `independiente` o `estatal`, así que la advertencia de alineamiento del validador no
aplica, pero conviene saber que Caras y Caretas aparece como fuente en 5 de los 13 casos.

### 6. Lo que el lote tuvo delante y no levantó (severidad: aviso)

- **Un giro documentado de Manini Ríos.** Dos fuentes del lote lo dicen: "Durante la campaña electoral,
  el general retirado aseguró que renunciaría a sus fueros en caso de que la Justicia decidiera
  investigarlo por esa causa. Sin embargo, luego no lo hizo" (Montevideo Portal, 2025-07-21) y "Tanto en
  campaña como luego de asumir su banca, Manini Ríos había dicho que se sometería a la Justicia sin
  ampararse en los fueros, pero luego cambió su postura" (Montevideo Portal, 2023-04-06). `notas.md`
  dice "candidatos_giro: ninguno en este lote". Es un `cambio_total` con las dos puntas fechables.
  - accion_sugerida: buscar la declaración de campaña original (video o prensa de 2019) y cargar
    declaración + giro. Como las dos fuentes que lo cuentan son del mismo grupo, hace falta una tercera.
- **La votación nominal del desafuero** (ver casos[5], punto 7).
- **Un caso de Vidalín** con desenlace completo, que aparece en la misma nota: "La denuncia fue archivada
  en 2015. La Justicia resolvió no hacer lugar a la solicitud de enjuiciamiento formulada por Fiscalía,
  por no encontrarse probados los hechos denunciados". `notas.md` ya lo anotó en `casos_vistos`. Bien.

### 7. Presentación (severidad: corregir)

- Seis de trece `resumen` pasan las 200 palabras: Manini Ríos 223, Ojeda/124 293, Orsi 247, Topolansky
  252, Vázquez 256 y Sendic 365. Y en cuatro de esos seis el `resumen` narra más hechos fechados que los
  que la `estado_judicial` tiene como hitos, que es exactamente la información que la línea de tiempo
  debería mostrar y el texto no debería repetir.
- Dos `resumen` traen narración de proceso ("ninguno de los tres tiene ficha propia en este sitio";
  "ninguno de los dos tiene ficha propia en este sitio"). `pnpm revisar:paginas` los rechaza.
- Cuatro registros del lote c traen `revision.tier` y `notas_internas` con "Requiere aprobación humana",
  que es una regla derogada el 2026-09-09.
- Los `nombre` de los casos: nueve de trece dicen lo sustancial y no llevan adjetivos, bien. Tres
  arrancan con "Caso X (…)" cuando el paréntesis ya dice el asunto ("Caso Manini Ríos (omisión de
  denuncia…)", "Caso Nin Novoa (omisión en declaración jurada…)", "Caso Ancap - Raúl Sendic (abuso de
  funciones y peculado)"); es cuestión de gusto y no lo objeto, salvo por uno: **"Denuncia falsa por
  agresión contra Yamandú Orsi (2024)"** afirma en el título el resultado del proceso. Es cierto y está
  probado por dos condenas, pero el título de un caso no debería adelantar la calificación; "Denuncia
  por agresión contra Yamandú Orsi y condena de las denunciantes (2024)" dice lo mismo sin calificar.

### 8. Las notas de corrección a casos ya publicados (severidad: corregir)

Las evalúo una por una con las reglas de evidencia, como pide el encargo.

**a) `astesiano.yaml` — agregar a Álvaro Delgado. Alcanza para una corrección `afecta[]`, con rol
`denunciado`, no `mencionado`.** Lo que `notas.md` reúne (la autorización firmada el 11/6/2021, la
declaración de Astesiano ante el fiscal Romano del 10/3/2023, dos denuncias ante la JUTEP con resolución
por mayoría a favor de Delgado y un informe en minoría de la directora Ferrari, y la versión de Delgado
—"firma administrativa" con "previa fundamentación del organismo competente"—) tiene forma de caso: hay
denuncia, hay resolución y hay desenlace, y el desenlace es favorable. Lo que **falta**, y sin esto no se
promueve: las citas literales. `notas.md` describe las notas de Caras y Caretas (6/10/2022 y 19/3/2024)
y de El Observador (24/4/2023) en prosa, y en `consultas.jsonl` figura la lectura de
`carasycaretas.com.uy/politica/informe-directora-jutep-dice-que-alvaro-delgado-violo-normas-eticas-…`,
pero ninguna cita quedó escrita en un YAML. Hay que rehacerlas con `pnpm fuente` y verificar que cada
hito tenga dos grupos (Caras y Caretas y El Observador son dos grupos, bien) y que el informe en minoría
se cite entre comillas y atribuido a Ferrari, nunca en voz del sitio. Rol: `denunciado`, por la misma
regla que Argimón.

**b) `marset-pasaporte.yaml` — actualización del 26/8/2026. No alcanza.** Tres razones: (1) la única
fuente es `prensa-mercosur`, un solo grupo, y la propia nota atribuye el hallazgo a "documentación
obtenida por El Observador", así que es una reproducción; (2) Carolina Ache **no tiene ficha en
`content/politicos/`**, de modo que no puede entrar en `involucrados[]` —el hito puede describir la
conducta, pero el caso sigue siendo el de Lacalle Pou `bajo_su_mando`—; (3) la parte más fuerte de la
nota es que la conclusión administrativa "contradice lo que en 2023 había sostenido el entonces
presidente Lacalle Pou", y eso no se puede afirmar sin (i) la cita literal y fechada de lo que Lacalle
Pou dijo en 2023 y (ii) el expediente o la resolución de Cancillería que abre el sumario. Con las dos
piezas, además de corrección, sería material de `discrepancias` o de un giro; sin ellas es un
trascendido de segunda mano sobre una contradicción.
   - accion_sugerida: buscar la nota original de El Observador (`pnpm descubrir el-observador --desde
     2026-08 --terminos Ache,Marset,sumario`) y la resolución de Cancillería que dispone el sumario
     contra Bustillo y Mata.

**c) `cardama-denuncia-lazo-2026.yaml` — agregar a Lacalle Pou como `mencionado`. Es la más sólida de
las cuatro y aun así todavía no se puede escribir.** Cruza el umbral (acusación pública de personas
identificables: Garlo, Pereira, Viera) y tiene desenlace parcial documentado en los dos sentidos, que es
lo que la regla de desenlaces exige: la comisión resolvió remitir todo a Fiscalía **y** decidió no citar
a Lacalle Pou ("no surgieron elementos en el ámbito de la comisión"). Los dos hechos van en el mismo
hito, con el mismo peso. Grupos: Caras y Caretas (10/8/2026) y Subrayado (24/8/2026) son dos grupos
distintos, así que la exigencia de `reportado` se cumple. Lo que falta: **las citas**. `notas.md` las
parafrasea y solo entrecomilla dos fragmentos sueltos; ninguna quedó en un YAML con URL, fecha y
`retrieved_at`. Y sobre la forma: no lo separaría en un caso nuevo. El hecho es el mismo contrato y el
lector no entiende por qué hay dos fichas; entra como `involucrados[]` + hitos en la ficha existente, y
si el editor cree que el nombre del archivo ya no describe el caso, eso se arregla con un `nombre` más
amplio (el id no se renombra nunca).
   - Y una advertencia de Regla 0 sobre el `rol`: **`mencionado`, no `denunciado`.** No hay denuncia ni
     investigación de Fiscalía dirigida contra Lacalle Pou; hay responsabilidad política señalada por
     legisladores. La diferencia entre "lo acusaron políticamente" y "lo denunciaron" es justo lo que el
     enum nuevo permite marcar, y hay que marcarla bien también cuando el registro es desfavorable.

**d) `jutep-declaraciones-juradas-2026.yaml` — no hay corrección de contenido, pero sí de rol.** El lote
verificó y no hay novedades desde el 12/6/2026; eso está bien documentado y no genera hito. Lo que sí
corresponde es el cambio de `mencionado` a `denunciado` para Lacalle Pou, por la misma regla que se
aplica a los trece del lote. Es una corrección chica y hay que hacerla en el mismo movimiento que las
otras, no después, porque si no el sitio queda con dos criterios conviviendo.

---

## Objeciones al brief

**Ninguna de fondo, y lo digo con detalle porque este brief es el que corrige un problema de Regla 0
anterior.** Pide las mismas cinco búsquedas, en el mismo orden, con el mismo umbral, para las 25 personas
con ficha, y ordena los lotes por cargo y no por partido. No selecciona a quién se investiga: eso es
exactamente lo que la regla 12 nueva manda y lo contrario de lo que la versión vieja ("solo con pedido
explícito en el brief") permitía. Tampoco pide encuadre: manda registrar el desenlace con el mismo rigor
que la acusación, prohíbe adjetivos y verbos de intención y prohíbe nombrar víctimas de identidad
reservada.

Dos apuntes menores, no objeciones:

1. El brief manda que un cero valga solo si se ve cómo se buscó, y eso está bien; pero no dice **con qué
   herramienta** se cumple cada búsqueda. Los tres lotes interpretaron distinto la búsqueda 2 (la BJN):
   dos la resolvieron con una consulta `site:` y uno la declaró irrealizable y la sustituyó. El resultado
   es la asimetría del punto 1 de arriba. Para la etapa 2 conviene que el brief fije la herramienta
   exacta por búsqueda (`pnpm inventario <dominio> --filtro <apellido>` para 1, 2 y 4) y qué hacer si
   falla (reintentar, y si vuelve a fallar, dejarlo escrito en la tabla de esa persona, no en una nota
   general).
2. El brief no dice qué hacer cuando una persona con ficha aparece como **denunciante** en un caso ajeno.
   Los tres lotes lo resolvieron igual y bien (Bordaberry, César Vega y Salle aparecen como denunciantes
   y no se cargan como casos contra ellos), pero conviene escribirlo, porque es una decisión con filo:
   quien denuncia mucho aparecería con muchos casos si la regla no fuera explícita.

---

## Cobertura

Un registro por nota de prensa releída en esta sesión. No emito registro de las notas que no abrí,
aunque estén citadas en el lote. Los cuatro documentos del Parlamento (tres diarios de sesiones y una
ficha de asunto) no llevan registro de tono: no son cobertura de prensa. Criterio aplicado igual a todos
los medios y partidos: `neutral` por defecto; `favorable` o `desfavorable` solo con una frase literal del
cuerpo de la nota, nunca del titular solo, y sobre cómo trata la nota a la persona, no sobre si la
noticia le conviene.

```yaml
- medio: subrayado
  url: https://www.subrayado.com.uy/fernando-cristino-incluyo-beatriz-argimon-su-denuncia-amenazas-n640446
  fecha: 2020-06-23
  evento: "propuesto:audio-argimon-cristino-2020"
  politico: argimon
  tono: neutral
  justificacion: >-
    Relata la ratificación de la denuncia sin calificar a la vicepresidenta y marca el límite del dato
    propio: "Por el momento, se desconocen detalles de las próximas actuaciones en esa sede".

- medio: el-observador
  url: https://www.elobservador.com.uy/nota/frente-amplio-presento-denuncia-en-fiscalia-ante-gravedad-de-conversacion-entre-argimon-y-cristino-202062419337
  fecha: 2020-06-24
  evento: "propuesto:audio-argimon-cristino-2020"
  politico: argimon
  tono: neutral
  justificacion: >-
    Reproduce el escrito de la denuncia y también el descargo implícito del oficialismo: "los
    legisladores oficialistas dieron por laudado el tema después de escuchar los argumentos de la
    vicepresident…".

- medio: la-diaria
  url: https://ladiaria.com.uy/politica/articulo/2020/6/senadores-del-fa-presentan-este-miercoles-denuncia-penal-por-audio-de-argimon-con-cristino/
  fecha: 2020-06-24
  evento: "propuesto:audio-argimon-cristino-2020"
  politico: argimon
  tono: neutral
  justificacion: >-
    Presenta la denuncia y de inmediato acota su alcance con la cita del denunciante: "no quiere decir
    que la vicepresidenta sea culpable de nada, pero hay que investigar y aclarar el hecho".

- medio: el-observador
  url: https://www.elobservador.com.uy/nota/polemica-en-la-ursec-inac-y-la-hermana-de-argimon-algunos-temas-pendientes-que-debera-tratar-la-jutep-20207301990
  fecha: 2020-08-03
  evento: "propuesto:jutep-pase-en-comision-hermana-argimon-2020"
  politico: argimon
  tono: desfavorable
  justificacion: >-
    Da por configurada la infracción antes de que la Jutep resuelva: "quien designó a su hermana como
    asesora en su despacho del Senado, lo que contradice al artículo 35 del decreto 30/003".

- medio: el-observador
  url: https://www.elobservador.com.uy/nota/jutep-archiva-la-denuncia-por-la-contratacion-de-la-hermana-de-la-vicepresidenta-beatriz-argimon-202081014411
  fecha: 2020-08-10
  evento: "propuesto:jutep-pase-en-comision-hermana-argimon-2020"
  politico: argimon
  tono: neutral
  justificacion: >-
    Informa el archivo, reproduce el fundamento del organismo y da lugar a la explicación de Argimón:
    "Hablé con ella porque tiene muchísima experiencia en eso y creí que era la indicada para hacerlo".

- medio: la-diaria
  url: https://ladiaria.com.uy/politica/articulo/2020/11/ex-presidente-de-la-jutep-cuestiona-al-actual-directorio-del-organismo-no-ha-tenido-una-actitud-proactiva/
  fecha: 2020-11-23
  evento: "propuesto:jutep-pase-en-comision-hermana-argimon-2020"
  politico: argimon
  tono: neutral
  justificacion: >-
    La nota trata al directorio de la Jutep, no a Argimón; la única frase que la involucra está
    atribuida a un tercero: "Gil Iribarne dijo tener 'dudas' acerca del archivo de la denuncia contra
    Argimón".

- medio: el-observador
  url: https://www.elobservador.com.uy/nota/antel-realizara-una-denuncia-penal-tras-auditoria-por-antel-arena--202162181634
  fecha: 2021-06-02
  evento: "propuesto:caso-antel-arena"
  politico: cosse
  tono: neutral
  justificacion: >-
    Reproduce en su totalidad los hallazgos que expuso el directorio de ANTEL y no menciona a Cosse en
    ningún momento; todo lo afirmativo está atribuido: "en palabras de jerarca 'representó una
    restricción a la competencia'".

- medio: subrayado
  url: https://www.subrayado.com.uy/fiscal-citara-carolina-cosse-denuncia-irregularidades-construccion-del-antel-arena-n839001
  fecha: 2022-02-15
  evento: "propuesto:caso-antel-arena"
  politico: cosse
  tono: neutral
  justificacion: >-
    Informa la citación y cierra con el descargo completo del lado denunciado: "Distintos dirigentes del
    Frente Amplio, incluida Cosse, han dicho que en su momento tuvieron informes jurídicos favorables a
    la construcción del Antel Arena".

- medio: montevideo-portal
  url: https://www.montevideo.com.uy/Noticias/Cosse-declara-hoy-en-Fiscalia-de-Delitos-Economicos-por-construccion-del-Antel-Arena-uc828557
  fecha: 2022-07-28
  evento: "propuesto:caso-antel-arena"
  politico: cosse
  tono: desfavorable
  justificacion: >-
    Presenta el sobrecosto como hecho establecido y como responsabilidad suya: "se concluyó que la obra
    tuvo un costo de 120 millones de dólares, tres veces mayor a lo comunicado en su momento por Cosse",
    sin dar su versión.

- medio: el-observador
  url: https://www.elobservador.com.uy/nota/fiscalia-archivo-investigacion-sobre-la-construccion-del-antel-arena-fiscal-no-encontro-delitos-2024222113558
  fecha: 2024-02-22
  evento: "propuesto:caso-antel-arena"
  politico: cosse
  tono: desfavorable
  justificacion: >-
    Informa el archivo, pero el cuerpo de la nota afirma en voz propia una falla de la investigada:
    "Sin embargo, Cosse no pudo explicar ante el fiscal Rodríguez –de la misma forma que no había podido
    ante políticos y periodistas– cómo fue que la obra pasó de tener un costo de US$ 40 a US$ 120
    millones".

- medio: caras-y-caretas
  url: https://www.carasycaretas.com.uy/policiales/la-causa-antel-arena-se-archiva-y-cae-otra-operacion-lacalle-pou-n80282
  fecha: 2024-12-21
  evento: "propuesto:caso-antel-arena"
  politico: cosse
  tono: favorable
  justificacion: >-
    Encuadra la causa como una maniobra ordenada desde la Presidencia: "Una vez que el presidente Luis
    Lacalle Pou le indicó a Gabriel Gurméndez […] que solicitara el reexamen de la causa Antel Arena", y
    desarma la auditoría con la cita de un director: "el informe de Ecovis mezcló gastos e inversiones".

- medio: el-observador
  url: https://www.elobservador.com.uy/nacional/fiscalia-volvio-archivar-investigacion-el-antel-arena-n5984909
  fecha: 2025-02-13
  evento: "propuesto:caso-antel-arena"
  politico: cosse
  tono: neutral
  justificacion: >-
    Detalla los fundamentos del archivo definitivo con las cifras del expediente y sin adjetivos:
    "el informe oficial que es el del Tribunal de Cuentas señaló que se gastaron US$ 85.995.517".

- medio: montevideo-portal
  url: https://www.montevideo.com.uy/Noticias/-Vale-la-pena--la-reflexion-de-Cosse-tras-el-archivo-definitivo-de-la-causa-Antel-Arena-uc914931
  fecha: 2025-02-13
  evento: "propuesto:caso-antel-arena"
  politico: cosse
  tono: neutral
  justificacion: >-
    Es una transcripción de las declaraciones de Cosse tras el archivo, sin voz del medio: "La reflexión
    que me llevo de este resultado es que cuando se hacen las cosas con honestidad, transparencia,
    apegado a derecho […] vale la pena".

- medio: montevideo-portal
  url: https://www.montevideo.com.uy/Noticias/Sin-fueros-Fiscalia-decide-si-pide-imputacion-de-Manini-Rios-tal-como-lo-hiciera-en-2020-uc930708
  fecha: 2025-07-21
  evento: "propuesto:desafuero-manini-rios-2020"
  politico: manini-rios
  tono: desfavorable
  justificacion: >-
    Además de informar la decisión pendiente, señala en voz propia un incumplimiento de palabra:
    "Durante la campaña electoral, el general retirado aseguró que renunciaría a sus fueros en caso de
    que la Justicia decidiera investigarlo por esa causa. Sin embargo, luego no lo hizo".

- medio: caras-y-caretas
  url: https://www.carasycaretas.com.uy/justicia/fiscalia-evalua-imputar-guido-manini-rios-perder-sus-fueros-parlamentarios-n86329
  fecha: 2025-07-22
  evento: "propuesto:desafuero-manini-rios-2020"
  politico: manini-rios
  tono: desfavorable
  justificacion: >-
    Titula el apartado "Tribunales de (des)Honor" y describe el desafuero rechazado como un bloqueo
    partidario: "la solicitud fue bloqueada por los votos de su propio partido y del Partido Nacional".

- medio: el-observador
  url: https://elobservador.com.uy/nacional/archivaron-prescripcion-investigacion-contra-manini-omision-denunciar-delito-el-caso-gavazzo-n6014921
  fecha: 2025-08-29
  evento: "propuesto:desafuero-manini-rios-2020"
  politico: manini-rios
  tono: neutral
  justificacion: >-
    Informa el archivo y explica el fundamento legal sin calificar: "La fiscal entendió que el delito
    prescribe a los cuatro años, según el artículo 117 numeral 2 del Código Penal".

- medio: efe
  url: https://swissinfo.ch/spa/archivan-investigaci%C3%B3n-contra-exsenador-uruguayo-guido-manini-r%C3%ADos-por-presunta-omisi%C3%B3n/89920173
  fecha: 2025-08-29
  evento: "propuesto:desafuero-manini-rios-2020"
  politico: manini-rios
  tono: neutral
  justificacion: >-
    Despacho de agencia que reconstruye la cronología y transcribe el artículo 114 de la Constitución sin
    adjetivos: "La sesión finalizó con una votación en la que 16 personas se mostraron en contra y 15 lo
    hicieron a favor".

- medio: 180-com-uy
  url: https://www.180.com.uy/articulo/20589_Senado-voto-por-mantenerle-los-fueros-a-Nin-Novoa
  fecha: 2011-08-02
  evento: "propuesto:desafuero-nin-novoa-2011"
  politico: nin-novoa
  tono: neutral
  justificacion: >-
    Informa el resultado y da la explicación del Senado sin tomar partido: "no había méritos para votar
    el desafuero, ya que la denuncia contra Nin Novoa fue desechada por el fiscal".

- medio: montevideo-portal
  url: https://montevideo.com.uy/Noticias/Manini-Nin-y-Vidalin-que-postura-tomaron-los-partidos-en-casos-anteriores-de-desafuero-uc850363
  fecha: 2023-04-06
  evento: "propuesto:desafuero-nin-novoa-2011"
  politico: nin-novoa
  tono: neutral
  justificacion: >-
    Nota comparativa que da las dos posiciones en cada caso: "Mientras los blancos cuestionaron al Frente
    Amplio por partidizar el debate, la fuerza política aseguró que no hubo ocultamiento de bienes".

- medio: caras-y-caretas
  url: https://www.carasycaretas.com.uy/politica/andres-ojeda-fue-denunciado-la-fiscal-lovesio-puede-ser-destituido-n90301
  fecha: 2025-11-25
  evento: "propuesto:caso-ojeda-articulo-124"
  politico: ojeda
  tono: desfavorable
  justificacion: >-
    Abre con la consecuencia máxima como antetítulo y la subraya en el cuerpo: "La gravedad del asunto
    radica en que el mencionado artículo constitucional establece una 'inmediata causal de destitución'".

- medio: busqueda
  url: https://www.busqueda.com.uy/politica/informe-la-division-juridica-del-legislativo-concluye-que-no-corresponderia-remover-ojeda-del-senado-ejercer-como-abogado-n5407782
  fecha: 2025-12-11
  evento: "propuesto:caso-ojeda-articulo-124"
  politico: ojeda
  tono: neutral
  justificacion: >-
    Marca el modo verbal del informe antes de resumirlo: "Así, en condicional, está redactada la
    conclusión de un informe elaborado por la División Jurídica del Poder Legislativo".

- medio: montevideo-portal
  url: https://www.montevideo.com.uy/Noticias/Fiscal-concluyo-que-Ojeda-violo-Constitucion--El-124-no-es-una-simple-regla-de-conducta--uc955670
  fecha: 2026-03-12
  evento: "propuesto:caso-ojeda-articulo-124"
  politico: ojeda
  tono: neutral
  justificacion: >-
    Atribuye todo el juicio a la fiscal y explica su recorrido, incluida la abstención de la Fiscalía de
    Corte: "la fiscal de Corte subrogante Mónica Ferrero respondió que […] no correspondía que se
    pronunciara sobre el tema".

- medio: el-observador
  url: https://www.elobservador.com.uy/nacional/frente-amplio-descarta-archivar-denuncia-contra-ojeda-violar-la-constitucion-y-pidio-citar-constitucionalistas-al-parlamento-n6037665
  fecha: 2026-03-17
  evento: "propuesto:caso-ojeda-articulo-124"
  politico: ojeda
  tono: neutral
  justificacion: >-
    Da las dos posiciones y el estado del trámite: "Desde el entorno de Ojeda dijeron a El Observador que
    ya hay varios informes jurídicos sobre el tema […] por lo que entienden que no es necesario
    citarlos".

- medio: la-diaria
  url: https://ladiaria.com.uy/justicia/articulo/2026/5/fiscalia-de-delitos-complejos-investiga-al-senador-colorado-andres-ojeda-por-difamacion-e-injurias/
  fecha: 2026-05-11
  evento: "propuesto:caso-ojeda-difamacion-ibarra"
  politico: ojeda
  tono: neutral
  justificacion: >-
    Informa la denuncia y reproduce lo dicho por Ojeda atribuido, sin calificarlo: "en los que el senador
    dijo que Ibarra había sido sumariado por denuncias falsas".

- medio: caras-y-caretas
  url: https://www.carasycaretas.com.uy/politica/varios-dirigentes-colorados-investigados-ellos-el-senador-andres-ojeda-n95344
  fecha: 2026-05-12
  evento: "propuesto:caso-ojeda-difamacion-ibarra"
  politico: ojeda
  tono: desfavorable
  justificacion: >-
    Encuadra el episodio como una embestida interna y agrega material propio contra los dirigentes
    colorados: "La interna del Partido Colorado vuelve a sacudirse. Una vez más, el convencional Esequiel
    Ibarra arremete contra el senador y secretario general del partido Andrés Ojeda".

- medio: el-observador
  url: https://www.elobservador.com.uy/nacional/fiscal-archivo-investigacion-denuncia-falsa-orsi-no-encontro-pruebas-que-haya-existido-un-movil-politico-n5962402
  fecha: 2024-09-24
  evento: "propuesto:denuncia-falsa-orsi-2024"
  politico: orsi
  tono: neutral
  justificacion: >-
    Informa el archivo y también las hipótesis del entorno del denunciado que la Fiscalía descartó:
    "Uno de los dirigentes allegados a Orsi, Francisco Legnani, había declarado públicamente […] que la
    denuncia falsa […] había sido pautada 'desde el exterior'".

- medio: caras-y-caretas
  url: https://www.carasycaretas.com.uy/archivaron-denuncia-contra-el-candidato-del-fa-yamandu-orsi-n77565
  fecha: 2024-09-25
  evento: "propuesto:denuncia-falsa-orsi-2024"
  politico: orsi
  tono: favorable
  justificacion: >-
    Establece la falsedad de la denuncia en voz propia antes de informar el archivo: "En marzo de 2024 el
    Uruguay se vio sacudido por una denuncia contra el candidato a la presidencia por el Frente Amplio
    (FA), Yamandú Orsi. Tiempo después se comprobó que la denuncia era falsa".

- medio: busqueda
  url: https://www.busqueda.com.uy/Secciones/Raul-Sendic-fue-procesado-sin-prision-por-abuso-de-funciones-y-peculado-uc36199
  fecha: 2018-05-24
  evento: caso-sendic
  politico: sendic
  tono: desfavorable
  justificacion: >-
    Además de informar el procesamiento, dedica varios párrafos a enumerar sus gastos personales:
    "Entre esos gastos se encuentran un pago en la tienda de ropa uruguaya John Read en 2006, compras en
    Roma en casas de deportes en 2008 y otras adquisiciones polémicas".

- medio: busqueda
  url: https://www.busqueda.com.uy/Secciones/La-Justicia-condeno-a-Sendic-por-exceder-los-poderes-de-su-cargo-y-apropiarse-de-dinero-estatal-durante-la-presidencia-de-Ancap-uc47804
  fecha: 2021-05-20
  evento: caso-sendic
  politico: sendic
  tono: neutral
  justificacion: >-
    Entrecomilla las expresiones de la sentencia y aporta el contraste que matiza la causa: "la Justicia
    investigó a más de una decena de jerarcas […] pero terminó poniendo el foco en solo uno de ellos".

- medio: el-observador
  url: https://www.elobservador.com.uy/nacional/fiscal-eliana-travers-investigara-declaraciones-lucia-topolansky-falsos-testimonios-condenar-militares-n5976810
  fecha: 2024-12-26
  evento: "propuesto:dichos-topolansky-falsos-testimonios-2024"
  politico: topolansky
  tono: neutral
  justificacion: >-
    Reproduce sus dichos textuales y también la respuesta del fiscal: "El fiscal Perciballe argumentó
    ante la jueza que tenía 'absoluta convicción' de que las víctimas […] 'han expresado la verdad'".

- medio: el-observador
  url: https://www.elobservador.com.uy/nacional/lucia-topolansky-declaro-sus-dichos-testimonios-falsos-dictadura-no-aporto-nombres-ni-datos-utiles-n5991779
  fecha: 2025-03-27
  evento: "propuesto:dichos-topolansky-falsos-testimonios-2024"
  politico: topolansky
  tono: neutral
  justificacion: >-
    Informa el resultado de la declaración citando a la Fiscalía y da lugar a su carta de respuesta:
    "reconoció el error y dijo hacerse cargo de las consecuencias. Sin embargo, aseguró que no podía
    retractarse de lo que había dicho".

- medio: montevideo-portal
  url: https://www.montevideo.com.uy/Noticias/Diputado-Lust-presento-denuncia-penal-en-Fiscalia-contra-Tabare-Vazquez-por-UPM-II-uc758508
  fecha: 2020-07-14
  evento: "propuesto:denuncia-upm-ii-lust-2020"
  politico: vazquez
  tono: neutral
  justificacion: >-
    Todo lo afirmativo está atribuido al denunciante, incluido el condicional: "En la denuncia Lust señala
    que Vázquez y su gabinete 'habrían violado artículos del Código Penal'".

- medio: 180-com-uy
  url: https://www.180.com.uy/articulo/83536_lust-denuncia-cambio-en-un-coma-que-habria-causado-perdida-millonaria-en-contrato-de-upm-2&ref=delsol
  fecha: 2020-07-03
  evento: "propuesto:denuncia-upm-ii-lust-2020"
  politico: vazquez
  tono: neutral
  justificacion: >-
    Contrasta la denuncia con el documento público antes de darla por buena: "El contrato que está
    publicado en la web de Presidencia con fecha 7 de noviembre de 2017, sostiene que el costo para UPM
    […] será de US$ 0,5 por tonelada bruta/km. Pero Lust sostiene que ese no es contrato final".

- medio: la-diaria
  url: https://ladiaria.com.uy/politica/articulo/2021/1/fiscalia-archivo-la-denuncia-del-diputado-eduardo-lust-por-el-contrato-de-upm-ii/
  fecha: 2021-01-05
  evento: "propuesto:denuncia-upm-ii-lust-2020"
  politico: vazquez
  tono: neutral
  justificacion: >-
    Informa el archivo con el fundamento entrecomillado y sin calificar a ninguna de las partes: "no se
    verifica una desviación o irregularidad en la conducta de los investigados, pasible de ser sancionada
    penalmente".

- medio: ambito
  url: https://www.ambito.com/uruguay/la-oposicion-cuestiona-sana-politica-cardama-y-el-frente-amplio-redobla-criticas-la-gestion-anterior-n6245664
  fecha: 2026-02-13
  evento: "propuesto:rescision-contrato-cardama-2026"
  politico: delgado
  tono: neutral
  justificacion: >-
    Da el mismo espacio a las dos bancadas, con citas literales de cada una: junto al "Enorme
    irresponsabilidad del gobierno, actuando con saña política" de Delgado aparece "Políticas también son
    las responsabilidades de quienes fueron adelante con este proceso de compra" de la senadora Díaz.
```

Reparto de tono, para que se vea el criterio: 35 registros, 25 `neutral`, 8 `desfavorable`, 2
`favorable`. Los `desfavorable` recaen sobre notas referidas a Argimón (PN), Cosse (FA, dos), Manini Ríos
(CA, dos), Ojeda (PC, dos) y Sendic (FA); los `favorable`, sobre notas referidas a Cosse (FA) y Orsi
(FA). Por medio: El Observador 11 notas (2 desfavorable), Montevideo Portal 6 (2), Caras y Caretas 5 (3
desfavorable y 2 favorable, la única que marca en los dos sentidos), la diaria 4 (0), Búsqueda 3 (1),
Subrayado 2 (0), Portal 180 2 (0), EFE 1 (0), Ámbito 1 (0). En los dos sentidos la marca exigió una
frase del cuerpo, no del titular, y no ajusté el umbral por partido ni por medio.
