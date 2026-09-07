# Crítica — corrida 2026-09-07-orsi-veracimetro

Modelo: Opus 5 (1M context) — `claude-opus-5[1m]`, elegido por el mantenedor para esta corrida.
Lote: `inbox/orsi/veracimetro/2026-09-07/`
Registros revisados: 4 chequeos + `declaraciones.yaml` vacío + `promesas.yaml` y `menciones.yaml` vacías.
Fuentes releídas en esta sesión: 14 (1 transcripción de video, 6 PDF de estados contables y presentaciones de
Ancap, 1 PDF de la Jutep, 1 decreto en IMPO, 2 gacetillas oficiales, 6 notas de prensa).
Archivos que dejo además de este: `inbox/orsi/veracimetro/2026-09-07/discrepancias.yaml` (3 registros).

**Estado mecánico.** Las 22 citas del lote existen y son exactas, sin excepción
(`pnpm validar --red --inbox … --solo citas`: 22/22 exactas, 0 aproximadas). Eso está bien y conviene decirlo,
porque el lote gemelo falló ahí. Lo que no pasa es `referencias`:

```
$ pnpm validar --inbox inbox/orsi/veracimetro/2026-09-07
✘ referencias: 7 error(es)
  chequeos.yaml#0  dato_real.fuentes.{0,1,2,3}.medio  Medio desconocido: no existe "ancap"
  chequeos.yaml#0  dato_real.fuentes.5.medio          Medio desconocido: no existe "miem"
  chequeos.yaml#1  dato_real.fuentes.0.medio          Medio desconocido: no existe "ancap"
  chequeos.yaml#1  dato_real.fuentes.2.medio          Medio desconocido: no existe "miem"
```

Es el arreglo más barato del lote (dos semillas, `grupo: estado-uruguayo`, `alineamiento: estatal`, ya
propuestas en `notas.md`) y no depende de nada más.

**El hallazgo que cambia el lote está en la primera línea de la cita y nadie lo chequeó.** Va entero en
"Objeciones al lote", punto 1, porque no es objeción a un registro sino a lo que falta: Ancap tuvo pérdida en
2020, cuatro años antes, y la frase "volvemos después de 10 años a tener números negativos" está publicada hoy
como título del sitio.

---

## Objeciones por registro

### chequeos[0] — 2025-04-25 — "en el año 19 ANCAP daba 41 millones de dólares de ganancia…"

- **severidad: corregir**
- **tipo:** `contexto_omitido` + `explicacion_alternativa`
- **objecion:**

  **(0.a) La hipótesis central de `notas.md` —"dos fuentes oficiales del propio Estado dan cifras distintas para
  el mismo ejercicio"— se resuelve dentro del PDF que el chequeo ya cita, y la respuesta es que no hay
  contradicción.** `notas.md` dice: "no encontré, en esos documentos, una conversión oficial a dólares que zanje
  cuál de las dos cifras en dólares es más precisa, ni el tipo de cambio exacto que cada comunicado usó". El tipo
  de cambio está en el mismo archivo que el resultado, unas páginas más adelante:

  > "Dólar Estadounidense 	35,15 30,67 37,31 32,41 … Promedio Cierre"
  > — Estados Financieros Individuales de Ancap al 31 de diciembre de 2019,
  > <https://www.ancap.com.uy/8563/1/eecc-individuales-2019.html>

  (promedio 2019 = 35,15; promedio 2018 = 30,67; cierre 2019 = 37,31; cierre 2018 = 32,41). Con el resultado del
  ejercicio individual de 2019, $ 1.464.281.136:

  | conversión | resultado |
  |---|---|
  | al **cierre** 37,31 | **39,2 millones** → la cifra de Presidencia, feb-2020 |
  | al **promedio** 35,15 | **41,7 millones** → la cifra de Orsi, abr-2025 |
  | consolidado ($ 1.513.044.719) al cierre | 40,6 millones → también redondea a 41 |

  Las dos cifras oficiales son el mismo resultado auditado bajo dos convenciones que la propia empresa publica.
  No hace falta el BCU: está en el PDF. La hipótesis debe reescribirse o cerrarse.

  **(0.b) Consecuencia directa sobre el veredicto: Orsi compara dos años con convenciones distintas.** Los 118
  millones de 2024 salen del resultado del ejercicio individual al **cierre** ($ 5.217.605.497 / 44,066 = 118,4;
  el tipo de cambio está en el balance de 2024, no en la presentación —ver 0.d). Los 41 de 2019 salen del
  **promedio**. Bajo una convención única:

  - las dos al cierre: **+39,2 (2019) contra −118,4 (2024)**;
  - las dos al promedio: **+41,7 (2019) contra −129,7 (2024)**.

  El sentido y el orden de magnitud de lo que dijo Orsi se sostienen en las dos lecturas; la cifra puntual de 41
  no es la comparable con 118. Eso es exactamente lo que el `analisis` tiene que decir, y hoy el `dato_real` no
  lo dice porque no hizo la conversión.

  **(0.c) Falta el contexto que la propia conferencia da y que el registro no recoge.** En el mismo video, la
  presidenta de Ancap explica de dónde sale la pérdida:

  > "Básicamente, los 118 millones de dólares de pérdida que plantea el presidente tienen que ver con un déficit
  > en lo que es el balance tanto de temas operativos como financieros. Y también con resultados de lo que son
  > las empresas subsidiarias y demás, todo lo que es el grupo ANCAP como tal."
  > — <https://www.youtube.com/watch?v=8_HQMDpzEYA>

  Y El Observador, nota que el chequeo ya cita para otra frase, cuantifica las causas: 297 días de parada de La
  Teja con un perjuicio estimado en US$ 115 millones, US$ 55 millones resignados por vender por debajo del PPI y
  US$ 24 millones de subsidio focalizado al supergás. Un chequeo del Veracímetro sobre "cuánto perdió Ancap" que
  no dice por qué perdió deja al lector con la mitad.

  **(0.d) Dos atribuciones que las fuentes no sostienen.** (i) `dato_real.valor` dice que la empresa "convierte a
  USD 118 millones al tipo de cambio de cierre de $44,066/USD **en su presentación oficial** «Resultados Ancap -
  Ejercicio 2024»". La presentación está toda en pesos y no trae ese tipo de cambio; la tabla de tipos de cambio
  está en los **estados financieros** ("Dólar estadounidense 40,231 38,689 44,066 39,022", promedio y cierre
  2024/2023), que es lo que El País describe como "el tipo de cambio de cierre incluido por el auditor en el
  balance". (ii) Dice que los estados de 2024 fueron "auditados por Grant Thornton, según cita El País": el
  hedge está bien puesto, pero el dato se puede tomar del balance mismo, sin intermediario.

  **(0.e) Falta `_faltante: dato_oficial`.** No existe documento oficial que diga "41 millones de dólares" para
  2019: existe el resultado en pesos y existen dos gacetillas con dos conversiones. El informe del lote reporta
  este chequeo como resuelto con dato oficial y el editor pierde la señal.

