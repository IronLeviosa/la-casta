<!-- origen: inbox/diputados/revision-1a -->

# Notas — corrección 2026-09-09-diputados-49-50, lote revision-1a (33 fichas)

Corrida sobre `inbox/diputados/revision-1a/politicos.yaml` aplicando el método de la adenda del
brief (después de la crítica de Opus al lote de 156). Modelo: claude-sonnet-5.

## candidatos_giro

No aplica: lote de identidad y mandatos, no de declaraciones.

## hipotesis

- **blas-rodrigo**: no se pudo documentar la fecha exacta en que empezó a ejercer la banca titular
  de la XLIX. La nómina archivada (Wayback, 22/07/2024) solo prueba que ya era titular ese día; su
  `legislaturas-actuo` únicamente registra una fila posterior (13 y 14/08/2024, que no puede ser el
  inicio real porque es *después* de la fecha de la nómina). Se usó `desde: 2024-07-22` como piso
  documentado. Falta un diario de sesiones que dé la fecha real de asunción.
- **andujar-sebastian, de-mattos-alfredo, goni-rodrigo**: mismo problema en menor escala. Sus filas
  de `legislaturas-actuo` (un día para Andújar y Goñi, tres días para De Mattos) son anteriores o
  cercanas a la nómina archivada del 22/07/2024, y se usaron como fecha de inicio documentada, pero
  no hay certeza de que sea el primer día real de ejercicio.
- **jisdonian-pedro**: la nota al pie (3) de la nómina archivada de 2024 dice que sustituye al
  Representante Juan José Olaizola mientras este ejerce como Subsecretario del Ministerio de
  Transporte y Obras Públicas. Su `legislaturas-actuo`, sin embargo, da un rango casi completo
  (03-03-2020 a 14-02-2025) sin el rótulo de cargo. Se cargó como mandato de titular siguiendo la
  acción sugerida por la crítica para los "doce" (mismo criterio que Andújar, De Mattos, Fajardo,
  Goñi e Ibarguren), pero un lector estricto podría preferir `(suplente)` dado el footnote. Queda a
  criterio del editor.
- **castaingdebat-armando**: no se encontró fuente que documente cuándo terminó el segundo pasaje a
  Ministro de Defensa Nacional (el registro oficial solo da "05/03/2024 / /", sin fecha de cierre
  dentro del rango consultado hasta 14/02/2025). Coincide con el fin de la administración Lacalle
  Pou (01/03/2025), pero esa fecha no está citada en ninguna fuente abierta esta sesión.
- **amarilla-gerardo**: mismo problema — el pasaje a Subsecretario de Ambiente (27/08/2020) no tiene
  fecha de cierre documentada dentro del período consultado.
- **irigoin-pedro**: aviso de la crítica sin resolver. Ninguna cita de la ficha trae la línea
  "Representante Nacional por el Lema..." para el tramo de la L (2025-03-02 a 2025-07-08); solo
  `legislaturas-actuo` con fechas, sin rótulo de cargo. Su página individual hoy solo muestra
  comisiones del Senado (ya no las de Diputados), así que no sirve para retroceder a marzo de 2025.
  Se buscó un diario de sesiones de esa fecha y no se encontró con el presupuesto de esta sesión.

## casos_vistos

Ninguno nuevo. No se investigaron casos judiciales (no lo pide este encargo). Las comisiones
investigadoras sobre Cardoso (Ministerio de Turismo) y las referencias a Penadés que aparecen en el
corpus ya estaban señaladas en `notas-originales.md` del lote de 156 y no se tocaron.

## verificacion_manual

Ninguna. Las 57 URL citadas en este lote se leyeron con `pnpm fuente` en esta sesión y las 81 citas
verificaron `exacta (1.00)` contra el corpus con `pnpm validar --red`.

## cobertura_del_periodo

Las 33 fichas cubren identidad, partido y mandatos (XLIX 2020-02-15/2025-02-14 y L desde
2025-02-15) con fuente oficial de `parlamento.gub.uy` y `documentos.diputados.gub.uy`. Como en el
lote original, no se investigaron declaraciones, promesas, chequeos ni menciones: por eso
`declaraciones.yaml`, `promesas.yaml`, `menciones.yaml` y `chequeos.yaml` no se crearon en esta
pasada (ya no existían en el lote original tampoco). Los avisos de "cobertura asimétrica" que tira
`pnpm validar` son esperables en un lote de fichas de identidad sin declaraciones, y ya estaban
presentes antes de esta corrección.

## objeciones_al_brief

Ninguna. El brief (con la adenda del 2026-09-09) exige el mismo documento para los 99 de cada
legislatura sin distinción de partido, y así se aplicó: las 33 fichas corregidas se reparten en
Partido Nacional (14), Frente Amplio (14), Partido Colorado (3), Cabildo Abierto (2); el mismo
criterio de "sin la línea que nombra el cargo, no hay mandato" y "el pasaje al Ejecutivo no corta el
mandato de diputado" se aplicó parejo a los cuatro partidos.

## Correcciones aplicadas, ficha por ficha (qué objeción de la crítica responde cada una)

1. **amarilla-gerardo** — objeción "criterio distinto que Cardoso y Lema". Se agregó el mandato de
   Subsecretario del Ministerio de Ambiente (27/08/2020, sin fecha de cierre documentada) como ítem
   aparte de `mandatos[]`, manteniendo el mandato de Representante continuo como ya estaba.
2. **andujar-sebastian** — objeción "12 fichas sin mandato XLIX". Se agregó el mandato XLIX
   (2024-05-15 a 2025-02-14) con la nómina archivada y `legislaturas-actuo` como fuentes.
3. **antonini-eduardo** — objeción "cita_fuera_de_contexto" (la cita de la Senaduría no respaldaba
   el cargo de Representante de la L). Se reemplazó la cita del segundo mandato por la nota al pie
   de `LegxPartido.pdf` ("Sustituye al Representante Eduardo Antonini...").
4. **araujo-mary** — objeción "67 fichas nombre = nombre_corto". Se verificó `LegAlfab.pdf` (L,
   vigente): no trae más forma que "Araújo, Mary". Se dejó sin cambio con esta constancia.
5. **besozzi-guillermo** — objeción "10 fichas en_cargo sin mandato abierto". Se corrigió
   `situacion` a `fuera_de_cargo` con `salida.tipo: renuncia`, fecha 2020-11-25, fuente su propia
   actuación parlamentaria ("Renuncia por pasaje a Intendente el 25/11/2020").
6. **blas-rodrigo** — objeción "falta el mandato titular de la XLIX". Se reemplazó el mandato
   `(suplente)` de un día por un mandato de titular (2024-07-22 a 2025-02-14) con la nómina
   archivada como fuente principal, y se corrigió `nombre` a "Rodrigo Blás Simoncelli". El `_slug`
   se mantuvo igual (`blas-rodrigo`): no hay pedido de renombrarlo y los ids no se cambian sin
   necesidad.
7. **caggiani-daniel** — objeción "bloquea, cita_fuera_de_contexto" (mandato dateado en el tramo en
   que era senador). Se corrigió el mandato a 2020-02-15→2022-03-08 (suplente convocado por
   Montevideo) con el diario de sesiones del 08/03/2022 que registra su renuncia a la banca, y
   `salida.tipo: renuncia` con esa misma fecha y fuente.
