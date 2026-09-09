# Crítica — corrida 2026-09-07-empresas-bhu

Modelo: Opus 5 (claude-opus-5[1m]). Corro en Opus por la regla de modelos del mantenedor
(2026-09-07): el crítico es el único rol que lo hace. El investigador declaró `claude-sonnet-5`,
que es lo que la tabla de `CLAUDE.md` prevé. Sin desvío que reportar.

Lote: `inbox/empresas/bhu/2026-09-07/`
Registros revisados: 1 (`empresas.yaml`, un registro de empresa: 11 años de `finanzas[]`,
4 normas, 4 argumentos, 2 comparaciones, 9 hitos) + 3 fichas de medio.

Fuentes releídas en esta sesión con `pnpm fuente` (todas abiertas, ninguna citada de memoria):
balance BHU 2015, 2018, 2021, 2022, 2023, 2024; balance BHU 2008 y 2009 (Wayback, inventario del
sitio); balance BHU 2002 y 2006 publicados por el BCU; FSAP FMI/BM 2013; documento de trabajo 503
del BID; nota de El Observador 2022-02-22; nota de AEBU 2023-11-08; Ley 17.202 en IMPO.

---

## Tabla resumen

| # | Campo | Severidad | Tipo | Una línea |
|---|---|---|---|---|
| B1 | `finanzas[2006].capitalizaciones_del_estado` | bloquea | documento_previsible | USD 250 M es el techo legal; el balance de 2006 dice «Aportes de capital» vacío y los de 2008/2009 dicen que la capitalización fue de $ 582.785.837 el 9/3/2009 |
| B2 | `finanzas[]` / `hitos[2002]` | bloquea | documento_previsible | Falta la capitalización de 2002 que el brief pidió: el balance propio del BHU la trae, $ 19.936.777 miles, publicado por el BCU |
| B3 | `monopolio.argumentos_*` y `monopolio.tiene` | bloquea | asimetria | Los dos «en contra» pegan exactamente en los dos privilegios del `alcance`; ninguno de los dos «a favor» los toca. Y `tiene: false` apaga la validación de doble lado que sí corre en BROU |
| C1 | `monopolio.argumentos_en_contra[0]` | corregir | cita_fuera_de_contexto | Une la frase del FSAP sobre BHU con una recomendación del resumen ejecutivo que es sobre BROU |
| C2 | `monopolio.argumentos_a_favor[0]` | corregir | contexto_omitido | La misma nota de AEBU critica al BHU («se haya centrado en objetivos comerciales») y a la ley de deudores en UR; el registro solo recoge la mitad |
| C3 | `finanzas[2022].resultado_ejercicio.fuentes[0]` | corregir | cita_fuera_de_contexto | La cita es «3. PATRIMONIO …», no contiene la cifra cargada, y sale del bloque consolidado |
| C4 | `finanzas[2022].nota` | corregir | contexto_omitido | El «anticipo de resultados» de $ 638.962.000 es la suma exacta de los otros dos vertidos, no una tercera distribución |
| C5 | `finanzas[2021].transferencias_al_estado` | corregir | contexto_omitido | Criterio de caja: al 31/12/2021 y al 31/12/2022 los $ 306,6 M seguían dentro de otros pasivos |
| C6 | `finanzas[].transferencias_al_estado` (2015, 2016, 2018-2020, 2022) | corregir | presentacion | Ausente donde el documento dice cero, en la misma tabla que ya se cita para capitalizaciones |
| C7 | `hitos[1996-09-27]`, `que_hace`, `monopolio.alcance` | corregir | contexto_omitido | El artículo 35 de la Ley 16.774 no existía en 1996: lo agregó la Ley 17.202, promulgada el 24/09/1999 |
| C8 | 13 campos `concepto` / `nota` | corregir | presentacion | Pasan de 300 caracteres; van al pie de la tabla y son una oración |
| C9 | `finanzas[2017].nota` | corregir | presentacion | Termina en un fragmento colgado: «Detalle en notas.md. contable puntual.» |
| C10 | `monopolio.alcance` | corregir | presentacion | Nombra cinco bancos privados competidores sin fuente y al menos uno cambió de dueño |
| C11 | `finanzas[2024].nota` | corregir | documento_previsible | «No se investigó a fondo esa relación» sobre una caída de $ 10.320 M que el mismo PDF explica en «3. HECHOS RELEVANTES — Ley 20.237» |
| C12 | `hitos[]` | corregir | presentacion | Faltan la capitalización de 2002, la de 2009, la Carta Orgánica de 1915 y el fideicomiso de 2024 |
| C13 | cobertura documental | corregir | documento_previsible | Nunca se corrió `pnpm inventario bcu.gub.uy`; los balances del BHU están ahí desde 2001 |
| C14 | línea de cobertura | corregir | presentacion | La ficha cubre 2015-2024 y un 2006 fantasma; el BHU existe desde 1892 y sus balances desde 2001 |
| C15 | `finanzas[2017].impuestos_pagados` | corregir | presentacion | Mezcla de bases: 2017 en criterio pre-NIIF, 2018-2024 en criterio NIIF; BROU 2017 usa el otro |
| C16 | `comparaciones[0]`, `comparaciones[1]` | corregir | cita_fuera_de_contexto | «TEA» no está en la nota; la cita de la primera comparación no contiene el 3,75 % del BHU |
| A1 | `comparaciones[]` | aviso | presentacion | Dos comparaciones de una nota de 2.896 caracteres que reproduce una gacetilla del BHU |
| A2 | `comparaciones[]` | aviso | sin_objecion | Hay dos comparaciones con autor identificable sin cargar: BID 2004 (80 % del mercado) y el propio balance 2018 (morosidad 1,40 %) |
| A3 | `finanzas[2018]` | aviso | presentacion | Sin `cotizacion` ni `usd`: hueco en la serie en dólares, que el gráfico debe dibujar como «?» |
| A4 | `finanzas[].segmentos` | aviso | presentacion | Correcto y citado, pero BROU sí trae segmentos: decirle al lector por qué uno sí y otro no |
| A5 | `finanzas[].deuda_financiera` | aviso | presentacion | Ausente en los diez años; el BHU sí emite OHR ($ 18.374.931.949 al 31/12/2023) |
| A6 | `fuentes: []` | aviso | presentacion | Verificar que el agrupado «un publicador, una línea» colapse los ~40 PDF del BHU |
| A7 | `medios/anv-gub-uy.yaml` | aviso | sin_objecion | Ficha de medio creada sin que ninguna fuente del lote la use |
| A8 | `tipo: ente_autonomo` | aviso | sin_objecion | Declarado con incertidumbre reconocida en `notas.md` |
| A9 | validación mecánica | aviso | sin_objecion | 63 errores de referencia, todos «medio desconocido» (`bhu`, `aebu`) |
| A10 | validación de red | aviso | sin_objecion | Falta `pnpm validar:red` sobre este lote |

**3 bloquea · 16 corregir · 10 aviso.**

---

## Objeciones por campo

### B1 — `finanzas[2006].capitalizaciones_del_estado` — USD 250 millones

