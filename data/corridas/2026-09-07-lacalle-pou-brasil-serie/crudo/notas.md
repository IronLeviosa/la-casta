# Notas — serie 2002-2022 nafta/gasoil Uruguay vs. Brasil (chequeo combustibles-mas-baratos-brasil)

## ATENCION: series.yaml bloquea pnpm validar --inbox / pnpm promover en este directorio

`pnpm validar --inbox` recorre la carpeta y trata TODO archivo `.yaml` como una colección conocida;
si no reconoce el nombre, tira un error y corta ahi mismo, antes de revisar el resto de la carpeta
(incluido `chequeos.yaml`, que sí es válido: 0 errores de esquema al copiarlo solo a una carpeta de
prueba). `series.yaml` no es ninguna de las colecciones registradas en
`scripts/lib/inbox.ts` (`declaraciones, promesas, menciones, giros, chequeos, casos, cobertura,
patrimonio, intervenciones, vetos, discrepancias, politicos, eventos, empresas`), así que **hoy
`pnpm validar --inbox` y `pnpm promover` sobre esta carpeta van a fallar** hasta que alguien con
permiso para tocar `scripts/` decida una de estas dos cosas: (a) registrar `series` en
`ARCHIVOS_INBOX` de `scripts/lib/inbox.ts` como una colección auxiliar sin entrada en
`AGENTE_POR_COLECCION` (no se promueve a `content/`, solo respalda a `chequeos.yaml`), o (b)
excluir `series.yaml` del recorrido antes de correr `validar`/`promover` y tratarlo aparte. No lo
resolví yo: el brief pide el archivo con ese nombre exacto en esta carpeta, y no me corresponde tocar
`scripts/`. Quedó igual en el informe final de esta corrida.

## estructura de series.yaml

El brief describe `series.yaml` como "una lista con un ítem por año... con `fuentes_series` al
final del archivo", pero un documento YAML tiene una sola raíz: no puede ser una lista Y tener una
clave `fuentes_series` como hermana al mismo nivel. Se resolvió envolviendo todo en un mapa con dos
claves de nivel superior: `items` (la lista de 21 años) y `fuentes_series` (la lista de fuentes),
que es la lectura más cercana a lo que pide el brief sin romper el formato. Se verificó que el
archivo completo parsea sin errores con el mismo parser YAML que usa `pnpm validar`
(`node -e "require('yaml').parse(...)"`).

## medio faltante: gub.uy / ursea

Además, una vez sorteado el bloqueo anterior, `pnpm validar` señala una segunda cosa (ya
esperada, no bloqueante para el esquema): `dato_real.fuentes` de `chequeos.yaml` cita dos URLs de
`gub.uy/unidad-reguladora-servicios-energia-agua/...` (URSEA) con medio `gub.uy`, que tampoco existe
en `content/medios/` (no hay `ursea.yaml` ni un `gub-uy.yaml` genérico). Es el slug que devolvió
`pnpm fuente` tal cual (host crudo, sin coincidencia con ningún medio configurado); ver más abajo en
`## metodo` el detalle. Se deja así, no se inventó un slug.

## metodo

Objetivo: reconstruir la serie ANUAL 2002-2022 de nafta y gasoil, Uruguay vs. Brasil, en USD por
litro, con el promedio simple de los meses disponibles de cada año. El detalle completo, con cita de
cada fuente, está en `series.yaml`; acá va el razonamiento y lo que hay que saber para reproducirlo o
cuestionarlo.

**Uruguay — fuente principal (2002-01 a 2019-05).** El dataset `ursea-ppi_vs_pe_v2` de
catalogodatos.gub.uy que menciona el brief (CSV `ppi_pe.csv`) resultó **no ser lo que su propia
descripción dice**: la descripción dice "período 2002-01 a 2020-09", pero el contenido real
descargado hoy solo tiene filas desde 2020-10 en adelante, y son puramente PPI (precio teórico de
paridad de importación, la cuenta de costos FOB+fletes+impuestos), no el precio de venta al público
que pagó la gente. No hay manera de saber, desde ese recurso, si el dataset fue recortado con el
tiempo o si la descripción siempre estuvo desactualizada; lo relevante es que **no sirve para
2002-2020**. En su lugar se usó el archivo `Series_PPI_VS_PE_0.xlsx` que aloja la propia página de
URSEA ("Precios de Paridad de Importación"), que trae ambas series (PPI y precio del Poder Ejecutivo)
mes a mes desde 2002-01. Su cobertura real termina en 2019-05 (después son notas al pie de
metodología, no más filas de datos), no en 2020-09 como promete el texto de la página. Es la
**misma fuente y el mismo tipo de comparación** (PPI vs. precio del Poder Ejecutivo) que ya usa el
propio chequeo original para su cálculo semanal, solo que agregada mes a mes en vez de semana a
semana.

