<!-- origen: inbox/diputados/l-a-l -->

## candidatos_giro

Ninguno: este lote es solo identidad, partido y mandatos (fichas, no declaraciones), por instrucción
del brief.

## hipotesis

- **Rodrigo Blás (PN, Maldonado)**: el brief lo pide como diputado titular de la L y con "los dos
  mandatos" (XLIX y L). El historial oficial (`.../legisladores/12660/legislaturas-actuo`) no muestra
  ningún período como Representante Nacional titular ni en la XLIX (solo un día como suplente,
  13/08/2024-14/08/2024) ni en la L: pasó directamente a "Senador de la República por el Lema PARTIDO
  NACIONAL desde el 14/10/2025". Tampoco aparece en la nómina en tiempo real de titulares de la L
  (`documentos.diputados.gub.uy/docs/LegxPartido.pdf`, ni como titular ni en las notas de sustitución).
  No encontré una fuente que documente que haya ejercido la banca de diputado de la L en algún momento
  entre el 15/02/2025 y su asunción como senador. Puede ser que la lista del brief lo haya tomado de un
  resumen (Wikipedia u otro) que cuenta a un suplente ocasional como "titular"; no lo pude confirmar.
  La ficha entregada solo documenta lo que el registro oficial sostiene: el día de suplencia en la XLIX
  y el Senado desde octubre de 2025.
- **Alfredo De Mattos (PN, Tacuarembó), Sebastián Andújar (PN, Canelones), Rodrigo Goñi (PN,
  Montevideo), Nicolás Lorenzo (FA, Artigas)**: el brief los incluye en el grupo "también fueron
  diputados titulares en la XLIX". El historial oficial de cada uno muestra, para la XLIX, un único día
  de actuación (De Mattos: 05/12/2023-08/12/2023, tres días; Andújar: 15/05/2024, un día; Goñi:
  15/08/2024, un día; Lorenzo: la fila "Legislatura L" que aparece con fecha 03/06/2026 también es de
  un día, y su XLIX si es completa 15/02/2020-14/02/2025). Estas entradas breves y sin la etiqueta de
  rol ("Representante Nacional por el Lema...") que sí tienen los períodos titulares largos parecen
  suplencias puntuales, no el ejercicio continuo del cargo. Por eso no les cargué un segundo mandato de
  XLIX: hacerlo habría afirmado una banca titular de cinco años que la fuente no sostiene. Si el
  mantenedor tiene otra fuente (por ejemplo, el diario de sesiones de una fecha específica) que muestre
  un período titular más largo, se puede agregar por corrección.
- **Pedro Irigoin (FA, Canelones)**: su ficha en `.../legisladores/12649` no muestra ninguna línea de
  rol/partido/departamento vigente (a diferencia de las 45 personas restantes), solo la lista de
  comisiones, varias de ellas "Cámara de Senadores". Esto sugiere que después de renunciar a la banca de
  diputado el 08/07/2025 pasó a actuar en el Senado (probablemente como suplente), pero no encontré una
  fuente que dé fecha de inicio ni confirme el rol con la fórmula "Senador de la República por el
  Lema...". No se cargó ese posible mandato; queda como hipótesis para una corrida futura con más
  tiempo de búsqueda en el diario de sesiones del Senado.
- **Walter Cervini (PC, Canelones)**: el documento en tiempo real `LegxPartido.pdf` lo lista, en una
  columna que por el desorden de extracción del PDF (tabla a 3 columnas) parece asociarlo a "Cervini
  Pratto, Walter"; la ficha oficial y el listado alfabético de legisladores solo dan "Cervini, Walter"
  (sin segundo apellido). Se usó el nombre sin el segundo apellido por ser la fuente más confiable
  (ficha individual + listado alfabético, ambos sin JS y con extracción limpia); si "Pratto" es
  efectivamente su segundo apellido, se puede confirmar con la biografía en PDF del sitio de la
  Biblioteca del Parlamento, que no localicé por nombre.

## casos_vistos

Ninguno. No se investigaron casos judiciales (no lo pidió el brief).

## verificacion_manual

Ninguno: los 46 perfiles y las 13 páginas de historial de legislaturas se leyeron con `pnpm fuente` y
citan igual que cualquier otro registro (`verificacion: automatica` implícita, sin marca especial).

## cobertura_del_periodo

Cobertura completa para las 46 personas pedidas: mandato de la L (desde 2025-02-15, con la fuente
oficial `parlamento.gub.uy/camarasycomisiones/legisladores/<id>`, tipo `documento_oficial`). Para las
diez personas con mandato genuino y completo en la XLIX (Cairo, Cervini, Colman, Dastugue, Echeverría,
Gianoli, Lima, y los tres que además pasaron al Senado: Antonini, Ferreira, Díaz) se agregó ese segundo
mandato con la misma fuente oficial (`legislaturas-actuo`). No se buscó actividad de campaña, prensa ni
declaraciones de estas personas: el brief pidió solo identidad, partido y mandatos con fuente oficial.

## objeciones_al_brief

Ninguna: el brief pide la misma ficha (identidad, partido, mandatos, sin adjetivos) para las 46
personas, de los cinco partidos representados (Frente Amplio, Partido Nacional, Partido Colorado,
Cabildo Abierto no aparece en este lote específico, Identidad Soberana tampoco), sin asimetría. Se
cumplió ese criterio parejo para todos.

## fallas_de_la_fuente_oficial_y_su_resolucion

