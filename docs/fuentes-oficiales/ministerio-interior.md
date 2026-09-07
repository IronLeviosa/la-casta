# Cómo se consiguen documentos oficiales: Ministerio del Interior

Documento de método, no de contenido. No investiga a ninguna persona ni caso: mapea dónde vive
cada tipo de documento oficial y cómo se llega a él. El criterio de búsqueda es el mismo para
cualquier político de cualquier partido — Regla 0 — y el mismo mapa sirve para leer a favor o en
contra de cualquiera.

Origen: un chequeo del Veracímetro quedó en `probable` pidiendo una segunda fuente para un dato
que en realidad tenía documento oficial disponible a un clic (un prontuario leído en el Senado).
Ver `docs/fuentes-oficiales/casos-penales.md` para las demás puertas (Parlamento, Fiscalía, Poder
Judicial, Presidencia, IMPO, acceso a la información pública) y las recomendaciones de proceso.

**Método de esta corrida:** primero `pnpm corpus:buscar` sobre el corpus existente; lo que no
cubría, `WebSearch` para ubicar la URL exacta; toda página que se cita con texto literal se leyó
con `pnpm fuente` en esta sesión (2026-09-07). Las páginas de navegación/índice (menús, listados,
aplicaciones) se leyeron con `WebFetch` porque no se citan literalmente, y así se marca en cada
caso. El registro completo, en orden, está en
`inbox/metodo/ministerio-interior/2026-09-07/consultas.jsonl`.

---

## 1. Qué publica el Ministerio del Interior y dónde

