# Razones — corrida 2026-09-09-senadores-49-50 (pasada del editor)

Editor: Sonnet (regla 14 del mantenedor, 2026-09-07). Este archivo documenta los cambios que hice
sobre el crudo ya corregido por la pasada de Sonnet (`notas.md`, sección «Pasada de corrección»),
después de leer `critica.md` completa. No repito acá lo que ya está explicado en esa sección de
`notas.md`; solo lo que decidí yo.

## Tier

Apliqué el mismo criterio a las 51 fichas: un mandato queda `publicado` cuando se apoya en al menos
un diario de sesiones o una página oficial con la línea completa de cargo («Senador/a de la
República por el Lema…»), o en dos fuentes independientes (diario + prensa, o dos diarios) aunque
cada una por separado sea débil; queda `probable` cuando la única prueba de la condición de titular
es una fila de `legislaturas-actuo` sin esa línea de cargo y sin ninguna otra fuente que la
corrobore (el artefacto que `notas.md` describe: «la ausencia de la línea de cargo no siempre
distingue titular de suplente»).

- **niffouri-amin → `probable`.** Es el único de los 11 con `_faltante: segunda_fuente` que queda
  así: su único respaldo es una fila pelada de su propia página oficial («Legislatura XLIX
  (2020-2025) 01-03-2020 14-02-2025», sin la línea de cargo) y ninguna fuente de prensa ni diario de
  sesiones. `critica.md` (objeción `niffouri-amin`) lo dice explícitamente: «tier máximo probable
  hasta que aparezca el diario de la sesión de marzo de 2020… o la nota de prensa de su asunción».
  `notas_internas` deja escrito qué falta.
- **Los otros 10 de `_faltante: segunda_fuente` → `publicado`,** cada uno por una razón distinta,
  todas ya resueltas por el corrector o ya alcanzando el umbral sin necesitar más:
  - `bianchi-graciela`, `botana-sergio`, `gandini-jorge`: el corrector ya agregó el diario del
    15/02/2025 como segunda fuente del cierre de la XLIX (objeción «botana-sergio, gandini-jorge,
    garcia-javier, lazo-sandra» de `critica.md`); el `_faltante` había quedado sin borrar. Dos
    diarios de sesiones (2020 y 2025) alcanzan de sobra.
  - `moreira-irene`, `pena-adrian`, `rodriguez-gloria`, `sartori-juan`: mismo caso (objeción
    «moreira-irene, pena-adrian, rodriguez-gloria, sartori-juan» de `critica.md`, ya resuelta con el
    diario del 15/02/2025 en `estado_actual.salida.fuentes`).
  - `olivera-nicolas`: su titularidad la prueba el diario del 15/02/2025 (fuente fuerte); solo la
    fecha exacta de salida depende de una fila pelada. `critica.md` lo califica de `aviso` y lo
    compara con Heber («es un uso aceptable de la página oficial como apoyo de una fecha de
    salida»); mismo criterio.
  - `rodriguez-blanca`: su titularidad la prueba un diario de sesiones con cita literal (el más
    fuerte de los dos tipos de fuente), no una fila. Que su vigencia 19 meses después no esté
    reconfirmada es una limitación compartida por buena parte del lote (Carballo, Díaz, Lema antes
    de que se sumara el diario de 2026), no un motivo para bajar de tier; y until crítica avisa
    explícitamente no usar el diario del 11/03/2026 para esto (ambiguo con Gloria Rodríguez), cosa
    que respeté: no usé esa fuente para ella.
  - `borbonet-daniel`: su fila oficial sí trae la línea completa de cargo («Senador de la República
    por el Lema PARTIDO FRENTE AMPLIO desde el 10/07/2025…»), a diferencia de Niffouri; es el mismo
    tipo de fuente que ya se acepta sola para Kechichian (L) y otros. El diario del 08/07/2025 la
    corrobora indirectamente (fecha de la renuncia de Nane).

## Objeciones de `critica.md` que no se resuelven en este lote

- **Bloqueante 2 (astori):** `content/politicos/astori.yaml` no se toca en este lote (no es un
  archivo del inbox). El hueco y su fecha real (15/11/2022, no 14/11/2022; inicio real 10/03/2020)
  quedan documentados en `notas.md` como corrección pendiente de tipo `cotejo_con_primaria` para
  quien la escriba. No es una objeción que este lote pueda cerrar sin editar `content/`.
- **Objeción de lote 5 (Batlle vs. Penadés, "suplente en ejercicio"):** dejo la asimetría señalada
  sin resolver acá también, por la misma razón que el corrector: resolverla (decidir si Raúl Batlle
  entra con `cargo: … (suplente)`, y auditar si el criterio aplicado a Penadés en su ficha ya
  publicada es el correcto) es tarea de una corrida de suplencias, no de este lote de titulares. La
  dejo anotada en el informe para que no se pierda.
- **asiain-carmen y rodriguez-gloria, presencia en sala años después del fin de su mandato
  titular:** mantuve `situacion: fuera_de_cargo` / `fin_de_mandato` para el mandato titular (bien
  documentado con diario + fila oficial o diario + diario), porque es una afirmación distinta e
  independiente de si la persona ejerce como suplente después. El brief de esta corrida excluye
  suplencias explícitamente («el padrón de suplencias es tarea de otra corrida»); no inventé un
  mandato nuevo sin fuente que lo pruebe. Mismo criterio para las dos, de dos partidos distintos
  (Asiaín y Rodríguez son ambas del Partido Nacional, así que no hay asimetría de partido en esta
  decisión puntual).