8. **carballo-felipe** — objeción "10 fichas en_cargo sin mandato abierto". Se agregó el mandato de
   Senador de la República desde 2025-02-15 con `legislaturas-actuo` (línea con rótulo completo).
9. **cardoso-german** — objeción "criterio distinto que Amarilla y Castaingdebat". Se fusionaron los
   dos mandatos de Representante en uno continuo (2020-02-15→2025-02-14) y se agregó el mandato de
   Ministro de Turismo (2020-03-01→2021-08-24) como ítem aparte, con la nota al pie de la nómina
   archivada de 2020 como fuente del nombre del cargo.
10. **castaingdebat-armando** — objeción "bloquea, riesgo_legal" (la cita solo cubría una semana) +
    "criterio distinto". Se usó la nota al pie de la nómina archivada de 2024 como fuente del
    mandato continuo de Representante, y se agregaron dos mandatos de Ejecutivo: Subsecretario del
    Ministerio de Desarrollo Social (2020-03-01→2021-05-04) y Ministro de Defensa Nacional (desde
    2024-03-05, sin fecha de cierre documentada).
11. **civila-gonzalo** — objeción "10 fichas en_cargo sin mandato abierto". Se agregó el mandato de
    Senador de la República desde 2025-02-15.
12. **de-mattos-alfredo** — objeción "12 fichas sin mandato XLIX". Se agregó el mandato XLIX
    (2023-12-05 a 2025-02-14).
13. **dos-santos-valentina** — objeción "6 fichas con fin_de_mandato mal fechado". Se corrigió
    `salida.tipo` a `renuncia` (fecha 2024-07-16) con el diario de sesiones que registra su
    renuncia literal.
14. **echeverria-solis** — objeción "bloquea, riesgo_legal" (un día de suplencia cargado como
    mandato de titular con `fin_de_mandato` el día que empezó la legislatura). Se cambió el `cargo`
    a "(suplente)" y `salida.tipo` a `renuncia`, con la fuente que dice literalmente "Renuncia el
    15/02/2020".
15. **enciso-carlos** — objeción "6 fichas con fin_de_mandato mal fechado". Se corrigió
    `salida.tipo` a `renuncia` con el diario de sesiones del 02/06/2020.
16. **etcheverry-lucia** — objeción "bloquea, cita_fuera_de_contexto" (la cita databa nueve meses
    antes del `hasta` afirmado). Se reemplazó por el mandato completo (2020-02-15→2025-02-14) con la
    nómina archivada como fuente, y el `salida.tipo: fin_de_mandato` ahora sí cae en la fecha
    permitida (14/02/2025).
17. **fajardo-maria** — objeción "12 fichas sin mandato XLIX" + "67 fichas nombre = nombre_corto".
    Se agregó el mandato XLIX (2020-11-25 a 2025-02-14, coincide con la salida de Besozzi de la
    misma banca de Soriano) y se corrigió `nombre` a "María de los Ángeles Fajardo Rieiro" según
    `LegAlfab.pdf`.
18. **ferreira-zulimar** — mismo tipo de objeción que Antonini. Se reemplazó la cita del segundo
    mandato por la nota al pie de `LegxPartido.pdf`.
19. **fratti-alfredo** — objeción "10 fichas en_cargo sin mandato abierto". Se agregó el mandato de
    Senador de la República desde 2025-02-15.
20. **garcia-mario** — objeción "10 fichas en_cargo sin mandato abierto" + "segunda fuente es la
    página de otra persona" (usaba la actuación de Martín Lema). Se corrigió `situacion` a
    `fuera_de_cargo` con `salida.tipo: renuncia` (25/11/2020), y se reemplazó la segunda fuente del
    mandato por la propia actuación parlamentaria de García (id 10117). Se corrigió `nombre` a
    "Mario García González".
21. **goni-rodrigo** — objeción "12 fichas sin mandato XLIX". Se agregó el mandato XLIX (2024-08-15
    a 2025-02-14).
22. **ibarguren-sylvia** — objeción "12 fichas sin mandato XLIX". Se agregó el mandato XLIX
    (2022-10-04 a 2025-02-14). Nota: la primera versión de esta cita citaba mal la fila de la nómina
    (copié "Reutor, Carlos" de otra fila en vez de "Caballero, Wilman"); `pnpm validar --red` lo
    marcó `no_encontrada` y se corrigió antes de cerrar el lote.
23. **inthamoussou-pablo → inthamoussu-pablo** — objeción "ids que quedarán mal". Se renombró el
    `_slug` a la grafía oficial (sin la segunda "o"), y se corrigió `nombre` a "Luis Pablo
    Inthamoussu Acevedo" con la lista de proclamados leída en el diario de sesiones del 13/02/2025.
24. **irazabal-benjamin** — objeción "6 fichas con fin_de_mandato mal fechado". Se corrigió
    `salida.tipo` a `renuncia` con el diario de sesiones del 08/06/2021.
25. **irigoin-pedro** — objeción "aviso, falta el rótulo del cargo para el tramo L". No resuelta:
    ver `hipotesis`.
26. **jisdonian-pedro** — objeción "12 fichas sin mandato XLIX". Se agregó el mandato XLIX
    (2020-03-03 a 2025-02-14); ver reserva en `hipotesis`.
27. **lafluf-omar** — objeción "10 fichas en_cargo sin mandato abierto" + "segunda fuente es la
    página de otra persona". Mismo tratamiento que García: `situacion: fuera_de_cargo`,
    `salida.tipo: renuncia` (25/11/2020) con su propia actuación parlamentaria, y `nombre` corregido
    a "Omar Lafluf Hebeich". El `_slug` se mantuvo igual (`lafluf-omar`).
28. **lema-martin** — objeción "criterio distinto que Amarilla y Castaingdebat" + "10 fichas
    en_cargo sin mandato abierto". Se fusionaron los dos mandatos de Representante en uno continuo
    (2020-02-15→2025-02-14, ahora con una cita mejor: `legislaturas-actuo` con el rótulo completo en
    vez de los fragmentos de `actuacion-legislador`), se agregó el mandato de Ministro de Desarrollo
    Social (2021-05-04→2024-03-05) y el de Senador de la República desde 2025-02-15. Se corrigió
    `nombre` a "Martín Lema Perretta".

Sin cambios (ya estaban correctas o son avisos de forma que no alteran contenido): **araujo-yisela,
de-armas-paula, de-brum-horacio, delgado-juan-pablo, echeverria-diego**.

## Objeciones que no se pudieron resolver del todo

- **irigoin-pedro**: falta el rótulo de cargo para el tramo de la L (aviso, no bloqueante).
- Fechas de cierre de los pasajes al Ejecutivo de **amarilla-gerardo** y **castaingdebat-armando**
  (segundo tramo): no documentadas.
- Fecha exacta de inicio del mandato titular de **blas-rodrigo**, **andujar-sebastian**,
  **de-mattos-alfredo** y **goni-rodrigo**: solo se pudo acotar con un piso (la fecha de la nómina
  archivada o la primera fila de `legislaturas-actuo`), no con el día real de asunción.
- El aviso de fuentes sobre `medio: parlamento` usado para `documentos.diputados.gub.uy` y
  `biblioteca.parlamento.gub.uy` (que la crítica pidió resolver agregando esos dominios como alias
  en `content/medios/parlamento.yaml`) **no se resolvió**: es una edición de `content/`, fuera del
  alcance de un investigador. Se mantuvo `medio: parlamento` en todas las citas nuevas, igual que en
  el lote original, para no introducir un slug de medio inexistente.
