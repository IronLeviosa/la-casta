# Notas — UTE, corrida 2026-09-07-empresas-ute (segunda vuelta, investigador)

Segunda vuelta sobre el lote que criticó Opus 5. Modelo: claude-sonnet-5. Resolví las 7 objeciones que
bloqueaban, las 15 de "corregir" que son de investigación, y los 3 avisos (dos de ellos no requerían
acción). El detalle de qué se hizo con cada objeción está en el informe final que le devuelvo al agente
que me lanzó; acá dejo lo que no entra en ese resumen.

## candidatos_giro
No aplica: esta corrida es una ficha de empresa (`empresas.yaml`), no declaraciones de un político.

## hipotesis

- **Decreto de venta directa impulsado por Paganini, "rechazado" por UTE** (mencionado por Stipanicic en
  la nota de El Observador: de unos 250 clientes que podrían haber comprado directo a un generador
  privado pagando peaje a UTE, quedaron unos 20). Encontré cobertura de prensa que lo describe
  (`abogados.com.ar`, `gub.uy/presidencia` sobre "condiciones para la compraventa de energía entre
  privados") pero no llegué a abrir el decreto en IMPO ni a confirmar la cifra de 250→20 con una fuente
  primaria. Si el editor quiere este hito, hay que ubicar el decreto exacto (probablemente de 2021-2022,
  del segundo gobierno de Lacalle Pou) y cotejar la cifra.
- **AUTE, posición explícita sobre el monopolio de trasmisión y distribución (no sobre tarifas o función
  social):** busqué activamente (`site:aute.org.uy monopolio...`, `"marco regulatorio" 1997 UTE
  monopolio`, `AUTE comunicado generación privada peajes 2024 2025`) y el único artículo que parecía
  responder ("AUTE - 25 años de la aprobación del marco regulatorio", `aute.org.uy/noticias/452-25-anos-
  del-marco-regulatorio.html`) da HTTP 404 al abrirlo con `pnpm fuente`, tanto en esta sesión como
  reintentado. Los resúmenes de búsqueda (no fuentes primarias, no citables) sugieren que AUTE se opuso
  a la Ley 16.832 en 1997 y sigue defendiendo la propiedad estatal, pero no una cita textual verificable
  sobre por qué la trasmisión y la distribución deberían seguir siendo monopolio legal. Sin eso, la
  ficha queda con un solo argumento a favor centrado en el diseño legal (Exante) más el de Bentancor
  (propiedad estatal en general, ya reformulado para no sobrerrepresentarlo). Ver `## para_el_editor`.
- **MIEM, Política Energética 2005-2030:** la leí completa (buscando "monopolio", "transmisión", "UTE")
  y no defiende explícitamente la reserva legal de trasmisión/distribución; habla de cronogramas de
  ampliación de redes, no de quién debe ser el dueño. No la usé.
- **Deuda financiera separada 2015 y 2016 vía "Deuda (i)":** usé la definición de la nota de gestión de
  riesgo financiero ("deuda financiera neta de corto y largo plazo... incluye endeudamiento local, con
  el exterior, instrumentos financieros derivados y arrendamientos financieros") porque es lo único que
  encontré con capa de texto para el balance separado de esos dos años; el balance primario (Estado de
  Situación Financiera Separado) de 2015 y 2016 no tiene capa de texto extraíble en las páginas donde
  debería estar la fila "Préstamos y otros pasivos financieros" (sí la tiene el consolidado, que no usé
  por no ser comparable con 2019-2025). El editor puede querer decidir si esto es "el mismo campo" que
  años posteriores o si merece una `nota` aclarando la diferencia de método (ya dejé un `concepto` que
  lo explica).

## casos_vistos

- EEFF 2022 y 2024 (Nota 14): "existen situaciones litigiosas y procesos judiciales iniciados contra Gas
  Sayago, cuyos montos reclamados totalizan U$S 72.789.656 y $ 46.983.881" (2022) y "existen procesos
  preliminares iniciados contra Gas Sayago S.A. (en liquidación), cuyos montos reclamados totalizan
  U$S 41.894.379 y $ 34.693.726 más eventuales intereses... iniciados desde el año 2014 a 2017, sin
  haberse concretado ninguna demanda a la fecha de cierre" (2024). No es un caso de una persona
  identificable; no corresponde a `content/casos/`, es un pasivo contingente de la empresa. No
  investigado, solo anotado.
- No apareció nada nuevo sobre políticos individuales.

## verificacion_manual

- `https://portal.ute.com.uy/institucional/transparencia/estados-contables-auditados` — HTTP 404 (URL
  vieja; la correcta es `.../institucional/informacion-economico-financiera/estados-financieros-anuales-
  separados-y-consolidados-ute`, que sí funciona y fue la que usé).
- `https://www.impo.com.uy/bases/decretos-leyes/14694-1977` — HTTP 500 (el slug correcto en IMPO es
  `decretos-ley`, no `decretos-leyes`; ya usé la URL correcta).
- `https://www.aute.org.uy/noticias/452-25-anos-del-marco-regulatorio.html` — HTTP 404. Es el único
  artículo de AUTE que encontré directamente relevante al diseño legal del monopolio (25 años de la Ley
  16.832) y no pude leerlo.
- `https://www.segingenieria.com/category/indicadores/` — HTTP 404. No existe una categoría separada
  para el barómetro regional de precios; el listado en `/indicadores` no incluye un PDF descargable de
  ese informe específico, así que las comparaciones quedaron sourceadas en pv-magazine-latam (que
  publica el dato con la metodología de SEG explícita), no en un documento de SEG mismo.

## cobertura_del_periodo

- **Finanzas (`finanzas[]`):** 9 de 10 años pedidos (2015-2024) tienen datos, más 2025 (el EEFF ya está
  publicado). Solo 2017 queda sin cifras (balance escaneado sin capa de texto); documentado con `nota`.
  2018 tiene resultado, transferencias y deuda financiera (vía comparativo del EEFF 2019) pero no
  impuestos pagados (el Literal D de 2018 no tiene comparativo en ningún balance con capa de texto que
  haya podido leer).
- **Monopolio — argumentos:** 2 a favor (Exante sobre monopolio natural de redes, con la aclaración de
  que monopolio natural no implica propiedad estatal, ya no cortada; Bentancor, reformulado para no
  atribuirle una defensa específica de la reserva legal que no dijo) y 3 en contra (Stipanicic sobre el
  "monopolio de la compra", con su designación por el gobierno de Lacalle Pou y el contexto de Fenirol;
  Fraschini/Augpee sobre peajes abusivos; Exante, en el mismo informe, sobre que los peajes exceden los
  costos de UTE). Sigue habiendo más peso documental del lado Augpee/Exante que del lado estatal: busqué
  activamente AUTE y no conseguí una fuente primaria legible; el MIEM no defiende el punto específico.
  Es la misma asimetría que señaló el crítico (objeción 11), reducida pero no cerrada.
- **Cobertura temporal del brief:** el brief pedía 2015-2024; agregué 2025 porque el balance ya está
  publicado y el criterio "hasta qué año llega una ficha" debería ser el mismo para todas las empresas
  (lo señaló también el crítico, objeción 24 y objeciones al brief punto 2).

## medios_faltantes

Confirmo lo que ya había investigado el crítico (`critica.md`, objeciones al lote punto 5) y no lo
repito acá completo; agrego lo que verifiqué yo mismo esta sesión:

- `ute`: `tipo: estatal`, `grupo: estado-uruguayo`, `url: https://www.ute.com.uy/`, `empresa: ute`,
  `dominios: [https://portal.ute.com.uy]`, `alineamiento.etiqueta: estatal`. Necesario para 60+ citas.
- `augpee`: no es un medio de prensa; es la asociación gremial de generadores privados que encargó el
  informe a Exante. `tipo: portal`, `grupo: augpee`, `alineamiento.etiqueta: sin_datos` con
  justificación.
- `eltelegrafo`, `elpueblodigital`, `pv-magazine-latam`: sin cambios respecto de lo que dejó el crítico.

## para_el_editor

Fuentes ya leídas en esta sesión, organizadas por lo que resolví:

1. **`impuestos_pagados` (bloqueaba):** reemplacé el IRAE de caja por el Total del Literal E (o Literal D
   en 2015-2016 y 2019, que es el nombre que usaba la nota antes de 2020) de los estados financieros
   **separados** de cada año, con cita literal de la fila "Total" en cada balance. Para 2023 usé el
   Literal E del EEFF de 2023 separado (`...-ptg_0.pdf`), no el consolidado.
2. **`transferencias_al_estado` (bloqueaba):** un solo criterio para toda la serie, lo pagado en efectivo
   según el Literal E/F (nombre según el año) o la nota de patrimonio equivalente. Corregí la nota de
   2022 (sí hubo versión de resultados, $ 5.000.000.000, solo que se contabilizó como pasivo en 2021 y se
   pagó en 2022) y dejé una `nota` en 2021 explicando la diferencia entre lo pagado (Literal F,
   3.004.921.602) y el cargo patrimonial devengado (7.744.730.362).
3. **2015-2019 (bloqueaba):** cargué 2015, 2016, 2018 y 2019 completos (salvo impuestos 2018, ver
   arriba). 2017 queda con `nota` de una frase; el balance sigue siendo un escaneo real.
4. **2025:** cargado completo; el balance de UTE al 31/12/2025 ya está publicado.
5. **Monopolio:** extendí la cita de Exante hasta la aclaración de que monopolio natural no implica
   propiedad estatal; saqué la frase de "monopolio de la compra" de `alcance` (no está en el informe de
   Exante, viene de la columna de Stipanicic, que ya está en `argumentos_en_contra`); agregué el
   Decreto-Ley 14.694 (1977) leído en IMPO y el Decreto 276/002 (2002, vía la cita que hace Exante de su
   articulado) a `normas[]`; reescribí `alcance` con la cronología 1912→1977→1994→1997→2002. Hice
   búsquedas específicas para el lado "a favor" (AUTE, MIEM) que no dieron una fuente primaria nueva
   (ver `## hipotesis`); agregué un segundo argumento en contra citando la conclusión del propio informe
   de Exante sobre los peajes.
6. **Comparaciones:** reemplacé el barómetro de agosto de 2025 por el de junio de 2026 (el más reciente
   que encontré), partido en una fila por país más una fila de la comparación residencial completa; no
   until encontré un PDF de SEG Ingeniería publicado aparte (ver `## verificacion_manual`), así que la
   fuente sigue siendo pv-magazine-latam, que documenta la metodología de SEG explícitamente.
7. **`tipo`:** cambiado a `ente_autonomo`, igual que ANCAP; el propio balance de UTE lo dice así. Ver
   `## objeciones_al_brief`.
8. **Segmentos:** mantuve la decisión de dejar `segmentos: []` (los costos por segmento existen —Literal
   D— pero UTE dice explícitamente que los **resultados** no son atribuibles por segmento, y forzar un
   cálculo con costos habría contradicho eso). Agregué la cita de la Nota 12 como `nota` de 2024.
9. **Medios, `que_hace`, `creacion.fuentes[0].titulo`, deuda financiera separado/consolidado, hitos:**
   resueltos como se detalla en el informe final.

Todo lo anterior está en `empresas.yaml`, con `_investigacion.modelo: claude-sonnet-5` en el único
registro del archivo (el esquema de empresa no repite ese campo por sub-objeto).

## objeciones_al_brief

1. **`tipo: empresa_publica` en el encargo, contra lo que dice el propio balance de UTE ("ente
   autónomo").** Ya lo había señalado el crítico. Lo cambié a `ente_autonomo`, igual que ANCAP, para que
   el sitio no muestre dos formas jurídicas distintas para dos entes de la misma naturaleza jurídica.
   No es una cuestión de Regla 0 (no favorece a nadie): es una instrucción del brief que no coincide con
   la fuente primaria, y conviene que el criterio ("lo que dice el balance") sea el mismo para toda la
   colección de empresas.
2. **El brief pedía 2015-2024; agregué 2025** porque el balance ya está publicado por UTE
   (`portal.ute.com.uy`). Mismo razonamiento que el crítico: el criterio de "hasta qué año llega una
   ficha" debería fijarse una vez y aplicarse igual a todas las empresas, no depender de cuándo se
   escribió el brief.
3. **No encontré pedido de asimetría en el brief ni en la crítica que resolví.** El encargo pide el
   mismo esfuerzo a favor y en contra del monopolio, y las cifras se registran sin adjetivos. La
   asimetría que persiste (más peso documental del lado Augpee/Exante que del lado estatal) es de
   disponibilidad de fuentes primarias abiertas y verificables, no de ejecución sesgada: até el intento
   con AUTE y MIEM, y las búsquedas quedan en `consultas.jsonl` para que se pueda auditar el esfuerzo.
