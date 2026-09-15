# Notas — Argimón / economía/impuestos / 2026-09-15

## Resumen del hallazgo

Búsqueda exhaustiva y simétrica (mismo esfuerzo que se aplicaría a cualquier político sobre
cualquier tema): corpus (~35 consultas), web (~65 búsquedas), sitemap de El País (3 corridas de
`pnpm descubrir`, período 2009-06 a 2025-03 completo), diarios de sesiones del Parlamento (cuatro
documentos completos: dos del Senado 2020-2025 y dos de Diputados de la crisis 2001-2002), el CSV
oficial de actuación de comisiones (Hacienda y Presupuestos, dos legislaturas) y la biografía
oficial. No apareció una sola cita textual de Beatriz Argimón, en 1989-2026, fijando una posición
propia sobre creación, aumento, rebaja o exoneración de un impuesto o tasa. Por eso
`declaraciones.yaml`, `promesas.yaml`, `menciones.yaml` y `chequeos.yaml` de esta corrida siguen
vacíos: no hay una cita de la que nazcan giros, promesas o chequeos.

Esto es consistente con su trayectoria: Directora de Iname (1990-1995), diputada con comisiones de
Educación y Cultura y de Ordenamiento Territorial como miembro formal —pero con dos episodios
documentados de asistencia puntual, sin ser miembro, a la Comisión de Hacienda en temas tributarios
de alto perfil (crisis 2002 y reforma tributaria/IRPF 2006; ver `## comisiones_economicas` más
abajo)—, y vicepresidenta con un rol constitucional de presidenta del Senado y de la Asamblea
General, que por diseño modera el debate en lugar de participar en él. En los tres momentos
fiscales más importantes del gobierno 2020-2025 (impuesto Covid a sueldos y pasividades,
exoneración de IVA al asado, rebaja de IRPF/IASS) su presencia documentada es siempre procedimental
(preside, tramita el mensaje del Poder Ejecutivo, pide que se vote) y nunca de fondo. Quienes fijan
posición sobre impuestos en esas mismas fuentes son Lacalle Pou, Arbeleche, u otros senadores.

**Corrección de cobertura (2026-09-15, segunda pasada).** Un crítico revisó el lote vacío y objetó
cinco huecos de barrido. Los cinco fueron cerrados en esta pasada: (1) el tramo 2010-2019 (Directorio
del Partido Nacional y panelista de TV) quedó cubierto; (2) Brecha y La República se consultaron por
primera vez, en corpus y web, en todo el período; (3) el CSV oficial de comisiones mostró que la
biografía no es un censo completo (ver `## comisiones_economicas`); (4) el hallazgo suelto de
`consultas.jsonl` línea 37 se reprodujo y se cierra como ruido (ver `## hipotesis`); (5) las dos
sesiones de la crisis 2001-2002 que quedaban como hipótesis se leyeron enteras por la ruta estable
de la Hemeroteca y el resultado es negativo con la fuente más fuerte posible: diario de sesiones
completo, sin las palabras. El detalle de cada punto está en `## cobertura_del_periodo` y
`## hipotesis`.

## comisiones_economicas (corrección de la afirmación original)

La biografía oficial del Parlamento (única fuente que usó el lote original) lista sus comisiones
como diputada: Educación y Cultura, y Ordenamiento Territorial. De ahí salió la frase «nunca
Hacienda». Esa biografía **no es un registro completo de comisiones**: el Parlamento publica la
actuación de cada comisión por legislatura en CSV
(`parlamento.gub.uy/camarasycomisiones/representantes/comisiones/<id>/comision-actuacion/csv`), leído
en esta corrección para Hacienda (id 78) y Presupuestos (id 84), en las dos legislaturas 2000-2005 y
2005-2010 (429.819, 563.514, 154.162 y 72.244 caracteres respectivamente). Con la cabecera de
columnas confirmada (`Fecha, Nro de Acta, Id Comisión, Comisión, Presiden, Miembros, Integrantes,
Inasistencias Con aviso, Inasistencias Sin Aviso, Legisladores Con Licencia, Falta Por Plenario,
Inasistencia Por Senado, Falta Por Comisión, Delegados, "Asisten Además: ", Invitados, Secretarios,
Asuntos Entrados, Asuntos Tratados, Temas Tratados, Resoluciones`), el resultado es:

- **Hacienda (id 78): Argimón nunca aparece en las columnas de membresía formal** (Presiden,
  Miembros, Integrantes, ni las de inasistencia, que solo existen para quien es miembro). La
  afirmación «nunca integró la comisión» se sostiene en sentido estricto.
- Pero **sí aparece, dos veces, en las columnas de no-miembro**: en la columna «Delegados» del Acta
  92 (18 de setiembre de 2002, HACIENDA, asunto «Acreedores en dólares», en plena crisis financiera,
  junto a otros cuatro «delegados» ajenos a la comisión); y en la columna «Asisten Además» de una
  sesión de 2006 sobre el expediente 849/2006, «REFORMA TRIBUTARIA. REGIMEN» (el proyecto que creó
  el IRPF, Ley 18.083), con audiencias a la Cámara de Industrias, el Colegio de Abogados y el Colegio
  de Contadores. El CSV registra asistencia, no intervenciones: no permite confirmar ni descartar si
  habló en esas dos sesiones (la versión taquigráfica de esas actas de comisión, si existe
  digitalizada, es un documento distinto del diario de sesiones del plenario y queda fuera del
  alcance de esta corrección; ver `## hipotesis`).
- **Presupuestos (id 84):** en 2000-2005 aparece dos veces bajo el prefijo «REPRESENTANTE:», en
  calidad de **coautora de dos proyectos de ley propios** que la comisión trataba (178/2000,
  funcionarios públicos excedentarios — redistribución; y 1003/2001, contratación de ONGs
  educativas), ninguno sobre impuestos o tasas. En 2005-2010 no aparece en absoluto («sin
  coincidencias» en 72.244 caracteres).
- **La comisión id 825** (que había aparecido en un resultado de búsqueda como posible pista, ver
  `## hipotesis`) es, confirmado por el mismo CSV, la «ESPECIAL GENERO Y EQUIDAD-61/00»: Argimón sí
  la integró como miembro/asistente regular en 2004, sin relación con impuestos.

**Texto corregido para reemplazar «nunca integró una comisión económica»:** Argimón nunca fue
miembro formal de las comisiones de Hacienda o Presupuesto en sus diez años como diputada (2000-2010),
pero asistió, sin ser miembro, a al menos dos sesiones de Hacienda sobre los episodios tributarios
más importantes del período (deudores en dólares durante la crisis de 2002, y la creación del IRPF
en 2006); no hay registro de que haya tomado la palabra en ninguna de las dos.

## candidatos_giro

Ninguno. No hay declaraciones de Argimón sobre el tema; sin declaraciones no hay pares para
comparar.

## hipotesis

- **Sesiones extraordinarias de Diputados del 18/10/2001 y el 3/9/2002 — RESUELTO en esta
  corrección, resultado negativo.** Los enlaces `legislativo.parlamento.gub.uy/temporales/…` siguen
  fallando (confirmado de nuevo), pero se identificó el número de sesión exacto por búsqueda web
  (66ª sesión extraordinaria = 18/10/2001; 50ª sesión ordinaria = 3/9/2002) y con eso se leyeron los
  dos diarios completos por la ruta estable de la Hemeroteca
  (`biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/<fecha> - DIARIO DE SESIONES DE LA CAMARA
  DE REPRESENTANTES (<número de 4 dígitos>).pdf`; ambos documentos ya estaban en el corpus desde el
  2026-09-09). Resultado: el 18/10/2001, Argimón interviene tres veces en el pleno, todas sobre un
  proyecto de ley contra la discriminación/incitación al odio (ligado al Código de la Niñez y
  Adolescencia); la sesión también trató, antes, un proyecto de rebaja del Impuesto a la Compra de
  Moneda Extranjera, pero Argimón no participa de ese debate. El 3/9/2002, Argimón figura como
  miembro informante y toma la palabra sobre el proyecto de «Día Nacional de Protección de la
  Ballena Franca Austral»; el asunto tributario que estaba primero en el orden del día de esa misma
  sesión (Acuerdo para Evitar la Doble Imposición con Polonia) fue aplazado a pedido de otro
  diputado (Heber Füllgraff) antes de que se abriera el debate, sin que conste participación de
  Argimón. Conclusión: en las dos sesiones de la crisis que quedaban como hipótesis, con el tema
  tributario explícitamente en el orden del día de ambas, Argimón no fijó posición sobre impuestos.
  Esta es la evidencia más fuerte posible en contra de que exista una declaración suya sobre
  impuestos en 2001-2002: diario de sesiones completo, sin las palabras.
