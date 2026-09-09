# Crítica — corrida 2026-09-09-diputados-49-50

Modelo: Opus 5 (claude-opus-5[1m]), como corresponde al crítico según la regla 14 de `CLAUDE.md`.
Lote: `inbox/diputados/todos/` (fusión de `l-a-l`, `l-m-z`, `xlix-a-l`, `xlix-m-z`)
Registros revisados: 156 fichas de `politicos.yaml` (188 mandatos, 184 de ellos de Representante; 274 fuentes)
Fichas abiertas contra la fuente con `pnpm fuente` en esta sesión: 37 fichas individuales de
`parlamento.gub.uy` (páginas `legisladores/<id>`, `legisladores/<id>/legislaturas-actuo` y
`legisladores/<id>/actuacion-legislador`) más 4 documentos oficiales de nómina.

Severidades: `bloquea` = el registro afirma algo que la fuente no respalda o que otra fuente
oficial contradice; `corregir` = se publica después de un cambio concreto; `aviso` = para el editor.
(El pedido usaba `bloqueante / corregir / aceptar`; `aceptar` es acá `sin_objecion`.)

---

## Hallazgo de método que ordena casi todo lo que sigue

Las cuatro corridas apoyaron la mayoría de los mandatos en
`parlamento.gub.uy/camarasycomisiones/legisladores/<id>/legislaturas-actuo`. Esa página **no dice
qué cargo ejerció la persona salvo cuando antepone la línea «Representante Nacional por el Lema
PARTIDO X - Legislatura N»**. Cuando la fila aparece pelada («Legislatura XLIX (2020-2025)» y dos
fechas), esa fila puede ser:

- una **suplencia** de uno o dos días en Diputados (Blás: 13/08/2024-14/08/2024; Andújar:
  15/05/2024; De Mattos: 05/12/2023-08/12/2023),
- un **pasaje al Senado** (Mahía, Caggiani, Sabini: ver abajo, con la cita que lo prueba),
- o simplemente **un dato incompleto**: Eduardo Lust tiene una sola fila de nueve días en
  diciembre de 2022 y fue titular de la banca toda la legislatura.

El lote trató las tres cosas como lo mismo. 43 de los 184 mandatos de Representante cargados no
tienen esa línea en ninguna de sus citas. La distribución por partido no es pareja y conviene
decirlo con números, aunque nada indica intención: Partido Nacional 21 de 54 (39 %), Frente Amplio
15 de 84 (18 %), Partido Colorado 5 de 29 (17 %), Cabildo Abierto 2 de 13 (15 %). La corrección es
la misma para todos: ningún mandato se publica sin una fuente que diga el cargo.

Los dos documentos que resuelven casi todo esto, y que el lote no usó, existen y los abrí:

| Documento | Qué da | Estado |
|---|---|---|
| `https://documentos.diputados.gub.uy/docs/LegAlfab.pdf` | Nómina alfabética de la L con **partido y departamento contiguos al nombre** («Abdala, Pablo PN Montevideo», «Cervini Pratto, Walter PC Canelones») | vivo, leído hoy |
| `https://documentos.diputados.gub.uy/docs/Legxdpto.pdf` | Nómina de la L por departamento, con la cantidad de bancas de cada uno | vivo, leído hoy |
| `https://documentos.diputados.gub.uy/docs/LegxPartido.pdf` | Los 99 titulares de la L al 09/09/2026, con las cinco notas al pie de sustitución | vivo, leído hoy |
| `https://web.archive.org/web/20240722113854id_/https://documentos.diputados.gub.uy/docs/LegxPartido.pdf` | **Los 99 titulares de la XLIX al 22/07/2024**, con tres notas al pie de sustitución | única captura en Wayback (verificado con el índice CDX) |

La captura de 2024 es la que refuta o confirma media docena de registros. `LegAlfab.pdf` es la
fuente correcta para los ocho registros cuyo departamento hoy sale de una fila de tres columnas
desordenada.

---

## Objeciones por registro

### `mahia-jose-carlos` — mandato XLIX «Representante Nacional por Canelones 2022-11-15 → 2025-02-14»
- severidad: **bloquea**
- tipo: cita_fuera_de_contexto / riesgo_legal
- objecion: el registro convierte en mandato de diputado el tramo en que Mahía fue **senador**.
  La fila que cita («Legislatura XLIX (2020-2025) 15-11-2022 14-02-2025») no lleva la línea
  «Representante Nacional». Su propia página de actuación dice lo contrario, y con todas las letras.
- cita_de_contexto: «Convocado a la Cámara de Senadores por el lema PARTIDO FRENTE AMPLIO, sublema
  PLURALISMO FRENTEAMPLISTA hasta el 14/02/2025 23:59 Titular: Astori, Danilo» y, en el mismo
  listado, «Iniciativa Asunto: 157283 ; MAHIA, JOSÉ CARLOS. BANCA CÁMARA REPRESENTANTES. RENUNCIA.»
  (`https://parlamento.gub.uy/camarasycomisiones/legisladores/2921/actuacion-legislador?Fecha_desde=2022-11-01&Fecha_hasta=2024-12-31`).
  Confirmación independiente: la nómina de Representantes de la XLIX al 22/07/2024 no lo lista.
- accion_sugerida: invertir el registro. El mandato de Representante por Canelones va de
  2020-02-15 a 2022-11-15 (renunció a la banca), y desde esa fecha hasta 2025-02-14 fue Senador
  sustituyendo a Astori. El mandato de la L sí está bien (su página lleva la línea «Representante
  Nacional por el Lema PARTIDO FRENTE AMPLIO - Legislatura L»), y hoy la banca la ejerce Luis
  Enrique Gallo: «Sustituye al Representante José Carlos Mahia mientras desempeñe el cargo de
  Ministro de Educacion y Cultura» (`LegxPartido.pdf`), que es la cita que corresponde.

### `caggiani-daniel` — mandato XLIX «Representante Nacional por Montevideo 2022-03-02 → 2025-02-14»
- severidad: **bloquea**
- tipo: cita_fuera_de_contexto
- objecion: mismo error. La fila citada no dice el cargo, y su actuación parlamentaria muestra que
  en ese tramo estaba en el Senado.
