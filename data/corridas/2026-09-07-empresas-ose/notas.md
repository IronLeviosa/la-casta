# Notas — OSE (corrida 2026-09-07-empresas-ose)

Segunda vuelta (investigador), sobre el lote que dejó un investigador anterior interrumpido a mitad
de tarea y la crítica de Opus en `critica.md`. Este archivo reemplaza la versión anterior de
`notas.md` (la corrida anterior no había llegado a escribirla); lo que sigue refleja el estado
después de resolver las objeciones de investigación.

## candidatos_giro
(No aplica: esta corrida es de la colección `empresas`, no de declaraciones de un político.)

## hipotesis
- No se pudo determinar si en 2021 y 2022 OSE efectuó transferencias a Rentas Generales: en ambos
  balances el texto extraído no llega a incluir esa nota completa (ver `verificacion_manual`).
  Motivo: extracción de PDF incompleta, no falta de búsqueda.
- El segmento "Otros" de 2019 (resultado neto $ 734.839.367) incluye mayormente un "otros
  resultados" de $ 728.287.262 que el balance 2020 no explica en el texto disponible; la Nota 30 de
  los Estados Financieros de 2021 de OSE podría atribuirlo a una corrección del Impuesto a la Renta
  de 2018-2019, pero esa nota no se leyó en esta corrida y el registro no afirma esa causa. Sigue
  pendiente para quien tenga tiempo de abrir ese documento.
- El campo `precios_vs_paridad` del esquema no tiene equivalente para OSE (el agua no es un bien
  transable con paridad de importación); se omitió el campo en vez de forzar un dato que no existe.
  El crítico confirmó que esta es la decisión correcta.

## casos_vistos
- Proyecto Arazatí (ex Neptuno): en 2024, la Comisión Nacional en Defensa del Agua y la Vida y la
  organización Tucu Tucu obtuvieron una medida cautelar del juez Alejandro Recarey que frenó el
  inicio de la construcción, por entender que había base para suponer una privatización parcial del
  servicio de agua potable (violación del artículo 47). El Tribunal de Apelaciones revocó después
  esa sentencia. No se investigó este caso judicial (fuera del alcance del brief); se documentan acá
  solo los argumentos políticos e institucionales de las partes, no el litigio. Ver
  `www.ambito.com/uruguay/proyecto-arazati-ose-apelo-el-fallo-del-juez-alejandro-recarey-n6032574`
  y `www.montevideo.com.uy/Noticias/Proyecto-Arazati-Tribunal-de-Apelaciones-revoco-la-sentencia-que-freno-la-construccion-uc907133`
  (ninguna de las dos URLs se leyó con `pnpm fuente`; se citan tal como aparecieron en resultados de
  búsqueda de la corrida anterior).

## verificacion_manual
- `https://www.ose.com.uy/sites/default/files/2026-04/ose_estados_separado_31_12_17.pdf`: el texto
  extraído termina en la Nota 10.4 y no incluye la Nota 10.5 con el resultado neto propio de 2017.
  El resultado de 2017 se tomó de la columna comparativa del balance 2018 (documento_previsible,
  resuelto).
- `https://www.ose.com.uy/sites/default/files/2026-04/ose_eeff_al_311221_separado_e_informes_de_auditoria.pdf`
  (balance 2021): el texto extraído no llega a la nota de Transferencias a Rentas Generales de ese
  año. No se pudo determinar si hubo transferencia en 2021.
- `https://www.ose.com.uy/sites/default/files/2026-04/OSE_SEPARADOS_2022_compilado.pdf` (balance
  2022): la Nota 5.7 "Deudas financieras" solo trae, en el texto extraído, la tabla al 31/12/2021;
  tampoco se encontró la nota de Transferencias a Rentas Generales de 2022. La deuda financiera de
  2022 se resolvió con la Nota 8.1 (columna comparativa) del balance 2023 — ver más abajo, ya no es
  un hueco. Las transferencias de 2022 siguen sin dato.
- `https://www.ose.com.uy/sites/default/files/2026-04/OSE_2023_EEFF_Separados.pdf` (balance 2023):
  la Nota 5.7 no trae, en el texto extraído, un renglón de "Total deudas financieras" por
  institución. Resuelto con la Nota 8.1 del mismo balance (ver `finanzas` 2023).