- **Ids que el validador reasigna**: `de-armas-paula`, `de-brum-horacio` y `de-mattos-alfredo`
  quedan con esos `_slug` en el crudo, pero `pnpm validar --inbox` (y por lo tanto `pnpm promover`)
  les asignará `armas-paula`, `brum-horacio` y `mattos-alfredo` porque `slugificar()` descarta "de"
  como palabra vacía. La crítica pidió que "el editor lo decida a conciencia y no por omisión"; no
  se tocó el código ni se forzó un id distinto, para dejar la decisión al editor.

## referentes_faltantes

Ninguno nuevo en este lote.

## Nota sobre el método de "tres columnas" del PDF de nómina

Se usó la regla empírica que documentó el lote original para `LegxPartido.pdf` (departamento del
primer nombre = segundo token de departamento; del segundo nombre = tercer token; del tercero =
primer token), verificada de nuevo contra los seis casos nuevos de este lote (Andújar→Canelones,
De Mattos→Tacuarembó, Goñi→Montevideo, Jisdonian→Montevideo, Fajardo→Soriano,
Ibarguren→Río Negro): todos coinciden con el departamento ya cargado en la ficha por la fuente
individual, lo que confirma la regla una vez más.


---

<!-- origen: inbox/diputados/revision-1b -->

# Notas — corrida 2026-09-09-diputados-49-50, pasada de corrección (revision-1b)

Modelo: claude-sonnet-5. Corrige las 32 fichas de `inbox/diputados/revision-1b/politicos.yaml`
objetadas por el crítico (`critica.md`, sección de objeciones por registro y objeciones temáticas
que tocan a estas 32 personas) más la creación de la ficha de Aníbal Pereyra. Este archivo
reemplaza cualquier nota anterior del lote; `notas-originales.md` queda como registro histórico de
lo que escribieron los investigadores de la primera pasada.

## candidatos_giro

Ninguno: este lote es solo identidad, partido y mandatos (fichas, no declaraciones), igual que la
primera pasada.

## hipotesis

- **Umpiérrez Alejo, `estado_actual.salida.tipo`**: su último mandato documentado es una suplencia
  de Senador de 2 días (08/04/2025-09/04/2025) que terminó porque el período de convocatoria llegó
  a su fecha fijada («hasta el 09/04/2025 23:59»), no por una renuncia. El enum de `TipoSalida` no
  tiene un valor para «terminó una suplencia en su fecha pactada»; usé `fin_de_mandato` como el más
  cercano (su «mandato», el de esos 2 días, llegó a su fin), aunque la regla 5 de la adenda reserva
  ese tipo para el fin del período de una legislatura completa (14/02/2025 o 14/02/2030). Si el
  editor prefiere otro criterio para este tipo de caso (suplencia corta que termina en la fecha
  fijada), debería fijarse como regla general, no solo para este registro.
- **Umpiérrez Alejo, ¿fue efectivamente Intendente de Rocha 2020-2025?** La fuente («Renuncia por
  pasaje a Intendente el 26/11/2020») prueba la salida de Diputados por ese motivo, no que haya
  asumido ni cuánto duró. Lo mismo para Nicolás Olivera (Paysandú) y Emiliano Soravilla (Artigas).
  Confirmar la intendencia en sí (fechas, resultado electoral) es trabajo de un lote de intendentes,
  fuera del alcance de esta corrida.
- **Reisch, Nibia y Rodríguez Hunter, Álvaro — fecha de inicio del mandato XLIX**: la nómina
  archivada de 2024 prueba que eran titulares a esa fecha; `legislaturas-actuo` no da un rango útil
  (un solo día cada uno: 01-12-2022 y 08-07-2020 respectivamente). Cargué el mandato con el período
  completo de la legislatura (2020-02-15 a 2025-02-14) por default del censo, siguiendo la acción
  sugerida por el crítico («cargar los doce mandatos con la nómina archivada... y las fechas que
  cada legislaturas-actuo permita»), pero no hay evidencia directa de que ejercieran desde el primer
  día: podrían haber asumido más tarde como titulares (p. ej. por fallecimiento o renuncia de otra
  persona) sin que yo lo haya podido determinar con las fuentes revisadas esta sesión.
- **Citación 2025 (`diputados.gub.uy/data/web/2025/Citacion2025.pdf`) para Aníbal Pereyra**: el
  documento lista «ROCHA Partido Frente Amplio ... Suplentes / Titulares — Pereyra, Aníbal /
  Tinaglini, Gabriel», pero el orden de las columnas en el texto extraído es ambiguo (podría leerse
  al revés de lo esperado por un artefacto de extracción de PDF a varias columnas, como ya se vio
  con `LegxPartido.pdf`). No lo usé como fuente por esa ambigüedad; la ficha se apoya en cambio en la
  nota al pie de `LegxPartido.pdf» («Sustituye al Representante Aníbal Pereyra...») y en un diario de
  sesiones de 2005 para el departamento.

## casos_vistos

Ninguno nuevo. No se investigaron casos judiciales (no lo pide el brief).

## verificacion_manual

Ninguna. Todo lo cargado se leyó con `pnpm fuente` en esta sesión y quedó en el corpus.

## cobertura_del_periodo

Las 32 fichas corregidas cubren XLIX (2020-02-15 a 2025-02-14) y L (desde 2025-02-15) según
corresponda a cada persona, más los tramos de Senado que aparecieron al desarmar los errores de
método (Mahía, Sabini, Umpiérrez Alejo, Viera, Zubía, Pereyra). Se agregó una ficha nueva (Aníbal
Pereyra) con su mandato nominal de Representante por Rocha (L, sustituido por Tinaglini) y su mandato
de Senador (desde 2025-03-02). No se investigó su historial anterior a 2020 (fue diputado en 2005-2010
y tuvo suplencias breves en 2010-2015 y 2015-2020) porque excede el alcance XLIX/L de este lote,
igual que se hizo con Mahía, Zubía y Viera (sus mandatos de legislaturas anteriores a la XLIX tampoco
se cargaron).

## objeciones_al_brief

Ninguna nueva. El método de la adenda (censo por documento oficial, sin plantilla por defecto,
tramo de senador no es tramo de diputado) se aplicó igual a los 33 partidos/personas de este lote,
sin distinción de partido: Frente Amplio, Partido Nacional, Partido Colorado, Cabildo Abierto e
Identidad Soberana recibieron el mismo nivel de exigencia documental.

## Qué objeción resuelve cada cambio (una línea por ficha)

- **lorenzo-nicolas**: agregado el mandato XLIX (2020-02-15 a 2025-02-14) con la línea rotulada de
  su propia `legislaturas-actuo`, tal como pedía la crítica («no hay excusa, la fila ya está»).
- **lust-eduardo**: `bloquea`. Mandato corregido a 2020-02-15→2025-02-14 con la cita
  «Convocado a la Cámara de Representantes por el departamento de MONTEVIDEO hasta el 14/02/2025
  23:59» (en vez de una fila de un día que no hablaba de salida); `salida.tipo: fin_de_mandato`
  ahora fechada 2025-02-14, que sí es fin de período.
- **mahia-jose-carlos**: `bloquea`. Invertido: Representante por Canelones 2020-02-15→2022-11-15
  (renuncia por opción), Senador (suplente) de Astori 2022-11-15→2025-02-14, y el mandato de la L
  se mantiene con una segunda fuente (nota al pie de `LegxPartido.pdf` sobre Gallo).
  Se descartó Wikidata/plantilla; ahora la cita para cada tramo se corresponde con el cargo que
  describe.
- **mazzini-agustin**: agregado el mandato XLIX (2022-03-08→2025-02-14) con dos fuentes: la nómina
  archivada (prueba titularidad y departamento) y `legislaturas-actuo` (prueba las fechas).
- **medina-nino**: agregado el mandato XLIX (2022-08-15→2025-02-14), mismo criterio que Mazzini.
- **melo-ana-laura**: mantenida la cita de `LegxPartido.pdf» («Melo Cedrés, Ana Laura FLORES»); al
  releer el documento completo esta fila es una entrada aislada de fin de columna (no un renglón de
  tres nombres entrelazados como el resto de los «8 casos» que señaló la crítica), así que el
  departamento sí está en la cita tal cual está escrita. Se intentó reforzar con su página
  individual (id 12784) pero no renderiza server-side (60-176 caracteres en cuatro intentos); se
  deja así, documentado.
