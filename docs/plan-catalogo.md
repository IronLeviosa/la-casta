# Plan: catálogo primero — barrer la prensa, catalogar cada documento una sola vez, y recién después investigar por tema

Estado: decidido por el mantenedor el 2026-09-16, a partir del Veracímetro de Astori (6 chequeos, 1
publicado). Escribe Fable; las herramientas las implementa Sonnet en el taller; el piloto lo corre
Opus después de cerrar Batlle y mergear el taller. Supuestos fijados por el mantenedor:

- Primero volumen. Con seis chequeos por persona no se puede decir nada; la regla de los `probable`
  (verde y rojo solo con documento oficial) **no se toca ahora**: se revisa cuando haya suficientes.
- Haiku para el filtro grueso de todo lo que se encuentre; una segunda pasada (Haiku de nuevo, o
  Sonnet donde haga falta) solo sobre lo que pasó el filtro, para catalogar mejor antes de que nadie
  investigue.
- Cada documento o nota se cataloga **una sola vez, para todos los políticos que menciona**, y se
  guarda con todo lo que después hace falta. Primero se cataloga todo; después se analiza. Nunca se
  vuelve a pasar por Haiku un documento ya catalogado por haber aparecido otro nombre.
- Las corridas salen de lo que el catálogo muestra que existe, no de un tema elegido de antemano. Quien
  orquesta mira todos los temas de la persona, decide qué agente ataca cada uno y cómo, y parte un
  tema en períodos cuando no entra en un contexto.
- **Catálogo total, no filtrado** (mantenedor, 2026-09-16, segunda ronda): pasa por Haiku **cada nota
  o documento que se encuentre**, no solo los que nombran a alguien en el título o la URL, y de cada
  uno se guarda un resumen bien corto, la fecha de publicación, las fechas mencionadas adentro, cada
  persona, cada empresa, cada ley y cada tema, de forma que cuando se busque por persona se encuentre
  rápido sin volver a leer el documento. El filtro por alias en el título queda solo como modo de
  emergencia si el catálogo total resulta impagable. Se prueba primero con un tramo corto para medir
  cuánto tarda Haiku y cuánto consume; si es accesible, se sigue hacia atrás hasta tener toda la
  historia catalogada, y recién ahí se vuelve a empezar con lo que se hace hoy. Puede correr en
  paralelo a las corridas actuales: no toca `content/` ni necesita Wayback.
- Las asimetrías que esto genere mientras se itera se aceptan: el repo es privado y todavía no se sabe
  si es posible cubrir a todos como se quiere. Cuando el pipeline correcto exista (mejores resultados
  con un consumo razonable), se rehacen **todos** los políticos y empresas de cero, con las mismas
  reglas para todos. Ese es el estado final que respeta la Regla 0; el intermedio queda escrito acá.

## El problema, con números (2026-09-16)

| | |
|---|---|
| notas en el corpus | 38.535 |
| notas que mencionan a Astori (coincidencia de alias) | 1.013 |
| de esas, prensa (El País, El Observador, Montevideo Portal, la diaria) | 33 |
| de esas, con fecha conocida | 57 |
| de esas, etiquetadas por Haiku (no solo por alias) | 0 |
| declaraciones publicadas de Astori · con una cifra en la cita | 26 · 5 |
| chequeos de Astori · publicados | 6 · 1 |

Las 1.013 son en su mayoría documentos de Presidencia (518) y diarios de sesiones (409) sin fecha,
etiquetados por nombre; las etiquetas de tema son ruido (un diario de sesiones «trata» de todo).
La cobertura de prensa de un ministro de Economía y vicepresidente en quince años son 33 notas.
Nadie la barrió: el brief pide «qué dijo X sobre T» y el investigador abre unas veinte notas por
corrida. Lacalle Pou tiene más porque tuvo cinco corridas y una pasada específica de Veracímetro,
no porque el método escale.

Y hay una regla implícita que cambia: hoy un chequeo nace de una cifra dentro de una cita ya cargada
por un investigador que buscaba un tema. Con el catálogo, las afirmaciones con datos se extraen en
el momento de catalogar, para todos, y las corridas empiezan con la lista de candidatas hecha.

## Las cinco etapas

### A. Descubrir (mecánico, sin modelo)

