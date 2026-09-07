# Razones — corrida 2026-09-06-lacalle-pou-economia-combustibles (paso editor)

## Modelo

Este paso lo corrió el editor en Sonnet (`claude-sonnet-5`), no en Fable como fija por defecto
`.claude/agents/editor.md`. Es una decisión del mantenedor para este lote, no una improvisación del
agente: el lote es de calificación y cotejo contra una fuente primaria ya identificada (no de
criterio narrativo abierto), y el mantenedor eligió medir el modelo barato en ese tipo de tarea a
propósito, dentro del experimento en curso descrito en `EXPERIMENTO.md`. Queda registrado acá y en
`_investigacion.modelo` de cada registro nuevo para que la procedencia que escriba `pnpm promover`
lo refleje.

## Medios nuevos (`content/medios/`)

- `bcu.yaml`, `catalogodatos-gub-uy.yaml`, `anp-brasil.yaml`, `bcb-brasil.yaml`: creados porque
  `chequeos.yaml` los citaba y no existían; sin esto el lote no pasa `pnpm validar --inbox`. Los
  cuatro son organismos estatales: `tipo: estatal`, `grupo: estado-uruguayo` o `estado-brasileno`,
  `alineamiento.etiqueta: estatal`, siguiendo el modelo de `presidencia.yaml`/`impo.yaml` que pidió
  el brief. Cita de `propiedad` y `alineamiento` leída con `pnpm fuente` en esta sesión sobre la
  página institucional de cada organismo (BCU: `bcueduca.gub.uy/que-hace-el-bcu`; catálogo:
  `catalogodatos.gub.uy` y la página de AGESIC en gub.uy; ANP: `gov.br/anp/.../institucional`; BCB:
  `gov.br/pt-br/orgaos/banco-central-do-brasil`, porque `bcb.gov.br` es una SPA que el extractor no
  puede leer — se probaron cuatro URLs de `bcb.gov.br` antes de resolverlo así, ver historial de
  `pnpm fuente` de la sesión).
- `ced.yaml`: creado por el mismo motivo. `tipo: portal` es una aproximación forzada por un enum
  cerrado (`diario | semanario | portal | tv | radio | agencia | estatal | enciclopedia`, confirmado
  por el error de `pnpm validar`) que no tiene valor para "centro de estudios privado"; queda anotado
  en `notas_internas` del archivo para que no se lea como que el CED es un portal de noticias.
  `grupo: ced` es autorreferencial (sin fuente sobre financiamiento). `alineamiento: sin_datos`
  siguiendo la instrucción del encargo ("si no conseguís fuente citable sobre quién lo financia,
  `sin_datos` es la respuesta honesta"): no encontré esa fuente. Sí encontré, y lo dejé escrito en la
  `justificacion` sin convertirlo en la etiqueta, un dato distinto y más fuerte que financiamiento:
  el propio sitio del CED cuenta entre sus hitos el discurso de Lacalle Pou en sus cenas anuales de
  2021 y 2023 y que lideró dos ediciones de uno de sus programas — un vínculo institucional
  documentado con el mandatario cuya declaración se chequea acá con datos de esa misma organización.
  Está en `content/chequeos/lacalle-pou/2022-03-27-sobrecostos-combustibles-1700-millones.yaml`
  (`dato_real.valor` y `analisis`) porque es relevante para leer esa cifra, no porque cambie la
  etiqueta de alineamiento del medio. Sobre el espejo del boletín (aviso F de la crítica): encontré
  que el CED aloja el mismo PDF en su propio dominio (`ced.uy/public/archivos/boletines/doc_13.pdf`,
  confirmado con `pnpm fuente`, mismo contenido) pero no reemplacé la URL citada
  (`todoelcampo.com.uy`, ya verificada `exacta (1.00)` por `--red`): la extracción de la copia de
  ced.uy trae artefactos de columnas (tabulaciones dentro de palabras) que no calzarían con la cita
  ya validada, y cambiar la URL sin cambiar la cita es más riesgo que beneficio para un aviso, no un
  bloqueo. Queda la alternativa documentada acá para quien retome esto.

## Declaración `lacalle-pou/2022-03-27-mecanismo-transparencia-no-paga-sobrecosto`

- Se agregó `titulo` (faltaba en el crudo del inbox): se conservó el texto ya publicado tal cual,
  como pide el encargo, porque la primaria no lo contradice.
- `cita` de cabecera reemplazada por la del audio, sin "y" y con "sobrecostos" en plural (objeción
  `declaraciones[0] A`, corregir). En `notas_internas` se aclara que esto no implica que Subrayado
  se haya equivocado en el conector "y" (transcripción de Whisper sin puntuación, segmento
  ambiguo); solo el plural es robusto.
- `evidencia.fuentes[1]` (Subrayado) y `[2]` (El País): se agregó `literalidad` (`difiere` y
  `literal` respectivamente) y, para Subrayado, `verificada_en.diferencia` sin verbos de intención
  (objeción `declaraciones[0] B`, corregir; era el pedido explícito del encargo).
- `resumen` reescrito en tres puntos, todos de la crítica: se agregó "por encima del precio de
  paridad de importación" (`D`, corregir; sin esto el chequeo 0 calificaba una afirmación más débil
  que la dicha); se sacó el artículo definido de "los combustibles" y se agregó la reserva "según
  creía, desde 2001 o 2002" (`C`, corregir; con artículo la frase es una universal falsa para la
  nafta, sin reserva es más categórica de lo dicho); se agregó que la respuesta era a una pregunta
  sobre la promesa de campaña incumplida de bajar los combustibles (`E`, corregir). Cambié
  `fragmento` de `chequeos.yaml#1` en el mismo movimiento porque depende literalmente del `resumen`
  (regla del validador); `fragmento` de `chequeos.yaml#0` no necesitó cambio porque la cadena
  original seguía siendo un substring literal del resumen nuevo.