- severidad: **bloquea**
- tipo: documento_previsible
- objecion: El registro carga como «lo que el Estado puso» el **monto máximo que una ley autorizó**,
  y el `concepto` lo admite («esta cifra es el techo legal, no una capitalización contable
  verificada»). El diccionario de campos es explícito: `capitalizaciones_del_estado` es «lo que el
  Estado puso en la empresa», del documento que dice qué pasó. Peor: los tres documentos que
  contradicen la carga estaban al alcance de una llamada. El balance del BHU al 31/12/2006 —que el
  BCU publica— muestra la línea «Aportes de capital» **vacía** en el ejercicio 2006, con el capital
  integrado inmóvil en 23.311.777 miles entre 2005 y 2006. Y los balances de 2008 y 2009 dicen que
  la capitalización del artículo 124 de la Ley 18.046 se ejecutó **el 9 de marzo de 2009** por
  **$ 582.785.837**, no por USD 250 millones. Al tipo de cambio de esos días eso es del orden de
  USD 25 millones: un décimo de lo que la ficha le va a mostrar al lector, en un año equivocado.
- cita_de_contexto (balance 2006, publicado por el BCU,
  `https://web.archive.org/web/20130903032816id_/http://www.bcu.gub.uy/Servicios-Financieros-SSF/Estados%20Contables%20Auditados/balaudi_200612_0091.pdf`):
  «ESTADO DE EVOLUCION DEL PATRIMONIO DEL 1° DE ENERO AL 31 DE DICIEMBRE DE 2006 … SALDO AL
  31.12.2005 23.311.777 0 13.922.834 0 (36.573.477) 661.134 … Aportes de capital / Distrib. de
  utilidades / Adelanto de resultados … SALDO AL 31.12.2006 23.311.777 0 13.852.728 0 (36.477.117)
  687.388»
- cita_de_contexto (balance 2009, nota 3.21.1,
  `https://web.archive.org/web/20210517230918id_/https://www.bhu.com.uy/media/1227/balance_2009.pdf`):
  «3.21.1 – Capitalización de 9 de marzo de 2009. Con fecha 9 de marzo de 2009 el Banco fue
  capitalizado por $ 582:785.837. La capitalización ha operado de acuerdo a lo establecido en el
  artículo 124 de la Ley N° 18.046, de 24 de octubre de 2006 y en el Decreto del Poder Ejecutivo
  del 27 de febrero de 2009. En ese marco, el Ministerio de Economía y Finanzas (MEF) ha asumido
  pasivos netos del BHU por un valor de $ 11.860:963.199 y ha recibido activos en forma de créditos
  contra patrimonios fiduciarios por un valor de $ 11.278:177.362.»
  (11.860.963.199 − 11.278.177.362 = 582.785.837: la aritmética cierra sola.)
- cita_de_contexto (mismo balance 2009, estado de evolución del patrimonio, cifras en miles de
  pesos): «SALDO AL 31.12.08 modificado 23.311.777 0 13.947.910 0 -32.444.949 4.814.738 / **Aportes
  de capital 5.343.273** … SALDO AL 31.12.09 28.655.051 0 14.696.781 0 -32.054.497 11.297.335»
- accion_sugerida: **Sacar el año 2006 de `finanzas[]`.** La autorización legal ya está donde
  corresponde, en `hitos[2006-10-24]`. Cargar en su lugar `finanzas[2009].capitalizaciones_del_estado`
  con el documento. Ojo: hay **dos cifras distintas y las dos están en el mismo balance de 2009** —
  la capitalización neta de la nota 3.21.1 ($ 582.785.837) y el aumento de capital integrado del
  estado de evolución del patrimonio ($ 5.343.273 miles). No las concilié en esta corrida; el
  resolvedor tiene que leer el balance 2009 completo (74.041 caracteres, ya en el corpus, sha
  `29b8cd5028ab43cd6fec8ca384f478102737b233`) y decir cuál es «lo que el Estado puso» y qué es la
  otra, con `nota` de una oración. Mientras no se concilie, el año va a `probable`, no ausente.

### B2 — `finanzas[]` y `hitos[2002-08-04]` — la capitalización de 2002 que el brief pidió

- severidad: **bloquea**
- tipo: documento_previsible
- objecion: El brief lo pidió con nombre y apellido («Las capitalizaciones del Estado al BHU en la
  crisis de 2002 y en la reestructura de 2007 … registralas en `capitalizaciones_del_estado` del año
  que corresponda aunque quede fuera de 2015-2024»). `notas.md` lo declina con este argumento: «no
  hay, en el propio texto de la ley, un monto exclusivamente atribuible al BHU … No se localizó un
  balance propio de BHU de 2002 (el inventario del sitio no tiene documentos de ese año)». Las dos
  premisas son ciertas por separado y la conclusión es falsa: no hace falta repartir el fondo de la
  Ley 17.523 entre BROU y BHU, porque **el BHU asentó su propio aporte de capital de 2002 en su
  propio estado de evolución del patrimonio**, y ese balance existe: lo publica el BCU. La ficha,
  tal como está, le dice al lector que el Estado puso USD 250 M en 2006 (que no puso) y no le dice
  que puso $ 19.936,8 millones en 2002 (que sí puso), en el año en que el banco perdió
  $ 22.831,3 millones. Eso no es un hueco: es un retrato invertido.
- cita_de_contexto (balance BHU 2002 publicado por el BCU,
  `https://web.archive.org/web/2013id_/http://www.bcu.gub.uy/autoriza/sieras/balaudi_200212_0091.pdf`):
  «PERDIDA DEL EJERCICIO DESPUES DE IMPUESTOS (20.961.355) (1.869.946) (22.831.301) … Estado de
  Evolución del Patrimonio por el ejercicio anual finalizado el 31 de diciembre de 2002. En Miles de
  Pesos Uruguayos … SALDO AL 31.12.01 1 0 11.039.265 0 (7.602.850) 3.436.416 … **Aportes de capital
  19.936.777** … SALDO AL 31.12.02 19.936.778 0 13.040.885 0 (30.771.693) 2.205.970»
- accion_sugerida: Cargar `finanzas[2002]` con `resultado_ejercicio` (−$ 22.831,3 M) y
  `capitalizaciones_del_estado` ($ 19.936,8 M), con la cotización que declare ese mismo balance, y
  un hito de capitalización 2002 al lado del que ya existe sobre el traspaso de depósitos. La misma
  fuente da los dos números. Mismo criterio que se aplicó a ANCAP, UTE y ANTEL cuando se les
  extendió la serie hacia atrás.

### B3 — `monopolio` — los dos lados no discuten lo mismo, y la validación de doble lado está apagada