`pnpm catalogo:descubrir <medio> [--desde AAAA-MM] [--hasta AAAA-MM] [--cdx] [--solo-alias]`:
enumera **todas** las URL de notas de un medio en ese período y las encola como trabajos `catalogar`
(cola del corpus, `scripts/cola.ts`), descartando lo que el corpus ya tiene (`idDeUrl`). Sin filtro
por defecto: el catálogo es total. `--solo-alias` (título o URL con un alias de alguna ficha) es el
modo de emergencia si el piloto 0 muestra que el total no se paga. Dos fuentes:

1. **Sitemaps** (`descubrir` de `scripts/lib/sitemaps.ts`, ya existe; hoy recorta a 500 y ordena por
   términos: para el catálogo se pide sin recorte y sin términos).
2. **Wayback CDX** por dominio (`cdx` de `scripts/corpus/inventario.ts`, generalizado a HTML) con el
   filtro de URL por slug de alias (`filter=original:.*<slug>.*`; verificar que la API lo acepte
   antes de contar con él), para los medios sin sitemap o con sitemap corto. Pasa por el cupo de
   Wayback y **no se corre mientras una corrida necesita Save Page Now**: el 2026-09-16 el índice de
   diarios dejó la IP con 429 durante horas.

3. **Archivos históricos** (mantenedor, 2026-09-16: «quizás hay diarios y radios que ya murieron y
   solo se puedan encontrar en ese tipo de páginas»). Cubren lo que ningún sitemap alcanza (los
   sitemaps de la prensa viva arrancan en 2003 en el mejor caso) y la prensa que ya no existe:
   - **Anáforas** (`anaforas.fic.edu.uy`, FIC-Udelar, DSpace; medido el 2026-09-16): 102.915 ítems
     enumerables por sitemap (`/jspui/sitemap?map=0..2`), comunidad «Publicaciones periódicas del
     Uruguay» con Diarios, Semanarios, Revistas, Primeros impresos, Otros impresos, Prensa de
     mujeres, Historietas y Fanzines (La Prensa, Última Hora, Marcha, El Siglo…). Cada ítem es un
     ejemplar: metadatos Dublin Core (título, `dc.date.issued`) y un PDF de unos 4,5 MB **con capa de
     texto** (dos probados: El Centinela 1843, 19.219 caracteres en 4 páginas; The Montevideo Times
     1914, 55.052 en 8; OCR de época, con errores, pero buscable). Sin OAI ni REST; `robots.txt`
     permite `handle`, `bitstream` y `browse` con `Crawl-delay: 5`, y prohíbe `simple-search` y
     `discover`. Con dos pedidos por ejemplar y 5 s entre pedidos, todo Anáforas son unos doce días
     de barrido cortés; los PDF no se guardan (450 GB), se guarda el texto (unos pocos GB). Orden:
     Diarios y Semanarios de 1955 en adelante primero (es donde empiezan las trayectorias de los cinco
     presidentes), después el resto hacia atrás.
   - **sitiosdememoria.uy** (Comisión de Sitios de Memoria, Drupal, sitemap propio): unos 4.000
     ejemplares de prensa 1907–2008 en `/prensa-completa`, sesgados hacia la prensa crítica por
     diseño, más causas y sentencias. Mismo tratamiento; la sección de prensa se enumera desde su
     sitemap y se cataloga con la marca de origen.
   - **Hemeroteca de la Biblioteca del Parlamento** (diarios de sesiones desde 1830) y la colección
     de archive.org ya indexada (`data/diarios-archive.json`): ya están en el corpus o llegan por
     `pnpm sesion`; el catálogo las cataloga como a cualquier documento.
   - **Prensa digital muerta** (Últimas Noticias, El Diario, versiones viejas de portales): solo en
     Wayback; el CDX por dominio del punto 2 es exactamente para eso, cuando la IP deje de estar
     limitada.
   - **Radio y televisión viejas**: no están en estos archivos (Anáforas es prensa impresa). Lo que
     existe en línea es reciente (En Perspectiva desde 2015, sitemap de 58.472 URL) o son
     transcripciones en prensa. El Archivo Nacional de la Imagen y la Palabra (SODRE) no publica su
     acervo en línea de forma enumerable; queda anotado como hueco declarado, no como omisión.

Primer entregable, antes de gastar nada: `docs/fuentes-prensa.md`, una tabla por medio de
`content/medios/` con dominio, si tiene sitemap y desde qué año, cuántas URL devuelve el CDX por
año, y qué cubre `robots.txt`. Presidencia y Parlamento ya están en el corpus (927 documentos de
Astori) y no se vuelven a bajar.

### B. Catalogar (Haiku, trabajo `catalogar` del worker)

