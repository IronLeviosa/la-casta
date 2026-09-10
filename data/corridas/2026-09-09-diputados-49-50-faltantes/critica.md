# Crítica — corrida 2026-09-09-diputados-49-50 (lote `critica-faltantes`)

Modelo: Opus 5 (1M context), `claude-opus-5[1m]`. La tabla de «Modelos por rol» de `CLAUDE.md`
asigna Opus al crítico, así que acá no hay desvío del experimento que declarar.
Lote: `inbox/diputados/critica-faltantes/` (fusión de `faltantes-1..4`)
Registros revisados: 168 registros en `politicos.yaml`, que corresponden a **160 personas
distintas** (ver O1), con 200 mandatos y 529 fuentes.

Verificación mecánica corrida por mí antes de escribir esto:

- `pnpm validar --inbox inbox/diputados/critica-faltantes` → 0 errores, 22 avisos (ninguno del lote).
- `pnpm validar --inbox inbox/diputados/critica-faltantes --red` → 0 errores; 288 URL verificadas;
  **355 citas exactas, 0 aproximadas, 3 manuales (no verificadas)**.

Eso quiere decir que las citas de este lote *existen y son contiguas* en las páginas: la máquina hizo
su trabajo. Lo que sigue es lo que la máquina no puede ver, y es casi todo: **las citas existen pero
en su mayoría no dicen lo que el registro afirma**. Fuentes abiertas con `pnpm fuente` en esta
sesión para comprobarlo: `Citacion2025.pdf`, `legislaturas-actuo` de 11788 / 12677 / 6143 / 12716,
`actuacion-legislador` de 12749, los diarios de 2000-02-11 y 2025-12-02, y las tres notas de prensa
del lote.

---

## Objeciones por registro

Las fallas de este lote son de clase, no de caso: la misma decisión de método se repite en decenas de
fichas. Las agrupo por clase con la lista completa de registros afectados (que es lo que el editor
necesita para trabajar), y abro bloque propio para los casos que la tarea nombró y para los que no
entran en ninguna clase. Al final, `sin_objecion` condensado.

---

### O1 — `politicos.yaml` × 8 personas — duplicados: tres slugs repetidos y cinco personas con dos slugs

- severidad: **bloquea**
- tipo: presentacion (id) / contexto_omitido
- campo: `_slug`
- objecion: la tarea pedía verificar que `guastavino-aguiar-julio`, `perez-vergara-camila` y
  `sanguineti-sebastian` estuvieran una sola vez. **Están dos veces cada uno, dentro de este mismo
  archivo**: se quitaron de otro lote pero sobrevivieron en la fusión de `faltantes-2/3` con
  `faltantes-4`. Además hay **cinco personas más con dos fichas bajo dos slugs distintos**,
  detectadas por el id de legislador de parlamento.gub.uy, que es el mismo en las dos:

  | id parlamento | slugs | nombre |
  |---|---|---|
  | 11935 | `sander-raul` + `sander-machado-raul` | Raúl Sander Machado |
  | 12993 | `barboza-lucia` + `barboza-molina-lucia` | Lucía Eleonora Barboza Molina |
  | 13656 | `garlo-joaquin` + `garlo-alonsoperez-joaquin` | Joaquín Garlo Alonsopérez |
  | 5150 | `gallo-cantera-luis` + `gallo-luis-enrique` | Luis Enrique Gallo Cantera |
  | — | `da-silva-francisco` + `da-silva-barcelo-francisco` | Francisco Manuel Da Silva Barceló |

  No es un problema estético. Corrí el validador y **`promover` no las va a rechazar: las va a
  renombrar**. En la salida de `pnpm validar --inbox` ya aparecen `guastavino-aguiar-julio-2`,
  `perez-vergara-camila-2` y `sanguineti-sebastian-2` como políticos separados. El resultado sería
  dos páginas públicas de la misma persona con datos que se contradicen entre sí:
  `guastavino-aguiar-julio` dice que su mandato terminó el 12/10/2025 y `guastavino-aguiar-julio-2`
  dice 02/09/2026, las dos citando **la misma línea** de `legislaturas-actuo`.
- cita_de_contexto: `https://parlamento.gub.uy/camarasycomisiones/legisladores/13847/legislaturas-actuo`,
  citada por las dos fichas: «Legislatura L (2025-2030) / 02-09-2026 / 02-09-2026». La ficha que
  pone `hasta: 2025-10-12` cita un texto que dice 02-09-2026.
- accion_sugerida: fusionar cada par en una ficha con la unión de mandatos y el mejor par de fuentes
  de cada uno, y quedarse con la grafía de la fuente oficial (`sander-machado-raul`,
  `barboza-molina-lucia`, `garlo-alonsoperez-joaquin`, `gallo-cantera-luis`,
  `da-silva-barcelo-francisco`). Antes de promover cualquier lote de esta corrida, correr un chequeo
  de id de legislador repetido entre `critica-faltantes`, `todos`, `suplentes` y `content/politicos/`
  (ver O16 para los tres cruces que quedan con `suplentes`).

---

### O2 — `garcia-de-barros-lilian` — mandato L — la cita no existe en el documento que la acompaña

- severidad: **bloquea**
- tipo: cita_fuera_de_contexto (cita inexistente)
- campo: `mandatos[1].fuentes[0].cita`
- objecion: la cita es `García De Barros convocándose`. Abrí el PDF citado con
  `pnpm fuente ... --buscar "García De Barros convocándose"` y la respuesta es literal:
  **«[García De Barros convocándose] sin coincidencias en esta nota»** sobre 241.221 caracteres. No
  es una cita: es la consulta de búsqueda que el investigador escribió, pegada en el campo `cita`.
  `notas.md` lo admite («no llegué a abrir el pasaje exacto con `--buscar` antes de escribir el
  registro»). Pasó `pnpm validar --red` **porque lleva `verificacion: manual`**, que salta el cotejo.
  Eso es un agujero de proceso, no solo un error de esta ficha: `verificacion: manual` existe para
  fuentes que la máquina no puede leer (TV, X, paywall), no para fuentes que el agente no leyó, y
  además obliga a la firma del mantenedor por una razón falsa.
- cita_de_contexto: lo que el documento sí trae en ese pasaje son listas de votación
  («Monzillo, Inés / … / Sanguineti, Sebastián Francisco / Silva, Rubenson»),
  `https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2025-12-02%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0054).pdf`
- accion_sugerida: borrar la fuente y el mandato L de esa ficha hasta tener la ventana literal que
  devuelve `--buscar`. Y revisar las otras dos `verificacion: manual` del lote (`molinelli-ricardo`,
  `sanchez-alejandro`, ver O6 y O10): las tres se saltaron el cotejo y ninguna de las tres lo hizo
  por ser una fuente inaccesible.

---

### O3 — 74 mandatos de 62 fichas — el período del mandato no aparece en ninguna de sus fuentes