- `notas_internas` reescrita entera (no conservé la de la corrección anterior): esta corrección
  reemplaza el registro entero, y la nota vieja listaba como "candidatos a chequeo, sin verificar"
  exactamente lo que este lote ya resolvió. La nueva nota deja constancia de la dependencia de
  Wayback y de que la primaria es una transcripción automática (aviso `G`), de que la gacetilla de
  `url_nota` no cubre la ronda de preguntas (aviso `F`), y de los dos cabos sueltos que la crítica
  encontró y que no son de este lote (promesa de "bajar" vs. "no aumentar" combustibles).
- Tier: `publicado`. Nivel `textual` (audio primario), sin objeciones `bloquea` sobre este registro,
  y las `corregir` A-E quedaron resueltas arriba.

## Chequeo `2022-03-27-sobrecostos-combustibles-1700-millones` (antes "chequeos[0]")

- Se agregaron `calificacion: discutible` y `analisis`: el crudo del investigador no traía ninguno
  de los dos campos (le corresponden al editor).
- Se sacó El País de `evidencia.fuentes` (objeción `A`, bloquea): su nota no contiene "1.700" ni
  "millones" ni "paridad".
- Se movió El Observador de `evidencia.fuentes` a `dato_real.fuentes`: no es objeción numerada de la
  crítica, es la misma lógica que la objeción `A` aplicada por mí al resto del registro con el mismo
  criterio (Regla 0 hacia adentro del propio registro, no solo entre políticos). La nota de El
  Observador es del 2022-03-07, veinte días antes de la conferencia: no puede ser evidencia de que
  Lacalle Pou dijo algo el 27; sí es corroboración del dato_real (que el CED publicó esas cifras).
  Se agregó una segunda cita de El Observador (el párrafo del "factor x") en `dato_real.fuentes`.
