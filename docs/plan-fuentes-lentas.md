# Plan: una fuente viva pero lenta pasa la validación con red, y el inbox se archiva antes de citarse

Estado: decidido el 2026-09-16 (corrida de Batlle). Lo implementa Sonnet en el taller, después de
`docs/plan-fechas.md` y `docs/plan-validar-completo.md`; Fable revisa y commitea.

## El caso

`validar --inbox --red` rechazó `https://www.impo.com.uy/bases/leyes/17296-2001` (Ley 17.296, el
presupuesto de 2001, una página enorme en IMPO): «Fuente no responde (HTTP 0, This operation was
aborted) y no tiene copia en Wayback». La fuente está viva: dos `curl` seguidos dieron HTTP 200 en 31 y
29 segundos. `crearVerificadorReal` (`scripts/validadores/fuentes.ts`) usa 15 segundos, y el reintento
de `fetchConTimeout` repite el mismo timeout, así que la aborta siempre.

Y el círculo: la validación exige URL viva o copia en Wayback; la copia la pide `pnpm archivar`, que corre
después de `promover` y solo mira `content/`; `promover` no corre hasta que la validación pase. `pnpm
fuente` sí pide Save Page Now al leer la nota (`scripts/corpus/fuente.ts`, 40 segundos de timeout, «no es
fatal» si falla), y para esta página seguramente falló por lo mismo: Wayback tiene que esperar los 30
segundos del origen. El `archived_url` que `pnpm fuente` sí consigue queda en la nota del corpus, no en
el ledger, así que el validador tampoco lo ve salvo que el investigador lo copie a `archived_url` de la
fuente.

Las dos salidas que sugiere el mensaje son malas para este caso: bajar el tier diría que falta una fuente
que no falta, y `verificacion: manual` está prohibido para documentos que `pnpm fuente` puede leer. Las
leyes grandes de IMPO (presupuestos, rendiciones de cuentas) son las fuentes primarias que más queremos
y van a caer todas en esto.

## Decisiones

### D1. Un abort no es un 404: un reintento largo antes de dar HTTP 0

En `crearVerificadorReal`, cuando los intentos normales terminan en HTTP 0 con error de timeout/abort
(no con `ENOTFOUND`, `ECONNREFUSED` ni otro error que sí dice que no hay servidor), un último `GET` con
`timeoutMs` de 60 segundos y `reintentos: 0`. Si responde, ese es el estado. Constante exportada
`TIMEOUT_LARGO_MS = 60_000` con el motivo en el comentario (IMPO, Ley 17.296, 31 s). Solo para hosts que
no son Wayback (los de Wayback ya tienen su cupo y sus reintentos). El costo cae solo sobre las URL que
ya fallaron dos veces; con concurrencia 4 no cambia el tiempo total de una pasada normal.

### D2. `pnpm archivar --inbox <dir>` y `revisar despues` lo corre antes de la validación con red

- `archivarTodo` gana `inboxDir?: string`: con él, las URL salen de `cargarInbox(rootDir, inboxDir)` en
  vez de `cargarContenido(rootDir)` (mismo `recorrerFuentes`). Todo lo demás igual: el ledger es el
  mismo `data/fuentes-ledger.json`, y `promover` ya lo deja en `content/` con las mismas URL.
- Antes de pedir Save Page Now, `archivarTodo` mira si la nota del corpus ya trae `archived_url` (lo
  consiguió `pnpm fuente` al leerla; `CORPUS_DIR`, nota por `idDeUrl(url)`, misma lectura que hace la
  etapa `citas`). Si lo trae, va al ledger y no se pide de nuevo. Así el modo `--inbox` casi no pide
  nada: solo las URL cuyo archivo falló al leerlas, que son justamente las lentas.
- El timeout de Save Page Now en `archivar` (`scripts/lib/wayback.ts`, 40 s) pasa a 90 s por parámetro
  desde `archivarTodo`: Wayback espera al origen y una página de 30 segundos no entra en 40. `pnpm
  fuente` sigue con su 40 (no puede bloquear a un agente 90 segundos por nota); si falla ahí, lo agarra
  `archivar --inbox`.
- `scripts/revisar.ts`, `despues`: paso nuevo **a2**, `archivar --inbox <dir>` (con `--limite` sin
  tope, respetando `--sin-archivar`), antes de `validar --inbox --red`. El paso **d** (`archivar` sobre
  `content/` después de promover) se queda: cubre lo que a2 no consiguió y las fuentes que el editor
  agregó después. Actualizar el comentario de cabecera de `revisar.ts` y `.claude/commands/revisar.md`
  (§4): «archiva las fuentes del lote antes de validarlas con red: una fuente se archiva antes de que el
  sitio la cite, no después».
- Ayuda de `pnpm archivar` y fila de `CLAUDE.md`: «cada URL citada en `content/` o, con `--inbox <dir>`,
  en ese lote».

### D3. El mensaje del validador deja de sugerir `verificacion: manual`