- severidad: **bloquea**
- tipo: contexto_omitido / cita_fuera_de_contexto
- campo: `mandatos[].desde` y `mandatos[].hasta`
- objecion: es la falla central del lote. Comparé cada `desde` y cada `hasta` contra el texto de
  todas las citas de su propio mandato, en los tres formatos que usan las fuentes
  (`DD-MM-AAAA`, `DD/MM/AAAA`, `AAAA-MM-DD`). Resultado sobre 200 mandatos:
  **90 `desde` y 79 `hasta` no figuran en ninguna cita del mandato; en 74 mandatos no figura
  ninguna de las dos.** Las fechas salen de `lista.md`, que es una compilación interna de la
  asistencia, y se les cuelga como fuente una página de Parlamento que dice otra cosa. `notas.md`
  de `faltantes-3` lo dice sin rodeos: «las fechas `desde`/`hasta` de cada mandato en este lote
  salen de `lista.md` …, no de `/legislaturas-actuo`; esa sub-página se cita igual, como
  confirmación de legislatura y lema, pero no como fuente literal de las fechas exactas».

  Eso es exactamente lo que la adenda del brief (punto 2) prohibió: «La plantilla
  `desde: 2020-02-15 / hasta: 2025-02-14` no se llena por defecto; **cada fecha sale de la fuente**».
  Y para el lector el efecto es peor que un dato faltante: hace clic en la fuente y ve otra fecha.
- cita_de_contexto: `lerete-alfonso` afirma `hasta: 2025-02-10`; abrí
  `https://parlamento.gub.uy/camarasycomisiones/legisladores/11788/legislaturas-actuo` y dice
  «Legislatura XLIX (2020-2025) / 03-03-2020 / **14-02-2025**».
  `sanguineti-sebastian` (segunda ficha) afirma `2025-05-28 → 2026-05-13` citando
  `https://parlamento.gub.uy/camarasycomisiones/legisladores/12723/legislaturas-actuo`, que dice
  «Legislatura L (2025-2030) / **21-08-2026** / **21-08-2026**».
- accion_sugerida: no promover ninguno de estos 74 mandatos hasta que la fecha salga de la fuente.
  El camino está probado dentro de este mismo lote y es barato: `faltantes-4` usó
  `/legisladores/<id>/actuacion-legislador?Fecha_desde=…&Fecha_hasta=…`, que imprime cada
  convocatoria con su fecha, su departamento y su titular, y llega a **94 % de `desde` documentados
  contra 5 % en `faltantes-3`**. Esa página existe para toda persona con id (solo 6 fichas del lote
  no tienen id: `gomez-berruti-alvaro`, `duque-barreto-matias`, `espinosa-gustavo`,
  `acosta-garaza-gloria`, `benitez-de-cuadro-maria-rosa`, `da-silva-barcelo-francisco`).
- registros: `sanchez-alejandro#0`, `tort-carmen#0`, `reutor-carlos#1`, `elinger-eduardo#0`,
  `caceres-fernando#0`, `fumero-alberto#0`, `sanguineti-sebastian#0` (×2 fichas),
  `sanguineti-sebastian#1`, `porrini-alicia#0`, `porrini-alicia#1`, `melazzi-maria-rosa#0`,
  `charbonnier-aldo#0`, `molinelli-ricardo#0`, `michel-murad-jamil#0`, `chevalier-liliana#0`,
  `beck-paulo#0`, `beck-paulo#1`, `noguez-wilma#0`, `abt-andres#0`, `irigoyen-natalie#0`,
  `irigoyen-natalie#1`, `lamorte-aldo#0`, `barboza-lucia#0`, `stagi-franco#0`,
  `garcia-de-barros-lilian#0`, `garcia-de-barros-lilian#1`, `ortiz-garcia-sebastian#0`,
  `sander-raul#0`, `sander-raul#1`, `perez-amarelle-consuelo#0`, `perez-fornelli-dayana#0`,
  `perez-fornelli-dayana#1`, `solana-gonzalez-esther#0`, `casas-pino-martina#0`,
  `gonzalez-albano-omar#0`, `gonzalez-berro-dolores#0`, `garlo-alonsoperez-joaquin#0`,
  `gomez-berruti-alvaro#0`, `mirza-perpignani-adel#0`, `amigo-diaz-oscar#0`,
  `inzaurralde-alexandra#0`, `monzillo-ines#0`, `ciuti-perez-leonardo#0`, `ciuti-perez-leonardo#1`,
  `franco-tuchman-rodney#0`, `roel-bottari-gaston#0`, `roel-bottari-gaston#1`, `bousses-heber#0`,
  `guarinoni-mauricio#0`, `olmedo-calistro-stephanie#0`, `basaistegui-gomendio-analia#0`,
  `basaistegui-gomendio-analia#1`, `cabrera-riveiro-catherine#0`, `cabrera-riveiro-catherine#1`,
  `peres-pimentel-giovani#0`, `rodriguez-celintano-patricia#0`, `bravetti-castello-fabian#0`,
  `jaimes-cedres-rossana#0`, `quintana-punales-agustin#0`, `costa-pizzatti-graciela#0`,
  `espinosa-gustavo#0`, `silvera-cal-yoanna#0`, `silvera-cal-yoanna#1`,
  `benech-rodriguez-carolina#0`, `acosta-garaza-gloria#0`, `zaparrart-tello-maika#0`,
  `ardanche-figueredo-melissa#0`, `guastavino-aguiar-julio#0`, `helguera-david#0`,
  `chiesa-bruno-antonio#0`, `benitez-de-cuadro-maria-rosa#0`, `da-silva-barcelo-francisco#0`,
  `perez-alvarez-luis-marcelo#0`.

---

### O4 — 190 mandatos `(suplente)` — una suplencia de días se publica como un mandato continuo de años

- severidad: **bloquea** (y es la objeción que más daño hace al uso que el brief le quiere dar)
- tipo: contexto_omitido / presentacion
- campo: `mandatos[].desde`/`hasta` y la banda de mandatos de la ficha
- objecion: el lote convierte todas las convocatorias de un suplente en **un solo mandato** que va de
  la primera a la última. La fuente dice lo contrario. Abrí
  `https://parlamento.gub.uy/camarasycomisiones/legisladores/12749/actuacion-legislador?Fecha_desde=2020-02-15&Fecha_hasta=2025-02-14`
  y lo que hay es una lista de convocatorias de un día: «11-03-2020 Convocada … **hasta el
  11/03/2020 23:59** Titular: Amigo Díaz, Oscar», «19-12-2020 … hasta el 19/12/2020 23:59 Titular:
  Irigoin, Pedro», «16-03-2021 …». La ficha las funde en `2020-03-11 → 2023-06-23`.

  El orden de magnitud del problema se ve cruzando los días declarados contra las sesiones que la
  propia `lista.md` le cuenta a cada persona. La razón días/sesiones de un titular real
  (`tinaglini-gabriel`, 302 sesiones) es 7,9. En el lote hay:
  `basaistegui-gomendio-analia` 1.800 días declarados / 9 sesiones (200),
  `kronberg-julio` 1.986 / 12 (166), `silvera-cal-yoanna` 1.786 / 12 (149),
  `berriel-sonia` 1.647 / 17 (97), `garcia-de-barros-lilian` 2.012 / 30 (67),
  `sander-machado-raul` 1.720 / 26 (66), `cabrera-riveiro-catherine` 1.969 / 30 (66).
  La razón global del lote es 19,4. **Ninguna de esas personas estuvo cinco años en la banca.**

  Esto contradice la adenda del brief punto 4 palabra por palabra («Una suplencia de uno o pocos días
  es un mandato … con sus fechas exactas … si son más de doce períodos, los doce más largos y el
  resto condensado en `notas.md`») y el punto 14 de la lista de presentación, que ya había resuelto
  cómo se muestra («veintiocho suplencias de un día … son una oración: “suplente en 28 períodos entre
  2000 y 2004, 81 días”, con una banda a escala y la lista plegada»).

  La consecuencia práctica es la que le importa al mantenedor: el brief existe para linkear personas
  a votaciones. Una ficha que dice «Representante por Canelones (suplente), 2020-2023» pone a esa
  persona en la sala de todas las votaciones de tres años. Es el error que más caro sale en
  `content/votaciones/`, y sale igual para todos los partidos.