Por cada URL encolada, el mismo camino que `pnpm fuente` (bajar, extraer, guardar, indexar;
`--sin-archivo`: Save Page Now lo pide después un trabajo `archivar` de fondo, a su ritmo de uno
cada 3 s, para que no marque el paso del catálogo) y dos pasadas de modelo:

**Pasada 1, filtro grueso** (el etiquetador de hoy, Haiku, `.claude/agents/etiquetador.md`, con tres
claves más en su JSON):
- `relevancia`: por cada político confirmado, `central` (la nota es sobre lo que dijo o hizo),
  `secundaria` (aparece con una cita o una decisión propia) o `mencion` (nombrado al pasar).
- `tiene_afirmaciones`: si hay citas de algún político con cifras, fechas, comparaciones, promesas o
  posiciones atribuibles.
- `fecha_texto`: la fecha de publicación que el propio texto declara, cuando la nota no la trae o la
  contradice (los documentos de Presidencia y los diarios de sesiones sin fecha: 956 de las 1.013 de
  Astori).
- `fechas_mencionadas`: cada fecha que el cuerpo nombra (ISO, con la precisión que tenga: `2016`,
  `2016-10`, `2016-10-24`), para encontrar después «qué se dijo sobre octubre de 2016» sin releer.
- `empresas`: slugs de `content/empresas/` que la nota trata (mismo criterio que `temas`).
- `leyes`: cada ley o decreto que el cuerpo nombra por número (`{numero: "19.438", tipo: ley | decreto,
  nombre?}`), sin taxonomía previa: el número es el id.

Con eso, más `politicos_confirmados`, `temas`, `eventos` y el `resumen` de dos líneas, cada nota
queda catalogada para cualquier búsqueda posterior por persona, empresa, ley, tema o fecha, sin
volver a leerla.

**Pasada 2, extracción** (rol nuevo `extractor`, Haiku; Sonnet solo para documentos de más de
60.000 caracteres, como un diario de sesiones), únicamente sobre notas con `relevancia` central o
secundaria y `tiene_afirmaciones`: devuelve `afirmaciones[]`, cada una
`{politico, cita, tipo: dato | promesa | posicion | mencion_a, tema, dato?: {que, valor, periodo},
fecha_dicho?}`. La `cita` es literal y contigua, y **se verifica mecánicamente contra el texto
guardado** antes de aceptarla (misma regla que `validar --red`): la que no aparece tal cual se
descarta y se cuenta. Un extractor que inventa citas se nota en ese contador.

Todo queda en la nota del corpus, `catalogo: {version, modelo, fecha, relevancia, afirmaciones,
descartadas}`, y en el índice (`scripts/corpus/indexar.ts`): tabla nueva `afirmaciones(nota,
politico, tema, tipo, cita, posicion, fecha)`. `version` es el hash del prompt más el esquema: una
nota se vuelve a catalogar solo si la versión cambió o con `--todas`. Así se cumple «una sola vez
para todos»: el catálogo es por nota, no por político.

### C. Informe por persona (mecánico)

`pnpm catalogo <politico> [--tema <t>] [--desde --hasta] [--json]`: sobre el índice,
- notas por tema y por tramo de cinco años, separando central de secundaria;
- afirmaciones por tema, tramo y tipo (cuántas `dato`, cuántas `promesa`…);
- la **propuesta de lotes**: uno por (tema, período), con como mucho 40 notas y 30 afirmaciones de
  tipo `dato` cada uno, partiendo el período hasta que entre. Ordenados por cantidad de `dato`: el
  Veracímetro primero.

Escribe `data/catalogo/<politico>.json` (público: es el rastro de qué se barrió, con medios, períodos
y fecha) y lo imprime como tabla. Es lo que lee quien orquesta para decidir qué corridas existen y
en qué orden; el rol que hoy elige un tema a mano pasa a elegir entre lo que el informe muestra.

### D. Corridas por lote (el pipeline de hoy, con el trabajo hecho de antemano)

`pnpm brief <politico> <tema> --lote <periodo>` arma el brief con la lista de notas del lote y sus
afirmaciones candidatas (cita, posición, tipo). El investigador ya no busca: abre cada nota con
`pnpm fuente <url> --buscar "<cita>"`, escribe la declaración o la promesa con la cita exacta, y por
cada `dato` busca el documento oficial para `dato_real` o marca `_faltante: dato_oficial`. Crítico
Opus, editor Sonnet con tope de 30 registros, `revisar antes`/`despues`: igual que hoy. Lo que
cambia es el rendimiento por corrida: de 8 notas abiertas y 6 chequeos a lotes armados con decenas
de candidatas ya localizadas.

