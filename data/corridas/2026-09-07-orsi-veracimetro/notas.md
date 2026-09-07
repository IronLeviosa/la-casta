# Notas — orsi/veracimetro/2026-09-07

**Nota de sesión (segunda pasada, corrige el lote original a partir de `critica.md`):** las cuatro
secciones que siguen conservan el texto de la primera pasada tal cual, salvo donde se indica
explícitamente un cambio ("Actualización" o "Resuelto en esta sesión"), para que quede visible qué
se corrigió y por qué.

## registro_primario

Por cada una de las cuatro declaraciones, esto es lo que se buscó y se encontró (o no) como
registro primario, siguiendo el punto 4 de las instrucciones y la "precedencia de la primaria"
del brief.

1. **ANCAP (2025-04-25, `orsi/2025-04-25-orsi-informo-ancap-volvio-tener-resultados`).**
   Ya tiene primaria: el registro publicado ya está en `nivel: textual` con
   `https://www.youtube.com/watch?v=8_HQMDpzEYA` (conferencia de prensa completa, Presidencia,
   25/04/2025) como fuente de tipo `video`. Abrí el video con `pnpm fuente` en esta sesión y el
   texto transcripto coincide palabra por palabra con la `cita` ya publicada. El brief da por
   sentado que las cuatro están en `reportado`, pero esta ya no lo está; lo señalo para que quede
   explícito.

   **Actualización (segunda pasada, por `critica.md`):** el enunciado anterior de este punto decía
   "no hace falta agregar una copia en `declaraciones.yaml`". Eso cambió: la crítica encontró que la
   propia cita primaria contiene un dato falso no chequeado ("volvemos después de 10 años a tener
   números negativos", cuando el balance auditado muestra pérdida en 2020) y que el `titulo` y el
   `resumen` publicados repiten "diez años" en voz propia del sitio. Por eso agrego en
   `declaraciones.yaml` una copia del registro (`_slug: orsi-informo-ancap-volvio-tener-resultados`)
   sin tocar `titulo` ni `resumen`, y un chequeo nuevo en `chequeos.yaml` para ese dato. Ver
   `## resumen_vs_primaria` abajo.

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

Salvo la actualización del punto 1, ninguna de las cuatro generó una copia en `declaraciones.yaml`:
en las otras tres la primaria específica de esa cita puntual no apareció pese a la búsqueda
dirigida.

## resumen_vs_primaria

**Ancap, "volvemos después de 10 años a tener números negativos" (2025-04-25).** Resuelto en esta
sesión, a partir del punto 1 de "Objeciones al lote" de `critica.md`.

- **Qué dice el video (primaria, marca_tiempo 70):** "Lo primero que tenemos para decir es que
  volvemos después de 10 años a tener números negativos en el balance de la empresa ANCAP." La
  misma frase, en los mismos términos, está en la nota de Subrayado que ya es fuente del registro
  publicado.
- **Qué dicen los balances auditados** (leídos en esta sesión, `pnpm fuente`): los Estados
  Financieros Individuales y Consolidados de Ancap al 31/12/2020 registran resultado del ejercicio
  negativo ($ 510.662.282 de pérdida individual; $ 457.129.828 consolidado). Los Estados
  Financieros Individuales de 2024 muestran que 2023 cerró con ganancia ($ 3.329.544.346). Es
  decir: el último ejercicio negativo antes de 2024 fue 2020 (cuatro años antes, no diez), y el
  último ejercicio positivo antes de 2024 fue apenas el año anterior (2023). El País, citando el
  mismo balance auditado, agrega que 2015 también fue negativo (pérdida de US$ 198 millones) y que
  hubo "tres años consecutivos de ganancias" antes de la pérdida de 2020 (US$ 12 millones) y otros
  tres antes de la de 2024. El propio expresidente de Ancap del gobierno anterior, Alejandro
  Stipanicic, señaló en su respuesta a Orsi que además fue necesaria una capitalización en 2015.
  Ninguna fuente oficial ni de prensa relevada sostiene una racha de diez años sin resultados
  negativos.
- **Qué afirma hoy el `resumen` y el `titulo` publicados en `content/`:** el `titulo` dice "Ancap
  volvió a números negativos **tras diez años**..." y el `resumen` dice "...volvió a tener
  resultados negativos **después de diez años**...". Ambos repiten, en voz propia del sitio (no
  entre comillas, no atribuidos a Orsi como cita), el dato que el balance auditado contradice.