- accion_sugerida: para cada suplente, cargar los períodos reales desde `actuacion-legislador`
  (hasta doce, los más largos) y poner en `notas.md` el resto con el conteo total, que es lo que la
  adenda pide. La objeción es de clase: alcanza a los 190 mandatos `(suplente)`, incluidos los 68 que
  pasan todos mis chequeos mecánicos, porque en esos las dos puntas están documentadas pero la
  continuidad entre ellas no.

---

### O5 — `melazzi-maria-rosa`, `charbonnier-aldo` — la única cita del mandato dice que **no** asumieron

- severidad: **bloquea**
- tipo: cita_fuera_de_contexto
- campo: `mandatos[0].fuentes`, `estado_actual.salida.fuentes`
- objecion: las dos fichas afirman un mandato de más de cuatro años (`2020-03-10 → 2024-09-11` y
  `2020-09-15 → 2024-09-03`) y una salida por `fin_de_mandato`. La única fuente con contenido es un
  diario que documenta lo contrario: que ese día declinaron la convocatoria. La otra fuente de
  Melazzi es su nombre en el buscador («Melazzi Cámera , María Rosa») y la de Charbonnier es el
  rótulo del desplegable («La legislatura seleccionada es: Legislatura XLIX (2020-2025)»).
- cita_de_contexto: «2) Acéptanse las **denegatorias** presentadas, por esta única vez, por los
  suplentes siguientes Aldo Charbonnier, María Rosa Melazzi y Carlos Dante Perdomo Anania»,
  `https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2024-04-17%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0012).pdf`
- accion_sugerida: sacar las dos fichas del lote hasta tener una convocatoria aceptada. El documento
  citado sirve para otra cosa que sí es cierta y no está en el registro: que las dos integran la
  lista de suplentes de Martín Melazzi (Soriano, Partido Colorado, hoja 600).

---

### O6 — `molinelli-ricardo` — un mandato de 2020-2023 documentado con un diario del año 2000

- severidad: **bloquea**
- tipo: riesgo_legal / cita_fuera_de_contexto
- campo: `mandatos[0]`, `estado_actual.salida`
- objecion: la ficha afirma «Representante Nacional por Paysandú (suplente), 2020-05-12 → 2023-08-17»
  con dos fuentes: el rótulo del desplegable de su página y **el diario del 11 de febrero de 2000**,
  que proclama suplentes de la XLV Legislatura. Ninguna de las dos habla del período que la ficha
  afirma. Encima `notas.md` deja abierta la identidad: el id 593 agrupa actuaciones de 1990, 1995,
  2000 y 2020, y el investigador dice que «no crucé documentalmente que el Ricardo Molinelli de
  1990-2005 y el de 2020-2023 sean la misma persona». Publicar un cargo de cinco años atribuido a una
  persona nombrada, sin fuente del período y con la identidad sin cerrar, es el terreno del art. 336
  y no hay ninguna urgencia que lo justifique.
- cita_de_contexto: abrí el diario con `--buscar "Ricardo Molinelli"` y el pasaje es
  «-departamento de Paysandú: - Partido Colorado: - hoja de votación Nº 2000, señor Ricardo
  Molinelli. C/1/2000», con tabulaciones y cortes de renglón que la `cita` del registro normalizó a
  mano (por eso lleva `verificacion: manual`),
  `https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2000-02-11%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0001).pdf`
- accion_sugerida: a `notas.md` hasta resolver la identidad con `actuacion-legislador` del id 593
  acotado a 2020-2025. Si es la misma persona, la ficha gana un dato bueno (suplente desde 2000); si
  no, se evitó atribuirle a alguien un cargo ajeno.

---

### O7 — 87 mandatos — el departamento del `cargo` no aparece en ninguna cita del mandato

- severidad: **bloquea** en los 6 que `notas.md` declara sacados de WebSearch; **corregir** en el resto
- tipo: contexto_omitido
- campo: `mandatos[].cargo`
- objecion: `cargo` afirma tres cosas a la vez (que fue representante, por qué departamento y si fue
  suplente) y en 87 de 200 mandatos el departamento no está en ninguna cita. En seis fichas
  `notas.md` reconoce que el departamento y/o el partido **salen de la síntesis de WebSearch y no de
  una página leída**: `corbo-milton`, `guerrero-gustavo` (departamento), `guadalupe-eduardo`,
  `burgoa-laura`, `dalmao-daniel` (departamento), `fuentes-pablo`. Eso no es una fuente débil, es
  ninguna fuente: la regla 5 dice que no se cita una URL que no se abrió, y acá ni siquiera hay URL.
- cita_de_contexto: la ficha de `corbo-milton` dice «Representante Nacional por Rocha (suplente)» y
  «Partido Nacional». Abrí su única fuente,
  `https://parlamento.gub.uy/camarasycomisiones/legisladores/12716/legislaturas-actuo`, y el texto
  completo de la página son 108 caracteres: «Legislaturas / Desde / Hasta / Legislatura XLIX
  (2020-2025) / 26-11-2020 / 14-02-2025». Ni Rocha, ni Partido Nacional, ni «suplente».
- accion_sugerida: los seis, fuera del lote hasta tener el dato con fuente. Para los otros 81, el
  mismo remedio de O3: `actuacion-legislador` imprime «por el departamento de CANELONES … Titular:
  Amigo Díaz, Oscar» en la misma línea.

---

### O8 — 122 fichas — el partido no aparece en ninguna cita

- severidad: **bloquea** (es el campo con el que el sitio agrupa a la gente)
- tipo: contexto_omitido
- campo: `partido`
- objecion: de las 168 fichas, **135 no traen el nombre canónico del partido en ninguna cita** y en
  122 tampoco aparece la sigla (FA/PN/PC/CA). El esquema no exige fuente para `partido` —lo pide como
  string— así que el validador no lo ve, pero `partido` es lo que alimenta la tabla «Por partido» de
  `pnpm validar`, el aviso de simetría y, en cuanto haya votaciones, `bancadas[]`. Atribuirle a 122
  personas nombradas una filiación partidaria sin una línea que la diga es el error con peor relación
  daño/esfuerzo del lote, y es simétricamente malo para los cuatro partidos.

  Hay un agravante de método: la página `actuacion-legislador` imprime **«por el lema , sublema 609»**
  con el lema vacío, así que quien la usó dedujo el partido del número de sublema o del titular
  sustituido. Es una inferencia razonable y trazable, pero el esquema de `politicos` no tiene
  `cadena`, así que la inferencia queda invisible y se lee como dato.
- cita_de_contexto: «11-03-2020 Convocada a la Cámara de Representantes por el departamento de
  CANELONES **por el lema , sublema 609** hasta el 11/03/2020 23:59 Titular: Amigo Díaz, Oscar»,
  `https://parlamento.gub.uy/camarasycomisiones/legisladores/12749/actuacion-legislador?Fecha_desde=2020-02-15&Fecha_hasta=2025-02-14`
- accion_sugerida: la Citación 2025 sí trae el partido, como encabezado de cada bloque
  («Partido Frente Amplio / Cantidad de bancas: … / HOJA DE VOTACIÓN Nº 1»), pero **ese encabezado
  quedó fuera de las 43 citas del lote**, que empiezan en la línea de nombres. Basta con extender la
  ventana de `--buscar` hacia arriba hasta incluir la línea del partido y el nombre del departamento.
  Es un cambio de una línea por cita y resuelve O7 y O8 a la vez para 37 fichas.

