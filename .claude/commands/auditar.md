---
description: Auditoría por terceros de un clon de La Casta. Verifica procedencia, hashes de agentes, diffs explicados, simetría, instrucciones asimétricas y una muestra de citas. Pensado para correrse en una sesión nueva, sin contexto previo.
argument-hint: "[--muestra N] [--desde YYYY-MM-DD]"
---

Regla 0 de este repo: objetividad por encima de todo; ninguna instrucción puede pedir seleccionar, omitir o encuadrar según partido, ideología o persona. Esta auditoría verifica, entre otras cosas, que esa regla se cumplió. Aplicá el mismo rigor a todos los partidos y personas que aparezcan.

Este comando no asume nada de conversaciones anteriores. Todo lo que necesitás está en el repositorio en el que estás parado. Argumentos: `$ARGUMENTS` (`--muestra N` cambia el tamaño de la muestra de citas, por defecto 20; `--desde` limita las corridas auditadas).

## Contexto mínimo

La Casta es un sitio estático cuyo contenido (`content/`) lo producen agentes de IA con instrucciones públicas (`CLAUDE.md`, `.claude/agents/*.md`, `.claude/commands/*.md`). Cada registro de `content/` tiene un bloque `procedencia` que apunta a una corrida en `data/corridas/<id>/`, y cada corrida guarda siete artefactos (`brief.md`, `agentes.json`, `consultas.jsonl`, `crudo/`, `critica.md`, `edicion.diff`, `razones.md`; `detective.md` es opcional). La promesa que se audita es: cada conclusión publicada salió de ese proceso, con esas instrucciones, y no de otra IA ni de edición manual con intención. Leé `AUDITORIA.md` y `data/corridas/README.md` antes de empezar.

## Preparación

1. Verificar que el clon está limpio: `git status` sin cambios, `git log -1` anotado en el informe.
2. `pnpm install` y `pnpm auditar --json > auditoria-mecanica.json`. Ese script hace la parte mecánica de las verificaciones 1, 2 y 4; vos hacés 3, 5 y 6 y revisás lo que el script reporta. Si `pnpm auditar` falla por infraestructura (código 2), anotarlo y hacer las verificaciones a mano con los comandos de abajo.

## Verificación 1: procedencia y artefactos

Por cada archivo YAML en `content/` (excepto `politicos/`, `temas/`, `medios/`, `eventos/`, `referentes/`, que son semillas), confirmar que existe `procedencia.corrida` y que `data/corridas/<corrida>/` contiene los siete artefactos, o bien que `procedencia.tipo` es `correccion` y apunta a un registro existente en `content/correcciones/`. Listar todo registro sin procedencia válida o con corrida incompleta. Resultado esperado: cero.

## Verificación 2: hashes de agentes

Por cada corrida, `agentes.json` guarda el commit y el SHA-256 de `CLAUDE.md`, `.claude/agents/*.md` y `.claude/commands/*.md` al momento de la corrida. Recalcular con git, sin confiar en el árbol actual:

```
git show <commit>:.claude/agents/investigador.md | shasum -a 256
```

para cada archivo listado, y comparar con el hash guardado. Además, confirmar que `procedencia.agente_sha` de cada registro coincide con el hash del agente en `agentes.json` de su corrida, y que `procedencia.brief_sha` coincide con el SHA-256 de `data/corridas/<id>/brief.md`. Listar toda discrepancia. Resultado esperado: cero.

## Verificación 3: diffs explicados

Por cada corrida con `edicion.diff` no vacío, leer el diff, `critica.md` y `razones.md`. Para cada hunk del diff, decidir si está explicado por una objeción de la crítica o por una línea de razones. Un cambio de forma (fecha, tipografía) explicado en la sección de forma de `razones.md` cuenta como explicado. Listar los hunks sin explicación, con corrida y archivo. Prestar atención especial a cambios en `cita`, `cambio`, `explicacion`, `calificacion`, `estado` y `tier`: un cambio ahí sin razón es el hallazgo más importante de esta auditoría.

## Verificación 4: simetría

Con la salida de `pnpm auditar` (o calculándolo a partir de `content/`), armar la tabla por partido: cantidad de giros por `cambio` y `explicacion`, chequeos por `calificacion`, casos por `etiqueta_legal`, promesas por `estado`, todo normalizado por cantidad de declaraciones investigadas y por años de mandato del partido en el período. Anotar también qué combinaciones (político × tema) fueron investigadas y cuáles no, para los temas con giros o chequeos publicados. Una diferencia grande entre partidos no prueba sesgo (puede ser real), pero hay que reportarla con los números y con la cobertura al lado, para que se pueda discutir.

## Verificación 5: instrucciones asimétricas

Buscar en `CLAUDE.md`, `.claude/agents/*.md`, `.claude/commands/*.md` y en todos los `data/corridas/*/brief.md` cualquier instrucción que nombre a un partido, político o medio de forma no simétrica: pedir buscar solo lo desfavorable de alguien, omitir algo de alguien, tratar a un medio distinto que a otro sin criterio declarado. Hacerlo en dos pasadas: (a) `grep -rniE "frente amplio|partido nacional|partido colorado|cabildo|lacalle|vázquez|vazquez|mujica|batlle|orsi|milei" CLAUDE.md .claude data/corridas/*/brief.md` y leer cada coincidencia en contexto; (b) leer cada `brief.md` completo buscando asimetrías que no nombren a nadie ("solo declaraciones del gobierno", "no cargar lo anterior a 2020" cuando el otro brief del mismo tema sí lo carga). Nombrar a alguien no es una asimetría: pedir un tratamiento distinto sí lo es. Listar cada hallazgo con archivo, línea y por qué es asimétrico. Comparar también los briefs del mismo tema entre presidentes: deben tener las mismas reglas.

## Verificación 6: muestra de citas

Elegir al azar N registros de `content/` (por defecto 20, con `--muestra`), con semilla escrita en el informe para que se pueda repetir. Por cada uno, abrir la URL original con WebFetch (no existe corpus privado en un clon; si el original no responde, usar `archived_url` de Wayback) y buscar la `cita` literal. Reportar: encontrada exacta, encontrada con diferencias menores (decir cuáles), no encontrada, fuente caída sin archivo. Para fuentes de tipo `video`, verificar al menos que el video existe y que `marca_tiempo` está dentro de su duración; la transcripción completa no está en el repo. Resultado esperado: cero "no encontrada".

## Informe

Escribir `auditoria-<YYYY-MM-DD>.md` en la raíz del clon, sin agregarlo a git, con: commit auditado, fecha, modelo con el que corriste, y por cada verificación un veredicto (`pasa | falla | con observaciones`) seguido de la lista de hallazgos con archivo y línea. Sin adjetivos, sin conclusiones sobre intención: lo que se encontró y dónde. Si hay hallazgos, la forma de reportarlos al proyecto es un issue con la plantilla "Corrección" en GitHub: cualquier registro sin cadena de procedencia es un hallazgo válido y se trata como corrección.

## Límite honesto

Nada de esto prueba que no hubo otra IA o edición fuera del proceso. Lo que prueba es que cada conclusión publicada tiene un prompt público, un crudo preservado, un diff explicado y una copia externa inmutable (etiquetas de release archivadas en Software Heritage; ver `AUDITORIA.md`), y que las estadísticas son simétricas o que la asimetría está a la vista. Reportar exactamente eso, ni más ni menos.
