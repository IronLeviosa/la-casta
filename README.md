# La Casta

Sitio público, en español, que documenta la trayectoria de figuras políticas uruguayas (presidentes, senadores y diputados desde 2000, ampliando hacia atrás en la historia): qué dijeron y cuándo cambiaron de posición, qué prometieron y qué hicieron, qué afirmaciones son ciertas (Veracímetro), qué casos judiciales tienen y en qué estado, qué patrimonio declararon. Cada afirmación tiene fuente citable o cadena de evidencia. El contenido lo produce Claude con instrucciones públicas; desde el 2026-09-09 no hay aprobación humana registro por registro: lo que pasa el validador se publica, y lo que no queda en probable diciendo qué le falta.

Este README es para quien mantiene el sitio. La explicación pública del proyecto está en `content/paginas/sobre.md`; las reglas para los agentes en `CLAUDE.md` y `docs/colecciones/`; cómo auditarlo en `AUDITORIA.md`; el plan de trabajo vigente en `docs/plan-2026-09.md`.

## Comandos de infraestructura

Los que corren los agentes están en la tabla de `CLAUDE.md`. Estos son los del mantenedor y del servidor:

| Comando | Qué hace |
|---|---|
| `pnpm dev` | Sitio local con recarga. |
| `pnpm build` | `prebuild` corre `validar`; luego Astro, `exportar` (`/datos/`) y `revisar:paginas`. |
| `pnpm chequeo` | Verifica Node, pnpm, git, Python, ffmpeg, yt-dlp y Whisper en esta máquina (`doctor` es un comando propio de pnpm y lo pisaría). |
| `pnpm transcribir <url>` | yt-dlp + ffmpeg + Whisper; deja JSON con marcas de tiempo en `.cache/transcripciones/`. |
| `pnpm worker [--intervalo <seg>] [--una-vez] [--tipo <tipo>] [--ayuda]` | Bucle en la PC servidor: toma de `corpus/cola/` el pendiente de mayor prioridad (precarga > transcribir > el resto > etiquetar al final, para que miles de `etiquetar` no tapen lo urgente), lo ejecuta, hace push. `--tipo` restringe a un solo tipo; una opción desconocida no arranca el bucle (usage por stderr, sale con 2). Define `LA_CASTA_AGENTE=1` para sí y sus hijos. Se corta con Ctrl+C en su propia terminal (cerrar la ventana no mata los `node` hijos que pnpm dejó corriendo). |
| `pnpm cola:agregar <tipo> [valor]`, `pnpm cola:ver` (cuenta pendientes por tipo), `pnpm cola:reintentar <id> \| --todos [--tipo <tipo>]` (reencola desde `errores/`), `pnpm cola:vaciar --tipo <tipo> [--simulacion]` (saca de la cola los pendientes de un tipo) | Cola de trabajos por git, sin puertos abiertos. |
| `pnpm instalar-worker [--todas]` | Imprime, sin ejecutar, cómo dejar el worker corriendo solo (schtasks / launchd / systemd). |
| `pnpm agentes [--todas-las-sesiones]` | Consumo de tokens por agente de esta máquina, con el modelo real de cada uno. |
| `pnpm experimento crear` | Arma el brazo barato del experimento de modelos (`EXPERIMENTO.md`). Exige árbol limpio. |
| `pnpm comparar <A> <B>` | Compara dos árboles de `content/` producidos por el mismo brief: cobertura, kappa de tier, giros y promesas. |
| `pnpm corpus:sync`, `pnpm corpus:indexar`, `pnpm corpus:estadisticas` | Mantenimiento del corpus privado (`docs/corpus.md`). |
| `pnpm corpus:reextraer [--medio <slug>] [--desde AAAA-MM] [--hasta AAAA-MM] [--limite n] [--escribir]` | Vuelve a extraer el texto de notas ya bajadas (`notas/<id>.html.gz`) con el extractor vigente y lo compara contra el guardado; sin `--escribir` es una simulación (lista lo que cambia ≥15% y un resumen por medio), con `--escribir` reemplaza texto/hash/`extraccion` y nunca achica. |
| `pnpm corpus:borrar <id> --motivo "<texto>" [--simulacion]` | Saca del corpus una nota que nadie citó (json, html/pdf crudo, transcripción, filas del índice, trabajos pendientes de cola); se niega si algún registro de `content/` la cita o si el catálogo ya sacó afirmaciones de ella, y deja constancia en `borradas.jsonl`. |
| `pnpm corpus:precarga <tipo> [opciones] --una-vez` y `pnpm cola:agregar precargar_diarios \| precargar_presidencia \| precargar_inventario …` | Precarga nocturna del corpus sin ningún modelo: diarios de sesiones de la Hemeroteca por cámara y mes, conferencias y discursos de Presidencia (con sus videos encolados a transcribir), inventarios de documentos de una empresa. Reanudable; concurrencia 2 por host. |
| `pnpm catalogo <politico> [--desde AAAA-MM] [--hasta AAAA-MM] [--tema <slug>] [--json]` | Informe por persona sobre lo que ya catalogaron las dos pasadas de Haiku (docs/plan-catalogo.md, etapa C): junta del índice y de las notas toda afirmación del político y las notas donde quedó central/secundaria sin afirmación (cobertura), agrupa por tema y propone lotes de como mucho 40 notas y 30 afirmaciones dato/promesa cada uno. Escribe `data/catalogo/<politico>.json` (público, sin texto completo de ninguna nota) y lo resume en consola; `--json` imprime el JSON entero. No llama a ningún modelo. |
| `pnpm sesion:indexar [--camara CS\|CR\|AG\|CP] [--limite n] [--reintentar] [--concurrencia n]` | Arma `data/diarios-archive.json`, el índice fecha → ítem de la colección `uruguay-diario-sesiones` de archive.org, que `pnpm sesion` consulta solo (docs/fuentes-oficiales/parlamento.md §2.3). Incremental, 30 a 40 minutos de red la primera vez, sin tokens. |
| `pnpm catalogo:reintentar [--trabajo <id>]... \| --todos [--tamano 190] [--simulacion]` | Junta `progreso.errores` de trabajos `catalogar` ya en `hechos/`, separa los de red (fetch failed, timeouts, HTTP 5xx/429: reintentables) de los que no (armazón JS, 404, sin texto), saca las URL que el corpus ya tiene catalogadas y encola trabajos `catalogar` nuevos en lotes de `--tamano`. Pensado para el apagón de DNS del 2026-09-16; `--simulacion` no escribe nada. |
| `pnpm catalogo:rendimiento --reconstruir [--simulacion]` | Recalcula `errores`/`notas_catalogadas` y los promedios por nota de cada fila de `data/catalogo/rendimiento.json` contra su trabajo `catalogar` de origen en `hechos/`; una fila sin trabajo (movido, borrado) queda igual y se avisa. Arregla filas contaminadas por un tramo con muchos `fetch failed` sin excluirlos del promedio. |

