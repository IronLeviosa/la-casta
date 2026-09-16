# Plan: fechas de lo dicho — precisión declarada, cota por fallecimiento y referencias que siguen al id

Estado: decidido el 2026-09-16, a partir de la corrida de Batlle (`2026-09-16-batlle-economia-impuestos`).
Lo implementa Sonnet en el taller; Fable revisa y commitea. Entra a `main` por merge (regla 17).

## Los tres problemas, con el caso

1. **Una fecha imposible pasó el validador.** El crítico objetó que la última entrevista de Batlle (El
   Observador) estaba fechada el 2016-09-21 sin que esa fecha figurara en la nota. El editor la cambió al
   2016-10-25, que es la fecha de publicación de la nota: Batlle murió el 2016-10-24 (su ficha lo dice,
   `estado_actual.salida: {tipo: fallecimiento, fecha: 2016-10-24}`). La página iba a decir que declaró
   algo al día siguiente de morir. `pnpm validar --inbox` no dijo nada: la ficha tiene el dato y nadie lo
   compara.
2. **No hay regla para fechar lo que no tiene fecha exacta.** `docs/colecciones/declaraciones.md` no dice
   cómo se fecha una declaración cuya fecha de enunciación no está documentada. En Batlle aparecieron dos
   casos: la entrevista póstuma (la nota no dice cuándo se hizo; el corrector puso el 2016-10-24 como cota
   y lo aclaró en `notas_internas`, que la página no lee, así que el lector va a leer «24 de octubre de
   2016» como fecha cierta) y una entrevista de «Las 40» de 2006 «sin fecha exacta dentro del año». Con
   archivos viejos de radio y TV va a ser lo normal, no la excepción.
3. **Corregir una fecha rompe las referencias en silencio.** El id es `<politico>/<fecha>-<slug>`.
   Cuando el editor corrige `fecha` (lo que el crítico le pide, y lo hace con `pnpm lote fijar`), cambia
   el id del registro y todo lo que apuntaba a él dentro del lote (chequeos, giros) queda roto. El
   validador lo detecta después, y el editor sale a buscar quién apuntaba. En Batlle: cuatro referencias
   rotas en chequeos por una sola fecha. Peor: sin `_slug` explícito, el slug sale del `resumen`
   (`derivarId`, `scripts/lib/inbox.ts`), y el editor reescribe resúmenes todo el tiempo.

## Decisiones

### D1. `fecha_precision`, no fechas parciales en `fecha`

Se agrega un campo opcional `fecha_precision: dia | mes | anio | antes_de` (omitido = `dia`) en
declaraciones, menciones y chequeos (junto a `fecha`) y en promesas (junto a `fecha_promesa`). `fecha`
sigue siendo un día ISO completo: el id, el orden en las listas y las líneas de tiempo, la comparación
de los giros, `claimreview.json` y `simetria.ts` lo leen como día y no cambian.

Por qué no fechas parciales (`2006`, `2006-03`) en `fecha`, que es lo que hacen los mandatos con
`FechaParcial` y `fechaParcialLarga`: el id, `fechaDeIdDeclaracion`, `patronId` de cada colección, el
orden lexicográfico y la comparación «antes < después» del giro asumen un día completo, y tocarlos todos
por un campo de precisión es más riesgo que valor. La regla de fondo de `fechaParcialLarga` («escribir
"1 de enero de 1990" cuando la fuente solo dice "1990" inventa una precisión que nadie documentó») se
respeta igual, en el formateador.

Convención mecánica, la hace cumplir el validador (error, no aviso):

| `fecha_precision` | `fecha` tiene que ser | La página muestra |
|---|---|---|
| `dia` (omitido) | el día | «24 de octubre de 2016» |
| `mes` | el día 1 del mes (`AAAA-MM-01`) | «en octubre de 2016» |
| `anio` | el 1 de enero (`AAAA-01-01`) | «en 2006» |
| `antes_de` | una cota documentada: la fecha de fallecimiento de la ficha (`estado_actual.salida.fecha` con `tipo: fallecimiento`) o la `fecha` de alguna fuente de la `evidencia` del registro | «antes del 24 de octubre de 2016» |

`antes_de` es para el caso póstumo y para cualquier fuente que se publicó sin decir cuándo se dijo lo
que cita: la fecha que se documenta es la cota, y el lector la lee como cota. La fecha de publicación de
la nota ya está en `evidencia.fuentes[].fecha` y la página la muestra junto a la fuente; nunca se usa como
si fuera la fecha en que la persona habló.

Para Batlle, con la cota del 2016-10-24 que ya lleva el lote, el id no cambia: entra por corrección
agregando `fecha_precision: antes_de` a los registros de esa entrevista (declaraciones, menciones y
chequeos), cuando el campo exista en `main`.

### D2. Regla de validación: nada dicho después de la muerte

