# Notas — orsi/veracimetro/2026-09-07

## registro_primario

Por cada una de las cuatro declaraciones, esto es lo que se buscó y se encontró (o no) como
registro primario, siguiendo el punto 4 de las instrucciones y la "precedencia de la primaria"
del brief.

1. **ANCAP (2025-04-25, `orsi/2025-04-25-orsi-informo-ancap-volvio-tener-resultados`).**
   Ya tiene primaria: el registro publicado ya está en `nivel: textual` con
   `https://www.youtube.com/watch?v=8_HQMDpzEYA` (conferencia de prensa completa, Presidencia,
   25/04/2025) como fuente de tipo `video`. Abrí el video con `pnpm fuente` en esta sesión y el
   texto transcripto coincide palabra por palabra con la `cita` ya publicada. No hace falta
   agregar una copia en `declaraciones.yaml`: la corrección `2026-09-06-titulos-declaraciones` ya
   había resuelto esto antes de este encargo. El brief da por sentado que las cuatro están en
   `reportado`, pero esta ya no lo está; lo señalo para que quede explícito.

2. **IVA 2 % (2024-11-18, `orsi/2024-11-18-orsi-sostuvo-recargo-iva-2-aplicado`).** La nota de
   Montevideo Portal dice explícitamente que la declaración es de una "rueda de prensa" del lunes
   18/11/2024 "consignada por Telemundo (Canal 12)", posterior al debate presidencial del domingo
   17/11/2024. Busqué esa rueda de prensa puntual (WebSearch dirigido a Telemundo/Canal 12,
   YouTube, gub.uy) y no la encontré como pieza propia en ningún archivo público: no hay canal de
   Presidencia para material de campaña (Orsi todavía no era presidente) y Telemundo no tiene un
   artículo propio sobre ese momento específico. **No encontrada.**

   Lo que sí encontré, y que **no es la misma declaración**, es el video completo del debate
   presidencial del 17/11/2024 (`https://www.youtube.com/watch?v=t55eeoxENM8`, subido por "El País
   Uruguay", 69417 caracteres transcriptos con Whisper `large-v3-turbo` vía `pnpm fuente`). Ahí
   Orsi dice, durante el debate mismo: *"yo pregunto antes de irse ¿devolverán el 2% que
   recargaron de IVA por la compra por tarjetas?"* — una frase relacionada pero **distinta**,
   dicha un día antes y en un contexto distinto (debate en vivo, no rueda de prensa posterior). No
   la uso para completar el registro publicado del 18/11 porque cambiar la cita o la fecha con esa
   frase sería coser dos momentos distintos del hablante. Queda documentado acá por si el editor
   quiere abrir una declaración nueva para el debate (fuera del alcance de este encargo, que
   limita a las cuatro declaraciones dadas).

3. **Camioneta (2026-05-26, `orsi/2026-05-26-consultado-prensa-sobre-descuento-usd-25`).** La
   nota original dice "en rueda de prensa", sin más detalle de dónde. Descarté que fuera la del
   Consejo de Ministros de ese martes: hay un video de YouTube con título casi idéntico ("Rueda de
   prensa posterior al Consejo de Ministros y Ministras - 26 de mayo",
   `https://www.youtube.com/watch?v=xCVsYo3y6kY`) que efectivamente transcribí con Whisper, pero
   es de **La Moncloa (España)**, no de Presidencia Uruguay — coincidencia de título y fecha,
   contenido totalmente ajeno (transporte en Madrid, viaje real). Revisé además dos videos
   genéricos del canal de Presidencia Uruguay (`r4GYkSFB_jM`, `aS0pSWHs7KI`) sin poder confirmarles
   fecha, y dos gacetillas de Consejo de Ministros en gub.uy que resultaron ser de otras fechas
   (11/08/2026 y 20/04/2026). **No encontrada** dentro del esfuerzo razonable para este encargo.

4. **Lazo/Cardama (2026-08-25, `orsi/2026-08-25-respaldo-publicamente-ministra-defensa-nacional-sandra`).**
   Montevideo Portal ubica la declaración en un acto en Florida por el 201.º aniversario de la
   Declaratoria de la Independencia (25 de agosto, feriado nacional), "en rueda de prensa,
   consignada por Telemundo (Canal 12)". Encontré la gacetilla oficial del acto
   (`https://www.gub.uy/presidencia/comunicacion/noticias/201-aniversario-declaratoria-independencia-presidente-orsi-encabezo-acto`)
   y la revisé con WebFetch: cubre solo el acto protocolar (discurso de la ministra Etcheverry en
   representación del Poder Ejecutivo) y no menciona la consulta periodística posterior sobre
   Lazo/Cardama ni tiene video o audio embebido. Busqué también en teledoce.com (Canal 12) sin
   encontrar una nota propia sobre ese momento puntual. **No encontrada.**

Ninguna de las cuatro necesitó (ni generó) una copia en `declaraciones.yaml`: la única con
primaria ya la tenía antes de este encargo, y en las otras tres la primaria específica de esa
cita puntual no apareció pese a la búsqueda dirigida.

## resumen_vs_primaria

No aplica: en ningún caso encontré una primaria nueva que hablara sobre el mismo hecho con
variaciones respecto del resumen publicado (el único caso con primaria, Ancap, ya estaba conciliado
antes de este encargo).

## fuentes_el_pais_encontradas (sitemap, fuera del formato estándar de notas)

`elpais.com.uy` no aparecía en el corpus antes de esta corrida en ninguno de estos cuatro temas.
Corrí `pnpm descubrir elpais.com.uy` para los cuatro (ver `consultas.jsonl`) y encontré dos notas
que sí sirven, ya leídas con `pnpm fuente` y ya usadas en `dato_real` de los chequeos:

- Ancap: `https://elpais.com.uy/negocios/empresas/ancap-tuvo-en-2024-las-mayores-perdidas-desde-2015-con-us-118-4-millones-que-estuvo-detras`
  (02/04/2025) — reporta el balance auditado por Grant Thornton con el mismo desglose que el
  documento oficial de Ancap.
- Camioneta: `https://elpais.com.uy/informacion/politica/descuento-de-us-25-000-a-camioneta-de-orsi-compra-esta-ajustada-al-codigo-de-etica-publica-dice-jorge-diaz`
  (28/05/2026) — declaraciones del prosecretario de Presidencia, Jorge Díaz.

El País es del grupo `scheck-aguirre`, distinto de `montevideo-comm` (Montevideo Portal) y de
`editora-caras-y-caretas` (Caras y Caretas). No agregué estas notas a `declaraciones.yaml` porque
el brief limita ese archivo a copias con **primaria** encontrada, y esto no es una primaria: es
prensa adicional. Lo señalo porque, si el editor lo decide, el hallazgo de camioneta en particular
podría ser relevante para el `_faltante: segunda_fuente` que hoy tiene ese registro en `content/`
(las dos fuentes actuales, Montevideo Portal y Caras y Caretas, están anotadas por el crítico
como esencialmente la misma nota de agencia repetida). Para IVA busqué en el mismo rango de fechas
del debate y solo aparecieron páginas de fotos del debate en sí (mismo problema que el punto 2 de
arriba: es el debate, no la rueda de prensa del día siguiente). Para Lazo/Cardama no apareció
ninguna nota de El País específica sobre la rueda de prensa del 25/08/2026.

## medios_faltantes

- `ancap` — ANCAP (Administración Nacional de Combustibles, Alcohol y Pórtland). Ente autónomo
  del Estado uruguayo. `grupo: estado-uruguayo`, `alineamiento: estatal`. Usado como fuente
  `documento_oficial` en los dos chequeos de Ancap (estados contables, presentación de
  resultados).
- `miem` — Ministerio de Industria, Energía y Minería. `grupo: estado-uruguayo`,
  `alineamiento: estatal`. Usado para la gacetilla oficial del 25/04/2025 sobre el balance de
  Ancap.

(Verifiqué antes de anotarlos: `ls content/medios/` no tiene `ancap.yaml` ni `miem.yaml`; sí
existen `jutep.yaml`, `presidencia.yaml`, `impo.yaml`, `ambito.yaml`, `el-pais.yaml`, que usé sin
problema.)

## candidatos_giro

Ninguno dentro del alcance de este encargo (cuatro declaraciones puntuales, sin comparación entre
sí ni contra otras declaraciones de Orsi, que el brief pide no investigar).

## hipotesis

- **Ancap, resultado 2019 (USD 39 M vs. USD 41 M).** Dos fuentes oficiales del propio Estado
  uruguayo dan cifras distintas para el mismo ejercicio: Presidencia (27/02/2020, gestión
  saliente del Frente Amplio) dijo "39 millones de dólares" de "resultado operativo"; Orsi
  (25/04/2025) dijo "41 millones de dólares de ganancia", reproducido sin chequeo adicional en la
  gacetilla del MIEM. Los estados contables auditados de Ancap para 2019 solo están en pesos
  uruguayos ($ 1.464.281.136 individual / $ 1.513.044.719 consolidado); no encontré, en esos
  documentos, una conversión oficial a dólares que zanje cuál de las dos cifras en dólares es más
  precisa, ni el tipo de cambio exacto que cada comunicado usó. Podría deberse a
  individual-vs-consolidado, cierre-vs-promedio, u operativo-vs-neto; no alcanza para afirmar cuál
  es la correcta, solo para documentar que ambas son oficiales y no coinciden.
- **Camioneta, cifras de USD 78.990 / USD 54.000 / USD 25.000.** Estas tres cifras aparecen
  citadas de forma idéntica en Montevideo Portal y Caras y Caretas, ambas atribuyéndolas a "un
  informe divulgado esta semana por Así Nos Va (Radio Carve)". Leí el artículo de Radio Carve más
  cercano en fecha (25/05/2026, "El auto del Presidente Orsi y las inconsistencias en su
  declaración jurada") y **no contiene esas tres cifras**: se concentra en otro ángulo (de dónde
  salió la diferencia patrimonial entre 2024 y 2025). Es posible que "Así Nos Va" sea un segmento
  radial (audio) distinto del artículo escrito, no transcripto ni publicado como nota propia en
  radiocarve.uy. No encontré ese audio para transcribirlo con `pnpm transcribir` (no tengo URL
  puntual). Las tres cifras quedan, para esta corrida, como `reportado` de cadena de citas
  (Radio Carve → Montevideo Portal/Caras y Caretas/El País), no como dato confirmado en un
  documento propio de Radio Carve ni en una factura pública.
- **Precio de lista Hyundai Santa Fe híbrida (USD 78.990).** No encontré una lista de precios
  oficial del importador (Oliva Automotores / Hyundai Uruguay) con fecha de febrero de 2025 que
  confirme ese valor de forma independiente de la cadena de citas de prensa.

## casos_vistos

- `https://radiocarve.uy/el-auto-del-presidente-orsi-y-las-inconsistencias-en-su-declaracion-jurada/`
  — investigación periodística sobre el origen de fondos para la camioneta y presuntas
  inconsistencias entre las declaraciones juradas de Orsi de 2024 y 2025; no investigado.
- `https://www.elpais.com.uy/informacion/politica/diputado-colorado-realizo-pedido-de-informes-acerca-del-vehiculo-que-llevo-a-orsi-en-su-desfile-de-asuncion`
  — pedido de informes parlamentario (diputado Felipe Schipani) sobre el vehículo usado en la
  asunción presidencial y su vínculo con el mismo concesionario; no investigado.
- Titular de Infobae (02/06/2026) menciona que "la junta anticorrupción lo va a investigar" en
  relación con el descuento de la camioneta; no verifiqué esa nota en detalle ni identifiqué el
  estado del expediente. URL: `https://www.infobae.com/america/america-latina/2026/06/01/orsi-consiguio-un-descuento-de-usd-25000-para-comprar-una-camioneta-y-la-junta-anticorrupcion-lo-va-a-investigar/`
  (no abierta con `pnpm fuente` en esta sesión, solo vista en snippet de búsqueda).
- `https://www.elpais.com.uy/informacion/politica/con-nuevos-elementos-el-gobierno-presenta-demanda-civil-contra-cardama-y-reclama-us-35-millones-por-fraude`
  — demanda civil del Estado contra el astillero Cardama por fraude (caso distinto de la denuncia
  contra la ministra Lazo); no investigado, no abierto en esta sesión.

## verificacion_manual

- La investigación de "Así Nos Va" (Radio Carve) con las cifras de USD 78.990/54.000/25.000 de la
  camioneta: no encontré la pieza (¿segmento de audio, no transcripto?) como URL abrible. Si es
  audio de radio en vivo, requeriría `pnpm transcribir` una vez identificada la URL puntual; no la
  tengo. Marcado como pendiente, no como fallo de `pnpm fuente` (no llegué a intentar abrir nada
  porque no tengo la URL).
- `busqueda.com.uy` (semanario Búsqueda) es la fuente original citada por El Observador para la
  autorización del MEF a Ancap por USD 200 millones; no intenté `pnpm fuente` sobre el artículo de
  Búsqueda porque el sitio tiene paywall conocido y el dato ya está corroborado por El Observador
  (prensa) y por la propia gacetilla del MIEM (oficial, aunque esta última reproduce la cifra del
  propio Orsi sin verificación independiente).

## cobertura_del_periodo

Este encargo no pide cobertura de un período completo de mandato, sino cuatro hechos puntuales.
Quedan cubiertos, cada uno con su contexto:

- 2019 (dato histórico citado por Orsi, dentro de la declaración de abril 2025): resultados
  financieros de Ancap, vía estados contables auditados y comunicados oficiales de la época.
- 2020-03 a 2020-05: decreto que redujo el descuento de IVA por tarjeta de débito (gobierno de
  Lacalle Pou), como contexto oficial del reclamo de Orsi de noviembre de 2024.
- 2024-11 (campaña, balotaje): declaración sobre el IVA. Contexto = candidato, no gobierno.
- 2025-04 (gobierno, primeras semanas): declaración sobre Ancap. Contexto = presidente.
- 2025-06: declaración jurada de bienes de Orsi ante la Jutep (fuente para el chequeo de la
  camioneta).
- 2026-05 (gobierno): declaración sobre el descuento de la camioneta. Contexto = presidente.
- 2026-08 (gobierno): declaración sobre el respaldo a la ministra Lazo. Contexto = presidente.

No hay contexto de "oposición" porque Orsi no tuvo paso por el Parlamento nacional como opositor
antes de esta presidencia (fue intendente de Canelones y luego candidato); las cuatro declaraciones
cubren campaña y gobierno, no oposición legislativa. No se cubrió 2021-2023 (intendencia) porque
ninguna de las cuatro declaraciones asignadas cae en ese período.

## objeciones_al_brief

Ninguna. El brief se presenta explícitamente como la mitad simétrica de un mismo criterio
aplicado también a Lacalle Pou en la corrida gemela (`2026-09-07-lacalle-pou-veracimetro`), y no
pide nada que trate a Orsi de forma distinta de como se trataría a cualquier otro político con el
mismo tipo de declaración. No encontré nada asimétrico que objetar.

## nota aparte: "100 %" de la declaración sobre la ministra Lazo

La cuarta fila de la tabla del brief pide decidir si "100 %" en *"el respaldo a la ministra es
absoluto, es 100%"* es un dato concreto o una figura retórica. Es retórica: no remite a ninguna
magnitud medible (no es un resultado electoral, una encuesta, una proporción de votos ni ningún
otro universo cuantificable) — es un intensificador de "respaldo absoluto/total", equivalente a
decir "completamente". No hay un "dato oficial" contra el cual cotejar cuán "100 %" es un respaldo
personal declarado por quien lo da. Por eso no generé un registro en `chequeos.yaml` para esta
declaración.
