# Notas — Barandiarán, días restantes de suplencia (Legislatura 45, 2000-2005)

## Aclaración de partida: el total de la ficha publicada no es 89

El brief (y la `cobertura.texto` de la corrección `2026-09-09-barandiaran-suplencias-2000-2004`) afirman
que la ficha publicada fecha "89 de los 110 días". Recalculé programáticamente la suma de días
(`hasta - desde + 1`) de los 28 `mandatos[]` de suplencia ya publicados para la Legislatura 45 y da
**87 días**, no 89. No encontré ningún mandato adicional que explique la diferencia de 2 días; parece
un desajuste de aritmética en el texto de cobertura de la vuelta anterior, no un error en las fechas
mismas de cada mandato (que están bien y no las toqué).

Coincidencia a declarar: los dos mandatos nuevos que agrego en esta vuelta (2000-09-22 y 2002-06-03,
1 día cada uno) suman exactamente 2 días, así que el total final que reporto (89 días documentados,
21 sin fechar) coincide numéricamente con lo que el brief ya daba por hecho *antes* de mi trabajo. Es
una coincidencia de la aritmética, no una confirmación independiente del "89" previo: mi punto de
partida real, verificado, era 87.

## Mandatos nuevos agregados

| Fecha | Días | Fuente | Base fáctica |
|---|---|---|---|
| 2000-09-22 | 1 | Diario de Sesión, Cámara de Representantes, 13 de setiembre de 2000 (resolución de la Comisión de Asuntos Internos, leída y votada en sala ese día) | Licencia de un día de Iván Posada por motivos personales para el 22 de setiembre de 2000; se convoca a Barandiarán como suplente correspondiente siguiente. Es un período nuevo, no contiguo a los ya fechados de setiembre (11-13) ni de noviembre (6-12) de 2000. |
| 2002-06-03 | 1 | Diario de Sesión, Cámara de Representantes, 22 de mayo de 2002 (resolución de la Comisión de Asuntos Internos) | Iván Posada pide licencia para un viaje del 3 al 8 de junio de 2002. La Cámara convoca a Barandiarán para el 3 de junio y a Carlos Castaldi para el 4-8; Barandiarán después comunica que no acepta la convocatoria para el 4-8 (carta transcrita en el mismo diario), pero no hay ninguna comunicación suya declinando el día 3, que es el que efectivamente le corresponde y por el que quedó convocado. |

Con estos dos, el total de días documentados con fecha y cita para la Legislatura 45 pasa de 87 a
**89 sobre 110** (quedan 21 sin fechar).

## Hallazgos que no son mandatos nuevos pero afectan a mandatos ya publicados

Estos tres hallazgos surgieron al leer diarios ya marcados por el barrido, dentro de rangos que la
ficha publicada ya da por "fechados". No los toqué (no edito `content/`, y mi encargo es agregar
períodos nuevos, no corregir los existentes), pero el rigor exige dejarlos documentados con su cita
para que el editor decida si ameritan una corrección:

### 1. La suplencia del 16-20 de diciembre de 2002 parece haber sido declinada, no ejercida

El mandato ya publicado `2002-12-16` a `2002-12-20` está sourceado solo con el diario del **4 de
diciembre de 2002**, que registra la convocatoria inicial. Pero el diario del **11 de diciembre de
2002** (`https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2002-12-11%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0078).pdf`),
que estaba entre los 47 diarios sin citar en la ficha, contiene la resolución completa:

> "Comisión de Asuntos Internos VISTO: I) La licencia oportunamente concedida al señor Representante
> por el departamento de Montevideo, Iván Posada, por el período comprendido entre los días 16 y 20
> de diciembre de 2002. II) Que la Cámara de Representantes, con fecha 4 de diciembre de 2002,
> convocó al señor Gabriel Barandiaran para ejercer la suplencia correspondiente. III) Que el señor
> Gabriel Barandiaran comunica en el día de la fecha que deja sin efecto la convocatoria efectuada.
> IV) Que por ésta vez no acepta la convocatoria de que ha sido objeto el suplente correspondiente
> siguiente, señor Carlos Castaldi. [...] La Cámara de Representantes, RESUELVE: 1) Acéptanse las
> negativas que, por esta vez, han presentado los señores Gabriel Barandiaran y Carlos Castaldi. 2)
> Convóquese por Secretaría para integrar la representación por el departamento de Montevideo, por
> el período comprendido entre los días 16 y 20 de diciembre de 2002, a la su[plente correspondiente
> siguiente...]" (le sigue el nombre de la suplente convocada en su lugar, Ana María Casalás, según
> el mismo diario, carácter ~85900).

