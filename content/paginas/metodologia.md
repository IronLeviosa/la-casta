---
titulo: Metodología
descripcion: Escalas, niveles de evidencia, niveles de publicación, perfiles de medios, regla de dos grupos, procedencia y auditoría, marco legal y divulgación sobre el uso de IA.
actualizado: "2026-09-03"
---

Esta página describe cómo se produce cada tipo de registro y qué tiene que cumplir para publicarse. Las reglas las hace cumplir un validador automático que corre antes de cada publicación; si un registro no las cumple, el sitio no se construye. Las versiones exactas están en `CLAUDE.md` y en `scripts/validadores/` del repositorio.

## Escalas

### Giros

Un giro es un par de declaraciones de la misma persona sobre el mismo tema, en fechas distintas. Se califican en dos ejes:

- **Cambio**: `sin cambio`, `cambio parcial`, `cambio total`. Escala tomada del Flip-O-Meter de PolitiFact.
- **Explicación**: `reconocido explícitamente` (la persona dijo que cambió y por qué; se cita), `justificado por contexto` (hay un hecho externo documentado entre las dos fechas que explica el cambio; se cita), `sin explicación`.

Los giros `sin cambio` también se publican: la consistencia es información, y un sitio que solo muestra cambios sería una lista negra. Un giro `cambio total + sin explicación` requiere aprobación humana firmada antes de publicarse.

**Un giro no es una promesa incumplida.** El giro mide una sola cosa: si lo que dijo después coincide con lo que dijo antes. No mide si hizo lo que prometió, ni qué efecto tuvo lo que hizo. Alguien puede sostener la misma postura durante todo el mandato y aun así incumplir la promesa, y al revés. Por eso, cuando hay una promesa del mismo político sobre el mismo tema, el giro la enlaza y dice en qué estado está: son dos lecturas distintas del mismo hecho, y quedarse con una sola da una idea equivocada. El enlace se calcula, no se carga a mano, así que aparece igual para todos los políticos.

### Promesas

Escala de Chequeado (Argentina), también usada por UYCheck: `cumplida`, `en proceso adelantada`, `en proceso demorada`, `incumplida`. Acá se califica lo que pasó, no lo que se dijo: una promesa se juzga por el instrumento legal o la acción de gobierno y por su efecto documentado, aunque la persona sostenga que mantuvo la postura. Cada estado lleva una fundamentación y una línea de tiempo de evidencias fechadas (ley, decreto, acción de gobierno, dato oficial, declaración, omisión), cada una marcada como a favor, en contra o neutral.

### Veracímetro

Chequea afirmaciones concretas (cifra, fecha, hecho), nunca opiniones. Tres calificaciones: `verdadero` (verde), `discutible` (amarillo), `falso` (rojo). Regla dura: verde y rojo exigen al menos una fuente de tipo documento oficial (INE, BCU, MEF, DGI, Parlamento, Poder Judicial, Corte Electoral, JUTEP) o un dataset público; una nota de prensa sola alcanza solo para `discutible`. El color siempre va con texto e ícono. Cada chequeo lleva el dato real con su fuente y un permalink con marcado ClaimReview.

### Casos

Un caso es un hecho con implicancia judicial o de integridad que ya está en fuentes públicas. Entra al sitio con un umbral amplio pero definido: denuncia formal presentada, investigación de Fiscalía, o acusación pública hecha por una persona identificable en un medio. Trascendidos anónimos y rumores no entran.

Cada caso tiene una línea de tiempo de etapas: `denuncia`, `investigación`, `formalización`, `condena`, `absolución`, `archivo`, cada una con fecha y fuente. La **etiqueta legal** que se muestra la deriva el validador de la última etapa: `denuncia` (denuncia o investigación), `formalizado`, `condena`, `cerrado sin condena` (absolución o archivo). No se escribe a mano.

**Cuáles pasan por aprobación humana.** Los que la justicia todavía no resolvió: etiqueta `denuncia` o `formalizado`. Ahí hay una decisión con costo, porque se publica una acusación sobre una persona nombrada que puede terminar en nada, y esa decisión la toma una persona que firma. Los casos que ya terminaron en `condena` o en `cerrado sin condena` no la necesitan: un tribunal les dedicó tiempo y recursos, el hecho es público y está firmado por quien tenía que firmarlo, y una aprobación nuestra no agregaría criterio. Solo agregaría demora, y convertiría la compuerta en un trámite. Una compuerta que siempre dice que sí no filtra nada, y encima anuncia una revisión que no ocurre.