- **Sesión de Diputados del 17/5/2005** (`legislativo.parlamento.gub.uy/temporales/20050517D0020_…`):
  sigue sin resolver; no se buscó el número de sesión estable en esta corrección (fuera del alcance
  específico pedido). Sigue en `verificacion_manual`.
- **Sesiones de Diputados de 2005** (01/06, 22/02, 08/12): sin cambios respecto del lote original;
  los fragmentos visibles son de trámite (presencia, no palabras sobre impuestos), no se leyeron los
  documentos completos.
- **Asistencia sin registro de intervención a Hacienda (18/9/2002 y sesión de 2006 sobre el
  IRPF)**: ver `## comisiones_economicas`. El CSV de actuación no registra discursos, solo
  presencia; para saber si habló haría falta la versión taquigráfica de esas actas de comisión
  específicas (no el diario de sesiones del plenario), que no se buscó en esta corrección.
- **Hallazgo de `consultas.jsonl` línea 37 (comisión sobre reintegros a agroexportadores, 2002) —
  INVESTIGADO Y DESCARTADO como ruido.** Se reprodujo la búsqueda original
  (`site:gub.uy "Beatriz Argimón" impuestos`) y se inspeccionaron los 9 links reales (no solo el
  resumen automático de la herramienta): el único resultado parlamentario es
  `parlamento.gub.uy/.../comisiones/825/comision-actuacion/csv`, que al leerse resultó ser la
  «ESPECIAL GENERO Y EQUIDAD-61/00» (ver `## comisiones_economicas`), sin ninguna relación con
  agroexportadores, reintegros ni el BROU. Una segunda búsqueda dirigida (`"reintegro"
  agroexportadores comisión parlamento Uruguay 2002 BROU exportaciones`) tampoco encontró ninguna
  fuente real que conecte a Argimón con ese tema. La descripción de «reintegro a agroexportadores...
  a través del BROU, con Beatriz Argimón como presidenta de esa comisión» que había anotado el
  investigador original no corresponde a ningún link devuelto por la búsqueda en ninguna de las dos
  reproducciones: parece una síntesis generada por la herramienta de búsqueda que no está anclada a
  una fuente real. Se cierra sin registro.
- **Pista descartada: ¿banca de Senado 2015-2020?** Un resumen de búsqueda web (basado en
  Wikipedia) afirmó que Argimón fue electa senadora en 2014 y ejerció 2015-2020 (48ª legislatura).
  Se verificó contra la biografía oficial del Parlamento (`BEATRIZ_ARGIMON.pdf`, ya en el corpus),
  que no menciona ninguna banca de Senado antes de 2020 y en cambio confirma 2015-2018 como
  panelista de «Esta Boca es Mía». La fuente oficial pesa más que el resumen automático de una
  búsqueda: se descarta la pista de la banca de Senado 2015-2020 y no se investiga más.
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
  devolvió `error: fetch failed` (enlace efímero del Parlamento; sin copia en Wayback). **El mismo
  contenido se leyó igual, completo, por la ruta estable**:
  `https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2001-10-18 - DIARIO DE SESIONES DE
  LA CAMARA DE REPRESENTANTES (0066).pdf` (ver `## hipotesis`, resultado negativo sobre impuestos).
- https://legislativo.parlamento.gub.uy/temporales/20020903D0050_SSN1266052.html — mismo error.
  **Resuelto igual** por
  `https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/2002-09-03 - DIARIO DE SESIONES DE
  LA CAMARA DE REPRESENTANTES (0050).pdf` (ver `## hipotesis`).
