# Plan: cambio de id por corrección (`reemplaza` en pares)

Escrito el 2026-09-16 desde la sesión que decide (Fable), para el taller. Lo dispara la corrida de Batlle: diez registros de la última entrevista con El Observador llevan la fecha 2016-10-24 y la fuente dice 21 de setiembre de 2016; cuatro chequeos cuelgan de esas declaraciones y llevan su fecha en el id. Corregir la fecha cambia catorce ids, y hoy no hay forma de hacerlo sin improvisar.

## Qué hay hoy

- `CLAUDE.md`: «IDs = ruta del archivo. Nunca se renombran; los cambios van por `content/correcciones/` con `reemplaza:`».
- `src/schemas/correccion.ts`: `reemplaza` es **un** string (id completo del registro nuevo). Lo usa solo `pnpm lote fusionar` para fichas duplicadas de políticos.
- `scripts/promover.ts --correccion`: escribe los registros de `afecta`/`agrega` desde el lote y les pone `procedencia: {tipo: correccion, correccion}`. **No** borra el registro viejo, **no** reescribe quién lo referencia, **no** deja nada en la URL vieja.
- `scripts/validadores/referencias.ts`, paso 4: `afecta[]` y `reemplaza` tienen que apuntar a registros existentes. Después de un reemplazo el viejo ya no existe, así que la corrección misma dejaría de validar.
- `src/pages/correcciones.astro`: muestra «Reemplazado por <id>» si hay `reemplaza`.

## Decisión

Un cambio de id es una corrección normal (`tipo: error_factual` casi siempre), **una sola** aunque cambien catorce registros, con `reemplaza` como lista de pares. El registro viejo desaparece de `content/`, la URL vieja sigue respondiendo con una página que redirige a la nueva y nombra la corrección, y todo lo que apuntaba al id viejo pasa a apuntar al nuevo por la misma tabla que ya usa `lote fijar` dentro de un lote.

### Esquema (`src/schemas/correccion.ts`)

```yaml
reemplaza:
  - de: declaraciones/batlle/2016-10-24-impuestos-empezaran-cobrarse-enero-2017
    a: declaraciones/batlle/2016-09-21-impuestos-empezaran-cobrarse-enero-2017
  - de: chequeos/batlle/2016-10-24-rendicion-cuentas-2015-vigencia-enero-2017
    a: chequeos/batlle/2016-09-21-rendicion-cuentas-2015-vigencia-enero-2017
```

- `reemplaza: string | {de, a}[]`. El string sigue valiendo (fusiones de fichas) y significa lo de siempre; la lista es la forma mecánica. Cada `de` tiene que estar en `afecta[]` (existe y cambia: se retira) y cada `a` en `agrega[]` (no existía y entra). `de` y `a` de la misma colección. Ningún `a` repetido, ningún `de` repetido, ningún `a` igual a un `de`.
- `cambios[]` lleva, por par, `{registro: <a>, campo: id, de: <de>, a: <a>}`, para el historial del registro nuevo.

### `pnpm promover <dir> --correccion <id>` (`scripts/promover.ts`)

Con pares en `reemplaza`:

1. Verifica antes de escribir nada: cada `de` existe en `content/`; cada `a` no existe y está en el lote; el lote no trae ningún `de`.
2. Escribe los `a` desde el lote con `procedencia: {tipo: correccion, correccion}`, como hoy. Si un registro del lote referencia un `de` (el editor dejó `declaracion: <id viejo>` en el chequeo), lo reescribe al `a` correspondiente antes de escribir.
3. Borra los archivos de los `de`.
4. Recorre **todo** `content/` con la tabla `REFERENCIAS` de `scripts/validadores/referencias.ts` (la misma que usa `reescribirReferenciasDelLote` en `scripts/lote.ts`) y reescribe cada campo que apunte a un `de` por su `a`, sin re-serializar el YAML entero: reemplazo de la cadena exacta en la línea, y comprobación de que el archivo sigue parseando. Imprime cada archivo tocado.
5. En `--simulacion`, todo lo anterior como listado y nada escrito.
6. `--deshacer` de una corrección con pares: fuera de alcance por ahora; se dice en la ayuda (el camino es otra corrección al revés).

### Validador (`scripts/validadores/referencias.ts`, paso 4)

- `reemplaza` en lista: cada `a` existe; cada `de` **no** existe (si existe, error: «la corrección dice que lo reemplazó y sigue publicado»); cada `de` está en `afecta[]` y cada `a` en `agrega[]`.
- `afecta[]`: los ids que son `de` de un par quedan exentos de la regla «apunta a un registro existente».
- Ningún registro de `content/` puede referenciar un id que sea `de` de alguna corrección (queda una referencia rota disfrazada).

### Sitio

- Página del registro nuevo: una línea arriba del cuerpo, «Este registro reemplaza a `<de>` por la corrección <enlace> (<fecha>): <motivo corto>». Sale de leer las correcciones con pares.
- URL vieja: una ruta dinámica que enumera todos los `de` de todas las correcciones y genera en cada URL vieja una página mínima con `<meta http-equiv="refresh" content="0; url=<nueva>">`, `<link rel="canonical">` a la nueva, `noindex`, y un texto con el enlace y el motivo, por si el navegador no redirige. `urlDe(coleccion, id)` de `src/lib/permalinks.ts` da las dos URLs.
- `src/pages/correcciones.astro`: con lista, una línea por par («`de` → `a`»).
- `pnpm revisar:paginas` no cuenta las páginas de redirección como páginas con contenido (que no disparen `ficha sin ayuda visual` ni parecidos).

### Documentación

- `docs/colecciones/correcciones.md`: sección «Cambio de id» con el ejemplo de arriba y las cinco reglas (una corrección, pares, el viejo se retira, la URL vieja redirige, las referencias se reescriben solas).
- `CLAUDE.md`, invariante «IDs»: agregar «un cambio de id es una corrección con `reemplaza` en pares; `promover` retira el viejo y reescribe las referencias; la URL vieja redirige».
- `.claude/agents/editor.md`: cuando el editor de una corrección cambia una fecha que está en el id, escribe el registro nuevo en el lote con el id nuevo y deja los pares en `correcciones.yaml`; no toca `content/`.

### Tests

- Esquema: string y lista válidos; par con `de` fuera de `afecta` o `a` fuera de `agrega` inválido; `a` repetido inválido.
- `promover --correccion` sobre un `content/` temporal: declaración + chequeo que la referencia + giro que la referencia; la corrección reemplaza la declaración y el chequeo; después: los viejos no existen, los nuevos sí con procedencia de corrección, el giro apunta al id nuevo, el chequeo nuevo apunta a la declaración nueva; `--simulacion` no escribe.
- Validador: corrección con par cuyo `de` sigue existiendo → error; registro que referencia un `de` → error.
- Sitio: build de un fixture no hace falta; sí un test de la función que enumera los `de` y arma las rutas viejas.

## Qué no hacer

- No renombrar archivos a mano ni con `git mv`: sin corrección publicada no hay rastro, y la URL vieja queda muerta.
- No dejar el registro viejo publicado «por las dudas»: dos registros con la misma cita y distinta fecha son una contradicción a la vista.
- No usar diez correcciones para diez registros del mismo hecho: el lector tiene que leer un solo motivo.
