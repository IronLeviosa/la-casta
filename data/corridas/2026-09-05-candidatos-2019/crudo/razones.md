# Razones — edición del lote candidatos/2019/2026-09-05

Modelo: claude-sonnet-5 (brazo barato del experimento; editor corriendo en Sonnet por
instrucción explícita del encargo, no por decisión propia).

## Trabajo 1 — Fusión de Manini Ríos y Mieres

Saqué ambos registros de `politicos.yaml` (donde el investigador los había escrito como
altas nuevas, sin saber que el lote de 2024 se promovió mientras investigaba) y los
reescribí en `politicos-existentes.yaml`, partiendo del registro publicado en
`content/politicos/` y agregando lo que aporta la versión de 2019. Siguiendo el
dictamen de `critica.md` campo por campo:

- **Manini Ríos**: base = `content/politicos/manini-rios.yaml` (publicado, corrida
  2024). Agregado: `alias_ambiguos` sobre el padre (diputado 1958) y el tío (diputado,
  senador, ministro del Interior) — la versión 2019 lo tenía y la publicada no; no hay
  conflicto, es precisión genealógica adicional que la crítica confirmó sin objeción.
  Agregado: la candidatura de 2019 (268.736 votos, cuarto lugar) junto a la de 2024 ya
  publicada (60.549 votos) — ahora tiene las dos. Mandato "Comandante en Jefe del
  Ejército Nacional": idéntico en ambas versiones, sin cambios. Mandato "Senador de la
  República": la fecha (2020-02-15 a 2025-02-15) es la misma en ambas y no se tocó; la
  fuente sí cambió (ver Trabajo 2).
- **Mieres**: base = `content/politicos/mieres.yaml` (publicado, corrida 2024).
  Agregado: la candidatura de 2019 (23.580 votos, sexto lugar) junto a la de 2024 ya
  publicada (41.618 votos). Se ganó la versión publicada en dos campos donde la de 2019
  era más pobre (ver Trabajo 3). El resto (Representante Nacional 2000-2005, Senador
  2015-2020) es idéntico en ambas versiones y no se tocó.