**En vivo (fase 6, todavía no construida):** nunca una etiqueta roja sin fuente. Las únicas etiquetas en vivo serán `coincide_con_chequeo_previo`, `contradice_declaracion_previa`, `en_verificacion`, `verificado_ahora` (con fuente) y `no_verificable`.

## Correrlo en cinco comandos

```
pnpm install        # baja las dependencias (una vez, o cuando cambie package.json)
pnpm doctor         # verifica Node, pnpm, git, Python, ffmpeg, yt-dlp y Whisper en esta máquina
pnpm dev            # sitio local en http://localhost:4321, se recarga solo
pnpm validar        # revisa todo el contenido sin tocar la red (esquema, referencias, tiers)
pnpm build          # valida y construye el sitio en dist/
```

Si `pnpm doctor` marca algo en rojo, imprime el comando de instalación para esta máquina. Corrélo y volvé a probar.

## Estructura de carpetas

```
content/     lo único que lee el sitio; todo público; commiteado = publicado
  politicos/ temas/ medios/ eventos/ referentes/   semillas (a mano, con fuentes)
  declaraciones/ giros/ promesas/ chequeos/ casos/ menciones/ patrimonio/ intervenciones/ cobertura/ correcciones/
  paginas/   sobre, metodología, réplica, correcciones, privacidad
data/
  corridas/<id>/     rastro de cada corrida (ver data/corridas/README.md)
  fuentes-ledger.json estado de cada URL; lo escribe la máquina
inbox/       salida cruda de los investigadores; privada, no se sube a git
hipotesis/   hipótesis del detective; privada, no se sube a git
../la-casta-corpus/   repo privado aparte con el texto completo de las notas
.claude/agents/      un archivo por rol de IA (investigador, crítico, editor, resolvedor, detective, etiquetador, clasificador)
.claude/commands/    /investigar, /revisar, /correccion, /detective, /auditar
docs/colecciones/    reglas por colección (las lee el brief, el editor y el crítico); docs/ejemplos/ un registro de muestra por colección
scripts/     validador, promover, archivar, transcribir, corpus, worker
src/         el sitio (Astro): esquemas, páginas, componentes
tests/       fixtures buenos y malos para el validador
```

