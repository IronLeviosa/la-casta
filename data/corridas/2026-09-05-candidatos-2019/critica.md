# Crítica — corrida 2026-09-05-candidatos-2019

Modelo: claude-sonnet-5 (brazo barato del experimento en curso: el encargo indica explícitamente
correr con Sonnet en lugar de Opus para este rol. Lo dejo asentado porque así lo pide
`EXPERIMENTO.md`, no porque lo haya decidido yo.)
Lote: inbox/candidatos/2019/2026-09-05/
Registros revisados: 7 (6 fichas nuevas en `politicos.yaml` — Daniel Martínez, Ernesto Talvi,
Guido Manini Ríos, César Vega, Pablo Mieres, Edgardo Novick — más 1 actualización en
`politicos-existentes.yaml` — Luis Lacalle Pou)

Todas las fuentes citadas en este lote se releyeron con `pnpm fuente` en esta sesión (Wikipedia de
cada persona, la página de elecciones 2019 completa —incluida la tabla de los 11 lemas que
compitieron y los 4 partidos que no llegaron ni a inscribirse—, la de elecciones 2024 para las
salidas de mandato, los PDF de Diario de Sesiones citados, Infobae, Teledoce, Subrayado, la nota de
Presidencia sobre Arizti/Mieres y la nota de Montevideo Portal sobre patrimonio). El detalle de cada
lectura está en los bloques de abajo.

## Primero: el choque con las fichas ya publicadas de 2024

Comparé `inbox/candidatos/2019/2026-09-05/politicos.yaml` (Manini Ríos y Mieres) contra
`content/politicos/manini-rios.yaml` y `content/politicos/mieres.yaml`, ya publicados por la
corrida `2026-09-05-candidatos-2024`.

**No hay contradicción de hecho en ninguno de los dos.** Fechas, cargos y partido coinciden en todo
lo que ambas versiones cubren:

- **Manini Ríos**: las dos versiones dan Comandante en Jefe del Ejército Nacional 2015-02-01 a
  2019-03-12 (idéntica cita de Wikipedia en ambas) y Senador de la República 2020-02-15 a
  2025-02-15. `estado_actual.salida` coincide (fin_de_mandato, 2025-02-15, mismas dos fuentes:
  Wikipedia y la tabla de elecciones 2024). Lo que cambia es qué `candidaturas` trae cada una: la de
  2024 (publicada) solo tiene la candidatura de 2024 (votos 60.549); la de 2019 (este lote) solo
  tiene la de 2019 (votos 268.736). Son complementarias, no contradictorias.
  - **Qué conservar de cada una:** de la versión 2019, la fuente del mandato de Senador es mejor —
    un Diario de Sesiones (tipo `diario_de_sesiones`, con la salvedad que anoto más abajo sobre qué
    dice exactamente) contra una nota de Ámbito en la versión 2024 que cita una declaración suya,
    no una fecha. De la versión 2024, no hay nada que la de 2019 no tenga ya para lo que ambas
    cubren. La acción, que dejo para el editor: fusionar ambas `candidaturas` (2019 y 2024) en el
    registro de `content/`, algo que ninguna de las dos hace sola porque cada corrida solo buscó su
    año.