- `afirmacion` reescrita con el patrón de comparación ("por encima del precio de paridad de
  importación") y el quinquenio aclarado como "2015-2019 según el cálculo disponible" en vez de
  fijarlo en silencio (objeción `B`, corregir).
- `dato_real.valor` reescrito: se sacó la explicación causal no probada sobre el 1137/1.337
  ("aparentemente por un error de extracción...", objeción `C`, corregir) y se reemplazó por una
  descripción sin causa; se agregó el párrafo del "factor x" de El Observador y la aclaración de que
  parte de la brecha antecede al quinquenio acusado (objeción `D`, corregir); se agregó qué falta
  exactamente para un documento oficial (ventas mensuales en litros de ANCAP/DNE, objeción `E`,
  corregir) manteniendo `_faltante: dato_oficial`; se agregó el vínculo CED-Lacalle Pou documentado
  en `content/medios/ced.yaml` (objeción de simetría del lote, punto 2, y aviso `F`).
- `evidencia.fuentes[0].marca_tiempo`: 670 → 666 (nota final de la crítica, cambio de forma, ver
  abajo).
- Tier: `publicado`. Nivel `textual`, sin fuentes `verificacion: manual`, objeciones `bloquea` y
  `corregir` resueltas arriba.

## Chequeo `2022-03-27-combustibles-mas-baratos-que-brasil` (antes "chequeos[1]")

- Se agregaron `calificacion: discutible` y `analisis` (igual que el chequeo anterior).
- Se sacó El País de `evidencia.fuentes` (objeción `A`, bloquea): su nota no contiene "Brasil".
- `afirmacion` y `fragmento` reescritos para seguir el audio con la reserva "creo que del 2001 2002"
  incluida (objeción `B`, bloquea): la versión anterior venía de Subrayado vía el resumen viejo, más
  categórica de lo dicho. También saqué de `afirmacion` el artículo definido ("los combustibles" →
  "tenía combustibles"): no es una objeción numerada sobre este campo puntual, pero es la misma razón
  que la objeción `C` de la declaración aplicada acá — con artículo la frase se lee como universal
  (falsa para la nafta), sin artículo admite la lectura existencial que el audio sí sostiene.
- Se agregó la cita del Decreto 64/022 con "Gas Oil 10S 67,30" (antes se cortaba una línea antes) y
  se declaró la regla de emparejamiento con los dos resultados posibles: por posición de mercado
  (50S, Uruguay 6,8% más barato) y por especificación de azufre (10S, Uruguay 16,2% más caro),
  recalculados por mí con los mismos precios y tipos de cambio ya citados (objeción `C`, bloquea; es
  el hallazgo más grande de la crítica sobre este lote).
- Se agregó el contexto de las cuatro semanas previas: CED del 3/3 (nafta 38%, gasoil 17% más caros
  que Brasil) y la suba del 18,10% (diesel) y 9,91% (nafta) del lado brasileño en esas semanas según
  la propia ANP (objeción `D`, corregir), y la comparación contra la región Sul de Brasil como
  robustez (aviso `E`) — las tres cifras las verifiqué yo con `pnpm fuente` sobre el PDF de la ANP y
  el boletín del CED, no las copié de `critica.md` (su `cita_de_contexto` es solo para orientar).
- Se corrigió la URL del BCB a la forma GET con query params y se agregó el cuerpo SOAP exacto del
  BCU (ya documentado por el investigador en `notas.md`) más la distinción dólar billete/PTAX
  interbancaria (objeción `F`, corregir).
- Se reescribió el párrafo de "por primera vez" para no decir "no se encontró serie" cuando lo que
  falta es reconstruirla con series oficiales ya identificadas (ANP Série Histórica, URSEA, BCU/BCB;
  objeción `H`, corregir), dejándolo para el resolvedor.
- Se agregó una línea sobre el ajuste por contenido energético de la nafta (aviso `I`): no revierte
  el signo.
- `calificacion: discutible` (objeción `J`): dos motivos independientes (resultado mixto entre
  combustibles; verdadero/falso exigen que el documento oficial sostenga la conclusión, y acá el
  oficial da los insumos, no la conclusión).
- Tier: `probable`, no `publicado`. Motivo: dos fuentes de `dato_real.fuentes` (BCU, BCB) tienen
  `verificacion: manual`, y esa es la regla que me toca aplicar para bajar un registro a `probable`
  (no elegí dejarlo en `publicado` a la espera de la firma, que también hubiera sido defendible según
  el encargo; preferí la lectura más simple y más pareja con el resto de la corrida). `notas_internas`
  deja escrito qué falta (aprobación humana de esas dos fuentes) y que, si se aprueban, correspondería
  una corrección `cambio_de_rating`, no una republicación silenciosa.

## Discrepancia `subrayado/2022-03-27-omite-reserva-primera-vez-brasil`

Se agregó `_slug`, `_investigacion` y `revision: {tier: publicado}` al registro que dejó el crítico
en `discrepancias.yaml`; no toqué el contenido (`publicado`, `fuente_primaria`, `analisis`), ya
verificado por el crítico y comprobado de nuevo por `--red` en esta sesión.

## Cobertura (`cobertura.yaml`, nuevo archivo)

El crítico dejó tres registros de cobertura como bloque de texto en `critica.md`, no como archivo.
Los pasé a `inbox/.../cobertura.yaml` con `_slug` para que el orquestador pueda darles id. El de
El País (`2022-03-27-lacalle-dijo-referendum-es-etapa-superada`) **no** se incluyó: ya existe
publicado, idéntico en URL/evento/tono, en
`content/cobertura/el-pais/2022-03-27-lacalle-dijo-referendum-es-etapa-superada.yaml` (corrida
2026-09-05). Agregarlo de nuevo sería un duplicado del mismo archivo. Quedan los otros dos
(Subrayado, El Observador), que sí son nuevos.

## `notas.md` — `## chequeos_pendientes`

Sección agregada por mí, no por el investigador. Uso los seis registros que la crítica lista en su
punto de simetría del Veracímetro que siguen sin chequeo (de los siete que lista, el séptimo es la
declaración de este mismo lote, ya resuelta acá). No releí esos seis registros publicados en esta
sesión — no son de este lote y mi instrucción es no leer otras corridas —, así que marqué
`afirmacion` y `fragmento` como punto de partida a confirmar, no como literal verificado. Esto
responde a la objeción de simetría más importante del lote (crítica, "Objeciones al lote", punto 1,
y "Objeciones al brief", punto b): el Veracímetro no puede quedar concentrado en un solo político.

## Cambios de forma (triviales)

- `chequeos.yaml#0` (ahora `2022-03-27-sobrecostos-combustibles-1700-millones`):
  `evidencia.fuentes[0].marca_tiempo` 670 → 666 (la cita empieza en 666,3 s, no al final de la
  pregunta retórica; nota final de la crítica, sin consecuencia sobre el contenido).
- Se agregó `retrieved_at`/fechas ya presentes en el crudo sin cambios; no hubo otras correcciones
  de fechas, nombres o tipeo en este lote.
