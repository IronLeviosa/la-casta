# Razones — cargos recuperados por el cambio de esquema (FechaParcial)

Modelo: claude-sonnet-5 (brazo barato del experimento; el encargo pidió correr esta corrección en
Sonnet. Queda dicho para el registro del experimento).

## Qué cambió y por qué esto no es "poné el año y listo"

`mandatos[].desde` y `.hasta` aceptan ahora `YYYY`, `YYYY-MM` o `YYYY-MM-DD` (`FechaParcial` en
`src/schemas/base.ts`). Bajo la regla anterior (día exacto obligatorio), tres cargos documentados
habían quedado fuera de tres fichas de vicepresidentas por el mismo motivo: ninguna fuente daba el
día. Para cada uno volví a buscar la fecha más exacta posible antes de conformarme con el año; el
resultado no fue igual en los tres casos, y por qué no lo fue queda explicado abajo.

## Búsqueda por persona (mismo esfuerzo, resultado distinto)

**Argimón — Directora del Instituto Nacional del Menor (INAME).** Releí el cuerpo completo de
Wikipedia (ya tenía la cita de "durante el período presidencial de Lacalle"). Busqué con
`WebSearch` y abrí con `pnpm fuente`: historia-biografia.com (biografía de baja calidad, confunde a
Lacalle Herrera con Lacalle Pou, sin fecha), ecured.cu (espejo de Wikipedia, sin fecha), la
biografía oficial de Argimón en `parlamento.gub.uy` (PDF, documento oficial: da "1995: Nombrada
Directora del Instituto Nacional del Menor", año suelto sin rango) y un despacho de Agencia EFE
distribuido por Yahoo Noticias (1/3/2020), que sí ata el hecho a un rango de años en la misma
oración: "durante el Gobierno de Luis Alberto Lacalle Herrera, el padre del actual presidente
(1990-1995), a ser directora del Instituto Nacional del Menor (Iname)". Seis fuentes abiertas en
total sobre este punto.

Elegí el rango 1990-1995 (EFE) en vez del año suelto 1995 (Parlamento) porque es la única fuente
que junta, en una misma oración, el hecho y los años; usar el dato del Parlamento habría exigido
inventar un `hasta` que esa fuente no da, o forzar `desde = hasta = 1995` cuando el resto de las
fuentes (Wikipedia, Montevideo Portal, El Observador, la propia biografía del Parlamento en otros
párrafos) describen una gestión con varios logros, no un cargo de semanas. No concilié la tensión:
la dejo escrita acá. Si en el futuro aparece un documento (resolución del Poder Ejecutivo, Diario
Oficial) que fije el día, hace falta una corrección nueva.

De paso, la biografía del Parlamento confirmó, con fecha 1989 (año), que Argimón también
fue Edila de Montevideo antes del INAME — el mismo hallazgo que la crítica de la corrida ya había
señalado como pendiente. No lo agregué: no es uno de los tres cargos de este encargo y el
Parlamento no da rango (solo dice "1989: Electa", sin `hasta`); queda anotado para una corrida
futura, no en `hipotesis/` porque no es una hipótesis sino un dato con año confirmado al que le
falta el cierre.

**Topolansky — Edila de Montevideo.** Releí Wikipedia (infobox: "1995-2000"; cuerpo: "En 1995
asumió como edila suplente de la junta departamental de Montevideo"). Busqué con `WebSearch` y
`pnpm fuente`: ecured.cu y heroinas.net (ambos espejos casi literales del texto de Wikipedia, sin
fecha adicional), intenté la biografía oficial de Topolansky en `parlamento.gub.uy` en el mismo
formato PDF que dio resultado para Argimón (404, no existe con ese nombre de archivo) y el sitio de
su sector (`equipo609.uy`, fetch fallido). No encontré una fuente no-Wikipedia. Seis intentos, ningún resultado adicional: a diferencia de
Argimón, acá el problema no es que la fecha exacta esté en otro lado y yo no la haya encontrado con
suficiente esfuerzo — es que la cobertura de este cargo puntual, treinta años después, parece no
existir fuera de Wikipedia. Uso año (1995-2000), un solo tipo de fuente, consistente con el criterio
ya aplicado en el resto de la ficha para mandatos con una sola fuente.

**Cosse — Directora de la División Tecnología de la Información de Montevideo.** Releí Wikipedia
(infobox: "2007-2010"; cuerpo: "Su actividad en la política comenzó en 2007, cuando asumió como
directora de la División Tecnología de la Información..."). Busqué con `WebSearch` y encontré dos
notas de LARED21 de la época: una del 17/10/2007 sobre el lanzamiento del Sistema de Transporte
Metropolitano, que la llama "la asesora en Telecomunicaciones de la IMM, Carolina Cosse" (no
"directora"), y un perfil biográfico (≈abril de 2010) que da un dato más preciso pero con un tercer
título: "Fue contratada por la Intendencia Municipal de Montevideo (IMM) a partir del 20 de marzo y
hasta el 31 de diciembre de 2007, como Asesora Especialista en Telecomunicaciones, en régimen de
dedicación total y exclusiva." Tres títulos distintos para lo que probablemente es el mismo cargo
en la misma repartición y la misma época ("directora de división" en Wikipedia y en el propio perfil
de LARED21, "asesora en Telecomunicaciones" y "Asesora Especialista en Telecomunicaciones" en las
notas de prensa de 2007). No usé la fecha de día (20/3/2007) en el registro porque está atada, en la
fuente, a un título distinto del que uso en el campo `cargo`, y unir ambos sin una fuente que los
identifique como el mismo puesto habría sido forzar la cita a decir algo que no dice de forma
explícita. Además, `lr21.com.uy` devuelve HTTP 403 a un fetch directo (solo pude leer el contenido
enrutándolo por `web.archive.org`, sin lograr un archivado propio: "sin archivo Wayback, HTTP 523"),
lo que habría exigido marcar esa fuente como `verificacion: manual` y, con eso, pedir aprobación
humana para un dato que de todos modos no iba a poder usar con el título correcto. Uso año
(2007-2010), con la misma fuente (Wikipedia) que ya sostenía el resto de la ficha.

## Por qué la precisión final no es igual en los tres casos

Los tres quedan en precisión de año, no por buscar distinto sino porque el material disponible es
distinto: Argimón tuvo la suerte de una fuente (EFE) que ata el hecho a un rango completo en una
sola oración citable; Topolansky no tiene, que yo haya encontrado, ninguna fuente no-Wikipedia
sobre este cargo puntual; Cosse tiene una fecha de día, pero atada a un título que no puedo probar
que sea el mismo que uso en el registro. Ninguno de los tres casos se resolvió con menos esfuerzo
que los otros dos: los tres pasaron por Wikipedia completa, `WebSearch` dirigida y al menos un
intento de fuente oficial o de archivo (Parlamento para Argimón y Topolansky, LARED21/wayback para
Cosse).

## Qué no se agregó y por qué

Los tres cargos del encargo se agregaron. No se agregó la Edilía de Argimón (1989, sin `hasta`
documentado) ni se resolvió la tensión entre las dos fechas de inicio del INAME de Argimón
(1990 según EFE, 1995 según el Parlamento): ambas quedan fuera del alcance de este encargo y
anotadas arriba para una corrida futura.

## Regla 0

Tres personas, dos partidos (Argimón, Partido Nacional; Topolansky y Cosse, Frente Amplio). Se
aplicó la misma pregunta a las tres ("¿hay una fuente con más precisión que la ya conocida?") con
un número comparable de fuentes abiertas por persona (seis para Argimón, cinco para Topolansky,
cuatro para Cosse, más una consulta de `WebSearch` cada una). La diferencia de resultado (a una se
le pudo dar un rango de años sólido, a otra un año suelto de una sola fuente, a la tercera un año
con una complicación de título que se optó por no forzar) responde al material que cada una tiene
documentado, no a cuánto se buscó.

## Validación

Corrí `pnpm validar --inbox inbox/correcciones/cargos-sin-fecha-exacta/2026-09-05 --red`: 0
errores, 22 citas verificadas "exacta (1.00)" contra el texto de sus fuentes, 6 avisos esperados de
precisión de año/mes (los mismos tres cargos nuevos, en `desde` y `hasta`). También corrí `pnpm
validar` (sin `--inbox`) sobre `content/` para confirmar que `content/correcciones/2026-09-05-
cargos-recuperados-fecha-parcial.yaml` no introduce errores de esquema.