- cita_de_contexto: «Convocado a la Cámara de Senadoreshasta el 14/02/2025 23:59»
  (`https://parlamento.gub.uy/camarasycomisiones/legisladores/9916/actuacion-legislador?Fecha_desde=2022-11-01&Fecha_hasta=2024-12-31`).
  No figura en la nómina de Representantes al 22/07/2024.
- accion_sugerida: el propio `notas.md` ya traía la pista y la descartó: «desde el 15-02-2020 estuvo
  "Convocado a la Cámara de Representantes por el departamento de MONTEVIDEO hasta el 08/03/2022"».
  Ese es el mandato de Diputados. Cargar 2020-02-15 → 2022-03-08 con un diario de sesiones y dejar
  el Senado fuera de este lote.

### `sabini-sebastian` — mandato XLIX «Representante Nacional por Canelones 2022-03-02 → 2025-02-14»
- severidad: **bloquea**
- tipo: cita_fuera_de_contexto
- objecion: el registro data el mandato en el tramo en que estaba en el Senado, y su segunda fuente
  —un diario de sesiones del 10-03-2020 que dice «SEBASTIÁN SABINI, Representante por Canelones»—
  **queda fuera del rango que el registro afirma**, es decir, prueba lo contrario de lo que se le
  hace probar.
- cita_de_contexto: «Convocado a la Cámara de Senadores por el lema PARTIDO FRENTE AMPLIO, sublema
  MÁS DESARROLLO CON IGUALDAD hasta el 14/02/2025 23:59 Titular: Sabini, Sebastián»
  (`https://parlamento.gub.uy/camarasycomisiones/legisladores/9894/actuacion-legislador?Fecha_desde=2022-01-01&Fecha_hasta=2023-12-31`).
  No figura en la nómina de Representantes al 22/07/2024. El propio `notas.md` anota que un diario
  del 08-03-2022 lo llama «el senador Sabini».
- accion_sugerida: cargar el mandato de Diputados desde 2020-02-15 con el diario de sesiones que ya
  tiene, y buscar la fecha exacta de salida.

### `lust-eduardo` — mandato XLIX «2020-02-15 → 2020-06-02», `fuera_de_cargo` desde entonces
- severidad: **bloquea**
- tipo: cita_fuera_de_contexto / contexto_omitido
- objecion: el `hasta` sale de una fila de actuación del 02-06-2020 que dice que ese día fue
  «Miembro interpelante en el llamado a sala…». Que ese día haya intervenido no prueba que dejara
  la banca; y la nómina oficial de Representantes de la XLIX al 22/07/2024 lo lista como titular en
  ejercicio («Lust Hitta, Eduardo»). Su `legislaturas-actuo` no respalda nada: tiene una sola fila,
  «Legislatura XLIX (2020-2025) 02-12-2022 11-12-2022».
- cita_de_contexto: `https://parlamento.gub.uy/camarasycomisiones/legisladores/12661/legislaturas-actuo`
  y la nómina archivada de 2024, que lo incluye entre los 99.
- accion_sugerida: mandato completo 2020-02-15 → 2025-02-14 con la nómina archivada como fuente, o
  `probable` hasta conseguir un diario de sesiones. Corregir `salida.tipo` (hoy `fin_de_mandato` con
  fecha 2020-06-02).

### `etcheverry-lucia` — mandato XLIX «2020-02-15 → 2021-03-03»
- severidad: **bloquea**
- tipo: cita_fuera_de_contexto
- objecion: idéntico al anterior. La cita que sostiene el mandato es «02-06-2020 Interviene en la
  discusión fundamentando su voto…», una fila fechada nueve meses antes del `hasta` que el registro
  afirma. La nómina de la XLIX al 22/07/2024 la lista como titular en ejercicio («Etcheverry Lima,
  Lucía»), y su `legislaturas-actuo` solo tiene filas de un día (10-12-2024 y 15-02-2025).
- cita_de_contexto: `https://parlamento.gub.uy/camarasycomisiones/legisladores/10465/legislaturas-actuo`.
- accion_sugerida: la misma que Lust.

### `echeverria-solis` — mandato XLIX «Representante Nacional por Tacuarembó 2020-02-15 → 2020-02-15»
- severidad: **bloquea**
- tipo: riesgo_legal (afirma más de lo que la fuente respalda)
- objecion: la segunda cita del propio registro dice «Convocado a la Cámara de Representantes por el
  departamento de TACUAREMBÓ», es decir, **suplente convocado un día**, no titular. El registro lo
  publica como mandato de Representante y además cierra con `salida.tipo: fin_de_mandato` fechada el
  15-02-2020, que es el día en que empezó la legislatura, no el día en que terminó ningún mandato.
  No figura en la nómina de titulares de la XLIX.
- accion_sugerida: o `cargo: "Representante Nacional por Tacuarembó (suplente)"` —el sitio ya lo
  soporta: `esSuplencia()` en `src/lib/cargos.ts` dibuja la suplencia rayada— o sacar la ficha del
  lote. Y `salida.tipo` no puede ser `fin_de_mandato`.

### `umpierrez-alejo` — mandato L «2025-04-08 → 2025-04-09» y XLIX «2020-02-15 → 2020-11-26»
- severidad: **bloquea**
- tipo: riesgo_legal / cita_fuera_de_contexto
- objecion: tres problemas en un registro. (1) Dos días de la L cargados como mandato de titular
  cuando no está en la nómina de los 99 ni tiene nota de sustitución; es una suplencia. (2) La
  segunda fuente del mandato de 2025 es su biografía oficial y la cita es «Primer Suplente a la
  Cámara de Representantes por Rocha por el Partido Nacional (Lista 71 – Herrerismo) **(2005-2010)**»:
  un dato de hace veinte años usado para fijar el departamento de un mandato de 2025. (3)
  `salida.tipo: renuncia` con fecha 2025-04-09 no tiene ninguna fuente que diga «renuncia»; el
  propio `notas.md` reconoce que es una inferencia y que podría ser una licencia.
- accion_sugerida: marcar la suplencia como tal, tomar el departamento de `LegAlfab.pdf` o de la
  ficha de la persona, y quitar `salida` o dejarla sin tipo hasta tener el diario de sesiones.

