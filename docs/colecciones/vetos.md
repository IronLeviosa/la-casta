# Vetos (`content/vetos/`)

El veto es la facultad por la que el Poder Ejecutivo observa, solo con su firma, un proyecto que las dos cámaras ya aprobaron. No es la última palabra: la Asamblea General puede levantar las observaciones con una mayoría especial. El veto y lo que el Parlamento hizo después son un solo hecho; un veto sin desenlace documentado no llega a `publicado`, y el desenlace se busca con el mismo rigor que el veto.

## Campos

`politico`, `tema` (el asunto que trata el proyecto), `titulo` (cómo se conoce el proyecto, en llano), `numero_ley` si la hubo, `fecha` (la de las observaciones), `alcance: total | parcial` y `articulos_observados[]` si es parcial, `fundamento` (qué argumentó el Ejecutivo, una o dos oraciones sin adjetivos), `resultado: {estado: observaciones_aceptadas | veto_levantado | pendiente | sin_datos, fecha, detalle, fuentes[]}`, `analisis`, `evidencia`. Ejemplo en `docs/ejemplos/veto.yaml`.

## Investigación

- Una corrida de vetos cubre **todos** los vetos de un mandato y ninguna otra cosa. Si en un mandato no hubo vetos, se dice explícitamente en `notas.md` bajo `cobertura_del_periodo`: un mandato sin vetos no se lee como un mandato sin investigar.
- Antes del primero, se verifica en el texto de la Constitución el procedimiento vigente (plazo del Ejecutivo, mayoría de la Asamblea General, qué pasa si no se pronuncia), leído con `pnpm fuente` desde IMPO, y se anota en `notas.md` bajo `procedimiento_constitucional` con los artículos y su cita literal. No se escribe de memoria.
- Fuentes, en orden: IMPO y el Diario Oficial (el mensaje de observaciones se publica), la ficha del asunto y el diario de sesiones en el Parlamento, Presidencia. Todas son `documento_oficial` o `diario_de_sesiones` y habilitan `textual`. La prensa sirve para encontrar el veto y para el contexto, y es `reportado`.
- Lo que el presidente dijo públicamente sobre el veto va como declaración en el mismo lote.

## Crítica

¿Está el desenlace, con su fecha y su fuente? ¿El `fundamento` reproduce lo que dijo el Ejecutivo o lo que dijo la prensa sobre lo que dijo? ¿La `nota` de 180 y la ficha del Parlamento dicen lo mismo sobre el alcance? (ver `discrepancias.md`).
