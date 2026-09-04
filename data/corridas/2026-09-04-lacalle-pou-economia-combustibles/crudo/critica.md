# Crítica — corrida 2026-09-04-lacalle-pou-economia-combustibles

Modelo: claude-opus-5 (Claude Opus 5, vía Claude Code / Agent SDK)
Lote: inbox/lacalle-pou/economia/combustibles/2026-09-04/
Registros revisados: 9 (7 en `declaraciones.yaml`, 2 en `promesas.yaml`; `menciones.yaml` vacío)
Notas leídas con `pnpm fuente`: 14

Nota sobre las 3 citas aproximadas (similitud 0,99) que marcó el validador: **ninguna cambia el sentido.**
Son variantes de orden y de conectores de la misma frase de campaña y de la misma frase de la LUC:
Subrayado 30-03-2019 "el aumento de impuestos, las tarifas y los combustibles"; la diaria 14-02-2022 "el aumento
de impuestos, de las tarifas y los combustibles"; El Observador 12-03-2020 (ya en el lote, en otro registro)
"el aumento de tarifas, impuestos y combustibles". Tres medios, tres órdenes; el contenido prometido es el mismo.
Lo que sí importa es que **ninguno de los tres transcribe del audio del acto**: los tres citan de memoria o de
cable. Eso está más abajo, en `declaraciones[0]`.

---

## Objeciones por registro

### declaraciones[0] — 2019-03-30 — "Si gana el Partido Nacional se terminó el aumento de impuestos…"
- severidad: corregir
- tipo: un_solo_grupo
- objecion: Las dos fuentes son de grupos distintos en la tabla (`fontaina-de-feo` / `cooperativa-la-diaria`), así
  que la regla se cumple en la forma. En el fondo no: la segunda fuente **no es cobertura, es una columna de
  opinión** ("El precio de los combustibles: entre falsas promesas y la defensa de la LUC", firmada por Braulio
  Zelko y Martín Vallcorba), publicada **el 14-02-2022, en plena campaña del referéndum de la LUC**, y con paywall:
  `pnpm fuente` devuelve 1236 caracteres de un artículo de "9 minutos de lectura". Una columna militante de 2022
  no corrobora de forma independiente lo que se dijo en un acto de 2019: repite la misma frase que ya circulaba.
  Además el firmante Vallcorba es un economista con trayectoria en el MEF de los gobiernos del Frente Amplio (a
  verificar en gub.uy antes de publicar): si eso se confirma, es la única fuente del lote con parte interesada en
  el juicio que la nota emite. Es el eslabón más débil de toda la cadena, porque sostiene la **promesa fundante**
  de la que cuelga el resto del lote.
