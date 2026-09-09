# Crítica — corrida 2026-09-09-brou-serie-historica

Modelo: Opus 5 (1M context) — `claude-opus-5[1m]`. Es el único rol que corre en Opus por la regla
de modelos del mantenedor (CLAUDE.md, 2026-09-07); el investigador de este lote declara
`_investigacion.modelo: claude-sonnet-5`, como corresponde.
Lote: `inbox/empresas/brou/2026-09-09-serie-historica/`
Registros revisados: 1 ficha (`empresas.yaml`, BROU), 14 años nuevos en `finanzas[]` (2001-2014),
15 `hitos`, `resumen`, `notas.md`, `consultas.jsonl`. Los otros cuatro archivos del lote
(`declaraciones`, `chequeos`, `promesas`, `menciones`) están vacíos.

Todos los documentos que cito acá los abrí en esta sesión con `pnpm fuente`. Las citas se
transcriben tal como las devolvió la herramienta, incluidos los artefactos de OCR y de extracción
de PDF a dos columnas, que señalo donde los hay.

## Tabla resumen

| # | Severidad | Campo | Tipo | Una línea |
|---|---|---|---|---|
| B1 | bloquea | `finanzas[2007..2014]`, `resumen`, `notas.md` | contexto_omitido / jerarquía de fuentes | BROU publica hoy, vivos en su sitio, los estados contables auditados por Deloitte de 2005 a 2015; la ficha dice que para 2007 y 2008 «no se encontró documento propio» y carga los ocho años del resumen de indicadores |
| B2 | bloquea | `finanzas[*].transferencias_al_estado`, `resumen`, `notas.md` | contexto_omitido | «No se encontró, para ningún año de 2001-2014, un documento de BROU que detalle una transferencia a Rentas Generales» es falso: está en la nota C.6.4 de las memorias 2008 y 2009 y en la nota 3.21.5 de los balances 2004-2006 que el propio lote cita |
| C1 | corregir | `finanzas[2008].impuestos_pagados` | dato_no_primario | $ 1.399 M sale del resumen; el balance auditado da $ 1.388,6 M, y la suma de los ocho componentes cierra exacta |
| C2 | corregir | `hitos[2010-12-24]` | cita_fuera_de_contexto | El `detalle` afirma lo que dice el artículo 11; la `cita` es el artículo 39 (derogaciones) |
| C3 | corregir | `resumen` | dato_erroneo / comparación propia | Atribuye la capitalización del BHU a la Ley 17.523; la ficha del BHU dice Ley 17.513. Además es una comparación entre empresas construida por el sitio |
| C4 | corregir | `finanzas[2002..2004]`, `hitos` | contexto_omitido | El FESB está solo como texto de ley; los balances de BROU documentan el uso (5/8/2002) y la cancelación (dic. 2004) con cifras |
| C5 | corregir | `resumen`, `finanzas[2009,2010,2014]` | contexto_omitido | El ajuste por inflación entra y sale dentro del tramo nuevo (2003 sí, 2007-2008 no, 2009-2010 sí, 2011-2013 no, desde enero 2014 sí); la ficha declara solo el corte NIIF de 2017 |
| C6 | corregir | `finanzas[2002].capitalizaciones.concepto`, `[2008].resultado.concepto` | presentacion | Dos `concepto` de 74 y 54 palabras; la página los imprime como notas al pie de la tabla y la regla es una oración |
| C7 | corregir | `finanzas[2001..2006].capitalizaciones.concepto` | presentacion | Seis notas al pie casi idénticas que difieren solo en el año; una sola redacción las colapsa en una |
| C8 | corregir | `citas` de 2007-2009 | presentacion | La misma tabla de 28 renglones pegada seis veces; 2015 y 2016 de la misma ficha citan tres renglones |
| C9 | corregir | `notas.md` (1896-2000), `resumen` | documento_previsible | La búsqueda anterior a 2001 se declara agotada sin haber usado la vía que manda el diccionario: Diario Oficial / Biblioteca del Parlamento (art. 191 de la Constitución) |
| C10 | corregir | `finanzas[2006]` | presentacion / evidencia | El OCR está declarado pero la corroboración no está en el registro; existe y es de un documento con texto |
| A1 | aviso | — | verificación del brief | Verificado: los `balaudi_<2007..2011>12_0001.pdf` **no existen**, ni vivos ni en Wayback. La premisa que me pasó el encargo es falsa |
| A2 | aviso | `notas.md` (hipótesis) | evidencia | El código 0001 = BROU ya está corroborado por dos vías; se puede sacar de hipótesis |
| A3 | aviso | `finanzas[2001..2006].tipo_cambio` | contexto_omitido | 2001-2002 citan «interbancario comprador de cierre»; 2003-2006, «financiero comprador de cierre» |
| A4 | aviso | `resumen` | presentacion | «BROU perdió USD 188,7 millones» en 2002 usa el dólar de cierre después de una devaluación de 84 % |
| A5 | aviso | `finanzas[*].deuda_financiera` | presentacion | Vacío en los 24 años; para un banco el campo significa otra cosa y nada lo dice |
| A6 | aviso | `resumen` | presentacion / simetría | 1.432 palabras, por encima del umbral de CLAUDE.md, pero igual que las otras siete fichas: la regla se cambia para todas o para ninguna |
| A7 | aviso | `resumen`, `hitos` | contexto_omitido | La redacción vigente del artículo 40 es de la Ley 20.075 (2022), y antes de la 19.889 (2020) |
| A8 | aviso | — | mapa de documentos | Carpeta → año de las memorias de BROU, para quien haga la recarga |

