# Notas — Gabriel Barandiarán, ficha (2026-09-08, segunda vuelta)

Segunda vuelta sobre `inbox/barandiaran/ficha/2026-09-08/`, resolviendo `data/corridas/2026-09-08-barandiaran-ficha/critica.md`. Modelo: `claude-sonnet-5` (instrucción del mantenedor de correr en Sonnet). No se tocó `inbox/barandiaran/trayectoria/2026-09-08/` (colecciones vacías, fuera de encargo).

## Qué se resolvió de la crítica

- **`candidaturas[0]` (1994) y `candidaturas[1]` (1999), bloqueantes:** reescritas con la Enciclopedia Electoral Uruguaya 1900-2010 (Instituto FACTUM, publicada por el Parlamento en `legislativo.parlamento.gub.uy/OtrosDocumentos/`, hoy solo accesible vía Wayback con el sufijo `if_`). El documento tiene, para cada elección, tres tablas útiles: "Resultado en cifras" (Presidencia por departamento), "Votos por sublemas" (Diputados por departamento y lema) y "Titulares y suplentes electos" / nómina de candidatos por hoja de votación. Con eso se estableció:
  - **1994:** Barandiarán fue el **primer suplente de Rafael Michelini** en la Hoja de votación 99000 (Nuevo Espacio, Montevideo, "sistema respectivo"), no el cabeza de lista. Michelini era a la vez el candidato del Nuevo Espacio a la Presidencia en esa elección. El documento no dice por qué Michelini no asumió la banca de diputado (no tiene la anotación "(Optó por banca del Senado)" que el libro sí usa para otros casos, como Helios Sarthou o Pablo Millor, así que esa hipótesis puntual queda descartada con fuente); lo que consta con fuente es que Barandiarán ejerció como titular desde el 15-02-1995, según el documento del Parlamento ya citado en `mandatos[0]`. La Hoja 99000 sacó 66.696 votos en Montevideo (documento oficial).
  - **1999:** Barandiarán fue el **primer suplente de Iván Posada** en la Hoja de votación 1999 ("Tercera Vía"), que sacó 17.152 votos en Montevideo y eligió un solo titular: el propio Posada. `resultado: no_electo` con la fuente oficial (antes decía `electo` sin fuente que lo dijera). La Wikipedia de Iván Posada, que ya señalaba esto, queda como fuente secundaria.
  - La frase "Encabezó la lista 99000" y la cita de 1999 usada para sostener el detalle de 1994 (la falla de cita fuera de contexto que señaló el crítico) se sacaron del todo.
- **Los 79 días sin fechar:** se agregaron **cinco mandatos nuevos**, cada uno con la resolución de licencia del Parlamento que convoca a Barandiarán como suplente de Iván Posada, más el día de Asamblea General ya en el corpus:
  - 2000-09-11 a 2000-09-13 (3 días)
  - 2000-11-06 a 2000-11-12 (ya existía; se agregó como tercera fuente el oficio de la Comisión de Asuntos Internos del 01-11-2000 que originó la convocatoria)
  - 2001-12-11 (1 día)
  - 2002-12-16 a 2002-12-20 (5 días)
  - **2003-02-12** (Asamblea General, el día que ya estaba en el corpus y que la crítica señaló como "un día ubicado" — ahora es un mandato, no solo una mención en notas)
  - 2003-11-05 a 2003-11-08 (4 días, con doble respaldo: la resolución de licencia y la lista de asistencia que registra su convocatoria a las 19:30 del 5-11-2003)
  - 2004-12-15 (1 día; es la actividad documentada más tardía de esta persona)
  Total: **46 de los 110 días** de suplencia de la Legislatura 45 quedan con fecha y cita (31 que ya estaban + 15 nuevos). Quedan **64 días sin fechar**. Metodología y lo que falta, más abajo en `## suplencias_sin_fechar_pendientes`.
