# Crítica — corrida 2026-09-08-barandiaran-ficha, vuelta 3

Modelo: Opus 5 (1M context) — `claude-opus-5[1m]`. Único rol que corre en Opus, por la regla de
modelos del mantenedor del 2026-09-07. El lote declara `claude-sonnet-5`, que es lo que corresponde.

Lote: `inbox/barandiaran/ficha/2026-09-08-vuelta-3/`
Registros revisados: 1 `politicos` (29 mandatos, 2 candidaturas, `estado_actual`, `cobertura`) + 2
declaraciones. `chequeos.yaml`, `menciones.yaml` y `promesas.yaml` están vacíos.

Esta vuelta resolvía la objeción central de la crítica anterior (`critica.md`, «los 79 días que no
están»). **Lo resolvió**: los mandatos de suplencia pasaron de 46 a 89 días fechados de 110, cada uno
con su fuente. Verifiqué la aritmética sumando los 28 períodos de suplencia: dan exactamente 89 días
y **no hay solapamientos**. `pnpm validar --inbox` da 0 errores de esquema, referencias y simetría.

También verifiqué que quedaron resueltas las otras objeciones de la vuelta 1: `partido` es ahora
`Nuevo Espacio` (el nombre canónico de `data/alias.yaml`, así que la ficha va a pintar con su color
y no con el gris de reserva); la candidatura de 1994 tiene la Enciclopedia Electoral con el orden de
la hoja 99000 y 66.696 votos; la de 1999 pasó a `no_electo` con 17.152 votos y cuatro fuentes; y
existe el bloque `cobertura` que la página imprime bajo «Qué se buscó y qué existe».

Lo que sigue es lo que encontré nuevo.

---

## Objeciones por registro

### politicos[0].mandatos — 39 de 45 fuentes son URLs que **ya devuelven 404**
- severidad: **bloquea**
- tipo: riesgo_legal (verificabilidad) / presentacion
- objecion: De las 45 fuentes que cuelgan de `mandatos` y `estado_actual`, **39 apuntan a
  `https://infolegislativa.parlamento.gub.uy/temporales/<n>.PDF`**. Son URLs de sesión, generadas al
  vuelo por el buscador del Parlamento, y el nombre del directorio lo dice. Las probé: están
  **caídas hoy**, no en el futuro.

  ```
  https://infolegislativa.parlamento.gub.uy/temporales/3680065.PDF -> 404 (text/html, 1245 bytes)
  https://infolegislativa.parlamento.gub.uy/temporales/1745688.PDF -> 404 (text/html, 1245 bytes)
  ```

  Consecuencias, en orden de gravedad: (1) `pnpm validar --red` va a devolver `no_descargable` para
  cada una y va a exigir `verificacion: manual`, que a su vez exige aprobación humana; ninguna de
  las 39 la trae. (2) Solo 20 de las 39 tienen `archived_url`; las otras 19 quedan sin ningún camino
  al documento. (3) El lector que quiera comprobar una fecha va a hacer clic y ver un 404: la
  promesa central del sitio —«cada afirmación con fuente citable»— deja de cumplirse en el registro
  que más fuentes tiene de toda la ficha. Y no es un problema aislado: `content/politicos/barandiaran.yaml`
  ya tiene 8 fuentes `temporales` publicadas (4 sin `archived_url`), y el mismo patrón aparece en
  `content/politicos/cesar-vega.yaml`, `content/politicos/manini-rios.yaml`, `content/empresas/anp.yaml`
  y en dos discrepancias. Ya hay una corrección escrita por esta causa
  (`content/correcciones/2026-09-09-anp-fuente-caida-interpelacion-heber.yaml`).

