# Razones — corrida 2026-09-04-orsi-vetos

Editor: claude-sonnet-5.

## Objeción bloqueante de critica.md, verificada y dada por resuelta

La objeción `bloquea` sobre `vetos.yaml` (vacío) — el crítico había mostrado, con un control
positivo sobre el veto real de Lacalle Pou a la ley de suelos de prioridad forestal, que la
búsqueda de texto libre original tenía falsos negativos — está saldada. Confirmé en
`notas.md`, sección `cobertura_del_periodo`, que el investigador rehizo el barrido: abrió la
ficha de trámite de cada una de las **120 leyes promulgadas en la Legislatura 50** entre
2025-03-01 y 2026-09-04 (listado confirmado por dos vías independientes: el buscador con
filtro de fechas del propio sitio del Parlamento y el dataset CSV de datos abiertos), leyó el
texto completo de la sección "Sanciones" de cada ficha, y el método quedó validado en dos
casos de control antes de aplicarlo: el patrón positivo (ficha 148848, Lacalle Pou, línea
"Poder Ejecutivo veto total.") y el patrón negativo (ficha 165490, Orsi, ley de eutanasia,
línea "Poder Ejecutivo promulga." sin veto). Resultado: 0 de 120 fichas contienen la palabra
"veto". Esto no es un cambio que yo hice sobre el crudo — ya estaba resuelto por el
investigador antes de que yo abriera la corrida — pero lo dejo registrado acá porque de esto
depende que la afirmación negativa del lote se pueda sostener con el mismo rigor exigido al
lote de Lacalle Pou (objeción de simetría del crítico, más abajo).

## Cambios no triviales sobre el crudo

- `declaraciones.yaml[0]`: agregué `revision: {tier: probable, notas_internas}`. Tier
  `probable`, no `publicado`, porque el registro es `nivel: reportado` con una sola fuente
  (Ámbito, grupo `grupo-ambito`); Teledoce y Caras y Caretas, los únicos otros medios que
  cubrieron el episodio adyacente, no reproducen la cita de Orsi (confirmado por el crítico,
  objeción `aviso` sobre `_faltante: segunda_fuente`). En `notas_internas` dejé anotada la
  pista del crítico —los audios de Presidencia de la gira a Italia
  (gub.uy/presidencia/comunicacion/audios/completos, declaraciones del 18/10/2025 y otras de
  esa gira)— para que una revisión futura los chequee: si alguno tiene la frase con marca de
  tiempo, sube a fuente `documento_oficial`/`video` y nivel `textual`, resolviendo el
  `_faltante` sin necesitar una segunda nota de prensa. No cambié el contenido del registro
  (cita, resumen, evidencia): el crítico confirmó que la cita es literal y que el registro en
  sí no necesitaba corrección, solo el contexto que se redactara a partir de él (ver más abajo).
- `giros.yaml`: creado vacío (`[]`). Con una sola declaración en el lote no hay un segundo
  punto en el tiempo sobre el mismo tema con el que comparar, así que no hay giro que evaluar.
- `hipotesis/orsi/sin-mayoria-explicaria-ausencia-de-vetos.yaml`: creado a partir de la sección
  `hipotesis` de `notas.md`, donde el investigador dejó explícitamente la conjetura de que
  gobernar sin mayoría propia explicaría la ausencia de vetos, marcada como "inferencia sobre
  un patrón, no un hecho verificado", sin incluirla como registro. La formalicé como hipótesis
  abierta con dos explicaciones alternativas más simples primero (es pronto: Lacalle Pou
  tampoco vetó nada en sus primeros 18 meses; podría ser una disposición personal de Orsi
  frente al veto, no una lectura de la aritmética parlamentaria) antes de la estructural. Dejé
  como cabo suelto la afirmación de `notas.md` de que la situación es "inédita desde 1985": no
  la verifiqué con lectura propia en esta sesión y no debe usarse en ningún registro publicado
  sin esa verificación.

## Cambios de forma (ya aplicados por el investigador antes de esta corrida, confirmados)

