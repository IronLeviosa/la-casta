# Crítica — corrida 2026-09-07-empresas-anp

Modelo: Opus (claude-opus-5, contexto 1M), como crítico, conforme a la regla 14 del mantenedor
("Opus solo para el crítico"). El investigador corrió en Sonnet (`_investigacion.modelo: claude-sonnet-5`),
como manda la tabla de roles.
Lote: `inbox/empresas/anp/2026-09-07/`
Registros revisados: 1 registro de `empresas` (ANP), revisado campo por campo: 21 años de `finanzas`
(2003-2006, 2008-2015, 2017-2025), 5 argumentos de monopolio, 2 comparaciones, 10 hitos, 27 URLs
distintas y 202 fuentes.

Verificaciones hechas: abrí con `pnpm fuente` ocho balances (2004 y 2006 desde Wayback, 2009, 2011,
2013, 2018, 2020, 2022, 2023 y 2025 — diez en total), las siete notas de prensa y la Ley 5.495; cotejé
las 202 citas contra el texto guardado en el corpus con normalización alfanumérica; recalculé las
sumas de `impuestos_pagados` de seis años y las conversiones a dólares de los 21.

**Resumen del veredicto.** Las cifras están bien: recalculé resultado, impuestos, transferencias y
deuda de 2004, 2011, 2013, 2018, 2022, 2023 y 2025 contra el documento y coinciden hasta el decimal,
y las conversiones a dólares usan el tipo de cambio de cierre que declara cada balance. El problema
no son los números: son las **citas** que los acompañan y la **base monetaria** de cuatro años.
Encontré tres citas de `documento_oficial` que no existen en el documento (texto y cifras traídas de
otros balances), una URL citada que nunca se abrió, y unas quince citas de la nota de impuestos
reescritas en vez de copiadas. Un lote de empresa pública se sostiene entero sobre que el lector
pueda ir al PDF y encontrar el renglón; acá, en varios años, no lo va a encontrar.

---

## Objeciones por registro (por campo)

### empresas[0] — `finanzas[2021].transferencias_al_estado.fuentes[0].cita` y `finanzas[2022].transferencias_al_estado.fuentes[0].cita`
- severidad: **bloquea**
- tipo: cita_fuera_de_contexto
- objecion: Ninguna de las dos citas existe en el documento. El registro de 2021 cita *"En el ejercicio
  2012 la ANP realizó transferencias de fondos mensuales a la Tesorería General de la Nación
  totalizando $ 468.000.000 ($ 432.118.320 en el 2011). [sic, el balance dice «2012» y «2011»…]"* y el
  de 2022 cita la misma frase con los años corregidos y el mismo paréntesis. El balance de 2022 no
  dice nada de eso: dice los años correctos, en **dos oraciones separadas**, sin paréntesis. La cadena
  "En el ejercicio 2012" no aparece ni una vez en los 99.363 caracteres del PDF. La `hipotesis` de
  `notas.md` que denuncia un error de ANP ("la nota dice literalmente «En el ejercicio 2012…»") es
  falsa: el error está en nuestra transcripción, no en el balance. Además, el `[sic …]` va **dentro**
  del campo `cita`, que la página imprime como copia literal.
- cita_de_contexto: "En el ejercicio 2022 la ANP realizó transferencias de fondos mensuales a la
  Tesorería General de la Nación / totalizando $ 468.000.000. / En el ejercicio 2021 la ANP realizó
  transferencias de fondos mensuales a la Tesorería General de la Nación / totalizando $ 432.118.320."
  (https://anp.com.uy/sites/default/files/archivos/parrafo-colapsable/2023-05/Estados%20Financieros%20%20ANP%2031.12.22.pdf,
  carácter 97.827)
- accion_sugerida: Reemplazar las dos citas por la oración que corresponde a cada año, tal cual está
  arriba; borrar los dos `[sic]` y, si hace falta una salvedad, moverla a `concepto`. Retirar esa
  `hipotesis` de `notas.md`.

### empresas[0] — `finanzas[2021].impuestos_pagados.fuentes[0].cita` y `finanzas[2023].impuestos_pagados.fuentes[0].cita`
- severidad: **bloquea**
- tipo: cita_fuera_de_contexto
- objecion: Cifras de otros balances metidas dentro de una cita de `documento_oficial`. La de 2021
  dice *"impuesto a la renta de los no residentes el monto retenido en el año 2022 ascendió a $ 26.208
  ($938.345 en el ejercicio 2011)"*: los dos números son del **balance de 2012**; en el de 2022 esa
  línea dice $47.809 y $51.966. Ni "938.345" ni "26.208" aparecen en el PDF de 2022. La de 2023 dice
  *"Impuesto al Patrimonio: pagos … por $ 561.641.336 ($187.573.696 al 31/12/12)"*: el monto de 2023 es
  correcto, pero el comparativo entre paréntesis es el de 2012 traído de otro documento; el balance de
  2023 dice $550.136.342 y "al 31 de diciembre de 2022". Las sumas del registro (1.614,2 y 1.172,2
  millones) sí dan bien con los valores verdaderos, así que el defecto es de cita, no de cálculo —
  pero el lector que abra el PDF va a encontrar otra cosa.