### `soravilla-emiliano` — mandato L «Representante Nacional por Artigas 2025-02-15 → 2025-07-01»
- severidad: **bloquea**
- tipo: riesgo_legal / contexto_omitido
- objecion: el departamento (Artigas) **no está en ninguna cita del registro**; `notas.md` lo admite:
  «El departamento que usé viene del brief y de una búsqueda web (no citada)». Eso es exactamente lo
  que la regla 4 para agentes prohíbe. Además `salida.tipo: renuncia` es una inferencia sin fuente,
  y falta un mandato de la XLIX que **la propia página que el registro cita** muestra.
- cita_de_contexto: `https://parlamento.gub.uy/camarasycomisiones/legisladores/12763/legislaturas-actuo`
  trae dos filas: «Legislatura L (2025-2030) 15-02-2025 01-07-2025» y «Legislatura XLIX (2020-2025)
  **16-07-2024 14-02-2025**». Esa segunda fila arranca el mismo día en que Valentina Dos Santos (PN,
  Artigas) dejó la banca, y la nómina de la XLIX al 22/07/2024 ya lo lista («Soravilla Pinato,
  Emiliano»), lo que además confirma Artigas: es la banca del Partido Nacional por ese departamento.
- accion_sugerida: agregar el mandato XLIX 2024-07-16 → 2025-02-14, apoyar el departamento en la
  nómina archivada y quitar el tipo de salida.

### `castaingdebat-armando` — mandato XLIX «2020-02-15 → 2025-02-14»
- severidad: **bloquea**
- tipo: riesgo_legal (la cita no cubre lo afirmado)
- objecion: el mandato de cinco años se apoya en una única cita que dice «Legislatura XLIX
  (2020-2025) 05-02-2024 12-02-2024» — una semana. El propio `notas.md` admite las reservas. El
  hecho probablemente sea cierto, pero así no está probado.
- cita_de_contexto: la nómina archivada de la XLIX sí lo respalda, por su nota al pie: «Sustituye al
  Representante Armando Castaingdebat mientras desempeñe el cargo de Ministro de Defensa Nacional»
  (la suplente en ejercicio al 22/07/2024 era Laura Burgoa González).
- accion_sugerida: usar esa nota al pie como fuente del mandato y, si se le aplica el mismo criterio
  que a Cardoso y a Lema (a quienes sí se les partió el mandato por el pasaje al Ejecutivo), partir
  el suyo también. Ver `amarilla-gerardo`, que tiene el mismo caso.

### `antonini-eduardo` y `ferreira-zulimar` — mandato L de Representante
- severidad: corregir
- tipo: cita_fuera_de_contexto
- objecion: el `cargo` dice «Representante Nacional por Maldonado / por Tacuarembó» pero la cita que
  lo acompaña habla de otra cosa: «Senador de la República por el Lema PARTIDO FRENTE AMPLIO desde el
  02/03/2025». La cita existe (pasa la validación de red) y no respalda el cargo.
- cita_de_contexto: `LegxPartido.pdf` lo dice literal y es la fuente correcta: «Sustituye al
  Representante Eduardo Antonini mientras desempeñe el cargo de Senador de la República» y
  «Sustituye a la Representante Zulimar Ferreira mientras desempeñe el cargo de Senadora de la
  República».
- accion_sugerida: cambiar la cita por la nota al pie de la nómina. Los mandatos XLIX de ambos están
  bien (los verifiqué: llevan la línea «Representante Nacional por el Lema…»).

### `viera-nicolas` — falta el mandato de la L; `en_cargo` sin cargo documentado
- severidad: corregir
- tipo: contexto_omitido
- objecion: la ficha carga solo la XLIX y deja `situacion: en_cargo` sin un solo mandato abierto. Un
  lector ve un diputado que terminó en 2025 y una ficha que dice que sigue en cargo, sin decir en
  cuál.
- cita_de_contexto: «Sustituye al Representante Nicolás Viera mientras desempeñe el cargo de Senador
  de la República» (`LegxPartido.pdf`, la suplente es Cecilia Badín) y «Senador de la República por
  el Lema PARTIDO FRENTE AMPLIO desde el 05/03/2025- Legislatura L (2025-2030)»
  (`legisladores/11626/legislaturas-actuo`).
- accion_sugerida: cargar el mandato de Representante por Colonia de la L y el de Senador, con esas
  dos citas.

### `blas-rodrigo` — falta el mandato titular de la XLIX
- severidad: corregir
- tipo: contexto_omitido
- objecion: `notas.md` concluye que no hay fuente de que haya ejercido banca titular. La hay: la
  nómina de titulares de la XLIX al 22/07/2024 lo lista entre los 99 («Blás Simoncelli, Rodrigo»).
  La ficha, como está, dice que Rodrigo Blás fue diputado dos días.
- accion_sugerida: cargar el mandato XLIX por Maldonado con esa nómina y buscar las fechas exactas.
  El mandato de Senador desde 2025-10-14 está bien citado.

### Fichas de la L a las que les falta el mandato de la XLIX que la nómina prueba
`andujar-sebastian`, `de-mattos-alfredo`, `goni-rodrigo`, `lorenzo-nicolas`, `reisch-nibia`,
`rodriguez-hunter-alvaro`, `jisdonian-pedro`, `mazzini-agustin`, `medina-nino`, `fajardo-maria`,
`ibarguren-sylvia`, `valdomir-sebastian`
- severidad: corregir
- tipo: contexto_omitido
- objecion: los doce figuran entre los 99 titulares de la XLIX al 22/07/2024 y ninguno tiene mandato
  de esa legislatura. `notas.md` explica la decisión (las filas de `legislaturas-actuo` mostraban uno
  o tres días) y para varios era prudente; pero para **`lorenzo-nicolas` no hay excusa**: su página
  trae la fila completa y con el rótulo del cargo, «Representante Nacional por el Lema PARTIDO
  FRENTE AMPLIO - Legislatura XLIX (2020-2025) 15-02-2020 14-02-2025»
  (`legisladores/12646/legislaturas-actuo`), y el propio `notas.md` lo escribe («su XLIX sí es
  completa 15/02/2020-14/02/2025») antes de no cargarlo.
- accion_sugerida: cargar los doce mandatos con la nómina archivada de 2024 como fuente y las fechas
  que cada `legislaturas-actuo` permita; el de Lorenzo, directo, con la línea que ya está.

