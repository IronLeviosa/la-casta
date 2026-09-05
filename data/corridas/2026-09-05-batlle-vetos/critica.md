# Crítica — corrida 2026-09-05-batlle-vetos

Modelo: claude-sonnet-5 (brazo barato del experimento descrito en `EXPERIMENTO.md`; el rol de crítico
corre normalmente con Opus — instrucción del encargo, no decisión mía)
Lote: inbox/batlle/vetos/2026-09-05/
Registros revisados: 9 vetos, 0 declaraciones (`declaraciones.yaml` es una lista vacía por diseño)

Nota de método: para el hallazgo prioritario (comparabilidad entre lotes) volví a consultar en vivo,
con `pnpm fuente` y con `curl` directo cuando el extractor falla sobre HTML dinámico, los mismos
buscadores oficiales del Parlamento que usaron los investigadores de Batlle, Vázquez y Mujica, para
las cuatro legislaturas en juego (45, 46, 47, 48). Para el lote propiamente dicho, releí las nueve
fuentes de `vetos.yaml` completas con `pnpm fuente --buscar` y `--desde`, recalculé a mano los seis
umbrales de tres quintos, y comparé cada `fundamento` contra el texto íntegro del mensaje de
observaciones, no solo contra el fragmento que quedó citado en `evidencia`.

## Hallazgo prioritario: la tabla comparativa entre presidentes no se puede publicar tal como está planteada

La pregunta que se me pidió resolver primero: ¿existe el índice de repartidos de la Asamblea General
para 2010-2015 y para los mandatos de Vázquez, y si existe, se usó? Repliqué las consultas oficiales
yo mismo, en esta sesión, para las cuatro legislaturas relevantes.

**El índice de "Repartidos" de Asamblea General:**

- Legislatura 45 (Batlle, 2000-2005): `https://parlamento.gub.uy/camarasycomisiones/asambleageneral/documentos/repartidos?Lgl_Nro=45&Rptd_Anio=&Rptd_Nro=&Tipobusqueda=All&Texto=` devuelve textualmente "Actualmente no hay repartidos para esta consulta" (confirmado con `curl` directo sobre el HTML crudo, porque el extractor de `pnpm fuente` solo recupera el pie de página en esta página dinámica — el mismo problema que ya documentó el investigador en `verificacion_manual`). **No existe.**
- Legislatura 46 (Vázquez, primer mandato, 2005-2010): la misma consulta con `Lgl_Nro=46` devuelve el mismo mensaje, "Actualmente no hay repartidos para esta consulta" (confirmado con `curl`). **No existe**, igual que para Batlle.
- Legislatura 47 (Mujica, 2010-2015): existe, pero solo parcialmente — 15 repartidos, numerados 8 a 23, del 2012-01 al 2014-07 (así lo documentó y verificó el propio investigador de Mujica en `data/corridas/2026-09-05-mujica-vetos/crudo/notas.md`, líneas 90-107, y lo repliqué). Deja sin cobertura por este método los primeros ~22 meses del mandato (2010-03 a 2011-12), casi el 40% del período.
- Legislatura 48 (Vázquez, segundo mandato, 2015-2020): **existe completo**. Lo consulté yo mismo con `pnpm fuente "https://parlamento.gub.uy/camarasycomisiones/asambleageneral/documentos/repartidos?Lgl_Nro=48&Rptd_Anio=&Rptd_Nro=&Tipobusqueda=All&Texto="` y devuelve 18 repartidos entre 2015/6 y 2019/9, ninguno relacionado con una observación del Poder Ejecutivo (son ceses y designaciones de ministros de la Suprema Corte y del TCA, comisiones, informes de la INDDHH). Esto cubre el segundo mandato de Vázquez de punta a punta, porque toda la legislatura 48 cae después del 01/01/2012.

