# Crítica — corrida 2026-09-07-empresas-correo

Modelo: Opus 5 (`claude-opus-5[1m]`). Es el único rol que corre en Opus por la regla de modelos del mantenedor (CLAUDE.md, 2026-09-07); lo digo acá como corresponde.
Lote: `inbox/empresas/correo/2026-09-07/`
Registros revisados: 1 (`empresas.yaml`, un registro con 11 años de `finanzas`, 6 normas, 3 argumentos, 2 comparaciones, 7 hitos) + 3 fichas de medios.
Documentos releídos con `pnpm fuente` en esta sesión: 10 (balances 2014, 2017, 2019, 2020, 2023, 2024; Ley 19.009 en impo y en parlamento; Presidencia 2013; El Observador 2025-04-22, 2026-04-10; Búsqueda 2026-08-06; Subrayado 2022-08-18; Infobae 2022-10-07).
Verificación mecánica de citas: 107 citas del registro contra el texto guardado en el corpus; 104 calzan literal (con normalización de espacios), 2 están atribuidas a la URL equivocada y 1 cambia una mayúscula (ver C4).

---

## Resumen

| Severidad | Cantidad |
|---|---|
| bloquea | 5 |
| corregir | 14 |
| aviso | 8 |
| **total** | **27** |

| # | Campo | Sev. | Una línea |
|---|---|---|---|
| B1 | `monopolio.alcance` / `monopolio.tiene` | bloquea | Dice que el SPU "está reservado por ley" a la ANC; la ley que cita dice lo contrario (art. 19 y art. 2 Ñ)3: régimen de concurrencia). |
| B2 | `monopolio.argumentos_en_contra[0]` | bloquea | El único argumento en contra es sobre el "ámbito reservado" europeo, un mecanismo que Uruguay no usa, y el campo `quien` mete una inferencia del sitio contradicha por la otra fuente del mismo registro. |
| B3 | `finanzas[2024].deuda_financiera` | bloquea | Tomó el renglón de abajo: $71.401.820 es "Otras cuentas por pagar l/p" (deuda con el MEF), no deudas financieras. El valor correcto es $81,6 M (USD 1,9 M), no $126,0 M (USD 2,9 M). |
| B4 | `finanzas[2014].nota` / `.concepto` | bloquea | "No se localizó un balance propio de 2014" es falso: está en el inventario que el brief señala, lo leí, confirma las dos cifras y agrega 2013. |
| B5 | `finanzas[*].segmentos` | bloquea | Vacío en todos los años; los balances 2023 y 2024 traen "Ingresos crédito por Línea de negocios" para 2022, 2023 y 2024. `notas.md` afirma lo contrario. |
| C1 | `finanzas[*].impuestos_pagados` | corregir | La serie cambia de definición en 2020 (IRAE mínimo → total de tributos) y la explicación vive en un campo que la página no muestra. |
| C2 | `finanzas[2023].capitalizaciones_del_estado.fuentes[0]` | corregir | La cita es sobre la TFSPU ($371.503.914), no sobre el subsidio de $1.470 M. |
| C3 | `finanzas[*].capitalizaciones_del_estado` | corregir | No declara si es caja o devengado; el flujo de efectivo de los mismos balances da la misma cifra y nadie lo cita. |
| C4 | `que_hace_fuentes[1]`, `monopolio.normas[0].fuentes[0]` | corregir | La cita del artículo 9 es textual de parlamento.gub.uy pero está atribuida a impo.com.uy. |
| C5 | `hitos[3]` | corregir | "Entra en operación la Planta de Pando, 2020-01-01" se apoya en un pronóstico; los balances 2020 y 2024 dicen "En Noviembre 2020, fue inaugurada". |
| C6 | `que_hace`, `monopolio.alcance` | corregir | "Más de un centenar de operadores privados registrados" no tiene fuente en el lote. |
| C7 | `monopolio.alcance`, `hitos[6]` | corregir | El artículo 192 de la RC 2026 se afirma como hecho desde una sola nota de prensa; el proyecto es un documento previsible. |
| C8 | `comparaciones[0..1]` | corregir | La comparación la hizo Ursec y la página va a imprimir "El Observador" como autor; falta además la tercera cifra del mismo párrafo. |
| C9 | `finanzas[*].nota` y `.concepto` | corregir | Siete notas de más de una oración (el validador ya las lista) y dos conceptos que van al pie de la tabla con párrafos enteros; una nota al pie dice "ver impuestos_pagados". |
| C10 | `finanzas[*].transferencias_al_estado` | corregir | `pesos: 0` sin `usd`: la página imprime "$ 0 M" en una columna donde todo lo demás dice "USD". |
| C11 | `notas.md` | corregir | Falta la sección `## anios_sin_balance` que pide el brief, y el balance 2025 existe (El Observador lo cita el 2026-04-10). |
| C12 | `hitos` / `creacion` | corregir | Sin hito del antecesor: la página le va a decir al lector "La empresa existe desde 1996". |
| C13 | `monopolio.argumentos_a_favor` | corregir | Los dos lados de la mesa son partes interesadas (el gobierno que escribió la ley y el sindicato); y el argumento 0 afirma más de lo que dice su cita. |
| C14 | `comparaciones` | corregir | Una nota de El Observador con seis cifras propias entra como dos filas sueltas en vez de un registro de `analisis.yaml`. |
| A1 | `finanzas[2014]` | aviso | Mezcla `unidad: unidades` con `millones` dentro de la misma serie. |
| A2 | `finanzas[*]` | aviso | Cinco montos con USD que no es exactamente pesos/cotización (desvíos de 0,01–0,02 %, por debajo del 1,5 % del validador). |
| A3 | `finanzas[2017].nota` | aviso | La convención "Resultado del ejercicio, no Resultado integral" va una sola vez en el `resumen`. |
| A4 | evidencia general | aviso | 2022 y 2023 tienen Abstención de Opinión del auditor y nadie buscó el dictamen del Tribunal de Cuentas. |
| A5 | `finanzas[*]` | aviso | La ANC tiene una deuda con el MEF (art. 122, Ley 18.046) que la ficha no menciona. |
| A6 | proceso | aviso | Se usó WebFetch para listar los PDF del sitio; la lista que devolvió contradice la afirmación de B4. |
| A7 | simetría | aviso | Conviene decir con fuente que el déficit y el subsidio atraviesan cuatro gobiernos y que el artículo del 30 % se votó por unanimidad. |
| A8 | dependencia de fuentes | aviso | Once documentos de un solo publicador (la propia ANC); es lo correcto para un balance, pero refuerza A4. |

---

## Objeciones por campo

