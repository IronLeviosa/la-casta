## resultado de `pnpm validar --inbox inbox/resoluciones/brasil-datasets-2026-09-07 --red`

`✔ citas: 0 error(es) — 25 cita(s): 25 exacta(s), 0 aproximada(s), 1 manual(es), 24 de caché`
`✔ esquema/referencias/tiers/fuentes/simetria: 0 error(es)`

Las 25 citas que el validador puede verificar automáticamente (todas las de `dato_real.fuentes` y `evidencia.fuentes` salvo la del BCU) dan **exacta**. La única que queda **manual** es la del BCU (`cotizaciones.bcu.gub.uy`), documentada abajo. No hay avisos sobre este registro; los 9 avisos de "cobertura asimétrica" que deja el validador son sobre `content/temas/*` en general (qué políticos no tienen registros en cada tema) y no tienen relación con esta corrida.

## no_resueltas

- **`https://cotizaciones.bcu.gub.uy/wscotizaciones/servlet/awsbcucotizaciones`** (medio `bcu`, tipo `documento_oficial`, respalda el tipo de cambio del 25/03/2022 usado para convertir el precio uruguayo a USD en `dato_real`). `pnpm fuente` devolvió 0 chars tanto en la primera lectura (entrada de corpus vieja) como con `--forzar` (bajada nueva, también 0 chars). Investigué por qué: `awsbcucotizaciones` es un web service SOAP que solo responde a POST con un envelope XML (parámetros `Moneda`, `FechaDesde`, `FechaHasta`, `Grupo`); no existe una variante GET/REST. `pnpm fuente` hace un GET simple, así que nunca va a poder leer esta URL tal como está armada, más allá de que ahora sepa parsear xlsx/csv/zip/JSON: el problema acá no es el formato del archivo sino el método HTTP. Confirmé esto buscando la documentación del servicio (ver `consultas.jsonl`) y no encontré ninguna variante GET. No toqué la fuente: queda tal cual estaba, con `verificacion: manual`. Esto no lo puede resolver el resolvedor con las herramientas que tiene (no está habilitado a hacer POST); haría falta que `pnpm fuente` soporte SOAP, o cambiar la fuente por una que sí tenga variante GET (por ejemplo, si el BCU publica esta misma serie diaria en un dataset de `catalogodatos.gub.uy`, cosa que no busqué porque excede el encargo de esta corrida, que es específicamente sobre las 8 fuentes ya identificadas en el brief).

## discrepancias_encontradas

- **`mensal-brasil-2001-a-2012.xlsx` (ANP), fila GASOLINA COMUM 2001-07-01.** El registro publicado tenía como `cita`: `"Ejemplo de fila: 2001-07-01, GASOLINA COMUM, R$/l, 1.5875"`. La fila real que imprime `pnpm fuente` para esa fecha y producto es: `2001-07-01	GASOLINA COMUM	18708	R$/l	1.6814	0.09923	1.379	2	0.214	0.059	1.4673	0.07636	0.895	1.791	0.052` — es decir, PRECIO MÉDIO REVENDA = 1.6814 R$/l y PRECIO MÉDIO DISTRIBUIÇÃO = 1.4673 R$/l. Ninguna de las dos columnas de precio coincide con el 1,5875 que tenía la cita anterior; no encontré ninguna otra columna de esa fila que dé ese valor. No corregí el número: dejo la fila real como nueva `cita` (ya no dice "Ejemplo de fila", dice la fila tal cual) y anoto acá la discrepancia para que el editor decida. Importante: este valor de 1,5875 no aparece citado en ningún lugar de `dato_real.valor`, `analisis` ni `grafico` — es decir, la calificación y el análisis del chequeo no dependen de esa cifra puntual de julio de 2001; la fuente solo ilustraba que la serie ANP 2001-2012 existe y es legible. El cambio de cita no afecta ningún número del cuerpo del chequeo.

## otras observaciones (no son discrepancias numéricas)