- `https://www.ose.com.uy/sites/default/files/2026-04/OSE_EEFF_separados_2024_e_informe_autditoria.pdf`
  (balance 2024): la Nota 5.7 trae un "Resumen de Pasivos Financieros" con las etiquetas de fila
  desplazadas respecto de las columnas numéricas (problema de extracción, no del documento). Se
  decidió no arriesgar esa cita y se resolvió con la Nota 8.1 del mismo balance, que no tiene ese
  problema y que además coincide con la suma corriente + no corriente del propio Resumen de Pasivos
  Financieros (verificado por aritmética).
- No se localizó un balance de OSE al 31 de diciembre de 2019 publicado como documento separado
  (se probó `ose.com.uy/transparencia` —HTTP 404—, el patrón de nombre de archivo de otros años, y
  el repositorio de documentos del Banco Mundial). Los datos de 2019 en este registro vienen de la
  columna comparativa del balance 2020, y así lo declara el campo `nota` del año, no solo esta
  sección.
- `https://www.cndav.uy/`: el extractor devolvió solo 29 caracteres (sitio con contenido cargado por
  JavaScript). No se pudo citar a la CNDAV desde su propio sitio.
- `https://www.ambito.com/uruguay/alvaro-delgado-arazati-no-hay-ningun-tipo-privatizacion-n5586567`:
  HTTP 410 (recurso eliminado).

## cobertura_del_periodo
- Balances con documento propio leído: 2015, 2016, 2017 (parcial, sin resultado neto propio), 2018,
  2020, 2021, 2022, 2023, 2024. Sin balance propio: 2019 (columna comparativa del balance 2020).
- `resultado_ejercicio` e `impuestos_pagados` cubren 2015-2024 (impuestos: 9 de 10, falta 2019).
  `deuda_financiera` cubre 2015-2024 completo (los tres huecos de 2022-2024 se resolvieron con la
  Nota 8.1 de los balances 2023 y 2024, que trae la deuda financiera de los cuatro ejercicios en una
  sola tabla). `transferencias_al_estado` cubre 7 de 10 años (2019, 2021, 2022 sin dato, por
  extracción incompleta del PDF, no por falta de búsqueda). `capitalizaciones_del_estado` cubre 4 de
  10 años: 2016 (la única capitalización identificada, $ 513 M del MVOTMA) y 2022-2024 (verificado
  que NO hubo capitalización nueva del Estado, comparando el renglón "Aportes Gobierno Central" de
  la Nota "Aportes a capitalizar" de los balances 2023 y 2024, que se mantiene en $ 562.887.379 sin
  cambios en esos tres años). 2015, 2017-2021 quedan sin verificar (no se abrió el Estado de
  evolución del patrimonio de esos años); dado que el renglón está congelado desde 2016 hasta 2024
  en todos los puntos verificados, es probable que tampoco haya cambiado en el medio, pero eso no
  se afirma sin haber abierto esos documentos.
- `segmentos[]` (Agua Potable / Alcantarillado / Otros) existen desde 2018; 2015-2017 no traen esa
  desagregación. El segmento "Otros" de 2018 y 2019 ya está cargado con su cita literal (antes
  faltaba). Todos los años con segmentos (2020-2024) traen en `nota` el descargo del propio balance
  sobre el prorrateo de resultados financieros y otros resultados por ingresos de explotación; 2018
  no lo trae porque se verificó (con `pnpm fuente --buscar`) que el balance 2018 efectivamente no
  incluye esa nota — no es un hueco de investigación, es una diferencia real entre balances.
- El marco legal (Ley 11.907, artículo 47) y los argumentos a favor y en contra del monopolio cubren
  desde la creación de OSE (1952) y el plebiscito de 2004 (campaña por el Sí y por el No) hasta el
  proyecto Arazatí (2022-2025). `argumentos_en_contra` ya no está vacío de posiciones sostenidas
  (ver `para_el_editor`). No se investigó la posición del gobierno de Orsi (2025-) sobre Arazatí
  porque no apareció en las búsquedas de esta corrida, centrada en el período de los balances
  (2015-2024); queda para una corrida posterior si el editor lo considera relevante.

## anios_sin_balance
- 2019: no se encontró un balance separado de OSE publicado para ese ejercicio.

## anios_sin_segmentos
- 2015, 2016 y 2017: los estados financieros de esos años informan el resultado consolidado sin
  desagregar por actividad.