- cita_de_contexto: **Y el reemplazo estable existe: lo verifiqué.** La Hemeroteca de la Biblioteca
  del Poder Legislativo —la misma que usa el lote principal de intervenciones para 1995-1999— tiene
  también la Legislatura 45. Barrí el rango de numeración `0001`-`0130` con peticiones HEAD para
  cuatro fechas de mandatos de este lote y las cuatro responden 200:

  | Fecha del mandato | N.º de diario en la Hemeroteca | Estado |
  |---|---|---|
  | 2000-11-07 | `(0040)` | 200 |
  | 2001-12-11 | `(0078)` | 200, 1.625.870 bytes |
  | 2002-12-10 | `(0077)` | 200 |
  | 2004-05-12 | `(0022)` | 200 |

  El patrón es el que indica el encargo:
  `https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/<AAAA-MM-DD> - DIARIO DE SESIONES DE LA CAMARA DE REPRESENTANTES (<NNNN>).pdf`
  (con `%20` por los espacios). El `<NNNN>` no es el número global que trae el `titulo` del lote
  («Diario de Sesión N.º 3236»): es el número de sesión dentro del período, y se encuentra con un
  barrido HEAD de 0001 a 0130, unos treinta segundos por fecha. El directorio no lista (403), así que
  el barrido es el camino.

- accion_sugerida: Antes de promover, reemplazar las 39 `url` por su equivalente de la Hemeroteca y
  reverificar la `cita` contra ese PDF (el texto es el mismo OCR, así que la cita debería dar
  exacta; donde no dé, se copia del nuevo PDF). Dejar la URL de `temporales` solo si se quiere, como
  dato histórico, en el `titulo`. Si el editor prefiere no rehacer las 39 en esta vuelta: el lote no
  puede ir a `publicado`; iría a `probable` con `_faltante: fuente_estable`, y la corrección
  posterior sería del tipo `presentacion` o `cambio_de_rating`. Lo que no se puede es publicar 39
  enlaces rotos. Y conviene abrir un pedido aparte para las 8 ya publicadas.

### politicos[0].mandatos[2] — 2000-07-05 → 2000-07-07
- severidad: **corregir**
- tipo: cita_fuera_de_contexto
- objecion: La única fuente del mandato dice, literalmente, «por el período comprendido entre los
  días 5 y 7 de julio de **20010**». No dice 2000. «20010» puede ser 2001 con un cero de más o 2000
  con un uno de más, y el registro eligió 2000 sin decir que eligió. Importa: en el mismo `mandatos`
  hay un período **2001-07-17**, así que 2001 no es imposible, y si la licencia era de julio de 2001
  el mandato está en el año equivocado. Un dígito de OCR no puede decidir solo una fecha de ejercicio
  de un cargo público.
- cita_de_contexto: «Del señor Representante Iván Posada, por motivos personales, inciso tercero del
  artículo único de la ley N9 16.465, por el período comprendido entre los días 5 y 7 de julio de
  20010, convocándose al suplente correspondie[nte]» —
  `https://infolegislativa.parlamento.gub.uy/temporales/1887488.PDF` (caída)
- accion_sugerida: Abrir el diario correspondiente en la Hemeroteca (`2000-07-05` y, si no aparece,
  `2001-07-05`) y leer el año en el documento. Si no se resuelve, el mandato va con
  `_faltante: fecha_ambigua` y no se publica.

### politicos[0].mandatos[6] y mandatos[15] — la cita no dice las fechas del mandato
- severidad: **corregir**
- tipo: contexto_omitido
- objecion: El encargo pide que «cada mandato nuevo tenga fuente con cita que diga esas fechas». Dos
  no la tienen.
  - **`[6]` 2000-12-19**: fuente única, y la cita es una lista de asistencia: «Carlos Baráibar,
    Gabriel Barandiaran, Jorge Barrera (4), Artigas A. Barrios, Humberto Bellora». La fecha sale del
    nombre del archivo (`20001219d0049.pdf`), no del texto citado.
  - **`[15]` 2001-10-02 → 2001-10-03**: tres fuentes. Las dos primeras son listas de asistencia sin
    fecha en la cita. La tercera dice «Sesiones realizadas el 3 de octubre: […] **Sin aviso**: Gabriel
    Barandiaran», que es un registro de **inasistencia**. Usarlo para probar que estaba en funciones
    es razonable —solo se marca ausente a quien está convocado— pero es una inferencia, no una cita
    que diga las fechas, y además solo cubre el 3 de octubre: el 2 de octubre no está probado por
    ninguna de las tres.
