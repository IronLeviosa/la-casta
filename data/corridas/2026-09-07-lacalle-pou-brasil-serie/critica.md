# Crítica — corrida 2026-09-07-lacalle-pou-brasil-serie

Modelo: Opus 5 (1M context) — `claude-opus-5[1m]`. Coincide con la tabla de CLAUDE.md (crítico = Opus); no hay desvío de proceso que reportar.
Lote: `inbox/lacalle-pou/economia/combustibles/2026-09-07-brasil/`
Registros revisados: 1 registro publicable (`chequeos.yaml#0`, copia de `lacalle-pou/2022-03-27-combustibles-mas-baratos-brasil`) + 1 archivo auxiliar (`_series.yaml`: 21 ítems anuales y 15 entradas en `fuentes_series`).

## Qué se reprodujo

Bajé los seis archivos oficiales que sostienen la serie (URSEA `Series_PPI_VS_PE_0.xlsx`, ANP `mensal-brasil-2001-a-2012.xlsx` y `mensal-brasil-desde-jan2013.xlsx`, MIEM/BCU `dolar promedio.zip`, BCB SGS 3695, ANCAP/catalogodatos `datos-de-precios-de-combustibles.csv`), leí los cinco decretos de IMPO con `pnpm fuente` y recalculé **los 21 años**, no tres. Resultado:

- **19 de 21 años reproducen exactos a cuatro decimales** (2002-2019 y 2022), en las cuatro series. Es un trabajo de datos sólido y la mayor parte de lo que sigue son objeciones de método declarado y de dos años concretos, no de la serie entera.
- **2020 (Brasil) no reproduce**: da 0,8219 / 0,6746 y el lote publica 0,8163 / 0,6699. La causa está identificada (ver objeción C).
- **2021 (Uruguay) no reproduce**: con el método que el propio archivo declara da 1,4654 / 1,0221 y el lote publica 1,4518 / 1,0128. La causa está identificada (objeción B) y además hay un decreto que falta.

Tramos exigidos por el encargo, uno por cada uno:
- **Tramo observado (2005):** URSEA 12/12 meses + ANP 12/12 + ambos tipos de cambio → 1,2265 / 0,7862 / 0,9704 / 0,7262. **Da exacto.**
- **Tramo sostenido (2020):** Uruguay 12/12 meses sosteniendo mayo-2019 → 1,3079 / 0,9616. **Da exacto del lado uruguayo**; el lado brasileño no (objeción C).
- **Tramo reconstruido (2021):** con los cinco decretos declarados **no da**; da con una regla distinta de la declarada, y de todos modos le falta un decreto (objeción B).
- **Tramo forward-fill (2022):** 1,8646 / 1,4833 / 1,1899 / 1,3005. **Da exacto**, y el valor de marzo del dataset coincide con el Decreto 64/022 tal como dice `notas.md`.

## Objeciones por registro

### chequeos[0] — grafico — punto 2021 de Uruguay: existe un decreto que el lote no encontró y que cambia el número
- severidad: **bloquea**
- tipo: contexto_omitido
- objecion: `_series.yaml` y `notas.md` afirman "No se halló decreto para agosto ni setiembre; se sostiene el valor de julio". El decreto existe, está en IMPO, lo firma el Poder Ejecutivo el 30/7/2021 y **actualiza el PVP desde el 31 de julio de 2021**: Súper 95 a $70,81 y Gas Oil 50S a $50,70, contra los $65,81 / $45,70 que el lote sostiene para agosto y setiembre. Corrigiendo solo eso, con la misma regla que el lote ejecutó, 2021 pasa de 1,4518 a **1,4709** en nafta y de 1,0128 a **1,0319** en gasoil (+1,3% y +1,9%). Ninguna comparación con Brasil cambia de signo (Brasil 2021: 1,0692 y 0,8555), pero es un punto publicado que sabemos mal, con el documento en la mano. Hay además un segundo decreto no localizado: ANCAP aloja el original firmado el **30/8/2021** (`https://www.ancap.com.uy/9485/1/decreto-93-precio-combustibles.html`, PDF sin capa de texto, creado 2021-08-30), que es el que fija setiembre; y bajo el mecanismo mensual debería existir uno más a fines de octubre para noviembre.
- cita_de_contexto: "Artículo 2 Actualízanse los siguientes PVP … los que entrarán en vigencia a partir de las cero horas (00:00) del 31 de julio de 2021: a) COMBUSTIBLES GENERALES PRECIO POR LITRO … Gasolina Super 95 30S 70,81 … Gas Oil 50S 50,70" — Decreto N° 245/021, publicado 02/08/2021, `https://www.impo.com.uy/bases/decretos/245-2021` (leído con `pnpm fuente` en esta sesión). Corroboración independiente del mismo hito: "desde el 31 de julio de 2021, rige en Uruguay un nuevo sistema de fijación del precio de los combustibles" (Caras y Caretas, `https://www.carasycaretas.com.uy/sociedad/precio-combustibles-cuanto-aumentaron-del-2019-al-2023-n65050`).
- accion_sugerida: recalcular 2021 con 245/021 (agosto y setiembre a 70,81 / 50,70), agregar la fuente a `dato_real.fuentes` con `medio: impo`, y buscar el decreto de fines de agosto (ruta: ANCAP `https://www.ancap.com.uy/4898/1/decretos-precios.html`, pestaña 2021 → el PDF de 9485; después su número en IMPO). Corregir en `notas.md` y en `_series.yaml` la frase "no se halló decreto para agosto ni setiembre".