### B1 — `monopolio.tiene` / `monopolio.alcance`
- severidad: **bloquea**
- tipo: cita_fuera_de_contexto (la fuente citada dice lo contrario de lo que el campo afirma)
- objecion: el `alcance` abre con «El Servicio Postal Universal (SPU) … **está reservado por ley** a la Administración Nacional de Correos». Las tres fuentes que el propio registro cita dicen otra cosa. El artículo 2, literal Ñ) numeral 3 de la Ley 19.009 define a la ANC como «el operador designado y único órgano competente para cumplir el Servicio Postal Universal **en régimen de concurrencia**, así como para prestar los demás servicios postales, estos en régimen de competencia», y el artículo 19 repite: «El servicio postal será prestado en un régimen de competencia sujeta a regulación entre los operadores privados y el operador designado, **excepto el Servicio Postal Universal que se prestará en régimen de concurrencia**». El propio `alcance` ya recoge que la ley, en el artículo 2 literal D, dice que «los términos competencia y concurrencia se entenderán como sinónimos» — con lo cual el registro se contradice a sí mismo dentro del mismo párrafo. La comunicación de Presidencia que la ficha usa como argumento a favor lo dice todavía más claro: describe el «modelo estándar que indica que el servicio postal lo brinda el correo estatal de forma monopólica» y cierra «Uruguay adoptó **este último** modelo», que es el tercero (competencia con privados más un fondo). Y los datos de mercado del propio registro lo confirman: en cartas — servicio del SPU — hay un privado con 11 % (Upostal). Lo único que la ley reserva en exclusiva es la **emisión de valores postales** («solo ésta puede realizar la emisión de valores postales», Carta Orgánica art. 2) y la condición de ser el único **órgano del Estado** que presta el servicio postal, que no es exclusividad frente a privados.
- cita_de_contexto: «3) Operador designado. La Administración Nacional de Correos es el operador designado y único órgano competente para cumplir el Servicio Postal Universal en régimen de concurrencia, así como para prestar los demás servicios postales, estos en régimen de competencia.» y «Artículo 19 (Régimen general de prestación del servicio postal).- El servicio postal será prestado en un régimen de competencia sujeta a regulación entre los operadores privados y el operador designado, excepto el Servicio Postal Universal que se prestará en régimen de concurrencia.» — https://www.impo.com.uy/bases/leyes/19009-2012
- accion_sugerida: reescribir el `alcance` con la estructura que ya usa `content/empresas/afe.yaml` (que declara `tiene: false` y explica en `alcance` qué estuvo reservado, qué se abrió y qué queda hoy). Para el Correo, decir: (a) la única exclusividad legal es la emisión de valores postales; (b) el SPU es una **obligación** del operador designado, prestada en régimen de concurrencia, financiada con la TFSPU (art. 15), los ingresos propios y el aporte de Rentas Generales (art. 14); (c) el 30 % del artículo 530 de la Ley 20.075 es un mandato de compra a los organismos públicos, no una reserva de mercado. Si el editor decide mantener `tiene: true` por la emisión de valores postales, el `alcance` tiene que decir que la reserva es esa y solo esa, y los argumentos de los dos lados tienen que discutir **ese** diseño (ver B2).

### B2 — `monopolio.argumentos_en_contra[0]`
- severidad: **bloquea**
- tipo: explicacion_alternativa / asimetria
- objecion: dos problemas encadenados. Primero, el argumento es de Pateiro Rodríguez y Prado Domínguez (2010) sobre «la financiación del déficit a través del área de reserva» en la Unión Europea. Uruguay no financia el déficit del SPU con un área de reserva: lo financia con la TFSPU y con Rentas Generales, y la Ley 19.009 es de 2012, dos años posterior al artículo. El argumento no está en contra del diseño uruguayo; está en contra de un diseño distinto. Segundo, y peor: el campo `quien` no se limita a decir quién lo sostiene, afirma la equivalencia — «(mismo diseño institucional -operador designado más ámbito reservado para financiar el servicio universal- que usa la Ley 19.009 uruguaya)». Esa equivalencia es una inferencia del sitio, sin cadena de evidencia, metida dentro de la atribución a dos autores que nunca escribieron sobre Uruguay, y está contradicha por la fuente de Presidencia que el mismo registro usa del otro lado. Como el esquema exige al menos un argumento en contra cuando `tiene: true`, el lote no se puede publicar con este.
- cita_de_contexto: «la financiación del déficit a través del área de reserva plantea los problemas derivados de la adecuada definición de dicha área y de toda la problemática derivada de la ineficiencia inherente a situaciones de monopolio frente a la libre concurrencia.» — https://scielo.org.mx/scielo.php?pid=S1405-10792010000200001&script=sci_arttext · contra: «Uruguay adoptó este último modelo» (el de competencia con privados más fondo) — https://www.presidencia.gub.uy/comunicacion/comunicacionnoticias/ley-postal-aplicacion
- accion_sugerida: sacar la afirmación de equivalencia del campo `quien` (esa parte se puede publicar solo como `nota` del editor, y solo si alguien la sostiene con fuente). Y buscar una voz uruguaya sobre **este** diseño, con nombre y lugar dónde buscarla — el investigador declaró la asimetría honestamente en `objeciones_al_brief`, pero las diez búsquedas fueron todas web, y estos cuatro lugares no se tocaron:
  1. **Diario de sesiones de la Ley 19.009 (2012)**, `parlamento.gub.uy`, ficha del asunto: la discusión de la ley postal en Representantes y en Senado. Ahí están, textualmente, los legisladores que objetaron la TFSPU (un tributo del 10 % que pagan los clientes de los operadores privados y se transfiere al operador estatal) y la designación de un único operador. Es `diario_de_sesiones`, fuente primaria, y es el lugar canónico del argumento en contra.
  2. **Versión taquigráfica de la Comisión de Presupuesto integrada con Hacienda, Rendición de Cuentas 2021 (art. 530, Ley 20.075)**: la obligación del 30 % se discutió ahí. Infobae registra que se votó por unanimidad en Senadores, lo cual no impide que hubiera constancias u observaciones en comisión.
  3. **Rendición de Cuentas 2026, artículo 192**, hoy a estudio de Diputados: la ampliación de la carta orgánica hacia la logística — mercado sin reserva donde la ANC compite con privados — es exactamente el punto donde una cámara privada tiene motivo para objetar. El repartido y la versión taquigráfica de la comisión son documentos previsibles.
  4. **Leandro Zipitría**, economista uruguayo especializado en regulación: el investigador ya leyó `leandro-zipitria.com/libro-regulacion/eepp-uy.html` (93.227 caracteres) y lo descartó por no ser normativo. Vale releerlo con `--buscar "correo|postal|reserva|monopolio"`; es la fuente uruguaya más cercana que el lote tuvo en la mano. En la misma línea: CINVE, el CED (ya existe `content/medios/ced.yaml`) y la Academia Nacional de Economía.
  Además, del lado de los operadores: la **Cámara Uruguaya de Logística (CALOG)** y las cámaras de empresas de envíos express, y el **Registro General de Prestadores del Servicio Postal** de Ursec (art. 23 de la ley), que da los nombres de los operadores con interés en la cuestión. Si tras eso sigue sin haber una voz uruguaya, la salida correcta no es una fuente española: es decirlo en el `alcance`, con las búsquedas hechas, y dejar el registro en `probable`.

### B3 — `finanzas[2024].deuda_financiera`
- severidad: **bloquea**
- tipo: contexto_omitido (renglón equivocado en un documento escaneado)
- objecion: el registro carga $126,0 M / USD 2,9 M, sumando corriente $54.559.511 más «no corriente $71.401.820». La cita del componente no corriente no trae etiqueta de renglón, y la etiqueta importa: leí el Estado de Situación Financiera del balance 2024 y el renglón «Deudas financieras 1/p 10.2» dice **27.049.759** (2024) y 71.860.526 (2023); el 71.401.820 es la línea siguiente, «Otras cuentas por pagar Ip». La Nota 11.2 del mismo balance lo confirma por descomposición: «Convenio MEF m/n 3.751.741 + Convenio MEF m/e 67.650.079 = 71.401.820». Y la aritmética de la serie lo confirma otra vez: si la deuda de largo plazo hubiera pasado de 71,9 M (2023) a 71,4 M (2024) mientras se amortizaban ~49 M en el corriente, habría que suponer un préstamo nuevo que el flujo de efectivo no muestra (solo «Préstamos bancarios cancelados (58.767.174)», ningún «obtenido»). Con la lectura correcta la serie amortiza limpio: 123,0 → 71,9 → 27,0.
- cita_de_contexto: «Pasivo no corriente / Deudas financieras 1/p 10.2 27.049.759 71.860.526 / Otras cuentas por pagar Ip 71.401.820 64.117.800 / Total Pasivo no corriente 98.451.5793 135.978.326» — https://www.correo.com.uy/documents/20182/109433/Informe_de_Auditoria_2024_EEFF_Stavros.pdf/dfb1d8f6-3ca0-423b-a169-ab3d209dca19
- accion_sugerida: `deuda_financiera` 2024 = $81.609.270 (54.559.511 + 27.049.759) → `pesos: 81.6`, `usd: 1.9`, cotización 44,066. Cambiar la cita del componente no corriente por el renglón con su etiqueta. Y revisar con el mismo criterio los dos años reconstruidos por OCR: 2020 y 2021 **sí** están bien (ver «Sin objeción», SO3), así que la corrección es solo de 2024.