Es decir: Barandiarán fue convocado el 4 de diciembre para el 16-20, pero el 11 de diciembre "deja
sin efecto la convocatoria" y la Cámara acepta esa negativa y convoca a otra suplente. Si esto se
confirma, el mandato publicado `2002-12-16/2002-12-20` (5 días) debería eliminarse o marcarse como no
ejercido, lo que bajaría el total de días documentados de 89 a 84. No lo resolví yo mismo porque
excede el encargo de esta corrida (agregar días nuevos, no reabrir los ya publicados); lo dejo para
que el editor lo evalúe con la cita completa arriba.

### 2. La suplencia de un solo día del 6 de marzo de 2002 tiene una lista de asistencia que lo marca ausente

El mandato publicado `2002-03-06` (1 día) está sourceado con la resolución de convocatoria del 5 de
marzo. Pero el diario del propio **6 de marzo de 2002** (Diario N.º 3013,
`https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2002-03-06%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0003).pdf`),
en su sección "1.- Asistencias y ausencias", no lo incluye en la lista de "Asisten" sino en una lista
aparte:

> "Faltan con aviso: Alberto Perdomo, Adolfo Pedro Sande, Alberto Scavarelli, Gustavo Silveira y María
> Terrón de Esteves. Sin aviso: Gabriel Barandiaran."

Es decir, la propia sesión del día para el que estaba convocado lo registra como ausente sin aviso.
No hay, en este diario, ninguna otra sesión distinta ese mismo día (a diferencia del patrón que sí
encontré para otras fechas, ver más abajo) que explique la ausencia como "otra sesión sí, esta no".
Si se confirma, el mandato de un día `2002-03-06` no se habría ejercido, bajando el total en 1 día
más. Mismo criterio que el punto anterior: lo dejo documentado, no lo resuelvo.

### 3. Patrón de "Sesión Extraordinaria" vs. sesión ordinaria el mismo día (no es una contradicción, es un patrón)

En varias fechas ya cubiertas encontré listas de "Faltan con aviso" o "Sin aviso" que a primera vista
contradicen la asistencia ya documentada, pero corresponden a una **sesión distinta el mismo día**
(la Cámara sesiona más de una vez el mismo día — ordinaria y extraordinaria, o Asamblea General): el
17 de marzo de 2004 es el caso más claro, con dos diarios del mismo día: uno (0009) lo marca ausente
en la "Extraordinaria: hora 15:00", y el otro (0010), de la sesión ordinaria, lo marca presente en el
"Asisten los señores Representantes". Encontré el mismo patrón (probable, no confirmado con un
segundo diario del mismo día) el 3 de octubre de 2001 (ausente en la Asamblea General, ya presente en
la Cámara de Representantes según el mandato publicado) y el 18 de diciembre de 2001 y el 3 de abril
de 2003 (ausente en sesiones "extraordinarias" dentro de rangos ya fechados por convocatoria). No los
marco como contradicción porque el patrón del 17 de marzo de 2004 muestra que son compatibles; los
dejo mencionados por transparencia, no como hallazgo que requiera corrección.

## Tabla completa: los 47 diarios de la Cámara de Representantes marcados y no citados aún

