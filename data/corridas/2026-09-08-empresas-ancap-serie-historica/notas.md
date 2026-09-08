# Notas — ANCAP, serie histórica de finanzas (corrida 2026-09-08-empresas-ancap-serie-historica)

**Segunda vuelta (2026-09-08, mismo día, después de la crítica de Opus).** Este archivo reemplaza
la versión anterior. Resolví los 2 bloqueantes y la mayor parte de los 11 "corregir"; el detalle de
qué se resolvió y qué no va en el informe del investigador, no acá. Corrida de datos (no de
declaraciones): no hay políticos, temas ni citas de discurso involucrados, así que varias secciones
estándar no aplican a este lote y quedan explícitas como "no aplica".

## candidatos_giro

No aplica: esta corrida solo carga `finanzas[]` de la ficha de una empresa pública; no hay
declaraciones ni posiciones de un político que comparar.

## hipotesis

- **1996-1999, `ancap.com.uy/public/bala1996.htm` a `bala1999.htm`**: el índice CDX de Wayback trae
  estas cuatro páginas archivadas (1996: 20010423155027; 1997: 20010302195617; 1998: 20010424045422;
  1999: 20010202135000), tituladas "Memoria y Balance [año]". Abrí `bala1999.htm`: es una página
  índice de 250 caracteres con enlaces a "Estado de Situación (en moneda nacional y dólares)",
  "Estado de Resultados (en moneda nacional y dólares)" y "Estado de Orígenes y Aplicación de
  Fondos", pero no encontré, en el mismo rango del índice CDX (1999-2001), las subpáginas de datos
  a las que esos enlaces apuntan (a diferencia de 2000, donde sí están archivadas
  `resultados2000dolar.htm`, `pasivo2000dolar.htm`, etc.). Es una hipótesis fuerte de que hay
  balances 1996-1999 con datos, pero no alcancé a localizar las páginas de datos mismas: falta
  seguir esta pista (probar `bala1996.htm`, `bala1997.htm`, `bala1998.htm` directamente, y CDX con
  otros patrones de nombre de archivo).
- **Ejercicio 2001**: no encontré ningún documento con datos. Existen tres páginas "puente" en
  Wayback (`activo2001pesos.htm`, `activo2001dolar.htm`, `estadoresultadosponegoc3112001.htm`) que
  enlazan a PDFs (`2001DictamenAuditoriaExterna.pdf`, `2001EstadosContablesU$S.pdf`,
  `2001ESTADORESULTADOSPORNEGOCIOU$S.pdf`), pero **ninguno de esos tres PDF fue crawleado por
  Wayback**: lo confirmé con tres consultas CDX puntuales sobre cada nombre de archivo exacto, las
  tres con 0 resultados. Es decir: el balance de 2001 existió y se publicó en el sitio de Ancap
  (la página puente demuestra que el enlace existió), pero el archivo con los números nunca quedó
  capturado por el crawler, y por eso no hay forma de leerlo hoy. `balancetes2001.htm` solo trae
  balancetes trimestrales (ENEMAR/ENEJUN/ENESET 2001), no el balance anual.
- **Ejercicio 2004**: no se encontró un balance individual de Ancap publicado como tal para el
  cierre 2004. Los cuatro montos que se cargan para 2004 (`resultado_ejercicio`,
  `transferencias_al_estado`, `impuestos_pagados`, `deuda_financiera`) provienen de la columna
  comparativa "31.12.2004" del balance individual de 2005. Es un documento oficial legítimo (el
  propio balance de Ancap lo publica como cifra de 2004), pero no es un balance auditado *de* 2004
  sino la cifra que otro balance declara para ese año, y esa columna está además reexpresada en
  moneda de cierre de 2005 (ver la `nota` del ítem 2004 en `empresas.yaml`, que ahora señala la base
  mixta: pesos de poder adquisitivo de fines de 2005 divididos por el dólar de cierre de 2004).
