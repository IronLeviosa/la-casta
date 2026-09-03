# El corpus, la cola y el worker

Guía corta de la parte "máquina" del proyecto: dónde se guarda lo que leemos, cómo se busca,
y cómo la PC de escritorio hace el trabajo pesado sin abrir un solo puerto.

## Qué es el corpus

Cada nota, PDF o video que el proyecto lee **una vez** queda guardado entero en un repo
**privado y aparte**: `la-casta-corpus`. Dos motivos:

1. **Derechos de autor (ley 9.739).** El texto completo de una nota ajena no puede ir al repo
   público. En el repo público van citas cortas con enlace al original y al archivo de Wayback.
2. **No pagar dos veces.** Investigar a un presidente saca a la luz datos de otros. Guardar y
   etiquetar la nota una vez evita volver a bajarla, y da copia propia si el diario la edita o
   la borra.

La ruta sale de `CORPUS_DIR` (ver abajo); por defecto `../la-casta-corpus`, al lado de este repo.

## Estructura

```
../la-casta-corpus/
├── notas/
│   ├── <sha1(url canónica)>.json      texto extraído + metadatos + etiquetas
│   ├── <sha1>.html.gz                 HTML crudo comprimido (por si cambia el extractor)
│   ├── <sha1>.pdf                     PDF crudo, cuando la fuente es un PDF
│   └── <sha1>.txt.gz                  texto plano crudo
├── transcripciones/<sha1>.json        Whisper con marcas de tiempo por segmento
├── pistas/<politico>.yaml             pistas cruzadas (vi algo de B mientras investigaba a A)
├── cola/
│   ├── <id>.yaml                      trabajos pendientes
│   ├── en_curso/  hechos/  errores/   los mueve el worker
├── propuestas-taxonomia.yaml          temas y eventos nuevos que propone el etiquetador
├── indice.db                          SQLite FTS5 (gitignored: se reconstruye)
└── README.md
```

El **id de una nota es el `sha1` de su URL canónica**: `https://www.ejemplo.com/nota?utm_source=x#ahí`
y `https://ejemplo.com/nota` son la misma nota. Los videos de YouTube se canonizan a
`https://www.youtube.com/watch?v=<id>`.

`indice.db` está en `.gitignore` del corpus a propósito: es derivado, se rearma con
`pnpm corpus:indexar` en cualquier máquina y evita conflictos de merge en un binario.

## Comandos

| Comando | Qué hace |
|---|---|
| `pnpm fuente <url>` | **La única forma de leer una nota.** Busca en el corpus por URL canónica; si no está, la baja, extrae el texto (Readability / pdf-parse / Whisper), la etiqueta por alias, pide archivo en Wayback, indexa y encola el etiquetado Haiku. Imprime metadatos + texto. |
| `pnpm corpus:buscar "<consulta>"` | Búsqueda FTS5 con ranking BM25 sobre título y texto. **Siempre antes que la web.** |
| `pnpm corpus:indexar` | Borra y reconstruye `indice.db` desde los JSON de `notas/`. |
| `pnpm corpus:sync` | `git add -A` + commit + `pull --rebase` + push en el corpus. |
| `pnpm corpus:pistas <politico> [url "qué vi"]` | Lee o agrega pistas cruzadas. |
| `pnpm transcribir <url\|archivo>` | yt-dlp → wav 16 kHz mono → Whisper → `transcripciones/<sha1>.json`. |
| `pnpm cola:agregar <tipo> [valor]` | Encola un trabajo para el worker. |
| `pnpm cola:ver [--todos]` | Estado de la cola. |
| `pnpm worker [--intervalo 60] [--una-vez]` | Bucle que ejecuta la cola. `--una-vez` hace **un** trabajo y sale (sirve para cron o para probar). |
| `pnpm instalar-worker [--todas]` | Imprime (no ejecuta) cómo dejar el worker corriendo solo. |
| `pnpm chequeo` | Verifica Node, pnpm, git, Python, venv, ffmpeg, yt-dlp, Whisper, `claude` y el corpus en esta máquina, con el comando de instalación de lo que falte. |

> **Ojo con `pnpm doctor`:** `doctor` es un comando propio de pnpm y gana sobre el script del
> repo. El de este proyecto es **`pnpm chequeo`** (o `pnpm run doctor`).

### `pnpm fuente`, opciones

```
pnpm fuente <url> [--json] [--forzar] [--sin-archivo] [--sin-haiku] [--solo-meta]
```

