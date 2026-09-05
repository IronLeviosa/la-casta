## procedimiento_constitucional

Verificado directamente en IMPO (https://www.impo.com.uy/bases/constitucion/1967-1967/137
a /141), Constitución de la República Oriental del Uruguay, Sección VII ("De la
proposición, discusión, sanción y promulgación de las leyes"), Capítulo II:

- **Artículo 137** (plazo del Ejecutivo para observar): «Si recibido un proyecto de
  ley, el Poder Ejecutivo tuviera objeciones que oponer u observaciones que hacer,
  lo devolverá con ellas a la Asamblea General, dentro del plazo perentorio de diez
  días.»

- **Artículo 138** (mayoría para levantar el veto): «Cuando un proyecto de ley
  fuese devuelto por el Poder Ejecutivo con objeciones u observaciones, totales o
  parciales, se convocará a la Asamblea General y se estará a lo que decidan los
  tres quintos de los miembros presentes de cada una de las Cámaras, quienes podrán
  ajustarse a las observaciones o rechazarlas, manteniendo el proyecto sancionado.»
  Nota de la propia IMPO: la redacción de este artículo es la de la reforma
  constitucional de 1996.

- **Artículo 139** (silencio de la Asamblea): «Transcurridos treinta días de la
  primera convocatoria sin mediar rechazo expreso de las observaciones del Poder
  Ejecutivo, las mismas se considerarán aceptadas.»

- **Artículo 140** (si la Asamblea desaprueba el proyecto devuelto): «Si las
  Cámaras reunidas desaprobaran el proyecto devuelto por el Poder Ejecutivo,
  quedará sin efecto por entonces, y no podrá ser presentado de nuevo hasta la
  siguiente Legislatura.»

- **Artículo 141** (transparencia de la votación): «En todo caso de reconsideración
  de un proyecto devuelto por el Ejecutivo, las votaciones serán nominales por sí o
  por no, y tanto los nombres y fundamentos de los sufragantes, como las
  objeciones u observaciones del Poder Ejecutivo, se publicarán inmediatamente por
  la prensa.»

No fue necesario usar estos artículos para calificar un `resultado.estado` en
`vetos.yaml` porque no se encontró ningún veto en el mandato (ver más abajo), pero
quedan verificados para que el editor los tenga disponibles si en otra corrida
sobre Mujica (u otro presidente) aparece un caso.

## vetos_sin_desenlace

Ninguno, porque no se encontró ningún veto que registrar: `vetos.yaml` queda con
lista vacía. No hay, por lo tanto, ningún veto descartado por falta de desenlace;
la ausencia de registros en este archivo es la ausencia de vetos, no una falta de
investigación (ver `cobertura_del_periodo`).

## verificacion_manual

- https://www.researchgate.net/publication/398840271_PUNTOS_DE_VETO_DURANTE_EL_GOBIERNO_DE_LACALLE_POU_JUDICIALIZACION_Y_DEMOCRACIA_DIRECTA_EN_URUGUAY_2020-2025
  — `pnpm fuente` no pudo bajarla (HTTP 403 Forbidden de ResearchGate). No se citó
  en ningún registro; se intentó solo porque un paper sobre "puntos de veto" en el
  gobierno de Lacalle Pou podría tener, en su marco teórico o antecedentes, una
  cifra comparativa de vetos por presidente uruguayo desde 1985, que hubiera sido
  útil para corroborar la ausencia de vetos de Mujica. Sigue sin poder leerse (ya
  había fallado igual en la corrida `2026-09-04-lacalle-pou-vetos`).

- La cita de la declaración de 2009 (El País, vía Wayback Machine,
  https://web.archive.org/web/20100120094504/http://www.elpais.com.uy:80/091116/pnacio-454575/nacional/jose-mujica-promueve-plebiscito-por-aborto)
  se descargó correctamente, pero el texto tiene un problema de codificación de
  caracteres: las vocales acentuadas de la nota original (de 2009, en un sitio
  probablemente en Windows-1252/Latin-1) aparecen como el carácter de reemplazo
  `�` en el texto que devolvió `pnpm fuente` (ej. "m�s" en vez de "más", "decisi�n"
  en vez de "decisión"). No es un error de transcripción mío ni una particularidad
  del habla de Mujica: es un artefacto de la extracción de esa página archivada
  concreta. Confirmé que el JSON guardado en el corpus tiene el mismo problema
  carácter por carácter (no es solo una rareza de la terminal), así que la `cita`
  en `declaraciones.yaml` y `promesas.yaal` reproduce el texto literal tal cual lo
  devolvió la herramienta, con los caracteres `�` incluidos, en vez de que yo
  reconstruya a mano qué vocal acentuada correspondía en cada caso. El editor
  debería considerar volver a extraer esa nota con una detección de codificación
  distinta antes de publicar, o al menos no tratar los `�` como parte real de la
  cita.

- https://archivo.presidencia.gub.uy/ y sus subrutas de listado de directorio
  (ej. `archivo.presidencia.gub.uy/proyectos/`, `archivo.presidencia.gub.uy/sci/proyectos/2011/`)
  devuelven HTTP 403 con `pnpm fuente` (navegación de directorio deshabilitada);
  documentos individuales dentro de esas rutas sí se pudieron leer uno por uno.

- https://imporeader.uy/ (la herramienta de búsqueda de texto completo del Diario
  Oficial de IMPO) no respondió: `pnpm fuente` devolvió "fetch failed" y un
  `curl` directo con `--max-time 15` tampoco completó la conexión. No se pudo usar
  como buscador de mensajes de observaciones.

- https://www.impo.com.uy/bases (el acceso a las "bases" estructuradas de IMPO,
  que podrían incluir un buscador de texto completo del Diario Oficial) requiere
  usuario y contraseña ("Iniciar Sesión"); no se pudo acceder sin credenciales.