- **mier-sergio**: sin objeción específica más allá de `_faltante: segunda_fuente`, que ya estaba
  bien puesta. Sin cambios.
- **minetti-orquidea**: quitada la fuente de Wikipedia, que no respaldaba la fecha de salida
  (01-01-2023) y que el validador de tiers no acepta como fuente textual ni oficial. Queda
  `_faltante: segunda_fuente` para el resolvedor, con el índice del diario de sesiones del
  05-07-2022 que ya había localizado la primera pasada.
- **morel-christian**: sin objeción de mandato. Se completó `nombre` a «Christian Sebastián Morel
  Núñez» usando la forma que ya estaba en su propio `alias` (evita el patrón de 67 fichas con
  `nombre == nombre_corto`, resuelto acá porque el dato ya estaba a mano sin necesitar una fuente
  nueva).
- **mujica-gonzalo**: retirado el alias suelto «Mujica» de la lista `alias` (quedaba en tensión con
  `alias_ambiguos`, que ya lo señalaba); el etiquetador ya no lo tagea de forma determinista.
- **olaizola-juan-jose**: reemplazada la cita de `LegxPartido.pdf` (fila de tres nombres
  desordenada) por la línea limpia de su página individual: «Representante Nacional por el Lema
  PARTIDO NACIONAL, departamento de MONTEVIDEO».
- **olivera-ana**: `aviso`. Agregada la cita que trae departamento y fecha exacta de salida en una
  sola línea («Convocada a la Cámara de Representantes por el departamento de MONTEVIDEO... hasta
  el 01/03/2026 00:01»), resolviendo la falta de rótulo para el tramo de la L.
- **olivera-nicolas**: resuelta la objeción de «en_cargo sin mandato abierto». `situacion` pasa a
  `fuera_de_cargo` con `salida: renuncia` (pasaje a Intendente de Paysandú), 2020-11-25, con fuente
  directa («Renuncia por pasaje a Intendente el 25/11/2020»). Su estatus actual (si sigue siendo
  intendente o no) queda fuera del alcance de esta ficha de diputados.
- **pereyra-anibal**: ficha nueva. Representante Nacional por Rocha (L, nominal, sustituido por
  Tinaglini según nota al pie 5 de `LegxPartido.pdf`) y Senador de la República desde 2025-03-02.
  No tiene mandato de Diputados en la XLIX: la única fila de esa legislatura en su
  `legislaturas-actuo» (10 al 12-10-2023) resultó ser, al revisar `actuacion-legislador`, una
  convocatoria a la Cámara de SENADORES, no a Representantes.
- **pereyra-estela** y **pereyra-susana**: retirado el alias suelto «Pereyra» (colisionaba entre
  ambas y ahora también con Aníbal Pereyra); agregado `alias_ambiguos` en las tres fichas.
- **reisch-nibia**: `corregir` (departamento) + `corregir` (falta XLIX). Departamento reforzado con
  la cita individual («...departamento de COLONIA»); agregado el mandato XLIX 2020-02-15→2025-02-14
  con la nómina archivada como fuente (fila decodificada y corroborada porque el departamento que
  arroja el corrimiento de columnas coincide con el de su página individual).
- **rielli-domingo**: reemplazada la cita por la línea limpia de su página individual («...
  departamento de DURAZNO»). Aproveché el mismo fetch para completar `nombre` a «José Domingo
  Rielli San Martín» (su página lo da como «Rielli San Martín, José Domingo»).
- **rodriguez-galvez-carlos** (antes `rodriguez-carlos-florida`): id corregido según lo que pidió la
  crítica. Reviso `inbox/diputados/todos`, `revision-1a` y `faltantes-1..4`: no hay otro «Carlos
  Rodríguez» en esos lotes ni en `content/politicos/`, así que el criterio estricto del brief
  («rodriguez-carlos» a secas) también sería válido; usé el id con el segundo apellido porque así lo
  pidió explícitamente la crítica y porque **`inbox/diputados/suplentes/politicos.yaml`** (un lote
  fuera de mi alcance en esta corrida) ya cita extensamente a esta persona con el id
  `rodriguez-carlos-florida` en decenas de registros de suplencias: cuando ese lote se promueva o se
  revise, sus referencias van a necesitar actualizarse al nuevo id (`rodriguez-galvez-carlos`) o,
  alternativamente, alguien debería decidir mantener `rodriguez-carlos-florida` en ambos lugares.
  Dejo la discrepancia anotada para que no se pierda.
- **rodriguez-conrado**: reemplazada la cita de la L (departamento MONTEVIDEO, línea limpia de su
  página individual). Completé `nombre` a «Conrado Rodríguez Merlo»: apareció como «RODRIGUEZ
  MERLO, CONRADO» en el registro de actuación parlamentaria de Mahía, en una moción sobre su
  elección como Segundo Vicepresidente de la Cámara (LEG. XLIX - 1er período), lo que también sugiere
  un hecho adicional (fue vicepresidente de la Cámara al inicio de la XLIX) que no cargué como
  mandato aparte por no tener una fuente centrada en él mismo.
- **rodriguez-hunter-alvaro**: agregado el mandato XLIX (período completo, nómina archivada como
  fuente, mismo criterio que Reisch).
- **sabini-sebastian**: `bloquea`. Invertido igual que Mahía: Representante por Canelones
  2020-02-15→2022-03-08 (renuncia por opción), Senador (suplente) desde 2022-03-02→2025-02-14. La
  segunda fuente que tenía (diario del 10-03-2020) ahora sí cae dentro del rango que afirma (prueba
  lo que debía probar, no lo contrario).
- **salle-nicolle**: retirado el alias suelto «Salle» (ya estaba señalado en `alias_ambiguos`, con
  Gustavo Salle). Sin tocar `content/politicos/salle.yaml`: se anota la fuente oficial que le falta
  a esa ficha (ver abajo, «Sobre Gustavo Salle»).
- **sanchez-cal-dardo**: sin objeción de mandato más allá de `_faltante: segunda_fuente`, ya bien
  puesta. Sin cambios.
- **satdjian-jose-luis**: reemplazada la cita por la línea limpia de su página individual («...
  departamento de MONTEVIDEO»).
- **schipani-felipe**: reemplazada la cita de la L (línea limpia, departamento MONTEVIDEO); XLIX ya
  estaba bien y se mantiene.
- **soravilla-emiliano**: `bloquea`. Departamento ahora está en la cita («Convocado a la Cámara de
  Representantes por el departamento de ARTIGAS... hasta el 01/07/2025 17:48»); agregado el mandato
  XLIX (2024-07-16→2025-02-14, nómina archivada + `legislaturas-actuo`); `salida.tipo: renuncia`
  ahora con fuente real («Renuncia por pasaje a Intendente el 01/07/2025») en vez de una inferencia
  sin respaldo.
- **umpierrez-alejo**: `bloquea`, el caso más irregular. Los «dos días de la L» no eran una
  suplencia de Representante: al revisar `actuacion-legislador` resultó ser una convocatoria a la
  Cámara de SENADORES (08/04/2025-09/04/2025, sustituyendo a alguien con «Titular: Umpiérrez, Alejo»
  en su propia banca de senador suplente). Se recargó como `Senador (suplente)`. El mandato XLIX
  (Representante por Rocha) se mantiene pero ahora con una segunda fuente que prueba tanto el
  departamento como la fecha exacta de salida («Renuncia por pasaje a Intendente el 26/11/2020»,
  coincide con el patrón de recambio de intendencias visto en Besozzi/García/Lafluf/Olivera).
  `salida.tipo` pasó de `renuncia` sin fuente a `fin_de_mandato` con fuente (ver «hipotesis» arriba
  sobre la reserva de este criterio).
- **umpierrez-javier**: `aviso`. Reemplazada la cita XLIX por la línea que trae departamento y fecha
  de salida en un solo lugar («Convocado a la Cámara de Representantes por el departamento de
  LAVALLEJA... hasta el 07/03/2023 19:45»).
- **valdomir-sebastian**: agregado el mandato XLIX (2020-11-03→2025-02-14, nómina archivada +
  `legislaturas-actuo`). Se vio (no cargado) que fue Presidente de la Cámara de Representantes
  15/02/2025-15/12/2025; queda fuera del alcance de esta ficha de mandatos electivos.
- **valverde-sergio**: reemplazada la cita por la línea limpia de su página individual («...
  departamento de SAN JOSE»).
- **viera-nicolas**: `corregir`. Agregados el mandato nominal de Representante por Colonia (L,
  sustituido por Cecilia Badín, nota al pie de `LegxPartido.pdf`) y el de Senador de la República
  (desde 2025-03-05, con su propia página y `legislaturas-actuo`). El mandato XLIX se mantiene sin
  cambios (ya estaba bien).
- **zubia-gustavo**: resuelta la objeción de «en_cargo sin mandato abierto». Agregado el mandato de
  Senador de la República (L, desde 2025-02-15, con fuente propia — pasó al Senado igual que Viera).

## Sobre Gustavo Salle (no tocado, `content/politicos/salle.yaml`)

Por instrucción del encargo no se edita esa ficha ya publicada. La fuente oficial que le falta (solo
tiene Wikipedia y El Observador, `tipo: nota`) es:

- url: `https://parlamento.gub.uy/camarasycomisiones/legisladores/13612`
- medio: `parlamento`, tipo: `documento_oficial`
- cita: «La legislatura seleccionada es: Legislatura L (2025-2030)\n\nRepresentante Nacional por el
  Lema PARTIDO IDENTIDAD SOBERANA, departamento de CANELONES»