### chequeos[0] — grafico — el método declarado no es el método ejecutado (promedio de razones vs. razón de promedios)
- severidad: corregir
- tipo: contexto_omitido
- objecion: el encabezado de `_series.yaml` dice "Cada valor anual es el promedio simple de los valores MENSUALES disponibles de ese año" y después "USD/litro = (precio en moneda local) / (tipo de cambio promedio del mismo período)". Son dos cosas distintas y el lote ejecutó la segunda: **precio local promedio anual ÷ tipo de cambio promedio anual**, no el promedio de los doce valores mensuales en dólares. Lo verifiqué en los 21 años: con la razón de promedios reproduce exacto; con el promedio de razones no. No es un error —es una convención legítima— pero la diferencia no es cosmética: en 2002, con el peso saltando de 14 a 27 dentro del año, da 0,9112 contra 0,8743 USD/l, un 4,2%. Ningún año cambia de signo entre una convención y la otra, así que el mensaje del gráfico se sostiene; lo que falla es que el lector no puede reproducirlo con lo que el archivo dice.
- cita_de_contexto: reproducción propia sobre los archivos citados (URSEA `Series_PPI_VS_PE_0.xlsx`, MIEM `dolar promedio.csv`): 2002, razón de promedios = 0,8743 (lo publicado); promedio de razones = 0,9112.
- accion_sugerida: en `grafico.nota` y en el encabezado de `_series.yaml`, escribir la fórmula exacta: "promedio anual del precio en moneda local ÷ promedio anual del tipo de cambio", y decir que la convención alternativa (promedio de los valores mensuales en dólares) mueve los años de fuerte salto cambiario hasta un 4% sin cambiar ninguna comparación.

### chequeos[0] — grafico — punto 2020 de Brasil: precio de 11 meses dividido por tipo de cambio de 12
- severidad: corregir
- tipo: contexto_omitido
- objecion: `notas.md` documenta bien que la ANP no relevó setiembre de 2020 y que ese mes se excluye. Pero el promedio de precios se hizo sobre 11 meses y el PTAX sobre los 12 (5,2420; el promedio de los mismos 11 meses es 5,2059). Ventanas distintas para numerador y denominador. Efecto: Brasil 2020 queda 0,7% más barato de lo que da con ventanas iguales (nafta 0,8163 vs 0,8219; gasoil 0,6699 vs 0,6746). No cambia ninguna conclusión —Brasil está muy por debajo de Uruguay ese año— pero es una inconsistencia interna del método.
- cita_de_contexto: "Não houve pesquisa de preços entre 18/8/20 e 17/10/20" (ANP, hoja `BRASIL - DESDE JANEIRO DE 2013`, fila 13); PTAX 2020 = 5,2420 con 12 meses y 5,2059 con los 11 meses relevados (BCB SGS 3695).
- accion_sugerida: recalcular Brasil 2020 con el PTAX de los mismos 11 meses, o declarar explícitamente en la nota que numerador y denominador usan ventanas distintas.

### chequeos[0] — grafico — los puntos reconstruidos no se distinguen de los observados
- severidad: corregir
- tipo: contexto_omitido
- objecion: el encargo pedía que el lector supiera qué punto es observado y cuál sostenido. La `nota` general dice "2019-2021 incluyen meses reconstruidos o sostenidos", pero ningún punto lleva marca. En el gráfico y en la tabla accesible, el 2020 de Uruguay —cuyos 12 meses sostienen un decreto de mayo de 2019— se ve idéntico al 2005, que tiene 12 meses observados. El esquema ya resuelve esto: `Punto.nota` existe y el componente lo renderiza en el `<title>` del SVG y en la tabla de datos (`src/components/Grafico.astro`, líneas 101, 128 y 176).
- cita_de_contexto: `_series.yaml`, 2020: "Uruguay: 0/12 meses con decreto de cambio de precio hallado; los 12 meses sostienen el valor de mayo-2019 … es el año con la evidencia más débil de toda la serie". Nada de eso llega al gráfico.
- accion_sugerida: poner `nota` en los cuatro puntos uruguayos 2019-2022 (por ejemplo 2020: "12/12 meses sostienen el último decreto vigente, de mayo de 2019"; 2022: "6 meses informados, 6 completados por continuidad").