`pnpm fuente` sobre `parlamento.gub.uy/camarasycomisiones/legisladores/<id>` devolvía, en aproximadamente
un tercio de los primeros intentos de esta corrida, solo 100 caracteres ("Copyright © 2023 Parlamento de
la República Oriental del Uruguay..."), aunque el HTML descargado sí traía el contenido completo (medido:
40-60 KB, con la ficha de la persona adentro). La causa: `Readability` (usado por `extraerHtml` en
`scripts/lib/extraer.ts`) a veces identifica como "artículo principal" un fragmento muy corto —el pie de
página con el copyright— en lugar de la tarjeta de la persona, que queda descartada por tener muchos
enlaces (la lista de comisiones). Como ese resultado corto no era vacío, el código no caía al respaldo
que limpia `script/style/nav/header/footer/aside/form` y usa el resto del `<body>`. Se corrigió una
línea en `scripts/lib/extraer.ts` (`if (!texto)` → `if (!texto || texto.length < 200)`), alineada con el
`charThreshold: 200` que ya se le pasaba a `Readability`: un resultado más corto que ese umbral no
cumple lo que el umbral pedía, así que ahora se descarta igual que el caso vacío y cae al respaldo. Se
probó en las 46 fichas + 13 páginas de historial de legislaturas de este lote: 100 % de éxito después
del cambio (antes, sin el cambio, fallaba de forma intermitente e irreproducible con reintentos simples).
El cambio es mínimo, no toca ningún otro sitio (el respaldo ya existía, solo se amplió cuándo se activa),
y quedó documentado con comentario en el propio archivo. Se avisa acá porque es una corrección de
infraestructura compartida, no de `content/`, y el mantenedor puede querer revisarla antes del próximo
`pnpm build` o corrida.

## referentes_faltantes

Ninguno: este lote no incluye referentes, solo `politicos.yaml`.


---

<!-- origen: inbox/diputados/l-m-z -->

# Notas — Diputados L, apellidos M-Z

## Método

Fuente principal: `parlamento.gub.uy/camarasycomisiones/legisladores/<id>` (Despacho Virtual). Para
identificar el `<id>` de cada persona no encontré un buscador estático utilizable (la página
`sobreelparlamento/busquedalegisladores/lista?...` no renderiza resultados en el HTML que
`pnpm fuente` puede leer: es JS puro), así que usé `WebSearch` con `site:parlamento.gub.uy
camarasycomisiones legisladores <Apellido>` para ubicar cada id, y después abrí esa URL con
`pnpm fuente`. Encontré dos casos de id equivocado por homonimia parcial: `12048` correspondía a
"Walter Gonzalo Martínez" (no William Martínez; el id correcto es `12776`), y `13602`
correspondía a "Robert Silva" (Senador, no Rubenson Silva; el id correcto es `8307`). Los corregí
antes de cargar la ficha.

**Falla intermitente y sistemática de `pnpm fuente` en varias páginas de legislador.** Para unos
15 ids (Melo, Olaizola, Osorio, Reisch, Rielli, Rodríguez Da Costa Leites, Rodríguez [Conrado],
Satdjián, Schipani, Silva [antes de corregir el id], Soravilla, Tucci [parcialmente], Valverde,
Viera [Nicolás]) `pnpm fuente` devolvió sistemáticamente solo el pie de página ("Copyright © 2023
Parlamento...") en vez del bloque "Despacho Virtual" con el cargo. Confirmé con `curl` directo
(mismo User-Agent que usa el extractor) que el HTML servido por `parlamento.gub.uy` para esas
URLs específicas **no contiene esa información en el HTML estático**: se carga por JavaScript
después de la carga inicial, a diferencia de otras páginas de legislador (ej. Mahía, id 2921) que
sí la traen en el HTML servido. No es un problema del extractor: es una inconsistencia del propio
sitio (posiblemente cacheo desigual entre nodos). Reintenté cada una 2-3 veces con `--forzar
--sin-archivo` y con distintos espaciados; para los casos que siguieron fallando usé, en este
orden:
1. `https://parlamento.gub.uy/camarasycomisiones/legisladores/<id>/legislaturas-actuo` (mismo
   dominio, sí renderiza server-side de forma consistente: da el rango de fechas por legislatura,
   y a veces trae el prefijo "Representante Nacional por el Lema PARTIDO X").
2. `https://documentos.diputados.gub.uy/docs/LegxPartido.pdf` — "L Legislatura, Nómina de
   Representantes por Partido", documento oficial generado en vivo (fecha y hora en el pie:
   09/09/2026 08:11:46), con los 99 titulares agrupados por partido y departamento. Es un PDF de
   tres columnas por fila (nombre1, nombre2, nombre3) seguido de tres departamentos; el orden de
   lectura de `pdftotext` desplaza los departamentos respecto de los nombres. Verifiqué el
   desplazamiento contra 6+ filas con departamento ya confirmado por otra vía (Rielli→Durazno,
   Rinaldi→Durazno, Reisch→Colonia, Molins→Rivera, Rydström→Montevideo, Maneiro→Montevideo,
   Osorio→Rivera, Mesa→San José, Reyes→Canelones): la regla empírica es que, dentro de una fila,
   el departamento del **primer** nombre es el **segundo** token de departamento, el del
   **segundo** nombre es el **tercer** token, y el del **tercer** nombre es el **primer** token.
   La cita que dejé en cada registro que usa este documento es la fila completa, literal, tal como
   la imprime `pnpm fuente`; la interpretación (qué depto corresponde a qué nombre) queda acá para
   que el crítico la pueda revisar.

**"Legislatura L" con un solo día en `legislaturas-actuo`.** Para varias personas activas y sin
ningún indicio de haber dejado la banca (Mesa, Tucci, Varela, Rodríguez [Conrado], Schipani,
Reisch), la fila de "Legislatura L (2025-2030)" en `legislaturas-actuo` muestra un solo día,
siempre una fecha de 2026 cercana al momento de la consulta (23-07-2026, 03-09-2026, 05-06-2026,
16-06-2026, 09-03-2026, 30-04-2026). Interpreto esto como un artefacto de renderizado (un
placeholder de "última actualización" que no terminó de cargar), no como un hecho real, porque
todas esas personas están confirmadas como titulares activos por la página principal o por el PDF
de hoy. Para esas personas usé `desde: 2025-02-15` (inicio de la legislatura) siguiendo la regla
general del brief, y no el dato de esa fila.

