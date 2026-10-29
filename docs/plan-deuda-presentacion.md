# Plan: deuda de presentación en lo publicado

Escrito el 2026-09-16 desde la sesión que decide (Fable). Lo dispara la corrección de narración de proceso de ese día: al meter diez registros más en el lote, `validar --inbox` cortó con 72 errores de presentación que no tenían que ver con la frase corregida (notas largas, hitos de varias oraciones, `dato_real` de más de 350 palabras). Son reglas escritas después de que esos registros se publicaron. La regla «no peor que lo publicado» del validador en modo corrección (`docs/colecciones/correcciones.md`) evita que una corrección chica arrastre esa deuda; este plan es para pagarla.

## Medida (2026-09-16, `pnpm validar` sobre `content/`, etapa `presentacion` en modo aviso)

| qué | cuánto |
|---|---|
| avisos con archivo | 794, en 254 registros |
| una «nota» u «hito» que no es una sola oración o supera el máximo de caracteres | 420 |
| nivel `reportado` con un solo grupo de medios (registros en `probable`; no es deuda de presentación) | 104 |
| todas las fuentes con el mismo alineamiento (aviso informativo, no se corrige) | 71 |
| narración de proceso en `motivo` de correcciones (historial, no se corrige: `correcciones.md`) | 38 |
| párrafos de más de 60 palabras, títulos fuera de rango, fechas con precisión de año en cargos | ~40 |

Por colección: empresas 354 (OSE 70, BSE 45, ANTEL 38, UTE 36, BROU 35, Correo 32), casos 114, declaraciones 88, análisis 68, promesas 36, chequeos 26, políticos 23, temas 21, giros 13.

## Qué se paga y qué no

- **Se paga**: lo que el lector ve como bloque de texto: notas e hitos de varias oraciones o de más de 220 caracteres, párrafos largos de `analisis` y `dato_real`, títulos fuera de rango. Es la misma regla para todos: entra todo registro con al menos un aviso de esas reglas, sin elegir por persona ni empresa.
- **No se paga acá**: «reportado con un solo grupo» (es trabajo del resolvedor sobre `probable`), «mismo alineamiento» (es un dato, no un defecto), narración en `motivo` de correcciones viejas (historial), avisos de fuentes sin copia archivada (`pnpm archivar`).

## Cómo

Una corrección de tipo `presentacion` por colección, en este orden: empresas, casos, análisis, declaraciones, promesas, chequeos, políticos, temas, giros. Cada una con `afecta[]` de todos los registros de la colección con avisos de las reglas que se pagan (lista generada por script desde la salida de `validar`, no a mano), `motivo` de dos líneas para el lector («se partieron notas e hitos en oraciones; ninguna cifra, cita, calificación ni fuente cambió»).

- Lotes de no más de 30 registros por editor (regla 16); empresas va en dos o tres lotes.
- El editor solo parte, recorta y reordena texto. **Nada de fondo**: no cambia cifras, citas, calificaciones, niveles ni tiers. Si para cumplir un máximo hay que sacar información, la mueve a un campo plegado (`metodo`, `notas` de tabla) o la deja y anota el registro en `notas.md` como «no cabe sin perder dato»; ese registro sale del lote y se trata aparte.
- Antes de promover, un script compara publicado contra lote parseado: citas, URLs, calificaciones, niveles, tiers y todos los números idénticos. Si difiere algo, el lote no se promueve. Es lo que hizo a mano la corrección de narración del 2026-09-16; acá va como herramienta (`pnpm lote comparar <dir> --contra content/`, a agregar en el taller antes de la primera de estas correcciones).
- `validar --inbox` sobre el lote tiene que dar 0 errores de presentación **sin** apoyarse en «no peor que lo publicado»: esta corrección paga la deuda, no la hereda.
- Crítico como siempre (regla: una corrección pasa por crítico y editor), pero con brief corto: solo presentación y fidelidad.

## Medida del 2026-10-29 y decisión (Fable)