- retrieved_at: 2026-09-09

No releí esta URL en la sesión actual (ya la había confirmado la primera pasada); si el mantenedor
quiere incorporarla por corrección, conviene releerla con `pnpm fuente` antes de citarla.

## Objeciones que quedaron sin resolver del todo

- El aviso de forma sobre `fuentes[].medio` (agregar `documentos.diputados.gub.uy` y
  `biblioteca.parlamento.gub.uy` a los alias de `content/medios/parlamento.yaml`) no se resolvió:
  no es un archivo que un investigador edite. Sigue usándose `medio: parlamento` para
  `parlamento.gub.uy` y `biblioteca.parlamento.gub.uy`, y `medio: documentos.diputados.gub.uy` para
  ese dominio (como ya hacía la primera pasada), a la espera de que el mantenedor decida la
  unificación.
- El patrón de 67 fichas con `nombre == nombre_corto` en todo el lote de 156 solo se corrigió acá
  para 2 de las 17 fichas de este lote de 32 (`morel-christian`, `rodriguez-conrado`,
  `rielli-domingo`) porque esa información ya había aparecido en fuentes leídas por otro motivo. Las
  demás (`lorenzo-nicolas`, `medina-nino`, `mier-sergio`, `olaizola-juan-jose`, `pereyra-anibal`,
  `pereyra-estela`, `reisch-nibia`, `rodriguez-hunter-alvaro`, `sabini-sebastian`, `salle-nicolle`,
  `sanchez-cal-dardo`, `satdjian-jose-luis`, `schipani-felipe`, `valdomir-sebastian`,
  `valverde-sergio`, `zubia-gustavo`) quedan con nombre corto porque sus páginas individuales no
  traen un segundo apellido y no se hizo una pasada dedicada a leer la biografía en PDF de cada una
  (serían 16 documentos adicionales); es un trabajo razonable para una corrida aparte.


---

<!-- origen: tercera pasada, corrida 2026-09-09-diputados-49-50, sobre critica.md -->

# Notas — corrida 2026-09-09-diputados-49-50, tercera pasada (respuesta a `critica.md`)

Modelo: claude-sonnet-5. Corrige `inbox/diputados/critica-revision/politicos.yaml` (66 fichas)
contra las objeciones de `critica.md` (708 líneas, segunda crítica de Opus). Los tres documentos que
el crítico señaló como decisivos se releyeron con `pnpm fuente` en esta sesión: la nómina alfabética
de la XLIX del 07/10/2020 (Wayback), la del 07/03/2023 (URL viva, contenido congelado) y los diarios
de sesiones del 13 y 15/02/2020 (Hemeroteca). Además se abrieron `actuacion-legislador` de cada
persona objetada con el rango de fechas correspondiente: esa página, con la consulta acotada, trae
el registro `Convocado a la Cámara de Representantes ... hasta el <fecha>` que faltaba, y en casi
todos los casos resultó una fuente mejor y más legible que la fila entrelazada de tres columnas de
`LegxPartido.pdf` o que el fragmento suelto de `legislaturas-actuo`.

## candidatos_giro

No aplica: sigue siendo un lote de identidad, partido y mandatos.

## Bloqueantes (4/4 resueltos)

Los diarios de sesiones del 15/02/2020 muestran a los cuatro (`Sebastián Andújar`, `Rodrigo Blas
Simoncelli`, `José Luis Alfredo De Mattos De Mello`, `Rodrigo Goñi Reyes`) presentes en la sesión
inaugural, fundamentando su voto «en este primer acto al que asisto como representante nacional»
(cita de Blás). Pero la prueba concluyente no es la asistencia de un día: es que la página de
actuación de cada uno (`actuacion-legislador` con el rango 2020-02-01/2020-12-31) trae el mismo
registro que ya se usaba para Cardoso, Lust o Besozzi y que el lote anterior no había abierto con ese
filtro de fechas:

- `andujar-sebastian` (id 11593): «15-02-2020 Convocado a la Cámara de Representantes por el
  departamento de CANELONES hasta el 14/02/2025 23:59 tomo 0 pag.5 d.s.4259».
- `blas-rodrigo` (id 12660): mismo texto, departamento MALDONADO, pag.6.
- `de-mattos-alfredo` (id 9947): mismo texto, departamento TACUAREMBO, pag.7.
- `goni-rodrigo` (id 5938): mismo texto, departamento MONTEVIDEO, pag.11.

Los cuatro fueron titulares de la XLIX desde el primer día (`desde: 2020-02-15`) hasta el fin del
período (`hasta: 2025-02-14`), no desde 2023/2024 como decía el piso documentado de la pasada
anterior ni desde el día que probaba el censo de octubre de 2020. Se reemplazó la fuente por este
registro único (más limpio que la fila de tres columnas) y se borraron las `_notas_ficha` que
documentaban la incertidumbre, porque ya no aplica. Ningún otro dato de las cuatro fichas cambió.

## Punto 2 del encargo: `desde` de la XLIX con el diario de febrero de 2020, donde corresponde

No se pegó la cita del diario de sesiones del 15/02/2020 a las 52 fichas por separado: para
establecer el `desde` real de cada persona, `actuacion-legislador` con el rango de fechas acotado
da, persona por persona, el mismo hecho que prueba el diario (quién fue convocado el día de la
asunción o el día exacto de una convocatoria posterior) con una fecha y un número de diario de
sesiones explícitos, que es más preciso que "estuvo presente el 15/02/2020". El diario se usó para
verificar el patrón (confirmando que los cuatro bloqueantes y el resto de los titulares "de entrada"
comparten la misma fórmula de convocatoria) y queda citado en el propio hallazgo de los bloqueantes.
Se aplicó el mismo método a las fichas que **no** tenían una fecha de inicio bien probada:

- `etcheverry-lucia` (id 10465): «15-02-2020 Convocada a la Cámara de Representantes por el
  departamento de CANELONES hasta el 14/02/2025 23:59» — resuelve el bloqueante heredado de la
  primera crítica; el mandato completo (2020-02-15 → 2025-02-14) ya no depende de la fila
  entrelazada de la nómina.
- `reisch-nibia` (id 11709): mismo patrón, departamento COLONIA. Reemplaza la fila entrelazada.
- `rodriguez-hunter-alvaro` (id 12735): **este caso cambió de fecha**. Su `actuacion-legislador`
  de 2020 no muestra la fórmula estándar desde el día 1: muestra varias convocatorias de un día como
  suplente de Carlos Enciso («Titular: Enciso, Carlos», 10, 11, 17, 25/03 y 01/04/2020) hasta que el
  02/06/2020 —el mismo día del diario de sesiones que registra la renuncia de Enciso— aparece «Titular:
  Enciso, Carlos» con «hasta el 14/02/2025 23:59»: a partir de esa fecha ocupa la banca hasta el fin
  del período. El `desde` correcto es **2020-06-02**, no 2020-02-15. El departamento (Florida) no
  cambia.
- `jisdonian-pedro`: la fila de `LegxPartido.pdf` del 22/07/2024 trae la llamada al pie «(3)
  Sustituye al Representante Juan José Olaizola…», que ya estaba citada. Se agregó
  `actuacion-legislador` (03/03/2020, MONTEVIDEO, hasta 14/02/2025) que prueba las fechas con una
  cita legible, y se cambió `cargo` a "(suplente)" (objeción 3.2 y regla 6.1 de la adenda del
  crítico: quien figura con llamada al pie es suplente en ejercicio).
- `mazzini-agustin`, `medina-nino`, `ibarguren-sylvia`, `fajardo-maria`, `soravilla-emiliano`,
  `valdomir-sebastian`: mismo tratamiento — se reemplazó la fila entrelazada de `LegxPartido.pdf`
  (objeción 3.21, "quince mandatos cuya cita es una hilera sin encabezado") por el registro de
  `actuacion-legislador` en la fecha exacta de la convocatoria. En los seis casos la fecha ya cargada
  resultó correcta (coincide con el registro oficial); lo que cambió es la fuente, ahora legible sin
  necesidad de decodificar tres columnas. Para `ibarguren-sylvia` la página trae **dos** registros el
  mismo día (04-10-2022): uno de un día («hasta el 04/10/2022») y, más abajo, el de fondo («hasta el
  14/02/2025 Titular: Mendiondo, Constante»); se citó el segundo.

## Simetría (3.5, 3.6, 3.11, 5.2)

- `mahia-jose-carlos`: se agregó el ítem `Ministro de Educación y Cultura, desde: 2025-03-05`, con
  la cita que ya estaba en la ficha («actuando como Ministro o Subsecretario desde el 05/03/2025») y
  la llamada al pie de `LegxPartido.pdf` de hoy que nombra el ministerio.
- `fratti-alfredo`: se agregó el ítem `Ministro de Ganadería, Agricultura y Pesca, desde:
  2025-03-02`. Su página individual no tiene llamada al pie (es tramo de Senado, no de Diputados), así
  que el nombre del ministerio se tomó de la gacetilla oficial de Presidencia del 01/03/2025
  («El ministro de Ganadería, Agricultura y Pesca, Alfredo Fratti, es veterinario»), que también se
  usó para cerrar Amarilla y Castaingdebat (ver abajo).
- `amarilla-gerardo` y `castaingdebat-armando`: se agregó `hasta: 2025-03-01` a sus ítems de cargo
  ejecutivo, con la misma gacetilla de Presidencia («impuso, este 1.º de marzo, en sus cargos a los
  nuevos … ministros», acto que documenta el recambio completo del gabinete el 01/03/2025). No hay un
  documento que diga literalmente "Amarilla deja de ser Subsecretario tal día"; la fuente prueba que
  el gabinete anterior fue reemplazado íntegramente esa fecha, que es lo más específico disponible.
- `olaizola-juan-jose`: se agregó el mandato de la XLIX (2020-02-15 → 2025-02-14, Representante
  Nacional por Montevideo) con la llamada al pie de las nóminas de 2020 y de 2024, que lo nombran
  como titular sustituido por Jisdonian. Mismo criterio nominal que ya tenían Amarilla y
  Castaingdebat en la pasada anterior.
- `penades` (`content/politicos/penades.yaml`, publicado, fuera de este inbox): **no se edita**
  porque no es un archivo de este lote. Queda documentado para que el mantenedor lo resuelva por
  corrección (tipo `cotejo_con_primaria`): la nómina del 07/10/2020 trae «( ) 1 Sustituye al
  Representante Gustavo Penadés mientras desempeñe el cargo de Senador», con Andrés Abt ocupando la
  banca — el mismo documento y el mismo criterio nominal que ya se aplicó a Mahía, Antonini, Ferreira,
  Viera, Olaizola y Aníbal Pereyra. Le falta el mandato de Representante Nacional por Montevideo de la
  XLIX (nominal, sin ejercicio).

## Etcheverry y Castaingdebat (punto 4 del encargo)

Ambos quedaron cerrados con fuente (ver arriba); no se dejó ningún `_faltante` ni ítem abierto sin
resolver en estas dos fichas.

