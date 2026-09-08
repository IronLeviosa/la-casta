# Crítica — corrida 2026-09-08-empresas-ute-serie-historica

Modelo: Opus 5 (1M context) — `claude-opus-5[1m]`. Corrí como crítico, que es el único rol al que la regla 14 del mantenedor le permite Opus.
Lote: `inbox/empresas/ute/2026-09-08-serie-historica/`
Registros revisados: 11 ítems nuevos de `finanzas[]` (2004-2014), la tabla `## cobertura_del_periodo` 1912-2014 y la nota metodológica de `notas.md`. No se revisaron los años 2015-2025 (ya publicados) salvo para fijar el criterio contra el que se compara.

Documentos abiertos con `pnpm fuente` en esta sesión: balances de UTE 2004, 2006, 2007, 2008, 2009, 2010, 2012 y 2014 (ocho de los once), más `archivo.presidencia.gub.uy/mem2000/info/UTE.htm`, `archivo.presidencia.gub.uy/mem2000/info/index.htm`, el snapshot de Wayback de `ute.com.uy` de 2003 y la página de UTE del Portal de Transparencia Presupuestaria de OPP.

Resumen para el editor, en una línea: **la aritmética de cada monto contra su cita está bien; el problema es que los once años no miden lo mismo entre sí ni lo mismo que la serie publicada, y que falta la mitad de la pregunta que la ficha promete responder — qué puso el Estado.**

---

## Objeciones por registro

### finanzas[2004] — Estados Contables al 31/12/2004