### Sustancia del discurso y evasión en entrevistas

Se clasifica cada oración de una intervención transcrita (discurso, entrevista, sesión, cadena) en una de ocho clases: `hecho verificable`, `propuesta concreta` (con especificidad 1 a 3), `posición`, `argumento`, `ataque`, `evasión`, `retórica`, `otro`. La tipología de evasión sigue a Bull y Mayer (1993, *Political Psychology*, "How not to answer questions in political interviews"), que codificaron entrevistas electorales británicas y hallaron que Thatcher y Kinnock no respondieron alrededor del 56 % y el 59 % de las preguntas; y la formalización jerárquica de claridad de respuesta de SemEval-2026 Task 6, CLARITY. La escala de especificidad de propuestas adapta Subramanian et al. (2019), "Pledge Specificity Prediction".

Contra el sesgo del clasificador: (1) etiquetado a ciegas, con nombres, partidos y cargos reemplazados por marcadores; (2) doble etiquetado independiente con dos modelos distintos y kappa de Cohen por intervención; si κ < 0,6 la intervención no se publica y va a revisión; el κ promedio se publica acá cuando exista; (3) mínimo de 10 intervenciones y 10 000 palabras por persona antes de mostrar nada; (4) siempre la distribución completa por clase con intervalo de confianza bootstrap al 95 %, nunca un número solo; (5) cada segmento es un registro que se puede abrir junto a la transcripción y discutir.

El **ratio de afirmaciones falsas** se publica aparte, con dos denominadores (por cada 1000 palabras y sobre afirmaciones verificables chequeadas), y solo sobre intervenciones chequeadas exhaustivamente, para evitar el sesgo de elegir qué chequear.

### Patrimonio

Solo declaraciones juradas públicas. El artículo 12-BIS de la ley 17.060, agregado por la ley 19.797 en 2019, manda a la JUTEP publicar en su sitio las declaraciones de presidente, vicepresidente, senadores, diputados, ministros, subsecretarios, ministros de los altos tribunales, directores de entes autónomos, intendentes, secretarios generales y alcaldes; también son públicas las de los candidatos proclamados. Lo que se omite en esas publicaciones no es la declaración sino los datos que identifican cada bien, por razones de seguridad. Cada declaración se carga desde el PDF de la JUTEP con activo, pasivo, neto e ingresos, y se expresa en dólares y en Unidades Indexadas constantes con las cotizaciones del BCU a cada fecha, para que inflación y tipo de cambio no se confundan con variación real. Para cada par de declaraciones consecutivas se calcula la variación del neto y una banda de lo explicable por ingresos declarados (netos de una estimación de impuesto y consumo), rendimientos a tasa de referencia y eventos declarados (herencia, venta, compra). Los supuestos de la banda están escritos junto al gráfico y se pueden cambiar. Un residuo positivo no se publica como acusación: se publica como "variación no explicada por lo declarado", junto con todas las explicaciones públicas que dio la persona. Cuando de una persona todavía no procesamos sus declaraciones, el sitio lo dice así en lugar de dejar el hueco, para que la ausencia no se lea como ocultamiento.

### Sesgo de medios

Cada nota de prensa que entra al corpus recibe un registro de tono (`favorable`, `neutral`, `desfavorable`) respecto del político o partido que cubre, con una oración de justificación que cita la nota. Lo asigna el agente crítico y lo revisa el editor. Con eso se muestra, por medio, la distribución de tono por partido, la cuota de cobertura y los titulares de todos los medios para el mismo hecho, lado a lado. Siempre con el tamaño de muestra visible, con la advertencia de que el tono es una clasificación de IA verificable nota por nota, y solo cuando el medio tiene al menos 50 notas.

## Niveles de evidencia

Cada afirmación declara su nivel:

- **Textual**: lo dijo con esas palabras y hay registro primario (video con marca de tiempo, documento oficial, diario de sesiones).
- **Reportado**: lo cuenta la prensa. Exige dos fuentes de distinto grupo de medios (ver abajo).
- **Inferencia**: conclusión propia. Exige una cadena de pasos, cada uno con su fuente, que se muestra completa.

Toda fuente lleva cita literal de al menos 20 caracteres, enlace al original, copia en Wayback y fecha de consulta. Las citas de video se verifican contra una transcripción automática (Whisper) y se muestra el fragmento de transcripción alrededor de la marca de tiempo. Las citas que no se pueden verificar mecánicamente (televisión sin descarga, redes con acceso restringido, contenido pago) se marcan como de verificación manual y requieren aprobación.

