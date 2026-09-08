# Crítica — corrida 2026-09-08-empresas-antel-serie-historica

Modelo: Opus 5 (1M context) — `claude-opus-5[1m]`. Corro como crítico, que es el único rol que la
regla 14 del mantenedor autoriza en Opus. El lote lo produjo `claude-sonnet-5` (`_investigacion`).
Lote: `inbox/empresas/antel/2026-09-08-serie-historica/`
Registros revisados: 1 ficha (`empresas.yaml`, `_slug: antel`) con 15 años nuevos en `finanzas[]`
(1997-2002, 2004-2012) sobre los 10 ya publicados (2015-2024). 74 entradas de fuente sobre 14
documentos distintos.

Documentos abiertos por mí con `pnpm fuente` en esta sesión (nueve, de años distintos, para cotejar
montos contra su cita y contra el criterio de 2015-2024):

1. `datos-financieros-y-operativos-2008.pdf` (resumen oficial 2004-2008, completo)
2. `datos-financieros-y-operativos-relevantes-2007.pdf` (resumen oficial 2003-2007, completo) — **no está en el lote**
3. `estados-contables-2012-2011-individuales.pdf` (Nota 5, posición en moneda extranjera)
4. `estados-financieros-consolidados-individuales-2014.pdf` (individual 2014/2013, patrimonio y flujo)
5. `.../estados_2002_y_2001/est_orig_ap_fon.pdf` (Wayback, completo, con la nota al pie)
6. `.../estados_contables/datos_relevantes.htm` (Wayback, resumen 1997-2000 en USD)
7. `.../estados_contables_nuevos/datos_relevantes.htm` (Wayback, resumen **1997-2001 en pesos**) — **no está en el lote**
8. `.../estados_contables_nuevos/notas.htm` (Wayback, notas del balance 2001) — **no está en el lote**
9. `archivo.presidencia.gub.uy/mem2000/info/ANTEL.htm` (Memoria Anual del gobierno, capítulo ANTEL)

Más el índice CDX de Wayback (`antel.com.uy/*`, `.../la_empresa/*`, `.../la_empresa/estados_contables*`,
y el dominio filtrado 1997-2003) y el índice institucional vivo de ANTEL.

---

## Objeciones por registro

### finanzas[2013] y finanzas[2014] — AUSENTES
- severidad: **bloquea**
- tipo: documento_previsible
- objecion: `notas.md` § `cobertura_del_periodo` declara 2013 "cargado (parcial)" y 2014 "cargado",
  con descripción de qué campos trae cada uno. En `empresas.yaml` **no existe ningún ítem con
  `anio: 2013` ni `anio: 2014`**: la serie salta de 2012 a 2015. La ficha resultante tendría un
  agujero de dos años en el medio, sin nota que lo explique, que es exactamente la queja del lector
  que originó la corrida (una serie que se corta y hace pensar que falta algo). Y el documento no
  es que no exista: el investigador lo abrió tres veces (`consultas.jsonl` 9, 10, 11) buscando
  "Resultado del ejercicio | Contribución a rentas generales | US$ 1 = | Impuesto al Valor Agregado",
  con resultado "ok, 7 ventanas".
- cita_de_contexto: del mismo PDF que el lote leyó
  (`https://www.antel.com.uy/documents/37544/378823/estados-financieros-consolidados-individuales-2014.pdf/a8807ded-bf25-10f5-6437-90e1231a821b?t=1755713599665`,
  Estado de Evolución del Patrimonio **Individual**, carácter ~87.500):
  "Saldos al 31 de diciembre de 2012 … Distribución de utilidades (*) … (1.867.704) … Resultado neto
  del ejercicio … 3.759.092 / Saldos al 31 de diciembre de 2013 … Distribución de utilidades (*) …
  (1.867.704) … Resultado neto del ejercicio … 1.929.396 / Saldos al 31 de diciembre de 2014";
  y "(*) Corresponden a contribuciones especiales a rentas generales." Es decir: resultado individual
  2013 = $ 3.759,1 M y 2014 = $ 1.929,4 M; contribución a Rentas Generales 2013 = 2014 = $ 1.867,7 M.
- accion_sugerida: cargar 2013 y 2014 antes de promover, con el mismo detalle que 2012 (resultado,
  deuda, transferencias por el renglón del flujo de efectivo, impuestos y segmentos como ingresos).
  Si el editor decide no cargarlos en esta corrida, corregir `cobertura_del_periodo`, que hoy afirma
  algo que el archivo no contiene.

### finanzas[2003] — declarado "sin documento"
- severidad: **bloquea**
- tipo: documento_previsible
- objecion: `notas.md` dice "2003 | sin documento", con el argumento de que los cinco PDF de
  `estados_2003_y_2002/` nunca se archivaron en Wayback (lo verifiqué: es cierto, el CDX de
  `la_empresa/estados_contables*` solo devuelve `estados_contables.htm` y
  `estados_contables_contenido.htm` para esa carpeta). Pero el año 2003 **está publicado hoy, en el
  sitio vivo de ANTEL**, en el mismo índice institucional del que salieron los otros documentos del
  lote: `datos-financieros-y-operativos-relevantes-2007.pdf`, la edición 2007 del mismo resumen
  oficial que el lote sí usó en su edición 2008. Cubre 2003-2007. Publicar una ficha que le dice al
  lector "de 2003 no hay documento público" cuando la empresa lo publica en su propia página es el
  error que esta corrida existía para reparar.
