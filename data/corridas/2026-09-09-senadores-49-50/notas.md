<!-- origen: inbox/senadores/a-l -->

# Notas — senadores A-L, legislaturas XLIX y L

## Censo

**Fuente del censo: el diario de sesiones de la sesión preparatoria de cada legislatura**
(`biblioteca.parlamento.gub.uy/Publicaciones/sesionescss/…`), leído entero con `pnpm fuente`.
No usé la página de búsqueda de `parlamento.gub.uy` con `Cpo_Codigo=S`: el extractor de
`pnpm fuente` devuelve siempre el mismo texto genérico (870 caracteres, "Parlamentarios
Uruguayos 1830-2005…"), no la lista filtrada, ni con `Quienes=T` ni con `Quienes=I` ni variando
`combine`. Tampoco pude usar `pnpm inventario parlamento.gub.uy` (el CDX de Wayback devolvió
HTTP 504 dos veces seguidas). El diario de la sesión preparatoria es, de todos modos, la fuente
que pide el método del brief en primer lugar para la XLIX, y la usé también para la L porque el
mismo documento existe y es más fuerte que la nómina web (es `diario_de_sesiones`, con la
proclamación y el juramento uno por uno, texto que dice literalmente "queda usted investido del
cargo de senador de la república").

- **XLIX (2020-2025)**: 30 electos + la vicepresidenta que preside (Beatriz Argimón, ya tiene
  ficha). Los 30, por orden alfabético real (el diario los lista casi alfabéticamente, con
  Mujica corrido al final por ser quien presidía la sesión antes de la incorporación de
  Topolansky a la presidencia): Andrade, Asiaín, Bergara, Bianchi, Bonomi, Botana, Carrera,
  Cosse, Coutinho, Delgado, Della Ventura, Domenech, Gandini, García (Javier), Heber,
  Kechichian, Larrañaga, Lazo, Mahía, Manini Ríos, Moreira, Mujica, Olesker, Peña, Rodríguez,
  Rubio, Sanguinetti, Sartori, Talvi, Topolansky.
- **L (2025-2030)**: 30 electos + quien preside desde el 1/3/2025 (Carolina Cosse, VP, ya tiene
  ficha). El 15/2/2025 presidió la sesión preparatoria, de forma interina, el senador Alejandro
  Sánchez ("Presidente en ejercicio"), porque Cosse aún no había asumido como vicepresidenta
  (eso ocurre junto con la asunción presidencial, el 1/3/2025). Los 30 electos: Andrade,
  Bergara, Bianchi, Bordaberry, Botana, Caggiani, Camy, Carballo, Civila, Da Silva, Delgado,
  Díaz, Etcheverry, Fratti, García (Javier), Heber, Lazo, Lema, Lustemberg, Moreira, Nane,
  Ojeda, Olivera, Ortuño, Rodríguez (Blanca), Sabini, Silva (Robert), Viera (Tabaré), Zubía,
  Sánchez.

Este lote (`a-l`) cubre los apellidos A-L de ambas listas, más quienes asumieron la banca
titular por sucesión (fallecimiento o renuncia de un titular) dentro de ese rango de apellidos:
**Caggiani** (sucede a Bonomi †20/02/2022, asume 02/03/2022), **Camy** (sucede a Larrañaga
†22/05/2021, era su suplente desde marzo de 2020) y **Kechichian** (sucede a Bergara, que
renunció el 08/07/2025 para asumir la Intendencia de Montevideo).

**Total de fichas nuevas en este lote: 26.** Once corresponden a titulares que sirvieron (o
sirven) exclusivamente en la XLIX (Asiaín, Bonomi, Carrera, Coutinho, Della Ventura, Domenech,
Gandini, Larrañaga), tres a titulares que llegan a la L por sucesión sin haber sido de los 30
electos originales (Caggiani ya era titular por sucesión desde la XLIX; Camy ídem; Kechichian
ídem, contando su tramo de sucesión en la L), y el resto siguen en cargo en la L o llegan por
primera vez con la L (Andrade, Bergara, Bianchi, Botana, Camy, Carballo, Civila, Da Silva, Díaz,
Etcheverry, Fratti, García, Heber, Lazo, Lema, Lustemberg).

## Un caso investigado y descartado: Raúl Batlle

Investigué a Raúl Lorenzo Batlle Lamuraglia (Partido Colorado, "El Mono" Batlle, hijo de Jorge
Batlle), que aparece en el índice de asistencia con 109 sesiones en la XLIX porque asumió una
banca en agosto de 2021 después de que Tabaré Viera pasara a ser Ministro de Turismo. Lo dejé
afuera de este lote a propósito: en una entrevista él mismo dice que no hay una renuncia de
Viera y que lo suyo es "una suplencia larga" ("la banca sigue siendo de Tabaré Viera... él no
renunció a su banca"), fuente:
https://www.subrayado.com.uy/raul-lorenzo-batlle-asumio-la-banca-del-senado-la-oportunidad-le-cayo-como-un-baldazo-n788908.
Es exactamente la categoría que el brief excluye ("las suplencias salen después, mecánicamente").
Su legislaturas-actuo en parlamento.gub.uy, además, solo muestra un día (02-10-2024) para la
XLIX, sin línea de cargo: no hay ninguna fuente que lo llame titular.

## Fichas que ya existen en content/politicos/ y qué mandato les falta

- **astori.yaml**: ya documenta un mandato "Senador de la República, 2020-02-15 a 2022-11-14"
  con fuentes de Wikipedia y El Observador, tier probablemente publicado. Dos problemas para
  quien corrija: (1) la fecha de fin (14/11/2022) no coincide con la fecha de fallecimiento que
  el mismo registro da en `estado_actual.salida` (10/11/2023, un año después) — o el mandato
  terminó antes por otra razón (¿licencia declarada como fin?) o hay un error de un año en una
  de las dos fechas; (2) ninguna de las dos fuentes es de `parlamento.gub.uy` ni diario de
  sesiones, así que el registro no cumple el método más estricto que pide este brief (la línea
  "Senador de la República por el Lema… - Legislatura XLIX"). Astori no está en la lista de 30
  que juran el 15/2/2020 en el diario (ver censo arriba); asumió después, probablemente por
  incompatibilidad al seguir como Ministro de Economía hasta el traspaso de mando (1/3/2020):
  asistencia.md lo marca recién desde el 03/03/2020, con apenas 3 sesiones registradas a su
  nombre en cinco años. No alcancé a confirmar quién ocupó su banca los primeros días de
  la legislatura ni la fecha exacta de su fallecimiento/cese con una fuente oficial.
- **delgado.yaml**: falta el primer tramo de Senador de la XLIX. El diario de la sesión
  preparatoria del 15/2/2020 lo lista entre los 30 electos que juran ese día, pero renunció
  a los pocos días (antes del 1/3/2020) para asumir como Secretario de la Presidencia. La
  ficha actual salta directo de "Senador 2015-2020" a "Senador 2025-02-15 a 2025-08-05", sin
  este tramo breve. Fuente que confirma el hecho (sin fecha exacta del día):
  https://www.subrayado.com.uy/alvaro-delgado-renuncio-este-martes-al-senado-tener-total-dedicacion-como-presidente-del-partido-nacional-n984383
  ("ya había renunciado al Senado en febrero de 2020 para asumir la secretaría de la
  Presidencia"). El tramo 2025 que ya tiene la ficha (hasta 2025-08-05) coincide con lo que
  vi en el diario de la L y con el resto de la prensa.
- **argimon.yaml**, **bordaberry.yaml**, **cosse.yaml**: revisadas, sin huecos visibles para
  el período de este brief (Argimón como VP/presidenta del Senado XLIX; Bordaberry con
  "Senador 2010-2020" y "Senador 2025-02-15" sin hasta, coherente con no estar en la XLIX;
  Cosse con "Senadora 2020-02-15 a 2020-11-20" y luego VP desde 2025-03-01, coherente con no
  volver al Senado en la L).
- Ningún archivo `content/politicos/` corresponde a "Penadés", pese a que el brief de esta
  corrida lo da por existente (lista de ejemplos del punto 5 del método). Gustavo Penadés fue
  destituido de su banca por el Senado (mencionado de paso en una nota sobre la renuncia de
  Heber, ver `casos_vistos`); su apellido cae en el lote `m-z`, no en este. Lo señalo para que
  no se dé por hecho que ya tiene ficha.

## Ambigüedad sin resolver: "García" en el índice de asistencia

El índice de asistencia trae tres entradas separadas: "García" (56 sesiones, XLIX+L,
2020-02-15→2025-06-18), "García (Javier)" (10 sesiones, XLIX, 2024-04-04→2025-02-05) y "García
(Graciela)" (13 sesiones, XLIX, 2024-04-04→2025-02-05). Javier García (Partido Nacional) fue
Ministro de Defensa Nacional de 2020-03-01 a 2024-03-04 y volvió a la banca al dejar el
ministerio; armé su ficha con el mandato de Senador (XLIX completo y L en curso) sourceado en
el diario de sesiones. No investigué quién es "Graciela García" ni si la entrada de 56 sesiones
es enteramente de Javier García o mezcla ambas: lo dejo para quien haga la siguiente pasada.
Lo anoté como `alias_ambiguos` en la ficha de García.

## Advertencias que dejó `pnpm validar --red` (no bloquean, pero conviene que el editor las vea)

- En los mandatos de **Caggiani** (sucesión) y de **Asiaín**/**Coutinho** (cargo actual, L), la
  cita que usé para cerrar el mandato es la nota de El Observador sobre Bonomi/Caggiani, que
  dice "asumirá en marzo": documenta el anuncio, no el hecho consumado. No encontré, dentro del
  tiempo de esta corrida, un diario de sesiones que registre la incorporación formal de Caggiani
  el 02/03/2022 (sí tengo la fecha exacta por `legislaturas-actuo`, que la corrobora). Sirve
  como pista para un `resolvedor`.
- La cita de **Larrañaga** como Ministro del Interior ("cargo que desempeño… hasta hoy") es la
  nota necrológica del mismo día de su muerte: documenta que seguía en el cargo, no un cese
  administrativo separado (el cese es la muerte misma, así que lo tomé como válido, pero el
  validador lo señala por la palabra "actual/hasta hoy").
- La URL original del artículo de Montevideo Portal sobre Camy no respondió al validar (HTTP 0);
  se usó la copia de Wayback, ya archivada.
- Cinco citas del diario de sesiones (la misma cita larga de 30 nombres, repetida en varios
  registros) salieron "aproximada" (0.98-0.99) en vez de "exacta": son diferencias de espacios
  o saltos de línea al normalizar el PDF, no de contenido; la validación de citas terminó en
  0 errores.

## candidatos_giro

Ninguno: este lote no investiga declaraciones.

## hipotesis

- **Camy, transición de suplente a titular**: tengo la fecha de la muerte de Larrañaga
  (22/05/2021, fuente infobae) y una nota de prensa que dice que Camy "era el suplente… y
  asumió su banca" cuando Larrañaga pasó a ser ministro (eso fue en 2020, no en 2021). No
  encontré una fuente que diga explícitamente "Camy pasó a ser titular" el día de la muerte de
  Larrañaga; usé esa fecha por ser la lógica constitucional estándar (al morir un titular, el
  primer suplente pasa a titular) y porque `legislaturas-actuo` muestra una sola franja continua
  02020-03-03 a 2025-02-14 sin distinguir el cambio de estatus. Motivo por el que no llegó a
  `probable` con más certeza: no hay diario de sesiones de esa fecha revisado en esta corrida.
- **Heber, ¿fue Ministro del Interior 2021-2023?**: una nota sobre la renuncia de Carrera lo
  menciona de pasada ("Luis Alberto Heber, ministro del Interior entre 2021 y 2023"). No lo
  agregué como mandato porque no tengo fechas exactas ni una fuente centrada en el hecho.
- **Astori, fecha de fin de mandato vs. fecha de fallecimiento**: ver arriba, en la sección de
  fichas existentes.

## casos_vistos

- Charles Carrera: pedido de desafuero de la fiscal Silvia Porteiro por presunto abuso de
  funciones (atención irregular en el Hospital Policial a una víctima de bala perdida, caso de
  2012). Carrera renunció a la banca en vez de ampararse en los fueros. No investigué el caso en
  sí, solo until dónde hace falta para fechar la salida del Senado. Fuente:
  https://www.infobae.com/america/america-latina/2024/10/03/el-senado-uruguayo-acepto-la-renuncia-de-legislador-del-frente-amplio-investigado-por-abuso-de-funciones/
- Gustavo Penadés: mencionado de pasada en una nota sobre la renuncia de Heber ("Rodrigo Blás…
  ya suplió a Gustavo Penadés el período pasado tras ser destituido por el Senado luego que se
  conocieran los detalles de la investigación de Alicia Ghione por explotación sexual de
  menores"). No lo investigué: cae en el lote `m-z`. Fuente:
  https://www.ambito.com/uruguay/luis-alberto-heber-renuncia-su-banca-del-senado-luego-40-anos-el-parlamento-n6199250

## verificacion_manual

Ninguna URL quedó sin poder leerse por completo. Dos intentos de lectura fallaron y se
resolvieron con una fuente alternativa (ver `consultas.jsonl`): el artículo de Radio Montecarlo
sobre la renuncia de Bergara (error de extracción del HTML) y las citas del sitio
`ministerio-defensa-nacional` / `radiomontecarlo.com.uy` / `montevideo.gub.uy`, que sí se
leyeron pero cuyo `medio` no existe todavía en `content/medios/` (el validador lo señaló:
"Medio desconocido"). Como el investigador no puede tocar `content/`, en vez de crear esos tres
medios saqué esas citas del lote: los mandatos de "Ministro de Defensa Nacional" (Javier García
y Sandra Lazo) quedaron sin ese ítem adicional (su mandato de Senador no depende de eso), y el
mandato de "Intendente de Montevideo" y la fecha de salida del Senado de Bergara los recité con
un artículo equivalente de Montevideo Portal (`montevideo-portal`, medio que sí existe). Si se
quiere completar el dato del ministerio con la fuente oficial de gub.uy, hace falta que se cree
antes el medio `gub.uy` (o el que corresponda) en `content/medios/`.

## cobertura_del_periodo

- **XLIX (2020-02-15 a 2025-02-14), apellidos A-L**: cubierta completa. Los 12 titulares
  "de arranque" con apellido A-L (Andrade, Asiaín, Bergara, Bianchi, Bonomi, Botana, Carrera,
  Coutinho, Della Ventura, Domenech, Gandini, García, Heber, Kechichian, Larrañaga, Lazo) más
  las dos sucesiones que caen en este rango de apellido (Caggiani, Camy) tienen ficha. Cosse y
  Delgado, que también juraron ese día con apellido A-L, ya tenían ficha (con hueco anotado
  arriba para Delgado).
- **L (2025-02-15 en adelante), apellidos A-L**: cubierta completa a la fecha de esta corrida
  (09/09/2026) para quienes son titulares por elección propia (Andrade, Bergara, Bianchi,
  Botana, Camy, Carballo, Civila, Da Silva, Díaz, Etcheverry, Fratti, García, Heber, Lazo, Lema,
  Lustemberg) y por sucesión (Caggiani, Kechichian). Bordaberry, Cosse y Delgado, con apellido
  A-L, ya tenían ficha.
- No cubrí suplencias (fuera del alcance de esta corrida) ni el detalle de las comisiones,
  discursos o votaciones de cada senador: el brief pide solo identidad, partido y mandatos.

## referentes_faltantes

Ninguno: este lote no cita referentes.

## objeciones_al_brief

Ninguna. El método pedido (censo por diario de sesiones, línea de cargo obligatoria, ninguna
fecha por defecto) se aplicó igual para los 26 registros nuevos, de los cinco partidos
representados (Frente Amplio, Partido Nacional, Partido Colorado, Cabildo Abierto) sin excluir
ni suavizar ninguno.


---

<!-- origen: inbox/senadores/m-z -->

# Notas — senadores m-z (legislaturas XLIX y L)

## Censo

**Fuente primaria del censo: los diarios de la sesión preparatoria del Senado**, no la página de
búsqueda de legisladores ni la página de "Titulares" de `parlamento.gub.uy` (ver más abajo por qué).

- **XLIX (2020-2025)**: `https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescss/2020-02-15 -
  DIARIO DE SESIONES DE LA CAMARA DE SENADORES (0001).pdf`, 1.ª sesión ordinaria, 15/02/2020. Proclama
  30 senadores electos: Oscar Andrade, Carmen Asiaín, Mario Bergara, Graciela Bianchi, Eduardo Bonomi,
  Sergio Botana, Charles Carrera, Carolina Cosse, Germán Coutinho, Álvaro Delgado, Amanda Della
  Ventura, Guillermo Domenech, Jorge Gandini, Javier García, Luis Alberto Heber, Liliam Kechichian,
  Jorge Larrañaga, Sandra Lazo, José Carlos Mahía, Guido Manini Ríos, Irene Moreira, Daniel Olesker,
  Adrián Peña, Gloria Rodríguez, Enrique Rubio, Julio María Sanguinetti, Juan Sartori, Ernesto Talvi,
  Lucía Topolansky y José Mujica. De M a Z: 12 (Mahía, Manini Ríos, Moreira Irene, Mujica, Olesker,
  Peña, Rodríguez Gloria, Rubio, Sanguinetti, Sartori, Talvi, Topolansky).
- **L (2025- )**: `https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescss/2025-02-15 - DIARIO
  DE SESIONES DE LA CAMARA DE SENADORES (0001).pdf`, 1.ª sesión ordinaria, 15/02/2025. Proclama 30
  senadores electos: Oscar Andrade, Mario Bergara, Graciela Bianchi, Pedro Bordaberry, Sergio Botana,
  Daniel Caggiani, Carlos Camy, Felipe Carballo, Gonzalo Civila, Sebastián Da Silva, Álvaro Delgado,
  Bettiana Díaz, Lucía Etcheverry, Alfredo Fratti, Javier García, Luis Alberto Heber, Sandra Lazo,
  Martín Lema, Cristina Lustemberg, Constanza Moreira, Silvia Nane, Andrés Ojeda, Nicolás Olivera,
  Edgardo Ortuño, Blanca Rodríguez, Sebastián Sabini, Robert Silva, Tabaré Viera, Gustavo Zubía y
  Alejandro Sánchez. De M a Z: 11 (Moreira Constanza, Nane, Ojeda, Olivera, Ortuño, Rodríguez Blanca,
  Sabini, Silva Robert, Viera Tabaré, Zubía, Sánchez).
- La Vicepresidencia de la República (quien preside el Senado) queda fuera de este lote: Beatriz
  Argimón (XLIX) y Carolina Cosse (L) empiezan con A/C, lote a-l.

**Por qué no se usó la página de búsqueda ni "Titulares" como fuente citable**: la URL que da el
brief (`/sobreelparlamento/busquedalegisladores/lista?Cpo_Codigo=S&...`) devuelve, vía `pnpm fuente`,
un bloque genérico de 870 caracteres sobre "Parlamentarios Uruguayos (1830-2005)" sin relación con la
consulta — el filtro no se aplica del lado del servidor cuando se pide sin JavaScript, y ese mismo
contenido salió igual con `Ppsn_apenombre=Mahía`. La página
`/camarasycomisiones/senadores/plenario/integracion/titulares` sí lista los 31 titulares vigentes,
pero `pnpm fuente` sólo extrae "PARTIDO FRENTE AMPLIO" repetido 31 veces: los nombres están en un
marcado que la extracción de texto no captura (confirmado con `WebFetch`, que sí los ve, pero
`WebFetch` no es citable). Por eso el censo de este lote se apoya en los diarios de sesión, que sí se
leen bien con `pnpm fuente`, tal como preveía el brief como alternativa.

## Fichas nuevas de este lote (22)

**Titulares originales (18)**: Mahía, Moreira Irene, Olesker, Peña, Rodríguez Gloria, Rubio,
Sanguinetti, Sartori (XLIX); Moreira Constanza, Nane, Olivera, Ortuño, Rodríguez Blanca, Sabini, Silva
Robert, Viera Tabaré, Zubía, Sánchez Alejandro (L).

**Sucesores que quedaron como titulares por el resto del período (4)**: Niffouri (sucede a Delgado en
la XLIX, desde 01/03/2020), Nunes (sucede a Olesker en la XLIX, desde 06/12/2022), Viera Nicolás
(sucede a Sánchez en la L, desde 05/03/2025), Moreira Carlos (sucede a Olivera en la L, desde
15/07/2025). Viera Tabaré tiene dos mandatos: sucede a Sanguinetti en la XLIX (desde 20/10/2020) y es
titular original de la L.

## Personas con ficha existente en content/politicos/ — mandato de Senado faltante

- `manini-rios.yaml`: ya tiene el mandato de Senador XLIX (2020-02-15 a 2025-02-15) cargado por una
  corrida anterior. Sin cambios necesarios.
- `mujica.yaml`, `talvi.yaml`, `topolansky.yaml`: no se abrieron en esta corrida para verificar si
  tienen el mandato de Senador XLIX completo con la fecha exacta de salida (Mujica renunció el
  20/10/2020 junto con Sanguinetti, según `https://www.infobae.com/america/america-latina/2020/10/20/los-ex-presidentes-de-uruguay-julio-maria-sanguinetti-y-jose-mujica-renunciaron-al-senado/`,
  leída en esta corrida). Si falta esa fecha, es una corrección menor con esa misma fuente.
- `ojeda.yaml`: no se abrió para verificar si tiene el mandato de Senador L (desde 2025-02-15,
  proclamado en el diario citado arriba). Si falta, se agrega con esa fuente.
- `delgado.yaml`: ya tiene los dos mandatos de Senador (2015-2020 y 2025) con fechas de salida
  documentadas; no requiere cambios.

## Casos con `_faltante: segunda_fuente` (ver también cada registro)

- **Niffouri**: la fecha de ascenso (01/03/2020, sucediendo a Delgado) sale solo de su propia página
  oficial (fila sin la línea de cargo). No se halló una nota de prensa específica sobre su asunción en
  esta corrida; la coincidencia exacta con la renuncia de Delgado (documentada en `delgado.yaml`) es
  indicio fuerte pero no una segunda fuente independiente.
- **Olivera**: la fecha de salida (10/07/2025) sale de su página oficial (fila sin la línea de cargo);
  la nota de Montevideo Portal confirma el hecho (reelección como intendente de Paysandú, sucesión por
  Carlos Moreira) pero no cita esa fecha exacta.
- **Rodríguez, Blanca** y **Sabini**: sus páginas oficiales de `legislaturas-actuo` muestran filas con
  fechas que no encajan con el censo ni con la integración vigente (ver "Artefactos del sitio" abajo);
  el mandato se documentó solo con el censo del 15/02/2025, sin segunda fuente de que sigan en el
  cargo hoy. No se halló evidencia de renuncia o licencia para ninguno de los dos.

## Artefactos del sitio parlamento.gub.uy (`/legisladores/<id>/legislaturas-actuo`)

La tabla de legislaturas de cada persona no es homogénea: para algunos titulares de todo el período
(p. ej. Heber id 197, Bergara id 6664, Ortuño id 5221, Silva id 13602, Zubía id 3689, Moreira
Constanza id 9974) la fila trae la línea completa "Senador de la República por el Lema PARTIDO... -
Legislatura N"; para otros con la misma condición de titular pleno (Olesker id 3750, Peña id 11602,
Rubio id 560, Sanguinetti id 400, Rodríguez Gloria id 11582, Sartori id 12653, Moreira Irene id 12646,
Mahía id 2921) la fila del mismo tramo aparece pelada, sin esa línea, aunque el censo (diario de la
preparatoria) prueba que sí fueron proclamados titulares ese día. Es decir: la ausencia de la línea de
cargo en esta página **no siempre** distingue titular de suplente, al revés de lo que se esperaría por
el método del brief de diputados. Por eso, para el `desde` y el `cargo` de los 18 titulares originales
se usó siempre el diario de la sesión preparatoria (censo), no esta página; la página de legislaturas
se usó como apoyo para fechas de salida y para los casos donde sí trae la línea completa.

Dos casos van más allá de eso y parecen errores de datos del propio sitio, no solo falta de etiqueta:

- **Sabini (id 9894)**: la fila de la legislatura L muestra "16-10-2025 a 18-10-2025" (tres días), que
  no tiene relación con el censo (15/02/2025) ni con su presencia en la nómina de titulares vigente
  hoy (confirmada por `WebFetch`, no citable). Podría ser un tramo de licencia mal indexado.
- **Rodríguez, Blanca (id 13594)**: la fila de la legislatura L muestra "17-09-2026 a 26-09-2026",
  fechas posteriores a la fecha de esta corrida (09/09/2026). Es casi con certeza una licencia ya
  agendada mostrada con formato de tramo histórico, no una prueba de su mandato pasado.

En ambos casos el mandato se sostiene solo con el censo (documento_oficial), sin segunda fuente; por
eso llevan `_faltante: segunda_fuente`.

## Casos detectados pero no resueltos (posibles fichas M-Z adicionales)

El índice de asistencia (`asistencia.md`) muestra varios apellidos M-Z con decenas o cientos de
sesiones en la XLIX que **no están en el censo de los 30 originales**, señal de que sucedieron a un
titular A-L que dejó la banca en las primeras semanas del período. Se identificó con certeza a
**Niffouri** (sucesor de Delgado, en este lote). Quedan sin resolver, por falta de tiempo en esta
corrida:

- **"Meléndez" (Lauro Meléndez)**, 61 sesiones, 2020-06-09 → 2025-02-05. Aparece citado como senador
  en ejercicio en `https://www.montevideo.com.uy/Noticias/Del-legado-y-la-militancia-a-su-tono-de-voz-la-despedida-a-Enrique-Rubio-en-el-Senado-uc873076`
  (leída en esta corrida). El id de parlamento hallado por búsqueda (8463) no coincide con ese tramo
  de asistencia (solo muestra filas de un día); probablemente hay otro id o la ficha oficial no está
  bien indexada. Falta identificar a qué titular sucedió y desde cuándo exactamente.
- **"Russi" (Uruguay Russi Maine)**, 57 sesiones, 2020-12-09 → 2025-02-05, Frente Amplio. Ninguno de
  los dos ids hallados (7854, 12709) coincide con ese tramo. Falta identificar a quién sucedió.
- **"Saravia"**, 60 sesiones, 2020-07-08 → 2024-08-15. El id hallado (7766, Jorge Saravia) tiene una
  carrera en el Senado 2005-2015 que no coincide con el tramo 2020-2024; podría ser otra persona con
  el mismo apellido. Sin resolver.
- **"Straneo"**, 105 sesiones, 2020-08-18 → 2025-02-05. Confirmado por búsqueda web como suplente
  ocasional de Juan Sartori (que fue titular pleno toda la XLIX, documentado en este lote), no como
  sucesora permanente; por eso no se le abrió ficha.

Recomendación: una corrida de seguimiento debería resolver Meléndez, Russi y Saravia con el mismo
método (buscar en el diario de sesiones de la fecha de asistencia inicial la nota de incorporación,
que suele decir "e ingresa posteriormente el señor senador X" o similar).

## Casos vistos

Ninguno. No se investigaron casos judiciales en esta corrida (fuera del alcance del brief).

## Verificación manual

Ninguna URL quedó sin poder leerse por paywall, video o X. `radiomontecarlo.com.uy` (nota de la
renuncia de Bergara) devolvió texto vacío con `pnpm fuente` dos veces (incluso con `--forzar`); no se
usó como fuente, se reemplazó por una nota de Montevideo Portal sobre el mismo hecho.
`elobservador.com.uy` (nota de la renuncia de Heber) también devolvió texto vacío; se reemplazó por
la nota equivalente de Ámbito. Ninguna de las dos personas (Bergara, Heber) es parte de este lote.

## Cobertura del período

- XLIX (2020-02-15 a 2025-02-14), M-Z: cubiertos los 12 titulares originales y 2 sucesores permanentes
  (Niffouri, Nunes; Viera Tabaré y Sánchez Alejandro también suceden pero ya están contados como
  titulares L). Quedan 3 posibles sucesores sin resolver (Meléndez, Russi, Saravia).
- L (2025-02-15 a hoy), M-Z: cubiertos los 11 titulares originales y 2 sucesores permanentes (Viera
  Nicolás, Moreira Carlos). No se buscaron sucesiones posteriores a julio de 2025 más allá de las ya
  conocidas por el artículo de Montevideo Portal del 13/05/2025; una corrida de seguimiento debería
  revisar si hubo más cambios entre julio de 2025 y la fecha de esta corrida (09/09/2026), catorce
  meses sin revisar.
- No se investigó nada de gestión, declaraciones ni votos: solo identidad, partido y mandatos, como
  pide el brief.

## Objeciones al brief

Ninguna. El pedido es simétrico: la misma ficha, con el mismo método, para titulares de todos los
partidos (Frente Amplio, Partido Nacional, Partido Colorado, Cabildo Abierto) en ambas legislaturas.

## Candidatos a giro

No aplica: esta corrida no investiga declaraciones.

## Hipótesis

No aplica: esta corrida no investiga declaraciones ni califica nada; ver "Casos detectados pero no
resueltos" arriba para lo que quedó sin probar.


---

# Pasada de corrección (2026-09-09), respuesta a `critica.md`

Modelo: **claude-sonnet-5** (Sonnet). Corrida `2026-09-09-senadores-49-50`, pasada de corrección del
lote `inbox/senadores/todos/` sobre la crítica de Opus (682 líneas, 5 bloqueantes, 14 corregir, 10
avisos). Se corrigió `politicos.yaml` hasta dejar `pnpm validar --inbox inbox/senadores/todos --red`
en 0 errores. Todas las citas nuevas se leyeron con `pnpm fuente` en esta sesión (ver `consultas.jsonl`,
líneas del 2026-09-09 22:00 en adelante).

## Bloqueantes resueltos

- **mahia-jose-carlos**: partido el mandato de la XLIX en dos tramos. `Senador de la República
  (suplente de Danilo Astori)`, 2020-02-15 a 2022-11-14, con el diario del 14/04/2020 (licencia de
  Astori, convocatoria de Mahía) y la Actuación Parlamentaria oficial de Mahía (id 2921) filtrada
  2020-02-15/2020-03-15, que muestra «Titular: Astori, Danilo» durante todo el período. `Senador de la
  República` (titular), 2022-11-15 a 2025-02-14, con el diario del 15/11/2022 (renuncia definitiva de
  Astori, aceptada, Mahía ingresa como titular y renuncia por opción a su banca de Representante) y la
  misma Actuación Parlamentaria filtrada 2022-11-01/2024-12-31. Responde al bloqueante 1.
- **astori (content/politicos/astori.yaml, corrección pendiente, no se edita en este lote)**: se
  documenta abajo, en "Huecos para corrección de fichas existentes", el mandato de senador de la XLIX
  con la fuente oficial que lo prueba y la fecha real de cierre (15/11/2022, no 14/11/2022). Responde
  al bloqueante 2.
- **blas-rodrigo, falero-jose-luis, borbonet-daniel**: tres fichas nuevas. Blás sucede a Heber
  (14/10/2025, diario de esa sesión: «queda convocado el señor Rodrigo Blás, quien ya ha prestado la
  promesa de estilo»). Falero sucede a Delgado (05/08/2025, diario de esa sesión). Borbonet sucede a
  Nane (10/07/2025, fecha en que se efectivizó la renuncia de Nane según el diario del 08/07/2025, y
  fecha de inicio de su mandato de titular según su propia página oficial de legislaturas; no se halló
  en el corpus un diario de sesiones del propio 10/07/2025 que registre la ceremonia, por eso lleva
  `_faltante: segunda_fuente`). Responde al bloqueante 3.
- **moreira-irene**: un solo mandato de senadora 2020-02-15 a 2025-02-14 (antes partido en tres tramos),
  con el Ministerio de Vivienda y Ordenamiento Territorial como ítem aparte de `mandatos[]`. Responde al
  bloqueante 4.
- **pena-adrian**: mismo tratamiento, un solo mandato de senador 2020-02-15 a 2025-02-14, con el
  Ministerio de Ambiente aparte. Responde al bloqueante 5.

## Las 14 de corregir

- **nane-silvia**: se agregó como segunda fuente el diario de sesiones del 20/11/2020, que registra la
  renuncia de Carolina Cosse y la convocatoria «de manera permanente» de Nane el mismo día; ya no
  depende de una sola fila pelada.
- **botana-sergio, gandini-jorge, garcia-javier (XLIX), lazo-sandra**: se agregó el diario de la sesión
  preparatoria del 15/02/2025 como segunda fuente del cierre de la XLIX (14/02/2025), con `_nota`
  explicando que la página de legislaturas de estas cuatro personas (ids 7354, 260, 2965, 10008) muestra
  filas fragmentadas sin la línea de cargo —el mismo artefacto del sitio ya documentado para Sabini y
  Rodríguez Blanca—, así que no puede citarse como prueba directa de la fecha; queda `_faltante:
  segunda_fuente` donde corresponde.
- **bianchi-graciela**: se movió la cita de Subrayado (presidencia del Senado) a un `_nota`, se agregó
  el diario del 15/02/2025 como segunda fuente del tramo XLIX y se documentó por qué su página oficial
  tampoco sirve (mismo artefacto).
- **camy-carlos**: partido en dos tramos siguiendo la acción sugerida de la crítica: `Senador de la
  República (suplente de Jorge Larrañaga)` 2020-03-03 a 2021-05-21 (cita de Montevideo Portal, que
  documenta el hecho de 2020) y `Senador de la República` (titular) desde 2021-05-22 (día de la muerte
  de Larrañaga, con la misma nota de Infobae ya usada en `larranaga-jorge`).
- **civila-gonzalo, etcheverry-lucia, lustemberg-cristina**: se agregó el ítem de ministro que faltaba
  (Desarrollo Social, Transporte y Obras Públicas, Salud Pública respectivamente), con una segunda
  fuente que sí nombra la cartera (el artículo de gabinete de El Observador del 01/03/2025, más el MTOP
  oficial para Etcheverry y Montevideo Portal para Lustemberg). Igual para **mahia-jose-carlos** en la L
  (Ministro de Educación y Cultura) y **fratti-alfredo** (se corrigió además la fecha de 2025-03-01 a
  2025-03-02 para que coincida con su propia fuente, y se agregó el nombre de la cartera).
- **garcia-javier**: se agregó el ítem «Ministro de Defensa Nacional» (2020-03-02 a 2024-03-04) con la
  diaria del acto de asunción y el infobae de su salida; se actualizó `alias_ambiguos` con el hallazgo
  de que Graciela García es una suplente de Topolansky convocada el 08/07/2020 (diario de esa sesión,
  releído en esta sesión), no una segunda titular.
- **moreira-irene, pena-adrian, rodriguez-gloria, sartori-juan**: `estado_actual.salida.fuentes` ya no
  usa una fuente que no dice la fecha; se agregó el diario del 15/02/2025 (evidencia de ausencia de la
  proclamación de la L) con `_nota` explicando que el 14/02/2025 es el cierre constitucional de la
  legislatura y no una fecha que una fuente diga en palabras; se corrigió además el día en la cita de
  Sartori (Búsqueda dice «al 15 de febrero del 2025», un día después del campо).
- **rodriguez-gloria**: `_nota` documenta que es una suplente en ejercicio recurrente de la banca de
  Olivera/Carlos Moreira desde el 18/03/2025 (diario de esa sesión, con la cita del juramento), sin
  afirmar un mandato de titular nuevo; el padrón de suplencias es tarea de otra corrida.
- **bergara-mario / kechichian-liliam**: se corrigió `hasta` de Bergara de 2025-07-10 a 2025-07-08 (día
  de la renuncia, no de la asunción a la Intendencia) para no superponerse con el `desde: 2025-07-08` de
  Kechichian.
- **sanchez-alejandro**: se reemplazó la fuente que documentaba el anuncio (Montevideo Portal,
  27/11/2024) por el diario de sesiones del 05/03/2025, que registra literalmente la aceptación de la
  renuncia de Sánchez y el juramento de Nicolás Viera ese mismo día; se corrigió `hasta` a 2025-03-04.
  **viera-nicolas** recibió el mismo diario como fuente de su propio juramento, reemplazando una cita
  que no lo mencionaba.

## Los 10 avisos

- **olivera-nicolas, heber-luis-alberto**: sin cambios de fondo (la crítica los marca como uso aceptable
  de la fila pelada como apoyo de una fecha de salida); se agregó `cobertura`.
- **niffouri-amin**: sin cambios de fondo (`_faltante: segunda_fuente` ya estaba bien puesto); se agregó
  `cobertura`.
- **rodriguez-blanca**: sin cambios de fondo (no se encontró un diario de 2026 que la distinga de Gloria
  Rodríguez por nombre de pila); se agregó `cobertura`.
- **sabini-sebastian**: se reemplazó la cita de cinco palabras (Montevideo Portal, despedida de Rubio)
  por el diario del 11/03/2026, que sí lo registra en sala durante la L.
- **silva-robert**: se agregó `alias_ambiguos` documentando que las sesiones de 2020-2023 bajo «Silva»
  en el índice de asistencia podrían no ser suyas (no era senador en la XLIX).
- **garcia-javier (alias_ambiguos)**: resuelto arriba, junto con el ítem de ministro.
- **caggiani-daniel**: sin cambios de fondo (la crítica no objeta el tramo, solo aporta un dato de
  contexto ya reflejado en la ficha de Bonomi); se agregó `cobertura`.
- **larranaga-jorge**: sin objeción de fondo; se agregó `cobertura`.
- **veinte registros «sin objeción»** (andrade-oscar, coutinho-german, della-ventura-amanda,
  domenech-guillermo, kechichian-liliam, asiain-carmen, heber-luis-alberto, da-silva-sebastian,
  civila-gonzalo, etcheverry-lucia, lustemberg-cristina, moreira-constanza, ortuno-edgardo, silva-robert,
  viera-tabare, zubia-gustavo, camy-carlos, moreira-carlos, viera-nicolas, bonomi-eduardo,
  carrera-charles, olesker-daniel, rubio-enrique, sanguinetti-julio-maria, nunes-jose,
  bergara-mario/sanchez-alejandro en sus mandatos ejecutivos): se les agregó `cobertura` (faltaba en las
  48 fichas) y, a **carballo-felipe, diaz-bettiana, lema-martin** (mandato abierto con una sola fuente),
  se les agregó el diario del 11/03/2026 como segunda fuente de vigencia; el mismo diario resolvió
  también la vigencia de **sabini-sebastian**.

## Objeciones al lote (respuesta punto por punto)

1. **Censo por proclamación de la Corte Electoral**: se intentó (`pnpm inventario
   corteelectoral.gub.uy --filtro -i procla`, `pnpm corpus:buscar "proclamación senadores"`); no hay un
   acta de proclamación de senadores archivada en el corpus ni en Wayback bajo ese dominio. El censo se
   mantuvo apoyado en los diarios de sesiones (que sí distinguen titular de suplente cuando se leen con
   atención al verbo «renuncia definitiva» vs. «licencia»), corrigiendo el único caso donde eso no se
   había hecho (Mahía/Astori). No se encontró un segundo caso de la misma naturaleza en las 48 fichas.
2. **Vigencia de la L**: resuelto con el diario del 11/03/2026 para Carballo, Díaz, Lema, Sabini, y como
   `_nota` para Asiaín (aparece en sala sin que se haya podido documentar por qué) y confirmando que
   Gloria Rodríguez es suplente en ejercicio, no titular.
3. **Corte por letra partió sucesiones**: no se puede corregir retroactivamente sin refundir el lote;
   documentado como aprendizaje para la próxima corrida (ya lo señala la propia `critica.md`).
4. **Un mismo hecho, cuatro tratamientos**: unificado. Los diez casos (Larrañaga, García, Moreira, Peña,
   Civila, Etcheverry, Lustemberg, Lazo, Fratti, Mahía) usan ahora el mismo patrón: mandato de
   legislador continuo + ítem de ministro aparte.
5. **Suplente en ejercicio, Batlle vs. Penadés**: no resuelto en este lote (excede el alcance: exigiría
   decidir si Raúl Batlle entra con `cargo: Senador (suplente)`, lo que es tarea del editor o de una
   corrida de suplencias, no de esta pasada de corrección puntual sobre `critica.md`). Se deja como
   hipótesis para el editor.
6. **Los tres apellidos sin resolver**: no se investigaron en este lote (Meléndez, Russi, Saravia): la
   propia crítica ya los resolvió como suplentes por licencia, no sucesores, y no requieren ficha en
   esta corrida (ver sección nueva más abajo, para el padrón de suplentes).
7. **Simetría de trato**: se cumple; la corrección de Mahía/Astori (el único caso de asimetría señalado,
   ambos del FA) se aplicó con el mismo rigor que a cualquier otro partido, y las correcciones de
   ministerios tocaron por igual a Frente Amplio (Lazo, Civila, Etcheverry, Lustemberg, Fratti, Mahía) y
   Partido Nacional (García).
8. **Presentación**: `cargo` unificado a `Senador de la República` / `Senadora de la República` en las
   48 fichas (con `(suplente de X)` para los tramos no titulares); `nombre` completo con el segundo
   apellido donde estaba disponible en el propio lote (Camy Antognazza, Coutinho Rodríguez, Domenech
   Martínez, Civila López, Etcheverry Lima, Nane Vincon; Bergara Duque ya lo tenía) y con el hallado en
   esta sesión (Sartori Piñeyro); para el resto no se encontró un segundo apellido oficial en esta
   pasada (queda como hueco, ver abajo); `nombre_corto` unificado a nombre y apellido en los cuatro que
   llevaban solo el apellido (Mahía, Olesker, Sanguinetti, Sabini); `cobertura` agregada a las 48
   fichas existentes y a las 3 nuevas.

## Objeciones al brief (resueltas, no solo señaladas)

1. **Censo por diario de la preparatoria ≠ titular**: aplicado el criterio explícito de la propia
   crítica: quien juró ese día es titular salvo que un diario posterior lo desmienta con las palabras
   «suplente» o «convocado» junto a la fecha de una licencia; quien no juró ese día es titular igual si
   un diario lo dice con el cargo (caso Astori). No se propone cambiar el brief de las próximas
   corridas: esa decisión es del mantenedor.
2. **`cargo` en masculino genérico vs. documento oficial**: se resolvió a favor del documento oficial,
   `Senador de la República` / `Senadora de la República`, que es también la forma que ya usa
   `content/politicos/` (Astori, Delgado, Manini Ríos, Penadés). Es una desviación consciente de la
   letra del brief («masculino genérico, Senador»), justificada por Regla 0 (no corresponde imponer una
   forma que el propio documento oficial contradice) y por consistencia con lo ya publicado.
3. **`alias_ambiguos` vs. la adenda de diputados (retirar el alias compartido)**: se mantuvo
   `alias_ambiguos` (no se retiró ningún alias), porque es el criterio que el propio lote ya aplicaba
   para cinco personas (Moreira, Rodríguez, Viera, García, Sanguinetti) y cambiarlo a mitad de una
   pasada de corrección habría dejado la mitad del lote con un criterio y la mitad con otro. Queda para
   el editor decidir si unifica con la regla de diputados hacia adelante.

## Huecos para corrección de fichas existentes (no se editan en este lote)

- **astori.yaml**: el mandato de senador de la XLIX **existe y está mal fechado**. Documentado en esta
  sesión con dos fuentes primarias: el diario del 15/11/2022 («RENUNCIA DEFINITIVA DEL SEÑOR DANILO
  ASTORI A SU CARGO DE SENADOR DE LA REPÚBLICA... Léase la nota de renuncia... [Se lee]... Cr. Danilo
  Astori»; votada –24 en 24, afirmativa, unanimidad) y la Actuación Parlamentaria oficial de Mahía (id
  2921), que registra el mismo hecho como «ASTORI, DANILO. SENADOR REPUBLICA. RENUNCIA. NOTA. tomo 630
  pág. 30 d.s. 37» del 15-11-2022. La ficha publicada dice `hasta: 2022-11-14` con fuente de Wikipedia;
  la fecha real de renuncia definitiva es **2022-11-15**, no 2022-11-14 (un día de diferencia, y sin
  relación con la fecha de fallecimiento, 2023-11-10, que la ficha ya tiene bien). La fecha de inicio
  (`desde: 2020-02-15`) tampoco está probada: Astori no juró ese día (era Ministro de Economía hasta el
  01/03/2020); la Actuación Parlamentaria de Mahía muestra que Astori recién asume el 10/03/2020 («10-
  03-2020 Convocado a la Cámara de Senadores... Titular: Astori, Danilo tomo 604 pag.0 d.s.4»). Es una
  corrección de tipo `cotejo_con_primaria`.
- **delgado.yaml**: sigue igual que en la corrida anterior: falta el tramo breve de senador de la XLIX
  (15/02/2020 a 01/03/2020), y la ficha actual ya cierra el mandato 2015-2020 el 2020-03-01, así que la
  corrección tiene que decidir si abre un tramo nuevo de 15 días o mantiene el actual (que técnicamente
  ya cubre ese período dentro del mandato previo). No se resolvió en esta pasada.
- **mujica.yaml**: sigue sin ningún mandato de senador (ni XLIX ni anteriores). La fuente para la XLIX
  ya está en el lote (diario del 15/02/2020 + Infobae del 20/10/2020).
- **talvi.yaml**: el tramo ya existe («Senador de la República 2020-02-15 a 2020-03-01»); falta cotejarlo
  con el diario del 15/02/2020, que lo proclama, en vez de Wikipedia. Corrección de tipo
  `cotejo_con_primaria`, barata.
- **topolansky.yaml**: el tramo ya existe («Senadora de la República 2020-02-15 a 2022-03-01»); falta
  agregar que presidió la sesión preparatoria como Presidente ad hoc (diario del 15/02/2020: «PRESIDEN
  EL SEÑOR JOSÉ MUJICA Presidente en ejercicio y LA SEÑORA LUCÍA TOPOLANSKY Presidente ad hoc»), dato
  que la ficha no recoge.
- **ojeda.yaml**: sin hueco real (ya documentado con dos fuentes).

## Padrón de suplentes del Senado (para una corrida de suplencias, no para esta)

Los siguientes hallazgos de esta sesión y de la anterior quedan documentados para esa corrida futura,
no se cargó ficha de suplente para ninguno:

- **Lauro Meléndez** (FA): convocado el 09/06/2020 (diario de esa sesión), en la línea de suplentes del
  MPP, tras una cadena de desistimientos.
- **Uruguay Russi** (FA): convocado el 01/11/2022 (diario de esa sesión) como suplente de Silvia Nane;
  prestó la promesa el 09/12/2020 (diario del 09/12/2020).
- **Jorge Saravia**: prestó la promesa el 08/07/2020 (diario de esa sesión), en una sesión de licencias
  en cadena; es el mismo Jorge Saravia senador 2005-2015 (id 7766).
- **Graciela García** (FA): convocada el 08/07/2020 (diario de esa sesión) como suplente de Lucía
  Topolansky, tras una cadena de desistimientos (Sabini, Otheguy, Etcheverry, de León, Orsi, Caggiani,
  Barrera, Pereyra, Mutti, Frugoni, Garín).
- **Gloria Rodríguez** (PN, ya con ficha de titular XLIX en este lote): suplente en ejercicio recurrente
  de la banca de Olivera/Carlos Moreira en la L desde el 18/03/2025 (diario de esa sesión: «queda
  convocada la señora Gloria Rodríguez»), con convocatorias repetidas al menos hasta enero de 2026.
- **Daniel Borbonet** (FA, ya con ficha de titular L en este lote): antes de ser titular (10/07/2025),
  fue convocado como suplente en ejercicio por licencias temporales, documentado en el diario del
  18/06/2025.

## Verificación manual (nueva)

Ninguna URL quedó sin poder leerse en esta pasada, salvo:
- `https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescss/2025-07-10%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20SENADORES%20(0022).pdf`:
  HTTP 404 (no existe ese número de sesión en esa fecha); no se usó como fuente.
- `https://www.gub.uy/ministerio-salud-publica/comunicacion/noticias/cristina-lustemberg-es-nueva-ministra-salud-publica`
  y `https://www.gub.uy/ministerio-defensa-nacional/comunicacion/noticias/sandra-lazo-asumio-ministra-defensa-nacional`:
  se leyeron con `pnpm fuente` (no hubo error técnico) pero no se citaron porque el medio `gub.uy` no
  existe todavía en `content/medios/` (el investigador no puede crearlo); se reemplazaron por fuentes de
  prensa equivalentes (El Observador, Montevideo Portal).

## Referentes faltantes

Ninguno nuevo en esta pasada.

## Verificación de la red

`pnpm validar --inbox inbox/senadores/todos --red`: **0 errores**. 68 URLs verificadas (todas con HTTP
200), 87 citas verificadas (79 exactas, 8 aproximadas ≥0.91, todas por debajo del umbral de error 0.9
en similitud pero por encima como para no bloquear). Los avisos de "cita cierra con 'asumirá'/'el
próximo lunes'" son preexistentes (Bonomi/Caggiani, Heber/Blás, Sanguinetti/Viera, Sánchez/Mujica,
Olesker/Nunes, Nane/Borbonet) y ya estaban documentados como límite conocido en las notas de la corrida
original; no se resolvieron en esta pasada porque la crítica no los objetó por nombre y resolverlos
exigiría hallar el diario de sesiones de cada sucesión, que es trabajo de una corrida de suplencias.