### E. Simetría al final

Mientras se itera, `data/catalogo/<politico>.json` registra exactamente qué se barrió de cada
persona. Cuando el pipeline quede fijado, el mismo barrido (mismos medios, mismos períodos, mismo
extractor, misma versión) se corre para todas las personas y empresas de cero, y las corridas se
rehacen con las mismas reglas. Hasta entonces la asimetría existe y está declarada acá, no
escondida.

## Rendimiento: lo que el corpus de hoy ya enseñó

- El trabajo `reetiquetar` (determinista, sin Haiku) murió el 2026-09-16 a las 16:14 con un fallo
  nativo (código 3221225477, access violation) tras 10.379 de 38.535 notas y tres horas: una nota por
  segundo solo para etiquetar por alias e indexar en un `indice.db` de 1,3 GB. No tenía cursor: un
  reintento arranca de cero. Quedó en `cola/errores/` con el motivo.
- Haiku hoy corre con `claude -p --agent etiquetador`, un proceso por nota, en serie, con 5 minutos de
  tope; el único trabajo `etiquetar` terminado tardó 101 s. Sin API: es la sesión de Claude Code de
  esta máquina. A ese ritmo, diez mil notas son semanas.

Por eso el catálogo exige, antes de escalar:

1. **Cursor y reanudación**: todo trabajo largo guarda hasta dónde llegó en su YAML de la cola y
   reanuda desde ahí; un fallo nativo cuesta minutos, no horas.
2. **Varios trabajadores en paralelo** (`pnpm worker --tipo catalogar` por N, con la cola repartiendo
   por archivo, como hoy) y **varias notas cortas por llamada** a Haiku (un prompt con hasta 5 notas
   de menos de 4.000 caracteres, respuesta con un objeto por nota), medido contra una por llamada.
3. **Medir siempre**: por trabajo, segundos por nota y tokens por nota (`pnpm agentes` ya lee el
   modelo y el consumo de cada llamada) en `data/catalogo/rendimiento.json`.

### Pensamiento extendido: medido y apagado por defecto (2026-09-16)

`claude -p --agent etiquetador` con pensamiento extendido tarda 28,8 s de reloj (25,9 s solo de API)
y gasta 2.472 tokens de pensamiento para producir un JSON de catálogo de unos 200 tokens; sin
pensamiento (`MAX_THINKING_TOKENS=0`), 5,3 s de reloj y 2,8 s de API, con una respuesta que no sale
más corta por no pensar (al contrario: el JSON sin pensamiento midió más largo que el mismo JSON con
pensamiento en la nota de referencia). Dos `pnpm worker --tipo catalogar` en paralelo sostienen unos
6 s por nota cada uno sin frenarse entre sí: el cuello de botella es el proceso de Haiku, no la E/S de
red ni el disco. El caché de prompt del CLI ayuda poco acá: de una llamada a la siguiente solo se
reutilizan ~7.800 tokens y se recrean ~12.000, porque el prompt de sistema que arma el propio `claude`
cambia por proceso aunque la taxonomía vaya fija en `--append-system-prompt` — no hay control sobre
ese prompt de sistema desde este repo. Con esos números, el catálogo corre con el pensamiento apagado
por defecto (`envSinPensamiento` en `scripts/lib/ejecutable.ts`); para medir a propósito con
pensamiento, `MAX_THINKING_TOKENS=8000 pnpm worker …`.

**Comparación de calidad, no solo de velocidad**, sobre 10 notas de El País ya catalogadas el
2026-09-16 (6 de `informacion/politica`, con `tiene_afirmaciones: true` y algún político
`central`/`secundaria`, más 4 de otras secciones; script ad hoc en `.cache/comparar-pensamiento.mts`,
no forma parte del pipeline):

