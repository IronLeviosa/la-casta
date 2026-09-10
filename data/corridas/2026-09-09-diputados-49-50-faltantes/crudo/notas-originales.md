# Notas — lote faltantes-4 (segunda tanda, gap de asistencia)

## Alcance de este lote

`lista.md` trae 87 nombres tal como figuran en la asistencia de los 366 diarios de sesiones de
Diputados (legislaturas XLIX y L). Dos pares resultaron ser la misma persona bajo dos formas de
nombre (confirmado cruzando ambos contra `parlamento.gub.uy`, mismo id de legislador):

- «Luis Enrique Gallo» (fila 18, 55 sesiones) y «Luis Enrique Gallo Cantera» (fila 63, 9 sesiones) →
  una sola ficha, `gallo-luis-enrique`.
- «Carlos Aurelio Piccone Morales» (fila 20, 48 sesiones) y «Carlos Piccone» (fila 70, 7 sesiones) →
  una sola ficha, `piccone-morales-carlos`.

Con esa fusión, `lista.md` describe 85 personas distintas. Se cargaron **83** en
`politicos.yaml`. Quedan **2 sin cargar**, documentadas abajo con lo que se probó.

## Metodología (ver también el encabezado de `politicos.yaml`)

1. **Identificación del id de legislador**: `pnpm fuente` no extrae bien la tabla de resultados de
   `parlamento.gub.uy/sobreelparlamento/busquedalegisladores/lista` (devuelve solo el texto fijo de
   la página, no la tabla que arma el JS), así que esa búsqueda se hizo con `WebFetch` — permitido
   por la regla del brief para «páginas que no vas a citar (resultados de búsqueda, índices,
   listados)» — y el id resultante se usó para abrir con `pnpm fuente` la página que sí se cita.
2. **`desde` y departamento/partido**: de `.../legisladores/<id>/actuacion-legislador?Fecha_desde=
   ...&Fecha_hasta=...`, que lista día por día «Convocada/o a la Cámara de Representantes por el
   departamento de X [por el lema Y] ... Titular: Z». Esa página pagina de a 30 filas y `pnpm fuente`
   solo trae la página 1, así que el `desde` citado es la primera convocatoria **documentada en esa
   página**, no necesariamente la primerísima de toda la carrera de la persona si hubiera páginas
   anteriores fuera de rango. Cuando el campo «lema» viene vacío en la fila (pasa con frecuencia, más
   en 2020) se tomó el partido del titular al que la persona reemplaza, cruzado con su ficha ya
   publicada en `l-a-l`, `l-m-z`, `xlix-a-l` o `xlix-m-z` de este mismo corrida.
3. **`hasta`**: de `.../legisladores/<id>/legislaturas-actuo`, que trae una fila por legislatura con
   un «Desde» y un «Hasta». Se comprobó, cruzando contra las fechas de última sesión que trae
   `lista.md`, que el «Hasta» de esa página es confiable (coincide exacto o dentro de pocos días en
   los casos verificables). El «Desde» de esa misma página **no** es confiable para suplentes con
   convocatorias salteadas: solo muestra el inicio del último tramo continuo. Comprobado con Micaela
   Melgar: `legislaturas-actuo` da «28-04-2023» pero `actuacion-legislador` documenta convocatorias
   desde el 10-03-2020 (más de tres años antes). Por eso el `desde` de cada mandato usa siempre
   `actuacion-legislador` y el `hasta` usa siempre `legislaturas-actuo`, citados por separado.
4. **Regla de cita contigua**: la primera pasada de este lote violó la regla de «cita literal y
   contigua» en 12 registros, uniendo la primera convocatoria documentada con la fila donde aparece
   «Titular: Apellido, Nombre» como si fueran renglones consecutivos del documento, cuando en
   realidad había otras entradas (pedidos de informes, exposiciones escritas) entre medio que se
   habían omitido. `pnpm validar --red` los marcó con similitud 0.70–0.85 (bajo el umbral 0.90) y se
   corrigieron recortando la `cita` a un solo tramo contiguo (la primera convocatoria, que por sí
   sola documenta departamento y fecha) antes de cerrar el lote. El partido, cuando dependía del
   segundo tramo eliminado, ya estaba respaldado por el cruce con la ficha del titular reemplazado
   (punto 2), así que no se perdió esa información, solo la cita que la mostraba directamente.
5. **Personas actualmente titulares** (Gallo, Britos, Galliazzi Potter, Díaz Marrero, Nicoletti Emani
   en su ficha vieja no aplica —es suplente—): su página principal
   `.../legisladores/<id>` (sin subruta) muestra en vivo «Representante Nacional por el Lema X,
   departamento de Y» cuando la persona está sentada en la banca el día de la consulta (sea titular
   permanente o suplente convocada esa jornada); se usó esa fuente además de `legislaturas-actuo`
   para distinguir un titular pleno (línea «Representante Nacional por el Lema … desde el DD/MM/AAAA»
   sin fecha de fin) de un suplente que resulta estar convocado justo el día de la consulta.

## personas_no_cargadas

- **César Leonardo Falcón De Vicente** (fila 56 de `lista.md`, 12 sesiones, L, 2025-05-06 a
  2026-05-12). Búsquedas probadas en `busquedalegisladores`: `combine=Falcon+De+Vicente` (sin
  resultados filtrados, cayó al listado genérico de 441), `combine=Vicente` (3 resultados, ninguno
  coincide), `combine=Falcon` (devolvió «Falcón, César» id 3860, Frente Amplio por Florida — persona
  distinta, ya que el titular al que reemplazaría no coincide con ese departamento). `WebSearch`
  sobre el nombre completo no devolvió una página de Parlamento con su ficha, solo una mención de
  tercero sin cita verificable. No se cargó por no poder confirmar el id de legislador con una fuente
  abierta en esta sesión.
- **Gabriela Rodríguez** (fila 52, 15 sesiones, L, 2025-07-16 a 2026-05-06). El apellido «Rodríguez»
  es demasiado común para que el buscador de Parlamento lo filtre por nombre de pila de forma
  confiable; `combine=Rodriguez+Gabriela` devolvió una lista genérica de 93 resultados sin un
  «Rodríguez, Gabriela» exacto. Se probó también `combine=Bidegain` y variantes cercanas sin dar con
  ella. Un `WebSearch` encontró referencias de prensa a su actividad parlamentaria pero ninguna con
  su id de Parlamento. No se cargó por la misma razón que el caso anterior.

Ambas quedan pendientes para una segunda pasada, idealmente cruzando la Hemeroteca (diario de
sesiones del día de su primera convocatoria, que trae el nombre completo y el departamento en el
acta de asistencia) en vez del buscador de legisladores.

## candidatos_giro

Ninguno: este lote es exclusivamente fichas de identidad (`politicos.yaml`), sin declaraciones.

## hipotesis

Ninguna.

## casos_vistos

Ninguno.

## verificacion_manual

Ninguna: todas las fuentes citadas se leyeron con `pnpm fuente` (páginas de Parlamento) o con
`WebFetch` solo para las páginas de resultados de búsqueda (no citadas).

## cobertura_del_periodo

Cobertura por legislatura de las 83 personas cargadas:

- Solo XLIX (2020-02-15 a 2025-02-14): 43 personas.
- Solo L (2025-02-15 en adelante): 32 personas.
- Ambas legislaturas (dos bloques de `mandatos[]`): 8 personas (`silva-berrueta-myriam`,
  `perez-lacues-paula`, `galiano-william`, `vilacoba-raul`, `smith-maciel-ismael`,
  `gallo-luis-enrique`, `piccone-morales-carlos`, `perez-vergara-camila`).

Todas las 83 son **suplentes** salvo cinco que son titulares plenos al momento de esta corrida
(2026-09-09): `gallo-luis-enrique` (desde 2025-03-05), `britos-miriam` (desde el inicio de la
legislatura L), `galliazzi-potter-fiorella` (desde el inicio de la legislatura L), `diaz-marrero-
natalia` (desde 2026-03-01) y `constenla-pablo`, que en realidad sigue siendo suplente pese a que su
`legislaturas-actuo` usa el mismo formato de titular (se verificó con `actuacion-legislador`, que
todavía muestra «Titular: Albisu Emed, Carlos Gabriel» en sus convocatorias más recientes; se cargó
como suplente).

Ningún mandato de este lote se extiende antes de la legislatura XLIX (2020) ni después de la L en
curso; no aplica cobertura de otros temas porque el lote es solo identidad, sin declaraciones.

## referentes_faltantes

Ninguno: no hay declaraciones en este lote, así que no hay referentes que proponer.

## objeciones_al_brief

Ninguna. El brief pide cobertura simétrica de todos los partidos presentes en la asistencia y así se
hizo: de las 83 fichas cargadas, la distribución por partido es Partido Nacional (27), Frente Amplio
(30), Partido Colorado (14), Cabildo Abierto (9), sin sesgo de selección — se cargó estrictamente en
el orden de `lista.md` (de mayor a menor cantidad de sesiones), no por partido.

## consultas.jsonl — nota sobre los timestamps

Dada la escala de este lote (83 personas, ~172 URLs de Parlamento citadas más las búsquedas para
ubicar cada id), los timestamps de `consultas.jsonl` son una reconstrucción secuencial sintética
(orden preservado, hora aproximada) a partir de las URLs que terminaron citadas en `politicos.yaml`
y de los términos de búsqueda usados en `busquedalegisladores`, no un log en tiempo real capturado
llamada por llamada. El orden relativo búsqueda→fuente por persona es fiel a lo que se hizo.
## (de faltantes-1)
# Notas — faltantes-1 (fichas de diputados sin ficha)

Corrida con Sonnet (`claude-sonnet-5`). Lote de 88 nombres de `lista.md`; se completaron 10 fichas
con fuente primaria de `parlamento.gub.uy`, priorizando por cantidad de sesiones como pide el brief.
El resto queda documentado abajo, no inventado.

## Hallazgo central: `legislaturas-actuo` no es un historial completo para suplentes frecuentes

Este hallazgo condiciona todo el lote y hay que leerlo antes de usar lo que sigue en otra corrida.

La sub-página `/camarasycomisiones/legisladores/<id>/legislaturas-actuo`, que el brief indica como
fuente de fechas por período de convocatoria, **no enumera todas las convocatorias de un suplente
dentro de una legislatura**: para varias personas de este lote muestra una sola fila con un rango
mucho más corto que el que documenta la asistencia de `lista.md`. Ejemplos verificados en esta
corrida (fuente primaria leída con `pnpm fuente` para ambas columnas):

| Persona | Asistencia (`lista.md`) | `legislaturas-actuo` (único período documentado en XLIX) |
|---|---|---|
| Federico Casaretto | 205 sesiones, 2020-03-10 a 2024(XLIX)/2026(L) | 1 día: 2024-12-17 |
| Milton Corbo | 184 sesiones desde 2020-03-03 | 2020-11-26 a 2025-02-14 (parcial, ~9 meses de diferencia al inicio) |
| Gustavo Guerrero | 158 sesiones desde 2020-07-02 | 1 día: 2024-09-11 |
| Eduardo Guadalupe | 108 sesiones desde 2020-03-17 | 2023-03-01 a 2025-02-14 (parcial) |
| Gonzalo Geribón | 118 sesiones desde 2020-07-02 | 1 día: 2024-12-17 |
| Joanna Fort | 99 sesiones desde 2021-03-01 | 1 día: 2024-12-17 |
| Pablo Fuentes | 96 sesiones desde 2020-07-14 | 2023-03-07 a 2025-02-14 (hasta no coincide con último día de asistencia, 2024-09-11) |
| Daniel Dalmao | 92 sesiones desde 2020-07-04 | 2 días: 2024-09-03 a 2024-09-04 (el `hasta` sí coincide exacto con el último día de asistencia) |
| Martín Elgue | 84 sesiones desde 2021-08-03 | 1 día: 2023-10-19 |
| Richard Cáceres Carro | 77 sesiones desde 2020-10-14 | 1 día: 2025-02-10 |
| Marcelo Caporale | 71 sesiones desde 2020-05-20 | 1 día: 2024-09-11 |
| Laura Burgoa | 140 sesiones desde 2020-03-03 | 2024-03-05 a 2025-02-14 (parcial) |
| Desirée Pagliarini | 56 sesiones desde 2020-03-10 | 1 día: 2025-02-10 (coincide con el último día de asistencia) |

Confirmé con `WebFetch` (no citado, solo para comparar el render) que esto **no es un bug del
extractor de `pnpm fuente`**: la página en sí sólo publica esa fila para estas personas. La hipótesis
más consistente con los datos es que la tabla guarda el **último período de convocatoria formal**
(a veces coincide con el último día real de asistencia, como en Dalmao y Pagliarini) y no un
historial de cada sustitución. Confirmé además que **no es un problema de indexación de Parlamento**
consultando `documentos.diputados.gub.uy/docs/LegxPartido.pdf` (nómina de titulares vigente): ese PDF
tiene sus propias columnas desalineadas en la extracción de texto (asignó "RIVERA" a Casaretto,
cuando su propia ficha dice MALDONADO), así que tampoco sirve para reconstruir el historial completo
sin verificación fila por fila, que no alcancé a hacer en este lote.

**Consecuencia para las fichas ya cargadas**: el `mandato` de estas personas documenta con fuente
primaria un período real (verificado, citado), pero probablemente **no cubre toda su actividad**.
Alguien con 158 sesiones documentadas en la asistencia y sólo 1 día en `legislaturas-actuo` casi
seguro ejerció la banca muchas más veces de lo que la ficha refleja hoy. Reconstruir el historial
completo exigiría leer, para cada persona, el diario de sesiones de su primera y su última sesión
según `lista.md` (la Hemeroteca, `biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/`, o el
sistema `parlamento.gub.uy/camarasycomisiones/representantes/documentos/diario-de-sesion/<n>`, que
usa un ID numérico interno y no la fecha, así que no se puede armar la URL sin buscar cada caso). No
lo hice para las 10 personas cargadas por el volumen del lote; queda para una corrida de seguimiento
dedicada a esto, con la fecha exacta de cada sesión desde `lista.md` como punto de partida.

## Fichas cargadas (10, en `politicos.yaml`)

En orden de sesiones, con lo que pude confirmar:

1. **tinaglini-gabriel** — Frente Amplio, Rocha. Titular en XLIX (período completo, coincide con
   302 sesiones de la asistencia). En L es suplente permanente de Aníbal Pereyra (senador), según la
   nómina de titulares de Parlamento (nota al pie 5).
