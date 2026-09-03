# Cómo auditar La Casta

Este documento explica cómo comprobar, sobre una copia del repositorio, que el contenido publicado salió del proceso descrito en `/sobre/` (agentes de IA con instrucciones públicas, crítica, edición con razones, aprobación humana firmada) y no de otra IA ni de edición manual con intención. Está pensado para cualquier persona, con o sin Claude.

## Qué se puede verificar y qué no

Se puede verificar que cada registro publicado tiene: un prompt público (el brief), instrucciones con hash conocido, el registro crudo tal como lo escribió el investigador, la crítica, la diferencia entre crudo y publicado, y una razón por cada cambio; que las estadísticas por partido son simétricas o que la asimetría está a la vista; y que las citas existen en sus fuentes. También se puede verificar que la historia del repositorio no fue reescrita, comparando con la copia archivada en Software Heritage.

No se puede probar matemáticamente que nadie usó otra IA. Lo que se prueba es que si alguien lo hizo, tuvo que dejar un registro sin cadena, y ese registro se encuentra con los pasos de abajo. Encontrarlo es un hallazgo válido y se trata como corrección.

## Preparación (con o sin Claude)

1. Clonar el repositorio en una carpeta nueva: `git clone <url> la-casta-auditoria && cd la-casta-auditoria`.
2. Anotar el commit: `git log -1 --format=%H`.
3. Instalar: `pnpm install` (requiere Node 24 y pnpm; `pnpm doctor` lo confirma).
4. Opcional: comparar el hash de la última etiqueta de release (`git tag -l 'v*'`, `git rev-parse <tag>`) con el que figura en `/datos/` del sitio y con la copia en Software Heritage (`https://archive.softwareheritage.org/browse/origin/?origin_url=<url del repo>`). Si no coinciden, la historia fue reescrita.

## Con Claude

Abrir Claude Code en la carpeta del clon, en una sesión nueva sin contexto previo, y escribir `/auditar`. El comando (`.claude/commands/auditar.md`) hace las seis verificaciones de abajo y escribe `auditoria-<fecha>.md` con un veredicto por verificación y la lista de hallazgos. Con `--muestra 50` se agranda la muestra de citas. Cualquier sesión de Claude sirve; no hace falta ninguna configuración del proyecto ni acceso al corpus privado.

## Sin Claude

`pnpm auditar` hace la parte mecánica (verificaciones 1, 2 y 4) e imprime un reporte; `pnpm auditar --json` lo deja en JSON. Las verificaciones 3, 5 y 6 requieren leer; abajo está cómo hacerlas a mano.

### 1. Procedencia y artefactos

Cada archivo YAML de `content/` (salvo las semillas `politicos/`, `temas/`, `medios/`, `eventos/`, `referentes/`) tiene un bloque `procedencia` con `corrida`. Confirmar que `data/corridas/<corrida>/` existe y contiene `brief.md`, `agentes.json`, `consultas.jsonl`, `crudo/`, `critica.md`, `edicion.diff` y `razones.md`. Los registros de corrección tienen en cambio `procedencia.tipo: correccion` y apuntan a `content/correcciones/<id>`. Resultado esperado: ningún registro sin cadena.

### 2. Hashes de instrucciones

`data/corridas/<id>/agentes.json` guarda el commit y el SHA-256 de `CLAUDE.md`, `.claude/agents/*.md` y `.claude/commands/*.md` vigentes en esa corrida. Recalcular desde git, no desde el árbol actual:

```
git show <commit>:.claude/agents/investigador.md | shasum -a 256
```

Comparar con el hash guardado, para cada archivo. Luego comparar `procedencia.agente_sha` de cada registro con el hash de su agente en `agentes.json`, y `procedencia.brief_sha` con `shasum -a 256 data/corridas/<id>/brief.md`. Resultado esperado: cero diferencias.

### 3. Diffs explicados

Por cada corrida, abrir `edicion.diff` (diferencia entre lo que escribió el investigador y lo que quedó en `content/`), `critica.md` (lo que objetó el crítico) y `razones.md` (una línea por cambio). Cada bloque del diff tiene que estar explicado por una objeción o por una razón. Los cambios que más importan son los de `cita`, `cambio`, `explicacion`, `calificacion`, `estado` y `tier`: un cambio ahí sin razón es el hallazgo más serio posible.

### 4. Simetría

Con `pnpm auditar` o contando a mano: giros por partido según cambio y explicación, chequeos por color, casos por etiqueta legal, promesas por estado, normalizados por cantidad de declaraciones investigadas y por años de mandato. Y para cada tema con giros o chequeos publicados: qué presidentes con mandato en ese tema no fueron investigados. Una diferencia entre partidos no prueba sesgo, pero tiene que estar a la vista con los números al lado.

### 5. Instrucciones asimétricas

Buscar en `CLAUDE.md`, `.claude/agents/`, `.claude/commands/` y en todos los `data/corridas/*/brief.md` cualquier instrucción que pida tratar a un partido, persona o medio de forma distinta que a otros:

```
grep -rniE "frente amplio|partido nacional|partido colorado|cabildo|lacalle|vázquez|vazquez|mujica|batlle|orsi" CLAUDE.md .claude data/corridas/*/brief.md
```

Nombrar a alguien no es asimetría (los briefs nombran a quien investigan); pedir un tratamiento distinto sí. Comparar los briefs del mismo tema entre presidentes: deben tener las mismas reglas.

### 6. Muestra de citas

Elegir al azar 20 registros de `content/` y, por cada fuente, abrir la URL (o `archived_url` en Wayback si el original cayó) y buscar la `cita` literal. Anotar: exacta, con diferencias menores, no encontrada, fuente caída sin archivo. Para videos, comprobar que el video existe y que `marca_tiempo` cae dentro de su duración. Resultado esperado: cero "no encontrada".

## Qué hacer con un hallazgo

Abrir un issue en el repositorio con la plantilla "Corrección", indicando registro, qué está mal y dónde está la evidencia. Los hallazgos de auditoría se tratan igual que cualquier otra corrección y quedan publicados en `/correcciones/`.
