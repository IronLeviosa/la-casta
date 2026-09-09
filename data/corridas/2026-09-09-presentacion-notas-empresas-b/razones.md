# Razones (corrección de notas al pie, seis fichas de empresas, 2026-09-09)

Cambio mecánico de forma hecho desde el chat con `.cache/limpiar-notas.ts` sobre el lote
`inbox/reparaciones/notas-empresas-2026-09-09/`; ninguna cifra, fuente, cotización ni cita cambia.
Veintiún reemplazos, todos en `finanzas[].<monto>.concepto`:

- `empresas/anp` (12, impuestos pagados 2003 a 2015): «; ver notas.md.» → «.».
- `empresas/brou` (3) y `empresas/bse` (1): se quita «(detalle en notas.md)».
- `empresas/ose` (3): «OSE no tiene, en esta corrida, un documento propio…» → «OSE no tiene un documento propio…»; «en los balances leídos en esta corrida (2015, …)» → «en los balances leídos (2015, …)»; se quita «(ver notas.md, verificacion_manual)».
- `empresas/alur` (1): «al cierre de esta corrida (2026-09-09)» → «hasta el 2026-09-09».
- `empresas/bhu` (1): «que no se pudo consultar en esta corrida» → «que no se pudo consultar».

`notas_internas` no se tocó. El reemplazo se verificó recorriendo todas las cadenas del lote: no
queda «corrida» ni «notas.md» en ningún campo visible (la única aparición restante de «corrida» es
«corrida bancaria», en un hito de BROU).