- cita_de_contexto: las tres citas transcriptas arriba, tal como están en el registro.
- accion_sugerida: Agregar a cada uno la línea del mismo diario que sí trae la fecha (el encabezado
  de la sesión o la resolución de convocatoria). Si para `[15]` solo aparece el 3 de octubre, el
  mandato es de un día, no de dos. Y si la evidencia es una inasistencia registrada, decirlo en el
  `detalle`, porque es una inferencia y el lector merece verla.

### politicos[0].mandatos[20] — 2002-12-09 → 2002-12-13, con dos resoluciones que no coinciden
- severidad: **corregir**
- tipo: explicacion_alternativa
- objecion: `notas.md` lo plantea con honestidad y no lo resuelve: el diario del 3 de diciembre de
  2002 convoca por el **9 al 13**, y el del 10 de diciembre convoca **otra vez** por el **11 al 13**.
  El registro carga un solo mandato del 9 al 13 con las dos fuentes. Pero las dos lecturas
  alternativas cambian el resultado: si la segunda resolución existe porque la primera se dejó sin
  efecto o porque otro suplente cubrió el 9 y el 10, entonces esos dos días no corresponden. Lo
  único que las dos resoluciones prueban en conjunto es el tramo **11-13**; el 9 y el 10 los prueba
  una sola, y hay un indicio en contra.
- cita_de_contexto: «por el período comprendido entre los días 9 y 13 de diciembre de 2002» (diario
  del 3 de diciembre) frente a «por el período comprendido entre los días 11 y 13 de diciembre de
  2002» (diario del 10 de diciembre).
- accion_sugerida: Abrir los diarios del 9 y del 10 de diciembre de 2002 en la Hemeroteca y mirar si
  Barandiarán figura en la lista de asistencia. Es la prueba directa y son dos llamadas. Si no
  figura, el mandato es 11-13 y el 9-10 se descarta con constancia.

### politicos[0].mandatos[25] y mandatos[26] — dos documentos oficiales dan fechas distintas
- severidad: **corregir**
- tipo: contexto_omitido
- objecion: Los dos mandatos de 2004 tienen dos fuentes que **no coinciden entre sí**, y el registro
  toma una sin decir que la otra dice otra cosa:
  - `[25]`: el PDF agregado `parlamentariosuruguayos_.pdf` dice «Del 16 de marzo de 2004 al **21** de
    marzo de 2004»; la resolución de licencia dice «entre los días 16 y **20** de marzo de 2004». El
    registro pone hasta el 21.
  - `[26]`: el PDF agregado dice «Del 19 de abril de 2004 al **24** de abril de 2004»; la resolución
    dice «entre los días 19 y **23** de abril de 2004». El registro pone hasta el 24.

  Es el mismo desfasaje de un día en los dos casos, así que probablemente hay una explicación
  sistemática (la licencia se concede por N días y el registro de suplencias cuenta el día de
  reintegro, o al revés). Sea cual sea, son **dos documentos oficiales del mismo organismo que se
  contradicen** y el lector tiene derecho a saberlo, sobre todo porque el sitio está contando días de
  ejercicio uno por uno.
- cita_de_contexto: las cuatro citas están textualmente en `mandatos[25].fuentes` y
  `mandatos[26].fuentes` del propio registro.
- accion_sugerida: Una `nota` de una oración en esos dos mandatos: «La resolución de licencia dice
  hasta el 20 de marzo y el registro de parlamentarios del Parlamento hasta el 21; se toma la fecha
  del registro de parlamentarios» (o la inversa, con la razón). Y revisar si el mismo desfasaje
  afecta a `[4]` (2000-11-06 → 12) y a `[19]` (2002-10-09 → 20), que también salen del PDF agregado.

