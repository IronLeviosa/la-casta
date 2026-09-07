# Las otras puertas para un documento oficial de un caso penal o administrativo

Continúa a [`ministerio-interior.md`](./ministerio-interior.md). Documento de método: no
investiga a ninguna persona ni caso concreto. Cuando un ejemplo nombra a alguien es solo para
mostrar dónde vive el documento — no se repite ni se resume lo que ese documento dice sobre la
persona. El mismo criterio de búsqueda vale para cualquier político de cualquier partido (Regla 0).

Corrida: `2026-09-07-metodo-ministerio-interior`. Todas las URLs citadas se leyeron en esta sesión
con `pnpm fuente` (texto citable) o `WebFetch` (índices y aplicaciones, marcado en cada caso).
Registro completo en `inbox/metodo/ministerio-interior/2026-09-07/consultas.jsonl`.

---

## 3. Las otras puertas

### 3.1 Parlamento

#### Diarios de sesiones: interpelaciones y llamados a sala

Índice: [Diarios de sesiones](https://parlamento.gub.uy/documentosyleyes/documentos/diarios-de-sesion)
(Cámara de Representantes) y su equivalente de Senadores. Cubren, en HTML o PDF, la versión
completa de lo que se dijo en sala — no un resumen de prensa.

**Ejemplo real, leído entero con `pnpm fuente`** (373.503 caracteres): la
[32.ª Sesión Extraordinaria del Senado del 12 de octubre de 2022](https://infolegislativa.parlamento.gub.uy/temporales/20221012s0032ea321c7f-3f23-4f7c-a4ab-fc5df420cd88.html),
un llamado a sala al entonces ministro del Interior con la asistencia también del subsecretario, el
prosecretario de Presidencia y el director de la Secretaría de Inteligencia Estratégica del Estado.
Es la sesión del caso conocido públicamente como "caso Astesiano": ahí, un senador cita
textualmente el decreto que regula los antecedentes judiciales para explicar por qué el sistema que
se había consultado (SGSP, antecedentes **policiales**) no es el mismo que el Certificado de
Antecedentes Judiciales (antecedentes **judiciales**):

> El Sistema de Gestión de Seguridad Pública no es el denominado Certificado de Antecedentes
> Judiciales que lleva y expide la Dirección Nacional de Policía Científica. El Sistema de Gestión
> de Seguridad Pública refiere a antecedentes policiales, no a antecedentes judiciales.

Más adelante en la misma intervención, sobre el otro sistema:

> Sobre el certificado de antecedentes judiciales –también denominado por su sigla CAJ–, que
> expide la Dirección Nacional de Policía Científica, podemos decir que está regulado por el
> Decreto n.º 382/999, que refiere exclusivamente –ahora sí– a los antecedentes judiciales penales
> de una persona.

Esto es exactamente el tipo de documento que el brief que originó esta corrida menciona como "el
prontuario de una persona leído en el Senado": no está en ningún sitio del Ministerio del Interior
(Sección 2), pero está íntegro y con cita textual en el diario de sesiones.

Comisiones: el mismo tipo de documento, para el trabajo en comisión (no en el plenario), está en
[Versiones Taquigráficas de comisiones (Representantes)](https://parlamento.gub.uy/camarasycomisiones/representantes/comisiones/documentos/versiones-taquigraficas)
(índice, `WebFetch`) y su equivalente de Senadores. No se leyó un ejemplo de comisión con cita en
esta corrida — queda para una corrida futura si hace falta un caso concreto (ver `notas.md`).

#### El truco: `infolegislativa.parlamento.gub.uy/temporales/`

Esto es el hallazgo técnico central de esta corrida, verificado paso a paso.

**El problema.** La página "bonita" de un diario de sesiones —la que indexan los buscadores y la
que tiene una URL estable, del tipo
`parlamento.gub.uy/documentosyleyes/documentos/diarios-de-sesion/<id>/IMG`— no contiene el texto:
contiene un `<iframe>` que carga el documento real desde otro dominio. Se comprobó leyendo esa
página con `pnpm fuente`: devolvió **409 caracteres**, solo el pie de página del sitio, nada del
contenido de la sesión. Un extractor de texto (Readability, o cualquier herramienta que no ejecute
el DOM completo y siga el `iframe`) no trae nada útil de esa URL.

**Dónde está el texto de verdad.** Se descargó el HTML crudo de esa misma página con `curl` (sin
JavaScript) y se buscó la palabra `temporales` en el código fuente. Apareció, dentro de una
etiqueta `<iframe>` y, como respaldo, dentro de un `<a>`:

```html
<iframe id="documento" width="100%" height="100%"
        src="https://infolegislativa.parlamento.gub.uy/temporales/d4445fc2e9504-dafc-4bce-9eca-fdd2d34c3b4b.pdf"
        allowfullscreen></iframe>
<div><a href="https://infolegislativa.parlamento.gub.uy/temporales/d4445fc2e9504-dafc-4bce-9eca-fdd2d34c3b4b.pdf"
        target="_blank">Descargue el archivo para una mejor visualización </a></div>
```

Esa URL de `infolegislativa.parlamento.gub.uy/temporales/` **sí** trae el texto completo (307.351
caracteres en este ejemplo) cuando se lee con `pnpm fuente`. El navegador la renderiza embebida
dentro del visor de PDF de la página, así que un usuario que solo mira la pantalla no la ve como un
enlace suelto para copiar: hay que abrir el código fuente (`Ver código fuente` / `curl` / cualquier
lector de HTML crudo) para encontrarla. De ahí "el truco solo aparece en el código fuente".

**La URL es efímera — esto no estaba documentado antes de esta corrida.** Se pidió la misma página
puente tres veces seguidas con `curl` y cada vez devolvió un nombre de archivo distinto en
`/temporales/`:

```
d4445fc2e9504-dafc-4bce-9eca-fdd2d34c3b4b.pdf   (primera carga)
d444577743616-efdc-4f29-a3e0-f904f5b7350d.pdf   (pnpm fuente, misma URL puente)
d4445dd13784c-d58d-4e78-be28-e5a12e7d5ffc.pdf   (segunda carga manual)
d4445f284a2cc-b95a-4940-a1af-3bee904820a0.pdf   (tercera carga manual)
```

Las cuatro empiezan con `d4445` — que coincide con el número interno del diario ("NÚMERO 4445" en
el encabezado del propio PDF) — pero el resto del nombre es un UUID que el servidor genera de
nuevo en cada visita a la página puente. Se verificó también que una URL `/temporales/` ya
generada **sigue funcionando** más tarde (HTTP 200 varios minutos después), así que no hace falta
recargar la página puente para volver a leer un documento ya capturado — pero **no hay forma de
predecir o reconstruir esa URL sin haber visitado antes la página puente**, y un buscador no la va
a indexar de forma confiable para vos.

**Consecuencia práctica para el proyecto:**

1. Nunca citar la URL puente (`documentosyleyes/documentos/diarios-de-sesion/...`) esperando que
   `pnpm fuente` traiga el contenido: no lo trae.
2. Para leer un diario de sesiones (o cualquier documento parlamentario servido así — el mismo
   patrón apareció también bajo `legislativo.parlamento.gub.uy/temporales/` en otro documento visto
   en el corpus, así que no es exclusivo de `infolegislativa.`): abrir la página puente con `curl` o
   `WebFetch`, buscar `temporales` en el HTML, y pasar **esa** URL a `pnpm fuente`.
3. Una vez capturada, la URL de `/temporales/` sí es estable el tiempo suficiente para archivarla
   (Wayback) y citarla — pero como su nombre es un UUID sin significado, en la cita del registro
   conviene guardar también la URL puente de la que salió, para que alguien pueda reproducir el
   proceso si la copia de `/temporales/` deja de responder más adelante.
4. `pnpm fuente` ya resuelve esto automáticamente para las notas que están en el corpus (varias de
   las URLs `/temporales/` usadas en esta corrida ya estaban indexadas de corridas anteriores) —
   el problema es solo la primera vez que se encuentra un documento nuevo a través de la página
   puente.

#### Pedidos de informes (art. 118 Constitución) y sus respuestas

Base legal, leída con `pnpm fuente`
([Constitución](https://www.impo.com.uy/bases/constitucion/1967-1967)):

> Artículo 118 Todo Legislador puede pedir a los Ministros de Estado, a la Suprema Corte de
> Justicia, a la Corte Electoral, al Tribunal de lo Contencioso-Administrativo y al Tribunal de
> Cuentas, los datos e informes que estime necesarios para llenar su cometido. El pedido se hará
> por escrito [...]

Índice para rastrear pedidos por organismo o por asunto:
[Pedidos de Informe (Senado, por asunto)](https://parlamento.gub.uy/camarasycomisiones/senadores/plenario/documentos/pedidos-informe/por-asunto)
(índice, `WebFetch`, 2026-09-07): 265 pedidos registrados, con pestañas "Por Organismo" / "Por
Asunto", exportables en CSV/JSON. Cada pedido linkea a una `ficha-asunto` con su estado ("Acusa
recibo", "Se da cuenta al Cuerpo"). Una ficha suelta puede traer poco texto propio (se probó con
`pnpm fuente` sobre una ficha de 2020 y devolvió solo 325 caracteres, sin la respuesta adjunta) —
la respuesta en sí casi siempre está en un PDF aparte.

**Ejemplo real de una respuesta completa**, leído con `pnpm fuente`:
[documentos.diputados.gub.uy/docs/L50/Original/00731.pdf](https://documentos.diputados.gub.uy/docs/L50/Original/00731.pdf)
(23.111 caracteres) — nota firmada por el Ministro del Interior, mayo de 2025, en respuesta a un
pedido de informes de un Representante Nacional, con la cadena completa (pedido → Presidencia de
la Cámara → Ministerio → respuesta), invocando expresamente el art. 118 de la Constitución y la
Ley N° 17.673. Esto confirma que **las respuestas a pedidos de informes de un ministerio viven en
el dominio `documentos.diputados.gub.uy` (Cámara de Representantes) o su equivalente de Senadores**,
no en el propio sitio del ministerio — otra puerta más que Sección 1 no cubre.

También aparecen respuestas leídas directamente en sala y transcriptas en el diario de sesiones
(ver ejemplo de arriba, donde el propio diario del 12/10/2022 registra que "El Ministerio de
Transporte y Obras Públicas remite respuesta a un pedido de informes de los señores senadores").

#### Repartidos

Los "Repartidos" (documentos que se reparten entre legisladores antes de una sesión: proyectos,
informes de comisión) también se indexan en `parlamento.gub.uy/documentosyleyes/documentos/repartidos`.
No se leyó un ejemplo con cita en esta corrida; se deja anotado como puerta existente para una
corrida que sí investigue un caso concreto (ver `notas.md`).

---

### 3.2 Fiscalía General de la Nación

**Corrección de método:** el dominio `fiscalia.gub.uy` (con URLs viejas del tipo
`/innovaportal/v/...`), que es el que suele aparecer en resultados de búsqueda y en citas de
prensa de años anteriores, está **caído**: se probó `http://www.fiscalia.gub.uy`,
`https://www.fiscalia.gub.uy` y `https://fiscalia.gub.uy` con `curl` y las tres devuelven "connection
refused", no un redirect. El sitio vigente es
[gub.uy/fiscalia-general-nacion](https://www.gub.uy/fiscalia-general-nacion/) (mapa de navegación
leído con `WebFetch`, 2026-09-07), con la misma estructura estándar de `gub.uy`: Comunicación
(noticias, comunicados, publicaciones, convocatorias), Institucional, Trámites, Transparencia,
Datos y Estadísticas.

- **Comunicados**: [gub.uy/fiscalia-general-nacion/comunicacion/comunicados](https://www.gub.uy/fiscalia-general-nacion/comunicacion/comunicados) —
  pronunciamientos institucionales (ej. situación edilicia, incidentes de ciberseguridad,
  comunicados sobre casos de alta cobertura como "República Ganadera" o "Conexión Ganadera";
  índice leído, no se citó ninguno con texto).
- **Noticias**: es el canal donde Fiscalía anuncia formalizaciones e imputaciones caso por caso.
  Ejemplo real, leído con `pnpm fuente`:
  [Tres imputados por rapiña](https://www.gub.uy/fiscalia-general-nacion/comunicacion/noticias/tres-imputados-rapina)
  (Fiscalía Departamental de Rocha, 13/11/2024):

  > La Fiscalía Departamental de Rocha de Primer turno, a cargo de la fiscal Josefina García,
  > solicitó la formalización de la investigación de tres adultos por la rapiña a un hombre de una
  > matera con $800.000 en la ciudad de Rocha el pasado 4 de noviembre.

  Cada noticia de formalización suele traer, como descarga adjunta, el PDF de la "Solicitud de
  formalización" presentada ante el juzgado — otro documento primario más, dentro del mismo canal.

---

### 3.3 Poder Judicial

`poderjudicial.gub.uy` **no** está en la plantilla estándar de `gub.uy` (es un poder del Estado
aparte, con su propio sitio). Dos puertas distintas:

1. **Base de Jurisprudencia Nacional Pública (BJN)**: buscador de sentencias en
   `bjn.poderjudicial.gub.uy/BJNPUBLICA/busquedaSimple.seam`. Confirmado con `WebFetch`
   (2026-09-07): es una aplicación Java/JSF vieja (Ajax4jsf) que **requiere JavaScript** para
   funcionar — no es apta para `pnpm fuente` ni para lectura automática; hay que usarla desde un
   navegador. Según la propia institución (nota institucional vista en la búsqueda web), la BJN
   superó las 100.000 sentencias publicadas y cubre juzgados de primera instancia en lo civil,
   ampliándose progresivamente; **no** es un espejo completo de toda sentencia del país.
2. **Sentencias sueltas como PDF**, fuera de la BJN, en `poderjudicial.gub.uy/sites/default/files/`.
   Se leyó un ejemplo con `pnpm fuente` para confirmar que el dominio sirve el texto completo sin
   bloqueos:
   [sentencia1079.pdf](https://www.poderjudicial.gub.uy/sites/default/files/2025-09/sentencia1079.pdf)
   (59.179 caracteres, sentencia de la SCJ de noviembre de 2022 sobre un litigio laboral, sin
   relación con ningún político del sitio — se usó solo para comprobar el acceso al dominio).

Para encontrar la sentencia de un caso concreto sin conocer de antemano el nombre del archivo, la
vía es la BJN (con navegador) o el expediente citado en una noticia de prensa/Fiscalía, que suele
traer la referencia (IUE, número de sentencia) necesaria para localizarla.

---

### 3.4 Presidencia

Cubre tres capas, según el mandato:

1. **Sitio actual**: [gub.uy/presidencia](https://www.gub.uy/presidencia/) (mapa de navegación
   leído con `WebFetch`): Comunicación → Noticias, Sala de medios, "Discursos del Presidente"
   (`/comunicacion/publicaciones`); Normativa (leyes, decretos, resoluciones, proyectos de ley);
   Transparencia. La página no trae enlaces visibles hacia los subdominios de abajo — hay que
   conocer la ruta.
2. **`medios.presidencia.gub.uy`**: documentos y discursos del mandato en curso, y el repositorio
   legal de resoluciones (`/legal/<año>/resoluciones/<mes>/`, ver ejemplo en Sección 2 de
   `ministerio-interior.md`). La raíz del dominio da **403** (bloquea listado de directorio) pero
   las rutas profundas se leen bien — confirmado en esta corrida con el PDF de resolución citado
   arriba.
3. **`archivo.presidencia.gub.uy`**: mandatos anteriores. También 403 en la raíz. Tiene al menos
   dos estructuras internas distintas según la época: una vieja, `/_web/noticias/<año>/<mes>/...`
   (se confirmó funcionando para 2005, mandato de Vázquez I) y otra más nueva del tipo
   `/tav_portal/<año>/noticias/...` (vista en el corpus para 2023, ya en `medios.presidencia.gub.uy`
   en vez de `archivo.`). Ejemplo real, leído con `pnpm fuente`:
   [archivo.presidencia.gub.uy/_web/noticias/2005/08/2005081003.htm](http://archivo.presidencia.gub.uy/_web/noticias/2005/08/2005081003.htm)
   (51.864 caracteres) — la desgrabación **completa** de una conferencia de prensa de Tabaré
   Vázquez y Hugo Chávez, agosto de 2005, con preguntas y respuestas íntegras, no un resumen.

Esto confirma lo que ya señalaba `investigador.md` sobre la diferencia de escala entre la gacetilla
de prensa y el documento oficial: acá el ejemplo de un mandato de hace veinte años ya trae más de
50.000 caracteres de transcripción textual.

---

### 3.5 IMPO — normativa de referencia

Todas las normas de esta sección se leyeron con `pnpm fuente` en esta corrida (2026-09-07):

| Norma | URL | Para qué sirve en un caso penal/administrativo |
|---|---|---|
| Constitución, art. 118 | [impo.com.uy/bases/constitucion/1967-1967](https://www.impo.com.uy/bases/constitucion/1967-1967) | Base del pedido de informes a ministros |
| Código Penal (ley 9.155) | [impo.com.uy/bases/codigo-penal/9155-1933](https://www.impo.com.uy/bases/codigo-penal/9155-1933) | Tipifica los delitos que un caso puede involucrar |
| Código del Proceso Penal (ley 19.293) | [impo.com.uy/bases/codigo-proceso-penal-2017/19293-2014](https://www.impo.com.uy/bases/codigo-proceso-penal-2017/19293-2014) | Fija cuándo el proceso es público y cuándo la investigación preliminar es reservada (arts. 9, 135, 259 — ver abajo) |
| Decreto 382/999 | [impo.com.uy/bases/decretos/382-1999](https://www.impo.com.uy/bases/decretos/382-1999) | Certificado de Antecedentes Judiciales; reserva del legajo policial (ver `ministerio-interior.md` Sección 2) |
| Ley 18.331 | [impo.com.uy/bases/leyes/18331-2008](https://www.impo.com.uy/bases/leyes/18331-2008) | Protección de datos personales; excluye de su régimen a las bases de seguridad pública (art. 3) |
| Ley 18.381 | [impo.com.uy/bases/leyes/18381-2008](https://www.impo.com.uy/bases/leyes/18381-2008) | Acceso a la información pública; régimen de reserva y confidencialidad (arts. 8, 9, 10) |
| Decreto 232/010 | [impo.com.uy/bases/decretos/232-2010](https://www.impo.com.uy/bases/decretos/232-2010) | Reglamenta la ley 18.381; lista taxativa de qué debe difundirse en transparencia activa (art. 38, 40) |

El Código del Proceso Penal es la pieza que le da marco a todo lo anterior — explica por qué existe
una etapa reservada (la "indagatoria preliminar") y quién decide cuándo se levanta:

> Artículo 9 (Publicidad y contradicción; principio acusatorio). El proceso penal será público y
> contradictorio en todas sus etapas, con las limitaciones que se establecen en este Código.
>
> Artículo 135 (Publicidad). Las audiencias que se celebren una vez concluida la investigación
> preliminar serán públicas, salvo que el tribunal decida lo contrario por alguno de los siguientes
> motivos: a) por consideraciones de orden moral, de orden público o de seguridad; b) cuando medien
> razones especiales para preservar la privacidad y/o dignidad de las personas intervinientes en el
> proceso.
>
> Artículo 259 (Reserva de las actuaciones de investigación). La actividad desarrollada en la
> indagatoria preliminar para reunir medios de prueba que posibiliten la ulterior iniciación del
> proceso no se integrará en ningún caso a este [...]

La misma lógica que el Decreto 382/999 aplica al legajo policial (reservado hasta que se convierte
en Certificado de Antecedentes) y que la Resolución UAIP 54/026 aplica a una investigación
administrativa (reservada mientras dura la instrucción, pública una vez terminada): **el patrón se
repite en todo el sistema — reserva durante la etapa de instrucción, publicidad después**, y es ese
punto de quiebre el que hay que ubicar para saber si el documento ya debería estar disponible.

---

## 4. Acceso a la información pública (ley 18.381)

Esta sección es, según el brief, **una vía para el mantenedor, no para un agente**: ningún agente
de este proyecto presenta un pedido de acceso a la información. Se documenta el mecanismo para que
el mantenedor lo use cuando corresponda, y para que el editor sepa cómo entra la respuesta al
esquema del sitio.

**Quién lo administra**: la [Unidad de Acceso a la Información Pública (UAIP)](https://www.gub.uy/unidad-acceso-informacion-publica/)
es el organismo de control de toda la ley — recibe copia de cada resolución de reserva (art. 9,
plazo 5 días hábiles) y resuelve reclamos, como el ejemplo de la Resolución 54/026 ya citado.

**Cómo se pide**:

- Cada organismo tiene su propio formulario de solicitud (ej. el del Ministerio del Interior,
  [gub.uy/ministerio-interior/solicitud-acceso-informacion](https://www.gub.uy/ministerio-interior/solicitud-acceso-informacion),
  leído con `pnpm fuente` — trae la cláusula de protección de datos personales del solicitante, no
  el formulario en sí).
- El catálogo general de trámites tiene una entrada genérica,
  [gub.uy/tramites/acceso-informacion-publica-ley-ndeg-18381](https://www.gub.uy/tramites/acceso-informacion-publica-ley-ndeg-18381),
  leída con `pnpm fuente`: usa el Formulario 177 y confirma el plazo:

  > El plazo para responder a este tipo de solicitud es de 20 días hábiles a partir de la
  > petición, con opción a prórroga por otros 20 días hábiles en casos excepcionales.

  **Nota de método**: esta entrada genérica, al leerla sin elegir antes un organismo específico en
  el catálogo, devolvió el circuito de un organismo distinto (ANV) como si fuera el genérico — el
  catálogo de `tramites.gub.uy` parece resolver el "dónde se entrega" según el organismo que se
  haya seleccionado en la navegación previa, no hay una dirección única. Para pedir información a
  un organismo puntual conviene usar el formulario propio de ese organismo (como el del Ministerio
  del Interior arriba) en vez de la entrada genérica.

**Qué se puede pedir y qué no**: cualquier información en poder de un sujeto obligado se presume
pública (Ley 18.381, art. 4, ya citado en `ministerio-interior.md`), salvo que esté definida como
secreta por ley, o clasificada como reservada (art. 9: seguridad pública, defensa, negociaciones
internacionales, entre otras) o confidencial (art. 10: datos patrimoniales o económicos entregados
en ese carácter). La clasificación como reservada tiene que ser una resolución fundada y
caso por caso — no genérica, según el propio criterio de la UAIP visto en la Resolución 54/026.

**Cómo entra al sitio**: la respuesta a un pedido de acceso —sea la información pedida, sea una
resolución de reserva, sea un dictamen de la UAIP ordenando desclasificar— es, por definición, un
documento producido por un organismo público con fecha y firma: entra al esquema como
`tipo: documento_oficial`, habilitando `nivel: textual` sin necesitar una segunda fuente. Ejemplo
de cómo se vería citado: la propia Resolución 54/026 de la UAIP, ya usada en `ministerio-interior.md`
Sección 2.

---

## 5. Recomendaciones para las instrucciones

Estas son propuestas de texto para agregar a `.claude/agents/investigador.md` y
`.claude/agents/resolvedor.md`, a partir de lo que esta corrida encontró. No se editaron esos
archivos — quedan como propuesta para que el mantenedor decida.

### Para `.claude/agents/investigador.md`

Agregar, junto al bloque que ya existe sobre "conferencia de prensa, discurso, cadena nacional o
acto oficial" (que hoy cubre Presidencia), un bloque paralelo específico para casos penales y
administrativos:

> **Si el chequeo o la declaración involucra antecedentes, un sumario, una investigación
> administrativa o un dato de un caso penal: no te quedes con la nota de prensa sin buscar antes en
> estas puertas, en este orden:**
>
> 1. `pnpm corpus:buscar` con el nombre del caso y también con "pedido de informes", "interpelación"
>    y "llamado a sala" — el Parlamento suele traer, en un diario de sesiones, más detalle textual
>    que cualquier nota de prensa sobre el mismo hecho.
> 2. El diario de sesiones de Parlamento (`parlamento.gub.uy/documentosyleyes/documentos/diarios-de-sesion/`
>    o `.../camarasycomisiones/.../diario-de-sesion/`): **la página en sí casi no trae texto**
>    (es un visor embebido). Bajala con `WebFetch` o `curl`, buscá en el HTML la palabra
>    `temporales` (aparece dentro de un `<iframe src=...>` y de un `<a href=...>` de respaldo con el
>    texto "Descargue el archivo para una mejor visualización"), y pasale **esa** URL de
>    `infolegislativa.parlamento.gub.uy/temporales/...` (o `legislativo.parlamento.gub.uy/temporales/...`)
>    a `pnpm fuente`. Esa URL es efímera (un UUID nuevo cada vez que se carga la página puente) pero,
>    una vez capturada, se puede archivar y citar con normalidad.
> 3. Pedidos de informes (art. 118 Constitución): buscá en
>    `parlamento.gub.uy/camarasycomisiones/<camara>/plenario/documentos/pedidos-informe/por-asunto`
>    y seguí el link a la `ficha-asunto`; la respuesta del ministerio suele estar en un PDF aparte,
>    en `documentos.diputados.gub.uy/docs/<legislatura>/Original/...` o equivalente de Senadores —
>    es una nota firmada por el ministro, documento oficial completo.
> 4. Fiscalía: `gub.uy/fiscalia-general-nacion/comunicacion/noticias` (no `fiscalia.gub.uy`, que está
>    dado de baja) trae la formalización o imputación caso por caso, a veces con la solicitud de
>    formalización en PDF adjunto.
> 5. Poder Judicial: la Base de Jurisprudencia Nacional (`bjn.poderjudicial.gub.uy`) requiere
>    navegador (JavaScript) — no se puede leer con `pnpm fuente`; se usa para ubicar una sentencia,
>    no para citarla directamente. El texto de sentencias sueltas puede estar en
>    `poderjudicial.gub.uy/sites/default/files/...`.
> 6. Antes de resignarte a `nivel: reportado` con un solo grupo de medios, preguntate si el dato
>    viene de una etapa de instrucción que ya terminó: por norma (Decreto 382/999, art. 259 del
>    Código del Proceso Penal, criterio de la UAIP en materia de investigaciones administrativas
>    concluidas) lo que estaba reservado durante la instrucción suele volverse público apenas esa
>    etapa cierra. Si terminó, es más probable que el documento ya esté accesible en alguna de estas
>    puertas.

### Para `.claude/agents/resolvedor.md`

Agregar una lista de verificación específica para registros en `probable` por
`_faltante: dato_oficial` o `_faltante: segunda_fuente` cuando el tema es un caso penal o
administrativo, antes de darlos por agotados:

> Antes de dejar un chequeo o declaración de tema penal/administrativo en `probable` por falta de
> documento oficial, agotá esta lista (en este orden, cada una toma minutos, no horas):
>
> 1. `pnpm corpus:buscar` con el nombre del caso + "interpelación" / "pedido de informes" /
>    "llamado a sala" / "sesión extraordinaria".
> 2. El diario de sesiones de la fecha en que se conoció el hecho, y de las semanas siguientes —
>    es común que el tema se trate en Parlamento poco después de conocerse. Recordá el mecanismo de
>    `infolegislativa.parlamento.gub.uy/temporales/` (Sección 3.1 de este documento): la página
>    puente no alcanza, hay que extraer la URL real del código fuente.
> 3. `gub.uy/fiscalia-general-nacion/comunicacion/noticias` y `.../comunicados` para el estado
>    procesal (formalización, imputación, condena).
> 4. Si el reclamo es "por qué no está esto público", buscá si ya hay una resolución de la UAIP
>    sobre el mismo organismo y un pedido similar — la Resolución 54/026 muestra que la UAIP publica
>    sus propias resoluciones con el detalle del reclamo, y esas resoluciones son `documento_oficial`
>    igual que cualquier otra.
> 5. Si nada de esto aparece, ahí sí el registro queda en `probable` con `_faltante` — pero que sea
>    porque no existe, no porque no se buscó en estas puertas.

### Motivo de fondo

Las dos instrucciones de arriba comparten un mismo diagnóstico: el patrón que originó el brief —un
chequeo en `probable` pidiendo un documento que ya estaba a un clic— no fue un caso aislado de una
fuente difícil de encontrar, sino de una fuente que **no está donde el investigador la busca por
default** (el sitio del organismo) sino en una puerta lateral (Parlamento, Fiscalía, UAIP) que
además tiene, en el caso de Parlamento, una trampa técnica real (la página puente vacía). Corregir
esto en las instrucciones baja el umbral de qué cuenta como "no encontré el documento oficial".

---

*Todas las URLs de este documento fueron leídas el 2026-09-07. Registro completo de búsquedas y
lecturas, en orden: `inbox/metodo/ministerio-interior/2026-09-07/consultas.jsonl`.*
