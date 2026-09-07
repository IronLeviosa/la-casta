# Notas — serie 2002-2022 nafta/gasoil Uruguay vs. Brasil (chequeo combustibles-mas-baratos-brasil)

Segunda pasada (2026-09-07) sobre el lote que un investigador Sonnet escribió antes en este mismo
directorio, corrida `2026-09-07-lacalle-pou-brasil-serie`. La corrige un investigador (Sonnet) según
la crítica de Opus (`data/corridas/2026-09-07-lacalle-pou-brasil-serie/critica.md`), que reprodujo
los 21 años de la serie y encontró dos años que no reproducían. Este documento reemplaza al
`notas.md` de la primera versión; lo que seguía siendo válido se trasladó, lo que quedó resuelto se
resume abajo en vez de repetirse.

## cambios_segunda_pasada

Resumen de qué cambió respecto de la primera versión, para quien compare ambos lotes:

1. **2021 Uruguay** (objeción "bloquea" de la crítica): se localizaron dos decretos que faltaban,
   245/021 (vigente 31/07/2021, rige agosto) y 289/021 (vigente 01/09/2021, rige setiembre). La
   primera versión sostenía julio en esos dos meses por no haberlos encontrado. Con los siete
   decretos completos y la regla "decreto vigente el día 1 de cada mes" aplicada de verdad, 2021 pasa
   de 1,4518/1,0128 a 1,4703/1,0306 (nafta/gasoil, USD/l; el segundo cambio también refleja el punto
   3). Ninguna comparación con Brasil cambia de signo.
2. **2020 Brasil**: ya no se promedia el precio de 11 meses contra un tipo de cambio de 12. El método
   nuevo (punto 3) empareja cada mes con su propio tipo de cambio, así que el problema desaparece por
   construcción; además `brasil_tipo_cambio` de ese ítem ahora reporta el promedio de los mismos 11
   meses que tienen precio (5,2059), no los 12 del año calendario (5,2420).
3. **Método declarado = método ejecutado**: los 21 años se recalcularon como promedio de las razones
   mensuales (precio del mes ÷ tipo de cambio del mismo mes), no como razón de promedios (precio
   local promedio del año ÷ tipo de cambio promedio del año), que es lo que la primera versión
   declaraba pero no ejecutaba. Cambia el valor de los 21 años en magnitud chica (2002 es el caso más
   grande: 0,9112 contra 0,8743, +4,2%); ninguna comparación cambia de signo. Ver `## metodo`.
4. **Regla de decretos aplicada de verdad**: el Decreto 171/021 (vigente desde el 8 de junio de 2021,
   no desde el día 1) ya no "cubre" junio-2021 en `_series.yaml`; bajo la regla que el propio archivo
   declara, nunca entra en la serie (afecta al punto 1, ya contado ahí).
5. **Puntos observados vs. sostenidos marcados en el gráfico**: cada punto de 2019-2022 (Uruguay) y
   2020 (Brasil) lleva ahora `Punto.nota` con el recuento de meses observados/sostenidos/completados,
   en vez de quedar esa información solo en `_series.yaml`.
6. **Segundo gráfico**: se agregó en `graficos[]` un gráfico de gasoil con los dos emparejamientos
   por azufre (Gas Oil 50S y Gas Oil 10S de Uruguay contra el único Diesel S10 que releva la ANP),
   2021-2022, que es el período con dato mensual de 10S. Responde a la objeción de asimetría de la
   crítica y a la objeción al brief sobre el punto 15 (ver `## objeciones_al_brief`).
7. **Cuatro fuentes en prosa** que la primera versión dejaba solo en `_series.yaml` (páginas de
   aterrizaje de URSEA, ANCAP/catalogodatos, MIEM y ANP, esta última con la nota sobre el cambio de
   metodología de octubre de 2004) se subieron a `dato_real.fuentes` de `chequeos.yaml`.
