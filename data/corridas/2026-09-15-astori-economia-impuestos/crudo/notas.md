# Notas — astori / economia/impuestos / 2026-09-15

## trayectoria_fuera_del_estado
- Fue senador por el sector Asamblea Uruguay, que integraba dentro del Frente Amplio; así lo
  describe la propia nota que lo entrevista en 2022 ("el senador de Asamblea Uruguay y
  exvicepresidente de la República"). Fuente: https://ladiaria.com.uy/especiales/articulo/2022/7/20-anos-despues-igual-de-convencido-para-astori-la-historia-demuestra-que-su-postura-ante-la-crisis-fue-el-camino-correcto/
  (la diaria, 2022-07-28).
- Búsquedas generales (no abiertas con `pnpm fuente`, solo resultados de motor de búsqueda)
  sitúan la fundación de Asamblea Uruguay en 1994 y una trayectoria previa como docente de
  Economía en la Universidad de la República; no se abrió una fuente primaria para esos dos datos
  puntuales dentro de esta corrida (el foco fue impuestos, no biografía), así que quedan sin citar
  y no se usaron en ningún registro.
- No se relevó actividad gremial ni en medios propios (más allá de las entrevistas ya citadas como
  fuente de declaraciones).

## candidatos_giro
- **Par principal**: las declaraciones `no-ajuste-fiscal-reduccion-carga-tributaria-2014` (2014,
  reportado), `no-incrementar-carga-tributaria-produccion-dolores` (2015-06-08, textual),
  `no-incremento-carga-fiscal-foro-acde` (2015-06-26, textual) y
  `sincera-intencion-no-aumentar-carga-tributaria-2017` (2017-03-23, reportado) afirman que no se
  iba a aumentar la carga tributaria. La declaración `reconocio-incumplimiento-promesa-no-impuestos`
  (2016-08-04, textual, diario de sesiones) es la propia voz de Astori admitiendo que "el anuncio
  no se cumplió". Lo que falta para cerrar el giro del lado editorial: decidir si el cambio de
  contexto (crisis regional 2015-2016, invocada por el propio Astori como justificación) alcanza
  para calificarlo `cambio_justificado` o si corresponde `cambio_total`; ya está la explicación
  del propio actor en la cita, así que no debería quedar en `sin_explicacion`.
- **Par secundario (consistencia, no ruptura)**: `esperanza-no-repetir-ajuste-fiscal` (2016-08-04)
  promete no volver a tocar el sistema impositivo; `descarto-nueva-carga-impositiva-rendicion-2018`
  (2018-05-24) muestra que, al menos hasta esa Rendición, la promesa se sostuvo. Es un `sin_cambio`
  que vale la pena dejar registrado junto al par principal para que la ficha no quede unilateral.

## hipotesis
- Para 1990-2004 (los cuatro tramos sin declaraciones sobre impuestos) la hipótesis es que el
  material existe pero está en los diarios de sesiones del Senado sin indexar por tema: la
  Hemeroteca tiene tomos "[INDICE ALFABETICO]" por legislatura que listan a cada legislador con
  sus intervenciones y páginas. No se persiguió esa vía dentro de esta corrida por el volumen de
  trabajo que implica (localizar el tomo de cada período 1990-1995 / 1995-2000 / 2000-2005, ubicar
  las páginas de Astori y leer cada una), pero es el paso más prometedor para una corrida futura
  dedicada a ese tramo.
- Los cuatro chequeos con `_faltante: dato_oficial` (65.000 trabajadores exonerados en 2015, la
  franja de IRPF 15%→18% de 2016, el "17%/67%" de 2016, y los US$100 millones que Astori atribuyó
  a Lacalle Pou en 2023) probablemente se resuelvan con series de la DGI (declaraciones juradas de
  IRPF por franja, o un informe de recaudación desagregado) que no están en
  `docs/fuentes-oficiales/series.yaml` todavía. Si se agregan, quedan al alcance de `pnpm dato`.

## casos_vistos
- Ninguno. Una búsqueda de El País por "Astori" devolvió notas sobre Davide Astori, futbolista
  italiano fallecido en 2018 (mismo apellido, sin relación); se descartaron por no ser la persona
  de esta corrida, no por ser un caso judicial de Danilo Astori.

## verificacion_manual
- `https://legislativo.parlamento.gub.uy:443/temporales/20160804s00267875834.html` — `pnpm fuente`
  devolvió "fetch failed" (enlace efímero del buscador de infolegislativa). Se reemplazó por la
  URL estable de la Hemeroteca del mismo diario
  (`biblioteca.parlamento.gub.uy/Publicaciones/sesionescss/2016-08-04%20-%20DIARIO...(0026).pdf`),
  que sí se pudo leer y es la fuente citada en los registros.
- `https://www.gub.uy/direccion-general-impositiva/comunicacion/publicaciones/son-bienes-servicios-gravados-tasa-basica-del-22`
  — `pnpm fuente` la rechazó: "la página se arma con JavaScript en el navegador y no trae texto".
  Se reemplazó por el Texto Ordenado (Título 10, IVA) publicado como PDF en `bcu.gub.uy`, que sí
  trae el artículo con las tasas.
- `http://www.busqueda.com.uy/nota/astori-y-los-impuestos` — HTTP 404 (el enlace que devolvió el
  buscador ya no existe).

## cobertura_del_periodo
- **1989**: corpus sin resultados para Astori. Búsquedas web sobre su candidatura a la
  vicepresidencia con Seregni (fórmula derrotada por Lacalle) no devolvieron una declaración suya
  sobre impuestos; no integraba una cámara todavía. Cero declaraciones.
- **1990-1994**: corpus sin resultados. Dos búsquedas web dirigidas (suba del IVA de 21% a 22% por
  la ley 16.107 bajo Lacalle; Comisión de Hacienda del Senado) no devolvieron una cita textual de
  Astori, pese a que fue senador opositor todo el período. No se ubicó una fecha puntual de sesión
  para revisar el diario correspondiente. Cero declaraciones (ver `hipotesis`).
- **1995-1999**: corpus sin resultados. Una búsqueda web dirigida a su rol como senador durante el
  segundo gobierno de Sanguinetti no devolvió cita textual. Cero declaraciones.
- **2000-2004**: corpus sin resultados para Astori + impuestos. Se encontró que el Encuentro
  Progresista (su coalición) votó en contra de la creación del Cofis en 2001 (La República,
  2001-05-24), pero esa nota cita a otros senadores del EP-FA (Couriel, Gargano, Núñez), no a
  Astori con nombre propio. Se leyó además una entrevista retrospectiva de 2022 (la diaria) donde
  Astori habla en detalle de la crisis de 2002, pero se centra en la deuda y el sistema bancario y
  no menciona impuestos. Cero declaraciones de Astori sobre impuestos en este tramo.
- **2005-2009**: cubierto. Conferencia de prensa del 2005-11-07 (documento oficial de Presidencia)
  donde presentó el borrador de la reforma tributaria y anunció el objetivo de bajar el IVA al
  20%. 1 declaración, 1 promesa, 1 chequeo.
- **2010-2014**: cubierto parcialmente. Entrevista de El Observador del 2014-05-24, ya como
  vicepresidente, descartando un ajuste fiscal y anticipando una baja de la carga tributaria para
  un eventual tercer gobierno. Se corrió `pnpm descubrir elpais.com.uy --desde 2014-01 --hasta
  2014-12` para buscar una segunda fuente de otro grupo: devolvió 6 candidatas, ninguna de 2014
  (el sitemap de El País no conserva URLs tan antiguas). 1 declaración con `_faltante:
  segunda_fuente`, 1 promesa.
- **2015-2019**: cubierto en profundidad. Dos comunicados oficiales de Presidencia (2015-05-06 y
  2015-06-08/06-26) descartando subir la carga tributaria; la interpelación del Senado del
  2016-08-04 (diario de sesiones más El País) donde reconoce el incumplimiento de esa promesa;
  declaraciones a la prensa sobre la suba del IRPF (2016-05-26, 2016-08-04, 2016-08-11); una
  entrevista radial de 2017-03-23; y una rueda de prensa de 2018-05-24 descartando nuevos
  impuestos. 9 declaraciones, 3 chequeos.
- **2020-2024**: cubierto. Como senador opositor, el 2020-03-13 calificó de "aumento oculto de
  impuestos" una rebaja de descuentos del IVA del nuevo gobierno (sitio del Frente Amplio). Ya sin
  cargo, el 2023-03-03 criticó en radio la rebaja de IRPF/IASS de Lacalle Pou y recordó una suba de
  impuestos de US$100 millones al inicio de ese gobierno. 2 declaraciones, 1 chequeo. Se probó
  `pnpm descubrir elpais.com.uy --desde 2016-01 --hasta 2020-12`, que sí devolvió cientos de
  candidatas relevantes (usadas para varias de las declaraciones de 2015-2019 y para diversificar
  el `grupo` de medios).
- **2025-2026**: Astori falleció el 2023-11-10 (dato del censo de cargos del brief); no corresponde
  buscar declaraciones posteriores. Cero declaraciones, resultado esperado y no un hueco de
  búsqueda.

## para_el_lector
Astori prometió varias veces, primero como candidato y después como ministro de Economía, que no
se iban a subir los impuestos; en 2016, interpelado por una suba del IRPF y del IASS, reconoció
con sus propias palabras que ese anuncio no se había cumplido. También impulsó en 2005 una baja de
la tasa básica del IVA al 20% que nunca se aplicó: dos décadas después sigue en 22%. Ya como
opositor, entre 2020 y 2023, cuestionó con el mismo argumento subas de impuestos del gobierno
siguiente.

## objeciones_al_brief
Ninguna. El brief pide expresamente cubrir lo favorable y lo desfavorable, consistente o
contradictorio, y no direcciona la búsqueda hacia un partido o persona en particular.

## medios_faltantes
- `frenteamplio-uy` — Frente Amplio (frenteamplio.uy), grupo `frente-amplio`, alineamiento
  `progresista`. Usado como fuente de la declaración `aumento-oculto-impuestos-iva-debito-2020`.
  No confundir con `mpp` (mpp.org.uy), que ya está en la tabla y es un sector distinto dentro del
  Frente Amplio.

## referentes_faltantes
Ninguno: no se cargó ninguna mención en este lote (ver más abajo).

## chequeos_pendientes
Cuatro de los cinco chequeos quedaron con `_faltante: dato_oficial` porque la única fuente
localizada para el número es la propia declaración de Astori (o de la nota que lo cita), sin un
documento independiente de la DGI, el BPS o el MEF que lo confirme:
- `irpf-65000-trabajadores-133000-beneficiados` (2015-05-06)
- `irpf-suba-15-a-18-franja-33401-50100` (2016-05-26)
- `irpf-iass-2016-17-por-ciento-pagara-mas` (2016-08-04)
- `lacalle-pou-aumento-impuestos-100-millones-2020` (2023-03-03)
El único que cerró con documento oficial independiente es `iva-tasa-basica-veinte-por-ciento`
(Texto Ordenado del BCU).

## Por qué no hay menciones.yaml con registros
Ninguna cita de Astori dentro del material sobre impuestos encaja con claridad en "cita como
autoridad", "reivindica" o "critica" a una persona (más allá de nombrar a Vázquez como coautor de
la misma promesa incumplida, que es una referencia conjunta a una decisión de gobierno, no una
mención evaluativa de un tercero). Se prefirió no forzar un registro.

## cobertura_corpus

Comparación automática (`pnpm cobertura:corpus`) entre las notas del corpus que mencionan a `astori` sobre economia/impuestos (o sus alias) entre 1989-01-01 → 2026-09-15, y las URLs que este lote registró como abiertas en `consultas.jsonl`.

- notas del corpus que coinciden: 12
- abiertas: 8
- sin abrir: 4
- cobertura del corpus: 8 de 12 notas abiertas (66.7 %)

Sin abrir (hasta 4, por relevancia):
- 2020-05-08 · en-perspectiva · Noticias del viernes 8 de mayo de 2020 — https://enperspectiva.uy/en-perspectiva-programa/titulares/noticias-del-viernes-8-mayo-2020
- 2024-11-18 · youtube · Debate presidencial entre Álvaro Delgado y Yamandú Orsi — https://www.youtube.com/watch?v=t55eeoxENM8
- 2019-09-04 · api.soundcloud.com · Ciclo Presidenciables 2019 - Dr. Luis Lacalle Pou — https://api.soundcloud.com/tracks/676306547
- 2009-07-12 · wikipedia · Iván Posada — https://es.wikipedia.org/wiki/Iv%C3%A1n_Posada
