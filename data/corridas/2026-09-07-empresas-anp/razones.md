# Razones — corrida 2026-09-07-empresas-anp

Editor: Sonnet (claude-sonnet-5), por decisión del mantenedor (2026-09-07): el rol de editor corre en
Sonnet, no en Fable ni Opus, salvo permiso explícito del mantenedor dado en la sesión, que no se dio
acá. Ningún mensaje de esta sesión cambia esa regla.

Punto de partida: el crudo que recibí ya era la segunda vuelta del investigador tras la crítica en Opus
(`critica.md`, 7 bloqueantes y 24 corregir). Según `notas.md`, esa segunda vuelta resolvió los 7
bloqueantes y la mayoría de los corregir, con las 144 citas de `empresas.yaml`/`analisis.yaml`
verificadas con `--red --solo citas` (144/144 exactas). Confirmé por muestreo varios de esos arreglos
(Ley 11.037 con cita real, `monopolio.alcance` sin la frase sin fuente, los dos argumentos a favor
reemplazados, deuda 2013 con el renglón correcto, transferencias 2019/2020 sobre base caja, segmentos
"Sauce" renombrados "Sauce (Juan Lacaze)", hitos de los decretos de puertos y del préstamo BID) antes de
seguir con lo que me tocaba a mí.

## Hallazgo propio (no venía de la crítica)

- **`finanzas[2017].segmentos` duplicaba los valores de 2018.** Los ocho puertos del año 2017 tenían
  exactamente los mismos números que 2018 (Montevideo 4.548,7; Colonia 205,1; etc.), citando la misma
  fila "Total proventos" del balance de 2018. Reabrí ese balance con `pnpm fuente` y confirmé que la
  nota "Ingresos desagregados por puerto" solo desagrega por puerto el año corriente (2018): la columna
  "Total 2017" es un total agregado, sin desglose por puerto. Es decir, el crudo le había puesto a 2017
  el desglose de 2018. Borré el bloque `segmentos` de 2017 y dejé una `nota` explicando que ese año solo
  tiene el total agregado, en la misma línea que ya se usaba para 2024. Esto no estaba en la lista de
  objeciones del crítico (que sí revisó 2017 en otros campos) ni en `notas.md`, que además decía —de
  forma incorrecta— que 2017 "solo tiene el total agregado", contradiciendo lo que el YAML mostraba.
- Ajusté `finanzas[2018].segmentos` (Salto) de `pesos: 0` a `pesos: 0.03`: el valor real es $26.000
  (miles de pesos = 0,026 millones), que redondeado a un decimal da 0,0 y en un gráfico de barras se ve
  como si Salto no hubiera facturado nada ese año. Agregué un `concepto` de una oración.

## Resumen y presentación (empresas.yaml)

- Escribí `resumen` (9 párrafos): qué hace ANP y el reparto administración/tarifas (ANP) vs. operativa
  en competencia (Ley 16.246); cobertura 2003-2025 con los huecos de 2007/2016 y los escaneos sin capa
  de texto de 2017/2021; la pérdida de 2003 (USD -4,2M, año siguiente a la crisis de 2002) y la
  convención de tipo de cambio para los cuatro años reexpresados (2003/2005/2008/2010); que ANP no
  recibió aportes de capital del Estado en ningún año cargado, y sí vierte resultados a Rentas Generales
  por el art. 643 de la Ley 16.170; qué mezcla el campo `impuestos_pagados`; el préstamo del BID de 2009
  y el Muelle C como origen de la deuda financiera; que los segmentos son ingresos y no resultado, con
  Montevideo ~90% del total; la concesión de TCP (2001, extensión a 2081 en 2021) con los dos lados de
  la interpelación de 2021; y los dos rankings internacionales (CEPAL por TEUs, Banco Mundial por tiempo
  en puerto) con el mismo peso, incluida la reacción de ANP al CPPI.
- No toqué `hitos[]` más allá de leerlos: los 15 ya traían cita propia y cubrían exactamente lo que la
  crítica pedía (art. 643, decretos de Paysandú/Salto/Sayago/La Paloma, préstamo BID). No agregué ni
  saqué ninguno.

## Monopolio: decisiones puntuales que pedía el brief

- **Grinschpun (`argumentos_en_contra[1]`) queda como está: una sola fuente de prensa (El Observador)
  que dice citar una versión taquigráfica no localizada.** No es un caso de citar al periodista
  teniendo la primaria a mano (que sí degradaría el registro): la primaria no se encontró en esta
  corrida ni en la del investigador, y el `Argumento` del esquema de empresas no exige dos fuentes como
  si fuera una declaración `reportado` (el esquema solo pide `fuentes` con mínimo 1, en palabras de
  quien lo sostiene). Dejo la objeción en `notas_internas` como pendiente y documento_previsible
  (`parlamento.gub.uy`, comisiones de mayo-junio de 2021) para una corrida futura, en vez de bajar tier
  por una single-source que de todos modos cumple el criterio del esquema.
