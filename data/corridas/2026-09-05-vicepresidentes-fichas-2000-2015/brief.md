# Brief — fichas base de los vicepresidentes de Uruguay, período 2000-2015

Semilla identitaria de la colección `politicos`: no busca declaraciones, promesas ni giros.
Producida por un subagente `investigador` en el brazo barato del experimento (Sonnet).

## Encargo (texto literal)

Semilla de fichas base (colección `politicos`) para los VICEPRESIDENTES de Uruguay de los períodos 2000-2005, 2005-2010 y 2010-2015. NO es una corrida de declaraciones: no busques declaraciones, promesas ni giros. Solo la ficha identitaria de cada persona.

Personas (verificá cada dato, no des ninguno por sabido):
1. Vicepresidente del período 2000-2005 (gobierno de Jorge Batlle).
2. Vicepresidente del período 2005-2010 (primer gobierno de Tabaré Vázquez).
3. Vicepresidente del período 2010-2015 (gobierno de José Mujica).

Regla 0: el criterio es el mismo para los tres, sean del partido que sean. No omitas ni suavices nada de ninguno.

Para cada persona escribí un registro en `inbox/vicepresidentes/semilla-2000-2015/2026-09-05/politicos.yaml` (una lista de registros en ese archivo) con exactamente estos campos, mismo formato que `content/politicos/orsi.yaml` (leelo primero como modelo):

- `_id`: slug corto (ej. `nin-novoa`).
- `nombre`: nombre completo legal.
- `nombre_corto`: como se lo nombra habitualmente.
- `partido`: partido al que pertenecía al asumir.
- `wikidata`: identificador Q, si lo encontrás.
- `alias`: lista de formas en que la prensa lo nombra.
- `mandatos`: TODOS los cargos electivos o de gobierno que le encuentres documentados (no solo la vicepresidencia: senador, ministro, intendente, etc.), cada uno con `cargo`, `desde` (YYYY-MM-DD), `hasta` (omitir si sigue), y `fuentes` (mínimo 1). El cargo de vicepresidente se escribe exactamente `Vicepresidente de la República`.
- `estado_actual`: `situacion` (`en_cargo`, `fuera_de_cargo`, `en_prision` o `fallecido`). Si falleció, agregá `salida: {tipo: fallecimiento, fecha, fuentes}`. Si dejó un cargo por renuncia o destitución, `salida: {tipo, fecha, fuentes}`.
- NO escribas `revision.tier` ni `procedencia`. No te corresponde.
- `foto`: solo si encontrás una imagen de licencia libre en Wikimedia Commons; incluí `url` (dejala como `/fotos/<slug>.jpg`), `credito`, `licencia`, `licencia_url`, `pagina`. Si no hay, omitila entera.

Reglas obligatorias:
- Cada `cita` es copia LITERAL y CONTIGUA de un texto que abriste en esta sesión, mínimo 20 caracteres. Nunca pegues dos fragmentos separados como si fueran uno.
- Las notas se leen SOLO con `pnpm fuente <url>`. Buscá antes en el corpus con `pnpm corpus:buscar`.
- Nunca cites una URL que no abriste.
- Wikipedia sirve para la ficha básica, pero buscá al menos una fuente que no sea Wikipedia por persona (Corte Electoral, Parlamento, IMPO, Presidencia, o prensa uruguaya: El País, la diaria, Montevideo Portal, Búsqueda, Brecha, La República, El Observador). El medio tiene que existir como slug en `content/medios/`; si el medio que usás no está, anotalo en `notas.md` en vez de inventar el slug.
- Si un vicepresidente dejó el cargo antes de tiempo, registrá el hecho y la fecha con fuente, pero NO investigues el caso judicial ni la causa: eso va en `notas.md` como pista.
- Lo que no puedas probar va a `notas.md` con el motivo.

Al terminar corré `pnpm validar --inbox inbox/vicepresidentes/semilla-2000-2015/2026-09-05` y arreglá lo que falle. Devolveme un resumen corto: qué personas quedaron, qué fuentes usaste por persona, y qué te faltó.

---

Nota posterior del mantenedor: el campo se pidió como `_id` y la convención del repo es `_slug`; se renombró antes de promover. El agente reportó además que `politicos` no estaba registrado en `ARCHIVOS_INBOX`, así que no pudo correr `pnpm validar --inbox` y validó contra el esquema por su cuenta. Eso se corrigió después de esta corrida.