En `scripts/validadores/referencias.ts` (ya resuelve `politico` contra la ficha con `contenido.obtener`),
para declaraciones, menciones, chequeos y promesas (`fecha_promesa`): si la ficha del político tiene
`estado_actual.salida.tipo === 'fallecimiento'` y la fecha del registro es posterior a
`estado_actual.salida.fecha`, error. El mensaje dice la fecha de fallecimiento y la salida: «si la fecha
de enunciación no está documentada, `fecha` es la cota y `fecha_precision: antes_de`». Vale para cualquier
persona con ficha, con o sin `fecha_precision`. No alcanza a `evidencia.fuentes[].fecha` (una nota puede
publicarse después), ni a `seguimiento.fecha`, ni a las etapas de los casos.

Y una segunda comparación en el mismo lugar: un chequeo lleva la misma `fecha` y la misma
`fecha_precision` que la declaración que declara en `declaracion` (cuando esa declaración está en
`content/` o en el lote). Un chequeo es un dato dentro de una cita: no puede tener otra fecha que la cita.
Error. En Batlle, tres registros de una sola conversación quedaron con dos fechas.

### D3. Los giros comparan intervalos, no días

El chequeo «antes < después» de los giros (`referencias.ts`, paso 6) pasa a comparar intervalos. Helper
`intervaloDeFecha(fecha, precision): { inicio: string; fin: string }` en `src/schemas/base.ts`, al lado de
`completarFecha`, que se reutiliza:

| precisión | inicio | fin |
|---|---|---|
| `dia` | fecha | fecha |
| `mes` | fecha | último día del mes (`completarFecha(fecha.slice(0, 7), 'fin')`) |
| `anio` | fecha | `AAAA-12-31` |
| `antes_de` | `0000-01-01` | fecha |

Un giro es válido si `fin(antes) < inicio(despues)`. Si no, error «orden no documentado»: una declaración
fechada «en 2006» no puede ser el «antes» de otra de mayo de 2006, y una `antes_de` nunca puede ser el
«después» (no se sabe si fue antes o después de la otra). Es lo que el lector entendería si viera las dos
fechas con su precisión.

### D4. `pnpm lote fijar` sigue al id

`fijar` (`scripts/lote.ts`) calcula el id del registro antes y después del cambio y, si cambió, reescribe
dentro del lote toda referencia que apuntaba al id viejo, y lo dice en su salida. Cubre `fecha`,
`politico`, `_slug` y también `resumen`/`cita`/`afirmacion`/`titulo` cuando no hay `_slug` (por eso se
compara el id derivado y no una lista de campos).

- Ids antes y después: `cargarInbox(RAIZ, dirInbox)` (`scripts/lib/inbox.ts`) sobre el lote entero, antes
  de escribir y después; el registro se ubica por colección y posición (`archivo` termina en `#n`).
  Calcular sobre el lote entero y no con `derivarId` suelto, para respetar los sufijos `-2`, `-3` por
  colisión.
- Qué campos se reescriben: los del mapa `REFERENCIAS` de `scripts/validadores/referencias.ts` cuyo
  destino sea la colección del registro cambiado (`declaracion` de chequeos, `declaracion_antes` y
  `declaracion_despues` de giros, `politicos[]` de eventos, etc.). Exportar el mapa (hoy es `const` local).
  Se reescribe solo la igualdad exacta con el id viejo, en todos los `<coleccion>.yaml` del lote, con el
  mismo `stringifyYaml(lista, { lineWidth: 100 })` que ya usa `fijar`.
- Salida del CLI: una línea más, `id: <viejo> → <nuevo> · referencias actualizadas: chequeos.yaml (4),
  giros.yaml (1)`; si el id cambió y nadie lo referenciaba, `id: <viejo> → <nuevo> · sin referencias en el
  lote`. Si el id no cambió, nada nuevo.
- `ResultadoFijar` gana `idAntes`, `idDespues` y `referencias: Array<{ archivo, cantidad }>`.
- No toca `notas.md` (prosa) ni `content/` (los ids publicados no se renombran; eso va por corrección).

### D5. Cómo se muestra

`fechaConPrecision(fecha, precision)` en `src/lib/formato.ts`, al lado de `fechaLarga`, con la tabla de
D1. Se usa en todo lugar donde se muestra la fecha de una declaración, mención, chequeo o promesa:

- `src/pages/politicos/[slug]/declaraciones/[id].astro` (título/descripción y donde muestre `d.fecha`),
- `src/components/GiroCard.astro` (`Antes ·`, `Después ·`),
- `src/components/ChequeoCard.astro` («Dicho el …» pasa a «Dicho …» cuando la precisión no es `dia`, para
  que no quede «Dicho el en 2006»),
- `src/components/MencionesDe.astro`, `src/components/MismoTema.astro`, `src/components/Historial.astro`,
  `src/components/Cita.astro` (si la fecha que reciben es la del registro y no la de la fuente: revisar
  qué le pasa cada llamador; la fecha de una fuente sigue con `fechaLarga`),
- la ficha del político (`src/pages/politicos/[slug]/index.astro`) donde lista declaraciones o promesas
  con fecha.

