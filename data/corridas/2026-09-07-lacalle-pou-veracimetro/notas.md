# Notas — lacalle-pou / veracimetro / 2026-09-07

## segunda_pasada (2026-09-07, corrige el lote original según critica.md)

Encontré el audio oficial completo del discurso del 2 de marzo de 2023
(`medios.presidencia.gub.uy/tav_portal/2023/noticias/AK_502/AK_502.mp3`, 1h05m39s, transcripción
propia con Whisper large-v3-turbo: 41.154 caracteres, sin cortes). Eso resuelve las tres tareas de
esta pasada:

1. **El audio confirma que Lacalle Pou dijo, él mismo, tanto el 75% como los US$150 millones.** La
   conclusión de la primera pasada ("150 millones no está en el discurso") quedó refutada: no era
   que no lo dijera, era que la transcripción de El Observador que usé como sustituto de la
   primaria está cortada exactamente en ese tramo (ver `## resumen_vs_primaria`). Reescribí
   `chequeos[2]` para atribuir la cifra directamente a Lacalle Pou (antes decía "Presidencia
   informó") y subí su `evidencia` a primaria propia.
2. **Reemplacé las dos citas cosidas de `info-rebaja-impuestos.pdf`** (similitud 0,72 y 0,61) por
   citas limpias y contiguas del anexo técnico (`Documento-2-marzo-anexo.pdf`), que resultó tener
   en prosa corrida —y ya parcialmente citado en el lote— los tres componentes que la infografía
   daba desordenados por columnas: IRPF USD80M, IASS USD30M y mipymes USD40M, cada uno en una
   oración propia y citable. Saqué `info-rebaja-impuestos.pdf` como fuente de `dato_real` en los
   dos chequeos; no hacía falta forzarla si el mismo paquete de documentos tenía una versión legible.
3. **Corregí lo demás que marcaba la crítica en cada chequeo** (afirmación con período impuesto en
   `chequeos[0]`, contexto omitido de la promesa de US$900M y del desglose 670/940/640,
   `medio: parlamento` → `mef` en `Mef 12-07-21.pdf`, distinción "alcanza" vs "beneficia" en el 75%,
   composición 80+30+40 en vez de "IRPF+IASS" en los 150 millones, fecha de envío del proyecto sin
   fuente citable). Detalle de cada uno más abajo, y en `chequeos.yaml` mismo.

Resultado de `pnpm validar --red --inbox inbox/lacalle-pou/veracimetro/2026-09-07 --solo citas`:
**0 errores, 20/20 citas exactas (similitud 1.00)**. `pnpm validar --inbox ...` (sin `--red`) da
0 errores de esquema y solo los 3 `medio: mef` esperados (`dato_real.fuentes` de `chequeos[0]`),
que quedan en `medios_faltantes` para que los cree el editor, como pide el encargo.

Corro en Sonnet (`claude-sonnet-5`), igual que la primera pasada.

## registro_primario

**2021-07-28 (US$600 millones de ahorro).** Sin cambios respecto de la primera pasada: sigue sin
encontrarse un video íntegro utilizable de la entrevista en LN+ (programa "Más Realidad", Jonatan
Viale). No repetí esa búsqueda en esta pasada porque no era parte del encargo; el detalle completo
queda en la hipótesis correspondiente, más abajo. La declaración queda en `reportado`, con tres
fuentes de tres grupos distintos (la-diaria, el-observador, el-pais), que ya cumplía la regla antes
de esta pasada.

**2023-03-02 (75% contribuyentes IRPF / US$150 millones renuncia fiscal) — hallazgo de esta
pasada.** Encontré el audio oficial completo:

- Landing page: `https://www.gub.uy/presidencia/comunicacion/audios/completos/mensaje-del-presidente-republica-ante-asamblea-general-0`
  (nótese el sufijo `-0`: Presidencia reutiliza el título "Mensaje del presidente de la República
  ante la Asamblea General" cada año y Drupal le va agregando sufijos por separado — el de 2022 no
  tiene sufijo, el de 2023 es `-0`, el de 2024 es `-1`; no todo sufijo sigue un orden cronológico
  obvio, hubo que verificar cada uno). La URL exacta del audio dado en el encargo
  (`.../discurso-del-presidente-luis-lacalle-pou-ante-asamblea-general`, sin sufijo) resultó ser la
  del discurso de **2021**, no la de 2023 — mismo hallazgo que ya había reportado la crítica sobre
  esa URL. La encontré recorriendo el HTML crudo de la noticia del 2 de marzo (donde `pnpm fuente`
  no trae el enlace entre los adjuntos, tal como avisaba el encargo) hasta dar con el link real a
  `mensaje-del-presidente-republica-ante-asamblea-general-0`.
- Archivo: `https://medios.presidencia.gub.uy/tav_portal/2023/noticias/AK_502/AK_502.mp3` (mismo
  directorio `AK_502` que ya tenían los dos PDF usados en la primera pasada — buena señal de que es
  el material correcto).
- Transcribí con `pnpm fuente <mp3> --indice --politico lacalle-pou --tema economia/impuestos` y
  después `--buscar`: Whisper large-v3-turbo, 2.984 segmentos, 41.154 caracteres, sin truncar (el
  primer segmento es el saludo protocolar "Señora Presidente de la Asamblea General," que a la
  transcripción de El Observador le faltaba, y el texto sigue bastante más allá del punto donde El
  Observador se corta — ver `## resumen_vs_primaria`).
- El pasaje sobre impuestos (baja de impuestos → deducciones IRPF → 75%/14% → IASS → mipymes →
  150 millones) es un tramo continuo entre los caracteres 36.705 y 39.137 de esa transcripción.
  Confirma, con las palabras de Lacalle Pou:
  - "grandes esfuerzos" (no "los mayores esfuerzos", que es la fusión de la gacetilla — ver abajo).
  - "beneficiar el 75% de los contribuyentes... 14%... 63.000 uruguayos" (verbo "beneficiar", no
    "alcanzar", que es la palabra que usó la gacetilla).
  - "toda la renuncia fiscal entre personas y empresas significan 150 millones de dólares" — **sí
    lo dijo él**, contra lo que había concluido la primera pasada.
- El Diario de Sesiones de la Asamblea General del 02/03/2023 sigue sin ser accesible en esta
  pasada (no lo volví a intentar; el problema que reportó la primera pasada —el buscador de
  Parlamento solo lista sesiones desde 2025 para ese tipo de documento— no tiene que ver con el
  audio, así que no hacía falta resolverlo para esta tarea).

**Nota sobre la fecha de envío del proyecto de ley (150 millones).** La primera pasada había puesto
"el proyecto de ley enviado por el Poder Ejecutivo el 2 de marzo de 2023" sin una fuente citable
para esa fecha exacta (salió de una página de `ccea.com.uy` leída con WebFetch, correctamente
marcada como no citable en `consultas.jsonl`, pero la fecha quedó igual en el texto). La saqué y la
reemplacé por un dato que sí tiene cita: la versión taquigráfica de la Comisión de Hacienda de
Diputados del 15/03/2023 registra que el proyecto (ya modificado por el Senado) "se votó ayer por
la mañana en la Comisión del Senado... y, por la tarde, en la Cámara de Senadores", es decir el
14/03/2023. La fecha exacta en que el Poder Ejecutivo lo remitió originalmente al Parlamento sigue
sin una fuente citable en este expediente; lo dejo dicho así en `dato_real.valor` en vez de afirmar
una fecha sin sustento.

## resumen_vs_primaria

**"75% de los contribuyentes"**: confirmado en el audio, con la misma palabra que ya traía la
transcripción de El Observador ("beneficiar/beneficiará"), no con la de la gacetilla
("alcanzarán"). El anexo técnico oficial (`Documento-2-marzo-anexo.pdf`) usa efectivamente
"alcanzan" para el 75% y reserva "significativamente beneficiados" para un 47% más chico — es
decir, el propio Lacalle Pou en el discurso comprimió esa distinción técnica al hablar. No hay
discrepancia entre lo dicho y el `resumen` publicado en cuanto al número; sí hay, si se quiere ser
preciso, una distinción entre "alcanza" y "beneficia" que documento en `chequeos[1].dato_real.valor`.

**"renuncia fiscal de US$150 millones"**: la primera pasada concluyó que esto **no** estaba en el
discurso, basada en que no aparecía en la transcripción de El Observador (26.114 caracteres). Esa
conclusión era razonable con el material que tenía disponible, pero **resultó incorrecta**: el
audio oficial completo (41.154 caracteres, sin cortes) sí trae la frase, en el mismo tramo donde
la transcripción de El Observador se corta. Comparación exacta:

| El Observador (incompleto en este tramo) | Audio oficial (Whisper, completo) |
|---|---|
| el archivo termina en "...Empresas que son el corazón del motor económico del país." (carácter 26.114, el último) | sigue: "...del motor económico de nuestro país **toda la renuncia fiscal entre personas y empresas significan 150 millones de dólares** y en lo personal estoy convencido de que..." |

Es decir: la transcripción de El Observador no es "el discurso completo" como titula la nota — se
corta exactamente en el punto donde iba la cifra que buscábamos. La ausencia en ese archivo era el
borde del archivo, no evidencia de que no se haya dicho (esto es lo que la crítica ya había
señalado como la objeción más importante del lote, y se confirma). Corregí `chequeos[2]` para
atribuir la cifra a Lacalle Pou directamente, con el audio como evidencia primaria y
`nivel: textual`.

**Hallazgo adicional (no pedido, lo dejo para el crítico/editor):** además de las dos citas
cosidas de la gacetilla ya identificadas por la crítica ("grandes esfuerzos"→"los mayores
esfuerzos"; el pasaje de "menos días de clase"), encontré una **tercera** en el mismo documento,
sobre la frase que sigue inmediatamente a los 150 millones:

| Gacetilla de Presidencia | Audio oficial |
|---|---|
| «Estoy convencido de que se generará un proceso virtuoso de mayor consumo y dinamismo económico» | "estoy convencido de que además de los directamente beneficiados que superan los 80.000 que no van a pagar más los otros beneficiados parcialmente se va a generar un proceso virtuoso que es un proceso de mayor consumo y por ende de más dinamismo económico" |

La gacetilla presenta como cita textual entre comillas una versión abreviada que omite la cláusula
intermedia sobre los "80.000" y los "beneficiados parcialmente". No lo agrego a ningún registro de
este lote (no estaba en el encargo y el criterio de discrepancias es del crítico, no mío); lo dejo
señalado porque es la tercera instancia del mismo patrón en la misma gacetilla, y la corrección
propuesta por la crítica sobre `2023-03-02-baja-impuestos-irpf-iass` quizás quiera considerarlo
también al decidir qué tan literal tratar a esa fuente en general.

## medios_faltantes

- **mef** — Ministerio de Economía y Finanzas. `url: https://www.gub.uy/ministerio-economia-finanzas/`.
  Propuesto `grupo: estado-uruguayo`, `alineamiento: estatal` (mismo criterio que `presidencia` y
  `parlamento`). Usado en `chequeos.yaml#0.dato_real.fuentes` en tres entradas: la presentación del
  08/02/2021, la noticia oficial del 08/02/2021, y (nuevo en esta pasada, corrigiendo la
  atribución) `Mef 12-07-21.pdf` — antes declarado `medio: parlamento`, pero es una presentación
  del Poder Ejecutivo (MEF) ante la Comisión de Presupuestos, alojada en el sitio de Diputados; el
  autor es el MEF, no la Cámara, así que corresponde `mef` y no `parlamento` (el `tipo` sigue
  siendo `documento_oficial`, no `diario_de_sesiones`, porque no es una versión taquigráfica de
  la sesión sino el material que trajo la delegación del Ejecutivo).
- Nota sobre `parlamento`, sin cambios respecto de la primera pasada: sigue usado para documentos
  de `diputados.gub.uy` cuyo autor es el propio cuerpo legislativo (la versión taquigráfica de la
  Comisión de Hacienda, ahora con `tipo: diario_de_sesiones` en vez de `documento_oficial` —
  corrección de esta pasada, porque eso es exactamente lo que es: una versión taquigráfica de una
  sesión de comisión, no un documento administrativo genérico).

## candidatos_giro

Ninguno. El encargo se limita a chequear datos dentro de dos declaraciones ya publicadas y
puntuales; no relevé el resto de la trayectoria del político en este tema en esta corrida (ver
`## cobertura_del_periodo`).

## hipotesis

- **Resuelta en esta pasada:** la hipótesis de que "150 millones" no correspondía a algo dicho por
  Lacalle Pou (abierta en la primera pasada, con `notas.md` afirmando el hecho negativo) quedó
  descartada: el audio oficial completo confirma que sí lo dijo. Ver `## resumen_vs_primaria`.
- **Sigue abierta:** la cifra de "US$600 millones" (2021-07-28) podría estar tomada de memoria del
  propio Lacalle Pou sobre la cifra de US$660 millones que el MEF había difundido en febrero de
  2021 para el ejercicio 2020 (660 > 600, y el margen "más de" es compatible), pero no hay forma de
  confirmar que sea *esa* la cifra que tenía en mente y no una actualizada para 2021 que no se haya
  encontrado, ni si "más de 600" se refiere al mismo agregado (Gobierno Central-BPS + resto del
  sector público) o a otra cosa. Tampoco hay una fuente oficial que trate "durante la pandemia"
  (2020 y 2021 juntos) como un período único de medición. No profundicé más en esta pasada:
  no era parte del encargo.
- **Sigue abierta:** el clip de VTV Noticias en YouTube (`pXlsC5BsOQk`) tiene un título que promete
  el pasaje de ahorro pero el contenido no corresponde (ver primera pasada). No reintenté en
  esta pasada.
- **Sigue abierta:** la comparación "75% de los contribuyentes" carece de un padrón público de la
  DGI (Asesoría Económica, contribuyentes de IRPF Categoría II) que permita recalcular el
  porcentaje de forma independiente del propio Poder Ejecutivo. El chequeo lo deja escrito en
  `dato_real.valor`, con el organismo que haría falta consultar, pero no lo consulté en esta
  pasada (el encargo pedía corregir citas y contexto, no salir a buscar el padrón).
- **Nueva, menor:** la fecha exacta en que el Poder Ejecutivo remitió originalmente el proyecto de
  ley de IRPF/IASS al Parlamento no tiene, hasta donde relevé, una fuente citable. Sí está
  documentado que el Senado (que lo modificó) lo votó el 14/03/2023. Si en el futuro se necesita la
  fecha exacta de envío, el camino más directo es la carátula de la Carpeta 3399/2023 en
  `parlamento.gub.uy` — no encontré la ficha exacta de ese trámite en esta pasada (probé
  `ficha-asunto/103178`, que resultó ser un expediente distinto de 2010).

## casos_vistos

Ninguno.

## verificacion_manual

- `https://www.elpais.com.uy/lacalle-sobre-irpf` — sin cambios respecto de la primera pasada:
  `pnpm fuente` devuelve solo 116 caracteres (el pie de página); no reintenté en esta pasada
  porque no hacía falta para las tres tareas del encargo.

## cobertura_del_periodo

Sin cambios en el alcance respecto de la primera pasada (encargo puntual, no relevamiento completo
del tema). Lo que cambió es la calidad de la fuente primaria disponible para el evento del
2023-03-02: antes dependía de la transcripción de un medio privado (El Observador, incompleta en
el tramo final) más una gacetilla oficial; ahora hay, además, la transcripción propia del audio
oficial completo (41.154 caracteres, sin cortes, con marcas de tiempo), que cubre desde el saludo
protocolar hasta bien entrado el anuncio de mipymes.

## objeciones_al_brief

Sin cambios respecto de la primera pasada: no encontré ninguna instrucción del brief que pidiera
asimetría por partido, ideología o persona. Leí también las "Objeciones al brief" que escribió la
crítica (la cláusula "decidí vos si es un dato concreto o una figura retórica" que está en el brief
de Orsi y no en el de Lacalle Pou): es una observación sobre el diseño del brief, no algo que se
resuelva en un registro de este lote, y la crítica ya la documentó con el detalle y la corrección
sugerida (misma cláusula, mismo texto, en los dos briefs). No tengo nada que agregar a eso en esta
pasada.

## chequeos_pendientes

(Agregado por el editor al calibrar el lote — ver "Objeciones al lote", punto 5, de critica.md.)

- declaracion: lacalle-pou/2021-07-28-tercamente-no-vamos-poner-impuestos
  fragmento: 'se "subió el IVA" y se aumentaron las tarifas'
  afirmacion: >-
    En el resumen publicado de esta declaración, la senadora Liliam Kechichian (FA) respondió que
    durante el período 2020-2021 "se subió el IVA" y se aumentaron las tarifas públicas. Es un dato
    concreto (cambios en la tasa de IVA y en tarifas públicas), tan chequeable como los que ya se
    chequearon en este lote, pero dicho por una tercera persona y no por el político del expediente;
    no se chequeó en esta corrida porque el criterio del brief se limitó a los datos que afirma
    Lacalle Pou. Aplicado de forma sistemática, ese criterio produce un Veracímetro que solo califica
    a quien gobierna y nunca a quien lo critica, en cualquier gobierno (crítica, "Objeciones al lote",
    punto 5). Se deja acá para aplicar el mismo criterio a todos los políticos, no para señalar este
    registro en particular.
  donde_buscar: >-
    IMPO/DGI para la tasa de IVA vigente en 2020-2021 y las rebajas transitorias del IVA dictadas
    durante la emergencia sanitaria; INE (IPC) y URSEA/OPP para la evolución de tarifas públicas frente
    a la inflación en el mismo período.