## cobertura_del_periodo

**Mandato de José Mujica como presidente: 2010-03-01 a 2015-03-01 (único mandato).**
Es el único período que aplica al objeto de esta corrida: el veto es una facultad
exclusiva del Poder Ejecutivo en ejercicio, así que ni la campaña 2009 ni la
oposición ni el posmandato (Mujica siguió como senador y luego se retiró de la
política activa; falleció el 2025-05-13) pueden generar un veto propio. Sí se buscó
en esos períodos si Mujica **habló** sobre vetos (ver `declaraciones.yaml`), y ahí
sí hay hallazgos: una promesa de campaña de no vetar la ley de aborto (2009) y una
declaración en el primer año de gobierno sobre su rechazo de principios al veto
(2011).

**Conclusión de esta corrida: no se encontró ningún veto de José Mujica durante su
mandato.** Esta corrida se corrigió dos veces a mitad de camino:

1. El coordinador señaló que los Diarios de Sesión de la Asamblea General están
   digitalizados para la Legislatura 47 (la de Mujica) desde 1985, cubren el
   mandato completo sin el hueco de 2010-2011 que tenían los repartidos, y que
   evaluar a un presidente con un método más superficial que a otro (Batlle, con
   78 diarios leídos uno por uno) sería una asimetría de profundidad de búsqueda,
   no de conducta. Rehice el barrido con ese método como columna principal.
2. El crítico encontró un punto ciego real en ese método: el artículo 139 de la
   Constitución permite que un veto quede firme por silencio (sin que la Asamblea
   vote nada) si no se rechaza expresamente dentro de los 30 días de la primera
   convocatoria; si además nunca se llegó a convocar sesión para tratarlo, puede no
   dejar rastro en el sumario de ningún diario de sesión. Correspondía entonces
   buscar el mensaje de observaciones directamente del lado del Poder Ejecutivo
   (Presidencia, IMPO), que es donde el veto nace, no solo del lado del Parlamento,
   que es donde se trata (o no se trata). Esto se hizo en esta versión; el
   resultado se detalla más abajo.

La conclusión (cero vetos) no cambió, pero ahora está apoyada en cuatro barridos
independientes en vez de uno solo, y con la reconciliación de conteo que pidió el
crítico.

### Método 1 (principal): índice de Diarios de Sesión de la Asamblea General

Índice: `https://parlamento.gub.uy/documentosyleyes/documentos/diarios-de-sesion?Cpo_codigo=A&Lgl_Nro=47`
(dos páginas, `page=0` y `page=1`, ambas leídas con `pnpm fuente`; la página del
sitio dice: «Los Diarios de Sesiones se encuentran disponibles a partir de las
siguientes fechas: [...] Asamblea General a partir del 15/02/1985»).

