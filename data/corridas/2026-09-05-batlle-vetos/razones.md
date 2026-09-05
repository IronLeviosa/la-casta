# Razones — corrida 2026-09-05-batlle-vetos

Modelo del editor: claude-sonnet-5. Corro con Sonnet por instrucción explícita del encargo (brazo
barato del experimento de modelos descrito en `EXPERIMENTO.md`), no por decisión propia; el rol de
editor corre normalmente con Fable.

## Cambios de fondo (objeciones de critica.md resueltas)

1. **vetos[0] (Presupuesto Nacional 2000-2004), objeción `corregir`.** Releí la fuente ya citada
   (`6524934.PDF`) con `pnpm fuente --buscar` y confirmé el recuento de la moción previa ("-116 en
   117. Afirmativa.") y de la votación nominal en bloque (121 legisladores, unanimidad, con la
   Presidencia confirmando que cubría los tres quintos en ambas cámaras). Agregué el recuento a
   `resultado.detalle`, sumé una nueva `Fuente` con la cita "-116 en 117. Afirmativa." (la cifra
   "121" la dejé solo en prosa, no como `cita`, porque en el texto extraído del PDF aparece partida
   por un salto de línea del original -"sufra-\ngado"- y prefiero no fabricar una palabra que no
   está así, literalmente, en el documento; usar la cifra alternativa que el propio crítico ofreció
   como aceptable, 116/117, evita ese problema). Agregué también al `analisis` la aclaración de que
   el desenlace documentado cubre 6 de los 19 artículos observados, no los 19 -el crítico señaló que
   esto ya estaba en `resultado.detalle` pero pidió que se repitiera en `analisis` para un lector que
   solo lea esa sección-.

2. **vetos[1] (Oficiales Generales), objeción `corregir`.** Releí la fuente ya citada (`6618078.PDF`)
   y confirmé el argumento jurídico concreto que el `fundamento` anterior resumía como fórmula
   genérica: falta de iniciativa del Poder Ejecutivo para el ascenso (artículo 168 numeral 11 de la
   Constitución) y falta de cumplimiento de los requisitos del sistema de ascenso del Decreto-Ley
   14.157 (arts. 130, 133, 185, 187, 188). Reescribí `fundamento` y `analisis` con ese argumento y
   agregué la cita textual correspondiente a `evidencia.fuentes` (verificada con `pnpm fuente`, sin
   necesidad de fuente nueva, tal como pedía la `accion_sugerida` de la crítica).

3. **vetos[4] (Art. 154 Ley 17.556), objeción `aviso`.** Agregué a `resultado.detalle` el umbral
   exacto de los tres quintos (42 en Diputados sobre 69, 17 en Senado sobre 27), aclarando
   explícitamente que es un cálculo aritmético de esta edición y no una cita textual del diario (que,
   a diferencia de otros vetos del mismo lote, no lo expresa de esa forma). Confirmé con `pnpm
   fuente` que el diario efectivamente no contiene esa cifra en palabras, para no presentarla como si
   fuera una cita.

4. **vetos[2], [3], [5], [6], [7], [8]: sin cambios de contenido.** El crítico marcó estos seis
   registros `sin_objecion`; no encontré nada que corregir al releer la crítica y cotejarla contra
   los YAML. No toqué su `fundamento`, `resultado` ni `evidencia`.

## Tier: verificacion:manual baja a `probable`, no solo la falta de resultado parlamentario

El encargo fija como regla dura que un veto sin resultado parlamentario documentado va a `probable`.
Los 9 vetos de este lote tienen resultado documentado (6 `veto_levantado` con recuento nominal, 3
`observaciones_aceptadas` -2 por moción expresa, 1 por aceptación tácita del artículo 139 ya
consignada por la propia Asamblea-), así que ninguno baja por esa regla específica.

