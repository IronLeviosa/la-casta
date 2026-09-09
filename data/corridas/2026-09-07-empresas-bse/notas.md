# Notas — BSE (Banco de Seguros del Estado)

## candidatos_giro
No aplica: esta corrida es de una empresa pública, no de un político con declaraciones en el
tiempo.

## hipotesis
- La prensa (El Observador, marzo 2022) reportó que el BSE cerró 2021 con "ganancia récord de
  US$ 143 millones". No se registra como discrepancia ni como chequeo porque la nota nunca se abrió
  en ninguna de las dos corridas (ver `## resumen_vs_primaria` de la vuelta 1: el crítico ya lo marcó
  como O-18 y en esta vuelta se retiró la afirmación en vez de sostenerla sin haber leído la fuente).
- Cuota de mercado histórica del BSE año por año (2016-2024): se consiguió un solo punto reciente,
  bien sourceado (71,2% / 67,7% sin accidentes de trabajo, diciembre de 2025, página propia de
  Transparencia del BSE) y el punto de 2015 quedó descartado (ver `## vuelta 2`, O-2). Falta la
  serie intermedia; el BCU publica "Primas Emitidas Netas de Anulaciones" por compañía y podría
  reconstruirse, pero no se intentó en esta corrida por presupuesto de tiempo.
- `transferencias_al_estado` de 2023: hay certeza de que hubo transferencias a Rentas Generales (dos
  notas de la OPP citadas en la Nota 20.3 de los estados contables), pero no se consiguió el Estado
  de Evolución del Patrimonio de ese año con el monto en pesos. Motivo: la página de transparencia
  del BSE solo lista el documento del año corriente (dinámica); Wayback no tiene una copia capturada
  de esa página cuando el documento de 2023 estaba vigente y no se armó el rastreo con la Hemeroteca/
  CDX para encontrar el nombre exacto del archivo. Es un buen candidato para una próxima vuelta:
  buscar `estevpat` en el propio BCU con otros nombres de archivo, o el link directo del sitio del
  BSE en algún snapshot de 2024.
- 2005-2014: el inventario y el sitio vivo del BCU muestran que la serie de estados contables del
  BSE (estres/estsit/resram) llega al menos hasta esos años (comprobado por el crítico y por esta
  corrida para 2005 vía HTTP 200 antes de leer el contenido), igual que ANCAP, UTE y ANTEL, cuyas
  fichas ya se extendieron hacia atrás en correcciones posteriores a su corrida original. Esta
  vuelta 2 se ciñó al rango 2015-2024 del brief (más 2025 porque ya estaba cargado) por presupuesto
  de tiempo: cargar 10 años adicionales con el mismo nivel de detalle (resultado, deuda,
  capitalización, 7-8 segmentos, cotización) es un trabajo del mismo tamaño que el que ocupó esta
  vuelta entera. Queda documentado para una corrección futura, con el mismo criterio de simetría que
  ya se aplicó a las otras tres empresas.

## casos_vistos
Ninguno. No se investigaron casos judiciales (no lo pide el brief) y no apareció ninguno al
buscar balances, monopolio, Ley 16.074 o los diarios de sesiones de 1996-1997.

