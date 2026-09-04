# Razones de edición — corrida 2026-09-04-lacalle-pou-vetos

Editor: sesión de edición manual, Sonnet (`claude-sonnet-5`), por el experimento descrito en
`EXPERIMENTO.md` (el crítico de esta corrida también corrió con Sonnet, no con Opus). Primera
corrida de la colección `vetos`: los criterios de este archivo fijan el precedente para el resto de
los presidentes.

## Nota de infraestructura (no editorial)

`scripts/lib/inbox.ts` no tenía registrada la colección `vetos` en `ARCHIVOS_INBOX` ni en
`AGENTE_POR_COLECCION`, ni un caso para `vetos` en `derivarId` (es la primera corrida de la
colección). Efecto concreto: `pnpm validar --inbox <dir>` ignoraba `vetos.yaml` por completo —ni
esquema, ni referencias, ni, con `--red`, fuentes o citas— sin avisarlo; solo validaba
`declaraciones.yaml` (3 URLs). Lo verifiqué corriendo `leerArchivosInbox` directo: devolvía
`declaraciones.yaml` y `giros.yaml`, pero no `vetos.yaml`. Sin esto, el paso obligatorio
`pnpm validar --inbox --red` no cumplía su función en la única colección de esta corrida. Agregué
las tres entradas que faltaban (mismo patrón que las demás colecciones: `vetos: 'vetos'` en
`ARCHIVOS_INBOX`, `vetos: 'investigador'` en `AGENTE_POR_COLECCION`, y un caso en `derivarId` con
`politico/fecha-slug(titulo)`, igual criterio que `declaraciones`). Con el fix, `pnpm validar --inbox
inbox/lacalle-pou/vetos/2026-09-04 --red` corre limpio: 0 errores, 16 citas exactas (100%), 12 URLs
verificadas. Confirmé además que no rompe la corrida hermana `inbox/orsi/vetos/2026-09-04` (0 errores
de esquema ahí también). No es una decisión editorial — es un cambio mecánico de infraestructura,
mínimo y en el mismo patrón ya usado para el resto de las colecciones, sin el cual esta corrida (y
cualquier otra de `vetos`) no se podía validar de verdad.

## Regla 0

