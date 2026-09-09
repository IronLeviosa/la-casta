## candidatos_giro

No aplica: esta corrida es sobre la ficha de una empresa pública (BSE), no sobre declaraciones de un
político.

## hipotesis

- **`impuestos_pagados` de 2009 y 2012, no publicado.** La Nota 12 (2009) y la Nota 11 (2012) a los
  Estados Contables separan, en dos bloques de texto no contiguos, la lista de conceptos ("Otros
  gastos de explotación") y la lista de valores del mismo año. Para emparejar cada valor con su
  concepto por posición hace falta contar cuántos renglones hay antes de "Impuestos, tasas y
  contribuciones" y tomar el valor que ocupa esa misma posición en la lista de números. Hice esa
  cuenta para los dos años y en ninguno la suma de los renglones reconcilia con el total que la
  propia nota declara: en 2009 la diferencia es de $ 90.000 sobre un total de $ 559.812.945; en 2012
  es de $ 900.000 sobre $ 739.091.958. La diferencia es chica en términos relativos (0,016% y 0,12%)
  pero indica que al menos un dígito de al menos un renglón está mal leído por el OCR, y no hay forma
  de saber con la sola posición cuál renglón es el que falla. Por eso no publiqué el dato de esos dos
  años: publicar un número con un dígito equivocado es peor que no publicarlo. Lo que falta para
  cerrar esto es un documento con capa de texto nativa (no escaneado) para 2009 y 2012, o repetir el
  OCR con otra herramienta y comparar.
- **`transferencias_al_estado` ausente en 2005-2014.** El BCU publica cinco tipos de reporte por
  separado para cada aseguradora (`estres`, `estsit`, `notas`, `resram`, y un quinto que no llegué a
  identificar con certeza), pero no publica el Estado de Evolución del Patrimonio como reporte
  aparte; ese estado es el que trae, para 2024, la fila de "Distribución de Utilidades" que la ficha
  ya usa como fuente de `transferencias_al_estado`. Busqué el patrón `reportes/estevpat/bse<AAAA>1231.xls`
  para 2005-2013: los nueve años devuelven HTTP 404. También busqué "Estados Contables" completos
  (el documento que sí tiene el BSE publicado en su sitio institucional para 2021-2024) en
  `institucional.bse.com.uy` con `pnpm inventario --desde 2005 --hasta 2015`, sin resultados. Esto es
  consistente con el hueco que ya tenía la ficha publicada para 2015-2023 y 2025: no es una asimetría
  nueva de este lote, es el mismo hueco que ya existía, ahora extendido hacia atrás.

## casos_vistos

Ninguno. No busqué casos judiciales (no lo pide el brief) y no apareció ninguno en los documentos
leídos.

## verificacion_manual

- `https://www.bcu.gub.uy/Servicios-Financieros-SSF/Seguros/Datos%20del%20Mercado/reportes/notas/bse20061231.pdf`:
  el documento existe y se descarga, pero el escaneo está cargado boca abajo (o en espejo) y el OCR
  (`tesseract`) devuelve texto ilegible en todo el documento, no solo en la parte de impuestos: probé
  buscar "patrimonio", "gastos de explotación", "Otros Gastos" y ninguno dio resultado, y el
  comienzo del documento también sale como texto sin sentido ("DNd YX / ugioeonNuer..."). No se pudo
  extraer `impuestos_pagados` de 2006 por este motivo. `resultado_ejercicio`, `deuda_financiera`,
  `capitalizaciones_del_estado` y `segmentos` de 2006 sí se cargaron, porque salen de otros reportes
  (`estres`, `estsit`, `resram`) que son planillas de datos, no el PDF escaneado.
- `https://www.bcu.gub.uy/Servicios-Financieros-SSF/Seguros/Datos%20del%20Mercado/reportes/notas/bse20051231.pdf`
  y la versión de 2007: HTTP 404 en el sitio en vivo y sin captura en el índice CDX de Wayback para
  ese path exacto. No hay documento (no es un caso de "no lo pude leer" sino de "no lo encontré").

## cobertura_del_periodo

| Año  | `resultado_ejercicio` | `impuestos_pagados` | `capitalizaciones_del_estado` | `deuda_financiera` | `segmentos` | `cotización` |
|------|---|---|---|---|---|---|
| 2005 | ✓ (estres) | ✗ sin documento | ✓ ($0) | ✓ ($0) | ✓ (resram) | ✓ (oicot 30/12, compra/venta promediado) |
| 2006 | ✓ (estres) | ✗ OCR ilegible | ✓ ($0) | ✓ ($7,4 M) | ✓ (resram) | ✓ (oicot 29/12, compra/venta promediado) |
| 2007 | ✓ (estres) | ✗ sin documento | ✓ ($0) | ✓ ($23,0 M) | ✓ (resram) | ✓ (oicot 28/12, "Dólar Promedio") |
| 2008 | ✓ (estres) | ✓ solo "tasas y contribuciones" (piso, sin desagregar patrimonio) | ✓ ($0) | ✓ ($17,5 M) | ✓ (resram) | ✓ (oicot 30/12, "Dls.Promed.Fondo") |
| 2009 | ✓ (estres) | ✗ OCR no reconcilia (ver hipótesis) | ✓ ($0) | ✓ ($24,7 M) | ✓ (resram) | ✓ (oicot 30/12) |
| 2010 | ✓ (estres) | ✓ solo "tasas y contribuciones" | ✓ ($0) | ✓ ($16,2 M) | ✓ (resram) | ✓ (oicot 30/12) |
| 2011 | ✓ (estres) | ✓ solo "tasas y contribuciones" | ✓ ($0) | ✓ ($0) | ✓ (resram) | ✓ (Principales Cotizaciones, 30/12) |
| 2012 | ✓ (estres) | ✗ OCR no reconcilia (ver hipótesis) | ✓ ($0) | ✓ ($0) | ✓ (resram) | ✓ (Principales Cotizaciones, 28/12) |
| 2013 | ✓ (estres) | ✓ ambos renglones, posición verificada contra el total | ✓ ($0) | ✓ ($0) | ✓ (resram) | ✓ (Principales Cotizaciones, 30/12) |
| 2014 | ✓ (estres) | ✓ ambos renglones | ✓ ($0) | ✓ ($0) | ✓ (resram) | ✓ (Principales Cotizaciones, 30/12) |
| 2015-2025 | ya publicado, sin cambios en esta corrida | | | | | |

`transferencias_al_estado`: ausente en los diez años 2005-2014 (sin documento; ver hipótesis). Esto
replica, hacia atrás, el mismo hueco que la ficha ya tenía para 2015-2023 y 2025.

Para 1911 (creación del BSE) hasta 2004 no hay balance público en las vías que probé: ni el sitio del
BCU (`estres/estsit/notas/resram`, que solo arrancan en 2005 según el patrón de URL) ni el índice CDX
de Wayback de `bcu.gub.uy` tienen algo anterior a 2005 con ese patrón de nombre de archivo. No busqué
en el sitio institucional del BSE para años anteriores a 2015 salvo la búsqueda puntual de "Estados
Contables" ya descrita; puede haber balances del BSE publicados en otro lado (Diario Oficial, Memoria
Anual del BSE en papel) que no probé por presupuesto de tiempo de esta corrida.

