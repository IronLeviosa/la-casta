# Notas: historia de propiedad de El Observador (corrección de medios/el-observador)

## candidatos_giro

Ninguno (colección medios, sin pares de declaraciones).

## hipotesis

1. **Control compartido o cambiante entre 1991 y 2022, no descartado.** La nota de El Observador «Cómo se gestó la creación de El Observador» (2021-10-23) dice que a la idea de Peirano «se sumaron otros siete empresarios» (Acle, Blanco, Fernández Ameglio, Fossati, Hudson, Iraola, Varela) y ninguna fuente leída dice qué participación tenía cada uno ni si alguno salió. El tramo `peirano` queda sostenido en sus dos extremos: la fundación por Peirano y la venta de 2022, que el propio Peirano cuenta en primera persona («Cuando la vendí, estábamos break-even…», Montevideo Portal, 2024-07-16; también «Elegimos que otro hiciera la inversión»). Lo que hay entre ambos extremos (1991-2022) es continuidad inferida, no documentada año por año. Para la regla de dos grupos el efecto es el mismo que con `desconocido` (ninguna ficha publicada lleva el grupo `peirano`; ambos son distintos de `werthein-hochbaum`), pero si el crítico prefiere no afirmar el control de Peirano sin fuente para el intermedio, la alternativa es `desconocido` con `fuentes: []` para 1991-10-22 a 2022-05-04. Falta para cerrarlo: el registro de la sociedad editora (Diario Oficial, registro de comercio) o una nota de Búsqueda o Brecha con la composición accionaria.
2. **Participación de capitales brasileños hacia fines de 2010, sin fecha, porcentaje ni control.** El Cronista (https://www.cronista.com/negocios/empresarios-argentinos-desembarcan-en-el-negocio-de-medios-de-uruguay/) e iProfesional (https://www.iprofesional.com/notas/110832-Grupo-argentino-se-queda-con-el-diario-La-Republica-de-Uruguay), ambos del 2011-01-28 y con el mismo texto, dicen que «a la compra de El Observador por parte de capitales brasileños se le sumó el desembarco de empresarios argentinos» (nota sobre la venta de La República). Una versión de UyPress reproducida en un blog (https://seniales.blogspot.com/2011/01/el-grupo-ick-le-compro-el-diario-la.html, de baja calidad) habla de «una importante participación accionaria adquirida hace pocos meses por el grupo brasileño» y el nombre del titular aparece cortado y mezclado con un párrafo sobre un empresario del frigorífico PUL. Las tres versiones derivan de un mismo despacho y cuentan como un solo origen. Sirve de pista para buscar la operación original (Paper Papers, UyPress, Búsqueda, diciembre de 2010 y 2011); si se probara que ese grupo adquirió el control, el tramo 1991-2022 tendría que partirse con otra fecha de corte y otro grupo. No se cargó en la ficha porque ni El Cronista ni iProfesional tienen ficha en `content/medios/` y la nota no dice que el control cambiara.
3. **Quién vendió en 2022.** La nota «El Observador cambia de accionistas» (2022-05-11) confirma la fecha de corte («Con fecha 5 de mayo de 2022… adquirió el control accionario») pero no dice quién vendió ni qué porcentaje. MercoPress aclara que el acuerdo se cerró el 5 de mayo y se anunció el 11 (https://en.mercopress.com/2022/05/12/argentine-entrepreneurs-buy-over-montevideo-daily). Peirano dice que él vendió; no se documenta si otros socios vendieron.
4. **Propietario compartido con otro medio, desde 2022.** El Cronista (2022-05-11) y Bloomberg Línea dicen que Gabriel Hochbaum es también accionista del Grupo América y de El Cronista. Si alguna vez se crea la ficha de El Cronista, hay que revisar si comparte grupo con El Observador desde el 5 de mayo de 2022; hoy El Cronista no tiene ficha en `content/medios/`.
5. **«El diario de los Peirano».** La entrevista de Montevideo Portal dice que Peirano debió contestarle a Mujica cuando este habló del «diario de los Peirano» y que es primo de Jorge, José y Dante Peirano Basso. No se encontró la frase original de Mujica ni fuente de que esa rama de la familia tuviera acciones del diario; no se usa.

## casos_vistos

- https://www.pagina12.com.ar/diario/elmundo/4-13561-2002-11-30.html: nota «Otro Peirano preso» (2002) sobre la causa de otro miembro de la familia Peirano Basso en la crisis bancaria de 2002; no investigado y no es sobre Ricardo Peirano.
- https://www.montevideo.com.uy/Noticias/Peirano-y-la-negacion-del-periodismo--Tenes-que-ir-al-tercer-parrafo-para-ver-que-pasa--uc894199: Ricardo Peirano figuró en una lista de documentos offshore (tipo Panama Papers) y reconoció en un editorial ser miembro de tres sociedades offshore familiares en Panamá; no es un caso judicial; una línea, no investigado.

## verificacion_manual

- https://library.fes.de/pdf-files/bueros/uruguay/13950.pdf («En pocas manos», Gómez, Franco, Gelves y Thevenet, FES, 2017): `pnpm fuente` devolvió solo la ficha de catálogo (895 caracteres), no el texto del libro; sin acceso al libro no se pudo cotejar la propiedad de El Observador en 2017. Pendiente.
- https://fescomunica.fes.de/fileadmin/user_upload/pdf/publicaciones/documentos/2010_Edison_Lanza_mapeo_de_medios_4.pdf y https://collections.fes.de/download/pdf/455090.pdf: abiertos; el primero no devolvió ninguna coincidencia para «Observador» ni «Peirano», el segundo es un estudio centrado en televisión y radio que tampoco los menciona (búsqueda de «Observador», «Obser», «Peirano», «Peira»); no aportan.
- «Un parto difícil y 30 años de historias» (Carla Colman, El Observador, 2021-10-22) y el PDF «Observando desde afuera» (http://sdr.fic.edu.uy/wp-content/uploads/2019/03/Observando-desde-afuera.pdf), ambos referenciados en la entrada de Wikipedia: no aparecieron en el buscador ni en el corpus y la URL no se arma a mano; sin abrir.
- `pnpm descubrir elobservador.com.uy --desde 2021-10 --hasta 2021-10 --terminos …` devolvió solo notas de octubre de 2026: el sitemap vigente no trae las notas del aniversario de 2021.
- «Quién es quién en la rosca uruguaya» (sitiosdememoria.uy, 1990, antes de la fundación): salió en un resultado de búsqueda, no se abrió.
- Fallos de red no fatales: `pnpm fuente` no pudo guardar copia en Wayback de varias notas (HTTP 429 y «This operation was aborted»), sin efecto sobre el texto leído. Ninguna lectura falló con «fetch failed».
- Las 24 búsquedas web de `consultas.jsonl` (tipo busqueda, sin prefijo `corpus:buscar`) llevan hora aproximada: el buscador no las registra solo, y se reconstruyó el orden contra las lecturas.

## trayectoria_fuera_del_estado

Ricardo Peirano (fuente: Montevideo Portal, 2024-07-16): abogado (estudió en Argentina), MBA en el IESE de Barcelona; pasó por Acsa y Cot; fundó el Centro de Estudios de la Realidad Económica y Social (CERES) en noviembre de 1985 y lo preside; fundó El Observador Económico en 1991, fue su director, y desde mayo de 2022 es director periodístico. Numerario del Opus Dei. Primo de Jorge, José y Dante Peirano Basso. Sirve de contexto de quién habla en cada tramo, no para la ficha del medio.

## censo_faltante

No aplica (corrección de una ficha de medio).

## cobertura_del_periodo

- **1991-10-22 a 2022-05-04** (Peirano y otros socios): corpus (`pnpm corpus:buscar`, 6 consultas del lote entre las de la corrida anterior y las mías: propiedad, accionistas, mayoría accionaria, capitales brasileños 2009-2012, socios fundadores por nombre) y web (24 consultas en el buscador, incluidas «accionista mayoritario», «Editorial Observador», Panama Papers, «diario de los Peirano», En pocas manos, Brecha/Búsqueda sobre la venta). Notas leídas con `pnpm fuente`: las cuatro del aniversario de El Observador (2021), la entrevista de Montevideo Portal 2024, Wikipedia (es, en, Hispanopedia), El Cronista, iProfesional, Señales, Letra P, Página/12 2002 y los dos estudios de FES. Encontrado: fecha de fundación, lista de los siete socios iniciales, relato de Peirano de que vendió la empresa en 2022, y el rastro de una participación brasileña hacia 2010 (sin fecha ni porcentaje). No se encontró registro societario ni nota que dé el reparto accionario en ningún año del período. `pnpm inventario`, `pnpm sesion:indexar` y el CDX de Wayback no se usaron por indicación del brief.
- **2022-05-05 en adelante** (Werthein y Hochbaum): la nota «El Observador cambia de accionistas» (corpus) confirma fecha, compradores y presidencia de Tarantino; no dice quién vendió. Confirmado con Montevideo Portal 2024, El Cronista, La Nación, Urgente24, Caras y Caretas, Letra P, Bloomberg Línea, MercoPress, LaRepública.co, iProfesional y Durazno Digital (todas del 11 al 30 de mayo de 2022 y derivadas del mismo comunicado de El Observador salvo la de 2024).

## para_el_lector

El Observador se fundó el 22 de octubre de 1991 por iniciativa de Ricardo Peirano con otros siete empresarios y desde el 5 de mayo de 2022 lo controla un grupo de inversores argentinos encabezado por Gerardo Werthein y Gabriel Hochbaum. Para los años 1991-2022 figura bajo el grupo de Peirano porque él mismo cuenta que vendió la empresa en 2022, pero no hay registro societario ni nota que documente qué participación tenía cada socio en cada año.

## objeciones_al_brief

Ninguna. El brief pide el mismo umbral de evidencia que para la ficha de cualquier otro medio y no selecciona ni encuadra por persona, partido o ideología.

## medios_faltantes

Ninguno para lo cargado (`el-observador`, `montevideo-portal` y `wikipedia` existen). No se dio de alta ficha de El Cronista ni de iProfesional porque no se citan.

## referentes_faltantes

Ninguno.
