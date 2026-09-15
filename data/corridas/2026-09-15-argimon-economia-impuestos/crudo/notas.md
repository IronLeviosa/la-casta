# Notas — Argimón / economía/impuestos / 2026-09-15

## Resumen del hallazgo

Búsqueda exhaustiva y simétrica (mismo esfuerzo que se aplicaría a cualquier político sobre
cualquier tema): corpus (~20 consultas), web (~35 búsquedas), sitemap de El País (2 corridas de
`pnpm descubrir`, período 2019-06 a 2025-03 completo), diarios de sesiones del Parlamento y
biografía oficial. No apareció una sola cita textual de Beatriz Argimón, en 1989-2026, fijando
una posición propia sobre creación, aumento, rebaja o exoneración de un impuesto o tasa. Por eso
`declaraciones.yaml`, `promesas.yaml`, `menciones.yaml` y `chequeos.yaml` de esta corrida están
vacíos: no hay una cita de la que nazcan giros, promesas o chequeos.

Esto es consistente con su trayectoria: Directora de Iname (1990-1995), diputada con comisiones
de Educación y Cultura y de Ordenamiento Territorial (nunca Hacienda), y vicepresidenta con un rol
constitucional de presidenta del Senado y de la Asamblea General, que por diseño modera el debate
en lugar de participar en él. En los tres momentos fiscales más importantes del gobierno 2020-2025
(impuesto Covid a sueldos y pasividades, exoneración de IVA al asado, rebaja de IRPF/IASS) su
presencia documentada es siempre procedimental (preside, tramita el mensaje del Poder Ejecutivo,
pide que se vote) y nunca de fondo. Quienes fijan posición sobre impuestos en esas mismas fuentes
son Lacalle Pou, Arbeleche, u otros senadores.

## candidatos_giro

Ninguno. No hay declaraciones de Argimón sobre el tema; sin declaraciones no hay pares para
comparar.

## hipotesis

- **Sesiones extraordinarias de Diputados del 18/10/2001 y el 3/9/2002** (plena crisis financiera
  de 2002, con paquetes tributarios de urgencia). Aparecieron en una búsqueda
  `site:parlamento.gub.uy` cruzando "Beatriz Argimón" e "impuesto", pero no pude leer el texto: los
  enlaces `legislativo.parlamento.gub.uy/temporales/…` fallaron (ver `verificacion_manual`) y no
  encontré la copia estable equivalente en la Hemeroteca (`biblioteca.parlamento.gub.uy/.../
  sesionescrr/`): la cobertura de Wayback para esa carpeta es muy dispareja (documentos de 1917,
  1927, uno de 2003-11-11, y recién de nuevo en 2023-2024; nada de 2001-2002). Hipótesis: como
  diputada del Partido Nacional, entonces socio de gobierno («Coincidencia Nacional» hasta
  noviembre de 2002), es posible que haya votado alguno de los paquetes tributarios de la crisis,
  pero no puedo confirmarlo ni descartarlo sin el texto. Un investigador con más turnos podría
  buscar el número de sesión exacto directamente en el buscador de `parlamento.gub.uy` (no solo en
  Wayback) para ubicar el PDF correcto.
- **Sesiones de Diputados de 2005** (01/06, 22/02, 08/12): aparecen citas de su nombre en una
  búsqueda de corpus sin filtro de fecha, pero los fragmentos visibles son de trámite (lista de
  presentes, o un orador dirigiéndose a ella como presidenta de mesa ese día), no palabras suyas
  sobre impuestos. No llegué a leer los documentos completos por acotar el alcance; queda como
  hipótesis de baja probabilidad, no confirmada.
- Sus libros «Sin pedir permiso» (2007) y la biografía autorizada «Aquí y ahora» (2021) podrían
  tener comentarios retrospectivos sobre votos económicos de su etapa como diputada, pero el texto
  de esos libros no es accesible con las herramientas de esta corrida.

## casos_vistos

- Caso Penadés (entonces senador, Partido Nacional; denuncias de abuso sexual): Argimón comentó el
  caso varias veces como titular del Partido Nacional y vicepresidenta.
  https://www.elpais.com.uy/informacion/politica/beatriz-argimon-dice-que-caso-penades-es-fuerte-y-removedor-y-repercute-en-la-sociedad-y-el-partido (2023-04-07)
  https://www.elpais.com.uy/informacion/politica/penades-envio-carta-a-argimon-y-reitero-pedido-de-que-su-desafuero-se-vote-en-forma-inmediata (2023-05-31)
  https://www.elpais.com.uy/informacion/politica/caso-penades-argimon-destaco-entereza-e-independencia-de-fiscal-y-resalto-a-quienes-se-animaron-a-denunciar (2023-10-11)
- Desafuero de Manini Ríos (Cabildo Abierto, caso vinculado a testimonio sobre operativo militar de
  los años 70): https://www.elpais.com.uy/informacion/politica/desafuero-a-manini-rios-argimon-explica-que-son-los-fueros-parlamentarios-en-su-podcast
