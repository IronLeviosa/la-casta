## procedimiento_constitucional

Verificado en esta sesión, artículo por artículo, en IMPO (Constitución de la República Oriental del
Uruguay, texto de 1967, Sección VII, Capítulo II):

- **Artículo 137** (plazo del Ejecutivo para observar): "Si recibido un proyecto de ley, el Poder
  Ejecutivo tuviera objeciones que oponer u observaciones que hacer, lo devolverá con ellas a la
  Asamblea General, dentro del plazo perentorio de diez días." —
  https://www.impo.com.uy/bases/constitucion/1967-1967/137

- **Artículo 138** (mayoría para levantar el veto): "Cuando un proyecto de ley fuese devuelto por el
  Poder Ejecutivo con objeciones u observaciones, totales o parciales, se convocará a la Asamblea
  General y se estará a lo que decidan los tres quintos de los miembros presentes de cada una de las
  Cámaras, quienes podrán ajustarse a las observaciones o rechazarlas, manteniendo el proyecto
  sancionado." —  https://www.impo.com.uy/bases/constitucion/1967-1967/138

- **Artículo 139** (silencio de la Asamblea): "Transcurridos treinta días de la primera convocatoria
  sin mediar rechazo expreso de las observaciones del Poder Ejecutivo, las mismas se considerarán
  aceptadas." —  https://www.impo.com.uy/bases/constitucion/1967-1967/139

- **Artículo 140** (si la Asamblea desaprueba el proyecto devuelto): "Si las Cámaras reunidas
  desaprobaran el proyecto devuelto por el Poder Ejecutivo, quedará sin efecto por entonces, y no
  podrá ser presentado de nuevo hasta la siguiente Legislatura." —
  https://www.impo.com.uy/bases/constitucion/1967-1967/140

- **Artículo 141** (transparencia de la votación): "En todo caso de reconsideración de un proyecto
  devuelto por el Ejecutivo, las votaciones serán nominales por sí o por no, y tanto los nombres y
  fundamentos de los sufragantes, como las objeciones u observaciones del Poder Ejecutivo, se
  publicarán inmediatamente por la prensa." —
  https://www.impo.com.uy/bases/constitucion/1967-1967/141

No se afirma nada de este bloque de memoria: los cinco artículos se leyeron con `pnpm fuente` en esta
sesión y la cita de cada uno es literal.

Nota de terminología, confirmada empíricamente en esta corrida: la etiqueta de trámite "Asamblea
General levanta veto" **no siempre significa que el veto se revirtió**. En al menos un caso (Ley
18.007, embarcaciones deportivas) esa etiqueta acompaña una resolución que en realidad *acepta la
observación del Poder Ejecutivo* (es decir, el veto quedó firme); el texto que sigue a la etiqueta
("Asamblea General acepta la observación interpuesta...") es el que hay que leer para saber qué pasó
en cada caso, no la etiqueta sola. Esto se aplicó de forma pareja a los once vetos de esta corrida.

## metodo (cómo se llegó a "once vetos, ninguno en el segundo mandato")

Se cruzaron tres métodos mecánicos independientes, los mismos para los dos mandatos:

### 1. Barrido completo de leyes promulgadas (dataset abierto del Parlamento)

Se bajó el dataset completo de leyes promulgadas
(`https://parlamento.gub.uy/transparencia/datos-abiertos/leyes-promulgadas/csv`, 4786 filas, todas
las leyes promulgadas desde 1985) y se filtró por fecha de promulgación para cada mandato. El total
de cada tramo se confirmó además, en vivo, con el buscador de leyes promulgadas del propio sitio:

- Primer mandato (2005-03-01 a 2010-03-01, Legislatura XLVI): **791 leyes**.
  URL: https://parlamento.gub.uy/documentosyleyes/leyes-promulgadas?Fechadesde=2005-03-01&Fechahasta=2010-03-01
  ("Se encontraron 791 Leyes Promulgadas"). Desglose año por año, para que se pueda repetir el
  barrido en tramos manejables:
  - 2005-03-01 a 2005-12-31: 76 — https://parlamento.gub.uy/documentosyleyes/leyes-promulgadas?Fechadesde=2005-03-01&Fechahasta=2005-12-31
  - 2006: 147 — https://parlamento.gub.uy/documentosyleyes/leyes-promulgadas?Fechadesde=2006-01-01&Fechahasta=2006-12-31
  - 2007: 163 — https://parlamento.gub.uy/documentosyleyes/leyes-promulgadas?Fechadesde=2007-01-01&Fechahasta=2007-12-31
  - 2008: 209 — https://parlamento.gub.uy/documentosyleyes/leyes-promulgadas?Fechadesde=2008-01-01&Fechahasta=2008-12-31
  - 2009: 184 — https://parlamento.gub.uy/documentosyleyes/leyes-promulgadas?Fechadesde=2009-01-01&Fechahasta=2009-12-31
  - 2010-01-01 a 2010-03-01: 12 — https://parlamento.gub.uy/documentosyleyes/leyes-promulgadas?Fechadesde=2010-01-01&Fechahasta=2010-03-01
  - Suma: 76+147+163+209+184+12 = 791. Coincide exactamente con el filtro del dataset.
- Segundo mandato (2015-03-01 a 2020-03-01, Legislatura XLVIII): **545 leyes**.
  URL: https://parlamento.gub.uy/documentosyleyes/leyes-promulgadas?Fechadesde=2015-03-01&Fechahasta=2020-03-01
  ("Se encontraron 545 Leyes Promulgadas"). Desglose:
  - 2015-03-01 a 2015-12-31: 49 — https://parlamento.gub.uy/documentosyleyes/leyes-promulgadas?Fechadesde=2015-03-01&Fechahasta=2015-12-31
  - 2016: 107 — https://parlamento.gub.uy/documentosyleyes/leyes-promulgadas?Fechadesde=2016-01-01&Fechahasta=2016-12-31
  - 2017: 116 — https://parlamento.gub.uy/documentosyleyes/leyes-promulgadas?Fechadesde=2017-01-01&Fechahasta=2017-12-31
  - 2018: 143 — https://parlamento.gub.uy/documentosyleyes/leyes-promulgadas?Fechadesde=2018-01-01&Fechahasta=2018-12-31
  - 2019: 128 — https://parlamento.gub.uy/documentosyleyes/leyes-promulgadas?Fechadesde=2019-01-01&Fechahasta=2019-12-31
  - 2020-01-01 a 2020-03-01: 2 — https://parlamento.gub.uy/documentosyleyes/leyes-promulgadas?Fechadesde=2020-01-01&Fechahasta=2020-03-01
  - Suma: 49+107+116+143+128+2 = 545. Coincide exactamente.

Por cada una de las 791 + 545 = **1336 leyes**, se descargó su ficha de trámite
(`parlamento.gub.uy/documentosyleyes/ficha-asunto/<asunto>/ficha_completa`) con un script propio (no
`pnpm fuente`, por volumen: se habría tardado horas y llenado el corpus de 1336 notas; se usó
`curl`/Python en paralelo, 8 conexiones a la vez) y se buscó la frase "Poder Ejecutivo veto total" o
"Poder Ejecutivo veto parcial" en el HTML de cada una. Resultado: **0 errores de descarga en las 1336
fichas**; **12 fichas** del primer mandato con línea de veto, **0** del segundo. Cada una de las 12
fichas del primer mandato sí se releyó con `pnpm fuente` (ver `consultas.jsonl`) para construir los
registros de `vetos.yaml`, exactamente con el método de "ficha de trámite, sección Sanciones" que se
usó para verificar el veto de 2008 (control positivo).

