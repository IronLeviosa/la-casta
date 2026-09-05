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
| `../la-casta-experimento/` | worktree, rama aparte | Brazo barato del experimento de modelos. Mismo historial, mismos briefs, agentes en Sonnet. Nunca se mezcla con `main`: se compara y se decide. |

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
- **Desenlaces con el mismo rigor que las acusaciones.** Por cada caso se busca y se registra, si existe, el archivo de la causa, la absolución, el sobreseimiento, la desestimación de la denuncia, y el hecho de que la persona no haya sido imputada. Un caso sin desenlace documentado puede existir en `probable`, nunca en `publicado`: "no se publica" quiere decir eso y solo eso, no que el caso deba borrarse. Nombrar un caso en un brief no afirma que haya responsabilidad; pide documentar lo que consta, en las dos direcciones.
- Un caso reproduce solo lo que ya está en fuentes públicas, con estado judicial y fecha explícitos (ley 18.331, art. 18 y 9 bis). Es la única colección con compuerta humana obligatoria, y solo para sus registros sin resolución judicial.

**Veracímetro** (`content/chequeos/`): `afirmacion` es un dato concreto (cifra, fecha, hecho), nunca una opinión. `verdadero` (verde) y `falso` (rojo) exigen al menos una fuente `documento_oficial` (INE, BCU, MEF, DGI, Parlamento, Poder Judicial, Corte Electoral, JUTEP) o dataset público. Una nota de prensa sola alcanza solo para `discutible` (amarillo). Color siempre acompañado de texto e ícono.

**Giros** (`content/giros/`): `cambio: sin_cambio | cambio_parcial | cambio_total` y `explicacion: reconocido_explicitamente | justificado_por_contexto | sin_explicacion`. Los `sin_cambio` también se publican. Un giro `cambio_total + sin_explicacion` en tier `publicado` requiere aprobación humana.

**Discrepancias** (`content/discrepancias/`): distancia comprobable entre lo que publicó un medio y lo que dice la fuente primaria del mismo hecho. El sitio ya mide el sesgo de los medios por tono y por propiedad; esto agrega la dimensión más comprobable, si lo publicado coincide con el documento. Tres reglas, y valen más que el resto del esquema:
- **Solo contra fuente primaria.** Dos medios que se contradicen entre sí no son una discrepancia, son un desacuerdo. Hace falta el documento oficial, el diario de sesiones o el video que decide. Sin eso va a `hipotesis/`.
- **Sin verbos de intención.** No se sabe si el medio se equivocó, copió mal o mintió, y el esquema no tiene campo para eso a propósito. Se registra qué publicó y qué dice el original.
- **El mismo umbral para todos.** Un error del medio que cubre favorablemente a alguien pesa igual que el del que lo cubre en contra, y la cuenta se normaliza por veces citado: contar errores sin contar citas castiga al medio que más se usa.

**Vetos** (`content/vetos/`): el veto es la facultad por la que el presidente frena, solo con su firma, un proyecto que ya aprobaron las dos cámaras, y por eso se registra aparte. Cada registro lleva `alcance: total | parcial` (si es parcial, qué artículos se observaron), el `fundamento` que dio el Poder Ejecutivo y el `resultado` parlamentario (`observaciones_aceptadas | veto_levantado | pendiente | sin_datos`) con sus propias fuentes. Un veto sin desenlace documentado no llega a `publicado`: el veto y lo que el Parlamento hizo después son un solo hecho, y contar solo la mitad lo deforma. Como en casos, el desenlace se busca con el mismo rigor que el veto.

**Promesas** (`content/promesas/`): estado `cumplida | en_proceso_adelantada | en_proceso_demorada | incumplida` (escala de Chequeado), con `fundamentacion` y `evidencias[]` fechadas después de `fecha_promesa`.

**Compuerta humana**: exigen que el hash SHA-256 del registro figure en `data/aprobaciones.json`, en tier `publicado`, los casos **sin resolución judicial** (etiqueta `denuncia` o `formalizado`) y los giros `cambio_total + sin_explicacion`. Un caso con etiqueta `condena` o `cerrado_sin_condena` no pasa por la compuerta: el proceso terminó, el hecho es público y firmado por un tribunal, y una firma nuestra solo agregaría demora. La compuerta existe para el terreno donde hay algo que decidir, que es publicar una acusación sin resolver sobre una persona nombrada. Cualquier edición posterior al registro invalida la aprobación sola.

