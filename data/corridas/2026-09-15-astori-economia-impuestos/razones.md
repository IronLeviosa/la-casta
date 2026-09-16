# Razones de edición — 2026-09-15-astori-economia-impuestos

Nota de índices: `critica.md` numera sobre las 14 declaraciones del lote original; después de la
corrección del 2026-09-16 el archivo tiene 20. Abajo uso el índice **actual** (0 a 19) y, entre
paréntesis, el índice que usaba `critica.md` cuando corresponde a un registro preexistente.

## Cambios de fondo

- `declaraciones[1]` (crítica `[1]`, bloquea, cita_fuera_de_contexto): la `cita` era la bajada del
  periodista, no palabras de Astori. Reemplazada por la cita textual contigua de la nota ("Si ese es
  el concepto de ajuste fiscal..."); `resumen` reescrito para reflejar la definición de "ajuste
  fiscal" que da el propio Astori y la salvedad de que quienes tienen más capacidad pagarían más.
  Sigue `probable` (`_faltante: segunda_fuente`, entrevista propia de El Observador).
- `promesas[0]` (crítica `promesas[0]`, bloquea, cita_fuera_de_contexto): mismo problema de origen
  que arriba, agravado porque la promesa combinaba dos componentes (no ajuste fiscal + bajar carga
  tributaria media). `texto` reescrito para no exceder lo que la cita real respalda, con la salvedad
  de que quienes tienen mayor capacidad pagarían más. No se dividió en dos registros como pide
  `promesas.md` para promesas compuestas porque `pnpm lote fijar` no permite crear filas nuevas en
  un array (comprobado empíricamente: falla con "Índice fuera de rango" tanto en `chequeos` como en
  `promesas`); en su lugar, `fundamentacion` trata los dos componentes por separado. `estado:
  incumplida` (el ajuste de 2016 incluyó una carga impositiva creciente, el propio rasgo que Astori
  usó en 2014 para definir "ajuste fiscal", y no se halló evidencia de una baja de la carga
  tributaria media).
- `declaraciones[10]` (crítica `[7]`, bloquea, un_solo_grupo) y `declaraciones[11]` (crítica `[8]`,
  bloquea, un_solo_grupo): ambas citaban solo la crónica de El País cuando la versión taquigráfica
  del 4/8/2016 ya estaba abierta en el mismo lote (usada en `declaraciones[8]` y `[9]`). Subidas a
  `nivel: textual` con la versión taquigráfica como fuente primaria; la nota de El País pasa a
  cobertura con `literalidad` (`difiere` en `[10]`, `condensada` en `[11]`, con `contexto` agregado)
  y `verificada_en`. `declaraciones[11]` además incorpora el 15% que la crónica omitía (afecta
  también a `chequeos[3]`, ver abajo). Las dos pasan a `publicado`.
- `declaraciones[8]` (crítica `[6]`, corregir, contexto_omitido): cita extendida hasta "no hubo
  intención de mala fe, en absoluto" (misma oración, contigua en el diario de sesiones). Pasa a
  `publicado`.
- `promesas[2]` (crítica `promesas[2]`, corregir, asimetria): `origen` tenía el mismo problema de
  fuente única que `declaraciones[10]` (misma cita) — se lo actualizó igual, a `nivel: textual` con
  primaria + cobertura (`literalidad: difiere`, `verificada_en`). Se buscaron activamente hechos en
  contra para 2016-2019 y no aparecieron; en cambio se hallaron cinco reafirmaciones a favor ya
  presentes en el lote (`declaraciones[13]`, `[14]`, `[15]`, `[16]`, `[17]`) que no estaban cargadas
  como evidencia de esta promesa. `estado` pasa de sin definir a `cumplida`, con la salvedad expresa
  en `fundamentacion` de que no se revisó ley por ley y decreto por decreto de todo el período.
- `declaraciones[6]` (crítica `[5]`, corregir, cita_fuera_de_contexto): cita extendida hasta el
  final de la oración (incluye los montos "$33.401 y $50.100" en boca de Astori, antes solo estaban
  en la bajada del diario); `resumen` reescrito para atribuir el "15% al 18%" a El País y no a
  Astori.
- `declaraciones[2]` (crítica `[2]`, corregir, cita_fuera_de_contexto): cita ampliada con la
  oración siguiente de la misma gacetilla (133.000 beneficiados, 93% de ingresos menores a
  $50.000, ya contigua en la fuente); `resumen` agrega el financiamiento (reinstalación del Impuesto
  de Primaria) que la objeción pedía. Se mantiene `nivel: textual` (documento oficial de Presidencia,
  redactado en tercera persona pero primario según `declaraciones.md`); se deja constancia en
  `notas_internas` de que no se transcribió el audio de la conferencia por no tener acceso a `pnpm
  transcribir` en este rol.
- `declaraciones[14]` (crítica `[10]`, corregir, contexto_omitido) y `declaraciones[15]` (crítica
  `[11]`, corregir, riesgo_legal): resúmenes reescritos para no sobreafirmar. En `[14]` se recupera
  el matiz de que Vázquez había dejado abierta la puerta a subir la carga tributaria sin afectar a
  la clase media. En `[15]`, `titulo` y `resumen` se acotan a lo que Astori dijo en rueda de prensa
  (espacio fiscal cero) y "no subirán los impuestos" queda atribuido a El País ("según supo"), no a
  Astori.
- `declaraciones[19]` (crítica `[13]`, corregir, riesgo_legal): "recordó" → "afirmó" en el resumen
  (recordar presupone que el hecho es cierto).
- `chequeos[0]` (corregir, presentacion): `afirmacion` era una promesa ("el gobierno se proponía...
  al 20%"), lo que `chequeos.md` prohíbe explícitamente, y duplicaba `promesas[1]`. Reformulada como
  dato verificable ("la reducción... se concretó") con `calificacion: falso` (el Texto Ordenado
  sigue en 22%). Se eliminó la fuente duplicada en `dato_real.fuentes` (misma URL citada dos veces)
  y se corrigió `fecha` de la fuente del BCU de `2026-09-15` (fecha de lectura) a `2006-12-27`
  (Ley 18.083, según el propio `dato_real.valor` ya redactado). Pasa a `publicado`.
- `promesas[1]`: mismo error de fecha (`2026-09-15` → `2006-12-27`) en la fuente del BCU, por el
  mismo motivo. `estado: incumplida` (el resultado es verificable — nunca bajó a 20% — aunque no se
  pudo evaluar si la condición legal de la baja llegó a cumplirse).
- `chequeos[1]`, `[2]`, `[3]`, `[4]` (corregir, documento_previsible): se agregaron `analisis` (que
  faltaba en los cinco chequeos del lote) y se avanzó lo posible en `dato_real` — `[2]` y `[3]` ya
  habían sido mejorados por un corrector anterior con documento oficial/diario de sesiones; a `[3]`
  se le sumó el 15% que faltaba (afecta `fragmento` y `afirmacion`, en línea con el arreglo de
  `declaraciones[11]`). Ninguno de los cuatro llega a `verdadero`/`impreciso`/`falso` porque lo que
  falta es un documento independiente (DGI, BPS o MEF) que confirme el número por fuera de la propia
  declaración de Astori; quedan `discutible` y `probable`, con el motivo puntual en
  `revision.notas_internas` de cada uno.
- `declaraciones[18]` (crítica `[12]`, corregir, documento_previsible): no se pudo cargar el chequeo
  nuevo que pide la objeción porque `pnpm lote fijar` no admite agregar filas a `chequeos.yaml` (ver
  arriba). Se dejó documentado en `notas.md` bajo `## chequeos_pendientes`, con el Decreto 97/020 ya
  identificado (confirma el mecanismo y los puntos de partida de los dos descuentos de IVA que cita
  Astori) y lo que falta puntualmente (la redacción sustituida de los artículos 1 y 2, no incluida
  en la copia del corpus).
- `giros.yaml` (nuevo): tres giros. (1) `no-ajuste-fiscal-2015-incumplimiento-2016`
  (`declaraciones[4]` → `[8]`, `cambio_total`, `reconocido_explicitamente`, con la explicación de la
  crisis de Brasil/Argentina de `declaraciones[9]` como `evidencia_explicacion`); el `analisis` deja
  escrita la lectura alternativa que pedía la crítica de `declaraciones[3]` (aviso,
  explicacion_alternativa): que las promesas de 2015 hablaban de la carga sobre "la producción" y la
  suba de 2016 fue sobre rentas personales, y por qué no cambia la conclusión (el propio Astori no
  usó esa distinción al reconocer el incumplimiento). (2) `suba-irpf-franja-33401-defendida-y-revertida`
  (`declaraciones[6]` → `[7]`, `cambio_parcial`, `justificado_por_contexto`, la negociación con
  legisladores del FA documentada en el propio comunicado de Presidencia). (3)
  `no-nueva-suba-impuestos-2016-2019` (`declaraciones[10]` → `[17]`, `sin_cambio`).

## Cambios de forma

- Título y resumen de `declaraciones[11]` reformulados para incluir el 15% agregado a la cita.
- `chequeos.yaml` y `promesas.yaml` tenían comentarios `#` de encabezado que se perdieron al
  reescribir el archivo con `pnpm lote fijar` (aviso propio de la herramienta, no evitable desde
  este rol).
- Se retiraron o vaciaron los campos `evidencias_candidatas` de las tres promesas después de migrar
  su contenido a `evidencias` (nombre que exige el rol de editor); no hay forma de eliminar una
  clave por completo con `pnpm lote fijar`, así que quedaron como `evidencias_candidatas: []` en vez
  de desaparecer del todo.
- `_faltante: segunda_fuente` de `declaraciones[10]`, `[11]` y `promesas[2]` puesto en `null` (no se
  puede borrar la clave) al resolverse la objeción de fuente única.

## Simetría

Chequeo de umbral parejo: el mismo estándar "discutible sin documento independiente" se aplicó a
las cifras que Astori da sobre su propia gestión (`chequeos[1]`, `[2]`, `[3]`) y a la que da sobre el
gobierno de Lacalle Pou (`chequeos[4]`, los US$100 millones); ninguna de las cuatro se calificó
`verdadero` ni `falso` solo por venir de un lado o del otro. Las correcciones de atribución
(`declaraciones[15]`, `[19]`) se aplicaron igual cuando Astori hablaba de su propio gobierno y
cuando hablaba del de Lacalle Pou. No se encontró una asimetría que corregir.

## Validación

`pnpm validar --inbox ... --red --breve`: primera corrida, 2 errores de esquema (`contexto` faltante
en una cita `condensada` de `declaraciones[11]`, `verificada_en` faltante en una cita `difiere` de
`promesas[2].origen`); corregidos los dos. Segunda corrida: esquema OK, 1 error de referencia
(`chequeos[2].fragmento` ya no calzaba con el `resumen` de `declaraciones[6]` después de reescribirlo)
y 5 avisos sin detalle (`--breve` no los imprime). Se corrigió el error de `fragmento` sin una
tercera corrida (tope de dos corridas ya usado); queda sin confirmar por el validador y los 5 avisos
quedan sin ver. Recomendado para el corrector: correr `pnpm validar --inbox
inbox/astori/economia/impuestos/2026-09-15 --red` (sin `--breve`) como primer paso.

## Segunda pasada (2026-09-16) — seis declaraciones nuevas y dos objeciones que `agregar` ya permite resolver

### Cambios de fondo

- `declaraciones[20]`–`[25]` (los seis diarios de sesiones 1990-2001 que trajo el corrector):
  revisadas una por una contra el texto primario con `pnpm fuente --buscar` (no las había visto el
  crítico). Las seis son `textual` con `diario_de_sesiones`, sin `_faltante`: pasan a `publicado`.
  - `declaraciones[21]` (`apoyo-estimulos-tributarios-sociedades-anonimas-1992`): `titulo` decía "para
    dinamizar la Bolsa de Valores", pero esa frase la dijo **otro** senador (Abreu) elogiando la
    intervención de Astori, no Astori mismo; su propia cita solo habla de "estimular la inversión
    productiva". Título corregido para no atribuirle a Astori palabras de un tercero.
  - `declaraciones[22]` (`pide-reforma-integral-sistema-tributario-1993`): la cita traía un
    tramo con una falla de OCR del PDF de archive.org ("ellénnino" por "el término", confirmado
    releyendo la fuente) y una constancia de trámite sin interés para el lector. Recortada al tramo
    limpio y sustancial ("Quisiéramos que algún día el país abordara..."), contiguo y ya verificado
    contra la fuente; no se inventó ni reconstruyó texto, solo se acortó desde el inicio.
  - `declaraciones[20]`, `[23]`, `[24]`, `[25]`: releídas contra la fuente primaria por el mismo
    motivo (patrón de citas fuera de contexto ya detectado en este lote); título, resumen y cita
    coinciden con lo que dice la sesión. Sin cambios de contenido.
- `giros[3]` (nuevo, `reforma-tributaria-integral-1993-2005`): candidato de consistencia que señaló
  `notas.md` — `declaraciones[22]` (1993, oposición, "quisiéramos que algún día el país abordara, en
  conjunto, el sistema tributario vigente") y `astori/2005-11-07-reforma-tributaria-iva-veinte-por-ciento`
  (2005, ya ministro, presenta el borrador de la reforma tributaria integral). `cambio: sin_cambio`,
  `explicacion: sin_explicacion` (no hay contradicción que explicar, es continuidad). `publicado`.
- `promesas[0]` dividida en dos, como pedía la objeción `promesas[0]` (bloquea, cita_fuera_de_contexto)
  y como exige `promesas.md` para promesas compuestas — antes no se podía por la limitación de
  `pnpm lote fijar`, ahora sí con `pnpm lote agregar --copia-de`:
  - `no-ajuste-fiscal-2014` (índice 0): solo el compromiso de no ajuste fiscal, con la definición que
    el propio Astori dio (contención de gasto + carga impositiva creciente). `estado: incumplida`
    sostenido en que el propio Astori, en 2016, llamó "ajuste" y "corrección fiscal" al paquete y
    reconoció que "el anuncio no se cumplió" — evidencia directa, no inferencia del editor.
  - `bajar-carga-tributaria-media-2014` (índice 3, nuevo): el compromiso de bajar la carga tributaria
    media, con la salvedad de que quienes tienen mayor capacidad pagarían más. La suba de IRPF/IASS de
    2016 recayó justamente sobre esa franja de mayor capacidad, así que se recalificó esa evidencia de
    `en_contra` a `neutral` (es consistente con la propia salvedad de la promesa, no la contradice).
    `estado: incumplida` por ausencia de evidencia de cumplimiento (no se encontró una serie oficial de
    presión tributaria u otra medida agregada para 2014 contra 2019-2020), no por una medición directa;
    queda dicho así en `fundamentacion` y `notas_internas` para que un resolvedor sepa qué falta.
- `chequeos[5]` (nuevo, `descuento-iva-debito-y-gastronomia-2020`): el chequeo pendiente sobre
  `declaraciones[18]` (`aumento-oculto-impuestos-iva-debito-2020`) que `notas.md` dejó anotado bajo
  `## chequeos_pendientes` con su `donde_buscar` porque `pnpm lote fijar` no admitía crear filas.
  Se leyó el Decreto 97/020 y, siguiendo su propio texto, el 537/005 (gastronomía/turismo) y el
  203/014 (débito) vigentes. Resultado mixto, no forzado a un solo veredicto:
  - El tramo gastronómico (9 a 5 puntos) queda confirmado por el propio texto legal vigente:
    `calificacion` para ese componente sería `verdadero` si fuera un chequeo aparte.
  - El tramo de débito (2 puntos) es más débil: el artículo que fija esa rebaja general (art. 1 de
    203/014) sigue vigente sin cambios; lo que el Decreto 97/020 modificó ahí fue una fórmula de
    cálculo específica para casas de apuestas (art. 1 BIS) y derogó por completo otro artículo (el 2°)
    cuyo contenido ya no se puede leer en IMPO por estar derogado.
  - Como es un solo chequeo (una sola `afirmacion`, un solo `fragmento` contiguo de la cita original),
    `calificacion: discutible` en conjunto, con el desglose completo en `dato_real.valor` y `analisis`
    y el detalle de qué falta (una captura de Wayback o el Diario Oficial de 2014 anteriores a la
    derogación) en `revision.notas_internas`. `tier: probable`. Esto es un avance real sobre "sin
    chequeo": se resolvió la mitad con documento oficial en vez de dejarlo todo en `discutible` por
    no haber buscado (`documento_previsible`).

### Cambios de forma

- Párrafos de más de 80 palabras partidos en dos o más, sin tocar el contenido: `chequeos[4].analisis`
  (el segundo párrafo, 93 palabras), `giros[0].analisis` (los dos párrafos, 124 y 119 palabras),
  `giros[1].analisis` (el primer párrafo, 89 palabras), `giros[2].analisis` (el primer párrafo, 123
  palabras).
- `notas.md`, `## para_el_lector`: corregido un error de historia política ("al asumir **el primer
  gobierno post dictadura** de Lacalle Herrera" — el primer gobierno post dictadura fue el de
  Sanguinetti en 1985; el de Lacalle Herrera, en 1990, fue el segundo). El resto del párrafo ya
  reflejaba correctamente las seis declaraciones de 1990-2001 (lo había actualizado el corrector al
  cargarlas); no hizo falta reescribirlo entero.
- `notas.md`, `## chequeos_pendientes`: marcado como resuelto el ítem del Decreto 97/020 (ver
  `chequeos[5]` arriba); el otro ítem pendiente (el 80%/70% de la recaudación de 2016) sigue abierto,
  sin tocar.

### Simetría (segunda pasada)

Las seis declaraciones nuevas se revisaron con el mismo criterio que ya se había aplicado al resto
del lote en la pasada anterior (releer contra la fuente primaria toda cita corta o con un título que
afirmara algo no visible en el resumen), no con un criterio más laxo por ser texto antiguo y de
archive.org: así se encontró el error de atribución en `declaraciones[21]` y el artefacto de OCR en
`declaraciones[22]`. El chequeo nuevo (`chequeos[5]`) se calificó con la misma regla dura que
`chequeos[1]`-`[4]` (sin documento independiente no pasa de `discutible`), pese a que la mitad
gastronómica sí tenía documento oficial completo: no se subió a `verdadero` parcial ni se infló la
calificación por tener "más" evidencia que los otros cuatro.

### Validación (segunda pasada)

`pnpm validar --inbox inbox/astori/economia/impuestos/2026-09-15 --red --breve`: dos corridas
idénticas, `0 error(es)`, `esquema/referencias/tiers/presentacion/duplicados/fuentes/citas/simetria:
ok`. 26 avisos del lote, ninguno nuevo de fondo:
- "solo un grupo de medios" en `declaraciones[1,6,12-19]`, `chequeos[2,4,5]`, `promesas[0,2,3]`: es
  exactamente por lo que esos registros están en `tier: probable`; no es un error a corregir, es el
  validador documentando la razón.
- "URL citada que no figura en consultas.jsonl": `chequeos[1]` (154-2015) y `chequeos[4]` (97-2020)
  ya estaban así antes de esta pasada (no se tocó `dato_real.fuentes` de ninguno de los dos); las
  URL de `medios.yaml#0` tampoco las tocó esta pasada. Las tres URL nuevas de `chequeos[5]`
  (97-2020, 537-2005, 203-2014) sí se leyeron con `pnpm fuente` en esta sesión —la lectura completa
  de cada una, con la cita exacta que terminó en el registro, está en la transcripción de esta
  corrida— pero `pnpm fuente` invocado directamente por el editor (sin un `brief` de corrida activo)
  no las agregó a `consultas.jsonl` de este directorio. Es un límite de esa bitácora para llamadas
  del editor, no una cita sin lectura: no se fabricó la línea de `consultas.jsonl` a mano porque esa
  bitácora se completa mecánicamente y no le corresponde a este rol escribirla. Queda para el
  corrector o para quien ajuste la herramienta.
- `chequeos[1]` "serie sin gráfico": preexistente, no se tocó `chequeos[1]` en esta pasada.

## Corrector de citas (2026-09-16) — promesas[2] `no-modificar-mas-el-sistema-impositivo-2016` tras la promoción

- El registro había quedado en `revision.tier: publicado` (con `estado: cumplida`) pese a que sus 4
  evidencias en nivel `reportado` (2017-02-21 caras-y-caretas/editora-caras-y-caretas; 2017-03-23
  el-observador/werthein-hochbaum; 2018-05-24 el-pais/scheck-aguirre; 2019-05-30
  el-pais/scheck-aguirre) tienen una sola fuente y un solo grupo de medios cada una; la validación
  sobre `content/` después de `pnpm promover` lo marcó como error porque la regla de dos grupos se
  aplica por evidencia, no solo por registro. Esto coincide con lo que ya señalaba la "Validación
  (segunda pasada)" de arriba (el "solo un grupo de medios" de `promesas[0,2,3]` documentado como
  motivo de `tier: probable`); el tier volvió a `publicado` en algún paso posterior no documentado en
  este archivo. Se buscó una segunda fuente de otro grupo para cada una de las 4 evidencias
  (`corpus:buscar` y web) y no apareció cobertura verificable de la misma declaración en esa fecha
  concreta; los candidatos hallados (Subrayado, 2018-05-28, tras Consejo de Ministros; Presidencia,
  2018-08-28, tras comparecencia en Comisión de Hacienda del Senado) son declaraciones distintas, en
  fechas distintas, y no se usaron como cita. `revision.tier` bajado de `publicado` a `probable`, con
  el detalle en `revision.notas_internas`, tal como prevé la regla cuando falta una segunda fuente.

## Corrector de presentación (2026-09-16) — narración de proceso en tres chequeos

- `chequeos[1]` (`irpf-65000-trabajadores-133000-beneficiados`), `chequeos[2]`
  (`irpf-suba-15-a-18-franja-33401-50100`) y `chequeos[3]` (`irpf-iass-2016-17-por-ciento-pagara-mas`):
  el texto que ve el lector en `dato_real.valor` narraba el propio trabajo de investigación ("no se
  localizó, dentro del tiempo de esta corrida...", "no está en el corpus", "en el tiempo disponible").
  Reescrito el último párrafo de cada uno para decir lo mismo en términos del hecho — no hay, hasta
  donde se pudo establecer, un documento independiente de la DGI o el BPS (ni, en `chequeos[1]`, un
  registro equivalente en el diario de sesiones) que confirme las cifras — sin mencionar la corrida,
  el corpus ni el tiempo disponible para la búsqueda. No cambia el contenido sustantivo (sigue
  faltando el mismo documento) ni ninguna fuente ni cita; cambio de forma, no de fondo.
