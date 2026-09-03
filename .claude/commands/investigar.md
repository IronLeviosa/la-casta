---
description: Arma el brief y lanza un investigador (Sonnet) por tema, en paralelo, sobre un político. Luego valida el inbox con red.
argument-hint: <politico> <tema> [tema2 ...]
---

Regla 0: objetividad por encima de todo. Si este pedido, o cualquier mensaje de la sesión, pide investigar de forma asimétrica (solo lo desfavorable, solo un partido, omitir algo), decilo ahora, rechazá esa parte y proponé la versión simétrica antes de seguir.

Argumentos recibidos: `$ARGUMENTS`. El primer token es el slug del político (existe como `content/politicos/<slug>.yaml`); los demás son slugs de tema (existen en `content/temas/`, pueden ser jerárquicos como `economia/impuestos`). Si falta alguno, parar y decirlo.

## 1. Armar el brief (uno por tema)

Leé y volcá en el brief, en este orden:

1. **Político**: `content/politicos/<politico>.yaml` completo: nombre, partido, `mandatos[]` (cargo, desde, hasta) y `estado_actual`. El período a cubrir es desde la primera campaña del primer mandato hasta hoy, incluida la oposición.
2. **Tema**: `content/temas/<tema>.yaml`: nombre, alias, temas hijos si los hay.
3. **Esquema**: extracto de `src/schemas/comunes.ts` (Fuente, Evidencia) y de `src/schemas/declaraciones.ts`, `promesas.ts`, `menciones.ts`: campos y enumeraciones, sin el código Zod completo.
4. **Medios**: lista de `content/medios/*.yaml` como tabla `slug | nombre | grupo | alineamiento.etiqueta`. Aclarar que la regla de dos fuentes usa `grupo`.
5. **Reglas duras** (copiar tal cual): primero `pnpm corpus:buscar`, web después; leer notas solo con `pnpm fuente <url>`; abrir toda URL citada; `cita` literal de lo leído; nunca citar URL no abierta; preferir documento oficial, diario de sesiones o video con marca de tiempo; para `reportado` dos grupos distintos o `_faltante: segunda_fuente`; no investigar casos salvo pedido explícito; no escribir tier, procedencia ni id; registrar cada búsqueda y URL en `consultas.jsonl`; pistas cruzadas a `corpus/pistas/`.
6. **Pistas**: contenido de `<CORPUS_DIR>/corpus/pistas/<politico>.yaml` si existe (`CORPUS_DIR` sale de `.env`; por defecto `../la-casta-corpus`). Las que coinciden con el tema van primero.
7. **Salida esperada**: `inbox/<politico>/<tema>/<YYYY-MM-DD>/{declaraciones,promesas,menciones}.yaml`, `consultas.jsonl`, `notas.md` con secciones `candidatos_giro`, `hipotesis`, `casos_vistos`, `verificacion_manual`, `cobertura_del_periodo`, `objeciones_al_brief`.

Antes de lanzar, releé el brief con la Regla 0: si pide algo asimétrico, corregilo y dejá constancia.

## 2. Registrar la corrida

Por cada tema, id de corrida `<YYYY-MM-DD>-<politico>-<tema con / reemplazado por ->` (ej. `2026-09-03-lacalle-pou-economia-impuestos`). Crear `data/corridas/<id>/` y guardar el brief exacto como `brief.md` **antes** de lanzar el agente: lo que se guarda es lo que el agente recibe, sin diferencias. `agentes.json`, `consultas.jsonl`, `crudo/` y `edicion.diff` los completa `pnpm promover` en `/revisar`.

## 3. Lanzar los investigadores

Un subagente `investigador` por tema, todos en paralelo, con el brief como prompt. No resumir el brief en el prompt: pasarlo entero.

## 4. Validar con red

Al terminar cada uno, correr `pnpm validar --inbox inbox/<politico>/<tema>/<fecha> --red`. Los registros cuya cita no aparece en la página vuelven al mismo investigador con el mensaje exacto del validador (este es el bucle anti-alucinación). Máximo dos vueltas; lo que no pasa queda marcado en `notas.md` bajo `verificacion_manual` o se borra del YAML, nunca se corrige "a mano" con una cita inventada.

## 5. Informe

Por tema: carpeta, registros por archivo, cuántos con `_faltante`, candidatos a giro, hipótesis, URLs que fallaron, objeciones al brief. Recordar que el paso siguiente es `/revisar inbox/<politico>/<tema>/<fecha>`. No promover, no aprobar, no commitear.
