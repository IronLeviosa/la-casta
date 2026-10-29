# Crítica — corrida 2026-10-29-correccion-batlle-chequeos-dato-oficial

Lote: inbox/correcciones/batlle-chequeos-dato-oficial-2026-10-29/
Registros revisados: 5 de 5 (sin muestra: es una corrección con cinco ids en `afecta[]`).
Banco (`pnpm banco`, según el brief): sin evidencia guardada para ninguno de los cinco.

Fuentes releídas con `pnpm fuente --buscar`: comunicado del MEF del 31/1/2013; Memoria Anual 2003 del BCU (I.4.1, nota 14 y cuadro I.4.1); diario de la Cámara del 19/8/2004 (Rendición de Cuentas 2003 y sus firmas); diario de la Cámara del 11/10/2005 (cuadro del Presupuesto 2005-2009); exposición de motivos de la Rendición de Cuentas del ejercicio 2013 (tres tramos); El Observador del 5/2/2013; La República del 1/7/2013; decreto 7/013; transcripción de Presidencia del 7/11/2005 (tres tramos); El País del 28/11/2005; respuesta de la API del Banco Mundial; transcripción de Presidencia del 26/1/2005 (balance del equipo económico); Montevideo Portal, «Las nuevas franjas del IRPF» (enero de 2013). Las siete líneas de `consultas.jsonl` del lote son búsquedas de este crítico, no del resolvedor (ver «Objeciones al lote»).

## Resumen

```yaml
- registro: chequeos[0]   # déficit fiscal 2003 contra 2012
  severidad: bloquea
  tipo: presentacion
  # El título dice «ambos 2,8% del PIB» y dato_real/análisis dicen que la Memoria BCU 2003 no tiene texto legible:
  # los documentos nuevos refutan las dos cosas. La corrección no puede salir sin reescribir título, valor y análisis.
- registro: chequeos[0]
  severidad: corregir
  tipo: contexto_omitido
  # Las tres cifras de 2003 tienen perímetro, método y versión distintos; el registro tiene que decir cuál manda y por qué.
- registro: chequeos[0]
  severidad: aviso
  tipo: explicacion_alternativa
  # PIB rebasado (documento previsible, sin abrir), otro año (descartado), «peor momento» en 2003 (tiene base).
- registro: chequeos[0]
  severidad: aviso
  tipo: asimetria
  # El 1,9% «sin factores extraordinarios» de 2012 va solo con su lista y con la composición de 2003, o no va.
- registro: chequeos[0]
  severidad: aviso
  tipo: un_solo_grupo
  # El tier sigue en probable por la segunda fuente; la nota es crónica de radio Monte Carlo, no «entrevista exclusiva».
- registro: chequeos[1]   # licitación desierta, junio de 2013
  severidad: corregir
  tipo: documento_previsible
  # Faltó la puerta de las Letras de Regulación Monetaria del BCU (resultados de licitaciones, Memoria 2013, IPM).
- registro: chequeos[1]
  severidad: corregir
  tipo: presentacion
  # El análisis afirma sin fuente que «el gobierno colocaba habitualmente» montos de ese orden; valor con narración de proceso.
- registro: chequeos[2]   # IRPF/IASS, $ 2.500 millones
  severidad: corregir
  tipo: contexto_omitido
  # El decreto 7/013 es contexto, no el dato; la Rendición 2013 sí trae la cifra de los US$ 140 millones. Sigue discutible.
- registro: chequeos[2]
  severidad: corregir
  tipo: presentacion
  # «La ley a la que se refiere el gobierno» (es Batlle); título que afirma la cifra como hecho; narración de proceso.
- registro: chequeos[3]   # USD 40 millones, 50 empresas
  severidad: bloquea
  tipo: cita_fuera_de_contexto
  # La cita «estamos trabajando sobre ese cálculo... un número relativo» responde una pregunta sobre el IRPF, y el ministro
  # da el número enseguida. No puede entrar con la glosa «el cálculo todavía se estaba haciendo».
- registro: chequeos[3]
  severidad: corregir
  tipo: presentacion
  # Cita del tipo de cambio sin la cifra; «plausible» sin fuente; afirma el contenido de un documento que nadie abrió; «techo».
- registro: chequeos[4]   # USD 15 millones, bancos
  severidad: bloquea
  tipo: cita_fuera_de_contexto
  # La misma cita del «número relativo», con la misma glosa.
- registro: chequeos[4]
  severidad: corregir
  tipo: explicacion_alternativa
  # «Sugiere que la cifra de Batlle no incluía...» es lectura de intención; hay dos lecturas y una tiene documento previsible.
```