## verificacion_manual
Ninguna en esta vuelta: todo lo que se cita en `empresas.yaml` se leyó con `pnpm fuente` en esta
sesión y pasó `pnpm validar --red` (etapas `fuentes` y `citas`, 0 errores). El bug de `pnpm fuente`
sobre `bcu.gub.uy` sin `www.` que bloqueó la corrida anterior (O-L1 de la crítica) ya estaba resuelto
en el código antes de empezar esta vuelta (commit `99b3d54`, "HTTP: ante un fallo de red en un host
sin www se prueba una vez con www"), así que no hizo falta tocar la herramienta.

## cobertura_del_periodo
| Año | Resultado del ejercicio | Transferencias al Estado | Capitalización del Estado | Deuda financiera | Segmentos | Documento primario |
|---|---|---|---|---|---|---|
| 2015 | Sí (pesos y USD) | No (formato sin flujo de efectivo ni nota de transferencias) | Sí (cero) | Sí (cero) | Sí (7 ramos, "Vida Prev." sin desagregar) | BCU: estres/estsit/resram `reportes/*/bse20151231.*` |
| 2016 | Sí | No | Sí (cero) | Sí (cero) | Sí (7 ramos) | BCU: estres/estsit/resram `reportes/*/bse20161231.*` |
| 2017 | Sí | No | Sí (cero) | Sí (cero) | Sí (7 ramos) | BCU: estres/estsit/resram `reportes/*/bse20171231.*` |
| 2018 | Sí | No | Sí (cero) | Sí (cero) | Sí (7 ramos) | BCU: estres/estsit/resram `reportes/*/bse20181231.*` |
| 2019 | Sí | No | Sí (cero) | Sí (cero) | Sí (8 ramos, ya separa Renta Vitalicia de Colectivo) | BCU: estres/estsit/resram `reportes/*/bse20191231.*` |
| 2020 | Sí | No | Sí (cero) | Sí (cero) | Sí (8 ramos) | BCU: estres/estsit/resram `reportes/*/bse20201231.*` |
| 2021 | Sí | Sí (cero) | Sí (cero, NUEVO) | Sí (cero, NUEVO) | Sí (8 ramos, ya cargado en vuelta 1) | BCU `957_20211231.*` + Informe de Gobierno Corporativo |
| 2022 | Sí | Sí (cero) | Sí (cero) | Sí (cero) | Sí (8 ramos, NUEVO) | BCU `957_20221231.*` + Estados Contables BSE |
| 2023 | Sí | No (hubo transferencia, sin monto: ver hipótesis) | Sí (cero, NUEVO) | Sí (cero, NUEVO) | Sí (8 ramos, NUEVO) | BCU `957_20231231.*` |
| 2024 | Sí | Sí ($ 4.157,1 millones, NUEVO) | Sí (cero) | Sí (cero) | Sí (8 ramos, NUEVO) | BCU `957_20241231.*` + Estados Contables BSE |
| 2025 | Sí (fuera del rango del brief) | No | Sí (cero, NUEVO) | Sí (cero, NUEVO) | Sí (8 ramos, NUEVO) | BCU `957_20251231.*` |

`impuestos_pagados` queda sin cargar en los once años, a propósito: ver `## vuelta 2`, fila O-4.

## medios_faltantes
Los tres medios que hacían falta se escribieron en `inbox/empresas/bse/2026-09-07/medios/`:
- `bse.yaml` (`bse.com.uy` e `institucional.bse.com.uy`, el sitio institucional del BSE; `empresa: bse`).
- `cronicas.yaml` (`cronicas.com.uy`, semanario económico; `grupo: cronicas`, `alineamiento: sin_datos`).
- `prensamundo-com.yaml` (directorio de medios, usado solo para el dato factual de fundación/dirección
  de Crónicas; `alineamiento: sin_datos`).
`garciahelgueraseguros` ya no hace falta: la comparación de cuota de mercado que lo citaba se
reemplazó por la página propia de Transparencia del BSE (ver `## vuelta 2`, O-2).

## objeciones_al_brief
Ninguna nueva en esta vuelta. La vuelta 1 no encontró objeciones de Regla 0 y esta tampoco: la
crítica pidió el mismo esfuerzo para los dos lados del monopolio, lo mismo que el brief, y así se
hizo (una búsqueda de diario de sesiones sirvió para los dos lados a la vez, más AEBU del lado a
favor y Ceres/Exante del lado en contra, ambas sin resultado utilizable, buscadas con el mismo
esfuerzo).

## vuelta 2

Corro en Sonnet (`claude-sonnet-5`) por la regla de modelos del mantenedor (2026-09-07): el
investigador no es un rol caro. Resuelvo la crítica `data/corridas/2026-09-07-empresas-bse/critica.md`
(Opus, 2 `bloquea` + 18 `corregir` + 7 `aviso`) sobre el lote `inbox/empresas/bse/2026-09-07/`.

| Objeción | Severidad | Qué hice |
|---|---|---|
| O-1 (finanzas 2015-2019 "no existen") | bloquea | Cargados los cinco años completos desde el sitio vivo del BCU (`reportes/estres`, `estsit`, `resram`, carpeta heredada `bse<AAAA>1231.*`): resultado del ejercicio, capitalizaciones, deuda financiera y 7 segmentos por año. |
| O-2 (comparación de un corredor, 35% calculado) | bloquea | Se sacó la fila de `garciahelgueraseguros`. La reemplaza una comparación de la propia página de Transparencia del BSE (dic-2025): 71,2% del mercado, 67,7% sin Accidentes de Trabajo, con la salvedad ya incorporada en el propio indicador (no un cálculo mío). |
| O-3 (segmentos solo en 2021) | corregir | `resram` cargado para los once años 2015-2025: 7 ramos en 2015-2018 (la planilla no separaba Vida Prev.), 8 en 2019-2025 (ya separa Renta Vitalicia de Colectivo, y de 2022 en adelante "Robo" pasa a "Hurto"). |
| O-4 (impuestos_pagados ausente en los 6 años) | corregir | Encontré el único renglón de caja que existe (Estado de Flujos de Efectivo, "Impuesto a la renta pagado", solo en el filing de 2022 con comparativo 2021: -171.360 y -184.560 pesos) y decidí **no** cargarlo como `impuestos_pagados`: es un residuo neto de los anticipos de IRAE del ejercicio, no el total de tributos que pide el diccionario, y sería visualmente engañoso en un gráfico junto a los otros años (implicaría que el BSE paga casi nada de impuestos cuando el devengado de "Impuestos, tasas y contribuciones" + "Impuesto al patrimonio" ronda los 250 a 400 millones de pesos anuales, según los años en que se pudo leer esa nota: 2015 $256,6M+$160,2M; 2023 $328,4M+$5,1M; 2024 $406,8M+$5,6M). Me aparto de la acción sugerida por la crítica (cargar el renglón de caja) porque, a diferencia de otros años donde ese renglón sí representa el total, acá es un residuo que distorsiona más de lo que informa; lo dejo documentado con las cifras devengado para quien decida lo contrario. |
| O-5 (transferencias/capitalización/deuda en 2 de 6 años) | corregir | Capitalizaciones y deuda financiera cargadas (en cero, con cita) para los once años. Transferencias: 2021 y 2022 en cero (ya estaban/se agregó 2022); **2023 y 2024 no eran cero**: hubo transferencias a Rentas Generales ambos años (Notas OPP 20.3), y para 2024 se consiguió el monto exacto ($ 4.157,1 millones, Estado de Evolución del Patrimonio del BSE) — un dato que la ficha original no tenía y que corrige la imagen de "el BSE no transfiere nada al Estado" que dejaban los años en cero. Para 2023 el monto queda pendiente (ver hipótesis). |
| O-6 (resultado colgado del informe institucional, no del estado de resultados) | corregir | Fuente principal movida al `estres` del BCU en todos los años; el informe/PDF institucional queda como fuente secundaria donde ya estaba citado. |
| O-7 (cotización deducida, no declarada) | corregir | Reemplazada en los once años por la cotización interbancaria de cierre ("Dólar USA Fondo BCU") del último día hábil de diciembre de cada año, publicada por el BCU en su Mesa de Cambios (`Estadisticas-e-Indicadores/Promedio Mensual de Arbitrajes`), que es la fuente a la que remite la Nota 2.2 del propio BSE sin publicar el número. Los USD resultantes están dentro de 0,5% de los que ya estaban cargados, lo que confirma que el cálculo implícito anterior era razonable pero no era lo que pedía el diccionario. |
| O-8 (nota de 2024 dice que faltan notas/segmentos que sí existen) | corregir | Reescrita: 2024 tiene transferencias con monto, capitalización, deuda y 8 segmentos, todos con fuente del BCU o del propio BSE. |
| O-9 ("arrastra por error") | corregir | El `concepto` de 2020 ya no atribuye un error al BSE; se limita a decir que la introducción del informe reporta el patrimonio en dólares a diciembre de 2019, y por eso el USD de 2020 se calcula acá con la cotización de cierre del BCU. |
| O-10 (monopolio: un solo argumento a favor, sin Parlamento) | corregir | Se agregó un argumento de cada lado desde el diario de sesiones de la Cámara de Representantes de 1996 (Diputado Álvarez, a favor de mantener el monopolio de accidentes de trabajo por ser un servicio deficitario; Diputado García don Alem, en contra, reconociendo que la desmonopolización de 1993 bajó los precios). Se buscó también AEBU (un hit, tangencial, no se usó) y Ceres/Exante (sin resultado), documentado en `consultas.jsonl` con el mismo esfuerzo que el lado a favor. |
| O-11 (Veiroj/AUDEA sin el matiz) | corregir | Se agregó el segundo párrafo de la misma nota de Ámbito como una segunda fuente del mismo argumento: "lo que nos interesa antes que nada es igualar las condiciones de competencia. Si es desmonopolizando, mejor…". |
| O-12 (CIPU/CAPU es un episodio, sin la respuesta del BSE) | corregir | Se sacó el argumento. No se lo reemplazó por la respuesta del BSE porque esa respuesta también es parte del mismo episodio tarifario, no del debate de diseño; con los dos argumentos parlamentarios agregados, el conteo de diseño queda 2 a 2. |
| O-13 (Ley 18.401 art. 8, cita de índice sin contenido) | corregir | Se sacó la norma Ley 18.401 de `monopolio.normas` (el art. 8 de esa ley solo renombra un capítulo de la Ley 16.696, no tiene texto sustantivo propio en IMPO). Se agregó en su lugar, al mismo ítem de Ley 16.426, el artículo 2 ("autorizadas por el Poder Ejecutivo, con el asesoramiento y control de la Superintendencia de Servicios Financieros"), que sí dice con texto propio quién controla al BSE. |
| O-14 (hito Ley 18.243, la cita no dice "deroga") | corregir | Se agregó el artículo 21 ("Derógase la Ley N° 3.935…") como segunda fuente del hito y de `monopolio.normas[3]`. |
| O-15 (notas y conceptos demasiado largos) | corregir | Los tres `nota` de más de 300 caracteres (2015, 2022, 2023) se reescribieron a una oración; el razonamiento largo sobre la columna "Accidentes" del resram y el detalle del renglón de caja quedaron acá, en `notas.md`, no en la ficha. Todos los `concepto` de segmentos y de resultado son una oración. |
| O-16 (medio partido en dos) | corregir | Un solo medio `bse` con `dominios: [institucional.bse.com.uy]`; todas las fuentes usan `medio: bse`. |
| O-17 (hitos pobres para 114 años de historia) | corregir | Se agregaron tres hitos: Ley 7.975 de 1926 (modifica la Carta Orgánica), Ley 8.416 de 1929 (habilita al BSE a operar con gobiernos departamentales en vivienda) y la constitución del Fondo de Fomento de la Rehabilitación de Trabajadores Discapacitados en 2021 ($ 360.405.800, Art. 68 Ley 16.074). Se sacó el hito de Ley 18.401 por el mismo motivo que O-13. |
| O-18 (hipótesis "verificado contra prensa" sin haber abierto la nota) | corregir | Se retiró esa afirmación de `notas.md`; con O-7 resuelto (cotización oficial en vez de deducida), esa verificación ya no hacía falta. |
| A-1 (Ley 3.935 citada por su sumario) | aviso | Sin cambios: ya estaba declarado con honestidad en el `titulo`. |
| A-2 (Ley 7.975 vs Ley 7.915) | aviso | Sin cambios: es una divergencia entre dos documentos oficiales, ambos citados literalmente; se usó "Ley 7.975" (IMPO) para el hito porque es la fuente primaria de la norma, y se dejó "Ley 7.915" donde ya estaba citada la Nota 1.1 del BSE, sin "corregir" una cita ajena. |
| A-3 (quiebre de taxonomía de ramas) | aviso | Declarado en `nota` del segmento Incendio de 2022 (dónde empieza el cambio: "Robo"→"Hurto", se agregan "Varios" y "Todo Riesgo Operativo", desaparece "Invalidez"). |
| A-4 (2025 fuera de rango) | aviso | Se resolvió solo al resolver O-1: ya no hay asimetría, el rango es simétrico hacia atrás y hacia adelante respecto de lo pedido. |
| A-5 (monopolio de hecho en renta vitalicia sin argumentos) | aviso | No se agregaron argumentos nuevos por presupuesto de tiempo; queda en hipótesis para una próxima vuelta. |
| A-6 (que_hace sin el art. 3 de la Ley 18.243) | aviso | Agregado como tercera fuente de `que_hace_fuentes`. |
| A-7 (mismo defecto en ancap/antel/ute) | aviso | No corresponde a esta ficha; sigue igual en las otras tres. |
| O-L1 (bug `www.` en `pnpm fuente`) | corregir (herramienta) | Ya estaba resuelto en el código (commit `99b3d54`) antes de empezar esta vuelta; se comprobó que `pnpm fuente` baja `bcu.gub.uy` sin problema. |
| O-L2 (filtro CDX no encontraba años viejos) | corregir (método) | No hizo falta Wayback para los años viejos: el sitio vivo del BCU responde directamente con la convención de nombre `bse<AAAA>1231.*` para 2015-2020. |
| O-L3 (cobertura y simetría entre fichas) | corregir | Resuelto para 2015-2025; 2005-2014 queda documentado en `## hipotesis` como pendiente, con el mismo criterio de simetría que llevó a extender ANCAP/UTE/ANTEL hacia atrás en correcciones separadas. |

### Sobre la columna "Accidentes" del resram (detalle movido desde la ficha)
La planilla tiene dos columnas parecidas: "Accidente" (dentro del bloque Vida, un producto de
seguro de vida con cobertura de accidente) y "Accidentes" (una rama aparte). La que corresponde al
monopolio legal de accidentes de trabajo y enfermedades profesionales (Ley 16.074) es la segunda:
la Nota 1.2 de los estados contables de cada año describe ese ramo como monopolio legal aparte de
vida y de los ramos generales, y así se usó en los once años cargados.