`gub.uy/ministerio-interior` usa la misma plantilla (Drupal) que el resto de `gub.uy`: cinco
familias de sección — Institucional, Políticas y Gestión, Trámites y Servicios, Datos y
Estadísticas, Comunicación — con las mismas rutas relativas en todos los organismos. Mapa completo
leído el 2026-09-07 vía `WebFetch` (índice de navegación, no se cita texto):
[gub.uy/ministerio-interior](https://www.gub.uy/ministerio-interior/).

El dominio viejo, `minterior.gub.uy` (con URLs `index.php?option=com_content...`), está dado de
baja: cualquier ruta de ese dominio redirige (HTTP 302) a `gub.uy/ministerio-interior/`. Páginas
que todavía se encuentran indexadas con ese dominio (buscadores, citas de prensa vieja) hay que
volver a ubicarlas en la estructura nueva.

### Resumen

| Sección | URL | Qué hay | Cobertura temporal | Leído esta corrida |
|---|---|---|---|---|
| Noticias | `/comunicacion/noticias` | Partes de prensa policial (operativos, detenciones, incautaciones) | ~13.717 notas al 07/09/2026, filtro hasta 1996 | sí, ejemplo abajo |
| Comunicados | `/comunicacion/comunicados` | Boletines internos (cursos, concursos, trámites administrativos) | listado estándar visible desde 16/07/2026 | sí, ejemplo abajo |
| Publicaciones | `/comunicacion/publicaciones` | Informes técnicos y estadísticos | desde 2023 en lo relevado | sí, ejemplo abajo |
| Convocatorias | `/comunicacion/convocatorias` | Concursos de cargos (no licitaciones) | 249 convocatorias, vigentes y no vigentes | índice (WebFetch) |
| Transparencia | `/institucional/transparencia` | Transparencia activa (art. 5/7 ley 18.381) y pasiva | — | sí, ejemplo abajo |
| Información pública | `/institucional/informacion-gestion/informacion-publica` | Organigrama, políticas de seguridad de la información | actualizado ago-2026 | sí, ejemplo abajo |
| Normativa | `/institucional/normativa` | Leyes, decretos, resoluciones, ordenanzas que involucran al MI | 1907–2026, 256 resultados | índice (WebFetch) |
| Datos y estadísticas | `/datos-y-estadisticas/*` + `catalogodatos.gub.uy` | Datasets abiertos, informes del Observatorio | desde 2012 (SGSP) | sí, ejemplo abajo |
| Visualizador criminal | `observatorioseguridad.minterior.gub.uy` (Pentaho) | Dashboard interactivo | — | aplicación, no citable con `pnpm fuente` |
| Trámites | `/tramites-y-servicios/tramites` | 121 trámites administrativos | — | índice (WebFetch) |

### Noticias

URL: [gub.uy/ministerio-interior/comunicacion/noticias](https://www.gub.uy/ministerio-interior/comunicacion/noticias)

Es la sección más grande del sitio (13.717 resultados al momento de la lectura, con filtro de año
que llega hasta 1996, aunque el grueso visible es de los últimos años). Publica partes de prensa
redactados por la Jefatura o Dirección que interviene en cada hecho: detenciones, formalizaciones,
resultados de operativos. Es la voz del Ministerio sobre un hecho, no un documento judicial.

Ejemplo real, leído con `pnpm fuente` el 2026-09-07:
[Esclarecen rapiña y procesan a dos hombres con múltiples antecedentes judiciales por hurto especialmente agravado](https://www.gub.uy/ministerio-interior/comunicacion/noticias/esclarecen-rapina-procesan-dos-hombres-multiples-antecedentes-judiciales)
(Jefatura de Policía de Artigas, 14/04/2026):

> El trabajo coordinado de la Dirección de Investigaciones Zona II, con apoyo de unidades
> operativas, permitió identificar, detener y llevar ante la Justicia a los responsables de una
> rapiña contra un adulto mayor, culminando con sus condenas a prisión efectiva.

### Comunicados

URL: [gub.uy/ministerio-interior/comunicacion/comunicados](https://www.gub.uy/ministerio-interior/comunicacion/comunicados)

No son partes de prensa sobre hechos delictivos: en el muestreo leído (2026-09-07) son avisos
administrativos internos — fechas de examen, apertura de sobres de licitación, cursos de ascenso.
El listado estándar, sin cambiar filtros, no retrocedía más allá del 16/07/2026 (no se exploró si
hay una paginación más profunda).

Ejemplo real, leído con `pnpm fuente`:
[Comunicado N° 28-2026 - E.P.E.B (Montevideo)](https://www.gub.uy/ministerio-interior/comunicacion/comunicados/comunicado-n-28-2026-epeb-montevideo)
(07/09/2026), texto completo (576 caracteres):

> ACTIVIDADES PENDIENTES DE MATERIAS Y FINALIZACIÓN DEL CURSO DE PASAJE DE GRADO DE CABO PARA
> SARGENTO EJECUTIVO PARA GRUPOS 1 Y 2.

### Publicaciones (informes)

URL: [gub.uy/ministerio-interior/comunicacion/publicaciones](https://www.gub.uy/ministerio-interior/comunicacion/publicaciones)

Acá viven los informes técnicos con autoría y metodología explícita, distintos de la noticia del
día. Ejemplo real, leído con `pnpm fuente`:
[Diagnóstico de los homicidios en Uruguay (2012-2022)](https://www.gub.uy/ministerio-interior/comunicacion/publicaciones/diagnostico-homicidios-uruguay-2012-2022)
(24/08/2023, autoría Emiliano Rojido, Ignacio Cano, Doriam Borges):

> En Uruguay, los registros policiales de homicidio se realizan en el Sistema de Gestión de
> Seguridad Pública (SGSP) del Ministerio del Interior. El SGSP es una herramienta informática que
> centraliza, desde 2012 y para todo el territorio nacional, datos sobre los eventos de seguridad
> pública de acuerdo con la legislación vigente.

Este mismo párrafo importa para la Sección 2: nombra la base de datos (SGSP) que más adelante
aparece como la que **no** se publica registro por registro.

### Transparencia activa (ley 18.381 art. 5/7; decreto 232/010 art. 38-40)

URL: [gub.uy/ministerio-interior/institucional/transparencia](https://www.gub.uy/ministerio-interior/institucional/transparencia)
(leída como índice, `WebFetch`). Declara responsables y contacto separados para transparencia
activa (`transparencia-activa@minterior.gub.uy`) y pasiva
(`atencionalciudadano@minterior.gub.uy`), e invoca el art. 7° de la ley 18.381 y el decreto
232/010.

El contenido obligatorio de transparencia activa está reglamentado en el
[Decreto N° 232/010](https://www.impo.com.uy/bases/decretos/232-2010), leído con `pnpm fuente`
(2026-09-07):

> Artículo 38 Información que debe ser difundida por todos los sujetos obligados.- Los sujetos
> obligados deberán difundir en sus sitios web la siguiente información, que deberá ser
> actualizada mensualmente: 1. Creación y evolución histórica del sujeto obligado...

Esa lista (estructura orgánica, presupuesto ejecutado, plantilla de personal, compras y
contrataciones, etc.) es la que llena
`/institucional/informacion-gestion` (memorias anuales, auditorías, comisiones de servicios,
presupuesto) y su subsección
`/institucional/informacion-gestion/informacion-publica`. Ejemplo real ahí, leído con
`pnpm fuente`:
[Organigrama](https://www.gub.uy/ministerio-interior/institucional/informacion-gestion/informacion-publica/organigrama)
(actualizado 14/08/2026), texto completo:

> Organigrama general del Ministerio del Interior según última rendición de cuentas.

(con el PDF descargable enlazado aparte). La misma subsección trae también la Política de
Seguridad de la Información, la Política de Gestión de Incidentes y la Política de Gestión del
Riesgo — documentos de gestión interna, no de casos.

### Normativa y resoluciones

URL: [gub.uy/ministerio-interior/institucional/normativa](https://www.gub.uy/ministerio-interior/institucional/normativa)
(índice, `WebFetch`): 256 resultados, filtro por tipo (leyes, decretos, resoluciones, ordenanzas,
instrumentos internacionales), año (1907–2026), mes y tema.

**Dato de método:** no todas las resoluciones que designa o rige al Ministerio del Interior viven
en su propio sitio. Las que llevan la firma del Presidente (todo acto de gobierno del Poder
Ejecutivo lo firma el presidente junto al ministro del ramo) se archivan en el repositorio legal de
Presidencia, bajo `medios.presidencia.gub.uy/legal/<año>/resoluciones/<mes>/`. Ejemplo real, leído
con `pnpm fuente`:
[medios.presidencia.gub.uy/legal/2025/resoluciones/03/min_23.pdf](https://medios.presidencia.gub.uy/legal/2025/resoluciones/03/min_23.pdf),
resolución de designación de un cargo en el Ministerio del Interior, marzo de 2025:

> VISTO: que con fecha 01 de marzo de 2025 y de conformidad con las disposiciones constitucionales
> vigentes, asume el cargo de Presidente de la República, el Señor Yamandú Ramón Orsi Martínez.

Y, en la parte resolutiva del mismo documento:

> 1o.-Desígnase a partir del 01 de marzo de 2025 como Encargada de la Dirección Nacional de
> Asistencia y Seguridad Social Policial, a la Señora Comisario General María Belen Camejo
> Molina...

`archivo.presidencia.gub.uy` y `medios.presidencia.gub.uy` dan **403** en la raíz (bloquean listado
de directorio) pero las rutas profundas se leen bien con `pnpm fuente` — se confirma en esta
corrida y se detalla en `casos-penales.md`.

### Datos y estadísticas: AECA / Observatorio Nacional sobre Violencia y Criminalidad

Puerta de entrada: [gub.uy/ministerio-interior/violencia-criminalidad](https://www.gub.uy/ministerio-interior/violencia-criminalidad)
(índice, `WebFetch`) — es el Área de Estadística y Criminología Aplicada (AECA), que centraliza los
indicadores que salen del SGSP. Reparte en tres canales:

1. **Informes y cifras**: `/ministerio-interior/tematica/cifras-observatorio` y
   `/ministerio-interior/comunicacion/publicaciones` (el "Diagnóstico de homicidios" de arriba es
   uno de estos).
2. **Datos abiertos**: [catalogodatos.gub.uy](https://catalogodatos.gub.uy), organización
   "TIC-Ministerio del Interior" / "Área de Estadística y Criminología Aplicada". Diez conjuntos de
   datos descargables (CSV/JSON/XLSX): violencia doméstica, delitos denunciados (desde enero 2013,
   trimestral), delitos sexuales, homicidios a mujeres, medidas alternativas, sistema carcelario, y
   cuatro capas geográficas (seccionales, comisarías, jefaturas, destacamentos de bomberos).
   Ejemplo real, leído con `pnpm fuente`:
   [Delitos Denunciados en el Uruguay](https://catalogodatos.gub.uy/dataset/ministerio-del-interior-delitos_denunciados_en_el_uruguay)
   (autor: Área de Estadística y Criminología Aplicada; creado 04/09/2023, actualizado 29/07/2026,
   frecuencia trimestral). Este dataset es agregado (conteos por variable), no un listado de casos
   individuales.
3. **Visualizador interactivo**: `observatorioseguridad.minterior.gub.uy` (Pentaho). Confirmado con
   `WebFetch` (2026-09-07): es un dashboard público sin login, pero es una aplicación con
   filtros/gráficos — **no un documento citable**. Sirve para explorar tendencias, no para extraer
   una cita literal con `pnpm fuente`.

### Trámites

URL: [gub.uy/ministerio-interior/tramites-y-servicios/tramites](https://www.gub.uy/ministerio-interior/tramites-y-servicios/tramites)
(índice, `WebFetch`): 121 trámites, casi todos administrativos internos del personal policial
(panteón policial, asistencia médica de hijos de funcionarios, jubilación, hospital policial,
certificación de sistemas contra incendios). En la muestra relevada no aparece un trámite de
"antecedentes" o "certificado" — ese trámite existe, pero cuelga del catálogo general de
`gub.uy/tramites`, no del listado propio del Ministerio (ver Sección 2).

---

## 2. Qué no publica y por qué

Lo que el Ministerio del Interior **no** publica —legajos, sumarios administrativos, prontuarios,
el contenido caso por caso del SGSP— no es una omisión: está reservado por norma expresa, y lo que
sí llega a ser público sale por otras puertas (comunicado, lectura en el Parlamento, respuesta a un
pedido de informes, o una resolución de la Unidad de Acceso a la Información Pública que ordena
desclasificar).

### La norma: qué es reservado y por qué

[Decreto N° 382/999](https://www.impo.com.uy/bases/decretos/382-1999) (07/12/1999) regula el
"Certificado de Antecedentes Judiciales" y, de paso, fija el estatuto de reserva de los legajos
internos. Leído con `pnpm fuente` (2026-09-07):

> Artículo 2 Los datos de los prontuarios existentes en las distintas dependencias del Ministerio
> del Interior, son por principio reservados, quedando su uso limitado a las instituciones del
> Estado.

Es decir: el prontuario/legajo policial (lo que hoy vive en el SGSP) es reservado **por
principio**, de uso interno del Estado. Lo único que se expide hacia afuera es un certificado
acotado:

> Artículo 3 Cuando se extienda un "Certificado de Antecedentes Judiciales", solamente se podrán
> consignar en él, las resoluciones y sentencias judiciales que hubieren recaído sobre el
> individuo...

Y tiene vencimiento corto:

> Artículo 7 El Certificado de Antecedentes Judiciales caducará a los tres meses de ser expedido.

Ese certificado (CAJ) es un trámite personal — lo pide el propio interesado, con usuario gub.uy,
declarando el destino (solo organismos del Estado o consulados), y **no cualquiera puede pedir el
de otra persona**. Trámite leído con `pnpm fuente`:
[Certificado de antecedentes judiciales](https://www.gub.uy/tramites/certificado-antecedentes-judiciales)
(catálogo general de trámites, no listado propio del Ministerio):

> Indicar de forma precisa el destino del Certificado (sólo organismos del Estado y Consulares).

y, en el campo de plazos de la misma ficha:

> COMÚN: 15 días calendario posteriores a la audiencia. URGENTE: 2 días hábiles posteriores a la
> audiencia.

La sesión del 12 de octubre de 2022 del Senado (ver `casos-penales.md`) es la explicación, dicha en
sala por un senador, de por qué esto es un sistema distinto del legajo policial (SGSP): el CAJ solo
trae antecedentes **judiciales**, no policiales, y lo expide un organismo distinto (Policía
Científica) con un procedimiento distinto al de consultar el legajo interno.

La [Ley N° 18.331](https://www.impo.com.uy/bases/leyes/18331-2008) (protección de datos
personales) refuerza el mismo punto desde otro ángulo: en su artículo 3 (Ámbito objetivo), excluye
explícitamente de su propio régimen —es decir, deja regulado por norma especial, no por esta ley
general— a las bases de seguridad pública. Leído con `pnpm fuente`:

> No será de aplicación a las siguientes bases de datos: A) A las mantenidas por personas físicas
> en el ejercicio de actividades exclusivamente personales o domésticas. B) Las que tengan por
> objeto la seguridad pública, la defensa, la seguridad del Estado y sus actividades en materia
> penal, investigación y represión del delito.

Y la [Ley N° 18.381](https://www.impo.com.uy/bases/leyes/18381-2008) (acceso a la información
pública) es la que fija el mecanismo general para reservar cualquier información pública —no solo
la del Ministerio del Interior—, con control externo. Leída con `pnpm fuente`:

> Artículo 9 (Información reservada).- Como información reservada podrá clasificarse aquella cuya
> difusión pueda: A) Comprometer la seguridad pública o la defensa nacional. [...]

y, en el mismo artículo, la facultad de control de la Unidad de Acceso a la Información Pública:

> En todo momento, la Unidad de Acceso a la Información Pública podrá tener acceso a la
> información clasificada para evaluar la regularidad de su clasificación.

### El mecanismo funcionando: un ejemplo real, solo como procedimiento

Sin investigar el caso de fondo (Regla del brief: no investigar casos ni personas, solo mostrar
dónde vive el documento), hay un ejemplo público y completo del mecanismo de reserva/control en la
propia web de la Unidad de Acceso a la Información Pública (UAIP):
[Resolución N° 54/026 sobre reserva de información](https://www.gub.uy/unidad-acceso-informacion-publica/institucional/normativa/resolucion-n-54026-sobre-reserva-informacion),
leída íntegra con `pnpm fuente` (2026-09-07, 4.286 caracteres). Lo que documenta, en su mecánica,
sin repetir lo sustantivo del expediente subyacente:

> que el Ministerio considera que aplica al caso la Resolución Ministerial del año 2012 basada en
> los Literales A) y D), mediante la cual se reserva en forma genérica información que posee el
> organismo entre la cual se encuentran todos los procedimientos de investigación administrativa
> realizados en el marco del Decreto 500/91; que, por lo expresado considera necesaria su
> clasificación como información reservada por el término de 15 años; que, no se comparte este
> argumento del Ministerio, ya que se trata de la resolución genérica del 2012 que ha sido
> cuestionada por la Unidad en múltiples instancias

Y, más adelante en la misma resolución, la parte resolutiva:

> El Consejo Ejecutivo de la Unidad de Acceso a la Información Pública Resuelve Indicar que la
> reserva analizada no se ajusta a derecho y el Ministerio del Interior debe proceder a la
> desclasificación de esta en el marco de lo dispuesto en el artículo 9 de la Ley.

Lo que importa metodológicamente de este documento (expediente 2025-2-10-0000712, resolución
firmada el 04/03/2026):

1. Confirma que el Ministerio del Interior reserva investigaciones administrativas por defecto,
   apoyado en una resolución "genérica" de 2012 — y que ese uso genérico es justamente lo que la
   UAIP rechaza sistemáticamente (cita en la propia resolución sus propios antecedentes:
   Dictamen 2/011, Dictamen 17/013, Resolución 16/020, Resolución 20/022).
2. Fija un criterio reutilizable: **una investigación administrativa concluida es, en principio,
   pública** ("la resolución que dispone el inicio de una investigación administrativa no puede
   ser reservada, así como una vez que se dé por culminada la instrucción deberá levantarse la
   reserva").
3. Muestra que existe una vía de reclamo real y con resultado documentado — no solo la norma en
   abstracto — cuando el Ministerio se niega a entregar algo que corresponde ser público.

### Lo que sí queda público pese a la reserva interna

El legajo no se publica, pero **lo que se dice sobre él en otro canal oficial sí**, y con más
detalle del que suele parecer:

- **Un comunicado del Ministerio** (Sección 1) — normalmente escueto, sin el expediente.
- **Lo que un ministro lee o responde en el Parlamento** — interpelaciones y pedidos de informes
  (art. 118 Constitución) obligan al Ministerio a explicar, con nombres de norma y de sistema, algo
  que en su propio sitio nunca vas a encontrar desagregado. Ejemplo real (desarrollado en
  `casos-penales.md`): la sesión del Senado del 12/10/2022 contiene una explicación línea por línea
  de la diferencia entre el legajo policial (SGSP) y el Certificado de Antecedentes Judiciales,
  con cita textual del decreto 382/999, dicha en sala por un senador de la oposición y no
  contradicha por el ministro presente.
- **Una respuesta escrita a un pedido de informes** (art. 118) — el Ministerio contesta por nota
  firmada por el propio ministro, y esa nota es un documento oficial completo, no un resumen de
  prensa. Ejemplo real en `casos-penales.md`.
- **Una resolución de la UAIP** cuando alguien reclama el acceso y la Unidad le da la razón, como
  el ejemplo de arriba.

Este es el punto que originó el brief: un chequeo se había quedado pidiendo "documento oficial"
cuando el documento oficial ya estaba disponible en uno de estos canales alternativos, no en la web
del Ministerio. El detalle de cada puerta, con ejemplos leídos y el truco de
`infolegislativa.parlamento.gub.uy/temporales/`, está en
[`docs/fuentes-oficiales/casos-penales.md`](./casos-penales.md).

---

*Todas las URLs de este documento fueron leídas el 2026-09-07. Registro completo de búsquedas y
lecturas, en orden: `inbox/metodo/ministerio-interior/2026-09-07/consultas.jsonl`.*