## Objeciones por registro

### chequeos[0] — 2013-02-05 — «Nosotros en el peor momento de la crisis, en 2003, tuvimos como déficit fiscal sobre el producto 2,8%»

**Premisas del pedido, verificadas contra el registro y contra cada fuente.**

1. *La Memoria BCU 2003 tiene texto legible*: sí. El corpus la tiene con 382.628 caracteres de texto, y la sección I.4.1 y el cuadro I.4.1 se leen enteros. El registro publicado dice lo contrario en `dato_real.valor` («un PDF escaneado cuyo contenido no está disponible todavía como texto legible») y en `analisis` («está en un PDF escaneado sin texto legible»). También dice que la página del MEF «no tiene en su paginación visible los comunicados de 2012-2013», y el comunicado apareció. Esas tres frases eran ciertas por el estado del corpus en su momento y hoy son falsas: salen.
2. *2012 = 2,8%*: sí. Comunicado del MEF del 31/1/2013: «El resultado global del Sector Público Consolidado en el año 2012 fue de -2,8% del PIB». La Rendición de Cuentas 2013 lo confirma en el cuadro de proyecciones («RESULTADO GLOBAL SECTOR PÚBLICO CONSOLIDADO -2,8 -2,4 -3,3 -3,2», columnas 2012, 2013, 2014*, 2015*, «Resultado en base caja»). Esta segunda fuente contiene la cifra, así que puede entrar, aunque sobra.
3. *2003 = 3,0 / 3,2 / 3,1%*: las tres cifras están donde dice el resolvedor. Hay dos detalles que el pedido no recoge bien (en negrita):

| Documento | Emisor | 2003 | 2002 | Perímetro y método, según el propio documento |
|---|---|---|---|---|
| Memoria Anual 2003, I.4.1 y cuadro I.4.1 | BCU (publicada en 2004: el texto trae datos de enero de 2004, así que `fecha: 2003-12-31` está mal) | −3,0% | **−4,2%** | «Sector Público Global» / «Consolidado del sector público total»: gobierno central, seguridad social, empresas públicas, IMM/INC y BCU. «Datos sobre la línea; no incluye bancos oficiales». Intendencias «estimados para 2003». Nota 14: el resultado por debajo de la línea «no estaba disponible al cierre de este informe». Es una cifra preliminar. |
| Rendición de Cuentas 2003, informe económico financiero (diario de la Cámara, 19/8/2004) | Poder Ejecutivo; el mensaje lo firman Jorge Batlle Ibáñez y sus ministros, con Isaac Alfie en Economía | −3,2% | −4,1% | **Lo dice dos oraciones antes de la cita**: «El resultado del sector público en su conjunto, medido por fuentes de financiamiento según un criterio de caja», con gobierno central, BCU y resto del sector público no financiero. El resolvedor anotó que «el diario no dice si es global o consolidado», y eso es incompleto. |
| Presupuesto 2005-2009, cuadro «RESULTADO GLOBAL DEL SECTOR PÚBLICO» (diario de la Cámara, 11/10/2005) | Poder Ejecutivo (Astori en Economía) | −3,1% | −4,1% | Resultado primario de gobierno central, empresas públicas, BCU e intendencias, menos intereses. Los renglones del cuadro (INGRESOS SPNF, DGI, Comercio Exterior, BPS, Resultado Primario Corriente Empresas Públicas, Egresos Primarios Corrientes GC-BPS…) son los mismos del cuadro del comunicado de 2012. |
| Comunicado del 31/1/2013 | MEF | — | — | 2012: −2,8%. Sector Público Consolidado: sector público no financiero, intendencias, BSE y BCU. Base caja. |

El pedido afirma que «los mismos documentos ponen el pico en 2002 (4,1%)». Dos de los tres dan 4,1% y el BCU da 4,2%. Si el análisis menciona 2002, va «4,1 a 4,2%».

**Comparabilidad.** Las tres cifras de 2003 y la de 2012 son del sector público consolidado con el BCU adentro. El perímetro es del mismo orden. Ninguna es del gobierno central-BPS, y nada en estos documentos respalda una lectura de «2,8% del gobierno central-BPS». Quedan tres diferencias:

- El consolidado de 2012 incluye el BSE (intereses del BSE −0,2% del PIB, es decir, ingreso neto), y los cuadros de 2003 no lo listan.
- Los cocientes de 2004-2005 usan el PIB de entonces. Los de 2013 usan el vigente en 2013.
- El BCU mide sobre la línea y de forma preliminar. La Rendición 2003 y el MEF de 2012 miden por fuentes de financiamiento, base caja.

Sin el BCU, el mismo cuadro I.4.1 da −2,5% para 2003 (renglón SPNG: gobierno central, seguridad social, empresas públicas e intendencias). Tampoco es 2,8%.

**Qué cifra manda para 2003.** La del Presupuesto 2005-2009, 3,1%. Es la versión oficial más reciente de 2003 que trae el lote. Sale de la misma serie del MEF que da el 2,8% de 2012 (mismo cuadro, mismos renglones) e incluye BCU e intendencias, como la de 2012. La del BCU es preliminar por su propia nota 14. La de la Rendición 2003 es la primera versión de la serie de caja, revisada después. El criterio es general y vale para cualquiera: manda la última versión oficial de la misma serie que la cifra contra la que se compara. Las otras dos no se callan: van en `dato_real.valor` con su perímetro.

**Lectura del chequeo y calificación.** La mitad de 2012 es exacta. La mitad de 2003 queda entre 0,2 y 0,4 puntos por debajo del dato oficial. Contra 3,0 / 3,1 / 3,2, la diferencia relativa es de 6,7%, 9,7% y 12,5%. Con la cifra que manda, la diferencia es de 9,7%, dentro del margen de `impreciso` de `docs/colecciones/chequeos.md`. El sentido se mantiene: en los tres documentos 2012 queda apenas por debajo de 2003, y «el déficit de 2012 estaba a la altura del de 2003» sigue siendo cierto en lo grueso. Propuesta: **`impreciso`**.

- No `verdadero`: ningún documento da 2,8% para 2003.
- No `discutible`: ya hay documento, y quedarse en discutible solo por un PIB rebasado que nadie abrió es lo que la regla llama investigación por la mitad.
- `falso` solo si mandara la cifra de la Rendición 2003.

Está en el borde, y con cifras redondeadas a un decimal el borde es real. El análisis tiene que decir el margen en números, y también que con el 3,2% de la Rendición 2003 la diferencia pasaría el 10%. Ninguna cifra se redondea para que entre. Si el editor elige otra cifra como la que manda, escribe el criterio en `razones.md` y el mismo criterio vale para todos.

**Explicaciones alternativas, escritas aunque no convenzan.**

