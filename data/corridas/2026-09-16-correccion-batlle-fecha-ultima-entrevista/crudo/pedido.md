# Pedido de corrección (interno)

Origen: revisión de la corrida 2026-09-16-batlle-economia-impuestos, después de que entró a main la regla «Cómo se fecha» de docs/colecciones/declaraciones.md (fecha_precision).

Registros: los diez de content/ que citan la entrevista de El Observador publicada el 2016-10-25 (https://elobservador.com.uy/nota/la-ultima-entrevista-de-batlle-con-el-observador-20161025500): dos declaraciones, cuatro menciones y cuatro chequeos, todos con fecha 2016-10-24.

Qué se pide: la entrevista se publicó el 25 de octubre de 2016, un día después del fallecimiento de Jorge Batlle (24 de octubre de 2016). Los registros llevan como fecha esa cota (el fallecimiento), pero se publican como si la fecha fuera cierta al día. Según la regla, cuando la fuente no dice cuándo se dijo lo que cita, la fecha es la cota documentada y lleva fecha_precision: antes_de. Se pide agregar fecha_precision: antes_de a los diez registros sin cambiar la fecha ni el id.

Qué verificar antes de aceptar: que la fuente efectivamente no diga cuándo se hizo la entrevista (si lo dice, la fecha correcta es esa y el cambio es otro, con reemplaza:, y no se aplica acá), y que ningún texto para el lector (título, resumen, análisis) presente la fecha como cierta.