Ese último punto contradice lo que dice el propio `notas.md` de la corrida `2026-09-05-vazquez-vetos`
(línea 66-70): *"el buscador de 'Repartidos' de la Asamblea General... no se pudo usar ese método...
para verificar de forma mecánica la ausencia de vetos en 2005-2010 **ni en gran parte de 2015-2020**"*.
Repliqué la consulta con el filtro correcto (`Lgl_Nro=48`, la legislatura del segundo mandato) y el
método sí funciona, completo, para todo ese período — tardé menos de un minuto en confirmarlo. La
investigación de Vázquez solo probó el aviso genérico de la página ("disponibles a partir de
01/01/2012", `consultas.jsonl` línea 32) sin filtrar por la legislatura correspondiente, concluyó que
el método "no se pudo usar" para el segundo mandato, y en su lugar apoyó la conclusión de "un solo
veto en diez años" en prensa, biografías y un libro académico — el método menos riguroso de los cinco
que se están por comparar en el sitio.

**El índice de "Diarios de sesión" de Asamblea General** (el método que sí se usó para Batlle, leyendo
los 78 diarios uno por uno) también lo repliqué para las otras tres legislaturas:

- Legislatura 46 (Vázquez I): `https://parlamento.gub.uy/documentosyleyes/documentos/diarios-de-sesion?Cpo_codigo=A&Lgl_Nro=46&Tipobusqueda=All&Texto=` devuelve al menos 41 diarios de sesión en la primera página (con paginación adicional, `page=1` visible en el HTML), es decir, **existe** — el mismo tipo de fuente que permitió cubrir a Batlle de forma exhaustiva. No se usó para Vázquez.
- Legislatura 47 (Mujica): la misma consulta con `Lgl_Nro=47` también devuelve al menos 41 diarios de sesión, **existe**, incluidos años 2010-2011 (el tramo que el investigador de Mujica señaló como no cubierto por repartidos y cerró con un método más débil: 9 leyes elegidas a mano más una lectura de títulos que el propio investigador califica como "parcial y no exhaustiva", `crudo/notas.md` líneas 108-135). El método que hubiera cerrado ese hueco con el mismo rigor que Batlle —leer los diarios de sesión de 2010-2011— existía y no se usó.
- Legislatura 48 (Vázquez II): también devuelve diarios de sesión disponibles.

**Conclusión, con la claridad que se me pidió:** el índice de repartidos no existe para Batlle ni para
el primer mandato de Vázquez — en eso la asimetría es de la fuente, no de este lote, y el investigador
de Batlle lo documentó honestamente y compensó con el método más caro y más exhaustivo que hay (77-78
diarios de sesión leídos uno por uno). Pero el índice de repartidos **sí existe, completo, para el
segundo mandato de Vázquez**, y existe el índice de diarios de sesión —el método más riguroso, el que
Batlle recibió— **para las tres legislaturas restantes** (46, 47 y 48), y no se usó en ninguna de
ellas. Esto no es un matiz menor: significa que el conteo que va a aparecer en la tabla del sitio
("Batlle: 18, Vázquez: 1, Mujica: 0") no compara conducta, compara cuánto se buscó. El presidente con
el número más alto de vetos es, con ventaja considerable, el que recibió la investigación más
profunda; los presidentes con menos vetos (Mujica con 0, Vázquez con 1) son también los que recibieron
métodos más débiles, con huecos documentados por sus propios investigadores, sobre legislaturas donde
el mismo tipo de fuente que sirvió para Batlle está disponible y sin usar. Esto ya lo había señalado,
de forma independiente y con otro método de control (replicar la búsqueda de repartidos contra un veto
confirmado de otro presidente), el crítico de la corrida `2026-09-04-orsi-vetos` (ver ese `critica.md`,
sección final): la comparación "Lacalle Pou vetó 4 veces, Orsi 0" corría el mismo riesgo, y ahí también
se recomendó no publicar la comparación sin parejar el método. El patrón se repite ahora entre Batlle,
Vázquez y Mujica.

Por Regla 0: si se va a publicar una tabla comparando presidentes por cantidad de vetos, el criterio de
búsqueda tiene que ser el mismo para los cinco, o la tabla tiene que decir explícitamente, al lado de
cada número, qué tan profundo se buscó y qué huecos quedan. Public tal como está — con Batlle
exhaustivamente verificado y los demás con métodos que sus propios investigadores señalan como
parciales o mal aplicados — no es una comparación de gobiernos, es una comparación de presupuesto de
investigación, y el lector no tiene forma de distinguir una cosa de la otra.

- severidad: **bloquea** (para cualquier tabla, ranking o afirmación comparativa entre presidentes
  publicada en el sitio a partir de estos conteos) / **sin_objecion** (para la publicación de los 9
  vetos de Batlle en sí mismos, considerados de forma aislada: están bien verificados, ver más abajo)
- tipo: asimetria
- accion_sugerida: antes de publicar cualquier comparación visible entre presidentes por cantidad de
  vetos, (a) correr el barrido de diarios de sesión de Asamblea General (legislaturas 46, 47 y 48,
  URLs arriba) con el mismo rigor que se aplicó a Batlle, o (b) si eso no se hace, que la tabla
  muestre junto a cada número el método y su profundidad ("78 diarios de sesión leídos" vs. "prensa y
  un libro académico"), para que la comparación no se lea como diferencia de conducta. Señalar además
  a quien mantiene el sitio que esta misma objeción ya fue planteada, con otro método, en
  `data/corridas/2026-09-04-orsi-vetos/critica.md`.

## Objeciones por registro

### vetos[0] — 2001-01-10 — Ley de Presupuesto Nacional 2000-2004
- severidad: corregir
- tipo: contexto_omitido
- objecion: Dos hallazgos, ninguno grave, ambos con la misma fuente ya citada (`6524934.PDF`). (1) El
  `resultado.detalle` no incluye el recuento de la votación que efectivamente levantó el veto a los
  seis artículos. Volví a leer el diario completo (carácter ~210 194 en adelante) y la Asamblea General
  votó "-116 en 117. Afirmativa" para la moción de rechazar las observaciones a los artículos 329, 331,
  468, 470, 549 y 557, y después, en la votación nominal en bloque, "Han sufragado 121 señores
  Legisladores y todos lo han hecho por la afirmativa" (121 de 121, unanimidad), con el propio
  Presidente aclarando que "la votación comprende los tres [quintos]" exigidos. El dato existe en la
  misma fuente ya citada como `evidencia`, no hace falta buscar nada nuevo, y da un resultado incluso
  más contundente (unanimidad) que el de los otros cinco vetos levantados, que sí tienen su recuento en
  el registro. Es una inconsistencia de nivel de detalle entre registros del mismo lote, no un error de
  fondo. (2) El propio registro ya es honesto sobre esto, pero conviene remarcarlo: de los 19 artículos
  observados, solo 6 tienen desenlace documentado en esta sesión; el `resultado.estado: veto_levantado`
  a nivel de todo el registro describe, estrictamente, el desenlace de esos 6, no de los 19. El texto de
  `resultado.detalle` ya lo dice explícitamente ("su desenlace individual no quedó documentado"), así
  que no es una omisión, pero valdría la pena que el `analisis` lo repita para que un lector que solo
  lea el análisis no asuma que los 19 artículos corrieron la misma suerte.
- cita_de_contexto: "Han sufragado 121 señores Legisladores y todos lo han hecho por la afirmativa. SEÑOR PRESIDENTE.- Corresponde señalar que la votación comprende los tres [quintos]" — https://infolegislativa.parlamento.gub.uy/temporales/6524934.PDF
- accion_sugerida: agregar al `resultado.detalle` el recuento 121/121 (o al menos la cifra de la moción previa, 116/117) para que este registro tenga el mismo nivel de verificación explícita que los otros cinco; y agregar una frase en `analisis` aclarando que el desenlace documentado cubre 6 de los 19 artículos observados.

### vetos[1] — 2001-05-16 — Grado inmediato superior a Oficiales Generales y Superiores en retiro
- severidad: corregir
- tipo: contexto_omitido
- objecion: El `fundamento` del registro dice que el Poder Ejecutivo se opuso "sin detallar en el
  extracto disponible un único motivo central más allá de esa fórmula general" (la fórmula genérica de
  "razones constitucionales, legales, instrumentales y de conveniencia"). Volví a leer el mensaje
  completo (mismo PDF ya citado, caracteres ~14 500-17 000) y el motivo específico sí está detallado,
  con cita legal concreta: el proyecto ascendía a oficiales retirados sin que se cumpliera ninguno de
  los requisitos legales para el ascenso de un militar en retiro (reincorporación por acto
  administrativo del Poder Ejecutivo, situación de actividad o movilización, cumplimiento del sistema
  de ascenso por antigüedad/selección/concurso aplicable al grado), citando expresamente los artículos
  183, 185, 187 y 188 del Decreto-Ley N.º 14.157. El mensaje dice literalmente: "no existe iniciativa
  del Poder Ejecutivo, ni tampoco la aplicación de los presupuestos del sistema de ascenso aplicable al
  grado... los Oficiales que se desea ascender no se encuentran en actividad... por lo que tampoco han
  sido reincorporados". Esto no es un error que cambie el resultado (el veto y su levantamiento están
  bien documentados), pero el `fundamento` tal como está redactado subestima lo que la propia fuente ya
  citada permite afirmar, y un lector se queda sin saber cuál fue, en concreto, el argumento jurídico
  del Poder Ejecutivo.
