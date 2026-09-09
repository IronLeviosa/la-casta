# Notas — análisis BID / ADERASA sobre OSE, segunda vuelta (2026-09-09)

Segunda vuelta sobre el lote `2026-09-08-analisis-bid-aderasa`, resolviendo las objeciones de
`data/corridas/2026-09-08-analisis-ose-bid-aderasa/critica.md` (6 bloquean, 17 corregir, 3 aviso).

## candidatos_giro

No aplica: esta corrida no investiga declaraciones de un político, sino análisis de terceros sobre
una empresa pública.

## hipotesis

- **Reporte de sostenibilidad 2018 de OSE ("OSE, 2018b")**: la bibliografía del BID lo identifica
  con nombre completo, pero no se localizó en esta corrida (no está en el sitio actual de OSE ni se
  encontró copia archivada). Es la fuente de la serie acumulada 2005-2017 de ahorro de agua
  (315 millones de m3 de agua elevada, 86,5 millones de m3 de agua facturada, USD 140 millones).
  Queda `_faltante: dato_oficial` en `analisis.yaml#0.afirmaciones[7]`.
- **Estudio de asequibilidad del BID** (el 4% de ingresos del primer quintil): el propio documento
  lo cita como "adelanto de resultados... que el BID se encuentra realizando", sin publicación
  separada localizada. Queda `_faltante: dato_oficial` en `analisis.yaml#0.afirmaciones[10]`
  (afirmación nueva de esta vuelta).
- **Facturación unitaria de agua potable de OSE (USD 2,16/m3, ADERASA 2022)**: el Observatorio de
  datos abiertos de OSE (`catalogodatos.gub.uy`, organización `ose`) publica un dataset
  "Facturación y consumo" con 83 recursos, incluido uno con "consumos de agua potable en metros
  cúbicos (m3), por mes, departamento y tarifa desde enero de 2017"
  (`https://datos.ose.com.uy/dataset/.../consumos_m3_departamento.csv`), que permitiría reconstruir
  el cociente cruzándolo con la facturación en pesos (otro recurso del mismo dataset) y el tipo de
  cambio del BCU. No se procesó en esta corrida por el volumen de filas involucrado (83 recursos,
  series mensuales por departamento y tarifa desde 2017). Un resolvedor podría bajar los dos
  recursos con `pnpm fuente` (una fila de planilla es cita verificable) y calcular el cociente para
  2022. Como contraste de orden de magnitud ya cargado: el benchmarking ADERASA 2016 (Anexo 3 del
  BID) da, para Uruguay, una "Facturación unitaria de servicios de saneamiento" (no de agua potable)
  de USD 2,13/m3.
- **Tarifas de OSE para 2022** (Decreto N° 466/021): el anexo de tarifas en pesos sigue sin poder
  extraerse como texto (es una imagen en la página de IMPO). El decreto vigente que sí se pudo leer
  como texto es el de enero de 2019 (Decreto N° 27/019), tres años antes del dato de ADERASA. Sigue
  pendiente, para las tres afirmaciones de tarifas de la sección 4 de ADERASA (agua, saneamiento,
  cargo fijo), un documento con las tarifas de 2022 en texto plano: el anexo tarifario en el Diario
  Oficial de IMPO (viene como imagen) o la página de estructura tarifaria de OSE.

## resuelto_en_esta_vuelta

Para que quede visible qué cambió de estado respecto del borrador anterior:

- **Endeudamiento sobre patrimonio de OSE, 41,18% en 2022 (ADERASA)**: se recalculó de forma
  independiente con el balance auditado de OSE 2022, forzando la re-extracción con `--completo`
  (12 de 48 páginas del PDF estaban escaneadas y se pasaron por OCR con `tesseract`). El Estado de
  Situación Patrimonial (extraído por OCR, con la correspondencia posición-a-posición entre
  etiquetas y números reconstruida manualmente) da Total Pasivo $ 20.586.189.603 (2022) y $
  21.129.815.795 (2021); la Nota 8.1 (extraída sin OCR, texto nativo) da "Patrimonio (ii)" de
  $ 49.987.714.211 (2022) y $ 45.943.750.822 (2021). El cociente da 41,18% (2022) y 45,99% (2021),
  coincidiendo al segundo decimal con lo que reporta ADERASA para los dos años. **Advertencia
  metodológica**: el Total Pasivo sale de una página OCR donde la tabla se extrajo como dos bloques
  separados (lista de etiquetas y lista de números), y la correspondencia entre ambos se hizo
  contando la posición de cada renglón; el resultado se cruzó dos veces (contra Patrimonio, en texto
  nativo, y contra el mismo cálculo hecho con el balance 2021 y con el de 2023) y las tres
  coincidencias exactas con ADERASA dan confianza en la reconstrucción, pero el crítico debería
  revisar el OCR fuente antes de calificar `verdadero`.
