# Revisión de la página construida

Los agentes trabajan sobre YAML y no ven la página. La página la ve el sitio construido, y
alguien tiene que mirarla antes de que llegue al lector. Dos chequeos, en este orden, y una lista
de todo lo que un lector pidió sobre cómo se ve una página.

## 0. Todo lo que un lector pidió (lista de control, resumida)

La lista se partió en dos: lo que un registro tiene que traer (título, párrafos, gráfico, hitos,
texto para el lector) vive en `docs/colecciones/presentacion.md` y es de los agentes; lo que un
componente o una página tiene que hacer (plegado, líneas de tiempo a escala, contadores con enlace,
rótulos que no se pisan, medido en el navegador) vive acá y es de quien construye el sitio. Esta
tabla conserva los diecinueve puntos originales en una línea cada uno, para recorrerla frente a una
página abierta; cada punto salió de una página que el lector vio y rechazó.

| # | Regla | Cómo se ve cuando falla |
|---|---|---|
| 1 | Fuentes en dos bloques: primarias y documentos oficiales, después prensa | una lista de fuentes mezclada, o dos notas sobre una conferencia contadas como dos fuentes |
| 2 | Un publicador con varios documentos es una línea, con los documentos plegados | veinte renglones «ANCAP, balance 20xx» |
| 3 | «Todo» muestra todo lo que existe; si no está cargado, el botón dice el rango y una línea dice desde cuándo existe la empresa | un gráfico que arranca en 2015 para una empresa de 1931 sin decirlo |
| 4 | Gráficos: color por concepto, trazo por variante, años que no se pisan, nota corta al pie, método y tabla plegados | cuatro colores para dos productos en dos países; bloque de texto bajo el gráfico |
| 5 | Tablas limpias: el dato y nada más; salvedades como notas al pie numeradas | párrafos dentro de celdas |
| 6 | Títulos que dicen lo sustancial; párrafos cortos con el veredicto primero; análisis de menos de 350 palabras | «En marzo de 2022, X dijo que…» como título |
| 7 | Audio y video desde el contexto, con la marca visible | el reproductor arranca en la frase suelta |
| 8 | Toda ayuda visual que condense información, ninguna por decorar | cifras comparadas en prosa; hechos fechados sin línea de tiempo; foto sin licencia |
| 9 | Un análisis con varias cifras de una fuente tiene página propia | cinco filas de `comparaciones` de un mismo informe |
| 10 | Las comparaciones dicen quién las hizo | «fuente» a secas |
| 11 | Un hueco no es un cero: «?» con motivo en el gráfico, guion en la tabla | una barra ausente que se lee como «no pagó» |
| 12 | Lo largo va plegado (`<details>` con resumen de una línea) | 44 notas al pie abiertas entre la tabla y el texto siguiente |
| 13 | Toda línea de tiempo es horizontal y a escala, con el zoom que haga falta | vertical; 1930 a la misma distancia de 2000 que 2000 de 2010; rótulos encimados |
| 14 | Lo repetido se condensa en una oración + banda a escala + lista plegada | veintinueve renglones iguales de mandatos |
| 15 | Un contador enlaza a lo que cuenta | «7 registros en probable» sin enlace, o con enlace a la lista de todos |
| 16 | Lo que un visual ya muestra no se repite en texto debajo | desplegables por año con los mismos ítems que la línea de tiempo |
| 17 | Cada punto lleva al registro (tarjeta al pasar el cursor, clic a la página o al documento) | enlaces que bajan a una lista de la misma página: tres clics para llegar |
| 18 | Legible al 100 %, medido con el fragmento de abajo y una captura al 100 % | «parece bien» en una captura al 60 % |
| 19 | Una sección sin registros es una línea con la explicación plegada | una introducción de un párrafo a una sección vacía |

Y transversal a todo: **ningún texto para el lector cuenta el proceso** (ids de corridas, «en esta
corrida», «vuelta 2», «el editor», `notas.md`, nombres de archivo). Eso vive en `data/corridas/`.

## 1. `pnpm revisar:paginas` (mecánico, dentro de `pnpm build`)

Recorre `dist/` y falla por lo que un lector señaló varias veces:

| Regla | Qué detecta | Corta el build |
|---|---|---|
| `narracion-de-proceso` | ids de corridas, «en esta corrida», «vuelta 2», «el editor», «el crítico», `notas.md`, `inbox`, nombres de archivo `.yaml`, en texto para el lector, incluidas las notas al pie de una tabla y lo plegado en un `<details>` | siempre (`--laxo` solo lo lista) |
| `bloque-largo` | un párrafo de más de 1.500 caracteres de texto visible fuera de un `<details>` (aviso desde 800; no cuenta los globos ni las tarjetas que aparecen al pasar el cursor) | siempre (`--laxo` solo lo lista) |
| `lista-repetida` | ocho o más ítems de una lista que empiezan igual; cuatro o más mandatos del mismo cargo en renglones sueltos | siempre |
| `contador-sin-enlace` | «Hay N registros…» sin un enlace a lo que cuenta | siempre |
| `duplicado-tras-visual` | una línea de tiempo o un gráfico seguido, hasta el próximo título, de listas o tablas con los mismos enlaces | siempre |
| `sin-grafico` / `sin-linea-de-tiempo` / `sin-banda-mandatos` / `vacio-largo` | ficha sin su ayuda visual; sección vacía con explicación larga sin plegar | `sin-grafico` siempre; el resto aviso |

`pnpm revisar:paginas --avisos` muestra los avisos; `--solo <fragmento>` limita a una página;
`--laxo` lista los errores de contenido sin cortar (para medir cuánto falta cuando entra contenido
nuevo con problemas). Un registro que dispara `narracion-de-proceso` o `bloque-largo` se arregla
con una corrección de tipo `presentacion`: se reescribe la forma, nunca lo afirmado. El 2026-09-09
se limpió todo el contenido publicado en cuatro lotes (narración a, b y c, y notas-empresas-b) y
desde entonces el build corta con el primero que aparezca.

## 2. Superposiciones y legibilidad (en el navegador, desde el chat)

Un HTML no dice si dos rótulos se pisan. Antes de commitear un cambio visual (una línea de tiempo,
un gráfico, una banda), `/revisar` abre la página en el navegador y corre este fragmento sobre el
componente; el resultado tiene que ser cero superposiciones y ninguna tarjeta recortada:

```js
const raiz = document.querySelector('#lt-hitos'); // o el contenedor que corresponda
const cajas = [...raiz.querySelectorAll('.lt-rotulo, .lt-anio-rotulo')].map((e) => e.getBoundingClientRect());
let solapes = 0;
for (let i = 0; i < cajas.length; i++)
  for (let j = i + 1; j < cajas.length; j++) {
    const a = cajas[i], b = cajas[j];
    if (a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom) solapes++;
  }
// La tarjeta de un punto del medio, enfocado: tiene que caber entera dentro del contenedor.
const punto = [...raiz.querySelectorAll('.lt-punto')].at(Math.floor(raiz.querySelectorAll('.lt-punto').length / 2));
punto.focus();
const t = punto.querySelector('.lt-tarjeta').getBoundingClientRect();
const s = raiz.querySelector('.lt-scroll').getBoundingClientRect();
({ rotulos: cajas.length, solapes, tarjetaRecortada: t.top < s.top || t.bottom > s.bottom, hrefs: [...raiz.querySelectorAll('.lt-punto')].map((p) => p.getAttribute('href')).filter((h) => !h || h.startsWith('#')).length });
```

`hrefs` cuenta los puntos sin destino o con destino dentro de la misma página: tiene que dar cero.

Y una captura al 100 % (no al 60 %) de la parte cambiada, mirada de verdad: si algo no se lee en
la captura, no se lee para el lector. Una captura chica que «parece bien» ya dejó pasar una
línea de tiempo con todos los rótulos encimados.

## 3. Recorrida por todo el sitio

Cada vez que cambia un componente compartido, se recorre el sitio entero construido, no una
muestra: `docs/revision-sitio.js` carga cada página en un iframe desde el navegador y mide lo que
un HTML sin dibujar no puede (rótulos que se pisan, tarjetas recortadas, desplazamiento horizontal,
párrafos visibles largos, secciones enormes sin plegar, letra chica). El 2026-09-09 la primera
recorrida completa sobre 468 páginas encontró ocho tipos de falla que el chequeo mecánico no veía
(rótulos anclados al borde que pisaban al anterior, la tarjeta de un punto corrido de fila, dos
tablas que hacían desplazable la página, motivos de corrección de seis mil caracteres, listas de
cientos de registros sin plegar). Lo que falla se arregla en el componente (vale para todas las
páginas) o, si viene del registro, con una corrección de tipo `presentacion`.

## Por qué esto no lo hace el crítico

El crítico revisa lotes del inbox (YAML) y no puede construir el sitio ni abrir un navegador. Lo
que sí puede hacer, y hace (punto 8 de su rol), es objetar los datos que van a quedar mal en la
página: notas de un párrafo, series sin gráfico, texto de proceso en `resumen` o `cobertura`. El
chequeo mecánico y la mirada en el navegador son el último nivel, y son responsabilidad de quien
promueve y commitea.
