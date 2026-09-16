# Plan: `pnpm validar` reporta todas las etapas, no solo la primera que falla

Estado: decidido el 2026-09-16 (corrida de Batlle). Lo implementa Sonnet en el taller, después de
`docs/plan-fechas.md`; Fable revisa y commitea.

## El problema

`scripts/validar.ts` corta en la primera etapa con errores. En Batlle, `validar --inbox --breve` dio
`referencias: 5 error(es)` y no imprimió `tiers` ni `presentacion`. Un corrector arregló las cinco
referencias; recién ahí aparecieron 11 errores de tiers (chequeos `reportado` con un solo grupo y tier
`publicado`); segundo corrector; recién ahí, 7 de presentación; tercer corrector. Los tres problemas
existían desde el principio, y con la lista completa alcanzaba un corrector. Cada capa cuesta un agente
entero y relanza la validación con red.

## Decisión

Las etapas son independientes una vez que el contenido cargó: `referencias`, `tiers`, `presentacion`,
`duplicados`, `fuentes` y `citas` reciben el mismo `Contenido` y ninguna muta lo que lee la siguiente.
Entonces:

1. **`esquema` sigue cortando.** Un registro que no pasó su Zod no existe para las demás etapas, y toda
   referencia a él se vería rota: reportar eso sería ruido, no información.
2. **Con `esquema` ok, corren todas las etapas offline (2 a 5) aunque alguna falle**, cada una con sus
   errores. Sin filtrar «errores derivados» por registro: la única superposición conocida es un `medio`
   que no existe (lo dice `referencias`) y que en `tiers` aparece como «ninguno resuelto» en el mismo
   registro; dos líneas para el mismo arreglo cuestan menos que esconder un error genuino de tiers de un
   registro que además tenía una referencia rota, que es exactamente lo que volvería a crear capas.
3. **Etapas de red (`--red`).** Con `--inbox`, corren aunque las offline hayan fallado: el corrector
   recibe la lista entera en una pasada, y `fuentes` (ledger) y `citas` (caché) no repiten lo ya
   verificado. Sin `--inbox` (CI sobre `content/`), si alguna etapa offline falló, `fuentes` y `citas`
   quedan `omitida (errores en etapas anteriores)`: CI va a fallar igual y no hay por qué gastar la
   cuota de Wayback en un commit que se va a corregir.
4. **Código de salida** igual que hoy: 1 si alguna etapa tuvo errores, 2 por infraestructura
   (`ErrorInfraestructura` en fuentes o citas), 0 si nada falló. `terminar` se llama una sola vez al
   final, salvo por `esquema` y por infraestructura.
5. **Salida.** `--breve` y la salida normal no cambian de formato: ahora imprimen una línea por etapa,
   siempre. `--json` igual: `etapas[]` trae todas.

## Archivos

| Archivo | Cambio |
|---|---|
| `scripts/validar.ts` | Quitar los `if (res.errores.length) return terminar(1, comun)` de las etapas 2 a 7; en las de red, la condición del punto 3 (`modoInbox` o ninguna etapa anterior con errores). Comentario de cabecera: reemplazar «corta en la primera que falla» por la regla de arriba, con el motivo (Batlle, 2026-09-16, tres correctores por tres capas). `razonOmitida` gana el caso «errores en etapas anteriores». |
| `tests/validar.test.ts` | El test «corta en la primera etapa que falla» pasa a «esquema corta; con esquema ok, reporta todas las etapas»: un lote con una referencia rota, un tier inválido y un defecto de presentación a la vez da las tres etapas con sus errores en una sola corrida, y `codigo` 1. Otro test: sin `--inbox`, con errores offline y `--red`, `verificarUrl` inyectado no se llama y `fuentes`/`citas` quedan omitidas con ese detalle; con `--inbox`, sí se llama. |
| `tests/validar-breve.test.ts` | Si algún test asume que después de una etapa fallida no hay más líneas, ajustarlo; el comentario sobre `esquema` sigue valiendo. |
| `.claude/commands/revisar.md` e `investigar.md` | Donde dicen que el corrector recibe «el mensaje del validador»: el reporte trae todas las etapas, así que un solo corrector por pasada de validación, con la lista completa; no se lanza uno por etapa. |
| `CLAUDE.md`, fila de `pnpm validar` | Agregar «reporta todas las etapas en una pasada». |

## Entrega

Sin commitear. `pnpm test`, `pnpm validar` (0 errores) y `pnpm build` en verde. Informe de menos de 30
líneas: archivos tocados, tests antes y después, y la salida de `pnpm validar --inbox <lote de prueba>
--breve` sobre un lote del scratchpad con errores de dos etapas distintas, mostrando las dos líneas.

## Qué no hacer

- No cambiar el contenido de ninguna etapa ni los mensajes de los validadores.
- No filtrar errores por registro entre etapas.
- No cambiar el corte de `esquema`.
- Nada de atribución a Claude ni a Anthropic.
