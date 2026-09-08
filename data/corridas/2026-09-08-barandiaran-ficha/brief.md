# Brief de investigación · corrida 2026-09-08-barandiaran-ficha

Regla 0: objetividad por encima de todo. Esta corrida arma la ficha base (colección `politicos`) y el registro parlamentario de **Gabriel Barandiarán**, que fue Representante Nacional (diputado) por el Partido Colorado. El criterio es exactamente el mismo que para cualquier otra persona del sitio: nada se agrega ni se omite por quién sea, por su partido ni por quién lo conozca; solo fuentes públicas; y si algo acá te parece asimétrico, decilo en `objeciones_al_brief`.

Lo primero que tenés que resolver es **quién es, con fuente**: nombre completo, partido y sector, departamento por el que fue electo, legislatura(s) y fechas exactas de cada mandato (titular o suplente, y si asumió como suplente, de quién y cuándo), candidaturas (elección, lema, resultado, votos si hay fuente oficial), cargos de gobierno o partidarios si los tuvo, y situación actual. No trabajes de memoria: el corpus tiene una sola mención (`pnpm corpus:buscar "Barandiarán"` devuelve un PDF del Parlamento con una lista de diputados, `https://infolegislativa.parlamento.gub.uy/temporales/2370801.PDF`); el resto es web: la ficha del legislador en `parlamento.gub.uy` (buscador de legisladores, asistencias, proyectos presentados, comisiones), la Corte Electoral (resultados por departamento y lema), Wikipedia y Wikidata, IMPO si hubo designaciones, y prensa uruguaya. Si hay más de una persona con ese nombre, decilo y resolvé la ambigüedad con fuente.

## Encargo

### A. `politicos.yaml` (un registro)
En `inbox/barandiaran/ficha/2026-09-08/politicos.yaml`, con el formato exacto de `content/politicos/salle.yaml` (leelo primero como modelo) y el esquema `src/schemas/politico.ts`:
- `_slug: barandiaran` (verificá que no choque con `ls content/politicos/`), `nombre` completo legal, `nombre_corto`, `partido` (el lema por el que fue electo), `wikidata` si existe, `alias` (cómo lo nombra la prensa).
- `mandatos`: todos los cargos electivos o de gobierno documentados, cada uno con `cargo` (ej. «Representante Nacional (Diputado) por Montevideo»), `desde` y `hasta` con la precisión que la fuente permita, y `fuentes` con cita literal. Un suplente que asumió por días también es un mandato: registralo con sus fechas.
- `candidaturas`: cada elección en la que fue candidato, con `fecha`, `lema`, `resultado` (electo / no_electo), `detalle` y `votos` solo con fuente oficial.
- `estado_actual`: `situacion` y, si dejó su último cargo, `salida: {tipo, fecha, fuentes}`.
- `foto`: solo si hay imagen con licencia libre (Wikimedia Commons, Parlamento si su página declara la licencia); si la hay, bajala con `pnpm imagen <url> --para politicos/barandiaran --credito … --licencia … --pagina …` y usá el bloque que imprime; si no hay, omitila entera y decilo en `notas.md`.
- Al menos dos fuentes que no sean Wikipedia (Parlamento, Corte Electoral, IMPO, prensa). NO escribas `revision.tier` ni `procedencia`.

### B. `declaraciones.yaml`: el registro parlamentario
En la misma carpeta, sus intervenciones en sala y en comisión que estén en versiones taquigráficas del Parlamento (`diario_de_sesiones`, tipo primario; las versiones viven en `infolegislativa.parlamento.gub.uy/temporales/…` y en el sitio del Parlamento, y se leen con `pnpm fuente`): cada intervención con posición sobre un tema es una declaración, con `contexto: parlamento`, `cargo_en_ese_momento`, `cita` literal y contigua (≥ 20 caracteres), `resumen`, `tema` (un slug existente de `content/temas/`; leé `ls content/temas/` y sus hijos, y si ninguno calza, `tema` el más cercano y `notas.md` bajo `temas_faltantes`), y `evidencia: {nivel: textual, fuentes}`. Cubrí todo el período de su mandato, no solo lo más citado: buscá su nombre en el buscador de versiones taquigráficas del Parlamento, sesión por sesión si hace falta, y anotá en `## cobertura_del_periodo` qué años y qué temas revisaste y cuáles no. También los proyectos de ley que presentó o firmó (con su número y fecha, como declaración con `contexto: parlamento` si el texto trae exposición de motivos con su firma, o en `notas.md` bajo `proyectos_presentados` si no hay cita literal posible).

### C. `notas.md` y `consultas.jsonl`
`notas.md` con las secciones de siempre (`candidatos_giro`, `hipotesis`, `casos_vistos`, `verificacion_manual`, `cobertura_del_periodo`, `objeciones_al_brief`) más `proyectos_presentados`, `temas_faltantes` y `medios_faltantes`. `consultas.jsonl` con cada búsqueda y cada URL leída, en orden.

## Reglas duras
1. Toda página, PDF o video que cites se lee con `pnpm fuente <url>`; nunca cites una URL que no abriste en esta sesión. Corpus antes que web.
2. `cita` es copia literal y contigua; verificá que la cita diga lo que le hacés decir (en un lote anterior se cerró un mandato citando una nota que ese mismo día llamaba a la persona «el actual embajador»).
3. Solo fuentes públicas. Nada de datos personales que no sean parte de su actuación pública (domicilio, familia, salud, patrimonio fuera de las declaraciones juradas públicas de la JUTEP).
4. No investigues casos judiciales; si aparecen, una línea en `casos_vistos` con URL, sin leerlos a fondo. El umbral y la compuerta humana del sitio se aplican después, igual que para cualquiera.
5. No escribas `revision`, `tier`, `procedencia` ni `id`. No toques `content/`.
6. Todo registro lleva `_investigacion: {agente: investigador, modelo: <el modelo con el que corrés>}`.
7. Guardá los archivos después de cada bloque: si te interrumpen, que quede lo hecho.
8. Al cerrar, `pnpm validar --inbox inbox/barandiaran/ficha/2026-09-08` (los únicos errores admisibles son medios o temas que el editor va a crear).

## Salida esperada
Carpeta `inbox/barandiaran/ficha/2026-09-08/` con `politicos.yaml`, `declaraciones.yaml`, `consultas.jsonl`, `notas.md`. Informe final: quién es con las fuentes que lo prueban, qué mandatos y candidaturas, cuántas intervenciones parlamentarias registraste y de qué años, qué te faltó, el modelo con el que corriste, objeciones al brief.
