# Crítica — lotes de patrimonio 2026-09-04 (Lacalle Pou y Orsi, juntos)

Modelo: claude-opus-5 (Opus 5)
Lotes: `inbox/lacalle-pou/patrimonio/2026-09-04/` e `inbox/orsi/patrimonio/2026-09-04/`
Registros revisados: 6 (4 + 2)
Notas de prensa leídas para `cobertura`: 8
Fecha de la crítica: 2026-09-04

Resumen de severidades: **6 bloquea** (2 por registro, 4 de lote), **12 corregir**
(4 por registro, 8 de lote), **2 aviso**, más **3 objeciones al brief y al proceso**.

**Recomendación de una línea: no publicar ninguno de los dos lotes hoy.** No por el contenido de
los registros —las cifras que revisé cierran— sino porque el modelo con el que se calculó el residuo
en los `notas.md` **no es el que va a correr en el sitio**, y el que sí va a correr produce, con estos
mismos registros, un residuo de **−94 % para Lacalle Pou** y **+96,7 % para Orsi**. Ese par de números
es exactamente el titular que el proyecto dice que no puede producir, y lo produciría el código, no
el investigador. Detalle en `L1`, `L2` y `L3`.

---

## Lo que verifiqué por mi cuenta antes de objetar

- Rehice el cálculo de las dos secciones "salto vs. explicable" desde cero. **Reproducen dentro de
  ±0,1 %** (las diferencias vienen de que el `notas.md` capitaliza el rendimiento y yo probé también
  interés simple). Las cifras de los `notas.md` no tienen errores aritméticos.
- Rehice la consulta SOAP al BCU (`cotizaciones.bcu.gub.uy/wscotizaciones/servlet/awsbcucotizaciones`,
  monedas 2230 y 9800, Grupo 2) para 2025-02-28 y obtuve **42,585 y 6,2494**, idénticos a los de la
  tabla de `orsi/notas.md`. El método de cotización está bien.
- Leí el texto de los cuatro formularios de la JUTEP en el corpus, el de 2024 y el de 2025 de Orsi
  completos, y los artículos 11, 11 BIS, 12, 13, 14 y 17 de la ley 17.060 (redacción de la ley
  19.797) en impo.com.uy.
- Corrí `src/lib/patrimonio.ts` con los seis registros tal cual están en el inbox.

---

## Objeciones por registro

### lacalle-pou/patrimonio.yaml#0 — 2020-05-26 — "TOTAL ACTIVO $/18.738.364,26"

- severidad: corregir
- tipo: riesgo_legal (procedencia) + contexto_omitido
- objecion:
  1. El registro es `nivel: textual`, pero **`pasivo` (3.221.027,40) y `neto` (15.517.336,86) no
     figuran en ninguna de sus dos `cita`s**. La cita de pasivo es un `SUBTOTAL DEUDAS HIPOTECARIAS
     O PRENDARIAS`; que ese subtotal sea igual al TOTAL PASIVO es una inferencia del investigador
     (correcta, pero inferencia) metida dentro de un registro `textual`. El `neto` es una resta.
     El propio `notas.md` lo reconoce en la tabla de la sección 3 ("No hay cita OCR literal").
  2. El OCR de esa misma página trae, en la línea inmediatamente anterior, `3231/027,40`, es decir
     una lectura alternativa del mismo número. Nadie puede reproducir la desambiguación sin la
     imagen.
  3. La `fecha` (2020-05-26) tampoco está en ninguna cita: se leyó a ojo del escaneo.
- cita_de_contexto: `"3.110.250,00                                                                  3231/027,40\nSUBTOTAL DEUDAS HIPOTECARIAS O PRENDARIAS a 3.221.027,40"` — OCR de la nota de corpus `c950467179b903cf35bab27764e1bdab9f248e72`, de https://www.gub.uy/junta-transparencia-etica-publica/sites/junta-transparencia-etica-publica/files/documentos/publicaciones/Presidente.pdf
- accion_sugerida: o bien (a) recortar la página 4 del PDF a un PNG, publicarlo en la corrida como
  evidencia auxiliar y dejar la lectura manuscrita transcrita en el registro con una nota de método,
  o bien (b) bajar los cuatro registros de Lacalle Pou a `probable`. La regla tiene que ser la misma
  para los seis: **ningún valor de un registro `textual` sin una cita que lo contenga**. Aplicado en
  serio, hoy la incumplen `lacalle-pou#0` (pasivo, neto, fecha), `#1` (neto, fecha), `#2` (pasivo,
  fecha), `#3` (fecha), `orsi#0` (fecha) y `orsi#1` (fecha).

### lacalle-pou/patrimonio.yaml#1 — 2022-03-21 — "SUBTOTAL OTROS BIENES $|0,00 … 19.755.118,29|"

- severidad: corregir
- tipo: contexto_omitido
- objecion: mismo defecto que `#0`: el `neto` (16.830.064,29) fue leído a ojo del escaneo
  ("le. E5%.04, 2" en el OCR) y no está en ninguna cita; la `fecha` tampoco. Además la cita de
  `activo` es un bloque de tres líneas donde el número quedó despegado de su etiqueta, lo que hace
  la verificación mecánica formalmente correcta pero humanamente frágil.
- cita_de_contexto: `notas.md` §3: "2022, PATRIMONIO NETO (manuscrito) | 'le. E5%.04, 2' | Leído en el escaneo: 16.830.064,29"
- accion_sugerida: igual que `#0`. Además, anotar en el registro la anomalía que el propio `notas.md`
  detectó y no cargó: la sección 2.2 (cónyuge) repite `TOTAL DE INGRESOS $ 573.798,00`, el mismo
  número del funcionario, con las filas vacías. No afecta al registro, pero es el tipo de dato que
  un lector adversarial va a encontrar y usar.

### lacalle-pou/patrimonio.yaml#2 — 2024-03-22 — "TOTAL ACTIVO $ 32.976.983,00"

- severidad: **bloquea**
- tipo: cita_fuera_de_contexto
- objecion: **la cita del pasivo dice un número distinto del que carga el registro.** El registro
  carga `pasivo: 9849366.84`; la única fuente que lo respalda cita literalmente
  `"TOTAL PASIVO $| 9. 849, 306, 84"` — trescientos seis, no trescientos sesenta y seis. Verifiqué
  el OCR completo de la nota de corpus: **`306` es la única aparición del número en todo el
  documento**; `366,84` no aparece nunca. El valor cargado es una reconstrucción hecha para que
  cierre `activo − pasivo = neto` contra un `neto` manuscrito que el OCR devolvió como
  `"223. 1.23 616 eE"`. Puede estar bien (32.976.983 − 23.127.616,16 = 9.849.366,84 exacto), pero
  hoy el registro **afirma como textual un número que su propia fuente contradice**, y el `notas.md`
  ni siquiera lista esta discrepancia en la tabla de la sección 3, donde sí lista otras cinco.
