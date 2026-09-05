# Crítica — corrida 2026-09-05-candidatos-2014

Modelo: Sonnet (claude-sonnet-5). Nota de proceso: el rol de crítico corre normalmente en Opus
(`.claude/agents/critico.md`); esta corrida forma parte del brazo barato del experimento de
modelos (ver `EXPERIMENTO.md`), corrida por instrucción explícita del encargo y no por decisión
propia. Se deja constancia según lo pide el protocolo del experimento.

Lote: `inbox/candidatos/2014/2026-09-05/`
Registros revisados: 5 fichas de político — 2 nuevas (`bordaberry`, `abella`) en `politicos.yaml`
y 3 actualizaciones (`vazquez`, `lacalle-pou`, `mieres`) en `politicos-existentes.yaml` — con 15
mandatos y 7 candidaturas en total. No hay declaraciones, giros, promesas ni chequeos en este
lote (el brief los excluye explícitamente).

## Verificación del umbral (punto 1 y 2 del encargo)

Abrí `https://es.wikipedia.org/wiki/Elecciones_generales_de_Uruguay_de_2014` (tabla de resultados
oficiales de primera vuelta, carácter 21500, y la tabla de balotaje, carácter 0–2000) y confirmé
carácter por carácter la tabla completa contra la de `notas.md`:

| Lema | Votos | % | Senado | Diputados |
|---|---|---|---|---|
| Frente Amplio | 1.134.187 | 47,81 % | 15/30 | 50/99 |
| Partido Nacional | 732.601 | 30,88 % | 10/30 | 32/99 |
| Partido Colorado | 305.699 | 12,89 % | 4/30 | 13/99 |
| Partido Independiente | 73.379 | 3,09 % | 1/30 | 3/99 |
| Unidad Popular | 26.869 | 1,13 % | 0/30 | 1/99 |
| PERI | 17.835 | 0,75 % | 0/30 | 0/99 |
| Partido de los Trabajadores | 3.218 | 0,13 % | 0/30 | 0/99 |

Son exactamente 7 lemas, ni uno más ni uno menos. Los 5 que entran (Frente Amplio, Partido
Nacional, Partido Colorado, Partido Independiente, Unidad Popular) tienen banca; los 2 que quedan
afuera (PERI, Partido de los Trabajadores) tienen 0/30 y 0/99. **No falta ningún candidato de
ningún lado del corte, y no hay ningún lema con banca afuera ni ningún lema sin banca adentro.**
También confirmé el balotaje (carácter 0–2000 de la misma nota): Vázquez 1.241.568 votos
(56,50 %), Lacalle Pou 955.741 (43,50 %) — coincide exactamente con lo usado en las dos fichas.

El umbral (≥ 1 banca) se aplicó igual a los 7 lemas, de izquierda a derecha, sin excepción.
`sin_objecion` en este punto.

## Punto 3 — candidatos a la vicepresidencia excluidos

El brief y `notas.md` fichan solo a quien encabezó el lema, dejando afuera a los 5 compañeros de
fórmula (Sendic, Larrañaga, Coutinho, Conrado Ramos, Gustavo López) **de las cinco fórmulas por
igual**, sin excepción de partido. Confirmé además que ninguno de los que ya tienen ficha propia
por otro motivo (`content/politicos/sendic.yaml`, `content/politicos/argimon.yaml`, ambos
vicepresidentes electos en otras elecciones) tiene todavía un campo `candidaturas` — ni siquiera el suyo
propio. Es decir, el recorte de este lote no es la causa: la ausencia de candidaturas de
vicepresidencia es un hueco de cobertura parejo, no algo que este brief haya introducido de forma
asimétrica.

**Dictamen:** el criterio ("solo cabeza de fórmula") es simétrico tal como se aplicó — no hay
partido beneficiado ni perjudicado por la exclusión. No es una violación de Regla 0. Pero dejo
una `accion_sugerida` de lote: el sitio no tiene hoy ningún lugar donde conste que Sendic,
Argimón, Larrañaga, Coutinho, Ramos y López fueron candidatos a la vicepresidencia en 2014 (ni en
2019/2024 para los que se repitieron). Si en algún momento se decide fichar candidaturas de
vicepresidencia, tiene que hacerse con el mismo criterio para las cinco fórmulas de cada elección,
no solo para la fórmula que gobierna.