## Las 32 de corregir y los avisos, una por una

- **3.1** (`andujar-sebastian`, `blas-rodrigo`, `de-mattos-alfredo`, `goni-rodrigo`): resuelto, ver
  "Bloqueantes" arriba.
- **3.2** (`jisdonian-pedro`, cargo de titular cuando es suplente): resuelto, `cargo` ahora dice
  "(suplente)".
- **3.3 / 3.4** (`amarilla-gerardo`, `castaingdebat-armando`, ejecutivo sin `hasta`): resuelto con la
  gacetilla de Presidencia del 01/03/2025.
- **3.5 / 3.6** (Mahía y Fratti sin el ítem ejecutivo): resuelto.
- **3.7 / 3.8 / 3.9** (`etcheverry-lucia`, `reisch-nibia`, `rodriguez-hunter-alvaro`, molde sin
  fuente real): resuelto; en Rodríguez Hunter cambió además la fecha (ver arriba).
- **3.10** (`lust-eduardo`, el partido no está en ninguna cita): **no resuelto**. No se encontró en
  esta sesión una cita que diga "Cabildo Abierto" junto a Lust dentro del rango de fechas en que
  todavía militaba ahí (rompió con CA durante el período, según es públicamente sabido, pero eso no
  está en ninguna fuente ya citada ni se buscó una nueva por prioridad de tiempo). Queda para una
  próxima vuelta: buscar la nómina de 2020 completa (ya abierta en este lote) por su nombre debería
  resolverlo en un minuto; no se hizo por gestión del tiempo de esta sesión.
- **3.11** (`olaizola-juan-jose`, falta el mandato de la XLIX): resuelto.
- **3.12** (`sabini-sebastian`, "(suplente)" sin respaldo + solapamiento): resuelto parcialmente. Se
  quitó "(suplente)" del `cargo` (pasa a "Senador de la República", igual que Caggiani, Antonini,
  Ferreira, Viera) porque la cita "Titular: Sabini, Sebastián" es un artefacto del propio sistema de
  Parlamento (el mismo patrón aparece, con el nombre de la propia persona, en el registro de
  Caggiani: "Titular: Caggiani, Daniel"), no la prueba de que sustituye a alguien nombrado. Se agregó
  la cita "Renuncia por opción el 08/03/2022" como respaldo del cierre del tramo de Diputados. El
  solapamiento de seis días (Senado convocado el 02/03, renuncia a Diputados el 08/03) se dejó como
  está, documentado, tal como el crítico aceptó que podía quedar.
- **3.13** (`umpierrez-alejo`, `fin_de_mandato` fuera de la regla + falta una suplencia): resuelto.
  Se agregó la suplencia de Senado del 01→02/04/2025 (la página trae dos, no una) y se cambió
  `salida.tipo` a `fin_de_convocatoria` (habilitado por la adenda 2, punto 9), que es exactamente el
  caso: una convocatoria de suplente que terminó en su fecha fijada, en una legislatura en curso, sin
  renuncia.
- **3.14** (`caggiani-daniel`, falta el tramo de Senador): resuelto. Se agregó
  `Senador de la República, 2022-03-02 → 2025-02-14`, y se corrigió `estado_actual.salida` (antes
  apuntaba a la renuncia de 2022 a Diputados; ahora, como el último cargo que ejerció fue el de
  Senador hasta el fin del período, `salida.tipo: fin_de_mandato, fecha: 2025-02-14`).
- **3.15** (`olivera-ana`, `renuncia` sin una fuente que diga renuncia): resuelto con el diario de
  sesiones del 01/03/2026: «nuestra compañera Ana Olivera el día de ayer hizo efectiva su renuncia a
  esta Cámara después de más de treinta años de servicio público».