**Fuentes no verificables mecánicamente** (TV sin descarga, X, paywall) llevan `verificacion: manual` y también requieren aprobación.

**En vivo** (fase 6): nunca una etiqueta roja sin fuente. Las únicas etiquetas en vivo son `coincide_con_chequeo_previo`, `contradice_declaracion_previa`, `en_verificacion`, `verificado_ahora` (con fuente) y `no_verificable`.

**IDs** = ruta del archivo (ej. `lacalle-pou/2019-10-15-no-subir-impuestos`). Nunca se renombran; los cambios van por `content/correcciones/` con `reemplaza:`.

**Cómo cambia un registro ya publicado.** Primero se escribe el registro en `content/correcciones/`, que dice qué cambia, por qué y a qué ids afecta. Después `pnpm promover <dir> --correccion <id>` sobreescribe solo esos ids y les pone procedencia de tipo corrección. Sin la corrección escrita, `promover` se niega: un registro publicado no cambia sin una pieza pública que lo explique. Subir un registro de `probable` a `publicado` porque apareció la fuente que faltaba también es una corrección, del tipo `cambio_de_rating`: no hubo error, pero el lector que vio la versión anterior merece saber que cambió.

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
| `pnpm aprobar --pendientes` | Lista los registros que esperan la firma del mantenedor, separados en los que bloquean el build, los que esperan para poder publicarse y los que se firmaron antes y cambiaron después. Da el comando exacto de cada uno. | cualquiera |
| `pnpm aprobar <archivo>` | Escribe el hash del registro en `data/aprobaciones.json`. | **solo humano** |
| `pnpm promover <inbox-dir> --corrida <id>` | Separa en archivos, asigna ids, quita campos `_`, escribe `procedencia`, copia crudo y genera `edicion.diff`; exige `razones.md` si el diff no es vacío. No sobreescribe. | `/revisar`, desde el chat |
| `pnpm promover <dir> --correccion <id>` | Aplica una corrección ya escrita en `content/correcciones/<id>.yaml`: sobreescribe **solo** los registros que esa corrección declara en `afecta` y les pone `procedencia: {tipo: correccion, correccion}`. Es el único camino por el que cambia un registro ya publicado. | `/revisar`, desde el chat |
| `pnpm archivar` | Pide Save Page Now por cada URL sin `archived_url`. | `/revisar`, desde el chat |
| `pnpm fuente <url>` | Única forma de leer una nota: busca en el corpus, si no está la baja, extrae, guarda, archiva y etiqueta; devuelve texto y metadatos. | agentes |
| `pnpm corpus:buscar "<consulta>" [--politico] [--tema] [--desde] [--hasta] [--medio]` | Búsqueda FTS5 en el corpus. Siempre antes que la web. | agentes |
| `pnpm descubrir <medio> [--desde AAAA-MM] [--hasta AAAA-MM] [--terminos a,b,c]` | Lista notas candidatas leyendo el sitemap que publica el medio, para los dominios que el buscador no devuelve. No baja notas: las candidatas se leen con `pnpm fuente`. Respeta los `Disallow` del `robots.txt` del medio. | agentes |
| `pnpm transcribir <url>` | yt-dlp + ffmpeg + Whisper; deja JSON con marcas de tiempo en `.cache/transcripciones/`. | worker o humano |
| `pnpm worker [--una-vez]` | Bucle en la PC servidor: toma trabajos de `corpus/cola/`, los ejecuta, hace push. `--una-vez` hace un trabajo y sale. Define `LA_CASTA_AGENTE=1` para sí y sus hijos. | servidor |
| `pnpm auditar` | Verificaciones mecánicas de auditoría (ver `AUDITORIA.md`). | cualquiera, incluso un desconocido |
| `pnpm experimento crear` | Arma el brazo barato del experimento de modelos: worktree nuevo, sin la salida de los agentes, con los mismos briefs y los roles caros en Sonnet (ver `EXPERIMENTO.md`). Exige árbol limpio. | mantenedor |
| `pnpm comparar <A> <B>` | Compara dos árboles de `content/` producidos por el mismo brief: cobertura, kappa de tier, de giros y de promesas, tipos de fuente, y la lista de registros a adjudicar a ciegas. | cualquiera |
| `pnpm chequeo` | Verifica herramientas en esta máquina (`doctor` es un comando propio de pnpm y lo pisaría). | cualquiera |
| `pnpm instalar-worker [--todas]` | Imprime, sin ejecutar, cómo dejar el worker corriendo solo (schtasks / launchd / systemd). | servidor |