- **Reexpresión por inflación entre balances consecutivos**: los estados contables de Ancap
  reexpresaron la columna comparativa del año anterior en moneda de cierre del ejercicio corriente
  hasta el 31/12/2011 (por IPPN hasta 2008, por IPC desde entonces), y desde 2012 no reexpresan más.
  Se comprobó con las cifras: el balance de 2011 registra el resultado del ejercicio 2010 en
  $ 1.585.057.368, mientras que el balance propio de 2010 lo registra en $ 1.459.537.171 (mismo
  hecho económico, monedas de cierre distintas); en cambio el comparativo 2012 del balance 2013 es
  idéntico a la cifra propia del balance 2012. Por eso esta ficha usa siempre la cifra del balance
  **del propio año** (con las dos excepciones declaradas y documentadas: 2004 completo, y las
  transferencias de 2007, tomadas del balance de 2008). La nota de 2013 quedó corregida para decir
  esto con precisión (antes decía, incorrectamente, que la reexpresión seguía vigente en 2012-2013).
- **"Total impuestos" del mismo año difiere entre el balance propio y el comparativo del año
  siguiente**: pasa en 2006 (balance propio $ 9.101,1 M vs. comparativo del balance 2007
  $ 11.091,9 M) y en 2011 (balance propio $ 14.849,9 M vs. comparativo del balance 2012
  $ 10.979,9 M, 26% menos). No es reexpresión (el resultado del ejercicio
  figura idéntico en ambos balances en los dos casos): cambia qué partidas entran en la nota de
  impuestos de cada balance, no la unidad de medida. No encontré, en el texto de ningún balance, una
  explicación de por qué cambia; por eso el registro de 2011 cita ambas cifras sin atribuir causa
  (ya no dice "base de caja", que era una explicación mía sin respaldo documental). Queda como
  hipótesis abierta para quien quiera indagar más.
- **`archivo.presidencia.gub.uy/mem2000/info/ANCAP.htm`** (Memoria del Poder Ejecutivo, año 2000)
  trae, en el recuadro "ANCAP EN CIFRAS": *"Resultado operativo neto (antes de impuestos) al
  30/9/2000: US$ 66.067.769"*. No se cargó en `finanzas` porque es un corte a nueve meses, antes de
  impuestos, y no el resultado del ejercicio anual que informan los balances auditados: mezclarlo
  con la serie (resultado del ejercicio completo, después de impuestos, a diciembre) compararía
  cosas distintas. El ejercicio 2000 sí se cargó, pero con otra fuente (ver `cobertura_del_periodo`).

## casos_vistos

- `https://parlamento.gub.uy/camarasycomisiones/senadores/comisiones/1103` — Comisión Investigadora
  del Senado sobre la situación económica y financiera de Ancap entre 2000 y 2015 (creada el
  4/8/2015, informes finales de los cuatro partidos en 2016); según cobertura de prensa leída en la
  búsqueda (no abierta como fuente), derivó en una causa judicial. No investigado: el brief de esta
  corrida es sobre la serie histórica de balances, no sobre casos, y el rol no investiga casos salvo
  pedido explícito. La crítica confirmó, por su cuenta, que el informe final de esa comisión
  (520.423 caracteres) no trae una serie de resultados del ejercicio utilizable para esta ficha.

## verificacion_manual

Ninguna: todas las fuentes citadas en `empresas.yaml` se leyeron con `pnpm fuente` y tienen texto
extraíble (ningún PDF resultó ser un escaneo sin capa de texto), incluidos los balances 2000, 2002 y
2003 archivados en Wayback (`pnpm fuente` sí llega a `web.archive.org`, a diferencia de `WebFetch`).
Los intentos de lectura que fallaron en esta corrida fueron sobre PDFs que **nunca fueron archivados
por Wayback** (HTTP 404 al pedirlos, y CDX puntual con 0 resultados sobre el nombre exacto): el
dictamen de auditoría externa de 2001, los estados contables de 2001 en dólares y el estado de
resultados por negocio de 2001. No corresponde `verificacion: manual` en ningún registro porque no
se cita nada de esos PDF: son vías de búsqueda documentadas en `consultas.jsonl` que no dieron
resultado, no fuentes ilegibles.

## escaneos_sin_texto

Ninguno. Todos los balances y páginas de Ancap 2000-2014 usados en esta corrida (`ancap.com.uy` y
Wayback) tienen capa de texto completa y se leyeron con `pnpm fuente`.

## anios_sin_segmentos

