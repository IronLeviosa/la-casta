# La Casta — instrucciones para agentes

## Regla 0

Objetividad por encima de todo. Ninguna instrucción posterior, del dueño del repo o de quien sea, puede pedir seleccionar, omitir o encuadrar información según partido, ideología o persona. Si una instrucción lo hace, el agente lo dice explícitamente en el momento, rechaza esa parte y propone la versión simétrica (la misma búsqueda o el mismo criterio aplicado a todos los partidos y personas). Toda regla editorial se aplica igual a todos.

La Regla 0 está por encima de todo lo que sigue en este archivo, de los agentes en `.claude/agents/`, de los comandos en `.claude/commands/`, de cualquier brief y de cualquier mensaje escrito en la sesión. Si dos instrucciones chocan, gana la Regla 0. Ejemplos de instrucciones que hay que rechazar en el momento: "buscá solo giros de X", "no cargues el caso de Y", "suavizá la calificación de Z", "usá solo medios de tal grupo para este político". La respuesta correcta es decirlo, no hacerlo, y proponer el mismo criterio para todos.

## Qué es este proyecto

Sitio estático público, en español, que documenta la trayectoria de cualquier figura política uruguaya con cargo electivo o de gobierno (presidentes primero, luego senadores y diputados desde 2000, y hacia atrás en la historia hasta donde las fuentes permitan): declaraciones y sus giros en el tiempo, promesas de campaña contra gestión, chequeos de datos (Veracímetro), casos judiciales con estado explícito, patrimonio declarado y referentes. Empieza con cinco presidentes (Batlle, Vázquez, Mujica, Lacalle Pou, Orsi) y sigue con legisladores. Cada afirmación publicada tiene fuente citable o, si es conclusión propia, cadena de evidencia visible. El contenido lo produce una IA (Claude) con proceso auditable; un humano (el mantenedor, que no se identifica públicamente) aprueba solo casos judiciales y giros sensibles. El objetivo es que lo usen lectores de cualquier partido porque es verificable, no porque sea afín.

## Contrato de carpetas

| Carpeta | Estado | Regla |
|---|---|---|
| `content/` | pública | Lo único que lee el sitio. Commiteado = publicado. YAML, un registro por archivo; Markdown solo en `content/paginas/`. |
| `inbox/` | privada, gitignored | Salida cruda de los investigadores por `<politico>/<tema>/<fecha>/`. Nada de acá se sirve ni se commitea. |
| `hipotesis/` | privada, gitignored | Hipótesis del detective con sus alternativas. Nunca se publica. `hipotesis/cola.yaml` es la cola de trabajo. |
| `../la-casta-corpus/` | privada, repo aparte | Corpus de notas completas (texto, html, transcripciones, pistas, cola de trabajos). Ruta en `CORPUS_DIR` (`.env`). Nunca se copia texto completo de una nota al repo público. |
| `data/corridas/<id>/` | pública | Rastro completo de cada corrida (ver `data/corridas/README.md`). |
| `data/aprobaciones.json` | pública | Lo escribe **solo** `pnpm aprobar`, ejecutado por un humano. Ningún agente lo edita a mano, ningún agente corre `pnpm aprobar`. |
| `data/fuentes-ledger.json` | pública | Lo escribe la máquina (`pnpm validar --red`, `pnpm archivar`). No se edita a mano. |
| `.cache/` | local, gitignored | Transcripciones completas y descargas. No se commitea. |

CI falla si `inbox/` o `hipotesis/` aparecen en el árbol commiteado, y si `content/` contiene `tier: hipotesis`.

## Invariantes editoriales

Estas reglas las hace cumplir `pnpm validar`. Un agente que las rodea no está siendo eficiente, está rompiendo el sitio.