`<time datetime>` lleva la fecha recortada a su precisión (`2006`, `2006-10`), que HTML admite; con
`antes_de` lleva el día completo. En `src/lib/claimreview.ts`, `datePublished` también se recorta a la
precisión (schema.org acepta fechas ISO parciales); con `antes_de` va el día de la cota.

Las líneas de tiempo a escala siguen ubicando el registro en `fecha` (inicio del período o cota); el
rótulo es el de `fechaConPrecision`. No se inventa una barra de rango.

### D6. Documentación

- `docs/colecciones/declaraciones.md`, un punto nuevo **«Cómo se fecha»**: `fecha` es cuándo lo dijo, no
  cuándo lo publicó el medio; si la fuente solo da mes o año, `fecha_precision: mes | anio` con la
  convención de D1; si no dice cuándo se dijo (entrevista póstuma, archivo sin fecha), `fecha` es la cota
  documentada más temprana que se tenga (la muerte, la publicación) y `fecha_precision: antes_de`; la fecha
  de publicación va en `evidencia.fuentes[].fecha`. Nunca se publica una fecha más precisa que la fuente:
  el lector no distingue una fecha cierta de una estimada, y una persona muerta no puede desmentirla.
- `docs/colecciones/chequeos.md`, `menciones.md`, `promesas.md`: una línea cada uno, «`fecha` (en
  promesas, `fecha_promesa`) y `fecha_precision` como en `declaraciones.md`; el chequeo lleva la misma
  fecha y precisión que su declaración».
- `docs/ejemplos/declaracion.yaml`: no cambia (la precisión por omisión es `dia`); si hay un ejemplo de
  chequeo o mención cuyo caso real sea de mes o año, se puede usar, pero no inventar uno.
- `.claude/agents/editor.md`, en el punto 2 (donde explica `fijar`): «`fijar` sobre `fecha`, `politico`,
  `_slug` o el texto del que sale el slug cambia el id del registro y reescribe sola las referencias del
  lote; no las corrijas a mano, y mirá la línea `id:` de su salida».
- `.claude/agents/investigador.md`, donde diga cómo se fecha una declaración (si no lo dice, en la lista
  de campos): fecha de enunciación, con `fecha_precision` cuando la fuente no da el día.

## Archivos

| Archivo | Cambio |
|---|---|
| `src/schemas/base.ts` | `FechaPrecision` (enum zod, descripción con la tabla de D1), `intervaloDeFecha` |
| `src/schemas/declaracion.ts`, `mencion.ts`, `chequeo.ts`, `promesa.ts` | `fecha_precision: FechaPrecision.optional()` |
| `scripts/validadores/referencias.ts` | D2 (muerte, chequeo = declaración), convención de D1 (`mes` → `-01`, `anio` → `-01-01`, `antes_de` → cota documentada), D3 en el paso 6; exportar `REFERENCIAS` |
| `scripts/lote.ts` | D4 |
| `src/lib/formato.ts` | `fechaConPrecision`, `datetimeConPrecision` (para `<time>` y claimreview) |
| `src/lib/claimreview.ts` | `datePublished` recortado |
| Componentes y páginas de D5 | usar `fechaConPrecision` donde la fecha es la del registro |
| `docs/colecciones/*.md`, `.claude/agents/editor.md`, `investigador.md` | D6 |
| `tests/validar.test.ts` (o uno nuevo `tests/fechas-precision.test.ts`) | D1 convención, D2 muerte (error con ficha `fallecido`, nada con ficha viva, nada sobre `fuentes[].fecha` posterior), D2 chequeo≠declaración, D3 los cuatro casos de la tabla y el «orden no documentado» |
| `tests/lote.test.ts` | D4: `fijar fecha` en una declaración referenciada por un chequeo y un giro reescribe las dos; `fijar` de un campo que no toca el id no reescribe nada; sin `_slug`, `fijar resumen` también sigue al id |
| `tests/formato-breve.test.ts` (o donde estén los de `formato.ts`) | `fechaConPrecision` los cuatro casos, `datetimeConPrecision` |

## Entrega

Sin commitear (commitea Fable). `pnpm test`, `pnpm validar` (0 errores sobre `content/`: nada publicado
cambia de significado, la precisión por omisión es `dia`) y `pnpm build` en verde. El informe: archivos
tocados, cantidad de tests, y la salida de `pnpm lote fijar` sobre un lote de prueba en el scratchpad
donde una declaración cambia de fecha con un chequeo que la referencia.

## Qué no hacer

- No cambiar el tipo de `fecha` ni el patrón de ningún id. No renombrar nada publicado.
- No tocar `content/`: Batlle entra por corrección cuando el campo esté en `main`.
- No poner `fecha_precision` en `giros` (no tienen fecha propia), ni en `seguimiento.fecha`, ni en
  `evidencia.fuentes[].fecha`.
- No agregar excepciones a la regla de la muerte: con `antes_de` la fecha es la cota y ya cumple.
- No agregar atribución a Claude ni a Anthropic en ningún archivo.
