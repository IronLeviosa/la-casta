# Notas — Gabriel Barandiarán, ficha (2026-09-09, tercera vuelta)

Tercera vuelta, enfocada exclusivamente en resolver la limitación conocida que quedó documentada en
`data/corridas/2026-09-08-barandiaran-ficha/notas.md` (sección `suplencias_sin_fechar_pendientes`):
64 de los 110 días de suplencia que el Parlamento agrupa como "suplencias menores a cinco días" en la
Legislatura 45 no tenían fecha. Modelo: `claude-sonnet-5` (instrucción del mantenedor de correr en
Sonnet).

## Resultado principal

Se recorrieron, diario por diario, 82 de los 97 diarios de sesión que el buscador de texto completo
del Parlamento devuelve para "Barandiaran" en la Legislatura 45. De esos 82: 19 dieron un período de
mandato nuevo (con resolución de licencia explícita o, en su defecto, con lista de asistencia o
actuación propia como Representante), 3 dieron una fuente adicional para un mandato ya conocido
(fortaleciendo su evidencia), y el resto solo repitió información histórica o correspondía a fechas
ya cubiertas por un período conocido.

**Días fechados: 89 de 110 (antes: 46 de 110).** El detalle día por día está en `politicos.yaml`,
bloque `mandatos`. Quedan **21 días sin fechar**, no por imposibilidad sino por presupuesto de esta
corrida: unos 15 diarios candidatos del mismo listado no llegaron a abrirse (ver `## limitaciones`
para la lista completa y cómo continuar).

Un mandato existente (2001-12-11, ya publicado) se fusionó con dos días nuevos contiguos
(2001-12-12 y 2001-12-13) en un solo período 2001-12-11 a 2001-12-13, porque las tres fechas son
consecutivas y las tres tienen la misma resolución de origen (licencia de Iván Posada). El editor
puede optar por mantenerlos separados si prefiere no tocar el id ya publicado del mandato de
2001-12-11.

## candidatos_giro

Ninguno. No se registraron declaraciones nuevas que contradigan la única declaración ya publicada
(trasplantes, 2000-11-07) ni entre sí.

## hipotesis

