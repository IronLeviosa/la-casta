# Brief de investigación · corrida 2026-09-09-barandiaran-intervenciones

Regla 0: objetividad por encima de todo. Esta corrida registra **todas las intervenciones con posición** de Gabriel Barandiarán como Representante Nacional por Montevideo (Nuevo Espacio, Legislatura 44, 1995-2000) en los diarios de sesiones de la Cámara de Representantes. El criterio es el mismo que para cualquier otra persona del sitio: nada se agrega ni se omite por quién sea, por su partido ni por quién lo conozca. Si algo acá te parece asimétrico, decilo en `objeciones_al_brief`.

## Qué existe ya

- Ficha publicada: `content/politicos/barandiaran.yaml` (mandatos, candidaturas, una declaración de 2000 sobre trasplantes). Vuelta 3 sin promover: `inbox/barandiaran/ficha/2026-09-08-vuelta-3/` (suplencias 2000-2004 fechadas). No repitas nada de eso.
- Un barrido de los 401 diarios de sesiones de Representantes de 1995-2000 de la Hemeroteca de la Biblioteca del Poder Legislativo (`biblioteca.parlamento.gub.uy`) encontró **139 diarios en los que Barandiarán habla** (505 turnos de palabra con el marcador de orador). Los turnos ya están extraídos, uno por uno, en `.cache/barandiaran-turnos/<AAAA-MM-DD>-<NNNN>.md` (un archivo por diario, con la URL del PDF, la posición de cada turno y su texto), con un `INDICE.md` y dos listas: `tranche-a.txt` y `tranche-b.txt`. El texto de esos archivos es el mismo OCR que devuelve `pnpm fuente <url>` («SE~OR» es «SEÑOR»); las citas se copian literales de ahí y la fuente que se cita es la URL del PDF de la Biblioteca (estable; las de `infolegislativa…/temporales/` caducan).

## Encargo (cada investigador toma una tranche)

### A. `declaraciones.yaml`
Una declaración por cada turno **con posición sobre un tema** (una opinión, una propuesta, un dato que afirma, una crítica o defensa de una política, un proyecto que fundamenta). No son declaraciones los turnos de trámite: pedir la palabra, mociones de orden, «gracias, señor Presidente», aclaraciones de votación sin contenido, lectura de un texto ajeno. Formato exacto de `content/declaraciones/barandiaran/*.yaml` (leé el publicado como modelo) y del esquema `src/schemas/declaracion.ts`:
- `politico: barandiaran`, `contexto: parlamento`, `cargo_en_ese_momento: Representante Nacional por Montevideo (Nuevo Espacio)`, `fecha` la del diario, `cita` literal y contigua (≥ 20 caracteres, el tramo que mejor resume la posición; sin corregir el OCR), `resumen` de una o dos oraciones sin adjetivos, `tema` (un slug existente de `content/temas/` y sus hijos; si ninguno calza, el más cercano y `notas.md` bajo `temas_faltantes`), `evidencia: {nivel: textual, fuentes: [{url del PDF de la Biblioteca, medio: parlamento, fecha, tipo: diario_de_sesiones, titulo: "Diario de Sesiones de la Cámara de Representantes, <fecha>, N.º <NNNN>", cita, retrieved_at}]}`.
- Un turno largo con varias posiciones distintas (dos temas) puede dar dos declaraciones; varios turnos del mismo debate sobre lo mismo dan una sola, con la cita más completa.
- Verificá cada cita abriendo el PDF con `pnpm fuente <url>` al menos una vez por diario que cites (la salida es larga; alcanza con confirmar que la URL responde y que el tramo existe: `pnpm fuente <url> | grep -c "<cinco palabras de la cita>"`).

### B. `chequeos.yaml`
Por cada cifra, fecha o comparación concreta que Barandiarán afirma dentro de una cita (CLAUDE.md, Veracímetro): un chequeo con `fragmento` (el tramo exacto), `afirmacion`, y la búsqueda del dato oficial (INE, BCU, Parlamento, IMPO) con `pnpm fuente`. No califiques: eso lo hace el editor. Si el dato oficial no se encuentra, decilo en `dato_real` y en `notas.md` bajo `chequeos_pendientes`.

### C. `notas.md` y `consultas.jsonl`
`notas.md` con `cobertura_del_periodo` (tabla: diario, turnos leídos, cuántos con posición, cuántos de trámite, qué diarios de tu tranche NO llegaste a leer), `proyectos_presentados` (los proyectos que fundamenta en sala, con fecha y diario), `candidatos_giro` (dos posiciones suyas que parezcan contradecirse, con las dos citas y fechas; no decidas si es giro), `temas_faltantes`, `hipotesis`, `casos_vistos`, `verificacion_manual`, `objeciones_al_brief`. `consultas.jsonl` con cada archivo y URL leídos, en orden.

## Reglas duras
1. Leé los turnos desde `.cache/barandiaran-turnos/` en el orden de tu tranche; priorizá por tamaño (los turnos de más de 300 letras casi siempre tienen posición; los de menos de 100 casi nunca) y dejá constancia de lo que no llegaste a leer, para que una vuelta siguiente continúe desde ahí.
2. `cita` es copia literal y contigua del texto del turno. Sin paráfrasis, sin reconstrucción, sin arreglar el OCR.
3. Solo lo que dijo en su actuación pública. Nada de datos personales.
4. No investigues casos judiciales; si aparecen, una línea en `casos_vistos` con URL.
5. No escribas `revision`, `tier`, `procedencia` ni `id`. No toques `content/`. No commitees.
6. Todo registro lleva `_investigacion: {agente: investigador, modelo: <el modelo con el que corrés>}`.
7. Guardá los archivos después de cada diario: si te interrumpen, que quede lo hecho.
8. Al cerrar, `pnpm validar --inbox <tu carpeta>` y después `pnpm validar --inbox <tu carpeta> --red`; corregí toda cita que no coincida antes de terminar.

## Salida esperada
Carpeta `inbox/barandiaran/intervenciones/2026-09-09-a/` (tranche a) o `…/2026-09-09-b/` (tranche b) con `declaraciones.yaml`, `chequeos.yaml`, `consultas.jsonl`, `notas.md`. Informe final: cuántos diarios y turnos leíste, cuántas declaraciones y chequeos escribiste, por año y por tema, qué quedó sin leer, resultado de `pnpm validar` con y sin `--red`, el modelo con el que corriste, objeciones al brief.
