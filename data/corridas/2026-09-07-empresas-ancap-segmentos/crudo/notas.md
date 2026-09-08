# Notas — ANCAP, segmentos y precios vs. paridad (2026-09-07)

## objecion_de_hecho_al_brief

El brief afirma: "Los Estados Financieros Individuales de ANCAP traen información por segmento de
negocio (combustibles/refinación, portland, alcoholes y otros...): leé la nota de 'información por
segmentos'". Esto no es así: revisé los Estados Financieros **Individuales** de 2015 y 2024, y los
**Consolidados** de 2019, y ninguno trae una nota de "información por segmentos" al estilo NIIF 8.
Lo único que aparece en esos documentos es una mención puntual de "segmento de negocio Pórtland" (y,
en el consolidado, también "Caña, Cereales") en la nota de deterioro de activos (NIC 36) — no una
tabla de resultado por segmento.

Lo que sí existe, y es lo que uso para poblar `segmentos[]`, es una tabla o gráfico "RESULTADO
OPERATIVO POR LÍNEA DE NEGOCIO" / "POR UNIDAD DE NEGOCIO" en las presentaciones de resultados que
ANCAP publica en su sitio junto con (pero separadas de) los estados contables auditados
(`ancap.com.uy`, sección "Estados Contables", sub-página "Presentación de los Estados
Contables"/"Resultados ANCAP Ejercicio <año>"). Son documentos oficiales de ANCAP (`tipo:
documento_oficial`, `medio: ancap`), no la nota de un estado contable auditado. Esto no es una
objeción de Regla 0 (no hay asimetría entre partidos ni personas): es una corrección de hecho sobre
dónde vive el dato, que dejo documentada para que el editor no repita la búsqueda equivocada.

## metodo_segmentos

- **2016-2019**: la tabla "RESULTADOS POR LÍNEA DE NEGOCIO(S)" es literal, con columnas Combustibles
  / Lubricantes / Gas Natural / Portland / Total y la fila "Resultado Operativo" en pesos uruguayos
  corrientes. Cada año se leyó de la presentación de ese ejercicio o de la comparativa del ejercicio
  siguiente (que repite el año anterior); los valores de 2018 aparecen en dos documentos distintos
  (presentación de 2018 y presentación de 2019) con cifras idénticas, lo que valida la lectura.
  Conversión a USD con el tipo de cambio de cierre ya usado en el resto de la ficha para cada año
  (2016: 29,34; 2017: 28,81; 2018: 32,41; 2019: 37,31 $/USD).
- **2020-2024**: a partir de 2020 ANCAP dejó de publicar la tabla y pasó a un gráfico de barras
  "RESULTADO OPERATIVO POR UNIDAD DE NEGOCIO" (2020, 2022, 2023, 2024) o un gráfico en cascada
  ("waterfall", 2021) con las mismas categorías. La extracción de texto de un PDF con un gráfico no
  preserva la posición visual de cada barra: los números salen en una lista, sin el rótulo pegado a
  cada uno. Para asignar cada número a su categoría usé el hecho de que, en 2020, 2022, 2023 y 2024,
  el documento da en **prosa** (no en el gráfico) el resultado total y, en 2020 y 2024, también el
  aporte combinado de Lubricantes+Gas Natural o de Portland; con eso pude resolver la ecuación
  "Combustibles + Lubricantes + Gas Natural + Portland = Total" de forma exacta (a la décima de
  millón) en los cinco años, lo que da confianza en que el orden de lectura de la lista es el mismo
  que el de las etiquetas.
- **2015**: no encontré ninguna tabla ni gráfico de resultado por línea de negocio en la presentación
  de ese ejercicio (comparativo 2014-2015); solo la mención de deterioro contable de Portland y de
  caña/cereales. Lo dejé en la `nota` del año 2015 y acá abajo, en `anios_sin_segmentos`.
- Todas las cifras son **resultado operativo** (antes de resultado financiero, participación en
  vinculadas e impuesto a la renta), no resultado del ejercicio (neto): por eso el total de segmentos
  de un año no coincide con `finanzas[año].resultado_ejercicio`, que sí está después de esas partidas.
  Esto ya está anotado en la ficha para otros campos (p. ej. transferencias vs. impuestos) y sigue el
  mismo criterio.

## anios_sin_segmentos

- **2015**: sin desglose de resultado por línea de negocio en la presentación de balance del ejercicio
  (ver `metodo_segmentos`). El formato "RESULTADOS POR LÍNEA DE NEGOCIO(S)" aparece por primera vez en
  la presentación del ejercicio 2016.

## metodo (precios_vs_paridad.series)

- **Fuente primaria 2015-2019**: planilla oficial de URSEA "Series PPI vs PE". En esta segunda vuelta
  se releyó con `pnpm fuente` directamente (hoy sí la lee como texto, filas separadas por tabulador;
  no hizo falta `--forzar`, ya estaba en el corpus con 75.054 caracteres). La hoja "Series " trae una
  fila por mes, desde enero de 2002, con columnas de "Precios medios al consumidor final... (Fuente
  MIEM/DNE)" (el precio que fija el Poder Ejecutivo) y "Precios de paridad de importación...
  calculados por la URSEA", para Gasolina Premium 97, Gasolina Súper 95, Gas oil, Fuel oil pesado,
  Supergás y Propano industrial. **La serie termina en mayo de 2019** (no hay actualización posterior
  en este archivo pese a que la página que lo aloja dice "desde el año 2002 a la fecha"). Cada valor
  anual de `precio_venta` y `paridad` es el promedio simple de los valores mensuales de Gasolina
  Súper 95 y Gas oil disponibles ese año (12/12 para 2015-2018; 5/12, enero-mayo, para 2019).
- **Quiebre metodológico de diciembre de 2017**: la propia planilla trae, al pie, dos notas al pie
  literales: "(7) Hasta este mes se utilizó la metodología aprobada en Julio de 2010. Los PPI no
  incluyen margen de comercialización." y "(8) A partir de este mes se calculan los PPI con la
  metodología vigente aprobada por el Directorio en noviembre de 2017." (filas "2017-Nov (7)" y
  "2017-Dic (8)"). Se agregó una oración a `precios_vs_paridad.descripcion` con este dato. **No se
  pudo poner como `nota` en los ítems de `series[]`**: el esquema `SerieParidad`
  (`src/schemas/empresa.ts`) es `.strict()` y no tiene campo `nota` (solo lo tienen `Anio` y el
  segmento dentro de `Anio`); `pnpm validar` rechazó el intento con "Campo(s) no reconocido(s): nota."
  Quede anotado para quien mantenga el esquema: si se quiere la salvedad pegada al punto exacto del
  gráfico (y no solo en la descripción general), `SerieParidad` necesitaría un campo `nota` opcional.
- **Citas de la planilla**: en la primera vuelta, las 20 fuentes de los 10 ítems de 2015-2019 repetían
  dos citas de **encabezado de columna** (sin ningún número) y llevaban `verificacion: manual` porque
  en ese momento `pnpm fuente` no leía el xlsx. En esta segunda vuelta se reemplazó cada una por
  **una** fuente con la fila literal del primer mes del período (enero de cada año), que alcanza para
  ubicar las columnas y que valida "exacta" (similitud 1.00) en `pnpm validar --red`. Se quitó
  `verificacion: manual` de las 10 fuentes.
- **Intento de extender la serie a 2019 completo y 2020 (enero-setiembre)**: no se pudo. Ver
  `## intento_fallido_extension_serie_ursea` abajo.
- **2019 (junio) a 2024**: sigue sin cobertura de precio-vs-PPI mes a mes en la misma unidad (ver
  intento fallido abajo). Para este tramo la ficha usa los `diferencia_usd_millones` que el CED
  (2010-2014 y 2015-2019, por producto) y la propia ANCAP (2024, fósil combinado y supergás) publican
  como cifra agregada.
- **Convención de signo**: en esta ficha, `diferencia_usd_millones` positivo significa que el
  consumidor pagó por encima del PPI (sobreprecio); negativo significa que pagó por debajo (subsidio).
  Esto no está definido por el esquema, así que lo dejo explícito acá para que el editor lo mantenga
  igual si agrega más períodos.
- **descripcion (reescrita en esta segunda vuelta)**: la versión de la primera vuelta tenía solo dos
  oraciones (qué es el PPI y qué mide la diferencia) y había perdido, respecto de la versión
  publicada, la salvedad de que el cálculo del PPI está discutido (incluida ANCAP) y la existencia del
  "factor X" desde agosto de 2021. Se reescribió con cinco oraciones: qué es el PPI, qué mide la
  diferencia, que el cálculo está discutido (con la cita de la diaria ya presente en `fuentes[]`, re-
  verificada en esta sesión), qué es el factor X y desde cuándo (con una fuente primaria nueva:
  "Reconocimiento a partir de agosto de factor X= + 2,97$/lt en gasolinas y gasoil", presentación de
  resultados 2021 de ANCAP, agregada a `fuentes[]` de la ficha), y el quiebre metodológico de
  diciembre de 2017 (ver arriba). El editor puede recortar si lo considera necesario para la página,
  pero el punto de la crítica era que dos oraciones no alcanzan a sostener las cuatro ideas.

## intento_fallido_extension_serie_ursea

El crítico (O-9) señaló que el dataset `ursea-ppi_vs_pe_v2` de catalogodatos.gub.uy tiene un recurso
llamado "PPI al consumidor final" (CSV id `7fb4c8d9-8db4-41bf-aac0-254368269d24`, también en xlsx id
`e31b3957-ca94-41d9-82f4-28a85c96bf2c`) cuya **descripción** dice que cubre 01/2002 a 09/2020 con las
dos variables que necesitamos (PPI al consumidor final y precios del Poder Ejecutivo). Fui a buscarlo
en el orden pedido y **el hallazgo es que la descripción del catálogo no corresponde al contenido real
del archivo**:

- Bajé el CSV (`.../resource/7fb4c8d9-8db4-41bf-aac0-254368269d24/download/ppi_pe.csv`) y el XLSX
  (`.../resource/e31b3957-ca94-41d9-82f4-28a85c96bf2c/download/ppi_pe.xlsx`) con `pnpm fuente`. Ambos
  contienen, en realidad, el **mismo desglose de costos "ex-planta de distribución"** que la corrida
  anterior ya había identificado y descartado bajo el nombre `ppi_pe.csv` (columnas
  `precio_fob_ajustado`, `costo_muelle_la_teja`, `subtotal_2_precio_ex_planta_distribucion`, etc.),
  con filas desde **2020-10-25** hasta **2026-08-25** (es decir, un dataset "vivo" que se sigue
  actualizando, no el histórico 2002-2020 que promete la ficha del catálogo). Confirmé que no hay
  ninguna fila anterior a octubre de 2020 buscando "2019-01", "2002-01" y "2019-05": cero coincidencias
  en 72.038 caracteres.
  - La captura de Wayback del XLSX que trae el corpus es de 2022-09-12 y ya tiene esta misma estructura
    de columnas de costo, así que no es un cambio reciente del archivo: la descripción del catálogo
    parece estar desactualizada desde hace años, no ser un error nuevo.
- Volví a bajar la página completa del dataset (`https://catalogodatos.gub.uy/dataset/ursea-ppi_vs_pe_v2`,
  9 recursos en total) para revisar si había un tercer recurso distinto: los otros 7 son variantes
  (json/xml/csv/xlsx, con y sin fuel oil de bajo azufre) del mismo desglose "Precios hasta planta de
  distribución", explícitamente descrito como tal. No hay ningún recurso adicional que sea la serie
  histórica de precio al consumidor final que se necesita.
- Volví a la página de URSEA (`.../politicas-y-gestion/paridad-precios-importacion`) para ver si
  enlazaba a algún archivo distinto del xlsx ya usado: solo enlaza el mismo `Series_PPI_VS_PE_0.xlsx`
  (que corta en mayo de 2019), un PDF de gráficos de la misma fecha (julio de 2019, por lo tanto misma
  cobertura) y la metodología. El enlace de texto "Acceso a los Informes PPI" no trae URL en el HTML
  extraído (posible limitación de la extracción, no verificada más a fondo).
- Busqué en la web informes mensuales de URSEA ("Informe PPI") y abrí uno reciente
  (`Informe%20PPI_0.pdf`, correspondiente a enero-febrero de 2026): son informes de **un solo mes**
  cada uno (PPI del período, sin serie histórica ni comparación directa con el precio de venta al
  público en el mismo documento), así que no sirven para reconstruir una serie mensual 2019-2020 sin
  descargar y abrir decenas de informes individuales, que excede el alcance de esta corrida.

**Conclusión:** no encontré, en esta sesión, un documento oficial que extienda la comparación
precio-de-venta-vs-PPI más allá de mayo de 2019 en la misma unidad. La objeción de fondo de O-9 (que
el corte de la serie cae justo en un cambio de gobierno y hay que probar que es un límite del archivo
y no de la búsqueda) sigue siendo válida como *criterio* — pero, tras revisar el recurso concreto que
la crítica señaló como solución, ese recurso no contiene lo que su propia descripción promete. No
extendí la serie con datos que no pude verificar. Si el mantenedor quiere insistir, el único camino
que no probé es pedir acceso a información pública (ley 18.381) a URSEA por la serie completa, o
descargar y sumar manualmente ~15 informes PPI mensuales de 2019-2020 (no lo hice por tiempo).

## para_el_editor

Puntos de la crítica que son de criterio, no de investigación, con la fuente ya leída para que no haga
falta salir a buscar:

- **O-1 (bloquea, presentación)**: la página (`src/pages/empresas/[slug].astro`, según cita el
  crítico) imprime como texto fijo que los segmentos salen de "la nota de información por segmentos de
  los estados contables". Eso es falso para ANCAP (ver `objecion_de_hecho_al_brief`): el dato sale de
  las **presentaciones de resultados** que ANCAP publica junto a (pero separadas de) los estados
  contables auditados. Esto es un cambio de código de la página, no del registro; lo dejo señalado
  para que el editor lo pida antes de promover.
- **O-4 (corregir, presentación)**: el gráfico de la página muestra las series de segmentos junto a
  "Resultado del ejercicio", pero los segmentos son resultado **operativo** (antes de resultado
  financiero, vinculadas e impuesto a la renta) y no suman el resultado del ejercicio del mismo año.
  Esto ya está explicado en `metodo_segmentos` arriba y es una oración que falta en el bloque de
  método de la página, no un cambio de datos.
- **O-5 (corregir, contexto omitido) — intenté resolverlo y no pude con confianza suficiente.** El
  crítico pide agregar el segmento "Resultado Monopólico" que ANCAP publica en una lámina separada
  ("RESULTADOS POR MERCADO") para 2021, 2022 y 2023. Abrí las tres presentaciones con `pnpm fuente` y
  descubrí que la propia cita de O-5 mezcla números de **dos láminas distintas** del mismo documento
  (la 8, "RESULTADOS POR MERCADO", y la 9, "RESULTADO OPERATIVO POR UNIDAD DE NEGOCIO"), que la
  extracción de texto entrelaza sin preservar a qué gráfico pertenece cada número. Para 2022 encontré
  que "242" (que O-5 atribuye a Lubricantes en la lámina 9) en realidad aparece en el grupo de seis
  números de la lámina 8 ("-419, $5.334, 433, 1.039, 386, 242"), y que el número que sí pertenece a la
  lámina 9 para Combustibles ("4.335") no reconcilia con el USD 144 que el mismo documento declara
  para Combustibles (4.335/40,071 = 108,2, no 144). Para 2021 encontré una estructura de "cascada" con
  al menos 5 sub-categorías de bridge ("R. Monopólico (sin cobertura TC)", "Cobertura monetaria",
  "Otros ingresos/gastos", más "Exportaciones, Bunkers, Pasteras" y "Resultado UTE") y 9 números
  peso-denominados sin un mapeo unívoco recuperable del texto extraído. Dado el riesgo de publicar un
  número incorrecto sobre el resultado del negocio monopólico de ANCAP, decidí **no** agregar
  "Resultado Monopólico" como segmento. Si el editor lo quiere igual, hace falta abrir el PDF
  **visualmente** (no solo el texto extraído) — ninguno de los agentes de este proyecto tiene esa
  herramienta hoy.
- **O-15 (corregir, presentación) — `hitos[]`**: no lo armé (es una decisión de edición, no de
  investigación), pero todas las fuentes ya están en la ficha. Doce hitos posibles, cada uno con
  fuente ya citada en `empresas.yaml`: 1931-10-15 creación (Ley 8.764, `fuentes` de `creacion`);
  2002-01-04 Ley 17.448 de desmonopolización; 2003-12-07 referéndum que la deroga; 2016-02-02
  capitalización del MEF por UI 5.840.159.519 (Ley 19.368, `nota` de `finanzas[2016]`); 2020 excepción
  de bunkers en puertos de la ANP; 2020 LUC arts. 235-237, mecanismo de fijación de precios; 2020-12-18
  Ley 19.924; 2021-08 factor X de $2,97/litro (fuente nueva agregada en esta sesión); 2022-10-20 Ley
  20.075, hidrógeno verde fuera del monopolio; 2023-07-25 decreto que amplía la excepción
  aeroportuaria; 2024 parada de la Refinería de La Teja (`nota` de `finanzas[2024]`).
- **O-13 (bloqueaba, asimetría) — resuelto parcialmente.** Agregué a `precios_vs_paridad.series[]` los
  dos ítems de 2010-2014 (nafta -78, gasoil +1.181, fuente CED primaria) que faltaban, con
  `periodo: "2010-2014"` (tramo) igual que "2015-2019", y dejé el ítem de 2024 con `periodo: "2024"`
  (año suelto) sin tocar. **No até estos cabos**: la página va a graficar en el mismo eje un
  acumulado de 5 años (2010-2014, 2015-2019) contra un año suelto (2024), que es exactamente lo que
  O-13 objeta. El editor tiene que decidir: (a) dos gráficos separados (acumulados vs. año a año), o
  (b) expresar 2024 también como un "período" nominal de un año para que las etiquetas del eje no
  induzcan a comparar magnitudes de escala distinta sin aclararlo, o (c) anualizar los acumulados
  (2010-2014 → -15,6/año nafta, +236,2/año gasoil; 2015-2019 → +88,6/año nafta, +267,4/año gasoil) y
  dejar 2024 como está. No hice ninguna de las tres porque son decisiones de presentación/criterio, no
  de investigación. **No agregué el ítem 2020-2021** (+40,5 millones anuales combinado) a `series[]`
  porque ese dato del CED es combinado (nafta+gasoil), no por producto como el resto de la serie, y
  agregarlo forzaría una fila con `producto: "nafta y gasoil"` que rompería la agrupación por producto
  del gráfico; queda solo en `comparaciones[]` (ahora con CED como fuente primaria, ver abajo).
- **O-12 (bloqueaba, atribución) — resuelto.** Encontré el documento primario del CED: "Boletín
  Macroeconómico N.° 27" (`https://ced.uy/public/archivos/boletines/doc_13.pdf`, 3 de marzo de 2022),
  con las cuatro cifras que El Observador citaba de segunda mano (2010-2014: nafta -78, gasoil +1.181;
  2015-2019: nafta +443, gasoil +1.337) y también la de 2020-2021 (nafta +14, gasoil +67). Puse el CED
  como `fuentes[0]` en los cinco `comparaciones[]` afectados (manteniendo El Observador como segunda
  fuente) y en los dos ítems de `series[]` de 2015-2019 y los dos nuevos de 2010-2014. Con esto la
  página va a mostrar "CED" como autor del cálculo, no "El Observador".
- **O-14 (bloqueaba, asimetría) — resuelto**, ver el nuevo `descripcion` arriba: repone la salvedad
  sobre el cálculo discutido y el factor X.
- **O-9 (corregir, documento previsible) — intentado y no resuelto**, ver
  `## intento_fallido_extension_serie_ursea` arriba: el recurso que la crítica señaló no contiene lo
  que promete su propia descripción en el catálogo.

## candidatos_giro

(No aplica: esta corrida no investiga declaraciones de un político, sino datos de una empresa
pública.)

## hipotesis

- La reconstrucción de los segmentos "Lubricantes"/"Gas Natural"/"Portland"/"Combustibles" de
  2020-2024 a partir de gráficos de barras (ver `metodo_segmentos`) está fuertemente cruzada por
  aritmética contra el total declarado, pero no es una lectura directa de una tabla. Si el crítico o
  el editor tienen forma de abrir el PDF de forma visual (no solo el texto extraído), vale la pena
  confirmar el orden de las barras contra lo que registré acá. Esto se agravó al intentar resolver
  O-5: dos láminas distintas del mismo documento (2022) mezclan sus números en la extracción de texto,
  lo que confirma que este tipo de gráfico es especialmente frágil para lectura automática.
- No verifiqué si existe una tabla "RESULTADOS POR LÍNEA DE NEGOCIO" para 2015 en algún documento
  distinto de la presentación de balance de ese año (por ejemplo, en una memoria anual separada, si
  existiera); solo revisé la presentación de balance. Motivo para no seguir: tiempo de la corrida y
  bajo valor esperado.
- No pude reconciliar con precisión, para 2016, el sub-total "Gas" con "Gas Natural" (el
  encabezado de la tabla de 2016 dice literalmente "Gas", truncado por el ancho de columna); asumí que
  es el mismo concepto que "Gas Natural" en las tablas de 2017-2019, dado que ANCAP no tiene otro
  negocio de "gas" a secas. Bajo riesgo, pero queda dicho (nota en `finanzas[2016].segmentos[2]` no se
  agregó formalmente por límite de tiempo de esta segunda vuelta; el editor puede agregarla, texto
  sugerido: "La tabla de 2016 encabeza esta columna 'Gas'; desde 2017 la llama 'Gas Natural'.").
- **2022, segmento Combustibles: sin `pesos`.** No pude determinar con confianza cuál de los números
  peso-denominados de la lámina 9 corresponde a Combustibles (ver `para_el_editor`, O-5). Dejé el
  campo sin `pesos` en vez de adivinar.
- **2023, los cuatro segmentos: sin `pesos`.** La lámina de 2023 solo da explícitamente dos números en
  pesos ("$ 1.510" y "$ 25") para seis etiquetas candidatas; no hay forma confiable de saber a cuáles
  corresponden. Dejé los cuatro segmentos de 2023 sin `pesos`.
- **2021: sin `pesos` en ningún segmento** (ya lo decía la primera vuelta: esa lámina solo da dos
  totales en pesos, no el desglose por segmento).

## casos_vistos

(Ninguno.)

## verificacion_manual

(Vacío en esta segunda vuelta: las 10 fuentes de la planilla URSEA que llevaban `verificacion: manual`
en la primera vuelta ya no lo necesitan — `pnpm fuente` lee el xlsx directamente y las citas nuevas son
filas literales que validan "exacta" en `pnpm validar --red`.)

## cobertura_del_periodo

- `segmentos[]`: cubre 2016 a 2024 (9 de los 10 años pedidos, 2015-2024); falta 2015 (ver
  `anios_sin_segmentos`). Dentro de los años cubiertos, `pesos` (además de `usd`) está completo para
  2016-2020 y 2024, parcial para 2022 (falta Combustibles) y ausente para 2021 y 2023 (ver
  `## hipotesis`).
- `precios_vs_paridad.series[]`: precio de venta y PPI año por año para Gasolina Súper 95 y Gas oil en
  2015, 2016, 2017, 2018 (años completos) y 2019 (parcial, enero-mayo); sin extensión posible a
  2019-completo/2020 pese al intento documentado arriba. `diferencia_usd_millones` por producto para
  2010-2014 y 2015-2019 (CED, con fuente primaria) y para 2024 (ANCAP). Sin cobertura de precio-vs-PPI
  año por año para 2019 (junio en adelante) a 2023.

## objeciones_al_brief

Ver `objecion_de_hecho_al_brief` arriba: no es una objeción de Regla 0 (no hay pedido de asimetría
entre partidos o personas en este brief ni en la crítica de esta segunda vuelta), sino una corrección
de hecho sobre dónde vive el dato de segmentos que el brief pedía buscar en un lugar equivocado. El
resto del brief y de la crítica se cumplieron tal como están escritos, con las excepciones (O-5, O-9,
2022/2023 `pesos`) documentadas arriba como intentos fallidos, no como objeciones.