### B4 — `finanzas[2014].nota` y `finanzas[2014].*.concepto`
- severidad: **bloquea**
- tipo: contexto_omitido
- objecion: el `concepto` del resultado dice «no se localizó un balance propio de 2014» y la `nota` lo repite. La `nota` la imprime la página al pie de la tabla, así que es una afirmación falsa dirigida al lector. El balance propio de 2014 está publicado en el mismo directorio que los demás (`EstadosContables2014_compilado.pdf`), figura en `.cache/inventarios/correo.com.uy.jsonl` —el inventario que el brief agregó justamente para esto— y lo leí en esta sesión: confirma «RESULTADO DEL EJERCICIO 499.909.082», «DEUDAS FINANCIERAS 3-7 58.535» y «Aportes Gobierno Central - Subsidios 3-12 484.065.171», es decir las tres cifras que el registro había tomado de la columna comparativa. Además el `consultas.jsonl` registra que el investigador vio «lista completa de PDFs 2009-2025» del sitio.
- cita_de_contexto: «Movimientos del ejercicio 2014 / Aportes Gobierno Central - Subsidios 3-12 484.065.171» y «DEUDAS FINANCIERAS 3-7 58.535 89.210» — https://www.correo.com.uy/documents/20182/109433/EstadosContables2014_compilado.pdf/8b127fe3-b895-45b7-9695-4c18aa594b4a
- accion_sugerida: (a) cambiar las fuentes de 2014 al balance propio y borrar la afirmación falsa; (b) cargar **2013** con la columna comparativa de ese mismo balance, que da resultado $472.139.491 y subsidio $607.576.539 — y esto no es un detalle de completitud: con 2013 adentro, la serie del subsidio deja de ser monótona creciente (607,6 → 484,1 → 599,6 → 666,0 …), y un lector que vea la ficha truncada en 2014 se va a llevar la idea contraria; (c) el mismo inventario tiene los compilados 2009, 2010, 2011, 2012 y 2013 en el sitio vivo. Cargarlos es el mismo estándar que se aplicó a ANCAP (desde 2000), UTE (desde 2003) y ANTEL (desde 1997) en las correcciones de esta semana; dejar el Correo en 2014 sin decir que los documentos existen es tratar a una empresa distinto que a las otras tres. Si no se cargan ahora, la línea de cobertura tiene que nombrar los años que existen y no se cargaron, no solo el rango.

### B5 — `finanzas[*].segmentos` y `notas.md § anios_sin_segmentos`
- severidad: **bloquea**
- tipo: presentacion
- objecion: `notas.md` afirma: «La ANC **no** desagrega resultados ni ingresos por línea de negocio (correspondencia, paquetería, servicios financieros) en ningún año de la serie 2015-2024 leída». No es así. La Nota 14 de los balances 2023 y 2024, a continuación de la apertura por canal de cobro, trae una segunda tabla: «A continuación se exponen los Ingresos crédito por **Línea de negocios**», con Correspondencia, Logística, Filatelia, Servicios transaccionales y Servicios digitales, con columna comparativa. Eso cubre 2022, 2023 y 2024. Y es justo lo que la lista de control de `CLAUDE.md` manda objetar: «faltan `segmentos[]` en años cuyo balance trae información por segmentos (la página deja prender cada segmento, y sin datos no hay nada que prender)». Además es la información más útil de toda la ficha: correspondencia +2,9 % contra logística +23,2 % entre 2023 y 2024 es, en dos números, la historia que el resto de la ficha cuenta en prosa.
- cita_de_contexto: «A continuación se exponen los Ingresos crédito por Línea de negocios: … Correspondencia 851.144.531 827.202.504 / Logística 276.350.645 224.229.736 / Filatelia 68.136 162.000 / Servicios transaccionales 14.968.075 14.746.887 / Servicios digitales 2.878.671 2.835.678» — https://www.correo.com.uy/documents/20182/109433/Informe_de_Auditoria_2024_EEFF_Stavros.pdf/dfb1d8f6-3ca0-423b-a169-ab3d209dca19 · idéntica tabla con 2023 y 2022 en https://www.correo.com.uy/documents/20182/109433/Informe+de+Auditoría+2023+EEFF+-+Stavros.pdf/1e9e8e3b-e77e-4b11-8d73-06bc4da0e28a
- accion_sugerida: cargar `segmentos[]` en 2022, 2023 y 2024 con esos cinco nombres y el `concepto` que diga literalmente que son **ingresos crédito**, no ingresos totales ni resultado (la página rotula la serie según encuentre «ingreso» en el `concepto`, y la advertencia importa: los ingresos crédito son ~65 % de los ingresos operativos; quedan afuera contado, exterior y TFSPU). Reescribir `anios_sin_segmentos` para que diga la verdad: 2014-2021 sin desagregación por línea de negocio (verifiqué que el balance 2021 no la trae), 2022-2024 con ella. Verificar 2025 cuando se cargue.

### C1 — `finanzas[*].impuestos_pagados`
- severidad: corregir
- tipo: presentacion / contexto_omitido
- objecion: tres cosas. (a) La serie cambia de definición a mitad de camino: 2014-2019 carga solo «Impuesto a la renta» del estado de resultados (entre $98.160 y $144.360, o sea USD 4.000 al año) y 2020-2024 carga el total de la nota «E) Tributos abonados» ($71,2 M a $93,8 M). En el gráfico eso es un salto de 500 veces que no ocurrió en la realidad. (b) La explicación existe pero está en `impuestos_pagados.concepto`, y la página **no** renderiza ese campo: solo pasan a las notas al pie `f.nota`, `transferencias_al_estado.concepto` y `capitalizaciones_del_estado.concepto` (`src/pages/empresas/[slug].astro`, líneas 120-133). El lector va a ver el salto sin ninguna explicación. (c) El `concepto` dice «único tributo propio que la ANC no tiene exonerado por su Carta Orgánica» y su propia cita dice lo contrario: «exceptuando **las contribuciones a la seguridad social** y el Impuesto a la Renta de las Actividades Económicas». Verifiqué que la ausencia del agregado antes de 2020 es real (busqué «Tributos abonados» y «Retenciones de IVA» en el balance 2019 y no existen), así que el problema no es de investigación: es de cómo queda contado.
- cita_de_contexto: «Por el Artículo 14 de la Carta Orgánica, aprobada por la Ley 16.736, la ANC está exenta del pago de tributos nacionales, incluso aquellos previstos en las leyes especiales, exceptuando las contribuciones a la seguridad social y el Impuesto a la Renta de las Actividades Económicas.» — balance 2019 y balance 2014, misma redacción
- accion_sugerida: mover el aviso del quiebre a `finanzas[2020].nota` (que sí se muestra) en una oración, y poner una oración equivalente en `finanzas[2019].nota`; corregir el `concepto` de 2014-2019 para que diga «único impuesto sobre la renta de la ANC; el balance de esos años no publica un total de tributos»; y agregar, una vez, que los aportes patronales a la seguridad social —el otro tributo no exonerado— no se publican separados: van dentro de «Retribuciones personales y cargas sociales», $1.535.371.977 en 2024 (Nota 15 del balance 2024). Alternativa que el editor puede preferir: dejar 2014-2019 sin `impuestos_pagados` — pero entonces la tabla muestra un guion, que la página define como «dato que no se encontró», y tampoco sería cierto. Prefiero la primera.