- **Mieres**: incluso mejor alineadas. Representante Nacional 2000-2005, Senador 2015-2020 y
  Ministro de Trabajo 2020-03-01 a 2024-05-02 coinciden exactamente en fechas y fuentes Wikipedia
  entre ambas versiones. `estado_actual.salida` coincide en tipo (renuncia) y fecha (2024-05-02).
  - **Qué conservar de cada una:** la versión 2019 (este lote) **le falta un mandato entero** que sí
    tiene la publicada: "Director de Educación (Ministerio de Educación y Cultura), 1995-1996".
    Confirmé la fuente en esta sesión (`https://es.wikipedia.org/wiki/Pablo_Mieres`, cita: "Durante
    1995 y 1996, ocupó el cargo de Director de Educación en el Ministerio de Educación y Cultura,
    manteniéndose políticamente independiente."), la misma página que este lote ya usa para todo lo
    demás — no hacía falta buscar más. También la versión 2019 sostiene la salida del Ministerio de
    Trabajo con una nota de Presidencia (tipo `nota`, la del asunción de Arizti) mientras que la
    publicada usa la Resolución oficial que acepta la renuncia (tipo `documento_oficial`,
    `https://www.gub.uy/presidencia/institucional/normativa/resolucion-sn024-...`), que ya está en
    el corpus (confirmé que se puede leer con `pnpm fuente` sin problema) y es estrictamente mejor
    evidencia para el mismo hecho. La versión 2019 no encontró ese documento porque no lo buscó lo
    suficiente, no porque no exista.
  - **Acción para el editor**: al fusionar, quedarse con el mandato "Director de Educación" y la
    fuente `documento_oficial` de la salida que ya están en la versión publicada, y agregar la
    `candidatura` de 2019 que la versión publicada no tiene.

Ninguno de los dos casos es un problema de Regla 0 ni de calidad severa: son lotes que investigaron
años distintos con el mismo criterio, y la app de merge (`pnpm promover --correccion` sobre la
publicada) es mecánica. Lo marco como `corregir` en los bloques de cada persona más abajo.

## Objeciones por registro

### politicos.yaml — daniel-martinez
- severidad: aviso
- tipo: contexto_omitido
- objecion: El mandato de Intendente de Montevideo se cierra con `hasta: 2019-04-01`, citando
  "Renuncia definitivamente al cargo de intendente el 1 de abril de 2019 para dedicarse a la
  campaña electoral." Esa cita es literal y contigua, pero la MISMA página de Wikipedia trae, en el
  infobox de arriba, un dato que la contradice: "Intendente de Montevideo / 9 de julio de
  2015-**17 de marzo de 2019**". Antes de dar por buena la fecha (exactamente lo que pide el punto 8
  de mi encargo) fui a buscar la sección "Sucesión en la Intendencia de Montevideo" de la misma nota,
  que resuelve la aparente contradicción: Martínez pidió licencia el 18 de marzo de 2019 (de ahí el
  "17" del infobox, que marca el último día activo antes de la licencia), un suplente ejerció de
  forma interina hasta el 31 de marzo, y "el 1.° de abril luego de la renuncia definitiva al cargo de
  Daniel Martínez; asume definitivamente como intendente [...] Christian Di Candia." Las notas al pie
  de la propia Wikipedia también fechan la renuncia definitiva el 1 de abril de 2019. La fecha que
  usa el registro (1 de abril) es la correcta y mejor corroborada de las dos que trae la misma
  fuente; no cambio nada, pero dejo constancia de la revisión porque el infobox por sí solo habría
  llevado a un error de 15 días.
- cita_de_contexto: "El 1.° de abril luego de la renuncia definitiva al cargo de Daniel Martínez;
  asume definitivamente como intendente el prosecretario general de la Intendencia y 3.er suplente
  de Martínez, Christian Di Candia." (https://es.wikipedia.org/wiki/Daniel_Mart%C3%ADnez_(pol%C3%ADtico))
- accion_sugerida: Ninguna sobre la fecha. Si se quiere blindar contra el infobox contradictorio,
  agregar como fuente adicional alguna de las dos notas de prensa que Wikipedia cita en pie de página
  para el 1 de abril de 2019 (no abiertas en esta sesión por no ser necesarias).
- Resto del registro (Presidente de ANCAP, Ministro de Industria, Senador, candidatura 2019, votos
  1.152.271 en balotaje): confirmado contra Wikipedia e Infobae, fechas y cifras exactas, cita
  literal y contigua en todos los casos. Sin objeción.

