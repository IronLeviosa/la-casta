# Razones de edición — corrida 2026-09-04-lacalle-pou-economia-combustibles

Editor: comando `/revisar` (Fable, `claude-fable-5-1`), 2026-09-04. Crítico: Opus (`critica.md`).
Lote editado junto con `2026-09-04-lacalle-pou-economia-impuestos` (donde se publica la declaración del 30/03/2019 y la promesa de tarifas) y `2026-09-04-lacalle-pou-transparencia-corrupcion`.

`crudo/` se copió después de la ronda de correcciones de los investigadores (ver `notas.md`), así que `edicion.diff` muestra solo las decisiones del editor y los ajustes posteriores. `procedencia.modelo` del investigador: `claude-sonnet-5`, tomado de las transcripciones de la sesión (el investigador no lo anotó); giros con `claude-fable-5-1`.

## Regla 0

Sin instrucciones asimétricas en la sesión. El umbral aplicado (promesa absoluta se juzga por su letra; el balance se publica completo) es el mismo del lote de impuestos y se aplicaría a cualquier político. Para corregir la asimetría de búsqueda que señaló el crítico (objeción de lote 7: se buscaron subas y no bajas), el editor agregó una baja efectiva de precio (octubre de 2024) desde una nota que el investigador había leído y descartado.

## Decisiones editoriales

1. **Declaración del 30/03/2019 retirada de este lote.** Es la misma declaración que se promueve desde el lote de impuestos bajo el tema padre `economia` (id `lacalle-pou/2019-03-30-termino-aumento-impuestos-tarifas-combustibles`); dos registros con el mismo dicho serían un duplicado. Además su segunda fuente acá era una columna de opinión de la diaria (14/02/2022, campaña del referéndum, con paywall), objetada por el crítico (declaraciones[0]); la versión de impuestos usa El Observador 12/03/2020, que es cobertura. Los giros de este lote referencian el id promovido desde impuestos, por eso impuestos se promueve primero.
2. **`no-aumentar-combustibles` → `incumplida`, tier `probable`.** Componente de combustibles de la promesa compuesta (partida en tres; crítica promesas[0] de ambos lotes). En contra: el propio Lacalle Pou reconoció el 03/03/2022 que "es cierto" que no se pudo cumplir y que "no hubiera hecho ese compromiso" de haber previsto la pandemia y la guerra (dos grupos), y el 28/05/2022 anticipó el ajuste al alza ("la espalda básicamente se terminó", dos grupos). A favor: sin suba en marzo de 2020, contención con ganancias de ANCAP en noviembre de 2021, precios por debajo del PPI en mayo de 2022 ($10,75 gasoil, $6,41 nafta), congelamiento en febrero de 2023, rebajas en junio de 2023 y octubre de 2024. El estado no depende de la magnitud; la magnitud sí de la serie oficial de precios 2020-2025, que falta. Tier `probable` porque cinco evidencias tienen fuente única y falta esa serie (regla: "le falta una segunda fuente").
3. **`liberalizar-importacion-combustibles-luc` → `incumplida`, tier `probable`.** El investigador leyó la ley 19.889 en IMPO: la LUC promulgada no desmonopolizó ANCAP; el artículo se retiró en mayo de 2020 antes de votarse (Subrayado + Montevideo Portal, dos grupos) y en su lugar quedaron los artículos 235-237 (precio fijado por el Poder Ejecutivo con informe preceptivo de URSEA y PPI). Con el mandato terminado sin liberalización general, el contenido no se cumplió; la liberalización para buques (octubre de 2020, por el Presupuesto, no por la LUC) se registra como `neutral` por ser de alcance distinto y marginal. El plazo de 90 días no se califica por separado: el cronograma real está en el Diario de Sesiones y no se verificó, y el incumplimiento del contenido lo vuelve irrelevante (crítica promesas[1]). `probable` porque el origen tiene una sola fuente (En Perspectiva) y dos evidencias tienen fuente única.
4. **Giro `no-subir-combustibles-2022`: `cambio_total` + `reconocido_explicitamente`, `publicado`.** Antes: "se terminó el aumento de… los combustibles" (30/03/2019). Después: "es cierto" que no se pudo cumplir; "obviamente no hubiera hecho ese compromiso" (03/03/2022). Es una retractación directa del compromiso, no un matiz: la posición pasó de "no habrá aumentos" a "aumentamos según la referencia cuando ANCAP no puede absorber". El crítico propuso `cambio_parcial` porque las subas se contuvieron por debajo del PPI; eso pesa en la magnitud y se describe en la promesa, pero no cambia que la posición se invirtió. Reconocido explícitamente porque él mismo dijo que no cumplió y por qué; por eso no requiere aprobación humana. La guerra en Ucrania y la pandemia aparecen solo como atribución suya (están en las dos citas), no como hecho verificado por el lote; el análisis lo dice.
5. **Giro `criterio-espalda-ancap-2021-2022`: `sin_cambio`, `probable`.** 16/11/2021 ("deberíamos de haber aumentado, pero como ANCAP dio ganancia…") → 28/05/2022 ("cada vez que no aumentamos lo que debemos aumentar… La espalda básicamente se terminó"): el mismo criterio enunciado el 25/01/2022 como regla. Hereda `probable` porque la declaración de 2021 tiene fuente única.
6. **El "Giro 2" del crítico (promesa vs. suba de UTE/OSE/Antel a los 11 días) no es de este tema**: se trata en `no-aumentar-tarifas-publicas` (lote de impuestos), como pidió el crítico.