### C2 — `finanzas[2023].capitalizaciones_del_estado.fuentes[0]`
- severidad: corregir
- tipo: cita_fuera_de_contexto
- objecion: el valor cargado es $1.470,0 M, la fuente 0 se titula «contribuciones del MEF (párrafo de empresa en marcha)» y su cita dice «se devengaron ingresos por la Tasa de Financiamiento del Servicio Postal Universal (TFSPU) por un total de $ 371.503.914». Esa cita no respalda el monto; habla de otra cosa. El valor se sostiene solo en la fuente 1 (el balance 2024, columna comparativa), y 2023 queda como el único año de la serie con una sola confirmación real.
- cita_de_contexto: la cita correcta está en el mismo cuerpo de documentos: «Aportes de rentas generales 1.470.000.000 1.470.000.000» (Estado de Flujos de Efectivo, columnas 2024 y 2023) — https://www.correo.com.uy/documents/20182/109433/Informe_de_Auditoria_2024_EEFF_Stavros.pdf/dfb1d8f6-3ca0-423b-a169-ab3d209dca19
- accion_sugerida: reemplazar la fuente 0 por la Nota 13.3 del balance 2023 o por el renglón del flujo de efectivo de arriba. La cita de la TFSPU no se pierde: sirve como `nota` del año, porque la TFSPU es ingreso propio y no aporte del Estado, distinción que el registro ya hace bien en 2019.

### C3 — `finanzas[*].capitalizaciones_del_estado` (criterio)
- severidad: corregir
- tipo: presentacion
- objecion: el brief y el diccionario piden decir si un monto es caja o devengado. Todos los subsidios salen de la nota de patrimonio (devengado) y ningún `concepto` lo dice. La buena noticia es que la respuesta es «los dos»: el Estado de Flujos de Efectivo de los mismos balances trae el renglón «Aportes de rentas generales» con las mismas cifras — 873.569.459 y 666.000.000 en el balance 2017, 1.465.218.400 en el de 2020, 1.470.000.000 y 1.470.000.000 en el de 2024. Que devengado y caja coincidan es un dato que vale publicar, no esconder.
- cita_de_contexto: «Flujo de efectivo relacionado con actividades de financiamiento … Aportes de rentas generales 873.569.459 666.000.000» — https://www.correo.com.uy/documents/20182/109433/EstadosContables2017_compilado.pdf/ef44891e-998a-4bb3-9ebc-3af442c668d6
- accion_sugerida: una oración en el `resumen`: «El subsidio se registra como aumento del patrimonio (Ordenanza 81/89 del Tribunal de Cuentas) y el flujo de efectivo del mismo balance muestra el mismo importe cobrado en el año». Y agregar el renglón del flujo como segunda fuente al menos en los años donde ya lo tengo verificado (2016, 2017, 2020, 2023, 2024).

### C4 — `que_hace_fuentes[1]` y `monopolio.normas[0].fuentes[0]`
- severidad: corregir
- tipo: riesgo_legal (regla 4 y 5 de agentes: la cita se copia de la página que se abrió)
- objecion: comparé las 107 citas del registro contra el texto guardado en el corpus. Dos de ellas —las del artículo 9 de la Ley 19.009— están atribuidas a `impo.com.uy/bases/leyes/19009-2012` pero son textuales de `parlamento.gub.uy/documentosyleyes/leyes/ley/19009`: se reconocen por las palabras pegadas («El Servicio Postal**U**niversal», «la distribución de**e**nvíos», «de**l**asActas»), que son artefacto del render del Parlamento. En impo el mismo artículo dice «El Servicio Postal Universal comprende la admisión, el procesamiento, el transporte y la distribución de envíos o productos postales básicos definidos en el Convenio Postal Universal de las Actas de la Unión Postal Universal internalizadas por ley». `pnpm validar --red` verifica cada `cita` contra el texto de **su** URL, así que estas dos van a fallar. Es la misma ley y el contenido no cambia, pero la regla existe para que no se pueda inventar una segunda fuente cambiando una URL, y acá una de las dos ocurrencias es la única fuente de la primera norma del bloque de monopolio. Tercer caso, menor: `que_hace_fuentes[3]` cambia «la Ley» por «la ley» respecto del balance 2019.
- cita_de_contexto: texto de impo: «Artículo 9 (Alcance).- El Servicio Postal Universal comprende la admisión, el procesamiento, el transporte y la distribución de envíos o productos postales básicos definidos en el Convenio Postal Universal de las Actas de la Unión Postal Universal internalizadas por ley.»
- accion_sugerida: o se cambia la URL y el `medio` de esas dos fuentes a `parlamento`, o se reemplaza la cita por el texto de impo. Cualquiera de las dos, en dos minutos. Corregir también la mayúscula de la tercera.

### C5 — `hitos[3]` (Planta Logística de Pando)
- severidad: corregir
- tipo: contexto_omitido
- objecion: el hito afirma «2020-01-01 — Entra en operación la Planta Logística Postal de Pando». La fuente citada es el balance **2019**, cuya frase es un pronóstico: «Dicha Planta estará operativa en el año 2020». El hecho consumado está documentado en otros dos balances, con mes: el de 2020 dice «En Noviembre 2020, fue inaugurada la Planta Logística Postal, reclasificándose a Inmuebles - Mejoras» y el de 2024 repite «Dicha Planta quedó operativa en Noviembre del 2020». La fecha 2020-01-01 no está en ningún documento y la línea de tiempo la va a dibujar en enero.
- cita_de_contexto: «En Noviembre 2020, fue inaugurada la Planta Logística Postal, reclasificándose a Inmuebles - Mejoras, y por consecuencia, amortizándose desde el mes de Diciembre 2020» — https://www.correo.com.uy/documents/20182/109433/ANC+EEFF+al+31+12+20+e+Informe+de+Auditoría+-+Stavros.pdf/960dc00d-4d22-425f-88b3-76f3fafd8e75
- accion_sugerida: `fecha: 2020-11`, fuente el balance 2020, y el `detalle` puede sumar el dato que sí aporta el balance 2019 (predio de 10 hectáreas, 8.500 m²) sin usarlo como prueba de la inauguración.

### C6 — `que_hace` y `monopolio.alcance`: «más de un centenar de operadores»
- severidad: corregir
- tipo: riesgo_legal (afirmación sin fuente en un campo que la página imprime como prosa)
- objecion: `que_hace` dice «compite con más de un centenar de operadores privados registrados ante el regulador» y `alcance` repite «hay más de un centenar de operadores registrados en el Registro General de Prestadores del Servicio Postal que administra Ursec». Busqué ese número en los seis documentos y notas del lote donde podría estar (Ley 19.009, informe de Ursec, las tres notas de El Observador, Búsqueda) y no aparece en ninguno. `que_hace_fuentes` no tiene una fuente que lo respalde.
- accion_sugerida: el Registro General de Prestadores del Servicio Postal existe por el artículo 23 de la Ley 19.009 y lo publica Ursec: citarlo con su fecha de consulta, o sacar el número y decir «más de un operador privado registrado» con los que sí están nombrados con fuente (Upostal, UES, MPT Logística, Mercado Libre, según el informe de Ursec citado por El Observador).