- **`estado_actual.salida`:** tenía `2004-04-24`, que ya no es defendible: hay actividad documentada el 2004-12-15. La cambié a esa fecha (la última confirmada con cita), **no** a 2005-02-14 (fin formal de la Legislatura 45), porque estirarla hasta el fin de la legislatura sería inferir que siguió como suplente convocable hasta esa fecha sin un documento que lo diga para él específicamente — y las reglas de mi rol no me dejan hacer esa inferencia. Dejo la cita del encabezado de la Legislatura 45 ("LEGISLATURA No. 45 - Del 15 de febrero de 2000 al 14 de febrero de 2005") disponible más abajo por si el editor prefiere usarla con esa salvedad explícita en el análisis.
- **`partido`:** corregido a `Nuevo Espacio` (antes decía "Partido Nuevo Espacio"). Confirmé en `data/alias.yaml` (líneas 117-130) que el nombre canónico ya existe con ese color y alias; no creé ninguna entrada nueva. La sección `partido_faltante` del lote anterior, que decía que no existía, era falsa y la saqué.
- **La declaración de 2000-11-07:** extendida hasta "...el fomento de este tipo de cosas", releyendo el mismo PDF (`temporales/8648567.PDF`) para confirmar que el tramo agregado es contiguo al que ya estaba (sin saltos). `titulo` y `resumen` reescritos para que digan el sentido del voto (a favor, con reparos que el propio orador subordina a la finalidad de la ley), no solo los reparos.
- **Ley 17.189 / Comisión de Equidad, Género y Familia:** corregidas las dos afirmaciones de `notas.md` que el crítico marcó como error de hecho. Barandiarán SÍ es de los primeros firmantes del asunto 11649 (verificado de nuevo en esta vuelta), que se promulgó como **Ley 17.189** el 20-09-1999 (no "Ley 17.250", que era una suposición de memoria del lote anterior y ya no está). Intervino dos veces en la discusión general del 18-08-1999 (Diario 2845, páginas 114-115 y 116-117), que sigue sin estar digitalizado (lo volví a confirmar: el buscador de diarios de sesión con `Cpo_codigo=D&Lgl_Nro=44` para esas fechas da 0 resultados). El texto de la Ley 17.189 en IMPO no lista a los legisladores que la presentaron (solo a quien la promulga), así que no hay cita suya ahí. Sobre la Comisión de Equidad, Género y Familia (asunto 12737): revisé la ficha completa y **Barandiarán no aparece** ni como firmante ni como interviniente — el lote anterior lo vinculaba sin haber verificado esto, y no encontré ninguna base para el vínculo. No se carga nada al respecto.
- **Filiación posterior a 2005:** sin filiación posterior documentada. Búsquedas en Corte Electoral (sin datasets de listas 1994/1999 ni posteriores desagregados por candidato en `catalogodatos.gub.uy` ni en `gub.uy/corte-electoral`) y en la web (dos búsquedas específicas, ver `consultas.jsonl`) no encontraron nada. No es una omisión: es lo que hay.

## Lo que no se resolvió y por qué

- **1995-2000 (Legislatura 44, titular):** sigue sin declaraciones ni intervenciones citables. Confirmé de nuevo que el Diario 2845 (18-08-1999) no está digitalizado. La vía de Asamblea General/Comisión Permanente que sugería la crítica (digitalizada desde 1985) no aportó nada nuevo para este período específico: no encontré una sesión de Asamblea General de 1995-2000 con a Barandiarán interviniendo (solo tiene actuación documentada como firmante de proyectos en Cámara, ya cargados en `proyectos_presentados` de la corrida anterior, con las correcciones de arriba).
- **Los 64 días restantes de suplencia:** ver `## suplencias_sin_fechar_pendientes`.
- **`wikidata`:** sigue sin existir para esta persona; el campo es opcional en el esquema (confirmado en esta vuelta), así que se omite sin bloquear nada.
- **Filiación posterior a 2005:** confirmado que no hay evidencia, no que definitivamente no exista (ver arriba).