- cita_de_contexto: `"SUBTOTAL OTRAS DEUDAS $\n\nTOTAL PASIVO $| 9. 849, 306, 84\n\n- TOTAL ACTIVO $     TOTAL PASIVO $       PATRIMONIO NETO $\n(22 GHo 783      A. B19, 20D Y      223. 1.23 616  eE"` — OCR de `e716d33a6c9179874d69bc49e50f9d42a530e013`, de https://www.gub.uy/junta-transparencia-etica-publica/sites/junta-transparencia-etica-publica/files/documentos/publicaciones/Presidente%20Lacalle%20Pou%202024.pdf
- accion_sugerida: volver a la imagen de la página 4 a 300 dpi y decidir entre 306,84 y 366,84 con
  el recorte a la vista, adjuntando el recorte a la corrida. Hasta entonces el registro no puede ir
  a `content/` como `textual`. Si la lectura queda ambigua, va a `probable` con las dos lecturas
  declaradas (la diferencia es de 60 pesos y no mueve nada del análisis, pero mueve la credibilidad
  de todo el método OCR).
- objecion secundaria (ver `L2`): este es el único de los seis registros con `eventos_declarados` no
  vacío, y ese campo por sí solo cambia el residuo publicado de **+13,8 % a −94,0 %**.

### lacalle-pou/patrimonio.yaml#3 — 2025-03-11 — "TOTAL ACTIVO $ 34,315,219.80"

- severidad: corregir
- tipo: contexto_omitido
- objecion:
  1. **Es el único de los seis registros sin `archived_url`.** Save Page Now falló y quedó así. Un
     PDF de la JUTEP sin copia en Wayback es exactamente el tipo de fuente que puede desaparecer.
  2. `fecha: 2025-03-11` es la fecha manuscrita de firma. El art. 13 de la ley 17.060 dice que para
     la declaración de cese "deberá presentar una declaración final dentro de los treinta días
     posteriores a la fecha de cese, **tomándose esta como la fecha válida para la expresión
     patrimonial** de los bienes e ingresos". La fecha de cese fue el 2025-03-01. Con esa fecha
     (UI 6,2494 del 28/2, hábil anterior) el neto son 3.852.313 UI en vez de 3.839.718.
  3. Las citas de este registro incluyen bloques de ruido OCR largos (`"—— == ——. +. —— — — E ————— ——    ="`).
     Son literales y pasan el validador, pero no son legibles para un lector, y una cita ilegible no
     cumple la función de una cita.
- cita_de_contexto: art. 13, ley 17.060 (texto de la ley 19.797), https://www.impo.com.uy/bases/leyes/17060-1998/13
- accion_sugerida: correr `pnpm archivar`; recortar las citas a la línea útil; y ver `L5` para la
  decisión simétrica sobre qué fecha usar en los seis registros.

### orsi/patrimonio.yaml#0 — 2024-09-27 — "TOTAL ACTIVOS $U 6.057.000,00"

- severidad: corregir
- tipo: explicacion_alternativa + contexto_omitido
- objecion:
  1. **La `fecha` no está en la cita que la respalda.** La cita es
     `"Apellidos: ORSI MARTINEZ / Fecha entrega declaración: / Nombres: YAMANDU RAMON"` — y termina
     justo antes del valor. En el texto extraído, `27/09/2024` aparece cinco líneas después, tras
     `"Celular: E-mail:"`. La cita muestra la etiqueta del campo, no su contenido. Es el mismo
     defecto que le marco a Lacalle Pou en `#0`–`#3`.
  2. **Este registro es el que carga todo el peso del residuo de Orsi, y es el más frágil de los
     dos.** Tres cosas que el `notas.md` deja fuera y que son explicación alternativa de primer
     orden, no de última:
     - El formulario de 2024 tiene un rubro **"Otros bienes"** y ahí Orsi puso **"DECLARA NO
       POSEER"**. Ese es, según el escribano consultado por Búsqueda, el casillero donde debía ir
       "derechos hereditarios en la sucesión de Carmen Martínez". Es decir: **si hay algo que
       explicar, está en esta declaración de 2024, no en la de 2025.** El "salto" de +99,2 % no es
       necesariamente un aumento de patrimonio: puede ser la aparición en el papel de un bien que ya
       existía en septiembre de 2024 y que la línea base no recogió. Esas dos cosas se leen igual en
       el número y son muy distintas en lo que significan.
     - Todos los activos de 2024 están marcados `Tipo Activo: Ganancial` y al `100,00 %` de
       propiedad, mientras que la separación de bienes, según el entorno de Orsi citado por Infobae
       y Búsqueda, se tramitó entre 2022 y **abril de 2023** — o sea, año y medio antes de esta
       declaración. El art. 12.2 de la ley 17.060 dice que la síntesis incluye "su **cuota parte** en
       la sociedad conyugal". Cómo se clasificó y a qué porcentaje se valuó cambia la línea base, y
       no está resuelto.
     - La cónyuge declaró **cero en todo** en 2024 y una casa de $ 3.240.000 en 2025. Eso **descarta**
       la hipótesis "el bien estaba antes a nombre de la cónyuge" (no había nada a su nombre), pero
       de paso muestra que el agregado del hogar creció **más** que el del declarante: Búsqueda lo
       calcula en US$ 142.308 → US$ 372.824. Hay que decirlo, aunque empeore el número, porque es la
       medida más completa y porque descartar una alternativa a favor obliga a publicar el resultado
       de haberla probado.