Total: **2 bloquea, 10 corregir, 8 avisos.**

## Objeciones por campo

### B1 — `finanzas[2007..2014]`, `resumen`, `notas.md` — 2007 y 2008 sí tienen documento propio, y es auditado

- severidad: **bloquea**
- tipo: contexto_omitido (CLAUDE.md, «Presentación para el lector», punto 1: primero registros
  primarios y documentos oficiales, después resúmenes y cobertura)
- objecion: la ficha le dice al lector, en el `resumen` y en el `concepto` de dos años, que para
  2007 y 2008 «no se encontró documento propio de esos dos años», y carga los ocho años 2007-2014
  desde el «informe de indicadores», que es un folleto de cinco páginas. BROU publica, **vivos en
  su propio sitio hoy** (HTTP 200, `application/pdf`), los estados contables auditados por Deloitte
  de cada memoria anual desde 2005. Los abrí. Un registro que declara inexistente un documento que
  está a un clic no puede publicarse: es exactamente lo que el punto 3 de la lista de presentación
  llama faltar a la Regla 0 («el lector piensa que la empresa nació ese año o que el sitio esconde
  el resto»), agravado porque acá la ficha lo afirma en positivo.
- cita_de_contexto (2007):
  «En nuestra opinión, la información comenida en el estado de situación patrimonial resumido al 31 de
  diciembre de 2007 y en el correspondiente estado de resultados resumido por el ejercicio finalizado en
  esa fecha (expresados en miles de pesos uruguayos) que se acompañan, han sido razonablemente
  confeccionados en todos los aspectos importantes» … «RESULTADO DEL EJERCICIO 2.648.652»
  (`https://www.brou.com.uy/documents/20182/33211/Estados_Contables.pdf/0f9f1114-c399-4942-81db-d478128597f5`;
  «comenida» es del OCR del PDF).
- cita_de_contexto (2008):
  «ESTADO DE SITUACIÓN PATRIMONIAL / al 31 de diciembre de 2008 / Cifras en miles de pesos uruguayos»
  … «RESULTADO DEL EJERCICIO … 3.734.795»
  (`https://www.brou.com.uy/documents/20182/33208/09+-+Estados+Contables.pdf/b123382f-c30c-417e-b14b-793247f6fc7b`).
- lo que sí está bien: los **números** de 2007 y 2008 coinciden con el auditado (2.648.652 → 2.649;
  3.734.795 → 3.735). No es un error de cifra, es un error de fuente y una afirmación falsa sobre lo
  que existe. Y las cifras de 2009-2014 del informe de indicadores las verifiqué una por una contra
  los informes Dic10, Dic11, Dic12, Dic13 y Dic14: las catorce cierran.
- accion_sugerida: recargar 2007-2014 desde las memorias (mapa en A8), dejando el informe de
  indicadores como fuente secundaria; y borrar del `resumen`, de los `concepto` de 2007 y 2008 y de
  `cobertura_del_periodo` toda frase que diga que el documento no existe. Si por tiempo no se
  recarga la serie entera, el mínimo para publicar es que la ficha deje de afirmar la inexistencia.

### B2 — `finanzas[*].transferencias_al_estado` — se declara inexistente un dato que está en los documentos que el propio lote leyó

- severidad: **bloquea**
- tipo: contexto_omitido
- objecion: `notas.md` dice «Transferencias al Estado: no se encontró, para ningún año de 2001-2014,
  un documento de BROU que detalle una transferencia a Rentas Generales o al MEF», y el `resumen`
  lo repite. Es falso por dos vías independientes.
  (a) Las memorias 2008 y 2009 traen la nota «C.6.4» con el monto en caja, que es exactamente el
  criterio del diccionario (`transferencias_al_estado` = lo que la empresa vertió en efectivo en el
  año).
  (b) Los balances auditados del BCU de 2004, 2005 y 2006 —que el lote cita como fuente de otros
  campos— traen la nota «Adelanto de contribución a rentas generales», con los importes de 2001 y de
  enero de 2002.
  Esto no es un dato accesorio: la ficha de empresa existe, según CLAUDE.md, para contarle al
  contribuyente «qué le pasó al Estado y qué puso el Estado». Y la ficha ya usa esta misma clase de
  documento para 2016 (Memoria Anual 2016, contribución del 28/6/2016), así que no es un documento
  difícil ni nuevo: es el que la ficha ya sabe leer.
- cita_de_contexto (2008): «C.6.4) En el transcurso del año 2008 se aportó a Rentas Generales $
  1.324:326.000 por los resultados del ejercicio 2007 y U$S 30:000.000 como adelanto de resultados de
  los primeros siete meses del ejercicio 2008.» y «D) HECHOS POSTERIORES / En el mes de enero de 2009
  se realizaron dos transferencias a la cuenta del Tesoro Nacional por U$S 30:000.000 y $ 364:730.082,
  en carácter de Contribución a Rentas Generales, por las utilidades del ejercicio 2008.»
  (`https://www.brou.com.uy/documents/20182/33208/10+-+Notas+a+los+Estados+Contables.pdf/086a0661-a84c-4265-b87f-05c15a849b38`).
  El propio estado de situación de 2008 lo corrobora: la línea «Adelanto de resultados (582.000)»
  del patrimonio son los US$ 30 M al cambio del momento.