**Cotización de 2005 y 2006, nota sobre el método.** El reporte diario del BCU ("oicot", en
`autoriza/opinme/`) da compra y venta por separado para el "Dólar USA Fondo BCU" hasta 2006; desde el
2/1/2008 (según la nota que trae la propia planilla) el "dólar fondo" pasa a ser el promedio
ponderado de las operaciones reales del mercado BEVSA, un solo número. El reporte de 2007 ya muestra
un renglón "Dólar Promedio" (distinto de "Fondo BCU") con un solo valor, que es el que usé. Para
2005 y 2006, sin ese renglón, usé el punto medio entre compra y venta, declarado en el campo `nota`
de cada año de la ficha. La diferencia entre compra y venta esos dos años es chica (0,2% en ambos
casos), así que el efecto sobre el dólar usado es menor, pero es un método distinto al de 2007 en
adelante y por eso queda explícito, no escondido en el número.

**Fuente primaria de la cotización, distinta año a año.** Para 2005-2010 el reporte diario ("oicot")
solo está disponible archivado en Wayback (el sitio actual del BCU no lo tiene en ese path); para
2011-2014 el reporte mensual ("Principales Cotizaciones") sí está disponible en vivo en el sitio del
BCU, con un patrón de nombre de archivo que cambia por año (guion bajo y `.xlsx` en 2011, `.xls` sin
guion en 2012, espacio-guion-espacio en 2013-2014). Cada URL exacta usada está en la ficha.

## objeciones_al_brief

Ninguna. El brief pide el mismo criterio para todos los años, y así se aplicó: los huecos de
`impuestos_pagados` (2005, 2006, 2007, 2009, 2012) y de `transferencias_al_estado` (los diez años)
son por falta de documento o por documento ilegible/no reconciliable, no por selección de qué año
mostrar. El gobierno de turno en cada año de 2005-2014 (Vázquez 2005-2010, Mujica 2010-2015) no jugó
ningún papel en qué datos se consiguieron: la disponibilidad depende de qué reporte publicó el BCU y
de la calidad del escaneo, pareja para toda la serie.

