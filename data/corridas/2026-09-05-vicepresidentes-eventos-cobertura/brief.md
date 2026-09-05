# Brief — eventos y cobertura del lote de vicepresidentes

Rescate de los registros de `cobertura` que los dos críticos del lote de vicepresidentes
escribieron dentro de sus archivos de crítica, en bloques YAML, porque los eventos que
referencian no existían. El encargo literal que recibió el agente:

Los dos críticos del lote de vicepresidentes escribieron registros de `cobertura` (tono de notas de prensa) dentro de sus archivos de crítica, en bloques YAML, porque los eventos que referencian todavía no existen. Hay que rescatarlos: hoy el hallazgo está sepultado en un archivo de texto y no llega al sitio.

Archivos:
- `data/corridas/2026-09-05-vicepresidentes-fichas-2000-2015/critica.md` (5 registros de cobertura)
- `data/corridas/2026-09-05-vicepresidentes-fichas-2015-2030/critica.md` (7 registros de cobertura)

Cada registro tiene un `evento: "propuesto:<slug>"`, que es un evento que hay que crear.

**Tu trabajo:**

1. Leé las dos críticas y extraé los 12 registros de cobertura.
2. Hacé la lista de eventos propuestos y **unificalos**: si dos críticos propusieron eventos distintos para el mismo hecho, es un solo evento. Ese es el motivo principal por el que esto se hace en un solo pase y no lote por lote.
3. Para cada evento, escribí una ficha en `inbox/vicepresidentes/eventos-y-cobertura/2026-09-05/eventos.yaml`, con el formato de `content/eventos/` (leé dos fichas existentes primero como modelo). Cada evento necesita su fuente, así que abrí con `pnpm fuente` lo que haga falta. Buscá antes en el corpus con `pnpm corpus:buscar`: varias de estas notas ya están bajadas.
4. Escribí los 12 registros de cobertura en `inbox/vicepresidentes/eventos-y-cobertura/2026-09-05/cobertura.yaml`, con el `evento` apuntando ya al slug real y no al `propuesto:`.
5. **Verificá cada cita antes de copiarla.** No confíes en que la cita que puso el crítico sea literal: abrí la nota con `pnpm fuente <url> --buscar "<un tramo>"` y comprobá que aparezca así, contigua, en el original. Si una cita está cosida de dos fragmentos o no aparece, arreglala con un tramo contiguo real o sacá el registro y explicá por qué. Esto ya pasó en cinco lotes distintos.
6. Verificá que cada `medio` exista como slug en `content/medios/`. Si falta alguno, NO lo inventes: anotalo en `notas.md`.
7. `notas.md` con lo que no se pudo probar y por qué.

**Regla 0, y acá pesa más que en otros lotes.** El campo `tono` califica cómo trata la prensa a un político, y es el más fácil de sesgar sin darse cuenta. Antes de terminar, contá cuántos registros favorables, neutrales y desfavorables quedaron por partido de la persona cubierta, y ponelo en `notas.md`. Si el reparto queda desbalanceado, no lo maquilles: decilo y explicá si es por lo que dicen las notas o por cómo se eligieron. Si te parece que un tono asignado por un crítico no se sostiene con la cita que él mismo puso, cambialo y dejá dicho cuál cambiaste y por qué.

No asignes `revision.tier` ni `procedencia`. No escribas en `content/`. No corras `pnpm promover`.

Al terminar corré `pnpm validar --inbox inbox/vicepresidentes/eventos-y-cobertura/2026-09-05` hasta que dé 0 errores.

Devolveme: cuántos eventos creaste, cuántos registros de cobertura quedaron, el reparto de tono por partido, qué citas tuviste que arreglar y qué registros descartaste.