### C7 — `monopolio.alcance` y `hitos[6]`: artículo 192 de la Rendición de Cuentas 2026
- severidad: corregir
- tipo: un_solo_grupo / documento previsible
- objecion: el `alcance` afirma como hecho «La Rendición de Cuentas 2026, a estudio del Parlamento, incluye un artículo 192 que amplía las competencias de la ANC hacia la logística integral, la digitalización y la gestión documental», y el hito lo repite. Todo eso sale de una sola nota de Búsqueda. El propio `notas.md` reconoce en `hipotesis` que no se pudo verificar contra el texto del proyecto. Un artículo de un proyecto de ley a estudio de Diputados es de los documentos más previsibles que hay.
- cita_de_contexto: «Para hacerlo, impulsó una modificación de su carta orgánica incluida en el proyecto de Rendición de Cuentas, hoy a estudio de la Cámara de Diputados.» — https://www.busqueda.com.uy/economia/el-correo-uruguayo-busca-nuevos-negocios-por-necesidad-y-proyecta-reducir-12-la-asistencia-que-recibe-n5415888
- accion_sugerida: buscar el articulado en la ficha del asunto de la Rendición de Cuentas 2026 en `parlamento.gub.uy` (repartido del proyecto y versión taquigráfica de la Comisión de Presupuesto de Diputados). Mientras no esté, atribuir explícitamente: «según Búsqueda, el proyecto incluye un artículo 192 que…». La misma exigencia vale para cualquier ficha: si a otra empresa se le pide el texto del proyecto, a esta también.

### C8 — `comparaciones[0]` y `comparaciones[1]`
- severidad: corregir
- tipo: presentacion
- objecion: las dos comparaciones son cuotas de mercado medidas por Ursec en su informe del primer semestre de 2024; la fuente cargada es la nota de El Observador que las reprodujo. La página imprime el medio de la fuente como autor de la comparación, así que va a decir que la comparación la hizo El Observador. La regla 10 de la lista de control es explícita: «Las comparaciones dicen quién las hizo». El investigador **sí** abrió el informe de Ursec y anotó por qué no pudo citarlo («los porcentajes de participación de mercado están en gráficos de imagen, no extraíbles como texto»), lo cual es honesto, pero el informe quedó en `fuentes[]` general con una cita de su portada, que no aporta nada. Además falta la tercera cifra del mismo párrafo, la de encomiendas internacionales de entrada (ANC 23 %, detrás de MPT Logística con 30 %), que el `alcance` sí menciona: cargar dos de tres deja la selección al azar.
- cita_de_contexto: «El último informe de mercado de servicios postales correspondiente al primer semestre del año pasado y elaborado por la Unidad Reguladora de Servicios de Comunicaciones (Ursec) informó que el Correo fue el tercer operador de encomiendas con el 13% del mercado.» — https://www.elobservador.com.uy/economia-y-empresas/el-correo-completo-cinco-anos-deficit-perdidas-recurrentes-que-podrian-generar-incertidumbre-n5995256
- accion_sugerida: (a) que el `indicador` diga «según el informe de mercado de servicios postales de Ursec, primer semestre 2024, reportado por El Observador»; (b) intentar la serie de Ursec en formato de datos —`pnpm fuente` lee xlsx y csv, y Ursec publica los datos de mercado postal además del PDF; también `catalogodatos.gub.uy`— para poder citar el documento oficial con una fila; (c) agregar la tercera comparación. Ojo: con tres comparaciones de la misma URL el validador va a avisar que eso es un análisis con página propia, que es justamente C14.

### C9 — `finanzas[*].nota` y `.concepto` (largo y lenguaje)
- severidad: corregir
- tipo: presentacion
- objecion: `pnpm validar --inbox` ya marca siete notas de más de una oración (2014: 633 caracteres; 2015: 425; 2017: 456; 2020: 522; 2021: 319; 2022: 668; 2023: 634). Se suman dos que el validador no mira pero la página sí imprime al pie de la tabla: `capitalizaciones_del_estado.concepto` de 2014 y de 2019, este último con un párrafo entero sobre la TFSPU y la Ley 19.355. Y una que es peor que larga: la nota al pie de transferencias de 2015 dice «(está exonerada de tributos por su Carta Orgánica, **ver impuestos_pagados**; en cambio recibe subsidio, **ver capitalizaciones_del_estado**)». Esos son nombres de campos del YAML; el lector va a leer una nota al pie que le pide mirar algo que no existe en la página.
- accion_sugerida: una oración por nota; lo que se repite todos los años (la exoneración del artículo 14, la abstención de opinión 2022-2023, la convención de resultado) va una sola vez al `resumen`; y las referencias internas se reescriben en castellano de lector: «no transfiere a Rentas Generales: recibe subsidio, que se muestra en la columna siguiente».

### C10 — `finanzas[*].transferencias_al_estado`
- severidad: corregir
- tipo: presentacion
- objecion: los diez años traen `pesos: 0` sin `usd`. La función `montoTexto` de la página muestra USD cuando hay `usd` y pesos cuando no, así que la columna «Transferido a Rentas Generales» va a decir «$ 0 M» mientras las otras cuatro dicen «USD x M». Un cero con otro signo monetario en la misma fila se lee como error.
- accion_sugerida: agregar `usd: 0` a los diez. Es un cero con cita, que es lo que el diccionario pide («Cero con cita cuando el documento dice que no hubo»), y está bien traído: los balances dicen literalmente «No se hicieron transferencias a rentas generales».

### C11 — `notas.md`
- severidad: corregir
- tipo: contexto_omitido
- objecion: dos huecos. (a) El brief pide tres secciones nuevas —`## anios_sin_balance`, `## anios_sin_segmentos`, `## medios_faltantes`— y `anios_sin_balance` no está. No es formalismo: es exactamente la sección donde tendría que haberse chocado con B4. (b) El balance 2025 existe y está auditado: El Observador publicó sus cifras el 2026-04-10 («El ejercicio de 2025 del Correo culminó con un resultado negativo de $ 1.480,6 millones», subsidio $1.470 millones, ingresos operativos $1.875,8 millones, 1.468 funcionarios). El brief pedía 2015-2024 y el lote cumplió, pero la ficha se publica en septiembre de 2026 y la línea de cobertura va a decir «Balances cargados: 2014 a 2024» sin explicar el año faltante.
- accion_sugerida: escribir `anios_sin_balance` con lo que el inventario muestra (2009-2013 disponibles y no cargados; 2025 disponible y no cargado; ningún año sin documento en 2014-2024), y cargar 2025 con su PDF o declararlo.

### C12 — `hitos` / `creacion`
- severidad: corregir
- tipo: presentacion
- objecion: `creacion.fecha` es 1996-01-05 y el primer hito es la creación de la ANC. La página construye sola la línea de cobertura y, con `anioCreacion = 1996` y `primerAnio = 2014`, le va a decir al lector «La empresa existe desde 1996». El correo uruguayo es bastante anterior: la propia ley citada dice que la ANC se crea «en sustitución de la Dirección Nacional de Correos». El punto 3 de la lista de control es literal sobre esto: «el lector piensa que la empresa nació ese año».
- cita_de_contexto: «Créase la Administración Nacional de Correos como Servicio Descentralizado Comercial … en sustitución de la Dirección Nacional de Correos.» — https://www.impo.com.uy/bases/leyes-originales/16736-1996/747
- accion_sugerida: un hito previo con la fuente que ya está en el registro («la ANC sustituye a la Dirección Nacional de Correos») y, si se quiere la fecha fundacional del servicio postal, una fuente que la sostenga: la página institucional del propio Correo o el perfil de país de la Unión Postal Universal. No la afirmo yo: no leí ningún documento del lote que dé una fecha anterior a 1996.

