# Notas — UTE, serie histórica de finanzas (corrida 2026-09-08-empresas-ute-serie-historica)

## Segunda vuelta (respuesta a `critica.md`)

Esta corrida es la resolución de las objeciones de `data/corridas/2026-09-08-empresas-ute-serie-historica/critica.md`
(9 `bloquea`, 17 `corregir`, 7 `aviso`). El detalle de qué se resolvió y cómo queda en el informe
final del investigador; acá solo lo que no se resolvió del todo y por qué, y lo que es criterio del
editor.

### No resuelto o resuelto parcialmente

- **L2, 1912-2002 (salvo 2003, ya cargado) y 2001**: sigue sin documento público digitalizado. Se
  agotaron las pistas que pedía el brief de la crítica: `archivo.presidencia.gub.uy` (índice
  `sci/pages/00-05.htm` es un frameset sin años intermedios cargables uno por uno; `mem2001` a
  `mem2005` con el patrón `info/UTE.htm` dan 404), Tribunal de Cuentas (`tcr.gub.uy`: hay un buscador
  y una memoria anual del propio TCR, pero no se localizó un dictamen de UTE específico
  digitalizado para esos años), Rendición de Cuentas del MEF (se ubicó la ley que aprueba la
  Rendición de Cuentas 2000, `docs.uruguay.justia.com/nacionales/leyes/ley-17403-oct-16-2001.pdf`,
  pero no es la fuente primaria y no se abrió para no citar una fuente secundaria como si fuera el
  documento), Portal de Transparencia Presupuestaria de OPP (confirmado dead end: solo publica
  compromisos de gestión en un tablero JS, sin serie histórica descargable — verificado en esta
  vuelta), Biblioteca del Poder Legislativo (`pmb.parlamento.gub.uy`, id 8180: confirma que existe
  la colección impresa "Memoria anual" de UTE desde 1973, call number 350.872 2 UTEm, pero es una
  ficha de catálogo sin texto), Auditoría Interna de la Nación (sin informes de esa época
  localizados por búsqueda).
- **Memoria anual UTE 1996** (`https://www.ute.com.uy/sites/default/files/memorias/Memoria%20anual%201996.pdf`,
  leída con `pnpm fuente` en esta vuelta): es un hallazgo real — el sitio de UTE tiene memorias
  digitalizadas de al menos 1995-1996 con Estado de Situación Patrimonial y Estado de Resultados —
  pero el texto extraído tiene ruido de OCR (espacios insertados dentro de números y palabras, ej.
  "8.412.994.830 ,69", "lnt." por "Int.") y al menos dos presentaciones distintas del resultado del
  ejercicio que no pude reconciliar con confianza en el tiempo de esta vuelta (una en el Estado de
  Situación Patrimonial con columnas 1995/1996/1995-reexpresado, otra en un estado de resultados por
  función con una cifra final distinta). No cargué 1995 ni 1996 en `finanzas[]` para no arriesgar una
  cita mal atribuida a la columna equivocada. Documentado en `hipotesis` para que un investigador con
  más tiempo la retome: la URL ya está en el corpus.
- **L4 (deuda financiera, tres convenciones)**: se tomó el camino simple que la crítica dejaba como
  alternativa ("declarar el quiebre en el punto exacto") en vez de reconstruir los once años desde
  la columna comparativa del balance siguiente. Cada año 2004-2014 mantiene la cifra que declara su
  propio balance (neta de intereses a vencer en 2004-2007 y 2009-2012, confirmado con la Nota 5.11
  del balance de 2009; bruta solo en 2008, Nota 5), y la nota de 2008 explica el quiebre. No se
  homogeneizó la serie completa.
- **2008, posible doble conteo con 2007**: se documentó la reclasificación (Decretos 206/08 y
  275/08) en la `nota` de 2007 y en las fuentes de `transferencias_al_estado` de 2008, pero no se
  ajustó el monto de `impuestos_pagados` de 2008 ni el de `transferencias_al_estado` de 2007: es una
  decisión de presentación (cuál cifra "cuenta" para cada campo) que le corresponde al editor, no al
  investigador. Ver `para_el_editor`.
- **L6 (citas truncadas del Literal D)**: corregido en los once años nuevos (2004-2014). El año 2015
  ya publicado tiene el mismo defecto y queda fuera del alcance de esta corrida (el brief pidió
  years anteriores a 2015 y no autorizó tocar contenido ya publicado); se anota para una corrección
  `tipo: presentacion` aparte.

## candidatos_giro
No aplica: esta corrida no investiga declaraciones ni posiciones de un político, sino datos
financieros de una empresa pública.