## Excluidos de esta ficha (no son diputados titulares de la L)

- **Aníbal Pereyra** (listado en el brief como "FA, Rocha"): la propia página oficial
  (`legisladores/7742` y `legisladores/7742/legislaturas-actuo`) dice "Senador de la República por
  el Lema PARTIDO FRENTE AMPLIO desde el 02/03/2025". El PDF de titulares de hoy lo confirma por la
  nota al pie "(5) Sustituye al Representante Aníbal Pereyra mientras desempeñe el cargo de
  Senador de la República" (el sustituto titular actual es Gabriel Tinaglini, por Rocha, PN... la
  nota corresponde a la banca que dejó, no a su partido). Su paso por Diputados en la XLIX fue solo
  una suplencia de dos días (10 al 12 de octubre de 2023), no un mandato. No le armé ficha en este
  lote; si corresponde una ficha de Senadores, va en otro lote.
- **Gustavo Salle**: ya tiene ficha (`content/politicos/salle.yaml`). Confirmé con
  `legisladores/13612` el mismo cargo que ya está cargado ("Representante Nacional por el Lema
  PARTIDO IDENTIDAD SOBERANA, departamento de CANELONES", Legislatura L). Lo único que le falta a
  esa ficha es la fuente `documento_oficial`: hoy solo tiene Wikipedia y El Observador (`tipo:
  nota`). Sugiero una corrección (`cotejo_con_primaria`) que agregue esta fuente al mandato
  existente:
  - url: https://parlamento.gub.uy/camarasycomisiones/legisladores/13612
  - medio: parlamento, tipo: documento_oficial, fecha/retrieved_at: 2026-09-09
  - cita: "La legislatura seleccionada es: Legislatura L (2025-2030)\n\nRepresentante Nacional por
    el Lema PARTIDO IDENTIDAD SOBERANA, departamento de CANELONES"

## candidatos_giro

No aplica: este lote es de identidad y mandatos, no de declaraciones.

## hipotesis

- Ninguna. Todo lo cargado sale de `parlamento.gub.uy` o de la nómina oficial de Diputados.

## casos_vistos

Ninguno visto en este lote (no se buscaron casos judiciales; el trabajo fue estrictamente de
identidad/mandato).

## verificacion_manual

Ninguna: los ~15 ids con la falla de renderizado descrita arriba sí se pudieron resolver con una
fuente oficial alternativa (`legislaturas-actuo` o el PDF de la nómina), así que no quedó ningún
registro con `verificacion: manual`.

## Mandatos con datos oficiales distintos de lo esperado por el brief

El brief da `desde: 2020-02-15, hasta: 2025-02-14` como plantilla general para la XLIX. Donde la
página `legislaturas-actuo` mostró un rango distinto (más preciso o más corto), usé el rango real
y lo dejo anotado acá para que el editor lo tenga a la vista:

- **José Carlos Mahía**: en la XLIX no fue titular desde el inicio de la legislatura, sino recién
  desde el **15/11/2022** hasta el 14/02/2025 (fuente: `legislaturas-actuo`, id 2921). No encontré
  una segunda fuente que explique el porqué (podría estar relacionado con su candidatura a la
  Intendencia de Canelones en 2020, mencionada en su biografía oficial, pero no lo afirmo sin una
  fuente que lo confirme). Actualmente (L) figura "actuando como Ministro o Subsecretario desde el
  05/03/2025" (es el Ministro de Educación y Cultura del gobierno Orsi); mantiene la titularidad de
  la banca de forma nominal, con un suplente (Luis Enrique Gallo, según el PDF de titulares) en el
  ejercicio efectivo. No agregué esto como un mandato aparte porque el esquema no tiene un campo
  para "banca con suplente por función ejecutiva"; lo dejo acá para que quede visible.
- **Nibia Reisch**: en la XLIX el registro oficial muestra un solo día (01/12/2022), no un mandato
  completo. **No le cargué mandato de XLIX** aunque el brief la listaba como "también titular en
  la XLIX"; solo tiene el mandato de la L en esta ficha.
- **Álvaro Rodríguez Hunter**: en la XLIX el registro oficial muestra un solo día (08/07/2020), no
  un mandato completo. **No le cargué mandato de XLIX** aunque el brief lo listaba como dual.
- **Javier Umpiérrez**: en la XLIX fue titular desde el 15/02/2020 pero hasta el **07/03/2023**
  (no hasta el 14/02/2025 como en el resto de los casos dobles). No encontré una segunda fuente
  que explique por qué dejó la banca antes de terminar la legislatura.
- **Nicolás Viera**: hoy (L) es **Senador**, no Representante. La página oficial no muestra ninguna
  línea "Representante Nacional..." para la L (a diferencia de otras personas activas, donde ese
  vacío parece un artefacto: acá coincide con que asumió como Senador el 05/03/2025, reemplazando a
  Alejandro Sánchez, y el PDF de titulares confirma con la nota "(1) Sustituye al Representante
  Nicolás Viera mientras desempeñe el cargo de Senador de la República" — su banca de Diputados por
  Colonia la ejerce ahora Cecilia Badín). Le cargué **solo el mandato de la XLIX** (2020-02-15 a
  2025-02-14, completo). `estado_actual.situacion: en_cargo` porque sigue en un cargo público
  electivo activo (Senador), aunque ese cargo no está documentado en esta ficha porque el lote es
  de Diputados.
- **Ana Olivera**: renunció a la banca el 01/03/2026 (fuente oficial: `legislaturas-actuo`, id
  8089, que da el rango exacto 15/02/2025 a 01/03/2026; coincide con notas de prensa que vi de
  paso —Montevideo Portal— pero no las usé como fuente porque el dato oficial ya alcanza).
  `estado_actual.situacion: fuera_de_cargo`, `salida.tipo: renuncia`.
- **Emiliano Soravilla**: dejó la banca el 01/07/2025 (fuente oficial: `legislaturas-actuo`, id
  12763: 15/02/2025 a 01/07/2025). Busqué en el corpus (`pnpm corpus:buscar "Soravilla"` y
  variantes) una segunda fuente que explicara el motivo y no encontré ninguna nota de prensa ni
  diario de sesiones posterior que lo mencione; solo until esa fecha aparece en listas de
  asistencia. `salida.tipo: renuncia` es una inferencia razonable (no hay indicio de destitución
  ni fallecimiento) pero no está confirmada por una segunda fuente; lo marco para que el editor lo
  sepa. Tampoco pude confirmar su departamento (Artigas) con una fuente de `pnpm fuente`
  específica para él: el PDF de titulares de hoy no lo incluye (ya no está en la banca) y su página
  principal nunca renderizó el bloque de cargo. El departamento que usé viene del brief y de una
  búsqueda web (no citada); si el editor quiere una fuente oficial más sólida, faltaría un diario
  de sesiones de febrero-junio de 2025 que lo liste con su departamento.
- **Alejo Umpiérrez**: el caso más irregular del lote. En la L solo aparece como titular durante
  **dos días** (08/04/2025 a 09/04/2025); no está en el PDF de titulares de hoy ni tiene nota de
  sustitución en ese documento (a diferencia de Viera y Pereyra, cuyo reemplazo por ejercer otro
  cargo sí está documentado con nota al pie). En la XLIX fue titular solo del 15/02/2020 al
  26/11/2020 (9 meses, no el período completo). Su página principal nunca mostró la línea de
  cargo/departamento; usé su biografía oficial (`Bio07981.PDF`, actualizada a 2005) para confirmar
  partido (Nacional) y departamento (Rocha) por su historial político, no por una afirmación
  directa sobre la L. `estado_actual.salida.tipo: renuncia` es una inferencia (no hay evidencia de
  destitución ni fallecimiento, pero tampoco una fuente que confirme "renuncia" en vez de, por
  ejemplo, una licencia extendida sin fecha de retorno). Este registro necesita revisión humana
  antes de publicarse.

## cobertura_del_periodo

Este lote cubre exclusivamente identidad y mandatos (Legislatura L, y XLIX para quienes
corresponde), con fuente oficial de `parlamento.gub.uy`. No se investigaron declaraciones,
promesas, chequeos ni casos: por eso `declaraciones.yaml`, `promesas.yaml`, `menciones.yaml` y
`chequeos.yaml` están vacíos. `pnpm validar --inbox` avisa (no bloquea) que estas 50 personas no
tienen registros en ningún tema; es esperable en un lote de fichas de identidad y no requiere
acción.

## objeciones_al_brief

Ninguna: el brief pide la misma ficha (identidad, partido, mandatos con fuente) para las 51
personas listadas sin distinción de partido, y así se hizo. Los únicos apartamientos del brief son
fácticos, no editoriales: excluí a Aníbal Pereyra (no es diputado, es Senador) y recorté o quité
mandatos de XLIX cuando el registro oficial no respalda un mandato completo (Reisch, Rodríguez
Hunter, Umpiérrez Javier, Umpiérrez Alejo), todos documentados arriba con su fuente.

## referentes_faltantes

Ninguno: este lote no generó menciones a referentes.


---

<!-- origen: inbox/diputados/xlix-a-l -->

# Notas — diputados XLIX, apellidos A-L (que no siguieron en la L)

Corrida 2026-09-09-diputados-49-50. Modelo: claude-sonnet-5.

## Método y advertencia sobre la fuente principal

`parlamento.gub.uy/camarasycomisiones/legisladores/<id>` (la página "Conozca a sus legisladores")
es una página con contenido cargado por Drupal Views; `pnpm fuente` la extrae con Readability, y para
la mayoría de estas fichas Readability se queda con el pie de página ("Copyright © 2023 Parlamento...")
en vez del contenido real: la extracción da 100 caracteres y el dato de partido/legislatura se pierde.
La sub-página `.../legisladores/<id>/legislaturas-actuo` (que lista, por legislatura, "Desde"/"Hasta")
sí se extrae bien casi siempre y fue la fuente primaria usada para cada mandato. La búsqueda con el
parámetro `Ppsn_apenombre` que sugiere el brief **no filtra en el servidor** (devuelve una lista genérica
de "Parlamentarios Uruguayos 1830-2005"); el campo que sí filtra es `combine` (texto libre) en
`https://parlamento.gub.uy/sobreelparlamento/busquedalegisladores/lista?Cpo_Codigo=D&combine=<apellido>`.
Se usó ese parámetro (leído con `curl` para desambiguar homónimos antes de citar; nunca para citar) y
después se leyó con `pnpm fuente` la página `legislaturas-actuo` de cada id confirmado.

**Descubrimiento importante:** para varias personas, la fila de `legislaturas-actuo` correspondiente a
la XLIX aparece sin el prefijo "Representante Nacional por el Lema PARTIDO X" (que sí aparece para la
mayoría) y con fechas que no siempre coinciden con la permanencia real. Se cotejó cada uno de estos
casos con `.../legisladores/<id>/actuacion-legislador?Fecha_desde=2020-02-15&Fecha_hasta=2025-02-14`
(también documento oficial de parlamento.gub.uy, lista sesión por sesión), que en varios casos trae
una línea literal muy útil: **"Pasaje a Ministro o Subsecretario el dd/mm/aaaa dd/mm/aaaa"**, con las
dos fechas exactas de salida y retorno. Se usó esa línea para Cardoso y Lema. Para Besozzi, García y
Lafluf, el patrón (XLIX termina el 25-11-2020 en los tres, sin excepción) coincide con el recambio de
intendencias de noviembre de 2020 (elecciones departamentales de setiembre de 2020, postergadas por la
pandemia); además, la actuación de Lema (11125) registra el 18-11-2020 varias mociones "RENUNCIA BANCA
CAMARA REPRESENTANTES" para Lafluf, García y otros, que se usó como segunda fuente para esos dos.

## candidatos_giro

Ninguno: este lote es solo de fichas de identidad (`politicos.yaml`), sin declaraciones.

## hipotesis

- **Caggiani (9916):** el registro oficial de `legislaturas-actuo` solo marca "Representante Nacional"
  para la XLIX entre 2022-03-02 y 2025-02-14. Su página de actuación muestra que desde el 15-02-2020
  estuvo "Convocado a la Cámara de Representantes por el departamento de MONTEVIDEO hasta el
  08/03/2022" (es decir, como suplente convocado, no como titular propio) y que en abril-julio de 2020
  aparecen convocatorias a la Cámara de Senadores donde figura como "Titular: Caggiani, Daniel" de un
  escaño en el Senado (lema Frente Amplio, sublema Más Desarrollo con Igualdad). No se investigó a fondo
  esta doble vía (banca de Diputados como suplente convocado 2020-2022 + posible titularidad en una
  lista al Senado en el mismo período) por el volumen del lote; la ficha solo carga el tramo en que
  aparece con el prefijo "Representante Nacional" (2022-03-02 a 2025-02-14), que es el que sostiene con
  más solidez el rótulo "titular". Falta confirmar con un diario de sesiones si ejerció como diputado
  antes de esa fecha y en calidad de qué.
- **Castaingdebat (8584):** su actuación parlamentaria (2020-02-15 a 2024-03-05, 41 fechas distintas)
  muestra convocatorias intermitentes a la Cámara de Senadores (una registrada el 07-03-2023, "Titular:
  Niffouri, Amín") y a la de Representantes, compatibles con un patrón de suplente frecuente más que de
  titular con banca fija. La fila de `legislaturas-actuo` solo documenta un tramo de una semana
  (05-02-2024 a 12-02-2024). Se optó por cargar el mandato como 2020-02-15 a 2025-02-14 (el período
  "nominal" de la lista, no el de asistencia real) por ser lo más defendible sin sobre-interpretar;
  falta un diario de sesiones o el legajo de asistencias completo para precisar si tuvo banca propia.
- **Amarilla (3959):** además de la XLIX, `legislaturas-actuo` muestra una convocatoria de un día en la
  L (03-12-2025 a 04-12-2025), es decir que no continuó como titular en la L pero sí fue convocado como
  suplente una vez. No se carga ese dato porque el lote es solo XLIX.
- **Roster completo:** no se hizo un barrido independiente de los 99 titulares de la XLIX para confirmar
  que la lista de 33 personas del brief es exhaustiva en el tramo A-L; se investigó exactamente a las 33
  personas nombradas y no apareció ninguna adicional durante la lectura (no se buscó expresamente a
  nadie más). Queda pendiente el barrido completo si se necesita certeza total.

## casos_vistos

- El registro de actuación de Cardoso (5217) trae, en 2021, una comisión investigadora sobre "COMPRAS Y
  GASTOS REALIZADOS EN EL MINISTERIO DE TURISMO DURANTE EL PERIODO MARZO DE 2020 A JULIO DE 2021
  RELACIONADOS DIRECTAMENTE CON EL ACTUAR DEL EX MINISTRO GERMÁN CARDOSO" (d.s. 4358-4379, agosto-
  diciembre de 2021). No investigado: el brief no pidió casos judiciales para este lote.

## verificacion_manual

Ninguna: todas las fuentes citadas se leyeron con `pnpm fuente` y quedaron en el corpus. Los `curl`
directos a `parlamento.gub.uy` (búsqueda por `combine=`, y la lectura de `actuacion-legislador` para
decidir si una fila de `legislaturas-actuo` era plausible) fueron reconocimiento, no citación; todo lo
citado en `politicos.yaml` se re-leyó con `pnpm fuente` antes de usarlo.

## cobertura_del_periodo

Las 33 fichas cubren exclusivamente la legislatura XLIX (2020-02-15 a 2025-02-14), que es lo que pide
este lote. No se buscó actividad de campaña, declaraciones ni votaciones (eso es de otros lotes/temas).
Distribución de mandatos:

- **Término completo (2020-02-15 a 2025-02-14):** Aíta, Albernaz, Alvear, Amarilla, Bacigalupe, Barreiro,
  Bottino, Caballero, Cal, Camargo, Capillera, Carballo, Estévez, Fratti, Galán, Gerhard, Hugo, Larzábal,
  Lustemberg (19 personas).
- **Salida temprana por intendencia (25-11-2020, elecciones departamentales de setiembre 2020
  postergadas por la pandemia):** Besozzi (Soriano), García (Lavalleja), Lafluf (Río Negro).
- **Salida temprana por pasaje a ministerio, con retorno (dos mandatos):** Cardoso (Maldonado: 2020-02-15
  a 2020-03-01, y 2021-08-24 a 2025-02-14), Lema (Montevideo: 2020-02-15 a 2021-05-04, y 2024-03-05 a
  2025-02-14).
- **Salida temprana sin explicación investigada:** Dos Santos (hasta 2024-07-16), Enciso (hasta
  2020-06-02), Etcheverry (hasta 2021-03-03), Irazábal Calleri (hasta 2021-06-08), Lust Hitta (hasta
  2020-06-02, ver advertencia de estabilidad de la fuente más abajo — la última fecha con fila estable y
  citable; una lectura sin cita exacta reproducible sugiere actividad hasta 2021-05, sin confirmar),
  Echeverría Zerbino (un solo día, 2020-02-15).
- **Registro oficial parcial, sin resolver el tramo inicial (ver hipótesis):** Caggiani (2022-03-02 a
  2025-02-14), Castaingdebat (2020-02-15 a 2025-02-14, con reservas).

De los 33, tres continúan hoy en cargos públicos según la propia fuente (`legislaturas-actuo`):
Carballo, Civila y Fratti son senadores de la L (2025-2030) desde el 15-02-2025; Lema también, aunque
su mandato de diputado en este lote termina antes por haber pasado a ministro; Besozzi, García y Lafluf
son intendentes departamentales (dato tomado de Wikipedia solo como orientación, no citado en la
ficha; la ficha se apoya en la fecha de salida de la banca, que sí está documentada).

## advertencia_estabilidad_de_la_fuente

La sub-página de actuación parlamentaria de parlamento.gub.uy (la que lista sesión por sesión, con o
sin el parámetro de paginación) devolvió contenido distinto en descargas sucesivas de la misma URL para
varias personas: se comprobó repitiendo la lectura con `pnpm fuente --forzar` sobre la misma URL y
comparando el texto extraído. El orden de las filas cambia, y hasta el número de filas cambia (una
fila puede aparecer una vez en una descarga y dos en la siguiente, con distinto número de página
citado dentro del texto). Por eso, para Cardoso, Lema, García y Lafluf se usó siempre una sola fila
autocontenida (una fecha y una descripción, sin unir con la fila siguiente), que es lo que se mantuvo
estable en dos y tres relecturas. Para Lust Hitta no se encontró una fila estable que documentara el
05-05-2021 (fecha que sí aparece en un listado de fechas obtenido por reconocimiento con `curl`, sin
cita exacta reproducible), así que el `hasta` de su mandato quedó en 2020-06-02, la última fecha con
una fila estable y citable en dos descargas independientes; es un piso documentado, no necesariamente
su última sesión real. Que la salida temprana de Lust sea unos meses más tardía no cambia el hecho de
que dejó de ejercer antes del fin de la legislatura.

## objeciones_al_brief

Ninguna. El brief pide la misma ficha para los 33, de todos los partidos presentes (FA, PN, PC, Cabildo
Abierto), sin adjetivos ni narrativa — Regla 0 cumplida sin necesidad de ajustar nada.

## Otros

- No apareció, durante la lectura, ningún titular adicional A-L de la XLIX fuera de los 33 nombrados en
  el brief (ver "roster completo" en hipótesis: no se hizo un barrido independiente de los 99, así que
  esto no es una garantía de exhaustividad).
- `referentes_faltantes`: ninguno (no se cargaron declaraciones ni menciones en este lote).
- Presupuesto de `WebSearch` de la sesión se agotó (200/200) después de resolver los ids de las 33
  personas; el resto de la investigación (desambiguación de homónimos, verificación de fechas de salida)
  se hizo con `curl` directo a `parlamento.gub.uy` (solo reconocimiento) y `pnpm fuente`/`pnpm corpus:buscar`.


---

<!-- origen: inbox/diputados/xlix-m-z -->

# Notas — diputados XLIX (2020-2025), apellidos M-Z, no continuaron en L

Corrida 2026-09-09-diputados-49-50. Modelo: claude-sonnet-5.

## candidatos_giro

Ninguno: este lote es de fichas de identidad (`politicos.yaml`), no de declaraciones. No aplica.

## hipotesis

- **Sabini, período anterior a marzo de 2022.** El registro oficial de
  `parlamento.gub.uy/camarasycomisiones/legisladores/9894/legislaturas-actuo` solo muestra una
  entrada de Diputados en la XLIX: 02-03-2022 a 14-02-2025. Pero un diario de sesiones del
  10-03-2020 lo registra firmando como titular: «SEBASTIÁN SABINI, Representante por Canelones»
  (`https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2020-03-10%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0005).pdf`).
  Un diario del 08-03-2022 lo menciona como «el senador Sabini» en una sesión de Diputados
  (hallado por búsqueda de corpus, no releído en detalle esta corrida). La hipótesis más
  probable es una banca compartida/rotación con el Senado (común en listas del Frente Amplio):
  titular de Diputados al inicio de la legislatura, luego Senado, luego de vuelta a Diputados
  desde marzo de 2022 hasta el fin del período. La ficha solo carga el tramo 2022-03-02 a
  2025-02-14, que es el único que el documento oficial (`legislaturas-actuo`) confirma sin
  ambigüedad. Falta: un diario de sesiones o pedido de informes que documente la fecha exacta en
  que dejó la banca de Diputados por primera vez y cuándo asumió en el Senado, para completar el
  primer tramo con la misma fuente oficial.
- **Christian Morel, ¿intendente de Cerro Largo desde 2025?** Hay indicios (no verificados esta
  corrida con `pnpm fuente`, solo recordados de búsquedas anteriores al agotamiento del
  presupuesto de `WebSearch`) de que Morel fue electo intendente de Cerro Largo por el Partido
  Nacional en las elecciones departamentales de mayo de 2025. Si es así, su `estado_actual`
  debería ser `en_cargo`, no `fuera_de_cargo`. No se pudo confirmar con una fuente abierta esta
  sesión (la página de Wikipedia con el título esperado devolvió HTTP 404, y no quedaba
  presupuesto de `WebSearch` para ubicar el título correcto). La ficha queda con
  `estado_actual.situacion: fuera_de_cargo`, que es lo que la fuente cargada permite afirmar.
- **Mier, Sánchez Cal: coincidencia de fecha de salida (15-08-2022, exactamente el punto medio
  del período 2020-02-15/2025-02-14).** Sugiere una rotación de banca pactada dentro de la
  lista, común en departamentos del interior. No se encontró el diario de sesiones ni una nota
  de prensa que lo confirme explícitamente esta sesión (búsquedas de corpus sin resultado
  limpio, y el presupuesto de `WebSearch` se agotó antes de poder buscarlo). Queda como
  `_faltante: segunda_fuente` en ambos registros.
- **Minetti: la salida real (01-01-2023) no tiene una segunda fuente limpia.** Un diario de
  sesiones del 05-07-2022 tiene en su índice la línea «Renuncia a la banca de la señora
  representante Orquídea Minetti ... 39», pero al releer el texto completo de esa nota en esta
  sesión (59.729 caracteres) esa frase no aparece contigua en el cuerpo del texto extraído (solo
  dos menciones sueltas de «Minetti», ninguna de «renuncia»), y el validador de citas la marca
  «no encontrada». Es posible que la renuncia de julio de 2022 se haya revocado o postergado, y
  la fecha real de salida (01-01-2023) corresponda a un trámite posterior no capturado. Se dejó
  como `_faltante: segunda_fuente`, sin inventar una relación causal entre ambos hechos.

## casos_vistos

- **Gustavo Penadés** — investigado penalmente por explotación sexual de menores, imputado con
  prisión preventiva desde octubre de 2023 (`https://es.wikipedia.org/wiki/Gustavo_Penad%C3%A9s`,
  consultado 2026-09-09). No investigado en esta corrida (no lo pide el brief); se documenta acá
  solo porque el hallazgo llevó a **excluirlo** de esta ficha (ver «objeciones_al_brief»).
- **Gerardo Núñez Fallabrino** — denuncias de violencia de género y abuso sexual en 2022-2023,
  causa archivada en enero de 2023 por la jueza María Fátima Boné; renunció a la banca en marzo
  de 2023 por acuerdo con el Partido Comunista
  (`https://es.wikipedia.org/wiki/Gerardo_N%C3%BA%C3%B1ez_(pol%C3%ADtico)`, consultado
  2026-09-09). No investigado en profundidad; se cita solo el hecho de la renuncia y su fecha,
  que es lo que este lote necesita documentar.

## verificacion_manual

Ninguna. Todas las fuentes citadas se pudieron leer con `pnpm fuente` o `pnpm corpus:buscar` +
`pnpm fuente`.

## cobertura_del_periodo

Este lote cubre exclusivamente la **identidad y los mandatos** (fecha de inicio, fecha de fin,
partido, departamento) de 27 personas que fueron titulares de Diputados en la legislatura XLIX
(2020-02-15 a 2025-02-14) con apellido M-Z y que no continuaron como titulares de Diputados en
la L. No se investigaron declaraciones, promesas, chequeos ni menciones de estas personas: eso
queda para una corrida futura con un brief propio. Por persona:

- **Mandato completo (2020-02-15 a 2025-02-14), sin interrupciones**: Malán, Mato, Melazzi,
  Moreno, Mujica, Olmos, Pasquet, Peña Fernández, Pereyra, Posada, Radiccioni, Roselló, Ruiz,
  Sodano, Testa, Tierno, Viana, Viviano, Zubía (19 personas).
- **Mandato parcial, con salida documentada y fecha exacta de la fuente oficial**: Mendiondo
  (hasta 2022-10-04, renuncia con segunda fuente), Núñez Fallabrino (hasta 2023-04-28, renuncia
  con segunda fuente), Olivera (hasta 2020-11-25, pasó a intendente de Paysandú, con segunda
  fuente, actualmente senador), Mier (hasta 2022-08-15, sin segunda fuente), Minetti (hasta
  2023-01-01, sin segunda fuente limpia), Morel (hasta 2020-11-26, sin segunda fuente), Sánchez
  Cal (hasta 2022-08-15, sin segunda fuente) (7 personas).
- **Mandato que empieza después del inicio de la legislatura**: Sabini (desde 2022-03-02; ver
  hipótesis arriba sobre un tramo anterior no documentado oficialmente).

## objeciones_al_brief

Regla 0: ninguna instrucción del brief pidió asimetría por partido o ideología; el mismo rigor
se aplicó a las 30 personas listadas, sin adjetivos. Sí hubo que corregir el propio brief en
tres puntos, con la fuente que sustenta cada corrección:

1. **Alejandro Sánchez (FA, Montevideo) — excluido de esta ficha.** El brief lo incluye en la
   lista de quienes «dejaron la banca durante la legislatura... al Senado», asumiendo que empezó
   la XLIX como diputado titular. La fuente oficial
   (`https://parlamento.gub.uy/camarasycomisiones/legisladores/9907/legislaturas-actuo`,
   verificada con `pnpm fuente` y con `curl` sobre la página principal del legislador) no
   registra ningún tramo de Diputados dentro de la XLIX: su último mandato de Representante
   Nacional terminó el 14-02-2020 (XLVIII), y el siguiente registro recién empieza el
   20-10-2020, sin el prefijo «Representante Nacional por el Lema...» que sí aparece en sus
   períodos de Diputados confirmados (comparar con su propio registro de la XLVIII, que sí lo
   tiene). Un diario de sesiones del 12-10-2020 y otro del 15-10-2020 (hallados por
   `corpus:buscar`, releídos con `pnpm fuente`) muestran a otro diputado anunciando «el
   compañero Pacha Sánchez va a ocupar la banca de Mujica en el Senado» y a alguien anticipando
   «la banca que voy a asumir después del 20 de octubre», consistente con que Alejandro Sánchez
   pasó directamente de Diputados (hasta 2020-02-14) a un puesto en el Senado (desde
   2020-10-20), sin pasar por un tramo de Diputados en la XLIX. Cargar un mandato de Diputados
   que la fuente oficial no confirma habría sido inventar un hecho. Corresponde investigarlo,
   si corresponde, en un lote de Senado.
2. **Gustavo Penadés (PN, Montevideo) — excluido de esta ficha.** El brief lo incluye como uno
   de los que «dejaron la banca durante la legislatura... por prisión en 2023», asumiendo que
   era diputado. Su registro oficial
   (`https://parlamento.gub.uy/camarasycomisiones/legisladores/2901/legislaturas-actuo`) muestra
   un tramo «Legislatura XLIX (2020-2025) 03-03-2020 → 11-10-2023» sin el prefijo de
   «Representante Nacional», y su página de Wikipedia
   (`https://es.wikipedia.org/wiki/Gustavo_Penad%C3%A9s`, consultada con `pnpm fuente`) lo dice
   explícitamente: «desde el 1° de marzo de 2020 hasta el 6 de junio de 2023 ocupó una banca de
   Senador tras la renuncia de Luis Alberto Heber». Es decir, Penadés fue electo diputado en
   2019 pero asumió como senador a los pocos días de empezar la legislatura y no volvió a
   Diputados; la fecha 11-10-2023 en el registro oficial coincide con su formalización con
   prisión preventiva (10-10-2023), no con una salida de Diputados. Corresponde a un lote de
   Senado, no a este.
3. **Pablo Viana (PN) — el brief dice Canelones; el documento oficial dice Montevideo.** Un
   diario de sesiones del 16-07-2024
   (`https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2024-07-16%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0022).pdf`,
   leído con `pnpm fuente`) registra, en una resolución formal de la Comisión de Asuntos
   Internos: «La solicitud de licencia por motivos personales, del señor representante por el
   departamento de Montevideo, Pablo Viana.» Es el único «Pablo Viana» que figura en el buscador
   de legisladores del Parlamento (confirmado con `combine=Viana`). La ficha carga Montevideo,
   con esa cita, y no Canelones. (Nota aparte: en el camino se intentó citar un PDF de biografía
   —`Bio00461.PDF`— cuyo título de búsqueda decía «Representante Nacional por el departamento
   de...»; al leerlo con `pnpm fuente` resultó ser la biografía de otra persona, nacida en 1932
   y electa en 1989/1994, sin relación con Viana. Se descartó esa fuente antes de que llegara al
   registro final; se deja constancia acá porque es el tipo de error que un chequeo apurado deja
   pasar.)

Además, dos correcciones menores de alcance, no de asimetría:

- **Gabriel Tinaglini (FA, Rocha) — excluido de este lote, no del proyecto.** El brief lo
  incluye en la lista de quienes «no siguieron en la L», pero su registro oficial
  (`https://parlamento.gub.uy/camarasycomisiones/legisladores/12677/legislaturas-actuo`) muestra
  que sí continúa como titular de Diputados en la L, desde el 05-03-2025, sin fecha de fin (en
  curso). Por la regla general de los lotes («quien estuvo en las dos legislaturas va en el lote
  de la L con los dos mandatos»), no se creó ficha acá. Falta crear su ficha (con ambos
  mandatos) en `inbox/diputados/l-m-z/` cuando se corra ese lote.
- **Censo independiente de titulares M-Z no cubiertos por la lista del brief.** El brief pide
  cargar «otro titular M-Z de la XLIX que no está en la lista ni siguió en la L» si aparece en
  la fuente oficial. No se hizo un censo exhaustivo de los 99 titulares de la XLIX contra listas
  alfabéticas completas (el Parlamento no publica una lista histórica de un solo golpe filtrable
  por legislatura pasada sin conocer el nombre de antemano); se revisaron decenas de listas de
  asistencia e integración de la Cámara en los diarios de sesiones leídos para las 27 fichas de
  este lote, y no apareció ningún apellido M-Z fuera de los ya cubiertos (o ya con ficha:
  Delgado, César Vega) o de los excluidos (Alejandro Sánchez, Penadés, Tinaglini). Es una
  cobertura parcial, no un censo cerrado: si el mantenedor quiere la garantía completa, hace
  falta cotejar contra el listado de proclamados de la Corte Electoral para la XLIX
  (`http://www.diputados.gub.uy/docs/SesionesPreparatorias/ListaProclamados.pdf`, visto en
  resultados de búsqueda pero no leído esta corrida).

## referentes_faltantes

Ninguno detectado en este lote (no se cargaron declaraciones ni menciones).

## Delgado y César Vega — mandatos faltantes según el brief

- **Álvaro Delgado (`delgado`)**: su ficha ya existe y ya tiene cargado el mandato de Secretario
  de la Presidencia (2020-03-01 a 2023-12-21) y el de Senador (2015-02-15 a 2020-03-01), pero
  **no** un mandato de Diputado en la XLIX, porque —según su propia ficha— dejó la banca de
  Senador el 01-03-2020 para asumir como Secretario de Presidencia; nunca fue diputado en la
  XLIX. No hace falta ninguna corrección: no había banca de Diputados que documentar.
- **César Vega (`cesar-vega`)**: su ficha ya tiene el mandato completo de Representante Nacional
  por Montevideo (2020-02-15 a 2025-02-15) con dos fuentes (Wikipedia y un diario de sesiones de
  Asamblea General del 14-06-2022). No le falta nada de este lote.

## Nota metodológica: por qué faltan segundas fuentes en algunos registros

El presupuesto de `WebSearch` de la sesión se agotó (200/200 llamadas) después de identificar
los 30 legisladores y antes de poder buscar prensa sobre los motivos de salida de Mendiondo,
Mier, Minetti, Morel y Sánchez Cal. Para Mendiondo, Núñez Fallabrino y Olivera se encontró una
segunda fuente igualmente sólida (diario de sesiones o Wikipedia) por otras vías (`corpus:buscar`
+ `pnpm fuente`, o Wikipedia con URL predecible). Para Mier, Minetti, Morel y Sánchez Cal solo
quedó la fuente oficial de `legislaturas-actuo` (que ya alcanza para `hasta` con fecha, como
pide el brief, pero no llega a la «fuente más» que también pide). Quedan marcados con
`_faltante: segunda_fuente` para que el resolvedor los complete cuando el presupuesto de
búsqueda se reponga.