## Modelos por rol

Cada subagente corre con el modelo que declara su archivo. No comparten contexto: se hablan por archivos y por el informe que devuelven.

> **Experimento en curso (desde el 2026-09-04).** Se está midiendo si los modelos caros compran calidad o son inercia, corriendo el pipeline con modelos baratos y comparando después. Mientras dure, hay corridas en las que el crítico, el editor y el detective corren con Sonnet en lugar de Opus y Fable, con el modelo pasado en la llamada al subagente y sin tocar estos archivos. Eso es deliberado y queda registrado en `procedencia.modelo` de cada registro y en `agentes.json` de la corrida. Un agente que note la diferencia entre lo que dice esta tabla y el modelo con el que está corriendo tiene que decirlo en su informe, como corresponde, pero no es un error de proceso. El protocolo, los sesgos conocidos y el criterio de decisión están en `EXPERIMENTO.md`.

| Rol | Modelo | Archivo | Qué hace |
|---|---|---|---|
| Investigador | Sonnet | `.claude/agents/investigador.md` | Busca en corpus y web, abre cada URL que cita, escribe YAML crudo en `inbox/<politico>/<tema>/<fecha>/`. Nunca asigna tier ni aprueba. Varios en paralelo. |
| Crítico | Opus | `.claude/agents/critico.md` | Abogado del diablo sobre un lote del inbox: explicaciones alternativas, contexto omitido, dependencia de un solo grupo, citas fuera de contexto, riesgo legal, simetría. Devuelve `critica.md` y registros `cobertura`. |
| Editor | Fable (subagente `editor`, un lote por vez) | `.claude/agents/editor.md` | Solo los pasos de criterio: arma giros, califica promesas y chequeos, asigna tier, escribe análisis y razones, mueve hipótesis. Lo mecánico (validar, lanzar al crítico, promover, archivar, build) lo corre `/revisar` desde el chat, con el modelo que eligió el humano. |
| Etiquetador | Haiku | `.claude/agents/etiquetador.md` | Por cada nota nueva del corpus: alias, temas, eventos, resumen de 2 líneas. Corre dentro de `pnpm fuente`. |
| Clasificador | Sonnet y Opus, ambos | `.claude/agents/clasificador.md` | Clasifica segmentos de una intervención a ciegas con la rúbrica de sustancia y evasión. Dos pasadas, kappa de Cohen. Fase 2. |
| Detective | Opus | `.claude/agents/detective.md` | Mantiene hipótesis privadas en `hipotesis/`. Nunca publica; propone a `inbox/` con tier máximo `probable`. |
| Discrepancias | las escribe el crítico | `.claude/agents/critico.md` | Cuando al releer una fuente encuentra que lo publicado no coincide con el documento original, lo registra en `discrepancias.yaml` del lote además de anotarlo en la crítica. |
| Resolvedor | Sonnet | `.claude/agents/resolvedor.md` | Toma registros en `probable` y busca lo que les falta: casi siempre una segunda fuente de otro grupo o un documento oficial. Deja la fuente en `inbox/resoluciones/`; no cambia tier. |
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
14. Fable solo corre donde alguien lo eligió: en el chat (lo elige el mantenedor en cada sesión) y en el subagente `editor` (lo fija su archivo). Todo otro subagente se lanza por su tipo (`investigador`, `critico`, `detective`, `clasificador`, `etiquetador`) o, si es genérico, con `model: opus` o `model: sonnet` explícito; nunca con `model: fable` ni heredando Fable del chat. El editor recibe un solo lote por vez y solo lo sustantivo (registros, crítica, notas); `pnpm agentes` avisa si algo corrió en Fable fuera de esa regla.

## Atribución

Nunca agregar `Co-Authored-By: Claude`, `Generated with Claude`, ni ninguna otra atribución a Claude o Anthropic en commits, PRs, archivos o páginas. La divulgación de que el contenido lo produce una IA está en `/sobre/`, con el texto literal de las instrucciones, y ese es el único lugar donde va.