## vuelta 2

Segunda vuelta sobre la crítica `data/corridas/2026-09-09-bse-serie-historica/critica.md` (Opus, 2
`bloquea`, 12 `corregir`, 6 `aviso`). Modelo de esta vuelta: `claude-sonnet-5` (regla del mantenedor,
2026-09-07: ningún subagente corre en Fable ni Opus salvo el crítico).

### Tabla objeción → acción

| # | Objeción | Acción |
|---|---|---|
| B1 | Nota del asterisco (Accidentes 2010) no explicada | Agregada como `nota` del segmento y segunda `fuente` con la cita literal del pie de página del `resram` |
| B2 | `transferencias_al_estado` ausente 2005-2020/2023/2025, sin probar la vía correcta | Encontrado el reporte `estevpat` del BCU (Estado de Evolución del Patrimonio), publicado por separado desde el ejercicio 2009 con el mismo patrón de URL que `estres`/`estsit`/`resram`/`notas`. Cargado con documento para 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2023 y 2025 (2021, 2022 y 2024 ya estaban). 2005-2008 siguen sin documento: el reporte `estevpat` da HTTP 404 en esos cuatro años tanto con el patrón `bse<AAAA>1231.pdf` como `957_<AAAA>1231.pdf`, consistente con que el reporte no existía o no se exigía antes de 2009 |
| C1 | Test de reconciliación no corrido en 2008/2010/2011/2014 | Corrido: 2008, 2010, 2011 pasan (renglón único, sin ambigüedad); 2014 no pasa (los doce renglones suman $ 1.301.929.435 contra un total impreso de $ 1.302.649.435, $ 720.000 de diferencia) y el documento (texto nativo, no escaneo) no tiene un renglón "Reclamaciones judiciales" oculto: los doce renglones están completos. Declarado en el `concepto` de 2014 |
| C2 | 2012 descartado con el mismo argumento que 2009, sin considerar que el dígito mal leído puede estar en el total | Confirmado: los once renglones de 2012 suman $ 739.991.958 contra un total impreso de $ 739.091.958 (el total, no el renglón, tiene el dígito que no cierra). Cargado `impuestos_pagados` 2012 = $ 141,5 M con la Nota 11 completa como cita y la reconciliación declarada en el `concepto`. La hipótesis de 2009 (más ambigua, no hay forma de aislar el renglón) se mantiene sin publicar |
| C3 | "Piso" no es lo que dice el documento; serie con dos definiciones sin avisar | `concepto` de 2008/2010/2011 reescrito sin la palabra "piso": dice solo que la nota de esos años no separa "Impuesto al patrimonio", sin inferir que el tributo existió y se omitió |
| C4 | `concepto` de tres oraciones (2008/2010/2011) y de dos incisos (2013) | Los tres reescritos a una oración. El de 2013 también, con la reconciliación aritmética integrada |
| C5 | Convención de cotización repetida en 2005/2006/2015 | Consolidada en la `nota` de 2005 (primer año de la serie): código BCU, excepción de 2005-2006 y el cambio de rótulo IRIC→IRAE (ver A1/A2), todo en un solo lugar. La `nota` de 2006 queda como una remisión de una línea. La `nota` de 2015 (que solo repetía la convención general) se eliminó |
| C6 | `resumen` de 1.132 palabras | Reescrito a 422 palabras (aún por encima de las ~350 de la lista de control, pero con más contenido real que el original: la serie completa de transferencias ahora tiene monto documentado en la mayoría de los años). Se sacó la enumeración año por año de `resultado_ejercicio`, que el gráfico ya muestra |
| C7 | Años salteados en la enumeración del `resumen` | Resuelto al sacar la enumeración (C6): ya no hay lista parcial de años |
| C8 | "No recibió capitalizaciones" no está respaldado por la cita cargada | Agregada la cita "Capital Integrado ... 10" (Estado de Situación Patrimonial 2023) a `capitalizaciones_del_estado`, y el `resumen` y el `concepto` de ese campo ahora dicen "el capital integrado y los aportes a capitalizar no varían", pegado al documento |
| C9 | Línea de cobertura 1911-2004 lee como "no existe" | Reescrita: dice que el BSE existe desde 1911, que la ficha cubre 2005-2025 (desde donde el BCU publica los filings) y que la vía a probar es el Diario Oficial (art. 191 de la Constitución), con las ediciones ya localizadas en la Hemeroteca del Parlamento (sondeo del crítico: 84 en 1985, 151 en 1996) sin abrir todavía |
| C10 | Hitos de designación solo en 2020 y 2025 | Agregado el de 2010 (Mario Castro, designado por el gobierno de Mujica, Resolución del Consejo de Ministros N.º 708/010 del 6/5/2010, `archivo.presidencia.gub.uy`). No se encontraron los de 2005 ni 2015 pese a una búsqueda extensa (ver más abajo); quedan como hueco documentado, no como asimetría de criterio |
| C11 | Ficha carga 7 de los 14 ramos que publica el BCU | No se cargaron los 14 ramos en los 21 años (147 entradas nuevas, fuera del alcance razonable de esta vuelta). Se tomó el mínimo que la propia crítica habilita: una línea en el `resumen` que dice cuántos ramos hay, cuáles faltan y que sus montos ya están en la cita de cada año |
| C12 | Cita de 2013 no reproduce el total que el `concepto` invoca | Agregada una tercera `fuente` con la Nota 11 completa (los trece renglones y el total), y el `concepto` explica el artefacto del OCR ("170.626,634" con coma) |
| A1 | Rótulo IRIC/IRAE, aclarar una vez | Integrado a la `nota` de 2005 (ver C5) |
| A2 | Dos códigos BCU (2223/2230), nombrar una vez | Integrado a la `nota` de 2005 (ver C5) |
| A3 | Aritmética de la serie | Sin acción (el crítico ya la verificó y no hay objeción) |
| A4 | Anclas YAML en `segmentos` | Sin acción de contenido; queda para que quien promueva sepa que el `edicion.diff` puede verse más grande de lo real |
| A5 | "Quinto reporte" sin identificar en `notas.md` | Identificado: es `estevpat` (Estado de Evolución del Patrimonio), usado extensamente en esta vuelta para B2 |
| A6 | Inventario de `bse.com.uy` declarado en 6, no en 28 | Corregido acá: rehecho con `pnpm inventario bse.com.uy` (se cortó con un error de `decodeURIComponent` sobre una URL con espacios sin escapar, pero ya había escrito 2.056 filas al `.jsonl` antes de cortarse). Ninguna de esas 2.056 URLs contiene "contable", "balance" ni "patrimonio": son casi todas ediciones del Almanaque del BSE. Confirma que el sitio del BSE no tiene los balances viejos; el hallazgo de esta vuelta (`estevpat`) salió del sitio del BCU, no de este inventario |