Corregido respecto de la versión anterior: **2002-2014 sí tienen desagregado por división**, bajo el
rótulo "desagregado por división" (Nota 22 en los balances 2002-2004, luego renumerada) con
Energía/Alcoholes/Portland en 2002 y Energía/Portland desde 2003 (Alcoholes pasó a la esfera privada
a fines de 2002). Los balances 2002-2004 no traen una fila "Resultado" explícita por división (solo
"Ingresos" y "Costos" separados); desde el balance de 2005 sí aparece una fila "Resultado" explícita
por división, que es la que se cita literalmente en `segmentos[]` de 2005 en adelante. **Sin
segmentos**: 2000 (el Estado de Resultados en dólares no desagrega por división) y 2001 (sin
documento). Este desagregado por división (pesos, Energía/Portland/Alcoholes) es distinto del
desglose por línea de negocio en dólares que trae la ficha para 2016-2024 (Combustibles, Lubricantes,
Gas Natural, Pórtland…): ese formato aparece recién en la presentación del balance de 2016, no antes,
como ya señalaba la nota de 2015 de la ficha publicada. Cada año 2005-2014 de esta corrida lleva una
frase en su `nota` aclarando esto para que no se grafiquen mezclados sin decirlo.

## para_el_editor

Hechos fechados que aparecieron al leer los balances, que la ficha publicada no tiene en `hitos[]`
(candidatos, no cargados por mí — el rol no toca `hitos`):

- **1999-10-01**: Ancap forma AMBD S.A. (bebidas), sociedad 50%-50% con Morrison Bowmore Distillers
  (destilería escocesa, subsidiaria de Suntory). Fuente:
  `http://archivo.presidencia.gub.uy/mem2000/info/ANCAP.htm` (Memoria del Poder Ejecutivo 2000,
  medio `presidencia`, documento_oficial).
- **1999-12-01**: la Corporación Nacional para el Desarrollo y Ancap se asocian formando "Alcoholes
  del Uruguay S.A." — **ojo**: si la ficha publicada da otra fecha de creación de ALUR (posterior,
  alrededor de 2006, que es la que suele citarse en prensa), esto sugiere que hay dos sociedades
  distintas con nombres parecidos o una refundación, y conviene verificarlo con otra fuente antes de
  tratarlo como el mismo hito.
- **2007-05-17 / 2008-03-28**: capitalización del préstamo de Ancap a DUCSA por US$ 32.000.000,
  resuelta por el Directorio de Ancap el 17/5/2007 y aprobada por la Asamblea de DUCSA el 28/3/2008.
  Fuente: `https://www.ancap.com.uy/267/1/eecc-individual-2008.html`. Es Ancap capitalizando a su
  filial (plata que sale de Ancap), no `capitalizaciones_del_estado`.
- **2013-01-02**: el Estado, por intermedio del MEF, le presta a Ancap US$ 517.268.037 (Unidades
  Indexadas 3.940.699.680, 12 cuotas anuales) para cancelar deuda con PDVSA. Es deuda, no
  capitalización: por eso no está en `capitalizaciones_del_estado`, sino documentada en la `nota` de
  `deuda_financiera` de 2012 y 2013. Es el antecedente directo de la condonación de esta misma deuda
  por la Ley 19.368 en 2016, que la ficha ya tiene cargada como `capitalizaciones_del_estado` de
  2016: hoy la ficha muestra el desenlace (2016) sin el origen (2013), y con este hito quedaría el
  arco completo. Fuente: `https://www.ancap.com.uy/251/1/eecc-individual-2012.html` (Nota 29) y
  `https://www.ancap.com.uy/246/1/eecc-individual-2013.html` (Nota 21).
- **2012-12-26**: el Directorio de Ancap, según Resolución N.º 1590, acepta la oferta de Banco del
  Tesoro C.A. Banco Universal para adquirir, al precio de US$ 517.268.037, instrumentos de crédito
  representativos de la deuda de Ancap con PDVSA Petróleo S.A. (monto nominal US$ 828.398.319: la
  operación es una compra de esa deuda con descuento sobre el nominal, no una cancelación al valor
  nominal). El resultado financiero de esta operación ($ 1.228.079.198) está incluido en el
  resultado del ejercicio 2012. Fuente: `https://www.ancap.com.uy/251/1/eecc-individual-2012.html`
  (Nota 29).
- **2011-09-30**: contrato de compraventa de acciones por el que ANCSOL S.A. (subsidiaria de Ancap)
  y Petrouruguay S.A. venden parte del paquete accionario de Petrolera del Conosur S.A. a PDVSA
  Argentina S.A. Fuente: `https://www.ancap.com.uy/251/1/eecc-individual-2012.html` (Nota 28.1, que
  refiere al contrato).