- cita_de_contexto:
  `https://www.antel.com.uy/documents/37544/378823/datos-financieros-y-operativos-relevantes-2007.pdf/bba0eb43-5124-d28f-0835-9d5da4512fc4?t=1755713577201`
  — "DATOS FINANCIEROS Y OPERATIVOS RELEVANTES / Expresados en moneda del 31 de diciembre de 2007 /
  En miles de Pesos uruguayos / 2007 2006 2005 2004 2003 … Resultado neto del ejercicio 2.152.516
  2.542.559 3.055.654 2.334.515 **1.698.873** … Contribuciones a rentas generales 2.078.913
  2.667.615 3.505.275 3.187.428 **3.416.213**"; y en la tabla en dólares "Resultado neto del
  ejercicio 100,1 89,7 100,8 72,0 **44,9** … Contribuciones a rentas generales (1) 84,5 93,7 114,5
  91,5 **87,6**".
- accion_sugerida: cargar 2003 (resultado $ 1.698,9 M / USD 44,9; transferencias $ 3.416,2 M /
  USD 87,6), con `nota` de una oración que diga que la cifra en pesos está en moneda de cierre de
  2007 y que no se localizó el balance propio. Y corregir la fila 2003 de `cobertura_del_periodo`.

### finanzas[1997] y finanzas[1998] — "solo disponible en dólares"
- severidad: **bloquea**
- tipo: documento_previsible
- objecion: las dos `nota` afirman que el único documento localizado es un resumen en dólares y que
  "no se localizó el balance completo en pesos de este año". Es falso: ANTEL publicó una segunda
  edición del mismo resumen, en pesos, cubriendo 1997-2001, y está archivada en Wayback en la
  carpeta hermana `estados_contables_nuevos/` (la que el lote sí usó para 1999-2001 es
  `estados_contables/`). Es el mismo tipo de error de método que el lote de ANCAP: se dio por
  agotado Wayback sin recorrer el índice CDX del directorio. Además esta tabla cierra el hueco de
  2001 en pesos con una base homogénea para los cinco años.
- cita_de_contexto:
  `https://web.archive.org/web/20020911135204/http://www.antel.com.uy:80/la_empresa/estados_contables_nuevos/datos_relevantes.htm`
  — "2001 2000 1999 1998 1997 … Utilidad neta del ejercicio 1.887.926 2.286.276 2.666.374
  **2.045.534** **1.508.117** … Contribuciones a rentas generales 2.128.285 3.518.136 1.871.927
  **1.185.469** **929.728**". La asignación de columnas se verifica sola: 1.887.926 es la utilidad
  del ejercicio propio de 2001 que ya cita el lote, y 2.202.902 (balance propio de 2000) × 1,0378
  (reexpresión 2001) = 2.286,2 ≈ 2.286.276.
- accion_sugerida: cargar 1997 y 1998 en pesos desde ese documento (moneda de cierre de 2001), y
  evaluar reemplazar todo el tramo 1997-2001 por esa tabla única, que deja los cinco años en la
  misma moneda —hoy 1999 está en moneda de 2000, 2000 en moneda de 2000 y 2001 en moneda de 2001—.

### finanzas[1997..2012] · la columna en pesos, como serie
- severidad: **bloquea**
- tipo: presentacion
- objecion: cada año trae el peso en la moneda de cierre de un año distinto: 1997-1998 (si se
  cargan) en moneda de 2001, 1999 en moneda de 2000, 2000 y 2001 en la propia, 2002 en la propia,
  2004-2007 en moneda de **2008**, 2008 en la propia, 2009 en moneda de 2010, 2010 en la propia,
  2011 en moneda de **2012** (ver objeción siguiente), 2012 en la propia, y 2015-2024 nominales sin
  reexpresión. Un gráfico de "resultado en pesos" sobre esa mezcla no mide nada, y en un tramo
  concreto **invierte el signo del cambio**: la contribución a Rentas Generales de 2001 vale
  $ 2.128,3 M en el balance propio de 2001 y $ 3.503,0 M en la columna comparativa del balance de
  2002 (factor 1,646; el mismo factor reaparece en todos los rubros de esa columna, así que es el
  índice de reexpresión de ese ejercicio y no un ajuste puntual — no es el IPC de 2002, que fue
  25,9 %, de modo que el índice usado no fue el mismo durante todo el período). El lote carga 2001 = 2.128,3 y 2002 = 3.020,2, con lo
  que la página dibujará una **suba** de 2001 a 2002 cuando en moneda comparable hubo una **baja**
  (3.503,0 → 3.020,2). Eso cae justo sobre un cambio de coyuntura y de gobierno, así que además de
  ser un error de medición es un problema de Regla 0: el mismo defecto favorecería o perjudicaría a
  quien tocara.
  La columna en dólares no tiene ese problema: es invariante entre ediciones (2004 = 72,0; 2005 =
  100,8; 2006 = 89,7; 2007 = 100,1 aparecen idénticas en el resumen 2007 y en el 2008, aunque los
  pesos difieren 6-7 %), porque el propio documento la construye sobre la moneda de cierre de cada
  año.
- cita_de_contexto: `.../est_orig_ap_fon.pdf` (Wayback 20031011225927id_): la columna 2001 del
  estado da "( 3.502.984)" para Contribución a Rentas Generales, contra "(2.128.285)" en el balance
  propio de 2001 (`.../estados_2001_y_2000/origen_y_aplicacion_de_fondos.htm`). Y el pie de la tabla
  oficial: "(*) Las cifras en millones de dólares estadounidenses surgen de convertir los saldos en
  pesos uruguayos expresados en moneda de cierre de cada uno de los años al tipo de cambio
  interbancario comprador vigente al cierre de dichos ejercicios."