### chequeos[0] — grafico — el gasoil se grafica solo con el emparejamiento favorable a la afirmación
- severidad: corregir
- tipo: asimetria
- objecion: el gráfico que se reemplaza mostraba **las dos** comparaciones de gasoil (50S vs. S10 por posición de mercado, y 10S vs. S10 por azufre), y el título y el análisis del registro se construyen sobre esa distinción ("El gasoil se da vuelta (16,2% más caro) si se lo empareja por especificación de azufre"). La serie nueva conserva solo la primera, que es la que da a Uruguay más barato. El esquema no deja meter una quinta serie (`series` máximo 4), así que la corrección tiene que ir en la nota. Con los mismos datos oficiales: en 2022, Uruguay Gas Oil 10S = 1,7600 USD/l contra el S10 brasileño 1,3005, **35,3% más caro en el promedio anual y 18% más caro en marzo de 2022**, y no hay un solo mes de 2022 en que el 10S uruguayo esté por debajo del S10 brasileño. Simétricamente, hay que decir el reparo que va en la otra dirección: la Súper 95 uruguaya (95 RON) se compara con la gasolina comum brasileña (grado regular, con etanol), lo que empuja a Uruguay hacia arriba; el registro publicado ya lo tenía escrito en `notas_internas` y tampoco llega a la nota del gráfico.
- cita_de_contexto: cálculo propio sobre ANCAP/catalogodatos (`GASOIL 10-S`, 2022) y ANP (`OLEO DIESEL S10`): 10S uruguayo 1,7600 USD/l vs. S10 brasileño 1,3005 USD/l en promedio 2022. Dato adicional útil: Uruguay 50S (50 ppm) no equivale a ningún grado brasileño —queda entre el S500 y el S10— y contra el S500, el grado brasileño más barato, marzo de 2022 sigue siendo el único mes de 2013-2022 en que Uruguay está por debajo (1,278 vs. 1,327 USD/l).
- accion_sugerida: agregar a `grafico.nota` las dos frases: que la serie de gasoil usa el emparejamiento 50S/S10 y que con el emparejamiento por azufre (10S) Uruguay queda por encima de Brasil en todos los meses de 2022; y que Súper 95 y gasolina comum no son el mismo producto.

### chequeos[0] — analisis y dato_real — la serie contesta "por primera vez" y el registro sigue diciendo que no se contestó
- severidad: **bloquea**
- tipo: contexto_omitido
- objecion: el `analisis` que el lote copia sin tocar dice: «"Por primera vez" queda sin verificar: existen series oficiales completas de cada lado para reconstruirlo, pero no se hizo en esta corrida». Esa frase deja de ser cierta en el momento en que se promueve este lote: el gráfico del mismo registro **es** esa reconstrucción. Publicar las dos cosas juntas deja al lector con un registro que se contradice a sí mismo. Además `dato_real.valor` sigue describiendo solo la semana del 27/03/2022, mientras el gráfico muestra 84 puntos que no están en ningún lado del texto (el esquema define `grafico` como "Gráfico con los números de dato_real"). El brief prohibió tocar `analisis` y `dato_real`, y estuvo bien que el investigador no los tocara; la corrección le toca al editor.
- cita_de_contexto: `content/chequeos/lacalle-pou/2022-03-27-combustibles-mas-baratos-brasil.yaml`, `analisis`, párrafo 4, y `revision.notas_internas`: "Sobre 'por primera vez': no es un dato inverificable, es trabajo de reconstrucción no hecho".
- accion_sugerida: reescribir ese párrafo y ampliar `dato_real.valor` con el resultado de la serie (ver la sección "Qué prueba la serie" más abajo, que trae los números y las fechas).

### chequeos[0] — dato_real.fuentes[7] — `medio: gub.uy` no existe
- severidad: bloquea
- tipo: riesgo_legal (mecánico)
- objecion: `pnpm validar --inbox` sobre esta carpeta devuelve exactamente un error: `dato_real.fuentes.7.medio → Medio desconocido: no existe "gub.uy" en content/medios/`. El investigador hizo bien en no inventar el slug y en dejarlo anotado.
- cita_de_contexto: salida de `pnpm validar --inbox inbox/lacalle-pou/economia/combustibles/2026-09-07-brasil` (esquema: 0 errores; referencias: 1 error).
- accion_sugerida: crear `content/medios/ursea.yaml` (organismo, como `bcu`, `impo`, `miem`) y usarlo en las dos URLs de `gub.uy/unidad-reguladora-servicios-energia-agua/…`. No inventar un `gub-uy` genérico: URSEA y MIEM son organismos distintos y el lote ya usa `miem` para el otro.

