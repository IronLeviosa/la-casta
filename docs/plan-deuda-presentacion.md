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

## Orden de ejecución

1. Taller: `pnpm lote comparar` (fidelidad parseada publicado vs lote) y un `pnpm validar --avisos-por-regla` o equivalente que liste los ids con avisos de las reglas que se pagan, por colección.
2. Empresas, en dos o tres lotes; después del primero, revisar la ficha construida como lector antes de seguir.
3. El resto de las colecciones, una corrección por colección.
4. Al final, `pnpm validar` sobre `content/` con la etapa `presentacion` sin avisos de esas reglas; entonces la etapa puede pasar de aviso a error para lo publicado, y la deuda no vuelve.

## Qué no hacer

- No meter estos arreglos dentro de otra corrección (de fondo o de narración): el lector tiene que poder leer «solo cambió la forma» y creerlo.
- No elegir qué fichas arreglar por quién es: la lista sale del validador.
- No recortar `dato_real` o `analisis` sacando datos para cumplir un máximo.