- severidad: **bloquea**
- tipo: asimetria
- objecion: Dos problemas encadenados.
  **(a) Los argumentos no se cruzan.** El `alcance` identifica dos privilegios legales: la garantía
  del Estado (art. 8 de la Carta Orgánica) y la ejecución extrajudicial (art. 80). Los dos
  `argumentos_en_contra` pegan exactamente ahí: el FSAP sobre la garantía, el BID sobre la ejecución
  extrajudicial. Ninguno de los dos `argumentos_a_favor` los menciona: AEBU defiende que exista un
  banco público de vivienda y que no se fusione con el BROU; Arana (2006) explica para qué sirve la
  reestructura. Son buenos argumentos sobre otra pregunta. El resultado, para el lector, es que los
  privilegios tienen dos críticas documentadas y cero defensas documentadas, y eso no es lo que dice
  el mundo: son dos reglas de 1915 que sobrevivieron a la Ley 16.774, a la Ley 18.125 y a la
  reforma de la Carta Orgánica, y alguien las defendió cada una de esas veces.
  **(b) `tiene: false` apaga el control.** El `superRefine` de `src/schemas/empresa.ts` exige un
  argumento de cada lado **solo si `monopolio.tiene`**. `content/empresas/brou.yaml`, que es el otro
  banco del Estado, con la misma estructura de párrafo y la misma garantía en su carta orgánica,
  declara `tiene: true`:
  «BROU no tiene un monopolio sobre la actividad bancaria en general: compite con nueve bancos
  privados de plaza. Tiene tres privilegios legales ajenos a esa competencia. Primero, la garantía
  del Estado…».
  El BHU declara `tiene: false` con el párrafo espejo: «El BHU no tiene hoy un monopolio legal sobre
  el crédito hipotecario: compite con Santander, BBVA, Itaú… Conserva, sin embargo, dos privilegios
  legales frente a la banca privada». Dos fichas hermanas, misma situación jurídica, banderas
  opuestas: en una el esquema exige los dos lados y en la otra no. Es Regla 0 aplicada de manera
  desigual entre dos empresas del mismo dueño.
- accion_sugerida: (1) El editor fija **un** criterio para las dos fichas —`tiene` describe si hay
  actividad reservada o privilegio legal, y entonces las dos van en `true`; o describe monopolio de
  mercado, y entonces las dos van en `false` y la regla del doble lado se hace cumplir a mano— y lo
  deja escrito. Cambiar BROU es una corrección de tipo `presentacion` o `cambio_de_rating`, no un
  cambio de lo afirmado. (2) Buscar, con el mismo esfuerzo que se puso en el FSAP y el BID, un
  argumento a favor **de cada uno de los dos privilegios**, en palabras de quien lo sostiene. Rutas
  concretas, todas previsibles: la versión taquigráfica de la discusión de la Ley 18.125 en la
  Comisión de Vivienda y en el plenario (Hemeroteca del Parlamento, `biblioteca.parlamento.gub.uy`,
  hay inventario en `.cache/inventarios/`), donde el Poder Ejecutivo defendió mantener la Carta
  Orgánica; la exposición de motivos del proyecto; y la propia AEBU o el BHU sobre por qué la
  garantía del artículo 8 debe seguir. Si después de buscarlo no aparece, se dice eso en `notas.md`
  con las búsquedas hechas —que es lo que el brief pide— y no se publica un solo lado sin decirlo.

### C1 — `monopolio.argumentos_en_contra[0]` — dos pasajes del FSAP unidos en uno

- severidad: corregir
- tipo: cita_fuera_de_contexto
- objecion: El `texto` dice: «los bancos estatales BROU y BHU tienen garantías de depósito totales…
  **para promover mayor igualdad de condiciones entre bancos, las autoridades deberían considerar
  designar al Banco Central … como depositario único de los fondos del gobierno**». Las dos mitades
  existen en el informe, pero están en secciones distintas y la segunda no es sobre el BHU. La
  primera es el ítem (iv) del párrafo 43, en la sección «D. Deposit Insurance». La segunda está en
  el resumen ejecutivo, en un párrafo cuyo sujeto es el BROU: la otra medida que propone en la misma
  oración —extender la retención de haberes a todos los bancos— está expresamente limitada al BROU.
  Presentar esa recomendación como un argumento contra el diseño del BHU le atribuye al FMI y al
  Banco Mundial algo que no dijeron de este banco.
- cita_de_contexto (`https://www.imf.org/external/pubs/ft/scr/2013/cr13152.pdf`, resumen ejecutivo):
  «Leveling the playing field between public and private institutions might inject additional
  dynamism in the financial sector. Possible measures include extending the ability to make payroll
  deductions for debt service to all banks—currently limited to BROU—and designating the Central
  Bank of Uruguay (BCU) as the sole depository of government funds.»
- cita_de_contexto (mismo informe, párrafo 43): «…and (iv) state banks BROU and BHU have blanket
  deposit guarantees mandated by their charters, providing them with a competitive advantage.»
- accion_sugerida: Dejar el argumento con la primera mitad sola, que es exacta y está en contexto, y
  citar el párrafo 43 con su encabezado («However, a number of issues arise…») para que se vea que
  es un listado de problemas del marco de seguro de depósitos. La recomendación del depositario
  único, si se quiere usar, va a la ficha de BROU, donde ya está el privilegio al que corresponde.

### C2 — `monopolio.argumentos_a_favor[0]` — la mitad de la nota de AEBU

- severidad: corregir
- tipo: contexto_omitido
- objecion: La nota de AEBU tiene 4.151 caracteres y la leí entera. El registro toma de ella la
  defensa de las instituciones públicas de vivienda y omite que en el mismo texto AEBU **critica al
  BHU por hacer exactamente lo que la ficha describe en `que_hace`** (competir con la banca privada
  en crédito hipotecario), y que critica la solución de los deudores en UR por cargarla contra el
  patrimonio del banco. Presentado así, AEBU queda como un defensor liso del diseño actual cuando
  su posición es «que exista, pero que haga otra cosa». Además, la crítica omitida es material para
  la ficha: es la única voz cargada que dice algo sobre el costo que la Ley 20.237 le puso al BHU,
  que es el mismo hecho que la `nota` de 2024 deja sin investigar (ver C11).
- cita_de_contexto (`https://www.aebu.org.uy/noticias/40032`): «Sin embargo, AEBU lamenta que el BHU
  en lugar de cumplir su rol como agente de política pública de vivienda, se haya centrado en
  objetivos comerciales y en competir con la banca privada en el mercado de créditos hipotecarios.»
  Y: «El informe también aborda la solución que ha sido propuesta para los deudores en UR, que
  descarga el costo sobre el patrimonio del BHU. Esta solución es vista con preocupación, ya que no
  se ofrece un resarcimiento por la decisión política tomada.»
- accion_sugerida: Completar el `texto` del argumento a favor con la salvedad, o —mejor— partirlo en
  dos: la defensa de la institución pública como `argumentos_a_favor`, y la crítica al giro
  comercial y a la Ley 20.237 como un argumento propio, con su cita. No es «un dirigente que
  defiende una regla», que el brief descarta: es la misma fuente diciendo dos cosas distintas.

### C3 — `finanzas[2022].resultado_ejercicio.fuentes[0]` — cita que no contiene la cifra, del bloque consolidado

- severidad: corregir
- tipo: cita_fuera_de_contexto
- objecion: La primera fuente del resultado de 2022 tiene por `cita` «3. PATRIMONIO 40.555.363.251
  37.905.353.542». No contiene la cifra que el registro carga (3.292,4 M) y, en el PDF, esa línea
  está dentro del bloque **consolidado**: la línea de resultado de ese mismo bloque es
  «3.1.8. Resultado del ejercicio 3.292.876.146 2.602.383.595», que **no** es la cifra cargada. La
  cifra cargada (3.292.386.558) es la individual y está bien elegida —la confirma la columna
  comparativa individual del balance de 2023—, pero la fuente que la respalda es la segunda, no la
  primera. El diccionario prohíbe mezclar bloques por esto mismo: «Individual, no consolidado. Las
  subsidiarias tienen sus propios balances; mezclar bloques cambia el número».