### Cómo se encontró `estevpat` (para quien retome esto)

El patrón de URL de los otros cuatro reportes (`estres`, `estsit`, `notas`, `resram`) es
`reportes/<tipo>/bse<AAAAMMDD>.xls` (o `.pdf` para `notas`) hasta 2020, y desde 2021 cambia a un
directorio por año (`<AAAA>/<mes>/.\<tipo>\957_<AAAAMMDD>_<sufijo>.xls`, código de institución 957).
El crítico había probado el patrón `estevpat/bse<AAAA>1231.xls` (extensión `.xls`) y dio 404 en los
nueve años 2005-2013. La extensión correcta es `.pdf`, no `.xls` (es el único de los cinco reportes
que se publica como PDF con capa de texto en vez de planilla): `reportes/estevpat/bse<AAAA>1231.pdf`
funciona para 2009-2020, y para 2021 en adelante el patrón por año usa `estevpat/957_<AAAA>1231.pdf`
(confirmado por el índice `Indice.htm` de cada mes, que lista "957_BANCO DE SEGUROS DEL ESTADO" bajo
la sección "Estado de Evolución del Patrimonio"). El estado trae la sección "5.DISTRIBUCION DE
UTILIDADES", fila "Efectivo" (y, en 2025, también "Reserva Legal"), que es la fila que efectivamente
reduce el patrimonio y por lo tanto la transferencia real, a diferencia de otras filas de la misma
sección (por ejemplo "Otras reservas" en 2012-2015) que son reclasificaciones internas sin efecto en
el patrimonio total (el patrón: cuando el "Patrimonio Total" de la fila da 0,00, es una
reclasificación; cuando no da 0,00, es una salida real).

### Búsqueda de los hitos de designación de 2005 y 2015 (C10, no resuelto)

Búsquedas hechas, todas sin resultado para esos dos años específicos:
- `archivo.presidencia.gub.uy/sci/resoluciones/<AAAA>/<MM>/<MM>_<AAAA>.htm` para los meses 03 a 08 de
  2005 y 03 a 06 de 2015: HTTP 404 en los diez casos. El sistema de resoluciones publicadas por mes
  que sí funcionó para 2010 (`05_2010.htm`) no parece estar indexado, o no existe, para esos años.