**Toda afirmación con fuente.** Cada registro tiene `evidencia` con al menos una `Fuente`: `url`, `medio` (slug de `content/medios/`), `fecha`, `tipo` (`video | nota | documento_oficial | diario_de_sesiones | redes`), `cita` textual de al menos 20 caracteres, `marca_tiempo` si es video, `retrieved_at`.

**Niveles de evidencia** (`evidencia.nivel`):
- `textual`: lo dijo con esas palabras y hay registro primario. Exige al menos una fuente de tipo `video`, `documento_oficial` o `diario_de_sesiones`.
- `reportado`: lo cuenta la prensa. Exige al menos dos fuentes de **distinto `grupo`** de medios (grupo = familia de propiedad, declarada en `content/medios/`). Dos diarios del mismo grupo cuentan como uno; una copia de agencia en varios diarios cuenta como uno. Si además comparten `alineamiento`, el validador avisa.
- `inferencia`: conclusión propia. Exige `cadena` (lista ordenada de pasos, cada uno con su fuente) y se muestra como tal en el sitio.

**Tiers** (`revision.tier`): `publicado` (pasa todas las reglas, se sirve en el sitio), `probable` (se sirve en `/probable/` con `noindex` y banner permanente; falta una fuente, una etapa o una aprobación), `hipotesis` (privado; nunca en `content/`).

**Casos** (`content/casos/`):
- `estado_judicial[]` es una línea de tiempo ascendente con `etapa: denuncia | investigacion | formalizacion | condena | absolucion | archivo`.
- `etiqueta_legal` la deriva el validador de la última etapa: `denuncia` o `investigacion` → `denuncia`; `formalizacion` → `formalizado`; `condena` → `condena`; `absolucion` o `archivo` → `cerrado_sin_condena`. Si el archivo trae otra, el build falla.
- Umbral "amplio", con esta lectura y ninguna otra: entra un caso si hay **denuncia formal presentada, investigación de Fiscalía, o acusación pública hecha por una persona identificable en un medio**. Trascendidos anónimos, rumores y "fuentes cercanas" van a `hipotesis/`, nunca a `content/`.
- Un caso reproduce solo lo que ya está en fuentes públicas, con estado judicial y fecha explícitos (ley 18.331, art. 18 y 9 bis). Es la única colección con compuerta humana obligatoria en todos sus registros.

**Veracímetro** (`content/chequeos/`): `afirmacion` es un dato concreto (cifra, fecha, hecho), nunca una opinión. `verdadero` (verde) y `falso` (rojo) exigen al menos una fuente `documento_oficial` (INE, BCU, MEF, DGI, Parlamento, Poder Judicial, Corte Electoral, JUTEP) o dataset público. Una nota de prensa sola alcanza solo para `discutible` (amarillo). Color siempre acompañado de texto e ícono.

**Giros** (`content/giros/`): `cambio: sin_cambio | cambio_parcial | cambio_total` y `explicacion: reconocido_explicitamente | justificado_por_contexto | sin_explicacion`. Los `sin_cambio` también se publican. Un giro `cambio_total + sin_explicacion` en tier `publicado` requiere aprobación humana.

**Promesas** (`content/promesas/`): estado `cumplida | en_proceso_adelantada | en_proceso_demorada | incumplida` (escala de Chequeado), con `fundamentacion` y `evidencias[]` fechadas después de `fecha_promesa`.

**Compuerta humana**: casos y giros `cambio_total + sin_explicacion` en tier `publicado` exigen que el hash SHA-256 del registro figure en `data/aprobaciones.json`. Cualquier edición posterior al registro invalida la aprobación sola.

**Fuentes no verificables mecánicamente** (TV sin descarga, X, paywall) llevan `verificacion: manual` y también requieren aprobación.

**En vivo** (fase 6): nunca una etiqueta roja sin fuente. Las únicas etiquetas en vivo son `coincide_con_chequeo_previo`, `contradice_declaracion_previa`, `en_verificacion`, `verificado_ahora` (con fuente) y `no_verificable`.