- cita_de_contexto (balance 2022,
  `https://www.bhu.com.uy/sites/default/files/2023-11/balance-bhu-con-dictamen-31122022_compressed.pdf`):
  «3. PATRIMONIO 40.555.363.251 37.905.353.542 … 3.1.8. Resultado del ejercicio 3.292.876.146
  2.602.383.595 … 3.1.9. (Anticipos de resultados) 638.962.000- - -» y en el renglón siguiente del
  documento: «Estado de Resultados Consolidado comparativo».
- cita_de_contexto (balance 2023, comparativa individual,
  `https://www.bhu.com.uy/sites/default/files/inline-files/Balance%2031122023%20con%20dictamen%20individual%20y%20consolidado.pdf`):
  «Resultados de operaciones continuas después de impuestos 749.346.280 3.292.386.558»
- accion_sugerida: Sacar la fuente de la línea «3. PATRIMONIO» y dejar como primera fuente la del
  estado de cambios en el patrimonio individual del propio balance de 2022, o la comparativa
  individual del balance de 2023. La misma revisión hay que hacerla en 2019, 2020 y 2021, cuyas
  citas «3.1.8. Resultado del ejercicio …» pueden venir del mismo bloque; los números cargados
  coinciden con la cadena individual (2.834.774.142 → 1.720.270.311, 2.797.782.975 → 2.834.774.142,
  2.599.295.840 → 2.797.782.975), así que es un problema de qué cita se muestra, no de qué cifra se
  cargó.

### C4 — `finanzas[2022].nota` — qué es el «anticipo de resultados» de $ 638.962.000

- severidad: corregir
- tipo: contexto_omitido
- objecion: `notas.md` dedica una sección a decir que este punto «es el punto más incierto de la
  corrida» y que hay una «contradicción aparente» entre «sigue como pasivo pendiente» (2022, 2023) y
  «distribuido en ejercicios anteriores» (2024). No hay contradicción, y el propio documento la
  resuelve en la misma nota: **$ 638.962.000 es la suma exacta de los dos vertidos que la ficha ya
  carga por separado**, 306.600.000 + 332.362.000. No es una tercera distribución ni un pago
  adicional: es la cuenta reguladora del patrimonio «(Anticipos de resultados)» donde se acumula lo
  ya distribuido antes de la afectación formal de resultados, y por eso la Resolución de Directorio
  0271/24 de agosto de 2024 la compensa contra resultados acumulados junto con los $ 400.000.000 de
  julio de 2024 (638.962.000 + 400.000.000 = 1.038.962.000, que es el total que la nota 21 de 2024
  declara). La `nota` de 2022, tal como está —«En 2022 el BHU registró un "anticipo de resultados"
  de $ 638.962.000 con cargo a Rentas Generales»—, se lee como un tercer vertido y va a hacer que
  alguien lo sume.
- cita_de_contexto (balance 2023, nota 21, «Versión a Rentas Generales»): «El sado de anticipo de
  resultados asciende a $ 638.962.000. En diciembre 2021, por el Art. 65 … se volcó a rentas
  generales un total de $ 306.600.000. En diciembre 2022, por el Art. 64 … se registró un pasivo por
  concepto de utilidades líquidas a verter a rentas generales por un total de $ 332.362.000. Al 31
  de diciembre de 2023 se canceló el pasivo, no habiendo saldos pendientes de pago.»
- cita_de_contexto (mismo balance, estado de cambios en el patrimonio individual, ejercicio 2022):
  «4.7 - Distribución de dividendos/Remuneración a los socios 306.600.000 638.962.000- 332.362.000-
  332.362.000-» — es decir, $ 306,6 M salen de resultados acumulados, $ 638,962 M entran en la
  cuenta de anticipos, y el efecto neto sobre el patrimonio del ejercicio es $ 332,362 M.
- accion_sugerida: Reescribir la `nota` de 2022 en una oración que diga qué es: «la cuenta
  "(Anticipos de resultados)" del patrimonio acumula al cierre de 2022 los dos vertidos a Rentas
  Generales ($ 306,6 M de diciembre de 2021 y $ 332,4 M de diciembre de 2022) y se compensó contra
  resultados acumulados en agosto de 2024». Y sacar de `notas.md` el párrafo que declara la
  incertidumbre, porque ya no la hay.

### C5 — `finanzas[2021].transferencias_al_estado` — devengado cargado como caja

- severidad: corregir
- tipo: contexto_omitido
- objecion: El diccionario es tajante: `transferencias_al_estado` es «lo que la empresa **vertió en
  efectivo** a Rentas Generales en el año (criterio de caja), no lo devengado», y la regla
  transversal 3 lo repite. El balance de 2021 —el documento del propio ejercicio— dice que los
  $ 306,6 M eran una previsión aprobada el 29/12/2021 y registrada como pasivo, no un pago; y el
  balance de 2022 dice que al 31/12/2022 el conjunto de $ 638.962.000 (que los incluye) «se registró
  dentro de otros pasivos». El único documento que declara la cancelación es el de 2023. El propio
  investigador vio la tensión y la anotó en la `nota` de 2021, pero eligió «la fecha que dan los dos
  documentos posteriores» —que usan «se volcó» de manera laxa— por encima del balance del ejercicio,
  que es la regla del sitio.
- cita_de_contexto (balance 2021, nota 21,
  `https://www.bhu.com.uy/sites/default/files/inline-files/bhu-eeff-individuales-y-cosolidados-emisores-2021.pdf`):
  «El 29/12/2021 se aprobó el Presupuesto … Por Art. 65 del mismo, **se prevé verter** a Rentas
  Generales un total de $ 306.600.000 … por concepto de utilidades líquidas generadas en el
  ejercicio 2020. **Dicha obligación se registró dentro de otros pasivos.**»
- cita_de_contexto (balance 2022, nota 21): «El sado de anticipo de resultados asciende a
  $ 638.962.000. **Dicha obligación se registró dentro de otros pasivos.**»
- accion_sugerida: La lectura que sostienen los tres balances es: caja 2021 = 0 (con cita), caja
  2023 = $ 638,962 M (los dos vertidos, cancelados «no habiendo saldos pendientes de pago»), caja
  2024 = $ 400 M. Si el editor prefiere no reasignar sin el estado de flujos de efectivo, la
  alternativa correcta es dejar 2021 y 2023 como están **y** decir en la `nota` de los dos años que
  el criterio ahí es el del devengamiento presupuestal y no el de caja, para que la serie no mezcle
  convenciones en silencio. Documento previsible que lo cerraría: el estado de flujos de efectivo de
  los balances 2022 y 2023 (renglón de actividades de financiación), o la Rendición de Cuentas del
  MEF del ejercicio correspondiente, que lista los ingresos a Rentas Generales por ente.

### C6 — `finanzas[].transferencias_al_estado` en 2015, 2016, 2018, 2019, 2020 y 2022 — ausente donde el documento dice cero

- severidad: corregir
- tipo: presentacion
- objecion: Seis de los diez años no tienen `transferencias_al_estado`, y las `nota` dicen «no se
  encontró nota de "Rentas Generales"». Pero la tabla que ya se cita en esos mismos años para
  `capitalizaciones_del_estado` —el estado de evolución del patrimonio— trae el renglón de
  distribución al lado del de capitalizaciones. En 2017 el investigador lo hizo bien y cargó cero
  con la cita entera («Aportes de capital 0 / Distribución de utilidades 0 / Adelantos de resultados
  0 / Creación de reservas 0 / Capitalizaciones 0»); en 2015 y 2016 recortó la misma cita y se
  quedó solo con las dos últimas líneas. En los años NIIF el renglón es «4.7 - Distribución de
  dividendos/Remuneración a los socios». El diccionario distingue: «Cero con cita cuando el
  documento dice que no hubo; ausente cuando no se encontró». Un hueco en la columna de
  transferencias se lee como «no se sabe» cuando el balance dice «no hubo».