| Diario | Resultado |
|---|---|
| 2000-06-07 (0015) | Sin dato nuevo: las 6 menciones son proyectos/exposiciones fechados 6 de junio de 2000 (día ya cubierto), leídos en la sesión del día siguiente; Barandiarán no figura en la lista de asistencia del 7 de junio. |
| 2000-06-15 (0020) | Sin dato nuevo: mención retrospectiva a "la exposición del ex Diputado Barandiaran" en un debate posterior sobre otro proyecto. |
| 2000-07-05 (0022) | Sin dato nuevo: lista de asistencia del 5 de julio de 2000, día ya cubierto (mandato 2000-07-05/07). |
| 2000-07-11 (0023) | Sin dato nuevo: exposiciones fechadas 6 de julio de 2000 (ya cubierto) y ausencia con aviso a una comisión el 6 de julio. |
| 2000-09-12 (0034) | Sin dato nuevo: lista de asistencia del 12 de setiembre de 2000, ya cubierto (mandato 2000-09-11/13). |
| 2000-09-13 (0035) | **Mandato nuevo: 2000-09-22** (ver arriba). También asistencia del 13-set (ya cubierto). |
| 2000-10-03 (0036) | Sin dato nuevo directo: corrobora el mandato nuevo del 22 de setiembre (proyecto firmado "Montevideo, 22 de setiembre de 2000, Gabriel Barandiaran Representante por Montevideo"); también ausencia con aviso a comisión el 13-14 de setiembre (ya cubierto). |
| 2000-11-01 (0039) | Sin dato nuevo, pero hallazgo relevante: la resolución votada este día da la licencia de Iván Posada (y la convocatoria a Barandiarán) para el **6 al 9** de noviembre de 2000, no 6-12 como dice "Parlamentarios Uruguayos" (fuente del mandato ya publicado). Posible desfasaje adicional del documento compilado del Parlamento, en la misma línea de los dos casos de 2004 ya corregidos en la vuelta anterior. No encontré, en el presupuesto de esta vuelta, una resolución que extienda la licencia del 9 al 12. Dejo la nota para que se revise si el mandato publicado debería terminar el 9, no el 12. |
| 2000-11-08 (0041) | Sin dato nuevo: lista de asistencia del 8 de noviembre de 2000, ya cubierto (mandato 2000-11-06/12). |
| 2000-12-05 (0046) | Sin dato nuevo: referencia retrospectiva a "los entonces Diputados Barandiaran y Machiñena" en un debate sobre un proyecto de 1998 (Legislatura 44, no la 45). |
| 2000-12-13 (0049) | Sin dato nuevo: interviene en una moción de sala el 13 de diciembre de 2000, día ya cubierto (mandato 2000-12-12/15). |
| 2000-12-21 (0001) | Sin dato nuevo: ausencia con aviso a comisión el 15 de diciembre de 2000, ya cubierto. |
| 2001-01-16 (0003) | Sin dato nuevo: el Ministerio de Vivienda contesta un pedido de informes del "señor ex Representante Gabriel Barandiaran" — referencia retrospectiva explícita, no evidencia de mandato en enero de 2001. |
| 2001-02-14 (0005) | Sin dato nuevo: mismo patrón, "ex Representante", pedido de informes contestado por el Ministerio de Defensa. |
| 2001-04-03 (0010) | Sin dato nuevo: lista de asistencia del 3 de abril de 2001, ya cubierto (mandato 2001-04-03/04). |
| 2001-04-04 (0011) | Sin dato nuevo: asistencia y varias exposiciones fechadas 3 de abril de 2001, ya cubierto. |
| 2001-05-09 (0022) | Sin dato nuevo: lista de asistencia del 9 de mayo de 2001, ya cubierto (mandato 2001-05-08/09). |
| 2001-05-15 (0023) | Sin dato nuevo: es la convocatoria que Barandiarán **rechazó** para el 15 de mayo de 2001, ya identificada como tal en la vuelta anterior (no se carga como mandato). |
| 2001-07-25 (0040) | Sin dato nuevo: proyecto fechado 17 de julio de 2001, ya cubierto. |
| 2001-08-14 (0047) | Sin dato nuevo: "ex Representante", pedido de informes contestado por el MEF. |
| 2001-08-14 (0049) | Sin dato nuevo: lista de asistencia del 14 de agosto de 2001, ya cubierto. |
| 2001-09-04 (0051) | Sin dato nuevo: "ex Representante", pedido de informes contestado por el MEF. |
| 2001-10-03 (0060) | Sin dato nuevo: "Sin aviso: Gabriel Barandiaran" en una sesión de Asamblea General el 3 de octubre de 2001; el mandato publicado (2001-10-02/03) está sourceado con la asistencia en la Cámara de Representantes ese mismo día — sesión distinta, ver nota de patrón arriba. |
| 2001-10-09 (0062) | Sin dato nuevo: repite el dato anterior (resumen de asistencias de la semana). |
| 2001-11-06 (0067) | Sin dato nuevo: la OPP contesta un pedido de informes "del señor Representante Gabriel Barandiarán" (sin "ex"), pero el mismo diario usa la fórmula "el señor Representante X" para otros ex-representantes también; insuficiente para mandato nuevo sin convocatoria o asistencia. |
| 2001-12-18 (0002) | Sin dato nuevo: "Faltan con aviso: Gabriel Barandiaran" en la sesión extraordinaria del 18 de diciembre de 2001, dentro del mandato ya publicado (2001-12-17/18); ver nota de patrón arriba. |
| 2001-12-19 (0003) | Sin dato nuevo: repite la ausencia anterior. |
| 2002-03-06 (0003) | Sin dato nuevo, pero hallazgo relevante (ver arriba): "Sin aviso" en la sesión del propio 6 de marzo de 2002, día del mandato de un solo día ya publicado. |
| 2002-05-22 (0018) | **Mandato nuevo: 2002-06-03** (ver arriba). |
| 2002-10-09 (0062) | Sin dato nuevo: corrobora con mejor fuente primaria (asistencia + resolución de sala) el mandato ya publicado 2002-10-09/20, que hoy solo cita el compilado "Parlamentarios Uruguayos"; podría usarse para reforzar ese registro en una futura corrección. |
| 2002-10-15 (0063) | Sin dato nuevo: lista de asistencia del 15 de octubre de 2002, ya cubierto. |
| 2002-10-23 (0065) | Sin dato nuevo: ausencia sin aviso a una comisión el 17 de octubre de 2002, ya cubierto. |
| 2002-12-11 (0078) | Sin mandato nuevo, pero hallazgo relevante (ver arriba): Barandiarán declina la suplencia del 16-20 de diciembre de 2002. |
| 2002-12-17 (0001) | Sin dato nuevo: proyecto fechado 13 de diciembre de 2002, ya cubierto (mandato 2002-12-09/13). |
| 2003-04-02 (0006) | Sin dato nuevo: lista de asistencia del 2 de abril de 2003, ya cubierto (mandato 2003-04-01/03). |
| 2003-04-02 (0007) | Sin dato nuevo: asistencia e intervención en sala el 2 de abril de 2003, ya cubierto. |
| 2003-04-03 (0008) | Sin dato nuevo: "Faltan con aviso" en la sesión extraordinaria del 3 de abril de 2003, dentro del mandato ya publicado; ver nota de patrón. |
| 2003-04-08 (0009) | Sin dato nuevo: ausencia con aviso a comisión el 3 de abril de 2003, ya cubierto. |
| 2003-11-11 (0068) | Sin dato nuevo: exposición escrita sobre pasantías, republicada; el hecho sustantivo ya está registrado como declaración del 7 de noviembre de 2003 en una corrida aparte. |
| 2004-03-16 (0007) | Sin dato nuevo: asistencia del 16 de marzo de 2004, ya cubierto (mandato 2004-03-16/20). |
| 2004-03-16 (0008) | Sin dato nuevo: repite la asistencia anterior (otra sesión del mismo día). |
| 2004-03-17 (0009) | Sin dato nuevo: "Faltan con aviso" en la sesión extraordinaria de las 15:00 del 17 de marzo de 2004; ver nota de patrón. |
| 2004-03-17 (0010) | Sin dato nuevo: asistencia (presente) en la sesión ordinaria del mismo 17 de marzo de 2004 — confirma el patrón de sesión doble. |
| 2004-03-18 (0011) | Sin dato nuevo: asistencia del 18 de marzo y repetición de la ausencia extraordinaria del 17. |
| 2004-05-06 (0020) | Sin dato nuevo: mención ambigua de una exposición escrita ya procesada, sin convocatoria ni asistencia; insuficiente. |
| 2005-07-19 (0034) | Fuera de la Legislatura 45 (termina 2005-02-14): mención retrospectiva a "los entonces Diputados... Gabriel Barandiarán" en un debate de 2005. |
| 2005-08-18 (0046) | Fuera de la Legislatura 45: reproduce un proyecto firmado en 1999 (Legislatura 44) por varios legisladores incluido Barandiarán. |