- **cita_de_contexto:** las tres de arriba, con URL.
- **accion_sugerida:**
  1. Reescribir `dato_real.valor` con la conversión hecha: peso auditado, los dos tipos de cambio publicados por
     Ancap, y las dos lecturas 39/41. Cerrar o borrar la hipótesis de `notas.md`.
  2. Corregir la atribución del tipo de cambio (balance, no presentación).
  3. Sumar al `dato_real` las causas de la pérdida de 2024 (El Observador y El País, ya leídas).
  4. Marcar `_faltante: dato_oficial` para la cifra de 2019 en dólares.
  5. **Calificación honesta: `discutible`,** salvo que el `analisis` escriba explícitamente qué convención usa
     cada cifra. Con eso escrito, `verdadero` es defendible: los dos números existen en los estados auditados y
     el signo de la comparación no depende de la convención. Sin eso, verde sobre "41 contra 118" presenta como
     una serie lo que son dos mediciones distintas. Es el mismo estándar que el crítico gemelo aplicó al "75%"
     de Lacalle Pou: verde solo si el análisis dice qué mide cada término.

---

### chequeos[1] — 2025-04-25 — "el anterior gobierno autorizó un crédito y se pidió un préstamo por 160 millones…"

- **severidad: corregir**
- **tipo:** `contexto_omitido` + `cita_fuera_de_contexto` (la `afirmacion`, no la cita)
- **objecion:**

  **(1.a) La `afirmacion` no sigue a la primaria, y la primaria estaba en el mismo video.** El registro escribe:
  "el gobierno anterior autorizó un crédito **para Ancap por 160 millones de dólares**". Lo que se dijo en la
  conferencia es que la autorización fue por 200 y que Ancap tomó 160:

  > "se autorizó por parte de la Presidencia de la República en noviembre del año pasado tomar un préstamo de
  > 200 millones de dólares, de los cuales ANCAP para tener liquidez, porque no tenía dinero en la caja para
  > poder pagar el combustible, tomó 160. Ese fue el último préstamo. Y después hay otros préstamos al Banco
  > República y a otros organismos de intermediación financiera."
  > — <https://www.youtube.com/watch?v=8_HQMDpzEYA>

  El chequeo va a buscar ese desglose a El Observador cuando estaba en la fuente primaria que ya tenía abierta.
  Y esa misma frase explica la composición de los 255 (los 160 más los préstamos al BROU y a otros), que es
  justo lo que el `dato_real` dice no poder reconstruir.

  **(1.b) "Deuda total" no es lo mismo que "deudas financieras", y el chequeo elige una de las dos sin decirlo.**
  El balance individual de 2024 tiene "Total de pasivo 30.664.848.327" (unos US$ 696 millones al cierre) y
  "Deudas financieras" por 2.915.602.321 (no corriente) + 7.316.594.888 (corriente) = 10.232.197.209 (US$ 232
  millones). El chequeo usa la segunda, que es la lectura correcta dado lo que dijo la presidenta de Ancap
  (préstamos), pero el `analisis` tiene que explicitarlo o el lector no entiende por qué "la deuda total" es 232
  y no 696.

  **(1.c) Contexto omitido que apunta en la dirección contraria a la del hablante, y sale del mismo balance: la
  deuda financiera de Ancap bajó durante 2024.** De $ 13.585.788.835 al 31/12/2023 (US$ 348 millones al cierre
  de 39,022) a $ 10.232.197.209 al 31/12/2024 (US$ 232 millones al cierre de 44,066). El `dato_real` trae la
  cifra de 2023 y no saca la consecuencia. Presentar el préstamo de noviembre como el hecho que "hace que la
  deuda total sea de 255" sin decir que el stock de deuda financiera cerró el año más abajo que el anterior es
  la mitad del cuadro.

  **(1.d) Contexto omitido sobre la palabra "novedad", que está en la cita publicada.** El Observador, nota ya
  citada por el chequeo, contesta ese punto con hechos:

  > "Si bien el presidente señaló que, a su entender, ese «no es un dato común» y representó «una novedad» para
  > el nuevo directorio de Ancap, la solicitud del préstamo se trató de una operación que fue pública en su
  > momento, informada por las autoridades de la estatal de ese entonces como un hecho necesario para poder
  > importar crudo."
  > — <https://www.elobservador.com.uy/economia-y-empresas/lo-que-el-gobierno-no-dijo-ancap-que-muestran-los-numeros-del-balance-la-empresa-n5995973>

  La misma nota documenta dos préstamos anteriores del mismo tipo (hasta US$ 300 millones autorizados en agosto
  de 2023, US$ 50 millones en julio de 2020).

  **(1.e) La `cita` de la fuente del balance es una fila de tabla sin encabezado.** `"TOTAL 7.316.594.888
  1.873.047.776 1.042.554.545 10.232.197.209"` es literal y suma bien, pero al lector del sitio le va a aparecer
  una fila de números sin etiqueta. Hay dos líneas rotuladas y contiguas que dicen lo mismo:
  `"Deudas financieras 21 2.915.602.321 3.870.840.606"` y `"Deudas financieras 21 7.316.594.888 9.714.948.229"`.

  **(1.f) Falta `_faltante: dato_oficial`.** El propio `dato_real` reconoce dos huecos: no se encontró la
  resolución del MEF y no hay estado financiero con corte a abril de 2025 que permita verificar los 255.

- **cita_de_contexto:** las tres de arriba, con URL.
- **accion_sugerida:**
  1. Reescribir la `afirmacion` siguiendo la primaria: autorización de hasta US$ 200 millones, de los que Ancap
     tomó US$ 160.
  2. Incorporar al `dato_real` la explicación de composición de los 255 que da la propia conferencia, la caída
     del stock de deuda financiera durante 2024 y los préstamos de 2020 y 2023.
  3. Cambiar la `cita` del balance por las dos líneas rotuladas.
  4. Marcar `_faltante: dato_oficial`.
  5. **Calificación honesta: `discutible`.** No hay documento con corte a 25/04/2025 que sostenga o refute los
     255 millones, y el único respaldo oficial de esa cifra es la gacetilla que reproduce al propio hablante. Ni
     verde ni rojo: la cifra no es verificable a la fecha en que se dijo. Nombrar en el `analisis` dónde se
     verificaría: **resoluciones del MEF publicadas en `impo.com.uy` y en `gub.uy/ministerio-economia-finanzas`,
     y el informe trimestral de Ancap al primer trimestre de 2025** (la empresa publica presentaciones
     trimestrales, según El País).