## Niveles de publicación

- **Publicado**: cumple todas las reglas. Es lo que se ve en el sitio.
- **Probable**: falta una segunda fuente, una etapa o una aprobación. Se muestra en una sección aparte, excluida de buscadores, con un aviso permanente que dice qué falta.
- **Hipótesis**: privado. No está en el repositorio público ni en el sitio. Existe para acumular evidencia con sus explicaciones alternativas hasta que haya documento oficial o actuación judicial, o para descartarse.

## Perfiles de medios y regla de dos grupos

Cada medio citado tiene un perfil con tipo, grupo de propiedad, descripción de la propiedad con fuentes y una etiqueta de alineamiento con su justificación y fuentes. Los perfiles son descriptivos, cortos y sourceados; la página de réplica también los cubre.

La independencia entre fuentes se mide por **grupo**, no por nombre: dos diarios del mismo grupo cuentan como uno, y una nota de agencia reproducida en varios diarios cuenta como una. Si las dos fuentes son de distinto grupo pero comparten alineamiento, el registro lo muestra.

## Procedencia y auditoría

Cada registro publicado lleva un bloque de procedencia: corrida, agente, hash del archivo de instrucciones del agente, modelo, hash del brief y fecha. Cada corrida deja en `data/corridas/<id>/`: el prompt exacto, los hashes de todas las instrucciones vigentes, las búsquedas y URLs leídas en orden, el registro crudo antes de editar, la crítica, la diferencia entre crudo y publicado, y la razón de cada cambio. Todo commit que toca contenido referencia su corrida o corrección, y la integración continua rechaza los que no. Cada release se etiqueta y se archiva en Software Heritage. El procedimiento de auditoría está en `AUDITORIA.md` y en el comando `/auditar` del repositorio.

## Marco legal

- **Código Penal, art. 336** (redacción de la ley 18.515): exime de responsabilidad las manifestaciones sobre asuntos de interés público referidas a funcionarios públicos, salvo real malicia. Publicar proceso, metodología, fuentes y correcciones en abierto es la forma de demostrar ausencia de malicia; por eso nada se publica sin fuente ni sin rastro.
- **Ley 18.331, art. 18**: los datos relativos a infracciones penales solo los tratan las autoridades competentes. **Ley 18.331, art. 9 bis**: las fuentes públicas (medios, publicaciones oficiales) son de acceso libre. Consecuencia: la sección de casos reproduce solo lo que ya está en fuentes públicas, con estado judicial y fecha explícitos, y sus casos sin resolución judicial son los únicos registros con aprobación humana obligatoria. Cuando un caso se archiva o termina en absolución, la etiqueta cambia y el registro lo muestra en primer lugar.
- **Ley 17.060** (modificada por la 19.797): declaraciones juradas de bienes e ingresos ante la JUTEP. Su artículo 12-BIS manda publicar las declaraciones de presidente, vicepresidente, senadores, diputados, ministros, subsecretarios, ministros de los altos tribunales, directores de entes autónomos, intendentes, secretarios generales y alcaldes, omitiendo los datos que identifican cada bien. El detalle de cada bien queda reservado por el artículo 12.1, y el artículo 14 manda conservarlas diez años desde el cese y después destruirlas, así que de mandatos viejos puede no quedar nada. El sitio usa únicamente lo publicado.
- **Ley 19.827**: debate obligatorio entre candidatos al balotaje. Base de la cobertura de eventos en vivo, prevista para una fase posterior.

Cada una de estas leyes tiene su ficha en [Leyes citadas](../leyes/), y en cualquier página del sitio, al pasar el mouse o al tabular hasta una referencia como "ley 18.331", aparece un resumen de qué dice esa ley. **Esos resúmenes los escribimos nosotros, en lenguaje llano, y son una interpretación: el texto de la ley dice lo que dice, y un resumen es una lectura de ese texto.** Por eso cada resumen va con la cita literal del artículo del que sale y con el enlace al texto oficial en IMPO, que está siempre a un clic; y por eso un resumen que no se corresponda con la norma es un error corregible como cualquier otro, por el canal de [Correcciones](../correcciones/). Nada de esto es asesoramiento legal.

## Divulgación sobre el uso de IA

El contenido lo produce una IA con supervisión humana acotada. Qué modelo hace qué, con qué instrucciones, y cómo verificarlo, está en [Sobre](../sobre/). La IA no recibió instrucciones partidarias; ningún modelo está libre de sesgos de entrenamiento; lo que este sitio garantiza es el proceso verificable descrito en esta página.