**Reconciliación del conteo, tal como pidió el crítico**: el índice trae 67 filas
para toda la Legislatura 47. De esas 67, descarté dos:

- La sesión Nº 1 del 15-02-2010 es la apertura de la legislatura, dos semanas
  antes de que Mujica asumiera (15-02-2010 a 01-03-2010 todavía gobernaba
  Vázquez). No es parte del mandato de Mujica.
- La fila que figura como «A.G. 3, 12-04-2014, doc 3» **es un error de indexación
  del propio sitio del Parlamento**, no una sesión real de esa fecha. Lo
  verifiqué abriendo el documento con `pnpm fuente`
  (`http://parlamento.gub.uy/documentosyleyes/documentos/diarios-de-sesion/5601/IMG`,
  que redirige a `https://infolegislativa.parlamento.gub.uy/temporales/20160412a0003.pdf`):
  el PDF real es el «Nº 3 - TOMO 96 [...] SEGUNDO PERÍODO ORDINARIO DE LA XLVIII
  LEGISLATURA», es decir, una sesión del **12 de abril de 2016** (Legislatura 48,
  segundo mandato de Vázquez), catalogada por error bajo la Legislatura 47 con la
  fecha day/month coincidente (12/04) pero el año equivocado. No es una sesión del
  mandato de Mujica y no debe contarse.

Con esas dos filas descontadas, quedan **65 sesiones de Asamblea General dentro
del mandato de Mujica** (no 66, como decía la versión anterior de esta corrida).
Es el mismo número que contó el crítico. Corrijo el conteo en este documento y en
el informe final.

Cada fila del índice trae el sumario completo de la sesión (la lista numerada de
asuntos tratados), no solo el título del expediente. Busqué "observ" y "veto"
sobre el texto completo de las dos páginas del índice (`--buscar "observ | veto"`,
que escanea todo el texto descargado, no solo lo que se muestra en pantalla) y
confirmé que no queda ninguna sesión sin cubrir buscando explícitamente fechas del
tramo medio (19-12-2012, 01-12-2011, 15-12-2013), que aparecen en `page=0`.
**Resultado: cero coincidencias de "observ" y cero de "veto" en el sumario de las
65 sesiones de Asamblea General del mandato completo de Mujica.**

**Control positivo del método**: apliqué el mismo método al índice de Diarios de
Sesión de Asamblea General de la Legislatura 45 (2000-2005, Batlle), sin descargar
ni interpretar su contenido más allá de esta prueba técnica — no es mi corrida y no
me corresponde sacar conclusiones sobre ese mandato. Ese índice (77 diarios) tiene
**12 coincidencias** de "observ"/"veto" en el sumario (ej.: «Observaciones
interpuestas por el Poder Ejecutivo», «la Asamblea General resuelve levantar las
observaciones»), lo que confirma que el método detecta vetos reales cuando existen.

### Método 2 (secundario): índice de repartidos de la Asamblea General

`https://parlamento.gub.uy/documentosyleyes/documentos/repartidos?Cpo_Codigo=A&Lgl_Nro=47`.
Cubre solo el tramo digitalizado (2012-01 a 2014-07). **Revisé 15 repartidos** en
ese tramo (números 8 a 23, con dos anexos en 9 y 11), ninguno sobre
observaciones/veto. Corrobora al método 1 en el tramo que ambos comparten.

### Método 3 (fichas de trámite de leyes específicas)

Revisé la sección "Sanciones" de las fichas de 9 leyes especialmente propensas a
fricción política de todo el mandato (Presupuesto 2010-2014, tres Rendiciones de
Cuentas, la ley interpretativa de la Ley de Caducidad, aborto, matrimonio
igualitario, cannabis, Ley de Medios), y las nueve muestran "Poder Ejecutivo
promulga.", sin "veto total" ni "veto parcial".

### Método 4 (nuevo, del lado del Poder Ejecutivo): Presidencia e IMPO

Esto es lo que pidió el coordinador para cerrar el punto ciego del artículo 139:
buscar el mensaje de observaciones donde nace (Presidencia), no donde se trata (o
no se trata) el Parlamento.