- `--json`: escribe la nota entera en stdout como JSON (el log va a stderr).
- `--forzar`: vuelve a bajar aunque esté en el corpus. Conserva `archived_url`, el resumen y las
  etiquetas que puso Haiku, y avisa si el `text_sha256` cambió (posible edición del medio).
- `--sin-archivo`: no pide Save Page Now a Wayback.
- `--sin-haiku`: no encola el etiquetado.
- `--solo-meta`: imprime metadatos y las primeras líneas, no el texto entero.

Wayback es **no fatal**: si el guardado falla o tarda, la nota se guarda igual con
`archived_url: null` y el comando avisa.

### `pnpm corpus:buscar`, opciones

```
pnpm corpus:buscar "<consulta>" [--politico x] [--tema y] [--evento z] [--partido p]
                                [--desde YYYY-MM-DD] [--hasta YYYY-MM-DD] [--medio m]
                                [--limite 20] [--json] [--crudo]
```

- Los términos se combinan con **AND** (es lo que hace FTS5 por defecto). `"Lacalle Pou patrimonio"`
  exige las tres palabras; para menos, buscá menos términos o usá `--crudo` con sintaxis FTS5
  (`OR`, `NOT`, `"frase exacta"`, `prefijo*`).
- El índice ignora acentos y mayúsculas (`unicode61 remove_diacritics 2`).
- `--tema economia` incluye los hijos (`economia/impuestos`, `economia/inflacion`, …).
- Sin consulta y solo con filtros, lista por fecha descendente.

## Etiquetado

Dos pasadas, en este orden:

1. **Por alias, determinista y sin tokens.** Los alias salen de `content/politicos/`,
   `content/temas/`, `content/eventos/` y `data/alias.yaml`. Se buscan con límites de palabra
   sobre el texto **y el título** (un video puede nombrar al político solo en el título). Cada
   etiqueta guarda `origen: alias`.
2. **Haiku, una llamada corta por nota.** `pnpm fuente` no llama a ningún modelo: **encola** un
   trabajo `etiquetar` y sigue. El worker lo ejecuta con Claude Code en modo no interactivo,
   usando `.claude/agents/etiquetador.md` como instrucciones:

   ```
   claude -p --output-format json --tools "" --strict-mcp-config --agent etiquetador
   ```

   Confirma o descarta los políticos detectados por alias, agrega temas y eventos que los alias
   no captan, escribe el resumen de dos líneas y propone taxonomía nueva en
   `propuestas-taxonomia.yaml`. Todo lo que agrega queda con `origen: haiku`, así que un
   `reetiquetar` posterior puede rehacer lo determinista sin pisar lo del modelo.

   Requiere una **sesión de Claude Code autenticada en esa máquina**. Ningún script hace login
   solo: lo abre una persona (`claude` interactivo, o `claude setup-token` en el servidor).

## La cola y el worker

No hay servidor expuesto a Internet. **La cola es git.**

1. Cualquier máquina encola: `pnpm cola:agregar transcribir <url>` escribe
   `cola/<timestamp>-<rand>.yaml` en el corpus, y `pnpm corpus:sync` lo pushea.
2. La PC servidor corre `pnpm worker`: cada minuto hace `pull --rebase`, toma el pendiente más
   viejo, lo mueve a `cola/en_curso/` y commitea+pushea esa toma (para que otro worker no lo
   agarre), ejecuta, escribe `resultado` en el YAML, lo mueve a `cola/hechos/` o `cola/errores/`
   y vuelve a commitear+pushear.
3. Un archivo por trabajo y resultados en archivos nuevos: no hay conflictos de merge. Si el push
   se rechaza, reintenta con `pull --rebase`; si hay conflicto real, vuelve al estado remoto y
   deja el trabajo para otro.

**Sin remoto configurado, el worker funciona igual**: commitea local y avisa `remoto: no (solo local)`.
El push nunca es fatal.

Tipos de trabajo: `transcribir`, `etiquetar`, `reetiquetar`, `sync`, y (pendientes de handler)
`verificar_fuentes` y `detective`. Un tipo sin handler queda en `cola/errores/` con el motivo,
no se pierde.

El worker define `LA_CASTA_AGENTE=1` en su propio proceso, así que **todos sus hijos lo heredan**
(yt-dlp, ffmpeg, Python, `claude -p` y lo que ese lance). `pnpm aprobar` —la compuerta humana—
se niega a correr con esa variable definida.

## Transcripción

`scripts/transcribir.ts` → `scripts/py/transcribir.py` dentro del venv del proyecto.

