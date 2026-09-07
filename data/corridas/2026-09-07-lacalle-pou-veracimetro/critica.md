# Crítica — corrida 2026-09-07-lacalle-pou-veracimetro

Modelo: Opus 5 (1M context) — `claude-opus-5[1m]`, elegido por el mantenedor para esta corrida.
Lote: `inbox/lacalle-pou/veracimetro/2026-09-07/`
Registros revisados: 3 chequeos + `declaraciones.yaml` vacío + `promesas.yaml` y `menciones.yaml` vacías.
Fuentes releídas en esta sesión: 12 (4 notas de prensa de 2021, 1 transcripción de 2023, 1 gacetilla de
Presidencia, 1 gacetilla del MEF, 3 PDF oficiales, 1 versión taquigráfica, 1 página de audios de Presidencia).

**Resultado mecánico, antes de cualquier juicio editorial: el lote no pasa el validador.** No lo dejo para el
final porque cambia la premisa con la que me lo pasaron ("ya validada mecánicamente, las citas existen en las
páginas"): dos de las catorce citas del lote **no existen** en la fuente que declaran.

```
$ pnpm validar --inbox inbox/lacalle-pou/veracimetro/2026-09-07
✘ referencias: 2 error(es)
  chequeos.yaml#0  dato_real.fuentes.0.medio  Medio desconocido: no existe "mef" en content/medios/
  chequeos.yaml#0  dato_real.fuentes.1.medio  Medio desconocido: no existe "mef" en content/medios/

$ pnpm validar --red --inbox inbox/lacalle-pou/veracimetro/2026-09-07 --solo citas
✘ citas: 2 error(es) — 14 cita(s): 12 exacta(s)
  chequeos.yaml#2  dato_real.fuentes.1.cita  Cita no encontrada (similitud 0.61, umbral 0.9): info-rebaja-impuestos.pdf
  chequeos.yaml#1  dato_real.fuentes.1.cita  Cita no encontrada (similitud 0.72, umbral 0.9): info-rebaja-impuestos.pdf
```

---

## Objeciones por registro

### chequeos[0] — 2021-07-28 — "logró ahorrar más de US$600 millones"

- **severidad: bloquea**
- **tipo:** `contexto_omitido` (principal) + `explicacion_alternativa` + `riesgo_legal` (leve)
- **objecion:**

  **(0.a) Falla `referencias`: `medio: mef` no existe.** Las dos fuentes centrales de `dato_real` declaran un
  slug que no está en `content/medios/`. Hasta que exista `content/medios/mef.yaml` (semilla, con
  `grupo: estado-uruguayo` / `alineamiento: estatal`, como propone `notas.md`), el chequeo no puede promoverse.
  Es el arreglo más barato del lote y no depende de nada más.

  **(0.b) La `afirmacion` le impone al hablante un período que él no dijo, y eso vuelve la afirmación
  inverificable justo donde el documento oficial sí la respaldaría.** La `afirmacion` dice "durante la pandemia
  (2020 y lo transcurrido de 2021) su gobierno logró ahorrar más de US$600 millones". Lo que la fuente registra
  es esto, y no trae período:

  > "Tercamente decíamos: no vamos a poner impuestos. Primero, porque no es necesario. Pasamos la pandemia,
  > hicimos un gasto importante en 2020 y ahora tenemos un gasto mayor previsto por la pandemia en 2021. Y
  > ahorramos más de US$ 600 millones. Sin poner impuestos"
  > — El Observador, 28/07/2021,
  > <https://www.elobservador.com.uy/nota/lacalle-pou-sobre-gestion-en-pandemia-ahorramos-mas-de-us-600-millones-sin-poner-impuestos--2021728205316>

  El verbo es "ahorramos", en pasado, y las dos oraciones sobre gasto pandémico son gramaticalmente
  independientes de la del ahorro. La lectura más benigna —"gastamos mucho en COVID y, aparte, en el gasto
  estructural ahorramos más de 600"— queda exactamente cubierta por el documento oficial que el propio chequeo
  cita, que mide **2020 solo**:

  > "Egresos Primarios GC - BPS / Variación Real 2020 sin COVID / Ahorro GC-BPS: USD 380 mill. a valores de
  > 2019, excl. gasto COVID. / Resto del S.Público No Monetario: USD 280 mill. / AHORRO TOTAL: USD 660 millones"
  > — MEF, presentación 08/02/2021, carácter 5540-5940 del PDF.

  Escribir la `afirmacion` con "2020 y lo transcurrido de 2021" convierte una frase que el documento respalda en
  una que ningún documento cubre. El sesgo es contra el hablante y hay que corregirlo, no porque sea Lacalle Pou
  sino porque la regla es "la afirmación sigue a lo dicho".

  **(0.c) Contexto omitido dentro de la misma nota que el chequeo ya cita.** Dos párrafos después de la cita, El
  Observador trae el desglose que el propio presidente dio y que el chequeo no recoge:

  > "Lacalle Pou precisó que en 2020 el Poder Ejecutivo gastó US$ 670 millones y gastará US$ 940 este año, al
  > tiempo ahorrará US$ 640 millones."
  > — misma URL.

  Esto importa por dos motivos. Primero, aparece un **segundo referente numérico** (640, no 660) y en **futuro**
  ("ahorrará"): es posible que "más de US$ 600 millones" sea una proyección para 2021 y no la cifra realizada de
  2020. El `dato_real` ancla en 660/2020 sin mencionar que la misma nota ofrece otro candidato. Segundo, la
  hipótesis que `notas.md` deja abierta ("podría estar tomada de memoria de los US$660 millones") es contestable
  con material que ya estaba en el expediente y no se usó.

  **(0.d) Falta el contexto que hace honesto cualquier veredicto: qué mide "ahorro" y contra qué promesa.** El
  chequeo cita a Arbeleche aclarando que el ahorro es estructural, pero no incorpora la nota —ya leída en esta
  corrida según `consultas.jsonl`, y no puesta en ninguna lista de fuentes— donde queda la comparación con la
  promesa de campaña:

  > "«Acá no se trata de agarrar el cartel de los US$ 900 millones y morir con el cartel. Aquí el compromiso
  > claro es de continuar con la mejora estructural», afirmó el lunes la ministra de Economía y Finanzas,
  > Azucena Arbeleche consultada sobre la promesa de ahorro realizada en la campaña electoral."
  > — El Observador, 09/02/2021,
  > <https://www.elobservador.com.uy/nota/-que-dijo-arbeleche-sobre-el-ahorro-de-us-900-millones-que-se-prometio-en-campana-electoral--20212818170>

  La misma nota confirma el universo de la cifra: "el sector público en su conjunto registró ahorros por US$ 660
  millones". Sin esto, el lector ve "660 > 600, cumple" y no ve que el compromiso era 900.

  **(0.e) Dos errores fácticos menores en `dato_real.valor`.** (i) Dice que Arbeleche aclaró lo del gasto en
  pandemia "en la misma ronda de prensa"; la nota de Telenoche está fechada "10 de febrero de 2021" y dice "El
  lunes la ministra presentó el informe": es una entrevista televisiva **dos días después**, con Daniel Castro,
  no la misma instancia. (ii) La presentación del MEF ante la Comisión de Presupuestos (`Mef 12-07-21.pdf`) está
  declarada con `medio: parlamento`; es un documento del **Poder Ejecutivo** alojado en el sitio de Diputados. Su
  autor es el MEF. `parlamento` está bien para la versión taquigráfica de la Comisión de Hacienda (donde el
  autor es el cuerpo), no para una presentación ministerial.

  **(0.f) Falta `_faltante: dato_oficial`.** El propio `dato_real` reconoce que "no se localizó una actualización
  oficial de esta cifra para el tramo de 2021". Si el chequeo se entrega sin la marca, el informe del lote
  reporta 3 de 3 con dato oficial y el editor pierde la señal.

- **cita_de_contexto:** las cinco citas literales de arriba, con sus URL.
- **accion_sugerida:**
  1. Crear `content/medios/mef.yaml` (semilla, `grupo: estado-uruguayo`, `alineamiento: estatal`) y reasignar
     `Mef 12-07-21.pdf` a `medio: mef`.
  2. Reescribir la `afirmacion` sin período impuesto: "…dijo que su gobierno ahorró más de US$600 millones sin
     poner impuestos, sin precisar el período".
  3. Sumar a `evidencia.fuentes` o a `dato_real.fuentes` la nota de El Observador del 09/02/2021 (US$900 millones
     prometidos, US$660 realizados) — URL arriba.
  4. Agregar al `dato_real.valor` el desglose que el propio presidente dio en la misma entrevista (670/940/640).
  5. Marcar `_faltante: dato_oficial` para el tramo 2021.
  6. **Calificación honesta: `discutible`.** No `verdadero`: no hay documento oficial que mida el período que la
     prensa le atribuye, y "ahorro" en el documento es una medida de gasto estructural ex-COVID, no un resultado
     fiscal neto. No `falso`: la cifra oficial de 2020 (660) es mayor que 600 y sostiene la frase literal. Todo
     lo que empuje a verde o rojo desde acá es afirmar más de lo que la fuente respalda (art. 336 CP).

---

### chequeos[1] — 2023-03-02 — "alcanzaría al 75% de los contribuyentes de IRPF"

- **severidad: bloquea**
- **tipo:** `cita_fuera_de_contexto` (la cita del lote, no la del político) + `contexto_omitido`
- **objecion:**

  **(1.a) La cita de la infografía no existe en la infografía.** `dato_real.fuentes[1].cita` dice
  `"contribuyentes alcanzados 75% ... 63.000 personas dejan de ser contribuyentes ... Costo total medidas USD 80
  millones"`. El texto real del PDF, leído entero (2.225 caracteres), es una capa de texto desordenada de una
  infografía:

  > "TASA / DEDUCCIONES / contribuyentes / alcanzados / 14% / 75% / contribuyentes / beneficiados 100% / 63.000"
  > y, en otra parte del documento, "USD / Costo total medidas / 80 millones"
  > — <https://medios.presidencia.gub.uy/tav_portal/2023/noticias/AK_502/info-rebaja-impuestos.pdf>

  La cita del lote salta el "14%" que está en el medio, une tramos separados con puntos suspensivos y **reordena
  las palabras** ("USD 80 millones" donde el PDF tiene "USD / … / 80 millones"). No es copia literal ni contigua:
  es una reconstrucción. El validador lo confirma: similitud 0.72 contra umbral 0.9. Esto es exactamente lo que
  el lote le reprocha a la oficina de prensa de Presidencia (ver más abajo), aplicado a nosotros mismos; no puede
  salir así.

  **(1.b) El anexo oficial distingue "alcanzar" de "beneficiar" y el chequeo no.** La cita del anexo (esta sí
  literal y contigua, verificada) dice:

  > "Estos cambios en las deducciones del IRPF alcanzan al 75% de los contribuyentes. El 47% de los
  > contribuyentes se verán significativamente beneficiados dentro de los cuales, el 30% dejará de ser
  > contribuyente, siendo en más de un 90% contribuyentes de menores ingresos"
  > — `Documento-2-marzo-anexo.pdf`.

  Lo que el presidente dijo, según la transcripción, es **"beneficiará al 75% de contribuyentes"**; el `resumen`
  publicado dice "alcanzaría"; la gacetilla de Presidencia dice "alcanzarán". El documento técnico del propio
  gobierno usa "alcanzan" para el 75% y reserva "significativamente beneficiados" para el **47%**. La distancia
  entre "alcanza al 75%" y "beneficia al 75%" es precisamente donde tiene que caer el veredicto, y el
  `dato_real.valor` la deja pasar (trae el 47% dentro de la cita pero no lo usa en el análisis del valor).
  Nota: el 30% y el 14% no se contradicen — 30% de 47% ≈ 14% —; ahí no hay hallazgo.

  **(1.c) El universo del 75% no está cerrado, y el chequeo lo dice a medias.** Las deducciones de IRPF que se
  modifican son de rentas del trabajo (Categoría II); el documento dice "los contribuyentes" sin calificar. Que
  no exista padrón público de DGI para recalcularlo es cierto y está bien anotado, pero la consecuencia no está
  extraída: **el único que calcula el 75% es el que propone la medida.** Eso no lo hace falso; lo hace no
  independiente, y el veredicto tiene que decirlo.

- **cita_de_contexto:** las tres de arriba, con URL.
- **accion_sugerida:**
  1. Reemplazar la cita de la infografía por un tramo realmente contiguo del PDF (p. ej. `"USD Costo total
     medidas 80 millones USD Costo total medidas IASS 30 millones"`, que es lo que el propio validador señala
     como "lo más parecido que hay"), o **eliminar la infografía como fuente de este chequeo**: el anexo ya
     sostiene el 75% con una cita limpia.
  2. Nombrar en `dato_real` el organismo que permitiría auditar el 75% sin depender del Ejecutivo: **DGI —
     Asesoría Económica, series de contribuyentes de IRPF Categoría II** (y `catalogodatos.gub.uy`, medio que ya
     existe). No hace falta buscarlo en esta corrida; hace falta que el lector sepa que no se consultó.
  3. **Calificación honesta: `discutible`,** salvo que el `analisis` separe explícitamente "alcanza" de
     "beneficia" y consigne el 47%. Con esa separación escrita, `verdadero` es defendible para "alcanza al 75%"
     (hay `documento_oficial`). Sin ella, verde sobre "beneficiará al 75%" afirma más de lo que el propio anexo
     del gobierno afirma.

---

### chequeos[2] — 2023-03-02 — "una renuncia fiscal de US$150 millones"

- **severidad: bloquea**
- **tipo:** `cita_fuera_de_contexto` + `explicacion_alternativa` (la premisa central del registro no está probada)
- **objecion:**

  **(2.a) La cita de la infografía tampoco existe (similitud 0.61).** Mismo problema que en 1.a, agravado: la
  cita reordena tres etiquetas de tres partes distintas del PDF. Las tres cifras **sí están** en el documento
  ("USD / Costo total medidas / 80 millones"; "USD / Costo total medidas IASS / 30 millones"; "USD / Costo total
  estimado / medidas de apoyo / 40 millones"), pero no en ese orden ni contiguas.

  **(2.b) — La objeción más importante de todo el lote — la premisa "la cifra no la dijo en el discurso" no
  está probada, y la evidencia disponible apunta a lo contrario.** `notas.md` afirma en `## resumen_vs_primaria`:
  "**NO** está en el discurso. Busqué «150 millones» y «renuncia fiscal» en el texto completo (26.114
  caracteres…) y no hay coincidencias". Confirmo la búsqueda: no hay coincidencias. Pero **el texto no es
  completo**, pese al título de la nota. Tres verificaciones:

  - **Le falta el principio.** El archivo arranca en "Estos tres años de gobierno, dos de ellos estuvimos bajo
    emergencia sanitaria." (carácter 0). No tiene el saludo protocolar que abre toda comparecencia ante la
    Asamblea General.
  - **Le falta el final, y se corta a mitad de tema.** El archivo termina en "…Empresas que son el corazón del
    motor económico del país." (carácter 26.114, el último). Anuncia las medidas para mipymes y **no las
    detalla**; no hay cierre ni despedida en un discurso de más de una hora.
  - **Faltan frases que Presidencia cita entre comillas y que van justo después de ese corte.** Busqué en la
    transcripción "Estoy convencido", "proceso virtuoso" y "camino es el correcto": **sin coincidencias**. Las
    tres están en la gacetilla, encadenadas a la cifra en discusión:

    > "Toda la renuncia fiscal significa 150 millones de dólares, informó. «Estoy convencido de que se generará
    > un proceso virtuoso de mayor consumo y dinamismo económico», señaló. «Hoy el Gobierno viene aquí con la
    > tranquilidad de estar cumpliendo con lo prometido y podemos decir que el camino es el correcto…»"
    > — <https://www.gub.uy/presidencia/comunicacion/noticias/lacalle-pou-80000-uruguayos-dejaran-pagar-irpf-iass>

  Es decir: **la transcripción se corta exactamente en el tramo donde la cifra habría ido.** La ausencia de "150
  millones" en ese archivo no es evidencia de ausencia; es el borde del archivo. El `dato_real.valor` se cubre
  con un hedge ("no consta como dicha por Lacalle Pou **en ese pasaje**") que es literalmente cierto, pero
  `notas.md` y la `afirmacion` van más lejos y afirman el hecho negativo. Eso no se puede publicar.

  **(2.c) La atribución del registro contradice el esquema.** El campo `politico` está definido como "Quién hizo
  la afirmación" (`src/schemas/chequeo.ts`). La `afirmacion` de este chequeo empieza "**Presidencia informó**…",
  y el registro declara `politico: lacalle-pou`. Además `fragmento: "una renuncia fiscal de US$150 millones"`
  hace que el sitio **marque esa frase dentro del `resumen` publicado** (`src/lib/fragmentos.ts`), en una oración
  gobernada por "que **dijo**". Si la premisa 2.b se resolviera en contra (no lo dijo), el sitio estaría
  subrayando como suya una cifra ajena. Si se resolviera a favor (sí lo dijo), la `afirmacion` está mal escrita.
  En los dos casos, así no va.

  **(2.d) `nivel: textual` con una sola fuente que es la parte interesada.** `evidencia` tiene una única fuente:
  la gacetilla de Presidencia. Formalmente cumple (`documento_oficial`), pero `textual` significa "lo dijo con
  esas palabras y hay registro primario", y acá no hay registro primario de nadie diciendo esas palabras: hay una
  oficina de prensa escribiendo "informó" en estilo indirecto. Baja a `reportado` (y entonces le falta el
  segundo grupo) o se resuelve con el audio.

  **(2.e) `dato_real.valor` afirma dos cosas que sus fuentes no dicen.** (i) "El proyecto de ley enviado por el
  Poder Ejecutivo **el 2 de marzo de 2023**": ninguna fuente citada dice eso; la propia gacetilla de ese día
  habla en futuro ("el proyecto de ley que el Gobierno **enviará**"), y la versión taquigráfica del 15/03 dice
  "Esto se votó **ayer** por la mañana en la Comisión del Senado". Según `consultas.jsonl` la fecha salió de una
  página de `ccea.com.uy` leída con WebFetch y marcada "no citable": es un dato sin fuente citada, que es
  precisamente lo que el punto 5 de las reglas prohíbe. (ii) "costo fiscal adicional de USD 150.000.000 **por la
  rebaja de IRPF e IASS**": el anexo oficial dice IRPF ≈ USD 80 millones ("La renuncia fiscal de la propuesta
  anteriormente descrita es de aproximadamente USD 80 millones anuales") e IASS ≈ USD 30 millones ("El costo
  total de las medidas para los pasivos se estima en unos USD 30 millones anuales"): **110**, no 150. Los 40
  restantes son las medidas para mipymes, que según Irastorza van por decreto ("lo que está en este proyecto de
  ley, así como los decretos que ya están vigentes"). El total de 150 es correcto; su composición, como está
  escrita, no.

- **cita_de_contexto:** todas las de arriba, con URL.
- **accion_sugerida:**
  1. **Antes de decidir nada de este chequeo, conseguir el registro primario del discurso** (ver "Objeciones al
     lote", punto 3). Con el audio, esto se resuelve en cinco minutos y en cualquiera de las dos direcciones.
  2. Mientras tanto, **no publicar este chequeo**, o publicarlo reescrito como chequeo de la cifra oficial
     ("¿cuánto cuesta el paquete anunciado el 2 de marzo de 2023?"), sin `fragmento`, con `afirmacion` atribuida
     a la comunicación del Poder Ejecutivo y sin dar por probado que el presidente no la dijo.
  3. Arreglar la cita de la infografía (o sustituirla por el anexo, que tiene 80 y 30 en prosa contigua) y
     corregir la composición 80+30 (ley) + 40 (decretos) = 150.
  4. Sacar la fecha de envío del proyecto o sostenerla con la carátula de la Carpeta 3399/2023 en
     `parlamento.gub.uy`.
  5. Cambiar `tipo: documento_oficial` → `diario_de_sesiones` en `1252.pdf`: es una versión taquigráfica de
     comisión y ese `tipo` es el que corresponde.
  6. Correr `pnpm archivar`: los dos PDF de `diputados.gub.uy` vuelven con `wayback ninguno`.

---

### declaraciones.yaml — vacío

- **severidad: corregir**
- **tipo:** `contexto_omitido`
- **objecion:** El brief mandaba buscar la primaria en `www.gub.uy/presidencia/comunicacion/noticias/`,
  `medios.presidencia.gub.uy` y el canal de YouTube de Presidencia. La búsqueda se hizo y quedó bien
  documentada, pero **se detuvo un paso antes de donde estaba**. Presidencia publica sistemáticamente el audio
  íntegro de cada comparecencia ante la Asamblea General en `gub.uy/presidencia/comunicacion/audios/completos/`.
  Abrí una de esas páginas en esta sesión:

  > "02/03/2021 El presidente de la República, Luis Lacalle Pou, compareció ante la Asamblea General, este
  > martes 2, con motivo del primer año de gestión. … 56 minutos 10 segundos - 19.750 kb"
  > — <https://www.gub.uy/presidencia/comunicacion/audios/completos/discurso-del-presidente-luis-lacalle-pou-ante-asamblea-general>

  Es la comparecencia de **2021**, no la de 2023; pero prueba que la serie existe y que el material que falta es
  de la misma colección donde ya se encontraron los dos PDF del 2 de marzo de 2023
  (`medios.presidencia.gub.uy/tav_portal/2023/noticias/AK_502/`). No es un reproche a la diligencia: la búsqueda
  fue larga y honesta. Es que el hallazgo que decide dos objeciones de este lote está a una consulta de
  distancia.
- **accion_sugerida:** encolar un trabajo (`pnpm cola:agregar`) para (i) recorrer
  `gub.uy/presidencia/comunicacion/audios/completos/` y `.../videos/` alrededor del 02/03/2023, (ii) el canal
  `youtube.com/Presidenciatv` — candidato sin verificar, **no lo abrí**:
  `https://www.youtube.com/watch?v=LaXhfAGMh0c` ("Palabras del presidente Lacalle Pou ante la Asamblea General",
  año sin confirmar) — y (iii) el Diario de Sesiones de la Asamblea General, Tomo 103, sesión del 02/03/2023.
  Con cualquiera de los tres, `pnpm transcribir` y esta corrida se cierra sola.

### promesas.yaml y menciones.yaml — vacíos

- **severidad: aviso** · **tipo: sin_objecion**
- El encargo no pedía promesas ni menciones y las listas vacías son la respuesta correcta.

---

## Objeciones al lote

### 1. La cita cosida de la declaración publicada de 2023 **está confirmada**, y con dos casos, no uno

Esto es lo que el lote pidió que verificara y lo verifiqué. El registro publicado
`content/declaraciones/lacalle-pou/2023-03-02-baja-impuestos-irpf-iass.yaml` tiene:

```yaml
cita: Estamos en condiciones de proceder a una baja de impuestos para quienes hacen los mayores esfuerzos
evidencia:
  nivel: textual
```

La transcripción disponible del discurso dice, contiguo:

> "Hoy queremos anunciar otra acción más: a raíz de las pautas mencionadas, anteriores, estamos en condiciones
> de proceder a una baja de impuestos (aplausos). Baja de impuestos sobre todo a aquellas personas que hacen
> grandes esfuerzos por sostener económicamente y que generalmente no tienen apoyo integral del estado por no
> estar en una situación vulnerable."
> — <https://www.elobservador.com.uy/nota/lee-el-discurso-de-lacalle-pou-ante-la-asamblea-general-202332192844>

Son **dos oraciones separadas por aplausos**, y la segunda dice "grandes esfuerzos", no "los mayores esfuerzos".
La versión publicada es la fusión que hizo la gacetilla. Detalle que refuerza el hallazgo: **la gacetilla trae
las dos versiones**, la corta en la bajada ("«Estamos en condiciones de proceder a una baja de impuestos»,
indicó") y la fusionada en el cuerpo ("«…para quienes hacen los mayores esfuerzos», señaló"). Nuestro registro
tomó la segunda.

Y hay un **segundo caso independiente en la misma gacetilla**, este dentro del tramo de la transcripción que sí
tenemos (o sea, sin el problema de truncamiento):

| Publicado por Presidencia | Transcripción del discurso |
|---|---|
| "«Fuimos el país que perdió menos días de clase, los primeros en volver a la presencialidad y con menos rezagos educativos», resaltó" | "Los resultados son indiscutibles: fuimos quienes menos perdimos días de clase. **Básicamente gracias a la tecnología y la utilización del Ceibal.** Fuimos los primeros en volver a la presencialidad. Fuimos los que tuvimos menos rezagos educativos." |

Cuatro oraciones convertidas en una, con una cláusula intermedia eliminada y el sujeto reformulado. Dos
instancias en el mismo documento dejan de ser un desliz de redacción y pasan a ser una práctica de la oficina de
prensa que nos afecta directamente: **cuando citamos la gacetilla como `documento_oficial` para sostener
`nivel: textual`, estamos llamando "textual" a una paráfrasis.**

**Acción sugerida — corrección aparte, no es de este lote:** un registro en `content/correcciones/` (tipo
`cambio_de_rating` más ajuste de cita) sobre `lacalle-pou/2023-03-02-baja-impuestos-irpf-iass`, que (i) recorte
la `cita` a **"Estamos en condiciones de proceder a una baja de impuestos"** —la única forma en que las dos
versiones coinciden, presente literal en la bajada de la gacetilla y en la transcripción—, (ii) revise el
`titulo` ("…para quienes más se esfuerzan"), que hoy hereda la formulación fusionada, y (iii) decida el `nivel`
con el audio en la mano. Precedente reciente del mismo tipo: `2026-09-06-lacalle-pou-2022-conferencia-primaria`
y `2026-09-06-lacalle-pou-2019-cotejo-nota-audio`. **Ojo con el orden:** si la corrección toca el `resumen`, el
`fragmento` de `chequeos[1]` y `chequeos[2]` deja de aparecer tal cual y la etapa `referencias` falla; los dos
cambios van juntos.

### 2. Discrepancias: **no escribo `discrepancias.yaml` en esta corrida, y el motivo es la regla**

Hay dos candidatas buenas y las dos se caen por el mismo límite duro:

- **Presidencia — `cita_alterada`** (los dos casos del punto 1).
- **El Observador — `titular_no_respaldado`**: publicó "Discurso completo de Lacalle Pou ante la Asamblea
  General: leelo acá" y el texto no es el discurso completo (le falta la apertura, se corta a mitad del tramo de
  mipymes y no contiene frases que Presidencia cita entre comillas).

Para registrar cualquiera de las dos hace falta `fuente_primaria` con `documento_oficial`, `diario_de_sesiones` o
`video`. Lo único que tengo del discurso es la transcripción de El Observador, que es `tipo: nota` — y que,
además, acabo de demostrar que está incompleta. Contraponer una gacetilla contra una transcripción de prensa es
**un desacuerdo, no una discrepancia**, y va acá.

Descarto explícitamente el atajo: sería posible usar la gacetilla de Presidencia (que es `documento_oficial` por
`tipo`) como primaria para probar que a El Observador le faltan frases. **No lo hago**: acabo de argumentar que
esa gacetilla reescribe citas, y no puedo descalificarla como registro de lo dicho en un párrafo y usarla como
juez de lo dicho en el siguiente. El mismo umbral para todos incluye el umbral sobre uno mismo.

Con el audio de Presidencia o el Diario de Sesiones, **las dos** discrepancias se pueden escribir en la misma
corrida, y esa simetría es deliberada: una contra la comunicación oficial del gobierno de turno y una contra un
medio privado, resueltas con el mismo documento y el mismo criterio.

### 3. Dependencia de un solo grupo: bien en la evidencia, concentrada en el dato oficial

- `chequeos[0]`, `evidencia` (`nivel: reportado`): la-diaria (`cooperativa-la-diaria`), El Observador
  (`werthein-hochbaum`), El País (`scheck-aguirre`) → **tres grupos distintos**, con alineamientos distintos
  (`independiente`, `sin_datos`, `oficialista_tradicional`). No hay copia de agencia. Cumple con margen; conviene
  decirlo porque el hallazgo negativo también se audita.
- `chequeos[2]`, `evidencia`: **una sola fuente**, y es la parte interesada (ver 2.d).
- `dato_real` de `chequeos[0]`: cuatro fuentes, pero las dos que sostienen la cifra (la gacetilla del MEF y su
  PDF adjunto) son **el mismo acto del mismo organismo** — la gacetilla no hace más que enlazar el PDF. El ancla
  documental real es una sola presentación. No lo prohíbe ninguna regla (`dato_real` no exige dos grupos), pero
  el `analisis` no debería presentarlo como convergencia de fuentes.

### 4. Simetría con la corrida gemela de Orsi

Verifiqué el estado, no me lo creí:

- `content/chequeos/` tiene hoy **3 registros, los 3 de Lacalle Pou**. Este lote suma 3 más; el de Orsi suma 4.
  Después de las dos corridas: **6 Lacalle Pou / 4 Orsi**.
- Base de declaraciones publicadas: 47 Lacalle Pou, 35 Orsi, 2 Mujica, 0 Batlle, 0 Vázquez. La proporción del
  Veracímetro (60/40) queda **casi exactamente sobre la proporción de la base** (57/43). **Este par de corridas
  es simétrico** y la crítica anterior acertó al pedirlo.
- Lo desparejo está aguas arriba: Batlle y Vázquez no tienen ninguna declaración publicada y Mujica tiene dos,
  ninguna con dato numérico (lo verifiqué). El Veracímetro va a seguir siendo de dos presidentes hasta que la
  base deje de serlo. **No es culpa de este lote ni se arregla en él**, pero conviene que quede escrito.

**Una asimetría real, y está en los briefs, no en los lotes.** El brief de Orsi le da al investigador una
facultad que el de Lacalle Pou no le da:

> "«100 %»: decidí vos si es un dato concreto o una figura retórica; si es retórica, no hay chequeo y lo decís en
> `notas.md` con el motivo"
> — `data/corridas/2026-09-07-orsi-veracimetro/brief.md`, línea 19

El brief de Lacalle Pou afirma, sin esa válvula, que "el dato a chequear está dentro de su `cita` o su
`resumen`" para los dos casos. En Orsi esa facultad se ejerció: cuatro declaraciones encargadas, tres chequeadas,
la del "100 %" descartada. Acá la misma pregunta —"¿es «US$150 millones» un dato que el hablante afirmó?"— era
la pregunta decisiva del lote y el brief no invitaba a hacerla. El resultado observable: 3 chequeos sobre 2
declaraciones de Lacalle Pou, 4 sobre 4 de Orsi (una descartada). **Versión simétrica:** la misma cláusula de
discreción, con el mismo texto, en los dos briefs.

### 5. Una asimetría del criterio que no es de partido pero conviene mirar

El criterio "si hay un dato concreto dentro de una cita publicada, se chequea" se aplicó solo a los datos que
afirma **el político del expediente**. En el `resumen` publicado de `2021-07-28` hay otro dato chequeable, dicho
por otra persona: la respuesta de la senadora Kechichian de que en el período se "subió el IVA". Es tan
verificable como los demás (IMPO, DGI: la tasa de IVA y las rebajas transitorias de 2020-2021 están
documentadas), y no se chequeó. Aplicado sistemáticamente, el criterio actual produce un Veracímetro que
**califica a quien gobierna y nunca a quien lo critica**, en cualquier gobierno. Dos salidas simétricas y las dos
sirven: (a) chequear todo dato chequeable dentro de una cita o resumen publicado, lo diga quien lo diga; o (b)
dejar por escrito que el alcance es "los datos del político del expediente" y aplicarlo igual a todos. Lo que no
funciona es dejarlo implícito.

---

## Objeciones al brief

1. **No hay violación de Regla 0 en el diseño.** El brief existe *por* simetría, declara su gemelo, pide que se
   señale lo asimétrico y no pide seleccionar ni encuadrar por partido. Lo digo explícitamente porque la ausencia
   de objeción también se audita.
2. **Sí hay una asimetría operativa entre los dos briefs gemelos:** la cláusula "decidí vos si es un dato
   concreto o una figura retórica" está en el de Orsi y no en el de Lacalle Pou (detalle y corrección en
   "Objeciones al lote", punto 4). No creo que sea intencional —parece un ajuste hecho para el caso del "100 %"
   que no se propagó—, pero el efecto es que a un lote se le permitió una pregunta que al otro no, y en este lote
   esa pregunta era la que importaba. **Corrección:** misma cláusula, mismo texto, en los dos.
3. **Error fáctico del brief, ya detectado por el investigador y confirmado por mí:** el brief dice que las dos
   declaraciones "están hoy en nivel `reportado` (prensa)"; `2023-03-02-baja-impuestos-irpf-iass.yaml` está en
   `nivel: textual`. No cambia el encargo, pero el motivo declarado para buscar la primaria ("subir de nivel") no
   aplicaba a ese registro — y resultó que la primaria hacía falta igual, por otro motivo mucho más fuerte.
4. **El brief no le pidió a nadie decidir qué hacer con un dato que el comunicado oficial atribuye al discurso y
   el discurso (aparentemente) no contiene.** Es el caso central del lote y quedó librado al criterio del
   investigador, que lo resolvió razonablemente en `notas.md` pero lo dejó a medias en el registro. **Regla que
   sugiero para los dos briefs, escrita igual:** *si la cifra aparece solo en la comunicación de un tercero
   (oficina de prensa, gacetilla, comunicado de partido) y no en el registro primario del hecho, no se chequea
   como afirmación del político; se chequea como afirmación de quien la publicó, con `politico`/`partido` de
   quien la publicó, o no se chequea. Y si el registro primario disponible está incompleto, no se afirma el hecho
   negativo.*

---

## Cobertura

Registros de tono por cada **nota de prensa** leída en el lote. Excluyo a propósito las piezas de
`presidencia`, `mef`/`gub.uy` y `parlamento`: son comunicación institucional o documento del Estado, no cobertura
periodística, y medir el "tono" de la oficina de prensa de un gobierno hacia ese mismo gobierno contaminaría la
métrica de sesgo de medios en lugar de informarla. El criterio vale igual para cualquier gobierno.

```yaml
- medio: la-diaria
  url: https://ladiaria.com.uy/politica/articulo/2021/7/lacalle-pou-enfatizo-que-durante-la-pandemia-se-ahorro-600-millones-de-dolares-sin-poner-impuestos/
  fecha: 2021-07-29
  evento: pandemia-covid
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Reporta el dicho y la réplica en voz atribuida, sin juicio propio: "El presidente de la República,
    Luis Lacalle Pou, destacó este miércoles que pese a la pandemia, se logró ahorrar 600 millones de
    dólares" y, en la bajada, "La senadora Liliam Kechichian respondió y recordó que durante este
    período se 'subió el IVA'". Aviso: el texto accesible está cortado por el muro de pago
    (1.356 caracteres), así que el tono se juzga sobre la parte visible.

- medio: el-observador
  url: https://www.elobservador.com.uy/nota/lacalle-pou-sobre-gestion-en-pandemia-ahorramos-mas-de-us-600-millones-sin-poner-impuestos--2021728205316
  fecha: 2021-07-28
  evento: pandemia-covid
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Crónica de la entrevista en discurso directo y en voz atribuida, sin adjetivación del medio:
    "El presidente Luis Lacalle Pou hizo referencia a la última campaña electoral en la que afirmó que
    no pondría impuestos en caso de llegar al gobierno". No hay contraparte ni cuestionamiento, pero
    tampoco frase propia del medio que valore al presidente.

- medio: el-pais
  url: https://www.elpais.com.uy/informacion/politica/el-ahorro-que-camisetea-son-recortes-de-que-se-vanagloria-y-verguenza-reacciones-tras-dichos-de-lacalle
  fecha: 2021-07-29
  evento: pandemia-covid
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    La nota es íntegramente reacciones críticas del Frente Amplio, sin respuesta del gobierno, pero la
    voz del medio es atributiva: "Sus declaraciones fueron criticadas por integrantes del Frente Amplio,
    quienes dijeron que dan 'vergüenza' e incluso que son falsas". No encuentro una frase propia de
    El País que valore al presidente, y la composición de la nota sola no alcanza para "desfavorable"
    con la regla que aplico igual a todos.

- medio: telenoche
  url: https://www.telenoche.com.uy/nacionales/arbeleche-en-telenoche-el-ahorro-no-incluye-el-gasto-en-la-pandemia
  fecha: 2021-02-10
  evento: pandemia-covid
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Entrevista propia del canal, reproducida en voz atribuida: "La ministra de Economía y Finanzas,
    Azucena Arbeleche, defendió las cifras que Uruguay gastó para contener la pandemia" y "Arbeleche
    descartó de plano que el ahorro afecte la atención de la pandemia". El medio no valora al gobierno;
    incluye tanto la defensa como el reconocimiento de que "el déficit fiscal del año 2021 será mayor
    al proyectado".

- medio: el-observador
  url: https://www.elobservador.com.uy/nota/-que-dijo-arbeleche-sobre-el-ahorro-de-us-900-millones-que-se-prometio-en-campana-electoral--20212818170
  fecha: 2021-02-09
  evento: pandemia-covid
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    El título usa un verbo cargado ("machacó"), pero la regla pide una frase del cuerpo y el cuerpo es
    atributivo y con contexto de las dos partes: "el sector público en su conjunto registró ahorros por
    US$ 660 millones, lo que según la ministra, posiciona 'muy bien' a Uruguay". Contrasta la promesa de
    campaña con el resultado sin calificarla.

- medio: el-observador
  url: https://www.elobservador.com.uy/nota/lee-el-discurso-de-lacalle-pou-ante-la-asamblea-general-202332192844
  fecha: 2023-03-03
  evento: "propuesto: rendicion-de-cuentas-asamblea-general-2023"
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Es transcripción sin intervención editorial: el texto arranca directo en "Estos tres años de
    gobierno, dos de ellos estuvimos bajo emergencia sanitaria" y no hay una sola frase del medio.
    Aviso para el editor, que no afecta el tono pero sí el uso: la nota se publica como discurso
    completo y no lo es (ver "Objeciones al lote", punto 2).
```

**Evento propuesto:** `rendicion-de-cuentas-asamblea-general-2023` — la comparecencia anual del presidente ante
la Asamblea General por el art. 168 inc. 5 de la Constitución. Si se crea, conviene crearlo como serie (una por
año y por presidente) para que sirva igual a Batlle, Vázquez, Mujica, Lacalle Pou y Orsi.