- cita_de_contexto: "…del FA, y menos que se le haya metido la mano en el bolsillo a la gente. Por otro lado,
  además del más que evidente incumplimiento de la promesa electoral de bajar el precio de los combustibles y la
  electricidad, queda claro que, lejos del anunciado manejo técnico de las…"
  (https://ladiaria.com.uy/economia/articulo/2022/2/el-precio-de-los-combustibles-entre-falsas-promesas-y-la-defensa-de-la-luc/)
  — nótese que la columna dice "la promesa electoral de **bajar** el precio", que es más de lo que la frase de
  campaña dice ("se terminó el aumento"). El registro hace bien en no recoger eso; la fuente, mal en afirmarlo.
- accion_sugerida: Sustituir la fuente de la diaria por **El Observador 12-03-2020**, que ya está leída y usada en
  este mismo lote (`declaraciones[2]`), es cobertura y no opinión, es de un tercer grupo (`werthein-hochbaum`) y
  trae la frase textual: "Si gana el Partido Nacional se terminó el aumento de tarifas, impuestos y combustibles",
  afirmó hace casi un año."
  (https://elobservador.com.uy/nota/promesas-de-lacalle-lo-que-decia-y-como-argumenta-que-no-las-incumple-202031120430).
  Alternativa mejor: el video del acto del Parque Viera, al que la propia nota de Subrayado remite ("En el
  siguiente video se puede ver el acto completo. Lacalle Pou comienza su discurso en el minuto 14") — eso llevaría
  el registro a nivel `textual` con marca de tiempo, que es lo que hoy le falta a todo el lote.

### declaraciones[1] — 2019-09-04 — "Estamos dispuestos a liberar la importación de incombustibles…"
- severidad: corregir
- tipo: contexto_omitido
- objecion: Dos cosas. (a) La página de En Perspectiva **no es la transcripción**: es un resumen del coloquio
  ("Algunas frases destacadas de Luis Lacalle Pou") y en el mismo cuerpo enlaza dos veces la "Transcripción
  completa de la entrevista con Luis Lacalle Pou y sus asesores". Se citó el resumen teniendo la transcripción a un
  clic. (b) Más grave: en el **mismo bloque de la misma página**, inmediatamente antes de la frase citada, Azucena
  Arbeleche fija el criterio tarifario del futuro gobierno, y ese criterio es exactamente el antecedente del PPI.
  El registro lo omite, y esa omisión es la que después hace que el giro de 2022 se lea como una traición pura y no
  como la aplicación de un criterio anunciado en campaña. La explicación de contexto **está documentada en la
  propia fuente del lote**; no es racionalización posterior nuestra.
- cita_de_contexto: "En cuanto a la gobernanza y regulación de las Empresas Públicas, Azucena Arbeleche dijo:
  'Vamos a tratar de eliminar la tarifa pública como herramienta de financiamiento del Estado. Terminar con la
  lógica del Estado que gasta, y que las tarifas públicas reflejen realmente los costos de producción de las
  empresas'." (https://enperspectiva.uy/en-perspectiva-programa/entrevistas/lacalle-pou-llega-al-gobierno-libre-importacion-combustibles-se-aprobara-90-dias-reglamentada-forma-paulatina-ancap-se-prepare-la-competencia/)
- accion_sugerida: Abrir la transcripción completa enlazada en esa misma página y, si tiene audio o video, subir el
  registro a `textual`. Marcar "incombustibles" como [sic] (es errata de la fuente, no del investigador). Y
  registrar la frase de Arbeleche como contexto del giro (no como declaración de Lacalle Pou: no es suya).
  `_faltante: segunda_fuente` está bien declarado.

### declaraciones[2] — 2020-03-11 — "en estos días, con la baja muy grande en los precios del petróleo…"
- severidad: bloquea
- tipo: contexto_omitido
- objecion: El `resumen` dice que "explicó que los precios de los combustibles no subirían". **La misma nota, dos
  párrafos después, lo desmiente.** Lacalle Pou no dijo que no subirían: dijo que la suba planificada iba a ser
  menor, y se negó expresamente a adelantar cuál sería. El registro convierte un "no sube ahora y la adecuación
  futura será menor" en un "no subirían", y ese resumen es justo el que después alimenta el giro de 2022. Es una
  cita cortada donde cambia el sentido, por vía del resumen.
  Segundo problema, independiente: la evidencia declara `reportado` con dos fuentes de grupos distintos, pero **El
  Observador no reporta esta declaración**. Su `cita` es sobre las tarifas de UTE/OSE/Antel ("la carreta adelante
  de los bueyes"), no sobre combustibles. La única fuente que reporta la frase de combustibles es Montevideo
  Portal. La regla de dos grupos se cumple en el papel y no en los hechos.
- cita_de_contexto: "'Ancap ya había comprado petróleo para el primer semestre al precio anterior a la caída. El
  trabajo de estos días en la compra del mercado futuro que nos permitió comprar para los próximos seis meses puede
  llegar a resultar en que **la adecuación en el precio sea bastante menor a la que planificábamos**', añadió. /
  'Somos optimistas en generar buena compra. **Preferimos no adelantar cuál va a ser la adecuación en el precio de
  los combustibles**', expresó."
  (https://montevideo.com.uy/Noticias/Aumento-de-tarifas-UTE-10-5--OSE-10-7--y-Antel-9-78--No-suben-los-combustibles-uc746676)
- accion_sugerida: Reescribir el `resumen` a algo como: "Anunció que los combustibles no subían en el ajuste
  tarifario del 1 de abril y atribuyó la decisión a la caída del precio del petróleo y a compras en el mercado de
  futuros, pero advirtió que la 'adecuación' de precios seguía planificada y se negó a adelantar su magnitud."
  Agregar `_faltante: segunda_fuente` o buscar un segundo medio que sí reporte la frase de combustibles.
- explicacion_alternativa (para el editor, aunque no me convenza del todo): el "cumplimiento" de marzo de 2020 es
  en buena medida **exógeno** — el derrumbe del crudo de marzo de 2020 (guerra de precios OPEP+ y shock de demanda
  por COVID) hizo barato no subir. La nota lo documenta con sus palabras ("la baja muy grande en los precios del
  petróleo", "compra del mercado futuro"). Esto no lo estamos suponiendo: está en la fuente del lote.
- cierre de una hipótesis abierta en `notas.md`: la supuesta contradicción entre Montevideo Portal ("no subirán las
  de Ancap") y El Observador ("la suba de los precios en UTE, OSE, Ancap y Antel fue la primera y gran polémica de
  la transición") **no existe**. Leído el párrafo completo, El Observador se refiere a la polémica de la transición
  de diciembre de 2019, cuando Vázquez ratificó no ajustar tarifas y el gobierno electo se lo reclamó: "…luego de
  que en diciembre la administración de Tabaré Vázquez ratificara su anuncio realizado meses antes de no aumentar
  las tarifas al inicio de 2020. En ese momento, Lacalle Pou y su equipo acusaron al mandatario de 'irresponsable' y
  reclamaron que se ajustaran". No hubo suba de Ancap el 11-03-2020. El editor puede cerrar esa hipótesis sin ir al
  decreto.

### declaraciones[3] — 2021-11-16 — "no somos un gobierno que va a cobrarle a la gente para tapar agujeros…"
- severidad: corregir
- tipo: cita_fuera_de_contexto
- objecion: La cita arranca en "no somos un gobierno…" y con eso **se corta justo antes de la admisión más
  relevante de todo el lote**: en la misma frase continua, Lacalle Pou dice "y **deberíamos de haber aumentado**".
  Cortar ahí no le agrega culpa, se la quita: deja al presidente diciendo sólo la parte lucida ("no le cobramos a
  la gente") y esconde que él mismo reconocía que la regla indicaba subir. Y esa admisión es la que hace que el
  "la espalda se terminó" de 2022 sea **continuidad y no viraje**. La cita se cortó donde cambia el sentido, esta
  vez a favor del político y en contra de la lectura correcta del giro.
- cita_de_contexto: "'Y ANCAP, que dio ganancias extraordinarias, porque está pudiendo tener un negocio, el famoso
  X, que el X era siempre para ver cuánto aumentamos, en este caso tenemos, digámosle, un X virtuoso, y **deberíamos
  de haber aumentado**, pero como ANCAP dio ganancia y no somos un gobierno que va a cobrarle a la gente para tapar
  agujeros porque administramos mal, dijimos vamos a no cobrarle a la gente más caro el combustible y mantengamos el
  precio con la ganancia que tuvo el Estado', agregó el presidente."
  (https://subrayado.com.uy/lacalle-pou-reivindico-decision-no-subir-combustibles-ganancias-ancap-n816593)
- accion_sugerida: Extender la `cita` hacia atrás hasta incluir "deberíamos de haber aumentado". `_faltante:
  segunda_fuente` está bien declarado; el acto fue público (inicio de la cosecha de trigo en Dolores) y debería
  existir registro en Presidencia o en video.
- verificabilidad (Veracímetro): en el mismo pasaje hay dos afirmaciones chequeables que el lote no marca como
  tales: (a) "el precio del refinado en el Golfo… pasó de 42 o 47 a 84 dólares el barril"; (b) las "ganancias
  extraordinarias" de ANCAP por venderle combustible a UTE para exportar energía a Brasil. Documentos oficiales que
  las confirman o refutan, sin salir a buscarlos yo: **memoria y estados financieros anuales de ANCAP 2021**
  (ancap.com.uy), **informes mensuales de PPI de URSEA** (ursea.gub.uy) y **estadísticas de intercambio de energía
  de ADME/UTE**.

### declaraciones[4] — 2022-05-28 — "Cada vez que no aumentamos lo que debemos aumentar…"
- severidad: corregir
- tipo: contexto_omitido
- objecion: Tres capas.
  (a) **El PPI está en las dos notas y no está en el registro.** Ambas fuentes explican que el informe de URSEA
  mostraba el gasoil $10,75 y la nafta $6,41 **por debajo** del Precio de Paridad de Importación, es decir que el
  gobierno venía fijando precios por debajo de la referencia. Sin eso, "la espalda de Ancap se terminó" se lee como
  "rompió la promesa". Con eso se lee como "el subsidio implícito ya no se podía sostener". Las dos lecturas tienen
  que estar; hoy sólo está la primera, por omisión. **El PPI es contexto documentado en las fuentes del propio
  lote, no racionalización posterior.**
  (b) **Dos fuentes, un solo origen.** El Observador y Montevideo Portal son grupos distintos, pero ambos
  transcriben la misma rueda de prensa levantada de la misma radio: "declaraciones a la prensa que recogió radio
  Universal" (El Observador) y "según declaraciones consignadas por 970 Universal" (Montevideo Portal). No son dos
  verificaciones independientes: es una sola toma replicada. Las diferencias entre las dos citas ("Cada vez que no
  aumentamos" vs. "Cada vez que no subimos, que no aumentamos") lo prueban: son dos desgrabaciones del mismo audio.
  (c) **Él no reconoce el cambio: lo justifica, y nunca se lo preguntan.** En ninguna de las dos notas se menciona
  la promesa de 2019 ni se le pregunta por ella. Montevideo Portal aclara que la frase fue una respuesta: "Al ser
  consultado sobre si le queda espalda financiera a Ancap, dijo…". El vínculo con 2019 lo hacemos nosotros. Es
  legítimo hacerlo, pero hay que decir que es nuestra construcción y no una admisión suya.
- cita_de_contexto: "El viernes se conoció el último informe de Precio de Paridad de Importación (PPI) de la Ursea,
  que mostró una nueva corrección al alza para las tarifas en Uruguay. […] Los números oficiales actualizados al 25
  de mayo muestran que el precio del gasoil tiene un desfasaje de $ 10,75 por litro respecto a lo que marca la
  referencia del mercado internacional y, en el caso de la nafta Súper, la brecha es algo menor y se ubica en $ 6,41
  por litro. La diferencia se da como resultado de que **las tarifas se han venido ajustando por debajo de lo que
  indicaba el Precio Paridad de Importación (PPI)**."
  (https://elobservador.com.uy/nota/lacalle-pou-sobre-ajuste-de-combustibles-para-junio-la-espalda-de-ancap-se-termino--202252814485)
  Y en la otra: "'…nosotros tratamos de hacer un sacrificio para que eso no sea pago por la ciudadanía', agregó."
  (https://montevideo.com.uy/Noticias/La-espalda-financiera-de-Ancap-basicamente-se-termino--dijo-Lacalle-Pou-uc823068)
- accion_sugerida: 1) Incorporar el PPI y la brecha de $10,75/$6,41 al `resumen`. 2) Usar como `cita` principal la
  versión larga de Montevideo Portal, que incluye la razón ("obviamente es renunciar a mantener las cuentas
  balanceadas… hubo que recapitalizar la empresa"). 3) Buscar el audio de Radio Universal 970 o el registro de
  Presidencia de esa rueda de prensa para pasar a `textual`. 4) **Falta el hecho**: nadie verificó qué pasó en
  junio de 2022. Pista sin abrir con `pnpm fuente` (el investigador debe leerla antes de citarla): Bloomberg Línea
  31-05-2022, "Nafta sube en Uruguay $1,5 y gasoil $3"
  (https://www.bloomberglinea.com/2022/05/31/aumento-de-combustibles-en-uruguay-cuanto-costara-la-nafta-y-el-gasoil-desde-junio/).
  Si ese dato se confirma, la suba fue **muy inferior** a la brecha PPI declarada días antes, lo que cambia el
  veredicto: no fue "se acabó la promesa y se trasladó todo", fue traslado parcial. Fuente dura para cerrarlo:
  decreto de fijación de precios del Poder Ejecutivo en IMPO y la serie "Composición de precio y comparación URSEA"
  de ANCAP.
- sobre la guerra en Ucrania: **no está documentada en ninguna fuente del lote.** El Observador dice "el mercado
  del petróleo está volátil" y Montevideo Portal "este aumento de combustibles a nivel mundial"; ninguna nombra la
  invasión de Ucrania ni da la cotización del Brent. Si el editor quiere usar la guerra como explicación externa,
  la estaría poniendo él, no la fuente. Para usarla hace falta traer una fuente nueva (los informes mensuales de
  PPI de URSEA sí publican la referencia internacional del período).

### declaraciones[5] — 2023-01-31 — "Estamos pensando en ver si Ancap, sus finanzas, soportan no hacer una suba…"
- severidad: corregir
- tipo: contexto_omitido
- objecion: (a) El `resumen` afirma algo que **no está en ninguna `cita` del registro**: "señaló que bajo el
  mecanismo de la LUC el gobierno a veces sube el precio y a veces no". Eso corresponde a una segunda frase de la
  nota que no se registró como cita. Un resumen no puede llevar contenido sin respaldo citado. (b) Esa segunda
  frase, además, es una **afirmación chequeable** ("Antes solo subían") y debería ir al Veracímetro, no perdida en
  un resumen. (c) Fuente única de un agregador extranjero que a su vez levanta de terceros ("En declaraciones a la
  prensa consignada por Subrayado (Canal 10), el ministro de Industria, Omar Paganini…"): el `_faltante:
  segunda_fuente` está bien puesto, pero para una decisión de política de precios existe comunicado oficial.
  (d) Contexto omitido que corta en las dos direcciones y hay que poner: la propia nota aclara que **el PPI no es
  invento de este gobierno**.
- cita_de_contexto: "Luego, se refirió a los cambios que trajo la Ley de Urgente Consideración, que ajusta el precio
  cada mes. 'Cuando el combustible ha subido, a veces el gobierno ha subido, a veces no. Antes solo subían',
  agregó." y "El objetivo de esta metodología **que se aplica desde 2002, pero sufrió modificaciones en 2010 y en
  2017**, es transparentar los costos de los combustibles…"
  (https://infobae.com/america/america-latina/2023/01/31/lacalle-pou-decidio-que-los-combustibles-no-subiran-en-uruguay-en-febrero-pese-a-la-recomendacion-del-ministerio-de-industria)
- accion_sugerida: Registrar "Cuando el combustible ha subido, a veces el gobierno ha subido, a veces no. Antes solo
  subían" como `cita` propia (declaración y/o `afirmacion` para Veracímetro) o sacarla del `resumen`. Buscar el
  comunicado oficial del 31-01-2023 (Presidencia/MIEM) como segunda fuente. Verificable con: **serie histórica de
  precios de venta al público de ANCAP** ("Composición de precio y comparación URSEA", ancap.com.uy), **informes
  mensuales de PPI de URSEA** y **decretos de fijación de precios en IMPO** — con eso se contrasta "antes solo
  subían" contra los ajustes 2005-2019 sin que nadie tenga que opinar.
- sin objeción sobre un punto que podría parecerlo: el titular de Infobae ("Lacalle Pou decidió que los combustibles
  no subirán") es más terminante que la cita ("No hay definición al respecto"). El `resumen` del registro dice
  correctamente "Dijo que evaluaba mantener sin cambios" y no compra el titular. Bien hecho.

### declaraciones[6] — 2025-05-07 — "La crítica siempre es bienvenida, es esencial a la tarea de un gobernante…"
- severidad: corregir
- tipo: cita_fuera_de_contexto
- objecion: La `cita` elegida **no menciona ni ANCAP ni combustibles**. Es una frase genérica sobre la crítica; todo
  el anclaje temático lo pone el periodista, no el entrevistado. Un lector que sólo vea la cita no puede saber de
  qué habla, y el `resumen` ("dijo no compartir los cuestionamientos del nuevo gobierno sobre el balance financiero
  de ANCAP y el precio de los combustibles") le atribuye un objeto que la cita no tiene. La frase sobre el tema
  existe, está en las tres fuentes, y es la que había que poner como cita principal.
  Segundo: las tres fuentes son tres grupos distintos, pero **las tres transcriben la misma entrevista** en la radio
  de Florida. Triple fuente no es triple confirmación aquí; es una entrevista replicada. No es fatal (un hecho de
  habla único no puede tener tres orígenes), pero el editor no debe leer "tres grupos" como robustez extra.
  Tercero, riesgo legal menor: la atribución "del nuevo gobierno" es del medio, no de la cita. Subrayado sí lo
  atribuye expresamente, así que se puede publicar **si se atribuye al medio**. Lo que no se puede arrastrar al
  resumen como hecho es la interpretación de Ámbito ("expresó, contrario al gobierno del Frente Amplio (FA)"), que
  es opinión del cronista.
- cita_de_contexto: "'Lo bueno es que cuando vos tenés balances, por ejemplo, de Ancap, mirás, mirás como sigue la
  capitalización, en uno u otro, cuál ha sido el precio de los combustibles en uno u otro, en qué se han basado, y
  esa discusión, lo bueno, que está en blanco y negro, que es realidad, que no es opinión. […] Las cosas que se
  están discutiendo, no las comparto', **dijo sobre los planteos sobre Ancap que hizo el gobierno actual respecto al
  anterior**."
  (https://subrayado.com.uy/lacalle-pou-criticas-la-gestion-su-gobierno-ancap-las-cosas-que-se-estan-discutiendo-no-las-comparto-n976446)
- accion_sugerida: Promover la frase de los balances a `cita` principal y dejar "La crítica siempre es bienvenida…"
  como continuación. Atribuir explícitamente al medio el objeto de la crítica. Buscar el audio de La Nueva Radio de
  Florida para pasar a `textual`.

### promesas[0] — 2019-03-30 — "Si gana el Partido Nacional se terminó el aumento de impuestos, las tarifas y los combustibles."
- severidad: bloquea
- tipo: asimetria
- objecion: (a) **La promesa es de tres objetos y el tema es uno.** El `texto` agrupa impuestos, tarifas y
  combustibles, pero está archivada en `economia/combustibles`. La consecuencia práctica es que
  `evidencias_candidatas[1]` (01-04-2020, `en_contra`: suba de UTE 10,5 %, OSE 10,7 %, Antel 9,78 %) **carga contra
  la promesa de combustibles un hecho que no es de combustibles**. Los combustibles, ese mismo día, no subieron. Tal
  como está, la promesa sobre combustibles se puntúa en contra con evidencia de tarifas eléctricas. Eso no se puede
  publicar.
  (b) **Doble conteo.** `evidencias_candidatas[0]` (11-03-2020, `a_favor`) y `[1]` (01-04-2020, `en_contra`) son el
  mismo anuncio, partido en dos fechas y con signos opuestos, con la misma nota de Montevideo Portal como fuente.
  Un solo hecho, dos registros.
  (c) **Faltan los hechos, en las dos direcciones, y esa es la falla mayor del lote.** Sobre una promesa de precios
  no hay un solo registro de un precio. No están las subas efectivas de 2021-2022 (en contra) **ni** las bajas
  efectivas (a favor) — y las hubo: la propia nota de Infobae dice "Tras **la rebaja aplicada en enero de $ 3 en el
  precio de la gasolina y de $ 6 en el gasoil**, el Poder Ejecutivo tomó la decisión de mantener los valores". El
  lote tiene siete declaraciones y cero movimientos de precio. No es un sesgo contra el político —el saldo neto de
  esta omisión es ambiguo— pero deja la promesa **incalificable**.
- cita_de_contexto: "En concreto, la tarifa de UTE subirá 10,5 %, la de OSE 10,7 % y la de Antel 9,78 %. **En
  cambio, no subirán las de Ancap.** Todas estas tarifas se aplicarán a partir del próximo 1º de abril."
  (https://montevideo.com.uy/Noticias/Aumento-de-tarifas-UTE-10-5--OSE-10-7--y-Antel-9-78--No-suben-los-combustibles-uc746676)
- accion_sugerida: 1) Partir la promesa en sus tres componentes, una por tema (`economia/impuestos`,
  `economia/tarifas` o el que corresponda, `economia/combustibles`), o bien sacar la evidencia de UTE/OSE/Antel de
  esta promesa y registrarla bajo el tema que le toca. 2) Fusionar `[0]` y `[1]`. 3) Traer la serie de precios:
  **informes mensuales de PPI de URSEA** (ursea.gub.uy), **"Composición de precio y comparación URSEA" de ANCAP**
  (ancap.com.uy) y **decretos de fijación de precios en IMPO**, marzo 2020 – marzo 2025. Con esa serie la promesa se
  califica sola y sin depender de qué medio cubrió qué mes.

### promesas[1] — 2019-09-04 — "La liberalización de la importación de combustible estará en la Ley de Urgente consideración…"
- severidad: bloquea
- tipo: riesgo_legal
- objecion: `evidencias_candidatas[1]` (09-10-2020) **afirma sobre una ley algo que su propia fuente contradice**.
  La `descripcion` dice: "en el trámite parlamentario de la LUC solo se aprobó liberalizar la importación de
  combustible para buques en los puertos". La nota citada dice que ese artículo se aprobó en la **comisión de
  Presupuesto integrada con Hacienda**, en octubre de 2020 — es decir, en el Presupuesto quinquenal, **tres meses
  después de promulgada la LUC** (ley 19.889, 09-07-2020). La misma nota distingue las dos leyes con todas las
  letras. Publicar "en el trámite de la LUC se aprobó X" cuando X se aprobó en otra ley es un error de hecho sobre
  legislación, del tipo que el sitio no puede permitirse.
  Segundo error en la misma `descripcion`: "no reunió apoyo de toda la coalición de gobierno (**Cabildo Abierto** y
  sectores del Partido Colorado)". La fuente sólo respalda que **Batllistas (Partido Colorado)** se opuso a la
  desmonopolización en la LUC. Cabildo Abierto aparece únicamente por no acompañar la **extensión a los
  aeropuertos** en el Presupuesto. Se le está atribuyendo a un partido una posición que la fuente citada no le
  atribuye: afirma más de lo que la fuente respalda.
  Tercero, y por eso la promesa hoy es **incalificable**: falta el hecho central. El artículo de desmonopolización
  **fue retirado del texto de la LUC antes de votarse**, y en su lugar la ley aprobó el régimen de fijación de
  precios por PPI. De eso no hay una sola línea en el lote.
- cita_de_contexto: "La comisión de Presupuesto integrada con Hacienda aprobó el miércoles, una propuesta
  introducida por el oficialismo para liberalizar la importación del combustible que abastece a los buques. […] **El
  apoyo de Batllistas.** Cuando en el proyecto de ley de Urgente Consideración se propuso la derogación del monopolio
  de Ancap para importar, exportar y refinar petróleo crudo y derivados, el sector Batllistas del Partido Colorado se
  opuso a habilitar la desmonopolización de Ancap. […] De todos modos, Batllistas no acompañó la ampliación de la
  propuesta a los aeropuertos. […] algunos legisladores de la coalición decidieron ampliarlo a los aeropuertos pero
  no tuvo el respaldo ni de Batllistas ni de Cabildo Abierto ni tampoco del Partido Independiente."
  (https://elobservador.com.uy/nota/que-argumenta-el-gobierno-para-habilitar-la-libre-importacion-de-combustibles-para-barcos-202010819440)
- accion_sugerida: 1) Corregir la `descripcion`: fue el **Presupuesto**, no la LUC, y la única oposición a la
  desmonopolización de la LUC que la fuente documenta es la de Batllistas. 2) Traer el hecho que falta. Pistas
  halladas en web, **no abiertas con `pnpm fuente`** — el investigador debe leerlas antes de citarlas, y quedan dos
  grupos distintos disponibles:
  - Subrayado (`fontaina-de-feo`): "La coalición sacará de la LUC la desmonopolización de ANCAP tras falta de
    acuerdo interno" — https://www.subrayado.com.uy/la-coalicion-sacara-la-luc-la-desmonopolizacion-ancap-falta-acuerdo-interno-n631084
  - Montevideo Portal (`montevideo-comm`): "La ley de urgente consideración ya no incluye la desmonopolización de
    Ancap" — https://www.montevideo.com.uy/Noticias/La-ley-de-urgente-consideracion-ya-no-incluye-la-desmonopolizacion-de-Ancap-uc753560
  - Caras y Caretas (`editora-caras-y-caretas`): "LUC: es retirado del texto de la ley el artículo referido a la
    desmonopolización de Ancap" — https://www.carasycaretas.com.uy/luc-retirado-desmonopolizacion-ancap/
  3) Sobre todo: **el documento oficial cierra el caso solo.** Texto de la **ley 19.889 en IMPO, arts. 235 a 237**
  (https://www.impo.com.uy/bases/leyes/19889-2020/235): ahí se ve que la LUC promulgada no derogó el monopolio y que
  lo que sí instauró fue la fijación de precios por el Poder Ejecutivo con informe preceptivo de URSEA que debe
  explicitar el precio de paridad de importación. Un `documento_oficial` sube el registro a `textual` y resuelve la
  promesa y la pregunta del PPI de una sola vez.
- explicacion_alternativa que el lote no documenta y hay que chequear antes de castigar el plazo: la promesa incluía
  "estaría aprobada en 90 días" y la LUC se promulgó el 09-07-2020, ~130 días después de asumir. Entre medio se
  decretó la emergencia sanitaria (13-03-2020) y el trámite parlamentario se alteró. Antes de escribir "no cumplió
  el plazo" hay que verificar el cronograma real del proyecto en la **ficha del proyecto y el Diario de Sesiones del
  Parlamento**. Sin eso, el incumplimiento del plazo no se puede afirmar; el incumplimiento del **contenido** (la
  liberalización general) sí, una vez traídas las fuentes de arriba.

---

## Objeciones al lote

1. **Cero fuentes `textual`.** Siete declaraciones, catorce URLs, ni un video con marca de tiempo, ni un documento
   oficial, ni un diario de sesiones. Se trata de un presidente que durante cinco años tomó una decisión de precios
   pública **todos los meses** y dio ruedas de prensa registradas por Presidencia. Es la debilidad estructural del
   lote y no se arregla agregando más prensa.
2. **Concentración de origen disfrazada de pluralidad de grupos.** Contando por grupo editorial el lote parece
   robusto; contando por origen del habla, no. `declaraciones[4]`: dos grupos, una sola toma de Radio Universal 970.
   `declaraciones[6]`: tres grupos, una sola entrevista en la radio de Florida. `declaraciones[2]`: dos fuentes
   declaradas, pero sólo una reporta la frase. `declaraciones[1]`, `[3]` y `[5]`: fuente única (bien declarada).
   Resultado real: **de siete declaraciones, ninguna tiene dos coberturas independientes de un mismo hecho.**
3. **Ningún medio del lote tiene `alineamiento` partidario, salvo la diaria.** Todos los demás son `sin_datos`. No
   se consultó **El País** (`oficialista_tradicional`, el medio más afín al gobierno de entonces) ni ningún medio
   `progresista` de cobertura (Brecha, Caras y Caretas, La República). Eso no es sesgo por sí solo, pero significa
   que el lote nunca puso a prueba si la prensa afín y la crítica del período reportaron lo mismo. Corrección
   simétrica: leer una nota de El País y una de un medio progresista **para las dos fechas bisagra** (28-05-2022 y
   31-01-2023), no para una sola.
4. **Asimetría en la única fuente con parte tomada.** El único texto de opinión del lote es una columna que sostiene
   que la promesa fue falsa, y se usa como corroboración de la promesa misma. No hay ninguna pieza equivalente del
   otro lado. La corrección no es agregar una columna favorable: es sacar la columna del rol de fuente de hecho
   (ver `declaraciones[0]`).
5. **Faltan hechos, no declaraciones.** Cero registros de subas o bajas efectivas de precio en cinco años. Es la
   omisión más grande y bloquea la calificación de `promesas[0]`. Se resuelve con datos oficiales, no con prensa.
6. **Años faltantes: 2024 y 2026** (el investigador lo declara honestamente en `notas.md`) y, sobre todo, **el
   período del referéndum de la LUC (enero-marzo 2022)**, cuando el precio de los combustibles y el art. 235 fueron
   argumento central de campaña. El lote incluye una pieza **de la campaña del Sí** (la columna de la diaria del
   14-02-2022) y **ninguna declaración de Lacalle Pou de ese mismo período** defendiendo el mecanismo. Esa
   combinación —el argumento en contra presente, su defensa ausente— es la asimetría más concreta del lote y hay
   que corregirla antes de publicar.
7. **Búsquedas asimétricas en `consultas.jsonl`.** Se buscó "no subir combustibles", "espalda de Ancap",
   "recomendación de Ursea", "promesas… cómo argumenta que no las incumple". **No se buscó una sola vez** "rebaja
   de combustibles", "baja del precio de la nafta", "subsidio al supergás" ni "Lacalle Pou combustibles 2024". La
   misma búsqueda hecha sobre otro presidente con estos términos daría registros que acá no se buscaron. Aplicá el
   criterio simétrico: si se busca por lo que salió mal, hay que buscar por lo que salió bien, con el mismo esfuerzo.
8. **`medios_faltantes` de `notas.md` está desactualizado.** `content/medios/infobae.yaml` (grupo `grupo-infobae`) y
   `content/medios/ambito.yaml` (grupo `grupo-ambito`) **ya existen** en el corpus, con `alineamiento: sin_datos`
   justificado. El editor no debe darlos de alta de nuevo. Lo que sí falta es `lr21` (LARED21), inaccesible por
   HTTP 403; el investigador hizo bien en no citarlo. Detalle menor: el corpus guarda la nota de Infobae bajo el
   slug `infobae.com` y el YAML usa `infobae`; conviene unificar.
9. **`menciones.yaml` vacío: correcto.** El criterio del investigador (ninguna cita literal nombra a Orsi; lo nombran
   los cronistas) es el criterio bueno. Sin objeción.
10. **Riesgo legal general: bajo.** No hay denuncias, ni causas judiciales, ni trascendidos anónimos presentados como
    hechos. Nada del lote debería bajar a `hipotesis/` por art. 336 CP ni por ley 18.331 art. 18. Los dos `bloquea`
    de esta crítica son por error de hecho y por evidencia cruzada de tema, no por riesgo legal.

## Objeciones al brief

**El brief no viola la Regla 0.** Pide explícitamente cobertura del período completo, "favorable o desfavorable,
consistente o contradictorio", y no pide seleccionar, omitir ni encuadrar por partido, ideología o persona. La
regla 10 ("Registrá también lo consistente, `sin_cambio` sirve") es exactamente la salvaguarda correcta.
Coincido con `objeciones_al_brief` de `notas.md`: no hay nada que rechazar.

Dos observaciones que no son de Regla 0 sino de calidad del brief:

- La **tabla de medios del brief está desactualizada** respecto de `content/medios/`: faltan `infobae`, `ambito` y
  `lacallepou-uy`, que ya existen. Eso indujo al investigador a abrir una sección `medios_faltantes` innecesaria y
  a dudar del grupo editorial de dos fuentes que ya estaban resueltas en el corpus. Fix: que `pnpm brief` genere la
  tabla leyendo `content/medios/` en vez de una lista fija.
- El brief pone **"precio de paridad de importación, PPI"** entre los alias del tema, o sea que el PPI estaba en
  alcance desde el minuto cero, y el lote igual no produjo ningún registro que lo explique pese a que dos de sus
  fuentes lo describen en detalle. Eso no es defecto del brief: es incumplimiento del brief por parte del lote, y
  está anotado arriba en `declaraciones[4]` y `[5]`.

---

## Cobertura

```yaml
- medio: subrayado
  url: https://www.subrayado.com.uy/si-ganamos-se-termino-la-suba-impuestos-tarifas-y-combustibles-n530131
  titulo: '"Si ganamos se terminó la suba de impuestos, tarifas y combustibles"'
  fecha: 2019-03-30
  evento: 'propuesto:campana-electoral-2019'
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Crónica del acto sin adjetivación ni contracara: "En su discurso, entre otras cosas, prometió que si es electo
    presidente no habrá aumento de impuestos ni tarifas"; el resto son citas suyas y una descripción de la interna.

- medio: en-perspectiva
  url: https://enperspectiva.uy/en-perspectiva-programa/entrevistas/lacalle-pou-llega-al-gobierno-libre-importacion-combustibles-se-aprobara-90-dias-reglamentada-forma-paulatina-ancap-se-prepare-la-competencia/
  titulo: >-
    Si Lacalle Pou llega al Gobierno, libre importación de combustibles se aprobará en 90 días, reglamentada en
    forma paulatina «para que Ancap se prepare para la competencia»
  fecha: 2019-09-04
  evento: 'propuesto:campana-electoral-2019'
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Resumen de coloquio compuesto casi enteramente por citas atribuidas, con la voz del medio limitada a conectores:
    "Frente a la pregunta: ¿Hay que elevar la edad mínima de retiro o hay que incentivar el retiro más tardío?, dijo".

- medio: montevideo-portal
  url: https://montevideo.com.uy/Noticias/Aumento-de-tarifas-UTE-10-5--OSE-10-7--y-Antel-9-78--No-suben-los-combustibles-uc746676
  titulo: 'Aumento de tarifas: UTE 10,5 %, OSE 10,7 % y Antel 9,78 %. No suben los combustibles'
  fecha: 2020-03-11
  evento: 'propuesto:precios-combustibles-2020-2025'
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Reporta la medida y transcribe sus argumentos sin evaluarlos ni contrastarlos: "El gobierno decretó subir la
    mayoría de las tarifas públicas"; no hay voz de la oposición ni calificativo del cronista.

- medio: el-observador
  url: https://elobservador.com.uy/nota/promesas-de-lacalle-lo-que-decia-y-como-argumenta-que-no-las-incumple-202031120430
  titulo: 'Promesas de campaña: lo que decía Lacalle y cómo argumenta que no las incumple'
  fecha: 2020-03-12
  evento: 'propuesto:precios-combustibles-2020-2025'
  politico: lacalle-pou
  tono: desfavorable
  justificacion: >-
    La voz del medio lo coloca en posición de deudor de su palabra y entrecomilla su eufemismo: "Este miércoles, con
    esas promesas sobre la espalda, el presidente argumentó que la diferencia radica en que esta suba –a la que llamó
    'adecuación tarifaria'– no está pensada para 'tapar el agujero'".

- medio: subrayado
  url: https://subrayado.com.uy/lacalle-pou-reivindico-decision-no-subir-combustibles-ganancias-ancap-n816593
  titulo: Lacalle Pou reivindicó decisión de no subir combustibles por ganancias de ANCAP
  fecha: 2021-11-16
  evento: 'propuesto:precios-combustibles-2020-2025'
  politico: lacalle-pou
  tono: favorable
  justificacion: >-
    El medio adopta en voz propia el mérito de la decisión y no incorpora ninguna voz crítica: "El presidente Lacalle
    Pou reivindicó la decisión de no aumentar el precio de los combustibles pese a que el costo del petróleo se
    duplicó en los últimos meses".

- medio: el-observador
  url: https://elobservador.com.uy/nota/lacalle-pou-sobre-ajuste-de-combustibles-para-junio-la-espalda-de-ancap-se-termino--202252814485
  titulo: 'Lacalle Pou sobre ajuste de combustibles para junio: "La espalda de Ancap se terminó"'
  fecha: 2022-05-28
  evento: 'propuesto:precios-combustibles-2020-2025'
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Nota técnica que expone el mecanismo y los números sin juzgar la decisión: "La diferencia se da como resultado de
    que las tarifas se han venido ajustando por debajo de lo que indicaba el Precio Paridad de Importación (PPI)".

- medio: montevideo-portal
  url: https://montevideo.com.uy/Noticias/La-espalda-financiera-de-Ancap-basicamente-se-termino--dijo-Lacalle-Pou-uc823068
  titulo: La espalda financiera de Ancap "básicamente se terminó", dijo Lacalle Pou
  fecha: 2022-05-28
  evento: 'propuesto:precios-combustibles-2020-2025'
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    El cuerpo es cita y contexto regulatorio, con atribución explícita de la pregunta: "Al ser consultado sobre si le
    queda espalda financiera a Ancap, dijo". (El volanta humorístico "No hay lomo pa bancar" es estilo de la casa y
    no alcanza, por sí solo, para mover el tono: la regla pide una frase del cuerpo.)

- medio: infobae
  url: https://infobae.com/america/america-latina/2023/01/31/lacalle-pou-decidio-que-los-combustibles-no-subiran-en-uruguay-en-febrero-pese-a-la-recomendacion-del-ministerio-de-industria
  titulo: >-
    Lacalle Pou decidió que los combustibles no subirán en Uruguay en febrero pese a la recomendación del ministerio
    de Industria
  fecha: 2023-01-31
  evento: 'propuesto:precios-combustibles-2020-2025'
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Explica el mecanismo y relativiza la decisión sin cargarla ni celebrarla: "Se debe tener en cuenta que esas son
    las proyecciones si se siguiera estrictamente la referencia internacional, sin embargo, en múltiples ocasiones el
    Poder Ejecutivo ha decidido no trasladar las proyecciones al precio de venta al público".

- medio: el-observador
  url: https://elobservador.com.uy/nacional/la-primera-entrevista-lacalle-pou-como-expresidente-la-critica-siempre-es-bienvenida-es-esencial-la-tarea-n5997780
  titulo: >-
    Luis Lacalle Pou dio su primera entrevista tras dejar la Presidencia y habló de Ancap: "Las cosas que se están
    diciendo no las comparto"
  fecha: 2025-05-07
  evento: 'propuesto:polemica-balance-ancap-2025'
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Descripción sin adjetivos de la posición del entrevistado: "se mostró crítico con la polémica que se ha gestado
    con respecto a los números de Ancap presentado por el gobierno de Yamandú Orsi".

- medio: subrayado
  url: https://subrayado.com.uy/lacalle-pou-criticas-la-gestion-su-gobierno-ancap-las-cosas-que-se-estan-discutiendo-no-las-comparto-n976446
  titulo: 'Lacalle Pou sobre críticas a la gestión de su gobierno en Ancap: "Las cosas que se están discutiendo, no las comparto"'
  fecha: 2025-05-07
  evento: 'propuesto:polemica-balance-ancap-2025'
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Cita extensa y atribución precisa del objeto, sin valoración: "dijo sobre los planteos sobre Ancap que hizo el
    gobierno actual respecto al anterior".

- medio: ambito
  url: https://ambito.com/uruguay/reaparecio-luis-lacalle-pou-y-apunto-contra-el-gobierno-leo-cosas-que-tiran-y-no-podes-creer-n6142537
  titulo: 'Reapareció Luis Lacalle Pou y apuntó contra el gobierno: "Leo cosas que tiran y no podés creer"'
  fecha: 2025-05-07
  evento: 'propuesto:polemica-balance-ancap-2025'
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Hay glosa del cronista ("expresó, contrario al gobierno del Frente Amplio (FA)", "apostó un poco más en su
    comentario"), pero ninguna frase lo elogia ni lo descalifica; describe el contexto: "desde el oficialismo señalan
    como responsabilidad de la gestión anterior".

- medio: la-diaria
  url: https://ladiaria.com.uy/economia/articulo/2022/2/el-precio-de-los-combustibles-entre-falsas-promesas-y-la-defensa-de-la-luc/
  titulo: 'El precio de los combustibles: entre falsas promesas y la defensa de la LUC'
  fecha: 2022-02-14
  evento: referendum-luc
  politico: lacalle-pou
  tono: desfavorable
  justificacion: >-
    Columna de opinión que dictamina el incumplimiento como hecho establecido: "además del más que evidente
    incumplimiento de la promesa electoral de bajar el precio de los combustibles y la electricidad, queda claro que,
    lejos del anunciado manejo técnico…".

- medio: subrayado
  url: https://subrayado.com.uy/ancap-perdera-el-monopolio-importacion-exportacion-y-refinado-combustibles-n591905
  titulo: Ancap perderá el monopolio de importación, exportación y refinado de combustibles
  fecha: 2020-01-22
  evento: 'propuesto:tramite-luc-2020'
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Descripción del articulado sin valoración ni voces a favor o en contra: "El proyecto de ley de urgente
    consideración que este miércoles presentó el presidente electo Luis Lacalle Pou propone derogar el monopolio que
    tiene Ancap".

- medio: el-observador
  url: https://elobservador.com.uy/nota/que-argumenta-el-gobierno-para-habilitar-la-libre-importacion-de-combustibles-para-barcos-202010819440
  titulo: Qué argumenta el gobierno para habilitar la importación de combustibles en puertos
  fecha: 2020-10-09
  evento: 'propuesto:tramite-luc-2020'
  partido: Partido Nacional
  tono: neutral
  justificacion: >-
    Da la fundamentación oficial y las razones de quienes dudaban, sin tomar posición: "Consultado sobre si esta
    decisión no iba en el mismo sentido que lo que el gobierno intentó hacer en la LUC, el diputado señaló que 'hoy
    por hoy' es un negocio que Ancap no está teniendo".
```

Balance de tono del lote: 10 neutral, 2 desfavorable, 1 favorable, 1 sin político asignado (partido). Los dos
`desfavorable` son una columna de opinión y una nota de chequeo de promesas; el `favorable` es una nota sin
contracara. Ninguno de los tres es prueba de línea editorial por sí solo; se registran nota por nota, como
corresponde, y con el mismo criterio que se aplicaría a cualquier otro político.

Eventos propuestos que el editor tendría que crear en `content/eventos/` (ninguno existe hoy):
`campana-electoral-2019` (mar-oct 2019, previo a `elecciones-2019`, que arranca el 27-10-2019),
`precios-combustibles-2020-2025`, `tramite-luc-2020`, `polemica-balance-ancap-2025`.

---

## Veredicto editorial sugerido

### Candidatos a giro

**Giro 1 — "no van a subir los combustibles" (2019) → "la espalda de Ancap se terminó" (2022)**

- `cambio`: **parcial**, no total. La promesa de campaña era absoluta ("se terminó"). Los hechos que el propio lote
  documenta muestran precios sostenidos por debajo de la referencia durante meses y después trasladados al público,
  pero **no queda probado en este lote cuánto se trasladó**. La lectura honesta con la evidencia disponible es
  "prometió que no subirían y terminó subiéndolos, conteniendo la suba por debajo de la referencia internacional",
  no "prometió que no subirían y los subió como cualquier otro".
- `explicacion`: hay una explicación de contexto **documentada**, y hay una racionalización posterior. Conviene no
  confundirlas.
  - **Documentada, y anterior al problema:** el PPI. La LUC (ley 19.889, arts. 235-237, julio de 2020) obligó al
    Poder Ejecutivo a fijar precios con informe preceptivo de URSEA que explicita el precio de paridad de
    importación. Es decir: **el mecanismo que ató el precio local a la referencia internacional lo instauró el
    propio gobierno, un año y medio antes de la presión de precios, y no como excusa cuando llegó la presión.**
    Antecedente aún más temprano y en el propio lote: Arbeleche, en campaña (04-09-2019), "que las tarifas públicas
    reflejen realmente los costos de producción de las empresas". Y matiz que juega en contra del gobierno y también
    hay que decir: según la propia nota de Infobae, la metodología de PPI "se aplica desde 2002, pero sufrió
    modificaciones en 2010 y en 2017" — o sea que el PPI no nació con la LUC y el gobierno no puede presentarlo como
    una atadura heredada e ineludible. Ambas cosas son ciertas y ambas van.
  - **Documentada:** la suba del crudo. Está en el lote sólo para 2021, y en boca de él: "después de haberse
    duplicarse el precio del refinado (de petróleo) en el Golfo… Pasó de 42 o 47 a 84 (dólares el barril)"
    (Subrayado, 16-11-2021). Para 2022 las fuentes hablan de un mercado "volátil" y de "este aumento de combustibles
    a nivel mundial", pero **ninguna fuente del lote menciona la guerra en Ucrania.** Si la usamos, la ponemos
    nosotros. **Recomendación: no invocar la guerra hasta traer una fuente que la vincule**; sirve el informe mensual
    de PPI de URSEA del período, que publica la referencia internacional.
  - **Racionalización posterior:** "la espalda de Ancap se terminó" como si fuera un dato de la naturaleza. Fue una
    decisión discrecional del Poder Ejecutivo, y él mismo lo dice ocho meses después: "a veces el gobierno ha subido,
    a veces no" (31-01-2023). El gobierno podía subir o no subir; eligió.
- **¿Reconoce el cambio o lo justifica?** Lo **justifica**, y ni siquiera se le pregunta por la promesa: en ninguna
  de las dos notas del 28-05-2022 aparece 2019. Pero — y esto el lote lo tiene y no lo usa — **sí reconoció en 2021
  que la regla indicaba subir**: "deberíamos de haber aumentado". Eso convierte al episodio en una **política
  explícita y sostenida de traslado parcial**, no en un viraje oculto. El giro existe respecto de la frase de
  campaña; no existe respecto de la política que el gobierno venía aplicando y explicando desde 2020.
- **No publicable como giro hasta que**: se corrija el `resumen` de `declaraciones[2]` (hoy dice lo contrario de lo
  que dice la fuente), se extienda la cita de `declaraciones[3]` hasta "deberíamos de haber aumentado", se incorpore
  el PPI a `declaraciones[4]` y se verifique qué pasó efectivamente en junio de 2022.

**Giro 2 — promesa amplia (2019) vs. suba de UTE/OSE/Antel a los 11 días (2020)**

- `cambio`: **sí, pero no es de este tema.** El incumplimiento del 11-03-2020 es de la parte tarifaria de la
  promesa; en combustibles ese mismo día se cumplió. Registrarlo bajo `economia/combustibles` mezcla dos cosas.
- `explicacion`: la suya está documentada y hay que darla completa: sostiene que fue una "adecuación" por debajo de
  costos, causada por la omisión del gobierno saliente en enero de 2020, y que el compromiso "no se incumplió, se
  súper cumplió" (Alfie). El Observador la recoge y la discute; el lector puede juzgar.
- Recomendación: **sacarlo de este tema** y tratarlo en el tema de tarifas/impuestos, donde la comparación es
  pertinente y donde además el lote no tiene por qué resolverla.

### Promesas (mandato terminado el 1 de marzo de 2025)

**promesas[0] — "se terminó el aumento de impuestos, las tarifas y los combustibles" (30-03-2019)**

- `estado` sugerido: **incalificable con la evidencia de este lote.** No por falta de fuentes sino por falta del
  dato correcto: hay siete declaraciones y ningún precio. Si me obligan a fallar hoy, sobre la parte de combustibles
  y con el mandato ya cerrado, el fallo sería **incumplida parcialmente / cumplida a medias**: los precios subieron
  (él mismo lo anticipa en 2022 y lo administra mes a mes), pero también hubo meses de contención y rebajas
  efectivas que el lote reconoce al pasar ("la rebaja aplicada en enero [de 2023] de $ 3 en el precio de la gasolina
  y de $ 6 en el gasoil"). Publicar ese fallo hoy sería opinar con datos incompletos.
- Fundamento para calificarla bien, y es barato: comparar el precio de venta al público de nafta súper, gasoil y
  supergás al **01-03-2020** contra el **01-03-2025**, en pesos corrientes y deflactado por IPC, con la **serie de
  ANCAP "Composición de precio y comparación URSEA"**, los **informes mensuales de PPI de URSEA** y los **decretos
  de fijación de precios en IMPO**. Son datos públicos, mensuales y de organismo oficial. Con eso la promesa se
  califica sin que ningún medio medie.
- Requisito previo: **partir la promesa por tema** (impuestos / tarifas / combustibles). Tal como está archivada, se
  la calificaría con evidencia de otro tema, y eso el sitio no lo puede publicar.

**promesas[1] — "la liberalización de la importación estará en la LUC, aprobada en 90 días" (04-09-2019)**

- `estado` sugerido: **la evidencia de este lote no alcanza para calificarla, y además la que hay está mal
  atribuida.** Digo esto con todas las letras porque es exactamente lo que el editor me pidió que dijera si pasaba:
  el único registro que habla del resultado parlamentario (`evidencias_candidatas[1]`) atribuye a la LUC un artículo
  que se aprobó en el **Presupuesto**, y le atribuye a Cabildo Abierto una oposición que su fuente no documenta.
- Lo que **sí** puede afirmarse una vez traído el texto de la ley: la promesa tenía dos partes y las dos se
  resuelven con un solo documento oficial. (i) **Contenido:** la LUC promulgada **no derogó** el monopolio de ANCAP
  para importar, exportar y refinar; el artículo se retiró antes de la votación por falta de acuerdo en la coalición
  y en su lugar quedaron los arts. 235-237, de fijación de precios con informe preceptivo de URSEA y PPI. Con eso
  documentado (ley 19.889 en IMPO + una de las tres notas listadas arriba), el estado es **incumplida**, con la
  salvedad explícita de que en octubre de 2020, por el Presupuesto, sí se liberalizó la importación de combustible
  para buques en puertos —un cumplimiento marginal y de otro alcance que el prometido—. (ii) **Plazo:** la LUC se
  promulgó el 09-07-2020, ~130 días después de asumir, no 90. **No calificar el plazo sin antes chequear el
  cronograma real del proyecto en el Diario de Sesiones**, porque entre medio se decretó la emergencia sanitaria
  (13-03-2020): puede ser incumplimiento o puede ser causa externa, y hoy no lo sabemos.
- Con el mandato terminado el 01-03-2025 y sin liberalización general de la importación en cinco años, el desenlace
  no está en disputa; lo que está mal es el papel de trabajo. Se arregla con una lectura de IMPO.

---

## Resumen para el editor

| severidad | cantidad | registros |
|---|---|---|
| bloquea | 3 | `declaraciones[2]`, `promesas[0]`, `promesas[1]` |
| corregir | 6 | `declaraciones[0]`, `[1]`, `[3]`, `[4]`, `[5]`, `[6]` |
| aviso | 0 | — |
| sin_objecion | 0 | — |

Ningún registro quedó sin objeción, y eso también se audita: la razón es que el lote entero descansa en prensa de
segunda mano sin una sola fuente `textual`, y eso deja margen de corrección en los nueve. Los tres `bloquea` no son
por mala fe ni por sesgo: dos son errores de hecho verificables contra la fuente citada y uno es evidencia de otro
tema aplicada a este. Los seis `corregir` se resuelven todos con cambios concretos ya enumerados, la mayoría sin
salir a buscar nada nuevo.