## hipotesis
- **Memoria anual UTE 1995-1996** (ver arriba): documento real, con capa de texto pero ruido de OCR
  y estructura ambigua entre dos presentaciones del resultado del ejercicio. No cargado por no poder
  atribuir con confianza cada cifra a su columna/año exactos en el tiempo disponible.
- **1999 y 2000**: `archivo.presidencia.gub.uy/mem2000/info/UTE.htm` sí tiene datos comparables
  (Ingresos totales, Patrimonio y Endeudamiento en miles de USD), leído en esta vuelta. No se
  cargaron en `finanzas[]` porque "Endeudamiento" en esa tabla es un indicador de gestión de la
  Memoria del Poder Ejecutivo, no necesariamamente la misma definición que "Deudas financieras" que
  usa esta ficha desde 2004 (podría incluir deuda comercial u otros pasivos); cargarlo como
  `deuda_financiera` sin esa aclaración rompería la comparabilidad de la serie. Los otros dos
  indicadores (Ingresos totales, Patrimonio) no tienen campo en el esquema `Anio`. Queda documentado
  para que el editor decida si vale la pena, con la salvedad de metodología, cargar el
  "Endeudamiento" 1999-2000 como `deuda_financiera` con `nota` explícita, o dejarlo fuera.
- **1912-2002 y 2001**: sin documento público digitalizado localizado (ver detalle arriba). Existe
  la colección impresa en la Biblioteca del Poder Legislativo desde 1973 (confirmado por catálogo),
  lo que sugiere que hay más años recuperables si alguien digitaliza el archivo físico, pero eso
  excede lo que puede hacer esta corrida.
- **Balances anteriores a 2004 en `portal.ute.com.uy`**: el índice propio de UTE solo lista desde
  2004; es un indicio, no una prueba, de que ese es el límite de lo que UTE mantiene digitalizado en
  ese portal (la Memoria anual 1996 está en un dominio distinto, `www.ute.com.uy/sites/default/files/memorias/`,
  no en `portal.ute.com.uy`).

## casos_vistos
Ninguno. No aparecieron menciones de causas judiciales, denuncias ni investigaciones en los
documentos leídos en esta corrida ni en la segunda vuelta.

## verificacion_manual
Ninguna. Todos los documentos citados en esta vuelta (balances 2004-2014, Memoria Anual del Poder
Ejecutivo 1999-2000, Memoria anual UTE 1996, catálogo de la Biblioteca del Parlamento, portal de
OPP) se leyeron con `pnpm fuente` sin errores de descarga.

## cobertura_del_periodo

| Año | Estado | Detalle |
|---|---|---|
| 1912-2002 | sin documento público digitalizado encontrado | Búsquedas de la corrida original más, en esta vuelta: `archivo.presidencia.gub.uy` (índice del período 2000-2005, patrón `memAAAA/info/UTE.htm` para 2001-2003 da 404), Tribunal de Cuentas, Rendición de Cuentas del MEF, Portal de Transparencia Presupuestaria de OPP (confirmado: solo compromisos de gestión, sin serie), Biblioteca del Poder Legislativo (confirma colección impresa desde 1973, sin texto digital), Auditoría Interna de la Nación. La Memoria anual de UTE de 1996 (`www.ute.com.uy/sites/default/files/memorias/Memoria%20anual%201996.pdf`) sí está digitalizada con datos de 1995 y 1996, pero no se cargó por ambigüedad de columnas (ver `hipotesis`). |
| 1999 | documentado, no cargado en finanzas[] | `archivo.presidencia.gub.uy/mem2000/info/UTE.htm`: Ingresos totales, Patrimonio y Endeudamiento en miles de USD. No mapea con confianza a los campos del esquema (ver `hipotesis`). |
| 2000 | documentado, no cargado en finanzas[] | Mismo documento y misma salvedad que 1999. |
| 2003 | cargado (parcial) | Columna comparativa del balance de UTE al 31/12/2004 (`Estados_contables_31_12_2004.pdf`): resultado_ejercicio, transferencias_al_estado (de la versión "a cuenta del resultado" del estado de flujos de efectivo, no de un Literal E propio) y deuda_financiera. Sin impuestos_pagados ni capitalizaciones_del_estado propios. |
| 2004 | cargado | `Estados_contables_31_12_2004.pdf` (individual). Incluye capitalizaciones_del_estado: sin datos para este año. |
| 2005 | cargado | `Estados_contables_31_12_2005.pdf` (individual). |
| 2006 | cargado | `Estados_contables_31_12_2006.pdf` (individual). Ejercicio con pérdida neta. |
| 2007 | cargado | `Estados_contables_31_12_2007.pdf` (individual) más Nota 4.1/4.2 del balance de 2008 (columna comparativa 2007) para capitalizaciones_del_estado y la reclasificación de parte de la versión de resultados como pago de impuestos en 2008. |
| 2008 | cargado | `UTE%20EECC%20individuales%20al311208.pdf` (individual). Mayor pérdida neta de la serie 2004-2014. transferencias_al_estado corregido a $124.595.000 (Nota 4.2, criterio de caja), con el Literal E ($24.595.000) documentado aparte. capitalizaciones_del_estado agregado (DIPRODE + MEF/aerogeneradores). |
| 2009 | cargado | `UTE%20Informe%20Consolidado%20e%20Individual%20al%2031%2012%2009.pdf` (individual). Sin transferencia a Rentas Generales ese año (doble verificado). capitalizaciones_del_estado agregado. |
| 2010 | cargado | `UTE31122010%20Estados%20contables%20indycons.pdf` (individual). Año de creación del Fondo de Estabilización Energética; transferencias_al_estado corregido para excluir el aporte al Fondo, con el mismo criterio que 2020. |
| 2011 | cargado | `UTE_%2031%2012%2011.pdf` (individual). Nota metodológica corregida (el ajuste por inflación se corta en 2012, no "a partir de 2011"). capitalizaciones_del_estado agregado. |
| 2012 | cargado | `UTE%20Diciembre%202012.pdf` (individual). Ejercicio con pérdida neta. capitalizaciones_del_estado agregado (incluye el cobro del Fondo de Estabilización Energética, ≈USD 175,4 millones, el mayor de la serie). |
| 2013 | cargado | `UTE%2031.12.13.pdf` (separado) más columna comparativa del balance de 2014 para capitalizaciones_del_estado y el aporte al Fondo. |
| 2014 | cargado | `EECC%20con%20dictamen%202014.pdf` (separado). capitalizaciones_del_estado agregado. |
| 2015-2025 | ya publicado | Fuera del alcance de esta corrida (brief pide solo años anteriores a 2015); no se tocó, salvo para fijar el criterio de comparación (Fondo de Estabilización Energética 2020, Literal F 2021). |