### chequeos[0] — dato_real.fuentes — la cita del Decreto 386/021 no contiene el dato que respalda
- severidad: corregir
- tipo: cita_fuera_de_contexto
- objecion: la fuente del Decreto 386/021 se usa para el valor de diciembre de 2021 (Súper 95 $70,41, Gas Oil 50S $49,94) y su `cita` es solo el epígrafe: "Apruébanse los valores que se determinan para los combustibles, a regir a partir del 1° de diciembre de 2021." No hay un número en la cita. Verifiqué que los valores están en el documento y que el investigador los leyó bien —el Artículo 1 fija el PEP (61,20 / 41,48) y el Artículo 2 el PVP (70,41 / 49,94), idéntico al de octubre—, pero tal como queda, el registro cita un documento por un dato que la cita no muestra. El mismo reparo, más leve, vale para los otros decretos: sus citas sí traen la tabla.
- cita_de_contexto: "Artículo 2 Actualízanse los siguientes PVP … del 1° de diciembre de 2021: a) COMBUSTIBLES GENERALES PRECIO POR LITRO … Gasolina Super 95 30S 70,41 … Gas Oil 50S 49,94" — `https://www.impo.com.uy/bases/decretos-originales/386-2021`, leído con `pnpm fuente` (carácter ~4695 de 5518).
- accion_sugerida: reemplazar la cita por el tramo del Artículo 2 con la tabla.

### chequeos[0] — dato_real.fuentes — se cayeron las cuatro páginas en prosa, que son justo las que la máquina sí verifica
- severidad: corregir
- tipo: contexto_omitido
- objecion: `_series.yaml` declara 15 fuentes; `chequeos.yaml` sube 11. Las cuatro que quedaron afuera son las cuatro páginas en prosa: la de URSEA que aloja y describe el Excel, la de la ANP que aloja las planillas **y documenta el cambio de metodología de octubre de 2004**, la del dataset de ANCAP en catalogodatos y la del MIEM que aloja el tipo de cambio. Es el criterio invertido: se publican los binarios (que exigen `verificacion: manual` y firma humana) y se descarta la prosa que `pnpm fuente` lee y que el validador de citas puede comprobar sola. La página de la ANP importa además por contenido: el dato nacional brasileño pasa de promedio aritmético simple a ponderado por ventas en 2004, o sea que el tramo 2002-2004 no se mide igual que el resto de la serie de Brasil, y eso hoy no está en ninguna parte del registro publicable.
- cita_de_contexto: "Até 30 de outubro de 2004, todos os preços médios eram calculados por média aritmética simples. Após esta data, os preços médios de revenda e de distribuição de combustíveis, em nível estadual, regional e nacional, passaram a ser ponderados com base nas informações de vendas enviadas pelas distribuidoras à ANP." — `https://www.gov.br/anp/pt-br/assuntos/precos-e-defesa-da-concorrencia/precos/precos-revenda-e-de-distribuicao-combustiveis/serie-historica-do-levantamento-de-precos` (verifiqué que el texto está en la nota del corpus, medio `anp-brasil`).
- accion_sugerida: subir las cuatro a `dato_real.fuentes` (sin `verificacion: manual`) y llevar el cambio de metodología de 2004 a `grafico.nota`.

### chequeos[0] — dato_real.fuentes — las ocho `verificacion: manual`
- severidad: aviso
- tipo: sin_objecion (con reserva)
- objecion: revisé una por una si alguna está mal marcada. **Ninguna lo está**: el .xlsx de URSEA, los dos .xlsx de la ANP, el .zip del MIEM, el .csv de ANCAP y el JSON de la API del BCB son binarios o estructurados y `pnpm fuente` no los puede verificar como texto; los dos originales (BCU, BCB del 25/3/2022) ya venían así. La reserva es de consecuencias, no de clasificación: `scripts/validadores/tiers.ts` recorre **todas** las fuentes del registro, incluidas las de `dato_real`, así que las diez fuentes manuales entran en lo que el mantenedor firma con `pnpm aprobar`, y cuatro de ellas son archivos cuyos números nadie puede re-verificar sin correr el script del investigador. Lo que baja ese costo ya está identificado: subir las cuatro páginas en prosa (objeción anterior) y dejar público el detalle mes a mes.
- cita_de_contexto: `scripts/validadores/tiers.ts`: "if (manual) return { requiere: true, motivo: 'tiene fuentes con verificacion: manual, que requieren aprobación humana' }" — con `recorrerFuentes(d, …)`, que incluye `dato_real`.
- accion_sugerida: ninguna sobre las marcas. Sí: que `revision.que_falta` diga cuántas fuentes manuales hay y por qué, para que el lector de `/probable/` lo sepa.

