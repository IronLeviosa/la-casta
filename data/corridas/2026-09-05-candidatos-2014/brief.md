# Brief — fichas base de los candidatos a presidente de 2014

Semilla identitaria de la colección `politicos`. No busca declaraciones, promesas ni giros.
Producida por un subagente `investigador` en el brazo barato del experimento (Sonnet).

## Encargo (texto literal)

Semilla de fichas base (colección `politicos`) para los CANDIDATOS A PRESIDENTE de la elección nacional de octubre de 2014 en Uruguay. NO es una corrida de declaraciones: no busques declaraciones, promesas ni giros. Solo la ficha identitaria y la candidatura.

**Criterio de inclusión.** No trabajes de memoria. Averiguá con fuente quiénes fueron TODOS los candidatos a la Presidencia que encabezaron un lema en 2014 y cuántos votos sacó cada uno. Entra todo candidato cuyo lema haya obtenido al menos una banca en Diputados o en Senadores en esa elección. Es el mismo umbral que se aplicó a 2024 y a 2019.

A los que quedan afuera, nombralos igual en `notas.md` con sus votos y sus bancas, y decí que quedaron afuera y por qué. Que se vea el corte, no solo lo que lo pasó.

**Regla 0.** El criterio es el mismo para todos, sean del partido que sean. No agregues a nadie por parecerte importante ni saltees a nadie por tener un partido chico: el umbral decide. Si el umbral te deja afuera a alguien que claramente pesó en la elección, decilo en `notas.md` como objeción al brief y seguí.

**Personas que ya están cargadas, y esto es lo primero que tenés que resolver.** En el lote de 2019 pasó que se escribieron fichas duplicadas porque el agente miró solo `content/politicos/` y las otras estaban todavía sin promover. No repitas eso: mirá los DOS lugares antes de empezar.

1. `content/politicos/` — las fichas ya publicadas.
2. `inbox/candidatos/2024/2026-09-05/politicos.yaml` y `inbox/candidatos/2019/2026-09-05/politicos.yaml` y `politicos-existentes.yaml` — lotes hermanos que pueden no estar promovidos todavía.

Hacé la lista de slugs ya usados en cualquiera de esos lugares antes de escribir el primer registro. Para 2014 es casi seguro que al menos Tabaré Vázquez y Luis Lacalle Pou ya estén.

Para una persona que ya existe en cualquiera de esos lugares:
- NO crees un registro nuevo con otro slug. Usá el `_slug` que ya tiene.
- Escribila en `inbox/candidatos/2014/2026-09-05/politicos-existentes.yaml`. Copiá su registro actual entero (de `content/` si está publicado, del inbox hermano si no), quitale `procedencia` y agregale lo que falte: la entrada de `candidaturas` de 2014 y cualquier mandato documentado que le falte.
- En `notas.md` decí de dónde sacaste el registro base y qué le agregaste.

Las personas que no existen en ningún lado van en `inbox/candidatos/2014/2026-09-05/politicos.yaml`, con el formato de `content/politicos/orsi.yaml`, que tenés que leer primero como modelo:

- `_slug` corto y estable, que no choque con uno ya usado.
- `nombre`, `nombre_corto`, `partido` (el lema por el que se presentó en 2014), `wikidata` si lo encontrás, `alias`.
- `mandatos`: TODOS los cargos electivos o de gobierno documentados, con `cargo`, `desde`, `hasta` (omitir si sigue) y `fuentes` (mínimo 1). Ser candidato NO es un mandato. **Puede quedar vacío**: el esquema ahora admite a quien solo fue candidato y nunca ejerció un cargo, así que no le inventes un mandato a nadie para que el registro pase.
- `estado_actual` con `situacion` y, si dejó un cargo que efectivamente ejerció, `salida: {tipo, fecha, fuentes}`.
- `foto` solo si hay imagen de licencia libre en Wikimedia Commons.
- NO escribas `revision.tier` ni `procedencia`.

**Las fechas de `mandatos` aceptan `2014`, `2014-03` o `2014-03-05`.** Buscá siempre primero el día exacto; usá menos precisión solo cuando la fuente no dé más, y decí en `notas.md` cuáles quedaron imprecisas y por qué.

**`candidaturas`** va en todas las fichas, nuevas y existentes. Leé la definición en `src/schemas/politico.ts` (buscá `const Candidatura`). Una entrada por 2014, con `cargo: Presidencia de la República`, `fecha` de la instancia que decidió la suerte de esa persona (primera vuelta para quien quedó ahí, balotaje para quien llegó), `lema`, `resultado`, `detalle` y `votos` solo con fuente. Si la persona ya tiene candidaturas de otra elección, conservalas y agregá la de 2014.

**Reglas obligatorias, y en los últimos lotes fallaron varias veces:**
- Cada `cita` es copia LITERAL y CONTIGUA de un texto que abriste en esta sesión, mínimo 20 caracteres. Nunca pegues dos fragmentos separados, ni con puntos suspensivos.
- **Verificá que la cita diga lo que le hacés decir.** Dos errores reales de este proyecto: se cerró un mandato en 2022 citando una nota que ese día llamaba a la persona "el actual embajador", y se dio por renunciado a alguien con una nota que solo decía que "anunció que renunciará".
- Las notas se leen SOLO con `pnpm fuente <url>`. Buscá antes en el corpus con `pnpm corpus:buscar`.
- Nunca cites una URL que no abriste.
- Al menos una fuente por persona que no sea Wikipedia.
- El medio tiene que existir como slug en `content/medios/`; si falta, anotalo en `notas.md` en vez de inventarlo. Lo mismo con el lema: si un partido no está en `data/alias.yaml`, anotalo.
- Mismo esfuerzo de búsqueda para todos, y decí en `notas.md` cuántas fuentes no-Wikipedia le encontraste a cada uno.
- NO investigues casos judiciales. Si aparece alguno de pasada, a `notas.md` bajo `casos_vistos`, con la misma vara para todos.

Dejá `consultas.jsonl` con cada búsqueda y cada URL abierta, en orden.

Al terminar corré `pnpm validar --inbox inbox/candidatos/2014/2026-09-05` y arreglá lo que falle.

Devolveme: la lista de candidatos con votos y bancas, cuáles entraron y cuáles no, cuáles ya existían y dónde los encontraste, qué fuentes usaste por persona y qué te faltó.

## Nota del mantenedor sobre el orden de promoción

Este lote depende de dos que todavía no estaban promovidos cuando corrió. La ficha de Lacalle Pou
que usó como base salió de `inbox/candidatos/2019/`, no de `content/`, porque la del inbox era más
completa. Eso significa que 2019 tiene que promoverse antes que 2014, y que la versión de Lacalle
Pou de este lote hay que rebasarla sobre la que quede publicada.
