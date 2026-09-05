# Procedencia incompleta: las instrucciones de esta corrida no están en git

Esta corrida se promovió el 2026-09-04 19:52 declarando el commit
4fc0953b. En ese momento los archivos de instrucciones tenían cambios sin
commitear, y `pnpm promover` guardó el hash de esa versión del árbol de trabajo. Después la edición
siguió y esos bytes exactos nunca entraron al historial.

**Qué significa.** Se puede leer el encargo literal de esta corrida en `brief.md` —su hash coincide
exacto con el que guarda cada registro— y todo el rastro está completo: `crudo/`, `consultas.jsonl`,
`critica.md`, `razones.md` y `edicion.diff`. Lo que no se puede reconstruir con exactitud es la
redacción de las reglas generales bajo las que operaron los agentes.

**Qué tan grande es la incertidumbre.** Está acotada entre dos textos que sí están en git: el commit
`bff23b8` (4 de setiembre, 17:45), el último anterior a esta corrida, y el estado actual del repo.
Entre esos dos extremos hay unas 22 líneas de diferencia en total, y casi todas son agregados
posteriores a esta corrida: la colección de discrepancias, el flujo de correcciones, el comando
`pnpm aprobar --pendientes` y el agente resolvedor. Ninguno de esos existía cuando esto corrió.

| archivo | hash registrado | en el commit bff23b8 | hoy |
|---|---|---|---|
| `CLAUDE.md` | `62a65db60ba0` | `4da67fab08fa` | `280e662009ae` |
| `.claude/agents/editor.md` | `b206468c169a` | `eb3168d431f4` | `31450f8b084e` |
| `.claude/agents/investigador.md` | `adae13e41df9` | `cab6f7f5e088` | `31ac69d4468d` |
| `.claude/commands/revisar.md` | `922285cfb2e2` | `cefed41f7c3a` | `cefed41f7c3a`  ← idénticos, la versión perdida fue una edición transitoria |

Agentes que corrieron: investigador (.claude/agents/investigador.md).

**Por qué no se rehízo.** Rehacer la corrida no recupera las instrucciones perdidas: produce un
trabajo distinto bajo las instrucciones de hoy. Y rehacer solo las dos corridas afectadas, que son
las dos de Orsi, dejaría a una persona con lotes producidos bajo reglas mejores que las de los otros
presidentes. Rigor asimétrico entre políticos es un defecto peor que una procedencia acotada, y es
el que este proyecto más se cuida de tener. La decisión fue documentar el rango en vez de
introducirlo.

**Cómo se evita ahora.** `pnpm promover` se niega a correr si hay archivos de instrucciones con
cambios sin commitear. No tiene `--forzar`.