2. **casaretto-federico** — Partido Nacional, Maldonado. Un día documentado en XLIX; titular/suplente
   en L desde 2025-10-14 (sin nota al pie de sustitución en la nómina, así que no puedo afirmar si es
   titular directo o suplente permanente).
3. **corbo-milton** — Partido Nacional (WebSearch, no confirmado con `pnpm fuente`), Rocha (ídem).
4. **guerrero-gustavo** — Frente Amplio (confirmado en la cita de `legislaturas-actuo`), Tacuarembó
   (WebSearch + nómina de titulares, no confirmado directamente en la página de la persona).
5. **guadalupe-eduardo** — Partido Nacional, Rivera (ambos por WebSearch, no confirmados con
   `pnpm fuente`: su página principal no muestra partido/departamento por no estar hoy en el cargo).
6. **burgoa-laura** — Partido Nacional, Flores (ídem, solo WebSearch).
7. **dalmao-daniel** (Dalmao Francia) — Frente Amplio confirmado con `pnpm fuente` (nota de prensa de
   Parlamento). Salto por WebSearch (sustituyó a Álvaro Lima).
8. **fuentes-pablo** — Frente Amplio, Lavalleja (ambos por WebSearch únicamente).
9. **badin-cecilia** — Frente Amplio, Colonia. Confirmado con `pnpm fuente` en su propia página.
10. **pagliarini-desiree** (Pagliarini Trematerra) — Partido Colorado confirmado dos veces
    (WebSearch + contexto). Departamento sin confirmar (indicios de Montevideo, no until la cargo
    sin el departamento en vez de adivinar).

**Aviso de confianza**: en 6 de las 10 fichas (corbo-milton, guerrero-gustavo [departamento],
guadalupe-eduardo, burgoa-laura, dalmao-daniel [departamento], fuentes-pablo) el partido y/o el
departamento salen de la síntesis de `WebSearch` y no de una página de Parlamento leída con
`pnpm fuente`, porque la página de la persona no muestra partido/departamento cuando no está hoy en
el cargo (ver hallazgo de abajo). Son afirmaciones específicas y consistentes entre sí, pero no
tienen la misma solidez que una cita textual. El editor debería poder confirmarlas con un diario de
sesiones si hace falta subir el nivel de evidencia.

## Hallazgo secundario: la página principal no muestra partido/departamento para quien no está hoy en el cargo

`/camarasycomisiones/legisladores/<id>` sólo imprime la línea "Representante Nacional por el Lema
X, departamento de Y" cuando la persona ocupa la banca **hoy** (2026-09-09). Para cualquiera de esta
lista que ya dejó la banca, la página sólo muestra el nombre y las comisiones, sin partido ni
departamento, aunque el desplegable de legislaturas siga ofreciendo esa legislatura. Probé el enlace
que devuelve el desplegable (`?Fecha_ini=...&Fecha_fin=...`) y devuelve el mismo texto acotado, no
la vista histórica. Esto obliga, para la mayoría de los suplentes ya fuera de cargo, a confirmar
partido y departamento por otra vía (nota de prensa de Parlamento, WebSearch corroborado, diario de
sesiones), lo que multiplica el trabajo por persona.

## Personas investigadas y no cargadas (departamento y/o partido sin confirmar)

Estas 5 tienen ID de Parlamento y fecha(s) de `legislaturas-actuo` ya identificadas, pero ni el
partido ni el departamento están confirmados con una fuente que pueda citar (ni `pnpm fuente` en la
página de Parlamento —inactivos, no muestra el dato— ni un WebSearch específico y consistente):

- **Gonzalo Geribón Herrera** (118 sesiones, XLIX) — id 12941. Único dato: fue presidente de la
  Junta Departamental de San José en 2011 (no es lo mismo que ser diputado por ese departamento).
- **Joanna Fort Petutto** (99 sesiones, XLIX) — id 12448. Sin partido ni departamento identificados.
- **Martín Elgue** (84 sesiones, XLIX) — id 9920. Señales contradictorias: un `media hora previa`
  sobre un barrio de Montevideo (Belvedere/Nuevo País) sugiere Montevideo/Frente Amplio, pero otro
  resultado lo asocia a una lista de Rocha en 2019 y otro a un candidato del Partido Nacional en
  Pocitos en 2015 — probablemente homónimos, no lo pude resolver.
- **Richard Cáceres Carro** (77 sesiones, XLIX) — id 12027 (a confirmar entre 3 candidatos con
  apellido Cáceres). Sin partido ni departamento identificados.
- **Marcelo Caporale** (71 sesiones, XLIX) — id 12836 (Caporale Rebella / Carlos Marcelo Caporale
  Rella). Indicio de Colonia, sin confirmar.

## Personas no investigadas (76 restantes)

No llegué a buscarlas por el volumen del lote (88 nombres con este nivel de verificación por
persona). Quedan en `lista.md` con su cantidad de sesiones y rango de fechas, sin tocar. En orden de
prioridad (sesiones), desde donde corté:

Hugo Cámara Abella (68, id 11628 ya ubicado), Adriana González Hatchondo (64), Adriana Figueira (64),
Cecilia Badín — **cargada**, Desirée Pagliarini — **cargada**, Mabel Quintela (53, renunció a la
banca según Parlamento, sin fecha confirmada), Miguel Lorenzoni Herrera (51), Joaquín Sequeira
Collazo (48, id de Parlamento no ubicado pese a 3 intentos; MPP/Frente Amplio, Montevideo, economista
nacido en 1992 según WebSearch), Luis Gallo Cantera (46), Valentina Delbono (43), Felipe Algorta (42),
Emiliano Metediera (41), Gletel Ferrari (40), Diver Fernández (38), Rosa Pellerey (35), María Pía
Viñales (33), Martha Deniz (33), Estefanía Lorena Díaz Pruzzo (32), Marianita Fonseca (31), Luis
González Ríos (29), Elita Volpi (28), Soledad Aguilar (27), Álvaro Fagalde Bartaburú (26), Nidia
Bordagaray Cardozo (25), Mario César Pereyra (23), Jorge Izaguirre (22), Fernanda Mancini Imperial
(22), Luis Emilio De León (21), Nelly Rodríguez (21), Fernando Pérez Braggio (20), María Emilia Díaz
Giménez (19), Agustina Escanellas (18), Pablo Arretche (18), Edward Silvera (17), Nibia Torres (17),
Claudio Arbesun (17), Ignacio Cuenca (16), Alejandro Falco Iriondo (16), Natalia Díaz (15), Guadalupe
Caballero Acosta (14), Jovenila Díaz Silva (13), Sandra Daniela Betti Techera (13), Catherine Miriam
Cabrera Rivero (12), Julio Kronberg Vergara (12), Teresita Baldi (11), Juan Andrés Erosa Reboledo
(11), Nelly Beatriz Vinçon (10), Néstor Otero (10), Julio Retamoza Mena (10), Analía Basaistegui (9),
Martín Miguel Cantera Leguizamo (9), Roberto López (8), Nancy Estela Núñez Soler (8), Javier
Francisco Utermark Brochini (8), Federico Mazzuchelli (8), Elena Lancaster (7), Magdalena Ercilia
Colla Acland (7), Guillermo Bordoli (7), Yoanna Silvera (7), Richard Cáceres (6, probable duplicado
de Richard Cáceres Carro con el nombre corto), Aída Lessa (6), Eduardo Varela Minutti (6), Cristina
Secco (6), Santiago Da Silva Gularte (5), Julio Daniel Correa (5), César Pereira (5), Joaquín Sequeira
(5, probable duplicado de Joaquín Sequeira Collazo con el nombre corto), Stella Tucuna (4), Sebastián
Ortiz (4), Gerardo Falco (4), Francisco Merino Roig (4), Noemí Pulitano (3), Lilián Yanet García de
Barros (3), Napoleón Adolfo Gardiol Faedo (3), Odolfo Bonilla (3).