### chequeos[0] — dato_real.fuentes — la `fecha` de las fuentes nuevas
- severidad: corregir
- tipo: contexto_omitido
- objecion: el esquema define `Fuente.fecha` como "Fecha de publicación de la fuente". Las cinco fuentes de decretos usan la fecha de **entrada en vigencia**, no la de publicación; el caso más claro es el Decreto 364/020, fechado `2021-01-01` cuando el original está firmado el 29 de diciembre de 2020 (el 386/021 sí coincide: publicado 01/12/2021). Las seis fuentes de datasets usan `2026-09-07`, que es la fecha de descarga y ya está en `retrieved_at`.
- cita_de_contexto: "Montevideo, 29 DIC 2020 … Artículo 1°.- Actualízanse los siguientes precios máximos de venta al público … a partir de la hora cero del 1o de enero de 2021: … Gasolina Super 95 30S 58,35 … Gas Oil 50S 40,40" — original firmado, alojado por ANCAP en `https://www.ancap.com.uy/9332/1/decreto-93-precio-combustibles.html` (PDF con capa de texto).
- accion_sugerida: `fecha` = fecha de publicación en IMPO para los decretos; para los datasets, la fecha de última actualización que declara el organismo (la página de catalogodatos muestra `2026-08-12`) y no la de descarga.

### chequeos[0] — grafico.nota — remite a un archivo que no existe con ese nombre
- severidad: corregir
- tipo: contexto_omitido
- objecion: la nota del gráfico dice "el detalle mes a mes y las fuentes de cada tramo están en series.yaml". El archivo se llama `_series.yaml` (el mantenedor cambió la regla del validador a mitad de corrida, commit 4c70531) y vive en `inbox/`, que es privado. Después de `pnpm promover` va a quedar público, pero en `data/corridas/2026-09-07-lacalle-pou-brasil-serie/crudo/_series.yaml`. Tal como está, el lector del sitio lee una remisión a un archivo que no puede encontrar. Lo mismo en el comentario de cabecera de `chequeos.yaml` y en varios lugares de `notas.md`.
- cita_de_contexto: `chequeos.yaml`, `grafico.nota`: "el detalle mes a mes y las fuentes de cada tramo están en series.yaml".
- accion_sugerida: cambiar la remisión por la ruta pública real, o por "en el crudo de la corrida 2026-09-07-lacalle-pou-brasil-serie".

### chequeos[0] — el resto del registro copiado
- severidad: sin_objecion
- tipo: sin_objecion
- objecion: verifiqué campo por campo que la copia no alteró nada de lo que el brief mandaba no tocar: `politico`, `declaracion`, `tema`, `fecha`, `titulo`, `afirmacion`, `fragmento`, `calificacion`, `exhaustivo`, `analisis`, `dato_real.valor` y `evidencia` son idénticos al registro publicado. **Ninguna cita quedó huérfana**: las siete fuentes originales de `dato_real` están las siete, con la misma URL y la misma cita literal, y las dos de `evidencia` también. El gráfico nuevo respeta el esquema (`tipo: lineas`, cuatro series —el máximo—, `x` como texto).
- accion_sugerida: ninguna.

### _series.yaml — la nota de 2009 dice una magnitud siete veces mayor que la real
- severidad: corregir
- tipo: contexto_omitido
- objecion: "la nafta uruguaya resulta en promedio MÁS BARATA que la brasileña este año (0.4 dólares por litro menos que la nafta brasileña)". La diferencia es 1,2622 − 1,2059 = **0,056 USD/l**, no 0,4. El archivo se congela en `crudo/` y queda público, así que el número mal escrito se publica.
- cita_de_contexto: `_series.yaml`, ítem 2009: `uruguay_nafta_usd_l: 1.2059`, `brasil_nafta_usd_l: 1.2622`.
- accion_sugerida: corregir a "unos 5,6 centavos de dólar por litro (4,5%)".

### _series.yaml y notas.md — el congelamiento de junio-2019 a diciembre-2020 se apoya en una fuente privada, teniendo una oficial
- severidad: corregir
- tipo: contexto_omitido
- objecion: es el tramo más largo reconstruido (19 meses) y la evidencia que lo sostiene es, en parte, el índice de UNVENU, una asociación privada de estacioneros. Hay una fuente oficial mejor y disponible: la página **Decretos Precios de ANCAP**, que lista los decretos de precio agrupados por año y trae, para todo el período que va de enero de 2019 a diciembre de 2020, exactamente dos entradas: "Decreto 683 P.E. Precio Combustibles a partir del 01/01/2019" y el decreto firmado el 29/12/2020 que fija los precios de enero de 2021 (el mismo 364/020 que el lote ya cita; ANCAP lo titula "Decreto 93", que es rotulación de ANCAP y no el número del decreto). El límite hay que decirlo con la misma claridad: esa página **no es un índice completo** —la pestaña 2021 omite el 171/021 y el 205/021, que sí existen—, así que corrobora la congelación pero no la prueba. Con eso, el tramo sigue siendo una inferencia razonable y declarada, no un hecho documentado, y así conviene decirlo.
- cita_de_contexto: `https://www.ancap.com.uy/4898/1/decretos-precios.html`, pestañas 2018/2019/2020 (2018: dos decretos con fecha explícita; 2019: uno, "a partir del 01/01/2019"; 2020: uno, que es el del 29/12/2020). Corroboración lateral desde el propio dato: el Decreto 364/020 fija el Gas Oil 50S en $40,40, **el mismo valor exacto** que la serie URSEA trae en mayo de 2019.
- accion_sugerida: citar la página de ANCAP (el medio `ancap` ya existe en `content/medios/`) en lugar de UNVENU, y decir en la nota del punto 2019 y 2020 que el precio sostenido es una inferencia por ausencia de decreto, no un dato observado.

