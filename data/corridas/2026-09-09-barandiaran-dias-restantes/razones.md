# Razones — 2026-09-09-barandiaran-dias-restantes

Editor, modelo `claude-sonnet-5` (Sonnet, por regla del mantenedor del 2026-09-07: el editor no corre en Fable ni en Opus).

## Cambios no triviales sobre el crudo

- **Se retira el mandato `2002-12-16`/`2002-12-20` (5 días) de `mandatos[]`.** El investigador dejó
  el hallazgo documentado en `notas.md` (hallazgo 1) sin resolverlo, por estar fuera de su encargo.
  Releí la fuente completa con `pnpm fuente` (diario de sesiones del 11 de diciembre de 2002) y
  confirmé, palabra por palabra, la cita que trae `notas.md`: Barandiarán "deja sin efecto la
  convocatoria efectuada" el mismo 11 de diciembre, la Cámara "acéptanse las negativas" de él y del
  suplente siguiente (Carlos Castaldi) y convoca en su lugar a Ana María Casalás para el mismo
  período. No hay ninguna otra fuente que documente ejercicio efectivo esos cinco días. Aplico el
  mismo criterio ya usado en la ficha para las convocatorias de mayo de 2001 y mayo de 2002, que
  Barandiarán rechazó y que nunca se cargaron como mandato: una convocatoria declinada no es un
  mandato, se declare o no explícitamente como tal en el texto de cobertura.
- **Se mantiene el mandato `2002-03-06` (1 día), con la inasistencia agregada como fuente.**
  Hallazgo 2 de `notas.md`: la lista de asistencia del propio 6 de marzo de 2002 registra a
  Barandiarán en "Sin aviso", no entre los Representantes presentes. Releí la fuente con `pnpm
  fuente` y confirmé la cita exacta. Decisión: mantener el mandato, porque la convocatoria del 5 de
  marzo fue votada y no hay constancia de que la declinara (a diferencia del caso de diciembre de
  2002, donde sí hay una comunicación explícita de rechazo). El criterio que aplico —y que dejo
  escrito acá para que valga igual en cualquier otro día de cualquier ficha— es que la convocatoria
  votada y no declinada es el acto que constituye el mandato de suplencia; la asistencia a una
  sesión puntual es un hecho distinto, que se declara cuando hay evidencia (por eso se agrega la
  cita de "Sin aviso" a las fuentes) pero no anula la convocatoria. Este es el mismo criterio, ya
  usado en la ficha publicada, para los casos de "sesión extraordinaria vs. ordinaria el mismo día"
  (17 de marzo de 2004 y otros) que `notas.md` documenta como patrón compatible, no contradictorio.
- **Se acorta el mandato que empieza `2000-11-06`: `hasta` pasa de `2000-11-12` a `2000-11-09`.**
  Hallazgo 3 de `notas.md`: la única fuente que sostenía el cierre del 12 era el documento
  compilado "Parlamentarios Uruguayos"; releí con `pnpm fuente` la resolución de licencia votada en
  sala el 1º de noviembre de 2000, que otorga al titular (Iván Posada) el período "6 y 9 de
  noviembre de 2000". No encontré, en los 552 diarios ya barridos para este período, una resolución
  que extienda la licencia del 9 al 12. Aplico el mismo criterio ya usado en la corrección anterior
  (`2026-09-09-barandiaran-suplencias-2000-2004`) para dos suplencias de 2004 con el mismo
  desfasaje de un día entre el compilado y la resolución votada: prevalece la resolución votada,
  que es el acto que otorga la licencia. Agrego esa resolución como fuente y anoto la discrepancia
  en el título de la fuente del compilado, con el mismo formato ya usado para los casos de 2004.
- **Corrección aritmética del total.** El brief y la `cobertura.texto` publicada partían de "89 de
  110 días" como línea de base. El investigador recalculó programáticamente la suma de los 28
  mandatos entonces publicados y encontró 87, no 89 (error de suma en el texto de cobertura de la
  corrección anterior, no en las fechas de los mandatos). Verifiqué la suma de forma independiente
  (script propio sobre el YAML) antes y después de mis cambios: 89 con los dos mandatos nuevos
  agregados y sin mis tres correcciones; 81 después de retirar el mandato de diciembre de 2002 (−5)
  y acortar el de noviembre de 2000 (−3). El total final que dejo en `cobertura.texto` y en
  `candidaturas[1].detalle` es 81 de 110, con 29 días sin fechar.
- **Reescritura completa de `cobertura.texto`.** El texto que traía el crudo era una copia sin
  actualizar del texto ya publicado (numerado como "tercera vuelta", con la cifra errada de 89 y
  sin mención del barrido completo de los 552 diarios ni de los tres hallazgos de esta vuelta).
  Corresponde al editor escribir este campo (`CLAUDE.md`, esquema de `politicos.yaml`), así que lo
  reescribí entero: describe el barrido de los 552 diarios (480 de la Cámara de Representantes, 72
  de la Comisión Permanente), los tres hallazgos y su resolución con el criterio de cada uno, el
  total final (81/110, 29 sin fechar) y por qué esos 29 días no se pueden fechar con el diario de
  sesiones (los 552 diarios del período ya se revisaron completos y no mencionan a Barandiarán en
  esas fechas). Recorté del texto anterior el detalle de ambigüedades ya resueltas en la corrida
  previa (el "20010" de julio de 2000, la fusión de licencias de diciembre de 2001 y diciembre de
  2002, el diario ilegible del 15 de junio de 2000) porque ese razonamiento ya queda public en
  `content/correcciones/2026-09-09-barandiaran-suplencias-2000-2004.yaml` y repetirlo en cada vuelta
  alarga el texto sin agregar información nueva; mantuve lo que sigue vigente (cobertura de
  Legislatura 44, ausencia de prensa y de fotografía con licencia libre, referencia a la corrida de
  intervenciones 1995-1999).
- **`revision.tier: publicado`.** Las 58 citas de la ficha (57 ya validadas más la que sumo con el
  hallazgo 3) pasan `pnpm validar --red --solo citas` como exactas; no queda ningún registro con
  `verificacion: manual` ni ninguna objeción `bloquea` sin resolver (no hubo `critica.md` en esta
  corrida: el brief no cita una crítica previa a esta vuelta, y el propio investigador dejó los tres
  hallazgos como hipótesis a resolver, ya resueltas arriba).

## Cambios de forma

Ninguno: no encontré erratas de fecha, de formato ni de estilo en el crudo que no estuvieran ya
cubiertas por los cambios sustantivos de arriba.
