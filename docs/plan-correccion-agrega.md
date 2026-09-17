# Plan: `agrega` tiene que existir, en el lote y en lo publicado

Escrito el 2026-09-16 desde la sesión que decide (Fable), para el taller. Lo dispara la corrección `2026-09-16-astori-irpf-2016-05` (main, 97d1fcb): su `agrega` nombra `discrepancias/astori-franja-irpf-33041-50110-2016` y `discrepancias/astori-plazo-rendicion-cuentas-31-de-junio-2016`, pero el id que el lote deriva para esas dos discrepancias es `discrepancias/el-observador/2016-05-27-astori-…`. `promover --correccion` escribió solo `afecta` (2 registros), no escribió las discrepancias, y `pnpm validar` dio 0 errores: hoy hay una corrección publicada que dice haber agregado dos registros que no existen, y las discrepancias siguen en `inbox/correcciones/astori-irpf-2016-05/discrepancias.yaml`.

## Qué hay hoy

- `scripts/validadores/referencias.ts`, paso 4: `afecta[]` tiene que existir (salvo los `de` de pares publicados); `reemplaza` se comprueba en las dos formas. **`agrega[]` no se comprueba.**
- `scripts/promover.ts --correccion`: recorre el lote y escribe cada registro cuyo id está en `afecta` o `agrega`. Un id de `agrega` que no coincide con ningún registro del lote no es error ni aviso; un registro del lote que no está ni en `afecta` ni en `agrega` tampoco (comprobar: si se promueve igual, es peor).

## Decisión

1. **Validador (paso 4 de `referencias`)**: en `content/`, cada id de `agrega[]` de una corrección `aplicada` tiene que existir (error: «la corrección dice que agregó X y X no está publicado»). Con `--inbox`, cada id de `agrega[]` tiene que coincidir con un registro del lote (id derivado, `pnpm lote listar`), y cada registro del lote tiene que estar en `afecta[]` o `agrega[]` (error en las dos direcciones, con los ids que sí derivó el lote en el mensaje, para que el editor corrija `correcciones.yaml` y no adivine).
2. **`promover --correccion`**: antes de escribir nada, la misma comprobación; si falla, no promueve y lista los ids de `agrega` sin registro y los ids del lote sin lugar. Nunca escribir «lo que coincide» y callar el resto.
3. **Lo publicado**: al mergear esto, `pnpm validar` sobre `content/` va a marcar la corrección de Astori. Se arregla con **otra corrección** (`afecta: [correcciones/2026-09-16-astori-irpf-2016-05]`, `agrega: [las dos discrepancias con el id derivado]`, motivo para el lector: «la corrección nombró las discrepancias con un id que no era el del lote; se publican con su id»). No se edita la corrección publicada a mano ni se renombra nada. El lote ya existe en `inbox/correcciones/astori-irpf-2016-05/`; el editor solo mueve las dos discrepancias a un lote nuevo con su `correcciones.yaml`.
4. **Tests**: corrección con `agrega` que no coincide con el lote → `validar --inbox` error y `promover --correccion` se niega; corrección publicada con `agrega` inexistente → error en `content/`; el caso bueno (ids derivados iguales a `agrega`) sigue pasando.

## Orden

1. Taller: 1, 2 y 4 (un agente Sonnet). Merge cuando Opus diga «no hay agentes».
2. Main: `pnpm validar` marca la corrección; Opus arma la corrección del punto 3 con las dos discrepancias y la promueve.

## Qué no hacer

- No «arreglar» `agrega` en el yaml publicado: es un registro publicado y cambia solo por corrección.
- No renombrar las discrepancias para que coincidan con lo que dice `agrega`: el id lo deriva el lote, no la corrección.
