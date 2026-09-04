# Experimento: ¿hacen falta los modelos caros?

Pregunta: si todo el trabajo de agentes de La Casta corriera con modelos baratos, ¿el sitio
sería peor? La respuesta importa porque hoy el pipeline editorial cuesta unos 48 dólares
equivalentes por corrida y el mismo perfil de tokens en Sonnet costaría unos 18.

Este archivo es el protocolo. `pnpm experimento crear` arma el brazo barato y
`pnpm comparar <A> <B>` mide la diferencia. Todo lo que no se pueda medir con esos dos
comandos se adjudica a ciegas y se anota acá.

## Restricción dura: Haiku no puede ser agente del pipeline

Haiku 4.5 tiene ventana de contexto de 200 000 tokens; los demás modelos en uso tienen
1 000 000. Medido sobre las corridas de setiembre de 2026, el editor trabajó con un contexto
mediano de 421 000 tokens sobre tres lotes y el investigador llegó a 246 000 en uno solo. Ni
siquiera con un lote por vez entra el editor en Haiku, y el investigador entraría apenas.

Por eso "solo Haiku y Sonnet" se implementa así: **Sonnet en todos los roles del pipeline, y
Haiku donde ya está** (el etiquetador, que ve una nota por vez y devuelve JSON corto). No es
una decisión de calidad sino de aritmética de contexto.

## Los dos brazos

| Rol | Brazo caro (hoy, `main`) | Brazo barato (`experimento-sonnet`) |
|---|---|---|
| Investigador | Sonnet | Sonnet (sin cambio) |
| Crítico | Opus | Sonnet |
| Editor | Fable | Sonnet |
| Detective | Opus | Sonnet |
| Etiquetador | Haiku | Haiku (sin cambio) |
| Subagentes genéricos | Opus | Sonnet |
| Chat que orquesta | elección del mantenedor | Sonnet |

El investigador no cambia, así que el experimento no dice nada sobre la etapa de búsqueda.
Mide las dos etapas de juicio: la crítica adversarial y la edición.

## Qué se mantiene idéntico, y por qué

- **El brief**, palabra por palabra. `pnpm experimento crear` conserva el `brief.md` de cada
  corrida y borra todo lo demás. Si el brief se regenera, cambia la fecha y la tabla de medios,
  y la comparación pasa a medir dos prompts distintos.
- **Las colecciones de referencia**: `politicos`, `temas`, `medios`, `eventos`, `referentes`,
  `leyes`, `paginas`. La tabla de medios con su `grupo` es la que decide la regla de dos
  fuentes; si difiere entre brazos, se está midiendo la tabla y no el modelo.
- **El corpus** (`../la-casta-corpus`), compartido. Quita la variabilidad de la red y del
  estado de los sitios, y hace el brazo barato mucho más rápido.
- **El commit**. Los dos brazos corren sobre el mismo árbol de código. Por eso
  `pnpm experimento crear` se niega a trabajar con cambios sin commitear.

## Los tres sesgos que tiene este diseño

Van escritos porque un experimento con sesgos conocidos y declarados sirve; uno con sesgos
callados, no.

1. **El corpus lo construyó el brazo caro.** Las notas que están en el corpus son las que
   encontraron los investigadores de las corridas anteriores, y `pnpm corpus:buscar` va antes
   que la web. El brazo barato hereda esas fuentes. La pregunta que el experimento contesta es
   entonces más angosta: *con las mismas fuentes disponibles, ¿juzga igual?* No contesta si
   Sonnet las habría encontrado solo.
2. **El contenido actual de `main` no es un brazo válido.** Se produjo con la herramienta de
   lectura anterior (sin el arreglo de `--buscar`, sin índice de menciones) y con el editor
   corriendo sobre tres lotes juntos. Comparar el brazo barato nuevo contra ese contenido
   mezcla el cambio de modelo con el cambio de herramienta. **El brazo caro hay que volver a
   correrlo** con el código de hoy.
3. **Se cambian tres roles a la vez.** Si el brazo barato sale peor, no se sabe si fue el
   crítico, el editor o los dos. Eso es aceptable como primera pasada, con esta condición: si
   sale peor, la segunda pasada baja **un solo rol** por vez.

## El orden que se eligió, y por qué

Lo obvio es repetir las seis corridas ya hechas de Lacalle Pou y Vázquez con el brazo barato.
Tiene un problema: por el sesgo 2 también habría que repetirlas con el brazo caro, y esa
repetición no produce nada nuevo para el sitio. Son unos 289 dólares equivalentes de trabajo
desechable.

Se decidió otra cosa, el 2026-09-04: **correr los dos brazos sobre las corridas que faltan**,
presidente por presidente, empezando por Orsi, y con el brazo barato primero. La razón de que
vaya primero es de presupuesto, no de método: el consumo semanal de Fable estaba al 90 % y se
necesitaba para otro trabajo. El brazo caro corre cuando esa ventana se reinicia.

Consecuencias de ese orden, que hay que tener presentes al leer los resultados:

- **El sesgo 1 se da vuelta.** Ahora el corpus lo construye el brazo barato, y el caro heredará
  las fuentes que Sonnet encontró. La pregunta que se contesta sigue siendo la misma, "con las
  mismas fuentes, ¿juzga igual?", pero el que llega segundo ya no tiene que buscarlas.
- **La primera etapa no compara nada.** Mientras solo corra el brazo barato, lo único que se mide
  es el consumo: cuántos tokens de entrada y salida cuesta procesar el mismo trabajo. La
  comparación de conclusiones necesita los dos brazos y llega después.
- **El brazo barato de esta etapa no vive en un worktree.** Corre sobre la rama principal, con el
  modelo pasado en cada llamada al subagente: `critico` y `editor` se lanzan con `model: sonnet`,
  que pisa el `model:` declarado en el archivo del agente. Los archivos de instrucciones no se
  tocan, así que `agentes.json` registra los mismos hashes que el brazo caro y la única variable
  que cambia entre brazos es `procedencia.modelo`, que es exactamente lo que se quiere medir.

Cuando llegue el turno del brazo caro, el worktree se arma al revés de lo previsto originalmente:

```bash
pnpm experimento crear --brazo caro --corrida 2026-09-04-orsi-economia-impuestos,2026-09-04-orsi-economia-combustibles,2026-09-04-orsi-transparencia-corrupcion
```

Eso borra del worktree solo los registros de esas corridas, conserva sus `brief.md` palabra por
palabra y deja el resto del sitio intacto. Después, `/investigar` y `/revisar` ahí, y
`pnpm comparar <raíz principal> <worktree> --corrida <id>`.

## Qué se mide

**Mecánico** (`pnpm comparar A B --corrida <id>`), sin criterio humano:

| Medida | Qué dice |
|---|---|
| Declaraciones en los dos brazos, y solo en uno | Cobertura: si un brazo encuentra la mitad, se ve acá. |
| Kappa de tier sobre las comunes | Si los dos publican y bajan a `probable` las mismas cosas. |
| Kappa de `cambio` y `explicacion` en giros | El juicio editorial más delicado. |
| Kappa de `estado` en promesas | La escala de Chequeado. |
| URLs, medios y proporción de fuente primaria | Si un brazo se apoya más en prensa y menos en documento oficial. |

**Mecánico y objetivo** (`pnpm validar:red`): cuántos registros de cada brazo no pasan la
verificación de citas. Es el único lugar donde hay verdad de referencia: la cita está en el
texto de la fuente o no está. Es también el fallo que más le importa al proyecto.

**Adjudicación a ciegas**: `pnpm comparar` imprime la lista de registros donde los dos brazos
calificaron distinto lo mismo. Esos, y solo esos, los lee el mantenedor sin saber cuál brazo
escribió cuál, y anota cuál análisis es mejor o si empatan. Es poco trabajo porque la lista es
corta por construcción, y es el único juez sin conflicto de interés: el crítico Opus favorecería
a su propio brazo y el Sonnet al suyo.

## Potencia estadística: lo que este experimento no va a poder decir

Seis corridas produjeron 29 declaraciones y 5 giros. Un kappa sobre 5 items es ruido: con esa
muestra solo se puede detectar una diferencia grande, del tipo "el brazo barato no encontró la
mitad de las declaraciones" o "inventó tres citas". Una diferencia fina de criterio editorial
—que es justamente donde uno esperaría que Fable se note— **no es detectable con esta n**.

Consecuencia práctica: si el resultado da parejo, la conclusión correcta no es "son iguales"
sino "no encontramos diferencia con esta muestra". Para afirmar equivalencia hace falta acumular
corridas, y la forma barata de acumularlas es dejar el experimento corriendo en paralelo a medida
que se agregan presidentes, no montar una tanda especial.

## Criterio de decisión, fijado antes de correr

Para que el resultado no se interprete a conveniencia después de verlo:

- **El brazo barato se adopta** si no tiene más fallos de verificación de citas que el caro, su
  cobertura de declaraciones no baja más de un 15 %, el kappa de tier es 0,6 o más, y la
  adjudicación a ciegas no favorece al brazo caro en más de 2 de cada 3 registros disputados.
- **Se rechaza** si aparece cualquier cita que no pasa `validar:red` y el brazo caro no tenía
  ese fallo, o si la adjudicación a ciegas favorece al caro de forma sistemática.
- **Queda sin resolver**, y se sigue acumulando corridas, en cualquier otro caso.

## Bitácora

Una entrada por corrida, con lo que se sepa en cada etapa. Las columnas del brazo caro quedan
vacías hasta que se reinicie la ventana semanal de Fable.

| Corrida | Brazo barato | Brazo caro | Cobertura A→B | Kappa tier | Fallos de cita | Adjudicación |
|---|---|---|---|---|---|---|
| 2026-09-04-orsi-economia-impuestos | 2026-09-04 | pendiente | | | | |
| 2026-09-04-orsi-economia-combustibles | 2026-09-04 | pendiente | | | | |
| 2026-09-04-orsi-transparencia-corrupcion | 2026-09-04 | pendiente | | | | |

El consumo de cada corrida se lee con `pnpm agentes --todas-las-sesiones`, que además avisa si
algo corrió en Fable fuera del subagente `editor`.