## para_el_editor

Material para el bloque `cobertura` de la ficha (qué se buscó, qué existe, qué no).

**Medios y archivos revisados en las dos corridas (ficha + trayectoria, ambas del 2026-09-08):**
- Corpus (`pnpm corpus:buscar`): una sola mención antes de esta investigación, el PDF de asistencia de la Asamblea General del 12-02-2003.
- Parlamento (`parlamento.gub.uy` / `infolegislativa.parlamento.gub.uy`): fuente principal. El buscador de diarios de sesión solo tiene Cámara de Representantes digitalizada desde el 11-02-2000; Asamblea General y Comisión Permanente están desde 1985, pero no se encontró en ellas ninguna intervención de Barandiarán durante su período titular (1995-2000). La búsqueda de texto completo (`Texto=Barandiaran`) sobre toda la Legislatura 45 devolvió 96 diarios; se verificaron 15 con lectura directa del documento, de los que 10 confirmaron su presencia con fecha exacta (5 ya conocidas, 5 nuevas) y 2 fueron descartados (una convocatoria que rechazó, una firma de proyecto de ley sin confirmación de asistencia). Quedan sin verificar unos 80 diarios más, listados abajo.
- Corte Electoral: sin resultados desagregados por lista para 1994 ni 1999 en los canales en línea (`gub.uy/corte-electoral`, `catalogodatos.gub.uy`); el dato de votos por hoja se obtuvo de la Enciclopedia Electoral Uruguaya 1900-2010 (Instituto Factum, publicada por el Parlamento), no de la Corte Electoral directamente.
- IMPO: Ley 17.189 leída completa; no aporta autoría.
- Wikipedia: anexos de las Legislaturas XLIII a XLV, artículo de Nuevo Espacio, artículo de Iván Posada — usados como fuente secundaria, nunca como única fuente de un dato duro.
- Prensa: de trece medios revisados en la corrida de trayectoria (El País, la diaria, Montevideo Portal, El Observador, Búsqueda, Subrayado, Brecha, La República, Telemundo, Telenoche, radios, Presidencia, Partido Colorado), **solo apareció una nota que lo cita**: LR21 (La República), 29-09-2000, sobre un proyecto de protección de datos personales. Montevideo Portal y El Observador tuvieron una cobertura de sitemap sospechosamente chica (0 y 137 sitemaps leídos respectivamente) según la corrida de trayectoria; si se repite la búsqueda conviene reintentar `pnpm descubrir` en esos dos dominios. `lr21.com.uy` en sí no se recorrió con `pnpm descubrir` en ninguna de las dos corridas, pese a ser el único medio que demostró tener material de esta persona — recomendado para una tercera vuelta si hiciera falta.
- No hay imagen con licencia libre disponible (ninguna de las dos corridas encontró una).
- No hay evidencia de actividad pública después del 15-12-2004 (última fecha confirmada de ejercicio de la banca).

## candidatos_giro

Ninguno. Solo se registró una declaración parlamentaria; no hay pares antes/después que comparar.

## hipotesis

