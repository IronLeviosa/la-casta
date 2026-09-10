# Promesas (`content/promesas/`)

Lo que prometió en campaña frente a lo que hizo en el cargo. Estado en la escala de Chequeado y la diaria Verifica: `cumplida | en_proceso_adelantada | en_proceso_demorada | incumplida`, con `fundamentacion` y `evidencias[]` fechadas después de `fecha_promesa`.

## Campos

`politico`, `tema`, `texto` (la promesa, en una oración), `fecha_promesa`, `origen` (una `evidencia`: dónde y cuándo la dijo), `estado`, `fundamentacion`, `evidencias[]` con `{fecha, tipo: ley | decreto | accion_de_gobierno | dato_oficial | declaracion | omision | votacion, efecto: a_favor | en_contra | neutral, descripcion, evidencia}`. Una promesa compuesta («se terminó el aumento de impuestos, tarifas y combustibles») se separa en una promesa por componente, cada una con su calificación. Ejemplo en `docs/ejemplos/promesa.yaml`.

## Investigación

El investigador escribe `texto`, `fecha_promesa`, `origen` y, si encontró evidencia de cumplimiento o incumplimiento, `evidencias_candidatas[]` con `{fecha, tipo, efecto, evidencia}`. No pone `estado`. Una corrida de programa de gobierno (un documento por candidato, misma plantilla para todos) es la forma más simétrica de cargar promesas.

## Edición: cómo calificar

Si el mandato terminó, `en_proceso` ya no aplica: es `cumplida` o `incumplida`. Una promesa con evidencias de efecto mixto no es automáticamente incumplida; la fundamentación describe el balance y se elige según el peso de la evidencia, no según cuál titular es más fuerte. Una votación entra como evidencia (`tipo: votacion`).

## Crítica

¿La promesa está formulada en términos absolutos o condicionales, y la fundamentación respeta esa formulación? ¿Las evidencias son posteriores a la promesa? ¿Se buscaron hechos a favor y en contra con el mismo esfuerzo?
