# Notas — ANCAP (ficha de empresa), corrida 2026-09-07-empresas-ancap

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
  tarea del editor, no mía.
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
  corrida.

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
  de buscarla.
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