De esas 12, una (Ley 17.888, "Escuela 41 Trinidad, Flores") resultó ser un **veto de Jorge Batlle**
(observado el 19-05-2004, antes de que Vázquez asumiera; la ley recién se promulgó el 22-08-2005, ya
con Vázquez en la presidencia, porque el trámite había quedado archivado más de un año). El barrido
por fecha de *promulgación* puede traer estos falsos positivos cuando un trámite cruza el cambio de
mandato; se corrigió a mano revisando la fecha exacta de cada veto (no solo la de promulgación) y se
excluyó del archivo. Se registró como pista cruzada en
`/Users/santiago/Documents/GitHub/la-casta-corpus/pistas/batlle.yaml`. Quedan, entonces, **once vetos
genuinos de Vázquez**, los once en el primer mandato.

### 2. Índice de diarios de sesión de la Asamblea General

Un veto va necesariamente a la Asamblea General, que sesiona pocas veces por legislatura: leer el
índice de sus diarios de sesión es una lista corta y completa, más barata que abrir cientos de
fichas, y sirve de verificación cruzada del método 1. El Parlamento publica un export CSV de este
índice, con un campo "Resumen" que describe el orden del día de cada sesión.

- Legislatura XLVI (primer mandato): **66 diarios de sesión** de la Asamblea General.
  URL: https://parlamento.gub.uy/documentosyleyes/documentos/diarios-de-sesion?Cpo_codigo=A&Lgl_Nro=46
  (CSV: https://parlamento.gub.uy/documentosyleyes/documentos/diarios-de-sesion/csv?Cpo_codigo=A&Lgl_Nro=46&_format=csv).
  De las 66, **6 sesiones** mencionan "observ" o "veto" en el resumen: corresponden a los vetos de
  Defensa Nacional (sesión del 09-02-2010), Salud Sexual y Reproductiva (20-11-2008), Rendición de
  Cuentas 2007 (30-09-2008), Datos Personales/Habeas Data (06-08-2008), Fondo lechera —solo la entrada,
  10-01-2007—, y Embarcaciones deportivas (22-08-2006). Las otras cinco vetos identificados por el
  método 1 (INAM, Partidos Políticos, Vehículos/seguro, Importaciones, Discapacitados) no tienen una
  sesión de la Asamblea General que los resuelva expresamente: coherente con que varios de ellos se
  resolvieron por vencimiento del plazo constitucional (artículo 139) sin necesidad de una sesión de
  votación, y en tres casos (Vehículos, Discapacitados, Importaciones) con que la propia ficha tampoco
  registra una resolución explícita (ver `vetos.yaml`, `resultado.estado: sin_datos` en esos tres
  registros). Ninguna sesión adicional, de las 66, sugiere un veto no capturado por el método 1.
  (Corrección respecto de una versión anterior de esta nota, que decía "8 sesiones" nombrando solo
  6 y "dos casos" de `sin_datos` donde hay tres: ver `critica.md` de esta corrida, bloque de método.)
- Legislatura XLVIII (segundo mandato): **51 diarios de sesión**.
  URL: https://parlamento.gub.uy/documentosyleyes/documentos/diarios-de-sesion?Cpo_codigo=A&Lgl_Nro=48
  (CSV: https://parlamento.gub.uy/documentosyleyes/documentos/diarios-de-sesion/csv?Cpo_codigo=A&Lgl_Nro=48&_format=csv).
  **0 sesiones** mencionan "observ" o "veto" en el resumen. Coincide con el resultado del método 1
  (0 vetos).

Para dos de los once vetos se llegó a la fuente primaria más fuerte posible: el propio diario de
sesiones en PDF (`infolegislativa.parlamento.gub.uy/temporales/*.PDF`, enlazado desde
`parlamento.gub.uy/documentosyleyes/documentos/diarios-de-sesion/<id>/IMG`), con la votación nominal
completa. Es el caso de la Ley Marco de Defensa Nacional (el único de los once vetos que la Asamblea
General efectivamente levantó) y, parcialmente, el de Salud Sexual y Reproductiva (se confirmó la
frase de la proclama, no el detalle numérico de la votación).

### 3. Índice de repartidos de la Asamblea General

- Legislatura XLVI (primer mandato): **0 repartidos indexados**. El propio buscador responde "No se
  encontraron Repartidos con su criterio de búsqueda" para Asamblea General + legislatura 46.
  URL: https://parlamento.gub.uy/documentosyleyes/documentos/repartidos?Cpo_Codigo=A&Lgl_Nro=46 .
  Esto es una limitación real y verificada del propio buscador (no una omisión de esta corrida): la
  herramienta de repartidos no cubre la Asamblea General antes de 2012, así que para el primer
  mandato de Vázquez este método no aporta nada y no se pudo usar como confirmación adicional del
  método 1; solo quedan los métodos 1 y 2.
- Legislatura XLVIII (segundo mandato): **12 repartidos** indexados entre 2015 y 2019.
  URL: https://parlamento.gub.uy/documentosyleyes/documentos/repartidos?Cpo_Codigo=A&Lgl_Nro=48
  (CSV: https://parlamento.gub.uy/documentosyleyes/documentos/repartidos/csv?Cpo_Codigo=A&Lgl_Nro=48&_format=csv).
  Se revisaron los 12: cese o designación de ministros de la Suprema Corte de Justicia y del Tribunal
  de lo Contencioso Administrativo (6), designación de integrantes del Consejo de Comunicación
  Audiovisual (2), postulación a la Corte Penal Internacional (1), un pedido de derecho de petición
  sobre esa misma designación (1), y una placa conmemorativa a trabajadores (1). **Ninguno de los 12
  es una observación del Poder Ejecutivo a un proyecto de ley.** Coincide con el resultado de los
  métodos 1 y 2 (0 vetos en el segundo mandato).

  **Corrección respecto de una versión anterior de esta nota**: se había escrito que el índice de
  repartidos "no se pudo usar... ni en gran parte de 2015-2020". Eso es incorrecto para la
  Legislatura XLVIII: el índice de repartidos de Asamblea General sí existe completo para ese período
  (los 12 repartidos de arriba), y ya se usó como confirmación cruzada. La limitación real (repartidos
  no indexados antes de 2012) aplica solo a la Legislatura XLVI, es decir, al primer mandato.

### Conclusión de los tres métodos, cruzados

| Mandato | Leyes promulgadas revisadas | Diarios de sesión A.G. revisados | Repartidos A.G. revisados | Vetos encontrados |
|---|---|---|---|---|
| 2005-2010 (Leg. XLVI) | 791 (0 errores de descarga) | 66 | 0 (no indexados antes de 2012) | 11 |
| 2015-2020 (Leg. XLVIII) | 545 (0 errores de descarga) | 51 | 12 | 0 |

Los tres métodos coinciden en el segundo mandato (0 vetos) y no se contradicen en el primero (los
tres, entre sí, señalan los mismos once vetos y ninguno más). Esto reemplaza lo que en la versión
anterior de esta corrida era una sola afirmación ("un solo veto") apoyada únicamente en que la prensa
y una biografía no mencionaban otro: ahora la afirmación de completitud se apoya en el registro
parlamentario mismo, con las mismas dos herramientas (diarios de sesión y repartidos) que se le pidió
usar a los demás presidentes, más un tercer método (barrido completo de leyes promulgadas) que no
tenía ninguno de los otros investigadores de esta ronda.

## vetos_sin_desenlace

Ninguno se omitió por falta de desenlace: los once vetos tienen, como mínimo, la fecha de
promulgación de la ley que los siguió, registrada en una ficha `documento_oficial`. Dicho esto, para
**tres** de los once (Vehículos/seguro contra terceros, Ley 18.412; Discapacitados/ingreso a
organismos del Estado, Ley 18.094; Importaciones/tasa consular, Ley 18.301) no se encontró un
desenlace *explícito* (ni votación registrada, ni fórmula de aceptación tácita): se registraron
igual, con `resultado.estado: sin_datos` y el detalle exacto de qué sí y qué no dice la ficha, en vez
de inventar un desenlace o descartar el registro. El esquema admite `sin_datos` como estado válido
para este caso; se usó tal cual, no como sustituto de investigar. (Corrección: una versión anterior
de esta nota decía "dos" nombrando solo Vehículos y Discapacitados; el propio `vetos.yaml` siempre
tuvo los tres registros correctos. Ver `critica.md`.)

## verificacion_manual

- http://www.scielo.edu.uy/scielo.php?script=sci_arttext&pid=S1688-499X2017000100151 — `pnpm fuente`
  no pudo bajarla ("fetch failed"). No se citó.
- https://www.carasycaretas.com.uy/siete-frases-para-recordar-el-legado-politico-de-tabare-vazquez/
  — URL construida a mano a partir del snippet del corpus, devolvió HTTP 404. Se encontró la URL
  correcta (con el sufijo `-n68979`) en el archivo JSON del corpus y se volvió a intentar con éxito;
  esa segunda lectura es la que está citada en `vetos.yaml`.
- https://infolegislativa.parlamento.gub.uy/temporales/4034676.PDF — se intentó como el diario de
  sesiones completo de la sesión del 20-11-2008 (salud sexual y reproductiva), pero el PDF resultó ser
  un documento corto (8849 caracteres) que no contiene el texto de la sesión; no se pudo confirmar el
  recuento de votos de esa sesión con un PDF completo (sí se tiene la frase de la proclama, citada en
  `vetos.yaml`, tomada del índice CSV de diarios de sesión). Ver `hipotesis`.
- https://infolegislativa.parlamento.gub.uy/temporales/7578577.PDF — el PDF del diario de sesiones
  con la votación del levantamiento del veto a la Ley de Defensa Nacional (citado en `vetos.yaml`) es
  exactamente el caso que el brief advertía: la URL de `infolegislativa.parlamento.gub.uy/temporales/`
  es temporal y a la fecha de esta corrida ya devuelve HTTP 404. Se pidió su archivado (Wayback Machine
  lo guardó correctamente en el momento de la lectura) y `pnpm validar --red` usa esa copia archivada
  automáticamente; no hizo falta marcar la fuente como `verificacion: manual` porque el archivado sí
  funcionó. Se deja la constancia para que quien revise sepa por qué el chequeo de URL en vivo del
  original falla aunque la cita esté verificada contra el archivo.

## cobertura_del_periodo

- **Primer mandato, 2005-03-01 a 2010-03-01 (Legislatura XLVI)**: cubierto con los tres métodos
  descritos en `metodo`. Once vetos documentados en `vetos.yaml`, todos con fecha, alcance, y
  resultado (ocho con estado explícito —siete `observaciones_aceptadas` y uno `veto_levantado`—, tres
  con `sin_datos` por falta de desenlace explícito en la ficha). (Corrección: una versión anterior de
  esta nota decía "nueve" y "ocho `observaciones_aceptadas"; ver `critica.md`, bloque de método.)
- **Segundo mandato, 2015-03-01 a 2020-03-01 (Legislatura XLVIII)**: cubierto con los mismos tres
  métodos. Cero vetos encontrados por los tres, de forma independiente y coincidente.
- **Campaña 2004 (previa al primer mandato)** y **oposición 2010-2015** (entre mandatos): no aplica
  al objeto de esta corrida —el veto es una facultad exclusiva del presidente en ejercicio—, salvo
  para buscar declaraciones públicas sobre el tema (ver `declaraciones.yaml`, que quedó vacío; ver
  también `hipotesis`).
- **Posmandato (2020-03-01 en adelante, hasta su fallecimiento el 2020-12-06)**: no aplica por la
  misma razón. Se revisó el material publicado tras su muerte (obituarios de Infobae y El Observador,
  que repasan toda la gestión) sin que mencionen otro veto además del de 2008.

## hipotesis

- **Recuento de votos de la Asamblea General del 20-11-2008 (salud sexual y reproductiva)**: se tiene
  la frase oficial de la proclama ("no se ha levantado el veto y se mantienen las observaciones
  realizadas"), pero no el detalle numérico de la votación. El PDF que se intentó
  (`infolegislativa.parlamento.gub.uy/temporales/4034676.PDF`) no correspondía al diario completo de
  esa sesión. Falta: ubicar el diario de sesiones completo (Tomo 88, Diario 54) para completar el
  dato, igual que se hizo para el veto a la Ley de Defensa Nacional.
- **Fundamento no ubicado para siete de los once vetos** (Embarcaciones deportivas, Discapacitados,
  Fondo lechera, Importaciones/tasa consular, Habeas Data, Rendición de Cuentas 2007 —el fundamento
  de fondo, más allá de qué artículos se observaron—, Partidos Políticos, INAM): se documentó con
  certeza que el veto existió, su fecha, su alcance y (en la mayoría) su resultado, con fuente
  `documento_oficial`, pero no se ubicó el texto del mensaje de observaciones del Poder Ejecutivo
  (el argumento de fondo). Es una limitación de tiempo de esta corrida, no una ausencia de fuente: los
  mensajes probablemente están en los repartidos de cada comisión (distintos de los repartidos de
  Asamblea General ya revisados) o en `archivo.presidencia.gub.uy`, que no se llegó a rastrear uno por
  uno. Rango de esfuerzo dedicado: se profundizó por completo en dos de los once (Salud Sexual y
  Reproductiva, con el texto íntegro del mensaje; Defensa Nacional, con el argumento central citado
  del propio debate parlamentario) porque eran los dos casos con antecedente previo (pista del corpus)
  o desenlace inusual (el único veto levantado).
- **Resolución no documentada de dos vetos** (Vehículos/seguro contra terceros, Discapacitados): ver
  `vetos_sin_desenlace`. Se podría cerrar comparando el texto de la ley promulgada, artículo por
  artículo, contra el texto sancionado antes del veto (documentos ambos disponibles en IMPO/Parlamento
  para el primero) para saber si la observación quedó incorporada o no; no se hizo en esta corrida por
  tiempo.
- **Declaraciones públicas del propio Vázquez sobre estos diez vetos "nuevos"** (todos salvo el de
  salud sexual y reproductiva, que ya se había buscado): no se buscaron en esta corrida por volumen y
  tiempo. Es razonable esperar que la mayoría de estos vetos (de alcance más técnico y menor perfil
  público que el del aborto) no hayan tenido declaraciones propias más allá del texto de las
  observaciones, pero eso no está verificado; queda para una pasada posterior si el editor lo
  considera necesario.
- **Declaración propia de Vázquez sobre el veto de 2008 fuera del texto del veto**: se buscó una
  declaración en primera persona (entrevista, discurso) donde Vázquez explicara su decisión más allá
  del texto de las observaciones. El libro "Crónica de un mal amigo" (2011) contendría, según una nota
  de El Observador, un relato suyo vinculando su postura con el caso de una paciente oncológica, pero
  esa nota lo cuenta en tercera persona (paráfrasis del libro), sin una cita entrecomillada de Vázquez
  que se pueda copiar literalmente; no se tuvo acceso al libro en esta sesión. Por eso
  `declaraciones.yaml` queda vacío.
- **Renumeración de artículos entre la etapa de comisión (2007) y el texto vetado (2008), ley de salud
  sexual y reproductiva — CERRADA**: en el trámite en comisión del Senado (agosto-setiembre de 2007)
  el Capítulo II ("de la interrupción voluntaria del embarazo") empezaba en el artículo 9, pero el
  veto observó "los Capítulos II, III y IV, artículos 7 a 20" del texto finalmente sancionado. Se
  verificó contra el texto de la ley promulgada (IMPO, `impo.com.uy/bases/leyes/18426-2008`,
  documento oficial): la ley tal como quedó, después del veto, tiene un Capítulo I (artículos 1 a 6,
  "De los derechos sexuales y reproductivos") y un Capítulo II "DISPOSICIONES FINALES" con los
  artículos 7 y 8 ("Artículo 7... Artículo 8 (Derogaciones).- Deróganse todas las disposiciones que se
  opongan a lo dispuesto en la presente ley."). Es decir: lo que en el proyecto sancionado era el
  Capítulo V ("Disposiciones finales", con los artículos que en la instancia de comisión de 2007
  llegaban hasta el 21) quedó renumerado como Capítulo II, artículos 7-8, una vez que se quitaron los
  capítulos II, III y IV observados (14 artículos, del 7 al 20 en la numeración del texto sancionado).
  La diferencia entre la numeración de comisión (2007) y la numeración del texto sancionado y vetado
  (2008) se explica porque el texto se modificó y renumeró durante el trámite parlamentario entre esas
  dos fechas (se agregaron artículos aditivos, según consta en la propia ficha), y no es una
  contradicción: son tres numeraciones distintas de tres estadios distintos del mismo proyecto
  (comisión 2007, texto sancionado y vetado 2008, texto promulgado sin los capítulos observados
  2008), y las tres están documentadas con cita literal.

## casos_vistos

Ninguno. No se investigaron casos judiciales; el brief de esta corrida pide específicamente vetos.

## objeciones_al_brief

Ninguna. El brief pide cubrir el mandato completo, con lo que hubo y con lo que no hubo, y con el
mismo rigor metodológico para los dos mandatos; así se hizo, y el barrido mecánico completo (791 y
545 leyes, más los diarios de sesión y los repartidos de la Asamblea General) es precisamente la
forma de sostener eso con evidencia verificable en vez de con una impresión de "no encontré nada más".
No se identificó ningún pedido de seleccionar, omitir o encuadrar información según partido, ideología
o persona.

## medios_faltantes

Ninguno nuevo de esta lista del investigador. Todos los medios citados en `vetos.yaml` en esta etapa
(parlamento, infobae, caras-y-caretas, el-observador) ya figuran en `content/medios/` según la tabla
del brief. (La corrección pedida por el crítico en su primera pasada —sacar la fuente `180-com-uy`,
que no estaba dada de alta como medio, y reemplazarla por El Observador— ya estaba aplicada en
`vetos.yaml`.)

Nota del editor (segunda pasada): el crítico, en esta segunda crítica, pidió evaluar si correspondía
sumar una segunda nota de `180-com-uy` ("El veto quedó firme") como fuente de contexto para el voto
de la Asamblea General sobre salud sexual y reproductiva. Se decidió que sí: se dio de alta el medio
en `content/medios/180-com-uy.yaml` (propiedad y alineamiento con fuente propia, alineamiento
`sin_datos` por falta de datos, no por no buscarlos) y se agregó la cita sobre la composición del
voto a `vetos.yaml`, sin usar la oración de esa misma nota que tiene el error de fecha registrado en
`discrepancias.yaml` de esta corrida.

## referentes_faltantes

Ninguno nuevo.

## pistas_cruzadas (registradas en el corpus, no en esta corrida)

- Se agregó una pista a `/Users/santiago/Documents/GitHub/la-casta-corpus/pistas/batlle.yaml`: la Ley
  17.888 ("Escuela 41 Trinidad, Flores") tiene una línea de "Poder Ejecutivo veto total" fechada
  19-05-2004, dentro del mandato de Jorge Batlle (2000-2005), aunque la ley recién se promulgó el
  22-08-2005, ya con Vázquez en la presidencia. Es candidato a veto de Batlle, no de Vázquez; no se
  investigó el fundamento ni el desenlace en la Asamblea General. Corresponde a la corrida
  `2026-09-05-batlle-vetos`, que está en curso en paralelo.