### Ocho fichas cuyo departamento no está en la cita
`melo-ana-laura`, `olaizola-juan-jose`, `reisch-nibia`, `rielli-domingo`, `rodriguez-conrado`,
`satdjian-jose-luis`, `schipani-felipe`, `valverde-sergio`
- severidad: corregir
- tipo: riesgo_legal (afirma más de lo que la fuente respalda)
- objecion: la única fuente del mandato es una fila de `LegxPartido.pdf` de tres nombres y tres
  departamentos desordenados, del tipo «Rodríguez, Conrado\tDastugue, Álvaro\tLorenzo, Nicolás
  ARTIGAS MONTEVIDEO\tCANELONES». Qué departamento le toca a qué nombre sale de una regla empírica
  que `notas.md` documenta con honestidad pero que **el registro no declara**: la cita no dice que
  Conrado Rodríguez sea por Montevideo. Los ocho aciertan, hasta donde puedo comprobar, pero la
  cadena de evidencia no está a la vista del lector.
- accion_sugerida: reemplazar por `https://documentos.diputados.gub.uy/docs/LegAlfab.pdf`, donde el
  partido y el departamento van pegados al nombre en el mismo renglón («Abdala, Pablo PN
  Montevideo»), o por la página individual cuando renderice.

### Seis fichas con `salida.tipo: fin_de_mandato` en una fecha que no es fin de mandato
`dos-santos-valentina` (2024-07-16), `echeverria-solis` (2020-02-15), `enciso-carlos` (2020-06-02),
`etcheverry-lucia` (2021-03-03), `irazabal-benjamin` (2021-06-08), `lust-eduardo` (2020-06-02)
- severidad: corregir
- tipo: riesgo_legal
- objecion: `fin_de_mandato` afirma que el mandato llegó a su término; en las seis la persona salió
  antes del 14-02-2025. El enum tiene `renuncia`, pero ninguna fuente del lote dice «renuncia» para
  estas seis, así que tampoco corresponde ponerla. Es el caso típico de «motivo de una renuncia»
  afirmado sin respaldo que el pedido pide vigilar.
- accion_sugerida: buscar el diario de sesiones («Renuncia a la banca del señor representante…», que
  el propio lote ya usó bien para Mendiondo, Núñez Fallabrino e Irigoin) y, mientras tanto, dejar la
  ficha en `probable` con el `hasta` del mandato y sin `salida.tipo`.

### Diez fichas con `situacion: en_cargo` y ningún mandato abierto
`besozzi-guillermo`, `carballo-felipe`, `civila-gonzalo`, `fratti-alfredo`, `garcia-mario`,
`lafluf-omar`, `lema-martin`, `olivera-nicolas`, `viera-nicolas`, `zubia-gustavo`
- severidad: corregir
- tipo: riesgo_legal / presentacion
- objecion: `en_cargo` es una afirmación sobre el presente y en las diez no tiene fuente en la ficha:
  el último mandato cargado termina en 2020 o en 2025. `notas.md` reconoce que el dato de que
  Besozzi, García y Lafluf son intendentes salió de Wikipedia «solo como orientación, no citado». Un
  lector que abre la ficha de Besozzi lee «en cargo» y una banda que termina en noviembre de 2020.
- accion_sugerida: o se carga el mandato actual con fuente (intendencia, Senado), o `situacion` pasa
  a lo que la ficha puede sostener. Y el criterio tiene que ser uno solo: hoy `morel-christian` está
  en `fuera_de_cargo` por prudencia ante la misma duda (posible intendente de Cerro Largo) mientras
  estos diez están en `en_cargo` sin fuente.

### Cuatro fichas marcadas `_faltante: segunda_fuente`
`mier-sergio`, `minetti-orquidea`, `morel-christian`, `sanchez-cal-dardo`
- severidad: corregir
- tipo: contexto_omitido
- objecion: la marca está bien puesta y es la conducta correcta, pero el brief pedía segunda fuente
  justamente para las salidas anticipadas, que es lo que estos cuatro tienen. En `minetti-orquidea`
  la segunda fuente que sí hay es Wikipedia con la cita «Representante Nacional (2020-2025) Partido
  político Frente Amplio», que no dice nada sobre el 01-01-2023 en que el registro la hace salir; y
  `content/medios/wikipedia.yaml` declara que «el validador de tiers no la acepta como fuente
  textual ni oficial».
- accion_sugerida: al resolvedor, con el índice del diario de sesiones que `notas.md` ya localizó
  para Minetti («Renuncia a la banca de la señora representante Orquídea Minetti … 39», d.s. del
  05-07-2022). Mientras tanto, `probable`.

### `garcia-mario` y `lafluf-omar` — la segunda fuente es la página de actuación de otra persona
- severidad: corregir
- tipo: cita_fuera_de_contexto
- objecion: la segunda fuente de ambos es
  `legisladores/11125/actuacion-legislador` (la de Martín Lema) y la cita es del tipo «18-11-2020
  Interviene en la discusión fundamentando su voto. ASUNTO VARIO: Asunto: 149423; LAFLUF HEBEICH,
  O…». Esa fila registra que **Lema** intervino sobre un asunto que menciona a Lafluf; no dice que
  Lafluf dejara la banca el 25-11-2020.
- accion_sugerida: buscar la resolución de la Cámara sobre la renuncia (las tres salidas del
  25-11-2020 son el recambio de intendencias tras las departamentales de setiembre de 2020, como
  `notas.md` razona bien) o dejar el `hasta` con la sola fuente oficial y sin segunda fuente falsa.

### `amarilla-gerardo` y `castaingdebat-armando` — criterio distinto que `cardoso-german` y `lema-martin`
- severidad: corregir
- tipo: asimetria (de criterio, no de partido)
- objecion: a Cardoso (PC) y a Lema (PN) se les partió el mandato en dos por el pasaje al Ejecutivo;
  a Amarilla (PN) y a Castaingdebat (PN) se les dejó un mandato continuo pese a que la nómina
  archivada dice, en sus notas al pie, que estaban siendo sustituidos: «Sustituye al Representante
  Gerardo Amarilla mientras desempeñe el cargo de Subsecretario del Ministerio de Ambiente».
- accion_sugerida: un solo criterio escrito para los cuatro. El defendible es el nominal (la banca no
  se pierde por ir al Ejecutivo, la ejerce un suplente), y entonces habría que **rearmar** Cardoso y
  Lema, no partir Amarilla y Castaingdebat. Cualquiera de los dos, pero el mismo para todos.