- La cita original de la fuente `dolar%20promedio.zip` (MIEM) decía `"FUENTE: BCU; OBSERVACIONES: Dólar interbancario vendedor Fondo BCU."`, uniendo con "; " dos líneas que en el archivo real están separadas (`FUENTE:` y `BCU` en una fila, `OBSERVACIONES` sola en la fila siguiente sin texto después de las tabulaciones, y `Dólar interbancario vendedor Fondo BCU.` recién en la fila siguiente a esa). No es un tramo literal y contiguo del archivo, así que la reemplacé por dos filas reales de datos contiguas (2022-03: 42,243; 2022-04: 41,149 — el dólar promedio de marzo y abril de 2022; marzo es el mismo mes de la declaración) en vez de reconstruir el texto de las notas del archivo. Uso dos filas en vez de una sola porque la fila de un solo mes (`2022	3	42.243`) tiene 13 caracteres, menos del mínimo de 20 que exige el esquema para toda `cita`.
- La cita original de `CotacaoDolarDia` (Olinda/BCB) tenía los valores con ceros de relleno (`4.77760`, `4.77820`) que el JSON real no trae (`4.7776`, `4.7782`, sin el cero final) — mismo valor numérico, solo cambia el formato de impresión; no es una discrepancia de dato, es una cuestión de cómo estaba tipeada la cita anterior.
- La cita original de la API SGS 3695 (BCB) tenía el JSON compacto sin espacios (`{"data":"01/12/2022","valor":"5.2171"}`); la respuesta real trae espacios después de las llaves y de los dos puntos (`{ "data": "01/12/2022", "valor": "5.2171" }`). El validador de citas marcó la primera versión como "aproximada (0.95)"; con los espacios agregados pasó a "exacta (1.00)".

## Verificación de las 8 fuentes con `verificacion: manual`

| # | Fuente | Resultado |
|---|---|---|
| 1 | BCU cotizaciones (SOAP) | **No resuelta.** Servicio requiere POST/SOAP, `pnpm fuente` hace GET. Queda `verificacion: manual`. |
| 2 | BCB Olinda `CotacaoDolarDia` | Resuelta, cita exacta. Fragmento JSON literal (`cotacaoCompra`/`cotacaoVenda`/`dataHoraCotacao`). |
| 3 | URSEA `Series_PPI_VS_PE_0.xlsx` | Resuelta, cita exacta. Fila de 2009-05-01 (el mes más citado en el análisis: el único con nafta y gasoil uruguayos más baratos que los brasileños a la vez). |
| 4 | ANCAP/catalogodatos csv | Resuelta, cita exacta. La cita ya tenía el valor correcto (`2022;3;GASOIL 10-S *;67,3;$/lt`); solo le saqué el prefijo "Fila de ejemplo:" que no es parte literal del archivo, y quité `verificacion: manual`. |
| 5 | MIEM `dolar promedio.zip` | Resuelta, cita exacta, con cita nueva de dos filas (ver arriba, la anterior no era contigua ni llegaba a 20 caracteres). |
| 6 | ANP `mensal-brasil-2001-a-2012.xlsx` | Resuelta, cita exacta, con discrepancia numérica documentada arriba. |
| 7 | ANP `mensal-brasil-desde-jan2013.xlsx` | Resuelta, cita exacta. La cita ya era literal y contigua (confirmada tal cual); solo se le quitó `verificacion: manual`. |
| 8 | BCB SGS 3695 (API) | Resuelta, cita exacta tras corregir el espaciado del JSON (ver arriba). |

Total: 7 de 8 quedaron con cita verificable (todas "exacta") y sin `verificacion: manual`; 1 (BCU cotizaciones) sigue en manual porque el problema es el método HTTP del servicio, no el formato del archivo.

## objeciones_al_brief

Ninguna. El brief pide resolver una sola figura (Lacalle Pou) porque es el único registro de la corrida con este motivo específico (fuentes de dato_real en verificacion: manual tras la mejora de pnpm fuente para leer binarios); no encontré indicio de que haya chequeos equivalentes de otros políticos con el mismo motivo pendientes de resolver en esta corrida. Si los hay, deberían resolverse con el mismo criterio.
