# Brief · corrida 2026-09-07-brasil-datasets-verificables

Regla 0: objetividad por encima de todo. Esta corrida es de resolución: el chequeo `chequeos/lacalle-pou/2022-03-27-combustibles-mas-baratos-brasil` está en `probable` porque ocho de sus fuentes de `dato_real` (planillas xlsx de URSEA y de la ANP, csv de ANCAP en catalogodatos, un zip del MIEM, la API SGS 3695 del Banco Central do Brasil, el servicio de cotizaciones del BCU y la API Olinda del BCB) llevan `verificacion: manual`, que por regla del sitio exige la firma del mantenedor. Desde hoy `pnpm fuente` lee planillas (xlsx, csv) y respuestas JSON como texto y las guarda en el corpus, así que esas citas pueden verificarse solas como cualquier otra.

## Encargo

1. Leé con `Read` el registro publicado y anotá cada fuente de `dato_real.fuentes` con `verificacion: manual`: URL, qué dato respalda y qué dice hoy su `cita`.
2. Por cada una, corré `pnpm fuente <url>`. Si la lee (planilla o JSON), buscá en el texto que imprime la fila o el valor que respalda el dato y reemplazá la `cita` por ese tramo literal y contiguo (una fila completa tal como la imprime, o el fragmento de JSON con la fecha y el valor). Quitá `verificacion: manual` de esa fuente y actualizá `retrieved_at`. Si un zip no se puede leer o una API cambió de forma, dejá la fuente como está y anotalo en `notas.md` bajo `## no_resueltas` con el error.
3. No cambies ningún número del `dato_real`, ni la calificación, ni el análisis, ni los gráficos. Si al releer una planilla encontrás que una cifra del registro no coincide con la fila, no la corrijas: anotalo en `notas.md` bajo `## discrepancias_encontradas` con las dos cifras, para el editor.
4. Dejá el registro completo (todas sus fuentes, resueltas y no resueltas) en `inbox/resoluciones/brasil-datasets-2026-09-07/chequeos.yaml` con `_id: lacalle-pou/2022-03-27-combustibles-mas-baratos-brasil` y `_investigacion: {agente: resolvedor, modelo: <el modelo con el que corrés>}`, más `consultas.jsonl` y `notas.md`.
5. Validá con `pnpm validar --inbox inbox/resoluciones/brasil-datasets-2026-09-07 --red`: el objetivo es que las citas de las planillas y API den «exacta». Reportá cuántas quedaron exactas, cuántas siguen en manual y por qué.

## Reglas duras
- Toda URL se lee con `pnpm fuente`; nunca WebFetch para una fuente que se cita.
- `cita` literal y contigua, copiada del texto que imprimió `pnpm fuente` en esta sesión.
- No toques `content/`. No escribas tier ni procedencia.

## Salida esperada
Carpeta `inbox/resoluciones/brasil-datasets-2026-09-07/`. Informe: por cada fuente, resuelta o no y por qué; el modelo con el que corriste; objeciones al brief.