- https://legislativo.parlamento.gub.uy/temporales/20050517D0020_SSN553289.html — mismo error. **Sin
  resolver todavía**: no se buscó el número de sesión estable para esta fecha en esta corrección
  (17/5/2005 no estaba entre los cinco puntos del encargo). El directorio
  `biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/` no se puede listar directamente (HTTP 403
  tanto por WebFetch como por `pnpm fuente`); hace falta el número de sesión por otra vía (búsqueda
  web dirigida, como funcionó para 2001 y 2002, o el buscador de "Documentos y Leyes" del propio
  Parlamento, que solo expone un formulario, sin parámetros de URL).
- El dataset oficial de diarios de sesión de Diputados
  (`documentos.diputados.gub.uy/docs/DAdiarioSesiones.csv`, formato `Legislatura,Periodo,Tipo,
  Sesion,SesionTipo,SesionFecha,Diario,URL`, fecha en formato `AAAA/MM/DD`) **no cubre 2001-2002**:
  el archivo completo (72.325 caracteres) solo llega hasta el 2014-03-11 (diario 3911, legislatura
  XLVII) por el extremo más viejo. No sirve para reconstruir sesiones anteriores a 2014.

## cobertura_del_periodo

- **1989-2000** (escribana, funcionaria de OSE y BHU, Edil de Montevideo 1989-1990, Directora del
  INAME 1990-1995): ninguno de estos cargos tiene competencia fiscal; no hay una "campaña previa al
  primer mandato" electivo propiamente dicha antes de 2000 (su primer cargo por elección fue Edil
  en 1989, sin campaña presidencial/legislativa de por medio). No se encontró contenido sobre
  impuestos y no se buscó exhaustivamente en esta franja por ser institucionalmente improbable
  (nota, no silencio: si se quiere cobertura total de este tramo, falta buscarlo con la misma
  vara que el resto).
- **2000-2010** (Representante Nacional, dos períodos): cubierto con corpus, web y, en esta
  corrección, el CSV oficial de actuación de comisiones para Hacienda y Presupuestos (ver
  `## comisiones_economicas`): nunca miembro formal de ninguna comisión económica, pero sí asistió
  sin ser miembro a dos sesiones de Hacienda sobre temas tributarios de alto perfil (crisis 2002,
  IRPF 2006), sin registro de intervención verbal. Las dos sesiones extraordinarias del plenario que
  habían quedado como hipótesis (18/10/2001 y 3/9/2002) se leyeron enteras en esta corrección por la
  ruta estable de la Hemeroteca: **resultado negativo confirmado por diario de sesiones completo**
  (ver `## hipotesis`). Sigue sin resolver un tercer enlace `temporales/` (17/5/2005, ver
  `verificacion_manual`), y las sesiones de 2005 mencionadas en `hipotesis` no se leyeron completas.