1. *PIB rebasado.* En febrero de 2013 una serie del MEF calcularía 2003 sobre el PIB vigente entonces, y un nivel de PIB revisado cambia el cociente. No apareció en el corpus ni en la web. El documento previsible es la serie histórica anual del MEF del resultado del Sector Público Consolidado en % del PIB, o un cuadro de una Rendición o del Presupuesto 2010-2014 que arranque en 2003 o antes. Es la única lectura en la que «2,8% en 2003» podría ser una cifra oficial en 2013. No se afirma en qué dirección movería la cifra, porque no se sabe.
2. *Otro año.* Ningún año de 2001 a 2004 da 2,8%. Los documentos dan 3,9-4,1% para 2001, 4,1-4,2% para 2002 y 2,0% para 2004 (Presupuesto). El ministro de Economía de su propio gobierno habló de 1,9% para 2004 el 26/1/2005: «un déficit total de 1,9 por ciento del PBI, que es el mejor resultado en seis años» (https://archivo.presidencia.gub.uy/noticias/archivo/2005/enero/2005012603.htm). En la misma entrevista Batlle dice «dejamos el gobierno en 2004», y entregó en marzo de 2005. La cronología de esa entrevista es floja, pero eso no es materia del chequeo.
3. *«El peor momento de la crisis, en 2003».* El titular de El Observador dice «de 2002» porque nombra la crisis, y Batlle dijo 2003. El déficit tocó techo en 2002, pero según los mismos documentos 2003 fue el peor año del salario real (−12,4% después de −10,7%, cuadro 1.3.6 de la Memoria BCU) y el de mayor carga de intereses (6,1% del PIB contra 4,4% en 2002, cuadro del Presupuesto). La lectura de «peor momento» en 2003 tiene base. El chequeo se mide contra 2003, como lo dijo, no contra el pico de 2002. Si el análisis menciona el pico, menciona también lo otro.

**Simetría del contexto.** El comunicado del MEF dice que 2012 fue 1,9% «dejando de lado los factores de carácter extraordinario». Batlle habló del resultado observado, y el ajustado es otra medida. Si el análisis lo usa, va con lo que el MEF ajusta y con la composición de 2003 de los mismos documentos:

- Lo que el MEF ajusta en 2012: sobrecosto energético de 1,0% del PIB, y egresos extraordinarios de 0,3% que incluyen el pago a los bancos por la liquidación del Banco Comercial «en el marco de la crisis del año 2002» y el cierre de Pluna.
- La composición de 2003: superávit primario de 3,0-3,2% e intereses de 6,1% del PIB, contra primario de −0,2% e intereses de 2,6% en 2012.

O van las dos cosas o ninguna: un solo lado inclina la lectura. Cada cifra se atribuye a su emisor con la misma fórmula: BCU; Rendición de Cuentas 2003 del gobierno de Batlle; Presupuesto 2005-2009; MEF en 2013. Que el 3,2% salga de la Rendición que firmó el propio Batlle es un dato del documento y se dice en una línea, sin adjetivo.

**Presentación.**

- `titulo`: hoy afirma «ambos 2,8% del PIB». Propuesta: «Déficit de 2012 igual al de 2003: 2,8% en 2012, entre 3,0 y 3,2% en 2003».
- `dato_real.valor`: dos párrafos con cifra, perímetro, período y fuente. Sin «no hay, con las fuentes revisadas», «paginación visible» ni «PDF escaneado».
- `analisis`: la primera oración hace la comparación (qué dijo, qué dice el dato que manda, cuánto difiere), y no más de 350 palabras. Sale «no porque las cifras sean inverosímiles».
- `grafico` de barras: 2003 según cada uno de los tres documentos, 2012 según el MEF y la cifra que dijo Batlle, con una serie por publicador. La `nota` dice que no es una serie continua. Si se dibujan años, los que faltan se declaran: un hueco no es un cero.
- `perimetro` no es un campo de Fuente: va al `titulo` de cada fuente o al valor.

**Tier.** Sigue en `probable`. La declaración tiene una sola nota (El Observador), y eso no lo cambia ningún `dato_real`. `notas_internas` dice «entrevista exclusiva», pero la nota dice «declaraciones a radio Monte Carlo». La «búsqueda agotada» (línea 108 de `consultas.jsonl` de la corrida 2026-09-16) fue una sola consulta web, y en el corpus «encalacrada» da un solo resultado.

- cita_de_contexto: "El resultado del sector público en su conjunto, medido por fuentes de financiamiento según un criterio de caja, mostró en el año 2003 un déficit de $ 10.044 millones" (https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2004-08-19%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0044).pdf); "Medido por arriba de la línea. El resultado global del Sector Público a diciembre, medido por fuentes de financiamiento (por debajo de la línea), no estaba disponible al cierre de este informe." (https://bvrie.bcu.gub.uy/local/File/MEMO/2003.pdf); "declaró el expresidente en declaraciones a radio Monte Carlo" (El Observador, url del registro)
- accion_sugerida:
  - Reescribir título, valor y análisis con las cuatro cifras, sus perímetros y el criterio de cuál manda.
  - Calificación `impreciso`, con el margen dicho.
  - Fuentes nuevas: MEF 31/1/2013 (+ Rendición 2013, opcional), BCU 2003 con fecha de 2004, y los dos diarios de sesiones.
  - Tier `probable`.
  - Puerta para la segunda fuente, para un resolvedor posterior y no para esta corrección: audio o nota de Radio Monte Carlo (CX20) del 5/2/2013 y lo que otros medios levantaron ese día. Monte Carlo no tiene perfil en `content/medios/` y va en `medios.yaml` si se usa.
  - Tipo de la corrección para este id: `error_factual` es defendible, porque el título publicado afirmaba como hecho una cifra que los documentos contradicen.

### chequeos[1] — 2013-07-01 — «cuando el gobierno salió a pedir colocar unos pocos pesos, más o menos 11 millones de dólares»

- severidad: corregir
- tipo: documento_previsible
- objecion: la premisa del pedido se verifica: no hay resultado. El resolvedor dejó bien afuera de `dato_real.fuentes` el newsletter de la Unidad de Gestión de Deuda, porque no contiene el dato. La búsqueda que dejó escrita cerró las Notas del Tesoro (inventarios de la UGD y del BCU, tablas de 2008 y 2010-2012, registro SEC, seis consultas web). La Rendición de Cuentas 2013, que nombró como puerta pendiente, ya está en el corpus y la cerré yo: no tiene «desiert» ni detalle de las licitaciones de junio. **La puerta que faltó es la del instrumento.** Batlle dijo «el gobierno salió a pedir colocar unos pocos pesos», y en 2013, además de las Notas del Tesoro del MEF, el BCU emitía en pesos sus Letras de Regulación Monetaria. La misma Rendición 2013 dice que «el BCU convalida elevados rendimientos en sus emisiones de Letras de Regulación Monetaria (del orden de 15% anual en moneda nacional...)». Nadie buscó las LRM. La lectura alternativa no es inocente ni culpable: es posible que «el gobierno» de Batlle fuera el BCU.
- cita_de_contexto: "En una palabra si usted mira lo que pasó en las últimas dos semanas en materia financiera, usted verá en primer lugar que cuando el gobierno salió a pedir colocar unos pocos pesos" (https://lr21.com.uy/politica/1113871-batlle-gobierno-esta-absolutamente-empantanado-en-su-politica-economica)
- accion_sugerida: puertas no repetidas, en este orden:
  1. Resultados de las licitaciones de LRM del BCU entre el 17/6 y el 1/7/2013 (monto ofrecido y adjudicado, licitación desierta).
  2. Memoria Anual 2013 del BCU, por la misma ruta que la de 2003 que ya está en el corpus (`bvrie.bcu.gub.uy/local/File/MEMO/2013.pdf`).
  3. Informe de Política Monetaria del BCU del segundo y el tercer trimestre de 2013, y comunicados del COPOM de julio de 2013, que narran el mercado de junio.
  4. Prensa de esa quincena, solo para fijar fecha e instrumento, no como fuente del dato.

  La constancia va en `notas.md`, que todavía no existe en el lote. Calificación: sigue `discutible`; tier: sigue `probable` (una sola nota, también crónica de «declaraciones a radio Montecarlo»).

- severidad: corregir
- tipo: presentacion
- objecion: el `analisis` afirma sin fuente que «en 2013 el gobierno colocaba habitualmente Letras de Regulación Monetaria y Notas del Tesoro por montos de ese orden». Además, las LRM son del BCU, no del gobierno. `dato_real.valor` narra el proceso («Los documentos disponibles de 2013 en el sitio del BCU son pliegos…», «No hay, con las fuentes revisadas…»). La `afirmacion` dice «licitación de deuda del gobierno», más estrecho que lo que dijo Batlle, y eso deja afuera la lectura de las LRM. Si se menciona el encaje del 50% a no residentes de junio de 2013, va como hecho fechado y sin nexo causal con la licitación, porque ningún documento lo une.
- accion_sugerida: sacar la frase sin fuente y «no porque la cifra sea inverosímil». Escribir la afirmación como «una licitación de títulos en pesos». Escribir el valor como qué publica cada organismo y qué falta, sin la historia de la búsqueda.

### chequeos[2] — 2013-02-05 — «no podían modificar los cobros del IRPF y del IASS en los grados menores»

- severidad: corregir
- tipo: contexto_omitido
- objecion: las tres citas nuevas están donde dice el resolvedor. Decreto 7/013: la BPC pasa de $ 2.417 a $ 2.598 (+7,48%, «de conformidad con los criterios establecidos por el artículo 3°» de la ley 17.856). Rendición 2013: «La Rendición de Cuentas de 2011 incrementó las asignaciones en 2.807 millones de pesos para 2013». La trampa de la segunda fuente aplica a medias:
  - La Rendición 2013 **sí contiene** la cifra que respalda la parte de los US$ 140 millones, una vez convertida.
  - El decreto **no contiene** los $ 2.500 millones ni dice que las franjas quedaran sin ajustar más allá de la BPC. Es contexto del mecanismo, no el dato.

  Ningún documento contiene la cifra central, y el nexo «para poder pagar» es de intención y no se chequea. Batlle atribuye la explicación a «Massoller» (Andrés Masoller, director de la Asesoría Macroeconómica del MEF; El Observador lo escribe con doble s). Montevideo Portal, abierta en esta crítica, confirma que Masoller anunció esa semana la BPC de 2013 y que el mínimo no imponible quedó en siete BPC. No trae los $ 2.500 millones, y es prensa: no entra como fuente del dato.
- cita_de_contexto: "El ajuste fiscal que acaba de hacer el gobierno, lo explicó (el director de la Asesoría Macroeconómica y Financiera del Ministerio de Economía) Massoller, que dijo que ante el hecho de la delicada situación fiscal no podían modificar los cobros" (El Observador, url del registro); "Andrés Masoller, adelantó cuál será el valor de la Base de Prestaciones y Contribuciones en el 2013" (https://www.montevideo.com.uy/Noticias/Las-nuevas-franjas-del-IRPF-uc189483)
- accion_sugerida: lo que puede entrar en `dato_real` sin forzar la calificación:
  1. BPC de 2013 $ 2.598, +7,48% (decreto 7/013), dicho como lo que es.
  2. $ 2.807 millones sumados para 2013 por la Rendición de 2011 (MEF), convertidos con la serie oficial del BCU (`pnpm dato`, tipo de cambio), no «a unos $ 20». Antes hay que mirar a qué valores están esos pesos: el cuadro vecino de la Rendición 2010 dice «a valores de enero 2011».
  3. Opcional: la variación nominal del Índice Medio de Salarios del INE de 2012 contra el 7,48%, que es el mecanismo que Batlle describe.

  Calificación: sigue `discutible`. El análisis dice que la parte de los US$ 140 millones coincide con el MEF y que los $ 2.500 millones no tienen estimación oficial. Puertas que faltan además de las del resolvedor: lo que Masoller dijo en primera persona en enero de 2013 (conferencia del MEF o de Presidencia), y la exposición de motivos de la Rendición de Cuentas del ejercicio 2012 (MEF, junio de 2013), que el resolvedor buscó y no encontró en el corpus.

- severidad: corregir
- tipo: presentacion
- objecion: `dato_real.valor` dice «La ley a la que se refiere el gobierno», y el que se refiere es Batlle. Cierra con narración de proceso («No hay, con las fuentes revisadas…»). El `titulo` («$2.500 millones por no ajustar franjas… para cubrir US$ 140 millones») afirma la cifra como hecho.
- accion_sugerida: corregir el sujeto. Un título que diga qué se chequea (por ejemplo, «Recaudación extra de $ 2.500 millones por no ajustar las franjas del IRPF: sin estimación oficial»). Valor en dos párrafos de cifras.

### chequeos[3] — 2005-11-28 — «una rebaja de unos USD 40 millones para las 50 empresas más importantes del país»

- severidad: bloquea
- tipo: cita_fuera_de_contexto
- objecion: el resolvedor propone la cita «MINISTRO ASTORI: Bueno, estamos trabajando sobre ese cálculo, aunque yo puedo adelantarles ya hoy un número relativo.» con la glosa «el ministro dice que el cálculo de la recaudación todavía se estaba haciendo». En su párrafo, la pregunta era por la recaudación del IRPF y del sistema, no por la rebaja a las empresas. Además, el ministro da el número enseguida: el IRPF recaudaría «aproximadamente dos puntos y medio del Producto Bruto Interno». Con esa glosa, la cita dice lo contrario de lo que pasó y la aplica a otra cosa.
- cita_de_contexto: "La pregunta es la siguiente: ¿Hay alguna cifra, hay alguna expectativa de cantidad de recaudación [...]" … "Nosotros estamos calculando que, como consecuencia del Impuesto a la Renta de las Personas Físicas, vamos a estar recaudando aproximadamente dos puntos y medio del Producto Bruto Interno" (http://archivo.presidencia.gub.uy/_web/noticias/2005/11/2005110709.htm)
- accion_sugerida: no se incorpora. La primera cita del mismo documento («estamos disminuyendo en cinco puntos el actual Impuesto a la Renta de Industria y Comercio», con la «tasa general de 25 %») sí puede entrar: respalda la premisa de la baja de 30% a 25%, que hoy está sin fuente oficial en `dato_real`. No contiene los USD 40 millones, así que la calificación sigue `discutible`.

- severidad: corregir
- tipo: presentacion
- objecion: hay cuatro defectos ya publicados que esta corrección toca de todos modos:
  1. La cita del Banco Mundial es el nombre del indicador (`"value": "Official exchange rate (LCU per US$, period average)"`), no la cifra. El 24,4786 está en otra línea de la misma respuesta. Es la segunda fuente falsa en pequeño.
  2. «algo plausible en una economía con alta concentración empresarial» no tiene fuente.
  3. «la exposición de motivos del proyecto no está publicada con ese desglose» afirma el contenido de un documento que nadie abrió: el repartido 585 devolvió 403.
  4. Llamar «techo» a una sexta parte del IRIC de 2005 ignora que la reforma también cambió la base («estamos gravando rentas netas»), mejoró los estímulos a la reinversión y eliminó quince impuestos, entre ellos el propio IRIC. Es la baja de tasa sola, con la base de 2005, no un techo.

  Además, la nota de El País es paráfrasis de segunda mano: Batlle habló «en una entrevista a canal 4» y la nota va «En base a radio Sarandí». La paráfrasis ata los USD 40 millones a la baja de tasa («pagarán 25% en lugar de 30% lo que generaría…»), que es como lo lee el registro.
- accion_sugerida:
  - Tipo de cambio del BCU con `pnpm dato` y su fila citable, o al menos la línea del valor.
  - Sacar «plausible» o respaldarlo con la recaudación de grandes contribuyentes de la DGI.
  - Cambiar «techo» por «la baja de tasa sola, sobre la base de 2005».
  - Quitar la afirmación sobre la exposición de motivos.
  - Puertas para un resolvedor posterior, las del resolvedor: repartido 585, versión taquigráfica de Hacienda de 2006, `pnpm sesion crr 2006-11-01`. Para la segunda fuente de la declaración: Canal 4 y Radio Sarandí del 28/11/2005, que no tienen perfil en `content/medios/`.

### chequeos[4] — 2005-11-28 — «de unos USD 15 millones para los bancos»

- severidad: bloquea
- tipo: cita_fuera_de_contexto
- objecion: es la misma cita del «número relativo», con la misma glosa, y tiene el mismo problema que en chequeos[3].
- accion_sugerida: no se incorpora. Las otras dos citas de la transcripción sí pueden entrar, porque respaldan la premisa (la reforma eliminaba el IMABA y el ICOSIFI). Ninguna contiene los USD 15 millones, así que la calificación sigue `discutible`. La transcripción muestra que la lista era de quince impuestos, con el IRIC, el COFIS, el Impuesto a las Comisiones y el de Tarjetas de Crédito.

- severidad: corregir
- tipo: explicacion_alternativa
- objecion: `dato_real.valor` y `analisis` dicen «Esto sugiere que la cifra de Batlle no incluía la eliminación de esos dos tributos». Es una lectura de qué quiso decir, sin fuente. La paráfrasis de El País no ata los USD 15 millones a nada, así que hay dos lecturas:
  - (a) Es solo la baja de tasa del IRIC para los bancos. El dato que la juzgaría es el IRIC pagado por el sector financiero en 2005, de la DGI por sector de actividad: es un documento previsible.
  - (b) Incluye IMABA e ICOSIFI. Entonces los USD 55 millones de 2005 están lejos de los 15.

  Hay dos matices más. La serie anual de la DGI no separa banca pública de privada (habría que verificar quién pagaba IMABA). Y lo recaudado en 2005 no es el costo de eliminar esos impuestos en 2007.
- accion_sugerida: escribir las dos lecturas con su documento en vez de «sugiere», y el mismo tipo de cambio corregido que en chequeos[3].

## Objeciones al lote

- **Rastro de búsqueda del resolvedor (corregir).** Ni el lote ni `inbox/resoluciones/2026-10-29/` traen un `consultas.jsonl` escrito por la herramienta. Las búsquedas de corpus del resolvedor existen solo como prosa en los campos `busque:`. Las siete líneas que hoy tiene `consultas.jsonl` del lote son de este crítico: seis búsquedas de corpus («encalacrada», resultado fiscal 2003, Sector Público Consolidado 2003, la evaluación de Presidencia, LRM del BCU, Masoller) y una fuente (Montevideo Portal). Acción: `notas.md` transcribe los `busque:` como lo que son, relato del resolvedor, y el próximo resolvedor corre con `--consultas`.
- **`notas.md` no existe todavía.** La constancia de qué se buscó para chequeos[1], y las puertas nuevas de los cinco, van ahí.
- **Tier de los cinco.** Ninguno puede pasar a `publicado` por esta corrección. La evidencia de las cinco declaraciones es de un solo grupo (El Observador, La República, El País), y las tres notas son crónicas de radio o TV (Monte Carlo, Monte Carlo, Canal 4 vía Radio Sarandí). La puerta común para la segunda fuente es la emisora original. Esta corrección cambia `dato_real` y, en chequeos[0], la calificación. No cambia el tier.
- **Simetría.** El brief del resolvedor es simétrico: el mismo faltante ya se resolvió para Astori en `2026-09-16-correccion-astori-resolucion-chequeos`, con un criterio para todo chequeo en `probable` con `_faltante: dato_oficial`. En esta crítica busqué lecturas en las dos direcciones. Favorables a Batlle: otro perímetro, otro año, PIB rebasado, «peor momento» en 2003, la paráfrasis de El País. Desfavorables: el 3,2% de su propia Rendición, el pico de 2002. Las dos quedan escritas para el editor. Los umbrales (10% de `impreciso`, una sola versión manda) son los de `chequeos.md` y valen igual para cualquiera.
- **Discrepancias.** No se escribe `discrepancias.yaml`. No hay fuente primaria de las entrevistas (audio o video) contra la cual cotejar a los medios. El titular de El Observador («de 2002») nombra la crisis y no contradice la cita («en 2003»).
- **Riesgo legal.** Ninguno: son chequeos de cifras dichas en público, sin denuncias ni terceros.
- **Fuentes nuevas con campos o fechas a corregir antes de copiarlas.** `perimetro` y `nota` no son campos de Fuente. La Memoria BCU 2003 no es del 31/12/2003. La fecha de la Rendición 2013 y la del newsletter son aproximadas, y el propio resolvedor lo dice.
- **Sin mirar:** nada de los cinco registros. No abrí las puertas que propongo (serie MEF con PIB rebasado, LRM del BCU, Memoria BCU 2013, Rendición 2012, repartido 585): son acción sugerida, no evidencia.

## Objeciones al brief

Ninguna por la Regla 0. El brief pide pesar las premisas del resolvedor y no darlas por buenas, y eso se hizo. Un solo matiz: el brief resume que «ninguno da 2,8%» para 2003, y es cierto. También es cierto que ninguno da 2,8% para ningún año entre 2001 y 2004, y que sin el BCU el cuadro del BCU da 2,5%: el «ninguno» se sostiene con cualquier perímetro de estos documentos.

## Cobertura

```yaml
- medio: el-observador
  url: https://elobservador.com.uy/nota/batlle-el-deficit-fiscal-actual-es-igual-al-del-peor-momento-de-la-crisis-de-2002--20132513490
  fecha: 2013-02-05
  evento: crisis-2002
  politico: batlle
  tono: neutral
  justificacion: >-
    Reproduce sus dichos a radio Monte Carlo sin valorarlos: «El expresidente Jorge Batlle señaló este
    martes que el déficit fiscal actual del 2,8% se corresponde con el que enfrentó su gobierno en
    plena crisis, en el año 2003».
- medio: la-republica
  url: https://lr21.com.uy/politica/1113871-batlle-gobierno-esta-absolutamente-empantanado-en-su-politica-economica
  fecha: 2013-07-01
  evento: propuesto:mercado-deuda-en-pesos-junio-2013
  politico: batlle
  tono: neutral
  justificacion: >-
    Cita sus declaraciones a radio Montecarlo («detallo el ex gobernante en declaraciones a radio
    Montecarlo») sin adjetivos propios. El párrafo final sobre los «fuertes cuestionamientos de su
    propio partido» por lo que dijo de Ope Pasquet es un hecho reportado, sin valoración del redactor.
- medio: el-pais
  url: https://www.elpais.com.uy/informacion/batlle-reforma-tributaria-afectara-mas-a-la-clase-media
  fecha: 2005-11-28
  evento: propuesto:reforma-tributaria-2006
  politico: batlle
  tono: neutral
  justificacion: >-
    Paráfrasis sin valoración de una entrevista en Canal 4, «En base a radio Sarandí»: «señaló el ex
    jerarca quien sostuvo que con la implantación de la reforma tributaria las empresas pagarán 25% en
    lugar de 30%».
- medio: montevideo-portal
  url: https://www.montevideo.com.uy/Noticias/Las-nuevas-franjas-del-IRPF-uc189483
  fecha: null          # la nota no trae fecha; es de la semana del decreto 7/013 (enero de 2013)
  evento: propuesto:bpc-y-franjas-irpf-2013
  politico: null       # nota de servicio sobre una decisión del MEF; no trata a una persona con ficha ni a un partido
  tono: neutral
  justificacion: >-
    Informa el anuncio sin valorarlo: «el director de la Asesoría Macroeconómica del Ministerio de
    Economía y Finanzas, Andrés Masoller, adelantó cuál será el valor de la Base de Prestaciones y
    Contribuciones en el 2013».
```
