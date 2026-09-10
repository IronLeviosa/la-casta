# Casos (`content/casos/`)

Casos judiciales y administrativos, solo con lo que ya está en fuentes públicas, con estado y fecha explícitos (ley 18.331, artículos 18 y 9 bis). Una denuncia no es una condena, y el sitio lo dice en cada caso.

## Campos

`nombre`, `tipo`, `temas[]`, `involucrados[]` con `{politico, rol}` (el rol no afirma más de lo que hay: `mencionado` cuando no está imputado), `resumen`, `estado_judicial[]` (línea de tiempo ascendente con `fecha`, `etapa: denuncia | investigacion | formalizacion | condena | absolucion | archivo`, `descripcion`, `evidencia`), `etiqueta_legal` (la deriva el validador de la última etapa: `denuncia` o `investigacion` → `denuncia`; `formalizacion` → `formalizado`; `condena` → `condena`; `absolucion` o `archivo` → `cerrado_sin_condena`; si el archivo trae otra, el build falla), `revision` con `que_falta` cuando queda en `probable`. Ejemplo en `docs/ejemplos/caso.yaml`.

## Umbral y reglas

- **Umbral «amplio», con esta lectura y ninguna otra:** entra un caso si hay denuncia formal presentada, investigación de Fiscalía, o acusación pública hecha por una persona identificable en un medio. Trascendidos anónimos, rumores y «fuentes cercanas» van a `hipotesis/`, nunca a `content/`.
- **Desenlaces con el mismo rigor que las acusaciones.** Por cada caso se busca y se registra, si existe, el archivo de la causa, la absolución, el sobreseimiento, la desestimación de la denuncia, y el hecho de que la persona no haya sido imputada. Un caso sin desenlace documentado puede existir en `probable`, nunca en `publicado`; «no se publica» quiere decir eso y no que el caso deba borrarse.
- **Barrido simétrico (regla 12 de `CLAUDE.md`).** Los casos se investigan con el mismo criterio para todos: por cada persona con ficha se corre la misma búsqueda, con el mismo umbral y en las mismas fuentes (Fiscalía, Base de Jurisprudencia Nacional, desafueros y comisiones investigadoras del Parlamento, JUTEP, prensa con dos grupos). Ningún brief elige a quién sí y a quién no. Un investigador que trabaja otro tema y ve un caso lo anota en `casos_vistos` de `notas.md`; no lo investiga en esa corrida.
- No hay compuerta humana: un caso se publica cuando cumple las mismas reglas que todo lo demás.

## Investigación

Las puertas oficiales, en orden, están en `docs/fuentes-oficiales/casos-penales.md` y `docs/fuentes-oficiales/ministerio-interior.md`: corpus con el nombre del caso y con «pedido de informes», «interpelación», «llamado a sala»; el diario de sesiones (la página del Parlamento es un visor; la URL real está en `infolegislativa…/temporales/…` y caduca, así que se cita la copia de Wayback o la de la Hemeroteca, `docs/fuentes-oficiales/parlamento.md`); pedidos de informes y sus respuestas; Fiscalía (`gub.uy/fiscalia-general-nacion`); Poder Judicial; Ministerio del Interior; IMPO; acceso a la información pública (lo pide el mantenedor, no un agente). Lo reservado durante una instrucción o un sumario suele volverse público cuando la etapa cierra. Se busca el documento en las dos direcciones: el que confirma lo que la prensa dice y el que sostiene la lectura contraria.

## Crítica

Riesgo legal (art. 336 CP, real malicia): ¿el registro afirma más de lo que la fuente respalda? Si menciona una denuncia, ¿está en fuente pública, con etapa y fecha? ¿Es un trascendido anónimo disfrazado de hecho? Todo lo que deba bajar a `probable` o a `hipotesis/` se marca.
