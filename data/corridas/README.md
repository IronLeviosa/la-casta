# data/corridas/

Una carpeta por corrida de investigación, con nombre `<YYYY-MM-DD>-<politico>-<tema>` (el tema con `/` reemplazado por `-`). Es el rastro completo que permite a un tercero comprobar que cada registro de `content/` salió del proceso público y no de otro lado. Todo lo que hay acá se commitea al repositorio público.

Cada corrida contiene siete artefactos. Si falta alguno, `pnpm validar` falla para todo registro cuya `procedencia.corrida` apunte a ella.

| Artefacto | Quién lo escribe | Qué es |
|---|---|---|
| `brief.md` | `/investigar`, antes de lanzar el agente | El prompt exacto que recibió el investigador, ya renderizado: político, mandatos, tema, esquema, medios con grupo, reglas, pistas. Es lo que se compara con `procedencia.brief_sha`. |
| `agentes.json` | `pnpm promover` | Commit y SHA-256 de `CLAUDE.md`, `.claude/agents/*.md` y `.claude/commands/*.md` vigentes en la corrida, más el modelo que reportó cada agente. Permite recalcular los hashes con `git show <commit>:<archivo> \| shasum -a 256`. |
| `consultas.jsonl` | el investigador, copiado por `pnpm promover` | Una línea JSON por búsqueda web y por URL leída, en orden: `{"t", "tipo": "busqueda\|fuente", "q", "resultado"}`. Sirve para reconstruir el camino y para re-descargar las fuentes. |
| `crudo/` | `pnpm promover --solo-crudo`, apenas valida el inbox y **antes** de que edite el editor | Los YAML tal cual los escribió el investigador (`declaraciones.yaml`, `promesas.yaml`, `menciones.yaml`, y los `giros.yaml` que armó el editor), antes de cualquier edición, con sus campos `_`. |
| `critica.md` | el agente crítico (Opus) | Objeciones por registro con severidad, objeciones al lote, objeciones al brief, y los registros de tono (`cobertura`) por nota. |
| `edicion.diff` | `pnpm promover` | Diferencia entre `crudo/` y lo que quedó en `content/`. Si no es vacío, exige `razones.md`. Un diff vacío significa que el editor no tocó nada; si el editor sí trabajó y el diff igual salió vacío, es que `crudo/` se congeló tarde y esa corrida perdió la trazabilidad de la edición. |
| `razones.md` | el editor (Fable), en `/revisar` | Una línea por cada cambio no trivial del diff, con el motivo y la referencia a la objeción de `critica.md` si la hubo; los cambios de forma en una sección aparte. |

Opcional:

| Artefacto | Quién lo escribe | Qué es |
|---|---|---|
| `detective.md` | `/revisar`, al promover una propuesta del detective | El `historial` completo de la hipótesis privada que dio origen al registro: fechas, notas que la reforzaron o debilitaron, explicaciones alternativas descartadas y por qué. Es lo único de `hipotesis/` que llega al repositorio público, y solo cuando la hipótesis se promueve. |

Lo que **no** va acá: el texto completo de las notas (corpus privado, derechos de autor). Un auditor las re-descarga del original o de Wayback con las URLs de `consultas.jsonl` y del ledger.

Las corridas nunca se editan después de commiteadas. Si algo estaba mal, va por `content/correcciones/` con `[correccion <id>]` en el commit.