### `cardoso-german` — mandato 2020-02-15 → 2020-03-01
- severidad: aviso
- tipo: contexto_omitido
- objecion: la cita del primer tramo («15-02-2020 Convocado a la Cámara de Representantes por el
  departamento de MALDONADO hasta el 14/02/2025 23:59») usa el mismo verbo «Convocado» que en
  `echeverria-solis` marca una suplencia. Acá el «hasta el 14/02/2025» indica titularidad, y la
  nómina archivada de la XLIX lo confirma; queda anotado para que el editor no aplique la lectura de
  Echeverría a este caso.

### `irigoin-pedro` y `olivera-ana` — salidas bien fechadas, cargo sin rótulo
- severidad: aviso
- tipo: contexto_omitido
- objecion: los dos `hasta` coinciden exactamente con lo que muestran sus páginas
  (`legisladores/12649/legislaturas-actuo`: «Legislatura L 02-03-2025 09-07-2025»;
  `legisladores/8089/legislaturas-actuo`: «Legislatura L 15-02-2025 01-03-2026»), y en Irigoin hay
  además un diario de sesiones que dice «Renuncia a la banca del señor representante Pedro Irigoin
  Macari». Bien hecho. Lo que falta es la línea del cargo para el tramo de la L, que en las dos
  fichas no está en ninguna cita. Olivera Ana sí tiene el rótulo para la XLIX.
- accion_sugerida: para Olivera, un diario de sesiones de 2025; el de Irigoin ya sirve.

### `umpierrez-javier` — mandato XLIX «2020-02-15 → 2023-03-07»
- severidad: aviso
- tipo: contexto_omitido
- objecion: la fila existe y coincide («Legislatura XLIX (2020-2025) 15-02-2020 07-03-2023»,
  `legisladores/10034/legislaturas-actuo`) y no está en la nómina de 2024, lo que es consistente con
  haber salido en 2023. Pero no hay ninguna fuente que diga «Representante» para ese tramo ni por
  qué salió. El mandato de la L sí lleva el rótulo.

### `blas-rodrigo`, `echeverria-solis`, `umpierrez-alejo` y Aníbal Pereyra — cuatro tratamientos para el mismo hecho
- severidad: corregir
- tipo: asimetria
- objecion: una suplencia de uno o dos días recibió, dentro del mismo lote, cuatro respuestas
  distintas: en Blás se cargó como mandato con la palabra «(suplente)» en el `cargo`; en Echeverría
  Solís como mandato de titular sin más; en Umpiérrez Alejo como mandato de titular con `salida:
  renuncia`; y en Aníbal Pereyra se decidió no hacerle ficha. Ninguna de las cuatro decisiones
  favorece a un partido en particular —Blás y Umpiérrez son del Nacional, Echeverría de Cabildo,
  Pereyra del Frente— pero el lector no puede saber por qué la misma cosa aparece de cuatro maneras.
- accion_sugerida: escribir el criterio y aplicarlo a los cuatro. El sitio ya distingue suplencias
  (`esSuplencia()` las dibuja rayadas), así que lo natural es registrarlas con `(suplente)` en el
  `cargo` cuando aportan algo, y no registrarlas cuando no. Y Aníbal Pereyra **necesita ficha**: es
  Representante titular de la L por Rocha, exactamente igual que Viera, Mahía, Antonini y Ferreira,
  a quienes sí se les hizo ficha, y así lo dice el documento oficial: «Sustituye al Representante
  Aníbal Pereyra mientras desempeñe el cargo de Senador de la República».

### Colisiones de alias (homónimos)
- severidad: corregir
- tipo: presentacion / riesgo_legal
- objecion: seis alias quedan compartidos por dos personas distintas, y tres de ellos con fichas ya
  publicadas:
  - «Delgado» → `delgado-juan-pablo` (PN, Canelones) **y** `content/politicos/delgado.yaml`
    (Álvaro Delgado, candidato presidencial).
  - «Mujica» → `mujica-gonzalo` (PN, Montevideo) **y** `content/politicos/mujica.yaml` (José Mujica).
  - «Salle» → `salle-nicolle` (IS) **y** `content/politicos/salle.yaml` (Gustavo Salle). Padre e
    hija, mismo partido, mismo departamento, misma legislatura: es la colisión más peligrosa del
    lote.
  - «Araújo» → `araujo-mary` (FA, Maldonado) y `araujo-yisela` (FA, Cerro Largo).
  - «Echeverría» → `echeverria-diego` (PN, Maldonado) y `echeverria-solis` (CA, Tacuarembó).
  - «Pereyra» → `pereyra-estela` (FA, Montevideo, L) y `pereyra-susana` (FA, Montevideo, XLIX); y
    falta Aníbal Pereyra, que sería el tercero.
- accion_sugerida: sacar el apellido solo de los alias en esos seis casos. Aviso para quien cargue
  los faltantes: **Daniel Martínez Escames** (PN, XLIX) chocaría con
  `content/politicos/daniel-martinez.yaml`; en la verificación mecánica de esta crítica el nombre del
  diputado se cruzó con el del ex intendente y hubo que separarlos a mano.
- reconocimiento: en cambio, las dos desambiguaciones que `notas.md` documenta están **bien
  resueltas** y las verifiqué: `silva-rubenson` usa el id 8307 y no el 13602 de Robert Silva (abrí
  8307: «Representante Nacional por el Lema PARTIDO FRENTE AMPLIO, departamento de RIVERA»), y
  `martinez-william` usa 12776 y no 12048 de Walter Gonzalo Martínez (abrí 12776: «…departamento de
  CANELONES»).

### Ids que quedarán mal y no se pueden renombrar después
- severidad: corregir
- tipo: presentacion
- objecion: los ids son la ruta del archivo y no se renombran nunca, así que hay que arreglarlos
  antes de `promover`.
  - `_slug: inthamoussou-pablo` contra `nombre: Pablo Inthamoussu` (una «o» de más en el id).
  - `_slug: rodriguez-carlos-florida` usa el departamento como desambiguador mientras
    `rodriguez-hunter-alvaro` y `rodriguez-juan-martin` usan el apellido; la persona es «Carlos
    Rodríguez Gálvez» y el id natural es `rodriguez-galvez-carlos`.
  - `pnpm validar --inbox` ya asigna `armas-paula`, `brum-horacio` y `mattos-alfredo` a
    `de-armas-paula`, `de-brum-horacio` y `de-mattos-alfredo`: el id final no será el `_slug`. Que el
    editor lo decida a conciencia y no por omisión.