- cita_de_contexto: "Impuesto al Patrimonio: pagos por concepto de anticipos efectuados por $
  561.641.336 ($ 550.136.342 al 31 de diciembre de 2022)."
  (https://www.anp.com.uy/sites/default/files/archivos/parrafo-colapsable/2024-03/ANP%20Estados%20financieros%20Aud%2023_.pdf)
  · "impuesto a la renta de los no residentes el monto retenido en el año 2022 ascendió a $47.809
  ($51.966 en el ejercicio 2021)."
  (https://anp.com.uy/sites/default/files/archivos/parrafo-colapsable/2023-05/Estados%20Financieros%20%20ANP%2031.12.22.pdf)
- accion_sugerida: Rehacer las dos citas copiando del PDF. Retirar la `hipotesis` de `notas.md` sobre
  el supuesto error de ANP en el IRNR de 2021.

### empresas[0] — `finanzas[*].impuestos_pagados.fuentes[0].cita` (2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025 y otros)
- severidad: **bloquea**
- tipo: cita_fuera_de_contexto
- objecion: La nota "Impuestos pagos y montos recaudados como agente de retención" está reescrita, no
  copiada, en unos quince años. Dos patrones constantes: el documento escribe *"al 31 de diciembre de
  2017"* y la cita pone *"al 31/12/17"*; el documento dice *"a favor del Tribunal de Cuentas"* y la
  cita agrega *"de la República"*. Además los bullets se pegan con punto y seguido sin marcar la
  elisión del texto intercalado (encabezados de página, "El informe fechado el 27 de marzo de 2019").
  De las 202 citas del lote, 24 fragmentos no aparecen literales en el texto guardado ni con
  normalización alfanumérica. `cita` es copia literal (regla 4 para agentes, regla dura 2 del brief);
  esto es reconstrucción de estilo, y en dos casos (arriba) terminó arrastrando cifras ajenas.
- cita_de_contexto: "Impuesto al Patrimonio: pagos por concepto de anticipos efectuados por / $
  335.910.370 ($ 298.012.400 al 31 de diciembre de 2017). / Impuesto a las Rentas de Actividades
  Económicas: pagos por conceptos de anticipos / $ 500.782.741 ($ 496.831.602 al 31 de diciembre de
  2017)."
  (https://www.anp.com.uy/sites/default/files/archivos/parrafo-colapsable/2020-08/ANP%2B31%2B12%2B18_0.pdf)
- accion_sugerida: Recopiar cada cita del PDF y usar `[...]` en cada corte. Aparte, correr
  `pnpm validar:red` sobre el lote antes de promover: si estas citas pasaron la etapa 5, el matching
  está siendo demasiado tolerante y conviene decirlo en el informe de la corrida.

### empresas[0] — `hitos[3]` (Ley 11.037, 1948)
- severidad: **bloquea**
- tipo: riesgo_legal / cita_fuera_de_contexto
- objecion: La URL `https://www.impo.com.uy/bases/leyes/11037-1948/1` **no fue abierta en la corrida**:
  no hay entrada `tipo: fuente` para ella en `consultas.jsonl` (solo una búsqueda que "ubica Ley
  11.037/1948") y el texto no está en el corpus. La `cita` es *"Ley N° 11037, promulgada el 15 de enero
  de 1948, publicada el 24 de enero de 1948."*, que es metadato bibliográfico con forma de fragmento de
  buscador, no texto de la ley. Y el `detalle` afirma lo que esa cita no dice: "Fija un directorio de
  cinco miembros rentados, electos por el Poder Ejecutivo según el artículo 180 de la Constitución".
  Es exactamente la regla 5 para agentes ("nunca citar una URL que no se abrió").
- cita_de_contexto: —
- accion_sugerida: Abrir la ley con `pnpm fuente` y citar el artículo que fija el directorio, o borrar
  el hito. Sin eso no puede publicarse.

### empresas[0] — `monopolio.alcance` (última oración)
- severidad: **bloquea**
- tipo: riesgo_legal
- objecion: El campo cierra con *"el Estado y ANP rechazan esa lectura y sostienen que actúan conforme
  al reglamento de atraque vigente"*. Ninguna fuente del lote respalda eso. La nota de El Observador
  sobre las navieras es la transcripción de una comisión parlamentaria donde solo hablan privados: no
  hay una sola línea de ANP ni del gobierno. La nota de Montevideo Portal es el escrito de Montecon,
  sin respuesta de ANP. `alcance` es un campo sin `fuentes` propias, así que la afirmación queda sin
  ancla y la página la muestra como descripción neutral de la ficha. Poner en boca del Estado una
  defensa que no está documentada es tan grave como poner en boca de Montecon una acusación que no
  dijo: es afirmar más de lo que la fuente respalda.
- cita_de_contexto: La nota completa de El Observador (2021-06-04) recoge a Ferrari, Grinschpun,
  Pérez, Domínguez, González, Lanaro, Testa, Rucks, Taborelli y Núñez; el gobierno no aparece.
  (https://www.elobservador.com.uy/nota/navieras-preocupadas-por-futuro-monopolio-privado-en-puerto-de-montevideo-20216313130)
- accion_sugerida: Borrar la oración, o sustituirla por una posición documentada de ANP. Hay una a
  mano y ya leída: el presidente de ANP (Genta, en la nota de Ámbito del 2025-09-16 ya leída), sobre el mismo
  eje: *"No hay una estrategia de renegociación del acuerdo, ni está en la agenda del gobierno"* y
  *"No podemos imponer decisiones al socio mayoritario"*.

### empresas[0] — `monopolio.argumentos_a_favor[1]` ("El monopolio de ANP tiene sustento histórico…")
- severidad: **bloquea**
- tipo: riesgo_legal / asimetria
- objecion: El campo `quien` dice literalmente *"Argumento reconstruido por el investigador"*. El
  esquema exige que cada argumento vaya "en palabras de quien lo sostiene y con su fuente"; acá no lo
  sostiene nadie. Peor: la fuente es una columna de memorias de El País que sostiene lo contrario. Esa
  columna llama a la administración estatal *"los ímpetus, conceptos y objetivos políticos monopólicos
  del ente portuario"* y describe cómo *"el Estado cesáreo avanzaba con gran ímpetu"*. Construir con
  ella un argumento a favor del monopolio invierte el sentido del texto citado. Y como el otro "a
  favor" (Supra) también flaquea (ver siguiente), el lado favorable de la ficha queda en cero real
  contra tres en contra, cuando ANCAP publica 4 a favor / 3 en contra y ANTEL 3 / 4.
- cita_de_contexto: "Los ímpetus, conceptos y objetivos políticos monopólicos del ente portuario no
  eran tampoco de 1916 sino que venían de 1909"
  (https://www.elpais.com.uy/negocios/noticias/10-de-agosto-1916-fue-la-primera-reunion-de-directorio-de-la-anp)
- accion_sugerida: Borrar el argumento y buscar el lado favorable donde está documentado. Documentos
  previsibles, todos con el mismo esfuerzo que se le puso al lado contrario: **(a)** exposición de
  motivos y discusión parlamentaria de la Ley 16.246 (Diario de Sesiones de Cámara de Senadores y
  Representantes, 1991-1992, `parlamento.gub.uy`), donde consta por qué se reservó a ANP la
  administración y las tarifas máximas mientras se abría la operativa; **(b)** versiones taquigráficas
  de la Comisión de Transporte 2021 y del llamado a sala por el acuerdo con Katoen Natie, donde el
  Poder Ejecutivo y ANP defienden el diseño; **(c)** declaraciones de los presidentes de ANP de cada
  período (la de Genta, 2025, ya está leída; las anteriores, en las gacetillas y discursos de
  `presidencia.gub.uy` y `anp.com.uy`, que hay que abrir con `pnpm fuente` antes de citar); **(d)** el boletín
  propio de Supra o del sindicato SUANP, en vez de la crónica que lo resume.

### empresas[0] — `monopolio.argumentos_a_favor[0]` (Supra, dragado)
- severidad: **bloquea**
- tipo: riesgo_legal
- objecion: El `texto` atribuye a Supra más de lo que la nota dice. La segunda mitad —*"tercerizar el
  dragado, el remolque, las grúas y el mantenimiento reduce la incidencia y la autoridad del
  organismo"*— no aparece en ninguna parte de la nota: remolque, grúas, mantenimiento, "incidencia" y
  "autoridad del organismo" no están en el texto. Lo que la nota trae del boletín son dos oraciones,
  sobre dragado y nada más. Aparte, el argumento es sobre tercerizar una tarea operativa, no sobre el
  diseño legal (administración y tarifas reservadas), que es lo que el brief pedía documentar.
- cita_de_contexto: "el dragado nacional se encuentra en una situación crítica producto de años de
  falta de inversión, escasez de insumos, debilitamiento de la plantilla y ausencia de una
  planificación sostenida" / "La defensa del dragado como política de Estado es fundamental para
  garantizar autonomía, eficiencia, seguridad y capacidad pública de respuesta"
  (https://www.elobservador.com.uy/economia-y-empresas/entrega-soberania-multinacionales-el-choque-el-sindicato-portuario-y-jerarcas-anp-n6044952)
- accion_sugerida: Recortar el `texto` a lo que dice el boletín y decir en `quien` que es sobre el
  dragado, no sobre el monopolio administrativo. Si se quiere el argumento sobre el diseño legal, ir
  al boletín de Supra directamente.

---

### empresas[0] — `finanzas[2003, 2005, 2008, 2010].*` (base monetaria)
- severidad: corregir
- tipo: contexto_omitido / asimetria
- objecion: Cuatro años están en una moneda distinta de la de sus vecinos y convertidos a dólares con
  el tipo de cambio equivocado. Los cuatro salen de la columna comparativa de un balance que reexpresa
  por inflación: 2003 en pesos del 31/12/2004, 2005 en pesos de 2006, 2008 en pesos de 2009, 2010 en
  pesos de 2011. El `concepto` lo advierte, pero después **divide igual por el tipo de cambio de
  cierre del propio año**, que corresponde a la otra moneda. El efecto es una sobreestimación de entre
  6 % y 9 % en dólares justo en esos cuatro puntos, y una serie en pesos que alterna dos unidades de
  cuenta: 2010 aparece con USD 19,0 cuando el nominal, deflactado por el IPC 2011 (8,6 %) y convertido
  a $ 20,09, da del orden de USD 17,5; 2003 aparece con USD −3,8 cuando el nominal da del orden de
  −3,5. En el gráfico de resultados eso se ve como dientes de sierra. Y no es neutro por partido: los
  cuatro años inflados caen en los gobiernos de Batlle (2003), Vázquez I (2005, 2008) y Mujica (2010),
  mientras 2004, 2006, 2009 y 2011 quedan nominales. No hubo intención, pero el resultado es asimétrico
  y hay que arreglarlo.
- cita_de_contexto: "Resultado del ejercicio 259.482.576 382.632.011 / (*) Importes expresados en
  moneda homogénea de poder de compra del 31 de diciembre de 2011."
  (https://www.anp.com.uy/sites/default/files/archivos/parrafo-colapsable/2020-08/ANP%2B-%2BInforme%2BAuditor%C3%ADa%2Bal%2B31.12.2011.pdf)
  · "(*) Importes expresados en moneda homogénea de poder de compra del 31 de diciembre de 2004."
  (https://web.archive.org/web/20070611113240id_/http://www.anp.com.uy/institucional/estadoscontables/anp_31-12-2004.pdf)
- accion_sugerida: Elegir una convención y decirla **una vez** en `resumen`, con el precedente de
  ANTEL ("Hasta el ejercicio 2011 ANTEL reexpresaba sus estados contables por inflación…"). La que
  menos deforma: para los años que solo existen como comparativo reexpresado, convertir con el tipo de
  cambio de la fecha de la reexpresión (2003 → cierre 2004; 2005 → cierre 2006; 2008 → cierre 2009;
  2010 → cierre 2011) y decir en el `nota` del año que el peso está en moneda de esa fecha. Verifiqué
  que desde 2012-2013 los balances ya no reexpresan (ni "moneda homogénea" ni "(*)" aparecen en el
  balance de 2013), así que el problema se cierra en 2011.

### empresas[0] — `finanzas[*].impuestos_pagados` (definición del campo)
- severidad: corregir
- tipo: contexto_omitido
- objecion: El campo suma, bajo el rótulo "impuestos pagados", dinero que ANP **no pagó**: retención de
  IVA a proveedores, IRPF retenido a sus funcionarios, IRNR retenido a no residentes y la recaudación
  de la Ley 15.097 a favor de ANSE. El propio documento los separa en el título de la nota: "Impuestos
  **pagos** y montos **recaudados como agente de retención**". En 2018 son $ 244 millones de $ 1.081,5
  (22,6 %); en 2025, $ 550,9 de $ 1.709,6 (32 %), de los cuales $ 407,2 son la retención a favor de
  ANSE, que ni siquiera va a Rentas Generales. La descripción del esquema dice que este campo "es la
  mayor parte de lo que le pasa al Estado", y así medido no lo es. Aparte, hay tres cifras candidatas y
  se eligió una sin decirlo: en 2018 el estado de resultados registra "Impuesto a la renta (107.665.183)",
  el flujo de efectivo "Impuesto a la renta pagado (546.218.610)" y la nota "IRAE anticipos $ 500.782.741".
- cita_de_contexto: "d. Impuestos pagos y montos recaudados como agente de retención" y "El monto
  recaudado en el ejercicio 2025 por concepto de la Ley N° 15.097, retención a favor de A.N.S.E,
  ascendió a $407.247.192"
  (https://www.anp.com.uy/sites/default/files/archivos/parrafo-colapsable/2026-04/Estados%20Financieros%20ANP%20al%2031%20de%20diciembre%202025.pdf)
- accion_sugerida: Dejar en `impuestos_pagados` solo lo que ANP paga como contribuyente (Impuesto al
  Patrimonio, IRAE, tasa del Tribunal de Cuentas) y decir en un `concepto` de una oración que las
  retenciones se excluyen porque son de terceros. Si se prefiere mantener el total, el `concepto` tiene
  que decir cuánto es retención, año por año. **El mismo criterio hay que aplicarlo a ANCAP, ANTEL, UTE
  y OSE**, o el lector no puede comparar entre fichas.

### empresas[0] — `finanzas[2003].impuestos_pagados`
- severidad: corregir
- tipo: cita_fuera_de_contexto
- objecion: El valor es 150,0 millones pero la cita adjunta solo respalda 128,8 (Patrimonio 128,6 +
  IRIC 0,041 + tasa TCR 0,147). Los $ 19,05 millones de ANSE y los $ 2,20 de retribuciones personales
  que completan la suma están en bullets que quedaron fuera de esta cita y solo aparecen en la cita del
  registro de 2004. El lector que abra la nota al pie de 2003 no va a poder rehacer el número.
- cita_de_contexto: los bullets de la nota 23.d del balance 2004, en
  https://web.archive.org/web/20070611113240id_/http://www.anp.com.uy/institucional/estadoscontables/anp_31-12-2004.pdf
  (carácter 63.202)
- accion_sugerida: Completar la cita de 2003 con los bullets que faltan (o recortar el valor a lo
  citado, según cómo se resuelva la objeción anterior sobre retenciones).

### empresas[0] — `finanzas[2019].transferencias_al_estado` y `finanzas[2020].transferencias_al_estado`
- severidad: corregir
- tipo: contexto_omitido
- objecion: Los $ 365.509.560 se cuentan dos veces. En 2019 se registra el "monto **a verter**"
  (devengado, sin `concepto` que lo aclare) y en 2020 se registra el total efectivamente vertido, que
  **incluye esos mismos $ 365,5 millones** como pendientes del ejercicio anterior. Todos los demás años
  usan transferencias realizadas. En el gráfico, 2019 y 2020 suman USD 27,9 millones cuando la caja de
  esos dos años fue otra cosa. Mezclar devengado y caja en una serie es lo que deforma un gráfico.
- cita_de_contexto: "En el ejercicio 2020 la ANP realizó transferencias de fondos mensuales a la
  Tesorería General de la Nación totalizando $ 401.771.760. Además, se vertieron montos pendientes del
  ejercicio anterior por un total de $ 365.509.560. El monto total vertido en el ejercicio 2020 ascendió
  a $ 767.281.320. El monto a verter en el ejercicio 2019 a la Tesorería General de la Nación ascendió
  a $ 365.509.560."
  (https://www.anp.com.uy/sites/default/files/archivos/parrafo-colapsable/2021-04/ANP%202020%20-%20ESTADOS%20FINANCIEROS.pdf)
- accion_sugerida: Elegir una base (recomiendo caja, que es la que usan los otros 19 años: el renglón
  "Versión de resultados a Rentas Generales" del estado de flujos de efectivo, disponible en cada
  balance) y poner en el `nota` de 2020 una oración diciendo que ese año incluye el atraso de 2019.

### empresas[0] — `finanzas[*].transferencias_al_estado` (base legal)
- severidad: corregir
- tipo: contexto_omitido / documento_previsible
- objecion: Veinte años de transferencias a Rentas Generales y en ningún campo dice **por qué** ANP las
  hace ni quién fija el monto. No es un dividendo que decida el directorio: es una obligación legal, y
  el texto de la ley está en la misma nota del balance que el lote cita veinte veces sin citar ese
  párrafo. Sin eso, el lector lee la serie como si fuera una decisión de gestión.
- cita_de_contexto: "De acuerdo con el artículo 643 de la Ley 16.170 de fecha 28 de diciembre de 1990
  los entes autónomos y servicios descentralizados de dominio comercial e industrial del Estado, así
  como las empresas de propiedad estatal cualquiera sea su naturaleza deben verter la totalidad de sus
  resultados excepto aquellas partidas necesarias para el financiamiento de proyectos de inversión
  propios y coberturas de riesgos, a la Tesorería General de la Nación. El citado artículo otorgó
  potestad al Poder Ejecutivo para reglamentar los criterios técnicos aplicables para la determinación
  de resultados."
  (https://www.anp.com.uy/sites/default/files/archivos/parrafo-colapsable/2021-04/ANP%202020%20-%20ESTADOS%20FINANCIEROS.pdf,
  carácter 92.500 aprox.)
- accion_sugerida: Agregar un `hito` de 1990-12-28 con el art. 643 de la Ley 16.170 y su cita, y una
  oración en `resumen`. Documento previsible para el detalle anual: los artículos de cada Ley de
  Presupuesto y de Rendición de Cuentas que fijan el monto a verter (IMPO / MEF), que explican por qué
  el monto nominal se congela en $ 181.644.000 de 2011 a 2013 y salta después.

### empresas[0] — `finanzas[2013].deuda_financiera`
- severidad: corregir
- tipo: cita_fuera_de_contexto
- objecion: El valor es 950,0 millones y la cita dice 908.966.083. Falta el tramo corriente
  ($ 41.074.847), que está en otro renglón del mismo balance. Además la definición del campo cambia de
  año a año: 2009 y 2012 son solo el no corriente, 2013 es corriente + no corriente, y de 2018 en
  adelante son "Préstamos y obligaciones" corriente + LP. Aunque la suma dé bien, la serie no está
  definida igual en todos los puntos y la cita no la respalda.
- cita_de_contexto: "Deudas financieras 16 41.074.847 -" (pasivo corriente) y "Deudas financieras 16
  908.966.083 567.683.187" (no corriente); y en la nota de posición en moneda extranjera, el renglón
  que da las dos cosas de una: "Deudas financieras US$ 44.344.704 44.344.704 950.040.938 29.260.512
  567.683.193"
  (https://www.anp.com.uy/sites/default/files/archivos/parrafo-colapsable/2020-08/A%2BN%2BP%2B%2B-%2BEstados%2Bcontables%2Bal%2B31%2B12%2B2013.pdf)
- accion_sugerida: Usar el renglón de la nota de moneda extranjera, que trae el total en pesos y en
  dólares en una sola cita literal, y declarar la definición ("deuda financiera total, corriente más no
  corriente") una vez en `resumen` para los 21 años.

### empresas[0] — `finanzas[*].segmentos[]`
- severidad: corregir
- tipo: presentacion
- objecion: Tres cosas en un mismo campo. **(a)** Lo que hay adentro son **ingresos**, no resultado: el
  balance titula "Ingresos desagregados por puerto" e "Ingresos netos", y el propio `concepto` lo
  reconoce, pero la página va a dibujar la serie como "resultado por segmento" y el lector va a
  concluir que Nueva Palmira "ganó" USD 9,2 millones en 2025. **(b)** El `concepto` dice "en miles de
  pesos uruguayos" mientras el valor está cargado con `unidad: millones`: la nota al pie contradice la
  celda. **(c)** El mismo `concepto` de una línea se repite en 8 puertos × 10 años (unas 70 veces)
  cuando es una sola salvedad de la serie entera.
- cita_de_contexto: "b. Ingresos desagregados por puerto y grupo de servicios / Ingresos netos (en
  miles de pesos uruguayos): / Montevideo Colonia Fray Bentos Nueva Palmira Paysandú Sauce La Paloma
  Deportivos Totales 2025 Totales 2024 … Total proventos 7.818.147 290.863 181.880 357.674 7.955 6.332
  3.732 39.871 8.706.454 8.110.402"
  (https://www.anp.com.uy/sites/default/files/archivos/parrafo-colapsable/2026-04/Estados%20Financieros%20ANP%20al%2031%20de%20diciembre%202025.pdf)
- accion_sugerida: Que el `nombre` diga qué es ("Montevideo — ingresos") o que el editor deje una sola
  oración en `resumen` y en el `nota` de cada año: "los balances desagregan ingresos por puerto, no
  resultado". Sacar "en miles de pesos" de los `concepto`, porque el valor ya está en millones. Y
  chequear que el gráfico no muestre "0,0" para Salto en 2018 ($ 26.000) y 2013 ($ 82.000): o se
  publica con más decimales o se agrupa.

### empresas[0] — `finanzas[*].segmentos[].nombre: "Sauce"`
- severidad: corregir
- tipo: documento_previsible
- objecion: La ficha publica un puerto llamado "Sauce" en diez años con la salvedad "no se verificó a
  qué instalación corresponde este nombre". Un gráfico con un puerto que el sitio no puede identificar
  es una ficha que el lector no puede verificar. El dato es de acceso trivial: Puerto Sauce es el
  puerto de Juan Lacaze, y ANP tiene página propia de ese puerto en su sitio. El propio balance ya
  citado dice que en 1993 ANP recibió "el muelle comercial de Juan Lacaze", que es justamente el que
  falta como columna.
- cita_de_contexto: "Luego de dictado el Decreto 555/992 por actas suscritas en el año 1993 se
  formalizó la transferencia a ANP de las funciones de administración, conservación y desarrollo de los
  puertos de Nueva Palmira, Fray Bentos, Colonia, y el muelle comercial de Juan Lacaze."
  (https://www.anp.com.uy/sites/default/files/archivos/parrafo-colapsable/2026-04/Estados%20Financieros%20ANP%20al%2031%20de%20diciembre%202025.pdf)
- accion_sugerida: Abrir con `pnpm fuente` la ficha de ANP del puerto
  (`anp.com.uy/es/inicio/puertos/comerciales/juan-lacaze`) o el comunicado del MTOP sobre la
  incorporación de Puerto Sauce al régimen de puerto libre (`gub.uy/ministerio-transporte-obras-publicas`),
  y renombrar el segmento "Sauce (Juan Lacaze)" con esa fuente. Sacar la salvedad de los diez años.

### empresas[0] — `finanzas[2013].nota` (encabezado inferido)
- severidad: corregir
- tipo: presentacion
- objecion: La `nota` de 2013 ocupa 296 caracteres para explicar que el orden de columnas se infirió
  por continuidad. No hacía falta: el encabezado está en el mismo PDF, tres líneas arriba de la tabla
  que ya se citó, y coincide con lo que se infirió. Lo verifiqué.
- cita_de_contexto: "b. Ingresos desagregados por puerto y grupo de servicios / Ingresos de explotación
  / (En miles de pesos uruguayos y reexpresados al 31 de diciembre de 2013) / Montevideo Colonia Fray
  Bentos Nueva Palmira Paysandú Salto Sauce Total Total / 2013 2012"
  (https://www.anp.com.uy/sites/default/files/archivos/parrafo-colapsable/2020-08/A%2BN%2BP%2B%2B-%2BEstados%2Bcontables%2Bal%2B31%2B12%2B2013.pdf,
  carácter 84.728)
- accion_sugerida: Borrar la salvedad y agregar ese encabezado como cita. Ojo: ese mismo encabezado
  dice "reexpresados al 31 de diciembre de 2013", dato que la ficha no recoge.

### empresas[0] — `que_hace` y `hitos[]` (puertos que administra)
- severidad: corregir
- tipo: contexto_omitido
- objecion: `que_hace` enumera Nueva Palmira, Fray Bentos, Colonia, Juan Lacaze (1993) y los deportivos
  (2021), pero la ficha publica series de **Paysandú, Salto y La Paloma**, que nunca se explican. El
  lector ve puertos en el gráfico que el texto no menciona y no puede saber por qué aparecen o
  desaparecen columnas. Todo está en la misma Nota 1.2 que el lote ya cita 19 veces.
- cita_de_contexto: "Con fecha 20 de marzo de 2006 por Decreto 88/006 y con fecha 4 de abril de 2006
  por Decreto 108/006 se encomendó a ANP las funciones de administración, conservación y desarrollo de
  los Puertos de Paysandú y Salto respectivamente… Por Decreto 16/014 del 20 de enero de 2014, el MTOP
  transfirió a ANP las funciones de administración, conservación y desarrollo del Muelle N° 3 en la
  Terminal Portuaria de la Paloma, Departamento de Rocha. Por Decreto 954/008 de fecha 11 de agosto de
  2008, se encomienda a ANP las funciones de administración, conservación y desarrollo del Puerto de
  Sayago"
  (https://www.anp.com.uy/sites/default/files/archivos/parrafo-colapsable/2026-04/Estados%20Financieros%20ANP%20al%2031%20de%20diciembre%202025.pdf)
- accion_sugerida: Completar `que_hace` y agregar hitos de 1992-93 (Decreto 555/992), 2006 (Decretos
  88/006 y 108/006), 2008 (Decreto 954/008, Sayago) y 2014 (Decreto 16/014, La Paloma), cada uno con
  esa cita. Explica exactamente la aparición de Paysandú y Salto en 2006 y de La Paloma en 2017 en las
  tablas por puerto.

### empresas[0] — `comparaciones[0]` (CEPAL, TEUs 2023)
- severidad: corregir
- tipo: documento_previsible / presentacion
- objecion: La comparación la hizo la CEPAL y la fuente cargada es El Observador, que la reporta. La
  página imprime al medio como autor de la comparación, y la regla 10 de la lista de control dice que
  las comparaciones dicen quién las hizo. La nota misma nombra al autor y al alcance del estudio.
- cita_de_contexto: "El informe fue elaborado por la Comisión Económica para América Latina y el Caribe
  (Cepal) y relevó la actividad de 96 puertos de la región."
  (https://www.elobservador.com.uy/economia-y-empresas/puertos-regionales-montevideo-se-ubico-los-primeros-20-america-latina-n5989553)
- accion_sugerida: Documento previsible: el ranking de puertos de contenedores de la CEPAL (División de
  Comercio Internacional e Integración / Perfil Marítimo y Logístico de América Latina y el Caribe,
  `cepal.org`, edición de marzo de 2025 con datos 2023). Abrirlo con `pnpm fuente`, poner CEPAL como
  fuente y dejar la nota de El Observador como cobertura.

### empresas[0] — `comparaciones[1]` (Banco Mundial, CPPI 2023)
- severidad: corregir
- tipo: documento_previsible / presentacion
- objecion: Tres problemas en una fila. **(a)** La comparación la hizo el Banco Mundial y la fuente es
  La República. **(b)** Es un análisis con varias cifras de una misma fuente (puesto 384 de 405 en
  2023, 304 de 348 en 2022, 265 de 370 en 2021, más el método y el top 50): por la regla 9 de la lista
  de control le corresponde un registro de `analisis.yaml` con página propia y una sola fila en la
  ficha que lleve a ella, como ya se hizo con OSE y UTE (el validador emite ese aviso para esas dos
  fichas). **(c)** `valor_par` dice "la nota no da el puesto exacto de Buenos Aires": una comparación
  cuyo valor de comparación es "no lo sé" no es una comparación, y el informe original lo trae.
- cita_de_contexto: "El Índice de Desempeño Portuario de Contenedores (CPPI) de 2023 del Banco Mundial
  evaluó 405 puertos en todo el mundo. Montevideo ocupó un triste puesto 384."
  (https://www.lr21.com.uy/economia/1476058-banco-mundial-puerto-de-montevideo-es-uno-de-los-peores-del-mundo-incluso-por-debajo-de-buenos-aires)
- accion_sugerida: Documento previsible: *Container Port Performance Index 2023* (Banco Mundial con
  S&P Global Market Intelligence, publicado en junio de 2024, `documents.worldbank.org` /
  `worldbank.org/en/topic/ports`). Abrirlo con `pnpm fuente`, armar `analisis.yaml` con sujeto `anp`,
  autor Banco Mundial, `calificacion: discutible` de marcador en cada afirmación, y cotejar cada cifra
  contra el propio índice. Registrar el vínculo del autor como dato (organismo multilateral del que
  Uruguay es miembro), no como adjetivo.

### empresas[0] — `comparaciones[1]` (contexto omitido: la respuesta de ANP)
- severidad: corregir
- tipo: contexto_omitido / asimetria
- objecion: La ficha publica la medición desfavorable del Banco Mundial sin la objeción que ANP le hizo
  al método, aunque esa objeción está en una nota que el investigador ya leyó y citó para la otra
  comparación. Publicar el reproche y no la respuesta que estaba en la misma página es asimetría, y
  además le saca al lector lo más informativo: que las dos mediciones miden cosas distintas (volumen
  contra tiempo de escala) y por eso dan opuesto.
- cita_de_contexto: "Ese posicionamiento generó molestia en la Administración Nacional de Puertos (ANP)
  y motivó una reunión con representantes del organismo internacional. La intención fue conocer con
  mayor profundidad los parámetros utilizados para establecer la medición. Sin embargo, con el paso de
  los meses no hubo mayores avances sobre ese tema." / "El relevamiento de la Cepal contrarresta la
  mala visión del Banco Mundial sobre el desempeño de Montevideo"
  (https://www.elobservador.com.uy/economia-y-empresas/puertos-regionales-montevideo-se-ubico-los-primeros-20-america-latina-n5989553)
- accion_sugerida: Sumar esa cita al registro de `analisis` del CPPI (o a la fila, si no se hace el
  análisis) y decir en una oración qué mide cada índice.

### empresas[0] — `monopolio.argumentos_en_contra[2]` (nota de Comercio Exterior & Transporte)
- severidad: corregir
- tipo: cita_fuera_de_contexto / presentacion
- objecion: Dos cosas. **(a)** No es un argumento en contra del monopolio actual: es una nota
  conmemorativa de los 25 años de la Ley de Puertos que celebra la apertura de 1992, y la misma oración
  citada termina respaldando el rol de ANP: "la autoridad es el garante de que esto se cumpla". Ponerla
  como argumento en contra infla artificialmente ese lado y desbalancea la ficha. **(b)** La fuente es
  un estudio jurídico que republica; la propia página termina con "FUENTE: EL OBSERVADOR". La página va
  a imprimir a `fleitas` como autor del argumento.
- cita_de_contexto: "En otro orden, la ley de puertos terminó con el monopolio estatal, instauró la
  competencia y la autoridad es el garante de que esto se cumpla." / "FUENTE: EL OBSERVADOR"
  (https://fleitas.com.uy/25-anos-de-la-ley-de-puertos/)
- accion_sugerida: Sacarlo de `argumentos_en_contra`. Si se conserva como contexto histórico, buscar la
  nota original de El Observador de abril de 2017 (documento previsible: `elobservador.com.uy`,
  "25 años de la ley de puertos") en vez de la republicación, y no crear el medio `fleitas`.

### empresas[0] — `monopolio.argumentos_en_contra[0]` (Montecon)
- severidad: corregir
- tipo: riesgo_legal / documento_previsible
- objecion: La cita es literal y la denuncia es pública y atribuida, así que entra. Pero se publica una
  acusación contra ANP sin la respuesta de ANP y **sin desenlace**: el expediente 45/021 de la Comisión
  de Promoción y Defensa de la Competencia se menciona como referencia y no se dice en qué terminó.
  La regla de la casa —"los desenlaces se buscan con el mismo rigor que las acusaciones"— vale también
  cuando el acusado es una empresa pública y no una persona. Aparte, la nota no tiene captura de
  Wayback (`wayback ninguno`).
- cita_de_contexto: "Montecon pide en su denuncia a la Comisión de Promoción y Defensa de la
  Competencia que se investigue el sistema de asignación de muelles y las razones por las que no se
  asignan muelles públicos en el tiempo requerido"
  (https://www.montevideo.com.uy/Noticias/Montecon-denuncio-a-la-Administracion-Nacional-de-Puertos-por-falta-de-competencia-uc848134)
- accion_sugerida: Documento previsible: la resolución de la Comisión de Promoción y Defensa de la
  Competencia (MEF) en el expediente 45/021 y en la denuncia de 2023, publicadas en `gub.uy` (Dirección
  General de Comercio / Comisión de Promoción y Defensa de la Competencia). Buscar también la respuesta
  pública de ANP (la propia Montevideo Portal enlaza "Capitán de puerto de Montevideo explicó por qué
  no se atendió un buque"). Correr `pnpm archivar`.

### empresas[0] — `monopolio.argumentos_en_contra[1]` (navieras, 2021)
- severidad: corregir
- tipo: documento_previsible
- objecion: La cita sale de una crónica que explícitamente dice estar trabajando sobre la versión
  taquigráfica de una comisión parlamentaria. Existiendo el registro primario, citar al periodista baja
  el registro a `reportado` y le pide una segunda fuente que no necesitaría si estuviera bien
  clasificado. Es el caso exacto que describe `CLAUDE.md` en la definición de `textual`.
- cita_de_contexto: "afirmó, según la versión taquigráfica a la que accedió El Observador"
  (https://www.elobservador.com.uy/nota/navieras-preocupadas-por-futuro-monopolio-privado-en-puerto-de-montevideo-20216313130)
- accion_sugerida: Documento previsible: versión taquigráfica de la comisión de la Cámara de
  Representantes o del Senado que recibió a las agencias marítimas y navieras entre mayo y junio de
  2021 (`parlamento.gub.uy`, distribuidos y versiones taquigráficas). Sirve para las dos cosas: la cita
  de Grinschpun en primaria y, en la misma sesión, la posición del Poder Ejecutivo y de ANP, que es lo
  que le falta al lado "a favor".

### empresas[0] — `hitos[8]` (acuerdo de 2021 con Katoen Natie)
- severidad: corregir
- tipo: asimetria
- objecion: El `detalle` presenta como hechos de la ficha lo que son los considerandos del Poder
  Ejecutivo que firmó el acuerdo: "se pactan nuevas inversiones por unos USD 455-460 millones y una
  rebaja tarifaria". Que el decreto lo diga no lo convierte en hecho verificado; es la versión de una
  de las partes, y en la ficha aparece sin atribuir. Sumado a que la única otra fuente del hito es el
  presidente de ANP diciendo que no hay renegociación, el episodio más disputado de la historia
  reciente de ANP queda contado íntegramente desde el lado del Estado que lo firmó.
- cita_de_contexto: "que como consecuencia del acuerdo referido se solucionó el diferendo y se evitó el
  arbitraje internacional por un monto de US$ 1.500.000.000 … pactándose, además, la realización de
  nuevas inversiones por un monto estimado en US$ 455.000.000 … una sustancial rebaja tarifaria"
  (https://www.impo.com.uy/bases/decretos/114-2021/1)
- accion_sugerida: Atribuir en el `detalle` ("según los considerandos del Decreto 114/021") y agregar
  el otro lado con documentos que no sean judiciales, que los hay: la versión taquigráfica del llamado
  a sala / las comisiones parlamentarias de 2021 sobre el acuerdo con Katoen Natie
  (`parlamento.gub.uy`) y las declaraciones públicas de los partidos. Ver la nota de simetría del lote,
  más abajo: sin esto el brief termina filtrando un solo lado por efecto mecánico.

### empresas[0] — `finanzas[2024].resultado_ejercicio.concepto`
- severidad: corregir
- tipo: riesgo_legal / presentacion
- objecion: El `concepto` —382 caracteres, que la página imprime como nota al pie de una celda— afirma
  qué "reportó la prensa" ("ganancias de US$ 42 millones") sin ninguna fuente, y `notas.md` reconoce
  que esa nota **no se abrió en la corrida** ("solo mencionada por WebSearch"). Es una afirmación sobre
  un tercero identificable sin fuente, dentro de un campo visible.
- cita_de_contexto: —
- accion_sugerida: Borrar esa referencia del `concepto` y dejar la nota al pie en una oración. Si se
  quiere conservar la discrepancia con la prensa, abrir la nota con `pnpm fuente` y, si el medio
  publicó una cifra que no coincide con el balance, eso sí sería una `discrepancia` registrable.

### empresas[0] — `finanzas[2014, 2015].resultado_ejercicio.fuentes[1]` (cotizaciones)
- severidad: corregir
- tipo: cita_fuera_de_contexto
- objecion: La cita salta de la fila de encabezado a la del dólar sin marcar la elisión (falta la fila
  del euro) y deja afuera la etiqueta "Promedio Cierre", que es la única forma de saber que 27,293 y
  23,219 son promedios y 29,948 y 24,369 son cierres. La ficha usa bien los de cierre, pero el lector
  no puede comprobarlo con la cita que se le da.
- cita_de_contexto: "dic-15 dic-14 dic-15 dic-14 / Euro 30,323 30,744 32,684 29,629 / Dólar
  estadounidense 27,293 23,219 29,948 24,369 / Unidad Indexada 3,103 2,853 3,243 2,963 / Promedio
  Cierre"
  (https://www.anp.com.uy/sites/default/files/archivos/parrafo-colapsable/2020-08/balance_2015_0.pdf)
- accion_sugerida: Copiar el bloque completo, incluida la línea "Promedio Cierre".

### empresas[0] — `capitalizaciones_del_estado` (los 21 años vacíos)
- severidad: corregir
- tipo: presentacion
- objecion: El campo está vacío en los 21 años y en ningún lado se dice que **ANP no recibió aportes
  del Estado**. Un campo vacío se lee como "no lo buscamos". La afirmación está literal en los
  balances, año por año, y no se usó.
- cita_de_contexto: "La ANP no recibió subsidios en los ejercicios 2025 y 2024."
  (https://www.anp.com.uy/sites/default/files/archivos/parrafo-colapsable/2026-04/Estados%20Financieros%20ANP%20al%2031%20de%20diciembre%202025.pdf)
  · "La ANP no recibió subsidios en los ejercicios 2018 y 2017."
  (https://www.anp.com.uy/sites/default/files/archivos/parrafo-colapsable/2020-08/ANP%2B31%2B12%2B18_0.pdf)
- accion_sugerida: Una oración en `resumen` con esa cita, y no dejar el campo simplemente ausente. Es
  información favorable a la empresa y hay que buscarla con el mismo esfuerzo que la desfavorable.

### empresas[0] — `resumen` (falta) y cobertura del período
- severidad: corregir
- tipo: presentacion
- objecion: No hay `resumen` (lo escribe el editor, correcto), pero sin él la ficha incumple el punto 3
  de la lista de control: la página va a mostrar 2003-2025 con dos años ausentes y ocho años sin
  segmentos, sin decir que ANP existe desde 1916 ni por qué faltan. Aparte, `notas.md` se contradice:
  `cobertura_del_periodo` dice que "2016 y 2017 solo tienen el dato de resultado, impuestos,
  transferencias y deuda" y después que "2016 no tiene ningún dato"; en el YAML 2016 **no existe**, así
  que son 21 años de 23, no "2016 parcial".
- cita_de_contexto: —
- accion_sugerida: `resumen` con, como mínimo: rango cargado y desde cuándo existe ANP; por qué faltan
  2007 y 2016 (sin PDF con capa de texto; los de 2017 y 2021 son escaneos); la convención de moneda y
  tipo de cambio dicha una vez; qué es `impuestos_pagados` y qué es `segmentos`; que no hubo aportes
  del Estado; y desde cuándo hay deuda financiera y por qué (BID, Muelle C). Corregir `notas.md`.

### empresas[0] — `hitos[6]` (Muelle C / BID)
- severidad: corregir
- tipo: contexto_omitido
- objecion: El hito se queda en la aprobación del pliego y deja afuera lo que explica toda la serie de
  deuda: el contrato de préstamo con el BID por USD 40 millones firmado el 17/4/09 y el primer
  desembolso de USD 4 millones. Está tres líneas más abajo en la misma nota citada.
- cita_de_contexto: "La ANP ha firmado con fecha 17/4/09 el contrato de préstamo con dicho banco,
  número 2031/OC-UR. De acuerdo con los términos de dicho contrato el banco financiará U$S 40.000.000.
  Con fecha 18 de diciembre de 2009 se recibieron fondos rotatorios por un total de U$S 4.000.000
  (equivalentes a $ 78.548.000)"
  (https://anp.com.uy/sites/default/files/archivos/parrafo-colapsable/2020-08/ANP_31-12-09.pdf)
- accion_sugerida: Agregar un hito de 2009-04-17 con esa cita; explica de dónde sale la deuda de 2009
  en adelante mejor que el hito actual.

### empresas[0] — `concepto` y `nota` (largo) y `[sic]` dentro de `cita`
- severidad: corregir
- tipo: presentacion
- objecion: 25 campos `concepto` y 5 `nota` de año pasan los 200 caracteres (máximo 429, en
  `finanzas[2003].impuestos_pagados`), cuando la página los imprime como notas al pie de tabla y
  `CLAUDE.md` pide una oración. Y hay tres `[sic …]` metidos dentro de campos `cita`, que la página
  muestra como copia literal del documento; en dos de esos tres casos el `[sic]` acusa de un error al
  balance de ANP por un error nuestro.
- cita_de_contexto: —
- accion_sugerida: Recortar `concepto` a una oración; el detalle metodológico va al `resumen` o a
  `razones.md`. Ningún corchete editorial dentro de `cita`.

### empresas[0] — URLs y medios
- severidad: corregir
- tipo: presentacion
- objecion: El balance de 2025 está cargado con dos URLs distintas (`anp.com.uy/...` en
  `que_hace_fuentes[2]` y `www.anp.com.uy/...` en los 19 usos restantes): el mismo documento va a
  aparecer dos veces dentro del bloque plegado de ANP, contra el punto 2 de la lista de control. Lo
  mismo pasa con `elpais.com.uy` / `www.elpais.com.uy` y `montevideo.com.uy` / `www.`.
- cita_de_contexto: —
- accion_sugerida: Canonizar las URLs antes de promover (una sola forma por documento).

---

## Objeciones al lote

**Simetría entre gobiernos.** El período cubre seis presidencias (Batlle 2003-04, Vázquez I 2005-09,
Mujica 2010-14, Vázquez II 2015-19, Lacalle Pou 2020-24, Orsi 2025). Repasé si el detalle cambia según
quién gobernaba y encontré tres cosas que hay que declarar, aunque ninguna sea intencional:

1. Los cuatro años con moneda reexpresada y dólar sobreestimado 6-9 % (2003, 2005, 2008, 2010) caen
   todos en Batlle, Vázquez I y Mujica. El sesgo lo produjo un vacío del método, no una elección, pero
   el efecto es que el resultado de esos gobiernos se ve mejor de lo que fue en el gráfico.
2. Los segmentos por puerto faltan en bloque entre 2005 y 2012 (Vázquez I y Mujica) y en 2014, 2016,
   2021 y 2024. La causa es la disponibilidad de PDF, no la política, pero hay que decírselo al lector:
   un gráfico por puerto que arranca en 2013 con un dato suelto de 2004 se lee como si esos puertos no
   hubieran existido.
3. Los dos huecos totales, 2007 y 2016, caen en Vázquez I y Vázquez II. Mismo comentario.

**Simetría del debate portuario.** Acá hay un problema real y hay que nombrarlo. El episodio más
disputado de la historia reciente de ANP —la extensión de la concesión de TCP hasta 2081— entra a la
ficha **solo por el lado del Poder Ejecutivo que la firmó**: el Decreto 114/021, citado siete veces,
aporta el relato del acuerdo ("se solucionó el diferendo", "una sustancial rebaja tarifaria"), y la
única voz agregada es la del presidente de ANP diciendo que no se va a renegociar. Todo el lado
crítico quedó en `casos_vistos`, sin investigar, porque tomó forma de denuncia penal, demanda o pedido
de la Fiscalía, y el brief prohíbe investigar casos judiciales. La prohibición está bien; el efecto
combinado, no: dos reglas correctas producen una ficha con un solo lado. La salida no es investigar los
casos, es buscar el lado crítico en documentos que **no** son judiciales, que existen y son previsibles:
versiones taquigráficas del Parlamento de 2021 (comisiones y llamado a sala sobre el acuerdo con
Katoen Natie), el informe técnico que cuestionó la regularidad jurídica del acuerdo si es un documento
público, y los comunicados de los partidos. El mismo criterio se aplicaría si el signo estuviera al
revés.

**Balance de argumentos.** Queda 1 argumento a favor realmente sostenido por alguien (Supra, y sobre
dragado, no sobre el diseño legal) contra 3 en contra, de los cuales uno está mal clasificado. Las
fichas publicadas están en 4/3 (ANCAP) y 3/4 (ANTEL). `notas.md` reconoce honestamente que el lado a
favor costó más, y eso es lo correcto de hacer; pero registrar el esfuerzo no sustituye al resultado, y
las tres búsquedas hechas para ese lado fueron todas en web abierta, ninguna en el Parlamento ni en
Presidencia, que es donde está.

**Dependencia de un solo grupo.** No aplica en el sentido habitual: 191 de 202 fuentes son
`documento_oficial` (174 de ANP, 17 de IMPO) y las 11 notas se reparten entre El Observador (3),
El País, Montevideo Portal, La República, Ámbito y fleitas.com.uy — grupos distintos. La dependencia
que sí hay es **de la propia empresa**: ANP es a la vez sujeto y fuente de casi todo. Es inevitable y
es lo mismo que en ANCAP (245 de 313) y ANTEL (215 de 252), pero refuerza por qué las citas tienen que
ser literales: es el único control que le queda al lector.

**Casos vistos (para que el mantenedor decida, no para investigar acá).** El investigador hizo bien en
no investigarlos. Mi lectura de cuáles cumplen el umbral "amplio" del sitio, con su documento previsible:
- *Katoen Natie / TCP — citaciones a Fiscalía y demanda de Montecon contra el Estado*: cumple
  (investigación de Fiscalía y demanda presentada, ambas en fuente pública). Documento previsible:
  comunicados de Fiscalía General de la Nación (`fiscalia.gub.uy`) y la sentencia o resolución del
  tribunal. **Requiere compuerta humana** mientras no haya resolución.
- *Denuncia penal del Frente Amplio por la concesión*: cumple (denuncia formal presentada por personas
  identificables). Documento previsible: el escrito de la denuncia y la resolución de Fiscalía.
  Compuerta humana.
- *Reclamo de USD 1.500 millones de Katoen Natie*: no es un caso judicial contra una persona; ya está
  documentado en el propio Decreto 114/021 y es correcto tratarlo como hito, como se hizo.
- *Denuncia de Montecon ante la Comisión de Promoción y Defensa de la Competencia (exp. 45/021)*: es
  administrativo, no penal. No necesita compuerta, pero sí desenlace (ver objeción arriba).
- *Cocaína en un embarque de soja* y *denuncia de pagos extra en ANP*: la primera no es un caso contra
  ANP sino un hecho investigado por ANP; la segunda es una denuncia negada por el organismo, sin
  identificación clara del denunciante en lo que se leyó. Ninguna de las dos entra sin más trabajo.
- Si se abre una corrida de casos, se abre con el mismo umbral y el mismo esfuerzo de desenlace para
  todos, incluidos los que resultaron favorables a ANP o al gobierno de turno.

**Presentación (repaso de los diez puntos).** 1) Jerarquía de fuentes: bien, 191 primarias contra 11 de
prensa, pero hay que canonizar URLs para que el bloque de ANP no duplique documentos. 2) Un publicador,
una línea: se cumple sola por agrupación, salvo la duplicación de URL. 3) "Todo lo cargado": falta
declararlo (ver `resumen`). 4) Gráficos: la ficha da para tres (resultado, transferencias e impuestos;
deuda; ingresos por puerto) y los datos están, pero la serie de resultado tiene la mezcla de bases
monetarias y la de transferencias el doble cómputo 2019/2020. 5) Tablas limpias: `concepto` y `nota`
demasiado largos. 6) Títulos y análisis: pendiente del editor. 7) Audio y video: no aplica. 8) Ayudas
visuales: `hitos[]` existe (10) pero le faltan los cuatro decretos de puertos, el art. 643 y el
préstamo BID; con eso la línea de tiempo explica sola por qué aparecen y desaparecen columnas.
9) Análisis con página propia: el CPPI lo pide. 10) Quién hizo las comparaciones: las dos están mal
atribuidas.

**Medios faltantes.** `anp` y `fleitas`, los dos únicos errores de `pnpm validar --inbox` (175 errores,
todos de medio desconocido; esquema 0 errores). Para `anp`: `tipo: organismo` o el que usen `ancap` y
`antel`, sin grupo de medios, con `empresa: anp` apuntando a esta ficha. Aviso al editor: ya existe
`content/medios/anp-brasil.yaml` (Agência Nacional do Petróleo), así que el `nombre` del nuevo medio
tiene que desambiguar. Para `fleitas`: recomiendo no crearlo y buscar la nota original de El Observador.

**Discrepancias.** No hay `discrepancias.yaml` en este lote y explico por qué. Los cuatro candidatos que
miré no cumplen el umbral de "solo contra fuente primaria": el CPPI de La República habría que cotejarlo
contra el informe del Banco Mundial, que no abrí; la cifra de "US$ 42 millones" de El Observador para
2024 está en una nota que nadie abrió; la ley de 1909 que cita la columna de El País no la pude
contrastar con IMPO; y la crónica de las navieras habría que cotejarla contra la versión taquigráfica.
Los errores que sí encontré están en **nuestros registros** contra el documento, no en lo que publicó un
medio: eso es una objeción a la corrida, no una discrepancia. Cuando el editor consiga el informe del
CPPI y la versión taquigráfica, tres de los cuatro se vuelven verificables, y entonces habrá que
mirarlos con el mismo umbral en las dos direcciones.

---

## Objeciones al brief

El brief no viola la Regla 0: pide el mismo esfuerzo documental para los dos lados, con fuente cada uno,
y aclara que "un dirigente que defiende una regla no es un argumento en contra de esa regla" y que "la
imputación sobre quién hizo lobby no es un argumento". Eso está bien. Tres cosas que sí hay que
corregirle para la próxima:

1. **Interacción entre "documentá los dos lados del debate de 2021" (§3) y "no investigues casos
   judiciales" (§3.6).** Como casi toda la oposición documentada al acuerdo con Katoen Natie tomó forma
   judicial, las dos reglas juntas dejan la ficha con un solo lado. Versión simétrica: agregar al brief
   que, cuando un debate esté judicializado, el lado crítico se busca igual en documentos no judiciales
   (versiones taquigráficas, informes técnicos públicos, comunicados de partidos), y que si no se
   encuentra ninguno, se dice en `notas.md`.
2. **El brief no dice qué hacer cuando el único dato de un año viene de una columna comparativa
   reexpresada por inflación.** Ese vacío produjo la objeción de base monetaria. Versión corregida:
   "cada año en la moneda de su propio ejercicio; si el único dato es un comparativo reexpresado, se
   dice en el `nota` del año y se convierte con el tipo de cambio de la fecha de la reexpresión". Vale
   igual para ANCAP, ANTEL, UTE y OSE.
3. **El brief pide `impuestos_pagados` como "total de tributos" sin distinguir impuestos propios de
   retenciones de terceros.** Ese vacío produjo un campo que suma hasta un 32 % de plata que ANP
   recauda para otros. Versión corregida: definir el campo como lo que la empresa paga como
   contribuyente, con las retenciones aparte o declaradas en `concepto`, y aplicarlo a todas las
   fichas de empresas por igual.

Aparte, el brief pide `finanzas[]` "un ítem por año 2015-2024" y el investigador entregó 2003-2025. Eso
está bien y va en la dirección del punto 3 de la lista de control (mostrar todo lo que existe): no es
una objeción, es un acierto que conviene incorporar al brief tipo.

---

## Cobertura

Se leyeron ocho notas (siete de prensa más una republicación de un estudio jurídico). Emito registro de
tono solo para las dos que tratan a un partido, y digo por qué no emito las otras seis: en ninguna de
ellas aparece un político ni un partido como sujeto tratado, y forzar una atribución —decidir yo qué
gobierno "carga" con una nota crítica sobre el puerto— sería exactamente lo que la Regla 0 prohíbe. El
criterio se aplica igual a las notas favorables y a las desfavorables: por eso tampoco emito la de
La República, que es la más dura del lote.

```yaml
- medio: el-observador
  url: https://www.elobservador.com.uy/economia-y-empresas/entrega-soberania-multinacionales-el-choque-el-sindicato-portuario-y-jerarcas-anp-n6044952
  titulo: >-
    "Entrega de soberanía a multinacionales": el choque entre el sindicato portuario y jerarcas de ANP
  fecha: 2026-05-25
  evento: "propuesto: conflicto-dragado-anp-2026"
  partido: Frente Amplio
  tono: neutral
  justificacion: >-
    Da las dos posiciones del conflicto interno y no evalúa a ninguna: recoge al sindicato ("el dragado
    nacional se encuentra en una situación crítica producto de años de falta de inversión") y también a
    la contraparte ("En sectores de decisión del organismo asumen que la postura del sindicato es la
    antesala de la negociación salarial").

- medio: ambito
  url: https://www.ambito.com/uruguay/la-concesion-la-terminal-cuenca-del-plata-seguiria-manos-katoen-natie-2081-aseguro-presidente-la-administracion-nacional-puertos-n6191177
  titulo: >-
    La concesión de la Terminal Cuenca del Plata seguiría en manos de Katoen Natie hasta 2081, aseguró
    presidente de la Administración Nacional de Puertos
  fecha: 2025-09-16
  evento: "propuesto: acuerdo-katoen-natie-2021"
  partido: Frente Amplio
  tono: neutral
  justificacion: >-
    Reporta la posición del gobierno por boca del presidente de ANP sin calificarla, incluida su
    autocrítica sobre el Estado ("El Estado estuvo ausente en la planificación de la plataforma
    logística del Uruguay", denunció) junto a su defensa del acuerdo vigente.
```

Notas de prensa leídas sin registro de tono, con el motivo:

| medio | url | motivo |
|---|---|---|
| el-observador | .../navieras-preocupadas-por-futuro-monopolio-privado-en-puerto-de-montevideo-20216313130 | Transcripción de una comisión parlamentaria: solo habla el sector privado y el medio no evalúa. No nombra político ni partido. |
| montevideo-portal | .../Montecon-denuncio-a-la-Administracion-Nacional-de-Puertos-...-uc848134 | Relata el escrito de una empresa contra ANP. No nombra político ni partido. |
| el-observador | .../puertos-regionales-montevideo-se-ubico-los-primeros-20-america-latina-n5989553 | Reporte de un informe de CEPAL. No nombra político ni partido. |
| la-republica | .../1476058-banco-mundial-puerto-de-montevideo-es-uno-de-los-peores-del-mundo... | Evalúa al puerto con voz propia ("Montevideo ocupó un triste puesto 384"), pero no nombra político ni partido; atribuirle uno sería una inferencia mía. |
| el-pais | .../10-de-agosto-1916-fue-la-primera-reunion-de-directorio-de-la-anp | Columna de memorias sobre 1916-1933. Sin político ni partido actuales. |
| fleitas | https://fleitas.com.uy/25-anos-de-la-ley-de-puertos/ | Republicación de una nota de Comercio Exterior & Transporte / El Observador; menciona partidos en general ("no hay fuerza política que no la elogie"), ninguno en particular. |

Si el editor quiere puntuar estas seis, hay que crear antes los eventos correspondientes y decidir una
regla explícita —la misma para todos los partidos y todos los medios— sobre a qué gobierno se le imputa
la cobertura de una empresa pública. Yo no la invento acá.