## Objeciones por registro

### politicos.yaml[bordaberry] — ficha nueva
- severidad: sin_objecion
- tipo: sin_objecion
- objecion: Los 4 mandatos (Ministro de Industria 2002-11-13/2003-09-12, Ministro de Turismo
  2003-09-13/2005-03-01, Senador 2010-02-15/2020-02-15, Senador 2025-02-15/presente) coinciden
  carácter por carácter con el infobox de `https://es.wikipedia.org/wiki/Pedro_Bordaberry` (abrí
  la nota completa). La candidatura de 2014 (305.699 votos, 12,89 %, 4/30 y 13/99 bancas, tercer
  lugar) coincide con la tabla de resultados. `estado_actual: en_cargo` es correcto (es senador en
  ejercicio desde 2025, sin fecha de salida). Tiene una fuente no-Wikipedia (El Observador,
  2014-08-29). El wikidata Q926984 es correcto (verificado en wikidata.org).
- cita_de_contexto: "Senador de Uruguay Actualmente en el cargo Desde el 15 de febrero de 2025" (infobox, https://es.wikipedia.org/wiki/Pedro_Bordaberry)
- accion_sugerida: ninguna.

- severidad: aviso
- tipo: cita_fuera_de_contexto
- objecion: La fuente de El Observador ("el candidato colorado, Pedro Bordaberry, pretende que
  haya un debate entre el resto de los presidenciables") está adjunta como segunda fuente del
  mandato "Senador de la República 2010-2020", pero esa cita no dice nada sobre fechas de mandato:
  documenta su candidatura presidencial de 2014, no su banca de senador. No es un error (la cita
  es real y contigua), pero está mal encolumnada: pertenece a la candidatura, donde de hecho
  también está repetida.
- cita_de_contexto: "el candidato colorado, Pedro Bordaberry, pretende que haya un debate entre el resto de los presidenciables." (https://elobservador.com.uy/nota/los-debates-y-su-cuestion-de-oportunidad-20148291830)
- accion_sugerida: sacar esa fuente del mandato de senador (ya está bien puesta bajo la
  candidatura de 2014) o reemplazarla ahí por una fuente que hable específicamente del período
  2010-2020.

- severidad: aviso
- tipo: contexto_omitido
- objecion: La propia nota de Wikipedia es internamente inconsistente sobre cuándo Bordaberry
  pasó de viceministro a titular de Turismo: el infobox dice "13 de septiembre de 2003-1 de marzo
  de 2005", pero el cuerpo del artículo dice "En 2000 asumió como subsecretario... Un año después
  pasó a ocupar la titularidad de la cartera", es decir, sugiere 2001, no 2003. El registro usa el
  infobox (más preciso en fecha), que es razonable, pero la fuente única (Wikipedia) no resuelve
  la contradicción consigo misma.
- cita_de_contexto: "En 2000 asumió como subsecretario (viceministro) de Turismo, siendo el ministro Alfonso Varela. Un año después pasó a ocupar la titularidad de la cartera" (https://es.wikipedia.org/wiki/Pedro_Bordaberry)
- accion_sugerida: si se quiere cerrar esta ambigüedad, buscar el decreto de designación en el
  Diario Oficial o en el archivo de Presidencia. No bloquea: el infobox es la fuente más específica
  y no hay indicio de que esté mal.

### politicos.yaml[abella] — ficha nueva
- severidad: sin_objecion
- tipo: sin_objecion
- objecion: `mandatos: []` está bien fundado — abrí `https://es.wikipedia.org/wiki/Gonzalo_Abella`
  completa (3267 caracteres) y no hay mención de ningún cargo electivo ni de gobierno; es maestro
  rural, escritor e historiador. No es una excepción usada para no buscar: se buscó y no hay nada
  que fichar. La candidatura de 2014 (26.869 votos, 1,13 %, 0/30 y 1/99, quinto lugar) coincide
  con la tabla, y el detalle de que la banca de Diputados la ocupó Eduardo Rubio y no él está
  confirmado con una segunda cita de la misma nota (tabla de Montevideo por departamento: "Unidad
  Popular 14.968 0,16% 1 (Eduardo Rubio)"). El wikidata Q16142876 es correcto.
- cita_de_contexto: "es un maestro, escritor, político e historiador uruguayo" (https://es.wikipedia.org/wiki/Gonzalo_Abella)
- accion_sugerida: ninguna.

- severidad: aviso
- tipo: sin_objecion (corrección a `notas.md`, no al registro)
- objecion: `notas.md` dice que "Unidad Popular... no está en la lista de partidos de
  `data/alias.yaml`" y que "falta agregar una entrada". Es falso: `data/alias.yaml` línea 119 ya
  tiene `nombre: Unidad Popular`, con alias "Gonzalo Abella" y "Abella", y un comentario que dice
  literalmente "lema de Gonzalo Abella, con una banca en Diputados en 2014". El registro en sí no
  tiene ningún problema (usa "Unidad Popular" como partido, que ya es válido); el error es solo en
  la nota que reporta un gap inexistente.
- cita_de_contexto: "- nombre: Unidad Popular ... alias: - Unidad Popular - Gonzalo Abella - Abella" (data/alias.yaml, línea 119-125)
- accion_sugerida: corregir `notas.md` para que no quede como pendiente algo que ya está resuelto.

### politicos-existentes.yaml[vazquez] — mandato nuevo (Intendente de Montevideo) + candidatura 2014
- severidad: sin_objecion
- tipo: sin_objecion
- objecion: El mandato nuevo, "Intendente de Montevideo, 5 de mayo de 1990 – 5 de mayo de 1995",
  coincide carácter por carácter con el infobox de `https://es.wikipedia.org/wiki/Tabar%C3%A9_V%C3%A1zquez`
  (abrí la nota completa) y con el cuerpo del artículo, que dice que "alcanzó, en 1990, la
  intendencia de Montevideo" como "el primer candidato de izquierda en ocupar un cargo electivo de
  relevancia en el país". No hay marca de presente/futuro en la cita de cierre (no aplica el
  aviso de `pnpm validar` sobre mandatos que terminan con una cita en presente/futuro, y en efecto
  no saltó ninguno). La candidatura de 2014 (electo, balotaje, 1.241.568 votos, 56,50 %) coincide
  con la tabla. El resto de la ficha (presidencias 2005-2010 y 2015-2020, fallecimiento) no se
  tocó y sigue igual a lo publicado.
- cita_de_contexto: "Intendente de Montevideo 5 de mayo de 1990-5 de mayo de 1995" (infobox, https://es.wikipedia.org/wiki/Tabar%C3%A9_V%C3%A1zquez)
- accion_sugerida: ninguna para bloquear la publicación.

- severidad: aviso
- tipo: un_solo_grupo (aplicado a un mandato, no a una `evidencia.nivel: reportado` — esta
  colección no exige dos grupos, pero la calidad de la corroboración importa igual)
- objecion: Este mandato de cinco años —significativo: es la primera intendencia de izquierda de
  Montevideo— se sostiene con una sola fuente, y es Wikipedia. La única fuente no-Wikipedia que
  este lote encontró para Vázquez (El Observador, 2014-08-29) es sobre la campaña de 2014, no
  sobre 1990-1995. No hay indicio de error, pero un hecho de este peso institucional debería tener
  una segunda pata (Corte Electoral de 1989, hemeroteca de 1990/1995, o el propio archivo de la
  Intendencia de Montevideo).
- cita_de_contexto: "Fue el primer candidato de izquierda en ocupar un cargo electivo de relevancia en el país cuando alcanzó, en 1990, la intendencia de Montevideo" (https://es.wikipedia.org/wiki/Tabar%C3%A9_V%C3%A1zquez)
- accion_sugerida: buscar una segunda fuente (hemeroteca de 1990 o 1995, o Corte Electoral) para
  este mandato específico antes de tratarlo como definitivamente cerrado; no bloquea porque el
  dato en sí no está en duda, solo su respaldo.

### politicos-existentes.yaml[lacalle-pou] — depende de un lote hermano sin promover
- severidad: aviso
- tipo: asimetria (de proceso, no editorial)
- objecion: Confirmado lo que dice `notas.md`: la base usada es
  `inbox/candidatos/2019/2026-09-05/politicos-existentes.yaml#lacalle-pou`, no
  `content/politicos/lacalle-pou.yaml` (que solo tiene la presidencia 2020-2025). Ese archivo de
  2019 lo está editando otro agente en paralelo. Lo que este lote de 2014 agrega de forma
  independiente y verificable es solo: la candidatura de 2014 (fecha 2014-11-30, 955.741 votos,
  43,50 %, no electo) — verificada carácter por carácter contra la tabla de balotaje de 2014 y
  válida sin importar cómo termine el archivo de 2019. Todo lo demás (los 4 mandatos y la
  candidatura de 2019) es una copia literal del estado actual del inbox de 2019, no trabajo propio
  de este lote.
- cita_de_contexto: "Partido NacionalLuis Alberto Lacalle Pou - Jorge Larrañaga955.74143,50 %41,17 %Fórmula perdedora" (https://es.wikipedia.org/wiki/Elecciones_generales_de_Uruguay_de_2014)
- accion_sugerida: **qué rebasar cuando se promueva.** Promover 2019 primero. Al promover este
  lote de 2014 (vía `content/correcciones/`, porque `lacalle-pou.yaml` ya está publicado),
  reemplazar el bloque de `mandatos` y la candidatura de 2019 por lo que haya quedado del archivo
  de 2019 ya promovido (puede haber cambiado desde que este lote lo copió), y agregar encima,
  sin tocarla, la candidatura de 2014 que este lote sí verificó de forma independiente.

- severidad: corregir
- tipo: cita_fuera_de_contexto
- objecion: La candidatura de 2019 (heredada del inbox de 2019, no escrita por este lote, pero
  reproducida aquí) tiene `votos: 1189313` respaldado por una cita que dice
  "PartidoNacionalLuis Alberto Lacalle Pou - Beatriz Argimón696.45228,62%10/3030/99". Ese número,
  696.452, es la **primera vuelta**, no el balotaje: abrí
  `https://es.wikipedia.org/wiki/Elecciones_generales_de_Uruguay_de_2019` y confirmé que la fila
  del balotaje dice "Partido Nacional - Coalición MulticolorLuis Alberto Lacalle Pou - Beatriz
  Argimón1.189.31349.98 %48,88 %Fórmula ganadora" (carácter ~30470). El número 1.189.313 en sí es
  correcto — coincide con la fila real de balotaje — pero la cita adjunta no lo dice: cita la fila
  equivocada de la misma tabla. Es votos correctos con cita incorrecta, exactamente el tipo de
  error que el brief pide cazar ("verificá que la cita diga lo que le hacés decir").
- cita_de_contexto: "Partido Nacional - Coalición MulticolorLuis Alberto Lacalle Pou - Beatriz Argimón1.189.31349.98 %48,88 %Fórmula ganadora" (https://es.wikipedia.org/wiki/Elecciones_generales_de_Uruguay_de_2019, carácter ~30470, la fila correcta que debería reemplazar a la citada)
- accion_sugerida: reemplazar la cita de esa fuente por la fila de balotaje real (arriba). Esto
  hay que corregirlo en el origen (`inbox/candidatos/2019/2026-09-05/politicos-existentes.yaml`) y
  se hereda automáticamente a este lote si se sigue la acción sugerida anterior (rebasar sobre la
  versión ya corregida de 2019).

- severidad: corregir
- tipo: contexto_omitido
- objecion: El mandato "Senador de la República 2015-2019" cierra con `hasta: 2019-08-12` y una de
  sus dos fuentes es la nota de Teledoce del mismo día. Leí la nota completa: dice que Lacalle Pou
  "presentó este lunes su renuncia al Senado" (12 de agosto, lunes) pero termina con "La renuncia
  será votada este martes al inicio de la sesión" — es decir, al momento de publicarse la nota, la
  renuncia **todavía no había sido aceptada por el Senado**; iba a votarse al día siguiente (13 de
  agosto). La cita que el registro usa ("Lacalle Pou presentó este lunes su renuncia al Senado,
  para concentrarse ciento por ciento en la campaña electoral") es literal y contigua, y no
  incluye la frase en futuro — pero la misma nota, leída entera, contradice que el 12 de agosto
  haya sido ya el último día efectivo en el cargo. El infobox de Wikipedia sostiene igual el 12 de
  agosto como fecha de cierre, así que hay una fuente independiente para esa fecha, pero ninguna
  de las dos fuentes usadas documenta el hecho consumado (la aceptación de la renuncia), solo el
  anuncio de que se votaría.
- cita_de_contexto: "La renuncia será votada este martes al inicio de la sesión." (https://teledoce.com/telemundo/nacionales/luis-lacalle-pou-presento-su-carta-de-renuncia-al-senado-para-dedicarse-por-completo-a-la-campana-electoral)
- accion_sugerida: buscar el Diario de Sesiones del Senado del 13 de agosto de 2019 (o posterior)
  que registre la aceptación de la renuncia y la jura del suplente, para fijar si `hasta` debe ser
  2019-08-12 o 2019-08-13. Mientras tanto, esta fecha se apoya en el infobox de Wikipedia, no en
  la nota de Teledoce citada.

### politicos-existentes.yaml[mieres] — depende de un lote hermano, y acá SÍ hay un problema no detectado por el investigador
- severidad: corregir
- tipo: asimetria (de proceso) / contexto_omitido
- objecion: `notas.md` justifica usar `content/politicos/mieres.yaml` (publicado) como base
  diciendo que es "la versión vigente y más reciente", y que verificó que no le faltan mandatos.
  Es cierto para mandatos. Pero **no comparó candidaturas**, y ahí `content/politicos/mieres.yaml`
  está incompleto: solo tiene la candidatura de 2024, no la de 2019 (Mieres también fue candidato
  a presidente en 2019, 23.580 votos, 0,97 %, sexto lugar). Fui a comprobar dónde estaba el
  supuesto duplicado que `notas.md` menciona y **no está en el archivo que dice** (`inbox/candidatos/2019/2026-09-05/politicos.yaml` no tiene ninguna entrada `mieres`); está en
  `inbox/candidatos/2019/2026-09-05/politicos-existentes.yaml#mieres`, que resultó ser
  **estrictamente más completo** que `content/politicos/mieres.yaml`: ya trae la candidatura de
  2019 Y la de 2024, más una cita adicional bajo el mandato de Senador ("Mieres no logró la
  reelección en el Senado para el periodo 2020-2025"). Es exactamente el mismo tipo de situación
  que el brief documentó para Lacalle Pou (usar el inbox hermano por ser más completo), pero acá
  se hizo la comparación equivocada: se prefirió `content/` por estar publicado, no por ser más
  completo, cuando la propia lógica que el brief aplicó a Lacalle Pou dice que completitud gana
  sobre fecha de publicación.
- cita_de_contexto: "Partido IndependientePablo Mieres - Mónica Bottero23.5800,97%0/301/99" (inbox/candidatos/2019/2026-09-05/politicos-existentes.yaml#mieres, candidatura 2019, cita de https://es.wikipedia.org/wiki/Elecciones_generales_de_Uruguay_de_2019)
- accion_sugerida: **riesgo concreto si se promueve tal cual.** `pnpm promover` nunca sobreescribe
  un archivo existente; para actualizar `mieres.yaml` (ya publicado) hace falta un
  `content/correcciones/<id>.yaml`. Si ese correccion usa la versión de ESTE lote (candidaturas
  2014+2024), la candidatura de 2019 que el lote hermano de 2019 ya documentó quedaría afuera del
  sitio en cuanto ese correccion se aplique — y si después el lote de 2019 aplica su propia
  corrección (candidaturas 2019+2024) sin la de 2014, pasa lo mismo al revés. El editor tiene que
  fusionar las tres candidaturas (2014, 2019, 2024) en una sola corrección para `mieres`, igual
  que ya está previsto para `lacalle-pou`, y no promover ninguna de las dos versiones sueltas
  como si fuera la definitiva.

- severidad: aviso
- tipo: sin_objecion
- objecion: El mandato "Director de Educación 1995-1996" (heredado, no tocado por este lote)
  sigue con precisión de año, no de día. Busqué en la web una fecha de designación más precisa
  (decreto o resolución del Ministerio de Educación y Cultura) y no encontré ninguna; no parece
  estar "a una búsqueda de distancia", así que la precisión de año que ya tiene se sostiene.
- cita_de_contexto: "Durante 1995 y 1996, ocupó el cargo de Director de Educación en el Ministerio de Educación y Cultura" (https://es.wikipedia.org/wiki/Pablo_Mieres)
- accion_sugerida: ninguna adicional a la que ya deja el validador (aviso de precisión de año).

## Objeciones al lote

- **Dependencia de fuentes no-Wikipedia muy concentrada.** De las 5 fichas, 4 (Vázquez, Lacalle
  Pou, Bordaberry, Mieres) comparten una sola fuente no-Wikipedia para su condición de candidato
  de 2014: la misma nota de El Observador ("Los debates y su cuestión de oportunidad"). No es un
  error — el brief solo exige "al menos una fuente no-Wikipedia por persona" y eso se cumple con
  el mismo esfuerzo para las cuatro — pero es una diversidad de fuentes baja para un hecho que
  cinco fórmulas comparten por igual (la elección de 2014 entera se sostiene en Wikipedia +
  1-2 notas de El Observador, un solo grupo mediático, `werthein-hochbaum`). Esta colección
  (`politicos.mandatos`/`candidaturas`) no exige dos grupos como sí lo hace `evidencia.nivel:
  reportado`, así que esto es un aviso de calidad, no un bloqueo.
- **Ningún dato oficial de primera mano.** Las siete filas de resultados (votos, %, bancas) se
  toman de tablas de Wikipedia que dicen "Fuente: Corte Electoral" pero no enlazan al documento de
  la Corte Electoral. Sugiero, para una futura corrección, reemplazar o acompañar esas citas con
  el resultado oficial publicado en corteelectoral.gub.uy, que es el documento que decide.
- **Simetría del lote:** cubre 5 partidos de todo el espectro (izquierda, derecha, centro,
  centro-izquierda chico) con el mismo umbral y el mismo esfuerzo de búsqueda declarado
  (1 fuente no-Wikipedia por persona, mismo método). No encontré tratamiento distinto para
  ningún lema por su ubicación ideológica.
- **Discrepancias contra fuente primaria:** no se encontró ninguna. Todo lo señalado arriba son
  problemas internos de Wikipedia contra sí misma (Bordaberry: infobox vs. cuerpo del artículo) o
  problemas de la corrida contra Wikipedia (Lacalle Pou 2019: cita mal encolumnada). Ninguno de los
  dos casos tiene, del otro lado, un documento oficial, diario de sesiones o video que decida un
  hecho distinto al publicado por un medio — que es el único terreno donde correspondería escribir
  `discrepancias.yaml`. No se escribió ese archivo en esta corrida.

## Objeciones al brief

Ninguna violación de Regla 0 en el texto del brief: el umbral de bancas se define antes de saber
quién queda adentro, y se pide explícitamente nombrar a quien el umbral deja afuera con sus votos
y su razón, lo mismo para los cinco lemas que entran. El único punto de método señalado arriba
(Mieres) no es un sesgo partidario — es una inconsistencia en cómo se aplicó, entre dos personas
del mismo lote, la misma regla ("mirá los dos lugares, preferí lo más completo"), y afectó a un
candidato del Partido Independiente, no a uno de los partidos grandes. Se corrige con una
verificación mecánica (comparar longitud de `candidaturas`), no con un cambio de criterio.

## Cobertura

```yaml
- medio: el-observador
  url: https://elobservador.com.uy/nota/los-debates-y-su-cuestion-de-oportunidad-20148291830
  fecha: 2014-08-29
  evento: "propuesto:elecciones-2014"
  politico: vazquez
  tono: neutral
  justificacion: >-
    La nota reporta como hecho, sin adjetivos, que "el cara a cara entre los candidatos a la
    presidencia fue suspendido ante la negativa de Vázquez", sin calificar esa negativa.

- medio: el-observador
  url: https://elobservador.com.uy/nota/los-debates-y-su-cuestion-de-oportunidad-20148291830
  fecha: 2014-08-29
  evento: "propuesto:elecciones-2014"
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Solo registra que "todavía no hubo respuesta del blanco Luis Lacalle Pou, quien va delante
    del líder de Vamos Uruguay en las encuestas", sin tomar postura sobre esa demora.

- medio: el-observador
  url: https://elobservador.com.uy/nota/los-debates-y-su-cuestion-de-oportunidad-20148291830
  fecha: 2014-08-29
  evento: "propuesto:elecciones-2014"
  politico: bordaberry
  tono: favorable
  justificacion: >-
    Lo presenta como el único que impulsa activamente el debate entre los demás: "el candidato
    colorado, Pedro Bordaberry, pretende que haya un debate entre el resto de los presidenciables".

- medio: el-observador
  url: https://elobservador.com.uy/nota/los-debates-y-su-cuestion-de-oportunidad-20148291830
  fecha: 2014-08-29
  evento: "propuesto:elecciones-2014"
  politico: mieres
  tono: neutral
  justificacion: >-
    Solo lo nombra entre los cuatro presidenciables contactados por Andebu: "Menos Vázquez todos
    contestaron que sí", sin desarrollo adicional sobre su postura.

- medio: el-observador
  url: https://www.elobservador.com.uy/nota/luis-lacalle-pou-la-derrota-del-2014-me-mato-deci-que-tengo-una-mujer-que-tira-para-adelante--20192519258
  fecha: 2019-02-06
  evento: "propuesto:elecciones-2014"
  politico: lacalle-pou
  tono: favorable
  justificacion: >-
    Perfil humanizador centrado en su recuperación tras la derrota: "El candidato contó el papel
    que jugó su esposa, Lorena Ponce de León, para que se recompusiera y volviera a la política".

- medio: teledoce
  url: https://www.teledoce.com/telemundo/nacionales/luis-lacalle-pou-presento-su-carta-de-renuncia-al-senado-para-dedicarse-por-completo-a-la-campana-electoral/
  fecha: 2019-08-12
  evento: elecciones-2019
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Reporte procedimental sin adjetivos sobre un trámite: "Lacalle Pou presentó este lunes su
    renuncia al Senado, para concentrarse ciento por ciento en la campaña electoral".

- medio: el-observador
  url: https://elobservador.com.uy/nota/los-partidos-pequenos-201441921260
  fecha: 2014-04-19
  evento: "propuesto:elecciones-2014"
  politico: abella
  tono: desfavorable
  justificacion: >-
    La nota lo caracteriza por asociación con figuras controvertidas y por un llamado a
    encarcelar a un rival político: "Abella quiere restaurar las viejas banderas de la izquierda.
    Admira a Fidel Castro y a Hugo Chávez" y "Esa gente tendría que estar presa (…). Pido cárcel
    para ellos". Se deja constancia de que la misma nota trata con el mismo tono de curiosidad/
    burla al candidato de un partido de derecha marginal (Unión Para el Cambio, admirador de
    Perón) citado en la misma pieza, que no forma parte de este lote por no tener banca: el
    tratamiento no es específico de la izquierda, es parejo hacia los partidos chicos de ambos
    lados que cubre esa nota.
```