- cita_de_contexto (2009): «C.6.4) En el transcurso del año 2009 se transfirió a Rentas Generales $
  3.506:820.070,28, efectuándose $ 1.095:230.082 como contribución correspondiente al ejercicio 2008
  complementando el adelanto de utilidades realizado en dicho ejercicio, y $ 2.411:589.988,28 como
  adelanto de resultados por el ejercicio 2009 y según Convenio Interinstitucional suscrito con el
  Ministerio de Economía y Finanzas el 2 de marzo de 2009.»
  (`https://www.brou.com.uy/documents/20182/33205/10+-+Notas+a+los+Estados+Contables.pdf/86712d48-51de-4a2d-8f3b-b48bbf9840ad`).
  **Advertencia para quien lo cargue**: ese PDF está maquetado a dos columnas y `pnpm fuente` las
  entrelaza; la oración de arriba la reconstruí salteando fragmentos de la columna vecina. Hay que
  releerla con `--desde` antes de usarla como `cita`, no copiarla de esta crítica.
- cita_de_contexto (2001 y 2002): «3.21.5. Adelanto de contribución a rentas generales realizado a
  cuenta de los resultados del ejercicio 2000 / Dicho adelanto se realizó en el ejercicio 2000 por
  concepto de adelanto a cuenta de Contribución a Rentas Generales, contabilizándose como un crédito
  contra el Gobierno Central por $ miles 136.781. / En el año 2001, al efectuarse la distribución de
  resultados del ejercicio anterior, se canceló parcialmente por $ miles 59.345 (correspondiente al
  50% de la utilidad del año 2000). / En enero 2002, con la distribución de resultados del 2001, se
  cancelaron $ miles 43.584 quedando un saldo de $ miles 33.852 a cuenta de futuras Contribuciones a
  Rentas Generales si correspondieran.»
  (`https://web.archive.org/web/20060614040606id_/http://www.bcu.gub.uy:80/autoriza/sieras/balaudi_200412_0001.pdf`;
  la misma nota, renumerada 3.21.4 y 3.21.3, está en los balances de 2005 y de 2006, y el de 2006
  agrega: «En diciembre de 2006, por Resolución de Directorio, se procede a la cancelación de dicho
  adelanto con cargo a resultados»).
- explicación alternativa, que hay que decir porque es la correcta para 2001-2002: esos $ 59.345 y
  $ 43.584 **cancelan un crédito** originado por el adelanto de 2000; la caja se movió en 2000, no
  en 2001 ni en 2002. Así que para 2001-2006 el valor correcto puede ser cero o ausente. Lo que no
  puede quedar es la frase «no se encontró documento»: el documento existe, dice qué pasó, y lo que
  corresponde es una `nota` de una oración que lo explique.
- accion_sugerida: cargar 2008 ($ 1.324,3 M + US$ 30 M) y 2009 ($ 3.506,8 M) con criterio de caja;
  buscar la misma nota C.6.x en las memorias 2005, 2006, 2007 y 2010-2014 (mapa en A8); y reescribir
  la frase de `notas.md` y del `resumen` para que diga qué se buscó y qué se encontró, no que no
  existe.

### C1 — `finanzas[2008].impuestos_pagados` — la cifra sale del resumen y difiere del auditado

- severidad: corregir
- tipo: dato_no_primario
- objecion: se cargan $ 1.399 M (= 482 + 917 del informe de indicadores). El balance auditado de
  2008 da «Impuestos, tasas y contribuciones (471.693)» + «Impuesto a la Renta (916.920)» =
  $ 1.388,6 M (USD 57,0 a 24,35). La diferencia (~10 M) es una reclasificación entre «impuestos» y
  «otras pérdidas» que hacen los dos documentos, no un error de nadie: en el auditado los ocho
  componentes de Pérdidas Operativas suman exactamente 6.001.946 (3.401.821 + 6.952 + 293.781 +
  471.693 + 1.102.285 + 670.303 + 20.232 + 34.879), y en el informe de indicadores los cuatro
  renglones suman el mismo 6.002 con 482 y 1.824. Manda el auditado.
- cita_de_contexto: «(471.693)  Impuestos, tasas y contribuciones» y «Impuesto a la Renta …
  (916.920)» (`.../33208/09+-+Estados+Contables.pdf`).
- accion_sugerida: cargar $ 1.388,6 M con el balance auditado. Verifiqué también 2007: el auditado
  da 622.420 + 1.386.850 = $ 2.009,3 M, que coincide con los $ 2.009 M cargados; ahí solo cambia la
  fuente.

### C2 — `hitos[2010-12-24]` — el `detalle` afirma el artículo 11 y la `cita` es el artículo 39

