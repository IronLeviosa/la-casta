# Notas — ANCAP (ficha de empresa), corrida 2026-09-07-empresas-ancap

> **Segunda pasada (2026-09-07, mismo día).** Lo que sigue son las notas originales del primer
> investigador, sin editar, más una sección `## segunda_pasada` al final con lo que yo agregué o
> encontré al corregir el lote contra `critica.md`. Donde una nota original quedó desactualizada por mi
> corrección (por ejemplo, la reexpresión de 2020), lo señalo en la sección nueva en vez de borrar el
> texto original.

## anios_sin_balance

Ninguno: se consiguió el `Resultado del ejercicio` (individual, auditado) de los diez años pedidos,
2015 a 2024, todos leídos con `pnpm fuente` en esta sesión desde `ancap.com.uy` (Estados Financieros
Individuales, un documento por año, salvo 2015/2016, 2017/2018, 2021/2022 y 2023/2024 que además se
cruzaron contra el año comparativo del documento siguiente para verificar consistencia — coincidieron
en todos los casos salvo el de 2020, ver más abajo).

Lo que **no** se consiguió con el mismo nivel de detalle para los diez años:

- **`transferencias_al_estado`**: solo constan movimientos ("Versión a Rentas Generales") en 2020, 2023
  y 2024. Para 2015, 2016, 2017, 2018 y 2019 los propios Estados Financieros de Ancap dicen
  explícitamente que **no hubo** versión de fondos a Rentas Generales ("Durante los ejercicios 2016 y
  2015 no se realizaron versiones de fondos a rentas generales", EECC 2016 individual; "Durante los
  ejercicios 2018 y 2017…", EECC 2018; "31.6 Durante los ejercicios 2019 y 2018…", EECC 2019; "28.7…
  Durante el ejercicio finalizado el 31 de diciembre de 2022 y 2021 no se realizaron transferencias a
  rentas generales", EECC 2022, que también cubre 2021). Por eso esos años quedaron con el campo
  omitido en `empresas.yaml`, tal como indica el brief, en vez de forzar un `usd: 0`.
- **`capitalizaciones_del_estado`**: solo hay un evento documentado en el período, 2016 (contrato del
  2/2/2016, autorizado por la Ley 19.368 del 4/1/2016, por U.I. 5.840.159.519 / $ 18.856.707.058). No
  encontré, en los Estados Financieros que leí, un segundo evento de capitalización del Estado *a*
  ANCAP en 2015, 2017-2022, 2023 o 2024 (sí hay, en 2021, 2022 y 2024, capitalizaciones de ANCAP *a
  sus propias subsidiarias* — Cementos del Plata, CABA S.A. — que no son "el Estado poniendo plata en
  ANCAP" y por eso no las incluí en ese campo).

## medios_faltantes

- **`uruguay.justia.com`**: no existe `content/medios/justia.yaml` (ni ninguna variante). Lo usé para
  el texto sustantivo de la Ley 17.448 porque IMPO, para leyes derogadas por completo, solo muestra el
  número de artículo con notas de vigencia y no el texto original (ver `verificacion_manual` más abajo
  para el intento con IMPO). Propongo un medio `justia` o `uruguay-justia`, tipo `estatal`/`agregador
  legal`, sin línea editorial propia (reproduce texto de leyes uruguayas).
- **`ced.uy`** sí existe como medio (`content/medios/ced.yaml`), no hace falta agregarlo; lo menciono
  igual porque el PDF que abrí de ahí (`doc_13.pdf`, Boletín Macroeconómico N.º 27) no lo terminé
  citando — ver `verificacion_manual`.

## candidatos_giro

No aplica a esta ficha: `empresas.yaml` no tiene declaraciones de una persona en el tiempo, así que no
hay pares antes/después que evaluar. (Si el editor quiere cruzarlo con declaraciones ya publicadas de
políticos sobre ANCAP, el material de esta corrida —en particular la cita de Lacalle Pou de 2024 sobre
libre importación, y las de Orsi de abril de 2025 ya en
`content/chequeos/orsi/2025-04-25-ancap-volvio-negativos-diez-anos-2025.yaml`— podría servir de
insumo, pero eso es trabajo de otra corrida sobre el político, no de esta.)

## hipotesis

- **Reexpresión del resultado de 2020 (hallazgo relevante).** Los Estados Financieros Individuales de
  Ancap al 31/12/2021 (Nota 30) dicen que en 2021 la empresa detectó un error en el cálculo del
  impuesto a la renta de los ejercicios 2018, 2019 y 2020, que "significaron una reducción del cargo
  por impuesto a la renta y por lo tanto un incremento patrimonial". El resultado comparativo de 2020
  se reformuló, aplicando la NIC 8, de una pérdida de $ 510.662.282 (la cifra que Ancap publicó
  originalmente, la que usan la prensa y el chequeo ya publicado sobre la frase de Orsi) a una
  **ganancia** de $ 385.113.873. Los estados financieros individuales de 2018 y 2019 en sí mismos no
  fueron reemitidos con las cifras corregidas (el efecto acumulado de esos dos años se sumó al saldo de
  apertura de 2020). No alcancé a confirmar si hay más años previos a 2018 afectados, ni si hubo alguna
  nota de prensa que haya cubierto esta reexpresión en su momento (no apareció en las búsquedas de esta
  corrida). Dejo la cita completa de la Nota 30 en `empresas.yaml`, dentro del ítem de 2020. Esto
  podría ser insumo para una corrección o un nuevo chequeo sobre
  `content/chequeos/orsi/2025-04-25-ancap-volvio-negativos-diez-anos-2025.yaml`, pero decidir eso es
  tarea del editor, no mía. **[Actualización, segunda pasada: esto ya se ejecutó — ver `## segunda_pasada`.]**
- **"Capitalización en 2015" mencionada por Stipanicic.** El chequeo ya publicado cita a Alejandro
  Stipanicic (expresidente de Ancap) diciendo que hasta 2019 el mecanismo de precios favorecía a Ancap
  pero que "aún así" hizo falta una capitalización en 2015. En los Estados Financieros que leí, el
  único hecho societario de esa naturaleza en el entorno de esa fecha es el contrato del 2 de febrero
  de **2016** (autorizado por una ley del 4 de enero de 2016), que a su vez ejecuta una línea de
  crédito habilitada por la Ley 19.339 del 26 de agosto de **2015**. No encontré, en las notas de los
  Estados Financieros de 2015 o 2016, un aporte de capital del Estado fechado dentro del año calendario
  2015 en sí. Puede que Stipanicic esté hablando de la misma operación en términos laxos (la ley
  habilitante es de 2015), o puede haber un aporte de 2015 que no vi. No lo afirmé como hecho separado
  en `empresas.yaml`.
- **Comparaciones empresa-a-empresa (Petrobras, ENAP, Petropar, YPF).** No encontré ninguna fuente que
  compare a ANCAP con esas empresas en términos operativos (margen de refinación, costo por barril).
  Lo que sí encontré y usé son comparaciones de **precio al público entre países** (SEG
  Ingeniería/Global Petrol vía Ámbito, y el barómetro energético del CEPP vía Ámbito), que es un
  indicador que el brief permite explícitamente ("precio al público"), aunque compara mercados/países
  y no directamente compañías. Búsquedas específicas de "ANCAP margen de refinación Petrobras/ENAP/YPF"
  no devolvieron ninguna comparación cuantitativa publicada.
- **Brecha nafta/gasoil por año, en dólares.** El desglose año a año que pide el campo
  `precios_vs_paridad.series` (`nafta_usd_millones`, `gasoil_usd_millones`) solo lo conseguí, limpio y
  citable, para dos períodos multianuales (2010-2014 y 2015-2019, citados por El Observador de un
  informe del CED) y de forma agregada (no separado por producto) para 2020-2021 y 2024. El PDF
  original del CED (`ced.uy/.../doc_13.pdf`) tiene más desgloses por año, pero la extracción de texto
  vino con las cajas de texto del diseño gráfico en un orden que no es el de lectura visual (números y
  etiquetas aparecen intercalados de forma ambigua); por la regla de cita literal y contigua, preferí
  no citar esos fragmentos y usar en su lugar la misma fuente tal como la cita El Observador en prosa
  corrida, que sí es contigua y legible.

## casos_vistos

No investigado, solo lo que exige el brief: una línea.

- El caso judicial de Ancap 2017-2019 vinculado a Raúl Sendic aparece mencionado tangencialmente en
  varias notas de este lote (por ejemplo, en la cobertura de 2015-2016 sobre la deuda y la
  capitalización de Ancap), pero no lo investigué.
- Al correr `pnpm descubrir elpais.com.uy`, aparecieron además decenas de títulos de 2015-2016 sobre la
  "Comisión Investigadora de Ancap" (deuda, filtraciones, denuncias cruzadas entre oficialismo y
  oposición, pagos a una radio) — es la comisión parlamentaria que antecedió a ese caso judicial. No
  abrí ninguna de esas notas ni las até a hechos puntuales; quedan como candidatas si en algún momento
  se decide investigar el caso.

## verificacion_manual

- `https://transparenciapresupuestaria.opp.gub.uy/inicio/empresas-publicas/ancap`: `WebFetch` dio
  timeout (60000ms) dos veces. Es la página de OPP que el brief sugiere para transferencias y
  capitalizaciones; no llegué a leerla. Podría tener series ya armadas que ahorren trabajo en una
  próxima corrida (para esta ficha o para las siguientes de la colección `empresas`).
- La Ley 17.448 en `impo.com.uy` (`/bases/leyes/17448-2002`) no muestra el texto original de sus
  artículos: al estar totalmente derogada por el referéndum de 2003, IMPO solo conserva el número de
  cada artículo con una nota "(*)" que remite al "TEXTO ORIGINAL" sin reproducirlo. Usé
  `uruguay.justia.com` como espejo del texto sustantivo (ver `medios_faltantes`); no es la fuente
  primaria del Estado, aunque reproduce el texto de una ley pública.
- El PDF `https://ced.uy/public/archivos/boletines/doc_13.pdf` se descargó y se leyó, pero la
  extracción de texto del diseño gráfico (recuadros, cifras grandes) vino en un orden no lineal que no
  permite citar con confianza qué cifra corresponde a qué período sin arriesgar una cita no contigua.
  No usé citas de este PDF en el registro final (sí usé el mismo contenido tal como lo cita, en prosa
  limpia, El Observador).
- No encontré la nota de El País sobre "Ancap ya no tendrá el monopolio de los combustibles en los
  aeropuertos" (2023-07-27) pese a dos intentos de búsqueda con términos exactos del título; la mención
  de la excepción aeroportuaria en `empresas.yaml` queda solo respaldada por lo que dice la nota de
  puertos de El Observador (2020) sobre el trámite parlamentario, no por una fuente de 2023 que
  confirme el decreto específico de aeropuertos. Vale la pena una búsqueda dedicada en una próxima
  corrida. **[Actualización, segunda pasada: encontrada — ver `## segunda_pasada`.]**

## cobertura_del_periodo

- **Marco legal**: cubierto desde 1931 (Ley 8.764, texto completo) hasta 2022 (Ley 20.075, hidrógeno
  verde), pasando por 2001-2003 (Ley 17.448 y su referéndum) y 2020 (Ley 19.924 y LUC). El decreto
  específico de la excepción aeroportuaria (2023) no se verificó (ver `verificacion_manual`).
- **Finanzas**: los diez años pedidos, 2015-2024, con resultado del ejercicio, tipo de cambio, deuda
  financiera; transferencias y capitalizaciones donde constan. Todo de estados financieros
  *individuales* (no consolidados), como pide el brief.
- **Monopolio y argumentos**: cubiertos con material de 2001 (gobierno de Batlle), 2003 (referéndum,
  FA/PIT-CNT/Fancap como impulsores de la derogación de la ley desmonopolizadora), 2020 (debate interno
  de la coalición de gobierno en la LUC) y 2024 (Lacalle Pou insistiendo con la libre importación desde
  la oposición... en rigor, todavía en el gobierno, en un acto sectorial). No conseguí una declaración
  en primera persona, con nombre y apellido, de alguien defendiendo el monopolio con la misma nitidez
  que la cita de Lacalle Pou en contra: lo que hay del lado "a favor" es mayormente reportado
  (resultado del referéndum, resistencia de sectores de la coalición, resumen de la diaria) más una
  cita institucional de ANCAP sobre el valor de refinar. Si algo quedó asimétrico en esta ficha es esto,
  y lo dejo explícito acá siguiendo la Regla 0: no encontré la asimetría porque la haya buscado así,
  sino porque me costó más encontrar una voz "a favor" tan citable como las que hay "en contra"; no dejé
  de buscarla. **[Actualización, segunda pasada: se agregaron dos voces a favor con nombre y apellido —
  ver `## segunda_pasada`.]**
- **Comparaciones regionales**: cubiertas con precio al público (2026, SEG Ingeniería/Global Petrol y
  CEPP, ambas vía Ámbito) y con la brecha contra la paridad de importación por gobierno (CED, vía El
  Observador, 2010-2019 con desglose nafta/gasoil, 2020-2021 agregado). No hay comparación
  empresa-a-empresa con Petrobras/ENAP/Petropar/YPF: no la encontré publicada por ninguna fuente.

## objeciones_al_brief

Ninguna. El brief pide, explícitamente, el mismo esfuerzo para los argumentos a favor y en contra del
monopolio y cifras "sin verbos de intención ni adjetivos", en línea con la Regla 0; no vi ninguna
instrucción que pidiera seleccionar, omitir o encuadrar a favor de un partido, gobierno o postura. La
única asimetría que quedó en el resultado (más quotes "en contra" que "a favor", y el detalle de la
sección anterior) es de disponibilidad de fuentes citables con la misma nitidez, no de esfuerzo de
búsqueda ni de selección de mi parte, y quedó documentada arriba.

---

## segunda_pasada

Todo lo que sigue lo agregué yo (Sonnet, segunda pasada, 2026-09-07) al corregir el lote contra
`critica.md`, siguiendo la lista de 8 puntos del encargo del orquestador. Cada cita nueva la leí con
`pnpm fuente` en esta sesión, incluidas las que ya estaban en `empresas.yaml` de la primera pasada (las
reabrí para poder citarlas como propias).

**Objeciones al encargo de esta pasada (Regla 0).** Ninguna. El encargo pide expresamente "argumentos a
favor del monopolio, con el mismo esfuerzo que los de en contra" y trata los dos chequeos/discrepancias
que corrige con el mismo criterio (uno afecta una cita de Orsi, el otro una nota de Presidencia de un
gobierno del Frente Amplio); no encontré ninguna instrucción asimétrica en el encargo.

### 1. Reexpresión de 2020

Hecho: `finanzas[2020].resultado_ejercicio` ahora lleva +385.113.873 (USD 9,1 M al cierre 42,340), con
`nota` (campo a nivel de `Anio`, no dentro de `Monto` — el esquema lo define así) con la cifra original,
el ajuste, el motivo citado literal de la Nota 30, y el resultado antes de impuestos ($ -277.690.029 en
las dos versiones). La cita de la Nota 30.2 la reconfirmé yo mismo con `pnpm fuente --desde 169700
--maximo 2200` sobre `ancap.com.uy/10610/1/eecc-individuales-2021.html`.

### 2. Año 2014

Agregado como primer ítem de `finanzas`, con `resultado_ejercicio` únicamente (pérdida de $
7.876.081.940, USD -323,2 M al cierre 2014 de 24,37 — tipo de cambio que confirmé yo mismo con
`pnpm fuente` sobre la tabla de cotizaciones del propio estado de 2015, no estaba en el lote original).
No agregué `impuestos_pagados` ni otros campos a 2014: el encargo pide agregar el año "con esa fuente"
(la columna comparativa de 2014 en el estado de 2015), no reconstruir el resto de sus finanzas, y no
encontré esos otros datos para 2014 en esta pasada.

### 3. Impuestos pagados

Agregado `impuestos_pagados` a los diez años 2015-2024, con la línea `Total impuestos` (o `Total
Impuestos`, según el año — respeté la grafía de cada documento) del cuadro de "Impuestos pagos y montos
recaudados como agente de retención", confirmando cada cifra en al menos un documento propio del año
(y, cuando el mismo dato aparecía en la columna comparativa de otro año, lo crucé). La serie completa
en pesos: 2015: 17.963.260.814; 2016: 19.767.669.858; 2017: 20.974.914.980; 2018: 26.871.322.829;
2019: 29.276.595.731; 2020: 28.660.288.325; 2021: 34.819.274.128; 2022: 40.911.711.256; 2023:
37.645.383.171; 2024: 38.241.986.778 — en dólares al cierre de cada año, entre USD 599,8 M (2015) y
USD 1.021,0 M (2022). Agregué `concepto` explicando qué mide el campo (IMESI, IVA, Tribunal de
Cuentas, FUDAEE, retenciones; no incluye IRAE propio de Ancap ni transferencias a Rentas Generales) para
que no se lea como "lo que Ancap le da al Estado" en un sentido más amplio del que el dato permite.

### 4. Argumentos a favor y en contra

- **Agregados a `argumentos_a_favor`**: Gerardo Rodríguez (presidente de Fancap, El País 17/10/2020,
  cita en primera persona sobre las empresas públicas y el temor a que Ancap "pierda su esencia, el
  monopolio") y Daniel Martínez ("siempre conviene refinar y no importar", la diaria, cruce con Lacalle
  Pou en la Expo Prado 2019). Las dos citas ya estaban en el corpus (`pnpm corpus:buscar "Fancap"` las
  encuentra) y las reabrí yo mismo con `pnpm fuente`.
- **Sacados de `argumentos_a_favor`**: el ítem sobre el resultado del referéndum de 2003 y el ítem
  sobre la oposición del Partido Colorado y Cabildo Abierto en la LUC — ninguno de los dos era un
  argumento (ni había una idea con sostenedor), tal como señaló el crítico. Con esto, el conteo final es
  4 argumentos a favor (ANCAP, la diaria genérico, Fancap, Daniel Martínez) contra 3 en contra (Lacalle
  Pou, la diaria genérico, gobierno de Batlle).
- **`argumentos_en_contra[0]` (Lacalle Pou) reescrito**: saqué "la medida más liberal que impulsó"
  (superlativo que no está en la nota) y "No hay que temerle a terminar con el monopolio"
  (reconstrucción: lo que dijo fue "No, no hay monopolio en nada..."). El `texto` nuevo se apoya en la
  cita completa que releí de `montevideo.com.uy` (la pedí sin `--buscar` para tener el artículo entero,
  1976 caracteres, y usé el tramo desde "Los individuos, por lo general, dicen..." hasta "...vamos a
  terminar en eso", que es contiguo). Agregué en `quien` el contexto del discurso (Asociación de
  Cultivadores de Arroz, marzo de 2024, siendo presidente), que está en la misma nota.
- **El informe del comité de asesores del MIEM (LUC art. 237): lo busqué y lo encontré, pero no lo usé
  como argumento.** Leí tres fuentes: El Observador del 27/10/2020 (formación del comité, integrantes,
  mandato), la diaria del 03/02/2021 (el contenido real del informe elevado al Parlamento: eliminar la
  mezcla de biodiésel, crear un impuesto a las emisiones, revisar el subsidio al supergás, reformar el
  envasado de GLP) y la diaria del 24/11/2021 (el resumen que ya cita el lote). Ninguna de las tres
  contiene un argumento a favor o en contra del monopolio de importación/refinación en sí: el comité
  trabajó explícitamente después de que la desmonopolización (el artículo 230 del anteproyecto de la
  LUC) ya había sido retirada por falta de acuerdo en la coalición, y su mandato fue revisar el
  *mecanismo de precios* y aspectos técnicos del mercado, no el monopolio. Forzar este informe dentro de
  `argumentos_a_favor` habría sido atribuirle al documento una toma de posición que no tiene. Una
  búsqueda web devolvió un resumen de un tercero que atribuye al subsecretario de Industria Walter Verri
  la frase "el monopolio lo va a tener Ancap" en ese contexto, lo que sí sería un argumento a favor
  citable (una autoridad de gobierno afirmando que el monopolio se mantiene) — pero no logré ubicar ni
  abrir con `pnpm fuente` el artículo primario que contendría esa cita en el tiempo de esta pasada, así
  que no la usé (regla dura: nunca citar una URL que no abrí). Queda como pista para una próxima
  corrida: buscar declaraciones de Walter Verri (subsecretario del MIEM, 2020-2021) sobre el futuro del
  monopolio de ANCAP.

### 5. Aeropuertos

Encontrada la fuente: El Observador, 27/07/2023, "Gobierno reglamentó el fin del monopolio de
combustibles de Ancap en aeropuertos". Cambia el encuadre que tenía la ficha: no es que la excepción
"empiece" en 2023, sino que una ley de fines de 2020 ya establecía que el monopolio no regía en
aeropuertos internacionales para el abastecimiento de vuelos comerciales con destino al exterior, y el
decreto del 25/07/2023 extendió esa excepción a aeronaves de cualquier bandera (antes, aparentemente,
solo alcanzaba a algunas). Reescribí `monopolio.alcance` con este matiz y agregué una `norma` nueva con
la cita, separada de la de puertos (que quedó con su propio ítem, sin la mención a aeropuertos que
tenía mezclada). No identifiqué el número de decreto exacto en el cuerpo del artículo (el texto no lo
menciona; hay dos candidatos en IMPO, decreto 134/023 y 267/023, que no abrí para no adivinar cuál es
el correcto sin confirmarlo) — si se necesita el decreto mismo como fuente, alguien tiene que
verificar cuál de los dos es.

### 6. Comparaciones de precio al público

En las cuatro comparaciones señaladas (SEG Ingeniería/Global Petrol para nafta y gasoil, CEPP para
nafta Súper y gasoil, todas vía Ámbito), cambié `indicador` y `valor_propio` para que quede explícito
que la cifra es el precio al público en Uruguay (con impuestos y márgenes de la cadena que fija URSEA),
no un valor que percibe ANCAP, y agregué como fuente adicional la propia página de ANCAP sobre
composición de precio ("El PEP sin impuestos es el ingreso neto que percibe ANCAP por sus ventas...").
No encontré, en ninguna de las dos notas de Ámbito, una comparación de precios ex refinería/ex planta
entre países (piden precio al público, que es lo que existe publicado); por eso reformulé en vez de
reemplazar por una comparación ex refinería. No toqué `comparaciones[9]` (CEPP gasoil) más allá de esto:
sigue sin un valor limpio para Uruguay fuera de frontera, algo que la crítica señaló aparte y que no
estaba en la lista de 8 puntos de esta pasada.

### 7. Registros publicados que esta corrida cambia

- **`chequeos.yaml`**: copia de `content/chequeos/orsi/2025-04-25-ancap-volvio-negativos-diez-anos-2025.yaml`
  con `dato_real` y `grafico` rehechos con la serie completa 2014-2024 (2020 con el valor reexpresado y
  la nota en el punto del gráfico) y las 11 fuentes correspondientes agregadas. No toqué `calificacion`
  (sigue en `falso`), `analisis` ni `titulo`: quedan tal cual el registro publicado, aunque ya no
  describen bien la serie corregida (el `analisis` todavía dice "cuatro años antes, no diez" y el
  `titulo` todavía dice "el último ejercicio negativo fue 2020"). Es al editor a quien le toca
  recalificar: con la reexpresión, el ejercicio negativo inmediatamente anterior a 2024 fue 2015, nueve
  años antes, no diez ni cuatro.

  **`resumen_vs_primaria`**: la afirmación original de Orsi ("volvemos después de 10 años a tener
  números negativos") se dijo en abril de 2025 con la información entonces vigente, que era la cifra
  ORIGINAL de 2020 (pérdida), no la reexpresada (que ya existía desde 2022 pero nadie parece haberla
  traído a la cobertura de esa conferencia). No hay contradicción entre lo que Orsi dijo y lo que la
  primaria decía en el momento; lo que cambia es que la primaria vigente *hoy* (Nota 30.2, EECC 2021) ya
  no es la misma primaria que estaba vigente en abril de 2025 en el punto específico de 2020. Dejo esto
  explícito para que el editor no lea la corrección como "Orsi mintió menos/más de lo que pensábamos
  sobre 2020" sino como "el dato de 2020 cambió entre que Orsi habló y hoy, y el sitio tiene que reflejar
  cuál es el vigente".

- **`discrepancias.yaml`**: agregué una copia de
  `content/discrepancias/presidencia/2020-02-27-resultado-operativo-etiquetado-como-resultado-ejercicio-ancap-2019.yaml`
  con dos fuentes nuevas en `fuente_primaria.fuentes` (resultado operativo negativo de 2015 y de 2016,
  ambos de estados que leí en esta pasada). No toqué `revision` (sigue en `probable`, tal como pide el
  encargo) ni `analisis` ni `evidencia` (no escribo análisis).

  Un matiz que el editor necesita para decidir si esto alcanza para promover el registro: **2016 y 2017
  encajan en el mismo patrón que 2018 y 2019** (la cifra que Presidencia rotula "resultado operativo" es,
  en realidad, el resultado del ejercicio al tipo de cambio de cierre: 2016, $ 435.536.149 / 29,34 =
  USD 14,8 M ≈ "15 millones"; 2017, $ 1.124.635.133 / 28,81 = USD 39,0 M ≈ "39 millones" — y en los dos
  años el resultado operativo real fue otra cosa: negativo en 2016, positivo pero distinto en 2017).
  **2015 no encaja en el mismo patrón.** Presidencia dijo "resultado operativo superavitario de 27
  millones de dólares", pero en los estados individuales de 2015 tanto el resultado operativo
  ($ -3.223.398.507, USD -107,6 M al cierre 29,95) como el resultado del ejercicio ($ -5.944.013.417,
  USD -198,5 M) fueron negativos: ninguno de los dos coincide con "+27 millones" ni en signo ni en
  magnitud. No tengo una explicación verificada; la única hipótesis que se me ocurre (no la confirmé) es
  que la cifra de 2015 de Presidencia venga de los estados **consolidados** de Ancap y sus subsidiarias,
  no de los individuales, y quedó fuera del alcance de esta pasada revisarlo.

### 8. Medios faltantes — `justia`

Encontré el texto de la Ley 17.448 en `parlamento.gub.uy` (`documentosyleyes/leyes/ley/17448`, que sí
renderiza contenido — no es una de las páginas de aplicación vacías que advierte `docs/fuentes-oficiales`
para las interpelaciones). Cubre los artículos 2 a 18 y los datos de promulgación. Pero la extracción de
texto de esta página tiene un defecto sistemático: las entidades HTML `&nbsp;` no se convierten en
espacio cuando quedan pegadas a una palabra, y el resultado son palabras corridas ("constituciónde",
"(ANCAP)deberá", "porun", "deacuerdo", "lostérminos"). Además, el `Artículo 1º` —el que trae la frase
"Derógase el monopolio..." que necesitaba para `monopolio.normas[1]`— no aparece en absoluto en el texto
extraído (busqué "Derógase el monopolio", "Artículo 1" y "ANCAP) de acuerdo con la": cero coincidencias
para las dos primeras, salvo un fragmento que salta directo de "Artículo 1" al final del artículo,
saltándose la oración operativa).

Con esto:
- **No reemplacé ninguna cita de `justia` por texto de `parlamento.gub.uy`**, porque citar texto con
  palabras corridas sería peor que lo que hay (y "arreglar" los espacios a mano sería acomodar una cita,
  algo que la regla prohíbe). Las dos citas de `justia` en `empresas.yaml`
  (`monopolio.normas[1].fuentes[1]` y `argumentos_en_contra[2].fuentes[0]`) quedan como estaban.
- **Sí corregí, en la misma sección del esquema que estaba tocando, una cita de IMPO que no era
  literal y contigua**: `monopolio.normas[1].fuentes[0]` (el mismo bloque de `justia`) citaba "...
  Promulgación: 04/01/2002 Publicación: 14/01/2002 ... Quedó sin efecto por: ..." con puntos suspensivos
  saltando por encima de "Registro Nacional de Leyes y Decretos: Tomo: 1 Semestre: 1 Año: 2002 Página:
  13", que sí está en la página de IMPO (la reabrí para confirmarlo). La reescribí completa y contigua.
  No es uno de los 8 puntos del encargo, pero es exactamente el tipo de error de cita que las reglas
  duras prohíben, lo encontré al hacer el trabajo del punto 8, y no me pareció razonable dejarlo sabiendo
  que estaba ahí.
- **Recomendación para el editor**: crear `content/medios/justia.yaml` (agregador legal, sin línea
  editorial propia, reproduce texto de leyes uruguayas) sigue siendo la opción más simple para que el
  lote valide sin citas garabateadas; la alternativa de arreglar la extracción de `parlamento.gub.uy`
  para páginas de `documentosyleyes/leyes/` es una mejora de herramienta, no algo que un agente deba
  parchear a mano.

### Consultas de esta pasada

Se agregaron al final de `consultas.jsonl` (no se tocaron las líneas de la primera pasada).