- **2010-2019 — tramo cubierto en esta corrección (antes ausente de esta lista).** En este período
  Argimón no tuvo cargo electivo: integró el Directorio del Partido Nacional desde 2009 (confirmado
  por una fuente del corpus, historia-biografia.com, y por El Observador), fue panelista del
  programa televisivo "Esta Boca es Mía" entre 2015 y 2018 (según la biografía oficial del
  Parlamento), y asumió la presidencia del Directorio del Partido Nacional el 16 de abril de 2018,
  cargo que ejerció hasta 2020. Se buscó con la misma vara que el resto del período: ~9 consultas de
  corpus acotadas a 2010-2019 (impuestos, Directorio, presidenta del Partido Nacional, "Esta Boca es
  Mía", Rendición de Cuentas, ajuste fiscal, IRPF, tributaria), ~10 búsquedas web dirigidas
  (Directorio+impuestos, "Esta Boca es Mía"+economía, 2016/2017+IRPF/Rendición de Cuentas), y una
  corrida de `pnpm descubrir elpais.com.uy --desde 2009-01 --hasta 2019-06` (9 candidatas, ninguna
  sobre impuestos). Se leyeron con `pnpm fuente` las cinco notas de prensa más directamente
  relacionadas con su asunción al Directorio (El Observador 2018-03-10 y 2018-04-16; El País
  2018-04-04, 2018-04-16 y 2018-04-22): ninguna contiene ninguno de los diez términos tributarios
  buscados (impuesto, impuestos, tributar, IVA, IRPF, IASS, IMESI, fiscal, Hacienda, tasa).
  Resultado: sin contenido tributario en este tramo, con la misma vara de búsqueda que el resto del
  período.
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
  cruza su nombre con un término de impuestos. En esta corrección se sumó una nota de Brecha
  (2024-09-27, "Escombros muy caros", sobre un proyecto de ley de deudas compensables por impuestos
  inmobiliarios): Argimón aparece una sola vez, declarando concluido el período parlamentario como
  presidenta de la Asamblea General — mención protocolar, sin relación de fondo con el contenido
  tributario del proyecto.
- **2025-presente** (embajadora ante la Unesco y la OCDE): cubierto; coordina una reunión de alto
  nivel de la OCDE en la que, según la prensa, uno de los temas de fondo del acercamiento
  Uruguay-OCDE es el Impuesto Mínimo Global, pero las citas textuales de Argimón encontradas
  (Búsqueda, Ámbito) son sobre la logística del encuentro y la relación institucional con la OCDE,
  no sobre contenido tributario.

## objeciones_al_brief

Ninguna en la corrida original. El brief pide cobertura simétrica del período completo (campaña,
gobierno, oposición, posmandato) y no direcciona la búsqueda hacia ningún partido o persona.

**Objeción agregada en esta corrección, aplicando Regla 0.** La tabla de mandatos del brief
(sección 1) lista solo cargos de Estado (INAME, Representante Nacional, Vicepresidenta, Embajadora)
y no incluye cargos partidarios ni roles públicos no estatales. Eso hizo que el tramo 2010-2019
(integrante y luego presidenta del Directorio del Partido Nacional desde 2009-2018-2020, panelista
de TV 2015-2018) quedara completamente fuera de `cobertura_del_periodo` en la corrida original, sin
declararse como hueco: el investigador construyó sus tramos siguiendo la tabla del brief y el hueco
salió de ahí de forma casi mecánica. Este defecto no es partidario ni direccionado a esta persona en
particular: afecta simétricamente a cualquier figura que haya tenido peso público fuera del Estado
(conducción partidaria, banca en medios, cátedra) en los años entre dos cargos electivos, y golpea
distinto según la trayectoria de cada quien. Corregirlo es materia de Regla 0. **Versión simétrica
propuesta:** que `pnpm brief` incluya en el período a cubrir los cargos partidarios y los roles
públicos no estatales, con la misma regla para todos los partidos y todas las personas, y que
`cobertura_del_periodo` lleve un tramo por cada uno de esos períodos aunque el resultado sea vacío.

## medios_faltantes

Ninguno. Los medios usados (busqueda, el-pais, ambito, el-observador, la-diaria, brecha, parlamento)
ya están en la tabla del brief. **Brecha y La República se consultaron en esta corrección** (corpus:
sin resultados en ninguno de los dos, en todo el período 1989-2026; web: múltiples búsquedas
dirigidas con `site:brecha.com.uy` y `site:republica.com.uy` — nota: el dominio real de "La
República" es `republica.com.uy`, no `larepublica.com.uy`). Se leyó una nota completa de Brecha
(2024-09-27); no se encontró ninguna nota de La República que conecte a Argimón con impuestos pese a
seis búsquedas dirigidas con distintos términos. El resultado negativo queda ahora confirmado desde
los dos alineamientos que el brief pedía cubrir (`oficialista_tradicional` vía El País,
`progresista` vía Brecha), no solo desde uno.

## referentes_faltantes

Ninguno (no hay menciones en esta corrida).

## pistas cruzadas anotadas

Al leer el diario de sesiones/la nota sobre la exoneración de IVA al asado (22/3/2022) aparecieron
declaraciones sustantivas de otros senadores sobre impuestos, ajenas a esta corrida:
- `<CORPUS_DIR>/corpus/pistas/bergara-mario.yaml` (Mario Bergara, Frente Amplio).
- `<CORPUS_DIR>/corpus/pistas/olesker-daniel.yaml` (Daniel Olesker, Frente Amplio).