- **Serie de agua no facturada 2013-2018 (Anexo 1 del BID)** y **serie de agua no contabilizada del
  Observatorio de OSE (2013-2024)**: cargadas como `dato_real` y como gráfico de líneas de dos
  series en `analisis.yaml#0`. La serie del Observatorio se calculó sumando, para diciembre de cada
  año, los 19 departamentos del dataset `balance_desglosado_ranc_2010_a_2025.csv`
  (AGUA_NO_CONTABILIZADA / AGUA_DISPONIBLE): 48,08% (2013), 49,80% (2018), 48,31% (2022), 47,49%
  (2024). Es un cálculo de esta corrida sobre datos oficiales, no una cifra que el dataset publique
  ya agregada a nivel país.
- **Riesgo legal (autor_es, BID)**: se retiró la atribución del financiamiento del "Proyecto OSE
  Sostenible y Eficiente" al BID; se documentó que ese proyecto lo financia el préstamo BIRF N° 8183
  del Banco Mundial (USD 42.000.000, aprobado el 16/11/2012), con el dictamen del Tribunal de
  Cuentas de la República como fuente (`documents1.worldbank.org`, publicado por el Banco Mundial
  como parte de los documentos del proyecto). El vínculo BID-OSE que sí está documentado (partida
  "Aportes contrato BID" de $ 3.680.975, sin cambios entre 2023 y 2024) quedó con su magnitud
  correcta en USD (unos USD 83.500 al tipo de cambio de cierre de 2024) y sin la afirmación
  infundada de "sin cambios desde 2016" (la fuente solo compara 2023 y 2024).
- **Tarifa social de saneamiento (42%-90%)**: se reconstruyó exactamente con los mismos operandos
  que ya citaba el registro (178,32 / 422,75 = 42,2%; 178,32 / 196,83 = 90,6%), comparando el cargo
  social combinado contra la tarifa residencial de saneamiento sola. La hipótesis de la vuelta
  anterior sobre esto queda cerrada.

## casos_vistos

Ninguno. La ficha de OSE (`content/empresas/ose.yaml`) ya documenta la disputa pública sobre el
proyecto Arazatí (antes Neptuno) como parte de `monopolio.argumentos_a_favor/en_contra` e `hitos`;
no apareció, en las fuentes leídas para esta corrida, ningún caso judicial nuevo.

## verificacion_manual

- `https://www.impo.com.uy/bases/decretos/466-2021` (Decreto de tarifas de OSE, enero 2022): la
  página se lee bien, pero el anexo con la tabla de tarifas en pesos está referenciado como
  "Ver: Texto/imagen" y no se extrae como texto.
- `http://www.ose.com.uy/descargas/clientes/reglamentos/reglamento_de_tarifas_y_facturacion_RTF_DEFINITIVO.pdf`:
  `fetch failed` (probado en la vuelta anterior). Es la fuente que el propio BID cita para el
  detalle de la tarifa social; ya no hace falta, porque el rango del BID se reconstruyó con el
  Decreto N° 27/019.
- Estados financieros de OSE 2022 y 2023 (`OSE_SEPARADOS_2022_compilado.pdf`,
  `OSE_2023_EEFF_Separados.pdf`): con `--completo --forzar`, `pnpm fuente` detectó automáticamente
  las páginas escaneadas (12 de 48 y 12 de 51 respectivamente) y las pasó por OCR con `tesseract`,
  lo que permitió leer el Estado de Situación Patrimonial (ver `resuelto_en_esta_vuelta`). El texto
  OCR de esas páginas tiene las etiquetas de fila separadas de los números (dos bloques de texto en
  vez de una tabla), así que cualquier cifra que se lea de ahí debe cruzarse contra otra fuente
  antes de darla por buena; en este caso se cruzó con éxito contra la Nota 8.1 (texto nativo) y
  contra ADERASA.
- `https://www.iadb.org/es/quienes-somos`: sigue en HTTP 403 (probado en la vuelta anterior). Se
  usó, en cambio, `https://www.iadb.org/en/who-we-are/about-us` (HTTP 200, en inglés), que sí
  confirma "26 borrowing member countries" pero no da un número de países no prestatarios; por eso
  `autor_es` ya no incluye la cifra de "22 no prestatarios" del borrador anterior, que no se pudo
  confirmar con una fuente abierta en esta sesión.

## cobertura_del_periodo

