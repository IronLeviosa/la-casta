# Revisión de la página construida

Los agentes trabajan sobre YAML y no ven la página. La página la ve el sitio construido, y
alguien tiene que mirarla antes de que llegue al lector. Dos chequeos, en este orden:

## 1. `pnpm revisar:paginas` (mecánico, dentro de `pnpm build`)

Recorre `dist/` y falla por lo que un lector señaló varias veces:

| Regla | Qué detecta | Corta el build |
|---|---|---|
| `narracion-de-proceso` | ids de corridas, «en esta corrida», «vuelta 2», «el editor», «el crítico», `notas.md`, `inbox`, nombres de archivo `.yaml`, en texto para el lector | con `--estricto` (hoy pendiente hasta limpiar el contenido viejo) |
| `bloque-largo` | un párrafo de más de 1.500 caracteres fuera de un `<details>` (aviso desde 800) | con `--estricto` |
| `lista-repetida` | ocho o más ítems de una lista que empiezan igual; más de seis mandatos en renglones sueltos | siempre |
| `contador-sin-enlace` | «Hay N registros…» sin un enlace a lo que cuenta | siempre |
| `sin-grafico` / `sin-linea-de-tiempo` / `sin-banda-mandatos` / `vacio-largo` | ficha sin su ayuda visual; sección vacía con explicación larga sin plegar | `sin-grafico` siempre; el resto aviso |

`pnpm revisar:paginas --avisos` muestra los avisos; `--solo <fragmento>` limita a una página;
`--estricto` hace fatal todo. Un registro que dispara `narracion-de-proceso` o `bloque-largo` se
arregla con una corrección de tipo `presentacion`: se reescribe la forma, nunca lo afirmado.

## 2. Superposiciones y legibilidad (en el navegador, desde el chat)

Un HTML no dice si dos rótulos se pisan. Antes de commitear un cambio visual (una línea de tiempo,
un gráfico, una banda), `/revisar` abre la página en el navegador y corre este fragmento sobre el
componente; el resultado tiene que ser cero superposiciones:

```js
const raiz = document.querySelector('#lt-hitos'); // o el contenedor que corresponda
const cajas = [...raiz.querySelectorAll('.lt-rotulo, .lt-anio-rotulo')].map((e) => e.getBoundingClientRect());
let solapes = 0;
for (let i = 0; i < cajas.length; i++)
  for (let j = i + 1; j < cajas.length; j++) {
    const a = cajas[i], b = cajas[j];
    if (a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom) solapes++;
  }
({ rotulos: cajas.length, solapes });
```

Y una captura al 100 % (no al 60 %) de la parte cambiada, mirada de verdad: si algo no se lee en
la captura, no se lee para el lector. Una captura chica que «parece bien» ya dejó pasar una
línea de tiempo con todos los rótulos encimados.

## Por qué esto no lo hace el crítico

El crítico revisa lotes del inbox (YAML) y no puede construir el sitio ni abrir un navegador. Lo
que sí puede hacer, y hace (punto 8 de su rol), es objetar los datos que van a quedar mal en la
página: notas de un párrafo, series sin gráfico, texto de proceso en `resumen` o `cobertura`. El
chequeo mecánico y la mirada en el navegador son el último nivel, y son responsabilidad de quien
promueve y commitea.