## Cobertura

Quité `cobertura` de las 51 fichas (regla del mantenedor, 2026-09-09: una ficha de identidad sin
declaraciones no lleva `cobertura`; las 91 fichas de diputados ya publicadas no la llevan, y esta
corrida es del mismo tipo — identidad y mandatos, sin declaraciones, chequeos, promesas ni casos).
El corrector se la había agregado a las 51 en su pasada; la retiro y lo dejo señalado acá porque es
un cambio de criterio, no un error del corrector (el campo no existía como regla explícita cuando
armó esa pasada).

Dos `cobertura.texto` traían un dato sustantivo que no está en ningún otro campo publicado de la
ficha y que se pierde al borrar el campo (ninguno es narración de proceso pura):
- **sanguinetti-julio-maria**: decía que Sanguinetti fue presidente de la República en dos períodos
  (1985-1990 y 1995-2000) y que esos mandatos no se investigaron en esta corrida. La ficha actual
  solo tiene el tramo de senador de la XLIX; el dato de sus presidencias no queda en ningún lado
  publicado de este registro.
- **bianchi-graciela**: decía que presidió el Senado durante la XLIX (dato que viene de una nota de
  Subrayado, movida a `_nota` privada). Ninguno de los dos campos publicados (`mandatos`,
  `estado_actual`) lo recoge.

No reintroduje estos datos en otro campo porque el `_nota` correspondiente ya los documenta para
quien haga una corrida de seguimiento sobre estas dos personas, y esta corrida no investiga
gestión ni cargos internos de conducción. Lo señalo en el informe para que no se pierda de vista.

## Citas «aproximadas» corregidas (8 raíces, 47 campos)

Las 8 diferencias eran, en los ocho casos, artefactos reales de la fuente que la pasada anterior no
había visto porque comparó de memoria contra el texto ya limpio, no contra lo que devuelve
`pnpm fuente`. Las releí todas con `--buscar` en esta sesión y corregí:

1. Diario del 15/02/2025 (30 electos): el PDF trae un salto de página entre «Alfredo Fratti,» y
   «Javier García» con el número de página «19» intercalado. Se agregó ese «19» en las 22 citas que
   reutilizan este tramo.
2. Diario del 15/02/2020 (30 electos): mismo problema, número de página «13» entre «Liliam» y
   «Kechichian». Se agregó en las 16 citas que lo reutilizan.
3. Diario del 15/11/2022 (mahía/astori, `mahia-jose-carlos`): a la cita le faltaba el signo «:»
   después de «ASISTEN» (la fuente dice «ASISTEN: los señores…», no «ASISTEN los señores…»).
4. Diario del 11/03/2026 (carballo, diaz-bettiana, lema-martin, sabini-sebastian): mismo problema,
   falta el «:» después de «ASISTEN»; tuve que entrecomillar el valor en las 4 fichas porque un «:»
   seguido de espacio dentro de un escalar YAML sin comillas rompe el parseo (se resolvió con
   comillas dobles, no acortando la cita).
5. Fichas de legislador de Fratti y Etcheverry (`fratti-alfredo`, `etcheverry-lucia`): a la fuente
   le falta un espacio antes de la coma («PARTIDO FRENTE AMPLIO , actuando…», no «AMPLIO, actuando»)
   — la misma cita en Civila, Lazo y Lustemberg ya tenía el espacio bien puesto, por eso no salían en
   la lista de errores.
6. Nota de Infobae sobre la renuncia de Carrera (`carrera-charles`, `estado_actual.salida`): faltaba
   el paréntesis «(la coalición de izquierda en el país)» entre «Frente Amplio» y «Charles Carrera»,
   presente en la nota original.
7. Diario del 05/03/2025 (`sanchez-alejandro`, `viera-nicolas`): la cita anterior unía dos viñetas no
   contiguas del sumario del diario (una con el aviso de la renuncia de Sánchez, otra con el
   juramento de Viera, separadas por referencias de página intercaladas) — exactamente lo que la
   regla de citas prohíbe («no se unen dos oraciones separadas»). La reemplacé por un tramo contiguo
   real del cuerpo de la sesión: «corresponde convocar al señor Nicolás Viera, a quien se invita a
   pasar al hemiciclo a los efectos de que preste la promesa de estilo.» Sigue probando lo mismo
   (la convocatoria de Viera por la renuncia aceptada de Sánchez) sin mezclar fragmentos.

Con estas correcciones, `pnpm validar --inbox inbox/senadores/todos --red` da 0 errores: 87 citas,
87 exactas, 68 URLs verificadas.

## Cambios de forma

- Ninguno adicional a los siete de arriba: no encontré fechas mal escritas, tildes ni erratas del
  medio que corregir en esta pasada (el corrector ya había limpiado `cargo`, `nombre`,
  `nombre_corto` y `alias_ambiguos` en la pasada anterior, y `critica.md` no objeta nada de eso).
