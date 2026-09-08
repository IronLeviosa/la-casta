# Razones — corrida 2026-09-08-empresas-ute-serie-historica

Editor: Sonnet (`claude-sonnet-5`), por decisión del mantenedor del 2026-09-07 (regla 14 de
`CLAUDE.md`): ningún subagente corre en Fable sin permiso explícito, y Opus queda reservado para
el crítico. Este archivo documenta cada cambio no trivial sobre el crudo del investigador
(`inbox/empresas/ute/2026-09-08-serie-historica/empresas.yaml`), con referencia a la objeción de
`data/corridas/2026-09-08-empresas-ute-serie-historica/critica.md` cuando corresponde.

## 1. Doble conteo 2007/2008 (objeción 2007.1, bloquea)

Decisión: se mantienen las dos cifras tal como las declara cada balance —$ 1.541.428.784 en
`transferencias_al_estado` de 2007 y $ 5.631.209.198 en `impuestos_pagados` de 2008— porque cada
una es la que corresponde al ejercicio del balance que la declara, y no hay una regla contable que
diga cuál de las dos "no cuenta". En vez de restar una cifra de otra (que exigiría decidir con qué
criterio, algo que ningún documento resuelve), se documentó la reclasificación por partida doble:
agregué al `nota` de fin de año de 2008 la misma explicación que ya tenía el `nota` de 2007
(Decretos 206/08 y 275/08, con los montos $700.000.000 y $841.428.784), y agregué el párrafo
correspondiente en el `resumen`. Un lector que sume los dos campos de esos dos años va a encontrar,
en cualquiera de los dos años, la advertencia de que puede estar contando el mismo dinero dos
veces. Esto sigue la alternativa que la crítica dejó abierta ("cualquiera de las dos sirve; lo que
no puede es publicarse sin decirlo").

## 2. `resumen` extendido a 2003-2025 (objeción L7.b)

Reescribí los párrafos de resultado, tributos, transferencias, deuda y segmentos para cubrir todo
el período, con el mismo nivel de detalle para los años de pérdida (2006, 2008, 2012) que para los
de ganancia. Agregué un párrafo nuevo sobre "qué puso el Estado" (capitalizaciones DIPRODE,
aerogeneradores, OPP y los cuatro movimientos del Fondo de Estabilización Energética 2010-2014,
además del ya publicado de 2020), porque la ficha respondía solo la mitad de la pregunta que el
propio esquema dice que existe para responder (objeción L1). Corregí "Literal D" por "Literal C"
como fuente del desglose de costos por actividad (el D es el de impuestos pagados); es un error que
también está en la versión publicada 2015-2025, y se corrige acá porque el `resumen` es un campo
único para toda la ficha. Agregué un párrafo sobre la ausencia de balances anteriores a 2003, la
Memoria UTE de 1996 (con ruido de OCR) y los indicadores de 1999-2000 no comparables, para que el
lector entienda por qué la serie empieza donde empieza (objeción L2, y pedido explícito del brief).

## 3. `hitos[]`: cuatro entradas nuevas (objeción L7.c y L7.d)

Agregué, en orden cronológico: (a) la mayor pérdida de la serie (2008), sin atribuir causa —el
balance no la da, y la crítica objetó como riesgo legal (2008.2) una versión anterior que sí la
atribuía a la sequía sin fuente—; (b) la Ley 18.719 (artículo 773) que crea el Fondo de
Estabilización Energética a fines de 2010, con el aporte fundacional de UTE (releída con `pnpm
fuente` en IMPO para fechar la promulgación exacta, 27/12/2010, fuente que no estaba en el lote);
(c) el cobro de 2012, el mayor movimiento de la serie; y (d) los aportes de 2013 y 2014, combinados
en un solo hito por ser el mismo tipo de evento en años consecutivos (interpretación de "una línea
cada uno" del encargo, aplicada a los cuatro candidatos de `para_el_editor`, no a cada año por
separado). Con esto el Fondo deja de aparecer en la línea de tiempo solo como algo que UTE recibe
(2020): también aparece aportando.

## 4. `concepto` a una oración (objeción 2010.2 y L7.e)

Acorté el `concepto` de `transferencias_al_estado` de 2010 (explícitamente señalado por la
crítica), y también los de `transferencias_al_estado` y `capitalizaciones_del_estado` de 2008 y el
de `transferencias_al_estado` de 2003, que tenían el mismo problema (oraciones unidas por
punto y coma o paréntesis largos) aunque la crítica no los nombró uno por uno. El detalle que saqué
de esos `concepto` no se perdió: quedó en el `nota` de cada año, que ya existía. No re-audité los
44 `concepto` de la serie 2003-2014 uno por uno contra esta regla; es una limitación de tiempo, no
un criterio distinto para unos años que para otros, y queda anotada en `notas_internas`.

## 5. Cita truncada de 2015 ya publicada (pedido explícito del encargo)

Releí `UTE_311215.pdf` con `pnpm fuente` y reemplacé la cita de `impuestos_pagados` de 2015, que
empezaba en "Tasa Tribunal de Cuentas" (mitad de la tabla) por el tramo contiguo completo desde
"IVA 2.992.177.805" hasta "Total 7.155.942.638" —la sección separada, que es la que corresponde al
total ya publicado ($7.155.942.638; hay una tabla consolidada distinta, con total $7.174.713.145,
que no es la que usa este registro—. Esto toca contenido ya publicado (2015-2025), fuera del rango
2003-2014 que pedía el brief, así que va en la corrección pública (ver más abajo), no como edición
silenciosa.

## 6. Informe de auditoría ausente en 2005 y 2006 (objeción 2005.2, aviso)

Confirmé con `pnpm fuente` que el PDF de 2006 tampoco tiene "Deloitte" ni "dictamen" en el texto
extraído (la crítica ya lo había confirmado para 2005). Agregué una oración a la `nota` de cada uno
de los dos años. No cambia el tier: es información sobre la forma del documento publicado, no sobre
las cifras.

## 7. Corrección de una cita mal atribuida del crudo (no señalada por la crítica)

Al correr `pnpm validar --inbox --red` aparecieron dos errores de cita en `finanzas[2009]`
(similitud 0.67): la cita de `capitalizaciones_del_estado` y una de las dos fuentes de
`transferencias_al_estado` citaban "Aporte de capital $2.774.718" como parte del Estado de
Evolución del Patrimonio *individual*, pero esa línea solo existe en la versión *consolidada* del
mismo balance (página 5); la versión individual (página 51, sin el sufijo "CONSOLIDADO" en su
título) solo trae "Capitalización obras DIPRODE $42.446.359" para los movimientos de 2009. Esto es
el mismo tipo de error de individual/consolidado que la crítica señaló en general (objeción 2009.2,
sobre la deuda financiera), aplicado a un campo distinto que la crítica no llegó a revisar. Bajé
`capitalizaciones_del_estado` de 2009 de $45,2 M / USD 2,3 M a $42,4 M / USD 2,2 M (solo DIPRODE),
corregí el `concepto` y la `cita` de ambos lugares, y ajusté la mención en el `resumen`. Verificado
con `pnpm validar --red`: 0 errores de cita después del cambio.

## Cambios de forma

- Reflow de líneas en `concepto` y `nota` al acortarlos (ver puntos 1 y 4); no cambia contenido.
- Ningún otro cambio de forma sobre el crudo del investigador.

## Tier

`publicado`. Las nueve objeciones `bloquea` de la crítica quedan resueltas (2007.1, 2008.1, 2008.2,
2009.3, 2010.1, 2012.1, L1, L2, L3); las 17 `corregir` también, con la única excepción declarada de
L4 (deuda financiera con tres convenciones distintas en la serie, no homogeneizada, con la brecha
explicada en la `nota` de 2008 y en el `resumen` — la propia crítica dejó esto como alternativa
válida a la homogeneización completa). `pnpm validar --inbox --red` pasa sin errores (0 errores de
esquema, referencias, fuentes ni citas; 10 avisos, todos preexistentes o de simetría general del
repositorio, ninguno introducido por esta corrida). El `revision.notas_internas` del registro deja
constancia de los pendientes heredados de la corrida 2026-09-07 (asimetría de fuentes del
monopolio, comparativo regional de UTE no incorporado, deuda 2015-2016 con notas mixtas, sin
`impuestos_pagados` de 2018, sin dato de 2017, sin `imagenes[]`) y de los nuevos de esta corrida
(capitalizaciones sin datos en 2003-2006 y 2010, deuda no homogeneizada, `concepto` no reauditado
por completo, dependencia de un solo publicador salvo la fuente de IMPO agregada para el hito del
Fondo).

## Texto propuesto para la corrección pública

Esta corrida modifica un registro ya publicado (`content/empresas/ute.yaml`), así que corresponde
`pnpm promover --correccion`, con un registro previo en `content/correcciones/` (objeción L9, y
regla del proyecto: "un registro publicado no cambia sin una pieza pública que lo explique"). No
escribo yo ese archivo —no es parte de lo que este rol edita—, pero dejo el contenido para que
`/revisar` lo arme:

```yaml
id: 2026-09-empresas-ute-serie-historica
tipo: contexto_omitido
fecha: 2026-09-08
motivo: >-
  La ficha de UTE solo tenía datos financieros desde 2015. Se agregaron los ejercicios 2003 a 2014
  (con capitalizaciones del Estado en siete de esos once años y los movimientos del Fondo de
  Estabilización Energética 2010-2014), y se extendieron el resumen y la línea de tiempo para
  cubrir todo el período con el mismo criterio que ya se aplicaba a 2015-2025.
cambios:
  - Se agregaron once años a `finanzas[]` (2003 parcial, 2004-2014 completos), cada uno con su
    fuente en los estados contables auditados de UTE.
  - Se agregaron cuatro hitos a la línea de tiempo: la mayor pérdida de la serie (2008), la
    creación del Fondo de Estabilización Energética con el aporte fundacional de UTE (2010), el
    mayor cobro del mismo fondo (2012) y los aportes de 2013-2014.
  - Se reescribió el `resumen` para cubrir 2003-2025 en vez de solo 2015-2025, con un párrafo nuevo
    sobre las capitalizaciones del Estado a UTE.
  - Se corrigió, dentro de contenido ya publicado (2015-2025): la cita de `impuestos_pagados` de
    2015 (estaba truncada, no incluía el desglose completo del Literal D) y la referencia a
    "Literal D" en el resumen, que debía decir "Literal C", como fuente del desglose de costos por
    actividad.
afecta:
  - content/empresas/ute.yaml
agrega: []
```

## Objeciones de la crítica que quedan sin resolver

- **2005.2 / informe de auditoría en PDF de 2005-2006**: documentado como `nota`, no resuelto en el
  sentido de conseguir el dictamen faltante (no existe uno digitalizado, según la búsqueda hecha).
- **L4 / deuda financiera con tres convenciones**: aceptado como la alternativa que la propia
  crítica dejó abierta; no homogeneizado.
- **L8 / dependencia de un solo publicador**: aviso, no acción requerida (la regla de dos grupos es
  para evidencia `reportado`, no para documento oficial).