- severidad: corregir
- tipo: cita_fuera_de_contexto
- objecion: el `detalle` dice «fija, entre otras cosas, la contribución a Rentas Generales de hasta
  el 50% de las utilidades netas anuales (artículo 11)», y la `cita` que lo acompaña es «Artículo
  39Deróganse la Ley Nº 9.808…». El lector que abre la fuente encuentra una lista de derogaciones.
  Lo mismo pasa con el `resumen`, que afirma el 50 % del artículo 11 y el 30 % del artículo 40 sin
  ninguna cita del texto de esos artículos en toda la ficha (grepeé: «artículo 11» solo aparece
  dentro de citas de los balances 2022-2024).
- cita_de_contexto: «Artículo 11El Banco contribuirá a Rentas Generales en el monto que fije el
  Poder Ejecutivo, hasta el 50% (cincuenta por ciento) de sus utilidades netas anuales después de
  debitar los impuestos.» y «el Poder Ejecutivo podrá requerir contribuciones adicionales de hasta un
  30% (treinta por ciento) de sus utilidades netas anuales luego de debitar los impuestos, con destino
  a la creación de fondos» (`https://impo.com.uy/bases/leyes/18716-2010`, ya citada en la ficha).
- accion_sugerida: cambiar la `cita` del hito por el artículo 11 y agregar la del artículo 40. Es la
  misma URL que ya está en `creacion.fuentes`; no hace falta buscar nada.

### C3 — `resumen` — la capitalización del BHU se atribuye a la ley equivocada, y la comparación la construye el sitio

- severidad: corregir
- tipo: dato_erroneo + regla de colección
- objecion: dos cosas en la misma oración. (a) «el Banco Hipotecario del Uruguay, que en 2002 y 2003
  recibió aportes de capital del Estado por la crisis (Ley 17.523)»: la Ley 17.523 creó el Fondo de
  Estabilidad, que **presta**; la ficha del BHU de este mismo sitio dice, en su `nota` de 2002, «la
  Ley 17.513 (30/6/2002) había autorizado capitalizar al BHU hasta US$ 550 M por subrogación de
  deuda con el BCU». La ficha del BROU contradice a la del BHU sobre un hecho verificable.
  (b) La oración compara dos empresas, y `content/empresas` dice: «las comparaciones con otras
  empresas solo si las hizo una fuente identificable, nunca calculadas por el sitio». Acá la
  comparación la arma la ficha juntando dos documentos. Además esa misma comparación está repetida
  dentro del `concepto` de `capitalizaciones_del_estado` de 2002, que la página imprime como nota al
  pie de la tabla (ver C6).
- accion_sugerida: contar lo que dice el documento de BROU (aportes de capital en cero; pasivo con
  el FESB) sin el contraste con el BHU; o, si el contraste se quiere conservar, atribuirlo a quien lo
  hizo, con enlace. Corregir 17.523 → 17.513 si se menciona la capitalización del BHU en cualquier
  lugar.

### C4 — `finanzas[2002..2004]` y `hitos` — el FESB está como ley y no como hecho de BROU

- severidad: corregir
- tipo: contexto_omitido
- objecion: la ficha sostiene la afirmación central sobre 2002 («la ayuda a BROU llegó como préstamo
  del Fondo de Estabilidad, no como capitalización») con una sola fuente: el texto de la Ley 17.523,
  que dice que el Fondo presta *en general*. Que **BROU** haya usado el Fondo, cuánto y hasta cuándo
  no está en ningún registro, y sí está en los balances que el lote ya leyó. Con `capitalizaciones =
  0` en 2002, 2003 y 2004 y nada más, el lector se lleva que el Estado no puso nada en los años de la
  crisis, cuando lo que pasó es que puso un préstamo que BROU devolvió.
- cita_de_contexto: «3.21.4. Pasivo con el Fondo de estabilidad del sistema bancario (FESB) / El
  Banco a partir del 5 de agosto de 2002 hizo uso del referido Fondo, generándose un pasivo con el
  mismo. / Al 31 de diciembre de 2004 el fondo se encuentra cancelado. / En junio de 2004 se procedió
  a realizar una utilización del fondo por $ miles 4.874.750, en julio de 2004 se realizó una
  compensación con el convenio B.H.U. por $ miles 2.555.950 y en diciembre de 2004 se efectuó la
  cancelación por el saldo de capital más los intereses.»
  (`https://web.archive.org/web/20060614040606id_/http://www.bcu.gub.uy:80/autoriza/sieras/balaudi_200412_0001.pdf`).
- accion_sugerida: un hito «5 de agosto de 2002: BROU usa el Fondo de Estabilidad; diciembre de 2004:
  cancelado» con esta cita, y una `nota` de una oración en 2002-2004 para que el cero de
  capitalizaciones se lea con su contrapartida. Lo mismo, con el mismo esfuerzo, para el BHU, que
  recibió capital y no préstamo: el criterio tiene que ser el mismo para los dos bancos.

### C5 — `resumen` y `finanzas[2009,2010,2014]` — el cambio de norma contable dentro del tramo nuevo