**Presidencia.** El patrón reciente (`medios.presidencia.gub.uy/legal/<año>/proyectos/<mes>/<ministerio>_<numero>.pdf`)
**no cubre el mandato de Mujica**: verifiqué con el índice de Wayback Machine
(`web.archive.org/cdx/search/cdx?url=medios.presidencia.gub.uy/legal/`) que ese
dominio solo tiene contenido archivado desde agosto de 2015 en adelante, cinco
meses después de que Mujica dejara el cargo. Para 2010-2015 el dominio
correspondiente es `archivo.presidencia.gub.uy`, con una carpeta equivalente:
`archivo.presidencia.gub.uy/sci/proyectos/<año>/<mes>/<ministerio>_<numero>.pdf`
(confirmé el patrón abriendo varios documentos con `pnpm fuente`, ej.
`archivo.presidencia.gub.uy/sci/proyectos/2011/08/min_390.pdf`). Usé el índice de
Wayback Machine para catalogar esa carpeta completa: **1.976 documentos**
archivados en `sci/proyectos/` entre el 01-03-2010 y el 28-02-2015 (406 en 2010,
391 en 2011, 448 en 2012, 414 en 2013, 286 en 2014, 31 en enero-febrero de 2015).

Este es el límite real de esta vía: esa carpeta mezcla **todo tipo de
comunicación** del Poder Ejecutivo al Parlamento — proyectos de ley nuevos,
decretos remitidos para aprobación, informes, y (si los hubiera) mensajes de
observaciones — bajo el mismo esquema de nombre de archivo
(ministerio_número.pdf), sin ninguna forma de distinguir el tipo de documento por
el nombre, la carpeta o una búsqueda de texto (el navegador de directorio del
sitio da HTTP 403, `archivo.presidencia.gub.uy/sci/pages/archivo.htm` solo indexa
noticias por mes no por tipo de documento, e `imporeader.uy` —la herramienta de
búsqueda de texto completo del Diario Oficial que sugirió el coordinador—
no respondió en ningún intento, ni con `pnpm fuente` ni con `curl` directo).
Comprobé que ni los nombres de archivo ni las URLs de esa carpeta contienen nunca
las palabras "observ" o "veto" (0 coincidencias en los 1.976 nombres), lo cual
era esperable — esos archivos se nombran por ministerio y número de expediente,
no por contenido — y por lo tanto **no abrí los 1.976 documentos uno por uno**:
sería desproporcionado para esta corrida y no lo hice.

**IMPO / Diario Oficial.** Antes de buscar a ciegas por fecha en el mandato de
Mujica, hice **dos controles negativos** con vetos ya confirmados de Lacalle Pou,
para saber si el método (adivinar la fecha y bajar
`impo.com.uy/diariooficial/<año>/<mes>/<día>/documentos.pdf` o `/avisos.pdf`)
efectivamente encuentra un mensaje de observaciones real:

- Veto a la ley forestal (mensaje del 16-12-2021): revisé `documentos.pdf` del
  16, 17, 20 y 21 de diciembre de 2021. **No apareció.**
- Veto parcial a la ley de extrabajadores de Casa de Galicia (mensaje del
  17-11-2023): revisé `documentos.pdf` del 17, 20, 21, 22, 23 y 24 de noviembre
  de 2023, y `avisos.pdf` del 17 de noviembre. **No apareció** (el `avisos.pdf`
  sí existe pero es un tarifario de IMPO sin relación; `publicaciones.pdf` para
  esa fecha ni siquiera existe, PDF de 0 bytes).

