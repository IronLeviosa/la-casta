# Brief — fichas base de los candidatos a presidente de 2024

Semilla identitaria de la colección `politicos`. No busca declaraciones, promesas ni giros.
Producida por un subagente `investigador` en el brazo barato del experimento (Sonnet).

## Encargo (texto literal)

Semilla de fichas base (colección `politicos`) para los CANDIDATOS A PRESIDENTE de la elección nacional de octubre de 2024 en Uruguay. NO es una corrida de declaraciones: no busques declaraciones, promesas ni giros. Solo la ficha identitaria de cada persona.

**Criterio de inclusión, y es lo primero que tenés que resolver.** No trabajes de memoria ni sobre una lista que te den. Averiguá, con fuente, quiénes fueron TODOS los candidatos a la Presidencia que encabezaron un lema en esa elección, y cuántos votos sacó cada uno. Después incluí a todos los que superen el umbral, y el umbral es este, el mismo para todas las elecciones que se hagan después:

> Entra todo candidato cuyo lema haya obtenido representación parlamentaria (al menos una banca en Diputados o en Senadores) en esa elección.

Si un candidato queda afuera por el umbral, nombralo igual en `notas.md` con sus votos y decí que quedó afuera y por qué. Que se vea el corte, no solo lo que pasó el corte.

**Regla 0.** El criterio es el mismo para todos, sean del partido que sean. No agregues a uno porque te parece importante ni saltees a otro porque su partido es chico: el umbral decide. Si el umbral te deja afuera a alguien que claramente pesó en la elección, no lo agregues por tu cuenta: decilo en `notas.md` como objeción al brief y seguí.

**Ya existe** `content/politicos/orsi.yaml` (Yamandú Orsi, Frente Amplio, ganador). NO lo vuelvas a escribir. Si al investigar encontrás datos suyos que faltan en su ficha, anotalos en `notas.md`, no los toques.

Para cada persona escribí un registro en `inbox/candidatos/2024/2026-09-05/politicos.yaml` (una lista de registros en ese archivo), con el formato de `content/politicos/orsi.yaml`, que tenés que leer primero como modelo:

- `_slug`: slug corto y estable (ej. `delgado`, `manini-rios`). Fijate que no choque con un slug ya usado en `content/politicos/`.
- `nombre`: nombre completo legal.
- `nombre_corto`: como se lo nombra habitualmente.
- `partido`: el lema por el que se presentó en 2024.
- `wikidata`: identificador Q, si lo encontrás.
- `alias`: formas en que la prensa lo nombra.
- `mandatos`: TODOS los cargos electivos o de gobierno documentados (senador, diputado, ministro, intendente, comandante en jefe, presidente de ente, etc.), cada uno con `cargo`, `desde` (YYYY-MM-DD), `hasta` (omitir si sigue) y `fuentes` (mínimo 1). Ser candidato NO es un mandato: no lo pongas como cargo.
- `estado_actual`: `situacion` (`en_cargo`, `fuera_de_cargo`, `en_prision` o `fallecido`), con `salida: {tipo, fecha, fuentes}` si dejó su último cargo.
- `foto`: solo si hay imagen de licencia libre en Wikimedia Commons, con `url` como `/fotos/<slug>.jpg`, `credito`, `licencia`, `licencia_url`, `pagina`. Si no hay, omitila entera.
- NO escribas `revision.tier` ni `procedencia`. No te corresponde.

**Reglas obligatorias, y en los últimos seis lotes fallaron dos veces:**
- Cada `cita` es copia LITERAL y CONTIGUA de un texto que abriste en esta sesión, mínimo 20 caracteres. Nunca pegues dos fragmentos separados como si fueran uno, ni con puntos suspensivos.
- **Verificá que la cita diga lo que le hacés decir.** En el lote anterior se cerró un mandato en 2022 citando una nota que ese mismo día llamaba a la persona "el actual embajador". Antes de usar una cita para probar que alguien EMPEZÓ o TERMINÓ en un cargo, leé la oración entera y comprobá que efectivamente lo diga.
- Las notas se leen SOLO con `pnpm fuente <url>`. Buscá antes en el corpus con `pnpm corpus:buscar`.
- Nunca cites una URL que no abriste.
- Al menos una fuente por persona que no sea Wikipedia: Corte Electoral, Parlamento, IMPO, Presidencia, JUTEP, o prensa uruguaya (El País, la diaria, Montevideo Portal, Búsqueda, Brecha, La República, El Observador, Subrayado). El medio tiene que existir como slug en `content/medios/`; si falta, anotalo en `notas.md` en vez de inventarlo.
- Poné el mismo esfuerzo de búsqueda en todos. Al final, en `notas.md`, decí cuántas fuentes no-Wikipedia le encontraste a cada uno. Si a uno le encontraste cuatro y a otro una, decí si es porque hay menos material o porque buscaste menos.
- NO investigues casos judiciales de nadie. Si aparece alguno de pasada, anotalo en `notas.md` bajo `casos_vistos`, con la misma vara para todos.
- Lo que no puedas probar va a `notas.md` con el motivo.

Dejá también `consultas.jsonl` con cada búsqueda y cada URL abierta, en orden.

Al terminar corré `pnpm validar --inbox inbox/candidatos/2024/2026-09-05` y arreglá lo que falle.

Devolveme: la lista de candidatos con sus votos, cuáles entraron y cuáles no y por qué, qué fuentes usaste por persona, y qué te faltó.

## Mensajes posteriores al agente durante la corrida

1. Se agregó al esquema el campo `candidaturas` y se le pidió registrar la candidatura de cada
   persona ahí (fecha de la elección, lema, `resultado` electo/no electo, `detalle`, `votos` solo
   con fuente oficial), en vez de dejarla fuera del registro. Ser candidato sigue sin ser un
   mandato.
2. Se le avisó que las fechas de `mandatos` ya aceptan precisión de año o de mes (`1990`,
   `1990-03`), con la aclaración de que la regla no es poner el año sino poner lo que la fuente
   permita, y que el validador avisa por cada fecha imprecisa.

## Nota del mantenedor

Este archivo se escribió después de la corrida, no antes: al armar la carpeta se copiaron
`notas.md` y `consultas.jsonl` y se omitió el brief. Lo detectó el crítico del lote y lo marcó como
bloqueante, con razón. El texto de arriba es el prompt literal que recibió el agente, reconstruido
de la sesión; los dos mensajes posteriores están transcritos en resumen y no palabra por palabra.