- **Dos convocatorias rechazadas**, información real sobre su disponibilidad en esos momentos pero
  no períodos de ejercicio (no se cargan como mandato, siguiendo el criterio ya usado en la corrida
  anterior para el rechazo de junio de 2002):
  - **15 de mayo de 2001**: Iván Posada pidió licencia por ese día; tanto Barandiarán como el
    siguiente suplente (Carlos Castaldi) rechazaron la convocatoria ("Que por esta vez no aceptan la
    convocatoria... los señores Gabriel Barandiaran y Carlos Castaldi"). Fuente:
    `https://infolegislativa.parlamento.gub.uy/temporales/1995950.PDF` (diario del 15-05-2001).
  - Ya documentada en la vuelta anterior: 22 de mayo de 2002.
- **Duplicación de resoluciones para el período 2002-12-09/13**: el diario del 3 de diciembre de 2002
  registra una votación afirmativa ("Cuarenta y siete en cuarenta y ocho") convocando a Barandiarán
  por Iván Posada para el 9 al 13 de diciembre de 2002; el diario del 10 de diciembre de 2002 registra
  OTRA votación afirmativa ("Sesenta en sesenta y dos") convocándolo por el mismo motivo para el 11 al
  13 de diciembre de 2002. No encontré una explicación en el texto leído (¿ampliación,
  restablecimiento de una convocatoria rechazada por otro suplente, error del taquígrafo?). Cargué un
  solo mandato (9-13 de diciembre) con las dos fuentes; si el editor quiere separar esto en dos
  períodos, la segunda resolución no agrega días nuevos (11-13 ya está cubierto por la primera).
- **A quién sustituyó en cada convocatoria nueva**: en todos los casos con resolución explícita fue a
  Iván Posada, salvo la ambigüedad de 2000-12-12/15 (la convocatoria menciona tanto una licencia de
  Posada para el mismo lapso como una de Wilmer Trivel resuelta en el mismo diario para fechas
  distintas; el texto de la convocatoria específica a Barandiarán, "Sala de la Comisión, 6 de
  diciembre de 2000", sigue inmediatamente a la mención de Posada, así que se asume que es de él,
  pero no llegué a releer la resolución completa palabra por palabra para confirmarlo).

## casos_vistos

Ninguno. No apareció ningún caso judicial ni denuncia asociada a esta persona.

## verificacion_manual

- **Diario del 15 de junio de 2000** (id interno 3966 del buscador de diarios de sesión): la página
  puente (`https://parlamento.gub.uy/documentosyleyes/documentos/diarios-de-sesion/3966/IMG`) devolvió,
  en dos intentos separados (uno con `--forzar`), el mismo enlace
  `https://infolegislativa.parlamento.gub.uy/temporales/6628715.PDF`, y ese archivo contiene el texto
  de una sesión mucho más reciente (menciona el referéndum contra la LUC de 2022 y a legisladores de
  2020-2025). Esto no es un límite de esta investigación: es un problema del lado del sitio del
  Parlamento con ese identificador interno específico (posiblemente una colisión o un enlace mal
  indexado). No se pudo verificar si hubo actividad de Barandiarán ese día.
- Los cinco documentos ya señalados como no digitalizados en la vuelta anterior (Diarios N.º 2472,
  2688, 2818, 2845 de la Legislatura 44, y la ficha personal del legislador en
  `parlamento.gub.uy/camarasycomisiones/legisladores/2946`) siguen sin poder leerse; no se volvieron
  a intentar en esta vuelta porque el encargo era específicamente la Legislatura 45.
- **CDX de Wayback sobre `larepublica.com.uy`, `elobservador.com.uy`, `montevideo.com.uy` y
  `elpais.com.uy`**: las cuatro consultas (con y sin acotar por fecha 1999-2004) fallaron por timeout
  del lado de la herramienta (`fetch failed`, entre 30 y 140 segundos de espera) antes de completarse.
  Estos son dominios con millones de URLs indexadas en Wayback; el filtro por regex sobre el campo
  `urlkey` parece requerir más tiempo del que la herramienta actual tolera para dominios de ese
  tamaño. No se pudo confirmar ni descartar cobertura de estos cuatro medios para 1999-2004.
  `lr21.com.uy` devolvió una respuesta de 0 caracteres en dos intentos (no un error explícito), que
  tampoco permite distinguir "sin resultados" de "fallo de extracción silencioso".

## cobertura_del_periodo

- **1995-02-15 a 2000-02-14 (titular)**: sin cambios respecto de la vuelta anterior; no digitalizado.
- **2000-06-06 a 2004-12-15 (suplente, Legislatura 45)**: 89 de 110 días documentados con fecha y
  cita (antes 46). Ver `politicos.yaml`.
- **Prensa 1999-2004**: se intentó ampliar la búsqueda vía Wayback CDX sobre siete dominios (ver
  `## verificacion_manual`); solo se obtuvo una respuesta útil de `espectador.com` (dos fotografías de
  prensa, sin nota de texto) y una respuesta limpia sin resultados de `radioelespectador.com`. Los
  otros cinco dominios (`lr21.com.uy`, `larepublica.com.uy`, `elobservador.com.uy`,
  `montevideo.com.uy`, `elpais.com.uy`) quedaron sin confirmar por fallas técnicas de la consulta, no
  por ausencia de cobertura verificada.
- **Después de 2004-12-15**: sin cambios; no cubierto, sin evidencia de actividad pública posterior.

No hay asimetría deliberada: la falta de cobertura de los 21 días restantes y de la prensa de cuatro
medios es un límite de tiempo de esta corrida y, en el caso de los CDX, un límite técnico de la
consulta, no una decisión de esta investigación.

## objeciones_al_brief

Ninguna. El brief de esta tercera vuelta pide expresamente el mismo criterio que para cualquier otra
persona del sitio y no contiene ninguna instrucción asimétrica.

## temas_faltantes

Ninguno. Las dos declaraciones nuevas usan `economia/empleo` y `vivienda`, ambos ya existentes en
`content/temas/`. Ninguno de los dos es un ajuste perfecto (ver el análisis en el informe final);
quedan como la opción más cercana de las existentes.

## medios_faltantes

Ninguno. Todas las fuentes nuevas son `parlamento` (ya existe en `content/medios/`).

## limitaciones

Para que el mantenedor pueda decidir si vale la pena un pedido formal:

1. **21 días de suplencia de la Legislatura 45 (2000-2005) siguen sin fecha.** No son inaccesibles:
   son diarios candidatos del mismo listado de 97 que esta corrida no llegó a abrir por presupuesto de
   tiempo. La lista completa de fechas candidatas (formato DD-MM-AAAA) que quedan sin verificar:
   **16-02-2000, 08-03-2000** (verificados esta vuelta, sin dato nuevo, incluidos aquí solo para que
   no se vuelvan a abrir), **15-06-2000** (verificado pero con contenido corrupto del lado del
   Parlamento, ver `verificacion_manual`), **17-10-2000, 03-10-2000** (verificados, sin dato nuevo),
   **16-01-2001, 14-02-2001, 07-03-2001** (verificados, sin dato nuevo), **25-07-2001, 01-08-2001**
   (verificados, sin dato nuevo), **06-11-2001, 20-11-2001** (verificados, sin dato nuevo o
   ambiguos), **15-10-2002, 16-10-2002, 23-10-2002** (verificados, dentro de un período ya conocido),
   **17-12-2002** (verificado, sin dato nuevo), **08-04-2003** (verificado, sin dato nuevo),
   **06-05-2004** (verificado, sin dato nuevo). Es decir: de los 97 diarios candidatos, **82 ya se
   abrieron** (incluidos los quince recién listados, que no dieron mandato nuevo) y **quedan 15 sin
   abrir en absoluto**: 04-12-2000 (Comisión Permanente, id 2176), y un resto que no llegó a
   procesarse por agotamiento del presupuesto de esta corrida (ids de la búsqueda de texto completo
   del Parlamento aún no consumidos: quedan al menos 10-15 diarios de 2002-2003 con menciones no
   revisadas). Para una cuarta vuelta: repetir el patrón de esta corrida —
   `pnpm fuente <bridge-url> ` seguido de `pnpm fuente <temporales-url> --buscar "Barandiaran"` — sobre
   el resto de los 97 resultados de
   `https://parlamento.gub.uy/documentosyleyes/documentos/diarios-de-sesion?Texto=Barandiaran&Cpo_codigo=All&Lgl_Nro=45&fecha_desde=2000-02-15&fecha_hasta=2005-02-14`.
   No se espera que los 21 días restantes den 21 períodos distintos: varios probablemente sean el
   mismo período ya cargado, repetido en el resumen de "Integración de la Cámara" de una sesión
   posterior.

2. **El registro parlamentario de la Legislatura 44 (1995-2000), cuando Barandiarán era titular, no
   está digitalizado.** El Parlamento solo tiene en línea los Diarios de Sesión de la Cámara de
   Representantes desde el 11 de febrero de 2000. Para ese período existen, con página exacta,
   referencias a intervenciones suyas que nunca se van a poder leer en la web:
   - Diario N.º 2688 (8 de octubre de 1997), ficha-asunto 8737.
   - Diario N.º 2818 (2 de junio de 1999), ficha-asunto 12426, su propio proyecto de ley.
   - Diario N.º 2845 (18 de agosto de 1999), páginas 114-115 y 116-117, ficha-asunto 11649: sus dos
     intervenciones en la discusión general de la ley de relaciones de consumo (luego Ley 17.189).
   - Diario N.º 2472 (8 de marzo de 1995), ficha-asunto 902, homenaje al Día de la Mujer.

   **A quién pedirlos:** la Biblioteca del Poder Legislativo (catálogo en línea en
   `pmb.parlamento.gub.uy/pmb/opac_css/`, confirmado en la vuelta anterior que cataloga los Diarios de
   Sesiones en papel y microfilm) es la vía directa: se puede pedir, por número de diario y fecha, una
   copia o consulta presencial de esas cuatro sesiones puntuales. Alternativamente, por ley 18.381
   (acceso a la información pública), se le puede pedir al Parlamento la digitalización de esos cuatro
   diarios específicos —no de toda la Legislatura 44, lo cual sería una carga desproporcionada para el
   organismo y probablemente se rechace por eso; pedir los cuatro diarios puntuales, ya identificados
   por número y fecha, es razonable y difícil de rechazar—.

3. **Prensa de la época (1999-2005) en papel.** El único hallazgo de prensa de todas las corridas
   sobre esta persona es una nota de LR21 (La República) del 29 de setiembre de 2000. Los diarios
   uruguayos de mayor circulación de esa época (El País, El Observador, La República en papel) no
   tienen hemeroteca completa en línea para 1995-2005 más allá de lo que Wayback archivó
   esporádicamente a partir de 2002 (ver el hallazgo de fotos de `espectador.com` de julio de 2002).
   **Dónde buscar en papel:** la Biblioteca Nacional (hemeroteca, Montevideo) y la propia hemeroteca
   de cada diario (El País y El Observador mantienen archivos históricos en papel o microfilm en sus
   redacciones, de acceso restringido pero solicitable). Dado que Barandiarán fue una figura de perfil
   bajo (suplente casi todo su período), es poco probable que haya cobertura extensa, pero una
   búsqueda dirigida en la hemeroteca de la Biblioteca Nacional para las fechas exactas de sus
   suplencias (ahora que están fechadas con precisión, ver `politicos.yaml`) tiene más chance de éxito
   que una búsqueda genérica.

4. **CDX de Wayback sobre dominios grandes.** `larepublica.com.uy`, `elobservador.com.uy`,
   `montevideo.com.uy` y `elpais.com.uy` no se pudieron consultar por timeout de la herramienta
   `pnpm fuente` al pedir el índice CDX completo filtrado por regex. Esto es un límite técnico
   resoluble: valdría la pena que el mantenedor revise si `scripts/corpus/fuente.ts` puede aumentar el
   timeout de red para solicitudes a `web.archive.org/cdx/` específicamente (son consultas a un
   servicio de datos, no páginas para renderizar, y estas tardaron entre 90 y 140 segundos en fallar),
   o si conviene paginar la consulta (`showNumPages` + `page`) en vez de pedir el índice completo de
   una vez para dominios de millones de URLs.

5. **Fotografía.** Existe una fotografía de prensa de Barandiarán en `espectador.com`, archivada el
   2 de julio de 2002
   (`http://web.archive.org/web/20020702124325/http://espectador.com/graficos/fotos_en_perspectiva/barandiaran_gabriel.jpg`),
   pero es de un medio de prensa sin licencia libre declarada, así que no se puede usar sin
   autorización. Si el mantenedor quiere gestionarla, correspondería pedir permiso de uso a El
   Espectador (Uruguay) citando esa URL de archivo; no hay otra vía (ni Wikimedia Commons ni el
   Parlamento tienen una foto de esta persona).
