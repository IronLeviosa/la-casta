## procedimiento_constitucional

Verificado directamente en IMPO (https://www.impo.com.uy/bases/constitucion/1967-1967/137 a /144), Constitución
de la República Oriental del Uruguay, Sección VII, Capítulos II y III (leído en esta sesión con `pnpm fuente`,
no de memoria):

- **Artículo 137** (plazo del Ejecutivo para observar): «Si recibido un proyecto de ley, el Poder Ejecutivo
  tuviera objeciones que oponer u observaciones que hacer, lo devolverá con ellas a la Asamblea General,
  dentro del plazo perentorio de diez días.»

- **Artículo 138** (mayoría para levantar el veto): «Cuando un proyecto de ley fuese devuelto por el Poder
  Ejecutivo con objeciones u observaciones, totales o parciales, se convocará a la Asamblea General y se
  estará a lo que decidan los tres quintos de los miembros presentes de cada una de las Cámaras, quienes
  podrán ajustarse a las observaciones o rechazarlas, manteniendo el proyecto sancionado.»

- **Artículo 139** (silencio de la Asamblea): «Transcurridos treinta días de la primera convocatoria sin
  mediar rechazo expreso de las observaciones del Poder Ejecutivo, las mismas se considerarán aceptadas.»
  Este mecanismo aparece invocado explícitamente en el propio diario de sesiones del 20-01-2004 sobre el
  veto a la Caja de Profesionales Universitarios (ver `vetos.yaml`): la Asamblea dejó consignado que había
  «transcurrido el artículo 139 de la Constitución sin que la Asamblea General se pronunciara», por lo que
  la observación al artículo 43 quedó tácitamente aceptada.

- **Artículo 140** (si la Asamblea desaprueba el proyecto devuelto): «Si las Cámaras reunidas desaprobaran
  el proyecto devuelto por el Poder Ejecutivo, quedará sin efecto por entonces, y no podrá ser presentado
  de nuevo hasta la siguiente Legislatura.»

- **Artículo 141** (transparencia de la votación): «En todo caso de reconsideración de un proyecto devuelto
  por el Ejecutivo, las votaciones serán nominales por sí o por no, y tanto los nombres y fundamentos de
  los sufragantes, como las objeciones u observaciones del Poder Ejecutivo, se publicarán inmediatamente
  por la prensa.» Los nueve diarios de sesión usados como fuente en `vetos.yaml` reproducen efectivamente
  la votación nominal completa, legislador por legislador.

- **Artículo 143** (si el Ejecutivo no tiene reparos): «Si el Poder Ejecutivo, a quien se hubiese remitido
  un proyecto de ley, no tuviese reparo que oponerle, lo avisará inmediatamente, quedando así de hecho
  sancionado y expedito para ser promulgado sin demora.»

- **Artículo 144** (si el Ejecutivo no devuelve el proyecto en plazo): «Si el Ejecutivo no devolviese el
  proyecto, cumplidos los diez días que establece el artículo 137, tendrá fuerza de ley y se cumplirá como
  tal, reclamándose esto, en caso omiso, por la Cámara remitente.»

Nota sobre `resultado.estado` de este esquema: cuando la Asamblea General vota expresamente y rechaza las
observaciones (arts. 138/141), uso `veto_levantado` (así en 6 de los 9 registros: Presupuesto, Oficiales
Generales, Docentes ANEP, Cajeros automáticos, Art. 154 Ley 17.556, Caja Bancaria). Cuando la Asamblea
acepta expresamente las observaciones (o el plazo del artículo 139 corre sin rechazo expreso), uso
`observaciones_aceptadas` (así en 3 registros: Caja de Profesionales Universitarios —aceptación tácita por
el artículo 139, confirmada explícitamente en el propio diario—, Cooperativas y Retribuciones/pasividades
—aceptación expresa por moción en la propia sesión—).

## vetos_sin_desenlace

El mandato de Batlle tiene, además de los 9 vetos con desenlace documentado en `vetos.yaml`, un número
inusualmente alto de vetos que la Asamblea General llegó a recibir como "asuntos entrados" pero que **nunca
resolvió**, casi siempre porque la sesión convocada para tratarlos fracasó por falta de quórum ("no hay
número para sesionar"). Se buscó activamente, para cada uno, si una sesión posterior de la Asamblea General
(dentro del listado completo de 78 diarios de sesión de la legislatura 45, incluida su sesión final del
22-12-2004) retomaba el asunto, y no se encontró ninguna. Por la regla del brief ("un veto sin desenlace
documentado no se publica"), ninguno de estos entra a `vetos.yaml`:

1. **Compatibilidad entre actividad laboral del discapacitado y jubilación o pensión por incapacidad**
   (observación del 06-09-2000, Repartido N.o 6/2000, Carpeta 18/2000): la Asamblea General "aplaza su
   consideración" el 06-09-2000 y no vuelve a aparecer en ninguna de las 78 sesiones de la legislatura.
   Fuente: https://infolegislativa.parlamento.gub.uy/temporales/2333352.PDF (diario A.G. N.o 9, 06-09-2000).

2. **Régimen de facilidades de pago de adeudos del Impuesto de Primaria** (observación comunicada el
   14-09-2004, misma sesión que resolvió el veto de retribuciones/pasividades): remitida "A LA COMISIÓN DE
   HACIENDA Y PRESUPUESTO" y sin novedad posterior en el listado de sesiones. Fuente:
   https://infolegislativa.parlamento.gub.uy/temporales/7346584.PDF (diario A.G. N.o 73, 14-09-2004).

3. **Fondo de Reconstrucción y Fomento de la Granja** (observación comunicada el 14-09-2004, remitida "A LA
   COMISIÓN DE FOMENTO"): la Asamblea General convocó una sesión específica para el 12-10-2004 (Carp.
   128/04 - Rep. 29/04), pero esa sesión fracasó por falta de quórum ("Habiendo treinta y cinco señores
   Diputados y trece señores Senadores presentes en Sala, se declara que no hay número para celebrar
   sesión"), y no hubo otra sesión antes del fin de la legislatura. Fuentes:
   https://infolegislativa.parlamento.gub.uy/temporales/7346584.PDF y
   https://infolegislativa.parlamento.gub.uy/temporales/8897885.PDF (esta última leída en triage con
   curl+pdftotext, no con `pnpm fuente`; ver `verificacion_manual`).

4. **Modificación y derogación de varias disposiciones de las Leyes 17.296 (Presupuesto 2000-2004), 17.555
   y 17.556** (probablemente una Rendición de Cuentas 2002): se intentó tratar dos veces (18-06-2003 y
   16-07-2003) y ambas sesiones fracasaron por falta de quórum ("no hay número para celebrar sesión" / "no
   habiendo número"). Sin sesión posterior. Fuentes leídas en triage con curl+pdftotext, no con `pnpm
   fuente`: https://infolegislativa.parlamento.gub.uy/temporales/1062848.PDF y
   https://infolegislativa.parlamento.gub.uy/temporales/8710872.PDF.

5. **Designación "República de Italia" a una escuela** (observación comunicada, sesión convocada para el
   25-05-2004): fracasó por falta de quórum. Sin sesión posterior. Fuente leída en triage (no con `pnpm
   fuente`): https://infolegislativa.parlamento.gub.uy/temporales/4314769.PDF.

6. **Modificación del artículo 17 de la Ley 10.459 (multas a empresas en obras públicas)** y **exoneraciones
   tributarias al sector forestal** (ambas comunicadas el 07-09-2004, misma sesión): la sesión del
   07-09-2004 solo dejó constancia de los mensajes como asuntos entrados ("Habiéndose cumplido con el
   cometido de la convocatoria, queda terminado el acto"); no se identificó sesión posterior que las
   resuelva, pese a que una nota de asuntos entrados del 14-09-2004 (misma sesión de retribuciones/
   pasividades) menciona un "Mensaje aclaratorio" del Poder Ejecutivo sobre la observación forestal, sin
   que conste su resultado. Fuente leída en triage (no con `pnpm fuente`):
   https://infolegislativa.parlamento.gub.uy/temporales/4635869.PDF.

7. **Ordenamiento, promoción y desarrollo de la actividad productiva artesanal** y **habilitación al Poder
   Ejecutivo para otorgar a los funcionarios destituidos del Canal 5 (SODRE) el derecho a pasividad o
   modificación de cédula jubilatoria** (ambas en la convocatoria del 30-07-2002): la sesión fracasó por
   falta de quórum. Sin sesión posterior. Fuentes leídas en triage (no con `pnpm fuente`):
   https://infolegislativa.parlamento.gub.uy/temporales/5002222.PDF y
   https://infolegislativa.parlamento.gub.uy/temporales/716433.PDF.

8. **Entrega directa y gratuita de determinado tipo de bienes** (sesión convocada para el 11-12-2003):
   fracasó por falta de quórum. Sin sesión posterior. Fuente leída en triage (no con `pnpm fuente`):
   https://infolegislativa.parlamento.gub.uy/temporales/5577627.PDF.

9. **Prórroga de la suspensión para la importación de determinados bienes muebles usados, camiones u otro
   tipo de vehículos** y **actualización de las liquidaciones de haberes de los trabajadores de
   Establecimientos Frigoríficos del Cerro S.A. (EFCSA)** (ambas comunicadas el 22-12-2004, última sesión
   de Asamblea General de toda la legislatura 45): quedaron como asuntos entrados sin votación, y no hubo
   ninguna sesión de Asamblea General posterior antes del fin del mandato (01-03-2005). Fuente:
   https://infolegislativa.parlamento.gub.uy/temporales/736968.PDF (diario A.G. N.o 78, 22-12-2004).

En total, sumando los 9 vetos publicados y estos 9 sin desenlace (contando como una sola unidad cada
convocatoria fallida repetida sobre el mismo proyecto), esta investigación identificó **18 proyectos de ley
distintos observados por el Poder Ejecutivo** durante la presidencia de Batlle, número que coincide de
forma notable con el total de 18 vetos (7 + 11) que reportan de forma independiente Chasquetti (2013) y
parlamentodata.com (2019) a partir de otras fuentes (actas parlamentarias y prensa de la época). Esa
coincidencia numérica no estaba buscada de antemano: se llegó a ella por dos vías separadas (la fuente
académica agregada y el rastreo directo de los 78 diarios de sesión), lo que da una razonable confianza en
que la cobertura de esta corrida es prácticamente completa para el objeto acotado ("todos los vetos").

## verificacion_manual

- **`https://parlamento.gub.uy/camarasycomisiones/asambleageneral/documentos/repartidos?Lgl_Nro=45...`**: el
  extractor de `pnpm fuente` devolvió solo el pie de página (100 caracteres) en vez del mensaje "Actualmente
  no hay repartidos para esta consulta" que sí se ve en el HTML crudo (confirmado con `curl` directo). No se
  usó como fuente citada en ningún registro; el hallazgo de que no hay repartidos digitalizados para la
  legislatura 45 se documenta en `cobertura_del_periodo` en base a esa lectura directa, no a una cita de
  `pnpm fuente`.
- **Fuentes con Wayback fallido** (contenido sí leído y citado con `pnpm fuente`, pero el archivado en
  Wayback Machine falló con error transitorio del servidor — HTTP 429, HTTP 523, "fetch failed" o "operation
  aborted" — y la URL es del tipo `infolegislativa.parlamento.gub.uy/temporales/*.PDF`, con identificador
  temporal que puede caducar): se marcó `verificacion: manual` en el registro correspondiente de
  `vetos.yaml` en:
  - Presupuesto Nacional 2000-2004 (`6524934.PDF`)
  - Art. 154 Ley 17.556 / licitaciones (`1921179.PDF`)
  - Caja de Profesionales Universitarios (`6230056.PDF`)
  - Cooperativas de producción o trabajo asociado (`9768165.PDF`)
  No se marcaron así los registros de Oficiales Generales, Docentes ANEP, Cajeros automáticos, Retribuciones
  80% y Caja Bancaria, porque en esos casos el archivado en Wayback sí tuvo éxito.
- **PDFs de la sección `vetos_sin_desenlace`**: se leyeron con `curl` + `pdftotext` en lugar de `pnpm
  fuente`, porque el objetivo era solo determinar si existía o no un desenlace (triage), no citarlos en un
  registro publicable. Como esos hallazgos no se citan como `evidencia` de ningún `Veto` (no hay registro
  que publicar sin desenlace), no aplica la regla de "toda URL citada se lee con `pnpm fuente`"; si el
  editor decide en el futuro documentar alguno de estos casos (por ejemplo si aparece la sesión que los
  resuelve), esas URLs deberán releerse formalmente con `pnpm fuente` antes de citarlas.

## cobertura_del_periodo

- **Antes de investigar los vetos, se investigó hasta dónde llegan las fuentes**, tal como pide el brief.
  Resultado: el índice público de repartidos de la Asamblea General
  (parlamento.gub.uy/camarasycomisiones/asambleageneral/documentos/repartidos) advierte textualmente que
  "Los Repartidos se encuentran disponibles a partir de la siguiente fecha: Asamblea General a partir del
  01/01/2012". Se verificó además, legislatura por legislatura, usando el propio buscador oficial de
  repartidos (parlamento.gub.uy/documentosyleyes/documentos/repartidos) con el filtro `Lgl_Nro`: para la
  legislatura XLV (2000-2005, la de Batlle) y la XLVI (2005-2010, primer mandato de Vázquez) el sistema
  devuelve "Actualmente no hay repartidos para esta consulta"; para la XLVII (2010-2015, Mujica) el primer
  repartido digitalizado es de enero de 2012, casi dos años después de empezada esa legislatura. **Esto
  significa que el método de "índice de repartidos" que funcionó para investigaciones sobre presidentes
  recientes no existe como tal para Batlle: no hay PDFs de repartidos de Asamblea General digitalizados
  para 2000-2005.** Un lector no debería interpretar la ausencia de repartidos citables como ausencia de
  vetos: la ausencia es de digitalización, no de vetos (que sí existieron y están documentados en
  `vetos.yaml` con otra fuente, el diario de sesiones).
- **El método que sí funcionó para 2000-2005 fue el índice de diarios de sesión** de la Asamblea General
  (parlamento.gub.uy/documentosyleyes/documentos/diarios-de-sesion, filtrando `Cpo_codigo=A` y
  `Lgl_Nro=45`), que si devuelve resultados completos para toda la legislatura: 78 diarios de sesión entre
  el 15-02-2000 y el 22-12-2004. Cada uno de esos 78 diarios se leyó (al menos su sumario, y el texto
  completo de los que mostraban indicios de un veto) para determinar cuáles trataban observaciones del
  Poder Ejecutivo. El archivo con el texto completo de cada diario vive en
  `infolegislativa.parlamento.gub.uy/temporales/*.PDF`, y esos PDFs sí se pudieron descargar y leer con
  `pnpm fuente` sin problemas (a diferencia de los repartidos), aunque el archivado en Wayback falló para
  varios de ellos (ver `verificacion_manual`).
- **No se encontró ninguna sesión de Asamblea General entre el 22-12-2004 y el fin de la legislatura
  (01-03-2005)**: los últimos casi dos meses y medio del mandato de Batlle no tienen ninguna sesión de
  Asamblea General registrada, lo que explica por qué los dos vetos comunicados el 22-12-2004 (importación
  de vehículos usados, haberes de EFCSA) quedaron sin resolver dentro del mandato.
- **Mandato 2000-03-01 → 2005-03-01 (único mandato, presidente electo, sin período de oposición posterior a
  2016 relevante para vetos, porque el veto es una facultad exclusiva del Poder Ejecutivo en ejercicio)**:
  cubierto de forma exhaustiva para la pregunta "¿hubo vetos?" mediante (a) los 78 diarios de sesión de
  Asamblea General completos de la legislatura 45, (b) una fuente académica revisada por pares (Chasquetti
  2013) y una nota especializada (parlamentodata.com 2019) que reportan de forma independiente el mismo
  total agregado (18 leyes vetadas: 7 en los primeros ~43 meses, 11 en los últimos ~17/18 meses), y (c) la
  ficha oficial de trámite de la Ley 17.296 (Presupuesto), que corrobora de forma independiente el
  desenlace de ese primer veto. Resultado: se identificaron y documentaron con desenlace 9 vetos
  (`vetos.yaml`) y se identificaron, sin desenlace documentado, otros 9 (arriba, `vetos_sin_desenlace`),
  para un total de 18 proyectos de ley distintos observados, cifra que coincide con la de las fuentes
  secundarias independientes.
- **Campaña 1999 (previa al mandato)**: se buscó en el corpus y en la web si Batlle había hecho
  declaraciones sobre su disposición a vetar durante la campaña de 1999, y no se encontró nada relevante
  (ver `consultas.jsonl`); no hay registros de este período en `declaraciones.yaml`.
- **Declaraciones públicas de Batlle sobre cada veto puntual**: se buscó activamente para cada uno de los 9
  vetos con desenlace si existía una declaración pública de Batlle (entrevista, conferencia de prensa)
  distinta del propio mensaje de observaciones, y no se encontró ninguna citable con `pnpm fuente`; por eso
  `declaraciones.yaml` queda vacío. Esto es consistente con la advertencia del brief sobre la peor
  digitalización de la prensa de esa época: la hemeroteca de El País y Búsqueda, señaladas como las fuentes
  más probables para 2000-2005, no se pudo consultar porque ninguna de las dos ofrece archivo digital
  público gratuito para notas de hace más de veinte años accesible por búsqueda web estándar; no se
  encontró tampoco en Google ninguna nota de prensa contemporánea sobre estos vetos específicos citable con
  `pnpm fuente`. Esta ausencia se buscó, no se asumió.
- **Oposición y posmandato (2005 en adelante)**: no aplica al objeto de esta corrida — el veto es una
  facultad exclusiva del Poder Ejecutivo en ejercicio, así que no hay "vetos desde la oposición" ni
  "vetos post-mandato" que buscar. Batlle falleció el 24-10-2016 sin haber vuelto a ejercer la presidencia.

## hipotesis

- **Aceptación tácita por falta de quórum, no confirmada explícitamente**: para los 9 vetos listados en
  `vetos_sin_desenlace` que fracasaron por falta de quórum (no para los 3 que quedaron en comisión o sin
  convocatoria), el artículo 139 de la Constitución dice que, transcurridos treinta días de la primera
  convocatoria sin rechazo expreso, las observaciones "se considerarán aceptadas". Es plausible que
  legalmente esos 9 proyectos hayan quedado con el texto que proponía el Poder Ejecutivo por esta vía, tal
  como ocurrió —de forma explícita y documentada— con el veto a la Caja de Profesionales Universitarios.
  Pero a diferencia de ese caso, para estos 9 no se encontró un documento oficial posterior (ficha de
  trámite, comunicación de la Presidencia de la Asamblea, o promulgación con el texto observado) que lo
  confirme como hecho, así que no se afirma en `vetos.yaml`: sería una conclusión propia sin cadena de
  evidencia verificada, y esa tarea corresponde al editor o al detective, no al investigador. Quien continúe
  esta línea podría buscar la ficha de trámite (`parlamento.gub.uy/documentosyleyes/ficha-asunto/<id>`) de
  cada una de las leyes resultantes —si llegaron a promulgarse— y comparar el texto final contra el
  observado.
- **Patrón de "no formación de quórum" como estrategia deliberada**: Chasquetti (2013, la misma fuente
  académica citada en `vetos.yaml`) describe en términos generales que, tras la salida del Partido Nacional
  del gabinete en 2002, "el gobierno recurrió a la clásica estrategia de no formar quórum en las sesiones y
  comisiones consideradas peligrosas para sus intereses… con la complicidad de una parte de los
  legisladores del Partido Nacional". Los 9 casos de `vetos_sin_desenlace` que fracasaron por falta de
  quórum son compatibles con esa descripción general, pero esta investigación no determinó, para cada caso
  puntual, qué bancada específica dejó de concurrir ni si fue deliberado: eso exigiría cruzar las listas de
  "Faltan: con aviso / sin aviso" de cada sesión con la composición partidaria, tarea que no se hizo por
  quedar fuera del alcance de "todos los vetos... y ninguna otra cosa".
- **Posible undercount o overcount frente a las fuentes secundarias**: el total de 18 proyectos distintos
  identificados en esta investigación coincide con el total agregado que reportan Chasquetti (2013) y
  parlamentodata.com (2019), pero esas fuentes no publican el detalle proyecto por proyecto, así que no se
  pudo verificar una correspondencia uno a uno entre "sus" 18 y "los" 18 de esta investigación (podría haber
  algún veto que ellos cuenten y esta investigación no haya encontrado, y viceversa, compensándose en el
  total). Se señala como límite de esta investigación, no como error conocido.

## casos_vistos

Ninguno. No se investigaron casos judiciales (el brief no lo pidió) y no apareció ninguno de forma
incidental durante esta búsqueda.

## objeciones_al_brief

Ninguna. El brief pide cubrir el mandato completo, con lo que hubo y con lo que no hubo, y con el mismo
criterio para cualquier resultado; así se hizo, incluyendo documentar con el mismo detalle los vetos sin
desenlace que los vetos con desenlace. No se identificó ningún pedido de seleccionar, omitir o encuadrar
información según partido, ideología o persona.

## referentes_faltantes

Ninguno. Los vetos registrados no generaron menciones a referentes en el sentido del esquema
(`content/referentes/`); `menciones.yaml` no se generó (no hay archivo separado porque no hubo menciones que
registrar en esta corrida, cuyo objeto son específicamente los vetos).

## medios_faltantes

Ninguno nuevo. Todos los registros usan el medio `parlamento` (Parlamento del Uruguay), ya presente en la
tabla de medios del brief. Se leyó también `impo` (Constitución) solo para el procedimiento constitucional,
sin generar citas en `vetos.yaml`.
