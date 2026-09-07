# Brief · corrida 2026-09-07-audio-desde-el-contexto

Corrección de tipo `presentacion` sobre las dos declaraciones publicadas que tienen audio con `contexto`:

- `declaraciones/lacalle-pou/2019-09-04-liberar-importacion-combustibles-luc-90-dias` (coloquio de En Perspectiva, dos citas del mismo audio)
- `declaraciones/lacalle-pou/2022-03-27-mecanismo-transparencia-no-paga-sobrecosto` (conferencia de prensa, audio de Presidencia)

El reproductor arrancaba en el segundo donde empieza la cita, porque así estaba definido `marca_tiempo`, y el lector se perdía lo que la página le muestra como contexto justo arriba. Un lector lo señaló: el audio de 2019 tenía que arrancar un poco antes de «que todo el Uruguay haya tenido que pagar…». Se agrega `marca_tiempo_contexto` a cada fuente de audio, medido sobre la transcripción del corpus (segmentos con marca de tiempo de Whisper), unos segundos antes del primer segmento del contexto o de la pregunta. Nada más cambia. El registro público que lo explica es `content/correcciones/2026-09-07-audio-desde-el-contexto.yaml`.

Lo hace el orquestador de la sesión con el rol de editor (Fable): es una medición sobre la transcripción, sin criterio editorial.