- **2014**: Ancap adopta Normas Internacionales de Información Financiera (NIIF) por primera vez
  (balance individual del ejercicio 2014). Es el hito que explica el salto de criterio entre el
  resultado de 2013 que carga esta ficha ($ (3.601.045.064), balance propio de 2013) y el mismo
  ejercicio 2013 reexpuesto en el balance de 2014 bajo NIIF ($ (3.391.440.836), $ 209,6 millones de
  diferencia). Fuente: `https://www.ancap.com.uy/innovaportal/file/242/1/ancap-31-12-14--individual.pdf`.
- **Aclaración, no hito**: la nota "Aporte a cuenta de futuras capitalizaciones y transformación
  patrimonial de acuerdo a las exigencias de la ley 18.083" del balance 2008 **no** es una
  capitalización del Estado a Ancap: es un aporte irrevocable de capital de US$ 20.000.000 que el
  propio Ancap, como único accionista, debía a su subsidiaria ANCSOL S.A. (S.A.F.I.) para
  transformarla de Sociedad Anónima de Inversión a Sociedad Anónima Ordinaria. Ancap capitalizando a
  una subsidiaria, no el Estado capitalizando a Ancap. Dejo esto para que el editor no lo confunda
  con un hito de capitalización pública: no corresponde cargarlo como tal.

## para_el_editor · corrección de concepto pendiente en la ficha publicada

El `concepto` de `impuestos_pagados` en los diez años nuevos (2004-2013) decía "no incluye el IRAE
propio de Ancap ni transferencias a Rentas Generales", y eso es **falso**: la nota de impuestos
pagados sí incluye el impuesto a la renta propio de Ancap (IRIC hasta 2006, IRAE desde 2007) y el
Impuesto al Patrimonio; lo único que no incluye son las versiones a Rentas Generales. Ya corregí el
`concepto` en los diez años nuevos de este lote. **El mismo error está en la ficha publicada**:
`content/empresas/ancap.yaml` tiene el `concepto` de 2015-2024 con la misma frase equivocada, y el
`resumen` la repite ("sin contar el impuesto a la renta propio de ANCAP"). No lo toqué (no me
corresponde tocar `content/` ni el tramo 2015-2024 de este lote), pero debería salir corregido junto
con esta corrida, por `content/correcciones/` con tipo `presentacion` o `cotejo_con_primaria`, para
no dejar una asimetría entre gobiernos (correcto en 2004-2013, Batlle/Vázquez/Mujica; incorrecto en
2015-2024, Vázquez II/Lacalle Pou/Orsi).

## objeciones_al_brief

Ninguna. El brief pide extender la serie histórica hacia atrás con el mismo rigor para todos los
años disponibles, sin seleccionar ni omitir según ningún criterio ideológico o partidario — es
consistente con la Regla 0. La corrección posterior del crítico (Opus) tampoco pidió nada asimétrico:
pidió el mismo rigor que ya se aplicaba, aplicado también a 2000-2003, y señaló errores de hecho
(el `concepto` de impuestos) que valen igual para cualquier año o gobierno.

## cobertura_del_periodo

Tabla año por año, 1931-2014 (2015-2024 ya estaban cargados en la ficha publicada y no se tocaron).
Búsquedas generales hechas para 1931-1999 (más allá de las específicas por año que lista
`consultas.jsonl`): sección "Estados Contables" y "Memorias" de `ancap.com.uy`, Tribunal de Cuentas
(`tcr.gub.uy`), Auditoría Interna de la Nación (`ain.gub.uy`), Bolsa de Valores de Montevideo
(`bvm.com.uy`), `catalogodatos.gub.uy`, Portal de Transparencia Presupuestaria (OPP), Rendición de
Cuentas del MEF, **índice CDX de Wayback sobre todo el dominio `ancap.com.uy` 1999-2004** (la vía que
en la corrida anterior no se había probado con la herramienta correcta: `pnpm fuente` sí llega a
`web.archive.org`), `archivo.presidencia.gub.uy` (Memoria del Poder Ejecutivo por año) y el Diario
Oficial digitalizado de IMPO (desde 1905, sin buscador que permita ubicar balances de Ancap
indexados).