- accion_sugerida: Cargar cero con cita en los seis años, extendiendo la cita que ya está en el
  registro para `capitalizaciones_del_estado`. No hace falta abrir ningún documento nuevo.

### C7 — `hitos[1996-09-27]`, `que_hace` y `monopolio.alcance` — la fecha del fin del privilegio

- severidad: corregir
- tipo: contexto_omitido
- objecion: Tres campos afirman que el BHU compite con la banca privada «desde 1996», y el hito está
  fechado el 1996-09-27. El artículo 35 de la Ley 16.774 —el que derogó la exclusividad— **no existía
  en 1996**: lo agregó la Ley 17.202, promulgada el 24/09/1999. El propio registro lo cita bien en
  `monopolio.normas[1]` («artículo 35 en la redacción dada por el artículo 1° de la Ley 17.202») y
  después se contradice al fechar el hecho en la ley de base. Segundo problema, más de fondo: lo que
  el artículo 3 declaraba privilegio exclusivo era «la emisión de títulos, bonos y obligaciones
  hipotecarias», no el otorgamiento de préstamos con garantía hipotecaria. El `que_hace` toma de la
  página de historia del BHU la frase «hasta entonces el BHU tenía el monopolio de esa línea de
  créditos», que dice más que el artículo que el mismo registro reproduce dos campos más abajo.
- cita_de_contexto (`https://www.impo.com.uy/bases/leyes/17202-1999`): «LEY DE FONDOS DE INVERSION.
  Promulgación: 24/09/1999 Publicación: 01/10/1999 … Artículo 1(*) (*)Notas: Este artículo **agregó**
  a: Ley Nº 16.774 de 27/09/1996 artículos 30, 31, 32, 33, 34, **35**, 36, 37, 38, 39, 40, 41, 42,
  43, 44, 45 y 46.»
- cita_de_contexto (Carta Orgánica consolidada por el BHU, artículo 3): «Declárase privilegio
  exclusivo del Estado **la emisión de títulos, bonos y obligaciones hipotecarias**, los cuales serán
  emitidos por intermedio del Banco de que trata esta ley.»
- accion_sugerida: Refechar el hito al 1999-09-24 (o 1999-10-01, publicación) y cambiar su título.
  En `que_hace` y `alcance`, describir el privilegio por lo que decía el artículo (emisión de
  títulos y obligaciones hipotecarias) y separar eso del hecho, cierto y con otra fuente, de que la
  banca privada entró al crédito para vivienda en los años noventa —el propio BID lo dice: «A partir
  de los años 90, algunas instituciones privadas se interesaron en la actividad de préstamos
  hipotecarios». No usar la página de historia del banco como autoridad sobre una fecha legal cuando
  la ley está en IMPO.

### C8 — 13 campos `concepto` / `nota` pasan de 300 caracteres

- severidad: corregir
- tipo: presentacion
- objecion: `CLAUDE.md` (sección Empresas públicas): «`concepto` y `nota` son una oración, porque van
  como notas al pie de la tabla». El validador solo mira `nota` y por eso avisó de dos; contando los
  `concepto`, que la página también imprime en la celda, son trece:
  2006.capitalizaciones (566), 2017.resultado (499), 2017.impuestos (487), 2021.transferencias (345),
  2022.nota (322), 2020.impuestos (322), 2021.impuestos (322), 2024.impuestos (320),
  2022.impuestos (320), 2018.impuestos (319), 2019.impuestos (319), 2023.impuestos (315),
  2015.nota (312). Los dos de 2017 son de tres oraciones cada uno.
- accion_sugerida: Una oración por campo. La convención que se repite en ocho años —«suma del
  impuesto a la renta y de impuestos, tasas y contribuciones»— va **una sola vez** en el `resumen`,
  como se hizo con las convenciones de ANCAP y ANTEL, y en cada año queda el número y nada más. Lo
  que no entre, al `resumen` o a un `<details>` (punto 12 de la lista de control).

### C9 — `finanzas[2017].nota` — texto roto

- severidad: corregir
- tipo: presentacion
- objecion: La nota termina así: «…la diferencia entre el original ($ 2.341,7 M) y el reexpresado
  ($ 2.362,5 M) es de 0,9%. Detalle en notas.md.\n contable puntual.» El fragmento «contable
  puntual.» quedó colgado de una frase que se borró. Va a salir impreso al pie de la tabla.
- accion_sugerida: Reescribir la nota en una oración.

### C10 — `monopolio.alcance` — cinco competidores sin fuente

- severidad: corregir
- tipo: presentacion
- objecion: «compite con Santander, BBVA, Itaú, Scotiabank y HSBC en ese segmento desde 1996». Ni la
  Carta Orgánica ni el FSAP ni el BID —las tres fuentes del campo— traen esa lista, y al menos uno
  de los nombres dejó de existir como tal en plaza (HSBC Uruguay fue vendido a BTG Pactual). Es una
  enumeración con apariencia de dato en un campo que la página imprime como texto de la ficha.
- accion_sugerida: O se saca la lista y se dice «compite con los bancos privados de plaza», o se
  cita la nómina de instituciones de intermediación financiera autorizadas que publica el BCU, con
  fecha. Además, `alcance` tiene 1.574 caracteres: por el punto 12 de la lista de control, lo que
  exceda un párrafo va plegado.

### C11 — `finanzas[2024].nota` — «no se investigó a fondo» algo que el mismo PDF explica

- severidad: corregir
- tipo: documento_previsible
- objecion: La nota registra que la cartera cayó de $ 58.805,3 M a $ 48.485,1 M «coincidente con la
  migración de los créditos en UR a la ANV dispuesta por la Ley 20.237» y cierra con «no se
  investigó a fondo esa relación». El balance de 2024 que ya está citado seis veces en el registro
  tiene una sección entera sobre eso, con cifras, fechas y contrapartida. Dejarlo sin leer convierte
  el movimiento más grande del año en una insinuación.
- cita_de_contexto (balance 2024, «3. HECHOS RELEVANTES — Ley 20.237»): «Con fecha 23 de mayo de
  2024 se suscribió el contrato constitutivo del Fideicomiso Financiero – Fideicomiso Solución de
  Deudores en UR, migrándose a la Agencia Nacional de Vivienda (Fiduciario), la cartera de deudores
  en UR alcanzada por la Ley … y reconociendo como contrapartida un certificado de participación en
  el dominio fiduciario por un valor de UR 7.954.608,94. El fideicomiso tiene como beneficiario al
  BHU. … El artículo 4° fue aplicado en el mes de diciembre 2024, alcanzó a las deudas de 533
  beneficiarios por un capital total de UR 507.507,10.» Y, en 2.2: «En diciembre 2024 el Fideicomiso
  Solución de deudores en UR ajustó la provisión en forma genérica por la aplicación de la Ley
  20.237 … Dicho ajuste fue una ganancia de UR 643.054.»