- `WebSearch` con variantes de "presidente Banco de Seguros del Estado" + año + "designado"/"asume" +
  nombre del presidente de turno: sin resultado específico para 2005 ni 2015.
- Se encontró, en cambio, que Gustavo Vilaró era presidente del BSE en agosto de 2008
  (`archivo.presidencia.gub.uy/_web/fotos/2008/08/2008082804.htm`, "Lanzamiento de campaña
  publicitaria del BSE y UNASEV") y que Mario Castro, designado en 2010, siguió en el cargo hasta
  2020 (reemplazado por Amorín Batlle) — lo que sugiere que puede no haber existido una designación
  separada en 2015 si Castro continuó sin un nuevo trámite de venia, pero no hay documento que lo
  confirme ni que lo descarte.
- No se probó la Hemeroteca del Parlamento por fecha de sesión del Senado (búsqueda de "venia" +
  nombre del presidente): quedaría para una próxima vuelta con más presupuesto de tiempo, ahora que
  hay un nombre candidato para 2005-2008 (Vilaró) y para 2010-2020 (Castro).

Dado que no se encontró documento, no se inventó un hito para 2005 ni 2015; se dejaron los tres hitos
con fuente (2010, 2020, 2025) y el hueco queda documentado acá, no en la ficha.

### `hipotesis` (actualiza lo escrito en la primera vuelta)

- **`impuestos_pagados` de 2009, sigue sin publicar.** A diferencia de 2012 (ver C2), en 2009 no hay
  forma de aislar en qué renglón está el dígito que no reconcilia ($ 90.000 sobre $ 559.812.945): el
  candidato más simple ("Gastos de comunicación") no es el único posible. Sigue pendiente un segundo
  OCR o un documento con texto nativo.
- **`transferencias_al_estado` de 2005-2008, sin documento.** El reporte `estevpat` (ver arriba)
  devuelve HTTP 404 para esos cuatro años con los dos patrones de nombre de archivo probados
  (`bse<AAAA>1231.pdf` y `957_<AAAA>1231.pdf`), consistente con que no se exigía o no se publicaba
  antes del ejercicio 2009. No se probó el Diario Oficial para esos años específicamente en esta
  vuelta (si el Estado de Evolución del Patrimonio se publicaba ahí antes de que el BCU lo pidiera
  como reporte aparte, podría estar).
- **Hitos de designación 2005 y 2015, sin documento** (ver sección de arriba).

### `cobertura_del_periodo` (actualiza la tabla de la primera vuelta)

`transferencias_al_estado`, todos los años con documento salvo 2005-2008:

| Año | Monto | Documento |
|---|---|---|
| 2005-2008 | sin dato (no hueco declarado como cero) | `estevpat` da HTTP 404 |
| 2009 | $ 499,7 M | `estevpat/bse20091231.pdf` |
| 2010 | $ 0 | `estevpat/bse20101231.pdf` |
| 2011 | $ 478,5 M | `estevpat/bse20111231.pdf` |
| 2012 | $ 0 | `estevpat/bse20121231.pdf` |
| 2013 | $ 0 | `estevpat/bse20131231.pdf` |
| 2014 | $ 0 | `estevpat/bse20141231.pdf` |
| 2015-2019 | $ 0 cada año | `estevpat/bse<AAAA>1231.pdf` |
| 2020 | $ 1.300,0 M | `estevpat/bse20201231.pdf` + Nota 19.3 (OPP 015/C/20) |
| 2021-2022 | $ 0 (ya estaba) | Nota 19.3 |
| 2023 | $ 2.400,0 M | `estevpat/957_20231231.pdf` + Nota 20.3 (OPP 014/C/23, 032/C/23) |
| 2024 | $ 4.157,1 M (ya estaba) | Estados Contables BSE (institucional.bse.com.uy) |
| 2025 | $ 4.799,2 M ($ 3.000,0 M en "Efectivo" + $ 1.799,2 M en "Reserva Legal") | `estevpat/957_20251231.pdf` |

## referentes_faltantes

Ninguno nuevo en esta vuelta.

## objeciones_al_brief (vuelta 2)

Ninguna nueva. La corrección de derecho que hizo el crítico sobre el encargo original (el art. 11 de
la Carta Orgánica de 1911 no es una versión de utilidades; la obligación nace de leyes específicas o
de notas de OPP) se aplicó: el `resumen` y los campos de `transferencias_al_estado` no citan el art.
11 como base legal de las transferencias, solo las Notas OPP que efectivamente las ordenan (015/C/20,
014/C/23, 032/C/23), documentadas donde se encontraron.