| Año | Estado | Detalle |
|---|---|---|
| 1931 | sin documento público encontrado | Año de creación (Ley 8.764, 15/10/1931), ya citada en `creacion` de la ficha; no es un balance. |
| 1932-1995 | sin documento público encontrado en estas vías | Búsquedas generales listadas arriba; ningún balance ni memoria digitalizados de este tramo. |
| 1996-1999 | pista sin confirmar | El índice CDX de Wayback tiene 4 páginas "Memoria y Balance [año]" (`ancap.com.uy/public/bala1996.htm` a `bala1999.htm`) con enlaces a Estado de Situación y Estado de Resultados; no localicé las subpáginas de datos en esta corrida (ver `## hipotesis`). Queda para una vuelta siguiente. |
| 2000 | **cargado** | `resultado_ejercicio` y `deuda_financiera`, publicados por Ancap directamente en dólares (`Balance/resultados2000dolar.htm` y `Balance/pasivo2000dolar.htm`, archivados en Wayback 2001-2002). Sin `impuestos_pagados` ni `transferencias_al_estado`: el formato de esa nota aparece recién desde el balance de 2002. Sin segmentos. |
| 2001 | **publicado, pero el PDF nunca fue archivado por Wayback** | Tres páginas puente (`activo2001pesos.htm`, `activo2001dolar.htm`, `estadoresultadosponegoc3112001.htm`) demuestran que el balance se publicó, pero los tres PDF a los que enlazan (`2001DictamenAuditoriaExterna.pdf`, `2001EstadosContablesU$S.pdf`, `2001ESTADORESULTADOSPORNEGOCIOU$S.pdf`) dan HTTP 404 y 0 resultados en CDX puntual: no están archivados. No se puede cargar sin inventar cifras. |
| 2002 | **cargado** | Balance auditado por KPMG, archivado en Wayback: `http://web.archive.org/web/20031011232007id_/http://www.ancap.com.uy/Balance/Balance31-12-2002.pdf`. Con segmentos (Energía/Alcoholes/Portland). |
| 2003 | **cargado** | Balance auditado por KPMG, archivado en Wayback: `http://web.archive.org/web/20041110084152id_/http://www.ancap.com.uy/Balance/Balance%2031-12-2003.pdf`. Con segmentos (Energía/Portland; Alcoholes pasó a la esfera privada a fines de 2002). |
| 2004 | cargado (columna comparativa, con salvedad de base mixta en la `nota`) | Sin balance propio de 2004 publicado; los montos son la columna "31.12.2004" del balance individual de 2005. Sin segmentos (el balance de 2005 no trae división por año comparativo). |
| 2005 | cargado, con segmentos | Balance individual propio, `https://www.ancap.com.uy/276/1/eecc-individual-2005.html`. |
| 2006 | cargado, con segmentos | Balance individual propio, `https://www.ancap.com.uy/273/1/eecc-individual-2006.html`. |
| 2007 | cargado, con segmentos | Balance individual propio, `https://www.ancap.com.uy/269/1/eecc-individual-2007.html`. |
| 2008 | cargado, con segmentos | Balance individual propio, `https://www.ancap.com.uy/267/1/eecc-individual-2008.html`. |
| 2009 | cargado, con segmentos | Balance individual propio, `https://www.ancap.com.uy/263/1/eecc-individual-2009.html`. |
| 2010 | cargado, con segmentos | Balance individual propio, `https://www.ancap.com.uy/259/1/eecc-individual-2010.html`. |
| 2011 | cargado, con segmentos | Balance individual propio, `https://www.ancap.com.uy/255/1/eecc-individual-2011.html`. |
| 2012 | cargado, con segmentos | Balance individual propio, `https://www.ancap.com.uy/251/1/eecc-individual-2012.html`. |
| 2013 | cargado, con segmentos | Balance individual propio, `https://www.ancap.com.uy/246/1/eecc-individual-2013.html`. |
| 2014 | **cargado** (antes solo tenía `resultado_ejercicio`, ahora completo) | Balance individual propio, `https://www.ancap.com.uy/innovaportal/file/242/1/ancap-31-12-14--individual.pdf`. Con segmentos. Primer ejercicio bajo NIIF. |

Resumen: 14 ejercicios con datos en el tramo 2000-2014 (2001 sin documento archivado; 1996-1999
pista sin confirmar; 1932-1995 y 1931 sin documento en estas vías), 11 de ellos con segmentos por
división (2002-2014, salvo 2004). 0 escaneos sin texto.
