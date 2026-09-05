# Razones — votos del balotaje 2019

La crítica de la corrida de candidatos de 2014 encontró que la ficha de Lacalle Pou declaraba
1.189.313 votos con una cita que muestra 696.452. Lo verifiqué yo antes de tocar nada: abrí
`es.wikipedia.org/wiki/Elecciones_generales_de_Uruguay_de_2019` con `pnpm fuente` y confronté la
cita contra el texto extraído.

Al hacerlo revisé también a los otros seis candidatos de 2019 y encontré el mismo error en Daniel
Martínez, que la crítica no había mirado: 1.152.271 votos citando la fila de primera vuelta con
949.376. Los otros cinco están bien, y no por casualidad: quedaron en primera vuelta, así que la
cifra y la cita salen de la misma tabla.

Reemplacé la cita de los dos por la fila de la tabla del balotaje, incluyendo su encabezado, que
está a dos saltos de línea y por lo tanto sigue siendo un tramo contiguo. Sin el encabezado la fila
es una hilera de dígitos pegados y no se entiende qué es cada número.

Ningún dato cambia. Cambia la evidencia, que antes no alcanzaba. Y ese es el punto: el número
publicado era correcto, así que nada en el sitio se veía mal. Un error de evidencia con el
resultado correcto es el más difícil de encontrar y el que más erosiona la confianza si alguien lo
encuentra antes que nosotros.