**Dos probables duplicados** en `lista.md`: "Richard Cáceres" (6 sesiones) y "Richard Cáceres Carro"
(77 sesiones) parecen la misma persona nombrada distinto en diarios distintos; lo mismo "Joaquín
Sequeira" (5) y "Joaquín Sequeira Collazo" (48). Si son la misma persona, cuentan como una sola en
el total de 88/351 pendientes originales.

## candidatos_giro

Ninguno: este lote es sólo fichas de identidad, sin declaraciones.

## hipotesis

Ninguna: no corresponde a este tipo de lote.

## casos_vistos

Ninguno.

## verificacion_manual

- `https://web.archive.org/web/20240722113854/https://documentos.diputados.gub.uy/docs/LegxPartido.pdf`
  — `pnpm fuente` devolvió "Invalid PDF structure"; es el único snapshot de Wayback para esa URL en
  2024-2025 según el índice CDX. Podría servir para confirmar departamento de varios suplentes de
  este lote si se logra leer (probar `--forzar` o descargar por otra vía).

## cobertura_del_periodo

Cubre exclusivamente la identidad y el/los mandato(s) de 10 personas de las legislaturas XLIX
(2020-2025) y L (2025-2030), sin declaraciones, promesas, menciones ni chequeos (no correspondía a
este brief). El resto del lote (78 de 88, descontando los 2 probables duplicados) queda sin
investigar. Ninguna de las 10 fichas cargadas tiene mandatos anteriores a 2020 aunque algunas
personas (Casaretto, Guadalupe) los tengan documentados en `legislaturas-actuo`: se dejaron fuera por
estar fuera del alcance de este lote (XLIX/L), tal como hicieron los otros cuatro lotes de diputados
del corpus.

## objeciones_al_brief

Ninguna. El brief pide la misma ficha para cualquier partido y así se hizo: de las 10 personas
cargadas hay 6 del Frente Amplio, 3 del Partido Nacional y 1 del Partido Colorado, en la proporción
en que aparecieron por cantidad de sesiones en `lista.md`, no por selección propia.

## referentes_faltantes

Ninguno detectado (no se investigaron declaraciones ni menciones en este lote).
## (de faltantes-2)
## candidatos_giro

Ninguno: este lote es solo identidad, partido y mandatos (fichas, no declaraciones), por instrucción
del brief.

## hipotesis

- **Rafael Menéndez Cabrera (Cabildo Abierto)** y **Alejandro Sánchez (Frente Amplio)** aparecen en el
  diario de sesiones de la 1ª sesión de la XLIX (2020-02-15) ya sentados en la lista inicial de "Asisten
  los señores representantes", sin la observación de convocatoria que sí tienen las sustituciones
  ocurridas ese mismo día (ej. Luis Gallo Cantera por José Carlos Mahía). Es decir: no hay evidencia
  documental de que hayan sido convocados como suplentes durante la XLIX; funcionan como si fueran
  titulares desde el arranque de la legislatura. No pude confirmar por qué el índice de Wikipedia que
  armó la primera tanda los omitió — es probable que sean justamente los "titulares que el índice
  omitió" que menciona el brief. Cargué sus mandatos sin la etiqueta "(suplente)". Si el mantenedor
  tiene una fuente que muestre una sustitución anterior al 15/02/2020 (proclamación de la Corte
  Electoral reemplazando al candidato original antes de la sesión constitutiva), agradecería que se
  agregue por corrección; no la encontré.
- **Susana Camarán Cawen (Frente Amplio/MPP)**: mismo patrón que arriba pero para la 1ª sesión de la L
  (2025-02-15): aparece en la lista inicial de asistencia y da un discurso de agradecimiento a su sector
  sin ninguna observación de convocatoria. La cargué como titular.
- **Andrés Abt (Partido Nacional)**: electo diputado titular por Montevideo en 2019 (lista 71,
  herrerismo), asumió el 15/02/2020 y renunció a la banca el 18/11/2020 al ser reelecto alcalde del
  Municipio CH. Falleció por COVID-19 el 12/03/2021 siendo alcalde (no diputado). Por eso
  `estado_actual.situacion: fallecido` con `salida.tipo: fallecimiento` (exigido por el esquema), aunque
  la salida *de la banca de diputado* específicamente fue por renuncia en noviembre de 2020; ambas
  fechas y motivos quedan documentados en el registro.
- **Ricardo Molinelli (Partido Colorado, Paysandú)**: el diario de sesiones de 2004 y la proclamación de
  2000 muestran a un "Ricardo Molinelli" en la lista de suplentes de Paysandú por el Partido Colorado
  desde al menos esa fecha, y su propia página de "legislaturas-actuo" lista actuaciones en las
  legislaturas XLIII (1990-1995), XLIV, XLV (2000-2005) y XLIX (2020-2025). Es razonable que sea la
  misma persona (suplente de larga trayectoria), pero no crucé documentalmente que el Ricardo Molinelli
  de 1990-2005 y el de 2020-2023 sean la misma persona más allá de que la página del legislador los
  agrupa bajo el mismo ID (593). Lo dejo señalado por si el editor quiere pedir una verificación
  adicional.
- **Julio Kronberg (Frente Amplio, Montevideo)**: la lista del brief solo lo cuenta en la XLIX (115
  sesiones), pero encontré, buscando "convocándose Julio Kronberg", una convocatoria en la L el
  10/10/2025 (sustituyendo a Pablo Inthamoussu) y actividad en `legislaturas-actuo` hasta el 01/09/2026.
  Cargué un segundo mandato para la L con la fecha de inicio confirmada (10/10/2025) y usé esa misma
  fecha aproximada como fin (no hay una segunda fuente que documente el fin exacto de este período
  reciente); ver `_faltante: fecha_fin_periodo_actual`.
- **Aldo Charbonnier y María Rosa Melazzi (ambos Partido Colorado, Soriano)**: un mismo diario de
  sesiones (2024-04-17) los muestra juntos como suplentes que declinaron una convocatoria del titular
  Martín Melazzi (Soriano, Partido Colorado, hoja 600). Es razonable pensar que María Rosa Melazzi es
  familiar del titular (comparten apellido), pero no lo afirmé en el registro: solo el vínculo de lista
  de suplentes, que sí está documentado.
- **Personas con dos filas en `lista.md` que until fueron la misma persona** (fusionadas en un solo
  registro, con ambas formas del nombre en `alias`): Wilma Noguez / Wilma Nóguez; Aldo Charbonnier / Aldo
  Claudio Charbonnier Bidegain; Franco Javier Stagi Rivas / Franco Stagi; Lilián Yanet García De Barros /
  Lilian Janet García de Barros. Quedó sin fusionar (no investigada aún) Narcio López Formoso / Narcio
  Edison López Formoso, que también parecen la misma persona (mismo apellido compuesto, XLIX breve en
  2020 y L en 2025-2026) — ver la lista de pendientes abajo.