### politicos[0].mandatos[16] — la fusión 2001-12-11 / 12 / 13 está bien, la razón declarada no
- severidad: **corregir**
- tipo: contexto_omitido
- objecion: `notas.md` justifica la fusión diciendo que «las tres fechas son consecutivas y las tres
  tienen **la misma resolución de origen** (licencia de Iván Posada)». Las citas del propio registro
  muestran lo contrario: son **tres resoluciones distintas, una por día** —«por el día 11 de
  diciembre», «por el día 12 de diciembre», «por el día 13 de diciembre»—, cada una con su
  convocatoria. La fusión sigue siendo correcta (tres días consecutivos de ejercicio efectivo), pero
  la razón escrita es falsa y `notas.md` es el insumo con el que el editor va a redactar
  `cobertura.texto`, así que el error se propaga.

  Aparte: la nota dice que «el editor puede optar por mantenerlos separados si prefiere no tocar el
  id ya publicado del mandato de 2001-12-11». No hay tal id: los mandatos son elementos de un array
  dentro del registro `barandiaran`, no registros con id propio. La preocupación es infundada y la
  decisión no tiene ese costo.
- cita_de_contexto: «por el día 11 de diciembre de 2001, convocándose al suplente correspondiente
  siguiente, señor Gabriel Ba[randiaran]» / «por el día 12 de diciembre de 2001, convocándose al
  suplente siguiente, Gabriel Barandiaran» / «por el día 13 de diciembre de 2001, convocándose al
  suplente siguiente, señor Gabriel Barandiaran».
- accion_sugerida: Corregir la frase de `notas.md`: «tres resoluciones de licencia consecutivas, una
  por día, del mismo titular». Y borrar el párrafo sobre el id.

### politicos[0].estado_actual.salida — `fin_de_mandato`, 2004-12-15
- severidad: **corregir**
- tipo: riesgo_legal (afirma más de lo que la fuente respalda)
- objecion: Es la misma objeción de la crítica anterior con otra fecha, y sigue en pie. La única
  fuente es la convocatoria del 15 de diciembre de 2004; su cita prueba que ese día fue convocado, no
  que ahí terminó su actuación. La Legislatura 45 corría hasta el **2005-02-14**, y el propio
  `notas.md` de esta vuelta dice que quedan **21 días sin fechar** y **15 diarios sin abrir**,
  incluidos varios de 2002-2003 pero sin garantía de que no haya de 2005. Publicar «salida: fin de
  mandato, 15 de diciembre de 2004» le cierra al lector una carrera que la evidencia deja abierta dos
  meses más.
- cita_de_contexto: «por el día 15 de diciembre de 2004, convocándose al suplente siguiente, señor
  Gabriel Barandiaran» — la cita no menciona ningún fin de mandato.
- accion_sugerida: O `fecha: 2005-02-14` con el fundamento de que es el fin de la Legislatura (dato
  institucional, no de esta persona), o dejar 2004-12-15 con un `detalle` que diga «última actuación
  documentada; la Legislatura terminó el 14 de febrero de 2005 y quedan 21 días de suplencia sin
  fechar». La segunda es la que respeta la evidencia.

### declaraciones[0] — 2003-11-07 — pasantías «para abogados de la Universidad Católica»
- severidad: **corregir**
- tipo: riesgo_legal (verificabilidad)
- objecion: La misma objeción de fuente caída: la única fuente es
  `https://infolegislativa.parlamento.gub.uy/temporales/9699879.PDF`. Sin URL estable, una
  declaración con `evidencia.nivel: textual` no es verificable. Dos observaciones menores más, las
  dos correctas tal como están pero que conviene que el editor vea: el registro fecha la declaración
  el **2003-11-07** (fecha de la exposición escrita) y la fuente el **2003-11-11** (fecha del diario
  donde se publica), lo que está bien explicado en el `titulo`; y el 7 de noviembre de 2003 cae dentro
  del mandato `[24]` (2003-11-05 → 08), así que el `cargo_en_ese_momento` es consistente.
- cita_de_contexto: la cita del registro es literal de la exposición escrita.
- accion_sugerida: Reemplazar la URL por la de la Hemeroteca del diario del 2003-11-11 (barrido HEAD)
  y reverificar la cita.