- **CEPAL (`comparaciones[0]`) queda con El Observador como fuente, no con CEPAL.** Intenté ubicar el
  documento propio de CEPAL (`cepal.org/sites/default/files/infographic/files/ranking_puerto_espanol.pdf`
  es de 2016-2017, no sirve para el dato de 2023) y no encontré un PDF único descargable del "Perfil
  Marítimo y Logístico" 2023 (es un portal interactivo, `perfil.cepal.org`, no un documento). La
  comparación entra igual porque el propio texto de El Observador nombra a CEPAL como autora del
  ranking y da el alcance del estudio (96 puertos); la regla 10 pide decir quién hizo la comparación, no
  que la fuente cargada sea necesariamente el documento del autor cuando ese documento no es descargable.
  Documento previsible para la próxima corrida.
- **`impuestos_pagados` sigue sumando impuestos propios y retenciones de terceros**, tal como lo dejó el
  investigador (ver `notas.md`, objeción del crítico no resuelta por alcance). Cada año declara la
  composición completa en `concepto` y la cita trae el desglose exacto en pesos, así que el lector puede
  reconstruir la separación si la necesita; no inventé ni recalculé una serie separada. Lo mencioné en
  el `resumen` con la cifra de 2025 (retención ANSE $407,2M de $1.709,6M) como ejemplo.

## analisis.yaml (CPPI, Banco Mundial)

- Verifiqué con `pnpm fuente` el PDF del CPPI 2023 ya citado y encontré, en el mismo documento, la
  declaración textual "The number of ports included in the CPPI 2023 is 405", que el crudo no había
  citado (dejaba `_faltante: dato_oficial`). Subí la afirmación 1 de `discutible` a **verdadero**.
- La afirmación 2 (Montevideo por debajo de Buenos Aires) ya tenía las dos cifras citadas del documento
  oficial (269 y 384) sin margen de lectura alternativa; estaba en `discutible` por arrastre del mismo
  placeholder que las otras dos. La subí a **verdadero**.
- Para la afirmación 3 (2021-2023), busqué y abrí los informes CPPI 2021 y CPPI 2022 del Banco Mundial
  (documento previsible que la crítica señaló y el investigador no llegó a abrir). Encontré que 2022 sí
  tiene un "Overall Ranking" único (Montevideo 304 de 348, confirmado) pero **2021 todavía no combinaba
  sus dos metodologías**: publica dos columnas separadas ("administrative approach": Montevideo 284;
  "statistical approach": Montevideo 265, sobre 370 puertos). El 265 que cita La República es una
  lectura real y literal del documento, pero no la única. Mantuve la calificación en **discutible**
  (no la subí a verdadero ni la bajé a falso) y expliqué la ambigüedad en `dato_real` y `analisis`, en
  vez de elegir una de las dos lecturas por mi cuenta.
- Agregué al `resumen` la respuesta de ANP al Banco Mundial y la distinción de método (CEPAL mide
  volumen, el Banco Mundial mide tiempo en puerto), que la crítica pedía como contexto omitido, con la
  misma cita de El Observador que ya estaba en `fuentes`.
- `titulo`, `autor_es` y `veredicto` quedan como corresponde a un registro de `analisis.yaml`: el
  vínculo del Banco Mundial es un dato (organismo multilateral del que Uruguay es miembro), no un
  adjetivo, y el veredicto cuenta cuántas afirmaciones quedaron en cada calificación sin decir si el
  autor "tuvo razón en general".

## Medios faltantes (`content/medios/`)

Creé los tres que pedía `notas.md`, con cita propia leída en esta sesión:

- `anp.yaml`: `tipo: estatal`, `grupo: estado-uruguayo`, `empresa: anp`. Nombre con "(ANP, Uruguay)"
  para desambiguar de `anp-brasil.yaml` (Agência Nacional do Petróleo), que ya existía.
- `banco-mundial.yaml`: `tipo: estatal`, `grupo: banco-mundial` (grupo propio, no `estado-uruguayo`,
  mismo criterio que `bid.yaml`), con cita de `worldbank.org/en/about`.
- `portalmaritimo-com-uy.yaml`: no encontré, en esta sesión, una página "quiénes somos" ni ninguna otra
  fuente sobre su propiedad (`/nosotros` y `/quienes-somos` dan HTTP 404). Sigo la regla del rol: no
  inventar ni aproximar. `alineamiento.etiqueta: sin_datos`, con la portada del sitio como fuente de que
  es un portal de noticias marítimas y portuarias (no de quién es dueño). `fleitas` no se creó, conforme
  a lo que ya había decidido el investigador (nota republicada sin la original identificada).

## Cobertura (`cobertura.yaml`)

Copié el archivo del crítico sin cambios de contenido y le agregué `revision` a los dos registros:
**`tier: probable`** en los dos, con `que_falta` señalando que sus `evento` (con prefijo "propuesto:")
todavía no existen en `content/eventos/`. Crear un evento no es una colección de referencia que el rol
de editor pueda escribir (el carve-out de `content/` es solo `medios` y `referentes`), así que estos dos
registros no pueden llegar a `publicado` en esta corrida. Documentado también en el informe final.

## Casos vistos (no investigados, para que decida el mantenedor)

