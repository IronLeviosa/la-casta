## candidatos_giro

No aplica: el brief pidió explícitamente ficha identitaria, no declaraciones ni giros. No se buscó nada de eso.

## hipotesis

- **Beatriz Argimón, fecha de inicio como embajadora (2025-10-14).** Esa fecha es la de aprobación de la venia por el Senado (El Observador, 2025-10-15), no una confirmación de que ese día haya asumido funciones en París. No encontré una fuente que documente el día exacto de la asunción efectiva del cargo. Falta: una nota o comunicado de Cancillería/cambio.gub.uy con la fecha de presentación de credenciales.
- **Raúl Sendic y la banca de senador 2014-2015.** La Wikipedia dice en el cuerpo del texto que "en las elecciones nacionales de 2014, Sendic alcanzó el senado, siendo electo a la Cámara Alta", pero el infobox no lista ningún mandato de "Senador de la República" con fechas, y salta directo de "Representante Nacional (2000-2005)" a los cargos en ANCAP y luego a la Vicepresidencia (2015). No incluí ese mandato en la ficha por falta de fechas de asunción documentadas; no está claro si llegó a jurar la banca antes de asumir como vicepresidente o si un suplente ocupó el lugar desde el inicio del período. Falta: acta de la Asamblea General o ficha de Parlamento con el detalle.
- **Lucía Topolansky, Edila de Montevideo (1995-2000).** El infobox de Wikipedia solo da el rango de años, sin día ni mes exactos. No se incluyó como mandato porque el esquema exige fecha completa (YYYY-MM-DD). Falta: acta de la Junta Departamental de Montevideo con la fecha de asunción.
- **Carolina Cosse, Directora de la División Tecnología de la Información de Montevideo (2007-2010).** Mismo problema: el infobox de Wikipedia solo da años, sin día exacto. No se incluyó como mandato por la misma razón que el punto anterior. Falta: resolución de la Intendencia de Montevideo con la fecha de designación.
- **Beatriz Argimón, "Presidenta del Directorio del Partido Nacional" (2018-2020).** Encontrado con fechas exactas en el infobox de Wikipedia, pero no lo incluí como mandato porque es un cargo interno de un partido político, no un cargo electivo del Estado ni un cargo de gobierno (el brief pide "cargos electivos o de gobierno", con ejemplos como senador, ministro, intendente). Aplico el mismo criterio a todas las personas de esta ficha: tampoco incluí la integración de Lucía Topolansky a la Dirección Nacional del MPP (que además no tiene fechas documentadas). Si el criterio del proyecto es distinto, este dato está disponible y con fecha exacta para agregarse.
- **Lucía Topolansky, Primera Dama de Uruguay (2010-2015).** No incluida como mandato: es un cargo protocolar, no electivo ni de gobierno (así lo etiqueta el propio infobox de Wikipedia: "Cargo protocolar"). Mismo criterio aplicado de forma pareja a los cuatro perfiles de esta ficha (ninguno tiene cargos protocolares o partidarios en `mandatos`).

## casos_vistos

- Raúl Sendic: su renuncia a la vicepresidencia en 2017 estuvo asociada a un escándalo por el uso de tarjetas corporativas de ANCAP durante su gestión al frente del ente (2008-2013) y a una denuncia por "usurpación de título" (por presentarse como licenciado en Genética sin haber completado esa carrera), presentada en 2016 y archivada porque, al no existir la titulación, no configuraba delito. La ficha de Wikidata que alimenta el infobox de Wikipedia le atribuye "cargos criminales: abuso de autoridad, malversación de fondos". No investigado, por instrucción expresa del brief. URLs: https://es.wikipedia.org/wiki/Ra%C3%BAl_Sendic_Rodr%C3%ADguez y https://ladiaria.com.uy/politica/articulo/2017/9/sendic-renuncio-en-forma-indeclinable-a-la-vicepresidencia-de-la-republica/
- Carolina Cosse: el propio directorio de ANTEL presentó en octubre de 2021 una denuncia penal para investigar "presuntas irregularidades" en la construcción del complejo Antel Arena (inaugurado en 2018, con sobrecostos de unos 78 millones de dólares sobre lo previsto). En 2024 el fiscal Alejandro Machado archivó la causa, rebatiendo los argumentos de la denuncia. No queda claro en la fuente si la denuncia apuntaba a la gestión de Cosse específicamente (ella presidió ANTEL 2010-2015; el edificio se inauguró en 2018, ya con otra presidencia) o a etapas posteriores del proyecto. No investigado más allá de lo que trae la nota de Wikipedia, por no ser el objeto de este brief. URL: https://es.wikipedia.org/wiki/Carolina_Cosse
- No se encontraron menciones de denuncias, causas o imputaciones para Lucía Topolansky ni para Beatriz Argimón al aplicar la misma búsqueda ("denuncia", "Fiscalía", "imputad", "investigación penal") sobre sus fichas de Wikipedia.

## verificacion_manual

Ninguna. Las siete URLs no-Wikipedia que se citan (la diaria, dos de Infobae, El Observador, dos de JUTEP y una de Presidencia) se leyeron con éxito con `pnpm fuente`. La nota de la diaria devolvió solo un extracto corto (812 caracteres) porque el resto queda detrás de un muro de suscripción, pero el fragmento accesible alcanzó para la cita usada y no fue necesario marcarla como verificación manual.

## cobertura_del_periodo

Esta corrida es una semilla de identidad (colección `politicos`), no una corrida de declaraciones/promesas/giros: no se buscó nada de eso, por instrucción del brief. Se cubrieron los cuatro tramos vicepresidenciales pedidos:

- 2015-2020: Raúl Sendic (2015-03-01 a 2017-09-13, renuncia) y Lucía Topolansky (2017-09-13 a 2020-02-14), con la totalidad de sus cargos previos documentados con fecha exacta (diputación, ANCAP, ministerio y Senado para Sendic; diputación y Senado para Topolansky).
- 2020-2025: Beatriz Argimón (2020-03-01 a 2025-03-01), con su cargo previo de diputada y su designación posterior como embajadora ante la Unesco/OCDE (2025).
- 2025-2030 (en curso): Carolina Cosse (desde 2025-03-01), con la totalidad de sus cargos previos (ANTEL, Ministerio de Industria, Senado, Intendencia de Montevideo).

Lo que falta y quedó explícito arriba (sección hipótesis): tres mandatos con fecha imprecisa (Edila de Montevideo de Topolansky, Directora de TI de Montevideo de Cosse) y la fecha exacta de asunción de Argimón como embajadora. No se investigaron causas judiciales de ninguno de los cuatro (Regla del brief), y se aplicó la misma búsqueda de "¿hay algo judicial?" a los cuatro perfiles por igual (sección casos_vistos), no solo al que dejó el cargo antes de tiempo.

## objeciones_al_brief

Ninguna. El criterio pedido (misma ficha, mismos campos, mismo rigor para los cuatro, sin importar el partido) es simétrico y se aplicó igual a los dos vicepresidentes del Frente Amplio (Sendic, Topolansky), a la vicepresidenta del Partido Nacional (Argimón) y a la vicepresidenta actual del Frente Amplio (Cosse). La revisión judicial simétrica (sección casos_vistos) no la pidió el brief para los tres que no dejaron el cargo antes de tiempo; se hizo de oficio, con el mismo criterio para los cuatro, precisamente para no limitar el escrutinio a quien renunció.

## referentes_faltantes

Ninguno: las cuatro personas de esta ficha ya son o van a ser políticos cubiertos (`content/politicos/`), no referentes.
