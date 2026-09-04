# Crítica — corrida 2026-09-04-lacalle-pou-economia-impuestos

Modelo: claude-opus-5 (Claude Code / Agent SDK)
Lote: inbox/lacalle-pou/economia/impuestos/2026-09-04/
Registros revisados: 17 (declaraciones 9, promesas 1 + 6 evidencias candidatas, menciones 1)
Fuentes releídas: 18 notas del corpus (12 citadas en el lote + 6 leídas en la corrida y no citadas)

Severidades: 1 bloquea · 11 corregir · 5 aviso

Nota de método: no verifiqué literalidad de citas (ya lo hizo `pnpm validar --red`). Releí el texto
completo de cada fuente desde el corpus (`la-casta-corpus/notas/*.json`, el mismo contenido que
devuelve `pnpm fuente`) para buscar contexto omitido y explicaciones alternativas.

---

## Objeciones por registro

### declaraciones[0] — 2019-03-30 — "Si gana el Partido Nacional se terminó el aumento de impuestos…"
- severidad: corregir
- tipo: contexto_omitido
- objecion: Las dos fuentes dan la frase con **orden distinto de sustantivos** — Subrayado:
  "el aumento de impuestos, las tarifas y los combustibles"; El Observador: "el aumento de tarifas,
  impuestos y combustibles" — lo que prueba que al menos una de las dos no es transcripción literal
  del acto, aunque ambas sean citas literales de sus respectivas notas. El registro toma la versión
  de Subrayado como `cita` del político. Además, el `resumen` es casi copia de la bajada de
  Subrayado. Y el propio Subrayado avisa que existe el video del acto completo, que nadie usó: es la
  fuente primaria de la promesa que estructura todo el lote y no se citó.
- cita_de_contexto: "(En el siguiente video se puede ver el acto completo. Lacalle Pou comienza su
  discurso en el minuto 14)." — https://www.subrayado.com.uy/si-ganamos-se-termino-la-suba-impuestos-tarifas-y-combustibles-n530131
- accion_sugerida: subir la promesa a `nivel: textual` con el video del acto del Parque Viera
  (30/03/2019) y `marca_tiempo` ~14:00, o dejar constancia en el resumen de que las versiones de
  prensa difieren en el orden. Fuente adicional ya leída en esta corrida y no usada, de tercer grupo:
  https://www.180.com.uy/articulo/78834_lacalle-pou-prometio-no-aumentar-impuestos-tarifas-publicas-ni-combustibles
  ("se comprometió a no aumentar impuestos, tarifas públicas y combustibles").