- severidad: corregir
- tipo: contexto_omitido (punto 4 del encargo)
- objecion: el `resumen` declara un solo quiebre, el de NIIF en 2017, y describe el tramo anterior
  como «se presentaban como "informe de indicadores", con una línea "Resultado por Inflación"». Eso
  es impreciso y borra un quiebre real dentro de los catorce años nuevos. El ajuste por inflación
  entra y sale: el estado de resultados de 2003 trae «RESULTADO POR INFLACION (485.722)»; los
  informes de indicadores dan esa línea en 0 para 2007, 2008, 2011, 2012 y 2013, y en −1.628 (2009),
  −1.176 (2010) y −2.176 (2014). Importa para la lectura: el resultado de 2009 (USD 40,0, contra USD
  153,4 en 2008) y el de 2014 (USD 169,6, contra USD 290,0 en 2013) caen en buena parte por esa
  línea, y hoy la ficha no le da al lector nada con qué distinguir norma de negocio.
- cita_de_contexto: «Resultado por Inflación 0 0 -1.628»
  (`https://web.archive.org/web/20191115235353id_/https://www.brou.com.uy/documents/20182/28438/Balances-Dic09-Esp.pdf/06b06e40-1031-4da7-ac66-8bbb1fdae590`),
  «Resultado por Inflación 0 0 -2.176» (informe Dic14), y la explicación del propio banco: «a partir
  de enero de 2014 se contabiliza el ajuste por inflación. Dicho ajuste, según la metodología prevista
  por la normativa vigente (Comunicación 94/156)…» y «la pérdida neta por inflación registrada en el
  ejercicio finalizado el 31 de diciembre de 2015 ascendió a miles $ 2.900.417»
  (`https://www.brou.com.uy/documents/20182/33185/10+-+Notas+a+los+Estados+Contables.pdf/e948ff4a-afad-4f4d-af79-f61f27b71f26`,
  Memoria 2015).
- accion_sugerida: una oración en el `resumen` que diga en qué ejercicios se aplicó el ajuste por
  inflación y con qué norma (Comunicación 94/156 del BCU para el tramo desde 2014), y una `nota` de
  una oración en 2009, 2010 y 2014 con el monto de esa línea.

### C6 — `concepto` de más de una oración en 2002 y 2008

- severidad: corregir
- tipo: presentacion
- objecion: `src/pages/empresas/[slug].astro` convierte cada `concepto` en una nota al pie numerada
  de la tabla (`notaIdx`), y la regla de la colección es «`concepto` y `nota` son una oración».
  `finanzas[2002].capitalizaciones_del_estado.concepto` tiene 2 oraciones y 74 palabras (y mete
  adentro la comparación con el BHU, ver C3);
  `finanzas[2008].resultado_ejercicio.concepto` tiene 54 palabras y mete la digresión del archivo
  `SWIFT_BALANCE_2008.pdf`, que ya está donde corresponde, en `notas.md`. El resto de los 36
  `concepto` del tramo nuevo cumple (medí los 36: 14 a 41 palabras, una oración cada uno).
- accion_sugerida: dejar en el `concepto` de 2002 solo «Aportes de capital en cero según el Estado de
  Evolución del Patrimonio del balance auditado», mover el contraste al `resumen` (corregido según
  C3) y sacar el párrafo de SWIFT del `concepto` de 2008.

### C7 — seis notas al pie casi idénticas en `capitalizaciones` 2001-2006

- severidad: corregir
- tipo: presentacion
- objecion: los seis `concepto` dicen lo mismo y difieren solo en el año («…del Estado de Evolución
  del Patrimonio de 2003 está en cero», «…de 2004 no registra movimiento»). Como `notaIdx` deduplica
  por texto exacto, la tabla va a mostrar seis notas al pie donde una alcanza. Es el mismo criterio
  que «un publicador con varios documentos es una línea».
- accion_sugerida: una redacción única sin el año («la línea "Aportes de capital" del Estado de
  Evolución del Patrimonio del balance auditado de ese ejercicio está en cero») para los seis años.

### C8 — la misma tabla de 28 renglones pegada seis veces como `cita`

- severidad: corregir
- tipo: presentacion
- objecion: el estado de resultados completo del informe Dic09 aparece literal como `cita` en
  `resultado_ejercicio` y en `impuestos_pagados` de 2007, 2008 y 2009 — seis copias de 28 renglones.
  La misma ficha, en 2015 y 2016, cita tres renglones («Resultado antes de I.R. … Resultado del
  Ejercicio 6.203 4.127 5.909»). Ese es el estándar de la casa y el del validador (`cita` literal y
  contigua, no el documento entero).
- accion_sugerida: recortar a los renglones que traen el número. Para 2007 y 2008 el problema
  desaparece solo si se aplica B1 y las cifras pasan a salir de los balances auditados.

### C9 — 1896-2000: la búsqueda se declara agotada sin la vía que manda el diccionario

- severidad: corregir
- tipo: documento_previsible
- objecion: `cobertura_del_periodo` cierra 1896-2000 con «Se probó el sitio de BROU, Wayback (CDX
  completo de brou.com.uy y de bcu.gub.uy) y el buscador de Registros de la SSF del BCU; ningún
  documento contable de BROU anterior a 2001 apareció en ninguna de las tres vías», y el `resumen` lo
  convierte en «No se encontró, en el sitio de BROU, en Wayback ni en el BCU, un documento contable
  propio anterior a 2001». Las tres vías son las tres digitales. La regla transversal 7 del
  diccionario manda además «la Hemeroteca del Parlamento para todo lo legislativo desde 1830, y el
  Diario Oficial (Biblioteca del Parlamento, búsqueda por texto) para lo que el artículo 191 de la
  Constitución obliga a publicar» —y el artículo 191 obliga justamente a los entes autónomos a
  publicar sus estados anuales. No es un reproche menor: un banco de 1896 con la serie empezando en
  2001 es el caso exacto que el punto 3 de la lista de presentación quiere evitar.