- **A quién sustituyó como suplente en cada convocatoria:** ahora sí está documentado para las 5 convocatorias nuevas (siempre a Iván Posada, salvo la de noviembre de 2000 que también es por licencia de Posada). No hace falta la conjetura sobre Felipe Michelini del lote anterior; se saca.
- **Si permaneció en Nuevo Espacio tras la escisión de 2002:** el documento oficial lo sigue llamando "Nuevo Espacio" hasta su última convocatoria conocida (diciembre de 2004). La Wikipedia de Iván Posada, al llegar a 2004, dice que "Posada y otros dirigentes" fundan el Partido Independiente, sin nombrar a Barandiarán (confirmado por el crítico, no vuelto a verificar en esta vuelta). Sigue sin fuente para una filiación posterior al Partido Independiente. Motivo: no encontré una fuente de prensa o partidaria que lo diga.
- **Nombre legal completo:** sigue sin segundo apellido ni fecha de nacimiento documentados.
- **La firma del proyecto de ley del 6-06-2000** (pago de remuneraciones por sistema bancario, `temporales/8783195.PDF`): está fechada y firmada "Gabriel Barandiaran, Representante por Montevideo", pero la lista de asistencia de la sesión del 7-06-2000 (donde se leyó el proyecto) **no lo incluye**. No hay una resolución de licencia visible en ese mismo diario que lo convoque para esas fechas. Puede ser un período de suplencia de los 79 días sin fecha exacta cuya "Licencias" se haya votado en una sesión anterior no revisada, o puede ser que el proyecto se haya presentado por escrito sin que él estuviera sentado ese día. No lo cargué como mandato por no tener una fecha acotada con fuente directa. Motivo: sin resolución de licencia encontrada para este tramo.
- **Convocatoria rechazada de junio de 2002** (`temporales/5777158.PDF`): Iván Posada pidió licencia del 3 al 8 de junio de 2002 para un viaje a Washington D.C.; Barandiarán, como suplente convocado, **no aceptó la convocatoria** ("no acepto la convocatoria para ocupar la banca... durante el período del 4 al 8 de junio"). Es información real sobre su disponibilidad en ese momento, pero no un período de ejercicio; no se carga como mandato ni contradice nada de lo ya cargado. Dato para el editor si sirve de contexto en `cobertura.texto`.

## suplencias_sin_fechar_pendientes

De los 96 diarios de sesión de la Legislatura 45 que la búsqueda de texto completo del Parlamento (`Texto=Barandiaran`, `Cpo_codigo=All`, `Lgl_Nro=45`) devuelve, se verificaron con lectura directa 15 (los que dieron los 5 períodos nuevos, la confirmación del período de noviembre de 2000, la convocatoria rechazada de junio de 2002 y la firma de junio de 2000). Quedan sin verificar por falta de presupuesto de esta corrida, agrupados por fecha (formato DD-MM-AAAA, tal como los devuelve el buscador del Parlamento en `https://parlamento.gub.uy/documentosyleyes/documentos/diarios-de-sesion?Texto=Barandiaran&Cpo_codigo=All&Lgl_Nro=45&fecha_desde=2000-02-15&fecha_hasta=2005-02-14`, con exportación CSV en la misma URL agregando `/csv` y `&_format=csv`):

16-02-2000, 08-03-2000, 06-06-2000, 07-06-2000 (ya verificado, sin fecha acotada), 15-06-2000, 04-07-2000, 05-07-2000, 11-07-2000, 19-07-2000, 06-09-2000 (ya verificado), 12-09-2000, 13-09-2000, 03-10-2000, 17-10-2000, 01-11-2000 (ya verificado), 05-12-2000, 06-12-2000, 12-12-2000, 13-12-2000, 19-12-2000, 21-12-2000, 16-01-2001, 23-01-2001, 14-02-2001, 07-03-2001, 21-03-2001, 03-04-2001, 04-04-2001, 08-05-2001, 09-05-2001, 15-05-2001, 06-06-2001, 07-06-2001, 12-06-2001, 17-07-2001, 25-07-2001, 01-08-2001, 14-08-2001 (x3 diarios), 15-08-2001, 04-09-2001, 11-09-2001, 12-09-2001, 02-10-2001, 03-10-2001 (x2), 09-10-2001, 06-11-2001, 20-11-2001, 11-12-2001 (ya verificado), 12-12-2001, 13-12-2001, 17-12-2001, 18-12-2001, 19-12-2001, 05-03-2002, 06-03-2002, 22-05-2002 (ya verificado, convocatoria rechazada), 09-10-2002 (ya verificado como mandato con `parlamentariosuruguayos_.pdf`, no releído por texto completo), 15-10-2002, 16-10-2002, 23-10-2002, 03-12-2002, 04-12-2002 (ya verificado), 10-12-2002 (x2, C.RR. y C.SS.), 11-12-2002, 17-12-2002, 01-04-2003, 02-04-2003 (x2, C.RR. y A.G.), 03-04-2003, 08-04-2003, 05-11-2003 (ya verificado), 11-11-2003 (ya verificado), 10-03-2004, 16-03-2004 (x2, ya verificados por `parlamentariosuruguayos_.pdf`), 17-03-2004 (x2), 18-03-2004, 14-04-2004, 05-05-2004, 06-05-2004, 11-05-2004, 12-05-2004, 02-06-2004, 15-12-2004 (ya verificado).