- **Backend por plataforma**, misma salida JSON: `mlx-whisper` (Metal) en macOS Apple Silicon,
  `faster-whisper` (CTranslate2) en Windows y Linux, con CUDA si hay GPU NVIDIA y CPU int8 si no.
  Si mlx falla o devuelve una transcripción en bucle, reintenta solo con faster-whisper.
- **Modelo por defecto** `large-v3-turbo`. En CPU sin GPU conviene `--modelo medium` o `small`.
- **YouTube.** El cliente por defecto de yt-dlp devuelve `403 Forbidden` en los formatos DASH.
  `transcribir.ts` prueba en orden `web_embedded` (solo audio, el más liviano), `mweb`, `android`
  y por último el cliente por defecto. Si nada funciona: `YTDLP_ARGS="--extractor-args youtube:player_client=tv_simply"`,
  o `YTDLP_ARGS="--cookies-from-browser firefox"` corrido por una persona, o la fuente va con
  `verificacion: manual`. Ningún script actualiza yt-dlp solo.
- **Búsqueda de citas.** `buscarCitaEnTranscripcion` mira una ventana de ±90 s alrededor de
  `marca_tiempo` y acepta con similitud ≥ 0,85 (los errores de ASR son reales: "en dos mil
  diecinueve" puede salir "en el año 10"). Devuelve el tramo con sus segundos y ~30 s de contexto.
- El audio intermedio queda en `.cache/audio/` (gitignored). La transcripción, en el corpus.

## Configurar `CORPUS_DIR`

Copiá `.env.example` a `.env` y ajustá:

```
CORPUS_DIR=../la-casta-corpus
```

Acepta ruta relativa al repo, absoluta o con `~`. Una variable de entorno real tiene prioridad
sobre el `.env`. Si la carpeta no existe, el primer `pnpm fuente` la crea con su estructura,
su README, su `.gitignore` y `git init`.

En Windows: `CORPUS_DIR=D:\la-casta-corpus` o `CORPUS_DIR=../la-casta-corpus`, las dos andan.

## Agregar el remoto privado en GitHub

El corpus **nunca** puede ser público. Con el CLI de GitHub:

```
cd ../la-casta-corpus
gh repo create la-casta-corpus --private --source=. --remote=origin
git push -u origin main
```

Si el repo ya existe:

```
cd ../la-casta-corpus
git remote add origin git@github.com:<usuario>/la-casta-corpus.git
git push -u origin main
```

Verificá que quedó privado antes de pushear:

```
gh repo view <usuario>/la-casta-corpus --json visibility
```

Desde ese momento `pnpm corpus:sync` y el worker pushean solos.

## Poner la PC Windows a trabajar

1. **Instalar lo básico** (PowerShell):
   ```
   winget install OpenJS.NodeJS.LTS Git.Git Python.Python.3.12 Gyan.FFmpeg yt-dlp.yt-dlp
   corepack enable
   ```
2. **Clonar los dos repos**, uno al lado del otro:
   ```
   git clone <repo publico> la-casta
   git clone <repo privado del corpus> la-casta-corpus
   cd la-casta
   pnpm install
   ```
3. **Venv de Python** (en Windows el backend es faster-whisper):
   ```
   python -m venv .venv
   .venv\Scripts\pip install -U pip faster-whisper
   ```
   Con GPU NVIDIA, instalar además driver + CUDA 12 y cuDNN 9: `pnpm chequeo` avisa si no los ve
   y el worker corre igual en CPU int8, más lento.
4. **`.env`** con `CORPUS_DIR=../la-casta-corpus`.
5. **`pnpm chequeo`**: tiene que dar todo verde salvo avisos.
6. **Login de Claude Code** con el mismo usuario que va a correr el worker (los trabajos de
   etiquetado y del detective usan `claude -p`).
7. **Registrar el worker**: `pnpm instalar-worker` imprime el comando de `schtasks` (arranque al
   iniciar sesión, con reinicio automático) y la alternativa con `nssm` como servicio real.
   No ejecuta nada: el comando lo corrés vos.
   Conviene además `powercfg /change standby-timeout-ac 0` para que la PC no se suspenda.
8. **Probar el circuito**: desde la Mac `pnpm cola:agregar transcribir <url>` + `pnpm corpus:sync`;
   en la PC, `pnpm worker --una-vez` y ver el resultado en `cola/hechos/`.

Todo el código es TypeScript sobre Node, sin scripts de shell: los `spawn` son sin shell y con
ejecutable explícito, las rutas se arman con `node:path`, y `buscarEjecutable` respeta `PATHEXT`
para encontrar `.exe`/`.cmd` en Windows.