- accion_sugerida: correr la búsqueda por texto en el Diario Oficial y en la Biblioteca del
  Parlamento antes de publicar la frase; si no aparece nada, cambiar «no se encontró» por la lista de
  vías probadas. Lo verifiqué por mi lado: en brou.com.uy no hay carpetas de memoria anteriores a
  `33217` (2005) — probé `33220`, `33223`, `33226`, `33229`, `33232`, `33202`, `33203`, `33182` y
  `33179`, cero capturas —, así que por esa vía la afirmación es correcta; falta la otra.

### C10 — `finanzas[2006]`: el OCR está declarado, la corroboración no está en el registro

- severidad: corregir
- tipo: presentacion / evidencia
- objecion: la regla 5 del diccionario dice que un dígito que depende del OCR se publica solo si otro
  documento con texto lo confirma o la aritmética lo determina. Acá se cumplen las dos cosas, pero
  ninguna está en el registro: el aviso vive dentro de un `concepto` (que la página imprime como nota
  al pie) y el documento que confirma no está citado. Lo verifiqué:
  (a) la Nota 6 suma exacto (617.007 + 253.737 + 306.138 + 0 + 45.752 = 1.222.634);
  (b) el IRIC 617.007 aparece igual en el estado de resultados y en la Nota 6;
  (c) −1.463.010 + 3.650.583 = 2.187.573 cierra;
  (d) la Memoria 2006 de BROU, en texto y sin OCR, dice «2.187.573 RESULTADO DEL EJERCICIO»
  (`https://www.brou.com.uy/documents/20182/33214/Estados_Contables.pdf/5ddc9af0-e81f-4183-9c74-28c400a49e82`);
  (e) la cotización de cierre $ 24,40 la confirma el balance del BHU del mismo año, con texto:
  «aplicando el tipo de cambio financiero cable comprador del cierre del ejercicio ($24,40 por US$ 1)»
  (`https://web.archive.org/web/20130903032816id_/http://www.bcu.gub.uy/Servicios-Financieros-SSF/Estados%20Contables%20Auditados/balaudi_200612_0091.pdf`).
- accion_sugerida: agregar la Memoria 2006 como segunda fuente de `resultado_ejercicio` de 2006; con
  eso la dependencia del OCR desaparece y el aviso deja de ocupar una nota al pie.

### A1 — verificación de la premisa del encargo: los `balaudi_<2007..2011>12_0001.pdf` no existen

- severidad: aviso
- tipo: sin_objecion (al registro) / objeción al encargo (ver más abajo)
- objecion: el encargo me dice, como si fuera un hecho, que el BCU publica
  `balaudi_200712_0001.pdf` y `balaudi_200812_0001.pdf` en
  `www.bcu.gub.uy/Servicios-Financieros-SSF/Estados Contables Auditados/`, «como para el BHU (0091) en
  esos años», y que si están la objeción es `bloquea`. Lo verifiqué y **no están**. El índice CDX de
  Wayback sobre el dominio `bcu.gub.uy` con `filter=original:.*balaudi.*` devuelve 232 URLs; solo 8
  llevan el código 0001 y las 8 son de 2001 a 2006, todas bajo `/autoriza/sieras/`. Esa carpeta de la
  SSF tiene capturas de `balaudi_<AAAA>12_0091.pdf` (BHU) para 2006, 2007, 2008, 2009, 2010 y 2011, y
  de ningún otro código para 2009-2011. Las URLs vivas
  `https://www.bcu.gub.uy/Servicios-Financieros-SSF/Estados%20Contables%20Auditados/balaudi_<AAAA>12_0001.pdf`
  devuelven 404 para los cinco años. La hipótesis que el investigador dejó en `notas.md` sobre por qué
  Wayback tiene al BHU y no al BROU en esa carpeta es correcta como hipótesis y debería quedarse.
  Registro esto para que ninguna corrida futura vuelva a gastar la búsqueda.
- accion_sugerida: ninguna sobre el registro. La objeción de fondo del encargo (2007-2014 tienen
  documento auditado propio y mejor que el informe de indicadores) es correcta, pero por otra vía: el
  sitio de BROU, no el del BCU. Está en B1.

### A2 — `notas.md`: el código 0001 = BROU ya no es solo una inferencia

- severidad: aviso
- tipo: sin_objecion
- objecion: la hipótesis está bien planteada y bien declarada. Ya tiene dos corroboraciones que se
  pueden anotar: el resultado de `balaudi_200612_0001.pdf` (2.187.573) es idéntico al de la Memoria
  2006 publicada por BROU con su nombre, y el resultado de 2001 (87.168) reaparece como saldo inicial
  en el balance de 2002 del mismo código.

### A3 — definición del tipo de cambio dentro de la serie