Nota metodológica (actualizada en esta vuelta): los balances 2004-2011 presentan sus cifras "en
moneda del" año de cierre del propio balance (ajuste integral por inflación: IPPN hasta 2008, IPC
desde 2009 por el Decreto 99/009); el ajuste se corta en el ejercicio 2012, que en adelante se
presenta en pesos corrientes (confirmado: el Estado de Evolución del Patrimonio del balance de 2012
trae "Ajuste por inflación" sobre los saldos al 01.01.11 y no sobre los del 01.01.12). Dentro de un
mismo año, `resultado_ejercicio` y `deuda_financiera` están en esa moneda de cierre ajustada;
`impuestos_pagados` (Literal D) y `transferencias_al_estado` (Literal E) son cifras de caja
nominales del propio ejercicio, sin ese ajuste (se documenta en la `nota` de cada año 2004-2011). La
deuda financiera se presenta neta de intereses a vencer en 2004-2007 y 2009-2012 (confirmado
también con el detalle de la Nota 5.11 del balance de 2009); el balance individual de 2008 (Nota 5)
usa en cambio una presentación bruta, sin ese neteo, lo que rompe la homogeneidad del salto
2007→2008 en ese campo (ver `nota` de 2008).

## escaneos_sin_texto
Ninguno en el rango 2003-2014: todos los balances encontrados para ese período tienen capa de texto
extraíble y se cargaron con cifras y cita literal.

## para_el_editor
Hitos con fecha y fuente que no están en `hitos[]` de la ficha publicada y podrían sumarse (todas
las citas ya están en las fuentes de `finanzas[]` de esta corrida):

- **2008 (ejercicio)**: mayor pérdida neta de la serie 2004-2025: $ 8.267.177.704 (USD -339,3
  millones). El balance no explicita la causa; el dato verificable es que el gasto de explotación en
  Generación fue de $ 14.656.224.813 en 2008 frente a $ 2.367.278.912 en 2004 (Literal C de ambos
  balances). Si se quiere un hito con explicación causal (sequía, costo de generación térmica), hace
  falta traerla de otra fuente que sí la haga (memoria anual, ADME, comparecencia parlamentaria) y
  atribuírsela a esa fuente: el balance mismo no la da.
- **2010-XX-XX**: creación del Fondo de Estabilización Energética por el art. 773 de la Ley de
  Presupuesto Nacional 2010-2014 N° 18.719; UTE aportó $ 2.997.000.000 (USD 150.000.000) ese año
  como parte de su primera constitución (Nota 16, balance 2010, cita completa ya en el registro).