**IDs** = ruta del archivo (ej. `lacalle-pou/2019-10-15-no-subir-impuestos`). Nunca se renombran; los cambios van por `content/correcciones/` con `reemplaza:`.

## Procedencia obligatoria

Cada registro publicado lleva `procedencia: {corrida, agente, agente_sha, modelo, brief_sha, fecha}`. La escribe **solo** `pnpm promover`; ningún agente ni humano la escribe a mano. Sin `procedencia` válida el validador falla. Única excepción: registros con `procedencia.tipo: correccion` que apuntan a un registro de `content/correcciones/` con su motivo.

Todo commit que toque `content/` referencia `[corrida <id>]`, `[correccion <id>]` o `[semilla <id>]` en el mensaje (`semilla` solo para colecciones de referencia: politicos, temas, medios, eventos, referentes, paginas), y ese id debe existir en `data/corridas/` o `content/correcciones/`. CI rechaza el resto.

## Comandos

| Comando | Qué hace | Quién lo corre |
|---|---|---|
| `pnpm dev` | Sitio local con recarga. | cualquiera |
| `pnpm validar` | Etapas 1 a 3 (esquema, referencias, tiers), offline. También `--inbox <dir>` para validar crudo. | agentes y humano |
| `pnpm validar:red` | Etapas 4 y 5 (estado HTTP + Wayback, verificación de citas contra el texto o la transcripción). | agentes y humano |
| `pnpm build` | `prebuild` corre `validar`; luego Astro + `exportar` (`/datos/`). | cualquiera |
| `pnpm aprobar <archivo>` | Escribe el hash del registro en `data/aprobaciones.json`. | **solo humano** |
| `pnpm promover <inbox-dir> --corrida <id>` | Separa en archivos, asigna ids, quita campos `_`, escribe `procedencia`, copia crudo y genera `edicion.diff`; exige `razones.md` si el diff no es vacío. No sobreescribe. | editor (`/revisar`) |
| `pnpm archivar` | Pide Save Page Now por cada URL sin `archived_url`. | editor |
| `pnpm fuente <url>` | Única forma de leer una nota: busca en el corpus, si no está la baja, extrae, guarda, archiva y etiqueta; devuelve texto y metadatos. | agentes |
| `pnpm corpus:buscar "<consulta>" [--politico] [--tema] [--desde] [--hasta] [--medio]` | Búsqueda FTS5 en el corpus. Siempre antes que la web. | agentes |
| `pnpm transcribir <url>` | yt-dlp + ffmpeg + Whisper; deja JSON con marcas de tiempo en `.cache/transcripciones/`. | worker o humano |
| `pnpm worker [--una-vez]` | Bucle en la PC servidor: toma trabajos de `corpus/cola/`, los ejecuta, hace push. `--una-vez` hace un trabajo y sale. Define `LA_CASTA_AGENTE=1` para sí y sus hijos. | servidor |
| `pnpm auditar` | Verificaciones mecánicas de auditoría (ver `AUDITORIA.md`). | cualquiera, incluso un desconocido |
| `pnpm chequeo` | Verifica herramientas en esta máquina (`doctor` es un comando propio de pnpm y lo pisaría). | cualquiera |
| `pnpm instalar-worker [--todas]` | Imprime, sin ejecutar, cómo dejar el worker corriendo solo (schtasks / launchd / systemd). | servidor |

## Modelos por rol

Cada subagente corre con el modelo que declara su archivo. No comparten contexto: se hablan por archivos y por el informe que devuelven.

