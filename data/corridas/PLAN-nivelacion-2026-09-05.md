# Plan: nivelar los tres temas de economía y transparencia en los cinco presidentes

Decidido el 5 de setiembre de 2026. Este archivo es el encargo; cada corrida que salga de acá lo
referencia.

## Por qué

Dos cosas que se juntan.

**Procedencia.** Dos corridas del 4 de setiembre sobre Orsi tienen siete hashes de instrucciones que
no existen en ningún commit (ver `procedencia-incompleta.md` en cada una). Rehacerlas cierra ese
agujero, pero rehacer solo esas dos dejaría a Orsi con material producido bajo reglas mejores que
las de los demás. Por eso se rehacen todas, no dos.

**Cobertura.** Hoy los tres temas existen solo para Lacalle Pou y Orsi:

| presidente | economía/combustibles | economía/impuestos | transparencia-corrupción |
|---|---|---|---|
| Batlle | — | — | — |
| Vázquez | — | — | — |
| Mujica | — | — | — |
| Lacalle Pou | sí | sí | sí |
| Orsi | sí | sí | sí |

El validador ya lo marca como cobertura desigual. Un sitio que documenta a dos presidentes en
impuestos y a tres no, sobre un tema en el que los cinco gobernaron, no está midiendo a los cinco
con la misma vara aunque cada registro individual esté bien.

## Alcance

15 lotes: 5 presidentes × 3 temas. De esos:

- **6 se rehacen** (Lacalle Pou y Orsi × 3 temas). Ya existen, con 89 registros publicados.
- **3 tienen brief y nunca se ejecutaron** (Vázquez × 3 temas). Los briefs están en
  `data/corridas/2026-09-04-vazquez-*/brief.md`.
- **6 no existen** (Mujica y Batlle × 3 temas). Hay que escribir el brief con `pnpm brief`.

## Reglas nuevas que aplican y que antes no existían

Esto es lo que hace que valga la pena rehacer:

1. **Cita literal y contigua.** Nada de coser dos fragmentos con puntos suspensivos.
2. **La cita tiene que decir lo que se le hace decir.** Aparecieron cuatro casos reales: una nota
   que el mismo día llamaba a la persona "el actual embajador" usada para cerrar su mandato, una que
   decía "anunció que renunciará" usada para probar la renuncia, un diario de sesiones que listaba a
   la persona ausente citado como prueba de asistencia. El validador ahora avisa cuando la cita que
   cierra un mandato habla en presente o futuro.
3. **Colección `discrepancias`**: cuando al releer una fuente el crítico encuentra que lo publicado
   no coincide con el documento original, lo registra.
4. **Flujo de correcciones**: un registro publicado solo cambia por `content/correcciones/`.
5. **Fechas parciales**: `desde` y `hasta` aceptan año o mes cuando la fuente no da el día.
6. **`promover` se niega** si hay instrucciones sin commitear. Sin `--forzar`.

## Protocolo

**Los 6 que se rehacen van en un worktree aparte, no en `content/`.** Es la única forma de medir si
las reglas nuevas mejoran el resultado: si se escribe encima, se pierde el término de comparación.

    pnpm experimento crear --corrida <ids>     # arma el worktree
    # ... correr los 6 lotes ahí ...
    pnpm comparar . <ruta-del-worktree> --corrida <id>

`pnpm comparar` da cobertura, kappa de tier, de giros y de promesas, mezcla de tipos de fuente, y la
lista de registros a adjudicar a ciegas. **Usar el mismo brief que la corrida original**: si cambia
el brief, la comparación no mide las reglas, mide el encargo.

**Los 9 nuevos van directo sobre `main`**: no hay nada contra qué comparar.

**Orden sugerido**, de menor a mayor riesgo:

1. Los 3 de Vázquez, que ya tienen brief. Cobertura pura, sin comparación.
2. Los 6 de Mujica y Batlle, escribiendo brief nuevo con `pnpm brief`.
3. Los 6 que se rehacen, en el worktree, con comparación.

Así, si algo sale mal en el paso 3, los 9 primeros ya están y son ganancia neta.

**Qué se publica después de comparar.** No está decidido de antemano a propósito. Si la versión
nueva encuentra lo mismo con mejor evidencia, se promueve por corrección y se retira la vieja. Si
encuentra menos, hay que mirar registro por registro si lo que desapareció era débil o si es un
retroceso. Si encuentra cosas distintas, eso es el hallazgo más interesante y merece su propia
página.

## Lo que no hay que dar por sentado

**Que va a quedar "mejor" no está probado, es la hipótesis que esto mide.** Lo más probable es que
los lotes nuevos sean **más chicos**: las reglas nuevas rechazan material que las viejas aceptaban.
Menos registros con mejor evidencia no es peor, pero va a verse como menos.

## Reglas de siempre

- **Brazo barato**: todo subagente en Sonnet o Haiku. Nunca Opus ni Fable, nunca heredando el modelo
  del chat. Cada agente deja dicho en su informe que corrió en el brazo barato por instrucción del
  encargo.
- Cada lote pasa por investigador, crítico y editor. No saltear al crítico.
- Promover en orden cuando un lote toma como base un registro de otro sin promover, y rebasar sobre
  lo publicado antes de aplicar.
- No investigar casos judiciales salvo que el brief lo pida.