---

### O9 — 64 fichas — `salida.fecha` no está en la cita que la acompaña; 4 la fechan con un documento anterior

- severidad: **bloquea**
- tipo: cita_fuera_de_contexto
- campo: `estado_actual.salida`
- objecion: 64 de 156 salidas tienen una fecha que no figura en ninguna de sus propias citas. Cuatro
  son imposibles por construcción: fechan una salida de 2026 con la Citación del **13/02/2025**
  (`espinosa-gustavo` 2026-03-11, `acosta-garaza-gloria` 2026-03-11,
  `benitez-de-cuadro-maria-rosa` 2026-03-11, `da-silva-barcelo-francisco` 2026-05-12). Un documento
  no puede documentar algo que todavía no pasó.

  Hay además un problema de fondo que el editor tiene que decidir y que no es culpa del investigador:
  **143 de 152 `fin_de_mandato` llevan una fecha que no es el fin de ningún período**, contra la
  adenda punto 5 («`fin_de_mandato` solo en la fecha de fin del período»). `notas.md` de
  `faltantes-3` lo explica bien: «un suplente uruguayo no “termina su mandato” formalmente cuando
  deja de ser convocado (sigue en la lista de suplentes, puede volver a ser llamado)… Ningún valor
  del enum `TipoSalida` describe bien ese caso; se eligió `fin_de_mandato` por ser el menos
  incorrecto». Coincido con el diagnóstico y no con la salida: «el menos incorrecto» sigue siendo
  incorrecto, y la página va a imprimirle a 143 personas una fecha de fin de mandato que no existió.
- cita_de_contexto: `monzillo-ines` declara `situacion: fuera_de_cargo` y
  `salida: {tipo: fin_de_mandato, fecha: 2026-05-12}`, citando
  `https://parlamento.gub.uy/camarasycomisiones/legisladores/12730/legislaturas-actuo`: «Legislatura
  L (2025-2030) / **08-09-2026** / **08-09-2026**». La fuente dice que estuvo en la banca anteayer.
- accion_sugerida: dos decisiones para el editor, no para el investigador. (a) Para la XLIX,
  `salida.fecha: 2025-02-14` con la cita del cierre de legislatura, y el último período real en
  `mandatos[].hasta`. (b) Para la L, en curso, un suplente que dejó de ser convocado no está «fuera
  de cargo»: si el esquema no tiene cómo decirlo, va a `notas.md` con el hueco declarado, no se
  inventa un valor. Escribir el pedido de campo nuevo en `TipoSalida` (o de un `situacion:
  suplente_no_convocado`) es más honesto que 143 fechas falsas.

---

### O10 — `sanchez-alejandro` — la renuncia a la banca se fecha con Wikipedia y el documento existe

- severidad: **bloquea**
- tipo: documento_previsible / riesgo_legal
- campo: `estado_actual.salida`, `mandatos[0]`
- objecion: la ficha afirma `salida: {tipo: renuncia, fecha: 2020-10-15}` con **una sola fuente,
  Wikipedia**, `tipo: nota`, `verificacion: manual`, y cuya cita no trae ninguna fecha: «En 2020 fue
  designado Senador de la República, asumiendo la banca dejada por el renunciante José Mujica». La
  fecha 2020-10-15 sale de `lista.md`. `content/medios/wikipedia.yaml` dice de sí mismo que es «una
  obra de referencia colaborativa, **no un medio periodístico**». Además el mandato de diputado
  (2020-02-15 → 2020-10-15, sin «(suplente)») se apoya en el rótulo del desplegable de su página, en
  una biografía que habla de **2010-2015**, y en la lista de asistentes de la sesión constitutiva.
- documento previsible, con organismo y ruta: el Diario de Sesiones de la Cámara de Representantes
  donde se lee su renuncia y se convoca al suplente, y el del Senado donde asume la banca de Mujica,
  los dos en la Hemeroteca (`biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/` y la serie de
  Senadores), más la proclamación de la Corte Electoral. Con la fecha de `lista.md` como punto de
  partida, es una sola llamada a `pnpm fuente`.
- accion_sugerida: buscar el diario antes de promover; mientras tanto, el mandato sin `hasta` y sin
  `salida`, o la ficha a `notas.md`. Y lo mismo, con el mismo umbral, para `abt-andres`, cuya
  renuncia a la banca (2020-11-18) tampoco tiene documento: la nota de Montevideo Portal que el lote
  cita dice «había renunciado a la banca tras ser reelecto alcalde municipal», **sin fecha**.

---

### O11 — `solana-gonzalez-esther`, `mirza-perpignani-adel` — `partido: sin_confirmar` entra como si fuera un partido

- severidad: **corregir**
- tipo: presentacion
- campo: `partido`
- objecion: el esquema acepta cualquier string, así que `sin_confirmar` pasa; pero ya aparece como
  una fila más en la tabla «Por partido» de `pnpm validar` («sin_confirmar 2 personas, 8.7 años»),
  junto al Frente Amplio y al Partido Nacional, y va a aparecer igual en la página de partidos y en
  `data/simetria.json`. Un partido inventado en las estadísticas del sitio es peor que una ficha
  menos.
- accion_sugerida: las dos a `notas.md` hasta tener el partido, o `cobertura.texto` diciendo
  explícitamente que el partido no se pudo documentar. No dejar el valor en el campo.

---

### O12 — `lerete-alfonso`, `inzaurralde-alexandra`, `tinaglini-gabriel#1`, `casaretto-federico#1` — el mismo renglón se lee «titular» en un lote y «suplente» en otro

- severidad: **corregir**
- tipo: explicacion_alternativa
- campo: `mandatos[].cargo`
- objecion: la adenda punto 2 dice que una fila sin la línea «Representante Nacional por el Lema …»
  no prueba un cargo de titular. Este lote sacó la conclusión contraria y la aplicó como regla:
  `notas.md` de `faltantes-3` dice «de los 38, solo uno es titular directo (Matías Duque Barreto); el
  resto son formalmente suplentes». Pero «no consta que sea titular» no es «consta que es suplente»,
  y en cuatro casos la etiqueta `(suplente)` choca con la propia cita:
  - `lerete-alfonso`: su `legislaturas-actuo` (lo abrí) muestra la XLIX entera, 03-03-2020 a
    14-02-2025, y la ficha lo llama suplente por la Citación **2025**, que es de la legislatura
    siguiente. Que en la L sea primer suplente de Juan Pablo Delgado no dice nada de la XLIX.
  - `inzaurralde-alexandra`: la cita es «Representante Nacional por el Lema PARTIDO NACIONAL,
    departamento de LAVALLEJA» (snapshot de Wayback de 2023) —la línea que en `inbox/diputados/todos`
    se usa para afirmar titular— y acá el cargo dice «(suplente)».
  - `tinaglini-gabriel#1` y `casaretto-federico#1`: la cita es «Representante Nacional por el Lema
    PARTIDO FRENTE AMPLIO **desde el 05/03/2025**- Legislatura L» y su equivalente para Casaretto;
    la etiqueta «(suplente)» sale de una nota al pie de la nómina que no está citada.
- cita_de_contexto: `https://parlamento.gub.uy/camarasycomisiones/legisladores/11788/legislaturas-actuo`
  y `https://parlamento.gub.uy/camarasycomisiones/legisladores/12677/legislaturas-actuo`.