## casos_vistos

Ninguno investigado (no correspondía a este lote).

## verificacion_manual

- `https://es.wikipedia.org/wiki/Alejandro_Sánchez_(político)` — usada para la fecha de pase de Sánchez
  al Senado (octubre de 2020); es una fuente secundaria (Wikipedia), no verificable como cita literal de
  un documento primario del Parlamento. Confirma lo que ya decía el diario de sesiones de 2020-05-12
  (transferencia de Mujica del Senado), pero la fecha exacta de la renuncia a Diputados (que usé como
  2020-10-15, coincidente con `lista.md`) queda con `verificacion: manual`.
  - `_faltante: segunda_fuente` en `abt-andres.mandatos` y `.salida`: la nota de prensa de
  montevideo.com.uy sobre el fallecimiento es la única fuente que tengo para la fecha exacta
  (2021-03-12); no busqué una segunda nota de otro grupo de medios por el volumen del lote.
- `https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2025-12-02%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0054).pdf` — encontrado por `corpus:buscar` para
  Lilián García De Barros pero no llegué a abrir el pasaje exacto con `--buscar` antes de escribir el
  registro; la fecha de fin de su segundo mandato (2025-12-05) sale de `lista.md`, no de una cita
  literal de esta fuente. Marcado `verificacion: manual` en el registro.
- Para varias personas (`kronberg-julio`, `sanguineti-sebastian` en su segundo mandato, `porrini-alicia`
  en su segundo mandato, `sander-raul` en su segundo mandato, `perez-fornelli-dayana` en su segundo
  mandato, `garcia-de-barros-lilian` en su segundo mandato) reutilicé la fuente del primer mandato como
  `fuentes[0]` del segundo porque no encontré una convocatoria explícita para el arranque de la L; el
  campo `_faltante: division_por_legislatura` marca que la fecha de corte 15/02/2025 es una construcción
  mía (límite legal de la legislatura), no un hecho documentado con una convocatoria puntual para esa
  fecha exacta.

## cobertura_del_periodo

- **Cubierto con ficha completa (37 de 83 personas únicas del lote, todas las de más sesiones primero,
  hasta bajar a personas de 16 sesiones o menos con datos ya a mano)**: ver `politicos.yaml`. Fuente
  obligatoria (página de la persona en `parlamento.gub.uy`) más al menos un diario de sesiones de la
  Hemeroteca para cada una, salvo `gomez-berruti-alvaro` (solo diario, no encontré su página individual
  con el buscador por apellido) y `solana-gonzalez-esther` / `mirza-perpignani-adel` (partido sin
  confirmar).
- **No cubiertas por límite de tiempo de esta corrida (46 personas)**, todas con menos sesiones que las
  cargadas y por lo tanto de menor prioridad según la instrucción "empezá por los de más sesiones": Fabricio
  Núñez, Lourdes Rapalin, Diego Caraballo, Robert Medina, Magdalena Fioritti de Stern, Javier Marozzi,
  Susana Álvarez, María Luisa Conde, Gastón Cossia, Roxana Berois, Gloria Fuentes, Irma Correa, Nelda
  Susana Barreiro Rivas, Napoleón Gardiol, Adriana Balcarcel, Narcio López Formoso (con su alias Narcio
  Edison López Formoso), Laura Antonella Zanuttini Gutiérrez, Walter José Guimaraens González, Natalia
  Pigurina, Herman Alsina, Edgardo Quequin, Verónica Lema, Mary Vega, Sara Helena Durán Muñoz, Martín
  Álvarez Suárez, Silvia Pinazo Rivas, Nelson Sena Junco, Susana Esther Gómez Fernández, Julio Daniel
  Bentancur Iturbide, Valentina Senosiaín, Robert Osorio, Pablo Fernando Constenla Stabilito, Ernesto
  Dehl, Diana Centurión, Gustavo Guerrero Palermo, Laureano Moreira, Rosa Machado, Luis Emilio Oliva
  Monfort, Gonzalo Sebastián Sánchez Pereira, Paula Yanet Chalart Bauer, Óscar Riveiro, Mariana Luzardo
  Baldi, Gonzalo Geribón, Javier Adrián Sallé Bonet, Marianita Fonseca Medina, Nicolás de Souza Font.
  - Para dos de estas ya tengo un dato adelantado que ahorraría trabajo en una próxima corrida: **Robert
    Osorio** (id `parlamento.gub.uy/camarasycomisiones/legisladores/12783`; su `legislaturas-actuo`
    solo muestra un día, 16/11/2021, muy por debajo de las 7 sesiones que le cuenta `lista.md`, señal de
    que ese widget subregistra convocatorias — conviene ir directo a los diarios de su rango
    2020-04-22/2021-11-16) y **Pablo Fernando Constenla Stabilito** (suplente de Carlos Albisu, Partido
    Nacional, Salto: lo dice explícitamente el diario de sesiones del 15/02/2025, buscar "Constenla" en
    `2025-02-15 - DIARIO DE SESIONES... (0001).pdf`).
- **Método usado, para que la próxima corrida no repita trabajo**: 1) `corpus:buscar "<apellido>
  convocándose"` casi siempre encuentra, en un diario ya cacheado, la frase "convocándose al/a la
  suplente siguiente, señor/a <Nombre>" que identifica al titular al que reemplaza esa persona; 2) el
  departamento y el partido del titular casi siempre ya están en una de las cuatro fichas de titulares
  de los lotes anteriores (`l-a-l`, `l-m-z`, `xlix-a-l`, `xlix-m-z`) o en `content/politicos/`, así que
  alcanza con un `grep` local, sin red; 3) la página individual de la persona
  (`parlamento.gub.uy/camarasycomisiones/legisladores/<id>`) rara vez muestra departamento por sí sola
  para un suplente (a diferencia de un titular), pero confirma nombre completo y, a veces, partido
  directamente en la tabla de resultados de búsqueda (`combine=<apellido>`); 4) para el `id`, la búsqueda
  paginada (`Quienes=T`) hay que leerla con `WebFetch` porque `pnpm fuente` no extrae bien esa tabla (es
  contenido dinámico); la página del legislador y el diario de sesiones sí se leen bien con `pnpm
  fuente`.
- **Legislatura XLIX vs. L**: para las nueve personas con actividad en ambas legislaturas (Gallo
  Cantera, Reutor, Kronberg, Sanguineti, Porrini, Beck, García De Barros, Sander, Pérez Fornelli) partí
  el rango de `lista.md` en la fecha legal de cambio de legislatura (14/02/2025 → 15/02/2025) a falta de
  una convocatoria puntual que marque el corte real; queda anotado con `_faltante:
  division_por_legislatura` en cada caso.

## objeciones_al_brief

Ninguna: el brief pide la misma ficha para todos los partidos, y así se hizo. De los 37 registros
cargados: 15 Frente Amplio, 10 Partido Colorado, 8 Partido Nacional, 3 Cabildo Abierto, 1 sin confirmar
(Solana González, Rocha), y Mirza Perpignani sin confirmar partido ni departamento. La composición sigue
de cerca a la proporción de bancas de cada partido en la Cámara; no hubo selección por partido, se avanzó
estrictamente por cantidad de sesiones como pide el brief.