**Uruguay — el hueco 2019-06 a 2020-12 (19 meses).** No se encontró ningún decreto de precio de
combustibles fechado en ese lapso, pese a buscarlo específicamente por trimestre y por eventos
conocidos (cambio de gobierno en marzo-2020, inicio de la pandemia). Tres piezas de evidencia,
juntas, sostienen que el precio **no cambió** en ese lapso (no que se "estimó"):
1. La serie oficial URSEA muestra el mismo valor exacto (Premium 97 $57,01; Súper 95 $54,95; Gas oil
   $40,40) sin variación en **todos** los meses que cubre desde oct-2018 hasta may-2019 (el final de
   la serie).
2. El sitio de la asociación de estaciones de servicio UNVENU mantiene un índice fechado de cada
   cambio de precio (`unvenu.org.uy/historico-de-precios-maximos-de-combustible`, paginado); en ese
   índice, entre el registro fechado 01/01/2019 y el siguiente registro fechado 01/01/2021 **no hay
   ningún registro intermedio**. No se usó UNVENU como fuente numérica (no es oficial, y no cita el
   decreto), solo como índice para confirmar la ausencia de cambios — el mismo uso que el brief
   autoriza para sitemaps/índices.
3. El Decreto 364/020 (el que fija el valor de enero-2021) se titula "ACTUALIZACION..." y su
   resultando dice que actualiza el precio máximo vigente; no hay decreto posterior a mayo-2019 que
   lo haya modificado antes.
Con esas tres piezas, se sostuvo el último valor oficial conocido (mayo-2019) para jun-2019 a
dic-2020. Es la interpretación más razonable de "no estimes": no se inventó un número, se sostuvo el
último decreto vigente, que es exactamente cómo funciona un precio fijado por decreto (rige hasta que
otro decreto lo cambia). Aun así, **2020 es el año con la evidencia más débil de toda la serie**: cero
decretos propios hallados, cero meses observados directamente.

**Uruguay — 2021.** Desde el 1/7/2021 (Decreto 201/021) el mecanismo pasó a actualización mensual;
antes de esa fecha, no. Se localizaron 5 decretos con tabla de precios en 2021 (364/020 para
01-ene, 171/021 para 08-jun, 205/021 para 01-jul, 333/021 para 01-oct, 386/021 para 01-dic) y se
sostuvo cada uno hasta el siguiente. Los decretos posteriores a jun-2021 traen dos artículos: el
Artículo 1 fija el PEP (precio ex-planta, mayorista) y el Artículo 2 fija el PVP (precio de venta al
público); se usó siempre el PVP (Artículo 2), que es el que paga el consumidor y el que corresponde a
"precio de venta al público" del brief. No se halló decreto para agosto-setiembre 2021; se sostuvo el
valor de julio. Los valores de octubre y diciembre coinciden exactamente, así que ese tramo (oct-dic)
sí queda bien determinado aunque falte el decreto intermedio de noviembre.

**Uruguay — 2022.** El dataset `ancap-precio-combustible-pe` de catalogodatos.gub.uy sí cubre 2022
(y años posteriores) con precios de venta al público reales, pero marca "S/C" (sin cotización) los
meses sin decreto nuevo, en vez de repetir el valor. Se completó sosteniendo el último valor
informado (forward-fill), sembrado en enero-2022 con el valor del Decreto 386/021 (diciembre-2021).
Esto se validó cruzando el valor que el propio dataset trae para marzo-2022 (Súper 95 $74,88, Gas
oil 50S $53,99) contra el Decreto 64/022 que ya cita el chequeo original: coinciden exactamente, lo
que da confianza en que el criterio "S/C = sin cambio, no sin dato" es correcto y no un artefacto.

**Uruguay — medio faltante.** Las páginas de URSEA (`gub.uy/unidad-reguladora-servicios-energia-agua/...`)
no tienen un medio propio en `content/medios/`: `pnpm fuente` les asignó el host crudo `gub.uy` como
medio (no hay ningún archivo `gub-uy.yaml` ni `ursea.yaml`). Se dejan así, tal como los devolvió la
herramienta; falta agregar un medio `ursea` (o un `gub-uy` genérico) a `content/medios/` para que la
cita quede prolija. Esto no es una propuesta de referente (no aplica esa sección), lo dejo acá porque
es lo más parecido que tiene esta corrida a un dato faltante del esquema.