Pero aplico además el criterio general de tier que ya rige para todo el proyecto y que ya se usó en
`content/vetos/lacalle-pou/2023-10-24-rendicion-cuentas-balance-ejecucion-presupuestal-2022.yaml`
("Tier se mantiene en `probable`... necesita aprobación humana si en el futuro se quisiera subir a
`publicado`") y en `content/vetos/lacalle-pou/2024-08-08-ley-servicios-comunicacion-audiovisual-ley-medios.yaml`
("con ese respaldo no hace falta marcar `verificacion: manual`... sube a `publicado`"): una fuente
`verificacion: manual` mantiene el registro en `probable` hasta que el mantenedor la apruebe. Por
Regla 0, aplico ese mismo criterio -ya usado para Lacalle Pou- a Batlle:

- **Al menos 6 registros bajan a `probable`** por tener una fuente `verificacion: manual` en su
  `evidencia` que ya el investigador había detectado como no verificable mecánicamente (Presupuesto,
  Oficiales Generales, Cajeros Automáticos, Art. 154 Ley 17.556, Caja de Profesionales Universitarios,
  Cooperativas). Las diez URLs de `infolegislativa.parlamento.gub.uy/temporales/*.PDF` citadas en
  este lote usan un identificador temporal que el propio Parlamento reemplaza: hoy devuelven HTTP 404
  y no tienen copia funcional en Wayback. El contenido está preservado en el corpus, pero no en una
  URL pública verificable mecánicamente. Cada uno de estos registros lleva su propio
  `revision.que_falta` con el detalle.
- **De los 3 restantes, solo 1 (Caja Bancaria) queda en `publicado`.** Ver el punto siguiente: al
  re-verificar en vivo, Docentes ANEP y Retribuciones 80% también se bajaron a `probable`.

`critica.md` (Objeciones al lote, punto 2) contaba 3 registros sin ninguna fuente `verificacion:
manual` (Docentes ANEP, Retribuciones 80% y Caja Bancaria) y preveía por lo tanto 3 publicado / 6
probable. Al correr yo `pnpm validar --inbox ... --red` en esta sesión (dos veces, para descartar
un fallo de red transitorio) encontré que esa cuenta ya no es correcta *en vivo*: de esos 3, solo
Caja Bancaria (`9753561.PDF`) tiene hoy una copia funcional en Wayback; Docentes ANEP (`2370801.PDF`)
y Retribuciones 80% (`7346584.PDF`) devuelven HTTP 404 sin archivo, el mismo problema sistémico que
ya afecta a los otros 6 registros (identificadores temporales de
`infolegislativa.parlamento.gub.uy/temporales/` que el propio Parlamento reemplaza). Bajé estos dos
registros a `probable` y les agregué `verificacion: manual`, con el mismo criterio que el resto del
lote -no es una objeción de `critica.md` que yo esté rechazando, es una re-verificación mecánica que
dio un resultado distinto al que el investigador documentó horas antes-. Reparto final: **1
publicado (Caja Bancaria) / 8 probable**.

## Cita cosida encontrada en la propia edición (vetos[8], Caja Bancaria)

`pnpm validar --red` marcó la cita de `evidencia.fuentes` de Caja Bancaria como "aproximada"
(similitud 0.98), no como la cita original del investigador la había dejado. Al releer con `pnpm
fuente` encontré que le faltaba la palabra inicial ("analizar") y que reconstruía como una sola
palabra corrida ("Legislativo") lo que en el PDF es una palabra partida por un guion de fin de
renglón ("Poder Legis-lativo"). La reescribí como un tramo contiguo limpio que corta antes de esa
palabra partida, en vez de reconstruirla o de dejar el guion suelto en medio de la cita. Con esto
`pnpm validar --red` confirma `citas: 0 error(es), 0 aproximada(s)` para todo el lote.

## Objeciones de la crítica que NO cambié (rechazadas o diferidas), con motivo

1. **Hallazgo prioritario: comparabilidad entre presidentes (severidad `bloquea` para tablas
   comparativas, `sin_objecion` para los 9 vetos aislados).** No cambié nada en `vetos.yaml` por
   esto: el propio crítico escribe explícitamente que la severidad `bloquea` aplica "para cualquier
   tabla, ranking o afirmación comparativa entre presidentes", y `sin_objecion` para "la publicación
   de los 9 vetos de Batlle en sí mismos, considerados de forma aislada". Este lote no contiene
   ninguna tabla ni comparación agregada -es una lista de 9 registros `Veto`, cada uno con su propio
   presidente-, así que no hay nada en este archivo que la objeción me pida corregir. Dejo constancia
   para quien construya cualquier vista comparativa entre presidentes (fuera del alcance de este
   editor, que no toca `content/` ni páginas del sitio): antes de publicar un conteo o ranking de
   vetos por presidente, hay que correr el mismo método (diarios de sesión de Asamblea General) para
   las legislaturas 46, 47 y 48, o mostrar junto a cada número la profundidad de búsqueda, tal como
   recomienda `critica.md`. Esta misma objeción ya está registrada, con otro método, en
   `data/corridas/2026-09-04-orsi-vetos/critica.md`.

2. **`parlamentodata.com` no está en `content/medios/` (severidad `aviso`).** No creé el registro de
   medio. El investigador declaró explícitamente en `notas.md`, bajo `medios_faltantes`: "Ninguno
   nuevo", porque ningún registro de `vetos.yaml` cita ese dominio como `Fuente` (solo se usó como
   corroboración informal en prosa de `notas.md`). Mi mandato para escribir en `content/medios/` es
   "cuando el investigador las pide en notas.md bajo medios_faltantes" -no se cumple esa condición
   acá-, y el propio crítico clasifica esto como `aviso`/"alta pendiente", no como `corregir` ni
   `bloquea`. Además, dar de alta un medio exige documentar `grupo` y `alineamiento` con fuente
   citable, lo que excede el criterio editorial de este lote (no cité ese dominio en ningún
   registro). Dejo la recomendación para la próxima corrida que sí lo cite como `Fuente`.

3. **Falta de quórum como hecho vs. hipótesis (punto 3 de "Objeciones al lote").** El crítico no
   pidió ningún cambio (`sin_objecion` explícito); confirmé que ningún `analisis` de `vetos.yaml`
   afirma la estrategia de falta de quórum como hecho. Sin cambios.

4. **Simetría partidaria en el lenguaje (punto 4).** Sin objeción del crítico, sin cambios.

## Hipótesis abiertas

Los 9 proyectos de ley sin desenlace documentado (`notas.md`, sección `vetos_sin_desenlace`) no
entran a `vetos.yaml` por la regla del brief ("sin desenlace no se publica"), correctamente aplicada
por el investigador. De esos 9, escribí dos hipótesis en `hipotesis/batlle/`:

- `vetos-sin-desenlace-aceptacion-tacita-articulo-139.yaml`: si los 6 casos que fracasaron por falta
  de quórum quedaron con el texto del Poder Ejecutivo por aplicación del artículo 139, sin
  confirmación documental posterior.
- `estrategia-no-quorum-vetos-2002-2004.yaml`: si el patrón de falta de quórum responde a una
  estrategia deliberada (atribuida por Chasquetti 2013 a una parte de los legisladores), sin
  determinación caso por caso en esta investigación.

Ninguna de las dos hipótesis se publica ni se referencia desde `content/`.

## Verificación

Antes de entregar corrí `pnpm validar --inbox inbox/batlle/vetos/2026-09-05 --red` y corregí lo que
señaló sobre las citas que agregué o reescribí en esta edición (ver salida en el informe final).