## Flujo de una corrida

1. En Claude Code, dentro de esta carpeta: `/investigar lacalle-pou economia/impuestos`. Arma el brief, lo guarda en `data/corridas/<id>/brief.md`, lanza un investigador (Sonnet) por tema y valida el resultado contra las páginas reales. Deja todo en `inbox/`.
2. `/revisar inbox/lacalle-pou/economia-impuestos/<fecha>`. Lanza al crítico (Opus), arma giros, califica, asigna tier, mueve hipótesis a `hipotesis/`, corre `pnpm promover` (que escribe la procedencia y el diff), escribe las razones, archiva URLs, valida con red y construye. Termina con una lista de lo que necesita tu aprobación y un mensaje de commit propuesto.
3. Mirá el sitio con `pnpm dev`. No hay nada que aprobar: lo que pasa el validador se publica, y lo que no queda en probable diciendo qué le falta.
4. Commit con el mensaje propuesto, que termina en `[corrida <id>]`. Push. CI valida y despliega.

## Qué hacer cuando algo falla

- **`pnpm validar` termina con código 1**: error de contenido. El mensaje dice archivo, campo y regla. Lo normal es que sea un registro sin segunda fuente, una fecha invertida en un giro, o una etapa de un caso sin fuente. Se arregla en el archivo o bajando el registro a `probable`; nunca inventando una fuente.
- **Código 2**: falló la infraestructura (red, Wayback, yt-dlp). No es el contenido. Reintentá; si persiste, `pnpm doctor`.
- **`pnpm validar:red` dice "cita no encontrada"**: la cita no aparece en el texto de la página o en la transcripción. O la página cambió (mirá el enlace de Wayback en el ledger), o el agente la parafraseó. Se vuelve a leer la fuente con `pnpm fuente <url>` y se copia literal; si no está, el registro no se publica.
- **`pnpm build` falla**: primero corre `validar`; si eso pasa y falla Astro, el error suele ser una referencia rota (un `politico:` o `medio:` que no existe). El mensaje dice cuál.
- **Un video no se puede transcribir**: yt-dlp se rompe cada tanto con cambios de YouTube. `.venv/bin/pip install -U yt-dlp` y de nuevo. Si el video no está disponible, la fuente pasa a `verificacion: manual` y el registro queda en probable hasta que el resolvedor encuentre una fuente cotejable.
- **Un agente hizo algo asimétrico o te pidió algo raro**: abrí `data/corridas/<id>/brief.md`, `critica.md` y `razones.md`; ahí tiene que estar todo. Si no está, es un hallazgo de auditoría (ver `AUDITORIA.md`).
- **CI rechaza el commit**: o falta `[corrida <id>]` en el mensaje, o `inbox/` o `hipotesis/` se colaron en el árbol. `git status` y `git rm --cached` lo que sobre.

## Licencias

Código: MIT (`LICENSE`). Contenido de `content/` y `data/`: CC BY 4.0 (`LICENSE-CONTENIDO.md`). El corpus de notas completas es privado y no se redistribuye.
