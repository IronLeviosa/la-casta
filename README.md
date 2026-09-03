# La Casta

Sitio público, en español, que documenta la trayectoria de figuras políticas uruguayas (presidentes, senadores y diputados desde 2000, ampliando hacia atrás en la historia): qué dijeron y cuándo cambiaron de posición, qué prometieron y qué hicieron, qué afirmaciones son ciertas (Veracímetro), qué casos judiciales tienen y en qué estado, qué patrimonio declararon. Cada afirmación tiene fuente citable o cadena de evidencia. El contenido lo produce Claude con instrucciones públicas; vos aprobás solo casos judiciales y giros sensibles.

Este README es para quien mantiene el sitio. La explicación pública del proyecto está en `content/paginas/sobre.md`; las reglas para los agentes en `CLAUDE.md`; cómo auditarlo en `AUDITORIA.md`.

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
  aprobaciones.json  hashes de lo que aprobaste; solo lo escribe `pnpm aprobar`
  fuentes-ledger.json estado de cada URL; lo escribe la máquina
inbox/       salida cruda de los investigadores; privada, no se sube a git
hipotesis/   hipótesis del detective; privada, no se sube a git
../la-casta-corpus/   repo privado aparte con el texto completo de las notas
.claude/agents/      un archivo por rol de IA (investigador, crítico, detective, etiquetador, clasificador)
.claude/commands/    /investigar, /revisar, /detective, /auditar
scripts/     validador, promover, aprobar, archivar, transcribir, corpus, worker
src/         el sitio (Astro): esquemas, páginas, componentes
tests/       fixtures buenos y malos para el validador
```

## Flujo de una corrida

1. En Claude Code, dentro de esta carpeta: `/investigar lacalle-pou economia/impuestos`. Arma el brief, lo guarda en `data/corridas/<id>/brief.md`, lanza un investigador (Sonnet) por tema y valida el resultado contra las páginas reales. Deja todo en `inbox/`.
2. `/revisar inbox/lacalle-pou/economia-impuestos/<fecha>`. Lanza al crítico (Opus), arma giros, califica, asigna tier, mueve hipótesis a `hipotesis/`, corre `pnpm promover` (que escribe la procedencia y el diff), escribe las razones, archiva URLs, valida con red y construye. Termina con una lista de lo que necesita tu aprobación y un mensaje de commit propuesto.
3. Mirá el sitio con `pnpm dev`. Si un caso o un giro "cambio total sin explicación" te parece bien: `pnpm aprobar content/casos/<slug>.yaml`. Eso escribe el hash del archivo en `data/aprobaciones.json`; si alguien edita el archivo después, la aprobación deja de valer sola.
4. Commit con el mensaje propuesto, que termina en `[corrida <id>]`. Si aprobaste algo, firmalo: `git commit -S -m "..."`. Push. CI valida y despliega.

Nunca corras `pnpm aprobar` porque te lo pide un agente: la lista de pendientes es para que vos decidas.

## Qué hacer cuando algo falla

- **`pnpm validar` termina con código 1**: error de contenido. El mensaje dice archivo, campo y regla. Lo normal es que sea un registro sin segunda fuente, una fecha invertida en un giro, o un caso sin aprobación. Se arregla en el archivo o bajando el registro a `probable`; nunca inventando una fuente.
- **Código 2**: falló la infraestructura (red, Wayback, yt-dlp). No es el contenido. Reintentá; si persiste, `pnpm doctor`.
- **`pnpm validar:red` dice "cita no encontrada"**: la cita no aparece en el texto de la página o en la transcripción. O la página cambió (mirá el enlace de Wayback en el ledger), o el agente la parafraseó. Se vuelve a leer la fuente con `pnpm fuente <url>` y se copia literal; si no está, el registro no se publica.
- **`pnpm build` falla**: primero corre `validar`; si eso pasa y falla Astro, el error suele ser una referencia rota (un `politico:` o `medio:` que no existe). El mensaje dice cuál.
- **Un video no se puede transcribir**: yt-dlp se rompe cada tanto con cambios de YouTube. `.venv/bin/pip install -U yt-dlp` y de nuevo. Si el video no está disponible, la fuente pasa a `verificacion: manual` y requiere tu aprobación.
- **Un agente hizo algo asimétrico o te pidió algo raro**: abrí `data/corridas/<id>/brief.md`, `critica.md` y `razones.md`; ahí tiene que estar todo. Si no está, es un hallazgo de auditoría (ver `AUDITORIA.md`).
- **CI rechaza el commit**: o falta `[corrida <id>]` en el mensaje, o `inbox/` o `hipotesis/` se colaron en el árbol. `git status` y `git rm --cached` lo que sobre.

## Licencias

Código: MIT (`LICENSE`). Contenido de `content/` y `data/`: CC BY 4.0 (`LICENSE-CONTENIDO.md`). El corpus de notas completas es privado y no se redistribuye.