Agrego en `chequeos.yaml` un chequeo nuevo para este dato (dato_real con los estados contables de
2020 y 2024, más el contraste de prensa/oposición) y una copia del registro en
`declaraciones.yaml` (`_slug: orsi-informo-ancap-volvio-tener-resultados`), sin tocar `titulo` ni
`resumen`: eso lo ajusta el editor, idealmente en el mismo movimiento en que se aplique el chequeo,
para que `titulo`, `resumen` y el `fragmento` de los dos chequeos de Ancap queden consistentes
entre sí (aviso ya señalado por la crítica).

Para las otras tres declaraciones, sigue sin aplicar: no encontré una primaria nueva que hablara
del mismo hecho con variaciones respecto del resumen publicado.

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
prensa adicional. Para IVA busqué en el mismo rango de fechas del debate y solo aparecieron
páginas de fotos del debate en sí (mismo problema que el punto 2 de arriba: es el debate, no la
rueda de prensa del día siguiente). Para Lazo/Cardama no apareció ninguna nota de El País
específica sobre la rueda de prensa del 25/08/2026.

**Corrección (segunda pasada, por `critica.md` punto 3.g — es el hallazgo más importante de toda
la crítica y anulo acá la sugerencia anterior):** esta sección decía antes que, "si el editor lo
decide, el hallazgo de camioneta en particular podría ser relevante para el `_faltante:
segunda_fuente` que hoy tiene ese registro en `content/`", refiriéndose a la nota de El País del
28/05/2026. **Eso es incorrecto y lo retiro.** Volví a leer la nota completa con `pnpm fuente` en
esta sesión: no contiene la cita del registro publicado ("Cuando usted vea la factura, ahí va a
decir qué precio es") ni ninguna otra frase de Orsi de esa rueda de prensa; cubre exclusivamente
la respuesta del prosecretario Jorge Díaz ("cuando Yamandú Orsi hizo esa compra no era
funcionario") y el pedido de informes del diputado Felipe Schipani. Usarla como segunda fuente de
esa declaración pasaría la validación mecánica (cada fuente valida su propia `cita`, y la de Díaz
o Schipani no es la que hay que validar) pero le daría al registro un segundo grupo de medios con
una fuente que no respalda lo que el registro dice que Orsi dijo. La nota de El País sigue siendo
útil, pero para otro hecho (la respuesta de Presidencia), y ya está incorporada así en
`dato_real` del chequeo de la camioneta en `chequeos.yaml`, no como segunda fuente de la
declaración.

## medios_faltantes

- `ancap` — ANCAP (Administración Nacional de Combustibles, Alcohol y Pórtland). Ente autónomo
  del Estado uruguayo. `grupo: estado-uruguayo`, `alineamiento: estatal`. Usado como fuente
  `documento_oficial` en los dos chequeos de Ancap (estados contables, presentación de
  resultados).
- `miem` — Ministerio de Industria, Energía y Minería. `grupo: estado-uruguayo`,
  `alineamiento: estatal`. Usado para la gacetilla oficial del 25/04/2025 sobre el balance de
  Ancap.

(Verifiqué antes de anotarlos: `ls content/medios/` no tiene `ancap.yaml` ni `miem.yaml`; sí
existen `jutep.yaml`, `presidencia.yaml`, `impo.yaml`, `ambito.yaml`, `el-pais.yaml`,
`teledoce.yaml`, que usé sin problema. Siguen faltando en esta segunda pasada: no me corresponde
crearlos, los crea el editor.)

## candidatos_giro

Ninguno dentro del alcance de este encargo (cuatro declaraciones puntuales, sin comparación entre
sí ni contra otras declaraciones de Orsi, que el brief pide no investigar).

## hipotesis

- ~~**Ancap, resultado 2019 (USD 39 M vs. USD 41 M).**~~ **Resuelta en esta sesión, por
  `critica.md` punto 0.a — no era una hipótesis.** Releí el PDF de los Estados Financieros
  Individuales de 2019 y de 2024 buscando específicamente la tabla de tipos de cambio, que ya
  estaba en el documento que el chequeo citaba y no se había leído hasta el final: ambos años
  publican, en la misma nota de moneda extranjera, una tasa "promedio" y una de "cierre". El
  resultado de 2019 ($ 1.464.281.136) convertido al cierre (37,31) da USD 39,2 millones —la cifra
  de Presidencia, feb-2020— y convertido al promedio (35,15) da USD 41,7 millones —la cifra de
  Orsi, abr-2025—. No son dos comunicados oficiales que se contradicen: es el mismo resultado
  auditado bajo dos convenciones que la propia Ancap publica en el mismo documento. Corregido en
  `chequeos.yaml` (el chequeo de las cifras 41/118), que además aplica una sola convención —la de
  cierre— para comparar 2019 con 2024: +USD 39,2 millones (2019) contra −USD 118,4 millones
  (2024).
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

  **Actualización (segunda pasada):** encontré una corroboración indirecta, no de las tres cifras
  en sí, sino de que la declaración jurada es consistente con ellas. $ 78.990 (valor de lista,
  según prensa) × 43 (tipo de cambio) = $ 3.396.570, que es exactamente el "valor actual" que
  Orsi declaró ante la Jutep para esa camioneta. Un tipo de cambio de 43 es plausible para
  comienzos de 2025 (el cierre de 2024 documentado por Ancap fue 44,066). Esto corrobora que Orsi
  declaró el vehículo a precio de lista, no a precio de compra, pero sigue sin ser un documento
  independiente que contenga las cifras de 54.000 o 25.000. No cambia la conclusión de este punto;
  se usa como contexto en `dato_real`, no como el dato oficial que falta.
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
  (no abierta con `pnpm fuente` en esta sesión ni en la anterior, solo vista en snippet de
  búsqueda; sigue sin abrirse en esta segunda pasada porque el encargo de hoy no pide investigar
  el caso).
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

- 2015 y 2020 (datos históricos de Ancap, agregados en esta segunda pasada para chequear "10
  años"): resultados financieros negativos documentados por estados contables auditados y, para
  2015, por prensa que cita el mismo balance.
- 2019 (dato histórico citado por Orsi, dentro de la declaración de abril 2025): resultados
  financieros de Ancap, vía estados contables auditados y comunicados oficiales de la época.
- 2020-03 a 2020-05: decreto que redujo el descuento de IVA por tarjeta de débito (gobierno de
  Lacalle Pou), como contexto oficial del reclamo de Orsi de noviembre de 2024.
- 2021 a 2023 (dato histórico de Ancap, vía prensa que cita el balance auditado): tres años
  consecutivos de resultado positivo antes de la pérdida de 2024.
- 2024-11 (campaña, balotaje): declaración sobre el IVA. Contexto = candidato, no gobierno.
- 2025-04 (gobierno, primeras semanas): declaración sobre Ancap. Contexto = presidente.
- 2025-06: declaración jurada de bienes de Orsi ante la Jutep (fuente para el chequeo de la
  camioneta).
- 2026-05 (gobierno): declaración sobre el descuento de la camioneta. Contexto = presidente.
- 2026-08 (gobierno): declaración sobre el respaldo a la ministra Lazo. Contexto = presidente.

No hay contexto de "oposición" porque Orsi no tuvo paso por el Parlamento nacional como opositor
antes de esta presidencia (fue intendente de Canelones y luego candidato); las cuatro declaraciones
cubren campaña y gobierno, no oposición legislativa. No se cubrió 2016-2018 ni 2021-2023 en detalle
(más allá de la caracterización de prensa como "años de ganancia") porque ninguna de las cuatro
declaraciones asignadas requiere el detalle ejercicio por ejercicio de esos años, solo saber que no
fueron negativos.

## objeciones_al_brief

Ninguna. El brief se presenta explícitamente como la mitad simétrica de un mismo criterio
aplicado también a Lacalle Pou en la corrida gemela (`2026-09-07-lacalle-pou-veracimetro`), y no
pide nada que trate a Orsi de forma distinta de como se trataría a cualquier otro político con el
mismo tipo de declaración. No encontré nada asimétrico que objetar.

**Nota de la segunda pasada:** la crítica (`critica.md`, "Objeciones al brief") sí encuentra dos
asimetrías operativas entre el brief de Orsi y el de Lacalle Pou (la cláusula sobre "dato concreto
o figura retórica" solo en el de Orsi, y la lista cerrada de datos del brief de Orsi que dejó
afuera el dato falso de "10 años"). Son objeciones al diseño del brief, no correcciones que me
correspondan a mí en esta pasada de `inbox/` (no reescribo briefs); las dejo señaladas acá para
que quien edite los briefs las vea, y las cuatro cosas que sí me correspondían de esta segunda
pasada están resueltas arriba.

## nota aparte: "100 %" de la declaración sobre la ministra Lazo

La cuarta fila de la tabla del brief pide decidir si "100 %" en *"el respaldo a la ministra es
absoluto, es 100%"* es un dato concreto o una figura retórica. Es retórica: no remite a ninguna
magnitud medible (no es un resultado electoral, una encuesta, una proporción de votos ni ningún
otro universo cuantificable) — es un intensificador de "respaldo absoluto/total", equivalente a
decir "completamente". No hay un "dato oficial" contra el cual cotejar cuán "100 %" es un respaldo
personal declarado por quien lo da. Por eso no generé un registro en `chequeos.yaml` para esta
declaración. La crítica coincide con esta decisión.
