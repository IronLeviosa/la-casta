## candidatos_giro

Ninguno dentro de este lote (un solo registro de declaración; no hay un segundo registro propio para
formar el par antes/después). Ver `hipotesis` sobre la promesa de campaña de bajar los combustibles,
que podría cruzarse con `content/promesas/` en una corrida completa.

## hipotesis

- El periodista (Nicolás González, BTV Noticias) le dice a Lacalle Pou en la misma conferencia: "usted
  en la campaña había prometido bajar los combustibles [...] no se cumplió con esa promesa de bajar los
  combustibles". Esto sugiere que existe (o debería existir) una promesa de campaña sobre bajar el
  precio de los combustibles, independiente del "mecanismo de transparencia" que se está chequeando acá.
  No la investigo porque el brief limita este lote a la conferencia del 27-03-2022 y a los dos
  chequeos ("no busques otras declaraciones de combustibles"). Queda para una corrida completa del
  tema: buscar la promesa de campaña 2019 sobre precio de combustibles y sus evidencias de
  cumplimiento/incumplimiento.
- "Por primera vez" (chequeo 2): no encontré una serie histórica oficial pareada Uruguay-Brasil, mes a
  mes y en dólares, que permita confirmar o descartar que no ocurría desde 2001-2002 como dice Lacalle
  Pou ("creo que del 2001 2002", con duda explícita en su propia voz). Lo que sí encontré es cobertura
  de prensa de otros momentos (fines de 2022, 2024) que muestra a Uruguay entre los combustibles más
  caros de la región, lo que hace plausible que el cruce de marzo de 2022 haya sido puntual, pero no lo
  prueba para la serie completa 2001-2022.
- El Centro de Estudios para el Desarrollo (CED), fuente del cálculo de USD 1.780 millones (443 nafta +
  1.337 gasoil) para 2015-2019, es un think tank privado; en la misma nota de El Observador del
  2022-03-07 su director es citado defendiendo la relevancia de esa comparación mientras que otro
  economista (Javier de Haedo) y los asesores del FA (Vallcorba y Zelko) discuten la metodología desde
  otro ángulo (comparación con salarios, no con PPI). No es un caso judicial ni un giro; lo dejo
  anotado por si el editor quiere contexto sobre cuánto consenso técnico tiene la cifra.

## casos_vistos

Ninguno.

## verificacion_manual

- `https://www.gub.uy/direccion-general-impositiva/sites/direccion-general-impositiva/files/2023-09/Cotizaciones%20interbancarias%20compra%20_Billetes_A%C3%B1o%202022.ods`
  — `pnpm fuente` bajó el archivo pero extrajo 0 caracteres (no soporta hojas de cálculo ODS). No se usó
  como fuente; se reemplazó por la consulta directa al webservice del BCU (ver abajo).
- `https://cotizaciones.bcu.gub.uy/wscotizaciones/servlet/awsbcucotizaciones` (webservice SOAP oficial
  del BCU) — `pnpm fuente` no puede llamarlo porque requiere un POST con cuerpo XML/SOAP, no una
  URL GET simple; falla con "Cannot destructure property 'firstElementChild'..." si se lo pasa como si
  fuera una página. Lo consulté a mano con `curl -X POST` (Content-Type text/xml, SOAPAction
  `Cotizaaction/AWSBCUCOTIZACIONES.Execute`) con este cuerpo:
  `<Entrada><Moneda><item>2225</item></Moneda><FechaDesde>2022-03-25</FechaDesde><FechaHasta>2022-03-25</FechaHasta><Grupo>0</Grupo></Entrada>`.
  Respuesta oficial: `Fecha 2022-03-25, Nombre "DLS. USA BILLETE", TCC 41.478000, TCV 41.478000`. Para
  2022-03-28 (lunes siguiente): TCC=TCV=41.365. Queda citado en `chequeos.yaml` con
  `verificacion: manual` para que se revalide si hace falta.