El punto más grave de `critica.md` es de simetría, no de precisión de un dato puntual: el lote nombraba
a Cabildo Abierto como impulsor del artículo vetado en 2 de los 3 casos que le correspondían
(vetos[0] y vetos[3]) pero no nombraba al Frente Amplio como impulsor del proyecto de Casa de Galicia
(vetos[2]), verificado letra por letra en la ficha 160955 ("Proyecto de ley... presentado por las
señoras Senadoras Amanda Della Ventura, Sandra Lazo y Silvia Nane y los señores Senadores Oscar
Andrade, Mario Bergara, Daniel Caggiani, Charles Carrera, Oscar Curutchet, Benjamín Liberoff..."), y
tampoco lo hacía para el tercer caso de Cabildo Abierto (vetos[1], artículo 636, "impulsado por
Cabildo Abierto a instancias de la Asociación de Abogados Penalistas" según El Observador). Nombrar al
impulsor solo cuando es un socio de la coalición y callarlo cuando es la oposición es exactamente lo
que la Regla 0 prohíbe, sin que nadie lo haya decidido a propósito: el patrón surgió de que el
investigador completó ese dato en dos registros y no en los otros dos, no de un criterio explícito.

**Criterio único adoptado**: nombrar siempre, en el campo `analisis`, a quién impulsó o presentó el
proyecto o artículo vetado, con lenguaje descriptivo neutro ("impulsado por", "presentado por") y sin
verbos de intención — sea Cabildo Abierto o el Frente Amplio. Se aplicó a los cuatro registros: ya
estaba en vetos[0] y vetos[3] (sin tocar); se agregó en vetos[1] (Cabildo Abierto, artículo 636) y en
vetos[2] (Frente Amplio, los tres artículos observados de Casa de Galicia). El resultado, ahora
parejo, describe un patrón real y verificado por el crítico (3 de los 4 vetos observan artículos
impulsados por un socio de la coalición, 1 por la oposición) sin que la elección de a quién nombrar
dependa de qué partido es.

## Decisiones editoriales

1. **Simetría de autoría**: ver Regla 0, arriba.
2. **`resultado.detalle` de vetos[3] (Ley de Medios) reescrito.** El crítico releyó la ficha 145888
   completa y confirmó que la fecha de la primera convocatoria —de donde el artículo 139 cuenta los
   treinta días— no aparece en ningún lado del texto. Lo que sí consta, en el propio asiento del
   Parlamento, es "Veto aceptado tácitamente por vencimiento de plazo constitucional". El `detalle`
   anterior encadenaba esos hechos de un modo que sugería un cómputo propio de los treinta días; se
   reescribió para que diga solo lo que consta (el vencimiento del plazo el 04-10-2024, la ausencia de
   sesión, y el asiento del 07-10-2024) y para que explicite que la fecha de la primera convocatoria no
   está documentada y que el registro se apoya en la conclusión del propio Parlamento, no en una
   verificación independiente. `resultado.estado` se mantuvo en `observaciones_aceptadas` porque lo que
   consta alcanza para sostenerlo (objeción `bloquea` de critica.md, vetos[3]).
3. **Declaración de Casa de Galicia (declaraciones[1]) movida a hipótesis.** Ámbito cita "una mala
   administración de una mutualista" y Montevideo Portal cita "una mala administración de gobierno"
   para la misma frase. No es un matiz: cambia a quién responsabiliza (mutualista vs. gestión de
   gobierno anterior). Dos fuentes que se contradicen en el punto que la declaración pretende
   transmitir no corroboran un nivel `reportado`; no hay forma de fijar la cita exacta sin el audio o
   video de la conferencia de prensa en Dolores (17-11-2023), que no está disponible en este lote. Se
   bajó `revision.tier` a `hipotesis` en `declaraciones.yaml` y se abrió
   `hipotesis/lacalle-pou/tiraron-el-fardo-casa-galicia.yaml` con las dos lecturas y cómo descartarlas
   (objeción `bloquea` de critica.md, declaraciones[1]).
4. **`fundamento` de vetos[1] (Rendición de Cuentas) corregido.** Le atribuía al Poder Ejecutivo el
   argumento de que la inhibición a fiscales violaba el artículo 36 de la Constitución; releída la
   única fuente que sostiene ese tramo (El Observador, 24-10-2023), ese argumento lo hacen dos
   constitucionalistas (Daniel Ochs y Eduardo Lust) consultados por la prensa, no el Poder Ejecutivo, en
   una nota basada además en fuentes políticas anónimas. Se reescribió `fundamento` para no atribuirle
   al Ejecutivo un argumento que no dijo, y se dejó explícito en `analisis` quién sostiene esa lectura
   del artículo 36 (objeción `corregir` de critica.md, vetos[1]).
5. **Nivel de evidencia bajado de `textual` a `reportado` en los cuatro vetos.** El investigador no
   encontró el mensaje oficial de observaciones del Poder Ejecutivo en un dominio oficial para ninguno
   de los cuatro: los fundamentos vienen de prensa que los reprodujo (completos en vetos[0] y vetos[2],
   parcial en vetos[3], y en vetos[1] a partir de fuentes políticas anónimas), más la ficha de trámite
   del Parlamento. La ficha (`documento_oficial`) sostiene el hecho del veto y el desenlace, pero su
   `cita` en la lista de `evidencia` es solo administrativa ("Poder Ejecutivo veto total/parcial"): no
   respalda el `fundamento`. Bajar a `reportado` refleja lo que la fuente realmente sostiene:
   - **vetos[0]** alcanza igual `reportado` con dos grupos: se agregó como tercera fuente la nota de El
     Observador con el texto completo del decreto (grupo werthein-hochbaum, distinto de
     montevideo-comm), ya leída por el investigador según `consultas.jsonl` (21:04:30) pero no incluida
     en `evidencia`; ambas notas reproducen el mismo texto del decreto, así que corroboran, no se
     contradicen. `revision.tier: publicado`.
   - **vetos[1], vetos[2] y vetos[3]** quedan con una sola fuente de prensa cada uno (el-observador,
     subrayado y ámbito respectivamente); no hay en este lote una segunda fuente de distinto grupo ni el
     PDF del repartido oficial (Rep.24/0 o Rep.25/0, Rep.36/0, mencionados en las fichas). Se marcó
     `_faltante: segunda_fuente` y `revision.tier: probable` en los tres.
6. **Corrección menor en vetos[3]: número de artículo constitucional.** El `fundamento` decía "los
   artículos 29 y 36"; la fuente citada (Ámbito) nombra explícitamente el artículo 29 pero describe el
   contenido del artículo 36 (derecho al trabajo, industria y comercio) sin darle ese número. Se
   reescribió para no afirmar que la fuente dice "36" cuando no lo dice, y se dejó la referencia cruzada
   a vetos[0] (donde el mismo derecho sí está identificado como artículo 36 en una fuente que transcribe
   el decreto). No cambia el tier, que ya bajaba a `probable` por el punto 5 (objeción `corregir` de
   critica.md, vetos[3]).

## Cambios entre el crudo y lo editado (una línea por cambio)

### vetos.yaml

- [0] forestal · `evidencia.nivel` `textual` → `reportado`; se agregó El Observador como tercera
  fuente (ver decisión 5); `revision: {tier: publicado}`.
- [1] Rendición de Cuentas · `titulo`: "ley de medios" → "artículo sobre medios" en el paréntesis, para
  no confundir con la Ley de Medios de vetos[3] (aviso menor de critica.md, vetos[1]); `fundamento`
  reescrito (decisión 4); `analisis` agrega la autoría de Cabildo Abierto del artículo 636 y quién
  sostiene el argumento del artículo 36 (decisiones 1 y 4); `evidencia.nivel` → `reportado`,
  `_faltante: segunda_fuente`; `revision: {tier: probable}`.
- [2] Casa de Galicia · `analisis` agrega que el proyecto fue presentado por senadoras y senadores del
  Frente Amplio (decisión 1); `evidencia.nivel` → `reportado`, `_faltante: segunda_fuente`;
  `revision: {tier: probable}`.
- [3] Ley de Medios · `fundamento` reescrito (decisión 6); `resultado.detalle` reescrito (decisión 2);
  `evidencia.nivel` → `reportado`, `_faltante: segunda_fuente`; `revision: {tier: probable}`.

### declaraciones.yaml

- [0] "si uno aprieta, asfixia" · `resumen` corregido: la pregunta sobre el veto la trajo el
  entrevistador, no Lacalle Pou espontáneamente (aviso de critica.md, declaraciones[0]);
  `revision: {tier: probable}` por fuente única (ya venía con `_faltante: segunda_fuente`).
- [1] "nos tiraron el fardo" · `revision: {tier: hipotesis}` (decisión 3); `resumen` reescrito para no
  tomar partido por la versión de Ámbito ("de una mutualista") ya que la contradicción con Montevideo
  Portal sigue sin resolver; la resolución completa está en
  `hipotesis/lacalle-pou/tiraron-el-fardo-casa-galicia.yaml`.

### giros.yaml (nuevo)

- Vacío: las dos declaraciones del lote son sobre temas y momentos distintos entre sí; ninguna es una
  segunda formulación de una posición que la primera contradiga, matice o cumpla. Ni `notas.md` ni
  `critica.md` señalan un candidato a giro.

## Cambios de forma

- Ninguno adicional a los ya hechos antes de esta edición (ver nota del pedido: "las 3 citas del lote
  verifican exactas contra su fuente"). El cambio de "ley de medios" a "artículo sobre medios" en el
  título de vetos[1] se cuenta arriba, en `vetos.yaml`, porque resuelve una posible confusión de
  identidad entre dos objetos distintos, no un error tipográfico.

## Objeciones del crítico que quedaron sin resolver, y por qué

- **vetos[0], vetos[1], vetos[2], vetos[3] — mensaje oficial de observaciones.** El crítico y el propio
  investigador señalan que los repartidos de la Asamblea General (Rep.10/0, Rep.24/0 o Rep.25/0,
  Rep.36/0) alojados en parlamento.gub.uy contendrían el texto íntegro del Poder Ejecutivo con nivel
  `documento_oficial` real. No se bajaron en esta edición: requiere ubicar y leer cuatro PDF nuevos, que
  es trabajo de investigación, no de edición sobre lo ya reunido. Queda como el paso que subiría
  vetos[1], vetos[2] y vetos[3] a `publicado`.
- **declaraciones[0] — video de la entrevista en Telemundo (2022-03-03).** No se buscó ni transcribió en
  esta edición; se anotó en `notas_internas` como lo que falta para subir a `textual`.
- **declaraciones[1] — audio o video de la conferencia de prensa en Dolores (17-11-2023).** No
  disponible en este lote; es la única vía para resolver la contradicción entre Ámbito y Montevideo
  Portal. Queda abierta en `hipotesis/lacalle-pou/tiraron-el-fardo-casa-galicia.yaml`.
- **Confirmación mecánica de la lista de cuatro vetos** (objeción de lote 5 de critica.md): no se
  reprodujo en esta edición el método de búsqueda por Repartidos filtrado por Legislatura 49 que el
  crítico sugiere; no cambia la lista, pero el editor no lo verificó de forma independiente.

## Registros de este lote que necesitan aprobación humana

Ninguno todavía: no hay casos, ningún giro (el lote no tiene ninguno) y ninguna fuente con
`verificacion: manual`. Si en una futura edición vetos[1], vetos[2] o vetos[3] se completan con una
segunda fuente y se dejan en `publicado`, ninguno de los cuatro llegaría a `cambio_total +
sin_explicacion` (no son giros) ni a caso judicial, así que no está previsto que este lote necesite
compuerta humana incluso una vez completo.

## Cobertura del crítico

Los siete registros de `cobertura` en `critica.md` no se promueven en esta corrida: los seis eventos
"propuesto:" no existen todavía en `content/eventos/`, y no corresponde crear eventos sin fuentes
propias dentro de una edición de vetos. Quedan en `critica.md` para una futura corrida de eventos.