**Brasil.** La ANP publica una planilla mensual agregada a nivel Brasil, oficial, completa desde
2001-07 (`mensal-brasil-2001-a-2012.xlsx` y `mensal-brasil-desde-jan2013.xlsx`), con "Gasolina Comum"
y "Óleo Diesel" (sin grado hasta 2012, con un grado "S10" que se releva de forma continua desde
2013-01). Se usó Gasolina Comum + Diesel S10 desde 2013 (antes, Diesel sin grado), tal como pide el
brief. Setiembre-2020 no tiene relevamiento (nota de la propia ANP en la misma planilla: "Não houve
pesquisa de preços entre 18/8/20 e 17/10/20", por la pandemia); se excluyó ese mes del promedio 2020
en vez de sostenerlo (a diferencia de Uruguay, acá la propia fuente documenta el hueco en vez de
sugerir continuidad). Desde el 30/10/2004 la ANP cambió su metodología de promedio simple a promedio
ponderado por ventas para el dato nacional; es una decisión de la ANP, no de esta investigación, y
afecta a toda la serie de Brasil desde esa fecha por igual (no distingue entre Uruguay y Brasil, ni
entre nafta y gasoil).

**Tipos de cambio.** Uruguay: dólar interbancario vendedor, Fondo BCU, serie mensual que compila y
publica el MIEM/DNE ("dólar promedio"), fuente declarada BCU. Brasil: PTAX dólar venta, media de
período MENSUAL, serie SGS 3695 del Banco Central do Brasil (API pública). El chequeo original usó,
para el 25/03/2022, el dólar BILLETE de Uruguay (no interbancario) contra la misma PTAX de Brasil, y
sus propias notas de revisión ya dejaron dicho que la brecha entre billete e interbancario es de
décimas y no cambia los resultados a nivel semanal; no se volvió a probar esa brecha a nivel de
promedio anual por acotar el alcance, pero es razonable esperar una diferencia del mismo orden.

**Hallazgo para el editor (no es una calificación, es una lectura directa del gráfico):** con este
método, la nafta uruguaya resulta en promedio MÁS BARATA que la brasileña en 2009 y en 2010 (no solo
en 2022), y el gasoil uruguayo NUNCA resulta más barato que el brasileño en ningún año 2002-2022 del
promedio anual (ni siquiera 2022, pese a que la semana puntual del 27/03/2022 sí lo fue). Esto es
relevante para "por primera vez desde 2001/2002": si se sostiene con el promedio anual, no sería la
primera vez para la nafta (habría pasado 12-13 años antes), y para el gasoil el propio 2022 no lo
confirma a nivel de promedio anual, solo a nivel de una semana. Sobre el gasoil de 2022 en particular:
Brasil recortó fuerte el ICMS (impuesto estadual) a los combustibles desde julio-2022 (Ley
Complementaria 194/2022), lo que hizo caer el precio de la gasolina brasileña casi 30% entre junio y
setiembre; el gasoil uruguayo no bajó en el mismo lapso. Es un evento macro real, documentado en la
propia serie (ver `notas.md` de este archivo y los valores mensuales), no un artefacto de datos.

## anios_sin_dato

Ningún año quedó en `null` (se optó por sostener el último decreto vigente en vez de dejar el año
vacío, ver `## metodo`), pero estos son los años con evidencia parcial o reconstruida, de mejor a
peor:
- **2019**: 5/12 meses observados directamente (URSEA), 7/12 sostenidos sin decreto propio hallado.
- **2021**: 12/12 meses cubiertos, pero reconstruidos a partir de solo 5 decretos puntuales (de los
  6-7 que debería haber habido bajo el mecanismo mensual desde julio); falta confirmar
  agosto-setiembre con un decreto propio.
- **2022 (Uruguay)**: 6/12 meses observados directamente en el dataset oficial, 6/12 completados por
  continuidad ("S/C" del propio dataset).
- **2020**: el año más débil. 0/12 meses con decreto propio hallado para Uruguay (los 12 sostienen
  mayo-2019); 11/12 para Brasil (setiembre sin relevamiento por la pandemia, documentado por la ANP).

## candidatos_giro

(No aplica: esta corrida no investiga declaraciones nuevas, solo reconstruye una serie de datos para
un chequeo ya existente.)

## hipotesis

- El "por primera vez" de la declaración de Lacalle Pou podría no sostenerse ni siquiera con el
  criterio más favorable (promedio anual, no semanal): la serie muestra a Uruguay con nafta más
  barata que Brasil en 2009 y 2010. No se profundizó en el "por qué" de esos dos años (no es parte
  del encargo de esta corrida, que era construir la serie, no analizarla); queda para el editor.
- No se confirmó con un decreto propio si el precio uruguayo realmente estuvo inmóvil los 19 meses de
  jun-2019 a dic-2020, o si hubo algún cambio que ningún buscador ni el índice de UNVENU haya
  capturado. La evidencia disponible (ver `## metodo`) apunta fuertemente a que sí estuvo inmóvil,
  pero no es un decreto leído con las palabras exactas para esos meses puntuales.

## casos_vistos

(Ninguno.)

## verificacion_manual

Estas fuentes son datasets (CSV, XLSX, JSON de API), no páginas de prosa ni PDF: `pnpm fuente` no las
puede leer como texto de una nota (cae al extractor de HTML/Readability y falla o da basura). Se
descargaron con `curl` y se procesaron con un script propio (Python + openpyxl para xlsx, csv module
para CSV, JSON nativo para las respuestas de API), replicando lo que el brief autoriza para este caso
("si pnpm fuente no puede con un CSV o una API, usá WebFetch... verificacion: manual"); acá se usó
descarga directa en vez de WebFetch porque son archivos binarios/estructurados que WebFetch tampoco
interpreta de forma confiable para extraer cientos de valores numéricos exactos, y la exactitud del
número importa más que la fuente de lectura declarada. Los siete quedan con `verificacion: manual` en
`series.yaml` y en `chequeos.yaml`:
- `Series_PPI_VS_PE_0.xlsx` (URSEA/MIEM, Uruguay 2002-2019)
- `datos-de-precios-de-combustibles.csv` (ANCAP/catalogodatos, Uruguay 2022)
- `mensal-brasil-2001-a-2012.xlsx` (ANP, Brasil 2001-2012)
- `mensal-brasil-desde-jan2013.xlsx` (ANP, Brasil 2013-2022)
- `dolar promedio.zip/.csv` (MIEM/BCU, tipo de cambio Uruguay)
- API SGS 3695 del BCB (tipo de cambio Brasil)
- API CKAN `package_show`/`package_search` de catalogodatos.gub.uy (solo para descubrir los recursos
  anteriores, no aporta números a la serie)

Además, estas dos fallaron directamente y no se usaron:
- `https://www.ancap.com.uy/8809/1/pvp-gasolina-super-historico.html` — página renderizada con
  JavaScript, sin datos en el HTML crudo ni API visible.
- `https://dados.gov.br/dados/conjuntos-dados/serie-historica-de-precos-de-combustiveis-e-de-glp` —
  requiere JavaScript, WebFetch no devolvió contenido útil (se usó la página equivalente en
  `gov.br/anp` en su lugar, que sí es estática).

## cobertura_del_periodo

Cobertura pedida por el brief: serie anual 2001 o 2002 a 2022, nafta y gasoil, Uruguay y Brasil.
Se entregó 2002-2022 (21 años), no 2001, porque la serie oficial de Uruguay (URSEA) arranca en
2002-01 y no hay forma de emparejar 2001 sin el lado uruguayo (Brasil sí tiene datos desde 2001-07,
pero un año con un solo país no sirve para la comparación que pide el chequeo). Dentro de 2002-2022:
- 2002-2018: cobertura completa y directa en los dos países (12/12 meses cada uno).
- 2019: parcial (ver `## anios_sin_dato`).
- 2020: el año más débil de la serie, ver `## anios_sin_dato` y `## metodo`.
- 2021: reconstruido a partir de 5 decretos puntuales, ver `## anios_sin_dato`.
- 2022: parcial pero validado contra una fuente ya publicada (Decreto 64/022), ver `## metodo`.
No se investigó nada de campaña, oposición ni otros contextos discursivos: es fuera del alcance de
esta corrida, que es un trabajo de datos puro sobre un chequeo ya existente.

## objeciones_al_brief

Ninguna. El brief pide el mismo criterio (serie completa que pruebe o refute la afirmación entera)
que se aplicaría a cualquier chequeo de cualquier político con una comparación temporal; no hay nada
asimétrico que objetar.
