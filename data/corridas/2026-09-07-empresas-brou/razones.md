# Razones — corrida 2026-09-07-empresas-brou

Editor: Sonnet (`claude-sonnet-5`), por la regla de modelos del mantenedor (2026-09-07): el editor no
corre en Fable ni en Opus. Parto del crudo ya corregido por el investigador en su "vuelta 2"
(`notas.md`, tabla objeción → acción), que resolvió los 3 `bloquea` y los 13 `corregir` de
`critica.md` con documento oficial o diario de sesiones. Lo que sigue son mis cambios sobre ese
crudo, no un repaso de lo que ya hizo la vuelta 2 (eso está documentado en `notas.md` mismo).

## Cambios editoriales (no triviales)

- `empresas.yaml` → `finanzas[2017..2024].capitalizaciones_del_estado`: agregué `usd: 0`,
  `cotizacion` (la del año, ya usada en los demás montos del mismo año) y `tipo_cambio: cierre` a
  los 8 registros. La vuelta 2 resolvió B1 para `resultado_ejercicio`, `impuestos_pagados`,
  `transferencias_al_estado` y los `segmentos[]`, pero dejó `capitalizaciones_del_estado` con
  `pesos: 0` sin su par en dólares; como `usdMillones()` en `src/pages/empresas/[slug].astro`
  devuelve `undefined` sin `usd`, la serie "El Estado puso" habría tenido cero puntos en los ocho
  años igual que denunciaba B1, y el `.filter((s) => s.puntos.length > 0)` la habría borrado del
  gráfico entero pese a que hay un cero con cita en cada uno de esos años. Extensión de B1 que la
  vuelta 2 no cubrió.
- `empresas.yaml` → `resumen`: lo escribí completo (el investigador no lo llena, por instrucción del
  brief). Nueve párrafos: qué es y qué hace BROU; el resultado del ejercicio 2015-2024 (positivo los
  diez años) y el quiebre de norma contable de 2017 (C1); los impuestos pagados y la aclaración de
  que la serie es devengada, no de caja (C6, que la vuelta 2 dejó pendiente de declarar); las
  transferencias al Estado (artículo 11 + artículo 40) y los dos años sin dato (C3, C13); las
  capitalizaciones en cero con cita y el crecimiento del patrimonio por utilidades retenidas (C2),
  con la errata del "artículo 140" de 2024 y la diferencia entre el patrimonio separado y el
  consolidado de 2023; los tres privilegios del monopolio con las cifras de AEBU y del propio balance
  (C9) y los dos lados del argumento; los cuatro segmentos de negocio y que "Otros" es negativo los
  ocho años con dato (A8, que la vuelta 2 señaló para el editor); y la cobertura del período (2015 a
  2024, con 2009-2014 pendientes de una corrida futura, mismo criterio que ANCAP/UTE/ANTEL, C12).
- `empresas.yaml` → `finanzas[2015].resultado_ejercicio.usd`: corregido de 197,9 a 197,8
  (5.909 / 29,87 = 197,8; el validador lo recalcula). Aviso A1 de la crítica, sin acción en la
  vuelta 2 por no ser parte de esa encomienda; lo resolví yo porque ya estaba tocando el campo.
- `empresas.yaml` → `imagenes`: agregué una foto de la Casa Central del BROU (Cerrito 351, Ciudad
  Vieja), CC BY-SA 4.0 de Felipe Restrepo Acosta en Wikimedia Commons, bajada con `pnpm imagen`. Es
  el edificio de la institución que describe la ficha; no había ninguna imagen en el lote.
- `empresas.yaml` → `revision`: `tier: publicado`, con `notas_internas` que lista objeción por
  objeción qué quedó resuelto, qué avisos siguen abiertos (A2, A4, no cambian cifra ni calificación)
  y el pendiente de infraestructura del `--red` (ver "Sin resolver" abajo).
- `analisis.yaml`: reemplacé el marcador `calificacion: discutible` / `_faltante: dato_oficial` de
  las 5 afirmaciones por una calificación real, después de conseguir el documento previsible que
  pedía C7 (Reporte del Sistema Financiero del BCU, RSF_IV_25.pdf — un escaneo sin capa de texto que
  extraje con `pnpm fuente --ocr`, 175.406 caracteres en 58 páginas):
  - Afirmación 1 (ROE BROU 16 % / bancos privados 20,5 %) → `impreciso`: el BCU da 16,0 % y 20,4 %;
    la primera cifra es exacta, la segunda difiere 0,1 punto porcentual, dentro del margen de un
    dato impreciso.
  - Afirmación 2 (resultado del sistema en USD) → `discutible`: el BCU da el resultado en pesos
    (-36,8 % interanual) pero no en dólares ni el tipo de cambio mensual que exige la conversión de
    CPA Ferrere; la dirección y el orden de magnitud son consistentes, el monto preciso no se pudo
    cotejar.
  - Afirmación 3 (posición en moneda extranjera de BROU, % del activo) → `discutible`: el BCU mide
    esa posición como % del patrimonio y solo a nivel agregado del sistema (34,3 %), no por banco ni
    como % del activo; no hay con qué cotejar el dato específico de BROU.
  - Afirmación 4 (morosidad 1,7 %, estable, mejora en BROU) → `impreciso`: el BCU da 1,68 % (subiendo
    desde 1,61 %, no "estable"); la cifra redondea igual, la caracterización del movimiento difiere
    en matiz, y la comparación específica BROU/privados no está en el documento.
  - Afirmación 5 (depósitos USD 44.963 M, +8 %; BROU 45 %/55 % por moneda) → `discutible`: el BCU da
    la dirección (crecimiento en las dos monedas) pero no el total en dólares ni la participación de
    BROU por moneda.
  Agregué `analisis` (2-3 oraciones) y `veredicto` a nivel de registro, con la síntesis de las cinco
  calificaciones. Puse `revision: {tier: publicado}`: las cinco afirmaciones tienen su calificación
  final con la regla dura aplicada (documento oficial para toda calificación que no sea
  `discutible`), ninguna quedó con `_faltante` sin resolver.