- accion_sugerida: la condición de titular o suplente sale de `actuacion-legislador` («Titular:
  Apellido, Nombre» en la convocatoria) o de la nota al pie de sustitución de `LegxPartido.pdf`,
  citada. Donde no conste, `cargo` sin «(suplente)» y sin afirmar titularidad, y el hueco dicho en
  `cobertura`. Que el criterio sea el mismo en los cuatro lotes de la corrida es lo que importa:
  hoy la misma evidencia produce «titular» en `todos` y «suplente» acá.

---

### O13 — 43 mandatos con la Citación 2025 — una proclamación de suplentes no prueba haber ocupado la banca

- severidad: **corregir** (**bloquea** en los 10 mandatos cuya única fuente es ese PDF)
- tipo: cita_fuera_de_contexto
- campo: `mandatos[].fuentes`
- objecion: `http://www.diputados.gub.uy/data/web/2025/Citacion2025.pdf` es la citación a la sesión
  preparatoria del 13/02/2025 con la proclamación de la Corte Electoral. Prueba quién quedó
  proclamado titular y quiénes son sus tres suplentes. **No prueba que un suplente haya sido
  convocado nunca**, y menos en la legislatura anterior. Diez mandatos no tienen otra fuente:
  `ciuti-perez-leonardo#0`, `roel-bottari-gaston#0`, `bousses-heber#0`,
  `basaistegui-gomendio-analia#0`, `cabrera-riveiro-catherine#0`, `espinosa-gustavo#0`,
  `silvera-cal-yoanna#0`, `acosta-garaza-gloria#0`, `benitez-de-cuadro-maria-rosa#0`,
  `da-silva-barcelo-francisco#0`; seis de ellos son mandatos de la **XLIX** apoyados en un documento
  de 2025.
- explicación alternativa que le concedo al investigador: para el **departamento** la extrapolación es
  razonable (una hoja de votación no cambia de departamento entre elecciones) y `notas.md` la declara.
  Para el período y para la condición de suplente convocado, no.
- accion_sugerida: la Citación queda como fuente del departamento y del partido (extendiendo la cita
  hasta el encabezado, ver O8), y cada mandato necesita además su convocatoria.
- aviso de método, para que no se dé vuelta el lote entero: en el texto extraído del PDF el
  encabezado sale como «Suplentes⇥Titulares» pero **el primer nombre de cada renglón es el titular**.
  Lo verifiqué contra casos que no admiten duda: «Fratti, Alfredo | Araújo Rodríguez, Yisela Daiana»,
  «Mahía, José Carlos | Gallo Cantera, Luis Enrique», «Andújar, Sebastián | Lancaster, Elena»,
  «Salle Lorier, Gustavo Alberto | Salle Pereira, Nicolle», «Niffouri, Amin | Perdomo Calcagno,
  Fernando». El lote lo leyó bien; conviene que quede escrito, porque leer el encabezado al pie de la
  letra invierte titular y suplente en 43 fichas de todos los partidos.

---

### O14 — 33 fichas — la fuente es el rótulo de un desplegable o el nombre en el buscador

- severidad: **corregir**
- tipo: contexto_omitido
- campo: `mandatos[].fuentes[].cita`
- objecion: nueve fichas usan como cita el rótulo de la interfaz «La legislatura seleccionada es:
  Legislatura XLIX (2020-2025)» (`abt-andres`, `charbonnier-aldo`, `fumero-alberto`,
  `molinelli-ricardo`, `noguez-wilma`, `porrini-alicia`, `sanchez-alejandro`, `sander-raul`), que no
  nombra a nadie; y unas veinticuatro usan como cita el nombre tal como sale de la tabla del
  buscador («Melazzi Cámera , María Rosa», «Beck Goncálves , Paulo César», «Irigoyen Pérez , Natalie
  Gabriela»…), que prueba que la persona existe en el directorio del Parlamento y nada más. Pasan
  `--red` porque son literales; no sostienen ningún campo del registro.
  Dos casos aparte: `inzaurralde-alexandra` cita una tabla de asistencia («Cámara de Representantes /
  172 / 161 / 94 %») como fuente de un mandato —es un dato bueno, mal usado: prueba 161 de 172
  sesiones, que es justo lo que O4 pide y la ficha no dice— y `fros-alvarez-virginia` sostiene un
  `salida.tipo: fallecimiento` con una cita de la diaria de 32 caracteres, «La diputada del Partido
  Nacional», que no menciona la muerte.
- accion_sugerida: reemplazar cada una por la línea que dice el hecho. Para Fros la tengo abierta y
  además resuelve el titular que falta: «La diputada del Partido Nacional por el departamento de
  Rivera, Virginia Fros, falleció este domingo a causa de un cáncer. … Fros ocupaba la banca de
  Gerardo Amarilla, quien a mediados de 2020 dejó el Parlamento para asumir la subsecretaría del
  Ministerio de Ambiente»
  (`https://ladiaria.com.uy/politica/articulo/2023/2/fallecio-virginia-fros-legisladora-del-partido-nacional/`).
  Ojo también con la `fecha` de esa fuente: el registro pone 2023-02-19 y la nota está fechada el
  20 de febrero de 2023.

---

### O15 — 92 mandatos `(suplente)` sin el titular identificado

- severidad: **corregir**
- tipo: contexto_omitido
- campo: `mandatos[].cargo` / `fuentes[].cita`
- objecion: la tarea pedía que cada suplencia identificara al titular al que sustituye, y en 92 de
  190 mandatos ninguna cita nombra a nadie (ni «Titular:», ni «convocándose al suplente siguiente»,
  ni «suplente»). Sin el titular, el departamento y el partido de la ficha no tienen de dónde
  heredarse y el lector no puede reconstruir por qué esa persona estaba en la banca. Está casi todo
  en lotes `faltantes-1..3`; `faltantes-4` sí lo trae en la cita de `actuacion-legislador`.
- accion_sugerida: mismo remedio que O3. Donde `actuacion-legislador` no lo traiga, `corpus:buscar
  "<apellido> convocándose"` sobre los diarios ya cacheados, que es el método que `notas.md` de
  `faltantes-2` documenta y que funciona.

---

### O16 — cruces con `inbox/diputados/suplentes/` (269 registros) que se promoverían a la vez

- severidad: **aviso**
- tipo: presentacion (id)
- objecion: comparé este lote con `todos`, `suplentes`, `l-a-l`, `l-m-z`, `xlix-a-l`, `xlix-m-z`,
  `revision-1a/1b` y `content/politicos/`. No hay ningún slug repetido ni ningún id de legislador
  compartido. Sí hay **tres personas que aparecen en los dos lotes con slugs distintos**:
  `silva-guillermo` ↔ `suplentes:silva-guillermo-ricardo`,
  `mazzarovich-gabriel` ↔ `suplentes:mazzarovich-gabriel-jorge`,
  `diaz-marrero-natalia` ↔ `suplentes:diaz-natalia`. `suplentes/` no cita ningún id de legislador
  (1.723 fuentes, todas `diario_de_sesiones`), así que el cruce mecánico por id no las agarra.
- accion_sugerida: resolverlas antes de promover cualquiera de los dos lotes. Como dato para el
  editor: `suplentes/` cubre 153 de las 162 personas que este lote dejó afuera y lo hace con la
  convocatoria de cada día citada («convocándose al suplente siguiente, señor Martín Elgue»), que es
  el método que O3 y O4 le piden a este lote. Si hay que elegir cuál promover primero, ese lote está
  construido sobre la fuente correcta.

---