- `notas.md`, artículo 137: se había agregado la palabra "hábiles" al plazo de diez días, que
  no está en el texto citado de IMPO. Confirmé contra la objeción `corregir` del crítico que ya
  está retirada y que la nota deja constancia explícita del porqué ("esa palabra no está en el
  texto citado... se retira").
- `notas.md`, cronología del episodio de la eutanasia: la versión anterior daba a entender que
  la declaración de Orsi del 16/10/2025 respondía al pedido de veto de Iafigliola. Confirmé que
  ya está corregida: Orsi habló ocho días antes (16/10) de que existiera el pedido de Iafigliola
  (24/10, mismo día de la promulgación); son dos episodios separados, no una respuesta directa.
  Esto no afecta al registro `declaraciones.yaml[0]` en sí (el crítico ya lo señaló así), solo
  a cómo se hubiera podido narrar mal el contexto.

## El hallazgo principal no genera un registro en content/ — dónde queda

Lo más valioso de este lote — que no se encontró ningún veto de Orsi en los 120 proyectos
promulgados hasta ahora, verificado ficha por ficha, y el apunte del procedimiento
constitucional de los arts. 137 a 141 con sus citas literales de IMPO — no tiene forma de
registro en el esquema actual: `vetos.yaml` vacío no genera nada en `content/vetos/` (o la
colección que corresponda), y no hay una colección para "apuntes de procedimiento". No inventé
un registro para forzar que esto aparezca publicado: no hay veto que registrar, y crear uno
sería exactamente el tipo de distorsión que el esquema evita. Ambas cosas quedan documentadas,
de forma completa y citable, en el rastro de esta corrida:
- El barrido de las 120 leyes y su método (con las dos fichas de control): `notas.md`, sección
  `cobertura_del_periodo` y `vetos_sin_desenlace`, más el crudo archivado en
  `data/corridas/2026-09-04-orsi-vetos/crudo/`.
- El apunte constitucional con las citas de los arts. 137-141 (IMPO) y 168 inciso 6º: `notas.md`,
  sección `procedimiento_constitucional`.
Si en el futuro se agrega una colección de "cobertura del período" o de "apuntes de
procedimiento" a `content/`, este es el material fuente ya verificado para poblarla. Hasta
entonces, cualquiera que quiera defender la comparación "Orsi 0 vetos, Lacalle Pou 4" tiene que
poder llegar a este razones.md o a `notas.md` de esta corrida, no solo a `content/vetos/`.

## Simetría con el lote de Lacalle Pou (4 vetos en 5 años vs. 0 en 1.5 años)

El crítico identificó bien el riesgo: "4 contra 0" sin más contexto se lee como diferencia de
comportamiento cuando, con lo que hay hoy, es al menos en parte diferencia de tiempo
transcurrido. El primer veto de Lacalle Pou fue a los ~21 meses de mandato; Orsi lleva ~18. Lo
que hace falta para que la comparación no sea un artefacto de la duración del mandato:
1. Que cualquier visualización o texto del sitio que compare ambos conteos muestre, junto al
   número, el tiempo transcurrido de cada mandato (o, mejor, compare "vetos en los primeros 18
   meses" de cada uno — que hoy es 0 a 0 — en vez de "vetos en todo el mandato").
2. Que dicha comparación deje explícito que el mandato de Orsi sigue en curso y el conteo es
   parcial, sujeto a actualización (no un resultado final).
3. Que el rigor de verificación sea el mismo de los dos lados: ya lo es (barrido ficha por
   ficha de las 120 leyes de Orsi, con dos casos de control, es equivalente al uso de
   `ficha_completa` como fuente `documento_oficial` para los cuatro vetos de Lacalle Pou).
**El sitio hoy no da esa información.** Con el esquema actual, `vetos.yaml` vacío no deja
ningún rastro visible en `content/`: una página que liste "vetos de Orsi: 0" contra "vetos de
Lacalle Pou: 4" sin la referencia temporal (y sin el "en curso, sujeto a actualización") daría
la lectura errónea que señala el crítico. Esto es una limitación de lo que existe en
`content/` hoy para presentar una afirmación negativa, no de la investigación ni de esta
edición: quien construya esa comparación en el sitio (una vista de "vetos por presidente" o
similar) necesita sumar la fecha de asunción y la fecha de corte de cada mandato, o el punto
de referencia queda perdido.

## Objeciones de critica.md que no se resolvieron en esta corrida

- La pista de los audios de Presidencia de la gira a Italia para la segunda fuente de
  `declaraciones.yaml[0]` (objeción `aviso`) queda sin buscar, según instrucción explícita:
  documentada en `notas_internas` del registro para una revisión futura.
- El punto sobre el art. 140 y la falta de un quinto valor en `resultado.estado` para "el
  proyecto cae por desaprobación sin convertirse en ley" (objeción `corregir` sobre `notas.md`)
  no aplica a ningún registro de este lote (no hay vetos), así que no había nada que corregir
  ahora; queda anotado en `notas.md` para cuando exista un veto real que pueda caer en ese
  supuesto.
- El punto sobre relecturas con `WebFetch` en vez de `pnpm fuente` para páginas marcadas "no
  citar" (objeción al lote, punto 2) no generó ningún cambio porque ninguna de esas lecturas
  terminó como `Fuente` de un registro ni sostiene una cita publicada; no hay campo que
  corregir.
- `uruguayaldia.com.uy` (objeción al lote, punto 3) no se dio de alta en `content/medios/`
  porque no lo usé en ningún registro ni en la hipótesis nueva.