## medios_faltantes
Confirmé con `pnpm validar --inbox` que, tras las correcciones de esta corrida, `empresas.yaml` cita
exactamente 7 medios: `impo`, `la-diaria`, `la-republica` (ya existen en `content/medios/`) y cuatro
que no existen todavía:

- `content/medios/ose.yaml`: `tipo: estatal`, `grupo: estado-uruguayo`, `alineamiento: estatal`, con
  `empresa: ose` apuntando a la ficha (mismo patrón que `content/medios/ancap.yaml`). Es el
  publicador de los 9 estados financieros y el 90 % de las fuentes del lote.
- `content/medios/bid.yaml`: `https://publications.iadb.org/` — `tipo: estatal`, **grupo propio**
  (no `estado-uruguayo`: es un organismo internacional, no uruguayo, y compartir grupo con fuentes
  uruguayas falsearía el conteo de "distinto grupo" de un `reportado`), `alineamiento: estatal`.
- `content/medios/aderasa.yaml`: `https://aderasa.org/` — asociación de entes reguladores de agua
  potable y saneamiento de las Américas (organismos públicos miembros); `tipo: estatal`,
  **grupo propio** (`aderasa`), `alineamiento: estatal`. El informe de benchmarking que se cita lo
  elabora, por encargo de ADERASA, la reguladora peruana SUNASS.
- `content/medios/foco-economico.yaml`: `https://focoeconomico.org/` (dominio con el que se citó:
  `dev.focoeconomico.org`, un subdominio de staging del mismo sitio) — blog colectivo de economistas
  latinoamericanos (el autor citado, Juan Dubra, es profesor de la Universidad de Montevideo);
  `tipo: portal`, grupo propio (`foco-economico`), `alineamiento: sin_datos` (no encontré evidencia
  de alineamiento partidario del blog; es un espacio de opinión académica, no de un partido). Esta
  es la fuente que reemplaza a `redes-org-uy` en `argumentos_en_contra` — ver el punto siguiente.

**Corrección respecto de la nota anterior:** `content/medios/redes-org-uy.yaml` **ya no hace falta**.
El crítico bloqueó el argumento que citaba a REDES-AT (no era un argumento en contra del monopolio,
sino una imputación de lobby a terceros) y en esta corrida se reemplazó por dos argumentos que sí
sostienen una posición contraria a la exclusividad estatal (Jorge Batlle en campaña por el No en
2004, y Juan Dubra sobre eficiencia comparada en Foco Económico). `redes.org.uy` no aparece más en
`empresas.yaml`, `cobertura.yaml` ni `discrepancias.yaml` de este lote.

`elpais.com.uy`: no se corrió `pnpm descubrir elpais.com.uy` en esta corrida (herramienta no
disponible para este rol en la sesión anterior; en esta segunda vuelta el foco fue resolver las
objeciones puntuales de la crítica, no reabrir cobertura general). Si el editor lo considera
necesario, valdría la pena correrlo para el balance de OSE, la crisis hídrica de 2023 y Arazatí.

## objeciones_al_brief
Ninguna nueva. La corrida original ya declaró que el brief pide el mismo esfuerzo para los dos
lados del monopolio y no viola la Regla 0. Una precisión sobre el resultado de esta segunda vuelta:
el crítico tenía razón en que los dos argumentos "en contra" originales (Delgado negando privatizar
Arazatí, y REDES-AT imputando lobby a terceros) no eran argumentos contra el diseño del artículo 47.
Se reemplazaron por dos que sí lo son, buscando con el mismo esfuerzo que el lado a favor: la
posición de Jorge Batlle (presidente en ejercicio, campaña por el No al plebiscito de 2004, LR21) y
la de Juan Dubra (economista, comparación de eficiencia de facturación OSE vs. privadas en
Maldonado, Foco Económico). Además se hicieron dos búsquedas adicionales en esta segunda vuelta (CED
y Cámara de la Construcción) para ver si había un tercer argumento contemporáneo más sólido que
sostener; ninguna de las dos dio un resultado que fuera sobre el diseño del monopolio (y no sobre
Arazatí en particular), así que no se agregó un tercer ítem. Con dos argumentos de cada lado, cada
uno con fuente identificable y buscado con el mismo esfuerzo, la sección queda simétrica.

## resumen_vs_primaria
(No aplica: no se registraron declaraciones individuales de un político en esta corrida.)

## para_el_editor

Lo que sigue es trabajo de criterio (tier, `resumen`, `hitos[]`, reestructuración de `alcance`) que
no me corresponde como investigador; dejo acá las fuentes ya leídas en esta corrida y en la
anterior para que no haya que releerlas.