## Comisión Permanente

El barrido de los 72 diarios de la Comisión Permanente 2000-2005 (`.cache/barandiaran-cp-2000-2005-hits.jsonl`)
terminó ("listo" en `.cache/barrer-2000-2005.log`) con **0 apariciones de "Barandiarán" en los 72
diarios**; el archivo de hits no llegó a crearse porque el script solo escribe una línea por diario
con al menos una coincidencia. No hay, entonces, ningún día de suplencia de Barandiarán en la Comisión
Permanente para este período.

## candidatos_giro

Ninguno — esta corrida no investiga declaraciones ni posiciones, solo fechas de ejercicio del cargo.

## hipotesis

- El mandato publicado `2002-12-16/2002-12-20` podría no corresponder a un ejercicio real (Barandiarán
  lo declinó el 11 de diciembre de 2002, según el diario de esa fecha). Falta que el editor confirme
  con la fuente completa (citada arriba) y decida si amerita una corrección que lo retire de la ficha.
- El mandato publicado `2002-03-06` (1 día) podría no corresponder a un ejercicio real: la lista de
  asistencia de ese mismo día lo marca "Sin aviso" (ausente). Mismo tratamiento: falta confirmación
  del editor.
- El cierre del mandato `2000-11-06/2000-11-12` podría deber terminar el 9 de noviembre, no el 12: la
  resolución de licencia votada el 1º de noviembre de 2000 da el período "6 y 9 de noviembre de 2000"
  para el titular con licencia (Iván Posada), no 6-12 como dice el documento compilado "Parlamentarios
  Uruguayos" que es la única fuente citada hoy para ese mandato. No encontré una resolución posterior
  que extienda el período a 3 días más; puede existir y no estar entre los diarios marcados por el
  barrido (el barrido busca "Barandiarán", y una extensión de la licencia del titular sin cambiar de
  suplente no necesariamente vuelve a mencionarlo). Sin confirmar.