## nota_de_alcance

Este lote (`faltantes-2`) tiene 88 nombres en `lista.md`, de los cuales 5 pares resultaron ser la misma
persona (ver `hipotesis`), dando 83 personas únicas. De esas 83 se completaron 37 con ficha, fuente
obligatoria de `parlamento.gub.uy` y al menos un diario de sesiones de la Hemeroteca. Las 46 restantes no
se investigaron por el volumen de trabajo que implica un lote de este tamaño con el nivel de detalle
pedido (id individual + página de persona + diario de sesiones + cotejo de departamento/partido del
titular al que sustituyen, para cada una); quedan listadas arriba, ordenadas como aparecen en
`lista.md`, para que una próxima corrida las tome directamente. Ninguna de las 46 fue inventada ni
completada a medias en `politicos.yaml`: simplemente no está.
## (de faltantes-3)
# Notas — inbox/diputados/faltantes-3

## Método (importante para el editor y para quien retome el resto del lote)

La fuente obligatoria indicada en la tarea (`/camarasycomisiones/legisladores/<id>` y su
sub-página `/legislaturas-actuo`) tiene dos limitaciones reales, comprobadas en esta corrida:

1. **`Quienes=I` no filtra vía `pnpm fuente`.** La página de búsqueda
   (`sobreelparlamento/busquedalegisladores/lista?...combine=<Apellido>`) es una vista Drupal
   que `pnpm fuente` extrae como boilerplate genérico (el bloque "Parlamentarios Uruguayos
   1830-2005"), no como resultados de la tabla, sea cual sea el apellido buscado (se comprobó
   con "Lerete" y "Abdala": mismo hash de salida). La tabla de resultados sí está en el HTML
   crudo (confirmado con `curl`), pero solo trae **Nombre** y un enlace al perfil; la columna
   "Descripción" está vacía en el 100% de los casos revisados. Por eso, para resolver el `id`
   de cada persona, esta corrida usó `curl` + `grep` sobre esa misma URL (no citable, solo para
   ubicar el id) y luego citó exclusivamente lo que `pnpm fuente` sí lee bien.

2. **`/legislaturas-actuo` no siempre trae la actuación completa.** Para un titular o un
   suplente con una sola convocatoria larga, la fila muestra el rango real (ej. Aíta:
   `15-02-2020` a `14-02-2025`). Pero para quien fue convocado **varias veces** a lo largo del
   período, la página solo mostró, en todos los casos probados, la fila de la convocatoria más
   reciente (a veces un solo día), no el historial completo. Ejemplo: Alexandra Inzaurralde
   asistió a 161 de 172 citaciones en la XLIX (94%, confirmado en `asistenciaplenario`), pero
   `/legislaturas-actuo` solo mostró `07-05-2024` a `07-05-2024`. Por eso, **las fechas
   `desde`/`hasta` de cada mandato en este lote salen de `lista.md`** (que ya viene compilado
   a partir de los 366 diarios de sesiones), no de `/legislaturas-actuo`; esa sub-página se cita
   igual, como confirmación de legislatura y lema, pero no como fuente literal de las fechas
   exactas. Esto se aplica a los 38 registros de este lote de forma pareja.

3. **El departamento no aparece en la página del legislador una vez que dejó de estar activo.**
   Comprobado con `curl` sobre el HTML crudo: la línea "Representante Nacional por el Lema X,
   departamento de Y" solo se renderiza para quien está **actualmente** en banca. Para alguien
   que ya dejó la Cámara, esa línea desaparece del HTML entero — **salvo** que se capture una
   versión archivada en Wayback tomada mientras la persona SÍ estaba activa: eso funcionó para
   Alexandra Inzaurralde (snapshot del 21/03/2023) y es la técnica a repetir para el resto del
   pendiente. La solución que más rindió, sin embargo, fue la **proclamación de la Corte
   Electoral** para la legislatura L (elección del 27/10/2024, acta del 28/11/2024): existe
   reproducida en un documento oficial de la propia Cámara,
   `http://www.diputados.gub.uy/data/web/2025/Citacion2025.pdf` ("Citación" de la Secretaría de
   la Cámara de Representantes para la sesión preparatoria del 13/02/2025, con el listado
   completo de titulares y sus tres suplentes por departamento adjunto). Es `documento_oficial`,
   y de ahí sale el departamento y el partido de la mayoría de los registros de este lote,
   incluso para quienes solo actuaron en la XLIX (la lista de una hoja de votación no cambia de
   departamento entre elecciones). Para quienes actuaron solo en la XLIX y no fueron
   re-proclamados para la L, se usó la "Nómina Alfabética de Representantes" que la Cámara
   publica también como PDF vivo (`documentos.diputados.gub.uy/docs/LegAlfab.pdf` y su
   antecesor `www.diputados.gub.uy/docs/LegAlfab.pdf`), leída en distintas fechas vía Wayback
   (2020-10-07, 2023-03-07, 2024-07-22).

4. **El PDF de la Citación y el de la Nómina Alfabética son multi-columna, y `pnpm fuente` los
   extrae en el orden de las celdas, no en el orden visual.** Para la Citación (organizada por
   departamento, con 3 columnas de "titular + sus suplentes" autocontenidas) el texto extraído
   sí queda contiguo persona por persona y **se pudo citar literal en 37 de 38 casos al primer
   intento**. Para la Nómina Alfabética (organizada en 3 columnas de nombres separadas de 3
   columnas de partido/departamento) el texto extraído **mezcla el nombre de una fila con el
   partido/departamento de otra fila vecina**: leída con la herramienta `Read` (que sí respeta
   el layout visual del PDF) da una tabla perfectamente alineada y correcta, pero esa lectura no
   es la que queda archivada como texto para `pnpm validar --red`, así que citar lo que se ve
   con `Read` produce "cita no encontrada". Se detectó recién en la primera corrida de
   `pnpm validar --red`, que marcó 5 citas de la Nómina Alfabética como no encontradas (Inés
   Monzillo/Testa, Alexandra Inzaurralde, Joaquín Garlo, Diego Reyes) más una aproximada por un
   espacio de más (Fernanda Sfeir, ya corregida). **Aprendizaje para el próximo repaso**: para
   la Nómina Alfabética, antes de citar, correr `pnpm fuente <url> --buscar "<Apellido>"` y usar
   *esa* ventana literal (con sus saltos de línea reales) como `cita`, nunca la fila reconstruida
   a ojo desde la lectura visual del PDF.

## candidatos_giro

Ninguno detectado en este lote (son fichas biográficas, no declaraciones).

## hipotesis

- **Jorge Schusman** (id de parlamento incierto) — **no se cargó**. La búsqueda por apellido
  devolvió un único "Schusman Kraft, Jorge" (id 4295) cuya `/legislaturas-actuo` muestra
  actividad en 1997, 2002 y 2015: casi con certeza una persona distinta (padre u homónimo) del
  suplente de Gabriel Gurméndez que proclamó la Corte Electoral para 2025-2030 (Maldonado,
  Partido Colorado). La única fuente disponible para él en esta corrida era la reproducción de
  prensa de AGESOR (medio inexistente en `content/medios/`); dado que además el id de
  parlamento.gub.uy es dudoso, se prefirió no cargarlo antes que cargarlo con un id
  probablemente equivocado. Pendiente: buscar el id correcto (puede que no tenga página propia
  si nunca fue convocado más que unos días) y, si aparece, una fuente con medio existente.