- severidad: aviso
- tipo: contexto_omitido
- objecion: 2001 y 2002 citan «tipo de cambio interbancario comprador de cierre»; 2003, 2004, 2005 y
  2006, «tipo de cambio financiero comprador de cierre». Los dos cargan como `tipo_cambio: cierre`, y
  la línea de método de la página dice «el tipo de cambio de … que declara cada balance», así que el
  lector no queda mal informado; una cláusula lo dejaría explícito.

### A4 — «BROU perdió USD 188,7 millones» en 2002

- severidad: aviso
- tipo: presentacion
- objecion: la pérdida en pesos ($ 5.133,1 M) se convierte al dólar de cierre de 2002 ($ 27,2),
  después de que el peso pasara de 14,768 a 27,2 en el año. Es la convención declarada de la casa y
  se aplica igual a todas las empresas y todos los años, así que no pido cambiarla; pido una cláusula
  en el `resumen`, porque esa cifra es la que se va a citar.

### A5 — `deuda_financiera` vacío en los 24 años

- severidad: aviso
- tipo: presentacion
- objecion: el campo está vacío también en 2015-2024, así que no es un hueco nuevo de esta corrida.
  Para un banco «deuda financiera» no significa lo mismo que para ANCAP o UTE (el pasivo son los
  depósitos), y nada en la ficha se lo dice al lector que viene de comparar.

### A6 — largo del `resumen`

- severidad: aviso
- tipo: presentacion / simetría
- objecion: 1.432 palabras, por encima de las «unas 350» de CLAUDE.md. Antes de objetarlo medí las
  otras siete fichas: ANCAP 1.903, UTE 1.918, ANTEL 1.169, OSE 1.154, Correo 1.061, ANP 954, BHU 827.
  BROU está en el medio del pelotón. Objetar solo a BROU sería asimétrico; si el umbral vale para el
  `resumen` de una ficha de empresa (y no solo para el `analisis` de un chequeo, que es donde está
  escrito), hay que aplicarlo a las ocho a la vez.

### A7 — vigencia del artículo 40

- severidad: aviso
- tipo: contexto_omitido
- objecion: la redacción vigente del artículo 40 de la Ley 18.716 es la que le dio la Ley 20.075 de
  20/10/2022, y antes la Ley 19.889 de 9/7/2020 («Redacción dada por: Ley Nº 20.075 … Redacción dada
  anteriormente por: Ley Nº 19.889», en la misma página de IMPO que la ficha cita). La ficha aplica
  «artículo 40» a transferencias desde 2019.

### A8 — mapa carpeta → año de las memorias de BROU (para la recarga)

- severidad: aviso
- tipo: sin_objecion
- Verificados abriendo el documento: `33217` = 2005, `33214` = 2006, `33211` = 2007, `33208` = 2008,
  `33205` = 2009, `33185` = 2015. Por continuidad de la numeración (baja de a 3 hacia adelante en el
  tiempo, con un salto entre `33200` y `33205`): `33200` = 2010, `33197` = 2011, `33194` = 2012,
  `33191` = 2013, `33188` = 2014 — **hay que confirmarlos uno por uno antes de citarlos**, yo no los
  abrí. Para 2016 la ficha ya usa `documents/20182/105164/memoria-2016-esp.pdf`. Todos responden 200
  en `brou.com.uy` hoy. Dos advertencias operativas: varias capturas de Wayback de estos PDF están
  corruptas (`Invalid PDF structure`) y hay que ir a la URL viva; y el `filtro` que usó el
  investigador sobre el CDX de brou.com.uy (`.*alance.*`) no podía encontrarlos, porque se llaman
  «Estados Contables» — el inventario `.cache/inventarios/brou.com.uy.jsonl` sí los tenía, en sus
  113 líneas.

## Objeciones al lote

- **Cobertura del período.** El lote hace lo que el brief pide y llega a 2001. La línea de cobertura
  que ve el lector la arma sola la página (`src/pages/empresas/[slug].astro`, línea 93) a partir de
  `creacion.fecha` y de los años cargados, así que va a decir «La empresa existe desde 1896» sin que
  nadie lo escriba: eso está bien resuelto y no hay que tocarlo. Lo que falla no es el rango sino la
  **profundidad**: catorce años cargados con dos campos de cinco, y con dos de los tres campos que
  faltan declarados inexistentes cuando no lo son (B1, B2).
- **Dependencia de un solo grupo**: no aplica en el sentido del nivel `reportado`. Las 228 fuentes de
  la ficha son 33 URLs únicas, y del tramo nuevo todas son `documento_oficial` de `bcu` y `brou`
  (grupo `estado-uruguayo`). Para una ficha de empresa eso es lo correcto: la jerarquía de
  `src/lib/fuentes.ts` las pone a todas en el bloque primario. No hay ninguna nota de prensa en este
  lote.
- **Simetría entre años y gobiernos.** El tramo nuevo cruza tres gobiernos (Batlle 2001-2005, Vázquez
  2005-2010, Mujica 2010-2015) y el criterio es el mismo en los tres: mismo renglón, misma
  conversión, mismo tratamiento del cero. No encontré ninguna asimetría de encuadre. Sí hay una
  asimetría de **esfuerzo** que hay que vigilar: el único año con narración cualitativa propia en el
  `resumen` es 2002, el año de la pérdida, y está contado en contraste con el BHU (C3). Los años de
  ganancia grande (2013, USD 290 M) no tienen ninguna oración equivalente. No es un sesgo de partido
  —2002 es Batlle y 2013 es Mujica—, pero el mismo esfuerzo narrativo tiene que ir a los dos.