### C13 — `monopolio.argumentos_a_favor`
- severidad: corregir
- tipo: asimetria
- objecion: dos argumentos y los dos de partes con interés directo: Presidencia de la República en 2013 (el gobierno que impulsó la ley) y el presidente del sindicato de la empresa en 2022. No hay una sola voz sin interés del lado de la reserva —ni un legislador de otro partido, ni un académico, ni el regulador—, exactamente el mismo defecto que se le señala al lado en contra. Y el `texto` del primer argumento afirma más de lo que dice su cita: la frase «el servicio postal es un servicio público en los mismos términos que la educación y la salud, y el Estado tiene la obligación de garantizar el acceso universal» no está en la cita cargada, que termina en «Uruguay adoptó este último modelo». Sí está en la nota, en otro párrafo, así que el arreglo es agregar la cita, no borrar la frase.
- cita_de_contexto: «El servicio postal es un servicio público en los mismos términos que otros servicios como la educación y la salud. El Estado uruguayo tiene la obligación de prestar el servicio postal universal, lo cual implica garantizar el acceso universal a los servicios postales.» — https://www.presidencia.gub.uy/comunicacion/comunicacionnoticias/ley-postal-aplicacion
- accion_sugerida: agregar esa cita como segunda fuente del argumento; y buscar del lado a favor en los mismos lugares que del lado en contra (diario de sesiones de 2012 y de la RC 2021), donde hay legisladores de más de un partido defendiendo el diseño. El artículo del 30 % se votó por unanimidad en el Senado: los fundamentos de esa unanimidad son voces a favor que no vienen ni del gobierno de turno ni del sindicato.

### C14 — `comparaciones` como filas sueltas
- severidad: corregir
- tipo: presentacion
- objecion: la nota de El Observador del 2025-04-22 tiene 3.747 caracteres y de ahí salen, con cifras propias: el subsidio 2024 y 2023, los ingresos operativos, el costo de los servicios, las retribuciones y cargas sociales, la plantilla y su evolución desde 2020, y tres cuotas de mercado. Eso es un análisis con varias cifras de una misma fuente; el brief lo dice y `CLAUDE.md` regla 9 también: «Un análisis con varias cifras de una misma fuente tiene página propia (`analisis`), no filas sueltas en una tabla».
- accion_sugerida: un `analisis.yaml` en la carpeta del lote con la forma de `src/schemas/analisis.ts`, `calificacion: discutible` en cada afirmación (califica el editor), y en la ficha una sola fila que lleve a él. Coteché tres de sus cifras contra los estados contables y coinciden exactamente (ingresos operativos 2024 $1.758.370.713 = «$ 1.758,3 millones»; costo de los servicios $2.011.534.070 = «$ 2.011,5 millones»; retribuciones y cargas sociales $1.535.371.977 = «$ 1.535,3 millones»), así que el trabajo de cotejo está medio hecho.

### A1 — unidades mezcladas en `finanzas[2014]`
- severidad: aviso
- objecion: 2014 usa `unidad: unidades` para impuestos y deuda, mientras 2015-2024 usan `millones` para deuda. Revisé la página: `factor()` normaliza (1e-6 para unidades), así que el gráfico y la tabla salen bien y **no** hay bug. Lo dejo como aviso porque la próxima persona que toque la serie tiene una trampa esperándola, y porque el criterio del `nota` de 2014 («expresarlos en millones los redondearía a 0,1») se aplicó a dos campos de un año y no al resto.

### A2 — redondeo de USD
- severidad: aviso
- objecion: cinco montos tienen `usd` que no es exactamente `pesos / cotizacion`: impuestos 2014 (4028,8 contra 4028,1), 2016 (3951,6 contra 3950,9), 2017 (4374,5 contra 4373,9), 2019 (3869,6 contra 3869,2) y deuda 2014 (2402,1 contra 2402,4). Los desvíos son de 0,01 a 0,02 %, muy por debajo del 1,5 % que el validador tolera, así que no rompen nada. Los otros 40 montos cierran.

### A3 — convención de «Resultado del ejercicio»
- severidad: aviso
- objecion: `finanzas[2017].nota` explica bien por qué se carga «Resultado del ejercicio» ($976.373.078) y no «Resultado integral» ($695.130.204, tras $281.242.874 de revaluación de PP&E). La elección es la correcta y es coherente con toda la serie, pero el diccionario dice que las convenciones que se repiten van una sola vez, en el `resumen`. Vale confirmar de paso que ningún otro año tenga «Otros resultados integrales» distinto de cero: en 2019 son -$30.000, que no mueve la cifra pero conviene que la convención esté escrita antes de que a alguien le llame la atención.

### A4 — dictamen del Tribunal de Cuentas 2022 y 2023
- severidad: aviso
- objecion: el auditor externo se abstuvo de opinar sobre la totalidad de los estados financieros 2022 y sobre el resultado, los flujos y los cambios en el patrimonio de 2023. La ficha lo documenta bien y sin adjetivos, que es lo correcto. Lo que falta es lo obvio: el Tribunal de Cuentas dictamina sobre los estados contables de los servicios descentralizados, `content/medios/tribunal-de-cuentas.yaml` ya existe, y el inventario del sitio del Correo tiene dictámenes del TdC de otros años (`4Dictamen_TC_Estados_Contables_1.pdf`, `ANC_Dictamen_Tribunal_de_Cuentas_Estados_Contables_2010.pdf`). Nadie lo buscó para 2022-2023, que son justo los años donde el dictamen del TdC agregaría lo que la auditoría privada no pudo dar.
- accion_sugerida: buscar el dictamen del Tribunal de Cuentas sobre los ejercicios 2022 y 2023 en `tcr.gub.uy` y en el sitio del Correo (`pnpm inventario tcr.gub.uy`), y decirlo en la `nota` de esos años tenga o no resultado la búsqueda.

### A5 — deuda con el MEF
- severidad: aviso
- objecion: en una ficha sobre qué puso el Estado y qué se llevó, hay una deuda con el Estado que no aparece: «Se expone la deuda con el MEF de acuerdo a lo establecido en el artículo 122 de la Ley N° 18.046», $71.401.820 en 2024 (Convenio MEF m/n 3.751.741 más m/e 67.650.079), $63.658.276 en 2023 y $78.640.594 en 2020 junto con el convenio UPAEP. Es el mismo renglón que causó B3, así que se corrigen juntos.
- accion_sugerida: una oración en el `resumen` o en la `nota` de un año. No va en `deuda_financiera` (no es deuda bancaria) pero el lector-dueño querría saberlo.

### A6 — WebFetch para listar los PDF
- severidad: aviso
- objecion: `consultas.jsonl` registra «WebFetch https://www.correo.com.uy/estados-contables (solo para listar URLs de PDF, no citado)». La regla 2 prohíbe WebFetch sobre una nota, un PDF o un video **que se vaya a citar**, y acá no se citó nada de ahí, así que está dentro de la letra. Lo anoto por otra razón: el resultado de esa consulta fue «lista completa de PDFs 2009-2025», y sin embargo el registro afirma que no existe el balance de 2014 (B4). La herramienta funcionó; lo que falló fue usar lo que devolvió.