- accion_sugerida: Reescribir la `nota` de 2024 diciendo que la caída de la cartera es la migración
  al fideicomiso, con el certificado de participación como contrapartida (o sea, cambio de
  instrumento, no pérdida de valor), y agregar un hito 2024-05-23 con la constitución del
  fideicomiso y otro con la extinción de las 533 deudas de diciembre de 2024. Eso, además, le da al
  lector el otro lado de la crítica de AEBU (C2): AEBU dice que la solución «descarga el costo sobre
  el patrimonio del BHU» y el balance dice cuál fue el costo y cuál la contrapartida.

### C12 — `hitos[]` — faltan los hechos que la ficha existe para contar

- severidad: corregir
- tipo: presentacion
- objecion: Nueve hitos, contra 13 en AFE, 14 en UTE y ANTEL, 16 en BROU y 19 en ANCAP. Falta
  justamente lo que el esquema nombra («creación, leyes que cambiaron el negocio, crisis,
  capitalizaciones, reestructuras»): la capitalización de 2002 ($ 19.936,8 M, B2), la capitalización
  del 9/3/2009 (B1), la Carta Orgánica de 1915 (Ley 5.343), que es la norma de los dos privilegios
  que la ficha discute, la constitución del fideicomiso de 2024 (C11) y el cambio de marco contable
  a NIIF en 2018, que es lo que explica el quiebre de formato de toda la serie.
- accion_sugerida: Cargarlos, cada uno con la fuente que ya está en el lote o en el corpus. La
  línea de tiempo es horizontal (punto 13 de la lista de control), así que agregar hitos no
  desordena la página.

### C13 — cobertura documental: el regulador no se miró

- severidad: corregir
- tipo: documento_previsible
- objecion: La regla transversal 6 del diccionario nombra al BCU con todas las letras: «El inventario
  antes que la memoria: `pnpm inventario <dominio>` (Wayback y sitemap) del sitio de la empresa **y
  del regulador que la supervisa** (el BCU publica los estados contables de cada banco y de cada
  aseguradora por año en `www.bcu.gub.uy`, desde 2005: los balances 2015-2019 del BSE "no existían"
  hasta que se miró ahí)». `consultas.jsonl` no tiene ninguna corrida de `pnpm inventario`, ni sobre
  `bhu.com.uy` ni sobre `bcu.gub.uy`; el inventario del BHU se leyó pero no se usó para los años
  anteriores a 2015, y el del BCU está filtrado a seguros. **Respuesta concreta a la pregunta del
  encargo: sí, los balances del BHU están en el BCU.** El BHU es la institución 0091 y sus estados
  contables auditados se publican como `balaudi_AAAAMM_0091.pdf`:
  - 2001 a 2005: `http://www.bcu.gub.uy/autoriza/sieras/balaudi_200112_0091.pdf` … `balaudi_200512_0091.pdf`
  - 2006 a 2011: `http://www.bcu.gub.uy/Servicios-Financieros-SSF/Estados%20Contables%20Auditados/balaudi_200612_0091.pdf` … `balaudi_201112_0091.pdf`
  Abrí el de 2006 y el de 2002 y los dos son del BHU (ver B1 y B2); los tamaños de los de 2008-2011
  coinciden byte a byte con los `balance_AAAA.pdf` del propio sitio del BHU, así que es el mismo
  documento por dos caminos. Las URL de hoy dan 404 y se leen por Wayback con `id_`.
  2012-2014 no están en esa carpeta (la última captura de Wayback es de 2013): el BCU los movió al
  buscador de Registros (`https://www.bcu.gub.uy/Servicios-Financieros-SSF/Paginas/buscador_Registros.aspx`),
  y además el inventario del propio BHU tiene `balance_2012.pdf` y `balance_2013.pdf`. De 2014 el
  inventario solo tiene `memoria-2014.pdf`; el balance de 2014 hay que sacarlo del buscador de
  Registros del BCU o de la memoria.
- accion_sugerida: Correr `pnpm inventario bcu.gub.uy --filtro "balaudi"` antes de cerrar el lote y
  dejar la serie 2001-2024 sin huecos, como se hizo con ANCAP (2000-2024), UTE (2003-2024) y ANTEL
  (1997-2024) en las correcciones de estos días. No es simetría opcional: es el mismo criterio para
  la cuarta empresa que para las tres anteriores.

### C14 — línea de cobertura para el lector

- severidad: corregir
- tipo: presentacion
- objecion: Punto 3 de la lista de control: «Un botón que dice "todo" muestra todo lo que existe
  públicamente. Si la ficha no lo tiene cargado, el botón dice el rango que hay … y una línea dice
  desde cuándo existe la empresa y que el resto se va a cargar hasta donde haya documentos. Ocultar
  años sin decirlo es faltar a la Regla 0: el lector piensa que la empresa nació ese año». La ficha
  arranca en 2015 con un 2006 suelto que además está mal (B1). El BHU existe desde 1892 y sus
  balances auditados existen desde 2001.
- accion_sugerida: `resumen` con la línea de cobertura explícita, o cargar la serie hacia atrás
  (C13), que es lo que se hizo en las otras cuatro fichas.

### C15 — `finanzas[2017].impuestos_pagados` — dos bases en la misma serie

- severidad: corregir
- tipo: presentacion
- objecion: 2016 y 2017 usan el «Total» de la nota 6 del balance pre-NIIF (IRAE + Patrimonio + IVA +
  Tasa de Control + Otros); 2018 a 2024 usan impuesto a la renta (corriente + diferido) más
  «Impuestos, tasas y contribuciones». En 2017 las dos bases conviven y difieren: $ 1.722,1 M contra
  $ 1.647,6 M. El `concepto` lo declara y elige la propia, con un argumento razonable. Pero
  `content/empresas/brou.yaml` resolvió el mismo empalme al revés: para 2017 usó la columna
  comparativa NIIF. Dos bancos, mismo año de transición, criterios opuestos. Verifiqué que los
  componentes empalman: el «Impuestos, tasas y contribuciones» de 2017 en formato NIIF
  ($ 663.543.277) es exactamente la suma de Patrimonio + IVA + Tasa + Otros de la nota 6 de 2017
  ($ 523.097 + 60.160 + 53.281 + 27.018 = $ 663.556 miles, contra $ 663.543 miles: 13 mil pesos
  de diferencia sobre 663 millones), así que la diferencia
  entera está en el impuesto a la renta.
- accion_sugerida: El editor fija una convención y la aplica a las dos fichas, con una línea en el
  `resumen` de cada una. Cualquiera de las dos sirve; tener una distinta por ficha, no.

### C16 — `comparaciones[0]` y `comparaciones[1]` — «TEA» no está en la nota, y falta la cita del propio valor

- severidad: corregir
- tipo: cita_fuera_de_contexto
- objecion: Los cuatro campos de valor dicen «TEA» (tasa efectiva anual). Leí la nota entera (2.896
  caracteres) y la sigla no aparece: dice «una tasa del 3,9% en unidades indexadas (UI)» y «pasando
  de un 5% de interés a un 3,75%». Agregar «TEA» es precisar algo que la fuente no precisa, y en
  tasas la convención cambia el número. Además, la `cita` de la primera comparación solo contiene el
  lado de Santander e Itaú: el 3,75 % del BHU —el `valor_propio`— no está en el fragmento citado.
