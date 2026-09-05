# Brief — fichas base de los candidatos a presidente de 2019

Semilla identitaria de la colección `politicos`. No busca declaraciones, promesas ni giros.
Producida por un subagente `investigador` en el brazo barato del experimento (Sonnet).

## Encargo (texto literal)

Semilla de fichas base (colección `politicos`) para los CANDIDATOS A PRESIDENTE de la elección nacional de octubre de 2019 en Uruguay. NO es una corrida de declaraciones: no busques declaraciones, promesas ni giros. Solo la ficha identitaria y la candidatura.

**Criterio de inclusión.** No trabajes de memoria. Averiguá con fuente quiénes fueron TODOS los candidatos a la Presidencia que encabezaron un lema en 2019 y cuántos votos sacó cada uno. Entra todo candidato cuyo lema haya obtenido al menos una banca en Diputados o en Senadores en esa elección. Es el mismo umbral que se aplicó a 2024 y que se va a aplicar a todas.

A los que quedan afuera, nombralos igual en `notas.md` con sus votos y sus bancas, y decí que quedaron afuera y por qué. Que se vea el corte, no solo lo que lo pasó.

**Regla 0.** El criterio es el mismo para todos, sean del partido que sean. No agregues a nadie por parecerte importante ni saltees a nadie por tener un partido chico: el umbral decide. Si el umbral te deja afuera a alguien que claramente pesó en la elección, decilo en `notas.md` como objeción al brief y seguí.

**Atención: varias de estas personas YA TIENEN ficha en `content/politicos/`.** Mirá el directorio antes de empezar. Al menos Lacalle Pou está, y probablemente también Manini Ríos y Mieres si ya se promovió el lote de 2024. Para esas personas:

- NO crees un registro nuevo con otro slug. Usá el `_slug` que ya tienen.
- Escribilas en un archivo aparte: `inbox/candidatos/2019/2026-09-05/politicos-existentes.yaml`. Copiá su registro actual de `content/` entero, quitale el bloque `procedencia` (no te corresponde) y agregale lo que falte: la entrada de `candidaturas` de 2019 y cualquier mandato documentado que le falte.
- En `notas.md` decí exactamente qué le agregaste a cada una.

Las personas que NO tienen ficha van en `inbox/candidatos/2019/2026-09-05/politicos.yaml`, con el formato de `content/politicos/orsi.yaml`, que tenés que leer primero como modelo:

- `_slug` corto y estable, que no choque con uno ya usado.
- `nombre`, `nombre_corto`, `partido` (el lema por el que se presentó en 2019), `wikidata` si lo encontrás, `alias`.
- `mandatos`: TODOS los cargos electivos o de gobierno documentados, con `cargo`, `desde`, `hasta` (omitir si sigue) y `fuentes` (mínimo 1). Ser candidato NO es un mandato.
- `estado_actual` con `situacion` y, si dejó su último cargo, `salida: {tipo, fecha, fuentes}`.
- `foto` solo si hay imagen de licencia libre en Wikimedia Commons.
- NO escribas `revision.tier` ni `procedencia`.

**Las fechas de `mandatos` aceptan `2019`, `2019-03` o `2019-03-05`.** Buscá siempre primero el día exacto; usá menos precisión solo cuando la fuente no dé más, y decí en `notas.md` cuáles quedaron imprecisas y por qué. El validador avisa por cada una: la excepción existe para cuando la fuente no alcanza, no para ahorrar trabajo.

**`candidaturas`** va en todas las fichas, nuevas y existentes. Leé la definición en `src/schemas/politico.ts` (buscá `const Candidatura`). Una entrada por la elección de 2019, con `cargo: Presidencia de la República`, `fecha` de la elección, `lema`, `resultado` (`electo` o `no_electo`), `detalle` con lo que el enum no captura (que pasó a balotaje, cuántas bancas sacó su lema, si se presentó por un lema distinto al partido en el que milita hoy) y `votos` solo si tenés fuente oficial. Si la persona ya tiene candidaturas cargadas de otra elección, conservalas y agregá la de 2019.

**Reglas obligatorias, y en los últimos lotes fallaron varias veces:**
- Cada `cita` es copia LITERAL y CONTIGUA de un texto que abriste en esta sesión, mínimo 20 caracteres. Nunca pegues dos fragmentos separados, ni con puntos suspensivos.
- **Verificá que la cita diga lo que le hacés decir.** Dos errores reales de este mismo proyecto: se cerró un mandato en 2022 citando una nota que ese día llamaba a la persona "el actual embajador", y se dio por renunciado a alguien con una nota que solo decía que "anunció que renunciará". Antes de usar una cita para probar que alguien empezó o terminó en un cargo, leé la oración entera.
- Las notas se leen SOLO con `pnpm fuente <url>`. Buscá antes en el corpus con `pnpm corpus:buscar`.
- Nunca cites una URL que no abriste.
- Al menos una fuente por persona que no sea Wikipedia.
- El medio tiene que existir como slug en `content/medios/`; si falta, anotalo en `notas.md` en vez de inventarlo.
- Mismo esfuerzo de búsqueda para todos. Al final decí en `notas.md` cuántas fuentes no-Wikipedia le encontraste a cada uno, y si el reparto queda desparejo explicá si es por el material o por cuánto buscaste.
- NO investigues casos judiciales. Si aparece alguno de pasada, a `notas.md` bajo `casos_vistos`, con la misma vara para todos.

Dejá `consultas.jsonl` con cada búsqueda y cada URL abierta, en orden.

Al terminar corré `pnpm validar --inbox inbox/candidatos/2019/2026-09-05` y arreglá lo que falle.

Devolveme: la lista de candidatos con votos y bancas, cuáles entraron y cuáles no, cuáles ya tenían ficha y qué les agregaste, qué fuentes usaste por persona y qué te faltó.

## Nota del mantenedor

El brief anticipaba que Manini Ríos y Mieres podían ya tener ficha "si ya se promovió el lote de
2024". No lo estaba cuando este agente miró el directorio, así que les escribió fichas nuevas; el
lote de 2024 se promovió mientras este corría. La colisión quedó para que la resuelva la crítica.