### O17 — alias compartidos con otra persona

- severidad: **corregir**
- tipo: presentacion
- campo: `alias`
- objecion: la adenda punto 7 dice que un alias compartido por dos personas «se retira de las dos
  fichas y queda solo el nombre completo». Quedaron ocho: `astori` (Florencia Astori de Boni contra
  `content/politicos/astori`), `pasquet` (Marcelo contra Ope Pasquet), `melazzi` (María Rosa contra
  Martín Melazzi, que además es el titular al que suple), `ferreira` (Angélica contra Zulimar
  Ferreira), `araújo` (Fernanda contra Mary y Yisela Araújo), más los tres del cruce con `suplentes`.
  Cuatro fichas declaran `alias_ambiguos` (`araujo-fernanda`, `silva-guillermo`, `pasquet-marcelo`,
  `astori-de-boni-florencia`) y cuatro no (`melazzi-maria-rosa`, `mazzarovich-gabriel`,
  `diaz-marrero-natalia`, `ferreira-angelica`).
- objecion al brief, de paso: la adenda («retirarlo de las dos») y el esquema (`alias_ambiguos`, que
  «el etiquetador exige confirmación») dan dos remedios distintos para el mismo caso. El editor tiene
  que elegir uno y aplicarlo igual a las ocho; hoy conviven los dos y cuatro fichas no tienen ninguno.
- accion_sugerida: la que se elija, en las ocho. `melazzi` es la urgente: con ese alias suelto, toda
  nota sobre Martín Melazzi queda etiquetada a María Rosa.

---

### O18 — `gallo-cantera-luis` y `kronberg-julio` — mandato abierto y salida al mismo tiempo

- severidad: **corregir**
- tipo: presentacion
- campo: `estado_actual`
- objecion: las dos fichas tienen un mandato sin `hasta` (que la página lee como «sigue en el cargo»)
  y a la vez `situacion: fuera_de_cargo` con `salida`. El esquema no lo detecta porque solo exige
  `salida` cuando hay `fuera_de_cargo`. La ficha le dice al lector las dos cosas.
- accion_sugerida: cerrar el mandato con la fecha documentada o sacar la salida. (`gallo-cantera-luis`
  se resuelve solo al fusionarlo con `gallo-luis-enrique`, O1.)

---

### O19 — las 168 fichas — ninguna trae `cobertura`, y son 168 páginas vacías

- severidad: **corregir**
- tipo: presentacion
- campo: `cobertura`
- objecion: ninguna de las 168 fichas tiene el bloque `cobertura`, y ninguna trae declaraciones,
  chequeos, promesas ni casos (`declaraciones.yaml`, `chequeos.yaml`, `promesas.yaml` y
  `menciones.yaml` del lote están vacíos: 3 bytes cada uno). `CLAUDE.md` describe este caso exacto:
  «Para un legislador con poca cobertura, una página con secciones vacías parece descuido o parece
  que el sitio esconde algo; decir qué medios y qué archivos se revisaron … es la forma honesta de
  mostrar la ausencia». Es el punto 19 de la lista de presentación aplicado a 168 páginas de una vez.
  Y hay un contenido evidente para ese texto, que hoy solo existe en `lista.md`: cuántas sesiones
  ocupó la banca esa persona y entre qué fechas.
- accion_sugerida: `cobertura.texto` en cada ficha, con qué se buscó (Parlamento, Hemeroteca,
  Citación 2025), qué hay (mandatos y sesiones) y qué falta (declaraciones sin buscar todavía).
  Sin narrar el proceso: nada de «en esta corrida», «el editor», ids de corridas ni nombres de
  archivo, que es lo que `pnpm revisar:paginas` rechaza.

---

### O20 — `duque-barreto-matias`, `camaran-susana`, `menendez-rafael` — los titulares que el índice omitió

- severidad: `menendez-rafael` y `camaran-susana`: **sin_objecion**; `duque-barreto-matias`: **corregir**
- tipo: sin_objecion / contexto_omitido
- objecion: los tres son de los que la tarea nombró y conviene separarlos porque no están igual.
  - `menendez-rafael`: bien. La cita trae la línea de cargo completa («Representante Nacional por el
    Lema PARTIDO CABILDO ABIERTO - Legislatura XLIX (2020-2025) / 15-02-2020 / 14-02-2025») y un
    diario que dice «RAFAEL OSVALDO MENÉNDEZ CABRERA, Representante por Tacuarembó». Partido,
    departamento y las dos fechas, con fuente. Es el modelo de lo que tendría que ser una ficha de
    titular en este lote.
  - `camaran-susana`: bien. Página con lema y departamento, y su intervención en la sesión
    constitutiva de la L. El `desde: 2025-02-15` no está en la cita, pero es la fecha de la sesión
    citada y la del inicio legal de la legislatura: es la única de las 90 de O3 donde la fecha se
    deduce de la propia fuente sin margen.
  - `duque-barreto-matias`: es el único titular directo de `faltantes-3` y se apoya en un renglón de
    la Citación («Duque Barreto, Matías Heber Costa Pizzatti, Graciela Juana / Otero, Néstor /
    Mazzuchelli De león, Federico») más una fila de `LegAlfab.pdf` («Duque Barreto, Matías PC
    Canelones»). La lectura es correcta (primer nombre = titular, ver O13), pero el `desde:
    2025-03-05` no sale de ninguna de las dos, no tiene id de legislador y no tiene la línea de cargo
    que la adenda punto 2 exige para un titular.
- accion_sugerida: para Duque Barreto, su página de legislador con la línea «Representante Nacional
  por el Lema …» —está en la nómina viva, así que la línea existe hoy— y `LegxPartido.pdf` con su
  nota al pie.

---

### O21 — `monzillo-ines` — la ficha borra el tramo por el que entró a la Cámara

- severidad: **corregir**
- tipo: asimetria / contexto_omitido
- campo: `mandatos`, `partido`
- objecion: la ficha la registra solo como Partido Nacional desde 2025. `notas.md` de `faltantes-3`
  explica que el tramo XLIX (suplente de Carlos Testa, **Cabildo Abierto**) no se cargó porque
  ninguna fuente citable dice «Canelones» para ese tramo. El resultado es una ficha que muestra a una
  persona en un partido y omite el partido con el que ocupó la banca. La fuente que lo dice ya está
  en el lote, citada en esa misma ficha.
- cita_de_contexto: «La diputada Inés Monzillo anunció su salida de Cabildo Abierto y se unió al
  Espacio 40 del Partido Nacional para apoyar la precandidatura de Álvaro Delgado» y «la fuerza
  política liderada por Guido Manini Ríos perdió su segunda banca, tras la salida de Eduardo Lust en
  2023», `https://www.telenoche.com.uy/nacionales/diputada-ines-monzillo-renuncio-cabildo-abierto-y-se-unio-al-partido-nacional-n5362518`
- accion_sugerida: cargar el tramo XLIX con la nota de Telenoche y `_faltante: departamento`, o
  decirlo en `cobertura`. Vale igual en el otro sentido: cualquier persona del lote que haya cambiado
  de partido tiene que mostrar los dos tramos, no el último.

---

### O22 — `casaretto-federico`, `corbo-milton`, `guerrero-gustavo` y el resto de `faltantes-1` — la ficha documenta un día de una carrera de cinco años

