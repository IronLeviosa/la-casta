# Notas — ANP (corrida 2026-09-07, segunda vuelta tras crítica en Opus)

Esta segunda vuelta resolvió los 7 bloqueantes y la mayoría de los 24 «corregir» de
`data/corridas/2026-09-07-empresas-anp/critica.md`. Todas las citas de `empresas.yaml` y
`analisis.yaml` se recopiaron literalmente del texto guardado en el corpus (no de memoria ni del
fetch en pantalla) y se verificaron con `pnpm validar --inbox ... --red --solo citas`: **144/144
citas exactas, 0 aproximadas, 0 no encontradas**.

## candidatos_giro
No aplica: corrida sobre una empresa pública, no sobre un político.

## hipotesis
- La `hipotesis` original que acusaba a ANP de un error de imprenta ("la nota dice literalmente
  «En el ejercicio 2012…»") era falsa: el error estaba en nuestra transcripción, no en el balance.
  Se retiró. Confirmado releyendo el balance de 2022 con `pnpm fuente` en esta corrida: la nota
  real dice "2022" y "2021" en dos oraciones separadas, sin el "[sic]" que se le había puesto.
- `finanzas[2024].resultado_ejercicio`: la posible discrepancia con "ganancias de US$ 42 millones"
  que reportó la prensa sigue sin conciliar (no se abrió esa nota en ninguna de las dos corridas).
  Se sacó la mención sin fuente del `concepto`; si se quiere investigar, es candidata a
  `discrepancias/` una vez que se abra la nota original con `pnpm fuente`.
- `analisis.yaml` (CPPI Banco Mundial): las cifras de las ediciones 2021 (265/370) y 2022
  (304/348) que reporta La República no se cotejaron contra esos informes (no se abrieron en esta
  corrida); solo se verificó la edición 2023 directamente en el PDF del Banco Mundial. Documento
  previsible: `documents.worldbank.org` / `openknowledge.worldbank.org`, ediciones CPPI 2021 y
  2022.
- `comparaciones[0]` (CEPAL, TEUs 2023): no se pudo abrir el documento propio de CEPAL en esta
  corrida (el "informe" que cita El Observador parece ser el portal `perfil.cepal.org`, no un PDF
  único; no se identificó la URL exacta a tiempo). La comparación queda con El Observador como
  única fuente (cobertura de prensa de un dato de CEPAL), sin poder poner a CEPAL como
  `fuentes[0]` tal como pide la regla de presentación 10. Documento previsible para una próxima
  corrida.
- `monopolio.argumentos_en_contra` (Grinschpun, navieras 2021): la nota de El Observador dice
  explícitamente que trabaja sobre "la versión taquigráfica" de una comisión parlamentaria de
  mayo/junio de 2021, pero no se localizó esa sesión específica (distinta de la interpelación del
  18 de agosto que sí se consiguió) en el tiempo de esta corrida. La cita se mantiene como
  `reportado` (El Observador). Documento previsible: `parlamento.gub.uy`, actuación de comisiones
  de la Cámara de Representantes o del Senado, mayo-junio de 2021, sobre el reglamento de atraque
  de TCP.
- `monopolio.alcance`: se sacó la oración "el Estado y ANP rechazan esa lectura…" por no tener
  fuente; no se encontró, en esta corrida, una respuesta pública de ANP o del Poder Ejecutivo
  dirigida específicamente a la acusación de Montecon de que ANP es "juez y parte". Queda como
  hipótesis a confirmar si se abre una próxima corrida sobre el expediente 45/021.

## casos_vistos
(sin cambios respecto de la corrida anterior; no investigados)
- https://www.elpais.com.uy/informacion/judiciales/gerentes-de-katoen-natie-y-directivos-de-anp-citados-a-declarar-en-fiscalia-esta-semana
- https://www.elpais.com.uy/informacion/politica/la-anp-baja-el-perfil-a-la-demanda-multimillonaria-de-empresa-portuaria-belga
- https://www.elobservador.com.uy/nota/puerto-montecon-inicio-demanda-contra-el-estado-por-contrato-con-katoen-natie-2022427143830
- https://www.elobservador.com.uy/nota/fa-ampliara-denuncia-penal-por-concesion-en-el-puerto-ante-abuso-del-ministerio-de-economia-20221261610
- https://www.elobservador.com.uy/nota/puerto-informe-tecnico-cuestiona-regularidad-juridica-del-acuerdo-con-tcp-y-fiscal-le-pide-informacion-al-gobierno-202222415160
- https://www.elpais.com.uy/informacion/politica/cocaina-anp-investigara-todos-los-embarques-de-soja-que-salieron-en-los-ultimos-dos-meses
- https://www.elpais.com.uy/informacion/judiciales/presidente-de-anp-dijo-que-no-esta-claro-el-origen-de-la-cocaina-que-llego-a-espana-procedente-de-uruguay
- https://www.elpais.com.uy/informacion/sociedad/denuncian-pagos-extras-en-la-anp-pero-esta-lo-niega
- **Nuevo en esta corrida**: la Comisión de Promoción y Defensa de la Competencia (MEF) declaró dos
  veces admisible la denuncia de Montecon (expediente 45/021) contra el MTOP, ANP y Katoen Natie
  por la extensión de la concesión de TCP y el reglamento de atraque; el MEF revocó esa decisión
  por entender que la Comisión no tiene competencia para juzgar la legalidad de actos del Poder
  Ejecutivo en política portuaria. Montecon recurrió esa revocación ante el TCA, que en dos fallos
  recientes (uno de ellos con Sentencia N° 708 del 17/12/2025) confirmó la revocación del MEF en
  cuanto a la falta de competencia de la Comisión, y en un fallo separado anuló solo la cláusula
  3.4.5 del Decreto 114/021 (que impedía nuevas concesiones mientras TCP no superara el 85% de su
  capacidad), confirmando el resto del decreto. Es litigio administrativo (TCA), no una causa
  penal contra una persona; se agregó como desenlace documentado al argumento de Montecon en
  `monopolio.argumentos_en_contra[0]`, con fuente de El Observador
  (nuevo-round-portuario-tca-desestimo-otra-demanda-montecon...). No se buscó la sentencia
  original del TCA en el Poder Judicial en esta corrida.

## verificacion_manual
(sin cambios respecto de la corrida anterior, salvo lo agregado abajo)
- https://anp.com.uy/sites/default/files/archivos/parrafo-colapsable/2020-08/balance_2017_0.pdf — PDF escaneado sin capa de texto.
- http://aplicaciones.anp.com.uy/archivo/Institucional/Estados_Financieros_2021.pdf — PDF escaneado sin capa de texto.
- https://www.anp.com.uy/sites/default/files/archivos/parrafo-colapsable/2020-08/ANP_31_12_10.pdf — extracción sin contenido útil.
- No se encontró ningún balance de ANP correspondiente al ejercicio 2007.
- `https://legislativo.parlamento.gub.uy:443/temporales/20210818s00242986893.html` (el enlace que
  devolvió la búsqueda web) ya estaba vencido al intentarlo (`fetch failed`): es el link efímero
  del visor de diario de sesiones, que expira. Se resolvió pasando por
  `parlamento.gub.uy/documentosyleyes/documentos/diarios-de-sesion/6298/IMG`, leyendo el HTML del
  visor con `pnpm fuente --completo` para encontrar el enlace fresco a
  `infolegislativa.parlamento.gub.uy/temporales/20210818s0024.pdf`, y citando ese.
- `https://infolegislativa.parlamento.gub.uy/temporales/302199.PDF` (pedido de informes que
  identifica Puerto Sauce = Juan Lacaze, en `fuentes[1]` de la ficha): mismo tipo de link efímero;
  se leyó y citó correctamente en esta corrida (el texto queda guardado en el corpus), pero al
  correr `pnpm validar --red --solo fuentes` al cierre, el original ya daba HTTP 404 y **no tenía
  copia en Wayback**. Nota de proceso: al intentar generar esa copia corrí `pnpm archivar`, y a
  mitad de camino noté que ese comando lo corre `/revisar`, no el investigador (escribe en
  `data/fuentes-ledger.json`, fuera de mi alcance); lo dejé terminar en segundo plano porque
  cortar una tanda de Save Page Now a mitad de camino podía dejar el ledger a medio escribir, pero
  no debí iniciarlo y no esperé ni usé su resultado para nada de lo que sigue en este lote. Quien
  retome esto debe correr `pnpm archivar` (o conseguir el enlace fresco de nuevo y archivarlo)
  antes de promover ese registro puntual.

## para_el_editor

Detalle metodológico que se sacó de los `concepto` (recortados a una oración) para no pasar los
200 caracteres que la página imprime como nota al pie de tabla. Si algo de esto merece entrar al
`resumen` de la ficha, queda a criterio del editor:

- **`finanzas[2003/2005/2008/2010].resultado_ejercicio`**: estos cuatro años vienen de la columna
  comparativa de un balance que reexpresa por inflación (moneda homogénea de poder de compra al
  31/12 del año SIGUIENTE). La corrida anterior dividía el monto reexpresado por el tipo de cambio
  del PROPIO año (ej. 2003 ÷ tipo de cambio de cierre 2003), lo cual es inconsistente: el monto en
  pesos ya está en pesos del año siguiente. Se corrigió a dividir por el tipo de cambio de cierre
  de la fecha de reexpresión (2003→cierre 2004: $26,38; 2005→cierre 2006: $24,42; 2008→cierre
  2009: $19,637; 2010→cierre 2011: $19,903). Efecto: 2003 pasa de USD -3,8 a USD -4,2 millones;
  2005 de USD 8,3 a USD 8,2; 2008 de USD 13,2 a USD 16,3; 2010 de USD 19,0 a USD 19,2. El mismo
  criterio se aplicó por igual a los cuatro años, que caen en tres gobiernos distintos (Batlle,
  Vázquez I, Mujica), conforme pide la Regla 0.
- **`impuestos_pagados` (todos los años)**: el campo suma impuestos que ANP paga como contribuyente
  (Patrimonio, IRAE/IRIC, tasa del Tribunal de Cuentas) y retenciones que practica como agente de
  retención de terceros (IVA de proveedores, IRPF de funcionarios, IRNR de no residentes, Ley
  15.097 a favor de ANSE). El crítico señaló que en 2018 esto es 22,6% del total y en 2025, 32%
  (de los cuales $407,2 millones son la retención a favor de ANSE, que ni siquiera va a Rentas
  Generales). **No se separaron los dos conceptos en esta corrida** por falta de tiempo: haría
  falta rehacer el desglose año por año (Patrimonio+IRAE+tasa TdC vs. IVA+IRPF+IRNR+ANSE) para los
  21 años. El crítico pidió aplicar el mismo criterio a ANCAP, ANTEL, UTE y OSE si se cambia acá.
- **`transferencias_al_estado`, base legal**: se agregó el hito de 1990-12-28 (artículo 643, Ley
  16.170) con su cita; queda a criterio del editor si una oración de esto entra al `resumen`.
- **Definición de `deuda_financiera`**: cambia de año a año (2009-2012: solo pasivo no corriente;
  2013 en adelante: corriente + no corriente, "Préstamos y obligaciones" + "…LP"). Se dejó una
  oración corta en cada año explicándolo; el editor puede decidir si conviene una nota general en
  `resumen` en vez de repetirla.
- **`segmentos[]`**: son ingresos (proventos), no resultado; el balance no desagrega costos por
  puerto. Se agregó "— ingresos" al `nombre` de cada segmento para que el gráfico no se lea como
  "ganancia" por puerto. Se sacó el `concepto` repetido "en miles de pesos uruguayos" de cada
  segmento (contradice `unidad: millones`) y quedó solo en el primer segmento de cada año, con una
  oración.
- **Puerto "Sauce"**: se identificó como el puerto de Juan Lacaze (departamento de Colonia), con
  una fuente parlamentaria (pedido de informes del Ministerio de Transporte, que dice literalmente
  "puerto Sauce, de Juan Lacaze") sumada a la propia Nota 1.2 de los balances de ANP (que dice que
  ANP administra "el muelle comercial de Juan Lacaze" desde 1993). Se renombró en los 10 años que
  lo traían. Se agregaron hitos separados para Paysandú/Salto (2006), Sayago (2008, un puerto
  DISTINTO de Sauce, sobre la bahía de Montevideo) y La Paloma (2014), con sus decretos.
- **Monopolio, argumentos a favor**: el argumento reconstruido por el investigador (a partir de una
  columna histórica de El País que en realidad describe el monopolio con tono crítico) se
  reemplazó por una cita textual y reciente del presidente del sindicato Supra (Alejandro Díaz,
  julio de 2026) defendiendo explícitamente que "la ANP debe ejercer plenamente su papel como
  autoridad portuaria, con capacidad de planificación, regulación y control". Es la única fuente
  que se encontró en esta corrida defendiendo específicamente el diseño legal (administración
  reservada al Estado), no un episodio puntual. Se buscó también en el Diario de Sesiones de la
  Ley 16.246 (1991-1992) y en la interpelación de 2021 a Heber, sin encontrar una defensa
  parlamentaria centrada en el diseño administrativo de ANP en sí (la interpelación de 2021 discute
  la concesión de TCP a un privado, que es un tema relacionado pero distinto: la reserva de
  administración de ANP sobre sus propios puertos, no la concesión de un espacio a un tercero).
- **Katoen Natie / TCP 2021, los dos lados**: se agregaron dos fuentes primarias de la interpelación
  del 18 de agosto de 2021 al ministro Heber en el Senado (diario de sesiones, texto completo en
  `infolegislativa.parlamento.gub.uy/temporales/20210818s0024.pdf`, 688.604 caracteres): una del
  propio ministro defendiendo el acuerdo ("el gran acuerdo, el excelente acuerdo, el altamente
  beneficioso acuerdo") y una de la senadora que lo cuestiona ("No puede ser, repito, que un
  Gobierno haya dispuesto conceder a una multinacional extranjera, en régimen de monopolio, hasta
  el año 2081"). No se identificó el nombre de la senadora que habla en ese pasaje (no se buscó el
  encabezado de su intervención); si se quiere atribuir el nombre, hay que releer el diario de
  sesiones desde el inicio de esa intervención.

## cobertura_del_periodo
Sin cambios respecto de la corrida anterior en cuanto a qué años tienen balance propio, comparativo
o ninguno (ver `anios_sin_balance` y `anios_sin_segmentos` abajo). Lo que cambió es la calidad de
las citas: los 21 años de `impuestos_pagados` y los años con `deuda_financiera` en dos renglones o
`transferencias_al_estado` corregido ahora citan el texto exacto del balance, verificado con
`pnpm validar --red`.

## anios_sin_balance
2007: no se encontró ningún documento. 2016: tampoco (ni balance propio con capa de texto ni una
comparativa útil, porque el balance de 2017 -que lo traería como comparativa- también es un PDF
escaneado sin OCR).

## anios_sin_segmentos
2003, 2005, 2006, 2008, 2009, 2010, 2011, 2012, 2014, 2016, 2017, 2021 y 2024: solo se tiene el
total agregado de proventos en esos años (vía columna comparativa o balance sin la nota de
desagregación leída en el tramo consultado). 2013 se relevó con el encabezado real confirmado en
esta corrida (Nota "Ingresos desagregados por puerto y grupo de servicios", que dice explícitamente
"reexpresados al 31 de diciembre de 2013"; no se cargó ese dato de reexpresión en la ficha, solo se
usó para confirmar el orden de columnas).

## medios_faltantes
- **`anp`** (dominios `anp.com.uy` y `www.anp.com.uy`, canonizados a `www.anp.com.uy` en esta
  corrida — eran 36 usos con la forma sin `www.` y se unificaron a la forma dominante, 211 usos):
  publicador de todos los balances. `tipo: estatal`, sin `grupo` de medios, con `empresa: anp`
  apuntando a esta ficha, como `ancap` y `antel`. Ojo con `content/medios/anp-brasil.yaml` ya
  existente (Agência Nacional do Petróleo, Brasil): desambiguar el `nombre`.
- **`portalmaritimo-com-uy`** (portalmaritimo.com.uy): portal especializado en noticias marítimas y
  portuarias de Uruguay. Usado para la declaración de Alejandro Díaz (Supra) sobre el rol de
  autoridad portuaria de ANP. No se encontró información sobre su propiedad en esta corrida; el
  editor puede marcarlo `sin_datos` en `alineamiento` si no la encuentra tampoco.
- **`banco-mundial`** (Banco Mundial / World Bank): organismo financiero multilateral, análogo a
  `bid` que ya existe en `content/medios/`. Usado en `analisis.yaml` para el CPPI 2023.
  `tipo: estatal`, `grupo: banco-mundial` (no `estado-uruguayo`, mismo criterio que `bid`).
- **`fleitas`**: se descartó (no se creó el medio). Se sacó el argumento en contra que citaba
  `fleitas.com.uy` porque no es un argumento en contra vigente del monopolio (es una nota
  conmemorativa de los 25 años de la Ley de Puertos que celebra la apertura de 1992) y porque la
  fuente es una republicación sin nota original propia identificada (dice "FUENTE: EL OBSERVADOR" al
  pie, pero la nota original de abril de 2017 en elobservador.com.uy no se localizó en esta
  corrida).
- **`la-republica`**: ya existe en `content/medios/` (usado para el chequeo del CPPI en
  `analisis.yaml`).

## objeciones_al_brief
Ninguna nueva. La objeción de la corrida anterior sigue vigente: el brief original no distinguía
impuestos propios de retenciones de terceros dentro de `impuestos_pagados`, lo que produjo el
campo mixto que el crítico señaló; no se corrigió en esta segunda vuelta por alcance (ver
`para_el_editor`). Tampoco se investigaron casos judiciales, conforme a la regla general.