### _series.yaml — la regla de aplicación de decretos declarada no es la ejecutada (junio de 2021)
- severidad: corregir
- tipo: contexto_omitido
- objecion: el archivo declara que se sostuvo "cada uno hasta el siguiente" y que el Decreto 171/021 cubre "valor vigente 2021-06". No es lo que se ejecutó: los números publicados solo salen si junio de 2021 queda en $58,35 / $40,40, es decir, si el 171/021 (vigente desde el 8 de junio) **no entra nunca en la serie**. La regla realmente aplicada es "el decreto vigente el día 1 de cada mes", que es defendible, pero es otra. Lo verifiqué con las tres variantes: regla declarada → 1,4654 / 1,0221; regla ejecutada → 1,4518 / 1,0128 (lo publicado); junio ponderado por días → 1,4622 / 1,0200.
- cita_de_contexto: `_series.yaml`, `fuentes_series`, `uy_decreto_171_2021`: "cubre: Uruguay, valor vigente 2021-06".
- accion_sugerida: declarar la regla real ("se toma el precio vigente el día 1 de cada mes") en el encabezado del método y arreglar el `cubre` del 171/021, que hoy afirma algo que la serie no hace.

### notas.md — la sección "ATENCION" quedó obsoleta
- severidad: aviso
- tipo: sin_objecion
- objecion: las primeras 20 líneas describen un bloqueo de `pnpm validar --inbox` que ya no existe: el mantenedor agregó la regla del guion bajo (commit 4c70531, "Un YAML con guion bajo adelante es material auxiliar de la corrida") y el archivo se renombró a `_series.yaml`. Verifiqué que hoy la carpeta valida con un solo error, el del medio. Conviene que el editor no arrastre a `razones.md` un problema resuelto.
- accion_sugerida: reemplazar esa sección por una línea que diga que `_series.yaml` es auxiliar y se congela en `crudo/`.

## Qué prueba la serie sobre "por primera vez" (para el editor, que recalifica)

La serie **anual** no es el instrumento correcto para una afirmación sobre un día. Los datos mensuales que el investigador ya calculó —para promediarlos— sí lo son, y contestan la pregunta sin ambigüedad. Los recalculé con las mismas fuentes y el mismo método, mes a mes, 2002-2022:

- **Nafta (Súper 95 vs. gasolina comum).** Uruguay estuvo más barato que Brasil en **28 meses**: mayo, junio, julio, setiembre, octubre, noviembre y diciembre de 2007; febrero de 2008; diez meses de 2009 (febrero a noviembre); seis de 2010 (julio a diciembre); y cuatro de 2011 (enero, febrero, abril, mayo). Y en **cero meses de 2022**: la nafta uruguaya estuvo por encima de la brasileña los doce meses, entre 19,8% (marzo) y 101% (diciembre).
- **Gasoil (50S, o el gasoil único de la época, vs. el diesel brasileño de cada época).** Uruguay estuvo más barato en **13 meses**: agosto y diciembre de 2002; enero, febrero, abril y mayo de 2003; enero a abril de 2006; abril y mayo de 2009; y **marzo de 2022**.
- **Los dos combustibles a la vez:** abril y mayo de **2009**. Mayo de 2009 es el caso robusto: nafta 1,0684 contra 1,2610 USD/l (−15,3%) y gasoil 1,0394 contra 1,0760 (−3,4%), con los precios uruguayos de la serie oficial de URSEA y los brasileños del relevamiento de la ANP.

De ahí, tres lecturas y ninguna salva el "por primera vez":

1. Si "combustibles" son los dos: en marzo de 2022 **no pasó** (la nafta estaba 19,8% más cara ese mes en mi cálculo mensual, 19,6% en el cálculo semanal ya publicado), y sí había pasado antes, en abril y mayo de 2009.
2. Si "combustibles" es el gasoil: en marzo de 2022 **pasó** —y es robusto: es el único mes de 2013-2022 en que el 50S uruguayo queda por debajo incluso del grado brasileño más barato— pero es al menos la decimotercera vez desde 2002, no la primera.
3. Si "combustibles" es la nafta: no pasó en 2022 y había pasado 28 veces antes.

Sobre la calificación, lo que corresponde decir sin invadir la decisión del editor:

- El motivo por el que hoy está en "discutible" **ya no existe**. El análisis dice que "por primera vez" queda sin verificar por trabajo no hecho; el trabajo está hecho y da falso. Mantener "discutible" con ese fundamento sería publicar una razón que el propio registro desmiente.
- La otra razón que da el análisis —"verdadero y falso exigen un documento oficial que sostenga la conclusión, y acá el documento oficial da los insumos, no la conclusión"— **no es la regla del sitio**. CLAUDE.md y `src/schemas/chequeo.ts` piden que exista al menos una fuente `documento_oficial` o `diario_de_sesiones` en `dato_real`; no piden que el documento enuncie el veredicto. Aplicada de verdad, esa exigencia dejaría en amarillo todo chequeo aritmético, porque ningún organismo publica documentos que digan que un presidente se equivocó, y en este caso opera en una sola dirección: suaviza. Además el repositorio ya la corrigió expresamente (commit 0f913e9: "El diario de sesiones habilita verde o rojo como dice la regla, y un chequeo con documento previsible no se cierra en discutible"). Esa frase hay que sacarla del análisis, se recalifique o no.
- Lo que sí puede sostener "discutible" por sí solo es el mérito: la afirmación tiene dos partes y una es mixta (cierto para el gasoil, falso para la nafta, en la semana en cuestión). Si el editor la mantiene, el análisis tiene que decir con todas las letras que la parte "por primera vez" es falsa y mostrar cuándo pasó antes. Si la mueve a "falso", el esquema lo permite (de las dieciocho fuentes de `dato_real`, diecisiete son `documento_oficial`) y el fundamento sería que el núcleo temporal de la afirmación está refutado. **Cualquiera de las dos, con la condición de que el criterio quede escrito y se le aplique igual al próximo "por primera vez" de cualquier presidente.**

## Objeciones al lote

- **Dependencia de un solo grupo: no aplica y conviene decir por qué.** No hay fuentes de prensa nuevas: las once fuentes agregadas son organismos (URSEA, ANCAP, IMPO, MIEM/BCU, ANP, BCB). La regla de dos grupos rige para `evidencia.nivel: reportado`, y la `evidencia` de este registro sigue siendo `textual` con el audio de Presidencia. No hay dependencia de un grupo de medios que objetar. Sí conviene notar que los dos lados de la comparación dependen cada uno de un solo organismo (URSEA/ANCAP y ANP), que es inevitable: son los que fijan y relevan los precios.
- **Cobertura del período.** 2002-2022, 21 años. Excluir 2001 está bien justificado (la serie uruguaya arranca en 2002-01 y un año con un solo país no compara). Del lado brasileño hay datos desde 2001-07 y la afirmación dice "2001 o 2002"; el registro debería decir explícitamente que 2001 no se pudo probar por falta del lado uruguayo, en vez de dejarlo solo en `notas.md`.
- **Asimetría de lo que se mide, en las dos direcciones.** Uruguay aporta un **precio máximo fijado por decreto**; Brasil, un **relevamiento de surtidor** que desde octubre de 2004 se pondera por ventas. Y el promedio brasileño es nacional: la región Sul, la más próxima a Uruguay, es más barata que la media nacional (el propio registro lo midió para la semana de marzo de 2022: nafta Sul 1,47 contra 1,51 nacional), o sea que usar el promedio nacional es la opción **más favorable** a la afirmación del presidente. La ANP publica las series regionales. Nada de esto invalida la serie, pero tiene que estar en la nota, y tiene que estar completo: el reparo que favorece y el que perjudica.
- **Resolución.** La serie anual promedia hacia adentro los cruces: 2007 aparece como un empate anual y en realidad tiene siete meses con Uruguay por debajo. Si el registro se queda solo con lo anual, el lector no se entera de que la primera vez fue en mayo de 2007 para la nafta y en agosto de 2002 para el gasoil.
- **Robustez de los cruces.** Los de 2009 y 2010 tienen margen de 1,6% a 15,3% y no dependen de la convención cambiaria (billete vs. interbancario, décimas). Los de 2007 y 2011 van de 0,3% a 3,8% y algunos sí son frágiles. Al escribir el análisis conviene apoyarse en 2009-2010, no en 2007.
- **Simetría del umbral de reconstrucción.** Es la pregunta del encargo y la contesto derecho: el umbral que aceptaría acá es "sostener un precio fijado por decreto mientras no aparezca otro decreto, marcando el punto como sostenido y citando el índice oficial de decretos". Eso lo aceptaría igual para un chequeo sobre Vázquez, Mujica, Batlle u Orsi. Lo que **no** aceptaría para ninguno de ellos, y por lo tanto tampoco acá, es lo que pasó en 2021: declarar que no existe un decreto sin haber agotado el índice oficial que lo lista, y publicar el punto como si fuera dato. La prueba de que el umbral es aplicable es que el decreto apareció en veinte minutos partiendo de la página de ANCAP.

## Objeciones al brief