- `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(...)` (API oficial del
  Banco Central do Brasil) — es un GET simple, pero devuelve JSON puro y `pnpm fuente` intenta
  parsearlo como HTML y falla ("Cannot destructure property 'firstElementChild' of
  'documentElement' as it is null"). Lo consulté a mano por `curl`:
  `@dataCotacao='03-25-2022'` → `{"cotacaoCompra":4.77760,"cotacaoVenda":4.77820,"dataHoraCotacao":"2022-03-25 17:47:18.116"}`;
  `@dataCotacao='03-28-2022'` → venda 4.79050. Mismo tratamiento: `verificacion: manual` en el chequeo.
- No fue necesario marcar `verificacion: manual` para el audio de la conferencia (`AJ_170.mp3`): el
  archivo vivo en `medios.presidencia.gub.uy` da 404, pero `pnpm fuente` sí pudo leer y transcribir la
  copia de Wayback Machine (variante `if_`, ver `registro_primario`), así que quedó citado como fuente
  primaria normal, no como manual.

## cobertura_del_periodo

Este lote es una vuelta corta sobre un solo hecho, no una corrida del tema (así lo pide el brief). Cubrí
únicamente: la conferencia de prensa de la noche del 27-03-2022 (contexto `gobierno`, tras el
referéndum de la LUC) y los dos datos concretos de su resumen. No cubrí, porque el brief lo excluye
explícitamente: otras declaraciones sobre combustibles del período de campaña (2019), de gestión antes o
después de marzo de 2022, ni nada dicho desde la oposición (no aplica: Lacalle Pou no tuvo período de
oposición cubierto por el corpus en este tema). Esa asimetría temporal es del alcance del encargo, no
una elección mía; una corrida completa del tema debería cubrir todo el período 2019-2025 en campaña y
gestión.

## objeciones_al_brief

Ninguna. El brief invoca la Regla 0 explícitamente y encuadra el chequeo de datos y la búsqueda del
original como un tratamiento parejo para cualquier político con conferencia oficial o datos dentro de
una cita, no como algo dirigido contra esta persona en particular. No encontré ningún pedido de
asimetría (a favor o en contra) en las instrucciones de este encargo.

## medios_faltantes

- `ursea` — no existe en `content/medios/`. Se verificó con `ls content/medios/` como pide el brief.
  Organismo del Estado uruguayo (URSEA, Unidad Reguladora de Servicios de Energía y Agua). Propuesta:
  `grupo: estado-uruguayo`, `alineamiento: estatal`. No terminé citándola directamente como fuente en
  este lote (usé el dataset de `catalogodatos.gub.uy` y el Decreto en `impo`), pero queda pendiente
  para cuando se cite un informe de URSEA directamente.
- `bcu` — no existe. Banco Central del Uruguay, organismo del Estado uruguayo. Propuesta:
  `grupo: estado-uruguayo`, `alineamiento: estatal`. Usado en `chequeos.yaml` (chequeo del tipo de
  cambio), con `verificacion: manual` porque se consultó por SOAP y no por `pnpm fuente`.
- `catalogodatos-gub-uy` — no existe. Catálogo de Datos Abiertos del Estado uruguayo (lo mantiene
  AGESIC). Propuesta: `grupo: estado-uruguayo`, `alineamiento: estatal`.
- `ced` — no existe. Centro de Estudios para el Desarrollo, think tank privado uruguayo (no es medio de
  prensa ni organismo oficial). No tengo un criterio claro de `grupo`/`alineamiento` para un think tank
  dentro del esquema pensado para medios de prensa; lo dejo señalado para que el editor decida si
  corresponde un slug de "medio" o si estas fuentes deberían tratarse con otro campo. El PDF que cité
  está alojado en un espejo de terceros (`todoelcampo.com.uy`, portal agropecuario), no en un dominio
  propio de CED.
- `anp-brasil` y `bcb-brasil` — usados tal como los asigna el brief (organismos del Estado brasileño,
  `grupo: estado-brasileno`, `alineamiento: estatal`); no están en la tabla de medios del brief pero su
  uso ya estaba autorizado explícitamente.

## registro_primario

Encontrado: audio oficial completo de la conferencia de prensa, tipo `video` en el esquema (es audio,
pero el brief y el esquema no tienen un tipo separado para audio y piden `tipo: video` con
`marca_tiempo`).

Cadena para llegar a él:
1. La gacetilla oficial de Presidencia sobre el resultado del referéndum
   (`https://www.gub.uy/presidencia/comunicacion/noticias/lacalle-pou-manana-seguiremos-trabajando-temas-urgentes-para-uruguay`,
   fechada 28/03/2022, sobre el mensaje del domingo 27 a la noche en Torre Ejecutiva) trae el texto
   resumido de la parte de apertura (LUC, seguridad, educación, seguridad social, vivienda, apertura al
   mundo, obra pública, impuestos) pero **no menciona combustibles en absoluto**: el tema de
   combustibles solo salió en la ronda de preguntas y respuestas, que la gacetilla no resume.
2. Al final de esa gacetilla hay un enlace "Audios: Palabras del presidente de la República, Luis
   Lacalle Pou", pero `pnpm fuente` no lo lista entre los adjuntos descargables porque su extractor de
   adjuntos busca `<a href>` con extensión pdf/doc/xls/csv o atributo `download` con esas extensiones;
   el reproductor de audio de gub.uy no usa una etiqueta `<a>` con esas condiciones. Tuve que leer el
   HTML crudo con `curl` para encontrar el enlace intermedio
   (`https://www.gub.uy/presidencia/comunicacion/audios/completos/palabras-del-presidente-republica-luis-lacalle-pou-8`)
   y de ahí el archivo real: `https://medios.presidencia.gub.uy/tav_portal/2022/noticias/AJ_170/AJ_170.mp3`
   (18 min 30 s, 6,51 MB).
3. Ese archivo da 404 en el servidor en vivo (confirmé que no es un bloqueo general del dominio: un PDF
   de 2023 en el mismo host sí responde 200; el 404 es específico de los activos de
   `tav_portal/2022/noticias` de este lote, ver `consultas.jsonl`). La Wayback Machine sí tiene una
   copia de 2024-11-20, servida con `Content-Type: audio/mpeg` y `Last-Modified: 2022-03-28 02:57:28 GMT`
   (23:57 del 27/03/2022 en hora de Montevideo, UTC-3) — coincide exactamente con la noche del evento,
   lo que da confianza en que es el archivo original y no uno alterado.
4. `yt-dlp` (que usa `pnpm fuente` por dentro) no reconoce la URL estándar de Wayback
   (`web.archive.org/web/<timestamp>/<url>`) para audio directo — falla con "Unsupported URL" porque esa
   ruta sirve una página con la barra de herramientas de Wayback, no el archivo crudo. La variante
   "identidad" de Wayback (`web.archive.org/web/<timestamp>if_/<url>`), que sirve el recurso tal cual sin
   la barra de Wayback, sí funciona.
5. `pnpm fuente <url-if_> --buscar "sobrecosto | transparencia | Brasil | mecanismo | combustible"`
   transcribió el audio completo con Whisper (`large-v3-turbo`, backend `faster-whisper`, 1110,8 s de
   audio) y encontró los dos pasajes.

También encontré, y descarté por no ser la conferencia correcta, otra gacetilla oficial:
`https://www.gub.uy/presidencia/comunicacion/noticias/lacalle-pou-luc-fue-pensada-para-bien-todos-uruguayos`,
del 23-03-2022, sobre una conferencia previa (defensa de los 135 artículos antes del referéndum, en
Torre Ejecutiva), con una cifra parecida pero no relacionada ("más de 1.700 millones de dólares en
salud y en políticas públicas de impacto social" — otro tema, no combustibles). La dejo mencionada por
si alguien más la encuentra buscando "1.700 millones" y la confunde con la cifra de sobrecostos.

**Nota sobre la cita textual del audio.** El registro publicado dice `"...transparencia y que el
uruguayo no paga sobrecosto"` (con "y", singular). Lo que transcribió Whisper del audio oficial es
`"...transparencia que el uruguayo no paga sobrecostos"` (sin "y", plural) — coincide con la redacción
de El País y difiere un poco de la de Subrayado. Dejo la cita de la fuente primaria tal como la
transcribió Whisper (es lo que dice `pnpm fuente`, literal y contiguo) y las citas de las dos notas
intactas; no decido cuál nota es más fiel, eso es `literalidad` y es del editor con el `contexto`
completo a la vista en `declaraciones.yaml`.

## chequeos_pendientes

Agregado por el editor (no por el investigador de este lote). La crítica de esta corrida, en su
punto de simetría del Veracímetro, lista siete declaraciones publicadas con dato numérico dentro de
`cita` o `resumen` y sin chequeo (tres de Lacalle Pou, cuatro de Orsi); una de las tres de Lacalle
Pou es la de este mismo lote (`2022-03-27-mecanismo-transparencia-no-paga-sobrecosto`), que ya queda
con sus dos chequeos hechos acá. Quedan seis pendientes genuinos, listados abajo con el dato que
señaló la crítica. No releí esos seis registros en esta sesión (no son de este lote), así que
`afirmacion` y `fragmento` son un punto de partida a confirmar contra el texto publicado, no un
`fragmento` verificado.

- declaracion: lacalle-pou/2021-07-28-tercamente-no-vamos-poner-impuestos
  fragmento: "US$ 600"
  afirmacion: Dato numérico (US$ 600) dentro de la cita o el resumen; confirmar primero el contexto
    exacto en el registro publicado (monto fiscal, por persona, u otro) antes de fijar la afirmación
    a chequear.
  donde_buscar: MEF y DGI (impacto fiscal, recaudación); BCU si el monto resulta ser cambiario.

- declaracion: lacalle-pou/2023-03-02-baja-impuestos-irpf-iass
  fragmento: "75 %"
  afirmacion: Dato numérico (75 %; también aparece US$ 150) sobre una baja de IRPF/IASS; confirmar en
    el registro publicado el alcance exacto (a quiénes alcanza, desde cuándo) antes de fijar la
    afirmación.
  donde_buscar: DGI (franjas y exoneraciones de IRPF/IASS), MEF (gasto tributario).

- declaracion: orsi/2025-04-25-orsi-informo-ancap-volvio-tener-resultados
  fragmento: "41, 118 y 160 millones"
  afirmacion: Dato numérico (resultados de ANCAP por 41, 118 y 160 millones; moneda y períodos a
    confirmar) sobre el resultado económico de ANCAP bajo su gestión.
  donde_buscar: ANCAP (balances y memorias anuales), AIN (auditoría de empresas públicas),
    catalogodatos.gub.uy (dataset de resultados de empresas públicas).

- declaracion: orsi/2024-11-18-orsi-sostuvo-recargo-iva-2-aplicado
  fragmento: "2 %"
  afirmacion: Dato numérico (2 %) sobre un recargo de IVA que Orsi sostuvo que se aplicó; confirmar a
    qué recargo y a qué bienes o servicios se refiere.
  donde_buscar: DGI (normativa de IVA y recargos), MEF.

- declaracion: orsi/2026-05-26-consultado-prensa-sobre-descuento-usd-25
  fragmento: "USD 25.000"
  afirmacion: Dato numérico (USD 25.000, probablemente un descuento o beneficio puntual) sobre el que
    Orsi fue consultado por la prensa; confirmar el objeto exacto del descuento en el registro
    publicado antes de fijar la afirmación.
  donde_buscar: Depende del objeto del descuento, a confirmar primero; si es patrimonial, JUTEP; si
    es una compra o beneficio estatal, el organismo correspondiente.

- declaracion: orsi/2026-08-25-respaldo-publicamente-ministra-defensa-nacional-sandra
  fragmento: "100 %"
  afirmacion: Dato numérico (100 %) dentro del respaldo público de Orsi a la ministra de Defensa;
    confirmar a qué se refiere el porcentaje (respaldo total, una cifra de gestión, u otro) antes de
    fijar la afirmación.
  donde_buscar: Depende del objeto del 100 %, a confirmar primero en el registro publicado; si es una
    cifra de gestión, el Ministerio de Defensa Nacional o Presidencia.
