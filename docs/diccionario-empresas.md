# Diccionario de campos de la ficha de empresa pública

Qué renglón del documento es cada campo de `finanzas[]`, con la convención que el sitio usa en
todas las fichas. Existe porque cada lote de la primera tanda cargó un renglón distinto (el IRAE
solo en vez del total de tributos; el consolidado en vez del individual; la columna comparativa
reexpresada en vez del año propio) y el crítico lo encontró después. Las convenciones valen para
todas las empresas y todos los años, sea cual sea el gobierno.

| Campo | Qué es | Dónde está en el balance | Ejemplo |
|---|---|---|---|
| `resultado_ejercicio` | El renglón final del estado de resultados **individual o separado** (no consolidado), del propio ejercicio, en la moneda del propio ejercicio. | «Resultado del ejercicio» del Estado de Resultados individual. Si el balance siguiente lo reexpresa (NIIF, corrección de error), se carga el reexpresado con la cifra original en `nota`. | ANCAP 2020: reexpresado en el balance 2021 (Nota 30.2); OSE 2013: el modificado de los separados 2014. |
| `impuestos_pagados` | **Total de tributos** del año que la empresa paga o retiene (IMESI, IVA, IRAE, Patrimonio, otros), no un impuesto solo. | La nota de «impuestos», «tributos» o «cargas fiscales», o el anexo que los lista (UTE: Literal E/D; ANCAP: nota «Total impuestos»; ANP: nota de impuestos). | UTE 2024: Literal E, $ 11.860.529.396 (no el IRAE del flujo de efectivo, USD 32 M). |
| `transferencias_al_estado` | Lo que la empresa **vertió en efectivo** a Rentas Generales en el año (criterio de caja), no lo devengado. | Estado de flujos de efectivo o la nota de «versión de resultados» / «transferencias a Rentas Generales» (UTE: Literal F). El aporte a un fondo (Fondo de Estabilización Energética) no es transferencia: va en `nota` o en `capitalizaciones` según la dirección. | UTE 2022: «El pago de versión de resultados realizado en el presente ejercicio ascendió a $ 5.000.000.000». |
| `capitalizaciones_del_estado` | Lo que **el Estado puso** en la empresa: aportes de capital, subsidios, condonaciones, cobros de fondos. Cero con cita cuando el documento dice que no hubo; ausente cuando no se encontró. | Estado de evolución del patrimonio, nota de «aportes» o «subsidios», leyes de capitalización. | ANCAP 2016: Ley 19.368; UTE 2012: cobro del FEE $ 3.403.435.365; ANP: «no recibió subsidios». |
| `deuda_financiera` | Préstamos y obligaciones financieras al cierre, corriente más no corriente, individual. Si el balance la muestra neta de intereses a vencer o cambia de convención, se dice una vez en `nota`. | Nota de «préstamos», «deudas financieras» o «pasivos financieros». | OSE 2022: Nota 8.1, $ 15.954.923.019. |
| `segmentos[]` | Resultado (o ingresos, si el balance solo da eso) de cada negocio; el `concepto` dice cuál de los dos es, y toda la serie de una empresa usa el mismo. | Nota de información por segmentos (NIIF 8) o «desagregado por división» en balances viejos; en ANCAP, las presentaciones de resultados, no los estados contables. | ANTEL: ingresos por segmento; ANCAP: resultado operativo por línea. |
| `cotizacion` | Pesos por dólar con los que se convirtió, tal como los declara el balance (nota de moneda extranjera). | Nota de «moneda extranjera», «tipo de cambio de cierre» o «bases de preparación». | UTE 2004: $ 26,38; 2008: $ 24,362. |
| `tipo_cambio` | `cierre` (la cotización del último día del ejercicio) o `promedio`. El sitio usa `cierre`; si el documento solo da otra cosa, se declara. | Misma nota. | ANTEL 1997-2008: «por su monto original en dólares» → no es cierre. |
| `nota` | Una oración con lo específico de ese año. Las convenciones que se repiten (reexpresión hasta 2011, base mixta) van una sola vez en el `resumen`. | | |

## Reglas transversales

1. **Moneda del propio ejercicio.** Un balance reexpresado por inflación muestra el año anterior en moneda del año actual; se carga cada año desde su propio balance. Cuando solo existe la comparativa, se declara en `nota` y el dólar se calcula con la cotización del año al que está reexpresada la cifra, no con la del año propio.
2. **Individual, no consolidado.** Las subsidiarias tienen sus propios balances; mezclar bloques cambia el número (ANTEL 2024: +4,1 %).
3. **Caja, no devengado**, en transferencias e impuestos, para que un mismo peso no cuente dos veces (UTE 2007/2008).
4. **Un año sin balance propio** se carga desde la columna comparativa del balance siguiente, declarado en `nota`; un año sin documento queda ausente y la tabla de cobertura lo dice.
5. **Escaneos**: `pnpm fuente` los pasa por OCR; un dígito que depende de una corrección del OCR se publica solo si otro documento con texto lo confirma o la aritmética interna lo determina.
6. **Cita literal y contigua del texto que devolvió `pnpm fuente`**, verificada con `--red` antes de cerrar el lote.
7. **El inventario antes que la memoria**: `pnpm inventario <dominio>` (Wayback y sitemap) del sitio de la empresa **y del regulador que la supervisa** (el BCU publica los estados contables de cada banco y de cada aseguradora por año en `www.bcu.gub.uy`, desde 2005: los balances 2015-2019 del BSE «no existían» hasta que se miró ahí; para las aseguradoras, `reportes/estres`, `estsit`, `notas`, `resram` y, desde 2009 y en PDF, `estevpat`, el estado de evolución del patrimonio donde está lo vertido a Rentas Generales; para los bancos, `balaudi_<AAAA>12_<código>.pdf` por Wayback; URSEA y URSEC para energía y telecomunicaciones), la Hemeroteca del Parlamento para todo lo legislativo desde 1830, y el Diario Oficial (Biblioteca del Parlamento, búsqueda por texto) para lo que el artículo 191 de la Constitución obliga a publicar.