### declaraciones[1] — 2004-05-12 — corretaje inmobiliario, artículo 11
- severidad: **corregir**
- tipo: riesgo_legal (verificabilidad)
- objecion: Igual que la anterior: única fuente `temporales/8839703.PDF`. En este caso el reemplazo
  ya está localizado: verifiqué que
  `biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2004-05-12 - DIARIO DE SESIONES DE LA CAMARA DE REPRESENTANTES (0022).pdf`
  responde 200. La fecha cae dentro del mandato `[27]` (2004-05-11 → 14), consistente. El `tema`
  asignado es `vivienda`, que para una ley de corretaje inmobiliario es la aproximación menos mala de
  las existentes, pero encaja mejor en el subtema `economia/defensa-consumidor` que propongo en la
  crítica del lote de intervenciones.
- cita_de_contexto: «SEÑOR BARANDIARAN.- Señor Presidente: quisiera hacer algunas preguntas,
  principalmente a algún miembro de la Comisión.» —
  `https://infolegislativa.parlamento.gub.uy/temporales/8839703.PDF` (caída), reemplazable por el PDF
  de la Hemeroteca ya verificado.
- accion_sugerida: Cambiar la URL por la de la Hemeroteca, que ya está identificada, y revisar el
  tema cuando exista el subtema nuevo.

### politicos[0].mandatos[24] — la misma URL contada como dos fuentes
- severidad: aviso
- tipo: presentacion
- objecion: Las dos «fuentes» del mandato 2003-11-05 → 08 son el mismo archivo
  (`temporales/3539554.PDF`) con dos citas distintas. No es un error —las dos citas son reales— pero
  el punto 2 de la lista de control («un publicador con varios documentos es una línea») y la regla de
  fuente primaria («una entrevista es una fuente aunque se citen tres pasajes») dicen que se agrupan
  por URL. Contadas como dos, inflan la apariencia de respaldo.
- cita_de_contexto: «1) Concédese licencia para viajar al exterior en misión oficial […] por el
  período comprendido entre los días 5 y 8 de noviembre de 2003» y «Suplente convocado: Gabriel
  Barandiaran. Observaciones: (1) A la hora 19:30 comenzó licencia», las dos del mismo PDF.
- accion_sugerida: Ninguna en el dato; que el editor sepa que la página las va a agrupar.

### politicos[0] — dos convocatorias rechazadas y una foto, bien resueltas
- severidad: aviso
- tipo: sin_objecion
- objecion: Sin objeción y lo digo explícitamente porque son decisiones que podrían haberse tomado
  mal. (a) Las convocatorias rechazadas del **15 de mayo de 2001** y del **22 de mayo de 2002** no se
  cargaron como mandato: correcto, un rechazo de convocatoria no es ejercicio del cargo, y el criterio
  es el mismo que en la vuelta anterior. Quedan documentadas en `hipotesis`, que es donde van.
  (b) La fotografía de `espectador.com` archivada en Wayback **no** se usó, por falta de licencia
  libre: correcto según CLAUDE.md («Fotos de diarios, nunca»), y la nota explica cómo pedir permiso.
  (c) `casos_vistos` vacío con constancia de que no apareció ninguna denuncia: correcto.
  (d) El límite documentado sobre el diario del 15 de junio de 2000, donde el identificador interno
  3966 del Parlamento devuelve un PDF de una sesión de 2022, está bien diagnosticado como problema del
  sitio de origen y no de la investigación.
- accion_sugerida: Ninguna.

### politicos[0].cobertura — el bloque existe y dice lo que tiene que decir
- severidad: aviso
- tipo: sin_objecion
- objecion: La objeción de presentación de la crítica anterior («falta el bloque Qué se buscó y qué
  existe») está resuelta: hay `cobertura.texto` con fecha, y explica el alcance del barrido, cuántos
  diarios de los 97 se abrieron y qué quedó. Una sugerencia, no una objeción: cuando se promueva el
  lote de intervenciones, ese texto tiene que ampliarse para decir que la actuación parlamentaria
  1995-2000 **sí** se recorrió completa por la Hemeroteca —lo que contradice la frase de la vuelta 1
  sobre que ese período «no está digitalizado»— y que lo que sigue faltando son los cuatro diarios en
  papel identificados por número (2472, 2688, 2818, 2845) y la prensa de la época.
- accion_sugerida: Actualizar `cobertura.texto` al promover, para que las dos corridas cuenten la
  misma historia.

---