- cita_de_contexto: "En consecuencia en el proyecto de ley sancionado no se da ninguno de los presupuestos previstos en la normativa para proceder al ascenso, es decir, no existe iniciativa del Poder Ejecutivo, ni tampoco la aplicación de los presupuestos del sistema de ascenso aplicable al grado" — https://infolegislativa.parlamento.gub.uy/temporales/6618078.PDF
- accion_sugerida: reescribir `fundamento` para incluir el argumento concreto (falta de iniciativa del Poder Ejecutivo y de cumplimiento de los requisitos legales de ascenso para militares retirados, Decreto-Ley 14.157), en vez de la fórmula genérica actual. No requiere fuente nueva.

### vetos[2] — 2002-12-29 — Derechos jubilatorios ante el BPS de docentes de ANEP
- severidad: sin_objecion
- tipo: sin_objecion
- objecion: Releí el diario completo. El `fundamento` ("no era una norma meramente interpretativa...
  carecía de la iniciativa privativa... artículo 86 inciso 2°... generaba desigualdad frente a otros
  destituidos") coincide, casi palabra por palabra, con el texto del mensaje: "la nueva norma
  proyectada no es de naturaleza interpretativa, implica una modificación de los beneficios
  jubilatorios y por tanto carece de la correspondiente iniciativa privativa del Poder Ejecutivo
  establecida en el artículo 86 inciso 2°... la norma aprobada crea una situación de desigualdad para
  con los destituidos de otros sectores". Los recuentos de votos (Senado 17/28, Diputados 51/77) están
  verificados letra por letra y el umbral de 3/5 no es un cálculo del investigador: lo proclama el
  propio Presidente de la Asamblea en la sesión ("En ambas Cámaras se han alcanzado los tres quintos de
  votos"). Sin objeción.
- cita_de_contexto: "En ambas Cámaras se han alcanzado los tres quintos de votos, por lo que quedan levantadas las observaciones del Poder Ejecutivo." — https://infolegislativa.parlamento.gub.uy/temporales/2370801.PDF
- accion_sugerida: ninguna.

### vetos[3] — 2003-09-25 — Exclusión de cajeros automáticos para el cobro de pasividades (BPS)
- severidad: sin_objecion
- tipo: sin_objecion
- objecion: Releí el mensaje completo. El `fundamento` ("especialización del Ente", invasión de la
  autonomía administrativa del BPS, oposición al uso de "un adelanto tecnológico") coincide con el
  texto: "la facultad de regular el sistema de pago de sus prestaciones es función administrativa,
  materia privativa del Banco de Previsión Social... hace referencia a la 'especialización del Ente'...
  la misma supone la no utilización de un adelanto tecnológico (cajero automático)". Los recuentos
  (Diputados 55/82, Senado 17/27, este último justo en el límite exacto de 17 sobre 27) están
  verificados contra el texto, y el propio diario aclara "los tres quintos de veintisiete son
  diecisiete", no es un redondeo hecho por el investigador. Sin objeción.
- cita_de_contexto: "la facultad de regular el sistema de pago de sus prestaciones es función administrativa, materia privativa del Banco de Previsión Social... hace referencia a la 'especialización del Ente'" — https://infolegislativa.parlamento.gub.uy/temporales/4321760.PDF
- accion_sugerida: ninguna.

### vetos[4] — 2003-12-26 — Sustitución del artículo 154 de la Ley 17.556 (licitaciones portuarias)
- severidad: aviso
- tipo: sin_objecion
- objecion: Los recuentos (Diputados 53/69, Senado 18/27) están verificados letra por letra contra la
  cita y superan los umbrales (42 y 17 respectivamente). Único punto menor: a diferencia de los otros
  cinco vetos levantados, este registro no indica explícitamente cuál era el umbral requerido en cada
  Cámara (solo dice "alcanzando en ambos casos la mayoría constitucional"), lo que hace el registro
  levemente menos auditable a simple vista que sus pares del mismo lote. No cambia el resultado.
- cita_de_contexto: "Han votado sesenta y nueve señores Representantes: cincuenta y tres lo hicieron por la afirmativa y dieciséis por la negativa; y han votado veintisiete señores Senadores: dieciocho lo hicieron por la afirmativa y nueve por la negativa." — https://infolegislativa.parlamento.gub.uy/temporales/1921179.PDF
- accion_sugerida: agregar, como en los otros registros, el número exacto de votos requeridos (42 en Diputados, 17 en Senado) junto al resultado.

### vetos[5] — 2003-11-17 — Caja de Profesionales Universitarios (artículo 43)
- severidad: sin_objecion
- tipo: sin_objecion
- objecion: Este es el único de los nueve que usa el mecanismo de aceptación tácita del artículo 139
  (no una votación de rechazo). La cita confirma que la propia Asamblea General dejó consignado el
  mecanismo en su acta ("transcurrido el artículo 139 de la Constitución sin que la Asamblea General se
  pronunciara"), no es una inferencia del investigador contando los treinta días por su cuenta —
  distinción que sí importó como objeción en la crítica de un lote anterior (Lacalle Pou, veto a la Ley
  de Medios) y que acá está resuelta correctamente porque el propio cuerpo legislativo asienta la
  conclusión, no el investigador. El tiempo transcurrido entre el mensaje (17-11-2003) y la sesión
  (20-01-2004) es de unos 64 días, más que suficiente para que corrieran los 30 días del artículo 139.
  Sin objeción.
- cita_de_contexto: "artículo 139 de la Constitución sin que la Asamblea General se pronunciara sobre las observaciones interpuestas por el Poder Ejecutivo" — https://infolegislativa.parlamento.gub.uy/temporales/6230056.PDF
- accion_sugerida: ninguna.

### vetos[6] — 2004-06-13 — Normas sobre cooperativas de producción o trabajo asociado
- severidad: sin_objecion
- tipo: sin_objecion
- objecion: La cita del `resultado` ("La Asamblea General resuelve aceptar las observaciones
  interpuestas y aprobar el Mensaje complementario") coincide con el diario. El `analisis` describe la
  negociación con las entidades del sector en lenguaje neutro ("negoció... un texto complementario"),
  sin verbo de intención ni valoración. Sin objeción.
- cita_de_contexto: "Ha ingresado a la Asamblea General... un Mensaje con un texto complementario... que, según se indica, ha sido acordado entre el Poder Ejecutivo y las entidades más representativas del cooperativismo." — https://infolegislativa.parlamento.gub.uy/temporales/9768165.PDF
- accion_sugerida: ninguna.

### vetos[7] — 2004-09-14 — Tope del 80% a retenciones sobre retribuciones y pasividades
- severidad: sin_objecion
- tipo: sin_objecion
- objecion: Registro breve y bien acotado: la cita del resultado ("Se resuelve aceptar las
  observaciones del Poder Ejecutivo") coincide exactamente, y el `fundamento` no sobreafirma más de lo
  que la fuente permite (describe la propuesta del 20%→30% sin atribuirle al Ejecutivo un motivo que no
  esté en el texto). Sin objeción.
- cita_de_contexto: "Se resuelve aceptar las observaciones del Poder Ejecutivo. - Sanción. - Se comunicará al Poder Ejecutivo." — https://infolegislativa.parlamento.gub.uy/temporales/7346584.PDF
- accion_sugerida: ninguna.

### vetos[8] — 2004-09-28 — Impuesto transitorio para la Caja de Jubilaciones y Pensiones Bancarias
- severidad: sin_objecion
- tipo: sin_objecion
- objecion: Este es el registro más cuidadoso del lote en cuanto a no sobreafirmar: el propio `analisis`
  aclara que "el texto formal de la observación del Poder Ejecutivo no se encontró reproducido en el
  diario de sesiones consultado... el fundamento arriba descrito se apoya en lo que los propios
  legisladores debatieron sobre su contenido, no en una cita directa del mensaje". Es exactamente la
  distinción correcta entre lo que un documento dice y lo que se infiere del debate sobre él, y el
  registro la marca en vez de esconderla. Los recuentos (Senado 22/24, Diputados 67/80, ambos por la
  negativa, es decir a favor de levantar el veto) están verificados contra la cita. Sin objeción.
- cita_de_contexto: "Han sufragado 24 señores Senadores, 22 lo hicieron por la negativa y 2 por la afirmativa; y 80 señores Diputados, 67 por la negativa y 13 por la afirmativa. En ambos casos se han alcanzado los márgenes constitucionales" — https://infolegislativa.parlamento.gub.uy/temporales/9753561.PDF
- accion_sugerida: ninguna.

### declaraciones.yaml (vacío)
- severidad: aviso
- tipo: asimetria
- objecion: No hay ninguna declaración pública de Batlle sobre ninguno de los nueve vetos, más allá del
  propio mensaje de observaciones. `notas.md` documenta que se buscó activamente para cada uno de los
  nueve (`consultas.jsonl`, líneas ~1957-1958) y que la ausencia responde a que la hemeroteca de El País
  y Búsqueda para 2000-2005 no tiene archivo digital público indexable por buscador — es una limitación
  de la fuente para esta época, no una omisión de esta investigación, y es simétrica: le pasaría lo
  mismo a cualquier otro político de este período. Vale la pena que quien mantiene el sitio sepa que
  esto significa que la ficha de Batlle, a diferencia de la de Lacalle Pou u Orsi, no va a tener la voz
  del propio presidente sobre sus vetos, lo cual puede leerse (erróneamente) como que Batlle no opinó,
  cuando en realidad es que no está digitalizado.
- accion_sugerida: si en el futuro se consigue acceso a la hemeroteca física de El País o Búsqueda para 2000-2005 (archivo en papel, microfilm), valdría la pena repetir esta búsqueda específica.

## Objeciones al lote

1. **Comparabilidad entre presidentes**: ver la sección dedicada arriba. Es la objeción más importante
   de esta crítica y aplica a cómo se use este lote junto con los otros cuatro, no a los 9 vetos en sí.
2. **Trece fuentes con `verificacion: manual`, repartidas en seis de los nueve registros.** Conté
   directamente en `vetos.yaml`: 13 ocurrencias de `verificacion: manual`, en los vetos de Presupuesto
   (2), Oficiales Generales (2), Cajeros automáticos (3), Art. 154 Ley 17.556 (2), Caja de Profesionales
   Universitarios (2) y Cooperativas (2). Solo tres de los nueve registros (Docentes ANEP, Retribuciones
   80% y Caja Bancaria) no dependen de ninguna fuente manual, porque para esos tres `pnpm validar --red`
   confirma un archivado en Wayback que sí funciona. Según la regla del proyecto ("fuentes no
   verificables mecánicamente... también requieren aprobación"), **6 de los 9 vetos de este lote no
   pueden llegar a tier `publicado` sin que el mantenedor apruebe cada uno con `pnpm aprobar`** — es
   trabajo de firma real, no un detalle de forma. Razón de fondo, ya explicada honestamente por el
   investigador en `verificacion_manual`: las URLs de `infolegislativa.parlamento.gub.uy/temporales/*.PDF`
   usan identificadores temporales que el propio Parlamento reemplaza con el tiempo, y las diez que se
   citan en este lote ya devuelven HTTP 404 hoy; el contenido está preservado en el corpus (`la-casta-corpus/notas/*.json`) y varias veces en Wayback, pero no en la URL original citable por un lector.
   - severidad: aviso
   - tipo: riesgo_legal (compuerta de aprobación, no de exactitud)
   - accion_sugerida: informar al mantenedor que este lote implica seis aprobaciones manuales antes de publicar, y considerar pedirle al Parlamento (o a IMPO) una URL permanente por diario de sesión, ya que el patrón de URLs temporales que caducan es sistémico en esta fuente y va a repetirse en cualquier otra corrida que use `infolegislativa.parlamento.gub.uy/temporales/`.
3. **El patrón de "falta de quórum" está correctamente confinado a hipótesis, no a hecho.** Revisé
   específicamente que ningún `analisis` publicado en `vetos.yaml` (los nueve, arriba) afirme que los
   proyectos sin desenlace murieron por falta de quórum, ni que lo caracterice como estrategia
   deliberada — y no lo hace, porque ninguno de los nueve vetos sin desenlace está en `vetos.yaml`
   (quedaron correctamente fuera por la regla "sin desenlace no se publica"). En `notas.md`, la sección
   `hipotesis` sí menciona ambas ideas (aceptación tácita por falta de quórum, y la cita de Chasquetti
   2013 sobre "la clásica estrategia de no formar quórum... con la complicidad de una parte de los
   legisladores del Partido Nacional"), pero las presenta correctamente como hipótesis de un tercero
   (atribuida a Chasquetti, no a la propia investigación) y aclara explícitamente: "esta investigación
   no determinó, para cada caso puntual, qué bancada específica dejó de concurrir ni si fue
   deliberado". Es el tratamiento correcto de una atribución de intención sin fuente que la pruebe caso
   por caso. Sin objeción sobre este punto específico.
4. **Simetría partidaria en el lenguaje.** Batlle es, hasta donde vi en `content/politicos/`, el único
   político del Partido Colorado con contenido en el sitio, así que no hay otro registro del mismo
   partido con el que comparar internamente. Comparé el tono de los nueve `analisis` contra los de los
   cuatro vetos ya publicados de Lacalle Pou (`content/vetos/lacalle-pou/*.yaml`): el registro de ambos
   usa el mismo tipo de lenguaje neutro y descriptivo ("por entender que", "La Asamblea General reunió
   los tres quintos..."), sin adjetivos ni verbos de intención en ninguno de los dos lotes. Un dato a
   favor de la disciplina editorial de este lote específico: la fuente secundaria que el investigador
   leyó para corroborar el conteo total (parlamentodata.com, ver "Cobertura") usa un lenguaje bastante
   más crítico sobre la conducta del gobierno de Batlle en sus últimos dos años ("recurrió a la clásica
   estrategia de no formar quórum en las sesiones y comisiones consideradas peligrosas para sus
   intereses"), y ese lenguaje **no se filtró** a ningún `analisis` publicado — quedó correctamente
   confinado a `notas.md` como hipótesis atribuida. Sin objeción.
5. **`parlamentodata.com` no está en `content/medios/`.** El investigador declaró en `medios_faltantes`
   que no había medios nuevos, y es cierto en el sentido estricto de que ningún registro de `vetos.yaml`
   cita ese dominio como `Fuente` — pero sí lo usó como corroboración sustantiva en `notas.md` (el
   número "18 vetos" que ancla buena parte de la confianza del lote en su propia exhaustividad viene de
   ahí). Vale la pena que quede como medio dado de alta para que la próxima corrida que lo use pueda
   citarlo formalmente.
   - severidad: aviso
   - tipo: sin_objecion (no es un error, es un alta pendiente)
   - accion_sugerida: dar de alta `parlamentodata.com` en `content/medios/` (grupo y alineamiento a determinar por quien lo mantiene; es un blog especializado en análisis legislativo, no clasificado hasta ahora).

## Objeciones al brief

Ninguna. El brief pide cubrir el mandato completo, decir explícitamente cuando no hubo vetos o cuando
un veto no tiene desenlace, verificar el procedimiento constitucional en la fuente antes de registrar
el primer veto, y no pide seleccionar ni encuadrar por partido — Batlle es, además, el primer
presidente colorado que entra al sitio, así que no hay margen para "elegir" un resultado más o menos
favorable a un patrón previo. El investigador cumplió con las diez reglas duras y documentó de forma
explícita cada ausencia (declaraciones, artículos sin desenlace, mandato de campaña 1999). No encontré
ninguna instrucción del brief que violara la Regla 0.

## Cobertura

```yaml
- medio: parlamentodata.com
  url: https://parlamentodata.com/2019/11/05/como-fueron-los-ultimos-dos-anos-de-gobierno-de-jorge-batlle/
  fecha: 2019-11-05
  evento: "propuesto:vetos-gobierno-en-minoria-batlle-2002-2005"
  politico: batlle
  tono: desfavorable
  justificacion: >-
    Describe la actividad legislativa del final del mandato como una serie de maniobras del gobierno
    para evitar derrotas parlamentarias: "el gobierno recurrió a la clásica estrategia de no formar
    quórum en las sesiones y comisiones consideradas peligrosas para sus intereses. Para ello contó
    con la complicidad de una parte de los legisladores del Partido Nacional."
  nota: >-
    `parlamentodata.com` no figura todavía en `content/medios/` (ver "Objeciones al lote", punto 5);
    el slug de medio de este registro es una propuesta, no un valor validado contra la tabla actual.
```

Nota sobre el resto del lote: los nueve vetos de `vetos.yaml` y la ausencia de declaraciones dependen
enteramente de fuentes `parlamento` (diarios de sesión y fichas de trámite), que son `documento_oficial`
o `diario_de_sesiones`, no prensa — así que no generan más registros de `cobertura` (que mide tono de
notas de prensa, no de actas oficiales). No encontré, en esta corrida, ninguna discrepancia entre lo
publicado por un medio y un documento primario que cumpliera los tres límites de `discrepancias.yaml`
(solo contra fuente primaria, sin verbos de intención, mismo umbral para todos): no hay prensa contigua
citando estos vetos específicos en el lote, y la única nota de prensa leída (parlamentodata.com) reporta
un número agregado ("18 vetos") que el propio investigador ya marcó como no verificable uno a uno contra
su lista, sin que eso constituya un dato puntual contradicho por un documento oficial específico. Por
eso no escribí `discrepancias.yaml` para esta corrida.