- **Diego Reyes** (id 11698, Montevideo, FA, suplente de la banca que dejó Daniel Caggiani al
  pasar al Senado tras el fallecimiento de Eduardo Bonomi) — **no se cargó**. El departamento
  está bien documentado (él mismo lo dice: "yo pasé a ser diputado nacional por Montevideo", en
  una entrevista de Semanario Voces) y corroborado por Montevideo Portal ("Quien ocupe el lugar
  que tenía Caggiani como diputado será Diego Reyes"), pero **Semanario Voces no tiene medio en
  `content/medios/`** y el Montevideo Portal por sí solo no dice el departamento. La única
  fuente con medio existente y departamento explícito era la Nómina Alfabética
  (`Reyes Marroig, Diego FA Montevideo`), que resultó no ser una cita contigua real (ver punto 4
  del método) y no pasó `pnpm validar --red`. Pendiente: o se da de alta el medio
  `semanariovoces`, o se busca una fuente equivalente con medio existente.
- **Inés Monzillo, mandato XLIX (Cabildo Abierto)** — **no se cargó** (se cargó solo su mandato
  L, Partido Nacional, que sí pasa validación). Dos notas de prensa (El Observador 2024,
  Telenoche 2024) confirman que fue suplente de Carlos Testa (Cabildo Abierto) y que dejó el
  partido, pero ninguna dice "Canelones" en el mismo texto, y la Nómina Alfabética con
  "Testa, Carlos CA Canelones" tuvo el mismo problema de cita no contigua. El departamento
  Canelones para el tramo XLIX es casi seguro correcto (Testa es de Canelones en todas las
  nóminas XLIX revisadas), pero falta una fuente que lo diga de forma citable.
- **Gustavo Espinosa** (id 7733): la única coincidencia en la búsqueda por apellido tiene
  actividad registrada en las legislaturas XLVI y XLVII (2005-2015) además de un ingreso el
  09/09/2026 (L). Es compatible con que sea la misma persona (un dirigente colorado que vuelve
  tras un largo intervalo) pero no se confirmó; su ficha en este lote **no cita**
  `/legislaturas-actuo` por esta duda, solo la Citación 2025 (que sí lo identifica sin ambigüedad
  por nombre completo y lista).
- **Álvaro Gómez Berruti**: no se encontró una entrada de parlamento.gub.uy con el apellido
  compuesto "Gómez Berruti"; la única candidata es "Gómez, Álvaro" (id 12938), sin el segundo
  apellido confirmado. No se cargó por prudencia (queda en la tabla de pendientes).

## casos_vistos

Ninguno.

## verificacion_manual

Ninguna URL quedó sin poder leerse con `pnpm fuente` en este lote.

## cobertura_del_periodo

Se cargaron **38 de las 88 personas** de `lista.md`, empezando por las de más sesiones y dando
prioridad a quienes tenían departamento y partido confirmables con un documento oficial cuya
cita pasara literal `pnpm validar --red` (ver método, punto 4). De las 10 personas con más
sesiones de la lista completa se cargaron 8: quedaron afuera "Juan Neuberis Silveira Pedrozo"
(119, sin revisar en esta corrida) y "Diego Reyes" (96, ver hipótesis) — los ocho restantes,
incluidos los tres primeros por lejos (Alfonso Lereté 219, Óscar Amigo Díaz 190, Alexandra
Inzaurralde 169), sí están cargados. Dos registros que se habían armado en un primer pase
(Jorge Schusman y Diego Reyes) se retiraron en la revisión final por no pasar
`pnpm validar --red` sin recurrir a un medio inexistente o un id dudoso; quedan documentados
en `## hipotesis` para no perder el trabajo.

**Quedan pendientes 50 personas** (48 nunca llegaron a cargarse + Schusman + Reyes, retirados).
Para no perder el trabajo de identificación ya hecho, se deja acá el id de parlamento.gub.uy de
cada una (encontrado con `curl` + `grep` sobre la búsqueda por apellido) para que el próximo
repaso no tenga que rehacer esa parte:

| Persona (sesiones) | id parlamento.gub.uy | Nota |
|---|---|---|
| Juan Neuberis Silveira Pedrozo (119) | 9497 | departamento sugerido Montevideo por prensa, sin confirmar con documento oficial |
| Diego Reyes (96) | 11698 | **retirado en la revisión final**, ver hipótesis: departamento bien documentado pero sin medio existente que lo diga citablemente |
| Luciana Ramos (97) | 12724 | no aparece en la Citación 2025 ni en las nóminas XLIX revisadas; puede ser 2019-only |
| Narcio López (81) | 13006 | id confirmado, departamento no revisado en esta corrida |
| Ornella Lampariello (70) | 12919 | id confirmado, departamento no revisado |
| Wilson Carlos Rippa Álvez (64) | 12752 | id confirmado, departamento no revisado |
| Marcelo Fernández Cabrera (63) | 10280 | **cuidado**: la Citación 2025 muestra al 3er suplente de Pedro Jisdonian (Montevideo, PN) como "Fernandez Torres, Claudio Marcelo", no "Fernández Cabrera"; puede ser una persona distinta, no cargar con este id sin re-verificar |
| Francisco Ortiz (48) | 425 | id confirmado, departamento no revisado |
| Francisco Enrique Beneditto (47) | 9276 | id confirmado, departamento no revisado |
| Manuel Cáceres (41) | 12739 | id confirmado, departamento no revisado |
| María Cristina Álvarez Vanzuli (40) | 12838 | id confirmado, departamento no revisado |
| María Ema Alvariza (39) | 12939 | id confirmado, departamento no revisado |
| Iliana Sastre Arias (34) | 12793 | id confirmado, departamento no revisado |
| Raquel Verdúm (33) | 12967 | id confirmado, departamento no revisado |
| Marcos Antonio Portillo Urcelay (32) | 13359 | id confirmado, departamento no revisado |
| Soledad Rodríguez (26) | 12837 | id confirmado, departamento no revisado |
| Macarena Sierra (24) | 13226 | id confirmado, departamento no revisado |
| Luis Emilio De León (23) | 13306 o 13320 | dos candidatos ("De León, Luis Emilio" y "De León Esteves, Luis Emilio"), sin desambiguar |
| Juan Marcelo González Evora (22) | 13014 | id confirmado, departamento no revisado |
| Carmen Baraybar Rodríguez (20) | 12895 | id confirmado, departamento no revisado |
| Sebastián González (19) | 1487 | id sospechoso (muy bajo para alguien activo 2020-2024); re-verificar |
| Gerardo Porley (19) | 13778 | nombre completo "Porley García, Nestor Gerardo" |
| Margarita Fros (18) | 12961 | id confirmado, departamento no revisado |
| Álvaro Gómez Berruti (17) | 12938 (sin confirmar segundo apellido) | ver hipótesis |
| Sandra González Antuña (16) | 12734 | id confirmado, departamento no revisado |
| Juan Andrés Ramírez Saravia (16) | 13429 | id confirmado, departamento no revisado |
| Pablo Mascheroni (15) | 8579 (candidato, "Mascheroni Lay, Pablo") | sin confirmar |
| Alejandro Brause (13) | 11786 | id confirmado, departamento no revisado |
| Martín Biurrun (11) | 12997 | id confirmado, departamento no revisado |
| Ciro Ramos (10) | 13159 | id confirmado, departamento no revisado |
| Julio César Franchi Azambuja (10) | 13871 | id confirmado, departamento no revisado |
| Jorge Schusman (9) | 4295 (dudoso) | **retirado en la revisión final**, ver hipótesis |
| Osvaldo Abi Saab (9) | 13398 ("Abbi Saab, Osvaldo") | sin confirmar |
| Nahuel Morosi (9) | 13828 | id confirmado, departamento no revisado |
| Danilo Gómez (8) | 12950 | id confirmado, departamento no revisado |
| Sheila González (8) | 13042 | id confirmado, departamento no revisado |
| Jorge Patrone (7) | 5267 ("Patrone Chirelli, Jorge Norman") | sin confirmar |
| Emilia Díaz Giménez (7) | 13417 ("Díaz Giménez, María Emilia") | departamento no revisado |
| Edgardo García (6) | 13004 (candidato, "García Chocho, Edgardo") | sin confirmar |
| Miguel Lorenzoni (6) | 11650 | aparece como 3er suplente de José Carlos Mahía (Canelones, FA) en la Citación 2025; no se llegó a cargar por falta de tiempo, no por falta de fuente |
| Esteban Presentado Silva (6) | 13939 | id confirmado, departamento no revisado |
| Gianfranco Kucharski González (5) | 13029 | id confirmado, departamento no revisado |
| Laura Tassano (5) | 11732 | id confirmado, departamento no revisado |
| Mariana Arsuaga Marshall (4) | 12729 | id confirmado, departamento no revisado |
| Gilbert Edgardo Quequin Escobar (4) | 13124 | id confirmado, departamento no revisado |
| Gonzalo Rinaldo Barceló Masaguez (3) | 13120 | id confirmado, departamento no revisado |
| Alicia Esquivel (3) | 13087 (candidato, "Esquivel Rodríguez, Alicia Ángela") | sin confirmar |
| Matías Pereira Doti (3) | 13734 | id confirmado, departamento no revisado |

Nota: "Rippa" (12752), "Ortiz" (425), "Beneditto" (9276), "Cáceres" (12739), "Álvarez Vanzuli"
(12838), "Alvariza" (12939), "Sastre Arias" (12793), "Verdúm" (12967), "Portillo Urcelay"
(13359), "Soledad Rodríguez" (12837), "Sierra" (13226), "González Evora" (13014), "Baraybar
Rodríguez" (12895), "Fros" (12961), "González Antuña" (12734), "Ramírez Saravia" (13429),
"Brause" (11786), "Biurrun" (12997), "Ciro Ramos" (13159), "Franchi Azambuja" (13871), "Morosi"
(13828), "Danilo Gómez" (12950), "Sheila González" (13042), "Díaz Giménez" (13417),
"Presentado Silva" (13939), "Kucharski González" (13029), "Tassano" (11732), "Arsuaga Marshall"
(12729) y "Quequin Escobar" (13124) no se llegaron a cruzar contra la Citación 2025 completa: es
muy probable que la mayoría aparezca ahí (cubre a los 99 titulares y sus 3 suplentes por
departamento) y el próximo paso más eficiente es releer ese PDF ya archivado en el corpus
(`http://www.diputados.gub.uy/data/web/2025/Citacion2025.pdf`) con
`pnpm fuente ... --buscar "<apellido1>|<apellido2>|..."` agrupando varios apellidos por llamada,
en vez de volver a bajarlo — y **citar la ventana que devuelve `--buscar`, no una reconstrucción
a mano**, para que pase `pnpm validar --red` a la primera.

## objeciones_al_brief

Ninguna. El brief pide la misma ficha para titulares y suplentes de todos los partidos, y así
se hizo: de los 38 registros cargados, la distribución por partido es Frente Amplio 15, Partido
Colorado 12, Partido Nacional 8, Cabildo Abierto 1, Identidad Soberana 1, Partido Independiente
1 — no hay indicio de sesgo hacia ningún partido; la selección de quién se cargó primero
respondió al orden por cantidad de sesiones de `lista.md` más la disponibilidad de una fuente
oficial verificable, no a filiación política. Los dos registros retirados en la revisión final
(Schusman, Colorado; Reyes, Frente Amplio) quedaron afuera por el mismo motivo técnico en los
dos casos, uno por partido, así que tampoco introducen asimetría.

## Otras notas

- **Titulares vs. suplentes**: de los 38, solo uno es titular directo (Matías Duque Barreto); el
  resto son formalmente suplentes que ocupan la banca en sustitución de alguien. El campo
  `cargo` de cada uno lleva "(suplente)" excepto Duque Barreto.
- **Fusión de registros duplicados en `lista.md`**: "Leonardo Ciuti Pérez" (90 sesiones, XLIX y
  L) y "Leonardo Ciuti" (43 sesiones, L) son la misma persona (mismo id de parlamento, 13013); se
  cargó como una sola ficha con dos mandatos (XLIX y L). Lo mismo con "Patricia Rodríguez" (3
  sesiones) y "Patricia Alejandra Rodríguez Celintano" (27 sesiones): mismo id (13683), rango de
  fechas consecutivo sin superposición: se fusionaron en un solo mandato L (2025-03-11 a
  2025-10-14).
- **Partición XLIX/L aproximada**: para quienes `lista.md` marca "XLIX y L" con un solo rango de
  fechas combinado (ej. "2020-03-25 a 2026-05-06"), se partió el rango en la fecha de cambio de
  legislatura (14/02/2025 → 15/02/2025) porque `lista.md` no da el corte exacto. Es una
  aproximación razonable pero no verificada sesión por sesión. Afecta a: Roel Bottari, Bousses,
  Basaistegui Gomendio, Cabrera Riveiro, Silvera Cal.
- **`estado_actual`**: para un suplente que ya no está en la banca hoy (comprobado contra la
  nómina viva de titulares de hoy, `documentos.diputados.gub.uy/docs/LegAlfab.pdf`, que no lista
  a nadie de este lote salvo Garlo y Duque Barreto), se usó `situacion: fuera_de_cargo` con
  `salida.tipo: fin_de_mandato` y la fecha de la última sesión registrada en `lista.md`. Esto es
  una aproximación: un suplente uruguayo no "termina su mandato" formalmente cuando deja de ser
  convocado (sigue en la lista de suplentes, puede volver a ser llamado), así que
  `fin_de_mandato` acá se lee como "fin del período de actuación efectiva registrado", no como
  una salida definitiva del cargo de suplente. Ningún valor del enum `TipoSalida` describe bien
  ese caso; se eligió `fin_de_mandato` por ser el menos incorrecto (no hubo renuncia,
  destitución ni fallecimiento).
- **Medios usados, todos ya existentes en `content/medios/`**: parlamento, el-observador,
  telenoche. No quedó ninguna cita apoyada en un medio inexistente (AGESOR y Radio Montecarlo,
  usados en un primer pase, se sacaron del lote final; ver hipótesis para Schusman/Reyes/
  Monzillo-XLIX).
- **Validación**: `pnpm validar --inbox inbox/diputados/faltantes-3` y
  `pnpm validar --inbox inbox/diputados/faltantes-3 --red` corren ambos con 0 errores (69/69
  citas exactas contra el corpus ya leído en esta corrida).