Para el resolvedor o una tercera vuelta: abrir cada diario con `pnpm fuente <url> --buscar "Barandiaran"`, ubicando primero la URL `temporales/*.PDF` vía `https://parlamento.gub.uy/documentosyleyes/documentos/diarios-de-sesion/<id-interno>/IMG` (el id interno no es el número de diario; hay que sacarlo del atributo `href` del HTML de la página de resultados, filtrando `diarios-de-sesion/(\d+)/IMG`). La mayoría de estas fechas van a ser: (a) una resolución de licencia con fecha exacta (como las 5 que se cargaron), (b) una repetición de una convocatoria ya conocida en el resumen de "Integración de la Cámara" de una sesión posterior, o (c) una intervención o exposición escrita suya en una sesión donde ya está convocado. No se espera que las ~80 fechas restantes produzcan 80 períodos distintos: varias van a ser el mismo período de licencia citado en más de un diario (la convocatoria se anuncia el día que se aprueba y se repite en el resumen de sesiones siguientes hasta que termina).

## casos_vistos

Ninguno. No apareció ningún caso judicial ni denuncia asociada a esta persona en la investigación.

## verificacion_manual

- `https://parlamento.gub.uy/camarasycomisiones/legisladores/2946` — ficha personal del legislador en el sitio actual del Parlamento. `pnpm fuente` devuelve solo 100 caracteres (la página arma el contenido con JavaScript); no se pudo usar como fuente.
- Diario de Sesiones N.º 2845 (18-08-1999, debate de "Relaciones de Consumo" donde Barandiarán intervino dos veces, ficha-asunto 11649) y Diario N.º 2818 (02-06-1999, su propio proyecto sobre cláusulas de adhesión, ficha-asunto 12426) y Diario N.º 2688 (08-10-1997, ficha-asunto 8737): anteriores al 15-02-2000; confirmado de nuevo en esta vuelta que el buscador de diarios de la Cámara de Representantes (`Cpo_codigo=D`) para esas fechas de la Legislatura 44 no devuelve nada.
- Diario N.º 2472 (08-03-1995, homenaje al Día de la Mujer, ficha-asunto 902): mismo problema.

## cobertura_del_periodo

- **1995-02-15 a 2000-02-14 (titular, Legislatura XLIV):** cubierto en identidad y fechas del mandato; sin declaraciones ni intervenciones citables (diarios de Cámara de ese período no digitalizados, confirmado de nuevo). Tres proyectos con su firma documentados por ficha-asunto (protección de datos personales, cláusulas de adhesión en contratos de consumo, bases de datos crediticias) más la Ley 17.189 (relaciones de consumo, dos intervenciones el 18-08-1999), ninguno con texto taquigráfico accesible.
- **2000-09-11 a 2000-09-13, 2000-11-06 a 2000-11-12, 2001-12-11, 2002-10-09 a 2002-10-20, 2002-12-16 a 2002-12-20, 2003-02-12, 2003-11-05 a 2003-11-08, 2004-03-16 a 2004-03-21, 2004-04-19 a 2004-04-24, 2004-12-15 (suplente, Legislatura XLV):** cubiertos con fecha y cita. Una intervención sustantiva (7-11-2000, extracción y trasplante de órganos y tejidos); el resto son asistencia o convocatoria sin intervención hablada encontrada.
- **Suplencias sin fechar restantes (64 de los 110 días registrados por el Parlamento):** parcialmente cubierto en esta vuelta (15 de 79 días originales), ver `## suplencias_sin_fechar_pendientes`.
- **Campaña/candidaturas (1994 y 1999):** cubierto con fuente oficial de votos y de la composición de cada lista (Enciclopedia Electoral Uruguaya 1900-2010).
- **Después de 2005:** no cubierto; no hay evidencia de actividad pública posterior, con búsquedas específicas en esta vuelta además de las del lote anterior.