- accion_sugerida: tres opciones, cualquiera sirve, ninguna es opcional: (a) que el gráfico de la
  serie larga sea el de dólares y el de pesos se corte en 2012, con una línea al pie que lo diga;
  (b) reexpresar toda la serie a una única base y decir cuál; (c) mantener pesos por año pero con
  `nota` de una oración por año que nombre la moneda de cierre, y sin unir los puntos con una línea
  antes de 2012. En cualquier caso, una oración fija en el pie del gráfico: "hasta 2011 ANTEL
  reexpresaba sus estados por inflación; cada año está en la moneda de cierre que indica su nota".

### finanzas[2007..2012].segmentos — resultado operativo contra ingresos
- severidad: **bloquea**
- tipo: presentacion
- objecion: en 2015-2024 `segmentos[].resultado` es el **ingreso** del segmento, y el `concepto`
  publicado lo dice: "Ingreso operativo del segmento; el balance no desagrega resultado (costo y
  ganancia) por segmento, solo ingreso". En 2007-2012 el lote pone en el mismo campo el **resultado
  operativo** (ingresos menos gastos). Son magnitudes de orden distinto: telefonía vale $ 1.996,3 M
  en 2007 y $ 5.219,4 M en 2015, y la página deja prender cada segmento sobre una sola serie. El
  lector va a ver un salto de escala en 2013 que no ocurrió. Además cambian los nombres (tres
  segmentos con "Telefonía (fija, pública y telegrafía)" agrupada contra seis segmentos separados),
  con lo que ni siquiera empalman por nombre.
  Lo tratable es que **el ingreso está en la misma cita**: no hay que buscar nada.
- cita_de_contexto: `.../estados-contables-2008-2007.pdf` — "Ejercicio 2007 $ miles Telefonía (*)
  Datos Telefonía Móvil Total **Ingresos Operativos 9.034.308 1.896.926 4.950.445 15.881.679**
  Gastos Operativos 7.037.977 1.417.422 3.509.603 11.965.002 Resultado Operativo 1.996.331 479.504
  1.440.842 3.916.677".