La sesión Sonnet midió antes de lanzar el primer lote y los números de setiembre no cierran: en `content/` de hoy hay 52 registros con avisos pagables (empresas 11, casos 17, giros 8, análisis 7, chequeos 6, vetos 3). Las 11 fichas de empresas traen 344: 253 de «más de 220 caracteres» (casi todos `concepto` y `nota` de las tablas de finanzas, entre 220 y 300 caracteres y con tres o más cifras), 90 de «más de un terminador» (unos 62 son puntos de siglas y abreviaturas: «Vida Prev.», «M.V.O.T.M.A.») y el resumen de ANTEL, 11 caracteres sobre el tope.

Pagar eso recortando perdería datos, que es lo que este plan prohíbe. La causa es otra: la regla «una oración y 220» para `concepto` y `nota` se escribió cuando ese texto iba dentro de la celda; desde setiembre la página de empresas lo saca de la celda y lo muestra como nota al pie plegada («Notas de la tabla»), y la segunda oración suele ser el criterio de suma o la reexpresión, que el lector necesita. Es el mismo caso que la nota de gráfico (excepción del 2026-09-17).

Decisión, en el taller antes del lote 1:

1. `contarTerminadores` no cuenta los puntos de siglas ni de abreviaturas conocidas, ni un punto seguido de minúscula.
2. `concepto` y `nota` de finanzas y segmentos admiten dos oraciones y 440 caracteres, como la nota de gráfico. `detalle`/`descripcion` de hito siguen en una y 220: se ven desplegados.
3. Con eso mergeado, Sonnet vuelve a medir y arma el lote 1 con lo que quede (dos o tres oraciones reales, lo que pase de 440, el resumen de ANTEL). Lo que no cabe sin perder dato, a `notas.md` y fuera del lote, como ya decía el plan.

Lo que no se toca: hitos, párrafos, títulos; esos límites siguen y se pagan.

## Orden de ejecución

1. **Hecho** (taller, 2026-09-16): `pnpm lote comparar <dir-inbox> [--contra <dir>] [--coleccion <coleccion>] [--permitir <campo>]...` en `scripts/lote.ts` — compara cada registro del lote, parseado, contra el publicado con el mismo id: citas, url/archived_url, calificacion/estado/evidencia.nivel/revision.tier/etiqueta_legal, y todo número suelto en cualquier campo (texto libre o serie/tabla), como multiconjuntos. `igual` / `nuevo` / lista de diferencias por registro, resumen final, exit 1 con diferencias. Documentado en la ayuda de `lote`, en `.claude/commands/correccion.md` (paso 4, "Aplicar") y con tests en `tests/lote.test.ts`. **Hecho** (taller, 2026-09-16): `pnpm validar --por-regla [<regla>]` en `scripts/validar.ts` — agrupa los avisos y errores de todas las etapas que corrieron por regla y colección (`claveDeRegla`/`agruparPorRegla`: la etapa `presentacion` ya trae un id de regla por hallazgo, `Problema.regla`; las demás se derivan de `etapa + campo` sin índices de lista) e imprime, por regla, cuántos registros y cuáles ids completos (`coleccion/id`), ordenados; `--por-regla-json <ruta>` escribe `{regla: {coleccion: [ids]}}` para que un script arme `afecta[]`. No cambia ningún resultado del validador ni su código de salida. Documentado en `CLAUDE.md` y con tests en `tests/validar.test.ts`.
2. Empresas, en dos o tres lotes; después del primero, revisar la ficha construida como lector antes de seguir.
3. El resto de las colecciones, una corrección por colección.
4. Al final, `pnpm validar` sobre `content/` con la etapa `presentacion` sin avisos de esas reglas; entonces la etapa puede pasar de aviso a error para lo publicado, y la deuda no vuelve.

## Qué no hacer

- No meter estos arreglos dentro de otra corrección (de fondo o de narración): el lector tiene que poder leer «solo cambió la forma» y creerlo.
- No elegir qué fichas arreglar por quién es: la lista sale del validador.
- No recortar `dato_real` o `analisis` sacando datos para cumplir un máximo.