No hay asimetría deliberada: la falta de cobertura de partes del período es un límite de lo que el Parlamento digitalizó o de lo que la prensa cubrió, no una decisión de esta investigación.

## objeciones_al_brief

**El brief de esta corrida y el de la corrida paralela (`trayectoria`) afirman, sin fuente, que Gabriel Barandiarán "fue Representante Nacional (diputado) por el Partido Colorado".** Confirmado de nuevo en esta vuelta: todas las fuentes primarias (el documento oficial del Parlamento, la Enciclopedia Electoral Uruguaya, el propio buscador de diarios de sesión) dicen **Nuevo Espacio**. No hay ninguna fuente que lo vincule al Partido Colorado. Esto no es una instrucción de seleccionar u omitir según partido en el sentido de la Regla 0 (no pide favorecer a nadie), pero sí es un dato afirmado sin fuente en el enunciado del brief, y en la primera vuelta tuvo costo real (búsquedas desperdiciadas persiguiendo un vínculo que no existe). Mantengo la corrección con la fuente en `politicos.yaml`, como hizo el lote anterior.

No encontré otras instrucciones asimétricas en el brief de esta segunda vuelta.

## proyectos_presentados

(Corregido respecto de la vuelta anterior, que tenía dos errores de hecho ya señalados por el crítico y arriba en `## Qué se resolvió de la crítica`.)

- **Protección de datos personales** (reportado por LR21, 2000-09-29): proyecto de ley para "reglamentar el manejo de información sobre las personas físicas", presentado por Barandiarán. No se encontró el texto del proyecto ni el diario de sesión (anterior a 2000-02-15).
- **Cláusulas de adhesión en contratos de consumo** (ficha-asunto 12426): proyecto propio presentado el 1999-06-02. Diario N.º 2818, no digitalizado.
- **Relaciones de Consumo** (ficha-asunto 11649): Barandiarán es uno de los primeros firmantes (junto con Castro Riera, Iglesias Rodríguez, Mahía, Obispo, Scarpa); intervino dos veces en la discusión general del 18-08-1999 (Diario N.º 2845, páginas 114-115 y 116-117). Se convirtió en la **Ley 17.189**, promulgada el 20-09-1999. El texto de la ley en IMPO (`impo.com.uy/bases/leyes/17189-1999`) no lista a los legisladores que la presentaron. Diario 2845 no digitalizado.
- **Bases de datos crediticias / información patrimonial de contribuyentes** (ficha-asunto 7396): proyecto de 1997 cofirmado con Gabriel Courtoisie, Ricardo Falero, Felipe Michelini e Iván Posada. Archivado en comisión el 2000-04-03 sin llegar a debate en sala.
- **Homenaje a Felipe Caram** (ficha-asunto 8737): moción de trámite, no es una posición sustantiva propia.
- **Homenaje al Día Internacional de la Mujer** (ficha-asunto 902, 1995-03-08): presentado por Barandiarán, sin texto citable disponible.
- **Comisión de Equidad, Género y Familia** (ficha-asunto 12737): revisada en esta vuelta y **Barandiarán no figura** ni como firmante ni como interviniente. Se saca la vinculación que tenía la vuelta anterior; no hay base para ella.

## temas_faltantes

Ninguno. La declaración registrada usa `salud`, que ya existe en `content/temas/`.

## medios_faltantes

Ninguno de los medios usados (parlamento, wikipedia, la-republica) falta en `content/medios/`.