---

### chequeos[2] — 2024-11-18 — "ese 2% que aumentaron de IVA"

- **severidad: bloquea**
- **tipo:** `riesgo_legal` (leve, por afirmar más de lo dicho) + `contexto_omitido` + `un_solo_grupo`
- **objecion:**

  **(2.a) La `afirmacion` convierte una pregunta sobre el futuro en una afirmación sobre el pasado.** El registro
  dice: "Orsi afirmó que el gobierno saliente de Lacalle Pou había aumentado en 2 puntos porcentuales el IVA
  aplicado a las compras con tarjeta, **sin devolverlo antes de dejar el gobierno**". Lo que hay en la fuente es:

  > "Y mi pregunta fue, y ahí no tuve respuesta, si antes de irse van a devolver ese 2% que aumentaron de IVA.
  > Porque ahí sí hay una muestra clara de aumento de tributos. No escuché nada"
  > — Montevideo Portal, 18/11/2024,
  > <https://www.montevideo.com.uy/Noticias/-El-presidente-voy-a-ser-yo-eso-queria-que-quedara-claro--Orsi-sobre-no-subir-impuestos-uc906902>

  El 18/11/2024 el gobierno no se había ido: se fue el 1/3/2025. Orsi **preguntó** si lo iban a devolver antes de
  irse y dijo que no obtuvo respuesta. La cláusula "sin devolverlo antes de dejar el gobierno" es un hecho que
  todavía no había ocurrido, agregado por el registro. Es el mismo defecto que el crítico gemelo marcó en el
  chequeo de los US$ 600 millones de Lacalle Pou ("le impone al hablante un período que él no dijo"); acá el
  sesgo cae del otro lado y hay que corregirlo por la misma razón, que es la regla, no de quién se trate.

  **(2.b) La `afirmacion` también agrega el objeto.** Orsi dijo "ese 2% que aumentaron de IVA", sin decir "a las
  compras con tarjeta". La especificación es interpretación —razonable— del investigador. Lo que la sostiene está
  en `notas.md` y no en el registro: el video del debate del 17/11/2024, donde Orsi sí lo dice completo ("¿devolverán
  el 2% que recargaron de IVA por la compra por tarjetas?"). Fue correcto no coser las dos frases; corresponde
  que el `analisis` explique de dónde sale la interpretación.

  **(2.c) El `dato_real` afirma cinco cosas que su documento oficial no dice.** El Decreto 97/020 en IMPO, leído
  entero (2.483 caracteres), dice:

  > "RESULTANDO: I) que, haciendo uso de la facultad referida en primer término, el Decreto N° 203/014, de 22 de
  > julio de 2014, dispuso una rebaja adicional de 2 (dos) puntos porcentuales del Impuesto al Valor Agregado en
  > las operaciones por montos inferiores al equivalente a UI 4.000 … CONSIDERANDO: que es necesario abatir el
  > déficit fiscal … Artículo 4 Lo dispuesto en el presente Decreto regirá a partir del 1° de mayo de 2020 …
  > LACALLE POU LUIS - AZUCENA ARBELECHE"
  > — <https://www.impo.com.uy/bases/decretos/97-2020>

  Lo que el decreto **sí** prueba: que existían 2 puntos adicionales dispuestos por decreto en 2014, que este
  decreto disminuye la reducción del IVA para abatir el déficit, que rige desde el 1/5/2020 y que lo firman
  Lacalle Pou y Arbeleche. Lo que **no** prueba y el `dato_real` afirma igual: (i) que el descuento total fuera
  de 4 puntos "entre 2017 y abril de 2020"; (ii) que 2 de esos puntos vinieran "de la propia ley"; (iii) que el
  resultado fueran 2 puntos; (iv) que esos 2 puntos "siguen vigentes hoy"; (v) que la rebaja adicional fuera de
  2017 (el propio decreto la fecha en 2014). Los artículos 1 y 2, que son los que fijan las nuevas magnitudes,
  IMPO los muestra solo como nota ("dio nueva redacción a"), sin texto. **Todo eso viene de Ámbito, que es
  prensa.**

  **(2.d) Error de atribución dentro del `dato_real`.** Dice que el documento del MEF "afirmó … que el quintil de
  menores ingresos usaba tarjeta de débito para compras de alimentación y limpieza en apenas un 3,81%-4% de los
  casos". En Ámbito, el 3,81%/4% es lo que dijo **Lacalle Pou** en una entrevista; la cifra del documento del MEF
  con datos del BCU es **4,81%**:

  > "«Cuando tú te fijas en alimentación, en productos de limpieza, ¿sabes cuánto lo utiliza el quintil más bajo?
  > Un 3,81%, o un 4%…», afirmó en una entrevista con Subrayado … en el primer quintil de ingresos la utilizan el
  > 4,81% de los hogares relevados por la encuesta"
  > — <https://ambito.com/uruguay/los-numeros-detras-la-reduccion-del-descuento-iva-tarjetas-debito-n5668404>

  **(2.e) Una sola fuente, un solo grupo, y no hay salida limpia a la vista.** `evidencia` tiene únicamente
  Montevideo Portal (`montevideo-comm`). El `_faltante: segunda_fuente` está bien puesto. La nota dice que la
  rueda de prensa fue "consignada por Telemundo (Canal 12)": ahí está el candidato natural de otro grupo
  (`cardoso`), y el `teledoce` ya existe en `content/medios/`.

- **cita_de_contexto:** las cuatro de arriba, con URL.
- **accion_sugerida:**
  1. Reescribir la `afirmacion` sin el hecho futuro: "…preguntó si el gobierno saliente iba a devolver, antes de
     dejar el gobierno, el 2% de IVA que a su juicio había aumentado, y dijo que no obtuvo respuesta".
  2. Sacar del `dato_real` todo lo que no está en el decreto o marcarlo como atribuido a Ámbito, y corregir 2017
     por 2014 y 3,81% por 4,81%.
  3. Conseguir la magnitud en documento oficial: **texto vigente del Decreto 203/014, art. 1 BIS, en
     `impo.com.uy/bases/decretos/203-2014`** (es la norma a la que el 97/020 le da nueva redacción), o la página
     de DGI sobre el beneficio de reducción de IVA de la Ley 19.210. Es una consulta.
  4. Buscar la segunda fuente en Telemundo (`teledoce`, grupo `cardoso`) para la rueda de prensa del 18/11/2024.
  5. **Calificación honesta: `discutible`** con lo que hay. Con el punto 3 resuelto, `verdadero` es defendible
     **solo si** el `analisis` dice las dos cosas que hoy no dice: que la tasa general del IVA (22%) no cambió y
     que lo que se recortó fue una rebaja para pagos electrónicos, y que el MEF caracterizó la misma medida como
     "el fin de un subsidio antes que el aumento de impuestos". Dato a favor de la formulación de Orsi que
     conviene anotar: Ámbito, en voz propia, describe la medida como "un aumento del IVA para las tarjetas de
     débito, haciendo que el descuento pasara del 4% al 2%".

---

### chequeos[3] — 2026-05-26 — "el descuento de USD 25.000 en la compra de su camioneta"

- **severidad: bloquea**
- **tipo:** `riesgo_legal` + `explicacion_alternativa` + `un_solo_grupo`
- **objecion:**

  **(3.a) La `afirmacion` no es una afirmación del político, y el esquema dice que tiene que serlo.** El campo
  `politico` está definido en `src/schemas/chequeo.ts` como "Quién hizo la afirmación", y este registro declara
  `politico: orsi` con esta `afirmacion`: "**La prensa consultó a Orsi** sobre un descuento de USD 25.000…". Lo
  único que Orsi dijo ese día fue: "Cuando usted vea la factura, ahí va a decir qué precio es" — es decir, se
  negó a dar la cifra. Chequear los USD 25.000 acá es calificar en el Veracímetro una afirmación **de la prensa**
  y colgársela a un presidente que no la hizo. Es el mismo defecto que el crítico gemelo marcó en el chequeo de
  los US$ 150 millones de Lacalle Pou (`afirmacion` que empieza "Presidencia informó…" con `politico:
  lacalle-pou`), y lo marco con la misma severidad.

  Agravante propio de este caso: `fragmento: "el descuento de USD 25.000 en la compra de su camioneta"` está en
  el **`resumen`** publicado, dentro de la oración "Consultado por la prensa sobre el descuento de USD 25.000…".
  El sitio marcaría con color de veredicto, en la ficha de Orsi, una cifra que la propia oración atribuye a la
  pregunta de un periodista.

  **(3.b) El dato no es chequeable con lo que hay, y el `dato_real` lo reconoce por escrito.** "No se encontró la
  factura ni una lista de precios del importador como documento público independiente: la cifra de USD 25.000
  proviene de la cadena de citas de prensa". `notas.md` agrega que el artículo de Radio Carve más cercano en
  fecha **no contiene esas tres cifras** y que el segmento radial no se localizó. Con eso, la única salida
  compatible con el esquema es `discutible` (prensa sola), y ni siquiera eso resuelve 3.a.

  **(3.c) Riesgo legal, y es el punto que no se puede dejar pasar.** El registro califica una cifra sobre un
  presidente en ejercicio, en un asunto con un pedido de informes parlamentario en curso y —según un titular de
  Infobae que `notas.md` dice **no haber abierto**— una actuación de la Jutep. Art. 336 CP: el chequeo afirma
  más de lo que sus fuentes sostienen si le pone semáforo a una cifra cuyo origen documental nadie leyó. Ley
  18.331 art. 18: si el registro va a mencionar la actuación de la Jutep, tiene que ir con etapa y fecha de
  fuente pública, no de un snippet de buscador. Lo que sí está sólidamente documentado y hoy no se aprovecha:
  Presidencia **confirmó que hubo descuento** ("una «rebaja o descuento» por ese monto", Caras y Caretas; "se
  trató de una «gentileza»", Montevideo Portal) y el prosecretario dio su fundamento jurídico ("cuando Yamandú
  Orsi hizo esa compra no era funcionario", El País). Eso es reportable; el semáforo sobre los 25.000, no.

  **(3.d) Lo mejor del registro está mal calculado, y bien calculado es el hallazgo.** El `dato_real` dice que el
  valor declarado, $ 3.396.570, son "unos USD 87.000 al tipo de cambio de cierre de 2025 de $39 usado por Radio
  Carve". Ese número no aparece en ningún lado y es **mayor que el precio de lista** que la misma nota reporta,
  lo cual debería haber encendido una alarma: se está aplicando un tipo de cambio de fines de 2025 a un valor
  declarado a comienzos de 2025. Con el orden de magnitud que corresponde a febrero-marzo de 2025:

  > **US$ 78.990 × 43 = $ 3.396.570.** Exacto.

  Es decir: la declaración jurada es consistente con que Orsi declaró la camioneta **al precio de lista**, no al
  precio de compra. Eso corrobora con documento oficial una de las tres cifras de la cadena de prensa (los
  78.990) y deja las otras dos sin respaldo documental.

  **(3.e) Explicación alternativa que hay que descartar antes de calificar nada.** Los USD 25.000 se obtienen por
  dos caminos distintos con las cifras publicadas: 78.990 − 54.000 = 24.990, y 54.000 − 29.000 (valor declarado
  del Hyundai 2020 entregado como parte de pago, según Caras y Caretas) = 25.000. Que dos operaciones distintas
  den el mismo número obliga a ver la factura antes de afirmar que 25.000 es el descuento y no, por ejemplo, el
  monto de la transferencia bancaria. No digo que sea así; digo que con lo que hay no se puede distinguir.

  **(3.f) Dependencia de un solo grupo, ya diagnosticada en `content/`.** `evidencia` trae Montevideo Portal
  (`montevideo-comm`) y Caras y Caretas (`editora-caras-y-caretas`): mecánicamente dos grupos, materialmente una
  sola nota. Lo verifiqué otra vez: el párrafo es idéntico palabra por palabra en las dos, incluidas las tres
  cifras y la atribución a Radio Carve. Las `notas_internas` del registro publicado ya lo dicen y por eso está en
  `probable`.

  **(3.g) — Aviso al editor, y es el más importante de todo el informe — `notas.md` propone, sin quererlo, una
  segunda fuente falsa.** Dice: "el hallazgo de camioneta en particular podría ser relevante para el `_faltante:
  segunda_fuente` que hoy tiene ese registro en `content/`", refiriéndose a la nota de El País del 28/05/2026
  (grupo `scheck-aguirre`, genuinamente independiente). **No se puede.** Leí la nota entera: no contiene la cita
  del registro ("Cuando usted vea la factura, ahí va a decir qué precio es") ni ninguna otra frase de Orsi de esa
  rueda de prensa; cubre la respuesta de Jorge Díaz y el pedido de informes de Schipani. Sumarla a
  `evidencia.fuentes` pasaría la validación de red —cada fuente valida su propia `cita`— y le daría al registro
  un segundo grupo con el que subiría de `probable` a `publicado` **con una fuente que no respalda la cita**. La
  nota de El País prueba un hecho distinto: va donde ya está (en `dato_real`) o como registro nuevo, nunca como
  segunda fuente de esa declaración.

- **cita_de_contexto:** las citas de Montevideo Portal, Caras y Caretas, El País y la declaración jurada están
  transcritas literalmente en `inbox/orsi/veracimetro/2026-09-07/discrepancias.yaml`, con URL.
- **accion_sugerida:**
  1. **No publicar este registro como chequeo de Orsi.** Tres salidas, en orden de preferencia:
     (a) sacarlo del lote y dejar el material en `hipotesis/` hasta que exista la factura o una lista de precios
     del importador; (b) reescribirlo sin `fragmento`, con la `afirmacion` atribuida a quien la hizo (el informe
     radial), lo que hoy el esquema no permite con `politico`; (c) convertirlo en un registro de patrimonio o de
     caso, que es la colección donde este material encaja.
  2. Incorporar donde sobreviva el cálculo correcto del punto 3.d (78.990 × 43 = 3.396.570) y sacar el "USD
     87.000".
  3. Si se menciona la actuación de la Jutep, abrir la fuente con `pnpm fuente` y consignar etapa y fecha; si no,
     no mencionarla.
  4. Dejar escrito en el registro y en `razones.md` el aviso 3.g, para que no se aplique en una corrida futura.
  5. **Si el editor decide publicar algo igual: `discutible`, nunca verde ni rojo,** y en `probable`.

---

### declaraciones.yaml — vacío

- **severidad: aviso**
- **tipo:** `sin_objecion`, con una salvedad
- **objecion:** La búsqueda de primarias está bien hecha y bien documentada, URL por URL, incluida la
  autocrítica de haber transcripto por error una rueda de prensa de La Moncloa. La salvedad es que el lote
  **encontró una primaria y decidió no usarla**, y la decisión fue correcta: el video del debate del 17/11/2024
  (`https://www.youtube.com/watch?v=t55eeoxENM8`) trae una frase parecida pero de otro día y otro contexto, y
  coserla a la declaración del 18/11 habría fabricado una cita. Eso merece quedar registrado como acierto, no
  solo como ausencia.
- **accion_sugerida:** abrir una declaración nueva para el debate del 17/11/2024 con esa frase y ese video como
  primaria (`tipo: video`, con `marca_tiempo`). Cierra el `_faltante: segunda_fuente` del chequeo del IVA por la
  vía correcta —un registro propio con primaria— en lugar de por la vía que lo rompería.

### La decisión sobre el "100 %" (declaración del 25/08/2026)

- **severidad: aviso** · **tipo: `sin_objecion`**
- Coincido: "el respaldo a la ministra es absoluto, es 100%" es un intensificador, no una magnitud. No hay
  universo contra el cual medirlo y no existe documento oficial que pueda confirmarlo o refutarlo. La decisión
  está bien tomada y bien fundada en `notas.md`. Dejo constancia de que revisé el resto de esa declaración
  buscando otro dato chequeable y no lo hay: lo único verificable alrededor ("no había leído el contenido de la
  denuncia", la denuncia penal de la Coalición Republicana) es materia de `casos/`, que el brief prohíbe
  investigar y que además tiene compuerta humana.

### promesas.yaml y menciones.yaml — vacíos

- **severidad: aviso** · **tipo: `sin_objecion`**
- El encargo no las pedía; las listas vacías son la respuesta correcta.

---

## Objeciones al lote

### 1. El dato titular de la declaración es falso, está publicado hoy en el sitio, y no se chequeó

`revision.tier: publicado` en `content/declaraciones/orsi/2025-04-25-orsi-informo-ancap-volvio-tener-resultados.yaml`:

```yaml
titulo: Ancap volvió a números negativos tras diez años y su deuda total llega a 255 millones de dólares
resumen: Orsi informó que Ancap volvió a tener resultados negativos después de diez años …
```

El título y el resumen son **voz del sitio**, no cita. Los estados financieros individuales auditados de Ancap
de 2020 dicen:

> "Resultado del Ejercicio (510.662.282) 1.464.281.136"
> — Estados Financieros Individuales de Ancap al 31 de diciembre de 2020,
> <https://www.ancap.com.uy/9431/1/eecc-individuales-2020.html>

Pérdida en 2020. Lo mismo en el consolidado del mismo año: "Resultado del ejercicio (457.129.828)" y "Resultado
del ejercicio atribuible a: Propietarios de la Compañía (510.662.283)"
(<https://www.ancap.com.uy/9432/1/eecc-consolidados--2020.html>). El último ejercicio negativo antes de 2024 fue
**2020, cuatro años antes**, no 2015.

Y esto **ya estaba en el expediente**: El País, nota que el propio chequeo cita para otra frase, lo dice en la
primera pantalla:

> "Estas son las pérdidas más grandes desde 2015, cuando el rojo había sido de US$ 198 millones. Además, dejó
> atrás tres años consecutivos de ganancias (en 2020 había perdido US$ 12 millones)."
> — <https://elpais.com.uy/negocios/empresas/ancap-tuvo-en-2024-las-mayores-perdidas-desde-2015-con-us-118-4-millones-que-estuvo-detras>

Tres consecuencias, en orden de urgencia:

1. **Falta el chequeo.** "Volvemos después de 10 años a tener números negativos" es un dato concreto dentro de la
   cita publicada, es el que da el título, es el que Subrayado puso en su titular, y es el único de los cinco
   datos de esa cita que resulta **falso** contra documento oficial. Chequearlo da `falso` con fuente
   `documento_oficial`, que es lo que el esquema exige para rojo. No chequearlo mientras se chequean los cuatro
   datos que resisten mejor no es un descuido neutro: deja fuera justo el que el político tenía en contra.
2. **Hay que corregir el registro publicado.** El `titulo` y el `resumen` afirman los "diez años" en voz del
   sitio. Va por `content/correcciones/`, tipo corrección de contenido, sobre
   `orsi/2025-04-25-orsi-informo-ancap-volvio-tener-resultados`. **Ojo con el orden:** si la corrección toca el
   `resumen`, el `fragmento` de los dos chequeos de Ancap sigue apuntando a la `cita`, que no cambia; pero
   conviene aplicar corrección y chequeos en el mismo movimiento.
3. **En la misma conferencia, Orsi repitió el error de forma más precisa** ("el último balance negativo fue en el
   año 15… los números daban positivo hasta el año 23"), y El Observador lo transcribió sin contestarlo. Que
   ningún medio de los cuatro que cubrieron la conferencia haya cotejado la afirmación contra el balance de 2020
   es, en sí, un dato para la sección de cobertura.

### 2. El criterio del brief se aplicó a la lista del brief, no al criterio del brief

El brief enuncia el criterio general —"si hay un dato concreto dentro de una cita publicada, se chequea"— y
después entrega una tabla cerrada con los datos a chequear ("cifras de 41, 118 y 160 millones y «deuda total de
255 millones de dólares»"). El investigador siguió la tabla, que es lo que corresponde. El resultado es el punto
1: el dato que faltaba en la tabla era el único falso. **No es culpa del lote; es un defecto de diseño del brief**
y se arregla en el brief (ver "Objeciones al brief", punto 3).

### 3. Dependencia de grupo

- `chequeos[0]` y `[1]`, `evidencia` (`nivel: textual`): video de Presidencia + Subrayado (`fontaina-de-feo`).
  Correcto: con primaria de tipo `video`, la regla de dos grupos no aplica. Bien clasificado.
- `chequeos[2]`, `evidencia`: **una sola fuente, un solo grupo.** Marcado.
- `chequeos[3]`, `evidencia`: dos grupos formales, una sola nota real. Ver 3.f y 3.g.
- `dato_real` de todo el lote: 11 de las 15 fuentes documentales son del grupo `estado-uruguayo` (`ancap`,
  `miem`, `presidencia`, `impo`, `jutep`). Ninguna regla lo prohíbe —`dato_real` no exige dos grupos— y en un
  Veracímetro es lo correcto, porque la fuente oficial es el patrón. Lo anoto porque el `analisis` no debe
  presentar como convergencia de fuentes lo que en varios casos es el mismo organismo hablando dos veces: la
  gacetilla del MIEM del 25/04/2025 **reproduce al propio Orsi** y no verifica nada; el chequeo lo dice bien en
  `dato_real.valor` y tiene que decirlo también el `analisis` público.

### 4. Archivado

Los seis PDF y páginas de `ancap.com.uy` que leí vuelven con `wayback ninguno`. Antes de promover, `pnpm
archivar`. Los de `gub.uy`, `impo` y las notas de prensa sí tienen copia.

### 5. Discrepancias: escribí tres y descarté dos, y digo cuáles

`inbox/orsi/veracimetro/2026-09-07/discrepancias.yaml`:

1. **`presidencia`, 27/02/2020, `dato_erroneo`.** La nota publica bajo la etiqueta "resultado operativo" cifras
   que corresponden al resultado del ejercicio: 39 millones para 2019 y 88 para 2018, que son
   $ 1.464.281.136 / 37,31 y $ 2.854.322.969 / 32,41 (tipos de cambio de cierre publicados por la propia Ancap
   en el mismo balance). El resultado operativo de 2019 fue $ 4.043.681.908 (108,4 millones al cierre) y el de
   2018, $ 5.294.854.562 (163,4 millones). Se decide con documentos primarios solamente. **No** registro nada
   sobre "cinco años consecutivos de superávit" del titular: eso necesita los balances de 2015 a 2017, que no
   leí, y en 2015 y 2016 el resultado operativo y el del ejercicio muy probablemente tengan signos distintos.
2. y 3. **`montevideo-portal` (26/05/2026) y `caras-y-caretas` (27/05/2026), `atribucion_incorrecta`.** Las dos
   publican, palabra por palabra, "Orsi —según su declaración jurada— la compró en US$ 54.000". El formulario de
   la declaración jurada no tiene columna de precio de compra para vehículos, y la única cifra que consigna para
   la Hyundai 2025 es $ 3.396.570,00 de "Valor actual (estimado)". Registro las dos porque las dos publicaron, y
   dejo escrito en cada `analisis` que es el mismo texto, para que no se lea como dos errores independientes.

Descartadas, con motivo:

- **El Observador (US$ 55 millones por PPI) contra El País (US$ 40 millones "hasta fin de setiembre").**
  Períodos y perímetros distintos, ningún documento que decida. Es un **desacuerdo entre medios**, no una
  discrepancia, y por eso va acá y no al archivo.
- **Gacetilla del MIEM:** dice que el déficit de 118 millones "surge del balance operativo y financiero, **y de
  endeudamiento**". En el video la ministra separa las dos cosas, pero su frase ("el otro tanto tiene que ver con
  endeudamiento") es ambigua y los costos financieros de Ancap sí crecieron $ 2.360 millones en 2024 según el
  balance. No alcanza para registrar; sin verbos de intención y sin certeza, no se registra.

**Composición y Regla 0 de ese archivo:** uno contra la comunicación oficial de un gobierno del Frente Amplio,
en una nota cuyo encuadre favorece a la gestión de ese gobierno; dos contra notas desfavorables a un presidente
del Frente Amplio, una de un medio `sin_datos` y otra de un medio `progresista`, o sea afín al político al que
perjudica. No es un archivo de un solo lado. Además dejo constancia de que coteje las cifras de Subrayado, El
País (las dos notas), Ámbito y Montevideo Portal (18/11/2024) contra los documentos primarios y **coinciden**;
el hallazgo negativo también se audita.

### 6. Simetría con la corrida gemela

Verifiqué el estado en vez de asumirlo:

- `content/chequeos/` tiene hoy 3 registros, los 3 de Lacalle Pou. Este lote suma 4 y el gemelo 3: quedaría
  **6 Lacalle Pou / 4 Orsi**, sobre una base publicada de 47 declaraciones de Lacalle Pou y 35 de Orsi (57/43).
  El par de corridas es proporcionado.
- **El rigor exigido es el mismo, y lo verifiqué caso por caso.** El crítico gemelo pidió `discutible` en los
  tres chequeos de Lacalle Pou; yo pido `discutible` en los dos de Ancap y en el del IVA, y `bloquea` en el de la
  camioneta. Los motivos son homólogos, no simétricos por decreto: `afirmacion` con un elemento que el hablante
  no dijo (0.b del gemelo ↔ 2.a mío), `afirmacion` que no es del político sino de un tercero (2.c del gemelo ↔
  3.a mío), documento oficial que no dice lo que el `dato_real` le hace decir (2.e del gemelo ↔ 2.c mío), y
  ausencia de dato oficial independiente del propio interesado (1.c del gemelo ↔ 1.f y 0.e míos).
- **Una diferencia real de rigor entre los dos lotes, a favor de este:** el lote de Orsi tiene 22 de 22 citas
  exactas y el gemelo dos citas inexistentes. Y este lote se autoimpuso una restricción que el gemelo no
  necesitó: no coser el video del debate del 17/11 con la declaración del 18/11.
- **Una diferencia real de rigor en contra de este lote, y es la del punto 1:** en el lote gemelo el crítico
  encontró que la premisa negativa ("no lo dijo en el discurso") no estaba probada; acá el problema es el
  inverso, un dato afirmado por el político y por el sitio que **sí** se puede refutar con documento oficial y
  que no se buscó. Si el criterio "todo dato concreto dentro de la cita" se hubiera aplicado igual en los dos
  lotes, este chequeo existiría.
- **Una asimetría aguas arriba que no es de este lote y conviene dejar escrita:** el Veracímetro solo califica al
  político del expediente. En el `dato_real` del chequeo del IVA aparece un dato concreto y chequeable dicho por
  **Lacalle Pou** ("Un 3,81%, o un 4%") que el documento del MEF cifra en 4,81%. Es tan chequeable como los
  demás, tiene documento oficial detrás y no se chequeó porque el expediente es de Orsi. Es exactamente el mismo
  hueco que el crítico gemelo señaló del otro lado (la respuesta de Kechichian). Dos salidas simétricas: (a) se
  chequea todo dato dentro de una cita o resumen publicado, lo diga quien lo diga; o (b) se deja escrito que el
  alcance es "los datos del político del expediente" y se aplica igual a todos. Hoy está implícito y produce un
  Veracímetro que califica a quien gobierna y no a quien lo critica, en cualquier gobierno.

---

## Objeciones al brief

1. **No hay violación de Regla 0 en el diseño del brief.** Existe *por* simetría, declara su gemelo, pide que se
   señale lo asimétrico, no pide seleccionar ni encuadrar por partido, y en el punto de la camioneta ordena
   expresamente registrar "solo lo que está en fuentes públicas, con estado y fecha" y no investigar el caso
   judicial. Lo digo explícitamente porque la ausencia de objeción también se audita. `notas.md` responde
   "Ninguna" en `objeciones_al_brief` y en eso coincido con el investigador.
2. **La asimetría operativa entre los dos briefs gemelos existe y la confirmo desde este lado.** La cláusula
   "decidí vos si es un dato concreto o una figura retórica" está en el brief de Orsi (línea 19) y no en el de
   Lacalle Pou. El crítico gemelo la señaló y tiene razón: en su lote esa pregunta era la decisiva y el brief no
   invitaba a hacerla. **Corrección: la misma cláusula, con el mismo texto, en los dos briefs.**
3. **Y hay una asimetría en sentido contrario, que es de este brief y nadie señaló.** El brief de Orsi enuncia un
   criterio general y después lo reemplaza por una lista cerrada de datos ("cifras de 41, 118 y 160 millones y
   «deuda total de 255 millones de dólares»"). El brief gemelo también enumera, pero sus dos declaraciones tienen
   menos datos y la enumeración no dejó nada afuera. Acá dejó afuera el único dato falso de la cita. **Corrección
   simétrica: los dos briefs dicen "todo dato concreto que esté dentro de la `cita` o el `resumen`", y la tabla
   pasa a ser ejemplo ("entre otros"), no lista.** Con esa redacción, "10 años" entraba solo.
4. **Error fáctico del brief, ya detectado por el investigador y confirmado por mí:** el brief dice que las
   cuatro declaraciones "están hoy en nivel `reportado` (prensa)"; la de Ancap está en `nivel: textual` con video
   desde la corrección `2026-09-06-titulos-declaraciones`. Es el mismo error que el brief gemelo cometió con la
   declaración del 02/03/2023. Un chequeo de coherencia contra `content/` al generar el brief lo evita en los
   dos.
5. **Regla que hace falta en los dos briefs, y el crítico gemelo ya propuso el mismo texto desde su lado:** *si
   la cifra no la afirma el político sino un tercero —una oficina de prensa, un informe radial, un comunicado—,
   no se chequea como afirmación suya; se chequea como afirmación de quien la publicó o no se chequea. Y si el
   registro primario disponible está incompleto, no se afirma el hecho negativo.* Que los dos críticos, en lotes
   distintos y sin verse, hayan llegado a la misma regla desde el chequeo de Lacalle Pou y el de Orsi es la mejor
   señal de que corresponde escribirla.

---

## Cobertura

Un registro por cada **nota de prensa** leída en el lote. Excluyo a propósito las piezas de `presidencia`,
`miem`, `ancap`, `impo` y `jutep`: son comunicación institucional o documento del Estado, no cobertura
periodística, y medir el "tono" de la oficina de prensa de un gobierno hacia ese mismo gobierno contaminaría la
métrica en lugar de informarla. Es el mismo criterio que aplicó el crítico de la corrida gemela y vale igual para
cualquier gobierno. Aplico también su umbral para `favorable`/`desfavorable`: hace falta una frase **del cuerpo y
en voz del medio** que valore al político; la composición de la nota sola no alcanza.

```yaml
- medio: subrayado
  url: https://subrayado.com.uy/volvemos-despues-10-anos-tener-numeros-negativos-ancap-dijo-orsi-e-informo-una-deuda-total-255-millones-dolares-n975389
  titulo: >-
    "Volvemos después de 10 años a tener números negativos en Ancap", dijo Orsi, e informó de "una
    deuda total de 255 millones de dólares"
  fecha: 2025-04-25
  evento: "propuesto: balance-ancap-2024"
  politico: orsi
  tono: neutral
  justificacion: >-
    Crónica en voz atribuida, sin frase propia del medio que valore al presidente: "El presidente
    Yamandú Orsi llamó este viernes al mediodía a una conferencia de prensa junto a la ministra de
    Industria Fernanda Cardona y la presidenta de Ancap Cecilia San Román para presentar las cifras
    del último balance de la empresa estatal de combustibles". Incluye la aclaración que exculpa al
    gobierno anterior ("No puedo decir que nos ocultaron cifras").

- medio: el-observador
  url: https://www.elobservador.com.uy/economia-y-empresas/lo-que-el-gobierno-no-dijo-ancap-que-muestran-los-numeros-del-balance-la-empresa-n5995973
  titulo: >-
    Lo que el gobierno no dijo sobre Ancap: qué muestran los números del balance de la empresa
  fecha: 2025-04-26
  evento: "propuesto: balance-ancap-2024"
  politico: orsi
  tono: desfavorable
  justificacion: >-
    El medio contradice al presidente en voz propia, no atribuida: "Si bien el presidente señaló
    que, a su entender, ese 'no es un dato común' y representó 'una novedad' para el nuevo
    directorio de Ancap, la solicitud del préstamo se trató de una operación que fue pública en su
    momento". Y en el mismo registro: "Ese hecho no fue mencionado en la conferencia de prensa" y
    "Además, no se explicó que Ancap ha recurrido a préstamos en tres oportunidades recientes".

- medio: el-pais
  url: https://elpais.com.uy/negocios/empresas/ancap-tuvo-en-2024-las-mayores-perdidas-desde-2015-con-us-118-4-millones-que-estuvo-detras
  titulo: >-
    Ancap tuvo en 2024 las mayores pérdidas desde 2015, con US$ 118,4 millones, ¿qué estuvo detrás?
  fecha: 2025-04-02
  evento: "propuesto: balance-ancap-2024"
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Análisis contable del ejercicio 2024, gestionado bajo su gobierno, sin valoración de nadie: "El
    resultado de pérdidas de la petrolera estatal Ancap en 2024 no fue una sorpresa: en las
    presentaciones trimestrales del ente se venía advirtiendo el deterioro". Aviso para el editor:
    la asignación de `politico` es discutible, porque la nota no trata a ningún político; se le
    asigna a Lacalle Pou por ser el ejercicio de su administración. Si el editor prefiere, este
    registro se omite en lugar de forzar la atribución.

- medio: ambito
  url: https://ambito.com/uruguay/los-numeros-detras-la-reduccion-del-descuento-iva-tarjetas-debito-n5668404
  titulo: Los números detrás de la reducción del descuento de IVA en tarjetas de débito
  fecha: 2023-03-08
  evento: "propuesto: rendicion-de-cuentas-asamblea-general-2023"
  politico: lacalle-pou
  tono: neutral
  justificacion: >-
    Presenta largamente los datos del MEF que sostienen la posición del presidente, pero en voz
    propia describe la medida con el término que él rechaza: "la compleja situación fiscal del país
    llevó a un aumento del IVA para las tarjetas de débito, haciendo que el descuento pasara del 4%
    al 2%". Distingue con cuidado lo que dijo el presidente ("Un 3,81%, o un 4%") de lo que dice el
    documento oficial (4,81%). No hay frase del medio que lo valore en ninguna dirección.

- medio: montevideo-portal
  url: https://www.montevideo.com.uy/Noticias/-El-presidente-voy-a-ser-yo-eso-queria-que-quedara-claro--Orsi-sobre-no-subir-impuestos-uc906902
  titulo: >-
    "El presidente voy a ser yo; eso quería que quedara claro": Orsi sobre no subir impuestos
  fecha: 2024-11-18
  evento: elecciones-2024
  politico: orsi
  tono: neutral
  justificacion: >-
    Crónica de rueda de prensa enteramente en voz atribuida: "El candidato a la presidencia por el
    Frente Amplio, Yamandú Orsi, habló este lunes tras el debate presidencial contra el nacionalista
    Álvaro Delgado, en declaraciones donde reafirmó su compromiso de no subir impuestos en caso de
    ser electo". No hay valoración del medio.

- medio: montevideo-portal
  url: https://www.montevideo.com.uy/Noticias/-Cuando-usted-vea--Orsi-hablo-sobre-la-camioneta-que-compro-con-US-25-000-de-descuento-uc963282
  titulo: >-
    "Cuando usted vea": Orsi habló sobre la camioneta que compró con US$ 25.000 de descuento
  fecha: 2026-05-26
  politico: orsi
  evento: "propuesto: descuento-camioneta-orsi-2026"
  tono: neutral
  justificacion: >-
    El medio afirma el descuento en voz propia ("la adquirió a US$ 25.000 menos que el precio de
    lista que figura para el modelo") y cierra con una insinuación opositora sin respuesta ("El
    senador del Partido Nacional Sebastián da Silva consideró que no quiere 'saber qué más puede
    haber en declaraciones juradas'"), pero incluye la explicación de Presidencia ("se trató de una
    'gentileza'") y no hay una frase del medio que valore al presidente. Con el mismo umbral que el
    crítico gemelo aplicó a la nota de reacciones de El País contra Lacalle Pou, esto es neutral.
    Aviso al editor: la afirmación en voz propia del monto es la que motiva la discrepancia
    registrada aparte.

- medio: caras-y-caretas
  url: https://www.carasycaretas.com.uy/sociedad/la-camioneta-la-polemica-orsi-mostro-factura-y-entrego-vehiculo-como-forma-pago-n95840
  titulo: >-
    La camioneta de la polémica: Orsi mostró factura y entregó vehículo como forma de pago
  fecha: 2026-05-27
  evento: "propuesto: descuento-camioneta-orsi-2026"
  politico: orsi
  tono: neutral
  justificacion: >-
    Mismo texto de base que Montevideo Portal, con dos agregados: los datos que aporta Presidencia
    sobre la forma de pago y una observación del medio sobre lo que falta, no sobre el presidente:
    "Hasta el momento, Presidencia no informó si el descuento recibido formó parte de una política
    comercial habitual de la empresa o si se trató de una condición particular para la operación".
    Es constatación, no valoración; neutral con el mismo umbral que las demás.

- medio: el-pais
  url: https://elpais.com.uy/informacion/politica/descuento-de-us-25-000-a-camioneta-de-orsi-compra-esta-ajustada-al-codigo-de-etica-publica-dice-jorge-diaz
  titulo: >-
    Descuento de US$ 25.000 a camioneta de Orsi: compra "está ajustada al código de ética pública",
    dice Jorge Díaz
  fecha: 2026-05-28
  evento: "propuesto: descuento-camioneta-orsi-2026"
  politico: orsi
  tono: neutral
  justificacion: >-
    Es la única de las tres notas del caso que usa condicional para el hecho no probado: "El
    mandatario habría recibido un descuento de US$ 25 mil dólares por adquirir dicho vehículo".
    Titula con la defensa del gobierno y le da espacio completo, y después expone el pedido de
    informes opositor con sus preguntas. Sin frase propia del medio que valore al presidente.
```

**Eventos propuestos.** Ninguno de los tres existe en `content/eventos/`:

- `balance-ancap-2024` — la difusión del balance 2024 de Ancap y la conferencia del 25/04/2025. Conviene crearlo
  como serie por ejercicio (`balance-ancap-<año>`) para que sirva igual a cualquier gobierno: la disputa por los
  números de Ancap es recurrente y ya tiene registros de 2015, 2019 y 2024 en este corpus.
- `descuento-camioneta-orsi-2026` — la compra del vehículo y su cobertura. Si se crea, el nombre no debe
  prejuzgar: "compra del vehículo presidencial y declaración jurada de 2025" describe el hecho sin afirmar el
  descuento, que es justo lo que está en discusión.
- `rendicion-de-cuentas-asamblea-general-2023` — lo propuso el crítico gemelo y lo reuso tal cual para que los
  dos lotes no creen dos slugs para el mismo hecho.