Sin cambios respecto de la vuelta anterior: esta corrida no es sobre un político ni sus mandatos,
sino sobre dos documentos de análisis de terceros (BID, junio de 2020, con datos mayormente de
2018-2019; ADERASA, noviembre de 2024, con datos del ejercicio 2022) sobre la empresa pública OSE.
Esta vuelta agregó, además de los dos documentos, sus fuentes de origen (Lentini 2015, la síntesis
de OPP, el Plan Nacional de Saneamiento, la nota de Presidencia de 2017, el dictamen del Tribunal
de Cuentas, y los datasets de OSE en `catalogodatos.gub.uy`), todas dentro del mismo alcance
(comparaciones tarifarias y de cobertura de OSE).

## objeciones_al_brief

Ninguna. El encargo de esta segunda vuelta pide el mismo rigor para lo favorable y lo desfavorable
a OSE y a cada gobierno, y así se aplicó: se cargaron tanto datos que mejoran la lectura de OSE
(menor endeudamiento de su clase, mejora de 49,50% a 45,30% en pérdidas de agua 2016-2022 según
ADERASA-ADERASA, casi duplicación del tratamiento de aguas residuales 2016-2022, micromedición más
alta que Sedapal) como datos que la empeoran (última en pérdidas de agua y en cobertura de
alcantarillado entre los "Muy Grande", mayor cargo fijo de los 11 operadores de tarifas, tarifas de
saneamiento doméstico y comercial altas).

## medios_faltantes

Tres medios usados en este lote no existen todavía en `content/medios/`.

**`ministerio-ambiente`** (ya señalado en la vuelta anterior, sin cambios):

```yaml
nombre: Ministerio de Ambiente
tipo: estatal
grupo: estado-uruguayo
url: https://www.gub.uy/ministerio-ambiente/
alias: [Ministerio de Ambiente, MVOTMA, Ministerio de Vivienda Ordenamiento Territorial y Medio Ambiente, SNAACC]
propiedad:
  descripcion: Cartera del Poder Ejecutivo uruguayo a cargo de la política ambiental, hídrica y de
    saneamiento; hasta la Ley N° 19.889 (LUC, 2020) estas competencias estaban en el MVOTMA. Publica
    planes sectoriales oficiales, entre ellos el Plan Nacional de Saneamiento (2019).
  fuentes:
    - url: https://www.gub.uy/ministerio-ambiente/sites/ministerio-ambiente/files/2020-07/PNS_Saneamiento_1.pdf
      medio: ministerio-ambiente
      fecha: 2019-12-01
      tipo: documento_oficial
      titulo: Plan Nacional de Saneamiento
      cita: "La cobertura de saneamiento adecuado en el año 2018 es al menos de 1 524 500 habitantes,
        que tienen acceso a redes de saneamiento y tratamiento adecuado, lo que representa el 43 %
        de la población total del país."
      retrieved_at: 2026-09-09
alineamiento:
  etiqueta: estatal
  justificacion: Cartera del Poder Ejecutivo; sus planes y publicaciones son documentos de gestión
    de gobierno, no de un medio independiente.
```

**`opp`** (nuevo en esta vuelta, usado para la síntesis del Informe Nacional Voluntario de ODS):

```yaml
nombre: Oficina de Planeamiento y Presupuesto (OPP)
tipo: estatal
grupo: estado-uruguayo
url: https://www.opp.gub.uy/
alias: [OPP, Oficina de Planeamiento y Presupuesto]
propiedad:
  descripcion: Organismo de la Presidencia de la República, responsable de la planificación
    estratégica del país; coordina, junto con Presidencia, la elaboración de los Informes
    Nacionales Voluntarios sobre los Objetivos de Desarrollo Sostenible.
  fuentes:
    - url: https://opp.gub.uy/sites/default/files/documentos/2025-05/Sintesis_VNR_Informe_ODS__Uruguay_2018.pdf
      medio: opp
      fecha: 2018-07-01
      tipo: documento_oficial
      titulo: Síntesis del Informe Nacional Voluntario - Uruguay 2018
      cita: El acceso al agua potable y al saneamiento (ODS 6) son derechos humanos fundamentales
        establecidos en la Constitución de la República. Actualmente, el 99,4% de la población
        tiene acceso al agua y el 95,2% tiene acceso a agua segura.
      retrieved_at: 2026-09-08
alineamiento:
  etiqueta: estatal
  justificacion: Organismo de la Presidencia; sus informes son documentos de gestión de gobierno.
```

Alternativa que dejó anotada el crítico: citar este documento bajo `medio: presidencia` en vez de
crear `opp`, ya que el informe está firmado por Presidencia y OPP en conjunto. Queda a criterio del
editor.