### A7 — contexto político que conviene registrar
- severidad: aviso
- objecion: `notas.md` señala con razón que las pérdidas y el subsidio son constantes bajo los tres partidos que gobernaron el período. Falta un dato que lo hace verificable en vez de declarativo, y que está en una fuente del lote: el directorio de la ANC es multipartidario y el artículo del 30 % se aprobó por unanimidad.
- cita_de_contexto: «El texto surgió desde el propio directorio del Correo, integrado por representantes del Partido Nacional, de Cabildo Abierto y del Frente Amplio.» y «fue aprobado por unanimidad en la Cámara de Senadores» — https://www.infobae.com/america/america-latina/2022/10/07/organismos-uruguayos-deberan-distribuir-un-tercio-de-su-mensajeria-a-traves-de-la-empresa-estatal-de-correo/
- accion_sugerida: sumarlo al `detalle` del hito de la Ley 20.075. Cuesta una línea y le saca al registro la lectura partidaria que un lector podría hacerle.

### A8 — dependencia de un solo publicador
- severidad: aviso
- objecion: once de los documentos financieros salen del mismo publicador, la propia ANC (`grupo: estado-uruguayo`), y el auditor es el mismo estudio (Crowe / Stavros Moyal) en toda la serie. Para estados contables auditados eso es lo correcto y no aplica la regla de dos grupos, que es para `reportado`. Lo digo igual porque es el tipo de dependencia que hay que declarar y porque, combinada con la abstención de opinión de 2022-2023, es la razón por la que A4 importa más que de costumbre. Las notas de prensa del lote sí vienen de tres grupos distintos (El Observador, Búsqueda, Subrayado, Infobae).

---

## Sin objeción (verificado, está bien)

Lo anoto porque la ausencia de crítica también se audita.

- **SO1 — La cadena del resultado del ejercicio cierra en once documentos.** Cada balance repite el año anterior en su columna comparativa y todos coinciden: 499.909.082 (2014) → 724.752.975 → 837.807.335 → 976.373.078 → 1.097.351.549 → 1.227.135.000 → 1.412.945.842 → 1.395.988.104 → 1.221.542.281 → 1.423.632.718 → 1.546.715.805 (2024). Además el 2024 cierra por aritmética interna: resultado antes de impuesto (1.546.505.445) más impuesto a la renta (210.360) = 1.546.715.805. Y una fuente independiente los repite: El Observador (2026-04-10) lista 2020 a 2024 con las mismas cifras.
- **SO2 — La cadena del subsidio también cierra**, y en dos renglones distintos del mismo documento (nota de patrimonio y flujo de efectivo): verifiqué 2016 y 2017 en el balance 2017, 2020 en el balance 2020, 2023 y 2024 en el balance 2024. Los importes coinciden.
- **SO3 — La reconstrucción por OCR de la deuda de 2020 y 2021 es correcta.** El balance 2020 está escaneado y la tabla salió con las columnas desordenadas; el registro asignó 52.389.636 al corriente y 233.912.228 al no corriente por cuadre de subtotales. Lo verifiqué por dos caminos: los subtotales cierran (301.416.630 + 52.389.636 + 618.777.171 + 13.576.154 = 986.159.591; 233.912.228 + 78.640.594 = 312.552.822) y la serie de largo plazo amortiza sin saltos contra los años de texto limpio (251,7 en 2019 → 233,9 → 192,1 → 123,0 → 71,9 → 27,0). El otro candidato, 78.640.594, es la deuda con el MEF y con la UPAEP. La regla del diccionario sobre dígitos de OCR está bien aplicada acá; el que falló es 2024, donde el documento sí tenía la etiqueta y se tomó el renglón de abajo (B3).
- **SO4 — El «no hay Tributos abonados antes de 2020» es cierto.** Busqué «Tributos abonados» y «Retenciones de IVA» en el balance 2019 y no existen; la nota agregada aparece efectivamente en 2020. La objeción C1 es sobre cómo queda contado, no sobre la investigación.
- **SO5 — 104 de 107 citas son literales** contra el texto que devolvió `pnpm fuente`, incluidas las de los balances escaneados. Los tres casos con problema están en C4.
- **SO6 — Las dos citas de El Observador para las comparaciones son literales y contiguas**, y las cifras de esa nota que pude cotejar contra el balance 2024 coinciden al peso.
- **SO7 — Los hitos son un avance sobre la vara.** `content/empresas/afe.yaml` y `content/empresas/anp.yaml` están publicadas con cero hitos; esta ficha trae siete, con fuente cada uno. Seis de los siete están bien fechados y bien citados (el que falla es C5).
- **SO8 — `precios_vs_paridad` ausente es lo correcto.** La ANC no vende un producto con precio de paridad de importación; forzar ese bloque sería decorar.
- **SO9 — El tratamiento de la abstención de opinión de 2022 y 2023 es del tono que corresponde**: cita literal del dictamen, sin verbos de intención, sin calificar, y `casos_vistos` aclara que un hallazgo de auditoría no es una denuncia. Bien hecho.
- **SO10 — Las tres fichas de medios nuevas están bien armadas** (`correo` con `empresa: correo` y `grupo: estado-uruguayo`, `ursec` como regulador, `scielo-org-mx` con `alineamiento: sin_datos` justificado). Los 85 errores de `pnpm validar --inbox` son todos «medio desconocido» por esas tres fichas, que el editor crea; no hay ningún otro error de esquema ni de referencias.

---

## Objeciones al lote

- **Cobertura del período.** El brief pidió 2015-2024 y el lote entregó 2014-2024 sin huecos, con documento propio en todos los años: eso está bien. Lo que no está bien es el borde: hay balances públicos de 2009 a 2013 y de 2025 en el mismo sitio, y la ficha va a mostrar una línea que dice «La empresa existe desde 1996; los años anteriores a 2014 todavía no están en la ficha». Cargar 2013 es barato (está en la columna comparativa del balance 2014 que ya leí) y cambia la lectura de la serie del subsidio, porque 2013 fue mayor que 2014. Con ANCAP, UTE y ANTEL se hizo exactamente este trabajo esta semana; aplicarlo también acá es la Regla 0 en su forma más literal.
- **Simetría entre los dos lados del argumento.** El lote declara la asimetría en vez de disimularla, lo cual es lo correcto y hay que decirlo. Pero el problema no es solo que falte una voz uruguaya en contra: es que **los dos lados están mal**. A favor hay dos partes interesadas (el gobierno que escribió la ley y el sindicato de la empresa) y ninguna voz independiente; en contra hay una fuente que no habla de Uruguay. La lista de lugares donde buscar, para los dos lados, está en B2 y C13, y el más importante es el mismo para ambos: el diario de sesiones de la Ley 19.009 (2012) y el de la Rendición de Cuentas 2021 (artículo 530). Ahí están las dos posiciones, dichas por gente con nombre, en un `diario_de_sesiones`, que es fuente primaria. Que ese lugar no se haya tocado es la falla de método del lote.
- **Simetría entre gobiernos.** Sin objeción sustantiva: la serie cubre Mujica, Vázquez, Lacalle Pou y Orsi con el mismo criterio, todas las cifras salen del mismo tipo de documento y ninguna `nota` atribuye el déficit ni el subsidio a un gobierno. El único ajuste es A7, que agrega la unanimidad y la composición multipartidaria del directorio para que el lector no complete solo.
- **Dependencia de un solo grupo.** No aplica en el sentido de `reportado` (todo lo financiero es `documento_oficial`), pero ver A8 y A4.
- **Lista de control de presentación.** De los trece puntos, el lote falla en el 3 (años ocultos sin decirlo: B4/C11), el 5 y el 12 (celdas y notas al pie con párrafos: C9), el 8 (ayuda visual que condensa: los segmentos de B5, y la serie de volúmenes postales de Ursec que la nota de Búsqueda trae —cartas nacionales de 32,4 a 27,2 millones y paquetes de 6,9 a 10,6 millones entre 2024 y 2025— que es un gráfico esperando a que alguien lo cargue), el 9 y el 10 (C14 y C8). Cumple bien el 1, el 2, el 4, el 11 y el 13, que la página resuelve sola a partir de datos que el registro trae bien.

