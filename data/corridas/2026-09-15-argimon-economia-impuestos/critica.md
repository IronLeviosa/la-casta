# Crítica — corrida 2026-09-15-argimon-economia-impuestos

Lote: inbox/argimon/economia/impuestos/2026-09-15/
Registros revisados: 0. Las cuatro colecciones del lote (`declaraciones`, `promesas`, `menciones`,
`chequeos`) están vacías: son listas `[]` con un comentario de cabecera. No hubo muestra porque no
hay registros que muestrear.

Lo que se critica acá, entonces, no es una ficha sino **el resultado negativo**: la afirmación de
que Beatriz Argimón no fijó posición propia sobre impuestos en 35 años de vida pública. Un
resultado negativo es una afirmación sobre una persona y se publica (`presentacion.md`, punto 13:
una sección sin registros lleva un `cobertura: {texto, fecha}` que explica qué existe, de dónde
sale y qué falta). Por lo tanto se somete al mismo estándar de evidencia que cualquier registro:
vale hasta donde llegó la búsqueda, y la búsqueda tiene que estar declarada.

Releí las cinco notas de prensa del lote con `pnpm fuente --buscar`, los dos diarios de sesiones y
la biografía oficial, y corrí búsquedas propias en corpus y web para intentar falsear el resultado.
**No conseguí falsearlo**: no encontré una sola cita de Argimón fijando posición sobre un impuesto
o una tasa. En ese sentido el hallazgo es genuino y el trabajo es serio. Pero el barrido tiene un
hueco de nueve años sin declarar y cuatro caminos oficiales legibles que no se recorrieron, y
mientras eso siga así el texto que se publique no puede decir «35 años» ni «nunca».

## Resumen

```yaml
- registro: lote
  severidad: bloquea
  tipo: asimetria                 # el tramo 2010-2019 no está en cobertura_del_periodo
- registro: lote
  severidad: corregir
  tipo: documento_previsible      # registro oficial de comisiones legible y no usado
- registro: lote
  severidad: corregir
  tipo: contexto_omitido          # hallazgo de consultas.jsonl que no llegó a notas.md
- registro: lote
  severidad: corregir
  tipo: documento_previsible      # sesiones 2001-2002: falló una ruta, no todas
- registro: lote
  severidad: corregir
  tipo: un_solo_grupo             # la ausencia no se probó contra medios progresistas
- registro: lote
  severidad: corregir
  tipo: presentacion              # falta el cobertura.texto y notas.md no sirve de borrador
- registro: lote
  severidad: corregir
  tipo: riesgo_legal              # «siempre procedimental, nunca de fondo» excede lo verificado
- registro: lote
  severidad: aviso
  tipo: asimetria                 # casos_vistos solo registra a Argimón como comentarista
- registro: lote
  severidad: aviso
  tipo: contexto_omitido          # fecha de INAME: el brief dice 1990, el documento oficial 1995
```

## Objeciones por registro

No hay registros. Todas las objeciones son al lote y van en la sección siguiente.

Dejo asentado, como pide la regla, **lo que sí verifiqué y no tiene objeción**, porque la ausencia
de crítica también se audita:

- **El resultado negativo sobre las cinco notas del lote es correcto.** Releí las cinco con
  `pnpm fuente --buscar` sobre `impuesto | impuestos | tributar | IVA | IRPF | fiscal | recaudación`
  y en ninguna hay una posición tributaria de Argimón. En la nota de El País titulada «Argimón y la
  economía pos-COVID» —el candidato más obvio a contenido tributario— los siete términos dan «sin
  coincidencias»: la nota habla de mercados, Mercosur, Brexit y Asia. La de la diaria de 2019 tampoco
  tiene ninguno de los términos. La de Búsqueda sobre la OCDE tampoco (`impuesto`, `fiscal` y
  `mínimo global`: sin coincidencias). El «Impuesto Mínimo Global» aparece solo en la nota de
  Ámbito y es encuadre del diario, no palabras de Argimón; `notas.md` lo dice bien.
- **La lectura del diario de sesiones del 3/5/2022 es correcta.** La verifiqué por mi cuenta con
  `--indice --politico argimon --tema economia/impuestos`: Argimón aparece en el encabezado
  («PRESIDEN BEATRIZ ARGIMÓN Presidenta») y como destinataria de dos oficios («Señora Presidenta de
  la Cámara de Senadores Beatriz Argimón De mi mayor consideración»). Los doce tramos de contenido
  tributario son de otros senadores. La conclusión «preside, no interviene» se sostiene en esa sesión.