### 67 fichas donde `nombre` es igual a `nombre_corto`
`abdala-pablo`, `amado-fernando`, `andujar-sebastian`, `cervini-walter`, `colman-mario`,
`de-mattos-alfredo`, `fajardo-maria`, `lema-martin`, `reisch-nibia`, `sabini-sebastian`,
`viana-pablo` y 56 más.
- severidad: corregir
- tipo: asimetria (de detalle, no de partido) / presentacion
- objecion: el brief pide `nombre` completo «como figura en el Parlamento». En 89 fichas hay nombre
  completo («Víctor Martín Aldaya González») y en 67 no («Pablo Abdala»). La misma ficha para todos
  incluye el mismo nivel de detalle para todos; si no, la página muestra a unos con dos apellidos y
  a otros con uno sin que eso signifique nada.
- accion_sugerida: `LegAlfab.pdf` y `LegxPartido.pdf` traen la forma oficial de casi todos y
  resuelven varios de una: «Cervini Pratto, Walter» (que `notas.md` dejó en duda: **es correcto**,
  aparece igual en las dos nóminas y en la de departamentos), «Fajardo Rieiro, María de los Ángeles»
  (hoy la ficha dice «María Fajardo Rieiro»), «Umpiérrez Diano, Javier».

### Fuentes: fechas, títulos y medio
- severidad: aviso
- tipo: presentacion
- objecion: tres detalles que la página muestra. (1) `fuentes[].fecha` a veces es la fecha del hecho
  y no la de la página (en `echeverria-solis`, `fecha: 2020-02-15` para una consulta de 2026). (2) El
  mismo documento aparece con cuatro títulos distintos («Parlamento UY», «Legislaturas»,
  «Legislaturas en las que actuó», «Actuación parlamentaria»), y la página agrupa las fuentes por
  publicador. (3) Ocho fuentes de `documentos.diputados.gub.uy` se declaran con `medio: parlamento`,
  cuyo `content/medios/parlamento.yaml` tiene `url: https://parlamento.gub.uy` y no lista ese dominio
  entre sus alias.
- accion_sugerida: unificar título por tipo de página, poner la fecha de consulta, y agregar
  `documentos.diputados.gub.uy` y `biblioteca.parlamento.gub.uy` a los alias del medio.

### Fichas sin objeción (91)

Verifiqué contra la fuente una muestra de estas y todas las que tenían dos mandatos: en las 20 que
abrí (`12665` Cairo, `12651` Cervini, `12657` Colman, `11598` Dastugue, `12515` Echeverría Diego,
`11413` Gianoli, `12679` Lima, `12680` Mesa, `9963` Osorio, `12667` Otero, `9936` Perrone, `12673`
Rodríguez Juan Martín, `10032` Rodríguez Gálvez, `11597` Rodríguez Conrado, `12504` Schipani, `12666`
Tucci, `7754` Varela, `3959` Amarilla, `12674` Viana, `11634` Díaz) la fila de la XLIX lleva el
rótulo del cargo y las fechas coinciden exactamente con lo cargado; en `8307`, `12776`, `13647`,
`12852`, `12663` y `13626` la línea «Representante Nacional por el Lema PARTIDO X, departamento de Y»
coincide con el partido y el departamento del registro. Las condenso en una lista, como pide el
punto 14 de la lista de control, en vez de repetir 91 bloques iguales:

- severidad: aviso (`sin_objecion`)
- tipo: sin_objecion
- motivo: mandato con la línea «Representante Nacional por el Lema…» en la cita, fechas coincidentes
  con la fuente, partido y departamento respaldados, sin salida anticipada que explicar.
- **Partido Nacional (18)**: abdala-pablo, albisu-carlos, auersperg-fernanda, bacigalupe-ruben,
  colman-mario, dastugue-alvaro, echenique-graciela, farinha-fermin, gianoli-gabriel, grezzi-andres,
  long-mercedes, niffouri-amin, pena-adriana, pereira-monica, radiccioni-javier,
  rodriguez-juan-martin, viana-pablo, viviano-alvaro.
- **Frente Amplio (44)**: aita-ubaldo, aldaya-victor, amado-fernando, antunez-tatiana,
  barreiro-gabriela, barrera-graciela, bottino-cecilia, cairo-cecilia, cortes-ines, diaz-bettiana,
  diverio-daniel, galan-lilian, gerhard-daniel, giometti-bruno, gorosterrazu-juan, hugo-claudia,
  larzabal-nelson, libschitz-margarita, lima-alvaro, lustemberg-cristina, malan-enzo, maneiro-sol,
  martinez-william, mato-veronica, mendez-anibal, mendiondo-constante, mesa-nicolas, nedov-sandra,
  noy-diana, nunez-gerardo, obaldia-maria-ines, olmos-gustavo, otero-gabriel, presa-marcos,
  preve-federico, reyes-carlos, rinaldi-magela, ruiz-federico, sierra-julieta, silva-rubenson,
  tierno-martin, tucci-mariano, varela-carlos, zavala-alejandro.
- **Partido Colorado (17)**: alvear-jorge, campo-maximiliano, castro-elianne, cervini-walter,
  estevez-omar, gurmendez-gabriel, jorge-juan-martin, juri-adrian, melazzi-martin, molins-marti,
  moreno-juan-carlos, osorio-marne, pasquet-ope, rosello-maria-eugenia, rydstrom-carlos,
  verri-walter, viera-mauricio.
- **Cabildo Abierto (9)**: albernaz-rodrigo, caballero-wilman, cal-sebastian, camargo-nazmi,
  capillera-elsa, perez-bonavita-silvana, perrone-alvaro, sodano-martin, testa-carlos.
- **Partido Independiente (2)**: posada-ivan, sotelo-gerardo. **Partido de la Gente (1)**: pena-daniel.
- Salvedad honesta: `mendiondo-constante` y `nunez-gerardo` entran acá porque su salida sí tiene un
  diario de sesiones que la dice con todas las letras («Renuncia a la banca del señor representante
  Constante Mendiondo» / «…Gerardo Núñez Fallabrino»); son el modelo de cómo debería quedar el resto
  de las salidas anticipadas. Y `cervini-walter` entra pese a la duda de `notas.md` sobre el segundo
  apellido: las tres nóminas oficiales dicen «Cervini Pratto, Walter».