- cita_de_contexto (`https://www.elobservador.com.uy/nota/fuerte-baja-en-la-tasa-hipotecaria-del-bhu-para-competir-con-fuerza-con-los-bancos-privados-2022222164933`):
  «"Con el fin de adaptar las tasas de interés a las necesidades de sus clientes, el Banco
  Hipotecario del Uruguay (BHU) adecuó su tarifario, pasando de un 5% de interés a un 3,75% para
  aquellos empleados públicos o asalariados que soliciten préstamos a 10 años por la mitad del valor
  del inmueble a adquirir, sin importar si son o no ahorristas de la entidad financiera", informó el
  BHU por medio de una gacetilla de prensa.» Y, seis líneas después: «el banco estatal indicó que se
  mantiene el criterio de aplicar una tasa variable en función de la operación, lo que implica tener
  en cuenta el perfil de cada cliente, las características del préstamo y el porcentaje que se
  financia de la vivienda comprada.»
- accion_sugerida: Sacar «TEA»; agregar como segunda fuente de cada comparación el párrafo del
  3,75 %; y decir en `valor_propio` que es el piso de un tarifario variable y que venía de 5 %. Por
  el punto 10 de la lista de control («las comparaciones dicen quién las hizo»), conviene que quede
  visible que la cifra del BHU sale de una gacetilla del propio banco y que quien puso las tres una
  al lado de la otra fue El Observador.

### A1 — dos comparaciones de una sola nota

- severidad: aviso
- tipo: presentacion
- objecion: Las dos comparaciones salen de la misma URL. El validador avisa a partir de tres, así
  que no salta, y a mi juicio **no** corresponde `analisis.yaml`: la colección es para «un análisis
  con cifras hecho por un centro de estudios, una consultora, un sindicato, una cámara o un medio»,
  y esto es una nota de 2.896 caracteres que reproduce una gacetilla. Lo digo para que quede
  registrado que lo miré: si el editor agrega una tercera comparación de la misma nota, cruza el
  umbral y hay que hacer la página.

### A2 — comparaciones con autor identificable que quedaron afuera

- severidad: aviso
- tipo: sin_objecion (es un aporte, no una falta del registro)
- objecion: `notas.md` dice que la cuota de mercado no se pudo cargar porque «las fuentes con ese
  número son blogs inmobiliarios sin autor identificable» y el informe de la ANV solo la trae en
  gráficos. El número con autor está en el documento del BID que el investigador ya leyó y ya cita
  dos veces. Y la comparación de morosidad que el brief pedía está en el balance de 2018.
- cita_de_contexto (BID, documento de trabajo 503, sección 1 «Motivación»): «hasta las estimaciones
  más optimistas de la importancia del sector privado conceden que el BHU concentra alrededor de
  80% del total del mercado hipotecario.»
- cita_de_contexto (balance BHU 2018, «RIESGO DE CRÉDITO»): «determinó que el BHU lograra reducir la
  morosidad a 1,40% en diciembre de 2018, un nivel muy bajo en términos históricos y alineado con
  los parámetros de morosidad de hipotecarios de la banca privada.»
- accion_sugerida: Cargar las dos, cada una con su período (BID: mercado a 2002-2004; morosidad:
  diciembre de 2018) y con quién la hizo. La del BID es de 2004 y hay que decirlo en el `periodo`,
  no maquillarlo.

### A3 — `finanzas[2018]` sin cotización ni dólares

- severidad: aviso
- tipo: presentacion
- objecion: 2018 es el único año de la serie sin `usd`. Busqué la nota de tipo de cambio en ese
  balance con tres términos y no la encontré, así que la declaración del investigador es plausible.
  Pero el efecto es un hueco en el gráfico en dólares.
- accion_sugerida: Mirar la nota de «posición en moneda extranjera» o las bases de preparación del
  balance 2018 antes de darlo por perdido; si no está, dejarlo ausente y verificar que el gráfico lo
  dibuje como «?» con el motivo en el globo y un guion en la tabla, nunca como cero (punto 11 de la
  lista de control).

### A4 — `segmentos[]` vacío en los diez años

- severidad: aviso
- tipo: presentacion
- objecion: Está bien y está citado: el banco declara «un único segmento de negocio». Lo señalo
  porque `content/empresas/brou.yaml`, el otro banco, sí trae `segmentos` en 2017-2024, y un lector
  que compare las dos fichas va a ver una vacía y otra llena sin saber por qué.
- accion_sugerida: Una oración en el `resumen` con la cita del banco. No hay nada que cargar.

### A5 — `deuda_financiera` ausente en los diez años

- severidad: aviso
- tipo: presentacion
- objecion: El criterio («en un banco los pasivos son depósitos y valores del negocio, no deuda»)
  es el mismo de BROU y es defendible. Con una salvedad que BROU no tiene: el BHU emite Obligaciones
  Hipotecarias Reajustables, que son deuda de mercado con renglón propio.
- cita_de_contexto (balance 2023): «Dentro de Otros débitos representados por valores negociables se
  informan las Obligaciones Hipotecarias Reajustables (OHR) emitidas por el BHU» — «Total
  18.374.931.949 17.885.188.662».
- accion_sugerida: Decidir una vez y decirlo en el `resumen`, no dejarlo solo en `notas.md`, que no
  se publica.

### A6, A7, A8, A9, A10 — menores

- `fuentes: []` en la raíz: válido por esquema, pero toda la lista de fuentes de la página se va a
  armar desde los campos; conviene mirar en `pnpm dev` que el agrupado «un publicador, una línea»
  (punto 2) colapse los ~40 PDF del BHU en una sola línea con los documentos plegados, con los
  organismos públicos (IMPO, BCU, Presidencia, FMI, BID) antes que El Observador.
- `medios/anv-gub-uy.yaml` se creó pero ninguna fuente del lote usa `medio: anv-gub-uy`. O se cita
  el informe de mercado inmobiliario de la ANV, o la ficha de medio no va todavía.
- `tipo: ente_autonomo`: la incertidumbre está bien declarada en `notas.md`. El documento que la
  cierra es la Sección XI de la Constitución más la Carta Orgánica; el editor decide si vale la
  búsqueda.
- `pnpm validar --inbox` da 63 errores de referencia y **todos** son «medio desconocido» para `bhu`
  y `aebu`, que es exactamente lo que el brief admite. Esquema: 0 errores.
- Falta `pnpm validar:red` sobre el lote. Las citas de riesgo son las que vienen de tablas con
  tabuladores y de páginas OCR: 2015 «Creación de reservas 2.782 -2.782 0 / Capitalizaciones 0 0»,
  y las filas «4. - Otras variaciones del patrimonio neto …» de 2018 a 2024.

---

## Objeciones al lote

**Cobertura del período.** Diez años cargados con documento propio de cada ejercicio, todos leídos,
todos con cita del renglón: eso está bien hecho y hay que decirlo. El problema no es el período
pedido sino el que el brief pidió además y quedó a medias: 2002 y 2006-2009, que es donde está la
plata que el Estado puso. Y el problema estructural es C13: no se miró al regulador, que es la
regla que el diccionario escribió después de que pasara lo mismo con el BSE.