- severidad: **aviso** (queda cubierto por O3, O4 y O7, pero el editor tiene que verlo junto)
- tipo: contexto_omitido
- objecion: `faltantes-1` descubrió y documentó bien que `legislaturas-actuo` guarda solo el último
  tramo de convocatoria: Casaretto tiene 205 sesiones en la asistencia y un día en esa página;
  Guerrero 158 y un día; Fort 99 y un día. El lote cargó lo que la página decía, que es lo correcto,
  y lo dejó anotado. El problema es que ese hallazgo ya estaba resuelto en `faltantes-4`
  (`actuacion-legislador` sí trae el historial: lo comprobaron con Micaela Melgar, «da 28-04-2023
  pero `actuacion-legislador` documenta convocatorias desde el 10-03-2020») y las diez fichas de
  `faltantes-1` no se rehicieron con ese método antes de fusionar.
- accion_sugerida: rehacer las diez de `faltantes-1` con `actuacion-legislador` antes de promover.
  Son diez llamadas.

---

### O23 — `sin_objecion` (condensado)

68 de las 168 fichas pasan los cuatro chequeos mecánicos que corrí (departamento, `desde`, `hasta` y
`salida.fecha` presentes literalmente en alguna cita del propio campo, y sin duplicado de persona).
Casi todas vienen de `faltantes-4`, que usó `actuacion-legislador` para el `desde` y
`legislaturas-actuo` para el `hasta`, citados por separado, y que además corrigió doce citas que
unían renglones no contiguos antes de cerrar el lote —lo verifiqué: `--red` da 355 de 355 exactas—:

`alvarez-villalba-jorge`, `badin-cecilia`, `bianchi-diego`, `caballero-archimaut-victoria`,
`calvo-sabina`, `capandeguy-francisco`, `constenla-pablo`, `cunha-de-brun-gabriel`,
`curcho-guillermo`, `dalmao-daniel`, `daveri-mauro`, `diaz-marrero-natalia`, `dodera-bucheli-maria`,
`duran-mamberto-daniela`, `esquivel-rodriguez-alicia`, `ferreira-angelica`,
`fioritti-de-stern-magdalena`, `franquez-anna`, `fros-alvarez-virginia`, `galeano-cor-raul`,
`galiano-william`, `gamarra-borche-fernando`, `garcia-colman-carlos`, `garcia-montejo-mirta`,
`gomez-alvaro`, `gonzalez-bergonzoni-antonio`, `griego-norma`, `guido-sanzo-graciela`,
`hernandez-estevez-milton`, `herrera-silva-carlos`, `irrazabal-miguel`, `irureta-diaz-luis`,
`kuster-poggio-alberto`, `larrosa-martinez-julian`, `laureiro-casana-walter`, `lopez-benoit-soledad`,
`mafio-maria-jose`, `malan-caffarel-carlos`, `marrero-martinez-francisco`, `mazzarovich-gabriel`,
`melgar-micaela`, `mendez-rivero-jorge`, `menendez-rafael`, `migues-aramis`, `montanari-gerardina`,
`nicoletti-emani-osvaldo`, `nunez-soler-nancy`, `olano-llano-jose`, `onetto-gonzalo`,
`orono-aranda-heber`, `pagliarini-desiree`, `pasquet-marcelo`, `perco-joanna`, `perez-da-silva-dardo`,
`perez-lacues-paula`, `pesah-silva-yordana`, `piccone-morales-carlos`, `ramirez-veronica`,
`rodriguez-bidegain-mariano`, `rolando-muela-paola`, `romero-carlos`, `secco-rodriguez-gonzalo`,
`silva-berrueta-myriam`, `silva-guillermo`, `simon-doval-pilar`, `straneo-abreu-juan`,
`tan-meng-jin`, `teliz-enzo`.

`sin_objecion` acá quiere decir «las fechas y el departamento salen de la fuente», no «lista para
publicar»: casi todas siguen alcanzadas por O4 (el rango de suplencia presentado como continuo), por
O8 (partido sin cita) y por O19 (sin `cobertura`). Las dos únicas fichas del lote a las que no tengo
nada que objetar más allá de `cobertura` son `menendez-rafael` (en la lista de arriba) y
`camaran-susana` (que no está en esa lista solo porque su `desde: 2025-02-15` no figura literal en la
cita, siendo la fecha de la sesión que la cita documenta; ver O20).

---

## Objeciones al lote

1. **El lote está construido sobre la fuente equivocada, y la fuente correcta está adentro del
   propio lote.** Medí la calidad de la evidencia por lote de origen, y la diferencia no es de grado:

   | lote | fichas | partido en cita | departamento en cita | `desde` en cita |
   |---|---|---|---|---|
   | `faltantes-1` | 10 | 50 % | 33 % | 100 % |
   | `faltantes-2` | 37 | 27 % | 35 % | 11 % |
   | `faltantes-3` | 38 | 8 % | 7 % | 5 % |
   | `faltantes-4` | 83 | 18 % | **92 %** | **94 %** |

   `faltantes-4` no es mejor por suerte: usó `actuacion-legislador`, que imprime departamento, fecha
   y titular en la misma línea. Los otros tres usaron `legislaturas-actuo` (que solo guarda el último
   tramo) y la Citación 2025 (que no habla de la XLIX). La recomendación de lote es una sola: rehacer
   las 85 fichas de `faltantes-1..3` con el método de `faltantes-4` antes de promover nada, en vez de
   corregir ficha por ficha.

2. **Cobertura del período.** `lista.md` trae 351 nombres de los 366 diarios de sesiones de la XLIX y
   la L. Este lote cubre 160 personas; `inbox/diputados/suplentes/` cubre otras 153. Quedan **ocho
   personas con banca en tres o más sesiones sin ficha en ningún lote**: Fabricio Núñez (48 sesiones),
   Nicolás de Souza Font (33), Marcos Antonio Portillo Urcelay (32), Robert Medina (23), Julio
   Retamoza Mena (10), Julio César Franchi Azambuja (10), Osvaldo Abi Saab (9), Magdalena Ercilia
   Colla Acland (7). Ninguna bloquea este lote; sí bloquean el objetivo del brief («o tienen ficha
   todos los que votan, o ninguno»). Cuatro tienen id ya identificado en `notas.md` de `faltantes-3`
   (Portillo Urcelay 13359, Franchi Azambuja 13871, Abi Saab 13398), así que es trabajo corto.
   `César Leonardo Falcón De Vicente` y `Gabriela Rodríguez` (de `faltantes-4`) quedan pendientes con
   el camino ya escrito: el diario del día de su primera convocatoria.

3. **Hipótesis que no bloquean y hay que dejar dichas.** `notas.md` deja tres bien planteadas:
   Menéndez y Sánchez aparecen en la lista inicial de asistencia de la 1ª sesión de la XLIX sin
   observación de convocatoria (razonable, y para Menéndez además está la línea de cargo, O20);
   Camarán igual para la L; Schusman y Diego Reyes se retiraron por no poder citarlos sin un medio
   inexistente. Ese último criterio es el correcto y conviene decirlo: se prefirió no cargar antes que
   cargar con un id dudoso. La única hipótesis que sí bloquea su propia ficha es la de Molinelli (O6).

4. **Simetría entre partidos.** La composición es Frente Amplio 70, Partido Nacional 50, Partido
   Colorado 33, Cabildo Abierto 11, Partido Independiente 1, Identidad Soberana 1, dos sin confirmar,
   coherente con las bancas de las dos legislaturas; no veo selección por partido. Sí hay una
   asimetría **en la calidad de la evidencia**: el departamento está documentado en el 73 % de los
   mandatos del Partido Nacional contra el 46 % del Partido Colorado y el 49 % del Frente Amplio, y
   el `desde` en el 66 % contra 37 % y 57 %. Verifiqué que es un artefacto de qué lote cubrió a quién
   (la tabla de arriba), no de criterio; lo registro igual porque el lector no ve los lotes, ve dos
   fichas con evidencia distinta. El arreglo del punto 1 la cierra sola, y hay que confirmar que la
   cierra para los cuatro partidos a la vez.