- accion_sugerida: usar el **ingreso** por segmento en 2007-2012 (misma magnitud que 2015-2024) y
  poner el resultado operativo en `segmentos[].nota` de cada año ("el balance de este año también
  publica gasto y resultado operativo por división: $ X millones"), que es información que 2015-2024
  no tiene y vale la pena conservar. Y una `nota` de año que diga que hasta 2012 la nota se llamaba
  "información por división" y agrupaba telefonía fija, pública y telegrafía en una línea.

### finanzas[2011] — "esta columna equivale a lo que habría mostrado el balance propio de 2011"
- severidad: corregir
- tipo: contexto_omitido
- objecion: el `concepto` de `resultado_ejercicio` razona que, como 2011 fue el último ejercicio
  reexpresado, la columna comparativa del balance de 2012 está en moneda de cierre de 2011. El
  propio documento que el lote cita muestra lo contrario. La Nota 5 da, para el 31/12/2011,
  US$ 52.602.393 equivalentes a $ 1.125.225 miles: un tipo de cambio implícito de 21,39, cuando el
  interbancario comprador al 31/12/2011 fue 19,898. 19,898 × 1,0748 (IPC 2012) = 21,39. O sea: la
  columna de 2011 **sí** está reexpresada a moneda de cierre de 2012, y los pesos de 2011 del lote
  ($ 3.096,1 M de resultado, $ 202,5 M de deuda, $ 1.929,2 M de transferencias y los tres segmentos)
  están un 7,5 % por encima de lo que diría el balance propio de 2011.
  Los dólares de 2011 quedan bien igual (dividir pesos de 2012 por el cambio implícito de 2012 da lo
  mismo que dividir pesos de 2011 por el cambio de 2011): el error está en la explicación y en la
  etiqueta de moneda, no en el número en dólares.
- cita_de_contexto:
  `https://www.antel.com.uy/documents/37544/378823/estados-contables-2012-2011-individuales.pdf/16d7d5ca-36bc-b455-aa51-86ffe0934db6?t=1755713596344`
  — "NOTA 5 - POSICION EN MONEDA EXTRANJERA … 31 de diciembre de 2012 / 31 de diciembre de 2011 /
  US$ / $ miles / US$ / $ miles / ACTIVO / Disponibilidades e Inversiones temporarias 61.964.744
  1.202.178 **52.602.393 1.125.225**".
- accion_sugerida: reescribir el `concepto` ("columna comparativa de 2011 del balance de 2012,
  reexpresada a moneda de cierre de 2012") y llevar esa oración a la `nota` del año, que es lo que
  la página muestra en la fila. El mismo aviso sirve para 1999 (moneda de 2000), 2007 (moneda de
  2008) y 2009 (moneda de 2010).

### finanzas[1997,1998,1999,2000,2004,2005,2006,2007,2008].transferencias_al_estado — `tipo_cambio: cierre`
- severidad: corregir
- tipo: contexto_omitido
- objecion: los nueve años declaran `tipo_cambio: cierre` para la cifra en dólares de las
  contribuciones a Rentas Generales. Los dos documentos oficiales de los que salen esas cifras dicen
  otra cosa, y lo dicen en una llamada al pie que el lote no recoge en ningún lado. En el resumen
  1997-2000, la fila lleva "(**)" y el pie aclara "Por su monto original en dólares
  estadounidenses"; en los resúmenes 2007 y 2008 lleva "(1)" y el pie dice "Efectivamente pagado
  convertido al tipo de cambio del momento del pago" — una convención distinta de la del resto de la
  tabla, que sí es de cierre. Se comprueba con la aritmética: 2008 da $ 1.808.851 miles y USD 89,6,
  un implícito de 20,2, mientras el cierre de 2008 fue 24,36.
- cita_de_contexto: `datos-financieros-y-operativos-2008.pdf` — "Contribuciones a rentas generales
  (1) 89,6 84,5 93,7 114,5 91,5 … (1) Efectivamente pagado convertido al tipo de cambio del momento
  del pago." Y `datos_relevantes.htm` (Wayback 20020110164139) — "Contribuciones a rentas generales
  (**) 273,0 145,0 100,0 80,0 … (**) Por su monto original en dólares estadounidenses."
- accion_sugerida: el esquema solo admite `cierre` o `promedio`, así que la salida honesta es sacar
  `tipo_cambio` de esos montos y poner la convención en `concepto` en una frase ("dólares al tipo de
  cambio del momento del pago, según la llamada (1) del propio resumen"). No inventar una tercera
  categoría ni dejar `cierre`, que es afirmar algo que la fuente niega.

### finanzas[1997,1998].fuentes.cita — fila de cuatro números sin encabezado de año
- severidad: corregir
- tipo: presentacion
- objecion: la cita es "Utilidad neta del ejercicio 176,2 202,1 166,4 127,9". No hay forma de que un
  lector sepa que 127,9 es 1997 y no 2000: la fila de años se perdió en la extracción y el lote no
  la cita. Lo mismo con "Contribuciones a rentas generales (**) 273,0 145,0 100,0 80,0". La
  asignación del lote es correcta (la verifiqué contra el balance propio de 2000: $ 2.202.902 miles
  / 12,52 ≈ 176 y $ 3.389.840 / 12,52 ≈ 271), pero la verificación la hice yo, no la puede hacer el
  lector con lo que la ficha le muestra.
- cita_de_contexto: la captura entera de `datos_relevantes.htm` empieza en "Total del activo" — el
  encabezado "2000 1999 1998 1997" no sobrevivió a la extracción de esa captura, pero **sí** está en
  la captura hermana: `.../estados_contables_nuevos/datos_relevantes.htm` arranca con "-\n2001\n2000\n1999\n1998\n1997".
- accion_sugerida: citar el tramo con el encabezado (la captura de `estados_contables_nuevos`
  sirve), o agregar en `nota` la comprobación cruzada en una oración. Mismo problema, mismo arreglo,
  en 2002 (`transferencias_al_estado` cita "(1.670.136) ( 39.930) (3.020.203) …", sin rótulos),
  2007 (resultado, deuda y transferencias comparten un bloque de números donde los rótulos quedaron
  corridos un lugar: quien siga la cita al pie de la letra leerá "Financieras corriente 2007 =
  1.010.110" en vez de 99.965) y 2009 (`transferencias` es un blob y el `concepto` admite que el
  número se identifica "por la aritmética del propio estado", que es una inferencia del sitio y hoy
  no se muestra como tal).

### finanzas[*].fuentes — 74 entradas para 14 documentos
- severidad: corregir
- tipo: presentacion
- objecion: los quince años nuevos repiten 74 veces catorce URLs. Es el caso que la lista de control
  nombra literalmente ("las fuentes repiten decenas de veces el mismo documento (un balance por año)
  cuando una línea las agrupa"). Al pie de la ficha el lector va a ver el mismo balance de 2008
  catorce veces.
- accion_sugerida: que la página agrupe por URL (una entrada por documento con los años que
  respalda), como ya hace con las entrevistas en las fichas de político. No hay que tocar el YAML
  para eso, pero sí hay que decidirlo antes de publicar.

### finanzas[*].concepto — párrafos donde va una frase
- severidad: corregir
- tipo: presentacion
- objecion: los `concepto` de 2015-2024 miden entre 83 y 180 caracteres. Los nuevos llegan a 592
  (1999), 473 (2011), 464 (2002), 387 y 365 (2009), 362 (2007), 347 (2004). `concepto` es lo que la
  página imprime en la celda; ahí no entra un párrafo con la metodología de conversión, la base de
  reexpresión y la salvedad de comparabilidad.
- accion_sugerida: dejar en `concepto` qué renglón es y de qué balance (una frase), y mover la
  salvedad de moneda a la `nota` del año, que la página muestra al pie de la fila. Hoy la `nota` de
  2007 solo habla de impuestos, la de 2009 de impuestos y dólares y la de 2011 de impuestos: en los
  tres, lo que el lector necesita saber (que el año viene de la comparativa del balance siguiente,
  en otra moneda) está enterrado en `concepto`.

### finanzas[1997..2012].capitalizaciones_del_estado — vacío en los quince años
- severidad: corregir
- tipo: contexto_omitido
- objecion: el brief lo pidió expresamente y no hay un solo `capitalizaciones_del_estado` en el
  archivo (tampoco en 2015-2024, pero ahí el `resumen` publicado suple: "No hay, en los estados
  contables de 2015 a 2024, ningún registro de que el Estado le haya puesto capital a ANTEL en ese
  período"). Para 1997-2012 no hay ni dato ni frase, y la ficha promete responder "qué puso el
  Estado". El dato es documentable con lo ya leído: el capital y los aportes no se mueven.
- cita_de_contexto: `estados-financieros-consolidados-individuales-2014.pdf`, Estado de Evolución
  del Patrimonio Individual — "Saldos al 31 de diciembre de 2012 50 480.481 … / Saldos al 31 de
  diciembre de 2013 50 480.481 … / Saldos al 31 de diciembre de 2014 50 480.481"; y
  `estados-contables-2008-2007.pdf` — "Capital … 390.730 40.193 … 390.730 40.193" (idéntico en 2008
  y 2007).
- accion_sugerida: una oración en el `resumen` extendido, o una `nota` en el primero y el último año
  del tramo, diciendo que en los estados contables leídos el capital no varía y no consta
  capitalización. Silencio y "no hay dato" no son lo mismo, y el lector no puede distinguirlos.

### resumen (campo publicado, no tocado por el lote)
- severidad: corregir
- tipo: presentacion
- objecion: el brief pidió no tocar `resumen`, y el lote obedeció. El efecto es que la ficha
  publicada quedaría diciendo dos cosas falsas sobre su propia tabla: "ANTEL tuvo resultado positivo
  los diez años del período que releva esta ficha (2015-2024)" cuando la tabla tendría 25 o 27 años,
  y "esta ficha usa siempre la cifra que publica el balance del año propio" cuando 1999, 2004, 2005,
  2006, 2007, 2009 y 2011 usan la comparativa del balance siguiente o un resumen posterior. La
  segunda es peor que la primera: es una regla metodológica declarada que el nuevo contenido rompe.
- accion_sugerida: el editor reescribe `resumen` en la misma corrección, o el registro no se
  promueve. Y la regla declarada tiene que decir qué se hace cuando el balance propio no existe.

### finanzas[2012].transferencias_al_estado — citada desde la nota narrativa
- severidad: corregir
- tipo: presentacion
- objecion: el criterio publicado es explícito y excluyente: "el renglón 'Contribución a Rentas
  Generales' del estado de flujos de efectivo (lo que efectivamente salió en caja ese ejercicio),
  **no** la nota narrativa 'Transferencias a Rentas Generales' del mismo balance". El registro de
  2012 cita justamente la nota narrativa. En 2012 los dos números coinciden ($ 1.867.704 miles), así
  que no hay error de cifra, pero el criterio queda desprolijo y el lector que compare no lo entiende.
  Lo mismo en 2008 (cita la nota "Transferencias a Rentas Generales") frente a 2007 y 2009, que citan
  el estado de origen y aplicación de fondos.
- cita_de_contexto: el estado de origen y aplicación del mismo balance de 2012 ya está citado en el
  registro de 2011 y trae el número de 2012: "Contribución a Rentas Generales … (1.867.704) …
  ( 1.929.185)".
- accion_sugerida: citar el mismo renglón que 2015-2024 en todos los años en que exista, y usar la
  nota narrativa solo cuando el estado de fondos no esté disponible, diciéndolo.

### finanzas[2001,2002].impuestos_pagados — la nota archivada no se leyó
- severidad: corregir
- tipo: documento_previsible
- objecion: el lote descarta los impuestos de 2001 y 2002 sin haber abierto las notas de esos
  balances. Las notas de 2002/2001 (`est_notas.pdf`, 316 KB) **están archivadas y devuelven 200** —
  el propio `notas.md` las nombra en `## hipotesis` como "no alcancé a leerlas". Las de 2001/2000
  (`estados_contables_nuevos/notas.htm`) las abrí yo y son legibles (44.058 caracteres).
  Lo que encontré ahí, y que el editor necesita saber, es que el cuadro "Impuestos pagos en calidad
  de contribuyente y de agente de retención" —el criterio que usa la ficha desde 2008— **no existe**
  en los balances de 2000 y 2001: hay notas por impuesto (IRIC, IP, IVA, ICOME, COFIS) pero no el
  cuadro sumable. O sea que la ausencia de `impuestos_pagados` antes de 2008 es correcta, pero por
  una razón que la ficha no dice y que hay que decir, porque si no el lector lee "cero impuestos".
- cita_de_contexto:
  `https://web.archive.org/web/20020911140127/http://www.antel.com.uy:80/la_empresa/estados_contables_nuevos/notas.htm`
  — "18.2 Impuesto al Patrimonio (IP) De acuerdo con la ley N° 16.736 del 5 de enero de 1996, ANTEL
  es sujeto pasivo de este impuesto a partir del 31 de diciembre de 1996. La provisión contabilizada
  en el ejercicio 2001 asciende a $ 92.515 miles ($ 94.444 miles en 2000)."
- accion_sugerida: abrir `est_notas.pdf` (Wayback `20031011212136`) antes de cerrar el lote —
  también resuelve el hito de 2002, ver más abajo— y agregar una `nota` en el primer año sin
  impuestos diciendo que el cuadro que la ficha suma aparece recién en el balance de 2008. Con eso,
  los huecos de `impuestos_pagados` en 2007, 2009 y 2011 (donde el balance propio es un escaneo)
  también quedan explicados y no como ceros.

### notas.md § anios_sin_segmentos — 2000 y 2001 sí tienen desagregación de ingresos
- severidad: corregir
- tipo: documento_previsible
- objecion: `anios_sin_segmentos` afirma que "ninguno de los documentos localizados para estos años
  trae información por segmento" y que la desagregación aparece "recién en el balance de 2007/2008".
  Las notas del balance de 2001, archivadas, traen ingresos por servicio para 2001 y 2000 — que es
  exactamente la magnitud que la ficha usa como `segmentos[].resultado` en 2015-2024 (ingreso, no
  resultado operativo).
- cita_de_contexto: mismas notas archivadas — "… 831.775 899.896 Participación Tráfico Internacional
  341.243 316.009 Transmisiones de radio y TV 5.257 5.414 Arrendamiento de transmisión digital 8.610
  6.245 RDSI 3.419 448 Acceso desde la red fija hacia celulares 257.843 261.132 …"
- accion_sugerida: leer esa nota entera y cargar `segmentos[]` de 2000 y 2001 si el corte por
  servicio es mapeable a los nombres que ya usa la ficha; si no lo es, decir en `nota` que la
  desagregación de esos años es por servicio y no por división, que es distinto de decir que no
  existe.

### fuentes del tramo 1997-1998 y 2003-2006 — resumen no auditado, sin decirlo
- severidad: corregir
- tipo: contexto_omitido
- objecion: los años 1997, 1998 y 2003-2006 descansan únicamente en "Datos Financieros y Operativos
  Relevantes", que es un resumen que ANTEL publica junto a sus estados contables pero que no es el
  estado contable ni lleva dictamen. El resto de la serie sí sale de estados contables auditados. La
  ficha no marca la diferencia, y el `medio` `antel` declara en `propiedad.descripcion` que "sus
  estados financieros auditados y las notas que los acompañan se usan como fuente documental
  primaria", lo que refuerza en el lector una garantía que esos seis años no tienen. Además el
  índice institucional publica los dictámenes (`dictamen-2007.pdf`, `dictamen-de-los-auditores-2008.pdf`,
  `dictamen-auditores-independientes-2009.pdf`) y el archivo tiene
  `estados_contables_nuevos/dictamen_auditores.htm`: nunca se cita ninguno.
- accion_sugerida: `nota` de una oración en esos años ("la cifra sale del resumen oficial que ANTEL
  publica junto al balance, no del estado contable auditado"), y citar el dictamen al menos una vez
  por período contable para que el lector sepa quién auditó.

### hitos[] — no se tocó, y hay dos hitos con fuente esperando
- severidad: corregir
- tipo: presentacion
- objecion: `notas.md` § `para_el_editor` propone tres hechos fechados y ninguno entró (el brief lo
  pedía así, el editor los suma). Dos son buenos y le dan al lector la clave para leer la tabla, que
  es justamente lo que un hito tiene que hacer:
  (a) **2002 — contribución a Rentas Generales pagada con valores públicos.** El pie del estado de
  origen y aplicación de fondos de 2002 remite a la Nota 17.2 para cuantificarla, y esa nota está en
  `est_notas.pdf`, archivado y accesible. Sin ese número, el hito es una afirmación sin monto.
  (b) **2011 — último ejercicio con reexpresión monetaria.** Es el hito que explica por qué las
  cifras de un mismo año cambian según en qué balance se las mire, y sin él la tabla es
  incomprensible. Tiene fuente directa.
  El tercero (transferencia nominal fija de $ 1.867.704 miles) todavía es hipótesis; lo confirmé
  para 2012, 2013 y 2014, pero no encontré la norma que fije la cifra, así que va a `hipotesis/`, no
  a `hitos[]`.
- cita_de_contexto: (a) `.../est_orig_ap_fon.pdf` — "(*) Dentro de las Contribuciones a Rentas
  Generales del ejercicio 2002 … una partida pendiente de pago por $ 8.137 miles por concepto de
  COFIS compras, la cual fue abonada en febrero de 2003. Adicionalmente y de acuerdo a lo presentado
  en la **Nota 17.2**, la parte de las Contribuciones realizadas con valores públicos que corresponde
  a la diferencia entre el valor nominal y el valor de mercado de los mismos y que coincide con la
  ganancia registrada por tal concepto, no constituye un movimiento de fondos." (el lote cita solo la
  primera oración de este pie). (b) `estados-financieros-consolidados-individuales-2014.pdf` —
  "u. Bases para la reexpresión monetaria hasta el 31 de diciembre de 2011. Los saldos en pesos
  uruguayos son corregidos por el Índice de Precios al Consumo (IPC) …" (ojo: esa es la base vigente
  al final del período; los factores que se leen en los balances de 2002 no son los del IPC, así que
  el hito debe decir "reexpresión por inflación" y no atribuir un único índice a los 38 años).
- accion_sugerida: sumar los dos hitos; el de 2002 después de leer `est_notas.pdf`
  (`https://web.archive.org/web/20031011212136/http://www.antel.com.uy:80/la_empresa/estados_contables/estados_2002_y_2001/est_notas.pdf`).

### finanzas[2001,2002,2009] — sin cifra en dólares
- severidad: corregir
- tipo: documento_previsible
- objecion: si la serie larga se va a leer en dólares (que es la única lectura comparable, ver la
  objeción sobre la columna en pesos), tres años quedan en blanco y el gráfico se corta dos veces.
  Para 2001 y 2002 no hay resumen oficial en dólares; para 2009 el lote ni lo intentó, pese a que
  para 2008, 2010, 2011 y 2012 dedujo el tipo de cambio de la nota de posición en moneda extranjera
  del propio balance (procedimiento correcto y reproducible: verifiqué 24,362 en 2008 y 19,401 en
  2012 contra las Notas 3 y 5). El balance de 2010 tiene esa misma nota, con columna 2009.
- accion_sugerida: (a) para 2009, deducir el cambio de la Nota 5 del balance de 2010, como en los
  otros años, o decir por qué no; (b) para 2001 y 2002, el documento previsible es el **BCU**, que
  publica la serie de cotizaciones (tipo de cambio interbancario comprador, cierre) en
  `bcu.gub.uy` → Estadísticas → Cotizaciones; es la misma convención que declara ANTEL en el pie de
  sus resúmenes, así que no se está inventando un criterio; (c) si el editor prefiere no convertir
  nada que el documento no convierta, entonces sacar los dólares deducidos de 2008, 2010, 2011 y
  2012 también, y quedarse solo con los que el resumen oficial publica. Cualquiera de las tres, pero
  la misma para todos los años.

### finanzas[2000].deuda_financiera — sin objeción
- severidad: aviso
- tipo: sin_objecion
- objecion: al contrario, es el modelo. El `concepto` detecta el conflicto entre el balance propio y
  la comparativa del balance siguiente ("La columna comparativa de 2000 que trae el balance de 2001
  da una cifra distinta (865,1 millones) por la reexpresión monetaria de un año a otro; se usa acá
  la cifra del balance propio de 2000"), elige la regla que la ficha ya declaraba y lo dice. La
  verifiqué: 833,5 × 1,0378 = 865,0. El problema es que ese mismo razonamiento no se aplicó a 1999,
  2007, 2009 y 2011, donde se usó la comparativa sin marcar que el propio existe o difiere.

### finanzas[2002].transferencias_al_estado — sin objeción sobre la cifra
- severidad: aviso
- tipo: sin_objecion
- objecion: cotejé $ 3.020,2 M contra el documento y cierra por aritmética interna del estado:
  (39.930) + (3.020.203) = (3.060.133) "Flujo neto de caja usado en actividades de financiamiento",
  y 1.423.740 − 926.465 = 497.275 "Fondos al final del ejercicio". La cifra es correcta; lo que
  objeto es la cita sin rótulos (arriba), no el número.

### finanzas[2008].impuestos_pagados — sin objeción
- severidad: aviso
- tipo: sin_objecion
- objecion: sumé las ocho partidas de la cita: 1.380.779 + 70.712 + 345.300 + 582.777 + 11.439 +
  1.895 + 19.213 + 6.424 = 2.418.539, que es el $ 2.418,5 M del registro. Y el criterio (contribuyente
  más agente de retención) es literalmente el mismo que 2015-2024, con la misma advertencia ya
  publicada de que es una suma que hace el sitio. Correcto.

### finanzas[2012] — sin objeción sobre las cifras
- severidad: aviso
- tipo: sin_objecion
- objecion: resultado ($ 4.421,6 M), deuda ($ 179,5 M = 18.522 + 160.933), transferencias
  ($ 1.867,7 M) e impuestos ($ 3.849,2 M) los verifiqué contra el balance individual de 2012, y el
  tipo de cambio implícito de 19,400 se reproduce de la Nota 5 (61.964.744 US$ ≡ $ 1.202.178 miles).
  Las objeciones sobre 2012 son de criterio de citación y de segmentos, no de monto.

### finanzas[1999,2000] — asignación de columnas verificada
- severidad: aviso
- tipo: sin_objecion
- objecion: las citas de 1999 y 2000 tampoco traen encabezado de año ("Utilidad neta del ejercicio -
  2.202.902 2.569.139"), pero la asignación es correcta y ahora hay una comprobación independiente:
  2.202.902 × 1,0378 = 2.286,2 = la columna 2000 de la tabla 1997-2001, y 2.569.139 × 1,0378 =
  2.666,4 = la columna 1999. Vale la misma acción sugerida que para 1997-1998: citar el encabezado.

---

## Objeciones al lote

**Cobertura del período, después de mis búsquedas.** La tabla `cobertura_del_periodo` es el
entregable central de esta corrida —es lo que la ficha le va a decir al lector sobre qué existe y
qué no— y tiene cuatro filas mal:

| Año | Dice el lote | Lo que encontré |
|---|---|---|
| 1997 | cargado (parcial), solo dólares | hay pesos: resumen 1997-2001 en Wayback |
| 1998 | cargado (parcial), solo dólares | ídem |
| 2003 | **sin documento** | publicado hoy en antel.com.uy: `datos-financieros-y-operativos-relevantes-2007.pdf` |
| 2013 | cargado (parcial) | **no está en el archivo** |
| 2014 | cargado | **no está en el archivo** |

Corregido eso, la serie queda completa desde 1997 hasta 2024 sin un solo hueco, que es un resultado
mucho mejor que el que el lote reporta.

**1974-1996.** Acá el lote tiene razón y lo confirmo con búsquedas propias. El índice CDX del
dominio `antel.com.uy` filtrado a 1997-2003 y a rótulos financieros no devuelve ninguna captura de
estados contables anterior a `20010817` (`estados_contables/notas.htm`, `resultados.htm`,
`situacion_patrimonial.htm`, `origen_aplicacion_fondos.htm`, todas del ejercicio 2000). No existe
material anterior en el sitio. Dos cosas que el editor debería incorporar:

- **Probé una ruta que el lote no probó y no sirve**, así que conviene anotarlo para que nadie la
  repita: `archivo.presidencia.gub.uy/mem2000/info/ANTEL.htm` existe (la Memoria Anual del gobierno
  tiene capítulo por ente) pero es narrativa: buscando "utilidad", "Rentas Generales" y "millones"
  no hay una sola coincidencia en sus 26.999 caracteres.
- **Lo que queda como previsible** para 1974-1996 no es un dataset sino papel: el dictamen del
  Tribunal de Cuentas sobre los estados contables de ANTEL, que por el artículo 211 de la
  Constitución va a la Asamblea General, y por lo tanto tiene entrada en `parlamento.gub.uy`
  (fichas de asunto y repartidos) y publicación en el Diario Oficial. `tcr.gub.uy` solo tiene en
  línea desde 2011, como reportó el lote. No lo llamo objeción bloqueante: nombrarlo alcanza, y la
  fila "sin documento" para 1974-1996 con las búsquedas hechas es honesta y suficiente.

**Simetría entre gobiernos.** Verificada, con un matiz que importa. La serie cruza cinco
presidencias y el nivel de detalle no sigue al color político sino a la disponibilidad documental:
2002 (Batlle) es el año con más detalle de todo el tramo viejo porque su balance quedó archivado
completo, y 2007/2011/2013 (Vázquez, Mujica, Mujica) son los más pobres porque sus PDF son escaneos.
Eso es aceptable. Lo que **no** es simétrico en efecto, aunque no lo sea en intención, es el
problema de la moneda: la reexpresión de 2002 (factor 1,646) hace que el gráfico en pesos muestre a
2002 subiendo cuando bajó, y hace que 2004-2007 (Batlle/Vázquez, en moneda de 2008) se vean
sistemáticamente más altos que 2000-2002 (en moneda propia). Ningún lector va a leer eso como un
artefacto contable. Por eso lo puse en `bloquea` y no en `aviso`.

Ninguna `nota` ni `concepto` del lote usa verbos de intención: revisé las quince. Bien.

**Dependencia de una sola fuente.** Las 74 entradas son todas `medio: antel`, `tipo:
documento_oficial`, `grupo: estado-uruguayo`. Para una ficha de empresa eso es lo correcto (el
estado contable auditado es la fuente primaria y no hay segunda), y la regla de dos grupos aplica a
`reportado`, no acá. Pero conviene tenerlo dicho: la ficha entera se apoya en lo que la empresa
publica de sí misma, y el único control externo disponible —el dictamen de los auditores
independientes, que ANTEL publica en el mismo índice— no se cita ni una vez en 25 años. Es una
mejora barata y sube el piso de toda la colección.

**Método (`aviso`).** `consultas.jsonl` registra tres lecturas con **WebFetch** (entradas 7, 8 y 41:
el índice institucional de ANTEL y el listado de Yumpu). Están marcadas "no citable" y ninguna
terminó en una `cita`, así que no contaminó la evidencia; pero la regla 2 dice `pnpm fuente` y nada
más, y el índice institucional se lee perfectamente con `pnpm fuente` (lo hice: es como encontré el
resumen de 2007 que cierra el hueco de 2003). Vale la pena que el investigador lo sepa, porque la
ruta prohibida es la que hizo perder el documento.

**Modelo (`aviso`).** El lote declara `_investigacion.modelo: claude-sonnet-5`; yo corro en Opus,
que es lo que la tabla de `CLAUDE.md` y la regla 14 asignan al crítico. No hay desvío que reportar,
pero lo digo porque el experimento en curso lo pide.

---

## Objeciones al brief

No hay violación de Regla 0. El brief pide la serie completa de una empresa pública "con el mismo
detalle y el mismo rigor que los años ya cargados", no selecciona años ni encuadra por partido, y
además invita explícitamente a objetar. Es un buen brief.

Tres defectos de diseño, ninguno de sesgo:

1. **"En dólares al tipo de cambio de cierre que declare el propio balance"** no tiene salida
   prevista para el caso —que es el caso normal antes de 2015— en que ningún balance lo declara.
   Lo confirmé: buscar "US\$ 1 =" en el balance de 2014 devuelve "sin coincidencias", y la línea
   "US$ 1 = $ 29,340 … y US$ 1 = $ 29,948" aparece recién en los balances desde 2015. El
   investigador improvisó dos soluciones distintas (deducir el cambio de la nota de moneda
   extranjera; tomar el dólar del resumen oficial) y dejó tres años sin ninguna. El brief tendría
   que haber dicho qué hacer, y la próxima versión debería decir: primero el dólar que publica el
   documento; si no hay, el cambio deducible de la nota de posición en moneda extranjera del mismo
   balance, citándola; si no hay ninguno, se deja vacío y se dice en `nota`.

2. **"Sin tocar `resumen` ni `hitos`"** garantiza que el registro salga inconsistente consigo mismo:
   el `resumen` publicado afirma que la ficha releva 2015-2024 y que usa siempre el balance del año
   propio, y las dos frases quedan falsas al agregar los quince años. Una corrida que extiende una
   serie tiene que arrastrar el resumen, o declararlo pendiente de forma explícita.

3. **No pidió el criterio de comparabilidad.** El brief pidió "en pesos tal como figuran", que es lo
   correcto para el registro, pero no pidió decidir cómo se presenta una serie de veinticinco años
   con quince bases monetarias distintas. Esa decisión se está tomando por omisión, y es la que más
   cambia lo que el lector va a entender.

**Versión simétrica, para que quede escrita.** Todo lo que se le exige acá a ANTEL —serie completa
hasta donde haya documento, la misma línea del estado de flujos para las transferencias, ingresos
por segmento, base monetaria declarada por año, dictamen del auditor citado, `capitalizaciones_del_estado`
resuelto aunque sea para decir que no hubo— se le exige igual a ANCAP, UTE, OSE y a cualquier otra
ficha de `content/empresas/`. Hoy ANTEL es la única con serie larga; si queda así, la comparación
entre empresas queda sesgada por cobertura, que es la forma más silenciosa de romper la Regla 0 en
esta colección. Sugiero que el editor deje anotado el pendiente para las otras fichas en la misma
corrección.

---

## Discrepancias

No corresponde `discrepancias.yaml` en este lote: no se leyó ni se citó una sola nota de prensa
(74/74 fuentes son `documento_oficial` de `antel`). No hay nada publicado por un medio que cotejar
contra un documento primario.

Sí registro acá, para el editor, una discrepancia **interna a la fuente oficial** que no va a
`content/discrepancias/` porque no involucra a ningún medio, pero que la ficha debería explicar: el
mismo hecho (contribución a Rentas Generales de 2001) figura como $ 2.128.285 miles en el balance de
2001 y como $ 3.502.984 miles en el balance de 2002, y el resultado de 2004 figura como $ 2.334.515
miles en el resumen de 2007 y como $ 2.484.612 miles en el de 2008. Las dos son consecuencia de la
reexpresión, no un error de nadie, y el `resumen` ya explica el fenómeno para 2015-2024: hay que
extenderlo.

---

## Cobertura

Ninguno. No hay registros de tono porque no se leyó ninguna nota de prensa en este lote: las catorce
URLs citadas son documentos contables de la propia ANTEL (diez en el sitio vivo o en Wayback del
sitio de ANTEL, cuatro PDF archivados del mismo sitio), todas con `tipo: documento_oficial` y
`medio: antel`. Los cinco documentos adicionales que abrí yo para cotejar tampoco son notas de
prensa (tres documentos de ANTEL, un índice CDX de Wayback y un capítulo de la Memoria Anual del
Poder Ejecutivo).

```yaml
[]
```
