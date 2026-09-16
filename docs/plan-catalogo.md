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

`pnpm catalogo:descubrir <medio> [--desde AAAA] [--hasta AAAA] [--cdx]`: enumera URLs candidatas de
un medio y las encola como trabajos `catalogar` (cola del corpus, `scripts/cola.ts`), descartando lo
que el corpus ya tiene (`idDeUrl`). Dos fuentes:

1. **Sitemaps** (`descubrir` de `scripts/lib/sitemaps.ts`, ya existe): con `--terminos` = **la lista
   de alias de todas las fichas** de `content/politicos/` (no de una persona), así una nota
   descubierta por un nombre sirve para todos los que aparezcan adentro. Filtro grueso sobre título y
   URL: barato, y lo que no nombra a nadie en el título llega igual por las corridas por tema, como
   hoy.
2. **Wayback CDX** por dominio (`cdx` de `scripts/corpus/inventario.ts`, generalizado a HTML) con el
   filtro de URL por slug de alias (`filter=original:.*<slug>.*`; verificar que la API lo acepte
   antes de contar con él), para los medios sin sitemap o con sitemap corto. Pasa por el cupo de
   Wayback y **no se corre mientras una corrida necesita Save Page Now**: el 2026-09-16 el índice de
   diarios dejó la IP con 429 durante horas.

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
- `fecha_texto`: la fecha que el propio texto declara, cuando la nota no la trae (los documentos de
  Presidencia y los diarios de sesiones sin fecha: 956 de las 1.013 de Astori).

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

## Piloto (regla 15: piloto antes de paralelo)

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

1. Merge del taller a `main` (después de Batlle).
2. Etapa A: `docs/fuentes-prensa.md` (inventario de sitemaps y CDX por medio). Sin modelo, se puede
   hacer mientras Opus termina Batlle, **salvo** la parte de CDX, que espera a que Wayback deje de
   limitar la IP.
3. Etapa B: etiquetador ampliado, extractor, tabla del índice, trabajo `catalogar`. Sonnet implementa
   con este plan; Fable escribe los prompts de los dos roles y revisa.
4. Etapa C y D: informe y brief por lote.
5. Piloto sobre Astori, con las medidas de arriba. Recién con el informe del piloto, los otros cuatro.

## Qué no hacer

- No aflojar ahora la regla de los `probable`: primero volumen, después esa decisión.
- No catalogar por político: el catálogo es por nota, para todos los que aparecen, con versión.
- No pedir Save Page Now dentro del catálogo ni correr CDX mientras una corrida necesita Wayback.
- No usar Opus ni Fable en el catálogo (regla 14): Haiku por defecto, Sonnet solo para los documentos
  largos que el plan nombra, y `pnpm agentes` lo verifica.
- No escalar a los cinco presidentes sin el informe del piloto.
- No publicar «porcentaje de mentiras»: el sitio dice «de N afirmaciones chequeadas, X verdaderas», y
  lo que la prensa eligió publicar no es una muestra al azar.