**`tribunal-de-cuentas`** (nuevo en esta vuelta, usado para el dictamen sobre el préstamo BIRF 8183
del Banco Mundial):

```yaml
nombre: Tribunal de Cuentas de la República
tipo: estatal
grupo: estado-uruguayo
url: https://www.tcr.gub.uy/
alias: [Tribunal de Cuentas, TCR]
propiedad:
  descripcion: Órgano de contralor externo de la Constitución uruguaya, con competencia sobre la
    ejecución presupuestal y financiera de los organismos públicos, incluidos los proyectos con
    financiamiento de organismos multilaterales como el Banco Mundial y el BID.
  fuentes:
    - url: https://documents1.worldbank.org/curated/en/363161471354342299/txt/Informe-de-Auditoria-8183-UY-PUBLICO.txt
      medio: tribunal-de-cuentas
      fecha: 2016-06-01
      tipo: documento_oficial
      titulo: Dictamen del Tribunal de Cuentas sobre el Proyecto OSE Sustentable y Eficiente,
        Préstamo BIRF N° 8183-UY
      cita: El contrato de Prestamo IBRD 8183, entre la ADMINISTRACION DE LAS OBRAS SANITARIAS DEL
        ESTADO (OSE) y el BANCO INTERNACIONAL DE RECONSTRUCCION Y FOMENTO fue aprobado el 16 de
        noviembre de 2012... por un monto total de U$S 42.000.000.
      retrieved_at: 2026-09-08
alineamiento:
  etiqueta: estatal
  justificacion: Órgano de contralor constitucional, sin línea editorial; sus dictámenes son
    documentos de auditoría pública, igual que los de cualquier otro ente de control del Estado.
```

Nota: el documento en sí está alojado en `documents1.worldbank.org` (el Banco Mundial publica ahí
la documentación de sus proyectos), pero quien lo firma y del que sale el texto citado es el
Tribunal de Cuentas de la República; por eso se propone `medio: tribunal-de-cuentas` y no un medio
`banco-mundial`. Si el editor prefiere un medio `banco-mundial` para el repositorio de documentos
en sí, es una alternativa razonable.

(No se propone `referentes_faltantes`: no apareció, en esta corrida, ninguna persona u organización
mencionada que no exista ya en `content/referentes/` o `content/medios/`, más allá de los tres
medios de arriba.)

## para_el_editor

Registros y fuentes que dependen de una decisión de criterio, no de investigación adicional:

- **`veredicto` de los dos registros**: se reescribieron para no contar calificaciones (esa cuenta
  le corresponde al editor, después de calificar) y para corregir los errores de numeración que
  señaló la crítica. Quedan como una síntesis puramente fáctica de qué documentos se agregaron; el
  editor tiene que redactar la síntesis final con las calificaciones reales.
- **`content/empresas/ose.yaml` necesita una corrección** (tipo `dato_erroneo`), ya señalada por el
  crítico: sus `comparaciones[]` dicen que la muestra de Lentini es de "11 operadores" (son 66 de 11
  países) y que el 2,06 USD/m3 es "indicador de país, no solo OSE" (es, al revés, un indicador del
  operador OSE, que excluye el saneamiento de Montevideo). Las fuentes para esa corrección están en
  `analisis.yaml#0.afirmaciones[0].dato_real.fuentes` de este lote (Lentini, Cuadro 4 y Cuadro A1).
  También su cifra de 88,98% de tratamiento de aguas residuales debería llevar la salvedad de que el
  mismo informe de ADERASA da 88,94% en su ficha y su tabla (fuentes en
  `analisis.yaml#1.afirmaciones[3]`). Esas `comparaciones[]` van a dejar de mostrarse de todos modos
  cuando estos dos registros de `analisis` se promuevan, según la regla del esquema.
- **Discrepancia (`discrepancias.yaml`)**: el archivo lo escribió el crítico en la corrida anterior;
  esta vuelta solo le agregó los dos campos que exigía el esquema y que faltaban
  (`publicado.retrieved_at` y `evidencia`), sin tocar el análisis ni la cita. No se generaron
  discrepancias nuevas en esta vuelta.
- **Gráfico de tarifas por país (BID/Lentini)**: se rehizo con los once promedios por país del
  Cuadro 4 de Lentini, con Uruguay destacado y sin la barra de "promedio de la muestra" mezclada
  como categoría. El editor puede decidir si conviene un segundo gráfico con los 57 operadores
  individuales (no cargado en esta corrida, por volumen).

## pistas_cruzadas

Ninguna. Ni el documento del BID ni el de ADERASA mencionan a políticos uruguayos cubiertos por el
proyecto por su nombre en los pasajes leídos en esta corrida.