| nota (sección) | relevancia sin/con | tiene_afirm. sin/con | fechas sin/con | leyes sin/con | s API sin/con | tok. pensamiento con |
|---|---|---|---|---|---|---|
| 01119adf (política, Da Silva/Orsi/HIF) | igual (3 políticos) | true/true | 1/0 | 0/0 | 4,9/41,0 | 3.718 |
| 071d99e2 (política, Cosse) | igual (3 políticos) | true/true | 1/0 | 0/0 | 4,0/31,3 | 2.793 |
| c31063c6 (política, Sánchez/Orsi) | igual (3 políticos) | true/true | 1/1 | 0/0 | 5,0/28,6 | 2.077 |
| c38b8a6c (política, Gob.+FA/Lula) | **distinta**: Orsi central→mención, Mujica secundaria→mención, Rodríguez central→secundaria | true/true | 2/4 | 0/0 | 4,3/56,0 | 4.679 |
| f2c36e8d (política, encuesta Factum) | igual (1 político) | false/false | 3/3 | 0/0 | 3,1/47,2 | 4.352 |
| bc3a8670 (política, ley carcelaria) | igual (4 políticos) | true/true | 2/3 | 1/1 | 4,7/42,1 | 3.864 |
| 6738754f (negocios) | igual (ninguno) | false/false | 1/0 | 0/0 | 2,7/11,8 | 778 |
| 4056e2a8 (fútbol) | igual (ninguno) | false/false | 0/0 | 0/0 | 1,8/11,0 | 742 |
| 1bbf8e7e (bienestar) | igual (ninguno) | false/false | 0/0 | 0/0 | 1,9/10,4 | 784 |
| f4238212 (mundo) | igual (ninguno) | false/false | 2/1 | 0/0 | 2,6/20,0 | 1.678 |

Relevancia y `tiene_afirmaciones` coinciden en 9 de 10 notas; la única discrepancia (c38b8a6c) es un
recorte de relevancia con pensamiento, no una mejora: bajó a tres políticos que la corrida sin
pensamiento sí había marcado central o secundaria, sin ninguna razón visible en el texto. `fechas
mencionadas` no muestra un ganador consistente (a veces suma más una corrida, a veces la otra).

Sobre el extractor, corrido con y sin pensamiento en las 5 notas con `tiene_afirmaciones: true` (mismo
método, `armarPromptExtractor` + `interpretarRespuestaExtractor`, verificando cada cita con
`buscarCita().exacta`):

| nota | crudas sin/con | exactas sin/con | descartadas sin/con | s API sin/con |
|---|---|---|---|---|
| 01119adf | 7/8 | 7/8 | 0/0 | 7,9/111,5 |
| 071d99e2 | 8/8 | 8/8 | 0/0 | 6,6/44,5 |
| c31063c6 | 5/5 | 4/5 | 1/0 | 4,6/28,8 |
| c38b8a6c | 16/9 | 10/6 | 6/3 | 17,7/30,3 |
| bc3a8670 | 5/5 | 5/5 | 0/0 | 8,6/50,2 |

Las llamadas con pensamiento tardaron entre 1,7 y 14 veces más que sin pensamiento (promedio ≈ 6,7×,
34 s API extra en promedio por nota). La cobertura fue pareja o mejor con pensamiento en 4 de las 5
notas (igual o una afirmación exacta más), pero claramente peor en la nota más larga y compleja del
lote (c38b8a6c, 9.758 caracteres): 10 afirmaciones exactas sin pensamiento contra 6 con pensamiento —
la misma nota donde el etiquetador con pensamiento también degradó la relevancia de tres políticos.
Con pensamiento costando siempre más tiempo, sin ganancia sistemática de cobertura y con al menos un
caso donde empeora tanto la relevancia como la extracción, la decisión (apagado por defecto) se
sostiene también nota por nota, no solo en el agregado.

## Piloto 0: un mes de todo (antes que cualquier otra cosa)

Un solo medio con sitemap completo (El País, si el inventario de la etapa A lo confirma), **un mes
entero, todas las notas, sin filtro**, por las dos pasadas. Mide:

| medida | para qué |
|---|---|
| notas del mes en el sitemap | cuánta prensa hay por mes en un diario nacional |
| segundos por nota y notas por hora, en serie y con 4 trabajadores | si el CLI aguanta el catálogo total |
| tokens de entrada y salida por nota, y costo | extrapolar a cinco años y a toda la historia |
| notas con al menos una persona con ficha · con relevancia central o secundaria · con afirmaciones | qué fracción de la prensa nos importa, y cuánto ahorra el filtro por alias si hiciera falta |
| citas descartadas por no ser literales | si Haiku alcanza para la pasada 2 o hace falta Sonnet |

Con un mes medido se extrapola: cinco años de seis medios, y de ahí toda la historia. El mantenedor
decide con esos números si sigue el catálogo total, el modo `--solo-alias`, o ninguno. Este piloto
corre en paralelo a Batlle y a lo demás: no usa Wayback, no toca corridas, y su costo es acotado.