En `scripts/validadores/fuentes.ts`, el error «Fuente no responde … y no tiene copia en Wayback» pasa a
decir: «Corré `pnpm archivar --inbox <dir>` (o `pnpm archivar` en content/); si sigue sin responder y
sin copia, el registro no puede publicarse con ese enlace y queda en `probable` hasta que el resolvedor
consiga copia o enlace estable». Sin «marcá verificacion: manual»: contradice CLAUDE.md para todo
documento que `pnpm fuente` puede leer.

### D4. Un 429 de la Availability API no es «sin copia»

Segundo episodio del mismo día: con el índice de diarios ya terminado y nada de esta máquina pegándole a
archive.org, `https://archive.org/wayback/available?url=…` seguía devolviendo 429 a esta IP (medido a
las 15:10 con un solo pedido). Hoy `snapshotDisponible` (`scripts/lib/wayback.ts`) devuelve `null` tanto
si no hay copia como si Wayback rebotó el pedido, y la etapa `fuentes` lee ese `null` como «no tiene
copia»: sumado a un HTTP 0 del origen, da «fuente caída» para una fuente viva mientras dure el límite.
El validador ya distingue el 429 de Wayback para las citas que viven en `web.archive.org`; falta hacerlo
para la consulta de disponibilidad.

- `snapshotDisponible` pasa a devolver `{ url: string | null; estado: 'con_copia' | 'sin_copia' |
  'desconocido' }` (o una función nueva al lado, si cambiar la firma toca demasiado): `desconocido` ante
  429, 5xx, timeout o excepción; `sin_copia` solo con una respuesta 200 sin snapshot.
- En la etapa `fuentes`: HTTP 0 del origen (después del reintento largo de D1) con disponibilidad
  `desconocido` no es error ni caída: es `noComprobada`, con aviso «no se pudo comprobar hoy: el origen
  no respondió a tiempo y Wayback limitó la consulta (429); reintentá en unos minutos», también sin
  entrada previa en el ledger y también con `--inbox`. La cita de ese registro igual se cotejó contra el
  texto del corpus en la etapa `citas`, que es la evidencia de que la URL existió y decía eso; lo que
  queda sin comprobar hoy es el enlace para el lector, y la revalidación semanal (`fuentes.yml`) lo
  vuelve a mirar. Con `sin_copia` (200 sin snapshot) se mantiene el error de hoy.
- `pnpm archivar`: ante 429 o 520 de Save Page Now, para la corrida entera con un mensaje claro («Wayback
  está limitando esta IP; reintentá más tarde») en vez de seguir pidiendo una URL por vez con el mismo
  resultado: con límite por IP, insistir lo alarga.

### Qué no se hace

- Sin lista de timeouts por dominio (propuesta 3 de Opus): D1 la cubre sin mantenimiento.
- Sin tocar la regla «viva o archivada» de la etapa `fuentes`, ni el tratamiento de 404/429 de Wayback
  ni el «dos fallos con un día de distancia» del origen.

## Archivos

| Archivo | Cambio |
|---|---|
| `scripts/validadores/fuentes.ts` | D1 en `crearVerificadorReal`; D3 en el mensaje; D4: HTTP 0 + disponibilidad `desconocido` = `noComprobada` con aviso |
| `scripts/archivar.ts` | `inboxDir`, consulta al corpus antes de Save Page Now, timeout 90 s, ayuda y CLI `--inbox <dir>`; D4: corta la corrida ante 429/520 de Save Page Now |
| `scripts/lib/wayback.ts` | D4: `snapshotDisponible` distingue `sin_copia` de `desconocido` (429, 5xx, timeout); `archivar` ya acepta `timeoutMs` |
| `scripts/revisar.ts` | paso a2 y cabecera |
| `.claude/commands/revisar.md` §4, `CLAUDE.md` fila de `pnpm archivar` | D2 |
| `tests/fuentes-validador.test.ts` (o donde se pruebe `crearVerificadorReal`; si no se prueba, un test nuevo con `fetch` inyectado) | D1: un abort en HEAD y GET y un 200 en el GET largo dan HTTP 200; un `ECONNREFUSED` no dispara el reintento largo; un host de Wayback tampoco |
| `tests/archivar.test.ts` (o el existente) | D2: con `inboxDir`, las URL salen del lote; una URL con `archived_url` en el corpus no se pide y queda en el ledger; `pedir` recibe el timeout largo |
| `tests/revisar*.test.ts` | el paso a2 corre antes de la validación con red y se salta con `--sin-archivar` |

## Entrega

Sin commitear. `pnpm test`, `pnpm validar`, `pnpm build` en verde. Informe de menos de 30 líneas:
archivos, tests antes y después, y la salida de `pnpm archivar --inbox <lote de prueba> --limite 0`
(que liste las pendientes sin pedir nada).

## Qué no hacer

- No pedir Save Page Now dentro del validador: el validador lee y anota; archivar es de `archivar`.
- No bajar el timeout de nada ni cambiar `ESPERA_MS` (3 s entre pedidos: el límite por IP es real).
- Nada de atribución a Claude ni a Anthropic.