- Caso Astesiano (jefe de seguridad presidencial, venta de pasaportes/espionaje, 2022): Argimón lo
  calificó de "un gran traidor". https://www.elpais.com.uy/informacion/politica/lo-unico-claro-es-que-fue-un-gran-traidor-dijo-beatriz-argimon-sobre-astesiano (2022-12-22)
- Caso Marset (pasaporte entregado a narcotraficante prófugo, implica a cancillería e Interior):
  https://www.elpais.com.uy/informacion/politica/argimon-dice-que-entrega-de-pasaporte-a-marset-sorprendio-y-espera-explicaciones-de-ministros

## verificacion_manual

- https://legislativo.parlamento.gub.uy/temporales/20011018D0066_SSN2079674.html — `pnpm fuente`
  devolvió `error: fetch failed` (enlace efímero del Parlamento; sin copia en Wayback).
- https://legislativo.parlamento.gub.uy/temporales/20020903D0050_SSN1266052.html — mismo error.
- https://legislativo.parlamento.gub.uy/temporales/20050517D0020_SSN553289.html — mismo error.

## cobertura_del_periodo

- **1989-2000** (escribana, funcionaria de OSE y BHU, Edil de Montevideo 1989-1990, Directora del
  INAME 1990-1995): ninguno de estos cargos tiene competencia fiscal; no hay una "campaña previa al
  primer mandato" electivo propiamente dicha antes de 2000 (su primer cargo por elección fue Edil
  en 1989, sin campaña presidencial/legislativa de por medio). No se encontró contenido sobre
  impuestos y no se buscó exhaustivamente en esta franja por ser institucionalmente improbable
  (nota, no silencio: si se quiere cobertura total de este tramo, falta buscarlo con la misma
  vara que el resto).
- **2000-2010** (Representante Nacional, dos períodos): cubierto con corpus y web; comisiones
  documentadas por su biografía oficial (Educación y Cultura, Ordenamiento Territorial), ninguna
  económica o de Hacienda. Hueco real: las sesiones extraordinarias de 2001-2002 (crisis) no
  pudieron leerse (ver `hipotesis` y `verificacion_manual`).
- **2019-2020** (campaña vicepresidencial): cubierto con búsquedas amplias sobre debates,
  propuestas económicas y entrevistas de campaña; su agenda pública documentada es género, juventud
  e industrias creativas. El compromiso "no vamos a aumentar los impuestos" de la fórmula
  Lacalle Pou-Argimón se documenta sistemáticamente como dicho de Lacalle Pou, no de Argimón.
- **2020-2025** (vicepresidenta, presidenta del Senado y la Asamblea General): cubierto en
  profundidad, incluidos los tres momentos fiscales más salientes del gobierno: impuesto Covid a
  sueldos públicos y pasividades altas (2020), exoneración de IVA al asado (marzo 2022) y a 19
  productos por la emergencia hídrica (2023), y rebaja de IRPF/IASS anunciada en la Rendición de
  Cuentas (marzo 2023). Se leyeron los diarios de sesiones del Senado del 8/9/2020 y el 3/5/2022:
  en ambos, el contenido tributario sustantivo es el mensaje del Poder Ejecutivo o el debate entre
  otros senadores; Argimón aparece solo presidiendo. Se corrió `pnpm descubrir elpais.com.uy` dos
  veces cubriendo todo el período (2019-06/2025-03 y el tramo final 2023-11/2025-03): ningún título
  cruza su nombre con un término de impuestos.
- **2025-presente** (embajadora ante la Unesco y la OCDE): cubierto; coordina una reunión de alto
  nivel de la OCDE en la que, según la prensa, uno de los temas de fondo del acercamiento
  Uruguay-OCDE es el Impuesto Mínimo Global, pero las citas textuales de Argimón encontradas
  (Búsqueda, Ámbito) son sobre la logística del encuentro y la relación institucional con la OCDE,
  no sobre contenido tributario.

## objeciones_al_brief

Ninguna. El brief pide cobertura simétrica del período completo (campaña, gobierno, oposición,
posmandato) y no direcciona la búsqueda hacia ningún partido o persona. El resultado —cobertura
casi nula de este tema en esta persona— es un hallazgo genuino de la búsqueda, no un efecto de
cómo está escrito el brief: apliqué el mismo esfuerzo (corpus + decenas de búsquedas web + sitemap
de El País + sesiones parlamentarias + biografía oficial) que aplicaría a cualquier otro político
sobre este mismo tema.

## medios_faltantes

Ninguno. Los medios usados (busqueda, el-pais, ambito, el-observador, la-diaria, parlamento) ya
están en la tabla del brief.

## referentes_faltantes

Ninguno (no hay menciones en esta corrida).

## pistas cruzadas anotadas

Al leer el diario de sesiones/la nota sobre la exoneración de IVA al asado (22/3/2022) aparecieron
declaraciones sustantivas de otros senadores sobre impuestos, ajenas a esta corrida:
- `<CORPUS_DIR>/corpus/pistas/bergara-mario.yaml` (Mario Bergara, Frente Amplio).
- `<CORPUS_DIR>/corpus/pistas/olesker-daniel.yaml` (Daniel Olesker, Frente Amplio).