**Los dos controles fallaron**: ni un veto de 2021 ni uno de 2023, ambos
confirmados y documentados en la corrida de Lacalle Pou, aparecieron en la
sección "Documentos" (ni en "Avisos") del Diario Oficial digital en los días
posteriores al mensaje. Esto es un hallazgo sobre el método, no sobre Mujica: **la
combinación URL `impo.com.uy/diariooficial/<fecha>/documentos.pdf` no es una vía
confiable para encontrar mensajes de observaciones por adivinanza de fecha**, ni
siquiera para vetos que sabemos que existieron. No hice más intentos de fecha para
el período de Mujica porque el control ya mostró que un resultado negativo por esa
vía no sería informativo (no se puede distinguir "no hubo veto" de "el método no
lo encuentra"). Dejo esto anotado también en `hipotesis` para que sirva a otras
corridas, tal como pidió el coordinador — aunque en este caso el hallazgo es que
la vía IMPO **no funciona como se esperaba**, no que haya un veto oculto.

**Búsquedas web complementarias** (`site:archivo.presidencia.gub.uy`, `site:gub.uy/presidencia`,
combinando "observa", "veto", "artículo 137", "Mujica" y los nombres de las leyes
más controvertidas del período) no devolvieron ningún mensaje de observaciones de
la era Mujica.

### Conclusión y qué queda sin cerrar

Con cuatro barridos (dos del lado del Parlamento que cubren el mandato completo —
diarios de sesión y fichas de trámite—, uno parcial de repartidos, y uno del lado
del Poder Ejecutivo que no pudo completarse por falta de un índice utilizable):
**no encontré ningún veto de Mujica.** El método del lado del Poder Ejecutivo no
llegó a ser una confirmación independiente limpia como pedía el coordinador — no
por lo que encontré, sino porque no hay forma de revisar exhaustivamente (sin
costo desproporcionado) los ~1.976 documentos de Presidencia ni de buscar por
fecha en IMPO con algún grado de confianza, dado que el control con vetos
conocidos falló dos veces. El punto ciego del artículo 139 que señaló el crítico
queda entonces **parcialmente cerrado**: cerrado del lado parlamentario (un veto
por silencio de todas formas necesita, para tener efecto, que el proyecto haya
sido "devuelto a la Asamblea General" en algún momento — algo que, de haber
pasado, en general generaría cobertura de prensa contemporánea por el artículo
141, que exige publicación inmediata por la prensa, y esa cobertura de prensa la
busqué extensamente en la versión anterior de esta corrida sin encontrar nada);
pero no cerrado con un documento primario del lado del Ejecutivo que lo descarte
de forma mecánica y exhaustiva. Lo dejo explícito en `hipotesis`.

**Conteo final para el informe** (reconciliado): 65 sesiones de Asamblea General
revisadas (diarios de sesión, mandato completo, método principal, índice en
`https://parlamento.gub.uy/documentosyleyes/documentos/diarios-de-sesion?Cpo_codigo=A&Lgl_Nro=47`);
15 repartidos de Asamblea General revisados (tramo 2012-01/2014-07, método
secundario); 9 fichas de trámite de leyes específicas revisadas; 1.976 documentos
de Presidencia catalogados pero no abiertos individualmente (método inconcluso);
0 vetos encontrados por ningún método.

## hipotesis

- **Por qué no hay vetos**: la explicación más plausible, según el análisis de
  Bottinelli citado arriba, es que Mujica gobernó con mayoría parlamentaria propia
  del Frente Amplio en ambas cámaras durante todo el mandato, y el veto
  constitucional uruguayo está diseñado para darle poder a un Ejecutivo sin
  mayoría propia frente al Parlamento — "lo que se considera contra natura es que
  un presidente vete una ley aprobada con los votos de su propio partido". No se
  puede convertir esto en un registro porque es una inferencia sobre un patrón
  institucional, no un hecho verificado puntual; queda para que el editor lo use
  como contexto si le sirve.

- **La declaración de 2009 sobre no vetar la ley de aborto y la de 2011 sobre ser
  "enemigo del veto por una cuestión de principios" son consistentes entre sí y
  con la ausencia de vetos observada**: no hay ningún candidato a giro (cambio de
  posición) sobre el uso del veto por parte de Mujica en todo lo que se investigó
  en esta corrida. Esto también es información, aunque no genere un registro de
  giro.

- **Profundidad de lectura de los diarios de sesión**: revisé el sumario de las
  65 sesiones de Asamblea General del mandato (conteo reconciliado, ver
  `cobertura_del_periodo`) buscando "observ"/"veto" sobre el
  texto que trae el propio índice (carátula + tabla de contenidos de cada
  diario), no abrí cada uno de los 65 PDF completos. El sumario de un diario de
  sesión suele listar todos los asuntos tratados (así apareció, en el control
  positivo sobre la Legislatura 45, la frase "Observaciones interpuestas por el
  Poder Ejecutivo" en 12 sesiones distintas), así que un veto tratado en sesión
  debería aparecer ahí. No puedo descartar con certeza absoluta que una sesión
  haya tratado observaciones del Poder Ejecutivo sin que quedara reflejado en el
  sumario del índice; abrir los 65 PDF uno por uno (como se hizo con los 78 de
  Batlle) sería la forma de cerrar esa última duda con el mismo estándar. Lo dejo
  para que el editor decida si ese paso adicional es necesario antes de publicar.

- **Hallazgo metodológico para otras corridas: la vía IMPO (`impo.com.uy/diariooficial/<fecha>/documentos.pdf` o `/avisos.pdf`, adivinando la fecha a partir del mensaje de observaciones) no es confiable para encontrar mensajes de observaciones**, ni siquiera para vetos ya confirmados. Lo probé con dos controles: el veto a la ley forestal de Lacalle Pou (2021-12-16) y el veto a la ley de Casa de Galicia (2023-11-17), ambos documentados con fuente primaria en la corrida `2026-09-04-lacalle-pou-vetos`, y en ninguno de los dos casos apareció el mensaje en `documentos.pdf` ni en `avisos.pdf` de los días siguientes. No sé si el mensaje de observaciones se publica en el Diario Oficial bajo otro nombre de archivo, en otra sección, con demora, o si en la práctica no se publica ahí (el artículo 141 de la Constitución exige que se publique "inmediatamente por la prensa", no específicamente en el Diario Oficial). Cualquier corrida futura de vetos que use esta vía debería probarla primero con un control positivo como este antes de tratar un resultado negativo como concluyente.

- **El punto ciego del artículo 139 (veto por silencio) queda parcialmente cerrado, no del todo**: los métodos 1 y 3 (diarios de sesión y fichas de trámite) cubren el lado parlamentario del mandato completo; el intento de método 4 (Presidencia/IMPO) no pudo completarse de forma exhaustiva por falta de un índice utilizable de los ~1.976 documentos de Presidencia del período. Si se quisiera cerrar esto con certeza mecánica (no solo con la ausencia de cobertura de prensa, que sí se buscó extensamente), habría que abrir esos ~1.976 documentos uno por uno o encontrar una forma de indexarlos por tipo, que no encontré en esta corrida. Lo dejo para que el editor decida si ese costo adicional se justifica.

- La declaración de 2011 (`cooperativa.cl`) solo tiene una fuente (`_faltante:
  segunda_fuente`). Busqué activamente una segunda fuente uruguaya con la misma
  cita literal (El Observador, la diaria, Infobae, Búsqueda — ver
  `consultas.jsonl`) y no la encontré con las palabras exactas; sí hay abundante
  cobertura del episodio político más amplio (la interna del Frente Amplio sobre
  la Ley de Caducidad), pero no de esta cita puntual sobre el veto. No se puede
  confirmar con una segunda fuente con la evidencia reunida en esta corrida.

## casos_vistos

Ninguno nuevo generado por esta corrida. El brief no pide investigar casos
judiciales y no apareció ninguno de forma incidental durante esta investigación
específica sobre vetos.

(Nota aparte, sin relación con esta corrida: el brief trae una pista del corpus
sobre el caso Astesiano y otra sobre ANCAP/Sendic que mencionan a Mujica; no las
investigué porque el objeto exclusivo de esta corrida son los vetos, y el brief
del `investigador` no autoriza investigar casos judiciales salvo pedido explícito.
Quedan disponibles en `corpus/pistas/mujica.yaml` para quien corra una corrida
sobre transparencia-corrupcion de Mujica.)

## objeciones_al_brief

Ninguna. El brief pide cubrir el mandato completo, decir explícitamente si un
mandato no tuvo vetos, y sostener esa afirmación con el barrido y las URLs
revisadas — no pide encuadrar la ausencia (o presencia) de vetos a favor o en
contra de ningún partido o persona, y así se hizo. No se detectó ninguna
instrucción del brief que pidiera seleccionar, omitir o encuadrar información
según partido, ideología o persona.

## medios_faltantes

- `cooperativa-cl` (Cooperativa.cl, Chile — radioemisora y portal de noticias
  chileno; grupo y alineamiento no verificados en esta corrida) — citado en una
  declaración de 2011 por ser, hasta donde busqué, la única fuente con la cita
  literal de Mujica sobre el veto a la ley de caducidad.

Todos los demás medios citados (`el-pais`, `parlamento`, `impo`) ya figuran en
`content/medios/` según la tabla del brief (confirmado además con `ls
content/medios/`, que ya incluye `icndiario.yaml`, agregado después de la fecha
del brief).