**2004.1**
- severidad: corregir
- tipo: cita_fuera_de_contexto
- objecion: la cita de `impuestos_pagados` arranca en `IRIC 3.489.279`, que es un subrenglón *dentro* de RETENCIONES, y termina en `TOTAL 5.249.573.915`. El lector que sume lo citado obtiene ~327 millones y ve un total dieciséis veces mayor. Se cortaron justo las líneas que explican el total y la línea que dice qué es el anexo.
- cita_de_contexto: "Literal D 	Impuestos pagados por la empresa en el ejercicio 2004 / IMPUESTOS 	Importes en Pesos Uruguayos / IVA 	2.527.450.859 / IRIC 	1.091.769.730 / IMP. PATRIMONIO 	929.800.269 / COFIS 	239.486.931 / ICOME 	133.212.100 / RETENCIONES 	133.312.369" (https://portal.ute.com.uy/sites/default/files/docs/Estados_contables_31_12_2004.pdf)
- accion_sugerida: empezar la cita en el encabezado `Literal D Impuestos pagados por la empresa en el ejercicio 2004` y en `IVA 2.527.450.859`. Confirma además que el criterio es el correcto: es el total de tributos abonados, no el IRIC/IRAE solo. Mismo arreglo en 2005, 2006, 2007, 2008, 2010, 2011 y 2012 (ver L6).

**2004.2**
- severidad: corregir
- tipo: documento_previsible
- objecion: los cuatro montos declaran `tipo_cambio: cierre` pero ninguna fuente cita el tipo de cambio. El balance lo declara y la serie publicada 2015-2016 sí lo cita como segunda fuente del monto; acá no. Sin esa cita el lector no puede reproducir la conversión a dólares.
- cita_de_contexto: "Los activos y pasivos en moneda extranjera, arbitrados a dólares estadounidenses (Nota 2) fueron convertidos a moneda nacional a los tipos de cambio de cierre de cada ejercicio (interbancario comprador $ 26,38 y $ 29,29 por dólar al 31/12/04 y 31/12/03 respectivamente)." (mismo PDF, Nota 1.b). El lote usó ~26,38-26,40: el número es correcto, lo que falta es la cita.
- accion_sugerida: agregar la Nota 1.b (o su equivalente) como segunda fuente de un monto de cada año, igual que hace `finanzas[2015]` con "$ 29,948 por dólar al 31/12/15". Verificado en 2004 ($26,38) y en 2008 ($24,362); falta hacerlo en los once.

**2004.3**
- severidad: aviso
- tipo: contexto_omitido
- objecion: `transferencias_al_estado` toma $200.000.000 del Literal E (cifra nominal, redonda) y lo mete en un año cuyo resultado y cuya deuda están expresados en moneda del 31/12/04. El propio estado de flujos de efectivo del mismo balance dice $206.187.186 para el mismo concepto, ajustado. La diferencia es chica acá, pero fija el problema que en 2008 se vuelve grave (ver 2008.1).
- cita_de_contexto: "3) Flujo de efectivo proveniente del financiamiento / Versión a cuenta del Resultado del ejercicio 	(206.187.186) 	(74.704.886)" (mismo PDF).
- accion_sugerida: decir en una oración de `nota`, para todos los años 2004-2011, que resultado y deuda están en moneda de cierre y que tributos y versión de resultados son cifras de caja nominales.

**2004.4**
- severidad: aviso
- tipo: contexto_omitido
- objecion: la columna comparativa de este balance trae el ejercicio 2003 completo (resultado, deuda, versión). La tabla de cobertura declara 2003 como "sin documento público encontrado" citando este mismo documento en la fila de al lado (ver L2).
- cita_de_contexto: "RESULTADO NETO DEL EJERCICIO 	1.834.488.944 	3.640.466.355 … * Cifras en moneda del 31/12/04" y "Versión a cuenta del Resultado del ejercicio 	(206.187.186) 	(74.704.886)" (mismo PDF).
- accion_sugerida: ver L2.

### finanzas[2005] — Estados Contables al 31/12/2005

**2005.1**
- severidad: corregir
- tipo: cita_fuera_de_contexto
- objecion: misma truncatura del Literal D (la cita arranca en `RETENCIONES 194.873.268`; lo citado suma ~369 millones contra un total de 5.059,1). Falta también la cita del tipo de cambio.
- cita_de_contexto: (patrón verificado en el balance 2004, que sí abrí entero; el de 2005 tiene la misma estructura de Literal B/C/D/E)
- accion_sugerida: reencabezar la cita e incorporar la Nota de saldos en moneda extranjera.

**2005.2**
- severidad: aviso
- tipo: contexto_omitido
- objecion: en el PDF de 2005 no aparece un informe de auditoría independiente (busqué "auditoria" y el único resultado es una tabla de activo). En 2004 y 2007 sí está, firmado por Deloitte. La ficha le dice al lector que las cifras salen de "estados contables auditados": si el PDF publicado de 2005 y 2006 no trae el dictamen, hay que decirlo en una oración, como ya se hace con el escaneo de 2017.
- cita_de_contexto: "Estados contables correspondientes a los ejercicios finalizados el 31 de diciembre de 2004 y 2003 e informe de auditoria independiente … Miembro de: Deloitte Touche Tohmatsu" (PDF de 2004) frente a la ausencia del término en los PDF de 2005 y 2006.
- accion_sugerida: confirmar con una búsqueda directa en cada PDF y, si falta, `nota`: "El PDF publicado de este ejercicio no incluye el informe del auditor independiente."

### finanzas[2006] — Estados Contables al 31/12/2006

**2006.1**
- severidad: corregir
- tipo: cita_fuera_de_contexto
- objecion: misma truncatura del Literal D (arranca en `ICOME 190.644.000`, suma ~490 millones contra 5.243,8) y falta la cita del tipo de cambio.
- cita_de_contexto: verificado el patrón en el PDF de 2006, que confirma la reexpresión: "se presentan expresados en moneda del 31/12/06 (los saldos al 31/12/05 fueron reexpresados de acuerdo a la evolución del Índice de Precios al Productor de Productos Nacionales)" (https://portal.ute.com.uy/sites/default/files/docs/Estados_contables_31_12_2006.pdf)
- accion_sugerida: ídem 2005.

**2006.2**
- severidad: sin_objecion
- tipo: sin_objecion
- objecion: la `nota` del año con pérdida dice "El ejercicio cerró con pérdida neta", sin adjetivos, sin verbos de intención y sin atenuante. Es el registro correcto y es el mismo tono que las `nota` de los años con ganancia. Lo dejo asentado porque el punto 4 del encargo pide verificar simetría: acá está bien.

### finanzas[2007] — Estados Contables al 31/12/2007

**2007.1**
- severidad: bloquea
- tipo: contexto_omitido
- objecion: el registro publica $1.541.428.784 (USD 71,7 millones) como versión de resultados vertida en 2007. El balance del año siguiente dice que **esa suma fue íntegramente reducida por dos decretos de 2008 y usada para pagar IRIC, IVA e Impuesto al Patrimonio**: $700.000.000 + $841.428.784 = exactamente $1.541.428.784. Es decir, el dinero terminó contándose como impuestos, no como versión de resultados. Publicado así, el mismo dinero aparece dos veces en la ficha: una en `transferencias_al_estado` de 2007 y otra dentro del `impuestos_pagados` de 2008. Ese doble conteo es visible para cualquier lector que sume la fila.
- cita_de_contexto: "El Decreto N° 206 del 14/04/08 autorizó la reducción en $ 700.000.000 de la versión realizada en el ejercicio 2007, reconociendo dicho importe como pago a cuenta del Impuesto a la Renta de Industria y Comercio del ejercicio finalizado el 31/12/07. Asimismo, por Decreto N° 275 del 09/06/08 se autorizó la reducción en $ 841.428.784 de dicha versión y su utilización para el pago del Impuesto al Valor Agregado y los adelantos mensuales del Impuesto al Patrimonio del presente ejercicio. … Al 31/12/08, la cifra autorizada por los decretos antes mencionados, había sido íntegramente utilizada para el pago de impuestos." (Nota 4.2, https://portal.ute.com.uy/sites/default/files/docs/UTE%20EECC%20individuales%20al311208.pdf)
- accion_sugerida: `nota` de 2007 con esa aclaración, citando la Nota 4.2 del balance 2008, y decidir explícitamente si la cifra de 2007 se mantiene con la aclaración o se ajusta. Cualquiera de las dos sirve; lo que no puede es publicarse sin decirlo.

**2007.2**
- severidad: corregir
- tipo: cita_fuera_de_contexto
- objecion: Literal D truncado (arranca en `- Impuesto al Patrimonio 247.614`) y tipo de cambio no citado ($21,50 al 31/12/07, declarado en el balance de 2008).
- cita_de_contexto: "interbancario $ 24,362 por dólar al 31/12/08 e interbancario comprador $ 21,50 por dólar al 31/12/07" (balance 2008, Nota 2.B).
- accion_sugerida: ídem 2004.1 y 2004.2.

### finanzas[2008] — Estados Contables individuales al 31/12/2008

**2008.1**
- severidad: bloquea
- tipo: cita_fuera_de_contexto
- objecion: el registro publica una transferencia al Estado de $24,6 millones (USD 1,0 millón) para 2008, tomada del Literal E. **El mismo balance, en la Nota 4.2, dice $124.595.000** — cien millones más — y lo cruza con el estado de evolución del patrimonio ($131.167.815 ajustados por inflación), que es la cifra que cierra. Publicar "USD 1,0 millón" es publicar la cifra menor de dos que da el mismo documento, sin decir que hay dos.
- cita_de_contexto: "En el primer trimestre del presente ejercicio fue vertido a Rentas Generales la suma de $ 124.595.000, lo que determina una disminución de los resultados acumulados de $ 131.167.815 a valores ajustados por inflación." (Nota 4.2) y, en el estado de evolución del patrimonio consolidado del balance 2009: "Versión de resultados (131,167,815)". Contra el Literal E del mismo PDF: "El adelanto de versión de resultados realizado en el ejercicio 2008 ascendió a un total de $ 24.595.000 (Nota 4)."
- accion_sugerida: usar $124.595.000 (criterio de caja, que es el que declara la serie publicada) y dejar en `nota` que el Literal E del mismo balance imprime $24.595.000. No conjeturar por qué difieren: no hay verbo de intención disponible y no hace falta.

**2008.2**
- severidad: bloquea
- tipo: riesgo_legal
- objecion: `concepto` dice "el propio balance vincula la pérdida a la sequía y al mayor costo de generación térmica de ese año" y `nota` dice "el propio balance atribuye el resultado, entre otros factores, al aumento del costo de generación térmica". **El balance no dice eso.** La palabra "sequía" no aparece en el documento; "generación térmica" aparece solo en el cuadro de vidas útiles de bienes de uso. Es una explicación causal del investigador puesta en boca del documento, y cae del lado equivocado del art. 336: el registro afirma más de lo que la fuente respalda. Agravante de simetría: el único año al que el lote le pone una explicación es un año de pérdida.
- cita_de_contexto: lo que el documento sí trae es el dato, sin causa: "Gastos de explotación 	24.845.342.099 / Generación 	14.656.224.813" (Literal C 2008) contra "Generación 	2.367.278.912" (Literal C 2004), y "Materiales energéticos y lubricantes 	7.900.108.222 	14.861.731.135" (Nota 6.1 del balance 2009, columnas 2009 y 2008).
- accion_sugerida: reemplazar la atribución por el hecho: "El gasto de explotación en Generación fue de $14.656.224.813 en 2008 (Literal C), contra $2.367.278.912 en 2004". Si el editor quiere la explicación de la sequía, tiene que traerla de una fuente que la haga (memoria anual, ADME, comparecencia parlamentaria) y atribuirla a esa fuente. El mismo umbral vale para los años de ganancia.

**2008.3**
- severidad: corregir
- tipo: contexto_omitido
- objecion: la deuda de 2008 se toma de la Nota 5 ($15.902.122.756), que es **bruta** e incluye intereses a pagar, mientras 2004-2007 usan el renglón "Total Deudas financieras" del estado de situación, **neto de intereses a vencer**. El salto publicado 2007→2008 es de 6.017,0 a 15.902,1 (+164%); sobre base homogénea el propio balance de 2008 dice que 2007 era 7.372.690.510, o sea +116%. El registro exagera el salto por un cambio de convención, no por un cambio de deuda.
- cita_de_contexto: "Total de las deudas financieras 	7.481.558.156 	8.420.564.600 	15.902.122.756 	7.372.690.510" (Nota 5, columnas Corriente / No corriente / Total 2008 / 2007 en moneda del 31.12.08). Que la cuarta columna es 2007 se comprueba renglón a renglón: "BID - Préstamo 903/OC-UR 	101.115.587 	657.251.317 	758.366.904 	807.280.434".
- accion_sugerida: elegir una sola definición para los once años y decirla en una oración. La más barata y la más comparable: tomar cada año de la columna comparativa del balance siguiente, que es lo que ya se hizo bien en 2013 y 2014 contra el balance de 2015. Ver L4.

### finanzas[2009] — Estados Contables al 31/12/2009

**2009.1**
- severidad: sin_objecion
- tipo: sin_objecion
- objecion: el cero de `transferencias_al_estado` está bien y además tiene doble respaldo: el Literal E dice "No se realizaron adelantos de versión de resultados en el ejercicio" y el estado de evolución del patrimonio de ese año no tiene fila de versión de resultados (sí la tiene 2008, con (131.167.815)). Lo dejo asentado porque un cero en una serie es lo que más fácil se lee como omisión.
- accion_sugerida: sumar el estado de evolución del patrimonio como segunda cita del cero; le cuesta al editor una línea y le ahorra al lector la duda.

**2009.2**
- severidad: corregir
- tipo: contexto_omitido
- objecion: las dos fuentes de `deuda_financiera` están tituladas "Pasivo corriente individual" y "Pasivo no corriente individual", pero los mismos importes (7.486.330.942 y 6.704.956.645) figuran en el **estado de situación patrimonial consolidado**, que se identifica sin ambigüedad porque trae "Patrimonio atribuible a interés minoritario 7.576.891". La cita del registro remite a la nota 5.11 y el consolidado remite a la 5.10. El lote mezcla además, en 2010, una Nota 16 que está en la sección consolidada. Con dos juegos de estados en un mismo PDF, el rótulo tiene que ser exacto o la serie no es reproducible.
- cita_de_contexto: "Deudas financieras 	5.10 	7.486.330.942 	7.383.828.087 … Patrimonio atribuible a interés minoritario 	7.576.891 … ESTADO DE SITUACIÓN PATRIMONIAL CONSOLIDADO AL 31 DE DICIEMBRE DE 2009" (https://portal.ute.com.uy/sites/default/files/docs/UTE%20Informe%20Consolidado%20e%20Individual%20%20al%2031%2012%2009%20%20_Aud%20Indep.pdf)
- accion_sugerida: verificar, año por año, de qué juego salió cada cifra y rotularlo. La ficha publicada declara que la serie 2015-2025 es **separada** (excluye fideicomisos de trasmisión); si algún año viejo entró consolidado, la serie no es continua.

**2009.3**
- severidad: bloquea
- tipo: contexto_omitido
- objecion: falta `capitalizaciones_del_estado`. Ver L1: 2009 tiene $42.446.359 de obras DIPRODE más $2.774.718 de aporte de capital.

### finanzas[2010] — Estados Contables al 31/12/2010

**2010.1**
- severidad: bloquea
- tipo: asimetria
- objecion: `transferencias_al_estado` de 2010 son $4.155,9 millones (USD 206,7) **incluyendo** los $2.997 millones que fueron a constituir el Fondo de Estabilización Energética. La ficha publicada fijó el criterio contrario y lo dejó escrito: en 2020 el aporte al Fondo "no se incluye acá por ser un concepto distinto". Con el criterio publicado, 2010 son $1.158 millones (≈USD 57,6), no USD 206,7: una diferencia de 3,6 veces en el año pico de la serie nueva. Y 2013 y 2014, en este mismo lote, sí excluyen el aporte al Fondo. O sea: dentro del lote conviven los dos criterios, y el que infla es el que se aplicó al año más alto.
- cita_de_contexto: criterio publicado: "Además de esta suma, ese mismo año se reconoció una disminución de resultados acumulados de $ 260.191.240 por un aporte al Fondo de Estabilización Energética, que no se incluye acá por ser un concepto distinto." (`content/empresas/ute.yaml`, finanzas 2020). Documento de 2010: "Durante el presente ejercicio fue vertida a Rentas Generales la suma de $ 4.155.900.000 … Del importe transferido, $ 2.997.000.000 (U$S 150.000.000) fueron vertidos con destino a la constitución del Fondo de Estabilización Energética, cuya creación fue dispuesta por el art. 773 de la Ley de Presupuesto Nacional 2010-2014 N° 18.719." (Nota 16, https://portal.ute.com.uy/sites/default/files/docs/UTE31122010%20Estados%20contables%20indycons.pdf). El estado de evolución del patrimonio del balance 2012 abre 01.01.11 con la columna "Transferencia neta al Fondo de estabilización energética (2.997.900.000)"; 4.155.900.000 − 2.997.900.000 = 1.158.000.000, exactamente la versión de 2011 y la de 2013.
- accion_sugerida: aplicar el criterio de 2020 a los once años: la versión de resultados en `transferencias_al_estado`, el movimiento del Fondo declarado en `concepto` con su importe. Y hacerlo en los dos sentidos (aportes 2010, 2013, 2014; cobros 2012), que es lo que evita que el criterio parezca elegido por año.

**2010.2**
- severidad: corregir
- tipo: presentacion
- objecion: el `concepto` de `transferencias_al_estado` de 2010 es un párrafo de tres líneas con la ley, el monto y el destino. La página lo muestra en una celda. Lo mismo pasa con los `concepto` de `resultado_ejercicio` 2004 y 2008 y con los de `deuda_financiera` 2004, 2013 y 2014.
- accion_sugerida: `concepto` de una frase ("Versión de resultados vertida a Rentas Generales en el ejercicio, según la Nota 16"); lo demás a `nota`, que también es de una oración, o a `hitos[]` si es un hecho fechado.

### finanzas[2011] — Estados Contables al 31/12/2011

**2011.1**
- severidad: corregir
- tipo: contexto_omitido
- objecion: la `nota` dice "A partir de 2011 los estados contables de UTE reexpresan también la columna comparativa del ejercicio anterior". Es incorrecto: el balance de 2004 ya reexpresaba 2003, y el de 2008 reexpresaba 2007. Lo que sí ocurre —y no está dicho— es lo contrario: el ajuste integral por inflación **se corta** en 2012.
- cita_de_contexto: "se presentan expresados en moneda del 31/12/04 (los saldos al 31/12/03 fueron reexpresados de acuerdo a la evolución del Índice de Precios al Productor de Productos Nacionales)" (balance 2004); "habiéndose reexpresado los saldos de 2007 a valores del 31/12/08" (balance 2008); "se presentan expresados en moneda del 31/12/09. El índice de ajuste utilizado fue el Índice de Precios al Consumo (IPC), según lo establecido en el art.4° del Decreto N° 99/009" (balance 2009). En el estado de evolución del patrimonio del balance 2012, la fila "Ajuste por inflación" existe sobre los saldos al 01.01.11 y **no existe** sobre los del 01.01.12.
- accion_sugerida: reescribir la nota metodológica (ver L3).

**2011.2**
- severidad: corregir
- tipo: contexto_omitido
- objecion: falta `capitalizaciones_del_estado`: "Aportes OPP a capitalizar 	17.098.906" en los movimientos de 2011. Ver L1.

### finanzas[2012] — Estados Contables al 31/12/2012

**2012.1**
- severidad: bloquea
- tipo: asimetria
- objecion: en 2012 UTE **cobró** $3.403.435.365 del Fondo de Estabilización Energética (≈USD 175 millones al tipo de cambio que el propio lote usa para ese año) y el registro no lo menciona en ningún campo. La ficha publicada registra un cobro equivalente y menor de 2020 —USD 61,8 millones— como `capitalizaciones_del_estado`, le da un hito propio en la línea de tiempo y lo cuenta en el `resumen`. Publicado el lote como está, la ficha le va a mostrar al lector que el Estado le puso plata a UTE en 2020 y nada en 2012, cuando en 2012 fue casi el triple. Es el hallazgo más desbalanceado del lote y no depende de qué gobierno estaba: depende de que el criterio se aplicó a un año y no al otro.
- cita_de_contexto: "Movimientos del ejercicio / Aportes OPP a capitalizar 	5.14 	33.309.875 … Cobros fondo estab. energética 	5.14 	3.403.435.365 … Versión de resultados 	5.14 	(193.000.000) / Resultado del ejercicio 	(3.420.443.068)" (Estado de evolución del patrimonio consolidado, https://portal.ute.com.uy/sites/default/files/docs/UTE%20Diciembre%202012.pdf)
- accion_sugerida: cargar el cobro de 2012 con el mismo campo y el mismo tratamiento que el de 2020, y revisar de paso si hay cobros del Fondo en otros años del período (el saldo de la columna del Fondo se mueve en 2010, 2012, 2013 y 2014).

**2012.2**
- severidad: corregir
- tipo: cita_fuera_de_contexto
- objecion: Literal D truncado (arranca en `- IRPF arrendamientos 378.360`, suma ~120 millones contra 3.683,4) y tipo de cambio no citado.
- accion_sugerida: ídem 2004.1 y 2004.2.

### finanzas[2013] — Estados Contables al 31/12/2013

**2013.1**
- severidad: corregir
- tipo: contexto_omitido
- objecion: 2013 registra $1.158,0 millones de versión de resultados y no dice que en el mismo ejercicio UTE aportó **$3.258.297.009 al Fondo de Estabilización Energética** (≈USD 152 millones), casi el triple. Con el criterio de 2020 el aporte no va dentro de `transferencias_al_estado`, pero sí va declarado en `concepto`, que es exactamente lo que hace el año 2020 publicado. Falta también `capitalizaciones_del_estado` por "Aportes OPP a capitalizar 99.366.489".
- cita_de_contexto: "Movimientos del ejercicio / Aportes OPP a capitalizar 	5.15 	99.366.489 … Ajuste cobro fondo estab. energética 	5.15 	(81.031.687) / Aporte al fondo estab. energética 	5.15 	(3.258.297.009) / Versión de resultados 	5.15 	(1.158.000.000) / Resultado del ejercicio 	6.490.615.982" (https://portal.ute.com.uy/sites/default/files/docs/EECC%20con%20dictamen%202014.pdf)
- accion_sugerida: declarar el movimiento del Fondo en `concepto` y cargar los aportes OPP.

**2013.2**
- severidad: sin_objecion
- tipo: sin_objecion
- objecion: el $1.158.000.000 de 2013 coincide exactamente con el de 2011, lo que a primera vista parece un arrastre de cifra. No lo es: el estado de evolución del patrimonio del balance 2014 confirma "Versión de resultados (1.158.000.000)" en los movimientos de 2013. Lo dejo asentado para que nadie lo "corrija" después.

### finanzas[2014] — Estados Contables al 31/12/2014

**2014.1**
- severidad: corregir
- tipo: contexto_omitido
- objecion: igual que 2013: $1.354,9 millones de versión y sin mención del aporte de **$3.655.752.392 al Fondo de Estabilización Energética** (≈USD 150 millones) ni de los "Aportes OPP a capitalizar 151.259.037".
- cita_de_contexto: "Movimientos del ejercicio / Aportes OPP a capitalizar 	5.15 	151.259.037 / Aporte al fondo estab. energética 	5.15 	(3.655.752.392) … Versión de resultados 	5.15 	(1.354.860.000) / Resultado del ejercicio 	10.490.649.914" (mismo PDF).
- accion_sugerida: ídem 2013.1.

**2014.2**
- severidad: sin_objecion
- tipo: sin_objecion
- objecion: los dos controles cruzados que el investigador declara en `notas.md` son ciertos y los verifiqué: la deuda de 2013 (3.798.623.148 + 16.405.622.916 = 20.204.246.064) y la de 2014 (2.849.906.124 + 20.724.398.903 = 23.574.305.027) coinciden al peso con la columna comparativa de la Nota 8 del balance 2015 ya publicado ("Deuda (i) 	29.532.638.734 	23.574.305.026 	20.204.246.064"). Para 2013 y 2014, la deuda es homogénea con la serie publicada. El problema es 2004-2012 (L4).

---

## Objeciones al lote

**L1 — Falta la mitad de la pregunta: qué puso el Estado.**
- severidad: bloquea · tipo: asimetria
- Los once años registran lo que UTE le dio al Estado (resultado, tributos, versión de resultados) y ninguno registra lo que el Estado puso. `capitalizaciones_del_estado` está vacío en los once, y hay aportes documentados en al menos siete: 2007 ($31.928.839 DIPRODE), 2008 ($65.827.892 DIPRODE + $229.742.655 del MEF por los aerogeneradores, USD 10.766.671), 2009 ($42.446.359 + $2.774.718), 2011 ($17.098.906 OPP), 2012 ($33.309.875 OPP + $3.403.435.365 del Fondo), 2013 ($99.366.489 OPP), 2014 ($151.259.037 OPP).
- Citas: "4.1 Capitalizaciones del ejercicio — En el ejercicio 2008 se contabilizó el aporte de DIPRODE a las obras realizadas en el marco del Proyecto de Satisfacción de la Demanda de Energía Eléctrica al Norte del País y que asciende al monto de $ 65.827.892 ($ 31.928.839 en el ejercicio 2007). En el primer trimestre del presente ejercicio se recibió un aporte de capital correspondiente a la cuota parte del costo de los aerogeneradores y costos asociados a la construcción del parque eólico, asumida por el Ministerio de Economía y Finanzas en el marco del Programa de conversión de deuda externa de Uruguay frente al Reino de España, por U$S 10.766.671 ($ 229.742.655 a valores del 31/12/08)." (balance 2008, Nota 4.1); "Aporte de capital 5.14 2,774,718 / Capitalización obras DIPRODE 5.14 42,446,359" (balance 2009, evolución del patrimonio).
- El esquema dice, en su propio comentario, que la ficha existe para responderle al dueño "qué le pasó al Estado y qué puso el Estado". Once años con una sola de las dos columnas no es una serie incompleta: es una serie sesgada, en la dirección de mostrar a la empresa aportando más de lo que recibe. Y la ficha publicada ya afirma "No se encontraron otras capitalizaciones directas del Estado a UTE en el período 2015-2025"; si esa frase se extiende hacia atrás sin buscar, es falsa.
- accion_sugerida: cargar `capitalizaciones_del_estado` año por año desde la nota "Capitalizaciones del ejercicio" / estado de evolución del patrimonio de cada balance. Es un renglón por año en un documento que ya está descargado.

**L2 — La tabla de cobertura declara vacío un período donde hay documentos.**
- severidad: bloquea · tipo: contexto_omitido
- La fila "1912-2003 · sin documento público encontrado" es lo que la ficha le va a decir al lector, y es falsa en los dos extremos que pude comprobar:
  1. **2003** está en la columna comparativa del balance de 2004, que el propio lote cita: resultado neto $3.640.466.355, deudas financieras corriente $4.615.697.120 y no corriente $7.029.888.291, versión a cuenta del resultado $74.704.886, todo en moneda del 31/12/04. Declarar "sin documento" un año cuyas cifras están en un PDF citado tres filas más arriba es el tipo de error que un lector encuentra en cinco minutos.
  2. **1999 y 2000** están en la Memoria Anual del Poder Ejecutivo, en un dominio del Estado y con texto extraíble: `http://archivo.presidencia.gub.uy/mem2000/info/UTE.htm` (33.926 caracteres, título "ADMINISTRACION NACIONAL DE USINAS Y TRASMISIONES ELECTRICAS", Wayback `20171001093425`), con el cuadro "Ingresos totales (miles U$S) 694.300 / 701.000 · Patrimonio (miles U$S) 2.378.000 / 2.471.000 · Endeudamiento (miles U$S) 969.000 / 866.000 / -10.63". Existe además el índice del tomo: `http://archivo.presidencia.gub.uy/mem2000/info/index.htm` ("INDICE ORGANICO DE LA MEMORIA ANUAL DEL EJERCICIO 2000").
- Las tres búsquedas que `consultas.jsonl` registra para el período (índice de UTE, BVM y web general) no incluyen ninguna de las rutas obvias. Lo que quedó sin probar y es previsible, con organismo y ruta:
  - **Memoria Anual del Poder Ejecutivo**, capítulo UTE, en `archivo.presidencia.gub.uy` para los demás años del período 2000-2005 (el patrón `mem2001/info/UTE.htm` da 404, así que hay que entrar por el índice del archivo del período, `archivo.presidencia.gub.uy/sci/pages/00-05.htm`, que es un frameset).
  - **Tribunal de Cuentas** (`tcr.gub.uy`): dictamina las rendiciones de cuentas de los entes autónomos y publica resoluciones; su Departamento 2 controla a UTE.
  - **Rendición de Cuentas y Balance de Ejecución Presupuestal** del MEF/Contaduría General de la Nación, tomo con el anexo de empresas públicas (`gub.uy/ministerio-economia-finanzas/tematica/rendicion-cuentas-balance-ejecucion-presupuestal`).
  - **Portal de Transparencia Presupuestaria de OPP**, ficha UTE (`transparenciapresupuestaria.opp.gub.uy/inicio/empresas-publicas/ute`), que publica justamente los montos transferidos entre las empresas y Rentas Generales. Lo abrí: la página sirve un tablero JS y el texto extraíble trae los compromisos de gestión, no la serie; hay que ir por el dataset descargable del portal. Es un dato oficial y sirve además de contraste independiente para 2004-2014.
  - **Auditoría Interna de la Nación** (`ain.gub.uy`) y el **catálogo de la Biblioteca del Poder Legislativo** (`pmb.parlamento.gub.uy`), que indexa "Memoria anual" de UTE.
  - El **Archivo General de UTE** figura en el censo de archivos con fondos de 1889 a 2007; eso no es citable en línea, pero sí es lo que habría que decirle al lector que existe en papel.
  - Probé el Wayback de `ute.com.uy` anterior a 2004: hay snapshot (`20030209023822`), pero el sitio era una portada Flash sin texto útil. Ese sí es un callejón sin salida y conviene registrarlo como tal.
- accion_sugerida: no publicar la tabla con "sin documento público encontrado" hasta correr esas búsquedas. La redacción honesta mientras tanto es "no digitalizado en las fuentes consultadas (lista)", no "no existe". Y agregar la fila 2003 con lo que ya está citado, marcada como "columna comparativa del balance 2004, en moneda del 31/12/04".

**L3 — "Moneda de cierre" está mal delimitada, y es la advertencia que sostiene todo el gráfico.**
- severidad: bloquea · tipo: contexto_omitido
- La nota metodológica dice que las cifras "en moneda del" año de cierre son las de 2004-2007. Son las de **2004 a 2011**: los balances aplican ajuste integral por inflación (IPPN hasta 2008, IPC desde 2009 por el Decreto 99/009) y dejan de hacerlo en el ejercicio 2012. Cada uno de esos ocho años está en una unidad de medida distinta, y desde 2012 la serie pasa a pesos nominales. Puesto en un gráfico sin decirlo, el lector lee crecimiento donde hay cambio de unidad.
- Segundo nivel del mismo problema, que ninguna `nota` recoge: **dentro de un mismo año** el lote mezcla unidades. `resultado_ejercicio` y `deuda_financiera` salen de estados reexpresados; `impuestos_pagados` (Literal D) y `transferencias_al_estado` (Literal E) son cifras de caja nominales. Se ve en 2004 ($200.000.000 nominal en el Literal E contra $206.187.186 ajustados en el flujo de efectivo) y en 2008 ($124.595.000 nominal contra $131.167.815 ajustados).
- accion_sugerida: una oración en la ficha, no un párrafo, del tipo: "Hasta el ejercicio 2011 los estados contables se ajustaban por inflación y cada año está expresado en la moneda de su cierre; desde 2012 son pesos corrientes. Las columnas de tributos y de versión de resultados son cifras de caja nominales en todos los años." Y que el gráfico marque el corte 2011/2012, como marca el hueco de 2017.

**L4 — La deuda financiera no mide lo mismo en los once años.**
- severidad: corregir · tipo: contexto_omitido
- Tres convenciones conviven: 2004-2007 "Total Deudas financieras" neto de intereses a vencer; 2008 la Nota 5 bruta; 2009-2012 el renglón del estado de situación; 2013-2014 la presentación NIIF que sí coincide con la serie publicada. La nota metodológica afirma que 2004-2012 usan todos el neteo, lo que 2008 desmiente.
- accion_sugerida: reconstruir la serie tomando cada año de la columna comparativa del balance siguiente (que ya está descargado en los once casos) o, si eso no se puede, declarar el quiebre en el punto exacto con la `nota` del año, que es lo que el esquema de `SerieParidad` ya prevé para los gráficos y lo que corresponde también acá.

**L5 — Ningún año cita el tipo de cambio con el que se convirtió a dólares.**
- severidad: corregir · tipo: documento_previsible
- Los cuarenta y cuatro montos declaran `tipo_cambio: cierre`; ninguno tiene la cita. Verifiqué dos ($26,38 al 31/12/04, $24,362 al 31/12/08) y las conversiones del lote son correctas e internamente consistentes año por año, así que esto no es un error de cálculo: es un agujero de verificabilidad, y la serie publicada 2015-2016 no lo tiene porque cita la nota de saldos en moneda extranjera. El documento es previsible: está en la Nota 1.b (o 2.B) de cada balance ya descargado.

**L6 — Ocho de once citas del Literal D empiezan en el medio de la tabla.**
- severidad: corregir · tipo: presentacion
- 2004, 2005, 2006, 2007, 2008, 2010, 2011 y 2012 citan un tramo final que no cierra con el TOTAL que acompañan (2009, 2013 y 2014 sí cierran, y se nota la diferencia). No es un problema de veracidad —el total citado es el del documento— sino de que el lector no puede comprobar nada con lo que ve. Nota de simetría: el año 2015 ya publicado tiene el mismo defecto, así que el arreglo corresponde también hacia adelante, por corrección de tipo `presentacion`; objetar solo los años nuevos sería aplicar dos varas.

**L7 — Presentación (lista de control).**
- severidad: corregir · tipo: presentacion
- (a) **Gráfico**: la ficha pasa de 11 a 22 años de resultados, tributos, transferencias y deuda. Cuatro series de veintidós puntos en una tabla no se leen. Hace falta el gráfico con el corte metodológico marcado (2011/2012) y el hueco de 2017 visible, y con dos colores y dos trazos si se superponen pesos y dólares, no cuatro colores.
- (b) **Resumen**: hoy dice "En los diez años de 2015 a 2024, el resultado del ejercicio de UTE fue positivo en los nueve años con datos disponibles". `notas.md` argumenta que la frase "sigue siendo válida sin cambios porque ese texto se refiere solo a esa ventana". Es válida y es insuficiente: el lector va a ver una tabla de 2004 a 2025 con un resumen que solo narra la mitad más reciente, y las tres pérdidas nuevas (2006, 2008, 2012) quedarían fuera del texto mientras los años de ganancia quedan dentro. Hay que extender los cuatro párrafos de resultado, tributos, transferencias y deuda a todo el período, con el mismo tono para los años buenos y los malos.
- (c) **Hitos**: la línea de tiempo tiene "UTE recibe USD 61,8 millones del Fondo de Estabilización Energética" (2020) y no tiene la creación del Fondo ni el aporte de UTE de USD 150 millones que lo constituyó (2010), ni el cobro de 2012. Tal como está, el Fondo solo aparece cuando entra plata a UTE. La propuesta de `para_el_editor` para el hito de 2010 es correcta y está bien fuenteada (Nota 16 del balance 2010 + art. 773 de la Ley 18.719); hay que agregar también el cobro de 2012 y el aporte de 2013-2014 o, si no se quiere una línea de tiempo llena de movimientos del Fondo, ninguno de los cuatro y todo en el `resumen`.
- (d) **Hito 2008**: la propuesta de `para_el_editor` arrastra la atribución causal no respaldada (ver 2008.2). Un hito "Mayor pérdida de la serie: $8.267.177.704 (USD 339,3 millones)" con la cifra del Literal C al lado es publicable; con la explicación de la sequía sin fuente, no.
- (e) **`concepto` con párrafos**: ver 2010.2.
- (f) **Fuentes repetidas**: 54 fuentes nuevas para 11 documentos, cinco por año, todas al mismo PDF con distinta cita. Es lo que el esquema exige (cada monto con su renglón) y es lo que ya hace la serie publicada, así que **no lo objeto**; lo dejo asentado para que la página las agrupe por URL al mostrarlas, como hace con la fuente primaria de una entrevista.
- (g) **`segmentos[]` vacío**: correcto y consistente con la ficha publicada, que explica que UTE no atribuye resultado por segmento. Pero conviene saber que **desde 2004 los balances traen el Literal B (ingresos por actividad) y el Literal C (gastos por actividad y resultados), con Generación, Trasmisión, Distribución y Consultoría desagregados**, que es la información que la Ley 16.832 art. 15 le exige a las empresas con más de una actividad. De paso: el `resumen` publicado dice que ese desglose de costos está "en el Literal D de cada balance"; en estos años está en el **Literal C**. Corregir al pasar.

**L8 — Dependencia de un solo publicador.**
- severidad: aviso · tipo: un_solo_grupo
- Las 54 fuentes nuevas son `medio: ute`, `tipo: documento_oficial`, todas de `portal.ute.com.uy`. Para estados contables auditados eso es la fuente primaria y está bien: la regla de dos grupos es para `reportado`, no para esto. Pero conviene decirlo en el informe: toda la serie histórica de la empresa está sostenida por documentos que publica la propia empresa auditada, en su propio portal, y existen contrastes públicos independientes (dictámenes del Tribunal de Cuentas, AIN, la serie de OPP) que nadie consultó. Verifiqué además que el dictamen de auditoría independiente está en los PDF de 2004 (Deloitte), 2007 y 2014, y **no aparece** en los de 2005 y 2006.

**L9 — Esto es una modificación de un registro ya publicado.**
- severidad: aviso · tipo: presentacion
- `content/empresas/ute.yaml` ya está publicado, así que estos once años no entran por `pnpm promover --corrida` sino por `pnpm promover --correccion`, con un registro previo en `content/correcciones/` que diga qué cambia y por qué. Lo anoto porque el lote está armado como una copia completa de la ficha y se puede promover por reflejo.

**L10 — El YAML del lote reformateó líneas que no cambió.**
- severidad: aviso · tipo: presentacion
- Diferencias de reflow en `comparaciones`, `hitos` y `resumen` (mismo texto, distinto corte de línea). Sustantivamente idénticas —lo verifiqué línea a línea—, pero van a ensuciar `edicion.diff` y hacer que una corrección de datos parezca tocar el resumen.

**L11 — No hay `discrepancias.yaml` y corresponde que no lo haya.**
- severidad: aviso · tipo: sin_objecion
- No hay una sola nota de prensa en el lote, así que no hay nada que cotejar contra el documento. Las dos contradicciones que encontré (Literal E contra Nota 4.2 en 2008; Nota 16 contra la columna del patrimonio en 2010) son **internas al mismo documento primario**, no distancia entre un medio y el original: van a la `nota` del registro, no a `content/discrepancias/`. Lo digo explícitamente porque la tentación de anotarlas ahí existe y el esquema no las admite.

---

## Objeciones al brief

El brief no viola la Regla 0. Extender hacia atrás una serie contable de un ente del Estado, con el mismo esquema y el mismo rigor, tratando todos los años igual, es exactamente la forma simétrica de resolver lo que el lector señaló. Cubre gobiernos de tres partidos (2004 colorado, 2005-2014 Frente Amplio, y la serie publicada agrega blanco y Frente Amplio) sin instruir nada sobre ninguno. Coincido con `objeciones_al_brief` del investigador en que no hay ángulo partidario. Dos observaciones de alcance, no de sesgo:

1. **"Sin tocar `resumen` ni `hitos`" es correcto para el investigador y no puede quedar así al publicar.** Si el lote se promueve tal cual, la ficha queda con veintidós años de datos y un resumen que narra once, y con una línea de tiempo donde el Fondo de Estabilización Energética solo aparece el año en que UTE cobra. Eso no lo causó el brief, pero el brief tampoco lo previó: hay que agregar el paso de editor "extender resumen e hitos a todo el período" antes de cerrar la corrida, con el mismo detalle para los años de pérdida que para los de ganancia.

2. **El brief pidió cifras "en pesos tal como figuran" y la conversión al tipo de cambio "que declare el propio balance", pero no pidió citar ese tipo de cambio.** Es la causa directa de L5. Para la próxima ficha de empresa conviene que el brief lo pida explícitamente, porque la serie publicada ya lo hacía y el investigador no tenía por qué inferirlo.

3. Un punto que el brief sí previó y el lote no ejecutó: pedía `capitalizaciones_del_estado` en la lista de campos por año (punto 1 del encargo). Quedó vacío en los once. No es una falla del brief.

---

## Cobertura

Ninguna. El lote no contiene notas de prensa: sus 54 fuentes nuevas son estados contables de UTE (`documento_oficial`). No hay tono que medir y no emito registros `cobertura`.

Lo dejo asentado porque la ausencia de registros de tono también se audita, y porque acá no es una omisión sino la consecuencia correcta de que la corrida se apoyó en fuente primaria en el 100% de los casos.

```yaml
# sin registros de cobertura en esta corrida: 0 notas de prensa leídas
```

---

## Conteo

- `bloquea`: 9 — 2007.1, 2008.1, 2008.2, 2009.3, 2010.1, 2012.1, L1, L2, L3. (2009.3 es el caso particular de L1 en un año; se resuelven juntos.)
- `corregir`: 17 — 2004.1, 2004.2, 2005.1, 2006.1, 2007.2, 2008.3, 2009.2, 2010.2, 2011.1, 2011.2, 2012.2, 2013.1, 2014.1, L4, L5, L6, L7.
- `aviso`: 7 — 2004.3, 2004.4, 2005.2, L8, L9, L10, L11.
- `sin_objecion`: 4 — 2006.2, 2009.1, 2013.2, 2014.2.
- Registros `cobertura`: 0 (el lote no tiene notas de prensa).
- Total de objeciones: 33 sobre 11 registros nuevos, más la tabla de cobertura y la nota metodológica.