## Piloto 1: Astori (regla 15: piloto antes de paralelo)

Astori, El País + El Observador + Montevideo Portal + la diaria, 2005–2023, más lo que el corpus ya
tiene de Presidencia y Parlamento. Se mide y se informa al mantenedor **antes** de tocar a los otros
cuatro:

| medida | de dónde sale |
|---|---|
| candidatas descubiertas por medio y año | etapa A |
| notas catalogadas, `central` / `secundaria` / `mencion` | pasada 1 |
| afirmaciones por tipo; citas descartadas por no ser literales | pasada 2 |
| tokens y costo de Haiku por nota (y de Sonnet, si se usó) | `pnpm agentes` |
| horas de Save Page Now | trabajo `archivar` |
| una corrida sobre el tema con más `dato`: chequeos producidos, cuántos `publicado`, costo | pipeline de hoy |

Con eso se decide si escala tal cual, si la extracción necesita Sonnet, o si el filtro grueso deja
pasar demasiado. Estimación previa, para tener contra qué comparar: Haiku a unos 2.000 tokens de
entrada por nota en la pasada 1 y 3.000 en la 2; diez mil notas de prensa son del orden de 50
millones de tokens de Haiku, decenas de dólares, no cientos. El costo grande sigue siendo cada
corrida (crítico Opus por lote), y ahora habrá más corridas porque habrá más temas con material.

## Archivos y herramientas

| Qué | Dónde |
|---|---|
| `pnpm catalogo:descubrir` | `scripts/corpus/catalogo-descubrir.ts` (usa `scripts/lib/sitemaps.ts` y el `cdx` de `inventario.ts` generalizado a HTML) |
| trabajo `catalogar` y trabajo `archivar` de fondo | `scripts/cola.ts` (`TIPOS_TRABAJO`), `scripts/worker.ts` |
| etiquetador con `relevancia`, `tiene_afirmaciones`, `fecha_texto` | `.claude/agents/etiquetador.md`, `scripts/corpus/etiquetar.ts` |
| rol `extractor` y su verificación literal | `.claude/agents/extractor.md` (Haiku), `scripts/corpus/extraer-afirmaciones.ts` |
| tabla `afirmaciones` | `scripts/corpus/indexar.ts` |
| `pnpm catalogo <politico>` | `scripts/corpus/catalogo.ts`, `data/catalogo/<politico>.json` |
| `pnpm brief … --lote` | `scripts/brief.ts` |
| `docs/fuentes-prensa.md` | entregable de la etapa A |
| `CLAUDE.md` | filas nuevas en la tabla de comandos; `/investigar` dice que el tema sale del catálogo |
| tests | uno por herramienta, con red y modelo inyectados; la verificación literal de citas con casos que no aparecen tal cual |

## Orden de ejecución

1. Etapa A: `docs/fuentes-prensa.md` (inventario de sitemaps por medio; en curso el 2026-09-16). La
   parte de CDX espera a que Wayback deje de limitar la IP.
2. Etapa B mínima para el piloto 0: trabajo `catalogar` con cursor, etiquetador ampliado, extractor,
   tabla `afirmaciones`, medición de rendimiento. Sonnet implementa con este plan; los prompts de los
   dos roles ya están escritos (`.claude/agents/etiquetador.md`, `extractor.md`).
3. Piloto 0 (un mes de todo), en paralelo a Batlle y al merge. Informe al mantenedor con la tabla de
   medidas y la extrapolación. Decisión: total, `--solo-alias`, o parar.
4. Merge del taller a `main` (después de Batlle; independiente de lo anterior).
5. Etapa C y D: informe por persona y brief por lote.
6. Piloto 1 sobre Astori. Recién con su informe, los otros cuatro presidentes; y recién con el
   pipeline fijado, todos de cero (etapa E).

## Qué no hacer

- No aflojar ahora la regla de los `probable`: primero volumen, después esa decisión.
- No catalogar por político: el catálogo es por nota, para todos los que aparecen, con versión.
- No pedir Save Page Now dentro del catálogo ni correr CDX mientras una corrida necesita Wayback.
- No usar Opus ni Fable en el catálogo (regla 14): Haiku por defecto, Sonnet solo para los documentos
  largos que el plan nombra, y `pnpm agentes` lo verifica.
- No escalar a los cinco presidentes sin el informe del piloto.
- No publicar «porcentaje de mentiras»: el sitio dice «de N afirmaciones chequeadas, X verdaderas», y
  lo que la prensa eligió publicar no es una muestra al azar.
