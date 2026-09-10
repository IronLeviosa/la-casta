# Chequeos, el Veracímetro (`content/chequeos/`)

`afirmacion` es un dato concreto (cifra, fecha, cantidad, comparación: «por primera vez», «el más bajo de la región»), nunca una opinión ni una promesa. Cuatro calificaciones: `verdadero` (verde), `impreciso` (verde claro), `discutible` (amarillo) y `falso` (rojo). Color siempre acompañado de texto e ícono.

**Regla dura:** `verdadero`, `impreciso` y `falso` exigen al menos una fuente `documento_oficial` (INE, BCU, MEF, DGI, URSEA, Poder Judicial, Corte Electoral, JUTEP, un dataset público) o `diario_de_sesiones` en `dato_real.fuentes`. Con prensa sola, lo máximo es `discutible`. Un chequeo que queda en `discutible` cuando el documento es previsible (una sentencia, una versión taquigráfica, una resolución, un dataset oficial) es una investigación por la mitad: el crítico lo objeta con `documento_previsible` y el lote no cierra sin esa búsqueda.

## Campos

`politico`, `declaracion` (id publicado, o `<politico>/<fecha>-<_slug>` si la declaración está en el mismo lote), `tema`, `fecha`, `titulo`, `afirmacion`, `fragmento` (el tramo exacto de la cita o del resumen donde está el dato, copiado tal cual: la página lo marca con el color de la calificación y le cuelga un globo con el análisis; si no coincide, la marca no aparece y el validador lo rechaza), `calificacion`, `dato_real: {valor, fuentes[]}`, `analisis`, `grafico` o `graficos[]` cuando compara cifras, `evidencia` (de dónde sale la afirmación; sirven las fuentes de la declaración). Ejemplo en `docs/ejemplos/chequeo.yaml`.

## Investigación

- **Los chequeos nacen de los datos que aparecen dentro de las citas.** El investigador escribe uno por cada dato que la persona afirma en una cita o un resumen, busca el dato oficial que permita juzgarlo (INE, BCU, MEF, DGI, URSEA, ANCAP, Parlamento, `catalogodatos.gub.uy`; para una comparación con otro país, el organismo oficial de ese país) y lo deja en `dato_real` con su cita. No califica: deja `calificacion: discutible` como marcador. Si no encuentra el dato oficial, escribe igual el chequeo con `_faltante: dato_oficial` y lo que sí encontró.
- **El umbral de qué es «un dato» es el mismo para cualquier político.** Una figura retórica («100 %», «mil veces») no es un dato; se dice en `notas.md` con el motivo.
- **Precedencia de la primaria.** Si en la misma corrida apareció el registro primario (audio, video, texto oficial), la `afirmacion` se escribe contra lo que la primaria dice, con sus reservas («creo que», «más o menos»), y no contra la versión de la prensa. Si el `resumen` publicado dice otra cosa, se anota en `notas.md` bajo `## resumen_vs_primaria` para que el editor ajuste resumen y `fragmento` juntos. Chequear la versión del diario en vez de la del hablante es calificar una frase que la persona no dijo.
- Para antecedentes, sumarios, investigaciones administrativas o datos de un caso penal, las puertas oficiales y su orden están en `docs/fuentes-oficiales/casos-penales.md` y `docs/fuentes-oficiales/ministerio-interior.md`.

## Edición: cómo calificar

- Solo si hay una afirmación factual concreta. Sin documento oficial, `discutible` o no hay chequeo.
- **`impreciso`, no `discutible`, para la cifra que le erra por poco.** Si el dato oficial existe y la cifra dicha difiere de él en hasta un 10 %, o en una unidad cuando es chica (años, cantidades de un dígito), y el sentido de lo dicho se mantiene: `impreciso` («después de diez años» cuando fueron nueve). `discutible` es para dos lecturas posibles o falta de documento. `falso` cuando el sentido cambia o el margen se supera. El umbral es el mismo para todos.
- **`analisis`** empieza por la comparación en una oración (qué dijo, qué dice el dato oficial, cuánto difiere) y recién después el contexto; párrafos según `presentacion.md`. **`dato_real.valor`** son los números con su unidad, período y fuente, en uno o dos párrafos cortos, no la historia de cómo se encontraron.
- **`grafico`** cuando compara cifras en el tiempo o entre categorías, con los números que ya están en `dato_real` y la fuente de cada serie en una frase; si uno solo no alcanza (un combustible por gráfico), los siguientes van en `graficos[]`, hasta tres. Esquema:

```yaml
grafico:
  tipo: barras                      # barras | lineas
  titulo: Resultado del ejercicio de ANCAP, 2015-2024
  unidad: millones de USD
  colorear_por_signo: true          # una sola serie, importa el signo
  nota: Convertido al tipo de cambio de cierre de cada año.
  metodo: >-
    Convenciones, advertencias y método, plegados bajo «Cómo se calculó».
  series:
    - nombre: Resultado del ejercicio
      fuente: Estados financieros auditados de ANCAP, 2015 a 2024
      puntos:
        - { x: "2019", y: 39.2 }
        - { x: "2020", y: -12.1, nota: "pérdida" }
```

- **Datos sin chequeo.** El editor relee cada cita y cada resumen del lote buscando cifras, fechas, cantidades y comparaciones sin chequeo, y las lista en `notas.md` bajo `## chequeos_pendientes` como `{declaracion, fragmento, afirmacion, donde_buscar}`; `/revisar` lanza un corrector con esa lista y solo esa lista. No se inventa el dato ni se califica de memoria.

## Crítica

Si hay `afirmacion` chequeable, ¿existe documento oficial para confirmarla o refutarla? Nombrarlo (organismo, dataset), no buscarlo. Si el chequeo está o quedaría en `discutible` solo porque falta ese documento y el documento es previsible, objeción `corregir` de tipo `documento_previsible` con el organismo y la ruta donde debería estar. Vale igual para todos: el mismo documento que se le exige a uno se le exige a otro.