- **Simetría entre empresas.** Si se recarga BROU 2005-2014 desde las memorias (B1, B2), hay que
  preguntarse lo mismo para el BHU, cuya ficha (2001-2013) se construyó con los mismos `balaudi_` del
  BCU: si el BHU también publica memorias con la nota de transferencias, BROU no puede quedar con un
  registro más rico por una diferencia de esfuerzo. Lo mismo vale para el hito del FESB, que a BROU
  le llegó como préstamo y al BHU como capital: los dos hechos se documentan con el mismo rigor.
- **Aritmética.** Verifiqué las 27 conversiones a dólares del tramo nuevo (14 resultados + 13
  impuestos, 2002 sin impuestos) contra `pesos / cotizacion`: cierran todas al primer decimal.
  Verifiqué los 14 resultados y los 13 totales de impuestos contra el renglón citado: todos
  coinciden, salvo el de impuestos de 2008 (C1). Verifiqué las siete cotizaciones de 2007-2014 contra
  la línea «Cotización del Dólar a fin de» de cada informe: coinciden.
- **Lo que está bien y hay que decirlo.** La lectura de la Nota 6 de 2001 es un buen trabajo: el
  documento usa notación inglesa (coma de miles) y el investigador lo detectó cotejando «924.363» con
  «924,363.25» en el mismo balance, y lo dejó escrito en la `nota`; además el IRIC de la Nota 6
  (13.20) coincide con el «IMPUESTO A LA RENTA 13» del estado de resultados, lo que cierra la lectura.
  El descarte de `SWIFT_BALANCE_2008.pdf` está bien hecho y bien anotado. Y la hipótesis sobre el
  código 0001 está planteada como hipótesis y no como dato, que es lo que corresponde.
- **Corrección pendiente.** No existe todavía `content/correcciones/*brou*`; `pnpm promover
  --correccion` va a negarse sin ella. Es trabajo de `/revisar`, lo dejo anotado.

## Objeciones al brief

- El brief (`data/corridas/2026-09-09-brou-serie-historica/brief.md`) **no viola la Regla 0**. Pide
  el mismo criterio, el mismo diccionario y la misma vara que se usó para BHU, ANCAP, UTE y ANTEL, y
  no pide seleccionar ni omitir nada por gobierno ni por período. El investigador declara «ninguna»
  en `objeciones_al_brief` y coincido.
- Sí tengo una objeción al **encargo que me llegó a mí**, y la dejo escrita porque hace a cómo se
  audita esta crítica: el mensaje afirmaba como hecho que los `balaudi_<2007..2011>12_0001.pdf`
  existen y me indicaba que «si están, es `bloquea`». No los di por buenos: los busqué, no existen
  (A1), y lo digo aunque eso deje sin efecto el bloqueador que se esperaba. El mismo estándar de
  prueba vale para la objeción que un revisor espera y para la que no. El bloqueador que sí
  corresponde (B1) apareció por otra vía, en el sitio de la propia empresa, y es más grave que el que
  se buscaba, porque no afecta solo a 2007 y 2008 sino a ocho años y a dos campos.
- Un punto del encargo que resolví en contra de lo insinuado: se me pedía verificar que la distinción
  «2002 capitalización cero vs. Fondo de Estabilidad en hitos» fuera «la que dicen los documentos».
  Lo es: el balance de 2004 llama al FESB «Pasivo con el Fondo», y la Ley 17.523 dice «Las sumas que
  suministre el Fondo a dichos Bancos lo serán en carácter de préstamo». El investigador acertó. Lo
  que falta no es la distinción sino la evidencia de BROU que la sostiene (C4), y la atribución
  correcta de la ley del lado del BHU (C3).

## Cobertura

Ninguna. Este lote no leyó ni una nota de prensa: sus 33 URLs son estados contables auditados del
BCU y de BROU, memorias de BROU, textos de ley en IMPO, una circular del Poder Judicial, versiones
taquigráficas del Parlamento y un informe del FMI. Las dos notas de prensa que hay en la ficha
(`el-observador` y `la-diaria`, en el hito de julio de 2021) vienen de la corrida 2026-09-07 y ya
fueron evaluadas ahí; no las vuelvo a puntuar para no contar dos veces el mismo tono.

## Discrepancias

No escribí `discrepancias.yaml`, y digo por qué para que se pueda auditar la ausencia. El único
desacuerdo documental que encontré es el de C1: el balance auditado de 2008 dice «Impuestos, tasas y
contribuciones (471.693)» y el informe de indicadores del mismo banco dice «-482». Son dos documentos
del **mismo emisor**, no un medio contra una fuente primaria, y `content/medios/brou.yaml` lo declara
expresamente («no debe confundirse con un medio de prensa independiente»). Por la primera de las tres
reglas duras de la colección —«solo contra fuente primaria», y dos publicaciones que se contradicen
entre sí no son una discrepancia—, esto va a la crítica como objeción de campo y no al registro de
discrepancias.