- **2012 (ejercicio)**: UTE cobró $ 3.403.435.365 (≈ USD 175,4 millones) del Fondo de Estabilización
  Energética, el mayor movimiento del Fondo de toda la serie 2004-2025 y casi el triple del cobro de
  2020 (USD 61,8 millones) que sí tiene hito propio en la ficha publicada. Si se decide no llenar la
  línea de tiempo de movimientos del Fondo, al menos debería mencionarse en el `resumen` junto al de
  2020, para no dar la impresión de que el Estado solo le puso plata a UTE por esa vía en 2020.
- **2013 y 2014 (ejercicios)**: UTE aportó $ 3.258.297.009 y $ 3.655.752.392 respectivamente al
  Fondo de Estabilización Energética (salida de caja de UTE hacia el Fondo, no transferencia a
  Rentas Generales).
- **2006 y 2012 (ejercicios)**: los otros dos años con pérdida neta de la serie 2004-2014 ($
  -1.140.713.238 en 2006 y $ -3.420.443.068 en 2012), para que el `resumen` narre también los años
  malos del período 2004-2014 con el mismo tono que los buenos (hoy el `resumen` publicado solo
  cubre 2015-2024 y dice que el resultado fue positivo "en los nueve años con datos disponibles" de
  esa ventana; sigue siendo válido para esa ventana, pero un lector que vea la tabla completa
  2003-2025 esperará que el texto hable de todo el período).

Otros puntos de criterio, no de investigación:

- **`resumen` e `hitos[]` no se tocaron**, como pedía el brief. Extenderlos a 2003-2014 (cuatro
  párrafos: resultado, tributos, transferencias, deuda, con el mismo tono para años buenos y malos)
  es responsabilidad del editor antes de publicar; ver la objeción del crítico en `critica.md`,
  sección L7(b).
- **Gráfico**: con 23 años cargados (2003-2025, con hueco en 2001-2002), la ficha necesita el
  gráfico con el corte metodológico marcado en 2011/2012 (fin del ajuste por inflación) y el hueco
  de 2017 visible, en vez de una tabla de 23 filas.
- **`segmentos[]` sigue vacío en los once años, a propósito** (coincide con el criterio ya usado en 2015-2025): los balances 2004-2014 sí traen el Literal B (ingresos por actividad) y el Literal C (gastos por actividad y resultados: Generación, Trasmisión, Distribución, Consultoría externa), que es el desglose que exige el artículo 15 de la Ley 16.832. Si el editor decide en algún momento sumar `segmentos[]` a la ficha, la fuente ya está identificada (Literal C de cada balance, la misma que se usó acá para comparar Generación 2004 vs 2008); no se cargó en esta corrida porque el brief no lo pidió y la ficha publicada explica que UTE no atribuye *resultado* por segmento (solo gasto e ingreso), que es un dato distinto.
- **`resumen` publicado dice "Literal D" para el desglose de costos por actividad**; en los años
  2004-2014 (y probablemente también 2015-2025) ese desglose está en el **Literal C** ("Gastos por
  actividad y resultados de la empresa"), no en el D (que es Impuestos pagados). Corregir al pasar
  si el editor toca el `resumen`.
- **Doble conteo 2007/2008**: la Nota 4.2 del balance 2008 documenta que $ 1.541.428.784 de la
  "versión de resultados" de 2007 fue reclasificada por decreto como pago de impuestos de 2008. Esta
  ficha, tal como queda, cuenta $ 1.541.428.784 en `transferencias_al_estado` de 2007 y también deja
  ese mismo dinero, en otra forma, dentro del `impuestos_pagados` de 2008 (Literal D 2008, total $
  5.631.209.198). Es una decisión de presentación (ajustar una de las dos cifras, o dejar ambas con
  la aclaración que ya lleva la `nota` de 2007) que le corresponde al editor.
- **Corrección de tipo `presentacion` pendiente para 2015 ya publicado**: la cita de `impuestos_pagados`
  de 2015 empieza en `Tasa Tribunal de Cuentas` en vez de en `IVA` (mismo defecto que tenían 2004-2012
  en esta corrida antes de corregirse). No se tocó por estar fuera del alcance de años anteriores a
  2015 que pedía el brief.
- **Esta corrida modifica un registro ya publicado** (`content/empresas/ute.yaml`): como señaló el
  crítico (L9), entra por `pnpm promover --correccion`, con un registro previo en
  `content/correcciones/`, no por `--corrida`.

## objeciones_al_brief
Ninguna. El brief de esta segunda vuelta pide resolver objeciones de un crítico sobre una serie
contable de una empresa pública, con el mismo rigor para los años de cualquier gobierno (2004
colorado, 2005-2014 Frente Amplio); no hay ángulo partidario, selectivo ni asimétrico. Coincido con
la sección "Objeciones al brief" de `critica.md`: no hay nada que objetar del lado de la Regla 0.