---

## Objeciones al lote

### 1. Cobertura de la Legislatura L: faltan 14 personas con banca (bloquea)

Contra la nómina oficial del día de hoy (`LegxPartido.pdf`, 09/09/2026 08:11:46, «Cantidad de
Representantes: 99»), 86 de los 99 tienen ficha con mandato de la L. Faltan 13, más Aníbal Pereyra
(titular sustituido, no aparece en la lista de 99 pero el documento lo llama «el Representante Aníbal
Pereyra»), más el mandato de la L de Nicolás Viera, que tiene ficha sin ese mandato:

| Falta | Partido | Departamento | De dónde sale |
|---|---|---|---|
| Núñez, Fabricio | FA | a confirmar | nómina, columna FA |
| Reutor, Carlos | FA | a confirmar | nómina, columna FA |
| Badín, Cecilia (1) | FA | Colonia | `LegAlfab.pdf`: «Badín, Cecilia (1) FA Colonia»; sustituye a Viera |
| Tinaglini, Gabriel (5) | FA | Rocha | sustituye a Aníbal Pereyra |
| Camarán Cawen, Susana | FA | Montevideo | `LegAlfab.pdf` |
| Díaz Marrero, Natalia | FA | Montevideo | `LegAlfab.pdf` |
| Gallo, Luis Enrique (2) | FA | Canelones | `LegAlfab.pdf`; sustituye a Mahía |
| Garlo, Joaquín (3) | FA | Maldonado | sustituye a Antonini |
| Guerrero, Gustavo (4) | FA | Tacuarembó | sustituye a Ferreira |
| Pereyra, Aníbal | FA | Rocha | nota al pie 5 de `LegxPartido.pdf` |
| Britos, Miriam | PN | Artigas | `LegAlfab.pdf`; ocupa la banca que dejó Soravilla |
| Casaretto, Federico | PN | Maldonado | `LegAlfab.pdf` |
| Constenla, Pablo | PN | Salto | `LegAlfab.pdf` |
| Duque Barreto, Matías | PC | Canelones | `LegAlfab.pdf` |
| Salle Lorier, Gustavo | IS | Montevideo | ya tiene ficha (`content/politicos/salle.yaml`); solo le falta la fuente oficial, que `notas.md` deja escrita |

`notas.md` acertó al excluir a Aníbal Pereyra del lote *de la L* por ser senador, pero la
consecuencia —que no exista ficha— es lo contrario de lo que el brief pide, y es incoherente con
Mahía, Antonini, Ferreira y Viera, que están en la misma situación exacta y sí la tienen. Además
`notas.md` afirma que Tinaglini es «por Rocha, PN»: Tinaglini es del Frente Amplio, y conviene que
esa frase no se arrastre a ningún registro.

El brief dice «o tienen ficha todos los que votan, o ninguno». Con 14 faltantes, las votaciones de la
L no se pueden enlazar completas, que es para lo que se hizo el lote.

### 2. Cobertura de la Legislatura XLIX: faltan 32 (bloquea)

Contra la nómina archivada al 22/07/2024 (99 titulares), 67 tienen mandato de la XLIX. De los 32
restantes, 13 tienen ficha en este lote sin ese mandato (los doce listados arriba más Blás, con la
suplencia en lugar del mandato) y **19 no tienen ficha en ninguna parte**:

Amigo Díaz, Oscar · Algorta Brit, Felipe · Burgoa González, Laura · Corbo, Milton · Fuentes, Pablo
Andrés · Gallo Cantera, Luis Enrique · Guadalupe, Eduardo · Inzaurralde, Alexandra · Lereté, Alfonso
· Martínez Escames, Daniel · Melgar, Micaela · Menéndez, Rafael · Mirza Perpignani, Adel · Núñez
Soler, Nancy · Olano Llano, José Quintín · Onetto Linale, Gonzalo Andrés · Reutor, Carlos · Tinaglini,
Gabriel · Tort González, Carmen.

Tres de esos diecinueve estaban ejerciendo como suplentes de un titular en el Ejecutivo (Burgoa por
Castaingdebat, Guadalupe por Amarilla, Jisdonian por Olaizola), lo que además prueba que Olaizola,
Amarilla y Castaingdebat fueron titulares de la XLIX.

Sobre esto `notas.md` es honesto y hay que subrayarlo: los dos lotes de la XLIX escriben que **no se
hizo un censo independiente de los 99** y que se investigó exactamente a las personas de la lista del
brief. Eso explica el hueco y no lo justifica, porque el brief pedía los 99.

### 3. Las exclusiones de `notas.md`, una por una

| Excluido | Fundamento del lote | Veredicto |
|---|---|---|
| Alejandro Sánchez (FA) | su `legislaturas-actuo` no registra tramo de Diputados en la XLIX, y dos diarios de sesiones muestran el pasaje al Senado en octubre de 2020 | **fundado**; y no está en la nómina de 2024. Aun así conviene revisar si fue titular entre febrero y octubre de 2020 |
| Gustavo Penadés (PN) | fila sin rótulo de Representante y Wikipedia diciendo que ocupó una banca de Senador desde el 01-03-2020 | **fundado**; tampoco está en la nómina de 2024 |
| Aníbal Pereyra (FA) | es senador | **no fundado como exclusión total**: es Representante titular de la L (nota al pie 5). Necesita ficha |
| Gabriel Tinaglini (FA) | sigue en la L, así que iba en el otro lote | **fundado como razonamiento, fallido como resultado**: el lote de la L tampoco lo cargó y quedó sin ficha en las dos legislaturas |
| Rodrigo Blás (PN) | no encontró fuente de banca titular | **refutado**: está entre los 99 de la XLIX al 22/07/2024 |
| Nibia Reisch, Álvaro Rodríguez Hunter, Alfredo De Mattos, Sebastián Andújar, Rodrigo Goñi, Nicolás Lorenzo | filas de uno a tres días | **refutado para los seis**: los seis están entre los 99 de la XLIX. En Lorenzo, además, la fuente citada ya traía el mandato completo con su rótulo |
| Pablo Viana, departamento Montevideo y no Canelones | diario de sesiones del 16-07-2024 | **fundado y bien hecho**; la nómina archivada lo confirma. El descarte del `Bio00461.PDF` equivocado, también |