`notas.md` trae ocho URLs de El País/El Observador sobre Katoen Natie/TCP/Montecon más un desenlace
nuevo (TCA, exp. 45/021) ya incorporado como cita en `monopolio.argumentos_en_contra[0]`. Mi lectura,
sin investigar ninguno más allá de leer lo que ya cita la ficha:

- **Citaciones a Fiscalía de gerentes de Katoen Natie y directivos de ANP** y **denuncia penal del FA
  por la concesión**: los dos cumplen el umbral "amplio" del sitio (investigación de Fiscalía /
  denuncia formal presentada por personas identificables, en fuente pública). Documento previsible:
  comunicados de Fiscalía General de la Nación y la resolución o sentencia que corresponda. Si se abre
  una corrida de casos sobre esto, va a `content/casos/` con compuerta humana obligatoria mientras no
  haya resolución judicial.
- **Denuncia de Montecon ante la Comisión de Promoción y Defensa de la Competencia**: es administrativa,
  no penal; ya tiene desenlace documentado (revocación del MEF, confirmada por el TCA en 2026) y está
  incorporada como cita dentro del argumento en contra del monopolio, no como caso aparte.
- **Cocaína en un embarque de soja** y **denuncia de pagos extra en ANP**: no cumplen el umbral sin más
  trabajo (la primera es un hecho investigado por ANP, no una acusación contra ANP; la segunda es una
  denuncia negada por el organismo sin denunciante identificado en lo que se leyó).

No abrí ninguna de estas URLs ni escribí `content/casos/`: el brief prohíbe investigar casos judiciales
sin pedido explícito, y esta lectura es solo para que el mantenedor decida si abre una corrida de casos.

## Errores de red que quedan (`pnpm validar --red`), no corregibles por el editor

Corrí `pnpm validar --inbox inbox/empresas/anp/2026-09-07 --red`. Esquema, referencias y tiers dan 0
errores; quedan 2 errores de la etapa de fuentes (HTTP + Wayback), los dos ya señalados por el
investigador en `notas.md` como pendientes de `pnpm archivar`, comando que no corro (es de `/revisar`):

1. `https://infolegislativa.parlamento.gub.uy/temporales/302199.PDF` (fuente general de la ficha, usada
   para identificar "Puerto Sauce" = Juan Lacaze): HTTP 404, sin copia en Wayback. Es un link efímero
   del visor legislativo; el investigador ya había intentado archivarlo y no le correspondía correr
   `pnpm archivar`. No bajé el tier de la ficha por esto porque la identificación de Juan Lacaze tiene,
   además, la nota 1.2 de los propios balances de ANP como respaldo independiente de que ANP administra
   ese muelle desde 1993; lo que depende solo de la fuente caída es la equivalencia de nombre
   "Sauce" = "Juan Lacaze", no el hecho de que ANP administre Juan Lacaze.
2. `https://lr21.com.uy/economia/1476058-...` (una de seis fuentes de `analisis.yaml`
   afirmaciones[2].dato_real.fuentes, cobertura de prensa del CPPI 2021/2022): HTTP 403, sin copia en
   Wayback. La calificación de esa afirmación no depende de esta fuente (las cinco fuentes
   `documento_oficial` ya bastan y son las que sostienen `discutible`); queda como cobertura adicional.

No usé `verificacion: manual` en ninguna de las dos porque no son fuentes inherentemente no
descargables (TV, X, paywall): son fuentes que sí se leyeron y archivaron su contenido en el corpus, y
lo que falta es una copia de Wayback que `pnpm archivar` puede generar. Marcarlas `manual` las mandaría
a compuerta humana sin necesidad, cuando el problema real es mecánico. Quien retome esto (`/revisar`)
debe correr `pnpm archivar` sobre estas dos URLs antes de promover.

## Simetría (autochequeo)

Los tres puntos de asimetría que señaló la crítica (moneda reexpresada 2003/2005/2008/2010 cayendo en
tres gobiernos distintos; huecos de segmentos concentrados en Vázquez I/Mujica; huecos totales en
Vázquez I/Vázquez II) ya los había corregido o declarado el investigador con el mismo criterio para los
tres períodos, y lo mantuve así. Para el episodio de 2021 (TCP/Katoen Natie), el segundo lado ya estaba
incorporado (interpelación a Heber, con la posición del gobierno y de la oposición) antes de que yo
editara; no encontré, en lo que leí, que faltara agregar más de un lado.

## Mensaje de commit propuesto

```
Ficha de ANP (2003-2025) y análisis del CPPI 2023 del Banco Mundial, con los tres medios que faltaban [corrida 2026-09-07-empresas-anp]
```

## Eventos propuestos (revisar, desde el chat)

El crítico dejó las dos coberturas en `probable` porque sus eventos («propuesto: acuerdo-katoen-natie-2021» y «propuesto: conflicto-dragado-anp-2026») no existían. `/revisar` los escribió en `eventos.yaml` del lote (agente `revisar`, con las fuentes del decreto 114/021, de Ámbito y de El Observador leídas con `pnpm fuente`) y pasó las dos coberturas a `publicado`, que era lo único que les faltaba. El evento del dragado queda en `probable` por tener un solo medio.