### declaraciones[1] — 2019-11-14 — "El esfuerzo ya lo hizo la gente, ahora le toca al gobierno…"
- severidad: corregir
- tipo: cita_fuera_de_contexto
- objecion: El `resumen` afirma que "dijo que no piensa incrementarlos". Eso **no está en la cita ni
  en boca de él**: es paráfrasis del periodista de Infobae ("acotó que no piensa en incrementar los
  impuestos"). La cita registrada, por sí sola, no contiene ninguna promesa: es un reproche al
  programa del FA más una tesis sobre inversión y rentabilidad. Segundo: el mismo debate contiene el
  contrapunto de Martínez, que también prometió no subir impuestos — dato que cambia la lectura de
  "el FA va a subir impuestos" y que el registro omite.
- cita_de_contexto: "yo decido que los impuestos no van a variar" (Daniel Martínez, mismo debate) —
  https://www.infobae.com/america/america-latina/2019/11/14/daniel-martinez-y-luis-lacalle-pou-chocaron-en-un-ultimo-y-tenso-debate-en-uruguay/
- accion_sugerida: reescribir el `resumen` atribuyendo la paráfrasis al medio ("según Infobae, acotó
  que…") o reemplazar la fuente por el video oficial del debate obligatorio (Corte Electoral / canales
  en cadena), que es documento primario y permitiría `nivel: textual`.

### declaraciones[2] — 2019-12-04 — "Dijeron que no iban a aumentar tarifas, que no iban a aumentar impuestos…"
- severidad: corregir
- tipo: contexto_omitido
- objecion: **Es la objeción más importante del lote.** Segundos antes de la frase registrada, en la
  misma transcripción, Lacalle Pou enuncia el criterio con el que después va a defender el ajuste de
  marzo de 2020: distingue "acompañar los costos" de "aumento para recaudar". El registro toma solo
  la parte de ataque al gobierno saliente y descarta la parte que, tres meses antes de asumir, fija
  públicamente la doctrina que usará para sostener que no incumplió. Sin esto, cualquier giro que el
  editor arme sobre marzo de 2020 queda sin la explicación alternativa más fuerte que existe, y que
  además está en una fuente que el lote ya cita.
- cita_de_contexto: "En realidad lo que debería de haber pasado ahora no es un aumento de los precios
  de las tarifas. Básicamente es acompañar los costos de las tarifas. […] acompañar los costos no es
  un aumento de tarifas para recaudar. Eso es lo que nosotros históricamente sostuvimos, que es un
  aumento por encima de los costos, que de alguna manera lo que hace es tapar el agujero de que la
  administración iba generando." — https://www.youtube.com/watch?v=tHYNE5IGMyE (marca_tiempo ≈ 60–100)
- accion_sugerida: agregar esta frase como segundo registro `declaracion` del mismo video (mismo
  `textual`, otra `marca_tiempo`), o como mínimo incorporarla al `resumen` del registro actual. Es
  condición para que el editor pueda calificar `explicacion` en el giro 1.

### declaraciones[3] — 2020-03-11 — "¿Por qué se toma? Se toma porque el déficit es grande…"
- severidad: corregir
- tipo: cita_fuera_de_contexto
- objecion: Doble desajuste entre `cita` y `resumen`. (a) La cita es la respuesta específica a la
  pregunta por **la medida de IVA**, no por las tarifas; el registro la usa para resumir ambas cosas.
  (b) El resumen dice que defendió las medidas "como cumplimiento -no incumplimiento- de su promesa
  electoral". Esa tesis, con esas palabras, **no es de él**: el "se súper cumplió" es de Isaac Alfie
  (OPP) en radio Sarandí, minutos después. Lo que él dijo fue que la adecuación es "por debajo de los
  costos" y que la pregunta le corresponde al gobierno anterior. Atribuirle a él el argumento del
  cumplimiento es afirmar más de lo que la fuente respalda (art. 336 CP, real malicia: bajo, pero
  evitable con una línea).
- cita_de_contexto: "Minutos después del anuncio, Alfie dijo en el programa Hora de Cierre de radio
  Sarandí que '(el compromiso de campaña) no se incumplió, se súper cumplió'." —
  https://www.elobservador.com.uy/nota/promesas-de-lacalle-lo-que-decia-y-como-argumenta-que-no-las-incumple-202031120430
- accion_sugerida: reescribir el resumen: "Consultado por la reducción de la exoneración de IVA en
  tarjetas, atribuyó la medida al déficit heredado. En la misma conferencia calificó la suba de
  tarifas como 'adecuación por debajo de los costos'; la tesis de que el compromiso 'se súper
  cumplió' fue de Isaac Alfie (OPP), no suya." Además: verificar la fecha exacta de la conferencia —
  la diaria publica el 11/03 y su epígrafe dice "ayer, en rueda de prensa", mientras El Observador
  (12/03) dice "este miércoles"; confirmar contra el parte de Presidencia.

### declaraciones[4] — 2020-06-17 — "no se continúa aplicando el impuesto, por lo tanto en el mes de junio y julio ya no se cobra"
- severidad: bloquea
- tipo: un_solo_grupo + riesgo_legal
- objecion: Dos problemas acumulados. (a) Fuente única (montevideo-portal, grupo montevideo-comm),
  como marcó el validador. (b) Más grave: **la cita no es una declaración pública sino un mensaje
  privado, relatado por un tercero**, y la propia nota lo pone en potencial ("Así lo habría
  confirmado"). Publicar esas palabras como `cita` textual de Lacalle Pou, con una sola fuente que
  además se cubre con el condicional, es exactamente lo que no puede salir sin respaldo. El *hecho*
  (no se prorrogó el tributo) sí está corroborado; la *cita* no.
- cita_de_contexto: "Así lo habría confirmado el presidente de la República, Luis Lacalle Pou, al
  secretario general de la Confederación de Organizaciones de Funcionarios del Estado (Cofe), Joselo
  López. […] Según dijo López a Montevideo Portal, Lacalle le envió un mensaje en el que indicaba
  que…" — https://www.montevideo.com.uy/Noticias/Lacalle-confirmo-que-deja-de-cobrarse-el-impuesto-coronavirus-a-funcionarios-publicos-uc755946
- accion_sugerida: no publicar la cita como declaración propia. O bien (i) reformular el registro
  como hecho de gobierno (no prórroga del tributo) con la segunda fuente **que el investigador ya
  leyó en esta corrida y no usó**, de otro grupo:
  https://ladiaria.com.uy/coronavirus/articulo/2020/6/gobierno-deja-de-cobrar-el-tributo-covid-19-a-los-funcionarios-publicos-y-cargos-politicos-con-sueldos-mas-altos/
  (cooperativa-la-diaria; allí el anuncio lo hace Arbeleche, no él); o bien (ii) mantener la cita con
  el resumen diciendo explícitamente que son palabras de un mensaje privado relatadas por el
  dirigente de Cofe. Ojo con la divergencia fáctica entre fuentes: la diaria dice "Junio será el
  último mes en que se recaude", la cita dice "en el mes de junio y julio ya no se cobra".

### declaraciones[5] — 2021-07-29 — "Todos los analistas y quienes competían con nosotros decían que no había forma de salir de esto sin impuestos…"
- severidad: corregir
- tipo: contexto_omitido
- objecion: (a) **Fecha inconsistente dentro del propio lote**: este registro (2021-07-29) y el
  declaraciones[6] (2021-07-28) son la *misma* entrevista al canal de YouTube de La Nación / LN+.
  Una de las dos fechas es la de publicación de la nota, no la del dicho. (b) La misma nota de la
  diaria trae la refutación fáctica que el resumen no menciona, y que es justamente el contrapunto
  del caso. (c) La afirmación "ahorramos más de US$ 600 millones" es chequeable y no tiene documento.
- cita_de_contexto: "La senadora Liliam Kechichian respondió y recordó que durante este período se
  'subió el IVA' y 'aumentó las tarifas muy por encima de la inflación'" —
  https://ladiaria.com.uy/politica/articulo/2021/7/lacalle-pou-enfatizo-que-durante-la-pandemia-se-ahorro-600-millones-de-dolares-sin-poner-impuestos/
- accion_sugerida: unificar la fecha del dicho (2021-07-28, fecha de la entrevista según El
  Observador) en ambos registros; agregar al resumen que la afirmación fue refutada en la misma nota.
  Para el Veracímetro, la cifra de ahorro se confirma o refuta con el **MEF (Rendición de Cuentas
  2020 y 2021, y presentaciones de la Unidad de Gestión de Deuda)** y con la **OPP (informes del plan
  de ahorro comprometido de US$ 900 millones)**; no la busqué yo.

### declaraciones[6] — 2021-07-28 — "es el impuesto más jorobado para quien consume…"
- severidad: corregir
- tipo: un_solo_grupo
- objecion: Fuente única (el-observador, grupo werthein-hochbaum), como marcó el validador. Además el
  registro es **de bajo valor y alto riesgo de malentendido para el tema**: la frase es una metáfora
  sobre la inflación, no una posición tributaria; publicada bajo `economia/impuestos` puede leerse
  como si hubiera hablado de un impuesto real. Y duplica el evento del registro anterior (misma
  entrevista), inflando artificialmente el conteo de declaraciones del año 2021.
- cita_de_contexto: "Consultado por la inflación, dijo que el alza del precio de la carne y de los
  combustibles hizo crecer el índice. […] Además dijo que la inflación 'es el impuesto más jorobado
  para quien consume…'" — https://www.elobservador.com.uy/nota/lacalle-pou-sobre-gestion-en-pandemia-ahorramos-mas-de-us-600-millones-sin-poner-impuestos--2021728205316
- accion_sugerida: fusionarlo como contexto dentro de declaraciones[5] (misma entrevista) o moverlo a
  `economia/inflacion`. Si se mantiene como registro propio de impuestos, exige segunda fuente de otro
  grupo o `_faltante`.

### declaraciones[7] — 2023-03-02 — "Estamos en condiciones de proceder a una baja de impuestos…"
- severidad: aviso
- tipo: contexto_omitido
- objecion: Sin objeción de fondo: `textual`, documento oficial, cita exacta, contenido correcto. Dos
  avisos. (a) La misma fuente contiene una frase que el editor necesita para el balance de la promesa
  y que el resumen omite: él encuadra la baja del IASS como **cumplimiento de un compromiso de
  campaña**, lo que amplía el contenido de la promesa registrada (no era solo "no subir": también
  "desandar el IASS"). (b) La misma fuente ya anuncia los beneficios a mipymes, es decir, es el
  respaldo documental de lo que en declaraciones[8] se sostiene solo con prensa.
- cita_de_contexto: "En igual sentido, como nos comprometimos en la campaña electoral, empezamos a
  desandar el IASS, expresó. […] Además, se proponen beneficios para micro y pequeñas empresas
  (mipymes), que son el motor económico de Uruguay, manifestó." —
  https://www.gub.uy/presidencia/comunicacion/noticias/lacalle-pou-80000-uruguayos-dejaran-pagar-irpf-iass
- accion_sugerida: incorporar la frase del IASS al resumen. Recordar al editor que presidencia.gub.uy
  es el órgano de comunicación del propio gobierno: el primario neutral del mismo discurso es el
  **diario de sesiones de la Asamblea General (Parlamento del Uruguay, sesión del 02/03/2023)**.

### declaraciones[8] — 2024-06-21 — "Se le bajaron los impuestos a las pymes…"
- severidad: aviso
- tipo: contexto_omitido
- objecion: Regla de dos grupos cumplida (werthein-hochbaum + fontaina-de-feo). Dos avisos.
  (a) Contexto omitido en la fuente de Subrayado: en el mismo discurso reconoce que las medidas
  tributarias tomadas para el litoral **no alcanzaron**, matiz que un resumen que solo dice "se
  redujeron los impuestos" no transmite. (b) La afirmación es chequeable y se publica sin documento.
- cita_de_contexto: "Repasó los mecanismos dispuestos por el Poder Ejecutivo para paliar esos efectos
  como las medidas del Banco República (BROU) y las exoneraciones impositivas a los combustibles,
  pero reconoció que no han sido suficientes." —
  https://www.subrayado.com.uy/lacalle-pou-afirmo-que-se-le-bajaron-los-impuestos-las-pymes-y-destaco-su-importancia-la-economia-n949836
- accion_sugerida: para el Veracímetro, la baja a mipymes se confirma o refuta con el **texto de la
  ley de Rendición de Cuentas 2022 en IMPO** (capítulo tributario) y con las **series de recaudación
  por impuesto de la DGI**; el anuncio previo está en el documento oficial de declaraciones[7].

### promesas[0] — 2019-03-30 — "No aumentar impuestos, tarifas públicas ni combustibles…"
- severidad: corregir
- tipo: asimetria
- objecion: La promesa está registrada como **un objeto único que mezcla tres cosas distintas**
  (impuestos, tarifas de UTE/OSE/Antel, combustibles) bajo el tema `economia/impuestos`. Es fiel a la
  frase original, pero hace imposible un veredicto honesto: una suba de tarifas —que no es un
  impuesto— arrastraría a "incumplida" el componente tributario, y a la inversa una rebaja de IRPF
  podría lavar un incumplimiento tarifario. Las fuentes muestran que la frase se dijo así de
  agregada, pero también que él la desagregó después (doctrina "acompañar costos" para tarifas; "no
  meterle la mano en el bolsillo" para impuestos). Segunda objeción: faltan como evidencias las
  **reiteraciones del compromiso durante el gobierno**, que son lo que permite medir consistencia
  (ver "Objeciones al lote": 26/08/2020, dos fuentes de dos grupos, ambas leídas y no usadas).
- cita_de_contexto: "Sabemos que los ingresos provienen del bolsillo de los uruguayos y aquí una vez
  más un cumplimiento de un compromiso electoral: 'no vamos a aumentar los impuestos'" —
  https://www.subrayado.com.uy/lacalle-pou-ratifico-compromiso-no-subir-impuestos-y-reducir-deficit-e-inflacion-n660860
- accion_sugerida: partir el registro en tres promesas hermanas con el mismo `origen`
  (impuestos → `economia/impuestos`; tarifas → `economia/tarifas`; combustibles → `economia/combustibles`,
  donde ya hay corrida abierta), o mantener una sola y obligar a que el `estado` se publique con
  desglose por componente. Ver `veredicto_editorial_sugerido`.

### promesas[0].evidencias_candidatas[0] — 2020-03-11 — ajuste de tarifas + rebaja de exoneración de IVA
- severidad: corregir
- tipo: contexto_omitido
- objecion: La `descripcion` adopta la caracterización de un medio ("en los hechos aumenta la carga
  tributaria") como descripción neutral del hecho. El hecho verificable y no disputado es más
  preciso: **no se cambió ninguna tasa de impuesto**; se redujo a la mitad el descuento de IVA por
  pago con tarjeta creado por la Ley de Inclusión Financiera (débito: de 4 a 2 puntos, tasa efectiva
  18% → 20%; crédito en restaurantes: de 9 a 5 puntos), con una recaudación adicional de ~US$ 40
  millones reconocida por el propio gobierno. Los dos argumentos deben estar los dos:
  **a favor de "es suba de impuestos"**: el contribuyente paga más IVA por la misma compra y el
  Estado recauda US$ 40 millones más, sin contrapartida; el beneficio era permanente y su recorte es
  una decisión discrecional de política tributaria.
  **a favor de "no es suba de impuestos"**: la tasa legal del IVA (22%) no se tocó; se recortó un
  beneficio/subsidio, no se creó ni se aumentó un tributo; nadie paga más que la tasa general.
  Además el `efecto: en_contra` agrupa tarifas (que no son impuestos) con IVA (que sí lo es).
- cita_de_contexto: "Los uruguayos que abonan con tarjeta de débito hoy pagan 18% de IVA, pero pasarán
  a pagar 20% por ese impuesto. Para las tarjetas de crédito en restaurantes existe una exoneración
  de 9 puntos que ahora pasará a ser de 5 puntos." —
  https://www.elobservador.com.uy/nota/promesas-de-lacalle-lo-que-decia-y-como-argumenta-que-no-las-incumple-202031120430
- accion_sugerida: separar en dos evidencias (tarifas / IVA) y reescribir la descripción con los
  números concretos y las dos lecturas. Agregar como tercera fuente, de otro grupo, la nota de
  Montevideo Portal del mismo día con los porcentajes exactos (UTE 10,5%, OSE 10,7%, Antel 9,78%):
  https://www.montevideo.com.uy/Noticias/Aumento-de-tarifas-UTE-10-5--OSE-10-7--y-Antel-9-78--No-suben-los-combustibles-uc746676
  (está en el corpus). El texto del decreto de exoneración de IVA es verificable en **IMPO** y la
  recaudación asociada en la **DGI**.

### promesas[0].evidencias_candidatas[1] — 2020-04-08 — Ley 19.874, Impuesto Emergencia Sanitaria COVID-19
- severidad: corregir
- tipo: un_solo_grupo + riesgo_legal
- objecion: (a) Fuente única (montevideo-comm), como marcó el validador — y encima es una nota de
  junio usada para documentar una ley de abril. (b) **Se afirma una fecha exacta (2020-04-08) que la
  fuente no da**: la nota solo dice "promulgada en abril". (c) La descripción omite que la misma ley
  creó también un **tributo adicional al IASS** sobre pasividades públicas. (d) Falta el par de
  lecturas, que es el corazón del caso:
  **lectura de incumplimiento**: es un tributo nuevo, con la palabra "impuesto" en su nombre legal,
  creado por iniciativa de su Poder Ejecutivo y votado durante su gobierno, después de haber dicho
  "se terminó el aumento de impuestos"; y en julio de 2021 reivindicó "no vamos a poner impuestos"
  sin mencionarlo.
  **lectura de no incumplimiento**: fue transitorio por ley (ingresos devengados de abril y mayo de
  2020, con prórroga máxima de dos meses que no se usó), acotado a remuneraciones y pasividades del
  **Estado** superiores a $120.000 —incluidos los cargos políticos y el propio presidente—, ante un
  hecho imprevisible, y su marco declarado fue "no meterle la mano en el bolsillo a los uruguayos",
  esto es, al contribuyente privado.
- cita_de_contexto: "El artículo 10 de esta ley indica que los tributos establecidos 'aplicarán a los
  ingresos devengados correspondientes a los meses de abril y mayo de 2020', plazo ya cumplido." —
  https://www.montevideo.com.uy/Noticias/Lacalle-confirmo-que-deja-de-cobrarse-el-impuesto-coronavirus-a-funcionarios-publicos-uc755946
- accion_sugerida: citar la **Ley 19.874 en IMPO** (documento_oficial: da fecha exacta, artículos,
  ámbito subjetivo y el adicional al IASS) y bajar la nota de prensa a fuente secundaria; agregar la
  segunda fuente ya leída y no usada (la diaria, cooperativa-la-diaria, url arriba), que menciona el
  adicional al IASS y los US$ 8 millones recaudados. Escribir las dos lecturas en la `descripcion`.

### promesas[0].evidencias_candidatas[2] — 2020-06-17 — no prórroga del impuesto covid
- severidad: corregir
- tipo: un_solo_grupo
- objecion: Fuente única (montevideo-comm), como marcó el validador, y descansa en la misma cita de
  mensaje privado observada en declaraciones[4]. Además la `descripcion` dice "poniendo fin a su
  cobro en junio de 2020" mientras la cita dice "en el mes de junio y julio ya no se cobra" y la
  fuente de otro grupo dice "Junio será el último mes en que se recaude": tres formulaciones
  distintas del mismo hecho conviviendo sin resolver.
- cita_de_contexto: "La ministra de Economía y Finanzas, Azucena Arbeleche, anunció este miércoles,
  tras reunirse con el presidente Luis Lacalle Pou, que no se extenderá la aplicación del impuesto…
  La no extensión también alcanzará al tributo adicional al Impuesto de Asistencia a la Seguridad
  Social" — https://ladiaria.com.uy/coronavirus/articulo/2020/6/gobierno-deja-de-cobrar-el-tributo-covid-19-a-los-funcionarios-publicos-y-cargos-politicos-con-sueldos-mas-altos/
- accion_sugerida: agregar esa fuente (ya leída en esta corrida, otro grupo) y precisar el mes de
  último devengamiento contra el texto legal en IMPO.

### promesas[0].evidencias_candidatas[3] — 2021-07-29 — "ahorramos sin poner impuestos"
- severidad: aviso
- tipo: asimetria
- objecion: Es una **declaración del propio promitente computada como evidencia `a_favor` del
  cumplimiento de su propia promesa**. Eso es circular: mide la promesa con la palabra de quien la
  hizo. No es un error de hecho (la cita es exacta y tiene dos grupos), pero como pieza probatoria
  debería ser `neutral` o quedar como contexto, no como evidencia a favor.
- cita_de_contexto: "La verdad, no es un tema que hagamos discurso ni promocionemos, ni nos jactemos.
  Pero sí la tranquilidad de haber cumplido con la palabra" —
  https://www.elobservador.com.uy/nota/lacalle-pou-sobre-gestion-en-pandemia-ahorramos-mas-de-us-600-millones-sin-poner-impuestos--2021728205316
- accion_sugerida: cambiar `efecto` a `neutral`, o mantener `a_favor` dejando escrito en la
  `descripcion` que es autoevaluación del propio político y que fue contestada en la misma nota de la
  diaria.

### promesas[0].evidencias_candidatas[4] — 2023-03-02 — rebaja de IRPF e IASS
- severidad: aviso
- tipo: sin_objecion (con precisión pendiente)
- objecion: No tengo objeción de fondo: es la evidencia más sólida del lote (documento oficial,
  textual, con cifras). Precisión: el `tipo: ley` está aplicado a un **anuncio de proyecto de ley**,
  no a la ley aprobada. Entre el anuncio y la norma sancionada pueden cambiar tramos y montos, y la
  rebaja tuvo además una segunda etapa posterior. Para el Veracímetro, "80.000 uruguayos dejarán de
  pagar IRPF e IASS" y "renuncia fiscal de US$ 150 millones" son chequeables.
- cita_de_contexto: "el proyecto de ley que el Gobierno enviará para la aprobación del Parlamento
  contendrá medidas para los contribuyentes de IRPF de menores ingresos" —
  https://www.gub.uy/presidencia/comunicacion/noticias/lacalle-pou-80000-uruguayos-dejaran-pagar-irpf-iass
- accion_sugerida: cambiar `tipo` a `accion_de_gobierno` (anuncio) y agregar una evidencia separada
  con la **ley efectivamente sancionada (texto en IMPO) y su fecha**. El número de contribuyentes que
  dejaron de tributar se verifica con las **series de contribuyentes y recaudación de la DGI**; la
  renuncia fiscal, con el **MEF (Rendición de Cuentas / estimación de gasto tributario)**.

### promesas[0].evidencias_candidatas[5] — 2025-02-13 — balance de cierre "sin aumentar la carga tributaria"
- severidad: corregir
- tipo: un_solo_grupo + riesgo_legal
- objecion: Tres problemas. (a) Fuente única (grupo-infobae), como marcó el validador. (b) El `tipo:
  dato_oficial` es incorrecto: no hay dataset ni documento oficial citado, hay una **nota de prensa
  que reproduce lo que dijo una ministra en conferencia**. Etiquetarlo `dato_oficial` le da al
  registro un peso probatorio que la fuente no tiene. (c) Las palabras son de Azucena Arbeleche, no
  de Lacalle Pou, y son de nuevo una autoevaluación del gobierno sobre su propio cumplimiento.
- cita_de_contexto: "Arbeleche sostuvo que en este gobierno se atendieron 'las demandas sociales de
  forma sostenida' y se hizo 'sin comprometer' la estabilidad política, la sostenibilidad de la deuda
  y sin aumentar la carga tributaria." —
  https://www.infobae.com/america/america-latina/2025/02/13/gobierno-de-lacalle-pou-presento-los-numeros-que-heredara-orsi-no-es-necesario-hacer-un-ajuste-fiscal/
- accion_sugerida: cambiar `tipo` a `declaracion` (de un tercero) y `efecto` a `neutral`, o
  reemplazarla por el dato duro, que sí es público: **DGI, recaudación anual por impuesto y estudios
  de presión fiscal; MEF, Informe de Rendición de Cuentas y presentación de cierre fiscal 2024; BCU,
  PIB**. Comparar presión tributaria 2019 vs 2024 es la única forma no circular de sostener "sin
  aumentar la carga tributaria". Agregar segunda fuente de otro grupo.

### menciones[0] — 2019-12-04 — "si hubiera ganado Daniel Martínez el ajuste se hacía"
- severidad: aviso
- tipo: riesgo_legal
- objecion: La cita es una **imputación contrafáctica** sobre otro dirigente. El propio Lacalle Pou la
  acompaña de la salvedad de que es indemostrable, y esa salvedad está dentro de la cita registrada,
  que es lo correcto: si se recortara en "si hubiera ganado Daniel Martínez el ajuste se hacía" el
  sentido cambiaría por completo. Aviso al editor: la cita no puede recortarse al publicarse.
  Secundario: `sentido: neutral` es discutible (la frase le atribuye a Martínez una decisión que
  Martínez negó públicamente); y `daniel-martinez` no existe en `content/politicos/` ni en
  `data/alias.yaml`. Además el archivo usa `referente`/`sentido`, campos que no están en el esquema de
  Mención del brief (`mencionado`, sin `sentido`): hay una discrepancia de contrato sin resolver.
- cita_de_contexto: "Yo creo, y esto no lo vamos a poder probar nunca, que si hubiera ganado Daniel
  Martínez el ajuste se hacía." — https://www.youtube.com/watch?v=tHYNE5IGMyE (marca_tiempo 123)
- accion_sugerida: publicar la cita completa e indivisible; revisar `sentido` (propongo
  `desfavorable`, atenuado por la salvedad explícita); crear la ficha de `daniel-martinez` o dejar el
  registro en espera; y que el coordinador fije cuál es el esquema vigente de Mención.

---

## Objeciones al lote

1. **Falta la declaración más relevante de 2020 y está a un copiar-pegar de distancia.** El
   26/08/2020, presentando el Presupuesto quinquenal —cinco meses después del ajuste de marzo—
   Lacalle Pou dijo textualmente "no vamos a aumentar los impuestos" y "los bolsillos de los
   uruguayos no aguantan más carga impositiva". Hay **dos fuentes de dos grupos distintos, y las dos
   fueron leídas en esta misma corrida** (`consultas.jsonl`, 00:12:04 y 00:13:52) y descartadas sin
   explicación en `notas.md`:
   - https://www.telenoche.com.uy/nacionales/lacalle-pou-no-vamos-a-aumentar-los-impuestos (monte-carlo-romay-salvo)
   - https://www.subrayado.com.uy/lacalle-pou-ratifico-compromiso-no-subir-impuestos-y-reducir-deficit-e-inflacion-n660860 (fontaina-de-feo)
   Es el registro que más importa en las dos direcciones: es la reiteración del compromiso (favorable,
   `sin_cambio`) **y** es la prueba de que sostuvo "no vamos a aumentar los impuestos" después de
   haber recortado la exoneración de IVA (desfavorable). Omitirlo desbalancea el lote hacia los dos
   lados a la vez y deja 2020 contado solo por sus episodios de marzo y junio. `accion_sugerida`:
   agregar el registro antes de publicar cualquier veredicto sobre la promesa.

2. **Dependencia de una sola nota de El Observador.** El artículo
   `promesas-de-lacalle-lo-que-decia-y-como-argumenta-que-no-las-incumple` (12/03/2020) es la segunda
   fuente de declaraciones[0], declaraciones[1] y declaraciones[3], y es fuente de
   evidencias_candidatas[0]. Formalmente la regla de dos grupos se cumple en cada registro; en la
   práctica, **un tercio del lote depende de un único texto de un único periodista**, que además es
   una nota retrospectiva de chequeo de promesas (no un reporte independiente de cada evento). El
   Observador aparece en 5 de los 9 registros de declaraciones. `accion_sugerida`: para
   declaraciones[0] y [1] buscar el primario (video del acto, video del debate) en lugar de apoyarse
   en la misma nota.

3. **Distribución de medios del lote.** 12 URLs: el-observador 4, subrayado 3, la-diaria 2, infobae 2,
   montevideo-portal 1, presidencia 1, youtube 1. No hay ninguna fuente de los grupos
   scheck-aguirre (El País), magnolio (Búsqueda), cooperativa-brecha, reg-sa (La República) ni
   editora-caras-y-caretas. Es decir: **no hay ninguna fuente de alineamiento `oficialista_tradicional`
   ni `progresista`, salvo la diaria (`independiente`)**. No invalida nada, pero significa que el
   ángulo crítico de izquierda y el ángulo afín a la coalición están representados solo indirectamente.

4. **Huecos de período.** 2022 sin ningún registro (el propio `notas.md` lo reconoce). 2025-2026 sin
   una sola palabra propia sobre impuestos, pese a que hay corpus del posmandato (entrevista del
   07/05/2025 en El Observador y ámbito, y el video largo del 24/07/2026 ya indexado
   `youtube.com/watch?v=LRzZy8xBrjA`, 28.922 caracteres de transcripción, que nadie revisó en esta
   corrida). `accion_sugerida`: buscar `impuesto` en esas transcripciones antes de dar el tema por
   cubierto.

5. **Hechos tributarios del período que el lote no buscó y que pueden mover el veredicto.** El lote
   documenta dos actos en contra (marzo 2020, ley 19.874) y dos a favor (2023, mipymes). Falta
   verificar, con fuente oficial, si durante el mandato se crearon otros tributos: en particular el
   **impuesto mínimo complementario doméstico / "impuesto mínimo global" (Pilar 2 de OCDE)**, que
   según el propio documento del Partido Nacional citado en `notas.md` figura como creación del
   gobierno de Orsi, pero cuya norma de origen podría ser la Rendición de Cuentas aprobada bajo
   Lacalle Pou. **No lo afirmo: pido verificarlo en IMPO (texto y fecha de la ley) y en el MEF.** Si
   se confirma lo segundo, hay un segundo tributo creado en el período que hoy no está en el lote —y
   además una fuente partidaria que se atribuye a sí misma lo contrario. Igual criterio para la tasa
   consular y para el IMESI de combustibles (esto último, en la corrida de `economia/combustibles`,
   para no contarlo dos veces).

6. **Asimetría estructural de la evidencia de la promesa, en las dos direcciones.** De las cuatro
   evidencias `a_favor`, **tres son palabras** (dos autoevaluaciones suyas y una de su ministra) y una
   sola es un acto (la rebaja de 2023). De las dos `en_contra`, **las dos son actos**. Un lector que
   cuente 4 a 2 leerá un balance favorable que la naturaleza de las piezas no sostiene. En sentido
   inverso, el lote omite la explicación alternativa más fuerte a su favor (la doctrina "acompañar
   costos" de diciembre de 2019, ver declaraciones[2]). Las dos asimetrías se corrigen: pesar actos
   contra actos, y sumar el contexto exculpatorio que ya está en el corpus.

7. **Veracímetro: ninguna `afirmacion` chequeable fue registrada como tal**, habiendo al menos cuatro
   (US$ 600 millones de ahorro; 80.000 uruguayos dejan de pagar IRPF/IASS; US$ 150 millones de
   renuncia fiscal; "se le bajaron los impuestos a las pymes"; y "sin aumentar la carga tributaria").
   Organismos y datasets para confirmarlas o refutarlas, nombrados y no buscados por mí: **DGI**
   (recaudación anual por impuesto, series de contribuyentes, estimación de gasto tributario),
   **MEF** (Rendición de Cuentas, informes de cierre fiscal, estimaciones de renuncia fiscal), **OPP**
   (plan de ahorro de US$ 900 millones), **BCU** (PIB para calcular presión fiscal), **IMPO**
   (textos y fechas de leyes 19.874 y de la rebaja de IRPF/IASS), **Parlamento** (diario de sesiones
   de la Asamblea General del 02/03/2023).

8. **Fuentes leídas y no citadas que aportan contexto tributario del período** (todas en el corpus,
   todas en `consultas.jsonl`): El Observador 09/04/2020 sobre la decisión de **no gravar más al
   capital** durante la pandemia, con las críticas del FA. `notas.md` la descarta por falta de cita
   literal, y es cierto que el núcleo es paráfrasis, pero hay frases entrecomilladas utilizables
   ("Estamos viendo donde se puede aflojar a los emprendimientos que sean disparadores de más fuentes
   de trabajo"). Es una posición tributaria de fondo del período, y su ausencia deja el lote sin el
   eje "a quién no se le cobró".

## Objeciones al brief

- **El brief no viola la Regla 0.** Pide explícitamente cubrir el período completo, campaña y
  gestión, lo favorable y lo desfavorable, registrar también lo consistente, y aplicar criterio
  simétrico. No hay instrucción de seleccionar, omitir ni encuadrar por partido, ideología ni
  persona. Coincido con `objeciones_al_brief` de `notas.md` en este punto.
- Sí hay un **defecto operativo con consecuencia de sesgo**: la tabla de medios del brief (sección 4)
  omite medios que **ya existen en `content/medios/`** con `grupo` y `alineamiento` documentados
  —`infobae` (grupo-infobae), `ambito` (grupo-ambito), `lacallepou-uy`—. El investigador registró
  `infobae` en `medios_faltantes` como si no existiera. El riesgo no es teórico: un investigador que
  aplique la regla "si no está en la tabla, no lo uso" puede descartar fuentes válidas, y ese
  descarte no es neutro (recae sobre los medios que la tabla no listó). `accion_sugerida`: que
  `scripts/brief.ts` genere la tabla leyendo `content/medios/` en vez de una lista fija.
- Segundo defecto operativo: el esquema de `Mención` del brief (`mencionado`, sin `sentido`) no
  coincide con el que tiene el archivo entregado (`referente`, `sentido`). El investigador lo señaló;
  queda sin resolver y afecta la validación.

---

## Cobertura

Criterio de tono aplicado, uniforme para todos los medios y partidos: **`neutral` por defecto; solo
me aparto si el medio afirma algo adverso o laudatorio en voz propia** (no en boca de una fuente
citada). Por eso una nota que incluye la refutación de un opositor sigue siendo `neutral`, y una nota
que caracteriza el hecho en contra de como lo describe el gobierno es `desfavorable`.

```yaml
- medio: subrayado
  url: https://www.subrayado.com.uy/si-ganamos-se-termino-la-suba-impuestos-tarifas-y-combustibles-n530131
  fecha: 2019-03-30
  evento: "propuesto: campana-2019"
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Relato descriptivo del acto sin valoración propia: "En su discurso, entre otras cosas, prometió
    que si es electo presidente no habrá aumento de impuestos ni tarifas."

- medio: 180
  url: https://www.180.com.uy/articulo/78834_lacalle-pou-prometio-no-aumentar-impuestos-tarifas-publicas-ni-combustibles
  fecha: 2019-03-30
  evento: "propuesto: campana-2019"
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Registra el compromiso sin calificarlo: "se comprometió a no aumentar impuestos, tarifas públicas
    y combustibles". (Medio no listado en la tabla del brief ni en content/medios; ver medios_faltantes.)

- medio: infobae
  url: https://www.infobae.com/america/america-latina/2019/11/14/daniel-martinez-y-luis-lacalle-pou-chocaron-en-un-ultimo-y-tenso-debate-en-uruguay/
  fecha: 2019-11-14
  evento: elecciones-2019
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Reparte crítica y contracrítica sin tomar posición: "mientras que Lacalle criticaba al gobierno,
    Martínez señalaba casi de manera subliminal el origen del candidato nacionalista".

- medio: youtube
  url: https://www.youtube.com/watch?v=tHYNE5IGMyE
  fecha: 2019-12-04
  evento: "propuesto: transicion-2019-2020"
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Entrevista con repregunta exigente pero sin valoración del entrevistador: "Usted dijo que no se
    evaluó a mitad de año lo que dijo el gobierno porque es promesa de campaña, pero ni siquiera se
    evaluó con su equipo de gobierno."

- medio: la-diaria
  url: https://ladiaria.com.uy/politica/articulo/2020/3/gobierno-aumenta-el-iva-a-las-tarjetas-de-debito-sube-tarifas-de-ose-ute-y-antel-en-el-entorno-del-10-y-posterga-ajuste-de-combustibles/
  fecha: 2020-03-11
  evento: "propuesto: ajuste-tarifario-2020"
  politico: lacalle-pou
  tono: desfavorable
  justificacion: >-
    Adopta en voz propia la caracterización que el gobierno rechaza ("Gobierno aumenta el IVA a las
    tarjetas de débito") y encabeza con la acusación opositora: "En la oposición calificaron los
    anuncios como un 'tarifazo' y aseguraron que Lacalle Pou está incumpliendo su promesa electoral
    de no subir impuestos."

- medio: el-observador
  url: https://www.elobservador.com.uy/nota/promesas-de-lacalle-lo-que-decia-y-como-argumenta-que-no-las-incumple-202031120430
  fecha: 2020-03-12
  evento: "propuesto: ajuste-tarifario-2020"
  politico: lacalle-pou
  tono: desfavorable
  justificacion: >-
    Afirma en voz propia el efecto que el gobierno niega: "una rebaja a la mitad en la exoneración
    del IVA a las tarjetas que, en los hechos, aumenta la carga tributaria". (Da espacio extenso a
    sus argumentos, pero la caracterización del hecho es adversa.)

- medio: el-observador
  url: https://www.elobservador.com.uy/nota/los-argumentos-de-lacalle-de-por-que-no-gravar-mas-al-capital-y-las-criticas-de-la-izquierda-20204981329
  fecha: 2020-04-09
  evento: pandemia-covid
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Expone su razonamiento y luego las críticas, ambos atribuidos: "Una vez que Lacalle dijo que su
    gobierno no gravará más al capital, en el Frente Amplio surgieron críticas."

- medio: montevideo-portal
  url: https://www.montevideo.com.uy/Noticias/Lacalle-confirmo-que-deja-de-cobrarse-el-impuesto-coronavirus-a-funcionarios-publicos-uc755946
  fecha: 2020-06-17
  evento: pandemia-covid
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Descriptiva y cautelosa con la atribución: "Así lo habría confirmado el presidente de la
    República, Luis Lacalle Pou, al secretario general de la Confederación de Organizaciones de
    Funcionarios del Estado (Cofe), Joselo López."

- medio: la-diaria
  url: https://ladiaria.com.uy/coronavirus/articulo/2020/6/gobierno-deja-de-cobrar-el-tributo-covid-19-a-los-funcionarios-publicos-y-cargos-politicos-con-sueldos-mas-altos/
  fecha: 2020-06-18
  evento: pandemia-covid
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Informa la decisión y el monto sin valoración: "Arbeleche informó que se recaudaron ocho millones
    de dólares."

- medio: telenoche
  url: https://www.telenoche.com.uy/nacionales/lacalle-pou-no-vamos-a-aumentar-los-impuestos
  fecha: 2020-08-26
  evento: "propuesto: presupuesto-quinquenal-2020"
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Reproduce el anuncio presupuestal sin juicio propio: "El mandatario anunció que esta mañana se le
    presentó a los legisladores de la coalición el proyecto nacional que obedece a un plan
    desarrollado durante la campaña electoral."

- medio: subrayado
  url: https://www.subrayado.com.uy/lacalle-pou-ratifico-compromiso-no-subir-impuestos-y-reducir-deficit-e-inflacion-n660860
  fecha: 2020-08-26
  evento: "propuesto: presupuesto-quinquenal-2020"
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Es casi transcripción de la conferencia, sin contrapunto pero también sin adjetivación propia:
    "El compromiso del gobierno es reducir el déficit sin incrementar los impuestos."

- medio: el-observador
  url: https://www.elobservador.com.uy/nota/lacalle-pou-sobre-gestion-en-pandemia-ahorramos-mas-de-us-600-millones-sin-poner-impuestos--2021728205316
  fecha: 2021-07-28
  evento: pandemia-covid
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Reporta la entrevista con atribución permanente: "El presidente Luis Lacalle Pou hizo referencia
    a la última campaña electoral en la que afirmó que no pondría impuestos en caso de llegar al
    gobierno."

- medio: la-diaria
  url: https://ladiaria.com.uy/politica/articulo/2021/7/lacalle-pou-enfatizo-que-durante-la-pandemia-se-ahorro-600-millones-de-dolares-sin-poner-impuestos/
  fecha: 2021-07-29
  evento: pandemia-covid
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Da su afirmación y la réplica opositora, ambas atribuidas: "La senadora Liliam Kechichian
    respondió y recordó que durante este período se 'subió el IVA' y 'aumentó las tarifas muy por
    encima de la inflación'."

- medio: presidencia
  url: https://www.gub.uy/presidencia/comunicacion/noticias/lacalle-pou-80000-uruguayos-dejaran-pagar-irpf-iass
  fecha: 2023-03-02
  evento: "propuesto: rebaja-irpf-iass-2023"
  politico: lacalle-pou
  tono: favorable
  justificacion: >-
    Califica el efecto de la medida en voz propia: "anunció rebajas impositivas mediante la
    deducción del IRPF y el IASS, que aliviarán a trabajadores, pasivos y pequeñas empresas". Aviso
    al editor: es el órgano de comunicación del propio Poder Ejecutivo, no prensa independiente; su
    tono favorable no debería computar en comparaciones entre medios.

- medio: el-observador
  url: https://www.elobservador.com.uy/nacional/lacalle-pou-destaco-paso-los-toros-que-su-gobierno-se-le-bajaron-impuestos-las-pymes-n5947328
  fecha: 2024-06-21
  evento: "propuesto: rebaja-irpf-iass-2023"
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Cronica atribuida, sin valoración: "Allí, Lacalle Pou dio un breve discurso y destacó que durante
    su gobierno 'se le bajaron impuestos a las pymes'."

- medio: subrayado
  url: https://www.subrayado.com.uy/lacalle-pou-afirmo-que-se-le-bajaron-los-impuestos-las-pymes-y-destaco-su-importancia-la-economia-n949836
  fecha: 2024-06-21
  evento: "propuesto: rebaja-irpf-iass-2023"
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Relata el discurso incluyendo su propio reconocimiento de límites: "Repasó los mecanismos
    dispuestos por el Poder Ejecutivo… pero reconoció que no han sido suficientes."

- medio: infobae
  url: https://www.infobae.com/america/america-latina/2025/02/13/gobierno-de-lacalle-pou-presento-los-numeros-que-heredara-orsi-no-es-necesario-hacer-un-ajuste-fiscal/
  fecha: 2025-02-13
  evento: "propuesto: traspaso-gobierno-2025"
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Atribuye todas las valoraciones a la ministra saliente: "Arbeleche explicó que se trató de algo
    positivo: la baja de la inflación en el país… fue más rápida de lo previsto."

- medio: ambito
  url: https://www.ambito.com/uruguay/la-oposicion-cuestiono-la-gestion-yamandu-orsi-impuestos-deficit-y-promesas-rotas-n6250895
  fecha: 2026-03-01
  evento: "propuesto: construir-sin-destruir-2026"
  partido: partido-nacional
  tono: neutral
  justificacion: >-
    Transmite el documento partidario con atribución explícita y sin adherir: "La bancada de Luis
    Lacalle Pou sostuvo que el Poder Ejecutivo no tuvo ideas y que solo destinó energía a revertir
    decisiones de la administración anterior."
```

Registros de cobertura: **18** (12 de notas citadas en el lote + 6 de notas leídas en la corrida y no
citadas). Tonos: 2 desfavorables, 1 favorable, 15 neutrales.

---

## veredicto_editorial_sugerido

Advertencia previa: los dos veredictos de abajo suponen que se corrigen antes las objeciones
`bloquea` y `corregir`. En particular, **no publicaría ningún giro sin incorporar la frase de
diciembre de 2019** (declaraciones[2]) ni **sin el registro del 26/08/2020** (objeción de lote 1).

### Giro 1 — "no aumentar impuestos ni tarifas" (2019) → ajuste de tarifas y recorte de la exoneración de IVA (11/03/2020)

- cambio: **cambio_parcial**
- fundamento:
  - En **tarifas** hay cambio verificable y rápido: prometió "se terminó el aumento de… las tarifas"
    y a los once días decretó UTE +10,5%, OSE +10,7%, Antel +9,78%.
  - En **impuestos en sentido estricto** no hay cambio: no se creó ningún tributo ni se subió ninguna
    tasa; se redujo a la mitad un beneficio (descuento de IVA por pago con tarjeta de la Ley de
    Inclusión Financiera). En sentido efectivo sí lo hay: el consumidor pasa de pagar 18% a 20% de
    IVA con débito y el Estado recauda ~US$ 40 millones más. La respuesta honesta es que ambas
    lecturas son sostenibles y por eso el cambio es parcial, no total.
  - **Combustibles**: no corresponde a este tema (además, ese día no subieron).
- explicacion: **justificado_por_contexto** (no `reconocido_explicitamente`)
- evidencia de la explicación:
  - Criterio anunciado **antes** de asumir, no inventado ex post: "acompañar los costos no es un
    aumento de tarifas para recaudar" (youtube, 04/12/2019, marca_tiempo ≈ 60–100).
  - Justificación pública el mismo día: "esta adecuación es por debajo de los costos" y "¿Por qué se
    toma? Se toma porque el déficit es grande" (El Observador 12/03/2020; la diaria 11/03/2020;
    Montevideo Portal 11/03/2020).
  - No es `reconocido_explicitamente` porque en ningún momento admite haber cambiado de posición: al
    contrario, sostiene que cumple. Y la frase que más se acerca a reivindicar cumplimiento ("se
    súper cumplió") **es de Alfie, no de él**.
- lo que falta para cerrarlo: nadie verificó si el ajuste quedó efectivamente por debajo de la
  evolución de costos de UTE/OSE/Antel. Eso es chequeable con los **estados contables y tarifarios de
  UTE, OSE y Antel, y con URSEA/URSEC**, y decide entre "adecuación" y "aumento". Sin ese dato, el
  registro no puede afirmar cuál de las dos cosas fue.

### Giro 2 — "no vamos a poner impuestos" → Impuesto Emergencia Sanitaria COVID-19 (ley 19.874, abril 2020)

- cambio: **cambio_parcial**
- fundamento (las dos lecturas, ninguna dominante con la evidencia del lote):
  - **Sí es giro**: se creó, por iniciativa de su Poder Ejecutivo y durante su gobierno, un tributo
    cuyo nombre legal es literalmente "Impuesto Emergencia Sanitaria COVID-19", más un adicional al
    IASS. La promesa fue enunciada en términos absolutos ("se terminó… Se terminó").
  - **No es giro**: fue transitorio por diseño (devengado de abril y mayo de 2020; la prórroga de dos
    meses que la ley habilitaba **no se usó**), acotado a remuneraciones y pasividades del **sector
    público** superiores a $120.000, incluidos los cargos políticos y el propio presidente, ante un
    hecho imprevisible; y el marco declarado de la promesa —"no meterle la mano en el bolsillo a los
    uruguayos", "los bolsillos de los uruguayos no aguantan más carga impositiva" (26/08/2020)—
    apunta al contribuyente privado, no a la remuneración de los funcionarios del Estado.
  - Por transitoriedad y universo acotado no lo llamaría `cambio_total`; por existir el tributo y
    llamarse impuesto no puedo llamarlo `sin_cambio`.
- explicacion: **sin_explicacion**
- evidencia: en todo el lote **no hay una sola declaración suya, de abril de 2020 ni posterior, que
  concilie este tributo con la promesa**. Al contrario, en julio de 2021 reivindicó "tercamente y
  obstinadamente decíamos que no vamos a poner impuestos" y en agosto de 2020 "no vamos a aumentar
  los impuestos", en ambos casos sin mencionarlo. Salvedad de honestidad intelectual que el editor
  debe conservar: `sin_explicacion` aquí puede reflejar un **hueco de búsqueda** (no consta que le
  hayan preguntado por la contradicción) y no una negativa a explicar. `notas.md` lo admite
  ("no encontré una cita textual de Lacalle Pou… distinguiéndolo explícitamente de su promesa").
  Antes de publicar `sin_explicacion` haría una búsqueda dirigida a conferencias de prensa de abril
  de 2020 y a la discusión parlamentaria de la ley 19.874 (**diario de sesiones del Parlamento**),
  donde el Poder Ejecutivo fundamentó el proyecto.

### Promesa — "Si gana el Partido Nacional se terminó el aumento de impuestos, las tarifas y los combustibles"

El mandato terminó el 01/03/2025: `en_proceso_adelantada` y `en_proceso_demorada` no aplican. Queda
`cumplida` o `incumplida`, y por eso el desglose importa más que el veredicto único.

- **Componente tarifas públicas → incumplida.** UTE, OSE y Antel aumentaron a los once días de
  asumir. La defensa ("adecuación por debajo de costos") explica el porqué, no cancela el hecho de
  que la promesa dijo "se terminó el aumento de las tarifas" sin condicionarla a los costos. Nota:
  este componente pertenece a `economia/tarifas`, no a este tema.
- **Componente impuestos → incumplida por poco, no cumplida.** A favor: no se creó ningún tributo
  permanente, no se subió ninguna tasa, y hubo rebajas reales y documentadas (IRPF/IASS 2023, con
  renuncia fiscal declarada de US$ 150 millones y ~80.000 contribuyentes menos; beneficios a mipymes
  anunciados en el mismo discurso). En contra: se creó un impuesto —transitorio, pero impuesto— por
  ley 19.874, y se recortó a la mitad la exoneración de IVA con ~US$ 40 millones de recaudación
  adicional a los once días de asumir. Una promesa formulada en absoluto ("se terminó… Se terminó")
  no admite excepciones sin dejar de ser incumplida; pero el saldo neto del quinquenio sobre el
  contribuyente privado plausiblemente es de menos impuestos, no de más. **Mi lectura: `incumplida`,
  con la exigencia de que la ficha publique en el mismo bloque las dos rebajas de 2023-2024 y la
  transitoriedad del tributo covid.** Si el editor prefiere `cumplida`, tiene fundamento defendible —
  lo que no es defendible es publicar cualquiera de las dos sin la evidencia contraria al lado.
- **Componente combustibles → fuera de tema.** Corresponde a la corrida `economia/combustibles`; no
  emitir estado aquí.
- **Registro compuesto tal como está hoy → `incumplida`**, porque basta que uno de los tres
  componentes falle. Pero advierto expresamente: publicar "promesa sobre impuestos: incumplida",
  cuando el peso del incumplimiento viene de las tarifas —que no son un impuesto—, sería inducir a
  error al lector. Por eso la recomendación principal no es un estado, es **partir la promesa en tres
  antes de asignarle estado alguno**.
- **Dato que falta y que resolvería el componente tributario sin discusión**: la presión fiscal
  (recaudación DGI / PIB) de 2019 contra la de 2024. Está en **DGI** (recaudación anual, series
  históricas) y **BCU** (PIB). Es la única forma no circular de contrastar el "sin aumentar la carga
  tributaria" de la evidencia [5], que hoy se apoya en la palabra de la propia ministra.