## casos_vistos

Ninguno.

## verificacion_manual

Ninguna URL quedó sin poder leerse en esta vuelta.

## cobertura_del_periodo

- **Cámara de Representantes, Legislatura 45 (2000-2005):** los 83 diarios marcados por el barrido
  (`.cache/barandiaran-crr-2000-2005-hits.jsonl`) fueron todos revisados: 36 ya estaban citados en la
  ficha publicada, 47 se leyeron en esta vuelta. De esos 47, 2 dieron un período de mandato nuevo
  (2000-09-22 y 2002-06-03), 3 dieron hallazgos relevantes sobre mandatos ya publicados (ver arriba) y
  el resto no aportó dato nuevo (asistencia o contenido dentro de un rango ya fechado, o menciones
  retrospectivas "ex Representante").
- **Comisión Permanente, Legislatura 45 (2000-2005):** los 72 diarios del período fueron barridos por
  completo; ninguno menciona a Barandiarán.
- **Total de días de suplencia documentados con fecha y cita, Legislatura 45:** 89 de 110 (antes de
  esta vuelta: 87, no 89 como decía el brief — ver aclaración al inicio). Quedan 21 días sin fechar.
  No identifiqué, dentro de los diarios ya marcados por este barrido, ningún otro diario con
  información suficiente para fechar esos 21 días: o son diarios que el barrido no marcó (porque no
  contienen la palabra "Barandiarán", por ejemplo si su convocatoria consta solo en un diario de una
  fecha posterior no capturada, o en un diario cuyo texto no se pudo extraer bien), o corresponden a
  suplencias que ningún diario de sesiones documenta con el nombre completo.
- **Antes de 2000-06-06 y después de 2004-12-15:** sin cambios respecto de la vuelta anterior; no
  encontré diarios marcados por el barrido en esos márgenes que aporten días nuevos (el primer
  mandato de suplencia sigue siendo el 6 de junio de 2000; el último, el 15 de diciembre de 2004).
- **1995-2000 (Legislatura 44, titular) y 2005 en adelante:** fuera del alcance de esta corrida
  (cubiertos, según la propia ficha, por la corrida `2026-09-09-barandiaran-intervenciones` y por el
  fin de la Legislatura 45 respectivamente).

## objeciones_al_brief

Ninguna. El brief pide el mismo criterio de evidencia para cada día y cada fuente, y no pide omitir ni
encuadrar nada; no hay asimetría que objetar bajo la Regla 0. La única precisión que agrego es la del
desajuste aritmético del "89" inicial, ya señalada al principio de estas notas.