5. **Dependencia de un solo grupo.** 524 de 529 fuentes son `parlamento` (grupo `estado-uruguayo`) y
   458 son `documento_oficial`. Para fichas de identidad eso es lo correcto y no dispara la regla de
   `reportado`, que aplica a `evidencia.nivel` y no existe en el esquema de `politicos`. Las cinco
   fuentes de prensa (una por medio, cuatro grupos distintos) sostienen hechos que sí convendría
   apoyar en dos: la muerte de Abt (`_faltante: segunda_fuente` ya anotado) y la renuncia de Sánchez
   (O10).

6. **Presentación.** Recorrí la lista de control por lo que aplica a una ficha de identidad. Ninguna
   ficha pasa de doce mandatos (el máximo es 2), así que el punto 14 no se dispara por repetición
   —se dispara al revés: el lote condensó de más y perdió la información que el punto 14 quiere
   mostrar (O4). Falta `cobertura` en las 168 (O19, punto 19). La banda de mandatos sí va a dibujar
   las suplencias rayadas (`esSuplencia` en `src/lib/cargos.ts` reconoce «(suplente)»), pero rayada y
   de cinco años sigue leyéndose como cinco años. No hay `resumen`, `analisis` ni texto para el lector
   en el lote, así que no hay narración de proceso que objetar; el riesgo entra cuando el editor
   escriba `cobertura.texto`.

7. **`verificacion: manual` como atajo.** Las tres fuentes marcadas así (`garcia-de-barros-lilian`,
   `molinelli-ricardo`, `sanchez-alejandro`) se saltaron el cotejo de `--red`, y ninguna de las tres
   lo está por ser inaccesible: dos son PDFs de la Hemeroteca que `pnpm fuente` lee sin problema y una
   es Wikipedia. Además arrastran al mantenedor a firmar tres registros por una razón falsa. Es la
   única grieta por la que una cita inexistente atravesó toda la validación mecánica (O2), y conviene
   que el editor la trate como un hallazgo de proceso, no como tres casos.

8. **Discrepancias.** No escribí `discrepancias.yaml`. El lote tiene cinco fuentes de prensa y leí las
   tres que hacen afirmaciones de hecho (Telenoche/Monzillo, Montevideo Portal/Abt, la diaria/Fros);
   ninguna contradice un documento primario que yo tenga. Las diferencias que encontré son entre los
   **registros** y sus fuentes, no entre un medio y un documento, y eso va acá, no a
   `content/discrepancias/`. Dejo dicho el umbral para la próxima: la nota de Wikipedia sobre Sánchez
   podría contrastarse con el diario del Senado, pero como no dice fecha, no hay nada que discrepe.

---

## Objeciones al brief

El brief y su adenda no piden asimetría: dicen «los 99 de cada legislatura, de todos los partidos,
con la misma ficha» y cierran con «el documento que se le exige a un diputado se le exige a los 99».
No hay nada que rechazar por Regla 0. Tres observaciones sobre el texto, no sobre su intención:

1. **La adenda ya había resuelto lo que este lote hizo mal, y el lote no la aplicó.** Los puntos 2
   («cada fecha sale de la fuente»), 4 (suplencias con sus fechas exactas, doce como máximo) y 5
   (`fin_de_mandato` solo al fin del período) describen exactamente O3, O4 y O9. La adenda se escribió
   «antes de que entre un solo registro» y los cuatro lotes de investigador corrieron igual. Eso no es
   un defecto del brief: es que la adenda no llegó a los investigadores, y conviene que el editor lo
   registre como falla de proceso de la corrida y no como error de criterio de cada agente.

2. **El punto 5 de la adenda choca con el esquema y no hay forma de cumplirlo.** `TipoSalida` no tiene
   un valor para «suplente que dejó de ser convocado en una legislatura en curso», y la adenda prohíbe
   usar `fin_de_mandato` fuera del fin del período. Con las dos reglas juntas, 143 registros no tienen
   ninguna opción correcta. Hay que decidirlo arriba (ampliar el enum, o admitir que estas personas no
   llevan `salida` y que el esquema lo permita), no resolverlo ficha por ficha.

3. **El punto 7 de la adenda y el esquema dan dos remedios distintos para el mismo alias ambiguo**
   (retirarlo de las dos fichas / declararlo en `alias_ambiguos`). Ver O17.

---

## Cobertura

Notas de prensa del lote que leí con `pnpm fuente` en esta sesión. Las tres, del mismo modo y con el
mismo umbral. No incluyo la fuente de Wikipedia de `sanchez-alejandro`: `content/medios/wikipedia.yaml`
declara que no es un medio periodístico, así que no corresponde medirle tono.

```yaml
- medio: telenoche
  url: https://www.telenoche.com.uy/nacionales/diputada-ines-monzillo-renuncio-cabildo-abierto-y-se-unio-al-partido-nacional-n5362518
  fecha: 2024-02-05
  evento: "propuesto:salidas-de-legisladores-de-cabildo-abierto-2023-2024"
  partido: Cabildo Abierto
  tono: neutral
  justificacion: >-
    Informa la salida y la atribuye a la protagonista sin adjetivarla: «Entre los motivos de su
    salida, Monzillo señaló que Cabildo Abierto tomó acciones que no iban en la línea con lo
    planteado a los militantes», y el efecto lo cuenta como dato, «la fuerza política liderada por
    Guido Manini Ríos perdió su segunda banca, tras la salida de Eduardo Lust en 2023».

- medio: montevideo-portal
  url: https://www.montevideo.com.uy/Noticias/Fallecio-Andres-Abt-el-alcalde-del-municipio-CH-que-estaba-internado-en-el-CTI-con-COVID-uc780644
  fecha: 2021-03-12
  evento: pandemia-covid
  partido: Partido Nacional
  tono: neutral
  justificacion: >-
    La nota informa el fallecimiento y su trayectoria en términos descriptivos —«El dirigente
    nacionalista había sido electo diputado en 2019, pero había renunciado a la banca tras ser
    reelecto alcalde municipal»—; los elogios que trae son citas de terceros identificados (Lacalle
    Pou, Cosse, Pasquet), no valoraciones del medio.

- medio: la-diaria
  url: https://ladiaria.com.uy/politica/articulo/2023/2/fallecio-virginia-fros-legisladora-del-partido-nacional/
  fecha: 2023-02-20
  evento: "propuesto:fallecimiento-virginia-fros-2023"
  partido: Partido Nacional
  tono: neutral
  justificacion: >-
    Obituario informativo que se limita a los hechos verificables —«Escribana pública, integrante del
    sector Aire Fresco, Fros ocupaba la banca de Gerardo Amarilla, quien a mediados de 2020 dejó el
    Parlamento para asumir la subsecretaría del Ministerio de Ambiente»— y atribuye el elogio a su
    autor, el presidente Lacalle Pou.
```

Los tres `politico:` que corresponderían (`monzillo-ines`, `abt-andres`, `fros-alvarez-virginia`) no
existen todavía en `content/politicos/`, así que van con `partido:`, que el esquema acepta como
alternativa; el editor puede cambiarlos a `politico:` recién después de promover las fichas.
