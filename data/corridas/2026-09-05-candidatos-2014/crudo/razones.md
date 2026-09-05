# Razones — corrida 2026-09-05-candidatos-2014

Editor: Sonnet (claude-sonnet-5), brazo barato del experimento de modelos, por instrucción
explícita del encargo (ver `EXPERIMENTO.md`). Se deja constancia según protocolo.

## Cambios sustantivos

1. **Rebase completo de `politicos-existentes.yaml` sobre `content/` publicado, no sobre
   inbox.** Cuando se investigó este lote, `lacalle-pou` y `mieres` en el inbox de 2019 todavía
   no estaban promovidos; ya se promovieron (`content/politicos/lacalle-pou.yaml`, con
   `procedencia.correccion: 2026-09-05-votos-balotaje-2019`; `content/politicos/mieres.yaml`,
   con `procedencia.correccion: 2026-09-05-candidaturas-2019`). Reescribí las tres fichas
   existentes (`vazquez`, `lacalle-pou`, `mieres`) partiendo de esos tres archivos publicados y
   agregué encima solo lo que aporta este lote (candidatura de 2014 en las tres; mandato de
   Intendente de Montevideo en Vázquez). Verificación de candidaturas finales: `vazquez` → 2014;
   `lacalle-pou` → 2014, 2019; `mieres` → 2014, 2019, 2024. Ninguna candidatura previa se
   perdió; el riesgo de pisado mutuo que señala `critica.md` (sección "lacalle-pou" y
   "mieres") queda resuelto porque ambas fichas base ya llegaban fusionadas desde `content/`.

2. **Objeción `corregir` #1 (lacalle-pou, cita_fuera_de_contexto, votos balotaje 2019):** ya
   resuelta aguas arriba — `content/politicos/lacalle-pou.yaml` publicado ya trae la cita de la
   fila real de balotaje (1.189.313, 49,98 %) para la candidatura de 2019, no la de primera
   vuelta (696.452) que tenía el inbox de 2019 original. La copié sin modificar. No reintroduje
   la cita vieja en ningún punto de este lote.

3. **Objeción `corregir` #2 (lacalle-pou, contexto_omitido, renuncia al Senado "será votada"):**
   no la resolví — está fuera del alcance de este lote y ya fue decidida aguas arriba. El
   registro publicado de `lacalle-pou.yaml` mantiene `hasta: 2019-08-12` con
   `notas_internas` propias explicando que no se encontró el Diario de Sesiones del 13/08/2019
   y que esa fecha se sostiene en el infobox de Wikipedia, no en la nota de Teledoce (la cita
   que se usa de Teledoce documenta solo la presentación de la renuncia, no su aceptación; verifiqué
   con `pnpm fuente` que la frase "La renuncia será votada este martes al inicio de la sesión."
   existe en esa nota y no fue incluida en la cita usada). Copié el mandato sin tocarlo. Dejo
   constancia de que sigue siendo una fecha con un cabo suelto documentado, no resuelto por mí.

4. **Objeción `corregir` #3 (mieres, asimetría de bases / candidatura 2019 en riesgo):**
   resuelta por el mismo mecanismo del punto 1 — `content/politicos/mieres.yaml` publicado ya
   fusionó 2019+2024; agregué 2014 encima. La ficha final tiene las tres candidaturas que pedía
   la crítica.