### politicos.yaml — talvi
- severidad: aviso
- tipo: un_solo_grupo
- objecion: El mandato "Senador de la República" (2020-02-15 a 2020-03-01, apenas 15 días antes de
  asumir como canciller) tiene una sola fuente, y es Wikipedia. Es el único mandato de todo el lote
  que no tiene ningún respaldo fuera de Wikipedia. No es un error — confirmé la fecha exacta en el
  infobox de `https://es.wikipedia.org/wiki/Ernesto_Talvi` y es coherente con el resto del artículo—,
  pero es el punto más débil de este registro en términos de robustez de fuente.
- cita_de_contexto: "Senador de la República / 15 de febrero de 2020-1 de marzo de 2020"
  (https://es.wikipedia.org/wiki/Ernesto_Talvi)
- accion_sugerida: Si se quiere reforzar, el Diario de Sesiones del Senado de esos 15 días (jura o
  primera sesión de la XLIX legislatura) lo confirmaría; no es indispensable para publicar.
- El resto (Ministro de Relaciones Exteriores con Diario de Sesiones que confirma la aceptación de
  la renuncia el 21/10/2020 — cita verificada literal: "por la que se acepta la renuncia presentada
  por el señor Ernesto Talvi al cargo de ministro de Relaciones Exteriores"; candidatura 2019 con
  300.177 votos, 12,34 %, sin balotaje): confirmado. Sin objeción.
- aviso adicional: el `detalle` de la candidatura dice que Talvi "respaldó a Luis Lacalle Pou" en el
  balotaje. Esto es cierto y está en la misma página de Wikipedia citada como fuente (el infobox de
  resultados de 2019 lista "Partido Colorado (en balotaje)" como parte de la coalición que apoyó a
  Lacalle Pou), pero la `cita` que se adjuntó a esa fuente es solo la fila de votos, no esa frase.
  No es un error — el dato está respaldado por la fuente citada, aunque no por el fragmento
  literal transcripto — pero lo señalo porque el mismo patrón se repite en Manini Ríos, Novick y
  Mieres (ver abajo) y sería más prolijo, no obligatorio, citar también esa frase.

### politicos.yaml — manini-rios
- severidad: corregir
- tipo: cita_fuera_de_contexto
- objecion: La segunda fuente del mandato "Senador de la República" es el Diario de Sesiones de la
  Asamblea General del 1.º de marzo de 2022, con la cita "con aviso, los señores senadores Carmen
  Asiaín, Danilo Astori, Raúl Batlle, Sergio Botana, Charles Carrera, Sebastián Da Silva, Guillermo
  Domenech, Sandra Lazo, Guido Manini Ríos, Silvia Nane, Amin Niffouri, Gustavo Penadés y Lucía
  Topolansky". Leí la oración completa en el documento: esa lista está bajo el encabezado "FALTAN:
  [...] con aviso, los señores senadores [...]" — es decir, es la lista de AUSENTES con aviso previo
  de esa sesión, no la de presentes. `notas.md` la describe como "lista de asistencia como senador",
  lo que puede leerse como que estuvo presente, y no fue así ese día. Esto no invalida el rango de
  fechas del mandato (que viene de Wikipedia y no está en discusión), y el hecho de figurar en la
  nómina de ausentes con aviso sigue confirmando que tenía la banca esa fecha — pero es exactamente
  el tipo de lectura apresurada de una cita que el encargo pide evitar (punto 8): quien lea la cita
  transcripta sin ir al documento entero podría concluir lo contrario de lo que dice.
- cita_de_contexto: "FALTAN: con licencia, los señores representantes [...]; con aviso, los señores
  senadores Carmen Asiaín, Danilo Astori, Raúl Batlle, Sergio Botana, Charles Carrera, Sebastián Da
  Silva, Guillermo Domenech, Sandra Lazo, Guido Manini Ríos, Silvia Nane, Amin Niffouri, Gustavo
  Penadés y Lucía Topolansky, y los señores representantes Armando Castaingdebat [...]"
  (https://infolegislativa.parlamento.gub.uy/temporales/20220301a0001.pdf)
- accion_sugerida: Corregir la descripción en `notas.md`/cualquier resumen editorial de "lista de
  asistencia" a "figura como ausente con aviso en el registro de asistencia de la sesión del
  1.º/03/2022"; si se quiere una fuente que lo muestre efectivamente presente, buscar otra sesión.
  No bloquea la publicación del mandato (las fechas están bien) pero si baja a tier publicado
  conviene que la fuente esté descripta con precisión.
- severidad: aviso
- tipo: sin_objecion (con salvedad de completitud)
- objecion: La candidatura de 2019 tiene una sola fuente, la tabla de Wikipedia. Es aceptable —los
  votos (268.736) coinciden exactamente con el escrutinio de la Corte Electoral que Wikipedia
  reproduce— pero, igual que con Talvi, es el único respaldo.
- Dictamen sobre "Comandante en Jefe del Ejército Nacional" como `mandato` (punto 5 del encargo):
  **corresponde mantenerlo en `mandatos`**, por tres razones. Primera, la letra del propio esquema:
  el campo pide "cargo... electivo o de gobierno", y Comandante en Jefe es, textualmente, un cargo de
  gobierno — lo designa y lo cesa el Poder Ejecutivo (a Manini lo cesó el presidente Vázquez en
  2019, hecho bien documentado), de la misma manera estructural en que designa y cesa a un ministro.
  Este mismo proyecto ya trata como `mandato` a Ministro de Relaciones Exteriores (Talvi), Ministro
  de Industria (Martínez) y Ministro de Trabajo (Mieres) en este mismo lote: todos son
  nombramientos, no elecciones, y nadie objeta que estén. Segunda, ya existe el precedente publicado:
  `content/politicos/manini-rios.yaml` (corrida 2026-09-05-candidatos-2024, ya en `content/`) incluye
  este mismo mandato con la misma fuente y la misma cita. Sacarlo de este registro y dejarlo en el ya
  publicado sería la asimetría real — el mismo hecho, sobre la misma persona, tratado distinto según
  qué corrida lo escribió. Tercera, omitirlo borraría contexto biográfico central: es la razón por la
  que existe Cabildo Abierto y por la que Manini Ríos es candidato en 2019 — no es una nota al
  margen de una carrera militar cualquiera. **Criterio para casos futuros** (carrera militar,
  policial o judicial antes de la política), para que valga igual para todos los partidos: entra en
  `mandatos` la cabeza de una institución del Estado cuando la nombra y la remueve el Poder Ejecutivo
  o una decisión política equivalente (Comandantes en Jefe de las Fuerzas Armadas, Jefe de Policía,
  Fiscal de Corte, integrantes de la Suprema Corte de Justicia, directorios de entes autónomos,
  Presidencia del BCU), con las mismas fechas y fuentes que a cualquier otro mandato. NO entran los
  grados o cargos intermedios de esas mismas carreras (un coronel, un comisario, un juez de primera
  instancia) porque ahí no hay designación política de la cúpula del Estado, solo carrera
  administrativa interna. Esto no lo decido yo — es un dictamen para que el editor o el mantenedor lo
  fijen como regla escrita, pero mi lectura de los hechos y del esquema actual es que corresponde
  mantenerlo.
- Resto del registro (fechas, alias_ambiguos sobre el padre Alberto Manini Ríos —diputado electo en
  1958 por la Unión Demócrata Reformista, confirmado por búsqueda externa— y el tío Carlos Manini
  Ríos —diputado 1934, senador 1946, luego ministro del Interior con Sanguinetti, también
  confirmado—): sin objeción, dato correcto y con más precisión genealógica de la que exige el
  esquema.

### politicos.yaml — cesar-vega
- severidad: sin_objecion
- tipo: sin_objecion
- objecion: Ninguna. Verifiqué el mandato de Representante Nacional (2020-02-15 a 2025-02-15) contra
  el infobox de Wikipedia y contra el Diario de Sesiones del 14/06/2022, donde César Vega figura
  efectivamente en la lista de "ASISTEN" (a diferencia de Manini Ríos en el registro anterior, este
  sí está entre los presentes, no los ausentes: leí la sección completa para confirmarlo). La
  candidatura de 2019 (33.461 votos, 1,38 %, la única banca de Diputados que ganó el PERI, ocupada
  por el propio Vega) y la salida (fin de mandato 2025-02-15, con la pérdida de representación del
  PERI en 2024 —928 votos, 0,38 %— confirmada contra la tabla de elecciones 2024) están bien
  sostenidas. La fuente de Montevideo Portal sobre patrimonio (2024-10-18) es independiente y la cita
  ("la fórmula presidencial del [PERI] —César Vega y Sergio Billiris— no presentaron la declaración")
  es literal y contigua.

### politicos.yaml — mieres
- severidad: corregir
- tipo: contexto_omitido
- objecion: Falta el mandato "Director de Educación (Ministerio de Educación y Cultura), 1995-1996"
  que sí figura en `content/politicos/mieres.yaml` (ya publicado, corrida 2024) y que está en la
  MISMA página de Wikipedia que este registro ya usa para todo lo demás. Ver la sección de arriba
  ("Primero: el choque con las fichas ya publicadas") para el detalle y la cita verificada.
- accion_sugerida: agregar el mandato con la fuente ya existente en `content/politicos/mieres.yaml`;
  no hace falta buscar nada nuevo.
- severidad: corregir
- tipo: riesgo_legal
- objecion: no es un riesgo legal en sentido estricto, pero sí una fuente más débil de la necesaria:
  la salida del Ministerio de Trabajo (`estado_actual.salida`, renuncia, 2024-05-02) se sostiene con
  una nota de Presidencia sobre la asunción de Arizti (tipo `nota`), cuando existe y está disponible
  en el corpus la Resolución oficial que acepta la renuncia de Mieres
  (`https://www.gub.uy/presidencia/institucional/normativa/resolucion-sn024-...`, tipo
  `documento_oficial`, cita: "Se acepta la renuncia presentada por Pablo Mieres al cargo de Ministro
  de Trabajo y Seguridad Social, a partir del 2 de mayo de 2024."), que es la que usa el registro ya
  publicado de 2024. Confirmé en esta sesión que ese documento se puede leer sin problema con `pnpm
  fuente`. No hay excusa material para no haberla usado.
- accion_sugerida: reemplazar o agregar la fuente `documento_oficial` ya disponible.
- Resto del registro (Representante Nacional 2000-2005, Senador 2015-2020, candidatura 2019 con
  23.580 votos): confirmado, sin objeción.

### politicos.yaml — novick
- severidad: sin_objecion
- tipo: sin_objecion
- objecion: Ninguna. Sobre el punto 4 del encargo: releí `https://es.wikipedia.org/wiki/Edgardo_Novick`
  completa (4.616 caracteres, sin recorte) y no tiene infobox de cargo —a diferencia de las otras
  seis fichas de este lote, todas con infobox de sucesión— porque nunca ejerció ninguno: candidato a
  la Intendencia de Montevideo en 2015 (segundo más votado, no ganó) y candidato a la Presidencia en
  2019, nada más. El registro no inventa ningún mandato para llenar el hueco: `mandatos: []`,
  `estado_actual: {situacion: fuera_de_cargo}` sin bloque `salida`. Corrí `pnpm validar --inbox
  inbox/candidatos/2019/2026-09-05` en esta sesión y da **0 errores de esquema** sobre los 242
  registros del lote, incluido este — el conflicto de esquema que `notas.md` documenta ya no existe:
  el esquema se relajó exactamente como anticipa el encargo de esta crítica ("ahora exige al menos un
  mandato o una candidatura"). No hace falta ninguna decisión editorial pendiente sobre este punto.
  La candidatura (26.313 votos, 1,08 %, la banca de Diputados la ocupó Daniel Peña y no él —dato
  correcto, confirmado contra la tabla de Wikipedia) tiene una fuente Wikipedia y una nota de
  Subrayado, ambas verificadas literal y contiguamente.

### politicos-existentes.yaml — lacalle-pou (actualización)
- severidad: aviso
- tipo: contexto_omitido
- objecion: El mandato "Senador de la República" se cierra `hasta: 2019-08-12`, con Wikipedia y una
  nota de Teledoce del mismo día. Leí la nota completa: dice "Lacalle Pou presentó este lunes su
  renuncia al Senado" (12 de agosto de 2019 fue lunes) y agrega, en la misma nota, "La renuncia será
  votada este martes al inicio de la sesión" — es decir, la aceptación formal por el cuerpo habría
  sido el 13 de agosto, un día después de la fecha que usa el registro. Wikipedia coincide con el 12,
  no con el 13, así que no hay una segunda fuente independiente que corrija la fecha, pero tampoco
  hay ninguna que confirme que el 12 (día de presentación) y no el 13 (día de la aceptación en sesión)
  es el día correcto para cerrar el mandato. Es el mismo tipo de imprecisión de un día que el punto 8
  del encargo pide vigilar (ahí se dan como ejemplos "el actual embajador" y "anunció que
  renunciará"); acá el verbo es "presentó" (pasado, hecho consumado) para el trámite, no para el
  efecto, así que lo dejo en aviso y no en corregir.
- cita_de_contexto: "Lacalle Pou presentó este lunes su renuncia al Senado, para concentrarse ciento
  por ciento en la campaña electoral. [...] La renuncia será votada este martes al inicio de la
  sesión." (https://www.teledoce.com/telemundo/nacionales/luis-lacalle-pou-presento-su-carta-de-renuncia-al-senado-para-dedicarse-por-completo-a-la-campana-electoral/)
- accion_sugerida: revisar el Diario de Sesiones del Senado del 13 de agosto de 2019 (no lo
  encontré en el corpus ni lo busqué en la web en esta sesión, por estar fuera de mi alcance como
  crítico) para fijar si `hasta` debería ser 2019-08-13.
- severidad: aviso
- tipo: un_solo_grupo
- objecion: Los mandatos "Miembro de la Cámara de Representantes por Canelones" (2000-2015) y
  "Presidente de la Cámara de Representantes" (2011-2012) tienen una sola fuente cada uno, y es
  Wikipedia en los dos casos. Son fechas de bajo riesgo (15 años de banca departamental, un año de
  presidencia de Cámara, ambos hechos públicos y no controvertidos) pero, igual que con Talvi y
  Manini Ríos, es el patrón más débil del lote.
- severidad: aviso
- tipo: asimetria
- objecion: esto no es una objeción al contenido sino al procedimiento: `politicos-existentes.yaml`
  modifica un registro que ya está en `content/politicos/lacalle-pou.yaml` con tier `publicado`. Por
  la regla de este proyecto ("Cómo cambia un registro ya publicado", `CLAUDE.md`), antes de aplicar
  esto con `pnpm promover --correccion` hace falta escribir primero el registro en
  `content/correcciones/` que declare qué cambia (tres mandatos y una candidatura agregados) y por
  qué. Lo señalo porque el punto 9 del encargo pide tratar esta actualización con más cuidado que el
  resto, y el cuidado que falta acá es de proceso, no de dato: no encontré ningún error en las tres
  fechas nuevas ni en la candidatura (confirmé las cuatro contra Wikipedia y, para el Senado, contra
  Teledoce).

## Objeciones al lote

- **Umbral de inclusión (puntos 2 y 3 del encargo): verificado, sin violación de Regla 0.** Releí
  `https://es.wikipedia.org/wiki/Elecciones_generales_de_Uruguay_de_2019` completa, tabla por tabla
  (la tabla de resultados por lema y la sección de fórmulas con sus listas). Los 11 lemas que
  compitieron el 27 de octubre de 2019, con sus votos exactos, coinciden con la tabla de `notas.md`:
  Frente Amplio 949.376 (39,02 %, 13/30, 42/99), Partido Nacional 696.452 (28,62 %, 10/30, 30/99),
  Partido Colorado 300.177 (12,34 %, 4/30, 13/99), Cabildo Abierto 268.736 (11,04 %, 3/30, 11/99),
  PERI 33.461 (1,38 %, 0/30, 1/99), Partido de la Gente 26.313 (1,08 %, 0/30, 1/99), Partido
  Independiente 23.580 (0,97 %, 0/30, 1/99), Unidad Popular 19.728 (0,81 %, 0/30, 0/99), Partido
  Verde Animalista 19.392 (0,80 %, 0/30, 0/99), Partido Digital 6.363 (0,26 %, 0/30, 0/99) y Partido
  de los Trabajadores 1.387 (0,06 %, 0/30, 0/99). Los siete primeros — que son exactamente los siete
  que este lote incluyó — tienen banca; los cuatro últimos — que son exactamente los cuatro que
  `notas.md` deja afuera y documenta con sus votos — tienen cero. El corte es limpio, mecánico y
  cubre todo el espectro (excluye tanto a Unidad Popular y Partido de los Trabajadores, de izquierda,
  como al Partido Verde Animalista y Partido Digital, sin ubicación de izquierda-derecha clara). No
  encontré ningún candidato adicional que haya competido el 27 de octubre de 2019 y no esté en esta
  lista de 11; la misma nota aclara que otros cuatro partidos (Concertación, Orden Republicano,
  Abriendo Caminos, Partido Democrático Unido) ni siquiera llegaron a la elección general por no
  alcanzar el mínimo de votos en las internas de junio, así que no corresponde incluirlos ni
  siquiera como excluidos-por-umbral. **No encontré ninguna violación de Regla 0 en la aplicación
  del umbral.**
- **`data/alias.yaml` ya no está desactualizado.** `notas.md` señala que "Partido de la Gente" no
  estaba en `data/alias.yaml`. Confirmé en esta sesión que sí está (línea 129 del archivo actual),
  junto con "Identidad Soberana" (línea 140) — ambos con toda apariencia de haberse agregado con la
  corrida paralela `candidatos-2024`, que se promovió mientras este lote corría (ver la nota del
  mantenedor al final de `brief.md`). No hace falta ninguna acción sobre esto.
- **Dependencia de Wikipedia como fuente única dentro de cada mandato.** El esquema de `politicos`
  no exige dos grupos de medios distintos para `mandatos`/`candidaturas` (a diferencia de
  `evidencia.nivel: reportado` en declaraciones), así que esto no bloquea nada, pero lo señalo como
  patrón de lote: de los 18 mandatos y 7 candidaturas de este lote, 9 mandatos y 3 candidaturas
  tienen como única fuente una página de Wikipedia (marcados individualmente arriba). El diseño del
  investigador —"al menos una fuente no-Wikipedia por persona"— se cumplió a nivel de persona, pero
  no a nivel de cada entrada individual. Esto no es un problema de reparto desigual entre políticos
  (repasé los siete y el patrón es parejo: a todos les falta refuerzo en alguna entrada), es un techo
  de esfuerzo de búsqueda general. Encontré además, de paso, una inconsistencia interna real dentro
  de Wikipedia (el infobox contra el cuerpo del artículo de Daniel Martínez, ver arriba) que muestra
  por qué una sola fuente, aunque bien leída, no siempre alcanza.
- **Comparación con las fichas de 2024 ya publicadas:** ver la sección dedicada al principio de este
  documento.

## Objeciones al brief

Ninguna. Leí `brief.md` completo. El criterio de inclusión está escrito en términos explícitamente
simétricos ("el umbral decide", "no agregues a nadie por parecerte importante ni saltees a nadie por
tener un partido chico") y la verificación de la sección anterior confirma que se aplicó así. El
brief también anticipa correctamente el riesgo de choque con el lote de 2024 y lo deja para esta
crítica, en vez de instruir al investigador a resolverlo por su cuenta o a omitir a alguien — es el
tratamiento correcto de una ambigüedad genuina, no una instrucción sesgada. No hay pedido de
seleccionar, omitir o encuadrar por partido o ideología en ningún punto del encargo.

## Cobertura

Este lote es de identidad/candidatura, no de declaraciones, así que la mayoría de las fuentes son
Wikipedia (excluida de estos registros por su propia ficha en `content/medios/wikipedia.yaml`:
"nunca como fuente para calificar declaraciones, giros, promesas o chequeos") o documentos
institucionales (Parlamento, Presidencia como `documento_oficial`), que tampoco corresponde calificar
por tono. Registro tono solo para las notas de prensa/redacción efectivamente leídas en esta sesión:

```yaml
- medio: infobae
  url: https://www.infobae.com/america/america-latina/2019/10/28/daniel-martinez-celebro-que-el-frente-amplio-haya-sido-la-fuerza-mas-votada-y-convoco-al-dialogo-a-otras-fuerzas-de-cara-al-balotaje/
  fecha: 2019-10-28
  evento: elecciones-2019
  politico: daniel-martinez
  tono: neutral
  justificacion: >-
    Reporta sin adjetivar los dichos y los datos de boca de urna de Martínez ("agradeció esta
    noche a los uruguayos que 'hayan vuelto a decidir que la fuerza más importante del Uruguay se
    llama Frente Amplio'") y cierra señalando el descenso de votos del Frente Amplio sin
    evaluarlo.

- medio: teledoce
  url: https://www.teledoce.com/telemundo/nacionales/luis-lacalle-pou-presento-su-carta-de-renuncia-al-senado-para-dedicarse-por-completo-a-la-campana-electoral/
  fecha: 2019-08-12
  evento: elecciones-2019
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Nota puramente factual sobre el trámite administrativo: "Lacalle Pou presentó este lunes su
    renuncia al Senado, para concentrarse ciento por ciento en la campaña electoral", sin
    valoración de la decisión.

- medio: subrayado
  url: https://www.subrayado.com.uy/novick-apunta-otra-vez-contra-mujica-y-dice-que-ahora-hace-payaso-n532035
  fecha: 2019-04-23
  evento: elecciones-2019
  politico: novick
  tono: neutral
  justificacion: >-
    Reporta los ataques de Novick contra Mujica, Astori y Vázquez citándolo textualmente ("Hace de
    payaso y hace reír a la tribuna riéndose de las propuestas de la oposición") sin calificar a
    Novick ni a quienes critica; es transcripción de declaraciones, no editorial.

- medio: presidencia
  url: https://www.gub.uy/presidencia/comunicacion/noticias/mario-arizti-asumio-ministro-trabajo-seguridad-social
  fecha: 2024-05-02
  evento: "propuesto:cambio-ministro-trabajo-mieres-2024"
  politico: mieres
  tono: neutral
  justificacion: >-
    Nota institucional sobre la asunción de Arizti que menciona a Mieres solo como "el saliente
    ministro" cuyo trabajo se continuará, sin balance ni crítica de su gestión.

- medio: montevideo-portal
  url: https://www.montevideo.com.uy/Noticias/Uno-a-uno-el-patrimonio-que-declararon-los-principales-candidatos-presidenciales-uc903764
  fecha: 2024-10-18
  evento: elecciones-2024
  politico: cesar-vega
  tono: neutral
  justificacion: >-
    Registra sin editorializar que "la fórmula presidencial del [PERI] —César Vega y Sergio
    Billiris— no presentaron la declaración" jurada de patrimonio, en el mismo formato factual que
    usa para todos los demás candidatos de la nota.
```

No hay `discrepancias.yaml` para este lote: no encontré ningún caso de un medio publicando algo que
contradiga un documento oficial, diario de sesiones o video. La única inconsistencia entre fuentes
que encontré (el infobox contra el cuerpo del artículo de Wikipedia sobre Daniel Martínez) es interna
a Wikipedia, que no es un medio periodístico ni una fuente primaria en el sentido que exige
`discrepancias.yaml` (hace falta un documento oficial, diario de sesiones o video que decida, y acá
lo que compite son dos pasajes de la misma enciclopedia). Por eso quedó como objeción de registro
(`daniel-martinez`, arriba) y no como discrepancia.
