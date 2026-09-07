# Brief de edición · corrida 2026-09-06-titulos-declaraciones

Regla 0: objetividad por encima de todo. Este lote toca a todos los políticos que tienen declaraciones publicadas, con el mismo criterio para cada uno. Si algo acá te parece asimétrico, decilo en el informe y aplicá el criterio simétrico.

## Encargo

84 declaraciones publicadas no tienen `titulo` (47 de lacalle-pou, 35 de orsi, 2 de mujica). El lector veía como título la primera oración del resumen, que es contexto ("En el coloquio Presidenciables 2019 de Deloitte y En Perspectiva, junto a sus asesores…") y no dice qué se afirmó. Este lote agrega **solo** `titulo` a cada registro; nada más cambia. Se aplica como una corrección de tipo `presentacion`, que se publica en el historial de cada registro.

## Qué leés

`inbox/titulos/2026-09-06/declaraciones-<politico>.yaml`, el archivo que te asignaron: copia exacta de cada registro publicado, con `_id` (no lo toques: es el id publicado) y `_investigacion` (tampoco).

## Qué escribís

- En cada registro, `titulo` (8 a 110 caracteres) con el criterio de tus instrucciones: **lo sustancial**, qué afirma, promete o niega la persona, de modo que se entienda solo en una lista. Sin el nombre de la persona (la página y las listas ya lo muestran), sin dónde ni ante quién (eso es el `resumen`), sin adjetivos, sin erratas del medio. Si el registro tiene varias afirmaciones, la principal, que es la que el resumen desarrolla primero.
  Ejemplos del mantenedor: para el coloquio de 2019, "Dispuesto a liberar la importación de combustibles si es electo"; para la conferencia tras el referéndum de 2022, "No cambiará el mecanismo de precios de los combustibles tras el referéndum de la LUC".
- Nada más. No toques `cita`, `resumen`, `evidencia`, `revision` ni ningún otro campo. Si al leer un registro ves un problema (una cita que parece cosida, un resumen que afirma más que la cita), anotalo en `data/corridas/2026-09-06-titulos-declaraciones/observaciones-<politico>.md` con el id y una línea; no lo corrijas acá.
- `data/corridas/2026-09-06-titulos-declaraciones/razones-<politico>.md`: una línea por registro, `<id>: <titulo>`. Es el registro del cambio contra `edicion.diff`; el orquestador junta los tres archivos en `razones.md`.

## Validación

`pnpm validar --inbox inbox/titulos/2026-09-06`, sin `--red`: este lote no agrega ni cambia citas, y `--red` volvería a verificar unas 200 URLs por nada. Si el validador señala un `titulo` fuera de rango, corregilo y volvé a correr.

## Informe

Menos de 15 líneas: cuántos títulos escribiste, los ids donde dudaste entre dos afirmaciones principales y cuál elegiste, las observaciones que dejaste, y el modelo con el que corriste.