Ninguna de las dos fusiones implicó descartar un hecho de una versión por
contradicción: la crítica confirmó que no había ninguna, solo cobertura de años
distintos. Dejé nota (`notas_internas`) en cada registro fusionado resumiendo qué se
fusionó, y en el de Lacalle Pou anoté que esta actualización sobre un registro ya
publicado necesita, antes de `pnpm promover --correccion`, un registro en
`content/correcciones/` (regla del proyecto en CLAUDE.md, "Cómo cambia un registro ya
publicado"); no lo escribo yo porque no me corresponde correr `promover`.

## Trabajo 2 — La cita de Manini Ríos mal leída (severidad `corregir`, `cita_fuera_de_contexto`)

Acepto la objeción. Abrí de nuevo `https://infolegislativa.parlamento.gub.uy/temporales/20220301a0001.pdf`
con `pnpm fuente` y confirmé lo que dice la crítica: Manini Ríos figura en la sección
"FALTAN: [...] con aviso, los señores senadores [...] Guido Manini Ríos [...]" de la
sesión del 1.º de marzo de 2022 — ausente con aviso, no presente. No encontré, en ese
mismo documento, un tramo distinto que lo mostrara efectivamente en sala, así que
cambié de fuente en vez de forzar una lectura. Busqué otros Diarios de Sesiones que lo
mencionan (`pnpm corpus:buscar "Manini Ríos" --medio parlamento`, 20 resultados) y abrí
`https://infolegislativa.parlamento.gub.uy/temporales/20240515a0004.pdf` (sesión del
15/05/2024): ahí Manini Ríos pide la palabra y la presidenta se la concede ("SEÑOR
MANINI RÍOS.- Pido la palabra. / SEÑORA PRESIDENTA.- Tiene la palabra el señor
legislador Manini Ríos."), lo que sí prueba que ejercía la banca ese día. Reemplacé la
fuente de Parlamento del mandato de Senador por esta, y mantuve la fuente de Ámbito
(2024, declaración suya como "el senador") que ya traía la versión publicada. El
mandato queda con tres fuentes: Wikipedia (fechas), Ámbito y este Diario de Sesiones
corregido.

## Trabajo 3 — Las otras dos objeciones `corregir` (ambas en Mieres)

1. **`contexto_omitido`**: faltaba el mandato "Director de Educación (Ministerio de
   Educación y Cultura), 1995-1996". Acepto. Reabrí
   `https://es.wikipedia.org/wiki/Pablo_Mieres` con `pnpm fuente` y confirmé la cita
   exacta ("Durante 1995 y 1996, ocupó el cargo de Director de Educación en el
   Ministerio de Educación y Cultura, manteniéndose políticamente independiente.");
   agregué el mandato con esa fuente, la misma que ya usa el resto del registro. Fecha
   con precisión de año nada más porque la fuente no da día (el validador lo marca como
   aviso, no error; es la única fecha imprecisa de todo el lote).
2. **`riesgo_legal`** (fuente débil para la salida): la salida del Ministerio de
   Trabajo (renuncia, 2024-05-02) se sostenía con una nota de Presidencia sobre la
   asunción de Arizti (tipo `nota`), habiendo una Resolución oficial de aceptación de
   la renuncia (tipo `documento_oficial`) ya disponible y ya usada en el registro
   publicado. Acepto. Reabrí
   `https://www.gub.uy/presidencia/institucional/normativa/resolucion-sn024-se-acepta-renuncia-presentada-pablo-mieres-cargo-ministro`
   con `pnpm fuente` y confirmé la cita ("Se acepta la renuncia presentada por Pablo
   Mieres al cargo de Ministro de Trabajo y Seguridad Social, a partir del 2 de mayo de
   2024."). Reemplacé la fuente de la nota de Presidencia por esta en
   `estado_actual.salida` (queda solo con la fuente documento_oficial, más fuerte). La
   nota de Presidencia sobre Arizti no se usa más en ningún registro de este lote, así
   que también saqué el registro de tono que la crítica le había asignado en
   `cobertura.yaml` (ver más abajo, "Cambio no pedido por el encargo").

## Trabajo 4 — Criterio del crítico sobre cargos no electivos (copiado tal cual, ver el final de este archivo)

Ver la sección "Criterio para casos futuros (cargos militares, policiales o
judiciales)" al final de este documento. Lo copio íntegro porque el encargo lo pide así
para que quede en el rastro de la corrida.

## Trabajo 5 — Tier

Mismo criterio para los siete registros: cada mandato con al menos una fuente (lo exige
el esquema, así que es automático) y cada persona con al menos una fuente no-Wikipedia.
Un registro sube a `probable` si, además, alguna de sus fuentes no verifica
mecánicamente (`pnpm validar --inbox --red`).

- Daniel Martínez: **publicado**. No-wiki: Infobae.
- Talvi: **probable**. No-wiki: Parlamento (Diario de Sesiones, 21/10/2020) — pero esa
  URL da HTTP 404 sin copia en Wayback (`pnpm validar --red` lo confirma), y no puedo
  correr `pnpm archivar` desde este rol. Bajé el tier y dejé `que_falta` explicando
  exactamente eso. Es la única fuente no-Wikipedia de esta persona, así que sin
  archivarla o reemplazarla no alcanza el umbral de publicado.
- Manini Ríos: **publicado**. No-wiki: Ámbito + Parlamento (corregido, Trabajo 2).
- César Vega: **publicado**. No-wiki: Parlamento + Montevideo Portal.
- Novick: **publicado**. No-wiki: Subrayado. `mandatos: []` es válido porque el
  esquema (`src/schemas/politico.ts`) ya exige "al menos un mandato o una candidatura",
  no un mandato a secas — lo confirmé releyendo el esquema, no de memoria.
- Mieres: **publicado**. No-wiki: Presidencia (documento_oficial) + Parlamento.
- Lacalle Pou (actualización): **publicado**. No-wiki: Teledoce (nuevo en esta
  actualización; el registro publicado hasta ahora solo tenía fuentes Wikipedia).

Ninguna de estas siete decisiones depende del partido de la persona: dos son de
izquierda (Frente Amplio), tres de derecha o centroderecha (Partido Nacional, Partido
Colorado, Cabildo Abierto), una de centro (Partido Independiente) y una sin ubicación
clara (PERI). El único que bajó a `probable` (Talvi, Partido Colorado) lo hizo por un
problema mecánico de infraestructura (un PDF de Parlamento que dejó de responder),
exactamente el mismo motivo por el que, en este mismo lote, tuve que aceptar copias
archivadas para otras tres URLs de Parlamento que si tienen snapshot en Wayback
(usadas para Vega, Manini Ríos y Mieres). Si esas tres también hubieran estado sin
snapshot, habrían bajado igual.

## Trabajo 6 — Candidaturas

Verifiqué los siete registros: todos tienen `candidaturas` con `resultado`, `detalle` y
`votos`, y los votos coinciden con la cita de la tabla de
`https://es.wikipedia.org/wiki/Elecciones_generales_de_Uruguay_de_2019` (y, para
Manini Ríos y Mieres, también con la de 2024) tal como la releí en esta sesión. Sin
cambios de contenido en este punto, más allá de lo ya descrito en el detalle de la
fusión (Trabajo 1).

## Regla 0 — reparto de fuentes y mandatos por persona (después de mis cambios)

| Persona | Mandatos | Candidaturas | Fuentes no-Wikipedia |
|---|---|---|---|
| Daniel Martínez | 4 | 1 | 1 (Infobae) |
| Talvi | 2 | 1 | 1 (Parlamento, hoy caída — ver Trabajo 5) |
| Manini Ríos | 2 | 2 | 2 (Ámbito, Parlamento) |
| César Vega | 1 | 1 | 2 (Parlamento, Montevideo Portal) |
| Novick | 0 | 1 | 1 (Subrayado) |
| Mieres | 4 | 2 | 2 (Presidencia, Parlamento) |
| Lacalle Pou | 4 | 1 | 1 (Teledoce, nuevo en esta actualización) |

El reparto es desparejo (0 a 4 mandatos, 1 a 2 fuentes no-Wikipedia), pero por el
material disponible, no por cuánto se buscó: Novick nunca ejerció un cargo (candidato
dos veces, nada más, confirmado por el investigador y por la crítica); Manini Ríos y
Mieres, al fusionarse con un registro que ya cubría 2000-2024, terminan con más
mandatos que alguien como Talvi, que solo estuvo en la función pública 2020-2020
(quince días de Senado más cuatro meses de canciller). El número de fuentes no-Wikipedia
por persona (1 a 2) sí es parejo: la única persona con una sola es Talvi, y es la
misma persona cuya única fuente no-wiki quedó con el problema mecánico del Trabajo 5 —
no hay una segunda persona con ese patrón.

## Cambio no pedido por el encargo, hecho para que `pnpm validar --inbox --red` diera 0 errores

1. `cobertura.yaml` (producido por la crítica) tenía los cinco registros sin `titulo`,
   campo obligatorio del esquema (`src/schemas/cobertura.ts`) que la crítica no había
   llenado. Completé los cinco con el título exacto que ya usan las fuentes
   equivalentes en `politicos.yaml`/`politicos-existentes.yaml` (mismo URL, mismo
   `titulo` ya verificado ahí), sin inventar nada nuevo.
2. Uno de esos cinco registros de `cobertura.yaml` (Presidencia, nota sobre la
   asunción de Arizti) apuntaba a `evento: "propuesto:cambio-ministro-trabajo-mieres-2024"`,
   que no existe en `content/eventos/`. Crear una entrada nueva en `content/eventos/`
   no está entre lo que puedo escribir en este rol (solo `content/medios/` y
   `content/referentes/`, y solo si el investigador lo pide en `notas.md` — acá no lo
   pidió). Como además esa misma fuente (la nota de Presidencia sobre Arizti) dejó de
   citarse en cualquier registro político de este lote tras el Trabajo 3.2 (la
   reemplacé por la Resolución oficial), saqué ese registro de `cobertura.yaml` en vez
   de dejarlo con una referencia rota o inventar el evento. Si se quiere conservar el
   dato de tono, hace falta que alguien con permiso para escribir `content/eventos/`
   cree primero esa entrada con sus propias fuentes.
3. Corregí una cita con similitud 0.97 (no bloqueaba, era aviso, pero es trivial de
   arreglar): la fuente de la candidatura de 2019 de Lacalle Pou decía "PartidoNacional"
   pegado, sin espacio; el texto real de Wikipedia trae "Partido Nacional" con espacio.
   Confirmé contra la fuente con `pnpm fuente` y corregí el espacio.

## Objeciones de la crítica que no toqué (aviso, no `corregir`)

- Daniel Martínez: la fecha de renuncia a la Intendencia (1/4/2019 vs 17/3/2019 del
  infobox) ya la resolvió la propia crítica releyendo la sección de sucesión de
  Wikipedia; no hay nada que cambiar, el dato usado ya es el correcto.
- Talvi: el mandato de Senador (15 días) solo tiene fuente Wikipedia; queda así, es
  aviso, no bloquea nada a nivel de mandato (el bloqueo de tier de esta persona vino de
  otra fuente, ver Trabajo 5).
- Manini Ríos: la candidatura de 2019 con una sola fuente (Wikipedia); queda así, mismo
  patrón que Talvi y aceptado como aviso en toda la corrida.
- Lacalle Pou: la fecha de cierre del mandato de Senador (12/8, presentación de la
  renuncia, contra 13/8, posible votación en sesión) la dejé sin cambiar porque no
  encontré el Diario de Sesiones del 13/8 en esta sesión y las dos fuentes que sí tengo
  (Wikipedia y Teledoce) coinciden en el 12/8; lo dejé anotado en `notas_internas` para
  quien retome esto. Los dos mandatos de Lacalle Pou sostenidos solo por Wikipedia
  (Cámara de Representantes, Presidencia de la Cámara) quedan igual, mismo patrón de
  aviso que el resto del lote. La objeción de procedimiento (falta el registro de
  `content/correcciones/` antes de `promover --correccion`) no es mía para resolver;
  la dejé anotada para quien corra `/revisar`.

## Cambios de forma

- Espacio faltante en la cita de la candidatura de Lacalle Pou de 2019 ("PartidoNacional"
  → "Partido Nacional"), ver arriba.

## Criterio para casos futuros (cargos militares, policiales o judiciales), copiado tal cual de `critica.md`

> Entra en `mandatos` la cabeza de una institución del Estado cuando la nombra y la
> remueve el Poder Ejecutivo o una decisión política equivalente (Comandantes en Jefe
> de las Fuerzas Armadas, Jefe de Policía, Fiscal de Corte, integrantes de la Suprema
> Corte de Justicia, directorios de entes autónomos, Presidencia del BCU), con las
> mismas fechas y fuentes que a cualquier otro mandato. NO entran los grados o cargos
> intermedios de esas mismas carreras (un coronel, un comisario, un juez de primera
> instancia) porque ahí no hay designación política de la cúpula del Estado, solo
> carrera administrativa interna.

(Dictamen completo de la crítica, para contexto: sostiene que "Comandante en Jefe del
Ejército Nacional" corresponde como mandato de Manini Ríos por tres razones — el propio
esquema pide "cargo... electivo o de gobierno" y este lo es, estructuralmente igual a
un ministro; el registro ya publicado de `content/politicos/manini-rios.yaml` ya lo
trae, así que sacarlo de esta versión sería la asimetría real; y omitirlo borraría
contexto biográfico central, la razón por la que existe Cabildo Abierto. No lo mantuve
por decisión propia sino porque acepto ese dictamen; ya estaba en ambas versiones antes
de mi edición y no lo toqué.)