**Dependencia de una sola fuente.** La ficha se apoya casi enteramente en documentos del propio BHU
y en IMPO. Para las cifras eso es correcto y es lo que el sitio prefiere. Para los hechos no
contables —desde cuándo compite, cuánto mercado tiene, qué le costó la Ley 20.237— la ficha usa la
página institucional del banco como si fuera fuente neutral, y ahí falla dos veces (C7 y C11). El
contrapeso natural (BCU, ANV, Parlamento) no se consultó. `notas.md` dice «no se detectó una falta
de cobertura por medio»: sí la hay, y es la del regulador y la del Parlamento, no la de la prensa.

**Simetría.** Además de B3, dos cosas para el editor:
- El lote no tiene sesgo partidario detectable. Las capitalizaciones que faltan (2002, 2009) son de
  gobiernos de dos signos distintos (Batlle, Vázquez), y la que sobra (2006) también. Los vertidos
  a Rentas Generales cargados son de 2021, 2023 y 2024, o sea de dos administraciones. No veo
  selección por color.
- Lo que sí hay es un sesgo de esfuerzo hacia lo que está en PDF y en inglés. Los dos argumentos
  «en contra» son documentos de organismos internacionales, largos y con buscador; los dos «a favor»
  son una nota sindical y una gacetilla de Presidencia de 2006. `consultas.jsonl` muestra búsquedas
  de los dos lados —una a favor («AFBHU sindicato … defensa banca pública vivienda») y dos en contra
  («crítica BHU banco estatal ineficiencia privatizar competencia desleal…»)—, así que la intención
  fue simétrica; lo que faltó fue ir al Parlamento, que es donde la defensa de estas reglas está
  escrita.

**Lo que el lote hace bien y conviene no romper al corregir.** Las citas de renglón son literales y
verificables una por una; la aritmética de `usd = pesos / cotizacion` cierra en los once montos que
la traen; la elección del individual sobre el consolidado es la correcta en los diez años (aunque
una cita se haya ido al bloque equivocado, C3); el tratamiento del año 2015 sin `impuestos_pagados`
es ejemplar —verifiqué el PDF y la tabla de la nota 6 efectivamente no está en la capa de texto, y
declarar el dato faltante en vez de cargar el IRAE solo es exactamente lo que el diccionario pide.

---

## Objeciones al brief

Ninguna violación de la Regla 0. El brief pide los dos lados con el mismo esfuerzo, pide desenlaces,
no pide omitir nada ni encuadrar según partido o persona, y su punto 4 anticipa con precisión el
error que igual se cometió («argumentos sobre el diseño legal … no sobre un episodio suelto»).

Dos observaciones de proceso, no de objetividad:

1. El brief acotó `finanzas[]` a «un ítem por año 2015-2024» y, en el mismo párrafo, pidió cargar
   las capitalizaciones de 2002 y 2007 «aunque quede fuera de 2015-2024». La instrucción es
   coherente pero el rango explícito le dio al investigador una excusa para no abrir el balance de
   2008 que sí figuraba en el inventario («no se abrió en esta corrida porque el período pedido por
   el brief es 2015-2024»). Para los briefs de empresa que vengan: decir el rango **y** decir que el
   inventario del regulador se corre siempre, sea cual sea el rango.
2. El «Inventario de documentos» agregado el 2026-09-09 nombra `bhu.com.uy` y no nombra al BCU,
   aunque el diccionario sí lo hace. Agregarle una línea al brief («y `pnpm inventario bcu.gub.uy
   --filtro balaudi` para cualquier banco o aseguradora») habría evitado B1, B2 y C13.

---

## Discrepancias

**No escribo `discrepancias.yaml` en este lote.** Encontré un candidato y lo dejo acá, con las dos
citas, para que la decisión quede a la vista y no se pierda:

- La página de historia del BHU (`https://www.bhu.com.uy/sobre-bhu/historia`, publicador registrado
  como `medio: bhu`) dice: «Desde 1996 compite en préstamos hipotecarios con los bancos privados;
  hasta entonces el BHU tenía el monopolio de esa línea de créditos». El documento primario dice dos
  cosas distintas: el privilegio del artículo 3 de la Carta Orgánica era «la emisión de títulos,
  bonos y obligaciones hipotecarias», no el otorgamiento de préstamos; y la derogación es de la Ley
  17.202, promulgada el 24/09/1999, cuyo artículo 1 **agregó** el artículo 35 a la Ley 16.774 de
  1996 (IMPO, `https://www.impo.com.uy/bases/leyes/17202-1999`).

Por qué no lo registro: la colección de discrepancias existe para medir «si lo publicado coincide
con el documento» en la **cobertura de prensa**, y se normaliza por veces citado. La contraparte acá
no es un medio cubriendo un hecho político: es la página institucional del propio sujeto de la
ficha. Si abro la colección con eso, el mismo umbral aplicado a todas las páginas de «historia» de
todos los organismos la llena de material que no mide lo que la colección dice medir. Queda como
objeción C7, que es donde hace falta que esté. Si el editor decide que las páginas institucionales
cuentan como `medio` a estos efectos, el registro está listo con estas dos citas y el mismo criterio
tiene que valer para la página de historia de ANCAP, de UTE y de cualquier otro ente.

No encontré, en las dos notas de prensa del lote, ninguna afirmación que contradiga un documento
primario que yo tenga.

---

## Cobertura

```yaml
- medio: el-observador
  url: https://www.elobservador.com.uy/nota/fuerte-baja-en-la-tasa-hipotecaria-del-bhu-para-competir-con-fuerza-con-los-bancos-privados-2022222164933
  fecha: 2022-02-22
  evento: propuesto:tasas-credito-hipotecario-bhu-2022
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    La nota tiene una frase evaluativa sobre la gestión comercial del banco ("La banca privada
    aprovechó ese cierto letargo del principal jugador del mercado uruguayo para lanzarse con más
    fuerza en ese nicho de la banca") y la atribuye en parte a la administración ("Al inicio de la
    nueva administración de gobierno, las autoridades del BHU habían manejado que dada las
    restricciones presupuestales el banco iba a reducir su publicidad"), pero no evalúa a ningún
    político ni partido, y la segunda mitad reproduce sin contradecirla la gacetilla del BHU,
    incluida la afirmación de que "el BHU ha alcanzado el liderazgo a través una gestión adecuada".
    Queda en neutral por defecto.

- medio: aebu
  url: https://www.aebu.org.uy/noticias/40032
  fecha: 2023-11-08
  evento: propuesto:deudores-en-ur-bhu-2023
  politico: lacalle-pou
  tono: desfavorable
  justificacion: >-
    Es la publicación de un sindicato sobre su propio informe, y trata desfavorablemente a las
    iniciativas del gobierno de turno sobre el BHU y sobre los deudores en UR: "El informe del
    Consejo Central destaca como un logro haber podido evitar que se debatiera la fusión del BROU y
    el BHU, una iniciativa que habría debilitado la capacidad de este último para cumplir con su
    misión", y sobre el proyecto de deudores en UR, que "descarga el costo sobre el patrimonio del
    BHU. Esta solución es vista con preocupación, ya que no se ofrece un resarcimiento por la
    decisión política tomada". Marco desfavorable con cita, no por el tema sino por cómo lo trata.
    Nota para el editor: la misma nota critica también al BHU ("AEBU lamenta que el BHU... se haya
    centrado en objetivos comerciales"), así que el tono desfavorable no es de alineamiento
    partidario simple.
```

Las demás fuentes leídas en el lote son `documento_oficial` (BHU, IMPO, BCU, Presidencia, FMI, BID)
y no llevan registro de tono.
