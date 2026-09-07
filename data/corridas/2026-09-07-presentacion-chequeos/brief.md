# Brief de edición · corrida 2026-09-07-presentacion-chequeos

Regla 0: objetividad por encima de todo. Este lote toca todos los chequeos publicados, de todos los políticos, con el mismo criterio. Si algo acá te parece asimétrico, decilo en el informe y aplicá el criterio simétrico.

## Encargo

Un lector revisó las páginas del Veracímetro y encontró tres cosas: títulos que no dicen qué se discute (era la afirmación recortada: «En marzo de 2022, Lacalle Pou dijo que, por primera vez desde 2001 o 2002 según su propio…»), análisis y dato real en un solo bloque de texto interminable, y cifras comparadas en prosa cuando un gráfico las muestra de un vistazo (los resultados de ANCAP año por año, los precios de Uruguay y Brasil). Desde hoy la sección "Presentación" de tus instrucciones te da ese trabajo. Este lote lo aplica a los diez chequeos ya publicados; se promueve como corrección de tipo `presentacion`.

## Qué leés

`inbox/reparaciones/presentacion-chequeos-2026-09-07/chequeos.yaml`: copia exacta de los diez chequeos publicados, con `_id` (no lo toques) y `_investigacion` (tampoco).

## Qué escribís, en cada chequeo

1. `titulo` (8 a 110 caracteres): qué se chequea y, si cabe, el veredicto. Ejemplos del criterio: «Combustibles más baratos que en Brasil: cierto para el gasoil, falso para la nafta»; «ANCAP en números negativos "después de 10 años": el último ejercicio negativo fue 2020»; «Sobrecostos de USD 1.700 millones en 2015-2019: no hay dato oficial, sí un cálculo privado del mismo orden». Sin el nombre del político (la página lo muestra), sin fecha ni contexto.
2. `analisis` en párrafos separados por una línea en blanco. El primero resuelve en una o dos oraciones (qué dijo, qué dice el dato oficial, cuánto difiere): la página lo muestra al lado del veredicto y en el globo sobre la cita. Cada párrafo siguiente, una idea; ninguno pasa de unas 80 palabras y el total no pasa de unas 350. Lo que sobra (pruebas de sensibilidad, derivaciones, notas de método) va a `revision.notas_internas`, que no se publica pero queda: no lo borres, movelo.
3. `dato_real.valor` en uno o dos párrafos cortos: los números con su unidad, período y fuente. No la historia de cómo se encontraron.
4. `grafico` cuando el chequeo compara cifras en el tiempo o entre categorías (esquema en tus instrucciones): con los números que ya están en `dato_real` y la fuente de cada serie en una frase. Candidatos claros: los resultados de ANCAP por año (`colorear_por_signo: true`), los precios por litro de Uruguay y Brasil por combustible (dos series), y cualquier otro donde haya dos o más números comparables. Si un número que el gráfico necesita no está en el registro, lo leés con `pnpm fuente` y lo citás en `dato_real.fuentes`, o el gráfico no lleva ese punto. Sin fuente no hay gráfico.
5. Nada más cambia: ni `calificacion`, ni `afirmacion`, ni `fragmento`, ni las fuentes, ni el tier. Si al releer un chequeo ves un problema de fondo, anotalo en `data/corridas/2026-09-07-presentacion-chequeos/observaciones.md`; no lo corrijas acá.

## Razones

`data/corridas/2026-09-07-presentacion-chequeos/razones.md`: una línea por chequeo (`<id>: <titulo> · gráfico: sí/no · párrafos: N`), y una sección "Modelo" que diga que corriste en Sonnet por decisión del mantenedor.

## Validación

`pnpm validar --inbox inbox/reparaciones/presentacion-chequeos-2026-09-07` (sin `--red`: no cambian citas ni fuentes, salvo que hayas agregado una para un gráfico; en ese caso, con `--red`).

## Informe

Menos de 20 líneas: los diez títulos, qué chequeos llevan gráfico y de qué, observaciones, y el modelo con el que corriste.