- `analisis.yaml` → afirmación 3, `dato_real.fuentes[0].tipo`: lo puse en `documento_oficial` (lo
  había dejado en `nota` en un primer borrador); es el mismo PDF oficial del BCU que las otras
  cuatro afirmaciones, solo que la calificación de esa afirmación es `discutible` y por eso el
  esquema no exige ese tipo — pero es lo que es, así que lo corregí para que sea consistente con las
  otras cuatro citas del mismo documento.

## Decisiones que dejo explícitas (no son cambios sobre el crudo)

- No escribí `content/cobertura/` para los tres registros que `critica.md` propone al final (sección
  "Cobertura"): no están en el lote como archivo (`cobertura.yaml`), solo como texto dentro de
  `critica.md`, y mi encargo para esta corrida es la ficha de BROU y su análisis, no una corrida de
  declaraciones de un político. Cargarlos exigiría además crear un registro nuevo en
  `content/eventos/` (el `evento: "propuesto:articulo-281-depositos-publicos-2021"` no existe
  todavía), que tampoco es parte de este encargo. Lo dejo señalado para quien decida abrir esa
  corrida, no lo hago por mi cuenta.
- No cargué 2009-2014 (C12): la vuelta 2 ya lo dejó declarado como decisión de alcance, no de
  evidencia, y lo mismo digo yo: los documentos están confirmados en el inventario, es trabajo para
  una corrida futura, no algo que se resuelve reescribiendo la ficha en el margen de esta revisión.
- No toqué el criterio de A2 (cita de `resultado_ejercicio` desde la nota de segmentos en vez del
  renglón directo del estado de resultados) ni A4 (tres hitos sin ley o Diario Oficial de respaldo):
  los valores están verificados y correctos: ninguno cambia una cifra publicada, y no había margen
  para releer ocho balances más solo para cambiar la fuente de una cita ya exacta.

## Sin resolver

- `pnpm validar --inbox ... --red` da 4 errores, los cuatro sobre la misma URL:
  `http://www.diputados.gub.uy/com/presup/Primer%20tratamiento/Versiones%20taquigráficas/09%20VT%2022-07%20MEF%20UTEC.PDF`
  (la versión taquigráfica del 22/7/2021 que resuelve B2, aporta a B3 y sostiene a C11) devuelve
  HTTP 502 y no tiene copia en Wayback. Probé el dominio con y sin `www`, por http y por https, en
  tres momentos distintos de esta sesión: siempre 502 (con `www`) o falla de DNS (sin `www`). El
  documento está íntegro en el corpus (bajado hoy a las 05:20, 278.618 caracteres) y las cinco citas
  que salen de él pasaron `--red --solo citas` sin error (0 discrepancias). No corro `pnpm archivar`
  (fuera de mi rol); esto queda para `/revisar` antes de promover, o para reintentar cuando el sitio
  de Diputados vuelva a responder. No bajé el tier por esto: la evidencia está completa y verificada
  letra por letra, lo que falta es que el sitio en vivo (o su archivo) responda.

## Cambios de forma

- `empresas.yaml` → `monopolio.normas[0].fuentes[0].cita` e `hitos[0].fuentes[0].cita`: las dos
  cortaban la oración de la fuente con un punto donde el original sigue con una coma ("...ente
  autónomo." en vez de "...ente autónomo, que se regirá..."; "...pesos efectivos." en vez de
  "...pesos efectivos, a integrarse en dos series de acciones."). `pnpm validar --red --solo citas`
  las marcó "aproximada (0.99)" porque en un documento oficial la cita tiene que ser exacta. Extendí
  las dos hasta el punto real de la oración en la fuente (`impo.com.uy/bases/leyes/18716-2010` y
  `brou.com.uy/institucional/el-banco/creacion-del-banco`); las mismas citas, más largas, ya estaban
  usadas correctas en otro lugar del registro (`creacion.fuentes`), así que las igualé. Después de
  esto, `--red --solo citas` da 102/102 citas exactas, 0 aproximadas.

- `analisis.yaml` → `veredicto`: lo escribí como bloque `>-` en vez de escalar plano, porque el
  texto tiene `"impreciso":` y `"discutible":` (comillas + dos puntos + espacio), que YAML interpreta
  como un mapeo anidado en un escalar plano. Sin el bloque, `pnpm validar` fallaba con "Nested
  mappings are not allowed in compact mappings". Puramente sintáctico, no cambia el contenido.