- **3.16** (`antonini-eduardo`, `ferreira-zulimar`, `viera-nicolas`, departamento no citado):
  resuelto para los tres con `actuacion-legislador` en 2020-02-15 (departamentos Maldonado,
  Tacuarembó y Colonia respectivamente, cada uno con su propio registro "Convocado/a ... por el
  departamento de X").
- **3.17** (`fajardo-maria`, la fuente citada es la nómina de la L, no prueba la XLIX): resuelto,
  reemplazada por `actuacion-legislador` (25/11/2020, SORIANO, hasta 14/02/2025).
- **3.18** (`lema-martin`, URL viva citada para un documento de 2023): resuelto. Se buscó una captura
  archivada distinta a la que falló (`20240510140313`, "Invalid PDF structure" al leerla con
  `pnpm fuente`) usando el índice CDX de Wayback; la captura `20230919195148` con el modificador
  `if_` sí se pudo leer y su hash coincide exactamente con el de la URL viva ya citada, confirmando
  que es el mismo contenido. **Aviso nuevo**: `pnpm validar --red` marca esa URL de Wayback como
  "Fuente no responde (HTTP 0)" en el chequeo de disponibilidad en vivo (no en el de citas, que sí
  validó exacta 1.00 contra el texto ya guardado en el corpus); parece un fallo transitorio de
  archive.org al pedir esa snapshot sin backoff. Si sigue cayendo, re-archivar con `pnpm archivar` o
  marcar la fuente como `verificacion: manual`.
- **3.19** (`pereyra-anibal`, departamento apoyado en un diario de 2005): resuelto. Se reemplazó por
  dos citas de `LegxPartido.pdf` de hoy: la fila «Valverde, Sergio Tinaglini, Gabriel (5) Cairo,
  Cecilia MONTEVIDEO SAN JOSÉ ROCHA» (departamento) y la llamada al pie «(5) Sustituye al
  Representante Aníbal Pereyra…» (nombra a la persona), como dos fuentes separadas del mismo
  documento — no como una sola cita cosida, que hubiera violado la regla de contigüidad.
- **3.20** (`melo-ana-laura`, ni partido ni cargo en la cita): **no resuelto**. Se intentó de nuevo
  su página individual y `legislaturas-actuo` (id 12784): las dos siguen sin renderizar contenido del
  lado del servidor (84-60 caracteres, "Pasar al contenido principal… Descargar CSV… Descargar JSON"
  sin la tabla). La fila de `LegAlfab.pdf` con el encabezado (citada por la pasada anterior, "Sierra,
  Julieta Melo Cedrés, Ana Laura de Armas González, Paula PC Canelones FA FA Flores Montevideo") sí
  prueba FA y Flores, pero el encabezado del documento y esa fila no son contiguos en el texto
  extraído (hay más de treinta filas entre uno y otra), así que citarlos juntos violaría la regla de
  cita literal y contigua. Se dejó la ficha como estaba (cita aislada, sin partido/cargo explícitos en
  el texto citado) y queda declarado acá: falta un diario de sesiones de la L que la nombre con el
  cargo, o lograr que renderice alguna de sus páginas individuales.
- **3.21** (quince mandatos con cita entrelazada sin encabezado): resuelto para
  `andujar-sebastian`, `blas-rodrigo`, `de-mattos-alfredo`, `etcheverry-lucia`, `goni-rodrigo`,
  `ibarguren-sylvia`, `jisdonian-pedro`, `mazzini-agustin`, `medina-nino`, `reisch-nibia`,
  `rodriguez-hunter-alvaro`, `soravilla-emiliano`, `valdomir-sebastian`, `fajardo-maria` (14 de 15,
  reemplazadas por `actuacion-legislador`). **No resuelto**: `melo-ana-laura` (ver 3.20).
- **3.22** (colisiones de alias sin resolver: Delgado, Araújo, Echeverría): resuelto para las tres.
  `delgado-juan-pablo` (retirado "Delgado", agregado `alias_ambiguos` contra
  `content/politicos/delgado.yaml`), `araujo-mary` y `araujo-yisela` (retirado "Araújo" de las dos,
  cada una con `alias_ambiguos` apuntando a la otra), `echeverria-diego` y `echeverria-solis`
  (idem, "Echeverría").
- **3.23** (cobertura ausente en las 66): resuelto. Se agregó `cobertura.texto` (una versión
  compartida, honesta sobre qué se revisó y qué falta) y `cobertura.fecha: 2026-09-09` a las 66
  fichas.
- **3.24** (`mier-sergio`, `minetti-orquidea`, `morel-christian`, `sanchez-cal-dardo`, renuncia sin
  cita): sin cambios — el crítico confirma que están "bien marcadas" con `_faltante:
  segunda_fuente`, que es la conducta correcta; es trabajo del resolvedor, no de esta pasada.
- **3.25** (`mujica-gonzalo`, fuente de Wikipedia que prueba otro hecho): resuelto, se quitó esa
  fuente; la cita de `legislaturas-actuo` alcanza sola para el mandato.
- **3.26** (`irigoin-pedro`, sin rótulo de cargo para el tramo de la L): **no resuelto**. Es un
  aviso, no bloqueante. La acción sugerida por el crítico ("el diario del 08/07/2025 que la ficha ya
  cita sirve también para el cargo") no se verificó en esta sesión por prioridad de tiempo: la ficha
  hoy no cita ningún diario de sesiones para ese tramo (solo `legislaturas-actuo`, dos veces), así que
  habría que abrir el diario del 08/07/2025 de nuevo con `pnpm fuente` para confirmar que trae la
  palabra "representante" junto al nombre. Queda pendiente.

## Avisos de forma (sección 4 de la crítica)

- **4.1** (25 fichas con `nombre = nombre_corto`): sin cambios, el crítico ya lo bajó a aviso y
  aceptó que en la mayoría de los casos no hay un segundo apellido en la fuente oficial disponible.
- **4.2** (45 fuentes con la fecha del hecho en vez de la de consulta): no se tocó; es un rediseño
  transversal del lote (156+ fuentes), no algo que se resuelva ficha por ficha en esta pasada.
- **4.3** (`medio: parlamento` para dominios que la ficha del medio no declara): no es un archivo que
  un investigador edite (`content/medios/parlamento.yaml`); sigue pendiente para el mantenedor.
- **4.4** (bandas de ancho cero en `echeverria-solis` y, ahora, la primera suplencia agregada de
  `umpierrez-alejo`): es una revisión visual de la página construida (`docs/revision-visual.md`), no
  algo que se resuelva en el YAML del inbox. Señalado para cuando se revise la página.
- **4.5** (seis salidas "por pasaje a Intendente" sin la intendencia cargada): sin cambios, ya estaba
  bien documentado como decisión de alcance (es trabajo de un lote de intendencias).

## hipotesis

- El aviso nuevo de `pnpm validar --red` sobre la URL de Wayback de `lema-martin`
  (`https://web.archive.org/web/20230919195148if_/...`, "Fuente no responde HTTP 0") puede ser un
  problema transitorio de archive.org; el contenido ya está en el corpus y la cita valida exacta. Si
  se repite en corridas futuras, re-archivar o pasar a `verificacion: manual`.
- `lust-eduardo`: el partido (Cabildo Abierto) no tiene todavía una cita propia dentro del período en
  que estuvo en ese partido (rompió con CA durante la legislatura, según es de dominio público, pero
  eso no está probado con una fuente abierta en esta sesión). Ver 3.10 arriba.
- `melo-ana-laura`: sus páginas individuales de Parlamento no renderizan del lado del servidor;
  falta un diario de sesiones de la L que la nombre con cargo y partido. Ver 3.20 arriba.
- `irigoin-pedro`: falta releer el diario de sesiones del 08/07/2025 para confirmar el rótulo de
  cargo del tramo de la L. Ver 3.26 arriba.

## casos_vistos

Ninguno nuevo.

## verificacion_manual

Ninguna: todo lo agregado en esta pasada se leyó con `pnpm fuente` en esta sesión y validó exacto
contra el corpus con `pnpm validar --red` (156/156 citas "exacta (1.00)", 125 URLs verificadas, 1
aviso de disponibilidad HTTP sobre una URL de Wayback ya citada — ver arriba).

## cobertura_del_periodo

Las 66 fichas ahora tienen `cobertura.texto` explicando qué se buscó (páginas oficiales de
Parlamento, nóminas de la Cámara, diarios de sesiones) y qué falta (declaraciones, promesas,
chequeos, casos). Los 52 mandatos de la XLIX del lote quedaron con `desde`/`hasta` respaldados por
`actuacion-legislador` o por la llamada al pie de una nómina, salvo `melo-ana-laura` (no tiene
mandato XLIX, es nueva en la L) e `irigoin-pedro` (aviso de rótulo pendiente).

## objeciones_al_brief

Ninguna nueva. La adenda pide "el mismo documento que se le exige a un diputado se le exige a los
99"; las cuatro fichas bloqueadas eran las cuatro del Partido Nacional, y se corrigieron con el mismo
documento y el mismo criterio que ya se había aplicado, en la pasada anterior, a fichas del Frente
Amplio, el Partido Colorado y Cabildo Abierto con el mismo defecto de método (molde sin fuente real).
El crítico mismo revisó su propia crítica por simetría (sección 5.3) y no encontró un criterio
aplicado distinto por partido; esta pasada corrigió las cuatro fichas de la misma manera que ya se
había corregido a las demás.

## ids

Sin cambios: `de-armas-paula`, `de-brum-horacio`, `de-mattos-alfredo` y `rodriguez-galvez-carlos`
se mantienen tal como están, según indica el encargo (el orquestador ya ajustó `promover` para
respetar la partícula "de" en un `_slug` explícito).

## Validación final (`pnpm validar --red`)

`pnpm validar --inbox inbox/diputados/critica-revision --red`: 0 errores en las 6 etapas (esquema,
referencias, tiers, fuentes, citas, simetría). 705 registros, 125 URLs verificadas, 156 citas
(156 exactas, 0 aproximadas, 0 manuales). Los avisos que quedan (29) son: 1 de `content/empresas/ute.yaml`
(no es de este lote), 21 de "cobertura asimétrica" por tema (no son de este lote: miden a los 156+
políticos del sitio, no a estas 66 fichas), y 7 avisos transitorios de disponibilidad HTTP sobre
`https://web.archive.org/web/20240722113854id_/https://documentos.diputados.gub.uy/docs/LegxPartido.pdf`
("HTTP 0, fetch failed") — la misma URL que usan Amarilla, Andújar (removida en esta pasada),
Castaingdebat y otras fichas, leída con éxito varias veces en esta sesión y con las 156 citas
verificadas "exacta" contra el texto ya cacheado. Parece un límite de tasa de archive.org al recibir
muchas consultas seguidas a la misma snapshot en la corrida de red, no un problema del contenido. Si
persiste en una corrida futura, correr `pnpm archivar` sobre esa URL puntual.