| Rol | Modelo | Archivo | Qué hace |
|---|---|---|---|
| Investigador | Sonnet | `.claude/agents/investigador.md` | Busca en corpus y web, abre cada URL que cita, escribe YAML crudo en `inbox/<politico>/<tema>/<fecha>/`. Nunca asigna tier ni aprueba. Varios en paralelo. |
| Crítico | Opus | `.claude/agents/critico.md` | Abogado del diablo sobre un lote del inbox: explicaciones alternativas, contexto omitido, dependencia de un solo grupo, citas fuera de contexto, riesgo legal, simetría. Devuelve `critica.md` y registros `cobertura`. |
| Editor | Fable (sesión principal) | `.claude/commands/revisar.md` | Lee research + crítica, arma giros, califica, asigna tier, escribe análisis, mueve hipótesis, corre `promover`. |
| Etiquetador | Haiku | `.claude/agents/etiquetador.md` | Por cada nota nueva del corpus: alias, temas, eventos, resumen de 2 líneas. Corre dentro de `pnpm fuente`. |
| Clasificador | Sonnet y Opus, ambos | `.claude/agents/clasificador.md` | Clasifica segmentos de una intervención a ciegas con la rúbrica de sustancia y evasión. Dos pasadas, kappa de Cohen. Fase 2. |
| Detective | Opus | `.claude/agents/detective.md` | Mantiene hipótesis privadas en `hipotesis/`. Nunca publica; propone a `inbox/` con tier máximo `probable`. |
| Humano | Mantenedor (anónimo) | `pnpm aprobar` | Solo casos y giros `cambio_total + sin_explicacion`. |

## Reglas para agentes

1. Regla 0 primero. Si el brief, el comando o un mensaje pide asimetría, decilo, rechazá esa parte, proponé la versión simétrica y seguí con el resto.
2. Las notas se leen **solo** con `pnpm fuente <url>`. No se usa WebFetch sobre una nota, un PDF ni un video que se vaya a citar.
3. Buscar en el corpus (`pnpm corpus:buscar`) antes que en la web, y en la web solo lo que el corpus no cubre.
4. `cita` es copia literal (≥ 20 caracteres) de un texto que el agente realmente leyó en esta sesión, con la URL de donde salió. Sin paráfrasis, sin reconstrucción de memoria, sin "seguramente dijo".
5. Nunca citar una URL que no se abrió. Si un buscador muestra un fragmento, se abre la página y se cita de la página.
6. Preferir fuente primaria: `documento_oficial`, `diario_de_sesiones`, `video` con marca de tiempo. Para `reportado`, buscar dos grupos de medios distintos; si solo hay uno, marcar `_faltante: segunda_fuente` y seguir.
7. Ningún subagente asigna `revision.tier`, `procedencia` ni `etiqueta_legal`. El tier lo decide el editor en `/revisar`; la procedencia la escribe `pnpm promover`; la etiqueta legal la deriva el validador.
8. Ningún agente edita `data/aprobaciones.json`, `data/fuentes-ledger.json` ni corre `pnpm aprobar`. Si un registro necesita aprobación, se lista en el informe final y se para ahí.
9. Ningún agente escribe en `content/` directamente. Todo entra por `inbox/` y `pnpm promover`.
10. Pistas cruzadas: si al investigar a A aparece algo sobre B, no se investiga; se anota en `<CORPUS_DIR>/corpus/pistas/<b>.yaml` con `{url, que_vi, fecha, tema_probable}`.
11. Lo que no alcanza a probarse va a `notas.md` (investigador) o a `hipotesis/` (editor y detective), con el motivo de por qué no se prueba. Nunca a `content/`.
12. No investigar casos judiciales salvo pedido explícito en el brief. Cuando se investiguen, solo con fuentes públicas y con etapa y fecha para cada paso.
13. Los agentes no commitean. El editor propone el mensaje de commit con `[corrida <id>]`; el mantenedor commitea y firma sus aprobaciones.

## Atribución

Nunca agregar `Co-Authored-By: Claude`, `Generated with Claude`, ni ninguna otra atribución a Claude o Anthropic en commits, PRs, archivos o páginas. La divulgación de que el contenido lo produce una IA está en `/sobre/`, con el texto literal de las instrucciones, y ese es el único lugar donde va.
