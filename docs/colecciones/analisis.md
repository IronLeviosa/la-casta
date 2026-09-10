# Análisis de terceros (`content/analisis/`)

Un análisis con cifras hecho por un centro de estudios, una consultora, un sindicato, una cámara o un medio sobre una empresa pública o un político (un cálculo de sobreprecio, una comparación de tarifas, un ranking). No se copia ni se discute: se registra quién lo hizo, dónde y cuándo se publicó, qué sostiene, y cada dato concreto se coteja contra el documento oficial con las cuatro calificaciones del Veracímetro y su misma regla dura. Tiene página propia (`/analisis/<sujeto>/<fecha>-<slug>/`); en la ficha de la empresa ocupa una sola fila que lleva a ella, y las `comparaciones[]` sueltas que salgan de la misma nota dejan de mostrarse.

## Campos

`titulo` (qué analiza, de quién y según quién), `empresa` o `politico`, `autor`, `autor_es` (qué es el autor y qué vínculos documentados tiene con un partido o un gobierno, como dato con fuente, nunca como adjetivo), `fecha`, `publicado` (la nota o el informe, con una cita de su título o primera oración), `resumen` (qué sostiene, sin adjetivos propios), `metodo` si el autor lo describe, `afirmaciones[]` (una por cada dato concreto: `afirmacion`, `fragmento` literal, `dato_real` con el documento oficial que lo confirma o lo desmiente y su cita, `calificacion`, `analisis`), `veredicto`. Ejemplo en `docs/ejemplos/analisis.yaml`.

## Investigación

El investigador carga todo menos las calificaciones: deja `calificacion: discutible` como marcador y el dato oficial al lado. Mismo umbral para el análisis que favorece a alguien y para el que lo perjudica; si el brief pide verificar solo uno de los dos, Regla 0.

## Edición

Cada `afirmaciones[].calificacion` con la regla del Veracímetro (`chequeos.md`), `analisis` de cada una en dos o tres oraciones, y el `veredicto` del registro: cuántas quedaron en cada calificación y qué cambia eso en la conclusión del análisis, sin decir si el autor tuvo razón «en general».

## Crítica

Una afirmación con cifra que el registro no cotejó; un `dato_real` sin documento oficial cuando el documento es previsible; un `autor_es` con adjetivos en vez de vínculos con fuente.