### 4. Lo que el lote hizo bien y conviene no perder

- Encontró y corrigió dos ids de homónimo antes de citar (Robert Silva por Rubenson Silva; Walter
  Gonzalo Martínez por William Martínez). Las verifiqué las dos.
- Rechazó una biografía en PDF que resultó ser de otra persona antes de que llegara al registro.
- Documentó la regla empírica de desordenamiento del PDF de tres columnas en vez de esconderla.
- Documentó una falla de extracción y su arreglo en `scripts/lib/extraer.ts` (`if (!texto)` →
  `if (!texto || texto.length < 200)`). No la evalúo: es infraestructura, no `content/`, pero el
  mantenedor debería mirarla antes del próximo `build` porque cambia el comportamiento de
  `pnpm fuente` para todo el sitio.
- No inventó nada donde no había fuente; todos los huecos que encontré están declarados en
  `notas.md`. El problema no es ocultamiento: es que varias decisiones prudentes resultaron
  equivocadas cuando aparece el documento que el lote no buscó.

### 5. Consecuencia para el sitio, no para el lote

Al promover 156 políticos sin registros, el validador de simetría pasa a listar entre 150 y 175
nombres en el aviso de cada tema («Cobertura asimétrica: … sin ningún registro en este tema:
abdala-pablo, aita-ubaldo, …»), y lo mismo hará la página del tema. Es el punto 14 de la lista de
control: una lista de 170 renglones iguales no informa. Sugerencia para el editor o para una tarea
aparte: condensar ese aviso a un número con enlace («170 legisladores con mandato en el período y sin
registros»), como hace el punto 15 con los contadores.

---

## Objeciones al brief

Regla 0: **el brief no la viola**. Pide los 99 de cada legislatura, de todos los partidos, con la
misma ficha, sin adjetivos y sin «conocido por», y la salida cumple ese criterio: no hay un solo
adjetivo valorativo en las 156 fichas, ni un dato cargado para un partido que no se haya buscado para
los demás. Los cuatro `notas.md` responden «ninguna» a `objeciones_al_brief` y coincido.

Dos observaciones que sí corresponden:

1. **La lista de nombres del brief se usó como si fuera la fuente.** Traía por lo menos cinco errores
   (Blás y Tinaglini como si no fueran titulares donde lo son, Alejandro Sánchez y Penadés como
   diputados, Viana en Canelones) y el brief mismo dice que Wikipedia «es solo un índice para no
   olvidar a nadie». Los investigadores hicieron lo correcto al corregir el brief contra el documento,
   pero la lista se usó también como *cierre* del universo: los dos lotes de la XLIX investigaron
   exactamente a las personas nombradas. De ahí los 32 huecos. El brief debería haber dado el
   procedimiento de censo, que existe: `documentos.diputados.gub.uy/docs/LegxPartido.pdf` (o
   `LegAlfab.pdf`) para la legislatura en curso y la captura de Wayback para la anterior. Verifiqué el
   índice CDX: para ese PDF hay **una sola** captura archivada (20240722), así que para reconstruir
   los movimientos intermedios de la XLIX hay que ir a los diarios de sesiones. Y
   `documentos.diputados.gub.uy/docs/SesionesPreparatorias/ListaProclamados.pdf`, que `notas.md`
   menciona, hoy da HTTP 404.
2. **El brief fijó la plantilla `desde: 2020-02-15 / hasta: 2025-02-14` antes de mirar los datos.**
   Eso empujó a llenar el molde con la fila que hubiera, y es el origen del error de método descrito
   arriba. La versión correcta sería: sin la línea que nombra el cargo, no hay mandato.

Nada de esto se aplicó distinto a un partido que a otro, y así debe corregirse: el mismo documento
que se le exige a un diputado se le exige a los 99.

---

## Cobertura

**Ningún registro de `cobertura`, y no por olvido.** Los registros de tono se emiten «por cada nota de
prensa leída en el lote», y en este lote no se leyó ninguna: las 274 fuentes se reparten en 239 de
`parlamento.gub.uy`, 24 de `biblioteca.parlamento.gub.uy` (diarios de sesiones), 8 de
`documentos.diputados.gub.uy` y 3 de `es.wikipedia.org` (una enciclopedia, no un medio periodístico,
y su propia ficha de medio la declara `alineamiento: sin_datos`). No hay nada de qué medir el tono, y
fabricar registros de tono sobre documentos oficiales sería inventar una métrica.

```yaml
# ninguno
```

**`discrepancias.yaml`: no se escribe, y también con motivo.** Encontré varias distancias entre
documentos —`legislaturas-actuo` contra la nómina de titulares en Lust, Etcheverry, Rodríguez Hunter,
Andújar, Goñi, De Mattos, Blás y Soravilla— pero las dos partes son publicaciones del mismo organismo
oficial, no un medio contra el documento que lo decide. El esquema de `discrepancias` mide lo
segundo. Van como objeción de registro, que es donde corresponden.

---

## Resumen

- Objeciones que **bloquean**: 9 registros (`mahia-jose-carlos`, `caggiani-daniel`,
  `sabini-sebastian`, `lust-eduardo`, `etcheverry-lucia`, `echeverria-solis`, `umpierrez-alejo`,
  `soravilla-emiliano`, `castaingdebat-armando`) y 2 objeciones de lote (cobertura de la L y de la
  XLIX).
- Objeciones a **corregir**: 52 registros (los que no tienen ninguna objeción que bloquee), agrupados en 13 objeciones temáticas.
- **Avisos**: 4 registros cuya única objeción es informativa (`cardoso-german`, `irigoin-pedro`, `olivera-ana`, `umpierrez-javier`), más las objeciones de forma de fuentes y la de simetría del sitio.
- **Sin objeción**: 91 registros.
- El lote **no está en condiciones de publicarse completo**. Sí podría promoverse, si el editor
  quiere avanzar por partes, el subconjunto de 91 fichas sin objeción más las que solo tienen
  objeciones de forma (alias, ids, nombre completo), dejando las 65 restantes para una segunda vuelta
  del investigador con los cuatro documentos de nómina en la mano. Pero mientras falten las 14
  personas de la L, el enlace con `content/votaciones/` va a quedar incompleto, que era el motivo del
  encargo.