- **Los enlaces `legislativo.parlamento.gub.uy/temporales/…` fallan de verdad.** Probé un cuarto
  enlace que el investigador no había probado (la sesión del 20/8/2002) y también devolvió
  `fetch failed`. `verificacion_manual` está bien levantada; el problema es la conclusión que se
  saca de ella (ver objeción 4).
- **La biografía oficial confirma que nunca integró Hacienda**: el término «Hacienda» da «sin
  coincidencias» en el PDF. Lo que no confirma es que la lista de comisiones esté completa
  (objeción 2).

## Objeciones al lote

### 1. `bloquea` · asimetria — faltan nueve años en un barrido que se presenta como completo

`notas.md` organiza la cobertura en tramos: **1989-2000, 2000-2010, 2019-2020, 2020-2025,
2025-presente**. Entre 2010 y 2019 no hay tramo. No se declara como hueco: directamente no existe
en la lista, de modo que el lector de `notas.md` no tiene forma de notar que falta.

No es un período muerto. La biografía oficial que la propia corrida leyó dice, literalmente:

> «2018 – 2020: Presidenta del Directorio del Partido Nacional, siendo la primera mujer en presidirlo»
> «2015 - 2018: Se destacó como Panelista en el programa televisivo "Esta Boca es Mía", donde estuvo 3 años.»
> (https://parlamento.gub.uy/sites/default/files/personas/biografias/BEATRIZ_ARGIMON.pdf)

Y una tercera fuente del corpus la ubica antes todavía: «En el año 2009 fue parte del Directorio del
Partido Nacional» (historia-biografia.com, 2019-12-11, id de corpus `463885de60`).

O sea: entre 2010 y 2019 fue integrante del Directorio del principal partido de oposición,
panelista diaria en televisión durante tres años y, desde abril de 2018, **presidenta de ese
partido**. Es el tramo de su carrera en que más probable es que hablara en público sin estar
presidiendo una sesión —que es, justamente, el argumento con el que el lote explica su silencio en
2020-2025—. Y coincide con la mayor controversia tributaria de la década (el aumento de IRPF e
IASS de la Rendición de Cuentas de 2016).

El barrido no cubrió ese tramo por ninguna vía:

- `consultas.jsonl` no tiene ninguna consulta que la cruce con su rol partidario (ni «Directorio»,
  ni «presidenta del Partido Nacional», ni «Esta Boca es Mía»).
- Las tres corridas de `pnpm descubrir elpais.com.uy` arrancan en **2019-06** (líneas 49, 50 y 51).
  El sitemap de El País, que el brief señala como la única vía para ese diario, no se consultó para
  2010-2019.
- La única consulta de corpus con recorte temporal propio en ese tramo la hice yo
  (`Argimón ajuste fiscal --desde 2010-01-01 --hasta 2019-12-31`): sin resultados.

**Explicación alternativa, a favor del lote:** el hueco puede estar realmente vacío. Sin banca
parlamentaria no hay diario de sesiones, la búsqueda de corpus que corrí no dio nada, y las dos
notas de El Observador de 2018 sobre su llegada a la presidencia del partido —que abrí durante esta
crítica— no contienen ninguno de los ocho términos tributarios. Es perfectamente posible que el
resultado no cambie. Pero «probablemente vacío» y «buscado» no son lo mismo, y la diferencia es
exactamente lo que `presentacion.md` punto 5 llama faltar a la Regla 0: «Lo que existe públicamente
se carga entero o se dice hasta dónde se cargó; ocultar años sin decirlo es faltar a la Regla 0».

**accion_sugerida:** dos caminos, cualquiera sirve, pero hay que tomar uno.
(a) Que un corrector barra 2009-2019 con el mismo esfuerzo que el resto: `pnpm descubrir
elpais.com.uy --desde 2009-01 --hasta 2019-06 --terminos argimon`, consultas de corpus y web
cruzando su nombre con «Directorio», «presidenta del Partido Nacional», «Rendición de Cuentas 2016»,
«ajuste fiscal», «IRPF», y las dos notas de El Observador ya identificadas abajo.
(b) Si no se barre, que el texto publicado diga el período realmente cubierto y nombre el hueco, y
que desaparezcan de todo texto para el lector las formulaciones «35+ años», «1989-2026» y «en toda
su carrera». Lo que no puede pasar es publicar el alcance máximo con la cobertura parcial.

### 2. `corregir` · documento_previsible — el registro oficial de comisiones es legible y no se usó

El argumento central del lote es de improbabilidad institucional: nunca integró una comisión
económica, luego no se esperan declaraciones tributarias. `notas.md` lo apoya en la biografía
oficial («comisiones de Educación y Cultura y de Ordenamiento Territorial, nunca Hacienda»).

Esa biografía **no es un registro completo de comisiones**. Lo comprobé: el Parlamento publica la
actuación de cada comisión por legislatura, con exportación CSV, y `pnpm fuente` la lee sin
problema (15.767 caracteres, filas citables con fecha, acta, integrantes, asistencias, temas
tratados y resoluciones). La ruta es:

    https://parlamento.gub.uy/camarasycomisiones/representantes/comisiones/<id>/comision-actuacion/csv?Fechadesde=2000-02-15&Fechahasta=2005-02-14&_format=csv

Corriéndola sobre la comisión 850 aparecen filas como:

> «"Martes, Abril 2, 2002 - 12:10 - 14:00","Acta: 19",850,"ESPECIAL EMIGRACION (00)",,"Raúl Argenzio fin - , Beatriz Argimón fin - , Felipe Michelini fin - …»

Es decir: Argimón integró la **Comisión Especial de Emigración** en 2001-2002, y esa comisión **no
figura en su biografía oficial**. La fuente en la que descansa el argumento de improbabilidad tiene
al menos una omisión demostrada. Eso no prueba que haya estado en una comisión tributaria —de
hecho, busqué `impuesto | tributar | exoneración | franquicia | arancel | tributo` en ese mismo CSV
y da «sin coincidencias» en los 15.767 caracteres—, pero sí invalida el uso de la biografía como
censo de comisiones.

A esto se suma que `parlamento.gub.uy/camarasycomisiones/legisladores/3237` —su ficha oficial de
legisladora, que es donde se listan las comisiones por período— está en el corpus con **212
caracteres de texto**: es un armazón JavaScript que nunca extrajo contenido. Figura como leída y no
lo está.

**accion_sugerida:** correr el CSV de `comision-actuacion` sobre las comisiones con competencia
tributaria (Hacienda, Presupuesto, y las especiales e investigadoras del período) para las dos
legislaturas 2000-2005 y 2005-2010, y sobre esa base afirmar o retirar la frase «nunca integró una
comisión económica». Organismo: Parlamento del Uruguay. Es un documento previsible, público y
legible por `pnpm fuente`; no corresponde `verificacion: manual`.

### 3. `corregir` · contexto_omitido — un hallazgo quedó en `consultas.jsonl` y no llegó a `notas.md`

La línea 37 de `consultas.jsonl` registra:

> `{"tipo":"busqueda","q":"site:gub.uy \"Beatriz Argimón\" impuestos","resultado":"9 links; hallazgo: comisión parlamentaria 2002 sobre reintegros a agroexportadores"}`

Los reintegros a exportadores son materia tributaria (devolución de tributos), el año cae dentro
del tramo que el propio lote declara como hueco, y la palabra «hallazgo» la puso el investigador.
Ese hallazgo **no aparece en ninguna parte de `notas.md`**: ni en `hipotesis`, ni en
`cobertura_del_periodo`, ni en `verificacion_manual`. Intenté reproducirlo y no pude (mis búsquedas
devuelven normativa argentina de 2002, no uruguaya), así que no puedo decir qué es ni si importa
—y precisamente por eso tiene que quedar escrito.

El patrón es el que más preocupa en un resultado negativo: el rastro de consultas contiene un
indicio a favor de que hay algo, y el documento que resume el trabajo no lo menciona. Sea cual sea
el motivo (se verificó y no era ella, era ruido, se agotaron los turnos), la asimetría entre los
dos archivos hay que cerrarla.

**accion_sugerida:** recuperar esa consulta y dejar en `notas.md` una línea con el desenlace: qué
comisión era, si Argimón la integraba y qué se resolvió; o, si resultó ruido, decir eso con el
motivo. Si quedó sin verificar, va a `hipotesis` como las otras tres.

### 4. `corregir` · documento_previsible — de las sesiones de 2001-2002 falló una ruta, no todas

`notas.md` concluye que el plenario de 2001-2002 es inalcanzable. La evidencia que ofrece es real
pero parcial: fallan los enlaces `legislativo.parlamento.gub.uy/temporales/…` (lo confirmé con un
cuarto enlace propio) y `pnpm inventario biblioteca.parlamento.gub.uy --filtro sesionescrr` muestra
cobertura de Wayback muy despareja.

Las dos cosas que fallaron son **la misma cosa**: enlaces efímeros del sitio legislativo, y Wayback.
La corrida, en cambio, leyó con éxito dos diarios de sesiones por la ruta estable de la Biblioteca:

    https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescss/2020-09-08 - DIARIO DE SESIONES DE LA CAMARA DE SENADORES (0030).pdf

`sesionescss` es Senadores; el equivalente de Representantes es `sesionescrr`, y el corpus ya tiene
documentos de esa carpeta (aparecieron en mis búsquedas: `sesionescrr/2005-09-27 - … (0053).pdf`,
`sesionescrr/2005-08-09 - … (0041).pdf`, `sesionescrr/2005-06-02 - … (0023).pdf`). O sea que la
ruta existe, funciona y ya se usó; lo único que falta para 2001-2002 es el número de sesión, no el
camino. Buscarlo en Wayback fue la decisión equivocada: el documento vive en el sitio de la
Biblioteca, no en el archivo.

Esto importa porque 2001-2002 es la crisis, con paquetes tributarios de urgencia, y ella era
diputada de un partido entonces socio de gobierno. Es el tramo con mayor probabilidad a priori de
contener un voto o una intervención tributaria en toda su etapa parlamentaria; el propio lote lo
dice en `hipotesis`.

**accion_sugerida:** ubicar el número de sesión por el buscador de documentos del propio Parlamento
(`parlamento.gub.uy`, «Búsqueda de Documentos y Leyes») o por el índice de `sesionescrr`, y leer el
PDF por la ruta de Biblioteca con `pnpm fuente --indice --politico argimon --tema economia/impuestos`.
Organismo: Parlamento del Uruguay (Biblioteca). Mientras no se haga, el hueco de 2001-2002 tiene
que estar declarado en el texto publicado, no solo en `notas.md`.

### 5. `corregir` · un_solo_grupo — la ausencia no se probó contra los medios que más la buscarían

Para un registro afirmativo, la regla de dos grupos protege contra que un solo medio invente algo.
Para un resultado **negativo** el riesgo es el simétrico: que la ausencia sea un artefacto de qué
medios se miraron. Si una figura del Partido Nacional dijo algo incómodo sobre impuestos, los
medios con más incentivo a registrarlo son los de alineamiento opuesto.

Los medios efectivamente leídos son: `busqueda` (magnolio, sin_datos), `el-pais` (scheck-aguirre,
oficialista_tradicional), `ambito` (grupo-ambito, sin_datos), `el-observador` (werthein-hochbaum,
sin_datos) y `la-diaria` (cooperativa-la-diaria, independiente). La distribución de grupos es
razonable y hay que reconocerlo: incluye un `oficialista_tradicional` y un `independiente`, que es
mejor que el promedio del sitio que el propio brief critica.

Lo que falta es el otro extremo: **`brecha` y `la-republica` (los dos `progresista`) no aparecen ni
una vez en `consultas.jsonl`**, ni como búsqueda ni como lectura. El brief lo pedía explícitamente
(regla 5: «probá si el hecho está cubierto por El País (oficialista_tradicional), Brecha o La
República (progresista), o Búsqueda») y señalaba que La República ya se lee bien. `medios_faltantes`
dice «Ninguno», lo cual es cierto en el sentido de que están todos en la tabla, pero oculta que dos
de ellos no se consultaron.

**accion_sugerida:** correr las consultas de corpus y web contra `brecha` y `la-republica` con los
alias del tema, en el período completo, antes de dar la ausencia por establecida. Si tampoco hay
nada, eso refuerza el resultado negativo y hay que decirlo: una ausencia confirmada desde los dos
alineamientos vale mucho más que una ausencia confirmada desde uno.

### 6. `corregir` · presentacion — falta lo único que este lote puede publicar, y el borrador disponible no sirve

Un lote vacío igual produce texto: `presentacion.md` punto 13 dice que una sección sin registros se
resuelve con `cobertura: {texto, fecha}` de cinco o seis oraciones que digan qué existe, de dónde
sale, qué falta y por qué. El lote no entrega nada de eso; entrega comentarios de cabecera en los
cuatro YAML y `notas.md`.

Y `notas.md` no puede reciclarse tal cual, porque está escrito en el lenguaje de proceso que
`presentacion.md` prohíbe en todo texto que la página imprime: «en esta corrida» (cuatro veces),
«no pude leer el texto», «Un investigador con más turnos podría», «ver `verificacion_manual`»,
«se corrió `pnpm descubrir`», nombres de archivo y de comandos. Si el editor lo levanta,
`pnpm revisar:paginas` lo rechaza sobre el sitio construido.

**accion_sugerida:** que el editor redacte el `cobertura.texto` en oraciones para un lector que no
sabe qué es una corrida, y que ese texto incorpore el alcance real del barrido (objeción 1) y los
huecos de 2001-2002 y 2010-2019. Algo con esta forma, sin ids ni nombres de herramientas: qué
cargos ocupó, en cuáles tuvo competencia tributaria, qué se revisó (prensa, diarios de sesiones del
Senado, biografía oficial), qué no se pudo revisar y por qué, y desde cuándo hasta cuándo.

### 7. `corregir` · riesgo_legal — «siempre procedimental, nunca de fondo» afirma más de lo verificado

`notas.md` generaliza: «su presencia documentada es siempre procedimental (preside, tramita el
mensaje del Poder Ejecutivo, pide que se vote) y nunca de fondo». Para las dos sesiones leídas
verifiqué que es exacto. Como frase sobre su conducta fiscal en general, no lo es.

En su discurso de asunción como presidenta del Partido Nacional, Argimón pidió algo concreto sobre
un proyecto fiscal:

> «Argimón, en tanto, dedicó un espacio a las mujeres de su partido y aprovechó para pedirle a los
> legisladores presentes que al momento de votar el proyecto de ley de Rendición de Cuentas tengan
> en cuenta "la existencia de una partida específica para profesionales que realicen las entrevistas
> a padres adoptantes".»
> (El Observador, 2018-04-16, https://www.elobservador.com.uy/nota/beatriz-argimon-asumio-como-primera-presidenta-mujer-del-partido-nacional-201841620500)

Es gasto, no un impuesto ni una tasa, y por eso **hace bien** en no entrar a este lote: el tema es
«creación, aumento, rebaja o exoneración de impuestos y tasas». Pero muestra que sí interviene de
fondo en materia presupuestaria cuando le importa el asunto, lo que desarma la explicación
institucional en su versión fuerte («por diseño modera el debate en lugar de participar en él») y
deja en pie solo la versión débil y correcta: sobre impuestos y tasas no se le encontró posición propia.

La distinción no es cosmética. La versión estrecha es defendible con la evidencia que hay; la
versión amplia es una caracterización de la persona que ninguna fuente respalda, y es la que corre
riesgo si alguien exhibe una declaración suya de fondo sobre presupuesto o gasto.

**accion_sugerida:** que el texto para el lector afirme solo lo verificado —no se encontró una
declaración suya sobre impuestos o tasas en las fuentes revisadas y en el período revisado— y que
no describa su rol como «siempre procedimental» ni «nunca de fondo». Mismo criterio para cualquier
otra persona con ficha: la conclusión se escribe del tamaño de la búsqueda.

### 8. `aviso` · asimetria — `casos_vistos` registra solo los casos donde ella comenta

Las cuatro entradas de `casos_vistos` (Penadés, Manini Ríos, Astesiano, Marset) tienen la misma
estructura: Argimón como comentarista de un caso ajeno. Ninguna la tiene a ella o a su entorno como
objeto. Mientras tanto, el corpus contiene una nota etiquetada `argimon` que salió en una de mis
búsquedas: «La hermana de Argimón y otros temas pendientes en la Jutep» (El Observador, 2020-08-03,
id de corpus `a24ad75d65`).

No estoy afirmando irregularidad alguna, ni pidiendo que se investigue: la regla 12 dice
expresamente que los casos van por el barrido simétrico y que un investigador que ve uno solo anota
una línea. Puede incluso ser que esa nota quede fuera del umbral por no tratarse de un caso
judicial sino de una designación. Lo que corresponde es que el umbral esté escrito y se aplique en
las dos direcciones: si entra «Argimón comentó el caso Astesiano», hay que decir por qué no entra
—o sí— una nota sobre una designación que la involucra. Un `casos_vistos` que solo registra a la
persona investigada como comentarista de terceros es, en agregado, un sesgo favorable.

**accion_sugerida:** una línea en `casos_vistos` con el criterio aplicado, ida y vuelta. El mismo
criterio para todas las personas con ficha.

### 9. `aviso` · contexto_omitido — la fecha de INAME del brief no coincide con el documento oficial

El brief y `notas.md` datan su dirección del INAME en **1990-1995**. La biografía oficial del
Parlamento dice:

> «1995: Nombrada Directora del Instituto Nacional del Menor (Actual INAU)»
> (https://parlamento.gub.uy/sites/default/files/personas/biografias/BEATRIZ_ARGIMON.pdf)

No afecta la conclusión de este lote (ninguno de los dos fechados le da competencia tributaria),
pero `notas.md` usa ese cargo como parte del argumento de improbabilidad institucional, y la ficha
de la persona puede estar arrastrando una fecha que el documento oficial no respalda. No va a
`discrepancias.yaml` porque esa colección compara lo que publicó un medio contra la fuente
primaria, y acá el desacuerdo es entre nuestro propio brief y el documento.

**accion_sugerida:** pista para la colección `politicos`: cotejar `mandatos` de la ficha de Argimón
contra la biografía oficial.

### Lo que no encontré: sin `discrepancias.yaml`

Releí las cinco notas del lote y no hallé ningún caso en que lo publicado por un medio contradiga
un documento primario. El único punto donde prensa y documento podrían haber divergido —la
atribución del «Impuesto Mínimo Global» en la nota de Ámbito— resultó ser encuadre editorial
correctamente identificado como tal en `notas.md`, no una cita mal atribuida a Argimón. **No se
escribe `discrepancias.yaml` para este lote.**

### Estado del lote

Por la regla 16, este lote **no debe cerrarse como «no existe nada»**. Por el propio relato del
investigador quedó incompleto (tres hipótesis abiertas, tres enlaces caídos), y esta crítica agrega
un hueco de nueve años y cuatro rutas oficiales sin recorrer. Las salidas legítimas son dos: que un
corrector complete las objeciones 1 a 5, o que se publique un `cobertura.texto` que diga exactamente
hasta dónde llegó el barrido. Publicar «35 años sin una sola posición» con esta cobertura sería
afirmar más de lo que las fuentes respaldan.

## Objeciones al brief

**Regla 0: el brief no la viola.** Pide el período completo, los dos signos («favorable o
desfavorable, consistente o contradictorio»), invita a objetar y no direcciona hacia ningún partido
ni persona. Coincido con `objeciones_al_brief` del investigador. Tampoco hay nada que rechazar en la
consigna que recibí para esta crítica: era una carpeta y un destino.

**Un defecto estructural, no ideológico, que causó la objeción 1.** La tabla de mandatos del brief
(sección 1) lista solo cargos de Estado: INAME, Representante Nacional, Vicepresidenta, Embajadora.
No incluye los cargos partidarios, y por eso su presidencia del Directorio del Partido Nacional
(2018-2020) y su integración del Directorio (desde 2009) no aparecen en ningún lado; el
investigador construyó sus tramos de cobertura siguiendo esa tabla y el hueco 2010-2019 salió de
ahí casi mecánicamente.

Esto va a repetirse con cualquier figura que haya tenido peso público fuera del Estado, y el efecto
es sistemáticamente el mismo: se pierden justo los años en que una persona habla sin las
restricciones del cargo. Además es un sesgo que golpea distinto según la trayectoria —beneficia a
quien pasó mucho tiempo en la oposición o en la conducción partidaria—, así que corregirlo es
materia de Regla 0.

**Versión simétrica propuesta:** que `pnpm brief` incluya en el período a cubrir los cargos
partidarios y los roles públicos no estatales (conducción de partido, banca en medios, cátedra),
con la misma regla para todos los partidos y todas las personas, y que la sección
`cobertura_del_periodo` de `notas.md` lleve un tramo por cada uno de esos períodos aunque el
resultado sea vacío. Un tramo declarado vacío es información; un tramo ausente es un agujero.

## Cobertura

```yaml
- medio: el-pais
  url: https://www.elpais.com.uy/informacion/politica/argimon-y-la-economia-pos-covid-uruguay-tiene-posibilidades-y-debemos-salir-a-la-busqueda
  fecha: 2021-01-14
  evento: pandemia-covid
  politico: argimon
  tono: neutral
  justificacion: >-
    Reproduce sus dichos con verbos descriptivos y sin adjetivos propios: «La vicepresidenta
    Beatriz Argimón, en su podcast "La otra agenda", opinó sobre la posición que debe adoptar
    Uruguay en materia económica a partir de este año».

- medio: la-diaria
  url: https://ladiaria.com.uy/elecciones/articulo/2019/7/argimon-aca-no-solo-se-piensa-en-el-pueblo-sino-que-hay-propuestas-para-el-pueblo/
  fecha: 2019-07-23
  evento: elecciones-2019
  politico: argimon
  tono: neutral
  justificacion: >-
    Crónica de una asamblea partidaria que cede la palabra a la protagonista y a sus correligionarios
    sin calificarlos: «La candidata a la vicepresidencia contó que su padre, que falleció el año
    pasado, fue un herrerista destituido por la dictadura militar».

- medio: el-observador
  url: https://www.elobservador.com.uy/nota/en-vivo-senado-trata-exoneracion-de-iva-al-asado-por-un-mes-2022322122043
  fecha: 2022-03-22
  evento: propuesto:exoneracion-iva-asado-2022
  politico: argimon
  tono: neutral
  justificacion: >-
    Argimón aparece una sola vez y en términos puramente descriptivos de su función: «La presidenta
    del Senado, Beatriz Argimón, pidió a los legisladores votar el proyecto, que obtuvo 29 votos
    afirmativos de 29 presentes».

- medio: busqueda
  url: https://www.busqueda.com.uy/politica/desde-paris-beatriz-argimon-coordina-reunion-la-ocde-uruguay-n5412979
  fecha: 2026-05-07
  evento: propuesto:acercamiento-ocde-uruguay
  politico: argimon
  tono: neutral
  justificacion: >-
    Informa su gestión atribuyéndole los dichos sin valorarlos: «Argimón dijo a Búsqueda que el
    encuentro está previsto para fines de setiembre próximo con motivo de los 10 años de la
    Comisión de América Latina y el Caribe».

- medio: ambito
  url: https://www.ambito.com/uruguay/se-acerca-la-ocde-una-reunion-alto-nivel-la-mesa-n6274995
  fecha: 2026-05-07
  evento: propuesto:acercamiento-ocde-uruguay
  politico: argimon
  tono: neutral
  justificacion: >-
    Describe su papel como dato de gestión, sin juicio: «Las gestiones están a cargo de la
    exvicepresidenta y actual embajadora ante la Organización de las Naciones Unidas para la
    Educación, la Ciencia y la Cultura (Unesco), Beatriz Argimón».

# Nota abierta durante esta crítica (no leída en el lote), incluida con el mismo criterio.
- medio: el-observador
  url: https://www.elobservador.com.uy/nota/beatriz-argimon-asumio-como-primera-presidenta-mujer-del-partido-nacional-201841620500
  fecha: 2018-04-16
  evento: propuesto:presidencia-directorio-partido-nacional-2018
  politico: argimon
  tono: neutral
  justificacion: >-
    Registra el hecho y cita a los protagonistas sin adjetivarlos: «Beatriz Argimón asumió ese cargo
    este lunes y estrenó la titularidad del Directorio a manos de una mujer».
```

### Notas sobre la cobertura

- No cargo registro de tono para los dos diarios de sesiones ni para la biografía oficial: no son
  notas de prensa.
- No cargo registro para El Observador, 2018-03-10, «Beatriz Argimón, una mujer a la cabeza del
  partido de Oribe» (https://www.elobservador.com.uy/nota/beatriz-argimon-una-mujer-a-la-cabeza-del-partido-de-oribe--2018310500).
  Está en el corpus desde antes de la corrida, el investigador no la abrió y yo solo le corrí una
  búsqueda de términos tributarios (los ocho dan «sin coincidencias»), sin leer el cuerpo. Asignar
  tono sin haber leído la nota sería exactamente lo que esta crítica le objeta al lote. Queda como
  lectura pendiente, y es además una de las fuentes del tramo 2010-2019 de la objeción 1.