## Objeciones al brief

- El brief no viola la Regla 0. Pide explícitamente el mismo esfuerzo para los dos lados del argumento («Una búsqueda por cada lado como mínimo, registrada en `consultas.jsonl`; mismo esfuerzo para cada lado, y si un lado te cuesta más, decilo en `notas.md`»), advierte que «un dirigente que defiende una regla no es un argumento en contra de esa regla», y aclara que las comparaciones solo valen si las hizo una fuente. Todo eso es simétrico y el investigador lo respetó en la forma.
- Una sola observación de método, y no es un sesgo: el brief manda buscar los argumentos en «Presidencia, la empresa, su sindicato, partidos, el regulador, cámaras privadas, academia, prensa» y no nombra el **diario de sesiones**, que para una discusión sobre el diseño legal de un servicio público es la fuente primaria por excelencia y la única donde los dos lados quedan registrados en el mismo documento, dichos por personas identificables. Sugerencia para el próximo brief de empresa con monopolio: agregar «versión taquigráfica de la discusión parlamentaria de la ley que crea la reserva y de sus modificaciones» como paso obligatorio antes de dar por agotada la búsqueda de cualquiera de los dos lados. Aplicado por igual a todas las empresas y a todas las leyes.
- El `notas.md` declara «objeciones_al_brief: Ninguna» y describe después la asimetría de resultados. Está bien planteado, pero la conclusión que saca —«en Uruguay el debate público documentado sobre el correo estatal parece concentrarse en defender su sostenimiento, no en cuestionar su diseño legal»— es una afirmación sobre el estado del debate público uruguayo sacada de diez búsquedas web que no incluyeron el Parlamento. No hay que publicarla en ningún lado hasta que la búsqueda de B2 esté hecha.

---

## Discrepancias

Se registró **1** en `inbox/empresas/correo/2026-09-07/discrepancias.yaml`: El Observador, 2026-04-10, `dato_erroneo`, la racha de ejercicios con pérdida. Detalle y salvedad en ese archivo.

Busqué otras y no las encontré, con el mismo umbral para todos los medios del lote: coteché contra los estados contables las cifras de El Observador (2025-04-22: subsidio 2024 y 2023, ingresos operativos, costo de los servicios, retribuciones y cargas sociales — todas exactas), las de Búsqueda (2026-08-06: la existencia del artículo 192 no se pudo cotejar contra el proyecto, así que **no** es una discrepancia, es un pendiente de verificación, ver C7) y las de Subrayado (2022-08-18: es una declaración del sindicato, no un dato contra documento). La diferencia entre Infobae («aproximadamente USD 30 millones de Rentas Generales», octubre de 2022) y el balance 2022 (USD 36,9 M al cierre) no se registra: el medio dice «aproximadamente» y la conversión depende del momento del año que se tome.

---

## Cobertura

Cinco de las seis notas de prensa leídas en el lote **no nombran a ningún político ni partido**: tratan de una empresa pública, de sus estados contables y de su plan comercial. El esquema de `cobertura` exige `politico` o `partido` («Se requiere politico o partido afectado»), y ponerle un presidente a una nota que no lo trata sería inventar el sujeto afectado para poder emitir el registro. Por Regla 0 no lo hago, y dejo la lista con el motivo:

- `el-observador`, 2025-04-22, *El Correo completó cinco años de déficit…* — sin sujeto político: la nota cita al auditor y a Ursec, no evalúa a ningún gobierno ni nombra a ningún dirigente.
- `el-observador`, 2026-04-10, *El Correo acumuló seis años de resultados negativos…* — sin sujeto político; menciona al Ministerio de Economía como origen del subsidio, sin atribución a persona ni partido.
- `el-observador`, 2026-05-13, *El plan de transformación de El Correo…* — entrevista al presidente del directorio de la ANC (Bonfrisco), que no está en `content/politicos/`. La frase más cargada de la nota («Hace un año agarré un muerto») es del entrevistado, no del medio, y no señala a un partido.
- `busqueda`, 2026-08-06, *El Correo Uruguayo busca nuevos negocios «por necesidad»…* — mismo caso.
- `subrayado`, 2022-08-18, *Sindicato del Correo Uruguayo reclama que empresas públicas utilicen sus servicios* — el sujeto es el sindicato; los senadores aparecen sin nombre ni partido («Consultado sobre la respuesta de los senadores»).

La única que sí tiene sujeto partidario identificable es la de Infobae, que nombra tres partidos en la misma oración y con el mismo tratamiento. Emito los tres registros, con la misma justificación y el mismo tono, porque emitir solo el del partido cuyo director está citado sería asimétrico:

```yaml
- medio: infobae
  url: https://www.infobae.com/america/america-latina/2022/10/07/organismos-uruguayos-deberan-distribuir-un-tercio-de-su-mensajeria-a-traves-de-la-empresa-estatal-de-correo/
  titulo: Organismos uruguayos deberán distribuir un tercio de su mensajería a través de la empresa estatal de correo
  fecha: 2022-10-07
  evento: "propuesto:obligacion-contratacion-postal-estado-2022"
  partido: Partido Nacional
  tono: neutral
  justificacion: >-
    La nota describe el origen del artículo sin calificar a ninguno de los partidos que lo
    impulsaron: "El texto surgió desde el propio directorio del Correo, integrado por
    representantes del Partido Nacional, de Cabildo Abierto y del Frente Amplio", y registra que
    "fue aprobado por unanimidad en la Cámara de Senadores".

- medio: infobae
  url: https://www.infobae.com/america/america-latina/2022/10/07/organismos-uruguayos-deberan-distribuir-un-tercio-de-su-mensajeria-a-traves-de-la-empresa-estatal-de-correo/
  titulo: Organismos uruguayos deberán distribuir un tercio de su mensajería a través de la empresa estatal de correo
  fecha: 2022-10-07
  evento: "propuesto:obligacion-contratacion-postal-estado-2022"
  partido: Cabildo Abierto
  tono: neutral
  justificacion: >-
    Misma nota y misma oración: "El texto surgió desde el propio directorio del Correo, integrado
    por representantes del Partido Nacional, de Cabildo Abierto y del Frente Amplio". El único
    juicio de la nota es sobre la medida, no sobre los partidos: "algo que favorece a la empresa
    estatal y juega en contra de los privados involucrados en servicios de mensajería".

- medio: infobae
  url: https://www.infobae.com/america/america-latina/2022/10/07/organismos-uruguayos-deberan-distribuir-un-tercio-de-su-mensajeria-a-traves-de-la-empresa-estatal-de-correo/
  titulo: Organismos uruguayos deberán distribuir un tercio de su mensajería a través de la empresa estatal de correo
  fecha: 2022-10-07
  evento: "propuesto:obligacion-contratacion-postal-estado-2022"
  partido: Frente Amplio
  tono: neutral
  justificacion: >-
    La nota cita a un director del Frente Amplio sin adjetivarlo ni contradecirlo: "Se avanzó en
    algo que veníamos reclamando desde el directorio, que es que el Correo sea el brazo logístico
    del Estado", dijo el director por el Frente Amplio, Jorge Pozzi.
```

El evento va como propuesta porque `content/eventos/` no tiene ninguno postal. Si el editor prefiere, hay dos más que este lote justificaría: `propuesto:ley-postal-19009-2012` y `propuesto:transformacion-logistica-correo-2026`.