- **El brief no viola la Regla 0.** Su criterio —"el gráfico tiene que servir para probar toda la afirmación, no una parte"— es neutral y es exactamente el que habría que aplicarle a cualquier chequeo de cualquier político con una comparación temporal. El investigador contestó "ninguna" en `objeciones_al_brief` y en lo sustantivo tiene razón.
- **Una elección del brief sí queda señalada.** El punto 15 prescribe los productos: "nafta Súper 95 … y gasoil (50S, o el grado de mayor volumen)". Eso fija de antemano, para el gasoil, el emparejamiento que da a Uruguay más barato, que es justo el que el registro que se está completando declara ambiguo ("ningún documento oficial fija cuál emparejamiento corresponde"). No hay intención partidaria en el brief, pero el efecto es que el gráfico nuevo se queda con una sola de las dos lecturas. La versión simétrica: pedir las dos comparaciones cuando el registro de origen dice que el emparejamiento decide el signo, o exigir que la nota declare la alternativa con su número.
- **"No estimes" quedó indeterminado.** El brief dice "Si un año no tiene dato en alguna de las fuentes, el ítem lleva `null` … No estimes", y no previó el caso central de Uruguay: un precio fijado por decreto que sigue rigiendo mientras no lo cambie otro decreto. Sostenerlo no es estimar, y la lectura del investigador es razonable y está declarada; pero al no estar prevista, terminó sin marca punto por punto en el gráfico. La versión mejorada del brief dice: "si el dato es un precio regulado, se sostiene el último acto administrativo vigente, se cita el índice oficial de esos actos y cada punto sostenido se marca como tal en el gráfico".
- **Cuenta menor.** El encargo que recibí habla de "nueve fuentes oficiales nuevas"; son once en `dato_real` (y quince en `_series.yaml`, de las que cuatro no subieron). No cambia nada, pero conviene que el editor cuente sobre el archivo.

## Discrepancias

No abro `discrepancias.yaml` en este lote, y digo por qué para que el editor pueda revisarlo. Encontré tres distancias entre lo que publica un organismo y su propio documento primario:

1. La página de URSEA dice "Dichas series tienen periodicidad mensual, desde el año 2002 a la fecha" y el único archivo que aloja termina en mayo de 2019.
2. La descripción del dataset `ursea-ppi_vs_pe_v2` en catalogodatos anuncia el período 2002-01 a 2020-09 y el CSV que entrega arranca en la vigencia 2020-11 y trae solo el cálculo de paridad de importación, no el precio al público (lo verifiqué bajando el archivo; el investigador lo había detectado bien).
3. ANCAP titula "Decreto 93 Precio Combustibles" el PDF del decreto firmado el 29/12/2020 que en IMPO es el 364/020.

Las tres cumplen la condición dura de la colección (hay documento primario que decide), pero ninguna es una nota de prensa cubriendo a un político, que es lo que la colección mide: su propósito declarado es la dimensión comprobable del sesgo de medios, normalizada por veces citado. Meter errores de metadatos de portales de datos abiertos —que no tienen dirección política— ensuciaría esa medida sin agregar nada al lector. Quedan acá documentadas con su cita, y si el editor prefiere registrarlas, el material está completo.

## Cobertura

Las dos únicas notas de prensa que se leyeron en este lote son las que el investigador abrió y descartó por fecha (constan en `consultas.jsonl`). Las leí yo con `pnpm fuente` antes de asignar tono. El boletín del CED y la nota de Subrayado que ya están en el registro no se releyeron en esta corrida y pertenecen a la cobertura de la corrida anterior, así que no emito tono por ellas.

```yaml
- medio: ambito
  url: https://www.ambito.com/uruguay/aumenta-la-nafta-super-primera-vez-mas-un-ano-asi-queda-su-precio-n5783417
  titulo: Aumenta la nafta súper por primera vez en más de un año, así queda su precio
  fecha: 2023-07-31
  evento: mecanismo-precios-combustibles-luc
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Reproduce el encuadre favorable del gobierno con atribución expresa ("Desde el MIEM destacaron
    que se trata del primer aumento en más de un año tras cuatro bajas") y en el mismo texto pone el
    costo del otro lado ("una pérdida de 180 millones de dólares y, por ende, menores ingresos para
    subsidiar las diferencias reales en las tarifas"), sin frase propia a favor ni en contra.

- medio: caras-y-caretas
  url: https://www.carasycaretas.com.uy/sociedad/precio-combustibles-cuanto-aumentaron-del-2019-al-2023-n65050
  titulo: 'Precio de combustibles: ¿cuánto aumentaron del 2019 al 2023?'
  fecha: 2023-08-01
  evento: mecanismo-precios-combustibles-luc
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Es una nota de datos que no nombra al presidente y atribuye las subas a factores de mercado antes
    que a una decisión de gobierno ("los precios de los combustibles están influenciados por factores
    complejos, incluyendo las políticas gubernamentales sobre impuestos y regulaciones, los cambios
    en la oferta y demanda globales de petróleo, y eventos geopolíticos").
```