- cita_de_contexto: `"Otros bienes\nDECLARA NO POSEER\nTOTAL OTROS BIENES $U 0,00\nTOTAL ACTIVOS $U 6.057.000,00"` (PDF JUTEP 2024, nota `5e342d44d97ff757a98818960967ee5987805a18`) y "Un escribano con experiencia en completar declaraciones juradas de la Jutep dijo a Búsqueda que Orsi debió escribir, en el apartado que dice 'otros bienes', una mención del estilo 'derechos hereditarios en la sucesión de Carmen Martínez' por un valor de 'x'." (Búsqueda 2025-06-05, https://www.busqueda.com.uy/politica/yamandu-orsi-duplica-patrimonio-herencia-y-declara-separacion-bienes-su-esposa-n5400608)
- accion_sugerida: cambiar la cita de `fecha` por una que contenga `27/09/2024`. Y reescribir la
  sección 6 de `orsi/notas.md` para que la lectura "el residuo puede ser un problema de la línea
  base de 2024 y no un aumento de 2025" aparezca **antes** que la mención de los USD 140.000, no
  después.

### orsi/patrimonio.yaml#1 — 2025-05-30 — "TOTAL ACTIVO $ 12,298,570.00 … Existe separacion de bienes gananciales"

- severidad: **bloquea**
- tipo: riesgo_legal + explicacion_alternativa
- objecion:
  1. **`fecha` sin ninguna evidencia dentro del registro.** El formulario no tiene fecha (verificado:
     los dos renglones están en blanco). El valor `2025-05-30` sale de una nota de Búsqueda que
     **no figura en `evidencia.fuentes`**: está en un campo `_fecha_origen` que no se publica y que
     el validador no mira. El registro, tal cual está, es `nivel: textual` con una sola fuente
     (el PDF) que no contiene el campo del que dependen las dos cotizaciones. Eso no puede ir a
     `content/`.
  2. **`activo` y `neto` (12.298.570) contienen un error que la propia JUTEP reconoció.** Los
     subtotales del formulario suman 11.751.570; la diferencia (547.000) es del orden del ingreso
     mensual declarado (547.704). Ver `L7` para qué hacer. Lo que **no** se puede hacer es publicar
     el residuo calculado solo con la cifra alta, que es la que lo maximiza.
  3. **"No figura declarada" no se puede afirmar, y hoy los `notas.md` lo afirman tres veces.** El
     art. 12 de la ley 17.060 divide la declaración jurada en **dos partes**: la 12.1 "detallada y
     **reservada**", que es la que exige "el **título de la última procedencia dominial** de cada
     uno de los bienes" —el casillero natural de una cesión de derechos hereditarios—, y la 12.2,
     "síntesis y **abierta**", que es la única que se publica y que por diseño solo lleva "los
     totales de su activo y pasivo patrimonial". El art. 14 C) agrega que la JUTEP abre "hasta un
     5 % … de las declaraciones juradas de carácter reservado". **Nadie fuera de la JUTEP puede
     saber si Orsi declaró o no la cesión.** Lo único verificable, y lo único que el sitio puede
     decir, es que *el formulario publicado no la muestra*.
  4. Riesgo legal concreto: el art. 17 numeral 2 de la misma ley tipifica como falta grave "el
     **ocultamiento** de ingresos o bienes que se hubieren incorporado al patrimonio". Cualquier
     frase que diga o sugiera "no lo declaró" mapea directo sobre esa norma en la cabeza del lector.
     Con el art. 336 CP a la vista, eso es real malicia si la fuente no lo respalda — y la fuente
     (Búsqueda) es explícitamente **"un allegado a Orsi"**, anónimo.
- cita_de_contexto: "12.1. La primera parte **reservada** contendrá los siguientes datos: A) Una
  relación precisa y circunstanciada de los bienes muebles e inmuebles … Se especificará el título
  de la última procedencia dominial de cada uno de los bienes" y "12.2. La segunda parte, denominada
  síntesis y **abierta** … contendrá … los totales de su activo y pasivo patrimonial" —
  https://www.impo.com.uy/bases/leyes/17060-1998/12
- accion_sugerida:
  - **Fecha**: agregar la nota de Búsqueda del 2025-06-05 como segunda `Fuente` (`tipo: nota`) del
    registro, con la cita "En el documento que entregó en la tarde del viernes 30 de mayo a la Junta
    de Transparencia y Ética Pública (Jutep), divulgada tres días después". Y anotar el hecho que
    corrobora esa fecha desde el documento mismo, y que ninguno de los dos `notas.md` vio: el art. 13
    dice que para una declaración inicial el plazo de treinta días "comenzará a computarse … una vez
    cumplidos sesenta días … desde la toma de posesión". El propio formulario dice "Fecha de ingreso
    al cargo 01/03/2025". 1/3 + 60 + 30 = **fin de mayo de 2025**. O sea que el 30 de mayo no es un
    dato suelto de prensa: **es exactamente el vencimiento del plazo legal calculado con un dato que
    sí está en el documento**. Eso convierte una sola nota de prensa en una nota de prensa
    consistente con la ley y con el formulario, que es una procedencia mucho más defendible.
    Sigue faltando el sello de entrada: pedirlo a la JUTEP por ley 18.381 (acceso a la información
    pública) es un trámite de un formulario y cierra el tema para siempre.
  - **No publicar ninguna afirmación sobre si el plazo se cumplió o no.** Según cómo se cuenten los
    sesenta días (inclusivo o no) el vencimiento cae el 29 o el 30 de mayo. La JUTEP dijo por escrito
    que el presidente "se encuentra al día en relación a su obligación legal". Un cálculo propio con
    un día de margen no alcanza para contradecir al organismo, y publicarlo sería precisamente el
    tipo de acusación que el proyecto no hace.
  - **Redacción**: reemplazar en todos lados "no está declarada / la declaración no la registra /
    no figura en ninguno de los dos formularios" por "**no aparece en la parte publicada de ninguno
    de los dos formularios; la parte detallada de la declaración (art. 12.1) es reservada por ley y
    no es pública**".

---

## Objeciones al lote (aplican a los dos por igual)

### L1 — El modelo de los `notas.md` no es el que corre en el sitio

- severidad: **bloquea**
- Corrí `src/lib/patrimonio.ts` con los seis registros tal cual están en el inbox. Resultado:

| Tramo | Residuo en `notas.md` | Residuo que publicaría el sitio hoy |
|---|---|---|
| LLP 2020→2022 | −1.013.928 a −885.642 | **−410.687** (−12,2 %) |
| LLP 2022→2024 | −217.991 a −76.268 | **−2.991.527** (−94,0 %) |
| LLP 2024→2025 | −453.011 a −390.298 | **−159.902** (−4,1 %) |
| Orsi 2024→2025 | +804.178 a +832.135 | **+939.209** (+96,7 %) |

  Ninguno coincide. Las tres causas son `L2`, `L3` y el hecho de que la biblioteca usa **solo el
  ingreso de la declaración anterior mantenido constante**, mientras los `notas.md` promedian los
  dos extremos; y que la banda publicada de la biblioteca es 15 %–45 % de ahorro con 1 %–5 % de
  rendimiento, no la banda "piso con IRPF / techo sin IRPF" de los `notas.md`. Hay dos modelos con
  el mismo nombre.
- accion_sugerida: decidir **uno**, escribirlo en `SUPUESTOS`, y que los `notas.md` de investigación
  reporten ese y no otro. Si el editor prefiere la fórmula de los `notas.md`, hay que cambiar
  `src/lib/patrimonio.ts` antes de promover, no después.

### L2 — `eventos_declarados` fabrica un residuo negativo enorme para un solo político

- severidad: **bloquea**
- `explicable()` suma `eventosUI` con su signo. El único evento de los seis registros es la venta de
  la casa de Lacalle Pou (20.515.000 UYU = 3.429.971 UI). Con ese campo, su tramo 2022→2024 pasa de
  **+438.444 UI (+13,8 %)** a **−2.991.527 UI (−94,0 %)**.
- El propio `lacalle-pou/notas.md` avisa que esto está mal: "una venta **no** es un ingreso neto, es
  cambiar un inmueble por dinero, así que sumarla entera a la banda explicable estaría mal". El aviso
  está en el `notas.md`; la biblioteca no lo sabe.
- Esto no es un bug neutro: **es un bug que beneficia sistemáticamente al político que declaró su
  evento y no toca al que no declaró ninguno.** Publicar hoy sería mostrar a un presidente con
  −94 % y al otro con +96,7 %, y la diferencia sería, en buena parte, un campo mal sumado.
- accion_sugerida: separar `TipoEventoPatrimonial` en eventos que **aportan** patrimonio (herencia,
  donación, revalúo) y eventos que solo lo **rotan** (venta, compra), y que estos últimos entren con
  monto 0 en `explicable` y se muestren aparte como anotación de la línea de tiempo. Alternativa
  mínima: que `venta` y `compra` no se sumen. Cualquiera de las dos, antes de promover.

### L3 — `ingresos` es mensual y el esquema y la biblioteca lo tratan como anual

- severidad: **bloquea**
- Los dos `notas.md` lo detectan y lo dejan marcado con `_ingresos_periodicidad: mensual`. Confirmo
  que tienen razón, y agrego el respaldo legal que no citan: el art. 12.2 de la ley 17.060 define la
  síntesis como "un resumen del **promedio mensual** de sus ingresos de los últimos doce meses".
  El campo es mensual por ley, no solo por el machote del formulario.
- Efecto: la biblioteca calcula `ahorro = ingresos × 0,8 × 0,3 × años` con la cifra mensual, o sea
  subestima el ahorro por un factor ~12 e **infla todos los residuos**. Para Orsi, el residuo pasa de
  +886.759 (con ingresos ×12) a **+939.209** (como está hoy).
- accion_sugerida: **corregir la descripción del esquema, no el dato.** `ingresos` es lo que el
  formulario declara: un ingreso mensual líquido. Que la biblioteca multiplique por 12 al calcular
  el ahorro, con la fórmula visible en el sitio. Anualizar en el registro sería inventar un dato.

### L4 — El IRPF se descuenta dos veces

- severidad: corregir
- El formulario pide "Sueldos líquidos (**deducidas las cargas legales**)". La biblioteca aplica
  además `(1 − 0,20)`. Es simétrico (afecta a los dos igual) pero está mal, y encoge la banda
  explicable un 20 % para todo el mundo, lo que empuja todos los residuos hacia arriba.
- accion_sugerida: sacar el factor IRPF de `explicable()` o renombrar el supuesto a algo que
  describa lo que hace (un colchón de gastos no salariales, por ejemplo) y justificarlo.

### L5 — La ventana temporal no es comparable, y el modelo depende de la ventana

- severidad: corregir
- La banda explicable crece con el tiempo; el salto no tiene por qué. Orsi se mide sobre **245 días**;
  Lacalle Pou sobre 664, 732, 354 y 1.750. La banda explicable como fracción del neto previo es
  **13,5 %–16,4 % para Orsi** y **51,9 %–61,1 % para Lacalle Pou en el mandato completo**. Aplicar el
  mismo modelo a ventanas tan distintas y comparar los residuos crudos no es la misma medición.
- La forma simétrica y robusta de decirlo, que además desactiva de un golpe el ataque "eligieron el
  30 % a propósito", es publicar la **tasa de ahorro de equilibrio**: la tasa de ahorro que haría el
  residuo exactamente cero. Es un número, no depende de la ventana, y se calcula igual para todos:

| Tramo | Tasa de ahorro que anula el residuo (con rendimiento 3 %) |
|---|---|
| LLP 2020 → 2022 | −17,4 % (imposible: el residuo es negativo con cualquier tasa ≥ 0) |
| **LLP 2022 → 2024** | **+20,8 %** ← se da vuelta por debajo del 21 % de ahorro |
| LLP 2024 → 2025 | −13,3 % |
| LLP 2020 → 2025 (mandato) | −0,8 % (con rendimiento 0 %: +9,1 %) |
| **Orsi 2024 → 2025 (total literal)** | **+202,6 %** |
| Orsi 2024 → 2025 (suma de subtotales) | +184,1 % |

- Lo que muestra esta tabla, y que hay que publicar tal cual: la conclusión de Orsi **no depende del
  supuesto** —haría falta que ahorrara el doble de lo que gana para explicar el salto; con el 100 %
  de ahorro el residuo sigue siendo +478.010 UI—; y la conclusión de Lacalle Pou en su tramo
  2022→2024 **sí depende del supuesto**: con una tasa de ahorro del 20 % en vez del 30 %, ese tramo
  da residuo positivo. Publicar "residuo negativo en los cuatro tramos" sin decir eso es
  presentar como robusto algo que no lo es.
- Sobre la pregunta de si el 30 % fijo perjudica a alguno: **no, y se puede mostrar.** Como fracción
  del patrimonio inicial, el ahorro que el modelo le concede por año es **9,4 % a Lacalle Pou y
  21,5 % a Orsi**. Si algo, la tasa fija es *generosa* con el de sueldo más bajo y *tacaña* con el de
  sueldo más alto (la propensión a ahorrar crece con el ingreso). Es decir: el supuesto no fabrica
  el residuo de Orsi; lo achica. Eso conviene decirlo en el sitio, con estos dos números.
- accion_sugerida: publicar la tasa de equilibrio junto a cada residuo; publicar el residuo también
  como % del neto previo; y no comparar residuos crudos de ventanas de largo distinto en la misma
  tabla sin la columna de días.

### L6 — Los dos lotes no miden el mismo objeto

- severidad: corregir
- Lacalle Pou: **presidente → presidente**, cuatro puntos, un mandato completo.
- Orsi: **candidato (art. 11 bis, siendo intendente) → presidente**, dos puntos, una ventana de ocho
  meses que contiene un cambio de cargo con triplicación de sueldo, una partición de bienes hecha
  "después del triunfo electoral" (Búsqueda) y una sucesión no abierta judicialmente.
- No existe hoy un tramo presidente→presidente de Orsi (el segundo llega en 2027, art. 13: "cada dos
  años contados a partir de la toma de posesión"), y busqué sin encontrar declaraciones de candidato
  de 2019 publicadas por la JUTEP —el art. 11 BIS lo creó la ley 19.797 el 13/9/2019, a semanas de la
  elección—, así que **tampoco existe el tramo candidato→presidente de Lacalle Pou** que sería su
  espejo.
- accion_sugerida: publicar los dos con la etiqueta de qué compara cada tramo, bien visible, y no
  poner el +99,2 % de Orsi y el +14,0 % de Lacalle Pou en la misma tabla como si fueran la misma
  medición. Si no se consigue una comparación simétrica, decir en la página que no la hay.

### L7 — El error aritmético de la declaración de 2025: cuál usar

- severidad: corregir
- Los dos candidatos: **11.751.570** (suma de los subtotales de activos declarados) y **12.298.570**
  (lo escrito en el casillero TOTAL ACTIVO y repetido en PATRIMONIO NETO).
- Lo que dice la fuente: la presidenta de la JUTEP, Ana Ferraris, por escrito, admitió que "el total
  del activo no coincidía con los bienes declarados" y que eso podía venir de que "se consideraron
  los ingresos como parte del activo": "Entendemos que resulta obviamente erróneo". O sea: **el
  organismo que recibe la declaración ya dijo que la cifra alta está mal.** No es una reconstrucción
  del proyecto.
- Mi recomendación, y el criterio general que propongo escribir en el esquema: **el registro carga
  lo literal (12.298.570), porque el campo se llama "lo declarado"; el análisis publica el residuo
  como un rango que abarca las dos lecturas, y titula con la más baja.** Rango:
  **+718.132 a +832.135 UI** con el modelo de los `notas.md`. Titular con la alta sería elegir,
  entre dos cifras defendibles, la que maximiza el residuo de una persona; eso no se hace.
- Cómo se presenta sin sugerir intención: **describir la aritmética y citar a la JUTEP, sin verbo de
  acción atribuido al declarante.** Ejemplo de redacción aceptable: "El TOTAL ACTIVO escrito en el
  formulario (12.298.570) no coincide con la suma de los subtotales del propio formulario
  (11.751.570). La diferencia, 547.000, es del orden del ingreso mensual declarado. Consultada en
  2025, la JUTEP respondió que advirtió el desvío, que puede deberse a que se computaron los ingresos
  dentro del activo, que resulta 'obviamente erróneo' y que se trata de 'un error circunstancial e
  involuntario'." Y agregar el dato que la propia JUTEP dio y que explica el mecanismo sin culpar a
  nadie: "Si la misma hubiese sido presentada en formato digital, el error hubiese sido detectado
  automáticamente, pero fue presentada, como la norma lo habilita, en formato papel".
- accion_sugerida: nunca escribir "sumó el ingreso al activo" en voz propia. Hoy
  `orsi/notas.md` §6 dice "parece que se sumó el ingreso al activo —lo que no corresponde— y **encima**
  se sumó mal por 704 pesos". "Encima" sobra y "parece que se sumó" atribuye una acción. Va
  atribuido a la docente y a la JUTEP, que son quienes lo dijeron.

### L8 — Verificación asimétrica: las cifras de Lacalle Pou no tienen ningún control cruzado

- severidad: corregir
- Los dos registros de Orsi tienen **tres confirmaciones independientes** de sus cifras (El Observador
  2024-10-18, Montevideo Portal 2025-06-04, Búsqueda 2025-06-05), en el corpus, de tres grupos
  distintos. Los cuatro de Lacalle Pou **no tienen ninguna**: salieron de OCR de escaneos con
  manuscrito, y tres de los cuatro `neto` se leyeron a ojo sobre la imagen.
- accion_sugerida: bajar con `pnpm fuente` al menos dos notas que reproduzcan los totales de Lacalle
  Pou (la nota de Telenoche sobre la publicación de las declaraciones de Lacalle Pou y Argimón, y la
  de Infobae del 19/4/2024 que el `notas.md` menciona como pista y no abrió) y usarlas como control
  cruzado. Es exactamente el mismo trabajo que la corrida de Orsi ya hizo. Que un lote tenga control
  cruzado y el otro no es, por sí solo, una asimetría de método.

### L9 — Cohorte incompleta: hay 22 declaraciones de candidatos de 2024 publicadas y se procesó una

- severidad: corregir
- La página del art. 11 bis de la JUTEP publica declaraciones de **11 partidos**: Delgado y Ripoll
  (PN), Ojeda y Silva (PC), Manini Ríos y Quintana (CA), Orsi y Cosse (FA), Mieres y Bottero (PI),
  Martínez y Revuelta (AP), Pérez e Isi (AR), Lust y Criado (PCA), Salle y Canoniero (IS), Franchi y
  Vaz (PCN). Son una cohorte comparable: mismo formulario digital, misma fecha límite, mismo
  instrumento.
- El lote de Orsi usa una de esas 22 como línea base de un residuo publicable. Publicar el residuo de
  uno solo de la cohorte, y justo el del presidente electo, es una selección aunque nadie la haya
  querido.
- accion_sugerida: o se procesan las 22 con el mismo script (son PDFs digitales con capa de texto:
  el trabajo es de una tarde, no de una semana), o el tramo candidato→presidente de Orsi no se
  titula, y se publica solo la ficha de cada declaración sin residuo hasta tener su par
  presidente→presidente en 2027.

### L10 — Vicepresidentes y presidentes anteriores

- severidad: corregir
- **Argimón** (4 declaraciones: 2020, 2022, 2024, 2025 cese) y **Cosse** (1: 2025) están en las mismas
  dos páginas de la JUTEP que ya se leyeron, sin procesar. Los dos `notas.md` lo anotan como
  pendiente. Mi recomendación explícita, que es lo que se me pidió dar: **procesar Argimón y Cosse
  antes de publicar, no después.** Son cinco PDFs de las mismas páginas ya en el corpus. Sin ellos,
  el sitio publica el patrimonio de dos presidentes y de ningún vicepresidente, y el único
  vicepresidente con residuo comparable sería el que llegue después.
- **Batlle, Vázquez y Mujica**: la respuesta es estructural y hay que publicarla, no solo verificarla.
  La obligación de la JUTEP de **publicar** las declaraciones del Presidente y del Vicepresidente la
  creó la **ley 19.797, del 13/9/2019**; la página de la JUTEP arranca en "Presidente y Vicepresidente
  2020-2025". Además el art. 14 A) de la ley 17.060 manda conservar las declaraciones "por un período
  de diez años, contados a partir del cese del funcionario en su último cargo obligado a declarar.
  Vencido el mismo, procederá a su destrucción". Batlle cesó en 2005 y Mujica en 2015: las suyas
  ya no existen. **No es una omisión del proyecto y hay que decir por qué en la página**, con estas
  dos citas, para que la ausencia no se lea como selección.
- accion_sugerida: verificar el caso de Vázquez (cesó en 2020, dentro del plazo de conservación) con
  un pedido a la JUTEP por ley 18.381 antes de afirmar que no hay nada.

### L11 — El BCU no está en el circuito de fuentes

- severidad: corregir
- Cada cifra en UI del sitio depende de dos cotizaciones que **no son fuente de ningún registro**: no
  hay nota de corpus, no hay `content/medios/bcu.yaml`, y `pnpm fuente` no puede bajarlas (cadena de
  certificados incompleta en `www.bcu.gub.uy` + servicio SOAP por POST). Verifiqué el método
  reproduciendo la llamada y las cifras dan bien, pero un auditor externo hoy no puede rehacerlo
  desde el repositorio.
- accion_sugerida: `scripts/lib/bcu.ts` que consulte el web service y deje la respuesta como nota de
  corpus, más `content/medios/bcu.yaml`. Y documentar el detalle operativo que la corrida de Orsi ya
  encontró: hay días sin cotización de dólar (feriados) y hay que caer al día hábil anterior; la UI
  se publica todos los días.

### L12 — Prior art no consultada

- severidad: aviso
- Según la nota de Radio Carve del 2026-05-25, **El País publicó el 24/5/2026 un análisis de 123
  declaraciones juradas presentadas ante la JUTEP en 2024 y 2025**. Es exactamente el mismo ejercicio
  que este proyecto está por publicar, con una muestra 20 veces mayor. Hay que leerlo antes: para no
  repetir un error ajeno, para citar diferencias de método, y porque si El País ya calculó algo
  distinto sobre las mismas declaraciones, el sitio tiene que poder explicar por qué.
- accion_sugerida: `pnpm fuente` sobre la nota de El País del 24/5/2026 antes de promover.

### L13 — Redacción: lo que hay que sacar de los dos `notas.md` antes de que viaje al sitio

- severidad: **bloquea** (para lo que pase a `content/`; en el `notas.md` privado es `corregir`)
- Revisé los dos archivos frase por frase buscando insinuación de ilegalidad, ocultamiento o
  intención. Los dos están, en general, muy por encima del estándar habitual: dicen "no lo prueba
  este cálculo", "es un cabo suelto, no un hallazgo", "es una versión de entorno, no un documento".
  Lo que sigue es lo que igual hay que cambiar.

  En `orsi/notas.md`:
  - "la cesión … **no está en ninguna de las dos declaraciones**" (§2) → art. 12.1 reservada. Ver
    `orsi#1.3`.
  - "hay un candidato reportado por prensa **que la propia declaración no registra**" (§6) → mismo
    problema: "no registra" presupone un deber de registrar en la parte pública.
  - "**faltan**, en el propio documento, los eventos que expliquen la diferencia" (§6) → "faltan"
    implica que deberían estar. Los formularios **no tienen ningún campo de eventos**: lo verifiqué
    en los dos. El de 2025 tiene un renglón de "Observaciones" y nada más; el de 2024 tiene rubros de
    activo y "Observaciones". Un bien heredado aparecería directamente como activo (en "Otros bienes"
    o en "Inmuebles"), no como un evento. Redacción correcta: "el formulario no tiene un campo donde
    se declaren variaciones ni su origen; lo que se compara son dos fotos del activo".
  - "y **encima** se sumó mal por 704 pesos" (§6) → ver `L7`.
  - "**del tamaño correcto**" (§6), aplicado a la cesión frente al residuo → la coincidencia de orden
    de magnitud es un dato, pero "del tamaño correcto" sugiere que encaja como pieza de un caso.
    Escribir el número y dejar que el lector saque la cuenta.
  - "Es la nota **más cargada** de las seis" (§7, sobre Radio Carve) → juicio sobre un medio. La
    objeción concreta (el dólar a 39 en vez de 41,678) alcanza sola y es verificable.

  En `lacalle-pou/notas.md`:
  - "Hay explicaciones **inocentes** posibles … y ninguna está probada acá" (§2, sobre el Suzuki) →
    "inocentes" instala que la alternativa es la culpable. Va "explicaciones posibles (tasación
    distinta, revalúo por lista de aforo, error de carga), ninguna verificada".
  - "el residuo da negativo en los cuatro tramos … **no hay, en estos números, un salto sin
    explicar**" (§5) → como muestra `L5`, el tramo 2022→2024 se da vuelta por debajo del 21 % de
    ahorro, y con `L1`–`L3` los números cambian. La conclusión hay que condicionarla al supuesto.
  - "Parece un error de fórmula del formulario" (§2) → "no se pudo determinar el origen".

  **Y una asimetría de tratamiento entre los dos archivos, que es la más importante de esta sección:**
  en el lote de Orsi, la afirmación de prensa (la cesión) se **funde con la aritmética**: se convierte
  a UI y se pone al lado del residuo. En el lote de Lacalle Pou, la afirmación de prensa equivalente
  (los dos "indicadores" de la denuncia del 7/6/2026: el Suzuki que se revalúa, la Toyota que
  desaparece) queda en una sección separada y **no se cuantifica nunca**. Son el mismo tipo de
  material —un dicho de un tercero sobre una declaración— y reciben dos tratamientos distintos. Hay
  que elegir uno y aplicarlo a los dos: o las dos se cuantifican al lado del residuo, o ninguna. Mi
  recomendación es **ninguna**: el residuo se publica solo, con sus supuestos y su tasa de equilibrio,
  y las versiones de prensa van en un bloque aparte rotulado como tales, con su fuente y su carácter
  (anónimo / identificable / denuncia formal).

### L14 — Verificabilidad para el Veracímetro

- severidad: aviso
- Hay dos afirmaciones chequeables en circulación que este material permitiría chequear, y para las
  dos existe documento oficial. No las cargo yo; las anoto:
  1. **"El patrimonio de Lacalle Pou creció 60,9 % durante su presidencia"** (Infobae 19/4/2024, vía
     la ficha de Wikipedia). Documento para confirmarla o refutarla: los PDFs de la JUTEP ya en el
     corpus + serie de cotizaciones del BCU (monedas 2230 y 9800, web service de cotizaciones). El
     crecimiento es +56,9 % a +68,9 % en dólares según qué tipo de cambio se use, +49,0 % en pesos y
     **+14,8 % en UI**. Da para un chequeo `discutible` bien fundado: la cifra existe, pero mide
     dólares, no patrimonio.
  2. **"Orsi duplicó su patrimonio"**. Mismos documentos. Acá el resultado sobrevive al deflactor
     (+99,2 % en UI) y da `verdadero`, con la aclaración de que la cifra alta contiene el error que
     la JUTEP reconoció (con la suma de subtotales es +90,3 %, que también es "duplicar" en cualquier
     lectura razonable). **Los dos chequeos van juntos o no va ninguno.**

---

## Objeciones al brief

- **No hay `brief.md`.** No existe `data/corridas/<id>/` para ninguno de los dos lotes, así que no
  pude auditar el prompt que recibieron los investigadores, y `procedencia.brief_sha` no va a poder
  validarse cuando se promuevan. Eso ya es un bloqueo de proceso según `data/corridas/README.md`
  ("Si falta alguno, `pnpm validar` falla para todo registro cuya `procedencia.corrida` apunte a
  ella"). Hay que crear las dos corridas con su `brief.md` antes de `pnpm promover`.
- **Sobre el encargo que recibí yo**, y esto lo digo por Regla 0: el pedido incluía la frase "la
  investigación señala que una cesión de derechos hereditarios de unos USD 140.000 reportada por
  Búsqueda equivale a un orden de magnitud parecido y **no figura declarada en ninguno de los dos
  formularios**". Esa frase da por cerrado justo lo que había que verificar, y es falsa como está
  escrita: el art. 12.1 de la ley 17.060 mantiene reservada la parte de la declaración donde iría
  el título de procedencia dominial, y no es pública. Lo correcto es "no aparece en la parte
  publicada". Lo señalo y lo corrijo en el texto; no rechazo el encargo, porque el resto del pedido
  —criticar los dos lotes con la misma vara, exigir explicaciones alternativas buscadas de verdad,
  exigir simetría de supuestos— es exactamente lo que la Regla 0 pide.
- **Asimetría de esfuerzo entre los dos lotes, que sí hay que corregir.** El lote de Orsi bajó seis
  notas de prensa, encontró el origen reportado del aumento, verificó si la JUTEP había publicado una
  rectificativa (comparando el sha-256 del PDF contra la captura de Wayback) y calculó cuatro
  sensibilidades. El lote de Lacalle Pou no bajó **ninguna** nota nueva, dejó dos cabos sueltos
  cuantificables sin cuantificar (el revalúo del Suzuki, el tipo de cambio implícito de 37,3 en la
  venta de 2023) y no buscó control cruzado de sus propias cifras. Los dos lotes son buenos; no son
  igual de exigentes consigo mismos. Y como el más exigente es el que dio residuo positivo, la
  asimetría de esfuerzo empuja en una dirección. **La versión simétrica es correr sobre Lacalle Pou
  el mismo checklist que se corrió sobre Orsi** (`L8`, `L12`, y cuantificar los dos "indicadores" de
  la denuncia o no cuantificar los de nadie, `L13`).

---

## veredicto_editorial_sugerido

```yaml
lacalle-pou/patrimonio.yaml:
  tier_sugerido: hipotesis        # no pasa a content/ hoy
  tier_alcanzable: probable       # tras corregir lo de abajo, junto con el lote de Orsi
  bloqueos:
    - "registro #2: la cita del pasivo dice 9.849.306,84 y el registro carga 9.849.366,84;
       resolver contra la imagen a 300 dpi y adjuntar el recorte a la corrida"
    - "L2: eventos_declarados suma la venta de 20.515.000 UYU entera a la banda explicable y
       lleva el tramo 2022-2024 a -94,0 %; arreglar src/lib/patrimonio.ts antes de promover"
    - "L1 y L3: el residuo publicado por el sitio no es el de notas.md"
  falta_ademas:
    - "control cruzado de prensa de los cuatro totales (hoy cero fuentes independientes)"
    - "archived_url del PDF de 2025 (cese)"
    - "cita que contenga la fecha en los cuatro registros"
    - "brief.md y carpeta data/corridas/<id>/"
    - "quitar 'inocentes' y condicionar 'no hay un salto sin explicar' al supuesto de ahorro"

orsi/patrimonio.yaml:
  tier_sugerido: hipotesis        # no pasa a content/ hoy
  tier_alcanzable: probable       # nunca 'publicado' mientras la fecha de 2025 no tenga sello oficial
  bloqueos:
    - "registro #1: `fecha` sin ninguna fuente dentro del registro; agregar la nota de Búsqueda
       como Fuente y documentar la coincidencia con el plazo del art. 13 calculado desde
       'Fecha de ingreso al cargo 01/03/2025'"
    - "L1, L2, L3: mismo desajuste de modelo"
    - "L13: 'no figura declarada' -> 'no aparece en la parte publicada'; la parte detallada
       (art. 12.1) es reservada por ley"
  falta_ademas:
    - "residuo publicado como rango que abarque los dos totales (11.751.570 y 12.298.570),
       titulando con el más bajo"
    - "poner la explicación alternativa de la línea base de 2024 ('Otros bienes: DECLARA NO
       POSEER') antes que la mención de los USD 140.000, no después"
    - "el agregado del hogar (US$ 142.308 -> US$ 372.824, Búsqueda) declarado aunque empeore
       el número, porque descarta la hipótesis del bien a nombre de la cónyuge"
    - "brief.md y carpeta data/corridas/<id>/"

condicion_conjunta:
  - "los dos lotes se publican juntos o no se publica ninguno (ya acordado)"
  - "antes de publicar cualquiera: procesar Argimón (4 declaraciones) y Cosse (1), que están
     en las mismas dos páginas de la JUTEP ya leídas. Son cinco PDFs. Sin ellos el sitio
     publica dos presidentes y ningún vicepresidente."
  - "antes de publicar el tramo candidato->presidente de Orsi: procesar las 22 declaraciones
     de candidatos de 2024 (11 partidos, PDFs digitales con capa de texto), o no titular ese
     tramo y esperar el par presidente->presidente de 2027."
  - "publicar en la misma página, con las citas de ley: por qué no hay declaraciones de
     Batlle, Vazquez y Mujica (ley 19.797 de 13/9/2019 creo la obligacion de publicar;
     art. 14 A de la ley 17.060 manda destruirlas a los diez anos del cese). Verificar el caso
     de Vazquez por ley 18.381 antes de afirmar que no existen."
  - "leer el analisis de El Pais del 24/5/2026 sobre 123 declaraciones antes de promover."

presentacion_del_residuo_en_el_sitio:
  regla_general: >-
    El residuo es la diferencia entre dos fotos del activo declarado y lo que un modelo de
    ahorro explicaria. No es una acusacion, no mide riqueza real y no mide ocultamiento.
    Un residuo positivo dice que el formulario publicado no alcanza para explicar la
    diferencia; un residuo negativo no es un certificado de nada.
  siempre_visible_junto_al_numero:
    - "los tres supuestos, con su valor y su banda"
    - "los dias del tramo y el residuo tambien como % del neto previo"
    - "la tasa de ahorro de equilibrio (la que anularia el residuo), que es lo unico que
       dice si la conclusion depende o no del supuesto elegido"
    - "que el formulario no tiene ningun campo de eventos ni de origen de los bienes, y que
       la parte detallada de la declaracion (art. 12.1, ley 17.060) es reservada y no es
       publica: el sitio compara lo publicado, no la declaracion completa"
    - "cuando el total declarado no cierra con sus subtotales, el rango entre las dos lecturas"
  prohibido:
    - "verbos de accion atribuidos al declarante ('sumo', 'omitio', 'no declaro', 'oculto')"
    - "adjetivos ('llamativo', 'inexplicable', 'inocente', 'encima')"
    - "poner una version de prensa dentro del bloque aritmetico del residuo"
    - "titular con la cifra que maximiza el residuo cuando hay dos cifras defendibles"
  texto_modelo_orsi: >-
    Entre la declaracion de candidato del 27/9/2024 y la de presidente publicada en junio de
    2025, el patrimonio neto declarado paso de 971.194 a entre 1.848.574 y 1.934.620 unidades
    indexadas (el rango sale de que el TOTAL ACTIVO escrito no coincide con la suma de los
    subtotales del propio formulario; la JUTEP respondio que advirtio el desvio y lo llamo
    "un error circunstancial e involuntario"). Con los supuestos publicados, el modelo explica
    entre 131.000 y 159.000 UI en esos 245 dias, y queda un residuo de entre 718.000 y 832.000
    UI. Para que ese residuo fuera cero haria falta una tasa de ahorro superior al 180 % del
    ingreso declarado, asi que el resultado no depende del 30 % elegido. El formulario de la
    JUTEP no tiene ningun campo donde se declaren variaciones ni el origen de los bienes, y la
    parte detallada de la declaracion es reservada por ley: lo que se compara son dos fotos de
    lo publicado. Segun Busqueda, que cita a un allegado al presidente, el aumento corresponde
    a la cesion de derechos hereditarios sobre la casa familiar a su hermana por US$ 140.000,
    con la que compro la casa que arrendaba; ese monto equivale a unas 918.000 UI. La escritura
    no es publica y este sitio no la vio.
  texto_modelo_lacalle_pou: >-
    Entre 2020 y 2025 el patrimonio neto declarado paso de 3.368.501 a 3.839.718 unidades
    indexadas, +14,0 %. La cifra de 58 % a 60,9 % que circulo en prensa mide el mismo
    patrimonio en dolares y recoge la apreciacion del peso y la inflacion del periodo. Con los
    supuestos publicados, el residuo es negativo en tres de los cuatro tramos. En el tramo
    2022-2024 el residuo depende del supuesto: se vuelve positivo si la tasa de ahorro es
    menor al 21 %. La venta de la casa habitacion declarada en 2024 (US$ 550.000) no se suma a
    la banda explicable porque una venta cambia un inmueble por dinero y no aumenta el
    patrimonio. En junio de 2026 un convencional del Partido Colorado presento ante la JUTEP
    una denuncia sobre la trazabilidad de estas declaraciones; el propio escrito aclara que
    "no tiene como fin formular imputaciones ni atribuir conductas irregulares". El expediente
    no fue estudiado por el directorio.
```

---

## Cobertura

```yaml
- medio: busqueda
  url: https://www.busqueda.com.uy/politica/yamandu-orsi-duplica-patrimonio-herencia-y-declara-separacion-bienes-su-esposa-n5400608
  fecha: 2025-06-05
  evento: "propuesto:declaraciones-juradas-jutep"
  politico: orsi
  tono: desfavorable
  justificacion: >-
    La nota afirma en voz propia que el incremento "responde a la venta de los 'derechos
    hereditarios' sobre una propiedad familiar, algo que no incluyó en declaraciones
    anteriores", y suma la opinión de un escribano según el cual Orsi "debió escribir, en el
    apartado que dice 'otros bienes', una mención del estilo 'derechos hereditarios en la
    sucesión de Carmen Martínez'". Incluye la versión del entorno ("Todo está 'debidamente
    escriturado'") pero la conclusión de omisión la sostiene la nota.

- medio: busqueda
  url: https://www.busqueda.com.uy/politica/un-error-la-declaracion-jurada-orsi-detectado-estudiantes-contabilidad-expuso-ausencia-controles-la-jutep-n5411964
  fecha: 2026-04-09
  evento: "propuesto:declaraciones-juradas-jutep"
  politico: orsi
  tono: neutral
  justificacion: >-
    El blanco de la crítica es el organismo, no el declarante: el título apunta a la "ausencia
    de controles en la Jutep" y la nota reproduce que la JUTEP "advierte un error circunstancial
    e involuntario" y que el presidente "se encuentra al día en relación a su obligación legal
    de presentar su declaración jurada".

- medio: montevideo-portal
  url: https://www.montevideo.com.uy/Noticias/-De-cuanto-es-el-patrimonio-del-presidente-Yamandu-Orsi-hoy-Esto-declaro-a-la-Jutep-uc925988
  fecha: 2025-06-04
  evento: "propuesto:declaraciones-juradas-jutep"
  politico: orsi
  tono: neutral
  justificacion: >-
    Enumera rubro por rubro sin calificar; la única lectura propia es a favor y está marcada
    como inferencia: "no reportó la existencia de pasivos, por lo que se puede inferir que pudo
    saldar la deuda de $ 130.000 que había declarado el año pasado".

- medio: infobae
  url: https://www.infobae.com/america/america-latina/2025/06/05/el-presidente-de-uruguay-yamandu-orsi-duplico-su-patrimonio-tras-herencia-y-declaro-separacion-de-bienes/
  fecha: 2025-06-05
  evento: "propuesto:declaraciones-juradas-jutep"
  politico: orsi
  tono: desfavorable
  justificacion: >-
    Reproduce a Búsqueda y va un paso más allá, afirmando el deber en voz propia y sin
    atribución: "Sin embargo, Orsi debió haber mencionado este asunto de los derechos sucesorios
    en declaraciones anteriores, algo que no ocurrió".

- medio: el-observador
  url: https://www.elobservador.com.uy/nacional/cual-es-el-patrimonio-orsi-delgado-ojeda-y-los-otros-candidatos-la-presidencia-esto-declararon-la-jutep-n5966190
  fecha: 2024-10-18
  evento: elecciones-2024
  politico: orsi
  tono: neutral
  justificacion: >-
    Es un repaso comparado de los diez presidenciables con el mismo criterio para todos
    ("Entre los diez presidenciables que hicieron su declaración suman un patrimonio neto de
    $ 301.850.038"); sobre Orsi solo reproduce cifras.

- medio: radio-carve
  url: https://radiocarve.uy/el-auto-del-presidente-orsi-y-las-inconsistencias-en-su-declaracion-jurada/
  fecha: 2026-05-25
  evento: "propuesto:declaraciones-juradas-jutep"
  politico: orsi
  tono: desfavorable
  justificacion: >-
    Construye la nota alrededor de una falta de explicación atribuida al declarante: "La
    sorpresa al analizar las declaraciones juradas de Orsi del 2024 y del 2025, es que no se
    puede explicar con claridad de dónde…", con el título "las inconsistencias en su
    declaración jurada". (Además usa el dólar a $ 39 para valuar un bien declarado a la
    cotización de 41,678, lo que arrastra toda su cuenta; ver orsi/notas.md §7.)

- medio: teledoce
  url: https://www.teledoce.com/telemundo/nacionales/la-jutep-publico-las-declaraciones-juradas-de-los-candidatos-a-la-presidencia-conoce-el-patrimonio-de-cada-uno/
  fecha: 2024-10-19
  evento: elecciones-2024
  politico: orsi
  tono: neutral
  justificacion: >-
    Listado sin adjetivos de los cinco candidatos principales con el mismo formato para cada
    uno: "El candidato a presidente por el Frente Amplio, Yamandú Orsi, reside en Salinas, en el
    departamento de Canelones, declaró tener un patrimonio neto correspondiente a $ 5.927.000".

- medio: montevideo-portal
  url: https://montevideo.com.uy/Noticias/Jutep-evaluara-denuncia-de-convencional-colorado-a-Lacalle-por-sus-declaraciones-juradas-uc964999
  fecha: 2026-06-12
  evento: "propuesto:declaraciones-juradas-jutep"
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Informa una denuncia y publica el descargo que la relativiza dentro del propio cuerpo:
    "Ibarra aclaró que la presentación no tiene como fin formular imputaciones ni atribuir
    conductas irregulares, sino solicitar que la Jutep evalúe la consistencia y trazabilidad de
    la evolución patrimonial declarada", y aclara que "el tema todavía no comenzó a ser
    estudiado por el directorio".
```

Nota sobre esta sección: no emito registro de tono para la ficha de Wikipedia de Lacalle Pou
(`b51d347f98cc7930a8a78c3519e61aac64f3d4fe`) ni para los PDFs de la JUTEP ni para las páginas de
impo.com.uy que leí para esta crítica: no son notas de prensa y el tono no aplica.

**Balance de la cobertura leída, para el editor:** de las ocho notas, tres son desfavorables y todas
tres son sobre Orsi; ninguna es favorable a nadie. Eso **no** es un hallazgo sobre los medios: es un
artefacto del lote, porque el lote de Orsi bajó seis notas y el de Lacalle Pou usó una sola que ya
estaba en el corpus. Cualquier lectura del sesgo de cobertura a partir de estos ocho registros
estaría mal hecha. Ver `L8` y la última objeción al brief.
