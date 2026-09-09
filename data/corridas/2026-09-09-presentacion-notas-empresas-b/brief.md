# Corrección de presentación: notas al pie de seis fichas de empresas (segunda del día)

Fecha: 2026-09-09. Tipo: `presentacion`. Afecta a `empresas/anp`, `alur`, `bhu`, `brou`, `bse` y
`ose`. La primera corrección de notas del día (`2026-09-09-presentacion-notas-empresas`) acortó las
notas de ANCAP, UTE y ANTEL; esta saca la narración de proceso que quedaba en las otras seis.

Veintiún conceptos de `finanzas[]` (doce de ANP, tres de BROU, tres de OSE, uno de ALUR, uno de BHU,
uno de BSE) remitían a `notas.md` o hablaban de «esta corrida», y el concepto se imprime como nota
al pie de la tabla. Cambio mecánico, hecho desde el chat con el lote
`inbox/reparaciones/notas-empresas-2026-09-09/` y el script local `.cache/limpiar-notas.ts`
(reemplazos de frase, sin tocar `notas_internas`). Ninguna cifra, fuente ni cotización cambia.

Lo señaló el editor del lote c (`2026-09-09-presentacion-narracion-c`), que tenía prohibido tocar
`finanzas`. `pnpm revisar:paginas` no lo veía porque excluía las notas al pie de las tablas de la
regla de narración de proceso; desde este mismo día las mira, y con esta corrección el contador de
pendientes de contenido llega a cero y el modo estricto pasa a ser el de siempre.
