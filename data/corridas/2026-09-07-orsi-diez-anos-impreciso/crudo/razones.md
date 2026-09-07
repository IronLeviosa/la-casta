# Razones — reparación orsi-diez-anos-impreciso-2026-09-07

Registro: `orsi/2025-04-25-ancap-volvio-negativos-diez-anos-2025` (copia en `chequeos.yaml` de esta carpeta).

## Decisión

Cambio `calificacion` de `discutible` a `impreciso`. Orsi dijo que Ancap volvía a números negativos "después de 10 años"; con la cifra de 2020 vigente hoy (reexpresada por Ancap en 2021, Nota 30.2 de los EECC de ese año), el último ejercicio negativo antes de 2024 fue 2015, nueve años antes. Es el caso de manual del umbral nuevo: "«después de diez años» cuando fueron nueve" es literalmente el ejemplo que trae `editor.md` para `impreciso`, con un error de una unidad sobre un conteo de años (dentro de "una unidad cuando es chica") y con el sentido de lo dicho —una racha larga sin pérdidas, cortada en 2024— intacto. No corresponde `falso` porque el sentido se mantiene y el margen no se supera; no corresponde `discutible` porque hay documento oficial (los estados financieros auditados de Ancap, ambas versiones) y, con la cifra vigente, no hay dos lecturas posibles: hay una cifra oficial y una diferencia chica.

## El detalle de 2020, y por qué no cambia el ancla

Con la cifra de 2020 tal como Ancap la publicó originalmente (pérdida de USD 12,1 millones), el último ejercicio negativo antes de 2024 habría sido el propio 2020, cuatro años antes, una distancia que no sostiene "10 años" y que, sola, empujaría a `falso`. Pero esa cifra ya estaba superada por la propia Ancap desde 2021 —cuando corrigió un error en el cálculo del impuesto a la renta de 2018 a 2020 y reexpresó 2020 como ganancia—, es decir, más de tres años antes de que Orsi hablara en abril de 2025. El registro ya trae, en `dato_real.valor` (que no toqué), la conclusión de que el ejercicio negativo anterior a 2024 "fue 2015, nueve años antes, no diez ni cuatro": la cifra reexpresada es la vigente, y una cifra corregida por la propia empresa no es una lectura alternativa hoy legítima, es la que reemplazó a la anterior. Dejé esto explícito en el segundo párrafo de `analisis` porque es la clase de matiz que, sin decirlo, deja al lector con la sensación de que el sitio eligió la lectura que más convenía; con el matiz explícito, se ve que la elección es metodológica (usar la cifra vigente, con la anterior como contexto) y no editorial. Esta convención ya estaba escrita en `revision.notas_internas` de este mismo registro ("cuando una empresa reexpresa un ejercicio, el sitio publica la cifra vigente y muestra la anterior, para todos los gobiernos por igual"); no la inventé para este caso, la apliqué.

## Qué no cambié y por qué

`titulo` queda igual: ya dice el hecho llano ("el ejercicio anterior a 2024 fue 2015, nueve años antes") sin usar la palabra `discutible` ni ninguna otra calificación, así que sigue siendo exacto bajo `impreciso`. `grafico.nota` y la nota del punto 2020 en la serie tampoco cambian: ya explican la reexpresión y la cifra original, y esa explicación vale igual para cualquier calificación. No toqué `dato_real`, `fuentes`, `evidencia` ni `revision` (incluido `notas_internas`, que documenta la corrección anterior de `falso` a `discutible` y queda como registro histórico de esa decisión previa).

## Umbral aplicado

Antes de cerrar, me pregunté si aplicaría el mismo criterio con la cifra vigente-vs-original de una empresa pública bajo un gobierno de otro signo. La respuesta es sí: la regla de método ya escrita en este registro ("para todos los gobiernos por igual") es la que uso, y es simétrica por diseño — no depende de a quién beneficia la cifra vigente en un caso puntual, depende de cuál es la cifra oficial hoy.

## Validación

`pnpm validar --inbox inbox/reparaciones/orsi-diez-anos-impreciso-2026-09-07 --red`: 0 errores en esquema, referencias, tiers, fuentes y citas (13 citas, 13 exactas, incluidas las 12 fuentes de `dato_real` que no edité). Los 9 avisos que imprime son de simetría de cobertura por tema a nivel de todo `content/` y no corresponden a este registro.