8. **Cita del Decreto 386/021** corregida: antes era solo el epígrafe ("Apruébanse los valores...
   a regir a partir del 1° de diciembre de 2021"), sin la tabla de precios; ahora cita el Artículo 2
   con la tabla completa, igual que los demás decretos.
9. **Fecha de los siete decretos** corregida a la fecha de PUBLICACIÓN en IMPO (la que pide el
   esquema), no la de entrada en vigencia; antes coincidían por casualidad en la mayoría de los
   casos, pero no en 364/020 (publicado 31/12/2020, vigente 01/01/2021) ni en 245/021 (publicado
   02/08/2021, vigente 31/07/2021).
10. **`medio: gub.uy` → `medio: ursea`** en las dos fuentes de URSEA: sigue sin existir el medio (ver
    `## medios_faltantes`), pero ahora se usa el slug correcto para que el editor solo tenga que
    crear el archivo, no corregir el slug también.
11. La sección "ATENCION" de la primera versión, sobre un bloqueo de `pnpm validar --inbox` por el
    nombre `series.yaml`, ya no aplica: el mantenedor agregó la regla del guion bajo (commit
    4c70531) y el archivo se llama `_series.yaml` desde el origen de este lote. `pnpm validar
    --inbox` sobre esta carpeta da 0 errores de esquema y 2 de referencia, los dos por `medio:
    ursea` (ver `## medios_faltantes`); es el único error admisible en este lote.

No se tocó `analisis`, `calificacion`, `titulo`, `afirmacion` ni `fragmento`: los cuatro quedan
exactamente como en la primera versión (y como en el registro publicado), tal como pidió el encargo
de esta segunda pasada. La crítica señaló que el párrafo de `analisis` sobre "por primera vez" queda
contradicho por el propio gráfico que este lote entrega; esa decisión es del editor (ver
`## hallazgos_para_el_editor`).

## metodo

**Fórmula.** Cada valor anual es el promedio de las razones mensuales: para cada mes con precio y
tipo de cambio disponibles, `razon_mes = precio_local_mes / tipo_cambio_mes` (USD/litro de ese mes
específico); el valor anual es el promedio simple de esas razones (12, o menos si falta algún mes).
Es distinto de "razón de promedios" (precio local promedio del año ÷ tipo de cambio promedio del
año), que fue lo que la primera versión de este lote declaraba en el encabezado pero no ejecutaba
(ejecutaba razón de promedios). Verificado en los 21 años contra el archivo original: con razón de
promedios se reproduce exacto lo que la primera versión publicó; con promedio de razones, no. La
diferencia es chica pero no cosmética: 2002 pasa de 0,8743 a 0,9112 USD/l en nafta (+4,2%, el peso
saltó de $14 a $27 por dólar dentro de ese año). Ningún año cambia de signo en ninguna comparación
entre una convención y la otra.

**Por qué esta fórmula y no la otra.** El encargo de esta segunda pasada pidió ejecutar el método que
el propio archivo declaraba, no inventar uno nuevo; y esta fórmula evita mezclar en el denominador
meses de tipo de cambio que no tienen precio correspondiente en el numerador (ver el punto siguiente,
Brasil 2020), porque cada razón ya empareja un mes consigo mismo.

**Uruguay — fuente principal (2002-01 a 2019-05).** Serie oficial URSEA "Series PPI vs PE"
(`Series_PPI_VS_PE_0.xlsx`, alojada en la página de URSEA), mensual y completa; nunca distingue
grados de gasoil (un solo "Gas oil"). El dataset `ursea-ppi_vs_pe_v2` de catalogodatos.gub.uy que
menciona el brief original resultó no ser lo que su propia descripción dice (cubre solo 2020-10 en
adelante y solo PPI, no precio al público); se usó el xlsx de URSEA en su lugar, igual que en la
primera versión.

**Uruguay — el hueco 2019-06 a 2020-12 (19 meses).** Sin cambios respecto de la primera versión: no
se encontró decreto de cambio de precio en ese lapso pese a la búsqueda, y se sostiene el último
valor oficial conocido (mayo-2019: Súper 95 $54,95, Gas oil $40,40) por las tres piezas de evidencia
indirecta que ya constaban (serie URSEA plana desde oct-2018, índice de UNVENU sin registro
intermedio, y el propio Decreto 364/020 hablando de "actualización" del precio vigente). Es el año
con la evidencia más débil de todo el lado uruguayo.

**Uruguay — 2021 (corregido en esta pasada).** Desde el 1/7/2021 (Decreto 201/021) el mecanismo pasó
a actualización mensual; antes de esa fecha, no. Se localizaron 7 decretos con tabla de precios
(no 5, como en la primera versión): 364/020 (01-ene), 205/021 (01-jul), 245/021 (31-jul, rige
agosto), 289/021 (01-set), 333/021 (01-oct) y 386/021 (01-dic); 171/021 (08-jun) también se localizó
pero no entra en la serie bajo la regla siguiente. **Regla aplicada: se toma el precio vigente el día
1 de cada mes** (no "el decreto que haya estado vigente en algún momento del mes"). Esto es lo que la
primera versión ejecutaba de hecho para enero-julio, pero no lo que declaraba para el resto ("cubre
2021-06" en la entrada de 171/021), y tampoco lo aplicó correctamente a agosto-setiembre porque no
tenía los decretos 245/021 y 289/021. Con la regla aplicada del todo:
- 171/021 (vigente desde el 8 de junio) nunca rige el día 1 de ningún mes: junio sigue con 364/020.
- 245/021 (vigente desde el 31 de julio) rige el día 1 de agosto.
- 289/021 (vigente desde el 1° de setiembre) rige el día 1 de setiembre.
- Noviembre no tiene decreto propio localizado; sostiene 333/021 (octubre). El valor idéntico de
  octubre y diciembre (386/021) acota a cero el margen de error de noviembre.
Se usó siempre el PVP (Artículo 2 de cada decreto desde 201/021 en adelante), no el PEP ex-planta del
Artículo 1, porque el PVP es "precio de venta al público", como pide el brief original. Los dos
decretos nuevos (245/021, 289/021) se localizaron así: 245/021 lo dio directamente el corpus
(`pnpm corpus:buscar "decreto 245/021 combustibles"`, ya indexado de una corrida anterior); 289/021
se buscó en la web a partir de la pista de la crítica (el PDF que aloja ANCAP,
`ancap.com.uy/9485/1/decreto-93-precio-combustibles.html`, firmado el 30/8/2021, sin capa de texto:
no se pudo leer con `pnpm fuente`, ver `## verificacion_manual`); una búsqueda por la fecha de firma
encontró el mismo decreto publicado con texto legible en IMPO bajo el número 289/021 (promulgación
30/08/2021, coincide con la fecha que ANCAP declara para el PDF firmado).

**Uruguay — 2022.** Sin cambios de método respecto de la primera versión (dataset ANCAP/catalogodatos
con forward-fill de los meses "S/C"), pero esta vez se registró también el detalle de Gas Oil 10S mes
a mes (existe como columna propia en el mismo dataset desde 2022-01), que la primera versión no
usaba. Se verificó además que el CSV trae los mismos datos duplicados unas 18 veces (bloques
repetidos, no series distintas): se dedupe por año-mes-producto y se prefiere el valor que no es
"S/C" cuando hay más de uno.

**Brasil.** Sin cambios de fuente respecto de la primera versión (ANP, planillas mensuales
`mensal-brasil-2001-a-2012.xlsx` y `mensal-brasil-desde-jan2013.xlsx`; Gasolina Comum y Óleo Diesel,
grado S10 desde 2013). Setiembre-2020 se excluye del promedio (no se sostiene), porque la propia ANP
documenta el hueco ("Não houve pesquisa de preços entre 18/8/20 e 17/10/20"). Con el método nuevo
(promedio de razones), el hueco de setiembre deja de ser un problema de ventanas desparejadas: al no
haber precio ese mes, simplemente no hay razón ese mes, y el promedio anual es de 11 razones en vez
de 12; no hace falta decidir qué ventana usar para el tipo de cambio porque el tipo de cambio nunca
se promedia solo, siempre en pareja con su propio mes de precio. Desde el 30/10/2004 la ANP cambió su
metodología de promedio simple a ponderado por ventas para el dato nacional (decisión de la ANP, no
de esta investigación); la fuente que documenta esto (`br_anp_serie_historica_landing`) estaba solo
en `_series.yaml` en la primera versión y ahora está también en `dato_real.fuentes`.

**Tipos de cambio.** Sin cambios de fuente: Uruguay, dólar interbancario vendedor, Fondo BCU (serie
"dólar promedio" del MIEM/DNE); Brasil, PTAX dólar venta, media de período mensual (BCB, série 3695).
Lo que cambia es que `uruguay_tipo_cambio`/`brasil_tipo_cambio` de cada ítem ahora reportan el
promedio de los mismos meses que tienen precio ese año (12 en casi todos; 11 en Brasil 2020), no
ciegamente los 12 del año calendario.

**Gasoil, dos emparejamientos.** Sin cambios de fondo respecto del chequeo original (que ya
distinguía 50S/10S para la semana de marzo-2022), pero esta pasada agrega el emparejamiento por
azufre (10S) como serie temporal 2021-2022 en un gráfico nuevo (`graficos[0]`), no solo como dato
puntual de una semana. Con datos mensuales completos de los dos años, Uruguay 10S está por encima del
Diesel S10 brasileño los 24 meses sin excepción (incluido marzo de 2022, que bajo el emparejamiento
50S sí da a Uruguay más barato). Es la respuesta a la objeción de asimetría de la crítica: el brief
original fijaba de antemano el emparejamiento 50S para el gráfico principal, que es el que favorece
la lectura de "más barato"; el gráfico nuevo muestra el otro también, con la misma cantidad de datos
para cada uno.

## anios_sin_dato

Ningún año quedó en `null`. Por evidencia, de mejor a peor:
- **2019**: 5/12 meses observados directamente (URSEA), 7/12 sostenidos sin decreto propio hallado.
  Sin cambios respecto de la primera versión.
- **2021**: mejoró respecto de la primera versión. Antes: 12/12 cubiertos pero con solo 5 de los 6-7
  decretos que debía haber; ahora: 7 decretos localizados (faltaba encontrar 245/021 y 289/021,
  resuelto en esta pasada), 6/12 meses observados directamente y 6/12 sostenidos (uno de ellos,
  noviembre, sin decreto propio pero acotado a valor exacto por los decretos de octubre y diciembre).
- **2022 (Uruguay)**: sin cambios de fondo. Súper 95: 7/12 observados, 5/12 completados por
  continuidad. Gas Oil 50S: 6/12 observados, 6/12 completados. Gas Oil 10S (nuevo en esta pasada):
  5/12 observados, 7/12 completados.
- **2020**: el año más débil. 0/12 meses con decreto propio para Uruguay (los 12 sostienen
  mayo-2019); 11/12 para Brasil (setiembre sin relevamiento, documentado por la ANP). Sin cambios de
  cobertura respecto de la primera versión; sí cambió cómo se reporta el tipo de cambio de ese año
  (ver `## metodo` y `## cambios_segunda_pasada`, punto 2).

## candidatos_giro

(No aplica: esta corrida no investiga declaraciones nuevas, solo reconstruye una serie de datos para
un chequeo ya existente. Sin cambios respecto de la primera versión.)

## hipotesis

- El "por primera vez" de la declaración de Lacalle Pou no se sostiene con el criterio de promedio
  anual para ninguno de los dos combustibles a la vez: la serie muestra a Uruguay con nafta más
  barata que Brasil en 2009 y 2010 (no en 2022), y con gasoil nunca más barato en el promedio anual
  de 2002 a 2021 (2022 tampoco, aunque marzo de 2022 sí). El recuento mes a mes (no solo el promedio
  anual) está en `## hallazgos_para_el_editor`; decidir qué hace esto con la calificación del
  registro es tarea del editor, no de este archivo.
- Sigue sin confirmarse con un decreto propio si el precio uruguayo estuvo realmente inmóvil los 19
  meses de jun-2019 a dic-2020 (ver `## metodo`, "el hueco 2019-06 a 2020-12"); la evidencia indirecta
  es la misma que en la primera versión y no se profundizó más en esta pasada porque no era parte del
  encargo.
- La crítica de la corrida anterior sugirió reemplazar el índice de UNVENU (asociación privada de
  estacioneros) por la página "Decretos Precios" de ANCAP como corroboración del congelamiento
  2019-2020, con el reparo de que esa página tampoco es un índice completo (le faltan 171/021 y
  205/021 en su propia pestaña de 2021). No se hizo en esta pasada: no estaba en la lista de seis
  puntos del encargo, y el índice de UNVENU sigue siendo válido como lo que es (un índice, no una
  fuente numérica). Queda para quien retome este chequeo.

## casos_vistos

(Ninguno.)

## verificacion_manual

Datasets binarios o estructurados que `pnpm fuente` no puede leer como texto de una nota (igual que
en la primera versión; se descargaron con `curl` y se procesaron con un script propio: Python +
openpyxl para xlsx, csv module para CSV, JSON nativo para las respuestas de API). Quedan con
`verificacion: manual` en `_series.yaml` y en `chequeos.yaml`:
- `Series_PPI_VS_PE_0.xlsx` (URSEA/MIEM, Uruguay 2002-2019)
- `datos-de-precios-de-combustibles.csv` (ANCAP/catalogodatos, Uruguay 2022)
- `mensal-brasil-2001-a-2012.xlsx` (ANP, Brasil 2001-2012)
- `mensal-brasil-desde-jan2013.xlsx` (ANP, Brasil 2013-2022)
- `dolar promedio.zip/.csv` (MIEM/BCU, tipo de cambio Uruguay)
- API SGS 3695 del BCB (tipo de cambio Brasil)

Nuevo en esta pasada: **el PDF del Decreto 289/021 alojado por ANCAP no se pudo leer.**
`https://www.ancap.com.uy/9485/1/decreto-93-precio-combustibles.html` es un PDF de 6 páginas sin capa
de texto (0 caracteres extraídos por `pnpm fuente`); la herramienta intenta pasar a OCR automáticamente
pero esta máquina no tiene instalado `pdftoppm` (poppler), así que el OCR no corrió
(`pnpm fuente` lo reporta como advertencia, no como error, y deja el registro en el corpus con 0
caracteres de texto). No se usó esa URL como fuente: en cambio, se buscó y confirmó el mismo decreto
con texto legible en IMPO bajo el número 289/021 (ver `## metodo`), que es la fuente que se cita.
Quien tenga poppler instalado (`winget install oschwartz10612.Poppler` o `scoop install poppler`)
podría reprocesar esa nota del corpus para que quede con texto propio, pero no hace falta para este
chequeo porque ya hay una fuente con texto legible del mismo hecho.

Además, estas dos siguen fallando (sin cambios respecto de la primera versión, no se reintentaron):
- `https://www.ancap.com.uy/8809/1/pvp-gasolina-super-historico.html` — página renderizada con
  JavaScript, sin datos en el HTML crudo ni API visible.
- `https://dados.gov.br/dados/conjuntos-dados/serie-historica-de-precos-de-combustiveis-e-de-glp` —
  requiere JavaScript, WebFetch no devolvió contenido útil (se usó la página equivalente en
  `gov.br/anp` en su lugar, que sí es estática).

## cobertura_del_periodo

Serie 2002-2022 (21 años), nafta y gasoil, Uruguay y Brasil. Sin cambios de alcance respecto de la
primera versión: 2001 queda fuera porque la serie oficial uruguaya (URSEA) arranca en 2002-01, y esto
ahora está dicho explícitamente en `grafico.nota` del registro público, no solo acá (objeción de la
crítica sobre el punto 15 del brief y la cobertura del período). Dentro de 2002-2022:
- 2002-2018: cobertura completa y directa en los dos países (12/12 meses cada uno).
- 2019: parcial (ver `## anios_sin_dato`).
- 2020: el año más débil del lado uruguayo; Brasil 11/12 (ver `## anios_sin_dato`).
- 2021: reconstruido de 7 decretos, mejoró respecto de la primera versión (ver `## anios_sin_dato` y
  `## metodo`).
- 2022: parcial pero validado contra el Decreto 64/022 ya publicado (ver `## metodo`).
No se investigó nada de campaña, oposición ni otros contextos discursivos: sigue fuera del alcance de
esta corrida, que es un trabajo de datos sobre un chequeo ya existente.

## objeciones_al_brief

Ninguna nueva. Los seis puntos del encargo de esta segunda pasada piden el mismo criterio (recalcular
bien, marcar qué es observado y qué es sostenido, mostrar las dos comparaciones de gasoil en vez de
una sola) que se aplicaría a cualquier chequeo de cualquier político con una comparación temporal; no
hay nada asimétrico que objetar. La crítica de la corrida anterior había señalado que el brief
*original* (punto 15: "gasoil 50S, o el grado de mayor volumen") fijaba de antemano el emparejamiento
que favorece la lectura de "más barato" para el gasoil; el punto 4 de esta segunda pasada resuelve
exactamente eso agregando el segundo gráfico con el emparejamiento por azufre, así que esa objeción
queda atendida, no pendiente.

## medios_faltantes

- **nombre**: URSEA (Unidad Reguladora de Servicios de Energía y Agua)
- **slug propuesto**: `ursea`
- **tipo**: estatal / organismo regulador
- **propiedad**: creada por la Ley N° 17.598 (2002) como órgano desconcentrado del Poder Ejecutivo,
  con autonomía técnica; la Ley N° 19.889 (LUC, 2020) la transformó en servicio descentralizado.
  Regula los servicios de energía eléctrica, combustibles, gas y agua potable/saneamiento; calcula y
  publica los Precios de Paridad de Importación (PPI) de los combustibles y los compara con los
  precios que fija el Poder Ejecutivo. No es un medio de prensa: es la fuente primaria de estos datos
  regulatorios, en el mismo sentido que ya lo son `impo`, `bcu`, `miem` o `ancap` en
  `content/medios/`.
- **alineamiento sugerido**: `estatal`, misma justificación que `impo.yaml`/`bcu.yaml`/`miem.yaml`:
  organismo técnico sin línea editorial, publica series y metodologías por mandato legal.
  URL institucional: `https://www.gub.uy/unidad-reguladora-servicios-energia-agua/`.
- Dos fuentes de este lote quedan con `medio: ursea` (no `gub.uy`) a la espera de que se cree el
  archivo: `dato_real.fuentes.7` y `dato_real.fuentes.8` de `chequeos.yaml` (el xlsx de series y la
  página de aterrizaje). `pnpm validar --inbox` sobre esta carpeta da exactamente esos dos errores de
  referencia y ninguno más.

## hallazgos_para_el_editor

Recuento mes a mes (no un promedio anual) de en qué meses Uruguay resultó más barato que Brasil,
recalculado en esta pasada con el método final (promedio de razones mensuales) y los valores
mensuales finales, incluida la corrección de 2021. No es una calificación: es la lectura directa de
los mismos datos que sostienen el gráfico, para que el editor decida qué hacer con "por primera vez".
Coincide con lo que había calculado la crítica de la corrida anterior (que usó el método viejo, razón
de promedios, a nivel mensual eso da lo mismo que promedio de razones porque a nivel de un solo mes
no hay diferencia entre las dos convenciones); esta pasada lo reproduce de forma independiente sobre
los datos finales, incluidos los meses de 2021 que cambiaron.

**Nafta (Súper 95 vs. Gasolina C comum).** Uruguay más barata en **28 meses** de 252 (2002-01 a
2022-12): mayo, junio, julio, setiembre, octubre, noviembre y diciembre de 2007 (7); febrero de 2008
(1); febrero a noviembre de 2009 (10); julio a diciembre de 2010 (6); enero, febrero, abril y mayo de
2011 (4). **Cero meses de 2022**: los doce meses de 2022 tienen a la nafta uruguaya por encima de la
brasileña, entre +19,8% (marzo) y +101,1% (diciembre).

**Gasoil (50S o el gasoil único de la época, vs. el diesel brasileño de cada época).** Uruguay más
barato en **13 meses**: agosto y diciembre de 2002 (2); enero, febrero, abril y mayo de 2003 (4);
enero a abril de 2006 (4); abril y mayo de 2009 (2); y marzo de 2022 (1, el dato que motivó este
chequeo).

**Los dos combustibles a la vez, el mismo mes:** solo **abril y mayo de 2009**. Mayo de 2009 es el
caso más robusto de toda la serie: nafta 1,0684 contra 1,2610 USD/l (Uruguay 15,3% más barata) y
gasoil 1,0394 contra 1,0760 (3,4% más barato), con los precios uruguayos de la serie oficial de URSEA
y los brasileños del relevamiento de la ANP, sin ninguna reconstrucción de por medio (ambos años
2003-2009 son de cobertura 12/12 directa en los dos países).

Sobre marzo de 2022 en particular (el mes de la declaración): la nafta uruguaya estuvo un 19,8% más
cara que la brasileña ese mes (cálculo mensual, consistente con el 19,6% del cálculo semanal ya
publicado en `dato_real`), y el gasoil 50S uruguayo un 3,7% más barato que el Diesel S10 brasileño
(bajo el emparejamiento por volumen; por especificación de azufre, 10S contra S10, Uruguay resulta
más caro ese mismo mes, ver `graficos[0]`).
