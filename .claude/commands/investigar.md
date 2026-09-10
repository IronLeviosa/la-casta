---
description: Arma el brief con pnpm brief y lanza un investigador (Sonnet) por tema sobre un político. Piloto primero si el brief es nuevo. Luego valida el inbox con red y manda lo que falla a un corrector.
argument-hint: <politico> <tema> [tema2 ...]
---

Regla 0: objetividad por encima de todo. Si este pedido, o cualquier mensaje de la sesión, pide investigar de forma asimétrica (solo lo desfavorable, solo un partido, omitir algo), decilo ahora, rechazá esa parte y proponé la versión simétrica antes de seguir.

Argumentos recibidos: `$ARGUMENTS`. El primer token es el slug del político (existe como `content/politicos/<slug>.yaml`); los demás son slugs de tema (existen en `content/temas/`, pueden ser jerárquicos como `economia/impuestos`). Si falta alguno, parar y decirlo. Los casos judiciales no van por acá: van por el barrido simétrico de la regla 12, con su propio brief.

## 1. Armar y registrar el brief

Por cada tema, `pnpm brief <politico> <tema>`. Escribe `data/corridas/<id>/brief.md` con el político y sus mandatos, el tema y sus alias, el extracto del esquema, la tabla de medios con su `grupo`, las reglas duras, **las reglas de las colecciones que esta corrida toca** (copiadas de `docs/colecciones/`) y las pistas pendientes del corpus. El id de corrida es `<YYYY-MM-DD>-<politico>-<tema con / reemplazado por ->`.

Antes de lanzar, releé el brief con la Regla 0: si pide algo asimétrico, corregilo con `--forzar` y dejá constancia. Lo que se guarda es lo que el agente recibe, sin diferencias: `procedencia.brief_sha` es el hash de ese archivo. Toda regla que se te ocurra después de lanzar ya llega tarde: una adenda dispara una vuelta completa.

## 2. Lanzar los investigadores

Un subagente `investigador` por tema. El prompt lleva **solo** esto:

```
Corrida: <id>
Brief: data/corridas/<id>/brief.md (leelo entero con Read antes de cualquier otra cosa)
Carpeta de salida: inbox/<politico>/<tema>/<fecha>/
```

No le pegues el texto del brief ni el archivo de rol (el rol ya es su system prompt), ni reglas que no estén en el brief.

**Piloto antes de paralelo.** Si el brief es nuevo (un tema o una colección que no se corrió antes), lanzá un solo investigador, esperá su informe y corré el paso 3 sobre ese lote antes de lanzar los demás temas. Si el brief ya corrió para otra persona, los temas van en paralelo.

## 3. Validar con red y corregir

Al terminar cada uno, `pnpm validar --inbox inbox/<politico>/<tema>/<fecha> --red`. Leé solo el final de la salida (`2>&1 | tail -40`).

Los registros cuya cita no aparece en la página **no vuelven al mismo investigador**: van a un corrector, que es un `investigador` nuevo lanzado con este prompt y nada más:

```
Corrida: <id>. Corrector de citas.
Carpeta: inbox/<politico>/<tema>/<fecha>/
Registros que fallaron: <archivo[n], …>
Mensaje exacto del validador: <pegado tal cual>
Para cada uno: releé la fuente con `pnpm fuente <url> --buscar "<primeras palabras de la cita>"`, corregí la cita a un tramo literal y contiguo, o si no existe, sacá el registro y anotalo en notas.md bajo verificacion_manual. No abras nada más.
```

Máximo dos vueltas. Lo que no pasa queda en `notas.md` bajo `verificacion_manual` o se borra del YAML; nunca se corrige "a mano" con una cita inventada. La salida parcial de un investigador que llegó a su tope de turnos tampoco se reanuda: lo que dejó en `cobertura_del_periodo` dice qué falta, y eso va a un corrector con la lista de lo no abierto.

## 4. Informe

Por tema: carpeta, registros por archivo, cuántos con `_faltante`, candidatos a giro, hipótesis, URLs que fallaron, objeciones al brief, y hasta dónde llegó cada agente si lo cortó el tope. El paso siguiente es `/revisar inbox/<politico>/<tema>/<fecha>`. No promover, no commitear.