## Objeciones al lote

### 1. Proceso: esto no se promueve, se corrige
- severidad: **aviso** · tipo: presentacion

`pnpm promover` «no sobreescribe nunca» y `content/politicos/barandiaran.yaml` ya existe con 11
mandatos. Este lote trae 29. El único camino es `pnpm promover <dir> --correccion <id>` con un
registro escrito en `content/correcciones/`. El tipo que corresponde es una corrección de contenido
(se agregan 18 mandatos y se extiende uno publicado, el de 2001-12-11, que pasa a 2001-12-13); si
además se cambian las 39 URLs por las de la Hemeroteca, eso es `cotejo_con_primaria` o `presentacion`
según cómo lo vea el editor, y se publica en el historial como cualquier otra. Lo anoto porque el
`notas.md` no lo menciona y porque `/revisar` va a chocar con el «no sobreescribe» si intenta la vía
normal.

### 2. La cobertura declarada es honesta y el faltante está bien delimitado
- severidad: **aviso** · tipo: sin_objecion

Verifiqué la cuenta: 89 días de 110, sin solapamientos, 21 días pendientes. `notas.md > limitaciones`
lista fecha por fecha cuáles diarios ya se abrieron sin resultado (para que nadie los repita) y cuáles
quedan sin abrir, con la URL exacta del buscador para continuar. Eso es exactamente lo que pide el
punto 3 de la lista de control aplicado a un dato incompleto: decir el rango que hay y por qué falta
el resto. Y el propio texto dice «No hay asimetría deliberada», con el motivo real (presupuesto de
tiempo y timeouts de CDX). No tengo nada que objetar acá.

Una observación técnica sobre el punto 4 de `limitaciones`: el diagnóstico de los timeouts de CDX
sobre dominios grandes es correcto y la solución propuesta (paginar con `showNumPages` + `page` en
vez de pedir el índice completo) es la que corresponde. Yo mismo consulté el CDX de
`biblioteca.parlamento.gub.uy` acotado por path y respondió en once segundos: el problema es el
tamaño del dominio, no la herramienta.

### 3. Regla 0
- severidad: **aviso** · tipo: sin_objecion

Nada que objetar en el brief ni en la ejecución. El lote documenta días de ejercicio de un cargo
público con la resolución de licencia que los origina, sin selección por signo ni por conveniencia,
y deja constancia de lo que no encontró. La única advertencia de Regla 0 que aplica a esta ficha está
en la crítica del lote de intervenciones (objeción 3, la desproporción de cobertura entre partidos
para 1995-1999) y no se resuelve acá.

---

## Resumen de objeciones

| Severidad | Cantidad | Asuntos |
|---|---|---|
| **bloquea** | 1 | 39 de 45 fuentes son URLs `infolegislativa/temporales/` que devuelven 404 hoy, con equivalente estable verificado en la Hemeroteca |
| **corregir** | 8 | `mandatos[2]` («20010»), `mandatos[6]` y `[15]` (cita sin fechas), `mandatos[20]` (dos resoluciones que no coinciden), `mandatos[25]` y `[26]` (dos documentos oficiales con un día de diferencia), `mandatos[16]` (razón de la fusión mal escrita), `estado_actual.salida` (fecha de cierre que la fuente no prueba), `declaraciones[0]` y `[1]` (fuente caída) |
| **aviso** | 5 | `mandatos[24]` (misma URL contada dos veces); proceso (requiere `--correccion`); cobertura bien declarada; convocatorias rechazadas, foto y `casos_vistos` bien resueltos; `cobertura.texto` a actualizar |

## Cobertura

Sin registros `cobertura`: el lote no contiene ninguna nota de prensa. Las 45 fuentes son diarios de
sesiones y documentos del Parlamento, más la Enciclopedia Electoral y una entrada de Wikipedia en las
candidaturas. La búsqueda de prensa 1999-2004 que describe `notas.md` no produjo ninguna nota nueva:
`espectador.com` devolvió dos fotografías sin texto, `radioelespectador.com` ninguna, y los otros
cinco dominios fallaron por timeout de la consulta CDX. No hay nada cuyo tono se pueda medir.