**`hitos[]` (ausente, es del editor).** El crítico armó una lista de ocho hitos con fuentes que el
lote ya tiene, y las verifiqué (siguen siendo válidas tras esta segunda vuelta):
1. 19/12/1952 — creación de OSE (Ley 11.907; `creacion.fuentes` de este registro).
2. 28/09/2000 — Ley 17.277, ampliación de cometidos (citada en `monopolio.normas[1]`, Nota 1 del
   balance 2024).
3. 31/10/2004 — reforma constitucional del artículo 47, exclusividad estatal de agua y saneamiento
   (`monopolio.normas[0]`, IMPO).
4. 01/06/2005 — rescisión de la concesión a Uragua S.A. en Maldonado (`monopolio.normas[2]`,
   Resolución de Directorio 760/05, balance 2015).
5. 2018 — primer año con resultado desagregado por segmento de negocio (`finanzas[2018].segmentos`,
   balance 2018, Nota 10.5).
6. 2022 — presentación del proyecto Neptuno/Arazatí y denuncia de inconstitucionalidad de la CNDAV y
   FFOSE (`monopolio.argumentos_a_favor[1]`, la-diaria y LR21).
7. 17/11/2022 — el gobierno responde que Arazatí no es una privatización (fuente Telenoche, ya en
   `cobertura.yaml`, no en `empresas.yaml` porque el crítico bloqueó incluirlo como argumento).
8. 19/06/2023 a 23/08/2023 — emergencia hídrica metropolitana, Decreto 177/023 a Decreto 253/023
   (`finanzas[2023].nota`, Nota 11 del balance 2023).

**`monopolio.alcance` (17 líneas, sin `fuentes` propias en el esquema).** El crítico recomienda
reducirlo a 3-4 oraciones sobre qué está reservado por ley (art. 47 + Ley 11.907/17.277 + la
concesión de Maldonado rescindida en 2005) y mover el resto de la narrativa (el litigio de Arazatí,
quién dice qué) a `hitos[]` y a los `argumentos_*` que ya están cargados con fuente propia. No lo
reestructuré porque depende de decidir primero el contenido de `hitos[]`, que es del editor; dejo
la recomendación y las mismas fuentes ya citadas en `monopolio.normas` y `monopolio.argumentos_*`
alcanzan para hacerlo sin releer nada nuevo.

**Bonificaciones sociales, no exigidas por ningún campo del esquema.** Los balances traen, como
deducciones de ingresos (no como `transferencias_al_estado`), bonificaciones que reducen la tarifa a
población vulnerable: en el balance 2015, Nota 10 aprox., "Bonificación asentamientos
(497.461.962)", "Bonificación MIDES (106.653.777)", "Bonificación Maldonado (176.027.952)"; en el
balance 2020 aparecen bonificaciones equivalentes de menor magnitud. No los re-verifiqué con
`pnpm fuente` en esta corrida (ya estaban en el corpus de la corrida anterior, dentro de los mismos
balances 2015 y 2020 ya citados en `finanzas`); si el editor quiere usarlos en el `resumen`, conviene
releer esa sección del balance 2015 con `pnpm fuente --buscar "Bonificación asentamientos"` antes de
citarlos, porque yo no los cité con cita propia en esta corrida.

**Fuentes repetidas / tipo de cambio como fuente aparte.** El crítico señala que en varios años el
segundo elemento de `fuentes` de `resultado_ejercicio` es solo la cita de la cotización del dólar
("Estados Financieros ... - cotización del dólar"), y sugiere que el tipo de cambio vaya en `nota` o
en el `concepto`, no como fuente aparte, aplicando el mismo criterio a `content/empresas/ancap.yaml`.
Es una decisión de presentación/consistencia entre fichas, no de este registro solo; no la apliqué
para no tomar una decisión que afecta a otra ficha ya publicada.

**`monopolio.normas[1]` — Ley 17.277 sin cita propia.** La Nota 1 del balance 2024 nombra la Ley
17.277 junto con la 11.907 y da su fecha de promulgación (28/09/2000), pero no hay una fuente de
IMPO dedicada solo a esa ley. Si el editor quiere una cita de IMPO específica de la Ley 17.277, no
la busqué en esta corrida (no estaba entre los puntos que el brief de la segunda vuelta pedía
resolver).