## Cambios entre `crudo/` y lo promovido

### declaraciones.yaml

- [0] 2019-03-30 · **retirada** (decisión 1).
- [1] 2019-09-04 · `resumen` amplía el contexto (coloquio de En Perspectiva con asesores; Arbeleche fijó en el mismo bloque el criterio de tarifas a costo; "incombustibles" es errata de la fuente); `tier: probable` (fuente única, lecueder-cotelo). Crítica declaraciones[1]. La transcripción completa enlazada no se abrió: pendiente.
- [2] 2020-03-11 · `tier: probable` (fuente única que reporte la frase; el resumen ya venía corregido por el investigador tras la objeción bloqueante declaraciones[2]: no dijo que no subirían, sino que la adecuación sería menor y no la adelantó).
- [3] 2021-07-20 · `tier: publicado` (werthein-hochbaum + cardoso).
- [4] 2021-11-16 · reubicada en orden cronológico (estaba después de la de marzo de 2022); cita ya extendida por el investigador hasta "deberíamos de haber aumentado" (crítica declaraciones[3]); `tier: probable` (fuente única); nota con los candidatos a chequeo del pasaje.
- [5] 2022-01-25 · `tier: publicado` (editora-caras-y-caretas + werthein-hochbaum).
- [6] 2022-03-03 · `tier: publicado` (werthein-hochbaum + cardoso).
- [7] 2022-03-27 · `tier: probable` (fuente única); candidatos a chequeo anotados (US$ 1.700 millones de sobrecostos; "más baratos que Brasil").
- [8] 2022-05-28 · `resumen` incorpora que fue respuesta a una pregunta, el informe de URSEA con la brecha de $10,75 y $6,41 por litro bajo el PPI, y que ninguna nota le pregunta por la promesa (crítica declaraciones[4]); `tier: publicado` con nota de que los dos grupos desgraban la misma rueda de prensa de radio Universal.
- [9] 2022-08-25 · `tier: probable` (fuente única).
- [10] 2023-01-31 · `resumen` sin la frase "a veces sube, a veces no", que no está en la cita registrada (crítica declaraciones[5]); agrega que el PPI se aplica desde 2002; `_faltante` movido al nivel de la evidencia (forma); `tier: probable` (fuente única, agregador).
- [11] 2025-05-07 · `cita` principal cambiada a la frase sobre los balances de ANCAP (la anterior no nombraba el tema; crítica declaraciones[6]); fuentes reordenadas (Subrayado primero, que contiene la cita principal); `resumen` atribuye al medio el objeto de la crítica y aclara que ninguna cita nombra a Orsi; `tier: publicado` (tres grupos, una sola entrevista replicada, anotado).

### promesas.yaml