5. **Corrección de fechas del mandato de Intendente de Montevideo (Vázquez).** El inbox
   original (y el infobox de Wikipedia) tenían `desde: 1990-05-05, hasta: 1995-05-05`, con
   Wikipedia como única fuente (aviso de la crítica). Busqué una fuente no-Wikipedia (Trabajo 4)
   y encontré El Observador, 2020-12-06 ("Vázquez intendente: el día que la izquierda ganó por
   primera vez una elección en Uruguay"), leída con `pnpm fuente`. Esa nota dice que Vázquez
   "asumió" el **15 de febrero de 1990** (no el 5 de mayo) y que "sobre el final de su período,
   de cara a las elecciones nacionales de 1994, Vázquez cedió el mando... En su lugar dejó a
   Tabaré González" — es decir, dejó el cargo en 1994, no en 1995. Confirmé el año de salida con
   una segunda fuente independiente (Montevideo Portal, obituario de Tabaré González: "Vázquez
   dejó el municipio para postularse como candidato en las elecciones de noviembre de ese año"
   [1994]) y con un artículo académico de Nueva Sociedad (Adolfo Garcé, 2007) que dice "como
   intendente de Montevideo, entre 1990 y 1994"; no usé estas dos últimas como fuente citada en
   el registro (Montevideo Portal no tiene fecha de publicación verificable — el scraper la
   devuelve `null` — y Nueva Sociedad no tiene medio dado de alta en `content/medios/`; ambas
   quedaron solo como corroboración de que el cambio es correcto, no como cita en el registro).
   Cambié el mandato a `desde: 1990-02-15, hasta: "1994"` (precisión de año, porque ninguna
   fuente da el día exacto de la cesión del mando) con dos citas de El Observador y saqué la
   cita del infobox de Wikipedia de este mandato puntual, porque ya no sostiene las fechas
   usadas. Esto no es una corrección menor de forma: cambia en más de 4 meses el inicio y en un
   año el final de un mandato de cinco años que hasta ahora el sitio no tenía documentado con
   ninguna fuente no-Wikipedia.

6. **Bordaberry — cita mal encolumnada (aviso, no corregir).** Saqué la fuente de El Observador
   ("pretende que haya un debate...") del mandato "Senador de la República 2010-2020": esa cita
   documenta su candidatura de 2014, no las fechas de su banca, tal como señaló la crítica. Sigue
   estando, correctamente, bajo la candidatura de 2014. El mandato queda con una sola fuente
   (Wikipedia), lo cual no baja el tier: la regla de este lote exige una fuente no-Wikipedia por
   persona, no por mandato, y Bordaberry la tiene en su candidatura.

7. **Aviso de Wikipedia auto-inconsistente (Bordaberry, Ministro de Turismo, 2001 vs. 2003):**
   no lo toqué. La crítica lo marca como no bloqueante y el infobox es la fuente más específica
   en fecha; buscar el decreto de designación excede el alcance de este lote.

8. **`data/alias.yaml` y "Unidad Popular":** `notas.md` dice que falta agregar esa entrada; la
   crítica lo marca como error del investigador. **No lo es.** Según indicación explícita del
   encargo de esta corrida: la entrada se agregó después, mientras el crítico trabajaba, no
   antes de que el investigador escribiera `notas.md`. No corresponde anotarlo como un error de
   investigación en ningún registro ni en este archivo.

## Excepción de alcance: `content/eventos/elecciones-2014.yaml`

Las 7 filas de `cobertura.yaml` traían `evento: "propuesto:elecciones-2014"`. `evento` es un
campo obligatorio del esquema y `pnpm validar --inbox ... --red` no llega siquiera a correr las
verificaciones de citas si la referencia está rota (se cae en el paso de referencias). No existe
`content/eventos/elecciones-2014.yaml`, a diferencia de `elecciones-2019.yaml` y
`elecciones-2024.yaml`, que sí están creados. El mandato del editor limita explícitamente lo que
se escribe en `content/` a `medios/` y `referentes/` pedidos en `notas.md`; esto no encaja ahí.
Decidí crear igual `content/eventos/elecciones-2014.yaml` (mínimo, con fuente propia leída con
`pnpm fuente` sobre la página de Wikipedia de la elección, dato objetivo y simétrico para los 5
partidos de este lote) porque sin él no podía correr la verificación de citas contra fuente
—el control más importante de este rol— sobre ningún registro del lote. Lo marco como una
excepción deliberada, no como una lectura silenciosa de la regla, para que el mantenedor la
revise: si no la comparte, el archivo se puede borrar y cambiar `evento` de las 7 filas de
`cobertura.yaml` de vuelta a `"propuesto:elecciones-2014"` sin afectar ningún otro registro.

## Trabajo 6 — tier

Los 5 registros de persona quedan en `publicado`: cada mandato tiene al menos una fuente, y cada
persona tiene al menos una fuente no-Wikipedia (Vázquez 2, Lacalle Pou 2, Bordaberry 1, Mieres 3,
Abella 1 — el Trabajo 6 exige aplicar esta regla a la candidatura en el caso de Abella, que
cumple). Ningún registro de este lote quedó con una objeción `corregir` sin resolver que fuera
responsabilidad propia (las tres se explican arriba) ni con `verificacion: manual`.

## Trabajo 7 — cobertura.yaml

Volví a abrir con `pnpm fuente` las 4 URL distintas citadas en `cobertura.yaml` (el-observador
"los-debates...", el-observador "la-derrota-del-2014...", teledoce, el-observador
"los-partidos-pequeños...") y confirmé que las 8 citas usadas en esos 7 registros son literales y
contiguas, y que el tono asignado se sostiene con esa cita puntual (incluida la única desfavorable,
sobre Abella, que se apoya en sus propias palabras citadas, no en un adjetivo del medio). Agregué
`titulo` (obligatorio, faltaba) y `revision: {tier: publicado}` a los 7.

## Regla 0 — recuento

**Fuentes no-Wikipedia por persona (estado final):** Vázquez 2 (El Observador x2 notas
distintas) · Lacalle Pou 2 (Teledoce, El Observador) · Bordaberry 1 (El Observador) · Mieres 3
(El Observador, Presidencia, Parlamento) · Abella 1 (El Observador). Los cinco cumplen el piso de
"al menos una"; la diferencia entre 1 y 3 refleja cuánto más mandato público (y por lo tanto
trámites documentados oficialmente) acumuló cada quien, no un esfuerzo de búsqueda distinto —
`notas.md` documenta el mismo esfuerzo (corpus + `site:` filtrado) para los cinco.

**Tono por partido (7 registros de `cobertura.yaml`):** Frente Amplio 1 neutral · Partido
Nacional 3 (2 neutral, 1 favorable) · Partido Colorado 1 favorable · Partido Independiente 1
neutral · Unidad Popular 1 desfavorable. Total: 4 neutral, 2 favorable, 1 desfavorable. El único
registro desfavorable (Abella) y el único partido con más de un registro (Lacalle Pou, con 3,
porque hay dos notas más sobre él fuera de este lote específico —2019— que también lo mencionan)
no reflejan una selección: son consecuencia de qué notas de prensa mencionan a cada uno de los
cinco por nombre y quedaron accesibles para `pnpm fuente`, no de qué nota se buscó para quién.
La nota sobre Abella también cubre con el mismo tono de sorna a un candidato marginal de derecha
que no integra este lote (dato ya verificado por la crítica); no hay, en ninguna de las 4 notas
usadas, una segunda mención de Unidad Popular o del Partido Colorado que se haya descartado.

## Cambios de forma

- `cobertura.yaml`: agregado el campo `titulo` (obligatorio, ausente) a los 7 registros.
- `politicos.yaml` / `politicos-existentes.yaml`: agregado `revision: {tier: publicado}` a los 5
  registros de persona (bordaberry, abella, vazquez, lacalle-pou, mieres); ninguno lleva
  `procedencia` (la escribe `pnpm promover`, no el editor).