- [0] `texto` acotado al componente combustibles con remisión a las otras dos; segunda fuente del `origen`: columna de la diaria (2022) → El Observador 12/03/2020 (crítica declaraciones[0]); `estado: incumplida`; `fundamentacion` nueva (decisión 2); `tier: probable`.
- [0].evidencias 2020-04-01 (UTE/OSE/Antel, en_contra) · **retirada**: es evidencia de tarifas, no de combustibles, y duplicaba el hecho de la evidencia del 11/03/2020 con signo opuesto (crítica promesas[0], bloqueante). Va a la promesa de tarifas del lote de impuestos.
- [0].evidencias 2020-03-11 · descripción con el contexto (caída del crudo, "adecuación" futura menor) y remisión a la promesa de tarifas.
- [0].evidencias 2021-07-20 · `efecto` a_favor → neutral (declaración de intención del promitente).
- [0].evidencias 2021-11-16 · `tipo` declaracion → accion_de_gobierno (el hecho es no haber aumentado; la declaración lo documenta).
- [0].evidencias 2022-01-25 · `efecto` a_favor → neutral (declaración de criterio del promitente); descripción completa con la condición de subir si ANCAP no tiene espalda.
- [0].evidencias 2022-03-03 · descripción explicita que es reconocimiento contra su interés.
- [0].evidencias 2022-05-28 · descripción con la brecha respecto del PPI; cita de El Observador cambiada a la de los números oficiales (crítica declaraciones[4]).
- [0].evidencias 2024-09-30 · **agregada por el editor**: baja de nafta y gasoil para octubre de 2024 siguiendo el PPI de URSEA (Ámbito, leída con `pnpm fuente`, ya en el corpus; fuente única, `_faltante`). La nota trae dos magnitudes para la nafta ($2 y $2,5) y se dice. Corrige la asimetría de búsqueda de la objeción de lote 7.
- [1] `estado: incumplida`; `fundamentacion` nueva (decisión 3); `tier: probable`.
- [1].evidencias 2020-10-09 · `efecto` en_contra → neutral y descripción precisada: la liberalización para buques se aprobó en la comisión de Presupuesto, no en la LUC; la única oposición a la desmonopolización que la fuente documenta es la de Batllistas, y Cabildo Abierto aparece solo por la extensión a aeropuertos (crítica promesas[1], bloqueante). La evidencia del 22/05/2020 (retiro del artículo; ley 19.889 en IMPO) ya estaba en el crudo, agregada por el investigador.

### giros.yaml (nuevo, del editor)

- `no-subir-combustibles-2022` y `criterio-espalda-ancap-2021-2022`: decisiones 4 y 5.

## Cambios de forma

- `_slug` explícito en todos los registros; los giros referencian los ids que deriva `promover` (sin palabras vacías: `2022-05-28-espalda-ancap-termino`).
- Orden cronológico de las declaraciones restablecido.

## Objeciones del crítico que no se siguieron, y por qué

- Giro 1 como `cambio_parcial`: se califica `cambio_total` (decisión 4).
- "No usar la guerra en Ucrania hasta traer una fuente": no se usa como hecho; aparece únicamente como atribución del propio Lacalle Pou, que está literal en las dos fuentes del registro del 03/03/2022.
- Serie oficial de precios 2020-2025 (URSEA, ANCAP, IMPO), audio de Universal, transcripción de En Perspectiva, El País y un medio progresista para las fechas bisagra: no se investigó en la edición; queda como cabo en `hipotesis/lacalle-pou/combustibles-cuando-sube-sube-2024.yaml` y en `notas_internas`.
- Eventos propuestos (`campana-electoral-2019`, `precios-combustibles-2020-2025`, `tramite-luc-2020`, `polemica-balance-ancap-2025`): no se crean en una edición; los registros de cobertura de `critica.md` quedan sin promover.
- Hipótesis de `notas.md` sobre la contradicción Montevideo Portal / El Observador del 11/03/2020: cerrada con la lectura del crítico (El Observador se refiere a la polémica de la transición de diciembre de 2019; no hubo suba de ANCAP ese día); no se abre archivo en `hipotesis/`.
- "Cuando sube, sube, y cuando baja, baja" (2024): la nota de Ámbito del 30/09/2024 lo muestra solo como titular relacionado, sin cita; sigue en `hipotesis/lacalle-pou/combustibles-cuando-sube-sube-2024.yaml`.

## Registros de este lote que necesitan firma del mantenedor

Ninguno: el giro `cambio_total` tiene `explicacion: reconocido_explicitamente`; no hay casos ni fuentes con `verificacion: manual`.
